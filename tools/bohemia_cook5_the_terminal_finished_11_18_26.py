#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the airport terminal, finished] (11/18/26; the coordinator's routine 'COOK FIVE next', VAMILY rules 453,
441, 416, 451(a), 455: 'take the next jobs on your own list, one build each: finished art wherever a card still says STAND-IN').

COMBAT THREE's eighth inside (BUILD 11/18g - THE TERMINAL, slices/fight_ground/terminal/terminal.json, laid by
slices/bohemia_big_inside.js): a ticketing hall, one checkpoint everybody is squeezed through, the gates, the baggage hall.
'When flights stop, a terminal fills with people who cannot leave and luggage nobody collects.' All 27 of its pieces were
stand-ins. Its handoff names what it wants; these are the pictures, through the master rig, ON this lane's data fort,
warehouse, mall and hall tools and the tunnels-and-garage tool under them (all imported):

  THE FLOOR        terminal_floor_0.webp, five tiles by five (any tile meets any tile): grey terrazzo in two-metre panels,
                   the wayfinding arrows inlaid in it, the lines trolley wheels left; row 4 with no marks.
  THE PIECES       (terminal_art.json's kit, COMBAT THREE's names)
    tm_booth       THE CHECKPOINT, a tile: the scanner's tunnel and its belt, the tubs still on it with what people took
                   off (shoes, a belt, a bear), the arch, the glass booth of the body scanner, the officer's desk
    tm_screen_ew / tm_screen_ns   the checkpoint's glass screens, from the lane and end on
    tm_counter     a row of check-in desks a tile wide: the scales, the dead screens, tags on the floor
    tm_queue       the queue's posts and belts in their maze, some down, a case left standing in line
    tm_newsstand   a newsstand, its shutter torn off and lying in front of it
    tm_luggage / tm_bags   suitcases stacked into a wall; a heap of soft bags, one opened
    tm_trolley_a / _b / _c   trolleys nested in a row; one loaded and left; one on its side
    tm_seats / tm_seats_b    a gate's seats, back to back, two torn out, a blanket over three; the second row
    tm_belt        one tile of a carousel's belt: the black plates, three bags nobody took
    tm_carousel    the carousel's middle, heaped
    tm_camp_a / _b (and tm_bedding_a / _b, the same two pictures)   somebody who never got a flight out
    tm_column      a white column, a dead screen strapped to it, the papers people taped up
    tm_walkway, tm_stair_e / _w, tm_rail_ew / _ns, tm_wall_ew / _ns
  THE CEILING      terminal_ceiling.webp (rule 451(a), over the fight at 10%): the long white roof, a rib every bay, a
                   strip of skylight with panes out, the dead signs hung under it (gate numbers, the departures board).

  <venv>/bin/python tools/bohemia_cook5_the_terminal_finished_11_18_26.py cal
  <venv>/bin/python tools/bohemia_cook5_the_terminal_finished_11_18_26.py render tm_floor | tm_pieces | ceil_terminal [--quick]
  python3 tools/bohemia_cook5_the_terminal_finished_11_18_26.py cut
  python3 tools/bohemia_cook5_the_terminal_finished_11_18_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): an airport terminal of the 1990s to
2010s (grey terrazzo with inlaid wayfinding; check-in desks in rows with bag scales between; a security lane: divest table,
grey tubs, an X-ray tunnel on a roller belt, a walk-through arch, a glass body scanner; belt-and-post queue mazes; beam
seating at the gates; flat-plate baggage carousels round a stainless island; nested luggage trolleys; a long white roof on
ribs with strip skylights and hung signs). The twins: the data fort's kit and the mall's (the card shows the terminal before
and now).
REUSE CHECK (REUSE-FIRST): this lane's data fort tool (its stair), hall tool (its glass rail), mall tool (its materials)
and the tunnels-and-garage tool (rig, grounds, plans, Parts, cutter, scenes, calibration): imported. New here only the
terminal's own plan, parts and ceiling.
ANALOG HORROR: a checkpoint's tubs still holding what people took off to go through; shoes lined up neatly beside bedding at
a gate; every sign dead on one evening.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_data_fort_finished_11_18_26 as DF     # this lane's: the fort's tool, the warehouse's, the mall's, the hall's and TG through it

WT = DF.WT; MT = WT.MT; HT = MT.HT; TG = HT.TG; FW = TG.FW
W, H, PPM, PYM, SIDE, TM, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'terminal')

# ---- the ground ------------------------------------------------------------------------------------------------------------
TG.GROUNDS['tm_floor'] = dict(role=('tape_grey', 3), target=(168, 166, 158), h=0.0, alt=('clay_bone', 3), alt_amt=0.25, grit=0.07, speck=(22, 0.15),
                              joints=dict(pitch=2.0, width=0.016), panel_var=0.04)
TG.CAL0['tm_floor'] = 0.85
TG.WEAR['tm_floor'] = 0.18


def plan_tm_floor(ID, seed=131):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['tm_floor'], np.uint8)
    pale = np.full((H, W), 0.04, np.float32); dark = np.zeros((H, W), np.float32)
    pick = rng.rand(5, 5); way = rng.rand(5, 5) < 0.5
    for r in range(4):                                         # the wayfinding arrows, inlaid: one in a tile here and there, inside the tile
        for c in range(5):
            if pick[r, c] > 0.3: continue
            m = (col == c) & (row == r); X = lx if way[r, c] else (TM - lx); Y = np.abs(ly - 6.0)
            shaft = (Y < 0.11) & (X > 3.2) & (X < 8.2); head = (np.abs((X - 8.4) + Y) < 0.16) & (Y < 1.1) & (X < 8.7)
            dark = np.maximum(dark, (m & (shaft | head)) * 0.42)
    for r in range(4):                                         # what trolley wheels left: pairs of thin lines, inside a tile
        for c in range(5):
            for _ in range(int(rng.randint(2, 5))):
                x0, y0 = c * TM + rng.uniform(1.4, 10.6), r * TM + rng.uniform(1.4, 10.6); a = rng.uniform(0, math.pi); L = rng.uniform(2.0, 5.0)
                for off in (-0.28, 0.28):
                    xa_, ya_ = x0 - math.sin(a) * off, y0 + math.cos(a) * off
                    x1, y1 = np.clip(xa_ + math.cos(a) * L, c * TM + 0.9, c * TM + 11.1), np.clip(ya_ + math.sin(a) * L, r * TM + 0.9, r * TM + 11.1)
                    ya, yb = int(max(0, (min(ya_, y1) - 0.2) * PYM)), int(min(H, (max(ya_, y1) + 0.2) * PYM)); xa, xb = int(max(0, (min(xa_, x1) - 0.2) * PPM)), int(min(W, (max(xa_, x1) + 0.2) * PPM))
                    X, Y = xm[ya:yb, xa:xb], ty[ya:yb, xa:xb]; dx, dy = x1 - xa_, y1 - ya_; t = np.clip(((X - xa_) * dx + (Y - ya_) * dy) / max(dx * dx + dy * dy, 1e-6), 0, 1)
                    dd = np.hypot(X - (xa_ + t * dx), Y - (ya_ + t * dy)); dark[ya:yb, xa:xb] = np.maximum(dark[ya:yb, xa:xb], np.clip(1 - dd / 0.03, 0, 1) * rng.uniform(0.16, 0.34))
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['tm_floor'] = plan_tm_floor


def tm_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0, 60), r_.uniform(0, 60)), 46)   # tags, passes, a strap


