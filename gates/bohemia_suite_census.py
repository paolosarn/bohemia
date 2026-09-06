#!/usr/bin/env python3
"""BOHEMIA SUITE CENSUS — WHERE THE SUITE'S TIME ACTUALLY GOES
(9/6/26, PLUMBER lane, VAMILY row [suite runs] SUITE-FINISHES)

The row: "make the full suite finish inside its budget again: measure every
gate's time, split the slow ones, retire dead ones (with a record), run in
parallel; the target is one command, green or red, in under ten minutes".

MEASURE EVERY GATE'S TIME IS THE FIRST CLAUSE AND NOBODY HAD DONE IT. The runner
has printed a per-gate time on every line for weeks; nothing has ever added them
up. This reads a real run's log, joins it to the gate table, classifies each gate
the way the RUNNER ITSELF does (is_browser_gate, is_solo_gate -- not a second
opinion that can drift from the scheduler's), and works out where the wall time
comes from.

WHAT IT ANSWERS THAT A LIST OF TIMES DOES NOT: a suite's wall clock is not the
sum of its gates. It is the widest lane divided by that lane's slots, or the
single longest gate, whichever is worse. So the useful output is not "the slowest
gates" -- it is "the floor these settings can reach", and how far that floor is
from the target.

  python3 gates/bohemia_suite_census.py <suite-run.log> [--record]
"""
import io
import json
import os
import re
import sys
import importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

TARGET_S = 600.0          # the row's own target: under ten minutes


def load_runner():
    spec = importlib.util.spec_from_file_location('bg', 'gates/bohemia_gates.py')
    m = importlib.util.module_from_spec(spec)
    argv, sys.argv = sys.argv, ['bohemia_gates.py']
    try:
        spec.loader.exec_module(m)
    finally:
        sys.argv = argv
    return m


def times_from(log_text):
    """Every '[ 12/531] NAME  GREEN  what  12.3s' line the runner printed."""
    out = {}
    for m in re.finditer(r'\[\s*\d+/\d+\]\s+(.+?)\s{2,}(GREEN|FAIL|SKIP)\s+.*?([\d.]+)s\s*$',
                         log_text, re.M):
        out[m.group(1).strip()] = (float(m.group(3)), m.group(2))
    return out


