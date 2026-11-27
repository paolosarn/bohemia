#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the fire station, finished] (11/27/26; COMBAT FOUR's fire station asked 'FOR COOK (SIX)'; VAMILY rule 480(b):
finished art where a stand-in still stands; rule 482; rule 495(b): this tool says only what is its own, the cut and the sheet are the inside
kit's; rules 461, 441, 416, 451(a)).

COMBAT FOUR's fire station (THE FIRE STATION, slices/fight_ground/firehouse/firehouse.json, laid by slices/bohemia_big_inside.js): its apparatus
bay (pumpers on flat tires, turnout gear racked along the walls, hose laid out and never rolled, air bottles, rescue tool cabinets, cones and
flares, workbenches) or its quarters (bunks, the kitchen's counters and range, the long table on its side, the day room's couches, the crew's
lockers). All 14 of its pieces were stand-ins and its roof was drawn by the page. These are the pictures under its names, through the master
rig, ON this lane's library tool (the bank's, the police station's, the truck stop's and the chain under them):

  THE FLOOR        firehouse_floor_0.webp. Rows 0 to 2 (floor.floor, floor.ring): THE BAY'S SEALED CONCRETE, the hall's calibrated slab, a
                   trench drain's grate in every tile's middle, the wheel paths, wash-water
                   tide marks, a squeegee's arcs, oil. Rows 3 and 4 (floor.quarters, for the quarters once its layout names the kind): THE
                   QUARTERS' VINYL (the police station's pd_vct ground).
  THE PIECES       fh_engine (two pumpers on flat tires side by side in their bays, east to west, their compartments, hose beds, ladders, a door
                   rolled up and empty; each E a house of two, so EEE is three pairs nose to tail), fh_gearwall (three rows of turnout gear racks a tile long, coats and
                   helmets still hung, boots below), fh_hose (hose laid out to dry and never rolled), fh_bottles (air bottles on their racks,
                   the cascade fill station), fh_toolbox (the rescue tool cabinet, the spreader on the floor, a stokes basket), fh_cones (cones,
                   flares, a sign stand), fh_bench (a workbench, its vise and pegboard), fh_bunks (steel bunks and their lockers), fh_kitchen
                   (a tile of counters, the range, the fridge, the sink, a galley behind), fh_table (the long kitchen table on its side, its
                   chairs), fh_couches (the day room's couches and recliners, the TV face down), fh_lockers (two rows of crew lockers a tile
                   long), fh_wall_ew/_ns (block painted red to a metre, cream over it).
  THE CEILING      firehouse_ceiling.webp (rule 451(a), 'joist'): the truck stop's steel roof, and over every bay the exhaust hoses hanging from
                   their rail, dead.

  /tmp/v/bin/python tools/bohemia_cook7_the_fire_station_finished_11_27_26.py render fh_floor | fh_bay | fh_quarters | ceil_firehouse
  python3 tools/bohemia_cook7_the_fire_station_finished_11_27_26.py cut | sheet <before_dir> <page_dir>

REFERENCE CHECK: the valley's fire stations (drive-through apparatus bays of sealed concrete with trench drains, Type I pumpers 10 m long with
roll-up compartment doors and a hose bed, turnout gear on open steel racks along the bay wall, SCBA bottles on racks and a cascade fill
station, a rescue tool cabinet with the hydraulic spreader, the exhaust extraction hoses on their rails over each bay; the quarters' bunk
room, a big kitchen with a commercial range and a long table, a day room of recliners). The twins: this lane's truck stop (the roof, the
bay) and police station (the vinyl, the lockers) kits.
ANALOG HORROR: every coat still on its hook and every helmet over it, as if the crew went out on a call and never came back.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook7_inside_kit as KIT                            # this lane's: the cut, the sheet, the ceiling's hand-off, once (rule 495(b))
import bohemia_cook7_the_library_finished_11_27_26 as LB         # this lane's: the library (and the chain under it)

BK = LB.BK; PD = LB.PD; TS = LB.TS; TG = TS.TG; FW = TS.FW; HS = TS.HS
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
BAYR, QUARTERS = (0, 1, 2), (3, 4)
tile_xy = HS.tile_xy
seg_d = TS.seg_d


# ---- the ground: the bay's sealed concrete, the quarters' vinyl ------------------------------------------------------------------
def plan_fh_floor(ID, seed=281):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    bay = row < 3
    gid = np.where(bay, ID['hall_slab'], ID['pd_vct']).astype(np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    dark = np.where(bay, 0.2, 0.09) + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.07; pale = np.zeros((H, W), np.float32)
    drain = bay & (np.abs(ly - 6.0) < 0.15) & (np.abs(lx - 6.0) < 1.8)                                  # a trench drain's grate in every tile's middle, short
    dark[drain] = 0.5 + 0.25 * ((((xm[drain] * 20).astype(int)) % 2)); pale[drain] = 0.0                # (one through every tile read as a half-tile grid line)
    edge = bay & (np.abs(np.abs(ly - 6.0) - 0.17) < 0.025) & (np.abs(lx - 6.0) < 1.85); dark[edge] = 0.35
    for r in range(5):
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]
            Wn = TG.win(X, Y, 0.9, 2.2); nn = FW.vnoise(X.shape, 0.9 * PPM, rng)
            if r in BAYR:
                for y0 in (3.6, 8.4):                                                                       # the wheel paths, inside the tile
                    D[:] += np.clip(1 - np.abs(Y - y0) / 0.45, 0, 1) * (0.1 + 0.1 * nn) * Wn
                for _ in range(rng.randint(1, 3)):                                                          # wash water's tide marks
                    cx, cy = rng.uniform(3, 9), rng.uniform(2.5, 9.5); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.4 * nn); rr = rng.uniform(1.0, 2.2)
                    Pl[:] = np.maximum(Pl, np.clip(1 - np.abs(d0 - rr) / 0.07, 0, 1) * 0.25 * Wn)
                cx, cy = rng.uniform(4, 8), rng.uniform(3, 9)                                                # a squeegee's arcs
                for k in range(4): D[(np.abs(np.hypot(X - cx, Y - cy) - (0.8 + k * 0.3)) < 0.02) & (Wn > 0.5)] += 0.12
                for _ in range(rng.randint(2, 4)):                                                          # oil where an engine stood for years, and its drips
                    cx, cy = rng.uniform(3.0, 9.0), rng.uniform(2.8, 9.2); rx, ry = rng.uniform(0.6, 1.2), rng.uniform(0.35, 0.6)
                    d0 = np.hypot((X - cx) / rx, (Y - cy) / ry) * (0.75 + 0.5 * nn)
                    D[:] = np.maximum(D, np.clip((1 - d0) * 3.0, 0, 1) * 0.5 * Wn)
                    for _k in range(6):
                        ax, ay = rng.normal(0, rx * 0.9), rng.normal(0, ry * 0.9); rad = rng.uniform(0.05, 0.14)
                        D[:] = np.maximum(D, np.clip(1 - np.hypot(X - cx - ax, Y - cy - ay) / rad, 0, 1) * 0.6 * Wn)
            else:
                ang = rng.uniform(0, math.pi); cx, cy = rng.uniform(4.5, 7.5), rng.uniform(4.5, 7.5)       # a path worn grey
                d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang)); D[:] += np.clip(1 - d0 / 1.3, 0, 1) * Wn * (0.06 + 0.05 * nn)
                for _ in range(rng.randint(4, 8)):
                    cx, cy = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5); a = rng.uniform(0, 3.14)
                    D[seg_d(X, Y, cx, cy, cx + 0.2 * math.cos(a), cy + 0.2 * math.sin(a)) < 0.012] = 0.5
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['fh_floor'] = plan_fh_floor


