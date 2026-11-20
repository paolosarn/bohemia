#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the stadium, finished] (11/20/26; COOK FIVE's next job, carried on by COOK SIX; VAMILY rules 461, 453,
441, 416, 451(a), 455: 'take the next jobs on your own list, one build each: finished art wherever a card still says STAND-IN').

COMBAT THREE's ninth inside (BUILD 11/18m - THE STADIUM, slices/fight_ground/stadium/stadium.json, laid by
slices/bohemia_big_inside.js): a fight on the stadium's field under its roof, eleven rows of dead turf, the relief left on it,
the last show's rig, and A STAND ALONG EACH LONG SIDE that THEY hold at the bell. 'In a disaster a stadium is where people are
sent... the relief is staged: pallets and tents on the turf, trucks driven in through the tunnels.' All 15 of its pieces were
stand-ins (the garage's, the casino's, the street board's). Its handoff names what it wants; these are the pictures, through the
master rig, ON COOK FIVE's terminal tool and the six under it (the data fort, warehouse, mall, hall, tunnels-and-garage, freeway):

  THE FLOOR        stadium_floor_0.webp, five tiles by five. Rows 0 to 2: DEAD TURF, never green: straw gone grey, a yard line
                   down every tile's middle (one tile is five yards: the board is the field), the yard's ticks in a row on a few,
                   bleached patches and bare ones, what the trucks' tyres pressed into it, a ring of soot where somebody burned
                   what they had. Row 3: TURF TORN TO THE DIRT where the trucks turned (a turf margin on every edge, so a torn tile
                   meets the field and any other torn tile). Row 4: a stand's concrete step (under the stand's own picture).
  THE PIECES       (stadium_art.json's kit, COMBAT THREE's names)
    st_stand       one tile of a stand from the field's side, the deck under the seats: concrete treads, the brackets of the
                   seats that were torn out, the dead ribbon board along its front, a blanket, the cups
    st_seats       a block of the stand's seats on it, a tile wide: black, folded up the way empty seats fold, some torn out,
                   some down with somebody's bedding across them
    st_stair_e / _w  the stairs at a stand's end (the hall's concrete stair: yellow nosing, rails)
    st_rail_ew     the rail along the field: steel, a bedsheet hung over it with words painted on it
    st_supplies / st_supplies_b   relief pallets, half a tile: water in its wrap, cartons strapped, folded cots; the second torn open
    st_tent        a relief tent, a tile's blocker: its ridge, its flap rolled up and the dark inside, guy lines, the list by
                   the door
    st_wreck_a / st_wreck_b   a box truck, its roll-up door open and nothing in it; an ambulance, its back doors open and the
                   stretcher half out, its straps undone
    st_rig         the last show's rig, a tile wide: the subs and the hung boxes on a ground stack, a truss tower, the sound
                   desk on its riser, the road cases, the snake
    st_barrier     crowd barriers, one down
    st_bench       a team's bench: the helmets still in a row on it, the cooler, the heater
    st_wall_ew / st_wall_ns   the bowl's wall: concrete, the padding (one panel torn to the foam), the ribbon board dead, names
                   chalked on the pad
  THE CEILING      stadium_ceiling.webp (rule 451(a), over the fight at 10%): ONE PICTURE THE SIZE OF THE BOARD (20 by 15 tiles,
                   COMBAT THREE's offer: 'yours may be one picture the size of the board'): the translucent roof's panels on a
                   net of cables running out from the ring, the ring over midfield with its panes out, the light banks round
                   the rim all dead, the dead scoreboard over one end zone.

  <venv>/bin/python tools/bohemia_cook6_the_stadium_finished_11_20_26.py cal
  <venv>/bin/python tools/bohemia_cook6_the_stadium_finished_11_20_26.py render st_floor | st_pieces | ceil_stadium [--quick]
  python3 tools/bohemia_cook6_the_stadium_finished_11_20_26.py plan          (the floor's plan as a picture, no Blender)
  python3 tools/bohemia_cook6_the_stadium_finished_11_20_26.py cut
  python3 tools/bohemia_cook6_the_stadium_finished_11_20_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): an NFL stadium under a fixed
translucent roof (a cable-net roof of ETFE panels, a ring over the field, light banks round the rim, an end-zone video board);
the field marked every five yards with the yard's ticks in rows; the first rows of the lower bowl on concrete treads with black
fold-up seats; a padded wall with a ribbon board; tunnels at the ends; the Superdome of 2005 for what a stadium is after
(relief pallets and tents on the turf, bedding in the seats, words on bedsheets hung over the rails, trucks driven onto the
field). The twins: the terminal's kit and the hall's (the card shows the stadium before and now).
REUSE CHECK (REUSE-FIRST): COOK FIVE's terminal tool (its suitcases), the hall's stair, and the tunnels-and-garage tool (rig,
grounds, plans, Parts, cutter, scenes, calibration): imported. New here only the stadium's own plan, parts and ceiling.
ANALOG HORROR: a team's helmets still in a row on the bench; a stretcher half out of the ambulance with its straps undone; names
chalked on the padding at the height of a hand; a bedsheet over the rail with words on it nobody came to read.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_terminal_finished_11_18_26 as TM      # COOK FIVE's: the terminal's tool, the fort's, the warehouse's, the mall's, the hall's and TG through it

DF = TM.DF; WT = DF.WT; MT = WT.MT; HT = MT.HT; TG = HT.TG; FW = TG.FW
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'stadium')

# ---- the ground ------------------------------------------------------------------------------------------------------------
TG.GROUNDS['st_turf'] = dict(role=('tape_masking', 2), target=(141, 130, 98), h=0.0, alt=('clay_bone', 2), alt_amt=0.32, grit=0.24, speck=(95, 0.3))
TG.GROUNDS['st_line'] = dict(role=('tape_grey', 4), target=(176, 171, 156), h=0.0, alt=('tape_grey', 3), alt_amt=0.2, grit=0.12, speck=(45, 0.16),
                             wornthrough=dict(scale=3.2, cut=0.36, to=('tape_masking', 2)))
TG.GROUNDS['st_dirt'] = dict(role=('tape_masking', 1), target=(118, 103, 80), h=0.02, alt=('clay_bone', 1), alt_amt=0.3, grit=0.3, speck=(55, 0.32))
TG.GROUNDS['st_step'] = dict(role=('tape_grey', 2), target=(146, 143, 136), h=0.0, alt=('tape_grey', 1), alt_amt=0.1, grit=0.06, speck=(60, 0.08),
                             joints=dict(pitch=3.0, width=0.016), panel_var=0.03)
TG.CAL0.update(st_turf=0.85, st_line=0.72, st_dirt=0.95, st_step=0.9)
TG.WEAR.update(st_turf=0.3, st_line=0.2, st_dirt=0.25, st_step=0.25)
TG.STONES['st_dirt'] = [(2.5, 0.03, 0.08, 'pebble'), (0.2, 0.08, 0.16, 'fill_rock')]
TURF_ROWS, TORN_ROW, STEP_ROW = (0, 1, 2), 3, 4
LINE_X, LINE_W = 6.0, 0.10                                     # one yard line down every tile's middle: a tile is five yards
TICKS = (1.2, 3.6, 8.4, 10.8)                                  # the yard's ticks between two lines (none on a tile's edge)
TICK_TILES = ((0, 3, 4.2), (2, 1, 7.6))                        # (row, col, the row's line south of the tile's north edge): a hash row still there


