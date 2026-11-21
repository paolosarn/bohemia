#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the school, finished] (11/21/26; COMBAT FOUR's BUILD 11/21m asked 'FOR COOK (SIX)'; VAMILY rules 461, 453,
441, 416, 451(a), 455).

COMBAT FOUR's fifteenth inside (THE SCHOOL, slices/fight_ground/school/school.json, laid by slices/bohemia_big_inside.js): the gym as
the town's shelter that never emptied (cots, mats, tables folded on their wheels, the bleachers pulled out), or the classroom wing
(rooms of desks off one hallway lined with lockers, a door at each end of every room). All 13 of its pieces were stand-ins. These are
the pictures under its names, through the master rig, ON this lane's cell block tool (and the hospital's, the home center's, the
Sphere's and COOK FIVE's chain under them):

  THE FLOOR        school_floor_0.webp, five tiles by five. Rows 0 to 2: THE SCHOOL'S MAPLE, the boards' strips and their ends, the
                   finish worn grey in the paths people walked, scuffs, a cot's leg marks, a drawing in chalk. Rows 3 and 4 the same.
                   ONE FLOOR FOR BOTH LAYOUTS (COMBAT FOUR's file has one kind, 'floor', for the gym and the classrooms), so no court
                   lines: a line on a few tiles would scatter fragments over every classroom. (No new ground: the tunnels' silt as the
                   wood, under the plan's dark and pale.)
  THE PIECES       (school_art.json's kit, COMBAT FOUR's names)
    sc_bleachers   bleachers pulled out, a tile wide: eight rows of benches on their steel, stepping to the wall, blankets on them
    sc_cots_a / _b shelter cots: four in a row with their blankets and bags; two with a tarp strung between them, a toy
    sc_mats        gym mats on their cart, two laid out as a bed
    sc_tables      cafeteria tables folded on their wheels, standing; one unfolded with a stove and pots on it
    sc_desks       student desks in rows, some over
    sc_teacher     the teacher's steel desk, its chair, the attendance book, the globe
    sc_barricade   desks piled into a barricade with a table and chairs in it
    sc_case        the trophy case, glass gone, the trophies left, the team's photograph
    sc_wall_ew/_ns the block wall: painted, the school's stripe, a bulletin board of papers, the clock stopped
    sc_lockers_ew/_ns a run of lockers, a tile of them, doors hanging open, a padlock left
  THE CEILING      school_ceiling.webp (rule 451(a), over the fight at 10%): five bays by five that repeat: the dropped ceiling's
                   grid (the hospital's, the casino's), tiles out in clusters, the light panels dead, the PA's speaker in every bay.

  <venv>/bin/python tools/bohemia_cook6_the_school_finished_11_21_26.py render sc_floor | sc_pieces | ceil_school
  python3 tools/bohemia_cook6_the_school_finished_11_21_26.py cut
  python3 tools/bohemia_cook6_the_school_finished_11_21_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): an American school used as a Red Cross
shelter (the gym filled with cots, blankets and bags, the bleachers pulled out, cafeteria tables folded on their casters); the
classroom wing (student chair-desks in rows, a steel teacher's desk, painted block walls with bulletin boards and a clock, a hallway
lined with lockers, a trophy case by the gym; a lay-in ceiling with 2 by 4 lights and a PA speaker in each room); maple floors.
The twins: this lane's hospital kit (its ceiling grid) and the cell block's (the same rig and cut).
REUSE CHECK (REUSE-FIRST): the hospital's dropped ceiling, the Sphere's tier treads' idea for the bleachers' rows, the home center's
flatbed casters; COOK FIVE's rig, grounds, Parts and cutter. New here: the school's plan, its pieces, the PA in its ceiling.
ANALOG HORROR: a shelter that never emptied; the clock on the wall stopped; the PA's grille in every room's ceiling that clicks on with
nobody speaking (COMBAT FOUR's line); a child's toy on a cot.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_cell_block_finished_11_21_26 as CB          # this lane's: the cell block (and the hospital, the home center, ...)

HS = CB.HS; HC = CB.HC; SD = CB.SD; TG = CB.TG; FW = CB.FW
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'school')
ROWS = (0, 1, 2, 3, 4)
tile_xy = HS.tile_xy


# ---- the ground: the school's maple ---------------------------------------------------------------------------------------------
def plan_sc_floor(ID, seed=211):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['tun_silt'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    pale = np.clip((dust - 0.6) / 0.3, 0, 1) * 0.06; dark = 0.04 + np.clip((0.4 - dust) / 0.3, 0, 1) * 0.04
    # the boards: strips 6 cm wide running east to west, their ends staggered (a strip's end at a whole number of 0.3 m so a tile's
    # edge, at 12 m, is always a board end: any tile meets any tile)
    strip = np.floor(ly / 0.06).astype(np.int32)
    seam = (np.abs(ly - (strip + 0.5) * 0.06) > 0.026)
    dark = np.where(seam, dark + 0.12, dark)
    tone = np.random.RandomState(seed + 1).rand(256)                       # each strip its own tone, a hair
    dark = dark + (tone[strip % 256] - 0.5) * 0.05
    off = np.random.RandomState(seed + 2).randint(0, 40, 256) * 0.3
    ends = (np.abs(((lx + off[strip % 256]) % 1.8) - 0.0) < 0.012); dark = np.where(ends, dark + 0.18, dark)
    for r in ROWS:
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]
            nn = FW.vnoise(X.shape, 1.2 * PPM, rng); Wn = TG.win(X, Y, 1.0, 2.4)
            for _ in range(rng.randint(1, 3)):                           # the finish worn grey where people walked
                cx, cy = rng.uniform(3, 9), rng.uniform(3, 9); ang = rng.uniform(0, math.pi)
                d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang)); m = np.clip(1 - d0 / 1.2, 0, 1) * Wn * (0.6 + 0.4 * nn)
                Pl[:] = np.maximum(Pl, m * 0.22)
            for _ in range(rng.randint(5, 10)):                          # black scuffs
                cx, cy = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5); L_ = rng.uniform(0.1, 0.35); a0 = rng.uniform(0, 6.3)
                t = np.clip(((X - cx) * math.cos(a0) + (Y - cy) * math.sin(a0)) / L_, -1, 1); d0 = np.hypot(X - cx - t * L_ * math.cos(a0), Y - cy - t * L_ * math.sin(a0))
                D[d0 < 0.02] = 0.55
            for _ in range(rng.randint(2, 5)):                           # a cot's leg marks, in fours
                cx, cy = rng.uniform(2, 9.5), rng.uniform(2, 9.5)
                for (dx, dy) in ((0, 0), (0.7, 0), (0, 1.9), (0.7, 1.9)): D[np.hypot(X - cx - dx, Y - cy - dy) < 0.04] = 0.5
            if rng.rand() < 0.3:                                         # a drawing in chalk: a hopscotch's boxes
                cx, cy = rng.uniform(3, 7), rng.uniform(3, 8)
                for k in range(5):
                    y0 = cy + k * 0.5; m = ((np.abs(Y - y0) < 0.015) | (np.abs(Y - y0 - 0.5) < 0.015)) & (np.abs(X - cx) < 0.25) | ((np.abs(np.abs(X - cx) - 0.25) < 0.015) & (Y > y0) & (Y < y0 + 0.5))
                    Pl[m] = 0.6
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['sc_floor'] = plan_sc_floor


