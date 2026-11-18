#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the data fort, finished] (11/18/26; the coordinator's routine 'COOK FIVE next', VAMILY rules 453, 441,
416, 451(a), 455: 'take the next jobs on your own list, one build each: finished art wherever a card still says STAND-IN').

COMBAT THREE's seventh inside (BUILD 11/17zo - THE DATA FORT, slices/fight_ground/datafort/datafort.json, laid by
slices/bohemia_big_inside.js): one hall's white space, THE ONE PLACE WITH POWER: server rows whose lights never go out, hot
aisles one man wide, floor tiles pulled up, the control room's gallery. EVERY PICTURE OF IT WAS A STAND-IN ('the pods read as
grey slabs until COOK FIVE's long-side cabinets are in'). Its handoff names what it wants; these are the pictures, through the
master rig, ON this lane's warehouse, mall and hall tools and the tunnels-and-garage tool under them (all imported):

  THE FLOOR        datafort_floor_0.webp, five tiles by five (any tile meets any tile): the raised white floor in 0.6 m lift-out
                   tiles, a perforated one here and there, some yellowed, scuffed where the lifts ran; row 4 with no marks.
  THE PIECES       (datafort_art.json's kit, COMBAT THREE's names)
    df_servers_ns  A ROW OF CABINETS SEEN FROM ITS LONG SIDE, a tile deep (the one that matters): twenty cabinets' tops, a
                   status light on each one's edge (most still on: pale, a few amber, one red), the cable tray down the row
                   on its stanchions, one cabinet gone (its cables left hanging), one door swung out
    df_servers_block  (MADE, NOT IN THE FOLDER: COMBAT THREE's data does not lay it yet, and a folder the game loads from holds
                   only what the game loads) what fills a server tile between its two edge rows: two more rows and three
                   roofed aisles (a row is 1.2 m on a 12 m tile: two edge rows leave 10 m of white floor between them).
                   'cut --block' puts it in the folder and the art file the round its legend line is in.
    df_servers_ew  THE ROW'S END, a tile wide: the two rows' end cabinets, the containment's panels between them, its door
                   and dark window, HOT AISLE on a plate, the light bar over the door still on
    df_crates      spare cabinets still crated, one crate opened and the cabinet inside still in its wrap; df_crates_b two
                   more, one on its side
    df_floor_up    floor tiles pulled up and stacked by the hole: the dark under the floor, its pedestals, the cables drawn out
    df_crac        a cooling unit the size of a truck: its louvres, its panel still lit, its pipes; df_batteries the battery
                   strings on their racks, a jar gone and what it leaked; df_desk the operators' desk, one screen still on
    df_gate        a cage's mesh a tile wide, its gate open, the chain cut
    df_gallery     a tile of the control room's gallery (carpet tile, a light line on its edge); df_stair_e/w its stair;
                   df_rail_ew/ns the glass rail; df_wall_ew/ns the outer wall, windowless concrete
  THE CEILING      datafort_ceiling.webp (rule 451(a), over the fight at 10%): the slab, ladder trays of cable over every row,
                   the bus duct and its tap boxes, conduit, strip lights nearly all still on, red smoke heads.

  <venv>/bin/python tools/bohemia_cook5_the_data_fort_finished_11_18_26.py cal
  <venv>/bin/python tools/bohemia_cook5_the_data_fort_finished_11_18_26.py render df_floor | df_pieces | ceil_datafort [--quick]
  python3 tools/bohemia_cook5_the_data_fort_finished_11_18_26.py cut
  python3 tools/bohemia_cook5_the_data_fort_finished_11_18_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a colocation hall's white space (a
raised floor of 600 mm lift-out tiles with perforated tiles in the cold aisles; rows of black cabinets in pairs with a
contained hot aisle between and a door at the pod's end; ladder trays of cable and bus ducts with tap boxes overhead; CRAC
units along the wall; a battery room's strings of jars on steel racks; a tenant's wire cage; spare cabinets in their crates).
The twins: the warehouse's kit and the mall's (the card shows the fort before and now).
REUSE CHECK (REUSE-FIRST): this lane's warehouse tool, mall tool (its materials), hall tool (its glass rail, its helpers) and
the tunnels-and-garage tool (rig, grounds, plans, Parts, cutter, pieces scene, ceiling scene, calibration): imported. New
here only the fort's own plan, parts and ceiling.
ANALOG HORROR: a hall where every light is still on and nobody is at the desk; one cabinet taken out of a row, its cables
left hanging; one screen still showing.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_warehouse_finished_11_17_26 as WT      # this lane's: the warehouse's tool, the mall's, the hall's and TG through it

MT = WT.MT; HT = MT.HT; TG = HT.TG; FW = TG.FW
W, H, PPM, PYM, SIDE, TM, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'datafort')
rect = HT.rect

# ---- the ground ------------------------------------------------------------------------------------------------------------
TG.GROUNDS['df_floor'] = dict(role=('tape_grey', 4), target=(192, 192, 186), h=0.0, alt=('tape_grey', 3), alt_amt=0.12, grit=0.04, speck=(40, 0.06),
                              joints=dict(pitch=0.6, width=0.014), panel_var=0.05)
TG.CAL0['df_floor'] = 0.9
TG.WEAR['df_floor'] = 0.14


def plan_df_floor(ID, seed=101):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['df_floor'], np.uint8)
    pale = np.full((H, W), 0.03, np.float32); dark = np.zeros((H, W), np.float32)
    cx = np.clip((xm / 0.6).astype(int), 0, 99); cy = np.clip((ty / 0.6).astype(int), 0, 99)       # the lift-out tiles: 100 by 100 of them on the sheet
    inner = ((cx % 20) > 0) & ((cx % 20) < 19) & ((cy % 20) > 0) & ((cy % 20) < 19) & (row < 4)    # nothing differs on a fight tile's own edge (any tile meets any tile)
    u = rng.rand(100, 100)
    perf = (u[cy, cx] < 0.05) & inner                           # a perforated tile here and there: holes on a 0.1 m pitch
    dots = ((xm % 0.1) < 0.05) & ((ty % 0.1) < 0.05) & ((xm % 0.6) > 0.06) & ((xm % 0.6) < 0.54) & ((ty % 0.6) > 0.06) & ((ty % 0.6) < 0.54)
    dark = np.maximum(dark, (perf & dots) * 0.62)
    old = ((u[cy, cx] > 0.9) & inner)                           # some yellowed with the years (a shade under the rest)
    dark = np.maximum(dark, old * 0.07)
    gone = (u[cy, cx] > 0.05) & (u[cy, cx] < 0.058) & inner      # a corner chipped off one
    dark = np.maximum(dark, (gone & ((xm % 0.6) + (ty % 0.6) < 0.2)) * 0.5)
    for r in range(4):                                         # scuffed where the server lifts ran: short dark streaks, inside a tile
        for c in range(5):
            for _ in range(int(rng.randint(3, 7))):
                x0, y0 = c * TM + rng.uniform(1.2, 10.8), r * TM + rng.uniform(1.2, 10.8); a = rng.uniform(0, math.pi); L = rng.uniform(0.5, 1.6)
                x1, y1 = np.clip(x0 + math.cos(a) * L, c * TM + 0.8, c * TM + 11.2), np.clip(y0 + math.sin(a) * L, r * TM + 0.8, r * TM + 11.2)
                ya, yb = int(max(0, (min(y0, y1) - 0.2) * PYM)), int(min(H, (max(y0, y1) + 0.2) * PYM)); xa, xb = int(max(0, (min(x0, x1) - 0.2) * PPM)), int(min(W, (max(x0, x1) + 0.2) * PPM))
                X, Y = xm[ya:yb, xa:xb], ty[ya:yb, xa:xb]; dx, dy = x1 - x0, y1 - y0; t = np.clip(((X - x0) * dx + (Y - y0) * dy) / max(dx * dx + dy * dy, 1e-6), 0, 1)
                dd = np.hypot(X - (x0 + t * dx), Y - (y0 + t * dy)); dark[ya:yb, xa:xb] = np.maximum(dark[ya:yb, xa:xb], np.clip(1 - dd / 0.035, 0, 1) * rng.uniform(0.25, 0.5))
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['df_floor'] = plan_df_floor