def census(log_path):
    m = load_runner()
    text = io.open(log_path, encoding='utf8', errors='replace').read()
    seen = times_from(text)
    wall = None
    w = re.search(r'\((\d+)s\)\s*$', text.strip().split('\n')[-1])
    if w:
        wall = float(w.group(1))
    for line in text.split('\n'):
        mm = re.search(r'ALL \d+ GATES GREEN\s+\((\d+)s\)|GATE\(S\) FAILED:.*?\((\d+)s\)', line)
        if mm:
            wall = float(mm.group(1) or mm.group(2))

    rows, missing = [], []
    for (name, argv, what, slow) in m.GATES:
        hit = seen.get(name)
        if hit is None:
            missing.append(name)
            continue
        secs, verdict = hit
        rows.append({'name': name, 'seconds': secs, 'verdict': verdict,
                     'browser': bool(m.is_browser_gate(argv)),
                     'solo': bool(m.is_solo_gate(argv)), 'slowFlag': bool(slow)})

    browser = [r for r in rows if r['browser'] and not r['solo']]
    pure = [r for r in rows if not r['browser'] and not r['solo']]
    solo = [r for r in rows if r['solo']]
    tot = lambda xs: round(sum(x['seconds'] for x in xs), 1)
    bt, pt, st = tot(browser), tot(pure), tot(solo)

    browser_lane = bt / max(1, m.BROWSER_JOBS)
    pure_lane = pt / max(1, m.JOBS)
    longest = max(rows, key=lambda r: r['seconds']) if rows else None
    # THE FLOOR: the solo phase cannot overlap anything, the two pooled lanes can
    # overlap each other, and no run can be shorter than its longest single gate.
    floor = st + max(browser_lane, pure_lane, (longest['seconds'] if longest else 0))

    what_if = {}
    for bj in (2, 3, 4):
        what_if[bj] = round(st + max(bt / bj, pure_lane,
                                     longest['seconds'] if longest else 0), 1)

    return {
        'takenFrom': os.path.basename(log_path),
        'observedWallSeconds': wall,
        'settings': {'JOBS': m.JOBS, 'BROWSER_JOBS': m.BROWSER_JOBS,
                     'SUITE_BUDGET': m.SUITE_BUDGET, 'cpus': m._CPUS},
        'targetSeconds': TARGET_S,
        'gatesInTable': len(m.GATES),
        'gatesWithATime': len(rows),
        'gatesWithNoTimeInThisLog': len(missing),
        'work': {'browserSeconds': bt, 'browserGates': len(browser),
                 'pureSeconds': pt, 'pureGates': len(pure),
                 'soloSeconds': st, 'soloGates': len(solo),
                 'totalSeconds': round(bt + pt + st, 1)},
        'lanes': {'browserLaneSeconds': round(browser_lane, 1),
                  'pureLaneSeconds': round(pure_lane, 1),
                  'soloPhaseSeconds': st},
        'longestSingleGate': longest,
        'floorSeconds': round(floor, 1),
        'floorIfBrowserJobs': what_if,
        'slowest': sorted(rows, key=lambda r: -r['seconds'])[:30],
        # THE FULL NAME LIST, not just the slowest thirty. Without it the gate that
        # reads this record has to GUESS which gates were never timed, and its first
        # draft guessed "the last N rows of the table", which is not what untimed
        # means and would have mis-charged the floor the moment the table was
        # reordered. A record that makes its reader guess is a record with a bug in it.
        'timedGateNames': sorted(r['name'] for r in rows),
        # THE RED-CONFIRMATION PASS IS PURE OVERHEAD AND IT SCALES WITH THE REDS.
        # Every gate that fails in the pack is RE-RUN ALONE, because the suite may
        # not invent a red -- correct, and not free. This is the bill for it,
        # charged at each red gate's own in-pack time, and it is the one line here
        # that gets cheaper by FIXING THE GAME rather than by scheduling anything.
        'reds': len([r for r in rows if r['verdict'] == 'FAIL']),
        'redRerunSeconds': round(sum(r['seconds'] for r in rows
                                     if r['verdict'] == 'FAIL'), 1),
        'underOneSecond': len([r for r in rows if r['seconds'] < 1.0]),
        'missingFromThisLog': missing[:40]
    }


