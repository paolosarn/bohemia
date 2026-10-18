#!/usr/bin/env python3
"""BOHEMIA -- COOK THREE [the tiers through the rig]: THE ENEMY TIERS AS MODELS (rule 115c; his NO: 'a trenchcoat and
there's no trenchcoat action': the coat was paint, not a shape). The thug first, one tier a round.

THE METHOD (rule 115a): the person is MODELLED at the source and rendered through DIRECTION's master rig, the way the
robot and the truck were. Nothing here paints a pixel. This tool builds a glTF model of the tier from the rig's man
(reference/models/khronos/CesiumMan.glb, the same body DIRECTION renders; CHARACTER's body is that rig's ruler, 1.72 m)
and every garment is GEOMETRY skinned to the man's own bones, so it turns in eight facings and walks with him:
  * A GARMENT IS THE BODY'S OWN SKIN, LIFTED. The faces of the body inside the garment's region are copied with their
    bone weights, pushed out along their normals by the garment's thickness (padding is thick: 2.6 cm at the chest,
    flaring to 5 cm at the skirt), subdivided, and given a hem (a solidify rim), so the cloth deforms exactly as the
    body under it does and never clips through on the walk.
  * THE QUILTING IS MODELLED (the padded tier's tell, engine/bohemia_cook3_tier_paint.json THUG: padded, quilt 4,
    chest): grooves 7 cm apart pressed 9 mm into the padding, vertical channels round the torso, rings down the
    sleeves, a seam at the waist. At 57 px a metre a channel is 4 px: it reads as stitched padding by its own light
    and shadow, from every facing, because it is a shape the sun falls across, not a pattern drawn on.
  * THE HEAD 1.2x WIDE, 1.05x TALL (records/BOHEMIA_COOK3_WHAT_THE_RIG_NEEDS_FOR_A_PERSON_10_17_26.md section 2: the live man is 5.4
    heads; a true-proportion man renders a 13 px head and the tiers are told apart at 18): the head's vertices scaled
    about the neck by their weight on the head bone, so the neck blends.
  * THE KIT, per tier, every piece a mesh: the thug wears a quilted gambeson to mid-thigh with half sleeves, a wide
    leather belt, a knit cap with a folded brim, work trousers, boots, and carries a length of rusted pipe in his
    right fist (skinned to the hand bone: it swings with the arm).
  * THE COLOURS are the tier paint file's materials (padded, leather, steel), linearised for the renderer, the
    vibrance down (his 9/23); the runway's black for the trousers, oxblood for the one accent above the waist (the cap).
    The rig's source pass then puts the wear in (matte, crevice grime, up-face dust, drift, grain).

Run with Blender's Python (bpy 4.2; see tools/bohemia_direction_master_rig.py):
    v/bin/python tools/bohemia_cook3_the_tiers_through_the_rig.py THUG records/cook3/rig/thug.glb
then the rig, then the sheet (plain python3):
    v/bin/python tools/bohemia_direction_master_rig.py records/cook3/rig/thug.glb records/target/cook3/rig/thug \
        --real-height 1.72 --family none --wear 0.6 --still pass --clip Anim_0:6
    python3 tools/bohemia_cook3_the_tiers_through_the_rig.py --sheet THUG records/target/cook3/rig/thug records/target/cook3/COOK3_THE_THUG_THROUGH_THE_RIG.png

REUSE CHECK: the body, its bones and its walk are the rig's man (CesiumMan, the model DIRECTION renders), reused whole;
the render is DIRECTION's master rig, unedited; the colours are the tier paint file's; nothing new is drawn by hand.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the game's own thug (the live sprite he voted
'good direction, not final') and DIRECTION's rendered man; the card of numbers; skills/bohemia-pixel-art; AH-01.
No reference game.
"""
import os, sys, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BODY = os.path.join(ROOT, 'reference/models/khronos/CesiumMan.glb')
PAINT = json.load(open(os.path.join(ROOT, 'engine/bohemia_cook3_tier_paint.json')))


def lin(c):
    """an sRGB 0..255 colour to the renderer's linear 0..1"""
    f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1.0)


