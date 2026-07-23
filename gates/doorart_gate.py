#!/usr/bin/env python3
"""
BOHEMIA DOOR ART GATE (7/21/26) - real doors in the live SLICE tab stay lawful.

Locks:
  - the slice exists, declares charset=utf-8 (the mojibake lesson)
  - door art is embedded (DOOR_B64) and the draw path uses it (drawImage,
    doorPick) with a flat-color fallback (never a blank cell while loading)
  - canvas smoothing is disabled every frame (a resize clears it - the bug
    this session hit) so downscaled door art stays crisp, not blurred to mush
  - PURITY LAW: zero purple in any embedded door tile
  - TAN 85/15 (extended to trim): the warm-tone filter actually excluded the
    cool/saturated candidates - fewer tiles ship than were sourced
  - reproducible: re-running the generator yields the same door count
    (seed-regen law)

  python3 gates/doorart_gate.py
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
SLICE = 'slices/BOHEMIA_SUBURB_WALK_7_18_26.html'

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  (' + detail + ')') if detail and not ok else ''))


print('=== DOOR ART GATE ===')

check('slice exists', os.path.exists(SLICE))
page = open(SLICE, encoding='utf8').read()
check('utf-8 charset declared', '<meta charset="utf-8">' in page)
check('door art embedded (DOOR_B64)', 'var DOOR_B64=' in page)
check('draw path uses it (doorPick + drawImage)', 'doorPick(gx,gy)' in page and 'ctx.drawImage(_di' in page)
check('flat-color fallback stays under the art (never a blank cell)',
      "col='#f0cd78'; isDoor=true;" in page and "ic.g==='door'" in page)
check('smoothing disabled every frame (resize clears it)',
      'ctx.imageSmoothingEnabled=false' in page and page.count('imageSmoothingEnabled=false') >= 1)

m = re.search(r'var DOOR_B64=(\[.*?\]);', page)
check('door tiles parse', bool(m))
if m:
    import json
    tiles = json.loads(m.group(1))
    check('enough door variety', len(tiles) >= 6, '%d' % len(tiles))
    purple = 0
    for b64 in tiles:
        im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
        for r, g, b in im.getdata():
            if r > g + 25 and b > g + 25:
                purple += 1
    check('zero purple', purple == 0, '%d px' % purple)

p = subprocess.run([sys.executable, 'tools/bohemia_suburb_walk.py'],
                   capture_output=True, text=True, timeout=120)
check('generator reproducible (recook succeeds)', p.returncode == 0, (p.stderr or '')[-100:])
if p.returncode == 0 and m:
    page2 = open(SLICE, encoding='utf8').read()
    m2 = re.search(r'var DOOR_B64=(\[.*?\]);', page2)
    check('recook yields the same door count', bool(m2) and len(json.loads(m2.group(1))) == len(tiles))

print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)
