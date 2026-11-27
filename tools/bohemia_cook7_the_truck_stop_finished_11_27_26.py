#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the truck stop, finished] (11/27/26; COMBAT FOUR's BUILD 11/21ze asked 'FOR COOK (SIX)'; VAMILY rule 480(b):
finished art where a stand-in still stands; rule 482 (more cooking, improving what we already have); rules 461, 441, 416, 451(a), 479(b)).

COMBAT FOUR's truck stop (THE TRUCK STOP, slices/fight_ground/truckstop/truckstop.json, laid by slices/bohemia_big_inside.js): the travel
center on the interstate, seven fights in ten fought inside: its travel store (coolers on the back wall, runs of shelving with end caps,
cases pulled down, pallets where the water was, the deli's booths, the hot food case, the coffee island, the counter) or its service bay
(rigs a side, cab and trailer, raised lifts, stacked tires, tool chests, drums, the compressor, bay doors both ends). All 20 of its pieces
were stand-ins (the casino's screens, cage, seats and bar, the tunnels' camp and jam, the street board's bales, heaps, wreck, container,
dozer and rubble, the garage's booth and walls) on the mall's floor, and its ceiling was drawn by the page. These are the pictures under
its names, through the master rig, ON COOK SIX's swap meet tool (and the chain under it):

  THE FLOOR        truckstop_floor_0.webp, five tiles by five. Rows 0 to 2 (floor.floor, floor.ring): THE STORE'S GRITTY TILE, 60 cm porcelain
                   laid on the tunnels' calibrated grey, its grout dark, each tile its own shade, dirt tracked in from the lot in paths,
                   soda dried in blots, a tile cracked, one gone to its mortar. Rows 3 and 4 (floor.bay, for the service bay once its
                   layout names the kind): THE BAY'S OIL-STAINED CONCRETE, the garage deck's ground, saw cuts every 4 m, the oil where
                   rigs stood for years, the wheel paths east to west through the doors, a drain. A tile's edge is a grout line or a
                   saw cut only: any tile meets any tile.
  THE PIECES       (truckstop_art.json's kit, COMBAT FOUR's names)
    ts_cooler      the walk-in coolers' glass doors, a tile of them (fifteen doors), dark, some open, two smashed, a few bottles left
    ts_shelving    a tile of stripped gondola shelving: three double runs, the pegboard backs, the price strips, a few things left
    ts_endcap      the end caps at a run's three lines, low and stripped, a dump bin between them
    ts_stock       cases pulled down off the shelves and left: a gondola section on its back, cardboard everywhere, cans
    ts_jerky       a jerky stand and the lottery case, scratchers spilled, the lottery screen still lit
    ts_pallets     empty pallets, stacked and thrown, a pallet jack
    ts_water       cases of bottled water on two pallets, the wrap torn, half of it taken, the empties crushed round it
    ts_booths      the deli's booths, red vinyl, one bench slashed to the foam
    ts_hotcase     the hot food case on its counter: the roller grill, the warmer, the glass broken
    ts_island      the coffee and soda island: brewers, the fountain, the cups' shelf over it, lids in a drift
    ts_counter     the checkout counter, its registers' drawers all open and empty, the cigarette wall behind it bare
    ts_cab         a tractor's cab, nose to the camera, its hood tilted forward, the engine open
    ts_trailer     a 40-foot dry van on its landing legs, its name painted out, rust down its roof
    ts_lift        a drive-on lift raised, a pickup on it with all four wheels gone
    ts_tires       truck tires stacked, a stack fallen
    ts_toolchest   a roll cab and its top chest, the drawers pulled, a creeper and a floor jack
    ts_drums       oil drums on a spill pallet, one on its side, the oil out of it
    ts_compressor  the shop's air compressor on its tank, a tire changer beside it
    ts_wall_ew/_ns the building's block wall, painted, a dark wainscot, the travel center's stripe, an empty extinguisher box
  THE CEILING      truckstop_ceiling.webp (rule 451(a), over the fight at 10%; one picture for the store and the bay, as the data names
                   its kind 'joist'): five bays by five that repeat: the open-web steel joists on the girders, the metal deck, a
                   sprinkler main, a dead high-bay lamp in every bay, a skylight in every bay, rust and holes through to the sky.

  /tmp/v/bin/python tools/bohemia_cook7_the_truck_stop_finished_11_27_26.py render ts_floor | ts_pieces | ts_bay | ceil_truckstop
  python3 tools/bohemia_cook7_the_truck_stop_finished_11_27_26.py cut
  python3 tools/bohemia_cook7_the_truck_stop_finished_11_27_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): the travel centers on I-15 north and south of the
valley (the big chains' plazas at Apex, Jean and Primm): a store of 60 cm porcelain tile, walk-in cooler doors along the back wall,
double-sided gondola runs about 1.5 m tall with end caps, a roller grill and pizza warmer by the counter, a coffee island with a fountain
tower, a deli's red booths, a long checkout counter with a cigarette wall behind it; and the truck service bays behind them (drive-through
bays with doors both ends, tilt hoods up on conventional tractors, drive-on four-post lifts, roll cabs, 55-gallon drums on spill pallets,
tire racks, a horizontal shop compressor). The twins: COOK SIX's swap meet and school kits (the same rig and cut).
REUSE CHECK (REUSE-FIRST): the swap meet's tool and its chain (materials, cut, sheet), the terminal's way of drawing a floor's joints,
the tunnels' and the garage deck's calibrated grounds, the swap meet's corrugated roof materials, COOK FIVE's rig, Parts and cutter.
New here: the truck stop's plan, its 20 pieces, its joists.
ANALOG HORROR: the lottery screen still lit on a stand in a store with no power anywhere else; every register drawer open; a pickup on
a lift with all four wheels taken and the lug nuts left in its hubcap on the floor.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook7_inside_kit as KIT                            # this lane's: the cut, the sheet, the ceiling's hand-off, once (rule 495(b))
import bohemia_cook6_the_swap_meet_finished_11_26_26 as SM            # COOK SIX's: the swap meet (and the chain under it)

SC = SM.SC; TG = SM.TG; FW = SM.FW; HS = SM.HS; SD = SM.SD
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'truckstop')
STORE, BAY = (0, 1, 2), (3, 4)
tile_xy = HS.tile_xy


# ---- the ground: the store's tile, the bay's concrete -----------------------------------------------------------------------
# THE STORE'S TILE IS ITS OWN GROUND (11/27, measured: a joint drawn in the plan is one pixel, and the ground's mesh takes a vertex every
# two, so the 60 cm grout never reached the render; the tunnels' own 4 m joints did, because a ground's joints are drawn by its shader at
# any size). So the tile is the tunnels' calibrated grey with the shader's joints every 0.6 m and every square its own shade; its
# multiplier is the tunnels' floor's measured one (the same role and target; no new calibration render, the convention hall's way)
TG.GROUNDS['ts_tile'] = dict(role=('tape_grey', 2), target=(142, 137, 126), h=0.0, alt=('clay_bone', 2), alt_amt=0.22, grit=0.08, speck=(70, 0.12),
                             joints=dict(pitch=0.6, width=0.012), panel_var=0.07)
TG.CAL0['ts_tile'] = 0.6006
TG.WEAR['ts_tile'] = 0.25
def seg_d(X, Y, x0, y0, x1, y1):
    dx, dy = x1 - x0, y1 - y0; t = np.clip(((X - x0) * dx + (Y - y0) * dy) / max(dx * dx + dy * dy, 1e-9), 0, 1)
    return np.hypot(X - x0 - t * dx, Y - y0 - t * dy)


def joints(lx, ly, q):
    """a joint every q metres as ONE pixel where the square changes (a test on the distance aliases: at 0.033 m a pixel north to south a
    1.6 cm line was missed on 4 rows of 20); each tile's first row and column are a joint, so every tile meets every tile alike"""
    gx = np.floor(lx / q + 1e-6).astype(int); gy = np.floor(ly / q + 1e-6).astype(int)
    jx = np.ones(lx.shape, bool); jy = np.ones(ly.shape, bool)
    jx[:, 1:] = gx[:, 1:] != gx[:, :-1]; jy[1:, :] = gy[1:, :] != gy[:-1, :]
    return jx | jy


def plan_ts_floor(ID, seed=241):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['tun_floor'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    grain = FW.vnoise((H, W), 0.12 * PPM, rng)
    pale = np.zeros((H, W), np.float32); dark = np.zeros((H, W), np.float32)
    store = row < 3
    # THE STORE: 60 cm porcelain, its grout every 0.6 m (a tile's edge is a grout line), each square its own shade, grit in it
    q = 0.6                                                                                         # (the grout and the squares' shades are the ground's own: ts_tile)
    d_store = 0.12 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.08 + (grain - 0.5) * 0.04
    # THE BAY: the garage deck's ground, laid dark, saw cuts every 4 m (a tile's edge is a cut)
    cut = joints(lx, ly, 4.0)
    d_bay = 0.26 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.1 + (grain - 0.5) * 0.06 + cut * 0.16
    gid[store] = ID['ts_tile']; gid[~store] = ID['gar_deck']
    dark[:] = np.where(store, d_store, d_bay)
    for r in range(5):
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl, G = dark[sy, sx], pale[sy, sx], gid[sy, sx]
            Wn = TG.win(X, Y, 0.9, 2.2); nn = FW.vnoise(X.shape, 0.9 * PPM, rng)
            if r in STORE:
                ang = rng.uniform(0, math.pi); cx, cy = rng.uniform(4.5, 7.5), rng.uniform(4.5, 7.5)       # the dirt tracked in from the lot, in a path
                d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang))
                D[:] += np.clip(1 - d0 / 1.6, 0, 1) * Wn * (0.07 + 0.06 * nn)
                for _ in range(rng.randint(1, 4)):                                                       # soda, dried in blots
                    cx, cy = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.5 * nn)
                    D[:] = np.maximum(D, np.clip(1.1 - d0 / rng.uniform(0.35, 0.8), 0, 1) * 0.42)
                if rng.rand() < 0.7:                                                                     # a tile cracked corner to corner
                    i, j = rng.randint(4, 16), rng.randint(4, 16); x0, y0 = i * q, j * q
                    D[seg_d(X, Y, x0 + 0.05, y0 + 0.05, x0 + q - 0.05, y0 + q - 0.08) < 0.012] = 0.5
                    D[seg_d(X, Y, x0 + 0.3, y0 + 0.28, x0 + 0.55, y0 + 0.12) < 0.01] = 0.5
                if rng.rand() < 0.45:                                                                    # a tile gone, to its mortar bed
                    i, j = rng.randint(4, 16), rng.randint(4, 16); m = (X > i * q + 0.02) & (X < (i + 1) * q - 0.02) & (Y > j * q + 0.02) & (Y < (j + 1) * q - 0.02)
                    G[m] = ID['hall_slab']; D[m] = 0.3 + 0.2 * nn[m]; Pl[m] = 0.08
                if rng.rand() < 0.5:                                                                     # a pallet jack's two wheels, dragged
                    y0 = rng.uniform(3.0, 9.0); xa, xb = rng.uniform(1.5, 3.5), rng.uniform(8.0, 10.5); sl = rng.uniform(-0.12, 0.12)
                    for dy in (0.0, 0.52): D[(np.abs(Y - (y0 + dy + sl * (X - 6))) < 0.02) & (X > xa) & (X < xb)] += 0.18
            else:
                for _ in range(rng.randint(2, 4)):                                                       # the oil where rigs stood, years of it
                    cx, cy = rng.uniform(3.5, 8.5), rng.uniform(4.0, 8.0); d0 = np.hypot((X - cx) / rng.uniform(1.6, 2.8), (Y - cy) / rng.uniform(0.9, 1.5)) * (0.8 + 0.4 * nn)
                    D[:] = np.maximum(D, np.clip(1.15 - d0, 0, 1) ** 0.7 * (0.55 + 0.35 * nn) * 0.72 * Wn ** 0.5)
                for _ in range(rng.randint(2, 6)):                                                       # drips, a trail
                    x, y = rng.uniform(2, 10), rng.uniform(3, 9)
                    for k in range(rng.randint(3, 8)):
                        x += rng.uniform(-0.3, 0.6); m = np.hypot(X - x, Y - y - rng.uniform(-0.1, 0.1)) < rng.uniform(0.04, 0.12); D[m] = np.maximum(D[m], 0.58)
                for y0 in (4.6, 6.6):                                                                    # the wheel paths, east to west, through the doors
                    D[:] += np.clip(1 - np.abs(Y - y0) / 0.35, 0, 1) * (0.04 + 0.05 * nn) * TG.win(X, Y, 0.2, 0.8)
                m = (np.abs(X - 6.0) < 0.3) & (np.abs(Y - 9.4) < 0.3)                                    # the drain, its grate
                D[m] = 0.55 + 0.25 * ((((X[m] - 5.7) / 0.06).astype(int)) % 2); Pl[m] = 0.0
                if rng.rand() < 0.5:                                                                     # kitty litter over a spill, swept half up
                    cx, cy = rng.uniform(3, 9), rng.uniform(3, 9); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.5 * nn)
                    Pl[:] = np.maximum(Pl, np.clip(1 - d0 / 0.9, 0, 1) * 0.3 * (FW.vnoise(X.shape, 0.08 * PPM, rng) > 0.45))
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['ts_floor'] = plan_ts_floor


