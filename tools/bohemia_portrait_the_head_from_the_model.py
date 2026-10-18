#!/usr/bin/env python3
"""BOHEMIA -- PORTRAIT [the face from the same model]: THE HD FACE IS THE RIG'S HEAD, RENDERED CLOSE (rule 115c; ONE
ID, ONE WHOLE PERSON: the face and the body come from one model, never two).

THE GAP THIS CLOSES (COOK THREE's finding on the thug, records/BOHEMIA_COOK3_THE_THUG_THROUGH_THE_RIG_10_18_26.md):
'the head is the test body's head mesh, a box; scaling it makes a bigger box. A person model with a skull, a jaw and
hair geometry is what fixes it.' The packs hold no faces (records/BOHEMIA_PORTRAIT_QUARTERMASTERS_COUNT_10_13_26.md,
f3090598), so the head is MODELLED HERE, as geometry, the way DIRECTION modelled the oil drum and COOK THREE the
gambeson. Nothing here paints a pixel (rule 108a): every feature is a shape the rig's one sun falls across.

THE HEAD (metres, the body's own frame before the rig scales it to 1.72 m; front is -y, up is +z):
  * THE SKULL: an ellipsoid 0.32 wide, 0.33 deep, 0.356 tall (a clay head, big for the body the way the rig page asks:
    the live man is 5.4 heads), the jaw tapering 30 percent to the chin, the nape pulled in to the neck.
  * THE FEATURES, each a measured bump or dent pushed forward on the face only: the brow ridge 14 mm over two eye
    sockets 22 mm deep, the nose growing from the bridge to a 32 mm tip with two nostril wings, the cheekbones 10 mm,
    the hollow under them, the upper and lower lip 10 and 11 mm, the philtrum, the chin 14 mm.
  * THE MOUTH IS A LINE THAT OPENS: the faces that straddle the mouth line are the inside of the mouth (a dark
    material); closed they are a one-pixel line between the lips, and when the jaw turns they stretch into the open
    mouth and fold back 15 mm into the head. That is the speak-along mouth on the rig's face.
  * THE EYES: two eyeballs 33 mm across sitting in the sockets, the white an off-bone (his 9/24: 'I like the eyes not
    being all white, less of a frog'), a big dark iris and a pupil; an upper and a lower lid as shells over them.
  * THE EARS, THE NECK: two flattened ears at the sides; a neck down into the collar (its own mesh, so the rig measures
    the head from chin to crown, not to the collar).
  * THE KIT, per person, every piece geometry on the head bone: the thug wears a knit cap (ribbed, a folded brim,
    the oxblood accent above the waist), a buzz at the sides and back, stubble on the jaw.
  * THE SHAPE KEYS (the rig's --expression renders the same head once per key, front-on): A, E, O, M (the four mouth
    shapes the speak-along needs: open, wide, round, closed) and Angry, Sad, Surprised (the brows, the lids, the mouth
    corners, the jaw), and Blink on the lids.

THE BODY: COOK THREE's thug (records/cook3/rig/thug.glb, built from the rig's man). The box head and its cap are
taken off above the collar and this head goes on the SAME head bone (Skeleton_neck_joint_2), so the body stills and
the portrait are one model. COOK THREE's file is read, never written; the output is this lane's own glb.

Run with Blender's Python (bpy 4.2; see tools/bohemia_direction_master_rig.py):
    v/bin/python tools/bohemia_portrait_the_head_from_the_model.py THUG records/portrait/rig/thug_head.glb
then the rig (unedited), then the sheet (plain python3):
    v/bin/python tools/bohemia_direction_master_rig.py records/portrait/rig/thug_head.glb records/target/portrait/rig/thug \
        --real-height 1.72 --family none --wear 0.6 --still pass --portrait 128 --class portrait \
        --expression A --expression E --expression O --expression M --expression Angry --expression Sad --expression Surprised
    python3 tools/bohemia_portrait_the_head_from_the_model.py --sheet THUG records/target/portrait/rig/thug records/target/portrait/PORTRAIT_THE_FACE_FROM_THE_SAME_MODEL.png

REUSE CHECK: the body, its bones, its gambeson, belt and pipe are COOK THREE's thug (from the rig's man), reused whole;
the render is DIRECTION's master rig, unedited, with its --portrait and --expression legs; the skin and the oxblood are
COOK THREE's thug colours; nothing new is drawn by hand.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the game's own shipping face of the same person
(records/target/taste/portrait_heads/brigand-thug.png, faceFor()/renderFace() at 64 px) and the thug's own body
through the rig (COOK THREE, records/target/cook3/rig/thug/); the rig's card of numbers; analog horror AH-01.
No reference game.
"""
import os, sys, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD_BONE = 'Skeleton_neck_joint_2'
NECK_BONE = 'Skeleton_neck_joint_1'


