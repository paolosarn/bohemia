#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D], FAMILY THREE: THE SETTLEMENT PICTURES BUILT IN 3D, SWAPPED STRAIGHT IN (10/20/26).
Rule 121(l) (Paolo 10/19: 'we need all the 2D assets made into 3D assets now'); rule 123 (Paolo 10/20: 'all that energy
has to be spent towards just revamping all the 2-D assets into these 3-D sprites... analog horror Crashbox vibes, go
crazy'): no card. Measured, the settlement screen's backdrop is the biggest flat thing in the game after the floor: the
whole screen (slices/settlement_ground_packs/town_0.webp, 5.5 G px over the run). His 10/10 on them: 'the settlements all
look like dogshit and not organic with the map'.

EVERY PLACE IS A SCENE IN METRES: the same camera as the fight's floor (the rig's, tilted 45, facing north, heights x
1.414, 42.9 px a metre), 48 m by 36 m of ground in the 2060 x 1092 picture; the floor tool's ground (its materials, its
heights, its stones, its curbs) laid from a plan drawn here; COOK's buildings and props imported untouched (the pawn
shop, the chapel, the motel, the ranches, the wreck, the lamps, the drums, the dumpster, the barrier, the sandbags, the
container, the fence); what had no model made here (the market stall, the hitching posts, the notice board, the tents,
the palisade, the cold and the lit fire, the crates); the rig's source pass and dents on every mesh, the floor tool's
grime across everything and its junk in every corner, the rig's one sun and fill. NIGHT is the same scene again under a
moon with every lamp and fire lit (the old night picture's count of lights).
SAME FILE, SAME SIZE, SAME TAP: every hotspot of slices/settlement_ground_packs/settlement_ground.json (and the home block
in slices/settlement_ground/) has its building or thing seated in its box, the front on the box's foot, so the screen's
taps and its lit-under-the-finger land on what they name.

  <venv>/bin/python tools/bohemia_cook_the_settlements_through_the_rig_10_20_26.py [town_0 camp_1 ...]   (about 6 min a place)
  COOK_NIGHT_ONLY=1 ... (10/23: the night again over a day already rendered)

REFERENCE CHECK (the 9/4 standing duty): the old pictures' hotspots are the twins (where each thing stands); real places:
an east-valley Las Vegas commercial strip (a pawn shop, a wedding chapel turned to other use, a motel), a Mojave squat
camp (tarps, a fire ring, a hitching rail), a fortified lot walled with containers and stakes; Machine Party's grime that
crosses every edge (the 8/3 dossier 3.1). No reference game.
REUSE CHECK (REUSE-FIRST): the floor tool's ground and the not-final tool's grime and junk; the props modeller's helpers;
COOK's glbs; the master rig's passes and light.
TASTE CHECK: his 'not organic with the map' and 'the rig is the look' (rule 115).
"""
import os, sys, json, math, random, hashlib
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
OUT = os.path.join(R, 'records/target/cook_settlement_rig')
MODELS = os.path.join(R, 'reference/models/bohemia')
PPM = 515 / 12.0
PW, PH = 2060, 1092
X0, Y0, Y1 = 6.0, 12.0, 48.0          # the picture shows ground x 6..54, y 12..48 of the 60 m square the floor tool builds
SQ = 0.70711
DIRS = {'packs': os.path.join(R, 'slices/settlement_ground_packs'), 'old': os.path.join(R, 'slices/settlement_ground')}


def placements():
    """every picture the screen draws: (name, folder, hotspots, lights)"""
    out = []
    for key, d in (('packs', DIRS['packs']), ('old', DIRS['old'])):
        man = json.load(open(os.path.join(d, 'settlement_ground.json')))
        for tier, t in man['tiers'].items():
            if key == 'packs' and tier == 'home': continue      # the screen takes home from the old folder
            if key == 'old' and tier != 'home': continue
            for v in t['variants']:
                out.append(dict(name=v['src'][:-5], tier=tier, dir=d, src=v['src'], night=v.get('night_src'), hot=v['hotspots'], lights=v.get('lights', 2)))
    return out


def foot(box):
    """a hotspot box in picture px -> (x0, x1, y_front, the box's screen height in m)"""
    px0, py0, px1, py1 = box
    return X0 + px0 / PPM, X0 + px1 / PPM, Y1 - py1 / (PPM * SQ), (py1 - py0) / PPM


# ---- the things that had no model ---------------------------------------------------------------------------------------
def grab(bpy, fn, *a, **k):
    before = set(bpy.context.scene.objects)
    fn(*a, **k)
    return [o for o in bpy.context.scene.objects if o not in before]


def stall(bpy, P, rnd, w=4.0):
    wood, tarp_a, tarp_b, can = P.mat(bpy, 'stall_wood', 'clay_bone', 1), P.mat(bpy, 'tarp_a', 'clay_rust', 2), P.mat(bpy, 'tarp_b', 'clay_bone', 3), P.mat(bpy, 'cans', 'tape_grey', 2)
    P.box(bpy, 'counter', wood, (w * 0.9, 0.9, 0.9), (0, 0.6, 0.45))
    for x in (-w / 2 + 0.1, w / 2 - 0.1):
        for y in (0.0, 1.9): P.rod(bpy, 'pole', wood, (x, y, 0), (x, y, 2.3 if y else 2.0), 0.045, 6)
    n = 7
    for k in range(n):                                          # the awning in faded stripes, sagging forward
        x = -w / 2 + (k + 0.5) * w / n
        P.box(bpy, 'awn_%d' % k, tarp_a if k % 2 else tarp_b, (w / n + 0.01, 2.3, 0.03), (x, 0.95, 2.18), (math.radians(-9), 0, 0))
    for k in range(rnd.randint(6, 12)):                         # what is for sale: tins, jars, a battery or two
        P.cyl(bpy, 'tin_%d' % k, can, 0.06, 0.12, (rnd.uniform(-w * 0.4, w * 0.4), rnd.uniform(0.3, 0.9), 0.96), verts=8)
    for k in range(3): P.box(bpy, 'crate_%d' % k, wood, (0.55, 0.45, 0.4), (rnd.uniform(-w * 0.4, w * 0.4), -0.25, 0.2), (0, 0, rnd.uniform(-0.3, 0.3)))


def posts(bpy, P, rnd, length):
    wood, rag = P.mat(bpy, 'post_wood', 'clay_bone', 1), P.mat(bpy, 'rags', 'clay_teal', 2)
    n = max(2, int(length / 1.6) + 1)
    for k in range(n):
        x = -length / 2 + k * length / (n - 1)
        P.box(bpy, 'post_%d' % k, wood, (0.14, 0.14, 1.15 + rnd.uniform(-0.08, 0.08)), (x, 0, 0.58), (0, rnd.uniform(-0.06, 0.06), 0))
        if rnd.random() < 0.4: P.box(bpy, 'rag_%d' % k, rag, (0.12, 0.03, 0.35), (x + 0.1, -0.08, 0.85), (0, 0.3, 0))
    P.box(bpy, 'rail', wood, (length, 0.1, 0.1), (0, 0, 1.08))
    P.box(bpy, 'rail_low', wood, (length, 0.08, 0.08), (0, 0, 0.55), (0, rnd.uniform(-0.04, 0.04), 0))


def board(bpy, P, rnd):
    wood, paper, paper_b = P.mat(bpy, 'board_wood', 'clay_bone', 1), P.mat(bpy, 'notice', 'clay_bone', 4), P.mat(bpy, 'notice_b', 'tape_masking', 3)
    for x in (-0.8, 0.8): P.box(bpy, 'leg', wood, (0.12, 0.12, 2.2), (x, 0, 1.1))
    P.box(bpy, 'board', wood, (1.85, 0.08, 1.1), (0, 0, 1.45))
    P.box(bpy, 'cap', wood, (2.1, 0.4, 0.06), (0, 0, 2.06), (math.radians(-12), 0, 0))
    for k in range(rnd.randint(6, 11)):
        P.box(bpy, 'note_%d' % k, paper if k % 3 else paper_b, (rnd.uniform(0.18, 0.32), 0.012, rnd.uniform(0.22, 0.34)), (rnd.uniform(-0.75, 0.75), -0.05, rnd.uniform(1.05, 1.85)), (0, rnd.uniform(-0.15, 0.15), 0))


def tri(bpy, name, m, pts):
    me = bpy.data.meshes.new(name); me.from_pydata(pts, [], [(0, 1, 2)]); me.update()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); o.data.materials.append(m); return o


def tent(bpy, P, rnd, w=4.0):
    role = rnd.choice([('metal_painted', 2), ('clay_teal', 1), ('tape_grey', 2), ('tape_masking', 2)])
    tarp = P.mat(bpy, 'tent_tarp', *role); dark = P.mat(bpy, 'tent_inside', 'cloth_black', 1); rope = P.mat(bpy, 'rope', 'clay_bone', 2)
    d = w * rnd.uniform(1.1, 1.4); h = w * 0.55; half = w / 2; slope = math.atan2(h, half); L = math.hypot(h, half)
    for s in (-1, 1):
        P.box(bpy, 'side_%d' % s, tarp, (0.03, d, L), (s * half / 2, d / 2, h / 2), (0, -s * (math.pi / 2 - slope), 0))
    tri(bpy, 'back', tarp, [(-half, d, 0), (half, d, 0), (0, d, h)])
    tri(bpy, 'front_dark', dark, [(-half * 0.8, 0.02, 0), (half * 0.8, 0.02, 0), (0, 0.02, h * 0.8)])
    for sgn in (-1, 1):                                         # the flaps tied back either side of the door
        tri(bpy, 'flap_%d' % sgn, tarp, [(sgn * half, -0.02, 0), (sgn * half * 0.55, -0.02, 0), (0, -0.02, h)])
    P.rod(bpy, 'ridge', rope, (0, -0.4, h), (0, d + 0.4, h), 0.02, 4)
    for s in (-1, 1):
        P.rod(bpy, 'guy_%d' % s, rope, (s * half * 0.5, 0, h * 0.5), (s * (half + 0.9), -0.3, 0), 0.01, 4)


def palisade(bpy, P, rnd, x0, x1, y):
    wood, sheet, rust = P.mat(bpy, 'stake', 'clay_bone', 1), P.mat(bpy, 'sheet', 'metal_painted', 1), P.mat(bpy, 'sheet_rust', 'clay_rust', 1)
    x = x0
    while x < x1:
        if rnd.random() < 0.25:                                # a run of corrugated sheet between stakes
            w_ = rnd.uniform(1.8, 3.0); P.box(bpy, 'sheet', rust if rnd.random() < 0.4 else sheet, (w_, 0.05, rnd.uniform(2.2, 2.8)), (x + w_ / 2, y, 1.25), (rnd.uniform(-0.04, 0.04), 0, 0)); x += w_
        else:
            hgt = rnd.uniform(2.6, 3.3); P.cyl(bpy, 'stake', wood, 0.13, hgt, (x + 0.13, y, hgt / 2), (rnd.uniform(-0.05, 0.05), 0, 0), verts=7, smooth=False)
            bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=0.13, depth=0.4, location=(x + 0.13, y, hgt + 0.2)); P.put(bpy, bpy.context.active_object, 'tip', wood, smooth=False)
            x += 0.27


