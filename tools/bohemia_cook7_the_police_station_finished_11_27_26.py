#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the police station, finished] (11/27/26; COMBAT FOUR's BUILD 11/22e asked 'FOR COOK (SIX)'; VAMILY rule 480(b):
finished art where a stand-in still stands; rule 482; rules 461, 441, 416, 451(a), 479(b)).

COMBAT FOUR's police station (THE POLICE STATION, slices/fight_ground/police/police.json, laid by slices/bohemia_big_inside.js): an area
command station, eight fights in ten at its cell fought inside: its squad room (holding cells along the top, their bars seen through,
steel bunks; desks pushed together, filing cabinets tipped, case boxes spilled; the front counter and the lobby's bullet glass; officers'
lockers; the evidence cage) or its sally port (patrol cars on flat tires, property cages along the walls, barriers, cones). All 16 of its
pieces were stand-ins (the casino's cage, seats, bar, glass and screens, the tunnels' camp, the street board's bales, heaps, sandbags and
patrol car, the garage's walls) on the mall's floor, and its ceiling was drawn by the page. These are the pictures under its names,
through the master rig, ON this lane's truck stop tool (and the chain under it):

  THE FLOOR        police_floor_0.webp, five tiles by five. Rows 0 to 2 (floor.floor, floor.ring): THE SQUAD ROOM'S TILE, 30 cm vinyl
                   squares, most a pale grey, some a step darker, laid on the hall's calibrated slab; a path worn grey to the counter,
                   chair casters' arcs, coffee dried, boot scuffs. Rows 3 and 4 (floor.port, for the sally port once its layout names
                   the kind): THE SALLY PORT'S CONCRETE, the truck stop bay's (oil where the cars stood, saw cuts every 4 m, the wheel
                   paths, a drain). A tile's edge is a joint only: any tile meets any tile.
  THE PIECES       (police_art.json's kit, COMBAT FOUR's names)
    pd_cells       a tile of holding cells: three cells of block and bars, a bunk and a steel toilet in each, one door standing open
    pd_bunk        a cell's steel bunk dragged out, its thin mattress, a grey blanket
    pd_desks       four steel desks pushed into a block, dead monitors, a phone off its hook, a chair tipped
    pd_files       a row of filing cabinets, two standing, two tipped on their faces, drawers out, files fanned
    pd_boxes       case boxes spilled, lids off, the files across the floor
    pd_counter     the front counter, chest high, its computer and its bell, the forms in their trays
    pd_glass       the lobby's bullet glass on its low wall, a tile long, the pass-through tray, starred where it held
    pd_chairs      lobby chairs bolted on a beam, one seat gone
    pd_lockers     a bank of officers' lockers a tile long, doors hanging, a name tape left
    pd_evidence    the evidence cage, a tile long: mesh on posts, its shelves bare behind, the mesh cut and peeled back
    pd_cages       property cages along the sally port's wall, a tile long: mesh bays, their doors open, nothing in them
    pd_car         a patrol car on flat tires, black and white, its light bar dead, a door open
    pd_cones       cones and a sawhorse barricade
    pd_barrier     a water-filled barrier, emptied, dragged in on its side
    pd_wall_ew/_ns the station's block wall, painted, a dark wainscot, the blue stripe
  THE CEILING      police_ceiling.webp (rule 451(a), over the fight at 10%; the data names its kind 'grid'): five bays by five that repeat:
                   the dropped ceiling's 2-by-4 grid, the lay-in tiles stained and sagging, out in clusters to the ducts and the deck
                   above, a troffer in every bay, a camera's dome, a smoke head.

  /tmp/v/bin/python tools/bohemia_cook7_the_police_station_finished_11_27_26.py render pd_floor | pd_pieces | pd_port | ceil_police
  python3 tools/bohemia_cook7_the_police_station_finished_11_27_26.py cut
  python3 tools/bohemia_cook7_the_police_station_finished_11_27_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): the area command stations of the valley's
police (a public lobby behind bullet-resistant glass with a pass-through tray, a squad room of steel desks on vinyl tile under a lay-in
ceiling, holding cells of block and bars with a stainless bunk and toilet, banks of officers' lockers, an evidence cage of welded mesh,
a sally port that is a garage with roll-up doors at each end, property cages, black-and-white Interceptors with roof light bars,
orange water-filled barriers, cones). The twins: this lane's truck stop kit (the same rig and cut, the bay's concrete).
REUSE CHECK (REUSE-FIRST): the truck stop's tool (its bay's concrete, its block wall's build, its wheelset), the swap meet's chain
(materials, the chain-link material, the cut, the sheet), the hall's calibrated slab, the hospital's lay-in grid (its ceiling's way).
New here: the station's plan, its 16 pieces, its ceiling.
ANALOG HORROR: a phone off its hook on a desk in a station nobody answers; one cell's door standing open and the others locked with
nobody in them; a camera's dome over every bay of the ceiling.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook7_inside_kit as KIT                            # this lane's: the cut, the sheet, the ceiling's hand-off, once (rule 495(b))
import bohemia_cook7_the_truck_stop_finished_11_27_26 as TS            # this lane's: the truck stop (and the chain under it)

SM = TS.SM; TG = TS.TG; FW = TS.FW; HS = TS.HS
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND = TG.FG, TG.REND
SHIP = os.path.join(FG, 'police')
SQUAD, PORT = (0, 1, 2), (3, 4)
tile_xy = HS.tile_xy


# ---- the ground: the squad room's vinyl, the sally port's concrete ------------------------------------------------------------
# THE VINYL IS ITS OWN GROUND (the truck stop's finding: a joint drawn in the plan is lost on the ground's two-pixel mesh): the hall's slab with
# the shader's joints every 0.3 m and each square its own shade; the hall's measured multiplier (the same role and target)
TG.GROUNDS['pd_vct'] = dict(role=('tape_grey', 2), target=(150, 147, 140), h=0.0, alt=('tape_grey', 1), alt_amt=0.1, grit=0.05, speck=(60, 0.08),
                            joints=dict(pitch=0.3, width=0.008), panel_var=0.05)
TG.CAL0['pd_vct'] = 0.8994
TG.WEAR['pd_vct'] = 0.25
def plan_pd_floor(ID, seed=251):
    gid, dark, pale = TS.plan_ts_floor(ID, seed)                    # the truck stop bay's concrete for rows 3 and 4 (the port)
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed + 5)
    sq = row < 3
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    grain = FW.vnoise((H, W), 0.1 * PPM, rng)
    q = 0.3; gx = (lx / q).astype(int); gy = (ly / q).astype(int)
    pick = np.random.RandomState(seed + 2).rand(120, 120)[np.clip(gy + 40 * row, 0, 119), np.clip(gx + 40 * col, 0, 119)]
    d_sq = 0.09 + np.clip((0.5 - dust) / 0.3, 0, 1) * 0.07 + (grain - 0.5) * 0.03          # (each square's shade is the ground's own, pd_vct: the plan's two-tone stepped A3 at the joins)
    gid[sq] = ID['pd_vct']; dark[sq] = d_sq[sq]; pale[sq] = 0.0
    for r in SQUAD:
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]
            Wn = TG.win(X, Y, 0.9, 2.2); nn = FW.vnoise(X.shape, 0.9 * PPM, rng)
            ang = rng.uniform(0, math.pi); cx, cy = rng.uniform(4.5, 7.5), rng.uniform(4.5, 7.5)               # a path worn grey to the counter
            d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang)); D[:] += np.clip(1 - d0 / 1.3, 0, 1) * Wn * (0.06 + 0.05 * nn)
            for _ in range(rng.randint(2, 5)):                                                                 # chair casters' arcs
                cx, cy, R_ = rng.uniform(2, 10), rng.uniform(2, 10), rng.uniform(0.3, 0.7); a0 = rng.uniform(0, 6.3)
                d0 = np.hypot(X - cx, Y - cy); m = (np.abs(d0 - R_) < 0.015) & (np.abs(((np.arctan2(Y - cy, X - cx) - a0 + math.pi) % (2 * math.pi)) - math.pi) < 1.2)
                D[m] += 0.12
            for _ in range(rng.randint(5, 10)):                                                                # boot scuffs, black
                cx, cy = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5); a = rng.uniform(0, 3.14)
                D[seg_d(X, Y, cx, cy, cx + 0.2 * math.cos(a), cy + 0.2 * math.sin(a)) < 0.012] = 0.5
            if rng.rand() < 0.6:                                                                               # coffee, dried
                cx, cy = rng.uniform(2.5, 9.5), rng.uniform(2.5, 9.5); d0 = np.hypot(X - cx, Y - cy) * (0.8 + 0.5 * nn)
                D[:] = np.maximum(D, np.clip(1.1 - d0 / rng.uniform(0.3, 0.6), 0, 1) * 0.4)
            if rng.rand() < 0.4:                                                                               # a square lifted, its glue under
                i, j = rng.randint(6, 34), rng.randint(6, 34); m = (X > i * q + 0.01) & (X < (i + 1) * q - 0.01) & (Y > j * q + 0.01) & (Y < (j + 1) * q - 0.01)
                D[m] = 0.32 + 0.1 * nn[m]
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


