#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the convention hall, finished] (11/17/26; the coordinator's routine 'COOK FIVE full sweep', VAMILY
rules 453, 441, 416, 451(a): '... then the art for COMBAT THREE's next interior and its ceiling').

COMBAT THREE's fourth inside (BUILD 11/17c - THE CONVENTION HALL, slices/fight_ground/hall/hall.json, laid by
slices/bohemia_big_inside.js): one corner of an exhibit hall turned shelter. EVERY PICTURE OF IT WAS A STAND-IN, drawn as
another kit's finished piece (cots as a tunnel camp, pallets as hay bales, the mezzanine as a garage bay). Its handoff names
what it wants; these are the pictures, through the master rig, on the tunnels' and the garage's recipe (that tool is imported):

  THE SHOW FLOOR   hall_floor_0.webp, a sheet of five by five tiles (any tile meets any tile): a sealed slab, the trade show's
                   yellow tape still on it (booths 3 m by 4.5 m, an aisle on every tile's north and south line), the booths'
                   stencilled numbers, the floor boxes in their grid, and what the shelter left: where a cot stood for months
                   the dust never fell (three clean shapes a booth), a hopscotch in chalk. Rows 0 to 3 the floor; row 4 the same
                   tape with no cot ever stood on it (the ground under the mezzanine; the hall going on past the fight is all five).
  THE PIECES       (hall_art.json's kit, COMBAT THREE's names)
    hall_cots_a/b  a block of six army cots half a tile wide: blankets, pillows, a duffel, a jug; in b one cot is on its side
                   and somebody hung a sheet on a line to make a room (hall_beds_a/b are the same pictures)
    hall_pallets   four shrink-wrapped relief pallets, water and boxes, one torn open and half gone (hall_stack the same)
    hall_container a 12 m shipping container off the docks, a tarp lean-to against its side
    hall_chairs    three rows of folding chairs a tile wide, some down (hall_seats the same)
    hall_desk      the registration desk: the counter and its skirt, the queue's posts and belt, a pull-up banner
    hall_sandbags  a sandbag wall with a slot; hall_barrier crowd barriers, one section down
    hall_column    a column 1.2 m square, cut at 2.6 m, papered with MISSING flyers as high as a hand reaches
    hall_wall_ew/ns     the outer wall, a tilt-up panel cut at 1.6 m with its dado
    hall_airwall_ew/ns  the folding partition, panel after panel, cut at 2.1 m with its track
    hall_mezz      a tile of the mezzanine, 1.42 m up: its fascia, the dark under it, the convention's loud carpet on top
    hall_stair_e/w the broad stair up to it, east and west; hall_rail_ew/ns its glass rail
  THE CEILING      hall_ceiling.webp (rule 451(a), drawn over the fight at 10%): the roof deck, a truss on every bay's line both
                   ways, the catwalk, the supply duct, the high-bay lamps, and the banners of a trade show nobody took down.

  <venv>/bin/python tools/bohemia_cook5_the_convention_hall_finished_11_17_26.py render hall_floor | hall_pieces | ceil_hall [--quick]
  python3 tools/bohemia_cook5_the_convention_hall_finished_11_17_26.py cut          (the sheet, the pieces, sizes.json, hall_art.json, the ceiling)
  python3 tools/bohemia_cook5_the_convention_hall_finished_11_17_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): an exhibit hall's floor (sealed
concrete, saw-cut joints, booth lines in tape and stencilled booth numbers, utility floor boxes on a grid); the New Orleans
convention center and the Astrodome as shelters in 2005 (army cots in ranks, relief pallets shrink-wrapped off the docks,
missing-person flyers on every column, sheets hung for a wall); folding 'air wall' partitions on a ceiling track; a meeting
level over the concourse with a glass rail; long-span roof trusses with catwalks, round supply ducts, high-bay lamps and
hanging show banners. The twins: the parking garage's kit and the casino floor's (the bar).
REUSE CHECK (REUSE-FIRST): this lane's tunnels-and-garage tool (its rig, grounds, plan helpers, Parts, piece cutter, pieces
scene and ceiling scene: imported; three small hooks added there so another kit brings its own things) and through it the
freeway tool, the floor tool and the master rig. New here only the hall's own plan, parts and ceiling.
ANALOG HORROR: clean shapes on a dusty floor where four hundred cots stood; a column papered with faces; a banner for a
trade show that was never taken down.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_tunnels_and_the_garage_finished_11_11_26 as TG

FW = TG.FW
W, H, PPM, PYM, SIDE, TM, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'hall')

# ---- the ground ------------------------------------------------------------------------------------------------------------
TG.GROUNDS['hall_slab'] = dict(role=('tape_grey', 2), target=(150, 147, 140), h=0.0, alt=('tape_grey', 1), alt_amt=0.1, grit=0.05, speck=(60, 0.08),
                               joints=dict(pitch=6.0, width=0.016), panel_var=0.03, cracks=dict(cell=2.2, width=0.008, region=0.2, cut=0.6, depth=0.4))
TG.CAL0['hall_slab'] = 0.76                                    # the garage deck's measured 0.589, a quarter lighter (the same role; no new calibration render)
TG.WEAR['hall_slab'] = 0.25                                    # a sealed floor under a roof takes a share of the dust
FONT = {'0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111', '4': '101101111001001', '5': '111100111001111',
        '6': '111100111101111', '7': '111001001001001', '8': '111101111101111', '9': '111101111001111'}


def rect(a, x0, x1, t0, t1, v):
    """a[the pixels of x0..x1 east and t0..t1 south, metres] = v"""
    a[int(round(t0 * PYM)):max(int(round(t0 * PYM)) + 1, int(round(t1 * PYM))), int(round(x0 * PPM)):max(int(round(x0 * PPM)) + 1, int(round(x1 * PPM)))] = v