def df_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0, 60), r_.uniform(0, 60)), 26)   # little lies about: it was kept clean


TG.GARAGE_THINGS['df_floor'] = df_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
DF_AT = dict(gallery=(10.0, 45.0), stair_e=(26.0, 45.0), stair_w=(42.0, 45.0), rail_ew=(10.0, 40.5), wall_ew=(26.0, 39.5), servers_ew=(42.0, 37.5),
             rail_ns=(52.0, 4.0), wall_ns=(55.0, 4.0), servers_ns=(57.3, 20.0),
             crac=(5.5, 27.5), batteries=(17.5, 28.5), desk=(29.5, 28.5), gate=(42.0, 29.0),
             crates=(4.5, 18.0), crates_b=(12.5, 18.0), floor_up=(21.0, 18.0), servers_block=(38.0, 2.5))
CAB_H, END_H, GATE_H = 2.2, 2.0, 2.4
NS_CAST = 0.3                                                 # the long-side row's cast shadow, a share of the render's


def cab_row(P, ox, oy, rng, gap=None, door=None):
    """a row of twenty cabinets, its length running north from oy: bodies, tops and vents, a status light on each edge of
    each top (most still on), the cable tray down the row on its stanchions, its south end panel"""
    for i in range(20):
        y = oy + i * 0.6
        if i == gap:                                           # rule 20: one taken out of the row, its cables left hanging
            P.box('under', ox - 0.6, ox + 0.6, y, y + 0.6, 0.0, 0.03)
            for k in range(5): P.bar(('cable_b', 'cable_y', 'under')[k % 3], (ox - 0.3 + k * 0.15, y + 0.3, 2.45), (ox - 0.4 + k * 0.2, y + 0.2 + 0.05 * k, 0.5 + 0.25 * k), 0.02)
            continue
        P.box('cab', ox - 0.6, ox + 0.6, y + 0.01, y + 0.59, 0.0, CAB_H); P.box('cab_t', ox - 0.52, ox + 0.52, y + 0.05, y + 0.55, CAB_H, CAB_H + 0.012)
        P.box('under', ox - 0.3, ox + 0.3, y + 0.16, y + 0.44, CAB_H + 0.012, CAB_H + 0.018)                    # its top vent
        for sx in (-1, 1):
            u = rng.rand(); m = 'led' if u < 0.72 else 'lit' if u < 0.86 else 'red' if u < 0.9 else None
            if m: P.box(m, ox + sx * 0.54 - 0.06, ox + sx * 0.54 + 0.06, y + 0.17, y + 0.43, CAB_H, CAB_H + 0.08)
        if i == door: P.box('cab', ox + 0.6, ox + 1.12, y + 0.55, y + 0.59, 0.06, CAB_H - 0.05); P.box('led', ox + 0.52, ox + 0.6, y + 0.1, y + 0.5, 0.3, 1.9)   # a door swung out, the light of what is inside
    for i in range(7):
        y = oy + 0.3 + i * 1.9
        for dx in (-0.28, 0.28): P.box('steel', ox + dx - 0.02, ox + dx + 0.02, y, y + 0.04, CAB_H, 2.5)
    for dx in (-0.3, 0.3): P.box('tray', ox + dx - 0.02, ox + dx + 0.02, oy, oy + 12, 2.5, 2.58)
    for k in range(20): P.box('tray', ox - 0.3, ox + 0.3, oy + 0.3 + k * 0.6, oy + 0.34 + k * 0.6, 2.5, 2.52)
    for k, (dx, m) in enumerate(((-0.2, 'cable_b'), (-0.08, 'cable_y'), (0.04, 'under'), (0.16, 'cable_b'))): P.box(m, ox + dx - 0.045, ox + dx + 0.045, oy, oy + 12, 2.52, 2.585 + 0.004 * k)
    P.box('panel', ox - 0.6, ox + 0.6, oy - 0.02, oy, 0.0, CAB_H)                                              # the row's south end: its end panel, the row's plate, two lights
    P.box('under', ox - 0.3, ox + 0.3, oy - 0.026, oy - 0.02, 1.45, 1.75); P.box('led', ox + 0.36, ox + 0.46, oy - 0.03, oy - 0.02, 1.9, 2.0); P.box('lit', ox + 0.2, ox + 0.3, oy - 0.03, oy - 0.02, 1.9, 2.0)


def servers_ns(P, ox, oy, rng):
    """a row of twenty cabinets seen from its long side, a tile deep (its length runs north): what the map's eye has of it is
    their tops, the lights on their edges, the tray down the row, and the row's south end"""
    cab_row(P, ox, oy, rng, gap=13, door=6)