def ts_floor_things(bpy, NF, M, rng):
    st = FW.debris(bpy, NF, {'rubber': M['black'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(24.6, 59.4)), 70)   # receipts, wrappers, scratchers
    by = FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(0.6, 23.4)), 30)    # rags, a strap, cardboard
    return st + by


TG.GARAGE_THINGS['ts_floor'] = ts_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
# the store's pieces in one render (ts_pieces), the bay's in another (ts_bay): metres in the render, each piece's foot (its south middle)
TS_AT = dict(cooler=(7.0, 47.0), shelving=(21.0, 47.0), wall_ew=(35.0, 47.0), counter=(48.0, 47.0), wall_ns=(57.5, 40.0),
             island=(8.0, 33.0), hotcase=(22.0, 33.0), booths=(34.0, 33.0), water=(45.0, 33.0),
             endcap=(7.0, 20.0), stock=(20.0, 20.0), jerky=(31.0, 20.0), pallets=(41.0, 20.0))
BAY_AT = dict(trailer=(8.0, 44.0), lift=(26.0, 44.0), cab=(45.0, 44.0),
              tires=(8.0, 28.0), toolchest=(20.0, 28.0), drums=(31.0, 28.0), compressor=(43.0, 28.0))
STORE_KEYS = tuple(TS_AT); BAY_KEYS = tuple(BAY_AT)
WALL_H = 3.0
GOODS = ('red', 'blue', 'tan', 'teal', 'card', 'paper', 'black', 'white', 'haz', 'must', 'rustp')
LINES = ((-2.36, -1.16), (0.44, 1.64), (3.24, 4.44))   # the gondolas' three lines, south to north, metres north of the END CAP's foot (shelving foot + 2.76 m)


def gondola(P, x0, x1, y0, rng, h=2.1, sparse=0.18):
    """one double-sided gondola run from x0 to x1, 1.2 m deep from y0: its base, pegboard back, uprights every 1.2 m, five shelves a side,
    the price strips, what was left on them (a few things), overstock on top"""
    y1 = y0 + 1.2; yc = y0 + 0.6
    P.box('ts_kick', x0, x1, y0 + 0.02, y1 - 0.02, 0.0, 0.14)
    P.box('ts_shelf', x0, x1, yc - 0.03, yc + 0.03, 0.14, h)                                                # the pegboard back
    x = x0
    while x <= x1 + 1e-6:
        P.box('ts_upright', max(x0, x - 0.03), min(x1, x + 0.03), yc - 0.05, yc + 0.05, 0.14, h + 0.02); x += 1.2
    for z in (0.14, 0.5, 0.88, 1.26, 1.64):
        for (a, b) in ((y0 + 0.02, yc - 0.03), (yc + 0.03, y1 - 0.02)):
            P.box('ts_shelf', x0, x1, a, b, z, z + 0.025)
            e = a if a < yc else b - 0.025
            P.box('ts_strip', x0, x1, e, e + 0.025, z + 0.025, z + 0.06)                               # the price strip on its front edge
            n = int((x1 - x0) * sparse * 2)
            for _ in range(n):                                                                        # what was left
                u = rng.uniform(x0 + 0.05, x1 - 0.3); w_ = rng.uniform(0.06, 0.25); hh = rng.uniform(0.08, 0.3); dd = rng.uniform(0.1, 0.4)
                yy = a + 0.03 if a < yc else b - 0.03 - dd
                P.box(GOODS[rng.randint(len(GOODS))], u, u + w_, yy, yy + dd, z + 0.025, z + 0.025 + hh)
    for _ in range(int((x1 - x0) / 3)):                                                               # overstock boxes on top
        u = rng.uniform(x0 + 0.1, x1 - 0.8); P.box('card', u, u + rng.uniform(0.4, 0.7), y0 + 0.15, y1 - 0.15, h + 0.02, h + rng.uniform(0.25, 0.5))


def cooler(P, ox, oy, rng):
    """a tile of the walk-in coolers' glass doors along the back wall: fifteen doors on a 0.8 m pitch (a mullion on the tile's edge, so a run
    meets), dark glass, a few bottles behind it, three doors standing open, two smashed to their frames; the header; the walk-in's
    insulated top behind with its condensers"""
    y0, d, hz = oy + 0.3, 7.6, 2.6                                                                    # (deep: its top meets the back wall on the glass)
    P.box('ts_cool_top', ox - 6.0, ox + 6.0, y0 + 0.12, y0 + d, hz - 0.05, hz)                         # the walk-in's top
    P.box('ts_cool_side', ox - 6.0, ox + 6.0, y0 + 0.12, y0 + d, 0.0, hz - 0.05)
    P.box('ts_frame', ox - 6.0, ox + 6.0, y0, y0 + 0.12, 2.2, hz)                                    # the header over the doors
    P.box('black', ox - 6.0, ox + 6.0, y0 - 0.005, y0, 2.3, 2.5)
    P.box('ts_frame', ox - 6.0, ox + 6.0, y0, y0 + 0.12, 0.0, 0.14)                                  # the sill
    opened = {2, 8, 12}; smashed = {5, 10}
    for k in range(16):
        x = ox - 6.0 + 0.8 * k; P.box('ts_frame', max(ox - 6.0, x - 0.04), min(ox + 6.0, x + 0.04), y0, y0 + 0.12, 0.14, 2.2)
    for k in range(15):
        xa, xb = ox - 6.0 + 0.8 * k + 0.04, ox - 6.0 + 0.8 * (k + 1) - 0.04
        P.box('black', xa, xb, y0 + 0.11, y0 + 0.12, 0.14, 2.2)                                       # the dark inside
        for z in (0.5, 0.95, 1.4, 1.85): P.box('ts_wire', xa, xb, y0 + 0.13, y0 + 0.6, z, z + 0.02)   # the wire shelves, seen through
        for _ in range(rng.randint(0, 3)):
            z = (0.52, 0.97, 1.42, 1.87)[rng.randint(4)]; u = rng.uniform(xa, xb - 0.08)
            P.drum(('jug', 'red', 'teal', 'haz')[rng.randint(4)], u + 0.04, y0 + 0.3, z, z + rng.uniform(0.18, 0.3), 0.035, 8)
        if k in opened:                                                                               # a door standing open, swung out
            P.poly('ts_frame', [(xa, y0), (xa + 0.06, y0 - 0.02), (xa + 0.25, y0 - 0.72), (xa + 0.19, y0 - 0.74)], 0.14, 2.2)
            P.poly('glass_d', [(xa + 0.03, y0 - 0.04), (xa + 0.06, y0 - 0.05), (xa + 0.22, y0 - 0.68), (xa + 0.19, y0 - 0.69)], 0.2, 2.14)
        elif k in smashed:                                                                            # smashed out: the frame, the glass on the floor
            P.box('ts_frame', xa, xb, y0 + 0.0, y0 + 0.05, 1.1, 1.16)
            for _ in range(14): u, v = rng.uniform(xa - 0.3, xb + 0.3), rng.uniform(y0 - 0.9, y0 - 0.05); P.box('glassbit', u, u + rng.uniform(0.03, 0.12), v, v + rng.uniform(0.03, 0.1), 0.0, 0.008)
        else:
            P.box('glass_d', xa, xb, y0 + 0.0, y0 + 0.02, 0.14, 2.2)                                   # the glass, dark
            P.box('chrome', xb - 0.08, xb - 0.05, y0 - 0.03, y0, 0.8, 1.6)                              # its handle
    for x in (ox - 3.0, ox + 3.0):                                                                    # the condensers on the walk-in's top
        P.box('ts_steel', x - 0.6, x + 0.6, y0 + 4.4, y0 + 5.4, hz, hz + 0.55); P.drum('black', x, y0 + 4.9, hz + 0.55, hz + 0.57, 0.34, 14)
        P.bar('ts_steel', (x + 0.6, y0 + 4.9, hz + 0.2), (x + 2.0, y0 + 4.9, hz + 0.05), 0.03)
    P.bar('ts_steel', (ox - 6.0, y0 + 6.6, hz + 0.08), (ox + 6.0, y0 + 6.6, hz + 0.08), 0.04)           # the conduit, end to end
    for k in range(1, 10): x = ox - 6.0 + k * 1.2; P.box('black', x - 0.015, x + 0.015, y0 + 0.12, y0 + d, hz, hz + 0.004)   # the panels' seams
    for k in range(1, 4): y = y0 + k * 1.9; P.box('black', ox - 6.0, ox + 6.0, y - 0.015, y + 0.015, hz, hz + 0.004)
    for x in (ox - 3.0, ox + 3.0): P.bar('ts_frame', (x, y0 + 4.4, hz + 0.08), (x, y0 + 0.6, hz + 0.08), 0.035)   # the refrigerant lines down to the boxes
    for _ in range(5):                                                                                      # what got stored up there: flat cases, a roll of insulation
        u, v = rng.uniform(ox - 5.5, ox + 4.8), rng.uniform(y0 + 0.8, y0 + 3.6); P.box('card', u, u + rng.uniform(0.4, 0.8), v, v + rng.uniform(0.3, 0.6), hz, hz + rng.uniform(0.15, 0.3))
    P.tube_x('tan', ox + 0.5, ox + 1.7, y0 + 6.2, hz + 0.3, 0.3, 12)
    for _ in range(6): TG.bloom(P, 'stain', rng.uniform(ox - 5.5, ox + 5.5), rng.uniform(y0 + 0.6, y0 + d - 0.4), rng.uniform(0.4, 0.9), rng, 5)   # its dust, darker in drifts
    P.box('rubber', ox - 6.0, ox + 6.0, oy - 0.6, oy + 0.25, 0.0, 0.012)                                # the rubber mat along the doors


