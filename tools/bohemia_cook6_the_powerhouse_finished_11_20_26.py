#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the dam's powerhouse, finished] (11/20/26; COMBAT FOUR's BUILD 11/20j asked 'FOR COOK (FIVE or SIX)';
VAMILY rules 461, 453, 441, 416, 451(a), 455).

COMBAT FOUR's tenth inside (THE POWERHOUSE, slices/fight_ground/powerhouse/powerhouse.json, laid by slices/bohemia_big_inside.js): a
fight in the dam's generator hall, a row of generators you cannot stand on with their boards beside them, the lanes either side, the
visitors' balcony a storey up. All 22 of its pieces were stand-ins. These are the pictures under its names, through the master rig, ON
this lane's stadium tool (and COOK FIVE's terminal, data fort, warehouse, mall, hall and tunnels-and-garage tools under it):

  THE FLOOR        powerhouse_floor_0.webp, five tiles by five. Rows 0 to 2: THE TERRAZZO, cream, Allen Tupper True's Southwest
                   patterns laid in it (a stepped diamond, a band of zigzag, a ring of chevrons, in rust and black, one in a tile's
                   middle, never on its edge), the dust on it. Row 3: THE SAME FLOOR WET where the dam weeps (dark water, the white
                   crust of lime where it dried). Row 4: the balcony's floor (under its own picture).
  THE PIECES       (powerhouse_art.json's kit, COMBAT FOUR's names)
    pw_unit        A GENERATOR in its housing, a tile: the round steel housing two storeys up, its unit number, the exciter on
                   top, the rail round it, a ladder up its side
    pw_board       the unit's control board beside it, a tile wide: cabinets of dead dials, the desk, a chair
    pw_rotor       a rotor lifted out, set on its cribbing: the pole pieces round it
    pw_hook        the crane's hook block let down to the floor, its cable slack in coils
    pw_spares / _b crated spares, stencilled; pw_cable / _b cable reels on their sides and the cable run off them
    pw_cart / _b   tool carts, a parts trolley; pw_camp_a / _b (pw_bedding_a / _b the same two pictures) somebody living by a unit
    pw_column      a square column, its bronze band
    pw_balcony     one tile of the visitors' balcony (its floor, its fascia with the bronze band); pw_bench its benches;
                   pw_stair_e / _w; pw_rail_ew its bronze rail; pw_wall_ew / _ns the hall's concrete, its panels and band
  THE CEILING      powerhouse_ceiling.webp (rule 451(a), over the fight at 10%): ONE PICTURE THE SIZE OF THE BOARD (20 by 15, as the
                   stadium's: the runways are on the long walls, so it cannot repeat): the hall's roof far up and its beams, the crane
                   runways along both long walls, two bridge cranes across the hall with their trolleys and hooks, the hanging lamps,
                   one of forty still on.

  <venv>/bin/python tools/bohemia_cook6_the_powerhouse_finished_11_20_26.py cal
  <venv>/bin/python tools/bohemia_cook6_the_powerhouse_finished_11_20_26.py render pw_floor | pw_pieces | ceil_powerhouse
  python3 tools/bohemia_cook6_the_powerhouse_finished_11_20_26.py cut
  python3 tools/bohemia_cook6_the_powerhouse_finished_11_20_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): Hoover Dam's powerhouse (two wings at the
dam's foot, each about 198 m long; a line of generator units in round housings with their exciters on top; terrazzo floors laid in
Allen Tupper True's Southwest patterns; bridge cranes on runways along both walls that lift a rotor out; the visitors' balcony over
the floor; cast concrete and bronze in the Art Deco of the 1930s). The twins: the stadium's kit and the terminal's.
REUSE CHECK (REUSE-FIRST): this lane's stadium tool (its pallets, the board-size roof and its cut) and COOK FIVE's tools under it
(rig, grounds, Parts, cutter, scenes, calibration; the hall's stair): imported. New here: the powerhouse's own plan, parts and roof.
ANALOG HORROR: the dam's own tour from the balcony, the floor below empty, one lamp of forty still on; a family asleep against the
warm side of a generator nobody knows if it still turns (rule 459(e): it is not said).
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_stadium_finished_11_20_26 as SD    # this lane's: the stadium (and COOK FIVE's chain under it)

TM = SD.TM; DF = SD.DF; HT = SD.HT; TG = SD.TG; FW = SD.FW
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'powerhouse')
BOARD = (20, 15)

# ---- the ground ------------------------------------------------------------------------------------------------------------
TG.GROUNDS['pw_terr'] = dict(role=('clay_bone', 3), target=(176, 166, 146), h=0.0, alt=('tape_grey', 3), alt_amt=0.25, grit=0.08, speck=(22, 0.2),
                             joints=dict(pitch=3.0, width=0.012), panel_var=0.03)
TG.GROUNDS['pw_rust'] = dict(role=('clay_rust', 2), target=(152, 108, 86), h=0.0, alt=('clay_rust', 1), alt_amt=0.25, grit=0.08, speck=(22, 0.25))
TG.GROUNDS['pw_black'] = dict(role=('tape_grey', 1), target=(108, 102, 92), h=0.0, alt=('rubber', 1), alt_amt=0.2, grit=0.08, speck=(22, 0.2))
TG.CAL0.update(pw_terr=0.69, pw_rust=0.84, pw_black=0.9)   # (the measured numbers live in calibration.json)
TG.WEAR.update(pw_terr=0.2, pw_rust=0.2, pw_black=0.2)
TURF, WET, STEP = (0, 1, 2), 3, 4


