#!/usr/bin/env python3
"""BOHEMIA -- COOK [every town built for tall and wide] (rule 220, Paolo 10/26: 'a settlement has to be made to be ... 9 x 16 ...
and then it has to be able to get flipped into 16 x 9 ... if I pull up on a camp ... playing tall wise on my phone ... and then I
switched it to widescreen mode by flipping my phone. The settlement will damn look exactly the same ... people are gonna have to
like slightly alter the location and the entrance, buildings and stuff like that'). Line 142 of his list.

ONE PLAN, TWO COMPOSITIONS. A town is its plan (records/target/cook_towns/BOHEMIA_EVERY_TOWN_ITS_OWN.json: where it stands, its
tier, its trade, its faction's colour) and every thing of it (tools/bohemia_cook_every_town_its_own_screen_10_25_26.py builds
them: the concrete blocks, the shacks, the church, the bank, the mast, the stage, the tents ...). WIDE (16:9, a phone on its
side, a computer) is that tool's picture, 2060 x 1092, the tier's taps where the screen has always had them. TALL (9:16, a phone
upright) is THIS tool's: the same buildings, built by the same builders with the same storeys, walls, signs and the faction's
own faded colour, moved to fit an upright frame, 1024 x 1820, the same camera (45 degrees, 42.9 px a metre), never a crop of
WIDE and never bars.

THE RULES EVERY TALL TOWN KEEPS (rule 220(b), the same for all fourteen; the dice only vary the junk):
  - THE PHONE'S CORNERS ARE FREE (rule 213: the phone sits in a bottom corner, left or right by a setting): nothing he taps
    stands in the picture's bottom three tenths at either side; that ground is the town's foreground (its wall, its gate, its
    landmark when it is low, what people leave about).
  - ONE OPEN CENTRE: the stall, the posts and the board round one open ground in the middle of the picture.
  - THE ENTRANCE FACES THE ROAD HE ARRIVES BY: the street (or the track, or the yard's road) runs across the town and he comes
    in at its end on the side the map's road meets the town (the town's place on the map, CT_BASES_BAKED: the freeway beside
    it where there is one, else the side toward the city); both compositions the same side, so turning the phone keeps him
    by the same building.
  - NOTHING HIDES A TAP: every thing he taps stands where nothing in front of it covers its foot (a building of height h hides
    1.41 h of ground behind it at this camera; the rows are spaced for it), measured, not eyeballed.
  - THE HEART IS TALL, THE EDGE IS LOW: the heart's blocks rise off the top of the upright frame as they do the wide one; the
    edge's houses are low and the yard behind them shows.
THE GROUND IS MADE FROM THE LAYOUT (rule 220(c), rule 169): every thing placed is measured in the scene and its box on the
picture, roof to front foot, written per composition (settlement_walk.json, RUN TWO's format); the doors (where a keeper
stands and where he walks in) and the taps' boxes are written from the same measure, never traced by hand.

  <venv>/bin/python tools/bohemia_cook_every_town_tall_and_wide_10_26_26.py [Town ...] [--quick] [--day-only] [--swap-only] [--no-ship]
  -> records/target/cook_town_screens/tall/render/<town>.png, _night.png, .json
  -> slices/settlement_ground_towns/<town>_tall.webp, <town>_tall_night.webp; settlement_ground.json towns[name].tall and
     .wide (the composition's picture, px, hotspots, boxes, doors, entrance), settlement_walk.json pictures[<town>_tall.webp]

REFERENCE CHECK (the 9/4 standing duty): Battle Brothers' town screen is one landscape panorama (it is a computer game); the
phone games that turn (the city builders he plays, Pocket City 2 among them, keep one HUD and re-lay the view, never letterbox);
real towns: an upright view of a Las Vegas block is its street with the facades rising and the lot in front. No reference game
added. REUSE CHECK: every builder, the kit, the camera, the light, the night and the fill are the 10/25 tool's, imported.
TASTE CHECK: his 'look exactly the same', 'slightly alter the location and the entrance'; no rainbow (159), never drained (167(b)).
"""
import os, sys, json, math, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_every_town_its_own_screen_10_25_26 as V
from bohemia_cook_every_town_its_own_screen_10_25_26 import (S, block, shack, tower, water_tower, mast, dish, fence_fast, razor,
    hoop_house, beds, turbine, stage, mural_wall, cab, canopy, storage_row, culvert, sawtooth, gantry_crane, bus, palm, big_tent,
    pad, bunting, cots, jugs, soup_line, church_small, parking_deck, Bx)
import numpy as np

PPM, SQ = V.PPM, V.SQ
TW, TH = 1024, 1820                                   # TALL: 9:16, the same metre as WIDE
WW, WH = V.PW, V.PH                                   # WIDE: the 10/25 picture
TOUT = os.path.join(R, 'records/target/cook_town_screens/tall')
C45 = math.cos(math.radians(45.0))


def proj(x, y, z, W=TW, H=TH):
    """a point in metres on the picture, the camera looking at (30, 30): px, py"""
    return W / 2 + (x - 30.0) * PPM, H / 2 - ((y * C45 + z) - 30.0 * C45) * PPM


def gbox(x0, x1, y0, y1, h=0.0, W=TW, H=TH):
    """a patch of ground (and what stands h on it) as a box on the picture"""
    a = proj(x0, y1, h, W, H); b = proj(x1, y0, 0.0, W, H)
    return [max(0, int(a[0])), max(0, int(a[1])), min(W, int(math.ceil(b[0]))), min(H, int(math.ceil(b[1])))]


# ---- the road he arrives by --------------------------------------------------------------------------------------------
# measured on the demo's map (10/26, the one driver, every base's nearest freeway within six blocks): the side the freeway
# meets the town on the screen; a town with no freeway beside it faces the city's middle (the map's 48, 48), the way he comes in
FREEWAY_SIDE = {'Church': 'right', 'Trades': 'right', 'Anarchists': 'left'}


def entrance_side(name):
    if name in FREEWAY_SIDE: return FREEWAY_SIDE[name]
    s = open(os.path.join(R, 'slices/BOHEMIA_CITY_WORLD.html')).read()
    b = json.loads(re.search(r'var CT_BASES_BAKED = (\{.*?\});', s).group(1))[name]
    return 'left' if (48 - b['x']) - (48 - b['y']) < 0 else 'right'


# ---- the three tiers' upright frames (metres; x 18.07..41.93, ground y 0..60) ------------------------------------------
# TOWN: the back row (three blocks) on its walk, the street, the posts / stall / board round the open middle with the build
# ground beside them, the smith and the armourer one storey on the front walk with the lot between, the foreground below.
# FORTRESS: the back (its wall, its tower, its rigs), the road, the barber and the clinic side by side (the smith and the
# armourer their ground floors), the stall, the board and the lot, the posts, the bar's fire and the build ground, the
# front wall and its gate below. CAMP: the 10/25 camp's middle as it stood, a little deeper, its wings brought in.
STREET_Y = {'town': 39.75, 'fortress': 46.0, 'camp': 33.5}


