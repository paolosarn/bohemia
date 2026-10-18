#!/usr/bin/env python3
"""COOK TWO, THE NEXT BLOCK (the coordinator's note 10/17 on his thirteenth votes, rule 115b): his NO on the Vegas block
was composition ('that shit looks like shit, but I'm glad you're using it to show me'), so the next block is ONE STREET
OF THE REAL REGION cut from the same tiles, with the roofs COOK FOUR tans. records/ only (rule 100); nothing drawn
(rule 108): every pixel is cut, padded, layered, placed or darkened from his purchased packs or COOK FOUR's tanned ranch.

WHAT THE STREET IS (realism first; an older east-valley Las Vegas tract, the kind the region's 1960s ranch rows are):
  * a LOCAL street, 11 m curb to curb (Clark County's 36 ft local), NO centre line, NO lane paint: a residential local
    carries none; it meets a COLLECTOR at the east end, which carries the yellow double line and does not stop;
  * the local stops: a white stop bar across its eastbound (south) half, and a CONCRETE VALLEY GUTTER across its mouth,
    the 1.8 m concrete swale every Las Vegas intersection has because the valley has no storm drains on locals;
  * 1.5 m attached sidewalks (one of his slabs is 1.44 m: his slab IS a five-foot sidewalk panel), the curb his slab's
    own south face where it faces the eye, a driveway apron where the curb drops at every garage and carport;
  * 6 m front yards (the 20 ft setback) in desert dirt from his soil tiles, his boulders and dry shrubs, his flagstones
    as the walk to a door; the houses are COOK FOUR's tanned ranch kinds at 1:1;
  * across the street, the south side is the BACK of the next tract: a 1.7 m block wall (his wall tile is 96 px tall =
    1.68 m at 57 px a metre, a six-foot Las Vegas wall) with the backyards behind it. That is why no house fronts the
    south side, and it is what a real Las Vegas street looks like.
ONE PIXEL SIZE: everything at his 1:1, 57 px a metre (COOK FOUR's body scale). His cars are 96 px (1.7 m) at 1:1 and a
scaled car is a mixel (rule 114, the first tell), and rule 115a makes every vehicle and standing prop the RIG's: so
no car, sign or lamp is placed; their slots are written to the JSON for the rig and COMBAT TWO.
  python3 tools/bohemia_cook2_one_real_street_10_18_26.py

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the card of numbers and skills/bohemia-pixel-art, AH-01 and AH-03.
The source is his own tiles and COOK FOUR's tanned ranch (reference/art_bank/settlement/COOK4_RANCH_TAN_*). No reference game.

REUSE CHECK (REUSE-FIRST, 7/22, written 10/18): his own tiles from the approved set (his HD tile repo and his 7/13 UP list, through the pack readers); every pixel cut, padded, layered or recoloured from them, nothing drawn (rule 108).

TASTE CHECK (written 10/18): his rulings on the ground are the bar: his 10/10 "look again at the tiles we downloaded", his UP on the curb, the crossing and the 47, his NO on the Vegas block (composition); the sheet goes to DIRECTION, then the VOTE tab.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S

PXM = 57.0                                       # COOK FOUR's body scale: the houses at 1:1
m = lambda metres: int(round(metres * PXM))
rng = np.random.RandomState(1018)
SOIL, ROCKS, DRY, DRY2, WALLS = '2. Soil and dirt tiles', 'Rocks and stones', '16. Dead trees and plants', '15. Dead Trees and dry plants', 'Wall tiles (1)'
TW, TH = 82, 81; FH = 7

# ---- the houses, west to east, with their doors (local x, measured on the sprites) -----------------------------------
HOUSES = [('CARPORT', {'door': 159, 'drive': (626, 840)}), ('GARAGE', {'door': 377, 'drive': (930, 1200)}),
          ('PLAIN', {'door': 430}), ('PORCH', {'door': 323})]
SIDE = 170                                        # side yard between two houses, ~3 m
spr = {k: np.asarray(Image.open(os.path.join(R, f'reference/art_bank/settlement/COOK4_RANCH_TAN_{k}.png')).convert('RGBA')) for k, _ in HOUSES}

# ---- the plan, in px --------------------------------------------------------------------------------------------------
X0 = 120
lots = []; x = X0
for k, d in HOUSES: lots.append((k, x, d)); x += spr[k].shape[1] + SIDE
WALK = m(1.5); STREET = m(11); YARD = m(6); COLL = m(14)            # the collector: two lanes and a turn lane, 14 m
HOUSE_BASE = 470                                  # the houses' feet
N_WALK = HOUSE_BASE + YARD - 40                   # the sprite's own shadow runs ~40 px under the wall line
N_CURB = N_WALK + WALK
S_CURB = N_CURB + STREET
S_WALK = S_CURB + WALK
WALL_TOP = S_WALK + m(1.0)                        # a metre of dirt, then the block wall
WALL_H = 96
H = WALL_TOP + WALL_H + 260
XC0 = x + 40                                      # the collector's west kerb line
XC1 = XC0 + COLL
W = XC1 + WALK + 220
RAD = m(6.0)                                      # the curb return radius, 20 ft, a residential corner

# zones: 0 road, 1 sidewalk, 2 yard, 3 concrete (aprons, walks, the valley gutter)
yy, xx = np.mgrid[0:H, 0:W]
road = ((yy >= N_CURB) & (yy < S_CURB)) | ((xx >= XC0) & (xx < XC1))
# the four curb returns: inside each corner square, what is farther than RAD from the arc centre is road
for (cx, cy, sx, sy) in ((XC0 - RAD, N_CURB - RAD, 1, 1), (XC0 - RAD, S_CURB + RAD, 1, -1),
                         (XC1 + RAD, N_CURB - RAD, -1, 1), (XC1 + RAD, S_CURB + RAD, -1, -1)):
    sq = ((xx - cx) * sx >= 0) & ((xx - cx) * sx < RAD) & ((yy - cy) * sy >= 0) & ((yy - cy) * sy < RAD)
    road |= sq & (np.hypot(xx - cx, yy - cy) > RAD)
raised = ~road
# distance to the road, exact from the geometry (the two streets' bands, and the arc inside each corner square)
d_ew = np.minimum(np.abs(yy - N_CURB), np.abs(yy - S_CURB)).astype(float)
d_ns = np.minimum(np.abs(xx - XC0), np.abs(xx - XC1)).astype(float)
dist = np.minimum(d_ew, d_ns)
for (cx, cy, sx, sy) in ((XC0 - RAD, N_CURB - RAD, 1, 1), (XC0 - RAD, S_CURB + RAD, 1, -1),
                         (XC1 + RAD, N_CURB - RAD, -1, 1), (XC1 + RAD, S_CURB + RAD, -1, -1)):
    q = ((xx - cx) * sx >= 0) & ((xx - cx) * sx < RAD) & ((yy - cy) * sy >= 0) & ((yy - cy) * sy < RAD)
    dist = np.where(q, np.maximum(0, RAD - np.hypot(xx - cx, yy - cy)), dist)
walkz = raised & (dist < WALK)                    # the sidewalk: the raised band within WALK of the road (it turns every corner)
zone = np.where(road, 0, np.where(walkz, 1, 2))

# ---- the ground textures, his tiles, frames cut, left-right flips only ------------------------------------------------
_cache = {}
def piece(fam, i, tw, th, cut, tint=None):
    k = (fam, i, tw, th, cut, tint)
    if k not in _cache:
        a = S.pack(fam, i)
        if tint: a = S.recolour(a, a[..., 3] > 0, tint, levels=6, shift_deg=10)
        a = S.cut_frame(a, fam) if cut else a[11:-11, 11:-11]          # his soil tile's soft frame runs ~10 px deep
        _cache[k] = S.pad(a, tw, th)[..., :3]
    return _cache[k]
def tiled(fam, ids, tw, th, cut, weights=None, tint=None):
    out = np.zeros((H + th, W + tw, 3), np.uint8)
    for r in range(0, H + 1, th):
        for c in range(0, W + 1, tw):
            i = ids[rng.choice(len(ids), p=weights)] if weights else ids[rng.randint(len(ids))]
            a = piece(fam, i, tw, th, cut, tint)
            out[r:r + th, c:c + tw] = a[:, ::-1] if rng.rand() < 0.5 else a
    return out[:H, :W]
ROAD_PLAIN = [0, 1, 8, 9, 10, 11]                 # the rest area: plain asphalt, his quietest six
road_px = tiled(S.ROAD, ROAD_PLAIN, TW, TH, True)
walk_px = tiled(S.SIDEWALK, [0, 1, 2, 6, 7, 16, 3, 13], TW, TH, True, [.2, .2, .15, .12, .12, .09, .06, .06])
# THE DIRT: ONE of his soil tiles (#2; four tones side by side read as a patchwork), shade-to-shade recoloured onto
# the valley's grey-tan (COOK FOUR's gravel source, his rocks and stones #53, mean 108,101,87): Las Vegas dirt is caliche,
# pale and grey, not his orange garden soil. His luminance kept pixel for pixel; the hue drifts by band (no straight darkening).
VALLEY_TAN = '#9a8e78'
soil_px = tiled(SOIL, [2], 72, 74, False, tint=VALLEY_TAN)
img = np.where((zone == 0)[..., None], road_px, np.where((zone == 1)[..., None], walk_px, soil_px)).astype(float)

# concrete: the driveway aprons, the walks to the doors, the valley gutter (his slab, no curb face)
conc = np.zeros((H, W), bool)
for (k, lx, d) in lots:
    if 'drive' in d:
        a, b = d['drive']; conc[HOUSE_BASE - 60:N_CURB + FH, lx + a:lx + b] = True
    # the walk to the front door: a 1.2 m concrete walk, his slab, from the door to the sidewalk (no flagstones: stacked
    # they read as stairs)
    if 'drive' not in d or d['door'] < d['drive'][0] - 200:
        dx = lx + d['door']; conc[HOUSE_BASE - 40:N_WALK + 4, dx - m(0.6):dx + m(0.6)] = True
VG = m(1.8)
conc[N_CURB:S_CURB, XC0 - RAD - VG:XC0 - RAD] = True          # the valley gutter across the local's mouth
img[conc] = walk_px[conc] * 0.94
zone[conc] = 3

def put(sp, y, x, flip=False):
    sp = sp[:, ::-1] if flip else sp
    h, w = sp.shape[:2]; y0, x0 = max(0, y), max(0, x); y1, x1 = min(H, y + h), min(W, x + w)
    if y1 <= y0 or x1 <= x0: return
    p = sp[y0 - y:y1 - y, x0 - x:x1 - x].astype(float); a = p[..., 3:4] / 255.0
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + p[..., :3] * a

# ---- decals, darken-only, sparse: cracks along the gutters and one wheel path, none in the middle (the rest area) -----
def dec(src, y, x, strength, pct):
    global img
    if src.shape[2] == 4: src = np.where(src[..., 3:4] > 0, src[..., :3], 255).astype(np.uint8)
    img = S.decal(np.dstack([img, np.full(img.shape[:2], 255)]).astype(np.uint8), src, (y, x), strength,
                  thresh=np.percentile(src[..., :3].astype(int).sum(2), pct))[..., :3].astype(float)
CR = [c for c in (29, 30, 31, 27, 28) if (S.ROAD, c) in S.UP]
cracks = []
for k in range(16):
    gutter = rng.rand() < 0.7
    y = (N_CURB + rng.randint(0, 50)) if (gutter and rng.rand() < .5) else (S_CURB - 90 - rng.randint(0, 50)) if gutter else N_CURB + m(2.5) + rng.randint(-30, 30)
    x = rng.randint(0, XC0 - 120)
    dec(S.cut_frame(S.pack(S.ROAD, CR[rng.randint(len(CR))]), S.ROAD), y, x, 0.75, 12); cracks.append([y, x])
for k in range(5):                                 # the collector takes the trucks: more wear in its wheel paths
    dec(S.cut_frame(S.pack(S.ROAD, CR[rng.randint(len(CR))]), S.ROAD), rng.randint(0, H - 90), XC0 + m(1.8) + rng.randint(0, 60), 0.75, 12)
# one pothole patch: his broken-road tile laid whole in the local's eastbound wheel path
ph = S.cut_frame(S.pack(S.ROAD, 32), S.ROAD)[..., :3]
py, px_ = S_CURB - m(2.4) - 40, int(XC0 * 0.55)
img[py:py + ph.shape[0], px_:px_ + ph.shape[1]] = ph

# ---- the curb: his slab's south face where the raised edge faces the eye ----------------------------------------------
up_r = raised & (zone != 3) | conc                   # aprons ride flush: no face under them
FACE = np.concatenate([S.pack(S.SIDEWALK, i)[-FH:, 5:-5, :3] for i in (0, 1, 2, 6, 7)] * 60, axis=1).astype(float)
up = np.full((H, W), 99)
for k in range(1, FH + 4):
    hit = np.zeros_like(raised); hit[k:] = raised[:-k]; up = np.where((up == 99) & hit & road, k, up)
apron_cols = np.zeros(W, bool)
for (k, lx, d) in lots:
    if 'drive' in d: a, b = d['drive']; apron_cols[lx + a:lx + b] = True
face = road & (up <= FH) & ~apron_cols[None, :]
u = np.tile(np.arange(W), (H, 1)) % FACE.shape[1]
img[face] = FACE[(up[face] - 1).clip(0, FH - 1), u[face]]
rl = road_px.reshape(-1, 3).astype(int); SH = rl[rl.sum(1).argsort()[:len(rl) // 20]].mean(0)
shd = road & (up > FH) & (up <= FH + 3) & ~apron_cols[None, :]; img[shd] = img[shd] * 0.45 + SH * 0.55
sl_ = walk_px.reshape(-1, 3).astype(int); LIP = sl_[sl_.sum(1).argsort()[-len(sl_) // 40:]].mean(0)
inner = raised & (np.asarray(Image.fromarray(road.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0)
img[inner] = img[inner] * 0.35 + LIP * 0.65
side = road & (up == 99) & (np.asarray(Image.fromarray(raised.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))) > 0)
img[side] = img[side] * 0.7 + SH * 0.3
# the sidewalk meets the dirt: a 2 px darker line of his slab's own shadow, so the yard reads lower than the walk
yl = (zone == 2) & (np.asarray(Image.fromarray(((zone == 1) | (zone == 3)).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))) > 0)
img[yl] = img[yl] * 0.82

# ---- THE PAINT, lifted off his tiles as layers (the collector's yellow double, the local's stop bar) ------------------
def layer(i, kind):
    a = S.cut_frame(S.pack(S.ROAD, i), S.ROAD)[..., :3].astype(int)
    msk = ((a.sum(2) > 390) & (a.min(2) > 110)) if kind == 'white' else ((a[..., 0] - a[..., 2]) > 60)
    return np.dstack([a.astype(np.uint8), (msk * 255).astype(np.uint8)])
def lay(L, y, x, alpha=1.0):
    h, w = L.shape[:2]; y0, x0 = max(0, y), max(0, x); y1, x1 = min(H, y + h), min(W, x + w)
    if y1 <= y0 or x1 <= x0: return
    p = L[y0 - y:y1 - y, x0 - x:x1 - x]; a = p[..., 3:4] / 255.0 * alpha
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + p[..., :3] * a
ORG = [layer(i, 'orange') for i in (18, 19, 20, 21, 22) if (S.ROAD, i) in S.UP]
cx = (XC0 + XC1) // 2
for y in range(0, H, TH):
    if N_CURB - 10 <= y + TH // 2 <= S_CURB + 10: continue          # the double line breaks across the intersection
    L = np.rot90(ORG[rng.randint(len(ORG))]); lay(L, y, cx - L.shape[1] // 2)
_L14 = layer(14, 'white'); _cols = np.nonzero(_L14[..., 3].sum(0) > 255 * 8)[0]
_band = _cols[_cols < _cols.min() + 14]; BAR = _L14[:, _band.min() - 1:_band.max() + 2]
bx = XC0 - RAD - VG - m(1.2) - BAR.shape[1]                          # the stop bar, 1.2 m back of the gutter
yb = (N_CURB + S_CURB) // 2
while yb < S_CURB - 10:
    seg = BAR[:min(BAR.shape[0], S_CURB - 10 - yb)]; lay(seg, yb, bx); yb += seg.shape[0]

# ---- the block wall across the street, his wall tile, 1.68 m, and its shadow; the backyards behind it ----------------
wall_end = XC0 - RAD - 10
wt = [S.pack(WALLS, i)[2:-2, 2:-2] for i in (5, 7, 5, 7, 0)]
x = -20; wall_tiles = []
while x < wall_end:
    i = rng.choice([0, 1, 2, 3, 4], p=[.3, .3, .15, .15, .1]); t = wt[i]
    t = t[:, :min(t.shape[1], wall_end - x)]
    put(t, WALL_TOP, x); wall_tiles.append(int([5, 7, 5, 7, 0][i])); x += t.shape[1]
x = XC1 + RAD + 10
while x < W:
    t = wt[rng.randint(4)]; put(t, WALL_TOP, x); x += t.shape[1]
ws = (yy >= WALL_TOP + WALL_H - 4) & (yy < WALL_TOP + WALL_H + 14) & (((xx > 0) & (xx < wall_end + 14)) | (xx > XC1 + RAD + 24))
img[ws] = img[ws] * 0.6

# ---- the yards: his boulders and dry shrubs, two or three a yard, clustered, never in a line ---------------------------
BOULD = [0, 1, 2, 12, 13, 11, 47, 62, 63]; SHRUB = [(DRY, 19), (DRY, 20), (DRY, 21), (DRY, 23), (DRY2, 5), (DRY2, 6), (DRY, 38)]
landscape = []
for (k, lx, d) in lots:
    w = spr[k].shape[1]
    for j in range(rng.randint(2, 4)):
        for t in range(20):
            x = lx + rng.randint(0, w - 90); y = HOUSE_BASE + rng.randint(20, YARD - 170)
            if abs(x + 45 - (lx + d['door'])) < 110: continue
            if 'drive' in d and lx + d['drive'][0] - 100 < x < lx + d['drive'][1]: continue
            break
        if rng.rand() < .5: s = S.pack(ROCKS, BOULD[rng.randint(len(BOULD))]); landscape.append(['rock', x, y])
        else: f, i = SHRUB[rng.randint(len(SHRUB))]; s = S.pack(f, i); landscape.append(['shrub', i, x, y])
        put(s, y, x, rng.rand() < .5)
for k in range(5):                                                    # behind the wall: shrubs in the backyards
    f, i = SHRUB[rng.randint(len(SHRUB))]; put(S.pack(f, i), WALL_TOP + WALL_H + 40 + rng.randint(0, 100), rng.randint(0, wall_end - 100))
# a manhole on the collector and two of his grates at the gutters (flat ground features, part of the ground)
put(S.pack('15. Street props', 35), (N_CURB + S_CURB) // 2 - 29, cx + m(2))
put(S.pack('15. Street props', 36), N_CURB + FH + 2, XC0 - RAD - VG - 140)
put(S.pack('15. Street props', 36), S_CURB - 60, XC0 - RAD - VG - 300)

# ---- the houses last (their own shadows fall over the dirt), feet on HOUSE_BASE -----------------------------------------
for (k, lx, d) in lots:
    s = spr[k]; put(s, HOUSE_BASE - s.shape[0] + 30, lx)
out = img.clip(0, 255).astype(np.uint8)

# ---- the twin: the same plan with his tiles AS BOUGHT, frames on, on a 96 grid ------------------------------------------
TWIN_W = min(W, 1500)
raw = np.full((H, TWIN_W, 3), 40, np.uint8); r2 = np.random.RandomState(1018)
for r in range(0, H, 96):
    for c in range(0, TWIN_W, 96):
        z = zone[min(H - 1, r + 48), min(W - 1, c + 48)]
        fam, ids = {0: (S.ROAD, ROAD_PLAIN), 1: (S.SIDEWALK, [0, 1, 2, 6, 7]), 2: (SOIL, [2, 3, 21, 1]), 3: (S.SIDEWALK, [0, 1, 2])}[int(z)]
        t = S.pad(S.pack(fam, ids[r2.randint(len(ids))]), 96, 96)[..., :3]
        raw[r:r + 96, c:c + 96] = t[:min(96, H - r), :min(96, TWIN_W - c)]
twin = Image.fromarray(raw)
for (k, lx, d) in lots:                                              # the same houses, so only the ground differs
    if lx < TWIN_W: s = Image.fromarray(spr[k]); twin.paste(s, (lx, HOUSE_BASE - spr[k].shape[0] + 30), s)

# ---- the sheet: ours on top at 1:1, the twin below at 1:1 (the west 1,500 px), the parts ------------------------------
PARTS = [(S.ROAD, 0), (S.ROAD, 32), (S.ROAD, 18), (S.ROAD, 14), (S.SIDEWALK, 0), (S.SIDEWALK, 3), (SOIL, 2), (SOIL, 21),
         (WALLS, 5), (WALLS, 7), (WALLS, 0), (ROCKS, 1), (ROCKS, 53), (DRY, 21), (DRY2, 5), ('15. Street props', 36)]
strip = 150
sheet = Image.new('RGB', (W, 70 + H + 50 + H + 10), (14, 14, 14)); d = ImageDraw.Draw(sheet)
d.text((6, 6), 'ONE REAL STREET (the next block after his NO): an east-valley Las Vegas local street meeting a collector, cut from his tiles, COOK FOUR\'s tanned ranch at 1:1. Nothing drawn.', fill=(235, 235, 235))
d.text((6, 24), 'PIXEL SIZE 1:1, his native pixel, 57 px a metre, one size in the scene | PALETTE records/BOHEMIA_COOK2_ONE_REAL_STREET_PALETTE_10_18_26.json (his tiles\' own colours, nothing added) | LIGHT from above, as his pack paints it', fill=(200, 220, 255))
d.text((6, 44), 'ONE QUESTION: does this read as a real street in Las Vegas?', fill=(235, 200, 120))
sheet.paste(Image.fromarray(out), (0, 70))
y2 = 70 + H + 50; d.text((6, y2 - 22), 'THE TWIN: the same plan, the same houses, his tiles AS BOUGHT on their 96 grid, frames on (the west 1,500 px)', fill=(235, 235, 235))
sheet.paste(twin, (0, y2))
y3 = y2; d.text((TWIN_W + 40, y3), 'THE TILES IT IS MADE OF (his, as bought):', fill=(235, 235, 235)); x = TWIN_W + 40
for (fam, i) in PARTS:
    t = S.pack(fam, i); ti = Image.fromarray(t); sheet.paste(ti, (x, y3 + 18), ti); d.text((x, y3 + 18 + 98), f'{fam.split(". ")[-1][:13]}#{i}', fill=(180, 180, 180)); x += max(t.shape[1], 96) + 18
os.makedirs(os.path.join(R, 'records/target'), exist_ok=True)
sheet.save(os.path.join(R, 'records/target/COOK2_ONE_REAL_STREET.webp'), lossless=True, method=6)   # lossless: every pixel his

# ---- the palette file (rule 114c): every colour in the scene comes from his tiles; the count, and the top 32 ----------
q = (out // 8).reshape(-1, 3); uq, cnt = np.unique(q, axis=0, return_counts=True); order = cnt.argsort()[::-1]
pal = {'_what': 'COOK TWO, one real street (10/18): the scene\'s palette. Every pixel is his tile\'s own pixel, darkened (decals, curb shadow, wall shadow) or blended (paint layers) only; no colour is added. Native pixel 1:1, 57 px a metre; light from above.',
       'sources': [f'{f}#{i}' for f, i in PARTS] + [f'COOK4_RANCH_TAN_{k}' for k, _ in HOUSES] + ['COOK4_THE_VALLEY_TANS.json (the roofs)'],
       'distinct_colours_5bit': int(len(uq)), 'top32_hex': ['#%02x%02x%02x' % tuple(int(v) * 8 + 4 for v in uq[i]) for i in order[:32]],
       'top32_share': round(float(cnt[order[:32]].sum() / cnt.sum()), 4)}
json.dump(pal, open(os.path.join(R, 'records/BOHEMIA_COOK2_ONE_REAL_STREET_PALETTE_10_18_26.json'), 'w'), indent=1)

# ---- measured --------------------------------------------------------------------------------------------------------
fam = json.load(open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_SEVEN_NUMBERS_GROUND_10_11_26.json')))
chk = {'in': 0, 'out': [], 'checked_cells': 0}
for r in range(N_CURB + 40, S_CURB - 40 - TH, TH):                  # whole road cells of the local, away from paint and kerb
    for c in range(0, int(XC0 * 0.5), TW):
        a = out[r:r + TH, c:c + TW]; s = S.seven(np.dstack([a, np.full(a.shape[:2], 255)])); f = fam[S.ROAD]; chk['checked_cells'] += 1
        ok = (f['sat_median'][0] - 0.03 <= s['sat'][1] <= f['sat_median'][1] + 0.03) and (f['cluster_run'][0] - 0.05 <= s['cluster_run'] <= f['cluster_run'][1] + 0.05)
        if ok: chk['in'] += 1
        else: chk['out'].append([r, c, s['sat'][1], s['cluster_run']])
seam = out[N_CURB + 20:S_CURB - 20, [c for c in range(TW, XC0 - 200, TW)]].astype(int).sum(2)
inside = out[N_CURB + 20:S_CURB - 20, [c + TW // 2 for c in range(TW, XC0 - 200, TW)]].astype(int).sum(2)
chk['seam_dark_share'] = round(float((seam < 120).mean()), 4); chk['inside_dark_share'] = round(float((inside < 120).mean()), 4)
# the rest area (rule 114's fifth tell): share of the local's asphalt with no crack decal and no paint, as a fraction
road_local = out[N_CURB + 20:S_CURB - 20, :XC0 - RAD - VG - 200].astype(int).sum(2)
base_local = road_px[N_CURB + 20:S_CURB - 20, :XC0 - RAD - VG - 200].astype(int).sum(2)
chk['rest_area_share'] = round(float((np.abs(road_local - base_local) < 6).mean()), 4)
chk.update({'canvas': [W, H], 'px_per_m': PXM, 'metres': {'local_curb_to_curb': STREET / PXM, 'collector': COLL / PXM, 'sidewalk': WALK / PXM,
            'front_yard': YARD / PXM, 'curb_return_radius': RAD / PXM, 'valley_gutter': VG / PXM, 'wall_height': WALL_H / PXM},
            'houses': [[k, lx] for k, lx, _ in lots], 'wall_tiles': wall_tiles, 'landscape': landscape, 'cracks': cracks,
            'slots_for_the_rig': {'_why': 'rule 115a: vehicles and standing props are modelled on the rig; his 96 px car at 1:1 is 1.7 m and scaling it is a mixel',
                                  'car_in_driveway': [[k, lx + d['drive'][0] + (d['drive'][1] - d['drive'][0]) // 2, HOUSE_BASE + 60] for k, lx, d in lots if 'drive' in d],
                                  'stop_sign': [XC0 - RAD - VG - 60, S_CURB + WALK // 2], 'street_light': [XC0 - RAD - 40, N_WALK + WALK // 2],
                                  'mailbox_bank': [lots[1][1] + 40, N_WALK + 10], 'bins_on_collection_day': [[lx + 60, N_WALK - 10] for k, lx, _ in lots]}})
json.dump(chk, open(os.path.join(R, 'records/BOHEMIA_COOK2_ONE_REAL_STREET_10_18_26.json'), 'w'), indent=1)
print('canvas', W, H, 'road cells in range', chk['in'], 'of', chk['checked_cells'], chk['out'][:4])
print('seam dark', chk['seam_dark_share'], 'inside', chk['inside_dark_share'], 'rest area', chk['rest_area_share'], 'colours', pal['distinct_colours_5bit'])