def lin(c):
    """an sRGB 0..255 colour to the renderer's linear 0..1"""
    f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1.0)


# COOK THREE's thug colours (tools/bohemia_cook3_the_tiers_through_the_rig.py), and the face's own few
SKIN = (150, 112, 88)
STUBBLE = (128, 100, 86)     # the jaw a step cooler and lower than the skin (a hue walk, not a darkening)
BUZZ = (46, 38, 32)
LIPS = (138, 92, 78)
MOUTH = (44, 22, 20)        # the inside of the mouth
SCLERA = (188, 174, 152)    # an off-bone, never white (his 9/24)
IRIS = (66, 46, 34)
PUPIL = (18, 14, 12)
OXBLOOD = (74, 28, 24)

PEOPLE = {
    'THUG': dict(body='records/cook3/rig/thug.glb', drop=('thug_cap', 'thug_cap_brim'), cut_z=1.165,
                 centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
                 gear='knit cap', hair='buzz', stubble=True, twin='records/target/taste/portrait_heads/brigand-thug.png',
                 cook3='records/target/cook3/rig/thug', sheet_out='records/target/portrait/PORTRAIT_THE_FACE_FROM_THE_SAME_MODEL.png',
                 palette="COOK THREE's thug colours, the cap his own blood 1 step",
                 kit='the knit cap ribbed with a folded brim',
                 # round 2: the cap is COOK THREE's own step (blood 1) on the same body, not round 1's off-palette oxblood,
                 # which read the head's top 10.9 values under its bottom (the guide's light row, D3) at SE
                 colours=dict(gear=('blood', 1))),
    # round 2: COOK THREE's poacher. His colours are steps of the style palette (field 5), read from COOK THREE's own
    # tier table; the face's few are steps too. The game's own poacher face has black curls out from under his head
    # gear and no beard, so the head keeps that: curls at the sides and the back, the field hat over them.
    'POACHER': dict(body='records/cook3/rig/poacher.glb', drop=('poacher_hat',), cut_z=1.165,
                    centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
                    gear='field hat', hair='curls', stubble=False, twin='records/target/taste/portrait_heads/brigand-poacher.png',
                    cook3='records/target/cook3/rig/poacher', sheet_out='records/target/portrait/PORTRAIT_THE_POACHERS_FACE_FROM_THE_SAME_MODEL.png',
                    palette='steps of the style palette (skin_deep 3, cloth_black 1, tape_masking 2: COOK THREE\'s poacher)',
                    kit='the field hat worn pushed back, a dark band, black curls out from under it at the sides and the back',
                    colours=dict(skin=('skin_deep', 3), lips=('skin_deep', 2), hair=('cloth_black', 1), gear=('tape_masking', 2),
                                 iris=('skin_deep', 1))),
}


def palette_step(role, i):
    """a step of a role's ramp in the style palette (records/target/BOHEMIA_STYLE_PALETTE.json, field 5)"""
    h = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles'][role]['ramp'][i].lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def colours(P):
    """the person's face colours: the thug's round-one constants, or a person's palette steps"""
    c = dict(skin=SKIN, stubble=STUBBLE, hair=BUZZ, lips=LIPS, gear=OXBLOOD, iris=IRIS)
    for k, v in P.get('colours', {}).items(): c[k] = palette_step(*v)
    return c

MOUTH_Z = -0.089     # the mouth line, metres from the head's centre
MOUTH_HALF = 0.033   # half the mouth's width
EYE_X, EYE_Z, EYE_R = 0.047, 0.004, 0.0165


def g2(x, z, x0, z0, sx, sz):
    return math.exp(-((x - x0) / sx) ** 2 - ((z - z0) / sz) ** 2)


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


