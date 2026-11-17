#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the warehouse, finished] (11/17/26; the coordinator's routine 'COOK FIVE full sweep', VAMILY rules 453,
441, 416, 451(a), 455: '... the art for COMBAT THREE's next interior and its ceiling ... keep going build after build').

COMBAT THREE's sixth inside (THE DISTRIBUTION WAREHOUSE, slices/fight_ground/warehouse/warehouse.json, laid by
slices/bohemia_big_inside.js): lanes between pallet racking, the docks along one wall, the pick mezzanine at the other. EVERY
PICTURE OF IT WAS A STAND-IN. Its handoff names what it wants; these are the pictures, through the master rig, ON this lane's
mall tool, the hall tool and the tunnels-and-garage tool under them (all imported):

  THE FLOOR        warehouse_floor_0.webp, five tiles by five (any tile meets any tile): a sealed slab, a yellow lane line inside
                   every tile's north and south edge, the bay's stencilled number, two tyre tracks worn dark down every lane and
                   the arcs where a truck turned, drips under where one stood for years; row 4 bare (under the mezzanine).
  THE PIECES       (warehouse_art.json's kit, COMBAT THREE's names)
    wh_rack_ew     pallet racking seen from the lane, a tile wide: blue uprights, orange beams, three levels, what is left on
                   them (a few pallets nobody could reach, shrink wrap hanging, a bay stripped to the beams)
    wh_rack_ns     a rack's end, seen end on: the frame's bracing, the yellow guard at its foot
    wh_pallets     pallets pulled into the lane, their boxes slit (wh_stack the same picture)
    wh_spill       a bay of the rack come down across the lane: an upright bent over, beams, the boxes it held
    wh_camp_a/b    somebody sleeping between the racks: a bed of pallets, cardboard stood for a wall; in b a tarp for a roof
                   (wh_bedding_a/b the same pictures)
    wh_drums       drums and cones; wh_conveyor a stretch of roller conveyor a tile wide, a carton still on it
    wh_forklift    a dead forklift, a pallet still on its forks; wh_trailer a trailer at its dock, the open back: dark inside
    wh_desk        the shipping desk: the screen, the label printer, the last manifests; wh_cage the lock-up cage, cut open
    wh_column      a steel column, its yellow guard
    wh_mezz        a tile of the pick mezzanine's deck (steel plate on its beam); wh_stair_e/w its steel stairs; wh_rail_ew/ns
                   its yellow pipe rail; wh_wall_ew/ns the outer wall, tilt-up concrete
  THE CEILING      warehouse_ceiling.webp (rule 451(a), over the fight at 10%): the corrugated deck, open-web joists, a girder on
                   every bay's line, strip lights mostly dead (one lit), clear panels, the red sprinkler mains.

  <venv>/bin/python tools/bohemia_cook5_the_warehouse_finished_11_17_26.py render wh_floor | wh_pieces | ceil_warehouse [--quick]
  python3 tools/bohemia_cook5_the_warehouse_finished_11_17_26.py cut
  python3 tools/bohemia_cook5_the_warehouse_finished_11_17_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a distribution center's floor (sealed
slab, yellow lane lines, stencilled bay numbers, black tyre tracks down the lanes and arcs at the turns); selective pallet
racking (blue upright frames with diagonal bracing, orange step beams, yellow end guards); a counterbalance forklift (the
mast, the overhead guard, the counterweight); a dock position seen from inside (the trailer's open back, the leveller plate);
a roller conveyor on its legs; a wire security cage; a pick mezzanine of steel plate on beams with a yellow pipe rail; a
big-box roof from below (corrugated deck on open-web joists on girders, strip lights, clear panels, red sprinkler mains). The
twins: the mall's kit and the convention hall's (the card shows the warehouse before and now).
REUSE CHECK (REUSE-FIRST): this lane's mall tool (its stock, its materials), hall tool (its slab, its helpers) and the
tunnels-and-garage tool (rig, grounds, plans, Parts, cutter, pieces scene, ceiling scene): imported. New here only the
warehouse's own plan, parts and ceiling.
ANALOG HORROR: a forklift with a pallet still held up on its forks; a bed of pallets between racks stripped to the beams;
one strip light still lit over a lane nobody walks.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_mall_finished_11_17_26 as MT      # this lane's: the mall's tool, the hall's and TG through it

HT = MT.HT; TG = HT.TG; FW = TG.FW
W, H, PPM, PYM, SIDE, TM, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'warehouse')
rect, FONT = HT.rect, HT.FONT


# ---- the ground: the hall's sealed slab (the same ground), a warehouse's marks on it ----------------------------------------
def plan_wh_floor(ID, seed=97):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed); w = TG.win(lx, ly, 0.5, 1.5)
    gid = np.full((H, W), ID['hall_slab'], np.uint8)
    dust = TG.mixn(FW.vnoise((H, W), 2.5 * PPM, rng), TG.pnoise(rng, 2.5), w)
    pale = (0.08 + np.clip((dust - 0.5) / 0.3, -0.5, 1) * 0.05).astype(np.float32); dark = np.zeros((H, W), np.float32)
    # a yellow lane line inside every tile's north and south edge (the same on every tile, so lanes run on), scuffed off in places
    peel = TG.mixn(FW.vnoise((H, W), 0.7 * PPM, rng), TG.pnoise(rng, 0.7), w)
    line = ((np.abs(ly - 0.5) < 0.05) | (np.abs(ly - 11.5) < 0.05)) & (peel > 0.3)
    gid[line] = ID['gar_yellow']
    # two tyre tracks worn dark down every lane (straight through every tile's east and west edge), fainter in patches
    lane = TG.pnoise(rng, 2.0, 4.0)
    for c0 in (4.6, 7.4): dark = np.maximum(dark, np.clip(1 - np.abs(ly - c0) / 0.22, 0, 1) * (0.2 + 0.22 * lane))
    rr = np.random.RandomState(seed + 1)
    for r in range(4):
        for c in range(5):
            X0, T0 = c * TM, r * TM
            n = 10 + (r * 5 + c) * 2                           # THE BAY'S NUMBER, stencilled by the line
            for i, ch in enumerate('%02d' % n):
                for k, bit in enumerate(FONT[ch]):
                    if bit == '1' and rr.rand() > 0.06:
                        x = X0 + 0.8 + i * 0.5 + (k % 3) * 0.12; t = T0 + 0.9 + (k // 3) * 0.12
                        rect(gid, x, x + 0.12, t, t + 0.12, ID['gar_white'])
            if rr.rand() < 0.6:                                # where a truck turned into the racks: an arc of rubber
                cx, cy = X0 + rr.uniform(4.0, 8.0), T0 + (2.6 if rr.rand() < 0.5 else 9.4); rad = rr.uniform(1.6, 2.2)
                dd = np.hypot(xm - cx, (ty - cy) * 1.0); ang = np.arctan2(ty - cy, xm - cx)
                arc = np.clip(1 - np.abs(dd - rad) / 0.16, 0, 1) * ((ang > 0.2) & (ang < 2.6) if cy < T0 + 6 else (ang < -0.2) & (ang > -2.6))
                dark = np.maximum(dark, arc * 0.34)
            if rr.rand() < 0.5:                                # drips under where one stood for years
                sx, sy_ = X0 + rr.uniform(2.0, 10.0), T0 + rr.uniform(4.2, 7.8)
                for _k in range(9):
                    ax, ay = rr.normal(0, 0.35), rr.normal(0, 0.25); rad = rr.uniform(0.05, 0.16)
                    dd = np.hypot(xm - sx - ax, ty - sy_ - ay); dark = np.maximum(dark, np.clip(1 - dd / rad, 0, 1) * 0.6)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['wh_floor'] = plan_wh_floor


def wh_floor_things(bpy, NF, M, rng):
    out = FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0, 60), r_.uniform(0, 60)), 60)
    out += TG.floor_litter(bpy, NF, M, rng, 30)
    return out


