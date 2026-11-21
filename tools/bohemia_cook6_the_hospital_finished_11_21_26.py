#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the hospital, finished] (11/21/26; COMBAT FOUR's BUILD 11/20w asked 'FOR COOK (SIX) 3)';
VAMILY rules 461, 453, 441, 416, 451(a), 455).

COMBAT FOUR's thirteenth inside (THE HOSPITAL, slices/fight_ground/hospital/hospital.json, laid by slices/bohemia_big_inside.js): the
emergency room (treatment bays along both walls, the nurses' station and the pharmacy's cage in the middle, the ambulance doors) or a
ward (beds in rows). All 11 of its pieces were stand-ins. These are the pictures under its names, through the master rig, ON this
lane's home center tool (and the Sphere's, the powerhouse's, the stadium's, and COOK FIVE's chain under them):

  THE FLOOR        hospital_floor_0.webp, five tiles by five. Rows 0 to 2: THE CORRIDOR'S VINYL, sheet vinyl with its welded seams,
                   heel marks, a gurney's wheel tracks, pills spilled and a glove, now and then a dark smear dragged a few metres.
                   Rows 3 and 4: THE SAME VINYL, SLICK: water standing where the roof let it in, its tide marks, the mop that gave up.
                   (No new ground: the terminal's floor, the tunnels' wet and water, the garage's white, under the plan's dark and pale.)
  THE PIECES       (hospital_art.json's kit, COMBAT FOUR's names)
    hs_bay         a run of treatment bays, a tile wide: three bays, each a stretcher bed at its headwall (the outlets, the
                   monitor on its arm, the IV pole), the curtain tracks overhead and the curtains torn down in heaps, one still half up
    hs_beds        a ward's beds in a row, mattresses gone: five bed frames a tile wide, their decks bare, one mattress left, a
                   locker, an overbed table
    hs_gurney      a gurney, its pad, a sheet half off it; a wheelchair turned over
    hs_carts       a crash cart, its drawers pulled out and empty, the defibrillator's lid open; IV poles; the oxygen rack empty
    hs_chairs      the waiting room's chairs, two rows on their beams, one knocked over, the ticket dispenser
    hs_station     the nurses' station: its counter, three dead monitors, the phone hanging by its cord, the charts on the floor
    hs_pharmacy    the pharmacy's cage, cut open: mesh walls on a steel frame, the shelves inside stripped, the door cut off its
                   hinges, a hole cut in the mesh, the pill bottles spilled out of it (a tile's blocker)
    hs_wall_ew/_ns the wall, a tile long: painted block, the crash rail, a corner guard, the AED cabinet, open and empty
    hs_partition_ew/_ns  the bays' partitions: a tile of it, the bay's number, the glove boxes, a sharps bin
  THE CEILING      hospital_ceiling.webp (rule 451(a), over the fight at 10%): five bays by five that repeat: the dropped ceiling's
                   lay-in grid (the casino's), tiles out where the wiring hangs, the light panels dead, a diffuser in every bay, a
                   camera's dome, the stains where the roof leaked.

  <venv>/bin/python tools/bohemia_cook6_the_hospital_finished_11_21_26.py render hs_floor | hs_pieces | ceil_hospital
  python3 tools/bohemia_cook6_the_hospital_finished_11_21_26.py cut
  python3 tools/bohemia_cook6_the_hospital_finished_11_21_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a hospital emergency department (treatment bays
round a central nurses' station, each a stretcher bed at a headwall of gas outlets with a monitor on an arm, ceiling curtain tracks; a
crash cart of drawers with a defibrillator on top; an inpatient pharmacy behind a secured cage; a waiting room of beam seating; sheet
vinyl floors with welded seams; a lay-in acoustic ceiling with 2 by 4 light troffers and diffusers; dome cameras) and a ward of beds;
emptied in a collapse in the order COMBAT FOUR's facts give: the drugs, then the oxygen, then the beds. The twins: the casino's ceiling
grid and the home center's kit (the same rig and cut).
REUSE CHECK (REUSE-FIRST): the casino's lay-in grid (COOK FIVE's), the home center's tool and everything under it. New here: the
hospital's plan, its pieces, its ceiling's lights, diffusers and cameras.
ANALOG HORROR: a dome camera on the ceiling of every bay that nobody watches; a phone hanging by its cord at the nurses' station; a
dark smear dragged a few metres down the corridor and stopping (rule 459(e): whose, is not said).
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_home_center_finished_11_21_26 as HC        # this lane's: the home center (and the Sphere, and the chain under it)

SPH = HC.SPH; PW = HC.PW; SD = HC.SD; TG = HC.TG; FW = HC.FW
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'hospital')
VINYL, SLICK = (0, 1, 2), (3, 4)
tile_xy = HC.tile_xy


