#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the aquarium, finished] (11/28/26; COMBAT FOUR's aquarium asked 'FOR COOK (SIX)'; VAMILY rule 480(b): finished art
where a stand-in still stands; rule 482; rule 495(b): this tool says only what is its own, the cut and the sheet are the inside kit's; rules
461, 441, 416, 451(a)).

COMBAT FOUR's aquarium (THE AQUARIUM, slices/fight_ground/aquarium/aquarium.json, laid by slices/bohemia_big_inside.js): its reef halls (tanks
gone green, jellyfish columns, fake rockwork, viewing benches, dead kiosks, fallen acrylic panels) or its shark tunnel (the big tank with its
glass tunnel through it, the moving walkway dead). All 9 of its pieces were stand-ins and its ceiling was drawn by the page. These are the
pictures under its names, through the master rig, ON this lane's neon boneyard tool:

  THE FLOOR        aquarium_floor_0.webp (floor.floor, floor.ring): THE HALLS' DARK CARPET (the library's carpet tile, lb_carpet), a wave woven
                   into it that runs on from tile to tile, and the tide marks where the tanks wept into it, every mark inside its tile.
  THE PIECES       aq_tank (a tank a house wide, its water gone green and still, a scum on it and the dead fish floating, its acrylic front
                   streaked, its steel rim; tile-filling so a block of Q is a bank of tanks), aq_column (a jellyfish column floor to ceiling, empty,
                   and two smaller ones), aq_rockwork (the themed rockwork, fake stone over steel, its painted coral, broken open to its mesh in one
                   place), aq_panel (a tank's acrylic panel fallen and propped, one flat, one braced), aq_benches (the viewing benches, one tipped,
                   a stroller), aq_kiosk (a dead info kiosk, a map board, the queue's belts knocked down), aq_tunnel (the glass tunnel through the
                   big tank: its ribs over the dead walkway, its low rails, the tank's floor of sand and rock on both sides; a tile long so UUU is
                   one tunnel), aq_wall_ew/_ns (the building's wall painted black, a teal band, a dead exit sign).
  THE CEILING      aquarium_ceiling.webp (rule 451(a), 'deck'): the halls' black ceiling, its joists, the round ducts, a track of dead
                   spotlights in every bay.

  /tmp/v/bin/python tools/bohemia_cook7_the_aquarium_finished_11_28_26.py render aq_floor | aq_halls | aq_tunnel | ceil_aquarium
  python3 tools/bohemia_cook7_the_aquarium_finished_11_28_26.py cut | sheet <before_dir> <page_dir>

REFERENCE CHECK: the Strip's resort aquarium on the south Strip (a walk through dark halls between tanks, its biggest tank over a million gallons
with an acrylic tunnel and a moving walkway through it; themed rockwork round the tanks; jellyfish in floor-to-ceiling cylinders; patterned dark
carpet; a black open ceiling with ducts and track lights) and what a tank becomes without power (the pumps stop, the water goes green, what lived
in it dies, the acrylic holds). The twins: this lane's library (the carpet) and fire station (the roof's structure) kits.
ANALOG HORROR: the dead fish still floating on the green water of a tank nobody has drained; the walkway through the shark tank stopped
mid-step.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook7_inside_kit as KIT                            # this lane's: the cut, the sheet, the ceiling's hand-off, once (rule 495(b))
import bohemia_cook7_the_neon_boneyard_finished_11_27_26 as NB    # this lane's: the neon boneyard (and the chain under it)

FH = NB.FH; TS = NB.TS; TG = NB.TG; FW = NB.FW; HS = NB.HS
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
tile_xy = HS.tile_xy
ROWS = (0, 1, 2, 3)   # laid from twenty of the sheet's cells, the mall floor's count (rule 480(c), measured: with all 25 the night board opened ~2 fps slower than its stand-ins, with 20 level with them)


# ---- the ground: the dark carpet, a wave woven in, the tanks' tide marks -------------------------------------------------------
def plan_aq_floor(ID, seed=353):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['lb_carpet'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    dark = 0.12 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.06; pale = np.zeros((H, W), np.float32)
    for y0 in (1.5, 4.5, 7.5, 10.5):                                                                     # the woven wave: the same in every tile, so it runs on
        yw = y0 + 0.45 * np.sin(2 * math.pi * lx / 6.0)
        dark = np.maximum(dark, np.clip(1 - np.abs(ly - yw) / 0.09, 0, 1) * 0.3)
        pale = np.maximum(pale, np.clip(1 - np.abs(ly - yw - 0.22) / 0.05, 0, 1) * 0.18)
    for r in range(5):
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]
            Wn = TG.win(X, Y, 0.9, 1.2); nn = FW.vnoise(X.shape, 0.9 * PPM, rng)
            for _ in range(rng.randint(1, 3)):                                                              # where a tank wept into it
                cx, cy = rng.uniform(3.5, 8.5), rng.uniform(3.5, 8.5); rr = rng.uniform(1.0, 2.2)
                d0 = np.hypot(X - cx, (Y - cy) * 1.2) * (0.8 + 0.4 * nn)
                D[:] = np.maximum(D, np.clip((rr - d0) / 0.6, 0, 1) * 0.32 * Wn)
                Pl[:] = np.maximum(Pl, np.clip(1 - np.abs(d0 - rr) / 0.06, 0, 1) * 0.35 * Wn)                 # its tide line, dried pale
            ang = rng.uniform(0, math.pi); cx, cy = rng.uniform(4.5, 7.5), rng.uniform(4.5, 7.5)               # a path worn flat
            d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang)); D[:] += np.clip(1 - d0 / 1.2, 0, 1) * Wn * (0.04 + 0.04 * nn)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['aq_floor'] = plan_aq_floor


