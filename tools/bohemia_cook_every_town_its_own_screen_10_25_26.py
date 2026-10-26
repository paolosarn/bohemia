#!/usr/bin/env python3
"""BOHEMIA -- COOK [every town looks its own], THE SETTLEMENT SCREEN'S HALF: EVERY HOME BASE ITS OWN PICTURE (10/25/26).
Rule 186(b) (Paolo 10/25: 'every settlement has to look unique and different a little bit; they can borrow from each other,
especially if they're in the same tier, but still... a settlement deep in the heart of the city should give more city
vibes'). EYES 10/25w (line 106 of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md, q26, k04, k32): 'ON THE MAP Caravans stands
in its blocks as its own walled yard (good); IN THE TOWN one tier is still one picture: Cartel is the same yard as Mob and
Network, the same tan house, striped stall, tank, sandbags and fence; the camps (Custom, Colorful) are the same tents.'

WHAT WAS WRONG: the settlement screen draws one of two pictures per tier (slices/settlement_ground_packs/, the home block in
slices/settlement_ground/), picked by the town's name; 14 home bases share 7 pictures, and the two of a tier are one place
moved about (likeness 0.78 to 0.90 by tools/bohemia_cook_town_screen_likeness_10_25_26.py).

WHAT THIS BUILDS: every home base's own place, from ITS OWN PLAN (records/target/cook_towns/BOHEMIA_EVERY_TOWN_ITS_OWN.json,
the map's painter's plan: where it stands (u, the city's weight round it), its tier, its trade and landmark, its faction's
colour), as a scene in metres through the master rig, the 10/20 settlement tool's camera, ground, light and night
(tools/bohemia_cook_the_settlements_through_the_rig_10_20_26.py, imported untouched):
  WHERE IT STANDS: the heart of the city (Church, Mob, Reds) is concrete, four to nine storeys wall to wall rising off the top
    of the picture, storefronts and fascias, blade signs, street lights, a paved street with its crossing; the edge (Blues,
    Anarchists, Caravans, Cartel, Remnants, Colorful, Custom, Homeless, Trades) is low: tin and plywood, houses built up,
    containers, trailers, yards, dirt; between (Network, Volunteers) a little of each.
  ITS TRADE: Church its church, its graves and its soup line; Reds the bank's portico and its tower, a parking garage, an
    armoured car; Mob the casino tower's podium, its pylon sign, a dry fountain, the valet loop; Anarchists a stage in a ring
    of burnt cars, a painted wall; Blues the co-op's hall, hoop houses, beds, a wind turbine, a rain tank; Caravans a truck
    stop (the fuel canopy, semis in rows, a wall of trailers, fuel tanks); Cartel storage rows behind a dark wall, its
    watchtowers; Network the mast, the exchange, its dishes behind razor wire; Remnants cell blocks, the prison wall and its
    guard towers, the exercise cage; Colorful its painted hall, patchwork tents, bunting, a painted bus; Custom the crew's
    own garage and yard, cars on blocks, the engine hoist; Homeless the flood tunnels' mouths in the wash, the rust tank,
    blue tarps and carts; Trades the sawtooth shop, the gantry crane, scrap heaps, the dozer; Volunteers the field hospital,
    its landing pad, cots under shade, water and supplies.
  ITS COLOUR: the faction's own colour faded (rule 159, fenced by 167(b)) on a share of its awnings, tarps, doors, a banner;
    never a whole town.
  SHARED WITHIN A TIER: the tappable things sit in the tier's own boxes (every hotspot of the tier's manifest and the screen's
    own boxes for the arms, the bar, the smith, the armourer, the lot and the build), so the screen's taps land on what they
    name; what each of them IS changes with the town (a storefront under five storeys in the heart, a tin shack at the edge).
THE WALK OUTLINES (rule 169, for RUN TWO): every thing placed is measured in the scene and its box on the picture, roof to
front foot, is written per picture in RUN TWO's own format (slices/settlement_ground_towns/settlement_walk.json), so the lead
never walks on a roof.

  <venv>/bin/python tools/bohemia_cook_every_town_its_own_screen_10_25_26.py [Town ...] [--quick] [--day-only] [--swap-only]
     --quick  a quarter-size test render at 8 samples (records/target/cook_town_screens/quick/)
  -> records/target/cook_town_screens/render/<town>.png, <town>_night.png, <town>.json (lamps, fires, outlines)
  -> slices/settlement_ground_towns/<town>.webp, <town>_night.webp, settlement_ground.json, settlement_walk.json

REFERENCE CHECK (the 9/4 standing duty): Battle Brothers' town screens are one painted panorama per kind of place that
changes with the ground round it (Grok, unverified: reference/library/grok/GROK_SETTLEMENT_SCREEN_BB_WAY_2026_10_24.md); its
world map draws every town its own; real Las Vegas: Fremont and East Fremont's four-to-nine storey concrete blocks over
storefronts and blade signs, the downtown garages, the truck stops' canopies on the 15, self-storage rows behind block walls,
the flood-control tunnels under the Strip where people live, the county's field-hospital tents. No reference game added.
REUSE CHECK (REUSE-FIRST): the 10/20 settlement tool (camera, ground, Place, stall, posts, board, tent, palisade, fire,
crates, the night), the floor tool's ground and the not-final tool's grime and junk, COOK's building modeller and props and
every glb in reference/models/bohemia/, the master rig's passes and light. New here only what had no model: the concrete
block, the shack, the towers, the mast, the dishes, the hoop house, the beds, the turbine, the stage, the canopy, the storage
row, the culvert, the sawtooth shop, the gantry, the bus, the field hospital, the pad.
TASTE CHECK: his 'every settlement... unique', 'the heart of the city... city vibes'; no rainbow (159), never drained (167(b)).
"""
import os, sys, json, math, random, hashlib
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_the_settlements_through_the_rig_10_20_26 as S

OUT = os.path.join(R, 'records/target/cook_town_screens')
SHIP = os.path.join(R, 'slices/settlement_ground_towns')
PLANS = os.path.join(R, 'records/target/cook_towns/BOHEMIA_EVERY_TOWN_ITS_OWN.json')
PPM, PW, PH, X0, Y1, SQ = S.PPM, S.PW, S.PH, S.X0, S.Y1, S.SQ
TILT = math.radians(45.0)

# the screen's own boxes per tier (slices/BOHEMIA_SETTLEMENT_SCREEN.html ARMSBOX, LOTBOX, BUILDBOX, LOOKBOX): kept as they are
ARMSBOX = {'camp': {'arms': [600, 390, 770, 580], 'bar': [1100, 220, 1260, 410]},
           'town': {'smith': [1060, 720, 1480, 1092], 'armourer': [1830, 720, 2060, 1092], 'bar': [0, 0, 440, 370]},
           'fortress': {'smith': [120, 860, 470, 960], 'armourer': [1360, 470, 1610, 560], 'bar': [1800, 880, 2010, 1030]}}
LOTBOX = {'camp': [1290, 680, 1570, 800], 'town': [470, 880, 760, 1092], 'fortress': [1330, 700, 1480, 830]}
BUILDBOX = {'camp': [1600, 440, 2010, 600], 'town': [420, 400, 1080, 530], 'fortress': [1640, 480, 2040, 760]}


def slug(name): return name.lower().replace(' ', '_')


def faction_colours():
    import re
    s = open(os.path.join(R, 'slices/BOHEMIA_CITY_WORLD.html')).read()
    i = s.index('window.BOHEMIA_FACTION_COLOURS='); j = s.index(';', s.index('"factions"', i))
    return {k: v['hex'] for k, v in json.loads(s[i + len('window.BOHEMIA_FACTION_COLOURS='):j])['factions'].items()}


def towns():
    """the fourteen home bases the screen opens (the map's ctBases), each with its plan and its tier's boxes"""
    plans = {t['name']: t for t in json.load(open(PLANS))['towns'] if not t['region']}
    man = json.load(open(os.path.join(R, 'slices/settlement_ground_packs/settlement_ground.json')))
    fc = faction_colours(); out = []
    for name, t in sorted(plans.items()):
        tier = t['tier']; v0 = man['tiers'][tier]['variants'][0]
        out.append(dict(name=name, slug=slug(name), tier=tier, u=t['u'], stands=t['stands'], trade=t['trade'], plan=t,
                        hot=v0['hotspots'], fac=fc.get(name, '#7a756c')))
    return out


# ---- colour --------------------------------------------------------------------------------------------------------------
def _lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def faded(hexc, k=0.5, v=0.92):
    """a faction's colour as act one wears it (rule 159: faded, dirty, rare; 167(b): never drained): half way to its own
    grey, a little darker; returns sRGB 0..255"""
    r, g, b = (int(hexc[i:i + 2], 16) for i in (1, 3, 5))
    y = 0.299 * r + 0.587 * g + 0.114 * b
    return tuple(int(max(0, min(255, (c + (y - c) * k) * v))) for c in (r, g, b))