def fire(bpy, P, rnd, lit):
    stone, char = P.mat(bpy, 'ring_stone', 'tape_grey', 1), P.mat(bpy, 'char', 'cloth_black', 1)
    for k in range(10):
        a = k / 10 * 2 * math.pi; P.chunk(bpy, 'ring_%d' % k, stone, (0.26, 0.2, 0.16), (math.cos(a) * 0.75, math.sin(a) * 0.75, 0.08), (0, 0, a), rnd)
    for k in range(5): P.box(bpy, 'log_%d' % k, char, (0.9, 0.12, 0.12), (rnd.uniform(-0.2, 0.2), rnd.uniform(-0.2, 0.2), 0.1), (0, 0, k * 1.1))
    if lit:
        flame = P.mat(bpy, 'flame', 'sodium', 3, glow=5.0)
        for k in range(4):
            bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.22, depth=0.7, location=(rnd.uniform(-0.15, 0.15), rnd.uniform(-0.15, 0.15), 0.45))
            P.put(bpy, bpy.context.active_object, 'flame_%d' % k, flame, smooth=False)


def crates(bpy, P, rnd, n=4):
    wood, wood_b = P.mat(bpy, 'crate', 'clay_bone', 1), P.mat(bpy, 'crate_b', 'tape_masking', 1)
    for k in range(n):
        s = rnd.uniform(0.6, 0.95); z = 0 if k < max(2, n - 2) else s
        P.box(bpy, 'crate_%d' % k, wood if k % 2 else wood_b, (s, s, s), (k % 3 * 0.9 - 0.9 + rnd.uniform(-0.1, 0.1), rnd.uniform(-0.2, 0.2), z + s / 2), (0, 0, rnd.uniform(-0.3, 0.3)), bevel=0.02)