def servers_block(P, ox, oy, rng):
    """WHAT FILLS A SERVER TILE BETWEEN ITS TWO EDGE ROWS (made; not in COMBAT THREE's data yet, so not in the folder): two more
    rows and the three contained aisles under their roof panels. The module lays df_servers_ns with its middle 0.36 m in from
    each long edge of the tile (so the edge rows take 0.96 m each side); this is the 10.08 m between them, so a server tile
    reads as one mass, never two thin rows with white floor between"""
    for k, dx in enumerate((-1.88, 1.88)): cab_row(P, ox + dx, oy, rng, gap=(8, None)[k])
    for k, (x0, x1) in enumerate(((-5.04, -2.48), (-1.28, 1.28), (2.48, 5.04))):
        for i in range(10):                                    # the containment's roof panels; one lifted out of the middle aisle, the aisle dark through it
            y = oy + i * 1.2
            if k == 1 and i == 6: P.box('under', ox + x0 + 0.1, ox + x1 - 0.1, y + 0.1, y + 1.1, 0.0, 0.05); continue
            P.box('panel', ox + x0 + 0.03, ox + x1 - 0.03, y + 0.03, y + 1.17, CAB_H - 0.03, CAB_H + 0.01 + 0.002 * (i % 3)); P.box('glass_d', ox + x0 + 0.3, ox + x1 - 0.3, y + 0.25, y + 0.95, CAB_H + 0.012, CAB_H + 0.016)
        P.box('panel', ox + x0, ox + x1, oy - 0.02, oy + 0.04, 0.0, CAB_H); P.box('steel', ox + x0 + 0.5, ox + x1 - 0.5, oy - 0.03, oy - 0.02, 0.0, CAB_H - 0.15)      # the aisle's end: its door, its dark window
        P.box('glass_d', ox + x0 + 0.7, ox + x1 - 0.7, oy - 0.036, oy - 0.03, 0.95, 1.75)
        for q, m in enumerate(('led', 'lit', 'led')): P.box(m, ox + x0 + 0.75 + q * 0.3, ox + x0 + 0.92 + q * 0.3, oy - 0.04, oy - 0.03, CAB_H - 0.13, CAB_H - 0.05)


def servers_ew(P, ox, oy, rng):
    """the row's end, a tile wide: the two rows' end cabinets, the containment's panels between them, its door"""
    for x0 in (ox - 6, ox + 4.8): P.box('cab', x0, x0 + 1.2, oy, oy + 0.5, 0.0, END_H); P.box('panel', x0 + 0.04, x0 + 1.16, oy - 0.012, oy, 0.05, END_H - 0.05)
    P.box('panel', ox - 4.8, ox + 4.8, oy + 0.1, oy + 0.22, 0.0, END_H)
    for k in range(1, 8): P.box('under', ox - 4.8 + k * 1.2 - 0.008, ox - 4.8 + k * 1.2 + 0.008, oy + 0.094, oy + 0.1, 0.0, END_H)      # the panels' seams
    P.box('steel', ox - 1.0, ox + 1.0, oy + 0.06, oy + 0.1, 0.0, END_H - 0.1); P.box('glass_d', ox - 0.7, ox + 0.7, oy + 0.054, oy + 0.06, 0.95, 1.75)     # the door, its dark window
    P.box('cab_t', ox - 0.012, ox + 0.012, oy + 0.05, oy + 0.06, 0.0, END_H - 0.1); P.box('steel', ox - 4.8, ox + 4.8, oy + 0.08, oy + 0.24, END_H, END_H + 0.05)
    P.box('haz', ox + 1.4, ox + 2.9, oy + 0.09, oy + 0.1, 1.2, 1.55)                                           # HOT AISLE
    for k in range(7): P.box('under', ox + 1.52 + k * 0.19, ox + 1.64 + k * 0.19, oy + 0.084, oy + 0.09, 1.28, 1.47)
    for k, m in enumerate(('led', 'led', 'lit', 'led', 'red')): P.box(m, ox - 0.5 + k * 0.22, ox - 0.36 + k * 0.22, oy + 0.03, oy + 0.06, END_H - 0.09, END_H - 0.01)   # the light bar over the door
    for x0 in (ox - 6, ox + 4.8):
        for k, m in enumerate(('led', 'lit', 'led')): P.box(m, x0 + 0.2 + k * 0.3, x0 + 0.3 + k * 0.3, oy - 0.02, oy - 0.012, 1.85, 1.93)


def crate(P, x, y, w, d, h, rng, mark=True):
    for dx in (0.05, w - 0.2): P.box('wood_d', x + dx, x + dx + 0.15, y, y + d, 0.0, 0.1)
    P.box('wood', x, x + w, y, y + d, 0.1, h)
    for (z0, z1) in ((0.1, 0.24), (h - 0.14, h)): P.box('wood_d', x - 0.015, x + w + 0.015, y - 0.02, y, z0, z1)        # its battens
    for dx in (0.0, w - 0.12): P.box('wood_d', x + dx, x + dx + 0.12, y - 0.02, y, 0.24, h - 0.14)
    if mark:
        P.box('under', x + w * 0.3, x + w * 0.7, y - 0.012, y, h * 0.42, h * 0.52)                               # the stencil
        for k in range(2): P.box('under', x + w * 0.38 + k * w * 0.16, x + w * 0.44 + k * w * 0.16, y - 0.012, y, h * 0.62, h * 0.78)   # THIS WAY UP


def crates(P, ox, oy, rng, b):
    if not b:
        crate(P, ox - 2.4, oy + 0.3, 0.95, 1.3, 2.35, rng); crate(P, ox - 1.3, oy + 0.3, 0.95, 1.3, 2.35, rng)
        # the third one opened: its front on the floor, the cabinet inside still in its wrap
        P.box('wood', ox - 0.2, ox + 0.75, oy + 0.3, oy + 1.6, 0.0, 0.1); P.box('wood', ox - 0.2, ox - 0.16, oy + 0.3, oy + 1.6, 0.1, 2.35); P.box('wood', ox + 0.71, ox + 0.75, oy + 0.3, oy + 1.6, 0.1, 2.35)
        P.box('wood', ox - 0.2, ox + 0.75, oy + 1.56, oy + 1.6, 0.1, 2.35); P.box('wood', ox - 0.2, ox + 0.75, oy + 0.3, oy + 1.6, 2.31, 2.35)
        P.box('jug', ox - 0.08, ox + 0.63, oy + 0.42, oy + 1.5, 0.1, 2.25); P.box('cab', ox - 0.02, ox + 0.57, oy + 0.414, oy + 0.42, 1.1, 1.9)        # the wrap, the black of it through a tear
        P.box('wood', ox + 0.95, ox + 1.9, oy - 0.7, oy + 0.25, 0.0, 0.05)                                         # the crate's front, laid down
        for _ in range(8): x = ox + rng.uniform(-0.4, 2.2); y = oy + rng.uniform(-0.8, 0.2); P.box('white', x, x + 0.25, y, y + 0.18, 0.0, 0.12)        # its foam
        P.box('steel', ox + 2.1, ox + 2.2, oy + 0.4, oy + 0.46, 0.0, 0.9)                                          # a pry bar, stood against it
    else:
        crate(P, ox - 2.2, oy + 0.3, 0.95, 1.3, 2.35, rng)
        crate(P, ox - 0.9, oy + 0.2, 2.35, 1.3, 0.95, rng, mark=False); P.box('under', ox - 0.2, ox + 0.5, oy + 0.188, oy + 0.2, 0.4, 0.6)                # one on its side
        P.box('jug', ox + 1.7, ox + 2.3, oy + 0.3, oy + 1.2, 0.0, 0.5); P.box('white', ox + 1.75, ox + 2.0, oy + 1.25, oy + 1.45, 0.0, 0.12)


