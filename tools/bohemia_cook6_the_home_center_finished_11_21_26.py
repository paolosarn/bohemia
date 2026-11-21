#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the home center, finished] (11/21/26; COMBAT FOUR's BUILD 11/20w asked 'FOR COOK (SIX) 2)';
VAMILY rules 461, 453, 441, 416, 451(a), 455).

COMBAT FOUR's twelfth inside (THE HOME CENTER, slices/fight_ground/homecenter/homecenter.json, laid by slices/bohemia_big_inside.js):
a fight in the big-box hardware store, runs of racking you cannot stand on with end caps in their gaps, stock in the aisles, the
checkouts, the lumber along the back, the garden yard behind its fence under the sky. All 14 of its pieces were stand-ins. These are
the pictures under its names, through the master rig, ON this lane's Sphere tool (and the powerhouse's, the stadium's, and COOK
FIVE's chain under them, the warehouse's racking and roof among it):

  THE FLOOR        homecenter_floor_0.webp, five tiles by five. Rows 0 to 2: THE SLAB, sealed and polished, saw cuts, the aisle's
                   number on a yellow floor decal on some tiles, a forklift's tracks, pallet scrapes, a gallon of paint spilled and the
                   footprints walked out of it. Rows 3 and 4: THE GARDEN YARD's concrete, broom-finished, under the shadow of the shade
                   cloth's rags (the sun through its tears), soil spilled from a split bag, the rings where pots stood, dead leaves.
                   (No new ground: the calibration board holds 25 and 24 are taken; these are the hall's slab, the garage's yellow and
                   white paint, the powerhouse's rust, the tunnel's floor and the stadium's dirt, under the plan's dark and pale.)
  THE PIECES       (homecenter_art.json's kit, COMBAT FOUR's names)
    hc_rack        A RUN OF RACKING, a tile wide: orange uprights and beams in five bays, three levels; the two shelves a hand can
                   reach stripped to their wire decks, up top what nobody could carry: water heaters, a bathtub, cabinets in their
                   boxes, rolls of insulation; a ladder left against it; a tile's blocker (the warehouse's rack, taller)
    hc_endcap      an end cap's display knocked flat: its pegboard back on the floor, its shelves up, what was on it kicked about
    hc_stock       a pallet of stock in the aisle, shrink-wrapped, and the pallet jack left in it
    hc_spill       a rack's load spilled across the aisle: a beam down, boxes split, buckets, pipe, a ladder on its side
    hc_lumber      lumber in its bunks on the cantilever racks along the back wall, a tile wide, some bunks empty, plywood leaning
                   on the front, a sleeping bag on the bottom arm (a crew sleeps in the lumber aisle)
    hc_cart / _b   flatbed carts, orange handles: two, one with drywall on it; one empty
    hc_checkout    a checkout lane: the counter and its belt, the dead register, the lane's pole, the bagging rack, the impulse rack
                   stripped
    hc_propane     the propane exchange cage, empty, its door hanging open, one dented tank on its side
    hc_rental      the rental counter, a mixer and a lift: the counter, a concrete mixer on its stand, a scissor lift folded down
    hc_plants      benches of dead plants in pots, some knocked off, the soil out
    hc_bags        soil and mulch bags on pallets, one pallet's bags split and spilled
    hc_wall_ew/_ns the tilt-up wall, a tile long: painted concrete, the scuffed dark band, a panel joint, an extinguisher, chalk
  THE CEILING      homecenter_ceiling.webp (rule 451(a), over the fight at 10%): five bays by five that repeat (its two layouts are
                   not one shape, so one board-sized picture would not fit both): the corrugated deck, open-web joists, girders,
                   rows of strip lights over the aisles, most dead and one still on, the aisle signs hanging, a few clear panels, the
                   red sprinkler mains (the warehouse's roof, made a store's).

  <venv>/bin/python tools/bohemia_cook6_the_home_center_finished_11_21_26.py render hc_floor | hc_pieces | ceil_homecenter
  python3 tools/bohemia_cook6_the_home_center_finished_11_21_26.py cut
  python3 tools/bohemia_cook6_the_home_center_finished_11_21_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a big-box home improvement store (about
105,000 square feet under its roof and 24,000 of garden centre: Home Depot's own average, COMBAT FOUR's facts): steel pallet racking
with orange beams in long rows, overhead stock on the top levels, cantilever lumber racks along the back wall, flatbed carts, checkout
lanes at the front by the doors, a propane exchange cage outside the front, a tool rental counter, a garden centre under shade cloth
with plant benches and bagged soil on pallets; a store looted in a collapse (what is left is what nobody could carry). The twins: the
warehouse's kit (its racking and roof) and this lane's map pieces of the two home centers (the same store, from the map).
REUSE CHECK (REUSE-FIRST): the warehouse's upright, rack and roof (COOK FIVE's), the Sphere's road case and black family, the
powerhouse's crate and cut, the stadium's board helpers; COOK FIVE's rig, grounds, Parts and cutter. New here: the store's plan, its
pieces, its roof's lights and signs.
ANALOG HORROR: an aisle's number still on the floor of an aisle with nothing in it; footprints walked out of a spilled gallon of paint
and off into the dark; a sleeping bag on the bottom arm of the lumber rack.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_sphere_finished_11_20_26 as SPH          # this lane's: the Sphere (and the powerhouse, the stadium, COOK FIVE's chain)

PW = SPH.PW; SD = SPH.SD; TM = SD.TM; DF = SD.DF; WT = DF.WT; HT = SD.HT; TG = SD.TG; FW = SD.FW
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'homecenter')
SLAB, YARD = (0, 1, 2), (3, 4)


# ---- the ground ------------------------------------------------------------------------------------------------------------
def tile_xy(r, c):
    return slice(r * TH, (r + 1) * TH), slice(c * TW, (c + 1) * TW)


def decal(num, rng):
    """an aisle's number on a yellow floor decal (1.6 m by 0.9 m), as the floor sees it (foreshortened): returns (yellow, black) masks"""
    w, h = int(1.6 * PPM), int(0.9 * PPM)
    im = Image.new('L', (w, h), 0); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=6, fill=1)
    f = ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), int(0.62 * PPM)); t = str(num)
    bb = d.textbbox((0, 0), t, font=f); d.text(((w - (bb[2] - bb[0])) / 2 - bb[0], (h - (bb[3] - bb[1])) / 2 - bb[1]), t, font=f, fill=2)
    im = im.resize((w, max(2, int(h * PYM / PPM))), Image.NEAREST); a = np.asarray(im)
    return a == 1, a == 2


