#!/usr/bin/env python3
"""THE LIBRARY'S PLAZAS — scored civic paving, the plinth terrace and
the dead planters.

THE JOB (measured 8/27 on the walked world, cell 40,28): the library /
museum names a full civic plaza family and every cell of it falls to
gravel - 'terrace / plinth' x2379, 'forecourt ground' x1574, 'entry
plaza' x1171, 'courtyard' x775, 'plaza planter' x516. Three pieces:

  pz_0/1/2      the civic paving: pale concrete in a SCORED GRID (two
                score lines per cell each way - half-metre saw joints),
                thirty years of grime settled INTO the joints, the odd
                spall. Entry plaza, forecourt and courtyard share it.
  tp_0/1/2      the plinth terrace: the same concrete family a half
                step lighter in bigger slabs (one joint per cell each
                way) - the raised base a civic building stands on
                always reads cleaner because rain sheets off it.
  pp_0/1        the planter: a raised concrete box rim around dead
                soil, one dry straw rosette off-centre (the shrub that
                died when the drip irrigation stopped), rim lit north,
                shaded south.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete IS the paving and the planter rim.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt: the
    approved earth for joint grime and planter soil.
  banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json - ls_agave_0: the
    approved dead-straw pool for the planter rosettes.
TASTE CHECK: no purple, no text, no self-light, no dot stipple; score
joints are machinery and may be straight; the rosette radiates in
little off strokes (8/1 law); deterministic per variant.

  python3 tools/tfcook/TF-ART-029_civicplaza_cook.py
    -> banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json')
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
# the dead straw: the warmest pool on the approved agave overlay
_ag = pools(bank_tile('banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json', 'ls_agave_0'), n=6)
_warm = [c for c in _ag if c[0] > c[2]] or _ag
_sbase = max(_warm, key=lambda c: sum(c))
STRAW = tuple(int(s2*0.55 + p2*0.45) for s2, p2 in zip(_sbase, PALE))  # lifted toward the pale - dead straw reads LIGHTER than the soil it died in

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mix(a, b, t): return tuple(int(av*(1-t) + bv*t) for av, bv in zip(a, b))
def noise(c, r, a=4):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def paving(v, seed, lift, joints):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(seed + v*59)
    base = dim(PALE, lift)
    for y in range(C):
        for x in range(C):
            c = noise(base, r, 4)
            onj = (x % joints in (0, 1)) or (y % joints in (0, 1))
            if x % joints == 0 or y % joints == 0:
                c = mix(dim(c, 0.82), EARTH, 0.22)      # the joint, grime settled in
            elif x % joints == 1 or y % joints == 1:
                c = dim(c, 1.06)                        # the lit arris beside it
            px[x, y] = c + (255,)
    if v == 1:                                          # a spalled corner patch
        sx, sy = r.randint(6, 30), r.randint(6, 30)
        for dy in range(5):
            for dx in range(7 - dy):
                px[sx+dx, sy+dy] = noise(mix(base, EARTH, 0.3), r, 5) + (255,)
    if v == 2:                                          # a hairline crack wandering
        xx = r.randint(8, 34); wob = 0.0
        for y in range(C):
            wob += r.uniform(-0.8, 0.8); wob *= 0.8
            xi = int(xx + wob)
            if 0 <= xi < C: px[xi, y] = mix(px[xi, y][:3], EARTH, 0.3) + (255,)
    return im

def planter(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11500 + v*61)
    base = dim(PALE, 0.97)
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(base, r, 4) + (255,)
    x0, y0, x1, y1 = 3, 3, C-3, C-3                     # the box rim
    for y in range(y0, y1):
        for x in range(x0, x1):
            edge = min(x-x0, x1-1-x, y-y0, y1-1-y)
            if edge < 3:                                # the concrete rim
                c = noise(dim(PALE, 1.02), r, 4)
                if y-y0 < 3: c = dim(c, 1.12)           # lit north
                if y1-1-y < 3: c = dim(c, 0.78)         # shaded south
                px[x, y] = c + (255,)
            else:                                       # the dead soil
                px[x, y] = noise(dim(EARTH, 0.85), r, 6) + (255,)
    cxp = C//2 + r.randint(-6, 6); cyp = C//2 + r.randint(-4, 4)
    for k in range(11):                                 # the dry rosette, off strokes
        a = k*(360/11.0) + r.uniform(-9, 9)
        ln = r.randint(5, 9)
        for t in range(ln):
            xx = int(cxp + t*math.cos(math.radians(a)))
            yy = int(cyp + t*0.8*math.sin(math.radians(a)))
            if x0+3 <= xx < x1-3 and y0+3 <= yy < y1-3:
                px[xx, yy] = noise(dim(STRAW, 1.0 - 0.04*t), r, 5) + (255,)
    px[cxp, cyp] = dim(EARTH, 0.5) + (255,)             # the dark heart
    if v == 1:                                          # one rim corner spalled
        for dy in range(3):
            for dx in range(4-dy):
                px[x0+dx, y0+dy] = noise(mix(base, EARTH, 0.35), r, 5) + (255,)
    return im

def bed_soil(v):
    """The interior of a planter BED - soil edge to edge, a rosette on
    about half the cells. LIVE LOOK 8/27: a 5x7 planter blob drew 35
    individual boxes and read as a waffle; a real plaza planter that
    size is ONE BED with a rim at its edge, so the rim became edge
    overlays and the inside became this."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11600 + v*67)
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(dim(EARTH, 0.85), r, 6) + (255,)
    if v != 1:
        cxp = C//2 + r.randint(-9, 9); cyp = C//2 + r.randint(-9, 9)
        for k in range(11):
            a = k*(360/11.0) + r.uniform(-9, 9)
            ln = r.randint(5, 9)
            for t in range(ln):
                xx = int(cxp + t*math.cos(math.radians(a)))
                yy = int(cyp + t*0.8*math.sin(math.radians(a)))
                if 0 <= xx < C and 0 <= yy < C:
                    px[xx, yy] = noise(dim(STRAW, 1.0 - 0.04*t), r, 5) + (255,)
        px[cxp, cyp] = dim(EARTH, 0.5) + (255,)
    return im