seg_d = TS.seg_d
TG.PLANS['pd_floor'] = plan_pd_floor


def pd_floor_things(bpy, NF, M, rng):
    sq = FW.debris(bpy, NF, {'rubber': M['paper'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(24.6, 59.4)), 90)   # forms, files, a cup
    pt = FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(0.6, 23.4)), 30)
    return sq + pt


TG.GARAGE_THINGS['pd_floor'] = pd_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
PD_AT = dict(cells=(7.0, 47.0), lockers=(21.0, 47.0), evidence=(35.0, 47.0), glass=(49.0, 47.0), wall_ns=(57.5, 36.0),
             wall_ew=(7.0, 33.0), counter=(21.0, 33.0), desks=(34.0, 33.0), files=(46.0, 33.0),
             bunk=(7.0, 20.0), boxes=(18.0, 20.0), chairs=(29.0, 20.0))
PORT_AT = dict(cages=(8.0, 44.0), car=(26.0, 44.0), cones=(41.0, 44.0), barrier=(8.0, 28.0))
WALL_H = 3.0
BOXC = ('pd_box', 'pd_box', 'pd_box', 'card', 'white')


def bars_x(P, x0, x1, y, z0, z1, pitch=0.15, mat='pd_bar'):
    """a front of bars along x: flat bands top, middle and bottom, round bars on a pitch"""
    for z in (z0, (z0 + z1) * 0.45, z1 - 0.06): P.box(mat, x0, x1, y - 0.03, y + 0.03, z, z + 0.06)
    x = x0 + pitch / 2
    while x < x1: P.drum(mat, x, y, z0, z1, 0.014, 6); x += pitch


def mesh_x(P, x0, x1, y, z0, z1, gap=None, mat='pd_mesh', post='pd_post'):
    """welded mesh on posts along x: a wire every 0.1 m both ways (a gap cut out of it if given: (xa, xb, za, zb))"""
    for x in np.arange(x0, x1 + 1e-6, 1.5): P.box(post, max(x0, x - 0.03), min(x1, x + 0.03), y - 0.03, y + 0.03, z0, z1 + 0.04)
    P.box(post, x0, x1, y - 0.03, y + 0.03, z1, z1 + 0.04)
    for x in np.arange(x0 + 0.05, x1, 0.1):
        if gap and gap[0] < x < gap[1]: P.box(mat, x - 0.004, x + 0.004, y - 0.004, y + 0.004, z0, gap[2]); P.box(mat, x - 0.004, x + 0.004, y - 0.004, y + 0.004, gap[3], z1); continue
        P.box(mat, x - 0.004, x + 0.004, y - 0.004, y + 0.004, z0, z1)
    for z in np.arange(z0 + 0.05, z1, 0.1):
        if gap and gap[2] < z < gap[3]: P.box(mat, x0, gap[0], y - 0.004, y + 0.004, z - 0.004, z + 0.004); P.box(mat, gap[1], x1, y - 0.004, y + 0.004, z - 0.004, z + 0.004); continue
        P.box(mat, x0, x1, y - 0.004, y + 0.004, z - 0.004, z + 0.004)
    if gap:                                                                                           # the cut mesh peeled back toward us
        P.poly(mat, [(gap[0], y), (gap[0] + 0.03, y), (gap[0] - 0.2, y - 0.5), (gap[0] - 0.23, y - 0.5)], gap[2], gap[3])


def cells(P, ox, oy, rng):
    """a tile of holding cells: three cells of block 4 m wide and 3 m deep, fronts of bars to the south, a stainless bunk on the back wall,
    a steel toilet, a door standing open in one; the block walls between them (at the tile's edges, halves, so a run meets)"""
    y0, d, h = oy + 0.3, 3.2, 2.7
    P.box('pd_wall', ox - 6.0, ox + 6.0, y0 + d, y0 + d + 0.25, 0.0, h)                                       # the back wall
    P.box('pd_cap', ox - 6.0, ox + 6.0, y0 + 0.05, y0 + d + 0.25, h, h + 0.04)                                 # the slab over the cells
    for x in (ox - 6.0, ox - 2.0, ox + 2.0, ox + 6.0): P.box('pd_wall', max(ox - 6.0, x - 0.12), min(ox + 6.0, x + 0.12), y0, y0 + d, 0.0, h)
    for k, xc in enumerate((ox - 4.0, ox, ox + 4.0)):
        xa, xb = xc - 1.88, xc + 1.88
        if k == 1:                                                                                              # its door standing open
            bars_x(P, xa, xc - 0.5, y0, 0.0, h); bars_x(P, xc + 0.5, xb, y0, 0.0, h)
            P.poly('pd_bar', [(xc - 0.5, y0), (xc - 0.46, y0 + 0.02), (xc - 0.1, y0 - 0.92), (xc - 0.14, y0 - 0.94)], 0.02, h - 0.1)
        else: bars_x(P, xa, xb, y0, 0.0, h)
        P.box('pd_steel', xa + 0.1, xa + 2.0, y0 + d - 0.75, y0 + d - 0.02, 0.42, 0.48)                       # the bunk on the back wall
        P.box('pd_mat', xa + 0.15, xa + 1.9, y0 + d - 0.7, y0 + d - 0.07, 0.48, 0.55)
        P.box('pd_steel', xb - 0.6, xb - 0.1, y0 + d - 0.5, y0 + d - 0.02, 0.0, 0.85); P.drum('pd_steel', xb - 0.35, y0 + d - 0.55, 0.3, 0.42, 0.2, 10)   # the toilet
        P.box('black', xc - 0.25, xc + 0.25, y0 + d - 0.005, y0 + d, 1.8, 2.2)                                 # its slot of a window, wired glass
    P.box('pd_bar', ox - 6.0, ox + 6.0, y0 - 0.05, y0 + 0.05, h - 0.1, h + 0.04)