def motif(lx, ly, kind):
    """one of True's Southwest patterns in a tile's middle (inside 2 m of its edge): returns (rust mask, black mask)"""
    X, Y = lx - 6.0, ly - 6.0; ax, ay = np.abs(X), np.abs(Y); dd = ax + ay
    if kind == 0:     # a stepped diamond: three nested steps, rust and black
        st = np.floor(ax / 0.6) * 0.6 + np.floor(ay / 0.6) * 0.6
        return (np.abs(st - 2.4) < 0.31) | (np.abs(st - 1.2) < 0.31), (np.abs(st - 3.6) < 0.31) | (dd < 0.45)
    if kind == 1:     # a band of zigzag across the tile, a black line each side
        z = np.abs(((X + 6.0) % 1.6) - 0.8) * 1.1
        band = (ay < 1.2) & (ax < 3.8)
        return band & (np.abs(Y - (z - 0.45)) < 0.22), (ax < 3.8) & (np.abs(ay - 1.35) < 0.09)
    r = np.hypot(X, Y); a = np.arctan2(Y, X)   # a ring of chevrons round a black sun
    chev = (r > 2.2) & (r < 3.4) & (np.abs(((a * 12 / (2 * np.pi)) % 1.0) - 0.5 + (r - 2.8) * 0.35) < 0.18)
    return chev, ((r > 0.55) & (r < 0.95)) | ((r > 3.55) & (r < 3.7))      # (a black ring for its sun: a black disc rendered as a hole in the floor)


def plan_pw_floor(ID, seed=163):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['pw_terr'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    pale = np.clip((dust - 0.5) / 0.3, 0, 1) * 0.28; dark = np.clip((0.4 - dust) / 0.3, 0, 1) * 0.1
    kinds = rng.randint(0, 3, size=(5, 5))
    # (11/21, after his 'Wip', looked at on his phone) THE RING OF CHEVRONS IS GONE: a red sunburst a tile wide on near half the
    # tiles, and the page lays them at random, so the whole board and the ground past it read as peppermint wallpaper. Now three
    # tiles of the fifteen carry a pattern, the stepped diamond and the zigzag band only, worn: the field is plain terrazzo
    PICK = {(0, 1): 0, (1, 3): 1}                                        # (three of fifteen still read as one tile in five, a hundred tiles on his screen: two)
    for r in range(4):
        for c in range(5):
            if r < 3 and (r, c) not in PICK: continue
            if r == 3 and c != 1: continue                                    # (the wet row: one of five, so a weep is not always a pattern)
            k = PICK.get((r, c), kinds[r, c] % 2)
            m = (row == r) & (col == c); ru, bl = motif(lx, ly, k)
            gid[m & ru] = ID['pw_rust']; gid[m & bl] = ID['pw_black']
            pale = np.where(m & (ru | bl), np.maximum(pale, 0.3 + 0.2 * (dust > 0.45)), pale)   # worn: faded, walked pale where the feet went
    # THE WET ROW: the dam weeps: dark water standing in the middle, lime crust where it dried at its edge, a dry margin round the tile
    wn = FW.vnoise((H, W), 1.3 * PPM, rng); wt = TG.win(lx, ly, 0.8, 2.4)
    wet = (row == WET) & ((wt * (0.4 + 0.7 * wn)) > 0.4)
    dark = np.where(row == WET, np.maximum(dark, wet * (0.5 + 0.2 * wn)), dark)
    rim = (row == WET) & ((wt * (0.4 + 0.7 * wn)) > 0.33) & ~wet
    pale = np.where(row == WET, np.maximum(pale * 0.5, rim * 0.55), pale)
    for c in range(5):                                                    # a drip line where it comes down the wall, a streak of lime
        x0 = c * TMT + 3.0 + 6.0 * rng.rand(); m = (row == WET) & (np.abs(xm - x0) < 0.12) & (ly > 1.5) & (ly < 10.5)
        pale = np.where(m, np.maximum(pale, 0.4), pale)
    st = row == STEP; gid[st] = ID['pw_terr']; dark = np.where(st, 0.05, dark); pale = np.where(st, 0.05, pale)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['pw_floor'] = plan_pw_floor


def pw_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(13.0, 59.4)), 30)


TG.GARAGE_THINGS['pw_floor'] = pw_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
PW_AT = dict(balcony=(10.0, 46.0), stair_e=(26.0, 46.0), stair_w=(42.0, 46.0), wall_ns=(57.0, 45.0),
             wall_ew=(10.0, 40.0), rail_ew=(26.0, 41.5), bench=(42.0, 39.0),
             unit=(10.0, 20.0), rotor=(26.0, 23.0), board=(42.0, 31.0), column=(53.0, 31.0),
             hook=(42.0, 22.0), spares=(51.0, 22.0), spares_b=(56.0, 22.5),
             cable=(6.0, 10.0), cable_b=(12.0, 10.5), cart=(20.0, 10.0), cart_b=(26.0, 10.5), camp_a=(36.0, 3.0), camp_b=(48.0, 3.0))
UNIT_H, ROTOR_H, BOARD_H, HOOK_H, WALL_H, RAIL_H = 5.6, 2.6, 2.0, 2.2, 2.4, 1.1


def balcony(P, ox, oy, rng):
    """one tile of the visitors' balcony: its floor at 1.42, the fascia with the bronze band, the dust"""
    P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02); P.box('pw_terr_m', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.02, LEVEL_H)
    for k in range(6): P.box('pw_rust_m', ox - 6 + k * 2.0 + 0.9, ox - 6 + k * 2.0 + 1.1, oy + 0.4, oy + 11.6, LEVEL_H, LEVEL_H + 0.004)   # its runner pattern (the same at both ends)
    P.box('conc', ox - 6, ox + 6, oy - 0.05, oy, 0.0, LEVEL_H - 0.02); P.box('brass', ox - 6, ox + 6, oy - 0.06, oy - 0.05, LEVEL_H - 0.36, LEVEL_H - 0.22)
    for k in range(6): x = ox - 6 + k * 2.0 + 0.5; P.box('under', x, x + 1.0, oy - 0.056, oy - 0.05, 0.2, LEVEL_H - 0.5)   # its cast panels
    for _ in range(8): x = ox + rng.uniform(-5.5, 5.5); y = oy + rng.uniform(0.4, 11.4); P.box('paper', x, x + 0.25, y, y + 0.18, LEVEL_H, LEVEL_H + 0.006)   # a tour's leaflets