TG.GARAGE_THINGS['tm_floor'] = tm_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
TM_AT = dict(walkway=(10.0, 45.0), stair_e=(26.0, 45.0), stair_w=(42.0, 45.0), rail_ew=(10.0, 40.5), wall_ew=(26.0, 39.5), screen_ew=(42.0, 38.0),
             rail_ns=(52.0, 4.0), wall_ns=(55.0, 4.0), screen_ns=(57.6, 20.0),
             booth=(6.0, 23.0), carousel=(18.5, 23.5), belt=(33.0, 31.0), counter=(33.0, 25.5), queue=(45.6, 25.5),
             seats=(7.0, 15.5), seats_b=(20.5, 16.0), luggage=(30.5, 15.5), bags=(37.5, 15.5), newsstand=(45.0, 14.5), column=(50.0, 34.0),
             trolley_a=(4.5, 4.0), trolley_b=(11.5, 4.5), trolley_c=(15.5, 4.5), camp_a=(22.5, 3.5), camp_b=(31.0, 3.5))
SCR_H, BOOTH_H = 2.0, 2.3
CASES = ('cab', 'rustp', 'teal', 'must', 'tape', 'cloth_r', 'blue', 'cab', 'couch', 'tan')


def case(P, x, y, w, d, h, mat, stand=False):
    """a suitcase: its shell, its handle, a strap"""
    P.box(mat, x, x + w, y, y + d, 0.0 if isinstance(stand, bool) else stand, (0.0 if isinstance(stand, bool) else stand) + h)
    z = (0.0 if isinstance(stand, bool) else stand) + h
    P.box('under', x + w * 0.35, x + w * 0.65, y + d * 0.42, y + d * 0.58, z, z + 0.035); P.box('steel', x + w * 0.2, x + w * 0.24, y - 0.004, y, z - h * 0.9, z - h * 0.1)


def walkway(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02); P.box('gcarp', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.02, LEVEL_H)
    for i in range(6):                                         # the carpet's bands (the same on every tile's edge, so deck tiles meet)
        P.box('gcarp_b', ox - 6 + i * 2.0 + 0.7, ox - 6 + i * 2.0 + 1.3, oy, oy + 12, LEVEL_H, LEVEL_H + 0.004)
    P.box('panel', ox - 6, ox + 6, oy - 0.006, oy, LEVEL_H - 0.55, LEVEL_H - 0.02); P.box('haz', ox - 6, ox + 6, oy - 0.01, oy - 0.006, LEVEL_H - 0.2, LEVEL_H - 0.12)   # the fascia, the wayfinding band on it
    P.box('under', ox - 6, ox + 6, oy - 0.006, oy, 0.0, LEVEL_H - 0.55)                                         # under it, dark
    for x in (ox - 6, ox - 0.2, ox + 5.6): P.box('panel', x, x + 0.4, oy - 0.03, oy, 0.0, LEVEL_H - 0.55)


def wall_ew(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.25, 0.0, 1.6); P.box('panel', ox - 6, ox + 6, oy - 0.006, oy, 0.0, 1.6)
    P.box('haz', ox - 6, ox + 6, oy - 0.01, oy - 0.006, 1.2, 1.32)                                               # the wayfinding band
    for i in range(1, 4): P.box('under', ox - 6 + i * 3.0 - 0.008, ox - 6 + i * 3.0 + 0.008, oy - 0.012, oy - 0.006, 0.0, 1.2)
    P.box('steel', ox - 4.6, ox - 2.0, oy - 0.05, oy, 0.25, 1.1); P.box('glass_d', ox - 4.5, ox - 2.1, oy - 0.056, oy - 0.05, 0.32, 1.03)   # an advertisement's box, dark
    P.box('steel', ox + 2.2, ox + 3.6, oy - 0.3, oy, 0.38, 0.44); P.box('under', ox + 2.3, ox + 2.4, oy - 0.26, oy - 0.2, 0.0, 0.38); P.box('under', ox + 3.4, ox + 3.5, oy - 0.26, oy - 0.2, 0.0, 0.38)   # a charging shelf; nothing charges


def wall_ns(P, ox, oy, rng):
    P.box('conc', ox - 0.125, ox + 0.125, oy, oy + 12, 0.0, 1.6); P.box('panel', ox - 0.131, ox + 0.131, oy - 0.006, oy, 0.0, 1.6)


def screen_ew(P, ox, oy, rng):
    """the checkpoint's glass screen seen from the lane, a tile wide: posts, panes to two metres, one pane gone"""
    P.box('steel', ox - 6, ox + 6, oy, oy + 0.1, 0.0, 0.3)
    for i in range(7): x = ox - 6 + i * 2.0 - (0.06 if i == 6 else 0.0); P.box('steel', x, x + 0.06, oy, oy + 0.1, 0.3, SCR_H)
    for i in range(6):
        if i == 4:                                             # the pane that went: what is left of it on the floor
            for _ in range(7): x = ox - 6 + i * 2.0 + rng.uniform(0.2, 1.7); y = oy - rng.uniform(0.1, 0.9); P.box('rail_glass', x, x + rng.uniform(0.1, 0.3), y, y + rng.uniform(0.08, 0.2), 0.0, 0.012)
            continue
        P.box('rail_glass', ox - 6 + i * 2.0 + 0.06, ox - 6 + i * 2.0 + 2.0, oy + 0.03, oy + 0.07, 0.3, SCR_H - 0.04)
    P.box('steel', ox - 6, ox + 6, oy, oy + 0.1, SCR_H - 0.04, SCR_H)
    P.box('haz', ox - 1.0, ox + 1.0, oy - 0.012, oy, 1.45, 1.75)                                                # the lane's plate
    for k in range(3): P.box('under', ox - 0.8 + k * 0.5, ox - 0.45 + k * 0.5, oy - 0.018, oy - 0.012, 1.52, 1.68)


def screen_ns(P, ox, oy, rng):
    """the same screen end on, a tile deep"""
    P.box('steel', ox - 0.05, ox + 0.05, oy, oy + 12, 0.0, 0.3)
    for i in range(7): y = oy + i * 2.0 - (0.06 if i == 6 else 0.0); P.box('steel', ox - 0.05, ox + 0.05, y, y + 0.06, 0.3, SCR_H)
    for i in range(6):
        if i == 2: continue
        P.box('rail_glass', ox - 0.02, ox + 0.02, oy + i * 2.0 + 0.06, oy + i * 2.0 + 2.0, 0.3, SCR_H - 0.04)
    P.box('steel', ox - 0.05, ox + 0.05, oy, oy + 12, SCR_H - 0.04, SCR_H)


def tub(P, x, y, z, what=None):
    P.box('tape', x, x + 0.6, y, y + 0.42, z, z + 0.14); P.box('under', x + 0.04, x + 0.56, y + 0.04, y + 0.38, z + 0.14, z + 0.146)
    if what == 'shoes': P.box('black', x + 0.1, x + 0.36, y + 0.08, y + 0.18, z + 0.146, z + 0.23); P.box('black', x + 0.1, x + 0.36, y + 0.24, y + 0.34, z + 0.146, z + 0.23)
    elif what == 'bear': P.box('couch', x + 0.15, x + 0.45, y + 0.1, y + 0.32, z + 0.146, z + 0.3); P.box('couch', x + 0.22, x + 0.38, y + 0.14, y + 0.28, z + 0.3, z + 0.42)
    elif what == 'belt': P.box('wood_d', x + 0.08, x + 0.5, y + 0.16, y + 0.24, z + 0.146, z + 0.17); P.box('chrome', x + 0.44, x + 0.52, y + 0.15, y + 0.25, z + 0.146, z + 0.18)
    elif what == 'coat': P.box('cloth_r', x + 0.06, x + 0.54, y + 0.06, y + 0.36, z + 0.146, z + 0.22)


