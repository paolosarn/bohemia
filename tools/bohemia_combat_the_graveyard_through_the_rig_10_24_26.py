#!/usr/bin/env python3
"""BOHEMIA -- COMBAT [ghosts and apparitions]: OUR GRAVEYARD, THROUGH THE RIG (10/24/26).
Rule 134(a) (Paolo 10/23: 'like in Battle Brothers, one of the enemies are ghosts and apparitions; I think we can put that
in, it fits our world too good'): 'a place full of them is our graveyard'. 134(e): in act one the ghosts are the
Amalgamation's haunting as act one sees it, the dead who came back; nobody knows it is a machine.

THE PLACE: a city cemetery after the water stopped. The lawn died with the sprinklers the month the dollar died, the
creosote came back between the rows, and the newest graves are dug by hand. The fight deals it on the valley's open scrub
(slices/fight_ground's own scrub blocks) and lays these pieces over it (BOHEMIA_FIGHT.html, the graveyard's field), each a
fight cover piece the way COOK's slot bank is seven machines in one: one piece, one tile's worth of cover.

  grave_row_0..3   a row of headstones, 9 m long, the way a cemetery lays a section: upright tablets with round and
                   square tops, a Latin cross, a slant marker, a flat marker in the dirt, granite and marble and the cheap
                   cast stone, each on its own base, leaning the way stones lean when the ground under them dried out.
                   ONE ODD THING A ROW: a laminated photograph screwed to one stone, bleached to a blank pale oval by the
                   sun (the dead's own face gone: the data-portrait act one cannot read, 134(e), never said); a stone
                   fallen face down; a coffee can of faded plastic flowers; a stone snapped at its base, its top beside it.
  grave_fresh_0..1 the new dead: a hand-dug mound of desert dirt, 2.2 m, a cross of two scrap boards and wire, a
                   laminated photo zip-tied to it, a bottle of water left for him (the valley's own offering).
  mausoleum        a family crypt, granite blocks, a pediment on two columns, 3.2 x 4.2 m and 3 m high, the bronze door
                   standing open on the dark (the odd thing), the name band empty; it blocks a step.
  obelisk          a 2.4 m granite obelisk on its plinth, the old family's, the tallest thing on the field.

THEN the master rig (tools/bohemia_direction_master_rig.py, imported, never edited) with COOK's grime pass (tools/
bohemia_cook_the_floor_not_final_10_20_26.py) at the fight's own 42.9 px a metre; the S facing, the camera on the side the
stones, the crypt's door and the photographs face; the body over its own contact shadow, cut to its
own box, written to slices/fight_ghosts/ with the fight's piece table slices/fight_ghosts/graveyard.json (the fight's file,
COMBAT's; nothing in slices/fight_ground is touched).

  <venv>/bin/python tools/bohemia_combat_the_graveyard_through_the_rig_10_24_26.py all [piece ...]
  (venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow; the floor tool's own line)

REFERENCE CHECK (the 9/4 standing duty): the fight's own cover pieces (cover_wall, cover_rock_*) are the twins: the same
rig, the same scale, the same light. Real sizes: an upright headstone 0.6 to 1.1 m on a 0.15 m base, a section row 1.3 m
stone to stone, a slant marker 0.5 m, a crypt 3 x 4 m; Woodlawn Cemetery, Las Vegas (1914), granite and marble; the
Mexican offering of water at a fresh grave. No reference game.
REUSE CHECK (REUSE-FIRST): COOK's props modeller (mat, box, cyl, rod, chunk, put, dims), COOK's cover tool's rig call and
its cut (the body over its shadow), the master rig's render and post, the floor tool's grime pass; COMBAT TWO's scrub blocks.
TASTE CHECK: the rig is the look (rule 115); analog horror at the source (the bleached photographs, the open door).
"""
import os, sys, json, math, subprocess, random
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/fight_ghosts')
OUT = os.path.join(R, 'records/target/combat_graveyard_rig')
MODELS = os.path.join(R, 'reference/models/bohemia')
PPM = 515 / 12.0
VENV = os.environ.get('BOHEMIA_BPY', '/home/user/v/bin/python')