def fh_floor_things(bpy, NF, M, rng):
    inside = lambda r_: (12.0 * r_.randint(5) + r_.uniform(1.4, 10.6), 12.0 * r_.randint(5) + r_.uniform(1.4, 10.6))   # (inside a tile: the library's finding)
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, inside, 60)


TG.GARAGE_THINGS['fh_floor'] = fh_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
BAY_AT = dict(engine=(8.0, 46.0), gearwall=(24.0, 45.0), hose=(40.0, 46.0),
              bottles=(7.0, 28.0), toolbox=(19.0, 28.0), cones=(31.0, 28.0), bench=(43.0, 28.0))
QU_AT = dict(kitchen=(8.0, 46.0), lockers=(24.0, 46.0), wall_ew=(40.0, 46.0), wall_ns=(57.5, 28.0),
             bunks=(7.0, 28.0), table=(19.0, 28.0), couches=(31.0, 28.0))
WALL_H = 3.4


def engine(P, ox, oy, rng):
    """two pumpers side by side in their drive-through bays (a 12 m house holds two), so a block of E is rows of engines; the north one a
    little back"""
    one_engine(P, ox, oy, rng, 2); one_engine(P, ox + 0.3, oy + 5.0, rng, 1)


def one_engine(P, ox, oy, rng, door):
    """a pumper on flat tires, east to west, its nose west: the cab and its glass, the body's roll-up compartment doors (one up and empty),
    the hose bed with the hose still in it, a ladder racked on top, the pump panel's gauges, the light bar dead; sitting low on its rims"""
    x0, x1, y0, y1 = ox - 5.2, ox + 5.2, oy + 0.4, oy + 2.9; zf = 0.25
    P.box('fh_red', x0, x0 + 2.6, y0, y1, zf + 0.6, zf + 2.9); P.box('fh_white', x0 + 0.05, x0 + 2.55, y0 + 0.05, y1 - 0.05, zf + 2.9, zf + 3.0)   # the cab, its white roof
    P.box('glass_d', x0 - 0.01, x0 + 0.02, y0 + 0.2, y1 - 0.2, zf + 1.7, zf + 2.6); P.box('glass_d', x0 + 0.3, x0 + 2.3, y0 - 0.01, y0, zf + 1.8, zf + 2.6)
    P.box('chrome', x0 - 0.25, x0, y0 + 0.1, y1 - 0.1, zf + 0.4, zf + 0.9)                                       # the bumper
    P.box('black', x0 + 0.9, x0 + 1.5, y0 - 0.2, y1 + 0.2, zf + 3.0, zf + 3.15); P.box('pd_lens_r', x0 + 0.95, x0 + 1.45, y0 - 0.18, y1 + 0.18, zf + 3.05, zf + 3.17)   # the light bar, dead
    P.box('fh_red', x0 + 2.6, x1, y0, y1, zf + 0.5, zf + 2.6); P.box('fh_steel', x0 + 2.6, x1, y0 + 0.1, y1 - 0.1, zf + 2.6, zf + 2.7)          # the body
    for k in range(5):                                                                                       # the roll-up compartment doors, one up and empty
        xa = x0 + 3.6 + k * 1.25
        if k == door: P.box('black', xa, xa + 1.1, y0 - 0.005, y0, zf + 0.7, zf + 2.4)
        else:
            P.box('fh_steel', xa, xa + 1.1, y0 - 0.01, y0, zf + 0.7, zf + 2.4)
            for z in np.arange(zf + 0.8, zf + 2.4, 0.12): P.box('fh_steel_d', xa, xa + 1.1, y0 - 0.014, y0 - 0.01, z, z + 0.015)
    P.box('fh_steel', x0 + 2.65, x0 + 3.5, y0 - 0.02, y0, zf + 0.9, zf + 2.3)                                    # the pump panel
    for (u, z) in ((x0 + 2.85, zf + 1.9), (x0 + 3.2, zf + 1.9), (x0 + 2.85, zf + 1.5), (x0 + 3.2, zf + 1.5)): P.drum('white', u, y0 - 0.03, z, z + 0.01, 0.08, 10)
    for k in range(6): P.box(('fh_hosebed', 'fh_hosebed2')[k % 2], x1 - 3.0 + k * 0.48, x1 - 2.6 + k * 0.48, y0 + 0.2, y1 - 0.2, zf + 2.7, zf + 2.95)   # the hose bed
    for y in (y0 + 0.3, y1 - 0.3): P.bar('chrome', (x0 + 2.8, y, zf + 3.0), (x1 - 0.2, y, zf + 3.0), 0.03)       # the ladder racked on top
    for x in np.arange(x0 + 2.9, x1 - 0.2, 0.35): P.bar('chrome', (x, y0 + 0.3, zf + 3.0), (x, y1 - 0.3, zf + 3.0), 0.02)
    for x in (x0 + 1.4, x1 - 1.6):                                                                          # flat tyres, the rims nearly down
        for s in (-1, 1): P.prism_x('black', x - 0.28, x + 0.28, [((y0 + y1) / 2 + s * 1.15 + 0.5 * math.cos(6.2832 * i / 16), 0.4 + 0.42 * math.sin(6.2832 * i / 16)) for i in range(16)])
    for _ in range(3): TG.bloom(P, 'black', ox + rng.uniform(-3, 3), oy + rng.uniform(0.6, 2.6), rng.uniform(0.3, 0.6), rng, 5)


