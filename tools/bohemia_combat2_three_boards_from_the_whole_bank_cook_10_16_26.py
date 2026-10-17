#!/usr/bin/env python3
"""THREE FIGHT BOARDS FROM THE WHOLE BANK, WITH COOK FOUR'S STRAIGHT ROOFS  (COMBAT TWO, the big swing of 10/16, rule 110)

Paolo 10/16: '24 hours, take big swings, start impressing me, everything's been looking like shit, the fighting...'
The MODE line: one small, one middle and one large board cut from the whole bank (294 packs), houses from COOK FOUR's
straight-roof family, on one sheet in VOTE. Row [the houses on the board]: a combat tile is a house and the board is a
piece of the city; the houses stand on the streets with no seam.

NOTHING HERE IS DRAWN (rule 108). This tool only LAYS pieces other hands made from his packs:
  * the ground cells are COOK TWO's cut-and-curbed recipe (tools/bohemia_cook2_stretch_the_pack_47_10_13_26.py: his
    sidewalk and street tiles, frame cut, the 47 blob cases, his slab's own south face as the curb), 82 x 81 px a cell;
  * the yards are his soil tiles as bought (UP), one per lot, centre-cut past their 5-px rim, never scaled; the whole
    bank's never-judged pebbles were measured and left out (patches, not tiles; see YARD_FAMS);
  * the houses are COOK FOUR's straight-roof ranch at 1:1 (reference/art_bank/settlement/COOK4_THE_ROOF_MEASURED.png,
    the pack's roof ratios, 57 px a metre, the man fits its door), flipped left-right for variety, never redrawn;
  * the cars, fences, walls, lamps, barrels, junk, dead trees and rocks are his pack tiles placed whole.

THE RULER: the body, 57 px a metre (COOK FOUR's measure of the 112-px man: 100 px tall = 1.75 m). A cell (82 px) is 1.44
metres, one pace. A HOUSE TILE is 8 x 8 cells = 656 x 648 px = 11.5 m: exactly the ranch's front (COOK FOUR: 11.5 m), a
Vegas local street's roadway (37 ft = 11.3 m, the city code on Grok's page) and, as one cell, a Vegas sidewalk (4.7 ft).
So the street is one tile wide, the sidewalk one cell, the house two tiles, without a number of ours anywhere.

THE FINDING OF THE ROUND, measured before anything was laid (records/BOHEMIA_COMBAT2_THREE_BOARDS_FROM_THE_WHOLE_BANK_
10_16_26.md): HIS PACK DRAWS EVERY PROP INSIDE ONE 96-PX BOX, NOT AT WORLD SCALE. A car, a cone, a lamp post and a bin all
come 96 px. At the body's ruler a 96-px car is 1.7 m long (a real one 4.5), a 96-px cone 1.7 m tall (a real one 0.7).
The ground tiles and the house pieces do not care (texture and tiled parts); the props do. The rule here, written per
kind in the manifest: a prop is placed at the INTEGER scale nearest its real size, never under 1x (rule 105, the floor),
nearest-neighbour only (whole pixels): cars x2, dead trees x2, lamps x2, chain link x2; walls, junk, rocks, barrels,
signs, the dumpster x1. Cones, hydrants and bins are NOT placed: at 1x they are giants and they cannot go under the floor.
A 2x prop has 2-px pixels on a 1-px ground; DIRECTION's card judges whether that reads.

THE CAMERA IS THE PACK'S: square ground cells seen from above, objects and faces seen three-quarter (every pack tile and
COOK FOUR's house are made that way); the fight's old cos45 squeeze of the ground was ours, and the pack never had it.
A house's front faces SOUTH (toward the eye), so a house stands on the NORTH side of the street it faces; the south side
of every street is the BACK yards of the next row (fenced, walled, junked), because the pack and COOK FOUR hold no back
of a house. That is also how a Vegas arterial reads: block walls and chain link along the sidewalk.

BOARDS (rule 79): small 9 x 7 house tiles (5,904 x 4,536 px), middle 14 x 10 (9,184 x 6,480), large 20 x 15 (13,120 x
9,720). Every one has its plan, its terrain per tile (flat / rough / blocked; the BB translation, rule 59), its cover
list in metres (car: cover; fence and wall: cover; barrel, rocks, jersey: low cover; tree: obstacle), its lights
(lamps on the grid, fire barrels on their own) and the whole list of pack keys it used, UP or never judged, in
reference/art_bank/fight_board/COMBAT2_THREE_BOARDS_10_16.json. Rule 100: reference/, records/target and the VOTE
registry only; nothing to slices/, engine/ or the demo. The boards are CANDIDATES.

THE ANALOG HORROR LINE (rule 20, DIRECTION's 'one calm wrong thing per board from the world's state'):
  small:  among thirty-year wrecks, one police car sits straight in a driveway, clean, as if parked last night.
  middle: a perfect ring of road barrels on the asphalt around nothing, where a fire was put out by somebody careful.
  large:  one block's front yards all have the same dead tree, evenly spaced, planted the week the dollar died.

REFERENCE CHECK (the 9/4 standing law; rule 82a: the twin IS his pack):
  compared to: his street, sidewalk, soil and pebble tiles as bought at 1:1 (on the sheet, left of the board cut);
  his pack house 5. Roof tiles #30 and the 112-px man; COOK TWO's crossing (records/target/COOK2_STRETCH_THE_PACK_
  CROSSING.png) and 47 sheet; COOK FOUR's ranch sheet (records/target/COOK4_THE_ROOF_MEASURED.png); a Las Vegas
  single-storey block from the city code's numbers (37 ft roadway, 4 to 5 ft sidewalk, 60 x 100 ft lots).
  structure taken: the pack's square ground and three-quarter objects; COOK TWO's blob rule and curb; COOK FOUR's ruler.
  what changed: nothing is drawn here; the only decisions are where his pieces stand.
  AH-01 THE BIBLE: one register, his palette, no outline on the ground; AH-03: one wrong thing per board, calm.
  REUSE CHECK: every ground pixel comes through COOK TWO's module; every house pixel is COOK FOUR's file; every prop is
  bank(name, idx) from banks/BOHEMIA_HD_TILE_REPO_part1-4.txt; this file adds no new picture of its own.

[bb the battle map] Battle Brothers builds its battlefield from the tile the fight starts on, hand-placed props on
dense painted ground, nothing a flat fill; a village fight has houses you walk between and fences that stop you.
OURS: the same, from his purchased tiles, a house a tile, the yard a fight lane, the wall cover.

    python3 tools/bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26.py          (about 3 minutes)
  Seeded end to end: the same three boards every run. The small board (10 MB) is committed whole; the middle and the
  large (23 and 49 MB) are not in git and come back bit for bit from this line (reference/art_bank/fight_board/.gitignore).
"""
import base64, io, json, os, sys, time
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_cook2_stretch_the_pack as S                      # COOK TWO's recipes: pack (UP), cut_frame, pad, decal
import bohemia_cook2_stretch_the_pack_47_10_13_26 as B          # COOK TWO's 47: cell, blob, CASES, NB, FACE, the curb

