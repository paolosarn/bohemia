#!/usr/bin/env python3
"""A BOARD FROM EVERY DISTRICT  (COMBAT TWO, [a board from every district], 10/18; rule 52, rule 117)

His 10/18 YES on the fight board cut from the map. The row: a fight on the Strip and a fight in the suburbs must look
like the places they are; one board cut from each district (the Strip, downtown, the suburbs, the wash, the industrial
edge) with that district's ground, buildings and blockers, side by side in VOTE from the game's camera; a board you
read in one look (rule 117); houses stay house-sized.

THE INPUT: reference/art_bank/fight_board/COMBAT2_DISTRICT_CELLS_10_18.json, read off the demo by
tools/bohemia_combat2_read_the_district_cells_10_18_26.js: one block of each district, chosen by the map's own district
word (the word nfKind hands the fight), with its eight neighbours at the map's fine grid.

THE RULER IS WORLD'S, AND MY LAST ROUND'S WAS WRONG (WORLD [the one ruler], 72a83f32, a note on my row): the map's fine
cell is 0.75 m. The demo's own cells paint a lane four cells and a line (3.4 m), a house 17 x 12 cells (12.8 x 9 m);
LANE_W = 2 is the 7/16 graphics engine's, which the map does not paint. So a house tile (11.5 m) is 15.3 fine cells,
COOK TWO's 1.44 m cell is 1.92 fine cells, and every map roof is laid as ONE piece where it stands, at 1:1, never a roof
stretched. (Round one of [the board at Battle Brothers' size] read 1.8 m; its boards are 2.4 times too stretched and
its sheet stays as it is, a candidate he can kill.)

THE BOARD: the middle board (14 x 10 house tiles, 161 x 115 m, 215 x 154 fine cells), the routine fight's size
(rule 79: a small fight a small board, the large one only for the endgame or three parties). Its window is cut from
the 3 x 3 blocks the reader saved, its middle INSIDE the district's own block; where that block's own middle is one
thing only (the Strip block is all boulevard), the window slides, eight fine cells a step, to where the district's
FEATURE (its roofs; the wash's channel) and room to fight are most even (the score: the smaller of the two shares),
ties to the block's middle. So the Strip board holds the boulevard AND the resort front.

WHAT GOES WHERE (nothing drawn here, rule 108; every pixel his pack's or a cook's file at 1:1):
  roadway, lanes, parking -> COOK TWO's road cells (the lane dashes stay off: one look, the asphalt carries the lane);
  walks, plazas, drives -> COOK TWO's walk cells with their curb; yards and medians -> one of his soil tiles a board;
  the wash's concrete channel -> COOK TWO's concrete walk cell as the bank and the same concrete cell laid where the
  road cell would be as the floor, so his slab's own south face falls where the bank drops to the floor; the desert bed
  -> his sandiest soil; the bed's boulders -> his boulders;
  a roof in a residential block -> ONE of COOK FOUR's five tan ranches, the width nearest the roof's, centred on it,
  its wall foot on the roof's south edge, never the same kind twice running;
  a roof in a commercial block -> COOK FOUR's straight-roof pieces along its south edge, from the district's own list:
  the Strip the casino and the motel; downtown the corner shop (two storeys, shopfronts) and the casino (Fremont);
  the works the warehouse; the gas station where the list runs out;
  a thin wall in the map -> his block wall pieces, the whole run (a cover line);
  the map's lamps -> his lamp, thinned to none within two house tiles of another (rule 73 keeps the light);
  the works' yards -> his shipping containers (10-ft at x2) as the cover; parking -> his cars, few;
  the analog horror line (rule 20): the same clean police car (his '9. Abandoned cards' #19) on all five, parked
  straight where nothing else is. It follows you from district to district.

THE ONE-LOOK RULES AT THE PLACING (round one of [a board you read in one look] cut them after; here they are the
placer's own rules, counted the same way): no words; nothing without a fight fact; no specks (the map's bins, shrubs
and pebbles stay off; one dead tree a house at most, one dumpster a building); a car where a car would be (a parking
bay, a drive, one wreck a stretch of street, none in a crossing); light spaced; one fire barrel a board; cracks only
along the kerb. Counted with that round's own counter (opening frame, specks, the eye's count proved by planted cars).

REFERENCE CHECK (the 9/4 standing law): compared to the map itself (each block's near-stop picture and its fine plan sit
beside its board at the same scale), his pack tiles as bought (the twin row), the 112-px man at 1:1 (the ruler), and
round one-look's suburb board (his newest YES, 'sure, better direction, not final'). structure taken: the map's roads,
walks, roofs, walls, lamps and channel where it has them; what changed: one board per district, at WORLD's ruler.
REUSE CHECK: every pixel is COOK TWO's cells, COOK FOUR's houses, buildings and roof field (laid with their own lay
and shade_top), or his pack tiles as bought; round one's ground and props, round two's ranch numbers, the map cut's
reader and round one-look's counter are imported, not copied; this file adds no pixel of its own.

[bb the battle map] Battle Brothers: the field is generated from the world tile the fight starts on; a town fight stands
in that town's own buildings, a swamp fight in reeds and water, a forest fight among trees: the place is read off the
ground and the blockers, never a label. OURS: five districts, five grounds, five sets of blockers.

CANDIDATES ONLY (rule 100): reference/, records/target and the VOTE registry; nothing to slices/, engine/ or the demo.

    node tools/bohemia_combat2_read_the_district_cells_10_18_26.js                     (the map, once)
    python3 tools/bohemia_combat2_a_board_from_every_district_cook_10_18_26.py          (about 5 minutes)
  Seeded end to end. The boards are not in git (.gitignore there); the manifest, the map file and the sheet are.
"""
import json, os, sys, time
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_cook2_stretch_the_pack as S                                    # COOK TWO's recipes
import bohemia_cook2_stretch_the_pack_47_10_13_26 as B                        # COOK TWO's 47
import bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26 as R1   # ground, props, the bank
import bohemia_combat2_the_five_houses_on_the_board_cook_10_18_26 as R2       # COOK FOUR's five ranches
import bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26 as R3    # reading the map's codes, the shops
import bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26 as R4       # the one-look counter
# R4 records pieces by patching round one's put and decal on import; this tool counts its own, so both go back
R1.Props.put, R1.decal_at = R4._PUT, R4._DECAL

