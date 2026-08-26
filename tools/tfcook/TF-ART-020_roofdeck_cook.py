#!/usr/bin/env python3
"""TANK ROOF + OVERFLOW — the reservoir's deck and splash structures.

VOLUME under TF-ART-020 (reservoir hardware; its form names tank roof and
overflow as siblings). MEASURED 8/25: 'tank roof' x3295 in huge
rectangular blobs (26x106=1277, 13x37, 30x30 - the concrete deck over a
buried reservoir, ringed by 'water tank' wall cells), 'overflow' x1028 in
small clusters and short lines on the tank pad beside the valve/hatch
rows. Both fall to fallbacks today. Pieces:

  tr_deck_*   full-cell pale concrete roof deck: a PANEL per cell with a
              1px joint baked on the north and west edges, so any group
              of cells reads as a jointed panel deck (self-seamless)
  tr_vent_*   a galv mushroom vent overlay, sparse - a buried reservoir
              breathes through its deck
  of_basin_*  an overflow splash basin riding on bought concrete: the
              collar, the dark weir mouth, the old wet-stain fan below

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete IS the deck and collar.
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galv for vent caps.
TASTE CHECK: no readable text, no purple, no self-light, no dot stipple;
the stain is a value fan, not a pattern; nothing is wet any more.

  python3 tools/tfcook/TF-ART-020_roofdeck_cook.py
    -> banks/tileforms/TF-ART-020_ROOF_OVERFLOW_VOLUME_8_25_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-020_ROOF_OVERFLOW_VOLUME_8_25_26.json')
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
GALV = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a')), key=lambda c: sum(c))

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def deck(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(10100+v*17)
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(dim(PALE, 0.96), r, 5) + (255,)
    for t in range(C):                                  # the panel joints, N + W edges
        px[t, 0] = dim(PALE, 0.74) + (255,)
        px[t, 1] = dim(PALE, 1.05) + (255,)             # the lit arris below the joint
        px[0, t] = dim(PALE, 0.74) + (255,)
        if t > 1: px[1, t] = dim(PALE, 1.03) + (255,)
    if v == 1:                                          # a bitumen patch square
        bx, by = r.randint(8, 26), r.randint(8, 26)
        for dy in range(7):
            for dx in range(9):
                px[bx+dx, by+dy] = noise(dim(PALE, 0.62), r, 4) + (255,)
    if v == 2:                                          # a hairline crack
        cx2 = r.randint(10, 34)
        for y in range(4, C-4):
            cx2 += r.choice((-1, 0, 0, 1))
            if 1 <= cx2 < C: px[cx2, y] = dim(PALE, 0.7) + (255,)
    return im

def vent(v):
    """the mushroom vent: a galv cap ellipse over a short throat, foot shadow."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(10200+v)
    cx, cy = (16, 18) if v == 0 else (27, 25)
    for y in range(C):                                  # the cap, 45 ellipse
        for x in range(C):
            d = ((x-cx)/7.0)**2 + ((y-cy)/5.0)**2
            if d <= 1.0:
                f = 1.12 if y < cy-1 else (0.95 if d < 0.55 else 0.7)
                px[x, y] = noise(dim(GALV, f*0.85), r, 5) + (255,)
    for x in range(cx-3, cx+4):                         # the throat's shadow under the cap
        for y in range(cy+5, cy+8):
            px[x, y] = dim(GALV, 0.45) + (255,)
    for x in range(cx-6, cx+7):                         # foot shadow
        for y in range(cy+8, min(C, cy+10)):
            if ((x-cx)/7.0)**2 <= 1.0: px[x, y] = (0, 0, 0, 55)
    return im

def basin(v):
    """the overflow splash basin: collar, dark weir mouth, the dry stain fan."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(10300+v)
    x0, y0, x1, y1 = 6, 4, 38, 26
    for y in range(y0, y1):                             # the collar slab
        for x in range(x0, x1):
            f = 1.06 if y < y0+3 else 0.95
            px[x, y] = noise(dim(PALE, f), r, 4) + (255,)
    for y in range(y0+6, y1-6):                         # the basin floor, lower value
        for x in range(x0+4, x1-4):
            px[x, y] = noise(dim(PALE, 0.78), r, 5) + (255,)
    for y in range(y0+8, y1-8):                         # the dark weir mouth
        for x in range(x0+11, x1-11):
            px[x, y] = dim(PALE, 0.32) + (255,)
    for y in range(y1, min(C, y1+14)):                  # the dry stain fan, south
        t = (y-y1)/14.0
        w = int(6 + 8*t)
        for x in range(22-w, 22+w):
            if 0 <= x < C and r.random() < 0.8:
                px[x, y] = noise(dim(PALE, 0.8-0.12*t), r, 5) + (int(160*(1-t)),)
    if v == 1:                                          # a settlement crack across the collar
        for x in range(x0, x1):
            yy = y0+2+((x*7) % 3)
            px[x, yy] = dim(PALE, 0.68) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(3): tiles.append({'name': 'tr_deck_%d' % v,  'b64': b64(deck(v))})
for v in range(2): tiles.append({'name': 'tr_vent_%d' % v,  'b64': b64(vent(v))})
for v in range(2): tiles.append({'name': 'of_basin_%d' % v, 'b64': b64(basin(v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-020 '
           '(reservoir hardware; its form names tank roof and overflow as '
           'siblings): the buried reservoir\'s 3295 deck cells and 1028 '
           'overflow cells fell to fallbacks; jointed panel deck, mushroom '
           'vents and splash basins from the approved kerb pale and galv. '
           'tools/tfcook/TF-ART-020_roofdeck_cook.py',
    'family': 'TF-ART-020', 'cooked': '8/25/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d roof/overflow pieces -> %s' % (len(tiles), OUT))