def gear_rack(P, x0, x1, y0, rng):
    """one double-faced run of turnout gear racks: steel open bays every 0.6 m, a coat and trousers on each side, a helmet on top, boots below"""
    h = 2.0; y1 = y0 + 1.0; yc = y0 + 0.5
    P.box('fh_steel_d', x0, x1, yc - 0.02, yc + 0.02, 0.0, h); P.box('fh_steel_d', x0, x1, y0, y1, h - 0.03, h)
    x = x0
    while x <= x1 + 1e-6: P.box('fh_steel_d', max(x0, x - 0.02), min(x1, x + 0.02), y0, y1, 0.0, h); x += 0.6
    x = x0 + 0.05
    while x < x1 - 0.5:
        for (a, b, face) in ((y0 + 0.05, yc - 0.03, -1), (yc + 0.03, y1 - 0.05, 1)):
            if rng.rand() < 0.88:
                P.box('fh_coat', x + 0.05, x + 0.5, a + 0.05, b - 0.05, 0.9, 1.75)                               # the coat
                yy = a if face < 0 else b - 0.01; P.box('fh_stripe', x + 0.05, x + 0.5, yy, yy + 0.01, 1.1, 1.16); P.box('fh_stripe', x + 0.05, x + 0.5, yy, yy + 0.01, 1.45, 1.51)
                P.box('fh_coat', x + 0.1, x + 0.45, a + 0.08, b - 0.08, 0.45, 0.9)                               # the trousers over the boots
                P.box('black', x + 0.1, x + 0.45, a + 0.05, b - 0.05, 0.0, 0.45)                                 # the boots
                P.drum(('fh_helmet', 'black', 'fh_helmet', 'haz')[rng.randint(4)], x + 0.27, (a + b) / 2, h, h + 0.2, 0.17, 12, 0.13)   # the helmet
        x += 0.6


def gearwall(P, ox, oy, rng):
    """turnout gear racked: three double runs a tile long (a run of G is one wall of gear), every coat still on its hook"""
    for j in range(3): gear_rack(P, ox - 6.0, ox + 6.0, oy + 0.4 + j * 2.8, rng)


def hose(P, ox, oy, rng):
    """hose laid out to dry and never rolled: six lines snaking east to west across the tile, flat as they lie, their brass couplings, a
    nozzle; two rolled donuts nobody racked"""
    for k in range(6):
        y = oy - 0.4 + k * 0.62; ph = rng.uniform(0, 6.28); x = ox - 5.7; pts = []
        while x < ox + 5.7: pts.append((x, y + 0.3 * math.sin(x * 0.8 + ph))); x += 0.2
        mat = ('fh_hosebed', 'fh_hosebed2', 'fh_hosebed', 'white', 'fh_hosebed2', 'fh_hosebed')[k]
        for (a, b) in zip(pts, pts[1:]):
            dx, dy = b[0] - a[0], b[1] - a[1]; n = math.hypot(dx, dy); nx, ny = -dy / n * 0.07, dx / n * 0.07
            P.poly(mat, [(a[0] + nx, a[1] + ny), (b[0] + nx, b[1] + ny), (b[0] - nx, b[1] - ny), (a[0] - nx, a[1] - ny)], 0.0, 0.05)
        for xc in (ox - 1.5 + k * 0.3, ox + 3.0 - k * 0.2): yv = y + 0.3 * math.sin(xc * 0.8 + ph); P.box('bk_brass', xc - 0.08, xc + 0.08, yv - 0.09, yv + 0.09, 0.0, 0.1)
    P.bar('chrome', (ox + 5.6, oy - 0.4, 0.05), (ox + 6.0, oy - 0.5, 0.05), 0.05)
    for (dx, dy) in ((-4.6, 3.2), (4.4, 3.4)):
        P.drum('fh_hosebed', ox + dx, oy + dy, 0.0, 0.07, 0.32, 16); P.drum('black', ox + dx, oy + dy, 0.07, 0.072, 0.07, 10)


def bottles(P, ox, oy, rng):
    """air bottles on their racks, empty: three racks of twelve, the cascade fill station's tall cylinders and its cabinet, a bottle cart,
    bottles and air packs on the floor where they were dropped"""
    for dx in (-4.2, -1.8, 0.6):
        x0 = ox + dx; P.box('fh_steel_d', x0, x0 + 2.2, oy + 0.6, oy + 1.2, 0.0, 0.05)
        for (u, v) in ((x0, oy + 0.6), (x0 + 2.15, oy + 0.6), (x0, oy + 1.15), (x0 + 2.15, oy + 1.15)): P.box('fh_steel_d', u, u + 0.05, v, v + 0.05, 0.0, 1.25)
        for z in (0.15, 0.55, 0.95):
            P.box('fh_steel_d', x0, x0 + 2.2, oy + 0.6, oy + 1.2, z - 0.03, z)
            for k in range(4):
                if rng.rand() < 0.8: P.prism_y('fh_bottle', oy + 0.62, oy + 1.18, [(x0 + 0.3 + k * 0.52 + 0.1 * math.cos(6.2832 * i / 10), z + 0.11 + 0.1 * math.sin(6.2832 * i / 10)) for i in range(10)])
    for k, x in enumerate((ox + 3.2, ox + 3.55, ox + 3.9, ox + 4.25)): P.drum('fh_cyl', x, oy + 1.5, 0.0, 1.7, 0.15, 12)          # the cascade
    P.box('fh_steel', ox + 3.0, ox + 4.4, oy + 0.6, oy + 1.15, 0.0, 1.4); P.box('black', ox + 3.1, ox + 4.3, oy + 0.59, oy + 0.6, 0.7, 1.3)
    P.box('fh_steel_d', ox - 1.2, ox + 0.4, oy - 0.9, oy - 0.3, 0.2, 0.25)                                         # a bottle cart, its load half off
    for (u, v) in ((ox - 1.1, oy - 0.8), (ox + 0.3, oy - 0.8), (ox - 1.1, oy - 0.4), (ox + 0.3, oy - 0.4)): P.drum('black', u, v, 0.0, 0.2, 0.08, 8)
    for k in range(3): P.tube_x('fh_bottle', ox - 1.1, ox + 0.3, oy - 0.75 + k * 0.2, 0.35, 0.1, 10)
    for _ in range(9): u, v = ox + rng.uniform(-4.4, 2.6), oy + rng.uniform(-1.4, 0.3); a = rng.uniform(0, 3.14); P.bar('fh_bottle', (u, v, 0.1), (u + 0.6 * math.cos(a), v + 0.6 * math.sin(a), 0.1), 0.1)
    for _ in range(4):                                                                                       # air packs, harness and frame
        u, v = ox + rng.uniform(-4.0, 2.6), oy + rng.uniform(-1.5, 0.2); P.box('black', u, u + 0.35, v, v + 0.6, 0.0, 0.08); P.bar('fh_bottle', (u + 0.17, v + 0.05, 0.16), (u + 0.17, v + 0.6, 0.16), 0.09)


