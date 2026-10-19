#!/usr/bin/env python3
"""THE CASINO BOARD  (COMBAT TWO, [the casino board], 10/19; rule 52, rule 117, rule 120)

His YES on the casino floor (combat2-the-casino-floor-10-9, 'Definitely placeholder tiles, but looking good') and his YES
on COOK FOUR's casino (cook4-the-casino-10-18). The row: the casino board still wears placeholder tiles (a carpet drawn
rectangle by rectangle) while the casino itself now exists; rebuild it from COOK FOUR's casino and its floor, the slot
rows and the cashier's cage as blockers, one look (rule 117), from the game's camera. Rule 120 (Paolo 10/18, 'the guns
were supposed to be the main way this is gonna be solved'): the board gives shooters lines and cover, and the tool
measures both on the house-tile grid before it saves.

THE BUILDING IS COOK FOUR'S. Their casino is the valley's first kind (El Rancho Vegas, 1941; the Last Frontier, 1942): a
long ranch hall with not one window, glass doors under a marquee, the middle pair standing open, two steel fire exits.
The board is the inside of that hall at a Strip floor's size (a fight needs house tiles; the middle board is 161 x 115 m,
the size of the MGM Grand's gaming floor, 15,900 m2, the valley's biggest). The north wall is COOK FOUR's hall, laid by
their own hall() (their six glass leaves, their open pair, their fire exits, their render), seen from inside: the camera
sees south faces, so the street wall's inner face is the one wall the board shows. From inside, the open pair is not
dark: it is the street, COOK TWO's sidewalk cell in daylight where COOK FOUR painted the black room.

THE FLOOR, FROM THE VALLEY (his packs, nothing drawn, rule 108):
  the gaming floor  THE BARE SLAB: COOK TWO's concrete cell, from the street he said YES to (cook2-one-real-street-10-18):
                    a dead casino's carpet rots under a leaking roof and is pulled up, so the floor is the concrete under it.
                    MEASURED AND LEFT OUT: his orange Saltillo tile ('Floor, walls' #10) and his tan parquet (#3) read 89 and
                    90 percent bright orange on DIRECTION's floor bar (B6 holds 0.5; his 'never bright medieval orange');
                    his red #7 mixed in read as camouflage; the slab passes (the bar's own YES control is that street);
  the racetrack     his five pale pavers ('Floor tiles (1)' #1 to #4 and #6, UP; the others carry pink flowers), mixed: the hard aisle every
                    casino loops round its floor, a ribbon 4.8 m wide down the middle of an aisle tile (real aisles run 3 to 5 m;
                    the rest of the aisle tile is the gaming floor's tile, open, nothing standing);
  the lounge        the same slab; the cage his grey flagstone ('Floor tiles and wall tiles' #5,
                    UP); inside the doors the stone runs on as the foyer, and before the cage's counter as its apron.
  Each laid with COOK FOUR's own lay() (running bond), his tile's top face only (its rim and south face cut).
  THE HOLE: his bank sells no carpet. A casino's gaming floor is carpet; the bare slab is the honest floor of a dead
  one until a cook makes a carpet from the packs.

THE PIECES (his tiles whole, at the integer scale nearest real size):
  slot machine  'Streets props and urban' #47, a cabinet with a screen and a button deck, 1x (1.7 m; a slot is 1.9 m);
                'Machines and tech' #13, the amber video-poker console, 1x. A BANK IS ONE MODEL (casinos group machines by
                model): three rows a house tile, 3.3 m apart, eight or six a row, gaps where machines were pulled for their batteries
                (batteries are the money, 9/4); a few banks pulled whole (the slab, a fire drum in one);
  the cage      his counter 'Tables, chairs and sitting' #34, #36 (the till) every fourth, his iron grate '19.
                Miscellaneous (1)' #46 behind every counter as the teller bars, his column at each end;
  card tables   'Furniture and fixtures' #7 and #8 (UP), his dark wood tables, six a tile in the pit (his bright pine round
                table #1 read orange on DIRECTION's floor bar); #9 as the cage's two counting tables;
  the bar       'Tables, chairs and sitting' #37 and #38, the lounge's counter with its stools;
  columns       'Structures and columns' #1 at x2 (3.4 m): a 161 m hall cannot span without them; one at the corner of
                every bank of tiles;
  one fire      '18. Light sources and fire barrels' #24, a drum where people keep a fire (rule: one a board).

THE ONE-LOOK RULES AT THE PLACING (rule 117; round one-look's rules): no words (his counters and machines carry none);
nothing without a fight fact (every piece is cover, low cover or a column); no specks (counted at the opening frame);
a rest area (the lounge's parquet, the racetrack's stone); light spaced (the door, one fire, three machines).

THE FIGHT READS IT (rule 120, measured below on the house-tile grid, house tile 11.5 m; reach: pistol 1, rifle 2,
scope 3, height +1): a tile of slot banks is HIGH COVER (rows of 1.7 m machines: you stand in it covered and nobody sees
through it); the pit and the bar are LOW COVER; the cage is HEIGHT behind a counter and bars; the aisles are open. The
measures: lanes of fire across the floor, the share of tiles with cover within one step, the share of covered tiles
with a shot out at rifle or scope reach, the longest clear line, what the cage overlooks. The same measures on the old
board's own cover list, so the card says what changed.

THE ANALOG HORROR LINE (rule 20): three machines on a scavenged battery still play their attract loop to nobody, and the
doors that were built never to lock stand open on the street (El Cortez had no locks when the state shut it in 2020).

REFERENCE CHECK (the 9/4 standing law): compared to the old casino board (his YES, the placeholder carpet; its card at
1:1 on the sheet), COOK FOUR's casino front at 1:1 (his YES), his pack tiles as bought (the twin row), the 112-px man (the
ruler). structure taken: the old board's slot rows, the cage as the hill, the dark lit by machines and fires; COOK FOUR's
hall, doors and render; what changed: every pixel is his pack's or a cook's, the floor is tile, the board is the routine
fight's size (rule 79), the north wall is the casino's own.
REUSE CHECK: COOK FOUR's hall(), fam.wall(), lay() and shade_top() (imported, not copied); COOK TWO's sidewalk cell
through round one's Ground; round one's bank, Props, composite and density; round one-look's opening frame, eye's count
and planted control. This file adds no pixel of its own; its only paint is the wall's contact shade (rule 114a).

[bb the battle map] Battle Brothers fights in ruins and camps whose walls, tents and debris are the cover, a raised spot
the hill, and the two lines start apart across open ground; it never fights indoors. OURS: the casino floor, cover in
rows, the cage as the hill, the lines start across the floor.

CANDIDATES ONLY (rule 100): reference/, records/target and the VOTE registry; nothing to slices/, engine/ or the demo.

    python3 tools/bohemia_combat2_the_casino_board_cook_10_19_26.py          (about 3 minutes)
  Seeded end to end. The board is not in git (.gitignore there); the manifest, the crop and the sheet are.
"""
import json, os, sys, time
import numpy as np
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_cook2_stretch_the_pack_47_10_13_26 as B                        # COOK TWO's 47 (the cell's neighbour code)
import bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26 as R1   # ground, props, the bank
import bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26 as R4       # the one-look counter
R1.Props.put, R1.decal_at = R4._PUT, R4._DECAL                                # R4 patches these on import; this tool counts its own
import bohemia_cook4_the_casino as C4                                         # COOK FOUR's casino
from bohemia_cook4_the_roof_measured import lay, shade_top
from bohemia_cook4_one_house import outline

