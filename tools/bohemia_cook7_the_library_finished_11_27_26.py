#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the library, finished] (11/27/26; COMBAT FOUR's library asked 'FOR COOK (SIX)'; VAMILY rule 480(b): finished art where
a stand-in still stands; rule 482; rules 461, 441, 416, 451(a)).

COMBAT FOUR's library (THE LIBRARY, slices/fight_ground/library/library.json, laid by slices/bohemia_big_inside.js): its stacks (rows of steel
stacks taller than a man, half their books burned for heat, low end shelves, heaps of books kept for the fires, carts, microfilm readers, the
circulation desk) or its reading room (long tables on their sides, carrels, the card catalogue with its drawers pulled for kindling, the
circulation desk's long run). All its pieces were stand-ins and its ceiling was drawn by the page. These are the pictures under its names,
through the master rig, ON this lane's bank tool (the police station's, the truck stop's and the chain under them):

  THE FLOOR        library_floor_0.webp (floor.floor, floor.ring): THE LIBRARY'S CARPET, 50 cm carpet tiles (a ground of its own, lb_carpet: the
                   mall's calibrated carpet role with the shader's seams every 0.5 m and each tile its own shade), worn to the pale backing in
                   paths, soot round where a fire stood, ash, a burn.
  THE PIECES       lb_stacks (three double rows of steel stacks a tile long, 0.9 m sections, books in runs with gaps where they were burned),
                   lb_endshelf (the low shelves at the rows' ends, on the stacks' three lines), lb_heap (books pulled down in heaps for the fires),
                   lb_bookcart, lb_table (a long reading table on its side, its chairs), lb_carrel (study carrels, their walls high),
                   lb_catalogue (the card catalogue a tile long, drawers pulled), lb_desk (the circulation desk a tile long), lb_readers
                   (microfilm readers on their stands, dead), lb_wall_ew/_ns (painted plaster over oak wainscot, a shelf line of dust).
  THE CEILING      library_ceiling.webp (rule 451(a), 'grid'): the police station's dropped grid, its tiles stained, soot over the fires.

  /tmp/v/bin/python tools/bohemia_cook7_the_library_finished_11_27_26.py render lb_floor | lb_pieces | ceil_library
  python3 tools/bohemia_cook7_the_library_finished_11_27_26.py cut | sheet <before_dir> <page_dir>

REFERENCE CHECK: the valley's branch libraries (the 1960s-90s county branches: double-faced steel stacks 7 ft tall in 3 ft sections on carpet
tile, low end panels, oak reading tables, study carrels, a long circulation desk, a card catalogue of oak drawer cabinets kept after the
computers came, microfilm readers). The twins: this lane's truck stop (the runs and end caps' lines), police station (the grid) kits.
REUSE CHECK: the truck stop's runs and end-cap lines, the police station's ceiling, the bank's chain and cut. New: the library's pieces.
ANALOG HORROR: a microfilm reader's screen still lit on one frame of an old newspaper; the card catalogue's drawers burned and the cards
of one drawer left in order.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook7_inside_kit as KIT                            # this lane's: the cut, the sheet, the ceiling's hand-off, once (rule 495(b))
import bohemia_cook7_the_bank_finished_11_27_26 as BK            # this lane's: the bank (the police station's, the truck stop's and the chain under it)

PD = BK.PD; TS = BK.TS; SM = TS.SM; TG = TS.TG; FW = TS.FW; HS = TS.HS
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND = TG.FG, TG.REND
SHIP = os.path.join(FG, 'library')
ROWS = (0, 1, 2, 3, 4)
tile_xy = HS.tile_xy
seg_d = TS.seg_d

# ---- the ground: the carpet tile (its own ground: the mall's carpet role, the shader's seams every 0.5 m) --------------------------
TG.GROUNDS['lb_carpet'] = dict(role=('clay_teal', 1), target=(84, 92, 92), h=0.0, alt=('tape_grey', 1), alt_amt=0.25, grit=0.12, speck=(40, 0.2),
                               joints=dict(pitch=0.5, width=0.006), panel_var=0.06)
TG.CAL0['lb_carpet'] = 1.1058                                    # the mall's carpet's measured multiplier (a carpet role on the same rig)
TG.WEAR['lb_carpet'] = 0.3