# piece -> (real length m, seed, cover kind, height m, blocks a step, its name on the board)
PIECES = {
    'grave_row_0': (9.0, 101, 'COVER', 1.1, False, 'A ROW OF GRAVES'),
    'grave_row_1': (9.0, 102, 'COVER', 1.1, False, 'A ROW OF GRAVES'),
    'grave_row_2': (9.0, 103, 'COVER', 1.1, False, 'A ROW OF GRAVES'),
    'grave_row_3': (9.0, 104, 'COVER', 1.1, False, 'A ROW OF GRAVES'),
    'grave_fresh_0': (2.4, 111, 'LOW_COVER', 1.2, False, 'A FRESH GRAVE'),
    'grave_fresh_1': (2.4, 112, 'LOW_COVER', 1.2, False, 'A FRESH GRAVE'),
    'mausoleum': (4.4, 121, 'COVER', 3.0, True, 'THE CRYPT'),
    'obelisk': (1.2, 131, 'COVER', 2.4, False, 'THE OBELISK'),
}


def glb_of(piece): return os.path.join(MODELS, 'graveyard_%s.glb' % piece)


# ---- THE MODELS ------------------------------------------------------------------------------------------------------
def stone_mats(bpy, P):
    return dict(granite=P.mat(bpy, 'granite_grey', 'tape_grey', 1), marble=P.mat(bpy, 'marble', 'clay_bone', 3),
                cast=P.mat(bpy, 'cast_stone', 'tape_masking', 2), black=P.mat(bpy, 'granite_black', 'rubber', 2),
                base=P.mat(bpy, 'base_concrete', 'tape_grey', 2), dirt=P.mat(bpy, 'desert_dirt', 'clay_bone', 1))


def tablet(bpy, P, name, m, mb, x, y, w, h, d, top, lean, turn):
    """an upright tablet on its base: a square top, a round top (a half cylinder on the slab), or a gabled top"""
    import mathutils
    objs = [P.box(bpy, name + '_base', mb, (w + 0.16, d + 0.16, 0.14), (x, y, 0.07), bevel=0.01)]
    body_h = h - (w / 2 if top == 'round' else 0.0)
    objs.append(P.box(bpy, name + '_slab', m, (w, d, body_h), (x, y, 0.14 + body_h / 2), bevel=0.012))
    if top == 'round':
        objs.append(P.cyl(bpy, name + '_top', m, w / 2, d, (x, y, 0.14 + body_h), (math.pi / 2, 0, 0), verts=20))
    elif top == 'gable':
        bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=w * 0.72, depth=w * 0.32, location=(x, y, 0.14 + body_h + w * 0.16), rotation=(0, 0, math.pi / 4))
        o = bpy.context.active_object; o.scale = (1.0, d / (w * 1.0), 1.0); P.put(bpy, o, name + '_gable', m, smooth=False); objs.append(o)
    # the stone leans the way it settled when the ground under it dried: a turn about its own foot
    for o in objs[1:]:
        o.rotation_mode = 'XYZ'
        piv = mathutils.Vector((x, y, 0.14))
        mat = mathutils.Matrix.Translation(piv) @ mathutils.Matrix.Rotation(lean, 4, 'X') @ mathutils.Matrix.Rotation(turn, 4, 'Z') @ mathutils.Matrix.Translation(-piv)
        o.matrix_world = mat @ o.matrix_world
    return objs[1]