# ---- placing a thing on the ground -------------------------------------------------------------------------------------
class Place:
    def __init__(s, bpy, P, rnd):
        s.bpy, s.P, s.rnd = bpy, P, rnd; s.roots, s.meshes, s.lamps, s.fires = [], [], [], []

    def _seat(s, objs, x, y_front, width=None, rot=0.0, scale=None, name='thing'):
        bpy = s.bpy
        objs = [o for o in objs if o.type in ('MESH', 'EMPTY')]
        root = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(root)
        for o in objs:
            if o.parent is None: o.parent = root
        root.rotation_euler = (0, 0, rot); bpy.context.view_layer.update()
        lo, hi = s._bounds(objs)
        k = scale or ((width / max(1e-3, hi[0] - lo[0])) if width else 1.0)
        root.scale = (k, k, k); bpy.context.view_layer.update()
        lo, hi = s._bounds(objs)
        root.location = (root.location[0] + x - (lo[0] + hi[0]) / 2, root.location[1] + y_front - lo[1], root.location[2] - lo[2])
        bpy.context.view_layer.update()
        s.roots.append(root); s.meshes += [o for o in objs if o.type == 'MESH']
        return root, k

    def _bounds(s, objs):
        dg = s.bpy.context.evaluated_depsgraph_get(); lo = [1e9] * 3; hi = [-1e9] * 3
        for o in objs:
            if o.type != 'MESH': continue
            e = o.evaluated_get(dg); me = e.to_mesh()
            for v in me.vertices:
                p = e.matrix_world @ v.co; lo = [min(a, b) for a, b in zip(lo, p)]; hi = [max(a, b) for a, b in zip(hi, p)]
            e.to_mesh_clear()
        return lo, hi

    def model(s, glb, x, y_front, width=None, rot=0.0, scale=None):
        bpy = s.bpy
        before = set(bpy.context.scene.objects)
        if glb.startswith('bld_'):
            # a building is BUILT by the modeller, never imported: its glb lost the shingle courses, the stucco's grime and
            # its colour on export (glTF carries no procedural node tree: the first town came out white, 10/20)
            import mathutils
            import bohemia_cook_model_buildings as BLD
            tints = ([(1.0, 1.0, 1.0), (1.04, 0.98, 0.93), (0.95, 0.97, 1.0), (1.05, 1.02, 0.9)], [(1.0, 1.0, 1.0), (0.9, 0.9, 0.92), (0.82, 0.78, 0.74)])
            BLD.TINT = dict(stucco=s.rnd.choice(tints[0]), pale=s.rnd.choice(tints[0]), roof=s.rnd.choice(tints[1]))
            BLD.M.clear(); BLD.BUILDERS[glb[4:-4]](bpy, mathutils); BLD.TINT = {}
        else:
            bpy.ops.import_scene.gltf(filepath=os.path.join(MODELS, glb))
        new = [o for o in bpy.context.scene.objects if o not in before]
        for o in [o for o in new if '_fence' in o.name]:          # a ranch's own fence: the place has its own edges
            new.remove(o); bpy.data.objects.remove(o, do_unlink=True)
        for o in list(new):
            if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
                new.remove(o); bpy.data.objects.remove(o, do_unlink=True)
        return s._seat(new, x, y_front, width, rot, scale, glb[:-4])

    def built(s, fn, x, y_front, width=None, rot=0.0, scale=1.0, *a):
        objs = grab(s.bpy, fn, s.bpy, s.P, s.rnd, *a)
        return s._seat(objs, x, y_front, width, rot, None if width else scale, fn.__name__)

    def lamp(s, x, y, kind='lamp.glb'):
        root, k = s.model(kind, x, y, scale=1.0)
        s.lamps.append((x, y + 0.2, 3.1 if kind == 'lamp.glb' else 8.8))

    def drum_fire(s, x, y):
        s.model('oil_drum.glb', x, y, scale=1.0)
        objs = grab(s.bpy, fire_top, s.bpy, s.P, s.rnd)
        for o in objs: o.location = (o.location[0] + x, o.location[1] + y + 0.3, o.location[2] + 0.9)
        s.meshes += [o for o in objs if o.type == 'MESH']; s.fires.append((x, y + 0.3, 1.3))