def floor_up(P, ox, oy, rng):
    """floor tiles pulled up and stacked by the hole: the dark under the floor, its pedestals and stringers, the cables drawn out"""
    P.box('under', ox - 1.5, ox + 0.3, oy + 0.6, oy + 1.8, 0.0, 0.006)                                           # the hole (three tiles by two)
    for i in range(4):
        P.box('steel', ox - 1.5 + i * 0.6 - 0.015, ox - 1.5 + i * 0.6 + 0.015, oy + 0.6, oy + 1.8, 0.006, 0.014)
    for j in range(3): P.box('steel', ox - 1.5, ox + 0.3, oy + 0.6 + j * 0.6 - 0.015, oy + 0.6 + j * 0.6 + 0.015, 0.014, 0.022)
    for k, m in enumerate(('cable_b', 'cable_y', 'cable_b', 'under')):                                          # the cables under it, one bundle drawn up and out across the floor
        P.bar(m, (ox - 1.45, oy + 0.8 + k * 0.22, 0.01 + 0.002 * k), (ox + 0.25, oy + 0.95 + k * 0.2, 0.01 + 0.002 * k), 0.03)
    P.bar('cable_y', (ox - 0.3, oy + 1.1, 0.02), (ox + 0.5, oy + 0.4, 0.2), 0.03); P.bar('cable_y', (ox + 0.5, oy + 0.4, 0.2), (ox + 1.9, oy + 0.1, 0.03), 0.03)
    for k in range(6):                                         # the six tiles, stacked
        o = rng.uniform(-0.03, 0.03); P.box('panel', ox + 0.7 + o, ox + 1.3 + o, oy + 1.0 + o, oy + 1.6 + o, k * 0.045, k * 0.045 + 0.04)
    P.box('panel', ox + 1.36, ox + 1.4, oy + 0.9, oy + 1.5, 0.0, 0.6)                                            # one stood against the stack
    P.box('steel', ox + 0.9, ox + 1.1, oy + 1.2, oy + 1.26, 0.27, 0.42); P.drum('under', ox + 0.92, oy + 1.23, 0.27, 0.3, 0.06, 8); P.drum('under', ox + 1.08, oy + 1.23, 0.27, 0.3, 0.06, 8)   # the tile lifter, left on it
    P.box('haz', ox - 1.9, ox - 1.75, oy + 0.3, oy + 0.45, 0.0, 0.5)                                             # a cone that was meant to warn somebody
    P.drum('orange', ox - 1.82, oy + 0.37, 0.5, 0.52, 0.02, 6)


def crac(P, ox, oy, rng):
    """a cooling unit the size of a truck (a tile's blocker): its louvres, its panel still lit, the pipes off its top"""
    P.box('steel', ox - 3.05, ox + 3.05, oy - 0.03, oy + 2.25, 0.0, 0.12); P.box('panel', ox - 3.0, ox + 3.0, oy, oy + 2.2, 0.12, 2.4)
    for k in range(13): P.box('under', ox - 2.8, ox - 0.3, oy - 0.012, oy, 0.35 + k * 0.15, 0.42 + k * 0.15)       # the louvres
    for x in (ox - 0.1, ox + 1.4): P.box('under', x - 0.008, x + 0.008, oy - 0.008, oy, 0.12, 2.4)                # its doors' seams
    P.box('under', ox + 1.7, ox + 2.6, oy - 0.012, oy, 1.35, 1.95); P.box('led', ox + 1.82, ox + 2.48, oy - 0.018, oy - 0.012, 1.6, 1.82)   # the panel, its display still lit
    for k, m in enumerate(('led', 'lit', 'red')): P.box(m, ox + 1.85 + k * 0.22, ox + 1.95 + k * 0.22, oy - 0.018, oy - 0.012, 1.42, 1.5)
    P.box('under', ox - 2.6, ox + 0.6, oy + 0.3, oy + 1.9, 2.4, 2.41); P.box('steel', ox - 2.6, ox + 0.6, oy + 1.05, oy + 1.15, 2.41, 2.44)        # the grille on its top
    P.drum('jug', ox + 1.5, oy + 1.2, 2.4, 3.3, 0.2, 12); P.drum('steel', ox + 2.2, oy + 1.2, 2.4, 3.3, 0.14, 12); P.drum('red', ox + 2.75, oy + 0.3, 2.4, 2.56, 0.08, 8)   # its pipes, lagged and bare; the alarm lamp
    P.box('glass_d', ox - 2.2, ox - 1.2, oy - 0.5, oy - 0.05, 0.0, 0.004)                                        # what it dripped


def batteries(P, ox, oy, rng):
    """the battery strings on their racks, a tile wide: two tiers of jars, the bus bar along them, a jar gone and what it leaked"""
    for i in range(5): x = ox - 5.0 + i * 2.5; P.box('steel', x - 0.04, x + 0.04, oy + 0.2, oy + 0.28, 0.0, 1.9); P.box('steel', x - 0.04, x + 0.04, oy + 0.92, oy + 1.0, 0.0, 1.9)
    for z in (0.18, 1.02): P.box('steel', ox - 5.0, ox + 5.0, oy + 0.2, oy + 1.0, z, z + 0.05)
    for t, z in enumerate((0.23, 1.07)):
        for k in range(18):
            x = ox - 4.85 + k * 0.54
            if t == 0 and k == 11:                             # rule 20: one jar gone
                continue
            P.box('jug', x, x + 0.46, oy + 0.32, oy + 0.9, z, z + 0.52); P.box('cab_t', x, x + 0.46, oy + 0.32, oy + 0.9, z + 0.52, z + 0.55)
            P.box('red', x + 0.06, x + 0.14, oy + 0.4, oy + 0.48, z + 0.55, z + 0.61); P.box('under', x + 0.32, x + 0.4, oy + 0.4, oy + 0.48, z + 0.55, z + 0.61)
        P.box('brass', ox - 4.85, ox + 4.85, oy + 0.56, oy + 0.6, z + 0.61, z + 0.63)
    P.box('must', ox + 0.9, ox + 2.0, oy - 0.6, oy + 0.25, 0.0, 0.004)                                           # what it leaked, dried yellow on the white floor
    P.box('panel', ox + 5.1, ox + 5.8, oy + 0.3, oy + 0.7, 0.0, 1.7); P.box('red', ox + 5.38, ox + 5.5, oy + 0.288, oy + 0.3, 1.0, 1.35)      # the disconnect on its plinth, its handle
    P.bar('under', (ox + 5.45, oy + 0.5, 1.7), (ox + 5.45, oy + 0.5, 2.3), 0.04); P.box('haz', ox - 5.0, ox + 5.0, oy + 0.18, oy + 0.2, 0.0, 0.1)


