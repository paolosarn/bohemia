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

ROUND SIX (10/18, DIRECTION [the truck turned up]; his YES on round five with 'the truck looks a little too much like a
play toy for real, so turn it up'): THE TOY'S FOUR TELLS ARE TAKEN OUT OF THE RECIPE, not out of one truck. Each is a key of
the guide's rig block, so every render after this loses them:
  * THE SHINE: roughness 1, specular 0 (round three left 0.15: the last of the plastic highlight).
  * THE NEW PAINT: every base colour loses saturation to paint_sat_mul, and the faces that point at the sun lose bleach_up
    more of it, before any wear (a toy's paint is fresh and loud; a thing left in the desert is chalky).
  * THE PERFECT EDGE: the shape is cut finer and pushed by a 3D cloud of dent_m (dent_pass), and within edge_m of every
    turn the paint chips through to a dark undercoat in broken patches (chip_per_m, chip_mul), so no edge is one ruled
    line of one colour.
  * THE TOY'S PROPORTIONS: --real-dims L,W,H records the model's length to width and length to height against the real
    thing's (proportion_tolerance); a chunky wide body on big wheels is a toy's, and the model is built true (the truck:
    tools/bohemia_direction_model_truck.py).

ROUND SEVEN (10/18, DIRECTION [the rig round six]: THE CLIPS ARE MEASURED; research round two D9, R11 and R12): a clip is
judged frame against frame, so the rig now hands a gate what it needs to tell motion from boil:
  * THE OBJECT-ID PASS: every mesh part becomes one flat colour (obj_table in rig.json) and the eight stills AND every
    clip key are rendered again at one sample as rigobj_*.png on the same box, so a part's pixels can be counted per
    frame (R11: a part that vanishes and returns) and the moving parts' pixels masked (R12).
  * THE HOLD (rig.hold_px, research C3 taken per part): a rigid part that would move under half a pixel since its
    last DRAWN pose keeps that pose, so a fifth-of-a-pixel drift never resamples its grain (measured on the robot's
    idle: 72 percent of the sprite changed outside the moving parts, 10.9 percent visibly); a skinned part rides the
    rigid part its strongest bone carries; a key where every part holds repeats the key before, copied bit for bit.
  * THE MOTION TABLE (clips.<name>.motion_px): for each facing and key, how far each part's furthest vertex moved on
    the screen since the key before (cyclic, a loop), in what is DRAWN (the holds laid on), from the model's own
    evaluated vertices under the one camera; a part that moved hold_px or more is inside the moving mask.
  * THE MOVERS' LIGHT (rig.light_mask_samples, rig.light_mask_values): for a key where some parts move and some hold,
    white clay rendered with and without the movers in the light (camera rays only): their cast shadow and bounce on
    the parts that hold is motion, not boil; riglight_*.png on the same box.
  * THE WEAR BY MATERIAL (rig.wear_by_material): hair, skin and eyes take a share of the dust and the chips (CHARACTER,
    COOK THREE: every dark crown rendered grey; PORTRAIT: the chips blotch skin).

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (the twin is his own car from the
7/13 UP set), the card of numbers, skills/bohemia-pixel-art, AH-01, AH-03. No reference game.
"""
import os, sys, json, math, shutil, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
PORTRAIT_FACINGS = ['S', 'SE', 'SW']
RIG_ROUND = 7
GUIDE_PATH = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')
GUIDE = json.load(open(GUIDE_PATH))
G = dict(GUIDE['rig'])   # a copy: --set may move a key for one render, and the break is read against the file
for _i, _k in enumerate(sys.argv):
    if _i and sys.argv[_i - 1] == '--set':   # --set grain_per_m=40 : one key of the rig block for this render, recorded as a break
        _n, _v = _k.split('='); G[_n] = json.loads(_v)


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
                clips=clips, real_dims=[float(x) for x in opt('--real-dims', '').split(',')] if '--real-dims' in a else None, portrait=opt('--portrait', 0), head_m=(0.0 if opt('--head-m', 'auto') == 'auto' else float(opt('--head-m', 'auto'))), expressions=expr)


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
    done, weighted = set(), {}
    GRIME, DUST = (0.11, 0.085, 0.065, 1), (0.66, 0.60, 0.50, 1)   # crevice dirt, warm and dark; sun-bleached dust, pale and warm
    # round five: every mask size and grain strength is the guide's (rig block), so a change is a line in its decisions list
    GRAIN_PER_M, DRIFT_PER_M, DUST_PER_M = float(G['grain_per_m']), float(G['drift_per_m']), float(G['dust_per_m'])
    GRAIN_REST, GRAIN_WEAR = float(G['grain_rest']), float(G['grain_wear'])
    DUST_DARK, BRIGHT = tuple(G['dust_on_bright_mul']) + (1,), G['dust_bright_value']
    for o in objs:
        for slot in o.material_slots:
            m = slot.material
            if not m or m.name in done: continue
            done.add(m.name)
            # round seven: THE WEAR BY MATERIAL (CHARACTER and COOK THREE, 10/17 and 10/18: the up-facing dust turned every
            # black crown and charcoal cap the same grey; PORTRAIT: the chips blotch skin): a material whose name holds a key
            # of the guide's wear_by_material takes that share of the dust and the chips; hair, skin and eyes are not paint
            mw = next((float(v) for k, v in G['wear_by_material'].items() if k in m.name.lower()), 1.0)
            if mw != 1.0: weighted[m.name] = mw
            m.use_nodes = True; nt = m.node_tree
            bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if not bsdf: continue
            so = float(o.matrix_world.to_scale().x)   # a mesh's own coordinates can carry an object scale (the robot's parts: 100); metres = local x that x k
            # 1. the plastic highlight is the toy: matte, no specular (round six, his 'a play toy': the guide's numbers, roughness 1, specular 0)
            if not bsdf.inputs['Roughness'].links: bsdf.inputs['Roughness'].default_value = max(bsdf.inputs['Roughness'].default_value, float(G['roughness_min']))
            for sp in ('Specular IOR Level', 'Specular'):
                if sp in bsdf.inputs and not bsdf.inputs[sp].links: bsdf.inputs[sp].default_value = float(G['specular'])
            if not bsdf.inputs['Metallic'].links: bsdf.inputs['Metallic'].default_value = min(bsdf.inputs['Metallic'].default_value, 0.2)
            base = bsdf.inputs['Base Color']
            src = base.links[0].from_socket if base.links else None
            if src is None:
                rgb = nt.nodes.new('ShaderNodeRGB'); rgb.outputs[0].default_value = tuple(base.default_value); src = rgb.outputs[0]
            geo = nt.nodes.new('ShaderNodeNewGeometry'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(geo.outputs['Normal'], sep.inputs[0])
            up = nt.nodes.new('ShaderNodeMath'); up.operation = 'MAXIMUM'; up.inputs[1].default_value = 0.0; nt.links.new(sep.outputs['Z'], up.inputs[0])
            # 1b. THE PAINT IS OLD (round six, the toy's second tell: fresh saturated paint): every base loses saturation to
            # the guide's paint_sat_mul, and what faces the sun loses bleach_up more of it (a desert sun fades the roof
            # first), before any wear goes on; the hue stays the palette's, the colour goes chalky, never grey
            sat = nt.nodes.new('ShaderNodeMath'); sat.operation = 'MULTIPLY_ADD'; sat.use_clamp = True
            sat.inputs[1].default_value = -float(G['paint_sat_mul']) * float(G['bleach_up']) * wear; sat.inputs[2].default_value = float(G['paint_sat_mul'])
            nt.links.new(up.outputs[0], sat.inputs[0])
            hsv = nt.nodes.new('ShaderNodeHueSaturation'); nt.links.new(src, hsv.inputs['Color']); nt.links.new(sat.outputs[0], hsv.inputs['Saturation'])
            src = hsv.outputs['Color']
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
            noise =nt.nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value = 1.0; noise.inputs['Detail'].default_value = 5.0; noise.inputs['Roughness'].default_value = 0.65
            nt.links.new(coords(DUST_PER_M), noise.inputs['Vector'])
            dust = nt.nodes.new('ShaderNodeMath'); dust.operation = 'MULTIPLY'; nt.links.new(up.outputs[0], dust.inputs[0]); nt.links.new(noise.outputs['Fac'], dust.inputs[1])
            dustw = nt.nodes.new('ShaderNodeMath'); dustw.operation = 'MULTIPLY'; dustw.inputs[1].default_value = 1.1 * wear * mw; dustw.use_clamp = True; nt.links.new(dust.outputs[0], dustw.inputs[0])
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
            # THE DUST RULE (round five, guide field 11; the truck read as frost on 10/18): on a dark base the dust is the
            # pale warm dust; on a bright base (value over the guide's 0.6) the wear is the base itself gone darker and
            # warmer (grime and rust), never paler, so a yellow cab dulls instead of frosting
            lum = nt.nodes.new('ShaderNodeRGBToBW'); nt.links.new(src, lum.inputs['Color'])
            bright = nt.nodes.new('ShaderNodeMapRange'); bright.inputs['From Min'].default_value = BRIGHT[0]; bright.inputs['From Max'].default_value = BRIGHT[1]; bright.clamp = True
            nt.links.new(lum.outputs['Val'], bright.inputs['Value'])
            dark = nt.nodes.new('ShaderNodeMixRGB'); dark.blend_type = 'MULTIPLY'; dark.inputs['Fac'].default_value = 1.0; dark.inputs['Color2'].default_value = DUST_DARK
            nt.links.new(src, dark.inputs['Color1'])
            dcol = nt.nodes.new('ShaderNodeMixRGB'); dcol.blend_type = 'MIX'; dcol.inputs['Color1'].default_value = DUST
            nt.links.new(bright.outputs['Result'], dcol.inputs['Fac']); nt.links.new(dark.outputs['Color'], dcol.inputs['Color2'])
            mix2 = nt.nodes.new('ShaderNodeMixRGB'); mix2.blend_type = 'MIX'
            nt.links.new(mix1.outputs['Color'], mix2.inputs['Color1']); nt.links.new(dustw.outputs[0], mix2.inputs['Fac']); nt.links.new(dcol.outputs['Color'], mix2.inputs['Color2'])
            mix3 = nt.nodes.new('ShaderNodeMixRGB'); mix3.blend_type = 'OVERLAY'; mix3.inputs['Fac'].default_value = 0.45 * wear
            nt.links.new(mix2.outputs['Color'], mix3.inputs['Color1']); nt.links.new(drift.outputs['Color'], mix3.inputs['Color2'])
            # the grain lives in the wear, never even over a surface (a leopard print, measured cycle 4): heavy in the grime and
            # the dust patches, light on clean panel; the patch mask is the 20 cm drift's middle band
            patch = nt.nodes.new('ShaderNodeMapRange'); patch.inputs['From Min'].default_value = 0.42; patch.inputs['From Max'].default_value = 0.62; patch.clamp = True
            nt.links.new(drift.outputs['Fac'], patch.inputs['Value'])
            gp = nt.nodes.new('ShaderNodeMath'); gp.operation = 'MULTIPLY_ADD'; gp.inputs[1].default_value = (GRAIN_WEAR - GRAIN_REST) * wear; gp.inputs[2].default_value = GRAIN_REST * wear
            nt.links.new(patch.outputs['Result'], gp.inputs[0])
            gf = nt.nodes.new('ShaderNodeMath'); gf.operation = 'MULTIPLY_ADD'; gf.inputs[1].default_value = 0.8 * wear; gf.use_clamp = True
            nt.links.new(crevw.outputs[0], gf.inputs[0]); nt.links.new(gp.outputs[0], gf.inputs[2])
            # round five: the grain leans dark (grime in the paint, never a white fleck): the full overlay lifted pale paint
            # into frost on 10/18; on a bright base its light side now stops at the guide's grain_lift (0.5 is no lift at all,
            # 1.0 the old full step), on a dark base it keeps the full step, so the clay keeps its span and pale paint never frosts
            lift = nt.nodes.new('ShaderNodeMapRange'); lift.inputs['To Min'].default_value = 1.0; lift.inputs['To Max'].default_value = float(G['grain_lift'])
            nt.links.new(bright.outputs['Result'], lift.inputs['Value'])
            gdark = nt.nodes.new('ShaderNodeMapRange'); gdark.inputs['To Min'].default_value = 0.0
            nt.links.new(wide.outputs['Result'], gdark.inputs['Value']); nt.links.new(lift.outputs['Result'], gdark.inputs['To Max'])
            mix4 = nt.nodes.new('ShaderNodeMixRGB'); mix4.blend_type = 'OVERLAY'
            nt.links.new(gf.outputs[0], mix4.inputs['Fac'])
            nt.links.new(mix3.outputs['Color'], mix4.inputs['Color1']); nt.links.new(gdark.outputs['Result'], mix4.inputs['Color2'])
            # 6. THE EDGES ARE WORN (round six, the toy's third tell: a perfect moulded edge): where the surface turns (a
            # bevel normal leaning off the true normal within edge_m), the paint is chipped through to a dark warm
            # undercoat in broken patches (chip_per_m), so no edge is one clean line of one colour
            bev = nt.nodes.new('ShaderNodeBevel'); bev.samples = 8; bev.inputs['Radius'].default_value = float(G['edge_m']) / max(1e-6, so * k)
            dot = nt.nodes.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
            nt.links.new(bev.outputs['Normal'], dot.inputs[0]); nt.links.new(geo.outputs['True Normal'], dot.inputs[1])
            edge = nt.nodes.new('ShaderNodeMapRange'); edge.inputs['From Min'].default_value = 0.995; edge.inputs['From Max'].default_value = 0.9; edge.clamp = True
            nt.links.new(dot.outputs['Value'], edge.inputs['Value'])
            chipn = nt.nodes.new('ShaderNodeTexNoise'); chipn.inputs['Scale'].default_value = 1.0; chipn.inputs['Detail'].default_value = 3.0; chipn.inputs['Roughness'].default_value = 0.6
            nt.links.new(coords(float(G['chip_per_m'])), chipn.inputs['Vector'])
            chipm = nt.nodes.new('ShaderNodeMapRange'); chipm.inputs['From Min'].default_value = 0.36; chipm.inputs['From Max'].default_value = 0.5; chipm.clamp = True
            nt.links.new(chipn.outputs['Fac'], chipm.inputs['Value'])
            chip = nt.nodes.new('ShaderNodeMath'); chip.operation = 'MULTIPLY'; nt.links.new(edge.outputs['Result'], chip.inputs[0]); nt.links.new(chipm.outputs['Result'], chip.inputs[1])
            chipw = nt.nodes.new('ShaderNodeMath'); chipw.operation = 'MULTIPLY'; chipw.inputs[1].default_value = float(G['edge_wear']) * wear * mw; chipw.use_clamp = True
            nt.links.new(chip.outputs[0], chipw.inputs[0])
            under = nt.nodes.new('ShaderNodeMixRGB'); under.blend_type = 'MULTIPLY'; under.inputs['Fac'].default_value = 1.0; under.inputs['Color2'].default_value = tuple(G['chip_mul']) + (1,)
            nt.links.new(mix4.outputs['Color'], under.inputs['Color1'])
            mix5 = nt.nodes.new('ShaderNodeMixRGB'); mix5.blend_type = 'MIX'
            nt.links.new(chipw.outputs[0], mix5.inputs['Fac']); nt.links.new(mix4.outputs['Color'], mix5.inputs['Color1']); nt.links.new(under.outputs['Color'], mix5.inputs['Color2'])
            for l in list(base.links): nt.links.remove(l)
            nt.links.new(mix5.outputs['Color'], base)
    return dict(wear=wear, materials=sorted(done), wear_by_material=weighted, what=['matte: roughness >= %g, specular %g, metallic <= 0.2' % (G['roughness_min'], G['specular']),
                'old paint: saturation x %g, and %g of that again lost on what faces the sun' % (G['paint_sat_mul'], G['bleach_up'] * wear),
                'worn edges: within %g m of a turn the paint chips (a %g a metre mask) to the base x %s' % (G['edge_m'], G['chip_per_m'], G['chip_mul']),'crevice grime from the model\'s own ambient occlusion (0.25 m)',
                'dust and bleach on up-facing surfaces under a %g cm mask; on a base brighter than %s the wear is the base times %s (darker, never frost)' % (100.0 / DUST_PER_M, BRIGHT, list(DUST_DARK[:3])), 'a 20 cm colour drift across the body (overlay, %.2f)' % (0.45 * wear),
                'value grain at %g a metre, about two pixels at 57 ppm, its middle band stretched to the full step, its strength driven by the wear masks (%.2f in a patch, %.2f on clean panel); even grain is a leopard print, measured cycle 4' % (GRAIN_PER_M, GRAIN_WEAR * wear, GRAIN_REST * wear)], seed=seed, masks_in='metres, stuck to the surface (each mesh\'s own coordinates x its object scale x %.4f)' % k)


def dent_pass(objs, k):
    """THE SHAPE IS HANDMADE (round six, his 'a play toy': a moulded part is ruler-straight, a clay one is not): every mesh
    is cut finer (a simple subdivision, so the shape is kept, only given vertices to move) and pushed by a 3D cloud of
    dent_m at dent_per_m, the same push for vertices that share a position, so a hard edge never cracks open. On a
    skinned mesh the push goes before the armature, so the dents ride the body instead of swimming through it."""
    import bpy
    done = []
    for o in objs:
        so = float(o.matrix_world.to_scale().x); unit = 1.0 / max(1e-6, so * k)   # one metre in this mesh's own units
        if len(o.data.vertices) <= int(G['dent_subdiv_max_verts']):
            sub = o.modifiers.new('bohemia_cut', 'SUBSURF'); sub.subdivision_type = 'SIMPLE'; sub.levels = sub.render_levels = int(G['dent_subdiv'])
        tex = bpy.data.textures.new('bohemia_dent_' + o.name, 'CLOUDS'); tex.cloud_type = 'COLOR'; tex.noise_scale = unit / float(G['dent_per_m']); tex.noise_depth = 1
        d = o.modifiers.new('bohemia_dent', 'DISPLACE'); d.texture = tex; d.texture_coords = 'LOCAL'; d.direction = 'RGB_TO_XYZ'
        d.mid_level = 0.5; d.strength = 2.0 * float(G['dent_m']) * unit
        names = [m.name for m in o.modifiers]
        if any(m.type == 'ARMATURE' for m in o.modifiers):
            for n in ('bohemia_dent', 'bohemia_cut'):
                if n in o.modifiers:
                    with bpy.context.temp_override(object=o): bpy.ops.object.modifier_move_to_index(modifier=n, index=0)
        done.append(o.name)
    return dict(meshes=len(done), dent_m=G['dent_m'], dent_per_m=G['dent_per_m'], subdiv=G['dent_subdiv'], how='simple subdivision, then a 3D cloud push in metres; before the armature on a skinned mesh')


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


def clip_holds(sc, objs, root, cam, res, frames, hold_px):
    """THE HOLD (round seven, research round two R12 and C3; guide field 15, 'a hold repeats the previous key's render'):
    measured on the robot's idle, a part that drifts a fifth of a pixel between two keys still changes most of its
    pixels, because the surface's grain is sampled again at a new sub-pixel offset (the sprite 'boils'). A stop-motion
    animator does not touch a puppet's part that would not read as moving; the rig does the same. Per facing and key, a
    RIGID part (a mesh carried by a bone, no armature of its own) whose furthest vertex would move under hold_px on the
    screen since its last DRAWN pose keeps that drawn pose (its world matrix is pinned); once the true pose is hold_px
    or more away it is drawn where it truly is, so a slow drift still arrives, in whole visible steps. A SKINNED part
    rides the rigid part its strongest bone carries (bone_anchor): when that anchor holds, the same correction is
    carried onto it, so a hand never slides off a held arm. Two passes round the loop so the first key knows the last. Returns the pins per facing and
    key, and THE MOTION TABLE of what is drawn: each part's furthest vertex movement on the screen since the key before,
    in pixels, cyclic, from the model's own vertices after every modifier, under the one ortho camera."""
    import bpy
    import numpy as np
    W2C = np.array(cam.matrix_world.inverted()); ortho = cam.data.ortho_scale
    def px(Mw, v):
        P = W2C @ Mw; c = v @ P[:3, :3].T + P[:3, 3]
        return np.stack([(c[:, 0] / ortho + 0.5) * res, (0.5 - c[:, 1] / ortho) * res], 1)
    rigid = [o for o in objs if not any(m.type == 'ARMATURE' for m in o.modifiers)]
    skinned = [o for o in objs if o not in rigid]
    dg = bpy.context.evaluated_depsgraph_get(); loc = {}
    for o in objs:
        e = o.evaluated_get(dg); me = e.to_mesh(); co = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', co); e.to_mesh_clear()
        v = co.reshape(-1, 3); loc[o.name] = np.vstack([v[::max(1, len(v) // 600)], v.min(0), v.max(0)])
    def centre(o): v = loc[o.name]; return (np.array(o.matrix_world) @ np.append(v.mean(0), 1.0))[:3]
    def bone_anchor(o):
        """the skinned part's strongest bone, then up its chain to the first bone a rigid part rides (the robot's hand:
        LowerArm.L, then UpperArm.L, which carries Arm.L); else the rigid part nearest its centre"""
        w = {}
        for v in o.data.vertices:
            for gr in v.groups: w[o.vertex_groups[gr.group].name] = w.get(o.vertex_groups[gr.group].name, 0.0) + gr.weight
        arm = next((m.object for m in o.modifiers if m.type == 'ARMATURE' and m.object), None)
        if w and arm:
            b = arm.data.bones.get(max(w, key=w.get))
            while b:
                r = next((r for r in rigid if r.parent_type == 'BONE' and r.parent_bone == b.name), None)
                if r: return r.name
                b = b.parent
        return min(rigid, key=lambda r: np.linalg.norm(centre(r) - centre(o))).name
    anchor = {o.name: bone_anchor(o) for o in skinned} if rigid else {}
    pins, motion, snaps = {}, {}, {}
    for i, f in enumerate(FACINGS):
        root.rotation_euler = (0, 0, math.radians(180 - 45 * i)); bpy.context.view_layer.update()
        last, slast, keyed = {}, {}, []
        for rnd in (0, 1):
            for j, fr in enumerate(frames):
                sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
                hold, drawn = {}, {}
                for o in rigid:
                    M = np.array(o.matrix_world); P = last.get(o.name)
                    if P is not None and np.sqrt(((px(M, loc[o.name]) - px(P, loc[o.name])) ** 2).sum(1)).max() < hold_px: hold[o.name] = P; drawn[o.name] = P
                    else: last[o.name] = M; drawn[o.name] = M
                carry = {}
                for o in skinned:
                    an = anchor.get(o.name)
                    if an in hold:
                        cur = np.array(bpy.data.objects[an].matrix_world); carry[o.name] = hold[an] @ np.linalg.inv(cur)
                # a SKINNED part holds its whole shape: bones bend it, so pinning its place is not enough (the robot's
                # hand: a third of a pixel of finger drift resampled it, measured); under hold_px since its last drawn
                # shape, the rig draws a frozen copy of that shape (snapshot) where it was drawn
                skhold, sk = {}, {}
                if skinned:
                    dgk = bpy.context.evaluated_depsgraph_get()
                    for o in skinned:
                        e = o.evaluated_get(dgk); me = e.to_mesh(); co = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', co); e.to_mesh_clear()
                        W = carry.get(o.name, np.eye(4)) @ np.array(o.matrix_world); v = co.reshape(-1, 3); sc_ = px(W, v[::max(1, len(v) // 600)])
                        L = slast.get(o.name)
                        if L is not None and L[0].shape == sc_.shape and np.sqrt(((sc_ - L[0]) ** 2).sum(1)).max() < hold_px: skhold[o.name] = (L[1], L[2]); sk[o.name] = L[0]
                        else: slast[o.name] = (sc_, j, W); sk[o.name] = sc_
                if rnd == 1:
                    keyed.append(dict(hold=hold, carry=carry, skin=skhold, scr={**{n: px(M, loc[n]) for n, M in drawn.items()}, **sk}))
        for k in keyed:
            for nm, (j0, W0) in k['skin'].items():
                if (nm, j0) not in snaps:   # the shape the part was drawn with at key j0, frozen as its own mesh
                    sc.frame_set(int(math.floor(frames[j0])), subframe=frames[j0] - math.floor(frames[j0]))
                    e = bpy.data.objects[nm].evaluated_get(bpy.context.evaluated_depsgraph_get())
                    snaps[(nm, j0)] = bpy.data.meshes.new_from_object(e, preserve_all_data_layers=True, depsgraph=bpy.context.evaluated_depsgraph_get()).name
        pins[f] = [dict(hold={n: M.tolist() for n, M in k['hold'].items()}, carry={n: M.tolist() for n, M in k['carry'].items()},
                        skin={n: dict(mesh=snaps[(n, j0)], W=W0.tolist()) for n, (j0, W0) in k['skin'].items()}) for k in keyed]
        n = len(frames)
        motion[f] = [{nm: round(float(np.sqrt(((keyed[j]['scr'][nm] - keyed[j - 1]['scr'][nm]) ** 2).sum(1)).max()), 3) for nm in keyed[j]['scr']} for j in range(n)]
    return pins, motion


def pose_key(sc, root, i, fr, pk):
    """the facing, the clip's time, then the holds of THE HOLD laid on (rigid parts pinned, skinned parts carried or
    swapped for the frozen copy of their last drawn shape); returns what to restore after the render"""
    import bpy, mathutils
    root.rotation_euler = (0, 0, math.radians(180 - 45 * i)); sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
    undo = []
    if pk:
        for nm, M in list(pk['hold'].items()) + list(pk['carry'].items()):
            o = bpy.data.objects[nm]; B = o.matrix_basis.copy(); undo.append(lambda o=o, B=B: setattr(o, 'matrix_basis', B))
        for nm, M in pk['hold'].items(): bpy.data.objects[nm].matrix_world = mathutils.Matrix(M)
        bpy.context.view_layer.update()
        for nm, M in pk['carry'].items():
            o = bpy.data.objects[nm]; o.matrix_world = mathutils.Matrix(M) @ o.matrix_world
        for nm, h in pk.get('skin', {}).items():
            o = bpy.data.objects[nm]; px_ = bpy.data.objects.get('bohemia_hold_' + nm)
            if px_ is None: px_ = bpy.data.objects.new('bohemia_hold_' + nm, bpy.data.meshes[h['mesh']]); sc.collection.objects.link(px_)
            px_.data = bpy.data.meshes[h['mesh']]; px_.matrix_world = mathutils.Matrix(h['W'])
            for k, slot in enumerate(o.material_slots):   # the original's materials, the ID passes' included
                if k < len(px_.material_slots): px_.material_slots[k].link = slot.link; px_.material_slots[k].material = slot.material
            px_.hide_render = False; o.hide_render = True
            undo.append(lambda o=o, px_=px_: (setattr(px_, 'hide_render', True), setattr(o, 'hide_render', False)))
        bpy.context.view_layer.update()
    return undo


def light_footprint(sc, root, out, name, f, i, j, poses, movers):
    """the movers' light on the parts that hold: white clay, the rig's own sun and sky, light_mask_samples a pixel, once
    with every part in the light and once with the movers seen by the camera only (no shadow, no bounce); every pixel
    that differs by more than light_mask_values in either pose is the movers' light. Writes light_<clip>_<F>_kNN.png"""
    import bpy
    import numpy as np
    from PIL import Image
    white = bpy.data.materials.get('bohemia_light_white')
    if white is None:
        white = bpy.data.materials.new('bohemia_light_white'); white.use_nodes = True
        b = white.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (0.8, 0.8, 0.8, 1); b.inputs['Roughness'].default_value = 1.0
        for sp in ('Specular IOR Level', 'Specular'):
            if sp in b.inputs: b.inputs[sp].default_value = float(G['specular'])
    vl = bpy.context.view_layer; keep = sc.cycles.samples
    vl.material_override = white; sc.cycles.samples = int(G['light_mask_samples'])
    foot = None; tmp = os.path.join(out, '_light_tmp.png')
    for fr, pk in poses:
        pics = []
        for lit in (True, False):
            for nm in movers:
                o = bpy.data.objects[nm]
                o.visible_shadow = o.visible_diffuse = o.visible_glossy = o.visible_transmission = lit
            undo = pose_key(sc, root, i, fr, pk); sc.render.filepath = tmp; bpy.ops.render.render(write_still=True); unpose(undo)
            pics.append(np.asarray(Image.open(tmp).convert('RGBA')).astype(np.int16))
        d = np.abs(pics[0] - pics[1])[..., :3].max(2) > int(G['light_mask_values'])
        foot = d if foot is None else (foot | d)
    for nm in movers:
        o = bpy.data.objects[nm]; o.visible_shadow = o.visible_diffuse = o.visible_glossy = o.visible_transmission = True
    vl.material_override = None; sc.cycles.samples = keep
    fn = os.path.join(out, 'light_%s_%s_k%02d.png' % (name, f, j))
    Image.fromarray(np.where(foot, 255, 0).astype(np.uint8), 'L').save(fn); os.remove(tmp)
    return fn


def unpose(undo):
    import bpy
    for u in undo: u()
    if undo: bpy.context.view_layer.update()


def obj_id_pass(sc, objs, root, out, still_set, clips, clip_set):
    """THE OBJECT-ID PASS (round seven, research round two R11 and D9): every mesh part one flat colour, one sample, the
    eight stills and every clip key, so a gate counts a part's pixels per frame and masks the parts that moved. Runs
    after the material-ID pass: it overwrites the materials again. Returns the table and the files."""
    import bpy, colorsys
    table = {}
    for i, o in enumerate(sorted(objs, key=lambda o: o.name)):
        r, g, b = colorsys.hsv_to_rgb((i * 0.61803 + 0.3) % 1.0, 0.85, 1.0)
        enc = lambda c: 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055   # the PNG holds the Standard view's sRGB, not the linear value set
        table[o.name] = '#%02x%02x%02x' % tuple(int(round(enc(c) * 255)) for c in (r, g, b))
        m = bpy.data.materials.new('bohemia_obj_' + o.name); m.use_nodes = True; nt = m.node_tree
        for n in list(nt.nodes):
            if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
        em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (r, g, b, 1)
        nt.links.new(em.outputs[0], next(n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL').inputs['Surface'])
        for s in o.material_slots: s.link = 'OBJECT'; s.material = m
        if not o.material_slots: o.data.materials.append(m)
    sc.cycles.samples = 1; sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.0
    files = []
    def shot(fn, i):
        root.rotation_euler = (0, 0, math.radians(180 - 45 * i)); sc.render.filepath = fn; bpy.ops.render.render(write_still=True); files.append(fn)
    still_set()
    for i, f in enumerate(FACINGS): shot(os.path.join(out, 'obj_%s.png' % f), i)
    for name, frames, pins, repeats in clips:
        clip_actions(sc, name); clip_set()
        for i, f in enumerate(FACINGS):
            rep = set(repeats.get(f, []))
            for j, fr in enumerate(frames):
                fn = os.path.join(out, 'obj_%s_%s_k%02d.png' % (name, f, j)); files.append(fn)
                if j in rep: continue
                undo = pose_key(sc, root, i, fr, pins[f][j] if pins else None); sc.render.filepath = fn; bpy.ops.render.render(write_still=True); unpose(undo)
            for j in repeats.get(f, []):   # the same order the colour copies ran in, so a chain of holds resolves
                shutil.copyfile(os.path.join(out, 'obj_%s_%s_k%02d.png' % (name, f, (j - 1) % len(frames))), os.path.join(out, 'obj_%s_%s_k%02d.png' % (name, f, j)))
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
    if source and float(G['dent_m']) > 0: source['dents'] = dent_pass(objs, k)
    # THE TRUE PROPORTIONS (round six, the toy's first tell: a chunky wide tall body on big wheels): --real-dims L,W,H
    # is the real thing's length, width and height; each measured ratio is recorded and must sit inside the guide's
    # proportion_tolerance, or the render is a toy shape and says so in rig.json
    props = None
    if A['real_dims']:
        L, W_, H_ = A['real_dims']; m = sorted([size.x * k, size.y * k]); mL, mW, mH = m[1], m[0], size.z * k
        off = dict(width=round(mW / mL / (W_ / L) - 1, 3), height=round(mH / mL / (H_ / L) - 1, 3))
        props = dict(real=[L, W_, H_], model=[round(mL, 3), round(mW, 3), round(mH, 3)], off=off, tolerance=G['proportion_tolerance'],
                     ok=all(abs(v) <= float(G['proportion_tolerance']) for v in off.values()))
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
        hold_px = float(G['hold_px'])
        pins, motion = clip_holds(sc, objs, root, cam, res, frames, hold_px)   # round seven: THE HOLD, and the motion table of what is drawn
        repeats, lights = {}, []
        for i, f in enumerate(FACINGS):
            still_key = [all(v < hold_px for v in motion[f][j].values()) for j in range(keys)]
            for j, fr in enumerate(frames):
                fn = os.path.join(out, 'raw_%s_%s_k%02d.png' % (name, f, j)); files.append(fn)
                if still_key[j] and not all(still_key): continue   # A WHOLE HOLD REPEATS THE KEY BEFORE (field 15): copied below, never re-rendered
                undo = pose_key(sc, root, i, fr, pins[f][j]); sc.render.filepath = fn; bpy.ops.render.render(write_still=True); unpose(undo)
            if all(still_key): continue
            first = next(j for j in range(keys) if not still_key[j])
            for t in range(1, keys + 1):
                j = (first + t) % keys
                if still_key[j]:
                    shutil.copyfile(os.path.join(out, 'raw_%s_%s_k%02d.png' % (name, f, (j - 1) % keys)), os.path.join(out, 'raw_%s_%s_k%02d.png' % (name, f, j))); repeats.setdefault(f, []).append(j)
            # THE MOVERS' LIGHT (round seven): what a moving part does to the light on the parts that hold (its cast shadow,
            # its bounce) is motion, not boil; for each key where some parts move and some hold, the same white clay is
            # rendered with and without the movers in the light (camera rays only), at the key and the key before
            for j, fr in enumerate(frames):
                movers = [n for n, v in motion[f][j].items() if v >= hold_px]
                if not movers or len(movers) == len(motion[f][j]): continue
                lights.append(light_footprint(sc, root, out, name, f, i, j, [(fr, pins[f][j]), (frames[j - 1], pins[f][j - 1])], movers))
        held = sum(len(k['hold']) for f in FACINGS for k in pins[f])
        clips[name] = dict(keys=keys, beats=keys / 3.0, frame_range=[round(f0, 2), round(f1, 2)], frames=[round(x, 2) for x in frames], raw=files,
                           motion_px=motion, moving_px=hold_px, hold_px=hold_px, held_part_keys=held, repeated_keys=repeats, light_files_raw=lights, pins=pins, _frames=frames)
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
        def still_set():
            if A['clips']: clip_actions(sc, A['clips'][0][0])
            for a in arms: a.data.pose_position = 'REST' if A['still'] == 'rest' else 'POSE'
            sc.frame_set(int(math.floor(still)), subframe=still - math.floor(still))
        def clip_set():
            for a in arms: a.data.pose_position = 'POSE'
        oidt, oidf = obj_id_pass(sc, objs, root, out, still_set, [] if A['stills_only'] else [(n, clips[n]['_frames'], clips[n]['pins'], clips[n]['repeated_keys']) for n, _ in A['clips']], clip_set)
    else: oidt, oidf = None, []
    # THE GROUND PIXEL (round seven): the camera looks at the body's middle, so the image centre is the look point, not the
    # ground; the model's ground centre (the world origin) sits look_z x sin(tilt) below it on the screen. ground_px was
    # the look point until round seven (CHARACTER's 'clothes sit 16 px low' and RUN's drop-in read it as the ground)
    ground_screen = [res / 2.0, res / 2.0 + dims[2] * zs / 2.0 * math.sin(math.radians(A['tilt'])) * ppm]
    return dict(engine=G['engine'], res=res, ortho_scale=res / ppm, real_dims_m=[round(x, 3) for x in dims], scale_from_model=round(k, 4), still_frame=round(still, 3), still=still_how, ground_screen=ground_screen,
                z_stretch=round(zs, 4), base_turn_deg=180, source_pass=source, proportions=props, calibration=calib, id_table=idt, id_files_raw=idf,
                obj_table=oidt, obj_files_raw=oidf), stills, clips, portrait


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
        ring = op & ~inner
        a[..., :3] = np.round(a[..., :3])
        if ring.any() and inner.any():
            # THE RING FROM THE SPRITE'S OWN COLOURS (round five; research round two D2, R1: a colour that lives only on the
            # boundary is a filter's residue): each ring pixel is its colour N values darker, then moved to the nearest
            # colour the body already uses inside, so the edge is darker by the ring and no colour exists only on it
            want = np.clip(a[..., :3][ring] - A['ring'], 0, 255)
            pal = np.unique(a[..., :3][inner].reshape(-1, 3), axis=0)
            best = np.empty_like(want)
            for i in range(0, len(want), 256):
                d = ((want[i:i + 256, None, :] - pal[None, :, :]) ** 2).sum(2); best[i:i + 256] = pal[d.argmin(1)]
            a[..., :3][ring] = best
        sh_layer = None
        if shadow:
            ys, xs = np.nonzero(op)
            if len(ys):
                foot = ys.max(); band = ys >= foot - max(2, int((foot - ys.min()) * 0.12))
                x0, x1 = xs[band].min(), xs[band].max(); cx = (x0 + x1) / 2 + 2; rx = max(4.0, (x1 - x0) / 2 * 1.25); ry = max(2.0, rx * 0.38); cy = foot - ry * 0.35 + 1
                yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
                d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
                sh = np.clip((1.15 - d) / 0.3, 0, 1) * float(G['shadow_alpha_max'])   # a soft edge two pixels wide, 42% at the centre
                put = (~op) & (sh > 0.02)
                # THE SHADOW IS ITS OWN LAYER (round five; research round two D2: zero alpha between 1 and 254 on the
                # sprite): the body ships binary, the shadow ships beside it as shadow_<name>.png, black at alpha, on the
                # same box, and the screen lays it under the body (guide field 13)
                sh_layer = np.zeros_like(a); sh_layer[..., 3][put] = np.round(sh[put] * 255)
        arrs.append((fn, a, op, sh_layer))
    boxes = []
    for fn, a, op, sl in arrs:
        al = a[..., 3] > 0
        if sl is not None: al = al | (sl[..., 3] > 0)
        ys, xs = np.nonzero(al); boxes.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    box = (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes)) if one_box else None
    outs = []
    for (fn, a, op, sl), b in zip(arrs, boxes):
        im = Image.fromarray(a.astype(np.uint8), 'RGBA').crop(box or b)
        o = os.path.join(os.path.dirname(fn), os.path.basename(fn).replace('raw_', 'rig_')); im.save(o); outs.append(o)
        if sl is not None:
            Image.fromarray(sl.astype(np.uint8), 'RGBA').crop(box or b).save(o.replace(os.sep + 'rig_', os.sep + 'shadow_'))
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
    one 96 px box; the rig draws true size (rule 102). Three rows are re-read: by the guide's field 5: the size row by rule
    105's floor for the KIND (a prop 29 x 36, a car 96 long), and the colour row, for a sprite with fewer opaque pixels
    than one of his prop tiles, by his props' colour DENSITY (370 per 1,000 px); and (round five) a vehicle's grain row by field 11's vehicle band. The rest stand as the card says."""
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
            floor = GUIDE['classes'].get(cls, {}).get('output_floor', 2330)   # a class with no floor reads the packs' 2,330 (round seven: --class portrait crashed here)
            floor = min(floor, int(round(dens * n / 1000.0)))
            r = '%s  colours >= %d (field 5: the class floor, or %d per 1,000 of %d px): %d' % ('OK ' if colours >= floor else 'OUT', floor, dens, n, colours); why.append('colours by field 5')
        elif name.startswith('grain') and cls == 'vehicle':   # round five: a true-size car's panels are 3x a tile's (decisions_against_the_research[4])
            band = GUIDE['fields'][10]['value']['grain_run_px_vehicle']; run = float(r.rsplit(':', 1)[1])
            r = '%s  grain <= %.2f px a run (field 11, a vehicle at true size): %.2f' % ('OK ' if run <= band[1] else 'OUT', band[1], run); why.append('grain by field 11')
        rows.append(r)
    out = sum(1 for r in rows if r.startswith('OUT'))
    return dict(cls=cls, out=out, rows=rows, reread=why, verdict='%d of 8 out under the style guide%s' % (out, ' -> BACK before VOTE' if out >= 3 else ''), size_px=[w, h], opaque_px=n, colours=colours)


def rejudge(d, cls):
    """python3 tools/bohemia_direction_master_rig.py --rejudge <rig_dir> <class>: the card under the guide, no Blender"""
    m = json.load(open(os.path.join(d, 'rig.json')))
    if 'rig_settings' in m: m['breaks'] = sorted(k for k in m['rig_settings'] if k in GUIDE['rig'] and not same(m['rig_settings'][k], GUIDE['rig'][k]))
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
                shadow_files=[rel(o.replace(os.sep + 'rig_', os.sep + 'shadow_')) for o in outs[:n]] if A['shadow'] else [],
                ground_px=[int(round(meta['ground_screen'][0] - box[0])), int(round(meta['ground_screen'][1] - box[1]))] if box else None,
                look_px=[meta['res'] // 2 - box[0], meta['res'] // 2 - box[1]] if box else None, colours=colours(outs),
                keys_per_beat=3, bpm=120, ruler='records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md (98 px = 1.72 m)')
    i = n
    for name, c in clips.items():
        k = len(c['raw']); c['files'] = [rel(o) for o in outs[i:i + k]]; i += k; del c['raw']; c.pop('pins', None); c.pop('_frames', None)
        lf = []
        for fn in c.pop('light_files_raw', []):   # round seven: the movers' light on the same box as the colour
            from PIL import Image
            o = os.path.join(os.path.dirname(fn), 'rig' + os.path.basename(fn)); Image.open(fn).crop(tuple(box)).save(o); lf.append(rel(o))
        c['light_files'] = lf
    meta['clips'] = clips
    meta['card'] = card(outs[FACINGS.index('S')], A['judge'])
    meta['cls'] = A['cls']; meta['card_guide'] = guide_card(meta['card'], outs[FACINGS.index('S')], A['cls'])
    # THE SETTINGS USED, against the guide (round four; research round two D1): a key that differs is a break, and a
    # rig with a break is a DON'T render, never a candidate (gates/style_guide_gate.py)
    used = dict(G); used.update(ppm=A['ppm'], tilt_deg=A['tilt'], sun_rot_deg=A['sun_rot'], wear=A['wear'], ring=A['ring'], contact_shadow=A['shadow'])
    used = {k: v for k, v in used.items() if not k.startswith('_') and k != 'calibration'}
    meta['rig_settings'] = used
    meta['breaks'] = sorted(k for k in used if k not in GUIDE['rig'] or not same(used[k], GUIDE['rig'][k]))
    meta['guide'] = dict(file=os.path.relpath(GUIDE_PATH, ROOT), schema=GUIDE['schema'])
    if meta.get('id_files_raw'):
        from PIL import Image
        ids = []
        for fn in meta.pop('id_files_raw'):
            im = Image.open(fn).convert('RGBA'); im = im.crop(tuple(box)); o = fn.replace('id_', 'rigid_'); im.save(o); ids.append(rel(o))
        meta['id_files'] = ids
    else: meta.pop('id_files_raw', None)
    if meta.get('obj_files_raw'):   # round seven: the object-ID pass on the same box as the colour, stills and clip keys
        from PIL import Image
        objf = []
        for fn in meta.pop('obj_files_raw'):
            o = os.path.join(os.path.dirname(fn), 'rig' + os.path.basename(fn)); Image.open(fn).convert('RGBA').crop(tuple(box)).save(o); objf.append(rel(o))
        meta['obj_files'] = objf
    else: meta.pop('obj_files_raw', None)
    if portrait:
        praw = portrait.pop('raw'); eraw = portrait.pop('raw_expressions')
        pouts, pbox = post(praw + list(eraw.values()), A['out'], A, pop, shadow=False)
        portrait.update(files=[rel(o) for o in pouts[:len(praw)]], expression_files={e: rel(o) for e, o in zip(eraw.keys(), pouts[len(praw):])},
                        crop_box_px=pbox, model=meta['model'], body_rig='rig.json', colours=colours(pouts))
        json.dump(portrait, open(os.path.join(A['out'], 'portrait.json'), 'w'), indent=1)
        meta['portrait'] = 'portrait.json'
    json.dump(meta, open(os.path.join(A['out'], 'rig.json'), 'w'), indent=1)
    print(json.dumps({k: v for k, v in meta.items() if k not in ('files', 'clips')}, indent=1))