def fire_top(bpy, P, rnd):
    flame = P.mat(bpy, 'drum_flame', 'sodium', 3, glow=5.0)
    for k in range(4):
        bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.16, depth=0.5, location=(rnd.uniform(-0.1, 0.1), rnd.uniform(-0.1, 0.1), 0.25))
        P.put(bpy, bpy.context.active_object, 'flame_%d' % k, flame, smooth=False)


# ---- the four places -----------------------------------------------------------------------------------------------------
def plan(tier, rnd):
    """the ground plan on the floor tool's 60 m grid (2575 x 1820 px, rows north to south)"""
    import bohemia_cook_the_floor_through_the_rig_10_19_26 as F
    ID = F.ID
    g = np.full((F.H, F.W), ID['caliche'], np.uint8)
    def band(ya, yb, what, xa=0.0, xb=60.0):
        ra, rb = int((60 - yb) / 60 * F.H), int((60 - ya) / 60 * F.H); ca, cb = int(xa / 60 * F.W), int(xb / 60 * F.W)
        g[max(0, ra):rb, max(0, ca):cb] = ID[what]
    if tier == 'town':
        band(0, 60, 'caliche'); band(34.6, 36.0, 'concrete'); band(29.0, 34.6, 'asphalt'); band(27.5, 29.0, 'concrete')
        band(23.0, 27.5, 'rough', 30, 46)
    elif tier == 'camp':
        band(0, 60, 'desert'); band(20, 26, 'rough', 8, 22); band(28, 31, 'track', 0, 60); band(36, 44, 'playa', 40, 56)
    elif tier == 'fortress':
        band(0, 60, 'concrete'); band(14, 30, 'rough', 20, 32); band(37, 41, 'asphalt', 0, 60); band(44, 60, 'caliche')
    elif tier == 'home':
        band(0, 60, 'caliche'); band(26.5, 28.0, 'concrete'); band(19.0, 26.5, 'asphalt'); band(17.5, 19.0, 'concrete')
        band(28.0, 34.6, 'concrete', 26.0, 34.0); band(29.0, 34.4, 'lawn', 17.2, 25.4)
    return g