def bunk(P, ox, oy, rng):
    """a cell's steel bunk dragged out into the room: a stainless slab on its two brackets, the thin mattress half off, a grey blanket"""
    P.box('pd_steel', ox - 1.0, ox + 1.0, oy + 0.3, oy + 1.05, 0.42, 0.47)
    for x in (ox - 0.8, ox + 0.8): P.box('pd_steel', x - 0.04, x + 0.04, oy + 0.35, oy + 1.0, 0.0, 0.42)
    P.poly('pd_mat', [(ox - 0.95, oy + 0.35), (ox + 0.7, oy + 0.32), (ox + 0.75, oy + 1.0), (ox - 0.9, oy + 1.03)], 0.47, 0.55)
    P.poly('pd_blanket', [(ox + 0.4, oy + 0.1), (ox + 1.3, oy + 0.0), (ox + 1.4, oy + 0.8), (ox + 0.5, oy + 0.9)], 0.0, 0.04)
    P.box('pd_blanket', ox + 0.6, ox + 0.9, oy + 0.32, oy + 1.0, 0.47, 0.6)
    P.box('pd_steel', ox + 1.8, ox + 3.8, oy + 0.9, oy + 0.95, 0.0, 0.75); P.box('pd_steel', ox + 2.0, ox + 2.08, oy + 0.95, oy + 1.6, 0.6, 0.68)   # a second, on its side
    P.box('pd_steel', ox + 3.5, ox + 3.58, oy + 0.95, oy + 1.6, 0.6, 0.68)
    P.poly('pd_mat', [(ox - 3.1, oy + 0.6), (ox - 1.3, oy + 0.4), (ox - 1.2, oy + 1.15), (ox - 3.0, oy + 1.35)], 0.0, 0.08)   # a mattress on the floor
    P.poly('pd_blanket', [(ox - 2.9, oy + 0.7), (ox - 1.9, oy + 0.6), (ox - 1.8, oy + 1.2), (ox - 2.8, oy + 1.3)], 0.08, 0.11)
    P.drum('pd_steel', ox + 2.6, oy + 0.2, 0.0, 0.35, 0.17, 10, 0.2)                                                            # a bucket
    P.box('pd_steel', ox - 1.0, ox + 1.0, oy + 1.8, oy + 2.55, 0.42, 0.47); P.poly('pd_mat', [(ox - 0.95, oy + 1.85), (ox + 0.95, oy + 1.85), (ox + 0.9, oy + 2.5), (ox - 0.9, oy + 2.5)], 0.47, 0.55)   # a third bunk
    for x in (ox - 0.8, ox + 0.8): P.box('pd_steel', x - 0.04, x + 0.04, oy + 1.85, oy + 2.5, 0.0, 0.42)
    P.box('pd_steel', ox + 2.0, ox + 3.6, oy + 1.9, oy + 2.6, 0.0, 0.02); P.drum('pd_steel', ox + 2.8, oy + 2.25, 0.02, 0.75, 0.07, 8); P.drum('pd_steel', ox + 2.8, oy + 2.25, 0.72, 0.76, 0.5, 14)   # the dayroom's table on its plate, dragged in
    for (dx, dy) in ((2.1, 1.9), (3.5, 1.9), (2.1, 2.6), (3.5, 2.6)): P.drum('pd_steel', ox + dx, oy + dy, 0.02, 0.45, 0.16, 10)


def desks(P, ox, oy, rng):
    """four steel desks pushed into a block for cover: their tops, modesty panels, dead monitors, a keyboard, a phone off its hook, paper; a
    chair tipped on its back"""
    for (dx, dy) in ((-1.55, 0.4), (0.05, 0.4), (-1.55, 1.25), (0.05, 1.25), (-3.15, 0.4), (-3.15, 1.25)):
        x0, y0 = ox + dx, oy + dy; P.box('pd_desk', x0, x0 + 1.5, y0, y0 + 0.8, 0.0, 0.72); P.box('sc_top', x0 - 0.02, x0 + 1.52, y0 - 0.02, y0 + 0.82, 0.72, 0.75)
        P.box('black', x0 + 0.1, x0 + 1.4, y0 - 0.025, y0 - 0.02, 0.15, 0.6)
        mx = x0 + rng.uniform(0.3, 0.9); P.box('black', mx, mx + 0.5, y0 + 0.4, y0 + 0.47, 0.8, 1.15); P.box('pd_steel', mx + 0.2, mx + 0.3, y0 + 0.45, y0 + 0.55, 0.75, 0.8)
        P.box('black', mx, mx + 0.45, y0 + 0.1, y0 + 0.25, 0.75, 0.77)
        for _ in range(4): u, v = x0 + rng.uniform(0.05, 1.2), y0 + rng.uniform(0.05, 0.6); P.box(('paper', 'white')[rng.randint(2)], u, u + 0.21, v, v + 0.28, 0.75, 0.752)
    P.box('black', ox + 0.9, ox + 1.15, oy + 0.6, oy + 0.85, 0.75, 0.82); P.bar('black', (ox + 1.02, oy + 0.72, 0.8), (ox + 1.3, oy + 0.1, 0.2), 0.008)   # the phone, its handset hanging
    P.box('black', ox + 1.25, ox + 1.4, oy + 0.0, oy + 0.2, 0.15, 0.22)
    P.box('pd_chair', ox + 1.8, ox + 2.3, oy + 0.6, oy + 1.2, 0.05, 0.13); P.box('pd_chair', ox + 1.8, ox + 2.3, oy + 1.2, oy + 1.9, 0.0, 0.12)   # a chair tipped on its back
    P.drum('black', ox + 2.05, oy + 0.4, 0.0, 0.4, 0.03, 6)


def files(P, ox, oy, rng):
    """a row of four-drawer filing cabinets: two standing, drawers out; two tipped on their faces; files fanned across the floor"""
    for k, x in enumerate((ox - 2.6, ox - 2.1, ox - 1.6, ox - 1.1)):
        P.box('pd_file', x, x + 0.46, oy + 0.8, oy + 1.5, 0.0, 1.35)
        for j in range(4):
            z = 0.05 + j * 0.33; P.box('chrome', x + 0.17, x + 0.29, oy + 0.78, oy + 0.8, z + 0.22, z + 0.25)
            if (j + k) % 2 == 0: P.box('pd_file', x + 0.02, x + 0.44, oy + 0.3, oy + 0.8, z + 0.02, z + 0.3); P.box('tan', x + 0.05, x + 0.41, oy + 0.33, oy + 0.77, z + 0.28, z + 0.33)
    P.box('pd_file', ox - 0.4, ox + 0.95, oy + 0.4, oy + 0.86, 0.0, 0.46); P.box('pd_file', ox + 1.0, ox + 2.35, oy + 0.7, oy + 1.16, 0.0, 0.46)   # tipped, on their faces
    P.box('pd_file', ox + 0.2, ox + 1.55, oy + 1.3, oy + 1.76, 0.0, 0.46)
    for _ in range(30):
        u, v = ox + rng.uniform(-2.0, 2.6), oy + rng.uniform(-0.5, 0.45); a = rng.uniform(-0.6, 0.6); ca, sa = math.cos(a), math.sin(a)
        P.poly(('tan', 'paper', 'white')[rng.randint(3)], [(u + p * ca - q * sa, v + p * sa + q * ca) for (p, q) in ((-0.15, -0.11), (0.15, -0.11), (0.15, 0.11), (-0.15, 0.11))], 0.0, 0.006)


