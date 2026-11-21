#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the cell block, finished] (11/21/26; COMBAT FOUR's BUILD 11/20w asked 'FOR COOK (SIX) 4)';
VAMILY rules 461, 453, 441, 416, 451(a), 455).

COMBAT FOUR's fourteenth inside (THE CELL BLOCK, slices/fight_ground/prison/prison.json, laid by slices/bohemia_big_inside.js): a
prison's housing unit taken from inside: cells as walls, the tier they hold at the bell, the dayroom between (bolted tables, mattress
barricades, burned heaps, a flooded floor, the picket); or two units across the sally port's bars. All 15 of its pieces were
stand-ins. These are the pictures under its names, through the master rig, ON this lane's hospital tool (and the home center's, the
Sphere's and COOK FIVE's chain under them):

  THE FLOOR        prison_floor_0.webp, five tiles by five. Rows 0 to 2: THE DAYROOM's sealed concrete, its painted red line, soot
                   where the fires burned, water's tide marks, a tray, papers. Row 3: FLOODED, where they plugged the toilets: water over
                   it, papers floating, a dry margin. Row 4: the tier's steel deck. (No new ground: the hall's slab, the tunnels' spray,
                   wet and water, the stadium's step, under the plan's dark and pale.)
  THE PIECES       (prison_art.json's kit, COMBAT FOUR's names)
    pr_cells_ew    A RUN OF CELLS seen from the dayroom, a tile wide: five cell fronts, their doors racked open, the dark inside, a
                   bunk and the steel toilet, the cell's number; one door shut with a towel in its window; water running out of one
    pr_cells_ns    a run of cells end on
    pr_bars_ew/_ns the sally port's bars, a tile of them: floor to ceiling, the gate run open, two bars bent apart
    pr_table       steel tables and their stools, bolted: two, the cards and the dominoes of the last game
    pr_mattresses  a mattress barricade: mattresses stacked and on edge against a table on its side
    pr_burned      a burned heap: what was burned (mattresses' frames, a chair), its ash, the soot round it
    pr_desk        the officers' desk on its side, its drawers out, the charger with no radios, the log
    pr_picket      the picket: the glass control room, its glass starred and holed, the console inside dead (a tile's blocker)
    pr_tier        one tile of the upper tier's walkway: steel deck at 1.42 m, its drain line, its edge
    pr_tier_mattress a mattress hung on the tier's rail, another on the walkway
    pr_stair_e/_w  the tier's steel stair: open treads, stringers, rails
    pr_rail_ew/_ns the tier's rail: posts, top and mid rails, mesh between, one panel torn out
  THE CEILING      prison_ceiling.webp (rule 451(a), over the fight at 10%): five bays by five that repeat: the unit's concrete
                   ceiling far up, its beams, the caged lights (most dead, one on), the skylight's bars in some bays, a camera's dome,
                   the soot of the fires on it.

  <venv>/bin/python tools/bohemia_cook6_the_cell_block_finished_11_21_26.py render pr_floor | pr_pieces | ceil_prison
  python3 tools/bohemia_cook6_the_cell_block_finished_11_21_26.py cut
  python3 tools/bohemia_cook6_the_cell_block_finished_11_21_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a prison housing unit (a direct or indirect
supervision pod: two tiers of cells round a dayroom, the upper on a walkway with a rail and steel stairs at its ends, steel cell doors
with a narrow window and a food slot, a steel combination toilet and sink, bolted round steel tables with their stools, a glass control
room; a sally port of bars between units; caged lights on a high concrete ceiling, skylights with bars); a unit taken from inside, in
the order COMBAT FOUR's facts give: mattresses dragged into barricades, the toilets plugged so the floor floods, a fire in the dayroom.
The twins: the hospital's kit and the home center's (the same rig and cut).
REUSE CHECK (REUSE-FIRST): the hospital's tool and everything under it (the Sphere's tier for the walkway's shape, the hall's stair for
the stair's steps). New here: the unit's plan, its pieces, its ceiling's cages, bars and soot.
ANALOG HORROR: the cards of the last game still on the table; a towel stuffed in one cell's window from inside; one light of the unit
still on over the dayroom.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_hospital_finished_11_21_26 as HS            # this lane's: the hospital (and the home center, the Sphere, the chain)

HC = HS.HC; SPH = HS.SPH; SD = HS.SD; TG = HS.TG; FW = HS.FW
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'prison')
DAY, FLOOD, STEP = (0, 1, 2), 3, 4
tile_xy = HS.tile_xy


# ---- the ground ------------------------------------------------------------------------------------------------------------
def plan_pr_floor(ID, seed=201):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['hall_slab'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    pale = np.clip((dust - 0.6) / 0.3, 0, 1) * 0.06; dark = 0.12 + np.clip((0.4 - dust) / 0.3, 0, 1) * 0.05
    for r in (0, 1, 2, 3):
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; G, D, Pl = gid[sy, sx], dark[sy, sx], pale[sy, sx]
            nn = FW.vnoise(X.shape, 0.8 * PPM, rng); Wn = TG.win(X, Y, 1.0, 2.4)
            if r in DAY and rng.rand() < 0.55:                           # the painted red line: where you stand back from
                if rng.rand() < 0.5:
                    y0 = rng.uniform(2.5, 9.5); xa, xb = rng.uniform(1.4, 3.5), rng.uniform(8.0, 10.6)
                    m = (np.abs(Y - y0) < 0.05) & (X > xa) & (X < xb)
                else:
                    x0, y0, w_, h_ = rng.uniform(2.0, 4.5), rng.uniform(2.0, 4.5), rng.uniform(3.0, 5.0), rng.uniform(2.0, 4.0)
                    m = (((np.abs(Y - y0) < 0.05) | (np.abs(Y - y0 - h_) < 0.05)) & (X > x0) & (X < x0 + w_)) | (((np.abs(X - x0) < 0.05) | (np.abs(X - x0 - w_) < 0.05)) & (Y > y0) & (Y < y0 + h_))
                m &= rng.rand(*X.shape) > 0.12; G[m] = ID['tun_spray']; D[m] = 0.15
            if r in DAY and rng.rand() < 0.45:                           # soot where a fire burned
                cx, cy, rr = rng.uniform(4.0, 8.0), rng.uniform(4.0, 8.0), rng.uniform(1.8, 2.6)
                d0 = np.hypot(X - cx, Y - cy) / rr + 0.4 * (nn - 0.5); D[:] = np.maximum(D, np.clip(1.0 - d0, 0, 1) * 0.75)
            if r in DAY:
                for _ in range(rng.randint(1, 3)):                       # water's tide marks, dried
                    cx, cy = rng.uniform(3, 9), rng.uniform(3, 9); v = np.hypot(X - cx, (Y - cy) * 1.3) + 0.5 * (nn - 0.5)
                    rr_ = rng.uniform(1.0, 1.8); Pl[:] = np.maximum(Pl, np.clip(1 - np.abs(v - rr_) / 0.12, 0, 1) * 0.12)   # (soft: hard rings read as drawn outlines)
            if r == FLOOD:                                               # FLOODED: the toilets plugged; water over it, a dry margin
                v = Wn * (0.5 + 0.6 * nn); wet = v > 0.45; D[wet] = 0.45; deep = v > 0.75; G[deep] = ID['tun_wet']; D[deep] = 0.0
                tide = (v > 0.4) & ~wet; Pl[tide] = 0.35
                for _ in range(6):                                       # papers floating
                    px_, py_ = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5); m = (np.abs(X - px_) < 0.15) & (np.abs(Y - py_) < 0.11) & wet
                    G[m] = ID['gar_white']; D[m] = 0.2
    st = row == STEP; gid[st] = ID['st_step']; dark = np.where(st, 0.2, dark); pale = np.where(st, 0.04, pale)
    for x0 in np.arange(0.0, 60.0, 1.2): dark = np.where(st & (np.abs(xm - x0) < 0.012), 0.45, dark)   # the deck's plate joints (the same at every edge)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['pr_floor'] = plan_pr_floor


def pr_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(25.0, 59.4)), 36)