def toolbox(P, ox, oy, rng):
    """the rescue tools: two red cabinets, their drawers out; the hydraulic spreader and cutter and their hoses on the floor, a stokes
    basket, a backboard, a crib of wooden blocks stacked for lifting cars, a power unit"""
    for x0 in (ox - 3.6, ox - 1.4):
        P.box('fh_red', x0, x0 + 2.0, oy + 0.6, oy + 1.3, 0.0, 1.8); P.box('fh_steel', x0, x0 + 2.0, oy + 0.6, oy + 1.3, 1.8, 1.84)
        for k in range(5):
            z = 0.1 + k * 0.33; P.box('chrome', x0 + 0.2, x0 + 1.8, oy + 0.58, oy + 0.6, z + 0.25, z + 0.28)
            if k in (1, 3) or (x0 > ox - 2 and k == 0): P.box('fh_red', x0 + 0.05, x0 + 1.95, oy + 0.1, oy + 0.6, z, z + 0.28); P.box('black', x0 + 0.1, x0 + 1.9, oy + 0.12, oy + 0.58, z + 0.28, z + 0.282)
    P.box('haz', ox + 0.8, ox + 1.6, oy - 0.2, oy + 0.15, 0.0, 0.25); P.bar('haz', (ox + 1.6, oy - 0.02, 0.12), (ox + 2.3, oy - 0.3, 0.1), 0.06)   # the spreader
    P.bar('haz', (ox + 1.6, oy + 0.1, 0.12), (ox + 2.3, oy + 0.35, 0.1), 0.06); P.bar('black', (ox + 0.8, oy, 0.05), (ox - 0.8, oy - 0.6, 0.02), 0.025)
    P.box('haz', ox - 0.4, ox + 0.3, oy - 1.2, oy - 0.85, 0.0, 0.22); P.bar('haz', (ox + 0.3, oy - 1.0, 0.1), (ox + 0.9, oy - 1.3, 0.1), 0.05)   # the cutter
    P.box('fh_red', ox - 2.6, ox - 1.6, oy - 1.4, oy - 0.8, 0.0, 0.6); P.bar('black', (ox - 1.6, oy - 1.1, 0.1), (ox - 0.4, oy - 1.05, 0.05), 0.025)   # the power unit
    P.box('fh_basket', ox + 1.0, ox + 3.2, oy + 0.7, oy + 1.4, 0.0, 0.25); P.box('black', ox + 1.05, ox + 3.15, oy + 0.75, oy + 1.35, 0.05, 0.06)   # a stokes basket
    P.box('haz', ox + 2.4, ox + 4.2, oy - 0.9, oy - 0.45, 0.0, 0.05)                                                # a backboard
    for j in range(5):                                                                                       # the crib, blocks crossed
        z = j * 0.1
        for k in range(4):
            if j % 2: P.box('fh_crib', ox - 5.0 + k * 0.28, ox - 4.85 + k * 0.28, oy - 0.6, oy + 0.4, z, z + 0.1)
            else: P.box('fh_crib', ox - 5.0, ox - 4.0, oy - 0.6 + k * 0.28, oy - 0.45 + k * 0.28, z, z + 0.1)
    for _ in range(8): u, v = ox + rng.uniform(-5.2, -3.6), oy + rng.uniform(-1.4, -0.7); a = rng.uniform(0, 3.14); P.bar('fh_crib', (u, v, 0.05), (u + 0.45 * math.cos(a), v + 0.45 * math.sin(a), 0.05), 0.05)


def cones(P, ox, oy, rng):
    """cones stacked and spilled, road flares out of their box, two sawhorse barricades, a traffic drum rolled, a sign on its stand"""
    for (dx, dy, n) in ((-3.2, 0.6, 5), (-2.6, 0.7, 3), (-0.4, 1.4, 4), (1.4, 0.9, 6), (2.0, 1.5, 4)):
        for k in range(n): P.drum('pd_cone', ox + dx, oy + dy, k * 0.08, 0.7 + k * 0.08, 0.17, 12, 0.03)
        P.box('black', ox + dx - 0.22, ox + dx + 0.22, oy + dy - 0.22, oy + dy + 0.22, 0.0, 0.03)
    for _ in range(9):
        dx, dy, a = rng.uniform(-3.8, 3.6), rng.uniform(-0.9, 0.4), rng.uniform(0, 6.28)
        P.bar('pd_cone', (ox + dx, oy + dy, 0.12), (ox + dx + 0.65 * math.cos(a), oy + dy + 0.65 * math.sin(a), 0.06), 0.08)
    for (dx, dy, a) in ((-1.6, 2.0, 0.0), (2.6, -0.4, 0.3)):                                                    # sawhorse barricades
        cx, cy = ox + dx, oy + dy; ca, sa = math.cos(a), math.sin(a)
        for z in (0.55, 0.85): P.poly(('pd_horse', 'haz')[z > 0.6], [(cx - 1.0 * ca, cy - 1.0 * sa), (cx + 1.0 * ca, cy + 1.0 * sa), (cx + 1.0 * ca - 0.04 * sa, cy + 1.0 * sa + 0.04 * ca), (cx - 1.0 * ca - 0.04 * sa, cy - 1.0 * sa + 0.04 * ca)], z, z + 0.2)
        for s_ in (-0.9, 0.9): P.bar('pd_steel', (cx + s_ * ca, cy + s_ * sa - 0.25, 0.0), (cx + s_ * ca, cy + s_ * sa, 0.9), 0.025); P.bar('pd_steel', (cx + s_ * ca, cy + s_ * sa + 0.25, 0.0), (cx + s_ * ca, cy + s_ * sa, 0.9), 0.025)
    P.tube_x('pd_cone', ox - 4.0, ox - 3.1, oy - 0.5, 0.29, 0.29, 14); P.tube_x('white', ox - 3.8, ox - 3.6, oy - 0.5, 0.295, 0.295, 14)   # a drum rolled
    P.box('card', ox - 0.2, ox + 0.5, oy + 0.8, oy + 1.2, 0.0, 0.3)
    for _ in range(14): u, v = ox + rng.uniform(-1.4, 1.8), oy + rng.uniform(-0.8, 0.8); a = rng.uniform(0, 3.14); P.bar('red', (u, v, 0.02), (u + 0.3 * math.cos(a), v + 0.3 * math.sin(a), 0.02), 0.022)
    P.box('haz', ox + 3.0, ox + 4.0, oy + 1.8, oy + 1.83, 0.6, 1.6); P.bar('fh_steel_d', (ox + 3.5, oy + 1.8, 0.0), (ox + 3.5, oy + 1.8, 0.6), 0.03)


