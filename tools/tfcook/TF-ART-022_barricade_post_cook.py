#!/usr/bin/env python3
"""BARRICADE POST — the arsenal's post-and-cable vehicle lines.

THE JOB: 'barricade post' x1607 (measured 8/24) - 85 blobs across the
arsenal: small clusters at the issue points and long SPARSE lines across
the storage ground (36x10 bounding box at 37% fill - post lines, not
walls), beside the magazines (236) and traverses (173). A real ammo
depot rings its storage ground with concrete-filled steel posts strung
with cable. Every cell falls to the gravel fallback today. Pieces, RGBA
riding on the yard's own bought gravel:

  bp_post_*     one concrete-filled steel post from the 45: ellipse cap,
                short shaft, foot shadow
  bp_cable_h_*  the sagging cable span crossing the full cell on the run
  bp_cable_v_*  axis - ends pinned at the same height at both cell edges
                so neighbouring spans join seamlessly (continuous 1px
                lines, never dots)

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galv steel for post caps and cable.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for the posts' thirty dead years.
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete for the post fill and collar.
TASTE CHECK: no readable text, no purple, no self-light; the cable is a
CONTINUOUS 1px line (dots-as-texture banned 8/21); dead brush stays the
district's, not this kit's.

  python3 tools/tfcook/TF-ART-022_barricade_post_cook.py
    -> banks/tileforms/TF-ART-022_CANDIDATES_8_24_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-022_CANDIDATES_8_24_26.json')
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
PALE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne')), key=lambda c: sum(c))
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
def noise(c, r, a=6):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)
def new(): return Image.new('RGBA', (C, C), (0, 0, 0, 0))

CABLE_Y = 18   # the cable's pinned height at every cell edge (seam contract)

def post(v):
    """one post: pale concrete fill in a steel shell, ellipse cap, foot shadow."""
    im = new(); px = im.load(); r = random.Random(9500+v)
    cx = 21
    for y in range(14, 30):                             # the shaft
        for k in range(-2, 3):
            f = 1.0 if k < 0 else (0.85 if k < 2 else 0.62)
            base = PALE if v == 0 else dim(RUST, 1.05)  # half the posts rusted through
            px[cx+k, y] = noise(dim(base, f*0.9), r, 5) + (255,)
    for x in range(cx-3, cx+4):                         # the cap ellipse
        for y in range(12, 15):
            d = ((x-cx)/3.5)**2 + ((y-13)/1.6)**2
            if d <= 1.0:
                px[x, y] = noise(dim(GALV, 1.05 if y < 13 else 0.7), r, 4) + (255,)
    for y in range(30, 33):                             # foot shadow
        for x in range(cx-4, cx+5): px[x, y] = (0, 0, 0, 65)
    return im

def cable(axis, v):
    """the span: one continuous 1px line, pinned at CABLE_Y at both edges."""
    im = new(); px = im.load(); r = random.Random(9600+v+(0 if axis == 'h' else 3))
    sag = 3 if v == 0 else 4
    for t in range(C):
        s = int(round(sag * (1 - ((t-(C-1)/2.0)/((C-1)/2.0))**2)))
        if axis == 'h': x, y = t, CABLE_Y + s
        else:           x, y = CABLE_Y + s, t
        px[x, y] = dim(GALV, 0.5) + (230,)
        if axis == 'h': px[x, y+1] = (0, 0, 0, 40)      # the cable's whisper shadow
        else:           px[x+1, y] = (0, 0, 0, 40)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(2): tiles.append({'name': 'bp_post_%d' % v,    'b64': b64(post(v))})
for v in range(2): tiles.append({'name': 'bp_cable_h_%d' % v, 'b64': b64(cable('h', v))})
for v in range(2): tiles.append({'name': 'bp_cable_v_%d' % v, 'b64': b64(cable('v', v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-022: the '
           'arsenal\'s 1607 barricade-post cells fell to the gravel fallback; '
           'post-and-cable lines ride on bought gravel, steel from the approved '
           'galv, rust from the approved rail plate, concrete fill from the '
           'approved kerb pale. tools/tfcook/TF-ART-022_barricade_post_cook.py',
    'family': 'TF-ART-022', 'cooked': '8/24/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d barricade pieces -> %s' % (len(tiles), OUT))
