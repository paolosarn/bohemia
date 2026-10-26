#!/usr/bin/env python3
"""BOHEMIA -- WORLD [the job tells the truth, in blood] (rule 208(c), Paolo 10/25: 'the button itself looks bloody depending on how
difficult the job is... the button looking like some Crashbox blood filter'; the coordinator's note the same night, his 'not Crash
Bandicoot, Crashbox': the HBO Family stop-motion show, rule 115(d); 'red clay or paint smeared and dripped by hand on the tin button,
dried dark at the edges, a thumbprint in it, stop-motion holds; never a glossy red gradient, a photo filter or a video-game splat;
made the rig's way like the kit, never drawn in canvas code').

THE BLOOD, MODELLED AND RENDERED, THE KIT'S WAY. UI's kit (tools/bohemia_ui_crashbox_kit.py) models each material in Blender at its
real thickness under the world's one sun; this does the same for the clay that goes on it:
  CLAY      metaballs: a smear is a finger's drag (a run of flattened balls thinning to a tail), a drip runs down from the top edge
            and ends in a bead, a blot is a thumb pressed in (its print is real ridges, rings in the bump), spatter is the flecks
  PAINT     a deep wet red, the clay's own sheen; where the surface turns away from the eye (a blob's rim, a drip's sides) it goes
            to dried brown-black, so the edges dry first, like real blood and real clay; a later stage is older, so darker
  THE TIN   a shadow catcher where the button is, so the clay's own shadow falls on the tin in the overlay, from the same sun
  THE SUN   the kit's: 155.4 degrees on the screen (up and to the left), 40 degrees over the glass (slices/ui_kit/kit.json)
SIX STAGES, CUMULATIVE: stage k is everything of stage k-1 and more (a drip, a smear, the thumb), so the browser crossfades
between two neighbouring stages and the scale never steps (slices/bohemia_job_danger.js paintBlood). Each stage TWICE, a and b:
the same clay re-posed a hair (an animator's hand between two frames), shown a beat each: the stop-motion hold.
THE CENTRE STAYS READABLE: the clay keeps to the top edge, the ends and the bottom; the middle band, where the job's words sit,
takes at most the flecks until the last stage.

  /tmp/bv/bin/python tools/bohemia_world_job_blood.py        (bpy 5.2 in a venv; about two seconds a picture)
Writes slices/job_blood/{n,m,w}{0..5}{a,b}.png (160, 256 and 640 x 64, RGBA, a hard alpha edge, the shadow two steps of see-through) and
slices/job_blood/blood.json (the numbers the cut used).
REFERENCE CHECK (the 9/4 duty): Crashbox (rule 115(d), the look bible): clay that still looks like clay, nothing glows; the kit's
tin it sits on (UI's, unchanged). No reference game. REUSE CHECK: the kit's sun and camera numbers, read from its kit.json.
TASTE CHECK: real geometry under the world's light; no gradient, no filter, no splat sprite.
"""
import os, sys, json, math, random
import bpy
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, 'slices/job_blood')
KIT = json.load(open(os.path.join(R, 'slices/ui_kit/kit.json')))
SUN = KIT['tin']['sun']
H, PH = 64, 1.0           # the picture is 64 px tall, the tin one unit tall: 64 px a unit
# THREE WIDTHS, so a drip is a drip on any button (never stretched): the phone's card and ENGAGE (n), a button (m), a board's row
# and the offer's yes (w, about ten to one); the browser takes the nearest by the button's own shape
SHAPES = {'n': 2.5, 'm': 4.0, 'w': 10.0}
STAGES = 6
SEED = 2081025


