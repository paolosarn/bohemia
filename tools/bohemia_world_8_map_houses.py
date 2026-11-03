#!/usr/bin/env python3
"""THE MAP'S HOUSES, FROM THE MAP'S OWN CAMERA (WORLD 8, 11/3; ask lines 117 and 185, rule 337).

PAOLO 10/25: 'on the map I need the buildings to be taller taller taller... the bottom of your legs, depending on how
zoomed in zoomed out you are, are behind the buildings.' PAOLO 10/26: 'zoom in a lot more, even on the main map... almost
like I'm on the combat map... you feel like you're actually watching your team walk through the city.' PAOLO 10/27: 'why
can't the graphics just get better as you zoom in, why does it have to enter a whole second map mode.' Rule 337: real
assets, never content without them.

WHAT THIS MAKES: the studio's own house models (reference/models/bohemia/bld_ranch_*.glb, trailer.glb, COOK's, real
metres) shot ALONE through the master rig's lamp and film (one sun, the style guide's numbers) but from THE MAP'S camera,
not the fight's: orthographic, corner-on (turned an eighth), 30 degrees down, so a block's ground is the map's own 2:1
diamond; the sun bolted to the map's land (from the north-west, a shadow falling down and a little right on the glass, the
painter's own SUN line). Each model four ways (its front to each street), onto a shadow catcher, at PPM pixels a metre.
The map lays one on every house lot the painter rolls, past its old closest stop (slices/bohemia_map_houses.js).

HEIGHT: STRETCH stands them taller than their metres (his 'taller taller taller'), the fight's own trick (its 1/cos45).

Run (Blender's python, the venv COOK uses: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow):
  v/bin/python tools/bohemia_world_8_map_houses.py            all of them, then the manifest
  v/bin/python tools/bohemia_world_8_map_houses.py ranch_plain one
"""
import os, sys, json, math

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
KIT = os.path.join(R, 'reference/models/bohemia')
OUT = os.path.join(R, 'slices/map_houses')
PPM = 16.0                 # sprite pixels a metre of ground (ortho): a ranch about 280 px wide, one to one on a 3x phone near the street stop
EL = 30.0                  # the map's camera: 30 degrees down makes the ground's diamond 2:1 (sin 30 = 1/2), TW 18 to TH 9
AZ = 45.0                  # corner-on: the camera looks up the glass along the grid's (-1, -1)
STRETCH = 2.0              # taller than their metres (rule 196: "taller taller taller"); the fight stands its own 1.41
SUN_EL = 40.0              # the painter's SUN_DROP 0.78 a step is about 38 degrees up
SUN_FROM = (-1.0, 0.25)    # Blender x = grid x, Blender y = -grid y: from the grid's -x and a little -y (the land's north-west)
MODELS = {                 # id: (file, kind)
    'ranch_plain': ('bld_ranch_plain.glb', 'house'),
    'ranch_porch': ('bld_ranch_porch.glb', 'house'),
    'ranch_wing': ('bld_ranch_wing.glb', 'house'),
    'ranch_garage': ('bld_ranch_garage.glb', 'house'),
    'ranch_carport': ('bld_ranch_carport.glb', 'house'),
    'trailer': ('prop:trailer.trailer', 'trailer'),   # COOK PROPS' single-wide on its piers (trailer.glb is a cargo trailer)
}
TURNS = [0, 90, 180, 270]
TINT = {                   # COOK's own settlement tints (stucco, pale, roof), one per model so a street is not one colour
    'ranch_plain': dict(stucco=(1.04, 0.98, 0.93), pale=(1.0, 1.0, 1.0), roof=(0.82, 0.78, 0.74)),
    'ranch_porch': dict(stucco=(0.95, 0.97, 1.0), pale=(1.04, 0.98, 0.93), roof=(1.0, 1.0, 1.0)),
    'ranch_wing': dict(stucco=(1.05, 1.02, 0.9), pale=(0.95, 0.97, 1.0), roof=(0.9, 0.9, 0.92)),
    'ranch_garage': dict(stucco=(1.0, 1.0, 1.0), pale=(1.05, 1.02, 0.9), roof=(0.82, 0.78, 0.74)),
    'ranch_carport': dict(stucco=(1.04, 0.98, 0.93), pale=(1.0, 1.0, 1.0), roof=(0.9, 0.9, 0.92)),
}  # the model's front (-Y, grid +y) turned to each street; the sun stays on the land