def shelving(P, ox, oy, rng):
    """a tile of stripped gondola shelving: three double runs 1.2 m deep on 1.6 m aisles, the whole tile long so a run of tiles is one run;
    a shelf down in an aisle"""
    for j in range(3):
        gondola(P, ox - 6.0, ox + 6.0, oy + 0.4 + j * 2.8, rng)
    for j in range(2):
        y = oy + 1.6 + j * 2.8 + rng.uniform(0.3, 0.9); u = rng.uniform(ox - 5, ox + 3); P.box('ts_shelf', u, u + 1.2, y, y + 0.45, 0.0, 0.03)
        for _ in range(5): v = rng.uniform(ox - 5.5, ox + 5.5); P.box(GOODS[rng.randint(len(GOODS))], v, v + 0.15, y - 0.2, y + 0.1, 0.0, 0.08)


def endcap(P, ox, oy, rng):
    """the end caps where the runs end, at the three lines of the gondolas on both edges of the tile (low: the top shelves gone), facing the
    cross aisle; a dump bin and a fallen sale sign between them"""
    for (a, b) in LINES:
        for side in (-1, 1):
            xa, xb = (ox - 6.0, ox - 5.0) if side < 0 else (ox + 5.0, ox + 6.0)
            P.box('ts_kick', xa, xb, oy + a, oy + b, 0.0, 0.14); P.box('ts_shelf', xa, xb, oy + a + 0.02, oy + b - 0.02, 0.14, 1.3)
            fx = xb if side < 0 else xa                                                                # its face, to the aisle
            for z in (0.14, 0.55, 0.95):
                P.box('ts_shelf', min(fx, fx + 0.4 * side), max(fx, fx + 0.4 * side), oy + a + 0.05, oy + b - 0.05, z, z + 0.025)
                for _ in range(rng.randint(0, 4)):
                    v = rng.uniform(oy + a + 0.1, oy + b - 0.3); u0 = fx + side * rng.uniform(0.02, 0.2)
                    P.box(('haz', 'teal', 'black', 'red')[rng.randint(4)], min(u0, u0 + 0.12 * side), max(u0, u0 + 0.12 * side), v, v + 0.12, z + 0.025, z + 0.025 + rng.uniform(0.15, 0.25))
            P.box('ts_strip', min(fx, fx + 0.03 * side), max(fx, fx + 0.03 * side), oy + a, oy + b, 1.3, 1.5)    # its header card, blank
    x, y = ox + rng.uniform(-1.5, 1.0), oy + 0.6                                                         # the dump bin, wire, tipped
    P.box('ts_wire', x - 0.5, x + 0.5, y, y + 0.7, 0.0, 0.7); P.box('black', x - 0.45, x + 0.45, y + 0.05, y + 0.65, 0.05, 0.06)
    for _ in range(12): u, v = x + rng.uniform(-1.3, 1.3), y + rng.uniform(-0.8, 1.2); P.box(('haz', 'black', 'teal')[rng.randint(3)], u, u + 0.1, v, v + 0.16, 0.0, 0.2)   # quarts of oil, spilled
    P.box('white', ox + 1.5, ox + 2.4, oy - 0.2, oy + 0.4, 0.0, 0.02); P.bar('chrome', (ox + 1.9, oy + 0.4, 0.01), (ox + 1.9, oy + 1.4, 0.01), 0.015)   # a sale sign on its back


def stock(P, ox, oy, rng):
    """cases pulled down off the shelves and left: a gondola section lying on its back, cases split open, cans rolled out"""
    P.box('ts_shelf', ox - 1.8, ox + 0.6, oy + 0.6, oy + 1.8, 0.14, 0.2); P.box('ts_kick', ox - 1.8, ox + 0.6, oy + 1.8, oy + 2.0, 0.0, 0.3)
    for k in range(5): x = ox - 1.8 + k * 0.6; P.box('ts_shelf', x, x + 0.025, oy + 0.6, oy + 1.8, 0.2, 0.55)   # its shelves, standing up now
    for _ in range(26):
        x, y = ox + rng.uniform(-2.4, 2.2), oy + rng.uniform(0.0, 2.4); a = rng.uniform(-0.8, 0.8); ca, sa = math.cos(a), math.sin(a)
        w_, d_ = rng.uniform(0.2, 0.32), rng.uniform(0.15, 0.25); z = rng.choice((0.0, 0.0, 0.0, 0.3, 0.55)); h_ = rng.uniform(0.2, 0.32)
        P.poly('card', [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in ((-w_, -d_), (w_, -d_), (w_, d_), (-w_, d_))], z, z + h_)
    for _ in range(8):                                                                                 # stacked cases still squared up
        x, y = ox + rng.uniform(0.8, 2.0), oy + rng.uniform(1.0, 2.2); n = rng.randint(2, 5)
        for k in range(n): P.box('card', x, x + 0.42, y, y + 0.3, k * 0.28, k * 0.28 + 0.27)
    for _ in range(30): u, v = ox + rng.uniform(-2.6, 2.6), oy + rng.uniform(-0.4, 2.6); P.drum(('red', 'teal', 'chrome', 'haz')[rng.randint(4)], u, v, 0.0, 0.12, 0.033, 8)


def jerky(P, ox, oy, rng):
    """a jerky stand and the lottery case: a wooden barrel display of jerky on its pegs, picked over; the lottery case with its glass top
    and the scratchers' rolls, spilled; the lottery terminal's screen still lit"""
    P.drum('ts_barrel', ox - 1.0, oy + 0.8, 0.0, 0.9, 0.45, 16); P.drum('black', ox - 1.0, oy + 0.8, 0.9, 0.93, 0.47, 16)
    P.box('ts_wood', ox - 1.05, ox - 0.95, oy + 0.7, oy + 0.9, 0.93, 1.8); P.box('ts_wood', ox - 1.4, ox - 0.6, oy + 0.75, oy + 0.85, 1.6, 1.75)
    for k in range(6):
        x = ox - 1.38 + k * 0.15
        if rng.rand() < 0.6: P.box(('rustp', 'red', 'tan')[rng.randint(3)], x, x + 0.1, oy + 0.66, oy + 0.7, 1.15, 1.55)   # a bag or two left on a peg
    P.box('ts_case', ox + 0.0, ox + 1.6, oy + 0.4, oy + 1.2, 0.0, 0.95); P.box('glass_d', ox + 0.02, ox + 1.58, oy + 0.42, oy + 1.18, 0.95, 0.97)
    for k in range(8):
        x = ox + 0.08 + k * 0.19; P.box(('haz', 'teal', 'red', 'blue', 'must')[k % 5], x, x + 0.15, oy + 0.5, oy + 1.1, 0.75, 0.8)
    P.box('black', ox + 1.2, ox + 1.55, oy + 0.55, oy + 0.95, 0.97, 1.3); P.box('ts_screen', ox + 1.24, ox + 1.51, oy + 0.535, oy + 0.55, 1.02, 1.26)   # the terminal, lit
    P.drum('ts_barrel', ox - 2.3, oy + 1.4, 0.0, 0.9, 0.45, 16); P.drum('black', ox - 2.3, oy + 1.4, 0.9, 0.93, 0.47, 16)            # a second barrel, bare
    P.drum('black', ox + 2.9, oy + 1.2, 0.0, 0.04, 0.3, 10); P.bar('chrome', (ox + 2.9, oy + 1.2, 0.04), (ox + 2.9, oy + 1.2, 1.7), 0.02)   # a spinner rack, its pegs bare
    for z in (0.6, 1.0, 1.4):
        for k in range(6): a = k * 1.047; P.bar('chrome', (ox + 2.9, oy + 1.2, z), (ox + 2.9 + 0.28 * math.cos(a), oy + 1.2 + 0.28 * math.sin(a), z + 0.04), 0.008)
    P.box('ts_case', ox - 1.8, ox - 0.4, oy - 0.9, oy - 0.3, 0.0, 0.4); P.box('black', ox - 1.75, ox - 0.45, oy - 0.92, oy - 0.9, 0.05, 0.35)   # a display knocked over on its face
    for _ in range(40):                                                                                # the scratchers, spilled in a trail
        u, v = ox + rng.uniform(-0.6, 2.2), oy + rng.uniform(-0.8, 0.4); P.box(('haz', 'teal', 'red', 'blue', 'white')[rng.randint(5)], u, u + 0.06, v, v + 0.1, 0.0, 0.004)


def pallets(P, ox, oy, rng):
    """empty pallets: a stack of six where the water was, two thrown down, a pallet jack left with its handle up"""
    def pallet(x, y, z, rot=False):
        if not rot:
            for k in range(7): P.box('ts_pallet', x + k * 0.19, x + k * 0.19 + 0.1, y, y + 1.0, z + 0.12, z + 0.14)
            for v in (0.0, 0.45, 0.9): P.box('ts_pallet_d', x, x + 1.2, y + v, y + v + 0.1, z, z + 0.12)
        else:
            for k in range(6): P.box('ts_pallet', x, x + 1.0, y + k * 0.22, y + k * 0.22 + 0.1, z + 0.12, z + 0.14)
            for u in (0.0, 0.45, 0.9): P.box('ts_pallet_d', x + u, x + u + 0.1, y, y + 1.2, z, z + 0.12)
    for k in range(6): pallet(ox - 1.8, oy + 0.9, k * 0.145)
    pallet(ox - 0.2, oy + 0.2, 0.0, True); pallet(ox + 1.0, oy + 1.2, 0.0)
    for k in range(3): pallet(ox + 0.4, oy + 2.4, k * 0.145, True)
    pallet(ox - 3.2, oy + 0.3, 0.0); pallet(ox - 2.8, oy + 1.7, 0.0, True)
    P.box('red', ox + 1.0, ox + 1.55, oy - 0.1, oy + 0.15, 0.0, 0.12); P.box('red', ox + 1.15, ox + 1.4, oy - 1.4, oy - 0.1, 0.02, 0.07)   # the jack's forks
    P.box('red', ox + 1.05, ox + 1.15, oy - 1.4, oy - 0.1, 0.02, 0.07); P.bar('red', (ox + 1.3, oy + 0.05, 0.12), (ox + 1.3, oy + 0.3, 1.2), 0.025)
    P.bar('black', (ox + 1.15, oy + 0.3, 1.2), (ox + 1.45, oy + 0.3, 1.2), 0.025)
    for _ in range(8): u, v = ox + rng.uniform(-2.2, 2.2), oy + rng.uniform(-0.5, 2.5); P.box('ts_pallet', u, u + rng.uniform(0.3, 1.0), v, v + 0.1, 0.0, 0.02)   # broken slats