def bed_rim(side):
    """One rim strip, alpha overlay: lit on the north face, shaded south,
    neutral east/west."""
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(11700 + ord(side[0]))
    f = {'n': 1.12, 's': 0.78, 'e': 0.95, 'w': 1.02}[side]
    for k in range(3):
        for t in range(C):
            c = noise(dim(PALE, 1.02*f), r, 4) + (255,)
            if side == 'n': px[t, k] = c
            elif side == 's': px[t, C-1-k] = c
            elif side == 'w': px[k, t] = c
            else: px[C-1-k, t] = c
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(3): tiles.append({'name': 'pz_%d' % v, 'b64': b64(paving(v, 11400, 0.94, 11))})
for v in range(3): tiles.append({'name': 'tp_%d' % v, 'b64': b64(paving(v, 11450, 1.03, 22))})
for v in range(2): tiles.append({'name': 'pp_%d' % v, 'b64': b64(planter(v))})
for v in range(3): tiles.append({'name': 'pp_soil_%d' % v, 'b64': b64(bed_soil(v))})
for s in ('n', 's', 'e', 'w'): tiles.append({'name': 'pp_rim_%s' % s, 'b64': b64(bed_rim(s))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-029: the '
           'library\'s 6,415 civic plaza cells (terrace/plinth, forecourt, '
           'entry plaza, courtyard, planters) fell to gravel; scored civic '
           'paving, plinth slabs and dead planters from the approved kerb '
           'pale, dirt and agave straw. '
           'tools/tfcook/TF-ART-029_civicplaza_cook.py',
    'family': 'TF-ART-029', 'cooked': '8/27/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d civic plaza tiles -> %s' % (len(tiles), OUT))