def cross(bpy, P, name, m, mb, x, y, h):
    P.box(bpy, name + '_base', mb, (0.55, 0.4, 0.2), (x, y, 0.1), bevel=0.01)
    P.box(bpy, name + '_step', mb, (0.38, 0.28, 0.14), (x, y, 0.27), bevel=0.01)
    P.box(bpy, name + '_post', m, (0.12, 0.12, h), (x, y, 0.34 + h / 2), bevel=0.008)
    P.box(bpy, name + '_arm', m, (0.5, 0.12, 0.12), (x, y, 0.34 + h * 0.7), bevel=0.008)


def grave_row(bpy, mathutils, P, seed):
    rnd = random.Random(seed); M = stone_mats(bpy, P)
    n = 7; span = 9.0; xs = [-span / 2 + 0.6 + i * (span - 1.2) / (n - 1) for i in range(n)]
    odd = seed % 4
    kinds = ['round', 'square', 'cross', 'slant', 'round', 'flat', 'gable']; rnd.shuffle(kinds)
    for i, x in enumerate(xs):
        y = rnd.uniform(-0.12, 0.12); k = kinds[i]
        m = rnd.choice([M['granite'], M['granite'], M['marble'], M['cast'], M['black']])
        if odd == 1 and i == 3:   # the stone fallen face down: its slab flat on the dirt in front of its base
            P.box(bpy, 'fallen_base', M['base'], (0.78, 0.36, 0.14), (x, y, 0.07), bevel=0.01)
            P.box(bpy, 'fallen_slab', m, (0.62, 0.92, 0.16), (x + 0.05, y - 0.62, 0.08), (0, 0, rnd.uniform(-0.2, 0.2)), bevel=0.012)
            continue
        if odd == 3 and i == 2:   # snapped at its foot, the top half beside it
            P.box(bpy, 'snap_base', M['base'], (0.8, 0.36, 0.14), (x, y, 0.07), bevel=0.01)
            P.chunk(bpy, 'snap_stub', m, (0.64, 0.18, 0.32), (x, y, 0.3), (0, 0, 0), rnd, (0.05, 0.02, 0.18))
            P.chunk(bpy, 'snap_top', m, (0.64, 0.18, 0.5), (x + 0.55, y - 0.45, 0.1), (math.radians(78), 0, 0.5), rnd, (0.05, 0.02, 0.12))
            continue
        if k == 'cross': cross(bpy, P, 'cross_%d' % i, m, M['base'], x, y, rnd.uniform(0.75, 0.95)); continue
        if k == 'slant':
            P.box(bpy, 'slant_%d_base' % i, M['base'], (0.8, 0.5, 0.12), (x, y, 0.06), bevel=0.01)
            P.box(bpy, 'slant_%d' % i, m, (0.66, 0.34, 0.42), (x, y, 0.32), (math.radians(-18), 0, 0), bevel=0.012); continue
        if k == 'flat':
            P.box(bpy, 'flat_%d' % i, m, (0.6, 0.32, 0.08), (x, y - 0.1, 0.04), (math.radians(-3), 0, 0), bevel=0.01); continue
        w, h = rnd.uniform(0.55, 0.78), rnd.uniform(0.62, 1.05)
        s = tablet(bpy, P, 'stone_%d' % i, m, M['base'], x, y, w, h, rnd.uniform(0.14, 0.2), k, rnd.uniform(-0.09, 0.07), rnd.uniform(-0.12, 0.12))
        if odd == 0 and i == 4:   # the laminated photograph on its face, bleached to a blank pale oval (the dead's face gone)
            ph = P.mat(bpy, 'photo_bleached', 'clay_bone', 4)
            bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.1, depth=0.012, location=(x, y - 0.105, 0.14 + h * 0.62), rotation=(math.pi / 2, 0, 0))
            o = bpy.context.active_object; o.scale = (0.8, 1.0, 1.0); P.put(bpy, o, 'photo', ph)
            P.cyl(bpy, 'photo_frame', P.mat(bpy, 'frame_tin', 'chrome', 0), 0.115, 0.008, (x, y - 0.1, 0.14 + h * 0.62), (math.pi / 2, 0, 0), verts=24)
    if odd == 2:   # a coffee can of faded plastic flowers at the foot of the middle stone
        can = P.mat(bpy, 'can_rust', 'clay_rust', 2); fl = [P.mat(bpy, 'flower_%d' % j, r, 3) for j, r in enumerate(('clay_rust', 'clay_mustard', 'clay_bone'))]
        cx_ = xs[3]; P.cyl(bpy, 'can', can, 0.07, 0.17, (cx_ + 0.25, -0.38, 0.085), verts=12)
        for j in range(7):
            a = rnd.uniform(0, 6.3); t = rnd.uniform(0.15, 0.32)
            P.rod(bpy, 'stem_%d' % j, P.mat(bpy, 'stem', 'metal_painted', 1), (cx_ + 0.25, -0.38, 0.16), (cx_ + 0.25 + math.cos(a) * 0.08, -0.38 + math.sin(a) * 0.06, 0.16 + t), 0.006, 4)
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(cx_ + 0.25 + math.cos(a) * 0.08, -0.38 + math.sin(a) * 0.06, 0.16 + t), segments=8, ring_count=5)
            P.put(bpy, bpy.context.active_object, 'bloom_%d' % j, fl[j % 3])


