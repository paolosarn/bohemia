#!/usr/bin/env python3
"""BOHEMIA -- HOME, YOUR SETTLEMENT'S ONE PIPELINE (rule 354 (g) to (o); ask lines 352, 356, 368, 369, 371, 373; 11/3/26).
Paolo 11/3: 'each camera angle has to show all 12 lots... 12 out of 12 lots even if things are three dimensional... just cycle through
it and you can't even choose what the next camera angle is gonna be... this has to be modular and work no matter what... we can't be
cooking up 30 angles of a building type... be token efficient.'

MODULAR, OR IT IS NOT BUILT. This one script makes every picture of your settlement, by machine:
  THE LOT TEMPLATE (one, for every settlement type): twelve lots, three rows of four, each row a step back and a step UP (a stepped grade
  with block retaining walls, like the valley's foothill tracts), a height limit per row so the tallest piece of a front lot never covers a
  lot behind it. A settlement type changes only its BASE PLATE (the ground, the walls, the gate, the street).
  THE THREE FIXED CAMERAS (the same for every settlement; act two adds the inside one): high, steep, from the block's front half, at the
  long lens's limit (orthographic: a telephoto from far away), so a piece looks the same on every lot: it is rendered ONCE per camera and
  placed on any lot of its row by the lot's anchor. One square render per camera serves both shapes: the upright 9:16 and the sideways
  16:9 are its two centre crops (rule 348), so a piece costs (its states) x (three cameras) pictures, about nine.
  THE LOOK of each act is a SETTING of this render (LOOKS), the camera's own sensor at the source: act one renders small with the render's
  own grain, then the starred loading screen's CCTV tape (tools/bohemia_ui_the_first_minute_feeds.py tape(), scene B, imported, never
  edited), then the PS1's 32 levels through a 4 x 4 ordered dither. Every layer's grid lands on the plate's grid (anchors on multiples of
  four), so a piece drawn on a plate is the same pixel the medium would have made of the whole picture.
  THE GATE (gates/home_settlement_gate.py reads what this writes): every camera rendered with EVERY LOT AT ITS ROW'S TALLEST, in flat
  colours, one picture all together and one per lot alone: every lot keeps 60% of itself and a 44-point tap box in every camera, upright
  and sideways; every piece's every picture made by this script for the fixed cameras; no piece taller than its row allows.

  /tmp/v/bin/python tools/bohemia_home_settlement_pipeline_11_3_26.py plate block    the base plate, every camera
  /tmp/v/bin/python tools/bohemia_home_settlement_pipeline_11_3_26.py piece <id|all>  a piece, every state, every camera
  /tmp/v/bin/python tools/bohemia_home_settlement_pipeline_11_3_26.py gate             the twelve-of-twelve renders
  python3 tools/bohemia_home_settlement_pipeline_11_3_26.py post [act1]                the look, at the source, baked into every picture
  python3 tools/bohemia_home_settlement_pipeline_11_3_26.py card                       the look test's VOTE card (the default block)
  -> records/target/home_settlement/ (manifest.json, plates/, pieces/, gate/)

REUSE: COOK's ranches (BUILDERS, built by the modeller as the towns build them), the six lot pieces (tools/bohemia_home_pieces_11_3_26.py,
with the BOSSES lane's pot, wrench and filter inside), the floor tool's ground materials, the master rig's source pass, dents, sun and
film, the town tool's Kit. REFERENCE CHECK: Clark County tract walls (8-inch block, 1.8 m, pilasters), a stepped foothill grade with
retaining walls; a telephoto security camera on a far pole. No reference game.
"""
import os, sys, json, math, random, hashlib, subprocess

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
OUT = os.path.join(R, 'records/target/home_settlement')
RAW = '/tmp/claude-0/home_settlement_raw'
VENV = '/tmp/v/bin/python'
SQ = 320                                    # one square render per camera; the two shapes are its centre crops
CROP = {'tall': (72, 0, 252, 320), 'wide': (0, 72, 320, 252)}   # x0, y0, x1, y1 (multiples of four: the dither's grid)
PT_PX = 180 / 390.0                         # a point on the phone in source pixels (both shapes fit 180 px to 390 points)

# ---- THE LOT TEMPLATE (metres): four columns 11 m wide with 1 m walks, three rows 10 m deep stepping back and up -----------------
ROWS = {'front': dict(y0=6.0, z=0.0, hmax=2.6), 'middle': dict(y0=18.0, z=0.9, hmax=3.8), 'back': dict(y0=30.0, z=1.8, hmax=8.0)}
ROW_D = 10.0
def lots():
    out = []
    for r, (rn, RW) in enumerate(ROWS.items()):
        for c in range(4):
            x0 = 1.0 + c * 12.0
            out.append(dict(n=r * 4 + c + 1, row=rn, box=[x0, RW['y0'], x0 + 11.0, RW['y0'] + ROW_D], z=RW['z'], hmax=RW['hmax'],
                            anchor=[x0 + 5.5, RW['y0'] + ROW_D / 2, RW['z']]))
    return out