class TallTown(V.Town):
    def __init__(s, *a):
        super().__init__(*a); s.boxes = {}           # the ground taps (lot, build, bar, arms) in metres

    def outlines(s):
        """where a person cannot stand, per thing and per PIECE of it: a thing's meshes that stand apart (three mattresses, a
        row of reels, the graves) are separate blocks, never one box over the ground between them (the walk check caught
        three mattresses written as one block over the whole wash); flat things a man steps over (under 0.45 m) are no block"""
        import bpy
        out = []
        for name, root, walk in s.things:
            if not walk: continue
            objs = [o for o in root.children_recursive if o.type == 'MESH'] if hasattr(root, 'children_recursive') else []
            groups = []
            for o in objs:
                lo, hi = s._bounds([o])
                if hi[0] < lo[0]: continue
                nb = [lo[0], lo[1], lo[2], hi[0], hi[1], hi[2]]
                changed = True
                while changed:
                    changed = False
                    for g in list(groups):
                        if not (nb[0] > g[3] + 0.1 or nb[3] < g[0] - 0.1 or nb[1] > g[4] + 0.1 or nb[4] < g[1] - 0.1):
                            nb = [min(nb[0], g[0]), min(nb[1], g[1]), min(nb[2], g[2]), max(nb[3], g[3]), max(nb[4], g[4]), max(nb[5], g[5])]
                            groups.remove(g); changed = True
                groups.append(nb)
            for g in groups:
                if g[5] < 0.45: continue
                pts = [(x, y, z) for x in (g[0], g[3]) for y in (g[1], g[4]) for z in (max(0.0, g[2]), g[5])]
                pp = [proj(x, y, z, V.PW, V.PH) for x, y, z in pts]
                b = [max(0, int(min(p[0] for p in pp))), max(0, int(min(p[1] for p in pp))), min(V.PW, int(math.ceil(max(p[0] for p in pp)))), min(V.PH, int(math.ceil(max(p[1] for p in pp))))]
                if b[2] - b[0] < 4 or b[3] - b[1] < 4 or b[0] >= V.PW or b[1] >= V.PH or b[2] <= 0 or b[3] <= 0: continue
                out.append(dict(name=name, box=b, h=round(g[5], 2), w=round(g[3] - g[0], 2)))
        return out


def lay_town(town, pl, K):
    """the TALL town tier"""
    bpy, P, rnd, mm = K.bpy, K.P, K.rnd, K.mm
    n = town['name']
    BY = 44.0                                                          # the back row's front
    L, Mx, Rx = (18.2, 25.8), (26.0, 33.8), (34.0, 41.8)
    FY = 16.0                                                          # the front walk's row (one storey, 3.5 deep): its roof plant stays under a man at the posts
    pl.boxes['lot'] = (25.6, 34.4, 19.5, 25.5, 0.0)
    pl.boxes['build'] = (26.0, 41.4, 37.4, 42.2, 0.0)                # on the street, as wide
    def lamp(x, y, kind='lamp.glb'): pl.lamp(x, y, kind)
    def drum(x, y): pl.drum_fire(x, y)
    stall_aw = K.fac if n in ('Blues', 'Reds') else (K.fac_dark if n == 'Church' else K.rust)
    if n == 'Church':                                                  # THE HEART, the church in front of its blocks
        pl.here('bar', block, K, 'bar', *L, BY, 14, 6, 'shop', accent=K.fac, sign=(25.0, K.fac))
        pl.here('barber', block, K, 'barber', *Mx, BY, 16, 5, 'shop', wall=K.concrete_warm, accent=K.fac_dark)
        pl.here('clinic', block, K, 'clinic', *Rx, BY, 16, 7, 'shop', accent=K.fac, sign=(41.0, K.bone))
        pl.here('smith', block, K, 'smith', 18.3, 24.6, FY, 3.5, 1, 'shop', accent=K.fac_dark)
        pl.here('armourer', block, K, 'armourer', 35.4, 41.7, FY, 3.5, 1, 'office')
        pl.here('church', church_small, K, 'church', 26.0, 34.5, 5.0, 5.5, 3.0, 11.0, K.fac_dark, K.fac)
        pl.here('soup', soup_line, K, 'soup', 21.5, 6.5)
        for k, (x, y) in enumerate(((36.0, 6.2), (36.2, 3.8))): pl.model('graveyard_grave_row_%d.glb' % (k % 4), x + 1.0, y, None, 0.0, 0.55)
        pl.model('graveyard_obelisk.glb', 40.3, 8.4, None, 0.0, 1.0)
        for x in (25.9, 33.9): lamp(x, 43.3, 'streetlight.glb')
        pl.here('palm40', palm, K, 'palm', 40.8, 36.0, 7.5)
        pl.model('patrol.glb', 29.0, 37.3, None, math.radians(97), 1.0)          # the cars keep the far lane: never before a door
        pl.model('wreck.glb', 21.5, 37.4, None, math.radians(-80), 1.0)
        pl.model('rubble.glb', 19.8, 1.6, None, 0.4, 1.0); pl.model('cart.glb', 24.6, 3.0, None, 0.6, 1.0)
        pl.model('dumpster.glb', 19.6, 11.0, None, 0.1, 1.0); drum(25.3, 27.2)
    elif n == 'Reds':                                                  # THE HEART, the bank
        pl.here('bar', parking_deck, K, 'bar', *L, BY, 14, 5)
        pl.here('barber', block, K, 'barber', 26.0, 33.4, BY, 14, 4, 'shop', accent=K.fac)
        def bank(x0=33.6, x1=41.8, yf=BY + 0.4):
            block(K, 'bank', x0, x1, yf, 18, 10, 'bank', wall=K.concrete_warm, lit=0.18)
            for x in np.arange(x0 + 0.7, x1, 1.65): P.cyl(bpy, 'col', K.bone, 0.32, 5.0, (x, yf - 1.0, 2.5 + 0.4), verts=14)
            Bx(K, 'pediment', K.bone, x0, x1, yf - 1.6, yf, 5.4, 6.3)
            for k in range(3): Bx(K, 'step%d' % k, K.bone, x0 - 0.2 - k * 0.3, x1 + 0.2 + k * 0.3, yf - 2.2 - k * 0.5, yf, 0, 0.4 - k * 0.13)
            Bx(K, 'vault', mm['steel'], (x0 + x1) / 2 - 0.8, (x0 + x1) / 2 + 0.8, yf - 0.04, yf + 0.02, 0.4, 3.3)
            P.box(bpy, 'banner', K.fac, (1.2, 0.03, 3.6), (x0 + 1.9, yf - 1.65, 3.4)); P.box(bpy, 'banner2', K.fac, (1.2, 0.03, 3.6), (x1 - 1.9, yf - 1.65, 3.4))
        pl.here('clinic', bank)
        pl.here('cashing', block, K, 'cashing', 25.8, 34.2, 6.5, 5.0, 1, 'shop', accent=K.fac, sign=(33.6, K.fac))
        pl.here('smith', block, K, 'smith', 18.3, 24.6, FY, 3.5, 1, 'shop', accent=K.fac)
        pl.here('armourer', block, K, 'armourer', 35.4, 41.7, FY, 3.5, 1, 'shop', wall=K.concrete_warm)
        pl.model('patrol.glb', 37.5, 37.3, None, math.radians(92), 1.0)
        pl.model('sandbags.glb', 41.0, 36.4, None, 0.0, 1.0)
        for x, y, r in ((21.0, 3.4, 88), (38.6, 4.2, 95), (20.4, 8.4, 80)): pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
        for x in (25.9, 33.5): lamp(x, 43.3, 'streetlight.glb')
        pl.model('rubble.glb', 38.0, 12.0, None, 1.2, 1.0); pl.model('tyres.glb', 23.8, 13.4, None, 0.0, 1.0)
        drum(25.3, 27.2)
    elif n == 'Anarchists':                                            # THE EDGE, the stage in its ring of burnt cars
        pl.model('bld_ranch_carport.glb', 25.0, BY, 11.8)              # the barber's house, as wide
        pl.here('clinic', shack, K, 'clinic', 31.4, 41.8, BY, 4.0, 3.2, tarp=K.rust)
        pl.model('bld_ranch_porch.glb', 36.6, 50.0, 10.4)              # the bar's porch house, behind the low shack (it shows)
        pl.here('squat_mural', mural_wall, K, 'squat_mural', 18.3, 21.6, 41.6, 2.2)
        pl.here('wall', mural_wall, K, 'mural', 18.4, 24.2, 9.0, 3.0)
        pl.here('post', tower, K, 'post', 39.0, 55.0, 5.0)
        pl.here('smith', shack, K, 'smith', 18.3, 24.6, FY, 3.5, 2.6, tarp=K.blue_tarp)
        pl.model('container.glb', 38.6, FY, None, 0.0, 1.0)            # the armourer's container
        pl.here('stage', stage, K, 'stage', 25.6, 33.0, 6.0, 4.0, K.fac)
        for (x, y, r) in ((23.6, 4.2, 20), (35.0, 6.0, -70), (24.6, 13.2, 10), (34.8, 13.0, -20)):
            root, _ = pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
            for i_, o in enumerate(root.children_recursive):
                if o.type == 'MESH': o.data.materials.clear(); o.data.materials.append(K.rust if i_ % 5 == 2 else K.char)
        for (x, y, r) in ((36.5, 37.4, 100), (21.4, 37.5, 75)):
            root, _ = pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
            for o in root.children_recursive:
                if o.type == 'MESH': o.data.materials.clear(); o.data.materials.append(K.char)
        pl.here('mural2', mural_wall, K, 'mural2', 35.6, 40.8, 8.0, 2.4)
        pl.built(S.fire, 29.2, 13.0, None, 0.0, 1.0, True); pl.fires.append((29.2, 13.6, 1.6))
        drum(25.3, 27.2); drum(33.4, 26.4)
        pl.model('rubble.glb', 20.4, 2.0, None, 2.2, 1.0)
    else:                                                              # Blues: the co-op
        pl.model('bld_warehouse.glb', 30.0, BY, 24.2)
        def coop_awning(): K.P.box(bpy, 'coop_awning', K.fac, (9.0, 2.0, 0.05), (24.0, BY - 1.0, 2.6), rot=(math.radians(-14), 0, 0))
        pl.here('coop_awning', coop_awning)
        pl.here('hoop_a', hoop_house, K, 'hoop_a', 34.0, 41.6, 30.0, 5.5, K.blue_tarp)        # the bar: the hoop house beside the open middle
        pl.here('tank', water_tower, K, 'tank', 39.6, 7.0, 1.6, 3.6, K.blue_tarp)
        def solar():
            for k, x in enumerate(np.arange(26.0, 34.0, 2.1)):
                P.box(bpy, 'panel%d' % k, K.dark, (1.9, 1.2, 0.05), (x + 1.0, 15.6, 1.1), rot=(math.radians(-28), 0, 0)); Bx(K, 'pv_leg', K.steel, x + 0.9, x + 1.1, 15.8, 16.0, 0, 1.0)
        pl.here('solar', solar)
        pl.here('hoop_b', hoop_house, K, 'hoop_b', 24.4, 29.8, 3.0, 6.0, K.plastic)
        pl.here('hoop_c', hoop_house, K, 'hoop_c', 30.4, 35.8, 3.0, 6.0, K.blue_tarp)
        pl.here('beds_a', beds, K, 'beds_a', 18.6, 23.8, 9.0, 13.5, 3)
        pl.here('beds_b', beds, K, 'beds_b', 36.2, 41.4, 9.0, 13.5, 3)
        pl.here('turbine', turbine, K, 'turbine', 19.0, 35.0, 10.0, 3.2, walk=True)
        pl.here('smith', shack, K, 'smith', 18.3, 21.6, FY, 3.0, 2.4, tarp=K.blue_tarp)
        pl.model('shed.glb', 23.4, FY, None, 0.0, 1.0)
        pl.here('armourer', shack, K, 'armourer', 35.4, 41.7, FY, 3.5, 2.6, tarp=K.fac)
        pl.model('corral.glb', 39.0, 1.0, None, 0.0, 1.0)
        pl.model('rolled.glb', 19.8, 3.2, None, 0.0, 0.7)
        for x in (25.9, 34.0): lamp(x, 43.0)
        drum(25.3, 27.2)
    pl.built(S.posts, 21.8, 30.0, None, 0.0, 1.0, 6.0)
    root, _ = pl.built(S.stall, 28.0, 30.0, 4.0)
    for o in root.children:
        if o.type == 'MESH' and o.name.startswith('awn_') and int(o.name.split('_')[1][:1] or 0) % 2: o.data.materials[0] = stall_aw
    pl.built(S.board, 32.0, 30.4, 2.0)


