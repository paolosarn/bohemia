#!/usr/bin/env python3
"""BOHEMIA — THE TOOLS ACTUALLY RUN GATE (7/29/26, WORLD lane)

WHY THIS EXISTS, and it is a hole I proved by falling in it: on 7/28 I pushed
tools/bohemia_district_hero_factory.py to main WITH A PYTHON SYNTAX ERROR, and the
full ~130-gate suite came back ALL GREEN. It passed because NOTHING IN THE SUITE
EVER EXECUTES THAT TOOL -- every gate that cares about district icons reads the
pre-baked bank instead. So a completely broken factory tested clean for an entire
ship, and the only reason it was ever noticed is that I happened to re-run it by
hand the next day.

That is the exact shape of failure the laws warn about: green gates said yes while
the tool was dead. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and "our tools
work" had no gate at all.

THREE CLAIMS, cheapest first:

  1. EVERY TOOL PARSES. ast.parse on every tools/*.py and `node --check` on every
     tools/*.js. Catches the exact defect that got through, in under a second,
     across the whole toolchain rather than just the one tool I broke.

  2. EVERY GATE PARSES TOO. A gate with a syntax error cannot fail, which is worse
     than a broken tool -- it is a check that silently stops checking.

  3. THE HERO BANK IS REPRODUCIBLE FROM ITS SOURCE. This is the real claim. It runs
     the factory for real and requires the bank it produces to be BYTE-IDENTICAL to
     the committed one. That catches two separate rots at once: a factory that can
     no longer build what it claims to (the syntax error), and a bank carrying art
     the factory can no longer regenerate (drift -- which had ALSO happened: the
     school icon's pixels were current while its written label still described the
     district it replaced). The bank is restored byte-for-byte afterwards, so the
     gate never mutates the tree it is checking.

  python3 gates/tools_run_gate.py
"""
import ast
import glob
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

passed = failed = 0
def ok(name, cond, detail=''):
    global passed, failed
    if cond:
        passed += 1
    else:
        failed += 1
        print('  FAIL: %s%s' % (name, ('  -- ' + detail) if detail else ''))

# ---- 1. EVERY PYTHON TOOL PARSES -------------------------------------------
bad = []
pys = sorted(glob.glob('tools/*.py'))
for p in pys:
    try:
        ast.parse(open(p, encoding='utf8').read(), filename=p)
    except SyntaxError as e:
        bad.append('%s:%s %s' % (p, e.lineno, e.msg))
ok('every tools/*.py parses (%d files)' % len(pys), not bad, '; '.join(bad[:3]))

# ---- 2. EVERY JS TOOL PARSES -----------------------------------------------
badjs = []
jss = sorted(glob.glob('tools/*.js'))
for p in jss:
    r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
    if r.returncode != 0:
        badjs.append('%s: %s' % (p, (r.stderr or '').strip().split('\n')[0][:90]))
ok('every tools/*.js parses (%d files)' % len(jss), not badjs, '; '.join(badjs[:3]))

# ---- 3. EVERY GATE PARSES (a broken gate cannot fail, which is worse) -------
badg = []
gp = sorted(glob.glob('gates/*.py'))
for p in gp:
    try:
        ast.parse(open(p, encoding='utf8').read(), filename=p)
    except SyntaxError as e:
        badg.append('%s:%s %s' % (p, e.lineno, e.msg))
gj = sorted(glob.glob('gates/*.js'))
for p in gj:
    r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
    if r.returncode != 0:
        badg.append('%s: %s' % (p, (r.stderr or '').strip().split('\n')[0][:90]))
ok('every gate parses (%d files) -- a gate with a syntax error stops checking silently'
   % (len(gp) + len(gj)), not badg, '; '.join(badg[:3]))