TG.GARAGE_THINGS['wh_floor'] = wh_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
WH_AT = dict(mezz=(10.0, 45.0), stair_e=(26.0, 45.0), stair_w=(42.0, 45.0), rail_ew=(10.0, 40.5), wall_ew=(26.0, 39.5), rack_ew=(42.0, 36.0),
             rail_ns=(52.0, 4.0), wall_ns=(55.0, 4.0), rack_ns=(57.4, 21.0),
             trailer=(4.5, 26.5), forklift=(13.0, 28.0), conveyor=(26.0, 29.0), cage=(39.5, 27.5), desk=(47.0, 28.0),
             pallets=(4.0, 18.0), camp_a=(11.5, 18.0), camp_b=(19.5, 18.0), spill=(30.5, 18.0), drums=(41.5, 18.5), column=(48.0, 19.0))
RACK_H = 3.0


def upright(P, x, y0, y1, z=RACK_H, lean=0.0):
    """a rack's upright frame, end on: two blue posts 1.1 m apart, the bracing between"""
    for y in (y0, y1 - 0.08): P.box('rack_b', x - 0.04 + lean, x + 0.04 + lean, y, y + 0.08, 0.0, z)
    n = int(z / 0.75)
    for k in range(n): P.bar('rack_b', (x + lean, y0 + 0.04, 0.2 + k * 0.75), (x + lean, y1 - 0.04, 0.2 + (k + 1) * 0.75 if k % 2 == 0 else 0.2 + k * 0.75), 0.018)


def loads(P, x0, x1, y, z, rng, full=0.5):
    """what is left on a pair of beams between two uprights (2.9 m): a pallet or two, or nothing"""
    for k in range(2):
        if rng.rand() > full: continue
        x = x0 + 0.15 + k * 1.4; P.box('wood', x, x + 1.2, y + 0.05, y + 1.05, z + 0.1, z + 0.22)
        u = rng.rand(); h = rng.uniform(0.4, 0.75)
        if u < 0.5: P.box(('card', 'tan', 'paint_w')[int(rng.randint(3))], x + 0.05, x + 1.15, y + 0.08, y + 1.02, z + 0.22, z + 0.22 + h)
        elif u < 0.8:
            for bx in range(2): P.box('card', x + 0.05 + bx * 0.58, x + 0.55 + bx * 0.58, y + 0.08, y + 0.6, z + 0.22, z + 0.22 + h * 0.6)
        if rng.rand() < 0.4: P.box('jug', x + 0.3, x + 0.36, y + 0.02, y + 0.06, z - 0.5, z + 0.22)        # shrink wrap, hanging off it


def rack_ew(P, ox, oy, rng):
    """pallet racking seen from the lane, a tile wide: five uprights, four bays, beams at three levels"""
    xs = [ox - 6 + 0.06 + i * 2.97 for i in range(5)]
    for x in xs: upright(P, x, oy, oy + 1.1)
    for b in range(4):
        x0, x1 = xs[b], xs[b + 1]; bare = (b == 2)
        for lv, z in enumerate((0.0, 1.25, 2.3)):
            if lv > 0:
                for y in (oy + 0.0, oy + 1.02): P.box('orange', x0 + 0.04, x1 - 0.04, y, y + 0.08, z - 0.02, z + 0.1)
            if not bare: loads(P, x0, x1, oy, z - (0.1 if lv == 0 else 0.0), rng, (0.35, 0.45, 0.6)[lv])
    P.box('haz', ox - 6, ox - 5.9, oy - 0.12, oy + 1.22, 0.0, 0.35); P.box('haz', ox + 5.9, ox + 6, oy - 0.12, oy + 1.22, 0.0, 0.35)       # the end guards
    P.box('paint_w', xs[1] - 0.2, xs[1] + 0.2, oy - 0.02, oy, 1.5, 1.8)                                         # the bay's load plate
    for _ in range(6): x = ox + rng.uniform(-5.5, 5.5); P.box('card', x, x + 0.4, oy - rng.uniform(0.3, 0.9), oy - 0.1, 0.0, 0.04)


def rack_ns(P, ox, oy, rng):
    """a rack's end, seen end on (a tile deep): the frames in a row, the beams running away north, the guard at its foot"""
    for i in range(5): upright(P, ox, oy + 0.06 + i * 2.97 - 0.5, oy + 0.06 + i * 2.97 + 0.6)
    for z in (1.25, 2.3):
        for x in (ox - 0.04, ox + 0.04): P.box('orange', x - 0.04, x + 0.04, oy, oy + 12, z - 0.02, z + 0.1)
    P.box('haz', ox - 0.5, ox + 0.5, oy - 0.1, oy, 0.0, 0.35)


