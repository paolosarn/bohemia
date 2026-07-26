#!/usr/bin/env python3
"""
BOHEMIA TASTE GATE (7/25/26) — a law without a machine gate is not enforced.

Locks THE PAOLO TASTE CANON (laws/BOHEMIA_PAOLO_TASTE_CANON.md) and its pre-judge
kill filter (tools/bohemia_taste_filter.py):
  1. the canon file EXISTS and carries the required category sections
  2. every NEVER and LIKE line CITES a source ((src: ...)) — an uncited ruling is
     a guess, and this canon is built only from real recorded rulings
  3. every standing factory (tools/*_factory.py, *_cook*.py) documents a TASTE
     CHECK block, the same way REUSE-FIRST requires a REUSE CHECK
  4. the filter's self-test PASSES (the machine actually kills what it must and
     never kills what it must not)

THE LINE: the filter KILLS, never APPROVES. This gate proves the machine exists
and is honest; it does not let anything ship without Paolo's real thumbs.

  python3 gates/taste_gate.py
"""
import glob, os, re, subprocess, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

CANON = 'laws/BOHEMIA_PAOLO_TASTE_CANON.md'
FILTER = 'tools/bohemia_taste_filter.py'
REQUIRED_SECTIONS = ['BUILDINGS', 'DISTRICTS', 'CLOTHING', 'MUSIC', 'ANIMATION', 'PROPS', 'UI COPY']

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  (' + detail + ')') if detail and not ok else ''))


print('=== TASTE GATE ===')

# 1. canon exists + required sections
check('canon file exists', os.path.exists(CANON), CANON)
canon = open(CANON, encoding='utf8').read() if os.path.exists(CANON) else ''
for sec in REQUIRED_SECTIONS:
    check('canon has a %s section' % sec, re.search(r'##.*\b' + re.escape(sec) + r'\b', canon) is not None)

# 2. every NEVER / LIKE rule line cites a source
uncited = []
for i, line in enumerate(canon.splitlines(), 1):
    if ('**NEVER**' in line) or ('**LIKE**' in line):
        if '(src:' not in line:
            uncited.append('line %d: %s' % (i, line.strip()[:70]))
check('every NEVER/LIKE cites a source', not uncited,
      ('%d uncited' % len(uncited)) + (' -> ' + ' | '.join(uncited[:3]) if uncited else ''))
# and there is a real body of rulings, not a stub
rule_count = len(re.findall(r'\*\*(NEVER|LIKE)\*\*', canon))
check('canon carries a real body of rulings (>=40)', rule_count >= 40, '%d found' % rule_count)

# 3. every standing factory documents a TASTE CHECK
factories = sorted(set(glob.glob('tools/*_factory.py')) | set(glob.glob('tools/*_cook*.py')))
check('standing factories found', len(factories) > 0, '%d' % len(factories))
for f in factories:
    src = open(f, encoding='utf8').read()
    check('%s documents a TASTE CHECK' % os.path.basename(f), 'TASTE CHECK' in src)

# 4. the filter exists and its self-test passes
check('taste filter exists', os.path.exists(FILTER), FILTER)
if os.path.exists(FILTER):
    r = subprocess.run([sys.executable, FILTER, '--selftest'], capture_output=True, text=True)
    ok = r.returncode == 0 and 'SELFTEST: PASS' in (r.stdout + r.stderr)
    check('taste filter self-test passes', ok,
          (r.stdout.strip().splitlines() or [''])[-1] if not ok else '')

print('\nTASTE GATE: %d passed, %d failed' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  - ' + f)
    sys.exit(1)