def water(P, ox, oy, rng):
    """cases of bottled water on two pallets: one stack still in its wrap, torn, the other half taken; the empties crushed round them"""
    for (x0, keep) in ((ox - 2.0, 1.0), (ox - 0.6, 0.45), (ox + 0.8, 0.8)):
        for k in range(7): P.box('ts_pallet', x0 + k * 0.19, x0 + k * 0.19 + 0.1, oy + 0.4, oy + 1.4, 0.12, 0.14)
        for v in (0.0, 0.45, 0.9): P.box('ts_pallet_d', x0, x0 + 1.2, oy + 0.4 + v, oy + 0.5 + v, 0.0, 0.12)
        for lev in range(6):
            for i in range(3):
                for j in range(3):
                    if rng.rand() > keep * (1.0 - lev * 0.06): continue
                    x, y, z = x0 + 0.02 + i * 0.39, oy + 0.42 + j * 0.32, 0.14 + lev * 0.22
                    P.box('ts_water', x, x + 0.38, y, y + 0.31, z, z + 0.21); P.box('ts_cap', x + 0.03, x + 0.35, y + 0.03, y + 0.28, z + 0.21, z + 0.215)
    P.box('ts_wrap', ox - 2.02, ox - 0.78, oy + 0.38, oy + 0.4, 0.6, 1.45)                                # the wrap, torn down to the waist
    for _ in range(36): u, v = ox + rng.uniform(-2.3, 2.3), oy + rng.uniform(-0.7, 0.4); P.drum(('ts_water', 'ts_cap', 'white')[rng.randint(3)], u, v, 0.0, 0.05, 0.035, 6)


def booths(P, ox, oy, rng):
    """the deli's booths, three side by side: red vinyl benches back to back, laminate tables, a napkin box; one bench slashed to the foam"""
    for k in range(3):
        x0 = ox - 2.25 + k * 1.55; x1 = x0 + 1.35
        for (ya, yb, back) in ((oy + 0.3, oy + 0.85, oy + 0.3), (oy + 1.75, oy + 2.3, oy + 2.15)):
            P.box('ts_bench', x0, x1, ya, yb, 0.0, 0.42); P.box('ts_vinyl', x0 + 0.02, x1 - 0.02, ya + 0.02, yb - 0.02, 0.42, 0.48)
            P.box('ts_vinyl', x0, x1, back, back + 0.15, 0.48, 1.1)
        P.drum('chrome', (x0 + x1) / 2, oy + 1.3, 0.0, 0.72, 0.04, 8); P.box('sc_top', x0 + 0.05, x1 - 0.05, oy + 0.95, oy + 1.65, 0.72, 0.75)
        if k == 1:                                                                                  # slashed to the foam
            P.box('chalk', x0 + 0.3, x0 + 0.9, oy + 0.4, oy + 0.75, 0.48, 0.5); P.box('chalk', x0 + 0.4, x0 + 1.0, oy + 2.15, oy + 2.16, 0.6, 0.95)
        else:
            P.box('black', x0 + 0.5, x0 + 0.7, oy + 1.2, oy + 1.35, 0.75, 0.88)                         # a napkin box
        if rng.rand() < 0.7: P.drum(('white', 'red')[rng.randint(2)], x0 + rng.uniform(0.3, 1.0), oy + rng.uniform(1.0, 1.6), 0.75, 0.88, 0.045, 8)
    for _ in range(10): u, v = ox + rng.uniform(-2.5, 2.5), oy + rng.uniform(-0.5, 2.6); P.box(('paper', 'white', 'red')[rng.randint(3)], u, u + 0.12, v, v + 0.1, 0.0, 0.01)


def hotcase(P, ox, oy, rng):
    """the hot food case on its counter: the roller grill (its rollers bare), the pizza warmer's glass, the heated case with its glass
    broken out and the trays still in it; a menu board on the back panel, gone dark"""
    P.box('ts_counter', ox - 1.8, ox + 1.8, oy + 0.3, oy + 1.2, 0.0, 0.9); P.box('sc_top', ox - 1.85, ox + 1.85, oy + 0.25, oy + 1.25, 0.9, 0.94)
    P.box('ts_kick', ox - 1.75, ox + 1.75, oy + 0.28, oy + 0.3, 0.0, 0.12)
    P.box('ts_steel', ox - 1.6, ox - 0.5, oy + 0.45, oy + 1.1, 0.94, 1.08)                              # the roller grill
    for k in range(9): P.tube_x('chrome', ox - 1.55, ox - 0.55, oy + 0.5 + k * 0.07, 1.1, 0.022, 8)
    P.box('ts_steel', ox - 0.3, ox + 0.5, oy + 0.45, oy + 1.1, 0.94, 1.0); P.box('glass_d', ox - 0.28, ox + 0.48, oy + 0.45, oy + 0.47, 1.0, 1.45)   # the warmer
    P.box('ts_steel', ox - 0.3, ox + 0.5, oy + 0.45, oy + 1.1, 1.45, 1.5)
    for z in (1.05, 1.25): P.box('ts_wire', ox - 0.26, ox + 0.46, oy + 0.5, oy + 1.05, z, z + 0.015)
    P.box('ts_steel', ox + 0.7, ox + 1.7, oy + 0.45, oy + 1.1, 0.94, 1.02)                              # the heated case, its glass out
    for x in (ox + 0.72, ox + 1.66): P.box('chrome', x, x + 0.03, oy + 0.45, oy + 0.5, 1.02, 1.45)
    P.box('ts_steel', ox + 0.7, ox + 1.7, oy + 0.45, oy + 1.1, 1.45, 1.5)
    for x in (ox + 0.8, ox + 1.25): P.box('ts_steel', x, x + 0.4, oy + 0.6, oy + 1.0, 1.02, 1.06)       # the trays
    for _ in range(18): u, v = ox + rng.uniform(0.3, 2.3), oy + rng.uniform(-0.5, 0.25); P.box('glassbit', u, u + rng.uniform(0.03, 0.1), v, v + 0.06, 0.0, 0.008)
    P.box('ts_panel', ox - 1.8, ox + 1.8, oy + 1.25, oy + 1.32, 0.94, 2.0); P.box('black', ox - 1.4, ox + 1.4, oy + 1.24, oy + 1.25, 1.55, 1.95)   # the menu board, dark
    P.box('ts_strip', ox - 1.8, ox + 1.8, oy + 1.2, oy + 1.32, 2.0, 2.06)


def island(P, ox, oy, rng):
    """the coffee and soda island: a counter 5 m by 2.2 on cabinets, the brewers and their pots, the fountain tower at one end, the cups' shelf
    on posts over it, lids and sleeves in a drift round its foot"""
    x0, x1, y0, y1 = ox - 2.5, ox + 2.5, oy + 0.4, oy + 2.6
    P.box('ts_counter', x0, x1, y0, y1, 0.0, 0.92); P.box('sc_top', x0 - 0.04, x1 + 0.04, y0 - 0.04, y1 + 0.04, 0.92, 0.96)
    P.box('ts_kick', x0, x1, y0 - 0.02, y0, 0.0, 0.12)
    for k in range(6): P.box('black', x0 + 0.1 + k * 0.82, x0 + 0.12 + k * 0.82, y0 - 0.005, y0, 0.15, 0.85)   # its doors
    for k in range(4):                                                                                 # the brewers
        x = x0 + 0.3 + k * 0.85; P.box('ts_steel', x, x + 0.5, y0 + 0.1, y0 + 0.55, 0.96, 1.5); P.box('black', x + 0.05, x + 0.45, y0 + 0.05, y0 + 0.1, 1.1, 1.4)
        if rng.rand() < 0.6: P.drum('glass_d', x + 0.25, y0 - 0.0, 0.96, 1.12, 0.07, 8)
    P.box('ts_fount', x1 - 1.1, x1 - 0.1, y0 + 0.9, y1 - 0.2, 0.96, 1.85); P.box('black', x1 - 1.05, x1 - 0.15, y0 + 0.88, y0 + 0.9, 1.2, 1.6)   # the fountain tower
    for k in range(6): P.box('chrome', x1 - 1.0 + k * 0.14, x1 - 0.95 + k * 0.14, y0 + 0.82, y0 + 0.88, 1.15, 1.22)
    for (u, v) in ((x0 + 0.1, y0 + 1.0), (x1 - 0.2, y0 + 1.0), (x0 + 0.1, y1 - 0.2), (x1 - 0.2, y1 - 0.2)): P.box('ts_steel', u, u + 0.08, v, v + 0.08, 0.96, 1.95)
    P.box('ts_panel', x0, x1, y0 + 1.0, y1 - 0.1, 1.95, 2.0)                                            # the cups' shelf
    for k in range(10): P.drum(('white', 'red', 'white')[k % 3], x0 + 0.3 + k * 0.45, y0 + 1.5, 2.0, 2.0 + rng.uniform(0.15, 0.4), 0.05, 8)
    for _ in range(40): u, v = ox + rng.uniform(-3.2, 3.2), oy + rng.uniform(-0.5, 0.35); P.drum(('white', 'black', 'tan')[rng.randint(3)], u, v, 0.0, 0.01, rng.uniform(0.03, 0.05), 8)


def counter(P, ox, oy, rng):
    """the checkout counter, 11 m with its ends finished (two side by side leave a way through): four registers with their drawers all open
    and empty, the card readers, a glass case; behind it the cigarette wall, its slots bare"""
    x0, x1, y0 = ox - 5.5, ox + 5.5, oy + 0.3
    P.box('ts_counter', x0, x1, y0, y0 + 0.8, 0.0, 1.0); P.box('sc_top', x0 - 0.03, x1 + 0.03, y0 - 0.05, y0 + 0.83, 1.0, 1.04)
    P.box('ts_kick', x0, x1, y0 - 0.02, y0, 0.0, 0.12)
    P.box('ts_stripe', x0, x1, y0 - 0.025, y0 - 0.02, 0.6, 0.72)                                       # the counter's front, the stripe
    for k in range(4):
        x = x0 + 1.0 + k * 2.8; P.box('black', x, x + 0.4, y0 + 0.35, y0 + 0.75, 1.04, 1.12); P.box('ts_screen_d', x + 0.05, x + 0.35, y0 + 0.55, y0 + 0.6, 1.12, 1.42)
        P.box('ts_steel', x - 0.05, x + 0.45, y0 + 0.83, y0 + 1.25, 0.82, 0.95)                          # its drawer, open toward the till side, empty
        P.box('black', x + 0.6, x + 0.75, y0 + 0.1, y0 + 0.25, 1.04, 1.15)                               # the card reader
    P.box('ts_case', x1 - 2.0, x1 - 0.4, y0 + 0.05, y0 + 0.75, 1.04, 1.5); P.box('glass_d', x1 - 1.98, x1 - 0.42, y0 + 0.04, y0 + 0.06, 1.06, 1.48)
    yb = y0 + 2.0                                                                                     # the cigarette wall behind, bare
    P.box('ts_panel', x0 + 0.3, x1 - 0.3, yb, yb + 0.4, 0.0, 2.2); P.box('ts_strip', x0 + 0.3, x1 - 0.3, yb - 0.02, yb, 2.0, 2.2)
    for z in (1.0, 1.25, 1.5, 1.75):
        P.box('black', x0 + 0.3, x1 - 0.3, yb - 0.02, yb, z, z + 0.2)
        for k in range(int((x1 - x0 - 0.6) / 0.09)):
            if rng.rand() < 0.04: x = x0 + 0.32 + k * 0.09; P.box(('red', 'white', 'haz')[rng.randint(3)], x, x + 0.06, yb - 0.1, yb - 0.02, z + 0.01, z + 0.18)
    for _ in range(16): u, v = ox + rng.uniform(-5.5, 5.5), oy + rng.uniform(-0.6, 0.25); P.box(('paper', 'white')[rng.randint(2)], u, u + 0.08, v, v + 0.2, 0.0, 0.004)   # receipts