def spill(P, ox, oy, rng):
    """a bay of the rack come down across the lane: an upright bent over, beams, the boxes it held"""
    P.bar('rack_b', (ox - 3.6, oy + 2.4, 0.0), (ox - 2.2, oy + 0.5, 1.5), 0.05); P.bar('rack_b', (ox - 2.2, oy + 0.5, 1.5), (ox - 0.2, oy + 0.3, 0.3), 0.05)
    P.bar('rack_b', (ox - 3.6, oy + 1.3, 0.0), (ox - 2.4, oy - 0.2, 1.3), 0.05)
    for (a, b) in (((ox - 3.0, oy + 1.8, 0.9), (ox + 0.2, oy + 1.2, 0.1)), ((ox - 2.6, oy + 0.9, 0.5), (ox + 0.9, oy + 0.2, 0.06)), ((ox - 0.5, oy + 2.2, 0.06), (ox + 2.6, oy + 1.9, 0.06)), ((ox + 0.4, oy + 0.9, 0.06), (ox + 3.4, oy + 1.4, 0.3))):
        P.bar('orange', a, b, 0.055)
    for _ in range(20):
        x = ox + rng.uniform(-2.6, 3.4); y = oy + rng.uniform(0.0, 2.4); s_ = rng.uniform(0.35, 0.6); z = 0.0 if rng.rand() < 0.7 else 0.4
        P.box(('card', 'card', 'tan', 'paint_w')[int(rng.randint(4))], x, x + s_, y, y + s_ * 0.8, z, z + s_ * 0.7)
    for (x, y) in ((ox - 1.6, oy + 0.9), (ox + 1.5, oy + 0.4)): P.box('wood', x, x + 1.2, y, y + 1.0, 0.0, 0.14)
    P.box('jug', ox + 0.2, ox + 1.6, oy + 1.5, oy + 2.3, 0.0, 0.03)                                             # the wrap, spread on the floor
    for _ in range(14): x = ox + rng.uniform(-3.0, 3.6); y = oy + rng.uniform(-0.3, 2.6); P.box('can', x, x + 0.08, y, y + 0.08, 0.0, 0.12)


def wcamp(P, ox, oy, rng, b):
    for k in range(2): P.box('wood', ox - 2.3 + k * 1.22, ox - 1.1 + k * 1.22, oy + 0.3, oy + 2.3, 0.0, 0.14)     # a bed of pallets
    P.box('white', ox - 2.2, ox - 0.1, oy + 0.4, oy + 2.2, 0.14, 0.3); P.box('rug' if not b else 'couch', ox - 2.15, ox - 0.15, oy + 0.45, oy + 1.5, 0.3, 0.37); P.box('tan', ox - 1.9, ox - 1.3, oy + 1.7, oy + 2.1, 0.3, 0.4)
    for k in range(3): P.box('card', ox - 2.5 + k * 0.9, ox - 1.65 + k * 0.9, oy + 2.4, oy + 2.44, 0.0, 1.1 - 0.15 * (k % 2))                              # cardboard stood for a wall
    P.box('card', ox - 2.5, ox - 2.46, oy + 0.4, oy + 2.4, 0.0, 1.0)
    for (dx, dy, m) in ((0.4, 0.5, 'under'), (1.0, 0.4, 'blue'), (0.7, 1.0, 'tan_d')): P.box(m, ox + dx, ox + dx + 0.5, oy + dy, oy + dy + 0.4, 0.0, 0.3)
    P.drum('can', ox + 1.9, oy + 0.6, 0.0, 0.26, 0.09, 8); P.box('wax', ox + 1.4, ox + 1.48, oy + 1.6, oy + 1.68, 0.0, 0.12)
    for (dx, dy) in ((0.3, 1.8), (0.45, 1.85)): P.box('under', ox + dx, ox + dx + 0.11, oy + dy, oy + dy + 0.27, 0.0, 0.1)
    if b:
        for (dx, dy) in ((-2.4, 0.2), (0.0, 0.2), (-2.4, 2.35), (0.0, 2.35)): P.bar('wood_d', (ox + dx, oy + dy, 0.0), (ox + dx, oy + dy, 1.5), 0.025)
        P._add('blue', [(ox - 2.5, oy + 0.1, 1.5), (ox + 0.1, oy + 0.1, 1.5), (ox + 0.1, oy + 2.45, 1.75), (ox - 2.5, oy + 2.45, 1.75)], [(0, 1, 2, 3)])
        P.drum('under', ox + 1.7, oy + 1.9, 0.0, 0.3, 0.2, 10)
    else:
        P.box('wood', ox + 1.3, ox + 2.5, oy + 1.2, oy + 2.2, 0.0, 0.14); P.box('jug', ox + 1.5, ox + 1.75, oy + 1.4, oy + 1.65, 0.14, 0.5); P.box('jug', ox + 1.9, ox + 2.15, oy + 1.5, oy + 1.75, 0.14, 0.5)


def drums(P, ox, oy, rng):
    for i, (dx, dy) in enumerate(((-1.6, 0.4), (-0.9, 0.5), (-1.25, 1.1), (0.4, 0.3), (1.2, 0.9))):
        m = ('blue', 'rustp', 'blue', 'steel', 'rustp')[i]; P.drum(m, ox + dx, oy + dy, 0.0, 0.88, 0.29, 14); P.drum('under' if i != 3 else 'rust', ox + dx, oy + dy, 0.88, 0.9, 0.26, 14)
    P.box('wood', ox - 2.0, ox - 0.5, oy + 0.0, oy + 1.5, -0.001, 0.0)
    P.tube_x('rustp', ox + 1.9, ox + 2.8, oy + 0.4, 0.29, 0.29)                                                 # one on its side, what it held gone into the slab
    for (dx, dy) in ((-0.1, -0.3), (0.7, -0.1), (2.2, 1.3)): P.drum('orange', ox + dx, oy + dy, 0.0, 0.7, 0.17, 10, 0.04); P.box('orange', ox + dx - 0.2, ox + dx + 0.2, oy + dy - 0.2, oy + dy + 0.2, 0.0, 0.04)


def conveyor(P, ox, oy, rng):
    for y in (oy + 0.3, oy + 1.0): P.box('steel', ox - 6, ox + 6, y, y + 0.06, 0.62, 0.78)
    for k in range(40): P.bar('can', (ox - 5.9 + k * 0.3, oy + 0.33, 0.74), (ox - 5.9 + k * 0.3, oy + 1.03, 0.74), 0.04)      # the rollers
    for x in (ox - 5.6, ox - 1.9, ox + 1.9, ox + 5.6):
        for y in (oy + 0.3, oy + 1.0): P.box('steel', x, x + 0.06, y, y + 0.06, 0.0, 0.62)
        P.box('steel', x, x + 0.06, oy + 0.3, oy + 1.06, 0.2, 0.26)
    P.box('card', ox - 2.6, ox - 2.0, oy + 0.4, oy + 0.9, 0.78, 1.2); P.box('paper', ox - 2.5, ox - 2.2, oy + 0.38, oy + 0.4, 0.9, 1.1)      # a carton still on it, its label
    P.box('card', ox + 3.2, ox + 3.9, oy - 0.5, oy - 0.0, 0.0, 0.4); P.box('haz', ox - 6, ox + 6, oy + 0.28, oy + 0.3, 0.64, 0.7)