def bench(P, ox, oy, rng):
    """the balcony's benches, facing the hall: three long ones a tile wide"""
    for k in range(3):
        x0 = ox - 5.6 + k * 3.9
        P.box('wood', x0, x0 + 3.4, oy + 0.3, oy + 0.75, 0.42, 0.48); P.box('wood_d', x0, x0 + 3.4, oy + 0.72, oy + 0.8, 0.48, 0.86)
        for x in (x0 + 0.2, x0 + 3.1): P.box('brass', x, x + 0.1, oy + 0.3, oy + 0.78, 0.0, 0.42)
    P.box('rug', ox + 1.2, ox + 3.0, oy + 0.3, oy + 0.75, 0.48, 0.53); P.box('white', ox + 1.3, ox + 1.7, oy + 0.35, oy + 0.7, 0.53, 0.6)   # somebody sleeps up here


def rail(P, ox, oy, rng):
    """the balcony's bronze rail: posts, a top rail, the Deco bars between"""
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.25, 0.0, 0.3)
    for k in range(25): x = ox - 6 + 0.04 + k * 0.4975; P.box('brass', x - 0.02, x + 0.02, oy + 0.1, oy + 0.15, 0.3, RAIL_H - 0.05)
    P.box('brass', ox - 6, ox + 6, oy + 0.06, oy + 0.19, RAIL_H - 0.06, RAIL_H)
    for k in range(4): x = ox - 4.5 + k * 3.0; P.box('brass', x - 0.3, x + 0.3, oy + 0.09, oy + 0.16, 0.5, 0.62)   # its Deco plaques


def wall_ew(P, ox, oy, rng):
    """the hall's concrete: cast panels, the bronze band, a plaque"""
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.35, 0.0, WALL_H); P.box('conc_d', ox - 6, ox + 6, oy - 0.02, oy + 0.37, WALL_H, WALL_H + 0.05)
    for k in range(6): x = ox - 6 + k * 2.0; P.box('conc_d', x, x + 0.06, oy - 0.03, oy, 0.0, WALL_H)
    P.box('brass', ox - 6, ox + 6, oy - 0.04, oy, 1.7, 1.82)
    P.box('brass', ox - 1.0, ox + 0.2, oy - 0.05, oy, 0.9, 1.4); P.box('under', ox - 0.9, ox + 0.1, oy - 0.056, oy - 0.05, 1.0, 1.3)
    P.box('stain', ox + 2.0, ox + 2.6, oy - 0.006, oy, 0.0, 1.6); P.box('chalk', ox + 2.05, ox + 2.55, oy - 0.008, oy - 0.006, 0.0, 0.12)   # where it weeps, its lime


def wall_ns(P, ox, oy, rng):
    P.box('conc', ox - 0.175, ox + 0.175, oy, oy + 12, 0.0, WALL_H); P.box('conc_d', ox - 0.2, ox + 0.2, oy, oy + 12, WALL_H, WALL_H + 0.05)
    P.box('conc', ox - 0.181, ox + 0.181, oy - 0.006, oy, 0.0, WALL_H)


def unit(P, ox, oy, rng):
    """A GENERATOR in its housing, a tile: the round steel housing, its number, the exciter on top, the rail round it, a ladder"""
    cx, cy = ox, oy + 5.4
    P.drum('pw_steel', cx, cy, 0.0, 0.25, 5.1, 40); P.drum('pw_steel', cx, cy, 0.25, 4.0, 4.8, 40); P.drum('pw_steel_t', cx, cy, 4.0, 4.1, 4.85, 40)
    for k in range(5): z = 0.8 + k * 0.7; P.drum('pw_steel_d', cx, cy, z, z + 0.05, 4.82, 40)                     # its plate seams
    P.drum('pw_steel', cx, cy, 4.1, UNIT_H - 0.3, 1.6, 24); P.drum('pw_steel_t', cx, cy, UNIT_H - 0.3, UNIT_H, 1.7, 24)   # the exciter
    for k in range(16):                                                                              # the rail round the top
        a = k * 2 * math.pi / 16; x, y = cx + 4.6 * math.cos(a), cy + 4.6 * math.sin(a)
        P.bar('steel', (x, y, 4.1), (x, y, 5.1), 0.025)
        a2 = (k + 1) * 2 * math.pi / 16; P.bar('steel', (x, y, 5.1), (cx + 4.6 * math.cos(a2), cy + 4.6 * math.sin(a2), 5.1), 0.025)
    P.box('white', cx - 1.4, cx - 0.2, cy - 4.86, cy - 4.8, 2.4, 3.3); P.box('white', cx + 0.1, cx + 1.3, cy - 4.86, cy - 4.8, 2.4, 3.3)   # its number, big, on the face
    P.box('pw_steel_d', cx - 1.2, cx - 0.4, cy - 4.87, cy - 4.86, 2.6, 3.1); P.box('pw_steel_d', cx + 0.3, cx + 1.1, cy - 4.87, cy - 4.86, 2.8, 2.9)
    for k in range(12): z = 0.3 + k * 0.32; P.box('steel', cx + 3.1, cx + 3.6, cy - 3.8, cy - 3.7, z, z + 0.03)       # a ladder up its side
    P.box('steel', cx + 3.1, cx + 3.14, cy - 3.8, cy - 3.7, 0.0, 4.1); P.box('steel', cx + 3.56, cx + 3.6, cy - 3.8, cy - 3.7, 0.0, 4.1)
    P.box('red', cx - 3.4, cx - 2.9, cy - 3.65, cy - 3.6, 1.2, 1.6)                                    # a dead alarm


def board(P, ox, oy, rng):
    """the unit's control board, a tile wide: cabinets of dead dials, the desk in front, a chair"""
    for k in range(6):
        x = ox - 5.4 + k * 1.8
        P.box('pw_cab', x, x + 1.7, oy + 0.8, oy + 1.5, 0.0, BOARD_H); P.box('pw_steel_t', x - 0.02, x + 1.72, oy + 0.78, oy + 1.52, BOARD_H, BOARD_H + 0.04)
        for j in range(3):
            for i in range(2): P.drum('white', x + 0.45 + i * 0.8, oy + 0.79, 0.9 + j * 0.35, 0.9 + j * 0.35 + 0.01, 0.13, 10)   # its dials, dead
        P.box('under', x + 0.2, x + 1.5, oy + 0.795, oy + 0.8, 0.3, 0.7)
    P.box('pw_cab', ox - 5.4, ox + 5.4, oy + 0.1, oy + 0.7, 0.0, 0.8); P.box('pw_steel_t', ox - 5.45, ox + 5.45, oy + 0.05, oy + 0.75, 0.8, 0.84)   # the desk
    P.box('paper', ox - 2.0, ox - 1.5, oy + 0.2, oy + 0.6, 0.84, 0.85); P.box('black', ox + 1.0, ox + 1.4, oy + 0.3, oy + 0.6, 0.84, 0.9)   # a log book open, a phone
    P.box('steel', ox + 2.2, ox + 2.7, oy - 0.6, oy - 0.1, 0.0, 0.48); P.box('black', ox + 2.2, ox + 2.7, oy - 0.62, oy - 0.56, 0.48, 0.95)   # a chair, pushed back