def boxes(P, ox, oy, rng):
    """case boxes spilled: bankers' boxes on their sides, lids off, files fanned out of them, a few still stacked"""
    for _ in range(26):
        x, y = ox + rng.uniform(-2.8, 2.6), oy + rng.uniform(0.0, 2.4); a = rng.uniform(-0.8, 0.8); ca, sa = math.cos(a), math.sin(a)
        P.poly(BOXC[rng.randint(len(BOXC))], [(x + p * ca - q * sa, y + p * sa + q * ca) for (p, q) in ((-0.2, -0.16), (0.2, -0.16), (0.2, 0.16), (-0.2, 0.16))], 0.0, 0.27)
    for (x, y, n) in ((ox + 1.2, oy + 1.4, 3), (ox + 1.65, oy + 1.4, 2), (ox - 2.6, oy + 2.0, 3), (ox - 2.15, oy + 2.0, 4), (ox - 2.4, oy + 2.4, 2)):
        for k in range(n): P.box('pd_box', x, x + 0.4, y, y + 0.32, k * 0.28, k * 0.28 + 0.27)
    for _ in range(70):
        u, v = ox + rng.uniform(-3.2, 3.2), oy + rng.uniform(-0.6, 2.8); a = rng.uniform(-1.0, 1.0); ca, sa = math.cos(a), math.sin(a)
        P.poly(('tan', 'paper', 'white')[rng.randint(3)], [(u + p * ca - q * sa, v + p * sa + q * ca) for (p, q) in ((-0.15, -0.11), (0.15, -0.11), (0.15, 0.11), (-0.15, 0.11))], 0.0, 0.006)


def counter(P, ox, oy, rng):
    """the front counter, chest high, two tiles of it as it stands in the lobby: its panelled front to us, its top, the computer, the bell, the
    forms in their trays, the gate at one end"""
    x0, x1, y0 = ox - 4.0, ox + 4.0, oy + 0.4
    P.box('pd_counter', x0, x1, y0, y0 + 0.75, 0.0, 1.1); P.box('sc_top', x0 - 0.03, x1 + 0.03, y0 - 0.06, y0 + 0.4, 1.1, 1.14)
    for k in range(8): x = x0 + 0.5 + k * 1.0; P.box('pd_trim', x, x + 0.02, y0 - 0.005, y0, 0.15, 1.0)
    P.box('pd_trim', x0, x1, y0 - 0.006, y0, 0.0, 0.12)
    P.box('sc_top', x0 + 0.05, x1 - 0.05, y0 + 0.4, y0 + 0.75, 0.76, 0.79)                                       # the work top behind
    for k in range(3): x = x0 + 1.2 + k * 2.6; P.box('black', x, x + 0.45, y0 + 0.45, y0 + 0.52, 0.79, 1.2); P.box('black', x, x + 0.45, y0 + 0.2, y0 + 0.3, 1.14, 1.16)
    P.drum('chrome', ox + 0.3, y0 + 0.1, 1.14, 1.2, 0.06, 10)                                                       # the bell
    for k in range(3): P.box('pd_tray', ox + 1.6 + k * 0.4, ox + 1.95 + k * 0.4, y0 + 0.02, y0 + 0.3, 1.14, 1.2); P.box('white', ox + 1.62 + k * 0.4, ox + 1.93 + k * 0.4, y0 + 0.04, y0 + 0.28, 1.17, 1.19)
    P.box('pd_counter', x1 - 0.1, x1 + 0.9, y0 + 0.65, y0 + 0.75, 0.0, 1.0)                                       # the gate, swung
    for _ in range(12): u, v = ox + rng.uniform(-4.0, 4.0), oy + rng.uniform(-0.6, 0.3); P.box(('paper', 'white')[rng.randint(2)], u, u + 0.21, v, v + 0.28, 0.0, 0.004)


def glass(P, ox, oy, rng):
    """the lobby's bullet glass, a tile long: a low block wall, the glass in its frames to 2.4 m (every 1.5 m a frame), the pass-through tray
    and the speaking grille at one window, the glass starred where it held"""
    y0 = oy + 0.4
    P.box('pd_wall', ox - 6.0, ox + 6.0, y0, y0 + 0.3, 0.0, 1.05); P.box('sc_top', ox - 6.0, ox + 6.0, y0 - 0.08, y0 + 0.38, 1.05, 1.09)
    P.box('pd_glass', ox - 6.0, ox + 6.0, y0 + 0.13, y0 + 0.17, 1.09, 2.4)
    for k in range(9): x = ox - 6.0 + k * 1.5; P.box('pd_frame', max(ox - 6.0, x - 0.04), min(ox + 6.0, x + 0.04), y0 + 0.1, y0 + 0.2, 1.09, 2.45)
    P.box('pd_frame', ox - 6.0, ox + 6.0, y0 + 0.1, y0 + 0.2, 2.4, 2.48)
    P.box('pd_steel', ox - 0.4, ox + 0.4, y0 - 0.15, y0 + 0.4, 1.06, 1.1); P.drum('pd_steel', ox, y0 + 0.12, 1.5, 1.52, 0.1, 10)   # the tray, the grille
    for (u, z) in ((ox - 3.6, 1.8), (ox - 3.3, 1.6), (ox + 2.2, 1.9), (ox + 4.6, 1.5)):                              # where it held: stars
        P.box('pd_star', u - 0.09, u + 0.09, y0 + 0.125, y0 + 0.13, z - 0.09, z + 0.09)
        for a in range(6): t = a * 1.05; P.bar('pd_star', (u, y0 + 0.124, z), (u + 0.25 * math.cos(t), y0 + 0.124, z + 0.25 * math.sin(t)), 0.006)


def chairs(P, ox, oy, rng):
    """lobby chairs bolted on steel beams, two rows back to back, one seat torn off and gone; a third beam knocked over"""
    beam(P, ox, oy + 0.5); beam(P, ox + 0.4, oy + 1.4, skip=None); beam(P, ox - 0.3, oy + 2.4, skip=0)
    P.box('pd_steel', ox - 3.2, ox - 0.6, oy - 0.3, oy - 0.22, 0.0, 0.08)                                       # knocked over: on its back
    for k in range(4): x = ox - 3.15 + k * 0.63; P.box('pd_seat', x + 0.02, x + 0.58, oy - 0.75, oy - 0.3, 0.0, 0.06); P.box('pd_seat', x + 0.02, x + 0.58, oy - 0.3, oy - 0.2, 0.0, 0.45)


def beam(P, ox, y0, skip=2):
    """one beam of four bolted seats"""
    P.box('pd_steel', ox - 1.3, ox + 1.3, y0 + 0.25, y0 + 0.33, 0.3, 0.36)
    for x in (ox - 1.0, ox + 1.0): P.box('pd_steel', x - 0.04, x + 0.04, y0 + 0.1, y0 + 0.5, 0.0, 0.3); P.box('pd_steel', x - 0.15, x + 0.15, y0 + 0.05, y0 + 0.55, 0.0, 0.02)
    for k in range(4):
        x = ox - 1.25 + k * 0.63
        if k == skip: continue
        P.box('pd_seat', x + 0.02, x + 0.58, y0 + 0.0, y0 + 0.5, 0.42, 0.47); P.box('pd_seat', x + 0.02, x + 0.58, y0 + 0.48, y0 + 0.55, 0.47, 0.9)