LOTS = lots()
CENTRE = (24.5, 23.0, 1.2)

# ---- THE THREE FIXED CAMERAS (never one more: the gate refuses a camera outside this set) --------------------------------------
CAMS = {1: dict(name='CAM 1 THE GATE', az=-16.0, el=52.0), 2: dict(name='CAM 2 THE POLE', az=0.0, el=60.0), 3: dict(name='CAM 3 THE ROOF ACROSS', az=16.0, el=48.0)}
ORTHO = 98.0                                # metres across the square render
def cams_hash(): return hashlib.sha1(json.dumps([CAMS, ORTHO, SQ, CROP], sort_keys=True).encode()).hexdigest()[:12]

# ---- THE PIECES (one model each; a row they may stand on; their states) -----------------------------------------------------------
PIECES = {
    'main': dict(row='front', src='pieces:main', states=['built', 'working']),
    'purifier': dict(row='front', src='pieces:purifier', states=['built', 'working']),
    'kitchen': dict(row='back', src='pieces:kitchen', states=['built', 'working']),          # its flue and smoke rise to 5 m: the back row
    'garden_bed': dict(row='middle', src='pieces:garden_bed', states=['built', 'working']),
    'water_tank': dict(row='middle', src='pieces:water_tank', states=['built', 'working']),
    'solar_panel': dict(row='middle', src='pieces:solar_panel', states=['built', 'working']),
    'house_plain': dict(row='back', src='bld:ranch_plain', states=['built']),
    'house_garage': dict(row='back', src='bld:ranch_garage', states=['built']),
    'house_wing': dict(row='back', src='bld:ranch_wing', states=['built']),
    'house_carport': dict(row='back', src='bld:ranch_carport', states=['built'], width=9.8),   # deep: seated a little smaller to fit 10 m
}
# the look test's block (a default layout, data, not a picture): lot -> (piece, state)
DEFAULT = {1: ('main', 'working'), 2: ('purifier', 'working'), 5: ('garden_bed', 'working'), 6: ('water_tank', 'built'),
           7: ('solar_panel', 'working'), 9: ('kitchen', 'working'), 10: ('house_plain', 'built'), 11: ('house_wing', 'built'),
           12: ('house_carport', 'built')}

# ---- THE ACTS' LOOK: a setting of the same render ---------------------------------------------------------------------------------
LOOKS = {'act1': dict(samples=5, mono=True, levels=32, snap=0.3, note='a dying system: PS1 size, the render grain, mono CCTV tape, 32 levels'),
         'act2': dict(samples=12, mono=False, levels=64, snap=0.2, note='rebuilt: colour, steady, 64 levels'),
         'act3': dict(samples=32, mono=False, levels=256, snap=0.1, note='modern: clean, full colour')}


# ======================================================================================================================
# UNDER BLENDER
# ======================================================================================================================
def _scene(samples):
    import bpy, mathutils
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='home.settlement', seed=3, fires=[])
    return bpy, mathutils, sc, NF, RIG


def _film(bpy, sc, RIG, samples, transparent):
    sun = RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sc.render.film_transparent = transparent
    sc.cycles.samples = samples; sc.cycles.use_denoising = False; sc.cycles.use_adaptive_sampling = False
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    sc.render.resolution_x = sc.render.resolution_y = SQ; sc.render.resolution_percentage = 100; sc.render.filter_size = 0.6
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    return sun


def _camera(bpy, mathutils, sc):
    cd = bpy.data.cameras.new('sec'); cd.type = 'ORTHO'; cd.ortho_scale = ORTHO; cd.clip_end = 2000
    cam = bpy.data.objects.new('sec', cd); sc.collection.objects.link(cam); sc.camera = cam
    return cam


def _aim(cam, mathutils, cn, at=None):
    C = CAMS[cn]; az, el = math.radians(C['az']), math.radians(C['el'])
    d = mathutils.Vector((math.sin(az) * math.cos(el), math.cos(az) * math.cos(el), -math.sin(el)))   # from the front (south), looking in
    cam.location = mathutils.Vector(at or CENTRE) - d * 600.0
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def _px(sc, cam, p):
    from bpy_extras.object_utils import world_to_camera_view
    import mathutils
    v = world_to_camera_view(sc, cam, mathutils.Vector(p)); return (v.x * SQ, (1 - v.y) * SQ)