def rotor(P, ox, oy, rng):
    """a rotor lifted out and set on its cribbing: the hub, the pole pieces round it"""
    cx, cy = ox, oy + 4.6
    for k in range(4): y = cy - 3.4 + k * 2.2; P.box('wood_d', cx - 4.2, cx + 4.2, y, y + 0.5, 0.0, 0.5)               # the cribbing
    P.drum('pw_steel', cx, cy, 0.5, ROTOR_H, 3.6, 36); P.drum('pw_steel_t', cx, cy, ROTOR_H, ROTOR_H + 0.06, 3.4, 36)
    for k in range(24): a = k * 2 * math.pi / 24; P.box('copper', cx + 3.55 * math.cos(a) - 0.2, cx + 3.55 * math.cos(a) + 0.2, cy + 3.55 * math.sin(a) - 0.2, cy + 3.55 * math.sin(a) + 0.2, 0.6, ROTOR_H - 0.1)   # its poles
    P.drum('pw_steel_d', cx, cy, ROTOR_H, ROTOR_H + 0.5, 0.8, 16); P.drum('chrome', cx, cy, ROTOR_H + 0.5, ROTOR_H + 0.55, 0.85, 16)


def hook(P, ox, oy, rng):
    """the crane's hook block let down to the floor, its cable slack in coils"""
    P.box('haz', ox - 0.6, ox + 0.6, oy + 0.6, oy + 1.4, 0.6, HOOK_H); P.box('black', ox - 0.62, ox + 0.62, oy + 0.58, oy + 1.42, 1.0, 1.08)   # the block, yellow and black
    P.drum('pw_steel_d', ox, oy + 1.0, 0.1, 0.6, 0.18, 10); P.box('pw_steel_d', ox - 0.35, ox + 0.35, oy + 0.9, oy + 1.1, 0.0, 0.2)    # the hook
    for k in range(4):                                                                                # the cable, slack, in coils on the floor
        r = 0.7 + 0.3 * k
        for i in range(16): a0, a1 = i * 2 * math.pi / 16, (i + 1) * 2 * math.pi / 16; P.bar('pw_steel_d', (ox + 1.8 + r * math.cos(a0), oy + 1.6 + r * 0.8 * math.sin(a0), 0.04 + 0.04 * k), (ox + 1.8 + r * math.cos(a1), oy + 1.6 + r * 0.8 * math.sin(a1), 0.04 + 0.04 * k), 0.03)
    P.bar('pw_steel_d', (ox, oy + 1.0, HOOK_H), (ox + 0.3, oy + 1.4, HOOK_H + 0.6), 0.035)


def crate(P, x, y, w, d, h, rng):
    P.box('wood', x, x + w, y, y + d, 0.0, h)
    for z in (0.05, h - 0.1): P.box('wood_d', x - 0.01, x + w + 0.01, y - 0.01, y, z, z + 0.08)
    P.box('paint_k', x + w * 0.2, x + w * 0.8, y - 0.012, y - 0.01, h * 0.4, h * 0.6)                   # its stencil


def spares(P, ox, oy, rng):
    for (dx, dy, w, d, h) in ((-2.2, 0.1, 1.6, 1.0, 1.1), (-0.4, 0.1, 1.4, 1.2, 1.4), (1.2, 0.2, 1.0, 0.9, 0.8), (-1.6, 1.3, 1.8, 1.1, 0.9), (0.4, 1.5, 1.2, 1.0, 1.2), (-1.4, 1.4, 1.0, 0.8, 1.8)):
        crate(P, ox + dx, oy + dy, w, d, h, rng)
    P.box('wood', ox - 2.0, ox - 0.6, oy - 0.5, oy - 0.1, 0.0, 0.05)                                   # a lid prised off


def spares_b(P, ox, oy, rng):
    crate(P, ox - 1.0, oy + 0.1, 1.4, 1.0, 0.9, rng); crate(P, ox + 0.5, oy + 0.2, 1.0, 0.8, 0.6, rng)
    for k in range(5): P.box('copper', ox - 0.8 + k * 0.3, ox - 0.65 + k * 0.3, oy - 0.4, oy - 0.1, 0.0, 0.12)   # what was in one, out on the floor


def reel(P, x, y, r, w, mat='wood'):
    P.wheel(mat, x, y, r, r, w, 20); P.wheel('black', x, y, r, r * 0.8, w * 0.9, 20); P.wheel('wood_d', x, y, r, r * 0.25, w + 0.04, 10)


def cable(P, ox, oy, rng):
    reel(P, ox - 1.6, oy + 0.9, 0.9, 0.9); reel(P, ox + 0.6, oy + 0.7, 0.7, 0.7)
    pts = [(ox - 1.6, oy + 0.2), (ox - 0.4, oy - 0.6), (ox + 1.4, oy - 0.4), (ox + 2.6, oy - 1.0), (ox + 3.4, oy - 0.6)]   # the cable run off it across the floor
    for (p0, p1) in zip(pts[:-1], pts[1:]): P.bar('black', (p0[0], p0[1], 0.05), (p1[0], p1[1], 0.05), 0.05)


def cable_b(P, ox, oy, rng):
    reel(P, ox, oy + 0.6, 0.6, 0.6)
    for (p0, p1) in (((ox, oy), (ox + 1.6, oy - 0.4)), ((ox + 1.6, oy - 0.4), (ox + 2.4, oy + 0.2))): P.bar('black', (p0[0], p0[1], 0.05), (p1[0], p1[1], 0.05), 0.05)


