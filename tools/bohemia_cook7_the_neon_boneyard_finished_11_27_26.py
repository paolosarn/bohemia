#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the neon boneyard, finished] (11/27/26; COMBAT FOUR's neon boneyard asked 'FOR COOK (SIX)'; VAMILY rule 480(b):
finished art where a stand-in still stands; rule 482; rule 495(b): this tool says only what is its own, the cut and the sheet are the inside
kit's; rules 461, 441, 416, 451(a)).

COMBAT FOUR's neon boneyard (THE NEON BONEYARD, slices/fight_ground/boneyard/boneyard.json, laid by slices/bohemia_big_inside.js): its sign shop
(giant letters from a dead casino's name, racks of sign faces, a sign face on sawhorses, tube glass, the glass benders' benches, sign cans,
transformers, a scissor lift, crates of bulbs) or its dark gallery (dead signs stood on end like headstones, a fallen arrow, bulb rails, the
projectors that still play the old show onto them). All 15 of its pieces were stand-ins and its roof was drawn by the page. These are the
pictures under its names, through the master rig, ON this lane's fire station tool:

  THE FLOOR        boneyard_floor_0.webp (floor.floor, floor.ring): the hall's sealed slab with paint spilled on it in every color a sign ever was
                   (rust, mustard, white, teal: pools, drips, a roller's track, footprints), and the glitter of tube glass, every mark inside its tile.
  THE PIECES       nb_letters (three giant channel letters stood in a row and two taller behind, C A S and N O, the I missing, their sockets
                   empty), nb_signs (dead signs stood on end like headstones: a tall blade, a round-topped panel, a shield, two more behind, their
                   dead tubes still on their faces), nb_faces (two A-frame racks of sign faces a tile long, faces leaning both sides floor to
                   ceiling), nb_sawhorses (a sign face as long as a bus laid flat on sawhorses for paint it never got, its letters masked and
                   half painted, a tile long so a run is one face), nb_tubes (racks of new tube glass, a box of it, glass broken around), nb_bench
                   (two glass benders' benches, the burners cold, a half bent tube in the clamp, the pattern paper, gas cylinders, the
                   bombarder), nb_cans (sign cans set down on their sides, their letter mounts), nb_transformers (heaps of sign transformers, coiled
                   cable), nb_arrow (a sign's arrow lying on the floor, still pointing, its sockets empty), nb_bulbs (a marquee's bulb rails in a
                   pile, the bulbs rolled out), nb_lift (a scissor lift folded down, its charger, a pallet of sign parts), nb_crates (crates of
                   bulbs, every one still wrapped), nb_projector (a projector on its tall stand and one on a road case, the generator, the
                   cables), nb_wall_ew/_ns (the museum's block painted black, a dead tube run along it).
  THE CEILING      boneyard_ceiling.webp (rule 451(a), 'joist'): the truck stop's steel roof, and in every bay a dead neon tube loop hanging
                   from it.

  /tmp/v/bin/python tools/bohemia_cook7_the_neon_boneyard_finished_11_27_26.py render nb_floor | nb_shop | nb_gallery | ceil_boneyard
  python3 tools/bohemia_cook7_the_neon_boneyard_finished_11_27_26.py cut | sheet <before_dir> <page_dir>

REFERENCE CHECK: the Neon Museum's boneyard and its North Gallery on Las Vegas Blvd North (the city's dead signs kept since 1996: channel letters
taller than a man with their bulb sockets, signs stood on end in rows, arrows, marquee bulb rails, sign cans; the North Gallery's dead signs in the
dark with the old light projected back onto them) and the valley's sign shops (neon benders' benches with ribbon burners and crossfires, racks of
new tube glass, the bombarder, sign transformers, sign faces painted flat on sawhorses, scissor lifts). The twins: this lane's fire station (the
roof) and truck stop (the steel) kits.
ANALOG HORROR: the projector still plays the same loop onto letters nobody has lit in years; the name spelled across the floor with a letter
missing.
No reference game. No purple: the dead tubes are rust, mustard, teal and white (PURPLE RESERVATION).
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook7_inside_kit as KIT                            # this lane's: the cut, the sheet, the ceiling's hand-off, once (rule 495(b))
import bohemia_cook7_the_fire_station_finished_11_27_26 as FH     # this lane's: the fire station (and the chain under it)

LB = FH.LB; TS = FH.TS; TG = FH.TG; FW = FH.FW; HS = FH.HS
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
tile_xy = HS.tile_xy
seg_d = TS.seg_d

# ---- the ground: the hall's slab, paint spilled in every color a sign ever was ------------------------------------------------
TG.GROUNDS['nb_teal'] = dict(role=('clay_teal', 2), target=(76, 112, 104), h=0.0, alt=('clay_teal', 1), alt_amt=0.25, grit=0.1, speck=(45, 0.14),
                             wornthrough=dict(scale=3.0, cut=0.38, to=('tape_grey', 2)))
TG.CAL0['nb_teal'] = 0.6                                           # the garage's paints' measured 0.55 to 0.6 (the same make of ground)
TG.WEAR['nb_teal'] = 0.08


def plan_nb_floor(ID, seed=331):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['hall_slab'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    dark = 0.14 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.08; pale = np.zeros((H, W), np.float32)
    PAINT = [ID['tun_spray'], ID['gar_yellow'], ID['gar_white'], ID['nb_teal']]
    for r in range(5):
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; G, D, Pl = gid[sy, sx], dark[sy, sx], pale[sy, sx]
            Wn = TG.win(X, Y, 0.9, 0.6); nn = FW.vnoise(X.shape, 0.6 * PPM, rng); n2 = FW.vnoise(X.shape, 0.25 * PPM, rng)
            for _ in range(rng.randint(2, 4)):                                                              # a pool where a can went over
                cx, cy = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5); rad = rng.uniform(0.35, 0.9); g = PAINT[rng.randint(4)]
                d0 = np.hypot(X - cx, (Y - cy) * rng.uniform(0.8, 1.4)) / rad * (0.75 + 0.5 * nn)
                G[(d0 < 1.0) & (Wn > 0.5)] = g
                for _k in range(rng.randint(4, 9)):                                                         # its splashes
                    a = rng.uniform(0, 6.28); dd = rad * rng.uniform(1.2, 2.2); sr = rng.uniform(0.04, 0.12)
                    G[(np.hypot(X - cx - dd * math.cos(a), Y - cy - dd * math.sin(a)) < sr) & (Wn > 0.5)] = g
            for _ in range(rng.randint(1, 3)):                                                              # a drip trail from a brush or a can
                g = PAINT[rng.randint(4)]; x0, y0 = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5); a = rng.uniform(0, 6.28)
                for k in range(rng.randint(8, 18)):
                    a += rng.normal(0, 0.25); x0 += 0.22 * math.cos(a); y0 += 0.22 * math.sin(a)
                    G[(np.hypot(X - x0, Y - y0) < rng.uniform(0.03, 0.07)) & (Wn > 0.5)] = g
            if rng.rand() < 0.5:                                                                            # a roller's track, short
                g = PAINT[rng.randint(4)]; x0, y0 = rng.uniform(3, 6), rng.uniform(3, 9); L = rng.uniform(1.5, 3.0)
                m = (X > x0) & (X < x0 + L) & (np.abs(Y - y0) < 0.11) & (n2 > 0.32) & (Wn > 0.5); G[m] = g
            if rng.rand() < 0.6:                                                                            # footprints out of a pool
                g = PAINT[rng.randint(4)]; x0, y0 = rng.uniform(3, 6), rng.uniform(3, 6); a = rng.uniform(0, 6.28)
                for k in range(6):
                    s_ = 0.13 * (1 if k % 2 else -1); px = x0 + k * 0.6 * math.cos(a) - s_ * math.sin(a); py = y0 + k * 0.6 * math.sin(a) + s_ * math.cos(a)
                    if k > 3 and rng.rand() < 0.5: continue
                    G[(np.hypot((X - px) / 1.0, (Y - py) / 1.0) < 0.1) & (Wn > 0.5)] = g
            for _ in range(rng.randint(60, 120)):                                                           # tube glass ground into it
                cx, cy = rng.uniform(1.0, 11.0), rng.uniform(1.0, 11.0)
                Pl[np.hypot(X - cx, Y - cy) < rng.uniform(0.015, 0.04)] = 0.55
            D[:] += np.clip(1 - np.hypot(X - 6, Y - 6) / 7.0, 0, 1) * 0.05 * Wn
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['nb_floor'] = plan_nb_floor