def sc_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(1.0, 59.4)), 40)


TG.GARAGE_THINGS['sc_floor'] = sc_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
SC_AT = dict(bleachers=(10.0, 46.0), lockers_ew=(26.0, 46.0), case=(42.0, 46.0), wall_ns=(57.0, 45.0),
             wall_ew=(10.0, 37.0), cots_a=(26.0, 33.0), cots_b=(38.0, 33.0), lockers_ns=(57.5, 22.0),
             mats=(8.0, 20.0), tables=(19.0, 20.0), desks=(30.0, 19.0), teacher=(42.0, 20.0), barricade=(50.5, 20.0))
WALL_H, LOCK_H, BLEACH_H = 2.4, 1.9, 2.5


def bleachers(P, ox, oy, rng):
    """bleachers pulled out from the wall, a tile wide: eight rows of benches on their steel, each a step up toward the wall (north),
    the seat boards and the foot boards, blankets left on them, a bag, names written on a riser"""
    n = 8; dep = 0.45
    for k in range(n):
        y = oy + k * dep; z = 0.3 * (k + 1)
        P.box('sc_frame', ox - 6, ox + 6, y, y + dep, z - 0.3, z - 0.26)                                        # the deck under it
        P.box('sc_wood', ox - 6, ox + 6, y + dep * 0.55, y + dep, z, z + 0.04)                                  # the seat board
        P.box('sc_wood', ox - 6, ox + 6, y, y + dep * 0.5, z - 0.26, z - 0.23)                                  # the foot board
        P.box('sc_frame', ox - 6, ox + 6, y + dep * 0.5, y + dep * 0.52, z - 0.26, z)                            # the riser
    for x in (ox - 4.5, ox - 1.5, ox + 1.5, ox + 4.5):                  # its steel, under each row only (full height, the first
        for k in range(1, n): y = oy + k * dep; P.box('sc_frame', x - 0.04, x + 0.04, y + 0.02, y + 0.1, 0.0, 0.3 * (k + 1) - 0.3)   #  render's posts cut slashes through the benches)
    for (k, x0, w_, m) in ((2, ox - 3.4, 1.8, 'rug'), (5, ox + 1.0, 1.6, 'blue'), (6, ox - 0.6, 1.2, 'tan')):     # blankets left on them
        y = oy + k * dep; z = 0.3 * (k + 1); P.box(m, x0, x0 + w_, y + 0.2, y + dep, z + 0.04, z + 0.1)
    P.box('black', ox + 3.6, ox + 4.1, oy + 3 * dep + 0.25, oy + 4 * dep, 1.24, 1.5)                          # a bag
    P.box('paint_k', ox - 5.0, ox - 4.2, oy + 2 * dep + 0.225, oy + 2 * dep + 0.234, 0.7, 0.8)                # names on a riser