# the runway's black and the oxblood accent (engine/bohemia_cook3_runway_paint.json's Reds base #7a2a22, pulled down)
RUNWAY_BLACK = (34, 32, 30)
OXBLOOD = (74, 28, 24)   # darker than the paint file's: the rig's up-face dust lifts a cap toward pink (measured, cycle 3)
SKIN = (150, 112, 88)
RUST = (92, 70, 54)
OAT = (124, 106, 82)   # the padded ramp's 110,104,92 warmed: under the rig's grey sky fill the cool one read green

TIERS = {
    'THUG': dict(
        what='a quilted gambeson to mid-thigh with half sleeves, a wide leather belt, a knit cap with a folded brim, work trousers, boots, a length of rusted pipe',
        garment=dict(material='padded', colour=OAT, z=(0.47, 1.15), sleeve_x=0.36, chest_t=0.026, skirt_t=0.05,
                     quilt=dict(every_m=0.075, depth_m=0.013, ring_x=0.22)),
        belt=dict(colour=PAINT['leather'][1], z=(0.645, 0.705), t=0.062),
        cap=dict(colour=OXBLOOD, down_m=0.075, t=0.012, brim_m=0.03, brim_t=0.02),
        trousers=RUNWAY_BLACK, sleeves=RUNWAY_BLACK, boots=PAINT['leather'][0], skin=SKIN,
        weapon=dict(kind='pipe', colour=RUST, r=0.022, back=0.08, fore=0.42),
        head_scale=1.2),
}


