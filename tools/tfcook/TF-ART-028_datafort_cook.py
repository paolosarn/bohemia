#!/usr/bin/env python3
"""THE DATAFORT'S ROOFS AND COOLERS — the hall membrane, the generator
deck and the cooling units.

THE JOB (measured 8/27 on the walked world, cell 67,69): 'data hall'
x2966 - the hero mass, four hundred thousand square feet with no window
anywhere - draws as undifferentiated brown noise; 'second roof /
generator' x2167 (one blob 76x51!) the same; 'cooling unit' x1189 in 30
blobs from 1x1 singles to 49x12 yards draws as nothing. Three pieces:

  dh_0/1/2      the hall roof: pale single-ply membrane laid in sheet
                courses (N+W seam joints, self-seamless like the
                reservoir deck), thirty years of grey dirt streaking,
                the odd dark patch weld.
  gr_0/1/2      the generator-wing deck: darker galvanised standing-seam
                metal, rib lines one way, oil-dark staining near the odd
                seam.
  cu_0/1        one cooling unit per cell: a squat galv CRAC/chiller
                module nearly filling the cell, big fan ring with dark
                throat, rust weep on the old ones, riding on concrete.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale IS the membrane and the unit concrete.
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galvanised metal for the generator deck and unit bodies.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for weeps.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt: the
    approved earth for dirt streaking.
TASTE CHECK: no purple, no text, no self-light, no dot stipple; fan
rings are solid circle strokes, never dotted; seams are machinery and
may be straight; deterministic per variant.

  python3 tools/tfcook/TF-ART-028_datafort_cook.py
    -> banks/tileforms/TF-ART-028_CANDIDATES_8_27_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-028_CANDIDATES_8_27_26.json')
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
st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
EARTH = pools(load_b64(byid['dirt']['b64']))[0]

MEMB = tuple(min(255, int((p*0.62 + a*0.38)*1.04)) for p, a in zip(PALE, ALU))  # the membrane: kerb pale cooled toward galv so a roof never reads as desert sand

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mix(a, b, t): return tuple(int(av*(1-t) + bv*t) for av, bv in zip(a, b))
def noise(c, r, a=4):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def dhall(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11100 + v*43)
    for y in range(C):
        for x in range(C):
            c = noise(dim(MEMB, 0.97), r, 4)
            # thirty years of dirt: grey streaks running with the sheet
            if (x*7 + v*11) % 13 < 3: c = mix(c, EARTH, 0.10)
            px[x, y] = c + (255,)
    for x in range(C):                                  # N+W sheet seams, self-seamless
        px[x, 0] = noise(dim(MEMB, 0.86), r, 3) + (255,)
        px[x, 1] = noise(dim(MEMB, 1.08), r, 3) + (255,)
    for y in range(C):
        px[0, y] = noise(dim(MEMB, 0.86), r, 3) + (255,)
        if y > 1: px[1, y] = noise(dim(MEMB, 1.08), r, 3) + (255,)
    if v == 1:                                          # a patch weld, off-square
        pxx, pyy = r.randint(10, 26), r.randint(10, 26)
        for dy in range(7):
            for dx in range(9 - (dy % 2)):
                px[pxx+dx, pyy+dy] = noise(dim(MEMB, 0.82), r, 4) + (255,)
    if v == 2:                                          # a ponded-dirt ring, the drain that clogged
        cxp, cyp = r.randint(16, 28), r.randint(16, 28)
        for a in range(0, 360, 4):
            xx = int(cxp + 8*math.cos(math.radians(a)))
            yy = int(cyp + 6*math.sin(math.radians(a)))
            if 0 <= xx < C and 0 <= yy < C:
                px[xx, yy] = mix(px[xx, yy][:3], EARTH, 0.35) + (255,)
    return im

def groof(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11200 + v*47)
    base = dim(ALU, 0.9)
    for y in range(C):
        for x in range(C):
            c = noise(base, r, 4)
            if x % 11 == 0: c = dim(c, 1.14)            # standing-seam ribs
            elif x % 11 == 10: c = dim(c, 0.85)
            px[x, y] = c + (255,)
    if v == 1:                                          # the oil-dark stain
        sx, sy = r.randint(8, 30), r.randint(8, 30)
        for k in range(30):
            for dy in range(-1, 2):
                for dx in range(-1, 2):
                    xx, yy = sx+dx, sy+dy
                    if 0 <= xx < C and 0 <= yy < C and r.random() < 0.6:
                        px[xx, yy] = mix(px[xx, yy][:3], (30, 28, 24), 0.4) + (255,)
            sx += r.choice((-1, 0, 1)); sy += r.choice((0, 1))
            sx = max(1, min(C-2, sx)); sy = max(1, min(C-2, sy))
    if v == 2:                                          # rust bleeding down a seam
        rx = 11 * r.randint(1, 3)
        for y in range(r.randint(4, 12), C):
            if r.random() < 0.8:
                px[rx, y] = mix(px[rx, y][:3], RUST, 0.5) + (255,)
                if r.random() < 0.4: px[rx+1, y] = mix(px[rx+1, y][:3], RUST, 0.3) + (255,)
    return im

def cunit(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11300 + v*53)
    for y in range(C):                                  # the concrete it sits on
        for x in range(C):
            px[x, y] = noise(dim(PALE, 0.88), r, 4) + (255,)
    x0, y0, x1, y1 = 4, 5, C-4, C-6                     # the unit body
    body = dim(ALU, 0.98 if v == 0 else 0.9)
    for y in range(y0, y1):
        for x in range(x0, x1):
            c = noise(body, r, 4)
            t = (y-y0)/float(y1-y0)
            px[x, y] = dim(c, 1.08 - 0.18*t) + (255,)
    for x in range(x0, x1):                             # edges
        px[x, y0] = dim(body, 1.25) + (255,)
        px[x, y1-1] = dim(body, 0.5) + (255,)
    for y in range(y0, y1):
        px[x0, y] = dim(body, 1.1) + (255,)
        px[x1-1, y] = dim(body, 0.55) + (255,)
    cxf, cyf = C//2, (y0+y1)//2                         # the fan: solid ring + dark throat
    for a in range(0, 360, 3):
        for rad in (12, 11):
            xx = int(cxf + rad*math.cos(math.radians(a)))
            yy = int(cyf + rad*0.8*math.sin(math.radians(a)))
            if x0 < xx < x1 and y0 < yy < y1:
                px[xx, yy] = dim(body, 0.62) + (255,)
    for dy in range(-9, 10):                            # the throat, a filled dark ellipse
        for dx in range(-11, 12):
            if (dx/11.0)**2 + (dy/9.0)**2 <= 0.68:
                xx, yy = cxf+dx, cyf+dy
                if x0 < xx < x1 and y0 < yy < y1:
                    px[xx, yy] = noise(dim(body, 0.42), r, 3) + (255,)
    for dy in range(-6, 7):                             # the still blades, a dark cross
        if abs(dy) > 1:
            px[cxf, cyf+dy] = dim(body, 0.7) + (255,)
            px[cxf+dy, cyf] = dim(body, 0.7) + (255,)
    if v == 1:                                          # the old unit rusts at the base
        for k in range(10):
            bx2 = r.randint(x0+2, x1-3); by2 = r.randint(y1-6, y1-2)
            for dx in range(-1, 2):
                if r.random() < 0.6: px[bx2+dx, by2] = RUST + (110,)
    for x in range(x0+2, x1+3):                         # ground shadow south
        for k in range(3):
            y = y1 + k
            if y < C: px[x, y] = (12, 10, 8, 60-16*k)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(3): tiles.append({'name': 'dh_%d' % v, 'b64': b64(dhall(v))})
for v in range(3): tiles.append({'name': 'gr_%d' % v, 'b64': b64(groof(v))})
for v in range(2): tiles.append({'name': 'cu_%d' % v, 'b64': b64(cunit(v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-028: the '
           'datafort\'s 2,966 data-hall cells, 2,167 generator-roof cells and '
           '1,189 cooling units drew as brown noise; membrane, standing-seam '
           'deck and fan units from the approved kerb pale, galv, rail-plate '
           'rust and dirt. tools/tfcook/TF-ART-028_datafort_cook.py',
    'family': 'TF-ART-028', 'cooked': '8/27/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d datafort tiles -> %s' % (len(tiles), OUT))