TW, TH, TPX, TPY, PPM, OUT = R1.TW, R1.TH, R1.TPX, R1.TPY, R1.PPM, R1.OUT
T, C = R1.SIZES['middle']                      # the middle board, 10 x 14 house tiles (rule 79: the routine fight)
TILE_M = 11.5
SEED = 619
STEM = 'COMBAT2_THE_CASINO_BOARD_10_19'
SHEET = 'records/target/%s.webp' % STEM
SPRITE = 'reference/art_bank/fight_board/sprites/%s_1TO1.png' % STEM
OLD_CARD = 'slices/vote/COMBAT2_THE_CASINO_FLOOR_10_9.png'          # the board he said YES to, as its card showed it
OLD_JSON = 'slices/fight_ground/fight_ground.json'

AISLE, SLOTS, CLEARED, PIT, CAGE, BAR, LOUNGE = 'aisle', 'slots', 'cleared', 'pit', 'cage', 'bar', 'lounge'
STONE = ('Floor tiles (1)', [(1, 1), (2, 1), (3, 1), (4, 1), (6, 1)])   # the racetrack: his pale pavers mixed (no repeat); #0, #5, #7 carry pink flowers
SLAB = 'slab'                                                       # the gaming floor: the bare slab, COOK TWO's concrete cell
GREY = ('Floor tiles and wall tiles', [(5, 1)])                     # the cage: his grey flagstone (#6 beside it read as a patchwork)
FLOOR_OF = {AISLE: STONE, SLOTS: SLAB, CLEARED: SLAB, PIT: SLAB, CAGE: GREY, BAR: SLAB, LOUNGE: SLAB}
SLOT_MODELS = {'cyan': ('Streets props and urban', [47], 8), 'amber': ('Machines and tech', [13], 6)}
COUNTER = ('Tables, chairs and sitting', [34])
TILL = ('Tables, chairs and sitting', [36])
GRATE = ('19. Miscellaneous (1)', [46])
TABLE = ('Furniture and fixtures', [7, 8])                          # his darker wood tables (UP): the bright pine ones read orange on the bar
COUNT = ('Furniture and fixtures', [9])
BARC = ('Tables, chairs and sitting', [37, 38])
COLUMN = ('Structures and columns', [1])
DRUM = ('18. Light sources and fire barrels', [24])
SCORCH = ('8. Burned Ground and fire marks', [4])
R1.KIND.update({
    'slot':    dict(k=1, cover='cover', real='a slot machine is 1.9 m tall, 0.7 m wide; his cabinet 96 px = 1.7 m at 1x'),
    'counter': dict(k=1, cover='cover', real="a cashier's counter is 1.1 m; his counter at 1x, his grate behind it to 2.4 m"),
    'grate':   dict(k=1, cover='cover', real='teller bars over the counter: his grate 96 x 80 px = 1.7 x 1.4 m at 1x'),
    'table':   dict(k=1, cover='low',   real='a card table is 0.75 m tall, 1.5 to 2.7 m across; his table 1.7 m at 1x'),
    'bar':     dict(k=1, cover='low',   real='a bar counter is 1.1 m; his counter with its stools at 1x'),
    'column':  dict(k=2, cover='obstacle', real='a casino column is 1 m thick, 5 m tall; his column x2 = 1 m by 3.4 m (no taller one exists)'),
    'drum':    dict(k=1, cover='low',   real='a drum is 0.9 m; 1x is 1.6 m, no integer under 1'),
})

# ---------------------------------------------------------------- the plan: what each house tile is
COL_GROUPS = [(0, 1), (3, 5), (7, 9), (11, 13)]     # bank columns; aisles at 2 (the spine from the door), 6 and 10
ROW_BANDS = [(2, 3), (5, 6), (8, 9)]                # bank rows; the racetrack at 1, the cross aisle at 4 and 7; row 0 inside the doors
DOOR_COL = 2