def plan_lb_floor(ID, seed=271):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['lb_carpet'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    dark = 0.1 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.06; pale = np.zeros((H, W), np.float32)
    for r in ROWS:
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]
            Wn = TG.win(X, Y, 0.9, 2.2); nn = FW.vnoise(X.shape, 0.9 * PPM, rng)
            for _ in range(2):                                                                               # worn to the pale backing in paths
                ang = rng.uniform(0, math.pi); cx, cy = rng.uniform(4.0, 8.0), rng.uniform(4.0, 8.0)
                d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang)); Pl[:] = np.maximum(Pl, np.clip(1 - d0 / 1.0, 0, 1) * Wn * (0.12 + 0.14 * nn))
            if rng.rand() < 0.5:                                                                              # where a fire stood: soot, ash, a burn
                cx, cy = rng.uniform(3.5, 8.5), rng.uniform(3.5, 8.5); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.5 * nn)
                D[:] = np.maximum(D, np.clip(1.3 - d0 / 1.1, 0, 1) * 0.55); m = d0 < 0.45; gid[sy, sx][m] = ID['tun_fill']; D[m] = 0.2
            for _ in range(rng.randint(2, 5)):                                                                # stains
                cx, cy = rng.uniform(2, 10), rng.uniform(2, 10); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.5 * nn)
                D[:] = np.maximum(D, np.clip(1.1 - d0 / rng.uniform(0.3, 0.6), 0, 1) * 0.3)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['lb_floor'] = plan_lb_floor


def lb_floor_things(bpy, NF, M, rng):
    inside = lambda r_: (12.0 * r_.randint(5) + r_.uniform(1.4, 10.6), 12.0 * r_.randint(5) + r_.uniform(1.4, 10.6))   # (inside a tile: a page across an edge stepped A3 at 8.0)
    return FW.debris(bpy, NF, {'rubber': M['paper'], 'card': M['card'], 'paper': M['paper']}, rng, inside, 120)   # pages, covers


TG.GARAGE_THINGS['lb_floor'] = lb_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
LB_AT = dict(stacks=(7.0, 46.0), endshelf=(21.0, 50.0), catalogue=(35.0, 46.0), desk=(49.0, 46.0), wall_ns=(57.5, 30.0),
             wall_ew=(7.0, 31.0), table=(21.0, 32.0), carrel=(33.0, 32.0), heap=(44.0, 32.0),
             bookcart=(8.0, 18.0), readers=(20.0, 18.0))
WALL_H = 3.2
BOOKS = ('lb_b1', 'lb_b2', 'lb_b3', 'lb_b4', 'lb_b5', 'lb_b6', 'lb_b7')
LINES = ((-2.0, -0.8), (0.8, 2.0), (3.6, 4.8))            # the stacks' three lines, metres north of the END SHELF's foot ('at' 0.75 against the stacks' 0.95)


def books(P, x0, x1, y0, y1, z, rng, keep=0.5, hmax=0.3):
    """runs of books on a shelf from x0 to x1 (their spines to y0 side), gaps where they were taken for the fires; one leaning in a run's end"""
    x = x0
    while x < x1 - 0.1:
        L = rng.uniform(0.15, 0.7)
        if rng.rand() < keep:
            u = x
            while u < min(x + L, x1 - 0.02):
                w_ = rng.uniform(0.06, 0.18); P.box(BOOKS[rng.randint(len(BOOKS))], u, min(u + w_, x1 - 0.02), y0, y1, z, z + rng.uniform(0.17, hmax)); u += w_ + 0.003
            if rng.rand() < 0.3: P.bar(BOOKS[rng.randint(len(BOOKS))], (u + 0.02, (y0 + y1) / 2, z), (u + 0.17, (y0 + y1) / 2, z + 0.2), 0.03)
        x += L + rng.uniform(0.05, 0.3)