def plan_hall_floor(ID, seed=71):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed); w = TG.win(lx, ly, 0.5, 1.5)
    gid = np.full((H, W), ID['hall_slab'], np.uint8)
    n2 = FW.vnoise((H, W), 0.5 * PPM, rng); n3 = FW.vnoise((H, W), 0.18 * PPM, rng)
    dust = TG.mixn(FW.vnoise((H, W), 2.5 * PPM, rng), TG.pnoise(rng, 2.5), w)
    pale = (0.09 + np.clip((dust - 0.5) / 0.3, -0.5, 1) * 0.05).astype(np.float32)
    dark = np.zeros((H, W), np.float32)
    # THE SHOW'S TAPE: booths 3 m by 4.5 m, an aisle 3 m wide on every tile's north and south line (the same lines on every tile's edge)
    tape = np.zeros((H, W), bool)
    for y0 in (1.5, 6.0, 10.5): tape |= np.abs(ly - y0) < 0.04
    tape |= (np.minimum(lx % 3.0, 3.0 - lx % 3.0) < 0.04) & (ly > 1.5) & (ly < 10.5)
    peel = TG.mixn(FW.vnoise((H, W), 0.7 * PPM, rng), TG.pnoise(rng, 0.7), w)                 # where feet and cots took it up
    gid[tape & (peel > 0.36)] = ID['gar_yellow']
    # the floor boxes in their grid (power and data for a booth), a dark lid each
    for (bx, by) in ((3.0, 3.75), (9.0, 3.75), (3.0, 8.25), (9.0, 8.25)):
        d = np.maximum(np.abs(lx - bx), np.abs(ly - by)); dark = np.maximum(dark, (d < 0.16) * 0.8); dark = np.maximum(dark, ((d >= 0.16) & (d < 0.2)) * 0.35)
    # the aisles: pallet jacks and ten thousand feet, darkest down the middle of each
    lane = TG.pnoise(rng, 1.5, 4.0)
    for c0 in (0.5, 11.5): dark = np.maximum(dark, np.clip(1 - np.abs(ly - c0) / 0.5, 0, 1) * (0.06 + 0.12 * lane) * (0.6 + 0.4 * n3))
    # what was spilled (few and inside a tile)
    leak = FW.vnoise((H, W), 1.6 * PPM, rng) * TG.win(lx, ly, 0.6, 1.2); tl = TG.top(leak, 0.03)
    dark = np.maximum(dark, np.clip((leak - tl) / 0.05 + 0.4, 0, 1) * (leak > tl) * 0.28)
    rr = np.random.RandomState(seed + 1)
    for r in range(5):
        for c in range(5):
            X0, T0 = c * TM, r * TM
            for bx in range(4):
                for half in range(2):
                    n = 100 + (r * 5 + c) * 8 + half * 4 + bx                                 # THE BOOTH'S NUMBER, stencilled by its aisle corner
                    for i, ch in enumerate(str(n)):
                        for k, bit in enumerate(FONT[ch]):
                            if bit == '1' and rr.rand() > 0.07:
                                x = X0 + bx * 3.0 + 0.3 + i * 0.3 + (k % 3) * 0.075; t = T0 + (1.75 if half == 0 else 9.85) + (k // 3) * 0.075
                                rect(gid, x, x + 0.075, t, t + 0.075, ID['gar_white'])
                    if r == 4 or rr.rand() < 0.45: continue                                   # rule 20: where a cot stood for months the dust never fell: three clean shapes a booth
                    tb = T0 + (2.5 if half == 0 else 6.9)
                    for j in range(3):
                        x = X0 + bx * 3.0 + 0.32 + j * 0.84
                        if rr.rand() < 0.2: continue
                        y0, y1 = int(round(tb * PYM)), int(round((tb + 1.95) * PYM)); x0, x1 = int(round(x * PPM)), int(round((x + 0.74) * PPM))
                        pale[y0:y1, x0:x1] *= 0.1; dark[y0:y1, x0:x1] = np.maximum(dark[y0:y1, x0:x1], 0.13)   # the sealed slab as it was laid, a shade under the dust round it
                        for (ya, yb, xa, xb) in ((y0 - 3, y0, x0 - 3, x1 + 3), (y1, y1 + 3, x0 - 3, x1 + 3), (y0, y1, x0 - 3, x0), (y0, y1, x1, x1 + 3)): pale[ya:yb, xa:xb] += 0.11   # and the dust banked at its edge
                        for (fx, ft) in ((x + 0.04, tb + 0.05), (x + 0.64, tb + 0.05), (x + 0.04, tb + 1.84), (x + 0.64, tb + 1.84)): rect(dark, fx, fx + 0.06, ft, ft + 0.06, 0.55)
    # rule 20: a hopscotch in chalk, in an aisle of two tiles
    for (c, r, fx) in ((1, 2, 4.2), (3, 0, 7.4)):
        X0, T0 = c * TM + fx, r * TM + 0.35; s = 0.42; cells = [(0, 0), (0, 1), (0, 2), (-0.5, 3), (0.5, 3), (0, 4), (-0.5, 5), (0.5, 5), (0, 6)]
        for (dx, k) in cells:                                  # laid east-west along the aisle (an aisle is 3 m deep, a hopscotch 3.8 m long)
            x, t = X0 + k * s, T0 + (0.35 + dx * s)
            for (a0, a1, b0, b1) in ((x, x + s, t, t + 0.035), (x, x + s, t + s - 0.035, t + s), (x, x + 0.035, t, t + s), (x + s - 0.035, x + s, t, t + s)): rect(gid, a0, a1, b0, b1, ID['gar_white'])
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['hall_floor'] = plan_hall_floor


def hall_floor_things(bpy, NF, M, rng):
    """what nobody swept: paper and card, a few cans and jugs"""
    out = FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0, 60), r_.uniform(0, 60)), 70)
    out += TG.floor_litter(bpy, NF, M, rng, 46)
    return out


TG.GARAGE_THINGS['hall_floor'] = hall_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
HALL_AT = dict(mezz=(10.0, 44.0), stair_e=(26.0, 44.0), stair_w=(42.0, 44.0), rail_ew=(10.0, 38.5), wall_ew=(26.0, 37.5), airwall_ew=(42.0, 37.0),
               rail_ns=(52.0, 4.0), wall_ns=(55.0, 4.0), airwall_ns=(57.8, 22.0), container=(10.0, 28.5), chairs=(26.0, 29.0), desk=(42.0, 29.5),
               cots_a=(5.0, 17.0), cots_b=(14.0, 17.0), pallets=(23.0, 17.5), sandbags=(33.0, 18.5), barrier=(45.5, 18.5), column=(6.0, 6.0))
