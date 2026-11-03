#!/usr/bin/env python3
"""BOHEMIA -- FACTIONS [five more beasts] (11/3/26, ask line 343; Paolo: 'keep building content please, all angles, every angle
possible'; his 9/30 vote on the seventeen: 'it has to be realistic: if they could not survive in an economic apocalypse in the
desert Mojave of Las Vegas, then they can't be around'; laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md).

THE FIVE THAT PASS THE MOJAVE TEST (records/BOHEMIA_FACTIONS_FIVE_MORE_BEASTS_11_3_26.md has the test, the sources and the ones
that fail): the COYOTE pack (the valley's own, in every wash today), the MOUNTAIN LION (the Spring Mountains' own), the FERAL HOG
sounder (the North Las Vegas pig farm's, only where there is water), CAMELOPS (the valley's own Ice Age camel, Tule Springs bone on
a dromedary surrogate) and the FERAL BULL (range cattle loose on Gold Butte, the seventeen's 'feral cattle').

THE SAME SOURCE AS EVERY RIG BEAST (rule 115c, 'everything from the same source'; rule 108(a), no pixel drawn in code): the Khronos
Fox, reshaped with its bones (each moved, never turned, so its Survey and Walk and ANIMATION's Bite still play) by the hyena tool's
reshape (tools/bohemia_animation_the_hyena_prep.py: the sloped leg stretch, the ears, the muzzle, the tail, the ruff, the chest),
then three moves of our own on the same rule (bones translate, the mesh follows its bone field):
  NECK  the neck and head carried forward and up (the camel's long neck), a smooth field from the shoulders to the skull
  HUMP  the back's top lifted over the middle of the spine (the camel's hump; how big Camelops' was is not known from bone, so
        it is the dromedary surrogate's own, smaller)
  HORNS two tapered horns on the skull, parented to the head bone so every clip carries them (the bull)
and the coat painted from the 3D shape through the wolf tool's texel trace (the fox's white, dark socks and orange each repainted
by the animal's own colours, a crest down the spine, a face forward of the eyes, a tail tip, a grizzle at body scale).
Then the fight's own steps for a beast (tools/bohemia_combat_the_fight_wears_the_rig.py): the poses tool's Hit and Fall, DIRECTION's
master rig in eight facings (still, Walk 6, Bite 6, Hit 2, Fall 3: three keys a beat, the beat 120 BPM), and the fight's sheet.

    <venv bpy 4.2>/bin/python tools/bohemia_factions_five_more_beasts.py model coyote     -> reference/models/bohemia/coyote.glb
    <venv>/bin/python tools/bohemia_factions_five_more_beasts.py pose coyote               -> records/combat/rig/beast_coyote.glb
    <venv>/bin/python tools/bohemia_factions_five_more_beasts.py render coyote             -> records/target/combat/rig/beast_coyote/
    python3 tools/bohemia_factions_five_more_beasts.py pack                                -> slices/fight_rig/beast_<x>.webp + index
    python3 tools/bohemia_factions_five_more_beasts.py strip                               -> records/target/factions_five_beasts/
(model, pose and render take ALL; pack merges the five into slices/fight_rig/fight_rig.json and leaves every other look as it is,
because the other looks' renders are regenerated files nobody keeps on disk.)

REFERENCE CHECK (the 9/4 standing duty): each beast's strip is put beside the dire wolf's sheet at the fight's pixels and the 1.72 m
man is the ruler; analog horror AH-01 (the rig's own light and grain, no filter); no reference game.
"""
import json, math, os, subprocess, sys, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOX = os.path.join(ROOT, 'reference/models/khronos/Fox.glb')
MODELS = 'reference/models/bohemia'
POSED = 'records/combat/rig'
RENDERS = 'records/target/combat/rig'
OUT = 'slices/fight_rig'
STRIPS = 'records/target/factions_five_beasts'
CLIPS = [('Walk', 6), ('Bite', 6), ('Hit', 2), ('Fall', 3)]
SAMPLES = int(os.environ.get('BOHEMIA_RIG_SAMPLES', '24'))   # the fight's own (wears_the_rig SAMPLES)

