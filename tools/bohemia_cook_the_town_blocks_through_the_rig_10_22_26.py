#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D] + [the floor, not final] 10/22/26: THE TOWN BLOCKS' BUILDINGS BUILT IN 3D.
Rule 123 (Paolo 10/20: 'all that energy has to be spent towards just revamping all the 2-D assets into these 3-D
sprites... analog horror Crashbox vibes, go crazy'): no card; the blocks go straight into the fight (same file, same
2575 x 1820, same anchor).

WHY: the floor tools (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py, ..._not_final_10_20_26.py) build the
suburb's houses in 3D, but on the strip, main, works and ruin blocks they laid the new ground and KEPT THE OLD FLAT
BUILDINGS' PIXELS on it (the 10/19 handoff's own WEAK line). Those blocks would count as 3D while every building on them
is still a flat picture. Here every old building is read off the shipped picture and built in 3D on its own footprint,
then the not-final tool renders the block whole (its grime across every edge, its junk, the rig's one sun).

HOW A BUILDING IS READ (measure()): the old buildings are the not-ground pieces of the plan plus the pixels where the old
picture differs from the street kit it was laid on (a tall building's roof is drawn up over the road). Column by column,
the facade is the band above the ground line whose colour is not the roof's; where the band's height or the roof's colour
jumps, a new building starts (the warehouse and its office, the strip's anchor store). Each building keeps:
  * its width and ground line (the same x, the same front: its door is where the old door was);
  * its wall height (the facade band at the picture's own 42.9 px a metre: a height on this camera is 1:1 on the screen);
  * its roof: a ridge roof where the old roof is clay (in the valley's tans, his 10/17: 'never bright medieval orange'),
    a flat deck with a parapet and its coolers where it was gravel; a burnt-through hole where the old roof had one
    (the ruin), as a charred hole with its rafters;
  * its depth: the picture's height less the wall, over the camera's 0.707, never past the next street's walk;
  * its openings: every dark run in the facade band, at its x, its width and its sill and head: a door, a roll-up or a
    garage where it touches the ground, a window where it does not; boarded where the old one had boards across it.
The gas station's canopy (a slab on posts, not a box) is COOK's own gas_station, imported, centred on the old one.

ANALOG HORROR (rule 20): on each block one window is lit, the same warm amber, and nothing else is.

  <venv>/bin/python tools/bohemia_cook_the_town_blocks_through_the_rig_10_22_26.py measure [block ...]   (no render: the read)
  <venv>/bin/python tools/bohemia_cook_the_town_blocks_through_the_rig_10_22_26.py <block> ...         (about 5 min a block)
  <venv>/bin/python tools/bohemia_cook_the_floor_not_final_10_20_26.py --swap <block> ...                (into the fight)

REFERENCE CHECK (the 9/4 standing duty): the old blocks are the twins (every building on its own footprint, its door where
it was); real places: an east-valley strip mall, a Boulder Highway motel row, a North Las Vegas tilt-up warehouse with its
office, a burnt-out block; Machine Party's grime across every edge (records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md 3.1).
No reference game.
REUSE CHECK (REUSE-FIRST): the not-final tool's render, grime and junk; the 10/19 floor's ground, plan and compose;
COOK's buildings modeller's walls, roofs, openings and coolers (tools/bohemia_cook_model_buildings.py), its gas station.
TASTE CHECK: the rig is the look (rule 115); a building is where the old one was.
"""
import os, sys, json, math
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_the_floor_not_final_10_20_26 as NF

F = NF.F
TOWN = ('main', 'strip', 'works', 'ruin')
PPM, W, H, SIDE = F.PPM, F.W, F.H, F.SIDE
LEDGER = os.path.join(NF.OUT, 'town.json')


def lum(a):
    return a[..., :3].astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)


def kit_picture(bid):
    """the street kit's own pixels where the board lays it (the same tiles street_ids reads)"""
    man = json.load(open(os.path.join(NF.ORIG, 'fight_ground.json')))
    plan = man['blocks'].get(bid, {}).get('kit_plan', {})
    out = np.zeros((H, W, 3), np.uint8); has = np.zeros((H, W), bool)
    for rc, piece in plan.items():
        r, c = map(int, rc.split(','))
        k = np.asarray(Image.open(os.path.join(R, 'slices/fight_ground/kit_street', piece + '.webp')).convert('RGB'))[:364, :515]
        out[r * 364:r * 364 + 364, c * 515:c * 515 + 515] = k; has[r * 364:r * 364 + 364, c * 515:c * 515 + 515] = True
    return out, has


def roofish(c):
    r, g, b = float(c[0]), float(c[1]), float(c[2])
    return 'ridge' if (r > 100 and g < 0.66 * r and b < 0.5 * r) else 'flat'


def measure(bid):
    """every old building of a town block: [{x0, x1, y1 (px), h, D, roof, openings, hole, lit}]"""
    from scipy import ndimage
    ship = np.asarray(Image.open(os.path.join(NF.ORIG, 'block_%s.webp' % bid.replace('.', '_'))).convert('RGB'))
    z = np.load(os.path.join(F.PLANS, bid.replace('.', '_') + '.npz')); gid = z['gid']
    st = F.street_ids(bid, ship)
    kit, has = kit_picture(bid)
    over = has & (np.abs(ship.astype(int) - kit.astype(int)).sum(2) > 60)            # drawn up over the road
    over = ndimage.binary_opening(over, iterations=7)                      # a solid roof, never a frame's thin line
    bld = ((gid == 255) & (st == 255)) | over
    bld = ndimage.binary_closing(bld, iterations=2)
    lab, n = ndimage.label(bld)
    L = lum(ship)
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        area = int((lab[sl] == i + 1).sum()); w, h = x1 - x0, y1 - y0
        if area < 15000 or w < 4 * PPM or h < 2.5 * PPM: continue
        fill = area / float(w * h)
        if fill < 0.55: continue
        low = (lab[y1 - int(h * 0.3):y1, x0:x1] == i + 1).mean()
        if low < 0.6:                                                         # a slab on posts (the lower third is posts): the canopy
            out.append(dict(kind='canopy', x0=x0 / PPM, x1=x1 / PPM, y1=y1, box=[x0, y0, x1, y1])); continue
        sub = ship[y0:y1, x0:x1].astype(np.float32); Ls = L[y0:y1, x0:x1]
        # THE PIECES: a long building splits where its roof changes (the warehouse and its office, the anchor store),
        # read on a 3 m window so the old art's patterns never cut it; nothing under 6 m stands alone
        rc = ndimage.median_filter(np.median(sub[int(h * 0.1):int(h * 0.6)], axis=0), size=(int(3 * PPM), 1), mode='nearest')
        ct = np.zeros(w, int)                                                 # per column: where the roof stops, read from the top
        for c in range(w):
            nr = np.abs(sub[:, c] - rc[c]).sum(1) < 50
            r = int(h * 0.1)
            while r < h - 6 and (nr[r:r + 6].any()): r += 1
            ct[c] = r
        ct = ndimage.median_filter(ct, size=int(2 * PPM), mode='nearest')
        cuts = [0]
        if w > 16 * PPM:
            for c in range(int(6 * PPM), w - int(6 * PPM)):
                if (np.abs(rc[c] - rc[c - 8]).sum() > 60 or abs(int(ct[c]) - int(ct[c - 8])) > 25) and c - cuts[-1] >= 6 * PPM: cuts.append(c)
        cuts.append(w)
        # the room behind: up to the next street's walk north of the ground line (or the block's top)
        yf_m = SIDE * (1 - y1 / H)
        north = [r for r in range(y1 - 1, -1, -1) if (st[r, x0:x1] != 255).mean() > 0.5]
        room = (SIDE * (1 - north[0] / H) - yf_m - 0.4) if north and north[0] < y1 - 2 * PPM else (SIDE - yf_m - 0.3)
        for a, b in zip(cuts[:-1], cuts[1:]):
            ps = sub[:, a:b]; pl = Ls[:, a:b]; pw = b - a
            px_ = ps[int(h * 0.1):int(h * 0.6)].reshape(-1, 3); px_ = px_[lum(px_) > 40] if (lum(px_) > 40).mean() > 0.2 else px_
            col = np.median(px_, axis=0); roof = roofish(col)                # the roof's colour, a burnt hole left out
            cen = ps[:, int(pw * 0.15):max(int(pw * 0.15) + 1, int(pw * 0.85))]
            roofrow = ((np.abs(cen - col).sum(2) < 50) | (lum(cen) < 30)).mean(1) > 0.5     # a row of roof (or of its burnt hole)
            r = int(h * 0.1)                                                  # the facade: down from the roof to where it stops
            while r < h - 14 and roofrow[r:r + 14].any(): r += 1
            band = h - r
            if band >= 0.65 * h: band = int(1.2 * PPM)                        # the read found no roof's end: a roof drawn with no wall
            band = int(np.clip(band, 0.6 * PPM, h * 0.65)); hb = band / PPM
            # the wall's real height: the old art drew walls squashed (a ranch's 2.7 m wall as 1.4 m); a ridge roof is a
            # house or a motel row, a flat deck is a shop at 3.8 m, unless the old wall was already tall (the works)
            hh = (2.9 if pw > 14 * PPM else 2.7) if roof == 'ridge' else (float(np.clip(hb, 6.0, 7.5)) if hb > 6.0 else float(np.clip(hb, 3.8, 5.5)))
            D = float(np.clip((h / PPM - hb) / 0.7071, 4.0, max(4.0, room)))
            # the openings: every dark run of the facade band, its rows mapped onto the real wall (the band is the wall)
            fb = pl[h - band:h - 4, :]; bh = fb.shape[0]
            dark = (fb < 58).mean(0)
            ops, c = [], 0
            while c < pw:
                if dark[c] > 0.18:
                    e = c
                    while e < pw and dark[e] > 0.1: e += 1
                    ww = (e - c) / PPM
                    if ww >= 0.45:
                        dr = (fb[:, c:e] < 58).mean(1) > 0.45
                        r0 = 0
                        while r0 < bh:                                        # each vertical run is its own opening
                            if dr[r0]:
                                r1 = r0
                                while r1 < bh and dr[r1]: r1 += 1
                                z1 = (bh - r0) / bh * hh; z0 = (bh - r1) / bh * hh
                                if z1 - z0 >= 0.35:
                                    inside = fb[r0:r1, c:e]; boards = float(((inside > 95) & (inside < 215)).mean())
                                    if z0 < 0.2 * hh:
                                        kind = 'door' if ww <= 1.7 else ('rollup' if hh > 4.4 else 'garage'); z0 = 0.0
                                        z1 = max(z1, 2.1) if kind == 'door' else max(z1, 2.2)
                                    else:
                                        kind = 'window'; z1 = max(z1, z0 + 0.7)
                                    if kind == 'door' and ww > 1.1 and roof == 'flat': kind = 'glassdoor'
                                    ops.append(dict(kind=kind, x=round((x0 + a + (c + e) / 2) / PPM, 2), w=round(ww, 2), z0=round(z0, 2), z1=round(min(z1, hh - 0.25), 2),
                                                    mod='boarded' if boards > 0.22 else None))
                                r0 = r1
                            r0 += 1
                    c = e
                c += 1
            hole = None
            if roof == 'ridge':                                               # a burnt-through roof: a hole that is black
                rr = pl[:h - band]; blk = (rr < 28).mean(0) > 0.25
                if blk.sum() > 1.5 * PPM:
                    xs = np.nonzero(blk)[0]; hole = [(x0 + a + xs.min()) / PPM, (x0 + a + xs.max()) / PPM]
            arch = ('house' if pw < 13 * PPM else 'row') if roof == 'ridge' else ('tall' if hh >= 6.0 else 'shop')
            ops = [o_ for o_ in ops if o_['z0'] == 0.0]                       # the read keeps the doors where they were; the
            out.append(dict(kind='building', arch=arch, ruin=bid.startswith('ruin'), x0=(x0 + a) / PPM, x1=(x0 + b) / PPM, y1=y1, yf=yf_m, h=round(hh, 2), D=round(D, 2), roof=roof,
                            band=round(hb, 2), roof_rgb=[int(v) for v in col], openings=ops, hole=hole, box=[int(x0 + a), int(y0), int(x0 + b), int(y1)]))
    bl = [i for i, b in enumerate(out) if b['kind'] == 'building']
    if bl: out[bl[(sum(map(ord, bid)) * 7) % len(bl)]]['lit'] = True       # the one lit window on the block (rule 20)
    return out


# ---- the build -------------------------------------------------------------------------------------------------------
def char_hole(bpy, BLD, P, n, x0, x1, yf, yb, h, mm):
    """the front slope burnt through between x0 and x1: a black hole a hand under the tiles (kept out of the rig's dust:
    the first cut's hole took the source pass and read as a grey patch) and five charred rafters across it, which on this
    camera stand as dark uprights over the black"""
    t = math.tan(math.radians(18.4)); yc = (yf + yb) / 2
    ya, yb_ = yf + 0.7, yc - 0.35
    za, zb = h + (ya - yf) * t, h + (yb_ - yf) * t
    hole = NF.material(bpy, 'burnt_through', 'cloth_black', 0, 0.12)
    P.prism(bpy, n + '_hole', hole, [(ya, za + 0.15), (yb_, zb + 0.15), (yb_, zb + 0.175), (ya, za + 0.175)], x0, x1)
    soot = NF.material(bpy, 'char', 'cloth_black', 1, 0.45)
    for k in range(5):
        x = x0 + (x1 - x0) * (k + 0.5) / 5 + np.random.RandomState(k + len(n)).uniform(-0.15, 0.15)
        P.rod(bpy, n + '_rafter%d' % k, soot, (x, ya - 0.2, za + 0.12), (x, yb_ + 0.15, zb + 0.3), 0.09, 6)


def facade(bpy, BLD, P, n, b, rnd, mm):
    """the front wall by the building's kind; the doors the old picture had stay at their x"""
    x0, x1, yf, h, arch = b['x0'], b['x1'], b['yf'], b['h'], b['arch']
    doors = [o for o in b['openings'] if x0 + 0.3 < o['x'] - o['w'] / 2 and o['x'] + o['w'] / 2 < x1 - 0.3]
    taken = [(o['x'] - o['w'] / 2 - 0.3, o['x'] + o['w'] / 2 + 0.3) for o in doors]
    def free(x, w): return all(x + w / 2 < a or x - w / 2 > c for a, c in taken) and x - w / 2 > x0 + 0.4 and x + w / 2 < x1 - 0.4
    lit = [b.get('lit', False)]
    def win(j, x, w, z0, z1, kind='window'):
        mod = None
        if lit[0] and kind == 'window': mod = 'lit'; lit[0] = False
        elif b.get('ruin') and rnd.rand() < 0.55: mod = 'boarded'
        elif rnd.rand() < 0.25: mod = 'broken' if kind == 'window' else None
        BLD.opening(bpy, '%s_w%d' % (n, j), kind, x, w, z0, z1, yf, mod); taken.append((x - w / 2 - 0.3, x + w / 2 + 0.3))
    for j, o in enumerate(doors):
        kind = {'glassdoor': 'door'}.get(o['kind'], o['kind'])
        z1 = {'door': 2.1, 'garage': 2.2, 'rollup': min(3.8, h - 0.9)}.get(kind, o['z1'])
        w = min(o['w'], 1.0) if kind == 'door' else min(o['w'], 3.6 if kind == 'rollup' else 5.0)
        mod = 'nailed' if (kind == 'door' and b.get('ruin')) else ('gap' if kind in ('garage', 'rollup') and rnd.rand() < 0.3 else None)
        BLD.opening(bpy, '%s_d%d' % (n, j), kind, o['x'], w, 0.0, z1, yf, mod)
    j = 0
    if arch == 'house':                                                       # a ranch's front: a door if it had none, windows
        if not any(o['kind'] == 'door' for o in doors):
            x = x0 + (x1 - x0) * 0.42
            if free(x, 1.0): BLD.opening(bpy, n + '_door', 'door', x, 0.95, 0.0, 2.1, yf, 'nailed' if b.get('ruin') else None); taken.append((x - 0.8, x + 0.8))
        for x in np.arange(x0 + 1.6, x1 - 1.0, 2.6):
            if free(x, 1.5): win(j, x, 1.5, 0.95, 2.15); j += 1
    elif arch == 'row':                                                       # the motel row: a door and a window a room
        for x in np.arange(x0 + 1.2, x1 - 1.0, 3.6):
            if free(x, 0.95): BLD.opening(bpy, '%s_rd%d' % (n, j), 'door', x, 0.95, 0.0, 2.1, yf, 'nailed' if rnd.rand() < 0.2 else None); taken.append((x - 0.8, x + 0.8))
            if free(x + 1.7, 1.4): win(j, x + 1.7, 1.4, 1.0, 2.0)
            j += 1
    elif arch == 'shop':                                                      # the storefront: glass bays, a door every few, the fascia
        bay = 3.0; k = 0
        for x in np.arange(x0 + bay / 2 + 0.3, x1 - bay / 2, bay):
            if k % 4 == 1 and free(x, 1.6): BLD.opening(bpy, '%s_gd%d' % (n, j), 'window', x, 1.6, 0.0, 2.4, yf, 'black' if rnd.rand() < 0.4 else None); taken.append((x - 1.1, x + 1.1))
            elif free(x, 2.5): win(j, x, 2.5, 0.45, 2.6)
            j += 1; k += 1
        BLD.B(bpy, n + '_fascia', mm['pale'], x0 + 0.2, x1 - 0.2, yf - 0.14, yf - 0.02, h - 0.95, h - 0.2)
        for k2, x in enumerate(np.arange(x0 + 1.0, x1 - 1.0, 6.0)):           # the letters of a name that has fallen off, some
            for q in range(int(rnd.randint(2, 6))):
                if rnd.rand() < 0.35: continue
                BLD.B(bpy, '%s_let%d_%d' % (n, k2, q), mm['dark'], x + q * 0.55, x + q * 0.55 + 0.38, yf - 0.18, yf - 0.13, h - 0.82, h - 0.36)
    elif arch == 'tall':                                                      # the works: dock doors and a row of high windows
        if not any(o['kind'] in ('rollup', 'garage') for o in doors):
            for x in np.arange(x0 + 4.0, x1 - 3.0, 7.0):
                if free(x, 3.4): BLD.opening(bpy, '%s_rl%d' % (n, j), 'rollup', x, 3.4, 0.0, min(3.8, h - 1.2), yf, 'gap' if rnd.rand() < 0.3 else None); taken.append((x - 2.0, x + 2.0)); j += 1
        for x in np.arange(x0 + 2.0, x1 - 1.0, 4.0):
            win(j, x, 2.2, h - 1.9, h - 0.9); j += 1


def is_church(b):
    """10/23: the main street's church (main.0, main.1: a gable front and a bell tower, the picture taller than it is wide)
    was read as a plain house and came out a ranch with no tower"""
    x0, y0, x1, y1 = b['box']
    return b['kind'] == 'building' and b.get('arch') == 'house' and (y1 - y0) > 1.3 * (x1 - x0)


def church(bpy, BLD, b, i, root, rnd, mm):
    """the old church on its own footprint: the nave's gable to the street (the ridge runs north, so the front is the
    triangle the old picture drew), a door and an arched window in it, the bell tower at its east side with its louvre,
    its cross and its door, a stone footing; the nave is built along x and turned a quarter onto the street"""
    import mathutils
    x0, x1, yf = b['x0'], b['x1'], b['yf']; L = float(min(b['D'], 14.0)); n = 'church%d' % i
    nw = (x1 - x0) * 0.68; tx0, tx1 = x0 + nw + 0.3, x1 - 0.2; wall = mm['stucco']
    before = set(bpy.context.scene.objects)
    BLD.B(bpy, n + '_nave', wall, -L / 2, L / 2, -nw / 2, nw / 2, 0, 5.4, bevel=0.04)
    BLD.ridge_roof(bpy, n + '_roof', -L / 2, L / 2, -nw / 2, nw / 2, 5.4, pitch=35, gable=wall)
    nave = bpy.data.objects.new(n + '_turn', None); bpy.context.scene.collection.objects.link(nave)
    for o in [o for o in bpy.context.scene.objects if o not in before and o is not nave]:
        if o.parent is None: o.parent = nave
    nave.location = (x0 + nw / 2, yf + L / 2, 0.0); nave.rotation_euler = (0, 0, math.radians(90)); nave.parent = root
    BLD.B(bpy, n + '_footing', mm['stone'], x0 - 0.05, x0 + nw + 0.05, yf - 0.05, yf + L + 0.05, 0, 0.25)
    BLD.B(bpy, n + '_tower', mm['stone'], tx0, tx1, yf - 0.6, yf + 2.6, 0, 11.5, bevel=0.04)
    BLD.ridge_roof(bpy, n + '_tcap', tx0, tx1, yf - 0.6, yf + 2.6, 11.5, pitch=45, oh=0.3, gable=mm['stone'])
    BLD.opening(bpy, n + '_door', 'door', x0 + nw / 2, 1.7, 0, 2.7, yf, 'boarded' if rnd.rand() < 0.5 else None)
    BLD.opening(bpy, n + '_rose', 'arched', x0 + nw / 2, 1.1, 3.3, 4.8, yf)
    BLD.opening(bpy, n + '_louvre', 'arched', (tx0 + tx1) / 2, 1.0, 8.7, 10.1, yf - 0.6, 'shutter')
    BLD.opening(bpy, n + '_tdoor', 'door', (tx0 + tx1) / 2, 1.0, 0, 2.3, yf - 0.6)
    cx = (tx0 + tx1) / 2
    BLD.B(bpy, n + '_cross', mm['pale'], cx - 0.06, cx + 0.06, yf - 0.68, yf - 0.62, 6.6, 7.6)
    BLD.B(bpy, n + '_crossbar', mm['pale'], cx - 0.3, cx + 0.3, yf - 0.68, yf - 0.62, 7.15, 7.27)
    for o in [o for o in bpy.context.scene.objects if o not in before and o.parent is None and o is not nave]: o.parent = root


def build_town(bpy, blds, seed):
    import mathutils
    import bohemia_cook_model_buildings as BLD
    P = BLD.P
    rnd = np.random.RandomState(seed); meshes, roots, rects, kinds = [], [], [], []
    for i, b in enumerate(blds):
        before = set(bpy.context.scene.objects)
        BLD.TINT = dict(stucco=F.WALL_TINTS[rnd.randint(len(F.WALL_TINTS))], pale=F.WALL_TINTS[rnd.randint(len(F.WALL_TINTS))], roof=F.ROOF_TINTS[rnd.randint(len(F.ROOF_TINTS))])
        BLD.M.clear(); mm = BLD.mats(bpy)
        root = bpy.data.objects.new('town_%d' % i, None); bpy.context.scene.collection.objects.link(root)
        if b['kind'] == 'canopy':
            BLD.BUILDERS['gas_station'](bpy, mathutils)
            new = [o for o in bpy.context.scene.objects if o not in before and o is not root]
            lo = min((o.matrix_world @ mathutils.Vector(c)).x for o in new if o.type == 'MESH' for c in o.bound_box)
            hi = max((o.matrix_world @ mathutils.Vector(c)).x for o in new if o.type == 'MESH' for c in o.bound_box)
            s_ = (b['x1'] - b['x0']) / max(1e-3, hi - lo)
            for o in new:
                if o.parent is None: o.parent = root
            root.location = ((b['x0'] + b['x1']) / 2 - (lo + hi) / 2 * s_, SIDE * (1 - b['y1'] / H) + 4.0 * s_, 0.0); root.scale = (s_, s_, s_)
        elif is_church(b):
            church(bpy, BLD, b, i, root, rnd, mm)
        else:
            x0, x1, yf, h = b['x0'], b['x1'], b['yf'], b['h']; yb = yf + b['D']; n = 'town%d' % i
            wall = mm['stucco'] if rnd.rand() < 0.6 else mm['pale']
            BLD.B(bpy, n + '_walls', wall, x0, x1, yf, yb, 0, h, bevel=0.04)
            BLD.B(bpy, n + '_footing', mm['stone'], x0 - 0.04, x1 + 0.04, yf - 0.04, yb + 0.04, 0, 0.22)
            if b['roof'] == 'ridge':
                BLD.ridge_roof(bpy, n + '_roof', x0, x1, yf, yb, h, m=None, gable=wall)
                if b['hole']: char_hole(bpy, BLD, P, n, max(x0 + 0.5, b['hole'][0]), min(x1 - 0.5, b['hole'][1]), yf, yb, h, mm)
            else:
                BLD.flat_roof(bpy, n + '_roof', x0, x1, yf, yb, h, parapet=0.6)
                for k in range(max(1, int((x1 - x0) / 13))):
                    BLD.cooler(bpy, n + '_cool%d' % k, x0 + (x1 - x0) * (k + 0.5) / max(1, int((x1 - x0) / 13)) + rnd.uniform(-1.5, 1.5), yf + b['D'] * rnd.uniform(0.45, 0.7), h - 0.1)
            facade(bpy, BLD, P, n, b, rnd, mm)
            new = [o for o in bpy.context.scene.objects if o not in before and o is not root]
            for o in new:
                if o.parent is None: o.parent = root
        meshes += [o for o in bpy.context.scene.objects if o not in before and o.type == 'MESH' and not o.name.endswith('_hole')]   # the hole stays black
        roots.append(root); kinds.append(b['kind'] if b['kind'] == 'canopy' else ('church' if is_church(b) else b['roof'])); rects.append(tuple(b['box']))
        BLD.TINT = {}
    return meshes, roots, rects, kinds


# ---- the hooks into the floor tools (their files untouched) -----------------------------------------------------------
TOWN_BLDS = {}
_old_houses, _place = F.old_houses, F.place_houses
_nf_load_plan = F.load_plan


def old_houses(gid):
    bid = NF.LEDGER.get('bid', '')
    if bid.split('.')[0] in TOWN:
        if bid not in TOWN_BLDS: TOWN_BLDS[bid] = measure(bid)
        return [tuple(b['box']) for b in TOWN_BLDS[bid]]
    return _old_houses(gid)


def place_houses(bpy, houses, seed):
    bid = NF.LEDGER.get('bid', '')
    if bid.split('.')[0] in TOWN: return build_town(bpy, TOWN_BLDS[bid], seed)
    return _place(bpy, houses, seed)


def load_plan(bid):
    """the strip's parking paint: the plan leaves its stripes as not-ground; here they are paint on the lot's asphalt"""
    gid, ground, lum_, ship, kit = _nf_load_plan(bid)
    if bid.split('.')[0] == 'strip':
        from scipy import ndimage
        m = gid == 255; lab, n = ndimage.label(m)
        for i, sl in enumerate(ndimage.find_objects(lab)):
            box = (lab[sl] == i + 1)
            if box.mean() < 0.3:                                              # thin, not a building
                Ls = lum(ship[sl]); g_ = gid[sl]
                g_[box & (Ls > 110)] = F.ID['paint']; g_[box & (Ls <= 110)] = F.ID['asphalt']
        ground = (gid != 255)
    return gid, ground, lum_, ship, kit


F.old_houses, F.place_houses, F.load_plan = old_houses, place_houses, load_plan
F.HOUSE_KINDS = tuple(F.HOUSE_KINDS) + TOWN


if __name__ == '__main__':
    a = sys.argv[1:]
    if not os.path.exists(os.path.join(NF.ORIG, 'fight_ground.json')): NF.orig()
    if a and a[0] == 'measure':
        L_ = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
        for bid in a[1:]:
            L_[bid] = measure(bid)
            for b in L_[bid]:
                print('  %s %-8s x %5.1f-%5.1f %s' % (bid, b['kind'], b['x0'], b['x1'], '' if b['kind'] == 'canopy' else
                      '%s h %.1f D %.1f %s %d doors%s' % (b['arch'], b['h'], b['D'], b['roof'], len(b['openings']), ' hole' if b['hole'] else '')))
        json.dump(L_, open(LEDGER, 'w'), indent=1)
    else:
        region = [int(v) for v in a[a.index('--region') + 1].split(',')] if '--region' in a else None   # 10/23: a test window
        for bid in [x for i, x in enumerate(a) if not x.startswith('--') and not (i and a[i - 1] == '--region')]:
            NF.render(bid, region)
            if region: continue
            L_ = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
            L_[bid] = TOWN_BLDS.get(bid); json.dump(L_, open(LEDGER, 'w'), indent=1)
    sys.stdout.flush(); os._exit(0)