def stack_run(P, x0, x1, y0, rng, h=2.1):
    """one double-faced steel stack run from x0 to x1, 0.6 m deep from y0: its base, its uprights every 0.9 m, six shelves a side, books"""
    y1 = y0 + 0.6; yc = y0 + 0.3
    P.box('lb_steel_d', x0, x1, y0 + 0.02, y1 - 0.02, 0.0, 0.1); P.box('lb_steel', x0, x1, yc - 0.01, yc + 0.01, 0.1, h)
    x = x0
    while x <= x1 + 1e-6: P.box('lb_steel', max(x0, x - 0.02), min(x1, x + 0.02), y0, y1, 0.0, h); x += 0.9
    P.box('lb_steel', x0, x1, y0, y1, h - 0.02, h)
    for z in (0.1, 0.45, 0.8, 1.15, 1.5, 1.85):
        for (a, b) in ((y0 + 0.01, yc - 0.01), (yc + 0.01, y1 - 0.01)):
            P.box('lb_steel', x0, x1, a, b, z, z + 0.015)
            books(P, x0 + 0.02, x1, a + 0.02 if a < yc else b - 0.24, a + 0.24 if a < yc else b - 0.02, z + 0.015, rng, keep=0.45)


def stacks(P, ox, oy, rng):
    """a tile of steel stacks: three double rows 0.6 m deep on 2.2 m aisles, the whole tile long so a run of tiles is one run (the truck stop's
    shelving's lines); half the books gone, a shelf's worth pulled down in an aisle"""
    for j in range(3): stack_run(P, ox - 6.0, ox + 6.0, oy + 0.4 + j * 2.8 + 0.3, rng)
    for j in range(2):
        y = oy + 1.6 + j * 2.8 + rng.uniform(0.3, 1.0)
        for _ in range(14): u = rng.uniform(ox - 5.5, ox + 5.5); a = rng.uniform(0, 3.1); P.poly(BOOKS[rng.randint(len(BOOKS))], [(u, y), (u + 0.22 * math.cos(a), y + 0.22 * math.sin(a)), (u + 0.22 * math.cos(a) - 0.15 * math.sin(a), y + 0.22 * math.sin(a) + 0.15 * math.cos(a)), (u - 0.15 * math.sin(a), y + 0.15 * math.cos(a))], 0.0, 0.04)


def endshelf(P, ox, oy, rng):
    """the low end shelves where the rows end, on the stacks' three lines at both edges of the tile, 1.1 m high, facing the cross aisle; a
    display stand knocked over between them, its paperbacks out"""
    for (a, b) in LINES:
        for side in (-1, 1):
            xa, xb = (ox - 6.0, ox - 5.2) if side < 0 else (ox + 5.2, ox + 6.0)
            P.box('lb_wood', xa, xb, oy + a + 0.25, oy + b - 0.25, 0.0, 1.1); P.box('lb_wood_d', xa, xb, oy + a + 0.22, oy + b - 0.22, 1.1, 1.14)
            fx = xb if side < 0 else xa
            for z in (0.1, 0.55):
                for k in range(int((b - a - 0.5) / 0.2)):
                    if rng.rand() < 0.5: v = oy + a + 0.3 + k * 0.2; P.box(BOOKS[rng.randint(len(BOOKS))], min(fx, fx + 0.2 * side), max(fx, fx + 0.2 * side), v, v + 0.17, z, z + rng.uniform(0.18, 0.28))
    P.box('lb_wood', ox - 1.0, ox + 0.6, oy + 0.2, oy + 0.7, 0.0, 0.25)                                         # a display stand on its back
    for _ in range(24): u, v = ox + rng.uniform(-2.0, 2.0), oy + rng.uniform(-0.4, 1.5); P.box(BOOKS[rng.randint(len(BOOKS))], u, u + 0.11, v, v + 0.17, 0.0, 0.03)


def heap(P, ox, oy, rng):
    """books pulled down in heaps for the fires: two mounds of books, splayed and stacked, a burned edge, a box of them ready, a steel bin"""
    for (cx, cy, n, R_) in ((ox - 1.4, oy + 1.1, 130, 1.7), (ox + 1.6, oy + 0.9, 90, 1.3), (ox - 0.2, oy + 2.4, 60, 1.1)):
        for _ in range(n):
            a = rng.uniform(0, 6.28); d = R_ * math.sqrt(rng.rand()); u, v = cx + d * math.cos(a), cy + d * math.sin(a) * 0.7
            z = max(0.0, (1 - d / R_)) * 0.5 * rng.rand(); t = rng.uniform(0, 3.1); w_, d_ = rng.uniform(0.12, 0.22), rng.uniform(0.15, 0.3)
            P.poly(BOOKS[rng.randint(len(BOOKS))], [(u + p * math.cos(t) - q * math.sin(t), v + p * math.sin(t) + q * math.cos(t)) for (p, q) in ((-w_, -d_ / 2), (w_, -d_ / 2), (w_, d_ / 2), (-w_, d_ / 2))], z, z + 0.04)
    P.box('card', ox + 2.2, ox + 2.7, oy + 1.6, oy + 2.0, 0.0, 0.35); P.drum('lb_bin', ox + 3.2, oy + 0.6, 0.0, 0.7, 0.3, 14); P.drum('black', ox + 3.2, oy + 0.6, 0.7, 0.71, 0.27, 14)