def bench(P, ox, oy, rng):
    """a workbench by the engines: its steel top, a vise, tools out, the pegboard behind with the outlines of tools that are gone; a
    grinder; a steel parts shelf; the compressor's tank; a second bench"""
    P.box('fh_steel_d', ox - 2.0, ox + 2.0, oy + 0.6, oy + 1.4, 0.85, 0.92)
    for (u, v) in ((ox - 1.9, oy + 0.65), (ox + 1.85, oy + 0.65), (ox - 1.9, oy + 1.3), (ox + 1.85, oy + 1.3)): P.box('fh_steel_d', u, u + 0.05, v, v + 0.05, 0.0, 0.85)
    P.box('fh_steel_d', ox - 1.9, ox + 1.9, oy + 0.7, oy + 1.3, 0.15, 0.18)
    P.box('pd_cone', ox - 2.0, ox + 2.0, oy + 1.4, oy + 1.45, 0.92, 2.0)                                          # the pegboard, painted
    for _ in range(14): u, z = ox + rng.uniform(-1.8, 1.6), rng.uniform(1.0, 1.8); P.box('black', u, u + rng.uniform(0.1, 0.3), oy + 1.395, oy + 1.4, z, z + rng.uniform(0.05, 0.2))   # outlines where tools hung
    P.box('chrome', ox + 1.2, ox + 1.5, oy + 0.65, oy + 0.9, 0.92, 1.05)
    for _ in range(6): u, v = ox + rng.uniform(-1.8, 1.0), oy + rng.uniform(0.7, 1.3); a = rng.uniform(0, 3.14); P.bar('chrome', (u, v, 0.93), (u + 0.25 * math.cos(a), v + 0.25 * math.sin(a), 0.93), 0.012)
    P.box('fh_red', ox - 3.4, ox - 2.6, oy + 0.4, oy + 1.2, 0.0, 1.0); P.drum('chrome', ox - 3.0, oy + 0.8, 1.0, 1.2, 0.15, 10)   # a grinder on its stand
    P.box('fh_steel_d', ox + 2.4, ox + 4.4, oy + 0.6, oy + 1.4, 0.0, 0.85); P.box('fh_steel', ox + 2.4, ox + 4.4, oy + 0.6, oy + 1.4, 0.85, 0.9)   # a second bench
    for z in (0.0, 0.5, 1.0, 1.5, 1.95):                                                                     # a parts shelf
        P.box('fh_steel_d', ox - 4.8, ox - 3.6, oy - 0.2, oy + 0.4, z, z + 0.04)
        for _ in range(3): u = ox + rng.uniform(-4.7, -3.9); P.box(('card', 'fh_red', 'pd_steel')[rng.randint(3)], u, u + 0.25, oy - 0.1, oy + 0.3, z + 0.04, z + rng.uniform(0.15, 0.4))
    for (u, v) in ((ox - 4.8, oy - 0.2), (ox - 3.65, oy - 0.2), (ox - 4.8, oy + 0.35), (ox - 3.65, oy + 0.35)): P.box('fh_steel_d', u, u + 0.05, v, v + 0.05, 0.0, 2.0)
    P.tube_x('fh_red', ox - 1.2, ox + 0.4, oy - 0.4, 0.4, 0.3, 14); P.box('black', ox - 1.0, ox - 0.4, oy - 0.6, oy - 0.2, 0.7, 0.95)   # the compressor
    for (u, v) in ((ox - 1.1, oy - 0.65), (ox + 0.3, oy - 0.65), (ox - 1.1, oy - 0.15), (ox + 0.3, oy - 0.15)): P.drum('black', u, v, 0.0, 0.12, 0.06, 8)


def bunks(P, ox, oy, rng):
    """the bunk room: two rows of three steel beds, the mattresses, blankets, a locker at each head, one bed stripped and its mattress on
    the floor"""
    for row, y0 in enumerate((oy + 0.2, oy + 3.4)):
        for k, dx in enumerate((-3.6, -1.2, 1.2)):
            x0 = ox + dx; P.box('pd_steel', x0, x0 + 1.0, y0 + 0.2, y0 + 2.2, 0.38, 0.45)
            for (u, v) in ((x0, y0 + 0.2), (x0 + 0.95, y0 + 0.2), (x0, y0 + 2.15), (x0 + 0.95, y0 + 2.15)): P.box('pd_steel', u, u + 0.05, v, v + 0.05, 0.0, 0.9)
            if (row, k) != (0, 1):
                P.box('pd_mat', x0 + 0.05, x0 + 0.95, y0 + 0.25, y0 + 2.15, 0.45, 0.6); a = rng.uniform(-0.1, 0.1)
                P.poly('pd_blanket', [(x0 + 0.02, y0 + 0.4 + a), (x0 + 1.0, y0 + 0.35), (x0 + 1.02, y0 + 1.3), (x0, y0 + 1.4 - a)], 0.6, 0.66)
            P.box('pd_locker', x0, x0 + 1.0, y0 + 2.3, y0 + 2.8, 0.0, 1.8)
    P.box('pd_mat', ox - 1.4, ox + 0.4, oy - 0.8, oy + 0.0, 0.0, 0.15)
    P.box('fh_cab', ox + 2.8, ox + 3.6, oy + 0.4, oy + 0.9, 0.0, 0.7)


