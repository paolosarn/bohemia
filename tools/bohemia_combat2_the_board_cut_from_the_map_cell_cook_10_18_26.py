#!/usr/bin/env python3
"""THE FIGHT BOARD CUT FROM THE MAP CELL  (COMBAT TWO, [the board at Battle Brothers' size], 10/18)

Rule 109 made the map Battle Brothers' size, and rule 46 says the fight board is cut from the map cell the fight starts
on (no two boards the same). Until now our boards came from a street GRAMMAR (an east-west street every four tile rows,
north-south streets at fixed columns, tools/bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26.py): the
same board whatever the map said was there. This round the board is the cell.

HOW BATTLE BROTHERS DOES IT (rule 41, the library): its tactical map is generated from the world tile the fight starts
on: the tile's terrain picks the ground, and a settlement's own buildings stand on the field when a fight is in or by a
town, so the field you fight on is the place you see on the map, zoomed in. OURS: the same, read literally: the map's
own fine grid of the block (128 x 128 cells a block, the realizer the map draws from) says where the roadway, the lane
paint, the walks, the roofs, the lamps and the yards are, and the board lays his pieces exactly there.

THE INPUT: reference/art_bank/fight_board/COMBAT2_MAP_CELLS_10_18.json, read off the demo by
tools/bohemia_combat2_read_the_map_cell_10_18_26.js: three blocks nearest the party, a STREET (an arterial between
suburbs), a YARD (a suburb block) and a LOT (a commercial block on an arterial), each with its eight neighbours.

THE RULER (measured, and the finding of this round): the map's fine cell is 0.75 m drawn (engine/bohemia_overmap.js,
CELL_M), its lane LANE_W = 2 cells. A lane is 3.6 m on a real road, so one fine cell reads as 1.8 m, and the 128-cell
block as 230 m. The large board is 20 x 15 house tiles of 11.5 m = 230 x 172 m: THE LARGE BOARD IS ONE MAP BLOCK WIDE.
WORLD's one scale number (384 m a block, the 7/6 law's 1:4 compression) disagrees with the map's own drawing by 1.67:
at 384 m a block an arterial would be 66 m of asphalt. The board follows the lane (what the eye reads), and says so.
So one fine cell is 1.25 of COOK TWO's 1.44 m cells; the board samples the fine grid at that step.

WHAT GOES WHERE (nothing drawn here, rule 108; every pixel his pack's or a cook's file at 1:1):
  roadway, parking -> COOK TWO's road cells; the yellow median -> his painted line tiles; the crosswalk -> his zebra;
  walks, drives -> COOK TWO's walk cells with their curb; yards -> one of his soil tiles per board;
  a roof footprint in a suburb -> one of COOK FOUR's five tan ranches, the widest that fits the footprint, no kind twice
  running, its wall foot on the footprint's south edge; a roof footprint on a commercial block -> COOK FOUR's
  warehouse, motel, gas station and corner shop laid along the footprint; a map lamp -> his lamp, listed as a light;
  the map's small solids (shrubs, bins) -> his bush, rocks, junk, dumpster; cars in the parking bays and wrecks on the
  road from his abandoned cars at x2 (round one's rule: the integer scale nearest real size).

THE ANALOG HORROR LINE (rule 20): the same clean police car (his '9. Abandoned cards' #19) that parked in the five
houses' driveway is on all three boards, parked straight and clean where nothing else is: across two bays of the lot,
at the kerb of the street, in a yard drive. It is following you from block to block.

REFERENCE CHECK (the 9/4 standing law): compared to the map itself, which is the point: the near-stop picture of each
block (reference/art_bank/fight_board/COMBAT2_MAP_CELL_*_10_18.webp) and the map's fine plan of it sit beside the board
on the sheet at the same scale; his pack house #30 and the 112-px man at 1:1 are the ruler; the five houses' board
(records/target/COMBAT2_THE_FIVE_HOUSES_ON_THE_BOARD_10_18.webp, his YES) is the look carried over. structure taken:
the map's roads, walks, pads, roofs and lamps where it has them; what changed: the grammar is gone, the cell decides.

[bb the battle map] Battle Brothers: a fight by a town stands in the town's own buildings; a fight in the open stands on
the tile's terrain; the map tile and the battlefield always agree. OURS: the board is the block the map draws.

CANDIDATES ONLY (rule 100): reference/, records/target and the VOTE registry; nothing to slices/, engine/ or the demo.

    node tools/bohemia_combat2_read_the_map_cell_10_18_26.js                       (the map, once)
    python3 tools/bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26.py  (about 4 minutes)
  Seeded end to end: the same three boards from the same map file. The boards are not in git (.gitignore there); the
  manifest, the map file and the sheet are.
"""
import json, os, sys, time
import numpy as np
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26 as R1   # ground, props, the bank
import bohemia_combat2_the_five_houses_on_the_board_cook_10_18_26 as R2       # COOK FOUR's five kinds, their numbers

