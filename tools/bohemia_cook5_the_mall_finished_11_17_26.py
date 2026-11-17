#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the mall, finished] (11/17/26; the coordinator's routine 'COOK FIVE full sweep', VAMILY rules 453, 441,
416, 451(a), 455: '... the art for COMBAT THREE's next interior and its ceiling ... keep going build after build').

COMBAT THREE's fifth inside (BUILD 11/17x - THE MALL, slices/fight_ground/mall/mall.json, laid by slices/bohemia_big_inside.js):
a fight on the dead mall's concourse, eight stores as rooms, the upper level's bridge in the middle. EVERY PICTURE OF IT WAS A
STAND-IN. Its handoff names what it wants; these are the pictures, through the master rig, ON this lane's hall tool and the
tunnels-and-garage tool under it (both imported):

  THE FLOORS       two sheets, each five tiles by five (any tile meets any tile): mall_floor_0.webp THE CONCOURSE (pale terrazzo in
                   brass-strip squares, a dark diamond inlaid at every tile's middle, cracked, water marks under where the roof
                   leaks, dead leaves blown into drifts; its row 4 bare, under the bridge) and mall_store_0.webp A STORE'S CARPET
                   (wine red, the walk worn pale to the door, stains, the feet of racks).
  THE PIECES       (mall_art.json's kit, COMBAT THREE's names)
    mall_front_ew       a store front a tile wide: the bulkhead and its dead sign (letters gone), the windows boarded, broken or
                        whole, and THE RUNWAY: one window with what is left of a display, two mannequins still dressed
    mall_storewall_ns   the wall between two stores, end on; mall_wall_ew/ns the mall's outer wall, its tile wainscot
    mall_door           a store's doorway, its rolling shutter stuck half down
    mall_carts          a corral of nested carts a tile wide; mall_cart_a a loose cart, mall_cart_b one on its side, somebody's
                        bags still in it
    mall_stock          stock on pallets, the boxes slit and emptied (mall_boxes the same picture)
    mall_counter        a store's counter, the till's drawer out, the shelves behind it bare
    mall_kiosk          a concourse kiosk under its striped canopy; mall_planter a concrete planter, the palm in it dead
    mall_camp_a/b       somebody living in a store: mattresses, bags, a rack of coats for a wall; in b a banner for a roof and a
                        pot on bricks (mall_bedding_a/b the same pictures)
    mall_tables         the food court's bolted tables and seats, a tile wide, trays left (mall_seats the same picture)
    mall_rubble         a piece of the ceiling come down: the painted sky in pieces on the floor
    mall_column         a column, the mall's directory on it; mall_lift the lift's shaft, doors shut, a notice taped to them
    mall_bridge         a tile of the upper level's deck; mall_escalator_e/w a dead escalator bank; mall_rail_ew/ns the glass rail
  THE CEILING      mall_ceiling.webp (rule 451(a), over the fight at 10%): THE PAINTED SKY, faded: clouds on a pale sky, the paint
                   let go in patches down to the plaster, a rib on every bay's line, the skylight's grid across one row of bays,
                   one fixture still lit.

  <venv>/bin/python tools/bohemia_cook5_the_mall_finished_11_17_26.py cal       (the new grounds' measure: a quick render, then the multipliers)
  <venv>/bin/python tools/bohemia_cook5_the_mall_finished_11_17_26.py render mall_floor | mall_store | mall_pieces | ceil_mall [--quick]
  python3 tools/bohemia_cook5_the_mall_finished_11_17_26.py cut
  python3 tools/bohemia_cook5_the_mall_finished_11_17_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a 1990s enclosed mall's concourse
(terrazzo in brass-divided squares with inlaid diamonds, concrete planters with indoor palms, kiosks under canopies, a food
court's fixed pedestal tables); dead-mall photographs (shutters half down, store signs with letters fallen, boarded display
windows, mannequins left in one, ceiling tiles and grid on the floor); the Forum Shops' painted sky ceiling (clouds on blue,
ribs between the bays); a pair of escalators either side of a fixed stair with glass balustrades and black handrails. The
twins: the convention hall's kit and the parking garage's (the card shows the mall before and now).
REUSE CHECK (REUSE-FIRST): this lane's hall tool (its rails, its dark material, its helpers) and the tunnels-and-garage tool
(rig, grounds, plans, Parts, cutter, pieces scene, ceiling scene, calibration): imported. New here only the mall's own plan,
parts and ceiling.
ANALOG HORROR: two mannequins still dressed in a window nobody boarded; a piece of the painted sky on the floor; one
fixture still lit under it.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_convention_hall_finished_11_17_26 as HT      # this lane's: the hall's tool, and TG through it

TG = HT.TG; FW = TG.FW
W, H, PPM, PYM, SIDE, TM, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'mall')
rect = HT.rect

# ---- the grounds -----------------------------------------------------------------------------------------------------------
TG.GROUNDS['mall_terrazzo'] = dict(role=('clay_bone', 3), target=(172, 164, 146), h=0.0, alt=('tape_grey', 3), alt_amt=0.3, grit=0.08, speck=(22, 0.19),
                                   joints=dict(pitch=3.0, width=0.02), panel_var=0.035, cracks=dict(cell=2.6, width=0.01, region=0.22, cut=0.6, depth=0.4))
TG.GROUNDS['mall_inlay'] = dict(role=('clay_rust', 2), target=(124, 86, 66), h=0.0, alt=('clay_rust', 1), alt_amt=0.3, grit=0.1, speck=(22, 0.3))
TG.GROUNDS['mall_carpet'] = dict(role=('clay_rust', 1), target=(104, 62, 54), h=0.0, alt=('clay_rust', 0), alt_amt=0.25, grit=0.06, speck=(40, 0.1))
TG.CAL0.update(mall_terrazzo=0.75, mall_inlay=0.7, mall_carpet=0.8)
TG.WEAR.update(mall_terrazzo=0.22, mall_inlay=0.22, mall_carpet=0.3)


def plan_mall_floor(ID, seed=83):
    """THE CONCOURSE: terrazzo on all 25 tiles (rows 0 to 3 with what the years left, row 4 bare). The store's carpet has a sheet
    of its own (plan_mall_store): two grounds on one sheet bleed a pixel into each other's edge tiles and the join shows (the
    gate's A3 found it: 15.1 steps across a join where 12.7 were allowed)."""
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed); w = TG.win(lx, ly, 0.5, 1.5)
    gid = np.full((H, W), ID['mall_terrazzo'], np.uint8)
    dust = TG.mixn(FW.vnoise((H, W), 2.5 * PPM, rng), TG.pnoise(rng, 2.5), w)
    pale = (0.07 + np.clip((dust - 0.5) / 0.3, -0.5, 1) * 0.05).astype(np.float32); dark = np.zeros((H, W), np.float32)
    # a dark diamond inlaid at every tile's middle, a small one at every strip crossing inside the tile
    d0 = np.abs(lx - 6.0) + np.abs(ly - 6.0)
    gid[(d0 < 1.5)] = ID['mall_inlay']; gid[(d0 < 0.9)] = ID['mall_terrazzo']
    for (cx, cy) in ((3.0, 3.0), (9.0, 3.0), (3.0, 9.0), (9.0, 9.0)): gid[(np.abs(lx - cx) + np.abs(ly - cy)) < 0.42] = ID['mall_inlay']
    # where the roof leaks: a mark with a tide line, inside a tile
    leak = FW.vnoise((H, W), 1.8 * PPM, rng) * TG.win(lx, ly, 0.8, 1.2); tl = TG.top(leak, 0.035)
    edge = np.clip(1 - np.abs(leak - tl) / 0.012, 0, 1) * (leak > tl - 0.012)
    dark = np.maximum(dark, np.clip((leak - tl) / 0.05 + 0.25, 0, 1) * (leak > tl) * 0.2); pale = np.maximum(pale, edge * 0.2)
    rr = np.random.RandomState(seed + 1)
    for r in range(4):
        for c in range(5):
            X0, T0 = c * TM, r * TM
            for _ in range(2 if rr.rand() < 0.75 else 0):      # dead leaves, blown into a drift
                sx, sy_ = X0 + rr.uniform(2.2, 9.8), T0 + rr.uniform(2.0, 10.0)
                for _k in range(34):
                    ax, ay = rr.normal(0, 0.55), rr.normal(0, 0.3)
                    if abs(ax) > 1.3 or abs(ay) > 0.8: continue
                    rect(dark, sx + ax, sx + ax + 0.11, sy_ + ay, sy_ + ay + 0.06, 0.55 + 0.25 * rr.rand())
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