TW, TH, CELLS, TPX, TPY = R1.TW, R1.TH, R1.CELLS, R1.TPX, R1.TPY
ROAD, ZEBRA, LINE, WALK, DRIVE, YARD = R1.ROAD, R1.ZEBRA, R1.LINE, R1.WALK, R1.DRIVE, R1.YARD
BLD, WALLR, PROP, LAMPC, PARK, ISLAND = R3.BLD, R3.WALLR, R3.PROP, R3.LAMPC, R3.PARK, R3.ISLAND
CHANNEL, SAND, ROCK, MEDIAN = 16, 17, 18, 19
OUT = R1.OUT
MAPFILE = os.path.join(OUT, 'COMBAT2_DISTRICT_CELLS_10_18.json')
M_FINE = 0.75                                  # WORLD's one ruler: a map fine cell is 0.75 m
K = M_FINE / 1.44                              # COOK TWO's cells a fine cell (0.52)
T_, C_ = R1.SIZES['middle']                    # the middle board, 10 x 14 house tiles
ORDER = ('strip', 'downtown', 'suburb', 'wash', 'industrial')
NAME = {'strip': 'THE STRIP', 'downtown': 'DOWNTOWN', 'suburb': 'THE SUBURBS', 'wash': 'THE WASH', 'industrial': 'THE INDUSTRIAL EDGE'}
SEEDS = {'strip': 511, 'downtown': 522, 'suburb': 533, 'wash': 544, 'industrial': 555}
RESIDENTIAL = R3.RESIDENTIAL
SANDS = ('#c8b088', '#d8b078')                 # the map's desert bed grounds
SET4 = 'reference/art_bank/settlement/COOK4_%s_STRAIGHT_ROOF.png'
PAVED = ('strip', 'resort', 'downtown', 'commercial', 'convention', 'casino', 'mall')    # a yard here is hardscape
WORKS = ('industrial', 'warehouse', 'storage', 'rail', 'railyard')
DESERT = ('wash', 'basin', 'desert')
SHOP_LIST = {'strip': ['casino', 'motel', 'gas station'], 'resort': ['casino', 'motel', 'gas station'],
             'downtown': ['corner shop', 'casino', 'motel'], 'industrial': ['warehouse', 'gas station'],
             'commercial': ['corner shop', 'motel', 'gas station']}
YARD_FAM = R1.YARD_FAMS[4]                     # his soil #18: the suburb's yards, as on the five houses he said yes to
DIRT_FAM = ('2. Soil and dirt tiles', [22])    # his plain dark soil (#22, #8f5e3b; #19 is quieter but repeats its grey stones): medians, the works' gravel, tracks
CHAIN = ('6. Chain link fences', [0, 1, 2, 3, 4])                  # #5 carries a plate that reads as a sign at x2: no words on the board
CARS = ('9. Abandoned cards', [i for i in range(35) if i != 19])   # #19 is the police car, the one calm wrong thing: it stands once
SAND_FAM = R1.YARD_FAMS[2]                     # his sandiest soil (#0), nearest the map's bed #c8b088
CONTAINERS = ('Cargo, crates and containers', [32, 35])            # grey and green: the blue and the purples are too loud (9/23)
BOULDERS = ('Rocks and stones (1)', [0, 1, 2, 3, 4, 5, 6, 7])
CREOSOTE = ('15. Dead Trees and dry plants', [5, 6])
R1.KIND.update({
    'container': dict(k=2, cover='cover', real='a 10-ft container is 3 m long, 2.6 m tall; the pack box x2 = 3.4 m'),
    'boulder':   dict(k=2, cover='cover', real='a wash boulder, 1 to 3 m; x2 = 3.4 m across'),
    'creosote':  dict(k=1, cover='low',   real='a creosote bush, 1 to 2 m: right at 1x'),
})

# ---------------------------------------------------------------- reading the map's fine grid
def code(key):
    """the map's cell code to a board class: round one's reader, plus the districts it never met"""
    if key == 'null': return YARD
    g, s, walk, face, lamp, gpool, mpool, apool = key.split('|')[:8]
    if walk == '0':
        if lamp == '1': return LAMPC
        if apool == 'hroof': return BLD
        if g in SANDS: return ROCK                 # a solid on the desert bed is its rock, never a building
        return -1                                  # sized below: building, wall or prop
    if gpool == 'tf_bk': return WALK               # the flood channel's concrete bank
    if gpool.startswith('tf_'): return CHANNEL     # its floor, the low-flow line and the lined swale
    if g in SANDS: return SAND
    if mpool == 'lane': return ROAD                # the lane dashes stay off; the asphalt carries the lane
    return R3.code(key)

CARGO, CAR, DIRT = 20, 21, 22
def classify(c):
    """the map's codes to board classes; then every solid with no roof sized by its own shape: a line or a sparse ring
    is a wall or a fence, a long narrow box on the works is a trailer row (cargo), a filled shape of 30 cells or more a
    building, a sand solid a rock, anything smaller a prop"""
    S_ = c['S']; g = np.array(c['grid']).reshape(S_, S_)
    k = np.array([code(x) for x in c['codes']])[g]
    F = S_ // 3
    def dist_at(ys, xs): return district(c, int(xs.mean()), int(ys.mean()))
    for target in (-1, ROCK):
        lab, n = R3.label(k == target)
        for i in range(1, n + 1):
            m = lab == i; ys, xs = np.nonzero(m); h, w = np.ptp(ys) + 1, np.ptp(xs) + 1; a = int(m.sum())
            fill = a / float(h * w)
            if a <= 3: k[m] = PROP
            elif target == -1 and 6 <= a <= 24 and 2 <= min(h, w) <= 4 and 3 <= max(h, w) <= 6 and fill >= 0.6: k[m] = CAR   # 1.5 x 3 to 4.5 m: a parked car
            elif target == -1 and dist_at(ys, xs) in WORKS and 3 <= min(h, w) <= 5 and max(h, w) >= 2 * min(h, w) and fill >= 0.6: k[m] = CARGO   # a 12 x 3 m trailer
            elif (max(h, w) >= 3 and max(h, w) >= 2.5 * min(h, w)) or (fill < 0.25 and a >= 6): k[m] = WALLR
            elif target == ROCK: k[m] = ROCK if a >= 12 else PROP
            elif a >= 30: k[m] = BLD
            else: k[m] = PROP
    lab, n = R3.label(k == BLD)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() < 60: k[m] = ISLAND             # under 34 m2: a planter, a kiosk, never a building
    # the planted strip between a boulevard's lanes (a dark pad on a Strip or arterial block) is its median
    for by in range(3):
        for bx in range(3):
            if c['blocks'][by * 3 + bx]['district'] in ('strip', 'resort', 'arterial'):
                sub = k[by * F:(by + 1) * F, bx * F:(bx + 1) * F]
                sub[(sub == PARK) | (sub == YARD)] = MEDIAN
    # a planted band wider than 12 m is no median: it is the resort's forecourt, paved
    lab, n = R3.label(k == MEDIAN)
    for i in range(1, n + 1):
        m = lab == i; ys, xs = np.nonzero(m)
        if min(np.ptp(ys), np.ptp(xs)) + 1 > 16 or max(np.ptp(ys), np.ptp(xs)) + 1 < 30: k[m] = WALK   # a forecourt, or a planter pad: paved
    return k

# ---------------------------------------------------------------- the plan: the window of the 3 x 3 the board covers
def window(c, k, feature):
    F = c['S'] // 3
    fw, fh = int(round(C_ * CELLS / K)), int(round(T_ * CELLS / K))
    best = None
    for cy in range(F, 2 * F + 1, 8):
        for cx in range(F, 2 * F + 1, 8):
            x0, y0 = cx - fw // 2, cy - fh // 2
            if x0 < 0 or y0 < 0 or x0 + fw > 3 * F or y0 + fh > 3 * F: continue
            w = k[y0:y0 + fh, x0:x0 + fw]
            f = float(np.isin(w, feature).mean()); o = float(np.isin(w, (ROAD, WALK, YARD, PARK, MEDIAN, SAND, DRIVE, CHANNEL, ZEBRA, LINE, DIRT)).mean())
            sc = (round(min(f, o), 2), -abs(cx - 1.5 * F) - abs(cy - 1.5 * F))
            if best is None or sc > best[0]: best = (sc, x0, y0, f, o)
    return best[1], best[2], fw, fh, best[3], best[4]

