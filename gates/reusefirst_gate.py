#!/usr/bin/env python3
"""
BOHEMIA REUSE-FIRST GATE (7/22/26) - laws/BOHEMIA_ADDENDUM_REUSE_FIRST_
LOCKED_7_22_26: "check out the approved assets first before cooking" is a
LAW now, and a law without a machine gate is not enforced.

What it locks, for every tools/*_factory.py and tools/*_cook*.py file (the
naming convention this repo's art generators already use):
  - a `REUSE CHECK:` block exists in the module docstring
  - if that block claims a bank was USED, the source actually opens it
    (a real `open('banks/<name>')` call, not just a docstring mention)
Files that only claim "nothing fit" don't need a matching open() call -
the honesty is in the reasoning, which a machine can't grade, only require
exists in writing.

  python3 gates/reusefirst_gate.py
"""
import glob
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  (' + detail + ')') if detail and not ok else ''))


print('=== REUSE-FIRST GATE ===')

files = sorted(set(glob.glob('tools/*_factory.py')) | set(glob.glob('tools/*_cook*.py')))
check('art-cooking tools found', len(files) > 0, '%d' % len(files))

for f in files:
    src = open(f, encoding='utf8').read()
    name = os.path.basename(f)
    m = re.search(r'REUSE CHECK:(.*?)(?:\n\s*\n|"""|\Z)', src, re.S)
    check('%s carries a REUSE CHECK block' % name, bool(m))
    if not m:
        continue
    block = m.group(1)
    used = re.findall(r'used\s+(BOHEMIA_[A-Za-z0-9_]+\.txt)', block, re.I)
    for bank in used:
        # either a literal open('banks/NAME') or a constant assigned that
        # path and opened via the variable (the repo's dominant pattern)
        esc = re.escape(bank)
        literal = re.search(r"open\(\s*['\"]banks/%s['\"]" % esc, src)
        const_def = re.search(r"=\s*['\"]banks/%s['\"]" % esc, src)
        opened = bool(literal or const_def)
        check('%s actually opens claimed bank %s' % (name, bank), opened)

print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)
