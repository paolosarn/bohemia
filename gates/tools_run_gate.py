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

# ---- 4. THE HERO BANK IS REPRODUCIBLE FROM ITS SOURCE -----------------------
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
DOSS = 'records/BOHEMIA_DISTRICT_HERO_DOSSIER.md'
before = {p: open(p, 'rb').read() for p in (BANK, DOSS) if os.path.exists(p)}
ok('the hero bank exists to be checked', BANK in before)

if BANK in before:
    env = dict(os.environ)
    env.setdefault('BOHEMIA_SCRATCH', '/tmp')
    dump = subprocess.run(['node', 'tools/bohemia_district_grid_dump.js'],
                          capture_output=True, text=True, env=env)
    ok('the district grid dump runs (the factory reads its output)',
       dump.returncode == 0, (dump.stderr or '').strip().split('\n')[-1][:140])

    run = subprocess.run(['python3', 'tools/bohemia_district_hero_factory.py'],
                         capture_output=True, text=True, env=env)
    ok('THE HERO FACTORY ACTUALLY RUNS (this is the check that was missing)',
       run.returncode == 0, (run.stderr or '').strip().split('\n')[-1][:200])

    after = open(BANK, 'rb').read()
    same = after == before[BANK]
    ok('THE BANK IS REPRODUCIBLE: re-running the factory produces the committed bank '
       'byte for byte (no drift between the art and the source that makes it)', same,
       'bank changed on a clean re-run -- either the committed bank was hand-edited, '
       'or the factory no longer builds what is banked')

    # restore, always: the gate must never mutate the tree it is checking
    for p, b in before.items():
        open(p, 'wb').write(b)
    ok('the gate restored every file it touched',
       all(open(p, 'rb').read() == b for p, b in before.items()))

print('TOOLS RUN GATE: %d passed, %d failed  (%d tools, %d gates parsed)'
      % (passed, failed, len(pys) + len(jss), len(gp) + len(gj)))
sys.exit(1 if failed else 0)
