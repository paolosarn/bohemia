#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the bank, finished] (11/27/26; COMBAT FOUR's BUILD 11/22 asked 'FOR COOK (SIX)'; VAMILY rule 480(b): finished
art where a stand-in still stands; rule 482; rules 461, 441, 416, 451(a), 479(b)).

COMBAT FOUR's bank (THE BANK, slices/fight_ground/bank/bank.json, laid by slices/bohemia_big_inside.js): its banking hall (the teller line's
glass and counter, the stations and cash safes behind it, marble columns, officers' desks, check-writing islands, waiting chairs, paper
drifted against everything) or its vault floor (the round vault door standing open, walls of deposit boxes drilled, the boxes dumped, the
cash cage, the counting tables). All 16 of its pieces were stand-ins (the casino's glass, bar, seats, door, screens and cage, the garage's
core, the street board's bales, heaps and rubble, the tunnels' camp) on the mall's floor, and its ceiling was drawn by the page. These are
the pictures under its names, through the master rig, ON this lane's police station tool (and the truck stop's and the chain under it):

  THE FLOOR        bank_floor_0.webp, five tiles by five (floor.floor, floor.ring; ONE kind serves both rooms, marble in both): THE
                   BANK'S MARBLE, 1.2 m slabs of a warm grey stone laid on the mall's calibrated terrazzo, their joints fine, each slab its
                   own shade with soft veins, the polish worn dull in a path, scuffs, a slab cracked, mud tracked in. A tile's edge is a
                   joint: any tile meets any tile.
  THE PIECES       (bank_art.json's kit, COMBAT FOUR's names)
    bk_glass       the teller line, a tile long: its marble-fronted counter, the bandit glass in brass frames to 2.4 m, a window every
                   2 m with its deal tray and its number, starred where it held
    bk_counter     the counter's end where the glass stops: the line's return, waist high, its gate swung open
    bk_stations    a teller's station behind the line: the drawer pulled and empty, the coin counter, a dead screen, a stool
    bk_safes       the tellers' cash safes on their wheels, doors open, empty
    bk_files       loan files in steel cabinets, tipped over, the folders fanned out
    bk_column      a marble column, square, its brass shoe and its chipped corners, to the floor above
    bk_desks       an officer's desk on the platform, heavy walnut, pushed over on its back, its chair, the nameplate on the floor
    bk_island      a check-writing island, its marble top on a brass stand, the slips in their racks, a pen on its chain
    bk_chairs      the waiting chairs, leather, knocked into a heap with their low table
    bk_paper       paper drifted against nothing: ledgers, statements, and the banded dollar notes nobody wants
    bk_vaultdoor   the vault's round steel door standing open on its hinge arm, its bolts out, the time lock on its back
    bk_boxes       a wall of safe deposit boxes a tile long, floor to ceiling, most of the little doors drilled and hanging
    bk_dumped      deposit boxes pulled out and dumped, their trays, papers, an empty ring box
    bk_cage        the cash cage, a tile long: steel mesh on posts, its counter window, the cage door open
    bk_tables      counting tables on their sides, a note counter on the floor, the straps of money left in bricks
    bk_wall_ew/_ns the bank's wall: a marble wainscot to a metre, plaster over it, a brass rail
  THE CEILING      bank_ceiling.webp (rule 451(a), over the fight at 10%; the data names its kind 'coffer'): five bays by five that repeat:
                   deep plaster coffers on beams, a gilt edge, a dead chandelier in every bay, the plaster fallen to the lath here and there.

  /tmp/v/bin/python tools/bohemia_cook7_the_bank_finished_11_27_26.py render bk_floor | bk_pieces | bk_vault | ceil_bank
  python3 tools/bohemia_cook7_the_bank_finished_11_27_26.py cut
  python3 tools/bohemia_cook7_the_bank_finished_11_27_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): the valley's old bank branches and the downtown
banking halls (a marble floor, a teller line of marble-fronted counters under bullet-resistant glass with brass frames and deal trays,
square marble-clad columns, an officers' platform of wood desks, stand-up check-writing tables with slip racks and chained pens, a
coffered or panelled ceiling with chandeliers; below or behind, a round vault door of a dozen tons hung on a hinge arm with its boltwork
and time locks, walls of safe deposit boxes with dual-key doors, a cash cage of welded mesh, counting tables with note counters). The
twins: this lane's police station and truck stop kits (the same rig and cut); the courthouse's coffered plaster (COOK SIX).
REUSE CHECK (REUSE-FIRST): the police station's mesh and the truck stop's joints and gondola-style runs, the swap meet's chain (materials,
cut, sheet), the mall's calibrated terrazzo, the courthouse's coffers. New here: the bank's plan, its 16 pieces, its ceiling.
ANALOG HORROR: the straps of hundreds left on the counting tables in bricks, nobody taking them, the money dead; the vault's time lock
still on the back of its open door.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook7_the_police_station_finished_11_27_26 as PD       # this lane's: the police station (the truck stop's and the chain under it)

TS = PD.TS; SM = TS.SM; TG = TS.TG; FW = TS.FW; HS = TS.HS
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND = TG.FG, TG.REND
SHIP = os.path.join(FG, 'bank')
ROWS = (0, 1, 2, 3, 4)
tile_xy = HS.tile_xy
seg_d = TS.seg_d


# ---- the ground: the bank's marble -----------------------------------------------------------------------------------------------
# THE MARBLE IS ITS OWN GROUND (the truck stop's finding: a joint drawn in the plan is lost on the ground's two-pixel mesh): the mall's terrazzo
# role with the shader's joints every 1.2 m and each slab its own shade; the mall's measured multiplier (the same role and target)
TG.GROUNDS['bk_slab'] = dict(role=('clay_bone', 3), target=(172, 164, 146), h=0.0, alt=('tape_grey', 3), alt_amt=0.3, grit=0.05, speck=(22, 0.1),
                             joints=dict(pitch=1.2, width=0.01), panel_var=0.05)
