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

# 7/26 HOLE CLOSED (Paolo: "you're not using a single one of them"). The sweep
# was *_factory.py / *_cook*.py only, on the assumption that those are the files
# that make pixels. They are not the only ones: a *_patch.py that injects canvas
# drawing code into the alpha paints just as many pixels, and one of them shipped
# floors and walls as flat hex fills while 9,127 judged tiles sat unused in the
# same file. Any tool that DRAWS answers to the law, whatever it is named.
DRAWS = re.compile(r'fillRect|drawImage|fillStyle|createImageData|putImageData')
patchers = [f for f in glob.glob('tools/*_patch.py') if DRAWS.search(open(f, encoding='utf8').read())]
# 8/16 HOLE CLOSED (found by the ART lane checking its own cook was swept and
# finding SILENCE): the glob was tools/*_cook*.py, top level only, so the
# entire tools/tfcook/ directory - fourteen family cooks and every volume
# cook, the single biggest pixel-making population in the repo - was NEVER
# swept. A green gate over an unswept file is worse than no gate. Recursive
# now: any *_cook*.py or *_factory.py anywhere under tools/ answers the law.
files = sorted(set(glob.glob('tools/**/*_factory.py', recursive=True))
             | set(glob.glob('tools/**/*_cook*.py', recursive=True))
             | set(patchers))
check('art-cooking tools found', len(files) > 0, '%d' % len(files))
check('drawing patch tools are swept too (the 7/26 hole)', len(patchers) > 0, '%d' % len(patchers))

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