def plan(seed):
    rng = np.random.RandomState(seed)
    g = [[AISLE] * C for _ in range(T)]
    model = {}
    for bi, (r0, r1) in enumerate(ROW_BANDS):
        for gi, (c0, c1) in enumerate(COL_GROUPS):
            kind = SLOTS
            if gi == 0 and bi == 1: kind = PIT
            if gi == 0 and bi == 2: kind = LOUNGE
            m = ('cyan', 'amber')[rng.randint(2)] if kind == SLOTS else None
            for r in range(r0, r1 + 1):
                for c in range(c0, c1 + 1):
                    g[r][c] = kind
                    if m: model[(r, c)] = m
    for c in range(11, 14):                          # the cashier's cage against the street wall, east of the doors
        g[0][c] = CAGE; g[1][c] = CAGE; g[2][c] = AISLE  # and the queue's room in front of its counter
        model.pop((2, c), None)
    g[8][0] = g[8][1] = BAR                          # the lounge's bar on its north row
    slots = [(r, c) for r in range(T) for c in range(C) if g[r][c] == SLOTS]
    cleared = [slots[i] for i in rng.choice(len(slots), 3, replace=False)]      # three banks pulled whole
    for r, c in cleared: g[r][c] = CLEARED; model.pop((r, c), None)
    return dict(g=g, model=model, cleared=cleared, rng=rng)

# ---------------------------------------------------------------- the floor and the wall
def top_face(name, idx):
    """his floor tile's top face only: the 4 px rim and the 15 px south face cut, so a floor is not a wall of blocks"""
    t = R1.bank(name, idx); return t.crop((4, 4, t.width - 4, t.height - 15))