def grave_fresh(bpy, mathutils, P, seed):
    rnd = random.Random(seed); M = stone_mats(bpy, P)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, location=(0, 0, 0), segments=24, ring_count=12)
    mo = bpy.context.active_object
    for v in mo.data.vertices:
        c = v.co; j = 1.0 + rnd.uniform(-0.05, 0.05)
        v.co = (c.x * 1.08 * j, c.y * 0.48 * j, max(0.0, c.z * 0.46 * j))   # heaped: the coffin's room of earth on top
    dug = P.mat(bpy, 'dug_dirt', 'clay_rust', 1)   # turned earth, damp under the crust: darker and redder than the floor it came out of
    for v in mo.data.vertices:   # a mound shovelled, not a stone: knocked about all over
        v.co.z += 0.05 * math.sin(v.co.x * 9.0 + seed) * math.cos(v.co.y * 11.0 - seed) * (1 if v.co.z > 0.02 else 0)
    P.put(bpy, mo, 'mound', dug, smooth=False)
    for k in range(14):
        a_ = rnd.uniform(0, 6.3); dd = rnd.uniform(0.6, 1.25)
        P.chunk(bpy, 'clod_%d' % k, dug, (0.12, 0.1, 0.07), (math.cos(a_) * dd * 1.05, math.sin(a_) * dd * 0.55, 0.03), (0, 0, rnd.uniform(0, 6)), rnd)
    wood = P.mat(bpy, 'scrap_board', 'clay_rust', 1)
    P.box(bpy, 'cross_post', wood, (0.09, 0.04, 1.15), (-0.95, 0, 0.55), (0, rnd.uniform(-0.08, 0.08), 0))
    P.box(bpy, 'cross_arm', wood, (0.5, 0.04, 0.08), (-0.95, -0.02, 0.86), (0, rnd.uniform(-0.12, 0.12), 0))
    P.rod(bpy, 'wire', P.mat(bpy, 'wire', 'rubber', 2), (-1.02, -0.03, 0.82), (-0.88, -0.03, 0.9), 0.006, 4)
    ph = P.mat(bpy, 'photo_new', 'clay_bone', 4)
    P.box(bpy, 'photo', ph, (0.1, 0.006, 0.13), (-0.95, -0.03, 0.66))
    P.cyl(bpy, 'water', P.mat(bpy, 'bottle', 'glass_eye', 1), 0.035, 0.24, (-0.6, -0.35, 0.12), verts=12)
    if seed % 2:   # a candle in a jar, burnt down
        P.cyl(bpy, 'jar', P.mat(bpy, 'jar', 'glass_eye', 1), 0.05, 0.18, (0.2, -0.42, 0.09), verts=12)
        P.cyl(bpy, 'wax', P.mat(bpy, 'wax', 'clay_bone', 3), 0.045, 0.05, (0.2, -0.42, 0.025), verts=12)