def plan(c, name):
    k = classify(c)
    feature = (CHANNEL,) if name == 'wash' else (BLD,)
    fx0, fy0, fw, fh, fshare, oshare = window(c, k, feature)
    H, W = T_ * CELLS, C_ * CELLS
    ys = (fy0 + (np.arange(H) + 0.5) / K).astype(int); xs = (fx0 + (np.arange(W) + 0.5) / K).astype(int)
    raw = k[np.ix_(ys, xs)]
    F = c['S'] // 3
    dname = np.array([[c['blocks'][min(2, y // F) * 3 + min(2, x // F)]['district'] for x in xs] for y in ys])
    paved, works, desert = np.isin(dname, PAVED), np.isin(dname, WORKS), np.isin(dname, DESERT)
    # in the wash, the map's dark street cells inside the channel are its low-flow line (kept dark); out on the bed
    # they are a dirt track; its dark pads are the dirt verge, never parking
    tf = np.asarray(Image.fromarray(np.isin(raw, (CHANNEL, WALK)).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(7))) > 0
    cls = raw.copy()
    cls[np.isin(raw, (BLD, WALLR, PROP, LAMPC, ISLAND, CARGO, CAR))] = -1        # under a standing piece: the ground around it
    cls[raw == PARK] = ROAD
    cls[desert & (raw == PARK)] = SAND                                          # the bed is one sand
    cls[desert & (raw == ROAD) & ~tf] = DIRT                                     # its tracks
    cls[raw == ROCK] = SAND
    cls[raw == MEDIAN] = DIRT
    cls[paved & (raw == YARD)] = WALK                                            # a Strip or downtown yard is hardscape
    cls[works & (raw == YARD)] = DIRT                                            # the works' yard is gravel
    # a cell under a standing piece takes the ground most of its four neighbours have (a roof stands on its own yard)
    for _ in range(40):
        hole = cls == -1
        if not hole.any(): break
        pad = np.pad(cls, 1, constant_values=-1)
        for y, x in zip(*np.nonzero(hole)):
            nb = [v for v in (pad[y, x + 1], pad[y + 2, x + 1], pad[y + 1, x], pad[y + 1, x + 2]) if v >= 0]
            if nb: cls[y, x] = max(set(nb), key=nb.count)
    cls[cls == -1] = YARD
    return dict(dname=dname, F=c['S'] // 3, k=k, fx0=fx0, fy0=fy0, fw=fw, fh=fh, H=H, W=W, T=T_, C=C_, cls=cls, raw=raw,
                feature_share=round(fshare, 3), open_share=round(oshare, 3))

def to_px(P, fx, fy):
    return (fx - P['fx0']) * K * TW, (fy - P['fy0']) * K * TH

def district(c, fx, fy):
    F = c['S'] // 3
    return c['blocks'][min(2, max(0, fy // F)) * 3 + min(2, max(0, fx // F))]['district']

# ---------------------------------------------------------------- the ground raster
class Ground(R1.Ground):
    """round one's ground cells, plus the channel floor: COOK TWO's road-cell recipe with his sandiest soil where the
    asphalt would be (the silt a flood leaves on the floor), so his slab's south face falls on the floor wherever the
    concrete bank (a walk) is to its north: the drop reads, and the floor reads as a dry bed between two concrete banks"""
    def channel(self, case):
        k = (case, CHANNEL, 0, self.rng.randint(self.VAR))
        if k not in self.cache: self.cache[k] = R1.render(case, False, self.yard(SAND_FAM, bool(self.rng.rand() < 0.5))[..., :3])
        return self.cache[k]

def lay_ground(P, G, seed):
    H, W, cls = P['H'], P['W'], P['cls']
    img = np.zeros((H * TH, W * TW, 3), np.uint8)
    pad = np.pad(np.isin(cls, (WALK, DRIVE)), 1)
    rng = np.random.RandomState(seed + 7)
    zebra_idx = {}
    for y in range(H):
        for x in range(W):
            k = cls[y, x]
            sl = (slice(y * TH, (y + 1) * TH), slice(x * TW, (x + 1) * TW))
            if k in (YARD, SAND, DIRT):
                img[sl] = G.yard({YARD: YARD_FAM, SAND: SAND_FAM, DIRT: DIRT_FAM}[k], bool(rng.rand() < 0.5)); continue
            case = B.blob(tuple(int(pad[1 + y + dy, 1 + x + dx]) for dy, dx in B.NB))
            if k in (WALK, DRIVE): img[sl] = G.cell(case, WALK)
            elif k == CHANNEL: img[sl] = G.channel(case)
            elif k == ZEBRA:
                col = x // CELLS
                if col not in zebra_idx: zebra_idx[col] = (15, 16, 17)[rng.randint(3)]
                img[sl] = G.cell(case, ZEBRA, zebra_idx[col])
            elif k == LINE: img[sl] = G.cell(case, LINE, (18, 19, 20, 21, 22)[rng.randint(5)])
            else: img[sl] = G.cell(case, ROAD)
    return img

# ---------------------------------------------------------------- the pieces
def pooled(P, cls_set):
    """a map class pooled onto the board's cells: a board cell is true if ANY fine cell under it is (a one-cell wall
    never falls between two samples)"""
    m = np.isin(P['k'], cls_set)
    rb = (P['fy0'] + np.arange(P['H'] + 1) / K).astype(int); cb = (P['fx0'] + np.arange(P['W'] + 1) / K).astype(int)
    win = m[rb[0]:rb[-1] + 1, cb[0]:cb[-1] + 1]
    a = np.logical_or.reduceat(win, rb[:-1] - rb[0], axis=0)
    return np.logical_or.reduceat(a, cb[:-1] - cb[0], axis=1)

def thin(m):
    """Zhang and Suen's thinning (1984): a wall two cells thick at the board's grid becomes one, so a run reads as one line"""
    m = np.pad(m.astype(np.uint8), 1)
    while True:
        changed = False
        for step in (0, 1):
            P2, P3, P4, P5 = m[:-2, 1:-1], m[:-2, 2:], m[1:-1, 2:], m[2:, 2:]
            P6, P7, P8, P9 = m[2:, 1:-1], m[2:, :-2], m[1:-1, :-2], m[:-2, :-2]
            nb = [P2, P3, P4, P5, P6, P7, P8, P9]
            B_ = sum(n.astype(int) for n in nb)
            A_ = sum(((nb[i] == 0) & (nb[(i + 1) % 8] == 1)).astype(int) for i in range(8))
            c = m[1:-1, 1:-1] == 1
            if step == 0: cond = c & (B_ >= 2) & (B_ <= 6) & (A_ == 1) & (P2 * P4 * P6 == 0) & (P4 * P6 * P8 == 0)
            else: cond = c & (B_ >= 2) & (B_ <= 6) & (A_ == 1) & (P2 * P4 * P8 == 0) & (P2 * P6 * P8 == 0)
            if cond.any(): m[1:-1, 1:-1][cond] = 0; changed = True
        if not changed: return m[1:-1, 1:-1].astype(bool)

def stand(PR, kind, fam, cx, foot, idx=None, flip=False, cover=True, why=''):
    """one of his pieces standing on the board, and its line in the record"""
    im = PR.put(kind, fam, cx, foot, idx=idx, flip=flip, cover=cover)
    PR.__dict__.setdefault('rec', []).append(dict(n=len(PR.items) - 1, kind=kind, cx=float(cx), foot=float(foot), why=why))
    return im

def far_from(pts, cx, cy, d):
    return all(max(abs(cx - a), abs(cy - b)) >= d for a, b in pts)

SHOP_IMG = {}
def shop(name):
    if name not in SHOP_IMG:
        im = Image.open(SET4 % name.upper().replace(' ', '_')).convert('RGBA'); a = np.asarray(im)[..., 3]
        cnt = (a > 200).sum(1); foot = int(np.nonzero(cnt >= 0.5 * cnt.max())[0].max())   # the wall foot, measured
        x0, _, x1, _ = im.getbbox()
        SHOP_IMG[name] = (im, foot, x1 - x0)
    return SHOP_IMG[name]

DECK = {}
def deck_field():
    if 'g' not in DECK:
        import bohemia_cook4_the_roof_measured as rm                       # COOK FOUR's own lay and shade
        DECK['rm'] = rm
        DECK['g'] = Image.open('reference/art_bank/settlement/COOK4_ROOF_GRAVEL_FIELD.png').convert('RGBA')
    return DECK['rm'], DECK['g']

HOUSE = {}
def house(kd, flip):
    """COOK FOUR's tan ranch as filed; the plain one cut to its body: its side fence carries a KEEP OUT plate, a word on
    the board (one-look rule 1). Cut at the last column where the house stands taller than its fence; nothing redrawn."""
    if (kd, flip) not in HOUSE:
        im = R2.house_img(kd, False)
        if kd == 'plain':
            a = np.asarray(im)[..., 3] > 128; tall = np.nonzero(a.sum(0) > 0.4 * a.shape[0])[0]
            im = im.crop((0, 0, int(tall.max()) + 2, im.height))
        HOUSE[(kd, flip)] = im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im
    return HOUSE[(kd, flip)]

def ranch_widths():
    return {kd: house(kd, False).getbbox()[2] - house(kd, False).getbbox()[0] for kd in R2.ORDER}

def buildings(c, P, PR, rng, log):
    """every roof of the map on the board: a ranch on a house roof, a deck and the district's fronts on the rest"""
    k = P['k']; lab, n = R3.label(k == BLD)
    roofs = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        fx0, fx1, fy0, fy1 = int(xs.min()), int(xs.max()) + 1, int(ys.min()), int(ys.max()) + 1
        if fx1 <= P['fx0'] or fx0 >= P['fx0'] + P['fw'] or fy1 <= P['fy0'] or fy0 >= P['fy0'] + P['fh'] + 12: continue
        roofs.append((i, fx0, fx1, fy0, fy1, ys, xs, district(c, int(xs.mean()), int(ys.mean()))))
    RW = ranch_widths(); last = None
    for i, fx0, fx1, fy0, fy1, ys, xs, d in sorted(roofs, key=lambda r: (r[4], r[1])):
        x0, foot = to_px(P, fx0, fy1); x1, _ = to_px(P, fx1, fy1); top = to_px(P, fx0, fy0)[1]
        if d in RESIDENTIAL:
            # one ranch a roof: room is half the gap to the next roof on each side that shares its rows
            lo, hi = -1e9, 1e9
            for j, gx0, gx1, gy0, gy1, _, _, _ in roofs:
                if j == i or gy1 <= fy0 or gy0 >= fy1: continue
                if gx1 <= fx0: lo = max(lo, (gx1 + fx0) / 2)
                if gx0 >= fx1: hi = min(hi, (fx1 + gx0) / 2)
            room = min((fx0 + fx1) / 2 - lo, hi - (fx0 + fx1) / 2) * 2 * K * TW
            wpx = x1 - x0
            fits = [kd for kd in R2.ORDER if RW[kd] <= room and kd != last] or [min(R2.ORDER, key=lambda kd: RW[kd])]
            kd = min(fits, key=lambda kd: abs(RW[kd] - wpx)); last = kd
            flip = bool(rng.rand() < 0.5); im = house(kd, flip)
            hx = int((x0 + x1) / 2 - im.width / 2); f = int(foot) - 10
            PR.items.append((f + (im.height - 445 if kd == 'wing' else 0), hx, f - R2.KINDS[kd]['foot'], im, 'house'))
            log.append(dict(piece='ranch ' + kd, flip=flip, district=d, fine=[fx0, fy0, fx1, fy1], px=[hx, f],
                            roof_m=[round((fx1 - fx0) * M_FINE, 1), round((fy1 - fy0) * M_FINE, 1)], house_px=RW[kd]))
            continue
        # a roof with no house on it: his gravel deck laid COOK FOUR's way over the roof's own cells
        rm, g = deck_field()
        bx0, by0 = int(x0), int(top)
        bw, bh = int(x1 - x0), int(foot - top)
        mfine = (lab[fy0:fy1, fx0:fx1] == i).astype(np.uint8) * 255
        mask = Image.fromarray(mfine).resize((max(1, bw), max(1, bh)), Image.NEAREST)
        body = rm.lay(g, max(1, bw), max(1, bh), crop=(4, 4, g.width - 4, g.height - 22), dy=6)
        body = rm.shade_top(body)
        deck = Image.new('RGBA', body.size); deck.paste(body, (0, 0), mask)
        PR.items.append((by0, bx0, by0, deck, 'deck'))      # a deck lies flat: drawn before anything south of its far edge
        log.append(dict(piece='deck', district=d, fine=[fx0, fy0, fx1, fy1], m=[round((fx1 - fx0) * M_FINE, 1), round((fy1 - fy0) * M_FINE, 1)]))
        # the fronts: along each stretch of the roof's south edge, the district's pieces, biggest that fits, west to east
        south = {}
        for y, x in zip(ys, xs): south[x] = max(south.get(x, -1), y)
        runs, cur = [], None
        for x in sorted(south):
            if cur and x == cur[1] and abs(south[x] - cur[2]) <= 2: cur[1] = x + 1; cur[2] = max(cur[2], south[x])
            else:
                if cur: runs.append(cur)
                cur = [x, x + 1, south[x]]
        if cur: runs.append(cur)
        lst = SHOP_LIST.get(d, SHOP_LIST['commercial'])
        for rx0, rx1, sy in runs:
            if (rx1 - rx0) * M_FINE < 8: continue
            px0, f = to_px(P, rx0, sy + 1); px1, _ = to_px(P, rx1, sy + 1)
            if f > P['H'] * TH + 80 or f < 0: continue
            f = int(f) - 10; x = px0; prev = None
            while x < px1 - 300:
                left = px1 - x
                cand = [nm for nm in lst if shop(nm)[2] <= left * 1.03 and nm != prev]
                if not cand: break
                nm = cand[0]; im, ft, wv = shop(nm)
                PR.items.append((f, int(x), f - ft, im, 'shop'))
                log.append(dict(piece=nm, district=d, fine=[rx0, sy], px=[int(x), f]))
                x += wv + 30; prev = nm

def dress(c, P, G, img, PR, rng, name, log):
    raw, cls, H, W = P['raw'], P['cls'], P['H'], P['W']
    def px(y, x): return (x + 0.5) * TW, (y + 1) * TH
    roofed = pooled(P, (BLD,))                       # nothing stands on a roof
    def on_roof(cx, foot): return roofed[min(H - 1, max(0, int(foot // TH) - 1)), min(W - 1, max(0, int(cx // TW)))]
    dmid = c['blocks'][4]['district']
    # 1. walls and fences: every board cell a map wall touches, thinned to one cell wide, the whole run (cover lines, kept whole)
    wall = thin(pooled(P, (WALLR,)))
    fence = name in ('wash', 'industrial')
    for y, x in zip(*np.nonzero(wall & ~roofed)):
        cx, foot = px(y, x)
        if fence:
            if x % 2 == 0 or not wall[y, x - 1]: stand(PR, 'chain', CHAIN, cx + TW / 2, foot - 6, why='fence run')
        else: stand(PR, 'wall', R1.WALLS, cx, foot - 4, why='wall run')
    # 2. the map's lamps, thinned: none within two house tiles of another
    lamps = []
    lab, n = R3.label(P['k'] == LAMPC)
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        fx, fy = xs.mean() + 0.5, ys.max() + 1
        if not (P['fx0'] <= fx < P['fx0'] + P['fw'] and P['fy0'] <= fy - 1 < P['fy0'] + P['fh']): continue
        cx, foot = to_px(P, fx, fy)
        if on_roof(cx, foot) or not far_from(lamps, cx, foot, 2 * TPX): continue
        lamps.append((cx, foot)); stand(PR, 'lamp', R1.LAMPS, cx, foot - 2, cover=False, why='a map lamp, spaced')
        PR.lights.append(dict(kind='lamp', power='grid', from_map=True, x_m=round(cx / R1.PPM, 2), y_m=round(foot / R1.PPM, 2)))
    # 3. the map's small things, by what the district is; one-look: one thing a spot, never a speck
    trees, bins = [], []
    for cl in (PROP, ISLAND):
        lab, n = R3.label(P['k'] == cl)
        for i in range(1, n + 1):
            ys, xs = np.nonzero(lab == i)
            fx, fy = xs.mean() + 0.5, ys.max() + 1
            if not (P['fx0'] <= fx < P['fx0'] + P['fw'] and P['fy0'] <= fy - 1 < P['fy0'] + P['fh']): continue
            cx, foot = to_px(P, fx, fy); d = district(c, int(fx), int(fy - 1))
            by, bx = min(H - 1, int(foot // TH) - 1), min(W - 1, int(cx // TW))
            if cls[by, bx] in (ROAD, CHANNEL) or roofed[by, bx]: continue
            if d in ('strip', 'resort') or d in RESIDENTIAL:
                if far_from(trees, cx, foot, 1.5 * TPX):
                    trees.append((cx, foot)); stand(PR, 'tree', R1.TREES, cx, foot, why='one dead tree, spaced')
            elif d in ('wash', 'basin', 'desert'):
                if far_from(trees, cx, foot, 1.5 * TPX):
                    trees.append((cx, foot)); stand(PR, 'creosote', CREOSOTE, cx, foot, why='one creosote, spaced')
            elif far_from(bins, cx, foot, 2 * TPX):
                bins.append((cx, foot)); stand(PR, 'dumpster', R1.DUMPSTER, cx, foot, why='one dumpster, spaced')
    # 4. the bed's rocks: one boulder a rock, one more for every 40 m2 of it
    lab, n = R3.label(P['k'] == ROCK)
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        if not (P['fx0'] <= xs.mean() < P['fx0'] + P['fw'] and P['fy0'] <= ys.mean() < P['fy0'] + P['fh']): continue
        nb = 1 + int(len(ys) * M_FINE * M_FINE // 40)
        order = np.argsort(xs * 1000 + ys)
        for j in range(min(nb, 4)):
            q = order[int((j + 0.5) * len(order) / min(nb, 4))]
            cx, foot = to_px(P, xs[q] + 0.5, ys[q] + 1)
            stand(PR, 'boulder', BOULDERS, cx, foot, flip=bool(rng.rand() < 0.5), why='a boulder of the bed')
    # 5. the works' trailer rows: his containers end to end down each row
    lab, n = R3.label(P['k'] == CARGO)
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        if not (P['fx0'] <= xs.mean() < P['fx0'] + P['fw'] and P['fy0'] <= ys.mean() < P['fy0'] + P['fh']): continue
        idx = CONTAINERS[1][rng.randint(len(CONTAINERS[1]))]
        cx, _ = to_px(P, xs.mean() + 0.5, 0)
        for fy in range(int(ys.min()) + 4, int(ys.max()) + 2, 5):
            _, foot = to_px(P, 0, fy)
            stand(PR, 'container', CONTAINERS, cx, foot, idx=idx, why='a trailer row of the map')
    # 6. the map's parked cars, one a house tile at most (a car where a car would be)
    cars = []
    lab, n = R3.label(P['k'] == CAR)
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        if not (P['fx0'] <= xs.mean() < P['fx0'] + P['fw'] and P['fy0'] <= ys.mean() < P['fy0'] + P['fh']): continue
        cx, foot = to_px(P, xs.mean() + 0.5, ys.max() + 1)
        if not on_roof(cx, foot) and far_from(cars, cx, foot, TPX):
            cars.append((cx, foot)); stand(PR, 'car', CARS, cx, foot, flip=bool(rng.rand() < 0.5), why='a parked car of the map')
    # 7. wrecks: one a stretch of street, none within two house tiles of another, none at a crossing
    road = [(y, x) for y in range(2, H) for x in range(W) if cls[y, x] == ROAD and not roofed[y, x]]
    zeb = cls == ZEBRA
    for i in rng.permutation(len(road))[:400]:
        if len(cars) >= len(road) // 900 + len([1 for r in PR.rec if r['why'] == 'a parked car of the map']): break
        y, x = road[i]; cx, foot = px(y, x)
        if zeb[max(0, y - CELLS):y + CELLS, max(0, x - CELLS):x + CELLS].any() or not far_from(cars, cx, foot, 2 * TPX): continue
        cars.append((cx, foot)); stand(PR, 'car', CARS, cx, foot, flip=bool(rng.rand() < 0.5), why='one wreck a stretch of street')
    # 8. one fire barrel a board, with its scorch, on open ground near the middle
    opn = [(y, x) for y in range(H // 3, 2 * H // 3) for x in range(W // 3, 2 * W // 3) if cls[y, x] in (ROAD, WALK, SAND, CHANNEL, YARD, DIRT) and not wall[y, x] and not roofed[y, x]]
    if opn:
        y, x = opn[rng.randint(len(opn))]; cx, foot = px(y, x)
        sc = np.asarray(R1.nearest(R1.bank(R1.SCORCH[0], R1.SCORCH[1][rng.randint(len(R1.SCORCH[1]))]), 2))
        R1.decal_at(img, sc, int(foot) - sc.shape[0] + 30, int(cx) - sc.shape[1] // 2, 0.85, 20)
        stand(PR, 'barrel', R1.BARRELS, cx, foot, why='one fire barrel a board')
        PR.lights.append(dict(kind='fire barrel', power='fire', x_m=round(cx / R1.PPM, 2), y_m=round(foot / R1.PPM, 2)))
    # 9. cracks only along the kerb (a road cell with a walk beside it)
    walkish = np.isin(cls, (WALK, DRIVE))
    near = np.asarray(Image.fromarray(walkish.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0
    kerb = [(y, x) for y, x in zip(*np.nonzero((cls == ROAD) & near))]
    P['cracks'] = 0
    for i in range(len(kerb) // 60):
        y, x = kerb[rng.randint(len(kerb))]
        src = S.cut_frame(S.pack(S.ROAD, R1.CRACKS[1][rng.randint(5)]), S.ROAD)
        R1.decal_at(img, src, y * TH, x * TW, 0.8, 12); P['cracks'] += 1
    # 10. THE ANALOG HORROR LINE: the clean police car, parked straight, on every district's board
    want = [(y, x) for y in range(H // 3, H - 2) for x in range(W // 3, W - 2)
            if cls[y, x] == ROAD and not roofed[y, x] and (walkish[y - 1, x] or walkish[min(H - 1, y + 1), x])]
    if not want: want = [(y, x) for y in range(H // 3, H - 2) for x in range(W // 3, W - 2) if cls[y, x] in (ROAD, SAND, CHANNEL, YARD, DIRT) and not roofed[y, x]]
    if want:
        y, x = want[len(want) // 2]; cx, foot = px(y, x)
        stand(PR, 'car', R1.CARS, cx, foot + TH / 2, idx=R2.POLICE, why='the analog horror line: the clean police car')

def terrain(P):
    """per house tile, from the map's own cells under it: blocked (half or more roof or trailer row), part blocked, low
    (the channel floor: the bank shoots down into it), rough (the desert bed), flat"""
    raw = P['raw']; t = []
    for r in range(P['T']):
        row = []
        for cc in range(P['C']):
            w = raw[r * CELLS:(r + 1) * CELLS, cc * CELLS:(cc + 1) * CELLS]; b = np.isin(w, (BLD, CARGO)).mean()
            row.append('blocked' if b >= 0.5 else 'part blocked' if b >= 0.2 else 'low' if (w == CHANNEL).mean() >= 0.5
                       else 'rough' if np.isin(w, (SAND, ROCK)).mean() >= 0.5 else 'flat')
        t.append(row)
    return t

# ---------------------------------------------------------------- the counts (round one-look's fields)
def count(P, PR, board, bare):
    sc = R4.PHONE_W / board.width
    rec = PR.rec; kinds = {}
    for r in rec: kinds[r['kind']] = kinds.get(r['kind'], 0) + 1
    specks = sum(1 for r in rec if r['why'] not in ('fence run', 'wall run') and max(R4.alpha_box(PR.items[r['n']][3])) * sc < R4.SPECK_PX)
    per_tile = {}
    for r in rec:
        if r['why'] in ('fence run', 'wall run'): continue
        t = (int((r['foot'] - 1) // TPY), int(r['cx'] // TPX)); per_tile[t] = per_tile.get(t, 0) + 1
    no_fact = sum(1 for r in rec if R1.KIND[r['kind']]['cover'] is None and r['kind'] != 'lamp')
    built = {}
    for it in PR.items:
        if it[4] in ('house', 'shop', 'deck'): built[it[4]] = built.get(it[4], 0) + 1
    fb, fa = R4.opening_frame(board), R4.opening_frame(bare)
    return dict(houses=built.get('house', 0), shop_fronts=built.get('shop', 0), roof_decks=built.get('deck', 0),
                standing=len(rec), kinds=dict(sorted(kinds.items())), no_fight_fact=no_fact,
                lit=kinds.get('lamp', 0) + kinds.get('barrel', 0), labelled=0,
                outlined=dict(cracks=P['cracks'], chain_link=kinds.get('chain', 0), zebras=int((P['cls'] == ZEBRA).sum() // (2 * CELLS))),
                loud=0, specks=specks, most_things_on_one_house_tile=max(per_tile.values()) if per_tile else 0,
                cover_pieces=len(PR.cover), spots_at_the_opening_frame=R4.spots(fb, fa)), fb

# ---------------------------------------------------------------- the run
def main(only=ORDER):
    t0 = time.time()
    M = json.load(open(MAPFILE))
    G = Ground(1018)
    boards, facts, plans, frames = {}, {}, {}, {}
    for name in only:
        c = M['cells'][name]; seed = SEEDS[name]; rng = np.random.RandomState(seed)
        P = plan(c, name); plans[name] = P
        img = lay_ground(P, G, seed)
        PR = R1.Props(P, seed); PR.rec = []; log = []
        buildings(c, P, PR, rng, log)
        dress(c, P, G, img, PR, rng, name, log)
        board = R1.composite(img, PR); boards[name] = board
        bare = Image.fromarray(img)                    # the same ground and decals with nothing standing (round one-look's control)
        cnt, fb = count(P, PR, board, bare); frames[name] = fb
        planted = None
        if name == 'suburb':
            n_, got = R4.planted_control(np.asarray(bare))
            planted = dict(planted=n_, counted=got)
        raw = P['raw']; share = {nm: round(float(np.isin(raw, v).mean()) * 100, 1) for nm, v in
                                 (('roadway', (ROAD, PARK, LINE, ZEBRA)), ('walk', (WALK, DRIVE)), ('yard', (YARD, MEDIAN)), ('roof', (BLD,)),
                                  ('channel', (CHANNEL,)), ('desert bed', (SAND, ROCK)), ('trailer rows', (CARGO,)))}
        facts[name] = dict(district=NAME[name], map_word=c['blocks'][4]['district'], map_block=[c['x'], c['y']],
                           neighbours=[b['district'] for b in c['blocks']], family_around=c['family_around'], from_party_blocks=c['from_party'],
                           fine_window=[P['fx0'], P['fy0'], P['fw'], P['fh']], window_feature_share=P['feature_share'], window_open_share=P['open_share'],
                           tiles_across=C_, tiles_down=T_, px=[board.width, board.height], metres=[round(C_ * 11.5, 1), round(T_ * 11.5, 1)],
                           share_percent=share, counts=cnt, eye_count_control=planted, pieces=log, cover=PR.cover, lights=PR.lights,
                           _rec=[dict(cx=r['cx'], foot=r['foot']) for r in PR.rec],
                           terrain=terrain(P), colours_per_96px=R1.density(np.asarray(board)), elapsed_s=round(time.time() - t0, 1))
        board.save(os.path.join(OUT, 'COMBAT2_DISTRICT_%s_10_18.webp' % name.upper()), quality=84, method=4)
        print(name, board.size, 'houses', cnt['houses'], 'fronts', cnt['shop_fronts'], 'decks', cnt['roof_decks'], 'standing', cnt['standing'],
              'lit', cnt['lit'], 'specks', cnt['specks'], 'eye', cnt['spots_at_the_opening_frame'], planted, share,
              'density', facts[name]['colours_per_96px'], round(time.time() - t0), 's', flush=True)
        del img, bare
    if tuple(only) != ORDER: return
    keys = sorted(R1.USED.items(), key=lambda kv: (-kv[1], kv[0]))
    man = dict(lane='combat 2', row='[a board from every district]',
               rule='52 no two boards the same; 117 a board you read in one look; 100 candidates only; 108 nothing drawn; 115b the ground and the buildings stay on the packs',
               source_map=os.path.relpath(MAPFILE), map_seed=M['seed'],
               ruler=dict(fine_cell_m=M_FINE, why="WORLD [the one ruler] 72a83f32: a lane is 4 fine cells and a line (3.4 m), a house 17 x 12 cells",
                          cook2_cell_m=1.44, cells_per_fine=round(K, 4), house_tile_m=11.5, house_tile_fine_cells=round(11.5 / M_FINE, 1),
                          board='middle, 14 x 10 house tiles = 161 x 115 m', px_per_m=round(R1.PPM, 2)),
               opening_frame='the board whole on an upright phone, %d device px wide (the fight\'s far stop, rule 104a)' % R4.PHONE_W,
               pieces={('COMBAT2_DISTRICT_%s_10_18' % n.upper()): dict(src='COMBAT2_DISTRICT_%s_10_18.webp' % n.upper(),
                        keys=[{'pack': k[0], 'idx': k[1]} for k, _ in keys]) for n in boards},
               cook_files=['reference/art_bank/settlement/COOK4_RANCH_TAN_%s.png' % k.upper() for k in R2.ORDER] +
                          [SET4 % n.upper().replace(' ', '_') for n in ('casino', 'motel', 'gas station', 'corner shop', 'warehouse')] +
                          ['reference/art_bank/settlement/COOK4_ROOF_GRAVEL_FIELD.png'],
               keys_used=[[k[0], k[1], n, 'UP' if R1.up(*k) else 'never judged'] for k, n in keys],
               boards={n: {k_: v for k_, v in fa.items() if k_ != '_rec'} for n, fa in facts.items()})
    json.dump(man, open(os.path.join(OUT, 'COMBAT2_DISTRICTS_10_18.json'), 'w'), indent=1, default=lambda o: o.item() if hasattr(o, 'item') else str(o))
    sheet(M, plans, boards, facts, frames)
    print('keys', len(keys), 'total', round(time.time() - t0), 's')

COL = {ROAD: (52, 52, 60), PARK: (70, 68, 64), ZEBRA: (225, 222, 210), LINE: (200, 170, 50), WALK: (186, 182, 170), DRIVE: (150, 140, 120),
       YARD: (138, 120, 92), BLD: (196, 168, 120), WALLR: (90, 80, 70), PROP: (80, 90, 60), LAMPC: (250, 230, 120), ISLAND: (150, 150, 120),
       CHANNEL: (200, 176, 136), SAND: (200, 176, 136), ROCK: (100, 90, 70), MEDIAN: (110, 100, 70), CARGO: (90, 110, 100), CAR: (150, 150, 150)}

def fine_picture(P):
    """the map's own plan of the 3 x 3 blocks, one colour a class, the board's window outlined"""
    im = np.zeros(P['k'].shape + (3,), np.uint8)
    for v, col in COL.items(): im[P['k'] == v] = col
    return Image.fromarray(im)

def sheet(M, plans, boards, facts, frames):
    Wd = 2400; pad = 24; F = R1.font(30); f = R1.font(24); fs = R1.font(20)
    rows = []
    def label(t, big=False): rows.append(('text', t, big))
    label('COMBAT TWO: ONE FIGHT BOARD FROM EACH DISTRICT OF THE MAP: THE STRIP, DOWNTOWN, THE SUBURBS, THE WASH, THE INDUSTRIAL EDGE. CANDIDATES, NOT IN THE GAME.', True)
    label('Top: the five boards side by side, each the whole board the way the fight opens on a phone. Then one row a district: the map as you see it (left, the block in the middle), '
          'the map\'s own plan of that block and its neighbours (middle, the box is the board), and the board at the phone\'s width (right). Every board is a real block of the map.')
    # 1. the five side by side
    tw = (Wd - 2 * pad - 4 * 16) // 5
    strip_ = Image.new('RGB', (Wd - 2 * pad, int(tw * 6480 / 9184) + 34), (14, 14, 14)); d = ImageDraw.Draw(strip_)
    for i, name in enumerate(ORDER):
        b = frames[name].resize((tw, int(frames[name].height * tw / frames[name].width)), Image.LANCZOS)
        strip_.paste(b, (i * (tw + 16), 34)); d.text((i * (tw + 16), 2), NAME[name], font=R1.font(24), fill=(235, 220, 190))
    rows.append(('img', strip_, 'THE FIVE SIDE BY SIDE: the same fight on five different grounds, each from its own block of the map.'))
    # 2. one row a district
    cw = 520
    for name in ORDER:
        P = plans[name]; c = M['cells'][name]; fa = facts[name]; cnt = fa['counts']
        mp = R3.map_picture(c, cw)
        fp = fine_picture(P); sc = cw / fp.width
        fpi = fp.resize((cw, cw), Image.NEAREST); dd = ImageDraw.Draw(fpi)
        dd.rectangle([P['fx0'] * sc, P['fy0'] * sc, (P['fx0'] + P['fw']) * sc, (P['fy0'] + P['fh']) * sc], outline=(255, 70, 40), width=4)
        bi = frames[name]
        h = max(mp.height, fpi.height, bi.height)
        row = Image.new('RGB', (Wd - 2 * pad, h), (14, 14, 14))
        row.paste(mp, (0, 0)); row.paste(fpi, (cw + pad, 0)); row.paste(bi, (2 * (cw + pad), 0))
        sh = fa['share_percent']
        bits = ', '.join('%s %s%%' % (k_, v) for k_, v in sh.items() if v >= 1)
        rows.append(('img', row, '%s: map block %d,%d (the map calls it %s), the board 14 x 10 house tiles = 161 x 115 m. %s. Standing: %d houses, %d shop fronts, %d roof decks, %d other things (%s); lit %d; '
                     'things the eye counts at this frame %d, of them specks %d.' % (NAME[name], fa['map_block'][0], fa['map_block'][1], fa['map_word'], bits.capitalize(),
                     cnt['houses'], cnt['shop_fronts'], cnt['roof_decks'], cnt['standing'], ', '.join('%s %d' % kv for kv in cnt['kinds'].items()), cnt['lit'],
                     cnt['spots_at_the_opening_frame']['spots'], cnt['spots_at_the_opening_frame']['specks'])))
    # 3. at 1:1, two rows of crops: each where the most kinds of ground meet and something stands, the man at 112 on open ground
    man = Image.open(R1.MAN).convert('RGBA').crop((0, 0, 112, 112))
    os.makedirs(os.path.join(OUT, 'sprites'), exist_ok=True)
    cwid, chgt = (Wd - 2 * pad - 2 * 16) // 3, 620
    def best_crop(name):
        P = plans[name]; cls = P['cls']; b = boards[name]; feet = [(r['cx'], r['foot']) for r in facts[name]['_rec']]
        best = None
        wc, hc = int(cwid / TW), int(chgt / TH)
        for y in range(0, P['H'] - hc, 3):
            for x in range(0, P['W'] - wc, 3):
                w = cls[y:y + hc, x:x + wc]
                kinds = len(set(np.unique(w)) - {LINE})
                things = sum(1 for cx, ft in feet if x * TW <= cx < (x + wc) * TW and y * TH < ft <= (y + hc) * TH)
                sc = kinds * 3 + min(things, 4)
                if best is None or sc > best[0]: best = (sc, x, y)
        _, x, y = best
        x0, y0 = int(x * TW), int(y * TH)
        cr = b.crop((x0, y0, x0 + cwid, y0 + chgt)).convert('RGBA')
        cr.convert('RGB').save(os.path.join(OUT, 'sprites', 'COMBAT2_DISTRICT_%s_1TO1_10_18.png' % name.upper()))   # the card's sprite (rule 114c)
        # the man: on the open cell nearest the crop's middle that nothing stands on and no roof covers
        roofed = pooled(P, (BLD, CARGO))
        open_ = [(abs(yy - (y + hc // 2)) + abs(xx - (x + wc // 2)), yy, xx) for yy in range(y + 2, y + hc - 1) for xx in range(x + 1, x + wc - 1)
                 if cls[yy, xx] in (ROAD, WALK, DRIVE, YARD, SAND, DIRT, CHANNEL) and not roofed[yy, xx]]
        if open_:
            _, yy, xx = min(open_)
            cr.paste(man, (int((xx + 0.5) * TW) - x0 - 56, int((yy + 1) * TH) - y0 - 112), man)
        return cr.convert('RGB')
    for group in (ORDER[:3], ORDER[3:]):
        one = Image.new('RGB', (Wd - 2 * pad, chgt + 30), (14, 14, 14)); d = ImageDraw.Draw(one)
        for i, name in enumerate(group):
            one.paste(best_crop(name), (i * (cwid + 16), 30)); d.text((i * (cwid + 16), 2), NAME[name] + ' at 1:1', font=R1.font(20), fill=(235, 220, 190))
        rows.append(('img', one, 'AT 1:1 (one art pixel to one phone pixel), the man at 112 px on open ground: each crop is where the most kinds of that district\'s ground meet.' if group == ORDER[3:] else ''))
    # 4. the twin: his tiles as bought, the district pieces, beside the man
    twn = Image.new('RGB', (Wd - 2 * pad, 290), (14, 14, 14)); d = ImageDraw.Draw(twn)
    d.text((10, 6), 'THE TWIN, his tiles as bought at 1:1 (what each district stands on and hides behind), then COOK FOUR\'s pieces at a sixth, beside the man', font=f, fill=(235, 235, 235))
    pk = [('Cargo, crates and containers', 32, 'container: the works'), ('Rocks and stones (1)', 2, 'boulder: the wash'), ('15. Dead Trees and dry plants', 5, 'creosote: the wash'),
          ('16. Dead trees and plants', 6, 'tree: the median'), ('6. Chain link fences', 0, 'chain link: wash, works'), ('2. Broken building walls', 0, 'wall: suburb'),
          ('9. Abandoned cards', 19, 'the police car'), ('18. Light sources and fire barrels', 2, 'lamp: spaced'), ('2. Soil and dirt tiles', 0, 'sand: the bed'),
          ('2. Soil and dirt tiles', 19, 'dirt: medians')]
    x = 10
    for nm_, i, lab in pk:
        t = R1.bank(nm_, i); twn.paste(t, (x, 80), t)
        for j, ln in enumerate(lab.split(': ')): d.text((x, 186 + 22 * j), ln, font=R1.font(16), fill=(200, 210, 190))
        x += 150
    twn.paste(man, (x, 80 + 96 - 112), man); d.text((x, 186), 'the man, 112', font=R1.font(16), fill=(200, 190, 170)); x += 140
    for nm_ in ('casino', 'corner shop', 'warehouse'):
        im = shop(nm_)[0]; q = im.resize((im.width // 6, im.height // 6), Image.LANCZOS)
        twn.paste(q, (x, 180 - q.height), q); d.text((x, 186), nm_ + ' (1/6)', font=R1.font(16), fill=(200, 210, 190)); x += q.width + 20
    rows.append(('img', twn, ''))
    label('THE THREE BIGGEST DIFFERENCES FROM THE SUBURB BOARD YOU SAID YES TO: (1) the Strip is a boulevard with a planted median of dead trees, wide paved walks and the resort\'s casino front; '
          '(2) downtown is flat roofs packed tight, two-storey shops and a parking lot, all paved; (3) the wash is a concrete flood channel with a dry sand floor and chain link along it, and the works are '
          'warehouses, a yard of shipping containers in rows and a fence, with the suburb\'s back walls right across the street.')
    label('Numbers (the proof line): colours per 96 px window %s (the pack\'s ground 4,140). Ruler: WORLD\'s, a map cell 0.75 m, a house tile 15.3 cells, every map roof one piece at 1:1. '
          'Pixel size: his 96-px tiles at 1:1, COOK FOUR\'s buildings at 1:1, cars, trees, lamps, containers, boulders and chain link at x2. Light: from above, the pack\'s.'
          % ', '.join('%s %d' % (NAME[n].lower(), facts[n]['colours_per_96px']) for n in ORDER))
    Hs = 0; measured = []
    for kind, a, b in rows:
        if kind == 'text':
            lines = R1.wrap(a, F if b else f, Wd - 2 * pad); measured.append(lines); Hs += len(lines) * (40 if b else 32) + 14
        else:
            lines = R1.wrap(b, fs, Wd - 2 * pad) if b else []; measured.append(lines); Hs += a.height + 12 + 28 * len(lines) + 16
    S_ = Image.new('RGB', (Wd, Hs + pad), (14, 14, 14)); d = ImageDraw.Draw(S_); y = pad // 2
    for (kind, a, b), m_ in zip(rows, measured):
        if kind == 'text':
            for ln in m_: d.text((pad, y), ln, font=F if b else f, fill=(235, 220, 190) if b else (225, 225, 225)); y += 40 if b else 32
            y += 14
        else:
            S_.paste(a, (pad, y)); y += a.height + 12
            for ln in m_: d.text((pad, y), ln, font=fs, fill=(200, 190, 170)); y += 28
            y += 16
    S_.save('records/target/COMBAT2_A_BOARD_FROM_EVERY_DISTRICT_10_18.webp', quality=86, method=4)
    print('sheet', S_.size)

if __name__ == '__main__' and sys.argv[1:2] == ['plans']:
    M = json.load(open(MAPFILE))
    COL = {ROAD: (52, 52, 60), PARK: (70, 68, 64), ZEBRA: (225, 222, 210), LINE: (200, 170, 50), WALK: (186, 182, 170), DRIVE: (150, 140, 120),
           YARD: (138, 120, 92), BLD: (196, 168, 120), WALLR: (230, 60, 60), PROP: (80, 160, 60), LAMPC: (250, 230, 120), ISLAND: (150, 150, 220),
           CHANNEL: (110, 120, 140), SAND: (200, 176, 136), ROCK: (100, 90, 70), MEDIAN: (90, 110, 70), CARGO: (60, 140, 160), CAR: (240, 240, 240)}
    ims = []
    for name in ORDER:
        c = M['cells'][name]; P = plan(c, name)
        im = np.zeros(P['k'].shape + (3,), np.uint8)
        for v, col in COL.items(): im[P['k'] == v] = col
        im = Image.fromarray(im); d = ImageDraw.Draw(im)
        d.rectangle([P['fx0'], P['fy0'], P['fx0'] + P['fw'], P['fy0'] + P['fh']], outline=(255, 0, 255), width=2)
        print(name, 'window', P['fx0'], P['fy0'], 'feature', P['feature_share'], 'open', P['open_share'])
        ims.append(im.resize((im.width * 2, im.height * 2), Image.NEAREST))
    out = Image.new('RGB', (sum(i.width + 10 for i in ims), ims[0].height))
    x = 0
    for i in ims: out.paste(i, (x, 0)); x += i.width + 10
    out.save(sys.argv[2])
    sys.exit(0)

if __name__ == '__main__':
    pick = tuple(a for a in sys.argv[1:] if a in ORDER)
    main(pick or ORDER)                                # a subset is for looking only: it writes no manifest and no sheet
