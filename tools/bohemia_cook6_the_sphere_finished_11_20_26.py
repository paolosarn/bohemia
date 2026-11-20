#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the Sphere, finished] (11/20/26; COMBAT FOUR's BUILD 11/20k asked 'FOR COOK (SIX, carrying FIVE's list) 2)';
VAMILY rules 461, 453, 441, 416, 451(a), 455).

COMBAT FOUR's eleventh inside (THE SPHERE, slices/fight_ground/sphere/sphere.json, laid by slices/bohemia_big_inside.js): a fight in
the dead bowl, the stage across the south, the tiers along the back (and down both sides in the_horseshoe), fallen screen panels and a
whole section of the screen down, the speakers that hung behind it, road cases, the sound desk, the barricade, people living in it.
All 20 of its pieces were stand-ins. These are the pictures under its names, through the master rig, ON this lane's powerhouse tool
(and the stadium's, and COOK FIVE's chain under them):

  THE FLOOR        sphere_floor_0.webp, five tiles by five. Rows 0 to 2: THE BOWL'S FLOOR, sealed concrete gone dark, the last show's
                   spike tape (the corners where gear stood, in yellow and white, torn), forklift scuffs, glass from the panels in
                   drifts. Row 3: TORN, broken where the rigging came down: the slab cracked into plates round a hole to the fill
                   under it, its dust thrown out, a margin of whole floor so it meets the floor. Row 4: the tiers' concrete step.
                   (No new ground: the rig's calibration board holds 25 and 24 are taken; these are the garage's deck and its paint,
                   the stadium's dirt and step, darkened by the plan.)
  THE PIECES       (sphere_art.json's kit, COMBAT FOUR's names)
    sp_stage       a tile of the stage, chest high, black: its deck units, the last show's tape, a monitor wedge, a mic stand down
    sp_panels      fallen screen panels, stacked and leaning against each other, their black faces cracked
    sp_screen      a whole section of the screen down with its frame, face down across the tile, its back up: the frame, the
                   panels' grey backs, the speakers still bolted on, the frame torn at its ends
    sp_speaker     an array of the speakers that hung behind the screen, come down on its side: a frame of modules, each a grid
                   of small drivers, one module broken off on the floor
    sp_desk        the sound desk in its pen: the riser, the long console under a dust sheet half off, its racks, a chair
    sp_cases / _b  road cases, stencilled; two, one open and its cables out
    sp_barricade   the crowd barrier, a tile of it, one section down, one pulled out of line
    sp_camp_a / _b (sp_bedding_a / _b the same pictures) a panel leaned on a case for a roof over bedding; cases in a U and
                   the stage's red curtain over them
    sp_tier        one tile of the tiers: concrete treads; sp_seats the tiers' seats facing SOUTH to the floor (upholstered, the
                   cushions folded up the way empty seats fold, some slashed); sp_stair_e / _w; sp_rail_ew / _ns the glass rail;
                   sp_wall_ew / _ns THE SCREEN'S FOOT: a concrete plinth and the screen's lowest panels, two out
  THE CEILING      sphere_ceiling.webp (rule 451(a), over the fight at 10%): ONE PICTURE THE SIZE OF THE BOARD, 20 by 15 (as the
                   stadium's and the powerhouse's: the screen's rows curve round its crown, so a 5 by 5 repeat would draw seams
                   across his board): the screen from inside, dark, its panels in rows curving over from the stage, panels out (the
                   frame and the speakers' grilles behind), a long tear where a section came down and one panel hanging in it by its
                   cable. NOTHING LIT (rule 459(e) is his).

  <venv>/bin/python tools/bohemia_cook6_the_sphere_finished_11_20_26.py render sp_floor | sp_pieces | ceil_sphere
  python3 tools/bohemia_cook6_the_sphere_finished_11_20_26.py cut
  python3 tools/bohemia_cook6_the_sphere_finished_11_20_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): Sphere, Las Vegas (opened 2023): one interior
LED screen of about 160,000 square feet, 16K, made by SACO, wrapping up, over and behind the seats; perforated so the sound comes
through from the speakers installed behind it (the whole sound system hidden behind the screen plane, beamforming arrays); about
17,500 seats rising steeply to it. A stage with its deck units and a front-of-house desk in its pen, road cases, crowd barriers:
any arena show. The twins: the stadium's kit and the powerhouse's.
REUSE CHECK (REUSE-FIRST): this lane's powerhouse tool (its crate, its board-size roof and its cut), the stadium's (its stand's treads,
bat()), COOK FIVE's tools (rig, grounds, Parts, cutter, scenes; the hall's stair): imported. New here: the Sphere's plan, parts, roof.
ANALOG HORROR: the biggest screen in the world, black, and one panel hanging by its cable in the tear; the last show's tape still on
the floor where the gear stood; people sleeping under a screen panel (rule 459(e): whether it could be lit again is not said).
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_powerhouse_finished_11_20_26 as PW     # this lane's: the powerhouse (and the stadium, and COOK FIVE's chain)

SD = PW.SD; TM = SD.TM; HT = SD.HT; TG = SD.TG; FW = SD.FW
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'sphere')
BOARD = (20, 15)
FLOOR, TORN, STEP = (0, 1, 2), 3, 4
ROW_P = SD.ROW_P


# ---- the ground (no new ground: the calibration board is full) --------------------------------------------------------------
def tile_xy(r, c):
    """the pixel window of tile (row, col) on the sheet"""
    return slice(r * TH, (r + 1) * TH), slice(c * TW, (c + 1) * TW)


def tape(X, Y, rng):
    """the last show's spike tape on one tile, never within 1.2 m of its edge: the corners of where the gear stood, loose crosses,
    now and then a long line; returns (yellow, white)"""
    yel = np.zeros(X.shape, bool); wht = np.zeros(X.shape, bool); hw = 0.03
    for _ in range(rng.randint(1, 4)):                                   # a riser's or a case's corners
        w, h = rng.uniform(1.2, 2.6), rng.uniform(0.8, 1.8); x0, y0 = rng.uniform(1.3, 10.7 - w), rng.uniform(1.3, 10.7 - h); m = np.zeros(X.shape, bool)
        for (px, sx) in ((x0, 1), (x0 + w, -1)):
            for (py, sy) in ((y0, 1), (y0 + h, -1)):
                xa, xb = sorted((px, px + sx * 0.3)); ya, yb = sorted((py, py + sy * 0.3))
                m |= (np.abs(Y - py) < hw) & (X >= xa) & (X <= xb); m |= (np.abs(X - px) < hw) & (Y >= ya) & (Y <= yb)
        (yel if rng.rand() < 0.5 else wht)[m] = True
    for _ in range(rng.randint(2, 6)):                                   # loose crosses where a stand stood
        cx, cy = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5); dx, dy = X - cx, Y - cy
        m = (np.abs(dx) < 0.14) & (np.abs(dy) < 0.14) & ((np.abs(dx - dy) < 0.045) | (np.abs(dx + dy) < 0.045))
        (yel if rng.rand() < 0.5 else wht)[m] = True
    if rng.rand() < 0.35:                                                # a long line: the edge of a riser that is gone
        y0 = rng.uniform(2.0, 10.0); xa = rng.uniform(1.4, 4.0); xb = rng.uniform(8.0, 10.6)
        wht[(np.abs(Y - y0) < hw) & (X > xa) & (X < xb)] = True
    return yel, wht


def glass(X, Y, rng, n=1, rad=(1.2, 2.2)):
    """glass from the panels in drifts: blocky shards (a tenth of a metre) thicker toward each drift's middle; returns (shard, glint)"""
    tbl = rng.rand(128, 128); v = tbl[np.clip((Y / 0.1).astype(int), 0, 127), np.clip((X / 0.1).astype(int), 0, 127)]
    sh = np.zeros(X.shape, bool); gl = np.zeros(X.shape, bool)
    for _ in range(n):
        cx, cy, r_ = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5), rng.uniform(*rad)
        dn = np.clip(1 - np.hypot(X - cx, Y - cy) / r_, 0, 1) ** 1.4 * 0.32
        sh |= v < dn; gl |= v < dn * 0.12
    return sh, gl