def lay_fortress(town, pl, K):
    """the TALL fortress tier"""
    bpy, P, rnd, mm = K.bpy, K.P, K.rnd, K.mm
    n = town['name']
    CY = 30.0 if n == 'Mob' else 34.0                                  # the barber and the clinic, side by side (Mob nearer: its tower shows over them)
    BL, CL = (18.3, 28.6), (29.4, 41.7)
    pl.boxes['lot'] = (32.5, 41.0, 24.0, 29.5, 0.0)
    pl.boxes['build'] = (35.0, 41.4, 17.0, 22.0, 0.0)
    pl.boxes['bar'] = (27.0, 33.4, 17.0, 22.0, 1.6)
    def lamp(x, y, kind='lamp.glb'): pl.lamp(x, y, kind)
    def drum(x, y): pl.drum_fire(x, y)
    drum(30.2, 19.0)                                                   # the bar is the fire the men drink round, as wide
    def drum2(): drum(39.8, 13.0)
    gate = entrance_side(n)
    def front_wall(model='wall.glb', y=7.0, k=1.2):
        xs = [16.0, 22.6, 29.2, 35.8, 42.4]
        for x in xs:
            if (gate == 'left' and x < 20) or (gate == 'right' and x > 40): continue   # the gate: the road comes in here
            S.Place.model(pl, model, x, y, None, 0.0, k)
    if n == 'Mob':                                                     # THE HEART: the casino tower's podium
        pl.model('bld_tower_casino.glb', 30.0, 42.0, 26.0)
        pl.here('clinic', block, K, 'clinic', *CL, CY, 8, 3, 'shop', wall=K.concrete_warm, accent=K.black)
        def marquee():
            Bx(K, 'marquee', K.dark, CL[0] - 0.4, CL[1] + 0.4, CY - 2.2, CY, 3.6, 4.4)
            for x in np.arange(CL[0], CL[1], 0.5): P.cyl(bpy, 'mq_bulb', K.bone if rnd.random() < 0.6 else mm['amber'], 0.06, 0.06, (x, CY - 2.25, 4.0), rot=(math.pi / 2, 0, 0), verts=6)
        pl.here('marquee', marquee)
        pl.here('barber', block, K, 'barber', *BL, CY, 8, 2, 'shop', accent=K.black, sign=(27.8, K.bone))
        pl.model('bld_motel_sign.glb', 40.6, 4.0, None, 0.0, 1.0)      # the pylon in the front corner, never before a tap
        def fountain(x=30.0, y=10.5):
            P.cyl(bpy, 'basin', K.concrete, 3.2, 0.6, (x, y, 0.3), verts=32); P.cyl(bpy, 'dry', K.soil, 2.9, 0.05, (x, y, 0.62), verts=32)
            P.cyl(bpy, 'tier', K.concrete, 1.0, 1.6, (x, y, 0.8), verts=20); P.cyl(bpy, 'bowl', K.concrete, 1.5, 0.3, (x, y, 1.7), verts=20)
        pl.here('fountain', fountain)
        for x in (18.8, 41.2): pl.here('palm%d' % x, palm, K, 'palm', x, 31.0, 8.5)
        for x in (22.0, 38.0): pl.model('cover_jersey.glb', x, 3.0, None, 0.0, 1.0)
        for x, r in ((23.0, 92), (37.5, 86)): pl.model('wreck.glb', x, 7.0, None, math.radians(r), 1.0)
        for x in (29.0, 41.4): lamp(x, CY - 1.2, 'streetlight.glb')
        drum2()
    elif n == 'Caravans':                                              # THE EDGE: the truck stop
        for k, x in enumerate((11.4, 27.4)):                           # two rigs side on along the back, as the truck stop parks them
            pl.model('trailer.glb', x + 6.2, 51.0 + k * 0.4, None, 0.0, 1.0)
            r_ = pl.here('rig%d' % k, cab, K, 'rig', 0.0, -3.1, [K.rust, K.teal][k])
            r_.rotation_euler = (0, 0, math.radians(90)); r_.location = (x + 12.6 + 3.1, 51.0 + k * 0.4 + 1.3, 0)
        pl.here('clinic', block, K, 'clinic', *CL, CY, 8, 1, 'shop', wall=K.concrete_warm, accent=K.fac, ground_h=4.8)
        pl.here('barber', block, K, 'barber', *BL, CY, 9, 1, 'shop', wall=K.concrete_warm, accent=K.fac)
        pl.here('canopy', canopy, K, 'canopy', 18.4, 29.0, 3.0, 7.5, 4.6, K.fac)          # the fuel canopy in front, low enough to show the posts
        for x in (21.6, 26.0): pl.model('cover_pump.glb', x, 4.4, None, 0.0, 1.0)
        for k, x in enumerate((33.0, 38.6)): pl.here('semi%d' % k, cab, K, 'semi', x, 9.0, K.bone if k else K.mustard)
        for k, y in enumerate((44.0, 46.4)): pl.model('propane.glb', 40.6, y, None, 0.0, 2.0)
        pl.model('tyres.glb', 33.6, 2.4, None, 0.0, 1.0); pl.model('drums.glb', 37.0, 2.6, None, 0.2, 1.0)
        for x in (29.0, 41.4): lamp(x, CY - 1.2)
        drum2()
    elif n == 'Cartel':                                                # THE EDGE: storage rows behind a dark wall
        def back_wall():
            for k in range(4): S.Place.model(pl, 'wall.glb', 16.0 + k * 8.4, 56.0, None, 0.0, 1.4)
        pl.here('wall', back_wall)
        pl.here('row_a', storage_row, K, 'row_a', 18.2, 41.8, 50.0, 5.0, 3.0)
        pl.here('clinic', storage_row, K, 'clinic', *CL, CY, 5.0, 3.4)
        pl.here('watch_a', tower, K, 'watch_a', 40.4, 44.0, 7.0, 2.6, K.black)
        def office():
            block(K, 'office', BL[0], BL[1], CY, 8, 2, 'cells', wall=K.concrete_dk, roof=True)
            dish(K, 'office_dish', BL[1] - 2.6, CY + 4.0, 0.8)
        pl.here('barber', office)
        pl.here('watch_b', tower, K, 'watch_b', 19.2, 4.0, 6.0, 2.4, K.black)
        pl.here('front_wall', front_wall)
        pl.model('sandbags.glb', 30.0, 9.6, None, 0.0, 1.0); pl.model('wreck.glb', 37.0, 12.0, None, math.radians(70), 1.0)
        for x in (29.0, 41.4): lamp(x, CY - 1.2)
        drum2()
    elif n == 'Network':                                               # BETWEEN: the mast and its dishes
        pl.here('exchange', block, K, 'exchange', 18.2, 41.8, 52.0, 8, 3, 'blank', wall=K.concrete)
        pl.here('razor', razor, K, 'razor', 16.0, 44.0, 50.4, 2.6)
        pl.here('clinic', block, K, 'clinic', *CL, CY, 9, 2, 'blank', wall=K.concrete_warm)
        def doors():
            for x in (CL[0] + 2.0, CL[0] + 6.5, CL[0] + 10.5): Bx(K, 'door_teal', K.fac, x - 0.6, x + 0.6, CY - 0.05, CY - 0.02, 0.0, 2.4)
        pl.here('doors', doors)
        pl.here('mast', mast, K, 'mast', 27.5, 35.4, 34.0, 3.2)        # in the gap between the barber and the exchange's front block: it shows its whole height
        for k, (x, y) in enumerate(((35.0, 8.6), (39.6, 10.4))): pl.here('dish%d' % k, dish, K, 'dish', x, y, 1.9)
        pl.here('barber', block, K, 'barber', BL[0], 25.6, CY, 9, 2, 'office', wall=K.concrete, lit=0.3)
        def reels():
            for k, x in enumerate((21.0, 22.6, 38.4)): P.cyl(bpy, 'reel%d' % k, K.wood, 0.75, 0.7, (x, 9.0 + k * 0.4, 0.75), rot=(0, math.pi / 2, 0), verts=16)
        pl.here('reels', reels)
        root, _ = pl.model('container.glb', 33.0, 4.0, None, 0.0, 1.0)
        for o in root.children_recursive:
            if o.type == 'MESH' and rnd.random() < 0.6: o.data.materials.clear(); o.data.materials.append(K.fac)
        for x in (29.0, 41.4): lamp(x, CY - 1.2, 'streetlight.glb')
    else:                                                              # Remnants: the prison
        def prison_wall():
            Bx(K, 'pwall', K.concrete, 14.0, 46.0, 54.0, 54.6, 0, 5.2)
            razor(K, 'pwire', 14.0, 46.0, 54.3, 5.4)
        pl.here('pwall', prison_wall)
        pl.here('guard_a', tower, K, 'guard_a', 19.6, 51.0, 7.5, 3.0, K.fac)
        pl.here('guard_b', tower, K, 'guard_b', 40.4, 51.0, 7.5, 3.0, K.fac)
        pl.here('cells_b', block, K, 'cells_b', 23.0, 37.0, 48.0, 5, 2, 'cells')
        pl.here('clinic', block, K, 'clinic', *CL, CY, 10, 2, 'cells', wall=K.concrete_warm)
        pl.here('barber', block, K, 'barber', *BL, CY, 9, 1, 'office', wall=K.concrete)
        def cage():
            fence_fast(K, 'cage_back', 19.2, 26.6, 9.0, 3.2); fence_fast(K, 'cage_front', 19.2, 26.6, 3.0, 3.2)
            for x in (19.2, 26.6):
                for y in np.arange(3.0, 9.1, 2.0): P.cyl(bpy, 'cage_post', K.mm['trim'], 0.03, 3.25, (x, y, 1.62), verts=8)
                P.rod(bpy, 'cage_rail', K.mm['trim'], (x, 3.0, 3.2), (x, 9.0, 3.2), 0.02, 6)
            P.rod(bpy, 'hoop_pole', K.steel, (22.9, 8.8, 0), (22.9, 8.8, 3.4), 0.06, 6); Bx(K, 'backboard', K.bone, 22.3, 23.5, 8.4, 8.5, 3.0, 3.9)
        pl.here('cage', cage)
        pl.here('guard_c', tower, K, 'guard_c', 40.0, 5.0, 5.5, 2.6, K.fac)
        pl.here('front_wire', razor, K, 'front_wire', 14.0, 44.0, 1.4, 2.4)
        pl.model('patrol.glb', 33.0, 12.2, None, math.radians(90), 1.0)
        for k, x in enumerate((19.6, 21.6)): pl.model('sandbags.glb', x, 24.6 + k * 1.2, None, 0.0, 1.0)
        for x in (29.0, 41.4): lamp(x, CY - 1.2)
    pl.built(S.stall, 22.8, 24.4, 7.0, 0.0, 1.0, 7.0)
    pl.built(S.board, 28.6, 25.4, 2.0)
    pl.built(S.posts, 22.6, 18.0, None, 0.0, 1.0, 7.0)


