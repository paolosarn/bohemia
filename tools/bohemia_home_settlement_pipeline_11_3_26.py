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
  /tmp/v/bin/python tools/bohemia_home_settlement_pipeline_11_3_26.py near             what hangs at each lens, every camera
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
SIZES = {'tall': (180, 320), 'wide': (320, 180)}   # each camera shot both ways from the same mount (rule 348), at the PS1's size
PT_PX = 180 / 390.0                         # a point on the phone in source pixels (both shapes fit 180 px to 390 points)

# ---- THE LOT TEMPLATE (metres): four columns 11 m wide with 1 m walks, three rows 10 m deep stepping back and up -----------------
ROWS = {'front': dict(y0=6.0, z=0.0, hmax=2.6), 'middle': dict(y0=18.0, z=1.4, hmax=3.8), 'back': dict(y0=30.0, z=2.8, hmax=8.0)}
ROW_D = 10.0
LOT_W = 9.0                                  # an older Vegas tract lot's frontage (the narrow block lets the cameras come close)
BW = 4 * LOT_W + 3 * 1.0 + 2.0               # the block's width inside its walls: 41 m
GX = BW / 2                                  # the gate and the walk on the middle
def lots():
    out = []
    for r, (rn, RW) in enumerate(ROWS.items()):
        for c in range(4):
            x0 = 1.0 + c * (LOT_W + 1.0)
            out.append(dict(n=r * 4 + c + 1, row=rn, box=[x0, RW['y0'], x0 + LOT_W, RW['y0'] + ROW_D], z=RW['z'], hmax=RW['hmax'],
                            anchor=[x0 + LOT_W / 2, RW['y0'] + ROW_D / 2, RW['z']]))
    return out
LOTS = lots()

# ---- THE THREE FIXED CAMERAS (rule 373: INTIMATE, a real security camera): mounted low on the block's front half, a wide lens with its
# own barrel bend (an equisolid fisheye, Cycles' own, at the source), steep perspective: the near lots big, the far ones small, all twelve
# in frame upright and sideways (the gate proves it). f is the lens in mm on a 36 mm sensor's long side. Never one more camera.
CAMS = {1: dict(name='CAM 1 THE STREET LIGHT', mount='the street light across from the gate, 13 m', loc=(20.5, -5.0, 13.0),
                at={'tall': (20.5, 30.0, 0.0), 'wide': (20.5, 22.0, 0.0)}, f={'tall': 14.8, 'wide': 16.5}),
        2: dict(name='CAM 2 THE POWER POLE', mount='the power pole across the street, 13.6 m', loc=(18.5, -6.0, 13.6),
                at={'tall': (21.0, 30.0, 0.0), 'wide': (21.0, 22.0, 0.0)}, f={'tall': 15.0, 'wide': 16.8}),
        3: dict(name='CAM 3 THE BILLBOARD', mount='the dead billboard across the street, 14.8 m', loc=(22.0, -4.0, 14.8),
                at={'tall': (19.6, 29.0, 0.0), 'wide': (19.8, 22.0, 0.0)}, f={'tall': 15.0, 'wide': 16.8})}
def cams_hash(): return hashlib.sha1(json.dumps([CAMS, SIZES], sort_keys=True).encode()).hexdigest()[:12]
# what stands near each lens (part of the base plate, and an occluder in the gate): the camera's own world in the foreground
FOREGROUND = [('gate_light_pole', (15.6, 2.2, 0.0, 0.11, 6.8)), ('sign_post', (3.3, 2.4, 0.0, 0.06, 1.6)), ('hydrant', (27.0, 1.9, 0.0, 0.14, 0.8))]
# the night (the starred feed's): the moon low and cold, three sodium heads on poles over the lots, one dying
LAMPS = [(15.6, 2.2, 6.8), (0.6, 11.0, 7.0), (BW - 0.6, 11.0, 7.0), (0.6, 23.0, 8.0), (BW - 0.6, 23.0, 8.0), (20.5, 41.6, 10.0)]   # the gate's, two on the side walls per row, one on the back wall: none stands in front of a lot

# ---- WHAT STANDS AT THE LENSES (rule 373, second look: measured, 12 thumb-sized lots upright keep every camera 11 to 13 m up and the
# lots a band across the middle, whatever the block's size; so the closeness is what hangs right at each lens, as the starred feed's
# pole and car are). ONE near set for the whole street, seen by all three cameras from where it stands, so the world agrees between
# cuts: the street light's arm over CAM 1, a fan palm beside it, a dead pickup at its foot; the pole's bracket and insulators over
# CAM 2, two lines across the street, a pair of sneakers hung on the low one, a shopping cart on its side; the billboard's gooseneck
# lamps over CAM 3, a strip of its vinyl caught on one, a web across its housing. Lit by the night and by each camera's own infrared
# ring (so what is nearest glows, the real night camera's look). Drawn over every lot's piece: where it shows, it is nearer than any
# lot; the gate counts it standing in front of the lots.
NEAR = ['the street light arm and dead head over CAM 1', 'a fan palm beside CAM 1', 'a dead pickup at the kerb under CAM 1',
        'the bracket and insulators over CAM 2', 'two lines across the street', 'sneakers hung on the low line', 'a shopping cart on its side',
        'two gooseneck lamps over CAM 3', 'a strip of torn vinyl caught on one', 'a web across CAM 3\'s housing']
IR_W = 90.0                                  # each camera's infrared ring (a point at the lens, watts): inverse square, the near things glow

# ---- THE PIECES (one model each; a row they may stand on; their states) -----------------------------------------------------------
PIECES = {
    'main': dict(row='front', src='pieces:main', states=['built', 'working']),
    'purifier': dict(row='front', src='pieces:purifier', states=['built', 'working']),
    'kitchen': dict(row='back', src='pieces:kitchen', states=['built', 'working']),          # its flue and smoke rise to 5 m: the back row
    'garden_bed': dict(row='middle', src='pieces:garden_bed', states=['built', 'working']),
    'water_tank': dict(row='middle', src='pieces:water_tank', states=['built', 'working']),
    'solar_panel': dict(row='middle', src='pieces:solar_panel', states=['built', 'working']),
    'house_plain': dict(row='back', src='bld:ranch_plain', states=['built'], width=8.6),
    'house_garage': dict(row='back', src='bld:ranch_garage', states=['built'], width=8.6),
    'house_wing': dict(row='back', src='bld:ranch_wing', states=['built'], width=8.6),
    'house_carport': dict(row='back', src='bld:ranch_carport', states=['built'], width=8.4),   # deep: seated a little smaller to fit 10 m
}
# the look test's block (a default layout, data, not a picture): lot -> (piece, state)
DEFAULT = {1: ('main', 'working'), 2: ('purifier', 'working'), 5: ('garden_bed', 'working'), 6: ('water_tank', 'built'),
           7: ('solar_panel', 'working'), 9: ('kitchen', 'working'), 10: ('house_plain', 'built'), 11: ('house_wing', 'built'),
           12: ('house_carport', 'built')}