def forklift(P, ox, oy, rng):
    """a dead counterbalance forklift, its forks to the west, a pallet still held up on them"""
    P.box('paint_y', ox - 0.4, ox + 1.5, oy + 0.2, oy + 1.4, 0.3, 1.1); P.box('under', ox + 0.9, ox + 1.6, oy + 0.15, oy + 1.45, 0.3, 1.25)       # the body, the counterweight
    for (dx, dy) in ((-0.2, 0.1), (-0.2, 1.3), (1.1, 0.12), (1.1, 1.28)): P.box('under', ox + dx - 0.25, ox + dx + 0.25, oy + dy, oy + dy + 0.2, 0.0, 0.5)     # the tyres
    P.box('under', ox + 0.2, ox + 0.75, oy + 0.45, oy + 1.15, 1.1, 1.3); P.box('under', ox + 0.6, ox + 0.75, oy + 0.45, oy + 1.15, 1.3, 1.7)        # the seat
    for (dx, dy) in ((-0.3, 0.25), (-0.3, 1.3), (1.2, 0.25), (1.2, 1.3)): P.bar('paint_y', (ox + dx, oy + dy, 1.1), (ox + dx, oy + dy, 2.1), 0.03)     # the overhead guard
    P.box('paint_y', ox - 0.35, ox + 1.25, oy + 0.2, oy + 1.4, 2.1, 2.16)
    for dy in (0.35, 1.15): P.box('steel', ox - 0.6, ox - 0.45, oy + dy, oy + dy + 0.1, 0.0, 2.6)                # the mast
    P.box('steel', ox - 0.6, ox - 0.45, oy + 0.35, oy + 1.25, 2.5, 2.6); P.box('under', ox - 0.7, ox - 0.6, oy + 0.3, oy + 1.3, 1.0, 1.5)
    for dy in (0.45, 1.05): P.box('steel', ox - 1.9, ox - 0.7, oy + dy, oy + dy + 0.1, 1.0, 1.05)                # the forks, up
    P.box('wood', ox - 1.95, ox - 0.75, oy + 0.25, oy + 1.35, 1.05, 1.19); P.box('card', ox - 1.9, ox - 0.8, oy + 0.3, oy + 1.3, 1.19, 1.8); P.box('jug', ox - 1.92, ox - 0.78, oy + 0.28, oy + 0.3, 1.19, 1.8)   # the pallet it still holds
    for _ in range(5): P.box('under', ox + rng.uniform(-0.2, 1.0), ox + rng.uniform(-0.2, 1.0) + 0.15, oy - 0.25 + rng.uniform(0, 0.3), oy - 0.15 + rng.uniform(0, 0.3), 0.0, 0.01)   # what leaked out of it


def trailer(P, ox, oy, rng):
    """a trailer at its dock, the open back toward the map's eye: the box 2.6 wide and 5 m of it, dark inside, its doors swung
    flat to its sides, the leveller plate, a few cartons nobody carried off"""
    P.box('paint_w', ox - 1.3, ox + 1.3, oy + 0.6, oy + 5.6, 1.2, 3.9); P.box('under', ox - 1.2, ox + 1.2, oy + 0.594, oy + 0.6, 1.3, 3.8)        # the box, its inside dark
    P.box('steel', ox - 1.3, ox + 1.3, oy + 0.56, oy + 0.6, 1.2, 1.3); P.box('steel', ox - 1.3, ox + 1.3, oy + 0.56, oy + 0.6, 3.8, 3.9)
    for sx in (-1, 1):
        P.box('steel', ox + sx * 1.3 - 0.04, ox + sx * 1.3 + 0.04, oy + 0.56, oy + 0.6, 1.2, 3.9)
        P.box('paint_w', ox + sx * 1.34 - 0.03, ox + sx * 1.34 + 0.03, oy + 0.6, oy + 1.9, 1.3, 3.8)            # a door, swung back along its side
    P.box('conc', ox - 2.2, ox + 2.2, oy + 0.6, oy + 5.6, 0.0, 1.2)                                             # the dock it stands at (the yard is lower)
    P.box('steel', ox - 1.1, ox + 1.1, oy + 0.0, oy + 0.62, 1.2, 1.26); P.box('haz', ox - 1.1, ox + 1.1, oy - 0.02, oy + 0.02, 1.2, 1.27)           # the leveller plate, down
    P.box('conc', ox - 2.2, ox + 2.2, oy, oy + 0.6, 0.0, 1.2)
    for sx in (-1, 1): P.box('under', ox + sx * 1.6 - 0.15, ox + sx * 1.6 + 0.15, oy - 0.1, oy, 0.5, 1.1)       # the bumpers
    for (dx, z) in ((-0.9, 1.3), (-0.3, 1.3), (-0.8, 1.72), (0.5, 1.3)): P.box('card', ox + dx, ox + dx + 0.5, oy + 0.7, oy + 1.15, z, z + 0.4)     # cartons, just inside
    P.box('haz', ox - 2.2, ox + 2.2, oy - 0.01, oy, 1.05, 1.2)


def desk(P, ox, oy, rng):
    P.box('steel', ox - 1.4, ox + 1.4, oy + 0.6, oy + 1.4, 0.0, 1.05); P.box('wood', ox - 1.5, ox + 1.5, oy + 0.5, oy + 1.5, 1.05, 1.1)
    P.box('under', ox - 0.9, ox - 0.3, oy + 1.1, oy + 1.2, 1.1, 1.6); P.box('glass_d', ox - 0.86, ox - 0.34, oy + 1.094, oy + 1.1, 1.16, 1.56)       # the screen, dead
    P.box('paint_w', ox + 0.3, ox + 0.8, oy + 0.9, oy + 1.3, 1.1, 1.35); P.box('paper', ox + 0.4, ox + 0.7, oy + 0.6, oy + 0.9, 1.1, 1.104)          # the label printer, a strip of labels out of it
    for k in range(5): P.box('paper', ox - 1.3 + k * 0.12, ox - 1.05 + k * 0.12, oy + 0.6 + k * 0.05, oy + 0.9 + k * 0.05, 1.1 + k * 0.004, 1.104 + k * 0.004)   # the last manifests
    P.box('under', ox + 1.7, ox + 2.2, oy + 0.6, oy + 1.1, 0.0, 0.5); P.box('under', ox + 1.7, ox + 2.2, oy + 1.05, oy + 1.12, 0.5, 1.0)             # the chair
    P.box('paint_y', ox - 2.6, ox - 2.0, oy + 0.2, oy + 1.5, 0.0, 0.12); P.bar('paint_y', (ox - 2.3, oy + 1.5, 0.1), (ox - 2.3, oy + 1.8, 1.2), 0.03)   # a pallet jack
    P.box('steel', ox - 1.4, ox + 1.4, oy + 1.5, oy + 1.56, 1.1, 2.0)
    for k in range(4): P.box('paper', ox - 1.2 + k * 0.65, ox - 0.75 + k * 0.65, oy + 1.494, oy + 1.5, 1.3, 1.9)                                      # the board behind it: routes, a rota


