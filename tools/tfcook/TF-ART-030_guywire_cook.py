#!/usr/bin/env python3
"""GUY WIRES — the radio site's rigging, seen from straight above.

THE JOB (measured 8/27 on the walked world, cell 37,26): 'guy wire'
x2798 in 132 blobs - the radial fans running from every guyed mast out
to its anchor blocks - all falling to plain ground. From the 45 a guy
wire is a THIN STEEL LINE POINTING AT ITS MAST and its faint sun
shadow; the fan geometry IS the art. Eight direction-snapped overlays:

  gw_0..gw_7    a 44px alpha overlay: one dark steel cable crossing the
                whole tile at k*22.5 degrees, a 1px pale glint beside
                it on the sun side, a faint offset shadow line SE. The
                run branch computes the bearing from each wire cell to
                its NEAREST MAST (lazily cached per district cell) and
                snaps to these eight.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galvanised steel is the cable itself.
TASTE CHECK: a taut guy has NO sag from above - straight is what the
machinery is (the 8/1 law bans straight lines in organic shapes, not
in rigging); no purple, no self-light, no dots.

  python3 tools/tfcook/TF-ART-030_guywire_cook.py
    -> banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json
"""
import json, base64, io, os, math, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json')
C = 44

def load_b64(b): return Image.open(io.BytesIO(base64.b64decode(b.split(',')[-1]))).convert('RGBA')
def pools(im, n=4):
    px = im.load(); seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200:
                k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
    ps = sorted(seen.values(), key=len, reverse=True)[:n]
    return [tuple(sum(v[i] for v in p)//len(p) for i in range(3)) for p in ps]
def bank_tile(path, nm):
    d = json.load(open(os.path.join(REPO, path)))
    for t in d['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])

ALU = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a')), key=lambda c: sum(c))
STEEL = tuple(int(c*0.5) for c in ALU)
GLINT = tuple(min(255, int(c*1.15)) for c in ALU)

def wire(k):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11800 + k)
    a = math.radians(k * 22.5)
    dx, dy = math.cos(a), math.sin(a)
    cx = cy = (C-1)/2.0
    for t in range(-40, 41):
        xx = cx + dx*t; yy = cy + dy*t
        xi, yi = int(round(xx)), int(round(yy))
        if 0 <= xi < C and 0 <= yi < C:
            px[xi, yi] = STEEL + (235,)
            # the sun glint rides the NW side of the cable
            gx2, gy2 = xi - (1 if abs(dy) > 0.38 else 0), yi - (1 if abs(dx) > 0.38 else 0)
            if 0 <= gx2 < C and 0 <= gy2 < C and (gx2, gy2) != (xi, yi):
                if px[gx2, gy2][3] == 0: px[gx2, gy2] = GLINT + (110,)
            # the faint shadow, offset SE
            sx2, sy2 = xi + 2, yi + 2
            if 0 <= sx2 < C and 0 <= sy2 < C and px[sx2, sy2][3] == 0:
                px[sx2, sy2] = (12, 10, 8) + (46,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [{'name': 'gw_%d' % k, 'b64': b64(wire(k))} for k in range(8)]

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-030: the '
           'radio site\'s 2,798 guy-wire cells (132 radial fans) fell to plain '
           'ground; eight direction-snapped steel cables from the approved '
           'galv, each wire cell bearing on its nearest mast. '
           'tools/tfcook/TF-ART-030_guywire_cook.py',
    'family': 'TF-ART-030', 'cooked': '8/27/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d guy-wire overlays -> %s' % (len(tiles), OUT))