def nb_floor_things(bpy, NF, M, rng):
    inside = lambda r_: (12.0 * r_.randint(5) + r_.uniform(1.4, 10.6), 12.0 * r_.randint(5) + r_.uniform(1.4, 10.6))   # (inside a tile)
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, inside, 50)


TG.GARAGE_THINGS['nb_floor'] = nb_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
SHOP_AT = dict(letters=(8.0, 46.0), faces=(24.0, 46.0), sawhorses=(40.0, 46.0),
               tubes=(7.0, 28.0), bench=(19.0, 28.0), cans=(31.0, 28.0), transformers=(43.0, 28.0), lift=(8.0, 10.0))
GAL_AT = dict(signs=(8.0, 46.0), arrow=(24.0, 46.0), bulbs=(40.0, 46.0),
              crates=(7.0, 28.0), projector=(19.0, 28.0), wall_ew=(33.0, 28.0), wall_ns=(57.5, 28.0))
WALL_H = 3.6
GLYPH = dict(C=('111', '100', '100', '100', '111'), A=('010', '101', '111', '101', '101'), S=('111', '100', '111', '001', '111'),
             N=('1001', '1101', '1011', '1001', '1001'), O=('111', '101', '101', '101', '111'))
TUBES = ('nb_tube_r', 'nb_tube_t', 'nb_tube_y', 'nb_tube_w')


def sockets_x(P, x0, x1, y, z0, z1, step=0.3):
    """empty bulb sockets in a grid on a face that looks south"""
    for x in np.arange(x0 + step / 2, x1, step):
        for z in np.arange(z0 + step / 2, z1, step): P.box('nb_socket', x - 0.035, x + 0.035, y - 0.012, y, z - 0.035, z + 0.035)


def letter(P, ch, x0, y0, cw, ch_, depth, mat, rng, lean=0.0):
    """one giant channel letter stood upright facing south: its strokes as cells cw by ch_, depth deep, its face painted, its returns steel,
    the sockets on its face empty"""
    rows = GLYPH[ch]
    for j, line in enumerate(rows):
        z1 = (5 - j) * ch_; z0 = z1 - ch_
        for i, bit in enumerate(line):
            if bit != '1': continue
            xa = x0 + i * cw; ya = y0 + lean * z0
            P.box('nb_return', xa, xa + cw, ya, ya + depth, z0, z1)
            P.box(mat, xa + 0.04, xa + cw - 0.04, ya - 0.015, ya, z0 + 0.04, z1 - 0.04)
            sockets_x(P, xa + 0.05, xa + cw - 0.05, ya - 0.015, z0 + 0.05, z1 - 0.05, 0.34)


def letters(P, ox, oy, rng):
    """giant letters from a dead casino's name, taller than a man, stood in a row on the floor: C A S in front and N O taller behind (the I is
    missing); their faces faded, their sockets empty"""
    for k, (ch, mat) in enumerate((('C', 'nb_paint_r'), ('A', 'nb_paint_y'), ('S', 'nb_paint_t'))):
        letter(P, ch, ox - 5.6 + k * 3.8, oy + 0.5 + 0.2 * (k % 2), 0.95, 0.8, 0.5, mat, rng)
    for (ch, mat, x0) in (('N', 'nb_paint_b', ox - 5.4), ('O', 'nb_paint_r', ox + 0.6)):
        letter(P, ch, x0, oy + 4.4, 1.15, 0.95, 0.55, mat, rng)
    for _ in range(12): u, v = ox + rng.uniform(-5.6, 5.4), oy + rng.uniform(-0.3, 0.3); P.box('nb_socket', u, u + 0.08, v, v + 0.08, 0.0, 0.05)


def sign_panel(P, prof, y0, depth, mat, tube, rng, sock=True):
    """one dead sign stood on end: a panel cut to its profile (x, z), depth deep, its face painted; a dead tube run round inside its edge"""
    P.prism_y('nb_return', y0, y0 + depth, prof)
    P.prism_y(mat, y0 - 0.015, y0, prof)
    cx = sum(p[0] for p in prof) / len(prof); cz = sum(p[1] for p in prof) / len(prof)
    inner = [(cx + (x - cx) * 0.82, cz + (z - cz) * 0.82) for (x, z) in prof]
    for a, b in zip(inner, inner[1:] + inner[:1]): P.bar(tube, (a[0], y0 - 0.03, a[1]), (b[0], y0 - 0.03, b[1]), 0.025)
    if sock:
        xs = [p[0] for p in prof]; zs = [p[1] for p in prof]
        for x in np.arange(min(xs) + 0.25, max(xs) - 0.2, 0.3):
            for z in (min(zs) + 0.25, max(zs) - 0.3):
                if min(zs) < z < max(zs): P.box('nb_socket', x - 0.035, x + 0.035, y0 - 0.02, y0 - 0.008, z - 0.035, z + 0.035)


def roundtop(x0, x1, z0, z1, n=10):
    r = (x1 - x0) / 2; cx = (x0 + x1) / 2; zc = z1 - r
    return [(x0, z0), (x1, z0)] + [(cx + r * math.cos(math.pi * k / n), zc + r * math.sin(math.pi * k / n)) for k in range(n + 1)]