def lockers(P, ox, oy, rng):
    """a bank of officers' lockers a tile long, a man's height: 24 doors on a 0.5 m pitch, louvred, some hanging open and empty, a name tape
    left on one; the bench in front of them"""
    y0, h = oy + 0.3, 1.95
    P.box('pd_locker', ox - 6.0, ox + 6.0, y0, y0 + 0.5, 0.0, h); P.box('pd_locker_d', ox - 6.0, ox + 6.0, y0 - 0.01, y0, 0.0, 0.1)
    opened = {3, 9, 10, 17, 21}
    for k in range(25):
        x = ox - 6.0 + k * 0.5; P.box('pd_locker_d', max(ox - 6.0, x - 0.012), min(ox + 6.0, x + 0.012), y0 - 0.012, y0, 0.1, h)
    for k in range(24):
        x = ox - 6.0 + k * 0.5
        if k in opened:
            P.box('black', x + 0.03, x + 0.47, y0 - 0.002, y0, 0.15, h - 0.05)
            P.poly('pd_locker', [(x + 0.47, y0), (x + 0.49, y0 - 0.01), (x + 0.75, y0 - 0.38), (x + 0.73, y0 - 0.39)], 0.15, h - 0.05)
        else:
            for z in (1.55, 1.62, 1.69, 0.25, 0.32): P.box('pd_locker_d', x + 0.12, x + 0.38, y0 - 0.006, y0, z, z + 0.025)
            P.box('pd_steel', x + 0.4, x + 0.44, y0 - 0.02, y0, 0.95, 1.1)
    P.box('white', ox - 6.0 + 9 * 0.5 + 0.1, ox - 6.0 + 9 * 0.5 + 0.4, y0 - 0.008, y0 - 0.006, 1.8, 1.85)            # a name tape
    P.box('pd_bench', ox - 5.0, ox + 5.0, oy - 0.5, oy - 0.15, 0.42, 0.46)
    for x in (ox - 4.5, ox, ox + 4.5): P.box('pd_steel', x - 0.03, x + 0.03, oy - 0.45, oy - 0.2, 0.0, 0.42)


def evidence(P, ox, oy, rng):
    """the evidence cage, a tile long: welded mesh on posts to 2.6 m, its door, steel shelving behind it bare but for a few bags and boxes;
    the mesh cut and peeled back at one bay"""
    y0, h = oy + 0.3, 2.6
    mesh_x(P, ox - 6.0, ox + 6.0, y0, 0.0, h, gap=(ox + 1.2, ox + 2.2, 0.1, 1.5))
    P.box('pd_post', ox - 6.0, ox + 6.0, y0 + 0.05, y0 + 2.4, h + 0.04, h + 0.06)
    for k, x in enumerate(np.arange(ox - 5.6, ox + 5.5, 2.1)):                                                    # the shelving behind, bare
        for z in (0.05, 0.6, 1.15, 1.7, 2.25): P.box('pd_shelf', x, x + 1.8, y0 + 1.6, y0 + 2.2, z, z + 0.03)
        for u in (x, x + 1.77): P.box('pd_shelf', u, u + 0.03, y0 + 1.6, y0 + 2.2, 0.0, 2.3)
        for _ in range(rng.randint(1, 4)):
            z = (0.08, 0.63, 1.18, 1.73)[rng.randint(4)]; u = rng.uniform(x + 0.05, x + 1.4)
            P.box(('pd_bag', 'pd_box', 'tan')[rng.randint(3)], u, u + rng.uniform(0.2, 0.4), y0 + 1.65, y0 + 2.1, z + 0.03, z + rng.uniform(0.15, 0.35))
    for _ in range(8): u, v = ox + rng.uniform(0.6, 3.0), oy + rng.uniform(-0.6, 0.25); P.box(('pd_bag', 'paper')[rng.randint(2)], u, u + 0.25, v, v + 0.3, 0.0, 0.03)   # what came out of it


def cages(P, ox, oy, rng):
    """property cages along the sally port's wall, a tile long: welded mesh bays 2 m wide and 1.5 m deep to 2.4 m, their doors standing open,
    nothing in them but a bike wheel and a tag"""
    y0, d, h = oy + 0.3, 1.5, 2.4
    P.box('pd_wall', ox - 6.0, ox + 6.0, y0 + d, y0 + d + 0.25, 0.0, h + 0.5)
    for x in np.arange(ox - 6.0, ox + 6.01, 2.0):
        P.box('pd_post', max(ox - 6.0, x - 0.03), min(ox + 6.0, x + 0.03), y0, y0 + d, 0.0, h)
        for z in np.arange(0.05, h, 0.1): P.box('pd_mesh', max(ox - 6.0, x - 0.004), min(ox + 6.0, x + 0.004), y0, y0 + d, z - 0.004, z + 0.004)
    P.box('pd_post', ox - 6.0, ox + 6.0, y0 - 0.03, y0 + d, h, h + 0.04)
    for k in range(6):
        xa = ox - 6.0 + k * 2.0 + 0.05
        if k in (1, 4):
            P.poly('pd_mesh_door', [(xa, y0), (xa + 0.03, y0), (xa - 0.5, y0 - 1.1), (xa - 0.53, y0 - 1.1)], 0.05, h - 0.1)
        else:
            for x in np.arange(xa + 0.05, xa + 1.9, 0.1): P.box('pd_mesh', x - 0.004, x + 0.004, y0 - 0.004, y0 + 0.004, 0.0, h)
            for z in np.arange(0.05, h, 0.1): P.box('pd_mesh', xa, xa + 1.9, y0 - 0.004, y0 + 0.004, z - 0.004, z + 0.004)
    P.wheel('black', ox - 1.0, y0 + 0.8, 0.33, 0.33, 0.04, 20); P.box('white', ox + 3.3, ox + 3.4, y0 - 0.01, y0, 1.3, 1.45)   # a bike wheel; a tag


def car(P, ox, oy, rng):
    """a patrol car on flat tires, east to west, its nose west: black and white, the push bar, the light bar dead on its roof, a rear door
    open, a spotlight on the pillar; low enough to see over"""
    x0, x1, yc = ox - 2.55, ox + 2.55, oy + 1.4; hw = 0.95; zf = 0.18                                       # flat: the body sits low
    P.box('pd_car_k', x0 + 0.1, x1 - 0.1, yc - hw, yc + hw, zf + 0.2, zf + 0.62)                              # the lower body, black
    P.box('pd_car_w', x0 + 1.1, x1 - 1.3, yc - hw - 0.005, yc + hw + 0.005, zf + 0.3, zf + 0.7)                # the doors, white
    P.box('pd_car_k', x0, x0 + 1.15, yc - hw + 0.05, yc + hw - 0.05, zf + 0.3, zf + 0.72)                      # the hood
    P.box('pd_car_k', x1 - 1.0, x1, yc - hw + 0.05, yc + hw - 0.05, zf + 0.3, zf + 0.75)                       # the trunk
    P.box('glass_d', x0 + 1.15, x1 - 1.0, yc - hw + 0.12, yc + hw - 0.12, zf + 0.72, zf + 1.2)                # the cabin's glass
    P.box('pd_car_w', x0 + 1.55, x1 - 1.3, yc - hw + 0.15, yc + hw - 0.15, zf + 1.2, zf + 1.27)                # the roof
    P.box('black', ox - 0.6, ox + 0.0, yc - 0.65, yc + 0.65, zf + 1.27, zf + 1.42); P.box('pd_lens_r', ox - 0.58, ox - 0.02, yc - 0.63, yc - 0.02, zf + 1.3, zf + 1.42)
    P.box('pd_lens_b', ox - 0.58, ox - 0.02, yc + 0.02, yc + 0.63, zf + 1.3, zf + 1.42)
    P.box('black', x0 - 0.2, x0, yc - 0.6, yc + 0.6, zf + 0.15, zf + 0.75)                                    # the push bar
    for x in (x0 + 0.75, x1 - 0.85):                                                                         # flat tyres, splayed
        for s in (-1, 1): P.prism_x('black', x - 0.24, x + 0.24, [(yc + s * (hw - 0.08) + 0.33 * math.cos(6.2832 * i / 14), 0.24 + 0.3 * math.sin(6.2832 * i / 14)) for i in range(14)])
    P.poly('pd_car_w', [(x1 - 1.95, yc - hw), (x1 - 1.9, yc - hw - 0.04), (x1 - 2.45, yc - hw - 0.9), (x1 - 2.5, yc - hw - 0.86)], zf + 0.3, zf + 1.1)   # a rear door open
    P.drum('chrome', x0 + 1.2, yc - hw + 0.02, zf + 1.0, zf + 1.1, 0.07, 8)
    for _ in range(18): u, v = x1 - 2.5 + rng.uniform(-0.5, 0.6), yc - hw - rng.uniform(0.1, 1.2); P.box('glassbit', u, u + 0.06, v, v + 0.05, 0.0, 0.006)