TG.GARAGE_THINGS['pr_floor'] = pr_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
PR_AT = dict(tier=(10.0, 46.0), stair_e=(26.0, 46.0), stair_w=(42.0, 46.0), cells_ns=(57.0, 45.0),
             cells_ew=(10.0, 38.0), rail_ew=(26.0, 39.5), bars_ew=(42.0, 38.0),
             picket=(10.0, 21.0), table=(26.0, 22.0), mattresses=(36.0, 22.0), burned=(45.0, 22.0), desk=(53.0, 22.0),
             rail_ns=(57.5, 21.0), bars_ns=(54.5, 3.0), tier_mattress=(26.0, 5.0))
CELL_H, BAR_H, RAIL_H, PICKET_H = 2.6, 2.7, 1.07, 2.6


def cells_ew(P, ox, oy, rng):
    """A RUN OF CELLS from the dayroom, a tile wide: five cell fronts between block pilasters, their steel doors racked open, the dark
    inside, a bunk and the steel toilet, the cell's number; the upper tier's slab edge over them; one door shut with a towel in its
    window; water running out of one"""
    P.box('conc', ox - 6, ox + 6, oy + 0.3, oy + 0.45, 0.0, CELL_H)                                         # the wall behind the cells' doors
    P.box('conc_d', ox - 6, ox + 6, oy - 0.02, oy + 0.45, 2.15, CELL_H); P.box('conc', ox - 6, ox + 6, oy - 0.03, oy + 0.46, CELL_H, CELL_H + 0.04)   # the slab's edge
    for k in range(5):
        x = ox - 6 + k * 2.4
        P.box('panel', x, x + 0.5, oy, oy + 0.3, 0.0, 2.15)                                                   # the pilaster between cells
        if k in (1, 3): P.box('paint_k', x + 0.08, x + 0.42, oy - 0.005, oy, 0.9 + 0.2 * (k == 3), 1.4)       # names scratched in
        dx0, dx1 = x + 0.5, x + 2.4
        P.box('black', dx0, dx1, oy + 0.3, oy + 0.31, 0.0, 2.1)                                               # the dark inside
        P.box('steel', dx0 + 0.1, dx0 + 1.0, oy + 0.15, oy + 0.29, 0.45, 0.52); P.box('chrome', dx1 - 0.55, dx1 - 0.15, oy + 0.15, oy + 0.29, 0.0, 0.85)   # a bunk's edge; the toilet and sink
        P.box('steel', dx0, dx0 + 0.06, oy - 0.02, oy + 0.3, 0.0, 2.15); P.box('steel', dx1 - 0.06, dx1, oy - 0.02, oy + 0.3, 0.0, 2.15); P.box('steel', dx0, dx1, oy - 0.02, oy + 0.3, 2.05, 2.15)   # its frame
        if k == 2:                                                       # one shut, a towel stuffed in its window from inside
            P.box('pr_door', dx0 + 0.06, dx1 - 0.06, oy - 0.04, oy, 0.0, 2.05); P.box('white', dx0 + 0.75, dx1 - 0.85, oy - 0.045, oy - 0.04, 1.2, 1.85); P.box('steel', dx0 + 0.6, dx1 - 0.6, oy - 0.05, oy - 0.04, 0.95, 1.05)
        else:                                                            # racked open: the door slid behind the pilaster, its edge showing
            P.box('pr_door', dx1 - 0.25, dx1 + 0.02, oy - 0.1, oy - 0.04, 0.0, 2.05)
        P.box('white', dx0 + 0.6, dx0 + 1.3, oy - 0.03, oy - 0.02, 2.2, 2.42); P.box('black', dx0 + 0.72, dx0 + 1.18, oy - 0.035, oy - 0.03, 2.26, 2.36)   # its number
    P.box('stain', ox - 1.0, ox + 0.6, oy - 1.6, oy - 0.02, 0.06, 0.065)                                     # water running out of one