def signs(P, ox, oy, rng):
    """dead signs stood on end in the dark, rows of them like headstones: a tall blade, a round-topped panel, a shield in front; a star and a
    long panel taller behind"""
    sign_panel(P, [(ox - 5.6, 0.0), (ox - 4.6, 0.0), (ox - 4.6, 4.6), (ox - 5.6, 4.6)], oy + 0.6, 0.35, 'nb_paint_r', 'nb_tube_w', rng)
    sign_panel(P, roundtop(ox - 3.8, ox - 0.6, 0.0, 3.2), oy + 0.5, 0.3, 'nb_paint_t', 'nb_tube_y', rng)
    sign_panel(P, [(ox + 0.2, 1.0), (ox + 0.6, 0.0), (ox + 2.8, 0.0), (ox + 3.2, 1.0), (ox + 3.2, 2.9), (ox + 1.7, 3.5), (ox + 0.2, 2.9)], oy + 0.7, 0.3,
               'nb_paint_y', 'nb_tube_r', rng)
    P.box('nb_steel', ox + 3.8, ox + 4.0, oy + 0.6, oy + 0.8, 0.0, 3.6)                                                # a pole sign's pole, its head down
    sign_panel(P, [(ox + 4.1, 0.0), (ox + 5.7, 0.0), (ox + 5.7, 1.9), (ox + 4.1, 1.9)], oy + 0.4, 0.4, 'nb_paint_b', 'nb_tube_t', rng)
    st = [(ox - 2.4 + (1.9 if k % 2 == 0 else 0.85) * math.cos(math.pi / 2 + k * math.pi / 5), 2.3 + (1.9 if k % 2 == 0 else 0.85) * math.sin(math.pi / 2 + k * math.pi / 5)) for k in range(10)]
    sign_panel(P, st, oy + 4.6, 0.3, 'nb_paint_y', 'nb_tube_w', rng, sock=False)                                           # a star
    sign_panel(P, [(ox + 0.4, 0.0), (ox + 5.4, 0.0), (ox + 5.4, 3.8), (ox + 0.4, 3.8)], oy + 4.8, 0.35, 'nb_paint_k', 'nb_tube_r', rng)
    for k in range(4): P.bar(TUBES[k], (ox + 1.0, oy + 4.78, 0.8 + k * 0.7), (ox + 4.8, oy + 4.78, 0.8 + k * 0.7 + 0.25 * (k % 2)), 0.03)   # a word in dead tube
    for _ in range(8): u, v = ox + rng.uniform(-5.5, 5.5), oy + rng.uniform(-0.5, 0.3); a = rng.uniform(0, 3.14); P.bar(TUBES[rng.randint(4)], (u, v, 0.02), (u + 0.4 * math.cos(a), v + 0.4 * math.sin(a), 0.02), 0.02)


def face_rack(P, x0, x1, yc, rng, h=3.4):
    """an A-frame rack a tile long, sign faces leaning on both its sides floor to near the roof"""
    for x in np.arange(x0 + 0.1, x1, 2.4):
        P.prism_x('nb_steel', x - 0.04, x + 0.04, [(yc - 0.9, 0.0), (yc - 0.82, 0.0), (yc + 0.02, h), (yc - 0.06, h)])
        P.prism_x('nb_steel', x - 0.04, x + 0.04, [(yc + 0.82, 0.0), (yc + 0.9, 0.0), (yc + 0.06, h), (yc - 0.02, h)])
    P.box('nb_steel', x0, x1, yc - 0.05, yc + 0.05, h - 0.08, h)
    mats = ('nb_face', 'nb_face', 'nb_paint_r', 'nb_paint_y', 'nb_paint_t', 'nb_face', 'nb_paint_b', 'nb_paint_k')
    x = x0 + 0.05
    while x < x1 - 0.6:
        wd = rng.uniform(1.4, 2.6); xb = min(x1 - 0.02, x + wd)
        for s in (-1, 1):
            for k in range(rng.randint(3, 6)):
                top = rng.uniform(1.8, h - 0.1); off = 0.06 + k * 0.05; m = mats[rng.randint(len(mats))]
                yb = yc + s * (0.85 - off) ; yt = yc + s * (0.12 + off * 0.5) * 1.0
                P.prism_x(m, x, xb, [(yb, 0.0), (yb + s * 0.03, 0.0), (yt + s * 0.03, top), (yt, top)])
        x = xb + 0.05


def faces(P, ox, oy, rng):
    """racks of sign faces stood on end, floor to ceiling: two A-frame runs a tile long"""
    face_rack(P, ox - 6.0, ox + 6.0, oy + 1.0, rng); face_rack(P, ox - 6.0, ox + 6.0, oy + 4.6, rng)


def sawhorses(P, ox, oy, rng):
    """a sign face as long as a bus laid flat on sawhorses for paint it never got, a tile long so a run of S is one face: its ground coat,
    the letters masked out in tape and half painted, a can and a roller left on it"""
    y0, y1, zt = oy + 0.6, oy + 3.2, 0.9
    for x in (ox - 5.2, ox - 2.0, ox + 1.2, ox + 4.4):
        for yy in (y0 + 0.25, y1 - 0.35):
            P.box('nb_crate', x - 0.5, x + 0.5, yy, yy + 0.1, zt - 0.12, zt - 0.04)
            for s in (-1, 1): P.bar('nb_crate', (x + s * 0.4, yy + 0.05, zt - 0.1), (x + s * 0.55, yy + 0.05 + s * 0.0, 0.0), 0.03)
    P.box('nb_return', ox - 6.0, ox + 6.0, y0, y1, zt - 0.04, zt + 0.06)
    P.box('nb_face', ox - 5.95, ox + 5.95, y0 + 0.05, y1 - 0.05, zt + 0.06, zt + 0.07)
    for k, ch in enumerate('CASNO'):                                                                       # the letters masked out, some painted
        x0 = ox - 5.2 + k * 2.2; rows = GLYPH[ch]; cw, chh = 0.45, 0.42
        for j, line in enumerate(rows):
            for i, bit in enumerate(line):
                if bit != '1': continue
                xa, ya = x0 + i * cw, y1 - 0.25 - (j + 1) * chh
                m = ('nb_paint_r', 'nb_paint_t', 'nb_paint_y')[k % 3] if k < 3 else 'card'
                P.box(m, xa, xa + cw, ya, ya + chh, zt + 0.07, zt + 0.075)
    P.drum('nb_can_p', ox + 3.9, oy + 1.2, zt + 0.07, zt + 0.3, 0.12, 12); P.bar('nb_paint_r', (ox + 2.8, oy + 2.2, zt + 0.12), (ox + 3.3, oy + 2.0, zt + 0.12), 0.05)