BLANKETS = ('blue', 'tan', 'rug', 'cloth', 'mat_', 'couch', 'cloth_r', 'tan_d')


def cot(P, x, y, blanket, rng, made=True):
    """an army cot, its head to the north: 0.76 by 1.95, the canvas 0.42 up"""
    for (dx, dy) in ((-0.34, 0.06), (0.3, 0.06), (-0.34, 0.95), (0.3, 0.95), (-0.34, 1.85), (0.3, 1.85)): P.box('steel', x + dx, x + dx + 0.04, y + dy, y + dy + 0.04, 0.0, 0.4)
    P.box('steel', x - 0.38, x + 0.38, y, y + 1.95, 0.38, 0.42); P.box('tan_d', x - 0.36, x + 0.36, y + 0.02, y + 1.93, 0.42, 0.45)
    if made:
        P.box(blanket, x - 0.37, x + 0.37, y + 0.04, y + 1.35 + 0.3 * rng.rand(), 0.45, 0.5); P.box(blanket, x - 0.3, x + 0.2, y + 0.3, y + 0.9, 0.5, 0.56)
    P.box('white', x - 0.24, x + 0.24, y + 1.5, y + 1.86, 0.45, 0.56)                                 # the pillow


def cots_block(P, ox, oy, rng, b):
    k = 0
    for row_y in (oy + 0.2, oy + 2.75):
        for dx in (-1.85, 0.0, 1.85):
            k += 1
            if b and k == 5:                                   # (b) one on its side
                P.box('steel', ox + dx - 0.38, ox + dx + 0.38, row_y + 0.6, row_y + 0.66, 0.0, 0.78); P.box('tan_d', ox + dx - 0.36, ox + dx + 0.36, row_y + 0.6, row_y + 0.62, 0.04, 0.74); continue
            cot(P, ox + dx, row_y, BLANKETS[(k + (3 if b else 0)) % len(BLANKETS)], rng, made=not (b and k == 2))
    P.box('under', ox - 1.3, ox - 0.75, oy + 0.9, oy + 1.25, 0.0, 0.32)                               # a duffel
    P.drum('jug', ox + 0.95, oy + 0.5, 0.0, 0.34, 0.13, 10); P.box('cloth_r', ox + 0.8, ox + 1.25, oy + 3.3, oy + 3.6, 0.0, 0.2)
    for (dx, dy) in ((-0.95, 3.2), (-0.8, 3.26), (1.0, 2.0)): P.box('under', ox + dx, ox + dx + 0.11, oy + dy, oy + dy + 0.27, 0.0, 0.1)   # shoes, set down together
    if b:                                                      # (b) a sheet on a line: somebody made a room
        for px_ in (ox - 2.6, ox + 0.9): P.bar('wood_d', (px_, oy + 2.45, 0.0), (px_, oy + 2.45, 1.8), 0.03)
        P.bar('under', (ox - 2.6, oy + 2.45, 1.75), (ox + 0.9, oy + 2.45, 1.75), 0.008)
        P.box('white', ox - 2.5, ox + 0.2, oy + 2.44, oy + 2.46, 0.55, 1.75); P.box('blue', ox + 0.25, ox + 0.85, oy + 2.44, oy + 2.46, 0.9, 1.75)
    else:
        P.box('card', ox + 2.05, ox + 2.6, oy + 4.2, oy + 4.7, 0.0, 0.4); P.box('wood', ox - 2.5, ox - 2.1, oy + 4.3, oy + 4.7, 0.0, 0.5)   # a box of what they kept, a crate for a table


def pallets(P, ox, oy, rng):
    for i, (dx, dy) in enumerate(((-1.3, 0.1), (0.1, 0.1), (-1.3, 1.25), (0.1, 1.25))):
        x, y = ox + dx, oy + dy
        P.box('wood', x, x + 1.2, y, y + 1.0, 0.0, 0.14)
        for j in range(3): P.box('wood_d', x + 0.05 + j * 0.5, x + 0.2 + j * 0.5, y - 0.004, y, 0.0, 0.14)
        h = 0.62 if i == 1 else 1.3
        P.box('jug' if i % 2 == 0 else 'card', x + 0.03, x + 1.17, y + 0.03, y + 0.97, 0.14, 0.14 + h)   # the load, in its wrap
        for z in (0.5, 0.95):
            if z < h: P.box('blue', x + 0.025, x + 1.175, y + 0.025, y + 0.975, 0.14 + z, 0.14 + z + 0.05)   # the straps
        if i == 0: P.box('red', x + 0.35, x + 0.85, y - 0.006, y + 0.03, 0.7, 1.05); P.box('white', x + 0.55, x + 0.65, y - 0.008, y, 0.75, 1.0); P.box('white', x + 0.45, x + 0.75, y - 0.008, y, 0.83, 0.92)   # the relief's cross
    for _ in range(9):                                         # the torn one's cans, in the aisle
        P.drum('can', ox + 0.3 + rng.uniform(0, 1.3), oy - 0.2 - rng.uniform(0, 0.5), 0.0, 0.12, 0.05, 8)
    P.box('jug', ox + 0.2, ox + 1.1, oy - 0.02, oy + 0.02, 0.2, 0.6)                                   # its wrap, hanging open


def container(P, ox, oy, rng):
    x0, x1, y0, y1, zt = ox - 6.05, ox + 6.05, oy, oy + 2.44, 2.59
    P.box('rustp', x0, x1, y0, y1, 0.0, zt)
    x = x0 + 0.14
    while x < x1 - 0.2:                                        # the corrugations, on its side and its roof
        P.box('rust', x, x + 0.11, y0 - 0.04, y0, 0.16, zt - 0.14); P.box('rust', x, x + 0.11, y0 + 0.06, y1 - 0.06, zt, zt + 0.03); x += 0.29
    P.box('under', x0, x1, y0 - 0.045, y0, 0.0, 0.16); P.box('under', x0, x1, y0 - 0.045, y0, zt - 0.14, zt)
    P.box('paint_w', ox - 2.4, ox + 1.2, y0 - 0.05, y0 - 0.04, 1.2, 1.95); P.box('rustp', ox - 2.2, ox - 0.4, y0 - 0.055, y0 - 0.05, 1.35, 1.8)   # the line's plate, its name gone
    for px_ in (ox + 2.4, ox + 5.2): P.bar('wood_d', (px_, y0 - 1.05, 0.0), (px_, y0 - 1.05, 1.7), 0.035)   # a tarp off its side: somebody lives against it
    P._add('blue', [(ox + 2.2, y0 - 1.15, 1.7), (ox + 5.4, y0 - 1.15, 1.7), (ox + 5.4, y0, 2.3), (ox + 2.2, y0, 2.3)], [(0, 1, 2, 3), (3, 2, 1, 0)])
    P.box('mat_', ox + 2.6, ox + 4.5, y0 - 1.0, y0 - 0.25, 0.0, 0.16); P.box('tan', ox + 2.7, ox + 4.0, y0 - 0.95, y0 - 0.32, 0.16, 0.22)