def toolcart(P, x, y, col='red'):
    P.box(col, x, x + 1.0, y, y + 0.5, 0.15, 1.0); P.box('pw_steel_t', x - 0.02, x + 1.02, y - 0.02, y + 0.52, 1.0, 1.04)
    for k in range(5): P.box('pw_steel_d', x + 0.05, x + 0.95, y - 0.004, y, 0.25 + k * 0.15, 0.27 + k * 0.15)   # its drawers
    for (dx, dy) in ((0.1, 0.1), (0.9, 0.1), (0.1, 0.4), (0.9, 0.4)): P.drum('black', x + dx, y + dy, 0.0, 0.15, 0.06, 8)


def cart(P, ox, oy, rng):
    toolcart(P, ox - 2.0, oy + 0.4); toolcart(P, ox - 0.6, oy + 0.4, 'teal')
    P.box('steel', ox + 0.8, ox + 2.6, oy + 0.2, oy + 1.2, 0.5, 0.56); P.box('steel', ox + 0.8, ox + 2.6, oy + 0.2, oy + 1.2, 0.0, 0.05)   # a parts trolley
    for (dx, dy) in ((0.85, 0.25), (2.5, 0.25), (0.85, 1.1), (2.5, 1.1)): P.box('steel', ox + dx, ox + dx + 0.05, oy + dy, oy + dy + 0.05, 0.0, 0.56)
    P.box('copper', ox + 1.0, ox + 1.8, oy + 0.4, oy + 0.9, 0.56, 0.7); P.box('pw_steel_d', ox + 2.0, ox + 2.4, oy + 0.4, oy + 0.9, 0.56, 0.8)
    for _ in range(6): x = ox + rng.uniform(-2.2, 2.4); y = oy + rng.uniform(-0.5, 0.1); P.box('pw_steel_d', x, x + 0.25, y, y + 0.05, 0.0, 0.04)   # spanners on the floor


def cart_b(P, ox, oy, rng):
    toolcart(P, ox - 0.5, oy + 0.3, 'red'); P.box('black', ox + 0.7, ox + 1.3, oy + 0.3, oy + 0.6, 0.0, 0.35)


def camp(P, ox, oy, rng, b):
    """somebody living by a unit: bedding on cardboard, a stove, a lantern, the shoes; or a cot under a tarp off a cart"""
    if not b:
        P.box('card', ox - 2.4, ox + 0.4, oy + 0.2, oy + 1.6, 0.0, 0.03); P.box('rug', ox - 2.3, ox - 0.4, oy + 0.3, oy + 1.4, 0.03, 0.1)
        P.box('blue', ox - 1.0, ox + 0.3, oy + 0.35, oy + 1.4, 0.03, 0.12); P.box('white', ox - 2.2, ox - 1.8, oy + 0.4, oy + 0.8, 0.1, 0.18)
        P.drum('pw_steel_d', ox + 1.0, oy + 0.8, 0.0, 0.25, 0.2, 10); P.drum('can', ox + 1.0, oy + 0.8, 0.25, 0.42, 0.12, 10)   # the stove, a pot on it
        P.drum('jug', ox + 1.5, oy + 1.3, 0.0, 0.3, 0.1, 8); P.box('haz', ox + 1.6, ox + 1.8, oy + 0.3, oy + 0.5, 0.0, 0.3)   # water, a lantern
        for k in range(2): P.box('black', ox - 2.8, ox - 2.55, oy + 0.45 + k * 0.16, oy + 0.55 + k * 0.16, 0.0, 0.09)
        P.box('paper', ox - 0.2, ox + 0.3, oy + 1.5, oy + 1.9, 0.0, 0.01)                                   # a child's drawing of the generator
    else:
        toolcart(P, ox - 2.4, oy + 1.2, 'teal'); toolcart(P, ox + 0.6, oy + 1.2, 'red')
        P.box('blue', ox - 2.4, ox + 1.6, oy + 0.6, oy + 1.8, 1.04, 1.08); P.box('blue_d', ox - 2.4, ox + 1.6, oy + 0.58, oy + 0.6, 0.4, 1.08)
        P.box('steel', ox - 1.8, ox + 0.2, oy + 0.7, oy + 1.5, 0.0, 0.38); P.box('tan', ox - 1.75, ox + 0.15, oy + 0.75, oy + 1.45, 0.38, 0.45)   # the cot
        P.box('card', ox + 1.2, ox + 1.8, oy - 0.1, oy + 0.4, 0.0, 0.4); P.drum('can', ox + 1.5, oy + 0.15, 0.4, 0.5, 0.06, 8)


def column(P, ox, oy, rng):
    P.box('conc', ox - 0.6, ox + 0.6, oy - 0.6, oy + 0.6, 0.0, 2.9); P.box('conc_d', ox - 0.62, ox + 0.62, oy - 0.62, oy + 0.62, 2.9, 2.94)
    P.box('brass', ox - 0.61, ox + 0.61, oy - 0.61, oy + 0.61, 1.9, 2.05)
    for k in range(4): P.box('paper', ox - 0.5 + k * 0.25, ox - 0.32 + k * 0.25, oy - 0.612, oy - 0.61, 0.9 + 0.1 * (k % 2), 1.2 + 0.1 * (k % 2))   # the names on it


def pw_parts(P, rng):
    A = PW_AT
    balcony(P, *A['balcony'], rng); HT.stair(P, *A['stair_e'], 1); HT.stair(P, *A['stair_w'], -1); wall_ns(P, *A['wall_ns'], rng)
    wall_ew(P, *A['wall_ew'], rng); rail(P, *A['rail_ew'], rng); bench(P, *A['bench'], rng)
    unit(P, *A['unit'], rng); rotor(P, *A['rotor'], rng); board(P, *A['board'], rng); column(P, *A['column'], rng)
    hook(P, *A['hook'], rng); spares(P, *A['spares'], rng); spares_b(P, *A['spares_b'], rng)
    cable(P, *A['cable'], rng); cable_b(P, *A['cable_b'], rng); cart(P, *A['cart'], rng); cart_b(P, *A['cart_b'], rng)
    camp(P, *A['camp_a'], rng, False); camp(P, *A['camp_b'], rng, True)