def plan_sp_floor(ID, seed=171):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['gar_deck'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    pale = np.clip((dust - 0.6) / 0.3, 0, 1) * 0.08; dark = 0.16 + np.clip((0.4 - dust) / 0.3, 0, 1) * 0.04    # the bowl's floor, sealed and gone dark
    # (the dust soft: the first render's read as blotches of camouflage over the dark floor)
    wear = FW.vnoise((H, W), 0.25 * PPM, rng)                            # tape torn up in places
    for r in range(4):
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; G, D, Pl, Wr = gid[sy, sx], dark[sy, sx], pale[sy, sx], wear[sy, sx]
            yel, wht = tape(X, Y, rng)
            if r == TORN: yel &= False                                    # (on the torn row only loose white, outside the hole)
            G[yel & (Wr > 0.25)] = ID['gar_yellow']; G[wht & (Wr > 0.22)] = ID['gar_white']
            D[(yel | wht)] = 0.08
            for _ in range(rng.randint(1, 3)):                           # a forklift's scuffs, curving
                ax, ay, R_ = rng.uniform(-4, 16), rng.uniform(-4, 16), rng.uniform(3, 7); d = np.hypot(X - ax, Y - ay)
                m = (np.abs(d - R_) < 0.07) & (X > 1.2) & (X < 10.8) & (Y > 1.2) & (Y < 10.8) & (np.arctan2(Y - ay, X - ax) % 1.2 < 0.55)
                D[m] = np.maximum(D[m], 0.3)
            if r < 3 and rng.rand() < 0.5:
                sh, gl = glass(X, Y, rng)
                G[sh] = ID['gar_deck']; D[sh] = 0.72; D[gl] = 0.0; Pl[gl] = 0.55
            if r == TORN:                                                # THE HOLE: the slab broken into plates round it, the fill under it
                cx, cy = 6 + rng.uniform(-0.8, 0.8), 6 + rng.uniform(-0.8, 0.8); rx, ry = rng.uniform(3.6, 4.3), rng.uniform(3.2, 3.9)
                nn = FW.vnoise(X.shape, 0.9 * PPM, rng)
                e = ((X - cx) / rx) ** 2 + ((Y - cy) / ry) ** 2 + 0.35 * (nn - 0.5)
                seeds = np.array([(cx + rng.uniform(-rx, rx), cy + rng.uniform(-ry, ry)) for _ in range(16)])
                dd = np.sqrt((X[..., None] - seeds[:, 0]) ** 2 + (Y[..., None] - seeds[:, 1]) ** 2); ds = np.sort(dd, -1); near = np.argmin(dd, -1)
                inside = e < 1.0; tilt = rng.uniform(-0.05, 0.3, 16)
                D[inside] = np.maximum(D[inside], 0.16 + tilt[near][inside])      # each plate at its own tilt
                crack = inside & ((ds[..., 1] - ds[..., 0]) < 0.06); D[crack] = 0.75
                core = e < 0.36; G[core] = ID['st_dirt']; D[core] = 0.12; Pl[core] = 0.1   # the fill under the slab
                rim = (e >= 1.0) & (e < 1.45); Pl[rim] = np.maximum(Pl[rim], 0.32 * (1.45 - e[rim]) / 0.45)   # its dust, thrown out
                ang = np.arctan2(Y - cy, X - cx)
                for a0 in rng.uniform(-math.pi, math.pi, 5):                 # cracks running out of it
                    m = (e >= 0.9) & (e < 1.9) & (np.abs(((ang - a0 + math.pi) % (2 * math.pi)) - math.pi) < 0.02 + 0.01 * nn) & (X > 1.0) & (X < 11.0) & (Y > 1.0) & (Y < 11.0)
                    D[m] = 0.6
                sh, gl = glass(X, Y, rng, 2, (1.5, 2.8)); sh &= ~core; G[sh & ~inside] = ID['gar_deck']; D[sh] = 0.72; D[gl] = 0.0; Pl[gl] = 0.55
    st = row == STEP; gid[st] = ID['st_step']; dark = np.where(st, 0.08, dark); pale = np.where(st, 0.05, pale)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['sp_floor'] = plan_sp_floor


def sp_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(13.0, 59.4)), 26)


TG.GARAGE_THINGS['sp_floor'] = sp_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
SP_AT = dict(tier=(10.0, 46.0), stair_e=(26.0, 46.0), stair_w=(42.0, 46.0), wall_ns=(57.0, 45.0),
             wall_ew=(10.0, 39.0), rail_ew=(26.0, 40.5), seats=(42.0, 30.0), rail_ns=(57.5, 27.0),
             stage=(10.0, 13.0), screen=(26.0, 15.0), speaker=(41.0, 18.0), desk=(53.0, 18.0),
             panels=(6.5, 3.0), cases=(16.0, 3.0), cases_b=(23.0, 3.0), barricade=(35.0, 4.0), camp_a=(47.5, 2.5), camp_b=(54.5, 2.5))
STAGE_H, SCREEN_H, SPK_H, DESK_H, CASE_H, BARR_H, WALL_H, RAIL_H, PANEL_H = 1.3, 2.1, 1.75, 1.5, 1.6, 1.15, 2.4, 1.07, 1.9
SEAT_P = 12.0 / 21


def tier(P, ox, oy, rng):
    """one tile of the tiers: concrete to 1.42 m, its treads and their nosings (the same on every tile's edge), the dead aisle lights,
    its front with the section's number painted on it, what people left on the front walk"""
    # (dark, as the bowl is dark: the first render laid the stadium's pale concrete here and the tiers read white over the dark floor)
    P.box('conc_d', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02); P.box('sp_tread', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.02, LEVEL_H)
    for k in range(14):
        y = oy + 12 - (k + 1) * ROW_P
        P.box('black', ox - 6, ox + 6, y - 0.05, y, LEVEL_H, LEVEL_H + 0.004); P.box('sp_back', ox - 6, ox + 6, y, y + 0.06, LEVEL_H, LEVEL_H + 0.01)
        for x in (ox - 0.4, ox + 0.4): P.box('under', x - 0.05, x + 0.05, y + 0.06, y + 0.1, LEVEL_H, LEVEL_H + 0.03)   # an aisle light, dead
    P.box('conc_d', ox - 6, ox + 6, oy - 0.03, oy, 0.0, 0.18)                                            # its kick
    for k, (dx, w_) in enumerate(((-0.9, 0.42), (-0.3, 0.42), (0.3, 0.42))): P.box('white', ox + dx, ox + dx + w_ * 0.8, oy - 0.034, oy - 0.03, 0.55, 1.05)   # the section's number
    P.box('card', ox + 3.0, ox + 3.6, oy + 0.3, oy + 0.32, LEVEL_H, LEVEL_H + 0.45); P.box('paint_k', ox + 3.1, ox + 3.5, oy + 0.29, oy + 0.3, LEVEL_H + 0.15, LEVEL_H + 0.3)   # a sign: names
    for s_ in range(2): P.box('black', ox - 4.0 + s_ * 0.16, ox - 3.9 + s_ * 0.16, oy + 0.5, oy + 0.78, LEVEL_H, LEVEL_H + 0.09)   # a pair of shoes
    for _ in range(10): x = ox + rng.uniform(-5.6, 5.6); y = oy + rng.uniform(0.3, 2.1); P.drum(('jug', 'paper', 'can')[rng.randint(3)], x, y, LEVEL_H, LEVEL_H + 0.12, 0.045, 8)