# Each beast: its real length nose to tail tip (the master rig's --real-length), the hyena reshape's knobs, our three moves, its coat.
# Model units: the fox is about 155 long nose to tail tip, faces -Y, Z up; the belly line at 42, the eyes at y -50.
BEASTS = {
    # COYOTE (Canis latrans): 10 to 18 kg, 1.0 to 1.35 m with the tail, 0.6 m at the shoulder; a grizzled grey-buff saddle, rusty
    # legs, ears and muzzle, a pale throat and belly, the tail's tip black. The fox's nearest cousin on the rig: longer legs, a
    # longer face, the ears still big.
    'coyote': dict(real=1.2, leg=(1.22, 1.18), tail_len=0.9, ear_round=0.95,
                   shape=dict(LIMB=1.2, WIDTH=1.02, SKULL=1.02, MUZZLE=1.18, EAR=0.92, TAIL=0.95, RUFF=1.12, DEPTH=1.02),
                   coat=dict(base=(0.60, 0.53, 0.44), saddle=(0.33, 0.31, 0.29), belly=(0.84, 0.80, 0.71), socks=(0.56, 0.40, 0.27),
                             tip=(0.11, 0.10, 0.09), face=None, crest=None, griz=0.16)),
    # MOUNTAIN LION (Puma concolor): a male 55 to 70 kg, 2.0 to 2.4 m with a 0.7 m tail, 0.7 m at the shoulder; one tawny colour,
    # a cream belly and muzzle, the tail's tip and the ear backs dark. A cat on the fox: the face short, the ears small and round,
    # the legs thick, the hind legs the longer (the puma's are the longest in the cat family for its size), the tail long and thick.
    'mountain_lion': dict(real=2.1, leg=(1.12, 1.24), tail_len=1.18, ear_round=0.62,
                          shape=dict(LIMB=1.95, WIDTH=1.32, SKULL=1.25, MUZZLE=0.55, EAR=0.38, TAIL=1.3, RUFF=1.08, DEPTH=1.15),
                          coat=dict(base=(0.64, 0.50, 0.36), saddle=(0.52, 0.40, 0.29), belly=(0.86, 0.82, 0.74), socks=(0.58, 0.45, 0.33),
                                    tip=(0.10, 0.09, 0.08), face=None, crest=None, griz=0.07)),
    # FERAL HOG (Sus scrofa, the farm pig gone wild in two generations): a boar 60 to 150 kg, 1.2 to 1.8 m, 0.75 m at the shoulder;
    # short legs under a barrel, the big shoulders (a boar's cartilage shield there is up to 5 cm thick), the long snout, small
    # ears, a short thin tail; near-black bristle, a darker crest down the spine, a grey snout.
    'feral_hog': dict(real=1.55, leg=(0.78, 0.78), tail_len=0.32, ear_round=0.8,
                      shape=dict(LIMB=2.0, WIDTH=1.72, SKULL=1.32, MUZZLE=1.55, EAR=0.55, TAIL=0.32, RUFF=1.7, DEPTH=1.55),
                      coat=dict(base=(0.24, 0.20, 0.17), saddle=(0.20, 0.17, 0.15), belly=(0.30, 0.26, 0.23), socks=(0.14, 0.12, 0.11),
                                tip=(0.12, 0.10, 0.09), face=((0.42, 0.36, 0.33), 4.0), crest=((0.11, 0.09, 0.08), 5.0, 0.5), griz=0.2)),
    # CAMELOPS (Camelops hesternus, 'yesterday's camel', Tule Springs): about 20% bigger than a dromedary, 2.2 m at the shoulder,
    # 3.3 m nose to tail; the long legs, the long neck carried forward and up, the long face, tiny ears, a short tail; a sand coat,
    # the hump's top darker, the belly paler.
    'camelops': dict(real=3.3, leg=(2.05, 1.95), tail_len=0.42, ear_round=0.8,
                     shape=dict(LIMB=2.0, WIDTH=1.22, SKULL=1.3, MUZZLE=1.4, EAR=0.4, TAIL=0.45, RUFF=1.4, DEPTH=1.3),
                     neck=(24.0, 14.0), hump=26.0,   # pass 3: (34, 22) read as a pale plank from behind on the board; shorter, thicker
                     coat=dict(base=(0.64, 0.53, 0.39), saddle=(0.54, 0.43, 0.31), belly=(0.78, 0.70, 0.56), socks=(0.56, 0.46, 0.34),
                               tip=(0.30, 0.24, 0.18), face=None, crest=None, griz=0.08)),
    # FERAL BULL (Bos taurus, range cattle loose on Gold Butte): 700 to 900 kg, 1.5 m at the shoulder, 2.9 m nose to tail; the
    # heavy forequarters, the deep chest, thick short legs, a blunt face and horns forward and up; red-brown, the white face of
    # the Hereford line the valley's ranches ran, a pale belly.
    'feral_bull': dict(real=2.9, leg=(1.28, 1.22), tail_len=0.85, ear_round=0.8,
                       shape=dict(LIMB=1.85, WIDTH=1.62, SKULL=1.4, MUZZLE=1.3, EAR=0.42, TAIL=0.3, RUFF=1.8, DEPTH=1.7),
                       horns=dict(base=(4.0, -42.0, 80.0), out=8.0, fwd=7.0, up=8.0, r=2.6, colour=(0.82, 0.76, 0.62)),
                       coat=dict(base=(0.40, 0.21, 0.13), saddle=(0.33, 0.17, 0.11), belly=(0.82, 0.79, 0.72), socks=(0.30, 0.17, 0.11),
                                 tip=(0.24, 0.14, 0.09), face=((0.86, 0.84, 0.78), 6.0), crest=None, griz=0.08)),
}
LOOK = {k: 'beast_' + k for k in BEASTS}


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, path))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def field_move(points, neck, hump, top_ref):
    """our NECK and HUMP on points (n,3): the neck from the shoulders (y -18) to the skull (y -38) carried forward and up by
    neck=(forward, up) units in full at the skull; the hump lifts points over the back's middle in proportion to how high on the
    back they sit (top_ref the back's z there), so the belly and the legs never move"""
    import numpy as np
    p = points.copy()
    if neck:
        t = np.clip((-18.0 - p[:, 1]) / 20.0, 0, 1); t = t * t * (3 - 2 * t)
        p[:, 1] -= neck[0] * t; p[:, 2] += neck[1] * t
    if hump:
        along = np.exp(-((p[:, 1] - 8.0) / 16.0) ** 2)
        high = np.clip((p[:, 2] - (top_ref - 22.0)) / 22.0, 0, 1)
        p[:, 2] += hump * along * high
    return p