def chairs(P, ox, oy, rng):
    for r_ in range(3):
        y = oy + 0.25 + r_ * 1.05
        for i in range(10):
            x = ox - 5.0 + i * 1.1 + rng.normal(0, 0.03); u = rng.rand()
            if u < 0.08: continue
            if u < 0.2:                                        # down
                P.box('tan', x - 0.22, x + 0.22, y - 0.3, y + 0.55, 0.0, 0.05); P.box('tan_d', x - 0.22, x + 0.22, y + 0.3, y + 0.55, 0.05, 0.09); continue
            for (dx, dy) in ((-0.2, 0.0), (0.17, 0.0), (-0.2, 0.4), (0.17, 0.4)): P.box('steel', x + dx, x + dx + 0.03, y + dy, y + dy + 0.03, 0.0, 0.45)
            P.box('tan', x - 0.22, x + 0.22, y, y + 0.44, 0.45, 0.49); P.box('tan_d', x - 0.22, x + 0.22, y + 0.42, y + 0.46, 0.49, 0.9)


def desk(P, ox, oy, rng):
    P.box('paint_w', ox - 4.0, ox + 4.0, oy + 1.0, oy + 1.9, 0.0, 1.05); P.box('teal', ox - 4.0, ox + 4.0, oy + 0.994, oy + 1.0, 0.12, 0.92)   # the counter, its skirt
    P.box('white', ox - 4.05, ox + 4.05, oy + 0.95, oy + 1.95, 1.05, 1.09)
    for _ in range(9): x = ox + rng.uniform(-3.7, 3.5); y = oy + rng.uniform(1.05, 1.7); P.box('paper', x, x + 0.22, y, y + 0.3, 1.09, 1.095)
    P.box('card', ox + 1.6, ox + 2.2, oy + 1.2, oy + 1.6, 1.09, 1.3)
    xs = (ox - 3.6, ox - 1.2, ox + 1.2, ox + 3.6)              # the queue's posts and belt
    for x in xs: P.drum('steel', x, oy + 0.25, 0.0, 0.03, 0.17, 12); P.drum('steel', x, oy + 0.25, 0.03, 0.98, 0.035, 8)
    for a, b in zip(xs[:-1], xs[1:]):
        if a != xs[1]: P.box('red', a, b, oy + 0.24, oy + 0.26, 0.86, 0.93)
    P.box('red', xs[1], xs[1] + 0.9, oy + 0.24, oy + 0.26, 0.0, 0.06)                                  # one belt let go
    P.box('paint_w', ox + 4.4, ox + 5.25, oy + 1.4, oy + 1.46, 0.08, 2.1); P.box('teal', ox + 4.4, ox + 5.25, oy + 1.394, oy + 1.4, 1.3, 1.9); P.box('steel', ox + 4.3, ox + 5.35, oy + 1.3, oy + 1.56, 0.0, 0.08)   # a pull-up banner


def sandbags(P, ox, oy, rng):
    mats = ('tan', 'tan_d', 'silt')
    for z in range(5):
        x = ox - 4.5 + (0.35 if z % 2 else 0.0)
        while x < ox + 4.4:
            if z == 4 and abs(x + 0.35 - ox) < 0.8: x += 0.7; continue                               # the slot
            P.box(mats[int(rng.randint(3))], x + 0.02, x + 0.68, oy + 0.05 + 0.03 * (z % 2), oy + 0.85 - 0.03 * (z % 2), z * 0.21, z * 0.21 + 0.2); x += 0.7
    for _ in range(4): x = ox + rng.uniform(-4.2, 3.6); P.box('tan_d', x, x + 0.68, oy - 0.5, oy - 0.08, 0.0, 0.16)   # a few that slid off


def barrier(P, ox, oy, rng):
    for i in range(4):
        x0 = ox - 5.0 + i * 2.5; y = oy + 0.3
        if i == 2:                                             # one section down
            P.bar('steel', (x0, y - 0.9, 0.04), (x0 + 2.3, y - 0.9, 0.04), 0.025); P.bar('steel', (x0, y + 0.1, 0.04), (x0 + 2.3, y + 0.1, 0.04), 0.025)
            for k in range(9): P.bar('steel', (x0 + 0.15 + k * 0.25, y - 0.9, 0.04), (x0 + 0.15 + k * 0.25, y + 0.1, 0.04), 0.012)
            continue
        P.bar('steel', (x0, y, 1.05), (x0 + 2.3, y, 1.05), 0.025); P.bar('steel', (x0, y, 0.18), (x0 + 2.3, y, 0.18), 0.02)
        for xx in (x0, x0 + 2.3): P.bar('steel', (xx, y, 0.0), (xx, y, 1.05), 0.025); P.box('steel', xx - 0.03, xx + 0.03, y - 0.3, y + 0.3, 0.0, 0.03)
        for k in range(9): P.bar('steel', (x0 + 0.15 + k * 0.25, y, 0.18), (x0 + 0.15 + k * 0.25, y, 1.05), 0.012)