def hexmat(bpy, name, rgb, glow=0.0, rough=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; col = tuple(_lin(c) for c in rgb) + (1.0,)
    b.inputs['Base Color'].default_value = col; b.inputs['Roughness'].default_value = rough
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    if glow: b.inputs['Emission Color'].default_value = col; b.inputs['Emission Strength'].default_value = glow
    m['palette_role'] = 'clay_bone'; m['palette_step'] = 2
    return m


class Kit:
    """one town's materials: the building set (COOK's modeller's, tinted by the town's own palette), its faction's faded
    colour, its tarps, char, soil, leaf, and the windows that light at night"""
    def __init__(s, bpy, P, BLD, town, rnd):
        s.bpy, s.P, s.BLD, s.rnd = bpy, P, BLD, rnd
        pal = town['plan'].get('palette', {})
        def tint(hexc, lo=0.9, hi=1.1):
            if not hexc: return (1, 1, 1)
            c = np.array([int(hexc[i:i + 2], 16) for i in (1, 3, 5)], float); c = c / c.mean()
            return tuple(float(np.clip(x, lo, hi)) for x in c)
        BLD.M.clear(); BLD.TINT = dict(stucco=tint(pal.get('house_colour')), pale=tint(pal.get('tin')), roof=tint(pal.get('roof'), 0.85, 1.12))
        s.mm = BLD.mats(bpy); BLD.TINT = {}
        s.fac_rgb = faded(town['fac']); s.fac = hexmat(bpy, 'fac_' + town['slug'], s.fac_rgb)
        s.fac_dark = hexmat(bpy, 'fac_dark_' + town['slug'], tuple(int(c * 0.62) for c in s.fac_rgb))
        s.concrete = hexmat(bpy, 'concrete', (150, 146, 138)); s.concrete_dk = hexmat(bpy, 'concrete_dk', (112, 108, 102))
        s.concrete_warm = hexmat(bpy, 'concrete_warm', (158, 146, 128))
        s.tin = P.mat(bpy, 'tin', 'metal_painted', 3); s.tin_rust = P.mat(bpy, 'tin_rust', 'clay_rust', 1)
        s.ply = P.mat(bpy, 'ply', 'tape_masking', 2); s.wood = P.mat(bpy, 'wood', 'clay_bone', 1)
        s.steel = P.mat(bpy, 'steel', 'tape_grey', 1); s.dark = P.mat(bpy, 'dark', 'rubber', 1)
        s.black = P.mat(bpy, 'black', 'cloth_black', 0); s.char = P.mat(bpy, 'char', 'cloth_black', 1)
        s.bone = P.mat(bpy, 'bone', 'clay_bone', 3); s.rust = P.mat(bpy, 'rust', 'clay_rust', 2)
        s.mustard = hexmat(bpy, 'mustard_faded', faded('#c99437', 0.45)); s.teal = hexmat(bpy, 'teal_faded', faded('#4f8f86', 0.4))
        s.blue_tarp = hexmat(bpy, 'blue_tarp', faded('#3a64a8', 0.42)); s.sage = hexmat(bpy, 'sage', faded('#7f9a5c', 0.45))
        s.soil = hexmat(bpy, 'soil', (78, 66, 54)); s.leaf = hexmat(bpy, 'leaf', (98, 102, 66)); s.leaf_dead = hexmat(bpy, 'leaf_dead', (128, 110, 80))
        s.frond = hexmat(bpy, 'frond', (118, 98, 70)); s.trunk = hexmat(bpy, 'trunk', (104, 90, 74))
        s.paint = hexmat(bpy, 'paint_line', (176, 168, 150)); s.plastic = hexmat(bpy, 'plastic', (184, 186, 182))
        s.water = hexmat(bpy, 'water_jug', faded('#5d86a8', 0.5))
        s.night_win = []                                       # windows that light at night only

    def win_night(s):
        """a window dark by day that lights at night (amber); the material is shared and lit by render()"""
        m = s.bpy.data.materials.new('night_window'); m.use_nodes = True
        b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = tuple(_lin(c) for c in (40, 38, 36)) + (1,)
        b.inputs['Roughness'].default_value = 1.0; b.inputs['Emission Color'].default_value = tuple(_lin(c) for c in (226, 166, 92)) + (1,)
        b.inputs['Emission Strength'].default_value = 0.0
        m['palette_role'] = 'glass_eye'; m['palette_step'] = 0
        s.night_win.append(m); return m


# ---- the things that had no model --------------------------------------------------------------------------------------
def Bx(K, n, m, x0, x1, y0, y1, z0, z1, bevel=0.0, rot=0.0):
    return K.BLD.B(K.bpy, n, m, x0, x1, y0, y1, z0, z1, bevel=bevel, rot=rot)


def block(K, n, x0, x1, yf, D, floors, kind='shop', wall=None, accent=None, sign=None, lit=0.12, ground_h=4.4, fl=3.3, roof=True):
    """THE CONCRETE BLOCK: a city building of `floors` storeys, its front at yf facing the camera: a storefront ground
    floor (glass bays, a door, the fascia with what is left of its letters, an awning in the town's colour if it has one),
    window rows above (broken, boarded, dark, a few that light at night), the floor slabs' lines, a flat roof with its
    parapet and plant; kind: shop, office, blank, cells, bank"""
    bpy, BLD, mm, rnd = K.bpy, K.BLD, K.mm, K.rnd
    wall = wall or K.concrete
    H = ground_h + fl * max(0, floors - 1)
    Bx(K, n + '_body', wall, x0, x1, yf, yf + D, 0, H, bevel=0.03)
    Bx(K, n + '_base', K.concrete_dk, x0 - 0.03, x1 + 0.03, yf - 0.03, yf + D, 0, 0.35)
    nw = K.win_night()
    # the floor slabs, a line across the front at every floor
    for f in range(1, floors):
        z = ground_h + fl * (f - 1)
        Bx(K, n + '_slab%d' % f, K.concrete_dk, x0 - 0.05, x1 + 0.05, yf - 0.08, yf, z - 0.12, z + 0.06)
    # the ground floor
    if kind in ('shop', 'bank'):
        bay = 3.2 if kind == 'shop' else 2.4; xs = np.arange(x0 + bay / 2 + 0.4, x1 - bay / 2, bay)
        door = int(rnd.randint(0, max(1, len(xs))))
        for j, x in enumerate(xs):
            if j == door: BLD.opening(bpy, '%s_door%d' % (n, j), 'door', x, 1.6, 0.0, 2.5, yf, 'boarded' if rnd.random() < 0.3 else None)
            else: BLD.opening(bpy, '%s_bay%d' % (n, j), 'window', x, bay - 0.6, 0.5, 3.0, yf, rnd.choice([None, 'broken', 'boarded', 'black', 'barred']))
        Bx(K, n + '_fascia', mm['pale'] if kind == 'shop' else K.concrete_warm, x0 + 0.2, x1 - 0.2, yf - 0.16, yf - 0.02, 3.25, 4.05)
        for q in range(int((x1 - x0 - 1.0) / 0.62)):                        # a name with letters fallen off
            if rnd.random() < 0.45: continue
            xq = x0 + 0.7 + q * 0.62
            Bx(K, '%s_let%d' % (n, q), mm['dark'], xq, xq + 0.4, yf - 0.2, yf - 0.15, 3.4, 3.9)
        if accent is not None:                                              # an awning in the town's colour, sagging
            P = K.P
            P.box(bpy, n + '_awning', accent, (x1 - x0 - 1.0, 1.6, 0.05), ((x0 + x1) / 2, yf - 0.75, 3.05), rot=(math.radians(-16), 0, 0))
    elif kind == 'cells':
        for j, x in enumerate(np.arange(x0 + 1.0, x1 - 0.5, 1.6)):
            BLD.opening(bpy, '%s_slit%d' % (n, j), 'window', x, 0.28, 1.4, 3.0, yf, 'barred')
        BLD.opening(bpy, n + '_door', 'steel', (x0 + x1) / 2, 1.6, 0.0, 2.6, yf, None)
    elif kind == 'office':
        for j, x in enumerate(np.arange(x0 + 1.4, x1 - 1.0, 2.2)):
            BLD.opening(bpy, '%s_gw%d' % (n, j), 'window', x, 1.6, 0.6, 3.4, yf, rnd.choice([None, 'black', 'boarded', 'broken']))
        BLD.opening(bpy, n + '_door', 'glassdoor', x0 + (x1 - x0) * 0.5, 2.0, 0.0, 2.7, yf, 'black')
    else:   # blank
        BLD.opening(bpy, n + '_door', 'steel', x0 + 2.0, 1.2, 0.0, 2.4, yf, None)
        for j, x in enumerate(np.arange(x0 + 4.0, x1 - 1.0, 3.0)):
            Bx(K, '%s_louvre%d' % (n, j), mm['steel'], x - 0.6, x + 0.6, yf - 0.05, yf, 2.6, 3.4)
    # the floors above
    for f in range(1, floors):
        z0 = ground_h + fl * (f - 1) + 0.9
        if kind == 'cells':
            for j, x in enumerate(np.arange(x0 + 1.0, x1 - 0.5, 1.6)):
                BLD.opening(bpy, '%s_s%d_%d' % (n, f, j), 'window', x, 0.28, z0 + 0.2, z0 + 1.6, yf, 'barred')
            continue
        if kind == 'blank' and f % 2: continue
        step = 2.4 if kind != 'bank' else 2.0
        for j, x in enumerate(np.arange(x0 + 1.2, x1 - 0.8, step)):
            r = rnd.random()
            if r < lit:
                BLD.opening(bpy, '%s_w%d_%d' % (n, f, j), 'window', x, 1.3, z0, z0 + 1.6, yf, None)
                Bx(K, '%s_wl%d_%d' % (n, f, j), nw, x - 0.62, x + 0.62, yf - 0.03, yf - 0.01, z0 + 0.04, z0 + 1.56)
            else: BLD.opening(bpy, '%s_w%d_%d' % (n, f, j), 'window', x, 1.3, z0, z0 + 1.6, yf, rnd.choice([None, None, 'broken', 'boarded', 'black', 'black']))
    if roof:
        BLD.flat_roof(bpy, n + '_roof', x0, x1, yf, yf + D, H, parapet=0.7, m=K.concrete_dk)
        for k in range(max(1, int((x1 - x0) / 9))):
            BLD.cooler(bpy, n + '_cool%d' % k, x0 + 2 + k * 8 + rnd.uniform(-1, 1), yf + D * rnd.uniform(0.4, 0.7), H)
    if sign is not None:                                                    # a blade sign out from the front, blank and faded
        xs_, col = sign
        zt = min(H - 1.0, 13.0); zb = max(4.6, zt - 7.0)
        Bx(K, n + '_blade', col, xs_ - 0.18, xs_ + 0.18, yf - 1.6, yf - 0.1, zb, zt, bevel=0.02)
        Bx(K, n + '_bladef', mm['trim'], xs_ - 0.22, xs_ + 0.22, yf - 1.66, yf - 0.06, zb - 0.12, zb)
        for q in range(int((zt - zb) / 0.5)):                               # its bulbs, most dead
            K.P.cyl(bpy, '%s_bulb%d' % (n, q), K.bone if rnd.random() < 0.7 else mm['amber'], 0.06, 0.06, (xs_ - 0.2, yf - 0.9, zb + 0.3 + q * 0.5), rot=(0, math.pi / 2, 0), verts=6)
    return H


def shack(K, n, x0, x1, yf, D=3.4, h=2.4, tarp=None):
    """THE SHACK: tin on a frame of two-by-fours, a plywood front with a door hole, a lean-to roof of corrugated sheet
    sloping back, rust in patches, a tarp over one end"""
    bpy, P, rnd = K.bpy, K.P, K.rnd
    Bx(K, n + '_back', K.tin, x0, x1, yf + D - 0.05, yf + D, 0, h * 0.85)
    for x in (x0, x1 - 0.05): Bx(K, n + '_side', K.tin_rust if rnd.random() < 0.4 else K.tin, x, x + 0.05, yf, yf + D, 0, h * 0.9)
    k = max(2, int((x1 - x0) / 1.22))
    for i in range(k):                                                     # the front in sheets of ply and tin, not quite flush
        xa = x0 + (x1 - x0) * i / k; xb = x0 + (x1 - x0) * (i + 1) / k
        Bx(K, '%s_f%d' % (n, i), rnd.choice([K.ply, K.ply, K.tin, K.tin_rust]), xa, xb - 0.02, yf - rnd.uniform(0, 0.04), yf + 0.04, 0, h + rnd.uniform(-0.1, 0.1))
    dx = x0 + (x1 - x0) * rnd.uniform(0.3, 0.6)
    Bx(K, n + '_door', K.black, dx - 0.45, dx + 0.45, yf - 0.06, yf - 0.02, 0, 1.9)
    slope = math.atan2(h - h * 0.8, D)
    for i in range(k):                                                     # the roof sheets, each its own rust
        xa = x0 - 0.2 + (x1 - x0 + 0.4) * i / k; w = (x1 - x0 + 0.4) / k + 0.08
        P.box(bpy, '%s_r%d' % (n, i), K.tin_rust if rnd.random() < 0.5 else K.tin, (w, D + 0.6, 0.04), (xa + w / 2, yf + D / 2, h * 0.92 + 0.08), rot=(slope, 0, 0))
    for i in range(int(rnd.randint(2, 5))):                               # tyres and stones holding the roof down
        P.cyl(bpy, '%s_tyre%d' % (n, i), K.dark, 0.3, 0.14, (rnd.uniform(x0 + 0.4, x1 - 0.4), yf + rnd.uniform(0.6, D - 0.6), h * 0.95 + 0.15), verts=12)
    if tarp is not None:
        P.box(bpy, n + '_tarp', tarp, (min(2.6, x1 - x0), D + 1.2, 0.03), (x1 - min(2.6, x1 - x0) / 2, yf + D / 2 - 0.3, h + 0.05), rot=(slope * 0.6, rnd.uniform(-0.05, 0.05), 0))
    return h


def tower(K, n, x, yf, h=6.0, w=2.6, roof_m=None):
    """THE WATCH TOWER: four legs braced, a deck, a hut of ply and tin with a slot to see out, a lean-to roof, a ladder"""
    bpy, P = K.bpy, K.P; m = K.wood; half = w / 2; y = yf + half
    for sx in (-1, 1):
        for sy in (-1, 1): P.rod(bpy, n + '_leg', m, (x + sx * half * 1.15, y + sy * half * 1.15, 0), (x + sx * half * 0.9, y + sy * half * 0.9, h), 0.09, 6)
    for z in (h * 0.33, h * 0.66):
        for sy in (-1, 1): P.rod(bpy, n + '_brace', m, (x - half, y + sy * half, z - h * 0.3), (x + half, y + sy * half, z), 0.05, 4)
    Bx(K, n + '_deck', K.ply, x - half - 0.2, x + half + 0.2, y - half - 0.2, y + half + 0.2, h - 0.12, h + 0.06)
    Bx(K, n + '_hut', K.tin, x - half, x + half, y - half, y + half, h, h + 1.9)
    Bx(K, n + '_slot', K.black, x - half * 0.8, x + half * 0.8, y - half - 0.02, y - half + 0.02, h + 1.0, h + 1.45)
    P.box(bpy, n + '_roof', roof_m or K.tin_rust, (w + 0.8, w + 0.9, 0.05), (x, y, h + 2.05), rot=(math.radians(10), 0, 0))
    for z in np.arange(0.3, h, 0.4): Bx(K, n + '_rung', m, x - 0.3, x + 0.3, yf - 0.35, yf - 0.3, z, z + 0.05)
    for sx in (-0.3, 0.3): P.rod(bpy, n + '_rail', m, (x + sx, yf - 0.32, 0), (x + sx, yf - 0.32, h), 0.03, 4)
    return h + 2.1


def water_tower(K, n, x, yf, r=1.6, h=5.0, m=None):
    bpy, P = K.bpy, K.P; m = m or K.tin_rust; y = yf + r
    for a in range(4):
        aa = a * math.pi / 2 + math.pi / 4
        P.rod(bpy, n + '_leg', K.steel, (x + math.cos(aa) * r * 1.2, y + math.sin(aa) * r * 1.2, 0), (x + math.cos(aa) * r * 0.8, y + math.sin(aa) * r * 0.8, h), 0.07, 6)
    P.cyl(bpy, n + '_tank', m, r, 2.6, (x, y, h + 1.3), verts=20)
    bpy.ops.mesh.primitive_cone_add(vertices=20, radius1=r * 1.04, depth=0.8, location=(x, y, h + 3.0)); P.put(bpy, bpy.context.active_object, n + '_cap', K.steel)
    for z in np.arange(0.3, h + 2.4, 0.45): Bx(K, n + '_rung', K.steel, x - 0.25, x + 0.25, y - r - 0.12, y - r - 0.08, z, z + 0.04)
    return h + 3.4


def mast(K, n, x, yf, h=34.0, base=3.2):
    """THE MAST: a lattice tower on three legs tapering to the top, cross-braced, its dishes and panels high up"""
    bpy, P = K.bpy, K.P; y = yf + base / 2; legs = []
    for a in range(3):
        aa = a * 2 * math.pi / 3 - math.pi / 2
        legs.append((math.cos(aa), math.sin(aa)))
    def at(i, z): r = base / 2 * (1 - 0.72 * z / h); return (x + legs[i][0] * r, y + legs[i][1] * r, z)
    for i in range(3): P.rod(bpy, n + '_leg', K.steel, at(i, 0), at(i, h), 0.07, 6)
    z = 0.0; dz = 2.4
    while z < h - 1:
        for i in range(3):
            P.rod(bpy, n + '_x', K.steel, at(i, z), at((i + 1) % 3, z + dz), 0.025, 4)
            P.rod(bpy, n + '_h', K.steel, at(i, z + dz), at((i + 1) % 3, z + dz), 0.025, 4)
        z += dz
    for q, zz in enumerate((h * 0.55, h * 0.7, h * 0.86)):
        P.cyl(bpy, '%s_dish%d' % (n, q), K.bone, 0.7, 0.25, (x + (q - 1) * 0.6, y - base * 0.3, zz), rot=(math.radians(80), 0, math.radians((q - 1) * 25)), verts=16)
    for q in range(3): Bx(K, '%s_panel%d' % (n, q), K.plastic, x - 0.9 + q * 0.9, x - 0.5 + q * 0.9, y - 0.7, y - 0.55, h * 0.93, h * 0.93 + 1.8)
    return h


def dish(K, n, x, yf, r=1.8):
    bpy, P = K.bpy, K.P
    P.rod(bpy, n + '_post', K.steel, (x, yf + 0.5, 0), (x, yf + 0.5, r * 1.1), 0.12, 8)
    P.cyl(bpy, n + '_dish', K.bone, r, 0.3, (x, yf + 0.2, r * 1.25), rot=(math.radians(62), 0, 0), verts=24)
    P.rod(bpy, n + '_arm', K.steel, (x, yf + 0.1, r * 1.25), (x, yf - r * 0.6, r * 1.75), 0.03, 4)
    return r * 2.2


def wires(K, name, m, segs, r=0.006):
    """many thin wires as ONE mesh (a square tube a segment): a run of chain-link is a thousand wires, and a thousand
    operator calls made a fence the slowest thing in a town (10/25, measured: a prison's wire took minutes)"""
    bpy = K.bpy; V, Fc = [], []
    for p0, p1 in segs:
        p0, p1 = np.array(p0, float), np.array(p1, float); d = p1 - p0; L = np.linalg.norm(d)
        if L < 1e-6: continue
        d /= L; up = np.array([0.0, 0.0, 1.0]) if abs(d[2]) < 0.9 else np.array([1.0, 0.0, 0.0])
        u = np.cross(d, up); u /= np.linalg.norm(u); v = np.cross(d, u)
        b = len(V)
        for p in (p0, p1):
            for a, c in ((1, 1), (-1, 1), (-1, -1), (1, -1)): V.append(tuple(p + r * (a * u + c * v)))
        for i in range(4): j = (i + 1) % 4; Fc.append((b + i, b + j, b + 4 + j, b + 4 + i))
    me = bpy.data.meshes.new(name); me.from_pydata(V, [], Fc); me.update()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); o.data.materials.append(m)
    return o


