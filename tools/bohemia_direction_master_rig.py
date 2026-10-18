#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the master rig]: ONE CAMERA, REAL METERS, THE MODEL TURNS (rule 108 ROUND EIGHT (b); rule 107:
everything that turns is made in eight drawn facings; rule 105: never under the pack's floor; rule 102: true size).
ROUND TWO (10/17): THE MODEL ALSO MOVES. A rigged model's clip is drawn at the men's grid (three pictures a beat, twelve
a bar, AN ENVELOPE RAMPS SLOWER THAN THE GRID), in all eight facings; and the same model gives its head at portrait size
(ONE ID, ONE WHOLE PERSON: the face and the body come from one model, never two).
ROUND THREE (10/17): THE LOOK IS MODELLED AT THE SOURCE. The row's own constraint ("analog horror is modelled at the
source or the render reads as a toy") and the card's check on round two (every render BACK, 3 of 8 out: too few colours,
a ring too dark, the man lit from below; the truck's 64-colour snap left it 58 colours and 89% in the top eight) are
answered where the pixels come from, not in a paint pass after:
  * THE SOURCE PASS (--wear 0..1): inside Blender, every material of the model gains what his packs carry in paint: the
    plastic highlight gone (roughness up, specular down: the highlight IS the toy), grime in the crevices (from the
    ambient-occlusion of the model's own shape, authored by its geometry), dust and sun-bleach on the faces that point
    up (from the surface normal, broken up by a metre-scale mask, never per pixel), and a slow colour drift across the
    body so no two square centimetres are one colour. The render then carries thousands of colours the way his tiles
    do, because the SURFACE varies, not because noise was sprinkled on the pixels (lesson 7: fix the source).
  * THE POPULATION SNAP (--family prop --snap 0..1): a render's colours are pulled toward the nearest colour HIS FAMILY
    ACTUALLY USES, read from every opaque pixel of the family in reference/art_bank/<family>/ (binned at 32 levels a
    channel, thousands of bins), never toward a 64-colour list (lesson 6: his art is not limited-palette; round two's
    snap to 64 is what killed the truck). --snap is the pull, 0.6 by default: the hue lands in his family, the render's
    own spread survives. --family none pulls nothing (people, beasts: the packs hold none).
  * THE RING (--ring N): the silhouette's outer pixel N values darker, 8 by default (the card: props end in a soft ring
    about 5 darker, the band -35 to +7; round two's 20% darker ring measured -45 to -49 on a pale model, OUT).
  * THE CONTACT SHADOW: a soft ellipse under the feet, down and right, behind the body (the build order's SEAT IT; every
    standing thing in his packs sits on a shadow), in the sprite's own alpha.
  * THE STILL (--still pass|rest|<frame>): 'pass' picks the frame of the first clip where the body is narrowest along
    its walk (feet together, the passing pose: a standing still, not a mid-stride); 'rest' puts every armature in its
    rest pose; a number is a frame. Round two's still was the clip's first frame, a stride.
  * THE FACE PERFORMS (--expression <shape key>, repeatable): the portrait is rendered front-on once per named shape
    key at full weight (the robot's Angry/Surprised/Sad), so PORTRAIT's pipe shows the same head changing its face.
  * THE CARD, IN THE RIG: after the post, the S still is run through skills/bohemia-pixel-art/scripts/check.py against
    --judge <family> (prop for anything standing on the ground, the nearest band the packs have) and the rows are
    written into rig.json; the gate refuses a rig that is BACK (3 or more of 8 out).

Run with Blender's Python (bpy 4.2 needs Python 3.11; CPU only, headless; `python3.11 -m venv v && v/bin/pip install
bpy==4.2.0 numpy pillow`, or the free runner):
    <venv>/bin/python tools/bohemia_direction_master_rig.py <model.glb> <out_dir> [--real-length 5.3 | --real-height 1.72]
        [--ppm 57] [--family prop|none] [--snap 0.6] [--judge prop] [--wear 0.6] [--ring 8] [--no-shadow]
        [--still pass|rest|<frame>] [--clip Walk:6] [--clip Survey:12] [--portrait 96] [--head-m auto|0.24] [--expression Angry]

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
    camera tilted 80 (nearly eye level), at the pixels per metre that put the head at <px> pixels (PORTRAIT: at or
    over 96). THE HEAD IS MEASURED FROM THE MODEL (round three): the mesh named head, else the mesh with shape keys,
    gives its height and its centre; --head-m <m> overrides it for a model with no head mesh. Written beside the body
    in portrait.json; the body's rig.json names it.
  * CYCLES on the CPU at 128 samples (this bpy build has no Workbench; 16 samples read as grain).

ROUND FOUR (10/18, DIRECTION [the style guide] and [the look bible], rules 114a and 115d): THE RIG READS THE STYLE GUIDE.
Every setting above is no longer a literal in this file: it is read from records/target/BOHEMIA_STYLE_GUIDE.json's rig
block (the look bible as numbers), and what was actually used is written into rig.json as rig_settings, with any key
that differs from the guide listed under breaks (a DON'T render for the do-and-don't sheet, never a candidate). Three
additions from round two of the research (Section C and E):
  * THE CALIBRATION (C2, C4): before the model, the same camera and the same sun render a 1 m cube (it must measure the
    guide's ppm across, plus or minus 1) and a 1 m grey sphere (the highlight-minus-shadow vector gives the light's
    angle ON THE SCREEN, in degrees, 90 = straight up). Written to calibration.json and rig.json.
  * THE MATERIAL-ID PASS (C11, B0): after the colour renders, every material is swapped for a flat emission of its own
    colour and the eight stills are rendered again as id_<facing>.png with one sample, so a gate or the hand-finish
    can select a material exactly. The id table is in rig.json.
  * SETTINGS SPELLED OUT (C6, C7): motion blur off, depth of field off, view transform Standard, look None, exposure 0,
    gamma 1, denoise off, written in the scene, not assumed.
    --sun-rot 140,0,-35 (any override) is allowed and is recorded as a break.

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (the twin is his own car from the
7/13 UP set), the card of numbers, skills/bohemia-pixel-art, AH-01, AH-03. No reference game.
"""
import os, sys, json, math, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
PORTRAIT_FACINGS = ['S', 'SE', 'SW']
RIG_ROUND = 4
GUIDE_PATH = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')
GUIDE = json.load(open(GUIDE_PATH))
G = GUIDE['rig']


def args():
    a = sys.argv[1:]
    def opt(k, d):
        return type(d)(a[a.index(k) + 1]) if k in a else d
    clips = [(c.split(':')[0], int(c.split(':')[1]) if ':' in c else 6) for i, c in enumerate(a) if i and a[i - 1] == '--clip']
    expr = [c for i, c in enumerate(a) if i and a[i - 1] == '--expression']
    fam = opt('--family', 'prop')
    sun = [float(x) for x in opt('--sun-rot', ','.join(str(x) for x in G['sun_rot_deg'])).split(',')]
    return dict(model=a[0], out=a[1], real_len=opt('--real-length', 0.0), real_h=opt('--real-height', 0.0), ppm=opt('--ppm', float(G['ppm'])),
                fam=fam, snap=opt('--snap', 0.6), judge=opt('--judge', fam if fam != 'none' else 'prop'), wear=opt('--wear', float(G['wear'])),
                ring=opt('--ring', float(G['ring'])), shadow=('--no-shadow' not in a) and bool(G['contact_shadow']), still=opt('--still', 'pass'), tilt=opt('--tilt', float(G['tilt_deg'])),
                sun_rot=sun, cls=opt('--class', 'prop' if fam == 'prop' else 'person'), seed=int(opt('--seed', 0)), stills_only='--stills-only' in a, calibrate='--no-calibration' not in a, id_pass='--no-id-pass' not in a,
                clips=clips, portrait=opt('--portrait', 0), head_m=(0.0 if opt('--head-m', 'auto') == 'auto' else float(opt('--head-m', 'auto'))), expressions=expr)


def population(fam):
    """every colour his family actually uses: the opaque pixels of reference/art_bank/<fam>/pack_*.png binned at 32
    levels a channel; each occupied bin keeps the mean of his pixels in it; every empty bin points at the nearest
    occupied one (a dilation in bin space), so a render pixel always finds one of his colours"""
    import glob
    import numpy as np
    from PIL import Image
    files = sorted(glob.glob(os.path.join(ROOT, 'reference/art_bank', fam, 'pack_*.png')))
    if not files: raise SystemExit('no bank tiles for family %s' % fam)
    S = np.zeros((32, 32, 32, 3), float); N = np.zeros((32, 32, 32), float)
    for fn in files:
        a = np.asarray(Image.open(fn).convert('RGBA')); px = a[a[..., 3] > 127][:, :3].astype(float)
        b = (px // 8).astype(int)
        np.add.at(S, (b[:, 0], b[:, 1], b[:, 2]), px); np.add.at(N, (b[:, 0], b[:, 1], b[:, 2]), 1)
    occ = N > 0
    mean = np.where(occ[..., None], S / np.maximum(N, 1)[..., None], 0)
    near = mean.copy(); filled = occ.copy()
    for _ in range(32):   # dilate: an empty bin takes the colour of a filled neighbour, until every bin is filled
        if filled.all(): break
        src = near.copy(); fsrc = filled.copy()
        for ax in range(3):
            for sh in (1, -1):
                nb = np.roll(src, sh, axis=ax); fb = np.roll(fsrc, sh, axis=ax)
                take = ~filled & fb; near[take] = nb[take]; filled |= take
    return near, int(occ.sum()), len(files)


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


def source_pass(objs, wear, k, seed=0):
    """THE LOOK AT THE SOURCE: what his packs carry in paint, put into the model's materials before the render. Nothing
    here touches a pixel; it changes the surface the light falls on. k converts the model's units to metres, so every
    mask is sized in the world (grain about one pixel at 57 ppm, drift 20 cm, dust 50 cm) and the same on a truck and
    a man. Returns what it did, for rig.json."""
    done = set()
    GRIME, DUST = (0.11, 0.085, 0.065, 1), (0.66, 0.60, 0.50, 1)   # crevice dirt, warm and dark; sun-bleached dust, pale and warm
    GRAIN_PER_M, DRIFT_PER_M, DUST_PER_M = 28.0, 5.0, 2.0
    for o in objs:
        for slot in o.material_slots:
            m = slot.material
            if not m or m.name in done: continue
            done.add(m.name)
            m.use_nodes = True; nt = m.node_tree
            bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if not bsdf: continue
            so = float(o.matrix_world.to_scale().x)   # a mesh's own coordinates can carry an object scale (the robot's parts: 100); metres = local x that x k
            # 1. the plastic highlight is the toy: matte, no specular
            if not bsdf.inputs['Roughness'].links: bsdf.inputs['Roughness'].default_value = max(bsdf.inputs['Roughness'].default_value, 0.9)
            for sp in ('Specular IOR Level', 'Specular'):
                if sp in bsdf.inputs and not bsdf.inputs[sp].links: bsdf.inputs[sp].default_value = 0.15
            if not bsdf.inputs['Metallic'].links: bsdf.inputs['Metallic'].default_value = min(bsdf.inputs['Metallic'].default_value, 0.2)
            base = bsdf.inputs['Base Color']
            src = base.links[0].from_socket if base.links else None
            if src is None:
                rgb = nt.nodes.new('ShaderNodeRGB'); rgb.outputs[0].default_value = tuple(base.default_value); src = rgb.outputs[0]
            # 2. grime where the shape closes on itself: the model's own ambient occlusion
            ao = nt.nodes.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 0.25; ao.samples = 8; ao.only_local = True
            crev = nt.nodes.new('ShaderNodeMath'); crev.operation = 'SUBTRACT'; crev.inputs[0].default_value = 1.0; nt.links.new(ao.outputs['AO'], crev.inputs[1])
            crevw = nt.nodes.new('ShaderNodeMath'); crevw.operation = 'MULTIPLY'; crevw.inputs[1].default_value = 1.6 * wear; crevw.use_clamp = True
            nt.links.new(crev.outputs[0], crevw.inputs[0])
            # every mask in metres, stuck to the surface: the mesh's own coordinates times the model-to-metre scale
            tc = nt.nodes.new('ShaderNodeTexCoord')
            def coords(per_m):
                mp = nt.nodes.new('ShaderNodeMapping'); mp.vector_type = 'POINT'; s = float(so * k * per_m); mp.inputs['Scale'].default_value = (s, s, s)
                if seed: mp.inputs['Location'].default_value = (seed * 13.7, seed * 7.3, seed * 3.1)   # a second wear seed: the same model, other dirt (guide field 12)
                nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); return mp.outputs['Vector']
            # 3. dust and bleach on what points up, broken by a half-metre mask (a mask is shaped, never his pixels)
            geo = nt.nodes.new('ShaderNodeNewGeometry'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(geo.outputs['Normal'], sep.inputs[0])
            up = nt.nodes.new('ShaderNodeMath'); up.operation = 'MAXIMUM'; up.inputs[1].default_value = 0.0; nt.links.new(sep.outputs['Z'], up.inputs[0])
            noise = nt.nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value = 1.0; noise.inputs['Detail'].default_value = 5.0; noise.inputs['Roughness'].default_value = 0.65
            nt.links.new(coords(DUST_PER_M), noise.inputs['Vector'])
            dust = nt.nodes.new('ShaderNodeMath'); dust.operation = 'MULTIPLY'; nt.links.new(up.outputs[0], dust.inputs[0]); nt.links.new(noise.outputs['Fac'], dust.inputs[1])
            dustw = nt.nodes.new('ShaderNodeMath'); dustw.operation = 'MULTIPLY'; dustw.inputs[1].default_value = 1.1 * wear; dustw.use_clamp = True; nt.links.new(dust.outputs[0], dustw.inputs[0])
            # 4. a slow drift of colour across the body (20 cm, warm into light and cool into shade): no two square centimetres one colour
            drift = nt.nodes.new('ShaderNodeTexNoise'); drift.inputs['Scale'].default_value = 1.0; drift.inputs['Detail'].default_value = 4.0; drift.inputs['Roughness'].default_value = 0.6
            nt.links.new(coords(DRIFT_PER_M), drift.inputs['Vector'])
            # 5. the grain: a light-dark step about a pixel wide, in value only, the way his tiles' paint is (grain 1.6 to 2.0 px a run)
            grain = nt.nodes.new('ShaderNodeTexNoise'); grain.inputs['Scale'].default_value = 1.0; grain.inputs["Detail"].default_value = 2.0; grain.inputs['Roughness'].default_value = 0.5
            nt.links.new(coords(GRAIN_PER_M), grain.inputs['Vector'])
            wide = nt.nodes.new('ShaderNodeMapRange'); wide.inputs['From Min'].default_value = 0.32; wide.inputs['From Max'].default_value = 0.68; wide.clamp = True   # the noise's middle band stretched to the full step
            nt.links.new(grain.outputs['Fac'], wide.inputs['Value'])
            mix1 = nt.nodes.new('ShaderNodeMixRGB'); mix1.blend_type = 'MIX'; mix1.inputs['Color2'].default_value = GRIME
            nt.links.new(src, mix1.inputs['Color1']); nt.links.new(crevw.outputs[0], mix1.inputs['Fac'])
            mix2 = nt.nodes.new('ShaderNodeMixRGB'); mix2.blend_type = 'MIX'; mix2.inputs['Color2'].default_value = DUST
            nt.links.new(mix1.outputs['Color'], mix2.inputs['Color1']); nt.links.new(dustw.outputs[0], mix2.inputs['Fac'])
            mix3 = nt.nodes.new('ShaderNodeMixRGB'); mix3.blend_type = 'OVERLAY'; mix3.inputs['Fac'].default_value = 0.45 * wear
            nt.links.new(mix2.outputs['Color'], mix3.inputs['Color1']); nt.links.new(drift.outputs['Color'], mix3.inputs['Color2'])
            # the grain lives in the wear, never even over a surface (a leopard print, measured cycle 4): heavy in the grime and
            # the dust patches, light on clean panel; the patch mask is the 20 cm drift's middle band
            patch = nt.nodes.new('ShaderNodeMapRange'); patch.inputs['From Min'].default_value = 0.42; patch.inputs['From Max'].default_value = 0.62; patch.clamp = True
            nt.links.new(drift.outputs['Fac'], patch.inputs['Value'])
            gp = nt.nodes.new('ShaderNodeMath'); gp.operation = 'MULTIPLY_ADD'; gp.inputs[1].default_value = 0.7 * wear; gp.inputs[2].default_value = 0.12 * wear
            nt.links.new(patch.outputs['Result'], gp.inputs[0])
            gf = nt.nodes.new('ShaderNodeMath'); gf.operation = 'MULTIPLY_ADD'; gf.inputs[1].default_value = 0.8 * wear; gf.use_clamp = True
            nt.links.new(crevw.outputs[0], gf.inputs[0]); nt.links.new(gp.outputs[0], gf.inputs[2])
            mix4 = nt.nodes.new('ShaderNodeMixRGB'); mix4.blend_type = 'OVERLAY'
            nt.links.new(gf.outputs[0], mix4.inputs['Fac'])
            nt.links.new(mix3.outputs['Color'], mix4.inputs['Color1']); nt.links.new(wide.outputs['Result'], mix4.inputs['Color2'])
            for l in list(base.links): nt.links.remove(l)
            nt.links.new(mix4.outputs['Color'], base)
    return dict(wear=wear, materials=sorted(done), what=['matte: roughness >= 0.9, specular 0.15, metallic <= 0.2', 'crevice grime from the model\'s own ambient occlusion (0.25 m)',
                'dust and bleach on up-facing surfaces under a 50 cm mask', 'a 20 cm colour drift across the body (overlay, %.2f)' % (0.45 * wear),
                'value grain at %g a metre, about two pixels at 57 ppm, its middle band stretched to the full step, its strength driven by the wear masks (%.2f in a patch or a crevice, %.2f on clean panel); finer grain averages to grey inside a pixel and even grain is a leopard print, both measured' % (GRAIN_PER_M, min(1.0, 0.82 * wear), 0.12 * wear)], seed=seed, masks_in='metres, stuck to the surface (each mesh\'s own coordinates x its object scale x %.4f)' % k)


def passing_frame(sc, objs, f0, f1):
    """the frame where the body is narrowest along its walk (the passing pose, feet together): a standing still"""
    best = None
    for i in range(24):
        fr = f0 + (f1 - f0) * (i + 0.5) / 24
        sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
        lo, hi = bounds(sc, objs); d = min(hi.x - lo.x, hi.y - lo.y)
        if best is None or d < best[0]: best = (d, fr)
    return best[1]


def light_and_film(sc, A):
    """THE ONE LAMP AND THE FILM, every number from the style guide's rig block (round four): one sun bolted to the
    world (the camera never moves and the model turns), a cool sky fill, Cycles on the CPU, no blur of any kind, the
    Standard view so a hex set in a material comes out as that hex"""
    import bpy
    sun_d = bpy.data.lights.new('sun', 'SUN'); sun_d.energy = float(G['sun_energy']); sun_d.angle = math.radians(G['sun_angle_deg'])
    sun = bpy.data.objects.new('sun', sun_d); sc.collection.objects.link(sun); sun.rotation_euler = tuple(math.radians(x) for x in A['sun_rot'])
    world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
    world.node_tree.nodes['Background'].inputs[0].default_value = tuple(G['fill_rgb']) + (1,); world.node_tree.nodes['Background'].inputs[1].default_value = float(G['fill_strength'])
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = bool(G['film_transparent']); sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.render.image_settings.color_depth = '8'
    sc.render.filter_size = float(G['filter_px'])   # no blur at the edge: one pixel is one pixel
    sc.render.use_motion_blur = bool(G['motion_blur'])
    sc.view_settings.view_transform = G['view_transform']; sc.view_settings.look = 'None'; sc.view_settings.exposure = 0.0; sc.view_settings.gamma = 1.0
    sc.render.dither_intensity = 0.0
    sc.render.engine = G['engine']; sc.cycles.device = G['device']; sc.cycles.samples = int(G['samples']); sc.cycles.use_denoising = bool(G['denoise'])   # 16 samples read as grain on the sheet (the rig's own loop, cycle 1)
    return sun


def calibrate(A):
    """THE CALIBRATION (round four, research round two C2 and C4): the same camera and the same sun on a 1 m cube and a
    1 m sphere, before the model. The cube must be the guide's ppm wide; the sphere's lit-minus-dark vector is the
    light's angle on the screen. Nothing here is the model; it proves the rig before the rig draws anything."""
    import bpy, mathutils
    import numpy as np
    from PIL import Image
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    ppm = A['ppm']; res = int(math.ceil(2.4 * ppm / 2.0)) * 2
    cam_d = bpy.data.cameras.new('cam'); cam_d.type = 'ORTHO'; cam_d.ortho_scale = res / ppm
    cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(A['tilt']); cam.rotation_euler = (t, 0, 0)
    cam.location = mathutils.Vector((0, 0, 0.5)) - mathutils.Vector((0, math.sin(t), -math.cos(t))) * 30
    sc.render.resolution_x = sc.render.resolution_y = res
    light_and_film(sc, A)
    mat = bpy.data.materials.new('clay'); mat.use_nodes = True
    b = mat.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (0.5, 0.5, 0.5, 1); b.inputs['Roughness'].default_value = 1.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    out = {}
    for kind in ('cube', 'sphere'):
        for o in [o for o in sc.objects if o.type == 'MESH']: bpy.data.objects.remove(o, do_unlink=True)
        if kind == 'cube': bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.5))
        else: bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0, 0, 0.5), segments=64, ring_count=32); bpy.ops.object.shade_smooth()
        o = bpy.context.active_object; o.data.materials.append(mat)
        fn = os.path.join(A['out'], 'calibration_%s.png' % kind); sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
        a = np.asarray(Image.open(fn).convert('RGBA')).astype(float); op = a[..., 3] > G['alpha_threshold']
        ys, xs = np.nonzero(op)
        if kind == 'cube':
            out['cube_px'] = int(xs.max() - xs.min() + 1)
        else:
            v = a[..., :3].mean(2)[op]; hi = v >= np.percentile(v, 85); lo = v <= np.percentile(v, 15)
            dx = xs[hi].mean() - xs[lo].mean(); dy = -(ys[hi].mean() - ys[lo].mean())   # screen y up
            out['screen_light_deg'] = round(math.degrees(math.atan2(dy, dx)) % 360, 1)
            out['sphere_value_span'] = int(v.max() - v.min()); out['sphere_darkest'] = int(v.min())
    c = G['calibration']
    out['cube_px_expected'] = int(round(c['cube_m'] * ppm)); out['cube_ok'] = abs(out['cube_px'] - out['cube_px_expected']) <= c['cube_px_tolerance']
    if c.get('screen_light_deg') is not None:
        d = abs((out['screen_light_deg'] - c['screen_light_deg'] + 540) % 360 - 180); out['light_off_deg'] = round(d, 1); out['light_ok'] = d <= c['screen_light_tolerance_deg']
    json.dump(out, open(os.path.join(A['out'], 'calibration.json'), 'w'), indent=1)
    if not out['cube_ok']: raise SystemExit('CALIBRATION FAILED: the 1 m cube is %d px, the guide says %d' % (out['cube_px'], out['cube_px_expected']))
    return out


def id_pass(sc, objs, root):
    """THE MATERIAL-ID PASS (round four, research round two B0 and C11): every material becomes a flat emission of its
    own colour, one sample, and the eight stills are rendered again, so the hand-finish and the gates select a material
    exactly. Runs last: it overwrites the materials."""
    import bpy, colorsys
    names = sorted({s.material.name for o in objs for s in o.material_slots if s.material})
    table = {}
    for i, n in enumerate(names):
        r, g, b = colorsys.hsv_to_rgb((i * 0.61803) % 1.0, 0.9, 1.0); table[n] = '#%02x%02x%02x' % (int(r * 255), int(g * 255), int(b * 255))
        m = bpy.data.materials[n]; m.use_nodes = True; nt = m.node_tree
        for l in list(nt.links): nt.links.remove(l)
        em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (r, g, b, 1); em.inputs['Strength'].default_value = 1.0
        mo = next(n2 for n2 in nt.nodes if n2.type == 'OUTPUT_MATERIAL'); nt.links.new(em.outputs[0], mo.inputs['Surface'])
    sc.cycles.samples = 1; sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.0
    sc.view_settings.view_transform = 'Standard'
    files = []
    for i, f in enumerate(FACINGS):
        root.rotation_euler = (0, 0, math.radians(180 - 45 * i))
        fn = os.path.join(sc.render.filepath and os.path.dirname(sc.render.filepath) or '.', 'id_%s.png' % f); sc.render.filepath = fn
        bpy.ops.render.render(write_still=True); files.append(fn)
    return table, files


def render(A):
    global bpy
    import bpy, mathutils
    calib = calibrate(A) if A['calibrate'] else None
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    before = set(o.name for o in sc.objects)
    bpy.ops.import_scene.gltf(filepath=A['model'])
    for o in list(sc.objects):   # this bpy's glTF import drops a 2 m 'Icosphere' (42 verts, no parent) beside every model; it
        if o.name in before or (o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42):
            bpy.data.objects.remove(o, do_unlink=True)   # was inside the ruler's box (a man read 1.3 m wide); nothing but the model is measured or rendered
    objs = [o for o in sc.objects if o.type == 'MESH']
    arms = [o for o in sc.objects if o.type == 'ARMATURE']
    # the still frame: the passing pose of the first clip, the rest pose, or a frame; the ruler is read off it
    still, still_how = 0.0, 'frame 0'
    if A['clips']:
        f0, f1 = clip_actions(sc, A['clips'][0][0]); still = f0; still_how = 'frame %g (the clip\'s first)' % f0
        if A['still'] == 'pass': still = passing_frame(sc, objs, f0, f1); still_how = 'the passing pose of %s, frame %.2f' % (A['clips'][0][0], still)
        elif A['still'] not in ('rest',): still = float(A['still']); still_how = 'frame %g' % still
    else:
        for o in sc.objects:
            if o.animation_data:
                for t in o.animation_data.nla_tracks: t.mute = True
                o.animation_data.action = None
    if A['still'] == 'rest':
        for a in arms: a.data.pose_position = 'REST'
        still_how = 'the rest pose'
    sc.frame_set(int(math.floor(still)), subframe=still - math.floor(still))
    # one parent at the ground centre, scaled so the long side (or the height) is its real size
    root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
    lo, hi = bounds(sc, objs)
    size = hi - lo
    k = A['real_h'] / size.z if A['real_h'] else (A['real_len'] or 5.3) / max(size.x, size.y)
    source = source_pass(objs, A['wear'], k, A['seed']) if A['wear'] > 0 else None
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
    light_and_film(sc, A)
    out = A['out']
    def shot(fn, facing_i):
        # a glTF's front comes in facing -Y (south, at the camera); facing 0 is NORTH, away from it, so the base turn is 180
        root.rotation_euler = (0, 0, math.radians(180 - 45 * facing_i))
        sc.render.filepath = fn; bpy.ops.render.render(write_still=True); return fn
    stills = [shot(os.path.join(out, 'raw_%s.png' % f), i) for i, f in enumerate(FACINGS)]
    for a in arms: a.data.pose_position = 'POSE'
    clips = {}
    for name, keys in ([] if A['stills_only'] else A['clips']):   # --stills-only: the clip poses the still, its keys are not rendered
        f0, f1 = clip_actions(sc, name)
        frames = [f0 + (f1 - f0) * (i + 0.5) / keys for i in range(keys)]
        files = []
        for i, f in enumerate(FACINGS):
            for j, fr in enumerate(frames):
                sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
                files.append(shot(os.path.join(out, 'raw_%s_%s_k%02d.png' % (name, f, j)), i))
        clips[name] = dict(keys=keys, beats=keys / 3.0, frame_range=[round(f0, 2), round(f1, 2)], frames=[round(x, 2) for x in frames], raw=files)
    if A['clips']: clip_actions(sc, A['clips'][0][0])
    if A['still'] == 'rest':
        for a in arms: a.data.pose_position = 'REST'
    sc.frame_set(int(math.floor(still)), subframe=still - math.floor(still))
    portrait = None
    if A['portrait']:
        head_px = int(A['portrait']); head_m = A['head_m']; head_how = '--head-m %g' % head_m
        root.scale = (k, k, k)   # a face is drawn front-on, no 3/4 cheat: no stretch
        head_objs = [o for o in objs if 'head' in o.name.lower()] or [o for o in objs if o.data.shape_keys]
        if head_objs:   # THE HEAD IS MEASURED FROM THE MODEL (round three: a robot's head is 0.9 m of its 1.72 m; told 0.30, the crop sat on the brow)
            hlo, hhi = bounds(sc, head_objs); measured = hhi.z - hlo.z; look_z = (hlo.z + hhi.z) / 2
            if not head_m: head_m = measured; head_how = 'measured from %s: %.3f m' % (', '.join(o.name for o in head_objs), head_m)
        else:
            look_z = dims[2] - (head_m or 0.24) * 0.55; head_m = head_m or 0.24; head_how += ' (no head mesh named; the top of the body)'
        pppm = head_px / head_m
        pres = int(math.ceil((head_m * 1.7) * pppm / 2.0)) * 2   # a canvas 1.7 heads tall and wide: the head, its gear, the neck; head only (the third votes)
        aim(80.0, look_z, pres / pppm, pres)
        pfiles = [shot(os.path.join(out, 'raw_portrait_%s.png' % f), FACINGS.index(f)) for f in PORTRAIT_FACINGS]
        # THE FACE PERFORMS: the same head, front-on, once per named shape key at full weight
        efiles = {}
        keyed = [o for o in objs if o.data.shape_keys]
        for e in A['expressions']:
            hit = False
            for o in keyed:
                kb = o.data.shape_keys.key_blocks
                for b in kb: b.value = 0.0
                if e in kb: kb[e].value = 1.0; hit = True
            if not hit: raise SystemExit('no shape key named %s; the model has %s' % (e, sorted(set(b.name for o in keyed for b in o.data.shape_keys.key_blocks))))
            efiles[e] = shot(os.path.join(out, 'raw_portrait_S_%s.png' % e), FACINGS.index('S'))
            for o in keyed:
                for b in o.data.shape_keys.key_blocks: b.value = 0.0
        portrait = dict(head_px=head_px, head_m=round(head_m, 4), head_how=head_how, ppm=round(pppm, 3), res=pres, camera=dict(tilt_deg=80.0, turn_deg=0, ortho=True), facings=PORTRAIT_FACINGS, raw=pfiles,
                        expressions=list(A['expressions']), raw_expressions=efiles)
    idt, idf = (None, [])
    if A['id_pass']:
        if A['still'] == 'rest':
            for a in arms: a.data.pose_position = 'REST'
        sc.frame_set(int(math.floor(still)), subframe=still - math.floor(still)); root.scale = (k, k, k * zs)
        aim(A['tilt'], dims[2] * zs / 2, res / ppm, res); sc.render.filepath = os.path.join(out, 'x.png')
        idt, idf = id_pass(sc, objs, root)
    return dict(engine=G['engine'], res=res, ortho_scale=res / ppm, real_dims_m=[round(x, 3) for x in dims], scale_from_model=round(k, 4), still_frame=round(still, 3), still=still_how,
                z_stretch=round(zs, 4), base_turn_deg=180, source_pass=source, calibration=calib, id_table=idt, id_files_raw=idf), stills, clips, portrait


def post(files, out, A, pop=None, shadow=False, one_box=True):
    """the population snap, the soft ring, the contact shadow, and ONE crop box for the whole set so no frame jitters
    against another"""
    import numpy as np
    from PIL import Image
    arrs = []
    for fn in files:
        a = np.asarray(Image.open(fn).convert('RGBA')).astype(float)
        op = a[..., 3] > G['alpha_threshold']; a[..., 3] = np.where(op, 255, 0)
        if pop is not None and A['snap'] > 0:
            px = a[..., :3][op]; b = np.clip((px // 8).astype(int), 0, 31)
            his = pop[b[:, 0], b[:, 1], b[:, 2]]
            a[..., :3][op] = px + (his - px) * A['snap']
        p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
        ring = op & ~inner; a[..., :3][ring] = np.clip(a[..., :3][ring] - A['ring'], 0, 255)
        if shadow:
            ys, xs = np.nonzero(op)
            if len(ys):
                foot = ys.max(); band = ys >= foot - max(2, int((foot - ys.min()) * 0.12))
                x0, x1 = xs[band].min(), xs[band].max(); cx = (x0 + x1) / 2 + 2; rx = max(4.0, (x1 - x0) / 2 * 1.25); ry = max(2.0, rx * 0.38); cy = foot - ry * 0.35 + 1
                yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
                d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
                sh = np.clip((1.15 - d) / 0.3, 0, 1) * float(G['shadow_alpha_max'])   # a soft edge two pixels wide, 42% at the centre
                put = (~op) & (sh > 0.02)
                a[..., :3][put] = 0; a[..., 3][put] = np.round(sh[put] * 255)
        arrs.append((fn, a, op))
    boxes = []
    for fn, a, op in arrs:
        ys, xs = np.nonzero(a[..., 3] > 0); boxes.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
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
        a = np.asarray(Image.open(fn).convert('RGBA')); s |= set(map(tuple, a[a[..., 3] > 200][:, :3].tolist()))
    return len(s)


def card(png, fam):
    """the S still through the skill's check, against its family's band; the rows and the count go into rig.json"""
    r = subprocess.run(['python3', os.path.join(ROOT, 'skills/bohemia-pixel-art/scripts/check.py'), png, fam], capture_output=True, text=True, cwd=ROOT)
    lines = [l.rstrip() for l in r.stdout.splitlines() if l.strip()]
    rows = [l for l in lines if l.startswith('OK ') or l.startswith('OUT ')]
    out = sum(1 for l in rows[:8] if l.startswith('OUT'))
    verdict = next((l for l in lines if ' of 8 out' in l), '')
    return dict(family=fam, out=out, rows=rows[:8], craft=rows[8:], verdict=verdict.strip(), file=os.path.relpath(png, ROOT))


def same(x, y):
    """a setting used equals the guide's (40 and 40.0 are the same number)"""
    if isinstance(x, (list, tuple)) and isinstance(y, (list, tuple)): return len(x) == len(y) and all(same(i, j) for i, j in zip(x, y))
    if isinstance(x, bool) or isinstance(y, bool): return x == y
    if isinstance(x, (int, float)) and isinstance(y, (int, float)): return float(x) == float(y)
    return x == y


def guide_card(c, png, cls):
    """THE CARD UNDER THE STYLE GUIDE (round four): the card's eight rows were measured on cut pack tiles, all drawn in
    one 96 px box; the rig draws true size (rule 102). Two rows are re-read by the guide's field 5: the size row by rule
    105's floor for the KIND (a prop 29 x 36, a car 96 long), and the colour row, for a sprite with fewer opaque pixels
    than one of his prop tiles, by his props' colour DENSITY (370 per 1,000 px). The other six stand as the card says."""
    import numpy as np
    from PIL import Image
    f5 = GUIDE['fields'][4]['value']; fl = f5['size_floor_px']; dens = f5['colour_floor_small']['density_per_1000px']
    a = np.asarray(Image.open(png).convert('RGBA')); op = a[..., 3] > 200
    ys, xs = np.nonzero(op); w, h = int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1); n = int(op.sum())
    colours = len(set(map(tuple, a[op][:, :3].tolist())))
    rows, why = [], []
    for r in c['rows']:
        name = r.split(None, 1)[1]
        if name.startswith('long side'):
            if cls == 'prop': good = w >= fl['prop'][0] and h >= fl['prop'][1]; r = '%s  size >= %dx%d (rule 105, a prop): %dx%d' % ('OK ' if good else 'OUT', fl['prop'][0], fl['prop'][1], w, h); why.append('size by rule 105')
            elif cls == 'vehicle': good = max(w, h) >= fl['vehicle_long_side']; r = '%s  long side >= %d (rule 105, a car): %d' % ('OK ' if good else 'OUT', fl['vehicle_long_side'], max(w, h))
        elif name.startswith('colours'):
            floor = GUIDE['classes'][cls]['output_floor'] if cls in GUIDE['classes'] else 2330
            floor = min(floor, int(round(dens * n / 1000.0)))
            r = '%s  colours >= %d (field 5: the class floor, or %d per 1,000 of %d px): %d' % ('OK ' if colours >= floor else 'OUT', floor, dens, n, colours); why.append('colours by field 5')
        rows.append(r)
    out = sum(1 for r in rows if r.startswith('OUT'))
    return dict(cls=cls, out=out, rows=rows, reread=why, verdict='%d of 8 out under the style guide%s' % (out, ' -> BACK before VOTE' if out >= 3 else ''), size_px=[w, h], opaque_px=n, colours=colours)


def rejudge(d, cls):
    """python3 tools/bohemia_direction_master_rig.py --rejudge <rig_dir> <class>: the card under the guide, no Blender"""
    m = json.load(open(os.path.join(d, 'rig.json')))
    if 'rig_settings' in m: m['breaks'] = sorted(k for k in m['rig_settings'] if k in G and not same(m['rig_settings'][k], G[k]))
    m['cls'] = cls; m['card_guide'] = guide_card(m['card'], os.path.join(ROOT, m['files'][FACINGS.index('S')]), cls)
    json.dump(m, open(os.path.join(d, 'rig.json'), 'w'), indent=1); return m['card_guide']


if __name__ == '__main__' and sys.argv[1:2] == ['--rejudge']:
    print(json.dumps(rejudge(sys.argv[2], sys.argv[3]), indent=1)); sys.exit(0)

if __name__ == '__main__':
    A = args()
    os.makedirs(A['out'], exist_ok=True)
    meta, stills, clips, portrait = render(A)
    pop, bins, ntiles = (population(A['fam']) if A['fam'] != 'none' else (None, 0, 0))
    everything = list(stills) + [f for c in clips.values() for f in c['raw']]
    outs, box = post(everything, A['out'], A, pop, shadow=A['shadow'])
    rel = lambda o: os.path.relpath(o, ROOT)
    n = len(stills)
    meta.update(model=rel(A['model']), rig_round=RIG_ROUND, ppm=A['ppm'], metres_per_px=round(1 / A['ppm'], 5), camera=dict(tilt_deg=A['tilt'], turn_deg=0, ortho=True),
                sun='upper left, above', facings=FACINGS, family_palette=A['fam'],
                snap=dict(family=A['fam'], pull=A['snap'], bins=bins, tiles=ntiles, how='toward the nearest of the family\'s own colours, 32 levels a channel') if pop is not None else None,
                ring=A['ring'], contact_shadow=A['shadow'], files=[rel(o) for o in outs[:n]], crop_box_px=box,
                ground_px=[meta['res'] // 2 - box[0], meta['res'] // 2 - box[1]] if box else None, colours=colours(outs),
                keys_per_beat=3, bpm=120, ruler='records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md (98 px = 1.72 m)')
    i = n
    for name, c in clips.items():
        k = len(c['raw']); c['files'] = [rel(o) for o in outs[i:i + k]]; i += k; del c['raw']
    meta['clips'] = clips
    meta['card'] = card(outs[FACINGS.index('S')], A['judge'])
    meta['cls'] = A['cls']; meta['card_guide'] = guide_card(meta['card'], outs[FACINGS.index('S')], A['cls'])
    # THE SETTINGS USED, against the guide (round four; research round two D1): a key that differs is a break, and a
    # rig with a break is a DON'T render, never a candidate (gates/style_guide_gate.py)
    used = dict(G); used.update(ppm=A['ppm'], tilt_deg=A['tilt'], sun_rot_deg=A['sun_rot'], wear=A['wear'], ring=A['ring'], contact_shadow=A['shadow'])
    used = {k: v for k, v in used.items() if not k.startswith('_') and k != 'calibration'}
    meta['rig_settings'] = used
    meta['breaks'] = sorted(k for k in used if not same(used[k], G[k]))
    meta['guide'] = dict(file=os.path.relpath(GUIDE_PATH, ROOT), schema=GUIDE['schema'])
    if meta.get('id_files_raw'):
        from PIL import Image
        ids = []
        for fn in meta.pop('id_files_raw'):
            im = Image.open(fn).convert('RGBA'); im = im.crop(tuple(box)); o = fn.replace('id_', 'rigid_'); im.save(o); ids.append(rel(o))
        meta['id_files'] = ids
    else: meta.pop('id_files_raw', None)
    if portrait:
        praw = portrait.pop('raw'); eraw = portrait.pop('raw_expressions')
        pouts, pbox = post(praw + list(eraw.values()), A['out'], A, pop, shadow=False)
        portrait.update(files=[rel(o) for o in pouts[:len(praw)]], expression_files={e: rel(o) for e, o in zip(eraw.keys(), pouts[len(praw):])},
                        crop_box_px=pbox, model=meta['model'], body_rig='rig.json', colours=colours(pouts))
        json.dump(portrait, open(os.path.join(A['out'], 'portrait.json'), 'w'), indent=1)
        meta['portrait'] = 'portrait.json'
    json.dump(meta, open(os.path.join(A['out'], 'rig.json'), 'w'), indent=1)
    print(json.dumps({k: v for k, v in meta.items() if k not in ('files', 'clips')}, indent=1))