TG.CAL0['bk_slab'] = 0.6886
TG.WEAR['bk_slab'] = 0.25
def plan_bk_floor(ID, seed=263):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['bk_slab'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    q = 1.2; gx = (lx / q).astype(int); gy = (ly / q).astype(int)
    shade = np.random.RandomState(seed + 1).rand(64, 64)[np.clip(gy + 11 * row, 0, 63), np.clip(gx + 11 * col, 0, 63)]
    vein = TG.stretch(rng, 0.45, 3.5) * 0.75 + FW.vnoise((H, W), 0.25 * PPM, rng) * 0.25; vein2 = FW.vnoise((H, W), 1.2 * PPM, rng)
    veins = np.clip(1 - np.abs(vein - 0.5) / 0.02, 0, 1) * np.clip((vein2 - 0.35) / 0.2, 0, 1)    # soft veins, long, running east-west and broken
    dark = 0.27 + (shade - 0.5) * 0.04 + veins * 0.1 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.06          # (laid darker: 160 at 0.16 read as the palest floor of all, the mall's that he flagged; the courthouse's marble is 146)
    pale = np.zeros((H, W), np.float32)
    for r in ROWS:
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]
            Wn = TG.win(X, Y, 0.9, 2.2); nn = FW.vnoise(X.shape, 0.9 * PPM, rng)
            ang = rng.uniform(0, math.pi); cx, cy = rng.uniform(4.5, 7.5), rng.uniform(4.5, 7.5)               # the polish worn dull in a path
            d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang)); D[:] += np.clip(1 - d0 / 1.5, 0, 1) * Wn * (0.05 + 0.05 * nn)
            for _ in range(rng.randint(4, 9)):                                                                 # heel scuffs
                cx, cy = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5); a = rng.uniform(0, 3.14)
                D[seg_d(X, Y, cx, cy, cx + 0.18 * math.cos(a), cy + 0.18 * math.sin(a)) < 0.012] = 0.48
            if rng.rand() < 0.6:                                                                               # a slab cracked across
                i, j = rng.randint(2, 8), rng.randint(2, 8); x0, y0 = i * q, j * q
                D[seg_d(X, Y, x0 + 0.1, y0 + 0.2, x0 + q - 0.15, y0 + q - 0.1) < 0.012] = 0.5
            if rng.rand() < 0.5:                                                                               # mud tracked in, dried
                cx, cy = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.5 * nn)
                D[:] = np.maximum(D, np.clip(1.1 - d0 / rng.uniform(0.6, 1.2), 0, 1) * 0.36)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['bk_floor'] = plan_bk_floor


def bk_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['paper'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(0.6, 59.4)), 90)   # slips, statements


TG.GARAGE_THINGS['bk_floor'] = bk_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
BK_AT = dict(glass=(7.0, 47.0), stations=(21.0, 47.0), desks=(34.0, 47.0), column=(46.0, 44.0), wall_ns=(57.5, 36.0),
             wall_ew=(7.0, 33.0), counter=(20.0, 33.0), safes=(31.0, 33.0), files=(41.0, 33.0),
             island=(7.0, 20.0), chairs=(18.0, 20.0), paper=(29.0, 20.0))
VAULT_AT = dict(boxes=(7.0, 46.0), cage=(21.0, 46.0), vaultdoor=(36.0, 45.0), tables=(48.0, 46.0), dumped=(8.0, 28.0))
WALL_H = 3.4
NOTE = 'bk_note'


def strap(P, x, y, z, n=1):
    """a brick of banded notes: a bundle of 0.16 by 0.07 notes, its paper strap"""
    for k in range(n): P.box(NOTE, x, x + 0.16, y, y + 0.07, z + k * 0.012, z + k * 0.012 + 0.011)
    P.box('bk_strap', x + 0.06, x + 0.09, y - 0.002, y + 0.072, z, z + n * 0.012 + 0.001)


def glass(P, ox, oy, rng):
    """the teller line, a tile long: its counter with a marble front, the bandit glass in brass frames to 2.4 m, a window every 2 m with its
    deal tray and its number plate; the glass starred where it held"""
    y0 = oy + 0.4
    P.box('bk_marble_d', ox - 6.0, ox + 6.0, y0, y0 + 0.7, 0.0, 1.1); P.box('bk_marble', ox - 6.0, ox + 6.0, y0 - 0.06, y0 + 0.4, 1.1, 1.15)
    P.box('bk_brass', ox - 6.0, ox + 6.0, y0 - 0.005, y0, 0.0, 0.1)
    P.box('bk_glass', ox - 6.0, ox + 6.0, y0 + 0.18, y0 + 0.22, 1.15, 2.4)
    for k in range(7): x = ox - 6.0 + k * 2.0; P.box('bk_brass', max(ox - 6.0, x - 0.04), min(ox + 6.0, x + 0.04), y0 + 0.15, y0 + 0.25, 1.15, 2.45)
    P.box('bk_brass', ox - 6.0, ox + 6.0, y0 + 0.15, y0 + 0.25, 2.4, 2.48)
    for k in range(6):
        x = ox - 5.0 + k * 2.0
        P.box('bk_brass', x - 0.3, x + 0.3, y0 - 0.15, y0 + 0.4, 1.12, 1.16)                                 # the deal tray, under the glass
        P.box('black', x - 0.12, x + 0.12, y0 + 0.17, y0 + 0.18, 2.1, 2.3); P.box('bk_brass', x - 0.1, x + 0.1, y0 + 0.165, y0 + 0.17, 2.14, 2.26)   # its number plate
    for (u, z) in ((ox - 3.4, 1.7), (ox - 3.1, 1.85), (ox + 1.6, 1.6), (ox + 4.4, 1.9)):
        P.box('pd_star', u - 0.09, u + 0.09, y0 + 0.175, y0 + 0.18, z - 0.09, z + 0.09)
        for a in range(6): t = a * 1.05; P.bar('pd_star', (u, y0 + 0.174, z), (u + 0.25 * math.cos(t), y0 + 0.174, z + 0.25 * math.sin(t)), 0.006)


def counter(P, ox, oy, rng):
    """the counter's end where the glass stops: the line's return, waist high, marble-fronted, its gate swung open, a pen on a chain"""
    y0 = oy + 0.4
    P.box('bk_marble_d', ox - 3.0, ox + 1.0, y0, y0 + 0.7, 0.0, 1.1); P.box('bk_marble', ox - 3.05, ox + 1.05, y0 - 0.06, y0 + 0.76, 1.1, 1.15)
    P.box('bk_marble_d', ox + 0.3, ox + 1.0, y0 + 0.7, y0 + 2.6, 0.0, 1.1); P.box('bk_marble', ox + 0.25, ox + 1.05, y0 + 0.7, y0 + 2.6, 1.1, 1.15)
    P.box('bk_brass', ox - 3.0, ox + 1.0, y0 - 0.005, y0, 0.0, 0.1)
    P.poly('bk_wood', [(ox - 3.0, y0 + 0.7), (ox - 2.97, y0 + 0.73), (ox - 3.6, y0 + 1.4), (ox - 3.63, y0 + 1.37)], 0.0, 0.95)   # the gate
    for _ in range(14): u, v = ox + rng.uniform(-3.5, 2.0), oy + rng.uniform(-0.6, 0.35); P.box(('paper', 'white')[rng.randint(2)], u, u + 0.15, v, v + 0.07, 0.0, 0.004)