def model(name):
    """build reference/models/bohemia/<name>.glb (Blender's Python, bpy 4.2)"""
    import numpy as np
    b = BEASTS[name]
    H = load('hyena_' + name, 'tools/bohemia_animation_the_hyena_prep.py')
    W = H.W
    H.LEG_F, H.LEG_H = b['leg']; H.TAIL_LEN = b['tail_len']; H.EAR_ROUND = b['ear_round']
    base_reshape = H.reshape

    def reshape(arm, mesh):
        import bpy, mathutils
        out = base_reshape(arm, mesh)
        if b.get('neck') or b.get('hump'):
            names = {g.index: g.name for g in mesh.vertex_groups}
            me = mesh.data
            dom = [W.dominant(v, names) for v in me.vertices]
            limb = np.array([any(k in d for k in ('Arm', 'Hand', 'Leg', 'Foot')) for d in dom])
            co = np.array([v.co[:] for v in me.vertices])
            back = co[(np.abs(co[:, 1] - 8) < 10)][:, 2]
            top = float(back.max()) if len(back) else 90.0
            nh = np.array([d in ('b_Neck_04', 'b_Head_05') for d in dom])
            co[nh] = field_move(co[nh], b.get('neck'), 0, top)            # the neck and the head only: the chest stays
            co[~limb] = field_move(co[~limb], None, b.get('hump'), top)   # the hump: the back's top, never a leg
            for v, c in zip(me.vertices, co): v.co = mathutils.Vector(c)
            me.update()
            bpy.context.view_layer.objects.active = arm
            bpy.ops.object.mode_set(mode='EDIT')
            for eb in arm.data.edit_bones:
                if any(k in eb.name for k in ('Arm', 'Hand', 'Leg', 'Foot')): continue
                if eb.name not in ('b_Neck_04', 'b_Head_05'): continue   # the spine's bones stay: the hump is flesh, the neck moves
                h = np.array(eb.head[:]); t = np.array(eb.tail[:])
                hh = field_move(h[None], b.get('neck'), 0, top)[0]
                eb.head = mathutils.Vector(hh); eb.tail = mathutils.Vector(t + (hh - h))
            bpy.ops.object.mode_set(mode='OBJECT')
        if b.get('horns'): print('HORNS at z', horns(arm, mesh, b['horns'], W))
        return out

    def paint(mesh, seed=37):
        return coat(W, mesh, b['coat'], seed)

    for k, v in b['shape'].items(): setattr(W, k, v)
    W.LEG = 1.0
    W.SRC = FOX
    W.OUT = os.path.join(ROOT, MODELS, name + '.glb')
    W.reshape = reshape
    W.paint_coat = paint
    W.main()


