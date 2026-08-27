#!/usr/bin/env python3
"""WASTE FILL — the landfill's compacted trash, the fill itself.

THE JOB (measured 8/27 on the walked world): 'waste fill' is 6,400-6,800
cells PER LANDFILL CELL - the dominant surface of the whole district -
and it draws as the same gravel fallback as every unclaimed ground. The
dossier calls it "compacted trash - the picked-over landscape of the
dump", and thirty years after the crash that is a REAL surface: daily
cover soil rolled over refuse, the cover worn through in patches, the
trash beneath sun-bleached to dun and bone. Three variants:

  wf_0/1/2      compacted fill: earth base with worn-through refuse
                patches (darker, chaotic), sparse bleached flecks (the
                plastic and paper that never rots, faded to pale),
                the odd rust scrap. One variant carries a compactor
                track pass as a broad value band, the machine long dead.

REUSE CHECK: (banks OPENED in code)
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt: the
    approved earth IS the cover soil.
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale pool is the sun-bleached plastic/paper flecks.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust reads as the scrap metal in the fill.
TASTE CHECK: no purple, no readable text, no self-light, no dot stipple
(flecks are 2-4px off-shape clusters, never single-pixel salt); the
refuse patches WANDER (8/1 craft law); deterministic per variant.

  python3 tools/tfcook/TF-ART-026_wastefill_cook.py
    -> banks/tileforms/TF-ART-026_CANDIDATES_8_27_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-026_CANDIDATES_8_27_26.json')
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

st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
EARTH = pools(load_b64(byid['dirt']['b64']))[0]
PALE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne')), key=lambda c: sum(c))
# the rust pool: the reddest color on the approved rail plate (same channel
# test TF-ART-022 used - red leads both green and blue or it is not rust)
_rp = bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0')
_rpx = _rp.load(); _rust = []
for y in range(_rp.height):
    for x in range(_rp.width):
        c = _rpx[x, y]
        if c[3] > 200 and c[0] > c[2] + 30 and c[0] > c[1] + 10: _rust.append(c[:3])
RUST = tuple(sum(v[i] for v in _rust)//len(_rust) for i in range(3)) if _rust else (110, 70, 48)

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mix(a, b, t): return tuple(int(av*(1-t) + bv*t) for av, bv in zip(a, b))
def noise(c, r, a=5):
    j = r.randint(-a, a); return tuple(max(0, min(255, v+j)) for v in c)

REFUSE = dim(EARTH, 0.62)                    # the trash showing through, dark chaos
BLEACH = mix(PALE, EARTH, 0.25)              # sun-dead plastic and paper

def wfill(v):
    im = Image.new('RGBA', (C, C), (0, 0, 0, 0)); px = im.load()
    r = random.Random(10800 + v*37)
    for y in range(C):
        for x in range(C):
            lane = 1.0
            if v == 2:                       # one variant: a compactor track pass
                dd = abs(x - (y//3) - 16)
                if dd < 6: lane = 0.9 + 0.017*dd
            px[x, y] = noise(dim(EARTH, 0.94*lane), r, 6) + (255,)
    # worn-through refuse patches: wandering blobs of dark chaos where the
    # cover soil failed - grown from seeds by drunk walk, never a disc
    for k in range(r.randint(4, 6)):
        wx, wy = r.randint(4, C-5), r.randint(4, C-5)
        for step in range(r.randint(14, 26)):
            for dy in range(-1, 2):
                for dx in range(-1, 2):
                    xx, yy = wx+dx, wy+dy
                    if 0 <= xx < C and 0 <= yy < C and r.random() < 0.7:
                        px[xx, yy] = noise(dim(REFUSE, r.choice((0.85, 1.0, 1.15))), r, 7) + (255,)
            wx += r.choice((-1, 0, 1)); wy += r.choice((-1, 0, 1))
            wx = max(1, min(C-2, wx)); wy = max(1, min(C-2, wy))
    # the stuff that never rots: bleached flecks and rust scraps as little
    # OFF shapes, 2-4px, clustered where the refuse shows (not salt)
    for k in range(r.randint(5, 8)):
        fx, fy = r.randint(1, C-4), r.randint(1, C-4)
        col = BLEACH if r.random() < 0.72 else RUST
        w, h = r.randint(2, 3), r.randint(1, 2)
        ox = r.choice((0, 1))
        for dy in range(h):
            for dx in range(w - (dy and ox)):
                xx, yy = fx+dx+(dy and ox), fy+dy
                if 0 <= xx < C and 0 <= yy < C:
                    px[xx, yy] = noise(dim(col, r.choice((0.9, 1.05))), r, 5) + (255,)
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = [{'name': 'wf_%d' % v, 'b64': b64(wfill(v))} for v in range(3)]

json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-ART-026: the '
           'landfill\'s dominant surface (6,400+ waste-fill cells per district '
           'cell, measured 8/27) fell to the gravel fallback; compacted fill '
           'with worn-through refuse, bleach flecks and rust scrap from the '
           'approved dirt, kerb pale and rail-plate rust. '
           'tools/tfcook/TF-ART-026_wastefill_cook.py',
    'family': 'TF-ART-026', 'cooked': '8/27/26',
    'tiles': tiles,
}, open(OUT, 'w'))
print('banked %d waste-fill tiles -> %s' % (len(tiles), OUT))