def build(tier, out):
    import bpy, bmesh, mathutils
    T = TIERS[tier]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=BODY)
    for o in list(sc.objects):   # the importer's stray 42-vertex Icosphere (DIRECTION's rig removes it too)
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None: bpy.data.objects.remove(o, do_unlink=True)
    body = next(o for o in sc.objects if o.type == 'MESH')
    arm = next(o for o in sc.objects if o.type == 'ARMATURE')
    M = body.matrix_world.copy(); Mi = M.inverted(); R = M.to_3x3().normalized(); Ri = R.inverted()
    world = lambda co: M @ co
    gidx = {g.name: g.index for g in body.vertex_groups}

    def mat(name, rgb, rough=0.95):
        m = bpy.data.materials.new(name); m.use_nodes = True
        b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        b.inputs['Base Color'].default_value = lin(rgb); b.inputs['Roughness'].default_value = rough
        return m

    # 1. THE HEAD 1.3x about the neck, by its weight on the head bone
    hs = T.get('head_scale', 1.0)
    if hs != 1.0:
        neck = arm.matrix_world @ arm.data.bones['Skeleton_neck_joint_2'].head_local
        hg = gidx['Skeleton_neck_joint_2']
        for v in body.data.vertices:
            w = next((g.weight for g in v.groups if g.group == hg), 0.0)
            if w <= 0: continue
            p = world(v.co); s = 1.0 + (hs - 1.0) * w; sz = 1.0 + (hs - 1.0) * 0.25 * w
            d = p - neck; q = neck + mathutils.Vector((d.x * s, d.y * s, d.z * sz))   # wide, barely taller: the rig stretches height 1.41 already
            v.co = Mi @ q

    # 2. THE BODY'S OWN MATERIALS, by region (the mannequin's decal texture is gone: the body is skin, sleeves, trousers, boots)
    body.data.materials.clear()
    for nm, rgb in (('skin', T['skin']), ('sleeves', T['sleeves']), ('trousers', T['trousers']), ('boots', T['boots'])):
        body.data.materials.append(mat('%s_%s' % (tier.lower(), nm), rgb))
    for f in body.data.polygons:
        c = world(f.center)
        if c.z > 1.19: i = 0
        elif abs(c.x) > 0.47: i = 0
        elif abs(c.x) > 0.30 and c.z > 0.75: i = 1
        elif c.z < 0.10: i = 3
        else: i = 2
        f.material_index = i

    def lift(name, keep, thick, colour, rim=0.012, subdiv=2, groove=None):
        """a garment: the body's faces inside keep(world centre), copied with their weights, pushed out along the normal by
        thick(world point), subdivided, grooved, hemmed; skinned to the same armature"""
        g = body.copy(); g.data = body.data.copy(); g.name = name; sc.collection.objects.link(g)
        for md in list(g.modifiers): g.modifiers.remove(md)
        bm = bmesh.new(); bm.from_mesh(g.data)
        kill = [f for f in bm.faces if not keep(M @ f.calc_center_median())]
        bmesh.ops.delete(bm, geom=kill, context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = M @ v.co; n = (R @ v.normal).normalized()
            v.co = Mi @ (p + n * thick(p))
        bm.to_mesh(g.data); bm.free()
        g.data.materials.clear(); g.data.materials.append(mat(name, colour))
        for f in g.data.polygons: f.material_index = 0
        bpy.context.view_layer.objects.active = g
        for o in sc.objects: o.select_set(o is g)
        if subdiv:
            ss = g.modifiers.new('ss', 'SUBSURF'); ss.levels = subdiv; ss.render_levels = subdiv
            bpy.ops.object.modifier_apply(modifier='ss')
        if groove:
            g.data.update()
            for v in g.data.vertices:
                p = M @ v.co; d = groove(p)
                if d: v.co = Mi @ (p - (R @ v.normal).normalized() * d)
        if rim:
            so = g.modifiers.new('rim', 'SOLIDIFY'); so.thickness = rim; so.offset = -1; so.use_rim = True
            bpy.ops.object.modifier_apply(modifier='rim')
        am = g.modifiers.new('Armature', 'ARMATURE'); am.object = arm
        return g

    G = T['garment']
    z0, z1 = G['z']
    def in_coat(p): return z0 <= p.z <= z1 and abs(p.x) < G['sleeve_x']
    def coat_t(p):   # thick at the chest, flaring to the skirt below the belt
        if p.z >= 0.70: return G['chest_t']
        return G['chest_t'] + (G['skirt_t'] - G['chest_t']) * min(1.0, (0.70 - p.z) / 0.30)
    Q = G['quilt']
    def quilt(p):
        # the waist seam
        if abs(p.z - 0.73) < 0.008: return Q['depth_m']
        if abs(p.x) > Q['ring_x'] and p.z > 0.85:   # the sleeves: rings every 7 cm out from the shoulder
            u = (abs(p.x) - Q['ring_x']) / Q['every_m']
        else:   # the torso and skirt: vertical channels, measured as arc length round the body's axis
            cx = 0.0 if p.z > 0.66 else (0.075 if p.x > 0 else -0.07)   # below the hips each leg is its own column
            ang = math.atan2(p.y + 0.02, p.x - cx); r = 0.16 if p.z > 0.66 else 0.08
            u = ang * r / Q['every_m']
        c = math.cos(2 * math.pi * u)
        return Q['depth_m'] * max(0.0, c) ** 10   # a narrow groove, a broad pillow of padding between
    lift('%s_gambeson' % tier.lower(), in_coat, coat_t, G['colour'], rim=0.014, subdiv=2, groove=quilt)

    B = T['belt']
    lift('%s_belt' % tier.lower(), lambda p: B['z'][0] <= p.z <= B['z'][1] and abs(p.x) < 0.25, lambda p: B['t'], B['colour'], rim=0.008, subdiv=1)

    # the cap sits from the crown down to the brow, measured from the SCALED head's top (the head grew 1.3x)
    C = T['cap']
    top = max((M @ v.co).z for v in body.data.vertices)
    cz = top - C['down_m']   # lower at the back of the skull (+y is behind)
    # THE EYES: two sockets in the brow's shadow, a material on the body's own faces (2 px a socket at the ruler)
    body.data.materials.append(mat('%s_eyes' % tier.lower(), (40, 26, 22)))
    front = min((M @ f.center).y for f in body.data.polygons if (M @ f.center).z > cz - 0.15)
    for f in body.data.polygons:
        c = M @ f.center
        if cz - 0.07 <= c.z <= cz - 0.025 and c.y < front + 0.045 and 0.01 < abs(c.x) < 0.065: f.material_index = len(body.data.materials) - 1
    lift('%s_cap' % tier.lower(), lambda p: p.z >= cz - 0.025 * (p.y > 0.0), lambda p: C['t'], C['colour'], rim=0.01, subdiv=1)
    lift('%s_cap_brim' % tier.lower(), lambda p: cz - 0.025 * (p.y > 0.0) <= p.z <= cz + C['brim_m'] - 0.025 * (p.y > 0.0), lambda p: C['brim_t'], C['colour'], rim=0.012, subdiv=1)

    # 3. THE WEAPON: a length of pipe in the right fist, every vertex on the hand bone
    W = T.get('weapon')
    if W:
        hb = arm.data.bones['Skeleton_arm_joint_R__3_']; eb = arm.data.bones['Skeleton_arm_joint_R__2_']
        wrist = arm.matrix_world @ hb.head_local; elbow = arm.matrix_world @ eb.head_local
        fore = (wrist - elbow).normalized()
        fist = wrist + fore * 0.075
        axis = (fore * 0.9 + mathutils.Vector((0, -1, 0)) * 0.3).normalized()   # carried low at his side, the far end ahead of the knee
        L = W['back'] + W['fore']
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=W['r'], depth=L)
        p = bpy.context.active_object; p.name = '%s_pipe' % tier.lower()
        rot = mathutils.Vector((0, 0, 1)).rotation_difference(axis)
        p.rotation_mode = 'QUATERNION'; p.rotation_quaternion = rot
        p.location = fist + axis * (L / 2 - W['back'])
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        # a collar near each end (a pipe fitting): the silhouette's one feature
        for t_ in (W['fore'] - 0.03, -W['back'] + 0.02):
            bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=W['r'] * 1.45, depth=0.035)
            c = bpy.context.active_object; c.rotation_mode = 'QUATERNION'; c.rotation_quaternion = rot; c.location = fist + axis * t_
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
            for o in sc.objects: o.select_set(o in (p, c))
            bpy.context.view_layer.objects.active = p; bpy.ops.object.join()
        p.data.materials.append(mat('%s_pipe' % tier.lower(), W['colour'], rough=0.8))
        # skin it: parent to the armature's object space, every vertex weight 1 on the hand bone
        mw = p.matrix_world.copy(); p.parent = arm; p.matrix_world = mw
        vg = p.vertex_groups.new(name=hb.name); vg.add(list(range(len(p.data.vertices))), 1.0, 'REPLACE')
        am = p.modifiers.new('Armature', 'ARMATURE'); am.object = arm

    os.makedirs(os.path.dirname(out), exist_ok=True)
    for o in sc.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_skins=True, export_animations=True, export_apply=False, use_selection=False)
    stats = dict(tier=tier, what=T['what'], model=os.path.relpath(out, ROOT), from_body=os.path.relpath(BODY, ROOT),
                 meshes={o.name: len(o.data.vertices) for o in sc.objects if o.type == 'MESH'}, head_scale=hs,
                 materials={m.name: [round(x, 4) for x in next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value[:3]] for m in bpy.data.materials if m.use_nodes})
    json.dump(stats, open(out.replace('.glb', '.json'), 'w'), indent=1)
    print(json.dumps(stats, indent=1))