def face_push(x, z):
    """how far forward (metres) the face stands at (x, z) relative to the head's centre: the features as shapes"""
    ax = abs(x)
    d = 0.0
    d += 0.014 * g2(ax, z, 0.045, 0.034, 0.042, 0.014)                    # the brow ridge
    d -= 0.022 * g2(ax, z, EYE_X, EYE_Z, 0.024, 0.017)                    # the eye sockets
    t = max(0.0, min(1.0, (0.022 - z) / 0.072))                            # the nose: bridge to tip
    nose = 0.032 * t ** 1.25 * math.exp(-(x / (0.010 + 0.011 * t)) ** 2)
    if z < -0.050: nose *= math.exp(-((z + 0.050) / 0.007) ** 2)
    d += nose
    d += 0.010 * g2(ax, z, 0.018, -0.047, 0.010, 0.008)                   # the nostril wings
    d += 0.010 * g2(ax, z, 0.074, -0.024, 0.030, 0.026)                   # the cheekbones
    d -= 0.006 * g2(ax, z, 0.066, -0.078, 0.024, 0.024)                   # the hollow under them
    d -= 0.003 * g2(x, z, 0.0, -0.068, 0.006, 0.009)                      # the philtrum
    d += 0.010 * g2(x, z, 0.0, -0.080, 0.032, 0.009)                      # the upper lip
    d += 0.011 * g2(x, z, 0.0, -0.099, 0.028, 0.009)                      # the lower lip
    d -= 0.005 * g2(x, z, 0.0, MOUTH_Z, 0.031, 0.004)                     # the line between them
    d += 0.014 * g2(x, z, 0.0, -0.146, 0.030, 0.020)                      # the chin
    return d