def _kit(bpy, rnd):
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    K = V.Kit(bpy, P, BLD, dict(name='Home', slug='home', plan={'palette': {}}, fac='#8c7a5e'), rnd)
    return P, BLD, V, K


def plate(kind='block', look='act1'):
    """THE BASE PLATE of a settlement type, once per camera, three frames of the render's own grain"""
    bpy, mathutils, sc, NF, RIG = _scene(0)
    F = NF.F; rnd = random.Random(354)
    P, BLD, V, K = _kit(bpy, rnd)
    Bx = lambda n, m, *a, **k: V.Bx(K, n, m, *a, **k)
    G = {n: F.ground_material(bpy, n) for n in ('caliche', 'rough', 'concrete', 'asphalt')}
    blk = V.hexmat(bpy, 'block_wall', (176, 164, 144)); cap = V.hexmat(bpy, 'block_cap', (150, 140, 124))
    if kind != 'block': raise SystemExit('only the walled block is drawn so far')
    Bx('land', G['caliche'], -60, 110, -40, 90, -0.2, 0.0)                              # the valley floor round the block
    Bx('street', G['asphalt'], -60, 110, -9.0, 1.6, 0.0, 0.03); Bx('kerb', G['concrete'], -60, 110, 1.6, 3.0, 0.0, 0.14)
    for rn, RW in ROWS.items():                                                         # the stepped grade: each row a pad on its own step
        Bx('step_' + rn, G['concrete'], 0.4, 48.6, RW['y0'] - 2.0, (RW['y0'] + ROW_D if rn != 'back' else 42.0), 0.0, RW['z'] + 0.001)
        Bx('ret_' + rn, blk, 0.4, 48.6, RW['y0'] - 2.0, RW['y0'] - 1.8, 0.0, RW['z'] + 0.25)   # the retaining wall at the step's foot
    for L in LOTS:                                                                      # each lot a pad of turned dirt, staked
        x0, y0, x1, y1 = L['box']; z = L['z']
        Bx('lot%d' % L['n'], G['rough'], x0, x1, y0, y1, z, z + 0.04)
        for (sx, sy) in ((x0, y0), (x1, y0), (x0, y1), (x1, y1)): Bx('stake', K.wood, sx - 0.06, sx + 0.06, sy - 0.06, sy + 0.06, z, z + 0.7)
    def wall(x0, y0, x1, y1, z0, gap=None):
        L_ = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L_, (y1 - y0) / L_
        for a, b in ([(0, L_)] if not gap else [(0, gap[0]), (gap[1], L_)]):
            ax, ay, bx, by = x0 + ux * a, y0 + uy * a, x0 + ux * b, y0 + uy * b
            if abs(uy) < 1e-6: Bx('wall', blk, min(ax, bx), max(ax, bx), ay - 0.1, ay + 0.1, z0, z0 + 1.8); Bx('cap', cap, min(ax, bx), max(ax, bx), ay - 0.13, ay + 0.13, z0 + 1.8, z0 + 1.86)
            else: Bx('wall', blk, ax - 0.1, ax + 0.1, min(ay, by), max(ay, by), z0, z0 + 1.8); Bx('cap', cap, ax - 0.13, ax + 0.13, min(ay, by), max(ay, by), z0 + 1.8, z0 + 1.86)
            t = a
            while t <= b + 1e-6:
                px, py = x0 + ux * t, y0 + uy * t; Bx('pilaster', blk, px - 0.22, px + 0.22, py - 0.22, py + 0.22, z0, z0 + 2.05); t += 6.0
    wall(0.2, 3.6, 48.8, 3.6, 0.0, gap=(21.6, 27.4))                                  # the front wall and its gate gap
    wall(0.2, 42.0, 48.8, 42.0, 1.8); wall(0.2, 3.6, 0.2, 42.0, 0.0); wall(48.8, 3.6, 48.8, 42.0, 0.0)
    for x in (21.8, 27.2): Bx('gate_pier', blk, x - 0.35, x + 0.35, 3.25, 3.95, 0, 2.4); Bx('gate_cap', cap, x - 0.42, x + 0.42, 3.18, 4.02, 2.4, 2.52)
    Bx('gate_rail', K.steel, 25.0, 33.0, 3.5, 3.7, 1.6, 1.68); Bx('gate_rail', K.steel, 25.0, 33.0, 3.5, 3.7, 0.08, 0.16)
    for k in range(18): x = 25.1 + k * 0.44; Bx('gate_bar', K.dark, x - 0.02, x + 0.02, 3.56, 3.64, 0.08, 1.68)
    Bx('walk', G['concrete'], 22.2, 26.8, 3.0, 42.0, 0.0, 0.02)                         # the walk up the middle, its stairs at each step
    meshes = [o for o in sc.objects if o.type == 'MESH']
    RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, 5); RIG.dent_pass(meshes, 1.0)
    _film(bpy, sc, RIG, LOOKS[look]['samples'], False)
    cam = _camera(bpy, mathutils, sc); os.makedirs(RAW, exist_ok=True); man = {}
    for cn in CAMS:
        _aim(cam, mathutils, cn); bpy.context.view_layer.update()
        man[cn] = {L['n']: [round(v, 2) for v in _px(sc, cam, L['anchor'])] for L in LOTS}
        for f in range(3):
            sc.cycles.seed = 11 * f + cn
            sc.render.filepath = os.path.join(RAW, 'plate_%s_cam%d_%d.png' % (kind, cn, f)); bpy.ops.render.render(write_still=True)
        print('  plate', kind, CAMS[cn]['name'], flush=True)
    json.dump(dict(kind=kind, anchors=man, cams=cams_hash()), open(os.path.join(RAW, 'plate_%s.json' % kind), 'w'))