def cones(P, ox, oy, rng):
    """traffic cones, a few stood and most knocked over, and a sawhorse barricade, its board blank"""
    for (dx, dy) in ((-1.2, 0.5), (-0.6, 0.9), (0.9, 0.4), (-2.4, 0.2), (2.2, 1.3), (-1.9, 1.9), (2.6, 0.3)): P.drum('pd_cone', ox + dx, oy + dy, 0.03, 0.7, 0.16, 12, 0.03); P.box('black', ox + dx - 0.2, ox + dx + 0.2, oy + dy - 0.2, oy + dy + 0.2, 0.0, 0.03)
    for (dx, dy, a) in ((0.2, 0.1, 0.4), (1.5, 1.0, -0.8), (-1.8, 1.4, 2.0), (-2.8, 0.9, 1.0), (2.9, 1.9, 2.6)):
        P.bar('pd_cone', (ox + dx, oy + dy, 0.12), (ox + dx + 0.65 * math.cos(a), oy + dy + 0.65 * math.sin(a), 0.06), 0.08)
    P.box('pd_horse', ox - 0.9, ox + 0.9, oy + 1.7, oy + 1.76, 0.75, 1.0); P.box('pd_cone', ox - 0.9, ox + 0.9, oy + 1.69, oy + 1.7, 0.8, 0.95)
    P.box('pd_horse', ox + 0.4, ox + 2.2, oy + 2.4, oy + 2.7, 0.0, 0.06); P.box('pd_cone', ox + 0.4, ox + 2.2, oy + 2.38, oy + 2.4, 0.0, 0.05)   # a second, flat on the floor
    for dx in (-3.0, -1.1):                                                                                       # two more standing, a line across
        P.box('pd_horse', ox + dx, ox + dx + 1.8, oy + 3.0, oy + 3.06, 0.75, 1.0); P.box('pd_cone', ox + dx, ox + dx + 1.8, oy + 2.99, oy + 3.0, 0.8, 0.95)
        for x in (ox + dx + 0.15, ox + dx + 1.65): P.bar('pd_horse', (x, oy + 3.03, 0.9), (x, oy + 2.75, 0.0), 0.025); P.bar('pd_horse', (x, oy + 3.03, 0.9), (x, oy + 3.3, 0.0), 0.025)
    for (dx, dy) in ((-3.0, 3.6), (0.9, 3.4), (2.8, 3.2)): P.drum('pd_cone', ox + dx, oy + dy, 0.03, 0.7, 0.16, 12, 0.03); P.box('black', ox + dx - 0.2, ox + dx + 0.2, oy + dy - 0.2, oy + dy + 0.2, 0.0, 0.03)
    for x in (ox - 0.75, ox + 0.75):
        P.bar('pd_horse', (x, oy + 1.73, 0.9), (x, oy + 1.45, 0.0), 0.025); P.bar('pd_horse', (x, oy + 1.73, 0.9), (x, oy + 2.0, 0.0), 0.025)


def barrier(P, ox, oy, rng):
    """a water-filled barrier, emptied and dragged in on its side: the orange-and-white plastic block, its fill cap off, scuffed; a second one
    standing"""
    P.prism_x('pd_barrier', ox - 1.0, ox + 1.0, [(oy + 0.3, 0.0), (oy + 1.1, 0.0), (oy + 0.95, 0.45), (oy + 0.45, 0.45)])     # on its side
    P.box('white', ox - 1.0, ox + 1.0, oy + 0.62, oy + 0.85, 0.45, 0.46)
    P.prism_x('pd_barrier', ox + 1.2, ox + 3.0, [(oy + 0.5, 0.0), (oy + 1.1, 0.0), (oy + 0.9, 1.05), (oy + 0.7, 1.05)])     # one standing
    P.prism_x('white', ox + 1.2, ox + 3.0, [(oy + 0.48, 0.55), (oy + 0.62, 0.55), (oy + 0.6, 0.7), (oy + 0.5, 0.7)])
    P.drum('black', ox + 2.1, oy + 0.8, 1.05, 1.08, 0.06, 8)
    P.prism_x('pd_barrier', ox - 3.2, ox - 1.4, [(oy + 0.9, 0.0), (oy + 1.5, 0.0), (oy + 1.3, 1.05), (oy + 1.1, 1.05)])     # a third, standing, a step back
    P.prism_x('white', ox - 3.2, ox - 1.4, [(oy + 0.88, 0.55), (oy + 1.02, 0.55), (oy + 1.0, 0.7), (oy + 0.9, 0.7)])
    P.prism_x('pd_barrier', ox - 1.0, ox + 1.0, [(oy + 1.5, 0.0), (oy + 2.3, 0.0), (oy + 2.15, 0.45), (oy + 1.65, 0.45)])     # a fourth, on its side behind
    P.box('white', ox - 1.0, ox + 1.0, oy + 1.82, oy + 2.05, 0.45, 0.46)


def wall_ew(P, ox, oy, rng):
    """the station's block wall, a tile long: painted block in 0.2 m courses over a dark wainscot, the blue stripe, a cap; scuffs; a notice
    board's ghost (the rectangle it kept clean)"""
    P.box('pd_wain', ox - 6.0, ox + 6.0, oy, oy + 0.3, 0.0, 1.0); P.box('pd_wall', ox - 6.0, ox + 6.0, oy, oy + 0.3, 1.12, WALL_H)
    P.box('pd_stripe', ox - 6.0, ox + 6.0, oy - 0.005, oy + 0.3, 1.0, 1.12)
    for k in range(1, 10): z = 1.12 + k * 0.2; P.box('ts_course', ox - 6.0, ox + 6.0, oy - 0.004, oy, z - 0.006, z + 0.006)
    P.box('pd_cap', ox - 6.0, ox + 6.0, oy - 0.02, oy + 0.32, WALL_H, WALL_H + 0.05)
    P.box('pd_ghost', ox - 2.8, ox - 1.2, oy - 0.006, oy - 0.004, 1.4, 2.3)
    for _ in range(14): u, z = ox + rng.uniform(-5.8, 5.6), rng.uniform(0.1, 2.6); P.box('stain', u, u + rng.uniform(0.2, 0.9), oy - 0.006, oy - 0.004, z, z + rng.uniform(0.05, 0.4))


def wall_ns(P, ox, oy, rng):
    P.box('pd_wain', ox - 0.15, ox + 0.15, oy, oy + 12.0, 0.0, 1.0); P.box('pd_wall', ox - 0.15, ox + 0.15, oy, oy + 12.0, 1.12, WALL_H)
    P.box('pd_stripe', ox - 0.16, ox + 0.16, oy, oy + 12.0, 1.0, 1.12)
    P.box('pd_cap', ox - 0.17, ox + 0.17, oy, oy + 12.0, WALL_H, WALL_H + 0.05)


SQUAD_F = dict(cells=cells, lockers=lockers, evidence=evidence, glass=glass, wall_ns=wall_ns, wall_ew=wall_ew, counter=counter, desks=desks,
               files=files, bunk=bunk, boxes=boxes, chairs=chairs)
PORT_F = dict(cages=cages, car=car, cones=cones, barrier=barrier)


