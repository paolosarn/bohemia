#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the master rig]: ONE CAMERA, REAL METERS, THE MODEL TURNS (rule 108 ROUND EIGHT (b); rule 107:
everything that turns is made in eight drawn facings; rule 105: never under the pack's floor; rule 102: true size).

Run with Blender's Python (bpy 4.2, CPU only, headless; `pip install bpy==4.2.0` in a venv, or the free runner):
    <venv>/bin/python tools/bohemia_direction_master_rig.py <model.glb> <out_dir> [--real-length 5.3] [--ppm 57]

THE RIG, every number written to <out_dir>/rig.json so a sheet that disagrees can be refused:
  * PIXELS PER METRE 57: the man is the ruler (records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md: CHARACTER read the
    live rig, 98 painted px = 1.72 m). Nothing is scaled after the render; the model is scaled to its real length first.
  * THE CAMERA: orthographic, tilted 45 degrees from straight down, facing north, NOT turned. The row asked X 60 / Z 45;
    the grid is square (his third votes) and his packs are drawn front-on from 45 degrees above (the craft laws' 3/4
    view; COOK FOUR's front gables), so the camera turns 0 and tilts 45. ONE camera for every model.
  * ONE SUN from the upper left, above (the card: his light is from above, a little from the left), plus a dim sky
    fill so the shadow side is one step down, never black.
  * ORIGINS ON PIXEL MULTIPLES: the model's ground centre is snapped to a whole pixel of the 57 ppm grid, so its eight
    facings never jitter by a sub-pixel.
  * THE TURNTABLE: the model turns 0, 45 ... 315 under the fixed camera (N, NE, E, SE, S, SW, W, NW): eight renders.
  * CYCLES on the CPU at 128 samples (this bpy build has no Workbench; 16 samples read as grain).
  * POST (in plain numpy, his palette only): every pixel snapped to the nearest colour of the family's palette
    (skills/bohemia-pixel-art/references/palettes/<family>.gpl, measured from his tiles); the silhouette's own outer
    pixel taken 20% darker (the card: props end in a soft ring about 5 darker, never a black line).

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (the twin is his own car from the
7/13 UP set), the card of numbers, skills/bohemia-pixel-art, AH-01, AH-03. No reference game.
"""
import os, sys, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']


def args():
    a = sys.argv[1:]; opt = lambda k, d: type(d)(a[a.index(k) + 1]) if k in a else d
    return a[0], a[1], opt('--real-length', 5.3), opt('--ppm', 57.0), opt('--family', 'prop'), opt('--tilt', 45.0)


def palette(fam):
    cols = []
    for line in open(os.path.join(ROOT, 'skills/bohemia-pixel-art/references/palettes/%s.gpl' % fam)):
        p = line.split()
        if len(p) >= 3 and all(x.isdigit() for x in p[:3]): cols.append([int(x) for x in p[:3]])
    return cols


def render(model, out, real_len, ppm, tilt):
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=model)
    objs = [o for o in sc.objects if o.type == 'MESH']
    # one parent at the ground centre, scaled so the long side is its real length
    root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
    lo = mathutils.Vector((1e9, 1e9, 1e9)); hi = -lo
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c); lo = mathutils.Vector(map(min, lo, w)); hi = mathutils.Vector(map(max, hi, w))
    size = hi - lo; k = real_len / max(size.x, size.y)
    centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    for o in objs:
        if o.parent is None: o.parent = root; o.location -= centre
    root.scale = (k, k, k)
    px = 1.0 / ppm   # origins on pixel multiples
    root.location = (round(0 / px) * px, round(0 / px) * px, 0)
    dims = (size.x * k, size.y * k, size.z * k)
    # the camera: ortho, tilted from straight down, facing north, never turned
    span = math.hypot(dims[0], dims[1]) + dims[2] + 0.6
    res = int(math.ceil(span * ppm / 2.0)) * 2
    cam_d = bpy.data.cameras.new('cam'); cam_d.type = 'ORTHO'; cam_d.ortho_scale = res / ppm
    cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(tilt)
    cam.rotation_euler = (t, 0, 0)
    look = mathutils.Vector((0, 0, dims[2] / 2)); d = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - d * 30
    # one sun from the upper left, above; a dim sky fill
    sun_d = bpy.data.lights.new('sun', 'SUN'); sun_d.energy = 3.0; sun_d.angle = math.radians(3)
    sun = bpy.data.objects.new('sun', sun_d); sc.collection.objects.link(sun); sun.rotation_euler = (math.radians(40), 0, math.radians(-35))
    world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
    world.node_tree.nodes['Background'].inputs[0].default_value = (0.55, 0.55, 0.6, 1); world.node_tree.nodes['Background'].inputs[1].default_value = 0.35
    sc.render.resolution_x = sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    sc.render.film_transparent = True; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.render.filter_size = 0.01   # no blur at the edge: one pixel is one pixel
    try:
        sc.view_settings.view_transform = 'Standard'
    except Exception: pass
    engine = 'CYCLES'
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 128; sc.cycles.use_denoising = False   # 16 samples read as grain on the sheet (the rig's own loop, cycle 1)
    files = []
    for i, f in enumerate(FACINGS):
        root.rotation_euler = (0, 0, -math.radians(45 * i))
        fn = os.path.join(out, 'raw_%s.png' % f); sc.render.filepath = fn; bpy.ops.render.render(write_still=True); files.append(fn)
    return dict(engine=engine, res=res, ortho_scale=res / ppm, real_dims_m=[round(x, 3) for x in dims], scale_from_model=round(k, 4)), files


def post(files, out, fam):
    import numpy as np
    from PIL import Image
    pal = np.array(palette(fam), float)
    outs = []
    for fn in files:
        a = np.asarray(Image.open(fn).convert('RGBA')).astype(float)
        op = a[..., 3] > 127; a[..., 3] = np.where(op, 255, 0)
        px = a[..., :3][op]; d = ((px[:, None, :] - pal[None]) ** 2).sum(-1); a[..., :3][op] = pal[d.argmin(1)]
        p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
        ring = op & ~inner; a[..., :3][ring] *= 0.8
        ys, xs = np.nonzero(op)
        im = Image.fromarray(a.astype(np.uint8), 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        o = fn.replace('raw_', 'rig_'); im.save(o); outs.append(o)
    return outs


if __name__ == '__main__':
    model, out, real_len, ppm, fam, tilt = args()
    os.makedirs(out, exist_ok=True)
    meta, files = render(model, out, real_len, ppm, tilt)
    outs = post(files, out, fam)
    meta.update(model=os.path.relpath(model, ROOT), ppm=ppm, metres_per_px=round(1 / ppm, 5), camera=dict(tilt_deg=tilt, turn_deg=0, ortho=True),
                sun='upper left, above', facings=FACINGS, family_palette=fam, files=[os.path.relpath(o, ROOT) for o in outs],
                ruler='records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md (98 px = 1.72 m)')
    json.dump(meta, open(os.path.join(out, 'rig.json'), 'w'), indent=1)
    print(json.dumps(meta))