def plan_st_floor(ID, seed=137):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['st_turf'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    n2 = FW.vnoise((H, W), 0.5 * PPM, rng)
    patch = TG.mixn(FW.vnoise((H, W), 2.2 * PPM, rng), TG.pnoise(rng, 2.0), w)
    blot = TG.mixn(FW.vnoise((H, W), 1.1 * PPM, rng), TG.pnoise(rng, 1.0), w)
    # the straw is not one tone: bleached where the sun had it, darker where the last water stood
    pale = np.clip((patch - 0.55) / 0.25, 0, 1) * 0.3
    dark = np.clip((0.42 - patch) / 0.22, 0, 1) * 0.22
    turf = np.isin(row, TURF_ROWS)
    # the grain of dead grass: a fine mottle of paler and darker straw (tufts a hand across), the same everywhere
    g1 = FW.vnoise((H, W), 0.12 * PPM, rng); g2 = FW.vnoise((H, W), 0.3 * PPM, rng)
    pale = np.maximum(pale, np.clip((g1 - 0.55) / 0.3, 0, 1) * 0.14 * turf)
    dark = np.maximum(dark, np.clip((0.4 - g2) / 0.3, 0, 1) * 0.1 * turf)
    # the patches where the turf died to dust, inside a tile, in rounds: bleached pale, never a dark stain (the first render
    # read them as oil on the field)
    tb = TG.top(blot * w, 0.03); bare = turf & (blot * w > tb)
    pale = np.maximum(pale, np.clip((blot * w - (tb - 0.05)) / 0.05, 0, 1) * 0.5 * turf)
    # what the trucks' tyres pressed into it: a pair of curved ruts across a few tiles, fading out before a tile's edge
    for (r, c, x0, y0, a0, bend) in ((0, 1, 1.5, 9.0, -0.25, 0.05), (1, 4, 1.0, 3.0, 0.3, -0.04), (2, 2, 2.0, 10.0, -0.45, 0.06), (1, 0, 1.2, 6.5, 0.12, 0.03)):
        for off in (-0.95, 0.95):
            pts = []; x, y, a = c * TMT + x0, r * TMT + y0, a0
            for k in range(60):
                pts.append((x - math.sin(a) * off, y + math.cos(a) * off)); x += math.cos(a) * 0.17; y += math.sin(a) * 0.17; a += bend * 0.17
            for (p0, p1) in zip(pts[:-1], pts[1:]):
                ya, yb = int(max(0, (min(p0[1], p1[1]) - 0.4) * PYM)), int(min(H, (max(p0[1], p1[1]) + 0.4) * PYM)); xa, xb = int(max(0, (min(p0[0], p1[0]) - 0.4) * PPM)), int(min(W, (max(p0[0], p1[0]) + 0.4) * PPM))
                X, Y = xm[ya:yb, xa:xb], ty[ya:yb, xa:xb]; dx, dy = p1[0] - p0[0], p1[1] - p0[1]; t = np.clip(((X - p0[0]) * dx + (Y - p0[1]) * dy) / max(dx * dx + dy * dy, 1e-6), 0, 1)
                dd = np.hypot(X - (p0[0] + t * dx), Y - (p0[1] + t * dy))
                dark[ya:yb, xa:xb] = np.maximum(dark[ya:yb, xa:xb], np.clip(1 - dd / 0.2, 0, 1) * 0.34 * w[ya:yb, xa:xb] * (0.7 + 0.3 * n2[ya:yb, xa:xb]))
    # a ring of soot where somebody burned what they had, the ash in its middle
    for (r, c, fx, fy) in ((1, 2, 0.4, 0.55), (2, 4, 0.62, 0.4)):
        cx, cy = TG.tile_c(c, r, fx, fy); d = np.sqrt((xm - cx) ** 2 + (ty - cy) ** 2)
        dark = np.maximum(dark, np.clip(1.3 - d / 1.0, 0, 1) * (0.5 + 0.5 * n2) * 0.8 * (row == r) * (col == c))
        pale = np.where((d < 0.38) & (row == r) & (col == c), np.maximum(pale, 0.7 * (n2 > 0.3)), pale)
        gid[(d < 0.9) & (row == r) & (col == c)] = ID['st_dirt']
    # THE TORN ROW: turf on a margin round every tile (so it meets the field and itself), the middle torn to the dirt
    torn_n = FW.vnoise((H, W), 1.4 * PPM, rng); torn_f = FW.vnoise((H, W), 0.4 * PPM, rng); wt = TG.win(lx, ly, 0.7, 2.6)
    torn = (row == TORN_ROW) & ((wt * (0.35 + 0.7 * torn_n + 0.3 * torn_f)) > 0.38)
    clump = FW.vnoise((H, W), 0.45 * PPM, rng) > 0.72                       # clods of turf turned over, lying in the dirt
    gid[torn & ~clump] = ID['st_dirt']
    rut = np.zeros((H, W), np.float32)
    for c in range(5):                                                       # the ruts where the trucks turned: deep, curving, the ridge between them pale
        for k, (y0, a, bend) in enumerate(((4.2, 0.0, 0.06), (7.8, 0.1, -0.05))):
            x, y, aa = c * TMT + 1.5, TORN_ROW * TMT + y0 + 0.4 * math.sin(c * 1.7 + k), a + 0.12 * math.cos(c * 2.3 + k)
            for s_ in range(52):
                x1, y1 = x + math.cos(aa) * 0.18, y + math.sin(aa) * 0.18
                ya, yb = int(max(0, (min(y, y1) - 0.45) * PYM)), int(min(H, (max(y, y1) + 0.45) * PYM)); xa, xb = int(max(0, (min(x, x1) - 0.45) * PPM)), int(min(W, (max(x, x1) + 0.45) * PPM))
                X, Y = xm[ya:yb, xa:xb], ty[ya:yb, xa:xb]; dx, dy = x1 - x, y1 - y; t = np.clip(((X - x) * dx + (Y - y) * dy) / max(dx * dx + dy * dy, 1e-6), 0, 1)
                dd = np.hypot(X - (x + t * dx), Y - (y + t * dy)); rut[ya:yb, xa:xb] = np.maximum(rut[ya:yb, xa:xb], np.clip(1 - dd / 0.32, 0, 1))
                x, y, aa = x1, y1, aa + bend * 0.18
    rut *= torn
    dark = np.where(row == TORN_ROW, np.maximum(dark * 0.6, rut * 0.5 + (torn & ~clump) * np.clip((0.5 - torn_n) * 0.5, 0, 0.2)), dark)
    pale = np.where(row == TORN_ROW, np.maximum(pale * 0.5, (torn & clump) * 0.15 + torn * np.clip((torn_n - 0.6) * 0.8, 0, 0.25)), pale)
    # THE YARD LINE down every tile's middle (field rows, and the torn row's margin), worn in places but never at a tile's edge
    edge_ok = (np.minimum(ly, TMT - ly) < 0.8)
    brk = (FW.vnoise((H, W), 0.9 * PPM, rng) < 0.22) & ~edge_ok
    line = (np.abs(lx - LINE_X) < LINE_W / 2) & ~brk & (np.isin(row, TURF_ROWS) | ((row == TORN_ROW) & (gid != ID['st_dirt'])))
    line &= ~bare
    gid[line] = ID['st_line']
    # the yard's ticks, a row still there on a few tiles
    for (r, c, y0) in TICK_TILES:
        for tx in TICKS:
            m = (row == r) & (col == c) & (np.abs(lx - tx) < LINE_W / 2) & (np.abs(ly - y0) < 0.3) & (n2 > 0.18)
            gid[m] = ID['st_line']
    # THE STEP ROW: a stand's concrete, the seat rows' treads (every 12/14 m: the same on every tile's edge)
    st = row == STEP_ROW; gid[st] = ID['st_step']
    tread = np.abs(((ly + 0.25) % (TMT / 14.0)) - 0.03) < 0.03
    dark = np.where(st, np.maximum(tread * 0.38, np.clip((0.4 - patch) / 0.3, 0, 1) * 0.12), dark)
    pale = np.where(st, 0.06, pale)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['st_floor'] = plan_st_floor


def st_floor_things(bpy, NF, M, rng):
    """what lies on a field nobody has swept since: cups, a wristband here and there, cardboard, cans; the step row stays clean
    (the stand's own picture covers it)"""
    out = TG.floor_litter(bpy, NF, M, rng, 90)
    out += FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(13.0, 59.4)), 40)
    return out


TG.GARAGE_THINGS['st_floor'] = st_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
ST_AT = dict(stand=(10.0, 45.0), stair_e=(26.0, 45.0), stair_w=(42.0, 45.0), wall_ns=(57.0, 44.0),
             wall_ew=(10.0, 39.0), rail_ew=(26.0, 40.5), seats=(42.0, 31.0),
             rig=(10.0, 24.0), tent=(26.0, 25.0), wreck_a=(42.0, 21.0),
             bench=(10.0, 14.0), barrier=(26.0, 14.0), wreck_b=(42.0, 11.5), supplies=(54.0, 11.0),
             supplies_b=(10.0, 3.0))
WALL_H, RAIL_H, RIG_H, TENT_H, TRUCK_H, AMB_H = 2.2, 1.08, 5.0, 3.4, 3.3, 2.95
ROW_P = TMT / 14.0                                              # a seat row: 0.857 m, the same as the step row's treads
SEAT_Y0 = TMT * (1 - 0.82)                                      # the seats' foot north of a stand tile's south edge (COMBAT THREE's 'at' [0.5, 0.82]): 2.16 m


def stand(P, ox, oy, rng):
    """one tile of a stand, the deck under the seats: concrete to 1.42 m, its treads, the brackets of the seats torn out of it,
    the dead ribbon board along its front"""
    P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02); P.box('st_tread', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.02, LEVEL_H)
    for k in range(14):                                         # the treads' nosings (the same on every tile's edge)
        y = oy + 12 - (k + 1) * ROW_P
        P.box('under', ox - 6, ox + 6, y - 0.05, y, LEVEL_H, LEVEL_H + 0.004); P.box('conc', ox - 6, ox + 6, y, y + 0.06, LEVEL_H, LEVEL_H + 0.01)
    for k in range(11):                                         # the brackets: what is left where a seat was torn out (the seats' own rows and places, so
        y = oy + SEAT_Y0 + k * ROW_P                            # on a seats tile a bracket stands under its own seat; the front walk clear)
        for i in range(23):
            if rng.rand() < 0.3: continue
            x = ox - 5.98 + 0.3 + i * 0.52
            P.box('steel', x - 0.05, x + 0.05, y + 0.06, y + 0.3, LEVEL_H, LEVEL_H + 0.03)                    # its foot plate, bolted down
            if rng.rand() < 0.35: P.box('steel', x - 0.025, x + 0.025, y + 0.12, y + 0.24, LEVEL_H + 0.03, LEVEL_H + rng.uniform(0.06, 0.14))   # a stub of the standard, sawn off
            # (the first render stood every standard to 0.42 m: its shadow read as a scratch on the concrete, row after row)
    P.box('ribbon', ox - 6, ox + 6, oy - 0.04, oy, LEVEL_H - 0.66, LEVEL_H - 0.08)                       # the ribbon board, dead
    for k in range(3): x = ox - 5 + rng.uniform(0, 9); P.box('tape', x, x + 0.6, oy - 0.046, oy - 0.04, LEVEL_H - 0.6, LEVEL_H - 0.14)   # its dead modules
    P.box('pad', ox - 6, ox + 6, oy - 0.03, oy, 0.0, LEVEL_H - 0.7)                                       # the padding under it
    for x in (ox - 6, ox - 4, ox - 2, ox, ox + 2, ox + 4): P.box('under', x, x + 0.02, oy - 0.034, oy - 0.03, 0.0, LEVEL_H - 0.7)
    P.box('rug', ox - 3.4, ox - 1.6, oy + 0.4, oy + 1.5, LEVEL_H, LEVEL_H + 0.05); P.box('white', ox - 3.3, ox - 2.9, oy + 0.5, oy + 0.9, LEVEL_H + 0.05, LEVEL_H + 0.12)   # somebody's blanket on the front walk
    for _ in range(12): x = ox + rng.uniform(-5.6, 5.6); y = oy + rng.uniform(0.3, 2.1); P.drum(('jug', 'paper', 'can')[rng.randint(3)], x, y, LEVEL_H, LEVEL_H + 0.12, 0.045, 8)   # the cups


