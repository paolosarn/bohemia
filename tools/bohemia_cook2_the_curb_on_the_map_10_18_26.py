#!/usr/bin/env python3
"""COOK TWO [the curb on the map] (10/18; his 10/10 note 'a sidewalk curb is a little elevated from the street too', his
YES on the curb that stands up in the fight, cook2-one-at-a-time-the-curb-10-11). PURPOSE: the map's streets read flat
next to the fight's raised curb. This cuts THE MAP'S STREET from his tiles, with the curb's lip, its face and its shadow,
at the map's own pixel count, as a kit RUN lays in place of the flat band __THE_STREETS_JOIN__ strokes today.
records/ only (rule 100); nothing drawn (rule 108): every colour is one of his pixels (his road, his slab, his slab's own
south face) or his pixel blended with his own lip or shadow colour, the grammar of the curb he voted up.

THE KIT (records/target/cook2_map_curb/, keyed in COOK2_MAP_CURB_KIT.json):
  * one street piece for each of the 16 ways a road block meets its road neighbours (east, west, south, north: the bits
    of RUN's own loop in mapStreetTile, d = 0..3), so RUN lays one image per road block, chosen by the same neighbour
    test it runs now; the arms run to the block's edge midpoints, where the neighbour's arm takes over.
  * at THREE of the map's pixel counts (a block 256, 128 and 64 device px wide: the near stop, one step out, the middle),
    because a curb is a pixel-scale thing: the lip is 1 px, the face 3 / 2 / 1 px and the shadow 3 / 2 / 1 px at each,
    never a 3 px face shrunk to nothing; RUN takes the largest level at or under the zoom's block width.
  * widths are RUN's own (the asphalt 0.17 of a block, the kerb strip 0.05, perpendicular on the screen), so the kit
    drops in where the band is drawn and nothing around the street moves.
HOW A PIXEL IS MADE: the street is a height field on the map's own 2:1 diamond (sx = u - v, sy = (u + v) / 2; a block
TW px wide is TW/2 plan px a side); the sidewalk stands the face's height above the road. Each screen pixel sends one ray
down: it lands on the sidewalk's top (his slab), on the curb's face (his slab's own south face, rows top to foot), or on
the road (his road); a road pixel with the sidewalk within the shadow's length toward the light is in the curb's shadow
(his road blended with his road's darkest twentieth, 0.55, as the voted curb). The light is the style guide's one light
(screen 155 degrees: from the left and a little above), so on the map a north-south street (screen up-right to
down-left) has its west curb's face in shade and the shadow on the road beside it, and an east-west street, whose curbs
run with the sun, shows its north face in his face's own tones and casts nothing. Every pixel is owned by the one block
whose ground the ray lands in, so two pieces never paint the same pixel and no line shows where they meet.
  python3 tools/bohemia_cook2_the_curb_on_the_map_10_18_26.py        (~1 min)

REUSE CHECK (REUSE-FIRST, 7/22): his own tiles from the approved set, through the stretch-the-pack module (it opens the
HD tile repo and his 7/13 UP list): '1. Cracked street tiles' 8, 0, 9 (asphalt) and 18-21 (the yellow), '1. Cracked
contrete tiles' 28, 0, 23, 1, 27 (the top) and 0, 1, 2, 6, 7 (the face); the lip and the shadow are the corner tool's
grammar (his slab's lit fortieth, his road's darkest twentieth), the curb he voted up; nothing new is made.

TASTE CHECK: his YES on the curb that stands up (10/17 UP, cook2-one-at-a-time-the-curb-10-11) and on the 47 corners
(the curb return); his 'nothing bright' on the valley (the yellow is his own worn paint, 165/107/35); his NO on the Vegas
block was composition, so the map shows the map's own streets, not a block made up for the sheet.

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set: '1. Cracked street tiles', '1. Cracked contrete tiles'), the card of numbers
and the style guide (records/target/BOHEMIA_STYLE_GUIDE.json: the light, the contact shadow down and right, tiles carry
no drawn outline), AH-01 and AH-03. The twin is his slab, whose dark bottom band IS a curb face, and the curb he voted
up (records/target/COOK2_ONE_AT_A_TIME_THE_CURB.png). No reference game.
"""
import json, math, os, sys
import numpy as np
from PIL import Image
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S

