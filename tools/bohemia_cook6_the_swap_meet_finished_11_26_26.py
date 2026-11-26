#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the swap meet, finished] (11/26/26; COMBAT FOUR's BUILD 11/22zc asked 'FOR COOK (SIX)'; VAMILY rule 480(b):
finished art where a stand-in still stands; rules 461, 441, 416, 451(a), 455).

COMBAT FOUR's swap meet (THE SWAP MEET, slices/fight_ground/swapmeet/swapmeet.json, laid by slices/bohemia_big_inside.js): Broadacres up
north, 'the last market, and the crush at it': its covered rows (stalls back to back, old sets, racks of clothes, the vendors' vans, the
change booth) or its food court (food stands round the edge, picnic tables in the middle). All 13 of its pieces were stand-ins (the casino's,
the tunnels', the street board's, the garage's), its ceiling drawn by the page. These are the pictures under its names, through the master
rig, ON this lane's school tool (and the chain under it):

  THE FLOOR        swapmeet_floor_0.webp, five tiles by five: THE MARKET'S ASPHALT (the garage deck's ground, laid dark), the stalls'
                   lines painted on it every 3 m with their numbers stencilled in each, worn; oil where the vans stood; the monsoon's tide
                   marks; the cracks. The lines and numbers at the same place on every tile, so a row of stall spaces runs on.
  THE PIECES       (swapmeet_art.json's kit, COMBAT FOUR's names)
    sm_stalls      a tile of folding tables back to back, loaded: boxes of tools, toys, tapes, shoes, a tarp over one
    sm_sets        a stall of old sets: televisions stacked three high, one still on with snow, a tape deck blinking 12:00
    sm_racks       racks of clothes on their wheels, a mirror leaned on one
    sm_vans        a vendor's box van, its back open and nothing in it (the stadium's truck)
    sm_foodstand   a food stand: its counter and window, the griddle, the propane, the price board with every price crossed out
    sm_booth       the change booth, its window barred, its stool
    sm_picnic      a picnic table on its side, a bench under it
    sm_coolers     coolers, their lids open, a water jug
    sm_crates      milk crates stacked, boxes on them
    sm_tyres       tyre stacks
    sm_trampled    goods trampled flat in the crush: boxes, clothes, a doll
    sm_wall_ew/_ns the market's fence: chain-link with its slats, a tarp tied to it, the wire on top
  THE CEILING      swapmeet_ceiling.webp (rule 451(a), over the fight at 10%): five bays by five that repeat: the sheds' corrugated roofs on
                   their poles in long runs east to west, the sky between the sheds, holes rusted through, a sheet gone.

  <venv>/bin/python tools/bohemia_cook6_the_swap_meet_finished_11_26_26.py render sm_floor | sm_pieces | ceil_swapmeet
  python3 tools/bohemia_cook6_the_swap_meet_finished_11_26_26.py cut
  python3 tools/bohemia_cook6_the_swap_meet_finished_11_26_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): Broadacres Marketplace in North Las Vegas (since
1977): long rows of vendors' folding tables under open-sided steel sheds with corrugated roofs, numbered stall spaces painted on the
asphalt, racks of clothes on rolling rails, crates and coolers, tyre vendors, box vans parked behind the stalls, a food court of stands and
picnic tables, a change booth; a chain-link perimeter with privacy slats. The twins: this lane's school kit (the same rig and cut) and the
stadium's truck (the van).
REUSE CHECK (REUSE-FIRST): the stadium's box truck for the van; the garage deck's calibrated ground; the school's cut and sheet; COOK
FIVE's rig, Parts and cutter. New here: the market's plan, its pieces, the sheds' roof.
ANALOG HORROR: a television still on, showing snow, at a stall nobody stands at; a tape deck blinking 12:00; every price crossed out.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_school_finished_11_21_26 as SC              # this lane's: the school (and the chain under it, the stadium's truck)

TG = SC.TG; FW = SC.FW; HS = SC.HS; SD = SC.SD
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'swapmeet')
ROWS = (0, 1, 2, 3, 4)
tile_xy = HS.tile_xy