def seat(P, x, y, z, how, rng, m='seat'):
    """a fold-up bucket seat facing the field (south): 'up' folded as empty seats fold, 'down', or 'gone' (its bracket)"""
    P.box('steel', x - 0.03, x + 0.03, y + 0.02, y + 0.36, z, z + 0.42)                                  # the bracket
    if how == 'gone': return
    P.box(m, x - 0.22, x + 0.22, y + 0.32, y + 0.38, z + 0.4, z + 0.86)                                   # the back
    if how == 'up': P.box(m, x - 0.2, x + 0.2, y + 0.25, y + 0.31, z + 0.36, z + 0.78)                    # the pan, folded up against it
    else: P.box(m, x - 0.21, x + 0.21, y + 0.0, y + 0.32, z + 0.4, z + 0.46)


def seats(P, ox, oy, rng):
    """a block of the stand's seats, a tile wide: eleven rows of 23, folded up the way empty seats fold, some torn out, some down
    with bedding across them"""
    for k in range(11):
        y = oy + k * ROW_P; beds = [] if rng.rand() < 0.55 else [int(rng.randint(2, 18))]
        for i in range(23):
            x = ox - 5.98 + 0.3 + i * 0.52; r_ = rng.rand()
            bed = any(b <= i < b + 4 for b in beds)
            how = 'down' if bed else ('gone' if r_ < 0.14 else ('down' if r_ < 0.24 else 'up'))
            seat(P, x, y, 0.0, how, rng, 'seat_g' if rng.rand() < 0.08 else 'seat')
        for b in beds:                                          # bedding across four seats: a blanket, a pillow, the shoes under them
            x0 = ox - 5.98 + 0.3 + b * 0.52 - 0.22
            P.box(('rug', 'blue', 'tan', 'cloth')[rng.randint(4)], x0, x0 + 2.0, y - 0.02, y + 0.4, 0.46, 0.53); P.box('white', x0 + 0.05, x0 + 0.45, y + 0.04, y + 0.34, 0.53, 0.6)
            for s_ in range(2): P.box('black', x0 + 0.9 + s_ * 0.14, x0 + 1.0 + s_ * 0.14, y - 0.3, y - 0.05, 0.0, 0.09)
    for _ in range(10): x = ox + rng.uniform(-5.6, 5.6); y = oy + rng.uniform(0.0, 9.0); P.drum(('jug', 'paper', 'can')[rng.randint(3)], x, y, 0.0, 0.12, 0.045, 8)


def rail(P, ox, oy, rng):
    """the rail along the field: steel posts every two metres, two rails, and a bedsheet hung over it with words painted on it"""
    for i in range(7):
        x = ox - 6 + i * 2.0 + (0.03 if i == 0 else -0.03 if i == 6 else 0.0)
        P.bar('steel', (x, oy + 0.1, 0.0), (x, oy + 0.1, RAIL_H), 0.03)
    for z in (RAIL_H, 0.56): P.tube_x('steel', ox - 6, ox + 6, oy + 0.1, z, 0.03 if z > 1 else 0.022, 8)
    x0 = ox - 3.4; P.box('white', x0, x0 + 3.1, oy + 0.02, oy + 0.06, 0.1, RAIL_H + 0.02); P.box('white', x0, x0 + 3.1, oy + 0.06, oy + 0.2, RAIL_H, RAIL_H + 0.05)   # the sheet, over the top rail
    for k, (dx, z, w_) in enumerate(((0.25, 0.75, 0.42), (0.75, 0.75, 0.32), (1.15, 0.75, 0.5), (1.75, 0.75, 0.38), (0.35, 0.42, 0.58), (1.05, 0.42, 0.3), (1.5, 0.42, 0.64), (2.25, 0.42, 0.4))):
        P.box('paint_k', x0 + dx, x0 + dx + w_, oy + 0.014, oy + 0.02, z, z + 0.17)                          # its words, painted, nobody came to read
    P.box('rug', ox + 2.2, ox + 3.6, oy + 0.02, oy + 0.06, 0.45, RAIL_H + 0.02); P.box('rug', ox + 2.2, ox + 3.6, oy + 0.06, oy + 0.2, RAIL_H, RAIL_H + 0.05)   # a blanket hung to dry
    P.box('cloth_r', ox - 5.4, ox - 5.1, oy + 0.05, oy + 0.09, 0.62, RAIL_H)                              # a strip of cloth tied on: a sign somebody was here


def wall_ew(P, ox, oy, rng):
    """the bowl's wall: concrete to 2.2 m, the padding on it (one panel torn to the foam), the ribbon board dead, names chalked
    on the pad at the height of a hand"""
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.3, 0.0, WALL_H); P.box('steel', ox - 6, ox + 6, oy - 0.02, oy + 0.32, WALL_H, WALL_H + 0.04)
    P.box('pad', ox - 6, ox + 6, oy - 0.06, oy, 0.0, 1.25)
    for i in range(1, 6): P.box('under', ox - 6 + i * 2.0 - 0.012, ox - 6 + i * 2.0 + 0.012, oy - 0.066, oy - 0.06, 0.0, 1.25)
    P.box('must', ox + 0.25, ox + 1.4, oy - 0.064, oy - 0.06, 0.2, 0.95); P.box('pad', ox + 0.3, ox + 1.1, oy - 0.3, oy - 0.06, 0.0, 0.06)   # the panel torn to its foam, the cover on the ground
    P.box('ribbon', ox - 6, ox + 6, oy - 0.04, oy, 1.45, 1.95)
    for k in range(2): x = ox - 4.5 + k * 6.2 + rng.uniform(0, 1.5); P.box('tape', x, x + 0.7, oy - 0.046, oy - 0.04, 1.5, 1.9)
    for _ in range(26):                                         # the names, chalked at the height of a hand, in rows
        x = ox + rng.uniform(-5.7, 5.4); z = rng.choice((0.95, 0.78, 0.61, 0.44)) + rng.uniform(-0.03, 0.03)
        if ox + 0.2 < x < ox + 1.5: continue
        P.box('chalk', x, x + rng.uniform(0.18, 0.42), oy - 0.068, oy - 0.064, z, z + 0.05)
    P.box('paint_w', ox - 4.9, ox - 4.1, oy - 0.046, oy - 0.04, 1.27, 1.42)                               # a section's number plate


def wall_ns(P, ox, oy, rng):
    P.box('conc', ox - 0.15, ox + 0.15, oy, oy + 12, 0.0, WALL_H); P.box('steel', ox - 0.17, ox + 0.17, oy, oy + 12, WALL_H, WALL_H + 0.04)
    for s_ in (-1, 1): P.box('pad', ox + s_ * 0.15 - (0.06 if s_ < 0 else 0.0), ox + s_ * 0.15 + (0.06 if s_ > 0 else 0.0), oy, oy + 12, 0.0, 1.25)
    P.box('pad', ox - 0.21, ox + 0.21, oy - 0.006, oy, 0.0, 1.25)


