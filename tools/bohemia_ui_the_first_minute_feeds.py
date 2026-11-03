#!/usr/bin/env python3
"""BOHEMIA -- UI 5, THE FIRST MINUTE: THREE LOADING SCREENS, EACH A CAMERA'S OWN FEED, MADE THROUGH THE MASTER RIG
(asks 338 and 340, records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md; his 11/2 vote: NO on the Crashbox box with the tin robot, no
words; rule 66a, Paolo 10/5: 'the loading shown as the camera's own feed, never a bar'; the 9/20 law: analog horror at the source;
rule 337: assets first, every picture its own art).

Three dioramas, each built from the game's own models (reference/models/bohemia, the ones COOK put through the rig), lit at night,
rendered by Blender's Cycles on the CPU, every material run through the master rig's own SOURCE PASS (tools/
bohemia_direction_master_rig.py source_pass: matte, crevice grime from the model's own occlusion, dust and sun-bleach on what faces
up, worn edges), twelve keys a bar at 120 BPM (a key every 167 ms, the men's grid), then the rig's POPULATION SNAP toward the colours
his prop packs use, then the TAPE: the medium is baked into every frame here, at the source, never a filter on the page.

  A  THE CAMP ON TAPE    a camcorder held by one of the crew: the fire in a barrel, the truck, the tyres, a dead lamp; the fire
                         flickers on the grid and the hand drifts. VHS, warm.
  B  THE NIGHT CAMERA    a security camera on a pole over the pawn shop's lot: one sodium light dying (it drops out twice a bar), a
                         wrecked car, a dumpster, a coyote standing in the light, looking round. CCTV, mono, six pictures a second.
  C  THE ROAD IN         a camera on your truck's dash on the dead highway into Vegas: the lines coming under the headlights, the
                         posts going by, the Strip dark on the horizon with one tower still lit. VHS, cold.

Run with Blender's Python (bpy 4.2, Python 3.11; `python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow`):
    <venv>/bin/python tools/bohemia_ui_the_first_minute_feeds.py <A|B|C> <out_dir> [--w 390 --h 520 --samples 64 --preview]
then (any Python with numpy and Pillow):
    python3 tools/bohemia_ui_the_first_minute_feeds.py --post <A|B|C> <out_dir> slices/crashbox/feed_<x>.webp
"""
import os, sys, math, json, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(ROOT, 'reference/models/bohemia/')
KEYS = 12   # a bar at 120 BPM, three keys a beat (records/target/BOHEMIA_STYLE_GUIDE.json rig.keys_per_beat)


def opt(k, d):
    a = sys.argv
    return type(d)(a[a.index(k) + 1]) if k in a else d