def cot(P, x, y, blanket=None, bag=True, rng=None):
    """a shelter cot, its canvas on an aluminium frame (0.7 by 1.9 m), a blanket, a bag under it"""
    P.box('chrome', x - 0.35, x + 0.35, y, y + 1.9, 0.38, 0.42); P.box('sc_canvas', x - 0.33, x + 0.33, y + 0.02, y + 1.88, 0.42, 0.45)
    for (dx, dy) in ((-0.3, 0.1), (0.3, 0.1), (-0.3, 1.8), (0.3, 1.8), (-0.3, 0.95), (0.3, 0.95)): P.bar('chrome', (x + dx, y + dy, 0.0), (x + dx, y + dy, 0.4), 0.015)
    if blanket: P.box(blanket, x - 0.34, x + 0.34, y + 0.1, y + 1.3, 0.45, 0.52); P.box('white', x - 0.22, x + 0.22, y + 1.4, y + 1.8, 0.45, 0.55)
    if bag: P.box(('black', 'teal', 'red', 'blue')[int((x * 7 + y) % 4)], x - 0.25, x + 0.25, y + 0.3, y + 0.8, 0.0, 0.3)


def cots_a(P, ox, oy, rng):
    for k, m in enumerate(('rug', 'blue', None, 'tan')): cot(P, ox - 1.8 + k * 1.2, oy + 0.4, m)
    P.drum('jug', ox + 2.6, oy + 0.6, 0.0, 0.32, 0.12, 8); P.box('paper', ox - 2.5, ox - 2.2, oy + 0.0, oy + 0.2, 0.0, 0.01)


def cots_b(P, ox, oy, rng):
    cot(P, ox - 1.1, oy + 0.4, 'cloth'); cot(P, ox + 0.9, oy + 0.4, 'rug')
    P.bar('chrome', (ox - 1.7, oy + 2.4, 0.0), (ox - 1.7, oy + 2.4, 1.7), 0.02); P.bar('chrome', (ox + 1.6, oy + 2.4, 0.0), (ox + 1.6, oy + 2.4, 1.7), 0.02)
    P.box('blue', ox - 1.7, ox + 1.6, oy + 2.36, oy + 2.42, 0.4, 1.7)                                         # a tarp strung between them
    P.box('red', ox + 0.6, ox + 0.85, oy + 0.6, oy + 0.85, 0.52, 0.72); P.drum('haz', ox + 0.72, oy + 0.72, 0.72, 0.86, 0.09, 8)   # a toy on the cot


def mats(P, ox, oy, rng):
    """gym mats on their cart, folded; two laid out on the floor as a bed"""
    P.box('steel', ox - 1.0, ox + 1.0, oy + 0.6, oy + 1.8, 0.12, 0.18)
    for (dx, dy) in ((-0.9, 0.7), (0.9, 0.7), (-0.9, 1.7), (0.9, 1.7)): P.drum('black', ox + dx, oy + dy, 0.0, 0.12, 0.06, 8)
    for k in range(6): P.box('sc_mat', ox - 0.95, ox + 0.95, oy + 0.62, oy + 1.78, 0.18 + k * 0.12, 0.29 + k * 0.12); P.box('black', ox - 0.95, ox + 0.95, oy + 0.6, oy + 0.62, 0.18 + k * 0.12, 0.29 + k * 0.12)
    P.box('sc_mat', ox + 1.4, ox + 2.6, oy + 0.0, oy + 2.4, 0.0, 0.05); P.box('rug', ox + 1.5, ox + 2.5, oy + 0.2, oy + 1.6, 0.05, 0.1); P.box('white', ox + 1.7, ox + 2.3, oy + 1.8, oy + 2.2, 0.05, 0.13)