def plan_mall_store(ID, seed=89):
    """A STORE'S CARPET on all 25 tiles: the walk worn pale from the door, what was spilled, the feet of a rack that stood there"""
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed); w = TG.win(lx, ly, 0.5, 1.5)
    gid = np.full((H, W), ID['mall_carpet'], np.uint8)
    dust = TG.mixn(FW.vnoise((H, W), 2.5 * PPM, rng), TG.pnoise(rng, 2.5), w)
    pale = (0.06 + np.clip((dust - 0.5) / 0.3, -0.5, 1) * 0.04).astype(np.float32); dark = np.zeros((H, W), np.float32)
    worn = np.clip(1 - np.abs(lx - 6.0) / 1.6, 0, 1) * np.clip((ly - 1.2) / 2.0, 0, 1) * np.clip((10.8 - ly) / 2.0, 0, 1)
    rr = np.random.RandomState(seed + 1); keep = np.zeros((H, W), np.float32)
    for r in range(5):
        for c in range(5):
            X0, T0 = c * TM, r * TM; sel = (col == c) & (row == r)
            if rr.rand() < 0.7: keep[sel] = rr.uniform(0.6, 1.0)                                       # not every store's walk wore the same
            for _ in range(int(rr.randint(1, 4))):
                sx, sy_ = X0 + rr.uniform(1.8, 10.2), T0 + rr.uniform(1.8, 10.2); rad = rr.uniform(0.25, 0.6)
                dd = np.hypot(xm - sx, ty - sy_); dark = np.maximum(dark, np.clip(1 - dd / rad, 0, 1) * 0.4)
            for _ in range(2):
                sx, sy_ = X0 + rr.uniform(1.5, 8.5), T0 + rr.uniform(2.0, 9.5)
                for (ax, ay) in ((0, 0), (1.5, 0), (0, 0.5), (1.5, 0.5)): rect(dark, sx + ax, sx + ax + 0.07, sy_ + ay, sy_ + ay + 0.07, 0.6)
    pale = np.maximum(pale, worn * 0.16 * keep)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['mall_floor'] = plan_mall_floor
TG.PLANS['mall_store'] = plan_mall_store


def mall_floor_things(bpy, NF, M, rng):
    out = FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0, 60), r_.uniform(0, 60)), 46)
    out += TG.floor_litter(bpy, NF, M, rng, 34)
    return out


def mall_store_things(bpy, NF, M, rng):
    return TG.floor_litter(bpy, NF, M, rng, 22)


TG.GARAGE_THINGS['mall_floor'] = mall_floor_things
TG.GARAGE_THINGS['mall_store'] = mall_store_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
MALL_AT = dict(bridge=(10.0, 45.0), escalator_e=(26.0, 45.0), escalator_w=(42.0, 45.0), rail_ew=(10.0, 40.5), wall_ew=(26.0, 39.5), front_ew=(42.0, 37.0),
               rail_ns=(52.0, 4.0), wall_ns=(55.0, 4.0), storewall_ns=(57.8, 22.0),
               lift=(4.0, 27.5), carts=(13.5, 29.0), counter=(27.0, 28.5), kiosk=(38.0, 28.0), door=(47.0, 29.5),
               stock=(4.0, 18.0), camp_a=(11.5, 18.0), camp_b=(19.5, 18.0), tables=(31.0, 18.5), rubble=(42.5, 18.5), planter=(49.0, 18.0),
               column=(4.0, 6.0), cart_a=(9.0, 6.5), cart_b=(13.0, 6.5))
FRONT_H, DOOR_H = 3.0, 3.0


def bridge(P, ox, oy, rng):
    P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02); P.box('terr', ox - 6, ox + 6, oy, oy + 12, LEVEL_H - 0.02, LEVEL_H)
    for i in range(3):                                         # its diamonds, every 4 m (the same on every tile's edge, so deck tiles meet)
        for j in range(3):
            cx, cy = ox - 4 + i * 4.0, oy + 2 + j * 4.0
            P.poly('terr_d', [(cx - 0.8, cy), (cx, cy - 0.8), (cx + 0.8, cy), (cx, cy + 0.8)], LEVEL_H, LEVEL_H + 0.005)
    for k in range(4): P.box('brass', ox - 6 + k * 4.0 - 0.02, ox - 6 + k * 4.0 + 0.02, oy, oy + 12, LEVEL_H, LEVEL_H + 0.004)
    P.box('paint_w', ox - 6, ox + 6, oy - 0.006, oy, LEVEL_H - 0.5, LEVEL_H - 0.02); P.box('brass', ox - 6, ox + 6, oy - 0.008, oy - 0.006, LEVEL_H - 0.14, LEVEL_H - 0.08)   # the fascia, its brass line
    P.box('under', ox - 6, ox + 6, oy - 0.006, oy, 0.0, LEVEL_H - 0.5)                                 # the dark under it
    for x in (ox - 6, ox - 0.25): P.box('terr', x, x + 0.5, oy - 0.03, oy, 0.0, LEVEL_H - 0.5)          # its piers (one on the tile's west line)
    P.box('terr', ox + 5.5, ox + 6, oy - 0.03, oy, 0.0, LEVEL_H - 0.5)


def escalator(P, ox, oy, sgn):
    """a dead escalator bank a tile long: an escalator, the fixed stair, an escalator, glass between, the handrails black"""
    n = 24; xl, xh = (ox - 6, ox + 6) if sgn > 0 else (ox + 6, ox - 6)
    lanes = ((oy + 0.5, oy + 3.3, 'steel'), (oy + 3.7, oy + 8.3, 'conc'), (oy + 8.7, oy + 11.5, 'steel'))
    for (y0, y1, mat) in lanes:
        for i in range(n):
            xa = ox - 6 + i * 0.5 if sgn > 0 else ox + 6 - (i + 1) * 0.5; z = LEVEL_H * (i + 1) / n
            P.box(mat, xa, xa + 0.5, y0, y1, 0.0, z)
            if mat == 'steel': P.box('under', xa + (0.44 if sgn > 0 else 0.0), xa + (0.5 if sgn > 0 else 0.06), y0, y1, z, z + 0.004)      # the tread's dark riser line
            elif i % 2 == 0: P.box('paint_y', xa + (0.0 if sgn > 0 else 0.42), xa + (0.08 if sgn > 0 else 0.5), y0, y1, z, z + 0.005)
        if mat == 'steel':                                     # the comb plate at its foot, the yellow line
            xf = xl if sgn > 0 else xl - 0.6
            P.box('paint_y', min(xl, xl + sgn * 0.6), max(xl, xl + sgn * 0.6), y0, y1, 0.0, 0.03)
    for yy in (oy + 0.2, oy + 3.35, oy + 8.35, oy + 11.5):     # the balustrades: glass, a black handrail
        pr = [(xl, 0.05), (xh, LEVEL_H + 0.05), (xh, LEVEL_H + 0.9), (xl, 0.9)]
        P.prism_y('rail_glass', yy + 0.12, yy + 0.18, pr if sgn < 0 else pr[::-1])
        P.bar('under', (xl, yy + 0.15, 0.95), (xh, yy + 0.15, LEVEL_H + 0.95), 0.06)
        P.box('steel', min(xl, xh), max(xl, xh), yy + 0.05, yy + 0.25, 0.0, 0.06)
    for yy in (oy, oy + 11.8): P.prism_y('terr', yy, yy + 0.2, ([(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.1), (xl, 0.1)] if sgn < 0 else [(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.1), (xl, 0.1)][::-1]))