# =====================================================================================================================
# THE RENDER (Blender)
# =====================================================================================================================
def render(scene, out):
    import bpy, mathutils
    W, H, SAMPLES, PREVIEW, ONE = opt('--w', 390), opt('--h', 520), opt('--samples', 64), '--preview' in sys.argv, opt('--one', -1)
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    sys.argv = [sys.argv[0]]   # the rig reads --set from argv at import; nothing of ours is a rig key
    import bohemia_direction_master_rig as RIG
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    V = mathutils.Vector

    def imp(name, loc, rz=0.0, s=1.0):
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=M + name + '.glb')
        new = [o for o in bpy.data.objects if o not in before]
        root = bpy.data.objects.new('root_' + name, None); sc.collection.objects.link(root)
        for o in new:
            if o.parent is None: o.parent = root
        root.location = loc; root.rotation_euler = (0, 0, math.radians(rz)); root.scale = (s, s, s)
        return root, [o for o in new if o.type == 'MESH']

    def mat(name, rgb, rough=1.0, emit=None, es=0.0):
        m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = tuple(rgb) + (1,); b.inputs['Roughness'].default_value = rough
        if emit: b.inputs['Emission Color'].default_value = tuple(emit) + (1,); b.inputs['Emission Strength'].default_value = es
        return m

    def box(name, loc, dims, m):
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.active_object; o.name = name
        o.scale = dims; bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)   # the rig's masks are sized off the object's scale: bake it in
        o.data.materials.append(m); return o

    def plane(name, loc, sx, sy, m):
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc); o = bpy.context.active_object; o.name = name
        o.scale = (sx, sy, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        o.data.materials.append(m); return o

    def look(cam, at):
        d = V(at) - cam.location; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

    # THE FILM: the rig's own settings where they apply (Cycles, CPU, Standard, no blur), the night's own exposure
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16 if PREVIEW else SAMPLES
    sc.cycles.use_denoising = True; sc.cycles.max_bounces = 4; sc.cycles.use_light_tree = True
    sc.render.resolution_x = W // (2 if PREVIEW else 1); sc.render.resolution_y = H // (2 if PREVIEW else 1); sc.render.resolution_percentage = 100
    sc.render.film_transparent = True; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.render.filter_size = 0.8; sc.render.use_motion_blur = False; sc.render.dither_intensity = 0.0
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    world = bpy.data.worlds.new('night'); sc.world = world; world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    cam_d.sensor_fit = 'VERTICAL'; cam_d.sensor_height = 24.0; cam_d.clip_end = 3000
    moon_d = bpy.data.lights.new('moon', 'SUN'); moon = bpy.data.objects.new('moon', moon_d); sc.collection.objects.link(moon)
    moon_d.angle = math.radians(2); moon_d.color = (0.62, 0.72, 1.0)
    meshes = []
    per_key = []   # a function per key: what moves

    if scene == 'A':
        bg.inputs[0].default_value = (0.012, 0.014, 0.024, 1); bg.inputs[1].default_value = 1.0
        moon_d.energy = 0.06; moon.rotation_euler = (math.radians(62), 0, math.radians(150))
        g = plane('ground', (0, 60, 0), 300, 300, mat('dirt', (0.115, 0.092, 0.07))); meshes.append(g)
        _, m1 = imp('oil_drum', (0.15, 6.4, 0), 10, 1.0); meshes += m1
        _, m2 = imp('truck', (-2.9, 9.6, 0), -104, 2.05); meshes += m2
        _, m3 = imp('tyres', (1.75, 7.7, 0), 30, 1.0); meshes += m3
        _, m4 = imp('cover_jersey', (3.6, 11.8, 0), -12, 1.0); meshes += m4
        _, m5 = imp('lamp', (-5.6, 13.5, 0), 20, 1.15); meshes += m5
        _, m6 = imp('drums', (-0.9, 11.6, 0), 40, 1.0); meshes += m6
        # THE FIRE: flames cut from the drum's own mouth, emissive clay, and the one warm light; both move on the grid
        fl_m = mat('flame', (1.0, 0.5, 0.15), 1.0, (1.0, 0.46, 0.12), 6.0)
        flames = []
        for k in range(7):   # tongues: low-poly drops of emissive clay, stretched and leaning, re-posed every key
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.075 + 0.012 * (k % 3), location=(0.15, 6.4, 1.0))
            f = bpy.context.active_object; f.data.materials.append(fl_m); flames.append(f)
        fire_d = bpy.data.lights.new('fire', 'POINT'); fire = bpy.data.objects.new('fire', fire_d); sc.collection.objects.link(fire)
        fire.location = (0.15, 6.4, 1.08); fire_d.color = (1.0, 0.56, 0.24); fire_d.shadow_soft_size = 0.25
        cam_d.lens = 32; cam.location = (0.6, 1.4, 1.38); sc.view_settings.exposure = -0.9
        R = random.Random(7)
        lev = [R.uniform(0.72, 1.0) for _ in range(KEYS)]
        offs = [[(R.uniform(-0.17, 0.17), R.uniform(-0.17, 0.17), R.uniform(0.5, 1.6), R.uniform(0, 6.28)) for _ in flames] for _ in range(KEYS)]
        def key(i):
            fire_d.energy = 170 * lev[i]
            for f, (dx, dy, sz, rz) in zip(flames, offs[i]):
                f.location = (0.15 + dx * 0.8, 6.4 + dy * 0.8, 0.93 + 0.07 * sz); f.scale = (1, 1, 1.4 + 1.6 * sz); f.rotation_euler = (0.35 * dy / 0.17, -0.35 * dx / 0.17, rz)
            a = 2 * math.pi * i / KEYS   # the hand that holds the camera: a slow loop, under a third of a degree
            look(cam, (0.0 + 0.10 * math.sin(a), 7.6, 1.3 + 0.06 * math.cos(a)))   # aimed a little up: the fire under his letters on the title
        per_key = key

    elif scene == 'B':
        bg.inputs[0].default_value = (0.006, 0.007, 0.010, 1); bg.inputs[1].default_value = 1.0
        moon_d.energy = 0.035; moon.rotation_euler = (math.radians(55), 0, math.radians(200))
        g = plane('lot', (0, 40, 0), 200, 200, mat('asphalt', (0.07, 0.068, 0.066))); meshes.append(g)
        _, m1 = imp('bld_pawn_shop', (1.5, 20.5, 0), 0, 1.0); meshes += m1
        _, m2 = imp('streetlight', (-3.6, 8.2, 0), 0, 1.0); meshes += m2
        _, m3 = imp('wreck', (4.6, 9.4, 0), 28, 1.0); meshes += m3
        _, m4 = imp('dumpster', (-5.8, 15.0, 0), 90, 1.0); meshes += m4
        _, m5 = imp('tyres', (7.4, 14.0, 0), 10, 1.0); meshes += m5
        cy_root, m6 = imp('coyote', (-0.6, 6.6, 0), -95, 1.0)
        # the coyote's own size: 1.1 m nose to tail, measured off its posed meshes
        bpy.context.view_layer.update()
        ys = [(o.matrix_world @ V(c)).y for o in m6 for c in o.bound_box]; xs = [(o.matrix_world @ V(c)).x for o in m6 for c in o.bound_box]
        span = max(max(ys) - min(ys), max(xs) - min(xs)); cy_root.scale = (1.1 / span,) * 3 if span > 0 else (1, 1, 1)
        meshes += m6
        arm = [o for o in bpy.data.objects if o.type == 'ARMATURE']
        clip = bpy.data.actions.get('Survey_root')
        if arm and clip:
            for a in arm:
                a.animation_data_create(); a.animation_data.action = clip
        f0, f1 = (clip.frame_range if clip else (1, 12))
        lamp_d = bpy.data.lights.new('sodium', 'SPOT'); lamp = bpy.data.objects.new('sodium', lamp_d); sc.collection.objects.link(lamp)
        lamp.location = (-0.75, 8.2, 9.0); lamp.rotation_euler = (0, 0, 0)
        lamp_d.spot_size = math.radians(104); lamp_d.spot_blend = 0.6; lamp_d.color = (1.0, 0.6, 0.24); lamp_d.shadow_soft_size = 0.2
        head_m = mat('sodium_glass', (1, 0.7, 0.4), 1.0, (1.0, 0.62, 0.26), 12.0)
        head = box('lamp_glass', (-0.75, 8.2, 9.12), (0.55, 0.22, 0.04), head_m)
        cam_d.lens = 24; cam.location = (-9.8, -4.6, 8.4); look(cam, (0.4, 10.0, 1.9)); sc.view_settings.exposure = -0.4
        dying = {4: 0.12, 5: 0.5, 9: 0.08}   # the sodium drops out twice a bar, on the grid
        def key(i):
            lamp_d.energy = 2600 * dying.get(i, 1.0)
            head_m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 12.0 * dying.get(i, 1.0)
            sc.frame_set(int(round(f0 + (f1 - f0) * i / KEYS)))
        per_key = key

    elif scene == 'C':
        bg.inputs[0].default_value = (0.008, 0.011, 0.022, 1); bg.inputs[1].default_value = 1.0
        moon_d.energy = 0.012; moon.rotation_euler = (math.radians(70), 0, math.radians(30))
        rig = bpy.data.objects.new('rig', None); sc.collection.objects.link(rig)
        asph = mat('asphalt', (0.055, 0.055, 0.06)); paint = mat('line_paint', (0.62, 0.6, 0.5)); amber = mat('line_amber', (0.62, 0.48, 0.16))
        sh = mat('shoulder', (0.12, 0.098, 0.075))
        meshes.append(plane('road', (0, 300, 0.0), 7.6, 700, asph))
        meshes.append(plane('dirt', (0, 300, -0.02), 600, 700, sh))
        for y in range(-24, 420, 12):   # the dashes: three metres, a period of twelve (one key at 120 BPM moves the truck two)
            meshes.append(box('dash', (0, y, 0.006), (0.13, 3.0, 0.01), paint))
        meshes.append(box('edge_r', (3.65, 300, 0.006), (0.14, 700, 0.01), paint))
        meshes.append(box('edge_l', (-3.65, 300, 0.006), (0.14, 700, 0.01), amber))
        post_m = mat('post', (0.6, 0.6, 0.58)); refl = mat('reflector', (1, 1, 0.9), 0.3, (1.0, 0.92, 0.7), 0.6)
        for y in range(0, 420, 24):
            meshes.append(box('post', (4.9, y, 0.55), (0.09, 0.09, 1.1), post_m)); box('refl', (4.9, y - 0.05, 0.98), (0.07, 0.02, 0.12), refl)
        # THE STRIP, DARK, ON THE HORIZON, riding with the truck so it never pops at the loop; one tower still lit
        towers = []
        for k, (x, y, s, rz) in enumerate([(-170, 1150, 2.6, 0), (-60, 1300, 3.1, 30), (40, 1220, 2.2, -15), (130, 1350, 3.4, 10), (230, 1180, 2.0, 0)]):
            r, ms = imp('bld_tower_casino', (x, y, -2), rz, s); r.parent = rig; towers.append((r, ms))
        lit = mat('window_lit', (1, 0.8, 0.5), 1.0, (1.0, 0.78, 0.42), 4.0)
        R = random.Random(11)
        for o in towers[1][1]:
            if any(t in (o.name + ''.join(sl.material.name for sl in o.material_slots if sl.material)).lower() for t in ('glass', 'window', 'pane')) and R.random() < 0.35:
                o.data.materials.clear(); o.data.materials.append(lit)
        for r, ms in towers: meshes += ms
        hood = box('hood', (1.85, 0.75, 0.9), (1.9, 1.5, 0.1), mat('hood_paint', (0.30, 0.24, 0.10), 0.7)); hood.parent = rig; meshes.append(hood)   # our truck's hood
        cam.parent = rig; cam.location = (1.85, 0, 1.45); cam_d.lens = 26
        cam.rotation_euler = (math.radians(95.0), 0, 0)   # a dash camera looking a little up: the city under his letters on the title
        for sx in (-0.75, 0.75):
            hd = bpy.data.lights.new('head', 'SPOT'); h = bpy.data.objects.new('head', hd); sc.collection.objects.link(h); h.parent = rig
            h.location = (1.85 + sx, 1.65, 0.75); h.rotation_euler = (math.radians(84), 0, math.radians(-2 * (1 if sx > 0 else -1)))
            hd.energy = 1400; hd.spot_size = math.radians(52); hd.spot_blend = 0.45; hd.color = (1.0, 0.93, 0.8); hd.shadow_soft_size = 0.08
        def key(i):
            rig.location = (0, 24.0 * i / KEYS, 0)   # two dashes a bar: the road loops on the grid
        per_key = key
    else:
        raise SystemExit('scene A, B or C')

    # THE LOOK AT THE SOURCE: the master rig's own pass on every material in the frame (metres: the scene is built in metres)
    seen = set(); uniq = []
    for o in meshes:
        if o.name in seen or o.type != 'MESH': continue
        seen.add(o.name); uniq.append(o)
    done = RIG.source_pass(uniq, float(RIG.G['wear']), 1.0, seed=ord(scene))
    os.makedirs(out, exist_ok=True)
    keys = [ONE] if ONE >= 0 else range(0, KEYS, 2) if scene == 'B' else range(KEYS)   # the CCTV camera takes six pictures a second: one every two keys
    for i in keys:
        per_key(i)
        sc.render.filepath = os.path.join(out, 'raw_%02d.png' % i)
        bpy.ops.render.render(write_still=True)
        print('key', i, flush=True)
    json.dump({'scene': scene, 'w': W, 'h': H, 'samples': SAMPLES, 'keys': list(keys), 'source_pass': {k: v for k, v in done.items() if k != 'materials'},
               'materials': len(done.get('materials', []))}, open(os.path.join(out, 'render.json'), 'w'), indent=1)