def shoot(mid, turn):
    import bpy, mathutils as mu
    import bohemia_direction_master_rig as RIG
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    fn, kind = MODELS[mid]
    if fn.startswith('bld_'):
        # a building is BUILT by COOK's modeller, never imported: its glb lost its colour and grime on export (COOK 10/20)
        import bohemia_cook_model_buildings as BLD
        BLD.TINT = dict(TINT.get(mid, {})); BLD.M.clear(); BLD.BUILDERS[fn[4:-4]](bpy, mu); BLD.TINT = {}
    elif fn.startswith('prop:'):
        # COOK PROPS' own modeller (rule 337: the fight's trailer park stands on the same single-wide)
        import bohemia_cook_props_every_place_its_own_11_3_26 as CP
        CP.bpy, CP.mu = bpy, mu; CP.OBJS.clear(); CP.MC.clear(); CP.build(fn[5:])
    else:
        bpy.ops.import_scene.gltf(filepath=os.path.join(KIT, fn))
    for o in [o for o in bpy.data.objects if '_fence' in o.name]:          # a ranch's own fence: the map lays its own yards
        bpy.data.objects.remove(o, do_unlink=True)
    for o in [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42]:
        bpy.data.objects.remove(o, do_unlink=True)
    objs = [o for o in bpy.data.objects if o.type == 'MESH']
    try:
        RIG.source_pass(objs, 0.6, 1.0, 0); RIG.dent_pass(objs, 1.0)
        for m in {s.material for o in objs for s in o.material_slots if s.material}:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 2
    except Exception as e:   # a model the rig cannot wear keeps its own paint
        print('  rig pass skipped:', e)
    # one parent: the model's ground centre at the origin, turned, stood taller
    lo = [1e9] * 3; hi = [-1e9] * 3
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ mu.Vector(c)
            for i in range(3): lo[i] = min(lo[i], w[i]); hi[i] = max(hi[i], w[i])
    root = bpy.data.objects.new('root', None); sc.collection.objects.link(root)
    for o in bpy.data.objects:
        if o.parent is None and o is not root: o.parent = root
    cx, cy = (lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2
    for o in bpy.data.objects:
        if o.parent is root: o.location = (o.location[0] - cx, o.location[1] - cy, o.location[2] - lo[2])
    root.rotation_euler = (0, 0, math.radians(turn)); root.scale = (1, 1, STRETCH)
    bpy.context.view_layer.update()
    lo = [1e9] * 3; hi = [-1e9] * 3
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ mu.Vector(c)
            for i in range(3): lo[i] = min(lo[i], w[i]); hi[i] = max(hi[i], w[i])
    # the sun, from the land's north-west
    sd = mu.Vector((-SUN_FROM[0], -SUN_FROM[1], 0)).normalized(); sd.z = -math.tan(math.radians(SUN_EL)); sd.normalize()
    sun_e = sd.to_track_quat('-Z', 'Y').to_euler()
    RIG.light_and_film(sc, dict(sun_rot=[math.degrees(a) for a in sun_e])); sc.render.film_transparent = True
    sc.cycles.samples = 48; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.03
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    # the camera's frame: the box's corners and where the sun lays its top on the ground
    rot = mu.Euler((math.radians(90 - EL), 0, math.radians(AZ)))
    right, up, fwd = rot.to_matrix() @ mu.Vector((1, 0, 0)), rot.to_matrix() @ mu.Vector((0, 1, 0)), rot.to_matrix() @ mu.Vector((0, 0, -1))
    pts = []
    for x in (lo[0], hi[0]):
        for y in (lo[1], hi[1]):
            for z in (0.0, hi[2]):
                p = mu.Vector((x, y, z)); pts.append(p)
                if z > 0: pts.append(p + sd * (z / -sd.z))   # the shadow of the top on the ground
    rs = [p.dot(right) for p in pts]; us = [p.dot(up) for p in pts]
    m = 0.6
    r0, r1, u0, u1 = min(rs) - m, max(rs) + m, min(us) - m, max(us) + m
    W, H = int(math.ceil((r1 - r0) * PPM)), int(math.ceil((u1 - u0) * PPM))
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    pl = bpy.context.active_object; pl.scale = ((hi[0] - lo[0]) + 40, (hi[1] - lo[1]) + 40, 1); pl.is_shadow_catcher = True
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = W / PPM; cd.clip_end = 500
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.rotation_euler = rot
    mr, mu_ = (r0 + r1) / 2, (u0 + u1) / 2
    cam.location = right * mr + up * mu_ - fwd * 120
    sc.render.resolution_x, sc.render.resolution_y = W, H
    os.makedirs(OUT, exist_ok=True)
    name = '%s_%d.png' % (mid, turn)
    sc.render.filepath = os.path.join(OUT, name)
    bpy.ops.render.render(write_still=True)
    # the ground centre's pixel, and the footprint in metres on the grid (Blender x = grid x, Blender -y = grid y)
    ox, oy = (0 - r0) * PPM, (u1 - 0) * PPM
    return dict(file=name, w=W, h=H, origin_px=[round(ox, 1), round(oy, 1)], kind=kind,
                foot_m=[round(hi[0] - lo[0], 2), round(hi[1] - lo[1], 2)], tall_m=round(hi[2], 2))


def squeeze(fn, rec):
    """trimmed to what it paints (no empty margin to blend on the glass, its ground pixel moved with it), then 64 colours (its own
    palette, alpha kept), so a house is tens of kilobytes, not hundreds"""
    from PIL import Image
    im = Image.open(fn).convert('RGBA')
    bb = im.getchannel('A').point(lambda a: 255 if a > 6 else 0).getbbox()
    if bb:
        im = im.crop(bb); rec['w'], rec['h'] = im.width, im.height
        rec['origin_px'] = [round(rec['origin_px'][0] - bb[0], 1), round(rec['origin_px'][1] - bb[1], 1)]
    q = im.quantize(colors=64, method=Image.Quantize.FASTOCTREE)
    q.save(fn, optimize=True)


def main():
    want = sys.argv[1:] or list(MODELS)
    man_fn = os.path.join(OUT, 'manifest.json')
    man = json.load(open(man_fn)) if os.path.exists(man_fn) else {}
    for mid in want:
        for t in TURNS:
            rec = shoot(mid, t)
            squeeze(os.path.join(OUT, rec['file']), rec)
            man.setdefault('sprites', {})['%s_%d' % (mid, t)] = rec
            print(mid, t, rec['w'], 'x', rec['h'], rec['foot_m'], rec['tall_m'])
    man.update(ppm=PPM, el_deg=EL, az_deg=AZ, stretch=STRETCH, sun_el_deg=SUN_EL,
               camera='orthographic, corner-on (an eighth turned), 30 down: the map\'s own 2:1 ground; one sun from the land\'s north-west',
               turn='the model\'s front faces grid +y at 0, grid +x at 90 (Blender z turns), the sun fixed on the land',
               models={k: v[0] for k, v in MODELS.items()})
    json.dump(man, open(man_fn, 'w'), indent=1)


if __name__ == '__main__':
    main()