def stations(P, ox, oy, rng):
    """two tellers' stations behind the line: a laminate desk, the cash drawer pulled and empty, a coin counter, a dead screen, a receipt
    printer, a stool on its side"""
    for dx in (-3.4, -0.9, 1.6):
        x0 = ox + dx
        P.box('bk_wood_l', x0, x0 + 1.8, oy + 0.4, oy + 1.1, 0.0, 0.8); P.box('sc_top', x0 - 0.02, x0 + 1.82, oy + 0.38, oy + 1.12, 0.8, 0.83)
        P.box('pd_steel', x0 + 0.5, x0 + 1.1, oy + 0.0, oy + 0.4, 0.62, 0.74); P.box('black', x0 + 0.55, x0 + 1.05, oy + 0.04, oy + 0.36, 0.735, 0.74)   # the drawer, empty
        P.box('black', x0 + 0.2, x0 + 0.7, oy + 0.8, oy + 0.86, 0.83, 1.2); P.box('pd_steel', x0 + 1.2, x0 + 1.55, oy + 0.55, oy + 0.85, 0.83, 1.0)
        P.box('black', x0 + 1.25, x0 + 1.5, oy + 0.5, oy + 0.55, 0.88, 0.96)
    P.drum('black', ox + 0.3, oy - 0.3, 0.0, 0.05, 0.2, 10); P.bar('pd_steel', (ox + 0.3, oy - 0.3, 0.05), (ox + 0.9, oy - 0.1, 0.12), 0.025)
    for _ in range(10): u, v = ox + rng.uniform(-2.5, 3.0), oy + rng.uniform(-0.7, 0.3); P.drum(('chrome', 'bk_brass')[rng.randint(2)], u, v, 0.0, 0.004, 0.012, 6)   # coins


def safes(P, ox, oy, rng):
    """the tellers' cash safes on their wheels: three steel boxes, doors open and empty, one rolled out and over"""
    for k, dx in enumerate((-1.6, -0.6)):
        x0 = ox + dx; P.box('bk_safe', x0, x0 + 0.8, oy + 0.6, oy + 1.3, 0.1, 1.2)
        for (u, v) in ((x0 + 0.1, oy + 0.7), (x0 + 0.7, oy + 0.7)): P.drum('black', u, v, 0.0, 0.1, 0.05, 6)
        P.box('black', x0 + 0.05, x0 + 0.75, oy + 0.59, oy + 0.6, 0.15, 1.15); P.box('pd_steel', x0 + 0.1, x0 + 0.7, oy + 0.65, oy + 1.25, 0.6, 0.62)
        P.poly('bk_safe', [(x0 + 0.8, oy + 0.6), (x0 + 0.84, oy + 0.58), (x0 + 1.2, oy + 0.0), (x0 + 1.16, oy - 0.02)], 0.15, 1.15)   # its door
        P.drum('chrome', x0 + 1.0, oy + 0.28, 0.6, 0.65, 0.06, 8)
    for x0 in (ox - 3.2, ox - 2.3): P.box('bk_safe', x0, x0 + 0.8, oy + 1.5, oy + 2.2, 0.1, 1.2); P.box('pd_steel', x0 + 0.35, x0 + 0.45, oy + 1.48, oy + 1.5, 0.6, 0.7)   # two shut, at the back
    P.box('bk_safe', ox + 0.9, ox + 2.0, oy + 0.5, oy + 1.2, 0.0, 0.8); P.box('black', ox + 0.95, ox + 1.95, oy + 0.48, oy + 0.5, 0.05, 0.75)   # over on its side
    for (u, v) in ((ox + 1.1, oy + 0.4), (ox + 1.8, oy + 0.4)): P.wheel('black', u, v, 0.45, 0.05, 0.04, 8)


def files(P, ox, oy, rng):
    """loan files in steel lateral cabinets: one standing with its drawers out, two tipped over, the folders fanned out"""
    P.box('bk_cab', ox - 2.0, ox - 1.1, oy + 0.9, oy + 1.4, 0.0, 1.4)
    for x in (ox - 3.2, ox + 2.4): P.box('bk_cab', x, x + 0.9, oy + 1.6, oy + 2.1, 0.0, 1.4); P.box('chrome', x + 0.35, x + 0.55, oy + 1.58, oy + 1.6, 1.1, 1.13)
    for j in range(4):
        z = 0.05 + j * 0.34; P.box('chrome', ox - 1.65, ox - 1.45, oy + 0.88, oy + 0.9, z + 0.24, z + 0.27)
        if j in (0, 2): P.box('bk_cab', ox - 1.98, ox - 1.12, oy + 0.4, oy + 0.9, z + 0.02, z + 0.3); P.box('bk_folder', ox - 1.94, ox - 1.16, oy + 0.43, oy + 0.87, z + 0.28, z + 0.34)
    P.box('bk_cab', ox - 0.8, ox + 0.6, oy + 0.6, oy + 1.1, 0.0, 0.9); P.box('bk_cab', ox + 0.9, ox + 2.3, oy + 0.9, oy + 1.4, 0.0, 0.9)   # tipped on their backs
    for _ in range(34):
        u, v = ox + rng.uniform(-2.4, 2.8), oy + rng.uniform(-0.6, 0.6); a = rng.uniform(-0.7, 0.7); ca, sa = math.cos(a), math.sin(a)
        P.poly(('bk_folder', 'paper', 'white')[rng.randint(3)], [(u + p * ca - q * sa, v + p * sa + q * ca) for (p, q) in ((-0.16, -0.12), (0.16, -0.12), (0.16, 0.12), (-0.16, 0.12))], 0.0, 0.006)


def column(P, ox, oy, rng):
    """a marble column, square, 1 m on a side, to the floor above (drawn 5 m up): its brass shoe, its corners chipped, a bullet's scar"""
    x0, x1, y0, y1 = ox - 0.5, ox + 0.5, oy + 0.2, oy + 1.2
    P.box('bk_marble', x0, x1, y0, y1, 0.0, 5.0); P.box('bk_brass', x0 - 0.04, x1 + 0.04, y0 - 0.04, y1 + 0.04, 0.0, 0.2)
    P.box('bk_marble_d', x0 - 0.02, x1 + 0.02, y0 - 0.02, y1 + 0.02, 4.7, 5.0)
    for (u, z) in ((x0 + 0.05, 1.3), (x1 - 0.18, 0.7), (x0 + 0.3, 2.4)): P.box('bk_plaster_d', u, u + 0.13, y0 - 0.01, y0, z, z + 0.15)   # chips
    for _ in range(8): u, v = ox + rng.uniform(-1.2, 1.2), oy + rng.uniform(-0.4, 0.2); P.box('bk_marble', u, u + 0.08, v, v + 0.06, 0.0, 0.03)


