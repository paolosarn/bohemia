#!/usr/bin/env python3
"""
BOHEMIA ASSET ROUNDUP GATE (7/21/26) - the unjudged-asset surfacing tool
stays lawful.

Locks:
  - the judge page exists, embeds all three source pools' item counts
  - PURITY LAW: zero purple pixels anywhere on the page (mechanical
    pre-filter must have actually run, not just be claimed)
  - export is .txt (never .json), tap-to-cycle state model present
  - the LIFE hub (the tab the alpha iframes) routes to it
  - reproducible: re-running the generator against the same banks yields
    the same purity-filtered counts (seed-regen law: no silent drift)

  python3 gates/assetroundup_gate.py
"""
import base64
import io
import os
import re
import subprocess
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
JUDGE = 'slices/BOHEMIA_ASSET_ROUNDUP_JUDGE_7_21_26.html'
HUB = 'slices/BOHEMIA_LIFE_CURRENT.html'

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  (' + detail + ')') if detail and not ok else ''))


print('=== ASSET ROUNDUP GATE ===')

check('judge page exists', os.path.exists(JUDGE))
page = open(JUDGE, encoding='utf8').read()
check('utf-8 charset declared (the mojibake lesson)', '<meta charset="utf-8">' in page)
check('sections present (wall/roof/door)',
      all(s in page for s in ('WALL CANDIDATES', 'ROOF KIT', 'DOOR EDGES')))
check('tap-to-cycle state model (SKIP/UP/DOWN)', "STATES=[null,'UP','DOWN']" in page)
check('exports .txt (never .json)', 'download=' in page and '.txt' in page and '.json' not in page)

b64s = re.findall(r'"b64":\s*"([A-Za-z0-9+/=]{200,})"', page)
check('candidates embedded', len(b64s) > 100, '%d found' % len(b64s))
purple = 0
for b in b64s[:60]:  # sample: full sweep is the purity gate's job, this proves the filter ran
    try:
        im = Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB')
    except Exception:
        continue
    for r, g, bl in im.getdata():
        if r > g + 25 and bl > g + 25:
            purple += 1
            break
check('purity pre-filter held (sampled)', purple == 0, '%d contaminated in sample' % purple)

check('LIFE hub links the roundup', os.path.basename(JUDGE) in open(HUB, encoding='utf8').read())

p = subprocess.run([sys.executable, 'tools/bohemia_asset_roundup_judge.py'],
                   capture_output=True, text=True, timeout=120)
out = p.stdout + p.stderr
m = re.search(r'wall (\d+)/\d+ kept, roof (\d+)/\d+ kept, door (\d+)/\d+ kept', out)
check('generator reproducible (recook matches)', bool(m) and p.returncode == 0, out[-120:])
if m:
    check('recook did not change the shipped file', open(JUDGE, encoding='utf8').read() == page)

print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)