def wall_ew(P, ox, oy, rng):
    """the building's block wall, a tile long: concrete block in 0.2 m courses, painted, a dark wainscot to a metre, the travel center's
    stripe, a cap; scuffs and grime; an empty extinguisher box; the conduit along its top"""
    P.box('ts_wain', ox - 6.0, ox + 6.0, oy, oy + 0.3, 0.0, 1.0); P.box('ts_wall', ox - 6.0, ox + 6.0, oy, oy + 0.3, 1.15, WALL_H)
    P.box('ts_stripe', ox - 6.0, ox + 6.0, oy - 0.005, oy + 0.3, 1.0, 1.15)
    for k in range(1, 10): z = 1.15 + k * 0.2; P.box('ts_course', ox - 6.0, ox + 6.0, oy - 0.004, oy, z - 0.006, z + 0.006)   # the courses
    for k in range(30): x = ox - 6.0 + k * 0.4 + (0.2 if k % 2 else 0); P.box('ts_course', x - 0.006, x + 0.006, oy - 0.004, oy, 1.2, 1.35)
    P.box('ts_wallcap', ox - 6.0, ox + 6.0, oy - 0.02, oy + 0.32, WALL_H, WALL_H + 0.05)
    P.bar('ts_steel', (ox - 6.0, oy - 0.05, WALL_H - 0.15), (ox + 6.0, oy - 0.05, WALL_H - 0.15), 0.025)
    x = ox + 2.4; P.box('ts_extbox', x, x + 0.4, oy - 0.12, oy, 1.3, 2.05); P.box('black', x + 0.05, x + 0.35, oy - 0.125, oy - 0.12, 1.4, 1.95)
    for _ in range(14): u, z = ox + rng.uniform(-5.8, 5.6), rng.uniform(0.1, 2.6); P.box('stain', u, u + rng.uniform(0.2, 0.9), oy - 0.006, oy - 0.004, z, z + rng.uniform(0.05, 0.4))
    for _ in range(3): u = ox + rng.uniform(-5.5, 5.0); P.box('ts_course', u, u + 0.4, oy - 0.008, oy - 0.004, rng.uniform(1.3, 2.4), 0.0 + rng.uniform(2.5, 2.9))   # a block knocked out, its hole


def wall_ns(P, ox, oy, rng):
    P.box('ts_wain', ox - 0.15, ox + 0.15, oy, oy + 12.0, 0.0, 1.0); P.box('ts_wall', ox - 0.15, ox + 0.15, oy, oy + 12.0, 1.15, WALL_H)
    P.box('ts_stripe', ox - 0.16, ox + 0.16, oy, oy + 12.0, 1.0, 1.15)
    P.box('ts_wallcap', ox - 0.17, ox + 0.17, oy, oy + 12.0, WALL_H, WALL_H + 0.05)
    P.bar('ts_steel', (ox + 0.2, oy, WALL_H - 0.15), (ox + 0.2, oy + 12.0, WALL_H - 0.15), 0.025)


# the bay's pieces
def wheelset(P, cx, cy, r=0.52, w=0.28, dual=True):
    """a truck wheel (dual if asked) on an axle along x: the tyres, the rim"""
    for dx in ((-0.18, 0.18) if dual else (0.0,)):
        P.prism_x('black', cx + dx - w / 2, cx + dx + w / 2, [(cy + r * math.cos(6.2832 * i / 18), 0.0 + r + r * math.sin(6.2832 * i / 18)) for i in range(18)])
    P.prism_x('ts_rim', cx - 0.4 if dual else cx - 0.16, cx + 0.4 if dual else cx + 0.16, [(cy + 0.26 * math.cos(6.2832 * i / 10), r + 0.26 * math.sin(6.2832 * i / 10)) for i in range(10)])


def trailer(P, ox, oy, rng):
    """a 40-foot dry van on its landing legs, east to west: its box of ribbed aluminium, the logistic posts, a lighter patch where its name
    was painted out, rust run down from the roof's rivets, the tandem axles at its east end, mud flaps, the landing legs to the west"""
    x0, x1, y0, y1 = ox - 5.8, ox + 5.8, oy + 0.3, oy + 2.9
    P.box('ts_van', x0, x1, y0, y1, 1.25, 4.05); P.box('ts_van_roof', x0, x1, y0 + 0.02, y1 - 0.02, 4.05, 4.1)
    for k in range(int((x1 - x0) / 0.6) + 1): x = x0 + k * 0.6; P.box('ts_post', x - 0.03, x + 0.03, y0 - 0.025, y0, 1.25, 4.05)
    P.box('ts_rail', x0, x1, y0 - 0.04, y0, 1.18, 1.32); P.box('ts_rail', x0, x1, y0 - 0.03, y0, 3.95, 4.08)
    P.box('ts_van_patch', ox - 3.2, ox + 2.4, y0 - 0.031, y0 - 0.026, 2.1, 3.5)                         # the name painted out
    for _ in range(6): u = rng.uniform(x0 + 0.3, x1 - 0.5); P.box('stain', u, u + rng.uniform(0.04, 0.1), y0 - 0.035, y0 - 0.03, rng.uniform(3.0, 3.7), 4.0)   # rust down from the rivets
    for _ in range(7): TG.bloom(P, 'ts_rust', rng.uniform(x0 + 0.5, x1 - 0.5), rng.uniform(y0 + 0.3, y1 - 0.3), rng.uniform(0.2, 0.5), rng, 5)   # on its roof
    for x in (ox + 3.4, ox + 4.7): wheelset(P, x, y0 + 0.35); wheelset(P, x, y1 - 0.35)
    P.box('ts_frame', ox + 2.6, ox + 5.5, y0 + 0.5, y1 - 0.5, 0.9, 1.25); P.box('black', x1 - 0.25, x1 - 0.2, y0 - 0.05, y0 + 0.05, 0.25, 0.9)   # the bogie, a mud flap
    P.box('ts_frame', x1 - 0.1, x1, y0, y1, 0.5, 0.65)                                                   # the underride bar
    for y in (y0 + 0.4, y1 - 0.4):                                                                   # the landing legs, down
        P.box('ts_frame', ox - 3.6, ox - 3.45, y - 0.08, y + 0.08, 0.1, 1.25); P.box('ts_frame', ox - 3.75, ox - 3.3, y - 0.2, y + 0.2, 0.0, 0.1)
    P.bar('ts_frame', (ox - 3.5, y0 + 0.4, 0.8), (ox - 3.5, y1 - 0.4, 0.8), 0.03); P.box('ts_steel', ox - 3.5, ox - 3.4, y0 - 0.1, y0 + 0.05, 0.75, 0.85)   # its crank
    P.box('black', x0, ox + 2.6, y0 + 1.0, y1 - 1.0, 1.05, 1.25)                                         # the floor's cross-members, dark under it


def cab(P, ox, oy, rng):
    """a tractor's cab with its nose to the camera, uncoupled: the tilt hood swung forward and down in front of the bumper (its inside showing),
    the engine open, the front wheels, the cab and its glass (one pane starred), the stacks, the tanks, the frame rails to the fifth wheel,
    the drive axles"""
    xc = ox; y0 = oy + 0.35
    P.poly('ts_cab', [(xc - 1.15, y0), (xc + 1.15, y0), (xc + 1.25, y0 + 0.5), (xc - 1.25, y0 + 0.5)], 0.25, 0.6)          # the hood, swung down: its top now faces us
    P.box('ts_cab', xc - 1.2, xc + 1.2, y0 + 0.35, y0 + 0.55, 0.6, 1.9); P.box('ts_hood_in', xc - 1.0, xc + 1.0, y0 + 0.55, y0 + 0.6, 0.7, 1.8)
    P.box('chrome', xc - 0.5, xc + 0.5, y0 + 0.3, y0 + 0.35, 0.3, 1.0)                                    # the grille, upside down at its foot
    P.box('chrome', xc - 1.25, xc + 1.25, y0 + 0.7, y0 + 0.95, 0.35, 0.7)                                 # the bumper
    for x in (xc - 0.45, xc + 0.45): P.box('ts_frame', x - 0.08, x + 0.08, y0 + 0.9, y0 + 6.6, 0.55, 0.85)  # the frame rails
    P.box('ts_rad', xc - 0.65, xc + 0.65, y0 + 1.0, y0 + 1.15, 0.6, 1.75)                                # the radiator
    P.box('ts_engine', xc - 0.5, xc + 0.5, y0 + 1.3, y0 + 2.6, 0.75, 1.7); P.box('ts_engine', xc - 0.35, xc + 0.35, y0 + 1.4, y0 + 2.5, 1.7, 1.9)
    P.drum('ts_steel', xc + 0.62, y0 + 1.9, 1.2, 1.55, 0.18, 10); P.bar('black', (xc + 0.5, y0 + 1.6, 1.5), (xc + 0.9, y0 + 2.3, 1.7), 0.05)   # the turbo, a hose off
    wheelset(P, xc - 1.05, y0 + 1.75, 0.52, 0.32, dual=False); wheelset(P, xc + 1.05, y0 + 1.75, 0.52, 0.32, dual=False)
    P.box('ts_cab', xc - 1.25, xc + 1.25, y0 + 2.6, y0 + 4.7, 1.0, 2.95); P.box('ts_cab', xc - 1.2, xc + 1.2, y0 + 2.7, y0 + 4.6, 2.95, 3.05)
    P.box('glass_d', xc - 1.05, xc + 1.05, y0 + 2.58, y0 + 2.6, 2.0, 2.8); P.box('ts_frame', xc - 0.03, xc + 0.03, y0 + 2.57, y0 + 2.58, 2.0, 2.8)
    P.box('glassbit', xc + 0.2, xc + 0.6, y0 + 2.565, y0 + 2.57, 2.3, 2.6)                                   # a pane starred
    for s in (-1, 1): P.bar('chrome', (xc + s * 1.25, y0 + 2.8, 2.4), (xc + s * 1.55, y0 + 2.6, 2.3), 0.025); P.box('black', min(xc + s * 1.5, xc + s * 1.62), max(xc + s * 1.5, xc + s * 1.62), y0 + 2.5, y0 + 2.7, 1.9, 2.5)   # its mirrors
    for s in (-1, 1):
        P.prism_y('chrome', y0 + 3.2, y0 + 4.5, [(xc + s * 1.3 + 0.32 * math.cos(6.2832 * i / 12), 0.95 + 0.32 * math.sin(6.2832 * i / 12)) for i in range(12)])   # the tanks
        P.drum('chrome', xc + s * 1.05, y0 + 4.85, 1.5, 3.9, 0.08, 8)                                         # the stacks
    P.box('black', xc - 1.0, xc + 1.0, y0 + 4.7, y0 + 4.75, 1.0, 2.9)                                       # the cab's back
    P.box('ts_steel', xc - 0.9, xc + 0.9, y0 + 5.4, y0 + 6.3, 1.1, 1.2); P.box('black', xc - 0.15, xc + 0.15, y0 + 5.4, y0 + 5.9, 1.2, 1.21)   # the fifth wheel
    for y in (y0 + 5.2, y0 + 6.4): wheelset(P, xc - 0.95, y, 0.52, 0.28); wheelset(P, xc + 0.95, y, 0.52, 0.28)
    for _ in range(3): TG.bloom(P, 'black', xc + rng.uniform(-0.4, 0.4), y0 + rng.uniform(1.4, 2.6), rng.uniform(0.3, 0.5), rng, 5)   # its oil under it