def plan_hc_floor(ID, seed=181):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['hall_slab'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    pale = np.clip((dust - 0.6) / 0.3, 0, 1) * 0.08; dark = 0.05 + np.clip((0.4 - dust) / 0.3, 0, 1) * 0.05
    nums = list(rng.permutation(np.arange(12, 48)))
    for r in SLAB:
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; G, D, Pl = gid[sy, sx], dark[sy, sx], pale[sy, sx]
            if rng.rand() < 0.6:                                         # the aisle's number on its floor decal
                ye, bk = decal(int(nums.pop()), rng); hh_, ww_ = ye.shape; y0 = int(TH * rng.uniform(0.35, 0.6)); x0 = int(TW * rng.uniform(0.3, 0.55))
                Gs = G[y0:y0 + hh_, x0:x0 + ww_]; Ds = D[y0:y0 + hh_, x0:x0 + ww_]
                Gs[ye] = ID['gar_yellow']; Gs[bk] = ID['gar_yellow']; Ds[bk] = 0.8; Ds[ye] = 0.05
                worn = rng.rand(*ye.shape) < 0.18; Pl[y0:y0 + hh_, x0:x0 + ww_][worn & (ye | bk)] = 0.35   # scuffed by carts
            for _ in range(rng.randint(0, 2)):                           # a forklift's tracks, two lines curving together
                ax, ay, R_ = rng.uniform(-4, 16), rng.uniform(-4, 16), rng.uniform(4, 8); d0 = np.hypot(X - ax, Y - ay)
                m = ((np.abs(d0 - R_) < 0.06) | (np.abs(d0 - R_ - 0.9) < 0.06)) & (X > 1.2) & (X < 10.8) & (Y > 1.2) & (Y < 10.8) & (np.arctan2(Y - ay, X - ax) % 1.1 < 0.5)
                D[m] = np.maximum(D[m], 0.2)
            for _ in range(rng.randint(2, 5)):                           # pallet scrapes
                x0_, y0_ = rng.uniform(1.5, 9.5), rng.uniform(1.5, 10.5); L_ = rng.uniform(0.6, 1.6)
                D[(np.abs(Y - y0_) < 0.03) & (X > x0_) & (X < x0_ + L_)] = 0.4
            if rng.rand() < 0.33:                                        # a gallon of paint spilled, and the footprints walked out of it
                cx, cy = rng.uniform(3.0, 9.0), rng.uniform(3.0, 9.0); nn = FW.vnoise(X.shape, 0.4 * PPM, rng)
                blob = (np.hypot(X - cx, (Y - cy) * 1.2) + 0.5 * (nn - 0.5)) < rng.uniform(0.5, 0.8)
                kind = ID['gar_white']; rng.rand(); G[blob] = kind; D[blob] = 0.0   # (white: the first floor's terracotta spills and their prints read as
                                                                                    #  red drops over every aisle, too near blood)
                ang = rng.uniform(0, 2 * math.pi); px_, py_ = cx, cy
                for k in range(7):
                    px_ += 0.62 * math.cos(ang) + rng.uniform(-0.08, 0.08); py_ += 0.62 * math.sin(ang) + rng.uniform(-0.08, 0.08)
                    sd = 0.13 * (1 if k % 2 else -1); fx, fy = px_ - sd * math.sin(ang), py_ + sd * math.cos(ang)
                    if not (1.2 < fx < 10.8 and 1.2 < fy < 10.8): break
                    fp = np.hypot((X - fx) * 2.2, (Y - fy) * 1.0) < 0.14 * (1.0 - k * 0.08)
                    G[fp & (rng.rand() > k * 0.1)] = kind
    for r in YARD:                                                       # THE GARDEN YARD: broom-finished, under the shade cloth's rags
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; G, D, Pl = gid[sy, sx], dark[sy, sx], pale[sy, sx]
            G[:] = ID['tun_floor']; D[:] = 0.2                              # the cloth's shadow over all of it (so every edge meets)
            Wn = TG.win(X, Y, 1.0, 2.5); nn = FW.vnoise(X.shape, 0.8 * PPM, rng)
            for _ in range(rng.randint(1, 3)):                           # where it tore, the sun on the ground
                cx, cy = rng.uniform(4.2, 7.8), rng.uniform(4.2, 7.8); rx, ry = rng.uniform(0.6, 1.4), rng.uniform(0.4, 1.0)   # (kept clear of the margin: the first plan's
                hole = (((X - cx) / rx) ** 2 + ((Y - cy) / ry) ** 2 + 0.6 * (nn - 0.5)) < 1.0                                  #  were sliced flat where it began)
                D[hole] = 0.0; Pl[hole] = 0.12
            for _ in range(rng.randint(3, 7)):                           # the rings where pots stood
                cx, cy, rr = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5), rng.uniform(0.15, 0.3)
                D[np.abs(np.hypot(X - cx, Y - cy) - rr) < 0.03] = 0.5
            if rng.rand() < 0.7:                                         # soil out of a split bag
                cx, cy = rng.uniform(4.0, 8.0), rng.uniform(4.0, 8.0); soil = (np.hypot(X - cx, (Y - cy) * 1.3) + 0.6 * (nn - 0.5)) < rng.uniform(0.7, 1.2)
                G[soil] = ID['st_dirt']; D[soil] = 0.1
            leaves = (rng.rand(*X.shape) < 0.004) & (Wn > 0.2); D[leaves] = 0.55
            for x0_ in np.arange(0.4, 12, 0.5): D[(np.abs(X - x0_) < 0.012) & (Wn > 0.2)] += 0.04   # the broom's lines
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['hc_floor'] = plan_hc_floor


def hc_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(25.0, 59.4)), 30)


TG.GARAGE_THINGS['hc_floor'] = hc_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
HC_AT = dict(rack=(10.0, 44.0), lumber=(26.0, 45.0), rental=(43.0, 46.0), wall_ns=(57.0, 45.0),
             wall_ew=(10.0, 34.0), checkout=(25.0, 33.0), propane=(35.0, 34.0), stock=(44.0, 34.0), endcap=(52.0, 34.0),
             spill=(10.0, 21.0), cart=(22.0, 21.0), cart_b=(30.0, 21.0), plants=(40.0, 21.0), bags=(52.0, 21.0))