def wall_ew(P, ox, oy, rng):
    P.box('paint_w', ox - 6, ox + 6, oy, oy + 0.25, 0.0, 1.6)
    P.box('terr_d', ox - 6, ox + 6, oy - 0.006, oy, 0.0, 0.7); P.box('brass', ox - 6, ox + 6, oy - 0.012, oy - 0.006, 0.7, 0.76)       # the wainscot, its brass line
    for i in range(1, 4): P.box('under', ox - 6 + i * 3.0 - 0.01, ox - 6 + i * 3.0 + 0.01, oy - 0.008, oy - 0.006, 0.0, 0.7)
    P.box('steel', ox - 2.6, ox - 1.2, oy - 0.05, oy, 0.95, 1.5); P.box('paper', ox - 2.5, ox - 1.3, oy - 0.056, oy - 0.05, 1.0, 1.45)      # a poster frame, the poster sun-pale
    for _ in range(5): x = rng.uniform(ox - 5.8, ox + 5.4); P.box('under', x, x + rng.uniform(0.2, 0.6), oy - 0.014, oy - 0.012, 0.03, rng.uniform(0.15, 0.4))


def wall_ns(P, ox, oy, rng):
    P.box('paint_w', ox - 0.125, ox + 0.125, oy, oy + 12, 0.0, 1.6); P.box('terr_d', ox - 0.131, ox + 0.131, oy, oy + 12, 0.0, 0.7)


def mannequin(P, x, y, z0, coat, tall=1.75, arm=True):
    P.box('skin', x - 0.1, x + 0.1, y - 0.07, y + 0.07, z0, z0 + tall * 0.5)                                   # the legs, one piece
    P.box(coat, x - 0.2, x + 0.2, y - 0.11, y + 0.11, z0 + tall * 0.42, z0 + tall * 0.83); P.box(coat, x - 0.23, x + 0.23, y - 0.12, y + 0.12, z0 + tall * 0.2, z0 + tall * 0.44)   # the coat, long
    P.box('skin', x - 0.09, x + 0.09, y - 0.09, y + 0.09, z0 + tall * 0.86, z0 + tall)                         # the head, no face
    if arm: P.box('skin', x + 0.2, x + 0.5, y - 0.05, y + 0.05, z0 + tall * 0.66, z0 + tall * 0.72)            # one arm still held out


def front_ew(P, ox, oy, rng):
    """a store front a tile wide, seen from the concourse (its south face): the piers, the bulkhead and its sign, four bays of
    window: boarded, gone, whole, and the one with what is left of a display"""
    P.box('paint_w', ox - 6, ox + 6, oy, oy + 0.3, 2.2, FRONT_H); P.box('paint_w', ox - 6, ox + 6, oy, oy + 0.3, 0.0, 0.3)       # the bulkhead, the stall riser
    for x in (ox - 6, ox - 3.1, ox - 0.1, ox + 2.9, ox + 5.8): P.box('terr', x, x + 0.2, oy - 0.04, oy + 0.3, 0.0, FRONT_H)     # the piers
    P.box('sign', ox - 4.6, ox + 4.6, oy - 0.05, oy, 2.32, 2.9)                                                # the sign band
    for k in range(9):                                         # its letters, three gone (their ghosts paler)
        x = ox - 3.8 + k * 0.85
        if k in (2, 5, 6): P.box('sign_g', x, x + 0.5, oy - 0.056, oy - 0.05, 2.42, 2.8)
        else: P.box('cloud', x, x + 0.5, oy - 0.09, oy - 0.05, 2.42, 2.8)
    P.box('cloud', ox - 1.35, ox - 0.85, oy - 0.4, oy - 0.3, 0.0, 0.04)                                        # one of them on the floor
    bays = ((ox - 5.8, ox - 3.1, 'board'), (ox - 2.9, ox - 0.1, 'show'), (ox + 0.1, ox + 2.9, 'gone'), (ox + 3.1, ox + 5.8, 'glass'))
    for (x0, x1, kind) in bays:
        if kind == 'board':
            P.box('wood', x0, x1, oy - 0.02, oy + 0.02, 0.3, 2.2)
            for k in range(3): P.box('wood_d', x0 + 0.3 + k * 0.9, x0 + 0.34 + k * 0.9, oy - 0.03, oy - 0.02, 0.3, 2.2)
            P.box('paper', x0 + 0.6, x0 + 1.5, oy - 0.03, oy - 0.02, 1.1, 1.7)
        elif kind == 'gone':
            P.box('under', x0, x1, oy + 0.26, oy + 0.3, 0.3, 2.2)                                               # the store's dark
            for _ in range(22): x = rng.uniform(x0 - 0.2, x1 + 0.2); y = oy - rng.uniform(0.1, 0.9); P.box('glassbit', x, x + 0.07, y, y + 0.05, 0.0, 0.02)
            P.box('glass_d', x0, x0 + 0.5, oy - 0.01, oy + 0.01, 0.3, 1.1)                                       # a tooth of it left in the frame
        elif kind == 'glass':
            P.box('glass_d', x0, x1, oy - 0.01, oy + 0.01, 0.3, 2.2); P.box('red', x0 + 0.3, x1 - 0.3, oy - 0.02, oy - 0.01, 1.5, 1.9); P.box('cloud', x0 + 0.5, x1 - 0.5, oy - 0.03, oy - 0.02, 1.62, 1.78)   # EVERYTHING MUST GO
        else:                                                  # THE RUNWAY: what is left of a display, behind glass nobody broke
            P.box('under', x0, x1, oy + 0.26, oy + 0.3, 0.3, 2.2); P.box('cloud', x0, x1, oy + 0.02, oy + 0.26, 0.3, 0.36)
            mannequin(P, x0 + 0.7, oy + 0.14, 0.36, 'coat_r'); mannequin(P, x0 + 1.9, oy + 0.14, 0.36, 'coat_m', arm=False)
            P.box('skin', x0 + 1.25, x0 + 1.5, oy + 0.08, oy + 0.2, 0.36, 0.5)                                   # a third one's arm, on the display's floor
    P.box('steel', ox - 6, ox + 6, oy - 0.03, oy + 0.03, 2.16, 2.22)


def storewall_ns(P, ox, oy, rng):
    P.box('paint_w', ox - 0.1, ox + 0.1, oy, oy + 12, 0.0, FRONT_H)
    for k in range(5): P.box('steel', ox - 0.11, ox + 0.11, oy, oy + 12, 0.5 + k * 0.5, 0.53 + k * 0.5)       # slatwall rails
    P.box('terr', ox - 0.14, ox + 0.14, oy - 0.04, oy + 0.16, 0.0, FRONT_H)


def door(P, ox, oy, rng):
    """a store's doorway a tile wide, its rolling shutter stuck half down: the piers, the header and the shutter's box, the
    curtain of slats to 1.35 m, one guide bent"""
    for x in (ox - 6, ox + 5.7): P.box('terr', x, x + 0.3, oy - 0.04, oy + 0.3, 0.0, DOOR_H)
    P.box('paint_w', ox - 6, ox + 6, oy, oy + 0.3, 2.45, DOOR_H); P.box('steel', ox - 5.7, ox + 5.7, oy - 0.12, oy + 0.02, 2.3, 2.5)
    P.box('shutter', ox - 5.7, ox + 5.7, oy - 0.07, oy - 0.03, 1.35, 2.3)
    for k in range(9): P.box('under', ox - 5.7, ox + 5.7, oy - 0.074, oy - 0.07, 1.4 + k * 0.1, 1.415 + k * 0.1)   # the slats' lines
    P.box('steel', ox - 5.7, ox + 5.7, oy - 0.09, oy - 0.01, 1.3, 1.38)                                        # its bottom bar
    P.box('steel', ox - 5.75, ox - 5.68, oy - 0.08, oy - 0.02, 0.0, 2.3); P.bar('steel', (ox + 5.7, oy - 0.05, 2.3), (ox + 5.9, oy - 0.5, 0.0), 0.03)   # the guides, one bent out
    P.box('sign', ox - 2.0, ox + 2.0, oy - 0.05, oy, 2.55, 2.92)
    for k in range(4): P.box('cloud', ox - 1.6 + k * 0.85, ox - 1.1 + k * 0.85, oy - 0.08, oy - 0.05, 2.62, 2.86)
    P.box('paper', ox + 2.6, ox + 3.2, oy - 0.076, oy - 0.07, 1.6, 2.1)                                        # a notice taped to the slats


