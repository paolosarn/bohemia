#!/usr/bin/env python3
"""BOHEMIA -- COMBAT MAPS [every district its own] 11/2/26: SIX NEW FIGHT BLOCKS THROUGH THE RIG.
Rule 325, ask line 323 (Paolo 11/2, playing: 'we need way more combat maps, way more... the only thing you have is like this
desert yellow brown suburbia thing, and it's serving, it's perfect, I appreciate it, but...').

WHAT IT IS. Six new block kinds, each a 60 m block of five house tiles a side, built the way every fight block is built
since 10/19: the ground as geometry and material (the floor tool's own grid, heights, stones and eight materials), the
things on it as meshes, the not-final tool's junk and grime, the master rig's source pass, dents, one sun and film, the
rig's camera (orthographic, tilted 45, facing north), 2575 x 1820 at 42.92 px a metre. Nothing here renders: the floor
tool's render_block does, through the not-final tool's render, exactly as for subs.0. What is new is THE PLAN: the old
blocks' plans were read off COMBAT TWO's 2D maker; these blocks never had one, so the plan is written from the block's
own TILE MAP (the 5x5 the fight plays on), so the picture and the tiles cannot disagree:
   '.' flat (BB flat, 2 AP)   'r' rough (BB forest floor, 3 AP)   'd' debris (BB snow, 3 AP)   'w' water (BB swamp)
   'H' height (+1 level: a roof, a ledge, a dock you climb)       '#' blocked (a wall, a rock fin, a wreck, a trailer)
Every '#' and 'H' tile has its mass drawn on it, and nothing tall stands on a '.' tile.

THE SIX (where his fights happen that dealt suburb, measured first by tools/bohemia_combat_maps_every_district_probe_11_2_26.js):
  pass     THE PASS ROAD: NV-157 up Kyle Canyon, NV-160 over Mountain Springs: two lanes on a shelf cut in the limestone, the
           cut face, scree below, a box truck that went off the shoulder, jersey barriers on the drop.
  canyon   RED ROCK: the Aztec sandstone fins of Calico Basin, the sandy wash between them, slickrock ledges to climb.
  trailer  THE TRAILER PARK: single-wides on gravel pads off a patched lane (the valley's 1970s parks on Boulder Hwy).
  golf     THE GOLF COURSE GONE TO DUST: a dead fairway, a bunker, a cart path, a dry pond, dead palms, one green still green.
  marina   LAKE MEAD'S DRY MARINA: the lake left (Las Vegas Bay closed 2002, Callville 2022); the docks rest on the cracked
           bed, a houseboat and a cruiser stranded, the ramp runs out into nothing.
  apron    THE AIRPORT APRON: the concrete slabs of Harry Reid's apron, a dead regional jet on its belly, a tug and carts.
THE FUTURES (fight_ground.json futures): RAIDED (a raid came through: scorch, the wreck burnt, more rubble, fires) and
RECLAIMED (solar racks on the open ground and the roofs, raised beds, the junk hauled off), the same seed, the same plan.

ANALOG HORROR (rule 20): on each block one thing is wrong and nothing remarks on it: the pass's truck has its hazards on in
the day; the canyon's one handprint; the trailer park's porch light burns at noon; the golf course's one green; the marina's
one boat still tied to a dock with no water; the apron's jet with its cabin lights on.

  /tmp/claude-0/v/bin/python tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py <present|raided|reclaimed> <kind.0> ...
  python3 tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py --swap <present|raided|reclaimed> <kind.0> ...
  python3 tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py --data      (the tiles, cover and lamps into fight_ground.json)

REFERENCE CHECK (the 9/4 standing duty): every block sits beside subs.0 and scrub.0 on the sheet, same camera, same light,
same ruler; real places: Kyle Canyon road (NV-157), Calico Basin at Red Rock, the Boulder Hwy trailer parks, the closed
Las Vegas Bay marina on Lake Mead, the apron at Harry Reid; Machine Party's grime (the 8/3 dossier). No reference game.
REUSE CHECK (REUSE-FIRST): the floor tool's plan grid, heights, materials, stones and render; the not-final tool's junk,
grime, materials, instances and render; the futures tool's way (the same scene, grown or fallen); the fight's own cover
sprites (jersey, rocks, rubble, dumpster, trailer, fence, shed, dock) for the cover. No second renderer.
"""
import os, sys, json, math, time
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/fight_ground')
BASE = os.path.join(R, 'records/target/combat_maps_11_2b')
TM, BT = 12.0, 5