def build(who, out):
    import bpy, bmesh, mathutils
    from mathutils import Vector, Matrix
    P = PEOPLE[who]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, P['body']))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None: bpy.data.objects.remove(o, do_unlink=True)
        elif o.name in P['drop']: bpy.data.objects.remove(o, do_unlink=True)
    arm = next(o for o in sc.objects if o.type == 'ARMATURE')
    body = next(o for o in sc.objects if o.type == 'MESH' and o.name.startswith('Cesium_Man'))
    M = body.matrix_world.copy()

    # 1. THE BOX HEAD OFF, above the collar (the neck stays; the new neck tucks into it)
    bm = bmesh.new(); bm.from_mesh(body.data)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if (M @ f.calc_center_median()).z > P['cut_z']], context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    bm.to_mesh(body.data); bm.free()

    def mat(name, rgb, rough=0.9):
        m = bpy.data.materials.new(name); m.use_nodes = True
        b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        b.inputs['Base Color'].default_value = lin(rgb); b.inputs['Roughness'].default_value = rough
        return m

    C = Vector(P['centre']); RX, RY, RZ = P['radii']
    K = colours(P)

    # 2. THE SKULL: an ellipsoid with a jaw and a nape, the face pushed forward by its features
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=128, v_segments=100, radius=1.0)
    for v in bm.verts:
        d = v.co.normalized()
        lower = max(0.0, -d.z)
        x = d.x * RX * (1.0 - 0.30 * lower ** 1.5)
        y = d.y * RY
        z = d.z * RZ
        if d.y < 0: y *= 1.0 + 0.05 * lower                    # the chin a little forward
        else: y *= 1.0 - 0.35 * lower ** 1.3                   # the nape in toward the neck
        w = sstep(0.15, 0.55, -d.y)                             # the face is the front only
        y -= w * face_push(x, z)
        v.co = Vector((x, y, z))
    head_verts = len(bm.verts)
    # THE EARS: two flattened ovals at the sides, a little behind the middle, joined into the skull's mesh
    for s in (1, -1):
        mtx = Matrix.Translation((s * (RX * 0.97), 0.014, -0.012)) @ Matrix.Rotation(s * 0.25, 4, 'Z') @ Matrix.Diagonal((0.013, 0.030, 0.052, 1.0))
        bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=1.0, matrix=mtx)
    bm.normal_update()
    head = bpy.data.meshes.new('portrait_head'); bm.to_mesh(head); bm.free()
    ho = bpy.data.objects.new('portrait_head', head); sc.collection.objects.link(ho)
    ho.location = C
    for nm, rgb in (('skin', K['skin']), ('lips', K['lips']), ('mouth', MOUTH), ('stubble', K['stubble']), ('buzz', K['hair'])):
        head.materials.append(mat('portrait_%s_%s' % (who.lower(), nm), rgb, rough=0.85 if nm == 'lips' else 0.92))
    V = head.vertices
    lower_side = [V[i].co.z < MOUTH_Z for i in range(len(V))]
    for f in head.polygons:
        if f.vertices[0] >= head_verts: continue                  # the ears are skin
        c = f.center; x, y, z = c.x, c.y, c.z; front = y < -RY * 0.55
        sides = set(lower_side[i] for i in f.vertices)
        if front and len(sides) == 2 and abs(x) < MOUTH_HALF: f.material_index = 2          # the mouth line
        elif front and abs(x) < MOUTH_HALF + 0.004 and -0.108 < z < -0.072: f.material_index = 1   # the lips
        elif P['stubble'] and z < -0.058 + 0.04 * max(0.0, min(1.0, (y + 0.05) / 0.07)) and y < 0.03 and not (abs(x) < 0.03 and z > -0.072): f.material_index = 3   # the beard line rises from the cheek to the jaw's angle
        elif P['hair'] in ('buzz', 'curls') and ((z > -0.030 and y > 0.000) or (z > -0.020 and y > -0.026 and abs(x) > RX * 0.8)): f.material_index = 4   # the back, the sides behind the ear, a sideburn

    # 3. THE SHAPE KEYS: the jaw turns about the hinge in front of the ear; the mouth, the brows and the corners move
    ho.shape_key_add(name='Basis')
    base = [v.co.copy() for v in V]
    hinge = Vector((0.0, 0.030, -0.030))

    def jaw_w(p):
        if p.y > 0.05: return 0.0
        return sstep(0.0, 1.0, (MOUTH_Z + 0.004 - p.z) / 0.016) * sstep(0.0, 1.0, (0.05 - p.y) / 0.05)

    def mouth_w(p):   # the lips and the skin round them
        return g2(p.x, p.z, 0.0, MOUTH_Z, 0.050, 0.030) * (1.0 if p.y < -RY * 0.5 else 0.0)

    def brow_w(p, inner=False):
        if p.y > -RY * 0.5: return 0.0
        return g2(abs(p.x), p.z, 0.022 if inner else 0.050, 0.036, 0.022 if inner else 0.035, 0.020)

    def corner_w(p):
        return g2(abs(p.x), p.z, MOUTH_HALF, MOUTH_Z, 0.014, 0.014) * (1.0 if p.y < -RY * 0.5 else 0.0)

    def shape(name, jaw_deg=0.0, squeeze=1.0, forward=0.0, brow=0.0, inner=0.0, pinch=0.0, corners=0.0, press=0.0):
        k = ho.shape_key_add(name=name, from_mix=False)
        for i, p in enumerate(base):
            if i >= head_verts: k.data[i].co = p; continue
            q = p.copy()
            mw = mouth_w(p)
            if squeeze != 1.0 and mw: q.x = p.x * (1.0 + (squeeze - 1.0) * mw)
            if forward and mw: q.y -= forward * mw
            if press and mw:   # the lips pressed together and in
                q.z += press * mw * (1.0 if p.z < MOUTH_Z else -1.0); q.y += press * 1.5 * mw
            if corners: q.z += corners * corner_w(p)
            if brow: q.z += brow * brow_w(p)
            if inner: q.z += inner * brow_w(p, True)
            if pinch: q.x -= pinch * brow_w(p) * (1 if p.x > 0 else -1)
            w = jaw_w(p)
            if jaw_deg and w:
                a = -math.radians(jaw_deg) * w   # negative: the chin swings down and back
                r = q - hinge
                yz = (r.y * math.cos(a) + r.z * math.sin(a), -r.y * math.sin(a) + r.z * math.cos(a))
                q = Vector((q.x, hinge.y + yz[0], hinge.z + yz[1]))
            if jaw_deg and abs(p.x) < MOUTH_HALF and abs(p.z - MOUTH_Z) < 0.007 and p.y < -RY * 0.5:
                q.y += 0.018 * min(1.0, jaw_deg / 12.0)     # the inside of the open mouth folds back into the head
            k.data[i].co = q
        return k

    shape('A', jaw_deg=20.0)
    shape('E', jaw_deg=4.0, squeeze=1.16, corners=0.003)
    shape('O', jaw_deg=14.0, squeeze=0.70, forward=0.007)
    shape('M', press=0.0025)
    shape('Angry', jaw_deg=2.0, brow=-0.008, inner=-0.006, pinch=0.004, corners=-0.004, squeeze=0.94)
    shape('Sad', jaw_deg=2.0, brow=-0.003, inner=0.009, corners=-0.008)
    shape('Surprised', jaw_deg=16.0, brow=0.012, inner=0.004, squeeze=0.86)

    # 4. THE EYES AND THE LIDS (the lids carry the same expression keys, so the rig turns them together)
    def surf_y(x, z):
        dz = z / RZ; dx = x / RX; r = max(0.0, 1.0 - dx * dx - dz * dz)
        return -RY * math.sqrt(r) - face_push(x, z)
    eye_cy = surf_y(EYE_X, EYE_Z) + 0.006 + EYE_R * 0.35
    bm = bmesh.new()
    for s in (1, -1):
        bmesh.ops.create_uvsphere(bm, u_segments=28, v_segments=20, radius=EYE_R, matrix=Matrix.Translation((s * EYE_X, eye_cy, EYE_Z)))
    eyes = bpy.data.meshes.new('portrait_head_eyes'); bm.to_mesh(eyes); bm.free()
    eo = bpy.data.objects.new('portrait_head_eyes', eyes); sc.collection.objects.link(eo); eo.location = C
    for nm, rgb in (('sclera', SCLERA), ('iris', K['iris']), ('pupil', PUPIL)):
        eyes.materials.append(mat('portrait_%s_%s' % (who.lower(), nm), rgb, rough=0.6))
    for f in eyes.polygons:
        cx = EYE_X if f.center.x > 0 else -EYE_X
        d = (f.center - Vector((cx, eye_cy, EYE_Z))).normalized()
        ang = math.degrees(math.acos(max(-1.0, min(1.0, -d.y))))
        f.material_index = 2 if ang < 13 else (1 if ang < 31 else 0)

    LR = EYE_R * 1.12
    bm = bmesh.new()
    for s in (1, -1):
        c0 = Vector((s * EYE_X, eye_cy, EYE_Z))
        bmesh.ops.create_uvsphere(bm, u_segments=28, v_segments=20, radius=LR, matrix=Matrix.Translation(c0))
    bm.verts.ensure_lookup_table()
    keep = []
    for f in bm.faces:
        cx = EYE_X if f.calc_center_median().x > 0 else -EYE_X
        d = (f.calc_center_median() - Vector((cx, eye_cy, EYE_Z))).normalized()
        if d.y < 0.35 and (d.z > 0.30 or d.z < -0.62): keep.append(f)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f not in keep], context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    lids = bpy.data.meshes.new('portrait_head_lids'); bm.to_mesh(lids); bm.free()
    lo = bpy.data.objects.new('portrait_head_lids', lids); sc.collection.objects.link(lo); lo.location = C
    lids.materials.append(head.materials[0])   # the lids are the face's own skin (one material, field 5's cap)
    so = lo.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.002; so.offset = 1
    bpy.context.view_layer.objects.active = lo
    for o in sc.objects: o.select_set(o is lo)
    bpy.ops.object.modifier_apply(modifier='rim')
    lo.shape_key_add(name='Basis')
    lbase = [v.co.copy() for v in lids.vertices]

    def lid_key(name, upper_deg, lower_deg=0.0):
        k = lo.shape_key_add(name=name, from_mix=False)
        for i, p in enumerate(lbase):
            cx = EYE_X if p.x > 0 else -EYE_X; c0 = Vector((cx, eye_cy, EYE_Z)); r = p - c0
            a = math.radians(upper_deg if r.z > 0 else lower_deg)
            k.data[i].co = c0 + Vector((r.x, r.y * math.cos(a) + r.z * math.sin(a), -r.y * math.sin(a) + r.z * math.cos(a)))
    for nm in ('A', 'E', 'O', 'M'): lid_key(nm, 0.0)
    lid_key('Angry', 16.0, -6.0)
    lid_key('Sad', 12.0)
    lid_key('Surprised', -14.0, 4.0)
    lid_key('Blink', 52.0, -10.0)

    # 5. THE NECK: its own mesh (so the head is measured chin to crown), into the collar
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=24, radius1=0.060, radius2=0.064, depth=0.16,
                          matrix=Matrix.Translation((0.0, 0.020, -0.180)))
    neck = bpy.data.meshes.new('portrait_neck'); bm.to_mesh(neck); bm.free()
    no = bpy.data.objects.new('portrait_neck', neck); sc.collection.objects.link(no); no.location = C
    neck.materials.append(head.materials[0])

    # 6. THE KIT: the knit cap, the skull's own skin lifted, ribbed, with a folded brim (the oxblood above the waist)
    objs = [ho, eo, lo, no]
    if P['gear'] == 'knit cap':
        def line(y): return 0.080 - 0.085 * sstep(-0.12, 0.14, y)
        bm = bmesh.new(); bm.from_mesh(head)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or f.calc_center_median().z < line(f.calc_center_median().y) - 0.004], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = v.co; ln = line(p.y); brim = p.z < ln + 0.034
            ang = math.atan2(p.y, p.x)
            rib = 0.0018 * max(0.0, math.cos(ang * 0.165 / 0.011)) ** 4 if not brim else 0.0   # a rib every 11 mm round the crown
            t = (0.024 if brim else 0.012) - rib
            if brim and abs(p.z - (ln + 0.034)) < 0.004: t -= 0.004                         # the fold's crease
            v.co = p + v.normal * t
        for f in bm.faces: f.material_index = 0
        cap = bpy.data.meshes.new('portrait_cap'); bm.to_mesh(cap); bm.free()
        cap.materials.clear(); cap.materials.append(mat('portrait_%s_cap' % who.lower(), K['gear']))
        co_ = bpy.data.objects.new('portrait_cap', cap); sc.collection.objects.link(co_); co_.location = C
        bpy.context.view_layer.objects.active = co_
        for o in sc.objects: o.select_set(o is co_)
        sd = co_.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.008; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(co_)
    if P['gear'] == 'field hat':
        # COOK THREE's field hat (the tier's silhouette feature), rebuilt on this skull: a crown pinched at the top and
        # dented front to back, a brim that droops front and back. Sized to the modelled head, so the brim clears the
        # eyes from the portrait's 80-degree camera.
        bm = bmesh.new()
        base_z, crown_h, cr = 0.098, 0.140, RX * 1.02
        bmesh.ops.create_cone(bm, cap_ends=True, segments=48, radius1=cr, radius2=cr, depth=crown_h,
                              matrix=Matrix.Translation((0.0, 0.006, base_z + crown_h / 2)))
        bmesh.ops.subdivide_edges(bm, edges=[e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 0.01], cuts=6, use_grid_fill=True)
        for v in bm.verts:
            t = (v.co.z - base_z) / crown_h
            if t > 0.55:
                k = (t - 0.55) / 0.45
                v.co.x *= 1.0 - 0.20 * k; v.co.y = 0.006 + (v.co.y - 0.006) * (1.0 - 0.13 * k)
            if t > 0.98: v.co.z -= 0.024 * max(0.0, 1 - abs(v.co.x) / (RX * 0.45))       # the dent, front to back
            if 0.08 < t < 0.24: v.co.x *= 1.012; v.co.y = 0.006 + (v.co.y - 0.006) * 1.012  # the band
        bmesh.ops.create_cone(bm, cap_ends=True, segments=64, radius1=RX * 1.42, radius2=RX * 1.42, depth=0.010,
                              matrix=Matrix.Translation((0.0, 0.006, base_z + 0.010)))
        bm.verts.ensure_lookup_table()
        for v in bm.verts:
            r = math.hypot(v.co.x, v.co.y - 0.006)
            if r > cr * 1.02:   # the brim: down at the front and the back, a little up at the sides
                d = (r - cr) / (RX * 1.42 - cr); ang = math.atan2(v.co.y - 0.006, v.co.x)
                v.co.z -= 0.030 * d * d * abs(math.sin(ang)) - 0.008 * d * abs(math.cos(ang))
        for v in bm.verts: v.co.z -= 0.16 * (v.co.y - 0.006)   # worn pushed back (cycle 2: level, the front brim hid both eyes)
        bm.normal_update()
        hat = bpy.data.meshes.new('portrait_hat'); bm.to_mesh(hat); bm.free()
        for f in hat.polygons: f.use_smooth = True
        hat.materials.append(mat('portrait_%s_hat' % who.lower(), K['gear']))
        bmat = mat('portrait_%s_band' % who.lower(), K['hair'])
        hat.materials.append(bmat)
        for f in hat.polygons:
            if math.hypot(f.center.x, f.center.y - 0.006) < cr * 1.03 and base_z + 0.012 < f.center.z < base_z + 0.040: f.material_index = 1
        ha = bpy.data.objects.new('portrait_hat', hat); sc.collection.objects.link(ha); ha.location = C
        objs.append(ha)
    if P['hair'] == 'curls':
        # BLACK CURLS out from under the hat at the sides and the back (the game's own poacher face): the skull's own
        # faces lifted 16 mm, every curl a lump 9 mm high on a 22 mm grid, nothing over the face or the ears' front
        bm = bmesh.new(); bm.from_mesh(head)
        def hair_at(c):
            return c.z > -0.050 + 0.06 * max(0.0, min(1.0, (-c.y) / 0.08)) and (c.y > -0.05 or abs(c.x) > RX * 0.82)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or not hair_at(f.calc_center_median())], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = v.co; ang = math.atan2(p.y, p.x)
            lump = (0.5 + 0.5 * math.cos(2 * math.pi * ang * RX / 0.022)) * (0.5 + 0.5 * math.cos(2 * math.pi * p.z / 0.022))
            v.co = p + v.normal * (0.012 + 0.009 * lump ** 0.7)
        for f in bm.faces: f.material_index = 0; f.smooth = True
        hm = bpy.data.meshes.new('portrait_curls'); bm.to_mesh(hm); bm.free()
        hm.materials.clear(); hm.materials.append(head.materials[4])
        hc = bpy.data.objects.new('portrait_curls', hm); sc.collection.objects.link(hc); hc.location = C
        objs.append(hc)

    # 7. SKIN IT: every piece on the head bone; the neck blends down onto the neck bone
    # (round 2: the head's offset is baked into every mesh first; left as an object location, the exporter dropped it
    # on the pieces added after the skull, and the neck, the hat and the curls landed at the body's feet)
    bpy.context.view_layer.update()
    for o in objs:
        o.data.transform(Matrix.Translation(C), shape_keys=True); o.location = (0.0, 0.0, 0.0)
    bpy.context.view_layer.update()
    for o in objs:
        mw = o.matrix_world.copy(); o.parent = arm; o.matrix_world = mw
        vh = o.vertex_groups.new(name=HEAD_BONE)
        if o is no:
            vn = o.vertex_groups.new(name=NECK_BONE)
            for v in o.data.vertices:
                w = sstep(C.z - 0.24, C.z - 0.14, v.co.z); vh.add([v.index], w, 'REPLACE'); vn.add([v.index], 1.0 - w, 'REPLACE')
        else:
            vh.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
        am = o.modifiers.new('Armature', 'ARMATURE'); am.object = arm
        o.data.update()

    os.makedirs(os.path.dirname(out), exist_ok=True)
    for o in sc.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_skins=True, export_animations=True, export_morph=True, export_morph_normal=False, export_apply=False, use_selection=False)
    stats = dict(person=who, model=os.path.relpath(out, ROOT), from_body=P['body'], dropped=list(P['drop']), cut_above_z=P['cut_z'],
                 head=dict(centre=P['centre'], radii=P['radii'], mouth_z=MOUTH_Z, mouth_half=MOUTH_HALF, eye=[EYE_X, EYE_Z, EYE_R], bone=HEAD_BONE),
                 shape_keys=[k.name for k in ho.data.shape_keys.key_blocks][1:], lid_keys=[k.name for k in lo.data.shape_keys.key_blocks][1:],
                 gear=P['gear'], hair=P['hair'], stubble=P['stubble'],
                 meshes={o.name: len(o.data.vertices) for o in sc.objects if o.type == 'MESH'},
                 materials={m.name: [round(x, 4) for x in next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value[:3]] for m in bpy.data.materials if m.use_nodes})
    json.dump(stats, open(out.replace('.glb', '.json'), 'w'), indent=1)
    print(json.dumps(stats, indent=1))


