#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D], FAMILY TWO: THE FIGHT'S COVER THROUGH THE RIG, SWAPPED STRAIGHT IN (10/20/26).
Rule 121(l) (Paolo 10/19: 'we need all the 2D assets made into 3D assets now'); rule 123 (Paolo 10/20: 'all that energy
has to be spent towards just revamping all the 2-D assets into these 3-D sprites... analog horror Crashbox vibes, go
crazy'): no card; every cover picture the fight draws (slices/fight_ground/cover_*.webp, 51) and its lights (light_*.webp)
replaced by a render of a model through the master rig, at the fight's own 42.9 px a metre, in the old picture's canvas
(the same file, the same size, the same foot: the fight draws a cover top-left at its x_m, y_m at its own pixel size,
BOHEMIA_FIGHT.html drawGround, so the thing must stand where the old one stood).

THE MODELS: what COOK already made through the rig is imported untouched (the wreck for the two dead cars, the patrol car,
the block wall, its corner and its knocked-through run, the shed, the trailer, the dumpster, the fence, the barrier, the
lamp, the oil drum); what had none is made here in real metres, flat palette colours (a glb carries no procedural
texture), the rig's wear and this lane's grime on top:
  rock_0..20  the valley's own boulders: Spring Mountains limestone grey, Red Rock's sandstone gone dull red, the desert
              varnish dark; one to four stones a piece, 1.4 m the tallest, a dead weed at the foot
  outcrop     the MOUND: four big stones packed into a low hill, a flat top a man stands on
  rubble_0..11 what a house wall comes down to: concrete lumps, block halves, brick, bent rebar, a plank, one odd thing
  pump        a dead fuel pump on its island, the hose cut, the nozzle still holstered
  steps       a casino's front steps, three risers, the handrail posts
  dock        a works' loading dock, 1.2 m up, its steel nosing, the rubber bumpers, a pallet left on it
  slot_bank   seven dead slot machines on their carpet plinth, one screen still faintly lit
  table       a casino table, its felt worn through to the board, one chair knocked over
  pillar      a parking deck's column, a corner knocked off to its rebar
  jersey      two barrier units end to end (COOK's barrier, twice)
THEN: one render through the master rig (tools/bohemia_direction_master_rig.py, imported, never edited) with this lane's
grime pass (tools/bohemia_cook_the_floor_not_final_10_20_26.py: dirt where things meet, streaks, damp, the roof's wear)
on every material; the facing whose silhouette best matches the old picture's (the board's footprint is the old one's);
the body over its own contact-shadow layer, seated on the old picture's foot.

  <venv>/bin/python tools/bohemia_cook_the_cover_through_the_rig_10_20_26.py all [piece ...]   (models, renders, the cut)
  <venv>/bin/python tools/bohemia_cook_the_cover_through_the_rig_10_20_26.py model|rig <piece>
  python3 tools/bohemia_cook_the_cover_through_the_rig_10_20_26.py cut [piece ...]          (no bpy: the swap only)

REFERENCE CHECK (the 9/4 standing duty): the fight's old cover pictures are the twins (their size, their foot, their
facing); real sizes: a 40-foot dry van, an 8-inch block wall 1.8 m, a jersey barrier 0.8 m, a fuel dispenser 1.8 m, a
dock at truck-bed height 1.2 m; the valley's rock is the Spring Mountains' limestone and Red Rock's Aztec sandstone. No
reference game.
REUSE CHECK (REUSE-FIRST): COOK's glbs and the props modeller's helpers (mat, box, cyl, chunk, import_model); the master
rig's render and post; the floor tool's grime pass.
TASTE CHECK: the rig is the look (rule 115); his packs' rock had moss on it, a Mojave rock has none.
"""
import os, sys, json, math, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/fight_ground')
OUT = os.path.join(R, 'records/target/cook_cover_rig')
MODELS = os.path.join(R, 'reference/models/bohemia')
PPM = 515 / 12.0
BASE_SHA = 'c12f16127eb6424f5007babc0f0e6851daf51698'
VENV = '/home/user/v/bin/python'

# piece -> (model, real length m or None for 'as built', seed for the wear)
PIECES = {
    'car_lane': ('wreck.glb', 4.7, 1), 'car_kerb': ('wreck.glb', 4.7, 2), 'car_drive': ('patrol.glb', 4.7, 3),
    'wall': ('wall.glb', 6.0, 4), 'wall_corner': ('wall_corner.glb', 4.0, 5), 'wall_broken': ('wall_broken.glb', 6.0, 6),
    'shed': ('shed.glb', 3.0, 7), 'trailer': ('trailer.glb', 12.2, 8), 'dumpster': ('dumpster.glb', None, 9),
    'fence': ('fence.glb', None, 10), 'jersey': ('proc', None, 11), 'pump': ('proc', None, 12), 'steps': ('proc', None, 13),
    'dock': ('proc', None, 14), 'slot_bank': ('proc', None, 15), 'table': ('proc', None, 16), 'pillar': ('proc', None, 17),
    'outcrop': ('proc', None, 18),
    'light_lamp_house_side': ('lamp.glb', None, 19), 'light_lamp_your_side': ('lamp.glb', None, 20), 'light_oil_drum': ('proc', None, 21),
    'light_slot_glow': ('proc', None, 22),
}
FACE_FORCE = {'car_drive': ['W'], 'light_slot_glow': ['S']}                    # the patrol car shows its light bar, nose to the road or tail
for i in range(21): PIECES['rock_%d' % i] = ('proc', None, 30 + i)
for i in range(12): PIECES['rubble_%d' % i] = ('proc', None, 60 + i)


def src_of(piece):
    if piece.startswith('light_'): return piece + '.webp'
    man = json.load(open(os.path.join(SHIP, 'fight_ground.json')))
    d = man['cover'].get(piece) or man['cover_extra'][piece]
    return d['src']


def glb_of(piece):
    m = PIECES[piece][0]
    return os.path.join(MODELS, m) if m != 'proc' else os.path.join(MODELS, 'cover_%s.glb' % piece)


# ---- THE MODELS THAT HAD NONE ------------------------------------------------------------------------------------------
def rock(bpy, mathutils, P, name, m, size, loc, rnd, angular=0.4):
    """a boulder: the hull of a few random points on an ellipsoid (the faces a stone breaks along), weathered a little by
    noise, its foot sunk flat into the ground"""
    import bmesh
    n = rnd.randint(26, 40)
    pts = []
    for _ in range(n):
        u, v = rnd.uniform(-1, 1), rnd.uniform(0, 6.283); r = math.sqrt(1 - u * u)
        k = rnd.uniform(0.74, 1.0)
        pts.append((r * math.cos(v) * 0.5 * k, r * math.sin(v) * 0.5 * k, u * 0.5 * k))
    bm = bmesh.new()
    for p_ in pts: bm.verts.new(p_)
    bmesh.ops.convex_hull(bm, input=bm.verts)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=2, use_grid_fill=True)
    off = mathutils.Vector((rnd.uniform(0, 99), rnd.uniform(0, 99), rnd.uniform(0, 99)))
    for v in bm.verts:
        q = mathutils.noise.fractal(v.co * 4.0 + off, 0.6, 2.0, 4)
        v.co = v.co * (1.0 + 0.11 * q * (1.2 - angular))
        if v.co.z < -0.22: v.co.z = -0.22 + (v.co.z + 0.22) * 0.1
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    o.scale = size; bpy.ops.object.transform_apply(scale=True)
    zmin = min(v.co.z for v in o.data.vertices)
    for v in o.data.vertices: v.co.z -= zmin + 0.05
    o.location = loc; o.rotation_euler = (rnd.uniform(-0.12, 0.12), rnd.uniform(-0.12, 0.12), rnd.uniform(0, 6.3))
    o.data.materials.append(m)
    return o


def weed(bpy, P, name, m, loc, rnd, s=0.35):
    """a dead creosote tuft: a few thin dry sticks out of one point"""
    for k in range(rnd.randint(5, 9)):
        a = rnd.uniform(0, 6.3); t = rnd.uniform(0.35, 1.0)
        P.rod(bpy, '%s_%d' % (name, k), m, loc, (loc[0] + math.cos(a) * s * t * 0.7, loc[1] + math.sin(a) * s * t * 0.7, loc[2] + s * t), 0.012, 4)


def build_rocks(bpy, mathutils, P, seed, outcrop=False):
    import random
    rnd = random.Random(seed)
    kind = rnd.choice(['lime', 'lime', 'lime', 'tan', 'tan', 'sand', 'basalt'])
    role = dict(lime=('tape_grey', 1), tan=('clay_bone', 1), sand=('clay_rust', 1), basalt=('rubber', 2))[kind]
    m = P.mat(bpy, 'rock_' + kind, *role); m2 = P.mat(bpy, 'rock_varnish', 'rubber', 2); dry = P.mat(bpy, 'dry_weed', 'clay_bone', 1)
    if outcrop:
        parts = [((2.6, 2.0, 1.15), (0, 0.2, 0)), ((2.2, 1.8, 0.95), (1.9, 0.3, 0)), ((2.1, 1.9, 0.9), (-2.0, 0.25, 0)), ((1.5, 1.2, 0.6), (0.6, -0.6, 0)), ((1.0, 0.9, 0.45), (-1.3, -0.6, 0))]
    else:
        n = rnd.choice([2, 3, 3, 4, 5])
        w = rnd.uniform(1.8, 2.4); parts = [((w, w * rnd.uniform(0.75, 1.0), rnd.uniform(1.25, 1.5)), (0, 0, 0))]
        for k in range(n - 1):
            s = rnd.uniform(0.6, 1.15); a = rnd.uniform(0, 6.3); d = w * 0.36 + s * 0.22
            parts.append(((s, s * 0.85, s * rnd.uniform(0.6, 1.0)), (math.cos(a) * d, math.sin(a) * d * 0.6, 0)))
    for i, (sz, loc) in enumerate(parts):
        rock(bpy, mathutils, P, 'rock_%d' % i, m if i % 3 != 2 else m2, sz, loc, rnd, 0.25 if kind == 'lime' else 0.5)
    span = max(abs(l[0]) + sz[0] / 2 for sz, l in parts)
    for k in range(rnd.randint(4, 9)):                         # the gravel it shed, at its sides and behind, never out in front of its foot
        a = rnd.uniform(-0.3, math.pi + 0.3); d = rnd.uniform(0.75, 1.0) * span; s = rnd.uniform(0.08, 0.2)
        rock(bpy, mathutils, P, 'grit_%d' % k, m2, (s, s, s * 0.6), (math.cos(a) * d, math.sin(a) * d * 0.5, 0), rnd, 0.6)
    weed(bpy, P, 'weed', dry, (rnd.choice([-1, 1]) * span * 0.8, 0.1, 0.0), rnd, rnd.uniform(0.3, 0.5))


def build_rubble(bpy, mathutils, P, seed):
    """a block wall's or a house front's fall, 2.6 m across, 1.3 m at its top: lumps, block halves, brick, rebar"""
    import random
    rnd = random.Random(seed)
    conc, block, brick, steel, wood = (P.mat(bpy, 'concrete', 'tape_grey', 1), P.mat(bpy, 'cmu', 'tape_masking', 1), P.mat(bpy, 'brick', 'clay_rust', 1),
                                       P.mat(bpy, 'rebar', 'rubber', 1), P.mat(bpy, 'plank', 'clay_bone', 1))
    n = rnd.randint(16, 26)
    for i in range(n):
        a = rnd.uniform(0, 6.3); d = abs(rnd.gauss(0, 0.55)); x, y = math.cos(a) * d * 1.1, math.sin(a) * d * 0.7
        top = max(0.0, 1.0 - d / 1.3)
        s = rnd.uniform(0.25, 0.62) * (0.65 + top * 0.6)
        mm = rnd.choice([conc, conc, block, brick]) if i % 5 else block
        sz = (s * 0.5, s * 0.25, s * 0.25) if mm is brick else ((0.4, 0.2, 0.2) if mm is block and rnd.random() < 0.5 else (s, s * rnd.uniform(0.6, 1.0), s * rnd.uniform(0.4, 0.8)))
        P.chunk(bpy, 'lump_%d' % i, mm, sz, (x, y, top * 0.85 + sz[2] / 2), (rnd.uniform(-0.5, 0.5), rnd.uniform(-0.5, 0.5), rnd.uniform(0, 6.3)), rnd)
    P.chunk(bpy, 'slab', conc, (0.95, 0.65, 0.12), (rnd.uniform(-0.3, 0.3), 0.1, 0.75), (rnd.uniform(-0.4, 0.4), rnd.uniform(-0.3, 0.3), rnd.uniform(0, 6.3)), rnd, (0.2, 0.2, 0.02))
    for k in range(rnd.randint(2, 5)):
        x, y = rnd.uniform(-0.6, 0.6), rnd.uniform(-0.3, 0.3); a = rnd.uniform(0, 6.3); L = rnd.uniform(0.6, 1.3)
        P.rod(bpy, 'rebar_%d' % k, steel, (x, y, 0.6), (x + math.cos(a) * L * 0.6, y + math.sin(a) * L * 0.4, 0.6 + L * rnd.uniform(0.2, 0.8)), 0.014, 6)
    if rnd.random() < 0.6:
        P.box(bpy, 'plank', wood, (1.6, 0.18, 0.04), (rnd.uniform(-0.4, 0.4), -0.3, 0.55), (rnd.uniform(-0.3, 0.3), rnd.uniform(-0.4, 0.4), rnd.uniform(0, 6.3)))
    odd = seed % 4                                             # the one odd thing in each: what the wall fell on
    if odd == 0: P.cyl(bpy, 'tyre', P.mat(bpy, 'tyre', 'rubber', 1), 0.32, 0.2, (0.8, -0.55, 0.12), (math.radians(80), 0, 0.4), verts=16)
    elif odd == 1: P.cyl(bpy, 'bucket', P.mat(bpy, 'bucket', 'clay_mustard', 2), 0.15, 0.32, (-0.9, -0.7, 0.16), verts=12)
    elif odd == 2: P.box(bpy, 'frame', P.mat(bpy, 'frame', 'clay_bone', 3), (0.5, 0.03, 0.4), (0.5, -0.8, 0.12), (math.radians(70), 0, -0.4))


def build_proc(piece, bpy, mathutils, P):
    import random
    seed = PIECES[piece][2]; rnd = random.Random(seed)
    if piece.startswith('rock_'): return build_rocks(bpy, mathutils, P, seed)
    if piece == 'outcrop': return build_rocks(bpy, mathutils, P, seed, outcrop=True)
    if piece.startswith('rubble_'): return build_rubble(bpy, mathutils, P, seed)
    grey, dark, rust = P.mat(bpy, 'concrete', 'tape_grey', 2), P.mat(bpy, 'steel', 'tape_grey', 1), P.mat(bpy, 'rust', 'clay_rust', 1)
    if piece == 'jersey':
        for k, x in enumerate((-1.6, 1.6)):
            P.import_model(bpy, os.path.join(MODELS, 'barrier.glb'), (x, 0, 0), (0, 0, 0))
        return
    if piece == 'pump':
        P.box(bpy, 'island', grey, (1.5, 0.75, 0.16), (0, 0, 0.08), bevel=0.03)
        body = P.mat(bpy, 'pump_paint', 'clay_teal', 2)
        P.box(bpy, 'body', body, (0.82, 0.5, 1.45), (0, 0, 0.16 + 0.725), bevel=0.02)
        P.box(bpy, 'head', P.mat(bpy, 'head', 'clay_bone', 3), (0.86, 0.54, 0.34), (0, 0, 1.78), bevel=0.02)
        P.box(bpy, 'window', P.mat(bpy, 'dead_glass', 'glass_eye', 0), (0.5, 0.02, 0.2), (0, -0.28, 1.25))
        P.box(bpy, 'holster', dark, (0.12, 0.1, 0.2), (0.33, -0.3, 0.95))
        hose = P.mat(bpy, 'hose', 'rubber', 1)
        P.rod(bpy, 'hose_a', hose, (0.33, -0.3, 1.05), (0.45, -0.45, 0.4), 0.025, 6)
        P.rod(bpy, 'hose_b', hose, (0.45, -0.45, 0.4), (0.62, -0.62, 0.17), 0.025, 6)       # cut short: somebody took the rest
        return
    if piece == 'steps':
        for k in range(3):
            P.box(bpy, 'tread_%d' % k, grey, (4.6, 0.36 * (3 - k), 0.2), (0, 0.18 * k, 0.1 + 0.2 * k), bevel=0.015)
        for x in (-2.1, 2.1):
            P.rod(bpy, 'post_%d' % (x > 0), dark, (x, -0.2, 0.2), (x, -0.2, 1.1), 0.025, 8)
            P.rod(bpy, 'rail_%d' % (x > 0), dark, (x, -0.2, 1.1), (x, 0.9, 1.5), 0.025, 8)
        return
    if piece == 'dock':
        P.box(bpy, 'deck', grey, (10.6, 2.6, 1.2), (0, 0, 0.6), bevel=0.02)
        P.box(bpy, 'nosing', dark, (10.6, 0.08, 0.1), (0, -1.3, 1.17))
        bump = P.mat(bpy, 'bumper', 'rubber', 1)
        for x in (-3.6, 0.0, 3.6): P.box(bpy, 'bumper_%g' % x, bump, (0.3, 0.12, 0.5), (x, -1.36, 0.8))
        pal = P.mat(bpy, 'pallet', 'clay_bone', 2)
        for k in range(5): P.box(bpy, 'pallet_%d' % k, pal, (1.2, 0.1, 0.02), (2.2, 0.2 + k * 0.24 - 0.48, 1.33), (0, 0, 0.2))
        for k in range(3): P.box(bpy, 'pallet_b%d' % k, pal, (1.2, 0.1, 0.1), (2.2, 0.2 + k * 0.45 - 0.45, 1.26), (0, 0, 0.2 + math.pi / 2))
        P.box(bpy, 'stain', P.mat(bpy, 'oil', 'rubber', 2), (1.6, 0.9, 0.004), (-2.5, 0.0, 1.201))
        return
    if piece == 'slot_bank':
        carpet = P.mat(bpy, 'carpet', 'clay_rust', 1)
        P.box(bpy, 'plinth', carpet, (6.6, 1.0, 0.12), (0, 0, 0.06))
        cab = P.mat(bpy, 'cabinet', 'cloth_black', 3); top = P.mat(bpy, 'topper', 'clay_mustard', 2); glass = P.mat(bpy, 'screen', 'glass_eye', 0)
        lit = P.mat(bpy, 'screen_lit', 'clay_teal', 3, glow=0.6)
        for k in range(7):
            x = -2.7 + k * 0.9
            P.box(bpy, 'cab_%d' % k, cab, (0.76, 0.62, 1.2), (x, 0.05, 0.72), bevel=0.02)
            P.box(bpy, 'top_%d' % k, top if k % 3 else cab, (0.74, 0.5, 0.42), (x, 0.12, 1.53), bevel=0.02)
            P.box(bpy, 'glass_%d' % k, lit if k == 4 else glass, (0.56, 0.02, 0.42), (x, -0.27, 1.02), (math.radians(-12), 0, 0))
            P.box(bpy, 'deck_%d' % k, cab, (0.7, 0.25, 0.06), (x, -0.35, 0.8))
        return
    if piece == 'table':
        felt, rail, base = P.mat(bpy, 'felt', 'metal_painted', 1), P.mat(bpy, 'rail', 'clay_rust', 1), P.mat(bpy, 'base', 'cloth_black', 2)
        P.box(bpy, 'base', base, (2.0, 0.8, 0.78), (0, 0, 0.39))
        P.box(bpy, 'top', felt, (2.8, 1.4, 0.08), (0, 0, 0.82), bevel=0.02)
        for (sx, sy, x, y) in ((2.9, 0.1, 0, -0.72), (2.9, 0.1, 0, 0.72), (0.1, 1.5, -1.45, 0), (0.1, 1.5, 1.45, 0)):
            P.box(bpy, 'rail_%g_%g' % (x, y), rail, (sx, sy, 0.12), (x, y, 0.88), bevel=0.02)
        P.box(bpy, 'worn', P.mat(bpy, 'board', 'clay_bone', 2), (0.6, 0.4, 0.004), (0.4, -0.1, 0.861))
        chair = P.mat(bpy, 'chair', 'clay_rust', 2)                 # the chair on its back
        P.box(bpy, 'chair_seat', chair, (0.48, 0.48, 0.08), (-0.6, -1.25, 0.25), (math.radians(80), 0, 0.3))
        P.box(bpy, 'chair_back', chair, (0.48, 0.08, 0.6), (-0.65, -1.6, 0.05), (math.radians(80), 0, 0.3))
        return
    if piece == 'pillar':
        P.chunk(bpy, 'column', grey, (1.8, 1.8, 3.6), (0, 0, 1.8), (0, 0, 0), rnd, (0.01, 0.01, 0.002))
        P.box(bpy, 'band', P.mat(bpy, 'old_paint', 'clay_mustard', 1), (1.82, 1.82, 0.5), (0, 0, 1.2))
        for k in range(6):
            P.chunk(bpy, 'fallen_%d' % k, grey, (0.25, 0.2, 0.15), (rnd.uniform(-1.2, 1.2), -1.15 - rnd.uniform(0, 0.4), 0.07), (0, 0, rnd.uniform(0, 6)), rnd)
        steel = P.mat(bpy, 'rebar', 'rubber', 1)
        for k in range(3): P.rod(bpy, 'rebar_%d' % k, steel, (0.75 - k * 0.1, -0.92, 0.2), (0.82 - k * 0.12, -0.95, 1.0), 0.016, 6)
        return
    if piece == 'light_slot_glow':
        # a slot machine's screen still lit in the dark casino: the bezel, the glass, one band of it dead
        P.box(bpy, 'bezel', P.mat(bpy, 'bezel', 'cloth_black', 2), (0.62, 0.08, 0.36), (0, 0, 0.18), bevel=0.01)
        P.box(bpy, 'screen', P.mat(bpy, 'screen_lit', 'clay_teal', 3, glow=1.6), (0.52, 0.02, 0.26), (0, -0.045, 0.18))
        P.box(bpy, 'dead_band', P.mat(bpy, 'screen_dead', 'glass_eye', 0), (0.52, 0.022, 0.04), (0, -0.047, 0.11))
        return
    if piece == 'light_oil_drum':
        P.import_model(bpy, os.path.join(MODELS, 'oil_drum.glb'), (0, 0, 0), (0, 0, 0))
        fire = P.mat(bpy, 'fire', 'sodium', 3, glow=4.0); ember = P.mat(bpy, 'ember', 'clay_rust', 2, glow=2.0)
        top = max(o.matrix_world.translation.z + o.dimensions.z / 2 for o in bpy.context.scene.objects if o.type == 'MESH')
        for k in range(5):
            a = k / 5 * 6.28; s = rnd.uniform(0.12, 0.22)
            bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=s, depth=s * 2.6, location=(math.cos(a) * 0.12, math.sin(a) * 0.12, top + s * 1.1))
            P.put(bpy, bpy.context.active_object, 'flame_%d' % k, fire if k % 2 == 0 else ember, smooth=False)
        return
    raise KeyError(piece)


def model(piece):
    import bpy, mathutils
    import bohemia_cook_model_props as P
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build_proc(piece, bpy, mathutils, P)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    out = glb_of(piece); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    print('  model', piece, d, '->', os.path.relpath(out, R), flush=True)
    return d


def rig(piece):
    """the master rig's own render and post, in this process, with the grime pass on the light"""
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    glb = glb_of(piece); real = PIECES[piece][1]
    out = os.path.join(OUT, piece); os.makedirs(out, exist_ok=True)
    argv = [glb, out, '--ppm', repr(PPM), '--no-calibration', '--no-id-pass', '--seed', str(PIECES[piece][2])]
    if real: argv += ['--real-length', str(real)]
    else:
        lo_hi = json.load(open(os.path.join(OUT, 'dims.json'))).get(piece) if os.path.exists(os.path.join(OUT, 'dims.json')) else None
        argv += ['--real-length', str(max(lo_hi[0], lo_hi[1])) if lo_hi else '0']
    sys.argv = ['rig'] + argv
    A = RIG.args()
    if not A['real_len']: A['real_len'] = 0.0
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=PIECES[piece][2] % 97, bid=piece)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post(list(stills), out, A, pop, shadow=A['shadow'])
    meta.update(model=os.path.relpath(glb, R), ppm=A['ppm'], files=[os.path.relpath(o, R) for o in outs], crop_box_px=box, grime=NF.LEDGER.get('grime'))
    json.dump(meta, open(os.path.join(out, 'rig.json'), 'w'), indent=1, default=str)
    print('  rig', piece, 'box', box, flush=True)


def measure_glb(piece):
    """the size of an existing glb, for the rig's real length (as built: the modeller made it in metres)"""
    import bpy
    import bohemia_cook_model_props as P
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=glb_of(piece))
    for o in list(bpy.context.scene.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
    return P.dims(bpy)


# ---- THE CUT: into the old picture's canvas, on its foot ----------------------------------------------------------------
def body_mask(a):
    """an old picture's thing without its painted drop shadow (the shadow is dark and grey; the thing has light in it)"""
    al = a[..., 3] > 40
    lum = a[..., :3].astype(float) @ [0.299, 0.587, 0.114]
    return al & (lum > 48) if (al & (lum > 48)).sum() > al.sum() * 0.3 else al


def cut(piece):
    from PIL import Image
    FACE = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    src = src_of(piece)
    old_path = os.path.join(OUT, 'orig', src)
    if not os.path.exists(old_path):
        os.makedirs(os.path.dirname(old_path), exist_ok=True)
        open(old_path, 'wb').write(subprocess.check_output(['git', 'show', '%s:slices/fight_ground/%s' % (BASE_SHA, src)], cwd=R))
    old = np.asarray(Image.open(old_path).convert('RGBA'))
    H, W = old.shape[:2]
    om = body_mask(old); ys, xs = np.nonzero(om)
    ox0, oy0, ox1, oy1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    best = None
    for f in FACE_FORCE.get(piece, FACE):
        fn = os.path.join(OUT, piece, 'rig_%s.png' % f)
        if not os.path.exists(fn): continue
        b = np.asarray(Image.open(fn).convert('RGBA'))
        bm = b[..., 3] > 0; ys2, xs2 = np.nonzero(bm)
        if not len(ys2): continue
        bx0, by0, bx1, by1 = xs2.min(), ys2.min(), xs2.max() + 1, ys2.max() + 1
        # seat: the body's foot centre on the old body's foot centre
        dx = int(round((ox0 + ox1) / 2 - (bx0 + bx1) / 2)); dy = int(oy1 - by1)
        canvas = np.zeros((H, W), bool)
        y0, x0 = max(0, dy), max(0, dx); y1, x1 = min(H, dy + b.shape[0]), min(W, dx + b.shape[1])
        if y1 > y0 and x1 > x0: canvas[y0:y1, x0:x1] = bm[y0 - dy:y1 - dy, x0 - dx:x1 - dx]
        iou = (canvas & om).sum() / max(1, (canvas | om).sum())
        lost = 1 - canvas.sum() / max(1, bm.sum())
        score = iou - lost * 0.5
        if best is None or score > best[0]: best = (score, f, dx, dy, iou, lost)
    score, f, dx, dy, iou, lost = best
    body = Image.open(os.path.join(OUT, piece, 'rig_%s.png' % f)).convert('RGBA')
    shp = os.path.join(OUT, piece, 'shadow_%s.png' % f)
    layer = Image.open(shp).convert('RGBA') if os.path.exists(shp) else Image.new('RGBA', body.size)
    layer.alpha_composite(body)
    out = Image.new('RGBA', (W, H)); out.alpha_composite(layer, dest=(0, 0), source=(0, 0)) if False else None
    big = Image.new('RGBA', (W + 2 * layer.width, H + 2 * layer.height))
    big.alpha_composite(layer, (dx + layer.width, dy + layer.height))
    out = big.crop((layer.width, layer.height, layer.width + W, layer.height + H))
    dst = os.path.join(SHIP, src)
    out.save(dst, lossless=True, quality=100, method=6)
    import hashlib
    rec = dict(piece=piece, file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), size=[W, H], facing=f, iou_with_old=round(float(iou), 3), clipped=round(float(lost), 3),
               model=os.path.relpath(glb_of(piece), R), rig=os.path.relpath(os.path.join(OUT, piece, 'rig.json'), R))
    led = os.path.join(OUT, 'swapped.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L[piece] = rec; json.dump(L, open(led, 'w'), indent=1)
    print('  cut', piece, rec, flush=True)
    return rec


def sub(cmd, piece):
    r = subprocess.run([VENV, os.path.abspath(__file__), cmd, piece], cwd=R, capture_output=True, text=True)
    lines = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l]
    print('\n'.join(lines[-6:]), flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd, names = a[0], a[1:]
    if cmd == 'model': model(names[0])
    elif cmd == 'measure':
        d = measure_glb(names[0]); dp = os.path.join(OUT, 'dims.json'); os.makedirs(OUT, exist_ok=True)
        D = json.load(open(dp)) if os.path.exists(dp) else {}; D[names[0]] = d; json.dump(D, open(dp, 'w'), indent=1); print('  measure', names[0], d, flush=True)
    elif cmd == 'rig': rig(names[0])
    elif cmd == 'cut':
        for p in names or list(PIECES): cut(p)
    elif cmd == 'all':
        for p in names or list(PIECES):
            if PIECES[p][0] == 'proc': sub('model', p)
            if not PIECES[p][1]: sub('measure', p)
            sub('rig', p)
            try: cut(p)
            except Exception as e: print('  cut failed', p, e, flush=True)
    sys.stdout.flush(); os._exit(0)