def bookcart(P, ox, oy, rng):
    """book carts: one standing with a few books on its sloped shelves, one tipped over with its books out, a third pushed against it"""
    for (dx, dy) in ((-1.6, 0.6), (1.2, 1.0), (-2.6, 1.9), (2.2, 2.2)):
        x0, y0 = ox + dx, oy + dy; P.box('lb_steel_d', x0, x0 + 0.9, y0, y0 + 0.45, 0.15, 0.2)
        for z in (0.45, 0.8): P.box('lb_steel_d', x0, x0 + 0.9, y0, y0 + 0.45, z, z + 0.03); books(P, x0 + 0.02, x0 + 0.88, y0 + 0.05, y0 + 0.4, z + 0.03, rng, keep=0.6, hmax=0.25)
        for (u, v) in ((x0, y0), (x0 + 0.9, y0), (x0, y0 + 0.45), (x0 + 0.9, y0 + 0.45)): P.box('lb_steel_d', u - 0.02, u + 0.02, v - 0.02, v + 0.02, 0.05, 1.0); P.drum('black', u, v, 0.0, 0.08, 0.04, 6)
    P.box('lb_steel_d', ox - 0.4, ox + 0.5, oy + 0.1, oy + 1.1, 0.0, 0.45)                                            # tipped over
    for _ in range(70): u, v = ox + rng.uniform(-3.0, 3.2), oy + rng.uniform(-0.6, 1.8); P.box(BOOKS[rng.randint(len(BOOKS))], u, u + 0.15, v, v + 0.22, 0.0, 0.035)


def table(P, ox, oy, rng):
    """a long oak reading table on its side for cover, its top to the south; its chairs, one up and three down; a green lamp broken"""
    P.box('lb_oak', ox - 1.9, ox + 1.9, oy + 0.4, oy + 0.46, 0.0, 1.1)
    for x in (ox - 1.6, ox + 1.6): P.box('lb_oak_d', x - 0.06, x + 0.06, oy + 0.46, oy + 1.2, 0.5, 0.62); P.box('lb_oak_d', x - 0.06, x + 0.06, oy + 0.46, oy + 0.6, 0.0, 1.1)
    for (dx, dy, up) in ((-1.5, 1.6, True), (-0.4, 1.9, False), (0.8, 1.7, False), (2.4, 0.6, False), (-2.6, 0.5, True), (1.6, 2.4, True)):
        x, y = ox + dx, oy + dy
        if up: P.box('lb_oak', x, x + 0.45, y, y + 0.45, 0.42, 0.46); P.box('lb_oak', x, x + 0.45, y + 0.4, y + 0.45, 0.46, 0.9); [P.box('lb_oak_d', u, u + 0.04, v, v + 0.04, 0.0, 0.42) for (u, v) in ((x, y), (x + 0.41, y), (x, y + 0.41), (x + 0.41, y + 0.41))]
        else: P.box('lb_oak', x, x + 0.45, y, y + 0.9, 0.0, 0.06); P.box('lb_oak_d', x, x + 0.45, y + 0.4, y + 0.45, 0.06, 0.45)
    x0 = ox - 2.2; P.box('lb_oak', x0, x0 + 3.6, oy + 2.4, oy + 3.4, 0.74, 0.79)                                  # a second, standing behind it
    for (u, v) in ((x0 + 0.1, oy + 2.5), (x0 + 3.4, oy + 2.5), (x0 + 0.1, oy + 3.2), (x0 + 3.4, oy + 3.2)): P.box('lb_oak_d', u, u + 0.1, v, v + 0.1, 0.0, 0.74)
    for _ in range(6): u = rng.uniform(x0 + 0.2, x0 + 3.2); P.box(BOOKS[rng.randint(len(BOOKS))], u, u + 0.2, oy + 2.6, oy + 2.9, 0.79, 0.84)
    P.drum('bk_lamp', ox + 0.5, oy - 0.1, 0.0, 0.12, 0.13, 10)
    for _ in range(8): u = ox + rng.uniform(0, 1); P.box('glassbit', u, u + 0.05, oy - rng.uniform(0.2, 0.6), oy - 0.1, 0.0, 0.006)
    for _ in range(14): u, v = ox + rng.uniform(-2.5, 2.5), oy + rng.uniform(-0.7, 0.3); P.box(('paper', 'white') [rng.randint(2)], u, u + 0.2, v, v + 0.28, 0.0, 0.004)