# =====================================================================================================================
# THE POST: the sky, the population snap, and THE TAPE, baked into every frame (numpy, Pillow)
# =====================================================================================================================
def post(scene, out, dst):
    import numpy as np
    from PIL import Image
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    files = sorted(f for f in os.listdir(out) if f.startswith('raw_'))
    keys = [int(f[4:6]) for f in files]
    fr = [np.asarray(Image.open(os.path.join(out, f)).convert('RGBA')).astype(float) for f in files]
    H, W = fr[0].shape[:2]
    R = np.random.RandomState(ord(scene))
    # THE SKY behind the film's alpha: a night gradient, the stars, and the horizon's own thing (a ridge; the city's dead glow)
    yy = np.arange(H)[:, None] / H
    top, low = {'A': ((6, 8, 14), (24, 24, 30)), 'B': ((8, 8, 9), (16, 16, 17)), 'C': ((5, 8, 16), (26, 28, 40))}[scene]
    sky = np.zeros((H, W, 3)); f = np.clip(yy / 0.5, 0, 1) ** 1.6
    for c in range(3): sky[..., c] = top[c] + (low[c] - top[c]) * f
    for _ in range({'A': 70, 'B': 0, 'C': 110}[scene]):
        x, y = R.randint(0, W), R.randint(0, int(H * 0.45)); v = R.choice([90, 120, 150, 200])
        sky[y, x] = (v, v, v * 1.05)
    if scene == 'A':   # the ridge east of the valley, a step darker than the sky, cut by hand
        hz = int(H * 0.42)
        ridge = hz - (6 + 5 * np.sin(np.arange(W) / 31.0) + 3 * np.sin(np.arange(W) / 9.0)).astype(int)
        for x in range(W): sky[ridge[x]:, x] = (13, 13, 17)
    if scene == 'C':   # the dead Strip's own faint sodium on the cloud floor, low and to the left of centre
        cx, cy = W * 0.45, H * 0.43
        d = np.sqrt(((np.arange(W)[None, :] - cx) / (W * 0.5)) ** 2 + ((np.arange(H)[:, None] - cy) / (H * 0.08)) ** 2)
        glow = np.clip(1 - d, 0, 1) ** 2 * 26
        sky[..., 0] += glow; sky[..., 1] += glow * 0.62; sky[..., 2] += glow * 0.3
    # THE POPULATION SNAP (the rig's own): toward the colours his prop packs use, a light pull at night
    import bohemia_direction_master_rig as RIG
    pop, nb, nf = RIG.population('prop')
    SNAP = 0.3
    outs = []
    for i, a in zip(keys, fr):
        al = a[..., 3:4] / 255.0
        rgb = a[..., :3] * al + sky * (1 - al)
        b = np.clip((rgb // 8).astype(int), 0, 31)
        rgb = rgb + (pop[b[..., 0], b[..., 1], b[..., 2]] - rgb) * SNAP
        outs.append((i, tape(scene, rgb, i, R)))
    # the sheet: one frame under the next, twelve keys (B: each of its six pictures held for two keys, as the camera shoots)
    sheet = np.zeros((H * KEYS, W, 3), np.uint8)
    by = dict(outs)
    for k in range(KEYS):
        src = by.get(k, by.get(k - (k % 2)))
        sheet[k * H:(k + 1) * H] = src
    Image.fromarray(sheet).save(dst, 'WEBP', quality=84, method=6)
    Image.fromarray(by[keys[0]]).save(os.path.join(ROOT, 'records/target/ui_the_first_minute_feeds', os.path.basename(dst).replace('.webp', '_still.png')))   # the proof still, outside the published slices
    print(dst, os.path.getsize(dst), 'bytes', W, 'x', H, 'x', KEYS, '; the snap pulled', SNAP, 'toward', nb, 'of his colours from', nf, 'tiles')


def tape(scene, rgb, i, R):
    """THE MEDIUM, at the source: what a tape or a cheap camera does to a picture, baked into the picture. No noise layer
    (AH-01 R10): the softness of a tape's luma, the colour bleeding to the right, the head-switching tear at the bottom, a
    dropout line or two that move with the tape, and for the CCTV the camera's own grey and its interlace."""
    import numpy as np
    H, W = rgb.shape[:2]
    r = np.random.RandomState(1000 + i * 7 + ord(scene))
    Y = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    I = 0.596 * rgb[..., 0] - 0.274 * rgb[..., 1] - 0.322 * rgb[..., 2]
    Q = 0.211 * rgb[..., 0] - 0.523 * rgb[..., 1] + 0.312 * rgb[..., 2]
    def hblur(a, k):
        out = a.copy(); n = 1
        for s in range(1, k + 1): out[:, s:] += a[:, :-s]; out[:, :-s] += a[:, s:]; n += 2
        return out / n
    if scene == 'B':
        Y = hblur(Y, 1)
        Y = np.clip((Y - 6) * 1.25 + 8, 0, 255)
        Y[1::2] *= 0.86   # the interlace: every other line a field late and a shade darker
        out = np.stack([Y * 0.86, Y * 1.0, Y * 0.84], -1)
    else:
        Y = 0.6 * Y + 0.4 * hblur(Y, 1)   # a tape's luma is soft across, never up and down
        I = np.roll(hblur(I, 3), 2, axis=1); Q = np.roll(hblur(Q, 4), 2, axis=1)   # the colour smears and lands to the right
        sat = 0.8 if scene == 'A' else 0.7
        I *= sat; Q *= sat
        out = np.stack([Y + 0.956 * I + 0.621 * Q, Y - 0.272 * I - 0.647 * Q, Y - 1.106 * I + 1.703 * Q], -1)
        if scene == 'A': out *= (1.04, 1.0, 0.9)
        else: out *= (0.92, 0.98, 1.08)
        out = np.clip(out * 0.92 + 9, 0, 255)   # the black never quite black on tape
    # the head-switching tear: the last rows shoved right, a band of the tape's own damage at the foot of the picture
    t = 5 if scene != 'B' else 3
    for k in range(t):
        y = H - 1 - k; sh = int(4 + (t - k) * 3 + r.randint(0, 3))
        out[y] = np.roll(out[y], sh, axis=0); out[y, :sh] = out[y, sh:sh + 1]
    # dropouts: a white scratch where the oxide is gone, one or two a frame, short, on a line (never on the CCTV's disk)
    if scene != 'B':
        for _ in range(r.randint(0, 3)):
            y, x0 = r.randint(0, H - t), r.randint(0, W - 30); ln = r.randint(6, 40)
            out[y, x0:x0 + ln] = np.maximum(out[y, x0:x0 + ln], 205)
    return np.clip(out, 0, 255).astype(np.uint8)


if __name__ == '__main__':
    if '--post' in sys.argv:
        a = sys.argv[sys.argv.index('--post') + 1:]
        post(a[0], a[1], a[2])
    else:
        a = [x for x in sys.argv[1:] if not x.startswith('--')]
        render(a[0], a[1])
