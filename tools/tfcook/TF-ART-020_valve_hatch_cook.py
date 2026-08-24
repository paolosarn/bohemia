#!/usr/bin/env python3
"""VALVE / HATCH — the reservoir's lids and vault covers.

THE JOB: 'valve / hatch' x1434 (measured 8/24 on the walked world) - the
tank pad ring and the transmission-main corridors are studded with named
valve/hatch cells, and every one falls to the gravel fallback today, so
the concrete pad reads pockmarked with dirt. The measurement says two
shapes: dozens of 1x1 SINGLES (a lone access lid on the pad) and long
sparse RUNS following the pipe corridors (4x51, 9x34, 8x32 - a buried
main is serviced through a line of vault covers). So two pieces:

  vh_round_*    a round steel access lid, one per cell, centered: an
                ellipse per the 45 law (sky-lit top rim, shadowed foot),
                hinge bar, no bolt stipple - value planes only
  vh_vault_h_*  a rectangular two-leaf valve vault cover, run axis
  vh_vault_v_*  horizontal / vertical: concrete collar, two steel
                leaves with the centre seam, lit north/west edge

Both are RGBA overlays that ride on bought concrete (the wiring draws the
pad's own concrete first, so a hatch cell is pad-with-hardware, never its
own material island).

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galv steel IS the lid metal (harvest by LUMINANCE ROLE).
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for weep stains around thirty-year-old lids.
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne: the
    approved pale concrete for the vault collar.
TASTE CHECK: no readable text or utility markings (words are his), no
purple, no self-light, no dot stipple (dots-as-texture banned 8/21);
desert aging is dust + rust weep only, never green.

  python3 tools/tfcook/TF-ART-020_valve_hatch_cook.py
    -> banks/tileforms/TF-ART-020_CANDIDATES_8_24_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-020_CANDIDATES_8_24_26.json')
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
CONC = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne')), key=lambda c: sum(c))
rp = bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0')
RUST = None
px = rp.load()
seen = {}
for y in range(rp.height):
    for x in range(rp.width):
        c = px[x, y]
        if c[3] > 200 and c[0] > c[2]+30 and c[0] > c[1]+10:
            k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
if seen:
    p = sorted(seen.values(), key=len, reverse=True)[0]
    RUST = tuple(sum(v[i] for v in p)//len(p) for i in range(3))
if RUST is None: raise SystemExit('no rust pool in rail_plate_0')

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=6):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)
def new(): return Image.new('RGBA', (C, C), (0, 0, 0, 0))

def round_lid(v):
    """one access lid: an ellipse (45 law), sky-lit north rim, shadowed foot."""
    im = new(); px = im.load(); r = random.Random(9100+v)
    cx, cy = 22, 22
    rx, ry = 11, 9                                    # ellipse, never a circle
    for y in range(C):
        for x in range(C):
            d = ((x-cx)/float(rx))**2 + ((y-cy)/float(ry))**2
            if d <= 1.0:
                f = 0.72 if d > 0.8 else (0.92 if y > cy else 1.0)
                if d > 0.8 and y < cy: f = 1.12       # the lit north rim
                px[x, y] = noise(dim(GALV, f*0.8), r, 5) + (255,)
    for x in range(cx-7, cx+8):                       # the hinge bar, one line
        px[x, cy] = dim(GALV, 0.55) + (255,)
    for y in range(cy+ry, min(C, cy+ry+3)):           # ground shadow at the foot
        for x in range(cx-8, cx+9):
            if ((x-cx)/9.0)**2 <= 1.0:
                px[x, y] = (0, 0, 0, 60)
    if v == 1:                                        # rust weep off the low side
        for y in range(cy+ry, min(C, cy+ry+6)):
            a = int(80*(1.0-(y-cy-ry)/6.0))
            px[cx+4, y] = dim(RUST, 0.9) + (a,)
            px[cx-5, y] = dim(RUST, 0.8) + (a-12 if a > 12 else 0,)
    return im

def vault(axis, v):
    """a two-leaf vault cover in a concrete collar, long side on the run axis."""
    im = new(); px = im.load(); r = random.Random(9200+v+(0 if axis == 'h' else 7))
    if axis == 'h': x0, y0, x1, y1 = 2, 10, 42, 34
    else:           x0, y0, x1, y1 = 10, 2, 34, 42
    for y in range(y0, y1):                           # the collar
        for x in range(x0, x1):
            px[x, y] = noise(dim(CONC, 0.95), r, 4) + (255,)
    gx0, gy0, gx1, gy1 = x0+3, y0+3, x1-3, y1-3
    for y in range(gy0, gy1):                         # the steel leaves
        for x in range(gx0, gx1):
            f = 0.78
            if y == gy0 or x == gx0: f = 0.95         # lit north/west edge
            if y == gy1-1 or x == gx1-1: f = 0.6      # shadowed south/east
            px[x, y] = noise(dim(GALV, f*0.8), r, 5) + (255,)
    if axis == 'h':                                   # the centre seam
        mx = (gx0+gx1)//2
        for y in range(gy0, gy1): px[mx, y] = dim(GALV, 0.45) + (255,)
    else:
        my = (gy0+gy1)//2
        for x in range(gx0, gx1): px[x, my] = dim(GALV, 0.45) + (255,)
    for x in range(x0, x1):                           # collar edge shading
        px[x, y0] = dim(CONC, 1.08) + (255,)
        px[x, y1-1] = dim(CONC, 0.7) + (255,)
    if v == 1:                                        # a rust bloom on one leaf
        bx, by = r.randint(gx0+2, gx1-6), r.randint(gy0+2, gy1-5)
        for dy in range(3):
            for dx in range(4):
                if r.random() < 0.6:
                    px[bx+dx, by+dy] = noise(dim(RUST, 0.85), r, 6) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(2): tiles.append({'name': 'vh_round_%d' % v,   'b64': b64(round_lid(v))})
for v in range(2): tiles.append({'name': 'vh_vault_h_%d' % v, 'b64': b64(vault('h', v))})
for v in range(2): tiles.append({'name': 'vh_vault_v_%d' % v, 'b64': b64(vault('v', v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-020: the '
           'reservoir\'s 1434 valve/hatch cells fell to the gravel fallback; '
           'these lids and vault covers ride on bought concrete, steel from '
           'the approved galv, rust from the approved rail plate, collar from '
           'the approved kerb pale. tools/tfcook/TF-ART-020_valve_hatch_cook.py',
    'family': 'TF-ART-020', 'cooked': '8/24/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d valve/hatch pieces -> %s' % (len(tiles), OUT))