def carrel(P, ox, oy, rng):
    """study carrels, four in a row back to back with four: their high side walls and backs, the desk tops, a lamp, a book left open"""
    for j, (y0, face) in enumerate(((oy + 0.4, 1), (oy + 1.4, -1))):
        for k in range(4):
            x0 = ox - 2.4 + k * 1.2; P.box('lb_oak', x0, x0 + 1.2, y0, y0 + 0.7, 0.72, 0.76)
            for x in (x0, x0 + 1.17): P.box('lb_oak_d', x, x + 0.03, y0, y0 + 0.75, 0.0, 1.45)
            yb = y0 + 0.7 if face > 0 else y0; P.box('lb_oak_d', x0, x0 + 1.2, yb, yb + 0.05, 0.0, 1.45)
            if rng.rand() < 0.5: P.box('white', x0 + 0.4, x0 + 0.8, y0 + 0.2, y0 + 0.45, 0.76, 0.77)
            if rng.rand() < 0.6: P.box('lb_oak', x0 + 0.3, x0 + 0.75, y0 - 0.5 if face > 0 else y0 + 0.75, y0 - 0.05 if face > 0 else y0 + 1.2, 0.42, 0.46)
    P.box('lb_oak_d', ox - 2.4, ox + 2.4, oy + 1.1, oy + 1.4, 1.42, 1.46)


def catalogue(P, ox, oy, rng):
    """the card catalogue, a tile long: oak cabinets of small drawers 1.4 m high on their stand, the drawers pulled for kindling, some on the
    floor, cards drifted; one drawer left in, its cards in order"""
    y0 = oy + 0.4
    P.box('lb_oak_d', ox - 6.0, ox + 6.0, y0 + 0.05, y0 + 0.6, 0.0, 0.35); P.box('lb_oak', ox - 6.0, ox + 6.0, y0, y0 + 0.65, 0.35, 1.45)
    P.box('lb_oak_d', ox - 6.0, ox + 6.0, y0 - 0.02, y0 + 0.67, 1.45, 1.5)
    for k in range(9): x = ox - 6.0 + k * 1.5; P.box('lb_oak_d', max(ox - 6.0, x - 0.02), min(ox + 6.0, x + 0.02), y0 - 0.01, y0, 0.35, 1.45)
    for i in range(40):
        for j in range(7):
            x, z = ox - 6.0 + i * 0.3, 0.4 + j * 0.15
            if rng.rand() < 0.55: P.box('black', x + 0.02, x + 0.28, y0 - 0.002, y0, z + 0.01, z + 0.13)
            else: P.box('bk_brass', x + 0.12, x + 0.18, y0 - 0.01, y0, z + 0.06, z + 0.08)
    for _ in range(14):
        u, v = ox + rng.uniform(-5.6, 5.4), oy + rng.uniform(-0.9, 0.2); a = rng.uniform(-0.5, 0.5)
        P.poly('lb_oak', [(u, v), (u + 0.26 * math.cos(a), v + 0.26 * math.sin(a)), (u + 0.26 * math.cos(a) - 0.4 * math.sin(a), v + 0.26 * math.sin(a) + 0.4 * math.cos(a)), (u - 0.4 * math.sin(a), v + 0.4 * math.cos(a))], 0.0, 0.12)
    for _ in range(80): u, v = ox + rng.uniform(-5.8, 5.8), oy + rng.uniform(-1.0, 0.35); P.box('white', u, u + 0.12, v, v + 0.07, 0.0, 0.003)