def cart(P, x, y, rng, down=False, bags=False):
    """a shopping cart, its handle to the south: 0.6 by 1.0"""
    if down:
        P.box('steel', x - 0.5, x + 0.5, y - 0.3, y + 0.3, 0.0, 0.03); P.box('steel', x - 0.5, x - 0.47, y - 0.3, y + 0.3, 0.0, 0.55); P.box('steel', x + 0.47, x + 0.5, y - 0.3, y + 0.3, 0.0, 0.5)
        P.box('steel', x - 0.5, x + 0.5, y + 0.27, y + 0.3, 0.0, 0.55); P.box('red', x - 0.56, x - 0.5, y - 0.3, y + 0.3, 0.5, 0.56)
        for (dx, dy) in ((0.6, -0.2), (0.62, 0.2)): P.drum('under', x + dx, y + dy, 0.0, 0.1, 0.06, 8)
    else:
        for (dx, dy) in ((-0.25, -0.4), (0.25, -0.4), (-0.22, 0.4), (0.22, 0.4)): P.bar('steel', (x + dx, y + dy, 0.08), (x + dx, y + dy, 0.5), 0.012); P.drum('under', x + dx, y + dy, 0.0, 0.1, 0.05, 8)
        P.box('steel', x - 0.3, x + 0.3, y - 0.5, y + 0.5, 0.5, 0.53)
        P.box('steel', x - 0.3, x - 0.28, y - 0.5, y + 0.5, 0.53, 1.0); P.box('steel', x + 0.28, x + 0.3, y - 0.5, y + 0.5, 0.53, 1.0); P.box('steel', x - 0.3, x + 0.3, y + 0.48, y + 0.5, 0.53, 1.0); P.box('steel', x - 0.3, x + 0.3, y - 0.5, y - 0.48, 0.53, 0.95)
        P.box('red', x - 0.32, x + 0.32, y - 0.58, y - 0.52, 0.98, 1.04)
    if bags:
        bx = x + (0.0 if not down else 0.1)
        P.box('blue', bx - 0.22, bx + 0.22, y - 0.3, y + 0.1, 0.55 if not down else 0.03, 0.9 if not down else 0.3); P.box('tan', bx - 0.2, bx + 0.2, y + 0.1, y + 0.4, 0.55 if not down else 0.03, 1.1 if not down else 0.35)


def carts(P, ox, oy, rng):
    for (x0, x1) in ((ox - 5.0, ox - 1.9), (ox - 1.5, ox + 1.6), (ox + 2.0, ox + 5.1)):     # three bays of the corral, their rails
        for xx in (x0, x1): P.bar('steel', (xx, oy + 0.1, 0.5), (xx, oy + 3.4, 0.5), 0.03); P.bar('steel', (xx, oy + 0.1, 0.0), (xx, oy + 0.1, 0.5), 0.03); P.bar('steel', (xx, oy + 3.4, 0.0), (xx, oy + 3.4, 0.5), 0.03)
        for lane in range(3):
            x = x0 + 0.6 + lane * 0.95; n = int(rng.randint(2, 8))
            for k in range(n): cart(P, x, oy + 2.9 - k * 0.32, rng)                                       # nested, noses in
    P.box('paint_w', ox - 5.2, ox - 4.0, oy + 3.5, oy + 3.56, 1.2, 2.0); P.box('red', ox - 5.1, ox - 4.1, oy + 3.494, oy + 3.5, 1.5, 1.9); P.bar('steel', (ox - 4.6, oy + 3.53, 0.0), (ox - 4.6, oy + 3.53, 1.2), 0.03)   # RETURN CARTS HERE


def stock(P, ox, oy, rng):
    mats = ('card', 'card', 'tan', 'paint_w')
    for i, (dx, dy) in enumerate(((-1.4, 0.1), (0.0, 0.1), (-1.4, 1.3), (0.0, 1.3))):
        x, y = ox + dx, oy + dy; P.box('wood', x, x + 1.2, y, y + 1.0, 0.0, 0.14)
        z = 0.14; lay = 3 if i != 1 else 1
        for L in range(lay):
            for bx in range(2):
                for by in range(2):
                    if L == lay - 1 and rng.rand() < 0.35: continue
                    h = 0.42; m = mats[int(rng.randint(4))]
                    P.box(m, x + 0.03 + bx * 0.58, x + 0.57 + bx * 0.58, y + 0.03 + by * 0.48, y + 0.47 + by * 0.48, z, z + h)
                    if rng.rand() < 0.5: P.box('sign', x + 0.1 + bx * 0.58, x + 0.5 + bx * 0.58, y + 0.026 + by * 0.48, y + 0.03 + by * 0.48, z + 0.12, z + 0.3)   # the brand's band
            z += 0.42
    for _ in range(5):                                         # the ones slit and emptied, thrown down
        x = ox + rng.uniform(-1.5, 1.3); y = oy - rng.uniform(0.2, 0.9); P.box('card', x, x + 0.55, y, y + 0.45, 0.0, 0.05); P.box('tan', x + 0.05, x + 0.3, y + 0.05, y + 0.4, 0.05, 0.07)


def counter(P, ox, oy, rng):
    P.box('paint_w', ox - 3.2, ox + 3.2, oy + 0.9, oy + 1.6, 0.0, 1.0); P.box('sign', ox - 3.2, ox + 3.2, oy + 0.894, oy + 0.9, 0.1, 0.9); P.box('terr', ox - 3.25, ox + 3.25, oy + 0.85, oy + 1.65, 1.0, 1.05)
    P.box('under', ox - 1.2, ox - 0.6, oy + 1.0, oy + 1.45, 1.05, 1.35); P.box('steel', ox - 1.25, ox - 0.55, oy + 0.6, oy + 1.0, 1.02, 1.08)       # the till, its drawer out and empty
    P.box('paper', ox + 0.6, ox + 0.85, oy + 1.1, oy + 1.4, 1.05, 1.056); P.box('card', ox + 1.6, ox + 2.1, oy + 1.05, oy + 1.5, 1.05, 1.25)
    for k in range(2):                                         # the shelves behind it, bare but for what nobody wanted
        x0 = ox - 3.0 + k * 3.2
        P.box('steel', x0, x0 + 2.8, oy + 2.6, oy + 3.0, 0.0, 1.9)
        for s_ in range(4):
            P.box('paint_w', x0 - 0.02, x0 + 2.82, oy + 2.3, oy + 2.62, 0.3 + s_ * 0.45, 0.34 + s_ * 0.45)
            for _ in range(int(rng.randint(0, 3))): x = x0 + rng.uniform(0.1, 2.5); P.box(('card', 'red', 'teal', 'jug')[int(rng.randint(4))], x, x + 0.18, oy + 2.34, oy + 2.5, 0.34 + s_ * 0.45, 0.54 + s_ * 0.45)
    P.box('wood_d', ox + 2.4, ox + 2.9, oy + 0.2, oy + 0.7, 0.0, 0.45)                                        # a stool