# ---- the ground ------------------------------------------------------------------------------------------------------------
def plan_hs_floor(ID, seed=191):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['tm_floor'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    pale = np.clip((dust - 0.6) / 0.3, 0, 1) * 0.06; dark = 0.06 + np.clip((0.4 - dust) / 0.3, 0, 1) * 0.05
    for r in range(5):
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; G, D, Pl = gid[sy, sx], dark[sy, sx], pale[sy, sx]
            for _ in range(rng.randint(4, 9)):                           # heel marks: short black curves
                cx, cy, R_ = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5), rng.uniform(0.15, 0.4); a0 = rng.uniform(0, 6.3)
                d0 = np.hypot(X - cx, Y - cy); m = (np.abs(d0 - R_) < 0.02) & (np.abs(((np.arctan2(Y - cy, X - cx) - a0 + math.pi) % (2 * math.pi)) - math.pi) < 0.7)
                D[m] = 0.55
            if rng.rand() < 0.6:                                         # a gurney's wheel tracks, a pair
                y0 = rng.uniform(2.5, 9.5); sl = rng.uniform(-0.15, 0.15); xa, xb = rng.uniform(1.3, 3.5), rng.uniform(8.5, 10.7)
                for dy in (0.0, 0.62): D[(np.abs(Y - (y0 + dy + sl * (X - 6))) < 0.025) & (X > xa) & (X < xb)] = 0.3
            if rng.rand() < 0.45:                                        # pills spilled, a glove
                cx, cy = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5)
                pills = (np.hypot(X - cx, Y - cy) < 0.9) & (rng.rand(*X.shape) < 0.01); G[pills] = ID['gar_white']; D[pills] = 0.0; Pl[pills] = 0.6
                gx, gy = cx + rng.uniform(-1.5, 1.5), cy + rng.uniform(-1.0, 1.0)
                glove = np.hypot((X - gx) * 1.0, (Y - gy) * 2.0) < 0.12; G[glove] = ID['tun_water']; D[glove] = 0.0
            if r in VINYL and rng.rand() < 0.14:                         # a dark smear, dragged a few metres, and stopping
                y0 = rng.uniform(3.0, 9.0); xa = rng.uniform(1.5, 4.0); L_ = rng.uniform(3.0, 6.0); nn = FW.vnoise(X.shape, 0.25 * PPM, rng)
                t = np.clip((X - xa) / L_, 0, 1); wdt = 0.28 * (1 - t) + 0.06
                m = (X > xa) & (X < xa + L_) & (np.abs(Y - y0 - 0.2 * np.sin(X * 0.7)) < wdt * (0.7 + 0.5 * nn))   # one streak, thinning (not dashes)
                G[m] = ID['tun_fill']; D[m] = (0.1 + 0.3 * t)[m] if hasattr(t, 'shape') else 0.1
            if r in SLICK:                                               # THE SAME VINYL, SLICK: water standing, its tide marks, a dry margin
                Wn = TG.win(X, Y, 0.9, 2.4); nn = FW.vnoise(X.shape, 1.1 * PPM, rng)
                v = Wn * (0.45 + 0.7 * nn)                                # (a sheen on the vinyl and small standing spots: the first plan's pools
                wet = v > 0.62; D[wet] = 0.32                               #  filled the tile and read as holes; water on vinyl only darkens it)
                deep = v > 0.92; G[deep] = ID['tun_wet']; D[deep] = 0.0; Pl[deep] = 0.1
                tide = (v > 0.61) & ~wet; Pl[tide] = 0.3
                for _ in range(2):                                       # the mop's arcs, where it gave up
                    cx, cy = rng.uniform(4, 8), rng.uniform(4, 8)
                    for k in range(5): D[(np.abs(np.hypot(X - cx, Y - cy) - (0.9 + k * 0.28)) < 0.02) & (Wn > 0.6) & ~deep] = 0.3
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['hs_floor'] = plan_hs_floor


def hs_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(25.0, 59.4)), 34)


TG.GARAGE_THINGS['hs_floor'] = hs_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
HS_AT = dict(bay=(10.0, 46.0), beds=(26.0, 46.0), pharmacy=(44.0, 45.5), wall_ns=(57.0, 45.0),
             wall_ew=(10.0, 37.0), partition_ew=(26.0, 37.0), station=(44.0, 31.0), partition_ns=(57.5, 21.0),
             gurney=(8.0, 21.0), carts=(20.0, 21.0), chairs=(33.0, 21.0))
WALL_H, PART_H, CAGE_H, TRACK_H = 2.4, 2.1, 2.7, 2.35


def stretcher(P, x, y, ang=0.0, pad=True, rail=True):
    """a stretcher bed, head to the north: its frame on casters, its deck, a pad (or not), side rails"""
    ca, sa = math.cos(ang), math.sin(ang); pt = lambda u, v: (x + u * ca - v * sa, y + u * sa + v * ca)
    q = lambda u0, u1, v0, v1: [pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)]
    P.poly('steel', q(-0.4, 0.4, 0.0, 2.0), 0.18, 0.3); P.poly('hs_deck', q(-0.38, 0.38, 0.05, 1.95), 0.55, 0.6)
    for (u, v) in ((-0.35, 0.15), (0.35, 0.15), (-0.35, 1.85), (0.35, 1.85)): c = pt(u, v); P.drum('black', c[0], c[1], 0.0, 0.18, 0.06, 8); P.bar('steel', (c[0], c[1], 0.18), (c[0], c[1], 0.58), 0.025)
    if pad: P.poly('hs_pad', q(-0.36, 0.36, 0.1, 1.9), 0.6, 0.7); P.poly('hs_pad', q(-0.34, 0.34, 1.4, 1.9), 0.7, 0.8)
    if rail:
        for u in (-0.41, 0.41): a, b = pt(u, 0.5), pt(u, 1.5); P.bar('chrome', (a[0], a[1], 0.85), (b[0], b[1], 0.85), 0.02); P.bar('chrome', (a[0], a[1], 0.6), (a[0], a[1], 0.85), 0.015); P.bar('chrome', (b[0], b[1], 0.6), (b[0], b[1], 0.85), 0.015)