def kitchen(P, ox, oy, rng):
    """the kitchen, a tile of it: a run of counters waist high to the south (a run of k is one kitchen), the commercial range and its hood,
    the fridge standing open, the sink; a galley run behind it; the pots still on the range"""
    y0 = oy + 0.4
    P.box('fh_cab', ox - 6.0, ox + 6.0, y0, y0 + 0.7, 0.0, 0.9); P.box('fh_top', ox - 6.0, ox + 6.0, y0 - 0.03, y0 + 0.72, 0.9, 0.94)
    for k in range(10): x = ox - 6.0 + k * 1.2; P.box('black', x + 0.05, x + 0.07, y0 - 0.005, y0, 0.1, 0.85)
    y1 = y0 + 2.6                                                                                            # the galley behind
    P.box('fh_cab', ox - 6.0, ox + 6.0, y1, y1 + 0.7, 0.0, 0.9); P.box('fh_top', ox - 6.0, ox + 6.0, y1 - 0.03, y1 + 0.72, 0.9, 0.94)
    P.box('pd_steel', ox - 2.0, ox - 0.4, y1 - 0.02, y1 + 0.72, 0.0, 0.96); P.box('black', ox - 1.9, ox - 0.5, y1 + 0.05, y1 + 0.65, 0.96, 0.97)   # the range
    for (u, v) in ((ox - 1.6, y1 + 0.2), (ox - 0.8, y1 + 0.45)): P.drum('pd_steel', u, v, 0.97, 1.2, 0.17, 12)
    P.box('pd_steel', ox - 2.1, ox - 0.3, y1 + 0.1, y1 + 0.8, 1.9, 2.4)                                         # its hood
    P.box('fh_white', ox + 1.5, ox + 2.4, y1 + 0.05, y1 + 0.75, 0.0, 1.9); P.poly('fh_white', [(ox + 1.5, y1), (ox + 1.52, y1 - 0.02), (ox + 1.1, y1 - 0.75), (ox + 1.08, y1 - 0.72)], 0.05, 1.85)   # the fridge, open
    P.box('black', ox + 1.55, ox + 2.35, y1 + 0.04, y1 + 0.05, 0.1, 1.8)
    P.box('pd_steel', ox + 3.2, ox + 4.2, y0 + 0.1, y0 + 0.6, 0.75, 0.94)                                       # the sink
    for _ in range(10): u = ox + rng.uniform(-5.6, 5.4); P.box(('white', 'pd_steel', 'red')[rng.randint(3)], u, u + 0.15, y0 + 0.2, y0 + 0.45, 0.94, 0.94 + rng.uniform(0.05, 0.25))


def table(P, ox, oy, rng):
    """the long kitchen table on its side for cover, 5 m of it, its top to the south; its chairs thrown; a second long table standing,
    plates still on it; the benches"""
    P.box('fh_table', ox - 3.0, ox + 3.0, oy + 0.4, oy + 0.47, 0.0, 1.0)
    for x in (ox - 2.7, ox, ox + 2.7): P.box('fh_cab', x - 0.05, x + 0.05, oy + 0.47, oy + 1.2, 0.0, 0.08); P.box('fh_cab', x - 0.05, x + 0.05, oy + 0.47, oy + 0.55, 0.0, 1.0)
    x0 = ox - 3.2; P.box('fh_table', x0, x0 + 5.6, oy + 2.2, oy + 3.2, 0.74, 0.78)
    for (u, v) in ((x0 + 0.1, oy + 2.3), (x0 + 5.45, oy + 2.3), (x0 + 0.1, oy + 3.05), (x0 + 5.45, oy + 3.05)): P.box('fh_cab', u, u + 0.06, v, v + 0.06, 0.0, 0.74)
    for k in range(7): P.drum('white', x0 + 0.4 + k * 0.8, oy + 2.5, 0.78, 0.8, 0.13, 12); P.drum('white', x0 + 0.4 + k * 0.8, oy + 2.95, 0.78, 0.8, 0.13, 12)
    P.box('fh_table', x0 + 0.2, x0 + 5.4, oy + 3.4, oy + 3.75, 0.42, 0.46)                                        # its bench
    for (dx, dy) in ((-2.0, 1.4), (-0.6, 1.6), (0.8, 1.3), (2.4, 1.5), (3.4, 0.2), (-3.8, 0.6), (3.6, 2.4)):
        x, y = ox + dx, oy + dy; P.box('pd_chair', x, x + 0.45, y, y + 0.9, 0.0, 0.08); P.box('pd_chair', x, x + 0.45, y + 0.4, y + 0.45, 0.08, 0.5)


def couches(P, ox, oy, rng):
    """the day room: three couches and three recliners on a rug, one tipped; the TV face down on the floor, its stand; a coffee table"""
    P.box('fh_rug', ox - 4.0, ox + 3.6, oy - 1.2, oy + 3.0, 0.0, 0.01)
    for (dx, dy) in ((-3.6, 2.0), (-1.2, 2.0), (1.2, 2.0)):
        x0 = ox + dx; P.box('fh_couch', x0, x0 + 2.2, oy + dy, oy + dy + 0.9, 0.0, 0.45); P.box('fh_couch', x0, x0 + 2.2, oy + dy + 0.7, oy + dy + 0.9, 0.45, 0.9)
        for x in (x0, x0 + 2.0): P.box('fh_couch', x, x + 0.2, oy + dy, oy + dy + 0.9, 0.45, 0.65)
    for (dx, dy) in ((-3.6, 0.0), (2.6, 0.6), (-2.4, -0.9)): x0 = ox + dx; P.box('fh_recl', x0, x0 + 0.9, oy + dy, oy + dy + 0.9, 0.0, 0.5); P.box('fh_recl', x0, x0 + 0.9, oy + dy + 0.7, oy + dy + 0.9, 0.5, 1.05)
    P.box('fh_recl', ox + 0.8, ox + 1.8, oy - 0.2, oy + 0.2, 0.0, 0.9)                                           # one on its back
    P.box('fh_table', ox - 1.2, ox + 0.4, oy + 0.6, oy + 1.2, 0.0, 0.42)
    P.box('black', ox - 0.6, ox + 0.8, oy - 1.0, oy - 0.5, 0.0, 0.06); P.box('fh_cab', ox - 0.9, ox + 1.1, oy - 1.4, oy - 1.1, 0.0, 0.6)   # the TV face down, its stand