def pw_mats(bpy, NF, F, M, which):
    if which not in ('pw_pieces', 'tun_pieces'): return
    if which == 'pw_pieces': SD.st_mats(bpy, NF, F, M, 'st_pieces')
    M.update(pw_steel=NF.material(bpy, 'in_paint_unit', 'metal_painted', 2, 0.95), pw_steel_t=NF.material(bpy, 'in_paint_unit_top', 'metal_painted', 3, 0.9),
             pw_steel_d=NF.material(bpy, 'in_steel_dark', 'tape_grey', 1, 0.9), pw_cab=NF.material(bpy, 'in_paint_board', 'clay_teal', 1, 0.95),
             pw_terr_m=NF.material(bpy, 'in_stall_terrazzo_balcony', 'clay_bone', 3, 0.9), pw_rust_m=NF.material(bpy, 'in_stall_inlay_balcony', 'clay_rust', 2, 0.9),
             copper=NF.material(bpy, 'in_copper', 'clay_rust', 3, 1.0), conc_d=NF.material(bpy, 'in_conc_dark', 'tape_grey', 1, 0.9),
             brass=NF.material(bpy, 'in_brass', 'clay_mustard', 2, 0.9), lamp=NF.material(bpy, 'in_lit_lamp', 'sodium', 3, 1.2))


TG.PARTS['pw_pieces'] = pw_parts
TG.MAT_HOOKS.append(pw_mats)


# ---- the ceiling: one picture the size of the board (the runways are on the long walls) ------------------------------------
CT = SIDE / BOARD[0]
bat = SD.bat