def ivpole(P, x, y, bag=False):
    P.drum('black', x, y, 0.0, 0.05, 0.28, 5); P.bar('chrome', (x, y, 0.05), (x, y, 2.0), 0.015)
    for a in (0.0, 1.57, 3.14, 4.71): P.bar('chrome', (x, y, 2.0), (x + 0.15 * math.cos(a), y + 0.15 * math.sin(a), 1.95), 0.01)
    if bag: P.box('wrap', x + 0.1, x + 0.22, y - 0.03, y + 0.03, 1.55, 1.92)


def bay(P, ox, oy, rng):
    """a run of treatment bays, a tile wide: three, each a stretcher at its headwall (the gas outlets, the monitor on its arm), an IV
    pole, the curtain tracks overhead, the curtains torn down in heaps and one still half up"""
    for b in range(3):
        cx = ox - 4.0 + b * 4.0; hy = oy + 3.4
        P.box('panel', cx - 1.6, cx + 1.6, hy, hy + 0.12, 0.9, 1.6); P.box('hs_head', cx - 1.5, cx + 1.5, hy - 0.04, hy, 1.0, 1.5)   # the headwall
        for k in range(4): P.drum('green' if k == 0 else 'white', cx - 1.2 + k * 0.25, hy - 0.06, 1.2, 1.25, 0.05, 8)               # its outlets
        P.box('black', cx + 0.8, cx + 1.4, hy - 0.5, hy - 0.4, 1.7, 2.1); P.bar('steel', (cx + 1.1, hy, 1.9), (cx + 1.1, hy - 0.4, 1.9), 0.02)   # the monitor, dead
        stretcher(P, cx + rng.uniform(-0.3, 0.3), hy - 2.15, rng.uniform(-0.25, 0.25), pad=rng.rand() < 0.5)
        ivpole(P, cx - 1.1, hy - 0.8, bag=rng.rand() < 0.4)
        P.drum('red', cx + 1.5, hy - 0.2, 0.0, 0.5, 0.18, 10)                                                    # a sharps bin
        for (a, b2) in (((cx - 1.95, oy + 0.2), (cx + 1.95, oy + 0.2)), ((cx - 1.95, oy + 0.2), (cx - 1.95, hy)), ((cx + 1.95, oy + 0.2), (cx + 1.95, hy))):
            P.bar('steel', (a[0], a[1], TRACK_H), (b2[0], b2[1], TRACK_H), 0.015)                                # the curtain track
        if b == 1: P.box('teal', cx - 1.95, cx - 1.9, oy + 0.4, oy + 2.0, 0.3, TRACK_H)                           # one curtain still half up
        for _ in range(2): x, y = cx + rng.choice([-1.9, 1.9]) + rng.uniform(-0.3, 0.3), oy + rng.uniform(0.4, 2.6); P.box(('teal', 'hs_curtain')[rng.randint(2)], x - 0.4, x + 0.4, y - 0.5, y + 0.5, 0.0, 0.12 + rng.uniform(0, 0.12))   # torn down, in heaps


def beds(P, ox, oy, rng):
    """a ward's beds in a row, mattresses gone: five frames a tile wide (2.4 m apart, so two tiles make one row), heads to the north,
    their decks bare, one mattress left; a locker, an overbed table"""
    for k in range(5):
        x = ox - 4.8 + k * 2.4; y0 = oy + 0.3
        P.box('steel', x - 0.5, x + 0.5, y0, y0 + 2.1, 0.25, 0.35)
        for j in range(4): P.box('hs_deck', x - 0.47, x + 0.47, y0 + 0.05 + j * 0.52, y0 + 0.53 + j * 0.52, 0.48, 0.52)   # its deck in sections
        for (u, v) in ((-0.45, 0.1), (0.45, 0.1), (-0.45, 2.0), (0.45, 2.0)): P.drum('black', x + u, y0 + v, 0.0, 0.25, 0.07, 8); P.bar('steel', (x + u, y0 + v, 0.25), (x + u, y0 + v, 0.48), 0.025)
        P.box('hs_head', x - 0.5, x + 0.5, y0 + 2.05, y0 + 2.12, 0.3, 1.0); P.box('hs_head', x - 0.5, x + 0.5, y0 - 0.02, y0 + 0.05, 0.3, 0.75)   # head and foot boards
        if k == 3: P.box('hs_pad', x - 0.45, x + 0.45, y0 + 0.1, y0 + 2.0, 0.52, 0.66); P.box('stain', x - 0.2, x + 0.15, y0 + 0.8, y0 + 1.3, 0.66, 0.663)   # one mattress left
        if k in (0, 2, 4): P.box('hs_head', x + 0.65, x + 1.1, y0 + 1.6, y0 + 2.05, 0.0, 0.85)                    # a locker
    P.box('hs_deck', ox - 2.0, ox - 1.2, oy - 0.2, oy + 0.3, 0.75, 0.8); P.bar('steel', (ox - 1.9, oy, 0.0), (ox - 1.9, oy, 0.75), 0.025)   # an overbed table


def gurney(P, ox, oy, rng):
    """a gurney left in the corridor, a sheet half off it; a wheelchair turned over"""
    stretcher(P, ox - 0.6, oy + 0.2, -1.2, pad=True); P.box('white', ox - 1.4, ox - 0.2, oy + 0.05, oy + 0.3, 0.0, 0.7)   # the sheet, over the side
    x, y = ox + 1.6, oy + 0.8                                                                                    # the wheelchair, on its side
    P.drum('black', x, y, 0.0, 0.04, 0.3, 14); P.drum('black', x - 0.05, y, 0.55, 0.59, 0.3, 14)
    P.box('black', x - 0.25, x + 0.25, y - 0.22, y + 0.22, 0.04, 0.55); P.box('hs_pad', x + 0.25, x + 0.55, y - 0.22, y + 0.22, 0.1, 0.5)