def aq_floor_things(bpy, NF, M, rng):
    inside = lambda r_: (12.0 * r_.randint(5) + r_.uniform(1.4, 10.6), 12.0 * r_.randint(5) + r_.uniform(1.4, 10.6))   # (inside a tile)
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, inside, 50)


TG.GARAGE_THINGS['aq_floor'] = aq_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
HALL_AT = dict(tank=(8.0, 40.6), column=(24.0, 46.0), rockwork=(40.0, 46.0), benches=(7.0, 24.0), kiosk=(19.0, 24.0), panel=(31.0, 24.0))
TUN_AT = dict(tunnel=(8.0, 40.0), wall_ew=(28.0, 46.0), wall_ns=(57.5, 28.0))
WALL_H = 3.8
TANK_H = 2.2


def fish(P, x, y, z, a, L, mat='aq_fish'):
    ca, sa = math.cos(a), math.sin(a)
    q = [(-L / 2, 0.0), (-L * 0.2, -L * 0.2), (L * 0.3, -L * 0.16), (L / 2, 0.0), (L * 0.3, L * 0.16), (-L * 0.2, L * 0.2)]
    P.poly(mat, [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in q], z, z + 0.03)
    t = [(-L / 2, 0.0), (-L * 0.75, -L * 0.18), (-L * 0.75, L * 0.18)]
    P.poly(mat, [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in t], z, z + 0.02)


def tank(P, ox, oy, rng):
    """a tank a house wide, its water gone green and still: the acrylic front and sides in steel frames, the water's top with its scum and
    the dead fish floating, a rock in it breaking the surface, the rim; tile-filling, so a block of Q is a bank of tanks"""
    x0, x1, y0, y1 = ox - 6.0, ox + 6.0, oy - 0.6, oy + 11.4 - TANK_H * 1.45   # its top ends on its house's north line (rule 480(c): a picture no taller than it shows)
    P.box('aq_water', x0, x1, y0, y1, 0.0, TANK_H - 0.15)
    P.box('aq_glass', x0, x1, y0 - 0.02, y0, 0.25, TANK_H - 0.05)                                               # the front, streaked
    for x in np.arange(x0 + 0.3, x1, 0.45):
        if rng.rand() < 0.6: z1 = rng.uniform(0.6, TANK_H - 0.2); P.box('aq_algae', x, x + rng.uniform(0.05, 0.2), y0 - 0.025, y0 - 0.02, 0.25, z1)
    for x in (x0, x0 + 4.0, x0 + 8.0, x1 - 0.1): P.box('aq_frame', x, x + 0.1, y0 - 0.05, y0 + 0.05, 0.0, TANK_H)  # the frames
    P.box('aq_frame', x0, x1, y0 - 0.05, y0 + 0.1, 0.0, 0.25); P.box('aq_frame', x0, x1, y0 - 0.05, y0 + 0.15, TANK_H - 0.05, TANK_H + 0.05)
    P.box('aq_frame', x0, x0 + 0.15, y0, y1, TANK_H - 0.05, TANK_H + 0.05); P.box('aq_frame', x1 - 0.15, x1, y0, y1, TANK_H - 0.05, TANK_H + 0.05)
    zs = TANK_H - 0.15
    for _ in range(5):                                                                                     # the scum, in mats
        cx, cy = ox + rng.uniform(-5.0, 5.0), oy + rng.uniform(0.2, 7.2); n = 9
        pts = [(cx + rng.uniform(0.4, 1.3) * math.cos(6.2832 * i / n), cy + rng.uniform(0.3, 1.0) * math.sin(6.2832 * i / n)) for i in range(n)]
        pts = [(min(x1 - 0.2, max(x0 + 0.2, u)), min(y1 - 0.2, max(y0 + 0.2, v))) for (u, v) in pts]
        P.poly(('aq_scum', 'aq_scum_d')[rng.randint(2)], pts, zs, zs + 0.01)
    for _ in range(20): fish(P, ox + rng.uniform(-5.5, 5.5), oy + rng.uniform(-0.2, 7.6), zs + 0.01, rng.uniform(0, 6.28), rng.uniform(0.25, 0.7))
    for (cx, cy, rx, ry) in ((ox - 2.5, oy + 5.0, 1.6, 1.1), (ox + 3.2, oy + 2.4, 1.2, 0.9)):               # rock breaking the surface
        for k in range(3):
            s_ = 1.0 - k * 0.28; n = 9
            P.poly('aq_rock', [(cx + rx * s_ * rng.uniform(0.8, 1.1) * math.cos(6.2832 * i / n), cy + ry * s_ * rng.uniform(0.8, 1.1) * math.sin(6.2832 * i / n)) for i in range(n)],
                   zs - 0.2 + k * 0.18, zs + k * 0.18 + 0.02)
    P.bar('aq_frame', (x1 - 0.6, oy + 2.0, zs), (x1 - 0.6, oy + 2.0, TANK_H + 0.6), 0.05); P.bar('aq_frame', (x1 - 0.6, oy + 2.0, TANK_H + 0.6), (x1 - 0.1, oy + 2.0, TANK_H + 0.6), 0.05)   # the overflow


