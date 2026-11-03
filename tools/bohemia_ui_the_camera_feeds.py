#!/usr/bin/env python3
"""BOHEMIA -- UI 6, THE CAMERA FEEDS: TEN PLACES OF THE VALLEY FILMED BY CAMERAS NOBODY IS WATCHING, EACH MADE TWICE, TALL AND WIDE
(rule 342, his second star, 11/2: 'Why not all 3? The view of the city could be better... Why don't we just have as much of these as
possible to really build that lore ambience?'; rule 348, 11/3: 'two versions one vertical one horizontal 16 equals nine or nine equals
16... first person view vibe... not super loud... full screen'; the 9/20 law: analog horror at the source; rule 337: assets first).

UI 5 made the first three (tools/bohemia_ui_the_first_minute_feeds.py) at 390 x 520 for a box under the letters. This tool makes every
feed for the whole glass: a TALL picture (9:16, 432 x 768) and a WIDE one (16:9, 768 x 432), each its own composition (its own lens and
aim, never one cropped from the other), the subject kept inside the middle of the frame so the cover-fit's bleed can cut any edge on
any real screen. The way is UI 5's and the rig's: the game's own models (reference/models/bohemia and its fight_props, the beasts with
their own clips), lit at night in Cycles on the CPU, every material through the master rig's SOURCE PASS, then the rig's POPULATION
SNAP, then THE MEDIUM baked into every frame (a camcorder's tape, a dash camera's tape, a security camera's grey, a trail camera's
infrared, a cheap colour camera's bloom): no noise layer, no filter on the page.

  a  THE CAMP ON TAPE      the crew's camp: the fire in a barrel, the truck, the tyres. Camcorder, warm.          12 keys
  b  THE NIGHT CAMERA      the pawn shop's lot: the sodium lamp dying twice a bar, a coyote in the light. CCTV.     6 pictures
  c  THE ROAD IN           (RE-SHOT, his 'the view of the city could be better') the dash camera on the dead I-15:
                           the Strip close and huge, every tower dark but one lit block, the needle and the black
                           pyramid on the sky, the dead freeway lights going by. Dash tape, cold.                   12 keys
  d  THE INTAKE            the dam's camera over Lake Mead: the intake towers standing in low water, the white
                           bathtub ring on the canyon walls, one red light still blinking on a tower. CCTV.        6 pictures
  e  THE PENS              the lab yard on a trail camera's infrared: cage three burst from inside, the cold-store
                           truck still running, a dire wolf standing in the yard, its eyes lit by the flash.        6 pictures
  f  THE APRON             the airport's dead apron from the tower: the plane on its belly, the jet bridge to
                           nothing, the fuel truck, a mountain lion crossing the painted lines. Colour CCTV.        6 pictures
  g  THE FLARE             the landfill's methane flare, still burning, over the mound and the dead dozer; two
                           feral dogs in its light. A camcorder left on a tripod.                                  12 keys
  h  THE MARKET            a town's market after closing: the stalls under tarps, the carts, one bulb on the wire
                           still lit, a dog asleep under a table. Colour CCTV over the stall.                      6 pictures
  i  THE PYLON             the open desert: a power pylon down across the sand, Joshua trees, a car half buried
                           with its headlights on. A camcorder dropped in the sand, still recording, tilted.        12 keys
  j  THE FOUNTAIN          the Strip from a casino's porte-cochere: the dry fountain, the fallen sign with one
                           bulb of its hundred lit, the limo, the bridge over the boulevard. CCTV.                 6 pictures

Run with Blender's Python (bpy 4.2, Python 3.11; `python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow`):
    <venv>/bin/python tools/bohemia_ui_the_camera_feeds.py <a..j> <tall|wide> <out_dir> [--samples 32 --one K --preview]
then (any Python with numpy and Pillow):
    python3 tools/bohemia_ui_the_camera_feeds.py --post <a..j> <tall|wide> <out_dir> slices/crashbox/feed_<x>_<tall|wide>.webp
"""
import os, sys, math, json, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(ROOT, 'reference/models/bohemia/')
P = M + 'fight_props/'
KEYS = 12   # a bar at 120 BPM, three keys a beat (records/target/BOHEMIA_STYLE_GUIDE.json rig.keys_per_beat)
SIZE = {'tall': (432, 768), 'wide': (768, 432)}
# the medium of each feed: how many pictures its camera takes a bar (a security or trail camera six a second, held on twos)
MEDIUM = {'a': 'vhs_warm', 'b': 'cctv', 'c': 'vhs_cold', 'd': 'cctv', 'e': 'ir', 'f': 'cctv_colour', 'g': 'vhs_warm', 'h': 'cctv_colour', 'i': 'vhs_cold', 'j': 'cctv'}
FRAMES = {k: (6 if MEDIUM[k] in ('cctv', 'ir', 'cctv_colour') else 12) for k in MEDIUM}


def opt(k, d):
    a = sys.argv
    return type(d)(a[a.index(k) + 1]) if k in a else d