def desks(P, ox, oy, rng):
    """an officer's desk on the platform, heavy walnut, pushed over on its back for cover (its top to the south, its drawers' backs up), its
    leather chair, the guest chairs, the nameplate and the green lamp on the floor"""
    P.box('bk_wood', ox - 1.0, ox + 1.0, oy + 0.4, oy + 0.45, 0.0, 0.85)                                       # its top, stood up
    P.box('bk_wood_d', ox - 0.95, ox + 0.95, oy + 0.45, oy + 1.2, 0.0, 0.85)                                    # its body behind
    P.box('bk_wood_d', ox - 0.6, ox + 0.0, oy + 1.2, oy + 1.25, 0.1, 0.75)
    P.box('bk_leather', ox + 1.3, ox + 1.95, oy + 0.6, oy + 1.25, 0.0, 0.5); P.box('bk_leather', ox + 1.3, ox + 1.95, oy + 1.25, oy + 1.4, 0.4, 1.1)   # the chair
    for dx in (-2.2, -1.5): P.box('bk_leather', ox + dx, ox + dx + 0.55, oy - 0.1, oy + 0.45, 0.0, 0.45)
    P.box('bk_brass', ox - 0.3, ox + 0.1, oy - 0.3, oy - 0.22, 0.0, 0.07); P.box('black', ox - 0.28, ox + 0.08, oy - 0.305, oy - 0.3, 0.01, 0.06)   # the nameplate
    P.drum('bk_lamp', ox + 0.6, oy - 0.2, 0.0, 0.14, 0.13, 10)
    x0 = ox - 3.8; P.box('bk_wood_d', x0, x0 + 1.6, oy + 1.4, oy + 2.2, 0.0, 0.74); P.box('bk_wood', x0 - 0.02, x0 + 1.62, oy + 1.38, oy + 2.22, 0.74, 0.78)   # a second desk, standing
    P.box('bk_leather', x0 + 0.5, x0 + 1.1, oy + 2.3, oy + 2.9, 0.0, 0.5); P.box('bk_leather', x0 + 0.5, x0 + 1.1, oy + 2.8, oy + 2.95, 0.4, 1.0)
    P.box('bk_wood_d', ox - 1.0, ox + 2.2, oy + 2.6, oy + 3.0, 0.0, 0.75)                                    # a credenza behind
    for x in np.arange(ox - 4.2, ox + 3.6, 1.3): P.box('bk_brass', x - 0.03, x + 0.03, oy - 0.95, oy - 0.89, 0.0, 0.9)   # the platform's brass rail
    P.box('bk_brass', ox - 4.2, ox + 1.0, oy - 0.95, oy - 0.89, 0.85, 0.9); P.bar('bk_brass', (ox + 1.0, oy - 0.92, 0.88), (ox + 2.2, oy - 1.6, 0.05), 0.03)   # bent down where it broke
    for _ in range(12): u, v = ox + rng.uniform(-2.4, 2.4), oy + rng.uniform(-0.7, 0.2); P.box(('paper', 'white', 'bk_folder')[rng.randint(3)], u, u + 0.21, v, v + 0.28, 0.0, 0.004)


def island(P, ox, oy, rng):
    """a check-writing island: its marble top on a brass stand, the slips in their racks, a pen on its chain; slips blown all round it"""
    P.box('bk_brass', ox - 0.15, ox + 0.15, oy + 0.6, oy + 0.9, 0.0, 1.05); P.box('bk_brass', ox - 0.5, ox + 0.5, oy + 0.4, oy + 1.1, 0.0, 0.06)
    P.box('bk_marble', ox - 1.0, ox + 1.0, oy + 0.35, oy + 1.15, 1.05, 1.12)
    P.box('bk_brass', ox - 0.9, ox + 0.9, oy + 0.7, oy + 0.8, 1.12, 1.4)
    for k in range(6): x = ox - 0.85 + k * 0.29; P.box(('white', 'bk_slip_g', 'paper')[k % 3], x, x + 0.22, oy + 0.72, oy + 0.78, 1.15, 1.38)
    P.bar('chrome', (ox + 0.6, oy + 0.75, 1.12), (ox + 0.9, oy + 0.3, 1.13), 0.006)
    for dx in (-3.0,):                                                                                         # a second, standing
        P.box('bk_brass', ox + dx - 0.15, ox + dx + 0.15, oy + 1.6, oy + 1.9, 0.0, 1.05); P.box('bk_marble', ox + dx - 1.0, ox + dx + 1.0, oy + 1.35, oy + 2.15, 1.05, 1.12)
        P.box('bk_brass', ox + dx - 0.9, ox + dx + 0.9, oy + 1.7, oy + 1.8, 1.12, 1.4)
    P.box('bk_brass', ox + 1.3, ox + 1.5, oy + 0.1, oy + 0.9, 0.0, 0.08); P.box('bk_marble', ox + 1.0, ox + 2.6, oy + 0.0, oy + 0.9, 0.08, 0.14)   # a second one, toppled
    for _ in range(90): u, v = ox + rng.uniform(-4.0, 3.0), oy + rng.uniform(-0.8, 2.4); P.box(('white', 'bk_slip_g', 'paper')[rng.randint(3)], u, u + 0.16, v, v + 0.07, 0.0, 0.004)


def chairs(P, ox, oy, rng):
    """the waiting chairs, leather club chairs, knocked into a heap with their low table, one on its back"""
    for (dx, dy, back) in ((-1.4, 0.4, False), (-0.5, 0.7, False), (0.6, 0.3, True), (1.3, 1.0, False)):
        x, y = ox + dx, oy + dy
        if back: P.box('bk_leather', x, x + 0.8, y, y + 0.5, 0.0, 0.8); P.box('bk_leather', x, x + 0.8, y + 0.5, y + 0.9, 0.0, 0.4)
        else: P.box('bk_leather', x, x + 0.8, y, y + 0.8, 0.0, 0.45); P.box('bk_leather', x, x + 0.8, y + 0.6, y + 0.8, 0.45, 0.85); P.box('bk_leather', x - 0.05, x + 0.05, y, y + 0.8, 0.45, 0.6); P.box('bk_leather', x + 0.75, x + 0.85, y, y + 0.8, 0.45, 0.6)
    P.box('bk_wood', ox - 0.6, ox + 0.6, oy - 0.3, oy + 0.3, 0.0, 0.42); P.box('bk_glass', ox - 0.55, ox + 0.55, oy - 0.25, oy + 0.25, 0.42, 0.44)
    for (dx, dy) in ((-3.6, 1.6), (-2.7, 2.0), (2.6, 1.8)): x, y = ox + dx, oy + dy; P.box('bk_leather', x, x + 0.8, y, y + 0.8, 0.0, 0.45); P.box('bk_leather', x, x + 0.8, y + 0.6, y + 0.8, 0.45, 0.85)
    P.drum('bk_marble_d', ox - 3.1, oy + 0.4, 0.0, 0.6, 0.35, 12); P.drum('stain', ox - 3.1, oy + 0.4, 0.6, 0.62, 0.3, 12)   # a planter, its palm dead
    for a in range(7): t = a * 0.9; P.bar('bk_dead', (ox - 3.1, oy + 0.4, 0.6), (ox - 3.1 + 0.8 * math.cos(t), oy + 0.4 + 0.8 * math.sin(t), 0.3 + 0.4 * (a % 2)), 0.03)


def paper(P, ox, oy, rng):
    """paper drifted: ledgers splayed, statements, slips, and the banded notes nobody wants, a strap burst into a fan of them"""
    for _ in range(190):
        u, v = ox + rng.uniform(-4.0, 4.0), oy + rng.uniform(-0.4, 3.0); a = rng.uniform(-1.2, 1.2); ca, sa = math.cos(a), math.sin(a)
        w_, d_ = rng.choice((0.1, 0.15, 0.08)), rng.choice((0.13, 0.11, 0.035)); z = rng.uniform(0.0, 0.08)
        P.poly(('paper', 'white', 'bk_slip_g', NOTE, NOTE)[rng.randint(5)], [(u + p * ca - q * sa, v + p * sa + q * ca) for (p, q) in ((-w_, -d_), (w_, -d_), (w_, d_), (-w_, d_))], z, z + 0.004)
    for (u, v) in ((ox - 1.0, oy + 0.6), (ox + 0.8, oy + 1.3), (ox - 3.0, oy + 1.8), (ox + 2.6, oy + 0.3)):        # ledgers, splayed open
        P.box('bk_ledger', u, u + 0.45, v, v + 0.32, 0.0, 0.04); P.box('white', u + 0.03, u + 0.42, v + 0.02, v + 0.3, 0.04, 0.045)
    for (bx, by) in ((1.4, 0.2), (-2.2, 0.4), (0.0, 2.2)):
        for k in range(5): strap(P, ox + bx + rng.uniform(-0.3, 0.3), oy + by + k * 0.1, 0.0, rng.randint(3, 9))