def booth(P, ox, oy, rng):
    """THE CHECKPOINT, a tile: the belt and the scanner's tunnel, the tubs with what people took off, the arch, the body
    scanner's glass booth, the officer's desk"""
    y0 = oy + 5.2                                              # the roller belt, east to west, the tunnel on its middle
    P.box('steel', ox - 4.8, ox + 4.8, y0, y0 + 0.9, 0.0, 0.78); P.box('chrome', ox - 4.8, ox + 4.8, y0 + 0.06, y0 + 0.84, 0.78, 0.8)
    for k in range(32): P.box('under', ox - 4.75 + k * 0.3, ox - 4.73 + k * 0.3, y0 + 0.06, y0 + 0.84, 0.8, 0.806)        # its rollers' gaps
    P.box('cab', ox - 1.3, ox + 1.3, y0 - 0.25, y0 + 1.15, 0.0, 1.95); P.box('cab_t', ox - 1.25, ox + 1.25, y0 - 0.2, y0 + 1.1, 1.95, 1.97)        # the tunnel
    P.box('under', ox - 1.31, ox - 1.3, y0 + 0.1, y0 + 0.8, 0.8, 1.4); P.box('panel', ox - 0.9, ox + 0.9, y0 - 0.256, y0 - 0.25, 1.2, 1.6); P.box('red', ox + 0.5, ox + 0.7, y0 - 0.262, y0 - 0.256, 1.3, 1.5)
    for (dx, what) in ((-4.3, 'shoes'), (-3.5, 'coat'), (-2.3, 'belt'), (2.0, 'bear'), (3.0, None), (3.9, 'shoes')): tub(P, ox + dx, y0 + 0.24, 0.806, what)
    for k in range(6): tub(P, ox - 4.7, y0 - 1.0, k * 0.1)                                                     # the tubs, stacked at the belt's head
    P.box('under', ox + 1.5, ox + 2.2, y0 + 1.3, y0 + 1.7, 0.0, 1.2); P.box('glass_d', ox + 1.52, ox + 2.18, y0 + 1.294, y0 + 1.3, 0.75, 1.18); P.box('lit', ox + 1.7, ox + 1.95, y0 + 1.288, y0 + 1.294, 0.9, 1.05)   # the screen the officer watched: a bag still on it
    # the arch, and the glass booth of the body scanner
    for x in (ox - 0.5, ox + 0.38): P.box('panel', x, x + 0.12, oy + 2.4, oy + 2.9, 0.0, 2.1)
    P.box('panel', ox - 0.5, ox + 0.5, oy + 2.4, oy + 2.9, 2.1, 2.24); P.box('red', ox - 0.1, ox + 0.1, oy + 2.39, oy + 2.4, 2.12, 2.22)
    P.drum('rail_glass', ox + 3.0, oy + 2.7, 0.06, 2.1, 0.95, 16); P.drum('panel', ox + 3.0, oy + 2.7, 2.1, 2.26, 1.0, 16); P.drum('steel', ox + 3.0, oy + 2.7, 0.0, 0.06, 1.0, 16)
    P.box('paint_y', ox + 2.75, ox + 2.95, oy + 2.5, oy + 2.9, 0.06, 0.066); P.box('paint_y', ox + 3.05, ox + 3.25, oy + 2.5, oy + 2.9, 0.06, 0.066)      # the two feet painted on its floor
    # the officer's desk, a stool down; the table they searched bags on; a bin of what was taken off people
    P.box('panel', ox - 3.6, ox - 2.4, oy + 2.2, oy + 2.9, 0.0, 1.1); P.box('cab_t', ox - 3.65, ox - 2.35, oy + 2.15, oy + 2.95, 1.1, 1.13); P.box('under', ox - 2.1, ox - 1.5, oy + 1.9, oy + 2.0, 0.0, 0.4)
    P.box('chrome', ox - 4.6, ox - 1.6, oy + 0.3, oy + 1.1, 0.74, 0.78)
    for (dx, dy) in ((-4.55, 0.35), (-1.7, 0.35), (-4.55, 1.0), (-1.7, 1.0)): P.box('steel', ox + dx, ox + dx + 0.06, oy + dy, oy + dy + 0.06, 0.0, 0.74)
    case(P, ox - 4.0, oy + 0.45, 0.75, 0.5, 0.28, 'teal', 0.78); P.box('cloth', ox - 3.0, ox - 2.2, oy + 0.4, oy + 0.95, 0.78, 0.86); P.box('white', ox - 2.9, ox - 2.5, oy + 0.5, oy + 0.8, 0.86, 0.9)
    P.box('tape', ox + 1.2, ox + 2.2, oy + 0.3, oy + 1.1, 0.0, 0.7)
    for _ in range(14): x = ox + 1.25 + rng.uniform(0, 0.8); y = oy + 0.35 + rng.uniform(0, 0.6); P.box(('jug', 'teal', 'chrome')[rng.randint(3)], x, x + 0.1, y, y + 0.1, 0.7, 0.7 + rng.uniform(0.08, 0.26))
    for k in range(4): P.drum('steel', ox + 3.2 + k * 0.5, oy + 0.6, 0.0, 0.95, 0.045, 8)                      # four posts of the lane's own queue
    for k in range(3): P.bar('blue', (ox + 3.2 + k * 0.5, oy + 0.6, 0.9), (ox + 3.7 + k * 0.5, oy + 0.6, 0.9), 0.022)


def counter(P, ox, oy, rng):
    """a row of check-in desks a tile wide: five desks, a bag scale between each pair, dead screens, tags on the floor"""
    for k in range(5):
        x = ox - 5.7 + k * 2.4
        P.box('panel', x, x + 1.5, oy + 0.7, oy + 1.5, 0.0, 1.08); P.box('cab_t', x - 0.04, x + 1.54, oy + 0.64, oy + 1.56, 1.08, 1.11); P.box('haz', x, x + 1.5, oy + 0.694, oy + 0.7, 0.8, 0.95)
        P.box('under', x + 0.5, x + 1.0, oy + 1.2, oy + 1.26, 1.11, 1.5); P.box('lit' if k == 3 else 'glass_d', x + 0.54, x + 0.96, oy + 1.194, oy + 1.2, 1.16, 1.46)        # its screen: one still on
        if k < 4: P.box('steel', x + 1.55, x + 2.35, oy + 0.5, oy + 1.9, 0.0, 0.16); P.box('black', x + 1.6, x + 2.3, oy + 0.55, oy + 1.85, 0.16, 0.17)                    # the scale and its belt
    case(P, ox - 3.95, oy + 0.9, 0.5, 0.75, 0.3, 'rustp', 0.17); case(P, ox + 3.25, oy + 0.7, 0.5, 0.75, 0.3, 'cab', 0.17)
    for _ in range(16): x = ox + rng.uniform(-5.5, 5.5); y = oy + rng.uniform(-0.1, 0.6); P.box('paper', x, x + 0.22, y, y + 0.06, 0.0, 0.006)          # the tags
    P.box('under', ox - 1.3, ox - 0.7, oy + 1.75, oy + 2.3, 0.0, 0.45)                                           # a chair, pushed back