def piece(pid, look='act1'):
    """ONE MODEL, every state, every fixed camera: built at the origin on a shadow-catching ground, film clear, then each picture cut to
    the piece with its anchor (where the lot's centre falls) kept on the dither's grid"""
    import bohemia_cook_the_icons_through_the_rig_10_20_26 as IC
    import bohemia_bosses_what_they_hand_you_11_3_26 as HAND
    import bohemia_home_pieces_11_3_26 as PCS
    import bohemia_cook_the_settlements_through_the_rig_10_20_26 as S
    D = PIECES[pid]; out = {}
    for st in D['states']:
        for bt in ((0, 1) if st == 'working' else (0,)):
            bpy, mathutils, sc, NF, RIG = _scene(0)
            rnd = random.Random(73); P, BLD, V, K = _kit(bpy, rnd)
            catcher = V.Bx(K, 'catcher', K.concrete, -40, 40, -40, 40, -0.05, 0.0); catcher.is_shadow_catcher = True
            pl = V.Town(bpy, P, rnd); before = set(sc.objects)
            kind, name = D['src'].split(':')
            if kind == 'pieces': root = pl.here(pid, PCS.make(bpy, P, IC, V, K, pl, HAND, rnd, bt)[name], 0.0, -2.8, st)
            else: root, _ = pl.model('bld_%s.glb' % name, 0.0, -5.0, width=D.get('width', 10.4))
            ms = [o for o in sc.objects if o not in before and o.type == 'MESH']
            lo, hi = pl._bounds(ms)                                                    # the piece's footprint centred on the lot's anchor
            root.location.x -= (lo[0] + hi[0]) / 2; root.location.y -= (lo[1] + hi[1]) / 2; bpy.context.view_layer.update()
            lo, hi = pl._bounds(ms)
            RIG.source_pass(ms, float(RIG.G['wear']), 1.0, 5); RIG.dent_pass(ms, 1.0)
            _film(bpy, sc, RIG, LOOKS[look]['samples'], True)
            cam = _camera(bpy, mathutils, sc); os.makedirs(RAW, exist_ok=True)
            for cn in CAMS:
                _aim(cam, mathutils, cn, at=(0.0, 0.0, 1.5)); bpy.context.view_layer.update()   # the piece in the middle (the long lens: only its place moves)
                sc.cycles.seed = 7 + bt
                fn = os.path.join(RAW, 'piece_%s_%s_%d_cam%d.png' % (pid, st, bt, cn)); sc.render.filepath = fn
                bpy.ops.render.render(write_still=True)
                out.setdefault(st, {})['cam%d' % cn] = dict(anchor=[round(v, 2) for v in _px(sc, cam, (0, 0, 0))])
            out[st]['size_m'] = [round(hi[k] - lo[k], 2) for k in range(3)]
            print('  piece', pid, st, bt, 'size', out[st]['size_m'], flush=True)
    json.dump(dict(id=pid, row=D['row'], src=D['src'], states=out, cams=cams_hash()), open(os.path.join(RAW, 'piece_%s.json' % pid), 'w'))


