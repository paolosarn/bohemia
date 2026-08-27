#!/usr/bin/env python3
"""PROPANE TANKS + ICE BRIDGES — what fed the transmitters and what
carried their cables.

THE JOB (measured 8/27 on the walked world, radio cell 37,26): 'propane
tank / ice bridge' x3376 in 139 blobs and every cell drew plain ground.
The dims sort the name into its two real things: dozens of SMALL blobs
(1x2, 2x2, 3x2 - the tank banks that fed the backup generators) and
long THIN runs (21x3, 39x7 - the elevated ICE BRIDGE cable trays that
carry the feed lines from hut to tower). Two pieces:

  pt_tank_0/1   one horizontal propane cylinder per cell - bleached
                white steel, rounded ends, dark saddle shadow beneath,
                the odd rust bloom at a weld. Cells in a bank read as
                a tank row, which is what a real generator yard is.
  ib_h_0/1,     the ice bridge from above: a galvanised tray ribbon
  ib_v_0/1      down the cell's axis - lit rim both sides, crosswise
                rib ticks, a post shadow at each end of the span.

THE SPLIT, per cell (axis walks, cap 8): thin axis <=3 AND long axis
>=5 is a BRIDGE RUN along the long axis; everything else is TANKS.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale is the bleached tank white.
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galv is the tray steel.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for weld blooms.
TASTE CHECK: no purple, no text, no self-light, no dots; the tank is a
cylinder from the 45 (ellipse ends, lit crown line); tray ribs are
machinery and may be straight.

  python3 tools/tfcook/TF-ART-031_tank_icebridge_cook.py
    -> banks/tileforms/TF-ART-031_CANDIDATES_8_27_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-031_CANDIDATES_8_27_26.json')
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
ALU  = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a')), key=lambda c: sum(c))
RUST = pools(bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0'))[0]
WHITE = tuple(min(255, int(c*1.12)) for c in PALE)

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=4):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def tank(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11900 + v*71)
    x0, x1 = 4, C-4
    cy0, ry = 22, 9                                     # the cylinder's centreline and radius
    for x in range(x0, x1):
        # rounded ends: shrink the radius inside the last 6px each side
        edge = min(x-x0, x1-1-x)
        rr = ry if edge >= 6 else int(ry * (0.35 + 0.65*(edge/6.0)))
        for dy in range(-rr, rr+1):
            y = cy0 + dy
            t2 = abs(dy)/float(ry)
            c = noise(dim(WHITE, 1.1 - 0.5*t2*t2), r, 4)
            if dy > rr-3: c = dim(c, 0.72)              # the belly falls into shadow
            px[x, y] = c + (255,)
    for x in range(x0+2, x1-2):                          # the lit crown line
        px[x, cy0-ry+3] = noise(dim(WHITE, 1.22), r, 3) + (255,)
    for sx in (x0+7, x1-9):                              # saddle shadows on the ground
        for dx in range(4):
            y = cy0 + ry + 1
            if y < C: px[sx+dx, y] = (12, 10, 8, 90)
            if y+1 < C: px[sx+dx, y+1] = (12, 10, 8, 50)
    if v == 1:                                           # rust bloom at the girth weld
        wx2 = (x0+x1)//2 + r.randint(-4, 4)
        for dy in range(-ry+2, ry-2):
            if r.random() < 0.55:
                px[wx2, cy0+dy] = RUST + (120,)
    px[(x0+x1)//2, cy0-ry+1] = dim(ALU, 0.8) + (255,)    # the valve dome peeking over the crown
    px[(x0+x1)//2+1, cy0-ry+1] = dim(ALU, 1.05) + (255,)
    return im

def bridge(axis, v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(12000 + v*73 + (axis == 'v'))
    w0, w1 = 16, 28                                      # the tray ribbon span
    for t in range(C):
        for k in range(w0, w1):
            c = noise(dim(ALU, 0.98), r, 4)
            if k == w0 or k == w1-1: c = dim(c, 1.2)     # lit rims
            elif k == w0+1 or k == w1-2: c = dim(c, 0.8)
            if t % 7 == 3: c = dim(c, 0.88)              # crosswise rib ticks
            if axis == 'h': px[t, k] = c + (255,)
            else: px[k, t] = c + (255,)
    for t in (5, 27):                                    # post shadows at the span ends
        for k in range(w1, min(C, w1+3)):
            if axis == 'h':
                px[t, k] = (12, 10, 8, 80); px[t+1, k] = (12, 10, 8, 80)
            else:
                px[k, t] = (12, 10, 8, 80); px[k, t+1] = (12, 10, 8, 80)
    if v == 1:                                           # one rust streak down a rib
        t2 = r.randint(8, 34)
        for k in range(w0+2, w1-2):
            if r.random() < 0.7:
                if axis == 'h': px[t2, k] = RUST + (110,)
                else: px[k, t2] = RUST + (110,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(2): tiles.append({'name': 'pt_tank_%d' % v, 'b64': b64(tank(v))})
for v in range(2): tiles.append({'name': 'ib_h_%d' % v, 'b64': b64(bridge('h', v))})
for v in range(2): tiles.append({'name': 'ib_v_%d' % v, 'b64': b64(bridge('v', v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-031: the '
           'radio site\'s 3,376 propane-tank and ice-bridge cells (139 blobs) '
           'drew as plain ground; bleached tank cylinders and galvanised tray '
           'runs from the approved kerb pale, galv and rail-plate rust. '
           'tools/tfcook/TF-ART-031_tank_icebridge_cook.py',
    'family': 'TF-ART-031', 'cooked': '8/27/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d tank/ice-bridge tiles -> %s' % (len(tiles), OUT))