def fence_fast(K, n, x0, x1, y, h=1.8):
    """a chain-link run on posts: the posts and rail as COOK's chainlink draws them, the fabric's diamonds as one mesh"""
    P, bpy = K.P, K.bpy; m = K.mm['trim']; npost = max(2, int((x1 - x0) / 2.4) + 1)
    for i in range(npost):
        x = x0 + (x1 - x0) * i / (npost - 1); P.cyl(bpy, n + '_post', m, 0.03, h + 0.05, (x, y, (h + 0.05) / 2), verts=8)
    P.rod(bpy, n + '_rail', m, (x0, y, h), (x1, y, h), 0.02, verts=6)
    k = int((x1 - x0) / 0.12); segs = []
    for i in range(k):
        xa = x0 + i * (x1 - x0) / k
        segs += [((xa, y, 0.02), (xa + 0.12, y, h)), ((xa + 0.12, y, 0.02), (xa, y, h))]
    wires(K, n + '_fabric', m, segs, 0.005)


def razor(K, n, x0, x1, y, h=2.6):
    """chain-link with razor wire coiled along its top (the coils one mesh)"""
    fence_fast(K, n, x0, x1, y, h)
    segs = []; k = int((x1 - x0) / 0.35)
    for i in range(k):
        xa = x0 + i * (x1 - x0) / k
        pts = [(xa + 0.06 * math.sin(t * 2 * math.pi / 10), y + 0.3 * math.cos(t * 2 * math.pi / 10), h + 0.3 + 0.3 * math.sin(t * 2 * math.pi / 10)) for t in range(11)]
        segs += list(zip(pts[:-1], pts[1:]))
    wires(K, n + '_coil', K.steel, segs, 0.012)


def hoop_house(K, n, x0, x1, yf, D=8.0, skin=None):
    """A HOOP HOUSE: ribs of pipe every metre and a half and its plastic skin, half a cylinder along the beds, ends open"""
    bpy, P = K.bpy, K.P; r = (x1 - x0) / 2; xc = (x0 + x1) / 2
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=r, depth=D, location=(xc, yf + D / 2, 0), rotation=(math.pi / 2, 0, 0))
    o = bpy.context.active_object
    for v in o.data.vertices:
        if v.co.y < 0: v.co.y = 0                                  # (turned a quarter about x: its own y is up; the half below ground folded flat)
    P.put(bpy, o, n + '_skin', skin or K.plastic)
    for yy in np.arange(yf, yf + D + 0.01, 1.5):
        P.cyl(bpy, n + '_rib', K.steel, r + 0.03, 0.06, (xc, yy, 0), rot=(math.pi / 2, 0, 0), verts=24, smooth=False)
    Bx(K, n + '_door', K.black, xc - 0.6, xc + 0.6, yf - 0.03, yf, 0, min(2.0, r * 0.9))
    return r


def beds(K, n, x0, x1, y0, y1, rows=4):
    """raised beds in rows: a timber frame, dark soil, a dull crop in lumps (food, never a lawn; rule 159)"""
    bpy, P, rnd = K.bpy, K.P, K.rnd
    dy = (y1 - y0) / rows
    for i in range(rows):
        ya, yb = y0 + i * dy + 0.3, y0 + (i + 1) * dy - 0.3
        Bx(K, '%s_frame%d' % (n, i), K.wood, x0, x1, ya, yb, 0, 0.42)
        Bx(K, '%s_soil%d' % (n, i), K.soil, x0 + 0.06, x1 - 0.06, ya + 0.06, yb - 0.06, 0.38, 0.44)
        for x in np.arange(x0 + 0.4, x1 - 0.3, 0.55):
            if rnd.random() < 0.25: continue
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=rnd.uniform(0.18, 0.3), location=(x + rnd.uniform(-0.1, 0.1), (ya + yb) / 2 + rnd.uniform(-0.1, 0.1), 0.6))
            o = bpy.context.active_object; o.scale = (1, 1, 0.7); P.put(bpy, o, '%s_crop%d' % (n, i), K.leaf if rnd.random() < 0.7 else K.leaf_dead, smooth=False)


def turbine(K, n, x, yf, h=11.0, blade=3.6):
    bpy, P = K.bpy, K.P
    P.cyl(bpy, n + '_pole', K.bone, 0.18, h, (x, yf + 0.3, h / 2), verts=12)
    Bx(K, n + '_nacelle', K.bone, x - 0.3, x + 0.3, yf - 0.2, yf + 1.2, h - 0.25, h + 0.25)
    for a in (0.3, 0.3 + 2.094, 0.3 + 4.189):
        P.box(bpy, n + '_blade', K.bone, (0.22, 0.05, blade), (x + math.sin(a) * blade / 2, yf - 0.3, h + math.cos(a) * blade / 2), rot=(0, a, 0))
    return h + blade


def stage(K, n, x0, x1, yf, D=4.0, backdrop=None):
    """THE STAGE: a deck of pallets on crates, a truss of pipe over it, speaker stacks either side, a painted sheet behind"""
    bpy, P, rnd = K.bpy, K.P, K.rnd
    for i, x in enumerate(np.arange(x0, x1 - 0.5, 1.2)):
        for j, y in enumerate(np.arange(yf, yf + D - 0.4, 1.0)):
            Bx(K, '%s_pal%d_%d' % (n, i, j), rnd.choice([K.ply, K.wood]), x, x + 1.15, y, y + 0.95, 0.0, 1.0 + rnd.uniform(-0.03, 0.03))
    for x in (x0, x1):
        for y in (yf + 0.2, yf + D - 0.2): P.rod(bpy, n + '_truss', K.steel, (x, y, 1.0), (x, y, 5.0), 0.08, 6)
    for y in (yf + 0.2, yf + D - 0.2): P.rod(bpy, n + '_beam', K.steel, (x0, y, 5.0), (x1, y, 5.0), 0.08, 6)
    for x in (x0, x1): P.rod(bpy, n + '_cross', K.steel, (x, yf + 0.2, 5.0), (x, yf + D - 0.2, 5.0), 0.06, 6)
    for x in (x0 - 0.9, x1 + 0.1):
        for k in range(3): Bx(K, n + '_spk', K.black, x, x + 0.85, yf + 0.2, yf + 0.9, k * 0.9, k * 0.9 + 0.85)
    if backdrop is not None:
        Bx(K, n + '_sheet', backdrop, x0 + 0.2, x1 - 0.2, yf + D - 0.3, yf + D - 0.25, 1.4, 4.8)
        for k in range(5): Bx(K, n + '_daub', rnd.choice([K.black, K.bone, K.rust]), x0 + 0.5 + rnd.uniform(0, x1 - x0 - 2), x0 + 1.5 + rnd.uniform(0, x1 - x0 - 2), yf + D - 0.32, yf + D - 0.3, 1.8 + rnd.uniform(0, 2), 2.4 + rnd.uniform(0, 2))


def mural_wall(K, n, x0, x1, yf, h=2.6, cols=None):
    """a block wall painted over and over: big blotches of paint, never letters"""
    bpy, rnd = K.bpy, K.rnd
    Bx(K, n + '_wall', K.mm['stone'], x0, x1, yf, yf + 0.3, 0, h)
    Bx(K, n + '_cap', K.mm['trim'], x0 - 0.04, x1 + 0.04, yf - 0.03, yf + 0.33, h, h + 0.1)
    cols = cols or [K.black, K.bone, K.rust, K.fac]
    for k in range(int((x1 - x0) * 1.3)):
        xa = rnd.uniform(x0, x1 - 0.8); w = rnd.uniform(0.6, 2.4); za = rnd.uniform(0.2, h - 0.8); hh = rnd.uniform(0.3, h - za)
        Bx(K, '%s_p%d' % (n, k), rnd.choice(cols), xa, min(x1, xa + w), yf - 0.02 - k * 0.0005, yf, za, za + hh)


def cab(K, n, x, yf, paint):
    """a semi's tractor facing the camera: the long hood, the cab, the stacks, the tank, the wheels"""
    bpy, P = K.bpy, K.P
    Bx(K, n + '_frame', K.dark, x - 1.1, x + 1.1, yf + 0.3, yf + 6.2, 0.6, 1.1)
    Bx(K, n + '_hood', paint, x - 1.05, x + 1.05, yf, yf + 2.3, 1.0, 2.2, bevel=0.15)
    Bx(K, n + '_grille', K.steel, x - 0.7, x + 0.7, yf - 0.04, yf, 1.1, 2.1)
    Bx(K, n + '_cab', paint, x - 1.2, x + 1.2, yf + 2.3, yf + 4.6, 1.0, 3.6, bevel=0.1)
    Bx(K, n + '_glass', K.black, x - 1.0, x + 1.0, yf + 2.28, yf + 2.32, 2.4, 3.3)
    for sx in (-1.3, 1.3): P.cyl(bpy, n + '_stack', K.steel, 0.1, 3.0, (x + sx, yf + 2.4, 2.6), verts=8)
    for sx in (-1, 1):
        for yy in (yf + 0.9, yf + 4.6, yf + 5.8): P.cyl(bpy, n + '_wheel', K.dark, 0.52, 0.32, (x + sx * 1.15, yy, 0.52), rot=(0, math.pi / 2, 0), verts=14)
    P.cyl(bpy, n + '_tank', K.steel, 0.32, 1.2, (x - 1.25, yf + 3.4, 0.95), rot=(math.pi / 2, 0, 0), verts=12)


def canopy(K, n, x0, x1, y0, y1, h=5.2, stripe=None):
    bpy, P = K.bpy, K.P
    for x in np.linspace(x0 + 0.8, x1 - 0.8, max(2, int((x1 - x0) / 7) + 1)):
        for y in (y0 + 1.0, y1 - 1.0): Bx(K, n + '_col', K.concrete, x - 0.3, x + 0.3, y - 0.3, y + 0.3, 0, h)
    Bx(K, n + '_deck', K.mm['pale'], x0, x1, y0, y1, h, h + 0.9)
    if stripe is not None: Bx(K, n + '_stripe', stripe, x0 - 0.02, x1 + 0.02, y0 - 0.04, y0, h + 0.3, h + 0.6)
    for x in np.arange(x0 + 2.5, x1 - 1.5, 4.0): Bx(K, n + '_light', K.bone, x - 0.4, x + 0.4, y0 + 1.5, y0 + 2.3, h - 0.06, h)


def storage_row(K, n, x0, x1, yf, D=6.0, h=3.0):
    """a self-storage row: one long low block, a roll-up every three metres, a few open on the dark"""
    bpy, BLD, rnd = K.bpy, K.BLD, K.rnd
    Bx(K, n + '_body', K.concrete_warm, x0, x1, yf, yf + D, 0, h)
    for j, x in enumerate(np.arange(x0 + 1.6, x1 - 1.2, 3.1)):
        BLD.opening(bpy, '%s_ru%d' % (n, j), 'rollup', x, 2.4, 0.0, 2.5, yf, 'gap' if rnd.random() < 0.18 else ('black' if rnd.random() < 0.06 else None))
        if rnd.random() < 0.3: Bx(K, '%s_lock%d' % (n, j), K.fac if rnd.random() < 0.5 else K.steel, x - 0.12, x + 0.12, yf - 0.06, yf, 0.15, 0.35)
    BLD.flat_roof(bpy, n + '_roof', x0, x1, yf, yf + D, h, parapet=0.3, m=K.concrete_dk)
    Bx(K, n + '_eave', K.fac_dark, x0 - 0.05, x1 + 0.05, yf - 0.1, yf, h - 0.35, h + 0.3)


def culvert(K, n, x0, x1, yf, mouths=3, h=3.6):
    """THE FLOOD TUNNELS: a concrete headwall in the bank of the wash, its box mouths black, the wingwalls"""
    bpy = K.bpy
    Bx(K, n + '_head', K.concrete, x0, x1, yf, yf + 1.0, 0, h + 1.4)
    Bx(K, n + '_berm', K.mm['stone'], x0 - 2, x1 + 2, yf + 1.0, yf + 6.0, 0, h + 1.0)
    w = (x1 - x0 - 1.0) / mouths
    for i in range(mouths):
        xa = x0 + 0.5 + i * w + 0.4; xb = x0 + 0.5 + (i + 1) * w - 0.4
        Bx(K, '%s_mouth%d' % (n, i), K.black, xa, xb, yf - 0.02, yf + 0.6, 0, h)
    for x, s in ((x0, -1), (x1, 1)): K.P.box(bpy, n + '_wing', K.concrete, (0.4, 4.0, h), (x + s * 0.2, yf - 1.6, h / 2), rot=(0, 0, s * 0.35))