def carts(P, ox, oy, rng):
    """a crash cart, its drawers pulled out and empty, the defibrillator's lid open; two IV poles; the oxygen rack, empty"""
    x, y = ox - 1.2, oy + 0.4
    P.box('red', x, x + 0.8, y, y + 0.6, 0.12, 1.05); P.box('steel', x - 0.02, x + 0.82, y - 0.02, y + 0.62, 1.05, 1.09)
    for k in range(4):                                                   # its drawers: every other one pulled out, empty
        z = 0.2 + k * 0.2
        if k % 2 == 0: P.box('red', x + 0.05, x + 0.75, y - 0.3, y, z, z + 0.04); P.box('red', x + 0.05, x + 0.75, y - 0.3, y - 0.27, z, z + 0.16)
    for (dx, dy) in ((0.08, 0.08), (0.72, 0.08), (0.08, 0.52), (0.72, 0.52)): P.drum('black', x + dx, y + dy, 0.0, 0.12, 0.05, 8)
    P.box('haz', x + 0.1, x + 0.7, y + 0.1, y + 0.5, 1.09, 1.3); P.box('haz', x + 0.1, x + 0.7, y + 0.5, y + 0.53, 1.3, 1.62)   # the defibrillator, its lid open
    P.bar('black', (x + 0.3, y + 0.1, 1.2), (x + 0.2, y - 0.3, 0.6), 0.012)
    ivpole(P, ox + 0.2, oy + 0.6, bag=True); ivpole(P, ox + 0.7, oy + 0.9)
    x2, y2 = ox + 1.4, oy + 0.4                                                                                  # the oxygen rack, empty
    P.box('steel', x2, x2 + 0.9, y2, y2 + 0.5, 0.0, 0.08)
    for k in range(4): P.drum('steel', x2 + 0.15 + k * 0.2, y2 + 0.25, 0.08, 0.1, 0.09, 8)
    for xx in (x2, x2 + 0.9): P.bar('steel', (xx, y2 + 0.25, 0.08), (xx, y2 + 0.25, 1.0), 0.02)
    P.bar('steel', (x2, y2 + 0.25, 1.0), (x2 + 0.9, y2 + 0.25, 1.0), 0.02)


def chairs(P, ox, oy, rng):
    """the waiting room's chairs: two rows of five on their beams facing south, the back row knocked over; the ticket dispenser"""
    def row_(x0, y0, down=False):
        if down:
            P.box('steel', x0, x0 + 2.9, y0 + 0.3, y0 + 0.36, 0.0, 0.06)
            for k in range(5): x = x0 + 0.05 + k * 0.58; P.box('hs_seat', x, x + 0.5, y0 + 0.36, y0 + 0.82, 0.04, 0.1); P.box('hs_seat', x, x + 0.5, y0 - 0.25, y0 + 0.3, 0.0, 0.08)
            return
        P.box('steel', x0, x0 + 2.9, y0 + 0.2, y0 + 0.26, 0.3, 0.36)
        for xx in (x0 + 0.2, x0 + 2.7): P.box('steel', xx, xx + 0.05, y0 + 0.1, y0 + 0.4, 0.0, 0.33)
        for k in range(5):
            x = x0 + 0.05 + k * 0.58
            P.box('hs_seat', x, x + 0.5, y0, y0 + 0.46, 0.4, 0.47); P.box('hs_seat', x, x + 0.5, y0 + 0.42, y0 + 0.5, 0.47, 0.88)
            if k < 4: P.box('steel', x + 0.51, x + 0.55, y0 + 0.05, y0 + 0.45, 0.47, 0.62)
    row_(ox - 2.6, oy + 0.3); row_(ox - 2.6, oy + 1.6, down=True); row_(ox + 0.6, oy + 0.4)
    P.box('paper', ox - 1.2, ox - 0.9, oy - 0.2, oy, 0.0, 0.01); P.box('paper', ox + 1.1, ox + 1.4, oy + 0.0, oy + 0.2, 0.47, 0.48)
    P.bar('steel', (ox + 3.7, oy + 0.6, 0.0), (ox + 3.7, oy + 0.6, 1.2), 0.03); P.box('red', ox + 3.55, ox + 3.85, oy + 0.5, oy + 0.7, 1.2, 1.5)   # take a number