def seats(P, ox, oy, rng):
    """the tiers' seats facing SOUTH to the floor: eleven rows of 21 upholstered seats between their standards, the cushions folded
    up the way empty seats fold, some down, some slashed to the stuffing, bedding across three on some rows"""
    for k in range(11):
        y = oy + k * ROW_P; beds = [] if rng.rand() < 0.6 else [int(rng.randint(1, 17))]
        for i in range(22):                                              # the standards between them (the armrests on top)
            x = ox - 6 + i * SEAT_P + (0.03 if i == 0 else -0.03 if i == 21 else 0.0)
            P.box('black', x - 0.03, x + 0.03, y + 0.02, y + 0.46, 0.0, 0.6); P.box('sp_seat_d', x - 0.035, x + 0.035, y + 0.0, y + 0.46, 0.6, 0.66)
        for i in range(21):
            x = ox - 6 + (i + 0.5) * SEAT_P; r_ = rng.rand(); bed = any(b <= i < b + 3 for b in beds)
            m = 'sp_seat' if rng.rand() > 0.1 else 'sp_seat_d'
            P.box(m, x - 0.25, x + 0.25, y + 0.36, y + 0.46, 0.4, 0.98)                                     # the back
            if bed or r_ < 0.12: P.box(m, x - 0.24, x + 0.24, y - 0.02, y + 0.36, 0.38, 0.5)              # the cushion down
            else: P.box(m, x - 0.23, x + 0.23, y + 0.25, y + 0.35, 0.3, 0.82)                             # folded up
            if not bed and 0.12 <= r_ < 0.2: P.box('mat_', x - 0.1, x + 0.12, y + 0.4, y + 0.47, 0.6, 0.85)   # slashed: the stuffing out of its back
        for b in beds:
            x0 = ox - 6 + b * SEAT_P + 0.06
            P.box(('rug', 'blue', 'tan', 'cloth')[rng.randint(4)], x0, x0 + 3 * SEAT_P - 0.1, y - 0.02, y + 0.36, 0.5, 0.57)
            P.box('white', x0 + 0.05, x0 + 0.45, y + 0.04, y + 0.32, 0.57, 0.64)
            for s_ in range(2): P.box('black', x0 + 0.8 + s_ * 0.14, x0 + 0.9 + s_ * 0.14, y - 0.32, y - 0.06, 0.0, 0.09)
    for _ in range(8): x = ox + rng.uniform(-5.6, 5.6); y = oy + rng.uniform(0.0, 9.0); P.drum(('jug', 'paper', 'can')[rng.randint(3)], x, y, 0.0, 0.12, 0.045, 8)


def rail_ew(P, ox, oy, rng):
    """the glass rail along the tiers' front: its curb, steel posts every 1.5 m, glass between, the top rail; two panes broken out"""
    P.box('conc_d', ox - 6, ox + 6, oy, oy + 0.22, 0.0, 0.1)
    for k in range(9): x = ox - 6 + k * 1.5 + (0.03 if k == 0 else -0.03 if k == 8 else 0.0); P.box('steel', x - 0.03, x + 0.03, oy + 0.08, oy + 0.14, 0.1, RAIL_H)
    for k in range(8):
        x = ox - 6 + k * 1.5
        if k in (2, 6):                                                  # broken out: its glass on the floor in front
            P.box('rail_glass', x + 0.06, x + 1.44, oy + 0.1, oy + 0.12, 0.1, 0.22)
            for _ in range(7): gx = x + rng.uniform(0.1, 1.4); gy = oy - rng.uniform(0.1, 0.8); P.box('glassbit', gx, gx + rng.uniform(0.05, 0.14), gy, gy + rng.uniform(0.04, 0.1), 0.0, 0.012)
        else: P.box('rail_glass', x + 0.06, x + 1.44, oy + 0.1, oy + 0.12, 0.1, RAIL_H - 0.06)
    P.box('steel', ox - 6, ox + 6, oy + 0.06, oy + 0.16, RAIL_H - 0.05, RAIL_H)
    P.box('cloth_r', ox + 1.2, ox + 1.5, oy + 0.05, oy + 0.08, 0.6, RAIL_H)                                   # a strip of cloth tied on


def rail_ns(P, ox, oy, rng):
    P.box('conc_d', ox - 0.11, ox + 0.11, oy, oy + 12, 0.0, 0.1)
    for k in range(9): y = oy + k * 1.5 + (0.03 if k == 0 else -0.03 if k == 8 else 0.0); P.box('steel', ox - 0.03, ox + 0.03, y - 0.03, y + 0.03, 0.1, RAIL_H)
    for k in range(8):
        y = oy + k * 1.5; P.box('rail_glass', ox - 0.01, ox + 0.01, y + 0.06, y + 1.44, 0.1, (RAIL_H - 0.06) if k != 4 else 0.24)
    P.box('steel', ox - 0.05, ox + 0.05, oy, oy + 12, RAIL_H - 0.05, RAIL_H)


def wall_ew(P, ox, oy, rng):
    """THE SCREEN'S FOOT: the concrete plinth and the screen's lowest panels on their frame, two out (the frame and a speaker behind),
    names chalked on the plinth"""
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.4, 0.0, 0.7); P.box('steel', ox - 6, ox + 6, oy + 0.2, oy + 0.4, 0.7, WALL_H)
    P.box('conc_d', ox - 6, ox + 6, oy + 0.18, oy + 0.42, WALL_H, WALL_H + 0.04)
    out = {(3, 2), (8, 1)}
    for i in range(12):
        for j in range(3):
            x0 = ox - 6 + i * 1.0 + 0.015; z0 = 0.72 + j * 0.56
            if (i, j) in out: P.box('sp_grille', x0 + 0.1, x0 + 0.86, oy + 0.17, oy + 0.2, z0 + 0.06, z0 + 0.48); continue
            P.box('sp_led' if (i * 7 + j * 3) % 5 else 'sp_led_d', x0, x0 + 0.97, oy + 0.1, oy + 0.2, z0, z0 + 0.54)
    for k in range(5): x = ox - 4.6 + k * 2.1 + rng.uniform(-0.3, 0.3); P.box('chalk', x, x + rng.uniform(0.3, 0.7), oy - 0.006, oy, 0.25 + 0.08 * (k % 2), 0.38 + 0.08 * (k % 2))


def wall_ns(P, ox, oy, rng):
    P.box('conc', ox - 0.2, ox + 0.2, oy, oy + 12, 0.0, 0.7); P.box('sp_led', ox - 0.15, ox + 0.15, oy, oy + 12, 0.7, WALL_H)
    P.box('conc', ox - 0.206, ox + 0.206, oy - 0.006, oy, 0.0, 0.7)
    for k in range(1, 12): y = oy + k * 1.0; P.box('sp_led_d', ox - 0.155, ox + 0.155, y - 0.015, y + 0.015, WALL_H, WALL_H + 0.004)


def stage(P, ox, oy, rng):
    """a tile of the stage: chest high, black; its deck units (2.4 by 1.2, the same at every tile's edge), the last show's tape, a
    monitor wedge with its cable, a mic stand down, a roll of tape, the set list; its skirt"""
    S = STAGE_H
    P.box('black', ox - 6, ox + 6, oy, oy + 12, 0.0, S - 0.03); P.box('sp_deck', ox - 6, ox + 6, oy, oy + 12, S - 0.03, S)
    for k in range(1, 5): x = ox - 6 + k * 2.4; P.box('sp_deck_d', x - 0.01, x + 0.01, oy, oy + 12, S, S + 0.002)
    for k in range(1, 10): y = oy + k * 1.2; P.box('sp_deck_d', ox - 6, ox + 6, y - 0.01, y + 0.01, S, S + 0.002)
    P.box('black', ox - 6, ox + 6, oy - 0.03, oy, 0.0, S - 0.05)                                         # the skirt, its pleats
    for k in range(40): x = ox - 6 + 0.12 + k * 0.3; P.box('black', x, x + 0.1, oy - 0.05, oy - 0.03, 0.0, S - 0.05)
    for (cx, cy, m) in ((ox - 3.3, oy + 7.2, 'white'), (ox + 1.4, oy + 4.4, 'paint_y'), (ox + 4.2, oy + 8.8, 'white'), (ox - 1.1, oy + 2.6, 'paint_y')):   # spike marks
        P.box(m, cx - 0.14, cx + 0.14, cy - 0.025, cy + 0.025, S, S + 0.003); P.box(m, cx - 0.025, cx + 0.025, cy - 0.14, cy + 0.14, S, S + 0.003)
    y0 = oy + 3.0; P.prism_x('black', ox + 0.6, ox + 1.3, [(y0, S), (y0 + 0.55, S), (y0 + 0.55, S + 0.22), (y0 + 0.12, S + 0.42)])   # a monitor wedge
    P.box('sp_grille', ox + 0.65, ox + 1.25, y0 + 0.02, y0 + 0.06, S + 0.04, S + 0.32)
    pts = [(ox + 0.95, y0 + 0.6), (ox + 1.4, y0 + 1.6), (ox + 0.8, y0 + 2.9), (ox + 1.9, y0 + 4.6)]
    for (p0, p1) in zip(pts[:-1], pts[1:]): P.bar('black', (p0[0], p0[1], S + 0.02), (p1[0], p1[1], S + 0.02), 0.02)
    P.drum('black', ox - 2.4, oy + 5.2, S, S + 0.03, 0.16, 12); P.bar('chrome', (ox - 2.4, oy + 5.2, S + 0.04), (ox - 1.0, oy + 5.6, S + 0.04), 0.012)   # a mic stand, down
    P.drum('tape', ox + 3.4, oy + 2.0, S, S + 0.05, 0.07, 12); P.box('paper', ox - 0.5, ox - 0.29, oy + 1.5, oy + 1.8, S, S + 0.003)   # tape; the set list