def sawtooth(K, n, x0, x1, yf, D=14.0, h=6.0):
    """THE SHOP: block walls, big roll-ups, high windows, and its sawtooth roof"""
    bpy, BLD, P, rnd = K.bpy, K.BLD, K.P, K.rnd
    Bx(K, n + '_body', K.concrete_warm, x0, x1, yf, yf + D, 0, h)
    for j, x in enumerate(np.arange(x0 + 3.0, x1 - 2.5, 6.0)):
        BLD.opening(bpy, '%s_door%d' % (n, j), 'rollup', x, 4.2, 0.0, 4.4, yf, 'gap' if j % 2 else None)
    for j, x in enumerate(np.arange(x0 + 1.5, x1 - 1.0, 3.0)):
        BLD.opening(bpy, '%s_hw%d' % (n, j), 'window', x, 2.0, h - 1.4, h - 0.5, yf, rnd.choice([None, 'broken', 'black']))
    for k, y in enumerate(np.arange(yf, yf + D - 0.1, 3.5)):
        P.prism(bpy, '%s_tooth%d' % (n, k), K.tin, [(y, h), (y + 3.5, h), (y + 3.5, h + 1.8)], x0, x1)
        P.prism(bpy, '%s_glaze%d' % (n, k), K.black, [(y + 3.45, h + 0.1), (y + 3.5, h + 0.1), (y + 3.5, h + 1.7), (y + 3.45, h + 1.7)], x0 + 0.3, x1 - 0.3)


def gantry_crane(K, n, x0, x1, yf, h=7.5):
    bpy, P = K.bpy, K.P; m = K.rust
    for x in (x0, x1):
        P.rod(bpy, n + '_lega', m, (x, yf, 0), (x, yf + 1.5, h), 0.14, 8); P.rod(bpy, n + '_legb', m, (x, yf + 3.0, 0), (x, yf + 1.5, h), 0.14, 8)
        Bx(K, n + '_foot', K.steel, x - 0.3, x + 0.3, yf - 0.2, yf + 3.2, 0, 0.3)
    Bx(K, n + '_beam', K.mustard, x0 - 0.3, x1 + 0.3, yf + 1.2, yf + 1.8, h, h + 0.7)
    xm = x0 + (x1 - x0) * 0.4
    Bx(K, n + '_trolley', K.dark, xm - 0.5, xm + 0.5, yf + 1.0, yf + 2.0, h - 0.6, h)
    P.rod(bpy, n + '_chain', K.steel, (xm, yf + 1.5, h - 0.6), (xm, yf + 1.5, 2.4), 0.03, 4)
    Bx(K, n + '_load', K.rust, xm - 0.7, xm + 0.7, yf + 0.9, yf + 2.1, 1.2, 2.4)   # an engine block on the hook


def bus(K, n, x0, x1, yf, paint, stripe=None):
    """the old school bus they live in, painted over"""
    bpy, BLD, P, rnd = K.bpy, K.BLD, K.P, K.rnd
    Bx(K, n + '_body', paint, x0, x1, yf, yf + 2.5, 0.6, 3.2, bevel=0.15)
    for x in np.arange(x0 + 1.0, x1 - 0.6, 1.1):
        Bx(K, n + '_win', K.black if rnd.random() < 0.7 else K.ply, x - 0.42, x + 0.42, yf - 0.03, yf, 1.9, 2.7)
    if stripe is not None: Bx(K, n + '_stripe', stripe, x0, x1, yf - 0.04, yf, 1.2, 1.6)
    for x in (x0 + 1.4, x1 - 2.0): P.cyl(bpy, n + '_wheel', K.dark, 0.5, 0.3, (x, yf - 0.05, 0.5), rot=(math.pi / 2, 0, 0), verts=14)


def palm(K, n, x, yf, h=8.0):
    """a dead palm: the trunk leaning a little, its fronds hanging brown"""
    bpy, P, rnd = K.bpy, K.P, K.rnd
    lean = rnd.uniform(-0.5, 0.5)
    P.rod(bpy, n + '_trunk', K.trunk, (x, yf, 0), (x + lean, yf, h), 0.22, 8)
    for k in range(9):
        a = k / 9 * 2 * math.pi
        P.box(bpy, n + '_frond', K.frond, (2.4, 0.4, 0.05), (x + lean + math.cos(a) * 1.0, yf + math.sin(a) * 0.6, h - 0.5), rot=(0, math.radians(35), a))


def big_tent(K, n, x0, x1, yf, D=10.0, h=4.4, cloth=None, cross=None):
    """the field hospital: a long ridge tent of canvas, its walls rolled up a hand, a cross on its roof"""
    bpy, P = K.bpy, K.P; cloth = cloth or K.bone; xc = (x0 + x1) / 2; half = (x1 - x0) / 2
    for s in (-1, 1):
        P.box(bpy, n + '_side', cloth, (0.04, D, math.hypot(half, h - 1.8)), (xc + s * half / 2, yf + D / 2, (h + 1.8) / 2), rot=(0, -s * (math.pi / 2 - math.atan2(h - 1.8, half)), 0))
        Bx(K, n + '_wall', cloth, xc + s * half - 0.03, xc + s * half + 0.03, yf, yf + D, 0.25, 1.8)
    S.tri(bpy, n + '_front', cloth, [(x0, yf, 1.8), (x1, yf, 1.8), (xc, yf, h)])
    Bx(K, n + '_frontwall', cloth, x0, x1, yf - 0.02, yf + 0.02, 0.25, 1.8)
    Bx(K, n + '_door', K.black, xc - 1.0, xc + 1.0, yf - 0.05, yf - 0.01, 0, 2.1)
    if cross is not None:
        for s in (-1, 1):
            a = math.atan2(h - 1.8, half); zc = (h + 1.8) / 2 + 0.03; xo = xc + s * half / 2
            P.box(bpy, n + '_cross_v', cross, (0.05, 2.6, 0.6), (xo, yf + D / 2, zc + 0.02), rot=(0, -s * (math.pi / 2 - a), 0))
            P.box(bpy, n + '_cross_h', cross, (0.05, 0.6, 2.2), (xo, yf + D / 2, zc + 0.02), rot=(0, -s * (math.pi / 2 - a), 0))


def pad(K, n, x, y, r=4.5, ring=None):
    bpy, P = K.bpy, K.P
    P.cyl(bpy, n + '_pad', K.concrete, r, 0.16, (x, y, 0.08), verts=40)
    P.cyl(bpy, n + '_ring', ring or K.paint, r * 0.82, 0.02, (x, y, 0.17), verts=40)
    P.cyl(bpy, n + '_in', K.concrete, r * 0.74, 0.03, (x, y, 0.175), verts=40)
    Bx(K, n + '_cv', ring or K.paint, x - 0.35, x + 0.35, y - 1.6, y + 1.6, 0.18, 0.2)
    Bx(K, n + '_ch', ring or K.paint, x - 1.6, x + 1.6, y - 0.35, y + 0.35, 0.18, 0.2)


def bunting(K, n, a, b, cols, sag=0.5):
    bpy, P, rnd = K.bpy, K.P, K.rnd
    P.rod(bpy, n + '_line', K.dark, a, b, 0.01, 4)
    k = int(math.dist(a[:2], b[:2]) / 0.55)
    for i in range(1, k):
        t = i / k; x = a[0] + (b[0] - a[0]) * t; y = a[1] + (b[1] - a[1]) * t; z = a[2] + (b[2] - a[2]) * t - sag * 4 * t * (1 - t)
        S.tri(bpy, '%s_flag%d' % (n, i), rnd.choice(cols), [(x - 0.18, y, z), (x + 0.18, y, z), (x, y, z - 0.4)])


def pole_pair(K, n, x, yf, h=3.4):
    K.P.rod(K.bpy, n, K.wood, (x, yf, 0), (x, yf, h), 0.07, 6)
    return (x, yf, h)


def cots(K, n, x0, x1, y0, y1):
    """cots under a shade cloth on poles"""
    bpy, P = K.bpy, K.P
    for x in (x0, x1):
        for y in (y0, y1): P.rod(bpy, n + '_pole', K.steel, (x, y, 0), (x, y, 2.6), 0.04, 6)
    P.box(bpy, n + '_shade', K.sage if K.rnd.random() < 0.5 else K.bone, (x1 - x0 + 0.4, y1 - y0 + 0.4, 0.03), ((x0 + x1) / 2, (y0 + y1) / 2, 2.6), rot=(0.05, 0, 0))
    for x in np.arange(x0 + 0.9, x1 - 0.6, 1.0):
        Bx(K, n + '_cot', K.sage, x - 0.36, x + 0.36, y0 + 0.4, y1 - 0.4, 0.4, 0.5)
        for yy in (y0 + 0.5, y1 - 0.5): Bx(K, n + '_leg', K.steel, x - 0.36, x + 0.36, yy - 0.03, yy + 0.03, 0, 0.4)