def station(P, ox, oy, rng):
    """the nurses' station: its counter in a U with the raised top, three dead monitors, the chairs, the phone hanging by its cord, the
    charts on the floor, the board behind it"""
    for (x0, x1, y0, y1) in ((ox - 2.6, ox + 2.6, oy + 0.3, oy + 0.9), (ox - 2.6, ox - 2.0, oy + 0.9, oy + 2.8), (ox + 2.0, ox + 2.6, oy + 0.9, oy + 2.8)):
        P.box('hs_desk', x0, x1, y0, y1, 0.0, 0.76); P.box('panel', x0 - 0.02, x1 + 0.02, y0 - 0.02, y1 + 0.02, 0.76, 0.8)
    P.box('hs_desk', ox - 2.6, ox + 2.6, oy + 0.3, oy + 0.5, 0.8, 1.12); P.box('panel', ox - 2.65, ox + 2.65, oy + 0.25, oy + 0.55, 1.12, 1.15)   # the raised top
    for k in range(3): x = ox - 1.4 + k * 1.2; P.box('black', x - 0.25, x + 0.25, oy + 0.6, oy + 0.66, 0.8, 1.15); P.box('black', x - 0.05, x + 0.05, oy + 0.66, oy + 0.75, 0.76, 0.8)   # its monitors
    P.box('black', ox + 1.6, ox + 1.85, oy + 0.55, oy + 0.75, 0.8, 0.88); P.bar('black', (ox + 1.7, oy + 0.55, 0.85), (ox + 1.7, oy + 0.25, 0.3), 0.008); P.box('black', ox + 1.6, ox + 1.8, oy + 0.15, oy + 0.3, 0.2, 0.3)   # the phone, hanging
    for k in range(2): x = ox - 0.8 + k * 1.4; P.drum('black', x, oy + 1.6, 0.0, 0.06, 0.28, 5); P.drum('black', x, oy + 1.6, 0.42, 0.5, 0.25, 12); P.box('black', x - 0.22, x + 0.22, oy + 1.82, oy + 1.88, 0.5, 0.95)
    for _ in range(12): x, y = ox + rng.uniform(-2.4, 2.4), oy + rng.uniform(-0.8, 0.2); P.box(('paper', 'card', 'paper')[rng.randint(3)], x, x + 0.3, y, y + 0.22, 0.0, 0.008)   # the charts
    P.box('white', ox - 1.6, ox + 1.6, oy + 3.2, oy + 3.25, 0.9, 2.0); P.box('black', ox - 1.4, ox - 0.2, oy + 3.19, oy + 3.2, 1.6, 1.64); P.box('black', ox - 1.4, ox + 0.6, oy + 3.19, oy + 3.2, 1.4, 1.44)   # the board, its last names


def pharmacy(P, ox, oy, rng):
    """the pharmacy's cage, cut open: mesh walls on a steel frame round its shelves, the shelves stripped, the door cut off its hinges,
    a hole cut in the mesh and bent back, the pill bottles spilled out of it (a tile's blocker)"""
    x0, x1, y0, y1 = ox - 4.8, ox + 4.8, oy + 0.6, oy + 7.0
    for xx in np.arange(x0, x1 + 0.01, 1.6):
        for yy in (y0, y1): P.box('steel', xx - 0.04, xx + 0.04, yy - 0.04, yy + 0.04, 0.0, CAGE_H)
    for yy in np.arange(y0, y1 + 0.01, 1.6):
        for xx in (x0, x1): P.box('steel', xx - 0.04, xx + 0.04, yy - 0.04, yy + 0.04, 0.0, CAGE_H)
    for z in (0.05, CAGE_H - 0.05):
        for (a, b) in (((x0, y0), (x1, y0)), ((x0, y1), (x1, y1)), ((x0, y0), (x0, y1)), ((x1, y0), (x1, y1))): P.bar('steel', (a[0], a[1], z), (b[0], b[1], z), 0.03)
    hole_x = ox + 1.6; door_x = ox - 2.4
    for k in range(int((x1 - x0) / 0.12)):                               # the mesh, the south face
        x = x0 + k * 0.12
        if door_x - 0.5 < x < door_x + 0.5: continue                     # the door, cut off
        top = CAGE_H if not (hole_x - 0.7 < x < hole_x + 0.7) else 0.3   # the hole, cut and bent back
        P.bar('steel', (x, y0, 0.05), (x, y0, top), 0.006)
    for k in range(10): x = hole_x - 0.7 + k * 0.14; P.bar('steel', (x, y0, 0.3), (x + 0.1, y0 - 0.5, 0.45), 0.006)   # its mesh, bent out
    for (a, b) in (((x0, y1), (x1, y1)), ((x0, y0), (x0, y1)), ((x1, y0), (x1, y1))):                       # the other faces, lighter
        L_ = math.hypot(b[0] - a[0], b[1] - a[1]); n = int(L_ / 0.24)
        for k in range(n + 1): t = k / n; P.bar('steel', (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.05), (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, CAGE_H), 0.006)
    P.box('steel', door_x - 0.5, door_x + 0.5, y0 - 1.3, y0 - 0.3, 0.0, 0.04)                                 # the door, on the floor
    for r_ in range(3):                                                                                      # the shelves, stripped
        y = y0 + 1.4 + r_ * 1.8
        P.box('steel', x0 + 0.6, x1 - 0.6, y, y + 0.05, 0.0, 2.0)
        for z in (0.3, 0.8, 1.3, 1.8): P.box('hs_deck', x0 + 0.6, x1 - 0.6, y - 0.45, y, z, z + 0.03)
        for _ in range(5): x = rng.uniform(x0 + 0.8, x1 - 0.9); z = (0.3, 0.8, 1.3, 1.8)[rng.randint(4)]; P.box(('white', 'teal', 'card')[rng.randint(3)], x, x + 0.3, y - 0.4, y - 0.1, z + 0.03, z + 0.15)   # a bin left
    for _ in range(40):                                                                                       # the bottles, spilled out of it
        x, y = hole_x + rng.uniform(-1.4, 1.6), y0 - rng.uniform(0.2, 1.8); P.drum(('white', 'haz')[int(rng.rand() < 0.3)], x, y, 0.0, 0.08, 0.03, 6)
    P.box('white', ox - 0.5, ox + 0.5, y0 - 0.04, y0 - 0.02, 1.9, 2.2); P.box('red', ox - 0.4, ox + 0.4, y0 - 0.045, y0 - 0.04, 2.0, 2.1)   # its sign