def desk(P, ox, oy, rng):
    """the operators' desk: three screens, one still on"""
    P.box('panel', ox - 3.0, ox + 3.0, oy + 0.6, oy + 1.5, 0.0, 0.72); P.box('cab_t', ox - 3.05, ox + 3.05, oy + 0.5, oy + 1.55, 0.72, 0.76)
    for k in range(3):
        x = ox - 1.9 + k * 1.9
        P.box('under', x - 0.06, x + 0.06, oy + 1.25, oy + 1.33, 0.76, 0.95); P.box('under', x - 0.5, x + 0.5, oy + 1.22, oy + 1.28, 0.92, 1.5)
        P.box('led' if k == 1 else 'glass_d', x - 0.46, x + 0.46, oy + 1.214, oy + 1.22, 0.96, 1.46)             # rule 20: one still showing
        if k == 1:
            for j in range(4): P.box('cab', x - 0.4, x - 0.4 + (0.6, 0.35, 0.7, 0.2)[j], oy + 1.208, oy + 1.214, 1.36 - j * 0.09, 1.39 - j * 0.09)   # four lines on it
        P.box('cab', x - 0.3, x + 0.3, oy + 0.7, oy + 0.9, 0.76, 0.78)                                           # the keyboards
    P.drum('white', ox + 2.5, oy + 0.8, 0.76, 0.87, 0.05, 8); P.box('red', ox - 2.8, ox - 2.5, oy + 0.7, oy + 1.1, 0.76, 0.82)   # a mug, the binder
    P.box('under', ox - 0.9, ox - 0.3, oy - 0.3, oy + 0.3, 0.0, 0.48); P.box('under', ox - 0.9, ox - 0.3, oy - 0.36, oy - 0.3, 0.48, 1.05)        # a chair, pushed back
    P.box('under', ox + 1.3, ox + 1.38, oy - 0.2, oy + 0.4, 0.0, 0.5); P.box('under', ox + 1.3, ox + 2.0, oy - 0.2, oy + 0.4, 0.0, 0.07)          # another, on its side
    P.box('paper', ox + 0.9, ox + 1.2, oy + 0.75, oy + 1.0, 0.76, 0.765)


def mesh(P, a, b, z0=0.1, z1=GATE_H - 0.1, step=0.2):
    """a wire panel between two floor points: its uprights and three wires across"""
    L = math.hypot(b[0] - a[0], b[1] - a[1]); n = max(1, int(L / step))
    for k in range(n + 1): t = k / float(n); x, y = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t; P.bar('steel', (x, y, z0), (x, y, z1), 0.008)
    for z in (z0, (z0 + z1) / 2, z1): P.bar('steel', (a[0], a[1], z), (b[0], b[1], z), 0.011)


def gate(P, ox, oy, rng):
    """a cage's mesh a tile wide, its gate open, the chain cut"""
    for x in (ox - 6, ox - 3.5, ox - 1.0, ox + 1.0, ox + 3.5, ox + 5.92): P.box('steel', x, x + 0.08, oy, oy + 0.08, 0.0, GATE_H)
    mesh(P, (ox - 5.92, oy + 0.04), (ox - 1.0, oy + 0.04)); mesh(P, (ox + 1.08, oy + 0.04), (ox + 5.92, oy + 0.04))
    P.box('steel', ox - 6, ox + 6, oy, oy + 0.08, GATE_H - 0.06, GATE_H)
    mesh(P, (ox - 0.96, oy + 0.1), (ox - 1.6, oy + 1.9))                                                         # the leaf, swung in
    P.bar('steel', (ox + 0.9, oy - 0.02, 1.1), (ox + 0.9, oy - 0.02, 0.5), 0.015); P.box('under', ox + 0.84, ox + 0.96, oy - 0.3, oy - 0.2, 0.0, 0.05)      # the chain, hanging; the lock on the floor
    P.box('paint_w', ox + 2.0, ox + 3.0, oy - 0.012, oy + 0.03, 1.3, 1.8); P.box('red', ox + 2.1, ox + 2.9, oy - 0.018, oy - 0.012, 1.62, 1.74)             # the tenant's plate
    for k in range(3): P.box('under', ox + 2.1, ox + 2.1 + (0.7, 0.5, 0.6)[k], oy - 0.018, oy - 0.012, 1.36 + k * 0.08, 1.4 + k * 0.08)


def gallery(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02); P.box('gcarp', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.02, LEVEL_H)
    for i in range(10):                                        # carpet tile in two greys (the same on every tile's edge, so deck tiles meet)
        for j in range(10): P.box('gcarp_b', ox - 6 + i * 1.2, ox - 6 + i * 1.2 + 0.6, oy + j * 1.2 + (0.6 if i % 2 else 0.0), oy + j * 1.2 + (1.2 if i % 2 else 0.6), LEVEL_H, LEVEL_H + 0.004)
    P.box('panel', ox - 6, ox + 6, oy - 0.006, oy, LEVEL_H - 0.5, LEVEL_H - 0.02); P.box('led', ox - 6, ox + 6, oy - 0.01, oy - 0.006, LEVEL_H - 0.2, LEVEL_H - 0.14)   # the fascia, its light line still on
    P.box('glass_d', ox - 6, ox + 6, oy - 0.006, oy, 0.0, LEVEL_H - 0.5)                                         # the room under it, behind dark glass
    for x in (ox - 6, ox - 2.03, ox + 1.97): P.box('steel', x, x + 0.06, oy - 0.02, oy, 0.0, LEVEL_H - 0.5)
    P.box('steel', ox + 5.94, ox + 6, oy - 0.02, oy, 0.0, LEVEL_H - 0.5)


def dstair(P, ox, oy, sgn):
    n = 12; xl, xh = (ox - 6, ox + 6) if sgn > 0 else (ox + 6, ox - 6)
    for i in range(n):
        xa = ox - 6 + i if sgn > 0 else ox + 6 - i - 1; z = LEVEL_H * (i + 1) / n
        P.box('gcarp', xa, xa + 1, oy + 0.3, oy + 11.7, z - 0.05, z); P.box('panel', xa + (0.9 if sgn > 0 else 0.0), xa + (1.0 if sgn > 0 else 0.1), oy + 0.3, oy + 11.7, 0.0, z - 0.05)
        xe = xa if sgn > 0 else xa + 1 - 0.07
        P.box('steel', xe, xe + 0.07, oy + 0.3, oy + 11.7, z, z + 0.005)
    for yy in (oy, oy + 11.7):
        pr = [(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.25), (xl, 0.25)]
        P.prism_y('panel', yy, yy + 0.3, pr if sgn < 0 else pr[::-1])
        P.bar('steel', (xl, yy + 0.15, 1.0), (xh, yy + 0.15, LEVEL_H + 1.0), 0.03)
        for k in range(7): t = k / 6.0; x = xl + (xh - xl) * t; P.bar('steel', (x, yy + 0.15, LEVEL_H * t + 0.2), (x, yy + 0.15, LEVEL_H * t + 1.0), 0.02)