def cells_ns(P, ox, oy, rng):
    P.box('panel', ox - 0.2, ox + 0.2, oy, oy + 12, 0.0, 2.15); P.box('conc_d', ox - 0.22, ox + 0.22, oy, oy + 12, 2.15, CELL_H)
    P.box('conc', ox - 0.23, ox + 0.23, oy, oy + 12, CELL_H, CELL_H + 0.04)
    for k in range(5): y = oy + 0.5 + k * 2.4; P.box('steel', ox - 0.22, ox + 0.22, y, y + 0.08, 0.0, 2.15)


def bars_ew(P, ox, oy, rng):
    """the sally port's bars, a tile of them: floor to ceiling round bars in a frame, flat bars across, the gate run open, two bent"""
    for z in (0.08, 1.2, BAR_H - 0.1): P.box('steel', ox - 6, ox + 6, oy, oy + 0.1, z - 0.04, z + 0.04)
    P.box('steel', ox - 6, ox + 6, oy - 0.02, oy + 0.12, BAR_H - 0.08, BAR_H)
    for k in range(80):
        x = ox - 6 + 0.075 + k * 0.15
        if ox + 1.0 < x < ox + 3.0: continue                             # the gate, run open (its bars to the east, behind)
        if k in (22, 23): P.bar('steel', (x, oy + 0.05, 0.0), (x + (0.12 if k == 23 else -0.12), oy + 0.05, 1.2), 0.022); P.bar('steel', (x + (0.12 if k == 23 else -0.12), oy + 0.05, 1.2), (x, oy + 0.05, BAR_H), 0.022); continue   # bent apart
        P.bar('steel', (x, oy + 0.05, 0.0), (x, oy + 0.05, BAR_H), 0.022)
    for k in range(14): x = ox + 3.1 + k * 0.15; P.bar('steel', (x, oy + 0.2, 0.0), (x, oy + 0.2, BAR_H - 0.1), 0.022)   # the gate's own bars, slid behind
    P.box('steel', ox + 3.0, ox + 5.2, oy + 0.15, oy + 0.25, 1.15, 1.25)


def bars_ns(P, ox, oy, rng):
    for z in (0.08, 1.2, BAR_H - 0.1): P.box('steel', ox - 0.05, ox + 0.05, oy, oy + 12, z - 0.04, z + 0.04)
    for k in range(80): y = oy + 0.075 + k * 0.15; P.bar('steel', (ox, y, 0.0), (ox, y, BAR_H), 0.022)


def stool(P, x, y, ang):
    a, b = (x + 0.6 * math.cos(ang), y + 0.6 * math.sin(ang)), (x + 0.95 * math.cos(ang), y + 0.95 * math.sin(ang))
    P.bar('steel', (a[0], a[1], 0.15), (b[0], b[1], 0.15), 0.03); P.bar('steel', (b[0], b[1], 0.15), (b[0], b[1], 0.42), 0.03); P.drum('pr_steel', b[0], b[1], 0.42, 0.46, 0.18, 10)


def table(P, ox, oy, rng):
    """steel tables and their stools, bolted to the floor: two, and the cards and the dominoes of the last game"""
    for k, (x, y) in enumerate(((ox - 2.6, oy + 1.3), (ox + 2.4, oy + 1.6))):
        P.drum('pr_steel', x, y, 0.0, 0.05, 0.3, 8); P.drum('steel', x, y, 0.05, 0.72, 0.09, 8); P.drum('pr_steel', x, y, 0.72, 0.76, 0.7, 8)   # its pedestal, its top
        for j in range(4): stool(P, x, y, 0.4 + j * math.pi / 2)
        if k == 0:
            for _ in range(9): cx, cy = x + rng.uniform(-0.4, 0.4), y + rng.uniform(-0.4, 0.4); P.box('white', cx, cx + 0.06, cy, cy + 0.09, 0.76, 0.762)   # the cards
            P.drum('can', x + 0.35, y - 0.3, 0.76, 0.86, 0.04, 8)
        else:
            for j in range(7): P.box('paint_w', x - 0.4 + j * 0.1, x - 0.35 + j * 0.1, y, y + 0.1, 0.76, 0.78)   # the dominoes, in a line
    for _ in range(4): x, y = ox + rng.uniform(-4, 4), oy + rng.uniform(-0.5, 0.2); P.box('white', x, x + 0.06, y, y + 0.09, 0.0, 0.002)