def jugs(K, n, x, y, k=8):
    for i in range(k):
        K.P.cyl(K.bpy, '%s_%d' % (n, i), K.water, 0.18, 0.5, (x + (i % 4) * 0.4, y + (i // 4) * 0.4, 0.25 + (0.5 if i >= 8 else 0)), verts=10)


def soup_line(K, n, x, yf):
    bpy, P = K.bpy, K.P
    Bx(K, n + '_table', K.wood, x - 1.6, x + 1.6, yf, yf + 0.9, 0.85, 0.95)
    for sx in (-1.4, 1.4): Bx(K, n + '_leg', K.steel, x + sx - 0.04, x + sx + 0.04, yf + 0.1, yf + 0.8, 0, 0.85)
    for k, sx in enumerate((-1.0, 0.0, 1.0)): P.cyl(bpy, '%s_pot%d' % (n, k), K.steel, 0.3, 0.45, (x + sx, yf + 0.45, 1.18), verts=14)
    for k in range(5): Bx(K, n + '_q', K.steel, x - 2.0 - k * 1.2, x - 1.95 - k * 1.2, yf - 1.2, yf - 1.15, 0, 1.0)
    P.rod(bpy, n + '_rope', K.dark, (x - 2.0, yf - 1.18, 0.95), (x - 6.8, yf - 1.18, 0.95), 0.02, 4)


def church_small(K, n, x0, x1, yf, D=6.0, tw=3.0, th=11.0, door=None, banner=None):
    """THE CHURCH ON ITS CORNER: the bell tower at its west end (a stone shaft, the louvre, the capped roof, the cross),
    the nave beside it with its long side to the street under a steep roof, arched windows (one boarded), the double door
    in the tower's foot in the town's colour; kept shallow so it never hides the street behind it"""
    bpy, BLD, mm, P = K.bpy, K.BLD, K.mm, K.P
    tx0, tx1 = x0, x0 + tw; nx0 = tx1 + 0.15
    Bx(K, n + '_nave', mm['stucco'], nx0, x1, yf, yf + D, 0, 5.0, bevel=0.04)
    Bx(K, n + '_footing', mm['stone'], nx0 - 0.04, x1 + 0.04, yf - 0.04, yf + D + 0.04, 0, 0.3)
    BLD.ridge_roof(bpy, n + '_roof', nx0, x1, yf, yf + D, 5.0, pitch=34, gable=mm['stucco'])
    for j, x in enumerate(np.arange(nx0 + 1.3, x1 - 0.8, 1.9)):
        BLD.opening(bpy, '%s_aw%d' % (n, j), 'arched', x, 0.8, 1.5, 3.6, yf, 'boarded' if j == 2 else None)
    Bx(K, n + '_tower', mm['stone'], tx0, tx1, yf - 0.4, yf + 2.8, 0, th, bevel=0.04)
    BLD.ridge_roof(bpy, n + '_tcap', tx0, tx1, yf - 0.4, yf + 2.8, th, pitch=48, oh=0.25, gable=mm['stone'])
    cx = (tx0 + tx1) / 2
    BLD.opening(bpy, n + '_louvre', 'arched', cx, 0.9, th - 2.6, th - 1.2, yf - 0.4, 'shutter')
    Bx(K, n + '_door', door or mm['wood'], cx - 0.75, cx + 0.75, yf - 0.46, yf - 0.4, 0, 2.6)
    BLD.opening(bpy, n + '_rose', 'arched', cx, 0.7, 4.0, 5.0, yf - 0.4)
    Bx(K, n + '_cross', mm['pale'], cx - 0.07, cx + 0.07, yf - 0.48, yf - 0.42, 6.0, 7.4)
    Bx(K, n + '_crossbar', mm['pale'], cx - 0.38, cx + 0.38, yf - 0.48, yf - 0.42, 6.85, 7.0)
    if banner is not None: P.box(bpy, n + '_banner', banner, (0.9, 0.03, 2.6), (cx + 0.9, yf - 0.5, th - 4.4))
    for k in range(3): Bx(K, '%s_step%d' % (n, k), mm['stone'], cx - 1.2 - k * 0.2, cx + 1.2 + k * 0.2, yf - 0.4 - (k + 1) * 0.35, yf - 0.4, 0, 0.36 - k * 0.12)


def parking_deck(K, n, x0, x1, yf, D=14.0, levels=3, fl=3.0):
    """a downtown garage: open decks on columns, the cars left on them, a ramp's slope showing"""
    bpy, P, rnd = K.bpy, K.P, K.rnd
    for L in range(levels + 1):
        z = L * fl
        Bx(K, '%s_deck%d' % (n, L), K.concrete, x0, x1, yf, yf + D, z, z + 0.35)
        if L: Bx(K, '%s_rail%d' % (n, L), K.concrete_dk, x0, x1, yf - 0.05, yf + 0.2, z + 0.35, z + 1.2)
    for x in np.arange(x0 + 0.3, x1, 4.2):
        Bx(K, n + '_col', K.concrete_dk, x, x + 0.5, yf + 0.3, yf + 0.8, 0, levels * fl)
    for L in range(levels):
        for x in np.arange(x0 + 1.0, x1 - 2.5, 2.8):
            if rnd.random() < 0.45:
                Bx(K, '%s_car%d_%.0f' % (n, L, x), rnd.choice([K.teal, K.rust, K.steel, K.dark]), x, x + 1.8, yf + 1.4, yf + 5.8, L * fl + 0.35, L * fl + 1.7, bevel=0.2)


def tag(objs, tags):
    for o in objs: o['town_tag'] = tags


# ---- placing: every thing a root of its own, so its box on the picture is measured --------------------------------------
class Town(S.Place):
    def __init__(s, bpy, P, rnd):
        super().__init__(bpy, P, rnd); s.things = []

    def here(s, name, fn, *a, walk=True, **k):
        """build with fn at absolute coordinates; the objects it made are one thing, measured for the walk"""
        bpy = s.bpy; before = set(bpy.context.scene.objects)
        fn(*a, **k)
        new = [o for o in bpy.context.scene.objects if o not in before]
        root = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(root)
        for o in new:
            if o.parent is None: o.parent = root
        s.roots.append(root); s.meshes += [o for o in new if o.type == 'MESH']
        s.things.append((name, root, walk))
        return root

    def _seat(s, objs, x, y_front, width=None, rot=0.0, scale=None, name='thing'):
        root, k = super()._seat(objs, x, y_front, width, rot, scale, name)
        s.things.append((name, root, True))
        return root, k

    def outlines(s):
        """every thing's box on the picture, roof to front foot (rule 169: where a person cannot stand), in picture px"""
        out = []
        for name, root, walk in s.things:
            if not walk: continue
            objs = [o for o in root.children_recursive if o.type == 'MESH'] if hasattr(root, 'children_recursive') else []
            if not objs: continue
            lo, hi = s._bounds(objs)
            if hi[0] < lo[0]: continue
            zs = 1.0 / math.cos(TILT)
            pts = [(x, y, z) for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (max(0.0, lo[2]), hi[2])]
            px = [PW / 2 + (x - 30.0) * PPM for x, y, z in pts]
            py = [PH / 2 - ((y * math.cos(TILT) + z * zs * math.sin(TILT)) - 30.0 * math.cos(TILT)) * PPM for x, y, z in pts]
            b = [max(0, int(min(px))), max(0, int(min(py))), min(PW, int(math.ceil(max(px)))), min(PH, int(math.ceil(max(py))))]
            if b[2] - b[0] < 4 or b[3] - b[1] < 4 or b[0] >= PW or b[1] >= PH or b[2] <= 0 or b[3] <= 0: continue
            out.append(dict(name=name, box=b, h=round(hi[2], 2), w=round(hi[0] - lo[0], 2)))
        return out


def M(px, py): return X0 + px / PPM, Y1 - py / (PPM * SQ)        # a picture pixel on the ground -> metres


# ---- the ground, each town's own ----------------------------------------------------------------------------------------
def plan(town, rnd):
    import bohemia_cook_the_floor_through_the_rig_10_19_26 as F
    ID = F.ID; g = np.full((F.H, F.W), ID['caliche'], np.uint8)
    def band(ya, yb, what, xa=0.0, xb=60.0):
        ra, rb = int((60 - yb) / 60 * F.H), int((60 - ya) / 60 * F.H); ca, cb = int(xa / 60 * F.W), int(xb / 60 * F.W)
        g[max(0, ra):rb, max(0, ca):cb] = ID[what]
    def stripes(y, xa, xb, every=2.6, w=0.12, along=False):
        for x in np.arange(xa, xb, every): band(y - 2.4, y, 'paint', x, x + w) if not along else band(y, y + w, 'paint', x, x + every * 0.5)
    t, n = town['tier'], town['name']
    def slabs(k, kinds=('concrete', 'asphalt', 'track')):
        # what the edge was before it was a camp: the slabs of houses pulled down, old driveways, worn paths (never one sand)
        for _ in range(k):
            w, d = rnd.uniform(5, 11), rnd.uniform(3.5, 7); x = rnd.uniform(4, 56 - w); y = rnd.uniform(12, 47 - d)
            band(y, y + d, rnd.choice(kinds), x, x + w)
    if town['u'] < 0.6 and n not in ('Caravans', 'Mob'): slabs(9 if t == 'camp' else 6)
    if t == 'town':
        if n in ('Church', 'Reds'):                                  # THE HEART: paved wall to wall
            band(0, 60, 'concrete'); band(29.0, 34.6, 'asphalt'); band(31.75, 31.87, 'paint', 6, 54)
            for x in np.arange(10, 15, 0.9): band(29.0, 34.6, 'paint', x, x + 0.45)      # the crossing
            if n == 'Reds': band(15.0, 26.5, 'asphalt', 22, 60); [band(15.4, 19.8, 'paint', x, x + 0.12) for x in np.arange(23, 60, 2.7)]
            else: band(15.0, 25.0, 'rough', 17, 32); band(24.0, 27.5, 'concrete')
        elif n == 'Blues':
            band(0, 60, 'caliche'); band(29.6, 34.0, 'track'); band(34.0, 36.0, 'rough'); band(16.0, 27.0, 'rough', 24, 50)
        else:                                                         # Anarchists: the street half sand, burnt
            band(0, 60, 'rough'); band(29.0, 34.6, 'asphalt'); band(27.5, 29.0, 'concrete'); band(34.6, 36.0, 'concrete', 30, 60)
            band(29.0, 34.6, 'rough', 40, 47); band(12.0, 22.0, 'caliche', 4, 20)
    elif t == 'fortress':
        if n == 'Mob':
            band(0, 60, 'concrete'); band(37.0, 41.0, 'asphalt'); band(38.95, 39.05, 'paint', 0, 60); band(12, 20, 'asphalt', 20, 36)
        elif n == 'Caravans':
            band(0, 60, 'asphalt'); band(12, 22, 'caliche', 0, 20); band(42, 60, 'rough'); stripes(17.5, 19, 36, every=4.0)
        elif n == 'Cartel':
            band(0, 60, 'rough'); band(35.0, 38.0, 'asphalt'); band(26.0, 30.0, 'asphalt', 6, 54); band(12.0, 16.0, 'concrete', 22, 36)
        elif n == 'Network':
            band(0, 60, 'concrete'); band(30, 38, 'rough', 18, 28); band(12, 22, 'rough', 40, 60); band(37.0, 41.0, 'asphalt', 30, 60)
        else:                                                         # Remnants: the yard's concrete, the outside's dirt
            band(0, 60, 'caliche'); band(24.0, 44.0, 'concrete', 6, 54); band(26.0, 33.5, 'concrete', 19, 31); band(37.0, 41.0, 'asphalt', 0, 60)
            for x in np.arange(20, 31, 5.5): band(26.0, 33.5, 'paint', x, x + 0.1)
    else:
        if n == 'Homeless':                                           # the wash: the channel's concrete, the bank's dirt
            band(0, 60, 'rough'); band(36.0, 48.0, 'concrete', 4, 44); band(28.0, 36.0, 'playa', 0, 60); band(12, 20, 'desert')
        elif n == 'Custom':
            band(0, 60, 'caliche'); band(28, 31, 'track'); band(32, 44, 'concrete', 28, 54); band(18, 27, 'rough', 20, 34)
        elif n == 'Trades':
            band(0, 60, 'rough'); band(28, 31, 'track'); band(34, 44, 'concrete', 28, 56); band(14, 24, 'caliche', 4, 20)
        elif n == 'Volunteers':
            band(0, 60, 'caliche'); band(28, 31, 'track'); band(30, 44, 'rough', 4, 22); band(30, 44, 'concrete', 30, 56)
        else:                                                         # Colorful
            band(0, 60, 'desert'); band(28, 31, 'track'); band(34, 44, 'caliche', 28, 56); band(18, 26, 'rough', 4, 22)
    return g


# ---- the fourteen places --------------------------------------------------------------------------------------------------
def layout(town, pl, K):
    """the tier's tappable things in their boxes (what they ARE is the town's), then the town round them"""
    bpy, P, rnd, mm = K.bpy, K.P, K.rnd, K.mm
    f = {k: S.foot(v['box']) for k, v in town['hot'].items()}
    def mid(k): return (f[k][0] + f[k][1]) / 2
    def wid(k): return f[k][1] - f[k][0]
    n, t = town['name'], town['tier']
    stall_w = wid('stall')
    def the_stall(awning=None):
        root, _ = pl.built(S.stall, mid('stall'), f['stall'][2], stall_w)
        if awning is not None:
            for o in root.children:
                if o.type == 'MESH' and o.name.startswith('awn_') and int(o.name.split('_')[1][:1] or 0) % 2: o.data.materials[0] = awning
    def drum(x, y): pl.drum_fire(x, y)
    def lamp(x, y, kind='lamp.glb'): pl.lamp(x, y, kind)
    # ===================================================== TOWN =====================================================
    if t == 'town':
        if n == 'Church':                                            # THE HEART, the church on its corner
            pl.here('bar', block, K, 'bar', 6.0, 16.6, 35.8, 14, 6, 'shop', accent=K.fac, sign=(15.6, K.fac))
            pl.here('barber', block, K, 'barber', 18.0, 30.0, 36.0, 16, 5, 'shop', wall=K.concrete_warm, accent=K.fac_dark)
            pl.here('clinic', block, K, 'clinic', 30.1, 42.0, 36.0, 16, 7, 'shop', accent=K.fac, sign=(41.0, K.bone))
            pl.here('east', block, K, 'east', 43.2, 54.5, 35.7, 16, 9, 'office')
            pl.here('church', church_small, K, 'church', 6.2, 17.0, 13.6, 6.0, 3.0, 11.0, K.fac_dark, K.fac)
            for k, (x, y) in enumerate(((27.0, 21.0), (27.2, 18.6))): pl.model('graveyard_grave_row_%d.glb' % (k % 4), x + 1.0, y, None, 0.0, 0.55)
            pl.model('graveyard_obelisk.glb', 30.5, 22.4, None, 0.0, 1.0)
            pl.here('soup', soup_line, K, 'soup', 21.0, 25.4)
            pl.here('smith', block, K, 'smith', 31.0, 40.6, 15.0, 6, 1, 'shop', accent=K.fac_dark)
            pl.here('armourer', block, K, 'armourer', 48.4, 56.0, 14.6, 5, 2, 'office')
            for x in (17.0, 44.5): lamp(x, 35.2, 'streetlight.glb')
            for x in (43.0, 51.5): pl.here('palm%d' % x, palm, K, 'palm', x, 27.6, 7.5)
            pl.model('patrol.glb', 38.0, 30.0, None, math.radians(97), 1.0)
            pl.model('wreck.glb', 47.0, 30.8, None, math.radians(-80), 1.0)
            pl.model('rubble.glb', 20.0, 12.5, None, 0.4, 1.0); pl.model('cart.glb', 22.5, 13.4, None, 0.6, 1.0)
            pl.model('dumpster.glb', 46.0, 25.0, None, 0.1, 1.0); drum(44.0, 22.6)
        elif n == 'Reds':                                            # THE HEART, the bank
            pl.here('bar', parking_deck, K, 'bar', 5.8, 16.6, 35.8, 14, 5)
            pl.here('barber', block, K, 'barber', 18.0, 29.8, 36.0, 14, 4, 'shop', accent=K.fac)
            def bank():
                block(K, 'bank', 30.2, 42.0, 37.4, 18, 10, 'bank', wall=K.concrete_warm, lit=0.18)
                for x in np.arange(30.9, 42.0, 1.65): P.cyl(bpy, 'col', K.bone, 0.32, 5.0, (x, 36.4, 2.5 + 0.4), verts=14)
                Bx(K, 'pediment', K.bone, 30.2, 42.0, 35.8, 37.4, 5.4, 6.3)
                for k in range(3): Bx(K, 'step%d' % k, K.bone, 30.0 - k * 0.3, 42.2 + k * 0.3, 35.2 - k * 0.5, 37.4, 0, 0.4 - k * 0.13)
                Bx(K, 'vault', mm['steel'], 35.3, 36.9, 37.36, 37.42, 0.4, 3.3)
                P.box(bpy, 'banner', K.fac, (1.4, 0.03, 3.6), (33.0, 35.75, 3.4)); P.box(bpy, 'banner2', K.fac, (1.4, 0.03, 3.6), (39.6, 35.75, 3.4))
            pl.here('clinic', bank)
            pl.here('east', block, K, 'east', 43.2, 54.5, 35.7, 14, 6, 'shop', accent=K.fac_dark, sign=(44.0, K.bone))
            pl.here('cashing', block, K, 'cashing', 6.0, 16.8, 13.3, 6, 1, 'shop', accent=K.fac, sign=(16.0, K.fac))
            pl.model('patrol.glb', 37.0, 30.2, None, math.radians(92), 1.0)
            for x in (32.0, 38.5): pl.model('cover_jersey.glb', x, 27.2, None, 0.0, 0.8)
            pl.model('sandbags.glb', 43.0, 27.4, None, 0.0, 1.0)
            pl.here('smith', block, K, 'smith', 31.0, 40.6, 15.2, 6, 1, 'shop', accent=K.fac)
            pl.here('armourer', block, K, 'armourer', 48.4, 56.0, 14.6, 5, 2, 'shop', wall=K.concrete_warm)
            for x, y, r in ((27.0, 20.0, 88), (42.0, 19.5, 95), (45.0, 23.0, 80)): pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
            for x in (17.0, 44.5): lamp(x, 35.2, 'streetlight.glb')
            pl.model('rubble.glb', 20.0, 12.5, None, 1.2, 1.0); pl.model('tyres.glb', 22.0, 14.2, None, 0.0, 1.0)
            drum(24.5, 26.0)
        elif n == 'Anarchists':                                      # THE EDGE, the stage in its ring of burnt cars
            pl.model('bld_ranch_porch.glb', 11.2, 36.0, 10.4)
            pl.model('bld_ranch_carport.glb', 24.0, 36.0, 11.8)
            pl.here('squat_mural', mural_wall, K, 'squat_mural', 18.4, 22.6, 35.6, 2.2)
            pl.here('clinic', shack, K, 'clinic', 30.3, 41.8, 36.0, 4.0, 3.2, tarp=K.rust)
            pl.here('wall', mural_wall, K, 'mural', 43.4, 54.6, 36.4, 3.0)
            pl.here('post', tower, K, 'post', 49.0, 39.0, 5.0)
            pl.here('stage', stage, K, 'stage', 8.0, 15.4, 15.8, 4.0, K.fac)
            for (x, y, r) in ((6.6, 13.2, 20), (17.6, 15.6, -70), (9.2, 22.2, 10), (16.2, 21.6, -20)):
                root, _ = pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
                for i_, o in enumerate(root.children_recursive):
                    if o.type == 'MESH': o.data.materials.clear(); o.data.materials.append(K.rust if i_ % 5 == 2 else K.char)
            for (x, y, r) in ((40.5, 29.4, 100), (49.5, 31.0, 75)):
                root, _ = pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
                for o in root.children_recursive:
                    if o.type == 'MESH': o.data.materials.clear(); o.data.materials.append(K.char)
            pl.here('smith', shack, K, 'smith', 31.2, 39.8, 15.2, 4.0, 2.6, tarp=K.blue_tarp)
            pl.model('container.glb', 51.4, 15.2, None, 0.0, 1.0)
            pl.here('mural2', mural_wall, K, 'mural2', 25.4, 30.6, 22.0, 2.4)
            pl.built(S.fire, 12.0, 24.0, None, 0.0, 1.0, True); pl.fires.append((12.0, 24.6, 1.6))
            drum(44.5, 24.5); drum(28.0, 26.0)
            pl.model('rubble.glb', 20.0, 12.5, None, 2.2, 1.0)
        else:                                                        # Blues: the co-op
            pl.model('bld_warehouse.glb', 30.0, 36.0, 24.2)
            def coop_awning(): K.P.box(bpy, 'coop_awning', K.fac, (9.0, 2.0, 0.05), (24.0, 35.0, 2.6), rot=(math.radians(-14), 0, 0))
            pl.here('coop_awning', coop_awning)
            pl.here('hoop_a', hoop_house, K, 'hoop_a', 6.4, 15.8, 36.2, 9.0, K.blue_tarp)
            pl.here('tank', water_tower, K, 'tank', 47.0, 38.0, 1.6, 3.6, K.blue_tarp)
            def solar():
                for k, x in enumerate(np.arange(43.6, 54.0, 2.1)):
                    for sy in (0.0,): P.box(bpy, 'panel%d' % k, K.dark, (1.9, 1.2, 0.05), (x + 1.0, 36.6 + sy, 1.1), rot=(math.radians(-28), 0, 0)); Bx(K, 'pv_leg', K.steel, x + 0.9, x + 1.1, 36.8, 37.0, 0, 1.0)
            pl.here('solar', solar)
            pl.here('hoop_b', hoop_house, K, 'hoop_b', 6.0, 11.6, 13.3, 7.0, K.plastic)
            pl.here('hoop_c', hoop_house, K, 'hoop_c', 12.2, 17.6, 13.3, 7.0, K.blue_tarp)
            pl.here('beds_a', beds, K, 'beds_a', 26.0, 31.4, 17.6, 25.6, 4)
            pl.here('beds_b', beds, K, 'beds_b', 41.0, 47.0, 17.6, 25.6, 4)
            pl.here('turbine', turbine, K, 'turbine', 47.5, 22.0, 10.0, 3.2, walk=True)
            pl.here('smith', shack, K, 'smith', 31.4, 34.6, 15.0, 3.0, 2.4, tarp=K.blue_tarp)
            pl.model('shed.glb', 38.6, 15.0, None, 0.0, 1.0)
            pl.here('armourer', shack, K, 'armourer', 48.6, 55.0, 14.7, 3.6, 2.6, tarp=K.fac)
            pl.model('corral.glb', 51.5, 22.0, None, 0.0, 1.0)
            pl.model('rolled.glb', 21.0, 13.0, None, 0.0, 0.7)
            for x in (17.0, 44.5): lamp(x, 35.2)
            drum(38.0, 27.2)
        pl.built(S.posts, mid('posts'), f['posts'][2], None, 0.0, 1.0, wid('posts'))
        pl.built(S.board, mid('board'), f['board'][2], wid('board'))
        the_stall(K.fac if n in ('Blues', 'Reds') else (K.fac_dark if n == 'Church' else K.rust))
    # ===================================================== FORTRESS =====================================================
    elif t == 'fortress':
        if n == 'Mob':                                               # THE HEART: the casino tower's podium
            pl.model('bld_tower_casino.glb', 37.0, 42.6, 31.0)
            pl.here('west', block, K, 'west', 5.4, 21.0, 41.6, 14, 9, 'office', sign=(20.0, K.fac))
            pl.here('clinic', block, K, 'clinic', 32.0, 44.0, 32.0, 8, 3, 'shop', wall=K.concrete_warm, accent=K.black)
            def marquee():
                Bx(K, 'marquee', K.dark, 31.6, 44.4, 29.8, 32.0, 3.6, 4.4)
                for x in np.arange(32.0, 44.2, 0.5): P.cyl(bpy, 'mq_bulb', K.bone if rnd.random() < 0.6 else mm['amber'], 0.06, 0.06, (x, 29.75, 4.0), rot=(math.pi / 2, 0, 0), verts=6)
            pl.here('marquee', marquee)
            pl.here('barber', block, K, 'barber', 7.0, 19.0, 20.0, 10, 3, 'shop', accent=K.black, sign=(18.2, K.bone))
            pl.model('bld_motel_sign.glb', 49.0, 34.0, None, 0.0, 1.0)
            def fountain():
                P.cyl(bpy, 'basin', K.concrete, 3.2, 0.6, (26.0, 31.0, 0.3), verts=32); P.cyl(bpy, 'dry', K.soil, 2.9, 0.05, (26.0, 31.0, 0.62), verts=32)
                P.cyl(bpy, 'tier', K.concrete, 1.0, 1.6, (26.0, 31.0, 0.8), verts=20); P.cyl(bpy, 'bowl', K.concrete, 1.5, 0.3, (26.0, 31.0, 1.7), verts=20)
            pl.here('fountain', fountain)
            for x in (20.5, 30.0): pl.here('palm%d' % x, palm, K, 'palm', x, 34.2, 8.5)
            for x in (18.0, 24.5, 31.0): pl.model('cover_jersey.glb', x, 12.4, None, 0.0, 1.0)
            for x, r in ((25.0, 92), (30.5, 86)): pl.model('wreck.glb', x, 16.0, None, math.radians(r), 1.0)
            for x in (6.0, 30.0): lamp(x, 36.2, 'streetlight.glb')
            drum(20.0, 26.5); drum(46.5, 20.0)
        elif n == 'Caravans':                                        # THE EDGE: the truck stop
            for k, x in enumerate((4.0, 22.5, 41.0)):                 # the rigs in a row, side on, the way a truck stop parks them
                pl.model('trailer.glb', x + 6.2, 42.4 + (k % 2) * 0.4, None, 0.0, 1.0)
                r_ = pl.here('rig%d' % k, cab, K, 'rig', 0.0, -3.1, [K.rust, K.teal, K.bone][k])
                r_.rotation_euler = (0, 0, math.radians(90)); r_.location = (x + 12.6 + 3.1, 42.4 + (k % 2) * 0.4 + 1.3, 0)
            pl.here('clinic', block, K, 'clinic', 32.0, 44.0, 32.0, 8, 1, 'shop', wall=K.concrete_warm, accent=K.fac, ground_h=4.8)
            pl.here('canopy', canopy, K, 'canopy', 15.0, 30.0, 30.5, 35.0, 4.6, K.fac)
            for x in (19.0, 26.0): pl.model('cover_pump.glb', x, 32.0, None, 0.0, 1.0)
            pl.here('barber', block, K, 'barber', 7.0, 19.0, 20.0, 9, 1, 'shop', wall=K.concrete_warm, accent=K.fac)
            for k, x in enumerate((21.0, 27.5)):
                pl.here('semi%d' % k, cab, K, 'semi', x, 12.6, K.bone if k else K.mustard)
            for k, y in enumerate((35.0, 37.4)): pl.model('propane.glb', 49.0, y, None, 0.0, 2.0)
            pl.model('tyres.glb', 46.5, 21.0, None, 0.0, 1.0); pl.model('drums.glb', 30.5, 19.5, None, 0.2, 1.0)
            for x in (6.0, 36.0): lamp(x, 36.2)
            drum(33.0, 27.0); drum(45.5, 17.5)
        elif n == 'Cartel':                                          # THE EDGE: storage rows behind a dark wall
            def back_wall():
                for k in range(8): S.Place.model(pl, 'wall.glb', 3.0 + k * 8.4, 46.0, None, 0.0, 1.4)
            pl.here('wall', back_wall)
            pl.here('row_a', storage_row, K, 'row_a', 6.0, 30.0, 39.0, 5.0, 3.0)
            pl.here('row_b', storage_row, K, 'row_b', 33.0, 56.0, 39.0, 5.0, 3.0)
            pl.here('clinic', storage_row, K, 'clinic', 32.0, 44.0, 32.0, 5.0, 3.4)
            pl.here('watch_a', tower, K, 'watch_a', 52.0, 40.2, 7.0, 2.6, K.black)
            def office():
                block(K, 'office', 7.4, 18.6, 20.0, 8, 2, 'cells', wall=K.concrete_dk, roof=True)
                dish(K, 'office_dish', 16.0, 24.0, 0.8)
            pl.here('barber', office)
            pl.here('watch_b', tower, K, 'watch_b', 19.5, 13.0, 6.0, 2.4, K.black)
            def front_wall():
                for x in (6.0, 12.0, 30.0, 48.5): S.Place.model(pl, 'wall.glb', x, 12.2, None, 0.0, 1.2)
            pl.here('front_wall', front_wall)
            pl.model('sandbags.glb', 30.0, 25.0, None, 0.0, 1.0); pl.model('wreck.glb', 47.0, 21.0, None, math.radians(70), 1.0)
            for x in (20.0, 47.0): lamp(x, 34.2)
            drum(33.5, 27.0); drum(45.5, 19.0)
        elif n == 'Network':                                         # BETWEEN: the mast and its dishes
            pl.here('exchange', block, K, 'exchange', 5.4, 30.0, 43.2, 12, 3, 'blank', wall=K.concrete)
            pl.here('razor', razor, K, 'razor', 4.0, 56.0, 41.6, 2.6)
            pl.here('clinic', block, K, 'clinic', 32.0, 44.0, 32.0, 9, 2, 'blank', wall=K.concrete_warm)
            def doors():
                for x in (34.0, 38.5, 42.5): Bx(K, 'door_teal', K.fac, x - 0.6, x + 0.6, 31.95, 31.98, 0.0, 2.4)
            pl.here('doors', doors)
            pl.here('mast', mast, K, 'mast', 22.5, 33.0, 34.0, 3.2)
            for k, (x, y) in enumerate(((46.0, 34.0), (50.5, 36.0), (54.0, 34.5))): pl.here('dish%d' % k, dish, K, 'dish', x, y, 1.9)
            pl.here('barber', block, K, 'barber', 7.0, 19.0, 20.0, 9, 2, 'office', wall=K.concrete, lit=0.3)
            def reels():
                for k, x in enumerate((24.0, 25.6, 31.0)): P.cyl(bpy, 'reel%d' % k, K.wood, 0.75, 0.7, (x, 19.0 + k * 0.4, 0.75), rot=(0, math.pi / 2, 0), verts=16)
            pl.here('reels', reels)
            root, _ = pl.model('container.glb', 27.0, 13.0, None, 0.0, 1.0)
            for o in root.children_recursive:
                if o.type == 'MESH' and rnd.random() < 0.6: o.data.materials.clear(); o.data.materials.append(K.fac)
            for x in (6.0, 36.0): lamp(x, 36.2, 'streetlight.glb')
            drum(33.5, 26.0)
        else:                                                        # Remnants: the prison
            def prison_wall():
                Bx(K, 'pwall', K.concrete, 0.0, 60.0, 45.0, 45.6, 0, 5.2)
                razor(K, 'pwire', 0.0, 60.0, 45.3, 5.4)
            pl.here('pwall', prison_wall)
            pl.here('guard_a', tower, K, 'guard_a', 6.0, 42.0, 7.5, 3.0, K.fac)
            pl.here('guard_b', tower, K, 'guard_b', 54.0, 42.0, 7.5, 3.0, K.fac)
            pl.here('cells_b', block, K, 'cells_b', 14.0, 30.0, 39.0, 9, 2, 'cells')
            pl.here('clinic', block, K, 'clinic', 32.0, 44.0, 32.0, 10, 2, 'cells', wall=K.concrete_warm)
            pl.here('barber', block, K, 'barber', 7.0, 19.0, 20.0, 9, 1, 'office', wall=K.concrete)
            def cage():
                fence_fast(K, 'cage_back', 19.2, 30.8, 33.6, 3.2); fence_fast(K, 'cage_front', 19.2, 30.8, 26.4, 3.2)
                for x in (19.2, 30.8):
                    for y in np.arange(26.4, 33.7, 2.4): P.cyl(bpy, 'cage_post', K.mm['trim'], 0.03, 3.25, (x, y, 1.62), verts=8)
                    P.rod(bpy, 'cage_rail', K.mm['trim'], (x, 26.4, 3.2), (x, 33.6, 3.2), 0.02, 6)
                P.rod(bpy, 'hoop_pole', K.steel, (25.0, 33.4, 0), (25.0, 33.4, 3.4), 0.06, 6); Bx(K, 'backboard', K.bone, 24.4, 25.6, 33.0, 33.1, 3.0, 3.9)
            pl.here('cage', cage)
            pl.here('guard_c', tower, K, 'guard_c', 46.0, 11.4, 5.5, 2.6, K.fac)
            pl.here('front_wire', razor, K, 'front_wire', 4.0, 44.0, 12.4, 2.4)
            pl.model('patrol.glb', 27.0, 15.5, None, math.radians(90), 1.0)
            for k, x in enumerate((47.0, 49.0)): pl.model('sandbags.glb', x, 21.0 + k * 1.2, None, 0.0, 1.0)
            for x in (20.0, 44.0): lamp(x, 36.2)
            drum(33.0, 26.5); drum(45.5, 18.5)
        pl.built(S.stall, mid('stall'), f['stall'][2], wid('stall'), 0.0, 1.0, 7.0)
        pl.built(S.board, mid('board'), f['board'][2], wid('board'))
        pl.built(S.posts, mid('posts'), f['posts'][2], None, 0.0, 1.0, wid('posts'))
    # ===================================================== CAMP =====================================================
    else:
        cloths = [K.fac, K.blue_tarp, K.rust, K.teal, K.mustard, K.sage, K.ply, K.bone]
        def tent_in(x, y, w, cloth=None, name='tent'):
            root, _ = pl.built(S.tent, x, y, w, rnd.uniform(-0.3, 0.3), 1.0, w)
            if cloth is not None:
                for o in root.children_recursive:
                    if o.type == 'MESH' and o.data.materials and o.data.materials[0].name.startswith('tent_tarp'): o.data.materials[0] = cloth
            return root
        if n == 'Colorful':                                          # the painted hall, the patchwork
            def hall():
                block(K, 'hall', 34.0, 55.0, 41.0, 12, 1, 'shop', wall=K.sage, accent=K.mustard, ground_h=5.0)
                mural_wall(K, 'hall_mural', 35.0, 54.0, 40.96, 3.0, [K.mustard, K.rust, K.teal, K.bone, K.fac])
            pl.here('hall', hall)
            tent_in(mid('clinic'), f['clinic'][2], wid('clinic'), K.fac)
            tent_in(mid('barber'), f['barber'][2], wid('barber'), K.mustard)
            for k, (x, y, w) in enumerate(((8.0, 38.5, 3.4), (13.5, 41.0, 3.2), (28.0, 41.5, 3.0), (40.0, 33.0, 3.4), (46.0, 36.0, 3.0), (8.5, 22.0, 3.0), (27.5, 21.0, 3.2), (50.0, 23.5, 3.0))):
                tent_in(x, y, w, cloths[k % len(cloths)])
            pl.here('bus', bus, K, 'bus', 5.6, 17.0, 33.2, K.mustard, K.sage)
            pl.here('bunt_a', bunting, K, 'bunt_a', (9.0, 39.0, 3.0), (20.0, 40.0, 3.8), [K.rust, K.teal, K.mustard, K.sage, K.bone], walk=False)
            pl.here('bunt_b', bunting, K, 'bunt_b', (26.0, 40.0, 3.6), (40.0, 34.0, 3.4), [K.rust, K.teal, K.mustard, K.sage, K.bone], walk=False)
            pl.built(S.fire, 30.0, 25.5, None, 0.0, 1.0, True); pl.fires.append((30.0, 26.2, 1.6))
            pl.model('cart.glb', 25.0, 17.0, None, 1.0, 1.0); pl.model('tyres.glb', 44.0, 17.0, None, 0.0, 1.0)
            drum(18.0, 21.5)
        elif n == 'Custom':                                          # the crew's own garage and yard
            pl.model('bld_ranch_garage.glb', 44.0, 39.0, 15.0)
            pl.here('yard_fence', fence_fast, K, 'yard', 38.0, 56.0, 36.2, 1.8)
            pl.model('shed.glb', mid('clinic'), f['clinic'][2], None, 0.0, 1.5)
            def camper():
                Bx(K, 'camper', K.bone, 32.2, 36.4, 25.6, 28.0, 0.5, 2.7, bevel=0.3); Bx(K, 'camper_stripe', K.fac, 32.2, 36.4, 25.56, 25.6, 1.4, 1.7)
                Bx(K, 'camper_door', K.dark, 33.0, 33.8, 25.55, 25.58, 0.5, 2.2); Bx(K, 'camper_win', K.black, 34.4, 35.8, 25.55, 25.58, 1.8, 2.3)
                P.cyl(bpy, 'camper_wheel', K.dark, 0.4, 0.3, (35.0, 25.5, 0.4), rot=(math.pi / 2, 0, 0), verts=12)
            pl.here('barber', camper)
            for k, (x, y, r) in enumerate(((40.5, 36.8, 0), (47.0, 37.0, 8), (8.0, 36.0, 90), (14.0, 35.2, 80))):
                root, _ = pl.model('wreck.glb', x, y, None, math.radians(r), 1.0)
                if k < 2:
                    for sx in (-1.6, 1.6): pl.here('blocks%d%s' % (k, sx), Bx, K, 'cinder', K.concrete, x + sx - 0.3, x + sx + 0.3, y + 0.4, y + 1.0, 0, 0.4)
            pl.here('hoist', gantry_crane, K, 'hoist', 22.5, 29.5, 17.5, 5.0)
            for (x, y) in ((18.0, 21.0), (44.0, 19.5)): pl.model('tyres.glb', x, y, None, 0.0, 1.0)
            pl.model('drums.glb', 53.0, 24.5, None, 0.0, 1.0); pl.model('heap.glb', 27.0, 14.0, None, 0.0, 0.8)
            tent_in(10.5, 41.0, 3.4, K.ply); tent_in(16.5, 40.6, 3.0, K.teal)
            pl.built(S.fire, 44.0, 24.5, None, 0.0, 1.0, True); pl.fires.append((44.0, 25.2, 1.6))
            lamp(31.0, 36.0)
        elif n == 'Homeless':                                        # the flood tunnels' mouths
            pl.here('culvert', culvert, K, 'culvert', 8.0, 38.0, 43.4, 3, 3.4)
            pl.here('tank', water_tower, K, 'tank', 47.0, 40.5, 2.0, 4.0)
            def tarp_shelter(x0, x1, yf, h=2.0, cloth=None):
                for x in (x0, x1):
                    for y in (yf, yf + 2.6): P.rod(bpy, 'tp', K.wood, (x, y, 0), (x, y, h), 0.05, 6)
                P.box(bpy, 'tarp', cloth or K.blue_tarp, (x1 - x0 + 0.6, 3.2, 0.04), ((x0 + x1) / 2, yf + 1.3, h), rot=(0.12, 0.05, 0))
                Bx(K, 'tarp_wall', cloth or K.blue_tarp, x0, x1, yf + 2.55, yf + 2.6, 0, h)
            pl.here('clinic', tarp_shelter, mid('clinic') - wid('clinic') / 2, mid('clinic') + wid('clinic') / 2, f['clinic'][2], 3.6)
            pl.here('barber', tarp_shelter, mid('barber') - wid('barber') / 2, mid('barber') + wid('barber') / 2, f['barber'][2], 2.4, K.ply)
            for k, (x, y, w) in enumerate(((10.0, 38.0, 2.8), (15.0, 38.6, 3.0), (37.8, 38.2, 2.6), (6.5, 22.0, 2.8), (27.0, 22.0, 2.6), (54.0, 22.0, 2.6))):
                if k % 2: tent_in(x, y, w, K.blue_tarp)
                else: pl.here('tarp%d' % k, tarp_shelter, x - w / 2, x + w / 2, y, 1.8, K.blue_tarp if k % 3 else K.ply)
            for (x, y, r) in ((19.0, 37.2, 0.4), (24.8, 32.0, 1.6), (44.0, 22.0, 2.4), (11.0, 20.5, 0.9), (40.5, 32.5, 3.0)): pl.model('cart.glb', x, y, None, r, 1.0)
            def mattresses():
                for (x, y) in ((44.5, 38.5), (27.5, 42.5), (46.0, 16.5)): Bx(K, 'mattress', K.bone, x, x + 1.9, y, y + 1.4, 0.0, 0.22, bevel=0.06)
            pl.here('mattresses', mattresses)
            pl.built(S.fire, 28.0, 27.5, None, 0.0, 1.0, True); pl.fires.append((28.0, 28.2, 1.6))
            drum(36.0, 30.5)
        elif n == 'Trades':                                          # the works
            pl.here('shop', sawtooth, K, 'shop', 29.0, 56.0, 40.6, 14.0, 5.6)
            pl.here('crane', gantry_crane, K, 'crane', 6.0, 17.0, 36.0, 7.0)
            pl.model('heap.glb', 11.5, 32.0, None, 0.4, 1.0); pl.model('heap.glb', 54.0, 35.0, None, 2.0, 0.9)
            pl.model('dozer.glb', 28.0, 13.8, None, 0.2, 1.0)
            pl.model('shed.glb', mid('barber'), f['barber'][2], None, 0.0, 1.35)
            tent_in(mid('clinic'), f['clinic'][2], wid('clinic'), K.fac)
            for k, (x, y, w) in enumerate(((8.0, 22.0, 3.0), (52.5, 21.5, 3.0), (18.8, 40.5, 2.8))): tent_in(x, y, w, [K.ply, K.fac, K.rust][k])
            def welding():
                for k in range(3): P.cyl(bpy, 'bottle%d' % k, [K.rust, K.steel, K.teal][k], 0.13, 1.4, (24.0 + k * 0.32, 24.4, 0.7), verts=10)
                Bx(K, 'bench', K.steel, 25.0, 28.0, 24.0, 25.0, 0.85, 0.95)
                for x in (25.1, 27.9): Bx(K, 'bench_leg', K.steel, x - 0.04, x + 0.04, 24.1, 24.9, 0, 0.85)
            pl.here('welding', welding)
            pl.model('drums.glb', 24.0, 20.0, None, 0.0, 1.0); pl.model('rubble.glb', 37.5, 17.0, None, 0.0, 0.8)
            lamp(29.0, 38.0); drum(30.0, 33.5)
        else:                                                        # Volunteers: the field hospital
            pl.here('hospital', big_tent, K, 'hospital', 36.0, 48.0, 38.5, 9.0, 4.6, K.bone, K.rust)
            pl.here('hospital_b', big_tent, K, 'hospital_b', 48.6, 56.0, 39.0, 7.0, 3.8, K.sage, None)
            pl.here('pad', pad, K, 'pad', 11.0, 37.5, 4.6, K.paint, walk=False)
            tent_in(mid('clinic'), f['clinic'][2], wid('clinic'), K.bone)
            tent_in(mid('barber'), f['barber'][2], wid('barber'), K.sage)
            pl.here('cots', cots, K, 'cots', 26.0, 31.0, 17.0, 21.0)
            pl.here('jugs', jugs, K, 'jugs', 24.5, 25.0, 8)
            pl.built(S.crates, 41.5, 16.5, None, 0.0, 1.0, 5)
            def generator():
                Bx(K, 'gen', K.mustard, 16.0, 18.2, 32.0, 33.2, 0, 1.3, bevel=0.05); P.rod(bpy, 'muffler', K.steel, (17.8, 32.8, 1.3), (17.8, 32.8, 2.2), 0.06, 8)
            pl.here('generator', generator)
            def bladder():
                P.cyl(bpy, 'bladder', K.blue_tarp, 1.6, 0.7, (54.0, 24.5, 0.35), verts=24)
            pl.here('bladder', bladder)
            pl.model('patrol.glb', 6.5, 24.0, None, math.radians(75), 1.0)
            for x in (28.0, 42.0): lamp(x, 37.0)
            drum(8.0, 30.0)
        pl.built(S.stall, mid('stall'), f['stall'][2], wid('stall'))
        pl.built(S.posts, mid('posts'), f['posts'][2], None, 0.0, 1.0, wid('posts'))
        pl.built(S.board, mid('board'), f['board'][2], wid('board'))


FILL = {   # name: (width m, depth m, height m, how it is placed)
    'drums': (4.8, 3.4, 1.1, lambda pl, K, x, y: pl.model('drums.glb', x, y, None, K.rnd.uniform(-0.4, 0.4), 1.0)),
    'drum': (0.7, 0.7, 0.95, lambda pl, K, x, y: pl.model('oil_drum.glb', x, y, None, 0.0, 1.0)),
    'drumfire': (0.7, 0.7, 1.4, lambda pl, K, x, y: pl.drum_fire(x, y)),
    'tyres': (1.8, 1.8, 0.9, lambda pl, K, x, y: pl.model('tyres.glb', x, y, None, K.rnd.uniform(0, 3), 1.0)),
    'crates': (2.8, 1.2, 1.8, lambda pl, K, x, y: pl.built(S.crates, x, y, None, 0.0, 1.0, K.rnd.randint(3, 5))),
    'cart': (1.1, 1.1, 1.2, lambda pl, K, x, y: pl.model('cart.glb', x, y, None, K.rnd.uniform(0, 6), 1.0)),
    'dumpster': (2.0, 2.0, 1.7, lambda pl, K, x, y: pl.model('dumpster.glb', x, y, None, K.rnd.uniform(-0.3, 0.3), 1.0)),
    'sandbags': (2.7, 1.0, 0.9, lambda pl, K, x, y: pl.model('sandbags.glb', x, y, None, K.rnd.uniform(-0.2, 0.2), 1.0)),
    'barrier': (3.1, 0.7, 0.9, lambda pl, K, x, y: pl.model('barrier.glb', x, y, None, K.rnd.uniform(-0.2, 0.2), 1.0)),
    'rubble': (3.0, 2.4, 1.0, lambda pl, K, x, y: pl.model('rubble.glb', x, y, None, K.rnd.uniform(0, 6), 0.65)),
    'wreck': (4.9, 2.0, 1.6, lambda pl, K, x, y: pl.model('wreck.glb', x, y, None, K.rnd.uniform(-0.4, 0.4) + (math.pi if K.rnd.random() < 0.5 else 0), 1.0)),
    'bales': (5.4, 3.0, 2.3, lambda pl, K, x, y: pl.model('bales.glb', x, y, None, 0.0, 0.8)),
    'tent': (3.0, 3.9, 1.8, lambda pl, K, x, y: pl.built(S.tent, x, y, 2.8, K.rnd.uniform(-0.3, 0.3), 1.0, 2.8)),
    'shack': (3.4, 2.8, 2.6, lambda pl, K, x, y: pl.here('fill_shack', shack, K, 'fill_shack', x - 1.7, x + 1.7, y, 2.6, 2.2, tarp=K.rnd.choice([K.blue_tarp, K.fac, None])) ),
    'laundry': (4.2, 0.3, 2.0, lambda pl, K, x, y: pl.here('fill_laundry', laundry, K, 'laundry', x, y)),
    'planter': (1.8, 1.8, 1.2, lambda pl, K, x, y: pl.here('fill_planter', planter, K, 'planter', x, y)),
    'bench': (2.0, 0.7, 0.9, lambda pl, K, x, y: pl.here('fill_bench', bench, K, 'bench', x, y)),
    'jersey': (6.3, 0.7, 0.9, lambda pl, K, x, y: pl.model('cover_jersey.glb', x, y, None, K.rnd.uniform(-0.15, 0.15), 1.0)),
    'pallets': (2.4, 1.4, 1.0, lambda pl, K, x, y: pl.here('fill_pallets', pallets, K, 'pallets', x, y)),
}
TOWN_FILL = {
    'Church': ['dumpster', 'planter', 'bench', 'cart', 'barrier', 'crates', 'wreck', 'drum'],
    'Reds': ['dumpster', 'planter', 'jersey', 'barrier', 'cart', 'wreck', 'bench', 'crates'],
    'Mob': ['planter', 'jersey', 'barrier', 'dumpster', 'wreck', 'bench', 'sandbags'],
    'Anarchists': ['rubble', 'tyres', 'drums', 'cart', 'wreck', 'laundry', 'shack', 'crates', 'drumfire'],
    'Blues': ['pallets', 'crates', 'cart', 'laundry', 'drums', 'bales', 'tyres'],
    'Caravans': ['drums', 'tyres', 'pallets', 'crates', 'barrier', 'wreck', 'dumpster'],
    'Cartel': ['pallets', 'crates', 'sandbags', 'barrier', 'drums', 'dumpster', 'tyres'],
    'Network': ['pallets', 'crates', 'drums', 'barrier', 'cart', 'tyres'],
    'Remnants': ['sandbags', 'barrier', 'drums', 'crates', 'pallets', 'laundry', 'tyres'],
    'Colorful': ['tent', 'laundry', 'cart', 'tyres', 'crates', 'shack', 'drums'],
    'Custom': ['tyres', 'drums', 'wreck', 'pallets', 'crates', 'rubble'],
    'Homeless': ['cart', 'tent', 'laundry', 'shack', 'crates', 'rubble', 'drum'],
    'Trades': ['pallets', 'drums', 'crates', 'rubble', 'tyres', 'bales', 'shack'],
    'Volunteers': ['pallets', 'crates', 'tent', 'laundry', 'cart', 'drums'],
}


def laundry(K, n, x, y):
    bpy, P, rnd = K.bpy, K.P, K.rnd
    for sx in (-2.0, 2.0): P.rod(bpy, n + '_pole', K.wood, (x + sx, y, 0), (x + sx, y, 2.0), 0.05, 6)
    P.rod(bpy, n + '_line', K.dark, (x - 2.0, y, 1.9), (x + 2.0, y, 1.9), 0.01, 4)
    for k in range(int(rnd.randint(3, 6))):
        xa = x - 1.7 + k * 0.7 + rnd.uniform(-0.1, 0.1)
        Bx(K, '%s_c%d' % (n, k), rnd.choice([K.bone, K.blue_tarp, K.rust, K.sage, K.fac, K.ply]), xa, xa + rnd.uniform(0.4, 0.65), y - 0.02, y + 0.02, 1.9 - rnd.uniform(0.5, 0.9), 1.88)


def planter(K, n, x, y):
    bpy, P, rnd = K.bpy, K.P, K.rnd
    Bx(K, n + '_box', K.concrete, x - 0.8, x + 0.8, y, y + 1.6, 0, 0.7, bevel=0.03)
    Bx(K, n + '_soil', K.soil, x - 0.7, x + 0.7, y + 0.1, y + 1.5, 0.66, 0.72)
    for k in range(5):
        a = k / 5 * 2 * math.pi
        P.rod(bpy, n + '_twig', K.trunk, (x, y + 0.8, 0.7), (x + math.cos(a) * 0.5, y + 0.8 + math.sin(a) * 0.4, 1.3 + rnd.uniform(0, 0.4)), 0.025, 4)


def bench(K, n, x, y):
    Bx(K, n + '_seat', K.wood, x - 1.0, x + 1.0, y, y + 0.45, 0.42, 0.5)
    Bx(K, n + '_back', K.wood, x - 1.0, x + 1.0, y + 0.4, y + 0.48, 0.5, 0.9)
    for sx in (-0.85, 0.85): Bx(K, n + '_leg', K.steel, x + sx - 0.04, x + sx + 0.04, y + 0.02, y + 0.46, 0, 0.42)


def pallets(K, n, x, y):
    rnd = K.rnd
    for k in range(int(rnd.randint(2, 5))):
        Bx(K, '%s_p%d' % (n, k), K.wood, x - 1.2, x + 1.2, y, y + 1.2, k * 0.15, k * 0.15 + 0.13)
    if rnd.random() < 0.6: Bx(K, n + '_load', rnd.choice([K.blue_tarp, K.ply, K.fac]), x - 1.0, x + 1.0, y + 0.1, y + 1.1, 0.8, 1.0 + rnd.uniform(0, 0.4))


def fill(town, pl, K, n_want=14):
    """the rest of the town: what people leave about (the town's own list), scattered on the free ground, never on a tap,
    never in front of a building's door, never on another thing"""
    tier = town['tier']
    occ = [o['box'] for o in pl.outlines()]
    taps = [v['box'] for v in town['hot'].values()] + list(ARMSBOX[tier].values()) + [LOTBOX[tier], BUILDBOX[tier]]
    occ += [[b[0] - 30, b[1] - 20, b[2] + 30, b[3] + 30] for b in taps]
    kinds = TOWN_FILL.get(town['name'], ['crates', 'drums'])
    rnd = K.rnd; placed = 0
    for _ in range(600):
        if placed >= n_want: break
        k = rnd.choice(kinds); w, d, h, put = FILL[k]
        px, py1 = rnd.uniform(60, PW - 60), rnd.uniform(160, PH - 20)
        x, y = M(px, py1)
        box = [px - w / 2 * PPM - 12, py1 - (h * PPM + d * PPM * SQ) - 12, px + w / 2 * PPM + 12, py1 + 12]
        if any(not (box[2] < b[0] or box[0] > b[2] or box[3] < b[1] or box[1] > b[3]) for b in occ): continue
        put(pl, K, x, y); occ.append(box); placed += 1
    return placed


# ---- the render (the 10/20 tool's, with this town's plan, its kit and its windows at night) --------------------------------
def render(town, quick=False, day_only=False):
    import bpy, mathutils
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F; RIG = NF.RIG
    seed = int(hashlib.sha1(('town:' + town['name']).encode()).hexdigest()[:6], 16) % 9973
    rnd = random.Random(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='settle.' + town['slug'], seed=seed % 97)
    g = plan(town, rnd)
    objs, gg = F.build(bpy, g, 2020 + seed, quick)
    F.scene(bpy, objs)
    K = Kit(bpy, P, BLD, town, rnd)
    pl = Town(bpy, P, rnd)
    layout(town, pl, K)
    filled = fill(town, pl, K, 14 if town['tier'] != 'camp' else 18)
    outlines = pl.outlines()
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o not in objs]
    RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, seed % 5); RIG.dent_pass(meshes, 1.0)
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    stretch = bpy.data.objects.new('stretch', None); sc.collection.objects.link(stretch); stretch.scale = (1, 1, zs)
    for o in bpy.context.scene.objects:
        if o.parent is None and o not in objs and o is not stretch and o.type in ('MESH', 'EMPTY'): o.parent = stretch
    NF.LEDGER['fires'] = NF.LEDGER.get('fires', []) + [(x, y, r) for (x, y, r) in pl.fires]
    sun = RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sc.render.film_transparent = False
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = PW / PPM
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(float(RIG.G['tilt_deg'])); cam.rotation_euler = (t, 0, 0)
    look = mathutils.Vector((30.0, 30.0, 0)); dvec = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - dvec * 80; cd.clip_end = 400
    sc.render.resolution_x, sc.render.resolution_y = PW, PH; sc.render.resolution_percentage = 25 if quick else 100
    sc.cycles.samples = 8 if quick else 32; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    od = os.path.join(OUT, 'quick' if quick else 'render'); os.makedirs(od, exist_ok=True)
    day = os.path.join(od, town['slug'] + '.png'); sc.render.filepath = day
    if not (os.environ.get('COOK_NIGHT_ONLY') and os.path.exists(day)): bpy.ops.render.render(write_still=True)
    night = None
    if not day_only:
        sun.data.energy *= 0.045; sun.data.color = (0.55, 0.66, 1.0)
        bg = sc.world.node_tree.nodes['Background']; c = bg.inputs[0].default_value; bg.inputs[0].default_value = (c[0] * 0.45, c[1] * 0.55, c[2] * 1.0, 1); bg.inputs[1].default_value *= 0.08
        for m in K.night_win: m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 2.4
        for (x, y, h) in pl.lamps:
            L_ = bpy.data.lights.new('lamp', 'POINT'); L_.energy = 1600 if h < 5 else 3200; L_.color = (1.0, 0.62, 0.28); L_.shadow_soft_size = 0.3
            o = bpy.data.objects.new('lamp_light', L_); sc.collection.objects.link(o); o.location = (x, y, min(h, 8.0) * zs)
        for (x, y, r) in pl.fires:
            L_ = bpy.data.lights.new('fire', 'POINT'); L_.energy = 900; L_.color = (1.0, 0.5, 0.18); L_.shadow_soft_size = 0.4
            o = bpy.data.objects.new('fire_light', L_); sc.collection.objects.link(o); o.location = (x, y, 1.6 * zs)
        night = os.path.join(od, town['slug'] + '_night.png'); sc.render.filepath = night; bpy.ops.render.render(write_still=True)
    json.dump(dict(name=town['name'], tier=town['tier'], stands=town['stands'], trade=town['trade'], lamps=pl.lamps, fires=pl.fires,
                   outlines=outlines, filled=filled, junk=NF.LEDGER.get('junk'), seed=seed), open(os.path.join(od, town['slug'] + '.json'), 'w'), indent=0)
    return day, night


def ship(towns_):
    """the pictures into slices/settlement_ground_towns/ with the manifest and the walk outlines in RUN TWO's format"""
    from PIL import Image
    os.makedirs(SHIP, exist_ok=True)
    manp = os.path.join(SHIP, 'settlement_ground.json'); walkp = os.path.join(SHIP, 'settlement_walk.json')
    man = json.load(open(manp)) if os.path.exists(manp) else {}
    walk = json.load(open(walkp)) if os.path.exists(walkp) else {}
    man.update({'version': 'cook-town-screens-10-25', 'lane': 'COOK', 'for_screen': 'RUN TWO, the settlement screen (rule 186(b))',
                'note': ('EVERY HOME BASE ITS OWN PICTURE (COOK [every town looks its own], rule 186(b); EYES 10/25w line 106). '
                         'towns[<the name the map posts>] is that town\'s picture: src by day, night_src at night, the same 2060 x 1092, '
                         'its tier\'s hotspots to the pixel (the tier\'s variant 0 in settlement_ground_packs/), so every tap and every box '
                         'in the screen (ARMSBOX, LOTBOX, BUILDBOX, LOOKBOX) lands where it did; settlement_walk.json beside it carries '
                         'every thing drawn in each picture, measured in the scene (roof to front foot), in RUN TWO\'s own format. '
                         'A name not in towns keeps the tier picture (the camp, a place not a home base).'),
                'px_per_metre': PPM})
    man.setdefault('towns', {}); walk.setdefault('pictures', {})
    walk.update({'version': '10/25/26', 'lane': 'COOK (for RUN TWO)',
                 'note': ('WHERE A PERSON CANNOT STAND, per town picture, in picture px [x0, y0, x1, y1]: every thing placed in the scene '
                          '(buildings, walls, fences, tents, stalls, wrecks, towers, tanks, crates, drums, boards, lamps, fires), its box on '
                          'the picture from its roof to its front foot, measured from the scene by tools/bohemia_cook_every_town_its_own_screen_10_25_26.py '
                          '(never traced by eye). Flat things a person walks over (a landing pad, bunting overhead) are left out. Same format as '
                          'slices/settlement_walk.json.')})
    for town in towns_:
        rd = os.path.join(OUT, 'render'); s = town['slug']
        meta = json.load(open(os.path.join(rd, s + '.json')))
        for src, suf in ((s + '.webp', ''), (s + '_night.webp', '_night')):
            p = os.path.join(rd, s + suf + '.png')
            if not os.path.exists(p): continue
            a = Image.open(p).convert('RGB'); assert a.size == (PW, PH)
            a.save(os.path.join(SHIP, src), quality=82, method=6)
        man['towns'][town['name']] = dict(tier=town['tier'], src=s + '.webp', night_src=s + '_night.webp', px=[PW, PH],
                                          hotspots=town['hot'], stands=town['stands'], trade=town['trade'], u=town['u'],
                                          lights=len(meta['lamps']) + len(meta['fires']))
        bl = sorted({tuple(o['box']) for o in meta['outlines']})
        walk['pictures'][s + '.webp'] = {'blocks': [list(b) for b in bl]}
        walk['pictures'][s + '_night.webp'] = {'blocks': [list(b) for b in bl]}
        print('  shipped', s, os.path.getsize(os.path.join(SHIP, s + '.webp')) // 1024, 'KB,', len(meta['outlines']), 'outlines', flush=True)
    json.dump(man, open(manp, 'w'), indent=1)
    json.dump(walk, open(walkp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    want = [x for x in a if not x.startswith('--')]
    T = [t for t in towns() if not want or t['name'] in want or t['slug'] in want]
    for town in T:
        if '--swap-only' not in a:
            d, nn = render(town, quick='--quick' in a, day_only='--day-only' in a); print('  rendered', town['name'], d, nn, flush=True)
    if '--quick' not in a: ship(T)
    sys.stdout.flush(); os._exit(0)
