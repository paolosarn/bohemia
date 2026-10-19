#!/usr/bin/env python3
"""BOHEMIA -- COMBAT [the tear and the floor] (rule 121(h), Paolo 10/19: the fight floor is a NO again, 'looks like shit';
'the floor goes the 3D way too'; END STATE: 'the fight floor rendered the 3D way like the props and the people, so the
ground and the men match'). THE FIGHT'S GROUND, MODELLED AND RENDERED THROUGH THE RIG.

WHAT WAS ON THE FLOOR (measured, COOK TWO 10/19, records/BOHEMIA_COOK2_THE_FIGHT_FLOOR_10_19_26.md): every ground in the 35
block pictures is two soils with the second pasted through a coarse random field (the camouflage), and his soils read
orange; COOK TWO's re-lay from his flat pack tiles (cook2-the-fight-floor-10-19) is the floor he said NO to again. The men
are now the rig's clay (COMBAT [the fight wears the 3D models]); a flat painted tile under a modelled man is two looks.

THE METHOD (rule 115(a): modelled at the source, rendered through the rig's look, one sun, one camera):
  1. materials (Blender's Python): each of COOK TWO's eight grounds (caliche, desert, rough, playa, track, concrete,
     asphalt, lawn) is MODELLED as a patch of ground one block wide (60 m, five house tiles): concrete is 1.5 m slabs with
     their joints, each slab its own height and tilt by a few millimetres; the dirt grounds carry their stones as stones;
     the playa its cracks; asphalt its aggregate. Rendered by DIRECTION's master rig's own light and film (its
     light_and_film: the one sun from the upper left, the cool fill, Cycles, matte, no blur) through the rig's camera
     (orthographic, tilted 45, facing north) at the fight ground's own scale (42.9 px a metre across, 30.3 deep: the
     tile's 515 x 364). The stones wear DIRECTION's source pass unedited (old paint, grime, dust, drift, grain, worn
     edges); the ground under them wears the same pass's steps and numbers (the style guide's rig block) laid on a
     4-D torus so the patch TILES: every mask repeats exactly at 60 m, so a block's ground meets the next block's with
     no seam and each block takes its own shifted window of it.
         <venv>/bin/python tools/bohemia_combat_the_floor_the_3d_way.py materials [GROUND|ALL] [--test]
         -> records/target/combat/floor3d/materials/<ground>.png (2575 x 1820, tiles both ways)
  2. lay (plain python3): COOK TWO's re-lay (tools/bohemia_cook2_the_fight_floor_10_19_26.py) imported as it is: COMBAT
     TWO's block maker run twice, every ground pixel found with the darkness its maker gave it (a house's shadow), every
     non-ground pixel kept; only the ground's source changes from his flat tiles to the rendered patch.
         python3 tools/bohemia_combat_the_floor_the_3d_way.py lay [BLOCK ...]
         -> records/target/combat/floor3d/block_<id>.webp
  3. ship: the re-laid blocks into slices/fight_ground (COMBAT TWO's and COOK TWO's files, theirs while they are paused,
     rule 121: 'COOK TWO's and COMBAT TWO's files are yours'); the futures (raided, reclaimed: act two and three) keep
     theirs until the act they belong to is in the demo.
         python3 tools/bohemia_combat_the_floor_the_3d_way.py ship

REUSE CHECK: DIRECTION's light_and_film and source_pass, imported from tools/bohemia_direction_master_rig.py, never edited;
COOK TWO's grounds and their YES tints (GROUNDS), its refloor and shadow, and COMBAT TWO's block maker, imported as they are.
REFERENCE CHECK (the 9/4 standing duty): the compare law: the VOTE card puts the floor now beside the floor rendered, on
the real fight from the game's camera; the twin is his own tiles (COOK TWO's kit) at 1:1; analog horror AH-01 (one yard
still green: COOK TWO's watered lawn kept); no reference game.
[bb the battle ground] Battle Brothers' tactical board is one painted ground per terrain, quiet under the men; ours is one
modelled ground per terrain, quiet under the men, lit by the same sun as they are.
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records/target/combat/floor3d')
P = 60.0                     # the period: one block, five house tiles of 12 m
W_PX, H_PX = 2575, 1820      # the fight's block picture (fight_ground.json: tile 515 x 364, five a block)
PPM = W_PX / P               # 42.9 px a metre across; depth x cos45
# what the eight grounds are, as things (the colours are COOK TWO's valley tans, his YES; the render is calibrated so the
# lit ground's median lands on the tan of his tile there: COOK TWO's materials' means, measured 10/19)
GROUNDS = {
    'caliche':  dict(target=(173, 162, 139), stones=(1.6, 0.025, 0.07), big=(0.05, 0.10, 0.22), bump=0.25),
    'desert':   dict(target=(176, 161, 136), stones=(1.2, 0.025, 0.07), big=(0.12, 0.12, 0.30), bump=0.3),
    'rough':    dict(target=(168, 157, 135), stones=(2.4, 0.04, 0.12), big=(0.45, 0.14, 0.40), bump=0.45),
    'playa':    dict(target=(155, 145, 125), stones=(0.15, 0.02, 0.05), big=(0.0, 0, 0), bump=0.15, cracks=0.55),
    'track':    dict(target=(163, 149, 126), stones=(0.5, 0.02, 0.05), big=(0.02, 0.08, 0.16), bump=0.2),
    'concrete': dict(target=(121, 111, 97), slabs=1.5, stones=(0.05, 0.02, 0.04), big=(0.0, 0, 0), bump=0.12),
    'asphalt':  dict(target=(64, 61, 60), stones=(0.25, 0.015, 0.04), big=(0.0, 0, 0), bump=0.5, aggregate=True),
    'lawn':     dict(target=(94, 107, 50), stones=(0.0, 0, 0), big=(0.0, 0, 0), bump=0.9, tufts=True),
}
SAMPLES = 48


def rig():
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_direction_master_rig as MR
    return MR


def torus(nt, per_m, seed, world=False):
    """a noise coordinate that repeats every P metres both ways: (x, y) on the ground laid onto a 4-D torus whose two
    circles are P long, at per_m features a metre (Blender's 4-D noise: the vector plus W)"""
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    if world:   # the slabs: where the surface is in the world, so no two slabs wear the same marks
        geo = nt.nodes.new('ShaderNodeNewGeometry'); nt.links.new(geo.outputs['Position'], sep.inputs[0])
    else:
        tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
    r = P * per_m / (2 * math.pi)
    def circ(axis, fn):
        a = nt.nodes.new('ShaderNodeMath'); a.operation = 'MULTIPLY'; a.inputs[1].default_value = 2 * math.pi / P; nt.links.new(sep.outputs[axis], a.inputs[0])
        f = nt.nodes.new('ShaderNodeMath'); f.operation = fn; nt.links.new(a.outputs[0], f.inputs[0])
        m = nt.nodes.new('ShaderNodeMath'); m.operation = 'MULTIPLY_ADD'; m.inputs[1].default_value = r; m.inputs[2].default_value = seed * 17.3
        nt.links.new(f.outputs[0], m.inputs[0]); return m.outputs[0]
    comb = nt.nodes.new('ShaderNodeCombineXYZ')
    nt.links.new(circ('X', 'COSINE'), comb.inputs[0]); nt.links.new(circ('X', 'SINE'), comb.inputs[1]); nt.links.new(circ('Y', 'COSINE'), comb.inputs[2])
    return comb.outputs[0], circ('Y', 'SINE')


def noise4(nt, per_m, seed, detail=4.0, rough=0.6, kind='NOISE', world=False):
    vec, w = torus(nt, per_m, seed, world)
    n = nt.nodes.new('ShaderNodeTexNoise' if kind == 'NOISE' else 'ShaderNodeTexVoronoi')
    if kind == 'NOISE':
        n.noise_dimensions = '4D'; n.inputs['Scale'].default_value = 1.0; n.inputs['Detail'].default_value = detail; n.inputs['Roughness'].default_value = rough
    else:
        n.voronoi_dimensions = '4D'; n.feature = 'DISTANCE_TO_EDGE'; n.inputs['Scale'].default_value = 1.0
    nt.links.new(vec, n.inputs['Vector']); nt.links.new(w, n.inputs['W'])
    return n.outputs['Distance' if kind != 'NOISE' else 'Fac']


def ground_material(MR, name, albedo, spec, seed, world=False):
    """the ground's own paint, the source pass's steps at the guide's numbers, every mask on the torus: the dust in
    half-metre patches, the 20 cm drift, the grain at 28 a metre in the patches; the bump is the ground's own lumps (and the
    playa's cracks, the asphalt's aggregate, the lawn's tufts)"""
    import bpy
    G = MR.G; wear = float(G['wear'])
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Roughness'].default_value = 1.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in bsdf.inputs: bsdf.inputs[sp].default_value = float(G['specular'])
    rgb = nt.nodes.new('ShaderNodeRGB'); rgb.outputs[0].default_value = tuple(albedo) + (1,)
    hsv = nt.nodes.new('ShaderNodeHueSaturation'); hsv.inputs['Saturation'].default_value = float(G['paint_sat_mul']) * (1 - float(G['bleach_up']) * wear)
    nt.links.new(rgb.outputs[0], hsv.inputs['Color'])
    dust = noise4(nt, float(G['dust_per_m']), seed + 1, 5.0, 0.65, world=world)
    dustm = nt.nodes.new('ShaderNodeMapRange'); dustm.inputs['From Min'].default_value = 0.45; dustm.inputs['From Max'].default_value = 0.75; dustm.clamp = True
    # a ground is all up-facing, so the guide's dust would cover it in pale patches (on the asphalt and the lawn the first
    # test read as the camouflage he hated, measured by eye 10/19): here the dust is the ground's own colour a step paler,
    # at a third of the strength, never a second colour laid in blobs
    dustm.inputs['To Max'].default_value = 0.30 * wear; nt.links.new(dust, dustm.inputs['Value'])
    pale = nt.nodes.new('ShaderNodeMixRGB'); pale.blend_type = 'SCREEN'; pale.inputs['Fac'].default_value = 0.35; pale.inputs['Color2'].default_value = (0.66, 0.60, 0.50, 1)
    nt.links.new(hsv.outputs['Color'], pale.inputs['Color1'])
    lit = nt.nodes.new('ShaderNodeMixRGB'); lit.blend_type = 'MIX'; nt.links.new(pale.outputs['Color'], lit.inputs['Color2'])
    nt.links.new(hsv.outputs['Color'], lit.inputs['Color1']); nt.links.new(dustm.outputs['Result'], lit.inputs['Fac'])
    drift = noise4(nt, float(G['drift_per_m']), seed + 2, 4.0, 0.6, world=world)
    dr = nt.nodes.new('ShaderNodeMixRGB'); dr.blend_type = 'OVERLAY'; dr.inputs['Fac'].default_value = 0.16 * wear
    nt.links.new(lit.outputs['Color'], dr.inputs['Color1']); nt.links.new(drift, dr.inputs['Color2'])
    grain = noise4(nt, float(G['grain_per_m']) * 0.75, seed + 3, 2.0, 0.5, world=world)
    wide = nt.nodes.new('ShaderNodeMapRange'); wide.inputs['From Min'].default_value = 0.32; wide.inputs['From Max'].default_value = 0.68; wide.clamp = True
    wide.inputs['To Max'].default_value = float(G['grain_lift']); nt.links.new(grain, wide.inputs['Value'])
    patch = nt.nodes.new('ShaderNodeMapRange'); patch.inputs['From Min'].default_value = 0.42; patch.inputs['From Max'].default_value = 0.62; patch.clamp = True
    patch.inputs['To Min'].default_value = float(G['grain_rest']) * wear * 0.6; patch.inputs['To Max'].default_value = float(G['grain_wear']) * wear * 0.6
    nt.links.new(drift, patch.inputs['Value'])
    gr = nt.nodes.new('ShaderNodeMixRGB'); gr.blend_type = 'OVERLAY'
    nt.links.new(patch.outputs['Result'], gr.inputs['Fac']); nt.links.new(dr.outputs['Color'], gr.inputs['Color1']); nt.links.new(wide.outputs['Result'], gr.inputs['Color2'])
    col = gr.outputs['Color']
    # the ground's relief, as light (a bump on the true surface; the sun reads it as the slabs and stones read)
    lumps = noise4(nt, 2.5, seed + 4, 6.0, 0.6, world=world)
    height = lumps
    if spec.get('cracks'):   # the playa: dried mud split into plates (a 4-D Voronoi's edges), dark in the crack
        cr = noise4(nt, 1.0 / spec['cracks'], seed + 5, kind='VORONOI')
        crm = nt.nodes.new('ShaderNodeMapRange'); crm.inputs['From Min'].default_value = 0.0; crm.inputs['From Max'].default_value = 0.035; crm.clamp = True
        nt.links.new(cr, crm.inputs['Value'])
        dk = nt.nodes.new('ShaderNodeMixRGB'); dk.blend_type = 'MULTIPLY'; dk.inputs['Color2'].default_value = (0.5, 0.46, 0.42, 1)
        inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1.0; nt.links.new(crm.outputs['Result'], inv.inputs[1])
        nt.links.new(inv.outputs[0], dk.inputs['Fac']); nt.links.new(col, dk.inputs['Color1']); col = dk.outputs['Color']
        hm = nt.nodes.new('ShaderNodeMath'); hm.operation = 'MULTIPLY_ADD'; hm.inputs[1].default_value = 0.5
        nt.links.new(crm.outputs['Result'], hm.inputs[0]); nt.links.new(lumps, hm.inputs[2]); height = hm.outputs[0]
    if spec.get('aggregate') or spec.get('tufts'):   # the asphalt's stones in the tar, the lawn's tufts: a fine relief
        fine = noise4(nt, 14.0 if spec.get('aggregate') else 9.0, seed + 6, 2.0, 0.7)
        hm = nt.nodes.new('ShaderNodeMath'); hm.operation = 'MULTIPLY_ADD'; hm.inputs[1].default_value = 0.6
        nt.links.new(fine, hm.inputs[0]); nt.links.new(height, hm.inputs[2]); height = hm.outputs[0]
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = spec['bump']; bump.inputs['Distance'].default_value = 0.02
    nt.links.new(height, bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    ao = nt.nodes.new('ShaderNodeAmbientOcclusion'); ao.inputs['Distance'].default_value = 0.25; ao.samples = 8
    grime = nt.nodes.new('ShaderNodeMixRGB'); grime.blend_type = 'MIX'; grime.inputs['Color2'].default_value = (0.11, 0.085, 0.065, 1)
    gi = nt.nodes.new('ShaderNodeMath'); gi.operation = 'MULTIPLY_ADD'; gi.inputs[1].default_value = -1.2 * wear; gi.inputs[2].default_value = 1.2 * wear; gi.use_clamp = True
    nt.links.new(ao.outputs['AO'], gi.inputs[0]); nt.links.new(gi.outputs[0], grime.inputs['Fac']); nt.links.new(col, grime.inputs['Color1'])
    nt.links.new(grime.outputs['Color'], bsdf.inputs['Base Color'])
    return m


def stone_material(name, albedo):
    import bpy
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'); b.inputs['Base Color'].default_value = tuple(albedo) + (1,)
    return m


def build(MR, g, spec, albedo, seed, period):
    """the patch: the ground plane, the slabs or the stones, each feature near an edge repeated a period over (so the
    patch tiles), all of it under one parent at the ground's origin"""
    import bpy, random
    rnd = random.Random(seed)
    sc = bpy.context.scene
    objs = []
    margin = 1.5
    bpy.ops.mesh.primitive_plane_add(size=1, location=(period / 2, period / 2, -0.06 if spec.get('slabs') else 0))
    gp = bpy.context.active_object; gp.scale = (period + 2 * margin, period + 2 * margin, 1); bpy.ops.object.transform_apply(scale=True)
    gp.data.materials.append(ground_material(MR, 'ground_' + g, albedo, spec, seed)); objs.append(gp)
    def copies(x, y, r):
        out = [(x, y)]
        for dx in (-period, 0, period):
            for dy in (-period, 0, period):
                if (dx or dy) and -margin - r <= x + dx <= period + margin + r and -margin - r <= y + dy <= period + margin + r: out.append((x + dx, y + dy))
        return out
    if spec.get('slabs'):   # concrete: 1.5 m slabs, 2 cm joints, each its own millimetres of height and tilt
        s = spec['slabs']; n = int(round(period / s)); mat = ground_material(MR, 'slab', albedo, dict(bump=0.2), seed + 9, world=True)
        bpy.ops.mesh.primitive_cube_add(size=1); proto = bpy.context.active_object; proto.scale = (s - 0.02, s - 0.02, 0.1); bpy.ops.object.transform_apply(scale=True)
        bev = proto.modifiers.new('bevel', 'BEVEL'); bev.width = 0.012; bev.segments = 2
        proto.data.materials.append(mat)
        for i in range(-1, n + 1):
            for j in range(-1, n + 1):
                o = proto.copy(); o.name = 'slab'; sc.collection.objects.link(o)
                ii, jj = i % n, j % n; r2 = random.Random(seed * 1000 + ii * 97 + jj)
                o.location = (i * s + s / 2, j * s + s / 2, -0.05 + r2.uniform(-0.004, 0.006))
                o.rotation_euler = (r2.uniform(-0.004, 0.004), r2.uniform(-0.004, 0.004), 0)
                objs.append(o)
        bpy.data.objects.remove(proto, do_unlink=True)
    # stones: small ones at density per m2 between two radii, then the big ones; each a rough rock, sunk a third
    rocks = []
    for k in range(4):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1)
        r = bpy.context.active_object; rr = random.Random(seed + k * 31)
        for v in r.data.vertices: v.co *= rr.uniform(0.75, 1.15)
        r.scale = (1, rr.uniform(0.7, 1.0), rr.uniform(0.45, 0.7)); bpy.ops.object.transform_apply(scale=True)
        v = rr.uniform(0.8, 1.2)   # a stone is the ground's own colour a step lighter or darker, never another hue
        r.data.materials.append(stone_material('stone_%d' % k, [min(1, c * v) for c in albedo]))
        r.hide_render = True; rocks.append(r)
    for dens, r0, r1 in (spec['stones'], spec['big']):
        if not dens: continue
        for _ in range(int(dens * period * period)):
            x, y, r = rnd.uniform(0, period), rnd.uniform(0, period), rnd.uniform(r0, r1)
            proto = rocks[rnd.randrange(len(rocks))]; rz = rnd.uniform(0, 6.283)
            for (px, py) in copies(x, y, r):
                o = proto.copy(); o.hide_render = False; sc.collection.objects.link(o)
                o.location = (px, py, -r * 0.3); o.scale = (r, r, r); o.rotation_euler = (0, 0, rz); objs.append(o)
    return objs, rocks


def camera(sc, period, w, h):
    import bpy, mathutils
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = w / PPM   # the picture's width in metres at the fight ground's 42.9 px a metre
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(45.0); cam.rotation_euler = (t, 0, 0)
    look = mathutils.Vector((period / 2, period / 2, 0)); d = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - d * 80
    sc.render.resolution_x, sc.render.resolution_y = w, h


def render_one(g, test=False, albedo=None):
    import bpy
    MR = rig()
    spec = GROUNDS[g]
    period = 12.0 if test else P
    w, h = (515, 364) if test else (W_PX, H_PX)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    A = dict(sun_rot=list(MR.G['sun_rot_deg']))
    MR.light_and_film(sc, A)
    sc.cycles.samples = 16 if test else SAMPLES
    sc.render.use_persistent_data = True
    sc.render.film_transparent = False
    alb = albedo or [((c / 255.0) ** 2.2) * 0.9 for c in spec['target']]
    objs, rocks = build(MR, g, spec, alb, 7 + list(GROUNDS).index(g), period)
    MR.source_pass([o for o in objs if o.type == 'MESH' and not o.name.startswith(('Plane', 'slab'))] + rocks, float(MR.G['wear']), 1.0, 0)
    camera(sc, period, w, h)
    os.makedirs(os.path.join(OUT, 'materials'), exist_ok=True)
    fn = os.path.join(OUT, 'materials', '%s%s.png' % (g, '_test' if test else ''))
    sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
    return fn, alb


def materials(arg, test):
    """each ground: a calibration render (a 12 m patch, few samples), its median against the tan of his tile, the albedo
    moved by the ratio, then the whole block's patch"""
    import numpy as np
    from PIL import Image
    cal = {}
    for g in (GROUNDS if arg.upper() == 'ALL' else [arg]):
        tgt = np.array(GROUNDS[g]['target'], float); lin = lambda c: (np.clip(c, 1, 255) / 255.0) ** 2.2
        alb2, meds = None, []
        for it in range(2):   # the dust and the grain do not scale with the albedo, so twice
            fn, alb = render_one(g, test=True, albedo=alb2)
            med = np.median(np.asarray(Image.open(fn).convert('RGB')).reshape(-1, 3).astype(float), 0); meds.append([round(x, 1) for x in med])
            alb2 = [float(min(1.0, x * y)) for x, y in zip(alb, lin(tgt) / lin(med))]
        cal[g] = dict(test_medians=meds, target=list(tgt), albedo=[round(x, 4) for x in alb2])
        if test: fn, _ = render_one(g, test=True, albedo=alb2); continue
        fn, _ = render_one(g, test=False, albedo=alb2)
        b = np.asarray(Image.open(fn).convert('RGB')).reshape(-1, 3).astype(float)
        cal[g]['median'] = [round(x, 1) for x in np.median(b, 0)]
        print('MATERIAL', g, cal[g], flush=True)
    p = os.path.join(OUT, 'materials', 'calibration%s.json' % ('_test' if test else ''))
    old = json.load(open(p)) if os.path.exists(p) else {}
    old.update(cal); json.dump(old, open(p, 'w'), indent=1)


def lay(only):
    """COOK TWO's re-lay, imported as it is, with the ground's source the rendered patch: each block a window of it shifted
    by its own seed (the patch tiles, so a shifted window has no seam). The blocks it reads are the floor as it shipped
    before this tool (kept in floor3d/before/, so a second run re-lays the same blocks, never its own output)."""
    import shutil
    import numpy as np
    from PIL import Image
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_cook2_the_fight_floor_10_19_26 as C2
    before = os.path.join(OUT, 'before'); os.makedirs(before, exist_ok=True)
    ship = os.path.join(ROOT, 'slices/fight_ground')
    for f in os.listdir(ship):
        if f.startswith('block_') and f.endswith('.webp') and not os.path.exists(os.path.join(before, f)): shutil.copyfile(os.path.join(ship, f), os.path.join(before, f))
    shutil.copyfile(os.path.join(ship, 'fight_ground.json'), os.path.join(before, 'fight_ground.json'))
    MAT = {g: np.asarray(Image.open(os.path.join(OUT, 'materials', g + '.png')).convert('RGB')) for g in GROUNDS}
    def field(g, w, h, seed):
        m = MAT[g]; H, Wd = m.shape[:2]; r = np.random.RandomState(seed)
        big = np.roll(m, (-r.randint(H), -r.randint(Wd)), axis=(0, 1))
        if h > H or w > Wd: big = np.tile(big, (h // H + 1, w // Wd + 1, 1))
        return big[:h, :w]
    C2.field = field; C2.OUT = OUT; C2.SHIP = before
    C2.main(only or None)


def ship():
    """the re-laid blocks into the fight (COMBAT TWO's folder, its file names unchanged), the casino's interior and the
    futures left as they are"""
    import shutil
    n = 0
    for f in sorted(os.listdir(OUT)):
        if f.startswith('block_') and f.endswith('.webp'):
            shutil.copyfile(os.path.join(OUT, f), os.path.join(ROOT, 'slices/fight_ground', f)); n += 1
    print('SHIPPED', n, 'blocks into slices/fight_ground')


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'materials': materials(sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 'ALL', '--test' in sys.argv)
    elif cmd == 'lay': lay(sys.argv[2:])
    elif cmd == 'ship': ship()
    else: sys.exit('materials | lay | ship')