def horns(arm, mesh, h, W):
    """two tapered horns on the skull, each a tube of rings along a curve (out to the side, then forward and up), joined into the
    body's mesh and weighted wholly to the head bone, so every clip carries them as the skull moves (a bone-parented object came
    back from the glTF a metre off the head, measured 11/3); their own plain material, the colour of horn; the base sits on the
    skull's own top behind the eyes, read from the reshaped mesh"""
    import bpy, numpy as np
    names = {g.index: g.name for g in mesh.vertex_groups}
    co = np.array([v.co[:] for v in mesh.data.vertices])
    dom = np.array([W.dominant(v, names) == 'b_Head_05' for v in mesh.data.vertices])
    by = h['base'][1]
    near = dom & (np.abs(co[:, 1] - by) < 5) & (np.abs(co[:, 0]) < h['base'][0] + 2)
    bz = float(np.percentile(co[near][:, 2], 85)) - 1.5 if near.any() else h['base'][2]
    mat = bpy.data.materials.new('horn'); mat.use_nodes = True
    mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = h['colour'] + (1.0,)
    mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.6
    verts, faces, R, S = [], [], 6, 9
    for side in (-1, 1):
        o = len(verts); bx = h['base'][0]
        for i in range(S):
            t = i / (S - 1)
            cx, cy, cz = side * (bx + h['out'] * math.sin(t * math.pi / 2)), by - h['fwd'] * t * t, bz + h['up'] * t * t
            r = h['r'] * (1 - 0.85 * t)
            for j in range(R):
                a = 2 * math.pi * j / R
                verts.append((cx, cy + r * math.cos(a), cz + r * math.sin(a)))
        for i in range(S - 1):
            for j in range(R):
                a0, a1 = o + i * R + j, o + i * R + (j + 1) % R
                faces.append((a0, a1, a1 + R, a0 + R) if side > 0 else (a0, a0 + R, a1 + R, a1))
        faces.append(tuple(range(o + R - 1, o - 1, -1)) if side > 0 else tuple(range(o, o + R)))
    me = bpy.data.meshes.new('horns'); me.from_pydata(verts, [], faces); me.update()
    ob = bpy.data.objects.new('horns', me); bpy.context.scene.collection.objects.link(ob)
    ob.matrix_world = mesh.matrix_world.copy()
    ob.data.materials.append(mesh.data.materials[0]); ob.data.materials.append(mat)
    for p in me.polygons: p.material_index = 1
    g = ob.vertex_groups.new(name='b_Head_05'); g.add(list(range(len(verts))), 1.0, 'REPLACE')
    me.uv_layers.new(name=mesh.data.uv_layers[0].name)
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True); mesh.select_set(True); bpy.context.view_layer.objects.active = mesh
    bpy.ops.object.join()
    return round(bz, 1)


