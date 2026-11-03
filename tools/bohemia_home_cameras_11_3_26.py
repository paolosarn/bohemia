#!/usr/bin/env python3
"""BOHEMIA -- HOME, YOUR SETTLEMENT THROUGH ITS OWN CAMERAS: THE LOOK TEST (rule 354, ask lines 368 and 369; 11/3/26).
SUPERSEDED THE SAME ROUND by tools/bohemia_home_settlement_pipeline_11_3_26.py (rule 354 (g) to (o): every camera sees all twelve lots,
the cameras cycle on their own, one lot template, three fixed cameras, one script). Kept as the first try; its pictures are removed.
Paolo 11/3: 'it was always going to be A... like the loading screens how it's giving like security camera footage and like the camera
upgrades over the ages... PS1 security camera footage of our settlement vibes... a little more intimate for when it's our shit... the
rest of the city can be how it is... it works the exact same way'.

WHAT THIS MAKES: direction A (THE BLOCK YOU TOOK, records/BOHEMIA_HOME_RESEARCH_ROUND_3_OUR_ONE_SCREEN_11_3_26.md) built ONCE in 3D from
the kit we have, and shot by the three security cameras of rule 354(e), in act one's look, tall 9:16 and wide 16:9 (rule 348):
  CAM 1 THE GATE    high on the gate's east pilaster, looking up the drive to the turning circle
  CAM 2 THE YARDS   on a pole in the pool yard's north-west corner, looking down the backyards and the west houses
  CAM 3 THE ROOFS   on a pole in the north-east corner, the whole block over the roofs
THE BLOCK: a walled Las Vegas cul-de-sac 60 m square (8-inch block walls 1.8 m, pilasters every 6 m, a rolling steel gate), one drive in
from the south to a turning circle, five ranch houses round it, backyards to the wall, an empty pool, a burned lot. TWELVE LOTS (LOTS
below), each a box in metres, projected into every camera as its tap box.
THE KIT, NONE OF IT NEW: COOK's ranch houses (tools/bohemia_cook_model_buildings.py BUILDERS, built by the modeller as the town screens do),
the game's glbs (reference/models/bohemia: truck, wreck, trailer, shed, drums, tyres, propane, streetlight, stop_sign, fence, rubble),
COOK PROPS' suburbs pieces (reference/models/bohemia/fight_props: the empty pool, the swing, the trampoline), the floor tool's ground, the
master rig's source pass and sun (as the town render runs them). Only the block wall and the gate are boxes, like every town's walls.
THE LOOK, AT THE SOURCE (the starred loading screen's pipeline, tools/bohemia_ui_the_first_minute_feeds.py, imported, never edited):
rendered SMALL (PS1 era: 180 x 320 upright, 320 x 180 sideways) at a handful of samples with no denoiser, so the grain is the render's
own and moves frame to frame; the rig's population snap; the feeds' own CCTV tape (scene B: mono, interlace, the head-switching tear);
then the PS1's colour depth, 32 levels a channel through a 4 x 4 ordered dither; the camera's own on-screen text in a bitmap font at the
source size (a time stamp that is wrong: the clock reset to 1980 when the power died); CAM 3 is the dying one (its exposure drops on a
frame, at the render); six pictures a second (the feeds' CCTV rate). Shown at four times its pixels, never smoothed.

  /tmp/v/bin/python tools/bohemia_home_cameras_11_3_26.py render [--samples 8]
  python3 tools/bohemia_home_cameras_11_3_26.py post        -> records/target/home_cameras/cam<N>_<tall|wide>_<f>.png, lots.json
  python3 tools/bohemia_home_cameras_11_3_26.py card        -> records/target/home_cameras/vote_look_test.webp (the VOTE card)
"""
import os, sys, json, math, random

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
OUT = os.path.join(R, 'records/target/home_cameras')
RAW = '/tmp/claude-0/home_cameras_raw'
MODELS = os.path.join(R, 'reference/models/bohemia')
SIZES = {'tall': (180, 320), 'wide': (320, 180)}
FRAMES = 3