# the game's own flat sprite of each tier, as last painted (records/cook3/enemy_tiers_repainted.png, row AFTER, 112 cells)
TWIN_CELL = {'THUG': 0, 'POACHER': 1, 'MARKSMAN': 2, 'RAIDER': 3, 'LEADER': 4, 'MARAUDER': 5}


def twin(tier):
    from PIL import Image
    import numpy as np
    i = TWIN_CELL[tier]; x0 = 12 + 124 * i
    a = np.asarray(Image.open(os.path.join(ROOT, 'records/cook3/enemy_tiers_repainted.png')).convert('RGBA').crop((x0, 158, x0 + 112, 270))).copy()
    white = (a[..., :3].min(axis=2) > 235); a[white, 3] = 0
    im = Image.fromarray(a, 'RGBA'); return im.crop(im.getbbox())


def sheet(tier, frames, out):
    """the eight facings and the walk at 1:1 on a ground-coloured board, the S still beside the game's own flat tier at
    1:1 and 4x, the caption naming the pixel size, the palette file and the light (rule 114c)"""
    from PIL import Image, ImageDraw
    BG = (22, 21, 20); GROUND = (118, 106, 88); fac = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    rig = json.load(open(os.path.join(frames, 'rig.json')))
    row1 = [Image.open(os.path.join(frames, 'rig_%s.png' % f)) for f in fac]
    row2 = [Image.open(os.path.join(frames, 'rig_Anim_0_%s_k%02d.png' % (f, k))) for f in ('S', 'SE') for k in range(6)]
    tw = twin(tier); s1 = row1[4]; cw, ch = s1.size
    Wd = max(12 * (cw + 6), 8 * (cw + 6), 900) + 24
    H = 70 + (ch + 30) * 2 + 30 + 4 * max(ch, tw.height) + 120
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), 'COOK THREE: THE %s, MODELLED AND RENDERED THROUGH THE RIG (rule 115c), 1:1. A CANDIDATE: nothing is final before the moodboard.' % tier, fill=(220, 214, 200))
    d.text((12, 24), '57 px a metre (1.72 m = 98 px), one pixel size, block 1 | palette: engine/bohemia_cook3_tier_paint.json (padded, leather) + the runway black and oxblood | ONE light: the rig\'s sun, upper left, above', fill=(160, 154, 140))
    d.text((12, 38), 'every garment is geometry on the man\'s bones: the quilted gambeson (grooves 7.5 cm, 13 mm deep), the belt, the knit cap, the pipe in the right fist', fill=(160, 154, 140))
    def strip(ims, y, labels):
        x = 12
        for im, lb in zip(ims, labels):
            S.paste(GROUND, (x, y, x + cw, y + ch)); S.paste(im, (x, y), im); d.text((x, y + ch + 2), lb, fill=(160, 154, 140)); x += cw + 6
    y = 58; d.text((12, y), 'EIGHT FACINGS, STILL (the passing pose)', fill=(200, 190, 120)); strip(row1, y + 14, fac)
    y += ch + 34; d.text((12, y), 'THE WALK, S then SE, 6 DRAWN KEYS = 2 BEATS AT 120 (the pipe swings with the hand: it is on the hand bone)', fill=(200, 190, 120))
    strip(row2, y + 14, ['S k%d' % k for k in range(6)] + ['SE k%d' % k for k in range(6)])
    y += ch + 34
    d.text((12, y), 'OURS (the model)  |  HIS TWIN TODAY: the game\'s own flat %s as last painted   at 1:1, then 4x' % tier, fill=(200, 190, 120)); y += 16
    x = 12
    for im in (s1, tw): S.paste(GROUND, (x, y, x + im.width, y + im.height)); S.paste(im, (x, y), im); x += im.width + 16
    x += 24
    for im in (s1, tw):
        b = im.resize((im.width * 4, im.height * 4), Image.NEAREST); S.paste(GROUND, (x, y, x + b.width, y + b.height)); S.paste(b, (x, y), b); x += b.width + 16
    y += 4 * max(ch, tw.height) + 10
    c = rig['card']
    d.text((12, y), 'the card on the S still (%s): %s' % (c['family'], c['verdict']), fill=(200, 190, 120))
    for i, r in enumerate(c['rows']): d.text((12 + (i % 4) * 230, y + 16 + 14 * (i // 4)), r, fill=(150, 144, 132))
    d.text((12, y + 52), 'colours across the set %d; model %s; rendered %s' % (rig['colours'], rig['model'], rig['still']), fill=(120, 116, 108))
    os.makedirs(os.path.dirname(out), exist_ok=True); S.save(out); print('sheet', out)


if __name__ == '__main__':
    if sys.argv[1] == '--sheet':
        sheet(sys.argv[2].upper(), sys.argv[3], sys.argv[4])
    else:
        tier = sys.argv[1].upper(); out = sys.argv[2]
        build(tier, os.path.abspath(out))