def wall_ew(P, ox, oy, rng):
    """the wall, a tile long: painted block, the crash rail, a corner guard, the AED cabinet open and empty, a sanitizer"""
    P.box('panel', ox - 6, ox + 6, oy, oy + 0.25, 0.0, WALL_H); P.box('conc', ox - 6, ox + 6, oy - 0.01, oy + 0.26, WALL_H, WALL_H + 0.04)
    for k in range(1, 12): P.box('under', ox - 6, ox + 6, oy - 0.003, oy, k * 0.2, k * 0.2 + 0.008)             # its block courses
    P.box('chrome', ox - 6, ox + 6, oy - 0.09, oy, 0.85, 0.97); P.box('hs_head', ox - 6, ox + 6, oy - 0.02, oy, 0.0, 0.12)   # the crash rail, the base
    P.box('white', ox + 2.0, ox + 2.6, oy - 0.14, oy, 1.1, 1.8); P.box('green', ox + 2.05, ox + 2.55, oy - 0.145, oy - 0.14, 1.65, 1.76)   # the AED cabinet
    P.box('black', ox + 2.08, ox + 2.52, oy - 0.141, oy - 0.139, 1.15, 1.6); P.prism_y('white', oy - 0.6, oy - 0.14, [(ox + 2.0, 1.1), (ox + 2.04, 1.1), (ox + 2.04, 1.8), (ox + 2.0, 1.8)])   # open, empty
    P.box('white', ox - 3.2, ox - 3.0, oy - 0.1, oy, 1.2, 1.45)


def wall_ns(P, ox, oy, rng):
    P.box('panel', ox - 0.12, ox + 0.12, oy, oy + 12, 0.0, WALL_H); P.box('conc', ox - 0.13, ox + 0.13, oy, oy + 12, WALL_H, WALL_H + 0.04)
    P.box('panel', ox - 0.126, ox + 0.126, oy - 0.006, oy, 0.0, WALL_H)


def partition_ew(P, ox, oy, rng):
    """the bays' partition, a tile of it: a stud wall painted pale green, its steel corner guards, the bay's number, the glove boxes,
    a sharps bin, a curtain's end caught on it"""
    P.box('hs_part', ox - 6, ox + 6, oy, oy + 0.14, 0.0, PART_H); P.box('panel', ox - 6, ox + 6, oy - 0.005, oy + 0.145, PART_H, PART_H + 0.03)
    P.box('hs_head', ox - 6, ox + 6, oy - 0.015, oy, 0.0, 0.1)
    for x in (ox - 4.0, ox, ox + 4.0):
        P.box('chrome', x - 0.04, x + 0.04, oy - 0.02, oy, 0.1, 1.5)
        P.box('white', x - 0.3, x + 0.3, oy - 0.02, oy, 1.55, 1.85); P.box('black', x - 0.12, x + 0.12, oy - 0.022, oy - 0.02, 1.62, 1.78)   # the bay's number
        for k in range(3): P.box('blue', x + 0.6 + k * 0.26, x + 0.84 + k * 0.26, oy - 0.12, oy, 1.2, 1.32)                           # the glove boxes
    P.box('red', ox + 1.4, ox + 1.7, oy - 0.15, oy, 0.9, 1.25); P.box('teal', ox - 2.6, ox - 2.2, oy - 0.08, oy, 0.4, PART_H)


def partition_ns(P, ox, oy, rng):
    P.box('hs_part', ox - 0.07, ox + 0.07, oy, oy + 12, 0.0, PART_H); P.box('panel', ox - 0.075, ox + 0.075, oy, oy + 12, PART_H, PART_H + 0.03)
    P.box('hs_part', ox - 0.075, ox + 0.075, oy - 0.005, oy, 0.0, PART_H)


def hs_parts(P, rng):
    A = HS_AT
    bay(P, *A['bay'], rng); beds(P, *A['beds'], rng); pharmacy(P, *A['pharmacy'], rng); wall_ns(P, *A['wall_ns'], rng)
    wall_ew(P, *A['wall_ew'], rng); partition_ew(P, *A['partition_ew'], rng); station(P, *A['station'], rng); partition_ns(P, *A['partition_ns'], rng)
    gurney(P, *A['gurney'], rng); carts(P, *A['carts'], rng); chairs(P, *A['chairs'], rng)


def hs_mats(bpy, NF, F, M, which):
    if which not in ('hs_pieces', 'tun_pieces'): return
    if which == 'hs_pieces': HC.hc_mats(bpy, NF, F, M, 'hc_pieces')          # the home center's and everything under it
    M.update(hs_deck=NF.material(bpy, 'in_black_bed_deck', 'tape_grey', 2, 0.85), hs_pad=NF.material(bpy, 'in_black_vinyl_pad', 'clay_teal', 1, 0.9),
             hs_head=NF.material(bpy, 'in_laminate_beige', 'clay_bone', 3, 0.85), hs_curtain=NF.material(bpy, 'in_cloth_curtain', 'clay_mustard', 3, 0.85),
             hs_seat=NF.material(bpy, 'in_black_vinyl_seat', 'clay_teal', 2, 0.9), hs_desk=NF.material(bpy, 'in_laminate_desk', 'clay_bone', 2, 0.85),
             hs_part=NF.material(bpy, 'in_paint_partition', 'clay_teal', 4, 0.75), hs_dome=NF.material(bpy, 'in_black_camera_dome', 'rubber', 0, 1.0),
             hs_troffer=NF.material(bpy, 'in_ceil_troffer', 'clay_bone', 4, 0.9))


TG.PARTS['hs_pieces'] = hs_parts
TG.MAT_HOOKS.append(hs_mats)