def kiosk(P, ox, oy, rng):
    P.box('paint_w', ox - 1.5, ox + 1.5, oy, oy + 2.4, 0.0, 1.0); P.box('sign', ox - 1.5, ox + 1.5, oy - 0.006, oy, 0.15, 0.85); P.box('terr', ox - 1.55, ox + 1.55, oy - 0.05, oy + 2.45, 1.0, 1.05)
    P.box('under', ox - 1.1, ox + 1.1, oy + 0.4, oy + 2.0, 1.05, 1.07)                                         # the well where the seller stood
    for (dx, dy) in ((-1.4, 0.1), (1.4, 0.1), (-1.4, 2.3), (1.4, 2.3)): P.bar('steel', (ox + dx, oy + dy, 1.05), (ox + dx, oy + dy, 2.3), 0.03)
    for k in range(6):                                         # the canopy, striped, one stripe torn away
        if k == 4: continue
        x0 = ox - 1.7 + k * 0.57; P.box('cloud' if k % 2 else 'red', x0, x0 + 0.57, oy - 0.2, oy + 2.6, 2.3, 2.36)
    for _ in range(7): x = ox + rng.uniform(-1.3, 1.1); y = oy + rng.uniform(0.05, 0.3); P.box(('must', 'teal', 'red', 'cloud')[int(rng.randint(4))], x, x + 0.14, y, y + 0.1, 1.05, 1.2)   # what it sold: phone cases
    P.box('paper', ox - 0.5, ox + 0.5, oy - 0.012, oy - 0.006, 0.35, 0.7)


def planter(P, ox, oy, rng):
    P.box('conc', ox - 1.5, ox + 1.5, oy, oy + 3.0, 0.0, 0.6); P.box('terr', ox - 1.6, ox + 1.6, oy - 0.1, oy + 3.1, 0.6, 0.72); P.box('silt', ox - 1.3, ox + 1.3, oy + 0.2, oy + 2.8, 0.72, 0.74)
    P.drum('wood_d', ox, oy + 1.5, 0.72, 3.0, 0.16, 10, 0.11)                                                  # the palm, dead: its trunk, its fronds hung down
    for k in range(9):
        a = k * 0.7; dx, dy = math.cos(a), math.sin(a)
        P.bar('tan_d', (ox, oy + 1.5, 3.0), (ox + dx * 0.9, oy + 1.5 + dy * 0.9, 2.5), 0.03); P.bar('tan_d', (ox + dx * 0.9, oy + 1.5 + dy * 0.9, 2.5), (ox + dx * 1.2, oy + 1.5 + dy * 1.2, 1.5), 0.025)
    for _ in range(16): x = ox + rng.uniform(-1.9, 1.9); y = oy + rng.uniform(-0.6, 3.4); P.box('tan_d', x, x + 0.3, y, y + 0.05, 0.0 if abs(x - ox) > 1.6 or y < oy - 0.1 or y > oy + 3.1 else 0.74, (0.0 if abs(x - ox) > 1.6 or y < oy - 0.1 or y > oy + 3.1 else 0.74) + 0.02)
    P.box('can', ox + 0.6, ox + 0.72, oy + 0.5, oy + 0.62, 0.74, 0.88); P.box('paper', ox - 0.9, ox - 0.6, oy + 2.0, oy + 2.2, 0.74, 0.76)


def camp(P, ox, oy, rng, b):
    for k, (dx, dy) in enumerate(((-2.2, 0.3), (-0.9, 0.3))):                                                  # two mattresses, their bedding
        P.box('white', ox + dx, ox + dx + 1.0, oy + dy, oy + dy + 1.95, 0.0, 0.2); P.box(('rug', 'blue')[k] if not b else ('couch', 'cloth')[k], ox + dx + 0.03, ox + dx + 0.97, oy + dy + 0.05, oy + dy + 1.3, 0.2, 0.27)
        P.box('tan', ox + dx + 0.2, ox + dx + 0.8, oy + dy + 1.5, oy + dy + 1.85, 0.2, 0.3)
    # a rack of coats for a wall: the runway, still on its hangers
    P.bar('steel', (ox + 0.5, oy + 2.4, 0.0), (ox + 0.5, oy + 2.4, 1.6), 0.025); P.bar('steel', (ox + 2.5, oy + 2.4, 0.0), (ox + 2.5, oy + 2.4, 1.6), 0.025); P.bar('steel', (ox + 0.5, oy + 2.4, 1.6), (ox + 2.5, oy + 2.4, 1.6), 0.025)
    for k in range(7):
        m = ('coat_r', 'under', 'coat_m', 'blue', 'tan', 'under', 'red')[(k + (3 if b else 0)) % 7]; x = ox + 0.62 + k * 0.26
        P.box(m, x, x + 0.2, oy + 2.3, oy + 2.5, 0.5 + 0.1 * (k % 3), 1.55)
    for (dx, dy, m) in ((0.6, 0.4, 'under'), (1.2, 0.3, 'blue'), (1.0, 0.9, 'tan_d')): P.box(m, ox + dx, ox + dx + 0.5, oy + dy, oy + dy + 0.4, 0.0, 0.3)   # bags
    P.box('wax', ox - 2.5, ox - 2.42, oy + 2.5, oy + 2.58, 0.0, 0.12); P.box('can', ox + 1.9, ox + 2.0, oy + 0.3, oy + 0.4, 0.0, 0.12)
    for (dx, dy) in ((1.9, 1.0), (2.05, 1.05)): P.box('under', ox + dx, ox + dx + 0.11, oy + dy, oy + dy + 0.27, 0.0, 0.1)                                  # shoes, set down together
    if b:                                                      # (b) a store's banner for a roof over one bed, a pot on bricks
        for (dx, dy) in ((-2.3, 0.2), (-1.1, 0.2), (-2.3, 2.3), (-1.1, 2.3)): P.bar('wood_d', (ox + dx, oy + dy, 0.0), (ox + dx, oy + dy, 1.3), 0.025)
        P.box('red', ox - 2.4, ox - 1.0, oy + 0.1, oy + 2.4, 1.3, 1.33); P.box('cloud', ox - 2.2, ox - 1.2, oy + 0.9, oy + 1.5, 1.33, 1.335)
        for (dx, dy) in ((2.2, 2.0), (2.5, 2.0)): P.box('rustp', ox + dx, ox + dx + 0.2, oy + dy, oy + dy + 0.4, 0.0, 0.14)
        P.drum('under', ox + 2.45, oy + 2.2, 0.14, 0.38, 0.17, 10)


def tables(P, ox, oy, rng):
    for i in range(4):
        x = ox - 4.5 + i * 3.0; y = oy + 1.3
        P.drum('steel', x, y, 0.0, 0.72, 0.07, 8); P.box('paint_w', x - 0.6, x + 0.6, y - 0.6, y + 0.6, 0.72, 0.77)                  # a pedestal table, bolted
        for (dx, dy) in ((-0.95, 0), (0.95, 0), (0, -0.95), (0, 0.95)):
            if rng.rand() < 0.12: continue
            P.drum('steel', x + dx, y + dy, 0.0, 0.42, 0.04, 6); P.box(('red', 'must', 'teal', 'red')[i], x + dx - 0.2, x + dx + 0.2, y + dy - 0.2, y + dy + 0.2, 0.42, 0.47)   # its four seats on their arms
        if i != 2: P.box('tan_d', x - 0.4, x + 0.05, y - 0.3, y + 0.05, 0.77, 0.79); P.box('cloud', x - 0.3, x - 0.15, y - 0.2, y - 0.05, 0.79, 0.86)   # a tray left, a cup
    P.drum('conc_d', ox + 5.3, oy + 0.5, 0.0, 0.9, 0.3, 10); P.box('under', ox + 5.15, ox + 5.45, oy + 0.18, oy + 0.2, 0.55, 0.75)       # the bin, full years ago