def column(P, ox, oy, rng):
    """a jellyfish column floor to ceiling, empty and gone cloudy: its black plinth, its cap, the dead ring light; two smaller ones beside it"""
    for (dx, dy, r, h) in ((0.0, 1.8, 1.1, 4.2), (-3.0, 1.2, 0.6, 3.4), (3.0, 1.0, 0.65, 3.6)):
        x, y = ox + dx, oy + dy
        P.drum('aq_black', x, y, 0.0, 0.55, r + 0.25, 24); P.drum('aq_ring', x, y, 0.55, 0.6, r + 0.1, 24)
        P.drum('aq_cyl', x, y, 0.6, h, r, 24); P.drum('aq_cyl_d', x, y, h - 0.6, h, r + 0.01, 24)
        P.drum('aq_black', x, y, h, h + 0.35, r + 0.2, 24)
        for k in range(rng.randint(1, 3)): z = rng.uniform(1.0, h - 1.0); P.drum('aq_fish', x + rng.uniform(-0.2, 0.2), y - r * 0.5, z, z + 0.05, 0.12, 8)   # what is left in it
    P.box('aq_bench', ox - 1.6, ox + 1.6, oy - 0.6, oy - 0.1, 0.0, 0.45)


def rock(P, cx, cy, rx, ry, h, rng, mat='aq_rock'):
    n = 11; layers = max(3, int(h / 0.3))
    rad = [rng.uniform(0.75, 1.15) for _ in range(n)]
    for k in range(layers):
        t = k / layers; s_ = (1.0 - t) ** 0.7; z0 = t * h; z1 = (k + 1) / layers * h
        P.poly(mat if (k % 3 or mat != 'aq_rock') else 'aq_rock_d', [(cx + rx * s_ * rad[i] * rng.uniform(0.92, 1.05) * math.cos(6.2832 * i / n), cy + ry * s_ * rad[i] * rng.uniform(0.92, 1.05) * math.sin(6.2832 * i / n)) for i in range(n)], z0, z1)


def rockwork(P, ox, oy, rng):
    """the themed rockwork round the tanks, fake stone over steel: three mounds, painted coral on them gone grey, one broken open to its mesh"""
    for (dx, dy, rx, ry, h) in ((-3.2, 1.6, 2.2, 1.4, 2.2), (0.6, 2.2, 1.8, 1.6, 2.8), (3.6, 1.2, 1.9, 1.2, 1.6), (-0.8, 0.2, 1.2, 0.7, 0.9)):
        rock(P, ox + dx, oy + dy, rx, ry, h, rng)
    for _ in range(16):                                                                                    # the painted coral
        u, v = ox + rng.uniform(-4.5, 4.8), oy + rng.uniform(0.6, 3.4); z = rng.uniform(0.6, 1.8)
        m = ('aq_coral_r', 'aq_coral_y', 'aq_coral_r', 'aq_rock_d')[rng.randint(4)]
        for k in range(3): a = rng.uniform(0, 6.28); P.bar(m, (u, v, z), (u + 0.35 * math.cos(a), v + 0.2 * math.sin(a), z + rng.uniform(0.2, 0.5)), 0.05)
    x0, y0 = ox + 1.8, oy + 0.6                                                                           # broken open: the mesh and its steel
    for k in range(7): P.bar('aq_rebar', (x0 + k * 0.18, y0, 0.0), (x0 + k * 0.18, y0 + 0.3, 1.4), 0.015)
    for k in range(6): P.bar('aq_rebar', (x0, y0 + 0.05 * k, 0.2 + k * 0.22), (x0 + 1.1, y0 + 0.05 * k, 0.2 + k * 0.22), 0.012)
    for _ in range(14): u, v = ox + rng.uniform(-4.0, 4.8), oy + rng.uniform(-0.9, 0.3); P.poly('aq_rock_d', [(u, v), (u + 0.25, v + 0.05), (u + 0.2, v + 0.22), (u - 0.02, v + 0.18)], 0.0, rng.uniform(0.08, 0.2))