def queue(P, ox, oy, rng):
    """the queue's posts and belts in their maze: four lanes, some posts down, a case left standing in line"""
    for r in range(4):
        y = oy + 0.4 + r * 1.2
        for k in range(6):
            x = ox - 4.6 + k * 1.84; down = (r, k) in ((1, 2), (2, 4), (3, 1))
            if down: P.drum('steel', x, y - 0.3, 0.0, 0.03, 0.17, 10); P.bar('steel', (x, y - 0.3, 0.05), (x + 0.9, y - 0.5, 0.05), 0.04); continue
            P.drum('steel', x, y, 0.0, 0.03, 0.17, 10); P.drum('steel', x, y, 0.03, 0.98, 0.04, 8)
            if k < 5 and (r, k + 1) not in ((1, 2), (2, 4), (3, 1)) and not (r % 2 == 0 and k == 4) and not (r % 2 == 1 and k == 0):
                P.bar('blue', (x, y, 0.92), (x + 1.84, y, 0.92), 0.022)
    case(P, ox + 0.6, oy + 2.2, 0.42, 0.28, 0.62, 'must'); P.box('steel', ox + 0.74, ox + 0.88, oy + 2.32, oy + 2.36, 0.62, 0.98)        # a case left in line, its handle still up
    P.box('paper', ox - 2.0, ox - 1.7, oy + 1.0, oy + 1.2, 0.0, 0.006); P.box('cloth_r', ox + 2.6, ox + 3.1, oy + 3.0, oy + 3.3, 0.0, 0.05)


def newsstand(P, ox, oy, rng):
    """a newsstand: back and sides, the roof slab, the counter, what is left on the racks, the shutter torn off in front"""
    P.box('panel', ox - 2.6, ox + 2.6, oy + 2.3, oy + 2.5, 0.0, 2.5); P.box('panel', ox - 2.6, ox - 2.45, oy, oy + 2.3, 0.0, 2.5); P.box('panel', ox + 2.45, ox + 2.6, oy, oy + 2.3, 0.0, 2.5)
    P.box('steel', ox - 2.7, ox + 2.7, oy - 0.1, oy + 2.6, 2.5, 2.62); P.box('sign', ox - 2.7, ox + 2.7, oy - 0.106, oy - 0.1, 2.5, 2.62)
    for k in range(6): P.box('paint_w' if k not in (1, 4) else 'sign_g', ox - 1.6 + k * 0.55, ox - 1.25 + k * 0.55, oy - 0.112, oy - 0.106, 2.52, 2.6)   # its letters, two gone
    P.box('under', ox - 2.45, ox + 2.45, oy + 0.02, oy + 2.3, 0.0, 0.012)                                         # the dark of its floor
    P.box('paint_w', ox - 2.4, ox + 0.2, oy + 0.1, oy + 0.7, 0.0, 1.0); P.box('cab_t', ox - 2.44, ox + 0.24, oy + 0.06, oy + 0.74, 1.0, 1.03)
    for s_ in range(3):                                        # the back racks: a few spines left
        P.box('steel', ox - 2.3, ox + 2.3, oy + 2.1, oy + 2.3, 0.5 + s_ * 0.6, 0.53 + s_ * 0.6)
        for k in range(14):
            if rng.rand() < 0.55: continue
            x = ox - 2.2 + k * 0.32; P.box(('rustp', 'teal', 'must', 'white', 'cloth_r')[rng.randint(5)], x, x + 0.24, oy + 2.12, oy + 2.28, 0.53 + s_ * 0.6, 0.53 + s_ * 0.6 + rng.uniform(0.25, 0.4))
    P.box('panel', ox + 1.0, ox + 2.2, oy + 1.4, oy + 2.1, 0.0, 1.9); P.box('glass_d', ox + 1.06, ox + 2.14, oy + 1.394, oy + 1.4, 0.2, 1.8)        # the drinks' fridge, empty
    P.box('shutter', ox - 2.2, ox + 1.4, oy - 1.9, oy - 0.5, 0.0, 0.05)                                           # the shutter, torn off, lying in front
    for k in range(6): P.box('under', ox - 2.2, ox + 1.4, oy - 1.86 + k * 0.23, oy - 1.84 + k * 0.23, 0.05, 0.056)
    P.box('steel', ox + 1.9, ox + 2.5, oy - 1.4, oy - 0.9, 0.0, 0.05); P.bar('steel', (ox + 2.2, oy - 1.15, 0.05), (ox + 3.3, oy - 0.9, 0.2), 0.03)        # a spinner rack, down
    for _ in range(8): x = ox + rng.uniform(-2.0, 2.4); y = oy + rng.uniform(-0.5, 0.0); P.box('paper', x, x + 0.25, y, y + 0.18, 0.0, 0.008)


def luggage(P, ox, oy, rng):
    """suitcases stacked into a wall, 5.4 m wide: five courses, laid like bricks"""
    for k in range(5):
        x = ox - 2.7 + (0.2 if k % 2 else 0.0)
        while x < ox + 2.3:
            w = rng.uniform(0.62, 0.86); d = rng.uniform(0.42, 0.55)
            if x + w > ox + 2.75: break
            case(P, x, oy + 0.5 + rng.uniform(-0.06, 0.06), w, d, 0.3, CASES[rng.randint(len(CASES))], 0.31 * k); x += w + 0.04
    for (dx, m) in ((-3.3, 'teal'), (2.9, 'cab')): case(P, ox + dx, oy + 0.1, 0.45, 0.3, 0.68, m)                 # two stood at its ends
    P.box('cloth', ox - 1.2, ox - 0.5, oy - 0.3, oy + 0.2, 0.0, 0.06)


def bags(P, ox, oy, rng):
    """a heap of soft bags, one opened and gone through"""
    for (dx, dy, w, d, h, m) in ((-1.2, 0.3, 1.0, 0.5, 0.42, 'cab'), (-0.3, 0.5, 0.9, 0.5, 0.4, 'blue'), (0.5, 0.3, 0.8, 0.45, 0.36, 'rug'), (-0.8, 0.45, 0.9, 0.45, 0.36, 'tan'), (0.1, 0.4, 0.8, 0.45, 0.34, 'cloth_r')):
        z = 0.0 if dy < 0.45 or m in ('blue',) else 0.4
        P.box(m, ox + dx, ox + dx + w, oy + dy, oy + dy + d, z, z + h); P.box('under', ox + dx + w * 0.3, ox + dx + w * 0.7, oy + dy + d * 0.45, oy + dy + d * 0.55, z + h, z + h + 0.03)
    P.box('cab', ox + 0.9, ox + 1.7, oy - 0.5, oy + 0.05, 0.0, 0.14); P.box('cab', ox + 0.9, ox + 1.7, oy + 0.05, oy + 0.1, 0.0, 0.55)        # one opened: its lid up
    for k, m in enumerate(('white', 'cloth', 'cloth_r', 'tan')): P.box(m, ox + 0.5 + k * 0.33, ox + 0.9 + k * 0.33, oy - 0.9 + 0.1 * (k % 2), oy - 0.55 + 0.1 * (k % 2), 0.0, 0.05 + 0.01 * k)


