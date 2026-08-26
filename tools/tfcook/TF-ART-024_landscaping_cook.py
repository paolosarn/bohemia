#!/usr/bin/env python3
"""LANDSCAPING — the police station's dead xeriscape beds.

THE JOB: 'landscaping' x1131 (measured 8/25) - one connected web of bed
strips ringing the station, the lot and the secure yard (neighbours:
desert dead-ground 461, secure-yard concrete 356, the station 72), all
falling to the gravel fallback. Las Vegas civic landscaping is
XERISCAPE: decomposed-granite rock mulch beds with agave and yucca and
the odd feature boulder - and thirty years dead means the mulch is
still perfectly in place (rock does not die) while every plant in it is
a dry rosette. Pieces:

  ls_mulch_*    full-cell decomposed-granite mulch: finer and warmer
                than the yard gravel, the manicured bed read
  ls_agave_*    a dead agave rosette overlay: radiating dry leaves,
                one per cell, off-centre
  ls_boulder    the feature boulder: one low lit/shadow mass

REUSE CHECK: (banks OPENED in code)
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt + yard_0:
    the approved earth pools ARE the granite mulch (warmed, finer grain).
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete for the boulder's lit facet.
TASTE CHECK: no green (a dead agave is straw and grey), no purple, no
readable text, no dot stipple (the mulch grain is value noise at one
pixel, never patterned dots).

  python3 tools/tfcook/TF-ART-024_landscaping_cook.py
    -> banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json')
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

st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
EARTH = pools(load_b64(byid['dirt']['b64']))[0]
def bank_tile(path, nm):
    d = json.load(open(os.path.join(REPO, path)))
    for t in d['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])
PALE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne')), key=lambda c: sum(c))

MULCH = tuple(min(255, int(c*f)) for c, f in zip(EARTH, (1.04, 0.94, 0.86)))   # warmed granite
STRAW = tuple(min(255, int(c*f)) for c, f in zip(PALE, (1.0, 0.95, 0.78)))     # dead agave leaf

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=6):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def mulch(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(9800+v*13)
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(dim(MULCH, 0.94), r, 8) + (255,)
    for k in range(r.randint(6, 9)):                    # slightly larger stones in the mix
        mx, my = r.randint(1, C-4), r.randint(1, C-4)
        f = r.choice((0.82, 1.1))
        for dy in range(2):
            for dx in range(r.randint(2, 3)):
                px[mx+dx, my+dy] = noise(dim(MULCH, f), r, 6) + (255,)
    return im

def agave(v):
    """a dead rosette: dry leaves radiating from a dark heart, off-centre."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(9900+v)
    cx, cy = r.choice((16, 26)), r.choice((17, 25))
    nl = r.randint(9, 12)
    for k in range(nl):
        a = k * 2*math.pi/nl + r.random()*0.3
        ln = r.randint(6, 10)
        for t in range(ln):
            fx = cx + math.cos(a)*t*0.9
            fy = cy + math.sin(a)*t*0.55                # ellipse per the 45 law
            xi, yi = int(fx), int(fy)
            if 0 <= xi < C and 0 <= yi < C:
                f = 0.95 - 0.35*(t/float(ln))           # leaf darkens to its dry tip
                px[xi, yi] = noise(dim(STRAW, f), r, 7) + (255,)
                if t < ln-1 and 0 <= xi+1 < C:
                    px[xi+1, yi] = noise(dim(STRAW, f*0.9), r, 7) + (255,)
    for dy in (-1, 0, 1):                               # the dark heart
        for dx in (-1, 0, 1):
            if 0 <= cx+dx < C and 0 <= cy+dy < C:
                px[cx+dx, cy+dy] = dim(STRAW, 0.42) + (255,)
    for dy in range(2):                                 # foot shadow south
        for dx in range(-4, 5):
            xi, yi = cx+dx, cy+6+dy
            if 0 <= xi < C and 0 <= yi < C:
                px[xi, yi] = (0, 0, 0, 45)
    return im

def boulder():
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(9950)
    cx, cy, rx, ry = 21, 22, 9, 7
    for y in range(C):
        for x in range(C):
            a = math.atan2(y-cy, x-cx)
            edge = 1.0 + 0.18*math.sin(3*a) + 0.1*math.cos(5*a)
            d = ((x-cx)/(rx*edge))**2 + ((y-cy)/(ry*edge))**2
            if d <= 1.0:
                f = 1.1 if y < cy-2 else (0.9 if y < cy+2 else 0.68)
                px[x, y] = noise(dim(PALE, f*0.9), r, 6) + (255,)
    for y in range(cy+ry, min(C, cy+ry+3)):
        for x in range(cx-8, cx+9):
            if ((x-cx)/9.0)**2 <= 1.0: px[x, y] = (0, 0, 0, 55)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(3): tiles.append({'name': 'ls_mulch_%d' % v, 'b64': b64(mulch(v))})
for v in range(2): tiles.append({'name': 'ls_agave_%d' % v, 'b64': b64(agave(v))})
tiles.append({'name': 'ls_boulder', 'b64': b64(boulder())})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-024: the '
           'police station\'s 1131 landscaping cells fell to the gravel '
           'fallback; dead xeriscape beds - granite mulch from the approved '
           'dirt, dead agave straw and boulder from the approved kerb pale. '
           'tools/tfcook/TF-ART-024_landscaping_cook.py',
    'family': 'TF-ART-024', 'cooked': '8/25/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d landscaping pieces -> %s' % (len(tiles), OUT))