def vaultdoor(P, ox, oy, rng):
    """the vault's round steel door standing open on its hinge arm, turned to face us: the disc 2.6 m across and 0.6 thick, its rim of
    boltwork, the bolts out, the boltwork's cover and the time lock's glass on its back, the hinge's heavy arm; the collar in the wall"""
    yc, zc, Rr = oy + 0.9, 1.45, 1.3
    P.prism_y('bk_vault', yc - 0.3, yc + 0.3, [(ox + Rr * math.cos(6.2832 * i / 28), zc + Rr * math.sin(6.2832 * i / 28)) for i in range(28)])
    P.prism_y('bk_vault_d', yc - 0.32, yc - 0.3, [(ox + 1.0 * math.cos(6.2832 * i / 24), zc + 1.0 * math.sin(6.2832 * i / 24)) for i in range(24)])
    for i in range(16):                                                                                     # the bolts, out
        a = 6.2832 * i / 16; x, z = ox + (Rr + 0.05) * math.cos(a), zc + (Rr + 0.05) * math.sin(a)
        P.bar('chrome', (x, yc, z), (x + 0.16 * math.cos(a), yc, z + 0.16 * math.sin(a)), 0.045)
    P.box('pd_steel', ox - 0.5, ox + 0.5, yc - 0.34, yc - 0.32, zc - 0.4, zc + 0.3); P.box('bk_glass', ox - 0.35, ox + 0.35, yc - 0.345, yc - 0.34, zc - 0.3, zc + 0.2)   # the time lock under its glass
    for k in range(3): P.drum('black', ox - 0.22 + k * 0.22, yc - 0.35, zc - 0.05, zc + 0.05, 0.06, 10)
    P.drum('chrome', ox, yc - 0.33, zc + 0.5, zc + 0.6, 0.18, 12)                                             # the wheel's hub
    for a in range(3): t = a * 2.094 + 0.3; P.bar('chrome', (ox, yc - 0.36, zc + 0.55), (ox + 0.5 * math.cos(t), yc - 0.36, zc + 0.55 + 0.5 * math.sin(t)), 0.03)
    P.box('bk_vault_d', ox + Rr - 0.2, ox + Rr + 0.5, yc + 0.2, yc + 1.6, 0.3, 2.6)                           # the hinge arm into the wall
    P.box('bk_vault', ox + Rr + 0.4, ox + Rr + 1.4, yc + 1.4, yc + 2.0, 0.0, 3.2)                            # the collar in the wall
    P.box('black', ox - 0.6, ox + 0.6, oy + 0.0, oy + 0.3, 0.0, 0.03)


def boxes(P, ox, oy, rng):
    """a wall of safe deposit boxes a tile long, floor to 2.4 m: small brass-faced doors in rows, each with its two keyholes, most drilled
    out and hanging open, the long boxes gone from behind them"""
    y0, h = oy + 0.3, 2.4
    P.box('bk_vault_d', ox - 6.0, ox + 6.0, y0, y0 + 0.6, 0.0, h); P.box('bk_vault', ox - 6.0, ox + 6.0, y0, y0 + 0.62, h, h + 0.06)
    cols, rows_ = 40, 12; dw, dh = 12.0 / cols, (h - 0.2) / rows_
    for i in range(cols):
        for j in range(rows_):
            x, z = ox - 6.0 + i * dw, 0.1 + j * dh
            if rng.rand() < 0.34:
                P.box('black', x + 0.015, x + dw - 0.015, y0 - 0.002, y0, z + 0.015, z + dh - 0.015)
                if rng.rand() < 0.5: P.poly('bk_brass', [(x + 0.015, y0), (x + 0.03, y0 - 0.01), (x + 0.15, y0 - 0.22), (x + 0.135, y0 - 0.23)], z + 0.02, z + dh - 0.02)
            else:
                P.box('bk_brass', x + 0.015, x + dw - 0.015, y0 - 0.01, y0, z + 0.015, z + dh - 0.015)
                P.box('black', x + 0.08, x + 0.1, y0 - 0.012, y0 - 0.01, z + dh * 0.4, z + dh * 0.6); P.box('black', x + 0.16, x + 0.18, y0 - 0.012, y0 - 0.01, z + dh * 0.4, z + dh * 0.6)
    for _ in range(12): u, v = ox + rng.uniform(-5.8, 5.8), oy + rng.uniform(-0.5, 0.25); P.drum('chrome', u, v, 0.0, 0.006, 0.02, 6)   # drilled-out lock cores


def dumped(P, ox, oy, rng):
    """deposit boxes pulled out and dumped: the long steel boxes on their sides, lids open, their trays, papers, an empty ring box, a will"""
    for _ in range(40):
        x, y = ox + rng.uniform(-3.6, 3.4), oy + rng.uniform(0.0, 2.8); a = rng.uniform(-1.4, 1.4); ca, sa = math.cos(a), math.sin(a)
        P.poly('bk_dbox', [(x + p * ca - q * sa, y + p * sa + q * ca) for (p, q) in ((-0.3, -0.07), (0.3, -0.07), (0.3, 0.07), (-0.3, 0.07))], 0.0, 0.08)
        if rng.rand() < 0.5: P.poly('bk_dbox', [(x + p * ca - q * sa, y + p * sa + q * ca) for (p, q) in ((-0.3, 0.07), (0.3, 0.07), (0.3, 0.2), (-0.3, 0.2))], 0.0, 0.012)
    for _ in range(80):
        u, v = ox + rng.uniform(-4.0, 4.0), oy + rng.uniform(-0.6, 3.2); a = rng.uniform(-1.0, 1.0); ca, sa = math.cos(a), math.sin(a)
        P.poly(('paper', 'white', 'bk_folder')[rng.randint(3)], [(u + p * ca - q * sa, v + p * sa + q * ca) for (p, q) in ((-0.15, -0.11), (0.15, -0.11), (0.15, 0.11), (-0.15, 0.11))], 0.0, 0.005)
    P.box('bk_ringbox', ox + 0.4, ox + 0.5, oy + 0.9, oy + 1.0, 0.0, 0.06)
    for k in range(7): P.box('bk_dbox', ox - 1.0, ox - 0.4, oy + 1.4, oy + 1.55, k * 0.09, k * 0.09 + 0.08)   # a stack of them, emptied