def pd_parts(P, rng):
    for k, f in SQUAD_F.items(): f(P, *PD_AT[k], rng)


def pd_port_parts(P, rng):
    for k, f in PORT_F.items(): f(P, *PORT_AT[k], rng)


def pd_mats(bpy, NF, F, M, which):
    if which not in ('pd_pieces', 'pd_port', 'tun_pieces'): return
    if which in ('pd_pieces', 'pd_port'): TS.ts_mats(bpy, NF, F, M, 'ts_pieces')
    m = lambda n, role, step, mul: NF.material(bpy, n, role, step, mul)
    M.update(pd_wall=m('in_paint_station_block', 'clay_bone', 2, 0.95), pd_wain=m('in_paint_station_wainscot', 'clay_teal', 0, 1.0), pd_stripe=m('in_paint_station_stripe', 'clay_teal', 2, 0.95),
             pd_cap=m('in_block_cap_station', 'tape_grey', 2, 0.9), pd_ghost=m('in_paint_station_clean', 'clay_bone', 3, 0.92),
             pd_bar=m('in_steel_bars', 'metal_painted', 2, 0.95), pd_steel=m('in_stainless', 'tape_grey', 3, 0.85), pd_mat=m('in_mattress_cell', 'clay_teal', 1, 1.0),
             pd_blanket=m('in_cloth_blanket_grey', 'tape_grey', 1, 1.0), pd_desk=m('in_paint_desk_steel', 'tape_grey', 2, 0.9), pd_chair=m('in_plastic_chair_black', 'rubber', 2, 1.0),
             pd_file=m('in_paint_file_beige', 'clay_bone', 2, 0.95), pd_box=m('in_card_bankers_box', 'tape_masking', 3, 0.88), pd_counter=m('in_laminate_counter_oak', 'tape_masking', 1, 1.0),
             pd_trim=m('in_trim_dark', 'rubber', 2, 1.0), pd_tray=m('in_plastic_tray', 'rubber', 3, 1.0), pd_glass=m('in_glass_bullet', 'clay_teal', 1, 0.75),
             pd_frame=m('in_alum_frame', 'tape_grey', 2, 0.85), pd_star=m('in_glass_star', 'tape_grey', 4, 0.85), pd_seat=m('in_plastic_seat_blue', 'clay_teal', 1, 1.0),
             pd_locker=m('in_paint_locker_grey', 'metal_painted', 2, 1.0), pd_locker_d=m('in_paint_locker_dark', 'metal_painted', 1, 1.0), pd_bench=m('in_wood_bench_locker', 'tape_masking', 2, 0.9),
             pd_mesh=m('in_mesh_wire', 'tape_grey', 2, 0.85), pd_mesh_door=m('in_mesh_door', 'tape_grey', 2, 0.6), pd_post=m('in_steel_post', 'metal_painted', 1, 1.0),
             pd_shelf=m('in_steel_shelf', 'tape_grey', 2, 0.85), pd_bag=m('in_plastic_evidence_bag', 'tape_grey', 4, 0.8),
             pd_car_k=m('in_paint_car_black', 'rubber', 2, 1.0), pd_car_w=m('in_paint_car_white', 'tape_grey', 3, 0.92), pd_lens_r=m('in_lens_red_dead', 'clay_rust', 1, 1.0),
             pd_lens_b=m('in_lens_blue_dead', 'clay_teal', 1, 1.0), pd_cone=m('in_plastic_cone', 'clay_rust', 3, 1.0), pd_horse=m('in_paint_horse_white', 'tape_grey', 3, 0.9),
             pd_barrier=m('in_plastic_barrier_orange', 'clay_rust', 3, 0.95))


TG.PARTS['pd_pieces'] = pd_parts
TG.PARTS['pd_port'] = pd_port_parts
TG.MAT_HOOKS.append(pd_mats)


# ---- the ceiling: the dropped grid -----------------------------------------------------------------------------------------------
def ceil_police(P, rng):
    """the squad room's dropped ceiling from under it: the 2-by-4 lay-in grid (its tees every 0.6 m east to west and 1.2 m north to south),
    the tiles stained and sagging, out in clusters to the dark above them (ducts, the deck); a troffer in every bay, a camera's dome, a
    smoke head"""
    at = TG.at
    P.box('black', -3.0, 63.0, -3.0, 63.0, -0.6, -0.3)                                                       # the dark above it
    for r in range(-1, 6):
        _, y = at(0, r, 0, 5.0, -0.25); P.tube_x('pd_duct', -3.0, 63.0, y, -0.25, 0.25, 10)                       # a duct up there
    P.box('pd_tile', -3.0, 63.0, -3.0, 63.0, 0.0, 0.02)                                                         # the tiles
    for r in range(-1, 6):
        for k in range(10):                                                                                  # the main tees east to west, every 1.2 m (dark: at a tenth they are the grid)
            y = at(0, r, 0, k * 1.2)[1]; P.box('pd_tee', -3.0, 63.0, y - 0.05, y + 0.05, 0.02, 0.035)
    for x in np.arange(-3.0, 63.0, 0.6): P.box('pd_tee', x - 0.04, x + 0.04, -3.0, 63.0, 0.02, 0.035)              # the cross tees every 0.6 m
    for r in range(5):
        for c in range(5):
            x, y = at(c, r, 6.0, 6.0, 0.04); P.box('black', x - 0.34, x + 0.34, y - 0.64, y + 0.64, 0.034, 0.045); P.box('pd_troffer', x - 0.28, x + 0.28, y - 0.58, y + 0.58, 0.045, 0.05)   # the troffer, dead, its frame
            for u in (-0.15, 0.15): P.box('pd_tee', x + u - 0.015, x + u + 0.015, y - 0.6, y + 0.6, 0.05, 0.055)
            x, y = at(c, r, 9.0, 2.4, 0.08); P.drum('black', x, y, 0.035, 0.12, 0.12, 12, 0.08)                  # a camera's dome
            x, y = at(c, r, 3.0, 9.6, 0.04); P.drum('pd_tee', x, y, 0.035, 0.06, 0.05, 8)                         # a smoke head
            for _ in range(rng.randint(2, 4)):                                                                # water stains, rings
                x, y = at(c, r, rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5), 0.04); TG.bloom(P, 'pd_stain', x, y, rng.uniform(0.3, 0.7), rng, 6)
            x, y = at(c, r, 2.4, 3.6, 0.021); P.box('black', x + 0.03, x + 1.77, y - 2.37, y - 0.03, 0.021, 0.022)   # a run of tiles out at the same place in every bay: the dark and the duct through it
            for _ in range(rng.randint(3, 7)):                                                                # tiles out: the dark through them
                i, j = rng.randint(1, 19), rng.randint(1, 9); lx_, ly_ = i * 0.6, j * 1.2
                if abs(lx_ - 6.0) < 0.8 and abs(ly_ - 6.0) < 1.4: continue
                x, y = at(c, r, lx_, ly_, 0.021); P.box('black', x + 0.03, x + 0.57, y - 1.17, y - 0.03, 0.021, 0.022)
            if rng.rand() < 0.5:                                                                              # a tile hanging down by a corner
                x, y = at(c, r, rng.uniform(2, 9), rng.uniform(2, 9), 0.3); P.box('pd_tile', x, x + 0.6, y - 0.5, y, 0.25, 0.27)


TG.CEILINGS['police'] = (ceil_police, 'police/police_ceiling.webp', "the squad room's dropped ceiling from under it: the 2-by-4 grid, the tiles stained, out in clusters to the dark and the ducts above, a troffer, a camera's dome and a smoke head in every bay")
TG.CEIL_DATA['police'] = 'police/police.json'