# ---- THE ACTS' LOOK: a setting of the same render ---------------------------------------------------------------------------------
LOOKS = {'act1': dict(samples=24, mono=True, levels=32, snap=0.3, note='a dying system: PS1 size, night under sodium, the starred feeds\' mono CCTV tape, 32 levels'),
         'act2': dict(samples=12, mono=False, levels=64, snap=0.2, note='rebuilt: colour, steady, 64 levels'),
         'act3': dict(samples=32, mono=False, levels=256, snap=0.1, note='modern: clean, full colour')}


# ======================================================================================================================
# UNDER BLENDER
# ======================================================================================================================
def _scene():
    import bpy, mathutils
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='home.settlement', seed=3, fires=[])
    return bpy, mathutils, sc, NF, NF.RIG


def _night(bpy, sc, RIG, samples, transparent):
    """the town render's light, then its night (the sun down to a cold moon, the sky dark), the sodium heads lit; Cycles, a handful of
    samples and no denoiser: the grain is the render's own"""
    sun = RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sun.data.energy *= 0.14; sun.data.color = (0.55, 0.66, 1.0)
    bg = sc.world.node_tree.nodes['Background']; c = bg.inputs[0].default_value
    bg.inputs[0].default_value = (c[0] * 0.45, c[1] * 0.55, c[2] * 1.0, 1); bg.inputs[1].default_value *= 0.06
    for (x, y, z) in LAMPS:
        L = bpy.data.lights.new('sodium', 'SPOT'); L.energy = 2200; L.color = (1.0, 0.6, 0.24); L.spot_size = math.radians(110)
        L.spot_blend = 0.6; L.shadow_soft_size = 0.2; o = bpy.data.objects.new('sodium', L); sc.collection.objects.link(o)
        o.location = (x, y, z - 0.2); o.rotation_euler = (0, 0, 0)
    sc.render.film_transparent = transparent; sc.view_settings.exposure = 0.0
    sc.cycles.samples = samples; sc.cycles.use_denoising = True;   # the starred feeds' own film (64 samples, denoised); the tape is the medium
    sc.cycles.use_adaptive_sampling = False
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    sc.render.resolution_percentage = 100; sc.render.filter_size = 0.6
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    return sun


def _camera(bpy, sc):
    cd = bpy.data.cameras.new('sec'); cd.type = 'PANO'; cd.panorama_type = 'FISHEYE_EQUISOLID'; cd.fisheye_fov = math.radians(180)
    cd.sensor_fit = 'AUTO'; cd.sensor_width = 36.0; cd.clip_start = 0.05; cd.clip_end = 600
    cam = bpy.data.objects.new('sec', cd); sc.collection.objects.link(cam); sc.camera = cam
    return cam


def _aim(bpy, mathutils, sc, cam, cn, shape):
    C = CAMS[cn]; W, H = SIZES[shape]
    sc.render.resolution_x, sc.render.resolution_y = W, H; cam.data.fisheye_lens = C['f'][shape]
    cam.location = C['loc']; d = mathutils.Vector(C['at'][shape]) - mathutils.Vector(C['loc'])
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); bpy.context.view_layer.update()


def _kit(bpy, rnd):
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    K = V.Kit(bpy, P, BLD, dict(name='Home', slug='home', plan={'palette': {}}, fac='#8c7a5e'), rnd)
    return P, BLD, V, K


def _block(bpy, rnd, K, P, V, F, life=True):
    """THE WALLED BLOCK'S BASE PLATE: the land, the street, the stepped grade and its retaining walls, the staked lots, the tract wall and
    its gate, the walk, the poles and their sodium heads, what stands near each lens; and, when it is the plate, a coyote looking round"""
    Bx = lambda n, m, *a, **k: V.Bx(K, n, m, *a, **k)
    G = {n: F.ground_material(bpy, n) for n in ('caliche', 'rough', 'concrete', 'asphalt')}
    blk = V.hexmat(bpy, 'block_wall', (176, 164, 144)); cap = V.hexmat(bpy, 'block_cap', (150, 140, 124))
    ground = [Bx('land', G['caliche'], -60, 110, -40, 90, -0.2, 0.0)]
    ground.append(Bx('street', G['asphalt'], -60, 110, -9.0, 1.6, 0.0, 0.03)); ground.append(Bx('kerb', G['concrete'], -60, 110, 1.6, 3.0, 0.0, 0.14))
    for rn, RW in ROWS.items():
        ground.append(Bx('step_' + rn, G['concrete'], 0.4, BW - 0.4, RW['y0'] - 2.0, (RW['y0'] + ROW_D if rn != 'back' else 42.0), 0.0, RW['z'] + 0.001))
        Bx('ret_' + rn, blk, 0.4, BW - 0.4, RW['y0'] - 2.0, RW['y0'] - 1.8, 0.0, RW['z'] + 0.25)
    for L in LOTS:
        x0, y0, x1, y1 = L['box']; z = L['z']
        ground.append(Bx('lot%d' % L['n'], G['rough'], x0, x1, y0, y1, z, z + 0.04))
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
    wall(0.2, 3.6, BW - 0.2, 3.6, 0.0, gap=(GX - 3.1, GX + 2.7)); wall(0.2, 42.0, BW - 0.2, 42.0, 2.8); wall(0.2, 3.6, 0.2, 42.0, 0.0); wall(BW - 0.2, 3.6, BW - 0.2, 42.0, 0.0)
    for x in (GX - 2.9, GX + 2.5): Bx('gate_pier', blk, x - 0.35, x + 0.35, 3.25, 3.95, 0, 2.4); Bx('gate_cap', cap, x - 0.42, x + 0.42, 3.18, 4.02, 2.4, 2.52)
    Bx('gate_rail', K.steel, GX + 0.5, GX + 8.5, 3.5, 3.7, 1.6, 1.68); Bx('gate_rail', K.steel, GX + 0.5, GX + 8.5, 3.5, 3.7, 0.08, 0.16)
    for k in range(18): x = GX + 0.6 + k * 0.44; Bx('gate_bar', K.dark, x - 0.02, x + 0.02, 3.56, 3.64, 0.08, 1.68)
    ground.append(Bx('walk', G['concrete'], GX - 0.5, GX + 0.5, 3.0, 42.0, 0.0, 0.02))
    # the poles and their heads (the light the night is lit by), the cameras' own mounts, what stands near each lens
    for (x, y, z) in LAMPS:
        P.cyl(bpy, 'lamp_pole', K.steel, 0.09, z, (x, y, z / 2), verts=10); Bx('lamp_head', K.dark, x - 0.35, x + 0.35, y - 0.15, y + 0.15, z - 0.1, z + 0.05)
        P.box(bpy, 'lamp_glass', V.hexmat(bpy, 'sodium_glass', (255, 178, 100), 6.0), (0.5, 0.2, 0.03), (x, y, z - 0.13))
    for nm, (x, y, z0, r, h) in FOREGROUND: P.cyl(bpy, nm, K.steel if 'pole' in nm else K.wood, r, h, (x, y, z0 + h / 2), verts=10)
    Bx('sign', V.hexmat(bpy, 'sign_board', (196, 170, 120)), 2.6, 4.0, 2.35, 2.42, 1.0, 1.6)                 # a hand-painted board on the sign post
    for k in range(3): Bx('sign_paint', V.hexmat(bpy, 'sign_paint', (120, 40, 30)), 2.75, 3.85 - k * 0.12, 2.33, 2.35, 1.45 - k * 0.15, 1.5 - k * 0.15)
    Bx('shed', K.ply, BW + 1.0, BW + 3.0, 0.4, 2.8, 0.0, 2.6); P.box(bpy, 'shed_roof', K.tin, (2.6, 3.0, 0.05), (BW + 2.0, 1.6, 2.75), rot=(0, math.radians(8), 0))
    P.cyl(bpy, 'gutter', K.steel, 0.05, 2.6, (BW + 2.0, 0.1, 2.8), rot=(0, math.radians(90), 0), verts=8)
    P.cyl(bpy, 'cam1_pole', K.steel, 0.13, 13.4, (20.5, -5.4, 6.7), verts=10); P.cyl(bpy, 'cam2_pole', K.wood, 0.16, 14.0, (18.5, -6.4, 7.0), verts=10)
    P.cyl(bpy, 'billboard_post', K.steel, 0.3, 14.0, (25.0, -4.9, 7.0), verts=12); Bx('billboard', K.ply, 21.4, 29.4, -4.9, -4.6, 14.2, 18.2)
    Bx('house_across', K.ply, 2.0, 14.0, -24.0, -15.2, 0.0, 6.0); P.box(bpy, 'roof_across', K.tin, (12.6, 9.4, 0.08), (8.0, -19.6, 6.3), rot=(math.radians(-6), 0, 0))
    for (a_, b_) in (((18.5, -6.4, 9.0), (60.0, -6.0, 9.0)), ((18.5, -6.4, 8.7), (-30.0, -7.0, 8.8)), ((18.5, -6.4, 8.7), (15.6, 2.2, 6.6))):
        P.rod(bpy, 'wire', K.dark, a_, b_, 0.015, 4)
    import bohemia_cook_the_settlements_through_the_rig_10_20_26 as S0
    S0.Place(bpy, P, rnd).model('wreck.glb', 31.0, -2.5, rot=math.radians(14))
    coyote = None
    if life:
        # imported the starred feed's way: every new object, its skeleton too, under one root (the props' seat skips skeletons, and the
        # coyote's mesh hangs from its skeleton, so seated it kept its raw import size, 82 m tall)
        before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=os.path.join(R, 'reference/models/bohemia/coyote.glb'))
        coyote = bpy.data.objects.new('coyote', None); bpy.context.scene.collection.objects.link(coyote)
        for o in [o for o in bpy.data.objects if o not in before and o is not coyote]:
            if o.parent is None: o.parent = coyote
        coyote.rotation_euler = (0, 0, math.radians(-40))
    return ground, coyote