def cage(P, ox, oy, rng):
    """the cash cage, a tile long: steel mesh on posts to 2.6 m round the counting room, its counter window with a slot, the cage door open"""
    y0, h = oy + 0.3, 2.6
    PD.mesh_x(P, ox - 6.0, ox + 6.0, y0, 0.0, h, gap=(ox - 0.6, ox + 0.4, 0.05, 2.1))
    P.box('pd_steel', ox + 2.5, ox + 3.7, y0 - 0.25, y0 + 0.25, 1.0, 1.05); P.box('black', ox + 2.8, ox + 3.4, y0 - 0.01, y0 + 0.01, 1.05, 1.15)   # the window's shelf and slot
    P.box('pd_post', ox - 6.0, ox + 6.0, y0 + 0.05, y0 + 2.5, h + 0.04, h + 0.06)
    for x in (ox - 4.5, ox + 1.5): P.box('pd_steel', x, x + 1.8, y0 + 1.0, y0 + 1.8, 0.0, 0.9); P.box('pd_steel', x - 0.02, x + 1.82, y0 + 0.98, y0 + 1.82, 0.9, 0.93)   # inside: its counters


def tables(P, ox, oy, rng):
    """counting tables, steel, one on its side for cover and one standing: a note counter on the floor, the straps of hundreds left in bricks
    on the standing one, nobody taking them"""
    P.box('pd_steel', ox - 1.8, ox - 0.2, oy + 0.4, oy + 0.45, 0.0, 0.8); P.box('pd_steel', ox - 1.75, ox - 0.25, oy + 0.45, oy + 0.55, 0.05, 0.75)   # on its side
    for x in (ox - 1.7, ox - 0.3): P.bar('pd_steel', (x, oy + 0.5, 0.1), (x, oy + 1.2, 0.1), 0.02)
    x0 = ox + 0.2; P.box('pd_steel', x0, x0 + 1.8, oy + 0.6, oy + 1.5, 0.82, 0.86)
    for (u, v) in ((x0 + 0.05, oy + 0.65), (x0 + 1.7, oy + 0.65), (x0 + 0.05, oy + 1.4), (x0 + 1.7, oy + 1.4)): P.box('pd_steel', u, u + 0.05, v, v + 0.05, 0.0, 0.82)
    for i in range(4):
        for j in range(3): strap(P, x0 + 0.15 + i * 0.4, oy + 0.75 + j * 0.22, 0.86, rng.randint(4, 12))
    x1 = ox - 3.6; P.box('pd_steel', x1, x1 + 1.8, oy + 1.6, oy + 2.5, 0.82, 0.86)                           # a second, standing, its bricks
    for (u, v) in ((x1 + 0.05, oy + 1.65), (x1 + 1.7, oy + 1.65), (x1 + 0.05, oy + 2.4), (x1 + 1.7, oy + 2.4)): P.box('pd_steel', u, u + 0.05, v, v + 0.05, 0.0, 0.82)
    for i in range(3):
        for j in range(2): strap(P, x1 + 0.2 + i * 0.5, oy + 1.75 + j * 0.3, 0.86, rng.randint(6, 14))
    P.box('pd_steel', ox + 2.4, ox + 3.4, oy + 1.2, oy + 1.8, 0.2, 1.0); P.box('black', ox + 2.45, ox + 3.35, oy + 1.25, oy + 1.75, 0.95, 1.0)   # a money cart, its bins empty
    for (u, v) in ((ox + 2.5, oy + 1.3), (ox + 3.3, oy + 1.3), (ox + 2.5, oy + 1.7), (ox + 3.3, oy + 1.7)): P.drum('black', u, v, 0.0, 0.2, 0.08, 8)
    P.box('black', ox - 0.6, ox - 0.1, oy - 0.3, oy + 0.05, 0.0, 0.25); P.box(NOTE, ox - 0.5, ox - 0.2, oy - 0.32, oy - 0.3, 0.12, 0.2)   # a note counter, down
    for _ in range(24): u, v = ox + rng.uniform(-2.0, 2.4), oy + rng.uniform(-0.6, 0.4); a = rng.uniform(-1, 1); P.poly(NOTE, [(u, v), (u + 0.16 * math.cos(a), v + 0.16 * math.sin(a)), (u + 0.16 * math.cos(a) - 0.07 * math.sin(a), v + 0.16 * math.sin(a) + 0.07 * math.cos(a)), (u - 0.07 * math.sin(a), v + 0.07 * math.cos(a))], 0.0, 0.003)


def wall_ew(P, ox, oy, rng):
    """the bank's wall, a tile long: a marble wainscot to a metre with its brass rail, plaster over it to 3.4 m, a cornice; soot, damp, the
    plaster cracked"""
    P.box('bk_marble_d', ox - 6.0, ox + 6.0, oy, oy + 0.35, 0.0, 1.0); P.box('bk_plaster', ox - 6.0, ox + 6.0, oy, oy + 0.35, 1.04, WALL_H)
    P.box('bk_brass', ox - 6.0, ox + 6.0, oy - 0.02, oy + 0.35, 1.0, 1.04)
    for k in range(7): x = ox - 6.0 + k * 2.0; P.box('bk_marble', max(ox - 6.0, x - 0.006), min(ox + 6.0, x + 0.006), oy - 0.004, oy, 0.0, 1.0)   # the wainscot's joints
    P.box('bk_plaster_d', ox - 6.0, ox + 6.0, oy - 0.08, oy + 0.37, WALL_H - 0.15, WALL_H)
    for _ in range(12): u, z = ox + rng.uniform(-5.8, 5.6), rng.uniform(1.2, 3.0); P.box('stain', u, u + rng.uniform(0.3, 1.2), oy - 0.006, oy - 0.004, z, z + rng.uniform(0.1, 0.5))
    for _ in range(3):
        x, z = ox + rng.uniform(-5, 5), rng.uniform(1.6, 2.9)
        for k in range(4): x1, z1 = x + rng.uniform(-0.4, 0.4), z + rng.uniform(-0.3, 0.1); P.bar('bk_plaster_d', (x, oy - 0.006, z), (x1, oy - 0.006, z1), 0.006); x, z = x1, z1


def wall_ns(P, ox, oy, rng):
    P.box('bk_marble_d', ox - 0.17, ox + 0.17, oy, oy + 12.0, 0.0, 1.0); P.box('bk_plaster', ox - 0.17, ox + 0.17, oy, oy + 12.0, 1.04, WALL_H)
    P.box('bk_brass', ox - 0.19, ox + 0.19, oy, oy + 12.0, 1.0, 1.04); P.box('bk_plaster_d', ox - 0.2, ox + 0.2, oy, oy + 12.0, WALL_H - 0.15, WALL_H)


HALL_F = dict(glass=glass, stations=stations, desks=desks, column=column, wall_ns=wall_ns, wall_ew=wall_ew, counter=counter, safes=safes, files=files,
              island=island, chairs=chairs, paper=paper)
VAULT_F = dict(boxes=boxes, cage=cage, vaultdoor=vaultdoor, tables=tables, dumped=dumped)


def bk_parts(P, rng):
    for k, f in HALL_F.items(): f(P, *BK_AT[k], rng)


def bk_vault_parts(P, rng):
    for k, f in VAULT_F.items(): f(P, *VAULT_AT[k], rng)