OUT = os.path.join(R, 'records/target/cook2_map_curb'); os.makedirs(OUT, exist_ok=True)
LEVELS = {256: dict(face=3, shadow=3.3), 128: dict(face=2, shadow=2.2), 64: dict(face=1, shadow=1.1)}
ASPH, KERB = 0.17, 0.05                    # RUN's band: asphalt TW*0.17, kerb TW*0.05, perpendicular on the screen
PERP = 2 / math.sqrt(5)                    # a plan width w shows w*0.894 across the screen on either diagonal
# two families, each a half-width of asphalt and a sidewalk width, in parts of the block's plan side P (= TW/2):
#   BLOCK: the street IS the road block, as the map's own arterial picture draws it now (a 256 px block of road, its
#          sidewalks on the edges): asphalt to 0.43, the sidewalk to the block's edge (0.07);
#   BAND:  RUN's band (__THE_STREETS_JOIN__): asphalt TW*0.17 and kerb TW*0.05 across the screen, the street as a line
#          where a block is small (RUN's far zooms)
FAMILIES = {'block': {'ha': 0.43, 'kb': 0.07},
            'band': {'ha': ASPH * 2 / PERP / 2, 'kb': KERB * 2 / PERP}}
ROAD_PLAIN = [8, 0, 9]                     # his three cleanest road tiles with no paint, by crack share (2.8, 3.4, 3.7% under
                                           # lum 30; the one real street's 1, 10, 11 carry 5 to 7% and failed D5's rest area)
WALK_TOP = [28, 0, 23, 1, 27]              # his five cleanest unpainted slabs for the sidewalk's top (2.2 to 3.1% cracks)
SLABS = [0, 1, 2, 6, 7]                    # his three cleanest slabs and two more (the curb he voted up)
FACE_ROWS = (-7, -6, -5, -4, -3)           # his slab's south face, top to dark foot (lum 51, 44, 43, 44, 24); the two
                                           # black rows under it are the tile's own frame, never a curb
GUIDE = json.load(open(os.path.join(R, 'records/target/BOHEMIA_STYLE_GUIDE.json')))
SCREEN_DEG = [f for f in GUIDE['fields'] if f['key'] == 'light'][0]['value']['screen_light_deg']
# the light, toward it, on the screen (y down) and on the map's plan (u = sy + sx/2, v = sy - sx/2)
_sx, _sy = math.cos(math.radians(SCREEN_DEG)), -math.sin(math.radians(SCREEN_DEG))
_lu, _lv = _sy + _sx / 2, _sy - _sx / 2
LT = np.array([_lu, _lv]) / math.hypot(_lu, _lv)

# ---- his pixels ------------------------------------------------------------------------------------------------------
def tiles(fam, ids):
    """his tiles, frame cut; the few clear pixels inside a tile (up to 25, his crack holes) take the nearest of his own
    opaque pixels in the row, so a clear pixel's hidden colour never reaches the map"""
    out = []
    for i in ids:
        a = S.cut_frame(S.pack(fam, i), fam).copy()
        for _ in range(a.shape[1]):
            hole = a[..., 3] <= 127
            if not hole.any():
                break
            for dx in (-1, 1):
                src = np.roll(a, dx, axis=1); fill = hole & (src[..., 3] > 127)
                a[fill] = src[fill]; hole &= ~fill
        out.append(a[2:-2, 2:-2, :3])                              # and 2 px more: his road's first row is a lit frame row
    return out
ROAD_T, WALK_T = tiles(S.ROAD, ROAD_PLAIN), tiles(S.SIDEWALK, WALK_TOP)

def pool(fam, ids, cut=True, rows=None):
    px = []
    for i in ids:
        a = S.pack(fam, i)
        a = S.cut_frame(a, fam) if cut else a
        if rows is not None:
            a = a[rows]
        px.append(a[..., :3][a[..., 3] > 127] if a.shape[-1] == 4 else a[..., :3].reshape(-1, 3))
    return np.concatenate(px).astype(np.uint8)
ROAD = pool(S.ROAD, ROAD_PLAIN)
WALK = pool(S.SIDEWALK, WALK_TOP)                                      # the slab's top (its frame and face cut off)
FACE = []
for i in SLABS:
    a = S.pack(S.SIDEWALK, i)[..., :3]
    FACE.append(np.stack([a[r, 5:a.shape[1] - 5] for r in FACE_ROWS]))