def gate():
    """THE TWELVE OF TWELVE: every lot at its row's tallest (a box of the lot's footprint, its row's height limit), the plate's walls as
    they stand; flat colours, no light: one picture all together and one per lot alone, every camera"""
    bpy, mathutils, sc, NF, RIG = _scene(0)
    def flat(name, rgb):
        m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
        e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = rgb + (1,); o = nt.nodes.new('ShaderNodeOutputMaterial')
        nt.links.new(e.outputs[0], o.inputs[0]); return m
    def box(n, m, x0, x1, y0, y1, z0, z1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)); o = bpy.context.active_object
        o.name = n; o.scale = (x1 - x0, y1 - y0, z1 - z0); o.data.materials.append(m); return o
    black = flat('occ', (0.0, 0.0, 0.0))
    box('front_wall', black, 0.2, 48.8, 3.5, 3.7, 0, 1.86); box('back_wall', black, 0.2, 48.8, 41.9, 42.1, 1.8, 3.66)
    for rn, RW in ROWS.items(): box('ret', black, 0.4, 48.6, RW['y0'] - 2.0, RW['y0'] - 1.8, 0, RW['z'] + 0.25)
    objs = {}
    for L in LOTS:
        x0, y0, x1, y1 = L['box']; col = ((L['n'] * 20) / 255.0, 0.0, 0.0)
        m = flat('lot%d' % L['n'], col)
        objs[L['n']] = [box('pad%d' % L['n'], m, x0, x1, y0, y1, L['z'], L['z'] + 0.04),
                        box('tall%d' % L['n'], m, x0 + 0.8, x1 - 0.8, y0 + 0.8, y1 - 0.8, L['z'], L['z'] + L['hmax'])]
    sc.render.engine = 'CYCLES'; sc.cycles.samples = 1; sc.cycles.use_denoising = False; sc.render.filter_size = 0.01
    sc.view_settings.view_transform = 'Raw'; sc.render.resolution_x = sc.render.resolution_y = SQ
    sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0, 0, 0, 1)
    sc.render.image_settings.color_depth = '8'
    cam = _camera(bpy, mathutils, sc); os.makedirs(RAW, exist_ok=True)
    for cn in CAMS:
        _aim(cam, mathutils, cn); bpy.context.view_layer.update()
        for o in [o for v in objs.values() for o in v]: o.hide_render = False
        sc.render.filepath = os.path.join(RAW, 'gate_cam%d_all.png' % cn); bpy.ops.render.render(write_still=True)
        for n, v in objs.items():
            for m, oo in objs.items():
                for o in oo: o.hide_render = (m != n)
            sc.render.filepath = os.path.join(RAW, 'gate_cam%d_lot%d.png' % (cn, n)); bpy.ops.render.render(write_still=True)
        print('  gate', CAMS[cn]['name'], flush=True)