def lay_camp(town, pl, K):
    """the TALL camp tier: the 10/25 camp's middle where it stood, 4 m deeper, its wings brought in"""
    bpy, P, rnd, mm = K.bpy, K.P, K.rnd, K.mm
    n = town['name']; D = 4.0
    cloths = [K.fac, K.blue_tarp, K.rust, K.teal, K.mustard, K.sage, K.ply, K.bone]
    pl.boxes['arms'] = (20.0, 24.0, 28.9 + D, 33.3 + D, 1.6)
    pl.boxes['bar'] = (31.6, 35.4, 34.5 + D, 38.9 + D, 1.6)
    pl.boxes['lot'] = (35.4, 41.4, 22.4, 27.0, 0.0)
    pl.boxes['build'] = (36.6, 41.6, 33.0, 38.0, 0.0)
    clinic = (20.0, 26.0, 39.5 + D); barber = (32.0, 36.4, 25.6 + D)
    def mid(b): return (b[0] + b[1]) / 2
    def tent_in(x, y, w, cloth=None):
        root, _ = pl.built(S.tent, x, y, w, rnd.uniform(-0.3, 0.3), 1.0, w)
        if cloth is not None:
            for o in root.children_recursive:
                if o.type == 'MESH' and o.data.materials and o.data.materials[0].name.startswith('tent_tarp'): o.data.materials[0] = cloth
        return root
    def lamp(x, y, kind='lamp.glb'): pl.lamp(x, y, kind)
    def drum(x, y): pl.drum_fire(x, y)
    if n == 'Colorful':                                                # the painted hall, the patchwork
        def hall():
            block(K, 'hall', 22.0, 38.0, 52.0, 8, 1, 'shop', wall=K.sage, accent=K.mustard, ground_h=5.0)
            mural_wall(K, 'hall_mural', 23.0, 37.0, 51.96, 3.0, [K.mustard, K.rust, K.teal, K.bone, K.fac])
        pl.here('hall', hall)
        tent_in(mid(clinic), clinic[2], 6.0, K.fac)
        tent_in(mid(barber), barber[2], 4.4, K.mustard)
        for k, (x, y, w) in enumerate(((39.5, 44.0, 3.2), (37.4, 13.4, 3.0), (21.0, 13.6, 3.2), (38.6, 50.5, 3.0), (19.6, 50.0, 3.0), (38.6, 19.0, 3.0), (19.0, 39.4, 3.2), (27.4, 41.0, 3.0))):
            tent_in(x, y, w, cloths[k % len(cloths)])
        pl.here('bus', bus, K, 'bus', 23.4, 34.8, 3.4, K.mustard, K.sage)
        pl.here('bunt_a', bunting, K, 'bunt_a', (21.0, 47.0, 3.0), (30.0, 49.4, 3.8), [K.rust, K.teal, K.mustard, K.sage, K.bone], walk=False)
        pl.here('bunt_b', bunting, K, 'bunt_b', (30.0, 49.4, 3.6), (39.0, 46.0, 3.4), [K.rust, K.teal, K.mustard, K.sage, K.bone], walk=False)
        pl.built(S.fire, 30.0, 33.6, None, 0.0, 1.0, True); pl.fires.append((30.0, 34.3, 1.6))
        pl.model('cart.glb', 33.0, 8.0, None, 1.0, 1.0); pl.model('tyres.glb', 39.0, 6.0, None, 0.0, 1.0)
        drum(19.4, 28.5)
    elif n == 'Custom':                                                # the crew's own garage and yard
        pl.model('bld_ranch_garage.glb', 32.4, 52.0, 15.0)
        pl.here('yard_fence', fence_fast, K, 'yard', 24.0, 41.8, 49.2, 1.8)
        pl.model('shed.glb', mid(clinic), clinic[2], None, 0.0, 1.5)
        def camper(x0=barber[0] + 0.2, yf=barber[2]):
            Bx(K, 'camper', K.bone, x0, x0 + 4.2, yf, yf + 2.4, 0.5, 2.7, bevel=0.3); Bx(K, 'camper_stripe', K.fac, x0, x0 + 4.2, yf - 0.04, yf, 1.4, 1.7)
            Bx(K, 'camper_door', K.dark, x0 + 0.8, x0 + 1.6, yf - 0.05, yf - 0.02, 0.5, 2.2); Bx(K, 'camper_win', K.black, x0 + 2.2, x0 + 3.6, yf - 0.05, yf - 0.02, 1.8, 2.3)
            P.cyl(bpy, 'camper_wheel', K.dark, 0.4, 0.3, (x0 + 2.8, yf - 0.1, 0.4), rot=(math.pi / 2, 0, 0), verts=12)
        pl.here('barber', camper)
        for k, (x, y, r) in enumerate(((27.0, 46.6, 0), (37.2, 46.8, 8), (22.0, 10.0, 90), (37.0, 9.2, 80))):
            root, _ = pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
            if k < 2:
                for sx in (-1.6, 1.6): pl.here('blocks%d%s' % (k, sx), Bx, K, 'cinder', K.concrete, x + sx - 0.3, x + sx + 0.3, y + 0.4, y + 1.0, 0, 0.4)
        pl.here('hoist', gantry_crane, K, 'hoist', 24.0, 31.0, 14.0, 5.0)
        for (x, y) in ((19.6, 22.0), (40.4, 18.0)): pl.model('tyres.glb', x, y, None, 0.0, 1.0)
        pl.model('drums.glb', 40.4, 45.0, None, 0.0, 1.0); pl.model('heap.glb', 33.0, 4.0, None, 0.0, 0.8)
        tent_in(19.8, 50.6, 3.0, K.ply); tent_in(39.6, 41.0, 3.0, K.teal)
        pl.built(S.fire, 28.0, 33.6, None, 0.0, 1.0, True); pl.fires.append((28.0, 34.3, 1.6))
        lamp(30.6, 45.0)
    elif n == 'Homeless':                                              # the flood tunnels' mouths
        pl.here('culvert', culvert, K, 'culvert', 18.2, 41.8, 52.4, 3, 3.4)
        pl.here('tank', water_tower, K, 'tank', 39.6, 47.0, 2.0, 4.0)
        def tarp_shelter(x0, x1, yf, h=2.0, cloth=None):
            for x in (x0, x1):
                for y in (yf, yf + 2.6): P.rod(bpy, 'tp', K.wood, (x, y, 0), (x, y, h), 0.05, 6)
            P.box(bpy, 'tarp', cloth or K.blue_tarp, (x1 - x0 + 0.6, 3.2, 0.04), ((x0 + x1) / 2, yf + 1.3, h), rot=(0.12, 0.05, 0))
            Bx(K, 'tarp_wall', cloth or K.blue_tarp, x0, x1, yf + 2.55, yf + 2.6, 0, h)
        pl.here('clinic', tarp_shelter, clinic[0], clinic[1], clinic[2], 3.6)
        pl.here('barber', tarp_shelter, barber[0], barber[1], barber[2], 2.4, K.ply)
        for k, (x, y, w) in enumerate(((27.6, 47.0, 2.8), (38.4, 41.0, 3.0), (20.0, 12.6, 2.6), (37.6, 12.0, 2.8), (30.4, 8.0, 2.6))):
            if k % 2: tent_in(x, y, w, K.blue_tarp)
            else: pl.here('tarp%d' % k, tarp_shelter, x - w / 2, x + w / 2, y, 1.8, K.blue_tarp if k % 3 else K.ply)
        for (x, y, r) in ((26.0, 45.0, 0.4), (24.8, 22.0, 1.6), (39.0, 20.0, 2.4), (22.0, 5.0, 0.9)): pl.model('cart.glb', x, y, None, r, 1.0)
        def mattresses():
            for (x, y) in ((33.0, 46.0), (19.0, 44.0), (35.0, 4.0)): Bx(K, 'mattress', K.bone, x, x + 1.9, y, y + 1.4, 0.0, 0.22, bevel=0.06)
        pl.here('mattresses', mattresses)
        pl.built(S.fire, 28.0, 33.6, None, 0.0, 1.0, True); pl.fires.append((28.0, 34.3, 1.6))
        drum(38.6, 32.0)
    elif n == 'Trades':                                                # the works
        pl.here('shop', sawtooth, K, 'shop', 22.0, 41.8, 52.0, 8.0, 5.6)
        pl.here('crane', gantry_crane, K, 'crane', 19.0, 28.0, 44.6, 7.0)
        pl.model('heap.glb', 22.0, 11.0, None, 0.4, 1.0); pl.model('heap.glb', 39.0, 44.0, None, 2.0, 0.9)
        pl.model('dozer.glb', 34.0, 6.0, None, 0.2, 1.0)
        pl.model('shed.glb', mid(barber), barber[2], None, 0.0, 1.35)
        tent_in(mid(clinic), clinic[2], 6.0, K.fac)
        for k, (x, y, w) in enumerate(((20.4, 22.0, 3.0), (39.6, 12.0, 3.0), (37.6, 41.6, 2.8))): tent_in(x, y, w, [K.ply, K.fac, K.rust][k])
        def welding(x=24.0, y=14.4):
            for k in range(3): P.cyl(bpy, 'bottle%d' % k, [K.rust, K.steel, K.teal][k], 0.13, 1.4, (x + k * 0.32, y, 0.7), verts=10)
            Bx(K, 'bench', K.steel, x + 1.0, x + 4.0, y - 0.4, y + 0.6, 0.85, 0.95)
            for xx in (x + 1.1, x + 3.9): Bx(K, 'bench_leg', K.steel, xx - 0.04, xx + 0.04, y - 0.3, y + 0.5, 0, 0.85)
        pl.here('welding', welding)
        pl.model('drums.glb', 27.0, 4.0, None, 0.0, 1.0); pl.model('rubble.glb', 38.0, 3.0, None, 0.0, 0.8)
        lamp(29.0, 46.0); drum(28.0, 33.6)
    else:                                                              # Volunteers: the field hospital
        pl.here('hospital', big_tent, K, 'hospital', 27.6, 39.6, 49.5, 8.0, 4.6, K.bone, K.rust)
        pl.here('hospital_b', big_tent, K, 'hospital_b', 18.4, 25.8, 50.5, 6.0, 3.8, K.sage, None)
        pl.here('pad', pad, K, 'pad', 30.0, 8.0, 4.6, K.paint, walk=False)
        tent_in(mid(clinic), clinic[2], 6.0, K.bone)
        tent_in(mid(barber), barber[2], 4.4, K.sage)
        pl.here('cots', cots, K, 'cots', 20.0, 25.0, 13.0, 17.0)
        pl.here('jugs', jugs, K, 'jugs', 27.6, 33.4, 8)
        pl.built(S.crates, 38.6, 14.0, None, 0.0, 1.0, 5)
        def generator(x=38.0, y=44.0):
            Bx(K, 'gen', K.mustard, x, x + 2.2, y, y + 1.2, 0, 1.3, bevel=0.05); P.rod(bpy, 'muffler', K.steel, (x + 1.8, y + 0.8, 1.3), (x + 1.8, y + 0.8, 2.2), 0.06, 8)
        pl.here('generator', generator)
        def bladder(): P.cyl(bpy, 'bladder', K.blue_tarp, 1.6, 0.7, (21.0, 22.0, 0.35), verts=24)
        pl.here('bladder', bladder)
        pl.model('patrol.glb', 38.0, 4.0, None, math.radians(75), 1.0)
        for x in (26.0, 34.0): lamp(x, 46.0)
        drum(19.6, 33.0)
    pl.built(S.stall, 27.0, 29.4, 4.0)
    pl.built(S.posts, 28.0, 18.0, None, 0.0, 1.0, 12.0)
    pl.built(S.board, 20.5, 24.0, 2.0)