def mausoleum(bpy, mathutils, P, seed):
    rnd = random.Random(seed); M = stone_mats(bpy, P)
    g = M['granite']; dark = P.mat(bpy, 'crypt_dark', 'cloth_black', 0); bronze = P.mat(bpy, 'bronze', 'clay_mustard', 1)
    P.box(bpy, 'plinth', M['base'], (3.6, 4.6, 0.3), (0, 0, 0.15), bevel=0.02)
    for k in range(2): P.box(bpy, 'step_%d' % k, M['base'], (2.0, 0.35, 0.15), (0, -2.45 - 0.3 * k + 0.3, 0.075 + 0.15 * (1 - k)), bevel=0.01)
    P.box(bpy, 'walls', g, (3.0, 3.6, 2.3), (0, 0.4, 0.3 + 1.15), bevel=0.02)
    for y in (0.95, 1.55, 2.15): P.box(bpy, 'course_%g' % y, P.mat(bpy, 'joint', 'tape_grey', 0), (3.02, 3.62, 0.02), (0, 0.4, y))
    P.box(bpy, 'cornice', g, (3.4, 4.0, 0.22), (0, 0.35, 2.71), bevel=0.02)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=2.3, depth=0.55, location=(0, 0.35, 3.1), rotation=(0, 0, math.pi / 4))
    o = bpy.context.active_object; o.scale = (1.0, 1.25, 1.0); P.put(bpy, o, 'roof', g, smooth=False)
    for x in (-1.05, 1.05): P.cyl(bpy, 'column_%g' % x, M['marble'], 0.17, 2.3, (x, -1.55, 0.3 + 1.15), verts=16)
    P.box(bpy, 'portico', g, (3.0, 0.7, 0.25), (0, -1.55, 2.58), bevel=0.02)
    P.box(bpy, 'name_band', M['marble'], (1.8, 0.03, 0.26), (0, -1.92, 2.58))   # the name band, empty
    P.box(bpy, 'doorway', dark, (1.0, 0.05, 1.75), (0, -1.38, 0.3 + 0.875))
    # the bronze door standing open on the dark (the odd thing): swung out on its left hinge
    d = P.box(bpy, 'door', bronze, (0.98, 0.06, 1.72), (-0.5 + 0.49 * math.cos(1.1), -1.4 - 0.49 * math.sin(1.1), 0.3 + 0.86), (0, 0, -1.1), bevel=0.01)
    for k in range(5): P.chunk(bpy, 'leaf_%d' % k, M['dirt'], (0.2, 0.15, 0.03), (rnd.uniform(-0.6, 0.6), -2.2 + rnd.uniform(-0.2, 0.2), 0.32), (0, 0, rnd.uniform(0, 6)), rnd)


def obelisk(bpy, mathutils, P, seed):
    M = stone_mats(bpy, P); g = M['black']
    P.box(bpy, 'plinth', M['base'], (1.2, 1.2, 0.3), (0, 0, 0.15), bevel=0.02)
    P.box(bpy, 'die', g, (0.8, 0.8, 0.6), (0, 0, 0.6), bevel=0.02)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.42, radius2=0.26, depth=1.3, location=(0, 0, 0.9 + 0.65), rotation=(0, 0, math.pi / 4))
    P.put(bpy, bpy.context.active_object, 'shaft', g, smooth=False)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.26, depth=0.22, location=(0, 0, 2.2 + 0.11), rotation=(0, 0, math.pi / 4))
    P.put(bpy, bpy.context.active_object, 'tip', g, smooth=False)