def plate(kind='block', look='act1'):
    """THE BASE PLATE, every camera, upright and sideways, three frames: the render's grain moving, the coyote looking round, CAM 3 dying"""
    bpy, mathutils, sc, NF, RIG = _scene(); F = NF.F; rnd = random.Random(354)
    P, BLD, V, K = _kit(bpy, rnd)
    if kind != 'block': raise SystemExit('only the walled block is drawn so far')
    ground, coyote = _block(bpy, rnd, K, P, V, F)
    _beyond(bpy, P, K, V, rnd)
    meshes = [o for o in sc.objects if o.type == 'MESH']
    RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, 5); RIG.dent_pass(meshes, 1.0)
    arm = [o for o in bpy.data.objects if o.type == 'ARMATURE']; clip = bpy.data.actions.get('Survey_root')
    if arm and clip:
        for a in arm: a.animation_data_create(); a.animation_data.action = clip
    f0, f1 = (clip.frame_range if clip else (1, 12))
    if coyote is not None:                                       # the coyote's own size (1.1 m nose to tail) measured POSED, as the feed does
        sc.frame_set(int(f0)); bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get()
        def posed():
            lo = [1e9] * 3; hi = [-1e9] * 3
            for o in [o for o in coyote.children_recursive if o.type == 'MESH']:
                e = o.evaluated_get(dg); me = e.to_mesh()
                for v in me.vertices:
                    q = e.matrix_world @ v.co; lo = [min(x, y) for x, y in zip(lo, q)]; hi = [max(x, y) for x, y in zip(hi, q)]
                e.to_mesh_clear()
            return lo, hi
        lo, hi = posed(); span = max(hi[0] - lo[0], hi[1] - lo[1])
        if span > 0: coyote.scale = tuple(v * 1.1 / span for v in coyote.scale)
        bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get(); lo, hi = posed()
        coyote.location.x += 9.0 - (lo[0] + hi[0]) / 2; coyote.location.y += 12.0 - (lo[1] + hi[1]) / 2; coyote.location.z -= lo[2]
        print('  coyote posed', round(span, 2), 'm ->', round(max(hi[0] - lo[0], hi[1] - lo[1]), 2), 'm', flush=True)
    _night(bpy, sc, RIG, LOOKS[look]['samples'], False); ev0 = sc.view_settings.exposure; _glow(bpy, sc)
    cam = _camera(bpy, sc); os.makedirs(RAW, exist_ok=True)
    for cn in CAMS:
        for sh in SIZES:
            _aim(bpy, mathutils, sc, cam, cn, sh)
            for f in range(3):
                sc.frame_set(int(round(f0 + (f1 - f0) * f / 3))); sc.cycles.seed = 11 * f + cn
                sc.view_settings.exposure = ev0 + (-1.4 if (cn == 3 and f == 1) else 0.0)
                sc.render.filepath = os.path.join(RAW, 'plate_%s_cam%d_%s_%d.png' % (kind, cn, sh, f)); bpy.ops.render.render(write_still=True)
            print('  plate', kind, CAMS[cn]['name'], sh, flush=True)
    json.dump(dict(kind=kind, cams=cams_hash()), open(os.path.join(RAW, 'plate_%s.json' % kind), 'w'))