def layout_tall(town, pl, K):
    {'town': lay_town, 'fortress': lay_fortress, 'camp': lay_camp}[town['tier']](town, pl, K)


# ---- the ground, each town's own, laid for the upright frame -------------------------------------------------------------
def plan_tall(town, rnd):
    import bohemia_cook_the_floor_through_the_rig_10_19_26 as F
    ID = F.ID; g = np.full((F.H, F.W), ID['caliche'], np.uint8)
    def band(ya, yb, what, xa=0.0, xb=60.0):
        ra, rb = int((60 - yb) / 60 * F.H), int((60 - ya) / 60 * F.H); ca, cb = int(xa / 60 * F.W), int(xb / 60 * F.W)
        g[max(0, ra):rb, max(0, ca):cb] = ID[what]
    t, n = town['tier'], town['name']
    def slabs(k, kinds=('concrete', 'asphalt', 'track')):
        for _ in range(k):
            w, d = rnd.uniform(4, 8), rnd.uniform(3, 6); x = rnd.uniform(16, 44 - w); y = rnd.uniform(1, 58 - d)
            band(y, y + d, rnd.choice(kinds), x, x + w)
    if town['u'] < 0.6 and n not in ('Caravans', 'Mob'): slabs(9 if t == 'camp' else 6)
    if t == 'town':
        if n in ('Church', 'Reds'):
            band(0, 60, 'concrete'); band(37.0, 42.5, 'asphalt'); band(39.69, 39.81, 'paint', 0, 60)
            for x in np.arange(20, 25, 0.9): band(37.0, 42.5, 'paint', x, x + 0.45)
            if n == 'Reds': band(17.5, 27.0, 'asphalt', 24, 36); [band(19.6, 24.2, 'paint', x, x + 0.12) for x in np.arange(24.6, 36, 2.7)]   # the lot is the bank's car park
            else: band(0.5, 9.5, 'rough', 34, 44); band(19.0, 26.0, 'concrete')
        elif n == 'Blues':
            band(0, 60, 'caliche'); band(37.4, 41.6, 'track'); band(41.6, 43.6, 'rough'); band(11.0, 18.0, 'rough', 16, 44)
        else:
            band(0, 60, 'rough'); band(37.0, 42.5, 'asphalt'); band(35.6, 37.0, 'concrete'); band(42.5, 43.8, 'concrete', 28, 44)
            band(37.0, 42.5, 'rough', 31, 36); band(2.0, 16.0, 'caliche', 22, 38)
    elif t == 'fortress':
        if n == 'Mob':
            band(0, 60, 'concrete'); band(44.0, 48.0, 'asphalt'); band(45.95, 46.05, 'paint', 0, 60); band(5.0, 16.0, 'asphalt', 24, 36)
        elif n == 'Caravans':
            band(0, 60, 'asphalt'); band(0, 8, 'caliche', 0, 24); band(50, 60, 'rough'); [band(14.0, 18.5, 'paint', x, x + 0.12) for x in np.arange(31, 42, 4.0)]
        elif n == 'Cartel':
            band(0, 60, 'rough'); band(44.0, 47.0, 'asphalt'); band(17.0, 30.0, 'asphalt', 16, 44); band(8.0, 13.0, 'concrete', 26, 36)
        elif n == 'Network':
            band(0, 60, 'concrete'); band(40, 50, 'rough', 18, 28); band(2, 12, 'rough', 30, 44); band(44.0, 48.0, 'asphalt', 0, 60)
        else:
            band(0, 60, 'caliche'); band(8.0, 54.0, 'concrete', 16, 44); band(9.0, 15.4, 'concrete', 19, 27); band(44.0, 48.0, 'asphalt', 0, 60)
            for x in np.arange(20, 27, 3.0): band(9.4, 15.4, 'paint', x, x + 0.1)
    else:
        if n == 'Homeless':
            band(0, 60, 'rough'); band(44.0, 58.0, 'concrete', 16, 44); band(32.0, 35.0, 'playa', 0, 60); band(1, 9, 'desert')
        elif n == 'Custom':
            band(0, 60, 'caliche'); band(32, 35, 'track'); band(44, 58, 'concrete', 24, 44); band(12, 20, 'rough', 18, 32)
        elif n == 'Trades':
            band(0, 60, 'rough'); band(32, 35, 'track'); band(44, 60, 'concrete', 20, 44); band(8, 18, 'caliche', 16, 30)
        elif n == 'Volunteers':
            band(0, 60, 'caliche'); band(32, 35, 'track'); band(44, 58, 'concrete', 16, 44); band(10, 20, 'rough', 16, 26)
        else:
            band(0, 60, 'desert'); band(32, 35, 'track'); band(44, 58, 'caliche', 16, 44); band(10, 18, 'rough', 16, 26)
    return g


