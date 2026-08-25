#!/usr/bin/env python3
"""SPOUT / DUST BIN — the granary's loadout hardware.

THE JOB: 'spout / dust bin' x1514 (measured 8/24) - 81 blobs hugging the
dump apron (1001 adjacencies) and the rail spur (511) at the silo bases.
A grain elevator's loadout row is exactly this from above: telescoping
LOADOUT SPOUTS hanging over the track/truck side, and squat CYCLONE DUST
COLLECTORS standing at the silo bases. Every cell falls to the gravel
fallback today. Two pieces, RGBA riding on bought concrete (the apron's
own ground):

  sd_bin_*     a cyclone dust collector from above: a dark galv ellipse
               with a lit north rim and the cone falling to a dark
               centre throat, foot shadow south
  sd_spout_*   a loadout spout head: the boom arm reaching from the
               silo side with the dark square mouth at its end, grain
               dust bleached on the deck around it

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galv steel for cyclone and boom metal.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for thirty dead years of weep.
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete, lifted, for the grain-dust bleach.
TASTE CHECK: no readable text, no purple, no self-light, no dot stipple;
dead world - the spouts have not dropped grain in thirty years.

  python3 tools/tfcook/TF-ART-021_spout_bin_cook.py
    -> banks/tileforms/TF-ART-021_CANDIDATES_8_24_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-021_CANDIDATES_8_24_26.json')
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

def bin_(v):
    """the cyclone from above: ellipse rim, cone to a dark throat."""
    im = new(); px = im.load(); r = random.Random(9300+v)
    cx, cy, rx, ry = 22, 21, 12, 10
    for y in range(C):
        for x in range(C):
            d = ((x-cx)/float(rx))**2 + ((y-cy)/float(ry))**2
            if d <= 1.0:
                f = 0.55 + 0.45*d                       # cone falls to the throat
                if d > 0.78 and y < cy: f = 1.1         # lit north rim
                if d > 0.78 and y >= cy: f = 0.6        # shadowed south rim
                if d < 0.12: f = 0.3                    # the dark throat
                px[x, y] = noise(dim(GALV, f*0.85), r, 5) + (255,)
    for y in range(cy+ry, min(C, cy+ry+3)):             # foot shadow
        for x in range(cx-9, cx+10):
            if ((x-cx)/10.0)**2 <= 1.0: px[x, y] = (0, 0, 0, 60)
    if v == 1:                                          # rust streak on the flank
        for y in range(cy, cy+ry):
            px[cx+rx-3, y] = dim(RUST, 0.85) + (140,)
    return im

def spout(v):
    """the loadout boom from above: arm reaching south, dark mouth, dust bleach."""
    im = new(); px = im.load(); r = random.Random(9400+v)
    # bleached grain-dust halo on the deck first (value only, no stipple)
    for y in range(C):
        for x in range(C):
            d = ((x-22)/20.0)**2 + ((y-30)/13.0)**2
            if d <= 1.0 and r.random() < 0.85:
                px[x, y] = noise(dim(PALE, 1.12), r, 5) + (int(90*(1-d)),)
    ax = 20 if v == 0 else 23                           # the boom arm, silo side down
    for y in range(2, 30):
        for k in range(4):
            f = 1.0 if k == 0 else (0.85 if k < 3 else 0.6)
            px[ax+k, y] = noise(dim(GALV, f*0.8), r, 4) + (255,)
    for y in range(28, 38):                             # the mouth block
        for x in range(ax-3, ax+7):
            f = 0.75 if y < 31 else 0.55
            px[x, y] = noise(dim(GALV, f*0.8), r, 4) + (255,)
    for y in range(32, 36):                             # the dark drop mouth
        for x in range(ax-1, ax+5):
            px[x, y] = dim(GALV, 0.25) + (255,)
    for y in range(38, min(C, 41)):                     # mouth shadow
        for x in range(ax-3, ax+7): px[x, y] = (0, 0, 0, 55)
    if v == 1:                                          # rust weep down the arm
        for y in range(12, 26): px[ax+3, y] = dim(RUST, 0.85) + (120,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(2): tiles.append({'name': 'sd_bin_%d' % v,   'b64': b64(bin_(v))})
for v in range(2): tiles.append({'name': 'sd_spout_%d' % v, 'b64': b64(spout(v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-021: the '
           'granary\'s 1514 spout/dust-bin cells fell to the gravel fallback; '
           'cyclones and loadout spouts ride on bought concrete, steel from the '
           'approved galv, rust from the approved rail plate, dust bleach from '
           'the approved kerb pale. tools/tfcook/TF-ART-021_spout_bin_cook.py',
    'family': 'TF-ART-021', 'cooked': '8/24/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d spout/bin pieces -> %s' % (len(tiles), OUT))