def dwall_ew(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.25, 0.0, 1.6); P.box('panel', ox - 6, ox + 6, oy - 0.006, oy, 0.0, 1.6)     # windowless concrete, painted white
    for i in range(1, 3): P.box('under', ox - 6 + i * 4.0 - 0.01, ox - 6 + i * 4.0 + 0.01, oy - 0.01, oy - 0.006, 0.0, 1.6)
    for z in (1.15, 1.3): P.tube_x('steel', ox - 6, ox + 6, oy - 0.05, z, 0.025)                                   # conduit
    P.box('steel', ox - 2.2, ox - 1.8, oy - 0.1, oy, 1.0, 1.45); P.box('red', ox + 3.0, ox + 3.2, oy - 0.05, oy, 1.0, 1.2)       # a junction box, a call point
    P.box('under', ox + 0.5, ox + 0.7, oy - 0.03, oy, 1.0, 1.25); P.box('led', ox + 0.56, ox + 0.64, oy - 0.036, oy - 0.03, 1.17, 1.22)   # a card reader, its light on


def dwall_ns(P, ox, oy, rng):
    P.box('conc', ox - 0.125, ox + 0.125, oy, oy + 12, 0.0, 1.6); P.box('panel', ox - 0.131, ox + 0.131, oy - 0.006, oy, 0.0, 1.6)


def df_parts(P, rng):
    A = DF_AT
    gallery(P, *A['gallery'], rng); dstair(P, *A['stair_e'], 1); dstair(P, *A['stair_w'], -1)
    HT.rail_ew(P, *A['rail_ew'], rng); HT.rail_ns(P, *A['rail_ns'], rng); dwall_ew(P, *A['wall_ew'], rng); dwall_ns(P, *A['wall_ns'], rng)
    servers_ew(P, *A['servers_ew'], rng); servers_ns(P, *A['servers_ns'], rng)
    crac(P, *A['crac'], rng); batteries(P, *A['batteries'], rng); desk(P, *A['desk'], rng); gate(P, *A['gate'], rng)
    crates(P, *A['crates'], rng, False); crates(P, *A['crates_b'], rng, True); floor_up(P, *A['floor_up'], rng); servers_block(P, *A['servers_block'], rng)


def df_mats(bpy, NF, F, M, which):
    if which not in ('df_pieces', 'tun_pieces'): return         # ('tun_pieces' is what the ceiling's scene asks its materials by)
    if which == 'df_pieces': WT.wh_mats(bpy, NF, F, M, 'wh_pieces')            # the warehouse's and the mall's own (the dark, the dead glass, the hazard yellow)
    M.update(cab=NF.material(bpy, 'in_stall_cabinet', 'tape_grey', 0, 0.78), cab_t=NF.material(bpy, 'in_stall_cabinet_top', 'tape_grey', 1, 0.75),
             led=NF.material(bpy, 'in_lit_led', 'clay_teal', 4, 1.15), panel=NF.material(bpy, 'in_paint_panel_white', 'tape_grey', 4, 0.92),
             gcarp=NF.material(bpy, 'in_cloth_carpet_tile', 'metal_painted', 1, 0.9), gcarp_b=NF.material(bpy, 'in_cloth_carpet_tile_b', 'metal_painted', 2, 0.8),
             tray=NF.material(bpy, 'in_stall_tray', 'tape_grey', 2, 0.8), cable_b=NF.material(bpy, 'in_cable_blue', 'clay_teal', 2, 1.1),
             cable_y=NF.material(bpy, 'in_cable_yellow', 'clay_mustard', 3, 0.95))


TG.PARTS['df_pieces'] = df_parts
TG.MAT_HOOKS.append(df_mats)