def mattresses(P, ox, oy, rng):
    """a mattress barricade: a table on its side, mattresses stacked against it and stood on edge, a chair jammed in"""
    P.box('steel', ox - 1.3, ox + 1.3, oy + 1.4, oy + 1.48, 0.0, 0.9)                                         # a table, on its side
    for k in range(4): P.box('pr_mat' if k % 2 else 'orange', ox - 1.2 + k * 0.05, ox + 0.8 + k * 0.05, oy + 0.4 + k * 0.03, oy + 1.35, k * 0.11, k * 0.11 + 0.1)   # stacked
    for k in range(3): x = ox - 1.25 + k * 0.85; P.prism_x('pr_mat' if k != 1 else 'orange', x, x + 0.8, [(oy + 0.1, 0.0), (oy + 0.22, 0.0), (oy + 1.38, 1.75), (oy + 1.26, 1.75)])   # stood on edge against it
    P.bar('black', (ox + 1.1, oy + 0.5, 0.0), (ox + 1.4, oy + 1.2, 1.1), 0.03); P.bar('black', (ox + 1.5, oy + 0.4, 0.0), (ox + 1.4, oy + 1.2, 1.1), 0.03)   # a chair jammed in


def burned(P, ox, oy, rng):
    """a burned heap: what they burned (mattress frames, a chair, papers), its ash, the soot spread round it on the floor"""
    for k in range(10): r_ = 0.4 + k * 0.17; P.drum('black', ox, oy + 1.2, 0.06 + k * 0.0005, 0.061 + k * 0.0005, 2.0 - k * 0.15, 20)   # the soot
    P.drum('pr_ash', ox, oy + 1.2, 0.06, 0.28, 0.9, 14, 0.3)
    for k in range(6): a = k * 1.05; P.bar('pr_char', (ox + 0.9 * math.cos(a), oy + 1.2 + 0.6 * math.sin(a), 0.06), (ox + 0.2 * math.cos(a + 0.5), oy + 1.2 + 0.2 * math.sin(a + 0.5), 0.5), 0.04)   # charred frames
    P.box('pr_char', ox - 0.9, ox + 0.3, oy + 0.4, oy + 0.48, 0.06, 0.4); P.bar('pr_char', (ox + 0.5, oy + 0.6, 0.06), (ox + 0.9, oy + 1.0, 0.6), 0.03)
    for _ in range(6): x, y = ox + rng.uniform(-1.4, 1.4), oy + rng.uniform(0.2, 2.2); P.box('paper', x, x + 0.15, y, y + 0.1, 0.06, 0.065)


def desk(P, ox, oy, rng):
    """the officers' desk on its side, its drawers out on the floor, the charger with no radios, the log"""
    P.box('pr_steel', ox - 1.0, ox + 1.0, oy + 0.9, oy + 1.65, 0.0, 0.75)                                        # on its back, its top to the south
    P.box('panel', ox - 1.02, ox + 1.02, oy + 0.88, oy + 0.9, 0.0, 0.75)
    for k in range(3): x = ox - 0.9 + k * 0.6; P.box('pr_steel', x, x + 0.45, oy + 0.1 + (k % 2) * 0.2, oy + 0.6 + (k % 2) * 0.2, 0.0, 0.2)   # its drawers
    P.box('black', ox + 1.3, ox + 1.9, oy + 1.0, oy + 1.25, 0.0, 0.12)
    for k in range(6): P.box('black', ox + 1.33 + k * 0.095, ox + 1.4 + k * 0.095, oy + 1.04, oy + 1.2, 0.12, 0.16)   # the charger's empty slots
    P.box('paper', ox - 0.6, ox - 0.2, oy - 0.3, oy, 0.0, 0.03); P.box('black', ox + 0.3, ox + 0.8, oy - 0.5, oy - 0.1, 0.0, 0.4)   # the log; a chair, down