# ---- the ceiling: the dropped ceiling, five bays by five that repeat -----------------------------------------------------
def ceil_hospital(P, rng):
    """the lay-in grid (the casino's) and its tiles; tiles out in runs where the wiring hangs and the dark over them; the 2 by 4 light
    panels dead; a diffuser in every bay; a camera's dome in some; the stains where the roof leaked"""
    at = TG.at
    P.box('tile', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)
    for k in range(101): P.box('conc_d', k * 0.6 - 0.03, k * 0.6 + 0.03, -3.0, 63.0, 0.0, 0.012)              # the lay-in grid (its tees dark with dirt: the
    for j in range(-4, 106): P.box('conc_d', -3.0, 63.0, SIDE - j * 0.6 - 0.03, SIDE - j * 0.6 + 0.03, 0.0, 0.012)   #  first's pale tees read under a tenth)
    for r in range(5):
        for c in range(5):
            hole = (rng.randint(3, 16), rng.randint(3, 16)) if rng.rand() < 0.85 else None
            for i in range(0, 20):
                for j in range(0, 20):
                    near = hole and abs(i - hole[0]) + abs(j - hole[1]) <= 2
                    u = rng.rand(); x, y = at(c, r, i * 0.6, j * 0.6)
                    if u < (0.7 if near else 0.012): P.box('black', x + 0.03, x + 0.57, y - 0.57, y - 0.03, 0.0, 0.006)   # a tile out: the dark over it
                    elif u < (0.8 if near else 0.02): P.box('stain', x + 0.03, x + 0.57, y - 0.57, y - 0.03, 0.0, 0.006)   # (few alone: the first roof's
                                                                                                                    #  scatter read as noise at 10%)
            if rng.rand() < 0.5: x, y = at(c, r, rng.uniform(2, 10), rng.uniform(2, 10), 0.01); TG.bloom(P, 'stain', x, y, rng.uniform(0.6, 1.2), rng, 6)   # a leak's stain, spread
            if hole:
                for _ in range(rng.randint(2, 4)):
                    x, y = at(c, r, (hole[0] + rng.uniform(-1, 1)) * 0.6, (hole[1] + rng.uniform(-1, 1)) * 0.6)
                    P.bar('black', (x, y, 0.0), (x + rng.uniform(-0.4, 0.4), y, rng.uniform(0.6, 1.5)), 0.03)
            for (i, j) in ((3, 4), (3, 14), (13, 4), (13, 14)):          # the light panels, 2 by 4, dead
                x, y = at(c, r, i * 0.6, j * 0.6); P.box('hs_troffer', x + 0.02, x + 0.58 + 0.6, y - 1.18, y - 0.02, 0.0, 0.03)
                for k in range(3): P.box('steel', x + 0.05 + k * 0.38, x + 0.08 + k * 0.38, y - 1.15, y - 0.05, 0.03, 0.04)
            x, y = at(c, r, 9 * 0.6, 9 * 0.6); P.box('white', x + 0.04, x + 0.56, y - 0.56, y - 0.04, 0.0, 0.02)   # a diffuser
            for k in range(3): P.box('steel', x + 0.08 + k * 0.08, x + 0.52 - k * 0.08, y - 0.52 + k * 0.08, y - 0.08 - k * 0.08, 0.02 + k * 0.01, 0.025 + k * 0.01)
            if (r + 2 * c) % 3 == 0: x, y = at(c, r, 15.5 * 0.6, 9.5 * 0.6); P.drum('hs_dome', x, y, 0.0, 0.12, 0.18, 12, 0.08)   # a camera's dome


TG.CEILINGS['hospital'] = (ceil_hospital, 'hospital/hospital_ceiling.webp', "the dropped ceiling: its lay-in grid and tiles, tiles out in runs where the wiring hangs and the dark over them, the 2 by 4 light panels dead, a diffuser in every bay, a camera's dome in some, the stains where the roof leaked")
TG.CEIL_DATA['hospital'] = 'hospital/hospital.json'

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(bay='LOW_COVER', beds='LOW_COVER', pharmacy='COVER', wall_ew='WALL', wall_ns='WALL', partition_ew='WALL', partition_ns='WALL', station='COVER',
            gurney='LOW_COVER', carts='LOW_COVER', chairs='LOW_COVER')