def cage(P, ox, oy, rng):
    """the lock-up cage, cut open: wire panels on posts 4 m by 3 m, 2.4 m high; one panel peeled back; its shelves emptied"""
    for (dx, dy) in ((-2, 0), (0, 0), (2, 0), (-2, 3), (0, 3), (2, 3)): P.box('steel', ox + dx - 0.04, ox + dx + 0.04, oy + dy, oy + dy + 0.08, 0.0, 2.4)
    def mesh_x(x0, x1, y, skip=None):
        for k in range(int((x1 - x0) / 0.2) + 1):
            x = x0 + k * 0.2
            if skip and skip[0] < x < skip[1]: continue
            P.bar('steel', (x, y, 0.1), (x, y, 2.3), 0.008)
        for z in (0.1, 0.85, 1.6, 2.3):
            if skip: P.bar('steel', (x0, y, z), (skip[0], y, z), 0.01); P.bar('steel', (skip[1], y, z), (x1, y, z), 0.01)
            else: P.bar('steel', (x0, y, z), (x1, y, z), 0.01)
    mesh_x(ox - 2, ox + 2, oy + 0.04, skip=(ox - 0.2, ox + 1.3)); mesh_x(ox - 2, ox + 2, oy + 3.04)
    for x in (ox - 2, ox + 2):
        for k in range(16): P.bar('steel', (x, oy + k * 0.2, 0.1), (x, oy + k * 0.2, 2.3), 0.008)
        for z in (0.1, 1.2, 2.3): P.bar('steel', (x, oy, z), (x, oy + 3.04, z), 0.01)
    for k in range(8): P.bar('steel', (ox - 0.2 + k * 0.2, oy - 0.05 - 0.08 * k, 0.1), (ox - 0.2 + k * 0.2, oy - 0.6 - 0.05 * k, 1.9 - 0.1 * k), 0.008)        # the panel they cut, peeled out
    P.box('steel', ox - 1.8, ox + 1.8, oy + 2.4, oy + 2.9, 0.0, 1.8)
    for s_ in range(3): P.box('paint_w', ox - 1.85, ox + 1.85, oy + 2.2, oy + 2.45, 0.4 + s_ * 0.55, 0.44 + s_ * 0.55)
    P.box('card', ox - 1.2, ox - 0.7, oy + 0.9, oy + 1.4, 0.0, 0.3); P.box('under', ox + 0.5, ox + 0.62, oy - 0.3, oy - 0.2, 0.0, 0.06)                  # one empty carton, the padlock on the floor
    P.box('red', ox - 1.9, ox - 1.2, oy - 0.012, oy + 0.03, 1.5, 1.9)


def wcolumn(P, ox, oy, rng):
    P.box('steel', ox - 0.15, ox + 0.15, oy - 0.02, oy + 0.02, 0.0, 2.6)                                        # an H column: web and two flanges
    for y in (oy - 0.16, oy + 0.12): P.box('steel', ox - 0.15, ox + 0.15, y, y + 0.04, 0.0, 2.6)
    P.box('cut', ox - 0.16, ox + 0.16, oy - 0.17, oy + 0.17, 2.6, 2.61)
    P.box('haz', ox - 0.45, ox + 0.45, oy - 0.45, oy + 0.45, 0.0, 0.08)
    for (dx, dy) in ((-0.45, -0.45), (0.37, -0.45), (-0.45, 0.37), (0.37, 0.37)): P.box('haz', ox + dx, ox + dx + 0.08, oy + dy, oy + dy + 0.08, 0.0, 1.0)     # its guard
    for z in (0.5, 0.95): P.box('haz', ox - 0.45, ox + 0.45, oy - 0.45, oy - 0.39, z, z + 0.08)
    P.box('paint_w', ox - 0.13, ox + 0.13, oy - 0.165, oy - 0.16, 1.5, 1.9)


def wmezz(P, ox, oy, rng):
    P.box('steel', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.06, LEVEL_H)                                        # steel plate
    for k in range(13): P.box('under', ox - 6 + k * 1.0 - 0.01, ox - 6 + k * 1.0 + 0.01, oy, oy + 12, LEVEL_H, LEVEL_H + 0.003)
    for k in range(7): P.box('under', ox - 6, ox + 6, oy + k * 2.0 - 0.01, oy + k * 2.0 + 0.01, LEVEL_H + 0.003, LEVEL_H + 0.006)
    P.box('orange', ox - 6, ox + 6, oy - 0.06, oy + 0.06, LEVEL_H - 0.36, LEVEL_H - 0.06)                       # its edge beam
    P.box('under', ox - 6, ox + 6, oy + 0.05, oy + 0.06, 0.0, LEVEL_H - 0.36)                                   # the dark under it
    for x in (ox - 6, ox - 0.06): P.box('rack_b', x, x + 0.12, oy - 0.06, oy + 0.06, 0.0, LEVEL_H - 0.36)       # its posts (one on the tile's west line)
    P.box('rack_b', ox + 5.88, ox + 6, oy - 0.06, oy + 0.06, 0.0, LEVEL_H - 0.36)
    P.box('conc', ox - 6, ox + 6, oy + 0.06, oy + 12, 0.0, 0.001)


def wstair(P, ox, oy, sgn):
    n = 12; xl, xh = (ox - 6, ox + 6) if sgn > 0 else (ox + 6, ox - 6)
    for i in range(n):                                         # steel treads a tile long, a yellow nosing
        xa = ox - 6 + i if sgn > 0 else ox + 6 - i - 1; z = LEVEL_H * (i + 1) / n
        P.box('steel', xa, xa + 1, oy + 0.3, oy + 11.7, z - 0.05, z); P.box('under', xa + (0.9 if sgn > 0 else 0.0), xa + (1.0 if sgn > 0 else 0.1), oy + 0.3, oy + 11.7, 0.0, z - 0.05)
        xe = xa if sgn > 0 else xa + 1 - 0.08
        P.box('haz', xe, xe + 0.08, oy + 0.3, oy + 11.7, z, z + 0.005)
    for yy in (oy, oy + 11.7):                                 # a stringer each side, the yellow rail
        pr = [(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.2), (xl, 0.2)]
        P.prism_y('orange', yy + 0.1, yy + 0.2, pr if sgn < 0 else pr[::-1])
        P.bar('haz', (xl, yy + 0.15, 1.0), (xh, yy + 0.15, LEVEL_H + 1.0), 0.03); P.bar('haz', (xl, yy + 0.15, 0.55), (xh, yy + 0.15, LEVEL_H + 0.55), 0.02)
        for k in range(7): t = k / 6.0; x = xl + (xh - xl) * t; P.bar('haz', (x, yy + 0.15, LEVEL_H * t + 0.1), (x, yy + 0.15, LEVEL_H * t + 1.0), 0.02)