def led_flat(P, x, y, w, d, z, face=True):
    """one panel module lying flat: its grey back and, face up, the black face with its tiles' seams"""
    P.box('sp_back', x, x + w, y, y + d, z, z + 0.1)
    if face:
        P.box('sp_led', x + 0.01, x + w - 0.01, y + 0.01, y + d - 0.01, z + 0.1, z + 0.12)
        for k in range(1, int(d / 0.5)): P.box('sp_led_d', x + 0.02, x + w - 0.02, y + k * 0.5 - 0.01, y + k * 0.5 + 0.01, z + 0.12, z + 0.124)


def panels(P, ox, oy, rng):
    """fallen screen panels: a stack of modules flat, two leaning on it face out, one cracked, the glass round them"""
    for k, (dx, dy) in enumerate(((-3.0, 0.4), (-2.9, 0.5), (-3.1, 0.35), (-2.95, 0.45))): led_flat(P, ox + dx, oy + dy, 1.0, 2.0, k * 0.125, face=(k == 3))
    for k, (x0, b, h) in enumerate(((ox - 1.6, oy + 0.6, 1.8), (ox - 0.5, oy + 0.75, 1.7), (ox + 0.6, oy + 0.6, 1.85))):
        P.prism_x('sp_back', x0, x0 + 1.0, [(b + 0.1, 0.0), (b + 0.22, 0.0), (b + 0.82, h), (b + 0.7, h)])     # its back, leaning on the stack
        P.prism_x('sp_led' if k != 1 else 'sp_led_d', x0 + 0.01, x0 + 0.99, [(b, 0.0), (b + 0.1, 0.0), (b + 0.7, h), (b + 0.6, h)])   # its face, out
        for j in range(1, 4): t = j / 4.0; P.box('sp_led_d', x0 + 0.02, x0 + 0.98, b + 0.6 * t - 0.012, b + 0.6 * t - 0.004, h * t - 0.01, h * t + 0.01)
    P.bar('glassbit', (ox - 0.4, oy + 0.85, 0.3), (ox + 0.1, oy + 1.1, 1.2), 0.01); P.bar('glassbit', (ox - 0.1, oy + 1.0, 0.8), (ox + 0.35, oy + 1.15, 1.25), 0.01)   # cracked
    led_flat(P, ox + 1.9, oy + 0.3, 1.0, 2.0, 0.0, face=False)                                         # one face down
    P.prism_x('sp_back', ox + 3.0, ox + 4.0, [(oy + 0.2, 0.0), (oy + 2.2, 0.0), (oy + 2.2, 0.1), (oy + 0.2, 0.55)])   # one on the floor, propped at an end
    for _ in range(26): gx = ox + rng.uniform(-3.8, 4.2); gy = oy + rng.uniform(-0.6, 0.4); P.box('glassbit', gx, gx + rng.uniform(0.04, 0.14), gy, gy + rng.uniform(0.04, 0.12), 0.0, 0.012)


def screen(P, ox, oy, rng):
    """a section of the screen down with its frame, face down across the tile (west to east and 3 m south over it, as the sections
    lie in the_screen_came_down): its back up, arched (the screen is a dome, so its ends are on the floor and its middle up), the
    panels' grey backs, the frame's chords and cross members, the speakers still bolted on, its ends torn, the cables out"""
    ang = math.atan2(-3.0, 12.0); ca, sa = math.cos(ang), math.sin(ang); cx, cy = ox, oy + 5.0; L, Wd = 12.6, 4.2
    pt = lambda u, v: (cx + u * ca - v * sa, cy + u * sa + v * ca)
    arch = lambda u: 0.75 * (1 - (u / (L / 2)) ** 2)
    n = 14
    for i in range(n):                                                   # the panels' backs, in strips along it
        u0, u1 = -L / 2 + i * L / n, -L / 2 + (i + 1) * L / n; z = arch((u0 + u1) / 2)
        q = [pt(u0, -Wd / 2), pt(u1, -Wd / 2), pt(u1, Wd / 2), pt(u0, Wd / 2)]; P.poly('sp_back', q, z, z + 0.1)
        if i in (3, 10):                                                 # panels hanging off its edge, face out
            P.poly('sp_led', [pt(u0, -Wd / 2 - 0.9), pt(u1, -Wd / 2 - 0.9), pt(u1, -Wd / 2), pt(u0, -Wd / 2)], 0.0, 0.08 + 0.1 * (i == 3))
    for v in (-1.8, -0.6, 0.6, 1.8):                                     # the frame's chords, top and bottom
        for zt in (0.12, 0.72):
            for i in range(n):
                u0, u1 = -L / 2 + i * L / n, -L / 2 + (i + 1) * L / n; a, b = pt(u0, v), pt(u1, v)
                P.bar('truss', (a[0], a[1], arch(u0) + zt), (b[0], b[1], arch(u1) + zt), 0.05)
    for k in range(11):                                                  # its cross members and the verticals
        u = -L / 2 + 0.6 + k * 1.14; z = arch(u)
        a, b = pt(u, -1.8), pt(u, 1.8); P.bar('truss', (a[0], a[1], z + 0.72), (b[0], b[1], z + 0.72), 0.04)
        for v in (-1.8, -0.6, 0.6, 1.8): c = pt(u, v); P.bar('truss', (c[0], c[1], z + 0.12), (c[0], c[1], z + 0.72), 0.03)
    for (u, v) in ((-4.2, -1.2), (-1.4, 1.2), (1.6, -1.2), (4.0, 1.2), (-2.8, 0.0)):   # the speakers still bolted on behind it
        z = arch(u) + 0.1; P.poly('black', [pt(u - 0.5, v - 0.35), pt(u + 0.5, v - 0.35), pt(u + 0.5, v + 0.35), pt(u - 0.5, v + 0.35)], z, z + 0.42)
    for s_ in (-1, 1):                                                   # its ends, torn: the chords bent up, the cables out
        u = s_ * L / 2
        for v in (-1.8, 0.6):
            a = pt(u, v); b = pt(u + s_ * 0.5, v + 0.3); P.bar('truss', (a[0], a[1], 0.72), (b[0], b[1], SCREEN_H - 0.1), 0.05)
        for k in range(3):
            a = pt(u, -1.0 + k * 0.9); b = pt(u + s_ * rng.uniform(0.8, 1.6), -1.4 + k * 1.1); P.bar('black', (a[0], a[1], 0.5), (b[0], b[1], 0.03), 0.025)
    for _ in range(30):                                                  # what broke off it
        u, v = rng.uniform(-L / 2, L / 2), rng.choice([-1, 1]) * rng.uniform(Wd / 2 + 0.2, Wd / 2 + 1.6); g = pt(u, v)
        P.box('glassbit' if rng.rand() < 0.7 else 'sp_led', g[0], g[0] + rng.uniform(0.05, 0.3), g[1], g[1] + rng.uniform(0.05, 0.25), 0.0, 0.015)