def trolley(P, x, y, load=0, down=False, rng=None):
    """a luggage trolley, its handle to the south: a base, a basket, the bar"""
    if down:
        P.box('chrome', x, x + 0.95, y, y + 0.6, 0.0, 0.05); P.box('steel', x + 0.9, x + 0.95, y, y + 0.6, 0.0, 0.5); P.drum('black', x + 0.1, y + 0.1, 0.05, 0.1, 0.07, 8); P.drum('black', x + 0.1, y + 0.5, 0.05, 0.1, 0.07, 8); return
    P.box('chrome', x, x + 0.62, y, y + 0.95, 0.14, 0.18); P.box('steel', x, x + 0.04, y, y + 0.04, 0.18, 1.0); P.box('steel', x + 0.58, x + 0.62, y, y + 0.04, 0.18, 1.0)
    P.box('paint_y', x, x + 0.62, y - 0.02, y + 0.04, 0.96, 1.02); P.box('chrome', x + 0.04, x + 0.58, y + 0.02, y + 0.06, 0.4, 0.75)
    for (dx, dy) in ((0.04, 0.1), (0.5, 0.1), (0.27, 0.85)): P.drum('black', x + dx + 0.04, y + dy, 0.0, 0.14, 0.06, 8)
    for k in range(load): case(P, x + 0.02, y + 0.12, 0.58, 0.8, 0.28, CASES[(k * 3 + 1) % len(CASES)], 0.18 + 0.29 * k)


def trolley_a(P, ox, oy, rng):
    for k in range(7): trolley(P, ox - 2.6 + k * 0.36, oy + 0.3 + 0.0 * k)                                       # nested in their row
    P.box('steel', ox - 2.8, ox + 0.5, oy + 1.4, oy + 1.46, 0.0, 0.9); P.box('haz', ox - 2.8, ox + 0.5, oy + 1.394, oy + 1.4, 0.6, 0.86)                 # the row's rail and its plate
    trolley(P, ox + 1.4, oy + 0.2, load=1); trolley(P, ox + 2.4, oy + 0.9)


def trolley_b(P, ox, oy, rng):
    trolley(P, ox - 0.3, oy + 0.2, load=3); case(P, ox + 0.5, oy + 0.3, 0.5, 0.32, 0.7, 'must')


def trolley_c(P, ox, oy, rng):
    trolley(P, ox - 0.5, oy + 0.3, down=True); case(P, ox + 0.2, oy + 0.9, 0.75, 0.5, 0.28, 'rustp'); P.box('cloth', ox - 0.6, ox - 0.1, oy - 0.2, oy + 0.2, 0.0, 0.05)


def seat_bank(P, x0, y, n, south, gone=(), rng=None):
    """a bank of beam seats: the beam on its legs, n seats facing south (or north), some torn out"""
    P.box('steel', x0, x0 + n * 0.56, y + 0.2, y + 0.3, 0.3, 0.38)
    for x in (x0 + 0.2, x0 + n * 0.56 - 0.3): P.box('steel', x, x + 0.1, y - 0.05, y + 0.55, 0.0, 0.05); P.box('steel', x, x + 0.1, y + 0.2, y + 0.3, 0.05, 0.3)
    for k in range(n):
        if k in gone: continue
        x = x0 + k * 0.56
        P.box('black', x + 0.03, x + 0.53, y, y + 0.5, 0.38, 0.46)
        if south: P.box('black', x + 0.03, x + 0.53, y + 0.46, y + 0.54, 0.46, 0.92)
        else: P.box('black', x + 0.03, x + 0.53, y - 0.04, y + 0.04, 0.46, 0.92)
        P.box('chrome', x - 0.02, x + 0.03, y + 0.02, y + 0.48, 0.46, 0.62)


def seats(P, ox, oy, rng):
    """a gate's seats a tile wide: three banks back to back, two seats torn out, a blanket over three, a dead charging post"""
    for b in range(3):
        x0 = ox - 5.6 + b * 3.9
        seat_bank(P, x0, oy + 0.3, 6, True, gone=((2,), (), (4, 5))[b]); seat_bank(P, x0, oy + 0.95, 6, False, gone=((), (0,), ())[b])
    P.box('rug', ox - 1.75, ox - 0.05, oy + 0.26, oy + 0.84, 0.46, 0.5); P.box('white', ox - 1.7, ox - 1.3, oy + 0.35, oy + 0.75, 0.5, 0.58)      # a blanket over three, a pillow
    P.box('steel', ox + 2.02, ox + 2.14, oy + 0.6, oy + 0.72, 0.0, 1.25); P.box('under', ox + 1.9, ox + 2.26, oy + 0.54, oy + 0.6, 0.85, 1.2)       # the charging post; nothing charges
    case(P, ox - 4.0, oy - 0.2, 0.42, 0.28, 0.6, 'teal'); P.box('cab', ox + 3.4, ox + 4.2, oy - 0.4, oy + 0.05, 0.0, 0.3)
    for k in range(2): P.box('black', ox - 0.9 + k * 0.16, ox - 0.8 + k * 0.16, oy - 0.25, oy + 0.02, 0.0, 0.09)   # a pair of shoes, set down neatly


def seats_b(P, ox, oy, rng):
    for b in range(3): seat_bank(P, ox - 5.6 + b * 3.9, oy + 0.3, 6, True, gone=((), (1, 2), ())[b])
    P.box('tan', ox + 2.3, ox + 5.5, oy + 0.24, oy + 0.84, 0.46, 0.54); P.box('cloth', ox + 4.9, ox + 5.4, oy + 0.3, oy + 0.78, 0.54, 0.62)       # somebody's bedroll across the last bank


def belt(P, ox, oy, rng):
    """one tile of a carousel's belt, east to west, a tile wide (it meets itself): the skirt, the black plates, the bumper,
    three bags nobody took"""
    P.box('steel', ox - 6, ox + 6, oy, oy + 2.2, 0.0, 0.42); P.box('black', ox - 6, ox + 6, oy + 0.12, oy + 2.08, 0.42, 0.45)
    for k in range(24): P.box('under', ox - 6 + k * 0.5 + 0.24, ox - 6 + k * 0.5 + 0.26, oy + 0.12, oy + 2.08, 0.45, 0.455)      # the plates' joints (the same at both ends)
    P.box('paint_y', ox - 6, ox + 6, oy - 0.012, oy, 0.3, 0.4); P.box('chrome', ox - 6, ox + 6, oy, oy + 0.12, 0.42, 0.47); P.box('chrome', ox - 6, ox + 6, oy + 2.08, oy + 2.2, 0.42, 0.47)
    case(P, ox - 3.6, oy + 0.6, 0.78, 0.5, 0.28, 'cab', 0.455); case(P, ox + 0.4, oy + 1.2, 0.55, 0.8, 0.28, 'rustp', 0.455); P.box('blue', ox + 3.4, ox + 4.3, oy + 0.7, oy + 1.2, 0.455, 0.8)


def carousel(P, ox, oy, rng):
    """the carousel's middle, a tile's blocker: the stainless island and everything that came down the chute and stayed"""
    P.box('steel', ox - 4.6, ox + 4.6, oy + 0.2, oy + 8.2, 0.0, 0.7); P.box('chrome', ox - 4.5, ox + 4.5, oy + 0.3, oy + 8.1, 0.7, 0.74)
    P.box('chrome', ox - 0.9, ox + 0.9, oy + 5.4, oy + 8.0, 0.74, 2.3); P.box('under', ox - 0.7, ox + 0.7, oy + 5.39, oy + 5.4, 0.9, 1.9)             # the chute's housing, its dark mouth
    for _ in range(170):                                       # the heap
        r = 4.0 * math.sqrt(rng.rand()); a = rng.uniform(0, 6.2832); top = 2.1 * (1 - r / 4.0) ** 0.7; z = 0.74 + top * rng.uniform(0.25, 1.0)
        x = ox + r * math.cos(a) * 1.05; y = oy + 4.0 + r * math.sin(a) * 0.9; w, d = (rng.uniform(0.5, 0.85), rng.uniform(0.35, 0.55)) if rng.rand() < 0.5 else (rng.uniform(0.35, 0.55), rng.uniform(0.5, 0.85))
        P.box(CASES[rng.randint(len(CASES))], x - w / 2, x + w / 2, y - d / 2, y + d / 2, max(0.74, z - 0.3), z)