def tube_rack(P, x0, x1, y0, rng):
    """a steel rack of new tube glass, five shelves, the 1.2 m sticks laid in bundles, some gone"""
    for z in (0.15, 0.5, 0.85, 1.2):
        P.box('nb_steel', x0, x1, y0, y0 + 0.9, z - 0.03, z)
        x = x0 + 0.05
        while x < x1 - 0.3:
            if rng.rand() < 0.8:
                for k in range(6): P.box('nb_glass', x + 0.02, x + 0.03 + 0.6, y0 + 0.08 + k * 0.13, y0 + 0.1 + k * 0.13, z, z + 0.04)
            x += 0.7
    for (u, v) in ((x0, y0), (x1 - 0.05, y0), (x0, y0 + 0.85), (x1 - 0.05, y0 + 0.85)): P.box('nb_steel', u, u + 0.05, v, v + 0.05, 0.0, 1.25)


def tubes(P, ox, oy, rng):
    """a rack of tube glass nobody will bend now: two racks, a carton of sticks, sticks dropped and broken on the floor"""
    tube_rack(P, ox - 4.0, ox - 0.6, oy + 0.6, rng); tube_rack(P, ox + 0.0, ox + 3.4, oy + 0.6, rng)
    P.box('card', ox - 3.6, ox - 2.2, oy - 0.6, oy + 0.1, 0.0, 0.35)
    for k in range(8): P.box('nb_glass', ox - 3.55 + k * 0.17, ox - 3.45 + k * 0.17, oy - 0.55, oy + 0.05, 0.35, 0.37)
    for _ in range(26):
        u, v = ox + rng.uniform(-4.2, 3.6), oy + rng.uniform(-1.2, 0.4); a = rng.uniform(0, 3.14); L = rng.uniform(0.15, 1.2)
        P.bar(('nb_glass', 'nb_glass', TUBES[rng.randint(4)])[rng.randint(3)], (u, v, 0.02), (u + L * math.cos(a), v + L * math.sin(a), 0.02), 0.018)


def bench(P, ox, oy, rng):
    """the glass benders' benches: two, the ribbon burners and crossfires cold, a half bent tube still in the clamp, the pattern paper
    drawn in reverse under it, the gas cylinders, the bombarder's cabinet and its gauges, a stool"""
    for k, x0 in enumerate((ox - 4.2, ox - 0.6)):
        P.box('nb_bench', x0, x0 + 3.0, oy + 0.6, oy + 1.5, 0.86, 0.92)
        for (u, v) in ((x0 + 0.05, oy + 0.65), (x0 + 2.9, oy + 0.65), (x0 + 0.05, oy + 1.4), (x0 + 2.9, oy + 1.4)): P.box('nb_steel', u, u + 0.05, v, v + 0.05, 0.0, 0.86)
        P.box('paper', x0 + 0.2, x0 + 2.6, oy + 0.7, oy + 1.4, 0.92, 0.925)
        for (a, b) in (((0.4, 0.9), (1.6, 0.9)), ((1.6, 0.9), (1.9, 1.2)), ((1.9, 1.2), (2.3, 1.2)), ((0.4, 1.25), (1.2, 1.25))):
            P.box('black', x0 + min(a[0], b[0]), x0 + max(a[0], b[0]) + 0.02, oy + min(a[1], b[1]), oy + max(a[1], b[1]) + 0.02, 0.925, 0.928)
        P.box('black', x0 + 1.0, x0 + 1.9, oy + 1.25, oy + 1.4, 0.92, 1.0)                                    # the ribbon burner
        for (u, v) in ((x0 + 0.4, oy + 0.9), (x0 + 1.6, oy + 0.9)): P.box('nb_steel', u - 0.06, u + 0.06, v - 0.06, v + 0.06, 0.92, 1.1)   # the clamps
        t = TUBES[k * 2 % 4]
        P.bar(t, (x0 + 0.3, oy + 0.9, 1.05), (x0 + 1.6, oy + 0.9, 1.05), 0.025); P.bar(t, (x0 + 1.6, oy + 0.9, 1.05), (x0 + 1.9, oy + 1.2, 1.05), 0.025)
        P.bar(t, (x0 + 1.9, oy + 1.2, 1.05), (x0 + 2.3, oy + 1.2, 1.05), 0.025)
        P.drum('nb_stool', x0 + 1.5, oy + 0.1, 0.0, 0.65, 0.18, 12)
    for (u, v, m) in ((ox + 3.0, oy + 1.4, 'fh_cyl'), (ox + 3.35, oy + 1.4, 'nb_cyl_r'), (ox + 3.7, oy + 1.4, 'fh_cyl')): P.drum(m, u, v, 0.0, 1.4, 0.13, 12)
    P.box('nb_cab', ox + 2.8, ox + 4.4, oy + 0.4, oy + 1.1, 0.0, 1.6)                                               # the bombarder
    for (u, z) in ((ox + 3.1, 1.3), (ox + 3.6, 1.3), (ox + 4.1, 1.3)): P.drum('white', u, oy + 0.39, z, z + 0.01, 0.1, 12)
    P.box('black', ox + 3.0, ox + 4.2, oy + 0.39, oy + 0.4, 0.4, 1.0)
    for _ in range(6): u, v = ox + rng.uniform(-4.2, 2.4), oy + rng.uniform(-0.6, 0.4); a = rng.uniform(0, 3.14); P.bar(TUBES[rng.randint(4)], (u, v, 0.02), (u + 0.5 * math.cos(a), v + 0.5 * math.sin(a), 0.02), 0.02)


def cans(P, ox, oy, rng):
    """sign cans, the metal boxes a sign's letters ride on, set down: one long on its side with its letter mounts, one shorter on its face,
    a third standing on end; brackets and a raceway"""
    P.box('nb_can', ox - 4.0, ox + 0.4, oy + 0.6, oy + 1.6, 0.0, 1.0); P.box('nb_return', ox - 4.0, ox + 0.4, oy + 0.6, oy + 0.62, 0.05, 0.95)
    for x in np.arange(ox - 3.7, ox + 0.2, 0.55): P.box('nb_steel', x, x + 0.12, oy + 0.5, oy + 0.6, 0.3, 0.7)
    P.box('nb_can_b', ox + 0.8, ox + 3.6, oy + 0.2, oy + 1.5, 0.0, 0.7); P.box('black', ox + 0.9, ox + 3.5, oy + 0.3, oy + 1.4, 0.7, 0.71)
    P.box('nb_can', ox - 1.2, ox - 0.2, oy + 2.0, oy + 2.6, 0.0, 2.6)
    P.box('nb_steel', ox + 1.0, ox + 3.8, oy - 0.6, oy - 0.45, 0.0, 0.15)
    for (dx, dy) in ((-4.4, -0.5), (-2.6, -0.8), (3.8, 1.8)): P.box('nb_steel', ox + dx, ox + dx + 0.6, oy + dy, oy + dy + 0.08, 0.0, 0.6)