def coat(W, mesh, c, seed):
    """the coat from the 3D shape (the wolf tool's trace): the fox's orange is the base (its own light kept), a saddle where the
    back faces up, the fox's white is the belly and chest, its dark socks the legs; a crest along the spine, a face forward of the
    eyes, the tail's tip; a grizzle at body scale (6 cm), never per texel"""
    import numpy as np
    img, px, rgb, lum, white, dark, orange, P, N, BONE, names = W.trace(mesh)
    covered = BONE >= 0
    idx = lambda pred: [i for i, n in names.items() if pred(n)]
    is_head = np.isin(BONE, idx(lambda n: n == 'b_Head_05'))
    is_tail = np.isin(BONE, idx(lambda n: n in W.TAILS))
    shade = np.clip(lum / max(float(np.median(lum[orange])), 1e-3), 0.6, 1.25)[..., None]
    up = np.clip((N[..., 2] - 0.3) / 0.5, 0, 1)[..., None] * (~is_head)[..., None]
    base = np.array(c['base'], np.float32) * (1 - up) + np.array(c['saddle'], np.float32) * up
    out = np.where(covered[..., None], base * shade, rgb)
    out = np.where((white & ~is_tail)[..., None], np.array(c['belly'], np.float32) * np.clip(shade, 0.85, 1.1), out)
    out = np.where(dark[..., None], np.array(c['socks'], np.float32) * shade, out)
    if c.get('crest'):
        col, half, nz = c['crest']
        crest = covered & ~is_tail & (N[..., 2] > nz) & (np.abs(P[..., 0]) < half) & (P[..., 1] > W.EYE_Y + 4)
        out = np.where(crest[..., None], np.array(col, np.float32) * shade, out)
    if c.get('face'):
        col, fy = c['face']
        face = is_head & (P[..., 1] < W.EYE_Y + fy)
        out = np.where(face[..., None], np.array(col, np.float32) * np.clip(shade, 0.85, 1.1), out)
    if is_tail.any():
        cut = float(np.percentile(P[is_tail][:, 1], 72))
        tip = is_tail & ((P[..., 1] > cut) | white)
        out = np.where(tip[..., None], np.array(c['tip'], np.float32), out)
    rng = np.random.default_rng(seed)
    lat = rng.random((64, 64, 64)).astype(np.float32)
    q = np.clip((P / 6.0 + 32).astype(int), 0, 63)
    griz = 1.0 + (lat[q[..., 0], q[..., 1], q[..., 2]] - 0.5) * c['griz']
    out = np.where(covered[..., None], out * griz[..., None], out)
    px[..., :3] = np.clip(out, 0, 1)
    img.pixels = px.ravel().tolist()
    img.pack()
    return dict(texels=int(covered.sum()), white=int(white.sum()), dark=int(dark.sum()))


def run(cmd, out):
    """bpy 4.2 headless can die as Blender exits after the file is written (wears_the_rig's run): a run that wrote its output worked"""
    import time
    for i in range(3):
        t0 = time.time()
        if subprocess.call(cmd, cwd=ROOT) == 0: return
        if out and os.path.exists(out) and os.path.getmtime(out) >= t0 - 1: return
    raise SystemExit('FAILED three times: ' + ' '.join(cmd))


