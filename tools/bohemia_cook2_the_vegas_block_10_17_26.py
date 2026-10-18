#!/usr/bin/env python3
"""COOK TWO, THE BIG SWING (rule 110, Paolo 10/16: '24 hours, take big swings'): A WHOLE VEGAS BLOCK OF GROUND
FROM HIS TILES. Four streets round one block, the sidewalks, the curbs, the paint, every corner from the 47 rule,
his cars and his props, on one sheet beside the same plan laid with the tiles as bought. records/ only (rule 100);
nothing drawn (rule 108): every pixel is cut, padded, layered, placed or darkened from his purchased packs.

HOW IT IS MADE (the recipes of tools/bohemia_cook2_stretch_the_pack.py):
  * the ground: his road and slab tiles, frame cut, left-right flips only, never rotated, never flipped top-down;
  * the sidewalk: a cell mask rounded the 47 way (blur and threshold), the curb his slab's own 7-row south face
    where the walk edge faces the eye, the lit lip round every edge, 3 px of his darkest road as the shadow;
    the driveway into the lot is a gap in the ring, so the curb returns on both sides of it;
  * THE PAINT IS A LAYER: his zebra bars, his orange double line and his white edge line are LIFTED off his
    tiles (white = brighter than any asphalt pixel, orange = red over blue), and laid along each street at the
    angle the street runs. The asphalt under them is never rotated; only the flat paint turns. His white line
    is cut into 3 m dashes with 9 m gaps (the US lane dash) for the lane lines;
  * the cars: his top-down cars (pack 10), placed nose north or south, so none is rotated; the props: his street
    props (pack 15), 3/4 view on a top-down ground as the pack intends;
  * decals: darken-only, his broken road's cracks, his burnt ground's scorch, seeded.
Then every whole untouched cell is checked against the family's seven numbers (sat and grain).
  python3 tools/bohemia_cook2_the_vegas_block_10_17_26.py

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the card of numbers and skills/bohemia-pixel-art, AH-01 and AH-03.
The source is his own tiles. No reference game.

REUSE CHECK (REUSE-FIRST, 7/22, written 10/18): his own tiles from the approved set (his HD tile repo and his 7/13 UP list, through the pack readers); every pixel cut, padded, layered or recoloured from them, nothing drawn (rule 108).

TASTE CHECK (written 10/18): his rulings on the ground are the bar: his 10/10 "look again at the tiles we downloaded", his UP on the curb, the crossing and the 47, his NO on the Vegas block (composition); the sheet goes to DIRECTION, then the VOTE tab.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S

TW, TH = 82, 81; FH = 7; BLUR = 6
COLS, ROWS = 16, 16; W, H = COLS * TW, ROWS * TH
PXM = 30.0                                    # his ground is ~30 px a metre (the sidewalk study page)
rng = np.random.RandomState(1017)
CARS, PROPS, BURN = '10. Abandoned cars', '15. Street props', '8. Burned Ground and fire marks'

# ---- the plan: 0 road, 1 walk, 2 lot ------------------------------------------------------------
# cols: 0 far walk | 1-3 west street | 4 ring | 5-10 the block | 11 ring | 12-14 east street | 15 far walk
# rows: 0 far walk | 1-4 north street | 5 ring | 6-9 the block | 10 ring | 11-14 south street | 15 far walk
plan = np.zeros((ROWS, COLS), int)
WALK_C = [0, 4, 11, 15]; WALK_R = [0, 5, 10, 15]
for c in WALK_C: plan[:, c] = 1
for r in WALK_R: plan[r, :] = 1
plan[1:5, :] = 0; plan[11:15, :] = 0; plan[:, 1:4] = 0; plan[:, 12:15] = 0     # the streets cut through
plan[6:10, 5:11] = 2                                                             # the lot inside the ring
plan[10, 7:9] = 2                                                                # the driveway: the ring drops
STREETS = {'N': ('EW', 1, 5), 'S': ('EW', 11, 15), 'W': ('NS', 1, 4), 'E': ('NS', 12, 15)}   # axis, first, last+1

# ---- the ground: his tiles, frame cut, padded, flipped left-right only --------------------------
ROAD_IDS = [0, 1, 7, 8, 9, 10, 11, 2, 3, 6, 12]           # plain first, cracked after
WALK_IDS = [0, 1, 2, 6, 7, 0, 1, 2, 6, 7, 5, 12, 13, 16, 41, 44, 3, 9, 10]   # plain weighted, cracks, a weed
def cell(fam, ids):
    a = S.pad(S.cut_frame(S.pack(fam, ids[rng.randint(len(ids))]), fam), TW, TH)[..., :3]
    return a[:, ::-1] if rng.rand() < 0.5 else a
road_px = np.zeros((H, W, 3), np.uint8); walk_px = np.zeros_like(road_px)
for r in range(ROWS):
    for c in range(COLS):
        sl = (slice(r * TH, (r + 1) * TH), slice(c * TW, (c + 1) * TW))
        road_px[sl] = cell(S.ROAD, ROAD_IDS); walk_px[sl] = cell(S.SIDEWALK, WALK_IDS)
# two of his painted slabs where a real sidewalk has them: the hazard stripes at the driveway, a manhole slab
for (r, c, i) in ((10, 6, 8), (10, 9, 17), (5, 8, 40)):
    walk_px[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW] = S.pad(S.cut_frame(S.pack(S.SIDEWALK, i), S.SIDEWALK), TW, TH)[..., :3]

# ---- the sidewalk mask, rounded the 47 way ---------------------------------------------------------
m = np.kron(plan == 1, np.ones((TH, TW), bool)).astype(np.uint8) * 255
walk = np.asarray(Image.fromarray(m).filter(ImageFilter.GaussianBlur(BLUR))) > 127
img = np.where(walk[..., None], walk_px, road_px).astype(float)

# ---- decals before the curb: cracks and scorch, darken-only -----------------------------------------
CR = [c for c in (29, 30, 31, 32, 33, 27, 28) if (S.ROAD, c) in S.UP]
BU = [i for i in (1, 2, 4, 5, 7, 9, 12, 17, 20) if (BURN, i) in S.UP]
def dec(src, y, x, strength, pct):
    """a transparent pixel is RGB 0 in his file, which darken-only would read as black: it is set to white first."""
    global img
    if src.shape[2] == 4: src = np.where(src[..., 3:4] > 0, src[..., :3], 255).astype(np.uint8)
    img = S.decal(np.dstack([img, np.full(img.shape[:2], 255)]).astype(np.uint8), src, (y, x), strength,
                  thresh=np.percentile(src[..., :3].astype(int).sum(2), pct))[..., :3].astype(float)
for k in range(14):
    y, x = rng.randint(0, H - 90), rng.randint(0, W - 90)
    if walk[y + 40, x + 40]: continue
    dec(S.cut_frame(S.pack(S.ROAD, CR[rng.randint(len(CR))]), S.ROAD), y, x, 0.8, 12)
for (y, x) in ((7 * TH + 10, 8 * TW + 20), (13 * TH, 6 * TW + 30)):                 # a scorch on the lot, one on the road
    b = S.pack(BURN, BU[rng.randint(len(BU))]); dec(b, y, x, 0.9, 30)

# ---- the curb: his slab's south face where the edge faces the eye ------------------------------------
FACE = np.concatenate([S.pack(S.SIDEWALK, i)[-FH:, 5:-5, :3] for i in (0, 1, 2, 6, 7)] * 8, axis=1).astype(float)
up = np.full((H, W), 99)
for k in range(1, FH + 4):
    hit = np.zeros_like(walk); hit[k:] = walk[:-k]; up = np.where((up == 99) & hit & ~walk, k, up)
face = (~walk) & (up <= FH)
u = np.tile(np.arange(W), (H, 1)) % FACE.shape[1]
img[face] = FACE[(up[face] - 1).clip(0, FH - 1), u[face]]
rl = road_px.reshape(-1, 3).astype(int); SH = rl[rl.sum(1).argsort()[:len(rl) // 20]].mean(0)
shd = (~walk) & (up > FH) & (up <= FH + 3); img[shd] = img[shd] * 0.45 + SH * 0.55
sl_ = walk_px.reshape(-1, 3).astype(int); LIP = sl_[sl_.sum(1).argsort()[-len(sl_) // 40:]].mean(0)
inner = walk & ~(np.asarray(Image.fromarray((~walk).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) == 0)
img[inner] = img[inner] * 0.35 + LIP * 0.65
# the walk's side edges (east and west faces) get a 2 px darker lip too, so a straight kerb reads from the side
side = (~walk) & (up == 99) & (np.asarray(Image.fromarray(walk.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))) > 0)
img[side] = img[side] * 0.7 + SH * 0.3

# ---- THE PAINT, lifted off his tiles as layers ---------------------------------------------------------
def layer(i, kind):
    a = S.cut_frame(S.pack(S.ROAD, i), S.ROAD)[..., :3].astype(int)
    if kind == 'white': msk = (a.sum(2) > 390) & (a.min(2) > 110)       # brighter than any asphalt pixel (p99 372)
    else: msk = (a[..., 0] - a[..., 2]) > 60                             # orange: red over blue
    return np.dstack([a.astype(np.uint8), (msk * 255).astype(np.uint8)])
ZEB = [layer(i, 'white') for i in (15, 16, 17)]
ORG = [layer(i, 'orange') for i in (18, 19, 20, 21, 22, 26) if (S.ROAD, i) in S.UP]
WHT = [layer(i, 'white') for i in (4, 5)]
# the lane dash and the stall line: ONE solid line lifted off his double white line (tile 14), the left line's band
_L14 = layer(14, 'white'); _cols = np.nonzero(_L14[..., 3].sum(0) > 255 * 8)[0]
_band = _cols[_cols < _cols.min() + 14]; DASH = _L14[:, _band.min() - 1:_band.max() + 2]
def lay(L, y, x, rot=False, alpha=1.0):
    """composite a paint layer (RGBA) at y, x; rot turns the flat paint a quarter turn (never the asphalt)."""
    if rot: L = np.rot90(L)
    h, w = L.shape[:2]; y0, x0 = max(0, y), max(0, x); y1, x1 = min(H, y + h), min(W, x + w)
    if y1 <= y0 or x1 <= x0: return
    p = L[y0 - y:y1 - y, x0 - x:x1 - x]; a = p[..., 3:4] / 255.0 * alpha
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + p[..., :3] * a
paint_cells = set()
def mark(y, x, h, w):
    for r in range(max(0, y // TH), min(ROWS, (y + h - 1) // TH + 1)):
        for c in range(max(0, x // TW), min(COLS, (x + w - 1) // TW + 1)): paint_cells.add((r, c))
# centre line: his orange double line down the middle of every street, broken at the intersections
BOX_C = [(1, 4), (12, 15)]; BOX_R = [(1, 5), (11, 15)]        # the intersection boxes, in cells
for name, (ax, f, l) in STREETS.items():
    if ax == 'EW':
        cy = (f + l) / 2 * TH                                      # the street's centre line, in px
        for c in range(COLS):
            if any(a <= c < b for a, b in BOX_C): continue
            L = ORG[rng.randint(len(ORG))]; lay(L, int(cy - L.shape[0] / 2), c * TW); mark(int(cy - L.shape[0] / 2), c * TW, L.shape[0], L.shape[1])
        # the lane dash on each side: his white line cut into 3 m dashes, 9 m gaps, at the quarter lines
        for q in (0.25, 0.75):
            ly = (f + (l - f) * q) * TH; x = 0
            while x < W:
                c = int(x // TW)
                if not any(a <= c < b for a, b in BOX_C):
                    L = np.rot90(DASH); d = int(3 * PXM); seg = L[:, :d] if L.shape[1] >= d else L
                    lay(seg, int(ly - seg.shape[0] / 2), x); mark(int(ly - seg.shape[0] / 2), x, seg.shape[0], seg.shape[1])
                x += int(12 * PXM)
    else:
        cx = (f + l) / 2 * TW
        for r in range(ROWS):
            if any(a <= r < b for a, b in BOX_R): continue
            L = ORG[rng.randint(len(ORG))]; Lr = np.rot90(L); lay(L, r * TH, int(cx - Lr.shape[1] / 2), rot=True); mark(r * TH, int(cx - Lr.shape[1] / 2), Lr.shape[0], Lr.shape[1])
# the zebras: across every approach of every intersection, his bars at the angle the street runs
for (ra, rb) in BOX_R:
    for (ca, cb) in BOX_C:
        for r in (ra - 1, rb):                                         # across the NS street, north and south of the box
            if 0 <= r < ROWS:
                for c in range(ca, cb):
                    L = ZEB[rng.randint(3)]; lay(L, r * TH, c * TW); mark(r * TH, c * TW, TH, TW)
        for c in (ca - 1, cb):                                         # across the EW street, west and east of the box
            if 0 <= c < COLS:
                for r in range(ra, rb):
                    L = ZEB[rng.randint(3)]; lay(L, r * TH, c * TW, rot=True); mark(r * TH, c * TW, TH, TW)
# the lot: parking stalls from his white line, nose-in along the north edge of the lot
for k in range(7):
    x = 5 * TW + 6 + k * 68; L = DASH[:int(4.5 * PXM)]; lay(L, 6 * TH + 4, x - L.shape[1] // 2); mark(6 * TH + 4, x - L.shape[1] // 2, L.shape[0], L.shape[1])

# ---- his cars and his props, placed (rule 82a), never rotated -------------------------------------------
def sprite(name, i): return S.pack(name, i)
def put(sp, y, x, flip=False):
    sp = sp[:, ::-1] if flip else sp
    h, w = sp.shape[:2]; y0, x0 = max(0, y), max(0, x); y1, x1 = min(H, y + h), min(W, x + w)
    p = sp[y0 - y:y1 - y, x0 - x:x1 - x]; a = p[..., 3:4] / 255.0
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + p[..., :3] * a; mark(y0, x0, y1 - y0, x1 - x0)
placed = []
def car(i, y, x, flip=False): put(sprite(CARS, i), y, x, flip); placed.append(['car', i, y, x])
def prop(i, y, x, flip=False): put(sprite(PROPS, i), y, x, flip); placed.append(['prop', i, y, x])
car(3, 6 * TH + 2, 5 * TW + 6 + 68 * 1 - 23)                 # nosed into a stall
car(12, 6 * TH + 2, 5 * TW + 6 + 68 * 4 - 23, True)
car(7, 7 * TH + 30, 12 * TW + 18)                              # abandoned in the east street's near lane
car(16, 6 * TH + 60, 2 * TW + 12)                              # the west street
car(10, 12 * TH + 10, 8 * TW + 30)                             # the south street, mid-road, nose north
for (i, y, x, fl) in ((3, 5 * TH - 30, 4 * TW + 28, False), (4, 10 * TH - 40, 11 * TW + 20, False),      # lamps on the ring
                      (6, 5 * TH + 8, 6 * TW + 10, False), (21, 10 * TH + 6, 5 * TW + 10, False),          # a hydrant, a bin
                      (9, 10 * TH + 20, 7 * TW - 30, False), (10, 10 * TH + 30, 9 * TW + 4, True),          # cones at the driveway
                      (13, 13 * TH - 20, 13 * TW - 10, False),                                              # a barricade on the east street
                      (23, 5 * TH + 10, 10 * TW, False), (43, 8 * TH + 20, 9 * TW + 40, False),              # a meter, a tyre on the lot
                      (42, 10 * TH + 10, 10 * TW + 30, False), (20, 15 * TH - 30, 8 * TW, False)):            # a sack, a bench on the far walk
    prop(i, y, x, fl)
for (i, y, x) in ((35, 3 * TH - 10, 8 * TW + 10), (36, 5 * TH - 20, 2 * TW + 10), (35, 12 * TH + 10, 2 * TW + 10)):     # a manhole, a drain
    put(sprite(PROPS, i), y, x); placed.append(['prop', i, y, x])
out = img.clip(0, 255).astype(np.uint8)

# ---- the twin: the same plan with his tiles AS BOUGHT, frames and all, paint only where a tile goes ------
raw = np.zeros((ROWS * 96, COLS * 96, 3), np.uint8); r2 = np.random.RandomState(1017)
for r in range(ROWS):
    for c in range(COLS):
        k = plan[r, c]
        fam, ids = (S.SIDEWALK, [0, 1, 2, 6, 7]) if k == 1 else (S.ROAD, [0, 1, 7, 8, 9])
        if k != 1 and ((r in (0, 5, 10, 15) and any(a <= c < b for a, b in BOX_C))): ids = [15, 16, 17]   # his zebra tile fits across the NS streets only
        if k != 1 and (r == 2 or r == 12) and not any(a <= c < b for a, b in BOX_C): ids = [18, 19, 20]    # his orange line fits a row of the EW streets only
        raw[r * 96:(r + 1) * 96, c * 96:(c + 1) * 96] = S.pad(S.pack(fam, ids[r2.randint(len(ids))]), 96, 96)[..., :3]
raw = np.asarray(Image.fromarray(raw).resize((W, H), Image.NEAREST))

# ---- the sheet ------------------------------------------------------------------------------------------
PARTS = [(S.ROAD, 0), (S.ROAD, 15), (S.ROAD, 18), (S.ROAD, 4), (S.ROAD, 29), (S.SIDEWALK, 0), (S.SIDEWALK, 8), (S.SIDEWALK, 40),
         (BURN, BU[0]), (CARS, 3), (CARS, 7), (PROPS, 3), (PROPS, 6), (PROPS, 13), (PROPS, 35)]
strip_h = 96 + 30
sheet = Image.new('RGB', (W * 2 + 20, H + 60 + strip_h + 20), (14, 14, 14)); d = ImageDraw.Draw(sheet)
sheet.paste(Image.fromarray(raw), (0, 50)); sheet.paste(Image.fromarray(out), (W + 20, 50))
d.text((4, 6), 'HIS PACK AS BOUGHT, laid as one Las Vegas block: four streets round a lot', fill=(235, 235, 235))
d.text((W + 24, 6), 'THE SAME TILES, CUT, CURBED, THE PAINT LIFTED AND LAID ALONG THE STREET, HIS CARS AND PROPS PLACED (nothing drawn)', fill=(235, 235, 235))
d.text((4, 26), 'ONE QUESTION: does this read as one block of Vegas you could fight on?', fill=(235, 200, 120))
y0 = H + 70; d.text((4, y0), 'THE TILES IT IS MADE OF (his, as bought):', fill=(235, 235, 235)); x = 4
for (fam, i) in PARTS:
    t = S.pack(fam, i); ti = Image.fromarray(t); sheet.paste(ti, (x, y0 + 18), ti); d.text((x, y0 + 18 + 96), f'{fam.split(". ")[-1][:14]}#{i}', fill=(180, 180, 180)); x += max(t.shape[1], 96) + 14
os.makedirs(os.path.join(R, 'records/target'), exist_ok=True)
sheet.save(os.path.join(R, 'records/target/COOK2_THE_VEGAS_BLOCK.png'), optimize=True)
Image.fromarray(out).save(os.path.join(R, 'records/target/COOK2_THE_VEGAS_BLOCK_OURS.png'), optimize=True)

# ---- the seven numbers: every whole, untouched cell inside its family's range? ---------------------------
fam = json.load(open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_SEVEN_NUMBERS_GROUND_10_11_26.json')))
chk = {'in': 0, 'out': [], 'skipped_mixed_or_painted': 0}
for r in range(ROWS):
    for c in range(COLS):
        wm = walk[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW].mean()
        if wm not in (0.0, 1.0) or (r, c) in paint_cells: chk['skipped_mixed_or_painted'] += 1; continue
        a = out[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW]
        f = fam[S.SIDEWALK if wm == 1.0 else S.ROAD]; s = S.seven(np.dstack([a, np.full(a.shape[:2], 255)]))
        ok = (f['sat_median'][0] - 0.03 <= s['sat'][1] <= f['sat_median'][1] + 0.03) and (f['cluster_run'][0] - 0.05 <= s['cluster_run'] <= f['cluster_run'][1] + 0.05)
        if ok: chk['in'] += 1
        else: chk['out'].append([r, c, 'walk' if wm == 1.0 else 'road', s['sat'][1], s['cluster_run']])
# the seam check (rule 104b): dark pixels along every cell seam on the road, against inside the cells
seam = out[:, [c * TW for c in range(1, COLS)]].astype(int).sum(2); inside = out[:, [c * TW + TW // 2 for c in range(1, COLS)]].astype(int).sum(2)
chk['seam_dark_share'] = round(float((seam < 120).mean()), 4); chk['inside_dark_share'] = round(float((inside < 120).mean()), 4)
chk['placed'] = placed; chk['canvas'] = [W, H]; chk['cells'] = [COLS, ROWS]; chk['px_per_m'] = PXM
chk['layers'] = {'zebra': [15, 16, 17], 'orange': [i for i in (18, 19, 20, 21, 22, 26) if (S.ROAD, i) in S.UP], 'white': [4, 5], 'slabs_with_paint': [8, 17, 40]}
json.dump(chk, open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_VEGAS_BLOCK_10_17_26.json'), 'w'), indent=1)
print('cells inside the family range', chk['in'], 'outside', len(chk['out']), 'skipped', chk['skipped_mixed_or_painted'], chk['out'][:6])
print('seam dark share', chk['seam_dark_share'], 'inside', chk['inside_dark_share'])