# ---- the ground: the market's asphalt --------------------------------------------------------------------------------------------
def digit_mask(txt, X, Y, x0, y0, h):
    """a stencilled number painted on the ground: PIL's digits laid on the plan at (x0, y0), h metres tall"""
    im = Image.new('L', (40 * len(txt), 60), 0); d = ImageDraw.Draw(im)
    d.text((2, -4), txt, font=ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), 58), fill=255)
    a = np.asarray(im) > 120; sc = h / 60.0
    u = ((X - x0) / sc).astype(int); v = ((Y - y0) / sc).astype(int)
    ok = (u >= 0) & (v >= 0) & (u < a.shape[1]) & (v < a.shape[0])
    out = np.zeros(X.shape, bool); out[ok] = a[v[ok], u[ok]]; return out


def plan_sm_floor(ID, seed=233):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['gar_deck'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    grain = FW.vnoise((H, W), 0.15 * PPM, rng)
    dark = 0.34 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.1 + (grain - 0.5) * 0.06; pale = np.clip((dust - 0.65) / 0.3, 0, 1) * 0.05
    # the stalls' lines: N-S every 3 m (1.5 m in from a tile's edge, so the spaces run on across tiles), and an E-W line 1 m in from each
    # edge north and south, painted white and worn through in places
    wear = FW.vnoise((H, W), 0.7 * PPM, rng) < 0.3
    lines = ((np.abs(((lx - 1.5) % 3.0)) < 0.06) & (ly > 1.0) & (ly < 11.0)) | ((np.abs(ly - 1.0) < 0.05) | (np.abs(ly - 11.0) < 0.05))
    gid[lines & ~wear] = ID['st_line']
    for r in ROWS:
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]; G = gid[sy, sx]
            nn = FW.vnoise(X.shape, 1.2 * PPM, rng)
            for k in range(4):                                           # each space's number, stencilled near its north line
                n = 101 + (r * 5 + c) * 4 + k
                m = digit_mask(str(n), X, Y, 1.5 + k * 3.0 + 0.6, 1.4, 0.6) & (nn > 0.25)
                G[m] = ID['st_line']
            for _ in range(rng.randint(1, 3)):                           # oil where a van stood, inside a space
                cx, cy = 3.0 + 3.0 * rng.randint(0, 3), rng.uniform(4.0, 8.0); d0 = np.hypot((X - cx) / 1.2, (Y - cy) / 0.8)
                D[:] = np.maximum(D, np.clip(1 - d0, 0, 1) * (0.5 + 0.4 * nn) * 0.55)
            if rng.rand() < 0.5:                                         # the monsoon's tide line, dried
                cx, cy = rng.uniform(4, 8), rng.uniform(4, 8); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.4 * nn); rr = rng.uniform(1.4, 2.6)
                Pl[:] = np.maximum(Pl, np.clip(1 - np.abs(d0 - rr) / 0.08, 0, 1) * 0.3); D[:] = np.where(d0 < rr, D + 0.06, D)
            for _ in range(rng.randint(2, 4)):                           # cracks, inside the tile
                x, y = rng.uniform(2, 10), rng.uniform(2, 10); a = rng.uniform(0, 6.3)
                for k in range(6):
                    x1, y1 = np.clip(x + 0.6 * math.cos(a), 1.2, 10.8), np.clip(y + 0.6 * math.sin(a), 1.2, 10.8)
                    t = np.clip(((X - x) * (x1 - x) + (Y - y) * (y1 - y)) / max((x1 - x) ** 2 + (y1 - y) ** 2, 1e-6), 0, 1)
                    D[np.hypot(X - x - t * (x1 - x), Y - y - t * (y1 - y)) < 0.02] = 0.62; x, y, a = x1, y1, a + rng.uniform(-0.7, 0.7)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['sm_floor'] = plan_sm_floor


def sm_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(1.0, 59.4)), 60)


TG.GARAGE_THINGS['sm_floor'] = sm_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
SM_AT = dict(stalls=(10.0, 47.0), sets=(26.0, 47.0), wall_ew=(42.0, 47.0), wall_ns=(57.5, 44.0),
             vans=(10.0, 36.0), foodstand=(25.0, 36.0), racks=(36.0, 36.0), booth=(45.0, 36.0),
             picnic=(8.0, 24.0), coolers=(16.0, 24.0), crates=(23.0, 24.0), tyres=(30.0, 24.0), trampled=(39.0, 24.0))
WALL_H = 2.4
GOODS = ('red', 'blue', 'tan', 'teal', 'card', 'paper', 'black', 'rug', 'haz', 'white')


