#!/usr/bin/env python3
"""RECLAIM INLET HEADER — the one new name the 8/20 re-probe surfaced.

THE JOB: reclaim names 'inlet header' x171 (measured 8/20) and nothing
draws it - the water plant's big distribution pipe manifold. One shape:
a fat header pipe running across the cell at the 45 view (ellipse
cross-section: lit crest, dark under-curve), riser stubs down to grade,
bolted flanges at the joints, rust only at the flange seats with its
short streak. Dead plant: no water, no motion.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galvanised steel for the pipe barrel.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for flange seats and streaks.
TASTE CHECK: dead and dry; rust only where steel was cut or bolted; no
keyline, no dither; nothing green.

  python3 tools/tfcook/TF-ART-016_inlet_cook.py
    -> banks/tileforms/TF-ART-016_INLET_VOLUME_8_20_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-016_INLET_VOLUME_8_20_26.json')
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
RUST = pools(bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0'))[0]

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def header(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load(); r = random.Random(2020+v)
    y0, H = 14, 14                                    # the barrel band
    for x in range(C):
        for k in range(H):
            y = y0+k
            t = abs(k-(H-1)/2.0)/(H/2.0)              # curve across the barrel
            f = 1.22 - 0.62*t*t
            px[x, y] = noise(dim(GALV, f), r, 4) + (255,)
        px[x, y0+H] = (12, 10, 8, 120)                # the under-shadow line
    for fx in range(4+v*5, C, 15):                    # bolted flanges
        for y in range(y0-1, y0+H+1):
            if 0 <= fx < C: px[fx, y] = noise(dim(GALV, 0.85), r, 4) + (255,)
            if fx+1 < C: px[fx+1, y] = noise(dim(GALV, 1.05), r, 4) + (255,)
        sy = y0+H+1
        for y in range(sy, min(C, sy+8)):             # rust streak below the flange seat
            a = int(70*(1.0-(y-sy)/8.0))
            px[fx, y] = RUST + (a,)
    rx = 30 if v == 0 else 12                          # one riser stub to grade
    for y in range(y0+H, C-2):
        for k in range(5):
            x = rx+k
            t = abs(k-2)/2.5
            if x < C: px[x, y] = noise(dim(GALV, 1.05-0.4*t*t), r, 4) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles=[{'name':'inlet_header_%d'%v,'b64':b64(header(v))} for v in range(2)]
json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-016 '
           '(the power/utility yard kit): the reclaim plant names inlet '
           'header x171 (measured 8/20) and nothing drew it. Steel from the '
           'approved galv parapet, rust from the approved rail plate. '
           'tools/tfcook/TF-ART-016_inlet_cook.py',
    'family': 'TF-ART-016', 'cooked': '8/20/26', 'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d inlet pieces -> %s' % (len(tiles), OUT))