def tables(P, ox, oy, rng):
    """cafeteria tables folded on their wheels, standing; one unfolded with a stove and pots on it"""
    for k in range(2):
        x = ox - 2.0 + k * 1.1
        P.box('sc_frame', x - 0.4, x + 0.4, oy + 0.6, oy + 0.7, 0.0, 0.2)
        for dx in (-0.35, 0.35): P.drum('black', x + dx, oy + 0.65, 0.0, 0.12, 0.06, 8)
        P.box('sc_top', x - 0.05, x, oy + 0.1, oy + 1.2, 0.2, 1.8); P.box('sc_top', x, x + 0.05, oy + 0.1, oy + 1.2, 0.2, 1.8)   # its two halves, folded up
        P.box('sc_frame', x - 0.08, x + 0.08, oy + 0.1, oy + 1.2, 0.85, 0.95)
    x0 = ox + 0.6; P.box('sc_top', x0, x0 + 2.4, oy + 0.4, oy + 1.2, 0.7, 0.74)                               # one unfolded
    for (dx, dy) in ((0.1, 0.45), (2.3, 0.45), (0.1, 1.15), (2.3, 1.15)): P.box('sc_frame', x0 + dx - 0.02, x0 + dx + 0.02, oy + dy - 0.02, oy + dy + 0.02, 0.0, 0.7)
    P.drum('pw_steel_d', x0 + 0.6, oy + 0.8, 0.74, 0.9, 0.2, 10); P.drum('can', x0 + 0.6, oy + 0.8, 0.9, 1.05, 0.14, 10); P.drum('can', x0 + 1.4, oy + 0.75, 0.74, 0.88, 0.12, 10)
    P.box('card', x0 + 1.8, x0 + 2.2, oy + 0.5, oy + 0.9, 0.74, 0.95)


def desk1(P, x, y, over=False):
    """a student's chair-desk: its seat, its back, its arm-top, on a steel frame"""
    if over:
        P.box('sc_frame', x - 0.25, x + 0.25, y, y + 0.7, 0.0, 0.03); P.box('sc_seat', x - 0.22, x + 0.22, y + 0.05, y + 0.45, 0.03, 0.07); P.box('sc_top', x - 0.25, x + 0.3, y + 0.5, y + 0.8, 0.0, 0.05)
        return
    P.box('sc_seat', x - 0.22, x + 0.22, y + 0.1, y + 0.5, 0.42, 0.46); P.box('sc_seat', x - 0.22, x + 0.22, y + 0.5, y + 0.55, 0.46, 0.85)
    P.box('sc_top', x - 0.05, x + 0.3, y - 0.25, y + 0.25, 0.72, 0.75)
    for (dx, dy) in ((-0.2, 0.12), (0.2, 0.12), (-0.2, 0.5), (0.2, 0.5)): P.bar('sc_frame', (x + dx, y + dy, 0.0), (x + dx, y + dy, 0.42), 0.012)
    P.bar('sc_frame', (x + 0.22, y + 0.3, 0.42), (x + 0.22, y, 0.72), 0.012)


def desks(P, ox, oy, rng):
    """student desks in rows facing the front (south), some knocked over"""
    for r_ in range(3):
        for c_ in range(4):
            over = rng.rand() < 0.2; desk1(P, ox - 1.65 + c_ * 1.1, oy + 0.4 + r_ * 1.0, over)
    for _ in range(5): x, y = ox + rng.uniform(-2, 2), oy + rng.uniform(0, 3); P.box('paper', x, x + 0.21, y, y + 0.28, 0.0, 0.005)


def teacher(P, ox, oy, rng):
    """the teacher's steel desk, its chair behind it, the attendance book open, the globe; a box of the year's papers"""
    P.box('sc_steel', ox - 0.8, ox + 0.8, oy + 0.6, oy + 1.4, 0.0, 0.74); P.box('sc_top', ox - 0.82, ox + 0.82, oy + 0.58, oy + 1.42, 0.74, 0.77)
    P.box('black', ox - 0.75, ox + 0.75, oy + 0.58, oy + 0.6, 0.05, 0.7)
    P.box('paper', ox - 0.5, ox - 0.1, oy + 0.8, oy + 1.1, 0.77, 0.79); P.drum('blue', ox + 0.45, oy + 1.0, 0.77, 0.95, 0.04, 6); P.drum('teal', ox + 0.45, oy + 1.0, 0.95, 1.25, 0.15, 12)   # the book; the globe
    P.drum('black', ox, oy + 1.8, 0.0, 0.06, 0.25, 5); P.drum('black', ox, oy + 1.8, 0.42, 0.5, 0.24, 12); P.box('black', ox - 0.22, ox + 0.22, oy + 2.0, oy + 2.06, 0.5, 0.95)
    P.box('card', ox + 1.1, ox + 1.6, oy + 0.6, oy + 1.0, 0.0, 0.35)


def barricade(P, ox, oy, rng):
    """desks piled into a barricade: a table on its side, chair-desks thrown on and against it, chairs"""
    P.box('sc_top', ox - 1.4, ox + 1.4, oy + 1.2, oy + 1.26, 0.0, 0.75)
    for k in range(9):
        x, y = ox + rng.uniform(-1.3, 1.1), oy + rng.uniform(0.2, 1.1); z = rng.uniform(0.0, 0.9)
        a = rng.uniform(-0.6, 0.6); ca, sa = math.cos(a), math.sin(a)
        P.poly('sc_top', [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in ((-0.3, -0.25), (0.3, -0.25), (0.3, 0.25), (-0.3, 0.25))], z + 0.3, z + 0.34)
        P.poly('sc_seat', [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in ((-0.22, 0.2), (0.22, 0.2), (0.22, 0.6), (-0.22, 0.6))], z, z + 0.04)
        P.bar('sc_frame', (x, y, z), (x + 0.2, y + 0.4, z + 0.35), 0.012)
    P.bar('black', (ox + 1.4, oy + 0.3, 0.0), (ox + 1.2, oy + 0.9, 0.9), 0.025)


