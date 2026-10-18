#!/usr/bin/env python3
"""COOK TWO [the street joins for the map] (10/18; his words on the map: 'the districts are looking like shit, the
streets looking like shit, doesn't look like shit's connected'). RUN's [the districts connect on the map] needs the
pieces that join one district's street to the next. This cuts them from his tiles (rule 115b: the ground stays on the
packs) and shows them laid, from the map's own camera. records/ only (rule 100); nothing drawn
(rule 108): every pixel is cut, padded, layered, recoloured shade to shade, placed or darkened from his packs or
COOK FOUR's tanned buildings.

WHAT IS LAID (four map cells across, three down, 96 m a cell, the map's own cell: OVER_N/TILE_FINE/CELL_M):
  * WEST, two cells: THE SUBURB, his YES street's tract (caliche yards, 1.5 m sidewalks, COOK FOUR's tanned ranch).
  * THIRD cell: THE WORKS, the industrial edge (concrete yards from his slab, gravel from his soil recoloured grey,
    COOK FOUR's warehouse), no sidewalk: the curb stops at the district line.
  * EAST: THE FREEWAY, four lanes and a median barrier, in the open desert.
  THE JOINS (the kit, records/target/cook2_map_joins/):
    J1 a street crossing a district line: the 14 m arterial runs ONE asphalt and ONE yellow double across the line;
       only its edges change (sidewalk and curb return on the suburb side, a gravel shoulder on the works side);
    J2 a road meeting a different ground: a suburb local runs south out of the tract, its sidewalk ends at the last
       wall, the pavement crumbles (his broken-edge tiles 30-32, their own alpha holes) into a caliche dirt track;
    J3 the freeway on-ramp: the arterial leaves the works, curves south and merges into the southbound lanes, a
       white gore hatch (his tile 23's hatch recoloured to his white paint) between ramp and mainline;
    J4 the arterial crossing open desert between the works and the ramp (a road through a different ground).
SCALE: one pixel size in the scene, his native pixel reduced 4 to 1 (57 -> 14.25 px a metre), every reduced tile snapped
back to his own tile's colours. The map's near stop draws a 96 m block 256 device px wide (EYES' four numbers), so
the kit sits 5.3x above the near stop and RUN reduces it, never the other way.
  python3 tools/bohemia_cook2_the_street_joins_for_the_map_10_18_26.py      (~1 min)

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the card of numbers and skills/bohemia-pixel-art, AH-01 and AH-03.
The source is his own tiles and COOK FOUR's tanned buildings (reference/art_bank/settlement/COOK4_*). No reference game.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S

K = 4                                             # his pixel reduced 4 to 1
PXM = 57.0 / K                                    # 14.25 px a metre
CELL = 96.0                                       # the map's cell, metres
m = lambda v: int(round(v * PXM))
rng = np.random.RandomState(10182)
SOIL, ROCKS, DRY, DRY2, WALLS, DIRT = '2. Soil and dirt tiles', 'Rocks and stones', '16. Dead trees and plants', '15. Dead Trees and dry plants', 'Wall tiles (1)', '2. Dirt path tiles'
VALLEY_TAN, GRAVEL_GREY = '#9a8e78', '#7f786b'
COLS, ROWS = 4, 3
W, H = m(CELL * COLS), m(CELL * ROWS)
OUT_KIT = os.path.join(R, 'records/target/cook2_map_joins'); os.makedirs(OUT_KIT, exist_ok=True)

# ---- his tiles at the scene's one pixel size -----------------------------------------------------------------------
def snap(small, orig, n=48):
    """reduced pixels back onto his own tile's colours (his top n, no new colour)"""
    pal = Image.fromarray(orig[..., :3]).quantize(n, method=Image.Quantize.MEDIANCUT)
    return np.asarray(Image.fromarray(small[..., :3]).quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB'))
def reduce_rgba(a):
    im = Image.fromarray(a); w, h = max(1, a.shape[1] // K), max(1, a.shape[0] // K)
    rgb = np.asarray(im.convert('RGB').resize((w, h), Image.BOX)); al = np.asarray(im.getchannel('A').resize((w, h), Image.BOX))
    return np.dstack([snap(rgb, a), np.where(al > 127, 255, 0).astype(np.uint8)])
_cache = {}
def piece(fam, i, cut=True, tint=None):
    k = (fam, i, cut, tint)
    if k not in _cache:
        a = S.pack(fam, i)
        if tint: a = S.recolour(a, a[..., 3] > 0, tint, levels=6, shift_deg=10)
        a = S.cut_frame(a, fam) if cut else a[11:-11, 11:-11]
        a = S.pad(a, 84, 84)
        _cache[k] = reduce_rgba(a)[..., :3]
    return _cache[k]
def tiled(fam, ids, cut=True, tint=None, weights=None):
    t0 = piece(fam, ids[0], cut, tint); th, tw = t0.shape[:2]
    out = np.zeros((H + th, W + tw, 3), np.uint8)
    for r in range(0, H + 1, th):
        for c in range(0, W + 1, tw):
            i = ids[rng.choice(len(ids), p=weights)] if weights else ids[rng.randint(len(ids))]
            a = piece(fam, i, cut, tint); out[r:r + th, c:c + tw] = a[:, ::-1] if rng.rand() < .5 else a
    return out[:H, :W]
def sprite(path_or_arr, scale=K):
    a = np.asarray(Image.open(path_or_arr).convert('RGBA')) if isinstance(path_or_arr, str) else path_or_arr
    return reduce_rgba(a)

# ---- the plan, in metres, then masks at the scene's pixel ------------------------------------------------------------
def mask(draw_fn):
    im = Image.new('L', (W, H), 0); draw_fn(ImageDraw.Draw(im)); return np.asarray(im) > 0
def rect(x0, y0, x1, y1): return lambda d: d.rectangle([m(x0), m(y0), m(x1) - 1, m(y1) - 1], fill=255)
def union(*ms):
    o = np.zeros((H, W), bool)
    for q in ms: o |= q
    return o
def grow(b, metres):
    r = max(1, m(metres)); o = b.copy()                     # a square dilation, separable (PIL's MaxFilter is O(k^2))
    for k in range(1, r + 1): o[k:] |= b[:-k]; o[:-k] |= b[k:]
    p = o.copy()
    for k in range(1, r + 1): p[:, k:] |= o[:, :-k]; p[:, :-k] |= o[:, k:]
    return p

SUBURB_X1, WORKS_X1 = 192.0, 288.0               # the district lines (cell lines)
TRACT_Y1 = 214.0                                  # the last wall of the tract; desert south of it
ART_Y, ART_W = 144.0, 14.0                        # the arterial, centred in the middle row, 14 m (a collector)
LOC_W = 11.0                                      # a local, 36 ft
LOCALS_NS = [48.0, 144.0]                         # centred in the suburb's two columns
LOCALS_EW = [(30.0, 0.0, 144.0 + LOC_W / 2), (78.0, 0.0, 144.0 + LOC_W / 2), (124.0, 0.0, 144.0 + LOC_W / 2), (200.0, 0.0, 144.0 + LOC_W / 2)]
PAVE_END = 240.0                                  # the local's pavement ends here and crumbles into a dirt track
FW_X, FW_W = 336.0, 25.0                          # the freeway centred in the east column: 2 x (1.2 + 7.2 + 2.4) + 3.4
FW_X0, FW_X1 = FW_X - FW_W / 2, FW_X + FW_W / 2
SB_X0, SB_X1 = FW_X0, FW_X0 + 10.8                # the southbound carriageway (the west one, right-hand traffic)
RAMP_W = 5.0
ART_X1 = 300.0                                    # the arterial leaves the grid here and turns into the ramp

road = union(mask(rect(0, ART_Y - ART_W / 2, ART_X1, ART_Y + ART_W / 2)),
             *[mask(rect(x - LOC_W / 2, 0, x + LOC_W / 2, PAVE_END)) for x in LOCALS_NS],
             *[mask(rect(x0, y - LOC_W / 2, x1, y + LOC_W / 2)) for (y, x0, x1) in LOCALS_EW],
             mask(rect(SB_X0, 0, SB_X1, CELL * ROWS)), mask(rect(SB_X1 + 3.4, 0, FW_X1, CELL * ROWS)))
# the ramp: a quarter arc from the arterial's end, south, then a taper along the southbound right shoulder
RC = (ART_X1, ART_Y + 22.0)                       # arc centre; radius 22 m to the ramp's centre line
def ramp_draw(d):
    pts = []
    for t in np.linspace(-np.pi / 2, 0, 40):
        pts.append((RC[0] + 22.0 * np.cos(t), RC[1] + 22.0 * np.sin(t)))
    x_end = RC[0] + 22.0
    for y in np.linspace(RC[1], 236.0, 30):       # the ramp runs south and closes on the mainline
        f = (y - RC[1]) / (236.0 - RC[1]); pts.append((x_end + f * (SB_X0 - RAMP_W / 2 + 0.3 - x_end), y))
    d.line([(m(x), m(y)) for x, y in pts], fill=255, width=m(RAMP_W), joint='curve')
    d.ellipse([m(ART_X1 - ART_W / 2), m(ART_Y - ART_W / 2), m(ART_X1 + ART_W / 2), m(ART_Y + ART_W / 2)], fill=255)
ramp = mask(ramp_draw)
road |= ramp
yy, xx = np.mgrid[0:H, 0:W]
Xm, Ym = xx / PXM, yy / PXM
suburb = (Xm < SUBURB_X1) & (Ym < TRACT_Y1)
works = (Xm >= SUBURB_X1) & (Xm < WORKS_X1)
desert = ~suburb & ~works
# the median barrier between the carriageways: his slab, a concrete wall seen from above
median = (Xm >= SB_X1 + 1.2) & (Xm < SB_X1 + 2.2)
# the sidewalk: within 1.5 m of a road, raised, in the suburb only (it stops at the district line and at the tract wall)
walk = grow(road, 1.5) & ~road & suburb
# the works' shoulder: 2 m of gravel by the road, then the concrete yards
shoulder = grow(road, 2.0) & ~road & ~walk & (works | desert)

# ---- the ground textures, his tiles ---------------------------------------------------------------------------------
ROAD_PLAIN = [0, 1, 8, 9, 10, 11]
road_px = tiled(S.ROAD, ROAD_PLAIN)
walk_px = tiled(S.SIDEWALK, [0, 1, 2, 6, 7, 16, 3, 13], weights=[.2, .2, .15, .12, .12, .09, .06, .06])
soil_px = tiled(SOIL, [2], cut=False, tint=VALLEY_TAN)
gravel_px = tiled(SOIL, [2], cut=False, tint=GRAVEL_GREY)
track_px = tiled(DIRT, [33, 34], cut=False, tint='#a39478')
img = soil_px.astype(np.float32)
img[works] = gravel_px[works]
# works: concrete yards from his slab (the aprons in front of the warehouses), laid as lots
yards = np.zeros((H, W), bool)
for (x0, y0, x1, y1) in ((196, 104, 284, 135.5), (196, 153, 250, 186), (196, 236, 284, 272)):
    yards |= mask(rect(x0, y0, x1, y1))
img[yards] = walk_px[yards] * 0.95
img[shoulder & works] = gravel_px[shoulder & works] * 0.93
img[walk] = walk_px[walk]
img[road] = road_px[road]
img[median] = walk_px[median] * 0.9

# the pavement end: his broken-edge tiles (30, 31, 32) as the last row of each local, their own alpha holes show the dirt
for x in LOCALS_NS:
    xs = m(x - LOC_W / 2); xe = m(x + LOC_W / 2); y = m(PAVE_END)
    cx = xs
    while cx < xe:
        t = S.pack(S.ROAD, [30, 31, 32][rng.randint(3)])[5:, 5:-5]       # keep its crumbling south edge
        t = reduce_rgba(S.pad(t, 84, 91)); h, w = t.shape[:2]; w = min(w, xe - cx)
        a = t[:, :w, 3:4] / 255.0
        img[y - h // 2:y - h // 2 + h, cx:cx + w] = img[y - h // 2:y - h // 2 + h, cx:cx + w] * (1 - a) + t[:, :w, :3] * a
        cx += w
    # past the end, the dirt track: his dirt path recoloured to caliche, a little narrower than the street
    tr = (Xm > x - 3.2) & (Xm < x + 3.2) & (Ym > PAVE_END + 2.5)
    img[tr] = track_px[tr]
    # the pavement's last 2.5 m are holed: what is past the crumble is soil, not road
    hole = road & (Ym >= PAVE_END + 2.5) & (np.abs(Xm - x) < LOC_W)
    img[hole & ~tr] = soil_px[hole & ~tr]
    road[hole] = False

# ---- the curb (suburb only): his slab's darker south face where the raised walk faces the eye, one hard shadow -------
rl = road_px.reshape(-1, 3).astype(int); SH = rl[rl.sum(1).argsort()[:len(rl) // 20]].mean(0)
raised = walk
FH = 2                                            # his 7-row face reduced 4 to 1
up = np.full((H, W), 99)
for k in range(1, FH + 3):
    hit = np.zeros_like(raised); hit[k:] = raised[:-k]; up = np.where((up == 99) & hit & road, k, up)
face = road & (up <= FH); img[face] = img[face] * 0.55 + walk_px[face] * 0.45 * 0.7
shd = road & (up > FH) & (up <= FH + 1); img[shd] = img[shd] * 0.5 + SH * 0.5
side = road & grow(raised, 0.1) & ~face & ~shd; img[side] = img[side] * 0.75 + SH * 0.25
yl = ~road & ~walk & grow(walk, 0.15) & suburb; img[yl] = img[yl] * 0.82

# ---- THE PAINT, lifted off his tiles as layers -----------------------------------------------------------------------
def layer(i, kind):
    a = S.cut_frame(S.pack(S.ROAD, i), S.ROAD)
    rgb = a[..., :3].astype(int)
    msk = ((rgb.sum(2) > 390) & (rgb.min(2) > 110)) if kind == 'white' else ((rgb[..., 0] - rgb[..., 2]) > 60)
    r = reduce_rgba(np.dstack([a[..., :3], (msk * 255).astype(np.uint8)]))
    return r
def lay(L, y, x, alpha=1.0):
    h, w = L.shape[:2]; y0, x0 = max(0, y), max(0, x); y1, x1 = min(H, y + h), min(W, x + w)
    if y1 <= y0 or x1 <= x0: return
    p = L[y0 - y:y1 - y, x0 - x:x1 - x].astype(np.float32); a = p[..., 3:4] / 255.0 * alpha
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + p[..., :3] * a
ORG = [layer(i, 'orange') for i in (18, 19, 20, 21, 22) if (S.ROAD, i) in S.UP]
# J1: the arterial's yellow double, one line from the suburb across the works to the ramp, broken only at the crossings
cy = m(ART_Y)
for x in range(0, m(ART_X1 - 6), ORG[0].shape[1]):
    xm = x / PXM
    if any(abs(xm + 3 - lx) < LOC_W / 2 + 6 for lx in LOCALS_NS[1:]): continue
    L = ORG[rng.randint(len(ORG))]; lay(L, cy - L.shape[0] // 2, x)
# the freeway: his white lines (tile 14) as the edge lines, cut to 3 m dashes on a 12 m cycle between the lanes
WH = layer(14, 'white'); cols = np.nonzero(WH[..., 3].sum(0) > 0)[0]
LINE = WH[:, cols.min():cols.min() + 2]           # one of his two white lines, 2 px at this scale
def vline(xm_, y0m, y1m, dash=None):
    y = m(y0m)
    while y < m(y1m):
        seg = LINE[:min(LINE.shape[0], m(y1m) - y)]
        if dash:
            seg = LINE[:m(dash[0])] if LINE.shape[0] >= m(dash[0]) else LINE
            seg = np.concatenate([seg] * int(np.ceil(m(dash[0]) / seg.shape[0])))[:m(dash[0])]
            lay(seg, y, m(xm_) - 1); y += m(dash[0] + dash[1]); continue
        lay(seg, y, m(xm_) - 1); y += seg.shape[0]
for (x0, x1) in ((SB_X0, SB_X1), (SB_X1 + 3.4, FW_X1)):
    vline(x0 + 1.2 if x0 == SB_X0 else x0 + 2.4, 0, CELL * ROWS)          # inside edge lines
    vline(x1 - 2.4 if x0 == SB_X0 else x1 - 1.2, 0, CELL * ROWS)
    lane = (x0 + 1.2 + 3.6) if x0 == SB_X0 else (x0 + 2.4 + 3.6)
    vline(lane, 0, CELL * ROWS, dash=(3.0, 9.0))
# J3: the gore, his tile 23's hatch recoloured onto his own white paint, laid in the triangle between ramp and mainline
G = S.cut_frame(S.pack(S.ROAD, 23), S.ROAD); g = G[..., :3].astype(int); gm = (g[..., 0] - g[..., 2]) > 60
white = S.cut_frame(S.pack(S.ROAD, 14), S.ROAD)[..., :3].astype(int); wpx = white[(white.sum(2) > 390) & (white.min(2) > 110)]
wl = wpx.sum(1); gl = g.sum(2)
# shade to shade: each hatch pixel takes the white pixel at the same luminance rank
ranks = np.searchsorted(np.sort(gl[gm]), gl[gm]) / max(1, gm.sum() - 1)
wsorted = wpx[wl.argsort()]
gw = g.copy(); gw[gm] = wsorted[(ranks * (len(wsorted) - 1)).astype(int)]
GORE = reduce_rgba(np.dstack([gw.astype(np.uint8), (gm * 255).astype(np.uint8)]))
gore_zone = (Ym > 196) & (Ym < 226) & (Xm > SB_X0 - RAMP_W) & (Xm < SB_X0 + 0.2) & road & ~ramp | \
            (ramp & (Ym > 200) & (Ym < 226) & (Xm < SB_X0 + 0.5) & (Xm > SB_X0 - 3.0))
gz = np.nonzero(gore_zone)
if len(gz[0]):
    y0, y1, x0, x1 = gz[0].min(), gz[0].max(), gz[1].min(), gz[1].max()
    for y in range(y0, y1, GORE.shape[0]):
        for x in range(x0, x1, GORE.shape[1]):
            L = GORE.copy(); h, w = L.shape[:2]
            L[..., 3] = L[..., 3] * gore_zone[y:y + h, x:x + w].astype(np.uint8)[:h, :w] if gore_zone[y:y + h, x:x + w].shape == (h, w) else 0
            lay(L, y, x)
# the ramp's edge lines: his white along both edges of the ramp (the ramp mask's own border)
redge = ramp & ~(np.asarray(Image.fromarray(ramp.astype(np.uint8) * 255).filter(ImageFilter.MinFilter(5))) > 0) & (Ym > ART_Y + 8)
img[redge] = img[redge] * 0.3 + wsorted[len(wsorted) // 2] * 0.7
# the works and desert road edges: no curb, his asphalt's own darkest pixels where the pavement stops (a worn edge)
edge = road & grow(~road & (works | desert), 0.15) & ~redge
img[edge] = img[edge] * 0.7 + SH * 0.3

# ---- decals, darken-only, sparse (rest area: the arterial's lanes stay quiet) --------------------------------------
def dec(src, y, x, strength, pct):
    global img
    if src.shape[2] == 4: src = np.where(src[..., 3:4] > 0, src[..., :3], 255).astype(np.uint8)
    h, w = src.shape[:2]; y, x = max(0, y), max(0, x); win = img[y:y + h, x:x + w]
    base = np.dstack([win.clip(0, 255), np.full(win.shape[:2], 255)]).astype(np.uint8)
    img[y:y + h, x:x + w] = S.decal(base, src, (0, 0), strength, thresh=np.percentile(src[..., :3].astype(int).sum(2), pct))[..., :3].astype(np.float32)
CR = [c for c in (29, 30, 31, 27, 28) if (S.ROAD, c) in S.UP]
for k in range(14):                               # the works stretch takes the trucks: wheel-path cracks on the arterial
    x = m(196 + rng.rand() * 90); y = m(ART_Y + (rng.rand() - .5) * ART_W * 0.7)
    dec(reduce_rgba(S.cut_frame(S.pack(S.ROAD, CR[rng.randint(len(CR))]), S.ROAD)), y, x, 0.7, 12)
for x in LOCALS_NS:                               # the locals crack toward the end of the pavement
    for k in range(3):
        dec(reduce_rgba(S.cut_frame(S.pack(S.ROAD, CR[rng.randint(len(CR))]), S.ROAD)), m(PAVE_END - 4 - rng.rand() * 20), m(x - 4 + rng.rand() * 3), 0.75, 12)

# ---- standing things at the same pixel: the block walls, COOK FOUR's buildings, his rocks and dry shrubs --------------
def put(sp, y, x, flip=False):
    sp = sp[:, ::-1] if flip else sp
    h, w = sp.shape[:2]; y0, x0 = max(0, y), max(0, x); y1, x1 = min(H, y + h), min(W, x + w)
    if y1 <= y0 or x1 <= x0: return
    p = sp[y0 - y:y1 - y, x0 - x:x1 - x].astype(np.float32); a = p[..., 3:4] / 255.0
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + p[..., :3] * a
WT = [sprite(S.pack(WALLS, i)[2:-2, 2:-2]) for i in (5, 7, 0)]
def wall_row(ym, x0m, x1m, skip=()):
    x = m(x0m)
    while x < m(x1m):
        if any(a <= x / PXM <= b for a, b in skip): x += WT[0].shape[1]; continue
        t = WT[rng.choice(3, p=[.45, .45, .1])]; t = t[:, :max(1, min(t.shape[1], m(x1m) - x))]
        put(t, m(ym) - t.shape[0], x); x += t.shape[1]
    sh = (Ym >= ym) & (Ym < ym + 0.35) & (Xm >= x0m) & (Xm < x1m); img[sh] = img[sh] * 0.6
# the tract's backs face the arterial (a real Las Vegas collector is lined with block wall), and the tract's south wall
gaps = [(x - LOC_W / 2 - 1.6, x + LOC_W / 2 + 1.6) for x in LOCALS_NS]
wall_row(ART_Y - ART_W / 2 - 1.5 - 0.6, 0, SUBURB_X1 - 3, gaps)
wall_row(ART_Y + ART_W / 2 + 1.5 + 2.2, 0, SUBURB_X1 - 3, gaps)
wall_row(TRACT_Y1, 0, SUBURB_X1 - 3, gaps)
HOUSES = ['CARPORT', 'GARAGE', 'PLAIN', 'PORCH', 'WING']
HS = {k: sprite(os.path.join(R, f'reference/art_bank/settlement/COOK4_RANCH_TAN_{k}.png')) for k in HOUSES}
houses = []; standing = []                     # upright things, laid after the ground (the map stands them up)
for (y, x0, x1) in LOCALS_EW:
    feet = y - LOC_W / 2 - 1.5 - 6.0                # 6 m front yards behind the sidewalk
    x = x0 + 4
    while True:
        k = HOUSES[rng.randint(len(HOUSES))]; s = HS[k]; wm = s.shape[1] / PXM
        if any(abs(x + wm / 2 - lx) < wm / 2 + LOC_W / 2 + 2 for lx in LOCALS_NS): x = min(lx for lx in LOCALS_NS if lx > x - 6) + LOC_W / 2 + 4; continue
        if x + wm > x1 - 8: break
        standing.append((s, m(x), m(feet) + 8)); houses.append([k, round(x, 1), round(feet, 1)]); x += wm + 3.0
WH_ = sprite(os.path.join(R, 'reference/art_bank/settlement/COOK4_WAREHOUSE_STRAIGHT_ROOF.png'))
works_bld = []
for (xm_, feet) in ((198.0, 103.0), (198.0 + WH_.shape[1] / PXM + 6, 103.0), (198.0, 235.0)):
    if xm_ + WH_.shape[1] / PXM > WORKS_X1 - 2: continue
    standing.append((WH_, m(xm_), m(feet))); works_bld.append([round(xm_, 1), feet])
BOULD = [0, 1, 2, 12, 13, 11, 47, 62, 63]; SHRUB = [(DRY, 19), (DRY, 20), (DRY, 21), (DRY, 23), (DRY2, 5), (DRY2, 6), (DRY, 38)]
land = []
for k in range(70):                               # the desert: sparse, clustered, never on a road
    for t in range(30):
        xm_, ym_ = rng.rand() * CELL * COLS, rng.rand() * CELL * ROWS
        if not desert[min(H - 1, m(ym_)), min(W - 1, m(xm_))]: continue
        if road[max(0, m(ym_) - 40):m(ym_) + 40, max(0, m(xm_) - 50):m(xm_) + 50].any(): continue
        break
    else: continue
    for j in range(rng.randint(1, 4)):
        x2, y2 = m(xm_) + rng.randint(-40, 40), m(ym_) + rng.randint(-30, 30)
        if rng.rand() < .45: s = sprite(S.pack(ROCKS, BOULD[rng.randint(len(BOULD))])); land.append(['rock', x2, y2])
        else: f, i = SHRUB[rng.randint(len(SHRUB))]; s = sprite(S.pack(f, i)); land.append(['shrub', i, x2, y2])
        put(s, y2, x2, rng.rand() < .5)
out = img.clip(0, 255).astype(np.uint8)          # THE GROUND: what the kit is cut from
for (sp_, x_, f_) in standing: put(sp_, f_ - sp_.shape[0], x_)
laid = img.clip(0, 255).astype(np.uint8)          # with COOK FOUR's buildings standing, for the picture only
Image.fromarray(laid).resize((W // 2, H // 2), Image.BOX).save(os.path.join(R, 'records/target/COOK2_THE_JOINS_LAID_TOPDOWN_HALF.webp'), quality=92, method=6)

# ---- the kit: each join cut on the map's own cell lines, with the edges RUN matches ---------------------------------
def cut(name, x0m, y0m, x1m, y1m, what, edges):
    p = out[m(y0m):m(y1m), m(x0m):m(x1m)]
    Image.fromarray(p).save(os.path.join(OUT_KIT, name + '.png'), optimize=True)
    return {'file': f'records/target/cook2_map_joins/{name}.png', 'what': what, 'metres': [x0m, y0m, x1m, y1m],
            'px': list(p.shape[1::-1]), 'edges': edges}
kit = {'_what': 'COOK TWO [the street joins for the map] (10/18): the pieces that join one district\'s street to the next, '
                'cut from his tiles on the map\'s own 96 m cell lines; a SEAM piece straddles a cell line (12 m each side), '
                'a CELL piece is one whole map cell. RUN lays them where the map has that join; COOK TWO owns the pixels.',
       'px_per_m': PXM, 'cell_m': CELL, 'scale_note': 'his native 57 px a metre reduced 4 to 1; the map\'s near stop is 2.67 px a metre, so RUN reduces',
       'map_widths_note': 'real widths: arterial 14 m, local 11 m, freeway 25 m, ramp 5 m; the map\'s BW table draws arterial 9 m, freeway 12 m: RUN matches the piece to the road, or the road to the piece',
       'pieces': [
    cut('J1_SEAM_SUBURB_TO_WORKS_ARTERIAL', 180, 96, 204, 192, 'a street crossing a district line: one asphalt, one yellow double, the suburb\'s sidewalk and curb end on the line, the works\' gravel shoulder starts',
        {'W': 'suburb ground, arterial 14 m centred 48 m down, sidewalks 1.5 m, block walls', 'E': 'works ground, arterial 14 m centred 48 m down, gravel shoulder 2 m', 'N': 'none', 'S': 'none'}),
    cut('J2_CELL_LOCAL_RUNS_OUT_INTO_DESERT', 0, 192, 96, 288, 'a road meeting a different ground: the tract\'s last local street, the sidewalk ends at the tract wall, the pavement crumbles at 48 m into a caliche dirt track',
        {'N': 'local 11 m centred 48 m across, sidewalks', 'S': 'dirt track 6.4 m centred 48 m across, desert', 'E': 'an E-W local 11 m centred 8 m down, then wall, then desert', 'W': 'same as E'}),
    cut('J3A_CELL_ARTERIAL_TURNS_ONTO_THE_RAMP', 288, 96, 384, 192, 'the freeway on-ramp, top: the arterial arrives from the west, curves south as a 5 m ramp beside the southbound lanes',
        {'W': 'arterial 14 m centred 48 m down, desert shoulders', 'S': 'ramp 5 m at about 34 m across, freeway 25 m centred 48 m across', 'N': 'freeway 25 m centred 48 m across', 'E': 'desert'}),
    cut('J3B_CELL_RAMP_MERGES_GORE', 288, 192, 384, 288, 'the freeway on-ramp, bottom: the ramp closes on the southbound shoulder, the white gore hatch between them',
        {'N': 'ramp 5 m and freeway 25 m', 'S': 'freeway 25 m centred 48 m across', 'E': 'desert', 'W': 'desert'}),
    cut('J4_SEAM_WORKS_TO_DESERT_ARTERIAL', 276, 96, 300, 192, 'the arterial leaves the works into open desert: the yards stop, the gravel shoulder runs on, the pavement edge goes bare',
        {'W': 'works ground, arterial 14 m centred 48 m down', 'E': 'desert, arterial 14 m centred 48 m down', 'N': 'none', 'S': 'none'}),
    cut('J5_SEAM_TRACT_WALL_SIDEWALK_ENDS', 0, 202, 96, 226, 'the tract\'s south wall: the local\'s sidewalk ends at the last lot, the street runs on into the desert without one',
        {'N': 'suburb', 'S': 'desert', 'W': 'none', 'E': 'none'}),
]}

# ---- THE MAP'S CAMERA: the same laid ground projected the way the map draws a cell (a 2:1 diamond) ----------------------
def iso(top, block_px, stand=()):
    """the map's 2:1 diamond: the ground is projected (x runs down-right, y down-left), a 96 m cell becomes block_px
       wide and block_px/2 tall (EYES: TW0 18, TH0 9); what stands is NOT projected, it is reduced and stood upright on
       its projected feet, the way the map draws a building"""
    sq = 0.70710678
    f = block_px * sq / (CELL * PXM)               # reduce so one projected axis step is sq of a pixel
    w, h = max(1, int(top.shape[1] * f)), max(1, int(top.shape[0] * f))
    small = snap(np.asarray(Image.fromarray(top).resize((w, h), Image.BOX)), top, 96)
    u0 = h * sq; OW, OH = int((w + h) * sq) + 2, int((w + h) * sq / 2) + 2
    # inverse map (u, v) -> (x, y): x - y = (u - u0)/sq ; x + y = 2v/sq
    a = 0.5 / sq; coeffs = (a, 2 * a, -a * u0, -a, 2 * a, a * u0)
    im = Image.fromarray(small).transform((OW, OH), Image.AFFINE, coeffs, resample=Image.NEAREST, fillcolor=(16, 16, 16))
    # pixels the transform pulled from outside the ground stay the background
    for (sp_, x_, f_) in sorted(stand, key=lambda t: t[1] + t[2]):
        xr, yr = (x_ + sp_.shape[1] / 2) * f, f_ * f
        u, v = (xr - yr) * sq + u0, (xr + yr) * sq / 2
        k = f * 1.118 * sq * 1.0
        sw, sh = max(1, int(sp_.shape[1] * k)), max(1, int(sp_.shape[0] * k))
        si = Image.fromarray(sp_).resize((sw, sh), Image.BOX)
        rgb = snap(np.asarray(si.convert('RGB')), sp_, 48); al = np.where(np.asarray(si.getchannel('A')) > 127, 255, 0).astype(np.uint8)
        sim = Image.fromarray(np.dstack([rgb, al])); im.paste(sim, (int(u - sw / 2), int(v - sh)), sim)
    return im
near = iso(out, 256, standing)                              # the near stop's pixel count (85.3 css px x 3 dpr per block)
far = iso(out, 54, standing)                                # zoom 1.0 (TW0 18 css x 3 dpr)
near.save(os.path.join(R, 'records/target/COOK2_THE_STREET_JOINS_MAP_CAMERA.png'), optimize=True)
near_x2 = near.resize((near.width * 2, near.height * 2), Image.NEAREST)   # the sheet shows it at 2x so the eye can read it

# ---- the twin: the same plan with his tiles AS BOUGHT, frames on, on his 96 grid, reduced the same way ---------------
raw = np.full((H, W, 3), 40, np.uint8); r2 = np.random.RandomState(10182)
tb = 96 // K
for r in range(0, H, tb):
    for c in range(0, W, tb):
        yr, xc = min(H - 1, r + tb // 2), min(W - 1, c + tb // 2)
        if road[yr, xc]: fam, ids = S.ROAD, ROAD_PLAIN
        elif walk[yr, xc] or yards[yr, xc]: fam, ids = S.SIDEWALK, [0, 1, 2, 6, 7]
        else: fam, ids = SOIL, [2, 3, 21, 1]
        t = reduce_rgba(S.pad(S.pack(fam, ids[r2.randint(len(ids))]), 96, 96))[..., :3]
        raw[r:r + tb, c:c + tb] = t[:min(tb, H - r), :min(tb, W - c)]
twin_near = iso(raw, 256, standing)

# ---- the map now: EYES' photograph of the committed demo at zoom 0.5 (the game's camera), the city's middle -----------
now = Image.open(os.path.join(R, 'records/eyes_map_four_numbers/step_0.5000_skyoff.png')).convert('RGB')
now_crop = now.crop((20, 1090, 670, 1580)).resize((650 * 2, 490 * 2), Image.NEAREST)

# ---- the sheet -------------------------------------------------------------------------------------------------------
pad_ = 30
cw = max(near_x2.width, now_crop.width) + twin_near.width + pad_ * 3
z = [(J, int(J['metres'][0] * PXM), int(J['metres'][1] * PXM)) for J in kit['pieces']]
crops = [Image.open(os.path.join(R, J['file'])) for J in kit['pieces']]
crow_h = max(c.height for c in crops[:2]) // 2 + 40
sheet_h = 120 + near_x2.height + 60 + now_crop.height + 60 + crow_h * 2 + 200
sheet = Image.new('RGB', (cw, sheet_h), (14, 14, 14)); d = ImageDraw.Draw(sheet)
d.text((10, 8), 'THE STREET JOINS FOR THE MAP: two districts joined (the suburb, the works) and the freeway, four map cells by three, cut from his tiles. Nothing drawn.', fill=(235, 235, 235))
d.text((10, 28), f'PIXEL SIZE his pixel reduced 4:1 ({PXM:.2f} px a metre), one size in the scene; shown here at the map\'s NEAR STOP pixel count (a 96 m block = 256 px) | PALETTE records/BOHEMIA_COOK2_THE_STREET_JOINS_PALETTE_10_18_26.json | LIGHT from above, as his pack paints it', fill=(200, 220, 255))
d.text((10, 48), 'ONE QUESTION: do the two districts and the freeway read as one connected city?', fill=(235, 200, 120))
d.text((10, 76), 'OURS, from the map\'s camera (the 2:1 diamond), at the near stop, enlarged 2x:', fill=(235, 235, 235))
d.text((near_x2.width + pad_ * 2, 76), 'THE TWIN (1x): the same plan, his tiles AS BOUGHT on their 96 grid, frames on, same camera:', fill=(235, 235, 235))
sheet.paste(near_x2, (pad_, 100)); sheet.paste(twin_near, (near_x2.width + pad_ * 2, 100))
y = 100 + near_x2.height + 40
d.text((10, y - 22), 'THE MAP NOW (EYES\' photograph of the committed demo at zoom 0.5, the city\'s middle, enlarged 2x): every street a grey line, every district the same speckle', fill=(235, 235, 235))
sheet.paste(now_crop, (pad_, y))
d.text((now_crop.width + pad_ * 2, y), 'AT ZOOM 1.0 (a block 54 px):', fill=(235, 235, 235)); sheet.paste(far, (now_crop.width + pad_ * 2, y + 20))
y += now_crop.height + 40
d.text((10, y - 22), 'THE KIT AT ITS OWN PIXEL (top-down, half size on this sheet), each cut on the map\'s cell lines:', fill=(235, 235, 235))
x = pad_
for J, c in zip(kit['pieces'], crops):
    cc = c.resize((c.width // 2, c.height // 2), Image.NEAREST)
    if x + cc.width > cw - pad_: x = pad_; y += crow_h
    sheet.paste(cc, (x, y)); d.text((x, y + cc.height + 4), os.path.basename(J['file'])[:-4], fill=(180, 180, 180)); x += cc.width + pad_
sheet = sheet.crop((0, 0, cw, min(sheet_h, y + crow_h + 20)))
sheet.save(os.path.join(R, 'records/target/COOK2_THE_STREET_JOINS_FOR_THE_MAP.webp'), lossless=True, method=6)

# ---- the palette and the measurements -------------------------------------------------------------------------------
q = (out // 8).reshape(-1, 3); uq, cnt = np.unique(q, axis=0, return_counts=True); order = cnt.argsort()[::-1]
json.dump({'_what': 'COOK TWO, the street joins for the map (10/18): the scene\'s palette. Every reduced tile snapped to his own tile\'s colours; darkened (curb, walls, decals) or blended (paint) only.',
           'distinct_colours_5bit': int(len(uq)), 'top32_hex': ['#%02x%02x%02x' % tuple(int(v) * 8 + 4 for v in uq[i]) for i in order[:32]],
           'top32_share': round(float(cnt[order[:32]].sum() / cnt.sum()), 4)},
          open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_STREET_JOINS_PALETTE_10_18_26.json'), 'w'), indent=1)
# THE CONNECTION, measured: the roadway's continuity across every district line (no break, no step in tone)
def cont(xm_line, y0m, y1m):
    a = out[m(y0m):m(y1m), m(xm_line) - m(6):m(xm_line)].reshape(-1, 3).astype(int).mean(0)
    b = out[m(y0m):m(y1m), m(xm_line):m(xm_line) + m(6)].reshape(-1, 3).astype(int).mean(0)
    rd = road[m(y0m):m(y1m), m(xm_line) - 2:m(xm_line) + 2].all(1).mean()
    return {'road_rows_unbroken': round(float(rd), 3), 'tone_step_rgb': [round(float(v), 1) for v in (b - a)]}
meas = {'canvas_px': [W, H], 'px_per_m': PXM, 'cells': [COLS, ROWS],
        'J1_suburb_to_works': cont(SUBURB_X1, ART_Y - ART_W / 2 + 1.5, ART_Y + ART_W / 2 - 1.5),
        'J4_works_to_desert': cont(WORKS_X1, ART_Y - ART_W / 2 + 1.5, ART_Y + ART_W / 2 - 1.5),
        'sidewalk_px_in_works_or_desert': int((walk & ~suburb).sum()),
        'yellow_double_metres': round(sum(1 for x in range(0, m(ART_X1 - 6), ORG[0].shape[1])) * ORG[0].shape[1] / PXM, 1),
        'houses': houses, 'works_buildings': works_bld, 'desert_landscape': len(land),
        'slots_for_the_rig': {'_why': 'rule 115a: standing props and vehicles are the rig\'s', 'chain_link_along_the_works_yards': [[196, 135.5, 284, 135.5], [196, 153, 250, 153]],
                              'freeway_sign_at_the_ramp': [ART_X1 + 8, ART_Y + 10], 'street_lights_on_the_arterial': [[x, ART_Y - ART_W / 2 - 1] for x in range(20, 300, 40)]}}
kit['measured'] = meas
json.dump(kit, open(os.path.join(OUT_KIT, 'COOK2_MAP_JOINS_KIT.json'), 'w'), indent=1)
json.dump(meas, open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_STREET_JOINS_FOR_THE_MAP_10_18_26.json'), 'w'), indent=1)
print('canvas', W, H, 'colours', len(uq), json.dumps({k: meas[k] for k in ('J1_suburb_to_works', 'J4_works_to_desert', 'sidewalk_px_in_works_or_desert')}))
print('sheet', sheet.size, 'near', near.size)
