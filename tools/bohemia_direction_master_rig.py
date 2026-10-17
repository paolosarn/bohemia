#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the master rig]: ONE CAMERA, REAL METERS, THE MODEL TURNS (rule 108 ROUND EIGHT (b); rule 107:
everything that turns is made in eight drawn facings; rule 105: never under the pack's floor; rule 102: true size).
ROUND TWO (10/17): THE MODEL ALSO MOVES. A rigged model's clip is drawn at the men's grid (three pictures a beat, twelve
a bar, AN ENVELOPE RAMPS SLOWER THAN THE GRID), in all eight facings; and the same model gives its head at portrait size
(ONE ID, ONE WHOLE PERSON: the face and the body come from one model, never two).

Run with Blender's Python (bpy 4.2 needs Python 3.11; CPU only, headless; `python3.11 -m venv v && v/bin/pip install
bpy==4.2.0 numpy pillow`, or the free runner):
    <venv>/bin/python tools/bohemia_direction_master_rig.py <model.glb> <out_dir> [--real-length 5.3 | --real-height 1.72]
        [--ppm 57] [--family prop] [--clip Walk:6] [--clip Survey:12] [--portrait 96] [--head-m 0.24]

THE RIG, every number written to <out_dir>/rig.json so a sheet that disagrees can be refused:
  * PIXELS PER METRE 57: the man is the ruler (records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md: CHARACTER read the
    live rig, 98 painted px = 1.72 m). Nothing is scaled after the render; the model is scaled to its real size first
    (--real-length scales its long side on the ground, a car; --real-height scales its standing height, a man).
  * THE CAMERA: orthographic, tilted 45 degrees from straight down, facing north, NOT turned. The row asked X 60 / Z 45;
    the grid is square (his third votes) and his packs are drawn front-on from 45 degrees above (the craft laws' 3/4
    view; COOK FOUR's front gables), so the camera turns 0 and tilts 45. ONE camera for every model.
  * ONE SUN from the upper left, above (the card: his light is from above, a little from the left), plus a dim sky
    fill so the shadow side is one step down, never black.
  * THE VERTICAL STRETCH: a tilted camera foreshortens height by cos(tilt); his packs and the live man draw a standing
    thing at full height over a ground seen from above (the 3/4 cheat). The model's height is stretched 1/cos(tilt)
    (1.414 at 45) before the render, so a 1.72 m man is 98 px on the sprite, where the ruler was measured. Measured
    round two: without it he was 61 px.
  * ORIGINS ON PIXEL MULTIPLES: the model's ground centre is snapped to a whole pixel of the 57 ppm grid, so its eight
    facings never jitter by a sub-pixel; and every picture of one model is cut with ONE box, so a clip's frames never
    jitter either (the box and the ground pixel are in rig.json).
  * THE TURNTABLE: the model turns 0, 45 ... 315 under the fixed camera (N, NE, E, SE, S, SW, W, NW): eight renders.
  * THE CLIPS (--clip <action>:<keys>): the model's own action (a glTF animation by name) sampled at the drawn keys only,
    phase (i + 0.5) / keys like engine/bohemia_quadruped.js keys(clip): a walk is 2 beats = 6 keys, an idle 4 beats =
    12 keys at 120 BPM. Nothing between two keys is rendered, because nothing between two keys is ever drawn.
  * THE PORTRAIT (--portrait <px>): the same model's head, front-on and the two front three-quarters (S, SE, SW), the
    camera tilted 80 (nearly eye level), at the pixels per metre that put a head of --head-m metres at <px> pixels
    (PORTRAIT: at or over 96). Written beside the body in portrait.json; the body's rig.json names it.
  * CYCLES on the CPU at 128 samples (this bpy build has no Workbench; 16 samples read as grain).
  * POST (in plain numpy, his palette only): every pixel snapped to the nearest colour of the family's palette
    (skills/bohemia-pixel-art/references/palettes/<family>.gpl, measured from his tiles; --family none keeps the
    render's colours, for a family that has no measured palette yet, people and beasts); the silhouette's own outer
    pixel taken 20% darker (the card: props end in a soft ring about 5 darker, never a black line).

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (the twin is his own car from the
7/13 UP set), the card of numbers, skills/bohemia-pixel-art, AH-01, AH-03. No reference game.
"""
import os, sys, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
PORTRAIT_FACINGS = ['S', 'SE', 'SW']


def args():
    a = sys.argv[1:]
    def opt(k, d):
        return type(d)(a[a.index(k) + 1]) if k in a else d
    clips = [(c.split(':')[0], int(c.split(':')[1]) if ':' in c else 6) for i, c in enumerate(a) if i and a[i - 1] == '--clip']
    return dict(model=a[0], out=a[1], real_len=opt('--real-length', 0.0), real_h=opt('--real-height', 0.0), ppm=opt('--ppm', 57.0),
                fam=opt('--family', 'prop'), tilt=opt('--tilt', 45.0), clips=clips, portrait=opt('--portrait', 0), head_m=opt('--head-m', 0.24))


def palette(fam):
    cols = []
    for line in open(os.path.join(ROOT, 'skills/bohemia-pixel-art/references/palettes/%s.gpl' % fam)):
        p = line.split()
        if len(p) >= 3 and all(x.isdigit() for x in p[:3]): cols.append([int(x) for x in p[:3]])
    return cols


def bounds(sc, objs):
    """the posed, evaluated bounds of the model's meshes at the current frame, from the real vertices (a skinned mesh's
    own box is its rest shape in its own axes, and read 1.3 m across for a man 0.7 m across: measured round two)"""
    import mathutils
    dg = bpy.context.evaluated_depsgraph_get()
    lo = mathutils.Vector((1e9, 1e9, 1e9)); hi = -lo
    for o in objs:
        e = o.evaluated_get(dg); m = e.to_mesh(); M = e.matrix_world
        for v in m.vertices:
            w = M @ v.co; lo = mathutils.Vector(map(min, lo, w)); hi = mathutils.Vector(map(max, hi, w))
        e.to_mesh_clear()
    return lo, hi


def clip_actions(sc, name):
    """the model's own clip by name: every object whose NLA holds a strip of that action plays it; the others go still"""
    found = []
    for o in sc.objects:
        ad = o.animation_data
        if not ad: continue
        act = None
        for t in ad.nla_tracks:
            t.mute = True
            for s in t.strips:
                if s.action and (s.action.name == name or s.action.name.startswith(name + '_') or s.action.name.startswith(name + '.')): act = s.action
        if act is None and ad.action and (ad.action.name == name or ad.action.name.startswith(name + '_')): act = ad.action
        ad.action = act
        if act: found.append(act)
    if not found: raise SystemExit('no action named %s in the model; actions: %s' % (name, [a.name for a in bpy.data.actions]))
    f0 = min(a.frame_range[0] for a in found); f1 = max(a.frame_range[1] for a in found)
    return f0, f1


def render(A):
    global bpy
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    before = set(o.name for o in sc.objects)
    bpy.ops.import_scene.gltf(filepath=A['model'])
    for o in list(sc.objects):   # this bpy's glTF import drops a 2 m 'Icosphere' (42 verts, no parent) beside every model; it
        if o.name in before or (o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42):
            bpy.data.objects.remove(o, do_unlink=True)   # was inside the ruler's box (a man read 1.3 m wide); nothing but the model is measured or rendered
    objs = [o for o in sc.objects if o.type == 'MESH']
    # the still frame: a clip's first frame if there is one, so the ruler is read off the rest pose
    still = 0
    if A['clips']:
        f0, f1 = clip_actions(sc, A['clips'][0][0]); still = f0
    else:
        for o in sc.objects:
            if o.animation_data:
                for t in o.animation_data.nla_tracks: t.mute = True
                o.animation_data.action = None
    sc.frame_set(int(round(still)))
    # one parent at the ground centre, scaled so the long side (or the height) is its real size
    root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
    lo, hi = bounds(sc, objs)
    size = hi - lo
    k = A['real_h'] / size.z if A['real_h'] else (A['real_len'] or 5.3) / max(size.x, size.y)
    centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    for o in list(sc.objects):
        if o.parent is None and o is not root: o.parent = root; o.location -= centre
    # THE VERTICAL STRETCH (round two, measured): under a 45 tilt a standing 1.72 m man renders 69 px tall, not the
    # ruler's 98, because a tilted camera foreshortens height by cos(tilt) while his packs (and the live man) draw every
    # standing thing at FULL height over a ground seen from above, the 3/4 cheat every pixel pack makes. So the model's
    # height is stretched by 1/cos(tilt) before the render and the ruler is met on the sprite, where it was measured.
    zs = 1.0 / math.cos(math.radians(A['tilt']))
    root.scale = (k, k, k * zs)
    ppm = A['ppm']; px = 1.0 / ppm   # origins on pixel multiples
    root.location = (round(0 / px) * px, round(0 / px) * px, 0)
    dims = (size.x * k, size.y * k, size.z * k)
    # the camera: ortho, tilted from straight down, facing north, never turned
    span = math.hypot(dims[0], dims[1]) + dims[2] * zs + 0.6
    res = int(math.ceil(span * ppm / 2.0)) * 2
    cam_d = bpy.data.cameras.new('cam'); cam_d.type = 'ORTHO'; cam_d.ortho_scale = res / ppm
    cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    def aim(tilt, look_z, ortho, resolution):
        t = math.radians(tilt)
        cam.rotation_euler = (t, 0, 0)
        look = mathutils.Vector((0, 0, look_z)); d = mathutils.Vector((0, math.sin(t), -math.cos(t)))
        cam.location = look - d * 30; cam_d.ortho_scale = ortho
        sc.render.resolution_x = sc.render.resolution_y = resolution
    aim(A['tilt'], dims[2] * zs / 2, res / ppm, res)
    # one sun from the upper left, above; a dim sky fill
    sun_d = bpy.data.lights.new('sun', 'SUN'); sun_d.energy = 3.0; sun_d.angle = math.radians(3)
    sun = bpy.data.objects.new('sun', sun_d); sc.collection.objects.link(sun); sun.rotation_euler = (math.radians(40), 0, math.radians(-35))
    world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
    world.node_tree.nodes['Background'].inputs[0].default_value = (0.55, 0.55, 0.6, 1); world.node_tree.nodes['Background'].inputs[1].default_value = 0.35
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = True; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.render.filter_size = 0.01   # no blur at the edge: one pixel is one pixel
    try:
        sc.view_settings.view_transform = 'Standard'
    except Exception: pass
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 128; sc.cycles.use_denoising = False   # 16 samples read as grain on the sheet (the rig's own loop, cycle 1)
    out = A['out']
    def shot(fn, facing_i):
        # a glTF's front comes in facing -Y (south, at the camera); facing 0 is NORTH, away from it, so the base turn is 180
        root.rotation_euler = (0, 0, math.radians(180 - 45 * facing_i))
        sc.render.filepath = fn; bpy.ops.render.render(write_still=True); return fn
    stills = [shot(os.path.join(out, 'raw_%s.png' % f), i) for i, f in enumerate(FACINGS)]
    clips = {}
    for name, keys in A['clips']:
        f0, f1 = clip_actions(sc, name)
        frames = [f0 + (f1 - f0) * (i + 0.5) / keys for i in range(keys)]
        files = []
        for i, f in enumerate(FACINGS):
            for j, fr in enumerate(frames):
                sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
                files.append(shot(os.path.join(out, 'raw_%s_%s_k%02d.png' % (name, f, j)), i))
        clips[name] = dict(keys=keys, beats=keys / 3.0, frame_range=[round(f0, 2), round(f1, 2)], frames=[round(x, 2) for x in frames], raw=files)
        sc.frame_set(int(round(still))); sc.frame_float = float(still)
    portrait = None
    if A['portrait']:
        head_px = int(A['portrait']); head_m = A['head_m']; pppm = head_px / head_m
        pres = int(math.ceil((head_m * 1.7) * pppm / 2.0)) * 2   # a canvas 1.7 heads tall and wide: the head, its gear, the neck; head only (the third votes)
        root.scale = (k, k, k)   # a face is drawn front-on, no 3/4 cheat: no stretch
        aim(80.0, dims[2] - head_m * 0.55, pres / pppm, pres)
        pfiles = [shot(os.path.join(out, 'raw_portrait_%s.png' % f), FACINGS.index(f)) for f in PORTRAIT_FACINGS]
        portrait = dict(head_px=head_px, head_m=head_m, ppm=round(pppm, 3), res=pres, camera=dict(tilt_deg=80.0, turn_deg=0, ortho=True), facings=PORTRAIT_FACINGS, raw=pfiles)
    return dict(engine='CYCLES', res=res, ortho_scale=res / ppm, real_dims_m=[round(x, 3) for x in dims], scale_from_model=round(k, 4), still_frame=still,
                z_stretch=round(zs, 4), base_turn_deg=180), stills, clips, portrait


def post(files, out, fam, one_box=True):
    """palette snap, the soft ring, and ONE crop box for the whole set so no frame jitters against another"""
    import numpy as np
    from PIL import Image
    pal = np.array(palette(fam), float) if fam != 'none' else None
    arrs = []
    for fn in files:
        a = np.asarray(Image.open(fn).convert('RGBA')).astype(float)
        op = a[..., 3] > 127; a[..., 3] = np.where(op, 255, 0)
        if pal is not None:
            px = a[..., :3][op]; d = ((px[:, None, :] - pal[None]) ** 2).sum(-1); a[..., :3][op] = pal[d.argmin(1)]
        p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
        ring = op & ~inner; a[..., :3][ring] *= 0.8
        arrs.append((fn, a, op))
    boxes = []
    for fn, a, op in arrs:
        ys, xs = np.nonzero(op); boxes.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    box = (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes)) if one_box else None
    outs = []
    for (fn, a, op), b in zip(arrs, boxes):
        im = Image.fromarray(a.astype(np.uint8), 'RGBA').crop(box or b)
        o = os.path.join(os.path.dirname(fn), os.path.basename(fn).replace('raw_', 'rig_')); im.save(o); outs.append(o)
    return outs, [int(x) for x in box] if box else None


def colours(files):
    import numpy as np
    from PIL import Image
    s = set()
    for fn in files:
        a = np.asarray(Image.open(fn).convert('RGBA')); s |= set(map(tuple, a[a[..., 3] > 0][:, :3].tolist()))
    return len(s)


if __name__ == '__main__':
    A = args()
    os.makedirs(A['out'], exist_ok=True)
    meta, stills, clips, portrait = render(A)
    everything = list(stills) + [f for c in clips.values() for f in c['raw']]
    outs, box = post(everything, A['out'], A['fam'])
    rel = lambda o: os.path.relpath(o, ROOT)
    n = len(stills)
    meta.update(model=rel(A['model']), ppm=A['ppm'], metres_per_px=round(1 / A['ppm'], 5), camera=dict(tilt_deg=A['tilt'], turn_deg=0, ortho=True),
                sun='upper left, above', facings=FACINGS, family_palette=A['fam'], files=[rel(o) for o in outs[:n]], crop_box_px=box,
                ground_px=[meta['res'] // 2 - box[0], meta['res'] // 2 - box[1]] if box else None, colours=colours(outs),
                keys_per_beat=3, bpm=120, ruler='records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md (98 px = 1.72 m)')
    i = n
    for name, c in clips.items():
        k = len(c['raw']); c['files'] = [rel(o) for o in outs[i:i + k]]; i += k; del c['raw']
    meta['clips'] = clips
    if portrait:
        pouts, pbox = post(portrait.pop('raw'), A['out'], A['fam'])
        portrait.update(files=[rel(o) for o in pouts], crop_box_px=pbox, model=meta['model'], body_rig='rig.json', colours=colours(pouts))
        json.dump(portrait, open(os.path.join(A['out'], 'portrait.json'), 'w'), indent=1)
        meta['portrait'] = 'portrait.json'
    json.dump(meta, open(os.path.join(A['out'], 'rig.json'), 'w'), indent=1)
    print(json.dumps({k: v for k, v in meta.items() if k not in ('files',)}))