def layout(tier, var, hot, pl, rnd):
    """the buildings and the things, every hotspot seated in its own box"""
    f = {k: foot(v['box']) for k, v in hot.items()}
    def mid(k): return (f[k][0] + f[k][1]) / 2
    def wid(k): return f[k][1] - f[k][0]
    if tier == 'town':
        pl.model('bld_pawn_shop.glb', mid('barber'), f['barber'][2], wid('barber') * 0.98)
        pl.model('bld_chapel.glb', mid('clinic'), f['clinic'][2], wid('clinic') * 0.96)
        pl.model(['bld_ranch_plain.glb', 'bld_ranch_porch.glb'][var % 2], X0 + 6.0, f['barber'][2] + 0.3, 11.0)
        pl.model('bld_motel.glb', X0 + 47.0, f['clinic'][2] + 0.2, 13.0)
        pl.built(stall, mid('stall'), f['stall'][2], wid('stall'))
        pl.built(posts, mid('posts'), f['posts'][2], None, 0.0, 1.0, wid('posts'))
        pl.built(board, mid('board'), f['board'][2], wid('board'))
        for x in (X0 + 4.5, X0 + 24.0, X0 + 44.0): pl.lamp(x, 35.1)
        pl.model('wreck.glb', X0 + 14 + var * 8, 31.0, None, math.radians(90 + rnd.uniform(-15, 15)), 1.0)
        pl.model('wreck.glb', X0 + 38 - var * 5, 29.6, None, math.radians(-80), 1.0)
        pl.drum_fire(mid('stall') + 3.0, f['stall'][2] + 0.3)
        for k, x in enumerate((X0 + 3, X0 + 33, X0 + 45)):           # the lot where the board stands is empty: its house is gone
            pl.model(['bld_ranch_plain.glb', 'bld_ranch_garage.glb', 'bld_ranch_porch.glb'][(k + var) % 3], x + 3, 12.6, 10.5 if k != 1 else 14.0)
        pl.model('rubble.glb', X0 + 15.5, 13.0, None, 0.3, 1.0)                    # what is left of it
        pl.model('dumpster.glb', X0 + 30, 24.6, None, 0.2, 1.0)
        pl.built(crates, X0 + 26, 24.2, None, 0.0, 1.0, 3)
    elif tier == 'camp':
        pl.built(tent, mid('clinic'), f['clinic'][2], wid('clinic'), 0.0, 1.0, 5.5)
        pl.built(tent, mid('barber'), f['barber'][2], wid('barber'), 0.0, 1.0, 4.0)
        pl.built(stall, mid('stall'), f['stall'][2], wid('stall'))
        pl.built(posts, mid('posts'), f['posts'][2], None, 0.0, 1.0, wid('posts'))
        pl.built(board, mid('board'), f['board'][2], wid('board'))
        for (x, y, w_) in ((X0 + 32, 38.0, 3.8), (X0 + 40, 36.0, 3.4), (X0 + 26, 31.5, 3.6), (X0 + 9, 41.0, 3.2), (X0 + 45, 41.5, 3.0))[:4 + var]:
            pl.built(tent, x, y, w_, rnd.uniform(-0.3, 0.3), 1.0, w_)
        pl.built(fire, X0 + 34, 26.8, None, 0.0, 1.0, True); pl.fires.append((X0 + 34, 27.5, 1.6))
        pl.model('wreck.glb', X0 + 44, 20.5, None, math.radians(70), 1.0)
        pl.model('drums.glb', X0 + 16, 22.0, None, 0.4, 1.0)
        pl.built(crates, X0 + 36, 30.0, None, 0.0, 1.0, 5)
        pl.drum_fire(X0 + 22, 21.0)
        pl.model('cart.glb', X0 + 24, 17.5, None, 1.0, 1.0)
        pl.model('tyres.glb', X0 + 6, 33.0, None, 0.0, 1.0)
    elif tier == 'fortress':
        pl.model('bld_ranch_garage.glb', mid('clinic'), f['clinic'][2], wid('clinic') * 0.98)
        pl.model('bld_pawn_shop.glb', mid('barber'), f['barber'][2], wid('barber') * 0.96)
        pl.built(stall, mid('stall'), f['stall'][2], wid('stall'), 0.0, 1.0, 7.0)
        pl.built(board, mid('board'), f['board'][2], wid('board'))
        pl.built(posts, mid('posts'), f['posts'][2], None, 0.0, 1.0, wid('posts'))
        grab(pl.bpy, palisade, pl.bpy, pl.P, pl.rnd, X0 - 2, X0 + 50, 46.6)
        pl.model('container.glb', X0 + 4, 41.6, None, 0.0, 1.0); pl.model('container.glb', X0 + 44, 41.4, None, 0.05, 1.0)
        for (x, y) in ((X0 + 20, 29.0), (X0 + 36, 22.0), (X0 + 15, 16.5), (X0 + 44, 16.0), (X0 + 27, 17.0)):
            pl.drum_fire(x, y)
        pl.model('sandbags.glb', X0 + 20, 36.0, None, 0.0, 1.0); pl.model('sandbags.glb', X0 + 23, 36.2, None, 0.1, 1.0)
        pl.model('barrier.glb', X0 + 38, 30.0, None, 0.0, 1.0)
        pl.built(crates, X0 + 32, 27.0, None, 0.0, 1.0, 5)
        pl.model('propane.glb', X0 + 18, 40.0, None, 0.0, 1.0)
        pl.model('wreck.glb', X0 + 46, 34.6, None, math.radians(85), 1.0)
    elif tier == 'home':
        pl.model('bld_ranch_porch.glb', mid('hall'), f['hall'][2], wid('hall') * 1.6)
        pl.model('wreck.glb', mid('lot'), f['lot'][2] + 0.6, None, math.radians(90), 1.0)
        pl.built(stall, mid('stall'), f['stall'][2], wid('stall'))
        pl.built(board, mid('board'), f['board'][2], wid('board'))
        pl.model('bld_ranch_plain.glb', X0 + 41.5, 34.6, 12.0)
        pl.model('bld_ranch_garage.glb', X0 + 4, 34.6, 13.0)
        for x in (X0 + 10, X0 + 38): pl.lamp(x, 27.0)
        pl.model('wreck.glb', X0 + 30, 22.5, None, math.radians(-88), 1.0)
        pl.model('dumpster.glb', X0 + 30, 28.3, None, 0.1, 1.0)
        for k in range(5): pl.model('wall.glb', X0 + 4 + k * 6.2, 16.4, None, 0.0, 1.0)