# ---- THE BLOCKS: the tile map first (rows north to south), then what stands where --------------------------------------
BLOCKS = {
    'pass.0': dict(name='THE PASS ROAD', tiles=['rr.rr', '##Hrd', '.....', 'r#rHr', 'rrdrr'],
                   cover=[('jersey', 1.0, 31.0), ('jersey', 7.0, 31.0), ('jersey', 37.0, 31.0), ('jersey', 49.0, 31.0),
                          ('rock_3', 40.0, 17.0), ('rock_7', 4.0, 52.0), ('rock_11', 54.0, 50.0), ('rock_5', 30.0, 5.0),
                          ('rubble_2', 26.0, 40.0), ('rock_14', 15.0, 4.0)],
                   lights=[('drum', 31.0, 54.0)]),
    'canyon.0': dict(name='RED ROCK', tiles=['r.rr.', '##r#H', '.r..r', 'H#.##', 'r.r.r'],
                     cover=[('rock_2', 28.0, 18.0), ('rock_9', 7.0, 30.0), ('rock_12', 45.0, 27.0), ('rock_16', 30.0, 41.0),
                            ('rock_1', 4.0, 54.0), ('rock_18', 52.0, 5.0)],
                     lights=[('drum', 18.0, 30.0)]),
    'trailer.0': dict(name='THE TRAILER PARK', tiles=['.....', '##r##', '.....', '##H##', '.....'],
                      cover=[('trailer', 27.0, 18.0), ('dumpster', 6.0, 26.0), ('car_kerb', 40.0, 27.5), ('fence', 13.0, 55.0),
                             ('fence', 20.0, 55.0), ('shed', 50.0, 52.0), ('car_drive', 6.0, 3.0)],
                      lights=[('lamp', 24.0, 35.0), ('lamp', 54.0, 11.0)]),
    'golf.0': dict(name='THE GOLF COURSE', tiles=['...r.', '.d..H', '.....', 'r.#.r', '..r..'],
                   cover=[('rock_4', 4.0, 40.0), ('shed', 31.0, 41.0), ('fence', 44.0, 3.0), ('fence', 51.0, 3.0),
                          ('rock_10', 55.0, 45.0), ('rubble_6', 14.0, 18.0)],
                   lights=[('lamp', 49.0, 31.0)]),
    'marina.0': dict(name='THE DRY MARINA', tiles=['.....', '#.HH.', '.....', 'd#d#d', '.....'],
                     cover=[('car_lane', 26.0, 5.0), ('car_kerb', 50.0, 6.0), ('dumpster', 20.0, 18.0), ('rubble_1', 29.0, 40.0),
                            ('rock_6', 52.0, 55.0), ('rock_0', 8.0, 54.0)],
                     lights=[('lamp', 18.0, 11.0), ('drum', 50.0, 44.0)]),
    'apron.0': dict(name='THE AIRPORT APRON', tiles=['.....', '###..', '.....', '.#.H#', '.....'],
                    cover=[('jersey', 40.0, 6.0), ('jersey', 46.0, 6.0), ('dumpster', 50.0, 18.0), ('fence', 2.0, 55.0),
                           ('fence', 9.0, 55.0), ('car_lane', 30.0, 30.0), ('rubble_9', 33.0, 53.0)],
                    lights=[('lamp', 52.0, 30.0), ('drum', 6.0, 30.0)]),
}
CODE = {'.': 'flat', 'r': 'rough', 'd': 'debris', 'w': 'water', 'H': 'height', '#': 'blocked'}


def tiles_of(bid):
    return [[CODE[ch] for ch in row] for row in BLOCKS[bid]['tiles']]


# ======================================================================================================================
# THE RIG SIDE (only imported under Blender's python)
# ======================================================================================================================
def rig():
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    return NF, NF.F


STATE = {'s': 'present', 'bid': None}


def m2px(xm, ym, F):
    return xm * F.PPM, (F.SIDE - ym) / F.SIDE * F.H


def tile_m(c, r):
    """a tile's box in metres: x0, x1, y0 (south), y1 (north)"""
    return c * TM, (c + 1) * TM, 60.0 - (r + 1) * TM, 60.0 - r * TM