TW, TH = B.TW, B.TH                 # 82 x 81, COOK TWO's cell
CELLS = 8                           # a house tile is 8 x 8 cells
TPX, TPY = TW * CELLS, TH * CELLS   # 656 x 648 px a house tile
PPM = 100 / 1.75                    # the body's ruler, px per metre (COOK FOUR)
OUT = 'reference/art_bank/fight_board'
HOUSE = 'reference/art_bank/settlement/COOK4_THE_ROOF_MEASURED.png'
HOUSE_FOOT = 500                    # the wall foot row of that picture (measured: last row with 77% opaque cover)
HOUSE_DOOR_X, HOUSE_GARAGE_X = 655, 1135   # the door's and the garage door's middle, unflipped (measured on the sheet)
MAN = 'slices/settlement_people/cast_shortcoat.webp'
BEFORE = 'slices/fight_ground/block_subs_0.webp'   # the placeholder suburb block in the game today (rule 101a)
SIZES = {'small': (7, 9), 'middle': (10, 14), 'large': (15, 20)}            # tiles down, tiles across
NS = {'small': [4], 'middle': [4, 9], 'large': [4, 11, 16]}                  # north-south street columns
ROAD, ZEBRA, LINE, WALK, DRIVE, YARD, BACK, VAC = range(8)
WALKISH = (WALK, DRIVE)

USED = {}
def bank(name, idx):
    """his tile as bought, from the whole bank (294 packs), UP or never judged; every use is counted into the manifest"""
    USED[(name, idx)] = USED.get((name, idx), 0) + 1
    return Image.open(io.BytesIO(base64.b64decode(S._P[name][idx]['b64']))).convert('RGBA')

def up(name, idx): return (name, idx) in S.UP

def nearest(im, k):
    return im if k == 1 else im.resize((im.width * k, im.height * k), Image.NEAREST)