def speaker(P, ox, oy, rng):
    """an array of the speakers that hung behind the screen, come down on its side: a steel frame of eight modules by three, each a
    grid of small round drivers, facing south; one module broken off on the floor in front; its rigging bent, its cables"""
    x0, y0, Wd, D, Ht = ox - 2.6, oy + 0.8, 5.2, 0.7, 1.6
    P.box('steel', x0, x0 + Wd, y0, y0 + D, 0.0, Ht)
    for i in range(8):
        for j in range(3):
            mx, mz = x0 + 0.06 + i * 0.635, 0.06 + j * 0.51
            if (i, j) == (5, 0): P.box('black', mx, mx + 0.6, y0 - 0.005, y0, mz, mz + 0.48); continue   # the hole it left
            P.box('sp_grille', mx, mx + 0.6, y0 - 0.04, y0, mz, mz + 0.48)
            for a in range(4):
                for b in range(3): P.wheel('black', mx + 0.09 + a * 0.14, y0 - 0.045, mz + 0.1 + b * 0.14, 0.05, 0.012, 10)
    P.box('sp_grille', ox + 0.6, ox + 1.2, oy - 0.2, oy + 0.28, 0.0, 0.08)                               # the module broken off, face up
    for a in range(4):
        for b in range(3): P.drum('black', ox + 0.69 + a * 0.14, oy - 0.1 + b * 0.14, 0.08, 0.092, 0.05, 10)
    P.box('steel', x0 - 0.2, x0 + Wd + 0.2, y0 + 0.2, y0 + 0.5, Ht, Ht + 0.08)                           # its flybar, bent at one end
    P.bar('steel', (x0 + Wd + 0.2, y0 + 0.35, Ht + 0.04), (x0 + Wd + 0.9, y0 + 0.2, Ht - 0.6), 0.05)
    for k in range(6): P.bar('chrome', (x0 + 0.6 + k * 0.08, y0 + 0.35, Ht + 0.08 + (k % 2) * 0.03), (x0 + 0.68 + k * 0.08, y0 + 0.35, Ht + 0.08 + ((k + 1) % 2) * 0.03), 0.02)   # its chain
    pts = [(x0 + Wd, y0 + 0.4), (x0 + Wd + 0.6, y0 - 0.4), (x0 + Wd + 1.0, y0 - 1.2), (x0 + Wd + 1.4, y0 - 1.0)]
    for (p0, p1) in zip(pts[:-1], pts[1:]): P.bar('black', (p0[0], p0[1], 0.04), (p1[0], p1[1], 0.04), 0.035)


def desk(P, ox, oy, rng):
    """the sound desk in its pen: the riser, the long console (facing the stage, south) under a dust sheet half off, its racks, the
    engineer's chair, a cup, a notebook; the pen's barriers round it, open at the back"""
    rx0, rx1, ry0, ry1 = ox - 3.2, ox + 3.2, oy + 0.9, oy + 4.6
    P.box('black', rx0, rx1, ry0, ry1, 0.0, 0.3)
    cy0, cy1 = oy + 1.6, oy + 2.6; S = 0.3
    P.prism_x('sp_desk', ox - 1.8, ox + 1.8, [(cy0, S), (cy1, S), (cy1, S + 0.62), (cy0, S + 0.85)])     # the console: its meter bridge to the stage
    for i in range(24):                                                  # its faders
        x = ox - 1.7 + i * 0.145
        for t in (0.25, 0.55, 0.8): y = cy1 - t * (cy1 - cy0); P.box('white' if (i + int(t * 10)) % 7 else 'red', x, x + 0.03, y - 0.015, y + 0.015, S + 0.62 + 0.23 * t, S + 0.66 + 0.23 * t)
    P.box('canvas', ox + 0.3, ox + 1.9, cy0 - 0.05, cy1 + 0.05, S + 0.86, S + 0.9); P.box('canvas', ox + 0.3, ox + 1.9, cy0 - 0.08, cy0 - 0.05, S, S + 0.9)   # the dust sheet, half off
    for x in (ox - 2.7, ox + 2.1):                                       # its racks
        P.box('black', x, x + 0.6, cy0 + 0.1, cy0 + 0.9, S, S + 1.15)
        for k in range(5): P.box('sp_grille', x + 0.04, x + 0.56, cy0 + 0.06, cy0 + 0.1, S + 0.1 + k * 0.21, S + 0.27 + k * 0.21)
    P.drum('black', ox - 0.4, cy1 + 0.7, S, S + 0.08, 0.3, 10); P.drum('chrome', ox - 0.4, cy1 + 0.7, S + 0.08, S + 0.45, 0.03, 6)   # the chair
    P.box('black', ox - 0.65, ox - 0.15, cy1 + 0.45, cy1 + 0.95, S + 0.45, S + 0.53); P.box('black', ox - 0.65, ox - 0.15, cy1 + 0.92, cy1 + 1.0, S + 0.53, S + 1.05)
    P.drum('can', ox - 1.2, cy1 + 0.25, S, S + 0.12, 0.05, 8); P.box('paper', ox + 0.4, ox + 0.7, cy1 + 0.3, cy1 + 0.5, S, S + 0.01)
    for (a, b) in (((rx0 - 0.2, ry0 - 0.3), (rx1 + 0.2, ry0 - 0.3)), ((rx0 - 0.2, ry0 - 0.3), (rx0 - 0.2, ry1 - 0.6)), ((rx1 + 0.2, ry0 - 0.3), (rx1 + 0.2, ry1 - 0.6))):   # the pen
        L_ = math.hypot(b[0] - a[0], b[1] - a[1]); n = max(1, int(L_ / 0.12))
        for z in (0.1, 1.05): P.bar('steel', (a[0], a[1], z), (b[0], b[1], z), 0.02)
        for k in range(n + 1): t = k / n; P.bar('steel', (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.1), (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 1.05), 0.008)


def case(P, x, y, w, d, h, z=0.0, lid=True):
    """a road case: black ply, aluminium edges, corners, casters, its handle, its stencil"""
    zc = z + (0.12 if z == 0.0 else 0.0)
    if z == 0.0:
        for (dx, dy) in ((0.1, 0.1), (w - 0.1, 0.1), (0.1, d - 0.1), (w - 0.1, d - 0.1)): P.drum('black', x + dx, y + dy, 0.0, 0.12, 0.05, 8)
    P.box('sp_case', x, x + w, y, y + d, zc, zc + h)
    for zz in (zc, zc + h * (0.72 if lid else 1.0) - 0.02, zc + h - 0.02): P.box('chrome', x - 0.005, x + w + 0.005, y - 0.005, y + d + 0.005, zz, zz + 0.02)
    for xx in (x, x + w - 0.02): P.box('chrome', xx - 0.003, xx + 0.023, y - 0.006, y + 0.02, zc, zc + h)
    P.box('chrome', x + w * 0.4, x + w * 0.6, y - 0.012, y - 0.006, zc + h * 0.5, zc + h * 0.58)
    P.box('paint_w', x + w * 0.15, x + w * 0.85, y - 0.009, y - 0.006, zc + h * 0.2, zc + h * 0.32)


def cases(P, ox, oy, rng):
    case(P, ox - 1.6, oy + 0.6, 1.2, 0.65, 0.9); case(P, ox - 1.45, oy + 0.65, 0.8, 0.55, 0.55, z=1.02)
    case(P, ox - 0.2, oy + 0.4, 1.0, 0.8, 1.15); case(P, ox + 0.95, oy + 0.7, 0.7, 0.6, 0.6); case(P, ox + 0.3, oy - 0.3, 0.6, 0.45, 0.45)


def cases_b(P, ox, oy, rng):
    case(P, ox - 1.2, oy + 0.4, 1.0, 0.7, 0.75, lid=False); case(P, ox + 0.1, oy + 0.5, 0.8, 0.6, 0.6)
    P.prism_x('sp_case', ox - 1.2, ox - 0.2, [(oy - 0.4, 0.0), (oy - 0.3, 0.0), (oy + 0.05, 0.62), (oy - 0.05, 0.62)])   # its lid, off, leaning
    for k in range(5): a = k * 1.25; P.bar('cable_y' if k % 2 else 'black', (ox - 0.7 + 0.3 * math.cos(a), oy + 0.75, 0.9), (ox - 0.4 + 0.5 * math.cos(a + 1), oy - 0.2 - 0.15 * k, 0.03), 0.025)