def sheet(who, frames, out):
    """the portrait three ways and the face performing, at 1:1 and 2x, beside the game's own face of the same person;
    the body's S still with the new head beside COOK THREE's box-head thug; the caption names the pixel size, the
    palette and the light (rule 114c)"""
    from PIL import Image, ImageDraw
    P = PEOPLE[who]
    BG = (22, 21, 20); PANEL = (58, 52, 46); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)
    pj = json.load(open(os.path.join(frames, 'portrait.json'))); rig = json.load(open(os.path.join(frames, 'rig.json')))
    op = lambda r: Image.open(os.path.join(ROOT, r)).convert('RGBA')
    por = [op(f) for f in pj['files']]
    ex = [(k, op(v)) for k, v in pj['expression_files'].items()]
    twin = Image.open(os.path.join(ROOT, P['twin'])).convert('RGBA')
    s_new = op(rig['files'][rig['facings'].index('S')])
    s_old = Image.open(os.path.join(ROOT, P['cook3'], 'rig_S.png')).convert('RGBA')
    pw, ph = por[0].size
    Wd = max(24 + 8 * (pw + 8), 24 + 3 * (2 * pw + 12) + 2 * twin.width + 40, 24 + 5 * (2 * pw + 12), 1100)
    H = 90 + (2 * ph + 34) + (ph + 34) + (2 * ph + 34) + max(s_new.height, s_old.height) * 2 + 140
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), 'PORTRAIT: THE FACE FROM THE SAME MODEL (rule 115c). The %s\'s head MODELLED and rendered close through DIRECTION\'s rig; the body below is the same model. A PLACEHOLDER: nothing is final before the moodboard.' % who, fill=INK)
    d.text((12, 24), 'head %d px chin to crown (%.3f m, %s), camera tilt 80, one pixel size, block 1 | palette: %s + the face\'s own (bone eye whites, never white) | ONE light: the rig\'s sun, upper left, above' % (pj['head_px'], pj['head_m'], pj['head_how'].split(':')[0], P['palette']), fill=DIM)
    d.text((12, 38), 'every feature is geometry: the brow ridge 14 mm over sockets 22 mm deep, a 32 mm nose, lips, chin, ears, eyeballs and lids; %s; the mouth opens on the jaw\'s hinge' % P['kit'], fill=DIM)

    def put(im, x, y, k=1):
        b = im.resize((im.width * k, im.height * k), Image.NEAREST) if k > 1 else im
        S.paste(PANEL, (x, y, x + b.width, y + b.height)); S.paste(b, (x, y), b); return b.width
    y = 60; d.text((12, y), 'THE HEAD, THREE WAYS (S, SE, SW) at 2x, then HIS FACE TODAY: the game\'s own %s face (renderFace() at 64 px) at 2x' % who, fill=HEAD); y += 14
    x = 12
    for im, lb in zip(por, pj['facings']): x += put(im, x, y, 2) + 12
    x += 16; tx = x; x += put(twin, x, y, 2) + 12; d.text((tx, y + 2 * twin.height + 2), 'today (64 px)', fill=DIM)
    y += 2 * ph + 20
    d.text((12, y), 'THE FACE PERFORMS, the same head front-on at 1:1: rest, the speak-along mouth (A open, E wide, O round, M closed), then Angry, Sad, Surprised', fill=HEAD); y += 14
    x = 12
    for k, im in [('rest', por[0])] + ex: put(im, x, y); d.text((x, y + ph + 2), k, fill=DIM); x += pw + 8
    y += ph + 20
    d.text((12, y), 'THE SAME AT 2x: rest, A, O, Angry, Surprised', fill=HEAD); y += 14
    x = 12
    pick = dict(ex)
    for k in ('rest', 'A', 'O', 'Angry', 'Surprised'):
        im = por[0] if k == 'rest' else pick.get(k)
        if im is None: continue
        x += put(im, x, y, 2) + 12
    y += 2 * ph + 20
    d.text((12, y), 'ONE MODEL: the body\'s S still with this head (left) beside COOK THREE\'s %s with the test body\'s box head (right), at 2x' % who.lower(), fill=HEAD); y += 14
    x = 12; x += put(s_new, x, y, 2) + 24; put(s_old, x, y, 2)
    y += 2 * max(s_new.height, s_old.height) + 10
    c = rig.get('card', {})
    d.text((12, y), 'the rig\'s card on the body\'s S still (%s): %s; portrait colours across the set %s; model %s' % (c.get('family'), c.get('verdict'), pj.get('colours'), pj.get('model')), fill=DIM)
    for i, r in enumerate(c.get('rows', [])): d.text((12 + (i % 4) * 260, y + 16 + 14 * (i // 4)), r, fill=(150, 144, 132))
    os.makedirs(os.path.dirname(out), exist_ok=True); S.save(out); print('sheet', out, S.size)


if __name__ == '__main__':
    if sys.argv[1] == '--sheet':
        sheet(sys.argv[2].upper(), sys.argv[3], sys.argv[4])
    else:
        build(sys.argv[1].upper(), os.path.abspath(sys.argv[2]))