def pose(name):
    src = os.path.join(ROOT, MODELS, name + '.glb'); out = os.path.join(ROOT, POSED, LOOK[name] + '.glb')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    run([sys.executable, 'tools/bohemia_combat_the_fight_poses.py', src, out, '--beast'], out)
    print('POSED', name, os.path.relpath(out, ROOT), flush=True)


def render(name):
    """DIRECTION's master rig with the fight's two changes in memory, exactly as wears_the_rig renders a beast"""
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    a, b = 'lights.append(light_footprint(', "sc.render.engine = G['engine'];"
    assert src.count(a) == 1 and src.count(b) == 1, 'the master rig changed: re-read it before patching in memory'
    th = int(os.environ.get('BOHEMIA_RIG_THREADS', '0'))
    src = src.replace(a, 'False and lights.append(light_footprint(').replace(b, "sc.render.use_persistent_data = True; " +
        ("sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % th if th else '') + b)
    glb = os.path.join(ROOT, POSED, LOOK[name] + '.glb'); out = os.path.join(ROOT, RENDERS, LOOK[name])
    argv = ['bohemia_direction_master_rig.py', glb, out, '--real-length', str(BEASTS[name]['real']), '--family', 'none',
            '--set', 'samples=%d' % SAMPLES, '--no-calibration', '--no-id-pass', '--set', 'dent_m=0']
    for c, k in CLIPS: argv += ['--clip', '%s:%d' % (c, k)]
    if os.environ.get('BOHEMIA_PREVIEW'):   # the shape pass by eye: the eight stills only, into a scratch folder
        out = os.path.join(os.environ['BOHEMIA_PREVIEW'], LOOK[name]); argv[2] = out; argv += ['--stills-only']
    code = ('import sys; sys.argv = %r; __file__ = %r\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'))) + src
    run([sys.executable, '-c', code], os.path.join(out, 'rig.json'))
    print('RENDERED', name, os.path.relpath(out, ROOT), flush=True)