def barricade(P, ox, oy, rng):
    """the crowd barrier in front of the stage, a tile of it: steel sections a metre wide with the plate the crowd stood on (to the
    north, the crowd's side); one section down, one pulled out of line, a jacket over one"""
    for k in range(12):
        x = ox - 6 + k * 1.0 + 0.02; dy = 0.45 if k == 7 else 0.0
        if k == 3:
            P.box('steel', x, x + 0.96, oy + 0.1, oy + 1.25, 0.0, 0.05); P.box('steel', x, x + 0.96, oy + 1.25, oy + 2.1, 0.0, 0.04); continue   # knocked down
        P.box('steel', x, x + 0.96, oy + dy, oy + dy + 0.04, 0.0, BARR_H - 0.06); P.tube_x('steel', x, x + 0.96, oy + dy + 0.02, BARR_H - 0.05, 0.05, 8)
        P.box('steel', x, x + 0.96, oy + dy + 0.04, oy + dy + 0.95, 0.0, 0.03)                                   # the plate
        for xx in (x + 0.1, x + 0.86): P.bar('steel', (xx, oy + dy + 0.04, BARR_H - 0.1), (xx, oy + dy + 0.9, 0.04), 0.025)
    P.box('cloth', ox + 0.1, ox + 0.7, oy - 0.08, oy + 0.12, 0.7, BARR_H + 0.03); P.box('card', ox - 2.8, ox - 2.2, oy - 0.03, oy - 0.01, 0.45, 0.9)


def camp(P, ox, oy, rng, b):
    """people living in the bowl: a panel leaned on a road case for a roof over bedding on cardboard, a stove, a pot, water, a
    lantern, the shoes; or road cases in a U with the stage's red curtain over them, a mattress inside, a radio"""
    if not b:
        case(P, ox - 2.6, oy + 1.2, 1.1, 0.7, 1.0)
        P.prism_x('sp_led', ox - 1.5, ox + 0.5, [(oy + 0.1, 0.0), (oy + 0.22, 0.0), (oy + 1.32, 1.1), (oy + 1.2, 1.1)])   # the panel, leaned on the case: the roof
        P.box('card', ox - 1.6, ox + 0.6, oy - 0.3, oy + 1.3, 0.0, 0.03); P.box('rug', ox - 1.5, ox + 0.3, oy - 0.2, oy + 0.9, 0.03, 0.11)
        P.box('blue', ox - 1.4, ox - 0.4, oy - 0.15, oy + 0.85, 0.03, 0.13); P.box('white', ox + 0.0, ox + 0.35, oy + 0.4, oy + 0.75, 0.11, 0.18)
        P.drum('pw_steel_d', ox + 1.2, oy + 0.3, 0.0, 0.24, 0.19, 10); P.drum('can', ox + 1.2, oy + 0.3, 0.24, 0.4, 0.12, 10)   # the stove, a pot
        P.drum('jug', ox + 1.7, oy + 0.9, 0.0, 0.32, 0.1, 8); P.box('haz', ox + 1.75, ox + 1.95, oy - 0.2, oy, 0.0, 0.28)   # water, a lantern
        for k in range(2): P.box('black', ox + 0.9 + k * 0.16, ox + 1.0 + k * 0.16, oy - 0.6, oy - 0.35, 0.0, 0.09)
    else:
        for (x0, y0, w, d) in ((ox - 2.3, oy + 0.3, 0.7, 1.6), (ox - 1.6, oy + 1.4, 2.6, 0.6), (ox + 1.0, oy + 0.3, 0.7, 1.6)): case(P, x0, y0, w, d, 0.85)
        P.box('cloth_r', ox - 2.4, ox + 1.8, oy + 0.2, oy + 2.1, 1.0, 1.06)                                  # the curtain over them, its folds down the front
        for k in range(14): x = ox - 2.4 + k * 0.3; P.box('cloth_r', x, x + 0.18, oy + 0.14, oy + 0.2, 0.55 + 0.25 * (k % 3 == 0), 1.06)
        P.box('mat_', ox - 1.5, ox + 0.9, oy + 0.4, oy + 1.4, 0.0, 0.18); P.box('blue', ox - 1.4, ox + 0.2, oy + 0.45, oy + 1.35, 0.18, 0.24)
        P.box('black', ox + 1.2, ox + 1.6, oy - 0.4, oy - 0.2, 0.0, 0.22); P.box('chrome', ox + 1.25, ox + 1.35, oy - 0.42, oy - 0.4, 0.06, 0.16)   # a radio
        for k in range(2): P.box('red', ox - 0.8 + k * 0.12, ox - 0.72 + k * 0.12, oy - 0.5, oy - 0.32, 0.0, 0.07)   # a child's shoes


def stair(P, ox, oy, sgn):
    """the stair up to the tiers: the hall's twelve broad steps (COOK FIVE's), dark as the tiers are (the first render took the hall's
    pale concrete and its yellow nosings, and the stairs read white beside the dark tiers)"""
    n = 12
    for i in range(n):
        xa = ox - 6 + i if sgn > 0 else ox + 6 - i - 1; z = LEVEL_H * (i + 1) / n
        P.box('conc_d', xa, xa + 1, oy + 0.3, oy + 11.7, 0.0, z - 0.02); P.box('sp_tread', xa, xa + 1, oy + 0.3, oy + 11.7, z - 0.02, z)
        xe = xa if sgn > 0 else xa + 1 - 0.07
        P.box('sp_back', xe, xe + 0.07, oy + 0.3, oy + 11.7, z, z + 0.005)                            # the nosing
    xl, xh = (ox - 6, ox + 6) if sgn > 0 else (ox + 6, ox - 6)
    for yy in (oy, oy + 11.7):
        pr = [(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.25), (xl, 0.25)]
        P.prism_y('conc_d', yy, yy + 0.3, pr if sgn < 0 else pr[::-1])
        P.bar('steel', (xl, yy + 0.15, 1.0), (xh, yy + 0.15, LEVEL_H + 1.0), 0.03)
        for k in range(7): t = k / 6.0; x = xl + (xh - xl) * t; P.bar('steel', (x, yy + 0.15, LEVEL_H * t + 0.2), (x, yy + 0.15, LEVEL_H * t + 1.0), 0.02)


def sp_parts(P, rng):
    A = SP_AT
    tier(P, *A['tier'], rng); stair(P, *A['stair_e'], 1); stair(P, *A['stair_w'], -1); wall_ns(P, *A['wall_ns'], rng)
    wall_ew(P, *A['wall_ew'], rng); rail_ew(P, *A['rail_ew'], rng); seats(P, *A['seats'], rng); rail_ns(P, *A['rail_ns'], rng)
    stage(P, *A['stage'], rng); screen(P, *A['screen'], rng); speaker(P, *A['speaker'], rng); desk(P, *A['desk'], rng)
    panels(P, *A['panels'], rng); cases(P, *A['cases'], rng); cases_b(P, *A['cases_b'], rng); barricade(P, *A['barricade'], rng)
    camp(P, *A['camp_a'], rng, False); camp(P, *A['camp_b'], rng, True)


def sp_mats(bpy, NF, F, M, which):
    if which not in ('sp_pieces', 'tun_pieces'): return
    if which == 'sp_pieces': PW.pw_mats(bpy, NF, F, M, 'pw_pieces')            # the powerhouse's, the stadium's and the chain's own
    # ('in_black' in a name: the rig lays a third of its dust on it. The first render named the panels and the cases otherwise: the
    #  panels came out pale grey and read as concrete, the cases' tops mottled like camouflage, the roof like cobblestones)
    M.update(sp_deck=NF.material(bpy, 'in_paint_stage_deck', 'rubber', 1, 0.95), sp_deck_d=NF.material(bpy, 'in_paint_stage_seam', 'rubber', 0, 1.0),
             sp_led=NF.material(bpy, 'in_black_led_panel', 'rubber', 1, 0.9), sp_led_d=NF.material(bpy, 'in_black_led_panel_d', 'rubber', 0, 0.95),
             sp_back=NF.material(bpy, 'in_black_led_back', 'tape_grey', 1, 0.9), sp_grille=NF.material(bpy, 'in_spk_grille', 'tape_grey', 1, 0.95),
             sp_seat=NF.material(bpy, 'in_cloth_seat', 'clay_teal', 0, 0.9), sp_seat_d=NF.material(bpy, 'in_cloth_seat_d', 'clay_teal', 0, 0.7),
             sp_case=NF.material(bpy, 'in_black_case_ply', 'rubber', 1, 0.95), sp_desk=NF.material(bpy, 'in_desk_console', 'tape_grey', 0, 0.95),
             sp_frame=NF.material(bpy, 'in_black_screen_frame', 'tape_grey', 2, 0.8), sp_tread=NF.material(bpy, 'in_black_tread', 'tape_grey', 1, 0.9))