def plan(bid, F):
    """the ground per pixel from the tile map and the block's own roads and pads; every pixel is the render's"""
    W, H, ID = F.W, F.H, F.ID
    yy, xx = np.mgrid[0:H, 0:W]
    xm = (xx + 0.5) / F.PPM; ym = F.SIDE * (1 - (yy + 0.5) / H)
    rng = np.random.RandomState(sum(map(ord, bid)))
    n1 = F.vnoise((H, W), 3.0 * F.PPM, rng); n2 = F.vnoise((H, W), 0.9 * F.PPM, rng)
    T = BLOCKS[bid]['tiles']
    # the tile a pixel's ground is read from, its edge wandered up to 3 m (a patch of scree has no square edge; the fight's tile
    # is still the tile: only the ground's colour wanders, never a mass)
    wx = F.vnoise((H, W), 4.0 * F.PPM, rng); wy = F.vnoise((H, W), 4.0 * F.PPM, rng)
    wx = np.clip((wx - wx.mean()) / (wx.std() + 1e-6), -2, 2) * 1.6; wy = np.clip((wy - wy.mean()) / (wy.std() + 1e-6), -2, 2) * 1.6
    col = np.clip(((xm + wx) // TM).astype(int), 0, 4); row = np.clip(((60.0 - ym + wy) // TM).astype(int), 0, 4)
    code = np.array([[T[r][c] for c in range(5)] for r in range(5)])[row, col]
    gid = np.full((H, W), ID['desert'], np.uint8)
    kind = bid.split('.')[0]
    band = lambda a, b: (ym >= a) & (ym < b)
    if kind in ('pass', 'canyon'):
        gid[:] = ID['desert']
        gid[np.isin(code, ['r', '#', 'H'])] = ID['rough']
        gid[(code == 'd')] = ID['rough']
        if kind == 'pass':
            road = band(25.0, 34.6)
            gid[band(23.6, 36.0)] = ID['track']                                 # the gravel shoulders
            gid[road] = ID['asphalt']
            gid[band(29.66, 29.84) & ((xm % 4.0) < 2.6)] = ID['paint']            # the dashed centre line
            gid[band(25.25, 25.4) | band(34.2, 34.35)] = ID['paint']             # the fog lines
        else:
            wash = (np.abs(ym - 30.0 - 4.0 * np.sin(xm / 9.0)) < 4.5 + 1.5 * n1)
            gid[wash & (code != '#')] = ID['playa']
            gid[wash & (code == '.') & (n2 > 0.2)] = ID['desert']
    elif kind == 'trailer':
        gid[:] = ID['caliche']
        gid[np.isin(code, ['#', 'H'])] = ID['track']                         # the gravel pads under the homes
        gid[band(26.0, 34.0)] = ID['asphalt']                                # the park's lane
        gid[band(26.0, 34.0) & (n1 > 0.35)] = ID['track']                    # patched with gravel where it broke up
        gid[band(26.0, 34.0) & band(29.85, 30.15) & ((xm % 6) < 2)] = ID['paint']
    elif kind == 'golf':
        gid[:] = ID['caliche']                                               # the dead fairway: bermuda gone to dust
        fair = (np.abs(xm - 30) / 26.0) ** 2 + (np.abs(ym - 48) / 9.0) ** 2 < 1.0 + 0.15 * n1
        gid[fair] = ID['desert']
        gid[(code == 'd')] = ID['desert']                                    # the bunker's sand
        bunker = ((xm - 18) / 5.2) ** 2 + ((ym - 42) / 4.3) ** 2 < 1.0 + 0.2 * n2
        gid[bunker] = ID['playa']
        gid[band(28.2, 31.8)] = ID['concrete']                               # the cart path
        green = ((xm - 44) / 6.0) ** 2 + ((ym - 6.5) / 4.5) ** 2 < 1.0        # the one green still green (analog horror)
        gid[green] = ID['lawn']
        gid[(code == 'r')] = ID['rough']
        tee = (code == 'H'); gid[tee] = ID['caliche']
    elif kind == 'marina':
        gid[:] = ID['playa']                                                 # the lake bed
        gid[ym > 48.0] = ID['asphalt']                                       # the launch lot
        gid[(ym > 48.0) & (np.abs(xm % 6.0 - 3.0) < 0.06) & (ym < 56)] = ID['paint']
        gid[(xm > 9.0) & (xm < 15.0) & (ym < 48.0) & (ym > 10.0)] = ID['concrete']   # the ramp, out into nothing
        gid[(ym > 34.0) & (ym < 48.0) & (n1 > 0.3)] = ID['rough']            # the old shore line: cobble and tamarisk
        gid[(code == 'd')] = ID['rough']
    elif kind == 'apron':
        gid[:] = ID['concrete']                                              # the apron's slabs (6 m joints below)
        gid[band(28.5, 29.0) | band(31.0, 31.5)] = ID['paint']               # the taxi lane's lines
        gid[(np.abs(ym - 6.0) < 0.2) & (xm < 36)] = ID['paint']
        gid[(ym < 18.0) & (np.abs(xm % 12.0 - 6.0) < 0.12)] = ID['paint']    # the stand lead-in lines
        gid[(n1 > 0.62) & (ym > 36.0)] = ID['asphalt']                       # patched slabs
    ground = np.ones((H, W), bool)
    lum = np.full((H, W), 255, np.uint8)
    ship = np.zeros((H, W, 3), np.uint8)
    kit = np.zeros((H, W), bool)
    return gid, ground, lum, ship, kit


# ---- the things: boxes, prisms, rocks ---------------------------------------------------------------------------------
def ico2(bpy):
    import bmesh
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
    v = np.array([x.co[:] for x in bm.verts], np.float32); f = np.array([[l.index for l in fc.verts] for fc in bm.faces], np.int32)
    bm.free(); return v, f


def prism8():
    a = np.arange(8) * (2 * np.pi / 8) + np.pi / 8
    v = [[0.5 * math.cos(t), 0.5 * math.sin(t), z] for z in (0, 1) for t in a]
    f = [[i, (i + 1) % 8, 8 + (i + 1) % 8, 8 + i] for i in range(8)] + [[0, 3, 2, 1], [0, 7, 4, 3], [4, 7, 6, 5],
                                                                         [8, 9, 10, 11], [8, 11, 12, 15], [12, 13, 14, 15]]
    return np.array(v, np.float32), np.array(f, np.int32)


def things(bpy, g, h, bid, seed):
    NF, F = rig()
    rng = np.random.RandomState(seed); state = STATE['s']; kind = bid.split('.')[0]
    box = (NF.CUBE_V, NF.CUBE_F); cyl = prism8(); ico = ico2(bpy)
    ny, nx = g.shape
    def z_at(x, y):
        c = int(round((x + 1.0) / F.STEP)); r = int(round(((F.SIDE + 1.0) - y) / F.STEP))
        return float(h[min(max(r, 0), ny - 1), min(max(c, 0), nx - 1)])
    M = {}
    def mat(name, role, step, mul=1.0):
        if name not in M: M[name] = NF.material(bpy, name, role, step, mul)
        return M[name]
    def rgb(name, c, role='clay_bone'):
        if name not in M: M[name] = NF.srgb_mat(bpy, name, c, role)
        return M[name]
    B = {}                                                     # material name -> list of box items
    C = {}                                                     # material name -> list of prism items
    def bx(m, x, y, z, sx, sy, sz, rz=0.0, tilt=0.0): B.setdefault(m, []).append((x, y, z, sx, sy, sz, rz, tilt))
    def cy(m, x, y, z, d, hgt, rz=0.0): C.setdefault(m, []).append((x, y, z, d, d, hgt, rz, 0.0))
    rocks = {}                                                 # material -> (pts, sizes, zs, flat)
    def rock(m, x, y, s, flat=0.6, sink=0.25):
        L = rocks.setdefault((m, flat), ([], [], []))
        L[0].append((x, y)); L[1].append(s); L[2].append(z_at(x, y) - s * flat * sink)
    def cluster(m, x0, x1, y0, y1, n, lo, hi, flat=0.6):
        for _ in range(n):
            rock(m, rng.uniform(x0, x1), rng.uniform(y0, y1), lo * (hi / lo) ** (rng.rand() ** 1.5), flat)
    T = BLOCKS[bid]['tiles']
    def tiles(ch): return [(c, r) for r in range(5) for c in range(5) if T[r][c] == ch]
    fires = []
    raided, reclaimed = state == 'raided', state == 'reclaimed'

    if kind == 'pass':
        lime, lime_d = 'lime', 'lime_d'
        rgb(lime, (122, 112, 98)); rgb(lime_d, (92, 84, 74))
        for (c, r) in [t for t in tiles('#') if t != (1, 3)]:  # the cut face: a heap of limestone blocks, stacked, the tile full
            x0, x1, y0, y1 = tile_m(c, r)
            cluster(lime_d, x0 + 0.5, x1 - 0.5, y0 + 0.8, y1 - 0.8, 16, 4.5, 7.5, 0.8)
            for _ in range(10):
                x = rng.uniform(x0 + 2, x1 - 2); y = rng.uniform(y0 + 3, y1 - 1.5); s_ = rng.uniform(3.5, 6.0)
                L = rocks.setdefault((lime, 0.75), ([], [], [])); L[0].append((x, y)); L[1].append(s_); L[2].append(z_at(x, y) + rng.uniform(2.0, 3.5))
        for (c, r) in tiles('H'):                               # a ledge you can stand on: broad, flat-topped
            x0, x1, y0, y1 = tile_m(c, r)
            cluster(lime, x0 + 1.5, x1 - 1.5, y0 + 2, y1 - 2, 12, 4.0, 6.5, 0.32)
        for (c, r) in tiles('r') + tiles('d'):                  # scree
            x0, x1, y0, y1 = tile_m(c, r)
            if 24 < (y0 + y1) / 2 < 36: continue
            cluster(lime_d, x0, x1, y0, y1, 45 if T[r][c] == 'r' else 70, 0.2, 0.8 if T[r][c] == 'r' else 1.5, 0.55)
        # the box truck that went off the shoulder, nose down the slope (tile c1 r3)
        x0, x1, y0, y1 = tile_m(1, 3); tx, ty = (x0 + x1) / 2, (y0 + y1) / 2 + 1.0; z = z_at(tx, ty)
        body = 'truck_burnt' if raided else 'truck_box'
        rgb('truck_burnt', (46, 40, 36), 'rubber'); mat('truck_box', 'clay_bone', 3, 0.95); mat('truck_cab', 'clay_teal', 2)
        mat('tyre', 'rubber', 1)
        bx(body, tx + 1.2, ty, z + 0.9, 7.2, 2.5, 2.9, 0.32, 0.12)
        bx('truck_burnt' if raided else 'truck_cab', tx - 3.6, ty - 1.4, z + 0.6, 2.4, 2.4, 2.2, 0.32, 0.18)
        for dx in (-3.4, 0.2, 3.0):
            for dy in (-1.3, 1.3):
                cy('tyre', tx + dx * math.cos(0.32) - dy * math.sin(0.32), ty + dx * math.sin(0.32) + dy * math.cos(0.32), z + 0.05, 1.0, 0.45)
        if not raided:                                          # its hazards blink in the day (the analog horror line)
            rgb('hazard', (226, 160, 80), 'sodium'); bx('hazard', tx - 4.7, ty - 2.2, z + 1.0, 0.25, 0.1, 0.18, 0.32)
        else: fires.append((tx, ty, 3.0))
    elif kind == 'canyon':
        rgb('aztec', (150, 92, 68), 'clay_rust'); rgb('aztec_d', (116, 70, 54), 'clay_rust'); rgb('aztec_l', (176, 128, 96), 'clay_rust')
        for (c, r) in tiles('#'):                               # a sandstone fin: stacked rounded slabs (the cross-bedding)
            x0, x1, y0, y1 = tile_m(c, r)
            for k in range(5):
                zt = k * 1.6
                L = rocks.setdefault(('aztec' if k % 2 else 'aztec_d', 0.45), ([], [], []))
                for _ in range(5):
                    x = rng.uniform(x0 + 2, x1 - 2); y = rng.uniform(y0 + 2.5, y1 - 2)
                    s = rng.uniform(4.0, 6.5) * (1 - k * 0.12)
                    L[0].append((x, y)); L[1].append(s); L[2].append(z_at(x, y) + zt)
        for (c, r) in tiles('H'):                               # slickrock: a low, broad dome to climb
            x0, x1, y0, y1 = tile_m(c, r)
            cluster('aztec_l', x0 + 2, x1 - 2, y0 + 2, y1 - 2, 6, 5.0, 8.0, 0.25)
        for (c, r) in tiles('r'):
            x0, x1, y0, y1 = tile_m(c, r)
            cluster('aztec_d', x0, x1, y0, y1, 14, 0.3, 1.2, 0.55)
        rgb('handprint', (60, 34, 28), 'clay_rust')             # the one handprint on the rock, older than the valley
        x0, x1, y0, y1 = tile_m(3, 1); bx('handprint', (x0 + x1) / 2, y0 + 1.2, 1.4, 0.22, 0.03, 0.26)
        if raided: fires += [(24.0, 30.0, 1.0), (40.0, 8.0, 1.0)]
    elif kind == 'trailer':
        tints = [(196, 186, 160), (170, 176, 158), (190, 170, 140), (176, 170, 160)]
        for i, (c, r) in enumerate([(0, 1), (3, 1), (0, 3), (3, 3)]):     # each single-wide spans two tiles, east to west
            x0 = c * TM; y0, y1 = tile_m(c, r)[2:]
            m = 'trailer_%d' % i; rgb(m, tints[i]); mat('skirt', 'tape_grey', 1); mat('trim', 'tape_grey', 2); mat('win', 'glass_eye', 0)
            yc = (y0 + y1) / 2 + 0.5; z = z_at(x0 + 12, yc)
            bx('skirt', x0 + 12.0, yc, z, 21.0, 4.0, 0.7)
            bx(('trailer_burnt' if raided and i == 1 else m), x0 + 12.0, yc, z + 0.7, 21.6, 4.3, 2.5)
            bx('trim', x0 + 12.0, yc, z + 3.2, 21.8, 4.5, 0.18)                       # the roof's lip
            for k in range(5):                                                         # windows along the south face
                bx('win', x0 + 3.0 + k * 4.2, yc - 2.17, z + 1.5, 1.4, 0.05, 0.9)
            bx('trim', x0 + 9.5, yc - 2.7, z, 1.6, 1.2, 0.7)                         # the steps to the door
            if reclaimed:
                for k in range(4): bx('solar', x0 + 5.0 + k * 4.6, yc, z + 3.45, 3.6, 3.2, 0.08, 0.0, 0.22)
        rgb('trailer_burnt', (52, 46, 40), 'rubber')
        x0, x1, y0, y1 = tile_m(2, 3)                            # the carport between two homes: its roof is the high ground
        mat('post', 'tape_grey', 1); rgb('carport', (150, 148, 140), 'tape_grey')
        for px_ in (x0 + 1.5, x1 - 1.5):
            for py_ in (y0 + 1.5, y1 - 1.5): bx('post', px_, py_, z_at(px_, py_), 0.15, 0.15, 2.7)
        bx('carport', (x0 + x1) / 2, (y0 + y1) / 2, 2.7, 10.5, 10.5, 0.15)
        rgb('porchlight', (238, 196, 120), 'sodium'); bx('porchlight', 10.3, 40.2, 2.3, 0.2, 0.1, 0.2)   # it burns at noon
        if raided: fires += [(12.0, 42.5, 3.2), (48.0, 18.5, 3.2)]
    elif kind == 'golf':
        mat('trunk', 'clay_bone', 1, 0.9); rgb('frond', (120, 104, 72), 'clay_bone'); rgb('frond_d', (92, 80, 58), 'clay_bone')
        x0, x1, y0, y1 = tile_m(2, 3)                            # the palm stand and the comfort station
        rgb('hut', (184, 170, 146)); rgb('hutroof', (120, 96, 76), 'clay_rust')
        bx('hut', x0 + 6, y0 + 7.0, z_at(x0 + 6, y0 + 7), 6.0, 4.5, 3.0); bx('hutroof', x0 + 6, y0 + 7.0, z_at(x0 + 6, y0 + 7) + 3.0, 6.8, 5.2, 0.4)
        palms = [(x0 + 1.8, y0 + 2.5), (x1 - 1.8, y0 + 2.5), (x0 + 2.0, y1 - 1.5), (x1 - 2.0, y1 - 1.8), (8.0, 52.0), (52.0, 54.0), (6.0, 20.0)]
        for (px_, py_) in palms:
            hgt = rng.uniform(8.0, 11.0); z = z_at(px_, py_)
            cy('trunk', px_, py_, z, 0.55, hgt)
            for k in range(14):                                  # the dead fronds hang down the trunk: the brown skirt, a cone
                a = k * 0.45
                rock('frond_d' if k % 2 else 'frond', px_ + 0.55 * math.cos(a), py_ + 0.55 * math.sin(a), 0.9, 2.4, -(z + hgt - 3.2) / (0.9 * 2.4))
            # no crown: the course's palms died with the water (raided or not, a palm's head is the first thing to go)
        x0, x1, y0, y1 = tile_m(4, 1)                            # the raised tee box: a timber-edged mound
        rgb('tee', (164, 150, 124)); bx('tee', (x0 + x1) / 2, (y0 + y1) / 2, 0.0, 10.0, 9.0, 1.2)
        mat('timber', 'clay_rust', 1); bx('timber', (x0 + x1) / 2, y0 + 0.4, 0.0, 10.2, 0.3, 1.25)
        mat('flag', 'tape_grey', 3); cy('flag', 45.0, 7.0, z_at(45, 7), 0.06, 2.2)
        rgb('flagcloth', (170, 60, 46), 'clay_rust'); bx('flagcloth', 45.35, 7.0, 1.6, 0.6, 0.04, 0.4)
        x0, x1, y0, y1 = tile_m(1, 1)                            # the dry pond: its liner and its rocks (debris)
        cluster('pondrock', x0, x1, y0, y1, 26, 0.3, 1.1, 0.5); rgb('pondrock', (122, 116, 104))
        cluster('pondrock', 0, 12, 0, 12, 10, 0.3, 0.8, 0.5)
        if raided: fires += [(30.0, 14.0, 1.0), (8.0, 45.0, 1.0)]
        if reclaimed:                                            # the fairway under solar racks, the green under beds
            for k in range(6):
                for j in range(2): bx('solar', 8.0 + k * 7.5, 50.0 + j * 5.0, 1.2, 6.2, 3.4, 0.08, 0.0, 0.3)
    elif kind == 'marina':
        rgb('dock', (128, 112, 92)); rgb('float', (170, 166, 152), 'tape_grey'); mat('pile', 'rubber', 2)
        for (c, r) in tiles('H'):                                # the floating docks, resting on the bed: you climb onto them
            x0, x1, y0, y1 = tile_m(c, r)
            yc = (y0 + y1) / 2
            bx('float', (x0 + x1) / 2, yc, 0.0, 11.2, 3.0, 0.45)                         # the main walk, on its floats
            for k in range(3): bx('float', x0 + 2.0 + k * 4.0, yc + 3.2, 0.0, 1.4, 4.0, 0.45)   # the finger piers
            for k in range(28): bx('dock', x0 + 0.4 + k * 0.4, yc, 0.45, 0.34, 3.1, 0.08)     # planks, gaps between
            for k in range(3):
                for j in range(10): bx('dock', x0 + 2.0 + k * 4.0, yc + 1.5 + j * 0.4, 0.45, 1.5, 0.34, 0.08)
            for px_ in (x0 + 1, x1 - 1): cy('pile', px_, yc - 1.7, 0.0, 0.4, 3.2)
        x0, x1, y0, y1 = tile_m(0, 1)                            # the marina store, closed since the lake left
        rgb('store', (176, 164, 140)); rgb('storeroof', (96, 92, 86), 'tape_grey')
        bx('store', 6.0, (y0 + y1) / 2, z_at(6, (y0 + y1) / 2), 10.0, 9.0, 3.4); bx('storeroof', 6.0, (y0 + y1) / 2, 3.4, 10.8, 9.8, 0.3)
        mat('win', 'glass_eye', 0); bx('win', 4.0, y0 + 1.5, 1.0, 3.0, 0.05, 1.2)
        rgb('hull', (196, 192, 180), 'tape_grey'); rgb('hull_d', (92, 88, 80), 'tape_grey'); rgb('hull_burnt', (48, 42, 38), 'rubber')
        x0, x1, y0, y1 = tile_m(1, 3)                            # the houseboat on its pontoons, listing
        hb = 'hull_burnt' if raided else 'hull'
        cy('hull_d', 15.0, y0 + 4.2, 0.0, 1.4, 1.0); cy('hull_d', 21.0, y0 + 4.2, 0.0, 1.4, 1.0)
        bx(hb, 18.0, y0 + 6.0, 0.9, 11.0, 5.0, 2.6, 0.0, 0.06)
        x0, x1, y0, y1 = tile_m(3, 3)                            # the cruiser, on its side in the mud
        bx(hb, 42.0, y0 + 6.0, 0.0, 9.0, 3.0, 2.2, 0.5, 0.35); bx('hull_d', 42.0, y0 + 6.0, 2.0, 4.0, 2.4, 1.0, 0.5, 0.35)
        rgb('rope', (180, 168, 130), 'tape_masking'); bx('rope', 34.0, 32.0, 0.5, 0.08, 10.0, 0.06, 0.3)   # still tied to a dock
        cluster('mudrock', 0, 60, 12, 24, 30, 0.25, 0.9, 0.5); rgb('mudrock', (140, 132, 118))
        cluster('mudrock', 0, 60, 0, 6, 10, 0.25, 0.6, 0.5)
        if raided: fires += [(18.0, 17.0, 2.0), (6.0, 42.0, 3.0)]
        if reclaimed:
            for k in range(5): bx('solar', 28.0 + k * 6.0, 52.0, 1.2, 5.0, 3.0, 0.08, 0.0, 0.3)
    elif kind == 'apron':
        rgb('fuse', (198, 196, 188), 'tape_grey'); rgb('fuse_d', (130, 130, 126), 'tape_grey'); rgb('fuse_burnt', (50, 46, 42), 'rubber')
        rgb('stripe', (64, 86, 96), 'clay_teal')
        x0, x1, y0, y1 = tile_m(0, 1)                            # the regional jet on its belly, gear collapsed, nose to the west
        fy = (y0 + y1) / 2 + 0.5; f = 'fuse_burnt' if raided else 'fuse'
        cy(f, 18.0, fy, 0.2, 3.0, 1.0)
        for k in range(14): cy(f, 3.0 + k * 2.2, fy, 0.25, 3.0, 2.8)                 # the tube, as hoops (seen from above at 45)
        bx(f, 18.0, fy, 0.3, 30.0, 2.8, 2.9)
        bx('stripe', 18.0, fy - 1.45, 1.4, 29.0, 0.05, 0.35)
        bx('fuse_d', 19.0, fy, 1.0, 5.0, 26.0, 0.25, 0.0, 0.0)                       # the wings, one tip on the slab
        bx('fuse_d', 33.5, fy, 1.4, 3.0, 9.0, 0.2)                                    # the tailplane
        bx(f, 34.0, fy, 2.8, 3.0, 0.3, 4.2)                                           # the fin
        if not raided:
            rgb('cabin', (236, 206, 140), 'sodium')               # its cabin lights still on (the analog horror line)
            for k in range(10): bx('cabin', 6.0 + k * 2.4, fy - 1.46, 2.0, 0.5, 0.04, 0.35)
        else: fires += [(16.0, fy, 2.0), (26.0, fy, 2.0)]
        x0, x1, y0, y1 = tile_m(1, 3)                            # the tug and its baggage carts
        rgb('tug', (176, 150, 70), 'clay_mustard'); mat('cart', 'tape_grey', 1)
        bx('tug', 15.0, y0 + 6.0, 0.0, 3.2, 2.0, 1.4)
        for k in range(3): bx('cart', 19.0 + k * 3.0, y0 + 6.0, 0.4, 2.4, 1.6, 1.3)
        x0, x1, y0, y1 = tile_m(3, 3)                            # the air-stairs truck: its platform is the high ground
        bx('tug', 42.0, y0 + 5.0, 0.0, 3.6, 2.2, 1.6); mat('stair', 'tape_grey', 2)
        bx('stair', 42.0, y0 + 7.5, 1.6, 2.0, 4.0, 2.4, 0.0, 0.0)
        x0, x1, y0, y1 = tile_m(4, 3)                            # the fuel truck
        rgb('tank', (186, 184, 176), 'tape_grey'); bx('tug', 50.0, y0 + 6.0, 0.0, 2.6, 2.4, 2.2)
        cy('tank', 55.5, y0 + 6.0, 0.4, 2.4, 2.2, 0.0); bx('tank', 55.0, y0 + 6.0, 0.4, 7.6, 2.4, 2.0)
        if raided: fires.append((54.0, 18.0, 2.0))
        if reclaimed:
            for k in range(6): bx('solar', 6.0 + k * 8.0, 54.0, 1.0, 6.4, 3.6, 0.08, 0.0, 0.3)
    # ---- the futures, on every kind ------------------------------------------------------------------------------------
    open_tiles = [(c, r) for (c, r) in tiles('.') + tiles('r') if r != 2]
    spots = [open_tiles[k] for k in rng.choice(len(open_tiles), min(3, len(open_tiles)), replace=False)] if open_tiles else []
    if reclaimed:
        mat('solar_frame', 'tape_grey', 1); rgb('solar', (44, 52, 62), 'clay_teal')
        rgb('bed', (110, 84, 60), 'clay_rust'); rgb('greens', (88, 104, 64), 'metal_painted')
        for n_, (c, r) in enumerate(spots):
            x0, x1, y0, y1 = tile_m(c, r); x, y = (x0 + x1) / 2, (y0 + y1) / 2
            if kind in ('pass', 'canyon') or n_ == 0:            # a rack of four panels on the open ground
                for k in range(2):
                    for j in range(2): bx('solar', x - 2.8 + k * 5.6, y - 1.6 + j * 3.4, z_at(x, y) + 1.1, 5.2, 2.6, 0.08, 0.0, 0.3)
            for k in range(2):                                   # two raised beds of planks, green growing in them
                bx('bed', x - 2.0 + k * 4.0, y - 4.2, z_at(x, y), 3.0, 1.2, 0.45); bx('greens', x - 2.0 + k * 4.0, y - 4.2, z_at(x, y) + 0.45, 2.7, 1.0, 0.25)
        for it in list(B.get('solar', [])):                      # each panel its post
            x, y, z = it[0], it[1], it[2]
            bx('solar_frame', x, y, max(0.0, z - 1.1), 0.12, 0.12, 1.1 if z > 1.0 else 0.1)
    if raided:
        rgb('scorch', (38, 33, 29), 'rubber'); rgb('ash', (92, 88, 82), 'tape_grey')
        for (x, y, _r) in fires + [(rng.uniform(4, 56), rng.uniform(4, 56), 0) for _ in range(5)]:
            for _ in range(4): rock('scorch', x + rng.uniform(-2, 2), y + rng.uniform(-2, 2), rng.uniform(2.0, 4.0), 0.012, -1.0)
        cluster('ash', 0, 60, 0, 60, 90, 0.2, 0.8, 0.5)
    out = []
    for m, items in B.items():
        if m not in M: mat(m, 'tape_grey', 2)
        out.append(NF.instances(bpy, 'cm_box_' + m, box, items, M[m]))
    for m, items in C.items():
        if m not in M: mat(m, 'tape_grey', 2)
        out.append(NF.instances(bpy, 'cm_cyl_' + m, cyl, items, M[m]))
    for (m, flat), (pts, sizes, zs) in rocks.items():
        if not pts: continue
        if m not in M: rgb(m, (120, 114, 104))
        out.append(F.stones_mesh(bpy, 'cm_rock_' + m, np.array(pts, np.float32), np.array(sizes, np.float32), np.array(zs, np.float32), rng, ico, M[m], flat))
    return [o for o in out if o is not None], fires


def install():
    """the rig, told about these blocks: their plan, their things, their fires for the grime"""
    NF, F = rig()
    _load, _build = F.load_plan, NF.build
    def load_plan(bid):
        if bid in BLOCKS:
            NF.OPEN_KEEP.clear(); NF.KEEP_ROAD.clear()
            return plan(bid, F)
        return _load(bid)
    def build(bpy, gid_full, seed, quick=False):
        objs, g = _build(bpy, gid_full, seed, quick)
        bid = NF.LEDGER.get('bid')
        if bid in BLOCKS:
            ground = objs[0]
            co = np.zeros(len(ground.data.vertices) * 3, np.float32); ground.data.vertices.foreach_get('co', co)
            h = co.reshape(g.shape[0], g.shape[1], 3)[..., 2] if co.size == g.shape[0] * g.shape[1] * 3 else np.zeros(g.shape, np.float32)
            extra, fires = things(bpy, g, h, bid, seed + 5)
            # the things go back with the ground's meshes, as the junk does: the scene's one source pass, dents and the camera's
            # vertical stretch (render_block's scene()), never twice
            NF.LEDGER['fires'] = list(NF.LEDGER.get('fires') or []) + fires if STATE['s'] == 'raided' else (NF.LEDGER.get('fires') or [])
            if STATE['s'] == 'reclaimed':                       # the junk hauled off (the futures tool's own list)
                keep = []
                for o in objs:
                    if any(o.name.startswith(j) for j in ('junk_bags', 'junk_paper', 'junk_card', 'junk_cloth', 'junk_mattress', 'junk_couch', 'junk_ash', 'junk_fire', 'junk_deadlawn')):
                        bpy.data.objects.remove(o, do_unlink=True)
                    else: keep.append(o)
                objs = keep
                NF.LEDGER['fires'] = []
            NF.LEDGER['things'] = len(extra)
            return objs + extra, g
        return objs, g
    F.load_plan = load_plan; F.build = build
    return NF, F


def render(state, bid, quick=False):
    NF, F = install()
    STATE['s'] = state; STATE['bid'] = bid
    if quick:                                                  # a look at a quarter of the pixels, nothing swapped
        F.OUT = NF.OUT = os.path.join(BASE, 'quick'); F.RENDER = os.path.join(BASE, 'quick'); os.makedirs(F.RENDER, exist_ok=True)
        NF.LEDGER.clear(); NF.LEDGER['bid'] = bid; NF.LEDGER['seed'] = sum(map(ord, bid)) % 97
        fn = F.render_block(bid, True); os.replace(fn, os.path.join(F.RENDER, '%s_%s.png' % (bid.replace('.', '_'), state))); return
    F.GROUND_SAMPLES = int(os.environ.get('CM_SAMPLES', 16))
    out = os.path.join(BASE, state); os.makedirs(os.path.join(out, 'render'), exist_ok=True)
    F.OUT = NF.OUT = out; F.RENDER = os.path.join(out, 'render')
    t0 = time.time(); NF.render(bid)
    print('  done', state, bid, round(time.time() - t0), 's', flush=True)


# ======================================================================================================================
# THE BOARD SIDE (plain python): the files into the fight, the tiles, cover and lamps into fight_ground.json
# ======================================================================================================================
def file_of(bid, state):
    return 'block_%s%s.webp' % (bid.replace('.', '_'), '' if state == 'present' else '_' + state)


def swap(state, bid):
    src = os.path.join(BASE, state, 'block_%s.webp' % bid.replace('.', '_'))
    a = Image.open(src).convert('RGB'); assert a.size == (2575, 1820), a.size
    dst = os.path.join(SHIP, file_of(bid, state)); a.save(dst, quality=76, method=6)
    print('  swapped', bid, state, '->', os.path.relpath(dst, R), os.path.getsize(dst) // 1024, 'KB', flush=True)


def data():
    """each new kind is a named board of its own (the fight's block library is read off the named boards, rule 59: one list):
    its 4 x 3 blocks are the kind's block, its terrain the tile map, its cover and lamps placed in every block; the deal mirrors
    a block ('pass.0|h') with its tiles, cover and lamps (libOf)"""
    p = os.path.join(SHIP, 'fight_ground.json'); G = json.load(open(p))
    seen = {}
    for B in G['boards'].values():
        for l in B.get('lights', []): seen.setdefault(l['src'], l)
    tmpl = {'lamp': seen['light_lamp_house_side.webp'], 'drum': seen['light_oil_drum.webp']}
    span = TM * BT
    for bid, spec in BLOCKS.items():
        kind = bid.split('.')[0]
        cover, lights = [], []
        for by in range(3):
            for bx in range(4):
                for (piece, x, y) in spec['cover']:
                    cover.append(dict(piece=piece, x_m=round(x + bx * span, 2), y_m=round(y + by * span, 2)))
                for (lk, x, y) in spec['lights']:
                    l = {k: v for k, v in tmpl[lk].items() if k not in ('x_m', 'y_m', 'block')}
                    l.update(x_m=round(x + bx * span, 2), y_m=round(y + by * span, 2), block=[by, bx])
                    if lk == 'lamp': l['live'] = True
                    lights.append(l)
        G['boards'][kind] = dict(blocks=[[bid] * 4 for _ in range(3)],
                                 terrain=[sum([tiles_of(bid)[r] for _ in range(4)], []) for _ in range(3) for r in range(5)],
                                 cover=cover, lights=lights)
        G['blocks'][bid] = dict(src=file_of(bid, 'present'))
        for st in ('raided', 'reclaimed'):
            G['futures'][st]['blocks'][bid] = file_of(bid, st)
            lit = [dict(l, live=(st == 'reclaimed' or l['kind'] == 'drum')) for l in lights]
            G['futures'][st].setdefault('boards', {})[kind] = dict(cover=cover, lights=lit)
    G.setdefault('made_11_2', {})['combat_maps'] = dict(kinds=[b.split('.')[0] for b in BLOCKS], tool='tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py',
                                                       names={b: v['name'] for b, v in BLOCKS.items()})
    json.dump(G, open(p, 'w'), indent=1)
    print('  fight_ground.json: boards', len(G['boards']), 'blocks', len(G['blocks']))
    # the pack gate's manifest (gates/pack_gate.js P1): every new picture named, and why no pack tile is in it
    why = ('rendered through the master rig like every fight block since 10/19 (rule 121(j), rule 123: every 2D asset into 3D): '
           'the floor tool\'s ground, the not-final tool\'s junk and grime, modelled things; no pack tile is cut into it')
    man = dict(about='COMBAT MAPS 11/2: the six new fight blocks and their futures (tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py)',
               pieces={'%s.%s' % (b, st): dict(src=file_of(b, st), exception=why) for b in BLOCKS for st in ('present', 'raided', 'reclaimed')})
    json.dump(man, open(os.path.join(SHIP, 'combat_maps_11_2.json'), 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == '--data': data()
    elif a[0] == '--swap':
        for b in a[2:]: swap(a[1], b)
    else:
        for b in [x for x in a[1:] if not x.startswith('--')]: render(a[0], b, '--quick' in a)
    sys.stdout.flush(); os._exit(0)