TW, TH, CELLS, TPX, TPY = R1.TW, R1.TH, R1.CELLS, R1.TPX, R1.TPY
ROAD, ZEBRA, LINE, WALK, DRIVE, YARD = R1.ROAD, R1.ZEBRA, R1.LINE, R1.WALK, R1.DRIVE, R1.YARD
BLD, WALLR, PROP, LAMPC, PARK, ISLAND = 10, 11, 12, 13, 14, 15
OUT = R1.OUT
MAPFILE = os.path.join(OUT, 'COMBAT2_MAP_CELLS_10_18.json')
M_FINE = 1.8                                   # metres a fine cell reads as (a lane, LANE_W = 2 fine cells, is 3.6 m)
K = M_FINE / 1.44                              # COOK TWO's cells a fine cell (1.25)
T_, C_ = 15, 20                                # the large board, house tiles down and across
SEEDS = {'street': 411, 'yard': 422, 'lot': 433}
RESIDENTIAL = {'suburb', 'arterial', 'estate', 'gated', 'trailer', 'apartment', 'town'}
SHOPS = [('warehouse', 'reference/art_bank/settlement/COOK4_WAREHOUSE_STRAIGHT_ROOF.png'),
         ('motel', 'reference/art_bank/settlement/COOK4_MOTEL_STRAIGHT_ROOF.png'),
         ('gas station', 'reference/art_bank/settlement/COOK4_GAS_STATION_STRAIGHT_ROOF.png'),
         ('corner shop', 'reference/art_bank/settlement/COOK4_CORNER_SHOP_STRAIGHT_ROOF.png')]
POLICE = R2.POLICE

# ---------------------------------------------------------------- reading the map's fine grid
def lum(h): return 0.3 * int(h[1:3], 16) + 0.59 * int(h[3:5], 16) + 0.11 * int(h[5:7], 16)

def code(key):
    """one of the map's cell codes (g|s|walk|face|lamp|gArtPool|markPool|artPool) to a board class"""
    if key == 'null': return YARD
    g, s, walk, face, lamp, gpool, mpool, apool = key.split('|')[:8]
    if walk == '0':
        if lamp == '1': return LAMPC
        if apool == 'hroof': return BLD
        return -1                                  # a solid with no roof: its size decides (building, wall or prop)
    if mpool == 'cross': return ZEBRA
    if gpool == 'street':
        if g == '#b09a3a': return LINE             # the median's yellow is the one painted line
        if g in ('#4a4a50', '#4a4a52', '#b3ab97', '#c9c1aa', '#2b2b31'): return PARK   # the pads and their stall lines
        return ROAD
    if gpool == 'side' or g in ('#c8c4b8', '#9b968a'): return WALK
    if g == '#8a8a86': return ROAD                 # the suburb's own loop street (the street ring law)
    if g == '#7c7263': return DRIVE
    if gpool == 'hyard' and lum(g) < 80: return PARK    # the dark paved pads: parking
    return YARD