def desk(P, ox, oy, rng):
    """the circulation desk, a tile long (a run of Q is one desk): its oak front panelled, the work top behind, a dead terminal and its scanner,
    the returns slot, the date stamp, a book drop bin"""
    y0 = oy + 0.4
    P.box('lb_oak', ox - 6.0, ox + 6.0, y0, y0 + 0.8, 0.0, 1.05); P.box('lb_oak_d', ox - 6.0, ox + 6.0, y0 - 0.04, y0 + 0.84, 1.05, 1.1)
    for k in range(9): x = ox - 6.0 + k * 1.5; P.box('lb_oak_d', max(ox - 6.0, x - 0.02), min(ox + 6.0, x + 0.02), y0 - 0.005, y0, 0.1, 0.95)
    P.box('lb_oak', ox - 6.0, ox + 6.0, y0 + 0.84, y0 + 1.5, 0.72, 0.76)
    for k in range(3):
        x = ox - 4.5 + k * 4.0; P.box('black', x, x + 0.45, y0 + 0.9, y0 + 0.97, 0.76, 1.15); P.box('black', x + 0.6, x + 0.75, y0 + 0.2, y0 + 0.35, 1.1, 1.17)
    P.box('lb_steel_d', ox + 1.2, ox + 2.0, y0 + 1.6, y0 + 2.3, 0.0, 0.85); P.box('black', ox + 1.25, ox + 1.95, y0 + 1.62, y0 + 1.64, 0.6, 0.7)
    for _ in range(12): u, v = ox + rng.uniform(-5.6, 5.6), oy + rng.uniform(-0.8, 0.3); P.box(BOOKS[rng.randint(len(BOOKS))], u, u + 0.15, v, v + 0.22, 0.0, 0.035)


def readers(P, ox, oy, rng):
    """microfilm readers on their stands: three hooded machines, dead, their reels; one screen still lit on a frame of an old newspaper; a
    cabinet of film drawers pulled"""
    for k, dx in enumerate((-2.2, -0.6, 1.0)):
        x0 = ox + dx; P.box('lb_steel_d', x0, x0 + 1.2, oy + 0.6, oy + 1.3, 0.0, 0.75)
        P.box('lb_reader', x0 + 0.2, x0 + 1.0, oy + 0.7, oy + 1.25, 0.75, 1.45); P.box('lb_screen' if k == 1 else 'black', x0 + 0.3, x0 + 0.9, oy + 0.69, oy + 0.7, 1.0, 1.4)
        for u in (x0 + 0.35, x0 + 0.85): P.drum('black', u, oy + 0.6, 0.85, 0.88, 0.08, 10)
    P.box('lb_steel_d', ox + 2.5, ox + 3.3, oy + 0.8, oy + 1.5, 0.0, 1.3)
    for z in (0.15, 0.45, 0.75, 1.05): P.box('lb_steel', ox + 2.55, ox + 3.25, oy + 0.4 if z == 0.45 else oy + 0.78, oy + 0.8, z, z + 0.25)
    for _ in range(16): u, v = ox + rng.uniform(-2.6, 3.4), oy + rng.uniform(-0.4, 0.5); P.drum(('black', 'lb_film')[rng.randint(2)], u, v, 0.0, 0.03, 0.05, 8)


def wall_ew(P, ox, oy, rng):
    """the library's wall, a tile long: an oak wainscot to a metre, painted plaster over it, a wall shelf's dust line, soot over the fires"""
    P.box('lb_oak_d', ox - 6.0, ox + 6.0, oy, oy + 0.3, 0.0, 1.0); P.box('lb_plaster', ox - 6.0, ox + 6.0, oy, oy + 0.3, 1.04, WALL_H)
    P.box('lb_oak', ox - 6.0, ox + 6.0, oy - 0.03, oy + 0.3, 1.0, 1.04)
    P.box('lb_plaster_d', ox - 6.0, ox + 6.0, oy - 0.06, oy + 0.32, WALL_H - 0.12, WALL_H)
    for _ in range(10): u, z = ox + rng.uniform(-5.8, 5.6), rng.uniform(1.2, 2.9); P.box('stain', u, u + rng.uniform(0.3, 1.2), oy - 0.006, oy - 0.004, z, z + rng.uniform(0.1, 0.5))
    for _ in range(2):                                                                                        # soot up the wall, in streaks, thicker at the top
        u0 = ox + rng.uniform(-5.0, 3.5)
        for k in range(18): u = u0 + rng.uniform(0, 1.6); P.box('stain', u, u + rng.uniform(0.05, 0.25), oy - 0.008, oy - 0.006, rng.uniform(1.5, 2.6), WALL_H - 0.12)