def panel(P, ox, oy, rng):
    """a tank's acrylic panel, fallen and propped against what it hit: one leaning, one flat, one stood on its edge in its brace; the frame
    it came out of"""
    t = 0.22
    P.prism_x('aq_acryl', ox - 3.8, ox - 0.2, [(oy + 0.2, 0.0), (oy + 0.2 + t, 0.0), (oy + 1.4 + t, 2.4), (oy + 1.4, 2.4)])
    P.prism_x('aq_acryl_e', ox - 3.8, ox - 0.2, [(oy + 0.2, 0.0), (oy + 0.24, 0.0), (oy + 1.44, 2.4), (oy + 1.4, 2.4)])
    P.box('aq_frame', ox - 3.9, ox - 0.1, oy + 1.5, oy + 2.0, 0.0, 1.0)                                         # what it leans on
    P.poly('aq_acryl', [(ox + 0.4, oy - 0.6), (ox + 3.8, oy - 0.4), (ox + 3.7, oy + 1.6), (ox + 0.3, oy + 1.4)], 0.0, t)
    for k in range(5): a, b = rng.uniform(0.5, 3.5), rng.uniform(0.5, 3.5); P.bar('aq_acryl_e', (ox + a, oy - 0.4, t + 0.005), (ox + b, oy + 1.3, t + 0.005), 0.008)   # scratches
    P.box('aq_acryl', ox + 0.6, ox + 3.6, oy + 2.2, oy + 2.2 + t, 0.0, 1.9); P.box('aq_frame', ox + 0.4, ox + 3.8, oy + 2.1, oy + 2.6, 0.0, 0.2)
    for x in (ox + 0.8, ox + 3.4): P.prism_x('aq_frame', x - 0.05, x + 0.05, [(oy + 2.4, 0.0), (oy + 3.2, 0.0), (oy + 2.45, 1.5)])
    P.box('aq_frame', ox - 4.0, ox - 2.8, oy - 0.8, oy - 0.65, 0.0, 0.15)


def benches(P, ox, oy, rng):
    """the viewing benches facing the glass, black vinyl, three in a row and one tipped on its back; a stroller left; cups and a map"""
    for k, x0 in enumerate((ox - 4.2, ox - 1.2, ox + 1.8)):
        if k == 1:
            P.box('aq_bench', x0, x0 + 2.6, oy + 0.6, oy + 1.05, 0.0, 0.62); P.box('aq_black', x0 + 0.2, x0 + 2.4, oy + 1.05, oy + 1.5, 0.0, 0.12)
            continue
        P.box('aq_black', x0 + 0.2, x0 + 2.4, oy + 0.7, oy + 1.3, 0.0, 0.3); P.box('aq_bench', x0, x0 + 2.6, oy + 0.55, oy + 1.45, 0.3, 0.48)
        for i in range(3): P.box('aq_black', x0 + 0.05 + i * 0.86, x0 + 0.07 + i * 0.86, oy + 0.55, oy + 1.45, 0.47, 0.485)
    P.box('aq_bench', ox - 4.0, ox - 1.4, oy + 2.0, oy + 2.9, 0.3, 0.48); P.box('aq_black', ox - 3.8, ox - 1.6, oy + 2.1, oy + 2.8, 0.0, 0.3)
    x, y = ox + 3.2, oy + 2.0                                                                              # a stroller
    for (u, v) in ((x, y), (x + 0.7, y), (x, y + 0.5), (x + 0.7, y + 0.5)): P.wheel('black', u, v, 0.1, 0.1, 0.04, 10)
    P.box('aq_stroller', x - 0.05, x + 0.75, y - 0.05, y + 0.55, 0.3, 0.6); P.prism_x('aq_stroller', x - 0.05, x + 0.75, [(y + 0.35, 0.6), (y + 0.55, 0.6), (y + 0.55, 1.0)])
    for _ in range(12): u, v = ox + rng.uniform(-4.4, 4.4), oy + rng.uniform(-0.8, 0.4); P.drum(('white', 'paper', 'aq_coral_r')[rng.randint(3)], u, v, 0.0, 0.1, 0.05, 8)