# ---------------------------------------------------------------- the ground: COOK TWO's cells, with a centre texture
def render(case, centre, ctex=None):
    """COOK TWO's B.render with one change: the centre cell's texture may be given (his zebra or his painted line);
    everything else is their recipe verbatim: the 3x3 mosaic, the blur-and-threshold blob, his slab's south face as the
    curb on the road cell under a walk, the shadow, the lit lip."""
    g = np.zeros((3, 3), bool); g[1, 1] = centre
    for (dy, dx), v in zip(B.NB, case): g[1 + dy, 1 + dx] = bool(v)
    m = np.kron(g, np.ones((TH, TW), bool)).astype(np.uint8) * 255
    m = np.asarray(Image.fromarray(m).filter(ImageFilter.GaussianBlur(B.BLUR))) > 127
    walk = np.vstack([np.hstack([B.cell(S.SIDEWALK, B.WALKS) for _ in range(3)]) for _ in range(3)])
    road = np.vstack([np.hstack([B.cell(S.ROAD, B.ROADS) for _ in range(3)]) for _ in range(3)])
    if ctex is not None and not centre: road[TH:2 * TH, TW:2 * TW] = ctex
    img = np.where(m[..., None], walk, road).astype(float)
    H, W = m.shape; FH = B.FH; upd = np.full((H, W), 99)
    for k in range(1, FH + 4):
        hit = np.zeros_like(m); hit[k:] = m[:-k]; upd = np.where((upd == 99) & hit & ~m, k, upd)
    face = (~m) & (upd <= FH)
    u = np.tile(np.arange(W), (H, 1)) % B.FACE.shape[1]
    img[face] = B.FACE[(upd[face] - 1).clip(0, FH - 1), u[face]]
    shd = (~m) & (upd > FH) & (upd <= FH + 3); img[shd] *= 0.55
    inner = m & ~(np.asarray(Image.fromarray((~m).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) == 0)
    img[inner] = img[inner] * 0.35 + np.array([214, 200, 176]) * 0.65
    return img[TH:2 * TH, TW:2 * TW].clip(0, 255).astype(np.uint8)

class Ground:
    """every ground cell the boards need, rendered once per (case, kind, variant) and reused"""
    VAR = 3
    def __init__(self, seed):
        B.rng = np.random.RandomState(seed); self.rng = np.random.RandomState(seed + 1)
        self.cache = {}
        self.zebra = {i: S.pad(S.cut_frame(S.pack(S.ROAD, i), S.ROAD), TW, TH)[..., :3] for i in (15, 16, 17)}
        self.line = {i: S.pad(S.cut_frame(S.pack(S.ROAD, i), S.ROAD), TW, TH)[..., :3] for i in (18, 19, 20, 21, 22)}
        for i in (15, 16, 17, 18, 19, 20, 21, 22): USED[(S.ROAD, i)] = USED.get((S.ROAD, i), 0) + 1
        for i in B.WALKS: USED[(S.SIDEWALK, i)] = USED.get((S.SIDEWALK, i), 0) + 1     # COOK TWO's cells, their keys
        for i in B.ROADS: USED[(S.ROAD, i)] = USED.get((S.ROAD, i), 0) + 1
        self.yards = {}
    def cell(self, case, kind, key=0):
        k = (case, kind, key, self.rng.randint(self.VAR))
        if k not in self.cache:
            if kind in (WALK, DRIVE): self.cache[k] = render(case, True)
            elif kind == ROAD: self.cache[k] = render(case, False)
            elif kind == ZEBRA: self.cache[k] = render(case, False, self.zebra[key])
            else: self.cache[k] = render(case, False, self.line[key])
        return self.cache[k]
    def yard(self, fam, flip):
        """his ground tile as bought, centre-cut to the cell (nothing scaled), flipped left-right or not"""
        name, ids = fam
        i = ids[self.rng.randint(len(ids))]
        k = (name, i)
        if k not in self.yards:
            a = np.asarray(bank(name, i))[..., :3]
            y0, x0 = max(0, (a.shape[0] - TH) // 2), max(0, (a.shape[1] - TW) // 2)
            self.yards[k] = S.pad(a[y0:y0 + TH, x0:x0 + TW], TW, TH)
        a = self.yards[k]
        return a[:, ::-1] if flip else a

# the yard families: Vegas dirt and decomposed granite, ONE of his soil tiles per lot (UP), rims cut, flipped at random.
# MEASURED AND LEFT OUT: the desert pebbles of '1. Ground Tiles' (never judged) are 96 x 70 PATCHES with a 7-px dark rim
# and a lit top row, not floor tiles; laid as cells they striped every yard (the first run's sheet). The whole bank was
# read; the hole it leaves (a gravel yard tile) is named in the record.
YARD_FAMS = [('2. Soil and dirt tiles', [3]), ('2. Soil and dirt tiles', [2]), ('2. Soil and dirt tiles', [0]),
             ('2. Soil and dirt tiles', [1]), ('2. Soil and dirt tiles', [18]), ('2. Soil and dirt tiles', [21]),
             ('2. Soil and dirt tiles', [22])]
YARD_W = [4, 3, 2, 2, 1, 1, 1]

# ---------------------------------------------------------------- the props: his tiles whole, each at its integer scale
CARS = ('9. Abandoned cards', list(range(35)))
TREES = ('16. Dead trees and plants', list(range(12)))
TUFTS = ('16. Dead trees and plants', [19, 20, 21, 22, 23, 24, 39])
BUSH = ('16. Dead trees and plants', [12, 13, 38])
ROCKS = ('Rocks and stones', [48, 49, 50, 60, 61, 62, 63, 64])
LAMPS = ('18. Light sources and fire barrels', [0, 1, 2, 3, 4, 6])
BARRELS = ('18. Light sources and fire barrels', [24, 25, 26, 27, 29, 30, 31, 32, 34, 35])
JUNK = ('7. Trash and debris', list(range(1, 20)))
DUMPSTER = ('14. Trash and junk props', [3])
TYRES = ('14. Trash and junk props', [8])
PALLET = ('15. Street props', [40])
MAILBOX = ('15. Street props', [7])
STOP = ('15. Street props', [0])
SIGNS = ('17. Warning Signs and road props', [1, 4, 5, 6, 7, 10])
JERSEY = ('3. Barricades and blockades', [4, 7, 8, 20, 22])
STRIPED = ('3. Barricades and blockades', [9, 12, 13, 15])
ROADBARREL = ('17. Warning Signs and road props', [23])
CHAIN = ('6. Chain link fences', [0, 1, 2, 3, 4, 5])
WALLS = ('2. Broken building walls', [0, 1])
SCRAP = ('4. Scrap wall and panels', [0, 1, 3, 6, 9, 11, 13])
SCORCH = ('8. Burned Ground and fire marks', [1, 2, 4, 5, 8, 9, 11, 12, 14])
CRACKS = ('1. Cracked street tiles', [29, 30, 31, 32, 33])

# scale (integer, nearest neighbour, never under 1), the fight fact, the real-size note that chose the scale
KIND = {
    'car':     dict(k=2, cover='cover',     real='a car is 4.5 m; the pack car is 96 px = 1.7 m; x2 = 3.4 m'),
    'tree':    dict(k=2, cover='obstacle',  real='a dead ash is 5 to 8 m; x2 = 3.4 m'),
    'tuft':    dict(k=1, cover=None,        real='dry grass, 1 m: right at 1x'),
    'bush':    dict(k=1, cover='low',       real='a creosote bush, 1 to 2 m: right at 1x'),
    'rocks':   dict(k=1, cover='low',       real='landscaping rock, under 1 m: 1x reads a little big, no integer under 1'),
    'lamp':    dict(k=2, cover=None,        real='a street light is 8 m; the pack lamp is a garden post; x2 = 3.4 m, the hole is named'),
    'barrel':  dict(k=1, cover='low',       real='a drum is 0.9 m; 1x is 1.6 m, no integer under 1'),
    'junk':    dict(k=1, cover='low',       real='a junk pile, 1 to 2 m: right at 1x'),
    'dumpster':dict(k=1, cover='cover',     real='a dumpster is 1.8 m: right at 1x'),
    'tyres':   dict(k=1, cover='low',       real='a tyre stack: right at 1x'),
    'pallet':  dict(k=1, cover=None,        real='a pallet is 1.2 m: right at 1x'),
    'mailbox': dict(k=1, cover=None,        real='a mail box is 1.3 m: 1x'),
    'sign':    dict(k=1, cover=None,        real='a sign post is 2 to 2.7 m: 1x is 1.7 m'),
    'jersey':  dict(k=1, cover='low',       real='a jersey barrier is 0.8 m tall, 3 m long: 1x is 1.3 by 1.7 m'),
    'striped': dict(k=1, cover='low',       real='a road barricade: 1x'),
    'roadbarrel':dict(k=1, cover='low',     real='a drum barricade: 1x'),
    'chain':   dict(k=2, cover='fence',     real='chain link is 1.2 to 1.8 m tall; x2 = 1.5 to 1.8 m, 3.4 m a run'),
    'wall':    dict(k=1, cover='cover',     real='a block wall is 1.8 m; the pack piece is 1.3 m: 1x'),
    'scrap':   dict(k=1, cover='cover',     real='a scrap panel fence, 1.7 m: 1x'),
}

# ---------------------------------------------------------------- the plan
def plan(size, seed):
    """the cell classes of a suburb board, from a street grammar: an east-west street every four tile rows, a
    north-south street at the named columns, lots two tiles wide (house row behind front-yard row), the south side of
    every street the back yards of the next row; some lots vacant."""
    rng = np.random.RandomState(seed)
    T, C = SIZES[size]; H, W = T * CELLS, C * CELLS
    ns = NS[size]
    ew = [r for r in range(T) if r % 4 == 3]
    cls = np.full((H, W), YARD, np.uint8)
    role = np.full((T, C), 'yard', object)
    lots = []                                  # (r_house, c0, flip, vacant, fam)
    for r in range(T):
        for c in range(C):
            if r in ew or c in ns: role[r, c] = 'street'
            elif r % 4 == 0: role[r, c] = 'back'
            elif r % 4 == 1: role[r, c] = 'house'
            else: role[r, c] = 'front'
    # lots: along each house row, inside each block between north-south streets
    cuts = [-1] + ns + [C]
    for r in range(T):
        if r % 4 != 1: continue
        for a, b in zip(cuts[:-1], cuts[1:]):
            c = a + 1
            while c + 1 < b:
                vacant = rng.rand() < 0.12
                fam = YARD_FAMS[rng.choice(len(YARD_FAMS), p=np.array(YARD_W) / sum(YARD_W))]
                lots.append(dict(r=r, c=c, flip=bool(rng.rand() < 0.5), vacant=vacant, fam=fam)); c += 2
            if c < b:                          # a one-tile leftover column is a vacant lot
                lots.append(dict(r=r, c=c, flip=False, vacant=True, fam=YARD_FAMS[2], narrow=True))
    fam_of = {}
    for L in lots:
        w = 1 if L.get('narrow') else 2
        for dr in (-1, 0, 1):
            for dc in range(w):
                rr, cc = L['r'] + dr, L['c'] + dc
                if 0 <= rr < T and 0 <= cc < C and role[rr, cc] != 'street': fam_of[(rr, cc)] = L['fam']
                if L['vacant'] and 0 <= rr < T and dr >= 0 and role[rr, cc] != 'street': role[rr, cc] = 'vac'
    # cells
    for r in range(T):
        for c in range(C):
            sl = (slice(r * CELLS, (r + 1) * CELLS), slice(c * CELLS, (c + 1) * CELLS))
            if role[r, c] == 'street': cls[sl] = ROAD
            elif role[r, c] in ('back', 'house'): cls[sl] = BACK
            elif role[r, c] == 'vac': cls[sl] = VAC
            else: cls[sl] = YARD
    # the painted double line on the east-west streets of the middle and large boards (his orange tiles)
    if size != 'small':
        for r in ew:
            cls[r * CELLS + 3, :] = np.where(cls[r * CELLS + 3, :] == ROAD, LINE, cls[r * CELLS + 3, :])
            for c in ns: cls[r * CELLS + 3, c * CELLS - 1:(c + 1) * CELLS + 1] = ROAD    # no line through a junction
    # sidewalks: a lot cell with a road among its eight neighbours
    road = cls == ROAD
    near = np.asarray(Image.fromarray(road.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0
    cls[(cls >= YARD) & near] = WALK
    # the zebra across the north-south roads, in line with the east-west sidewalks (COOK TWO: the bars run north-south)
    for r in ew:
        for c in ns:
            y0 = r * CELLS; x0 = c * CELLS
            if r > 0: cls[y0 - 2:y0, x0:x0 + CELLS] = ZEBRA
            if r < T - 1: cls[y0 + CELLS:y0 + CELLS + 2, x0:x0 + CELLS] = ZEBRA
    # driveways and door paths on every house lot
    for L in lots:
        if L['vacant']: continue
        fy = (L['r'] + 1) * CELLS                     # the front-yard tile's first cell row
        if fy >= H: continue
        ox = L['c'] * CELLS * TW + (2 * TPX - 1300) // 2
        gx = ox + (1300 - HOUSE_GARAGE_X if L['flip'] else HOUSE_GARAGE_X)
        dx = ox + (1300 - HOUSE_DOOR_X if L['flip'] else HOUSE_DOOR_X)
        c0, c1 = int((gx - 164) // TW), int((gx + 164) // TW)
        for cc in range(max(L['c'] * CELLS, c0), min((L['c'] + 2) * CELLS, c1 + 1)):
            for rr in range(fy, min(H, fy + CELLS)):
                if cls[rr, cc] == YARD: cls[rr, cc] = DRIVE
        cc = int(dx // TW)
        for rr in range(fy, min(H, fy + CELLS)):
            if cls[rr, cc] == YARD: cls[rr, cc] = DRIVE
    return dict(T=T, C=C, H=H, W=W, cls=cls, role=role, lots=lots, fam_of=fam_of, ew=ew, ns=ns, rng=rng)

# ---------------------------------------------------------------- the ground raster
def lay_ground(P, G, seed):
    H, W, cls = P['H'], P['W'], P['cls']
    img = np.zeros((H * TH, W * TW, 3), np.uint8)
    walkish = np.isin(cls, WALKISH)
    pad = np.pad(walkish, 1)
    rng = np.random.RandomState(seed + 7)
    zebra_idx = {}
    for y in range(H):
        for x in range(W):
            k = cls[y, x]
            sl = (slice(y * TH, (y + 1) * TH), slice(x * TW, (x + 1) * TW))
            if k >= YARD:
                fam = P['fam_of'].get((y // CELLS, x // CELLS), YARD_FAMS[2])
                img[sl] = G.yard(fam, bool(rng.rand() < 0.5)); continue
            bits = tuple(int(pad[1 + y + dy, 1 + x + dx]) for dy, dx in B.NB)
            case = B.blob(bits)
            if k in WALKISH: img[sl] = G.cell(case, WALK)
            elif k == ROAD: img[sl] = G.cell(case, ROAD)
            elif k == ZEBRA:
                col = x // CELLS
                if col not in zebra_idx: zebra_idx[col] = (15, 16, 17)[rng.randint(3)]
                img[sl] = G.cell(case, ZEBRA, zebra_idx[col])
            else: img[sl] = G.cell(case, LINE, (18, 19, 20, 21, 22)[rng.randint(5)])
    return img

def decal_at(img, src, y, x, strength=0.8, thresh_pct=12):
    """COOK TWO's darken-only decal, applied to a window of the board (never the whole raster)"""
    h, w = src.shape[:2]
    y0, x0 = max(0, y), max(0, x); y1, x1 = min(img.shape[0], y + h), min(img.shape[1], x + w)
    if y1 <= y0 or x1 <= x0: return
    win = np.dstack([img[y0:y1, x0:x1], np.full((y1 - y0, x1 - x0), 255, np.uint8)])
    s = src[y0 - y:y0 - y + (y1 - y0), x0 - x:x0 - x + (x1 - x0)].copy()
    if s.shape[2] == 4: s[s[..., 3] < 128, :3] = 255
    t = np.percentile(s[..., :3][s[..., 3] >= 128].astype(int).sum(1), thresh_pct) if s.shape[2] == 4 and (s[..., 3] >= 128).any() else 0
    out = S.decal(win, s, (0, 0), strength, thresh=t)
    img[y0:y1, x0:x1] = out[..., :3]

# ---------------------------------------------------------------- the props and the houses
class Props:
    def __init__(self, P, seed):
        self.P = P; self.rng = np.random.RandomState(seed + 99); self.items = []; self.cover = []; self.lights = []
        self.house = Image.open(HOUSE).convert('RGBA'); self.house_f = self.house.transpose(Image.FLIP_LEFT_RIGHT)
        self.cache = {}
    def tile(self, fam, k, idx=None):
        name, ids = fam
        i = ids[self.rng.randint(len(ids))] if idx is None else idx
        key = (name, i, k)
        if key not in self.cache: self.cache[key] = nearest(bank(name, i), k)
        else: USED[(name, i)] = USED.get((name, i), 0) + 1
        return self.cache[key], (name, i)
    def put(self, kind, fam, cx, foot, idx=None, flip=False, cover=True):
        """a prop standing with its foot (bottom row) at `foot`, its middle at `cx`, in board px"""
        kd = KIND[kind]; im, key = self.tile(fam, kd['k'], idx)
        if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        x = int(cx - im.width / 2); y = int(foot - im.height)
        self.items.append((foot, x, y, im, kind))
        if cover and kd['cover']:
            self.cover.append(dict(kind=kind, fact=kd['cover'], x_m=round(cx / PPM, 2), y_m=round(foot / PPM, 2),
                                   w_m=round(im.width / PPM, 2), h_m=round(im.height / PPM, 2), tile=key, scale=kd['k']))
        return im
    def house_at(self, L):
        """COOK FOUR's ranch on its two-tile lot: the wall foot ten px inside the bottom of the house tile row"""
        im = self.house_f if L['flip'] else self.house
        ox = L['c'] * TPX + (2 * TPX - im.width) // 2
        foot = (L['r'] + 1) * TPY - 10
        self.items.append((foot, ox, foot - HOUSE_FOOT, im, 'house'))

def dress(P, G, img, PR, size, seed):
    """where his pieces stand: the houses, the fences and walls on the back yards, the yards' dead trees and rocks,
    the wrecks in the drives and on the road, the lamps and signs on the walk, the junk, and the one calm wrong thing"""
    rng = PR.rng; T, C, cls = P['T'], P['C'], P['cls']
    H, W = img.shape[:2]
    def cellpx(y, x): return (x + 0.5) * TW, (y + 1) * TH          # a cell's middle x and its foot y
    # houses
    for L in P['lots']:
        if not L['vacant']: PR.house_at(L)
    # back yards: a wall or chain link along the walk on the street side (the north edge of a back row that touches a
    # street to its north; the top row's wall faces the off-board street), scrap where the lot is poorer
    for r in range(T):
        if r % 4 != 0: continue
        y = r * CELLS + 1
        if y >= P['H']: continue
        run = None
        for x in range(P['W']):
            if cls[y, x] not in (BACK, VAC) or cls[y - 1, x] not in (WALK,) and r > 0:
                run = None; continue
            fam_pick = rng.rand()
            if run is None: run = 'chain' if fam_pick < 0.5 else ('wall' if fam_pick < 0.85 else 'scrap')
            cx, foot = cellpx(y, x)
            if run == 'chain':
                if x % 2 == 0: PR.put('chain', CHAIN, cx + TW / 2, foot - 6)
            elif run == 'wall':
                if rng.rand() < 0.9: PR.put('wall', WALLS, cx, foot - 4)
            else:
                PR.put('scrap', SCRAP, cx, foot - 4)
    # lots
    for L in P['lots']:
        r, c = L['r'], L['c']; w = 1 if L.get('narrow') else 2
        x0, x1 = c * CELLS, (c + w) * CELLS
        fy0 = (r + 1) * CELLS; by0 = (r - 1) * CELLS
        fam = L['fam']
        if L['vacant']:
            # a vacant lot: rocks, junk, tufts, maybe a wreck or a tyre stack, a 'keep out' sign on a post
            for rr in range(max(0, by0), min(P['H'], fy0 + CELLS)):
                for xx in range(x0, x1):
                    if cls[rr, xx] != VAC: continue
                    u = rng.rand(); cx, foot = cellpx(rr, xx)
                    if u < 0.06: PR.put('rocks', ROCKS, cx, foot)
                    elif u < 0.10: PR.put('junk', JUNK, cx, foot)
                    elif u < 0.16: PR.put('tuft', TUFTS, cx, foot)
                    elif u < 0.175: PR.put('car', CARS, cx, foot, flip=bool(rng.rand() < 0.5))
                    elif u < 0.185: PR.put('tyres', TYRES, cx, foot)
                    elif u < 0.19: PR.put('sign', SIGNS, cx, foot, idx=1)
            continue
        # front yard
        if fy0 < P['H']:
            for rr in range(fy0, min(P['H'], fy0 + CELLS - 1)):
                for xx in range(x0, x1):
                    if cls[rr, xx] != YARD: continue
                    u = rng.rand(); cx, foot = cellpx(rr, xx)
                    if u < 0.025: PR.put('tree', TREES, cx, foot)
                    elif u < 0.07: PR.put('tuft', TUFTS, cx, foot)
                    elif u < 0.085: PR.put('rocks', ROCKS, cx, foot)
                    elif u < 0.095: PR.put('bush', BUSH, cx, foot)
            # the wreck in the drive (most lots), the mail box by the walk, a junk pile at the side
            drive = [(rr, xx) for rr in range(fy0, min(P['H'], fy0 + CELLS - 1)) for xx in range(x0, x1) if cls[rr, xx] == DRIVE]
            if drive and rng.rand() < 0.65:
                rr, xx = drive[len(drive) // 2]
                cx, foot = cellpx(rr, xx)
                PR.put('car', CARS, cx + TW / 2, foot + TH / 2, flip=L['flip'])
            if rng.rand() < 0.35:
                xx = x1 - 2 if L['flip'] else x0 + 1
                cx, foot = cellpx(min(P['H'] - 1, fy0 + CELLS - 2), xx); PR.put('mailbox', MAILBOX, cx, foot)
            if rng.rand() < 0.3:
                cx, foot = cellpx(fy0 + 1, x0 if L['flip'] else x1 - 1); PR.put('junk', JUNK, cx, foot)
        # back yard: junk, a dead tree, a pallet, a dumpster now and then, tufts
        if by0 >= 0:
            for rr in range(by0 + 2, min(P['H'], by0 + CELLS)):
                for xx in range(x0, x1):
                    if cls[rr, xx] != BACK: continue
                    u = rng.rand(); cx, foot = cellpx(rr, xx)
                    if u < 0.03: PR.put('junk', JUNK, cx, foot)
                    elif u < 0.045: PR.put('tree', TREES, cx, foot)
                    elif u < 0.055: PR.put('pallet', PALLET, cx, foot)
                    elif u < 0.06: PR.put('dumpster', DUMPSTER, cx, foot)
                    elif u < 0.10: PR.put('tuft', TUFTS, cx, foot)
                    elif u < 0.115: PR.put('rocks', ROCKS, cx, foot)
    # the street: lamps on the walk every third tile, a stop sign at each junction corner, wrecks on the asphalt,
    # a barricade cluster, fire barrels with their scorch
    for r in P['ew']:
        yw_n = r * CELLS - 1; yw_s = (r + 1) * CELLS
        for c in range(C):
            if c in P['ns']: continue
            if (c + r) % 3 == 0 and yw_n >= 0 and cls[yw_n, c * CELLS + 2] == WALK:
                cx, foot = cellpx(yw_n, c * CELLS + 2); PR.put('lamp', LAMPS, cx, foot - 2, cover=False)
                PR.lights.append(dict(kind='lamp', power='grid', x_m=round(cx / PPM, 2), y_m=round(foot / PPM, 2)))
            if (c + r) % 3 == 1 and yw_s < P['H'] and cls[yw_s, c * CELLS + 5] == WALK:
                cx, foot = cellpx(yw_s, c * CELLS + 5); PR.put('lamp', LAMPS, cx, foot - 2, cover=False)
                PR.lights.append(dict(kind='lamp', power='grid', x_m=round(cx / PPM, 2), y_m=round(foot / PPM, 2)))
        for c in P['ns']:
            for (yy, xx) in ((r * CELLS - 1, c * CELLS - 1), (r * CELLS - 1, (c + 1) * CELLS), ((r + 1) * CELLS, c * CELLS - 1), ((r + 1) * CELLS, (c + 1) * CELLS)):
                if 0 <= yy < P['H'] and 0 <= xx < P['W'] and cls[yy, xx] == WALK and rng.rand() < 0.6:
                    cx, foot = cellpx(yy, xx); PR.put('sign', STOP, cx, foot)
    roadcells = [(y, x) for y in range(P['H']) for x in range(P['W']) if cls[y, x] in (ROAD, LINE)]
    n_wreck = {'small': 4, 'middle': 9, 'large': 16}[size]
    picks = [roadcells[i] for i in rng.choice(len(roadcells), n_wreck * 3, replace=False)]
    placed = []
    for (y, x) in picks:
        if len(placed) >= n_wreck: break
        if any(abs(y - py) < 6 and abs(x - px) < 6 for py, px in placed): continue
        placed.append((y, x)); cx, foot = cellpx(y, x)
        PR.put('car', CARS, cx, foot, flip=bool(rng.rand() < 0.5))
    # one barricade line across a north-south road, one fire barrel pair with scorch, per board
    c = P['ns'][rng.randint(len(P['ns']))]; r = P['ew'][0]
    yb = (r + 1) * CELLS + 5
    if yb < P['H']:
        for i in range(4):
            cx, foot = cellpx(yb, c * CELLS + 1 + i * 2); PR.put('jersey' if i % 2 == 0 else 'striped', JERSEY if i % 2 == 0 else STRIPED, cx, foot)
    for i in range({'small': 2, 'middle': 3, 'large': 5}[size]):
        y, x = roadcells[rng.randint(len(roadcells))]
        if y < 2: continue
        cx, foot = cellpx(y, x)
        sc = np.asarray(nearest(bank(*[SCORCH[0], SCORCH[1][rng.randint(len(SCORCH[1]))]]), 2))
        decal_at(img, sc, int(foot) - sc.shape[0] + 30, int(cx) - sc.shape[1] // 2, 0.85, 20)
        PR.put('barrel', BARRELS, cx, foot)
        PR.lights.append(dict(kind='fire barrel', power='fire', x_m=round(cx / PPM, 2), y_m=round(foot / PPM, 2)))
    # the cracks: COOK TWO's darken-only decals from his broken road tiles, a few per block of road
    for i in range(len(roadcells) // 40):
        y, x = roadcells[rng.randint(len(roadcells))]
        src = S.cut_frame(S.pack(S.ROAD, CRACKS[1][rng.randint(5)]), S.ROAD)
        decal_at(img, src, y * TH, x * TW, 0.8, 12)
    # THE ANALOG HORROR LINE
    if size == 'small':
        for L in P['lots']:
            if L['vacant'] or (L['r'] + 1) * CELLS >= P['H']: continue
            drive = [(rr, xx) for rr in range((L['r'] + 1) * CELLS, (L['r'] + 2) * CELLS - 1) for xx in range(L['c'] * CELLS, (L['c'] + 2) * CELLS) if cls[rr, xx] == DRIVE]
            if not drive: continue
            rr, xx = drive[len(drive) // 2]; cx, foot = cellpx(rr, xx)
            PR.put('car', CARS, cx + TW / 2, foot + TH / 2, idx=19, flip=L['flip']); break   # the police car, parked straight, clean
    elif size == 'middle':
        r = P['ew'][-1]; c = (P['ns'][0] + P['ns'][1]) // 2
        cy, cx = r * CELLS + 4, c * CELLS + 4
        for a in np.linspace(0, 2 * np.pi, 12, endpoint=False):
            px, py = cellpx(cy, cx); PR.put('roadbarrel', ROADBARREL, px + np.cos(a) * 3.2 * TW, py + np.sin(a) * 2.6 * TH)
    # (large: the same dead tree, evenly spaced, on one block's front yards: placed above where same_tree is set)
    if size == 'large':
        for L in P['lots']:
            if L['vacant'] or L['r'] != 5 or L['c'] >= 4: continue
            fy = (L['r'] + 1) * CELLS
            for xx in (L['c'] * CELLS + 1, L['c'] * CELLS + 5, L['c'] * CELLS + 9, L['c'] * CELLS + 13):
                if cls[fy + 2, xx] == YARD:
                    cx, foot = cellpx(fy + 2, xx); PR.put('tree', TREES, cx, foot, idx=6)

def composite(img, PR):
    """painter's order: the thing whose foot is further south is drawn later, so it stands in front"""
    out = Image.fromarray(img)
    for foot, x, y, im, kind in sorted(PR.items, key=lambda t: t[0]):
        out.paste(im, (x, y), im)
    return out

def terrain(P, PR):
    """per house tile: blocked (a house), rough (a back or vacant yard with its junk), flat (road, walk, yard, drive)"""
    T, C = P['T'], P['C']; role = P['role']
    t = [['flat'] * C for _ in range(T)]
    housed = set()
    for L in P['lots']:
        if L['vacant']: continue
        for dc in range(2): housed.add((L['r'], L['c'] + dc))
    for r in range(T):
        for c in range(C):
            if (r, c) in housed: t[r][c] = 'blocked'
            elif role[r, c] in ('back', 'vac'): t[r][c] = 'rough'
    return t

# ---------------------------------------------------------------- the sheet
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

def density(a, n=40, seed=3):
    """median distinct colours per 96 x 96 window (the study page's measure)"""
    rng = np.random.RandomState(seed); H, W = a.shape[:2]; out = []
    for _ in range(n):
        y, x = rng.randint(0, H - 96), rng.randint(0, W - 96)
        w = a[y:y + 96, x:x + 96].reshape(-1, 3)
        out.append(len(np.unique(w, axis=0)))
    return int(np.median(out))

def main():
    t0 = time.time(); os.makedirs(OUT, exist_ok=True)
    boards, facts = {}, {}
    G = Ground(1016)
    for size in ('small', 'middle', 'large'):
        seed = {'small': 101, 'middle': 202, 'large': 303}[size]
        P = plan(size, seed)
        img = lay_ground(P, G, seed)
        PR = Props(P, seed)
        dress(P, G, img, PR, size, seed)
        board = composite(img, PR)
        boards[size] = board
        a = np.asarray(board)
        facts[size] = dict(tiles_across=P['C'], tiles_down=P['T'], px=[board.width, board.height],
                           cells=[P['W'], P['H']], lots=len(P['lots']), vacant=sum(1 for L in P['lots'] if L['vacant']),
                           props=len(PR.items) - sum(1 for L in P['lots'] if not L['vacant']),
                           houses=sum(1 for L in P['lots'] if not L['vacant']),
                           cover=PR.cover, lights=PR.lights, terrain=terrain(P, PR),
                           ew_streets=P['ew'], ns_streets=P['ns'],
                           colours_per_96px=density(a), elapsed_s=round(time.time() - t0, 1))
        board.save(os.path.join(OUT, 'COMBAT2_BOARD_%s_10_16.webp' % size.upper()), quality=84, method=4)
        print(size, board.size, 'lots', facts[size]['lots'], 'props', facts[size]['props'], 'density', facts[size]['colours_per_96px'], round(time.time() - t0), 's')
    # the manifest: every key used, UP or never judged (the pack gate's shape: pieces[name] = {src, keys})
    keys = sorted(USED.items(), key=lambda kv: (-kv[1], kv[0]))
    never = [[k[0], k[1], n] for k, n in keys if not up(*k)]
    man = dict(lane='combat 2', rule='110 big swing; 82a the whole bank; 87 the file split; 100 candidates only; 105 the floor; 108 nothing drawn',
               ruler='57 px a metre, the body; a cell 82 x 81 px = 1.44 m (COOK TWO); a house tile 8 x 8 cells = 656 x 648 px = 11.5 m',
               camera="the pack's: square ground from above, objects and faces three-quarter; no cos45 squeeze",
               sources=dict(ground='tools/bohemia_cook2_stretch_the_pack_47_10_13_26.py (COOK TWO), his sidewalk and street tiles',
                            house=HOUSE + ' (COOK FOUR), never redrawn, flipped left-right only',
                            yards_and_props='banks/BOHEMIA_HD_TILE_REPO_part1-4.txt, the whole bank, placed whole at an integer scale'),
               prop_scales={k: dict(scale=v['k'], fight=v['cover'], why=v['real']) for k, v in KIND.items()},
               not_placed='cones, hydrants, bins, trash bags: 96 px = 1.7 m at the ruler, giants at 1x, and nothing goes under the floor',
               pieces={('COMBAT2_BOARD_%s_10_16' % s.upper()): dict(src='COMBAT2_BOARD_%s_10_16.webp' % s.upper(),
                        keys=[{'pack': k[0], 'idx': k[1]} for k, n in keys]) for s in boards},
               keys_used=[[k[0], k[1], n, 'UP' if up(*k) else 'never judged'] for k, n in keys],
               never_judged_used=never,
               boards=facts)
    json.dump(man, open(os.path.join(OUT, 'COMBAT2_THREE_BOARDS_10_16.json'), 'w'), indent=1)
    sheet(boards, facts)
    print('keys used', len(keys), 'never judged', len(never), 'total', round(time.time() - t0), 's')

def sheet(boards, facts):
    """ONE SHEET (rules 82, 89): the three boards whole (shrunk, the map of each), a 1:1 phone-width cut of each at a
    house, the SAME THING before and after at 1:1 (the placeholder suburb block in the game today beside the new small
    board), and his tiles as bought beside the board at 1:1 (the twin)."""
    Wd = 2400; F = font(30); f = font(24); pad = 24
    rows = []
    def label(t, big=False): rows.append(('text', t, big))
    label('COMBAT TWO, THE BIG SWING: THREE FIGHT BOARDS CUT FROM YOUR PACKS, SMALL, MIDDLE AND LARGE, WITH COOK FOUR\'S STRAIGHT-ROOF HOUSES. CANDIDATES, NOT IN THE GAME.', True)
    label('Top: the whole boards, shrunk to fit this page (a map of each). Below: cuts of the same boards at 1:1, one art pixel to one phone pixel, the phone\'s width.')
    big = boards['large']; sc = (Wd - 2 * pad) / big.width
    rows.append(('img', big.resize((int(big.width * sc), int(big.height * sc)), Image.LANCZOS), 'LARGE 20 x 15 house tiles (%d x %d px), shrunk to %d%%' % (big.width, big.height, round(sc * 100))))
    sm, md = boards['small'], boards['middle']; sc2 = (Wd - 3 * pad) / (sm.width + md.width)
    pair = Image.new('RGB', (Wd - 2 * pad, int(md.height * sc2)), (14, 14, 14))
    pair.paste(sm.resize((int(sm.width * sc2), int(sm.height * sc2)), Image.LANCZOS), (0, 0))
    pair.paste(md.resize((int(md.width * sc2), int(md.height * sc2)), Image.LANCZOS), (int(sm.width * sc2) + pad, 0))
    rows.append(('img', pair, 'SMALL 9 x 7 (left) and MIDDLE 14 x 10 (right), shrunk to %d%%' % round(sc2 * 100)))
    # 1:1 cuts, the phone's width (1170 px = 390 pt at 3x), at a house and its street
    def cut(b, cx, cy, w=1170, h=1000):
        x0 = int(min(max(0, cx - w / 2), b.width - w)); y0 = int(min(max(0, cy - h / 2), b.height - h))
        return b.crop((x0, y0, x0 + w, y0 + h))
    cuts = [cut(sm, 2 * TPX, 2.2 * TPY), cut(md, 7.5 * TPX, 6.2 * TPY), cut(big, 13.5 * TPX, 6.2 * TPY)]
    before = Image.open(BEFORE).convert('RGB'); bcut = before.crop((700, 300, 1870, 1300))
    def side(a, b):
        im = Image.new('RGB', (a.width + b.width + pad, max(a.height, b.height)), (14, 14, 14)); im.paste(a, (0, 0)); im.paste(b, (a.width + pad, 0)); return im
    rows.append(('img', side(cuts[0], cuts[1]), 'AT 1:1, the phone\'s width: the SMALL board at a house (left), the MIDDLE board at its crossing (right)'))
    rows.append(('img', side(bcut, cuts[2]), 'BEFORE AND AFTER AT 1:1: the suburb block in the game today, our cooked houses on the 2x street (left) | the LARGE board, his tiles and COOK FOUR\'s house (right)'))
    # the twin: his tiles as bought at 1:1 beside the same pieces on the board
    man = Image.open(MAN).convert('RGBA').crop((0, 0, 112, 112))
    twins = [('5. Roof tiles', 30, 'his house #30'), ('1. Cracked street tiles', 0, 'street'), ('1. Cracked contrete tiles', 0, 'sidewalk'),
             ('2. Soil and dirt tiles', 3, 'soil, the yard'), ('1. Ground Tiles', 36, 'pebbles: a patch, left out'), ('9. Abandoned cards', 19, 'car (x2 on the board)'),
             ('18. Light sources and fire barrels', 2, 'lamp (x2)'), ('6. Chain link fences', 0, 'chain link (x2)'), ('2. Broken building walls', 0, 'wall')]
    tw = Image.new('RGB', (Wd - 2 * pad, 300), (14, 14, 14)); d = ImageDraw.Draw(tw); x = 10
    d.text((10, 6), 'THE TWIN: his tiles AS BOUGHT, at 1:1, and the man (the ruler)', font=f, fill=(235, 235, 235))
    for name, i, lab in twins:
        t = bank(name, i); tw.paste(t, (x, 60), t); d.text((x, 165), lab, font=font(18), fill=(200, 190, 170)); x += 130
    tw.paste(man, (x, 50), man); d.text((x, 165), 'the man, 112 box', font=font(18), fill=(200, 190, 170))
    bcut2 = cut(sm, 2.3 * TPX, 1.95 * TPY, 900, 300); tw.paste(bcut2, (Wd - 2 * pad - 910, 0))
    d.text((Wd - 2 * pad - 905, 270), 'the same pieces on the small board, 1:1', font=font(18), fill=(200, 190, 170))
    rows.append(('img', tw, ''))
    label('THE THREE BIGGEST DIFFERENCES FROM THE PACK AS BOUGHT: (1) SIZE: his props all come in one 96-px box, so a car and a cone are the same size; at the man\'s ruler a car is doubled (whole pixels) and the cones stay in the box, off the board. (2) THE CURB: his tiles have none; the sidewalk edge is his slab\'s own south face (COOK TWO). (3) THE HOUSE: his pack house is one tile; ours is his roof, wall, door and window tiles laid at the man\'s size (COOK FOUR).')
    label('Numbers (the proof line, not the show): colours per 96 px window, small %d / middle %d / large %d, the pack\'s ground 4,140, our old cooked blocks 18 to 29.' % (facts['small']['colours_per_96px'], facts['middle']['colours_per_96px'], facts['large']['colours_per_96px']))
    # assemble
    Hs = 0; measured = []
    for kind, a, b in rows:
        if kind == 'text':
            lines = wrap(a, F if b else f, Wd - 2 * pad); measured.append(lines); Hs += len(lines) * (40 if b else 32) + 14
        else: measured.append(None); Hs += a.height + 44
    S_ = Image.new('RGB', (Wd, Hs + pad), (14, 14, 14)); d = ImageDraw.Draw(S_); y = pad // 2
    for (kind, a, b), m in zip(rows, measured):
        if kind == 'text':
            for ln in m: d.text((pad, y), ln, font=F if b else f, fill=(235, 220, 190) if b else (225, 225, 225)); y += 40 if b else 32
            y += 14
        else:
            S_.paste(a, (pad, y)); y += a.height + 4
            d.text((pad, y), b, font=f, fill=(200, 190, 170)); y += 40
    S_.save('records/target/COMBAT2_THREE_BOARDS_FROM_THE_WHOLE_BANK_10_16.webp', quality=86, method=4)
    print('sheet', S_.size)

def wrap(text, fnt, width):
    words = text.split(' '); lines = []; cur = ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if fnt.getlength(t) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

if __name__ == '__main__':
    main()