# THE TWELVE LOTS: (number, name, x0, y0, x1, y1, height m); the block is 60 x 60 m, the gate on the south wall at x 26..34
LOTS = [
    (1, 'THE GATE', 22, 1, 38, 9, 2.6), (2, 'WEST VERGE', 4, 3, 21, 10, 1.5), (3, 'THE DRIVE', 25, 10, 35, 24, 1.5),
    (4, 'HOUSE SW', 9, 11, 23, 22, 4.5), (5, 'HOUSE SE', 37, 11, 51, 22, 4.5), (6, 'HOUSE W', 8, 26, 21, 38, 4.5),
    (7, 'HOUSE E', 39, 26, 52, 38, 4.5), (8, 'HOUSE N', 22, 44, 38, 56, 4.5), (9, 'THE CIRCLE', 21, 25, 39, 43, 1.0),
    (10, 'WEST YARDS', 3, 11, 9, 40, 1.8), (11, 'THE BURNED LOT', 40, 41, 57, 57, 1.5), (12, 'THE POOL YARD', 3, 41, 21, 57, 1.8)]
# THE CAMERAS: where it hangs, what it looks at, its lens per shape, and the lots it is FOR (four to six, a thumb wide each)
CAMS = {
    1: dict(name='CAM 1 THE GATE', loc=(35.6, 1.2, 7.0), at={'tall': (30.0, 9.6, 0.0), 'wide': (29.4, 15.0, 0.0)}, lens={'tall': 18, 'wide': 14}, lots=[1, 2, 3, 4, 5, 9]),
    2: dict(name='CAM 2 THE YARDS', loc=(4.0, 56.0, 5.5), at={'tall': (11.0, 38.0, 0.0), 'wide': (14.0, 40.0, 0.0)}, lens={'tall': 18, 'wide': 15}, lots=[12, 10, 6, 4, 2]),
    3: dict(name='CAM 3 THE ROOFS', loc=(57.4, 57.4, 14.0), at={'tall': (43.3, 43.3, 0.0), 'wide': (36.2, 36.2, 0.0)}, lens={'tall': 18, 'wide': 13}, lots=[11, 8, 7, 9, 5, 3]),
}