def strokes(seed=SEED):
    """every mark of every stage, in the order the danger lays them; stage k draws the ones with st <= k (x on a 4-unit tin)"""
    rnd = random.Random(seed)
    S = []
    def drip(st, x, length, r0):
        S.append({'k': 'drip', 'st': st, 'x': x, 'len': length, 'r': r0, 'wob': rnd.uniform(-0.03, 0.03)})
    def smear(st, x0, y0, x1, y1, w):
        S.append({'k': 'smear', 'st': st, 'a': (x0, y0), 'b': (x1, y1), 'w': w})
    def blot(st, x, y, r):
        S.append({'k': 'blot', 'st': st, 'x': x, 'y': y, 'r': r})
    def fleck(st, n, zone):
        for _ in range(n):
            x = rnd.uniform(zone[0], zone[1]); y = rnd.uniform(zone[2], zone[3])
            S.append({'k': 'fleck', 'st': st, 'x': x, 'y': y, 'r': rnd.uniform(0.018, 0.04)})
    # 0: a first drip off the top edge near the right end, a few flecks
    drip(0, 1.45, 0.22, 0.05); fleck(0, 4, (0.9, 1.9, 0.1, 0.45))
    # 1: the thumb pressed in at the left end, another short drip
    blot(1, -1.62, -0.18, 0.17); drip(1, -0.55, 0.18, 0.045); fleck(1, 4, (-1.9, -0.9, -0.45, 0.4))
    # 2: a finger dragged along the bottom edge
    smear(2, -1.2, -0.38, 0.35, -0.42, 0.09); drip(2, 0.6, 0.3, 0.05)
    # 3: two longer drips, a smear across the top edge from the right
    drip(3, 1.0, 0.42, 0.055); drip(3, -1.15, 0.38, 0.05); smear(3, 1.95, 0.42, 0.75, 0.38, 0.08); fleck(3, 6, (-1.8, 1.8, -0.2, 0.2))
    # 4: a palm's drag through the left end (the right end keeps the stars and the pay), the drips reach down, a small thumb
    smear(4, -1.98, 0.22, -1.32, -0.22, 0.15); smear(4, -1.92, -0.12, -1.15, -0.42, 0.11); drip(4, 0.2, 0.55, 0.05); drip(4, 1.78, 0.62, 0.055)
    blot(4, 1.74, -0.38, 0.11)
    # 5: soaked: the bottom pooled end to end, drips the whole height, flecks everywhere
    smear(5, -1.1, -0.46, 1.55, -0.47, 0.11); drip(5, -0.2, 0.78, 0.05); drip(5, 1.3, 0.82, 0.055)
    drip(5, -0.85, 0.72, 0.05); smear(5, 1.98, -0.2, 1.5, -0.44, 0.09); fleck(5, 12, (-1.9, 1.9, -0.45, 0.45))
    return S


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat_clay(stage):
    m = bpy.data.materials.new('clay'); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    bsdf = N.get('Principled BSDF')
    age = stage / (STAGES - 1)
    wet = (0.20 - 0.07 * age, 0.006, 0.004, 1)        # linear: sRGB about 124,14,11, older is darker
    mid = (0.075 - 0.02 * age, 0.004, 0.003, 1)
    dry = (0.022, 0.0035, 0.002, 1)                   # sRGB about 40,8,5: dried brown-black
    lw = N.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.5
    ramp = N.new('ShaderNodeValToRGB'); E = ramp.color_ramp.elements
    E[0].position = 0.0; E[0].color = wet
    E[1].position = 0.52 - 0.12 * age; E[1].color = mid
    e2 = E.new(0.70 - 0.12 * age); e2.color = dry
    ramp.color_ramp.interpolation = 'CONSTANT'        # the dried rim is a band, not a blur (a pixel look)
    L.new(lw.outputs['Facing'], ramp.inputs['Fac'])
    L.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.42 + 0.25 * age   # wet sheen goes matte as it dries
    try: bsdf.inputs['Specular IOR Level'].default_value = 0.45
    except Exception: pass
    # the thumb's print and the hand's texture: rings in the bump, broken by noise (clay that still looks like clay)
    tc = N.new('ShaderNodeTexCoord'); wave = N.new('ShaderNodeTexWave'); wave.wave_type = 'RINGS'
    wave.inputs['Scale'].default_value = 7.0; wave.inputs['Distortion'].default_value = 9.0
    noise = N.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value = 9.0
    mix = N.new('ShaderNodeMath'); mix.operation = 'MULTIPLY'
    L.new(tc.outputs['Object'], wave.inputs['Vector']); L.new(tc.outputs['Object'], noise.inputs['Vector'])
    L.new(wave.outputs['Fac'], mix.inputs[0]); L.new(noise.outputs['Fac'], mix.inputs[1])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.55
    L.new(mix.outputs['Value'], bump.inputs['Height']); L.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    return m