def camp(P, ox, oy, rng, b):
    """somebody who never got a flight out"""
    if not b:
        seat_bank(P, ox - 2.6, oy + 1.9, 4, True)                                                             # a bank of seats for a wall
        P.box('rug', ox - 2.4, ox - 0.5, oy + 0.3, oy + 1.4, 0.0, 0.08); P.box('white', ox - 2.3, ox - 1.8, oy + 0.4, oy + 0.8, 0.08, 0.16); P.box('tan', ox - 1.6, ox - 0.6, oy + 0.35, oy + 1.35, 0.08, 0.14)   # the bed
        case(P, ox - 0.2, oy + 0.3, 0.8, 0.5, 0.3, 'cab'); case(P, ox - 0.2, oy + 0.3, 0.8, 0.5, 0.3, 'teal', 0.31); case(P, ox + 0.8, oy + 0.4, 0.5, 0.34, 0.68, 'rustp')        # its other wall
        for k in range(2): P.box('black', ox - 2.8, ox - 2.55, oy + 0.45 + k * 0.16, oy + 0.55 + k * 0.16, 0.0, 0.09)                # the shoes, side by side
        for k in range(3): P.drum('jug', ox + 1.7 + k * 0.3, oy + 1.2, 0.0, 0.3, 0.1, 8)
        P.box('card', ox + 1.5, ox + 2.4, oy + 0.2, oy + 0.26, 0.0, 0.6)                                         # the sign he held up
        for k in range(3): P.box('under', ox + 1.6, ox + 1.6 + (0.6, 0.45, 0.55)[k], oy + 0.194, oy + 0.2, 0.42 - k * 0.13, 0.48 - k * 0.13)
    else:
        trolley(P, ox - 2.2, oy + 0.6); trolley(P, ox - 0.2, oy + 0.6)                                           # two trolleys and a sheet between them
        P.box('blue', ox - 2.3, ox + 0.5, oy + 0.5, oy + 1.7, 1.02, 1.06); P.box('blue_d', ox - 2.3, ox + 0.5, oy + 0.48, oy + 0.5, 0.45, 1.06)
        P.box('mat_', ox - 1.5, ox - 0.3, oy + 0.7, oy + 1.6, 0.0, 0.12); P.box('rug', ox - 1.4, ox - 0.4, oy + 0.75, oy + 1.3, 0.12, 0.17)
        case(P, ox + 1.0, oy + 0.5, 0.8, 0.5, 0.3, 'must'); P.box('white', ox + 1.1, ox + 1.4, oy + 0.6, oy + 0.8, 0.3, 0.42); P.drum('can', ox + 1.6, oy + 0.75, 0.3, 0.42, 0.05, 8)     # a case for a table: a cup, a tin
        for k in range(4): P.box('paper', ox + 1.2 + k * 0.28, ox + 1.4 + k * 0.28, oy - 0.1, oy + 0.16, 0.0, 0.006)                 # four boarding passes, laid in a row
        for k in range(2): P.box('black', ox + 0.62, ox + 0.87, oy + 1.2 + k * 0.16, oy + 1.3 + k * 0.16, 0.0, 0.09)


def column(P, ox, oy, rng):
    P.drum('panel', ox, oy, 0.0, 2.8, 0.55, 18); P.drum('cut', ox, oy, 2.8, 2.82, 0.53, 18); P.drum('steel', ox, oy, 0.0, 0.12, 0.6, 18)
    P.drum('haz', ox, oy, 2.1, 2.3, 0.56, 18)
    P.box('under', ox - 0.4, ox + 0.4, oy - 0.66, oy - 0.56, 1.3, 1.8); P.box('glass_d', ox - 0.36, ox + 0.36, oy - 0.666, oy - 0.66, 1.34, 1.76)       # a screen strapped to it, dead
    for k, (dx, z) in enumerate(((-0.5, 0.9), (-0.2, 0.75), (0.15, 0.95), (0.42, 0.7), (-0.35, 0.5))): P.box('paper', ox + dx, ox + dx + 0.2, oy - 0.57, oy - 0.56, z, z + 0.26)     # the papers people taped up


def tm_parts(P, rng):
    A = TM_AT
    walkway(P, *A['walkway'], rng); DF.dstair(P, *A['stair_e'], 1); DF.dstair(P, *A['stair_w'], -1)
    HT.rail_ew(P, *A['rail_ew'], rng); HT.rail_ns(P, *A['rail_ns'], rng); wall_ew(P, *A['wall_ew'], rng); wall_ns(P, *A['wall_ns'], rng)
    screen_ew(P, *A['screen_ew'], rng); screen_ns(P, *A['screen_ns'], rng)
    booth(P, *A['booth'], rng); carousel(P, *A['carousel'], rng); belt(P, *A['belt'], rng); counter(P, *A['counter'], rng); queue(P, *A['queue'], rng)
    seats(P, *A['seats'], rng); seats_b(P, *A['seats_b'], rng); luggage(P, *A['luggage'], rng); bags(P, *A['bags'], rng); newsstand(P, *A['newsstand'], rng); column(P, *A['column'], rng)
    trolley_a(P, *A['trolley_a'], rng); trolley_b(P, *A['trolley_b'], rng); trolley_c(P, *A['trolley_c'], rng); camp(P, *A['camp_a'], rng, False); camp(P, *A['camp_b'], rng, True)


def tm_mats(bpy, NF, F, M, which):
    if which not in ('tm_pieces', 'tun_pieces'): return         # ('tun_pieces' is what the ceiling's scene asks its materials by)
    if which == 'tm_pieces': DF.df_mats(bpy, NF, F, M, 'df_pieces')            # the fort's, the warehouse's and the mall's own (the panel white, the cabinet black, the hazard yellow, the glass)
    M.update(gcarp=NF.material(bpy, 'in_cloth_carpet_gate', 'clay_teal', 1, 0.8), gcarp_b=NF.material(bpy, 'in_cloth_carpet_gate_b', 'clay_teal', 2, 0.85),
             skyl=NF.material(bpy, 'in_ceil_clear_skylight', 'clay_bone', 4, 1.0))


TG.PARTS['tm_pieces'] = tm_parts
TG.MAT_HOOKS.append(tm_mats)