def kiosk(P, ox, oy, rng):
    """dead info kiosks, their screens black; a map board on its legs; the donation box, emptied; the queue's posts and belts knocked down;
    a trash can; the brochures"""
    for (x0, y0) in ((ox - 1.0, oy + 0.7), (ox - 3.6, oy + 1.6)):
        P.box('aq_kiosk', x0, x0 + 0.9, y0, y0 + 0.55, 0.0, 1.75); P.prism_x('black', x0 + 0.05, x0 + 0.85, [(y0 - 0.04, 1.0), (y0, 1.0), (y0 + 0.1, 1.65), (y0 + 0.06, 1.65)])
        P.box('aq_coral_t', x0, x0 + 0.9, y0 - 0.01, y0, 0.2, 0.9)
    P.box('aq_kiosk', ox + 0.6, ox + 3.4, oy + 1.5, oy + 1.62, 0.8, 2.4); P.box('aq_map', ox + 0.7, ox + 3.3, oy + 1.49, oy + 1.5, 0.9, 2.3)
    for x in (ox + 0.7, ox + 3.3): P.box('aq_frame', x - 0.05, x + 0.05, oy + 1.5, oy + 1.62, 0.0, 0.8)
    P.box('aq_acryl', ox + 1.2, ox + 1.9, oy + 0.3, oy + 0.9, 0.0, 1.1); P.box('aq_frame', ox + 1.15, ox + 1.95, oy + 0.25, oy + 0.95, 1.1, 1.15)   # the donation box, empty
    for k in range(7):                                                                                     # the queue posts, some down
        x, y = ox - 4.2 + k * 1.2, oy - 0.4 + 0.3 * (k % 2)
        if k % 3 == 1: P.bar('chrome', (x, y, 0.06), (x + 0.9, y + 0.2, 0.06), 0.035); P.drum('aq_black', x, y, 0.0, 0.05, 0.18, 12); continue
        P.drum('aq_black', x, y, 0.0, 0.05, 0.18, 12); P.drum('chrome', x, y, 0.05, 1.0, 0.035, 8)
        if k < 6: P.bar('aq_belt', (x, y, 0.92), (x + 1.2, oy - 0.4 + 0.3 * ((k + 1) % 2), 0.92 if k % 2 else 0.02), 0.03)
    P.drum('aq_kiosk', ox + 3.8, oy + 0.6, 0.0, 0.9, 0.3, 14); P.drum('black', ox + 3.8, oy + 0.6, 0.9, 0.92, 0.27, 14)
    for _ in range(26): u, v = ox + rng.uniform(-4.4, 4.2), oy + rng.uniform(-1.2, 0.6); a = rng.uniform(0, 3.14); P.poly(('paper', 'aq_map', 'paper')[rng.randint(3)], [(u, v), (u + 0.2 * math.cos(a), v + 0.2 * math.sin(a)), (u + 0.2 * math.cos(a) - 0.1 * math.sin(a), v + 0.2 * math.sin(a) + 0.1 * math.cos(a)), (u - 0.1 * math.sin(a), v + 0.1 * math.cos(a))], 0.0, 0.006)


def tunnel(P, ox, oy, rng):
    """the glass tunnel through the big tank, a tile long so UUU is one tunnel: the dead walkway's belt between its low rails, the acrylic
    arch's ribs over it, the tank's floor of sand and rock on both sides under the green, a dead fish on the sand"""
    yc = oy + 4.8; hw = 1.8
    for (ya, yb) in ((oy - 1.2, yc - hw - 0.2), (yc + hw + 0.2, oy + 10.8)):                                  # the tank's floor both sides
        P.box('aq_sand', ox - 6.0, ox + 6.0, ya, yb, 0.0, 0.35)
        for _ in range(7):
            cx, cy = ox + rng.uniform(-5.4, 5.4), rng.uniform(ya + 0.5, yb - 0.5); rock(P, cx, cy, rng.uniform(0.4, 1.0), rng.uniform(0.3, 0.6), rng.uniform(1.0, 1.6), rng, 'aq_rock_w')
        P.box('aq_water', ox - 6.0, ox + 6.0, ya, yb, 0.35, 0.9)                                               # the green water round the tunnel
        for _ in range(3):
            cx, cy = ox + rng.uniform(-5.0, 5.0), rng.uniform(ya + 0.6, yb - 0.6); n = 9
            P.poly('aq_scum', [(cx + rng.uniform(0.3, 0.9) * math.cos(6.2832 * i / n), cy + rng.uniform(0.2, 0.5) * math.sin(6.2832 * i / n)) for i in range(n)], 0.9, 0.91)
        for _ in range(6): fish(P, ox + rng.uniform(-5.5, 5.5), rng.uniform(ya + 0.3, yb - 0.3), 0.91, rng.uniform(0, 6.28), rng.uniform(0.4, 1.4))
    P.box('aq_frame', ox - 6.0, ox + 6.0, yc - hw - 0.2, yc + hw + 0.2, 0.0, 0.08)
    P.box('black', ox - 6.0, ox + 6.0, yc - 0.6, yc + 0.6, 0.08, 0.14)                                         # the walkway's belt, stopped
    for x in np.arange(ox - 5.9, ox + 6.0, 0.4): P.box('aq_frame', x, x + 0.03, yc - 0.6, yc + 0.6, 0.14, 0.145)
    for s in (-1, 1):
        y = yc + s * 0.85; P.box('aq_frame', ox - 6.0, ox + 6.0, y - 0.12, y + 0.12, 0.08, 0.95); P.box('chrome', ox - 6.0, ox + 6.0, y - 0.06, y + 0.06, 0.95, 1.0)
    for x in np.arange(ox - 5.4, ox + 6.0, 1.8):                                                           # the arch's ribs
        pts = [(yc + hw * math.cos(math.pi * k / 10), 0.08 + 2.7 * math.sin(math.pi * k / 10)) for k in range(11)]
        for a, b in zip(pts, pts[1:]): P.bar('aq_frame', (x, a[0], a[1]), (x, b[0], b[1]), 0.05)
    for k in (2, 8):                                                                                       # the arch's long seams
        y = yc + hw * math.cos(math.pi * k / 10); z = 0.08 + 2.7 * math.sin(math.pi * k / 10); P.bar('aq_acryl_e', (ox - 6.0, y, z), (ox + 6.0, y, z), 0.03)