# ---- the taps, the doors and the entrance of a composition ---------------------------------------------------------------
ROLES = {'town': (['barber', 'clinic', 'stall', 'posts', 'board'], ['bar', 'smith', 'armourer', 'lot', 'build', 'look']),
         'fortress': (['clinic', 'barber', 'stall', 'board', 'posts'], ['smith', 'armourer', 'bar', 'lot', 'build', 'look']),
         'camp': (['clinic', 'barber', 'stall', 'posts', 'board'], ['arms', 'bar', 'lot', 'build', 'look'])}
# which thing in the scene each tap is, when its name is not the tap's own
THING = {'Anarchists': {'barber': 'bld_ranch_carport', 'bar': 'bld_ranch_porch', 'armourer': 'container'},
         'Blues': {'barber': 'bld_warehouse', 'clinic': 'bld_warehouse', 'bar': 'hoop_a'},
         'Custom': {'clinic': 'shed'}, 'Trades': {'barber': 'shed', 'clinic': 'tent'},
         'Colorful': {'clinic': 'tent', 'barber': 'tent'}, 'Volunteers': {'clinic': 'tent', 'barber': 'tent'}}


def taps_tall(town, meta):
    """the composition's taps from its own measure: a building's box is its outline (roof to foot); the fortress's smith and
    armourer are the barber's and the clinic's ground floors (as wide); the ground taps are their patches"""
    tier, name = town['tier'], town['name']
    hot_roles, box_roles = ROLES[tier]
    byname = {}
    for o in meta['outlines']: byname.setdefault(o['name'], []).append(o)
    def thing(role):
        nm = THING.get(name, {}).get(role, role)
        c = byname.get(nm) or []
        if not c: return None
        if role in ('clinic', 'barber') and nm == 'tent':        # the camp's two tents: the one standing where the role stands
            want = proj(23.0 if role == 'clinic' else 34.2, 43.5 if role == 'clinic' else 29.6, 0)
            c = sorted(c, key=lambda o: abs((o['box'][0] + o['box'][2]) / 2 - want[0]) + abs(o['box'][3] - want[1]))
        if nm == 'shed' and role in ('clinic', 'barber'):
            want = proj(23.0 if role == 'clinic' else 34.2, 43.5 if role == 'clinic' else 29.6, 0)
            c = sorted(c, key=lambda o: abs((o['box'][0] + o['box'][2]) / 2 - want[0]) + abs(o['box'][3] - want[1]))
        return list(c[0]['box'])
    hot, boxes = {}, {}
    for r in hot_roles:
        b = thing(r)
        if b is None: raise SystemExit('TALL %s: no %s in the scene' % (name, r))
        if name == 'Blues' and r in ('barber', 'clinic'):          # the co-op's hall is both, its two halves
            mx = (b[0] + b[2]) // 2; b = [b[0], b[1], mx, b[3]] if r == 'barber' else [mx, b[1], b[2], b[3]]
        hot[r] = {'box': b, 'kind': r}
    pb = meta['boxes']
    for r in box_roles:
        if r == 'look': boxes[r] = list(hot['clinic']['box']); continue
        if r in pb: boxes[r] = gbox(*pb[r]); continue
        if tier == 'fortress' and r in ('smith', 'armourer'):
            b = hot['barber' if r == 'smith' else 'clinic']['box']; hgt = b[3] - b[1]
            boxes[r] = [b[0], b[3] - int(hgt * 0.32), b[2], b[3]] if r == 'smith' else [b[0] + (b[2] - b[0]) // 2, b[3] - int(hgt * 0.32), b[2], b[3]]
            continue
        b = thing(r)
        if b is None: raise SystemExit('TALL %s: no %s in the scene' % (name, r))
        boxes[r] = b
    return hot, boxes


GROUND = {'lot', 'build', 'bar', 'arms'}


def doors_of(hot, boxes, ground=GROUND):
    """where a keeper stands and where he walks in (picture px): a building's or a stall's foot, its middle; a patch of ground
    he taps (the lot, the build ground, the bar's fire, the arms) its middle"""
    out = {}
    for r, v in list(hot.items()) + [(k, {'box': b}) for k, b in boxes.items() if k != 'look']:
        b = v['box']; out[r] = [int((b[0] + b[2]) / 2), int((b[1] + b[3]) / 2) if r in ground else int(b[3])]
    return out


def entrance_of(town, W, H, wide=False):
    side = entrance_side(town['name'])
    y = V_STREET_Y[town['tier']] if wide else STREET_Y[town['tier']]
    x = 6.6 if (wide and side == 'left') else 53.4 if wide else (18.6 if side == 'left' else 41.4)
    px, py = proj(x, y, 0, W, H)
    return {'side': side, 'at': [int(px), int(py)]}


V_STREET_Y = {'town': 31.8, 'fortress': 39.0, 'camp': 29.5}       # the 10/25 pictures' street, track and road


def reach(W, H, blocks, start, targets, cell=8):
    """the composed ground: the picture less its blocks, in cells; from the entrance, which doors are reached"""
    gw, gh = W // cell + 1, H // cell + 1
    free = np.ones((gh, gw), bool)
    for b in blocks:
        x0, y0, x1, y1 = b
        # a block is where a person cannot stand: from its roof to a little above its foot (he stands at a door's foot)
        free[max(0, int(y0 // cell)):max(0, int((y1 - 6) // cell)), max(0, int(x0 // cell) + 1):max(0, int(x1 // cell))] = False
    def cellof(p): return min(gh - 1, max(0, int(p[1] // cell))), min(gw - 1, max(0, int(p[0] // cell)))
    s = cellof(start)
    if not free[s]:
        for r in range(1, 12):
            hit = [(s[0] + dy, s[1] + dx) for dy in range(-r, r + 1) for dx in range(-r, r + 1) if 0 <= s[0] + dy < gh and 0 <= s[1] + dx < gw and free[s[0] + dy, s[1] + dx]]
            if hit: s = hit[0]; break
    seen = np.zeros_like(free); stack = [s]; seen[s] = True
    while stack:
        y, x = stack.pop()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (y + dy, x + dx)
            if 0 <= q[0] < gh and 0 <= q[1] < gw and free[q] and not seen[q]: seen[q] = True; stack.append(q)
    out = {}
    for k, p in targets.items():
        c = cellof((p[0], p[1] + 10))
        out[k] = any(seen[c[0] + dy, c[1] + dx] for dy in (-1, 0, 1, 2) for dx in (-1, 0, 1) if 0 <= c[0] + dy < gh and 0 <= c[1] + dx < gw)
    return out


def corner_clear(box, W=TW, H=TH):
    """rule 213: the phone sits in a bottom corner, left or right; a tap's middle is never in the bottom three tenths at either
    side (the middle two tenths of the width are the thumb's reach)"""
    cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
    return not (cy > 0.70 * H and (cx < 0.40 * W or cx > 0.60 * W))


# ---- the render: the 10/25 tool's own, with the upright frame -------------------------------------------------------------
def patch_tall():
    V.PW, V.PH, V.X0, V.Y1 = TW, TH, 30.0 - TW / 2 / PPM, 30.0 + (TH / 2) / (PPM * SQ)
    V.OUT = TOUT; V.Town = TallTown; V.layout = layout_tall; V.plan = plan_tall
    V.fill = fill_tall


def fill_tall(town, pl, K, n_want=14):
    """the 10/25 fill (the town's own junk on its free ground), kept off the upright frame's taps"""
    now = TallTown.outlines(pl)                    # the measure so far (never the render's checked one)
    occ = [o['box'] for o in now]
    taps = [gbox(*b) for b in pl.boxes.values()]
    # the open middle and the walks in front of the tap things are kept clear for people
    for nm in ('stall', 'posts', 'board', 'barber', 'clinic', 'smith', 'armourer', 'bar'):
        for o in now:
            if o['name'] == nm: b = o['box']; taps.append([b[0], b[3] - 20, b[2], b[3] + 80])
    occ += [[b[0] - 30, b[1] - 20, b[2] + 30, b[3] + 30] for b in taps]
    kinds = V.TOWN_FILL.get(town['name'], ['crates', 'drums'])
    rnd = K.rnd; placed = 0
    for _ in range(900):
        if placed >= n_want: break
        k = rnd.choice(kinds); w, d, h, put = V.FILL[k]
        px, py1 = rnd.uniform(40, TW - 40), rnd.uniform(200, TH - 20)
        x, y = V.X0 + px / PPM, V.Y1 - py1 / (PPM * SQ)
        box = [px - w / 2 * PPM - 12, py1 - (h * PPM + d * PPM * SQ) - 12, px + w / 2 * PPM + 12, py1 + 12]
        if any(not (box[2] < b[0] or box[0] > b[2] or box[3] < b[1] or box[1] > b[3]) for b in occ): continue
        put(pl, K, x, y); occ.append(box); placed += 1
    return placed


# V.render dumps outlines, lamps and fires; the ground taps (pl.boxes) are added through this hook
_orig_render_dump = json.dump
def _dump(obj, fp, *a, **k):
    if isinstance(obj, dict) and 'outlines' in obj and 'filled' in obj and _LAST.get('boxes') is not None:
        obj = dict(obj); obj['boxes'] = _LAST['boxes']; obj['comp'] = 'tall'; obj['px'] = [TW, TH]
    return _orig_render_dump(obj, fp, *a, **k)
_LAST = {}


class LayoutBad(Exception):
    pass


class _Hook(TallTown):
    def outlines(s):
        """the render's own measure (after the fill): the doors and the phone's corner checked here, before the long render;
        a town that fails is named and not rendered"""
        _LAST['boxes'] = s.boxes
        out = super().outlines()
        if _LAST.get('town') is not None:
            bad = check_layout(_LAST['town'], {'outlines': out, 'boxes': s.boxes})
            if bad: raise LayoutBad(', '.join(bad))
        return out


# rule 220(d): each composition opens fitted to the screen; a pinch zooms in as far as the town's size earns (a camp a little, a big
# town more): the most the screen may scale the fitted picture, by tier
ZOOM = {'camp': 1.5, 'town': 2.0, 'fortress': 2.5}


def ship_tall(towns_):
    """the upright pictures into slices/settlement_ground_towns/ beside the wide ones; each town's entry carries both
    compositions (src, px, hotspots, boxes, doors, entrance, zoom_max) and the walk outlines of both"""
    from PIL import Image
    SHIP = V.SHIP
    manp = os.path.join(SHIP, 'settlement_ground.json'); walkp = os.path.join(SHIP, 'settlement_walk.json')
    man = json.load(open(manp)); walk = json.load(open(walkp))
    man['tall_and_wide'] = ('ONE PLAN, TWO COMPOSITIONS (COOK [every town built for tall and wide], rule 220): towns[name].wide is the '
                            '2060 x 1092 picture (16:9 side on, a computer) and towns[name].tall the 1024 x 1820 one (9:16, a phone upright), '
                            'the same buildings moved to fit; the screen shows the one that fits the shape and swaps on a turn (RUN TWO). '
                            'Each carries its own hotspots (the screen\'s KMAP roles) AND boxes (what ARMSBOX, LOTBOX, BUILDBOX, LOOKBOX '
                            'held for the tier), doors (where a keeper stands, picture px) and entrance (the street\'s end on the side the '
                            'map\'s road comes in). Nothing he taps stands in the bottom three tenths at either side (rule 213, the phone\'s corner).')
    for town in towns_:
        s = town['slug']; rd = os.path.join(TOUT, 'render')
        meta = json.load(open(os.path.join(rd, s + '.json')))
        for suf in ('', '_night'):
            p = os.path.join(rd, s + suf + '.png')
            if not os.path.exists(p): continue
            a = Image.open(p).convert('RGB'); assert a.size == (TW, TH), a.size
            a.save(os.path.join(SHIP, s + '_tall' + suf + '.webp'), quality=82, method=6)
        hot, boxes = taps_tall(town, meta)
        e = man['towns'].setdefault(town['name'], {})
        wide_boxes = {k: v for k, v in {**V.ARMSBOX.get(town['tier'], {}), 'lot': V.LOTBOX[town['tier']], 'build': V.BUILDBOX[town['tier']]}.items()}
        LOOK = {'camp': [840, 220, 1000, 420], 'town': [1600, 0, 2060, 370], 'fortress': [1116, 122, 1631, 486]}
        wide_boxes['look'] = LOOK[town['tier']]
        e['wide'] = dict(src=e.get('src', s + '.webp'), night_src=e.get('night_src', s + '_night.webp'), px=[WW, WH], hotspots=town['hot'],
                         boxes=wide_boxes, doors=doors_of(town['hot'], wide_boxes), entrance=entrance_of(town, WW, WH, wide=True), zoom_max=ZOOM[town['tier']])
        e['tall'] = dict(src=s + '_tall.webp', night_src=s + '_tall_night.webp', px=[TW, TH], hotspots=hot, boxes=boxes,
                         doors=doors_of(hot, boxes), entrance=entrance_of(town, TW, TH), zoom_max=ZOOM[town['tier']])
        bl = sorted({tuple(o['box']) for o in meta['outlines']})
        for suf in ('', '_night'): walk['pictures'][s + '_tall' + suf + '.webp'] = {'blocks': [list(b) for b in bl]}
        wm = json.load(open(os.path.join(R, 'records/target/cook_town_screens/render', s + '.json')))
        wb = sorted({tuple(o['box']) for o in wm['outlines'] if o['h'] >= 0.45})        # the wide's: a flat thing he steps over is no block
        for suf in ('', '_night'): walk['pictures'][s + suf + '.webp'] = {'blocks': [list(b) for b in wb]}
        print('  shipped tall', s, len(bl), 'outlines', flush=True)
    json.dump(man, open(manp, 'w'), indent=1)
    json.dump(walk, open(walkp, 'w'), indent=1)


def check_layout(town, meta):
    """the door and the phone's corner, before the long render: what fails is named"""
    hot, boxes = taps_tall(town, meta); doors = doors_of(hot, boxes); ent = entrance_of(town, TW, TH)
    r = reach(TW, TH, [o['box'] for o in meta['outlines']], ent['at'], doors)
    bad = ['door ' + k for k, v in r.items() if not v]
    bad += ['corner ' + k for k, v in list(hot.items()) + list(boxes.items()) if not corner_clear(v['box'] if isinstance(v, dict) else v)]
    return bad


def layout_only(town):
    """the scene built and measured as the render builds it (the same seed, plan, layout and fill), its outlines and taps
    written to tall/layout/<town>.json, nothing rendered: the door check before the long render"""
    import bpy, hashlib, random
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F
    seed = int(hashlib.sha1(('town:' + town['name']).encode()).hexdigest()[:6], 16) % 9973
    rnd = random.Random(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    NF.LEDGER.clear(); NF.LEDGER.update(bid='settle.' + town['slug'], seed=seed % 97)
    g = plan_tall(town, rnd)
    objs, gg = F.build(bpy, g, 2020 + seed, True)
    K = V.Kit(bpy, P, BLD, town, rnd)
    pl = TallTown(bpy, P, rnd)
    layout_tall(town, pl, K)
    filled = fill_tall(town, pl, K, 14 if town['tier'] != 'camp' else 18)
    meta = dict(name=town['name'], tier=town['tier'], outlines=pl.outlines(), boxes=pl.boxes, filled=filled, seed=seed)
    od = os.path.join(TOUT, 'layout'); os.makedirs(od, exist_ok=True)
    _orig_render_dump(meta, open(os.path.join(od, town['slug'] + '.json'), 'w'), indent=0)
    return meta


if __name__ == '__main__':
    a = sys.argv[1:]
    want = [x for x in a if not x.startswith('--')]
    T = [t for t in V.towns() if not want or t['name'] in want or t['slug'] in want]
    if '--layout-only' in a:
        patch_tall()
        for town in T: m = layout_only(town); print('  laid out', town['name'], check_layout(town, m) or 'every door walked to, every tap clear of the phone', flush=True)
        sys.stdout.flush(); os._exit(0)
    if '--swap-only' not in a:
        patch_tall(); V.Town = _Hook; json.dump = _dump
        for town in list(T):
            _LAST['town'] = town
            try: d, nn = V.render(town, quick='--quick' in a, day_only='--day-only' in a); print('  rendered tall', town['name'], d, nn, flush=True)
            except LayoutBad as ex: print('  NOT RENDERED', town['name'], str(ex), flush=True); T.remove(town)
        _LAST['town'] = None
        json.dump = _orig_render_dump
    if '--quick' not in a and '--no-ship' not in a: ship_tall(T)
    sys.stdout.flush(); os._exit(0)