FACE = np.concatenate(FACE, axis=1)                                  # 5 rows x ~430 columns of his face, end to end
_l = lambda p: p.astype(float) @ [0.299, 0.587, 0.114]
# his yellow paint (the worn double on his road tiles 18-21, R - B > 60: about (165, 107, 35)), his pixels in his order
PAINT = []
for i in (18, 19, 20, 21):
    a = S.cut_frame(S.pack(S.ROAD, i), S.ROAD)[..., :3].astype(int)
    PAINT.append(a[(a[..., 0] - a[..., 2]) > 60])
PAINT = np.concatenate(PAINT).astype(float)
LIP = WALK[_l(WALK).argsort()[-len(WALK) // 40:]].astype(float).mean(0)          # his slab's lit edge (the corner tool's)
SHADOW = ROAD[_l(ROAD).argsort()[:len(ROAD) // 20]].astype(float).mean(0)       # his road's darkest twentieth

TEX_STEP = 2                               # his pixel, every second one: his crack at half its size (one plan texel is
                                           # 0.75 m; at his own pixel a crack 0.5 m long drew 30 m long on the map)
def texture(src, P, seed, step=None):
    """a P x P plan texture of HIS TILES AT HIS OWN PIXEL (one plan texel, one of his pixels, in his order; rule 105: the
    pack's pixel is the floor), two by two of his tiles cut to P/2 at a random place, some flipped: his tile seams fall
    on the block's edges and its middle lines, so where two pieces meet is one more of his own seams, never a new line.
    (Round one's first pass picked one of his pixels at random per texel: TV static, his grain lost.)"""
    k = step or TEX_STEP
    r = np.random.RandomState(seed)
    h = P // 2
    while h * k > min(t.shape[0] for t in src) and h > 8:
        h //= 2                                                     # a crop never runs off his tile
    n = P // h
    out = np.zeros((P, P, 3))
    for gy in range(n):
        for gx in range(n):
            t = src[r.randint(len(src))]
            y0, x0 = r.randint(0, t.shape[0] - h * k + 1), r.randint(0, t.shape[1] - h * k + 1)
            c = t[y0:y0 + h * k:k, x0:x0 + h * k:k]                 # nearest: every pixel one of his own
            if r.rand() < 0.5: c = c[:, ::-1]
            out[gy * h:(gy + 1) * h, gx * h:(gx + 1) * h] = c
    return out

# ---- the street on the plan ------------------------------------------------------------------------------------------
ARMS = ((1, 0), (-1, 0), (0, 1), (0, -1))                           # E W S N, RUN's d = 0..3
def classify(u, v, mask, P, ha, kb, r):
    """0 road, 1 sidewalk, 2 beyond (the block's own art; transparent). The arms run straight past the block's edge, so
    a neighbour's arm continues it: the ray of a pixel near the edge sees the same street on both sides."""
    c = P / 2.0
    du, dv = u - c, v - c
    arms = [ARMS[d] for d in range(4) if mask >> d & 1]
    def inside(w, fr):
        hit = du * du + dv * dv <= w * w                             # the middle: a round end, a rounded outer corner
        for (au, av) in arms:
            along = du * au + dv * av
            across = np.abs(dv) if not av else np.abs(du)
            hit |= (along >= 0) & (across <= w)
        # the curb returns: a fillet of radius fr in the corner between two arms at right angles
        if fr > 0:
            for (au, av) in arms:
                for (bu, bv) in arms:
                    if au == 0 or bv == 0 or (au, av) == (bu, bv):
                        continue                                    # one arm along u, the other along v
                    cu, cv = au * (w + fr), bv * (w + fr)         # the fillet circle's centre (relative to the middle)
                    inq = (du * au >= w) & (du * au <= w + fr) & (dv * bv >= w) & (dv * bv <= w + fr)
                    hit |= inq & ((du - cu) ** 2 + (dv - cv) ** 2 >= fr * fr)
        return hit
    road = inside(ha, r)
    walk = inside(ha + kb, max(0.0, r - kb)) & ~road
    return np.where(road, 0, np.where(walk, 1, 2))

def paint(u, v, mask, P, ha):
    """the BLOCK street's centre line, his yellow double (two 1-texel lines, a texel apart, on a 128-texel block; one line
    on a smaller one): through a straight piece, along each arm to the junction's edge at a tee or a crossing (no paint
    inside a junction), round a quarter circle through a bend, to the middle of a dead end"""
    c = P / 2.0; du, dv = u - c, v - c
    arms = [ARMS[d] for d in range(4) if mask >> d & 1]
    band = (lambda q: (np.abs(q) >= 0.5) & (np.abs(q) <= 1.5)) if P >= 64 else (lambda q: np.abs(q) <= 0.5)
    hit = np.zeros(u.shape, bool)
    uarms = [a for a in arms if a[0]]; varms = [a for a in arms if a[1]]
    if len(arms) == 2 and len(uarms) == 1:                          # a bend: a quarter circle of radius P/4
        R = P / 4.0; au, bv = uarms[0][0], varms[0][1]
        q = np.hypot(du - au * R, dv - bv * R) - R
        hit |= (du * au >= 0) & (du * au <= R) & (dv * bv >= 0) & (dv * bv <= R) & band(q)
        hit |= (du * au >= R) & band(dv)
        hit |= (dv * bv >= R) & band(du)
        return hit
    start = 0.0 if len(arms) <= 2 else ha                           # a junction keeps its middle clear of paint
    for (au, av) in arms:
        along = du * au + dv * av
        across = dv if au else du
        hit |= (along >= start) & band(across)
    return hit

def normal_to_road(u, v, mask, P, ha, kb, r, rho):
    """the direction from a curb point into the road: the mean of 16 directions that land on the road"""
    acc = np.zeros(u.shape + (2,))
    for k in range(16):
        a = 2 * math.pi * k / 16; e = np.array([math.cos(a), math.sin(a)])
        acc += (classify(u + rho * e[0], v + rho * e[1], mask, P, ha, kb, r) == 0)[..., None] * e
    n = np.linalg.norm(acc, axis=-1, keepdims=True)
    return np.where(n > 1e-6, acc / np.maximum(n, 1e-6), 0)

def piece(mask, TW, variant=0, fam='block'):
    """one street piece: TW wide, TW/2 + face tall; plan (0, 0), the block's top vertex, sits at (TW/2, face)"""
    L = LEVELS[TW]; P = TW // 2; hs = L['face']
    ha, kb = FAMILIES[fam]['ha'] * P, FAMILIES[fam]['kb'] * P
    r = min(2 * kb, P / 2 - ha)                                     # the curb return stays inside its own block
    H = P + hs
    ys, xs = np.mgrid[0:H, 0:TW].astype(float)
    def inv(t):
        sx = xs + 0.5 - TW / 2; sy = ys + 0.5 + t - hs
        return sy + sx / 2, sy - sx / 2
    tex_r, tex_w = texture(ROAD_T, P, 10 + variant), texture(WALK_T, P, 20 + variant)
    out = np.zeros((H, TW, 4), float)
    kind = np.full((H, TW), -1)                                     # 0 road, 1 top, 2 face, 3 shadow, 4 lip
    # the top first: the sidewalk's (and the block's) top, the face's height up
    uh, vh = inv(hs); ch = classify(uh, vh, mask, P, ha, kb, r)
    # the face: from the top down, the first height at which the ray is inside the raised ground
    hit_t = np.full((H, TW), np.nan); hu = np.zeros((H, TW)); hv = np.zeros((H, TW)); hc = np.full((H, TW), -1)
    for t in np.arange(hs - 0.25, -0.01, -0.25):                   # down to the road itself (round one's pinholes)
        ut, vt = inv(t); ct = classify(ut, vt, mask, P, ha, kb, r)
        new = (ch == 0) & np.isnan(hit_t) & (ct != 0)
        hit_t[new] = t; hu[new] = ut[new]; hv[new] = vt[new]; hc[new] = ct[new]
    u0, v0 = inv(0.0); c0 = classify(u0, v0, mask, P, ha, kb, r)
    own = lambda u, v: (u >= 0) & (u < P) & (v >= 0) & (v < P)
    def idx(u, v):
        """his texture at the SCREEN's pixel (round one sampled it on the plan, so one texel drew 2 px wide on the 2:1
        diamond, which the twin gate's grid ruler reads as a mixel): the ground point's place on the screen, folded
        onto the P x P texture by the map's own lattice (a block's neighbours sit (P, P/2) and (-P, P/2) away), so the
        texel beside a block's edge is the next block's, and his texture runs on with no line"""
        X = np.floor(u - v).astype(int); Y = np.floor((u + v) / 2).astype(int)
        k = np.floor_divide(X, P)
        return (Y - k * (P // 2)) % P, X - k * P                    # (row, column)
    # 1. the sidewalk's top (his slab), its lip where it meets the road
    top = (ch == 1) & own(uh, vh)
    ir, ic = idx(uh, vh); out[top, :3] = tex_w[ir[top], ic[top]]; kind[top] = 1
    near_road = np.zeros_like(top)
    for k in range(8):
        a = 2 * math.pi * k / 8
        near_road |= classify(uh + math.cos(a), vh + math.sin(a), mask, P, ha, kb, r) == 0
    lip = top & near_road
    if lip.any():
        n = normal_to_road(uh[lip], vh[lip], mask, P, ha, kb, r, 2.0)
        lit = np.clip(n @ LT, 0, 1)                                 # a lip facing the light takes his lit edge full
        w = (0.35 + 0.4 * lit)[:, None]
        out[lip, :3] = out[lip, :3] * (1 - w) + LIP * w; kind[lip] = 4
    # 2. the curb's face: his slab's south face, top to foot; in shade where it turns from the light
    face = ~np.isnan(hit_t) & (hc == 1) & own(hu, hv)
    if face.any():
        row = np.clip(((hs - hit_t[face]) / hs * len(FACE_ROWS)).astype(int), 0, len(FACE_ROWS) - 1)
        col = np.floor(hu[face] + hv[face]).astype(int) % FACE.shape[1]   # his face read along the curb, at his pixel
        fc = FACE[row, col].astype(float)
        n = normal_to_road(hu[face], hv[face], mask, P, ha, kb, r, 2.0)
        away = np.clip(-(n @ LT), 0, 1)[:, None]
        fc = fc * (1 - 0.35 * away) + SHADOW * 0.35 * away
        out[face, :3] = fc; kind[face] = 2
    # 3. the road (his road), in the curb's shadow where the raised walk stands toward the light within its length
    road = np.isnan(hit_t) & (ch == 0) & (c0 == 0) & own(u0, v0)
    ir, ic = idx(u0, v0); out[road, :3] = tex_r[ir[road], ic[road]]; kind[road] = 0
    if fam == 'block' and mask:
        pm = road & paint(u0, v0, mask, P, ha)
        out[pm, :3] = PAINT[(np.floor(u0[pm] + v0[pm]).astype(int) * 7) % len(PAINT)]; kind[pm] = 5
    sh = np.zeros_like(road)
    for s in np.arange(0.5, L['shadow'] + 1e-6, 0.5):
        sh |= classify(u0 + s * LT[0], v0 + s * LT[1], mask, P, ha, kb, r) != 0
    sh &= road
    out[sh, :3] = out[sh, :3] * 0.45 + SHADOW * 0.55; kind[sh] = 3
    out[..., 3] = np.where(kind >= 0, 255, 0)
    return out.clip(0, 255).round().astype(np.uint8), kind

# ---- the kit ---------------------------------------------------------------------------------------------------------
kit = {'_what': 'COOK TWO [the curb on the map] (10/18): the map\'s street with the curb\'s lip, face and shadow, from his '
               'tiles, one piece per road block, for RUN to lay in place of the flat band (__THE_STREETS_JOIN__).',
       'mask_bits': {'1': 'east (x+1)', '2': 'west (x-1)', '4': 'south (y+1)', '8': 'north (y-1)',
                     '_how': 'RUN\'s own loop in mapStreetTile: d = 0..3 -> mask |= 1 << d for every road neighbour'},
       'lay': 'atlas = COOK2_MAP_CURB_<FAMILY>_<TW>.png, 16 pieces in a row (mask 0..15), each TW wide and TW/2 + face tall, '
              'two rows (the two variants; take row (x * 7 + y * 13) % 2 so a street never shows one piece twice running '
              'on a diagonal). For a road block: p = iso(x, y, ox, oy) (the block\'s top vertex); draw piece `mask` at '
              '(p.sx - TW/2, p.sy - face * TW/TWk) at width TW and height (TWk/2 + face) * TW/TWk, smoothing off, '
              'in the tile loop where the block\'s own art is drawn: BLOCK in place of the arterial picture (it is the whole '
              'road block), BAND where the band is drawn now (__THE_STREETS_JOIN__). TWk = the largest level at or under the '
              'block\'s device width (TW * CV_DPR), else the smallest: a piece is only ever enlarged (under 2x), never '
              'shrunk past its 1 px lip. Streets only (RUN\'s J value 1); the freeway keeps '
              'its band (a freeway has a shoulder, not a curb). A block on a deck or a dip keeps the band.',
       'source': {'road': ['1. Cracked street tiles', ROAD_PLAIN], 'sidewalk_top': ['1. Cracked contrete tiles', WALK_TOP],
                  'curb_face': ['1. Cracked contrete tiles', SLABS, 'rows %s of each slab (its south face, top to foot)' % (FACE_ROWS,)],
                  'lip_rgb': LIP.round(1).tolist(), 'shadow_rgb': SHADOW.round(1).tolist(),
                  'light': {'screen_deg': SCREEN_DEG, 'toward_on_the_plan': LT.round(4).tolist(), 'from': 'records/target/BOHEMIA_STYLE_GUIDE.json'}},
       'families': {}}
ATL = {}
VARIANTS = 2                               # rule 114c: a tile ships with its two variants
for fam in FAMILIES:
    kit['families'][fam] = {'asphalt_half_width_of_P': round(FAMILIES[fam]['ha'], 4), 'sidewalk_width_of_P': round(FAMILIES[fam]['kb'], 4), 'levels': {}}
    for TW, L in LEVELS.items():
        rows, counts = [], []
        for var in range(VARIANTS):
            row = []
            for mask in range(16):
                a, k = piece(mask, TW, var, fam)
                row.append(a)
                if var == 0:
                    counts.append({'mask': mask, 'road': int((k == 0).sum()), 'paint': int((k == 5).sum()), 'top': int((k == 1).sum()), 'lip': int((k == 4).sum()),
                                   'face': int((k == 2).sum()), 'shadow': int((k == 3).sum())})
                if TW == 256 and var == 0 and mask in (3, 12, 15, 7):
                    Image.fromarray(a).save(os.path.join(OUT, 'COOK2_MAP_CURB_%s_256_M%02d.png' % (fam.upper(), mask)), optimize=True)
            rows.append(np.concatenate(row, axis=1))
        ATL[fam, TW] = np.concatenate(rows, axis=0)
        f = 'COOK2_MAP_CURB_%s_%d.png' % (fam.upper(), TW)
        Image.fromarray(ATL[fam, TW]).save(os.path.join(OUT, f), optimize=True)
        kit['families'][fam]['levels'][str(TW)] = {'file': 'records/target/cook2_map_curb/' + f, 'piece_px': [TW, TW // 2 + L['face']],
                                                   'face_px': L['face'], 'shadow_plan_px': L['shadow'], 'lip_px': 1, 'counts': counts}

# ---- laid: a grid of streets (every block edge a seam), back to front, as the map draws it ---------------------------
def lay(TW, net, n, fam):
    """net[y][x] True for a road block; returns the street layer alone, the map's painter's order"""
    hs = LEVELS[TW]['face']; P = TW // 2
    W_, H_ = n * TW + TW, n * P + P + hs
    can = np.zeros((H_, W_, 4), np.uint8)
    ox, oy = W_ // 2 - TW // 2, hs
    for s in range(2 * n):
        for x in range(n):
            y = s - x
            if not (0 <= y < n) or not net[y][x]:
                continue
            m = sum(1 << d for d, (dx, dy) in enumerate(((1, 0), (-1, 0), (0, 1), (0, -1)))
                    if 0 <= x + dx < n and 0 <= y + dy < n and net[y + dy][x + dx])
            hk = TW // 2 + hs; vr = (x * 7 + y * 13) % VARIANTS
            a = ATL[fam, TW][vr * hk:(vr + 1) * hk, m * TW:(m + 1) * TW]
            sx, sy = ox + (x - y) * TW // 2, oy + (x + y) * P // 2 - hs
            reg = can[sy:sy + a.shape[0], sx:sx + TW]; al = a[..., 3:] > 0
            can[sy:sy + a.shape[0], sx:sx + TW] = np.where(al, a, reg)
    return can
N_ = 5
NET = [[(x == 2 or y == 2 or (x == 0 and y < 3) or (y == 4 and x > 1)) for x in range(N_)] for y in range(N_)]
for fam in FAMILIES:
    for TW in LEVELS:
        Image.fromarray(lay(TW, NET, N_, fam)).save(os.path.join(OUT, 'COOK2_MAP_CURB_%s_LAID_%d.png' % (fam.upper(), TW)), optimize=True)

# ---- measured: no line where two pieces meet -------------------------------------------------------------------------
def seam_step(TW, fam):
    """two straight pieces side by side (east-west, then north-south): every pixel of the pair is owned by exactly one
    piece (painted twice = 0), and the laid grid of streets has no pinhole (a clear pixel with all four neighbours
    painted), the two ways a line could show where pieces meet; the textures are periodic on the block by construction"""
    P = TW // 2; hs = LEVELS[TW]['face']
    res = {}
    for name, m, dx, dy in (('east_west', 3, 1, 0), ('north_south', 12, 0, 1)):
        a = ATL[fam, TW][:P + hs, m * TW:(m + 1) * TW]
        W_, H_ = 2 * TW, P + P // 2 + hs + P
        can = np.zeros((H_, W_, 4), np.uint8); cnt = np.zeros((H_, W_), int)
        for k in range(2):
            sx = TW // 2 + (k * dx - k * dy) * TW // 2; sy = (k * dx + k * dy) * P // 2
            sx = min(sx, W_ - TW)
            reg = can[sy:sy + a.shape[0], sx:sx + TW]; al = a[..., 3] > 0
            can[sy:sy + a.shape[0], sx:sx + TW] = np.where(al[..., None], a, reg); cnt[sy:sy + a.shape[0], sx:sx + TW] += al
        res[name] = {'pixels_painted_twice': int((cnt > 1).sum())}
    return res
def pinholes(TW, fam):
    a = np.asarray(Image.open(os.path.join(OUT, 'COOK2_MAP_CURB_%s_LAID_%d.png' % (fam.upper(), TW))))[..., 3] > 0
    c = ~a[1:-1, 1:-1] & a[:-2, 1:-1] & a[2:, 1:-1] & a[1:-1, :-2] & a[1:-1, 2:]
    return int(c.sum())
meas = {fam: {str(TW): {'seams': seam_step(TW, fam), 'pinholes_in_the_laid_grid': pinholes(TW, fam),
                        'colours': int(len(np.unique(ATL[fam, TW][ATL[fam, TW][..., 3] > 0][:, :3], axis=0))),
                        'not_his': 0} for TW in LEVELS} for fam in FAMILIES}
meas.update({
        'face_rows_lum': [round(float(_l(FACE[i]).mean()), 1) for i in range(len(FACE_ROWS))]})
# every colour on the kit is one of his pixels or his pixel blended with his own lip or shadow: count the ones that are
# none of those (0 by construction; measured so it stays so)
his = {tuple(p) for p in np.concatenate([ROAD, WALK, FACE.reshape(-1, 3), PAINT.astype(np.uint8)])}
for fam in FAMILIES:
    for TW in LEVELS:
        hk = TW // 2 + LEVELS[TW]['face']
        k = np.concatenate([piece(m, TW, 0, fam)[1].reshape(-1) for m in range(16)])
        flat = np.concatenate([ATL[fam, TW][:hk, m * TW:(m + 1) * TW].reshape(-1, 4) for m in range(16)])
        plain = (k == 0) | (k == 1) | (k == 5)
        meas[fam][str(TW)]['not_his'] = int(sum(1 for p in flat[plain][:, :3] if tuple(p) not in his))
kit['measured'] = meas
json.dump(kit, open(os.path.join(OUT, 'COOK2_MAP_CURB_KIT.json'), 'w'), indent=1)
print(json.dumps(meas))
print({(f, TW): [c for c in kit['families'][f]['levels'][str(TW)]['counts'] if c['mask'] in (3, 12, 15)] for f in FAMILIES for TW in LEVELS})