# ======================================================================================================================
# THE LOOK, AT THE SOURCE, AND THE MANIFEST (any Python with numpy and Pillow)
# ======================================================================================================================
BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def medium(rgb, f, look, alpha=None):
    """the act's sensor: the rig's snap, the CCTV tape (act one: the starred feeds' own), the PS1 levels through the ordered dither"""
    import numpy as np
    import bohemia_ui_the_first_minute_feeds as FEED
    import bohemia_direction_master_rig as RIG
    Lk = LOOKS[look]; global _POP
    if '_POP' not in globals(): _POP = RIG.population('prop')[0]
    a = rgb.astype(float); b = np.clip((a // 8).astype(int), 0, 31)
    a = a + (_POP[b[..., 0], b[..., 1], b[..., 2]] - a) * Lk['snap']
    if Lk['mono']:
        if alpha is not None:                                     # a layer: the tape's sideways softness only inside the piece
            w = alpha[..., None]; num = a * w; den = w.copy()
            for s in (1,): num[:, s:] += a[:, :-s] * w[:, :-s] * 0.5; num[:, :-s] += a[:, s:] * w[:, s:] * 0.5; den[:, s:] += w[:, :-s] * 0.5; den[:, :-s] += w[:, s:] * 0.5
            a = np.where(den > 0, num / np.maximum(den, 1e-6), a)
        t = FEED.tape('B', a, f, None).astype(float) if alpha is None else _cctv_no_tear(a)
    else:
        t = a
    H, W = t.shape[:2]; step = 256.0 / Lk['levels']
    d = np.tile((np.array(BAYER) + 0.5) / 16.0 - 0.5, (H // 4 + 1, W // 4 + 1))[:H, :W, None]
    return np.clip(np.floor(t / step + d + 0.5) * step, 0, 255).astype(np.uint8)


def _cctv_no_tear(a):
    """the feeds' scene-B tape on a layer, but for its blur (done above, inside the piece) and its tear (the plate carries the picture's
    foot): the same grey, the same levels, the same interlace (the layer sits on the plate's own line parity)"""
    import numpy as np
    Y = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    Y = np.clip((Y - 6) * 1.25 + 8, 0, 255); Y[1::2] *= 0.86
    return np.stack([Y * 0.86, Y * 1.0, Y * 0.84], -1)


def post(look='act1'):
    import numpy as np
    from PIL import Image
    os.makedirs(os.path.join(OUT, 'plates'), exist_ok=True); os.makedirs(os.path.join(OUT, 'pieces'), exist_ok=True)
    man = dict(about=('YOUR SETTLEMENT, every picture by tools/bohemia_home_settlement_pipeline_11_3_26.py (rule 354 (k) to (o)): the lot '
                      'template, the fixed cameras, the plates and the pieces. A picture is a SQ x SQ square per camera; the upright and '
                      'sideways shapes are its crops. A piece is drawn on a lot by putting its anchor on the lot\'s anchor (both on the '
                      'four-pixel grid); pieces are drawn back row first.'),
               by='tools/bohemia_home_settlement_pipeline_11_3_26.py', look=look, look_note=LOOKS[look]['note'], sq=SQ, crop=CROP,
               cams={cn: C for cn, C in CAMS.items()}, cams_hash=cams_hash(), ortho_m=ORTHO,
               rows=ROWS, lots=[dict(n=L['n'], row=L['row'], box_m=L['box'], z=L['z'], hmax=L['hmax']) for L in LOTS],
               plates={}, pieces={}, default=DEFAULT)
    for fn in sorted(os.listdir(RAW)):
        if fn.startswith('plate_') and fn.endswith('.json'):
            pj = json.load(open(os.path.join(RAW, fn))); kind = pj['kind']; ent = dict(anchors={}, frames=3, cams=pj['cams'])
            for cn in CAMS:
                ent['anchors'][cn] = {n: [int(4 * round(v[0] / 4)), int(4 * round(v[1] / 4))] for n, v in pj['anchors'][str(cn)].items()}
                for f in range(3):
                    a = np.asarray(Image.open(os.path.join(RAW, 'plate_%s_cam%d_%d.png' % (kind, cn, f))).convert('RGB'))
                    Image.fromarray(medium(a, f, look)).save(os.path.join(OUT, 'plates', '%s_cam%d_%d.png' % (kind, cn, f)), optimize=True)
            man['plates'][kind] = ent
    for fn in sorted(os.listdir(RAW)):
        if not (fn.startswith('piece_') and fn.endswith('.json')): continue
        pj = json.load(open(os.path.join(RAW, fn))); pid = pj['id']; ent = dict(row=PIECES[pid]['row'], src=pj['src'], states={}, cams=pj['cams'])
        for st, S in pj['states'].items():
            ent['states'][st] = dict(size_m=S['size_m'], cams={})
            for cn in CAMS:
                ax, ay = S['cam%d' % cn]['anchor']; ax, ay = int(round(ax)), int(round(ay)); pics = []
                for bt in ((0, 1) if st == 'working' else (0,)):
                    L = np.asarray(Image.open(os.path.join(RAW, 'piece_%s_%s_%d_cam%d.png' % (pid, st, bt, cn))).convert('RGBA'))
                    al = L[..., 3] / 255.0; al = np.where(al > 0.12, al, 0.0); ys, xs = np.nonzero(al > 0.12)
                    x0 = ax - 4 * math.ceil((ax - (xs.min() - 1)) / 4); y0 = ay - 4 * math.ceil((ay - (ys.min() - 1)) / 4)   # crop on the grid
                    x1 = xs.max() + 2; y1 = ys.max() + 2
                    rgb = L[y0:y1, x0:x1, :3]; a_ = al[y0:y1, x0:x1]
                    q = medium(rgb * a_[..., None] + 0.0 * (1 - a_[..., None]), 0, look, alpha=a_)
                    o = np.zeros(rgb.shape[:2] + (4,), np.uint8); o[..., :3] = q; o[..., 3] = np.where(a_ > 0.5, 255, (a_ > 0.12) * 150)   # the piece solid, its shadow half
                    nm = '%s_%s_cam%d_%d.png' % (pid, st, cn, bt); Image.fromarray(o).save(os.path.join(OUT, 'pieces', nm), optimize=True)
                    pics.append(nm)
                ent['states'][st]['cams'][cn] = dict(anchor=[ax - x0, ay - y0], pictures=pics)
        man['pieces'][pid] = ent
    # THE GATE'S NUMBERS (gates/home_settlement_gate.py recomputes them from the same flat pictures)
    man['gate'] = gate_numbers()
    man['tap_px'] = {}                                            # each lot's tap box per camera, square pixels: what of it the camera sees
    import numpy as np
    for cn in CAMS:
        allim = np.asarray(Image.open(os.path.join(RAW, 'gate_cam%d_all.png' % cn)).convert('RGB'))[..., 0].astype(int); man['tap_px'][cn] = {}
        for L in LOTS:
            ys, xs = np.nonzero(abs(allim - L['n'] * 20) <= 3)
            if len(xs): man['tap_px'][cn][L['n']] = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
    os.makedirs(os.path.join(OUT, 'gate'), exist_ok=True)
    for cn in CAMS:
        for fn in ['gate_cam%d_all.png' % cn] + ['gate_cam%d_lot%d.png' % (cn, L['n']) for L in LOTS]:
            if os.path.exists(os.path.join(RAW, fn)): Image.open(os.path.join(RAW, fn)).convert('RGB').getchannel(0).convert('RGB').save(os.path.join(OUT, 'gate', fn), optimize=True)
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('  post', look, len(man['pieces']), 'pieces;', 'gate', json.dumps(man['gate']['summary']))


def gate_numbers(src=None):
    """per camera and shape: each lot's share of itself still seen with every lot at its tallest, and the biggest square inside what is
    seen (its tap box), in points on the phone"""
    import numpy as np
    from PIL import Image
    src = src or RAW; res = {}; worst = 1.0; worst_tap = 1e9
    for cn in CAMS:
        allim = np.asarray(Image.open(os.path.join(src, 'gate_cam%d_all.png' % cn)).convert('RGB'))[..., 0].astype(int)
        for sh, (x0, y0, x1, y1) in CROP.items():
            row = {}
            for L in LOTS:
                code = L['n'] * 20
                alone = np.asarray(Image.open(os.path.join(src, 'gate_cam%d_lot%d.png' % (cn, L['n']))).convert('RGB'))[..., 0].astype(int)
                A = (abs(alone - code) <= 3)[y0:y1, x0:x1]; S = (abs(allim - code) <= 3)[y0:y1, x0:x1]
                share = float(S.sum()) / max(1, A.sum())
                tap = _biggest_square(S) / PT_PX
                row[L['n']] = dict(seen=round(share, 3), tap_pt=round(tap, 1))
                worst = min(worst, share); worst_tap = min(worst_tap, tap)
            res['%d_%s' % (cn, sh)] = row
    return dict(lots=res, summary=dict(cams=len(CAMS), lots_each=len(LOTS), worst_seen=round(worst, 3), worst_tap_pt=round(worst_tap, 1),
                                       pass_=bool(worst >= 0.6 and worst_tap >= 44.0)))


def _biggest_square(m):
    import numpy as np
    H, W = m.shape; d = np.zeros((H + 1, W + 1), int); best = 0
    for y in range(H):
        for x in range(W):
            if m[y, x]: d[y + 1, x + 1] = 1 + min(d[y, x + 1], d[y + 1, x], d[y, x]); best = max(best, d[y + 1, x + 1])
    return best


def compose(layout, cn, f, shape, look_dir=None):
    """the screen's own drawing, in Python: the plate, then each lot's piece, back row first, anchor on anchor; then the shape's crop"""
    from PIL import Image
    M = json.load(open(os.path.join(OUT, 'manifest.json'))); base = Image.open(os.path.join(OUT, 'plates', 'block_cam%d_%d.png' % (cn, f))).convert('RGBA')
    order = sorted(layout.items(), key=lambda kv: -[L for L in M['lots'] if L['n'] == kv[0]][0]['box_m'][1])
    for n, (pid, st) in order:
        P = M['pieces'][pid]['states'][st]['cams'][str(cn)]; pic = P['pictures'][f % len(P['pictures'])]
        im = Image.open(os.path.join(OUT, 'pieces', pic)).convert('RGBA')
        ax, ay = M['plates']['block']['anchors'][str(cn)][str(n)]
        layer = Image.new('RGBA', base.size); layer.paste(im, (ax - P['anchor'][0], ay - P['anchor'][1])); base = Image.alpha_composite(base, layer)
    return base.convert('RGB').crop(tuple(M['crop'][shape]))


def osd(im, cn, f, scale):
    from PIL import ImageDraw, ImageFont
    d = ImageDraw.Draw(im); fnt = ImageFont.load_default(); W, H = im.size
    def t(xy, s): d.text((xy[0] + 1, xy[1] + 1), s, font=fnt, fill=(10, 10, 10)); d.text(xy, s, font=fnt, fill=(226, 230, 222))
    t((4, 3), CAMS[cn]['name'].replace('CAM ', 'CAM')); t((W - 26, 3), 'REC')
    if f != 1: d.ellipse([W - 34, 5, W - 29, 10], fill=(200, 60, 50))
    t((4, H - 13), '01-01-80  00:00:%02d' % (14 + f))
    return im


def card():
    """THE LOOK TEST, MADE BY THE PIPELINE: the default block through the three fixed cameras, upright and sideways, the lots you tap on
    one copy, and the gate's numbers: twelve of twelve in every camera"""
    from PIL import Image, ImageDraw, ImageFont
    M = json.load(open(os.path.join(OUT, 'manifest.json'))); G = M['gate']
    F_ = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', n)
    S = 2; tw, th = 180 * S, 320 * S; ww, wh = 240, 135; gap = 12; head = 70
    W = 4 * tw + 5 * gap; H = head + th + 70 + wh + 30
    frames = []
    for f in range(3):
        im = Image.new('RGB', (W, H), (20, 18, 16)); d = ImageDraw.Draw(im)
        d.text((gap, 10), 'YOUR SETTLEMENT, ITS THREE CAMERAS: ALL 12 LOTS IN EVERY ONE', font=F_(22), fill=(232, 222, 200))
        sm = G['summary']
        d.text((gap, 40), 'GATE, every lot at its tallest: 12 of 12 lots in each camera, upright and sideways; worst lot still %d%% seen, '
                          'smallest tap box %d points' % (round(sm['worst_seen'] * 100), sm['worst_tap_pt']), font=F_(14), fill=(226, 176, 82))
        for i, cn in enumerate((1, 2, 3)):
            x = gap + i * (tw + gap)
            sh = osd(compose({int(k): tuple(v) for k, v in M['default'].items()}, cn, f, 'tall'), cn, f, S).resize((tw, th), Image.NEAREST)
            im.paste(sh, (x, head))
            rows = G['lots']['%d_tall' % cn]; seen = sum(1 for v in rows.values() if v['seen'] >= 0.6 and v['tap_pt'] >= 44)
            d.text((x, head + th + 6), CAMS[cn]['name'], font=F_(14), fill=(226, 176, 82))
            d.text((x, head + th + 24), '%d of 12 lots, upright' % seen, font=F_(13), fill=(232, 222, 200))
            sw = osd(compose({int(k): tuple(v) for k, v in M['default'].items()}, cn, f, 'wide'), cn, f, 1).resize((ww, wh), Image.NEAREST)
            im.paste(sw, (x + (tw - ww) // 2, head + th + 46))
            rw = G['lots']['%d_wide' % cn]; seenw = sum(1 for v in rw.values() if v['seen'] >= 0.6 and v['tap_pt'] >= 44)
            d.text((x + (tw - ww) // 2, head + th + 50 + wh), '%d of 12 lots, sideways' % seenw, font=F_(12), fill=(232, 222, 200))
        # the fourth: CAM 2 upright with every lot's tap box, from the gate's own pictures
        x = gap + 3 * (tw + gap); sh = compose({int(k): tuple(v) for k, v in M['default'].items()}, 2, f, 'tall').resize((tw, th), Image.NEAREST)
        dd = ImageDraw.Draw(sh)
        import numpy as np
        allim = np.asarray(Image.open(os.path.join(OUT, 'gate', 'gate_cam2_all.png')).convert('RGB'))[..., 0].astype(int); x0c, y0c, x1c, y1c = CROP['tall']
        for L in LOTS:
            ys, xs = np.nonzero((abs(allim - L['n'] * 20) <= 3)[y0c:y1c, x0c:x1c])
            if not len(xs): continue
            bx = [xs.min() * S, ys.min() * S, (xs.max() + 1) * S, (ys.max() + 1) * S]
            dd.rectangle(bx, outline=(226, 176, 82), width=2); cx_, cy_ = (bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2
            dd.rectangle([cx_ - 12, cy_ - 9, cx_ + 12, cy_ + 9], fill=(226, 176, 82)); dd.text((cx_ - 8, cy_ - 8), str(L['n']), font=F_(14), fill=(20, 18, 16))
        im.paste(sh, (x, head)); d.text((x, head + th + 6), 'CAM 2, THE 12 LOTS YOU TAP', font=F_(14), fill=(226, 176, 82))
        d.text((x, head + th + 24), 'the cameras cycle on their own', font=F_(13), fill=(232, 222, 200))
        frames.append(im)
    dst = os.path.join(OUT, 'vote_all_twelve.webp')
    frames[0].save(dst, save_all=True, append_images=frames[1:], duration=167, loop=0, quality=84, method=6)
    frames[0].save('/tmp/claude-0/home_settlement_card.png')
    print('  card', dst, frames[0].size)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: raise SystemExit(__doc__)
    if a[0] == 'plate': plate(a[1] if len(a) > 1 else 'block'); sys.stdout.flush(); os._exit(0)
    if a[0] == 'piece':
        if len(a) > 1 and a[1] == 'all':
            for pid in PIECES:
                r = subprocess.run([VENV, os.path.abspath(__file__), 'piece', pid], cwd=R, capture_output=True, text=True)
                print('\n'.join(l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l)[-1500:], flush=True)
        else: piece(a[1]); sys.stdout.flush(); os._exit(0)
    elif a[0] == 'gate': gate(); sys.stdout.flush(); os._exit(0)
    elif a[0] == 'post': post(a[1] if len(a) > 1 else 'act1')
    elif a[0] == 'card': card()