def lockers(P, ox, oy, rng):
    """the crew's lockers, two rows back to back a tile long (a run of l is one bank), doors hanging, a name on one; the bench"""
    for j, y0 in enumerate((oy + 0.4, oy + 1.4)):
        P.box('fh_locker', ox - 6.0, ox + 6.0, y0, y0 + 0.5, 0.0, 1.9)
        for k in range(25): x = ox - 6.0 + k * 0.5; P.box('pd_locker_d', max(ox - 6.0, x - 0.012), min(ox + 6.0, x + 0.012), y0 - 0.012, y0, 0.1, 1.9)
        if j == 0:
            for k in range(24):
                x = ox - 6.0 + k * 0.5
                if k in (2, 7, 8, 15, 20):
                    P.box('black', x + 0.03, x + 0.47, y0 - 0.002, y0, 0.15, 1.85); P.poly('fh_locker', [(x + 0.47, y0), (x + 0.49, y0 - 0.01), (x + 0.75, y0 - 0.38), (x + 0.73, y0 - 0.39)], 0.15, 1.85)
                else:
                    for z in (1.5, 1.57, 1.64): P.box('pd_locker_d', x + 0.12, x + 0.38, y0 - 0.006, y0, z, z + 0.025)
    P.box('white', ox - 6.0 + 8 * 0.5 + 0.1, ox - 6.0 + 8 * 0.5 + 0.4, oy + 0.392, oy + 0.394, 1.75, 1.8)
    P.box('pd_bench', ox - 5.0, ox + 5.0, oy - 0.5, oy - 0.15, 0.42, 0.46)
    for x in (ox - 4.5, ox, ox + 4.5): P.box('pd_steel', x - 0.03, x + 0.03, oy - 0.45, oy - 0.2, 0.0, 0.42)


def wall_ew(P, ox, oy, rng):
    """the station's block wall, a tile long: painted red to a metre, cream over it, a white line between, a cap; scuffs where the engines
    backed in close"""
    P.box('fh_red', ox - 6.0, ox + 6.0, oy, oy + 0.3, 0.0, 1.0); P.box('fh_cream', ox - 6.0, ox + 6.0, oy, oy + 0.3, 1.08, WALL_H)
    P.box('fh_white', ox - 6.0, ox + 6.0, oy - 0.005, oy + 0.3, 1.0, 1.08)
    for k in range(1, 12): z = 1.08 + k * 0.2; P.box('ts_course', ox - 6.0, ox + 6.0, oy - 0.004, oy, z - 0.006, z + 0.006)
    P.box('pd_cap', ox - 6.0, ox + 6.0, oy - 0.02, oy + 0.32, WALL_H, WALL_H + 0.05)
    for _ in range(14): u, z = ox + rng.uniform(-5.8, 5.6), rng.uniform(0.1, 2.8); P.box('stain', u, u + rng.uniform(0.2, 0.9), oy - 0.006, oy - 0.004, z, z + rng.uniform(0.05, 0.4))


def wall_ns(P, ox, oy, rng):
    P.box('fh_red', ox - 0.15, ox + 0.15, oy, oy + 12.0, 0.0, 1.0); P.box('fh_cream', ox - 0.15, ox + 0.15, oy, oy + 12.0, 1.08, WALL_H)
    P.box('fh_white', ox - 0.16, ox + 0.16, oy, oy + 12.0, 1.0, 1.08); P.box('pd_cap', ox - 0.17, ox + 0.17, oy, oy + 12.0, WALL_H, WALL_H + 0.05)


BAY_F = dict(engine=engine, gearwall=gearwall, hose=hose, bottles=bottles, toolbox=toolbox, cones=cones, bench=bench)
QU_F = dict(kitchen=kitchen, lockers=lockers, wall_ew=wall_ew, wall_ns=wall_ns, bunks=bunks, table=table, couches=couches)


def fh_bay_parts(P, rng):
    for k, f in BAY_F.items(): f(P, *BAY_AT[k], rng)


def fh_qu_parts(P, rng):
    for k, f in QU_F.items(): f(P, *QU_AT[k], rng)


def fh_mats(bpy, NF, F, M, which):
    if which not in ('fh_bay', 'fh_quarters', 'tun_pieces'): return
    if which in ('fh_bay', 'fh_quarters'): LB.lb_mats(bpy, NF, F, M, 'lb_pieces')
    m = lambda n, role, step, mul: NF.material(bpy, n, role, step, mul)
    M.update(fh_red=m('in_paint_engine_red', 'clay_rust', 2, 0.9), fh_white=m('in_paint_engine_white', 'tape_grey', 3, 0.9), fh_steel=m('in_alum_diamond', 'tape_grey', 3, 0.85),
             fh_steel_d=m('in_steel_rack_dark', 'tape_grey', 1, 1.0), fh_hosebed=m('in_hose_yellow', 'clay_mustard', 2, 0.9), fh_hosebed2=m('in_hose_red', 'clay_rust', 2, 0.85),
             fh_coat=m('in_cloth_turnout_tan', 'tape_masking', 2, 0.85), fh_stripe=m('in_reflective_stripe', 'clay_mustard', 3, 0.9), fh_helmet=m('in_helmet_black', 'rubber', 2, 1.0),
             fh_bottle=m('in_bottle_air', 'tape_grey', 3, 0.85), fh_cyl=m('in_cylinder_green', 'metal_painted', 2, 1.0), fh_basket=m('in_basket_orange', 'clay_rust', 3, 0.95),
             fh_cab=m('in_cabinet_kitchen', 'tape_masking', 1, 1.0), fh_top=m('in_counter_top', 'tape_grey', 3, 0.85), fh_table=m('in_wood_table_kitchen', 'tape_masking', 2, 0.95),
             fh_couch=m('in_cloth_couch_brown', 'clay_rust', 1, 0.95), fh_recl=m('in_vinyl_recliner', 'rubber', 3, 1.0), fh_locker=m('in_paint_locker_red', 'clay_rust', 1, 1.0),
             fh_cream=m('in_paint_block_cream', 'clay_bone', 3, 0.88), fh_crib=m('in_wood_cribbing', 'tape_masking', 2, 0.9),
             fh_rug=m('in_rug_dayroom', 'clay_rust', 0, 1.0))


TG.PARTS['fh_bay'] = fh_bay_parts
TG.PARTS['fh_quarters'] = fh_qu_parts
TG.MAT_HOOKS.append(fh_mats)