def render(p):
    import bpy, mathutils
    import bohemia_cook_model_props as P
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    F = NF.F; RIG = NF.RIG
    seed = int(hashlib.sha1(p['name'].encode()).hexdigest()[:6], 16) % 9973
    rnd = random.Random(seed); var = int(p['name'].split('_')[1]) if p['name'].split('_')[1].isdigit() else 0
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='settle.' + p['name'], seed=seed % 97)
    g = plan(p['tier'], rnd)
    objs, gg = F.build(bpy, g, 2020 + seed, False)       # the floor tool's ground, with the not-final tool's junk
    F.scene(bpy, objs)
    pl = Place(bpy, P, rnd)
    layout(p['tier'], var, p['hot'], pl, rnd)
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
    sc.render.resolution_x, sc.render.resolution_y = PW, PH; sc.render.resolution_percentage = 100
    sc.cycles.samples = 32; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    for m in bpy.data.materials:
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    os.makedirs(os.path.join(OUT, 'render'), exist_ok=True)
    day = os.path.join(OUT, 'render', p['name'] + '.png'); sc.render.filepath = day
    if not (os.environ.get('COOK_NIGHT_ONLY') and os.path.exists(day)): bpy.ops.render.render(write_still=True)
    night = None
    if p['night'] and not os.environ.get('COOK_DAY_ONLY'):
        # NIGHT: the same place under a moon, every lamp and fire lit (the old picture's count of lights)
        # 10/23: the first night read as a grey dusk (the moon at 0.16 of the sun, the sky at 0.3): his old nights are near
        # black with warm pools under the lamps, so the moon is 0.045 and blue, the sky 0.08, the lamps and fires brighter
        sun.data.energy *= 0.045; sun.data.color = (0.55, 0.66, 1.0)
        bg = sc.world.node_tree.nodes['Background']; c = bg.inputs[0].default_value; bg.inputs[0].default_value = (c[0] * 0.45, c[1] * 0.55, c[2] * 1.0, 1); bg.inputs[1].default_value *= 0.08
        for (x, y, h) in pl.lamps:
            L_ = bpy.data.lights.new('lamp', 'POINT'); L_.energy = 1600; L_.color = (1.0, 0.62, 0.28); L_.shadow_soft_size = 0.3
            o = bpy.data.objects.new('lamp_light', L_); sc.collection.objects.link(o); o.location = (x, y, h * zs)
        for (x, y, r) in pl.fires:
            L_ = bpy.data.lights.new('fire', 'POINT'); L_.energy = 900; L_.color = (1.0, 0.5, 0.18); L_.shadow_soft_size = 0.4
            o = bpy.data.objects.new('fire_light', L_); sc.collection.objects.link(o); o.location = (x, y, 1.6 * zs)
        night = os.path.join(OUT, 'render', p['name'] + '_night.png'); sc.render.filepath = night; bpy.ops.render.render(write_still=True)
    json.dump(dict(name=p['name'], lamps=pl.lamps, fires=pl.fires, junk=NF.LEDGER.get('junk'), seed=seed), open(os.path.join(OUT, 'render', p['name'] + '.json'), 'w'))
    return day, night


def swap(p):
    from PIL import Image
    led = os.path.join(OUT, 'swapped.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    for src, rend in ((p['src'], os.path.join(OUT, 'render', p['name'] + '.png')), (p['night'], os.path.join(OUT, 'render', p['name'] + '_night.png'))):
        if not src or not os.path.exists(rend): continue
        dst = os.path.join(p['dir'], src)
        a = Image.open(rend).convert('RGB'); assert a.size == Image.open(dst).size == (PW, PH)
        a.save(dst, quality=82, method=6)
        L[os.path.relpath(dst, R)] = dict(file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), render=os.path.relpath(rend, R))
        print('  swapped', os.path.relpath(dst, R), os.path.getsize(dst) // 1024, 'KB', flush=True)
    json.dump(L, open(led, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    want = [x for x in a if not x.startswith('--')]
    for p in placements():
        if want and p['name'] not in want: continue
        if '--swap-only' not in a:
            d, n = render(p); print('  rendered', p['name'], d, n, flush=True)
        swap(p)
    sys.stdout.flush(); os._exit(0)