def pack():
    """the five into the fight's sheets, the way wears_the_rig packs a beast (a row per facing, 18 columns: the still, the walk,
    the bite, the blow, the fall; the one-pixel day rim; 64 colours, lossless), merged into the index with every other look kept"""
    import numpy as np
    from PIL import Image
    WR = load('wears', 'tools/bohemia_combat_the_fight_wears_the_rig.py')
    idx_path = os.path.join(ROOT, OUT, 'fight_rig.json')
    index = json.load(open(idx_path))
    cols_here = [('stand', None, 1), ('walk', 'Walk', 6), ('bite', 'Bite', 6), ('hit', 'Hit', 2), ('fall', 'Fall', 3)]
    for name in BEASTS:
        look = LOOK[name]; d = os.path.join(ROOT, RENDERS, look)
        if not os.path.exists(os.path.join(d, 'rig.json')): print('NOT RENDERED', name); continue
        r = json.load(open(os.path.join(d, 'rig.json')))
        x0, y0, x1, y1 = r['crop_box_px']; w, h = x1 - x0 + 2, y1 - y0 + 2
        sheet = Image.new('RGBA', (w * 18, h * len(WR.FIGHT_DIRS)), (0, 0, 0, 0))
        for row, f in enumerate(WR.FIGHT_DIRS):
            col = 0
            for n, c, ks in cols_here:
                for k in range(ks):
                    fn = os.path.join(d, 'rig_%s_%s_k%02d.png' % (c, f, k)) if c else os.path.join(d, 'rig_%s.png' % f)
                    a = np.pad(np.asarray(Image.open(fn).convert('RGBA')).copy(), ((1, 1), (1, 1), (0, 0)))
                    op = a[..., 3] > 0; near = np.zeros_like(op)
                    near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                    a[near & ~op] = WR.RIM
                    sheet.paste(Image.fromarray(a, 'RGBA'), (col * w, row * h)); col += 1
        a = np.asarray(sheet)
        q = Image.fromarray(a[..., :3]).quantize(WR.SHEET_COLOURS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
        sheet = Image.fromarray(np.dstack([np.asarray(q), a[..., 3]]), 'RGBA')
        file = look + '.webp'
        sheet.save(os.path.join(ROOT, OUT, file), 'WEBP', lossless=True, quality=100, method=6)
        index['looks'][look] = dict(file=file, w=w, h=h, foot=[r['ground_px'][0] + 1, r['ground_px'][1] + 1], height_m=r['real_dims_m'][2],
                                    kind='beast', rig=os.path.relpath(os.path.join(d, 'rig.json'), ROOT),
                                    clips=dict(stand=[0], walk=list(range(1, 7)), bite=list(range(7, 13)), hit=[13, 14], fall=[15, 16, 17]),
                                    by='FACTIONS [five more beasts] 11/3, tools/bohemia_factions_five_more_beasts.py')
        print('PACKED', name, sheet.size, os.path.getsize(os.path.join(ROOT, OUT, file)))
    json.dump(index, open(idx_path, 'w'), indent=1)


def strip():
    """the proof: per beast, its eight facings' stills, then its walk, bite, blow and fall facing SE, at the fight's pixels, beside the
    dire wolf (the sibling it must not copy) and the 1.72 m man's height marked; and one card of all five side by side"""
    from PIL import Image, ImageDraw
    os.makedirs(os.path.join(ROOT, STRIPS), exist_ok=True)
    index = json.load(open(os.path.join(ROOT, OUT, 'fight_rig.json')))
    dirs = index['dirs']
    cells = []
    for name in ['dire_wolf'] + list(BEASTS):
        L = index['looks'].get('beast_' + name)
        if not L: continue
        s = Image.open(os.path.join(ROOT, OUT, L['file'])).convert('RGBA')
        cell = lambda row, col: s.crop((col * L['w'], row * L['h'], (col + 1) * L['w'], (row + 1) * L['h']))
        se = dirs.index('SE')
        frames = [cell(r, 0) for r in range(len(dirs))] + [cell(se, c) for c in range(1, 18)]
        W_, H_ = L['w'] * len(frames), L['h']
        img = Image.new('RGBA', (W_, H_), (24, 22, 20, 255))
        for i, f in enumerate(frames): img.alpha_composite(f, (i * L['w'], 0))
        man = round(98 * 1.0)   # the ruler: 98 rig px = the 1.72 m man
        dr = ImageDraw.Draw(img); fx, fy = L['foot']
        dr.line([(1, fy), (1, fy - man)], fill=(200, 60, 50, 255), width=2)
        img.save(os.path.join(ROOT, STRIPS, name + '_strip.png'))
        cells.append((name, cell(se, 0), L))
    gap = 8; tw = sum(c[1].width for c in cells) + gap * (len(cells) + 1); th = max(c[1].height for c in cells) + 2 * gap
    card = Image.new('RGBA', (tw, th), (24, 22, 20, 255)); x = gap
    for name, im, L in cells:
        card.alpha_composite(im, (x, th - gap - im.height)); x += im.width + gap
    card = card.resize((card.width * 2, card.height * 2), Image.NEAREST)
    card.save(os.path.join(ROOT, STRIPS, 'all_five_beside_the_wolf.png'))
    print('STRIPS', os.path.join(STRIPS), [c[0] for c in cells])


if __name__ == '__main__':
    cmd = sys.argv[1]; arg = sys.argv[2] if len(sys.argv) > 2 else 'ALL'
    names = list(BEASTS) if arg == 'ALL' else [arg]
    if cmd == 'model':
        for n in names: model(n)
    elif cmd == 'pose':
        for n in names: pose(n)
    elif cmd == 'render':
        for n in names: render(n)
    elif cmd == 'pack': pack()
    elif cmd == 'strip': strip()
    else: sys.exit('model | pose | render | pack | strip')