def wrail_ew(P, ox, oy, rng):
    P.box('haz', ox - 6, ox + 6, oy + 0.1, oy + 0.14, 0.0, 0.12)                                                # the kick plate
    for i in range(7): x = min(ox - 6 + i * 2.0 + 0.03, ox + 5.97); P.bar('haz', (x, oy + 0.12, 0.0), (x, oy + 0.12, 1.04), 0.025)
    for z in (0.55, 1.04): P.bar('haz', (ox - 6, oy + 0.12, z), (ox + 6, oy + 0.12, z), 0.025)


def wrail_ns(P, ox, oy, rng):
    P.box('haz', ox - 0.02, ox + 0.02, oy, oy + 12, 0.0, 0.12)
    for i in range(7): y = min(oy + i * 2.0 + 0.03, oy + 11.97); P.bar('haz', (ox, y, 0.0), (ox, y, 1.04), 0.025)
    for z in (0.55, 1.04): P.bar('haz', (ox, oy, z), (ox, oy + 12, z), 0.025)


def wwall_ew(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.25, 0.0, 1.6)
    for i in range(1, 3): P.box('conc_d', ox - 6 + i * 4.0 - 0.012, ox - 6 + i * 4.0 + 0.012, oy - 0.008, oy + 0.25, 0.0, 1.605)       # the panels' joints
    P.box('shutter', ox - 6, ox + 6, oy - 0.006, oy, 0.0, 0.5)                                                  # a grey dado, scuffed
    for _ in range(8): x = rng.uniform(ox - 5.8, ox + 5.4); P.box('under', x, x + rng.uniform(0.2, 0.8), oy - 0.012, oy - 0.006, 0.02, rng.uniform(0.15, 0.45))
    P.box('haz', ox + 1.0, ox + 2.2, oy - 0.012, oy - 0.006, 0.9, 1.4); P.box('under', ox + 1.3, ox + 1.9, oy - 0.016, oy - 0.012, 1.0, 1.3)     # a sign: its picture gone dark
    P.box('red', ox - 4.0, ox - 3.7, oy - 0.1, oy, 0.5, 1.1)                                                    # an extinguisher


def wwall_ns(P, ox, oy, rng):
    P.box('conc', ox - 0.125, ox + 0.125, oy, oy + 12, 0.0, 1.6)
    for i in range(1, 3): P.box('conc_d', ox - 0.133, ox + 0.133, oy + i * 4.0 - 0.012, oy + i * 4.0 + 0.012, 0.0, 1.605)


def wh_parts(P, rng):
    A = WH_AT
    wmezz(P, *A['mezz'], rng); wstair(P, *A['stair_e'], 1); wstair(P, *A['stair_w'], -1)
    wrail_ew(P, *A['rail_ew'], rng); wrail_ns(P, *A['rail_ns'], rng); wwall_ew(P, *A['wall_ew'], rng); wwall_ns(P, *A['wall_ns'], rng)
    rack_ew(P, *A['rack_ew'], rng); rack_ns(P, *A['rack_ns'], rng)
    trailer(P, *A['trailer'], rng); forklift(P, *A['forklift'], rng); conveyor(P, *A['conveyor'], rng); cage(P, *A['cage'], rng); desk(P, *A['desk'], rng)
    MT.stock(P, *A['pallets'], rng); wcamp(P, *A['camp_a'], rng, False); wcamp(P, *A['camp_b'], rng, True); spill(P, *A['spill'], rng)
    drums(P, *A['drums'], rng); wcolumn(P, *A['column'], rng)


def wh_mats(bpy, NF, F, M, which):
    if which not in ('wh_pieces', 'tun_pieces'): return         # ('tun_pieces' is what the ceiling's scene asks its materials by)
    if which == 'wh_pieces': MT.mall_mats(bpy, NF, F, M, 'mall_pieces')       # the mall's own (the stock's bands, the dark, the dead glass)
    M.update(orange=NF.material(bpy, 'in_paint_beam_orange', 'sodium', 2, 1.0), rack_b=NF.material(bpy, 'in_paint_rack_blue', 'clay_teal', 2, 1.05),
             haz=NF.material(bpy, 'in_paint_hazard', 'clay_mustard', 3, 0.95), corr=NF.material(bpy, 'in_ceil_deck', 'tape_grey', 2, 0.6),
             corr_d=NF.material(bpy, 'in_ceil_deck_rib', 'tape_grey', 1, 0.6), clearp=NF.material(bpy, 'in_ceil_clear_panel', 'clay_bone', 4, 0.95))


TG.PARTS['wh_pieces'] = wh_parts
TG.MAT_HOOKS.append(wh_mats)