def bk_mats(bpy, NF, F, M, which):
    if which not in ('bk_pieces', 'bk_vault', 'tun_pieces'): return
    if which in ('bk_pieces', 'bk_vault'): PD.pd_mats(bpy, NF, F, M, 'pd_pieces')
    m = lambda n, role, step, mul: NF.material(bpy, n, role, step, mul)
    M.update(bk_marble=m('in_marble_bank', 'clay_bone', 3, 0.9), bk_marble_d=m('in_marble_bank_dark', 'tape_grey', 1, 1.0), bk_brass=m('in_brass_bank', 'clay_mustard', 2, 0.8),
             bk_glass=m('in_glass_teller', 'clay_teal', 1, 0.75), bk_wood=m('in_wood_walnut', 'clay_rust', 1, 0.9), bk_wood_d=m('in_wood_walnut_dark', 'clay_rust', 0, 1.0),
             bk_wood_l=m('in_laminate_station', 'tape_masking', 1, 0.95), bk_safe=m('in_paint_safe_grey', 'metal_painted', 2, 1.0), bk_cab=m('in_paint_cabinet_putty', 'clay_bone', 2, 0.9),
             bk_folder=m('in_card_folder_manila', 'tape_masking', 3, 0.9), bk_leather=m('in_leather_oxblood', 'clay_rust', 1, 1.0), bk_lamp=m('in_glass_lamp_green', 'clay_teal', 2, 0.9),
             bk_slip_g=m('in_paper_slip_green', 'clay_teal', 4, 0.85), bk_note=m('in_paper_dollar', 'clay_teal', 3, 0.75), bk_strap=m('in_paper_strap', 'clay_mustard', 3, 0.9),
             bk_ledger=m('in_cloth_ledger', 'clay_rust', 1, 0.9), bk_vault=m('in_steel_vault', 'tape_grey', 2, 0.9), bk_vault_d=m('in_steel_vault_dark', 'tape_grey', 1, 0.9),
             bk_dbox=m('in_steel_deposit_box', 'tape_grey', 2, 0.85), bk_ringbox=m('in_velvet_ringbox', 'clay_rust', 0, 1.0),
             bk_plaster=m('in_plaster_bank', 'clay_bone', 2, 0.92), bk_plaster_d=m('in_plaster_bank_dark', 'clay_bone', 1, 0.95), bk_dead=m('in_palm_dead', 'tape_masking', 1, 0.9))


TG.PARTS['bk_pieces'] = bk_parts
TG.PARTS['bk_vault'] = bk_vault_parts
TG.MAT_HOOKS.append(bk_mats)


# ---- the ceiling: the coffers ----------------------------------------------------------------------------------------------------
def ceil_bank(P, rng):
    """the banking hall's ceiling from under it: deep plaster coffers on beams (four by three in a bay, the beams on the bay's lines and between),
    a gilt bead round each coffer, a rosette in each, a dead chandelier hung in the middle of every bay (its ring and its arms), the plaster
    fallen to the lath here and there"""
    at = TG.at
    P.box('bk_plaster', -3.0, 63.0, -3.0, 63.0, 0.0, 0.02)                                                    # the coffers' backs
    for r in range(-1, 6):
        for k in range(3):
            y0, y1 = TG.band_y(r, k * 4.0, 0.4, 0.5); P.box('bk_plaster_d', -3.0, 63.0, y0, y1, 0.02, 0.52)         # the beams east to west
            y0, y1 = TG.band_y(r, k * 4.0, 0.52, 0.53); P.box('bk_gilt', -3.0, 63.0, y0, y1, 0.02, 0.06)
    for x in np.arange(-3.0, 63.01, 3.0):
        P.box('bk_plaster_d', x - 0.2, x + 0.2, -3.0, 63.0, 0.02, 0.52); P.box('bk_gilt', x - 0.26, x + 0.26, -3.0, 63.0, 0.02, 0.06)   # and north to south
    for r in range(5):
        for c in range(5):
            for i in range(4):
                for j in range(3):
                    x, y = at(c, r, 1.5 + i * 3.0, 2.0 + j * 4.0, 0.03); P.drum('bk_gilt', x, y, 0.02, 0.05, 0.22, 10)   # rosettes
            x, y = at(c, r, 6.0, 6.0, 1.6)                                                                    # the chandelier
            P.drum('bk_brass', x, y, 1.5, 1.6, 0.9, 20, 0.85); P.drum('black', x, y, 1.48, 1.5, 0.75, 20)
            for a in range(8):
                t = a * 0.785; P.bar('bk_brass', (x, y, 1.9), (x + 0.85 * math.cos(t), y + 0.85 * math.sin(t), 1.6), 0.02)
                P.drum('bk_glass', x + 0.85 * math.cos(t), y + 0.85 * math.sin(t), 1.6, 1.75, 0.07, 8)
            P.bar('black', (x, y, 1.9), (x, y + 0.4, 0.05), 0.015)
            for _ in range(rng.randint(2, 4)):                                                                # damp, soot
                x, y = at(c, r, rng.uniform(1.0, 11.0), rng.uniform(1.0, 11.0), 0.03); TG.bloom(P, 'stain', x, y, rng.uniform(0.4, 0.9), rng, 6)
            if rng.rand() < 0.55:                                                                             # plaster fallen to the lath
                i, j = rng.randint(0, 4), rng.randint(0, 3); x, y = at(c, r, 0.4 + i * 3.0, 0.4 + j * 4.0, 0.03)
                P.box('bk_lath', x, x + 2.2, y - 3.0, y, 0.025, 0.03)
                for k in range(10): P.box('black', x, x + 2.2, y - 0.3 * k - 0.04, y - 0.3 * k, 0.03, 0.032)


TG.CEILINGS['bank'] = (ceil_bank, 'bank/bank_ceiling.webp', "the banking hall's coffered plaster from under it: the beams both ways with a gilt bead, a rosette in every coffer, a dead chandelier in every bay, damp and soot, plaster fallen to the lath")
TG.CEIL_DATA['bank'] = 'bank/bank.json'


def ceil_mats(bpy, NF, F, M, which):
    if which != 'tun_pieces': return
    M.update(bk_gilt=NF.material(bpy, 'in_ceil_gilt', 'clay_mustard', 2, 0.85), bk_lath=NF.material(bpy, 'in_ceil_lath', 'clay_rust', 1, 0.9))


TG.MAT_HOOKS.append(ceil_mats)

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(glass='COVER', counter='LOW_COVER', stations='LOW_COVER', safes='COVER', files='COVER', column='COVER', desks='COVER', island='LOW_COVER',
            chairs='LOW_COVER', paper='LOW_COVER', vaultdoor='WALL', boxes='WALL', dumped='LOW_COVER', cage='COVER', tables='COVER', wall_ew='WALL', wall_ns='WALL')
HM = dict(glass=2.5, counter=1.15, stations=1.2, safes=1.2, files=1.4, column=5.0, desks=1.1, island=1.4, chairs=0.9, paper=0.2, vaultdoor=3.2, boxes=2.5,
          dumped=0.2, cage=2.66, tables=1.0, wall_ew=WALL_H, wall_ns=WALL_H)