def pallet(P, x, y, load, h, rng, wrap=True):
    """a pallet and its load: 'water' in its wrap, 'carton' strapped, 'cots' folded"""
    P.box('wood', x, x + 1.2, y, y + 1.0, 0.0, 0.14)
    for j in range(3): P.box('wood_d', x + 0.05 + j * 0.5, x + 0.2 + j * 0.5, y - 0.004, y, 0.0, 0.14)
    if load == 'water':
        for a in range(4):
            for b in range(3):
                P.box('jug', x + 0.04 + a * 0.29, x + 0.3 + a * 0.29, y + 0.04 + b * 0.31, y + 0.33 + b * 0.31, 0.14, 0.14 + h)
        if wrap: P.box('wrap', x + 0.02, x + 1.18, y + 0.02, y + 0.98, 0.14 + h, 0.14 + h + 0.01)
    elif load == 'carton':
        for a in range(2):
            for b in range(2):
                for c in range(int(h / 0.32)):
                    P.box('card', x + 0.03 + a * 0.58, x + 0.6 + a * 0.58, y + 0.03 + b * 0.48, y + 0.5 + b * 0.48, 0.14 + c * 0.32, 0.14 + c * 0.32 + 0.31)
        for z in (0.45, 0.95):
            if z < h: P.box('blue', x + 0.025, x + 1.175, y + 0.025, y + 0.975, 0.14 + z, 0.14 + z + 0.04)
    else:                                                       # cots, folded, stacked flat
        for c in range(int(h / 0.12)):
            z = 0.14 + c * 0.12; P.box('steel', x + 0.05, x + 1.15, y + 0.15, y + 0.85, z, z + 0.04); P.box('tan', x + 0.08, x + 1.12, y + 0.2, y + 0.8, z + 0.04, z + 0.11)


def supplies(P, ox, oy, rng):
    """relief pallets, half a tile: water, cartons, cots; the last one pulled from and left"""
    for (dx, dy, load, h) in ((-2.1, 0.1, 'water', 1.15), (-0.8, 0.1, 'carton', 1.28), (0.5, 0.15, 'water', 0.82), (-1.5, 1.3, 'cots', 1.0), (-0.2, 1.35, 'carton', 0.96), (1.1, 1.3, 'water', 1.15)):
        pallet(P, ox + dx, oy + dy, load, h, rng)
    P.box('wrap', ox + 0.6, ox + 1.5, oy - 0.25, oy + 0.05, 0.0, 0.03)                                    # its wrap, cut and pulled down
    for _ in range(8): x = ox + rng.uniform(0.4, 2.0); y = oy + rng.uniform(-0.8, -0.1); P.drum('jug', x, y, 0.0, 0.07, 0.035, 8)   # bottles on the turf, lying
    P.box('card', ox + 1.9, ox + 2.4, oy - 0.2, oy + 0.25, 0.0, 0.3); P.box('paper', ox - 2.4, ox - 1.9, oy - 0.3, oy - 0.05, 0.0, 0.006)


def supplies_b(P, ox, oy, rng):
    pallet(P, ox - 1.3, oy + 0.4, 'carton', 0.64, rng); pallet(P, ox + 0.1, oy + 0.5, 'water', 0.41, rng, wrap=False)
    for _ in range(9): x = ox + rng.uniform(-1.4, 1.3); y = oy + rng.uniform(-0.3, 0.3); P.box('card', x, x + rng.uniform(0.3, 0.55), y, y + rng.uniform(0.25, 0.45), 0.0, rng.uniform(0.05, 0.3))   # cartons torn open
    for _ in range(10): x = ox + rng.uniform(-0.6, 1.4); y = oy + rng.uniform(-0.2, 0.3); P.drum('jug', x, y, 0.0, 0.07, 0.035, 8)


