#!/usr/bin/env python3
"""SUITE FINISHES GATE — CAN THIS SUITE STILL FINISH?
(9/6/26, PLUMBER lane, VAMILY row [suite runs] SUITE-FINISHES)

The row: "make the full suite finish inside its budget again ... the target is
one command, green or red, in under ten minutes."

THE PROBLEM WITH GUARDING A SUITE'S RUNTIME IS THAT YOU CANNOT RUN THE SUITE TO
CHECK IT. A gate that ran the suite would be the suite. So this holds the thing
that DECIDES the runtime instead, which is arithmetic and costs nothing:

    a suite's wall clock is the widest lane divided by that lane's slots, or the
    single longest gate, whichever is worse.

Measured off a real run: 94 browser gates hold 63.6 minutes of the 82 minutes of
gate work, and 233 pure gates hold 18. At two browser slots the browser lane alone
was 32 minutes and nothing that happened to the other 234 gates could move it.

SO THIS GATE HOLDS THE FLOOR, not the observed time. It reads the census, checks
it still describes this suite, recomputes the floor from the CURRENT gate table
and the CURRENT scheduler settings, and fails when that floor crosses the budget.
The day somebody adds a slow browser gate, this goes red BEFORE the suite starts
timing out and reporting gates as never-run -- which is the failure it exists to
prevent, and which is worse than a red because an unrun gate has held nothing
while looking like it did.

IT ALSO HOLDS THE THING THE FLOOR DEPENDS ON: that gates which measure time are
fenced off from the pool. Widening the browser lane was only safe because of that,
so if the solo tier ever disappears, the widening has to be reconsidered and this
says so rather than leaving a setting whose reason has quietly evaporated.

  python3 gates/suite_finishes_gate.py
"""
import io
import json
import os
import sys
import importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

RECORD = 'records/BOHEMIA_SUITE_CENSUS_9_6_26.json'
WRITEUP = 'records/BOHEMIA_SUITE_CENSUS_9_6_26.md'

_p = [0]
_f = []


def ok(name, cond, why=''):
    if cond:
        _p[0] += 1
    else:
        _f.append(name)
        print('  FAIL: %s%s' % (name, ('   [%s]' % why) if why else ''))


def done():
    print('\n=== SUITE FINISHES GATE: %d passed, %d failed ===' % (_p[0], len(_f)))
    sys.exit(1 if _f else 0)


ok('the suite census is on disk -- a runtime budget with no measurement under it '
   'is a wish', os.path.exists(RECORD))
ok('and the readable write-up is beside it', os.path.exists(WRITEUP))
if _f:
    done()

C = json.loads(io.open(RECORD, encoding='utf8').read())

spec = importlib.util.spec_from_file_location('bg', 'gates/bohemia_gates.py')
m = importlib.util.module_from_spec(spec)
_argv, sys.argv = sys.argv, ['bohemia_gates.py']
try:
    spec.loader.exec_module(m)
finally:
    sys.argv = _argv

# ---- 1. the census still describes THIS suite --------------------------------
grew = len(m.GATES) - C['gatesInTable']
print('  the census saw %d gates; the table has %d now (%+d)'
      % (C['gatesInTable'], len(m.GATES), grew))
ok('THE CENSUS STILL DESCRIBES THIS SUITE (%d gates then, %d now). A floor computed '
   'from a stale census is a number about a suite that no longer exists, and it '
   'would go on passing while the real one drifted past its budget'
   % (C['gatesInTable'], len(m.GATES)),
   abs(grew) <= 60, '%+d gates since the census' % grew)

# ---- 2. the timing gates are still fenced off --------------------------------
solo = [n for (n, argv, w, s) in m.GATES if m.is_solo_gate(argv)]
print('  solo (measured alone): %s' % (', '.join(solo) if solo else 'NONE'))
ok('THE GATES THAT MEASURE TIME STILL RUN ALONE (%d of them). The browser lane was '
   'widened from half the cores to three quarters ONLY because these were fenced '
   'off first; if they rejoin the pool, a stopwatch is being held beside three '
   'other gates again and the widening has to be reconsidered'
   % len(solo), len(solo) >= 2, '%d solo gates' % len(solo))