def laid(PW):
    """the marks for a tin PW units wide: one set of marks every four units (a wide row gets three, each its own dice and every
    other one mirrored, so nothing repeats), squeezed onto a narrow one; the radii never scale, only where things land"""
    n = max(1, int(round(PW / 4.0))); span = PW / n; out = []
    for k in range(n):
        mir = -1 if k % 2 else 1; x0 = -PW / 2 + span * (k + 0.5)
        for s0 in strokes(SEED + 101 * k):
            s = dict(s0); f = span / 4.0
            if 'x' in s: s['x'] = x0 + mir * s['x'] * f
            if 'a' in s: s['a'] = (x0 + mir * s['a'][0] * f, s['a'][1]); s['b'] = (x0 + mir * s['b'][0] * f, s['b'][1])
            if s['k'] == 'drip': s['wob'] = s['wob'] * mir
            out.append(s)
    return out


def build(stage, frame, PW):
    clear()
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.samples = 48; sc.cycles.use_denoising = False
    sc.render.resolution_x, sc.render.resolution_y = int(round(PW * H / PH)), H; sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.view_settings.view_transform = 'Standard'
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    # the world's fill, cool and low (the kit's)
    wd = bpy.data.worlds.new('w'); sc.world = wd; wd.use_nodes = True
    bg = wd.node_tree.nodes.get('Background'); bg.inputs['Color'].default_value = (0.55, 0.55, 0.6, 1); bg.inputs['Strength'].default_value = 0.35
    # the camera, square to the tin
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = PW
    co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); co.location = (0, 0, 5); sc.camera = co
    sc.render.pixel_aspect_x = 1; sc.render.pixel_aspect_y = 1
    # the sun, from the kit's angle
    az = math.radians(SUN['screen_deg']); el = math.radians(SUN['elev_deg'])
    Lv = (math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el))
    sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 3.2; sun.angle = math.radians(3)
    so = bpy.data.objects.new('sun', sun); sc.collection.objects.link(so)
    import mathutils
    so.rotation_euler = mathutils.Vector((-Lv[0], -Lv[1], -Lv[2])).to_track_quat('-Z', 'Y').to_euler()
    # the tin: a shadow catcher, so the clay's shadow lands on the button
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0)); tin = bpy.context.active_object
    tin.scale = (PW * 1.2, PH * 1.6, 1); tin.is_shadow_catcher = True
    # the clay
    mb = bpy.data.metaballs.new('clay'); mb.resolution = 0.012; mb.render_resolution = 0.008; mb.threshold = 0.6
    mo = bpy.data.objects.new('clay', mb); sc.collection.objects.link(mo); mo.data.materials.append(mat_clay(stage))
    jit = random.Random(SEED * 31 + stage * 7 + (0 if frame == 'a' else 1))
    def j(v, a): return v + (jit.uniform(-a, a) if frame == 'b' else 0)
    def ball(x, y, r, zs=0.45, sx=1.0, rot=0.0):
        if frame == 'b':   # the animator's hand between two frames: every lump nudged and squashed a hair (the stop-motion boil)
            x += jit.uniform(-0.014, 0.014); y += jit.uniform(-0.012, 0.012); r *= jit.uniform(0.93, 1.07)
        e = mb.elements.new(); e.type = 'ELLIPSOID'; e.co = (x, y, r * zs * 0.3); e.radius = r * 2.1
        e.size_x = sx; e.size_y = 1.0; e.size_z = zs
        e.rotation = mathutils.Quaternion((0, 0, 1), rot)
    for s in laid(PW):
        if s['st'] > stage: continue
        if s['k'] == 'drip':
            x = j(s['x'], 0.012); y = PH / 2 + 0.02; r = s['r']; n = max(5, int(s['len'] / 0.03))
            ph = (s['x'] * 13.7) % 6.28
            for i in range(n):   # a hand-rolled drip: it swells and pinches as it runs, and leans
                t = i / (n - 1); rr = r * (1.0 - 0.4 * t) * (1.0 + 0.22 * math.sin(t * 15 + ph))
                ball(x + s['wob'] * t * t + 0.012 * math.sin(t * 7 + ph), y - s['len'] * t, rr, zs=0.5)
            ball(x + s['wob'] + 0.01, y - s['len'] - r * 0.6, r * 1.25, zs=0.8, sx=1.1)        # the bead at the end
        elif s['k'] == 'smear':
            (x0, y0), (x1, y1) = s['a'], s['b']; L = math.hypot(x1 - x0, y1 - y0); n = max(5, int(L / 0.06)); ang = math.atan2(y1 - y0, x1 - x0)
            srn = random.Random(int((x0 + 3) * 1000 + (y0 + 3) * 77))
            for i in range(n):   # a finger's drag: heavy where it landed, thinning, ragged at the sides
                t = i / (n - 1); w = s['w'] * (1.0 - 0.6 * t) * srn.uniform(0.75, 1.2)
                off = srn.uniform(-0.025, 0.025)
                ball(j(x0 + (x1 - x0) * t - off * math.sin(ang), 0.01), j(y0 + (y1 - y0) * t + off * math.cos(ang), 0.01), w, zs=0.32, sx=srn.uniform(1.5, 2.3), rot=ang + srn.uniform(-0.2, 0.2))
        elif s['k'] == 'blot':
            ball(j(s['x'], 0.01), j(s['y'], 0.01), s['r'], zs=0.38, sx=1.15, rot=0.4)
        elif s['k'] == 'fleck':
            ball(j(s['x'], 0.006), j(s['y'], 0.006), s['r'], zs=0.6)
    return sc