RACK_H, LUMBER_H, WALL_H = 5.6, 3.6, 2.4


def hc_upright(P, x, y0, y1):
    for y in (y0, y1 - 0.09): P.box('orange', x - 0.05, x + 0.05, y, y + 0.09, 0.0, RACK_H)
    for k in range(7): P.bar('orange', (x, y0 + 0.05, 0.25 + k * 0.75), (x, y1 - 0.05, 0.25 + (k + 1) * 0.75 if k % 2 == 0 else 0.25 + k * 0.75), 0.02)


def rack(P, ox, oy, rng):
    """A RUN OF RACKING, a tile wide: orange uprights in five bays, beams at three levels, back to back (2.4 m deep); the two
    shelves a hand reaches stripped to their wire decks, up top what nobody could carry; a ladder left against it"""
    D_ = 2.4; xs = [ox - 6 + 0.06 + i * 2.97 for i in range(5)]
    for x in xs: hc_upright(P, x, oy, oy + D_)
    for b in range(4):
        x0, x1 = xs[b], xs[b + 1]
        for z in (1.6, 3.2, 4.8):
            for y in (oy, oy + D_ - 0.1): P.box('orange', x0 + 0.05, x1 - 0.05, y, y + 0.1, z - 0.12, z)
            P.box('hc_deck', x0 + 0.06, x1 - 0.06, oy + 0.1, oy + D_ - 0.1, z - 0.04, z - 0.02)            # the wire deck
        if rng.rand() < 0.5: P.box(('paint_w', 'card', 'teal')[rng.randint(3)], x0 + 0.3, x0 + 0.62, oy + 0.15, oy + 0.45, 1.58, 1.9)   # one thing left low
        u = rng.randint(4)                                                # up top: what nobody could carry
        if u == 0:
            for k in range(2): P.drum('white', x0 + 0.8 + k * 1.3, oy + 1.2, 4.8, 6.3, 0.32, 14); P.drum('steel', x0 + 0.8 + k * 1.3, oy + 1.2, 6.3, 6.36, 0.28, 14)   # water heaters
        elif u == 1: P.box('card', x0 + 0.2, x1 - 0.2, oy + 0.3, oy + 2.1, 4.8, 5.5); P.box('paint_w', x0 + 0.8, x1 - 0.8, oy + 0.28, oy + 0.3, 5.0, 5.3)   # a bathtub in its box
        elif u == 2:
            for k in range(3): P.box('card', x0 + 0.15 + k * 0.92, x0 + 0.95 + k * 0.92, oy + 0.3, oy + 1.0, 4.8, 5.7)   # cabinets in their boxes
        else:
            for k in range(4): P.tube_x('hc_insul', x0 + 0.2, x1 - 0.2, oy + 0.4 + k * 0.5, 5.05, 0.24, 10)             # rolls of insulation
    for _ in range(3): x = ox + rng.uniform(-5.4, 5.4); P.box('card', x, x + 0.4, oy - rng.uniform(0.3, 0.8), oy - 0.1, 0.0, 0.03)
    P.bar('steel', (ox + 2.6, oy - 1.1, 0.0), (ox + 2.6, oy - 0.05, 3.1), 0.04); P.bar('steel', (ox + 3.2, oy - 1.1, 0.0), (ox + 3.2, oy - 0.05, 3.1), 0.04)   # a ladder left against it
    for k in range(9): z = 0.3 + k * 0.33; y = oy - 1.1 + z / 3.1 * 1.05; P.bar('steel', (ox + 2.6, y, z), (ox + 3.2, y, z), 0.02)