def rubble(P, ox, oy, rng):
    """a piece of the ceiling come down: the painted sky in pieces on the floor, the grid that held it, a fixture"""
    for _ in range(26):
        x = ox + rng.normal(0, 1.5); y = oy + 1.2 + rng.normal(0, 0.8); s_ = rng.uniform(0.3, 0.9); z = rng.uniform(0.0, 0.35)
        if abs(x - ox) > 3.6 or abs(y - oy - 1.2) > 1.8: continue
        P.box('plast', x, x + s_, y, y + s_ * 0.8, z, z + 0.06)
        if rng.rand() < 0.6: P.box('sky' if rng.rand() < 0.7 else 'cloud', x + 0.02, x + s_ - 0.02, y + 0.02, y + s_ * 0.8 - 0.02, z + 0.06, z + 0.07)   # the sky side up
    for _ in range(7): x = ox + rng.uniform(-3.0, 2.0); y = oy + rng.uniform(0.2, 2.2); P.bar('steel', (x, y, 0.05), (x + rng.uniform(0.8, 2.0), y + rng.uniform(-0.6, 0.6), rng.uniform(0.1, 0.9)), 0.02)
    P.box('paint_w', ox + 1.6, ox + 2.8, oy + 0.3, oy + 0.9, 0.0, 0.14); P.box('cloud', ox + 1.7, ox + 2.7, oy + 0.36, oy + 0.84, 0.14, 0.15)       # a troffer, face up
    P.bar('under', (ox + 2.2, oy + 0.9, 0.1), (ox + 2.9, oy + 2.4, 0.0), 0.015)
    for _ in range(30): x = ox + rng.normal(0, 2.0); y = oy + 1.2 + rng.normal(0, 1.0); P.box('plast', x, x + 0.08, y, y + 0.06, 0.0, 0.02)