def lift(P, ox, oy, rng):
    """a drive-on four-post lift, raised to 1.8 m, east to west: its posts and cross-beams, the two runways and their ramps, a pickup on it
    with all four wheels gone, its hubs bare; the lug nuts in a hubcap on the floor"""
    x0, x1, y0, y1, zr = ox - 2.9, ox + 2.9, oy + 0.4, oy + 3.6, 1.8
    for (x, y) in ((x0, y0), (x1, y0), (x0, y1), (x1, y1)): P.box('ts_lift', x - 0.15, x + 0.15, y - 0.15, y + 0.15, 0.0, 2.6); P.box('ts_lift', x - 0.25, x + 0.25, y - 0.25, y + 0.25, 0.0, 0.05)
    for x in (x0, x1): P.box('ts_lift', x - 0.12, x + 0.12, y0 - 0.1, y1 + 0.1, zr - 0.2, zr)
    for (a, b) in ((y0 + 0.45, y0 + 1.0), (y1 - 1.0, y1 - 0.45)):
        P.box('ts_lift', x0 + 0.1, x1 - 0.1, a, b, zr - 0.12, zr); P.box('black', x0 + 0.1, x1 - 0.1, a + 0.05, b - 0.05, zr, zr + 0.005)
        P.poly('ts_lift', [(x1 - 0.1, a), (x1 + 1.0, a), (x1 + 1.0, b), (x1 - 0.1, b)], zr - 0.12, zr - 0.05)   # the ramp, up
    P.box('haz', x0 - 0.15, x0 + 0.15, y0 - 0.16, y0 - 0.15, 0.3, 2.4)
    zb = zr + 0.55; yc = (y0 + y1) / 2                                                                    # the pickup, nose east, on its axles
    P.box('ts_truck', x0 + 0.1, x1 - 1.6, yc - 0.95, yc + 0.95, zb, zb + 0.6)                              # the bed
    P.box('black', x0 + 0.2, x1 - 1.7, yc - 0.85, yc + 0.85, zb + 0.6, zb + 0.61)
    P.box('ts_truck', x1 - 1.6, x1 + 0.4, yc - 0.95, yc + 0.95, zb, zb + 1.2); P.box('glass_d', x1 - 1.55, x1 - 1.0, yc - 0.96, yc + 0.96, zb + 0.65, zb + 1.1)   # the cab
    P.box('ts_truck', x1 + 0.4, x1 + 1.6, yc - 0.92, yc + 0.92, zb, zb + 0.55)                             # the hood
    P.box('chrome', x1 + 1.6, x1 + 1.68, yc - 0.95, yc + 0.95, zb - 0.1, zb + 0.15)
    for x in (x0 + 0.9, x1 + 0.8):                                                                       # the hubs, bare: no wheels
        for s in (-1, 1): P.prism_x('ts_rim', x - 0.08, x + 0.08, [(yc + s * 0.88 + 0.16 * math.cos(6.2832 * i / 8), zb - 0.1 + 0.16 * math.sin(6.2832 * i / 8)) for i in range(8)])
        P.box('ts_frame', x - 0.06, x + 0.06, yc - 0.85, yc + 0.85, zb - 0.2, zb - 0.05)
    P.drum('chrome', ox - 0.5, oy - 0.3, 0.0, 0.05, 0.2, 14); P.drum('black', ox - 0.5, oy - 0.3, 0.05, 0.055, 0.15, 12)   # the hubcap, the nuts in it
    for _ in range(3): TG.bloom(P, 'black', ox + rng.uniform(-2.0, 2.0), oy + rng.uniform(0.8, 3.2), rng.uniform(0.25, 0.5), rng, 5)


def tires(P, ox, oy, rng):
    """truck tires stacked by the wall: five stacks of five to seven, a stack fallen and rolled, a row stood on edge in a rack"""
    for (dx, dy, n) in ((-1.8, 0.8, 6), (-0.7, 0.7, 7), (0.4, 0.9, 5), (1.5, 0.7, 6), (-1.2, 1.9, 4)):
        for k in range(n): P.drum('black', ox + dx, oy + dy, k * 0.26, k * 0.26 + 0.25, 0.52, 18); P.drum('under', ox + dx, oy + dy, k * 0.26 + 0.25, k * 0.26 + 0.255, 0.3, 14)
    for k in range(3): P.wheel('black', ox + 2.6 + k * 0.05, oy + 0.3 + k * 0.6, 0.52, 0.52, 0.26, 18)      # rolled off, on edge
    P.box('ts_frame', ox + 0.9, ox + 2.6, oy + 1.9, oy + 2.0, 0.0, 1.1); P.box('ts_frame', ox + 0.9, ox + 2.6, oy + 2.5, oy + 2.6, 0.0, 1.1)   # a rack, its row
    for k in range(6): P.prism_x('black', ox + 0.95 + k * 0.28, ox + 1.2 + k * 0.28, [(oy + 2.25 + 0.5 * math.cos(6.2832 * i / 16), 0.52 + 0.5 * math.sin(6.2832 * i / 16)) for i in range(16)])


def toolchest(P, ox, oy, rng):
    """a roll cab and its top chest, red, the drawers pulled and empty, a few tools on the floor; a creeper; a floor jack, its handle out"""
    x0, x1, y0 = ox - 0.9, ox + 0.9, oy + 0.4
    P.box('ts_tool', x0, x1, y0, y0 + 0.6, 0.15, 1.05); P.box('black', x0, x1, y0, y0 + 0.6, 1.05, 1.08)
    P.box('ts_tool', x0 + 0.05, x1 - 0.05, y0 + 0.05, y0 + 0.55, 1.08, 1.55); P.box('ts_tool', x0 + 0.03, x1 - 0.03, y0 + 0.03, y0 + 0.57, 1.55, 1.6)
    for (xx, yy) in ((x0 + 0.1, y0 + 0.1), (x1 - 0.1, y0 + 0.1), (x0 + 0.1, y0 + 0.5), (x1 - 0.1, y0 + 0.5)): P.drum('black', xx, yy, 0.0, 0.15, 0.07, 8)
    for k in range(6):
        z = 0.2 + k * 0.14; P.box('chrome', x0 + 0.1, x1 - 0.1, y0 - 0.03, y0, z + 0.1, z + 0.12)            # the pulls
        if k in (1, 3, 4): P.box('ts_tool', x0 + 0.05, x1 - 0.05, y0 - 0.45, y0, z, z + 0.11); P.box('black', x0 + 0.1, x1 - 0.1, y0 - 0.42, y0 - 0.02, z + 0.11, z + 0.112)   # pulled, empty
    for _ in range(7): u, v = ox + rng.uniform(-1.6, 1.6), oy + rng.uniform(-0.8, 0.2); a = rng.uniform(0, 3.14); P.bar('chrome', (u, v, 0.02), (u + 0.25 * math.cos(a), v + 0.25 * math.sin(a), 0.02), 0.015)
    x2 = ox + 1.0; P.box('ts_tool_b', x2, x2 + 1.4, y0 + 0.1, y0 + 0.7, 0.15, 1.0); P.box('black', x2, x2 + 1.4, y0 + 0.1, y0 + 0.7, 1.0, 1.03)   # a second roll cab, its drawers shut
    for k in range(5): P.box('chrome', x2 + 0.1, x2 + 1.3, y0 + 0.08, y0 + 0.1, 0.3 + k * 0.14, 0.32 + k * 0.14)
    for (xx, yy) in ((x2 + 0.1, y0 + 0.2), (x2 + 1.3, y0 + 0.2), (x2 + 0.1, y0 + 0.6), (x2 + 1.3, y0 + 0.6)): P.drum('black', xx, yy, 0.0, 0.15, 0.07, 8)
    P.box('ts_wood', ox - 1.0, ox + 2.4, oy + 1.3, oy + 2.0, 0.85, 0.92); P.box('ts_frame', ox - 0.95, ox + 2.35, oy + 1.35, oy + 1.95, 0.0, 0.85)   # the workbench behind
    P.box('ts_tool_b', ox + 1.7, ox + 2.1, oy + 1.25, oy + 1.5, 0.92, 1.08); P.box('chrome', ox - 0.6, ox + 0.4, oy + 1.6, oy + 1.7, 0.92, 1.3)   # its vise; a parts rack
    P.box('black', ox + 1.2, ox + 1.65, oy - 0.2, oy + 0.85, 0.06, 0.1)                                       # the creeper
    P.box('red', ox - 2.0, ox - 1.5, oy + 0.1, oy + 1.0, 0.0, 0.2); P.bar('red', (ox - 1.75, oy + 1.0, 0.15), (ox - 1.75, oy + 2.1, 0.7), 0.025)   # the floor jack


def drums(P, ox, oy, rng):
    """oil drums on a yellow spill pallet: six stood, one on its side and the oil out of it in a pool, a hand pump in one"""
    P.box('haz', ox - 1.3, ox + 1.3, oy + 0.3, oy + 1.6, 0.0, 0.3); P.box('black', ox - 1.25, ox + 1.25, oy + 0.35, oy + 1.55, 0.3, 0.31)
    cols = ('ts_drum_b', 'black', 'red', 'ts_drum_b', 'rustp', 'black')
    for i, (dx, dy) in enumerate(((-0.9, 0.65), (-0.3, 0.65), (0.3, 0.65), (0.9, 0.65), (-0.6, 1.25), (0.0, 1.25))):
        P.drum(cols[i], ox + dx, oy + dy, 0.31, 1.19, 0.29, 16); P.drum('under', ox + dx, oy + dy, 1.19, 1.2, 0.27, 14)
        for z in (0.6, 0.9): P.drum(cols[i], ox + dx, oy + dy, z, z + 0.02, 0.3, 16)
    P.drum('ts_steel', ox - 0.3, oy + 0.65, 1.2, 1.6, 0.04, 6); P.bar('ts_steel', (ox - 0.3, oy + 0.65, 1.5), (ox - 0.6, oy + 0.4, 1.45), 0.02)   # the hand pump
    P.box('haz', ox - 3.2, ox - 1.6, oy + 1.4, oy + 2.7, 0.0, 0.3); P.box('black', ox - 3.15, ox - 1.65, oy + 1.45, oy + 2.65, 0.3, 0.31)   # a second spill pallet, four
    for i, (dx, dy) in enumerate(((-2.8, 1.75), (-2.0, 1.75), (-2.8, 2.35), (-2.0, 2.35))):
        c_ = ('black', 'ts_drum_b', 'rustp', 'black')[i]; P.drum(c_, ox + dx, oy + dy, 0.31, 1.19, 0.29, 16); P.drum('under', ox + dx, oy + dy, 1.19, 1.2, 0.27, 14)
    for (dx, dy, c_) in ((-1.2, 2.4, 'red'), (-0.6, 2.2, 'ts_drum_b')): P.drum(c_, ox + dx, oy + dy, 0.0, 0.88, 0.29, 16)   # loose ones
    P.tube_x('rustp', ox + 1.2, ox + 2.08, oy + 0.25, 0.29, 0.29, 16)                                            # one on its side
    for _ in range(5): TG.bloom(P, 'black', ox + rng.uniform(1.6, 2.6), oy + rng.uniform(-0.6, 0.1), rng.uniform(0.3, 0.6), rng, 6)   # its oil, pooled