def wall_ns(P, ox, oy, rng):
    P.box('lb_oak_d', ox - 0.15, ox + 0.15, oy, oy + 12.0, 0.0, 1.0); P.box('lb_plaster', ox - 0.15, ox + 0.15, oy, oy + 12.0, 1.04, WALL_H)
    P.box('lb_oak', ox - 0.17, ox + 0.17, oy, oy + 12.0, 1.0, 1.04); P.box('lb_plaster_d', ox - 0.18, ox + 0.18, oy, oy + 12.0, WALL_H - 0.12, WALL_H)


F_ = dict(stacks=stacks, endshelf=endshelf, catalogue=catalogue, desk=desk, wall_ns=wall_ns, wall_ew=wall_ew, table=table, carrel=carrel, heap=heap,
          bookcart=bookcart, readers=readers)


def lb_parts(P, rng):
    for k, f in F_.items(): f(P, *LB_AT[k], rng)


def lb_mats(bpy, NF, F, M, which):
    if which not in ('lb_pieces', 'tun_pieces'): return
    if which == 'lb_pieces': BK.bk_mats(bpy, NF, F, M, 'bk_pieces')
    m = lambda n, role, step, mul: NF.material(bpy, n, role, step, mul)
    M.update(lb_steel=m('in_paint_stack_almond', 'clay_bone', 2, 0.92), lb_steel_d=m('in_paint_stack_dark', 'tape_grey', 1, 1.0), lb_wood=m('in_wood_endpanel', 'tape_masking', 1, 1.0),
             lb_wood_d=m('in_wood_endpanel_dark', 'clay_rust', 0, 1.0), lb_oak=m('in_wood_oak', 'tape_masking', 1, 0.95), lb_oak_d=m('in_wood_oak_dark', 'clay_rust', 1, 0.85),
             lb_plaster=m('in_plaster_library', 'clay_bone', 2, 0.9), lb_plaster_d=m('in_plaster_library_dark', 'clay_bone', 1, 0.95), lb_bin=m('in_steel_bin', 'metal_painted', 1, 1.0),
             lb_reader=m('in_plastic_reader', 'clay_bone', 2, 0.9), lb_screen=m('in_lit_screen_film', 'clay_mustard', 4, 0.9), lb_film=m('in_film_reel', 'clay_mustard', 1, 1.0),
             lb_b1=m('in_book_red', 'clay_rust', 1, 1.0), lb_b2=m('in_book_blue', 'clay_teal', 1, 1.0), lb_b3=m('in_book_tan', 'tape_masking', 2, 0.9), lb_b4=m('in_book_green', 'metal_painted', 1, 1.0),
             lb_b5=m('in_book_black', 'rubber', 2, 1.0), lb_b6=m('in_book_mustard', 'clay_mustard', 1, 1.0), lb_b7=m('in_book_cream', 'clay_bone', 3, 0.85))


TG.PARTS['lb_pieces'] = lb_parts
TG.MAT_HOOKS.append(lb_mats)


# ---- the ceiling: the police station's grid, sooted ------------------------------------------------------------------------------
def ceil_library(P, rng):
    PD.ceil_police(P, rng)
    for r in range(5):
        for c in range(5):
            for _ in range(rng.randint(1, 3)):                                                                    # soot over the fires
                x, y = TG.at(c, r, rng.uniform(2.0, 10.0), rng.uniform(2.0, 10.0), 0.05); TG.bloom(P, 'black', x, y, rng.uniform(0.8, 1.6), rng, 8)


TG.CEILINGS['library'] = (ceil_library, 'library/library_ceiling.webp', "the library's dropped ceiling from under it: the 2-by-4 grid's dark tees, the tiles stained and out in clusters, a troffer and a camera's dome in every bay, soot over the fires")
TG.CEIL_DATA['library'] = 'library/library.json'

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(stacks='WALL', endshelf='LOW_COVER', heap='LOW_COVER', bookcart='LOW_COVER', table='COVER', carrel='COVER', catalogue='COVER', desk='COVER',
            readers='LOW_COVER', wall_ew='WALL', wall_ns='WALL')