def column(P, ox, oy, rng):
    P.box('conc', ox - 0.6, ox + 0.6, oy - 0.6, oy + 0.6, 0.0, 2.6); P.box('cut', ox - 0.58, ox + 0.58, oy - 0.58, oy + 0.58, 2.6, 2.62)
    for (dx, dy) in ((-0.42, -0.42), (0.42, -0.42), (-0.42, 0.42), (0.42, 0.42), (0.0, -0.44), (0.0, 0.44)): P.bar('rustbar', (ox + dx, oy + dy, 2.6), (ox + dx + rng.uniform(-0.1, 0.1), oy + dy, 2.95 + 0.3 * rng.rand()), 0.02)
    P.box('paint_y', ox - 0.61, ox + 0.61, oy - 0.61, oy + 0.61, 0.0, 0.16)
    for _ in range(26):                                        # rule 20: MISSING, as high as a hand reaches, on the face he sees
        x = ox + rng.uniform(-0.56, 0.34); z = rng.uniform(0.6, 2.05); w_ = rng.uniform(0.17, 0.24)
        P.box('paper', x, x + w_, oy - 0.612 - 0.002 * rng.rand(), oy - 0.6, z, z + w_ * 1.3)
        if rng.rand() < 0.6: P.box('under', x + 0.04, x + w_ - 0.04, oy - 0.616, oy - 0.612, z + w_ * 0.5, z + w_ * 1.1)   # a face on it
    P.box('red', ox + 0.38, ox + 0.56, oy - 0.7, oy - 0.6, 0.9, 1.5)                                   # the extinguisher


def wall_ew(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.25, 0.0, 1.6)
    P.box('teal', ox - 6, ox + 6, oy - 0.006, oy, 0.0, 0.95); P.box('steel', ox - 6, ox + 6, oy - 0.03, oy, 0.92, 1.0)        # its dado, the rub rail
    for i in range(1, 3): P.box('conc_d', ox - 6 + i * 4.0 - 0.012, ox - 6 + i * 4.0 + 0.012, oy - 0.008, oy + 0.25, 0.0, 1.605)
    for _ in range(7): x = rng.uniform(ox - 5.8, ox + 5.6); P.box('under', x, x + rng.uniform(0.2, 0.7), oy - 0.008, oy - 0.006, 0.05, rng.uniform(0.2, 0.5))   # scuffs
    P.box('steel', ox - 3.2, ox - 2.9, oy - 0.05, oy, 0.3, 0.55); P.box('steel', ox + 2.9, ox + 3.2, oy - 0.05, oy, 0.3, 0.55)


def wall_ns(P, ox, oy, rng):
    P.box('conc', ox - 0.125, ox + 0.125, oy, oy + 12, 0.0, 1.6)
    for i in range(1, 3): P.box('conc_d', ox - 0.133, ox + 0.133, oy + i * 4.0 - 0.012, oy + i * 4.0 + 0.012, 0.0, 1.605)


def airwall_ew(P, ox, oy, rng):
    for i in range(10):
        x = ox - 6 + i * 1.2; dz = 0.0
        P.box('mat_', x + 0.03, x + 1.17, oy + 0.03, oy + 0.13, 0.06, 2.1); P.box('steel', x, x + 0.03, oy + 0.02, oy + 0.14, 0.0, 2.1); P.box('under', x + 0.03, x + 1.17, oy + 0.025, oy + 0.03, 0.06, 0.2)
        if rng.rand() < 0.3: P.box('tan_d', x + 0.2, x + 0.9, oy + 0.024, oy + 0.03, rng.uniform(0.6, 1.2), rng.uniform(1.3, 1.9))   # a stain down a panel
    P.box('steel', ox + 5.97, ox + 6.0, oy + 0.02, oy + 0.14, 0.0, 2.1); P.box('steel', ox - 6, ox + 6, oy + 0.0, oy + 0.16, 2.1, 2.2)   # its track, cut with the roof


def airwall_ns(P, ox, oy, rng):
    for i in range(10):
        y = oy + i * 1.2
        P.box('mat_', ox - 0.05, ox + 0.05, y + 0.03, y + 1.17, 0.06, 2.1); P.box('steel', ox - 0.06, ox + 0.06, y, y + 0.03, 0.0, 2.1)
    P.box('steel', ox - 0.08, ox + 0.08, oy, oy + 12, 2.1, 2.2)


def carpet(P, x0, x1, y0, y1, z):
    """the convention's carpet: teal, a rust square every 2 m on a half-drop (the same on every tile's edge), a dark border at a deck's south edge"""
    P.box('carpet', x0, x1, y0, y1, z - 0.02, z)
    for i in range(int((x1 - x0) / 2.0)):
        for j in range(int((y1 - y0) / 2.0)):
            cx = x0 + 1.0 + i * 2.0; cy = y0 + (0.5 if i % 2 else 1.5) + j * 2.0
            P.box('carpet_b', cx - 0.3, cx + 0.3, cy - 0.3, cy + 0.3, z, z + 0.004); P.box('carpet_d', cx - 0.12, cx + 0.12, cy - 0.12, cy + 0.12, z + 0.004, z + 0.006)


def mezz(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02); carpet(P, ox - 6, ox + 6, oy, oy + 12, LEVEL_H)
    P.box('paint_w', ox - 6, ox + 6, oy - 0.006, oy, LEVEL_H - 0.42, LEVEL_H - 0.02); P.box('teal', ox - 6, ox + 6, oy - 0.008, oy - 0.006, LEVEL_H - 0.34, LEVEL_H - 0.24)   # the fascia and its band
    P.box('under', ox - 6, ox + 6, oy - 0.006, oy, 0.0, LEVEL_H - 0.42)                               # the dark under it (the concourse)
    for x in (ox - 6, ox - 2, ox + 2): P.box('conc', x, x + 0.4, oy - 0.03, oy, 0.0, LEVEL_H - 0.42)   # its posts (one on the tile's west line, so two tiles meet on a post)
    P.box('conc', ox + 5.6, ox + 6, oy - 0.03, oy, 0.0, LEVEL_H - 0.42)


def stair(P, ox, oy, sgn):
    n = 12
    for i in range(n):                                         # twelve broad steps a tile long
        xa = ox - 6 + i if sgn > 0 else ox + 6 - i - 1; z = LEVEL_H * (i + 1) / n
        P.box('conc', xa, xa + 1, oy + 0.3, oy + 11.7, 0.0, z)
        xe = xa if sgn > 0 else xa + 1 - 0.07
        P.box('paint_y', xe, xe + 0.07, oy + 0.3, oy + 11.7, z, z + 0.005)                           # the nosing
    xl, xh = (ox - 6, ox + 6) if sgn > 0 else (ox + 6, ox - 6)
    for yy in (oy, oy + 11.7):                                 # a stringer wall each side, and its rail
        pr = [(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.25), (xl, 0.25)]
        P.prism_y('conc', yy, yy + 0.3, pr if sgn < 0 else pr[::-1])
        P.bar('steel', (xl, yy + 0.15, 1.0), (xh, yy + 0.15, LEVEL_H + 1.0), 0.03)
        for k in range(7): t = k / 6.0; x = xl + (xh - xl) * t; P.bar('steel', (x, yy + 0.15, LEVEL_H * t + 0.2), (x, yy + 0.15, LEVEL_H * t + 1.0), 0.02)