def wall_ew(P, ox, oy, rng):
    """the building's wall, a tile long, painted black; a teal band at eye height, a dead exit sign, a cap"""
    P.box('nb_wall', ox - 6.0, ox + 6.0, oy, oy + 0.3, 0.0, WALL_H)
    for k in range(1, 19): z = k * 0.2; P.box('nb_wall_j', ox - 6.0, ox + 6.0, oy - 0.004, oy, z - 0.006, z + 0.006)
    P.box('aq_coral_t', ox - 6.0, ox + 6.0, oy - 0.006, oy, 1.5, 1.62)
    P.box('aq_exit', ox + 1.4, ox + 2.2, oy - 0.12, oy, 2.7, 3.0)
    P.box('pd_cap', ox - 6.0, ox + 6.0, oy - 0.02, oy + 0.32, WALL_H, WALL_H + 0.05)
    for _ in range(10): u, z = ox + rng.uniform(-5.8, 5.6), rng.uniform(0.1, 3.2); P.box('nb_wall_s', u, u + rng.uniform(0.2, 0.9), oy - 0.006, oy - 0.004, z, z + rng.uniform(0.05, 0.4))


def wall_ns(P, ox, oy, rng):
    P.box('nb_wall', ox - 0.15, ox + 0.15, oy, oy + 12.0, 0.0, WALL_H); P.box('pd_cap', ox - 0.17, ox + 0.17, oy, oy + 12.0, WALL_H, WALL_H + 0.05)
    P.box('aq_coral_t', ox - 0.16, ox + 0.16, oy, oy + 12.0, 1.5, 1.62)


HALL_F = dict(tank=tank, column=column, rockwork=rockwork, benches=benches, kiosk=kiosk, panel=panel)
TUN_F = dict(tunnel=tunnel, wall_ew=wall_ew, wall_ns=wall_ns)


def aq_hall_parts(P, rng):
    for k, f in HALL_F.items(): f(P, *HALL_AT[k], rng)


def aq_tun_parts(P, rng):
    for k, f in TUN_F.items(): f(P, *TUN_AT[k], rng)


