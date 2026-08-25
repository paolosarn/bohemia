#!/usr/bin/env python3
"""RIPRAP — the wash's rock armor.

THE JOB: 'riprap' x936 (measured 8/25) - two 115x3 ARMOR STRIPS running
the channel edges plus scattered rock patches, all falling to the gravel
fallback. Riprap is dumped angular rock protecting a flood channel's
banks from scour; from above it reads as a PACKED FIELD of tumbled
stones - lit top facets, shadowed sides, dark earth gaps - with no order
at all. Three full-cell opaque tiles (rip_0/1/2), stones placed by a
per-variant hash so the strip never wallpapers; gaps are baked dirt so
neighbouring cells read as one continuous rock field.

45 LAW + craft: every stone is a lit-facet / shadow-facet value pair
(sky light from the north), never an outline ring and never dot stipple;
stones are 6-13px - one pixel of facet step reads at cell scale, three
would be mud.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete pool IS the limestone facet (Vegas washes
    are armored in local pale caliche rock).
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt: the
    approved earth for the gaps between stones, dimmed for shadow.
TASTE CHECK: no purple, no readable text, no self-light; dead world -
the rock is dusty, never wet (deep_wet is weather's, not this kit's).

  python3 tools/tfcook/TF-ART-023_riprap_cook.py
    -> banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json')
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
def noise(c, r, a=6):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

def riprap(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(9700+v*31)
    for y in range(C):                                  # the earth gaps first
        for x in range(C):
            px[x, y] = noise(dim(EARTH, 0.62), r, 7) + (255,)
    # tumbled stones: packed, angular, no order
    stones = []
    for k in range(26):
        sx, sy = r.randint(-3, C-2), r.randint(-3, C-2)
        sr = r.randint(3, 7)
        stones.append((sx, sy, sr, r.random()*math.pi))
    for sx, sy, sr, ang in stones:
        warm = r.random() < 0.3                         # a third of the rock is warmer
        base = dim(PALE, 0.98) if not warm else tuple(
            min(255, int(c*f)) for c, f in zip(PALE, (1.02, 0.94, 0.82)))
        for y in range(max(0, sy-sr-1), min(C, sy+sr+2)):
            for x in range(max(0, sx-sr-1), min(C, sx+sr+2)):
                dx, dy = x-sx, y-sy
                a = math.atan2(dy, dx) - ang
                edge = sr * (1.0 + 0.28*math.sin(3*a) + 0.15*math.cos(5*a))
                if dx*dx + dy*dy <= edge*edge:
                    d2 = (dx*dx+dy*dy) / max(1.0, edge*edge)
                    if dy < -edge*0.25: f = 1.12        # the lit north facet
                    elif dy > edge*0.35 or d2 > 0.72: f = 0.68   # shadow facet
                    else: f = 0.9
                    px[x, y] = noise(dim(base, f), r, 6) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [{'name': 'rip_%d' % v, 'b64': b64(riprap(v))} for v in range(3)]

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-023: the '
           'wash\'s 936 riprap cells fell to the gravel fallback; packed rock '
           'armor cooked from the approved kerb pale (the caliche facet) and '
           'the approved dirt (the gaps). tools/tfcook/TF-ART-023_riprap_cook.py',
    'family': 'TF-ART-023', 'cooked': '8/25/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d riprap tiles -> %s' % (len(tiles), OUT))