def rail_ew(P, ox, oy, rng):
    P.box('steel', ox - 6, ox + 6, oy + 0.06, oy + 0.18, 0.0, 0.08)
    for i in range(6):
        x = ox - 6 + i * 2.0
        P.bar('steel', (x + 0.02, oy + 0.12, 0.0), (x + 0.02, oy + 0.12, 1.04), 0.025)
        if i != 3: P.box('rail_glass', x + 0.08, x + 1.96, oy + 0.11, oy + 0.13, 0.1, 0.98)
    P.bar('steel', (ox + 5.98, oy + 0.12, 0.0), (ox + 5.98, oy + 0.12, 1.04), 0.025); P.bar('steel', (ox - 6, oy + 0.12, 1.04), (ox + 6, oy + 0.12, 1.04), 0.03)
    for _ in range(14): P.box('glassbit', ox + rng.uniform(0.1, 1.9), ox + rng.uniform(0.1, 1.9) + 0.05, oy - 0.3 + rng.uniform(0, 0.5), oy - 0.25 + rng.uniform(0, 0.5), 0.0, 0.02)   # the pane that went


def rail_ns(P, ox, oy, rng):
    P.box('steel', ox - 0.06, ox + 0.06, oy, oy + 12, 0.0, 0.08)
    for i in range(6):
        y = oy + i * 2.0
        P.bar('steel', (ox, y + 0.02, 0.0), (ox, y + 0.02, 1.04), 0.025); P.box('rail_glass', ox - 0.01, ox + 0.01, y + 0.08, y + 1.96, 0.1, 0.98)
    P.bar('steel', (ox, oy + 11.98, 0.0), (ox, oy + 11.98, 1.04), 0.025); P.bar('steel', (ox, oy, 1.04), (ox, oy + 12, 1.04), 0.03)


def hall_parts(P, rng):
    A = HALL_AT
    mezz(P, *A['mezz'], rng); stair(P, *A['stair_e'], 1); stair(P, *A['stair_w'], -1)
    rail_ew(P, *A['rail_ew'], rng); rail_ns(P, *A['rail_ns'], rng); wall_ew(P, *A['wall_ew'], rng); wall_ns(P, *A['wall_ns'], rng)
    airwall_ew(P, *A['airwall_ew'], rng); airwall_ns(P, *A['airwall_ns'], rng)
    container(P, *A['container'], rng); chairs(P, *A['chairs'], rng); desk(P, *A['desk'], rng)
    cots_block(P, *A['cots_a'], rng, False); cots_block(P, *A['cots_b'], rng, True); pallets(P, *A['pallets'], rng)
    sandbags(P, *A['sandbags'], rng); barrier(P, *A['barrier'], rng); column(P, *A['column'], rng)


def hall_mats(bpy, NF, F, M, which):
    if which != 'hall_pieces': return
    M.update(carpet=NF.material(bpy, 'in_cloth_carpet', 'clay_teal', 2, 0.8), carpet_b=NF.material(bpy, 'in_cloth_carpet_b', 'clay_rust', 2, 0.95),
             carpet_d=NF.material(bpy, 'in_cloth_carpet_d', 'clay_mustard', 2, 0.9), rail_glass=NF.material(bpy, 'in_rail_glass', 'clay_teal', 3, 0.8),
             under=NF.material(bpy, 'in_stall_under', 'tape_grey', 0, 0.7))   # the dark of a thing, never black: the cutter reads black as the ground's shadow and cuts it out


TG.PARTS['hall_pieces'] = hall_parts
TG.MAT_HOOKS.append(hall_mats)