def build(piece, bpy, mathutils, P):
    seed = PIECES[piece][1]
    if piece.startswith('grave_row_'): return grave_row(bpy, mathutils, P, seed)
    if piece.startswith('grave_fresh_'): return grave_fresh(bpy, mathutils, P, seed)
    if piece == 'mausoleum': return mausoleum(bpy, mathutils, P, seed)
    if piece == 'obelisk': return obelisk(bpy, mathutils, P, seed)
    raise KeyError(piece)


def model(piece):
    import bpy, mathutils
    import bohemia_cook_model_props as P
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(piece, bpy, mathutils, P)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    out = glb_of(piece); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    print('  model', piece, d, '->', os.path.relpath(out, R), flush=True)


def rig(piece):
    """the master rig's own render and post (COOK's cover tool's call, this lane's pieces), the grime pass on the light"""
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    out = os.path.join(OUT, piece); os.makedirs(out, exist_ok=True)
    sys.argv = ['rig', glb_of(piece), out, '--ppm', repr(PPM), '--no-calibration', '--no-id-pass', '--seed', str(PIECES[piece][1]), '--real-length', str(PIECES[piece][0])]
    A = RIG.args()
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=PIECES[piece][1] % 97, bid=piece)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post(list(stills), out, A, pop, shadow=A['shadow'])
    meta.update(model=os.path.relpath(glb_of(piece), R), ppm=A['ppm'], files=[os.path.relpath(o, R) for o in outs], crop_box_px=box, grime=NF.LEDGER.get('grime'))
    json.dump(meta, open(os.path.join(out, 'rig.json'), 'w'), indent=1, default=str)
    print('  rig', piece, 'box', box, flush=True)


def stone_shadows(a):
    """THE RIG'S CONTACT SHADOW, ONE A STONE: the master rig lays one oval at a sprite's lowest band (post(), its own formula:
    the foot band's width x 1.25 across, 0.38 of that high, a two-pixel soft edge, the guide's shadow_alpha_max), built for one
    thing; a row of graves is seven things, and its one oval fell under one stone (rows 0, 2) or swallowed the row (1, 3).
    Here the same oval, the same numbers, under each stone the body holds (each piece of the opaque body on its own)."""
    from scipy import ndimage
    G = json.load(open(os.path.join(R, 'records/target/BOHEMIA_STYLE_GUIDE.json')))
    amax = float(G['rig']['shadow_alpha_max'])   # the guide's rig block, the number post() reads
    op = a[..., 3] > 0
    lab, n = ndimage.label(op, structure=np.ones((3, 3)))
    sh = np.zeros(op.shape)
    yy, xx = np.mgrid[0:op.shape[0], 0:op.shape[1]]
    for k in range(1, n + 1):
        ys, xs = np.nonzero(lab == k)
        if len(ys) < 12: continue
        foot = ys.max(); band = ys >= foot - max(2, int((foot - ys.min()) * 0.12))
        x0, x1 = xs[band].min(), xs[band].max(); cx = (x0 + x1) / 2 + 2; rx = max(4.0, (x1 - x0) / 2 * 1.25); ry = max(2.0, rx * 0.38); cy = foot - ry * 0.35 + 1
        d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
        sh = np.maximum(sh, np.clip((1.15 - d) / 0.3, 0, 1) * amax)
    out = np.zeros_like(a); put = (~op) & (sh > 0.02); out[..., 3][put] = np.round(sh[put] * 255)
    return out