HM = dict(bay=TRACK_H, beds=1.0, pharmacy=CAGE_H, wall_ew=WALL_H, wall_ns=WALL_H, partition_ew=PART_H, partition_ns=PART_H, station=1.2, gurney=0.9, carts=1.62, chairs=0.9)
NAME = dict(bay='TREATMENT BAYS', beds='WARD BEDS', pharmacy="THE PHARMACY'S CAGE", wall_ew="THE HOSPITAL'S WALL", wall_ns="THE HOSPITAL'S WALL",
            partition_ew="THE BAYS' PARTITION", partition_ns="THE BAYS' PARTITION", station="THE NURSES' STATION", gurney='GURNEYS', carts='CRASH CARTS', chairs='WAITING ROOM CHAIRS')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'hs_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'hospital_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'hs_pieces.png')).convert('RGBA'); A = HS_AT; sz = {}
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'hs_' + key, 'hospital', shadow)
    x, y = A['bay']; one('bay', (x - 6.0, x + 6.0 + 0.01, y - 0.3, y + 3.6 + TRACK_H * 1.45), 1.0)
    x, y = A['beds']; one('beds', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 2.6 + 1.1 * 1.45), 1.0)
    x, y = A['pharmacy']; one('pharmacy', (x - 5.0, x + 5.0, y - 2.0, y + 7.1 + CAGE_H * 1.45), 1.0)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.7, y + 0.4 + WALL_H * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + WALL_H * 1.45), 0.5)
    x, y = A['partition_ew']; one('partition_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 0.3 + PART_H * 1.45), 1.0)
    x, y = A['partition_ns']; one('partition_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + PART_H * 1.45), 0.5)
    x, y = A['station']; one('station', (x - 3.0, x + 3.0, y - 1.0, y + 3.4 + 2.0 * 1.45), 1.0)
    x, y = A['gurney']; one('gurney', (x - 2.2, x + 2.4, y - 0.8, y + 2.0 + 1.0 * 1.45), 1.0)
    x, y = A['carts']; one('carts', (x - 1.6, x + 2.6, y - 0.8, y + 1.4 + 2.1 * 1.45), 1.0)
    x, y = A['chairs']; one('chairs', (x - 3.0, x + 4.2, y - 0.6, y + 2.6 + 1.5 * 1.45), 1.0)
    for key, v in sz.items():
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'hs_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='hospital/hs_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['hospital/hospital_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'hs_' + k: ent(k) for k in sz}
    art = {'version': 'cook6-hospital-art-11-21', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's hospital (slices/fight_ground/hospital/hospital.json, BUILD 11/20w): the names its handoff asked for, the garage's format. floor.floor is the corridor's sheet vinyl (rows 0 to 2: its welded seams every 2 m, heel marks, a gurney's tracks, pills and a glove, now and then a dark smear dragged a few metres; nothing within 1.2 m of an edge but the vinyl); floor.wet the same vinyl slick (rows 3 and 4: water standing in the middle, its tide marks, the mop's arcs, a dry margin so it meets the floor); floor.ring the vinyl. Any tile of a list meets any tile of it.",
           'floor': {'floor': cells(VINYL), 'wet': cells(SLICK), 'ring': cells(VINYL)}, 'kit': kit,
           'how_it_lays': {'the bays': "hs_bay is a tile wide: three bays of 4 m, each a stretcher at its headwall 3.4 m north of the foot (your 'at' [0.5, 0.75]), the curtain tracks at 2.35 m. hs_partition_ew / _ns: the bays' partition, a tile long, 2.1 m (your 'W', an air wall).",
                           'the ward': "hs_beds is a tile wide: five frames 2.4 m apart, so a run of tiles is one row of beds.",
                           'the middle': "hs_station a counter in a U 5.2 m wide (your two by two of 'n' lays four); hs_pharmacy a cage 9.6 by 6.4 m, 2.7 m up, foot its south face middle (your 'at' [0.5, 0.95]), the bottles out of its hole to the south.",
                           'the corridor': "hs_gurney (and a wheelchair), hs_carts (the crash cart, two IV poles, the oxygen rack), hs_chairs (two rows and one more): foot each at its south edge middle.",
                           'the walls': "hs_wall_ew / _ns: painted block to 2.4 m, the crash rail, a tile long."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'hospital_art.json'))
    cp = os.path.join(REND, 'ceil_hospital.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'hospital_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'hospital/hospital.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "hospital/hospital_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):   # (the one agreed edit in COMBAT FOUR's file)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='hospital/hospital_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['hospital'][2],
                              contract="hospital.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat")
    json.dump(art, open(os.path.join(SHIP, 'hospital_art.json'), 'w'), indent=1)
    print('hospital: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_HOSPITAL_11_21.webp: before and now on his phone (the roof off and at his 10%), the ward, close in, the
    pieces at their own pixels, a tile of the vinyl and of the slick, the ceiling at full strength"""
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
    title('THE HOSPITAL, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the dropped ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'hospital_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'hospital_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'hospital_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the bays, the nurses\' station and the pharmacy\'s cage, the waiting room')
    strip([(lab, up(os.path.join(page_dir, 'hospital_upright_%s.png' % n))) for lab, n in (('THE BAYS', 'bays_close'), ('THE STATION, THE CAGE', 'station_close'), ('THE WAITING ROOM', 'chairs_close'))], cw, ch)
    wd = os.path.join(page_dir, 'ward', 'hospital_upright_open_a0.png')
    if os.path.exists(wd):
        title('THE OTHER LAYOUT: THE WARD', 'beds in rows, their mattresses gone; and close in on them')
        strip((('THE WARD', up(wd)), ('CLOSE IN', up(os.path.join(page_dir, 'ward', 'hospital_upright_beds_close.png'))), ('THE CEILING AT 10%', up(os.path.join(page_dir, 'ward', 'hospital_upright_open_a01.png')))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the bays, the beds, the pharmacy\'s cage, the station, the gurney, the crash cart, the chairs, the wall and the partition')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'hs_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('bay', 'beds'), 220); row_of(('pharmacy', 'station'), 260); row_of(('gurney', 'carts', 'chairs'), 150); row_of(('wall_ew', 'partition_ew'), 110)
    title('THE VINYL, THE SLICK, AND THE CEILING AT FULL STRENGTH', 'heel marks, a gurney\'s tracks, pills; water standing where the roof let it in; the dropped ceiling, tiles out, a camera\'s dome')
    fl = Image.open(os.path.join(SHIP, 'hospital_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'hospital_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_HOSPITAL_11_21.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-hospital-11-21.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'hs_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'hs_pieces' else TG.scene_ceiling('hospital', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_hs_floor(ID)
        col = {ID['tm_floor']: (168, 166, 158), ID['gar_white']: (178, 174, 162), ID['tun_water']: (54, 68, 64), ID['tun_fill']: (58, 49, 41), ID['tun_wet']: (88, 90, 76)}
        img = np.zeros((H, W, 3), np.float32)
        for k, c in col.items(): img[gid == k] = c
        img = img * (1 - dark[..., None] * 0.7) + (255 - img) * pale[..., None] * 0.35
        fn = os.path.join(TG.OUT, 'hs_floor_plan.png'); Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(fn); print(fn)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