NAME = dict(glass="THE TELLER LINE'S GLASS", counter="THE COUNTER'S END", stations='TELLER STATIONS', safes='A CASH SAFE', files='FILING CABINETS',
            column='A MARBLE COLUMN', desks="AN OFFICER'S DESK", island='A CHECK-WRITING ISLAND', chairs='WAITING CHAIRS', paper='PAPER DRIFTS',
            vaultdoor='THE VAULT DOOR', boxes='SAFE DEPOSIT BOXES', dumped='DUMPED DEPOSIT BOXES', cage='THE CASH CAGE', tables='COUNTING TABLES',
            wall_ew="THE BANK'S WALL", wall_ns="THE BANK'S WALL")
BOX = dict(glass=(-6.0, 6.01, -0.3, 1.2 + 2.5 * 1.45), stations=(-3.8, 3.8, -0.8, 1.2 + 1.3 * 1.45), desks=(-4.4, 3.8, -1.8, 3.1 + 1.2 * 1.45),
           column=(-1.3, 1.3, -0.5, 1.3 + 5.0 * 1.45), wall_ns=(-0.6, 0.6, -0.05, 12.1 + (WALL_H + 0.1) * 1.45), wall_ew=(-6.0, 6.01, -0.3, 0.45 + (WALL_H + 0.1) * 1.45),
           counter=(-3.9, 2.3, -0.7, 3.1 + 1.2 * 1.45), safes=(-3.4, 2.3, -0.3, 2.3 + 1.3 * 1.45), files=(-3.4, 3.5, -0.7, 2.2 + 1.5 * 1.45),
           island=(-4.3, 3.2, -0.9, 2.5 + 1.5 * 1.45), chairs=(-4.0, 3.6, -0.6, 2.9 + 1.0 * 1.45), paper=(-4.3, 4.3, -0.6, 3.3 + 0.3 * 1.45),
           boxes=(-6.0, 6.01, -0.6, 1.0 + 2.5 * 1.45), cage=(-6.0, 6.01, -0.4, 2.6 + 2.7 * 1.45), vaultdoor=(-1.8, 3.1, -0.1, 3.0 + 3.3 * 1.45),
           tables=(-3.9, 3.7, -0.7, 2.7 + 1.1 * 1.45), dumped=(-4.3, 4.3, -0.7, 3.4 + 0.7 * 1.45))
WALLS = ('wall_ew', 'glass', 'boxes', 'cage')
SHADOW = dict(wall_ns=0.5)


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'bk_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'bank_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    sz = {}
    for scene, AT in (('bk_pieces', BK_AT), ('bk_vault', VAULT_AT)):
        im = Image.open(os.path.join(REND, scene + '.png')).convert('RGBA')
        for key, (x, y) in AT.items():
            b = BOX[key]; sz[key] = TG.cut_piece(im, (x, y), (x + b[0], x + b[1], y + b[2], y + b[3]), 'bk_' + key, 'bank', SHADOW.get(key, 1.0))
    for key, v in sz.items():
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'bk_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='bank/bk_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells_ = lambda rows: ['bank/bank_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'bk_' + k: ent(k) for k in sz}
    art = {'version': 'cook7-bank-art-11-27', 'lane': "cook 7 (COOK FIVE's list, after COOK SIX)", 'stage': 'finished',
           'for': "COMBAT FOUR's bank (slices/fight_ground/bank/bank.json): the names its handoff asked for, the garage's format. floor.floor is the bank's marble in both rooms (1.2 m slabs of a warm grey stone, each its own shade with soft veins, the polish worn dull in a path, heel scuffs, a slab cracked, mud tracked in; a tile's edge is a joint); floor.ring the same.",
           'floor': {'floor': cells_(ROWS), 'ring': cells_(ROWS)}, 'kit': kit,
           'how_it_lays': {'the banking hall': "bk_glass a tile long so the teller line runs (G); bk_counter is the line's return with its gate; bk_column a square pier drawn 5 m up; bk_desks a walnut desk pushed over.",
                           'the vault floor': "bk_boxes and bk_cage a tile long so a run meets; bk_vaultdoor the round door turned to face the camera, its hinge arm and collar to the east (the vault's wall); bk_tables with the straps of notes left on them.",
                           'the walls': "bk_wall_ew / _ns: a marble wainscot, plaster to 3.4 m, a tile long."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'bank_art.json'))
    cp = os.path.join(REND, 'ceil_bank.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'bank_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'bank/bank.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "bank/bank_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):   # (the one agreed edit in COMBAT FOUR's file)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='bank/bank_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['bank'][2],
                              contract="bank.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat")
    json.dump(art, open(os.path.join(SHIP, 'bank_art.json'), 'w'), indent=1)
    print('bank: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK7_THE_BANK_11_27.webp: before and now on his phone, the vault floor, close in, the pieces, the floor, the ceiling"""
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub):
        im = Image.new('RGB', (WID, 64), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK); d.text((10, 38), sub, font=font(14), fill=DIM); rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    title('THE BANK, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens in the banking hall: before (every piece a stand-in), now, and now with the ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'bank_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'bank_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'bank_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, AND THE VAULT FLOOR', 'the teller line and the officers\' desks; the vault: its door, the deposit boxes, the cash cage, the counting tables')
    vault = os.path.join(page_dir, 'vault', 'bank_upright_open_a0.png')
    strip((('THE TELLER LINE', up(os.path.join(page_dir, 'bank_upright_glass_close.png'))), ('THE HALL', up(os.path.join(page_dir, 'bank_upright_desks_close.png'))),
           ('THE VAULT FLOOR', up(vault) if os.path.exists(vault) else Image.new('RGB', (390, 570), BG))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', 'the teller line, its end, the stations, safes, files, a column, a desk, an island, chairs, paper; the vault door, the boxes, the cage, the tables, the dumped boxes')
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'bk_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('glass', 'boxes'), 170); row_of(('cage', 'vaultdoor', 'column'), 200); row_of(('counter', 'stations', 'desks', 'safes'), 140)
    row_of(('files', 'island', 'chairs', 'tables'), 130); row_of(('paper', 'dumped'), 110); row_of(('wall_ew',), 110)
    title('THE MARBLE, AND THE CEILING AT FULL STRENGTH', '1.2 m slabs, veined, worn dull in a path; the coffers, the gilt, a dead chandelier in every bay')
    fl = Image.open(os.path.join(SHIP, 'bank_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'bank_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK7_THE_BANK_11_27.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook7-the-bank-11-27.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'bk_floor' else TG.scene_pieces(n, '--quick' in a) if n in ('bk_pieces', 'bk_vault') else TG.scene_ceiling('bank', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'plan':
        ID = {n: i for i, n in enumerate(sorted(set(['mall_terrazzo', 'bk_slab'])))}
        gid, dark, pale = plan_bk_floor(ID); v = np.clip(150 - dark * 160 + pale * 120, 0, 255).astype(np.uint8)
        Image.fromarray(v).save(a[1] if len(a) > 1 else '/tmp/bk_plan.png'); print('plan', v.shape, float(v.mean()))
    else: print(__doc__)