def lay_mixed(fam, w, h, rng):
    """COOK FOUR's lay() (the running bond), one pick per stone from the family's weighted tiles"""
    name, picks = fam
    faces = [top_face(name, i) for i, _ in picks]; wts = np.array([n for _, n in picks], float); wts /= wts.sum()
    if len(faces) == 1: return lay(faces[0], w, h)
    tw, th = min(f.width for f in faces), min(f.height for f in faces)
    faces = [f.crop(((f.width - tw) // 2, (f.height - th) // 2, (f.width - tw) // 2 + tw, (f.height - th) // 2 + th)) for f in faces]   # cut, never scaled
    out = Image.new('RGBA', (w, h)); y = 0; r = 0
    while y < h:
        x = -(tw // 2) * (r % 2)
        while x < w:
            out.alpha_composite(faces[rng.choice(len(faces), p=wts)], (x, y)); x += tw
        y += th; r += 1
    return out

AISLE_ROWS, AISLE_COLS, RIBBON = (1, 4, 7), (2, 6, 10), 0.42      # the racetrack is a ribbon 4.8 m wide down the aisle tile's middle

def stone_rects(r, c):
    """where an aisle tile is stone: inside the doors and the cage's queue all of it; elsewhere the ribbon along the aisle
    (east-west on an aisle row, north-south on an aisle column, a cross where they meet), the rest the gaming floor's tile"""
    x0, y0, x1, y1 = c * TPX, r * TPY, (c + 1) * TPX - 1, (r + 1) * TPY - 1
    if r == 0: return [(x0, y0, x1, y1)]
    out = []; hw, hh = RIBBON * TPX / 2, RIBBON * TPY / 2
    if r == 1 or (r == 2 and c >= 11): out.append((x0, y0, x1, int(y0 + RIBBON * TPY)))     # the foyer's stone runs on; the cage's apron
    elif r in AISLE_ROWS: out.append((x0, int(y0 + TPY / 2 - hh), x1, int(y0 + TPY / 2 + hh)))
    if c in AISLE_COLS: out.append((int(x0 + TPX / 2 - hw), y0, int(x0 + TPX / 2 + hw), y1))
    return out or [(x0, y0, x1, y1)]

def slab_layer(G, W_, H_):
    """COOK TWO's concrete cell (their recipe through round one's Ground, walk on every side: the plain slab, his
    cracks), one of its variants a cell, laid on their 82 x 81 grid"""
    case = B.blob(tuple(1 for _ in B.NB)); a = np.zeros((H_, W_, 3), np.uint8)
    for y in range(0, H_, TH):
        for x in range(0, W_, TW):
            c = G.cell(case, R1.WALK); h, w = min(TH, H_ - y), min(TW, W_ - x); a[y:y + h, x:x + w] = c[:h, :w]
    return Image.fromarray(a)

def lay_floor(P, W_, H_, G):
    img = Image.new('RGB', (W_, H_))
    rng = np.random.RandomState(SEED + 3)
    for fam in (SLAB, STONE, GREY):
        m = np.zeros((H_, W_), np.uint8)                                   # where this floor goes: a mask, not a pixel of the art
        for r in range(T):
            for c in range(C):
                k = P['g'][r][c]
                whole = (c * TPX, r * TPY, (c + 1) * TPX - 1, (r + 1) * TPY - 1)
                rects = [whole] if (k == AISLE and fam is SLAB) or (k != AISLE and FLOOR_OF[k] is fam) else \
                        stone_rects(r, c) if (k == AISLE and fam is STONE) else []
                for x0, y0, x1, y1 in rects: m[y0:y1 + 1, x0:x1 + 1] = 255
        if not m.any(): continue
        mask = Image.fromarray(m)
        layer = slab_layer(G, W_, H_) if fam is SLAB else lay_mixed(fam, W_, H_, rng).convert('RGB')
        img.paste(layer, (0, 0), mask); del layer
    return img

def north_wall(W_, G):
    """the street wall seen from inside: COOK FOUR's render laid the whole width with their own wall(), their hall()
    (the six glass leaves, the open pair, the two fire exits) set into it on the render's own period, so no seam; the
    open pair holds the street in daylight (COOK TWO's sidewalk cell), where from outside COOK FOUR painted the dark"""
    hall, _, open_x = C4.hall()
    period = C4.A(C4.fam.PLASTER['flat']).width - 14                       # wall() cuts 7 px off each side of the tile
    lw = C4.A(C4.W(0)).width; pair = 2 * (lw - 2) + 2
    X = int(round(((DOOR_COL + 0.5) * TPX - open_x - pair / 2) / period)) * period
    wall = shade_top(C4.fam.wall('flat', W_, C4.HALL_H), n=24, a=140)
    wall.alpha_composite(hall, (X, 0))
    case = B.blob(tuple(1 for _ in B.NB))                                  # a sidewalk cell with walk all round
    street = Image.fromarray(np.vstack([np.hstack([G.cell(case, R1.WALK)] * 2)] * 3)).convert('RGBA')
    dx, dy = X + open_x + 14, C4.HALL_H - C4.DOOR_H + 2                     # inside COOK FOUR's jamb shade, under their head
    wall.alpha_composite(street.crop((0, 0, pair - 16, C4.DOOR_H - 6)), (dx, dy))
    return outline(wall), dict(door_x=X + open_x + pair / 2, door_w=pair, hall_x=X, exits=[X + e for e in C4.EXITS])

def contact_shade(img, y, n=14, k=0.55):
    """the contact line under the wall (rule 114a): the floor darkened toward the wall foot, his colours kept"""
    a = np.asarray(img).copy(); strip = a[y:y + n].astype(float)
    for i in range(n): strip[i] *= k + (1 - k) * i / n
    a[y:y + n] = strip.clip(0, 255).astype(np.uint8)
    return Image.fromarray(a)

# ---------------------------------------------------------------- the pieces
def stand(PR, kind, fam, cx, foot, idx=None, flip=False, cover=False, why=''):
    im = PR.put(kind, fam, cx, foot, idx=idx, flip=flip, cover=cover)
    PR.rec.append(dict(n=len(PR.items) - 1, kind=kind, cx=float(cx), foot=float(foot), why=why))
    return im

def dress(P, PR, img, wallinfo):
    g, rng = P['g'], P['rng']; log = []
    machines = []
    for (r, c), m in sorted(P['model'].items()):
        name, ids, n = SLOT_MODELS[m]
        w = R1.bank(name, ids[0]).width; R1.USED[(name, ids[0])] -= 1        # a measure, not a use
        for k, fy in enumerate((0.36, 0.65, 0.94)):                      # three rows a tile, 3.3 m apart (a casino runs 2.5 to 3.5)
            foot = r * TPY + fy * TPY
            run = n * (w - 2); x0 = c * TPX + (TPX - run) / 2 + rng.randint(-24, 25)
            gap = set(rng.choice(n, rng.randint(1, 3), replace=False)) if rng.rand() < 0.3 else set()
            got = 0
            for i in range(n):
                if i in gap: continue
                cx = x0 + i * (w - 2) + w / 2
                stand(PR, 'slot', (name, ids), cx, foot, idx=ids[0], why='a %s bank' % m); machines.append((cx, foot)); got += 1
            PR.cover.append(dict(kind='slot bank', fact='cover', x_m=round((x0 + run / 2) / PPM, 2), y_m=round(foot / PPM, 2),
                                 w_m=round(run / PPM, 2), h_m=1.7, machines=got, model=m, tile=[r, c]))
        log.append(dict(tile=[r, c], piece='slot banks', model=m))
    # the cashier's cage: counters along the foot of row 1, a till every fourth, his grate behind each, a column each end
    foot = 2 * TPY - 70; x = 11 * TPX + 70; k = 0; xs = []
    while x + 96 <= C * TPX - 70:
        stand(PR, 'grate', GRATE, x + 48, foot - 34, idx=46, why='the teller bars')
        stand(PR, 'counter', TILL if k % 4 == 1 else COUNTER, x + 48, foot, why="the cage's counter"); xs.append(x); x += 94; k += 1
    for cx in (xs[0] - 20, xs[-1] + 96 + 20): stand(PR, 'column', COLUMN, cx, foot + 6, idx=1, why="the cage's corner post")
    for fx in (11.7, 12.9):                                                # inside: the counting tables, emptied (low cover on the hill)
        stand(PR, 'table', COUNT, fx * TPX, 1.45 * TPY, idx=9, why='a counting table in the cage')
        PR.cover.append(dict(kind='counting table', fact='low', x_m=round(fx * TPX / PPM, 2), y_m=round(1.45 * TPY / PPM, 2), w_m=1.56, h_m=0.75, tile=[1, int(fx)]))
    PR.cover.append(dict(kind="the cashier's cage", fact='cover', x_m=round((xs[0] + xs[-1] + 96) / 2 / PPM, 2), y_m=round(foot / PPM, 2),
                         w_m=round((xs[-1] + 96 - xs[0]) / PPM, 2), h_m=2.4, counters=len(xs), tile=[1, 11]))
    log.append(dict(tile=[1, 11], piece="the cashier's cage", counters=len(xs)))
    # the pit: six round tables a tile
    for r in range(T):
        for c in range(C):
            if g[r][c] != PIT: continue
            for fy in (0.42, 0.88):
                for fx in (1 / 6, 3 / 6, 5 / 6):
                    cx = c * TPX + fx * TPX + rng.randint(-30, 31); ft = r * TPY + fy * TPY + rng.randint(-20, 21)
                    stand(PR, 'table', TABLE, cx, ft, idx=TABLE[1][int(fx * 6) // 2 % 2], why='a card table')   # never flipped: one light, upper left
                    PR.cover.append(dict(kind='card table', fact='low', x_m=round(cx / PPM, 2), y_m=round(ft / PPM, 2), w_m=1.56, h_m=0.75, tile=[r, c]))
    # the bar: the lounge's counter run along row 8, two tiles
    ft = 8 * TPY + 0.62 * TPY; x = 90; bx = []
    while x + 96 <= 2 * TPX - 90:
        stand(PR, 'bar', BARC, x + 48, ft, idx=(37, 38)[len(bx) % 2], why='the lounge bar'); bx.append(x); x += 94
    PR.cover.append(dict(kind='the bar', fact='low', x_m=round((bx[0] + bx[-1] + 96) / 2 / PPM, 2), y_m=round(ft / PPM, 2),
                         w_m=round((bx[-1] + 96 - bx[0]) / PPM, 2), h_m=1.1, tile=[8, 0]))
    # the columns: one at the north-west corner of every block of bank tiles, half a metre out in the aisle
    for (r0, _), (c0, _) in [(b, gr) for b in ROW_BANDS for gr in COL_GROUPS]:
        if c0 == 0 or (c0 == 11 and r0 == 2): continue          # the lounge has none; the cage's own post stands there
        cx, ft = c0 * TPX - 0.6 * PPM, r0 * TPY - 0.4 * PPM
        stand(PR, 'column', COLUMN, cx, ft, idx=1, why='a structural column')
        PR.cover.append(dict(kind='column', fact='obstacle', x_m=round(cx / PPM, 2), y_m=round(ft / PPM, 2), w_m=1.0, h_m=3.4))
    # one fire, in a bank pulled whole, and its scorch under it
    r, c = P['cleared'][0]; cx, ft = (c + 0.5) * TPX, (r + 0.62) * TPY
    sc = np.asarray(R1.bank(SCORCH[0], SCORCH[1][0]))
    R1.decal_at(img, sc, int(ft - sc.shape[0] * 0.7), int(cx - sc.shape[1] / 2), strength=0.7)
    stand(PR, 'drum', DRUM, cx, ft, idx=24, why='the one fire, people keep it')
    PR.cover.append(dict(kind='fire drum', fact='low', x_m=round(cx / PPM, 2), y_m=round(ft / PPM, 2), w_m=0.9, h_m=0.9, tile=[r, c]))
    # the lights: the door, the fire, three machines on a battery (the analog horror line)
    lit = [machines[i] for i in sorted(rng.choice(len(machines), 3, replace=False))]
    PR.lights = [dict(kind='daylight', why='the open pair of doors, the street', x_m=round(wallinfo['door_x'] / PPM, 2), y_m=round(C4.HALL_H / PPM, 2),
                      live=True, radius_m=12.0, circuit='sun'),
                 dict(kind='fire', why='the one drum', x_m=round(cx / PPM, 2), y_m=round(ft / PPM, 2), live=True, radius_m=6.0, circuit='fire')] + \
                [dict(kind='attract loop', why='a slot machine on a scavenged battery playing to nobody', x_m=round(x_ / PPM, 2), y_m=round(f_ / PPM, 2),
                      live=True, radius_m=3.0, circuit='battery') for x_, f_ in lit]
    return log

# ---------------------------------------------------------------- the fight's read (rule 120), on the house-tile grid
SIGHT_BLOCK = {SLOTS}
COVER_OF = {SLOTS: 'high', PIT: 'low', BAR: 'low'}

def terrain(g):
    t = [['flat'] * C for _ in range(T)]
    for r in range(T):
        for c in range(C):
            if g[r][c] == SLOTS: t[r][c] = 'rough'          # you walk the slot aisles, never straight through a bank
            elif g[r][c] == CAGE: t[r][c] = 'height'
            elif g[r][c] == PIT: t[r][c] = 'rough'
    return t

def cover_grid(g):
    cv = [[COVER_OF.get(g[r][c]) for c in range(C)] for r in range(T)]
    for c in range(11, 14): cv[1][c] = 'high'               # the cage's counter row: behind the counter and the bars
    return cv

def line(a, b, n=None):
    (r0, c0), (r1, c1) = a, b
    n = n or 4 * max(abs(r1 - r0), abs(c1 - c0)) + 1
    seen = []
    for i in range(n + 1):
        t = i / n; p = (int(round(r0 + (r1 - r0) * t)), int(round(c0 + (c1 - c0) * t)))
        if p not in seen: seen.append(p)
    return seen

def sees(blk, a, b):
    return all(not blk[r][c] for r, c in line(a, b)[1:-1])

def read(g, cv, party, enemy, blk=None, height=None):
    """the measures: rifle 2, scope 3, height +1 (rule 9/22 and the terrain key)"""
    Tn, Cn = len(g), len(g[0])
    blk = blk or [[g[r][c] in SIGHT_BLOCK for c in range(Cn)] for r in range(Tn)]
    height = height or [[g[r][c] == CAGE for c in range(Cn)] for r in range(Tn)]
    tiles = [(r, c) for r in range(Tn) for c in range(Cn)]
    def shots(a, reach):
        return [b for b in tiles if 2 <= max(abs(a[0] - b[0]), abs(a[1] - b[1])) <= reach and sees(blk, a, b)]
    near = sum(1 for (r, c) in tiles if any(cv[rr][cc] for rr in range(max(0, r - 1), min(Tn, r + 2)) for cc in range(max(0, c - 1), min(Cn, c + 2))))
    covered = [(r, c) for (r, c) in tiles if cv[r][c]]
    out_ok = sum(1 for a in covered if shots(a, 3 + height[a[0]][a[1]]))
    lanes_ew = [r for r in range(Tn) if not any(blk[r][c] for c in range(Cn))]
    lanes_ns = [c for c in range(Cn) if not any(blk[r][c] for r in range(Tn))]
    def run_len(cells):
        best = cur = 0
        for b in cells: cur = 0 if b else cur + 1; best = max(best, cur)
        return best
    longest = max([run_len(row) for row in blk] + [run_len([blk[r][c] for r in range(Tn)]) for c in range(Cn)])
    seen_by_hill = set()
    for a in tiles:
        if height[a[0]][a[1]]:
            for b in shots(a, 4): seen_by_hill.add(b)
    duel = sum(1 for a in party if any(sees(blk, a, b) for b in enemy))
    gapd = min(max(abs(a[0] - b[0]), abs(a[1] - b[1])) for a in party for b in enemy)
    return dict(tiles=len(tiles), cover_within_one_step=round(near / len(tiles), 3), covered_tiles=len(covered),
                covered_with_a_shot_out=round(out_ok / max(1, len(covered)), 3),
                lanes_across_west_to_east=lanes_ew, lanes_across_north_to_south=lanes_ns, longest_clear_line_tiles=longest,
                tiles_the_hill_overlooks=len(seen_by_hill), party_tiles_that_see_the_enemy_start=duel, lines_start_apart_tiles=gapd)

PARTY = [(r, c) for r in (0, 1) for c in (0, 1, 2, 3)]                     # inside the open doors
ENEMY = [(r, c) for r in (3, 4) for c in (11, 12, 13)] + [(0, 11), (0, 12), (0, 13), (1, 11), (1, 12), (1, 13)]   # the cage and the floor in front of it

def old_read():
    """the same measures on the board he said YES to: its 20 x 15 tiles of 12 m, a tile with a slot bank in it is high
    cover, a card table low, the cage's two HEIGHT tiles; party and enemy on its own start rows"""
    d = json.load(open(OLD_JSON)); b = d['boards']['casino']; tm = d['tile_metres']; Cn, Tn = d['board_tiles']
    g = [['aisle'] * Cn for _ in range(Tn)]; cv = [[None] * Cn for _ in range(Tn)]
    for p in b['cover']:
        r, c = int(p['y_m'] // tm), int(p['x_m'] // tm)
        if 0 <= r < Tn and 0 <= c < Cn:
            if p['piece'] == 'slot_bank': g[r][c] = SLOTS; cv[r][c] = 'high'
            elif cv[r][c] is None: cv[r][c] = 'low'
    height = [[b['terrain'][r][c] == 'height' for c in range(Cn)] for r in range(Tn)]
    rows = d['start_rows']
    party = [(rows[0], c) for c in range(Cn)]; enemy = [(rows[1], c) for c in range(Cn)]
    res = read(g, cv, party, enemy, height=height)
    res['note'] = 'its own 20 x 15 board of 12 m tiles, lines on its start rows %s; a slot-bank tile is high cover' % rows
    return res

# ---------------------------------------------------------------- the run
def main():
    t0 = time.time(); os.makedirs(OUT, exist_ok=True); os.makedirs(os.path.dirname(SPRITE), exist_ok=True)
    P = plan(SEED)
    W_, H_ = C * TPX, T * TPY
    G = R1.Ground(1019); G.VAR = 12                     # twelve of COOK TWO's slab cells, not three: a hall of one slab repeats
    img = lay_floor(P, W_, H_, G)
    wall, wallinfo = north_wall(W_, G)
    img.paste(wall, (0, 0), wall)
    img = contact_shade(img, C4.HALL_H)
    a = np.asarray(img).copy()
    PR = R1.Props(dict(T=T, C=C), SEED); PR.rec = []
    log = dress(P, PR, a, wallinfo)
    bare = Image.fromarray(a)
    board = R1.composite(a, PR)
    print('laid', board.size, 'standing', len(PR.rec), round(time.time() - t0), 's', flush=True)
    # the one-look counts at the opening frame (round one-look's counter)
    fb, fa = R4.opening_frame(board), R4.opening_frame(bare)
    eye = R4.spots(fb, fa)
    n_, got = R4.planted_control(np.asarray(bare))
    sc = R4.PHONE_W / board.width
    specks = sum(1 for r in PR.rec if max(R4.alpha_box(PR.items[r['n']][3])) * sc < R4.SPECK_PX)
    kinds = {}
    for r in PR.rec: kinds[r['kind']] = kinds.get(r['kind'], 0) + 1
    no_fact = sum(1 for r in PR.rec if R1.KIND[r['kind']]['cover'] is None)
    g = P['g']; cv = cover_grid(g)
    new = read(g, cv, PARTY, ENEMY); old = old_read()
    print('new', new); print('old', old)
    assert no_fact == 0 and eye['spots'] > 0, (no_fact, eye)
    facts = dict(tiles_across=C, tiles_down=T, px=[board.width, board.height], metres=[round(C * TILE_M, 1), round(T * TILE_M, 1)],
                 plan=g, terrain=terrain(g), cover_by_tile=cv, start=dict(party=PARTY, enemy=ENEMY),
                 counts=dict(standing=len(PR.rec), kinds=dict(sorted(kinds.items())), no_fight_fact=no_fact, words=0, specks=specks,
                             lit=len(PR.lights), cover_pieces=len(PR.cover), spots_at_the_opening_frame=eye,
                             eye_count_control=dict(planted=n_, counted=got)),
                 the_fight_reads=dict(new=new, old=old), cover=PR.cover, lights=PR.lights, pieces=log, wall=wallinfo,
                 colours_per_96px=R1.density(np.asarray(board)), elapsed_s=round(time.time() - t0, 1))
    board.save(os.path.join(OUT, STEM + '.webp'), quality=84, method=4)
    # the 1:1 crop the card names (rule 114, lossless): the cage, the queue's aisle and the first banks under the wall
    crop = board.crop((CUT[0], CUT[1], CUT[0] + 1170, CUT[1] + 1500)); crop.save(SPRITE)
    keys = sorted(R1.USED.items(), key=lambda kv: (-kv[1], kv[0]))
    man = dict(lane='combat 2', row='[the casino board]',
               rule='52 no two boards the same; 79 the routine fight a middle board; 100 candidates only; 108 nothing drawn; 117 one look; 120 guns first, lines and cover',
               ruler=dict(px_per_m=round(PPM, 2), house_tile_m=TILE_M, house_tile_px=[TPX, TPY], board='middle, 14 x 10 house tiles = 161 x 115 m'),
               camera="the pack's: square ground from above, objects and faces three-quarter; the street wall's inner face is the wall it shows",
               opening_frame='the board whole on an upright phone, %d device px wide (rule 104a)' % R4.PHONE_W,
               sources=dict(building='tools/bohemia_cook4_the_casino.py hall() (COOK FOUR), its render, glass leaves, open pair and fire exits',
                            street_in_the_door="COOK TWO's sidewalk cell (tools/bohemia_cook2_stretch_the_pack_47_10_13_26.py)",
                            floor_and_pieces='banks/BOHEMIA_HD_TILE_REPO_part1-4.txt, his tiles whole at an integer scale'),
               holes=['no carpet in the bank: the bare slab stands where it was pulled up', 'no column taller than 3.4 m at x2',
                      "no slot machine's back: every bank faces south, the camera's side", 'every pack screen is lit: the fight\'s dark pass lights only the three on a battery'],
               prop_scales={k: dict(scale=v['k'], fight=v['cover'], why=v['real']) for k, v in R1.KIND.items() if k in ('slot', 'counter', 'grate', 'table', 'bar', 'column', 'drum')},
               pieces={STEM: dict(src=STEM + '.webp', keys=[{'pack': k[0], 'idx': k[1]} for k, n in keys if n > 0])},
               keys_used=[[k[0], k[1], n, 'UP' if R1.up(*k) else 'never judged'] for k, n in keys if n > 0],
               board=facts)
    json.dump(man, open(os.path.join(OUT, STEM + '.json'), 'w'), indent=1, default=lambda o: o.item() if hasattr(o, 'item') else str(o))
    sheet(board, fb, P, new, old, wallinfo, kinds)
    print('keys', len([k for k in keys if k[1] > 0]), 'total', round(time.time() - t0), 's')

# ---------------------------------------------------------------- the card (one column, the phone's width)
WD = 1170
CUT = (int(10.2 * TPX), 1080)                    # the 1:1 window: the cage's counter, its queue and the first slot rows
def wrap(text, f, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if R1.font(f).getlength(t) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def text_block(text, f=30, col=(236, 226, 206), bg=(16, 14, 12)):
    lines = wrap(text, f, WD - 48); h = 20 + len(lines) * int(f * 1.3) + 10
    im = Image.new('RGB', (WD, h), bg); d = ImageDraw.Draw(im)
    for i, l in enumerate(lines): d.text((24, 16 + i * int(f * 1.3)), l, font=R1.font(f), fill=col)
    return im

def fight_map(g, cv, new):
    """the fight's read drawn on the grid, the size the board opens at: open floor pale, high cover orange, low cover tan,
    the cage grey and raised; every clear lane across the floor a line; the two starts boxed"""
    # a chart of the fight's facts for the card (like its words), never art: built as an array, one colour a fact
    s = WD / C; H_ = int(s * T); a = np.full((H_, WD, 3), (20, 18, 16), np.uint8)
    colr = {None: (196, 186, 164), 'low': (176, 136, 84), 'high': (176, 82, 46)}
    X = lambda c: int(round(c * s)); Y = lambda r: int(round(r * s))
    for r in range(T):
        for c in range(C):
            a[Y(r) + 1:Y(r + 1) - 1, X(c) + 1:X(c + 1) - 1] = (120, 124, 132) if g[r][c] == CAGE else colr[cv[r][c]]
    for r in new['lanes_across_west_to_east']: a[Y(r + .5) - 2:Y(r + .5) + 3, 4:WD - 4] = (250, 244, 220)
    for c in new['lanes_across_north_to_south']: a[4:H_ - 4, X(c + .5) - 2:X(c + .5) + 3] = (250, 244, 220)
    for zone, col in ((PARTY, (90, 200, 120)), (ENEMY, (220, 60, 50))):
        for r, c in zone:
            x0, y0, x1, y1 = X(c) + 6, Y(r) + 6, X(c + 1) - 7, Y(r + 1) - 7
            for sl in ((slice(y0, y0 + 5), slice(x0, x1)), (slice(y1 - 5, y1), slice(x0, x1)), (slice(y0, y1), slice(x0, x0 + 5)), (slice(y0, y1), slice(x1 - 5, x1))):
                a[sl] = col
    return Image.fromarray(a)

def sheet(board, fb, P, new, old, wallinfo, kinds):
    rows = []
    rows.append(text_block('CANDIDATE: A FIGHT INSIDE COOK FOUR\'S CASINO. Not in the game; a board you vote on.', 36, (250, 236, 200)))
    rows.append(text_block('THE NEW BOARD, whole, the size the fight opens on your phone. North is the casino\'s own street wall '
                           'seen from inside, with cook 4\'s glass doors and the open pair showing the street. The grey floor is '
                           'the bare concrete (the carpet rotted and was pulled up), the stone strips are the aisles you shoot down, the rows are slot machines (cover), '
                           'the grey corner is the cashier\'s cage (high ground behind bars).', 26))
    rows.append(fb.convert('RGB'))
    rows.append(text_block('HOW THE FIGHT READS IT. Green: you come in by the open doors. Red: they hold the cage. White lines: '
                           'a clear line of fire across the whole floor. Orange tiles: slot rows you hide in. Tan: tables and the bar, low cover.', 26))
    rows.append(fight_map(P['g'], cover_grid(P['g']), new))
    rows.append(text_block('IN NUMBERS, FOR THE GUNS: %d clear lines of fire cross the whole floor. %d of every 100 tiles have cover one step away. '
                           '%d of every 100 places you can hide have a shot out at rifle or scope range. The cage sees %d tiles from up high. '
                           'The two sides start %d tiles apart, out of range, so nobody is shot before they move. (The old casino board, '
                           'bigger at 20 x 15, read about the same: %d lines, %d and %d of 100.)' % (
                               len(new['lanes_across_west_to_east']) + len(new['lanes_across_north_to_south']),
                               round(new['cover_within_one_step'] * 100), round(new['covered_with_a_shot_out'] * 100),
                               new['tiles_the_hill_overlooks'], new['lines_start_apart_tiles'],
                               len(old['lanes_across_west_to_east']) + len(old['lanes_across_north_to_south']),
                               round(old['cover_within_one_step'] * 100), round(old['covered_with_a_shot_out'] * 100)), 26, (250, 236, 200)))
    # 1:1, the cage and the first banks, three men at the ruler
    x0, y0 = CUT; cut = board.crop((x0, y0, x0 + WD, y0 + 1500)).convert('RGBA')
    man = Image.open(R1.MAN).convert('RGBA').crop((0, 0, 112, 112))
    for mx, my in ((10.5, 2.75), (11.6, 2.45), (11.35, 3.5)):                # the aisle, the queue, between two slot rows
        cut.alpha_composite(man, (int(mx * TPX) - x0 - 56, int(my * TPY) - y0 - 112))
    rows.append(text_block('AT 1:1, one art pixel to one phone pixel: the cashier\'s cage (counter, till, bars) and the first slot rows, three men at their real size.', 26))
    rows.append(cut.convert('RGB'))
    # the doors at 1:1 beside cook 4's front
    dx = int(wallinfo['door_x']) - WD // 2
    rows.append(text_block('THE DOORS AT 1:1. Top: from inside, the open pair shows the street. Bottom: cook 4\'s casino from outside (you said yes), the same doors.', 26))
    rows.append(board.crop((max(0, dx), 0, max(0, dx) + WD, 520)).convert('RGB'))
    front = Image.open('reference/art_bank/settlement/COOK4_CASINO_STRAIGHT_ROOF.png').convert('RGBA')
    fr = Image.new('RGB', (WD, front.height), (16, 14, 12)); fr.paste(front.crop((0, 0, WD, front.height)), (0, 0), front.crop((0, 0, WD, front.height)))
    rows.append(fr)
    # before: the board he said yes to, as its card showed it
    old_card = Image.open(OLD_CARD).convert('RGB')
    pit = old_card.crop((840, 94, 1640, 524)); pit = pit.resize((WD, int(pit.height * WD / pit.width)), Image.NEAREST)
    rows.append(text_block('BEFORE: the casino board you said yes to ("definitely placeholder tiles, but looking good"): a carpet drawn by code, the same layout of slot rows.', 26))
    rows.append(pit)
    # the twin: his tiles as bought
    tw = Image.new('RGBA', (WD, 250), (16, 14, 12, 255)); d = ImageDraw.Draw(tw); x = 16
    for nm, i, lab in (('Streets props and urban', 47, 'slot'), ('Machines and tech', 13, 'poker'), ('Tables, chairs and sitting', 36, 'till'),
                       ('19. Miscellaneous (1)', 46, 'bars'), ('Furniture and fixtures', 7, 'table'), ('Tables, chairs and sitting', 37, 'bar'),
                       ('Structures and columns', 1, 'column'), ('1. Cracked contrete tiles', 0, 'concrete'), ('Floor tiles (1)', 1, 'aisle'),
                       ('Floor tiles and wall tiles', 5, 'cage')):
        t = R1.bank(nm, i); R1.USED[(nm, i)] -= 1
        tw.alpha_composite(t, (x, 130 - t.height)); d.text((x, 140), lab, font=R1.font(18), fill=(220, 210, 190))
        x += max(t.width, int(R1.font(18).getlength(lab))) + 10
    tw.alpha_composite(man, (x + 4, 130 - 112)); d.text((x + 4, 140), 'the man', font=R1.font(18), fill=(220, 210, 190))
    d.text((16, 180), 'YOUR TILES AS BOUGHT, 1:1. Every piece on the board is one of these, whole, never redrawn.', font=R1.font(22), fill=(236, 226, 206))
    rows.append(text_block('THE TWIN:', 26)); rows.append(tw.convert('RGB'))
    rows.append(text_block('THE THREE BIGGEST DIFFERENCES FROM YOUR PACKS: (1) your packs sell no carpet, so the floor is the bare concrete '
                           'of the street you said yes to, the carpet long pulled up; (2) your machines come one at a time, here they stand in rows of one model '
                           'the way casinos group them, with gaps where batteries were pulled; (3) your counter and your iron grate stand together as the cage.', 24))
    H = sum(r.height for r in rows)
    out = Image.new('RGB', (WD, H), (16, 14, 12)); y = 0
    for r in rows: out.paste(r, (0, y)); y += r.height
    out.save(SHEET, quality=88, method=4, lossless=False)
    print('sheet', out.size, SHEET)

if __name__ == '__main__':
    main()