def table(P, x0, x1, y0, y1, z=0.74):
    P.box('sc_top', x0, x1, y0, y1, z, z + 0.03)
    for (x, y) in ((x0 + 0.08, y0 + 0.08), (x1 - 0.08, y0 + 0.08), (x0 + 0.08, y1 - 0.08), (x1 - 0.08, y1 - 0.08)): P.bar('sc_frame', (x, y, 0.0), (x, y, z), 0.012)


def goods(P, x0, x1, y0, y1, z, rng, n):
    for _ in range(n):
        x, y = rng.uniform(x0 + 0.1, x1 - 0.3), rng.uniform(y0 + 0.05, y1 - 0.2); w_, d_, h_ = rng.uniform(0.12, 0.4), rng.uniform(0.1, 0.3), rng.uniform(0.05, 0.3)
        P.box(GOODS[rng.randint(len(GOODS))], x, x + w_, y, y + d_, z, z + h_)


def stalls(P, ox, oy, rng):
    """a tile of folding tables back to back (two rows of six, 1.8 m by 0.75), loaded with what people sold: boxes of tools, toys, tapes,
    shoes; a tarp pulled over one; boxes under them"""
    for j in range(2):
        y0 = oy + 0.3 + j * 0.8
        for i in range(6):
            x0 = ox - 5.7 + i * 1.9; table(P, x0, x0 + 1.8, y0, y0 + 0.75); goods(P, x0, x0 + 1.8, y0, y0 + 0.75, 0.77, rng, 9)
            if rng.rand() < 0.5: P.box('card', x0 + 0.3, x0 + 0.9, y0 + 0.1, y0 + 0.6, 0.0, 0.35)
    k = rng.randint(6); x0 = ox - 5.7 + k * 1.9; P.box('blue', x0 - 0.05, x0 + 1.85, oy + 0.25, oy + 1.9, 0.96, 0.99)   # a tarp pulled over one
    for _ in range(10): x, y = ox + rng.uniform(-5.8, 5.8), oy + rng.uniform(-0.6, 2.2); P.box(('paper', 'card')[rng.randint(2)], x, x + 0.25, y, y + 0.2, 0.0, 0.006)


def sets(P, ox, oy, rng):
    """a stall of old sets: tables of televisions stacked three high, their screens dead and one still on with snow; a tape deck
    blinking 12:00 on a box; the cables"""
    for j in range(2):
        y0 = oy + 0.3 + j * 0.8
        for i in range(6):
            x0 = ox - 5.7 + i * 1.9; table(P, x0, x0 + 1.8, y0, y0 + 0.75)
            for k in range(3):
                for q in range(2):
                    if rng.rand() < 0.25: continue
                    x, s_ = x0 + 0.1 + q * 0.85, rng.uniform(0.55, 0.75); z = 0.77 + k * 0.5
                    P.box('sm_set', x, x + s_, y0 + 0.08, y0 + 0.68, z, z + 0.48); P.box('black', x + 0.05, x + s_ - 0.12, y0 + 0.075, y0 + 0.08, z + 0.06, z + 0.4)
    x0 = ox - 5.7 + 2 * 1.9 + 0.1; P.box('sm_snow', x0 + 0.05, x0 + 0.5, oy + 0.375, oy + 0.38, 0.83, 1.17)                 # one still on: snow
    P.box('black', ox + 2.0, ox + 2.5, oy + 0.4, oy + 0.7, 0.77, 0.86); P.box('red', ox + 2.05, ox + 2.2, oy + 0.395, oy + 0.4, 0.8, 0.83)   # the tape deck, 12:00
    for _ in range(6): x = ox + rng.uniform(-5.5, 5.5); P.bar('black', (x, oy + 0.3, 0.75), (x + rng.uniform(-0.6, 0.6), oy - 0.3, 0.0), 0.01)


def racks(P, ox, oy, rng):
    """racks of clothes on their wheels: three rails of chrome, the clothes on hangers in every colour, a mirror leaned on one"""
    for k in range(3):
        y = oy + 0.5 + k * 1.1
        P.bar('chrome', (ox - 2.4, y, 1.6), (ox + 2.4, y, 1.6), 0.02)
        for x in (ox - 2.4, ox + 2.4): P.bar('chrome', (x, y, 0.08), (x, y, 1.6), 0.02); P.bar('chrome', (x, y - 0.25, 0.08), (x, y + 0.25, 0.08), 0.02)
        x = ox - 2.3
        while x < ox + 2.3:
            w_ = rng.uniform(0.04, 0.09); P.box(GOODS[rng.randint(len(GOODS))], x, x + w_, y - 0.25, y + 0.25, rng.uniform(0.5, 0.9), 1.58); x += w_ + 0.005
    P.box('glass_d', ox + 2.5, ox + 2.55, oy + 0.3, oy + 0.9, 0.0, 1.5)                                         # a mirror leaned on one