def picket(P, ox, oy, rng):
    """the picket: the glass control room, a tile's blocker: its steel and block to the sill, glass above, starred and holed; the
    console inside dead; its door bent open"""
    x0, x1, y0, y1 = ox - 4.5, ox + 4.5, oy + 0.5, oy + 8.0
    for (a, b) in (((x0, y0), (x1, y0)), ((x0, y1), (x1, y1)), ((x0, y0), (x0, y1)), ((x1, y0), (x1, y1))):
        xa, xb = sorted((a[0], b[0])); ya, yb = sorted((a[1], b[1]))
        P.box('conc', xa - 0.12, xb + 0.12, ya - 0.12, yb + 0.12, 0.0, 1.0); P.box('pr_steel', xa - 0.14, xb + 0.14, ya - 0.14, yb + 0.14, 1.0, 1.06)
        P.box('rail_glass', xa - 0.02, xb + 0.02, ya - 0.02, yb + 0.02, 1.06, PICKET_H - 0.12); P.box('pr_steel', xa - 0.14, xb + 0.14, ya - 0.14, yb + 0.14, PICKET_H - 0.12, PICKET_H)
    for k in range(1, 6): x = x0 + k * 1.5; P.box('pr_steel', x - 0.05, x + 0.05, y0 - 0.14, y0 + 0.05, 1.0, PICKET_H)   # its mullions
    for k in range(3): y = y0 + 2.0 + k * 2.2; P.box('pr_steel', x0, x1, y - 0.1, y + 0.1, PICKET_H - 0.2, PICKET_H - 0.05)   # its roof's beams (the roof long gone)
    for (cx, cz) in ((x0 + 2.2, 1.8), (x0 + 6.4, 1.6)):                  # starred: a hit, its cracks
        for k in range(8): a = k * 0.785; P.bar('white', (cx, y0 - 0.03, cz), (cx + 0.5 * math.cos(a), y0 - 0.03, cz + 0.4 * math.sin(a)), 0.008)
    P.box('black', x0 + 4.6, x0 + 5.5, y0 - 0.04, y0 - 0.02, 1.3, 2.1)                                          # holed
    P.box('pr_steel', x0 + 0.6, x1 - 0.6, y0 + 0.4, y0 + 1.2, 0.0, 0.9); P.prism_x('pr_steel', x0 + 0.6, x1 - 0.6, [(y0 + 0.4, 0.9), (y0 + 1.2, 0.9), (y0 + 1.2, 1.2)])   # the console
    for k in range(18): x = x0 + 0.8 + k * 0.42; P.box('white' if k % 5 else 'red', x, x + 0.06, y0 + 0.6, y0 + 0.66, 0.92, 0.95)   # its switches, dead
    for k in range(4): x = x0 + 1.2 + k * 2.0; P.box('black', x, x + 0.8, y0 + 1.1, y0 + 1.18, 1.2, 1.7)        # its monitors
    for k in range(2): x = x0 + 2.5 + k * 3.8; P.drum('black', x, y0 + 2.0, 0.0, 0.06, 0.28, 5); P.drum('black', x, y0 + 2.0, 0.42, 0.5, 0.25, 12)
    P.prism_y('pr_steel', y1 - 0.2, y1 + 1.2, [(x1, 0.0), (x1 + 0.06, 0.0), (x1 + 0.06, 2.1), (x1, 2.1)])      # its door, bent open
    for _ in range(20): x, y = rng.uniform(x0 - 0.8, x1 + 0.8), y0 - rng.uniform(0.2, 1.4); P.box('glassbit', x, x + rng.uniform(0.05, 0.14), y, y + rng.uniform(0.04, 0.1), 0.0, 0.012)


def tier(P, ox, oy, rng):
    """one tile of the upper tier's walkway: a steel deck at 1.42 m on its slab, plate joints the same at every edge, a drain line, a
    tray dropped, its edge"""
    P.box('conc_d', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.03); P.box('pr_steel', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.03, LEVEL_H)
    for k in range(1, 10): x = ox - 6 + k * 1.2; P.box('black', x - 0.008, x + 0.008, oy, oy + 12, LEVEL_H, LEVEL_H + 0.002)
    P.box('black', ox - 6, ox + 6, oy + 11.2, oy + 11.26, LEVEL_H, LEVEL_H + 0.003)                           # its drain line, along the cells
    P.box('conc', ox - 6, ox + 6, oy - 0.03, oy, 0.0, LEVEL_H)                                               # its edge
    P.box('pr_steel', ox + 2.0, ox + 2.45, oy + 3.0, oy + 3.32, LEVEL_H, LEVEL_H + 0.03); P.box('paper', ox - 3.0, ox - 2.7, oy + 5.0, oy + 5.2, LEVEL_H, LEVEL_H + 0.005)   # a tray, a letter


def stair(P, ox, oy, sgn):
    """the tier's steel stair: twelve open treads a tile long, its stringers, its rails"""
    n = 12
    for i in range(n):
        xa = ox - 6 + i if sgn > 0 else ox + 6 - i - 1; z = LEVEL_H * (i + 1) / n
        P.box('pr_steel', xa, xa + 1, oy + 0.3, oy + 11.7, z - 0.04, z)
        P.box('black', xa if sgn > 0 else xa + 0.94, xa + 0.06 if sgn > 0 else xa + 1, oy + 0.3, oy + 11.7, z - 0.045, z + 0.002)   # its nosing's shadow
    xl, xh = (ox - 6, ox + 6) if sgn > 0 else (ox + 6, ox - 6)
    for yy in (oy, oy + 11.7):
        pr = [(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.25), (xl, 0.25)]
        P.prism_y('pr_steel', yy, yy + 0.3, pr if sgn < 0 else pr[::-1])
        P.bar('steel', (xl, yy + 0.15, 1.0), (xh, yy + 0.15, LEVEL_H + 1.0), 0.03)
        for k in range(7): t = k / 6.0; x = xl + (xh - xl) * t; P.bar('steel', (x, yy + 0.15, LEVEL_H * t + 0.2), (x, yy + 0.15, LEVEL_H * t + 1.0), 0.02)