def lumber(P, ox, oy, rng):
    """lumber in its bunks along the back wall, a tile wide: cantilever columns, their arms reaching to the aisle, boards laid along
    them, some bunks empty, plywood leaning on the front, a sleeping bag on the bottom arm"""
    for k in range(4):
        x = ox - 4.5 + k * 3.0; P.box('orange', x - 0.12, x + 0.12, oy + 1.4, oy + 1.65, 0.0, LUMBER_H); P.box('orange', x - 0.3, x + 0.3, oy + 1.2, oy + 1.9, 0.0, 0.12)
        for z in (0.35, 1.25, 2.15, 3.05): P.box('orange', x - 0.05, x + 0.05, oy + 0.05, oy + 1.4, z - 0.1, z)
    for lv, z in enumerate((0.35, 1.25, 2.15, 3.05)):
        for b in range(2):
            x0 = ox - 6 + b * 6.0; full = rng.rand()
            if lv == 0 and b == 1: P.box('blue', x0 + 1.0, x0 + 3.0, oy + 0.15, oy + 1.2, z, z + 0.16); P.box('white', x0 + 2.6, x0 + 2.95, oy + 0.3, oy + 1.0, z + 0.16, z + 0.24); continue   # somebody's sleeping bag
            if full < 0.3: continue
            n = int(2 + full * 6)
            for j in range(n): P.box('wood', x0 + 0.02, x0 + 5.98, oy + 0.1 + (j % 5) * 0.24, oy + 0.32 + (j % 5) * 0.24, z + 0.04 * (j // 5), z + 0.04 + 0.04 * (j // 5) + 0.04)
    for k in range(3): x0 = ox - 2.0 + k * 0.15; P.prism_x('wood', x0 - 1.2, x0 + 1.2, [(oy - 0.6, 0.0), (oy - 0.56, 0.0), (oy + 0.02, 2.4), (oy - 0.02, 2.4)])   # plywood leaning on the front (pale: the first render's dark wood read as a black slab)


def flatbed(P, x, y, ang, load=None):
    """a flatbed cart: its deck on four casters, the orange handle at one end"""
    ca, sa = math.cos(ang), math.sin(ang); pt = lambda u, v: (x + u * ca - v * sa, y + u * sa + v * ca)
    P.poly('steel', [pt(-0.8, -0.38), pt(0.8, -0.38), pt(0.8, 0.38), pt(-0.8, 0.38)], 0.25, 0.32)
    for (u, v) in ((-0.65, -0.3), (0.65, -0.3), (-0.65, 0.3), (0.65, 0.3)): c = pt(u, v); P.drum('black', c[0], c[1], 0.0, 0.25, 0.07, 8)
    for v in (-0.33, 0.33): a = pt(-0.8, v); P.bar('orange', (a[0], a[1], 0.32), (a[0], a[1], 1.2), 0.025)
    a, b = pt(-0.8, -0.33), pt(-0.8, 0.33); P.bar('orange', (a[0], a[1], 1.2), (b[0], b[1], 1.2), 0.025)
    if load == 'drywall':
        for k in range(6): P.poly('hc_drywall', [pt(-0.78, -0.36), pt(0.78, -0.36), pt(0.78, 0.36), pt(-0.78, 0.36)], 0.32 + k * 0.016, 0.33 + k * 0.016)


def cart(P, ox, oy, rng):
    flatbed(P, ox - 0.9, oy + 0.6, 0.15, 'drywall'); flatbed(P, ox + 1.0, oy + 0.9, -0.5)


def cart_b(P, ox, oy, rng):
    flatbed(P, ox, oy + 0.5, 1.2)


def endcap(P, ox, oy, rng):
    """an end cap's display knocked flat: its pegboard back on the floor, its shelves standing up from it, what was on it kicked about"""
    P.box('white', ox - 1.2, ox + 1.2, oy + 0.3, oy + 1.8, 0.0, 0.05)                                        # the pegboard, flat
    for k in range(4): y = oy + 0.5 + k * 0.38; P.box('steel', ox - 1.15, ox + 1.15, y, y + 0.03, 0.05, 0.42)
    P.box('steel', ox - 1.25, ox + 1.25, oy + 1.8, oy + 2.4, 0.0, 0.1)                                      # its base
    P.box('orange', ox - 0.9, ox - 0.1, oy + 0.2, oy + 0.22, 0.05, 0.55)                                   # its sign, still on a corner
    for _ in range(14):
        x, y = ox + rng.uniform(-2.0, 2.0), oy + rng.uniform(-0.8, 0.4); s_ = rng.uniform(0.12, 0.3)
        P.box(('card', 'paint_w', 'teal', 'red', 'orange')[rng.randint(5)], x, x + s_, y, y + s_ * 0.7, 0.0, s_ * 0.6)


def stock(P, ox, oy, rng):
    """a pallet of stock in the aisle, shrink-wrapped, a corner torn open; the pallet jack left in it"""
    P.box('wood', ox - 0.6, ox + 0.6, oy + 0.6, oy + 1.6, 0.0, 0.14)
    for (bx, by, bz) in ((0, 0, 0), (1, 0, 0), (0, 1, 0), (1, 1, 0), (0, 0, 1), (1, 0, 1), (0, 1, 1), (1, 1, 1), (0, 0, 2), (1, 1, 2)):
        x = ox - 0.58 + bx * 0.58; y = oy + 0.62 + by * 0.48; z = 0.14 + bz * 0.45; P.box('card', x, x + 0.56, y, y + 0.46, z, z + 0.44)
    P.box('wrap', ox - 0.61, ox + 0.61, oy + 0.59, oy + 0.6, 0.14, 1.2); P.box('wrap', ox - 0.61, ox + 0.2, oy + 0.6, oy + 1.61, 1.2, 1.22)
    P.box('orange', ox + 0.75, ox + 1.3, oy + 0.6, oy + 1.8, 0.0, 0.1); P.bar('orange', (ox + 1.02, oy + 0.4, 0.1), (ox + 1.02, oy - 0.2, 1.15), 0.03)   # the pallet jack
    P.box('black', ox + 0.92, ox + 1.12, oy - 0.28, oy - 0.14, 1.1, 1.2)


def spill(P, ox, oy, rng):
    """a rack's load spilled across the aisle: a beam down, boxes split, buckets, pipe, a ladder on its side"""
    P.bar('orange', (ox - 2.8, oy + 1.6, 0.06), (ox + 0.2, oy + 2.2, 0.06), 0.06)
    for _ in range(9):
        x, y = ox + rng.uniform(-2.8, 2.6), oy + rng.uniform(0.2, 2.0); s_ = rng.uniform(0.3, 0.6)
        P.box('card', x, x + s_, y, y + s_ * 0.8, 0.0, s_ * 0.5)
    for _ in range(5): x, y = ox + rng.uniform(-2.5, 2.5), oy + rng.uniform(0.0, 1.8); P.drum(('white', 'orange')[rng.randint(2)], x, y, 0.0, 0.36, 0.15, 12)   # buckets
    for k in range(6): y = oy + 0.3 + k * 0.08; P.tube_x('white', ox - 1.0 + k * 0.1, ox + 2.0 + k * 0.1, y, 0.03 + (k % 2) * 0.05, 0.025, 6)   # pipe
    P.box('steel', ox + 1.0, ox + 3.2, oy + 1.5, oy + 1.54, 0.0, 0.42); P.box('steel', ox + 1.0, ox + 3.2, oy + 1.9, oy + 1.94, 0.0, 0.42)   # a ladder on its side
    for k in range(7): x = ox + 1.1 + k * 0.3; P.box('steel', x, x + 0.03, oy + 1.54, oy + 1.9, 0.18, 0.22)
    for _ in range(30): x, y = ox + rng.uniform(-2.8, 3.0), oy + rng.uniform(-0.4, 2.2); P.box('chrome', x, x + 0.05, y, y + 0.01, 0.0, 0.01)   # screws, everywhere


def checkout(P, ox, oy, rng):
    """a checkout lane (the lane runs north to the doors' south): the counter and its belt, the dead register at its south end, the
    lane's pole, the bagging rack, the impulse rack stripped across from it"""
    x = ox - 0.4
    P.box('black', x - 0.45, x + 0.45, oy + 0.5, oy + 4.5, 0.0, 0.88); P.box('rubber', x - 0.38, x + 0.38, oy + 1.8, oy + 4.4, 0.88, 0.9)   # the counter, its belt
    P.box('white', x - 0.4, x + 0.2, oy + 0.7, oy + 1.4, 0.88, 1.2); P.box('black', x - 0.36, x + 0.16, oy + 0.72, oy + 1.38, 1.2, 1.24)   # the register
    P.box('black', x + 0.05, x + 0.4, oy + 1.5, oy + 1.75, 0.88, 1.35)                                        # its screen
    P.bar('steel', (x + 0.4, oy + 4.4, 0.88), (x + 0.4, oy + 4.4, 2.4), 0.03); P.box('orange', x + 0.2, x + 0.6, oy + 4.35, oy + 4.45, 2.3, 2.6)   # the lane's pole, its number
    P.box('white', x + 0.25, x + 0.55, oy + 4.34, oy + 4.35, 2.36, 2.54)
    for k in range(3): P.bar('steel', (x - 0.9, oy + 0.6 + k * 0.4, 0.4), (x - 0.9, oy + 0.6 + k * 0.4, 1.2), 0.015)   # the bagging rack
    P.box('steel', x + 1.4, x + 1.8, oy + 1.0, oy + 3.6, 0.0, 1.4)                                           # the impulse rack, stripped
    for k in range(4): P.box('hc_deck', x + 1.38, x + 1.82, oy + 1.0, oy + 3.6, 0.3 + k * 0.32, 0.33 + k * 0.32)
    P.box('paper', x - 0.2, x + 0.1, oy + 2.4, oy + 2.6, 0.9, 0.91)                                          # a receipt nobody took


def propane(P, ox, oy, rng):
    """the propane exchange cage, empty: steel mesh, two bays, one door hanging open, one dented tank on its side in front"""
    x0, x1, y0, y1, h = ox - 1.3, ox + 1.3, oy + 0.4, oy + 1.3, 1.9
    for (a, b) in (((x0, y0), (x1, y0)), ((x0, y1), (x1, y1)), ((x0, y0), (x0, y1)), ((x1, y0), (x1, y1)), ((ox, y0), (ox, y1))):
        for z in (0.0, 0.95, h): P.bar('steel', (a[0], a[1], z), (b[0], b[1], z), 0.02)
        L_ = math.hypot(b[0] - a[0], b[1] - a[1]); n = int(L_ / 0.1)
        if a[1] == y0 and b[1] == y0 and a[0] == x0: continue                 # its front: the doors (below)
        for k in range(n + 1): t = k / max(1, n); P.bar('steel', (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0.0), (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, h), 0.006)
    P.box('steel', x0, x1, y0, y1, h, h + 0.04); P.box('red', x0 + 0.3, x1 - 0.3, y0 - 0.02, y0, h - 0.4, h - 0.1); P.box('white', x0 + 0.5, x1 - 0.5, y0 - 0.025, y0 - 0.02, h - 0.33, h - 0.17)
    for k in range(13): x = ox + 0.05 + k * 0.1; P.bar('steel', (x, y0, 0.0), (x, y0, h), 0.006)            # the east door, shut
    for k in range(13): x = x0 - k * 0.07; y = y0 - k * 0.07; P.bar('steel', (x, y, 0.0), (x, y, h), 0.006)   # the west door, hanging open
    P.box('steel', x0 - 0.02, ox, y0 - 0.02, y0, 0.0, 0.03)
    P.tube_x('white', ox - 0.4, ox + 0.3, oy - 0.2, 0.16, 0.16, 12); P.drum('steel', ox + 0.32, oy - 0.2, 0.08, 0.24, 0.06, 8)   # one tank on its side


def rental(P, ox, oy, rng):
    """the rental counter, a mixer and a lift: the counter and its board of prices, a concrete mixer on its stand, a scissor lift
    folded down"""
    P.box('black', ox - 3.6, ox - 0.6, oy + 1.0, oy + 1.7, 0.0, 1.05); P.box('steel', ox - 3.65, ox - 0.55, oy + 0.95, oy + 1.75, 1.05, 1.1)
    P.box('orange', ox - 3.4, ox - 0.8, oy + 2.4, oy + 2.45, 1.4, 2.4); P.box('white', ox - 3.2, ox - 1.0, oy + 2.39, oy + 2.4, 1.6, 2.2)   # its board of prices, nobody to rent to
    cx, cy = ox + 0.6, oy + 0.9                                                                                  # the mixer on its stand
    P.bar('orange', (cx - 0.5, cy, 0.0), (cx - 0.2, cy, 0.9), 0.04); P.bar('orange', (cx + 0.5, cy, 0.0), (cx + 0.2, cy, 0.9), 0.04)
    P.wheel('orange', cx, cy, 1.05, 0.42, 0.7, 14); P.wheel('black', cx + 0.1, cy, 1.05, 0.22, 0.72, 10); P.wheel('black', cx - 0.6, cy, 0.22, 0.2, 0.12, 10)
    lx, ly = ox + 2.6, oy + 0.5                                                                                  # the scissor lift, down
    P.box('orange', lx - 0.4, lx + 0.4, ly, ly + 1.8, 0.1, 0.9)
    for (dx, dy) in ((-0.35, 0.2), (0.35, 0.2), (-0.35, 1.6), (0.35, 1.6)): P.drum('black', lx + dx, ly + dy, 0.0, 0.2, 0.1, 8)
    P.box('steel', lx - 0.45, lx + 0.45, ly - 0.05, ly + 1.85, 0.9, 1.0)
    for (a, b) in (((lx - 0.45, ly - 0.05), (lx + 0.45, ly - 0.05)), ((lx - 0.45, ly + 1.85), (lx + 0.45, ly + 1.85)), ((lx - 0.45, ly - 0.05), (lx - 0.45, ly + 1.85)), ((lx + 0.45, ly - 0.05), (lx + 0.45, ly + 1.85))):
        P.bar('haz', (a[0], a[1], 1.95), (b[0], b[1], 1.95), 0.025); P.bar('haz', (a[0], a[1], 1.0), (a[0], a[1], 1.95), 0.02)


def plants(P, ox, oy, rng):
    """benches of dead plants in pots: two steel benches, pots in rows with what died in them, some knocked off, the soil out"""
    for b in range(2):
        x0 = ox - 3.2 + b * 3.4; y0 = oy + 0.6
        P.box('hc_deck', x0, x0 + 2.8, y0, y0 + 1.2, 0.72, 0.76)
        for (dx, dy) in ((0.05, 0.05), (2.7, 0.05), (0.05, 1.1), (2.7, 1.1)): P.box('steel', x0 + dx, x0 + dx + 0.05, y0 + dy, y0 + dy + 0.05, 0.0, 0.72)
        for i in range(7):
            for j in range(3):
                if rng.rand() < 0.2: continue
                x, y = x0 + 0.2 + i * 0.4, y0 + 0.2 + j * 0.4; P.drum('hc_pot', x, y, 0.76, 0.98, 0.14, 10, 0.17)
                P.drum('hc_soil', x, y, 0.97, 0.985, 0.15, 10)
                for k in range(rng.randint(1, 4)): a = rng.uniform(0, 6.3); P.bar('hc_dead', (x, y, 0.98), (x + 0.12 * math.cos(a), y + 0.12 * math.sin(a), 1.0 + rng.uniform(0.1, 0.35)), 0.008)
    for _ in range(5):                                                                                          # knocked off, on their sides, the soil out
        x, y = ox + rng.uniform(-3.0, 3.0), oy + rng.uniform(-0.6, 0.3); P.wheel('hc_pot', x, y, 0.15, 0.15, 0.24, 10); P.box('hc_soil', x - 0.2, x + 0.3, y - 0.35, y - 0.1, 0.0, 0.03)


def bags(P, ox, oy, rng):
    """soil and mulch bags on pallets: two pallets stacked crosswise, one with its bags split and spilled; a third tipped"""
    for p_, (x0, y0) in enumerate(((ox - 2.4, oy + 0.6), (ox - 0.9, oy + 0.6))):
        P.box('wood', x0, x0 + 1.2, y0, y0 + 1.0, 0.0, 0.14)
        for lv in range(6 if p_ == 0 else 3):
            z = 0.14 + lv * 0.17; m = ('hc_bag', 'hc_bag_g')[p_]
            for k in range(2):
                if lv % 2 == 0: P.box(m, x0 + 0.02 + k * 0.59, x0 + 0.59 + k * 0.59, y0 + 0.02, y0 + 0.98, z, z + 0.16)
                else: P.box(m, x0 + 0.02, x0 + 1.18, y0 + 0.02 + k * 0.49, y0 + 0.49 + k * 0.49, z, z + 0.16)
    P.box('hc_mulch', ox - 0.9, ox + 0.6, oy - 0.2, oy + 0.6, 0.0, 0.08); P.box('hc_bag_g', ox - 0.5, ox + 0.1, oy + 0.1, oy + 0.5, 0.08, 0.1)   # split and spilled
    P.prism_x('wood', ox + 0.9, ox + 2.1, [(oy + 0.3, 0.0), (oy + 1.3, 0.0), (oy + 1.3, 0.14), (oy + 0.3, 0.55)])                         # a pallet tipped
    for k in range(3): P.box('hc_bag', ox + 1.0 + k * 0.35, ox + 1.3 + k * 0.35, oy - 0.4, oy + 0.3, 0.0, 0.14)


def wall_ew(P, ox, oy, rng):
    """the tilt-up wall, a tile long: painted concrete, the scuffed dark band, a panel joint at 6 m (and at the tile's edge), an
    extinguisher in its cabinet, names chalked"""
    P.box('panel', ox - 6, ox + 6, oy, oy + 0.3, 1.0, WALL_H); P.box('conc_d', ox - 6, ox + 6, oy, oy + 0.3, 0.0, 1.0)
    P.box('conc', ox - 6, ox + 6, oy - 0.01, oy + 0.31, WALL_H, WALL_H + 0.04)
    P.box('under', ox - 0.02, ox + 0.02, oy - 0.006, oy, 0.0, WALL_H)
    P.box('red', ox + 3.0, ox + 3.5, oy - 0.12, oy, 0.9, 1.6); P.box('white', ox + 3.05, ox + 3.45, oy - 0.125, oy - 0.12, 1.3, 1.55)
    for k in range(4): x = ox - 5.0 + k * 2.2 + rng.uniform(-0.3, 0.3); P.box('chalk', x, x + rng.uniform(0.3, 0.6), oy - 0.006, oy, 1.1 + 0.07 * (k % 2), 1.22 + 0.07 * (k % 2))


def wall_ns(P, ox, oy, rng):
    P.box('panel', ox - 0.15, ox + 0.15, oy, oy + 12, 1.0, WALL_H); P.box('conc_d', ox - 0.15, ox + 0.15, oy, oy + 12, 0.0, 1.0)
    P.box('conc', ox - 0.16, ox + 0.16, oy, oy + 12, WALL_H, WALL_H + 0.04)


def hc_parts(P, rng):
    A = HC_AT
    rack(P, *A['rack'], rng); lumber(P, *A['lumber'], rng); rental(P, *A['rental'], rng); wall_ns(P, *A['wall_ns'], rng)
    wall_ew(P, *A['wall_ew'], rng); checkout(P, *A['checkout'], rng); propane(P, *A['propane'], rng); stock(P, *A['stock'], rng); endcap(P, *A['endcap'], rng)
    spill(P, *A['spill'], rng); cart(P, *A['cart'], rng); cart_b(P, *A['cart_b'], rng); plants(P, *A['plants'], rng); bags(P, *A['bags'], rng)


def hc_mats(bpy, NF, F, M, which):
    if which not in ('hc_pieces', 'tun_pieces'): return
    if which == 'hc_pieces': SPH.sp_mats(bpy, NF, F, M, 'sp_pieces')          # the Sphere's, the powerhouse's, the stadium's and the chain's own
    M.update(hc_deck=NF.material(bpy, 'in_black_wire_deck', 'tape_grey', 2, 0.85), hc_insul=NF.material(bpy, 'in_wrap_insulation', 'clay_rust', 3, 0.9),
             hc_drywall=NF.material(bpy, 'in_drywall', 'clay_bone', 4, 0.9), hc_pot=NF.material(bpy, 'in_pot_terracotta', 'clay_rust', 2, 0.95),
             hc_soil=NF.material(bpy, 'in_black_soil', 'tape_masking', 0, 0.9), hc_dead=NF.material(bpy, 'in_black_dead_stem', 'clay_mustard', 1, 0.9),
             hc_bag=NF.material(bpy, 'in_bag_mulch', 'clay_rust', 1, 0.9), hc_bag_g=NF.material(bpy, 'in_bag_soil', 'clay_teal', 1, 0.9),
             hc_mulch=NF.material(bpy, 'in_black_mulch', 'clay_rust', 0, 0.9), hc_sign=NF.material(bpy, 'in_paint_aisle_sign', 'sodium', 2, 0.95))


TG.PARTS['hc_pieces'] = hc_parts
TG.MAT_HOOKS.append(hc_mats)


# ---- the ceiling: the warehouse's roof, made a store's: five bays by five that repeat -------------------------------------
def ceil_homecenter(P, rng):
    """the corrugated deck, open-web joists, a girder on every bay's line, the red sprinkler mains (the warehouse's own); and the
    store's: rows of strip lights over the aisles end to end, most dead and one still on, an aisle sign hanging in every bay, a
    clear panel in a few"""
    at, band_y = TG.at, TG.band_y
    P.box('corr', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)
    for k in range(-4, 90): P.box('corr_d', -3.0, 63.0, k * 0.75 - 0.1, k * 0.75 + 0.1, 0.0, 0.06 + 0.0003 * (k % 7))
    for r in range(5):
        for c in range(5):
            if (r * 2 + c) % 5 == 0:                                   # a clear panel, in one bay of five: grey with years of dust
                x, y = at(c, r, 6.0, 3.0, 0.0); P.box('clearp', x - 1.5, x + 1.5, y - 0.6, y + 0.6, 0.0, 0.085)
    for c in range(-1, 26):
        x = c * 2.4 + 1.2
        if abs((x % TMT)) < 0.5 or abs((x % TMT) - TMT) < 0.5: continue
        P.box('white', x - 0.05, x + 0.05, -3.0, 63.0, 0.1, 0.18); P.box('white', x - 0.05, x + 0.05, -3.0, 63.0, 0.8, 0.88)
        for k in range(-2, 52): y = k * 1.2; P.bar('white', (x, y, 0.16 if k % 2 == 0 else 0.82), (x, y + 1.2, 0.82 if k % 2 == 0 else 0.16), 0.03)
    for r in range(-1, 7):
        ya, yb = band_y(r, 0.0, 1.3, 1.1); P.box('beam', -3.0, 63.0, ya, yb, 0.0, 1.1); yc = (ya + yb) / 2; P.box('rustp', -3.0, 63.0, yc - 0.5, yc + 0.5, 1.1, 1.12)
    for c in range(6):
        x = c * TMT; P.box('beam', x - 0.65, x + 0.65, -3.0, 63.0, 0.0, 1.115); P.box('rustp', x - 0.5, x + 0.5, -3.0, 63.0, 1.115, 1.14)
    for r in range(-1, 6):
        _, y = at(0, r, 0, 8.2, 1.25); P.tube_x('red', -3.0, 63.0, y, 1.25, 0.09)
    for r in range(5):                                                 # the strip lights: two rows a bay, end to end over the aisles
        for c in range(5):
            for lx in (3.0, 9.0):
                for k in range(3):
                    x, y = at(c, r, lx, 2.2 + k * 2.6, 1.0); lit = (c, r, lx, k) == (2, 3, 9.0, 1)
                    P.box('lit' if lit else 'white', x - 0.1, x + 0.1, y - 1.1, y + 1.1, 0.95, 1.05)
                    if not lit and rng.rand() < 0.1: P.bar('black', (x, y - 1.0, 0.0), (x, y - 1.0, 0.95), 0.008)   # one hanging by a chain
            x, y = at(c, r, 6.0, 5.0, 1.6)                              # the aisle sign, hanging
            P.box('hc_sign', x - 0.9, x + 0.9, y - 0.25, y + 0.25, 1.5, 1.7); P.box('white', x - 0.5, x + 0.5, y - 0.12, y + 0.12, 1.7, 1.71)
            for dx in (-0.7, 0.7): P.bar('black', (x + dx, y, 0.0), (x + dx, y, 1.5), 0.008)


TG.CEILINGS['homecenter'] = (ceil_homecenter, 'homecenter/homecenter_ceiling.webp', "the store's roof: the corrugated deck, open-web joists, a girder on every bay's line, the red sprinkler mains; rows of strip lights over the aisles, most dead and one still on; an aisle sign hanging in every bay; a clear panel in a few")
TG.CEIL_DATA['homecenter'] = 'homecenter/homecenter.json'

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(rack='COVER', lumber='COVER', rental='COVER', wall_ew='WALL', wall_ns='WALL', checkout='LOW_COVER', propane='COVER', stock='COVER',
            endcap='LOW_COVER', spill='LOW_COVER', cart='LOW_COVER', cart_b='DRESS', plants='LOW_COVER', bags='COVER')
HM = dict(rack=RACK_H, lumber=LUMBER_H, rental=2.6, wall_ew=WALL_H, wall_ns=WALL_H, checkout=2.6, propane=1.94, stock=1.25, endcap=0.55, spill=0.45,
          cart=1.2, cart_b=1.2, plants=1.3, bags=1.16)
NAME = dict(rack='A RUN OF RACKING', lumber='LUMBER BUNKS', rental='THE RENTAL COUNTER', wall_ew="THE STORE'S WALL", wall_ns="THE STORE'S WALL",
            checkout='A CHECKOUT LANE', propane='THE PROPANE CAGE', stock='A PALLET OF STOCK', endcap='AN END CAP', spill='A SPILLED RACK',
            cart='FLATBED CARTS', cart_b='FLATBED CARTS', plants='DEAD PLANTS', bags='STACKED BAGS')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'hc_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'homecenter_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'hc_pieces.png')).convert('RGBA'); A = HC_AT; sz = {}
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'hc_' + key, 'homecenter', shadow)
    x, y = A['rack']; one('rack', (x - 6.0, x + 6.0 + 0.01, y - 1.3, y + 2.4 + (RACK_H + 0.8) * 1.45), 1.0)
    x, y = A['lumber']; one('lumber', (x - 6.0, x + 6.0 + 0.01, y - 0.8, y + 1.9 + LUMBER_H * 1.45), 1.0)
    x, y = A['rental']; one('rental', (x - 3.8, x + 3.2, y - 0.3, y + 2.5 + 2.5 * 1.45), 1.0)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 0.4 + WALL_H * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + WALL_H * 1.45), 0.5)
    x, y = A['checkout']; one('checkout', (x - 1.6, x + 1.8, y + 0.2, y + 4.6 + 2.6 * 1.45), 1.0)
    x, y = A['propane']; one('propane', (x - 1.7, x + 1.5, y - 0.6, y + 1.4 + 2.0 * 1.45), 1.0)
    x, y = A['stock']; one('stock', (x - 0.8, x + 1.5, y - 0.5, y + 1.7 + 1.3 * 1.45), 1.0)
    x, y = A['endcap']; one('endcap', (x - 2.3, x + 2.3, y - 1.0, y + 2.5 + 0.6 * 1.45), 1.0)
    x, y = A['spill']; one('spill', (x - 3.2, x + 3.4, y - 0.6, y + 2.4 + 0.5 * 1.45), 1.0)
    x, y = A['cart']; one('cart', (x - 2.0, x + 2.1, y - 0.5, y + 1.7 + 1.3 * 1.45), 1.0)
    x, y = A['cart_b']; one('cart_b', (x - 1.1, x + 1.1, y - 0.7, y + 1.4 + 1.3 * 1.45), 1.0)
    x, y = A['plants']; one('plants', (x - 3.6, x + 3.5, y - 0.9, y + 1.9 + 1.4 * 1.45), 1.0)
    x, y = A['bags']; one('bags', (x - 2.6, x + 2.3, y - 0.7, y + 1.7 + 1.2 * 1.45), 1.0)
    for key, v in sz.items():                                            # every canvas runs down to its foot (the gate's A4)
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'hc_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='homecenter/hc_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['homecenter/homecenter_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'hc_' + k: ent(k) for k in sz}
    art = {'version': 'cook6-homecenter-art-11-21', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's home center (slices/fight_ground/homecenter/homecenter.json, BUILD 11/20w): the names its handoff asked for, the garage's format. floor.floor is the slab (rows 0 to 2: sealed and polished, saw cuts, an aisle's number on a yellow floor decal on most tiles, forklift tracks, pallet scrapes, a spilled gallon of paint and the footprints out of it; nothing within 1.2 m of an edge but the slab); floor.yard the garden yard's concrete (rows 3 and 4: broom-finished, under the shade cloth's shadow all over so every edge meets, the sun through its tears, soil out of a split bag, the rings where pots stood); floor.ring the slab. Any tile of a list meets any tile of it.",
           'floor': {'floor': cells(SLAB), 'yard': cells(YARD), 'ring': cells(SLAB)}, 'kit': kit,
           'how_it_lays': {'the racking': "hc_rack is a tile wide, 2.4 m deep (back to back), 5.6 m up the glass, foot its south base middle (your 'at' [0.5, 0.95]); its end uprights are inset so two tiles meet as one run. hc_lumber a tile wide too, the cantilever columns every 3 m.",
                           'the aisles': "hc_endcap, hc_stock, hc_spill, hc_cart (two carts), hc_cart_b (one): foot each at its south edge middle.",
                           'the front': "hc_checkout runs north to south (the counter 4 m, the register at its south end, the lane's pole at its north); hc_propane two bays of cage 2.6 m wide; hc_rental 7 m: the counter, the mixer, the lift.",
                           'the yard': "hc_plants two benches; hc_bags two pallets, one split, a third tipped. Their floor is floor.yard.",
                           'the walls': "hc_wall_ew / _ns: the tilt-up wall to 2.4 m, a tile long (the yard's fence uses the same names, as your file says)."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'homecenter_art.json'))
    cp = os.path.join(REND, 'ceil_homecenter.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'homecenter_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'homecenter/homecenter.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "homecenter/homecenter_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):   # (the one agreed edit in COMBAT FOUR's file)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='homecenter/homecenter_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['homecenter'][2],
                              contract="homecenter.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat, as the warehouse's")
    json.dump(art, open(os.path.join(SHIP, 'homecenter_art.json'), 'w'), indent=1)
    print('homecenter: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_HOME_CENTER_11_21.webp: the fight on his phone before and now (the roof off and at his 10%), the
    other layout, close in on the page, the pieces at their own pixels, a tile of the slab and of the yard, the roof at full strength"""
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
    title('THE HOME CENTER, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens: before (every piece a stand-in), now, and now with the store\'s roof at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'homecenter_upright_open_a0.png'))), ('NOW, THE ROOF OFF', up(os.path.join(page_dir, 'homecenter_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE ROOF AT 10%', up(os.path.join(page_dir, 'homecenter_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', 'pinched in on his phone: the racking and its aisles, the checkouts by the doors, the garden yard')
    strip([(lab, up(os.path.join(page_dir, 'homecenter_upright_%s.png' % n))) for lab, n in (('THE RACKING', 'racks_close'), ('THE CHECKOUTS', 'checkouts_close'), ('THE GARDEN YARD', 'yard_close'))], cw, ch)
    la = os.path.join(page_dir, 'la', 'homecenter_upright_open_a0.png')
    if os.path.exists(la):
        title('THE OTHER LAYOUT: THE LONG AISLES', 'the racking end to end across the store, the rental counter, the propane cage; and close in on them')
        strip((('THE LONG AISLES', up(la)), ('CLOSE IN', up(os.path.join(page_dir, 'la', 'homecenter_upright_rental_close.png'))), ('THE LUMBER', up(os.path.join(page_dir, 'la', 'homecenter_upright_lumber_close.png')))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the racking, the lumber, the rental counter, the checkout, the propane cage, the stock, the end cap, the spill, the carts, the plants, the bags, the wall')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'hc_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('rack', 'lumber'), 300); row_of(('rental', 'checkout', 'propane', 'stock'), 200); row_of(('endcap', 'spill', 'cart', 'cart_b'), 130); row_of(('plants', 'bags', 'wall_ew'), 130)
    title('THE SLAB, THE YARD, AND THE ROOF AT FULL STRENGTH', 'an aisle\'s number on the floor, paint and the footprints out of it; the yard under the shade cloth; the store\'s roof')
    fl = Image.open(os.path.join(SHIP, 'homecenter_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'homecenter_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_HOME_CENTER_11_21.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-home-center-11-21.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'hc_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'hc_pieces' else TG.scene_ceiling('homecenter', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_hc_floor(ID)
        col = {ID['hall_slab']: (150, 147, 140), ID['gar_yellow']: (160, 126, 56), ID['gar_white']: (178, 174, 162), ID['pw_rust']: (152, 108, 86), ID['tun_floor']: (142, 137, 126), ID['st_dirt']: (118, 103, 80)}
        img = np.zeros((H, W, 3), np.float32)
        for k, c in col.items(): img[gid == k] = c
        img = img * (1 - dark[..., None] * 0.7) + (255 - img) * pale[..., None] * 0.35
        fn = os.path.join(TG.OUT, 'hc_floor_plan.png'); Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(fn); print(fn)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