def vans(P, ox, oy, rng):
    """a vendor's box van parked behind the stalls, its back open and nothing in it (the stadium's truck)"""
    SD.truck(P, ox, oy, rng)


def foodstand(P, ox, oy, rng):
    """a food stand: its shed with the counter and the window, the griddle and the fryer behind, the propane, stools; the price board
    with every price crossed out"""
    P.box('sm_stand', ox - 2.2, ox + 2.2, oy + 0.6, oy + 3.2, 0.0, 2.5); P.box('sm_roof', ox - 2.4, ox + 2.4, oy + 0.4, oy + 3.4, 2.5, 2.6)
    P.box('black', ox - 1.6, ox + 1.6, oy + 0.58, oy + 0.6, 1.0, 2.0); P.box('sc_top', ox - 1.7, ox + 1.7, oy + 0.3, oy + 0.62, 0.98, 1.02)   # the window, its counter
    P.box('sm_board', ox - 1.5, ox + 1.5, oy + 0.56, oy + 0.58, 2.05, 2.45)                                      # the price board
    for k in range(4):
        y = 2.1 + k * 0.08; P.box('paper', ox - 1.3, ox + 0.4, oy + 0.555, oy + 0.56, y, y + 0.03); P.bar('red', (ox - 1.35, oy + 0.55, y + 0.04), (ox + 0.45, oy + 0.55, y - 0.01), 0.008)
    P.drum('white', ox + 2.6, oy + 1.2, 0.0, 0.9, 0.16, 10)                                                     # the propane
    for x in (ox - 1.2, ox, ox + 1.2): P.drum('sc_frame', x, oy - 0.1, 0.0, 0.7, 0.03, 6); P.drum('red', x, oy - 0.1, 0.7, 0.75, 0.18, 10)   # stools


def booth(P, ox, oy, rng):
    """the change booth: a box of painted steel, its window barred, the slot, a stool inside, a padlock on its door"""
    P.box('sm_booth', ox - 0.9, ox + 0.9, oy + 0.3, oy + 2.1, 0.0, 2.3); P.box('sm_roof', ox - 1.0, ox + 1.0, oy + 0.2, oy + 2.2, 2.3, 2.36)
    P.box('black', ox - 0.6, ox + 0.6, oy + 0.28, oy + 0.3, 1.0, 1.7)
    for k in range(7): x = ox - 0.55 + k * 0.18; P.box('chrome', x, x + 0.02, oy + 0.26, oy + 0.28, 1.0, 1.7)   # its bars
    P.box('sc_steel', ox - 0.7, ox + 0.7, oy + 0.15, oy + 0.3, 0.95, 1.0)
    P.box('chrome', ox + 0.6, ox + 0.68, oy + 2.1, oy + 2.13, 1.0, 1.1)


def picnic(P, ox, oy, rng):
    """a picnic table on its side for cover: its top stood up facing south, its legs out, one bench under it, the other thrown"""
    P.box('sm_wood', ox - 1.2, ox + 1.2, oy + 0.6, oy + 0.66, 0.0, 0.8)
    for x in (ox - 0.9, ox + 0.9): P.bar('sm_wood', (x, oy + 0.66, 0.1), (x, oy + 1.4, 0.4), 0.04); P.bar('sm_wood', (x, oy + 0.66, 0.7), (x, oy + 1.4, 0.4), 0.04)
    P.box('sm_wood', ox - 1.2, ox + 1.2, oy + 1.5, oy + 1.8, 0.0, 0.06); P.poly('sm_wood', [(ox - 1.6, oy - 0.2), (ox + 0.6, oy - 0.6), (ox + 0.65, oy - 0.35), (ox - 1.55, oy + 0.05)], 0.0, 0.05)