def compressor(P, ox, oy, rng):
    """the shop's air compressor: its tank on feet, the motor and the pump on top behind the belt guard, a drain hose; a tire changer beside it
    (its turntable, its post and head)"""
    P.tube_x('ts_comp', ox - 1.6, ox - 0.1, oy + 0.75, 0.55, 0.38, 16)
    for x in (ox - 1.4, ox - 0.3): P.box('ts_frame', x - 0.05, x + 0.05, oy + 0.45, oy + 1.05, 0.0, 0.3)
    P.box('ts_frame', ox - 1.5, ox - 0.2, oy + 0.55, oy + 0.95, 0.93, 0.97)
    P.box('ts_engine', ox - 1.4, ox - 0.9, oy + 0.6, oy + 0.95, 0.97, 1.3); P.box('ts_steel', ox - 0.8, ox - 0.35, oy + 0.6, oy + 0.95, 0.97, 1.4)
    P.box('red', ox - 1.0, ox - 0.8, oy + 0.55, oy + 1.0, 0.97, 1.35)                                           # the belt guard
    P.bar('black', (ox - 0.1, oy + 0.75, 0.3), (ox + 0.4, oy + 0.4, 0.02), 0.02)
    P.box('ts_tool', ox + 0.4, ox + 1.3, oy + 0.4, oy + 1.2, 0.0, 0.8); P.drum('chrome', ox + 0.85, oy + 0.8, 0.8, 0.86, 0.45, 18)   # the tire changer
    P.box('ts_tool', ox + 1.15, ox + 1.3, oy + 1.0, oy + 1.15, 0.8, 1.7); P.bar('ts_steel', (ox + 1.22, oy + 1.07, 1.65), (ox + 0.85, oy + 0.85, 1.6), 0.04)
    P.bar('ts_steel', (ox + 0.85, oy + 0.85, 1.6), (ox + 0.85, oy + 0.85, 1.0), 0.03)
    P.box('ts_tool_b', ox - 3.2, ox - 2.2, oy + 0.6, oy + 1.4, 0.0, 0.95); P.drum('chrome', ox - 2.7, oy + 0.55, 0.9, 1.1, 0.12, 10)   # a wheel balancer
    P.bar('chrome', (ox - 2.7, oy + 0.55, 1.0), (ox - 2.7, oy + 0.1, 1.0), 0.03)
    P.box('ts_comp', ox + 1.7, ox + 2.9, oy + 0.9, oy + 1.6, 0.0, 0.9); P.box('black', ox + 1.75, ox + 2.85, oy + 0.95, oy + 1.55, 0.9, 0.92)   # the parts washer, its lid up
    P.box('ts_comp', ox + 1.7, ox + 2.9, oy + 1.55, oy + 1.6, 0.9, 1.6)
    for k in range(10): a = k * 0.63; P.bar('black', (ox + 0.2 + 0.35 * math.cos(a), oy + 0.0 + 0.2 * math.sin(a), 0.02), (ox + 0.2 + 0.35 * math.cos(a + 0.63), oy + 0.2 * math.sin(a + 0.63), 0.02), 0.015)   # the hose, coiled


STORE_F = dict(cooler=cooler, shelving=shelving, wall_ew=wall_ew, counter=counter, wall_ns=wall_ns, island=island, hotcase=hotcase, booths=booths,
               water=water, endcap=endcap, stock=stock, jerky=jerky, pallets=pallets)
BAY_F = dict(trailer=trailer, lift=lift, cab=cab, tires=tires, toolchest=toolchest, drums=drums, compressor=compressor)


def ts_parts(P, rng):
    for k, f in STORE_F.items(): f(P, *TS_AT[k], rng)


def ts_bay_parts(P, rng):
    for k, f in BAY_F.items(): f(P, *BAY_AT[k], rng)


def ts_mats(bpy, NF, F, M, which):
    if which not in ('ts_pieces', 'ts_bay', 'tun_pieces'): return
    if which in ('ts_pieces', 'ts_bay'): SM.sm_mats(bpy, NF, F, M, 'sm_pieces')
    m = lambda n, role, step, mul: NF.material(bpy, n, role, step, mul)
    M.update(ts_shelf=m('in_paint_gondola_almond', 'clay_bone', 3, 0.86), ts_upright=m('in_paint_gondola_upright', 'clay_bone', 2, 0.9),
             ts_kick=m('in_black_kick', 'rubber', 2, 1.0), ts_strip=m('in_price_strip', 'tape_grey', 3, 0.85), ts_wire=m('in_wire_shelf', 'tape_grey', 2, 0.8),
             ts_frame=m('in_steel_frame_dark', 'tape_grey', 1, 0.85), ts_cool_top=m('in_panel_walkin', 'tape_grey', 1, 1.0), ts_cool_side=m('in_panel_walkin_side', 'tape_grey', 2, 0.8),
             ts_steel=m('in_steel_brushed', 'tape_grey', 2, 0.95), ts_barrel=m('in_wood_barrel', 'clay_rust', 2, 0.85), ts_wood=m('in_wood_stand', 'tape_masking', 1, 0.9),
             ts_case=m('in_paint_case_black', 'rubber', 3, 1.0), ts_screen=m('in_lit_screen_lottery', 'clay_teal', 4, 1.0), ts_screen_d=m('in_black_screen', 'rubber', 1, 1.0),
             ts_pallet=m('in_wood_pallet', 'tape_masking', 2, 0.85), ts_pallet_d=m('in_wood_pallet_dark', 'tape_masking', 1, 0.85),
             ts_water=m('in_plastic_water_blue', 'clay_teal', 3, 0.85), ts_cap=m('in_plastic_cap', 'clay_teal', 2, 0.9), ts_wrap=m('in_wrap_film', 'tape_grey', 4, 0.75),
             ts_bench=m('in_wood_bench_base', 'clay_rust', 0, 1.0), ts_vinyl=m('in_vinyl_booth_red', 'clay_rust', 2, 0.92), ts_counter=m('in_paint_counter_brown', 'clay_rust', 1, 0.95),
             ts_panel=m('in_paint_back_panel', 'clay_bone', 1, 0.95), ts_fount=m('in_paint_fountain_red', 'clay_rust', 2, 0.9), ts_stripe=m('in_paint_stripe_orange', 'clay_mustard', 2, 0.92),
             ts_wall=m('in_paint_block_bone', 'clay_bone', 3, 0.86), ts_wain=m('in_paint_wainscot', 'metal_painted', 1, 1.0), ts_course=m('in_block_joint', 'tape_grey', 1, 0.8),
             ts_wallcap=m('in_block_cap', 'tape_grey', 2, 0.9), ts_extbox=m('in_paint_ext_red', 'clay_rust', 2, 1.0),
             ts_van=m('in_alum_van_side', 'tape_grey', 3, 0.84), ts_van_roof=m('in_alum_van_roof', 'tape_grey', 3, 0.78), ts_post=m('in_alum_van_post', 'tape_grey', 2, 0.85),
             ts_rail=m('in_alum_van_rail', 'tape_grey', 2, 0.9), ts_van_patch=m('in_paint_van_patch', 'tape_grey', 4, 0.82), ts_rust=m('in_rust_streak', 'clay_rust', 2, 0.75),
             ts_rim=m('in_steel_rim', 'tape_grey', 2, 0.9), ts_cab=m('in_paint_cab_maroon', 'clay_rust', 1, 1.0), ts_hood_in=m('in_fibreglass_hood', 'clay_bone', 1, 1.0),
             ts_rad=m('in_radiator', 'rubber', 2, 1.0), ts_engine=m('in_paint_engine', 'metal_painted', 1, 1.0), ts_lift=m('in_paint_lift_blue', 'clay_teal', 1, 1.0),
             ts_truck=m('in_paint_pickup_white', 'tape_grey', 3, 0.85), ts_tool=m('in_paint_toolbox_red', 'clay_rust', 2, 0.95), ts_tool_b=m('in_paint_toolbox_blue', 'clay_teal', 1, 1.0), ts_drum_b=m('in_paint_drum_blue', 'clay_teal', 1, 1.0),
             ts_comp=m('in_paint_compressor', 'metal_painted', 2, 1.0))


TG.PARTS['ts_pieces'] = ts_parts
TG.PARTS['ts_bay'] = ts_bay_parts
TG.MAT_HOOKS.append(ts_mats)