# ---- the ceiling (rule 451(a)) ----------------------------------------------------------------------------------------------
def ceil_warehouse(P, rng):
    at, band_y = TG.at, TG.band_y
    P.box('corr', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                    # the deck
    for k in range(-4, 90): P.box('corr_d', -3.0, 63.0, k * 0.75 - 0.1, k * 0.75 + 0.1, 0.0, 0.06 + 0.0003 * (k % 7))      # its corrugations (east-west, never two in one plane)
    for r in range(5):
        for c in range(5):
            if (r + c) % 2 == 0:                               # a clear panel: day, grey with years of dust
                x, y = at(c, r, 6.0, 3.0, 0.0); P.box('clearp', x - 1.5, x + 1.5, y - 0.6, y + 0.6, 0.0, 0.085)
    for c in range(-1, 26):                                    # open-web joists, north to south, every 2.4 m: two chords and the web
        x = c * 2.4 + 1.2
        if abs((x % TM)) < 0.5 or abs((x % TM) - TM) < 0.5: continue
        P.box('white', x - 0.05, x + 0.05, -3.0, 63.0, 0.1, 0.18); P.box('white', x - 0.05, x + 0.05, -3.0, 63.0, 0.8, 0.88)
        for k in range(-2, 52): y = k * 1.2; P.bar('white', (x, y, 0.16 if k % 2 == 0 else 0.82), (x, y + 1.2, 0.82 if k % 2 == 0 else 0.16), 0.03)
    for r in range(-1, 7):                                     # a girder on every bay's line, both ways (broad: a bay's edge is all girder)
        ya, yb = band_y(r, 0.0, 1.3, 1.1); P.box('beam', -3.0, 63.0, ya, yb, 0.0, 1.1); yc = (ya + yb) / 2; P.box('rustp', -3.0, 63.0, yc - 0.5, yc + 0.5, 1.1, 1.12)   # its bottom flange, primer red gone dull
    for c in range(6):
        x = c * TM; P.box('beam', x - 0.65, x + 0.65, -3.0, 63.0, 0.0, 1.115); P.box('rustp', x - 0.5, x + 0.5, -3.0, 63.0, 1.115, 1.14)
    for r in range(-1, 6):                                     # the sprinkler mains, red, and their drops
        _, y = at(0, r, 0, 8.2, 1.25); P.tube_x('red', -3.0, 63.0, y, 1.25, 0.09)
        for c in range(5):
            for lx in (3.0, 9.0):
                x, yy = at(c, max(r, 0), lx, 8.2, 1.3)
                if r >= 0: P.bar('red', (x, yy, 1.2), (x, yy, 1.45), 0.03); P.drum('brass', x, yy, 1.45, 1.5, 0.08, 8)
    for r in range(5):
        for c in range(5):
            for (lx, ly) in ((3.6, 5.6), (8.4, 5.6)):          # strip lights on their chains, mostly dead (one lit: rule 20)
                x, y = at(c, r, lx, ly, 1.0); lit = (c, r, lx) == (3, 2, 3.6)
                P.box('lit' if lit else 'white', x - 1.2, x + 1.2, y - 0.1, y + 0.1, 0.95, 1.05)
                for dx in (-1.0, 1.0): P.bar('black', (x + dx, y, 0.0), (x + dx, y, 0.95), 0.008)
                if rng.rand() < 0.12: P.bar('black', (x - 1.0, y, 0.0), (x - 1.0, y, 0.95), 0.008)


TG.CEILINGS['warehouse'] = (ceil_warehouse, 'warehouse/warehouse_ceiling.webp', "the corrugated deck, open-web joists every 2.4 m, a girder on every bay's line both ways, strip lights on their chains (one lit), clear panels grey with dust, the red sprinkler mains and their drops")
TG.CEIL_DATA['warehouse'] = 'warehouse/warehouse.json'


# ---- the cut (no Blender) ----------------------------------------------------------------------------------------------------
KIND = dict(mezz='HEIGHT', stair_e='HEIGHT', stair_w='HEIGHT', rail_ew='RAIL', rail_ns='RAIL', wall_ew='WALL', wall_ns='WALL', rack_ew='WALL', rack_ns='WALL', trailer='WALL', forklift='COVER',
            conveyor='LOW_COVER', cage='COVER', desk='LOW_COVER', pallets='COVER', camp_a='LOW_COVER', camp_b='LOW_COVER', spill='COVER', drums='COVER', column='WALL')
HM = dict(mezz=LEVEL_H, stair_e=LEVEL_H, stair_w=LEVEL_H, rail_ew=1.04, rail_ns=1.04, wall_ew=1.6, wall_ns=1.6, rack_ew=RACK_H, rack_ns=RACK_H, trailer=3.9, forklift=2.6, conveyor=1.2, cage=2.4,
          desk=2.0, pallets=1.4, camp_a=1.1, camp_b=1.75, spill=1.5, drums=0.9, column=2.6)
NAME = dict(mezz='THE PICK MEZZANINE', stair_e='ITS STAIR, EAST', stair_w='ITS STAIR, WEST', rail_ew='THE YELLOW RAIL', rail_ns='THE YELLOW RAIL', wall_ew='THE OUTER WALL', wall_ns='THE OUTER WALL',
            rack_ew='PALLET RACKING', rack_ns="A RACK'S END", trailer='A TRAILER AT ITS DOCK', forklift='A DEAD FORKLIFT', conveyor='THE ROLLER CONVEYOR', cage='THE LOCK-UP CAGE, CUT OPEN',
            desk='THE SHIPPING DESK', pallets='PALLETS IN THE LANE', camp_a='SOMEBODY SLEEPS HERE', camp_b='SOMEBODY SLEEPS HERE', spill='A BAY COME DOWN', drums='DRUMS AND CONES', column='A COLUMN')
ALSO = dict(stack='pallets', bedding_a='camp_a', bedding_b='camp_b')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'wh_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'warehouse_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'wh_pieces.png')).convert('RGBA'); A = WH_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'wh_' + key, 'warehouse', shadow)
    for key in ('mezz', 'stair_e', 'stair_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.08, y + 12.0 + hh + (1.7 if key != 'mezz' else 0.3)), 0.0)
        v = sz[key]                                            # a stair's steel starts a hand north of the tile's edge: the canvas runs down to its foot all the same (the gate's A4)
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'wh_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1])), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.3, y + 1.9), 0.4)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.5, x + 1.3, y - 0.05, y + 13.6), 0.5)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.12, y + 2.75), 0.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.5, x + 1.6, y - 0.05, y + 14.4), 0.5)
    x, y = A['rack_ew']; one('rack_ew', (x - 6.0, x + 6.0 + 0.01, y - 1.0, y + 1.2 + RACK_H * 1.45), 1.0)
    x, y = A['rack_ns']; one('rack_ns', (x - 0.8, x + 2.4, y - 0.6, y + 12.8 + RACK_H * 1.45), 0.6)
    x, y = A['trailer']; one('trailer', (x - 2.4, x + 5.6, y - 0.2, y + 5.7 + 5.7), 0.6)
    x, y = A['forklift']; one('forklift', (x - 2.2, x + 4.0, y - 0.4, y + 1.6 + 3.8), 0.7)
    x, y = A['conveyor']; one('conveyor', (x - 6.0, x + 6.0 + 0.01, y - 0.7, y + 1.2 + 1.8), 0.7)
    x, y = A['cage']; one('cage', (x - 2.3, x + 4.6, y - 0.8, y + 3.2 + 3.5), 0.6)
    x, y = A['desk']; one('desk', (x - 2.8, x + 4.2, y - 0.1, y + 1.7 + 2.9), 0.7)
    x, y = A['pallets']; one('pallets', (x - 1.8, x + 2.4, y - 1.1, y + 2.4 + 2.2), 0.7)
    for key in ('camp_a', 'camp_b'):
        x, y = A[key]; one(key, (x - 2.8, x + 3.6, y - 0.2, y + 2.6 + 2.6), 0.7)
    x, y = A['spill']; one('spill', (x - 3.9, x + 4.6, y - 0.5, y + 2.8 + 2.2), 0.7)
    x, y = A['drums']; one('drums', (x - 2.2, x + 3.8, y - 0.6, y + 1.6 + 1.4), 0.7)
    x, y = A['column']; one('column', (x - 0.7, x + 2.8, y - 0.7, y + 0.5 + 4.0), 0.6, foot=(x, y - 0.1))
    for k, v in sz.items(): v.update(piece=k, src='warehouse/wh_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['warehouse/warehouse_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'wh_' + k: ent(k) for k in sz}
    for a, k in ALSO.items(): kit['wh_' + a] = dict(ent(k), kind='DRESS')
    art = {
        'version': 'cook5-warehouse-art-11-17', 'lane': 'cook 5', 'stage': 'finished',
        'for': "COMBAT THREE's distribution warehouse (slices/fight_ground/warehouse/warehouse.json): the names its handoff asked for, the garage's format. floor.floor is the lanes' slab (rows 0 to 3 of the sheet: the yellow lane lines, the bay numbers, the tyre tracks), floor.high its bare row (row 4, under the mezzanine's own picture), floor.ring every tile (the warehouse going on past the fight). Any tile meets any tile.",
        'floor': {'floor': cells((0, 1, 2, 3)), 'high': cells((4,)), 'ring': cells((0, 1, 2, 3, 4))},
        'kit': kit,
        'how_it_lays': {
            'the racking': "wh_rack_ew is a tile long, 1.1 m deep, 3 m up the glass, foot its south base middle (the lane side shows): laid on both long faces of a rack tile it reads as a rack two deep. wh_rack_ns is a rack's end, a tile deep, foot its south end middle.",
            'the lane': "wh_pallets (wh_stack the same picture), wh_spill, wh_camp_a/b (wh_bedding_a/b the same), wh_drums: foot the piece's south edge middle. wh_conveyor is a tile wide, 0.8 m up.",
            'the blockers': "wh_forklift's forks point west, a pallet held up on them; wh_trailer is the open back of a trailer on its dock (1.2 m up), foot the dock's south face middle; wh_cage is 4 m by 3 m; wh_column's foot is its base middle; wh_desk faces south",
            'the mezzanine': "wh_mezz on every high tile, foot at the tile's south edge middle; 1.42 m up; its plate's joints repeat every metre and two, so deck tiles meet. wh_stair_e climbs to the east, wh_stair_w to the west (the same foot). wh_rail_ew / wh_rail_ns on its open edges.",
            'the outer wall': 'wh_wall_ew / wh_wall_ns: tilt-up concrete cut at 1.6 m, a tile long',
        },
        'bytes': bytes_,
    }
    TG.keep_ceiling(art, os.path.join(SHIP, 'warehouse_art.json'))
    cp = os.path.join(REND, 'ceil_warehouse.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'warehouse_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'warehouse/warehouse.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "warehouse/warehouse_ceiling.webp"' in e
        e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
        open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='warehouse/warehouse_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['warehouse'][2],
                              contract="warehouse.json 'ceiling' (COMBAT THREE's: the fight draws it over the board at that alpha, rule 451(a))")
    json.dump(art, open(os.path.join(SHIP, 'warehouse_art.json'), 'w'), indent=1)
    print('warehouse: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


def sheet(before_dir, page_dir):
    """records/target/COOK5_THE_WAREHOUSE_11_17.webp: what the VOTE card shows. The phone shots are the game's own fight page
    (tools/bohemia_a_big_inside_on_the_page_11_17_26.js): the same fight before (every piece a stand-in) and now, the ceiling at
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
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    title('THE WAREHOUSE, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the roof at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL 302 PIECES STAND-INS', up(os.path.join(before_dir, 'warehouse_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'warehouse_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE ROOF AT 10%', up(os.path.join(page_dir, 'warehouse_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('SIDEWAYS', '844 x 390, the roof at 10%')
    n = Image.open(os.path.join(page_dir, 'warehouse_sideways_open_a01.png')).convert('RGB'); rows.append(n.resize((WID, int(n.height * WID / n.width)), Image.LANCZOS))
    title('THE PIECES AT THEIR OWN PIXELS', 'the racking, a bay come down, a dead forklift, a trailer at its dock, the conveyor, the cage cut open, the desk, two beds of pallets, drums')
    def piece(k, bg=(112, 110, 104)):
        im = Image.open(os.path.join(SHIP, 'wh_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('rack_ew', 'spill'), 190); row_of(('trailer', 'forklift', 'cage', 'desk'), 260); row_of(('conveyor', 'drums', 'column'), 130); row_of(('camp_a', 'camp_b', 'pallets'), 200); row_of(('mezz', 'stair_e'), 300)
    title('A TILE OF THE FLOOR, AND THE ROOF AT FULL STRENGTH', 'lane lines, the bay number, tyre tracks; the deck, joists, girders, strip lights, clear panels, the red sprinkler mains')
    fl = Image.open(os.path.join(SHIP, 'warehouse_floor_0.webp')).convert('RGB').crop((TW, TH, TW * 2, TH * 2)); ce = Image.open(os.path.join(SHIP, 'warehouse_ceiling.webp')).convert('RGB'); bw, bh = ce.width // 5, ce.height // 5
    ce = ce.crop((bw * 2, bh, bw * 4, bh * 3)); cw2 = (WID - 10) // 2; hh2 = int(TH * cw2 / TW); r = Image.new('RGB', (WID, hh2), BG); r.paste(fl.resize((cw2, hh2), Image.LANCZOS), (0, 0)); r.paste(ce.resize((cw2, hh2), Image.LANCZOS), (cw2 + 10, 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK5_THE_WAREHOUSE_11_17.webp'); out.save(fn, 'WEBP', quality=76, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); os.makedirs(os.path.join(R, 'records/target/vote_first'), exist_ok=True)
    f2 = os.path.join(R, 'records/target/vote_first/cook5-the-warehouse-11-17.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        quick = '--quick' in a
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, quick) if n == 'wh_floor' else TG.scene_pieces(n, quick) if n == 'wh_pieces' else TG.scene_ceiling('warehouse', quick)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_wh_floor(ID); pal = np.random.RandomState(5).randint(40, 220, (64, 3)).astype(np.uint8)
        im = pal[gid].astype(np.float32) * (1 - 0.6 * dark[..., None]) + pale[..., None] * 50
        os.makedirs(TG.OUT, exist_ok=True); Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(os.path.join(TG.OUT, 'plan_wh_floor.png')); print('plan written')
    else: print(__doc__)