# ---- the ceiling (rule 451(a)) ----------------------------------------------------------------------------------------------
def ceil_terminal(P, rng):
    at, band_y = TG.at, TG.band_y
    P.box('paint_w', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                  # the long white roof
    for c in range(-1, 7): P.box('paint_w', c * TM - 0.4, c * TM + 0.4, -3.0, 63.0, 0.0, 1.0); P.box('steel', c * TM - 0.46, c * TM + 0.46, -3.0, 63.0, 1.0, 1.12)      # a rib every bay, its steel flange
    for r in range(-1, 6):                                     # a strip of skylight across every bay: mullions, and panes out
        y0, y1 = band_y(r, 6.0, 2.4, 0.0); P.box('skyl', -3.0, 63.0, y0, y1, 0.0, 0.02)
        for k in range(-3, 64): P.box('steel', k * 1.0 - 0.03, k * 1.0 + 0.03, y0, y1, 0.02, 0.1)
        P.box('steel', -3.0, 63.0, y0 - 0.06, y0, 0.0, 0.12); P.box('steel', -3.0, 63.0, y1, y1 + 0.06, 0.0, 0.12)
        if 0 <= r < 5:
            for c in range(5):
                for k in range(2, 10):                         # (none within two metres of a bay's edge: any bay meets any bay)
                    if rng.rand() < 0.3: x = c * TM + k * 1.0; P.box('black', x + 0.04, x + 0.96, y0 + 0.05, y1 - 0.05, 0.02, 0.03)
    for r in range(5):
        for c in range(5):
            # the gate's number, hung dead; in every other bay the departures board, every row of it dark
            x, y = at(c, r, 3.2, 2.6, 1.4); P.box('black', x - 1.2, x + 1.2, y - 0.12, y + 0.12, 0.9, 1.4); P.box('paint_y', x - 1.0, x - 0.3, y - 0.13, y - 0.12, 1.0, 1.3)
            for dx in (-1.0, 1.0): P.box('steel', x + dx - 0.02, x + dx + 0.02, y - 0.02, y + 0.02, 0.0, 0.9)
            if (c + r) % 2 == 0:
                # (in the bay's middle and hung short: at (8.6, 9.6) and 1.8 down its shadow reached the bay's edge, and a bay with a
                #  board did not meet a bay without one: this lane's gate, C2, 14.3 over itself where 8 is allowed)
                x, y = at(c, r, 6.0, 9.0, 1.4); P.box('black', x - 1.9, x + 1.9, y - 0.15, y + 0.15, 0.5, 1.4)
                for k in range(4): P.box('paint_w' if rng.rand() < 0.2 else 'tape', x - 1.7, x + 1.7, y - 0.16, y - 0.15, 0.62 + k * 0.19, 0.7 + k * 0.19)
                for dx in (-1.6, 1.6): P.box('steel', x + dx - 0.02, x + dx + 0.02, y - 0.02, y + 0.02, 0.0, 0.5)
            for (lx, ly) in ((2.4, 9.4), (9.6, 2.6)):                                # the light fittings, all dead
                x, y = at(c, r, lx, ly, 0.2); P.box('white', x - 1.1, x + 1.1, y - 0.1, y + 0.1, 0.1, 0.2); P.box('steel', x - 1.16, x + 1.16, y - 0.15, y + 0.15, 0.0, 0.1)
            x, y = at(c, r, 6.0, 10.6, 0.12); P.drum('paint_w', x, y, 0.0, 0.08, 0.14, 10); P.drum('red', x, y, 0.08, 0.12, 0.06, 8)


TG.CEILINGS['terminal'] = (ceil_terminal, 'terminal/terminal_ceiling.webp', "the long white roof, a rib every bay with its steel flange, a strip of skylight across every bay (its mullions, panes out), the gate numbers hung dead and the departures board every other bay with every row dark, the light fittings dead, smoke heads")
TG.CEIL_DATA['terminal'] = 'terminal/terminal.json'


# ---- the cut (no Blender) ----------------------------------------------------------------------------------------------------
KIND = dict(walkway='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', rail_ew='RAIL', rail_ns='RAIL', wall_ew='WALL', wall_ns='WALL', screen_ew='WALL', screen_ns='WALL', booth='WALL',
            counter='LOW_COVER', queue='LOW_COVER', newsstand='COVER', luggage='COVER', bags='DRESS', trolley_a='LOW_COVER', trolley_b='DRESS', trolley_c='DRESS', seats='LOW_COVER', seats_b='DRESS',
            belt='LOW_COVER', carousel='COVER', camp_a='LOW_COVER', camp_b='LOW_COVER', column='WALL')
HM = dict(walkway=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, rail_ew=1.04, rail_ns=1.04, wall_ew=1.6, wall_ns=1.6, screen_ew=SCR_H, screen_ns=SCR_H, booth=BOOTH_H, counter=1.5, queue=1.0,
          newsstand=2.62, luggage=1.6, bags=0.8, trolley_a=1.02, trolley_b=1.1, trolley_c=0.5, seats=0.92, seats_b=0.92, belt=0.8, carousel=2.9, camp_a=0.92, camp_b=1.06, column=2.8)
NAME = dict(walkway='THE UPPER WALKWAY', stair_e='ITS STAIR, EAST', stair_w='ITS STAIR, WEST', rail_ew='THE GLASS RAIL', rail_ns='THE GLASS RAIL', wall_ew="THE TERMINAL'S WALL", wall_ns="THE TERMINAL'S WALL",
            screen_ew="THE CHECKPOINT'S SCREENS", screen_ns="THE CHECKPOINT'S SCREENS", booth='THE CHECKPOINT', counter='A COUNTER', queue="THE QUEUE'S RAILS", newsstand='A NEWSSTAND',
            luggage='A WALL OF LUGGAGE', bags='BAGS, GONE THROUGH', trolley_a='LUGGAGE TROLLEYS', trolley_b='A TROLLEY, LOADED AND LEFT', trolley_c='A TROLLEY, DOWN', seats='GATE SEATS', seats_b='GATE SEATS',
            belt="THE CAROUSEL'S BELT", carousel='THE CAROUSEL, HEAPED', camp_a="SOMEBODY'S BEDDING", camp_b="SOMEBODY'S BEDDING", column='A COLUMN')
ALSO = dict(bedding_a='camp_a', bedding_b='camp_b')            # the drawn-only second of a camp tile is the other camp's picture


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'tm_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'terminal_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'tm_pieces.png')).convert('RGBA'); A = TM_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'tm_' + key, 'terminal', shadow)
    for key in ('walkway', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 12.0 + hh + (1.7 if key != 'walkway' else 0.3)), 1.0 if key == 'walkway' else 0.0)
        v = sz[key]                                            # the canvas runs down to its foot (the gate's A4)
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'tm_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1])), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 1.9), 0.4)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.5, x + 1.3, y - 0.05, y + 13.6), 0.5)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.35, y + 2.75), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.5, x + 1.6, y - 0.05, y + 14.4), 0.5)
    x, y = A['screen_ew']; one('screen_ew', (x - 6.0, x + 6.0 + 0.01, y - 1.0, y + 0.3 + SCR_H * 1.45), 0.5)
    x, y = A['screen_ns']; one('screen_ns', (x - 0.4, x + 1.6, y - 0.05, y + 12.1 + SCR_H * 1.45), 0.4)
    x, y = A['booth']; one('booth', (x - 5.0, x + 5.2, y - 0.2, y + 6.5 + BOOTH_H * 1.45), 1.0, foot=(x, y))
    x, y = A['carousel']; one('carousel', (x - 4.8, x + 5.4, y + 0.1, y + 8.4 + 3.0 * 1.45), 1.0, foot=(x, y + 0.2))
    x, y = A['belt']; one('belt', (x - 6.0, x + 6.0 + 0.01, y - 0.1, y + 2.3 + 0.9 * 1.45), 1.0)
    x, y = A['counter']; one('counter', (x - 5.9, x + 6.1, y - 0.2, y + 2.4 + 1.6 * 1.45), 1.0)
    x, y = A['queue']; one('queue', (x - 5.0, x + 5.4, y - 0.4, y + 4.3 + 1.1 * 1.45), 0.6)
    x, y = A['seats']; one('seats', (x - 5.8, x + 6.2, y - 0.5, y + 1.6 + 1.3 * 1.45), 1.0)
    x, y = A['seats_b']; one('seats_b', (x - 5.8, x + 6.2, y - 0.1, y + 0.95 + 1.0 * 1.45), 1.0)
    x, y = A['luggage']; one('luggage', (x - 3.5, x + 4.2, y - 0.4, y + 1.2 + 1.7 * 1.45), 1.0)
    x, y = A['bags']; one('bags', (x - 1.4, x + 2.6, y - 1.0, y + 1.1 + 0.9 * 1.45), 1.0)
    x, y = A['newsstand']; one('newsstand', (x - 2.9, x + 4.4, y - 2.0, y + 2.7 + 2.7 * 1.45), 1.0, foot=(x, y - 1.9))
    x, y = A['column']; one('column', (x - 0.8, x + 2.6, y - 0.8, y + 0.7 + 2.9 * 1.45), 0.6, foot=(x, y - 0.1))
    x, y = A['trolley_a']; one('trolley_a', (x - 2.9, x + 3.9, y - 0.1, y + 1.9 + 1.1 * 1.45), 1.0)
    x, y = A['trolley_b']; one('trolley_b', (x - 0.5, x + 1.9, y - 0.05, y + 1.3 + 1.2 * 1.45), 1.0)
    x, y = A['trolley_c']; one('trolley_c', (x - 0.8, x + 1.8, y - 0.3, y + 1.5 + 0.6 * 1.45), 1.0)
    for key in ('camp_a', 'camp_b'):
        x, y = A[key]; one(key, (x - 3.0, x + 3.4, y - 0.2, y + 2.6 + 1.1 * 1.45), 1.0)
    for k, v in sz.items(): v.update(piece=k, src='terminal/tm_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['terminal/terminal_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'tm_' + k: ent(k) for k in sz}
    for a, k in ALSO.items(): kit['tm_' + a] = dict(ent(k), kind='DRESS')
    art = {
        'version': 'cook5-terminal-art-11-18', 'lane': 'cook 5', 'stage': 'finished',
        'for': "COMBAT THREE's airport terminal (slices/fight_ground/terminal/terminal.json, BUILD 11/18g): the names its handoff asked for, the garage's format. floor.floor is the terrazzo (rows 0 to 3 of the sheet: two-metre panels, the wayfinding arrows inlaid, the lines trolley wheels left), floor.high its row 4 with no marks (under the walkway's own picture, which carries the carpet), floor.ring every tile. Any tile meets any tile.",
        'floor': {'floor': cells((0, 1, 2, 3)), 'high': cells((4,)), 'ring': cells((0, 1, 2, 3, 4))},
        'kit': kit,
        'how_it_lays': {
            'the checkpoint': "tm_booth is the piece of a checkpoint tile, 10 m wide and 6.5 m deep, 2.3 m up, foot its south edge middle (laid at (0.5, 0.98) it sits inside the tile between the two screens). tm_screen_ns is a glass screen a tile deep, foot its south end middle; tm_screen_ew the same a tile wide, foot its south base middle.",
            'the carousels': "tm_belt is a strip of belt a tile wide and 2.2 m deep, 0.45 m up, the same at both ends so belt tiles meet; foot its south edge middle. tm_carousel is the island and its heap, 9.2 m wide and 8 m deep, 2.9 m up; foot its south edge middle.",
            'the floor things': "tm_counter is five desks a tile wide; tm_queue the maze 10 m by 4; tm_seats three banks back to back a tile wide, tm_seats_b the single row; tm_luggage a wall of cases 5.4 m wide and 1.6 m up, tm_bags the heap beside it; tm_trolley_a a nested row and two loose, _b one loaded, _c one down; tm_newsstand 5.2 m wide, its shutter lying 1.9 m south of it; tm_camp_a / _b (tm_bedding_a / _b are the same two pictures): foot each at its south edge middle",
            'the column': 'tm_column is round, 1.1 m across, cut at 2.8 m; foot its base middle',
            'the walkway': "tm_walkway on every high tile, foot at the tile's south edge middle; 1.42 m up; its carpet's bands repeat every 2 m so deck tiles meet. tm_stair_e climbs to the east, tm_stair_w to the west (the fort's stair). tm_rail_ew / tm_rail_ns on its open edges (the hall's glass rail).",
            'the outer wall': 'tm_wall_ew / tm_wall_ns: white panels with the wayfinding band, cut at 1.6 m, a tile long',
        },
        'bytes': bytes_,
    }
    TG.keep_ceiling(art, os.path.join(SHIP, 'terminal_art.json'))
    cp = os.path.join(REND, 'ceil_terminal.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'terminal_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'terminal/terminal.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "terminal/terminal_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):      # (the one agreed edit in COMBAT THREE's file: its ceiling entry's "have" and "tile")
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='terminal/terminal_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['terminal'][2],
                              contract="terminal.json 'ceiling' (COMBAT THREE's: the fight draws it over the board at that alpha, rule 451(a))")
    json.dump(art, open(os.path.join(SHIP, 'terminal_art.json'), 'w'), indent=1)
    print('terminal: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


def sheet(before_dir, page_dir):
    """records/target/COOK5_THE_TERMINAL_11_18.webp: what the VOTE card shows. The phone shots are the game's own fight page
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
    title('THE AIRPORT TERMINAL, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'terminal_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'terminal_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'terminal_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the checkpoint, the desks and the queue, the gate')
    strip([(lab, up(os.path.join(page_dir, 'terminal_upright_%s.png' % n))) for lab, n in (('THE CHECKPOINT', 'checkpoint_close'), ('THE DESKS, THE QUEUE', 'desks_close'), ('A GATE', 'gate_close'))], cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the checkpoint, the carousel heaped, its belt, the desks, the seats, the luggage, the trolleys, somebody who never got a flight out')
    def piece(k, bg=(150, 150, 146)):
        im = Image.open(os.path.join(SHIP, 'tm_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('booth', 'carousel'), 340); row_of(('counter', 'belt'), 150); row_of(('seats', 'queue'), 150); row_of(('luggage', 'bags', 'trolley_a', 'trolley_b', 'newsstand'), 200); row_of(('camp_a', 'camp_b', 'column', 'screen_ew'), 170)
    title('A TILE OF THE FLOOR, AND THE CEILING AT FULL STRENGTH', 'terrazzo, a wayfinding arrow, wheel lines; the white roof, its ribs, a skylight with panes out, the dead signs')
    fl = Image.open(os.path.join(SHIP, 'terminal_floor_0.webp')).convert('RGB').crop((0, 0, TW * 2, TH * 2)); ce = Image.open(os.path.join(SHIP, 'terminal_ceiling.webp')).convert('RGB'); bw, bh = ce.width // 5, ce.height // 5
    ce = ce.crop((bw * 2, bh, bw * 4, bh * 3)); cw2 = (WID - 10) // 2; hh2 = int(TH * cw2 / TW); r = Image.new('RGB', (WID, hh2), BG); r.paste(fl.resize((cw2, hh2), Image.LANCZOS), (0, 0)); r.paste(ce.resize((cw2, hh2), Image.LANCZOS), (cw2 + 10, 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK5_THE_TERMINAL_11_18.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook5-the-terminal-11-18.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        quick = '--quick' in a
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, quick) if n == 'tm_floor' else TG.scene_pieces(n, quick) if n == 'tm_pieces' else TG.scene_ceiling('terminal', quick)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cal': TG.scene_cal(True); TG.calibrate()
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