def rail_ew(P, ox, oy, rng):
    """the tier's rail: posts every 1.5 m, top and mid rails, expanded mesh between, one panel torn out"""
    for k in range(9): x = ox - 6 + k * 1.5 + (0.03 if k == 0 else -0.03 if k == 8 else 0.0); P.box('steel', x - 0.03, x + 0.03, oy + 0.05, oy + 0.11, 0.0, RAIL_H)
    for z in (RAIL_H, 0.55): P.tube_x('steel', ox - 6, ox + 6, oy + 0.08, z, 0.025, 8)
    for k in range(8):
        x = ox - 6 + k * 1.5
        if k == 5: P.prism_y('hc_deck', oy - 0.6, oy + 0.05, [(x + 0.1, 0.0), (x + 1.4, 0.0), (x + 1.4, 0.03), (x + 0.1, 0.03)]); continue   # torn out, on the floor below
        P.box('hc_deck', x + 0.05, x + 1.45, oy + 0.07, oy + 0.09, 0.1, RAIL_H - 0.05)


def rail_ns(P, ox, oy, rng):
    for k in range(9): y = oy + k * 1.5 + (0.03 if k == 0 else -0.03 if k == 8 else 0.0); P.box('steel', ox - 0.03, ox + 0.03, y - 0.03, y + 0.03, 0.0, RAIL_H)
    P.box('steel', ox - 0.03, ox + 0.03, oy, oy + 12, RAIL_H - 0.05, RAIL_H)
    P.box('hc_deck', ox - 0.01, ox + 0.01, oy, oy + 12, 0.1, RAIL_H - 0.05)


def tier_mattress(P, ox, oy, rng):
    """a mattress hung over the tier's rail (the rail at the tier's south edge, 2.16 m south of this foot: your 'at' [0.5, 0.82]),
    another on the walkway with a blanket, the shoes"""
    yr = oy - 2.16
    P.prism_x('pr_mat', ox - 1.0, ox + 0.9, [(yr - 0.12, 0.25), (yr - 0.02, 0.25), (yr + 0.12, RAIL_H + 0.1), (yr + 0.02, RAIL_H + 0.1)])   # over the rail, hanging to the dayroom
    P.prism_x('pr_mat', ox - 1.0, ox + 0.9, [(yr + 0.02, RAIL_H + 0.1), (yr + 0.12, RAIL_H + 0.1), (yr + 0.5, 0.6), (yr + 0.4, 0.6)])
    P.box('orange', ox + 1.4, ox + 2.2, yr + 0.4, yr + 2.3, 0.0, 0.1); P.box('blue', ox + 1.45, ox + 2.15, yr + 0.9, yr + 2.2, 0.1, 0.14)   # another, on the walkway
    for k in range(2): P.box('white', ox + 2.4 + k * 0.14, ox + 2.5 + k * 0.14, yr + 0.7, yr + 0.95, 0.0, 0.08)


def pr_parts(P, rng):
    A = PR_AT
    tier(P, *A['tier'], rng); stair(P, *A['stair_e'], 1); stair(P, *A['stair_w'], -1); cells_ns(P, *A['cells_ns'], rng)
    cells_ew(P, *A['cells_ew'], rng); rail_ew(P, *A['rail_ew'], rng); bars_ew(P, *A['bars_ew'], rng)
    picket(P, *A['picket'], rng); table(P, *A['table'], rng); mattresses(P, *A['mattresses'], rng); burned(P, *A['burned'], rng); desk(P, *A['desk'], rng)
    rail_ns(P, *A['rail_ns'], rng); bars_ns(P, *A['bars_ns'], rng); tier_mattress(P, *A['tier_mattress'], rng)


def pr_mats(bpy, NF, F, M, which):
    if which not in ('pr_pieces', 'tun_pieces'): return
    if which == 'pr_pieces': HS.hs_mats(bpy, NF, F, M, 'hs_pieces')
    M.update(pr_steel=NF.material(bpy, 'in_paint_steel_grey', 'tape_grey', 2, 0.9), pr_door=NF.material(bpy, 'in_paint_cell_door', 'clay_teal', 3, 0.9),
             pr_mat=NF.material(bpy, 'in_black_vinyl_mattress', 'clay_teal', 2, 0.9), pr_char=NF.material(bpy, 'in_black_char', 'rubber', 0, 1.0),
             pr_ash=NF.material(bpy, 'in_ash', 'tape_grey', 3, 0.85), pr_cage=NF.material(bpy, 'in_ceil_light_cage', 'tape_grey', 1, 0.9))


TG.PARTS['pr_pieces'] = pr_parts
TG.MAT_HOOKS.append(pr_mats)


