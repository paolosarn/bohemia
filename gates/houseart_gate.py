#!/usr/bin/env python3
"""
BOHEMIA HOUSE ART GATE (7/21/26, flipped 7/21 on Paolo's verdict) - the
house-skin cook stays lawful, now as CANON.

Paolo's verdict: all 30 UP (records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt).
tools/bohemia_city_houseart_patch.py married them into the canon suburb.
This gate flipped with the verdict: it used to require nothing shipped
before a verdict existed; now it requires the CANON status line and the
real art actually wired into the city.

What it locks:
  - the bank exists, is versioned, carries the CANON status line
  - class coverage: roofs (incl S-tile), walls, windows (with BOARDED),
    doors, yards
  - ZERO purple in any tile (the Amalgamation's color, purity law)
  - TAN WALL 85/15: every wall-class body lives in the warm tan family
  - DEAD WORLD: window glass is dark (no lit rooms in act 1)
  - DETERMINISM: re-cooking the factory reproduces the bank byte-for-byte
    (seed-regen law; the gate cooks to scratch, never touches the real bank)
  - the judge page exists, shows this bank version, exports .txt (never .json)
  - the LIFE hub (the tab the alpha iframes) routes to the judge
  - MARRIED IN: the city embeds the approved tiles (byte-locked pools),
    routes roof/facade/yard cells through them, and every skin id from the
    bank resolves into one of the six embedded art pools

  python3 gates/houseart_gate.py
"""
import base64
import io
import json
import os
import subprocess
import sys
import tempfile

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BANK = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
JUDGE = 'slices/BOHEMIA_HOUSE_SKIN_JUDGE_7_21_26.html'
HUB = 'slices/BOHEMIA_LIFE_CURRENT.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

passed = 0
failed = []


def check(name, ok, detail=''):
    global passed
    if ok:
        passed += 1
    else:
        failed.append(name + (': ' + detail if detail else ''))
    print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  (' + detail + ')') if detail and not ok else ''))


print('=== HOUSE ART GATE ===')

# 1) the bank
check('bank exists', os.path.exists(BANK))
bank = json.load(open(BANK))
check('bank versioned', bank.get('version', '').startswith('BOHEMIA_HOUSE_SKIN_CANDIDATES'))
check('CANON status line', 'CANON' in bank.get('status', ''))
tiles = bank.get('tiles', [])
check('enough candidates', len(tiles) >= 20, '%d' % len(tiles))
cls = {}
for t in tiles:
    cls.setdefault(t['cls'], []).append(t)
check('all classes present', all(k in cls for k in ('roof', 'wall', 'window', 'door', 'yard')),
      ','.join(sorted(cls)))
check('s-tile roofs exist (7/21 research)', any('stile' in t['id'] for t in cls.get('roof', [])))
check('boarded windows exist', any('boarded' in t['id'] for t in cls.get('window', [])))

# 2) pixels: purity, tan walls, dead glass
purple = 0
tan_bad = []
lit_glass = []
for t in tiles:
    im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
    px = list(im.getdata())
    for (r, g, b) in px:
        if r > g + 25 and b > g + 25:
            purple += 1
    if t['cls'] in ('wall', 'window', 'door'):
        # TAN 85/15: warm pixels (r>=g>=b, warm spread) must dominate the face
        warm = sum(1 for (r, g, b) in px if r >= g >= b and 10 <= r - b <= 110)
        # dark pixels (glass, boards' gaps, shadow lines) sit outside the ratio
        dark = sum(1 for (r, g, b) in px if r + g + b < 210)
        lit = len(px) - dark
        if lit and warm / lit < 0.85:
            tan_bad.append('%s %.2f' % (t['id'], warm / lit))
    if t['cls'] == 'window' and 'boarded' not in t['id']:
        # the glass body must stay DEAD dark (act 1: no lit rooms)
        w, h = im.size
        glass = [im.getpixel((x, y)) for y in range(16, 26) for x in range(14, 30)]
        bright = sum(1 for (r, g, b) in glass if r + g + b > 240)
        if bright > len(glass) * 0.2:
            lit_glass.append(t['id'])
check('zero purple', purple == 0, '%d px' % purple)
check('tan wall 85/15', not tan_bad, '; '.join(tan_bad[:3]))
check('dead dark glass', not lit_glass, ','.join(lit_glass))

# 3) determinism: the factory re-cooks byte-identical (seed-regen law)
with tempfile.TemporaryDirectory() as td:
    out2 = os.path.join(td, 'recook.txt')
    env = dict(os.environ, BOH_HOUSE_OUT=out2)
    p = subprocess.run([sys.executable, 'tools/bohemia_house_art_factory.py'],
                       env=env, capture_output=True, text=True, timeout=300)
    ok = p.returncode == 0 and os.path.exists(out2) and \
        open(out2, 'rb').read() == open(BANK, 'rb').read()
    check('deterministic recook', ok, (p.stderr or '')[-80:] if p.returncode else 'byte diff')

# 4) the judge surface
check('judge page exists', os.path.exists(JUDGE))
judge = open(JUDGE, encoding='utf8').read()
check('judge shows this bank', bank['version'] in judge)
check('judge exports .txt', '.txt' in judge and 'VERDICT' in judge and '.json' not in judge)
check('judge has SUN MODE + thumbs', 'SUN MODE' in judge and 'UP' in judge and 'DOWN' in judge)
check('judge embeds all candidates', all(t['id'] in judge for t in tiles))

# 5) the hub routes to it (the alpha's LIFE tab iframes the hub)
hub = open(HUB, encoding='utf8').read()
check('LIFE hub links judge', os.path.basename(JUDGE) in hub)
check('LIFE hub keeps living block', 'BOHEMIA_LIFE_SLICE_7_19_26.html' in hub)

# 6) MARRIED IN: the verdict is in, the real art must actually be in the city
alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
decoded = base64.b64decode(alpha[a0:alpha.index("'", a0)]).decode('utf8')
check('the bank rides the city (byte-locked source reference)', 'HOUSE_SKIN_CANDIDATES' in decoded)
check('all six art pools embedded', all(
    ("SA_TILES.%s=" % p) in decoded for p in
    ('hroof', 'hwall', 'hwindow', 'hboarded', 'hdoor', 'hyard')))
check('roof cells route through the real art (c.artPool)', 'c.artPool=' in decoded)
check('face cells pick plain/window/boarded/door (c.artPool_face)', 'c.artPool_face=' in decoded)
check('dead dirt routes through a per-block yard blend (c.gArtPool)', 'c.gArtPool=' in decoded)
check('draw calls check the art pools before the judge-palette fallback',
      "if(c.face&&c.artPool_face)" in decoded and "if(!_gt&&c.gArtPool)" in decoded)

print('=== %d passed / %d failed ===' % (passed, len(failed)))
if failed:
    for f in failed:
        print('  FAIL ' + f)
    sys.exit(1)