def case(P, ox, oy, rng):
    """the trophy case, its glass gone: a cabinet of shelves set in the wall, the trophies left in it, the team's photograph, the glass
    on the floor"""
    P.box('sc_wood', ox - 1.3, ox + 1.3, oy + 0.5, oy + 1.0, 0.0, 2.1); P.box('black', ox - 1.2, ox + 1.2, oy + 0.45, oy + 0.5, 0.3, 2.0)
    for z in (0.3, 0.85, 1.4): P.box('sc_wood', ox - 1.2, ox + 1.2, oy + 0.1, oy + 0.5, z, z + 0.03)
    for (x, z, h) in ((ox - 0.9, 0.33, 0.45), (ox - 0.4, 0.33, 0.3), (ox + 0.3, 0.33, 0.5), (ox - 0.7, 0.88, 0.35), (ox + 0.6, 0.88, 0.4), (ox, 1.43, 0.55)):
        P.box('sc_wood', x - 0.08, x + 0.08, oy + 0.2, oy + 0.36, z, z + 0.08); P.drum('brass', x, oy + 0.28, z + 0.08, z + h, 0.04, 8, 0.07)   # trophies
    P.box('white', ox + 0.6, ox + 1.1, oy + 0.42, oy + 0.45, 1.5, 1.85); P.box('pw_steel_d', ox + 0.65, ox + 1.05, oy + 0.415, oy + 0.42, 1.55, 1.8)   # the team's photograph
    P.box('sc_wood', ox - 1.32, ox + 1.32, oy + 0.0, oy + 1.0, 2.05, 2.15)
    for _ in range(24): x, y = ox + rng.uniform(-1.6, 1.6), oy - rng.uniform(0.1, 1.2); P.box('glassbit', x, x + rng.uniform(0.05, 0.16), y, y + rng.uniform(0.04, 0.1), 0.0, 0.012)