def cut(piece):
    """the facing that shows the faces: S, the camera on the -Y side every stone, crypt door and photograph faces (glTF front
    is -Y); the body over its own shadow, cut to its box"""
    from PIL import Image
    FACE = ['S']
    best = None
    for f in FACE:
        fn = os.path.join(OUT, piece, 'rig_%s.png' % f)
        if not os.path.exists(fn): continue
        a = np.asarray(Image.open(fn).convert('RGBA'))[..., 3] > 0; ys, xs = np.nonzero(a)
        if not len(xs): continue
        w = xs.max() - xs.min() + 1
        if best is None or w > best[0]: best = (w, f)
    f = best[1]
    body = Image.open(os.path.join(OUT, piece, 'rig_%s.png' % f)).convert('RGBA')
    layer = Image.fromarray(stone_shadows(np.asarray(body)), 'RGBA')
    layer.alpha_composite(body)
    a = np.asarray(layer)[..., 3] > 6; ys, xs = np.nonzero(a)
    pad = 2; box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(layer.width, xs.max() + 1 + pad), min(layer.height, ys.max() + 1 + pad))
    out = layer.crop(box)
    os.makedirs(SHIP, exist_ok=True)
    dst = os.path.join(SHIP, piece + '.webp')
    out.save(dst, lossless=True, quality=100, method=6)
    # the foot: the body's lowest row inside the cut (the fight seats a piece by its top-left at x_m, y_m: the table keeps
    # the foot so the field can stand each piece on the spot it is laid at)
    bm = np.asarray(body)[..., 3] > 0; bys, bxs = np.nonzero(bm)
    foot = [int((bxs.min() + bxs.max()) / 2 - box[0]), int(bys.max() - box[1])]
    import hashlib
    rec = dict(piece=piece, src=os.path.basename(dst), size=[out.width, out.height], facing=f, foot_px=foot, sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(),
               model=os.path.relpath(glb_of(piece), R), rig=os.path.relpath(os.path.join(OUT, piece, 'rig.json'), R))
    print('  cut', piece, rec, flush=True)
    return rec


def table(recs):
    """slices/fight_ghosts/graveyard.json: the fight's piece table for the graveyard, the shape of fight_ground's cover rows"""
    pieces = {}
    for p, rec in recs.items():
        L, seed, kind, h, blocks, name = PIECES[p]
        pieces[p] = dict(src=rec['src'], h=h, kind=kind, name=name, l=L, foot_px=rec['foot_px'], facing=rec['facing'], **({'blocks_move': True} if blocks else {}))
    man = dict(version='graveyard-10-24', lane='COMBAT [ghosts and apparitions]', built_by='tools/bohemia_combat_the_graveyard_through_the_rig_10_24_26.py',
               rule='134(a): a place full of them is our graveyard', px_per_metre=PPM, pieces=pieces, draft=True,
               _readme='Every picture here is a model of tools/bohemia_combat_the_graveyard_through_the_rig_10_24_26.py through the master rig at the fight\'s own px a metre; the fight lays them on the graveyard\'s field (BOHEMIA_FIGHT.html).')
    json.dump(man, open(os.path.join(SHIP, 'graveyard.json'), 'w'), indent=1)
    print('  table', os.path.relpath(os.path.join(SHIP, 'graveyard.json'), R), len(pieces), 'pieces', flush=True)


def sub(cmd, piece):
    r = subprocess.run([VENV, os.path.abspath(__file__), cmd, piece], cwd=R, capture_output=True, text=True)
    lines = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l]
    print('\n'.join(lines[-8:]), flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd, names = a[0], a[1:]
    if cmd == 'model': model(names[0])
    elif cmd == 'rig': rig(names[0])
    elif cmd in ('cut', 'all'):
        recs = {}
        for p in names or list(PIECES):
            if cmd == 'all': sub('model', p); sub('rig', p)
            try: recs[p] = cut(p)
            except Exception as e: print('  cut failed', p, e, flush=True)
        if not names or set(names) == set(PIECES): table(recs)
        else:
            tp = os.path.join(SHIP, 'graveyard.json')
            old = json.load(open(tp))['pieces'] if os.path.exists(tp) else {}
            allrecs = {k: dict(src=v['src'], foot_px=v['foot_px'], facing=v['facing']) for k, v in old.items()}; allrecs.update(recs); table(allrecs)
    sys.stdout.flush(); os._exit(0)
