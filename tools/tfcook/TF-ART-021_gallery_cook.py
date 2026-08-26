#!/usr/bin/env python3
"""GALLERY / RAIL SHED + HEADHOUSE — the granary's galvanized tops.

VOLUME under TF-ART-021 (granary hardware; its form names the gallery
and headhouse as the district's remaining members). MEASURED 8/26:
'gallery / rail shed' x2121 - the signature blob is 101x3, the elevated
conveyor gallery running the whole silo row, plus 9x9 rail-shed roofs
and mid blocks; 'headhouse' x310 - the work tower's small tops. All
draw as generic civic mass today. From the 45 above, all of these are
GABLE GALV: a bright ridge line with corrugated slopes falling away,
ribs perpendicular to the run. Pieces, axis-specific:

  gg_h_ridge / gg_h_lit / gg_h_sh    east-west runs (ribs vertical)
  gg_v_ridge / gg_v_lit / gg_v_sh    north-south runs (ribs horizontal)

The wiring bands each cell by its position across the run's THIN axis
(the berm lesson: check the width fits before wiring) - ridge on the
centreline, lit slope on the north/west side, shaded on the south/east.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galv pool IS the roof metal.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for streaks down the old slopes.
TASTE CHECK: no readable text, no purple, no self-light; ribs are
CONTINUOUS 1px lines, never dots; dead world - dust and rust only.

  python3 tools/tfcook/TF-ART-021_gallery_cook.py
    -> banks/tileforms/TF-ART-021_GALLERY_VOLUME_8_26_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-021_GALLERY_VOLUME_8_26_26.json')
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

GALV = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a')), key=lambda c: sum(c))
rp = bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0')
px = rp.load(); seen = {}
for y in range(rp.height):
    for x in range(rp.width):
        c = px[x, y]
        if c[3] > 200 and c[0] > c[2]+30 and c[0] > c[1]+10:
            k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
p = sorted(seen.values(), key=len, reverse=True)[0]
RUST = tuple(sum(v[i] for v in p)//len(p) for i in range(3))

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def slab(f, axis, seed, rust=False):
    """a corrugated slope plane: base value f, continuous ribs across the run."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(seed)
    for y in range(C):
        for x in range(C):
            t = x if axis == 'h' else y                # rib position across the run
            rib = (t % 6)
            g = f * (1.08 if rib == 0 else (0.9 if rib == 3 else 1.0))
            px[x, y] = noise(dim(GALV, g*0.92), r, 4) + (255,)
    if rust:
        rx0 = r.randint(6, 30)
        for t in range(C):                             # one rust streak down the slope
            xi, yi = (rx0, t) if axis == 'h' else (t, rx0)
            px[xi, yi] = noise(dim(RUST, 0.9), r, 6) + (200,)
    return im

def ridge(axis, seed):
    """the ridge row: bright cap band along the run's centre, slopes shading off."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(seed)
    for y in range(C):
        for x in range(C):
            d = (abs(y - C//2) if axis == 'h' else abs(x - C//2)) / float(C//2)
            f = 1.18 - 0.34*d                          # bright cap falling both ways
            t = x if axis == 'h' else y
            if t % 6 == 3: f *= 0.92
            px[x, y] = noise(dim(GALV, f*0.92), r, 4) + (255,)
    for t in range(C):                                 # the cap flashing, one line
        xi, yi = (t, C//2) if axis == 'h' else (C//2, t)
        px[xi, yi] = dim(GALV, 1.28) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [
    {'name': 'gg_h_ridge', 'b64': b64(ridge('h', 10500))},
    {'name': 'gg_h_lit',   'b64': b64(slab(1.02, 'h', 10501))},
    {'name': 'gg_h_sh',    'b64': b64(slab(0.74, 'h', 10502, rust=True))},
    {'name': 'gg_v_ridge', 'b64': b64(ridge('v', 10503))},
    {'name': 'gg_v_lit',   'b64': b64(slab(1.02, 'v', 10504))},
    {'name': 'gg_v_sh',    'b64': b64(slab(0.74, 'v', 10505, rust=True))},
]

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-021 '
           '(granary hardware; its form names gallery and headhouse as the '
           'remaining members): the 101x3 conveyor gallery, the rail sheds '
           'and the headhouse tops draw as generic mass; gable galv from the '
           'approved pool. tools/tfcook/TF-ART-021_gallery_cook.py',
    'family': 'TF-ART-021', 'cooked': '8/26/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d gallery pieces -> %s' % (len(tiles), OUT))