def wall_ew(P, ox, oy, rng):
    """the block wall: painted, the school's stripe, a bulletin board with its papers, the clock stopped"""
    P.box('panel', ox - 6, ox + 6, oy, oy + 0.25, 0.0, WALL_H); P.box('conc', ox - 6, ox + 6, oy - 0.01, oy + 0.26, WALL_H, WALL_H + 0.04)
    for k in range(1, 12): P.box('under', ox - 6, ox + 6, oy - 0.003, oy, k * 0.2, k * 0.2 + 0.008)
    P.box('sc_stripe', ox - 6, ox + 6, oy - 0.004, oy, 0.95, 1.15)
    P.box('sc_cork', ox - 4.2, ox - 1.6, oy - 0.04, oy, 1.2, 2.0)
    for k in range(7): x = ox - 4.1 + (k % 4) * 0.62; z = 1.3 + (k // 4) * 0.36; P.box(('white', 'paper', 'haz')[k % 3], x, x + 0.4, oy - 0.045, oy - 0.04, z, z + 0.3)
    P.box('white', ox + 2.3, ox + 2.7, oy - 0.05, oy, 1.75, 2.15); P.box('black', ox + 2.49, ox + 2.51, oy - 0.055, oy - 0.05, 1.95, 2.1); P.box('black', ox + 2.5, ox + 2.62, oy - 0.055, oy - 0.05, 1.94, 1.96)   # the clock


def wall_ns(P, ox, oy, rng):
    P.box('panel', ox - 0.12, ox + 0.12, oy, oy + 12, 0.0, WALL_H); P.box('conc', ox - 0.13, ox + 0.13, oy, oy + 12, WALL_H, WALL_H + 0.04)
    P.box('panel', ox - 0.126, ox + 0.126, oy - 0.006, oy, 0.0, WALL_H)


def lockers_ew(P, ox, oy, rng):
    """a run of lockers, a tile of them: forty on their base, their doors' vents, some doors hanging open, a padlock left, stickers"""
    P.box('conc_d', ox - 6, ox + 6, oy, oy + 0.4, 0.0, 0.15); P.box('sc_locker', ox - 6, ox + 6, oy + 0.05, oy + 0.4, 0.15, LOCK_H)
    P.box('sc_locker', ox - 6, ox + 6, oy, oy + 0.42, LOCK_H, LOCK_H + 0.05)
    for k in range(40):
        x = ox - 6 + k * 0.3
        P.box('black', x - 0.004, x + 0.004, oy + 0.04, oy + 0.05, 0.15, LOCK_H)                                # the gap between doors
        for j in range(3): P.box('black', x + 0.08, x + 0.22, oy + 0.044, oy + 0.05, 1.5 + j * 0.06, 1.52 + j * 0.06)   # its vents
        if rng.rand() < 0.22:                                            # hanging open
            P.box('black', x + 0.01, x + 0.29, oy + 0.05, oy + 0.06, 0.18, LOCK_H - 0.04)
            P.prism_y('sc_locker', oy - 0.27, oy + 0.05, [(x + 0.01, 0.18), (x + 0.03, 0.18), (x + 0.03, LOCK_H - 0.04), (x + 0.01, LOCK_H - 0.04)])
        elif rng.rand() < 0.06: P.box('chrome', x + 0.24, x + 0.28, oy + 0.02, oy + 0.05, 0.95, 1.05)            # a padlock left
        if rng.rand() < 0.08: P.box(('white', 'red', 'haz')[rng.randint(3)], x + 0.06, x + 0.2, oy + 0.044, oy + 0.05, 1.1, 1.25)   # a sticker


def lockers_ns(P, ox, oy, rng):
    P.box('conc_d', ox - 0.2, ox + 0.2, oy, oy + 12, 0.0, 0.15); P.box('sc_locker', ox - 0.18, ox + 0.18, oy, oy + 12, 0.15, LOCK_H + 0.05)
    for k in range(1, 40): y = oy + k * 0.3; P.box('black', ox - 0.181, ox + 0.181, y - 0.004, y + 0.004, LOCK_H + 0.05, LOCK_H + 0.052)


def sc_parts(P, rng):
    A = SC_AT
    bleachers(P, *A['bleachers'], rng); lockers_ew(P, *A['lockers_ew'], rng); case(P, *A['case'], rng); wall_ns(P, *A['wall_ns'], rng)
    wall_ew(P, *A['wall_ew'], rng); cots_a(P, *A['cots_a'], rng); cots_b(P, *A['cots_b'], rng); lockers_ns(P, *A['lockers_ns'], rng)
    mats(P, *A['mats'], rng); tables(P, *A['tables'], rng); desks(P, *A['desks'], rng); teacher(P, *A['teacher'], rng); barricade(P, *A['barricade'], rng)


def sc_mats_(bpy, NF, F, M, which):
    if which not in ('sc_pieces', 'tun_pieces'): return
    if which == 'sc_pieces': CB.pr_mats(bpy, NF, F, M, 'pr_pieces')
    M.update(sc_wood=NF.material(bpy, 'in_wood_bleacher', 'tape_masking', 2, 0.9), sc_frame=NF.material(bpy, 'in_steel_frame', 'tape_grey', 1, 0.9),
             sc_canvas=NF.material(bpy, 'in_cloth_cot', 'clay_teal', 1, 0.85), sc_mat=NF.material(bpy, 'in_vinyl_mat_blue', 'clay_teal', 2, 1.0),
             sc_top=NF.material(bpy, 'in_laminate_table', 'clay_bone', 3, 0.85), sc_seat=NF.material(bpy, 'in_plastic_seat', 'clay_rust', 2, 0.9),
             sc_steel=NF.material(bpy, 'in_paint_desk_grey', 'tape_grey', 2, 0.9), sc_stripe=NF.material(bpy, 'in_paint_school_stripe', 'clay_rust', 3, 1.0),
             sc_cork=NF.material(bpy, 'in_cork', 'clay_mustard', 1, 0.9), sc_locker=NF.material(bpy, 'in_paint_locker', 'clay_teal', 3, 0.95),
             sc_pa=NF.material(bpy, 'in_ceil_pa_grille', 'tape_grey', 3, 0.9))


TG.PARTS['sc_pieces'] = sc_parts
TG.MAT_HOOKS.append(sc_mats_)


# ---- the ceiling: the hospital's dropped ceiling, a school's ------------------------------------------------------------------
def ceil_school(P, rng):
    """the lay-in grid (its tees dark with dirt), tiles out in clusters where the wiring hangs, the 2 by 4 light panels dead, the PA's
    speaker grille in every bay, a stain where the roof leaked"""
    at = TG.at
    P.box('tile', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)
    for k in range(101): P.box('conc_d', k * 0.6 - 0.03, k * 0.6 + 0.03, -3.0, 63.0, 0.0, 0.012)
    for j in range(-4, 106): P.box('conc_d', -3.0, 63.0, SIDE - j * 0.6 - 0.03, SIDE - j * 0.6 + 0.03, 0.0, 0.012)
    for r in range(5):
        for c in range(5):
            hole = (rng.randint(3, 16), rng.randint(3, 16)) if rng.rand() < 0.75 else None
            for i in range(0, 20):
                for j in range(0, 20):
                    near = hole and abs(i - hole[0]) + abs(j - hole[1]) <= 2
                    u = rng.rand(); x, y = at(c, r, i * 0.6, j * 0.6)
                    if u < (0.7 if near else 0.01): P.box('black', x + 0.03, x + 0.57, y - 0.57, y - 0.03, 0.0, 0.006)
                    elif u < (0.8 if near else 0.02): P.box('stain', x + 0.03, x + 0.57, y - 0.57, y - 0.03, 0.0, 0.006)
            if hole:
                for _ in range(rng.randint(2, 4)):
                    x, y = at(c, r, (hole[0] + rng.uniform(-1, 1)) * 0.6, (hole[1] + rng.uniform(-1, 1)) * 0.6)
                    P.bar('black', (x, y, 0.0), (x + rng.uniform(-0.4, 0.4), y, rng.uniform(0.6, 1.5)), 0.03)
            for (i, j) in ((4, 5), (4, 13), (14, 5), (14, 13)):
                x, y = at(c, r, i * 0.6, j * 0.6); P.box('hs_troffer', x + 0.02, x + 1.18, y - 1.18, y - 0.02, 0.0, 0.03)
                for k in range(3): P.box('steel', x + 0.05 + k * 0.38, x + 0.08 + k * 0.38, y - 1.15, y - 0.05, 0.03, 0.04)
            x, y = at(c, r, 9.3, 9.3); P.drum('sc_pa', x, y, 0.0, 0.03, 0.25, 16)                               # the PA's speaker
            for k in (0, 2): P.drum('black', x, y, 0.03, 0.035, 0.22 - k * 0.05, 16)                           # its rings
            if rng.rand() < 0.4: x, y = at(c, r, rng.uniform(2, 10), rng.uniform(2, 10), 0.01); TG.bloom(P, 'stain', x, y, rng.uniform(0.6, 1.2), rng, 6)


TG.CEILINGS['school'] = (ceil_school, 'school/school_ceiling.webp', "a school's dropped ceiling: its lay-in grid, tiles out in clusters where the wiring hangs, the 2 by 4 light panels dead, the PA's speaker grille in every bay, the stains where the roof leaked")
TG.CEIL_DATA['school'] = 'school/school.json'

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(bleachers='LOW_COVER', lockers_ew='WALL', lockers_ns='WALL', case='COVER', wall_ew='WALL', wall_ns='WALL', cots_a='LOW_COVER', cots_b='LOW_COVER',
            mats='LOW_COVER', tables='COVER', desks='LOW_COVER', teacher='COVER', barricade='COVER')
HM = dict(bleachers=BLEACH_H, lockers_ew=LOCK_H, lockers_ns=LOCK_H, case=2.15, wall_ew=WALL_H, wall_ns=WALL_H, cots_a=0.55, cots_b=1.7, mats=0.9, tables=1.8,
          desks=0.85, teacher=1.25, barricade=1.3)
NAME = dict(bleachers='BLEACHERS', lockers_ew='LOCKERS', lockers_ns='LOCKERS', case='THE TROPHY CASE', wall_ew="THE SCHOOL'S WALL", wall_ns="THE SCHOOL'S WALL",
            cots_a='SHELTER COTS', cots_b='SHELTER COTS', mats='GYM MATS', tables='FOLDED TABLES', desks='STUDENT DESKS', teacher="THE TEACHER'S DESK", barricade='PILED DESKS')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'sc_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'school_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'sc_pieces.png')).convert('RGBA'); A = SC_AT; sz = {}
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'sc_' + key, 'school', shadow)
    x, y = A['bleachers']; one('bleachers', (x - 6.0, x + 6.0 + 0.01, y - 0.3, y + 3.7 + BLEACH_H * 1.45), 1.0)
    x, y = A['lockers_ew']; one('lockers_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 0.5 + LOCK_H * 1.45), 1.0)
    x, y = A['lockers_ns']; one('lockers_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + LOCK_H * 1.45), 0.5)
    x, y = A['case']; one('case', (x - 1.8, x + 1.8, y - 1.4, y + 1.1 + 2.2 * 1.45), 1.0)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 0.4 + WALL_H * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + WALL_H * 1.45), 0.5)
    x, y = A['cots_a']; one('cots_a', (x - 2.4, x + 3.0, y - 0.4, y + 2.5 + 0.6 * 1.45), 1.0)
    x, y = A['cots_b']; one('cots_b', (x - 2.0, x + 2.0, y - 0.3, y + 2.6 + 1.8 * 1.45), 1.0)
    x, y = A['mats']; one('mats', (x - 1.3, x + 2.9, y - 0.3, y + 2.6 + 1.0 * 1.45), 1.0)
    x, y = A['tables']; one('tables', (x - 2.6, x + 3.2, y - 0.2, y + 1.4 + 1.9 * 1.45), 1.0)
    x, y = A['desks']; one('desks', (x - 2.4, x + 2.4, y - 0.4, y + 3.3 + 0.9 * 1.45), 1.0)
    x, y = A['teacher']; one('teacher', (x - 1.2, x + 1.8, y + 0.2, y + 2.2 + 1.3 * 1.45), 1.0)
    x, y = A['barricade']; one('barricade', (x - 1.7, x + 1.8, y - 0.2, y + 1.6 + 1.4 * 1.45), 1.0)
    for key, v in sz.items():
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'sc_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='school/sc_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['school/school_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'sc_' + k: ent(k) for k in sz}
    art = {'version': 'cook6-school-art-11-21', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's school (slices/fight_ground/school/school.json, BUILD 11/21m): the names its handoff asked for, the garage's format. floor.floor is the school's maple (all 25 tiles: the boards' strips east to west with their ends staggered on 0.3 m so every tile's edge is a board end, the finish worn grey where people walked, scuffs, a cot's leg marks, a hopscotch in chalk; nothing within 1.2 m of an edge but the boards); floor.ring the same. ONE FLOOR FOR BOTH LAYOUTS, as your file has one kind: no court lines, which would scatter over the classrooms; give the gym a 'court' kind and the hallway a 'hall' kind and this lane paints them.",
           'floor': {'floor': cells(ROWS), 'ring': cells(ROWS)}, 'kit': kit,
           'how_it_lays': {'the gym': "sc_bleachers a tile wide, eight rows stepping 0.45 m deep and 0.3 m up toward the north (your 'at' [0.5, 0.85]); sc_cots_a four cots, sc_cots_b two and a tarp; sc_mats the cart and two laid out; sc_tables two folded on their wheels and one open.",
                           'the classrooms': "sc_desks twelve in three rows facing south; sc_teacher the steel desk and its chair; sc_barricade desks piled on a table on its side.",
                           'the hallway': "sc_lockers_ew a tile of forty lockers, 1.9 m, on its base (your 'L', an air wall); sc_lockers_ns end on; sc_case the trophy case, foot its front's middle.",
                           'the walls': "sc_wall_ew / _ns: painted block to 2.4 m, the school's stripe, a bulletin board, the clock; a tile long."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'school_art.json'))
    cp = os.path.join(REND, 'ceil_school.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'school_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'school/school.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "school/school_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):   # (the one agreed edit in COMBAT FOUR's file)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='school/school_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['school'][2],
                              contract="school.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat")
    json.dump(art, open(os.path.join(SHIP, 'school_art.json'), 'w'), indent=1)
    print('school: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_SCHOOL_11_21.webp: before and now on his phone (the ceiling off and at his 10%), the classrooms, close
    in, the pieces at their own pixels, two tiles of the maple, the ceiling at full strength"""
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
    title('THE SCHOOL, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'school_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'school_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'school_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the bleachers, the shelter\'s cots, the mats and the tables')
    strip([(lab, up(os.path.join(page_dir, 'school_upright_%s.png' % n))) for lab, n in (('THE BLEACHERS', 'bleachers_close'), ('THE COTS', 'cots_close'), ('THE TABLES, THE MATS', 'tables_close'))], cw, ch)
    cl = os.path.join(page_dir, 'cl', 'school_upright_open_a0.png')
    if os.path.exists(cl):
        title('THE OTHER LAYOUT: THE CLASSROOMS', 'rooms of desks off a hallway lined with lockers; close in on a room and on the hallway')
        strip((('THE CLASSROOMS', up(cl)), ('A ROOM', up(os.path.join(page_dir, 'cl', 'school_upright_room_close.png'))), ('THE HALLWAY', up(os.path.join(page_dir, 'cl', 'school_upright_hallway_close.png')))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the bleachers, the lockers, the cots, the mats, the tables, the desks, the teacher\'s desk, the barricade, the trophy case, the wall')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'sc_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('bleachers', 'lockers_ew'), 170); row_of(('cots_a', 'cots_b', 'mats', 'tables'), 160); row_of(('desks', 'teacher', 'barricade', 'case'), 160); row_of(('wall_ew',), 110)
    title('THE MAPLE, AND THE CEILING AT FULL STRENGTH', 'the boards worn grey where people walked, scuffs, a hopscotch in chalk; the dropped ceiling, the PA\'s grille in every bay')
    fl = Image.open(os.path.join(SHIP, 'school_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'school_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_SCHOOL_11_21.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-school-11-21.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'sc_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'sc_pieces' else TG.scene_ceiling('school', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_sc_floor(ID)
        col = {ID['tun_silt']: (156, 137, 104)}
        img = np.zeros((H, W, 3), np.float32)
        for k, c in col.items(): img[gid == k] = c
        img = img * (1 - dark[..., None] * 0.7) + (255 - img) * pale[..., None] * 0.35
        fn = os.path.join(TG.OUT, 'sc_floor_plan.png'); Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(fn); print(fn)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