HM = dict(stacks=2.1, endshelf=1.2, heap=0.6, bookcart=1.0, table=1.1, carrel=1.5, catalogue=1.5, desk=1.15, readers=1.45, wall_ew=WALL_H, wall_ns=WALL_H)
NAME = dict(stacks='THE STACKS', endshelf='AN END SHELF', heap='BOOKS IN A HEAP', bookcart='A BOOK CART', table='A READING TABLE', carrel='STUDY CARRELS',
            catalogue='THE CARD CATALOGUE', desk='THE CIRCULATION DESK', readers='MICROFILM READERS', wall_ew="THE LIBRARY'S WALL", wall_ns="THE LIBRARY'S WALL")
BOX = dict(stacks=(-6.0, 6.01, -0.1, 7.7 + 2.3 * 1.45), endshelf=(-6.0, 6.01, -2.3, 5.0 + 1.3 * 1.45), catalogue=(-6.0, 6.01, -1.2, 1.2 + 1.6 * 1.45),
           desk=(-6.0, 6.01, -1.0, 2.8 + 1.3 * 1.45), wall_ns=(-0.6, 0.6, -0.05, 12.1 + (WALL_H + 0.1) * 1.45), wall_ew=(-6.0, 6.01, -0.3, 0.4 + (WALL_H + 0.1) * 1.45),
           table=(-3.0, 3.0, -0.8, 3.6 + 1.2 * 1.45), carrel=(-3.0, 3.0, -0.6, 2.3 + 1.5 * 1.45), heap=(-3.4, 3.6, -0.7, 3.6 + 0.8 * 1.45),
           bookcart=(-3.2, 3.4, -0.8, 2.8 + 1.1 * 1.45), readers=(-2.6, 3.6, -0.6, 1.6 + 1.5 * 1.45))
SHADOW = dict(wall_ns=0.5)



# the cut and the sheet are the inside kit's (tools/bohemia_cook7_inside_kit.py, rule 495(b): one thing, one place); this tool says what is its own
K = KIT.make(TG, kit='library', prefix='lb_', floor_render='lb_floor', floor_lists=[('floor', ROWS), ('ring', ROWS)], scenes=[('lb_pieces', LB_AT)], box=BOX, kind=KIND, hm=HM, name=NAME, shadow=SHADOW,
             art_for="COMBAT FOUR's library (slices/fight_ground/library/library.json): the names its handoff asked for, the garage's format. floor.floor is the library's carpet tile in both rooms (50 cm tiles, a ground of its own, worn to the pale backing in paths, soot and ash where fires stood, stains; a tile's edge is a seam); floor.ring the same.",
             how_it_lays={'the stacks': "lb_stacks a tile long, three double rows, so a run of S is one run; lb_endshelf puts a low end shelf on each of the stacks' three lines at both edges of its tile, lined up with lb_stacks at your 'at' [0.5, 0.75] and [0.5, 0.95].",
                           'the reading room': "lb_catalogue and lb_desk a tile long so CCC and QQQQQ are one run; lb_table a reading table on its side with its chairs; lb_carrel two rows of four."},
             sheet_name='THE_LIBRARY', card_id='cook7-the-library-11-27', heading='THE LIBRARY, BEFORE AND NOW',
             sub='on his phone, 390 x 844, as the fight opens in the stacks: before (every piece a stand-in), now, and now with the ceiling at his 10%',
             off_label='NOW, THE CEILING OFF', meets_label='NOW, AS HE MEETS IT: THE CEILING AT 10%', close_title='CLOSE IN, AND THE READING ROOM',
             close_sub='the stacks and their end shelves; the reading room: tables, carrels, the catalogue, the desk',
             closes=[('THE STACKS', 'stacks'), ('A HEAP FOR THE FIRES', 'heap')], other=('THE READING ROOM', 'rr'), pieces_title='THE PIECES AT THEIR OWN PIXELS',
             pieces_sub='the stacks, the end shelves, the catalogue, the desk; tables, carrels, heaps, carts, microfilm readers; the wall',
             rows=[(('stacks', 'endshelf'), 230), (('catalogue', 'desk'), 140), (('table', 'carrel', 'heap'), 150), (('bookcart', 'readers', 'wall_ew'), 120)],
             floor_title='THE CARPET, AND THE CEILING AT FULL STRENGTH', floor_sub='50 cm carpet tile worn to the backing, soot and ash where fires stood; the grid, the tiles out, soot over the fires')


def cut(): KIT.cut(K)


def sheet(before_dir, page_dir): KIT.sheet(K, before_dir, page_dir)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'lb_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'lb_pieces' else TG.scene_ceiling('library', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