TG.PARTS['sp_pieces'] = sp_parts
TG.MAT_HOOKS.append(sp_mats)


# ---- the ceiling: the screen from inside, one picture the size of the board --------------------------------------------------
CT = SIDE / BOARD[0]
bat = SD.bat
CROWN = (10.0, 5.2)                                                      # the screen's crown over the board (tiles; y from the north): its rows ring it


def ceil_sphere(P, rng):
    """the screen from inside, dark: behind it the frame (pale where panels are out) and the speakers' grilles; its panels in rows
    round its crown, curving over from the stage; panels out here and there; a long tear where a section came down, the frame's
    members across it and one panel hanging in it by its cable. Nothing lit."""
    P.box('sp_frame', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                # the frame behind, far up
    for j in range(-2, 18):                                                                             # its grid of members and the speakers' grilles in it
        y = bat(0, j * 1.0, 0.05)[1]; P.box('truss', -3.0, 63.0, y - 0.1, y + 0.1, 0.0, 0.05)
    for i in range(-1, 22):
        x = bat(i * 1.0, 0)[0]; P.box('truss', x - 0.1, x + 0.1, -3.0, 63.0, 0.0, 0.052)
    for _ in range(140):
        bx, by = rng.uniform(-0.5, BOARD[0] + 0.5), rng.uniform(-0.5, BOARD[1] + 0.5); x, y = bat(bx, by, 0.1); P.box('sp_grille', x - 0.6, x + 0.6, y - 0.35, y + 0.35, 0.06, 0.1)
    cx, cy = CROWN; tear = lambda r, a: 4.2 < r < 5.4 and -0.5 < a < 1.1          # (radius in tiles, angle) where the section came down
    ring_w, gap = 0.62, 0.07; n_out = 0; hang = None
    for k in range(26):
        r0, r1 = 0.4 + k * ring_w + gap / 2, 0.4 + (k + 1) * ring_w - gap / 2; rm = (r0 + r1) / 2
        n = max(6, int(round(2 * math.pi * rm / 1.0))); da = 2 * math.pi / n; off = rng.uniform(0, da)
        for i in range(n):
            a0, a1 = off + i * da, off + (i + 1) * da; am = (a0 + a1) / 2
            px_, py_ = cx + rm * math.cos(am), cy + rm * math.sin(am)
            if px_ < -1.0 or px_ > BOARD[0] + 1.0 or py_ < -1.0 or py_ > BOARD[1] + 1.0: continue
            amod = math.atan2(math.sin(am), math.cos(am))
            if tear(rm, amod):
                if hang is None and k == 7: hang = (rm, am)
                continue
            if rng.rand() < 0.045: n_out += 1; continue                 # a panel out: the frame and a grille behind
            ga = gap / (2 * rm); pts = []
            for (rr, aa) in ((r0, a0 + ga), (r0, a1 - ga), (r1, a1 - ga), (r1, a0 + ga)):
                b = bat(cx + rr * math.cos(aa), cy + rr * math.sin(aa), 0.3); pts.append(b)
            if (pts[1][0] - pts[0][0]) * (pts[2][1] - pts[0][1]) - (pts[1][1] - pts[0][1]) * (pts[2][0] - pts[0][0]) < 0: pts = pts[::-1]
            P.poly('sp_led' if rng.rand() > 0.25 else 'sp_led_d', pts, 0.2, 0.3 + 0.004 * (k % 3))
    for k in range(9):                                                   # the tear: the frame's members across it, bent
        a = -0.45 + k * 0.19; p0 = bat(cx + 4.25 * math.cos(a), cy + 4.25 * math.sin(a), 0.35); p1 = bat(cx + 5.35 * math.cos(a + 0.05 * (k % 3 - 1)), cy + 5.35 * math.sin(a + 0.05 * (k % 3 - 1)), 0.35)
        P.bar('truss', (p0[0], p0[1], 0.35), (p1[0], p1[1], 0.35), 0.12)
    for s_ in range(24):
        a0, a1 = -0.5 + s_ * 1.6 / 24, -0.5 + (s_ + 1) * 1.6 / 24
        for rr in (4.3, 5.3):
            p0 = bat(cx + rr * math.cos(a0), cy + rr * math.sin(a0), 0.32); p1 = bat(cx + rr * math.cos(a1), cy + rr * math.sin(a1), 0.32); P.bar('sp_back', (p0[0], p0[1], 0.32), (p1[0], p1[1], 0.32), 0.1)
    rm, am = hang if hang else (4.8, 0.3)                                # one panel hanging in it by its cable, turned
    hx, hy = cx + rm * math.cos(am), cy + rm * math.sin(am); z = 1.6
    q = [bat(hx + dx * math.cos(0.5) - dy * math.sin(0.5), hy + dx * math.sin(0.5) + dy * math.cos(0.5), z) for (dx, dy) in ((-0.35, -0.22), (0.35, -0.22), (0.35, 0.22), (-0.35, 0.22))]
    P.poly('sp_led', q, z - 0.06, z); t0 = bat(hx, hy - 0.3, 0.3); t1 = bat(hx, hy, z)
    P.bar('black', (t0[0], t0[1], 0.3), (t1[0], t1[1], z), 0.03)
    print('  ceil_sphere: panels out', n_out, 'hanging at', round(hx, 2), round(hy, 2))


TG.CEILINGS['sphere'] = (ceil_sphere, 'sphere/sphere_ceiling.webp', "the screen from inside, dark: its panels in rows round its crown, curving over from the stage; panels out and the frame and the speakers' grilles behind them; a long tear where a section came down, the frame's members across it and one panel hanging in it by its cable; nothing lit: one picture the size of the board")
TG.CEIL_DATA['sphere'] = 'sphere/sphere.json'
CEIL_SHIP = SD.CEIL_SHIP

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(tier='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', rail_ew='RAIL', rail_ns='RAIL', wall_ew='WALL', wall_ns='WALL', seats='LOW_COVER',
            stage='COVER', screen='COVER', speaker='COVER', desk='COVER', panels='COVER', cases='COVER', cases_b='DRESS', barricade='LOW_COVER',
            camp_a='LOW_COVER', camp_b='LOW_COVER')
HM = dict(tier=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, rail_ew=RAIL_H, rail_ns=RAIL_H, wall_ew=WALL_H, wall_ns=WALL_H, seats=0.98, stage=STAGE_H,
          screen=SCREEN_H, speaker=SPK_H, desk=DESK_H, panels=PANEL_H, cases=CASE_H, cases_b=0.9, barricade=BARR_H, camp_a=1.1, camp_b=1.06)
NAME = dict(tier="THE BOWL", stair_e='ITS STAIRS, EAST', stair_w='ITS STAIRS, WEST', rail_ew="THE TIERS' RAIL", rail_ns="THE TIERS' RAIL", wall_ew="THE SCREEN'S FOOT",
            wall_ns="THE SCREEN'S FOOT", seats="THE BOWL'S SEATS", stage='THE STAGE', screen='A SECTION OF THE SCREEN, DOWN', speaker='A FALLEN SPEAKER',
            desk='THE SOUND DESK', panels='FALLEN SCREEN PANELS', cases='ROAD CASES', cases_b='ROAD CASES', barricade='BARRICADE',
            camp_a="SOMEBODY'S BEDDING", camp_b="SOMEBODY'S BEDDING")
ALSO = dict(bedding_a='camp_a', bedding_b='camp_b')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'sp_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'sphere_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'sp_pieces.png')).convert('RGBA'); A = SP_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'sp_' + key, 'sphere', shadow)
    for key in ('tier', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.1, y + 12.0 + hh + (1.7 if key != 'tier' else 0.6)), 1.0 if key == 'tier' else 0.0)
    x, y = A['stage']; one('stage', (x - 6.0, x + 6.0 + 0.01, y - 0.12, y + 12.0 + STAGE_H * 1.45 + 0.9), 1.0)
    x, y = A['screen']; one('screen', (x - 6.6, x + 6.6, y + 0.4, y + 10.0 + SCREEN_H * 1.45), 1.0)
    x, y = A['desk']; one('desk', (x - 3.6, x + 3.6, y + 0.4, y + 4.8 + DESK_H * 1.45), 1.0)
    for key in ('tier', 'stair_e', 'stair_w', 'stage', 'screen', 'desk'):   # the canvas runs down to its foot (the gate's A4)
        v = sz[key]
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'sp_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1])), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.9, y + 0.4 + RAIL_H * 1.45 + 0.2), 0.4)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.6, x + 0.6, y - 0.1, y + 12.1 + RAIL_H * 1.45), 0.4)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 0.5 + WALL_H * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + WALL_H * 1.45), 0.5)
    x, y = A['seats']; one('seats', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 9.4 + 1.0 * 1.45), 1.0)
    x, y = A['speaker']; one('speaker', (x - 3.2, x + 4.2, y - 1.4, y + 1.6 + (SPK_H + 0.2) * 1.45), 1.0)
    x, y = A['panels']; one('panels', (x - 4.0, x + 4.4, y - 0.8, y + 2.6 + PANEL_H * 1.45), 1.0)
    x, y = A['cases']; one('cases', (x - 1.8, x + 1.9, y - 0.5, y + 1.6 + CASE_H * 1.45), 1.0)
    x, y = A['cases_b']; one('cases_b', (x - 1.4, x + 1.1, y - 1.0, y + 1.3 + 1.0 * 1.45), 1.0)
    x, y = A['barricade']; one('barricade', (x - 6.0, x + 6.0, y - 0.3, y + 2.3 + BARR_H * 1.45), 0.6)
    for key in ('camp_a', 'camp_b'):
        x, y = A[key]; one(key, (x - 2.9, x + 2.3, y - 0.8, y + 2.3 + 1.2 * 1.45), 1.0)
    for k, v in sz.items(): v.update(piece=k, src='sphere/sp_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['sphere/sphere_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'sp_' + k: ent(k) for k in sz}
    for a, k in ALSO.items(): kit['sp_' + a] = dict(ent(k), kind='DRESS')
    art = {'version': 'cook6-sphere-art-11-20', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's Sphere (slices/fight_ground/sphere/sphere.json, BUILD 11/20k): the names its handoff asked for, the garage's format. floor.floor is the bowl's floor (rows 0 to 2: sealed concrete gone dark, the last show's spike tape in yellow and white, forklift scuffs, glass from the panels in drifts on half the tiles; nothing within 1.2 m of an edge but the floor); floor.torn the floor broken where the rigging came down (row 3: plates round a hole to the fill under the slab, its dust thrown out, a margin of whole floor so it meets the floor); floor.high the tiers' step (row 4); floor.ring the bowl's floor. Any tile of a list meets any tile of it.",
           'floor': {'floor': cells(FLOOR), 'torn': cells((TORN,)), 'high': cells((STEP,)), 'ring': cells(FLOOR)}, 'kit': kit,
           'how_it_lays': {'the stage': "sp_stage on every stage tile, a tile wide and deep, 1.3 m, foot its south edge middle (your 'at' [0.5, 1.0]); its deck units are the same at every edge, so the tiles meet into one stage.",
                           'the screen': "sp_screen a section 12.6 m long lying west to east and 3 m south over the tile, its middle 5 m north of the foot (your 'at' [0.5, 0.92] puts it across the tile's middle), so a P beside a p reads as one section down; sp_panels the stack and its leaning panels, foot its south edge middle; sp_speaker the array on its side, 5.2 m, facing south.",
                           'the floor things': "sp_desk the riser, the console and the pen, 6.4 m; sp_cases a stack about 3 m wide, sp_cases_b two and a lid; sp_barricade a tile wide (twelve sections), the crowd's plates to the north; sp_camp_a / _b (sp_bedding_a / _b the same pictures): foot each at its south edge middle.",
                           'the tiers': "sp_tier on every high tile, 1.42 m up, foot its south edge middle, its treads the same at both edges; sp_seats on it (your 'at' [0.5, 0.82], lifted): eleven rows of 21 seats facing south, 9.4 m deep, a tile wide; sp_stair_e / _w the hall's concrete stair; sp_rail_ew the glass rail along a tier's front, sp_rail_ns along its side.",
                           'the bowl': "sp_wall_ew / _ns THE SCREEN'S FOOT: the concrete plinth to 0.7 m and the screen's lowest panels on their frame to 2.4 m; a tile long."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'sphere_art.json'))
    cp = os.path.join(REND, 'ceil_sphere.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        h15 = int(round(im.height * BOARD[1] / BOARD[0]))
        fn = os.path.join(SHIP, 'sphere_ceiling.webp'); bg.convert('RGB').crop((0, 0, im.width, h15)).resize(CEIL_SHIP, Image.LANCZOS).save(fn, 'WEBP', quality=62, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'sphere/sphere.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "sphere/sphere_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == list(BOARD)):   # (the one agreed edit in COMBAT FOUR's file: its ceiling entry's "have" and "tile")
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % BOARD, e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='sphere/sphere_ceiling.webp', bays=[5, 5], bay_px=[CEIL_SHIP[0] // 5, CEIL_SHIP[1] // 5], covers=list(BOARD), whole=True, what=TG.CEILINGS['sphere'][2],
                              contract="sphere.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); 'tile' [20, 15] is the board: ONE picture, never repeated (the screen's rows ring its crown)")
    json.dump(art, open(os.path.join(SHIP, 'sphere_art.json'), 'w'), indent=1)
    print('sphere: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_SPHERE_11_20.webp: the fight on his phone before and now (the roof off and at his 10%), the second
    layout, close in on the page, the pieces at their own pixels, a tile of the floor and the torn floor, the roof at full strength"""
    from PIL import ImageDraw, ImageFont
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
    title('THE SPHERE, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the dead screen overhead at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'sphere_upright_open_a0.png'))), ('NOW, THE ROOF OFF', up(os.path.join(page_dir, 'sphere_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE SCREEN AT 10%', up(os.path.join(page_dir, 'sphere_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the tiers they hold at the bell, the sound desk and the speakers, the stage')
    strip([(lab, up(os.path.join(page_dir, 'sphere_upright_%s.png' % n))) for lab, n in (('THE TIERS', 'tiers_close'), ('THE DESK, A SPEAKER', 'desk_close'), ('THE STAGE', 'stage_close'))], cw, ch)
    sc = os.path.join(page_dir, 'scd', 'sphere_upright_open_a0.png')
    if os.path.exists(sc):
        title('THE OTHER LAYOUT: THE SCREEN CAME DOWN', 'a section of the screen down across the floor in a diagonal, its panels round it; and close in on it')
        strip((('THE SCREEN CAME DOWN', up(sc)), ('CLOSE IN', up(os.path.join(page_dir, 'scd', 'sphere_upright_screen_close.png'))), ('THE ROOF AT 10%', up(os.path.join(page_dir, 'scd', 'sphere_upright_open_a01.png')))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the stage, the section of the screen down, the speakers, the desk, the panels, the cases, the barrier, the camps, the tiers and their seats, the screen\'s foot')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'sp_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('stage', 'screen'), 300); row_of(('speaker', 'desk', 'panels'), 190); row_of(('cases', 'cases_b', 'camp_a', 'camp_b'), 150); row_of(('tier', 'seats'), 300); row_of(('barricade', 'rail_ew', 'wall_ew'), 110)
    title('THE BOWL\'S FLOOR, THE TORN FLOOR, AND THE SCREEN AT FULL STRENGTH', 'the last show\'s tape, the glass from the panels; where the rigging came down; the screen from inside, the tear, one panel hanging')
    fl = Image.open(os.path.join(SHIP, 'sphere_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'sphere_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_SPHERE_11_20.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-sphere-11-20.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'sp_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'sp_pieces' else TG.scene_ceiling('sphere', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_sp_floor(ID)
        col = {ID['gar_deck']: (134, 131, 124), ID['gar_yellow']: (160, 126, 56), ID['gar_white']: (178, 174, 162), ID['st_dirt']: (118, 103, 80), ID['st_step']: (146, 143, 136)}
        img = np.zeros((H, W, 3), np.float32)
        for k, c in col.items(): img[gid == k] = c
        img = img * (1 - dark[..., None] * 0.7) + (255 - img) * pale[..., None] * 0.35
        fn = os.path.join(TG.OUT, 'sp_floor_plan.png'); Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(fn); print(fn)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