def tent(P, ox, oy, rng):
    """a relief tent, 8 m by 6: its walls, its ridge, the flap rolled up and the dark inside, guy lines, the list by the door"""
    x0, x1, y0, y1, ze, zr = ox - 4.0, ox + 4.0, oy + 0.4, oy + 6.4, 2.2, TENT_H
    P.box('canvas', x0, x1, y0, y1, 0.0, ze)
    P.prism_x('canvas_r', x0 - 0.1, x1 + 0.1, [(y0 - 0.15, ze - 0.05), (y1 + 0.15, ze - 0.05), (y1 + 0.15, ze + 0.02), ((y0 + y1) / 2, zr + 0.02), (y0 - 0.15, ze + 0.02)])
    for k in range(1, 4): x = x0 + k * 2.0; P.prism_x('canvas', x - 0.03, x + 0.03, [(y0 - 0.16, ze + 0.02), (y1 + 0.16, ze + 0.02), ((y0 + y1) / 2, zr + 0.05)])   # the frame's seams on the roof
    P.box('under', ox - 0.8, ox + 0.8, y0 - 0.01, y0, 0.0, 1.95)                                          # the door: the flap rolled up, the dark inside
    P.tube_x('canvas_r', ox - 0.85, ox + 0.85, y0 - 0.08, 1.98, 0.08, 8)
    P.box('steel', ox - 0.5, ox + 0.3, y0 + 0.2, y0 + 0.9, 0.0, 0.42); P.box('tan', ox - 0.46, ox + 0.26, y0 + 0.24, y0 + 0.86, 0.42, 0.48)   # a cot, just inside
    for k in range(5): P.box('paper', ox + 1.0 + (k % 2) * 0.23, ox + 1.2 + (k % 2) * 0.23, y0 - 0.012, y0 - 0.01, 1.05 + (k // 2) * 0.28, 1.3 + (k // 2) * 0.28)   # the list by the door: names
    P.box('paint_k', x0 + 1.4, x0 + 2.6, (y0 + y1) / 2 - 1.4, (y0 + y1) / 2 - 0.4, zr - 0.35, zr - 0.33)   # its number, stencilled on the roof
    for (gx, gy, sx, sy) in ((x0, y0, -1, -1), (x1, y0, 1, -1), (x0, y1, -1, 1), (x1, y1, 1, 1), (ox - 2, y0, 0, -1), (ox + 2, y0, 0, -1)):   # guy lines and their stakes
        ex, ey = gx + sx * 1.0, gy + sy * 1.0; P.bar('tape', (gx, gy, ze - 0.05), (ex, ey, 0.0), 0.012); P.box('steel', ex - 0.03, ex + 0.03, ey - 0.03, ey + 0.03, 0.0, 0.18)
    for k in range(4): P.drum('jug', x0 + 0.5 + k * 0.32, y0 - 0.35, 0.0, 0.32, 0.12, 10)                 # the water jugs in a row by the wall
    P.box('stain', x0 + 0.1, x0 + 2.4, y0 - 0.006, y0, 0.0, 0.5)                                          # the mud splashed up its wall


def truck(P, ox, oy, rng):
    """a box truck driven in through the tunnel and stopped on the field, nose east: its roll-up door open and nothing in it"""
    y0, y1 = oy + 0.15, oy + 2.55; yc = (y0 + y1) / 2; xb0, xb1 = ox - 4.0, ox + 1.6
    for (wx, dual) in ((ox - 2.6, True), (ox + 2.9, False)):                                             # the wheels (the front one flat)
        for sy in (y0 + 0.1, y1 - 0.1):
            P.wheel('rubber', wx, sy, 0.48 if dual else 0.42, 0.5 if dual else 0.44, 0.34 if dual else 0.26, 16)
    P.box('steel', xb0 + 0.2, ox + 3.8, yc - 0.45, yc + 0.45, 0.5, 0.75)                                 # the frame
    P.box('paint_w', xb0, xb1, y0, y1, 0.85, TRUCK_H)                                                     # the box
    P.box('steel', xb0, xb1, y0 - 0.02, y1 + 0.02, TRUCK_H - 0.06, TRUCK_H + 0.02); P.box('steel', xb0, xb1, y0 - 0.02, y0, 0.85, 0.95)
    for k in range(1, 9): x = xb0 + k * 0.62; P.box('steel', x, x + 0.04, y0 - 0.012, y0, 0.95, TRUCK_H - 0.06)   # its posts
    P.box('teal', xb0 + 0.6, xb1 - 0.6, y0 - 0.016, y0 - 0.012, 1.9, 2.15)                                # a band where its name was, painted out
    P.box('under', xb0 - 0.01, xb0, y0 + 0.12, y1 - 0.12, 0.95, TRUCK_H - 0.15)                           # the roll-up door open: the box dark, empty
    P.box('steel', xb0 - 0.12, xb0, y0 + 0.1, y1 - 0.1, TRUCK_H - 0.32, TRUCK_H - 0.06)                    # the door, rolled up in its head
    P.box('steel', xb0 - 0.35, xb0, y0 + 0.2, y1 - 0.2, 0.75, 0.82)                                       # the step bumper
    P.box('cab', xb1, xb1 + 1.85, y0 + 0.05, y1 - 0.05, 0.9, 2.55); P.box('cab_t', xb1 + 0.05, xb1 + 1.6, y0 + 0.1, y1 - 0.1, 2.55, 2.6)   # the cab
    P.prism_y('glass_d', y0 + 0.12, y1 - 0.12, [(xb1 + 1.55, 1.75), (xb1 + 1.86, 1.75), (xb1 + 1.86, 1.8), (xb1 + 1.6, 2.5), (xb1 + 1.55, 2.5)])   # the windscreen
    P.box('glass_d', xb1 + 0.5, xb1 + 1.4, y0 + 0.04, y0 + 0.05, 1.55, 2.35)                               # the door's glass
    P.box('cab', xb1 + 1.85, xb1 + 2.45, y0 + 0.2, y1 - 0.2, 0.75, 1.55); P.box('chrome', xb1 + 2.42, xb1 + 2.5, y0 + 0.25, y1 - 0.25, 0.85, 1.4)   # the hood, its grille
    P.box('chrome', xb1 + 2.4, xb1 + 2.6, y0 + 0.05, y1 - 0.05, 0.5, 0.75)
    for _ in range(4): x = xb0 - rng.uniform(0.6, 2.2); y = yc + rng.uniform(-1.0, 1.0); P.box('card', x, x + 0.45, y, y + 0.35, 0.0, rng.uniform(0.03, 0.3))   # what fell out the back, flattened


def ambulance(P, ox, oy, rng):
    """an ambulance stopped on the turf, nose east: the box, the cab, the stripe and its dead light bar, the back doors open and
    the stretcher half out with its straps undone"""
    y0, y1 = oy + 0.15, oy + 2.45; yc = (y0 + y1) / 2; xb0, xb1 = ox - 3.3, ox + 0.7
    for wx in (ox - 2.2, ox + 2.0):
        for sy in (y0 + 0.08, y1 - 0.08): P.wheel('rubber', wx, sy, 0.4, 0.4, 0.26, 16)
    P.box('steel', xb0 + 0.3, ox + 2.9, yc - 0.42, yc + 0.42, 0.45, 0.7)
    P.box('paint_w', xb0, xb1, y0, y1, 0.75, AMB_H)                                                       # the box
    P.box('red', xb0, xb1, y0 - 0.012, y0, 1.15, 1.42)                                                   # the stripe down its side, faded (the roof stays white: the first render read a red roof)
    P.box('paint_k', xb0 + 1.2, xb0 + 2.4, y0 + 0.6, y1 - 0.6, AMB_H, AMB_H + 0.006)                       # its unit number on the roof, painted for the helicopters
    for k, m in enumerate(('red', 'white', 'red', 'white', 'red')): P.box(m, xb1 - 0.3, xb1 - 0.05, y0 + 0.2 + k * 0.42, y0 + 0.55 + k * 0.42, AMB_H, AMB_H + 0.14)   # the light bar, dead
    P.box('under', xb0 - 0.01, xb0, y0 + 0.15, y1 - 0.15, 0.85, AMB_H - 0.15)                             # the back open, dark
    P.box('paint_w', xb0 - 1.0, xb0, y0 - 0.02, y0 + 0.04, 0.85, AMB_H - 0.2); P.box('paint_w', xb0 - 1.0, xb0, y1 - 0.04, y1 + 0.02, 0.85, AMB_H - 0.2)   # its two doors, swung out
    P.box('glass_d', xb0 - 0.8, xb0 - 0.2, y0 - 0.03, y0 - 0.02, 1.9, 2.5)
    P.box('chrome', xb0 - 1.6, xb0 + 1.0, yc - 0.3, yc + 0.3, 0.7, 0.76)                                   # the stretcher, half out: its frame, its mattress, its straps hanging
    P.box('white', xb0 - 1.55, xb0 + 0.95, yc - 0.28, yc + 0.28, 0.76, 0.86)
    for dx in (-1.2, -0.5): P.box('black', xb0 + dx, xb0 + dx + 0.06, yc - 0.32, yc - 0.28, 0.35, 0.86); P.box('black', xb0 + dx, xb0 + dx + 0.06, yc + 0.28, yc + 0.32, 0.4, 0.86)
    P.bar('chrome', (xb0 - 1.5, yc - 0.25, 0.7), (xb0 - 1.5, yc - 0.25, 0.0), 0.02); P.bar('chrome', (xb0 - 1.5, yc + 0.25, 0.7), (xb0 - 1.5, yc + 0.25, 0.0), 0.02)   # its legs, down on the turf
    P.box('paint_w', xb1, xb1 + 1.9, y0 + 0.08, y1 - 0.08, 0.7, 2.3); P.box('cab_t', xb1, xb1 + 1.5, y0 + 0.12, y1 - 0.12, 2.3, 2.34)   # the cab
    P.prism_y('glass_d', y0 + 0.14, y1 - 0.14, [(xb1 + 1.4, 1.5), (xb1 + 1.95, 1.5), (xb1 + 1.95, 1.55), (xb1 + 1.5, 2.28), (xb1 + 1.4, 2.28)])
    P.box('glass_d', xb1 + 0.3, xb1 + 1.2, y0 + 0.07, y0 + 0.08, 1.45, 2.15)
    P.box('paint_w', xb1 + 1.9, xb1 + 2.55, y0 + 0.2, y1 - 0.2, 0.6, 1.3); P.box('chrome', xb1 + 2.5, xb1 + 2.62, y0 + 0.15, y1 - 0.15, 0.4, 0.62)
    P.box('red', xb1 + 0.1, xb1 + 1.9, y0 + 0.068, y0 + 0.08, 1.1, 1.3)


def rig(P, ox, oy, rng):
    """the last show's rig, a tile wide: the subs and the hung boxes on a ground stack, a truss tower, the sound desk on its riser,
    the road cases, the snake"""
    for side in (-1,):                                          # the ground stack, west: three subs high, two wide, four boxes on top
        x0 = ox - 5.6
        for a in range(2):
            for b in range(3):
                x = x0 + a * 1.25; P.box('cab', x, x + 1.2, oy + 0.3, oy + 1.2, b * 0.66, b * 0.66 + 0.64); P.box('under', x + 0.08, x + 1.12, oy + 0.294, oy + 0.3, b * 0.66 + 0.08, b * 0.66 + 0.56)
        for b in range(4):
            z = 2.0 + b * 0.38; P.box('cab', x0 + 0.1 + b * 0.04, x0 + 2.4 - b * 0.04, oy + 0.38 + b * 0.06, oy + 1.1, z, z + 0.36); P.box('under', x0 + 0.15 + b * 0.04, x0 + 2.35 - b * 0.04, oy + 0.374 + b * 0.06, oy + 0.38 + b * 0.06, z + 0.05, z + 0.3)
        P.box('steel', x0, x0 + 2.5, oy + 0.3, oy + 1.2, 1.98, 2.0)
    tx, tyy = ox - 1.6, oy + 2.0                                 # the truss tower: four chords and their lacing, a dead head on top, the banner
    for (dx, dy) in ((0, 0), (0.3, 0), (0, 0.3), (0.3, 0.3)): P.bar('chrome', (tx + dx, tyy + dy, 0.0), (tx + dx, tyy + dy, RIG_H), 0.025)
    for k in range(10):
        z = k * RIG_H / 10; P.bar('chrome', (tx, tyy, z), (tx + 0.3, tyy, z + RIG_H / 10), 0.012); P.bar('chrome', (tx, tyy + 0.3, z + RIG_H / 10), (tx + 0.3, tyy + 0.3, z), 0.012)
    P.box('steel', tx - 0.3, tx + 0.6, tyy - 0.3, tyy + 0.6, 0.0, 0.05); P.box('cab', tx - 0.1, tx + 0.4, tyy - 0.1, tyy + 0.4, RIG_H, RIG_H + 0.4)
    P.box('rug', tx + 0.32, tx + 1.4, tyy - 0.02, tyy + 0.02, 2.2, RIG_H - 0.2); P.box('rug', tx + 0.32, tx + 0.9, tyy - 0.02, tyy + 0.02, 1.6, 2.2)   # the tour's banner, torn
    rx0, rx1, ry0, ry1, rz = ox + 0.6, ox + 5.4, oy + 0.5, oy + 3.5, 0.42                               # the sound desk on its riser
    P.box('wood_d', rx0, rx1, ry0, ry1, 0.0, rz); P.box('steel', rx0, rx1, ry0 - 0.02, ry0, 0.0, rz)
    for (dx, dy) in ((0.2, 0.9), (2.4, 0.9), (0.2, 1.7), (2.4, 1.7)): P.box('steel', rx0 + dx, rx0 + dx + 0.06, ry0 + dy, ry0 + dy + 0.06, rz, rz + 0.75)
    P.box('cab', rx0 + 0.1, rx0 + 2.6, ry0 + 0.8, ry0 + 1.85, rz + 0.75, rz + 0.86)                          # the console
    for k in range(24): x = rx0 + 0.2 + k * 0.1; P.box('tape', x, x + 0.03, ry0 + 0.95, ry0 + 1.4, rz + 0.86, rz + 0.88)   # its faders, where they were left
    P.box('paper', rx0 + 1.6, rx0 + 1.9, ry0 + 1.5, ry0 + 1.8, rz + 0.86, rz + 0.87)                          # the set list taped to it
    P.box('cab', rx0 + 3.0, rx0 + 3.6, ry0 + 1.9, ry0 + 2.5, rz, rz + 1.4); P.box('glass_d', rx0 + 3.05, rx0 + 3.55, ry0 + 1.894, ry0 + 1.9, rz + 0.2, rz + 1.3)   # the amp rack
    P.box('steel', rx0 + 3.2, rx0 + 3.8, ry0 + 0.4, ry0 + 0.9, rz, rz + 0.04); P.bar('steel', (rx0 + 3.3, ry0 + 0.65, rz), (rx0 + 3.3, ry0 + 0.65, rz + 0.45), 0.015)   # a camp chair, folded down
    for k, (x, y, w_, d, h) in enumerate(((ox + 0.2, oy - 0.2, 1.2, 0.6, 0.7), (ox + 0.2, oy - 0.2, 1.2, 0.6, 0.7), (ox - 1.0, oy - 0.3, 0.8, 0.6, 0.6))):   # the road cases
        z = 0.0 if k != 1 else 0.7
        P.box('cab', x, x + w_, y, y + d, z, z + h)
        for cx_ in (x, x + w_ - 0.06): P.box('chrome', cx_, cx_ + 0.06, y - 0.004, y + d, z, z + h)
    pts = [(ox - 4.6, oy + 1.25), (ox - 3.0, oy + 2.4), (ox - 1.0, oy + 2.8), (ox + 0.8, oy + 2.0)]       # the snake, from the stack to the desk
    for (p0, p1) in zip(pts[:-1], pts[1:]): P.bar('black', (p0[0], p0[1], 0.04), (p1[0], p1[1], 0.04), 0.04)
    for _ in range(14): x = ox + rng.uniform(-5.5, 5.5); y = oy + rng.uniform(-0.6, 4.6); P.drum(('jug', 'paper', 'red')[rng.randint(3)], x, y, 0.0, 0.1, 0.045, 8)   # cups, and the wristbands


def bench(P, ox, oy, rng):
    """a team's bench on the sideline: two long benches, the helmets still in a row on them, the cooler, the heater"""
    for b in range(2):
        x0 = ox - 5.0 + b * 5.2
        P.box('chrome', x0, x0 + 4.6, oy + 0.4, oy + 0.75, 0.42, 0.47); P.box('chrome', x0, x0 + 4.6, oy + 0.78, oy + 0.84, 0.5, 0.9)
        for x in (x0 + 0.2, x0 + 2.2, x0 + 4.3): P.box('steel', x, x + 0.08, oy + 0.4, oy + 0.84, 0.0, 0.42)
    for k in range(9):                                          # the helmets, set down in a row, every face mask the same way
        if k in (3, 7): continue
        x = ox - 4.6 + k * 1.1; P.drum('helm', x, oy + 0.58, 0.47, 0.72, 0.13, 12, 0.09)
        P.box('steel', x - 0.1, x + 0.1, oy + 0.43, oy + 0.46, 0.5, 0.64)
    P.box('white', ox - 1.0, ox - 0.4, oy + 0.42, oy + 0.72, 0.47, 0.5)                                    # a towel
    P.drum('must', ox + 4.9, oy + 0.6, 0.0, 0.7, 0.3, 14); P.drum('white', ox + 4.9, oy + 0.6, 0.7, 0.76, 0.31, 14)   # the cooler on its stand
    P.box('steel', ox - 6.0, ox - 5.4, oy + 0.3, oy + 0.9, 0.0, 1.2); P.box('red', ox - 5.98, ox - 5.42, oy + 0.294, oy + 0.3, 0.8, 1.0)   # the heater, cold
    for _ in range(10): x = ox + rng.uniform(-5.5, 5.5); y = oy + rng.uniform(-0.6, 0.2); P.drum(('paper', 'jug')[rng.randint(2)], x, y, 0.0, 0.1, 0.045, 8)


def barrier_one(P, x, y, down=False):
    """a steel crowd barrier, 2.3 m: its frame, its bars, its two feet"""
    if down:
        P.box('steel', x, x + 2.3, y - 1.0, y + 0.05, 0.0, 0.04)
        for k in range(12): P.box('steel', x + 0.1 + k * 0.18, x + 0.13 + k * 0.18, y - 0.95, y, 0.04, 0.06)
        return
    for xx in (x, x + 2.26): P.bar('steel', (xx, y, 0.06), (xx, y, RAIL_H), 0.022); P.box('steel', xx - 0.04, xx + 0.08, y - 0.3, y + 0.3, 0.0, 0.05)
    for z in (0.14, RAIL_H): P.bar('steel', (x, y, z), (x + 2.3, y, z), 0.02)
    for k in range(13): xx = x + 0.12 + k * 0.17; P.bar('steel', (xx, y, 0.14), (xx, y, RAIL_H), 0.008)


def barrier(P, ox, oy, rng):
    """crowd barriers along the tile, one knocked down, a sign zip-tied to one"""
    for k in range(4): barrier_one(P, ox - 4.8 + k * 2.42, oy + 0.35, down=(k == 2))
    P.box('card', ox - 2.2, ox - 1.5, oy + 0.31, oy + 0.33, 0.45, 0.95); P.box('paint_k', ox - 2.1, ox - 1.6, oy + 0.305, oy + 0.31, 0.55, 0.85)
    for _ in range(6): x = ox + rng.uniform(-5, 5); y = oy + rng.uniform(-0.5, 0.0); P.drum(('paper', 'jug')[rng.randint(2)], x, y, 0.0, 0.1, 0.045, 8)


def st_parts(P, rng):
    A = ST_AT
    stand(P, *A['stand'], rng); HT.stair(P, *A['stair_e'], 1); HT.stair(P, *A['stair_w'], -1)
    wall_ns(P, *A['wall_ns'], rng); wall_ew(P, *A['wall_ew'], rng); rail(P, *A['rail_ew'], rng); seats(P, *A['seats'], rng)
    rig(P, *A['rig'], rng); tent(P, *A['tent'], rng); truck(P, *A['wreck_a'], rng)
    bench(P, *A['bench'], rng); barrier(P, *A['barrier'], rng); ambulance(P, *A['wreck_b'], rng); supplies(P, *A['supplies'], rng)
    supplies_b(P, *A['supplies_b'], rng)


def st_mats(bpy, NF, F, M, which):
    if which not in ('st_pieces', 'tun_pieces'): return         # ('tun_pieces' is what the ceiling's scene asks its materials by)
    if which == 'st_pieces': TM.tm_mats(bpy, NF, F, M, 'tm_pieces')            # the terminal's, the fort's, the warehouse's and the mall's own
    M.update(seat=NF.material(bpy, 'in_seat_black', 'rubber', 1, 0.95), seat_g=NF.material(bpy, 'in_seat_grey', 'tape_grey', 2, 0.85),
             st_tread=NF.material(bpy, 'in_stall_tread', 'tape_grey', 3, 0.92), pad=NF.material(bpy, 'in_pad_vinyl', 'clay_teal', 0, 0.85),
             ribbon=NF.material(bpy, 'in_ribbon_dead', 'rubber', 0, 1.0), paint_k=NF.material(bpy, 'in_paint_black', 'rubber', 1, 0.9),
             canvas=NF.material(bpy, 'in_tarp_canvas', 'tape_masking', 3, 0.92), canvas_r=NF.material(bpy, 'in_tarp_canvas_roof', 'tape_masking', 2, 0.88),
             wrap=NF.material(bpy, 'in_wrap', 'tape_grey', 4, 0.75), helm=NF.material(bpy, 'in_paint_helmet', 'tape_grey', 1, 1.0),
             truss=NF.material(bpy, 'in_ceil_truss', 'tape_grey', 1, 0.6), etfe=NF.material(bpy, 'in_ceil_etfe', 'clay_bone', 4, 1.0),
             etfe_d=NF.material(bpy, 'in_ceil_etfe_dirty', 'tape_masking', 3, 0.85), cable=NF.material(bpy, 'in_ceil_cable', 'rubber', 1, 0.9))


TG.PARTS['st_pieces'] = st_parts
TG.MAT_HOOKS.append(st_mats)


# ---- the ceiling (rule 451(a)): ONE PICTURE THE SIZE OF THE BOARD --------------------------------------------------------------
BOARD = (20, 15)                                                # the stadium's board, both layouts (COMBAT THREE's data): one picture covers it
CT = SIDE / BOARD[0]                                            # a fight tile in the ceiling's scene: 3 m (so the picture is the board, never repeated)


def bat(bx, by, z=0.0):
    """where a thing z proud of the roof must stand to SHOW at board tile (bx, by) (fractions allowed; by from the north)"""
    return bx * CT, SIDE - by * CT - TG.LEAN * z


def ceil_stadium(P, rng):
    """the translucent roof's panels on a net of cables running out from the ring, the ring over midfield with its panes out, the
    light banks round the rim (every head dead), the catwalks, the dead scoreboard over the west end zone"""
    cx, cy = BOARD[0] / 2.0, BOARD[1] / 2.0
    P.box('etfe', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                    # the panels, pale (the day through them)
    rx, ry = 4.2, 3.0                                                                                   # the ring, in tiles
    # the panels' own dirt: what years of dust and birds did, darker toward the rim
    for _ in range(260):
        bx, by = rng.uniform(-0.5, BOARD[0] + 0.5), rng.uniform(-0.5, BOARD[1] + 0.5); e = ((bx - cx) / (BOARD[0] / 2)) ** 2 + ((by - cy) / (BOARD[1] / 2)) ** 2
        if e < 0.55 or rng.rand() > min(1.0, e * 0.8): continue
        x, y = bat(bx, by, 0.01); r_ = rng.uniform(0.6, 1.8) * CT * 0.4
        P.drum('etfe_d', x, y, 0.0, 0.01 + 0.002 * rng.rand(), r_, 10)
    # the rim: the roof goes solid over the stands (north and south rows and the end walls)
    # (the ends stop at the long sides' rims and stand a hair higher: two faces at one height render black, and the first
    #  render's four corners came out black)
    for (x0, x1, y0, y1, h) in ((-0.5, BOARD[0] + 0.5, -0.5, 1.6, 0.05), (-0.5, BOARD[0] + 0.5, BOARD[1] - 1.6, BOARD[1] + 0.5, 0.05), (-0.5, 1.4, 1.6, BOARD[1] - 1.6, 0.056), (BOARD[0] - 1.4, BOARD[0] + 0.5, 1.6, BOARD[1] - 1.6, 0.056)):
        xa, ya = bat(x0, y1, h); xb, yb = bat(x1, y0, h); P.box('truss', xa, xb, ya, yb, 0.0, h)
    # the radial cables, from the ring out to the rim; and the rings of cable round it
    for k in range(28):
        a = k * 2 * math.pi / 28; ca, sa = math.cos(a), math.sin(a)
        p0 = (cx + rx * ca, cy + ry * sa); t = min(abs((BOARD[0] / 2 + 0.6) / ca) if abs(ca) > 1e-6 else 99, abs((BOARD[1] / 2 + 0.6) / sa) if abs(sa) > 1e-6 else 99)
        p1 = (cx + t * ca, cy + t * sa); n = 24
        for i in range(n):
            q0 = (p0[0] + (p1[0] - p0[0]) * i / n, p0[1] + (p1[1] - p0[1]) * i / n); q1 = (p0[0] + (p1[0] - p0[0]) * (i + 1) / n, p0[1] + (p1[1] - p0[1]) * (i + 1) / n)
            a0, a1 = bat(q0[0], q0[1], 0.12), bat(q1[0], q1[1], 0.12); P.bar('cable', (a0[0], a0[1], 0.08), (a1[0], a1[1], 0.08), 0.07)
    for s_ in (1.35, 1.75, 2.2, 2.75):
        n = 80
        for i in range(n):
            a0, a1 = i * 2 * math.pi / n, (i + 1) * 2 * math.pi / n
            q0 = (cx + rx * s_ * math.cos(a0), cy + ry * s_ * math.sin(a0)); q1 = (cx + rx * s_ * math.cos(a1), cy + ry * s_ * math.sin(a1))
            if not (-0.4 < q0[0] < BOARD[0] + 0.4 and -0.4 < q0[1] < BOARD[1] + 0.4): continue
            b0, b1 = bat(q0[0], q0[1], 0.1), bat(q1[0], q1[1], 0.1); P.bar('cable', (b0[0], b0[1], 0.05), (b1[0], b1[1], 0.05), 0.05)
    # some panels gone: holes in the skin (the day through them, brighter still: drawn as the white of the sky)
    for _ in range(40):
        a = rng.uniform(0, 2 * math.pi); s_ = rng.uniform(1.05, 2.9)
        bx, by = cx + rx * s_ * math.cos(a), cy + ry * s_ * math.sin(a)
        if not (0.5 < bx < BOARD[0] - 0.5 and 0.5 < by < BOARD[1] - 0.5): continue
        x, y = bat(bx, by, 0.02); w_ = rng.uniform(0.25, 0.5) * CT
        P.box('white', x - w_ / 2, x + w_ / 2, y - w_ * 0.35, y + w_ * 0.35, 0.015, 0.02)
    # THE RING over midfield: the steel ring, its glazing bars, most panes out (white: the sky), the rest grey with dirt
    n = 96
    for i in range(n):
        a0, a1 = i * 2 * math.pi / n, (i + 1) * 2 * math.pi / n
        for (s_, w_) in ((1.0, 0.16), (0.94, 0.08)):
            q0 = (cx + rx * s_ * math.cos(a0), cy + ry * s_ * math.sin(a0)); q1 = (cx + rx * s_ * math.cos(a1), cy + ry * s_ * math.sin(a1))
            b0, b1 = bat(q0[0], q0[1], 0.3), bat(q1[0], q1[1], 0.3); P.bar('truss', (b0[0], b0[1], 0.25), (b1[0], b1[1], 0.25), w_ * CT * 0.5)
    for i in range(-int(rx) - 1, int(rx) + 2):                                                          # its glazing grid
        for j in range(-int(ry) - 1, int(ry) + 2):
            bx, by = cx + i * 0.95, cy + j * 0.95
            if ((bx - cx) / rx) ** 2 + ((by - cy) / ry) ** 2 > 0.82: continue
            x, y = bat(bx, by, 0.04)
            if rng.rand() < 0.62: P.box('white', x - 0.42 * CT, x + 0.42 * CT, y - 0.42 * CT, y + 0.42 * CT, 0.03, 0.035)   # a pane out: the sky
            else: P.box('etfe_d', x - 0.42 * CT, x + 0.42 * CT, y - 0.42 * CT, y + 0.42 * CT, 0.03, 0.035)
    for i in range(-int(rx), int(rx) + 2):                                                              # its glazing bars, each cut to the ring's own chord
        bx = cx + (i - 0.5) * 0.95; u = (bx - cx) / (rx * 0.95)
        if abs(u) >= 1: continue
        hh = ry * 0.95 * math.sqrt(1 - u * u); ya_, yb_ = bat(bx, cy - hh, 0.08)[1], bat(bx, cy + hh, 0.08)[1]; x = bat(bx, 0)[0]
        P.box('truss', x - 0.06, x + 0.06, yb_, ya_, 0.06, 0.08)
    for j in range(-int(ry), int(ry) + 2):
        by = cy + (j - 0.5) * 0.95; v = (by - cy) / (ry * 0.95)
        if abs(v) >= 1: continue
        hw = rx * 0.95 * math.sqrt(1 - v * v); xa_, xb_ = bat(cx - hw, by, 0.08)[0], bat(cx + hw, by, 0.08)[0]; y = bat(0, by, 0.08)[1]
        P.box('truss', xa_, xb_, y - 0.06, y + 0.06, 0.065, 0.085)
    # the light banks round the rim, every head dead; a catwalk along each long side
    for side in (1.15, BOARD[1] - 1.15):
        x0, y = bat(1.6, side, 0.5); x1, _ = bat(BOARD[0] - 1.6, side, 0.5)
        P.box('truss', x0, x1, y - 0.25, y + 0.25, 0.3, 0.5)
        for k in range(30):
            bx = 2.0 + k * (BOARD[0] - 4.0) / 29; x, yy = bat(bx, side + (0.35 if side < 5 else -0.35), 0.6)
            P.box('cab', x - 0.5, x + 0.5, yy - 0.35, yy + 0.35, 0.35, 0.6); P.box('glass_d', x - 0.4, x + 0.4, yy - 0.3, yy + 0.3, 0.6, 0.62)
    for side in (2.0, BOARD[1] - 2.0):                                                                  # the catwalks
        x0, y = bat(1.5, side, 0.3); x1, _ = bat(BOARD[0] - 1.5, side, 0.3)
        P.box('steel', x0, x1, y - 0.35, y + 0.35, 0.28, 0.3)
        for k in range(60): x = x0 + (x1 - x0) * k / 59; P.box('truss', x - 0.03, x + 0.03, y - 0.38, y + 0.38, 0.3, 0.32)
    # the dead scoreboard over the west end zone, its frame and the catwalk to it
    x0, y0 = bat(1.0, cy + 2.4, 0.9); x1, y1 = bat(3.2, cy - 2.4, 0.9)
    P.box('truss', x0 - 0.4, x1 + 0.4, y0 - 0.4, y1 + 0.4, 0.6, 0.8); P.box('ribbon', x0, x1, y0, y1, 0.8, 0.95)
    for k in range(4): P.box('tape', x0 + 0.6 + k * 1.3, x0 + 1.4 + k * 1.3, y0 + 2.0, y0 + 2.6, 0.95, 0.96)   # its dead modules
    xa, ya = bat(3.2, cy, 0.4); xb, yb = bat(cx - rx, cy, 0.4); P.box('steel', xa, xb, ya - 0.3, ya + 0.3, 0.3, 0.4)


TG.CEILINGS['stadium'] = (ceil_stadium, 'stadium/stadium_ceiling.webp', "the translucent roof's panels on a net of cables running out from the ring over midfield (its glazing grid, most panes out), panels gone here and there, the rim solid over the stands, the light banks round it with every head dead, the catwalks, the dead scoreboard over the west end zone: one picture the size of the board")
TG.CEIL_DATA['stadium'] = 'stadium/stadium.json'
CEIL_SHIP = (1290, 685)                                         # the picture as it ships: 20 tiles of 64.5 by 15 of 45.7 (the other ceilings' own density)


# ---- the cut (no Blender) ----------------------------------------------------------------------------------------------------
KIND = dict(stand='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', rail_ew='RAIL', wall_ew='WALL', wall_ns='WALL', seats='LOW_COVER', supplies='COVER',
            supplies_b='DRESS', tent='COVER', wreck_a='COVER', wreck_b='COVER', rig='COVER', barrier='LOW_COVER', bench='LOW_COVER')
HM = dict(stand=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, rail_ew=RAIL_H, wall_ew=WALL_H, wall_ns=WALL_H, seats=0.86, supplies=1.42, supplies_b=0.8,
          tent=TENT_H, wreck_a=TRUCK_H, wreck_b=AMB_H, rig=RIG_H, barrier=RAIL_H, bench=1.2)
NAME = dict(stand='THE STANDS', stair_e='ITS STAIRS, EAST', stair_w='ITS STAIRS, WEST', rail_ew="THE STANDS' RAIL", wall_ew="THE BOWL'S WALL", wall_ns="THE BOWL'S WALL",
            seats="THE STANDS' SEATS", supplies='SUPPLIES ON PALLETS', supplies_b='SUPPLIES, TORN OPEN', tent='A RELIEF TENT', wreck_a='A TRUCK ON THE FIELD',
            wreck_b='AN AMBULANCE ON THE FIELD', rig="THE SHOW'S RIG", barrier='CROWD BARRIERS', bench='THE BENCH')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'st_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'stadium_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'st_pieces.png')).convert('RGBA'); A = ST_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'st_' + key, 'stadium', shadow)
    for key in ('stand', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 12.0 + hh + (1.7 if key != 'stand' else 0.6)), 1.0 if key == 'stand' else 0.0)
        v = sz[key]                                            # the canvas runs down to its foot (the gate's A4)
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'st_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1])), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 0.4 + RAIL_H * 1.45 + 0.2), 0.4)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.45, y + 0.4 + WALL_H * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + WALL_H * 1.45), 0.5)
    x, y = A['seats']; one('seats', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 9.4 + 0.95 * 1.45), 1.0)
    x, y = A['rig']; one('rig', (x - 6.2, x + 6.2, y - 0.8, y + 4.8 + (RIG_H + 0.4) * 1.45), 1.0)
    x, y = A['tent']; one('tent', (x - 5.3, x + 5.3, y - 0.8, y + 7.6 + TENT_H * 1.45), 1.0)
    x, y = A['wreck_a']; one('wreck_a', (x - 6.4, x + 4.4, y - 0.4, y + 3.6 + TRUCK_H * 1.45), 1.0)
    x, y = A['wreck_b']; one('wreck_b', (x - 5.2, x + 3.6, y - 0.4, y + 3.4 + AMB_H * 1.45), 1.0)
    x, y = A['bench']; one('bench', (x - 6.2, x + 5.5, y - 0.8, y + 1.3 + 1.3 * 1.45), 1.0)
    x, y = A['barrier']; one('barrier', (x - 5.2, x + 5.2, y - 1.1, y + 0.8 + RAIL_H * 1.45), 0.6)
    x, y = A['supplies']; one('supplies', (x - 2.6, x + 2.6, y - 1.0, y + 2.6 + 1.5 * 1.45), 1.0)
    x, y = A['supplies_b']; one('supplies_b', (x - 1.8, x + 1.8, y - 0.6, y + 1.8 + 0.9 * 1.45), 1.0)
    for k, v in sz.items(): v.update(piece=k, src='stadium/st_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['stadium/stadium_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'st_' + k: ent(k) for k in sz}
    art = {
        'version': 'cook6-stadium-art-11-20', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
        'for': "COMBAT THREE's stadium (slices/fight_ground/stadium/stadium.json, BUILD 11/18m): the names its handoff asked for, the garage's format. floor.floor is the dead turf (rows 0 to 2 of the sheet: straw gone grey, never green, a yard line down every tile's middle so one tile is five yards, the yard's ticks in a row on two tiles, bleached and bare patches, the trucks' tyre marks, two rings of soot); floor.mud is the turf torn to the dirt where the trucks turned (row 3: a turf margin on every edge, so it meets the field and itself); floor.high a stand's concrete step (row 4, under the stand's own picture); floor.ring the turf. Any tile of a list meets any tile of it.",
        'floor': {'floor': cells(TURF_ROWS), 'mud': cells((TORN_ROW,)), 'high': cells((STEP_ROW,)), 'ring': cells(TURF_ROWS)},
        'kit': kit,
        'how_it_lays': {
            'the stands': "st_stand on every high tile, foot at the tile's south edge middle; 1.42 m up; concrete treads every 12/14 m (the same on every tile's edge, so stand tiles meet), the brackets of torn-out seats on them, the dead ribbon board and the padding along its south face. st_seats on it (your 'at' [0.5, 0.82], lifted): eleven rows of 23 seats, 9.4 m deep, a tile wide, foot its south base middle. st_stair_e climbs to the east, st_stair_w to the west (the hall's concrete stair). st_rail_ew along the field edge: steel, a bedsheet with words on it, foot its base middle.",
            'the field': "st_supplies is six pallets 4.4 m by 2.6 m, foot its south edge middle; st_supplies_b two pallets torn open, 2.6 m wide. st_tent 8 m by 6, 3.4 m to its ridge, foot its south edge middle (your 'at' [0.5, 0.95] puts it inside the tile). st_wreck_a a box truck 8.6 m long nose east, st_wreck_b an ambulance 7.6 m with its stretcher half out to the west: foot each its south side's middle. st_rig 12 m wide, 5 m to the truss's head. st_barrier four barriers along 10 m, one down. st_bench two benches 10 m with the helmets, the heater at the west end, the cooler at the east.",
            'the bowl': "st_wall_ew / st_wall_ns: concrete to 2.2 m, the padding to 1.25 (one panel torn to the foam), the ribbon board dead above it, names chalked on the pad; a tile long.",
        },
        'bytes': bytes_,
    }
    TG.keep_ceiling(art, os.path.join(SHIP, 'stadium_art.json'))
    cp = os.path.join(REND, 'ceil_stadium.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        h15 = int(round(im.height * BOARD[1] / BOARD[0]))                               # the board's fifteen rows of the scene's twenty (3 m a tile both ways)
        fn = os.path.join(SHIP, 'stadium_ceiling.webp'); bg.convert('RGB').crop((0, 0, im.width, h15)).resize(CEIL_SHIP, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'stadium/stadium.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "stadium/stadium_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == list(BOARD)):          # (the one agreed edit in COMBAT THREE's file: its ceiling entry's "have" and "tile")
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % BOARD, e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='stadium/stadium_ceiling.webp', bays=[5, 5], bay_px=[CEIL_SHIP[0] // 5, CEIL_SHIP[1] // 5], covers=list(BOARD), whole=True, what=TG.CEILINGS['stadium'][2],
                              contract="stadium.json 'ceiling' (COMBAT THREE's: the fight draws it over the board at that alpha, rule 451(a)); 'tile' [20, 15] is the board: ONE picture, never repeated (COMBAT THREE's own offer)")
    json.dump(art, open(os.path.join(SHIP, 'stadium_art.json'), 'w'), indent=1)
    print('stadium: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


def plan_png():
    """the floor's plan as a picture (no Blender): what each pixel is and how dark and pale, for a look before the render"""
    ID = TG.ids(); gid, dark, pale = plan_st_floor(ID)
    col = {ID['st_turf']: (141, 130, 98), ID['st_line']: (176, 171, 156), ID['st_dirt']: (118, 103, 80), ID['st_step']: (146, 143, 136)}
    a = np.zeros((H, W, 3), np.float32)
    for k, c in col.items(): a[gid == k] = c
    a = a * (1 - dark[..., None] * 0.7) + (255 - a) * pale[..., None] * 0.35
    fn = os.path.join(TG.OUT, 'st_floor_plan.png'); os.makedirs(TG.OUT, exist_ok=True); Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(fn); print(fn)


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_STADIUM_11_20.webp: what the VOTE card shows. The phone shots are the game's own fight page
    (tools/bohemia_a_big_inside_on_the_page_11_17_26.js): the same fight before (every piece a stand-in) and now, the ceiling at
    his 10%; then close in on the page; then the pieces at their own pixels, a tile of the floor, and the ceiling at full strength."""
    from PIL import ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items:
            n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    title('THE STADIUM, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the roof at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'stadium_upright_open_a0.png'))), ('NOW, THE ROOF OFF', up(os.path.join(page_dir, 'stadium_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE ROOF AT 10%', up(os.path.join(page_dir, 'stadium_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the stand they hold, the rig and the tents, the bench and the truck')
    strip([(lab, up(os.path.join(page_dir, 'stadium_upright_%s.png' % n))) for lab, n in (('THE STAND', 'stand_close'), ('THE RIG, THE TENTS', 'tents_close'), ('THE BENCH', 'bench_close'))], cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the stand and its seats, the rig, the tent, the truck and the ambulance, the bench, the barriers, the pallets, the rail, the wall')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'st_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('stand', 'seats'), 330); row_of(('rig', 'tent'), 300); row_of(('wreck_a', 'wreck_b'), 200); row_of(('bench', 'barrier'), 120); row_of(('supplies', 'supplies_b', 'rail_ew', 'wall_ew'), 150)
    title('TWO TILES OF THE TURF, ONE TORN, AND THE ROOF AT FULL STRENGTH', 'dead straw with the yard line and the ticks; the trucks\' ruts; the cable net, the ring with its panes out, the dead lights')
    fl = Image.open(os.path.join(SHIP, 'stadium_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'stadium_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW * 3, 0, TW * 4, TH)); t2 = fl.crop((TW, TH * 3, TW * 2, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_STADIUM_11_20.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-stadium-11-20.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        quick = '--quick' in a
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, quick) if n == 'st_floor' else TG.scene_pieces(n, quick) if n == 'st_pieces' else TG.scene_ceiling('stadium', quick)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cal': TG.scene_cal(True); TG.calibrate()
    elif a and a[0] == 'plan': plan_png()
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