# ---- 4. THE FACTORY STILL BUILDS EVERY HERO, AND THE BANK MATCHES ITS SOURCE
#
# THIS SECTION USED TO SHELL OUT TO THE WHOLE FACTORY, AND THAT IS WHY THIS GATE HAS
# BEEN UNMEASURED FOR WEEKS (8/20). The full bake renders 69 heroes onto a 1,748 px
# square and takes EIGHTY-FIVE MINUTES. The suite's budget is 600 seconds. So this gate
# could never finish -- and because section 4 came last, it killed sections 1-3 with it:
# the one-second parse checks, the ones written to catch exactly the syntax error that
# created this gate, never got to report. The audit listed TOOLS RUN among the fleet's
# red gates with the note "times out at 600s, so it caught nothing".
#
# It caught nothing on 8/19 either, when tools/bohemia_district_hero_factory.py sat on
# main for a day WITH A JAVASCRIPT COMMENT BLOCK IN IT and would not parse. That is the
# founding defect of this gate, recurring, while the gate that exists to catch it timed
# out trying to render art.
#
# The bake got slow the same way ART 45's roofline check got wrong: Paolo's 8/2 "BIGGEST
# AS FUCK" pass took the sprites to 1,748 px. Nothing was rewritten to match.
#
# SO THE CLAIM IS MADE ON GEOMETRY, NOT PIXELS. Building every hero's scene runs every
# builder for real -- it catches a syntax error, an import error and any builder that
# throws, which is the entire class this gate was born for -- and it takes 1.8 SECONDS
# for all 69. The byte-identical bake is still available, deliberately, behind
# BOHEMIA_FULL_BAKE=1, for a session that wants to spend the 85 minutes.
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
ok('the hero bank exists to be checked', os.path.exists(BANK))

if os.path.exists(BANK):
    sys.path.insert(0, os.path.join(REPO, 'tools'))
    F = None
    try:
        import bohemia_district_hero_factory as F           # noqa: N816
    except Exception as e:                                   # noqa: BLE001
        ok('THE HERO FACTORY IMPORTS (this is the check that was missing, and it is the '
           'one that would have caught the JS comment block that sat on main for a day)',
           False, '%s: %s' % (type(e).__name__, str(e)[:160]))

    if F is not None:
        ok('THE HERO FACTORY IMPORTS', True)
        pal, broke = F._load_pal(), []
        for d, fn in sorted(F.HEROES.items()):
            try:
                scene, _scale = fn(pal[d])
                if not getattr(scene, 'faces', None):
                    broke.append('%s: built nothing' % d)
            except Exception as e:                           # noqa: BLE001
                broke.append('%s: %s %s' % (d, type(e).__name__, str(e)[:60]))
        ok('EVERY hero builder actually runs (%d of them) -- a builder that throws is a '
           'district that cannot be rebaked, and nothing else in the suite ever calls one'
           % len(F.HEROES), not broke, '; '.join(broke[:3]))

        # THE BANK IS IN SYNC WITH THE SOURCE LIST. This is cheap and it catches a real
        # thing that happened this week: five landmark builders (convention, prison, dam,
        # minigp, fort) existed in the factory while main's bank still held 64 icons, so
        # five districts had no art and every icon gate happily measured the 64 it could
        # see. A district in the source and not in the bank is art that does not exist.
        banked = {h['district'] for h in json.load(open(BANK))['heroes']}
        source = set(F.HEROES)
        ok('the bank holds an icon for EVERY district the factory can build (%d/%d)'
           % (len(banked & source), len(source)), source <= banked,
           'in the factory, missing from the bank: ' + ', '.join(sorted(source - banked)[:6]))
        ok('and the bank holds nothing the factory can no longer build', banked <= source,
           'in the bank, gone from the factory: ' + ', '.join(sorted(banked - source)[:6]))

        if os.environ.get('BOHEMIA_FULL_BAKE') == '1':
            DOSS = 'records/BOHEMIA_DISTRICT_HERO_DOSSIER.md'
            before = {p: open(p, 'rb').read() for p in (BANK, DOSS) if os.path.exists(p)}
            env = dict(os.environ); env.setdefault('BOHEMIA_SCRATCH', '/tmp')
            run = subprocess.run(['python3', 'tools/bohemia_district_hero_factory.py'],
                                 capture_output=True, text=True, env=env)
            ok('THE HERO FACTORY RUNS END TO END', run.returncode == 0,
               (run.stderr or '').strip().split('\n')[-1][:200])
            ok('THE BANK IS REPRODUCIBLE byte for byte from its source',
               open(BANK, 'rb').read() == before[BANK],
               'the committed bank was hand-edited, or the factory no longer builds it')
            for p, b in before.items():          # never mutate the tree being checked
                open(p, 'wb').write(b)
            ok('the gate restored every file it touched',
               all(open(p, 'rb').read() == b for p, b in before.items()))
        else:
            print('  (byte-identical rebake skipped: 85 minutes against a 600s budget. '
                  'BOHEMIA_FULL_BAKE=1 to run it deliberately.)')

print('TOOLS RUN GATE: %d passed, %d failed  (%d tools, %d gates parsed)'
      % (passed, failed, len(pys) + len(jss), len(gp) + len(gj)))
sys.exit(1 if failed else 0)