def column(P, ox, oy, rng):
    P.box('terr', ox - 0.5, ox + 0.5, oy - 0.5, oy + 0.5, 0.0, 2.6); P.box('cut', ox - 0.48, ox + 0.48, oy - 0.48, oy + 0.48, 2.6, 2.62)
    for (dx, dy) in ((-0.35, -0.35), (0.35, -0.35), (-0.35, 0.35), (0.35, 0.35)): P.bar('rustbar', (ox + dx, oy + dy, 2.6), (ox + dx + rng.uniform(-0.1, 0.1), oy + dy, 2.9 + 0.3 * rng.rand()), 0.02)
    P.box('brass', ox - 0.52, ox + 0.52, oy - 0.52, oy + 0.52, 0.0, 0.14)
    P.box('under', ox - 0.4, ox + 0.4, oy - 0.53, oy - 0.5, 0.8, 2.0)                                           # the mall's directory: YOU ARE HERE
    for k in range(10): P.box(('sign', 'teal', 'must', 'red', 'cloud')[k % 5], ox - 0.34 + (k % 4) * 0.17, ox - 0.2 + (k % 4) * 0.17, oy - 0.536, oy - 0.53, 1.0 + (k // 4) * 0.3, 1.2 + (k // 4) * 0.3)
    P.box('red', ox + 0.1, ox + 0.17, oy - 0.54, oy - 0.536, 1.42, 1.49)


def lift(P, ox, oy, rng):
    """the lift's shaft, a tile's blocker: 3.2 m square, cut at 3.2 m: steel doors shut, glass sides, a notice taped to the doors"""
    P.box('steel', ox - 1.6, ox + 1.6, oy, oy + 3.2, 0.0, 3.2); P.box('cut', ox - 1.55, ox + 1.55, oy + 0.05, oy + 3.15, 3.2, 3.22)
    P.box('under', ox - 1.3, ox + 1.3, oy + 0.3, oy + 2.9, 3.22, 3.24)                                         # the shaft, down into the dark
    P.box('glass_d', ox + 1.6, ox + 1.61, oy + 0.3, oy + 2.9, 0.4, 2.9)
    P.box('shutter', ox - 0.9, ox + 0.9, oy - 0.02, oy, 0.0, 2.2); P.box('under', ox - 0.012, ox + 0.012, oy - 0.026, oy - 0.02, 0.0, 2.2)       # the doors, their seam
    P.box('brass', ox - 1.0, ox + 1.0, oy - 0.03, oy, 2.2, 2.32); P.box('under', ox - 0.3, ox + 0.3, oy - 0.036, oy - 0.03, 2.4, 2.6)
    P.box('paper', ox - 0.5, ox + 0.1, oy - 0.03, oy - 0.02, 1.1, 1.6); P.box('red', ox - 0.42, ox + 0.02, oy - 0.036, oy - 0.03, 1.42, 1.52)   # OUT OF ORDER
    P.box('steel', ox + 1.1, ox + 1.25, oy - 0.03, oy, 1.0, 1.3); P.box('under', ox + 1.15, ox + 1.2, oy - 0.036, oy - 0.03, 1.12, 1.18)
    P.box('brass', ox - 1.62, ox + 1.62, oy - 0.02, oy + 3.22, 0.0, 0.12)


def mall_parts(P, rng):
    A = MALL_AT
    bridge(P, *A['bridge'], rng); escalator(P, *A['escalator_e'], 1); escalator(P, *A['escalator_w'], -1)
    HT.rail_ew(P, *A['rail_ew'], rng); HT.rail_ns(P, *A['rail_ns'], rng); wall_ew(P, *A['wall_ew'], rng); wall_ns(P, *A['wall_ns'], rng)
    front_ew(P, *A['front_ew'], rng); storewall_ns(P, *A['storewall_ns'], rng); door(P, *A['door'], rng)
    lift(P, *A['lift'], rng); carts(P, *A['carts'], rng); counter(P, *A['counter'], rng); kiosk(P, *A['kiosk'], rng)
    stock(P, *A['stock'], rng); camp(P, *A['camp_a'], rng, False); camp(P, *A['camp_b'], rng, True); tables(P, *A['tables'], rng)
    rubble(P, *A['rubble'], rng); planter(P, *A['planter'], rng); column(P, *A['column'], rng)
    cart(P, A['cart_a'][0], A['cart_a'][1] + 0.6, rng); cart(P, A['cart_b'][0], A['cart_b'][1] + 0.5, rng, down=True, bags=True)


def mall_mats(bpy, NF, F, M, which):
    if which not in ('mall_pieces', 'tun_pieces'): return       # ('tun_pieces' is what the ceiling's scene asks its materials by)
    M.update(terr=NF.material(bpy, 'in_stall_terrazzo', 'clay_bone', 3, 0.85), terr_d=NF.material(bpy, 'in_stall_inlay', 'clay_rust', 2, 0.8),
             brass=NF.material(bpy, 'in_brass', 'clay_mustard', 2, 0.9), shutter=NF.material(bpy, 'in_stall_shutter', 'tape_grey', 2, 0.85),
             under=NF.material(bpy, 'in_stall_under', 'tape_grey', 0, 0.7), rail_glass=NF.material(bpy, 'in_rail_glass', 'clay_teal', 3, 0.8),
             glass_d=NF.material(bpy, 'in_glass_dark', 'clay_teal', 1, 0.9), sign=NF.material(bpy, 'in_paint_sign', 'clay_teal', 2, 0.95),
             sign_g=NF.material(bpy, 'in_paint_sign_ghost', 'clay_teal', 3, 0.9), cloud=NF.material(bpy, 'in_paint_cloud', 'clay_bone', 4, 0.95),
             sky=NF.material(bpy, 'in_paint_sky', 'clay_teal', 4, 0.92), plast=NF.material(bpy, 'in_ceil_plaster_bare', 'tape_masking', 2, 0.9),
             coat_r=NF.material(bpy, 'in_cloth_coat_r', 'clay_rust', 2, 1.0), coat_m=NF.material(bpy, 'in_cloth_coat_m', 'clay_mustard', 3, 0.95),
             skin=NF.material(bpy, 'in_stall_mannequin', 'clay_bone', 4, 0.9))


TG.PARTS['mall_pieces'] = mall_parts
TG.MAT_HOOKS.append(mall_mats)


# ---- the ceiling (rule 451(a)): THE PAINTED SKY ------------------------------------------------------------------------------
SKY_ROW = 3                                                    # the bay row the skylight's grid crosses (over the concourse's middle on the board)


def ceil_mall(P, rng):
    at, band_y = TG.at, TG.band_y
    P.box('sky', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                     # the sky, painted on the vault
    zc = [0.004]                                               # every disc of every cloud at its own height (two faces in one plane render black)
    for r in range(5):
        for c in range(5):
            if r == SKY_ROW: continue
            for _ in range(3):                                 # clouds: soft heaps of discs, each at its own height (two in one plane render black)
                lx, ly = rng.uniform(3.0, 9.0), rng.uniform(2.8, 9.2)
                for k in range(int(rng.randint(4, 8))):
                    x, y = at(c, r, lx + float(np.clip(rng.normal(0, 0.9), -1.6, 1.6)), ly + float(np.clip(rng.normal(0, 0.35), -0.8, 0.8)), 0.0); zc[0] += 0.0007
                    P.drum('cloud', x, y, 0.0, zc[0], rng.uniform(0.5, 1.0), 14)
            for _ in range(int(rng.randint(1, 4))):            # the paint let go: the plaster under it, a curl of paint hanging
                lx, ly = rng.uniform(2.0, 10.0), rng.uniform(2.0, 10.0); x, y = at(c, r, lx, ly, 0.0); s_ = rng.uniform(0.5, 1.6); zc[0] += 0.0007; zz = 0.012 + zc[0]
                P.box('plast', x - s_ / 2, x + s_ / 2, y - s_ * 0.35, y + s_ * 0.35, 0.0, zz)
                if rng.rand() < 0.6: P.box('sky', x - s_ / 2, x - s_ / 2 + 0.25, y - s_ * 0.3, y + s_ * 0.3, zz, zz + 0.5)
    # the skylight: one row of bays is glass in a grid, some panes gone to the dark
    y0, y1 = band_y(SKY_ROW, 6.0, 9.6, 0.3)                    # (band_y centres what shows: the glass from 1.2 to 10.8 m of its bay)
    P.box('glass_d', -3.0, 63.0, y0, y1, 0.0, 0.08)
    for k in range(-2, 34): P.box('white', k * 2.0 - 0.07, k * 2.0 + 0.07, y0, y1, 0.08, 0.3)
    for j in range(6): yy = y0 + (y1 - y0) * j / 5.0; P.box('white', -3.0, 63.0, yy - 0.07, yy + 0.07, 0.08, 0.3)
    for c in range(5):
        for _ in range(3):
            i = int(rng.randint(0, 6)); j = int(rng.randint(0, 5)); x0 = c * TM + i * 2.0 + 0.1; yy = y0 + (y1 - y0) * j / 5.0 + 0.1
            P.box('black', x0, x0 + 1.8, yy, yy + (y1 - y0) / 5.0 - 0.2, 0.08, 0.1)
    for r in range(-1, 7):                                     # a rib on every bay's line, both ways
        ya, yb = band_y(r, 0.0, 1.3, 0.6); P.box('white', -3.0, 63.0, ya, yb, 0.0, 0.6); yc = (ya + yb) / 2; P.box('brass', -3.0, 63.0, yc - 0.06, yc + 0.06, 0.6, 0.63)   # a broad arch band, a brass line down it
    for c in range(6):
        x = c * TM; P.box('white', x - 0.65, x + 0.65, -3.0, 63.0, 0.0, 0.615); P.box('brass', x - 0.06, x + 0.06, -3.0, 63.0, 0.615, 0.66)
    for r in range(5):
        if r == SKY_ROW: continue
        for c in range(5):
            for (lx, ly) in ((3.0, 8.6), (9.0, 8.6)):          # the uplights on their stems, dead (one lit: rule 20)
                x, y = at(c, r, lx, ly, 0.9); lit = (c, r, lx) == (2, 1, 9.0)
                P.bar('black', (x, y, 0.0), (x, y, 0.7), 0.012); P.drum('lit' if lit else 'brass', x, y, 0.7, 0.95, 0.3, 12, 0.14)


TG.CEILINGS['mall'] = (ceil_mall, 'mall/mall_ceiling.webp', "the painted sky, faded: clouds on a pale sky, the paint let go in patches down to the plaster, a rib on every bay's line both ways, the skylight's grid across one row of bays (some panes gone to the dark), the uplights dead but one")
TG.CEIL_DATA['mall'] = 'mall/mall.json'


# ---- the cut (no Blender) ----------------------------------------------------------------------------------------------------
KIND = dict(bridge='HEIGHT', escalator_e='HEIGHT', escalator_w='HEIGHT', rail_ew='RAIL', rail_ns='RAIL', wall_ew='WALL', wall_ns='WALL', front_ew='WALL', storewall_ns='WALL', door='DRESS',
            lift='WALL', carts='COVER', cart_a='DRESS', cart_b='DRESS', counter='COVER', kiosk='COVER', stock='COVER', camp_a='LOW_COVER', camp_b='LOW_COVER', tables='LOW_COVER',
            rubble='LOW_COVER', planter='COVER', column='WALL')
HM = dict(bridge=LEVEL_H, escalator_e=LEVEL_H, escalator_w=LEVEL_H, rail_ew=1.04, rail_ns=1.04, wall_ew=1.6, wall_ns=1.6, front_ew=FRONT_H, storewall_ns=FRONT_H, door=DOOR_H, lift=3.2, carts=1.04,
          cart_a=1.04, cart_b=0.56, counter=1.9, kiosk=2.36, stock=1.4, camp_a=1.6, camp_b=1.6, tables=0.86, rubble=0.9, planter=3.0, column=2.6)
NAME = dict(bridge='THE BRIDGE', escalator_e='A DEAD ESCALATOR, EAST', escalator_w='A DEAD ESCALATOR, WEST', rail_ew='THE GLASS RAIL', rail_ns='THE GLASS RAIL', wall_ew="THE MALL'S WALL", wall_ns="THE MALL'S WALL",
            front_ew='A STORE FRONT', storewall_ns='THE WALL BETWEEN TWO STORES', door='A SHUTTER STUCK HALF DOWN', lift='THE LIFT', carts='A CORRAL OF CARTS', cart_a='A CART', cart_b='A CART',
            counter="A STORE'S COUNTER", kiosk='A KIOSK', stock='STOCK ON PALLETS', camp_a='SOMEBODY LIVES HERE', camp_b='SOMEBODY LIVES HERE', tables="THE FOOD COURT'S TABLES", rubble='THE CEILING, COME DOWN',
            planter='A PLANTER', column='A COLUMN')
ALSO = dict(boxes='stock', bedding_a='camp_a', bedding_b='camp_b', seats='tables')       # COMBAT THREE's drawn-only names: the same pictures


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'mall_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'mall_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'mall_store.png')).convert('RGB'); fn = os.path.join(SHIP, 'mall_store_0.webp'); im.save(fn, 'WEBP', quality=60, method=6); bytes_['store'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'mall_pieces.png')).convert('RGBA'); A = MALL_AT; sz = {}; hh = LEVEL_H * PPM / PYM
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'mall_' + key, 'mall', shadow)
    for key in ('bridge', 'escalator_e', 'escalator_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 12.0 + hh + (1.6 if key != 'bridge' else 0.3)), 0.0)
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.5, y + 1.9), 0.4)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.5, x + 1.3, y - 0.05, y + 13.6), 0.5)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.08, y + 2.75), 0.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.5, x + 1.6, y - 0.05, y + 14.4), 0.5)
    x, y = A['front_ew']; one('front_ew', (x - 6.0, x + 6.0 + 0.01, y - 1.0, y + 0.4 + FRONT_H * 1.45), 1.0)      # 1.0: the dark of a window's recess is the picture's, not the ground's shadow (cut at 0 it ships with holes)
    x, y = A['storewall_ns']; one('storewall_ns', (x - 0.6, x + 2.2, y - 0.1, y + 12.2 + FRONT_H * 1.45), 0.5)
    x, y = A['door']; one('door', (x - 6.0, x + 6.0 + 0.01, y - 0.6, y + 0.4 + DOOR_H * 1.45), 1.0)
    x, y = A['lift']; one('lift', (x - 1.9, x + 4.4, y - 0.2, y + 3.3 + 4.8), 0.6)
    x, y = A['carts']; one('carts', (x - 5.5, x + 6.0, y - 0.3, y + 3.7 + 3.0), 0.6)
    x, y = A['counter']; one('counter', (x - 3.5, x + 4.6, y - 0.1, y + 3.1 + 2.9), 0.7)
    x, y = A['kiosk']; one('kiosk', (x - 2.0, x + 3.6, y - 0.4, y + 2.7 + 3.5), 0.6)
    x, y = A['stock']; one('stock', (x - 1.8, x + 2.4, y - 1.1, y + 2.4 + 2.2), 0.7)
    for key in ('camp_a', 'camp_b'):
        x, y = A[key]; one(key, (x - 2.8, x + 3.6, y - 0.2, y + 2.8 + 2.5), 0.7)
    x, y = A['tables']; one('tables', (x - 5.8, x + 6.4, y - 0.1, y + 2.6 + 1.5), 0.7)
    x, y = A['rubble']; one('rubble', (x - 3.9, x + 4.0, y - 0.9, y + 3.2 + 1.5), 0.6)
    x, y = A['planter']; one('planter', (x - 2.2, x + 4.2, y - 0.8, y + 3.6 + 4.4), 0.6)
    x, y = A['column']; one('column', (x - 0.9, x + 3.0, y - 0.8, y + 0.5 + 4.6), 0.6, foot=(x, y - 0.1))
    x, y = A['cart_a']; one('cart_a', (x - 0.7, x + 1.8, y - 0.2, y + 1.3 + 1.6), 0.6)
    x, y = A['cart_b']; one('cart_b', (x - 1.0, x + 1.8, y - 0.2, y + 1.0 + 1.0), 0.6)
    for k, v in sz.items(): v.update(piece=k, src='mall/mall_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows, sheet='floor': ['mall/mall_%s_0.webp#%d,%d' % (sheet, c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'mall_' + k: ent(k) for k in sz}
    for a, k in ALSO.items(): kit['mall_' + a] = dict(ent(k), kind='DRESS')
    art = {
        'version': 'cook5-mall-art-11-17', 'lane': 'cook 5', 'stage': 'finished',
        'for': "COMBAT THREE's mall (slices/fight_ground/mall/mall.json, BUILD 11/17x): the names its handoff asked for, the garage's format. floor.floor is the concourse (rows 0 to 3 of mall_floor_0: terrazzo, the diamonds, the leaves), floor.store a store's carpet (all of mall_store_0, a sheet of its own: two grounds on one sheet bleed into each other's edge tiles), floor.high the terrazzo bare (row 4, under the bridge's own picture), floor.ring every terrazzo tile (the mall going on past the fight). Any tile meets any tile of its list.",
        'floor': {'floor': cells((0, 1, 2, 3)), 'store': cells((0, 1, 2, 3, 4), 'store'), 'high': cells((4,)), 'ring': cells((0, 1, 2, 3, 4))},
        'kit': kit,
        'how_it_lays': {
            'store fronts and doors': "mall_front_ew is a tile long, 3 m up the glass, foot its south base middle (the garage's wall way); the sign's fallen letter lies 0.4 m south of it. mall_door is a tile wide: two piers, the header, the shutter's curtain down to 1.35 m; foot the doorway's south base middle (a man on the tile stands under it). mall_storewall_ns is a tile deep, foot its south end middle.",
            'the outer wall': 'mall_wall_ew / mall_wall_ns: 1.6 m with the wainscot, a tile long',
            'carts': 'mall_carts is 10.6 m wide, 3.5 m deep, foot its south edge middle; mall_cart_a stands, mall_cart_b lies with somebody\'s bags',
            'stock, counter, kiosk, planter, camp, tables, rubble': "foot the piece's south edge middle; mall_boxes is mall_stock's picture, mall_bedding_a/b the camps', mall_seats the tables'",
            'the column and the lift': 'mall_column is 1 m square, foot its base middle; mall_lift is 3.2 m square, 3.2 m up, foot its south base middle (the doors face south)',
            'the bridge': "mall_bridge on every high tile, foot at the tile's south edge middle; 1.42 m up; its diamonds repeat every 4 m so deck tiles meet. mall_escalator_e climbs to the east, mall_escalator_w to the west (the same foot). mall_rail_ew / mall_rail_ns on its open edges (the hall's glass rail).",
        },
        'bytes': bytes_,
    }
    TG.keep_ceiling(art, os.path.join(SHIP, 'mall_art.json'))
    cp = os.path.join(REND, 'ceil_mall.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'mall_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'mall/mall.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "mall/mall_ceiling.webp"' in e
        e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
        open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='mall/mall_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['mall'][2],
                              contract="mall.json 'ceiling' (COMBAT THREE's: the fight draws it over the board at that alpha, rule 451(a))")
    json.dump(art, open(os.path.join(SHIP, 'mall_art.json'), 'w'), indent=1)
    print('mall: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


def sheet(before_dir, page_dir):
    """records/target/COOK5_THE_MALL_11_17.webp: what the VOTE card shows. The phone shots are the game's own fight page
    (tools/bohemia_a_big_inside_on_the_page_11_17_26.js): the same fight before (every piece a stand-in) and now, the ceiling at
    his 10%; then the pieces at their own pixels, the two floors, and the painted sky at full strength."""
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
    title('THE MALL, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the painted sky at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL 230 PIECES STAND-INS', up(os.path.join(before_dir, 'mall_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'mall_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE SKY AT 10%', up(os.path.join(page_dir, 'mall_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('SIDEWAYS', '844 x 390, the sky at 10%')
    n = Image.open(os.path.join(page_dir, 'mall_sideways_open_a01.png')).convert('RGB'); rows.append(n.resize((WID, int(n.height * WID / n.width)), Image.LANCZOS))
    title('THE PIECES AT THEIR OWN PIXELS', 'a store front and its mannequins, a shutter half down, carts, a counter, a kiosk, the lift, two camps, the food court, the sky on the floor')
    def piece(k, bg=(120, 116, 106)):
        im = Image.open(os.path.join(SHIP, 'mall_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('front_ew', 'door'), 190); row_of(('carts', 'counter', 'kiosk', 'lift'), 250); row_of(('camp_a', 'camp_b', 'stock', 'planter', 'column'), 230); row_of(('tables', 'rubble', 'cart_a', 'cart_b'), 150); row_of(('bridge', 'escalator_e'), 300)
    title('THE CONCOURSE, A STORE\'S CARPET, AND THE PAINTED SKY AT FULL STRENGTH', 'terrazzo with its diamonds and dead leaves; the carpet worn pale to the door; the sky, its paint let go, the skylight (two bays by two)')
    fl = Image.open(os.path.join(SHIP, 'mall_floor_0.webp')).convert('RGB').crop((TW, TH, TW * 2, TH * 2)); ca = Image.open(os.path.join(SHIP, 'mall_store_0.webp')).convert('RGB').crop((TW, TH, TW * 2, TH * 2))
    ce = Image.open(os.path.join(SHIP, 'mall_ceiling.webp')).convert('RGB'); bw, bh = ce.width // 5, ce.height // 5; ce = ce.crop((bw, bh * 2, bw * 3, bh * 4))
    cw3 = (WID - 20) // 3; hh3 = int(TH * cw3 / TW); r = Image.new('RGB', (WID, hh3), BG)
    for i, im in enumerate((fl, ca, ce)): r.paste(im.resize((cw3, hh3), Image.LANCZOS), (i * (cw3 + 10), 0))
    rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK5_THE_MALL_11_17.webp'); out.save(fn, 'WEBP', quality=76, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); os.makedirs(os.path.join(R, 'records/target/vote_first'), exist_ok=True)
    f2 = os.path.join(R, 'records/target/vote_first/cook5-the-mall-11-17.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        quick = '--quick' in a
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, quick) if n in ('mall_floor', 'mall_store') else TG.scene_pieces(n, quick) if n == 'mall_pieces' else TG.scene_ceiling('mall', quick)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cal': TG.scene_cal(True); TG.calibrate()
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_mall_floor(ID); pal = np.random.RandomState(5).randint(40, 220, (64, 3)).astype(np.uint8)
        im = pal[gid].astype(np.float32) * (1 - 0.6 * dark[..., None]) + pale[..., None] * 50
        os.makedirs(TG.OUT, exist_ok=True); Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(os.path.join(TG.OUT, 'plan_mall_floor.png')); print('plan written')
    else: print(__doc__)