def coolers(P, ox, oy, rng):
    """coolers left in a heap, their lids open, ice long gone; a water jug"""
    for (dx, dy, m, op) in ((-0.8, 0.3, 'red', True), (0.0, 0.2, 'blue', False), (0.7, 0.5, 'white', True), (-0.3, 0.9, 'teal', False)):
        x, y = ox + dx, oy + dy; P.box(m, x - 0.35, x + 0.35, y, y + 0.4, 0.0, 0.42); P.box('white', x - 0.33, x + 0.33, y + 0.02, y + 0.38, 0.42, 0.44)
        if op: P.box(m, x - 0.35, x + 0.35, y + 0.4, y + 0.44, 0.4, 0.8)
    P.drum('jug', ox + 1.3, oy + 0.3, 0.0, 0.45, 0.14, 8)


def crates(P, ox, oy, rng):
    """milk crates stacked, boxes on them, one crate kicked over"""
    for (dx, dy, n, m) in ((-0.6, 0.2, 3, 'blue'), (-0.2, 0.2, 2, 'red'), (0.2, 0.25, 3, 'blue'), (0.6, 0.6, 1, 'red'), (-0.4, 0.65, 2, 'teal')):
        for k in range(n): P.box(m, ox + dx - 0.17, ox + dx + 0.17, oy + dy, oy + dy + 0.34, k * 0.28, k * 0.28 + 0.27); P.box('black', ox + dx - 0.14, ox + dx + 0.14, oy + dy + 0.03, oy + dy + 0.31, k * 0.28 + 0.27, k * 0.28 + 0.275)
    P.box('card', ox - 0.7, ox - 0.1, oy + 0.15, oy + 0.55, 0.84, 1.1); P.box('card', ox + 0.1, ox + 0.5, oy + 0.2, oy + 0.6, 0.84, 1.05)
    P.box('red', ox + 0.9, ox + 1.24, oy - 0.2, oy + 0.07, 0.0, 0.34)


def tyres(P, ox, oy, rng):
    """tyre stacks: a vendor's, four high, one rolled off"""
    for (dx, dy, n) in ((-0.6, 0.4, 4), (0.15, 0.35, 3), (0.8, 0.5, 5)):
        for k in range(n): P.drum('black', ox + dx, oy + dy, k * 0.22, k * 0.22 + 0.2, 0.33, 14); P.drum('under', ox + dx, oy + dy, k * 0.22 + 0.2, k * 0.22 + 0.205, 0.2, 12)
    P.poly('black', [(ox - 1.4, oy - 0.3), (ox - 1.2, oy - 0.3), (ox - 1.2, oy + 0.35), (ox - 1.4, oy + 0.35)], 0.0, 0.66)


def trampled(P, ox, oy, rng):
    """goods trampled flat in the crush: boxes stepped on, clothes, a doll face down, broken toys, a shoe"""
    for _ in range(26):
        x, y = ox + rng.uniform(-1.8, 1.8), oy + rng.uniform(-0.3, 1.8); a = rng.uniform(-1, 1); ca, sa = math.cos(a), math.sin(a); w_, d_ = rng.uniform(0.15, 0.5), rng.uniform(0.1, 0.35)
        P.poly(GOODS[rng.randint(len(GOODS))], [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in ((-w_, -d_), (w_, -d_), (w_, d_), (-w_, d_))], 0.0, rng.uniform(0.01, 0.06))
    P.box('tan', ox + 0.3, ox + 0.55, oy + 0.6, oy + 0.7, 0.0, 0.06); P.drum('tan', ox + 0.6, oy + 0.65, 0.0, 0.06, 0.05, 8)   # a doll, face down


def wall_ew(P, ox, oy, rng):
    """the market's fence, a tile long: chain-link on steel posts, its green slats woven in (some gone), the wire coiled on top, a tarp tied"""
    for k in range(5): x = ox - 6 + k * 3.0; P.drum('chrome', x, oy + 0.05, 0.0, WALL_H + 0.3, 0.04, 8)
    P.box('sm_slat', ox - 6, ox + 6, oy, oy + 0.05, 0.05, WALL_H)
    for _ in range(14): x = ox + rng.uniform(-5.9, 5.8); P.box('sm_link', x, x + rng.uniform(0.05, 0.25), oy - 0.003, oy, rng.uniform(0.05, 1.2), WALL_H)   # slats gone: the link
    P.bar('chrome', (ox - 6, oy + 0.05, WALL_H), (ox + 6, oy + 0.05, WALL_H), 0.025)
    for k in range(48): x = ox - 6 + k * 0.25; P.drum('chrome', x, oy + 0.05, WALL_H + 0.1, WALL_H + 0.14, 0.12, 8)   # the wire on top
    x = ox + rng.uniform(-4, 2); P.box('blue', x, x + 2.2, oy - 0.01, oy, 0.6, 1.9)                             # a tarp tied to it