# ---- the ceiling: the unit's concrete ceiling, five bays by five that repeat ----------------------------------------------
def ceil_prison(P, rng):
    """the unit's concrete ceiling far up: the slab, a beam on every bay's line, the caged lights (most dead, one on), the skylight's
    bars in some bays, a camera's dome, the smoke detectors, the soot of the fires"""
    at, band_y = TG.at, TG.band_y
    P.box('slab', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)
    for r in range(-1, 7): ya, yb = band_y(r, 0.0, 1.0, 0.8); P.box('conc', -3.0, 63.0, ya, yb, 0.0, 0.8)
    for c in range(6): x = c * TMT; P.box('conc', x - 0.5, x + 0.5, -3.0, 63.0, 0.0, 0.81)
    for r in range(5):
        for c in range(5):
            if (r + c) % 3 == 0:                                         # the skylight and its bars
                x, y = at(c, r, 6.0, 4.0, 0.0); P.box('clearp', x - 2.0, x + 2.0, y - 1.0, y + 1.0, 0.0, 0.05)
                for k in range(13): P.box('steel', x - 1.95 + k * 0.32, x - 1.9 + k * 0.32, y - 1.0, y + 1.0, 0.05, 0.12)
                P.box('steel', x - 2.0, x + 2.0, y - 0.05, y + 0.05, 0.12, 0.16)
            for (lx, ly) in ((3.0, 8.5), (9.0, 8.5)):                    # the caged lights
                x, y = at(c, r, lx, ly, 0.5); lit = (c, r, lx) == (2, 2, 9.0)
                P.drum('lit' if lit else 'white', x, y, 0.4, 0.5, 0.35, 12); P.drum('pr_cage', x, y, 0.5, 0.52, 0.42, 12)
                for k in range(6): a = k * 1.047; P.bar('pr_cage', (x + 0.4 * math.cos(a), y + 0.4 * math.sin(a), 0.4), (x + 0.4 * math.cos(a), y + 0.4 * math.sin(a), 0.62), 0.012)
                P.bar('black', (x, y, 0.0), (x, y, 0.4), 0.02)
            x, y = at(c, r, 6.0, 10.5, 0.0); P.drum('white', x, y, 0.0, 0.05, 0.12, 10)                            # a smoke detector
            if (2 * r + c) % 4 == 1: x, y = at(c, r, 10.5, 2.0, 0.0); P.drum('hs_dome', x, y, 0.0, 0.12, 0.18, 12, 0.08)   # a camera's dome
            if rng.rand() < 0.5:                                         # the soot of the fires below, on the slab
                x, y = at(c, r, rng.uniform(2, 10), rng.uniform(2, 10), 0.01); TG.bloom(P, 'black', x, y, rng.uniform(1.0, 2.0), rng, 7)


TG.CEILINGS['prison'] = (ceil_prison, 'prison/prison_ceiling.webp', "the unit's concrete ceiling far up: the slab and a beam on every bay's line, the caged lights (most dead, one on), the skylight's bars in some bays, a camera's dome, the smoke detectors, the soot of the fires")
TG.CEIL_DATA['prison'] = 'prison/prison.json'

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(tier='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', cells_ew='WALL', cells_ns='WALL', rail_ew='RAIL', rail_ns='RAIL', bars_ew='WALL', bars_ns='WALL',
            picket='COVER', table='LOW_COVER', mattresses='COVER', burned='LOW_COVER', desk='COVER', tier_mattress='LOW_COVER')
HM = dict(tier=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, cells_ew=CELL_H, cells_ns=CELL_H, rail_ew=RAIL_H, rail_ns=RAIL_H, bars_ew=BAR_H, bars_ns=BAR_H,
          picket=PICKET_H, table=0.86, mattresses=1.75, burned=0.6, desk=0.75, tier_mattress=1.17)