# =====================================================================================================================
# THE RENDER (Blender)
# =====================================================================================================================
def render(scene, orient, out):
    import bpy, mathutils
    W, H = SIZE[orient]
    SAMPLES, PREVIEW, ONE = opt('--samples', 32), '--preview' in sys.argv, opt('--one', -1)
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    sys.argv = [sys.argv[0]]   # the rig reads --set from argv at import; nothing of ours is a rig key
    import bohemia_direction_master_rig as RIG
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    V = mathutils.Vector
    TALL = orient == 'tall'

    def imp(path, loc, rz=0.0, s=1.0, length=None):
        """a model of the game's, placed in metres; length= scales a beast to its real length nose to tail"""
        before, acts0 = set(bpy.data.objects), set(bpy.data.actions)
        bpy.ops.import_scene.gltf(filepath=path)
        new = [o for o in bpy.data.objects if o not in before]
        root = bpy.data.objects.new('root', None); sc.collection.objects.link(root)
        for o in new:
            if o.parent is None: o.parent = root
        root.location = loc; root.rotation_euler = (0, 0, math.radians(rz)); root.scale = (s, s, s)
        ms = [o for o in new if o.type == 'MESH']
        if length:
            bpy.context.view_layer.update()
            xs = [(o.matrix_world @ V(c)).x for o in ms for c in o.bound_box]; ys = [(o.matrix_world @ V(c)).y for o in ms for c in o.bound_box]
            span = max(max(xs) - min(xs), max(ys) - min(ys)); k = length / span if span > 0 else 1
            root.scale = (s * k,) * 3
        root['acts'] = [a.name for a in bpy.data.actions if a not in acts0]
        root['arms'] = [o.name for o in new if o.type == 'ARMATURE']
        return root, ms

    def joined(path):
        """a model of many pieces (the casino tower is 886) imported once and joined into one mesh at its own origin, so a
        skyline is copies of one object sharing its data, not twelve imports and ten thousand objects"""
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=path)
        new = [o for o in bpy.data.objects if o not in before]
        ms = [o for o in new if o.type == 'MESH']; names = [o.name for o in new]
        bpy.ops.object.select_all(action='DESELECT')
        for o in ms: o.select_set(True)
        bpy.context.view_layer.objects.active = ms[0]
        bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
        bpy.ops.object.join()
        j = bpy.context.view_layer.objects.active
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        for nm in names:
            if nm != j.name and nm in bpy.data.objects: bpy.data.objects.remove(bpy.data.objects[nm])
        return j

    def place(src, loc, rz=0.0, s=1.0, own=False):
        o = src.copy()
        if own: o.data = src.data.copy()
        sc.collection.objects.link(o); o.location = loc; o.rotation_euler = (0, 0, math.radians(rz)); o.scale = (s, s, s)
        meshes.append(o); return o

    def light_windows(o, lit, share=0.45, floor_m=3.2, bay_m=4.0, seed=1):
        """the one lit block: the glass of this copy lit in whole bays, floor by floor (the building's own generator), the rest dark"""
        gi = next((k for k, m in enumerate(o.data.materials) if m and 'glass' in m.name), None)
        if gi is None: return 0
        o.data.materials.append(lit); li = len(o.data.materials) - 1; Rw = random.Random(seed); cells = {}; n = 0
        # a pane is one island of the glass (its triangles share their corners), lit whole or not at all, never a triangle at a time
        polys = [p for p in o.data.polygons if p.material_index == gi]; up = {}
        def find(a):
            while up.get(a, a) != a: up[a] = up.get(up[a], up[a]); a = up[a]
            return a
        for p in polys:
            vs = list(p.vertices)
            for v in vs[1:]:
                ra, rb = find(vs[0]), find(v)
                if ra != rb: up[ra] = rb
        panes = {}
        for p in polys: panes.setdefault(find(p.vertices[0]), []).append(p)
        for g in panes.values():
            c = V((0, 0, 0))
            for p in g: c += p.center
            c /= len(g); cell = (int(c.z // floor_m), int((c.x + c.y) // bay_m))
            if cell not in cells: cells[cell] = Rw.random() < share
            if cells[cell]:
                for p in g: p.material_index = li
                n += 1
        return n

    def clip(root, name):
        """the beast plays its own clip (Survey, Walk...): the action its own import made, on its own armature"""
        act = next((bpy.data.actions[a] for a in root['acts'] if a.startswith(name)), None)
        for an in root['arms']:
            a = bpy.data.objects[an]; a.animation_data_create(); a.animation_data.action = act
        return act.frame_range if act else (1, 12)

    def mat(name, rgb, rough=1.0, emit=None, es=0.0):
        m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = tuple(rgb) + (1,); b.inputs['Roughness'].default_value = rough
        if emit: b.inputs['Emission Color'].default_value = tuple(emit) + (1,); b.inputs['Emission Strength'].default_value = es
        return m

    def box(name, loc, dims, m, rz=0.0):
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.active_object; o.name = name
        o.scale = dims; o.rotation_euler = (0, 0, math.radians(rz)); bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)   # the rig's masks are sized off the object's scale: bake it in
        o.data.materials.append(m); return o

    def cyl(name, loc, r, d, m, verts=12):
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=d, location=loc); o = bpy.context.active_object; o.name = name
        o.data.materials.append(m); return o

    def plane(name, loc, sx, sy, m):
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc); o = bpy.context.active_object; o.name = name
        o.scale = (sx, sy, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        o.data.materials.append(m); return o

    def light(name, kind, loc, energy, rgb, size=0.2, rot=None, spot=None, blend=0.5):
        d = bpy.data.lights.new(name, kind); o = bpy.data.objects.new(name, d); sc.collection.objects.link(o)
        o.location = loc; d.energy = energy; d.color = rgb
        if kind != 'SUN': d.shadow_soft_size = size
        if rot: o.rotation_euler = tuple(math.radians(r) for r in rot)
        if spot: d.spot_size = math.radians(spot); d.spot_blend = blend
        return o, d

    def look(cam, at):
        d = V(at) - cam.location; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

    def shoot(tall, wide):
        """each orientation its own composition: (where the camera stands, what it looks at, its vertical field of view,
        a roll of the camera in degrees)"""
        loc, at, fov, roll = tall if TALL else wide
        cam.location = loc; look(cam, at)
        if roll: cam.rotation_euler.rotate_axis('Z', math.radians(roll))
        cam_d.sensor_fit = 'VERTICAL'; cam_d.sensor_height = 24.0
        cam_d.lens = 12.0 / math.tan(math.radians(fov) / 2)

    # THE FILM: the rig's own settings where they apply (Cycles, CPU, Standard, no blur), the night's own exposure
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 12 if PREVIEW else SAMPLES
    sc.cycles.use_denoising = True; sc.cycles.max_bounces = 4; sc.cycles.use_light_tree = True
    sc.render.resolution_x = W // (2 if PREVIEW else 1); sc.render.resolution_y = H // (2 if PREVIEW else 1); sc.render.resolution_percentage = 100
    sc.render.film_transparent = True; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.render.filter_size = 0.8; sc.render.use_motion_blur = False; sc.render.dither_intensity = 0.0
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    world = bpy.data.worlds.new('night'); sc.world = world; world.use_nodes = True
    bg = world.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.008, 0.010, 0.018, 1); bg.inputs[1].default_value = 1.0
    cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    cam_d.clip_end = 6000
    moon, moon_d = light('moon', 'SUN', (0, 0, 10), 0.05, (0.62, 0.72, 1.0), rot=(60, 0, 150)); moon_d.angle = math.radians(2)
    meshes = []
    R = random.Random(ord(scene))
    dirt = lambda: mat('dirt', (0.115, 0.092, 0.07))
    asphalt = lambda: mat('asphalt', (0.06, 0.059, 0.058))

    def add(path, loc, rz=0.0, s=1.0, length=None):
        r, ms = imp(path, loc, rz, s, length); meshes.extend(ms); return r

    if scene == 'a':   # THE CAMP ON TAPE (UI 5's, re-shot for the whole glass)
        bg.inputs[0].default_value = (0.012, 0.014, 0.024, 1); moon_d.energy = 0.06
        meshes.append(plane('ground', (0, 60, 0), 300, 300, dirt()))
        add(M + 'oil_drum.glb', (0.15, 6.4, 0), 10); add(M + 'truck.glb', (-2.9, 9.6, 0), -104, 2.05); add(M + 'tyres.glb', (1.75, 7.7, 0), 30)
        add(M + 'cover_jersey.glb', (3.6, 11.8, 0), -12); add(M + 'lamp.glb', (-5.6, 13.5, 0), 20, 1.15); add(M + 'drums.glb', (-0.9, 11.6, 0), 40)
        add(M + 'shed.glb', (5.4, 15.5, 0), -20); add(M + 'sandbags.glb', (-4.2, 6.2, 0), 70)
        fl_m = mat('flame', (1.0, 0.5, 0.15), 1.0, (1.0, 0.46, 0.12), 6.0)
        flames = []
        for k in range(7):
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.075 + 0.012 * (k % 3), location=(0.15, 6.4, 1.0))
            f = bpy.context.active_object; f.data.materials.append(fl_m); flames.append(f)
        fire, fire_d = light('fire', 'POINT', (0.15, 6.4, 1.08), 170, (1.0, 0.56, 0.24), 0.25)
        sc.view_settings.exposure = -0.9
        lev = [R.uniform(0.72, 1.0) for _ in range(KEYS)]
        offs = [[(R.uniform(-0.17, 0.17), R.uniform(-0.17, 0.17), R.uniform(0.5, 1.6), R.uniform(0, 6.28)) for _ in flames] for _ in range(KEYS)]
        shoot(((0.5, 0.9, 1.45), (-0.5, 7.8, 1.2), 60, 0), ((0.9, 2.0, 1.4), (-0.9, 8.6, 1.3), 44, 0))
        base = cam.rotation_euler.copy()
        def key(i):
            fire_d.energy = 170 * lev[i]
            for f, (dx, dy, sz, rz) in zip(flames, offs[i]):
                f.location = (0.15 + dx * 0.8, 6.4 + dy * 0.8, 0.93 + 0.07 * sz); f.scale = (1, 1, 1.4 + 1.6 * sz); f.rotation_euler = (0.35 * dy / 0.17, -0.35 * dx / 0.17, rz)
            a = 2 * math.pi * i / KEYS   # the hand that holds the camera: a slow loop, under a third of a degree
            cam.rotation_euler = (base.x + 0.004 * math.cos(a), base.y, base.z + 0.005 * math.sin(a))

    elif scene == 'b':   # THE NIGHT CAMERA (UI 5's)
        bg.inputs[0].default_value = (0.006, 0.007, 0.010, 1); moon_d.energy = 0.035
        meshes.append(plane('lot', (0, 40, 0), 200, 200, mat('asphalt', (0.07, 0.068, 0.066))))
        add(M + 'bld_pawn_shop.glb', (1.5, 20.5, 0)); add(M + 'streetlight.glb', (-3.6, 8.2, 0)); add(M + 'wreck.glb', (4.6, 9.4, 0), 28)
        add(M + 'dumpster.glb', (-5.8, 15.0, 0), 90); add(M + 'tyres.glb', (7.4, 14.0, 0), 10); add(M + 'stop_sign.glb', (-8.5, 6.0, 0), 20)
        add(M + 'bld_gas_station.glb', (-24, 30, 0), 15)
        cy = add(M + 'coyote.glb', (-0.6, 6.6, 0), -95, length=1.1); f0, f1 = clip(cy, 'Survey')
        lamp, lamp_d = light('sodium', 'SPOT', (-0.75, 8.2, 9.0), 2600, (1.0, 0.6, 0.24), 0.2, spot=104, blend=0.6)
        head_m = mat('sodium_glass', (1, 0.7, 0.4), 1.0, (1.0, 0.62, 0.26), 12.0); box('lamp_glass', (-0.75, 8.2, 9.12), (0.55, 0.22, 0.04), head_m)
        sc.view_settings.exposure = -0.4
        shoot(((-8.6, -6.5, 8.6), (0.0, 9.0, 0.8), 66, 0), ((-9.8, -4.6, 8.4), (0.6, 10.5, 1.6), 50, 0))
        dying = {4: 0.12, 5: 0.5, 9: 0.08}   # the sodium drops out twice a bar, on the grid
        def key(i):
            lamp_d.energy = 2600 * dying.get(i, 1.0)
            head_m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 12.0 * dying.get(i, 1.0)
            sc.frame_set(int(round(f0 + (f1 - f0) * i / KEYS)))

    elif scene == 'c':   # THE ROAD IN, RE-SHOT: the city close and huge
        bg.inputs[0].default_value = (0.006, 0.008, 0.016, 1); bg.inputs[1].default_value = 0.35; moon_d.energy = 0.003; moon.rotation_euler = (math.radians(72), 0, math.radians(200))
        rig = bpy.data.objects.new('rig', None); sc.collection.objects.link(rig)
        conc = mat('concrete', (0.16, 0.155, 0.15)); paint = mat('line_paint', (0.62, 0.6, 0.5)); amber = mat('line_amber', (0.62, 0.48, 0.16))
        meshes.append(plane('road', (0, 400, 0.0), 26, 1000, asphalt()))
        meshes.append(plane('dirt', (0, 400, -0.05), 2400, 3000, dirt()))
        for y in range(-24, 600, 12):   # the dashes: three metres, a period of twelve (one key at 120 BPM moves the truck two)
            for x in (-1.8, 1.8): meshes.append(box('dash', (x, y, 0.006), (0.13, 3.0, 0.01), paint))
        meshes.append(box('edge_r', (5.6, 400, 0.006), (0.14, 1000, 0.01), paint)); meshes.append(box('edge_l', (-5.6, 400, 0.006), (0.14, 1000, 0.01), amber))
        meshes.append(box('median', (-7.0, 400, 0.45), (0.6, 1000, 0.9), conc))   # the jersey wall down the middle, one long piece
        meshes.append(plane('road_far', (-15.4, 400, 0.0), 16, 1000, asphalt()))
        pole_m = mat('pole', (0.30, 0.30, 0.29)); dead_m = mat('dead_glass', (0.2, 0.2, 0.18), 0.4)
        for y in range(0, 600, 48):   # the freeway's lights on the median, every one dead, every 48 m (two bars: the loop never jumps)
            meshes.append(box('pole', (-7.0, y, 6.0), (0.22, 0.22, 12.0), pole_m))
            for sx in (-1, 1): meshes.append(box('arm', (-7.0 + sx * 1.7, y, 11.9), (3.4, 0.16, 0.16), pole_m)); box('head', (-7.0 + sx * 3.3, y, 11.75), (0.7, 0.3, 0.14), dead_m)
        refl = mat('reflector', (1, 1, 0.9), 0.3, (1.0, 0.92, 0.7), 0.6)
        for y in range(0, 600, 24): meshes.append(box('post', (7.2, y, 0.55), (0.09, 0.09, 1.1), mat('post', (0.6, 0.6, 0.58)))); box('refl', (7.2, y - 0.05, 0.98), (0.07, 0.02, 0.12), refl)
        # THE STRIP: a wall of dark towers ahead and to the left of the road, close, riding with the truck so the loop never pops
        lit = mat('window_lit', (1, 0.7, 0.35), 1.0, (1.0, 0.62, 0.28), 2.2)
        towers = [(-70, 260, 3.4, 10), (-140, 330, 4.6, -20), (-40, 420, 4.0, 35), (-210, 400, 5.2, 5), (45, 470, 3.2, -10), (-110, 520, 5.6, 25),
                  (90, 360, 2.6, 15), (-280, 300, 3.0, 40), (150, 560, 4.4, -30), (-10, 640, 5.0, 0), (-330, 560, 3.8, 15), (220, 420, 2.4, 5)]
        tw = joined(M + 'bld_tower_casino.glb'); cs = joined(M + 'bld_casino.glb')
        for k, (x, y, s, rz) in enumerate(towers):
            o = place(tw, (x, y, 0), rz, s, own=(k == 2)); o.parent = rig
            if k == 2: light_windows(o, lit, 0.5, seed=3)   # the one lit block: the third tower, the city's one generator
        for (x, y, rz) in [(-45, 180, 0), (-120, 210, 15), (40, 230, -10), (110, 280, 20)]:
            place(cs, (x, y, 0), rz, 1.6).parent = rig
        for o in (tw, cs): bpy.data.objects.remove(o)
        # the needle on the north end and the black pyramid at the south: the skyline that says Las Vegas with no word
        needle_m = mat('needle', (0.18, 0.18, 0.19))
        n1 = cyl('needle', (70, 900, 140), 6, 280, needle_m, 16); n2 = cyl('pod', (70, 900, 262), 22, 18, needle_m, 24); n3 = cyl('spire', (70, 900, 300), 1.2, 60, needle_m, 8)
        bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=120, depth=105, location=(-380, 820, 52)); pyr = bpy.context.active_object
        pyr.rotation_euler = (0, 0, math.radians(45)); pyr.data.materials.append(mat('pyramid', (0.03, 0.03, 0.035), 0.3))
        beacon = mat('red', (1, 0.1, 0.05), 1.0, (1.0, 0.08, 0.04), 30.0); bl = cyl('beacon', (70, 900, 331), 1.4, 2.0, beacon, 8)
        for o in (n1, n2, n3, pyr, bl): o.parent = rig
        meshes += [n1, n2, n3, pyr]
        hood = box('hood', (1.85, 0.75, 0.9), (1.9, 1.5, 0.1), mat('hood_paint', (0.30, 0.24, 0.10), 0.7)); hood.parent = rig; meshes.append(hood)
        cam.parent = rig
        shoot(((1.85, 0, 1.45), (-8, 60, 13.0), 70, 0), ((1.85, 0, 1.45), (-14, 60, 7.0), 42, 0))
        for sx in (-0.75, 0.75):
            h, hd = light('head', 'SPOT', (1.85 + sx, 1.65, 0.75), 650, (1.0, 0.93, 0.8), 0.08, rot=(84, 0, -2 * (1 if sx > 0 else -1)), spot=52, blend=0.45); h.parent = rig
        def key(i):
            rig.location = (0, 24.0 * i / KEYS, 0)   # two dashes a bar: the road loops on the grid
            beacon.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 30.0 if (i // 3) % 2 == 0 else 0.0

    elif scene == 'd':   # THE INTAKE: the dam's camera over the low lake
        bg.inputs[0].default_value = (0.014, 0.017, 0.028, 1); moon_d.energy = 0.32; moon.rotation_euler = (math.radians(58), 0, math.radians(160))
        water = mat('water', (0.012, 0.018, 0.022), 0.08); wnode = water.node_tree
        tex = wnode.nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value = 6.0; bump = wnode.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.25
        mapn = wnode.nodes.new('ShaderNodeMapping'); tc = wnode.nodes.new('ShaderNodeTexCoord')
        wnode.links.new(tc.outputs['Object'], mapn.inputs['Vector']); wnode.links.new(mapn.outputs['Vector'], tex.inputs['Vector'])
        wnode.links.new(tex.outputs['Fac'], bump.inputs['Height']); wnode.links.new(bump.outputs['Normal'], wnode.nodes['Principled BSDF'].inputs['Normal'])
        wp = plane('lake', (0, 200, 0), 400, 600, water)
        rock = mat('rock', (0.13, 0.085, 0.06)); ring = mat('ring', (0.62, 0.60, 0.55))
        # the canyon: two walls of dark rock, and under them the white ring the lake left as it went down (the bathtub ring)
        for side, x in ((-1, -60), (1, 60)):
            for k in range(7):
                y = 30 + k * 40; w = 30 + R.uniform(-6, 10); x0 = x + side * (k * 4 + R.uniform(-4, 4))
                meshes.append(box('wall', (x0, y, 46), (w, 44, 64), rock, R.uniform(-6, 6)))
                meshes.append(box('ring', (x0 - side * 1.2, y, 7), (w + 1.5, 44.5, 14), ring, R.uniform(-3, 3)))
        meshes.append(box('far', (0, 330, 40), (220, 30, 80), rock)); meshes.append(box('far_ring', (0, 316, 7), (220, 4, 14), ring))
        towers = [(-14, 70, 0), (2, 82, 8), (18, 96, -6), (33, 108, 4)]
        for (x, y, rz) in towers: add(P + 'shore_intake.glb', (x, y, -2.0), rz, 1.0)
        red = mat('red', (1, 0.1, 0.05), 1.0, (1.0, 0.08, 0.04), 40.0); box('warn', (2, 82, 15.7), (0.35, 0.35, 0.35), red)
        add(P + 'shore_buoys.glb', (-6, 50, -0.3), 20); add(P + 'shore_boat.glb', (28, 60, -0.6), 70)
        rail = mat('rail', (0.35, 0.34, 0.32)); meshes.append(box('parapet', (0, 6, 0.6), (40, 0.4, 1.2), rail))
        sc.view_settings.exposure = 1.5
        shoot(((-2, -2, 22), (8, 80, 4), 58, 0), ((-4, -4, 20), (8, 84, 6), 36, 0))
        def key(i):
            mapn.inputs['Location'].default_value = (0.0, 0.035 * i, 0.02 * math.sin(i))   # the water moves under the moon
            red.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 40.0 if i in (0, 6) else 0.0   # the one red light still blinking: once a beat and a half

    elif scene == 'e':   # THE PENS: the lab yard on a trail camera's infrared
        bg.inputs[0].default_value = (0.0, 0.0, 0.0, 1); moon_d.energy = 0.01
        meshes.append(plane('yard', (0, 30, 0), 120, 120, mat('gravel', (0.13, 0.12, 0.11))))
        add(P + 'lab_cage_block.glb', (0.5, 12.0, 0), 180); add(P + 'lab_cold_truck.glb', (-7.0, 16.5, 0), 155); add(P + 'lab_gurneys.glb', (4.4, 7.2, 0), 200)
        add(P + 'lab_decon.glb', (8.5, 14.5, 0), 210); add(P + 'lab_fence_run.glb', (-3.0, 21.5, 0), 180); add(P + 'lab_fence_run.glb', (3.2, 21.5, 0), 180)
        add(P + 'lab_fence_gate.glb', (9.0, 21.0, 0), 190); add(M + 'drums.glb', (-4.0, 9.0, 0), 30)
        wolf = add(M + 'dire_wolf_redone.glb', (-0.5, 6.8, 0), 150, length=1.7); f0, f1 = clip(wolf, 'Survey')
        # THE INFRARED FLASH: the camera's own ring of lights, a cone from the lens, falling off fast
        ir, ir_d = light('ir', 'SPOT', (0, -0.4, 1.1), 260, (1, 1, 1), 0.3, spot=80, blend=0.8)
        panel = mat('panel', (0.2, 1, 0.3), 1.0, (0.3, 1.0, 0.4), 6.0); box('panel', (-7.9, 14.3, 1.6), (0.3, 0.04, 0.2), panel)   # the reefer's panel, still lit
        eyes_m = mat('eyeshine', (1, 1, 1), 1.0, (1.0, 1.0, 0.95), 60.0)
        eyes = []
        for k in range(2):
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.022, location=(0, 0, -5)); e = bpy.context.active_object; e.data.materials.append(eyes_m); eyes.append(e)
        arm = bpy.data.objects[wolf['arms'][0]] if wolf['arms'] else None
        shoot(((0, 0, 1.05), (0.0, 10.0, 1.6), 62, 0), ((0, 0, 1.05), (0.6, 10.0, 1.3), 40, 0))
        ir.rotation_euler = cam.rotation_euler.copy()
        def key(i):
            sc.frame_set(int(round(f0 + (f1 - f0) * i / KEYS)))
            if arm:   # the eyes ride the head bone: a little forward of its tip, either side of it; they light only facing the lens
                bpy.context.view_layer.update()
                pb = arm.pose.bones.get('b_Head_05')
                if pb:
                    mw = arm.matrix_world; hh = mw @ pb.head; tt = mw @ pb.tail; fwd = (tt - hh); n = fwd.length; fwd.normalize()
                    side = (mw.to_3x3() @ (pb.matrix.to_3x3() @ V((1, 0, 0)))).normalized()
                    up = fwd.cross(side).normalized()
                    c = hh + fwd * n * 0.55
                    for e, s in zip(eyes, (-1, 1)): e.location = c + side * s * 0.045 + up * 0.03
                    facing = (cam.location - c).normalized().dot(fwd)
                    eyes_m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 60.0 if facing > -0.2 else 0.0

    elif scene == 'f':   # THE APRON: the airport from the tower, colour CCTV
        bg.inputs[0].default_value = (0.012, 0.012, 0.018, 1); moon_d.energy = 0.12; moon.rotation_euler = (math.radians(60), 0, math.radians(120))
        con = mat('apron', (0.17, 0.165, 0.155)); meshes.append(plane('apron', (0, 120, 0), 500, 500, con))
        yel = mat('taxi_line', (0.55, 0.42, 0.08))
        for k in range(40): meshes.append(box('line', (-30 + k * 2.6, 46 + 0.9 * k, 0.01), (0.25, 2.8, 0.01), yel, -70))
        meshes.append(box('stop_bar', (6, 30, 0.01), (14, 0.3, 0.01), yel))
        add(P + 'airport_plane.glb', (4, 40, -0.6), -30); add(P + 'airport_jet_bridge.glb', (-14, 22, 0), 90); add(P + 'airport_fuel_truck.glb', (18, 30, 0), 120)
        add(P + 'airport_baggage.glb', (-6, 18, 0), 15); add(P + 'airport_hangar.glb', (-30, 70, 0), 20); add(P + 'airport_hangar.glb', (2, 95, 0), 0)
        lion = add(M + 'mountain_lion.glb', (1.5, 25, 0), 120, length=2.1); f0, f1 = clip(lion, 'Survey')
        # the apron's mast lights: all dead but one, and that one sodium-orange and failing
        mast, mast_d = light('mast', 'SPOT', (22, 12, 24), 9000, (1.0, 0.55, 0.2), 0.5, spot=80, blend=0.5); mast.rotation_euler = (math.radians(20), 0, math.radians(40))
        meshes.append(box('mast_pole', (23, 13, 12), (0.5, 0.5, 24), mat('pole', (0.3, 0.3, 0.29))))
        runway = mat('runway_light', (1, 0.3, 0.2), 1.0, (1.0, 0.25, 0.15), 8.0)
        for k in range(14): box('rl', (-120 + k * 22, 190, 0.2), (0.4, 0.4, 0.3), runway)
        sc.view_settings.exposure = 0.6
        shoot(((-5, 10, 9), (4, 40, 1.0), 58, 0), ((-9, 9, 8.5), (2, 40, 2.0), 42, 0))
        flick = {2: 0.35, 3: 0.1, 8: 0.6}
        def key(i):
            mast_d.energy = 9000 * flick.get(i, 1.0)
            sc.frame_set(int(round(f0 + (f1 - f0) * i / KEYS)))

    elif scene == 'g':   # THE FLARE: the landfill's methane flare, still burning, on a camcorder left on its tripod
        bg.inputs[0].default_value = (0.012, 0.010, 0.012, 1); moon_d.energy = 0.03
        meshes.append(plane('ground', (0, 80, 0), 400, 400, mat('trash_dirt', (0.10, 0.085, 0.065))))
        add(P + 'landfill_mound.glb', (-10, 34, 0), 20, 1.6); add(P + 'landfill_mound.glb', (14, 48, 0), -40, 2.2); add(P + 'landfill_mound.glb', (-26, 60, 0), 70, 2.6)
        add(P + 'landfill_flare.glb', (3, 24, 0), -20); add(P + 'landfill_wells.glb', (-4, 14, 0), 10); add(P + 'landfill_dozer.glb', (-12, 20, 0), 60)
        add(M + 'heap.glb', (9, 14, 0), 30); add(M + 'fence.glb', (-2, 5, 0), 5)
        d1 = add(M + 'feral_dog_cur.glb', (2.4, 20.5, 0), -150, length=1.1); fa = clip(d1, 'Survey')
        d2 = add(M + 'feral_dog_pit.glb', (0.2, 21.5, 0), 110, length=1.0); clip(d2, 'Walk')
        fl_m = mat('flame', (1.0, 0.5, 0.15), 1.0, (1.0, 0.5, 0.15), 10.0)
        flames = []
        for k in range(6):
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.22 + 0.04 * (k % 3), location=(0, 0, 0)); f = bpy.context.active_object; f.data.materials.append(fl_m); flames.append(f)
        top = (3.0, 24.0, 11.2)   # the flare's mouth (its model is 11.4 m to the tip)
        fire, fire_d = light('flare', 'POINT', (top[0], top[1], top[2] + 0.6), 6000, (1.0, 0.55, 0.22), 0.6)
        sc.view_settings.exposure = 0.1
        lev = [R.uniform(0.7, 1.0) for _ in range(KEYS)]
        offs = [[(R.uniform(-0.4, 0.4), R.uniform(-0.4, 0.4), R.uniform(0.5, 1.6)) for _ in flames] for _ in range(KEYS)]
        shoot(((-1.5, -6, 1.6), (1.5, 24, 5.5), 56, 0), ((-2, -8, 1.6), (0.5, 24, 4.8), 34, 0))
        def key(i):
            fire_d.energy = 6000 * lev[i]
            for f, (dx, dy, sz) in zip(flames, offs[i]):
                f.location = (top[0] + dx, top[1] + dy, top[2] + 0.3 + 0.5 * sz); f.scale = (1, 1, 1.4 + 1.5 * sz)
            sc.frame_set(int(round(fa[0] + (fa[1] - fa[0]) * i / KEYS)))

    elif scene == 'h':   # THE MARKET: a town's market after closing, colour CCTV over the stall
        bg.inputs[0].default_value = (0.010, 0.011, 0.018, 1); moon_d.energy = 0.10
        meshes.append(plane('street', (0, 30, 0), 120, 120, mat('packed_dirt', (0.12, 0.10, 0.08))))
        tarps = [mat('tarp_blue', (0.08, 0.16, 0.30)), mat('tarp_orange', (0.45, 0.18, 0.05)), mat('tarp_green', (0.12, 0.20, 0.10)), mat('tarp_grey', (0.25, 0.24, 0.22))]
        pole_m = mat('pole', (0.25, 0.22, 0.18))
        stalls = [(-4.5, 7, 10), (0.0, 8.5, -5), (4.6, 7.4, -15), (-5.2, 13.5, 5), (-0.6, 14.5, 0), (4.0, 13.6, -10)]
        for k, (x, y, rz) in enumerate(stalls):
            add(M + 'cover_table.glb', (x, y, 0), rz)
            t = box('tarp', (x, y, 2.3), (3.4, 2.8, 0.04), tarps[k % 4], rz); t.rotation_euler.x = math.radians(R.uniform(-6, 6)); meshes.append(t)
            for dx in (-1.6, 1.6):
                for dy in (-1.3, 1.3): meshes.append(cyl('post', (x + dx, y + dy, 1.15), 0.04, 2.3, pole_m, 6))
        add(M + 'cart.glb', (2.4, 4.6, 0.45), 30, 1.6); add(M + 'drums.glb', (-7.6, 10, 0), 10); add(M + 'propane.glb', (7.6, 10.5, 0.0), 0, 0.6)
        add(M + 'trailer.glb', (-2, 21, 0), 0); add(M + 'shed.glb', (8, 19, 0), -20); add(M + 'bales.glb', (-8, 16, 0), 30)
        dog = add(M + 'feral_dog_shepherd.glb', (0.3, 8.4, 0), 70, length=1.1); fd = clip(dog, 'Survey')
        wire_m = mat('wire', (0.05, 0.05, 0.05))
        meshes.append(box('wire', (0, 10.8, 3.4), (16, 0.03, 0.03), wire_m))
        dead_b = mat('bulb_dead', (0.3, 0.28, 0.2), 0.5); bulb_m = mat('bulb', (1, 0.8, 0.5), 1.0, (1.0, 0.75, 0.4), 40.0)
        for k in range(9):
            x = -7 + k * 1.75; b = cyl('bulb', (x, 10.8, 3.25), 0.07, 0.16, bulb_m if k == 5 else dead_b, 8)
        bl, bl_d = light('bulb', 'POINT', (1.75, 10.8, 3.2), 320, (1.0, 0.72, 0.4), 0.1)
        sc.view_settings.exposure = 1.4
        shoot(((-3.5, -3.2, 5.6), (0.6, 10, 0.4), 64, 0), ((-4.5, -2.4, 5.0), (0.4, 10.5, 0.9), 44, 0))
        sway = [math.sin(2 * math.pi * i / KEYS) for i in range(KEYS)]
        def key(i):
            bl_d.energy = 320 * (0.55 if i in (5, 6) else 1.0)
            sc.frame_set(int(round(fd[0] + (fd[1] - fd[0]) * i / KEYS)))

    elif scene == 'i':   # THE PYLON: a camcorder dropped in the sand, still recording, tilted
        bg.inputs[0].default_value = (0.012, 0.015, 0.028, 1); moon_d.energy = 0.11; moon.rotation_euler = (math.radians(66), 0, math.radians(230))
        meshes.append(plane('sand', (0, 100, 0), 600, 600, mat('sand', (0.25, 0.20, 0.15))))
        add(P + 'desert_pylon.glb', (-3, 19, 0), 60); add(P + 'desert_buried_car.glb', (5, 13, 0), -35); add(P + 'desert_joshua.glb', (-8, 11, 0), 30)
        add(P + 'desert_joshua_small.glb', (11, 22, 0), 0); add(P + 'desert_joshua.glb', (16, 44, 0), 80, 1.2); add(P + 'desert_boulders.glb', (-9, 7, 0), 10)
        add(M + 'cover_rock_5.glb', (6, 4, 0), 40)
        for k in range(5): add(M + 'cover_rock_%d.glb' % (k + 7), (R.uniform(-40, 40), R.uniform(30, 90), 0), R.uniform(0, 360), R.uniform(1.5, 3.5))
        cm = add(M + 'camelops.glb', (5, 27, 0), 100, length=3.0); fc = clip(cm, 'Survey')
        # THE WRONG THING: the buried car's headlights, on, across the sand
        ca, sa = math.cos(math.radians(-35)), math.sin(math.radians(-35))
        for sx in (-0.6, 0.6):   # the car's front is its -Y: each lamp 2.2 m forward of its middle, turned with the car
            light('head', 'SPOT', (5 + sx * ca + 2.2 * sa, 13 + sx * sa - 2.2 * ca, 0.55), 1600, (1.0, 0.92, 0.75), 0.06, rot=(88, 0, 145), spot=40, blend=0.35)
        sc.view_settings.exposure = -0.2
        shoot(((0.4, -1.0, 0.25), (1.0, 14, 3.4), 64, -9), ((0.4, -1.0, 0.25), (0.6, 14, 2.4), 42, -9))
        def key(i):
            sc.frame_set(int(round(fc[0] + (fc[1] - fc[0]) * i / KEYS)))

    elif scene == 'j':   # THE FOUNTAIN: the Strip from a casino's porte-cochere, CCTV
        bg.inputs[0].default_value = (0.008, 0.009, 0.014, 1); moon_d.energy = 0.04
        meshes.append(plane('drive', (0, 40, 0), 300, 300, mat('pavers', (0.16, 0.15, 0.14))))
        add(P + 'strip_fountain.glb', (0, 16, 0), 0); add(P + 'strip_sign.glb', (-9, 10, 0), 25); add(P + 'strip_limo.glb', (8.5, 9, 0), -15)
        add(P + 'strip_bridge.glb', (6, 42, 0), 0); add(M + 'bld_casino.glb', (-26, 46, 0), 10, 1.1)
        tw = joined(M + 'bld_tower_casino.glb'); place(tw, (22, 90, 0), -10, 2.4); place(tw, (-40, 130, 0), 20, 3.0); bpy.data.objects.remove(tw)
        add(P + 'golf_dead_palm.glb', (-4, 24, 0)); add(P + 'golf_dead_palm.glb', (5.5, 25, 0), 90); add(M + 'wreck.glb', (-1, 30, 0), 80)
        bulb = mat('bulb', (1, 0.85, 0.5), 1.0, (1.0, 0.8, 0.45), 50.0)
        bl = cyl('one_bulb', (-6.2, 9.0, 1.6), 0.09, 0.12, bulb, 8)
        bl_l, bl_d = light('one_bulb', 'POINT', (-6.2, 8.8, 1.7), 25, (1.0, 0.78, 0.45), 0.05)
        sc.view_settings.exposure = 1.1
        shoot(((-6, -8, 7.5), (0, 16, 1.0), 62, 0), ((-8, -8, 6.5), (0, 18, 2.4), 42, 0))
        def key(i):
            on = i not in (3, 4)   # the bulb's own bad contact
            bl_d.energy = 25 if on else 4; bulb.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 50.0 if on else 6.0
    else:
        raise SystemExit('scene a..j')

    # THE LOOK AT THE SOURCE: the master rig's own pass on every material in the frame (metres: the scene is built in metres)
    seen = set(); uniq = []
    for o in meshes:
        if o.name in seen or o.type != 'MESH': continue
        seen.add(o.name); uniq.append(o)
    done = RIG.source_pass(uniq, float(RIG.G['wear']), 1.0, seed=ord(scene))
    os.makedirs(out, exist_ok=True)
    n = FRAMES[scene]
    keys = [ONE] if ONE >= 0 else [k * KEYS // n for k in range(n)]
    for i in keys:
        key(i)
        sc.render.filepath = os.path.join(out, 'raw_%02d.png' % i)
        bpy.ops.render.render(write_still=True)
        print('key', i, flush=True)
    json.dump({'scene': scene, 'orient': orient, 'w': W, 'h': H, 'samples': SAMPLES, 'keys': list(keys),
               'materials': len(done.get('materials', []))}, open(os.path.join(out, 'render.json'), 'w'), indent=1)


# =====================================================================================================================
# THE POST: the sky, the population snap, and THE MEDIUM, baked into every frame (numpy, Pillow)
# =====================================================================================================================
SKY = {   # top, horizon, stars, and the horizon's own thing
    'a': ((6, 8, 14), (24, 24, 30), 70, 'ridge'), 'b': ((8, 8, 9), (16, 16, 17), 0, None), 'c': ((5, 8, 16), (34, 28, 34), 90, 'glow'),
    'd': ((6, 8, 15), (20, 22, 30), 120, None), 'e': ((0, 0, 0), (0, 0, 0), 0, None), 'f': ((7, 7, 12), (24, 20, 22), 40, 'glow_far'),
    'g': ((8, 6, 8), (28, 20, 18), 30, 'smoke'), 'h': ((6, 7, 11), (14, 14, 18), 20, None), 'i': ((4, 7, 18), (22, 24, 36), 220, 'ridge'),
    'j': ((7, 7, 10), (18, 16, 18), 10, None)}


def post(scene, orient, out, dst):
    import numpy as np
    from PIL import Image
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    files = sorted(f for f in os.listdir(out) if f.startswith('raw_'))
    keys = [int(f[4:6]) for f in files]
    fr = [np.asarray(Image.open(os.path.join(out, f)).convert('RGBA')).astype(float) for f in files]
    H, W = fr[0].shape[:2]
    R = np.random.RandomState(ord(scene))
    top, low, stars, thing = SKY[scene]
    yy = np.arange(H)[:, None] / H
    sky = np.zeros((H, W, 3)); f = np.clip(yy / 0.55, 0, 1) ** 1.6
    for c in range(3): sky[..., c] = top[c] + (low[c] - top[c]) * f
    for _ in range(int(stars * W * H / (390 * 520))):
        x, y = R.randint(0, W), R.randint(0, int(H * 0.5)); v = R.choice([70, 100, 130, 180])
        sky[y, x] = (v, v, v * 1.05)
    X = np.arange(W)[None, :]
    if thing == 'ridge':   # the ranges round the valley, a step darker than the sky, cut by hand
        hz = int(H * (0.40 if orient == 'tall' else 0.46))
        ridge = hz - (6 + 6 * np.sin(np.arange(W) / (31.0 * W / 390)) + 3 * np.sin(np.arange(W) / 9.0)).astype(int)
        for x in range(W): sky[ridge[x]:, x] = (13, 13, 17)
    if thing in ('glow', 'glow_far', 'smoke'):   # the city's dead sodium, or the flare's, on the cloud floor
        cx, cy, a = {'glow': (0.42, 0.40, 64), 'glow_far': (0.75, 0.42, 14), 'smoke': (0.55, 0.30, 22)}[thing]
        d = np.sqrt(((X - W * cx) / (W * 0.55)) ** 2 + ((np.arange(H)[:, None] - H * cy) / (H * 0.12)) ** 2)
        glow = np.clip(1 - d, 0, 1) ** 2 * a
        sky[..., 0] += glow; sky[..., 1] += glow * 0.6; sky[..., 2] += glow * 0.3
    import bohemia_direction_master_rig as RIG
    pop, nb, nf = RIG.population('prop')
    SNAP = 0.3
    by = {}
    for i, a in zip(keys, fr):
        al = a[..., 3:4] / 255.0
        rgb = a[..., :3] * al + sky * (1 - al)
        b = np.clip((rgb // 8).astype(int), 0, 31)
        rgb = rgb + (pop[b[..., 0], b[..., 1], b[..., 2]] - rgb) * SNAP
        by[i] = medium(MEDIUM[scene], rgb, i, scene)
    n = len(keys)
    sheet = np.zeros((H * n, W, 3), np.uint8)
    for k, i in enumerate(sorted(by)): sheet[k * H:(k + 1) * H] = by[i]
    Image.fromarray(sheet).save(dst, 'WEBP', quality=80, method=6)
    proof = os.path.join(ROOT, 'records/target/ui_the_camera_feeds'); os.makedirs(proof, exist_ok=True)
    Image.fromarray(by[sorted(by)[0]]).save(os.path.join(proof, os.path.basename(dst).replace('.webp', '_still.png')))
    print(dst, os.path.getsize(dst), 'bytes', W, 'x', H, 'x', n)


def medium(kind, rgb, i, scene):
    """THE MEDIUM, at the source: what a tape or a cheap camera does to a picture, baked into the picture. No noise layer
    (AH-01 R10): a tape's soft luma, its colour bleeding right, the head-switching tear at the foot, a dropout; a security
    camera's grey and interlace; a trail camera's infrared (white-hot, the flash falling off into black, the bloom); a cheap
    colour camera's crushed blacks and its highlights bleeding into the line."""
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

    def bloom(y, thr, k, amt):   # the bright bleeding sideways along the line, the way a tube camera smears a light
        hi = np.clip(y - thr, 0, None)
        return y + hblur(hi, k) * amt

    if kind == 'cctv':
        Y = hblur(Y, 1); Y = bloom(Y, 150, 6, 0.8)
        Y = np.clip((Y - 6) * 1.25 + 8, 0, 255)
        Y[1::2] *= 0.86   # the interlace: every other line a field late and a shade darker
        out = np.stack([Y * 0.86, Y * 1.0, Y * 0.84], -1)
    elif kind == 'ir':
        Y = np.clip(Y * 2.2, 0, 255); Y = hblur(Y, 1); Y = bloom(Y, 170, 8, 1.2)
        Y = np.clip((Y - 4) * 1.15, 0, 255) ** 0.92 * (255 ** 0.08)
        Y[1::2] *= 0.9
        out = np.stack([Y * 0.95, Y * 0.97, Y * 0.92], -1)   # the trail camera's own white, a shade warm
    elif kind == 'cctv_colour':
        Y = hblur(Y, 1); Y = bloom(Y, 140, 7, 0.9)
        I = np.roll(hblur(I, 3), 1, axis=1) * 1.25; Q = np.roll(hblur(Q, 3), 1, axis=1) * 1.1
        out = np.stack([Y + 0.956 * I + 0.621 * Q, Y - 0.272 * I - 0.647 * Q, Y - 1.106 * I + 1.703 * Q], -1)
        out = np.clip((out - 10) * 1.18, 0, 255)   # the cheap camera's crushed black
        out[1::2] *= 0.9
    else:
        Y = 0.6 * Y + 0.4 * hblur(Y, 1)   # a tape's luma is soft across, never up and down
        Y = bloom(Y, 180, 4, 0.5)
        I = np.roll(hblur(I, 3), 2, axis=1); Q = np.roll(hblur(Q, 4), 2, axis=1)   # the colour smears and lands to the right
        sat = 0.8 if kind == 'vhs_warm' else 0.7
        I *= sat; Q *= sat
        out = np.stack([Y + 0.956 * I + 0.621 * Q, Y - 0.272 * I - 0.647 * Q, Y - 1.106 * I + 1.703 * Q], -1)
        out *= (1.04, 1.0, 0.9) if kind == 'vhs_warm' else (0.92, 0.98, 1.08)
        out = np.clip(out * 0.92 + 9, 0, 255)   # the black never quite black on tape
    # the head-switching tear: the last rows shoved right, a band of the tape's own damage at the foot of the picture
    tape = kind.startswith('vhs')
    t = 6 if tape else 3
    for k in range(t):
        y = H - 1 - k; sh = int(4 + (t - k) * 3 + r.randint(0, 3))
        out[y] = np.roll(out[y], sh, axis=0); out[y, :sh] = out[y, sh:sh + 1]
    if tape:   # dropouts: a white scratch where the oxide is gone, on a line
        for _ in range(r.randint(0, 3)):
            y, x0 = r.randint(0, H - t), r.randint(0, W - 40); ln = r.randint(8, 50)
            out[y, x0:x0 + ln] = np.maximum(out[y, x0:x0 + ln], 205)
    return np.clip(out, 0, 255).astype(np.uint8)


if __name__ == '__main__':
    if '--post' in sys.argv:
        a = sys.argv[sys.argv.index('--post') + 1:]
        post(a[0], a[1], a[2], a[3])
    else:
        a = [x for x in sys.argv[1:] if not x.startswith('--')]
        render(a[0], a[1], a[2])