def ceil_powerhouse(P, rng):
    P.box('conc_d', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                # the roof far up
    for i in range(18):                                                                                 # its beams across the hall, every tile and a quarter (a beam on every
        x = bat(i * 1.25 - 0.3, 0)[0]; ya, yb = bat(0, BOARD[1] + 0.5, 0.4)[1], bat(0, -0.5, 0.4)[1]       # tile would draw his grid over the fight at 10%)
        P.box('conc', x - 0.2, x + 0.2, ya, yb, 0.0, 0.4 + 0.002 * (i % 3))
    for j in (3, 7.5, 12):                                                                             # and the purlins along it
        y = bat(0, j, 0.3)[1]; P.box('conc', -3.0, 63.0, y - 0.12, y + 0.12, 0.42, 0.44)
    for side in (1.0, BOARD[1] - 1.0):                                                                 # the crane runways along both long walls
        y = bat(0, side, 1.2)[1]; P.box('pw_steel_d', -3.0, 63.0, y - 0.5, y + 0.5, 0.5, 1.2); P.box('steel', -3.0, 63.0, y - 0.1, y + 0.1, 1.2, 1.3)
        for k in range(BOARD[0] + 1): x = bat(k, 0)[0]; P.box('pw_steel_d', x - 0.15, x + 0.15, y - 0.6, y + 0.6, 0.3, 0.5)
    for bx in (6.5, 14.0):                                                                              # two bridge cranes across the hall, their trolleys, the hooks hanging
        x = bat(bx, 0)[0]; ya, yb = bat(bx, BOARD[1] - 1.0, 1.6)[1], bat(bx, 1.0, 1.6)[1]
        P.box('haz', x - 0.7, x + 0.7, ya, yb, 1.3, 1.9); P.box('black', x - 0.72, x + 0.72, ya, yb, 1.5, 1.56)
        for k in range(int((yb - ya) / 1.5)): P.box('black', x - 0.71, x + 0.71, ya + k * 1.5, ya + k * 1.5 + 0.6, 1.9, 1.91)
        ty = bat(bx, 5.5 if bx < 10 else 9.0, 2.2)[1]; P.box('haz', x - 1.0, x + 1.0, ty - 0.8, ty + 0.8, 1.9, 2.3)
        hy = bat(bx, 5.5 if bx < 10 else 9.0, 3.4)[1]; P.box('pw_steel_d', x - 0.06, x + 0.06, hy, ty, 2.3, 2.4); P.box('haz', x - 0.3, x + 0.3, hy - 0.4, hy, 3.0, 3.4)
    n = 0
    for i in range(8):                                                                                 # the hanging lamps: forty, one still on
        for j in range(5):
            bx, by = 1.25 + i * 2.5, 1.5 + j * 3.0; x, y = bat(bx, by, 1.0); on = (i, j) == (4, 1)   # (in the open: the first render hid it under a crane)
            P.box('pw_steel_d', x - 0.02, x + 0.02, y, y + TG.LEAN * 1.0, 0.0, 1.0); P.drum('lamp' if on else 'pw_steel_t', x, y, 0.95, 1.1, 0.45, 12); n += 1
    for _ in range(30):                                                                                # the dirt on the roof: water stains where it leaks
        bx, by = rng.uniform(0, BOARD[0]), rng.uniform(2, BOARD[1] - 2); x, y = bat(bx, by, 0.01); TG.bloom(P, 'stain', x, y, rng.uniform(0.6, 1.6), rng, 6)


TG.CEILINGS['powerhouse'] = (ceil_powerhouse, 'powerhouse/powerhouse_ceiling.webp', "the generator hall's roof far up, a beam across it every tile and its purlins, the crane runways along both long walls, two bridge cranes across the hall with their trolleys and their hooks hanging, forty hanging lamps and one of them still on, the stains where it leaks: one picture the size of the board")
TG.CEIL_DATA['powerhouse'] = 'powerhouse/powerhouse.json'
CEIL_SHIP = SD.CEIL_SHIP

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(balcony='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', rail_ew='RAIL', wall_ew='WALL', wall_ns='WALL', bench='LOW_COVER', unit='COVER', rotor='COVER',
            board='LOW_COVER', column='WALL', hook='COVER', spares='COVER', spares_b='DRESS', cable='LOW_COVER', cable_b='DRESS', cart='LOW_COVER', cart_b='DRESS',
            camp_a='LOW_COVER', camp_b='LOW_COVER')
HM = dict(balcony=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, rail_ew=RAIL_H, wall_ew=WALL_H, wall_ns=WALL_H, bench=0.86, unit=UNIT_H, rotor=ROTOR_H + 0.55, board=BOARD_H,
          column=2.94, hook=HOOK_H, spares=1.8, spares_b=0.9, cable=1.8, cable_b=1.2, cart=1.04, cart_b=1.04, camp_a=0.45, camp_b=1.08)
NAME = dict(balcony="THE BALCONY", stair_e='ITS STAIRS, EAST', stair_w='ITS STAIRS, WEST', rail_ew="THE BALCONY'S RAIL", wall_ew="THE HALL'S WALL", wall_ns="THE HALL'S WALL",
            bench="THE BALCONY'S BENCHES", unit='A GENERATOR', rotor='A ROTOR ON ITS STAND', board="A UNIT'S BOARD", column='A COLUMN', hook="THE CRANE'S HOOK",
            spares='CRATED SPARES', spares_b='CRATED SPARES', cable='CABLE REELS', cable_b='CABLE REELS', cart='TOOL CARTS', cart_b='TOOL CARTS',
            camp_a="SOMEBODY'S BEDDING", camp_b="SOMEBODY'S BEDDING")
ALSO = dict(bedding_a='camp_a', bedding_b='camp_b')


def recut_floor():
    """(11/21, the powerhouse's second pass) the floor alone, into the folder as it stands"""
    p = os.path.join(SHIP, 'powerhouse_art.json'); art = json.load(open(p))
    im = Image.open(os.path.join(REND, 'pw_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'powerhouse_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6)
    art.setdefault('bytes', {})['floor'] = os.path.getsize(fn); json.dump(art, open(p, 'w'), indent=1)
    print('floor', os.path.getsize(fn), 'folder', sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')))


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'pw_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'powerhouse_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'pw_pieces.png')).convert('RGBA'); A = PW_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'pw_' + key, 'powerhouse', shadow)
    for key in ('balcony', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.1, y + 12.0 + hh + (1.7 if key != 'balcony' else 0.4)), 1.0 if key == 'balcony' else 0.0)
        v = sz[key]
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'pw_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1])), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 0.4 + RAIL_H * 1.45 + 0.2), 0.4)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 0.5 + WALL_H * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + WALL_H * 1.45), 0.5)
    x, y = A['bench']; one('bench', (x - 6.0, x + 6.0, y - 0.3, y + 1.0 + 0.95 * 1.45), 1.0)
    x, y = A['unit']; one('unit', (x - 5.3, x + 5.3, y - 0.2, y + 10.6 + UNIT_H * 1.45), 1.0, foot=(x, y + 0.3))
    x, y = A['rotor']; one('rotor', (x - 4.4, x + 4.4, y - 0.2, y + 8.4 + (ROTOR_H + 0.6) * 1.45), 1.0, foot=(x, y + 1.2))
    x, y = A['board']; one('board', (x - 5.6, x + 5.6, y - 0.8, y + 1.6 + BOARD_H * 1.45), 1.0)
    x, y = A['column']; one('column', (x - 0.8, x + 1.4, y - 0.8, y + 0.7 + 3.0 * 1.45), 0.6, foot=(x, y - 0.6))
    x, y = A['hook']; one('hook', (x - 0.9, x + 3.4, y - 0.1, y + 2.9 + (HOOK_H + 0.6) * 1.45), 1.0, foot=(x, y + 0.6))
    x, y = A['spares']; one('spares', (x - 2.4, x + 2.4, y - 0.6, y + 2.6 + 1.9 * 1.45), 1.0)
    x, y = A['spares_b']; one('spares_b', (x - 1.2, x + 1.6, y - 0.5, y + 1.3 + 1.0 * 1.45), 1.0)
    x, y = A['cable']; one('cable', (x - 2.6, x + 3.6, y - 1.2, y + 1.9 + 1.9 * 1.45), 1.0)
    x, y = A['cable_b']; one('cable_b', (x - 0.8, x + 2.6, y - 0.6, y + 1.3 + 1.3 * 1.45), 1.0)
    x, y = A['cart']; one('cart', (x - 2.4, x + 2.8, y - 0.6, y + 1.4 + 1.1 * 1.45), 1.0)
    x, y = A['cart_b']; one('cart_b', (x - 0.7, x + 1.5, y - 0.1, y + 0.9 + 1.1 * 1.45), 1.0)
    for key in ('camp_a', 'camp_b'):
        x, y = A[key]; one(key, (x - 3.0, x + 2.2, y - 0.3, y + 2.0 + 1.1 * 1.45), 1.0)
    for k, v in sz.items(): v.update(piece=k, src='powerhouse/pw_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['powerhouse/powerhouse_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'pw_' + k: ent(k) for k in sz}
    for a, k in ALSO.items(): kit['pw_' + a] = dict(ent(k), kind='DRESS')
    art = {'version': 'cook6-powerhouse-art-11-20', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's powerhouse (slices/fight_ground/powerhouse/powerhouse.json, BUILD 11/20j): the names its handoff asked for, the garage's format. floor.floor is the terrazzo (rows 0 to 2: cream, one of Allen Tupper True's Southwest patterns in a tile's middle on most tiles, rust and black, never on an edge); floor.wet the same floor wet where the dam weeps (row 3: dark water in the middle, the lime where it dried, a dry margin so it meets the floor); floor.high the balcony's floor (row 4); floor.ring the terrazzo. Any tile of a list meets any tile of it.",
           'floor': {'floor': cells(TURF), 'wet': cells((WET,)), 'high': cells((STEP,)), 'ring': cells(TURF)}, 'kit': kit,
           'how_it_lays': {'the units': "pw_unit is a generator 10.2 m across and 5.6 m to its exciter, foot its south edge middle (your 'at' [0.5, 0.9]); pw_board six cabinets and the desk a tile wide; pw_rotor 7.2 m across on its cribbing; pw_column 1.2 m square, foot its base middle.",
                           'the balcony': "pw_balcony on every high tile, 1.42 m up, foot its south edge middle, its runner pattern the same at both ends; pw_bench three benches a tile wide (your 'at' [0.5, 0.82], lifted); pw_stair_e / _w the hall's concrete stair; pw_rail_ew its bronze rail.",
                           'the floor things': "pw_hook the block, the hook and its cable in coils; pw_spares six crates, pw_spares_b two and what was in one; pw_cable two reels and the cable run off them, pw_cable_b one; pw_cart two tool carts and a parts trolley, pw_cart_b one; pw_camp_a / _b (pw_bedding_a / _b the same pictures): foot each at its south edge middle.",
                           'the hall': 'pw_wall_ew / _ns: cast concrete to 2.4 m, its panels, the bronze band, a plaque, where it weeps; a tile long.'},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'powerhouse_art.json'))
    cp = os.path.join(REND, 'ceil_powerhouse.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        h15 = int(round(im.height * BOARD[1] / BOARD[0]))
        fn = os.path.join(SHIP, 'powerhouse_ceiling.webp'); bg.convert('RGB').crop((0, 0, im.width, h15)).resize(CEIL_SHIP, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'powerhouse/powerhouse.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "powerhouse/powerhouse_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == list(BOARD)):
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % BOARD, e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='powerhouse/powerhouse_ceiling.webp', bays=[5, 5], bay_px=[CEIL_SHIP[0] // 5, CEIL_SHIP[1] // 5], covers=list(BOARD), whole=True, what=TG.CEILINGS['powerhouse'][2],
                              contract="powerhouse.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); 'tile' [20, 15] is the board: ONE picture, never repeated (the runways are on its long walls)")
    json.dump(art, open(os.path.join(SHIP, 'powerhouse_art.json'), 'w'), indent=1)
    print('powerhouse: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


def sheet_again(before_dir, page_dir, old_dir):
    """(11/21) records/target/COOK6_THE_POWERHOUSE_AGAIN_11_21.webp: his 'Wip' on the first, and what changed. The game's own fight
    page, the same fight before (the first floor) and now, as he meets it (the roof at his 10%); close in; the floor's fifteen tiles,
    the first and now."""
    from PIL import ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub):
        im = Image.new('RGB', (WID, 64), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK); d.text((10, 38), sub, font=font(14), fill=DIM); rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 120 / 390), n.width, int(n.width * 620 / 390))))(Image.open(fn))
    cw = (WID - 10) // 2; ch = int(500 * cw / 390)
    title('THE POWERHOUSE AGAIN, AS HE MEETS IT', "his 'Wip' on the first; on his phone, 390 x 844, as the fight opens, the roof at his 10%: the first, and now")
    strip((('THE FIRST: A RED SUNBURST ON NEAR HALF THE TILES', up(os.path.join(before_dir, 'powerhouse_upright_open_a01.png'))), ('NOW: PLAIN TERRAZZO, A PATTERN HERE AND THERE', up(os.path.join(page_dir, 'powerhouse_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, BY THE GENERATORS', 'the first and now')
    strip((('THE FIRST', up(os.path.join(before_dir, 'powerhouse_upright_units_close.png'))), ('NOW', up(os.path.join(page_dir, 'powerhouse_upright_units_close.png')))), cw, ch)
    title("THE FLOOR'S TILES, THE FIRST AND NOW", "the terrazzo's fifteen and the wet row: the ring of chevrons gone; one stepped diamond and one zigzag band, worn")
    fa = Image.open(os.path.join(old_dir, 'old_powerhouse_floor_0.webp')).convert('RGB'); fb = Image.open(os.path.join(SHIP, 'powerhouse_floor_0.webp')).convert('RGB')
    hh = int(fa.height * 4 / 5); strip((('THE FIRST', fa.crop((0, 0, fa.width, hh))), ('NOW', fb.crop((0, 0, fb.width, hh)))), cw, int(cw * hh / fa.width))
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_POWERHOUSE_AGAIN_11_21.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-powerhouse-again-11-21.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'pw_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'pw_pieces' else TG.scene_ceiling('powerhouse', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'recut_floor': recut_floor()
    elif a and a[0] == 'sheet_again': sheet_again(a[1], a[2], a[3])
    elif a and a[0] == 'cal': TG.scene_cal(True); TG.calibrate()
    elif a and a[0] == 'cut': cut()
    else: print(__doc__)


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_POWERHOUSE_11_20.webp: the fight on his phone before and now (the roof off and at his 10%), close in on
    the page, the pieces at their own pixels, a tile of the terrazzo and of the wet floor, the roof at full strength"""
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
    title("THE DAM'S POWERHOUSE, BEFORE AND NOW", 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the roof at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'powerhouse_upright_open_a0.png'))), ('NOW, THE ROOF OFF', up(os.path.join(page_dir, 'powerhouse_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE ROOF AT 10%', up(os.path.join(page_dir, 'powerhouse_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the generators and their boards, the balcony, somebody living by a unit')
    strip([(lab, up(os.path.join(page_dir, 'powerhouse_upright_%s.png' % n))) for lab, n in (('THE GENERATORS', 'units_close'), ('THE BALCONY', 'balcony_close'), ('A CAMP', 'camp_close'))], cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'a generator, the rotor on its cribbing, a unit\'s board, the hook, the crates, the reels, the carts, the camps, the balcony and its rail')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'pw_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('unit', 'rotor'), 320); row_of(('board', 'balcony'), 220); row_of(('hook', 'spares', 'cable', 'cart', 'column'), 170); row_of(('camp_a', 'camp_b', 'rail_ew', 'wall_ew'), 120)
    title('THE TERRAZZO, THE WET FLOOR, AND THE ROOF AT FULL STRENGTH', 'Allen Tupper True\'s patterns in rust and black; where the dam weeps; the runways, the two cranes, one lamp of forty on')
    fl = Image.open(os.path.join(SHIP, 'powerhouse_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'powerhouse_ceiling.webp')).convert('RGB')
    t1 = fl.crop((0, 0, TW, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_POWERHOUSE_11_20.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-powerhouse-11-20.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__' and sys.argv[1:2] == ['sheet']: sheet(sys.argv[2], sys.argv[3])