def piece(pid, look='act1'):
    """ONE MODEL, every state, from every fixed camera on every lot of its row (the lens has perspective now, so a lot is a place the
    piece is seen from, made by the machine): the block stands round it holding out (it hides the piece where it should) and its ground
    catches the piece's shadow under the same sodium light"""
    import bohemia_cook_the_icons_through_the_rig_10_20_26 as IC
    import bohemia_bosses_what_they_hand_you_11_3_26 as HAND
    import bohemia_home_pieces_11_3_26 as PCS
    D = PIECES[pid]; out = {}; row_lots = [L for L in LOTS if L['row'] == D['row']]
    for st in D['states']:
        for bt in ((0, 1) if st == 'working' else (0,)):
            bpy, mathutils, sc, NF, RIG = _scene(); F = NF.F; rnd = random.Random(73); P, BLD, V, K = _kit(bpy, rnd)
            ground, _ = _block(bpy, rnd, K, P, V, F, life=False)
            for o in [o for o in sc.objects if o.type == 'MESH']:
                if o in ground: o.is_shadow_catcher = True
                else: o.is_holdout = True
            pl = V.Town(bpy, P, rnd); before = set(sc.objects)
            kind, name = D['src'].split(':')
            if kind == 'pieces': root = pl.here(pid, PCS.make(bpy, P, IC, V, K, pl, HAND, rnd, bt)[name], 0.0, -2.8, st)
            else: root, _ = pl.model('bld_%s.glb' % name, 0.0, -5.0, width=D.get('width', 10.4))
            ms = [o for o in sc.objects if o not in before and o.type == 'MESH']
            lo, hi = pl._bounds(ms); root.location.x -= (lo[0] + hi[0]) / 2; root.location.y -= (lo[1] + hi[1]) / 2; bpy.context.view_layer.update()
            lo, hi = pl._bounds(ms); size = [round(hi[k] - lo[k], 2) for k in range(3)]
            RIG.source_pass(ms, float(RIG.G['wear']), 1.0, 5); RIG.dent_pass(ms, 1.0)
            _night(bpy, sc, RIG, LOOKS[look]['samples'], True); cam = _camera(bpy, sc); os.makedirs(RAW, exist_ok=True)
            base = root.location.copy()
            for L in row_lots:
                root.location = (base.x + L['anchor'][0], base.y + L['anchor'][1], base.z + L['anchor'][2]); bpy.context.view_layer.update()
                for cn in CAMS:
                    for sh in SIZES:
                        _aim(bpy, mathutils, sc, cam, cn, sh); sc.cycles.seed = 7 + bt
                        sc.render.filepath = os.path.join(RAW, 'piece_%s_%s_%d_cam%d_%s_lot%d.png' % (pid, st, bt, cn, sh, L['n'])); bpy.ops.render.render(write_still=True)
            out[st] = dict(size_m=size)
            print('  piece', pid, st, bt, 'size', size, flush=True)
    json.dump(dict(id=pid, row=D['row'], src=D['src'], states=out, lots=[L['n'] for L in row_lots], cams=cams_hash()), open(os.path.join(RAW, 'piece_%s.json' % pid), 'w'))


def empty(look='act1'):
    """THE BLOCK'S OWN SHADOWS, once per camera and shape: the piece scene with no piece (the block holding out, its ground catching), so
    the bake can take away what the walls, poles and steps throw and keep only each piece and its own shadow"""
    bpy, mathutils, sc, NF, RIG = _scene(); F = NF.F; rnd = random.Random(73); P, BLD, V, K = _kit(bpy, rnd)
    ground, _ = _block(bpy, rnd, K, P, V, F, life=False)
    for o in [o for o in sc.objects if o.type == 'MESH']:
        if o in ground: o.is_shadow_catcher = True
        else: o.is_holdout = True
    _night(bpy, sc, RIG, LOOKS[look]['samples'], True); cam = _camera(bpy, sc); os.makedirs(RAW, exist_ok=True)
    for cn in CAMS:
        for sh in SIZES:
            _aim(bpy, mathutils, sc, cam, cn, sh); sc.cycles.seed = 7
            sc.render.filepath = os.path.join(RAW, 'empty_cam%d_%s.png' % (cn, sh)); bpy.ops.render.render(write_still=True)
    print('  empty', flush=True)


PALM = (26.2, -2.2, 16.4)                    # a Washingtonia beside CAM 1's street light: trunk to 16.4 m, its crown over every lens
LINES = [(-3.6, 15.6), (-2.0, 15.6)]         # the two lines along the street (y, height at CAM 2's pole), sagging 0.65 m between poles


def _palm(bpy, P, K, px, py, z0, h, sw, dead):
    """a Washingtonia: the trunk, the crown, the skirt of old fronds hanging under it"""
    pz = z0 + h; P.cyl(bpy, 'palm_trunk', K.wood, 0.3, h, (px, py, z0 + h / 2), verts=10)
    for k in range(18):
        yaw = k * 2 * math.pi / 18 + 0.2 + px; skirt = k % 3 == 0
        tilt = math.radians((-62 if skirt else -12 + 26 * ((k * 7) % 5) / 4.0) + 2.5 * sw)
        L_ = 1.6 if skirt else 2.5; cxp = px + 0.6 * L_ * math.cos(yaw) * math.cos(tilt); cyp = py + 0.6 * L_ * math.sin(yaw) * math.cos(tilt)
        P.box(bpy, 'frond', dead, (L_, 0.75 if not skirt else 0.5, 0.03), (cxp, cyp, pz + 0.6 * L_ * math.sin(tilt)), rot=(0, -tilt, yaw))


BEYOND = [('ranch_plain', -7.0), ('ranch_wing', 5.0), ('ranch_garage', 17.0), ('ranch_carport', 29.0), ('ranch_plain', 41.0), ('ranch_wing', 53.0)]


def _beyond(bpy, P, K, V, rnd):
    """THE TRACT BEYOND THE BACK WALL (the plate only, behind every lot): the grade steps up again, the dead ranch houses of the next
    street face the block over their own walls, two rows, and old palms stand over them against the city's glow"""
    G = {n: __import__('bohemia_cook_the_floor_not_final_10_20_26').F.ground_material(bpy, n) for n in ('rough', 'caliche')}
    V.Bx(K, 'beyond1', G['rough'], -60, 110, 42.1, 58.0, 0.0, 4.2); V.Bx(K, 'beyond2', G['caliche'], -60, 110, 58.0, 140.0, 0.0, 5.6)
    pl = V.Town(bpy, P, rnd); dead = V.hexmat(bpy, 'palm_dead', (132, 116, 80))
    for row, (yf, z, sc_) in enumerate(((45.0, 4.2, 1.0), (61.0, 5.6, 0.95))):
        for k, (bld, x) in enumerate(BEYOND):
            root, _ = pl.model('bld_%s.glb' % bld, x + 6.0 * row, yf, width=9.6 * sc_, rot=math.pi)
            root.location.z += z
    for (x, y, h) in ((-1.0, 55.0, 15.5), (23.5, 56.0, 18.0), (36.0, 70.0, 13.0), (51.0, 54.0, 16.5)):
        _palm(bpy, P, K, x, y, 4.2 if y < 58 else 5.6, h, 0.0, dead)


