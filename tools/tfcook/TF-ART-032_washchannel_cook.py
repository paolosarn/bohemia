#!/usr/bin/env python3
"""THE WASH CHANNEL — the invert and its banks, the riprap's promised
second half.

THE JOB (fresh ranking 8/27): 'channel invert' x5646 and 'channel bank'
x4048 are the wash's two remaining unclaimed names (TF-ART-023 armored
the riprap and its form said the bank and invert were next). A flood
channel is concrete: the INVERT is the flat floor with the dark meander
stain where the last low flow ran and died, the BANKS are the sloped
sides with weep streaks running DOWN the slope toward the water. Eight
pieces, axis-aware:

  iv_h_0/1, iv_v_0/1   the invert: pale channel concrete, joint lines
                       across the run, and the low-flow stain - a dark
                       wandering ribbon ALONG the channel axis.
  bk_h_0/1, bk_v_0/1   the bank: the same concrete a step darker with
                       weep and silt streaks PERPENDICULAR to the
                       channel (down the slope), the odd spall.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale IS the channel concrete.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt: the
    approved earth for stains, silt and weeps.
TASTE CHECK: the stain WANDERS (8/1 law - water never rules a line);
joints are machinery and may be straight; no purple, no text, no
self-light, no dots.

  python3 tools/tfcook/TF-ART-032_washchannel_cook.py
    -> banks/tileforms/TF-ART-032_CANDIDATES_8_27_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-032_CANDIDATES_8_27_26.json')
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

PALE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne')), key=lambda c: sum(c))
st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
EARTH = pools(load_b64(byid['dirt']['b64']))[0]

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mix(a, b, t): return tuple(int(av*(1-t) + bv*t) for av, bv in zip(a, b))
def noise(c, r, a=4):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def plain_invert(v):
    """The invert away from the centreline: pale channel concrete with a
    joint and the odd silt sheet - NO stain. LIVE LOOK 8/27: staining
    every invert cell at a per-cell offset read as a barcode; the low
    flow is ONE line and only the centreline cells carry it."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(12150 + v*89)
    base = dim(PALE, 0.9)
    for y in range(C):
        for x in range(C):
            c = noise(base, r, 4)
            if x % 22 == 0 or y % 22 == 0: c = dim(c, 0.88)
            px[x, y] = c + (255,)
    if v == 1:                                           # a silt sheet left by the last storm
        sx = r.randint(4, 26); sy = r.randint(4, 26)
        for dy in range(8):
            for dx in range(12 - dy):
                xx, yy = sx+dx, sy+dy
                if 0 <= xx < C and 0 <= yy < C:
                    px[xx, yy] = noise(mix(base, dim(EARTH, 0.7), 0.35), r, 5) + (255,)
    return im

def invert(axis, v):
    """The centreline cell: the low-flow stain rides the EXACT centre at
    both tile edges (the wander envelope pins it to zero there), so the
    line joins seamlessly cell to cell along the run."""
    import math as _m
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(12100 + v*79 + (axis == 'v'))
    base = dim(PALE, 0.9)
    for y in range(C):
        for x in range(C):
            c = noise(base, r, 4)
            k = x if axis == 'h' else y                  # joints across the run
            if k % 22 == 0: c = dim(c, 0.85)
            px[x, y] = c + (255,)
    off = C//2
    for t in range(C):
        env = _m.sin(_m.pi * t / float(C-1))             # 0 at both edges - the join contract
        wob = env * (4.5 * _m.sin(t*0.42 + v*2.1) + r.uniform(-1.2, 1.2))
        o = int(round(off + wob))
        for w in range(-3, 4):
            oo = o + w
            if 0 <= oo < C:
                f = 0.5 + 0.13*abs(w)
                xx, yy = (t, oo) if axis == 'h' else (oo, t)
                px[xx, yy] = noise(mix(dim(base, f), dim(EARTH, 0.55), 0.35), r, 5) + (255,)
    return im

def bankp(axis, v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(12200 + v*83 + (axis == 'v'))
    base = dim(PALE, 0.82)                               # the slope holds less light
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(base, r, 4) + (255,)
    # weep streaks DOWN the slope: perpendicular to the channel axis
    for k in range(r.randint(4, 6)):
        p0 = r.randint(2, C-3); wob = 0.0
        ln = r.randint(18, C)
        st2 = r.randint(0, C-ln) if C > ln else 0
        for t in range(st2, st2+ln):
            wob += r.uniform(-0.5, 0.5); wob *= 0.8
            o = int(p0 + wob)
            if 0 <= o < C:
                xx, yy = (o, t) if axis == 'h' else (t, o)
                px[xx, yy] = noise(mix(dim(base, 0.8), dim(EARTH, 0.55), 0.35), r, 5) + (255,)
    if v == 1:                                           # the odd spall down to aggregate
        sx, sy = r.randint(6, 32), r.randint(6, 32)
        for dy in range(4):
            for dx in range(6 - dy):
                px[sx+dx, sy+dy] = noise(mix(dim(base, 0.85), dim(EARTH, 0.6), 0.45), r, 6) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(2):
    tiles.append({'name': 'iv_h_%d' % v, 'b64': b64(invert('h', v))})
    tiles.append({'name': 'iv_v_%d' % v, 'b64': b64(invert('v', v))})
    tiles.append({'name': 'iv_p_%d' % v, 'b64': b64(plain_invert(v))})
    tiles.append({'name': 'bk_h_%d' % v, 'b64': b64(bankp('h', v))})
    tiles.append({'name': 'bk_v_%d' % v, 'b64': b64(bankp('v', v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-032: the '
           'wash\'s 5,646 invert and 4,048 bank cells - the riprap form\'s '
           'promised second half - fell to bare ground; channel concrete with '
           'the low-flow meander stain and downslope weeps from the approved '
           'kerb pale and dirt. tools/tfcook/TF-ART-032_washchannel_cook.py',
    'family': 'TF-ART-032', 'cooked': '8/27/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d wash channel tiles -> %s' % (len(tiles), OUT))