# ---- the ceiling (rule 451(a)) ----------------------------------------------------------------------------------------------
def ceil_datafort(P, rng):
    at, band_y = TG.at, TG.band_y
    P.box('slab', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                    # the slab
    zc = [0.0]
    for c in range(-1, 6):                                     # ladder trays of cable over every row, north to south: two a bay
        for lx in (3.0, 9.0):
            x = c * TM + lx
            for dx in (-0.32, 0.32): P.box('tray', x + dx - 0.025, x + dx + 0.025, -3.0, 63.0, 0.6, 0.7)
            for k in range(-5, 106): P.box('tray', x - 0.32, x + 0.32, k * 0.6 - 0.02, k * 0.6 + 0.02, 0.6, 0.63)
            for k, (dx, m) in enumerate(((-0.22, 'cable_b'), (-0.1, 'cable_y'), (0.02, 'black'), (0.14, 'cable_b'), (0.24, 'cable_y'))):
                zc[0] += 0.0015; P.box(m, x + dx - 0.05, x + dx + 0.05, -3.0, 63.0, 0.7, 0.76 + zc[0] % 0.03)
    for r in range(-1, 6):                                     # the bus duct, east to west: one a bay, a tap box over every row; conduit beside it
        y0, y1 = band_y(r, 6.0, 0.42, 1.1); P.box('beam', -3.0, 63.0, y0, y1, 0.85, 1.1)
        for c in range(5):
            for lx in (3.0, 9.0): x = c * TM + lx; P.box('paint_w', x - 0.3, x + 0.3, y0 - 0.12, y1 + 0.12, 1.1, 1.3); P.box('red', x - 0.06, x + 0.06, (y0 + y1) / 2 - 0.06, (y0 + y1) / 2 + 0.06, 1.3, 1.33)
        for ly in (1.4, 10.6): ya, yb = band_y(r, ly, 0.1, 0.3); P.box('steel', -3.0, 63.0, ya, yb, 0.2, 0.3)
    for r in range(5):
        for c in range(5):
            for (lx, ly) in ((6.0, 3.0), (6.0, 9.0), (0.9, 3.0), (11.1, 9.0)):     # strip lights, nearly all still on
                x, y = at(c, r, lx, ly, 0.4); on = rng.rand() > 0.14; L = 1.5 if lx == 6.0 else 0.7
                P.box('lit' if on else 'white', x - L, x + L, y - 0.11, y + 0.11, 0.3, 0.4); P.box('paint_w', x - L - 0.05, x + L + 0.05, y - 0.16, y + 0.16, 0.0, 0.3)
            for (lx, ly) in ((1.6, 7.6), (10.4, 4.4)):                               # red smoke heads
                x, y = at(c, r, lx, ly, 0.12); P.drum('paint_w', x, y, 0.0, 0.08, 0.14, 10); P.drum('red', x, y, 0.08, 0.12, 0.06, 8)


TG.CEILINGS['datafort'] = (ceil_datafort, 'datafort/datafort_ceiling.webp', "the slab, ladder trays of cable over every row (two a bay, north to south), the bus duct across every bay and its tap boxes, conduit, strip lights nearly all still on, red smoke heads")
TG.CEIL_DATA['datafort'] = 'datafort/datafort.json'


# ---- the cut (no Blender) ----------------------------------------------------------------------------------------------------
KIND = dict(gallery='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', rail_ew='RAIL', rail_ns='RAIL', wall_ew='WALL', wall_ns='WALL', servers_ew='WALL', servers_ns='WALL', crac='WALL',
            batteries='COVER', desk='LOW_COVER', gate='DRESS', crates='COVER', crates_b='DRESS', floor_up='LOW_COVER', servers_block='WALL')
HM = dict(gallery=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, rail_ew=1.04, rail_ns=1.04, wall_ew=1.6, wall_ns=1.6, servers_ew=END_H, servers_ns=CAB_H, crac=2.4, batteries=1.9, desk=1.5,
          gate=GATE_H, crates=2.35, crates_b=2.35, floor_up=0.6, servers_block=CAB_H)
NAME = dict(gallery="THE CONTROL ROOM'S GALLERY", stair_e='ITS STAIR, EAST', stair_w='ITS STAIR, WEST', rail_ew='THE GLASS RAIL', rail_ns='THE GLASS RAIL', wall_ew='THE OUTER WALL',
            wall_ns='THE OUTER WALL', servers_ew="A SERVER ROW'S END", servers_ns='A ROW OF SERVERS', crac='A COOLING UNIT', batteries='THE BATTERY STRINGS', desk="THE OPERATORS' DESK",
            gate="A CAGE'S GATE, CUT OPEN", crates='CABINETS STILL CRATED', crates_b='CABINETS STILL CRATED', floor_up='THE FLOOR, PULLED UP', servers_block='A BLOCK OF SERVERS')


def cut(block=False):
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'df_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'datafort_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'df_pieces.png')).convert('RGBA'); A = DF_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'df_' + key, 'datafort', shadow)
    for key in ('gallery', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 12.0 + hh + (1.7 if key != 'gallery' else 0.3)), 1.0 if key == 'gallery' else 0.0)
        v = sz[key]                                            # the canvas runs down to its foot (the gate's A4)
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'df_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1])), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 1.9), 0.4)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.5, x + 1.3, y - 0.05, y + 13.6), 0.5)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.12, y + 2.75), 0.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.5, x + 1.6, y - 0.05, y + 14.4), 0.5)
    x, y = A['servers_ew']; one('servers_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.1, y + 0.6 + END_H * 1.45), 1.0)       # 1.0: a cabinet's dark is the picture's, never the ground's shadow
    x, y = A['servers_ns']; one('servers_ns', (x - 0.8, x + 2.6, y - 0.1, y + 12.1 + 2.7 * 1.45), 1.0)
    # 11/18, the block laid: the row's CAST shadow at three tenths (it fell across the block's first roof, and a cabinet's top and
    # that roof are one height), its own blacks whole. The cutter reads any black as shadow; here a shadow is black AND not solid
    # (the catcher's shadow is 0.8 to 0.9 at its core, measured; a cabinet's dark face is 1.0)
    fn = os.path.join(SHIP, 'df_servers_ns.webp'); q = np.asarray(Image.open(fn).convert('RGBA'), np.float32) / 255.0
    cast = (q[..., :3].max(-1) <= 0.05) & (q[..., 3] < 0.95); q[..., 3] = np.where(cast, q[..., 3] * NS_CAST, q[..., 3])
    Image.fromarray((np.clip(q, 0, 1) * 255).astype(np.uint8), 'RGBA').save(fn, 'WEBP', quality=86, method=6)
    x, y = A['crac']; one('crac', (x - 3.2, x + 5.2, y - 0.6, y + 2.3 + 4.8), 0.7)
    x, y = A['batteries']; one('batteries', (x - 5.2, x + 6.9, y - 0.7, y + 1.1 + 3.4), 0.7)
    x, y = A['desk']; one('desk', (x - 3.2, x + 4.4, y - 0.5, y + 1.6 + 2.2), 0.7)
    x, y = A['gate']; one('gate', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 2.0 + GATE_H * 1.45), 0.6)
    x, y = A['crates']; one('crates', (x - 2.6, x + 4.4, y - 0.9, y + 1.7 + 3.5), 0.7)
    x, y = A['crates_b']; one('crates_b', (x - 2.4, x + 4.4, y - 0.1, y + 1.7 + 3.5), 0.7)
    x, y = A['floor_up']; one('floor_up', (x - 2.1, x + 2.6, y - 0.1, y + 1.9 + 1.0), 0.8)
    x, y = A['servers_block']; bbox = (x - 5.1, x + 5.1, y - 0.1, y + 12.1 + 2.7 * 1.45)
    if block: one('servers_block', bbox, 1.0)                  # only the round COMBAT THREE's legend line lays it
    else: TG.cut_piece(im, A['servers_block'], bbox, 'df_servers_block_made_not_laid', REND, 1.0)       # for the card's sheet: never in a folder the game loads from
    for k, v in sz.items(): v.update(piece=k, src='datafort/df_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['datafort/datafort_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'df_' + k: ent(k) for k in sz}
    art = {
        'version': 'cook5-datafort-art-11-18', 'lane': 'cook 5', 'stage': 'finished',
        'for': "COMBAT THREE's data fort (slices/fight_ground/datafort/datafort.json, BUILD 11/17zo): the names its handoff asked for, the garage's format. floor.floor is the raised white floor (rows 0 to 3 of the sheet: the lift-out tiles, a perforated one here and there, scuffs), floor.high its row 4 with no marks (under the gallery's own picture, which carries the carpet tile), floor.ring every tile (the hall going on past the fight). Any tile meets any tile.",
        'floor': {'floor': cells((0, 1, 2, 3)), 'high': cells((4,)), 'ring': cells((0, 1, 2, 3, 4))},
        'kit': kit,
        'how_it_lays': {
            'a whole tile of servers (MADE, NOT IN THIS FOLDER YET)': "df_servers_block is what fills a server tile between its two edge rows: two more rows and the three contained aisles under their roof panels, 10.08 m wide, a tile deep, 2.2 m up, foot its south base middle. The big inside's own module lays a wall tile's 'piece' at (0.5, 0.98): the one line \"piece\": \"df_servers_block\" on the legend's 'S' and a kit line for the name, and this lane's next cut puts the picture here (tools/bohemia_cook5_the_data_fort_finished_11_18_26.py cut --block). Until then a server tile is its two edge rows with the white floor between them.",
            'the server rows': "df_servers_ns is one row of twenty cabinets 1.2 m wide and a tile deep, 2.2 m up the glass, foot its south end middle: laid on both long edges of a server tile it is the pod's two rows, their lights on their tops' edges (the map's eye is over them: a cabinet's doors face east and west and are never seen, so the lights that say it is on are on its top). df_servers_ew is the pod's end a tile wide, 2 m up, foot its south base middle.",
            'the floor things': "df_crates is 5 m wide (three crates, one opened), df_crates_b two more; df_floor_up is the hole and its stack, 4 m; df_desk 6 m, its screens face south; df_batteries a tile wide, 1.9 m; df_crac 6 m by 2.2 m, 2.4 m up and its pipes: foot each at its south edge middle",
            'the gate': 'df_gate is a tile wide, 2.4 m of mesh with the gate open in its middle 2 m (a man on the tile stands in the gap); foot its south base middle',
            'the gallery': "df_gallery on every high tile, foot at the tile's south edge middle; 1.42 m up; its carpet tiles repeat every 1.2 m so deck tiles meet. df_stair_e climbs to the east, df_stair_w to the west. df_rail_ew / df_rail_ns on its open edges (the hall's glass rail).",
            'the outer wall': 'df_wall_ew / df_wall_ns: windowless concrete painted white, cut at 1.6 m, a tile long',
        },
        'bytes': bytes_,
    }
    TG.keep_ceiling(art, os.path.join(SHIP, 'datafort_art.json'))
    cp = os.path.join(REND, 'ceil_datafort.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'datafort_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'datafort/datafort.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "datafort/datafort_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):      # (COMBAT THREE's file is written only when the entry is not already so)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='datafort/datafort_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['datafort'][2],
                              contract="datafort.json 'ceiling' (COMBAT THREE's: the fight draws it over the board at that alpha, rule 451(a))")
    json.dump(art, open(os.path.join(SHIP, 'datafort_art.json'), 'w'), indent=1)
    print('datafort: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


def sheet(before_dir, page_dir):
    """records/target/COOK5_THE_DATA_FORT_11_18.webp: what the VOTE card shows. The phone shots are the game's own fight page
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
    title('THE DATA FORT, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'datafort_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'datafort_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'datafort_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', "pinched in on his phone: a pod's end and the crates, the gallery, the desk")
    strip([(lab, up(os.path.join(page_dir, 'datafort_upright_%s.png' % n))) for lab, n in (("A POD'S END: TWO THIN ROWS A TILE", 'pod_end_close'), ('THE GALLERY', 'gallery_close'), ('THE DESK', 'desk_close'))], cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', "a row's end, cabinets still crated, the floor pulled up, a cooling unit, the battery strings, the desk, the cage's gate")
    def piece(k, bg=(150, 150, 146)):
        im = Image.open(os.path.join(SHIP, 'df_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('servers_ew', 'gate'), 170); row_of(('crac', 'batteries'), 230); row_of(('crates', 'crates_b', 'floor_up', 'desk'), 230); row_of(('servers_ns', 'gallery', 'stair_e'), 330)
    bp = os.path.join(REND, 'df_servers_block_made_not_laid.webp')
    if os.path.exists(bp):
        title('MADE, NOT IN THE GAME YET: A WHOLE TILE OF SERVERS', "a server tile today is two thin rows with white floor between them; this fills it, and waits on one line of the fight's own data")
        b = Image.open(bp).convert('RGBA'); n = Image.open(os.path.join(SHIP, 'df_servers_ns.webp')).convert('RGBA'); fz = json.load(open(os.path.join(SHIP, 'sizes.json')))['servers_ns']['foot']
        def tile(with_block):
            t = Image.new('RGBA', (TW + 40, b.height + 20), (192, 192, 186, 255)); base = t.height - 10
            if with_block: t.alpha_composite(b, (20 + (TW - b.width) // 2, base - b.height))
            for fx in (0.03, 0.97): t.alpha_composite(n, (int(20 + TW * fx - fz[0]), base - fz[1]))
            return t.convert('RGB')
        r = Image.new('RGB', (WID, b.height + 20 + 26), BG); d = ImageDraw.Draw(r); d.text((4, 4), 'A SERVER TILE TODAY', font=font(14), fill=INK); r.paste(tile(False), (0, 26))
        d.text((TW + 64, 4), 'THE SAME TILE WITH THE PIECE THAT WAITS', font=font(14), fill=INK); r.paste(tile(True), (TW + 60, 26)); rows.append(r)
    title('A TILE OF THE FLOOR, AND THE CEILING AT FULL STRENGTH', 'the lift-out tiles, a perforated one, scuffs; cable trays, the bus duct, strip lights still on, smoke heads')
    fl = Image.open(os.path.join(SHIP, 'datafort_floor_0.webp')).convert('RGB').crop((TW, TH, TW * 2, TH * 2)); ce = Image.open(os.path.join(SHIP, 'datafort_ceiling.webp')).convert('RGB'); bw, bh = ce.width // 5, ce.height // 5
    ce = ce.crop((bw * 2, bh, bw * 4, bh * 3)); cw2 = (WID - 10) // 2; hh2 = int(TH * cw2 / TW); r = Image.new('RGB', (WID, hh2), BG); r.paste(fl.resize((cw2, hh2), Image.LANCZOS), (0, 0)); r.paste(ce.resize((cw2, hh2), Image.LANCZOS), (cw2 + 10, 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK5_THE_DATA_FORT_11_18.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); os.makedirs(os.path.join(R, 'records/target/vote_first'), exist_ok=True)
    f2 = os.path.join(R, 'records/target/vote_first/cook5-the-data-fort-11-18.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        quick = '--quick' in a
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, quick) if n == 'df_floor' else TG.scene_pieces(n, quick) if n == 'df_pieces' else TG.scene_ceiling('datafort', quick)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cal': TG.scene_cal(True); TG.calibrate()
    elif a and a[0] == 'cut': cut('--block' in a)
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_df_floor(ID); pal = np.random.RandomState(5).randint(40, 220, (64, 3)).astype(np.uint8)
        im = pal[gid].astype(np.float32) * (1 - 0.6 * dark[..., None]) + pale[..., None] * 50
        os.makedirs(TG.OUT, exist_ok=True); Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(os.path.join(TG.OUT, 'plan_df_floor.png')); print('plan written')
    else: print(__doc__)