NAME = dict(tier='THE TIER', stair_e='ITS STAIRS, EAST', stair_w='ITS STAIRS, WEST', cells_ew='A RUN OF CELLS', cells_ns='A RUN OF CELLS', rail_ew="THE TIER'S RAIL",
            rail_ns="THE TIER'S RAIL", bars_ew="THE SALLY PORT'S BARS", bars_ns="THE SALLY PORT'S BARS", picket='THE PICKET', table='A BOLTED TABLE',
            mattresses='A MATTRESS BARRICADE', burned='A BURNED HEAP', desk="THE OFFICERS' DESK", tier_mattress='A MATTRESS ON THE RAIL')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'pr_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'prison_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'pr_pieces.png')).convert('RGBA'); A = PR_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'pr_' + key, 'prison', shadow)
    for key in ('tier', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.1, y + 12.0 + hh + (1.7 if key != 'tier' else 0.6)), 1.0 if key == 'tier' else 0.0)
    x, y = A['cells_ew']; one('cells_ew', (x - 6.0, x + 6.0 + 0.01, y - 1.7, y + 0.5 + CELL_H * 1.45), 1.0)
    x, y = A['cells_ns']; one('cells_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + CELL_H * 1.45), 0.5)
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.7, y + 0.3 + RAIL_H * 1.45 + 0.2), 0.4)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.6, x + 0.6, y - 0.1, y + 12.1 + RAIL_H * 1.45), 0.4)
    x, y = A['bars_ew']; one('bars_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.3, y + 0.4 + BAR_H * 1.45), 0.6)
    x, y = A['bars_ns']; one('bars_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + BAR_H * 1.45), 0.5)
    x, y = A['picket']; one('picket', (x - 5.6, x + 6.0, y - 1.6, y + 9.5 + PICKET_H * 1.45), 1.0)
    x, y = A['table']; one('table', (x - 4.0, x + 3.8, y - 0.6, y + 2.9 + 0.9 * 1.45), 1.0)
    x, y = A['mattresses']; one('mattresses', (x - 1.6, x + 1.8, y - 0.2, y + 1.6 + 1.8 * 1.45), 1.0)
    x, y = A['burned']; one('burned', (x - 2.2, x + 2.2, y - 0.9, y + 3.3 + 0.7 * 1.45), 1.0)
    x, y = A['desk']; one('desk', (x - 1.3, x + 2.2, y - 0.7, y + 1.8 + 0.8 * 1.45), 1.0)
    x, y = A['tier_mattress']; one('tier_mattress', (x - 1.3, x + 2.8, y - 2.6, y + 0.4 + 1.3 * 1.45), 1.0)
    for key, v in sz.items():
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'pr_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='prison/pr_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['prison/prison_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'pr_' + k: ent(k) for k in sz}
    art = {'version': 'cook6-prison-art-11-21', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's cell block (slices/fight_ground/prison/prison.json, BUILD 11/20w): the names its handoff asked for, the garage's format. floor.floor is the dayroom's sealed concrete (rows 0 to 2: its painted red line, soot where the fires burned, water's tide marks; nothing within 1.2 m of an edge but the concrete); floor.wet the dayroom flooded (row 3: water over it where they plugged the toilets, papers floating, a dry margin so it meets the floor); floor.high the tier's steel deck (row 4, plate joints every 1.2 m, the same at every edge); floor.ring the concrete. Any tile of a list meets any tile of it.",
           'floor': {'floor': cells(DAY), 'wet': cells((FLOOD,)), 'high': cells((STEP,)), 'ring': cells(DAY)}, 'kit': kit,
           'how_it_lays': {'the cells': "pr_cells_ew is a tile wide: five cell fronts at 2.4 m, 2.6 m up to the slab's edge, foot its face's middle; pr_cells_ns end on. pr_bars_ew / _ns: the sally port's bars, 2.7 m, a tile long (your 'Y', an air wall), the gate run open.",
                           'the tier': "pr_tier on every high tile, 1.42 m up, foot its south edge middle; pr_stair_e / _w the steel stair; pr_rail_ew / _ns the rail with its mesh; pr_tier_mattress (your 'at' [0.5, 0.82], lifted) hangs on the rail 2.16 m south of its foot.",
                           'the dayroom': "pr_table two tables and their stools; pr_mattresses; pr_burned (its soot on the floor round it); pr_desk; foot each at its south edge middle.",
                           'the picket': "pr_picket a glass control room 9 by 7.5 m, 2.6 m up, foot its south face middle (your 'at' [0.5, 0.95]); your two by two of 'P' lays four, one block of glass."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'prison_art.json'))
    cp = os.path.join(REND, 'ceil_prison.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'prison_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'prison/prison.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "prison/prison_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):   # (the one agreed edit in COMBAT FOUR's file)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='prison/prison_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['prison'][2],
                              contract="prison.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat")
    json.dump(art, open(os.path.join(SHIP, 'prison_art.json'), 'w'), indent=1)
    print('prison: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')



def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_CELL_BLOCK_11_21.webp: before and now on his phone (the ceiling off and at his 10%), the two units,
    close in, the pieces at their own pixels, a tile of the dayroom and of the flood, the ceiling at full strength"""
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    title('THE CELL BLOCK, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the unit\'s ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'prison_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'prison_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'prison_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the cells and the tier over them, the dayroom\'s tables and barricades, the picket')
    strip([(lab, up(os.path.join(page_dir, 'prison_upright_%s.png' % n))) for lab, n in (('THE CELLS, THE TIER', 'cells_close'), ('THE DAYROOM', 'dayroom_close'), ('THE PICKET', 'picket_close'))], cw, ch)
    tu = os.path.join(page_dir, 'tu', 'prison_upright_open_a0.png')
    if os.path.exists(tu):
        title('THE OTHER LAYOUT: TWO UNITS', 'two units across the sally port\'s bars; and close in on the bars')
        strip((('TWO UNITS', up(tu)), ('THE BARS', up(os.path.join(page_dir, 'tu', 'prison_upright_bars_close.png'))), ('THE CEILING AT 10%', up(os.path.join(page_dir, 'tu', 'prison_upright_open_a01.png')))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the cells, the bars, the picket, the tables, the barricade, the burned heap, the desk, the tier and its stair, its rail and the mattress on it')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'pr_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('cells_ew', 'bars_ew'), 130); row_of(('picket', 'tier'), 280); row_of(('table', 'mattresses', 'burned', 'desk'), 150); row_of(('stair_e', 'rail_ew', 'tier_mattress'), 160)
    title('THE DAYROOM, THE FLOOD, AND THE CEILING AT FULL STRENGTH', 'its red line and the soot of a fire; the toilets plugged; the unit\'s ceiling, its caged lights, one on')
    fl = Image.open(os.path.join(SHIP, 'prison_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'prison_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_CELL_BLOCK_11_21.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-cell-block-11-21.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'pr_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'pr_pieces' else TG.scene_ceiling('prison', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_pr_floor(ID)
        col = {ID['hall_slab']: (150, 147, 140), ID['tun_spray']: (150, 82, 50), ID['tun_wet']: (88, 90, 76), ID['gar_white']: (178, 174, 162), ID['st_step']: (146, 143, 136)}
        img = np.zeros((H, W, 3), np.float32)
        for k, c in col.items(): img[gid == k] = c
        img = img * (1 - dark[..., None] * 0.7) + (255 - img) * pale[..., None] * 0.35
        fn = os.path.join(TG.OUT, 'pr_floor_plan.png'); Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(fn); print(fn)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