def wall_ns(P, ox, oy, rng):
    for k in range(5): P.drum('chrome', ox, oy + k * 3.0, 0.0, WALL_H + 0.3, 0.04, 8)
    P.box('sm_slat', ox - 0.03, ox + 0.03, oy, oy + 12, 0.05, WALL_H)
    for k in range(48): P.drum('chrome', ox, oy + k * 0.25, WALL_H + 0.1, WALL_H + 0.14, 0.12, 8)


def sm_parts(P, rng):
    A = SM_AT
    for k, f in (('stalls', stalls), ('sets', sets), ('wall_ew', wall_ew), ('wall_ns', wall_ns), ('vans', vans), ('foodstand', foodstand), ('racks', racks),
                 ('booth', booth), ('picnic', picnic), ('coolers', coolers), ('crates', crates), ('tyres', tyres), ('trampled', trampled)):
        f(P, *A[k], rng)


def sm_mats(bpy, NF, F, M, which):
    if which not in ('sm_pieces', 'tun_pieces'): return
    if which == 'sm_pieces': SC.sc_mats_(bpy, NF, F, M, 'sc_pieces'); SD.st_mats(bpy, NF, F, M, 'st_pieces')
    M.update(sm_set=NF.material(bpy, 'in_plastic_tv_beige', 'tape_masking', 2, 0.9), sm_snow=NF.material(bpy, 'in_tv_snow', 'tape_grey', 4, 0.5),
             sm_stand=NF.material(bpy, 'in_paint_stand_yellow', 'clay_mustard', 2, 0.9), sm_roof=NF.material(bpy, 'in_metal_roof', 'tape_grey', 2, 0.7),
             sm_board=NF.material(bpy, 'in_black_price_board', 'rubber', 1, 0.9), sm_booth=NF.material(bpy, 'in_paint_booth_red', 'clay_rust', 2, 0.9),
             sm_wood=NF.material(bpy, 'in_wood_picnic', 'tape_masking', 2, 0.92), sm_slat=NF.material(bpy, 'in_slat_green', 'clay_teal', 1, 0.9),
             sm_link=NF.material(bpy, 'in_chain_link', 'tape_grey', 3, 0.6), sm_sheet=NF.material(bpy, 'in_ceil_corrugated', 'tape_grey', 2, 0.6),
             sm_sheet_r=NF.material(bpy, 'in_ceil_corrugated_rust', 'clay_rust', 1, 0.8))


TG.PARTS['sm_pieces'] = sm_parts
TG.MAT_HOOKS.append(sm_mats)


# ---- the ceiling: the sheds' corrugated roofs ----------------------------------------------------------------------------------
def ceil_swapmeet(P, rng):
    """the sheds' corrugated roofs on their poles: long runs east to west the whole width (two sheds a bay, 4.2 m deep each, the gap of sky
    between at the same place in every bay so a run meets the next bay), their corrugations, the purlins under them, a pole at every
    3 m; holes rusted through and a sheet gone, inside each bay"""
    at = TG.at
    P.box('white', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)                                                           # the sky between the sheds
    for r in range(5):
        for (y0, y1) in ((0.9, 5.1), (6.9, 11.1)):
            ya, yb = at(0, r, 0, y1)[1], at(0, r, 0, y0)[1]
            P.box('sm_sheet', -3.0, 63.0, ya, yb, 0.0, 0.05)
            for k in range(int((y1 - y0) / 0.15)):                                                                # the corrugations
                y = at(0, r, 0, y0 + k * 0.15)[1]; P.box('under', -3.0, 63.0, y - 0.02, y, 0.05, 0.052)
            for yy in (y0, y1): y = at(0, r, 0, yy)[1]; P.box('black', -3.0, 63.0, y - 0.06, y + 0.06, 0.05, 0.06)   # its edges
            for k in range(1, int((y1 - y0) / 1.4)):                                                              # its purlins, seen from under it
                y = at(0, r, 0, y0 + k * 1.4)[1]; P.box('sc_frame', -3.0, 63.0, y - 0.07, y + 0.07, 0.07, 0.1)
            for k in range(-1, 22):                                                                               # its rafters across, every 3 m (THE GATE's C3: 6% lines without them)
                x = k * 3.0; P.box('black', x - 0.12, x + 0.12, ya, yb, 0.1, 0.14)
    for r in range(5):
        for c in range(5):
            for _ in range(rng.randint(2, 5)):                                                                    # rust, and holes rusted through
                x, y = at(c, r, rng.uniform(1.5, 10.5), rng.choice((rng.uniform(1.5, 4.5), rng.uniform(7.5, 10.5))), 0.06)
                TG.bloom(P, 'sm_sheet_r', x, y, rng.uniform(0.4, 0.9), rng, 6)
                if rng.rand() < 0.4: P.box('white', x - 0.15, x + 0.2, y - 0.12, y + 0.1, 0.07, 0.075)
            if rng.rand() < 0.45:                                                                                 # a sheet gone: the sky through it
                x, y = at(c, r, rng.uniform(2.0, 8.0), rng.choice((1.4, 7.4)), 0.08); P.box('white', x, x + 1.1, y - 3.0, y, 0.08, 0.085)