def ceil_mats(bpy, NF, F, M, which):
    if which != 'tun_pieces': return
    M.update(pd_tile=NF.material(bpy, 'in_ceil_laytile', 'clay_bone', 3, 0.8), pd_tee=NF.material(bpy, 'in_ceil_tee', 'tape_grey', 1, 0.9),
             pd_troffer=NF.material(bpy, 'in_ceil_troffer', 'tape_grey', 2, 0.85), pd_duct=NF.material(bpy, 'in_ceil_duct', 'tape_grey', 1, 0.8),
             pd_stain=NF.material(bpy, 'in_ceil_stain', 'tape_masking', 0, 1.0))


TG.MAT_HOOKS.append(ceil_mats)

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(cells='COVER', bunk='LOW_COVER', desks='COVER', files='COVER', boxes='LOW_COVER', counter='COVER', glass='COVER', chairs='LOW_COVER',
            lockers='WALL', evidence='COVER', cages='COVER', car='COVER', cones='LOW_COVER', barrier='COVER', wall_ew='WALL', wall_ns='WALL')
HM = dict(cells=2.75, bunk=0.6, desks=1.2, files=1.4, boxes=0.6, counter=1.2, glass=2.5, chairs=0.9, lockers=1.95, evidence=2.66, cages=2.9,
          car=1.6, cones=1.0, barrier=1.1, wall_ew=WALL_H + 0.05, wall_ns=WALL_H + 0.05)
NAME = dict(cells='HOLDING CELLS', bunk='A STEEL BUNK', desks='THE DESKS', files='FILING CABINETS', boxes='SPILLED CASE BOXES', counter='THE FRONT COUNTER',
            glass='THE LOBBY GLASS', chairs='LOBBY CHAIRS', lockers='LOCKERS', evidence='THE EVIDENCE CAGE', cages='PROPERTY CAGES', car='A PATROL CAR',
            cones='CONES AND STANDS', barrier='A BARRIER', wall_ew="THE STATION'S WALL", wall_ns="THE STATION'S WALL")
BOX = dict(cells=(-6.0, 6.01, -1.1, 3.8 + 2.8 * 1.45), lockers=(-6.0, 6.01, -0.6, 0.9 + 2.0 * 1.45), evidence=(-6.0, 6.01, -0.7, 2.6 + 2.7 * 1.45),
           glass=(-6.0, 6.01, -0.2, 0.7 + 2.5 * 1.45), wall_ns=(-0.6, 0.6, -0.05, 12.1 + (WALL_H + 0.1) * 1.45), wall_ew=(-6.0, 6.01, -0.3, 0.4 + (WALL_H + 0.1) * 1.45),
           counter=(-4.3, 5.2, -0.7, 1.3 + 1.3 * 1.45), desks=(-3.4, 2.5, -0.4, 2.2 + 1.3 * 1.45), files=(-3.0, 3.0, -0.6, 1.9 + 1.5 * 1.45),
           bunk=(-3.4, 4.1, -0.3, 2.9 + 1.0 * 1.45), boxes=(-3.5, 3.5, -0.8, 3.1 + 1.2 * 1.45), chairs=(-3.4, 2.0, -0.9, 3.1 + 1.0 * 1.45),
           cages=(-6.0, 6.01, -1.3, 2.1 + 3.0 * 1.45), car=(-3.0, 3.0, -0.3, 2.6 + 1.7 * 1.45), cones=(-3.4, 3.4, -0.4, 3.9 + 1.1 * 1.45), barrier=(-3.4, 3.3, -0.1, 2.4 + 1.2 * 1.45))
WALLS = ('wall_ew', 'cells', 'lockers', 'evidence', 'glass', 'cages')
SHADOW = dict(wall_ns=0.5)



# the cut and the sheet are the inside kit's (tools/bohemia_cook7_inside_kit.py, rule 495(b): one thing, one place); this tool says what is its own
K = KIT.make(TG, kit='police', prefix='pd_', floor_render='pd_floor', floor_lists=[('floor', SQUAD), ('ring', SQUAD), ('port', PORT)], scenes=[('pd_pieces', PD_AT), ('pd_port', PORT_AT)], box=BOX, kind=KIND, hm=HM, name=NAME, shadow=SHADOW,
             art_for="COMBAT FOUR's police station (slices/fight_ground/police/police.json, BUILD 11/22e): the names its handoff asked for, the garage's format. floor.floor is the squad room's vinyl (30 cm squares, most pale grey and some a step darker, a path worn grey, chair casters' arcs, coffee dried, boot scuffs; a tile's edge is a joint); floor.ring the same. floor.port is the sally port's oil-stained concrete (the truck stop bay's): it is laid the day the_sally_port names a floor area of kind 'port' (one rectangle, the whole layout); until then the port wears the squad room's vinyl.",
             how_it_lays={'the squad room': "pd_cells, pd_lockers, pd_evidence and pd_glass are a tile long so a run meets; pd_cells is three cells of block and bars, their fronts at your 'at' [0.5, 0.95]; pd_counter is 8 m with its gate, so KK reads as one counter with a way through.",
                           'the sally port': "pd_cages a tile long along the walls; pd_car a patrol car east to west, nose west, on flat tires (one picture for each P of a block of four).",
                           'the walls': "pd_wall_ew / _ns: painted block to 3 m, the blue stripe, a tile long."},
             sheet_name='THE_POLICE_STATION', card_id='cook7-the-police-station-11-27', heading='THE POLICE STATION, BEFORE AND NOW',
             sub='on his phone, 390 x 844, as the fight opens in the squad room: before (every piece a stand-in), now, and now with the ceiling at his 10%',
             off_label='NOW, THE CEILING OFF', meets_label='NOW, AS HE MEETS IT: THE CEILING AT 10%', close_title='CLOSE IN, AND THE SALLY PORT',
             close_sub='the holding cells and the desks, the counter and the glass; the sally port: cars, cages, barriers',
             closes=[('THE CELLS, THE DESKS', 'cells'), ('THE COUNTER, THE GLASS', 'counter')], other=('THE SALLY PORT', 'port'), pieces_title='THE PIECES AT THEIR OWN PIXELS',
             pieces_sub='cells, lockers, evidence cage, glass; counter, desks, files, boxes, bunk, chairs; the port: cages, car, cones, barrier',
             rows=[(('cells', 'evidence'), 220), (('lockers', 'glass'), 150), (('counter', 'desks', 'files'), 150), (('boxes', 'bunk', 'chairs'), 120), (('cages', 'car', 'cones', 'barrier'), 170), (('wall_ew',), 110)],
             floor_title="THE VINYL, THE PORT'S CONCRETE, AND THE CEILING AT FULL STRENGTH", floor_sub="30 cm squares worn grey, casters' arcs, coffee; the oil where the cars stood; the grid, the tiles out, a camera in every bay")


def cut(): KIT.cut(K)


def sheet(before_dir, page_dir): KIT.sheet(K, before_dir, page_dir)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'pd_floor' else TG.scene_pieces(n, '--quick' in a) if n in ('pd_pieces', 'pd_port') else TG.scene_ceiling('police', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'plan':
        ID = {n: i for i, n in enumerate(sorted(set(['tun_floor', 'gar_deck', 'hall_slab', 'ts_tile', 'pd_vct'])))}
        gid, dark, pale = plan_pd_floor(ID); v = np.clip(150 - dark * 160 + pale * 120, 0, 255).astype(np.uint8)
        Image.fromarray(v).save(a[1] if len(a) > 1 else '/tmp/pd_plan.png'); print('plan', v.shape, float(v.mean()))
    else: print(__doc__)