def post(path):
    """the rig's post: a hard alpha edge on the clay, the shadow kept to two steps of see-through"""
    im = np.asarray(Image.open(path).convert('RGBA')).astype(np.float32)
    a = im[..., 3] / 255.0; rgb = im[..., :3]
    lum = rgb.mean(axis=2)
    clay = (a > 0.55) & (lum > 1)                    # the clay itself
    shadow = (~clay) & (a > 0.08)                     # what the shadow catcher left: dark, see-through
    out = np.zeros_like(im)
    out[clay, :3] = rgb[clay]; out[clay, 3] = 255
    sa = np.where(a > 0.3, 0.42, 0.22)
    out[shadow, 0] = 22; out[shadow, 1] = 10; out[shadow, 2] = 6; out[shadow, 3] = (sa[shadow] * 255)
    Image.fromarray(out.astype(np.uint8), 'RGBA').save(path, optimize=True)
    h = out.shape[0]
    return float(clay.mean()), float(shadow.mean()), float(clay[h // 3: 2 * h // 3, :].mean())


def main():
    os.makedirs(OUT, exist_ok=True)
    rec = {'_about': 'WORLD [the job tells the truth, in blood] (rule 208(c)): the clay on the job button, three widths, six stages, a and b each (the stop-motion hold). tools/bohemia_world_job_blood.py',
           'height': H, 'shapes': {k: [int(round(v * H)), H] for k, v in SHAPES.items()}, 'stages': STAGES, 'sun': SUN, 'seed': SEED, 'pictures': {}}
    for old in os.listdir(OUT):
        if old.endswith('.png'): os.remove(os.path.join(OUT, old))
    for sh_, PW in SHAPES.items():
        for st in range(STAGES):
            for fr in ('a', 'b'):
                sc = build(st, fr, PW)
                nm = '%s%d%s' % (sh_, st, fr); p = os.path.join(OUT, nm + '.png'); sc.render.filepath = p
                bpy.ops.render.render(write_still=True)
                cov, sh, mid = post(p)
                rec['pictures'][nm] = {'clay': round(cov, 4), 'shadow': round(sh, 4), 'middle_band_clay': round(mid, 4)}
                print('%s clay %.3f shadow %.3f middle %.3f' % (nm, cov, sh, mid), flush=True)
    json.dump(rec, open(os.path.join(OUT, 'blood.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