def render(samples=8):
    import bpy, mathutils
    import numpy as np
    from bpy_extras.object_utils import world_to_camera_view
    import bohemia_cook_model_props as P
    import bohemia_cook_model_buildings as BLD
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    import bohemia_cook_the_settlements_through_the_rig_10_20_26 as S
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    F = NF.F; RIG = NF.RIG
    rnd = random.Random(354)
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    NF.LEDGER.clear(); NF.LEDGER.update(bid='home.cameras', seed=3, fires=[])

    # THE GROUND (the floor tool's own, painted in metres on its 60 m square): the edge's caliche, the drive and the circle in asphalt,
    # a concrete ring of walk round the circle, the backyards' rough dirt, the burned lot's char-dark rough
    ID = F.ID; g = np.full((F.H, F.W), ID['caliche'], np.uint8)
    def rows(ya, yb): return int((60 - yb) / 60 * F.H), int((60 - ya) / 60 * F.H)
    def cols(xa, xb): return int(xa / 60 * F.W), int(xb / 60 * F.W)
    def band(ya, yb, what, xa=0.0, xb=60.0):
        ra, rb = rows(ya, yb); ca, cb = cols(xa, xb); g[max(0, ra):rb, max(0, ca):cb] = ID[what]
    yy, xx = np.mgrid[0:F.H, 0:F.W]; my = 60 - (yy + 0.5) / F.H * 60; mx = (xx + 0.5) / F.W * 60
    for (x0, y0, x1, y1) in ((3, 11, 9, 40), (40, 41, 57, 57), (3, 41, 21, 57), (4, 3, 21, 10), (39, 3, 56, 10)):   # yards, the burned lot, the verges
        band(y0, y1, 'rough', x0, x1)
    band(0, 26, 'asphalt', 26, 34)
    d = np.hypot(mx - 30, my - 34)
    g[(d < 10.6) & (d >= 9.0)] = ID['concrete']; g[d < 9.0] = ID['asphalt']; g[d < 3.2] = ID['rough']
    for x in (24.6, 34.2): band(10, 25.5, 'concrete', x, x + 1.2)   # the walks along the drive
    objs, gg = F.build(bpy, g, 354, True)
    import bmesh                                                     # the pool is a pit: its ground cut to the rim (COOK PROPS' own way)
    me = objs[0].data; bm = bmesh.new(); bm.from_mesh(me)
    kill = [f for f in bm.faces if ((f.calc_center_median().x - 11.0) / (4.5 * 1.02)) ** 2 + ((f.calc_center_median().y - 47.0) / (2.3 * 1.06)) ** 2 < 1.0]
    bmesh.ops.delete(bm, geom=kill, context='FACES'); bm.to_mesh(me); bm.free()
    F.scene(bpy, objs)
    for o in objs: o.scale = (1, 1, 1)                                # the 45-degree stretch is the town camera's; these are real lenses

    town = dict(name='Home', slug='home', plan={'palette': {}}, fac='#8c7a5e')
    K = V.Kit(bpy, P, BLD, town, rnd)
    pl = V.Town(bpy, P, rnd)
    blk = V.hexmat(bpy, 'block_wall', (176, 164, 144)); cap = V.hexmat(bpy, 'block_cap', (150, 140, 124))
    Bx = lambda n, m, *a, **k: V.Bx(K, n, m, *a, **k)

    def wall(x0, y0, x1, y1, gap=None):
        """an 8-inch block wall, 1.8 m, its cap, a pilaster every 6 m (Clark County's tract wall)"""
        L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L
        segs = [(0, L)] if not gap else [(0, gap[0]), (gap[1], L)]
        for a, b in segs:
            if b - a < 0.2: continue
            ax, ay, bx, by = x0 + ux * a, y0 + uy * a, x0 + ux * b, y0 + uy * b
            if abs(uy) < 1e-6: Bx('wall', blk, min(ax, bx), max(ax, bx), ay - 0.1, ay + 0.1, 0, 1.8); Bx('cap', cap, min(ax, bx), max(ax, bx), ay - 0.13, ay + 0.13, 1.8, 1.86)
            else: Bx('wall', blk, ax - 0.1, ax + 0.1, min(ay, by), max(ay, by), 0, 1.8); Bx('cap', cap, ax - 0.13, ax + 0.13, min(ay, by), max(ay, by), 1.8, 1.86)
            t = a
            while t <= b + 1e-6:
                px, py = x0 + ux * t, y0 + uy * t
                Bx('pilaster', blk, px - 0.22, px + 0.22, py - 0.22, py + 0.22, 0, 2.05); t += 6.0
    pl.here('wall_s', wall, 2, 2, 58, 2, gap=(23.4, 32.6))
    pl.here('wall_n', wall, 2, 58, 58, 58); pl.here('wall_w', wall, 2, 2, 2, 58); pl.here('wall_e', wall, 58, 2, 58, 58)

    def gate():
        """the gate: two pilasters 2.4 m, a rolling steel gate half open on its track, the keypad post"""
        for x in (25.3, 34.7): Bx('gate_pier', blk, x - 0.35, x + 0.35, 1.65, 2.35, 0, 2.4); Bx('gate_cap', cap, x - 0.42, x + 0.42, 1.58, 2.42, 2.4, 2.52)
        Bx('gate_rail', K.steel, 29.0, 37.5, 1.9, 2.1, 1.6, 1.68); Bx('gate_rail', K.steel, 29.0, 37.5, 1.9, 2.1, 0.08, 0.16)
        for k in range(20): x = 29.1 + k * 0.42; Bx('gate_bar', K.dark, x - 0.02, x + 0.02, 1.96, 2.04, 0.08, 1.68)
        Bx('track', K.steel, 25.6, 38.0, 1.95, 2.05, 0, 0.03)
        Bx('keypad', K.steel, 23.9, 24.05, 3.4, 3.55, 0, 1.2)
    pl.here('gate', gate)
    CAMBOX = []
    def cam_body(x, y, z, yaw):
        """the security cameras themselves, where they hang (a box and a hood on a bracket)"""
        Bx('cam_bracket', K.steel, x - 0.03, x + 0.03, y - 0.03, y + 0.03, z - 0.25, z)
        P.box(bpy, 'cam_body', K.bone, (0.28, 0.12, 0.12), (x, y, z - 0.3), rot=(0, 0, yaw))
    pl.here('cam1_pole', lambda: P.cyl(bpy, 'cam_pole', K.steel, 0.06, 6.6, (35.6, 0.75, 3.3), verts=8))
    pl.here('cam2_pole', lambda: P.cyl(bpy, 'cam_pole', K.steel, 0.07, 5.2, (3.7, 56.3, 2.6), verts=8))
    pl.here('cam3_pole', lambda: P.cyl(bpy, 'cam_pole', K.steel, 0.09, 11.0, (57.6, 57.6, 5.5), verts=10))

    # THE HOUSES: COOK's ranches, built by the modeller, facing the circle
    for (kind, x, yf, rz) in (('bld_ranch_garage.glb', 16.0, 11.4, 90), ('bld_ranch_porch.glb', 44.0, 11.4, -90), ('bld_ranch_plain.glb', 14.5, 26.5, 90),
                              ('bld_ranch_wing.glb', 45.5, 26.5, -90), ('bld_ranch_carport.glb', 30.0, 45.0, 0)):
        pl.model(kind, x, yf, rot=math.radians(rz))
    # THE YARDS: the fences between them, the pool, the swing, the trampoline, the burned lot's rubble and a wreck
    for (glb, x, y, rz, s) in (('fight_props/suburbs_pool.glb', 11.0, 47.0, 0, 1.0), ('fight_props/suburbs_swing.glb', 16.5, 53.5, 0, 1.0),
                               ('fight_props/suburbs_trampoline.glb', 5.8, 30.5, 0, 1.0), ('wreck.glb', 47.0, 46.0, 30, 1.0), ('rubble.glb', 51.0, 51.5, 0, 1.0),
                               ('truck.glb', 31.5, 18.0, 90, 1.0), ('wreck.glb', 36.0, 31.0, -60, 1.0), ('trailer.glb', 9.0, 4.0, 0, 1.0),
                               ('shed.glb', 17.5, 43.0, 0, 1.0), ('drums.glb', 42.5, 5.2, 0, 1.0), ('tyres.glb', 45.0, 4.8, 0, 1.0),
                               ('propane.glb', 5.0, 15.0, 0, 1.0), ('streetlight.glb', 21.8, 33.5, 0, 1.0), ('stop_sign.glb', 25.0, 9.5, 0, 1.0)):
        root, _ = pl.model(glb, x, y, rot=math.radians(rz), scale=s)
        if 'pool' in glb:                                             # a pit: its deck at the ground, its bottom below it
            lo, hi = pl._bounds([o for o in root.children_recursive if o.type == 'MESH']); root.location.z -= hi[2] - 0.04
    for (x0, y0, x1, y1) in ((3, 24, 9, 24), (3, 40, 21, 40), (40, 40, 57, 40), (51, 24, 57, 24)):   # yard fences: block, like the wall
        pl.here('yard_wall', wall, x0, y0, x1, y1)

    meshes = [o for o in sc.objects if o.type == 'MESH' and o not in objs]
    RIG.source_pass(meshes, float(RIG.G['wear']), 1.0, 5); RIG.dent_pass(meshes, 1.0)
    sun = RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sc.render.film_transparent = False
    sc.cycles.samples = samples; sc.cycles.use_denoising = False; sc.cycles.use_adaptive_sampling = False
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    sc.render.resolution_percentage = 100; sc.render.filter_size = 0.6
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    cd = bpy.data.cameras.new('sec'); cam = bpy.data.objects.new('sec', cd); sc.collection.objects.link(cam); sc.camera = cam
    cd.sensor_fit = 'AUTO'; cd.sensor_width = 36.0; cd.clip_start = 0.1; cd.clip_end = 400
    os.makedirs(RAW, exist_ok=True); boxes = {}
    ev0 = sc.view_settings.exposure
    for cn, C in CAMS.items():
        cam.location = C['loc']
        for asp, (W, H) in SIZES.items():
            dv = mathutils.Vector(C['at'][asp]) - mathutils.Vector(C['loc'])
            cam.rotation_euler = dv.to_track_quat('-Z', 'Y').to_euler()
            sc.render.resolution_x, sc.render.resolution_y = W, H; cd.lens = C['lens'][asp]
            bpy.context.view_layer.update()
            bb = {}
            for (n, nm, x0, y0, x1, y1, h) in LOTS:
                pts = [world_to_camera_view(sc, cam, mathutils.Vector((x, y, z))) for x in (x0, x1) for y in (y0, y1) for z in (0, h)]
                if any(p.z <= 0 for p in pts): continue
                xs = [p.x * W for p in pts]; ys = [(1 - p.y) * H for p in pts]
                b = [max(0, min(xs)), max(0, min(ys)), min(W, max(xs)), min(H, max(ys))]
                if b[2] - b[0] > 2 and b[3] - b[1] > 2: bb[n] = [round(v, 1) for v in b]
            boxes['%d_%s' % (cn, asp)] = bb
            for f in range(FRAMES):
                sc.cycles.seed = 11 * f + cn
                sc.view_settings.exposure = ev0 + (-1.6 if (cn == 3 and f == 1) else 0.0)   # CAM 3 is dying: it drops a stop and a half on a frame
                sc.render.filepath = os.path.join(RAW, 'cam%d_%s_%d.png' % (cn, asp, f))
                bpy.ops.render.render(write_still=True)
            print('  shot', C['name'], asp, flush=True)
    sc.view_settings.exposure = ev0
    json.dump(dict(lots=[dict(n=n, name=nm, box_m=[x0, y0, x1, y1], h=h) for (n, nm, x0, y0, x1, y1, h) in LOTS],
                   cams={cn: dict(name=C['name'], loc=C['loc'], at=C['at'], lens=C['lens'], lots=C['lots']) for cn, C in CAMS.items()},
                   boxes_px=boxes, sizes=SIZES), open(os.path.join(RAW, 'lots.json'), 'w'), indent=1)


BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def post():
    """the starred feeds' CCTV medium (their own tape(), scene B), then the PS1's colour depth through an ordered dither, then the
    camera's own text, all at the source size"""
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    import bohemia_ui_the_first_minute_feeds as FEED
    import bohemia_direction_master_rig as RIG
    pop, nb, nf = RIG.population('prop')
    os.makedirs(OUT, exist_ok=True)
    fnt = ImageFont.load_default()
    bay = (np.array(BAYER) + 0.5) / 16.0 - 0.5
    meta = json.load(open(os.path.join(RAW, 'lots.json')))
    for cn, C in CAMS.items():
        for asp, (W, H) in SIZES.items():
            for f in range(FRAMES):
                a = np.asarray(Image.open(os.path.join(RAW, 'cam%d_%s_%d.png' % (cn, asp, f))).convert('RGB')).astype(float)
                b = np.clip((a // 8).astype(int), 0, 31)
                a = a + (pop[b[..., 0], b[..., 1], b[..., 2]] - a) * 0.3
                t = FEED.tape('B', a, f, None).astype(float)
                d = np.tile(bay, (H // 4 + 1, W // 4 + 1))[:H, :W, None]
                q = np.clip(np.floor(t / 8.0 + d + 0.5) * 8.0, 0, 255).astype(np.uint8)   # 32 levels a channel: the PS1's 15-bit colour
                im = Image.fromarray(q); dr = ImageDraw.Draw(im)
                def txt(xy, s, c=(226, 230, 222)):
                    dr.text((xy[0] + 1, xy[1] + 1), s, font=fnt, fill=(10, 10, 10)); dr.text(xy, s, font=fnt, fill=c)
                txt((4, 3), 'CAM%d %s' % (cn, C['name'].split(' ', 2)[2]))
                if f != 1: dr.ellipse([W - 34, 5, W - 29, 10], fill=(200, 60, 50))
                txt((W - 26, 3), 'REC')
                txt((4, H - 13), '01-01-80  00:00:%02d' % (14 + f))
                im.save(os.path.join(OUT, 'cam%d_%s_%d.png' % (cn, asp, f)))
    json.dump(meta, open(os.path.join(OUT, 'lots.json'), 'w'), indent=1)
    print('  post', len(CAMS) * len(SIZES) * FRAMES, 'frames; snap toward', nb, 'colours')


def project(cn, asp, pts):
    """the security camera's own pinhole (the render's: sensor 36 mm on the longer side, looking at its target, world up), metres -> px"""
    import numpy as np
    C = CAMS[cn]; W, H = SIZES[asp]; loc = np.array(C['loc'], float); at = np.array(C['at'][asp], float)
    fw = at - loc; fw /= np.linalg.norm(fw); rt = np.cross(fw, (0, 0, 1.0)); rt /= np.linalg.norm(rt); up = np.cross(rt, fw)
    fpx = C['lens'][asp] / 36.0 * max(W, H)
    cam = [((np.array(p, float) - loc) @ rt, (np.array(p, float) - loc) @ up, (np.array(p, float) - loc) @ fw) for p in pts]
    near, poly = 0.3, []                                           # what runs under the lens is clipped at the lens, never dropped
    for i in range(len(cam)):
        a, b = cam[i], cam[(i + 1) % len(cam)]
        if a[2] >= near: poly.append(a)
        if (a[2] >= near) != (b[2] >= near):
            t = (near - a[2]) / (b[2] - a[2]); poly.append(tuple(a[k] + (b[k] - a[k]) * t for k in range(3)))
    if len(poly) < 3: return None
    return [(W / 2 + fpx * x / z, H / 2 - fpx * y / z) for x, y, z in poly]


def footprints(cn, asp):
    """each lot the camera is for, as its outline on the ground in the picture"""
    out = {}
    for (n, nm, x0, y0, x1, y1, h) in LOTS:
        if n not in CAMS[cn]['lots']: continue
        q = project(cn, asp, [(x0, y0, 0), (x1, y0, 0), (x1, y1, 0), (x0, y1, 0)])
        if q: out[n] = q
    return out


def coverage():
    """which lots each camera shows a thumb wide (the lot's outline, clipped to the picture, at least 11 percent of the picture's width
    both ways: 44 points of a 390-point phone)"""
    res = {}
    for cn in CAMS:
        for asp, (W, H) in SIZES.items():
            ok = []
            for (n, nm, x0, y0, x1, y1, h) in LOTS:                  # the lot as the eye sees it: its ground and its height (a house's roof)
                if n not in CAMS[cn]['lots']: continue
                q = (project(cn, asp, [(x0, y0, 0), (x1, y0, 0), (x1, y1, 0), (x0, y1, 0)]) or []) + (project(cn, asp, [(x0, y0, h), (x1, y0, h), (x1, y1, h), (x0, y1, h)]) or [])
                if not q: continue
                xs = [min(max(x, 0), W) for x, y in q]; ys = [min(max(y, 0), H) for x, y in q]
                if min(max(xs) - min(xs), max(ys) - min(ys)) >= 0.11 * min(W, H) * (390 / 390): ok.append(n)
            res['%d_%s' % (cn, asp)] = sorted(ok)
    return res


def card():
    from PIL import Image, ImageDraw, ImageFont
    meta = json.load(open(os.path.join(OUT, 'lots.json')))
    F_ = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', n)
    S = 2                                             # the tall shots at twice their pixels on the card (four on the phone's screen)
    tw, th = 180 * S, 320 * S; ww, wh = 320 * S, 180 * S; gap = 12; head = 52
    W = 4 * tw + 5 * gap; H = head + th + 36 + int(wh * 0.75) + 34
    frames = []
    for f in range(FRAMES):
        im = Image.new('RGB', (W, H), (20, 18, 16)); d = ImageDraw.Draw(im)
        d.text((gap, 12), 'YOUR SETTLEMENT, THROUGH ITS OWN CAMERAS: ACT ONE  (look test)', font=F_(22), fill=(232, 222, 200))
        for i, cn in enumerate((1, 2, 3)):
            sh = Image.open(os.path.join(OUT, 'cam%d_tall_%d.png' % (cn, f))).resize((tw, th), Image.NEAREST)
            im.paste(sh, (gap + i * (tw + gap), head))
            d.text((gap + i * (tw + gap), head + th + 8), CAMS[cn]['name'] + '  (upright)', font=F_(15), fill=(226, 176, 82))
        # the fourth: CAM 3 upright again with the lots you tap drawn on it, each lot's own outline on the ground (it sees the most)
        sh = Image.open(os.path.join(OUT, 'cam3_tall_%d.png' % f)).resize((tw, th), Image.NEAREST).convert('RGB'); dd = ImageDraw.Draw(sh)
        for n, poly in footprints(3, 'tall').items():
            pts = [(x * S, y * S) for x, y in poly]
            dd.line(pts + [pts[0]], fill=(226, 176, 82), width=2)
            cx = min(max(sum(p[0] for p in pts) / len(pts), 12), tw - 24); cy = min(max(sum(p[1] for p in pts) / len(pts), 30), th - 40)
            dd.rectangle([cx - 11, cy - 9, cx + 13, cy + 10], fill=(226, 176, 82)); dd.text((cx - 7, cy - 8), str(n), font=F_(14), fill=(20, 18, 16))
        im.paste(sh, (gap + 3 * (tw + gap), head))
        d.text((gap + 3 * (tw + gap), head + th + 8), 'CAM 3, THE LOTS YOU TAP', font=F_(15), fill=(226, 176, 82))
        y2 = head + th + 36
        for i, cn in enumerate((1, 2, 3)):
            sh = Image.open(os.path.join(OUT, 'cam%d_wide_%d.png' % (cn, f))).resize((int(ww * 0.75), int(wh * 0.75)), Image.NEAREST)
            x = gap + i * (int(ww * 0.75) + gap); im.paste(sh, (x, y2))
            d.text((x, y2 + int(wh * 0.75) + 6), CAMS[cn]['name'] + '  (sideways)', font=F_(15), fill=(226, 176, 82))
        frames.append(im)
    cov = coverage(); json.dump(dict(meta, thumb_wide=cov), open(os.path.join(OUT, 'lots.json'), 'w'), indent=1)
    print('  a thumb wide:', cov, ' every lot in some camera:', sorted(set(n for v in cov.values() for n in v)))
    dst = os.path.join(OUT, 'vote_look_test.webp')
    frames[0].save(dst, save_all=True, append_images=frames[1:], duration=167, loop=0, quality=86, method=6)
    frames[0].save('/tmp/claude-0/home_cameras_card.png')
    print('  card', dst, frames[0].size)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        render(int(a[a.index('--samples') + 1]) if '--samples' in a else 5)
        sys.stdout.flush(); os._exit(0)
    elif a and a[0] == 'post': post()
    elif a and a[0] == 'card': card()