# ---- the ceiling: the steel joists --------------------------------------------------------------------------------------------
def ceil_truckstop(P, rng):
    """the steel roof from under it: the metal deck (its ribs east to west), the joist girders on every bay's north line, open-web joists north
    to south every 2 m (their webs zigzag between the chords), a sprinkler main, a dead high-bay lamp in every bay, a skylight in every bay;
    rust and holes through to the sky inside each bay"""
    at = TG.at
    P.box('white', -3.0, 63.0, -3.0, 63.0, -0.4, -0.1)                                                            # the sky over it
    P.box('sm_sheet', -3.0, 63.0, -3.0, 63.0, 0.0, 0.04)                                                          # the deck
    for r in range(-1, 6):
        for k in range(0, 40):                                                                                 # its ribs, east to west
            if k % 2: continue
            y = at(0, r, 0, k * 0.3)[1]; P.box('under', -3.0, 63.0, y - 0.04, y, 0.04, 0.045)
    for r in range(-1, 6):
        y0, y1 = TG.band_y(r, 0.0, 0.5, 0.9); P.box('black', -3.0, 63.0, y0, y1, 0.04, 0.94)                      # the girders on every bay's line
        for c in range(-1, 6):
            for k in range(6):                                                                                 # the joists, every 2 m, their chords and webs
                x = c * TMT + k * 2.0 + 1.0
                if k == 0: continue
                ya, yb = at(c, r, x - c * TMT, 0.4, 0.0)[1], at(c, r, x - c * TMT, 11.6, 0.0)[1]
                P.box('sc_frame', x - 0.06, x + 0.06, yb, ya, 0.04, 0.09)
                ya2, yb2 = at(c, r, x - c * TMT, 0.4, 0.6)[1], at(c, r, x - c * TMT, 11.6, 0.6)[1]
                P.box('black', x - 0.07, x + 0.07, yb2, ya2, 0.6, 0.66)
                for j in range(12):
                    lyA, lyB = 0.4 + j * 0.93, 0.4 + (j + 1) * 0.93
                    p0 = (x, at(c, r, 0, lyA, 0.06)[1], 0.06); p1 = (x, at(c, r, 0, lyB, 0.6)[1], 0.6)
                    if j % 2: p0, p1 = (x, at(c, r, 0, lyA, 0.6)[1], 0.6), (x, at(c, r, 0, lyB, 0.06)[1], 0.06)
                    P.bar('sc_frame', p0, p1, 0.022)
    for r in range(-1, 6):
        _, y = at(0, r, 0, 7.0, 0.8); P.tube_x('rustp', -3.0, 63.0, y, 0.8, 0.07)                                  # the sprinkler main
    for r in range(5):
        for c in range(5):
            x, y = at(c, r, 6.0, 4.0, 1.4); P.drum('ts_lampshade', x, y, 1.0, 1.4, 0.32, 14, 0.06); P.drum('black', x, y, 0.995, 1.0, 0.28, 14)   # the high bay, dead
            x, y = at(c, r, 3.0, 9.2, 0.05); P.box('white', x - 1.0, x + 1.0, y - 0.6, y + 0.6, 0.046, 0.05)         # the skylight: day through it (over the deck)
            for u in (-1.0, 1.0): P.box('sc_frame', x + u - 0.05, x + u + 0.05, y - 0.62, y + 0.62, 0.05, 0.07)
            P.box('sc_frame', x - 1.05, x + 1.05, y - 0.04, y + 0.04, 0.05, 0.07)
            for _ in range(rng.randint(2, 5)):
                x, y = at(c, r, rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5), 0.05); TG.bloom(P, 'sm_sheet_r', x, y, rng.uniform(0.4, 0.9), rng, 6)
            if rng.rand() < 0.35:
                x, y = at(c, r, rng.uniform(2.0, 9.0), rng.uniform(2.0, 6.0), 0.06); P.box('white', x, x + rng.uniform(0.4, 1.1), y - 0.5, y, 0.06, 0.065)   # a hole


TG.CEILINGS['truckstop'] = (ceil_truckstop, 'truckstop/truckstop_ceiling.webp', "the steel roof from under it: the metal deck, the girders, open-web joists every 2 m, a sprinkler main, a dead high-bay lamp and a skylight in every bay, rust and holes through to the sky")
TG.CEIL_DATA['truckstop'] = 'truckstop/truckstop.json'


def ceil_mats(bpy, NF, F, M, which):
    if which != 'tun_pieces': return
    M.update(ts_lampshade=NF.material(bpy, 'in_ceil_lampshade', 'tape_grey', 2, 0.8))


TG.MAT_HOOKS.append(ceil_mats)

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(cooler='COVER', shelving='COVER', endcap='LOW_COVER', stock='COVER', jerky='LOW_COVER', pallets='LOW_COVER', water='COVER', booths='LOW_COVER',
            hotcase='COVER', island='COVER', counter='COVER', cab='COVER', trailer='COVER', lift='COVER', tires='COVER', toolchest='LOW_COVER', drums='LOW_COVER',
            compressor='LOW_COVER', wall_ew='WALL', wall_ns='WALL')
HM = dict(cooler=2.6, shelving=2.1, endcap=1.5, stock=1.3, jerky=1.8, pallets=1.2, water=1.5, booths=1.1, hotcase=2.06, island=2.4, counter=2.2, cab=3.9,
          trailer=4.1, lift=3.7, tires=1.8, toolchest=1.6, drums=1.6, compressor=1.7, wall_ew=WALL_H + 0.05, wall_ns=WALL_H + 0.05)
NAME = dict(cooler='THE COOLERS', shelving='SHELVING', endcap='AN END CAP', stock='PULLED-DOWN CASES', jerky='A JERKY STAND', pallets='EMPTY PALLETS',
            water='STACKED WATER', booths='DELI BOOTHS', hotcase='THE HOT FOOD CASE', island='THE COFFEE ISLAND', counter='THE COUNTER', cab="A TRACTOR'S CAB",
            trailer='A TRAILER', lift='A LIFT, RAISED', tires='STACKED TIRES', toolchest='A TOOL CHEST', drums='OIL DRUMS', compressor='THE COMPRESSOR',
            wall_ew="THE BUILDING'S WALL", wall_ns="THE BUILDING'S WALL")
# (west, east, south, north) metres round each piece from its foot; the north is its depth and its height drawn up the glass (1.45 a metre)
BOX = dict(cooler=(-6.0, 6.01, -0.75, 7.95 + 2.6 * 1.45 + 0.6), shelving=(-6.0, 6.01, -0.1, 7.7 + 2.6 * 1.45), wall_ew=(-6.0, 6.01, -0.3, 0.4 + (WALL_H + 0.1) * 1.45),
           counter=(-5.9, 5.9, -0.7, 2.8 + 2.3 * 1.45), wall_ns=(-0.6, 0.6, -0.05, 12.1 + (WALL_H + 0.1) * 1.45),
           island=(-3.4, 3.4, -0.6, 2.8 + 2.6 * 1.45), hotcase=(-2.1, 2.5, -0.6, 1.5 + 2.1 * 1.45), booths=(-2.7, 2.7, -0.6, 2.7 + 1.2 * 1.45), water=(-2.8, 2.8, -0.8, 1.5 + 1.6 * 1.45),
           endcap=(-6.0, 6.01, -2.6, 4.6 + 1.6 * 1.45), stock=(-2.8, 2.8, -0.6, 2.8 + 1.4 * 1.45), jerky=(-2.9, 3.4, -1.2, 1.9 + 1.9 * 1.45),
           pallets=(-3.4, 2.4, -1.6, 3.8 + 1.3 * 1.45),
           trailer=(-6.0, 6.0, -0.2, 3.0 + 4.2 * 1.45), lift=(-3.4, 4.8, -0.6, 3.9 + 3.7 * 1.45), cab=(-1.8, 1.8, -0.1, 7.2 + 4.0 * 1.45),
           tires=(-2.5, 3.2, -0.2, 2.8 + 2.0 * 1.45), toolchest=(-2.3, 2.7, -1.0, 2.2 + 1.7 * 1.45), drums=(-3.5, 3.2, -0.8, 2.9 + 1.4 * 1.45), compressor=(-3.5, 3.2, -0.4, 1.8 + 1.8 * 1.45))
WALLS = ('wall_ew', 'cooler', 'shelving', 'endcap')   # a tile long: runs meet
SHADOW = dict(wall_ns=0.5, endcap=1.0)



# the cut and the sheet are the inside kit's (tools/bohemia_cook7_inside_kit.py, rule 495(b): one thing, one place); this tool says what is its own
K = KIT.make(TG, kit='truckstop', prefix='ts_', floor_render='ts_floor', floor_lists=[('floor', STORE), ('ring', STORE), ('bay', BAY)], scenes=[('ts_pieces', TS_AT), ('ts_bay', BAY_AT)], box=BOX, kind=KIND, hm=HM, name=NAME, shadow=SHADOW,
             art_for="COMBAT FOUR's truck stop (slices/fight_ground/truckstop/truckstop.json, BUILD 11/21ze): the names its handoff asked for, the garage's format. floor.floor is the store's gritty tile (60 cm porcelain, its grout dark, each square its own shade, dirt tracked in, soda dried, a tile cracked, one gone to its mortar; a tile's edge is a grout line); floor.ring the same. floor.bay is the service bay's oil-stained concrete (saw cuts every 4 m, the oil where rigs stood, the wheel paths east to west, a drain): it is laid the day the_service_bay names a floor area of kind 'bay' (one rectangle, the whole layout); until then the bay wears the store's tile.",
             how_it_lays={'the travel store': "ts_cooler, ts_shelving and ts_endcap are a tile long so a run of C or of G is one run; ts_shelving is three double runs of gondolas; ts_endcap puts an end cap on each of the gondolas' three lines on both its edges, lined up with ts_shelving's at your 'at' [0.5, 0.72] and [0.5, 0.95]; ts_counter is 11 m with its ends finished, so KK leaves a way through between two.",
                           'the service bay': "ts_trailer is a 40-foot van with both its ends, so TT is two trailers nose to tail; ts_cab stands nose to the camera, uncoupled, its hood tilted forward (one picture serves the cab west of its trailers and the cab east of them); ts_lift a four-post lift east to west.",
                           'the walls': "ts_wall_ew / _ns: painted block to 3 m, a tile long."},
             sheet_name='THE_TRUCK_STOP', card_id='cook7-the-truck-stop-11-27', heading='THE TRUCK STOP, BEFORE AND NOW',
             sub='on his phone, 390 x 844, as the fight opens in the travel store: before (every piece a stand-in), now, and now with the roof at his 10%',
             off_label='NOW, THE ROOF OFF', meets_label='NOW, AS HE MEETS IT: THE ROOF AT 10%', close_title='CLOSE IN, AND THE SERVICE BAY',
             close_sub='the coolers and the shelving, the coffee island and the hot case; the bay: rigs, lifts, tires',
             closes=[('THE COOLERS, THE SHELVING', 'shelving'), ('THE ISLAND, THE HOT CASE', 'island')], other=('THE SERVICE BAY', 'bay'), pieces_title='THE PIECES AT THEIR OWN PIXELS',
             pieces_sub='the store: coolers, shelving, end caps, counter, island, hot case, booths, water, cases, jerky, pallets; the bay: trailer, lift, cab, tires, tools, drums, compressor',
             rows=[(('cooler', 'shelving'), 230), (('counter', 'endcap'), 170), (('island', 'hotcase', 'booths', 'water'), 150), (('stock', 'jerky', 'pallets'), 130), (('trailer', 'lift', 'cab'), 220), (('tires', 'toolchest', 'drums', 'compressor'), 130), (('wall_ew',), 110)],
             floor_title="THE TILE, THE BAY'S CONCRETE, AND THE ROOF AT FULL STRENGTH", floor_sub='60 cm porcelain, dirt tracked in, soda dried; the oil where rigs stood, the saw cuts; the joists, the deck, a skylight in every bay')


def cut(): KIT.cut(K)


def sheet(before_dir, page_dir): KIT.sheet(K, before_dir, page_dir)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'ts_floor' else TG.scene_pieces(n, '--quick' in a) if n in ('ts_pieces', 'ts_bay') else TG.scene_ceiling('truckstop', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'plan':                                                    # the floor's plan as a picture, no Blender (a quick look)
        ID = {n: i for i, n in enumerate(sorted(set(['tun_floor', 'gar_deck', 'hall_slab', 'ts_tile'])))}
        gid, dark, pale = plan_ts_floor(ID); v = np.clip(150 - dark * 160 + pale * 120, 0, 255).astype(np.uint8)
        Image.fromarray(v).save(a[1] if len(a) > 1 else '/tmp/ts_plan.png'); print('plan', v.shape, float(v.mean()))
    else: print(__doc__)