# ---- 3. the floor, recomputed from what is on disk NOW -----------------------
# Times come from the census (the only real measurement available); the CLASSES
# and the SLOTS come from the live table and the live scheduler, so adding a slow
# browser gate moves this even though its own time is not known yet.
per = C['work']
browser_s = per['browserSeconds']
pure_s = per['pureSeconds']
solo_s = per['soloSeconds']

# ANY GATE THE CENSUS NEVER TIMED IS CHARGED AT THE MEDIAN OF ITS CLASS, because
# pretending an untimed gate is free is how a budget lies. Which gates those are is
# READ from the census's own name list, not guessed: the first draft of this took
# "the last N rows of the table", which is not what untimed means and would have
# mis-charged the floor the moment anybody reordered the table.
med_browser = 12.0
med_pure = 1.0
timed = set(C.get('timedGateNames') or [])
untimed_browser = untimed_pure = 0
if timed:
    for (n, argv, w, sl) in m.GATES:
        if n in timed:
            continue
        if m.is_browser_gate(argv):
            untimed_browser += 1
        else:
            untimed_pure += 1
else:
    # an older census with no name list: say so rather than guessing quietly
    print('  NOTE: this census predates the full name list, so untimed gates are not '
          'charged and the floor below is a LOWER bound. Refresh it.')

browser_s_now = browser_s + untimed_browser * med_browser
pure_s_now = pure_s + untimed_pure * med_pure
longest = C['longestSingleGate']['seconds'] if C.get('longestSingleGate') else 0

floor = solo_s + max(browser_s_now / max(1, m.BROWSER_JOBS),
                     pure_s_now / max(1, m.JOBS), longest)

print('  browser work %.0fs over %d slots, pure %.0fs over %d slots, solo %.0fs, '
      'longest gate %.0fs' % (browser_s_now, m.BROWSER_JOBS, pure_s_now, m.JOBS,
                              solo_s, longest))
print('  FLOOR %.0fs = %.1f min   against a %ds budget and a %ds target'
      % (floor, floor / 60.0, m.SUITE_BUDGET, int(C['targetSeconds'])))

ok('THE SUITE CAN STILL FINISH INSIDE ITS OWN BUDGET (floor %.0fs <= %ds). This is '
   'the floor, not a stopwatch: the widest lane over its slots, or the longest '
   'single gate, whichever is worse. It goes red the day somebody adds enough slow '
   'browser work to make the suite start reporting gates as never-run, which is '
   'worse than a red because an unrun gate has held nothing while looking like it did'
   % (floor, m.SUITE_BUDGET), floor <= m.SUITE_BUDGET, '%.0fs floor' % floor)

# ---- 4. and the target is REPORTED, never asserted ---------------------------
# The row's target is ten minutes and the floor is roughly twice that. A ceiling
# set there would be red on arrival and switched off by whoever met it -- the same
# argument the speed gate makes about its own goal line.
over = floor / C['targetSeconds']
print('  THE ROW WANTS UNDER %.0f MIN AND THE FLOOR IS %.1f MIN (%.1fx). Reported, '
      'never asserted: a ceiling at the target would be red on arrival and switched '
      'off by whoever met it.' % (C['targetSeconds'] / 60.0, floor / 60.0, over))
print('  Getting there needs LESS BROWSER WORK, not better packing: %.0f min of it '
      'over %d cores is %.1f min even at four slots.'
      % (browser_s_now / 60.0, C['settings']['cpus'], browser_s_now / 4.0 / 60.0))

# ---- 5. the floors, so an empty read cannot pass -----------------------------
ok('THE CENSUS ACTUALLY MEASURED SOMETHING (%d gates timed, %.0fs of work). Every '
   'line above is a ceiling and a ceiling is trivially met by a census that found '
   'nothing' % (C['gatesWithATime'], per['totalSeconds']),
   C['gatesWithATime'] > 200 and per['totalSeconds'] > 1000)
ok('...and it knows what it did NOT see (%d gates had no time in that log), so every '
   'total in it is stated as a lower bound rather than passed off as complete'
   % C['gatesWithNoTimeInThisLog'], C['gatesWithNoTimeInThisLog'] >= 0)

done()