TG.CEILINGS['swapmeet'] = (ceil_swapmeet, 'swapmeet/swapmeet_ceiling.webp', "the sheds' corrugated roofs on their poles in long runs east to west, the sky between the sheds, rust and holes rusted through, a sheet gone")
TG.CEIL_DATA['swapmeet'] = 'swapmeet/swapmeet.json'

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(stalls='COVER', sets='COVER', racks='WALL', vans='WALL', foodstand='WALL', booth='COVER', picnic='COVER', coolers='LOW_COVER', crates='LOW_COVER',
            tyres='LOW_COVER', trampled='LOW_COVER', wall_ew='WALL', wall_ns='WALL')
HM = dict(stalls=1.0, sets=2.3, racks=1.6, vans=3.3, foodstand=2.6, booth=2.36, picnic=0.8, coolers=0.8, crates=1.1, tyres=1.1, trampled=0.1, wall_ew=WALL_H + 0.3, wall_ns=WALL_H + 0.3)
NAME = dict(stalls='A STALL', sets='A STALL OF OLD SETS', racks='RACKS OF CLOTHES', vans="A VENDOR'S VAN", foodstand='A FOOD STAND', booth='THE CHANGE BOOTH',
            picnic='A PICNIC TABLE', coolers='COOLERS', crates='CRATES', tyres='TYRE STACKS', trampled='TRAMPLED GOODS', wall_ew="THE MARKET'S FENCE", wall_ns="THE MARKET'S FENCE")


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'sm_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'swapmeet_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'sm_pieces.png')).convert('RGBA'); A = SM_AT; sz = {}
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'sm_' + key, 'swapmeet', shadow)
    x, y = A['stalls']; one('stalls', (x - 6.0, x + 6.0 + 0.01, y - 0.7, y + 2.3 + 1.1 * 1.45), 1.0)
    x, y = A['sets']; one('sets', (x - 6.0, x + 6.0 + 0.01, y - 0.7, y + 2.0 + 2.3 * 1.45), 1.0)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.3, y + 0.4 + (WALL_H + 0.3) * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + (WALL_H + 0.3) * 1.45), 0.5)
    x, y = A['vans']; one('vans', (x - 6.4, x + 4.4, y - 0.4, y + 3.6 + 3.3 * 1.45), 1.0)
    x, y = A['foodstand']; one('foodstand', (x - 2.6, x + 2.9, y - 0.5, y + 3.5 + 2.7 * 1.45), 1.0)
    x, y = A['racks']; one('racks', (x - 2.7, x + 2.8, y - 0.1, y + 3.0 + 1.7 * 1.45), 1.0)
    x, y = A['booth']; one('booth', (x - 1.2, x + 1.2, y - 0.1, y + 2.3 + 2.4 * 1.45), 1.0)
    x, y = A['picnic']; one('picnic', (x - 1.8, x + 1.4, y - 0.8, y + 1.9 + 0.9 * 1.45), 1.0)
    x, y = A['coolers']; one('coolers', (x - 1.3, x + 1.6, y - 0.1, y + 1.5 + 0.9 * 1.45), 1.0)
    x, y = A['crates']; one('crates', (x - 1.0, x + 1.4, y - 0.4, y + 1.1 + 1.2 * 1.45), 1.0)
    x, y = A['tyres']; one('tyres', (x - 1.6, x + 1.3, y - 0.5, y + 1.0 + 1.2 * 1.45), 1.0)
    x, y = A['trampled']; one('trampled', (x - 2.1, x + 2.1, y - 0.6, y + 2.0 + 0.2 * 1.45), 0.6)
    for key, v in sz.items():
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'sm_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='swapmeet/sm_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['swapmeet/swapmeet_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'sm_' + k: ent(k) for k in sz}
    art = {'version': 'cook6-swapmeet-art-11-26', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's swap meet (slices/fight_ground/swapmeet/swapmeet.json, BUILD 11/22zc): the names its handoff asked for, the garage's format. floor.floor is the market's asphalt (all 25 tiles: the stalls' lines every 3 m and 1 m in from the north and south edges, at the same place on every tile so the spaces run on, each space's number stencilled, oil where vans stood, the monsoon's tide line, cracks; nothing but the lines near an edge); floor.ring the same. No floor.water: your 'w' tiles draw the standing water themselves.",
           'floor': {'floor': cells(ROWS), 'ring': cells(ROWS)}, 'kit': kit,
           'how_it_lays': {'the covered rows': "sm_stalls and sm_sets a tile wide, two rows of six tables back to back, foot their south edge (your 'at' [0.5, 0.82] and [0.5, 0.85]), so a run of T and E is one long row of stalls; sm_racks three rails; sm_vans the stadium's box truck, nose east; sm_booth the change booth.",
                           'the food court': "sm_foodstand a shed with its window and price board; sm_picnic a table on its side; sm_coolers, sm_crates, sm_tyres, sm_trampled.",
                           'the fence': "sm_wall_ew / _ns: chain-link with slats to 2.4 m, the wire on top, a tile long."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'swapmeet_art.json'))
    cp = os.path.join(REND, 'ceil_swapmeet.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'swapmeet_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'swapmeet/swapmeet.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "swapmeet/swapmeet_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):   # (the one agreed edit in COMBAT FOUR's file)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='swapmeet/swapmeet_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['swapmeet'][2],
                              contract="swapmeet.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat")
    json.dump(art, open(os.path.join(SHIP, 'swapmeet_art.json'), 'w'), indent=1)
    print('swapmeet: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_SWAP_MEET_11_26.webp: before and now on his phone, the food court, close in, the pieces, the floor, the roof"""
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub):
        im = Image.new('RGB', (WID, 64), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK); d.text((10, 38), sub, font=font(14), fill=DIM); rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    title('THE SWAP MEET, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens in the covered rows: before (every piece a stand-in), now, and now with the roof at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'swapmeet_upright_open_a0.png'))), ('NOW, THE ROOF OFF', up(os.path.join(page_dir, 'swapmeet_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE ROOF AT 10%', up(os.path.join(page_dir, 'swapmeet_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    fc = os.path.join(page_dir, 'fc', 'swapmeet_upright_open_a0.png')
    if os.path.exists(fc):
        title('THE OTHER LAYOUT: THE FOOD COURT', 'food stands round the edge, picnic tables in the middle; and close in on the covered rows')
        strip((('THE FOOD COURT', up(fc)), ('THE STALLS', up(os.path.join(page_dir, 'swapmeet_upright_stalls_close.png'))), ('THE SETS, THE RACKS', up(os.path.join(page_dir, 'swapmeet_upright_sets_close.png')))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the stalls, the sets, the racks, the van, the food stand, the booth, the picnic table, coolers, crates, tyres, trampled goods, the fence')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'sm_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('stalls', 'sets'), 200); row_of(('vans', 'foodstand', 'racks', 'booth'), 190); row_of(('picnic', 'coolers', 'crates', 'tyres', 'trampled'), 130); row_of(('wall_ew',), 110)
    title('THE ASPHALT, AND THE ROOF AT FULL STRENGTH', 'the stalls\' lines and numbers, oil, the tide line; the sheds\' corrugated roofs, the sky between them, rust and holes')
    fl = Image.open(os.path.join(SHIP, 'swapmeet_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'swapmeet_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_SWAP_MEET_11_26.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-swap-meet-11-26.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'sm_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'sm_pieces' else TG.scene_ceiling('swapmeet', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