def label(m):
    """4-connected components (no scipy in the box)"""
    H, W = m.shape; lab = np.zeros((H, W), np.int32); n = 0
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]: continue
        n += 1; st = [(y0, x0)]; lab[y0, x0] = n
        while st:
            y, x = st.pop()
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < H and 0 <= xx < W and m[yy, xx] and not lab[yy, xx]: lab[yy, xx] = n; st.append((yy, xx))
    return lab, n

def classify(c):
    S = c['S']; g = np.array(c['grid']).reshape(S, S)
    k = np.array([code(x) for x in c['codes']])[g]
    lab, n = label(k == -1)
    for i in range(1, n + 1):
        m = lab == i; ys, xs = np.nonzero(m); h, w = np.ptp(ys) + 1, np.ptp(xs) + 1
        k[m] = BLD if m.sum() >= 30 else (WALLR if min(h, w) <= 1 and max(h, w) >= 3 else PROP)
    # a roof footprint smaller than a house (under 100 fine cells, 324 m2) is the lot's planter island: a kerbed walk
    lab, n = label(k == BLD)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() < 100: k[m] = ISLAND
    # and on a commercial block, a patch of yard smaller than that inside the paving is the same island
    F = S // 3
    lab, n = label(k == YARD)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() >= 100: continue
        ys, xs = np.nonzero(m)
        if c['blocks'][min(2, int(ys.mean()) // F) * 3 + min(2, int(xs.mean()) // F)]['district'] not in RESIDENTIAL: k[m] = ISLAND
    return k

# ---------------------------------------------------------------- the plan: the window of the cell the board covers
def plan(c):
    F = c['S'] // 3
    k = classify(c)
    fw, fh = int(round(C_ * CELLS / K)), int(round(T_ * CELLS / K))         # 128 x 96 fine cells
    fx0, fy0 = F + (F - fw) // 2, F + (F - fh) // 2                          # centred on the block
    H, W = T_ * CELLS, C_ * CELLS
    ys = (fy0 + np.arange(H) / K).astype(int); xs = (fx0 + np.arange(W) / K).astype(int)
    raw = k[np.ix_(ys, xs)]
    cls = raw.copy()
    cls[np.isin(raw, (BLD, WALLR, PROP, LAMPC))] = YARD
    cls[raw == PARK] = ROAD
    cls[raw == ISLAND] = WALK
    return dict(F=F, k=k, fx0=fx0, fy0=fy0, fw=fw, fh=fh, H=H, W=W, T=T_, C=C_, cls=cls, raw=raw, fam_of={})

def to_px(P, fx, fy):
    return (fx - P['fx0']) * K * TW, (fy - P['fy0']) * K * TH

def district(c, fx, fy):
    F = c['S'] // 3
    return c['blocks'][min(2, fy // F) * 3 + min(2, fx // F)]['district']

# ---------------------------------------------------------------- the pieces
SHOP_IMG = {}
def shop(name):
    if name not in SHOP_IMG:
        im = Image.open(dict(SHOPS)[name]).convert('RGBA'); a = np.asarray(im)[..., 3]
        cnt = (a > 200).sum(1); foot = int(np.nonzero(cnt >= 0.5 * cnt.max())[0].max())   # the wall foot, measured
        SHOP_IMG[name] = (im, foot)
    return SHOP_IMG[name]

def buildings(c, P, PR, rng, log):
    """every roof footprint of the map inside (or touching) the board, stood on by COOK FOUR's pieces"""
    k = P['k']; lab, n = label(k == BLD)
    last = None
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        fx0, fx1, fy0, fy1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        if fx1 <= P['fx0'] or fx0 >= P['fx0'] + P['fw'] or fy1 <= P['fy0'] or fy0 >= P['fy0'] + P['fh'] + 6: continue
        x0, foot = to_px(P, fx0, fy1); x1, _ = to_px(P, fx1, fy1); top = to_px(P, fx0, fy0)[1]
        wpx = x1 - x0; d = district(c, int(xs.mean()), int(ys.mean()))
        if d in RESIDENTIAL:
            fits = [kd for kd in R2.ORDER if R2.house_img(kd, False).width <= wpx * 1.12 and kd != last]
            if not fits: fits = ['wing'] if last != 'wing' else ['porch']
            fits.sort(key=lambda kd: -R2.house_img(kd, False).width)
            kd = fits[rng.randint(min(2, len(fits)))]; last = kd
            flip = bool(rng.rand() < 0.5); im = R2.house_img(kd, flip)
            hx = int((x0 + x1) / 2 - im.width / 2); f = int(foot) - 10
            sort_foot = f + (im.height - 445 if kd == 'wing' else 0)
            PR.items.append((sort_foot, hx, f - R2.KINDS[kd]['foot'], im, 'house'))
            log.append(dict(piece='ranch ' + kd, flip=flip, district=d, fine=[int(fx0), int(fy0), int(fx1), int(fy1)],
                            px=[hx, f], footprint_m=[round((fx1 - fx0) * M_FINE, 1), round((fy1 - fy0) * M_FINE, 1)]))
        else:
            # a commercial footprint: his pieces laid west to east along its south edge, the biggest that still fits
            x = x0
            while x < x1 - 300:
                left = x1 - x
                cand = [nm for nm, _ in SHOPS if shop(nm)[0].width <= left * 1.05] or ['corner shop']
                nm = cand[0] if left > 2 * shop(cand[0])[0].width or len(cand) == 1 else cand[rng.randint(min(2, len(cand)))]
                im, ft = shop(nm)
                PR.items.append((int(foot) - 10, int(x), int(foot) - 10 - ft, im, 'shop'))
                log.append(dict(piece=nm, district=d, fine=[int(fx0), int(fy0), int(fx1), int(fy1)], px=[int(x), int(foot) - 10],
                                footprint_m=[round((fx1 - fx0) * M_FINE, 1), round((fy1 - fy0) * M_FINE, 1)]))
                x += im.width + 24
            # a footprint deeper than one building: the next row back stands behind it (the back of a block)
            if (fy1 - fy0) * M_FINE > 30:
                x = x0; fb = int(foot - (foot - top) * 0.55)
                while x < x1 - 300:
                    im, ft = shop('warehouse') if x1 - x > 1700 else shop('corner shop')
                    PR.items.append((fb, int(x), fb - ft, im, 'shop'))
                    log.append(dict(piece='warehouse' if im.width > 1000 else 'corner shop', district=d, row='back', px=[int(x), fb]))
                    x += im.width + 24

def dress(c, P, G, img, PR, rng, name):
    raw, H, W = P['raw'], P['H'], P['W']
    def px(y, x): return (x + 0.5) * TW, (y + 1) * TH
    # the map's lamps and small solids, one piece each at the fine cell's middle
    k = P['k']
    for kind_code in (LAMPC, PROP, WALLR, ISLAND):
        lab, n = label(k == kind_code)
        for i in range(1, n + 1):
            ys, xs = np.nonzero(lab == i)
            fx, fy = xs.mean() + 0.5, ys.max() + 1
            if not (P['fx0'] <= fx < P['fx0'] + P['fw'] and P['fy0'] <= fy - 1 < P['fy0'] + P['fh']): continue
            cx, foot = to_px(P, fx, fy); d = district(c, int(fx), int(fy - 1))
            if kind_code == LAMPC:
                PR.put('lamp', R1.LAMPS, cx, foot - 2, cover=False)
                PR.lights.append(dict(kind='lamp', power='grid', from_map=True, x_m=round(cx / R1.PPM, 2), y_m=round(foot / R1.PPM, 2)))
            elif kind_code == ISLAND:
                if rng.rand() < 0.5: PR.put('tree', R1.TREES, cx, foot - TH)
                else: PR.put('bush', R1.BUSH, cx, foot - TH)
            elif kind_code == WALLR:
                for j in range(int(max(np.ptp(xs), 1) * K)): PR.put('wall', R1.WALLS, cx - np.ptp(xs) * K * TW / 2 + j * TW, foot)
            elif d in RESIDENTIAL:
                u = rng.rand()
                if u < 0.35: PR.put('bush', R1.BUSH, cx, foot)
                elif u < 0.6: PR.put('rocks', R1.ROCKS, cx, foot)
                elif u < 0.8: PR.put('tuft', R1.TUFTS, cx, foot)
                elif u < 0.9: PR.put('tree', R1.TREES, cx, foot)
                else: PR.put('junk', R1.JUNK, cx, foot)
            else:
                u = rng.rand()
                if u < 0.3: PR.put('dumpster', R1.DUMPSTER, cx, foot)
                elif u < 0.55: PR.put('junk', R1.JUNK, cx, foot)
                elif u < 0.7: PR.put('pallet', R1.PALLET, cx, foot)
                elif u < 0.85: PR.put('tyres', R1.TYRES, cx, foot)
                else: PR.put('barrel', R1.BARRELS, cx, foot)
    # the parking bays: a car every bay width (2.6 m, two cells) on a row every 5.5 m, most bays empty now
    park = raw == PARK; police = name == 'lot'
    for y in range(2, H, 4):
        for x in range(1, W - 2, 2):
            if not (park[y, x] and park[y, x + 1] and park[y - 1, x]): continue
            if police and x > W // 3:
                cx, foot = px(y, x); PR.put('car', R1.CARS, cx + TW, foot, idx=POLICE); police = False; continue
            if rng.rand() < 0.22:
                cx, foot = px(y, x); PR.put('car', R1.CARS, cx + TW / 2, foot, flip=bool(rng.rand() < 0.5))
    # wrecks on the roadway, spread out
    road = [(y, x) for y in range(H) for x in range(W) if raw[y, x] in (ROAD, LINE)]
    placed = []
    if road:
        for i in rng.permutation(len(road))[:200]:
            if len(placed) >= max(3, len(road) // 900): break
            y, x = road[i]
            if any(abs(y - a) < 10 and abs(x - b) < 10 for a, b in placed): continue
            placed.append((y, x)); cx, foot = px(y, x); PR.put('car', R1.CARS, cx, foot, flip=bool(rng.rand() < 0.5))
        # fire barrels with their scorch, the cracks
        for i in range(3):
            y, x = road[rng.randint(len(road))]
            if y < 2: continue
            cx, foot = px(y, x)
            sc = np.asarray(R1.nearest(R1.bank(R1.SCORCH[0], R1.SCORCH[1][rng.randint(len(R1.SCORCH[1]))]), 2))
            R1.decal_at(img, sc, int(foot) - sc.shape[0] + 30, int(cx) - sc.shape[1] // 2, 0.85, 20)
            PR.put('barrel', R1.BARRELS, cx, foot)
            PR.lights.append(dict(kind='fire barrel', power='fire', x_m=round(cx / R1.PPM, 2), y_m=round(foot / R1.PPM, 2)))
        for i in range(len(road) // 40):
            y, x = road[rng.randint(len(road))]
            src = R1.S.cut_frame(R1.S.pack(R1.S.ROAD, R1.CRACKS[1][rng.randint(5)]), R1.S.ROAD)
            R1.decal_at(img, src, y * TH, x * TW, 0.8, 12)
    # the police car, parked straight and clean: at the kerb of the street, in a drive on the yard board
    if name in ('street', 'yard'):
        want = DRIVE if name == 'yard' else ROAD
        cands = [(y, x) for y in range(H // 3, H) for x in range(W // 4, W) if raw[y, x] == want and (name == 'yard' or raw[y - 1, x] == WALK)]
        if not cands and name == 'yard': cands = [(y, x) for y in range(H // 3, H) for x in range(W // 4, W) if raw[y, x] == ROAD]
        if cands:
            y, x = cands[len(cands) // 2]; cx, foot = px(y, x); PR.put('car', R1.CARS, cx, foot + TH, idx=POLICE)

def terrain(P):
    """per house tile, from the map's own cells under it: blocked (half or more roof), part blocked, flat"""
    raw = P['raw']; t = []
    for r in range(P['T']):
        row = []
        for cc in range(P['C']):
            w = raw[r * CELLS:(r + 1) * CELLS, cc * CELLS:(cc + 1) * CELLS]; b = (w == BLD).mean()
            row.append('blocked' if b >= 0.5 else 'part blocked' if b >= 0.2 else 'flat')
        t.append(row)
    return t

# ---------------------------------------------------------------- the run
def main():
    t0 = time.time()
    M = json.load(open(MAPFILE))
    G = R1.Ground(1018)
    boards, facts, plans = {}, {}, {}
    for name in ('street', 'yard', 'lot'):
        c = M['cells'][name]; seed = SEEDS[name]; rng = np.random.RandomState(seed)
        P = plan(c); plans[name] = P
        fam = R1.YARD_FAMS[4]      # his most muted soil (#18), nearest the map's own yard tan #8a7a5e; one grading for the valley
        P['fam_of'] = {(r, cc): fam for r in range(T_) for cc in range(C_)}       # one grading for the block
        img = R1.lay_ground(P, G, seed)
        PR = R1.Props(P, seed); log = []
        buildings(c, P, PR, rng, log)
        dress(c, P, G, img, PR, rng, name)
        board = R1.composite(img, PR); boards[name] = board
        raw = P['raw']; share = {nm: round(float((raw == v).mean()) * 100, 1) for nm, v in
                                 (('roadway', ROAD), ('parking', PARK), ('walk', WALK), ('drive', DRIVE), ('yard', YARD), ('roof', BLD), ('line', LINE), ('zebra', ZEBRA))}
        facts[name] = dict(map_block=[c['x'], c['y']], district=c['blocks'][4]['district'], neighbours=[b['district'] for b in c['blocks']],
                           fine_window=[P['fx0'], P['fy0'], P['fw'], P['fh']], tiles_across=C_, tiles_down=T_, px=[board.width, board.height],
                           metres=[round(C_ * 11.5), round(T_ * 11.5)], share_percent=share, pieces=log,
                           houses=sum(1 for L in log if L['piece'].startswith('ranch')), shops=sum(1 for L in log if not L['piece'].startswith('ranch')),
                           props=len(PR.items) - len(log), cover=PR.cover, lights=PR.lights, terrain=terrain(P),
                           colours_per_96px=R1.density(np.asarray(board)), elapsed_s=round(time.time() - t0, 1))
        board.save(os.path.join(OUT, 'COMBAT2_CUT_FROM_THE_MAP_%s_10_18.webp' % name.upper()), quality=84, method=4)
        print(name, board.size, 'houses', facts[name]['houses'], 'shops', facts[name]['shops'], 'props', facts[name]['props'],
              share, 'density', facts[name]['colours_per_96px'], round(time.time() - t0), 's', flush=True)
    keys = sorted(R1.USED.items(), key=lambda kv: (-kv[1], kv[0]))
    man = dict(lane='combat 2', row="[the board at Battle Brothers' size]",
               rule='109 the map at Battle Brothers size; 46 the board cut from the map cell; 100 candidates only; 108 nothing drawn',
               source_map=os.path.relpath(MAPFILE), map_seed=M['seed'],
               ruler=dict(fine_cell_m=M_FINE, why='the map lane is LANE_W = 2 fine cells; a lane is 3.6 m', block_m=round(128 * M_FINE),
                          world_block_m=384, disagreement=round(384 / (128 * M_FINE), 2), cook2_cell_m=1.44, cells_per_fine=K,
                          house_tile_m=11.5, large_board_m=[230, 172.5]),
               pieces={('COMBAT2_CUT_FROM_THE_MAP_%s_10_18' % n.upper()): dict(src='COMBAT2_CUT_FROM_THE_MAP_%s_10_18.webp' % n.upper(),
                        keys=[{'pack': k[0], 'idx': k[1]} for k, _ in keys]) for n in boards},
               keys_used=[[k[0], k[1], n, 'UP' if R1.up(*k) else 'never judged'] for k, n in keys],
               boards=facts)
    json.dump(man, open(os.path.join(OUT, 'COMBAT2_CUT_FROM_THE_MAP_10_18.json'), 'w'), indent=1)
    sheet(M, plans, boards, facts)
    print('keys', len(keys), 'total', round(time.time() - t0), 's')

FINECOL = {ISLAND: (150, 150, 120), ROAD: (52, 52, 60), PARK: (70, 68, 64), ZEBRA: (225, 222, 210), LINE: (200, 170, 50), WALK: (186, 182, 170),
           DRIVE: (150, 140, 120), YARD: (138, 120, 92), BLD: (196, 168, 120), WALLR: (90, 90, 80), PROP: (80, 90, 60), LAMPC: (250, 230, 120)}

def fine_picture(P):
    k = P['k']; im = np.zeros(k.shape + (3,), np.uint8)
    for v, col in FINECOL.items(): im[k == v] = col
    F = P['F']
    return Image.fromarray(im[F:2 * F, F:2 * F])

def map_picture(c, w):
    """the map as he sees it at the near stop, cut to the cell's three blocks across, the cell outlined"""
    im = Image.open(c['shot']).convert('RGB'); s = im.width / c['camera']['CVW']
    tw, th = c['camera']['TW'] * s, c['camera']['TH'] * s
    cx, cy = im.width / 2, im.height / 2 + th / 2
    box = (int(cx - 1.5 * tw), int(cy - 1.5 * th), int(cx + 1.5 * tw), int(cy + 1.5 * th))
    cut = im.crop(box); d = ImageDraw.Draw(cut); ox, oy = cx - box[0], cy - box[1]
    d.polygon([(ox, oy - th / 2), (ox + tw / 2, oy), (ox, oy + th / 2), (ox - tw / 2, oy)], outline=(255, 70, 40), width=3)
    return cut.resize((w, int(cut.height * w / cut.width)), Image.LANCZOS)

def sheet(M, plans, boards, facts):
    Wd = 2400; pad = 24; F = R1.font(30); f = R1.font(24); fs = R1.font(20)
    rows = []
    def label(t, big=False): rows.append(('text', t, big))
    label('COMBAT TWO: THE FIGHT BOARD CUT FROM THE MAP. THREE BLOCKS OF THE MAP THE DEMO WALKS TODAY (A STREET, A YARD, A LOT), AND THE BOARD LAID FROM WHAT EACH BLOCK HOLDS. CANDIDATES, NOT IN THE GAME.', True)
    label('Each row: the map as you see it at its closest zoom (left, the block outlined), the map\'s own plan of that block (middle, the box is what the board covers), and the board laid on that box (right) at the SAME SCALE as the plan. The roads, walks, roofs and lamps are where the map has them.')
    cw = (Wd - 2 * pad - 2 * pad) // 3
    for name in ('street', 'yard', 'lot'):
        P = plans[name]; c = M['cells'][name]; fa = facts[name]
        mp = map_picture(c, cw)
        fp = fine_picture(P); sc = cw / fp.width
        fpi = fp.resize((cw, cw), Image.NEAREST); d = ImageDraw.Draw(fpi)
        bx0, by0 = (P['fx0'] - P['F']) * sc, (P['fy0'] - P['F']) * sc
        d.rectangle([bx0, by0, bx0 + P['fw'] * sc, by0 + P['fh'] * sc], outline=(255, 70, 40), width=4)
        b = boards[name]; bw = int(P['fw'] * sc); bi = b.resize((bw, int(b.height * bw / b.width)), Image.LANCZOS)
        h = max(mp.height, fpi.height, bi.height)
        row = Image.new('RGB', (Wd - 2 * pad, h), (14, 14, 14))
        row.paste(mp, (0, 0)); row.paste(fpi, (cw + pad, 0)); row.paste(bi, (2 * (cw + pad), 0))
        sh = fa['share_percent']
        rows.append(('img', row, '%s: map block %d,%d (%s), the board 20 x 15 house tiles = 230 x 172 m. Roadway %s%%, parking %s%%, walks %s%%, roofs %s%%; %d houses, %d shop pieces, %d props.'
                     % (name.upper(), fa['map_block'][0], fa['map_block'][1], fa['district'], sh['roadway'], sh['parking'], sh['walk'], sh['roof'], fa['houses'], fa['shops'], fa['props'])))
    # 1:1 cuts, one per board, centred where the most is happening
    def cut(b, cx, cy, w=1170, h=1000):
        x0 = int(min(max(0, cx - w / 2), b.width - w)); y0 = int(min(max(0, cy - h / 2), b.height - h))
        return b.crop((x0, y0, x0 + w, y0 + h))
    tiles = []
    for name in ('street', 'yard', 'lot'):
        pcs = facts[name]['pieces']
        if pcs: px_ = pcs[len(pcs) // 2]['px']; at = (px_[0] + 400, px_[1] - 150)
        else: at = (boards[name].width / 2, boards[name].height / 2)
        tiles.append(cut(boards[name], *at, w=760, h=760))
    one = Image.new('RGB', (Wd - 2 * pad, 760), (14, 14, 14))
    for i, t in enumerate(tiles): one.paste(t, (i * (760 + pad), 0))
    rows.append(('img', one, 'AT 1:1 (one art pixel to one phone pixel): the street, the yard, the lot'))
    man = Image.open(R1.MAN).convert('RGBA').crop((0, 0, 112, 112))
    tw = Image.new('RGB', (Wd - 2 * pad, 200), (14, 14, 14)); d = ImageDraw.Draw(tw)
    d.text((10, 6), 'THE TWIN: his pack house #30 and the man (the ruler) at 1:1. Every piece on the boards is his pack tile or COOK FOUR\'s file at 1:1.', font=f, fill=(235, 235, 235))
    t = R1.bank('5. Roof tiles', 30); tw.paste(t, (10, 90), t); tw.paste(man, (120, 90 + 96 - 107), man)
    rows.append(('img', tw, ''))
    label('THE THREE BIGGEST DIFFERENCES FROM THE LAST BOARDS: (1) the board is no longer a made-up street pattern, it is the block the map draws, so a fight on the arterial is on the arterial and a fight in the lot is in the lot; (2) the large board is ONE MAP BLOCK wide (230 m), so zooming out from the fight lands on exactly that block; (3) the map\'s own lamps, parking pads and houses stand where the map has them.')
    label('Numbers (the proof line): colours per 96 px window, street %d / yard %d / lot %d (the pack\'s ground 4,140). Ruler: a map lane is 2 fine cells, so a fine cell is 1.8 m and a block 230 m (the world file says 384 m; the map\'s drawing disagrees by %.2f, said in the record). Pixel size: his 96-px tiles at 1:1, cars and lamps at x2. Light: from above, the pack\'s.'
          % (facts['street']['colours_per_96px'], facts['yard']['colours_per_96px'], facts['lot']['colours_per_96px'], 384 / (128 * M_FINE)))
    Hs = 0; measured = []
    for kind, a, b in rows:
        if kind == 'text':
            lines = R1.wrap(a, F if b else f, Wd - 2 * pad); measured.append(lines); Hs += len(lines) * (40 if b else 32) + 14
        else:
            lines = R1.wrap(b, fs, Wd - 2 * pad) if b else []; measured.append(lines); Hs += a.height + 12 + 28 * len(lines) + 16
    S_ = Image.new('RGB', (Wd, Hs + pad), (14, 14, 14)); d = ImageDraw.Draw(S_); y = pad // 2
    for (kind, a, b), m in zip(rows, measured):
        if kind == 'text':
            for ln in m: d.text((pad, y), ln, font=F if b else f, fill=(235, 220, 190) if b else (225, 225, 225)); y += 40 if b else 32
            y += 14
        else:
            S_.paste(a, (pad, y)); y += a.height + 12
            for ln in m: d.text((pad, y), ln, font=fs, fill=(200, 190, 170)); y += 28
            y += 16
    S_.save('records/target/COMBAT2_THE_BOARD_CUT_FROM_THE_MAP_10_18.webp', quality=86, method=4)
    print('sheet', S_.size)

if __name__ == '__main__':
    main()