def aq_mats(bpy, NF, F, M, which):
    if which not in ('aq_halls', 'aq_tunnel', 'tun_pieces'): return
    if which in ('aq_halls', 'aq_tunnel'): NB.nb_mats(bpy, NF, F, M, 'nb_shop')
    m = lambda n, role, step, mul: NF.material(bpy, n, role, step, mul)
    M.update(aq_water=m('in_tank_water_green', 'clay_teal', 2, 0.9), aq_glass=m('in_tank_glass_green', 'clay_teal', 1, 1.0), aq_algae=m('in_tank_algae', 'clay_mustard', 0, 1.0),
             aq_frame=m('in_tank_frame', 'tape_grey', 1, 0.95), aq_scum=m('in_tank_scum', 'clay_mustard', 1, 0.95), aq_scum_d=m('in_tank_scum_dark', 'tape_masking', 1, 1.0),
             aq_fish=m('in_fish_dead', 'clay_bone', 3, 0.9), aq_fish_d=m('in_fish_dead_dark', 'tape_grey', 2, 0.9), aq_rock=m('in_rockwork', 'tape_masking', 2, 0.9),
             aq_rock_d=m('in_rockwork_dark', 'tape_masking', 1, 1.0), aq_black=m('in_paint_black_satin', 'rubber', 2, 1.0), aq_ring=m('in_ring_light_dead', 'tape_grey', 4, 0.85),
             aq_cyl=m('in_column_cloudy', 'clay_teal', 2, 0.92), aq_cyl_d=m('in_column_cloudy_dark', 'clay_teal', 1, 1.0), aq_coral_r=m('in_coral_paint_red', 'clay_rust', 2, 0.92),
             aq_coral_y=m('in_coral_paint_yellow', 'clay_mustard', 2, 0.92), aq_coral_t=m('in_paint_band_teal', 'clay_teal', 3, 0.9), aq_rebar=m('in_rebar_rust', 'clay_rust', 1, 1.0),
             aq_acryl=m('in_acrylic_panel', 'clay_teal', 3, 0.86), aq_acryl_e=m('in_acrylic_edge', 'clay_teal', 4, 0.82), aq_bench=m('in_vinyl_bench_black', 'rubber', 3, 1.0),
             aq_stroller=m('in_stroller_teal', 'clay_teal', 2, 0.95), aq_kiosk=m('in_kiosk_grey', 'tape_grey', 2, 0.92), aq_map=m('in_map_board', 'clay_bone', 3, 0.9),
             aq_belt=m('in_queue_belt', 'clay_rust', 1, 1.0), aq_sand=m('in_tank_floor_under_green', 'clay_teal', 1, 1.0), aq_rock_w=m('in_tank_rock_under_green', 'clay_teal', 0, 1.0), aq_exit=m('in_exit_sign_dead', 'clay_rust', 2, 0.95),
             aq_deck=m('in_ceil_black_deck', 'rubber', 2, 1.0), aq_deck_r=m('in_ceil_black_rib', 'rubber', 3, 1.0), aq_steel=m('in_ceil_joist_black', 'tape_grey', 1, 1.0),
             aq_duct=m('in_duct_galv', 'tape_grey', 3, 0.85), aq_spot=m('in_spot_can', 'rubber', 2, 1.0))


TG.PARTS['aq_halls'] = aq_hall_parts
TG.PARTS['aq_tunnel'] = aq_tun_parts
TG.MAT_HOOKS.append(aq_mats)


# ---- the ceiling: the halls' black ceiling, its ducts and dead spotlights -------------------------------------------------------
def ceil_aquarium(P, rng):
    """the black ceiling from under it: the deck and its ribs, the girders on every bay's line, joists every 2 m, a galvanized round duct
    down every bay, a track of dead spotlights in every bay"""
    at = TG.at
    P.box('aq_deck', -3.0, 63.0, -3.0, 63.0, 0.0, 0.04)
    for r in range(-1, 6):
        for k in range(0, 40, 2): y = at(0, r, 0, k * 0.3)[1]; P.box('aq_deck_r', -3.0, 63.0, y - 0.04, y, 0.04, 0.045)
        y0, y1 = TG.band_y(r, 0.0, 0.5, 0.9); P.box('aq_steel', -3.0, 63.0, y0, y1, 0.04, 0.94)
        for c in range(-1, 6):
            for k in range(1, 6):
                x = c * TMT + k * 2.0 + 1.0
                ya, yb = at(c, r, x - c * TMT, 0.4, 0.3)[1], at(c, r, x - c * TMT, 11.6, 0.3)[1]; P.box('aq_steel', x - 0.07, x + 0.07, yb, ya, 0.04, 0.3)
        _, y = at(0, r, 0, 4.5, 1.0); P.tube_x('aq_duct', -3.0, 63.0, y, 1.0, 0.38, 16)                        # the duct
        for c in range(-1, 6): x = c * TMT + 3.0; P.box('aq_steel', x - 0.06, x + 0.06, y - 0.42, y + 0.42, 1.36, 1.42)
    for r in range(5):
        for c in range(5):
            xa, ya = at(c, r, 2.0, 8.5, 0.7); xb, _ = at(c, r, 10.0, 8.5, 0.7); P.box('aq_steel', xa, xb, ya - 0.05, ya + 0.05, 0.6, 0.7)   # the track
            for k in range(4):
                x, y = at(c, r, 3.0 + k * 2.0, 8.5, 1.0); P.drum('aq_spot', x, y, 0.7, 1.0, 0.13, 12); P.drum('white', x, y, 1.0, 1.01, 0.09, 12)
            if rng.rand() < 0.5:
                x, y = at(c, r, rng.uniform(2.0, 9.0), rng.uniform(1.5, 3.0), 1.4); P.bar('aq_spot', (x, y, 0.7), (x + 0.3, y - 0.4, 1.6), 0.03)   # one hanging by its wire


TG.CEILINGS['aquarium'] = (ceil_aquarium, 'aquarium/aquarium_ceiling.webp', "the halls' black ceiling from under it: the deck and its ribs, the girders, the joists, a galvanized duct down every bay, a track of dead spotlights in every bay")
TG.CEIL_DATA['aquarium'] = 'aquarium/aquarium.json'