def transformers(P, ox, oy, rng):
    """sign transformers stacked in heaps, the boxes that once lit the tubes: three heaps and the loose ones, a coil of cable"""
    for (cx, cy, n) in ((ox - 2.8, oy + 0.5, 6), (ox + 0.4, oy + 0.9, 7), (ox + 3.2, oy + 0.3, 5)):
        for lev in range(n):
            for k in range(n - lev):
                for j in range(4 - min(3, lev // 2)):
                    x = cx - (n - lev) * 0.2 + k * 0.4 + rng.uniform(-0.04, 0.04); y = cy + j * 0.26 + lev * 0.05 + rng.uniform(-0.04, 0.04); z = lev * 0.17
                    P.box(('nb_xfmr', 'nb_xfmr', 'black', 'nb_xfmr_g')[rng.randint(4)], x, x + 0.38, y, y + 0.22, z, z + 0.17)
    for _ in range(30):
        u, v = ox + rng.uniform(-4.4, 4.2), oy + rng.uniform(-1.0, 2.4); P.box(('nb_xfmr', 'black', 'nb_xfmr_g')[rng.randint(3)], u, u + 0.38, v, v + 0.22, 0.0, 0.17)
    for k in range(3):                                                                                     # cable in coils
        cx, cy, r = ox - 1.6 + k * 1.4, oy - 0.7, 0.4 + 0.06 * k
        for t in range(3):
            for i in range(16): a0, a1 = 6.2832 * i / 16, 6.2832 * (i + 1) / 16; rr = r - t * 0.06; P.bar('nb_cable', (cx + rr * math.cos(a0), cy + rr * math.sin(a0) * 0.8, 0.03 + t * 0.03), (cx + rr * math.cos(a1), cy + rr * math.sin(a1) * 0.8, 0.03 + t * 0.03), 0.03)


def arrow(P, ox, oy, rng):
    """a sign's arrow lying on the floor, still pointing at a door that is not there: its body painted, a border, its sockets empty; a
    smaller arrow broken off beside it"""
    a = 0.18; ca, sa = math.cos(a), math.sin(a)
    def pts(L, w, hw, hl, cx, cy):
        q = [(-L / 2, -w / 2), (L / 2 - hl, -w / 2), (L / 2 - hl, -hw / 2), (L / 2, 0.0), (L / 2 - hl, hw / 2), (L / 2 - hl, w / 2), (-L / 2, w / 2)]
        return [(cx + x * ca - y * sa, cy + x * sa + y * ca) for (x, y) in q]
    cx, cy = ox - 0.2, oy + 1.4
    P.poly('nb_return', pts(9.0, 1.5, 3.2, 2.6, cx, cy), 0.0, 0.42)
    P.poly('nb_paint_y', pts(8.8, 1.3, 2.95, 2.45, cx, cy), 0.42, 0.44)
    P.poly('nb_paint_r', pts(8.0, 0.8, 2.2, 2.0, cx, cy), 0.44, 0.45)
    for k in range(24):
        x = -4.1 + k * 0.3
        if x > 1.6: break
        for y in (-0.55, 0.55):
            u, v = cx + x * ca - y * sa, cy + x * sa + y * ca; P.box('nb_socket', u - 0.04, u + 0.04, v - 0.04, v + 0.04, 0.44, 0.46)
    cx2, cy2 = ox + 2.4, oy - 0.6; a2 = -2.6; c2, s2 = math.cos(a2), math.sin(a2)
    q = [(-1.6, -0.35), (0.6, -0.35), (0.6, -0.8), (1.6, 0.0), (0.6, 0.8), (0.6, 0.35), (-1.6, 0.35)]
    P.poly('nb_paint_t', [(cx2 + x * c2 - y * s2, cy2 + x * s2 + y * c2) for (x, y) in q], 0.0, 0.3)
    for _ in range(10): u, v = ox + rng.uniform(-4.5, 4.5), oy + rng.uniform(-1.2, 0.0); P.box('nb_socket', u, u + 0.08, v, v + 0.08, 0.0, 0.05)


def bulbs(P, ox, oy, rng):
    """a marquee's bulb rails on the floor, its sockets empty: rails crossed in a pile, a corner of the marquee's frame, a carton of bulbs
    split open and the bulbs rolled out"""
    for k in range(11):
        a = rng.uniform(-0.45, 0.45); L = rng.uniform(3.5, 6.0); cx, cy = ox + rng.uniform(-1.8, 1.8), oy + 0.2 + k * 0.26
        x0, y0 = cx - L / 2 * math.cos(a), cy - L / 2 * math.sin(a); x1, y1 = cx + L / 2 * math.cos(a), cy + L / 2 * math.sin(a)
        z = 0.08 + 0.14 * (k % 3); P.bar('nb_rail', (x0, y0, z), (x1, y1, z), 0.1)
        for t in np.arange(0.04, 1.0, 0.06): P.box('nb_socket', x0 + (x1 - x0) * t - 0.05, x0 + (x1 - x0) * t + 0.05, y0 + (y1 - y0) * t - 0.05, y0 + (y1 - y0) * t + 0.05, z + 0.08, z + 0.13)
    P.box('nb_rail', ox - 5.0, ox - 4.6, oy + 0.0, oy + 3.4, 0.0, 0.4); P.box('nb_rail', ox - 5.0, ox - 2.0, oy + 3.0, oy + 3.4, 0.0, 0.4)   # the marquee's corner
    for x in np.arange(ox - 4.9, ox - 2.1, 0.2): P.box('nb_socket', x, x + 0.09, oy + 2.98, oy + 3.0, 0.1, 0.32)
    for y in np.arange(oy + 0.1, oy + 2.9, 0.2): P.box('nb_socket', ox - 4.62, ox - 4.6, y, y + 0.09, 0.1, 0.32)
    P.box('card', ox + 3.0, ox + 4.2, oy + 2.0, oy + 2.8, 0.0, 0.45); P.box('black', ox + 3.05, ox + 4.15, oy + 2.05, oy + 2.75, 0.45, 0.46)
    for _ in range(60):
        u, v = ox + rng.uniform(-4.6, 4.6), oy + rng.uniform(-1.2, 3.4); P.drum(('white', 'nb_bulb', 'nb_glass', 'nb_bulb')[rng.randint(4)], u, v, 0.0, 0.08, 0.05, 8)


def lift(P, ox, oy, rng):
    """a scissor lift folded down, its battery long dead: the chassis, the scissor arms, the deck and its rails; its charger, a pallet of
    sign parts beside it"""
    x0, x1, y0, y1 = ox - 1.4, ox + 1.4, oy + 0.6, oy + 1.8
    P.box('nb_lift', x0, x1, y0, y1, 0.12, 0.55)
    for (u, v) in ((x0 + 0.3, y0 - 0.05), (x1 - 0.3, y0 - 0.05), (x0 + 0.3, y1 - 0.05), (x1 - 0.3, y1 - 0.05)): P.box('black', u - 0.15, u + 0.15, v, v + 0.1, 0.0, 0.3)
    for k in range(3):
        z0 = 0.55 + k * 0.42
        for y in (y0 + 0.1, y1 - 0.1):
            P.bar('nb_lift_d', (x0 + 0.2, y, z0), (x1 - 0.2, y, z0 + 0.42), 0.04); P.bar('nb_lift_d', (x1 - 0.2, y, z0), (x0 + 0.2, y, z0 + 0.42), 0.04)
    P.box('nb_lift', x0 - 0.2, x1 + 0.2, y0, y1, 1.81, 1.95)
    for (a, b) in (((x0 - 0.2, y0), (x1 + 0.2, y0)), ((x0 - 0.2, y1), (x1 + 0.2, y1)), ((x0 - 0.2, y0), (x0 - 0.2, y1)), ((x1 + 0.2, y0), (x1 + 0.2, y1))):
        P.bar('nb_lift', (a[0], a[1], 3.0), (b[0], b[1], 3.0), 0.03); P.bar('nb_lift', (a[0], a[1], 2.5), (b[0], b[1], 2.5), 0.02)
    for (u, v) in ((x0 - 0.2, y0), (x1 + 0.2, y0), (x0 - 0.2, y1), (x1 + 0.2, y1)): P.bar('nb_lift', (u, v, 1.95), (u, v, 3.0), 0.03)
    P.box('nb_cab', ox + 2.0, ox + 2.6, oy + 0.6, oy + 1.0, 0.0, 0.9); P.bar('black', (ox + 2.0, oy + 0.8, 0.5), (ox + 1.4, oy + 0.9, 0.3), 0.02)
    P.box('nb_crate', ox - 4.4, ox - 2.2, oy + 0.4, oy + 1.6, 0.0, 0.14)                                         # a pallet of sign parts
    P.box('nb_can', ox - 4.3, ox - 2.4, oy + 0.5, oy + 1.0, 0.14, 0.6); P.box('nb_face', ox - 4.3, ox - 2.3, oy + 1.05, oy + 1.5, 0.14, 0.24)
    for _ in range(5): u, v = ox + rng.uniform(-4.4, 3.4), oy + rng.uniform(-0.8, 0.2); P.box('nb_steel', u, u + 0.5, v, v + 0.06, 0.0, 0.06)


def crates(P, ox, oy, rng):
    """crates of bulbs, every one still wrapped: stacked two and three high, two opened, the bulbs in their paper; a pallet jack"""
    spots = [(-4.0, 0.4, 3), (-2.9, 0.4, 2), (-1.8, 0.5, 3), (-3.8, 1.3, 1), (-2.4, 1.4, 2), (0.2, 0.6, 2), (1.3, 0.4, 1), (2.4, 0.6, 2), (0.8, 1.6, 1), (3.0, 1.6, 2), (1.9, 1.7, 1)]
    for k, (dx, dy, n) in enumerate(spots):
        x, y = ox + dx, oy + dy
        for lev in range(n): P.box(('nb_crate', 'nb_crate_d')[(k + lev) % 2], x, x + 1.0, y, y + 0.75, lev * 0.62, lev * 0.62 + 0.6)
        if k in (3, 8):
            P.box('black', x + 0.05, x + 0.95, y + 0.05, y + 0.7, n * 0.62 - 0.03, n * 0.62 - 0.02)
            for i in range(4):
                for j in range(3): P.drum('paper', x + 0.17 + i * 0.22, y + 0.16 + j * 0.21, n * 0.62 - 0.05, n * 0.62 + 0.06, 0.09, 8)
    P.box('nb_crate', ox - 1.3, ox - 0.3, oy - 0.7, oy - 0.05, 0.0, 0.08)                                        # a lid on the floor
    P.box('nb_lift_d', ox + 3.6, ox + 4.2, oy - 0.2, oy + 1.0, 0.0, 0.12); P.bar('black', (ox + 3.9, oy + 1.0, 0.1), (ox + 3.9, oy + 1.4, 1.1), 0.03)   # a pallet jack
    for _ in range(14): u, v = ox + rng.uniform(-4.0, 3.6), oy + rng.uniform(-0.9, 0.3); P.drum('paper', u, v, 0.0, 0.1, 0.09, 8)


def projector(P, ox, oy, rng):
    """projectors on their tall stands, aimed up at the dead signs; another on a road case; the generator that runs them, its cables across
    the floor; road cases, a reel case open, cable on its spool"""
    for (x, y, h) in ((ox - 2.6, oy + 1.0, 2.4), (ox + 1.2, oy + 1.6, 2.2), (ox + 3.4, oy + 2.4, 2.6)):
        for a in (0.3, 2.4, 4.5): P.bar('nb_steel', (x, y, h), (x + 0.65 * math.cos(a), y + 0.65 * math.sin(a), 0.0), 0.035)
        P.bar('nb_steel', (x, y, h - 0.6), (x, y, h), 0.04)
        P.box('nb_proj', x - 0.45, x + 0.45, y - 0.35, y + 0.35, h, h + 0.4); P.drum('white', x, y - 0.36, h + 0.2, h + 0.21, 0.13, 12)
        P.box('black', x - 0.4, x + 0.4, y - 0.36, y - 0.35, h + 0.03, h + 0.1)
    P.box('nb_case', ox - 0.8, ox + 0.6, oy + 0.0, oy + 0.8, 0.0, 0.8); P.box('nb_proj', ox - 0.4, ox + 0.3, oy + 0.1, oy + 0.7, 0.8, 1.1)
    P.box('nb_case', ox - 0.6, ox + 0.8, oy - 1.0, oy - 0.3, 0.0, 0.6); P.box('nb_case', ox + 1.0, ox + 2.0, oy - 0.9, oy - 0.2, 0.0, 0.9)
    P.box('nb_lift', ox + 2.4, ox + 3.9, oy - 0.2, oy + 0.8, 0.0, 0.85); P.box('black', ox + 2.5, ox + 3.8, oy - 0.21, oy - 0.2, 0.2, 0.7)   # the generator
    P.drum('nb_steel', ox + 3.6, oy + 0.3, 0.85, 1.25, 0.05, 8)
    for (a, b) in (((ox + 2.4, oy + 0.3), (ox - 2.6, oy + 0.9)), ((ox + 2.4, oy + 0.5), (ox + 1.2, oy + 1.5)), ((ox + 3.0, oy + 0.8), (ox + 3.4, oy + 2.3)), ((ox + 2.4, oy + 0.1), (ox - 0.1, oy + 0.4))):
        mid = ((a[0] + b[0]) / 2 + rng.uniform(-0.5, 0.5), (a[1] + b[1]) / 2 - 0.6)
        P.bar('nb_cable', (a[0], a[1], 0.03), (mid[0], mid[1], 0.03), 0.035); P.bar('nb_cable', (mid[0], mid[1], 0.03), (b[0], b[1], 0.03), 0.035)
    P.box('nb_case', ox - 4.0, ox - 2.8, oy - 0.4, oy + 0.5, 0.0, 0.5); P.box('black', ox - 3.95, ox - 2.85, oy - 0.35, oy + 0.45, 0.5, 0.51)
    for k in range(3): P.drum('nb_reel', ox - 3.7 + k * 0.4, oy - 0.95, 0.0, 0.05, 0.2, 14)
    P.wheel('nb_crate', ox - 1.8, oy - 0.7, 0.4, 0.4, 0.5); P.wheel('nb_cable', ox - 1.8, oy - 0.7, 0.4, 0.3, 0.52)                  # cable on its spool


def wall_ew(P, ox, oy, rng):
    """the museum's block wall, a tile long, painted black for the dark; a white line at a metre, a dead tube run along it, a cap"""
    P.box('nb_wall', ox - 6.0, ox + 6.0, oy, oy + 0.3, 0.0, WALL_H)
    for k in range(1, 18): z = k * 0.2; P.box('nb_wall_j', ox - 6.0, ox + 6.0, oy - 0.004, oy, z - 0.006, z + 0.006)
    P.box('nb_face', ox - 6.0, ox + 6.0, oy - 0.006, oy, 0.95, 1.02)
    P.bar('nb_tube_r', (ox - 6.0, oy - 0.05, 2.4), (ox + 6.0, oy - 0.05, 2.4), 0.025); P.bar('nb_tube_t', (ox - 6.0, oy - 0.05, 2.55), (ox + 6.0, oy - 0.05, 2.55), 0.025)
    for x in np.arange(ox - 5.8, ox + 6.0, 1.2): P.box('nb_steel', x, x + 0.04, oy - 0.07, oy, 2.35, 2.6)
    P.box('pd_cap', ox - 6.0, ox + 6.0, oy - 0.02, oy + 0.32, WALL_H, WALL_H + 0.05)
    for _ in range(12): u, z = ox + rng.uniform(-5.8, 5.6), rng.uniform(0.1, 3.0); P.box('nb_wall_s', u, u + rng.uniform(0.2, 0.9), oy - 0.006, oy - 0.004, z, z + rng.uniform(0.05, 0.4))


def wall_ns(P, ox, oy, rng):
    P.box('nb_wall', ox - 0.15, ox + 0.15, oy, oy + 12.0, 0.0, WALL_H); P.box('pd_cap', ox - 0.17, ox + 0.17, oy, oy + 12.0, WALL_H, WALL_H + 0.05)
    P.box('nb_face', ox - 0.16, ox + 0.16, oy, oy + 12.0, 0.95, 1.02)


SHOP_F = dict(letters=letters, faces=faces, sawhorses=sawhorses, tubes=tubes, bench=bench, cans=cans, transformers=transformers, lift=lift)
GAL_F = dict(signs=signs, arrow=arrow, bulbs=bulbs, crates=crates, projector=projector, wall_ew=wall_ew, wall_ns=wall_ns)


def nb_shop_parts(P, rng):
    for k, f in SHOP_F.items(): f(P, *SHOP_AT[k], rng)


def nb_gal_parts(P, rng):
    for k, f in GAL_F.items(): f(P, *GAL_AT[k], rng)


def nb_mats(bpy, NF, F, M, which):
    if which not in ('nb_shop', 'nb_gallery', 'tun_pieces'): return
    if which in ('nb_shop', 'nb_gallery'): FH.fh_mats(bpy, NF, F, M, 'fh_bay')
    m = lambda n, role, step, mul: NF.material(bpy, n, role, step, mul)
    M.update(nb_paint_r=m('in_sign_paint_red', 'clay_rust', 2, 0.9), nb_paint_y=m('in_sign_paint_yellow', 'clay_mustard', 2, 0.9), nb_paint_t=m('in_sign_paint_teal', 'clay_teal', 2, 0.92),
             nb_paint_b=m('in_sign_paint_bone', 'clay_bone', 3, 0.88), nb_paint_k=m('in_sign_paint_black', 'rubber', 2, 1.0), nb_return=m('in_sign_return', 'tape_grey', 2, 0.85),
             nb_socket=m('in_sign_socket', 'rubber', 1, 1.0), nb_face=m('in_sign_face_white', 'clay_bone', 4, 0.86), nb_steel=m('in_steel_shop', 'tape_grey', 1, 0.95),
             nb_tube_r=m('in_neon_dead_red', 'clay_rust', 3, 0.9), nb_tube_t=m('in_neon_dead_teal', 'clay_teal', 3, 0.9), nb_tube_y=m('in_neon_dead_yellow', 'clay_mustard', 3, 0.9),
             nb_tube_w=m('in_neon_dead_white', 'tape_grey', 4, 0.86), nb_glass=m('in_tube_glass', 'tape_grey', 4, 0.82), nb_bench=m('in_bench_transite', 'tape_grey', 2, 0.9),
             nb_stool=m('in_stool_black', 'rubber', 2, 1.0), nb_cyl_r=m('in_cylinder_red', 'clay_rust', 1, 1.0), nb_cab=m('in_cabinet_grey', 'metal_painted', 2, 1.0),
             nb_can=m('in_sign_can', 'metal_painted', 2, 0.95), nb_can_b=m('in_sign_can_bone', 'clay_bone', 2, 0.92), nb_can_p=m('in_paint_can', 'tape_grey', 3, 0.85),
             nb_xfmr=m('in_transformer', 'tape_grey', 1, 1.0), nb_xfmr_g=m('in_transformer_grey', 'tape_grey', 2, 0.9), nb_cable=m('in_cable_black', 'rubber', 2, 1.0),
             nb_rail=m('in_marquee_rail', 'tape_grey', 2, 0.9), nb_bulb=m('in_bulb_amber', 'clay_mustard', 3, 0.92), nb_lift=m('in_lift_yellow', 'clay_mustard', 2, 0.9),
             nb_lift_d=m('in_lift_arm', 'clay_mustard', 1, 1.0), nb_crate=m('in_crate_pine', 'tape_masking', 2, 0.9), nb_crate_d=m('in_crate_pine_dark', 'tape_masking', 1, 1.0),
             nb_proj=m('in_projector', 'rubber', 2, 1.0), nb_case=m('in_road_case', 'rubber', 3, 1.0), nb_reel=m('in_film_reel', 'tape_grey', 3, 0.85),
             nb_wall=m('in_paint_block_black', 'rubber', 3, 1.0), nb_wall_j=m('in_block_joint_black', 'rubber', 1, 1.0), nb_wall_s=m('in_wall_scuff_pale', 'tape_grey', 2, 0.9))


TG.PARTS['nb_shop'] = nb_shop_parts
TG.PARTS['nb_gallery'] = nb_gal_parts
TG.MAT_HOOKS.append(nb_mats)


# ---- the ceiling: the truck stop's steel roof, a dead tube loop hanging in every bay ---------------------------------------------
def ceil_boneyard(P, rng):
    TS.ceil_truckstop(P, rng)
    for r in range(5):
        for c in range(5):
            t = TUBES[(r * 5 + c) % 4]; z = 1.2
            pts = [TG.at(c, r, lx, ly, z) for (lx, ly) in ((4.0, 3.5), (8.0, 3.5), (8.0, 6.0), (6.0, 7.5), (4.0, 6.0))]
            for a, b in zip(pts, pts[1:] + pts[:1]): P.bar(t, (a[0], a[1], z), (b[0], b[1], z), 0.05)
            for (lx, ly) in ((4.0, 3.5), (8.0, 3.5)):
                a = TG.at(c, r, lx, ly, 0.3); b = TG.at(c, r, lx, ly, z); P.bar('black', (a[0], a[1], 0.3), (b[0], b[1], z), 0.012)


TG.CEILINGS['boneyard'] = (ceil_boneyard, 'boneyard/boneyard_ceiling.webp', "the shop's steel roof from under it: the deck, the girders, the open-web joists, a skylight and a dead lamp in every bay, and a dead neon loop hanging in every bay")
TG.CEIL_DATA['boneyard'] = 'boneyard/boneyard.json'

# ---- the cut (the inside kit's) --------------------------------------------------------------------------------------------------
KIND = dict(letters='WALL', signs='WALL', faces='WALL', sawhorses='COVER', tubes='COVER', bench='COVER', cans='COVER', transformers='LOW_COVER',
            arrow='LOW_COVER', bulbs='LOW_COVER', lift='COVER', crates='COVER', projector='COVER', wall_ew='WALL', wall_ns='WALL')
HM = dict(letters=4.8, signs=4.6, faces=3.4, sawhorses=1.0, tubes=1.25, bench=1.6, cans=2.6, transformers=1.2, arrow=0.46, bulbs=0.4, lift=3.0,
          crates=1.8, projector=3.0, wall_ew=WALL_H + 0.05, wall_ns=WALL_H + 0.05)
NAME = dict(letters='A GIANT LETTER', signs='A DEAD SIGN ON END', faces='RACKS OF SIGN FACES', sawhorses='A SIGN FACE ON SAWHORSES', tubes='A RACK OF TUBE GLASS',
            bench="A BENDER'S BENCH", cans='A SIGN CAN', transformers='TRANSFORMERS', arrow='A FALLEN ARROW', bulbs='A BULB RAIL', lift='A SCISSOR LIFT',
            crates='CRATES OF BULBS', projector='A PROJECTOR', wall_ew="THE MUSEUM'S WALL", wall_ns="THE MUSEUM'S WALL")
BOX = dict(letters=(-6.0, 6.01, -0.5, 4.95 + 4.9 * 1.45), signs=(-6.0, 6.01, -0.6, 5.2 + 4.7 * 1.45), faces=(-6.0, 6.01, 0.0, 5.6 + 3.5 * 1.45),
           sawhorses=(-6.0, 6.01, 0.4, 3.3 + 1.1 * 1.45), tubes=(-4.6, 4.2, -1.4, 1.6 + 1.3 * 1.45), bench=(-4.6, 4.6, -0.9, 1.6 + 1.7 * 1.45),
           cans=(-4.6, 4.6, -0.9, 2.7 + 2.7 * 1.45), transformers=(-4.8, 4.8, -1.3, 2.9 + 1.2 * 1.45), arrow=(-5.6, 5.0, -1.6, 3.6),
           bulbs=(-5.2, 5.0, -1.4, 3.6 + 0.5 * 1.45), lift=(-4.6, 3.6, -1.0, 1.9 + 3.1 * 1.45), crates=(-4.2, 4.4, -1.0, 2.4 + 1.9 * 1.45),
           projector=(-4.2, 4.4, -1.2, 3.1 + 3.1 * 1.45), wall_ew=(-6.0, 6.01, -0.3, 0.4 + (WALL_H + 0.1) * 1.45), wall_ns=(-0.6, 0.6, -0.05, 12.1 + (WALL_H + 0.1) * 1.45))
SHADOW = dict(wall_ns=0.5)

K = KIT.make(TG, kit='boneyard', prefix='nb_', floor_render='nb_floor', floor_lists=[('floor', (0, 1, 2, 3, 4)), ('ring', (0, 1, 2, 3, 4))],
             scenes=[('nb_shop', SHOP_AT), ('nb_gallery', GAL_AT)], box=BOX, kind=KIND, hm=HM, name=NAME, shadow=SHADOW,
             art_for="COMBAT FOUR's neon boneyard (slices/fight_ground/boneyard/boneyard.json): the names its handoff asked for, the garage's format. floor.floor and floor.ring are the shop's and the gallery's sealed concrete with paint spilled on it in every color a sign ever was (rust, mustard, white, teal; pools, drips, a roller's track, footprints) and tube glass ground into it, every mark inside its tile.",
             how_it_lays={'the sign shop': "nb_letters is three giant letters in front and two taller behind, so a run of L is a name across the floor; nb_faces is two A-frame racks a tile long; nb_sawhorses is one sign face a tile long, so SSSSSS is one face as long as six houses.",
                          'the dark gallery': "nb_signs is five dead signs stood on end, three in front and two behind, so the block of G is the rows of headstones; nb_projector is a projector on its stand aimed up at them."},
             sheet_name='THE_NEON_BONEYARD', card_id='cook7-the-neon-boneyard-11-27', heading='THE NEON BONEYARD, BEFORE AND NOW',
             sub='on his phone, 390 x 844, as the fight opens in the sign shop: before (every piece a stand-in), now, and now with the roof at his 10%',
             off_label='NOW, THE ROOF OFF', meets_label='NOW, AS HE MEETS IT: THE ROOF AT 10%', close_title='CLOSE IN, AND THE DARK GALLERY',
             close_sub='the giant letters and the sign faces on sawhorses; the gallery: the dead signs on end, the projectors',
             closes=[('THE LETTERS', 'letters'), ('THE SIGN FACE', 'sawhorses')], other=('THE DARK GALLERY', 'gal'), pieces_title='THE PIECES AT THEIR OWN PIXELS',
             pieces_sub='the letters, the sign faces, a face on sawhorses, tube glass, the benders\' benches, sign cans, transformers, a lift; the gallery: the dead signs, an arrow, bulb rails, crates, the projector',
             rows=[(('letters', 'faces'), 230), (('signs', 'sawhorses'), 200), (('tubes', 'bench', 'cans', 'transformers'), 140), (('arrow', 'bulbs', 'lift', 'crates'), 140), (('projector', 'wall_ew'), 130)],
             floor_title="THE PAINTED CONCRETE AND THE ROOF AT FULL STRENGTH", floor_sub='paint in every color a sign ever was, tube glass ground in; the joists, a skylight, a dead neon loop in every bay')


def cut(): KIT.cut(K)


def sheet(before_dir, page_dir): KIT.sheet(K, before_dir, page_dir)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'nb_floor' else TG.scene_pieces(n, '--quick' in a) if n in ('nb_shop', 'nb_gallery') else TG.scene_ceiling('boneyard', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
