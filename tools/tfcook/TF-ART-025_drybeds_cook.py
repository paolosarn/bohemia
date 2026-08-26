#!/usr/bin/env python3
"""DRY BEDS — the exposed lakebed and the quarry floors.

THE JOB (fresh ranking 8/26): 'exposed lakebed' x4109 at the intake -
Lake Mead's drought bed, the most famous dead surface in Nevada - plus
'hardpan' x1223 at the terminal, and 'quarry floor' x3691+x3699 at the
quarry and gypsum pits. All fall to the gravel fallback. Two grounds:

  bed_0/1/2     the drought bed: pale silt cracked into POLYGONS - the
                desiccation network every photo of Mead's bathtub shows.
                Crack lines are dark continuous 1px paths wandering
                between plate centres, never straight, never dots.
  qf_0/1/2      the working pit floor: pale bench rock swept flat by
                thirty years of loaders, faint broad wheel-lanes as
                value bands (the machines are gone; their compaction
                stays).

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale pool IS the silt and the gypsum bench.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt: the
    approved earth for crack shadows and lane grime.
TASTE CHECK: no purple, no text, no self-light, no dot stipple; the
polygon cracks are little OFF shapes (8/1 craft law - no straight
lines), deterministic per variant.

  python3 tools/tfcook/TF-ART-025_drybeds_cook.py
    -> banks/tileforms/TF-ART-025_CANDIDATES_8_26_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-025_CANDIDATES_8_26_26.json')
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

SILT = tuple(min(255, int(c*f)) for c, f in zip(PALE, (1.02, 0.99, 0.9)))   # warm drought silt

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def bed(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(10600+v*29)
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(dim(SILT, 0.97), r, 5) + (255,)
    # the polygon net: seed centres, then wander a crack between each
    # neighbouring pair - wobbly paths, never rulers
    pts = [(r.randint(2, C-3), r.randint(2, C-3)) for _ in range(7)]
    pts += [(0, r.randint(4, C-5)), (C-1, r.randint(4, C-5)),
            (r.randint(4, C-5), 0), (r.randint(4, C-5), C-1)]
    for i in range(len(pts)):
        for j in range(i+1, len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[j]
            d2 = (x0-x1)**2 + (y0-y1)**2
            if d2 > 26*26 or d2 < 6*6: continue
            steps = int(math.sqrt(d2))
            wob = 0.0
            for t in range(steps+1):
                f = t/float(max(1, steps))
                wob += r.uniform(-0.9, 0.9); wob *= 0.82
                xx = int(round(x0 + (x1-x0)*f + wob))
                yy = int(round(y0 + (y1-y0)*f - wob*0.6))
                if 0 <= xx < C and 0 <= yy < C:
                    px[xx, yy] = noise(dim(EARTH, 0.55), r, 5) + (255,)
                    # curl the plate edge: a lit lip on the sun side of the crack
                    if 0 <= xx < C and yy-1 >= 0 and r.random() < 0.5:
                        px[xx, yy-1] = noise(dim(SILT, 1.08), r, 4) + (255,)
    return im

def qfloor(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(10700+v*31)
    for y in range(C):
        for x in range(C):
            # broad wheel-lane bands: two shallow value dips per cell width
            lane = 1.0
            for lx in (11, 30):
                dd = abs(x-lx)
                if dd < 5: lane = min(lane, 0.9 + 0.02*dd)
            px[x, y] = noise(dim(PALE, 0.93*lane), r, 5) + (255,)
    for k in range(r.randint(3, 5)):                      # loose spall stones
        sx, sy = r.randint(1, C-4), r.randint(1, C-4)
        for dy in range(2):
            for dx in range(r.randint(2, 3)):
                px[sx+dx, sy+dy] = noise(dim(PALE, r.choice((0.78, 1.08))), r, 5) + (255,)
    if v == 2:                                            # a blast-scar drag line
        yy = r.randint(8, 34)
        for x in range(C):
            yy += r.choice((-1, 0, 0, 1))
            if 0 <= yy < C: px[x, yy] = noise(dim(EARTH, 0.7), r, 5) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
for v in range(3): tiles.append({'name': 'bed_%d' % v, 'b64': b64(bed(v))})
for v in range(3): tiles.append({'name': 'qf_%d' % v,  'b64': b64(qfloor(v))})

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-025: the '
           'intake\'s 4109 exposed-lakebed cells, the terminal\'s 1223 hardpan '
           'and the two pits\' 7390 quarry-floor cells fell to the gravel '
           'fallback; drought-bed polygons and swept bench floor from the '
           'approved kerb pale and dirt. tools/tfcook/TF-ART-025_drybeds_cook.py',
    'family': 'TF-ART-025', 'cooked': '8/26/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d dry-bed tiles -> %s' % (len(tiles), OUT))