# ---- the ceiling (rule 451(a)) ----------------------------------------------------------------------------------------------
def ceil_hall(P, rng):
    at, band_y = TG.at, TG.band_y
    P.box('lid', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                     # the roof deck, dark
    for k in range(-1, 23): P.box('conc_d', -3.0, 63.0, 60 - k * 3.0 - 0.06, 60 - k * 3.0 + 0.06, 0.0, 0.25)   # its purlins
    for r in range(-1, 7):                                     # a truss on every bay's line, east to west: two chords and the web between
        y0, y1 = band_y(r, 0.0, 0.26, 1.7)
        P.box('white', -3.0, 63.0, y0, y1, 0.0, 0.2); P.box('white', -3.0, 63.0, y0, y1, 1.5, 1.7)
        for k in range(-2, 42): x = k * 1.5; P.bar('white', (x, (y0 + y1) / 2, 0.15 if k % 2 == 0 else 1.55), (x + 1.5, (y0 + y1) / 2, 1.55 if k % 2 == 0 else 0.15), 0.07)
    for c in range(6):                                         # and north to south
        x = c * TM
        P.box('white', x - 0.14, x + 0.14, -3.0, 63.0, 0.0, 0.215); P.box('white', x - 0.14, x + 0.14, -3.0, 63.0, 1.5, 1.715)   # a hair over the other way's chords (two faces in one plane render black)
        for k in range(-2, 42): y = k * 1.5; P.bar('white', (x, y, 0.15 if k % 2 == 0 else 1.55), (x, y + 1.5, 1.55 if k % 2 == 0 else 0.15), 0.07)
    for c in range(5):                                         # the catwalk down every bay, its grating and its two rails
        x = c * TM + 6.0
        P.box('black', x - 0.5, x + 0.5, -3.0, 63.0, 1.0, 1.05)
        for dx in (-0.5, 0.5): P.box('steel', x + dx - 0.03, x + dx + 0.03, -3.0, 63.0, 0.55, 0.6); P.box('steel', x + dx - 0.03, x + dx + 0.03, -3.0, 63.0, 1.0, 1.08)
    for r in range(-1, 6):
        _, y = at(0, r, 0, 4.2, 0.95); P.tube_x('steel', -3.0, 63.0, y, 0.95, 0.5)                       # the supply duct
        for c in range(6):
            for k in range(2): x = c * TM + 2.0 + k * 8.0; P.box('black', x - 0.3, x + 0.3, y - 0.62, y - 0.5, 0.75, 1.15)   # its grilles
    for r in range(5):
        for c in range(5):
            for (lx, ly) in ((3.0, 8.2), (9.0, 8.2), (3.0, 10.6), (9.0, 10.6)):                          # the high-bay lamps, dead (one lit)
                x, y = at(c, r, lx, ly, 1.2); lit = (c, r, lx, ly) == (2, 2, 9.0, 8.2)
                P.bar('black', (x, y, 0.0), (x, y, 0.9), 0.012); P.drum('lit' if lit else 'black', x, y, 0.9, 1.3, 0.34, 12, 0.2)
            u = rng.rand()                                     # rule 20: the banners of a trade show nobody took down
            x, y = at(c, r, rng.uniform(3.2, 8.8), rng.uniform(6.2, 7.4), 0.0); col = ('teal', 'rustp', 'must', 'blue')[int(rng.randint(4))]; L = 3.4 if u > 0.25 else 1.6
            P.box(col, x - 2.4, x + 2.4, y - 0.03, y + 0.03, 0.25, 0.25 + L); P.box('white', x - 2.4, x + 2.4, y - 0.035, y + 0.035, 0.25 + L * 0.55, 0.25 + L * 0.72)
            for dx in (-2.3, 2.3): P.bar('black', (x + dx, y, 0.0), (x + dx, y, 0.25), 0.01)
            if rng.rand() < 0.5:                               # a chain hoist left hanging
                x, y = at(c, r, rng.uniform(1.5, 10.5), rng.uniform(5.0, 7.0), 0.0); P.bar('black', (x, y, 0.0), (x, y, 2.2 + rng.rand()), 0.015); P.box('must', x - 0.12, x + 0.12, y - 0.1, y + 0.1, 1.4, 1.7)


TG.CEILINGS['hall'] = (ceil_hall, 'hall/hall_ceiling.webp', 'the roof deck and its purlins, a truss on every bay\'s line both ways, the catwalk down every bay, the supply duct and its grilles, the high-bay lamps (one lit), a chain hoist, and the banners of a trade show nobody took down')
TG.CEIL_DATA['hall'] = 'hall/hall.json'


# ---- the cut (no Blender) ----------------------------------------------------------------------------------------------------
KIND = dict(cots_a='LOW_COVER', cots_b='LOW_COVER', pallets='COVER', container='COVER', chairs='LOW_COVER', desk='LOW_COVER', sandbags='COVER', barrier='LOW_COVER', column='WALL',
            wall_ew='WALL', wall_ns='WALL', airwall_ew='WALL', airwall_ns='WALL', mezz='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', rail_ew='RAIL', rail_ns='RAIL')
HM = dict(cots_a=0.6, cots_b=0.8, pallets=1.44, container=2.59, chairs=0.9, desk=1.09, sandbags=1.05, barrier=1.05, column=2.6, wall_ew=1.6, wall_ns=1.6, airwall_ew=2.2, airwall_ns=2.2,
          mezz=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, rail_ew=1.04, rail_ns=1.04)
NAME = dict(cots_a='COTS', cots_b='COTS', pallets='RELIEF PALLETS', container='A CONTAINER', chairs='ROWS OF CHAIRS', desk='THE REGISTRATION DESK', sandbags='A SANDBAG CHECKPOINT',
            barrier='CROWD BARRIERS', column='A COLUMN', wall_ew='THE OUTER WALL', wall_ns='THE OUTER WALL', airwall_ew='THE FOLDING WALL', airwall_ns='THE FOLDING WALL',
            mezz='THE MEZZANINE', stair_e='THE STAIR UP, EAST', stair_w='THE STAIR UP, WEST', rail_ew='THE GLASS RAIL', rail_ns='THE GLASS RAIL')
ALSO = dict(beds_a='cots_a', beds_b='cots_b', stack='pallets', seats='chairs')       # COMBAT THREE's drawn-only names: the same pictures


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'hall_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'hall_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'hall_pieces.png')).convert('RGBA'); A = HALL_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'hall_' + key, 'hall', shadow)
    for key in ('mezz', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 12.0 + hh + (1.7 if key != 'mezz' else 0.3)), 0.0)
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 1.9), 0.4)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.5, x + 1.3, y - 0.05, y + 13.6), 0.5)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.08, y + 2.75), 0.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.5, x + 1.6, y - 0.05, y + 14.4), 0.5)
    x, y = A['airwall_ew']; one('airwall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 3.5), 0.0)
    x, y = A['airwall_ns']; one('airwall_ns', (x - 0.5, x + 1.9, y - 0.05, y + 15.3), 0.5)
    x, y = A['container']; one('container', (x - 6.3, x + 7.3, y - 1.9, y + 2.5 + 3.9), 0.7)
    x, y = A['chairs']; one('chairs', (x - 5.7, x + 6.3, y - 0.5, y + 3.2 + 1.5), 0.7)
    x, y = A['desk']; one('desk', (x - 4.4, x + 6.6, y - 0.2, y + 2.0 + 3.2), 0.7)
    for key in ('cots_a', 'cots_b'):
        x, y = A[key]; one(key, (x - 3.0, x + 3.6, y - 0.2, y + 5.0 + 2.8), 0.7)
    x, y = A['pallets']; one('pallets', (x - 1.6, x + 2.4, y - 1.0, y + 2.3 + 2.3), 0.7)
    x, y = A['sandbags']; one('sandbags', (x - 4.8, x + 5.6, y - 0.8, y + 0.9 + 1.7), 0.7)
    x, y = A['barrier']; one('barrier', (x - 5.3, x + 5.9, y - 1.2, y + 0.7 + 1.7), 0.6)
    x, y = A['column']; one('column', (x - 1.0, x + 3.2, y - 0.9, y + 0.6 + 4.6), 0.6, foot=(x, y - 0.1))
    for k, v in sz.items(): v.update(piece=k, src='hall/hall_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['hall/hall_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'hall_' + k: ent(k) for k in sz}
    for a, k in ALSO.items(): kit['hall_' + a] = dict(ent(k), kind='DRESS')
    art = {
        'version': 'cook5-hall-art-11-17', 'lane': 'cook 5', 'stage': 'finished',
        'for': "COMBAT THREE's convention hall (slices/fight_ground/hall/hall.json, BUILD 11/17c): the names its handoff asked for, the garage's format. floor.floor is the show floor (rows 0 to 3 of the sheet: the tape, the booth numbers, where the cots stood); floor.high is its last row, the same tape where no cot stood (the ground under the mezzanine: the deck's own picture carries the carpet and covers it); floor.ring is every tile of the sheet (the hall going on past the fight, and the shelter with it). Any tile meets any tile.",
        'floor': {'floor': cells((0, 1, 2, 3)), 'high': cells((4,)), 'ring': cells((0, 1, 2, 3, 4))},
        'kit': kit,
        'how_it_lays': {
            'cots': "hall_cots_a / hall_cots_b are a block of six cots 5.4 m wide (half a tile): four to a tile at (.27, .5), (.73, .5), (.27, .95), (.73, .95); foot the block's south edge middle. hall_beds_a/b are the same pictures (drawn, never counted).",
            'pallets, chairs, the desk, sandbags, barriers': "foot the piece's south edge middle; hall_stack is hall_pallets' picture, hall_seats hall_chairs'.",
            'the container': 'hall_container is 12 m long (a tile wide), 2.4 m deep; foot its south base middle; a tarp lean-to stands 1.15 m south of it (inside its tile at .9 down)',
            'the column': 'hall_column, 1.2 m square, foot its base middle (the south face carries the flyers)',
            'walls': "hall_wall_ew / hall_wall_ns the outer wall, hall_airwall_ew / hall_airwall_ns the folding partition: the garage's wall way (foot: south base middle / south end middle); a tile long",
            'the mezzanine': "hall_mezz on every high tile, foot at the tile's south edge middle (the garage_level's way); it stands 1.42 m (61 px) up the glass; its carpet repeats every 2 m, so deck tiles meet. hall_stair_e climbs to the east, hall_stair_w to the west (the same foot). hall_rail_ew / hall_rail_ns on its open edges.",
        },
        'bytes': bytes_,
    }
    TG.keep_ceiling(art, os.path.join(SHIP, 'hall_art.json'))
    # the ceiling: the render at 645 x 455 (five bays by five), whole; COMBAT THREE's 'ceiling' entry: 'have' true, 'tile' what was painted
    cp = os.path.join(REND, 'ceil_hall.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'hall_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'hall/hall.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "hall/hall_ceiling.webp"' in e
        e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
        open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='hall/hall_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['hall'][2],
                              contract="hall.json 'ceiling' (COMBAT THREE's: the fight draws it over the board at that alpha, rule 451(a))")
    json.dump(art, open(os.path.join(SHIP, 'hall_art.json'), 'w'), indent=1)
    print('hall: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


def sheet(before_dir, page_dir):
    """records/target/COOK5_THE_CONVENTION_HALL_11_17.webp: what the VOTE card shows. The phone shots are the game's own fight
    page (tools/bohemia_the_hall_on_the_page_11_17_26.js): the same fight before (every piece a stand-in) and now, the ceiling at
    his 10%; then the pieces at their own pixels, a tile of the floor, and the ceiling at full strength."""
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
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))   # the board, under the top card and over the buttons
    title('THE CONVENTION HALL, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL 300 PIECES STAND-INS', up(os.path.join(before_dir, 'hall_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'hall_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'hall_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('SIDEWAYS', '844 x 390, the ceiling at 10%')
    n = Image.open(os.path.join(page_dir, 'hall_sideways_open_a01.png')).convert('RGB'); rows.append(n.resize((WID, int(n.height * WID / n.width)), Image.LANCZOS))
    title('THE PIECES AT THEIR OWN PIXELS', 'cots, a sheet hung for a wall, relief pallets, a column of MISSING flyers, the desk, chairs, sandbags, barriers, the container, the mezzanine, a stair')
    def piece(k, bg=(104, 102, 96)):
        im = Image.open(os.path.join(SHIP, 'hall_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('cots_a', 'cots_b', 'pallets', 'column', 'desk'), 250); row_of(('chairs', 'sandbags', 'barrier'), 130); row_of(('container', 'mezz', 'stair_e'), 300)
    title('A TILE OF THE SHOW FLOOR, AND THE CEILING AT FULL STRENGTH', 'booth tape and numbers, the clean shapes where cots stood; roof trusses, the duct, banners nobody took down')
    fl = Image.open(os.path.join(SHIP, 'hall_floor_0.webp')).convert('RGB').crop((TW, TH, TW * 2, TH * 2)); ce = Image.open(os.path.join(SHIP, 'hall_ceiling.webp')).convert('RGB'); bw, bh = ce.width // 5, ce.height // 5
    ce = ce.crop((bw, bh, bw * 3, bh * 3)); cw2 = (WID - 10) // 2; hh2 = int(TH * cw2 / TW); r = Image.new('RGB', (WID, hh2), BG); r.paste(fl.resize((cw2, hh2), Image.LANCZOS), (0, 0)); r.paste(ce.resize((cw2, hh2), Image.LANCZOS), (cw2 + 10, 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK5_THE_CONVENTION_HALL_11_17.webp'); out.save(fn, 'WEBP', quality=78, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); os.makedirs(os.path.join(R, 'records/target/vote_first'), exist_ok=True)
    f2 = os.path.join(R, 'records/target/vote_first/cook5-the-convention-hall-11-17.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        quick = '--quick' in a
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, quick) if n == 'hall_floor' else TG.scene_pieces(n, quick) if n == 'hall_pieces' else TG.scene_ceiling('hall', quick)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_hall_floor(ID); pal = np.random.RandomState(5).randint(40, 220, (64, 3)).astype(np.uint8)
        im = pal[gid].astype(np.float32) * (1 - 0.6 * dark[..., None]) + pale[..., None] * 50
        os.makedirs(TG.OUT, exist_ok=True); Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(os.path.join(TG.OUT, 'plan_hall_floor.png')); print('plan written')
    else: print(__doc__)