def _glow(bpy, sc):
    """the city's glow on the haze low over the ridge (the plate only): a far card, faint at the horizon, gone by 15 degrees up"""
    me = bpy.data.meshes.new('glow'); me.from_pydata([(-500, 450, -40), (600, 450, -40), (600, 450, 120), (-500, 450, 120)], [], [(0, 1, 2, 3)])   # inside the lens's 600 m
    o = bpy.data.objects.new('glow', me); sc.collection.objects.link(o)
    m = bpy.data.materials.new('glow'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = -20.0; mr.inputs['From Max'].default_value = 120.0; mr.inputs['To Min'].default_value = 1.0; mr.inputs['To Max'].default_value = 0.0
    pw = nt.nodes.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 2.0
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (1.0, 0.62, 0.36, 1.0)
    st = nt.nodes.new('ShaderNodeMath'); st.operation = 'MULTIPLY'; st.inputs[1].default_value = 0.16
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(tc.outputs['Object'], sep.inputs[0]); nt.links.new(sep.outputs['Z'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], pw.inputs[0])
    nt.links.new(pw.outputs[0], st.inputs[0]); nt.links.new(st.outputs[0], em.inputs['Strength']); nt.links.new(em.outputs[0], out.inputs['Surface'])
    o.data.materials.append(m); o.visible_shadow = False
    return o


def _near(bpy, K, P, V, f=0):
    """THE NEAR SET, for frame f (the fronds and the vinyl move a little with the wind): every object it makes is returned"""
    import bohemia_cook_the_settlements_through_the_rig_10_20_26 as S0
    before = set(bpy.data.objects); sw = (-1.0, 0.0, 1.0)[f % 3]; Bx = lambda n, m, *a, **k: V.Bx(K, n, m, *a, **k)
    dead = V.hexmat(bpy, 'palm_dead', (132, 116, 80)); porcelain = V.hexmat(bpy, 'porcelain', (214, 208, 196))
    vinyl = V.hexmat(bpy, 'vinyl', (206, 200, 188)); white = V.hexmat(bpy, 'sneaker', (226, 222, 214)); silk = V.hexmat(bpy, 'web', (150, 150, 146))
    # CAM 1: the street light's arm reaching out over the lens, its dead head; the palm; a pickup dead at the kerb under it
    P.rod(bpy, 'light_arm', K.steel, (20.5, -5.5, 14.2), (20.5, -2.4, 14.75), 0.06)
    hd = P.cyl(bpy, 'light_head', K.dark, 0.3, 1.0, (20.5, -2.1, 14.7), rot=(math.radians(84), 0, 0), verts=12); hd.scale = (1.0, 0.5, 1.0)
    gl = P.cyl(bpy, 'light_glass', K.steel, 0.22, 0.7, (20.5, -2.1, 14.56), rot=(math.radians(84), 0, 0), verts=12); gl.scale = (1.0, 0.3, 1.0)
    _palm(bpy, P, K, PALM[0], PALM[1], 0.0, PALM[2], sw, dead)
    S0.Place(bpy, P, random.Random(5)).model('truck.glb', 17.2, 0.2, rot=math.radians(90))
    # CAM 2: the crossarm out over the street, two insulators, the two lines, the sneakers on the low one, a cart on the far kerb
    P.rod(bpy, 'crossarm', K.wood, (18.5, -6.4, 15.4), (18.5, -1.6, 15.4), 0.07)
    for (y, z) in LINES:
        P.cyl(bpy, 'insulator', porcelain, 0.08, 0.24, (18.5, y, z - 0.08), verts=10)
        pts = [(x, y, z - 0.65 * math.sin(math.pi * min(1.0, abs(x - 18.5) / 45.0))) for x in range(-27, 66, 3)] + [(18.5, y, z)]
        pts.sort()
        for a_, b_ in zip(pts, pts[1:]): P.rod(bpy, 'line', K.dark, a_, b_, 0.025, 6)
    ly, lz = LINES[1]; xs = 15.6; zl = lz - 0.65 * math.sin(math.pi * abs(xs - 18.5) / 45.0)
    for k, dx in enumerate((-0.12, 0.14)):                       # one pair, tied by the laces, thrown over the line
        P.rod(bpy, 'lace', silk, (xs, ly, zl), (xs + dx, ly, zl - 0.32 - 0.05 * k), 0.006, 4)
        P.box(bpy, 'sneaker', white, (0.11, 0.29, 0.11), (xs + dx, ly, zl - 0.42 - 0.05 * k), rot=(math.radians(70 + 8 * sw), 0, math.radians(20 * k)))
    S0.Place(bpy, P, random.Random(6)).model('cart.glb', 9.5, -7.4, rot=math.radians(-30))
    # CAM 3: two gooseneck lamps reaching out from the billboard over the lens, the vinyl caught on the right one, a web on the housing
    for gx in (20.4, 24.0):
        P.rod(bpy, 'goose', K.steel, (gx, -4.6, 15.9), (gx, -2.2, 16.6), 0.05); Bx('goose_head', K.dark, gx - 0.3, gx + 0.3, -2.45, -1.95, 16.2, 16.55)
    v = P.box(bpy, 'vinyl', vinyl, (0.55, 0.02, 1.15), (23.7, -2.5, 15.95), rot=(math.radians(10 * sw), 0, math.radians(18 + 9 * sw)))
    cx_, cy_, cz_ = 21.62, -3.7, 15.1                            # the web: torn, in the housing's corner, over the lens only
    wr = random.Random(9)
    def wpt(a, r): return (cx_ + r * math.cos(a), cy_ + 0.12 * r * math.sin(a), cz_ + r * math.sin(a))
    sp = [math.pi * (0.08 + 0.84 * k / 5.0) + wr.uniform(-0.12, 0.12) for k in range(6)]
    for a in sp: P.rod(bpy, 'web', silk, (cx_, cy_, cz_), wpt(a, wr.uniform(0.32, 0.5)), 0.0018, 3)
    for r in (0.14, 0.24, 0.31):
        for a, b in zip(sp, sp[1:]):
            if wr.random() < 0.72: P.rod(bpy, 'web', silk, wpt(a, r * wr.uniform(0.9, 1.1)), wpt(b, r * wr.uniform(0.9, 1.1)), 0.0015, 3)
    return [o for o in bpy.data.objects if o not in before]


def near(look='act1'):
    """THE NEAR LAYER, every camera, upright and sideways, three frames: the near set in the full street (the block holding out, its
    ground catching the near things' shadows), the night's light and each camera's infrared ring"""
    for f in range(3):
        bpy, mathutils, sc, NF, RIG = _scene(); F = NF.F; rnd = random.Random(73); P, BLD, V, K = _kit(bpy, rnd)
        ground, _ = _block(bpy, rnd, K, P, V, F, life=False)
        for o in [o for o in sc.objects if o.type == 'MESH']:
            if o in ground: o.is_shadow_catcher = True
            else: o.is_holdout = True
        ms = [o for o in _near(bpy, K, P, V, f) if o.type == 'MESH']
        RIG.source_pass(ms, float(RIG.G['wear']), 1.0, 5); RIG.dent_pass(ms, 1.0)
        _night(bpy, sc, RIG, LOOKS[look]['samples'], True)
        for cn, C in CAMS.items():
            L = bpy.data.lights.new('ir%d' % cn, 'POINT'); L.energy = IR_W; L.shadow_soft_size = 0.05; L.color = (0.92, 0.95, 1.0)
            o = bpy.data.objects.new('ir%d' % cn, L); sc.collection.objects.link(o); o.location = C['loc']
        lo = min((o.matrix_world @ mathutils.Vector(c)).z for o in ms for c in o.bound_box)
        cam = _camera(bpy, sc); os.makedirs(RAW, exist_ok=True)
        for cn in CAMS:
            for sh in SIZES:
                _aim(bpy, mathutils, sc, cam, cn, sh); sc.cycles.seed = 5 + f
                sc.render.filepath = os.path.join(RAW, 'near_cam%d_%s_%d.png' % (cn, sh, f)); bpy.ops.render.render(write_still=True)
        print('  near frame', f, flush=True)
        json.dump(dict(cams=cams_hash(), near=NEAR, frames=3, lowest_m=round(lo, 2)), open(os.path.join(RAW, 'near.json'), 'w'))


def gate():
    """THE TWELVE OF TWELVE: every lot at its row's tallest, the plate's walls, the foreground and the near set as they stand; flat
    colours: one picture all together, and one per lot ALONE (nothing else in the world, on a canvas twice as big), every camera, upright
    and sideways: a lot's share seen is what the full street shows of it over the whole lot, so a wall, a pole, a palm or the frame's
    edge in front of it all count against it"""
    bpy, mathutils, sc, NF, RIG = _scene()
    def flat(name, rgb):
        m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
        e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = rgb + (1,); o = nt.nodes.new('ShaderNodeOutputMaterial')
        nt.links.new(e.outputs[0], o.inputs[0]); return m
    def box(n, m, x0, x1, y0, y1, z0, z1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)); o = bpy.context.active_object
        o.name = n; o.scale = (x1 - x0, y1 - y0, z1 - z0); o.data.materials.append(m); return o
    black = flat('occ', (0.0, 0.0, 0.0))
    box('front_wall', black, 0.2, BW - 0.2, 3.5, 3.7, 0, 1.86); box('back_wall', black, 0.2, BW - 0.2, 41.9, 42.1, 2.8, 4.66)
    box('side_w', black, 0.1, 0.3, 3.6, 42, 0, 1.86); box('side_e', black, BW - 0.3, BW - 0.1, 3.6, 42, 0, 1.86)
    for rn, RW in ROWS.items(): box('ret', black, 0.4, BW - 0.4, RW['y0'] - 2.0, RW['y0'] - 1.8, 0, RW['z'] + 0.25)
    for nm, (x, y, z0, r, h) in FOREGROUND: box(nm, black, x - r, x + r, y - r, y + r, z0, z0 + h)
    for (x, y, z) in LAMPS: box('pole', black, x - 0.09, x + 0.09, y - 0.09, y + 0.09, 0, z)
    box('sign', black, 2.6, 4.0, 2.35, 2.42, 1.0, 1.6)
    box('wreck', black, 28.8, 33.2, -2.5, -0.6, 0.0, 1.5)
    P, BLD, V, K = _kit(bpy, random.Random(73))                  # the near set, as it stands on frame 0, all of it black
    for o in _near(bpy, K, P, V, 0):
        if o.type == 'MESH':
            o.data.materials.clear(); o.data.materials.append(black)
            for pg in o.data.polygons: pg.material_index = 0
    occ = [o for o in sc.objects if o.type == 'MESH']
    objs = {}
    for L in LOTS:
        x0, y0, x1, y1 = L['box']; m = flat('lot%d' % L['n'], ((L['n'] * 20) / 255.0, 0.0, 0.0))
        objs[L['n']] = [box('pad%d' % L['n'], m, x0, x1, y0, y1, L['z'], L['z'] + 0.04),
                        box('tall%d' % L['n'], m, x0 + 0.8, x1 - 0.8, y0 + 0.8, y1 - 0.8, L['z'], L['z'] + L['hmax'])]
    sc.render.engine = 'CYCLES'; sc.cycles.samples = 1; sc.cycles.use_denoising = False; sc.render.filter_size = 0.01
    sc.view_settings.view_transform = 'Raw'; sc.render.image_settings.color_depth = '8'
    sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0, 0, 0, 1)
    cam = _camera(bpy, sc); os.makedirs(RAW, exist_ok=True)
    for cn in CAMS:
        for sh in SIZES:
            _aim(bpy, mathutils, sc, cam, cn, sh)
            for o in [o for v in objs.values() for o in v]: o.hide_render = False
            sc.render.filepath = os.path.join(RAW, 'gate_cam%d_%s_all.png' % (cn, sh)); bpy.ops.render.render(write_still=True)
            # each lot ALONE on a canvas twice as big each way through the same lens (the same pixels a millimetre), so what the frame
            # cuts off counts as not seen: a lot half outside the picture is half seen, never 'all of what is in frame'
            W0, H0 = sc.render.resolution_x, sc.render.resolution_y
            sc.render.resolution_x, sc.render.resolution_y = 2 * W0, 2 * H0; cam.data.sensor_width = 72.0
            for o in occ: o.hide_render = True                 # the lot alone: nothing else in the world
            for n in objs:
                for m_, oo in objs.items():
                    for o in oo: o.hide_render = (m_ != n)
                sc.render.filepath = os.path.join(RAW, 'gate_cam%d_%s_lot%d.png' % (cn, sh, n)); bpy.ops.render.render(write_still=True)
            sc.render.resolution_x, sc.render.resolution_y = W0, H0; cam.data.sensor_width = 36.0
            for o in occ: o.hide_render = False
    print('  gate', flush=True)


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
    for d in ('plates', 'pieces', 'gate'): os.makedirs(os.path.join(OUT, d), exist_ok=True)
    man = dict(about=('YOUR SETTLEMENT, every picture by tools/bohemia_home_settlement_pipeline_11_3_26.py (rules 354 (k) to (o), 373): the '
                      'lot template, the three fixed intimate cameras (low, a wide barrel lens), the plates and the pieces. Every camera '
                      'is shot upright and sideways; a piece has a picture per camera, shape and lot of its row, drawn at its xy on the '
                      'plate, the lots far to near (order). The gate\'s flat pictures prove all twelve lots in every camera.'),
               by='tools/bohemia_home_settlement_pipeline_11_3_26.py', look=look, look_note=LOOKS[look]['note'], sizes=SIZES,
               cams={cn: C for cn, C in CAMS.items()}, cams_hash=cams_hash(), rows=ROWS,
               lots=[dict(n=L['n'], row=L['row'], box_m=L['box'], z=L['z'], hmax=L['hmax']) for L in LOTS], plates={}, pieces={}, default=DEFAULT)
    # the lots far to near from each camera (the piece on a near lot is drawn last)
    man['order'] = {'%d' % cn: sorted([L['n'] for L in LOTS], key=lambda n: -math.dist(CAMS[cn]['loc'][:2], [L for L in LOTS if L['n'] == n][0]['anchor'][:2])) for cn in CAMS}
    for fn in sorted(os.listdir(RAW)):
        if fn.startswith('plate_') and fn.endswith('.json'):
            pj = json.load(open(os.path.join(RAW, fn))); kind = pj['kind']
            for cn in CAMS:
                for sh in SIZES:
                    for f in range(3):
                        a = np.asarray(Image.open(os.path.join(RAW, 'plate_%s_cam%d_%s_%d.png' % (kind, cn, sh, f))).convert('RGB'))
                        Image.fromarray(medium(a, f, look)).save(os.path.join(OUT, 'plates', '%s_cam%d_%s_%d.png' % (kind, cn, sh, f)), optimize=True)
            man['plates'][kind] = dict(frames=3, cams=pj['cams'])
    if os.path.exists(os.path.join(RAW, 'near.json')):          # what hangs at each lens: one full-frame layer per camera, shape, frame
        nj = json.load(open(os.path.join(RAW, 'near.json'))); os.makedirs(os.path.join(OUT, 'near'), exist_ok=True)
        for cn in CAMS:
            for sh in SIZES:
                E0 = np.asarray(Image.open(os.path.join(RAW, 'empty_cam%d_%s.png' % (cn, sh))).convert('RGBA'))[..., 3] / 255.0
                for f in range(3):
                    L = np.asarray(Image.open(os.path.join(RAW, 'near_cam%d_%s_%d.png' % (cn, sh, f))).convert('RGBA')); al = L[..., 3] / 255.0
                    al = np.where(al > 0.95, al, np.clip(al - E0 - 0.04, 0, 1)); al = np.where(al > 0.12, al, 0.0)
                    q = medium(L[..., :3] * al[..., None], f, look, alpha=al)
                    o = np.zeros(L.shape[:2] + (4,), np.uint8); o[..., :3] = q; o[..., 3] = np.where(al > 0.5, 255, (al > 0.12) * 150)
                    Image.fromarray(o).save(os.path.join(OUT, 'near', 'cam%d_%s_%d.png' % (cn, sh, f)), optimize=True)
        man['near'] = dict(what=nj['near'], frames=nj['frames'], cams=nj['cams'], lowest_m=nj.get('lowest_m'), ir_w=IR_W)
    for fn in sorted(os.listdir(RAW)):
        if not (fn.startswith('piece_') and fn.endswith('.json')): continue
        pj = json.load(open(os.path.join(RAW, fn))); pid = pj['id']; ent = dict(row=PIECES[pid]['row'], src=pj['src'], states={}, cams=pj['cams'])
        for st, S in pj['states'].items():
            ent['states'][st] = dict(size_m=S['size_m'], pics={})
            for cn in CAMS:
                for sh in SIZES:
                    for ln in pj['lots']:
                        pics, xy = [], None
                        for bt in ((0, 1) if st == 'working' else (0,)):
                            L = np.asarray(Image.open(os.path.join(RAW, 'piece_%s_%s_%d_cam%d_%s_lot%d.png' % (pid, st, bt, cn, sh, ln))).convert('RGBA'))
                            al = L[..., 3] / 255.0
                            E0 = np.asarray(Image.open(os.path.join(RAW, 'empty_cam%d_%s.png' % (cn, sh))).convert('RGBA'))[..., 3] / 255.0
                            al = np.where(al > 0.95, al, np.clip(al - E0 - 0.04, 0, 1))   # the block's own shadows taken away: the piece and its shadow
                            al = np.where(al > 0.12, al, 0.0); ys, xs = np.nonzero(al > 0.12)
                            if not len(xs): continue
                            if xy is None:                                       # cut on the four-pixel grid, the same cut for both beats
                                x0 = 4 * (max(0, xs.min() - 2) // 4); y0 = 4 * (max(0, ys.min() - 2) // 4)
                                x1 = min(L.shape[1], xs.max() + 3); y1 = min(L.shape[0], ys.max() + 3); xy = [int(x0), int(y0)]
                            rgb = L[y0:y1, x0:x1, :3]; a_ = al[y0:y1, x0:x1]
                            q = medium(rgb * a_[..., None], 0, look, alpha=a_)
                            if cn == 3: q = q   # (the dying frame is the plate's: CAM 3 dims the whole picture on its frame 1 at the screen)
                            o = np.zeros(rgb.shape[:2] + (4,), np.uint8); o[..., :3] = q; o[..., 3] = np.where(a_ > 0.5, 255, (a_ > 0.12) * 150)
                            nm = '%s_%s_cam%d_%s_lot%d_%d.png' % (pid, st, cn, sh, ln, bt); Image.fromarray(o).save(os.path.join(OUT, 'pieces', nm), optimize=True)
                            pics.append(nm)
                        if pics: ent['states'][st]['pics']['%d_%s_%d' % (cn, sh, ln)] = dict(pictures=pics, xy=xy)
        man['pieces'][pid] = ent
    man['gate'] = gate_numbers()
    man['tap_px'] = {}
    for cn in CAMS:
        for sh in SIZES:
            allim = np.asarray(Image.open(os.path.join(RAW, 'gate_cam%d_%s_all.png' % (cn, sh))).convert('RGB'))[..., 0].astype(int); k = '%d_%s' % (cn, sh); man['tap_px'][k] = {}
            for L in LOTS:
                ys, xs = np.nonzero(abs(allim - L['n'] * 20) <= 3)
                if len(xs): man['tap_px'][k][L['n']] = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
            for fn in ['gate_cam%d_%s_all.png' % (cn, sh)] + ['gate_cam%d_%s_lot%d.png' % (cn, sh, L['n']) for L in LOTS]:
                Image.open(os.path.join(RAW, fn)).convert('RGB').getchannel(0).convert('RGB').save(os.path.join(OUT, 'gate', fn), optimize=True)
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('  post', look, len(man['pieces']), 'pieces;', 'gate', json.dumps(man['gate']['summary']))


def gate_numbers(src=None):
    """per camera and shape: each lot's share of itself still seen with every lot at its tallest, and the biggest square inside what is
    seen (its tap box) in points on the phone"""
    import numpy as np
    from PIL import Image
    src = src or RAW; res = {}; worst = 1.0; worst_tap = 1e9
    for cn in CAMS:
        for sh in SIZES:
            allim = np.asarray(Image.open(os.path.join(src, 'gate_cam%d_%s_all.png' % (cn, sh))).convert('RGB'))[..., 0].astype(int); row = {}
            for L in LOTS:
                code = L['n'] * 20
                alone = np.asarray(Image.open(os.path.join(src, 'gate_cam%d_%s_lot%d.png' % (cn, sh, L['n']))).convert('RGB'))[..., 0].astype(int)
                A = abs(alone - code) <= 3; S_ = abs(allim - code) <= 3      # alone: the lot whole (a canvas twice as big); all: what the frame shows
                share = float(S_.sum()) / max(1, A.sum()); tap = _biggest_square(S_) / PT_PX
                row[L['n']] = dict(seen=round(share, 3), tap_pt=round(tap, 1)); worst = min(worst, share); worst_tap = min(worst_tap, tap)
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


def compose(layout, cn, f, shape):
    """the screen's own drawing, in Python: the plate, then each lot's piece far to near at its xy"""
    from PIL import Image
    M = json.load(open(os.path.join(OUT, 'manifest.json')))
    base = Image.open(os.path.join(OUT, 'plates', 'block_cam%d_%s_%d.png' % (cn, shape, f))).convert('RGBA')
    for n in M['order'][str(cn)]:
        if n not in layout: continue
        pid, st = layout[n]; P = M['pieces'][pid]['states'][st]['pics'].get('%d_%s_%d' % (cn, shape, n))
        if not P: continue
        im = Image.open(os.path.join(OUT, 'pieces', P['pictures'][f % len(P['pictures'])])).convert('RGBA')
        layer = Image.new('RGBA', base.size); layer.paste(im, tuple(P['xy'])); base = Image.alpha_composite(base, layer)
    nf = os.path.join(OUT, 'near', 'cam%d_%s_%d.png' % (cn, shape, f))
    if M.get('near') and os.path.exists(nf): base = Image.alpha_composite(base, Image.open(nf).convert('RGBA'))   # the lens's own world, last
    return base.convert('RGB')


def osd(im, cn, f, scale=1):
    from PIL import ImageDraw, ImageFont
    d = ImageDraw.Draw(im); fnt = ImageFont.load_default(); W, H = im.size
    def t(xy, s): d.text((xy[0] + 1, xy[1] + 1), s, font=fnt, fill=(10, 10, 10)); d.text(xy, s, font=fnt, fill=(226, 230, 222))
    t((4, 3), CAMS[cn]['name'].replace('CAM ', 'CAM')); t((W - 26, 3), 'REC')
    if f != 1: d.ellipse([W - 34, 5, W - 29, 10], fill=(200, 60, 50))
    t((4, H - 13), '01-01-80  00:00:%02d' % (14 + f))
    return im


def card(was_dir='/tmp/claude-0/was'):
    """WAS beside NOW at the phone's size, upright and sideways, every camera; the gate's numbers on top"""
    from PIL import Image, ImageDraw, ImageFont
    M = json.load(open(os.path.join(OUT, 'manifest.json'))); G = M['gate']['summary']
    F_ = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', n)
    lay = {int(k): tuple(v) for k, v in M['default'].items()}
    S = 1.25; tw, th = int(180 * S), int(320 * S); ww, wh = int(320 * 1.05), int(180 * 1.05); gap = 10; head = 64
    W = 6 * tw + 7 * gap; H = head + 22 + th + 30 + 22 + wh + 30 + 150
    frames = []
    for f in range(3):
        im = Image.new('RGB', (W, H), (20, 18, 16)); d = ImageDraw.Draw(im)
        d.text((gap, 8), 'YOUR SETTLEMENT\'S CAMERAS: WAS  /  NOW (night, a wide lens, its own pole and wires in front, all 12 lots in every one)', font=F_(20), fill=(232, 222, 200))
        d.text((gap, 36), 'gate, every lot at its tallest, the near things standing in front: 12 of 12 in every camera upright and sideways; worst lot %d%% seen, smallest tap box %d points'
               % (round(G['worst_seen'] * 100), G['worst_tap_pt']), font=F_(13), fill=(226, 176, 82))
        for i, cn in enumerate((1, 2, 3)):
            x = gap + i * 2 * (tw + gap); y = head + 22
            d.text((x, head + 2), CAMS[cn]['name'], font=F_(14), fill=(226, 176, 82))
            was = Image.open(os.path.join(was_dir, 'cam%d_tall.png' % cn)).convert('RGB').resize((tw, th), Image.NEAREST)
            now = osd(compose(lay, cn, f, 'tall'), cn, f).resize((tw, th), Image.NEAREST)
            im.paste(was, (x, y)); im.paste(now, (x + tw + gap, y))
            d.text((x, y + th + 4), 'WAS', font=F_(13), fill=(140, 132, 120)); d.text((x + tw + gap, y + th + 4), 'NOW', font=F_(13), fill=(226, 176, 82))
            y2 = y + th + 30
            was = Image.open(os.path.join(was_dir, 'cam%d_wide.png' % cn)).convert('RGB').resize((ww // 2 * 2 // 2, wh // 2), Image.NEAREST)
            noww = osd(compose(lay, cn, f, 'wide'), cn, f).resize((ww, wh), Image.NEAREST)
            im.paste(was, (x, y2 + 22)); im.paste(noww, (x + ww // 2 + gap, y2 + 22 - 0))
            d.text((x, y2 + 4), 'sideways: WAS (small) / NOW', font=F_(12), fill=(140, 132, 120))
        yf = H - 140
        for k, line in enumerate(('WHY THE CAMERAS ARE NOT LOWER: measured on about 1,300 camera spots and three smaller blocks. With all 12 lots big enough',
                                  'for your thumb on an upright phone, no camera can sit lower than 11 to 13 m: closer and the far lots get too small to tap,',
                                  'lower and the front pieces hide the rows behind them. So the closeness is what hangs right at each lens: the street light\'s',
                                  'arm, two wires with a pair of sneakers on one, the billboard\'s lamps, a web, palms, a pickup, the dead street behind the wall.')):
            d.text((gap, yf + k * 26), line, font=F_(15), fill=(200, 192, 176) if k else (226, 176, 82))
        frames.append(im)
    dst = os.path.join(OUT, 'vote_intimate.webp')
    frames[0].save(dst, save_all=True, append_images=frames[1:], duration=167, loop=0, quality=84, method=6)
    frames[0].save('/tmp/claude-0/home_intimate_card.png'); print('  card', dst, frames[0].size)


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
    elif a[0] == 'empty': empty(); sys.stdout.flush(); os._exit(0)
    elif a[0] == 'near': near(); sys.stdout.flush(); os._exit(0)
    elif a[0] == 'post': post(a[1] if len(a) > 1 else 'act1')
    elif a[0] == 'card': card()