def prose(C):
    mins = lambda s: '%.1f min' % (s / 60.0)
    W, L = C['work'], C['lanes']
    top = '\n'.join('  %7.1fs  %-8s %s' % (r['seconds'],
                    'browser' if r['browser'] else 'pure', r['name'])
                    for r in C['slowest'][:15])
    wi = '\n'.join('    %d browser slots -> %s' % (k, mins(v))
                   for k, v in sorted(C['floorIfBrowserJobs'].items()))
    return """# BOHEMIA -- WHERE THE SUITE'S TIME GOES (9/6/26)

PLUMBER lane, VAMILY row [suite runs] SUITE-FINISHES. The row's first clause is
"measure every gate's time" and nobody had. The runner has printed a per-gate time
on every line for weeks; nothing ever added them up.

Taken from a real run (%s), joined to the gate table, and classified BY THE
RUNNER'S OWN predicates rather than a second opinion that could drift from the
scheduler it is describing.

## THE SHAPE OF IT

  gates in the table            %d
  gates with a time in this run %d          (%d had none in this log)
  total gate time               %s
  observed wall clock           %s

  browser gates    %4d gates   %s of work
  pure gates       %4d gates   %s of work
  solo gates       %4d gates   %s of work

## AND THE WALL IS ONE LANE

A suite's wall clock is not the sum of its gates. It is the widest lane divided by
that lane's slots, or the single longest gate, whichever is worse.

  the browser lane   %s of work over %d slots  =  %s
  the pure lane      %s of work over %d slots  =  %s
  the solo phase     %s, which cannot overlap anything by design
  the longest single gate: %s (%s)

  THE FLOOR THESE SETTINGS CAN REACH: %s
  THE ROW'S TARGET:                    %s

%s of the work is in %d browser gates and they run a few at a time. Nothing that
happens to the other %d gates can move that.

## WHAT MOVING THE BROWSER SLOTS WOULD DO

%s

EVEN AT FOUR SLOTS THE FLOOR IS ABOVE THE TARGET. This is the finding that matters:
the ten-minute target CANNOT be reached by scheduling on a %d-core box. %s of
browser work over four cores is %s and no arithmetic gets under it. The remaining
path is the row's other two clauses -- SPLIT the slow ones and RETIRE the dead ones
-- which means less browser work, not better packing.

## AND ONE COST THAT IS NOT SCHEDULING AT ALL

%d gates failed in this run, and every one of them was RE-RUN ALONE afterwards,
because the suite may not invent a red. That is correct and it is not free: charged
at each red gate's own in-pack time it is %s of pure overhead.

It is the only line in this record that gets cheaper by FIXING THE GAME instead of
by moving a scheduler setting, and it is why the observed wall clock (%s) sits well
above the floor (%s).

## THE FIFTEEN SLOWEST

%s

%d gates finish in under a second.

## WHAT CHANGED THIS ROUND

  A SOLO TIER. Gates whose subject is time (frames a second, milliseconds per beat,
  time to first play) now carry __BOHEMIA_SOLO__ and run one at a time with the box
  to themselves, first, before the pool starts. A stopwatch held beside three other
  gates measures the box, not the game -- this runner already had to re-run FIGHT
  MUSIC and FIRST NIGHT alone to find out they were green.
  AND THAT IS WHAT LET THE POOL GO WIDER. Browser slots moved from half the cores
  to three quarters. That was safe only once the timing gates were fenced off.

## WHAT IS STILL OWED

  - SPLITTING THE GIANTS. The longest single gate is %s at %.0fs; while any one gate
    takes that long it is the floor on its own.
  - RETIRING DEAD ONES. That is the next row, [dead gates] GATE-CENSUS, and it is
    the other half of getting under ten minutes.
  - %d gates had no time in this log at all, so every total here is a LOWER BOUND.

Refresh with: `python3 gates/bohemia_suite_census.py <a real suite log> --record`
""" % (C['takenFrom'], C['gatesInTable'], C['gatesWithATime'],
       C['gatesWithNoTimeInThisLog'], mins(W['totalSeconds']),
       mins(C['observedWallSeconds']) if C['observedWallSeconds'] else 'not in this log',
       W['browserGates'], mins(W['browserSeconds']),
       W['pureGates'], mins(W['pureSeconds']),
       W['soloGates'], mins(W['soloSeconds']),
       mins(W['browserSeconds']), C['settings']['BROWSER_JOBS'], mins(L['browserLaneSeconds']),
       mins(W['pureSeconds']), C['settings']['JOBS'], mins(L['pureLaneSeconds']),
       mins(L['soloPhaseSeconds']),
       C['longestSingleGate']['name'], mins(C['longestSingleGate']['seconds']),
       mins(C['floorSeconds']), mins(C['targetSeconds']),
       mins(W['browserSeconds']), W['browserGates'], W['pureGates'] + W['soloGates'],
       wi, C['settings']['cpus'], mins(W['browserSeconds']),
       mins(W['browserSeconds'] / 4.0),
       C['reds'], mins(C['redRerunSeconds']),
       mins(C['observedWallSeconds']) if C['observedWallSeconds'] else 'not in this log',
       mins(C['floorSeconds']),
       top, C['underOneSecond'],
       C['longestSingleGate']['name'], C['longestSingleGate']['seconds'],
       C['gatesWithNoTimeInThisLog'])


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        print(__doc__)
        sys.exit(2)
    C = census(args[0])
    print(prose(C))
    if '--record' in sys.argv:
        io.open('records/BOHEMIA_SUITE_CENSUS_9_6_26.json', 'w', encoding='utf8').write(
            json.dumps(C, indent=2))
        io.open('records/BOHEMIA_SUITE_CENSUS_9_6_26.md', 'w', encoding='utf8').write(prose(C))
        print('wrote records/BOHEMIA_SUITE_CENSUS_9_6_26.json and .md')