# ---- the ceiling: the truck stop's steel roof, the exhaust hoses over every bay ----------------------------------------------------
def ceil_firehouse(P, rng):
    TS.ceil_truckstop(P, rng)
    for r in range(5):
        for c in range(5):
            x, y = TG.at(c, r, 9.0, 2.0, 1.1); P.box('haz', x - 0.06, x + 0.06, y - 8.0, y, 1.05, 1.12)            # the exhaust rail down the bay
            for k in range(2):                                                                                 # its hoses hanging, dead
                x2, y2 = TG.at(c, r, 9.0, 3.5 + k * 4.0, 1.6); P.drum('fh_hosebed', x2, y2, 1.1, 1.9, 0.16, 12); P.drum('black', x2, y2, 1.9, 1.95, 0.2, 12)


TG.CEILINGS['firehouse'] = (ceil_firehouse, 'firehouse/firehouse_ceiling.webp', "the bay's steel roof from under it: the deck, the girders, the open-web joists, the sprinkler main, a skylight and a dead lamp in every bay, the exhaust hoses hanging from their rail")
TG.CEIL_DATA['firehouse'] = 'firehouse/firehouse.json'

# ---- the cut (the inside kit's) --------------------------------------------------------------------------------------------------
KIND = dict(engine='WALL', gearwall='WALL', hose='DRESS', bottles='LOW_COVER', toolbox='COVER', cones='LOW_COVER', bench='COVER', bunks='LOW_COVER',
            kitchen='COVER', table='COVER', couches='LOW_COVER', lockers='WALL', wall_ew='WALL', wall_ns='WALL')
HM = dict(engine=3.4, gearwall=2.2, hose=0.1, bottles=1.7, toolbox=1.85, cones=1.6, bench=2.0, bunks=1.8, kitchen=2.4, table=1.0, couches=1.05, lockers=1.9,
          wall_ew=WALL_H + 0.05, wall_ns=WALL_H + 0.05)
NAME = dict(engine='A FIRE ENGINE', gearwall='TURNOUT GEAR', hose='HOSE LAID OUT', bottles='AIR BOTTLES', toolbox='A RESCUE TOOL CABINET', cones='CONES AND FLARES',
            bench='A WORKBENCH', bunks='THE BUNKS', kitchen='THE KITCHEN', table='THE KITCHEN TABLE', couches='THE DAY ROOM', lockers='THE CREW\'S LOCKERS',
            wall_ew="THE STATION'S WALL", wall_ns="THE STATION'S WALL")
BOX = dict(engine=(-6.0, 6.01, -0.2, 8.1 + 3.5 * 1.45), gearwall=(-6.0, 6.01, -0.1, 7.1 + 2.3 * 1.45), hose=(-6.0, 6.01, -0.9, 4.0),
           bottles=(-4.6, 4.6, -1.7, 4.2), toolbox=(-5.4, 4.4, -1.6, 4.1), cones=(-4.3, 4.3, -1.7, 4.3), bench=(-5.0, 4.6, -0.9, 4.5),
           kitchen=(-6.0, 6.01, -1.0, 3.9 + 2.5 * 1.45), lockers=(-6.0, 6.01, -0.6, 2.0 + 2.0 * 1.45), wall_ew=(-6.0, 6.01, -0.3, 0.4 + (WALL_H + 0.1) * 1.45),
           wall_ns=(-0.6, 0.6, -0.05, 12.1 + (WALL_H + 0.1) * 1.45), bunks=(-3.8, 3.8, -1.0, 8.9), table=(-4.0, 4.2, 0.0, 4.5),
           couches=(-4.2, 3.8, -1.6, 4.4))
SHADOW = dict(wall_ns=0.5, hose=0.6)

K = KIT.make(TG, kit='firehouse', prefix='fh_', floor_render='fh_floor', floor_lists=[('floor', BAYR), ('ring', BAYR), ('quarters', QUARTERS)],
             scenes=[('fh_bay', BAY_AT), ('fh_quarters', QU_AT)], box=BOX, kind=KIND, hm=HM, name=NAME, shadow=SHADOW,
             art_for="COMBAT FOUR's fire station (slices/fight_ground/firehouse/firehouse.json): the names its handoff asked for, the garage's format. floor.floor is the apparatus bay's sealed concrete (a trench drain's grate in every tile's middle, the wheel paths, wash water's tide marks, a squeegee's arcs, oil); floor.ring the same. floor.quarters is the quarters' vinyl (the police station's 30 cm squares): it is laid the day the_quarters names a floor area of kind 'quarters' (one rectangle, the whole layout); until then the quarters wear the bay's concrete.",
             how_it_lays={'the apparatus bay': "fh_engine is two pumpers side by side, east to west, nose west, so EEE is three pairs nose to tail and the block of six is a yard of them; fh_gearwall is three double runs of gear racks a tile long, so a run of G is one wall of gear; fh_hose lies flat (no cover).",
                          'the quarters': "fh_kitchen and fh_lockers a tile long so kkkk and llll are one run; fh_table the long table on its side; fh_bunks three beds."},
             sheet_name='THE_FIRE_STATION', card_id='cook7-the-fire-station-11-27', heading='THE FIRE STATION, BEFORE AND NOW',
             sub='on his phone, 390 x 844, as the fight opens in the apparatus bay: before (every piece a stand-in), now, and now with the roof at his 10%',
             off_label='NOW, THE ROOF OFF', meets_label='NOW, AS HE MEETS IT: THE ROOF AT 10%', close_title='CLOSE IN, AND THE QUARTERS',
             close_sub='the engines and the gear racks; the quarters: bunks, the kitchen, the day room, the lockers',
             closes=[('THE ENGINES', 'engine'), ('THE GEAR', 'gear')], other=('THE QUARTERS', 'qu'), pieces_title='THE PIECES AT THEIR OWN PIXELS',
             pieces_sub='the engine, the gear racks, hose, bottles, the rescue cabinet, cones, a bench; the quarters: kitchen, lockers, bunks, the table, the day room',
             rows=[(('engine', 'gearwall'), 230), (('kitchen', 'lockers'), 170), (('bottles', 'toolbox', 'cones', 'bench'), 140), (('bunks', 'table', 'couches'), 140), (('hose', 'wall_ew'), 110)],
             floor_title="THE BAY'S CONCRETE, THE QUARTERS' VINYL, AND THE ROOF AT FULL STRENGTH", floor_sub='the trench drain, the wheel paths, wash water; worn vinyl; the joists, a skylight, the exhaust hoses')


def cut(): KIT.cut(K)


def sheet(before_dir, page_dir): KIT.sheet(K, before_dir, page_dir)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'fh_floor' else TG.scene_pieces(n, '--quick' in a) if n in ('fh_bay', 'fh_quarters') else TG.scene_ceiling('firehouse', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