# ---- the cut (the inside kit's) --------------------------------------------------------------------------------------------------
KIND = dict(tank='COVER', column='COVER', rockwork='COVER', panel='COVER', benches='LOW_COVER', kiosk='LOW_COVER', tunnel='LOW_COVER', wall_ew='WALL', wall_ns='WALL')
HM = dict(tank=TANK_H + 0.6, column=4.55, rockwork=2.8, panel=2.4, benches=1.0, kiosk=2.4, tunnel=2.8, wall_ew=WALL_H + 0.05, wall_ns=WALL_H + 0.05)
NAME = dict(tank='A TANK', column='A JELLYFISH COLUMN', rockwork='FAKE ROCKWORK', panel='A FALLEN PANEL', benches='VIEWING BENCHES', kiosk='A DEAD KIOSK',
            tunnel='THE GLASS TUNNEL', wall_ew="THE BUILDING'S WALL", wall_ns="THE BUILDING'S WALL")
BOX = dict(tank=(-6.0, 6.01, -0.7, 11.4 + 0.15), column=(-4.0, 4.0, -0.8, 2.9 + 4.7 * 1.45), rockwork=(-5.4, 5.6, -1.0, 3.8 + 2.9 * 1.45),
           panel=(-4.2, 4.2, -0.9, 3.3 + 2.5 * 1.45), benches=(-4.6, 4.6, -1.0, 2.9 + 1.1 * 1.45), kiosk=(-4.6, 4.4, -1.4, 2.2 + 2.5 * 1.45),
           tunnel=(-6.0, 6.01, -1.25, 12.3), wall_ew=(-6.0, 6.01, -0.3, 0.4 + (WALL_H + 0.1) * 1.45), wall_ns=(-0.6, 0.6, -0.05, 12.1 + (WALL_H + 0.1) * 1.45))
SHADOW = dict(wall_ns=0.5, tank=0.6, tunnel=0.5)

K = KIT.make(TG, kit='aquarium', prefix='aq_', floor_render='aq_floor', floor_lists=[('floor', ROWS), ('ring', ROWS)],
             scenes=[('aq_halls', HALL_AT), ('aq_tunnel', TUN_AT)], box=BOX, kind=KIND, hm=HM, name=NAME, shadow=SHADOW,
             art_for="COMBAT FOUR's aquarium (slices/fight_ground/aquarium/aquarium.json): the names its handoff asked for, the garage's format. floor.floor and floor.ring are the halls' dark carpet (the library's 50 cm carpet tile, lb_carpet), a wave woven into it the same in every tile so it runs on, and the tide marks where the tanks wept into it, inside each tile.",
             date='11_28',
             how_it_lays={'the reef halls': "aq_tank fills its house and stands 2.2 m, its top ending on the house's north line, so a block of Q is a bank of tanks of green water, each with its glass front; aq_column is a big jellyfish column and two small ones.",
                          'the shark tunnel': "aq_tunnel is the glass tunnel a tile long, east to west, its ribs over the dead walkway, so UUU is one tunnel through the tank's column of Q."},
             sheet_name='THE_AQUARIUM', card_id='cook7-the-aquarium-11-28', heading='THE AQUARIUM, BEFORE AND NOW',
             sub='on his phone, 390 x 844, as the fight opens in the reef halls: before (every piece a stand-in), now, and now with the ceiling at his 10%',
             off_label='NOW, THE CEILING OFF', meets_label='NOW, AS HE MEETS IT: THE CEILING AT 10%', close_title='CLOSE IN, AND THE SHARK TUNNEL',
             close_sub='the tanks gone green and the rockwork; the shark tunnel through the big tank',
             closes=[('THE TANKS', 'tanks'), ('THE COLUMNS', 'columns')], other=('THE SHARK TUNNEL', 'tun'), pieces_title='THE PIECES AT THEIR OWN PIXELS',
             pieces_sub='a tank, a jellyfish column, the rockwork, a fallen panel, benches, a kiosk; the glass tunnel; the black wall',
             rows=[(('tank', 'tunnel'), 270), (('column', 'rockwork', 'panel'), 170), (('benches', 'kiosk', 'wall_ew'), 130)],
             floor_title="THE HALLS' CARPET AND THE CEILING AT FULL STRENGTH", floor_sub='the woven wave, the tide marks; the black deck, the ducts, the dead spotlights')


def cut(): KIT.cut(K)


def sheet(before_dir, page_dir): KIT.sheet(K, before_dir, page_dir)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'aq_floor' else TG.scene_pieces(n, '--quick' in a) if n in ('aq_halls', 'aq_tunnel') else TG.scene_ceiling('aquarium', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
