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


# [every face from the same model] (rule 115h, HIS FIRST STAR on the poacher's face): the starred recipe on the thirteen
# faces RUN TWO's crew and scavenge screens show (YOU and the twelve cast looks the roster hands out, engine/bohemia_roster.js
# manOf). None of them had a model, so each BODY is built by CHARACTER's own tool from the look's worn list
# (tools/bohemia_character_the_thirteen_through_the_rig.py, imported, never edited: a LOOKS entry is added in memory and its
# build() runs), and the head goes on that body's head bone exactly as the poacher's did. Skin is the person's own skin
# from the game's 64 px face (sampled, then a step of the style palette, two steps lighter than the sample on the deep
# skins because the rig's one sun and the dust pass take about two steps off a face); hair cut and head gear are the
# look's worn list (fight_people.json); colours of the cloth are the worn names read as palette colours.
# body keys are CHARACTER's spec (shirt, coat, mantle, cape, trousers, shoes); hair/gear are this tool's head pieces.
CREW = {
    'YOU': dict(look='you', name='YOU', skin=('skin_light', 3), lips=('skin_light', 2), hair='long', hair_c=('clay_bone', 4), gear=None,
                iris=('clay_teal', 2), worn='the player as he stands: platinum hair, black leather jacket over a black longsleeve',
                body=dict(shirt=dict(colour=(30, 28, 28), sleeve='long'), coat=dict(colour=(26, 24, 24), hem='HIP', flare=0.01, thick=0.014, v=0.05, front_open=0.35))),
    # (cycle 2, the NOT VIBE CODED light row, D3: a near-black top over a paler shirt read as lit from below on 5 of 39
    # renders; the four tops lifted one step, as the thug's cap was in round 2)
    'CAST_LONGCOAT': dict(look='cast_longcoat', skin=('skin_deep', 2), hair='taper', hair_c=('cloth_black', 2), gear=None,
                          body=dict(shirt=dict(colour=(36, 34, 34), sleeve='long'), coat=dict(colour=(92, 78, 60), hem='ANKLE', flare=0.05, thick=0.016, v=0.06, front_open=0.5, back_slit=0.45))),
    'CAST_BAREARMS': dict(look='cast_barearms', skin=('skin_deep', 2), hair='coil', hair_c=('cloth_black', 1), gear=None,
                          body=dict(shirt=dict(colour=(48, 46, 44), sleeve='none'))),
    'CAST_PACK': dict(look='cast_pack', skin=('skin_deep', 2), hair='taper', hair_c=('tape_masking', 0), gear='knit cap', gear_c=('tape_grey', 1),
                      body=dict(shirt=dict(colour=(84, 88, 60), sleeve='long'), mantle=dict(colour=(73, 78, 54), low=0.88))),
    'CAST_SKIRT': dict(look='cast_skirt', skin=('skin_mid', 2), hair='long', hair_c=('tape_masking', 1), gear=None,
                       body=dict(shirt=dict(colour=(184, 176, 156), sleeve='short'))),
    'CAST_WIDEBRIM': dict(look='cast_widebrim', skin=('skin_deep', 2), hair='taper', hair_c=('tape_grey', 2), gear='cone hat', gear_c=('tape_masking', 2),
                          body=dict(shirt=dict(colour=(118, 100, 74), sleeve='long'))),
    'CAST_CAPE': dict(look='cast_cape', skin=('skin_deep', 3), hair='shag', hair_c=('tape_grey', 2), gear=None,
                      body=dict(shirt=dict(colour=(184, 168, 134), sleeve='long'), cape=dict(colour=(66, 62, 58), hem='KNEE', top=1.12))),
    'CAST_APRON': dict(look='cast_apron', skin=('skin_deep', 3), hair='taper', hair_c=('tape_grey', 1), gear=None,
                       body=dict(shirt=dict(colour=(150, 80, 48), sleeve='long'))),
    'CAST_PONCHO': dict(look='cast_poncho', skin=('skin_mid', 2), hair='long', hair_c=('tape_grey', 2), gear=None,
                        body=dict(shirt=dict(colour=(48, 46, 44), sleeve='none'), mantle=dict(colour=(104, 40, 36), low=0.78, thick=0.03))),
    'CAST_BEDROLL': dict(look='cast_bedroll', skin=('skin_mid', 1), hair='taper', hair_c=('tape_masking', 0), gear='work cap', gear_c=('tape_masking', 1),
                         body=dict(shirt=dict(colour=(118, 100, 74), sleeve='long'))),
    'CAST_SHORTS': dict(look='cast_shorts', skin=('skin_deep', 3), hair='coil', hair_c=('tape_masking', 2), gear=None,
                        body=dict(shirt=dict(colour=(184, 176, 156), sleeve='short'))),
    'CAST_SATCHEL': dict(look='cast_satchel', skin=('skin_deep', 2), hair='taper', hair_c=('clay_rust', 1), gear='watch cap', gear_c=('cloth_black', 3),
                         body=dict(shirt=dict(colour=(84, 88, 60), sleeve='long'))),
    # (cycle 1: skin_mid 1 under a clay_rust 1 beanie and orange hair read as one red-brown lump; a step lighter skin and the
    # beanie a deep oxblood, clay_rust 1 (blood 0 failed the light row at SE, cycle 2), part the three)
    'CAST_SHORTCOAT': dict(look='cast_shortcoat', skin=('skin_mid', 2), hair='long', hair_c=('clay_rust', 2), gear='slouch beanie', gear_c=('clay_rust', 1),
                           body=dict(shirt=dict(colour=(30, 28, 28), sleeve='long'), coat=dict(colour=(70, 48, 38), hem='HIP', flare=0.01, thick=0.016, v=0.05, front_open=0.4))),
}
CREW_BODIES = 'records/portrait/rig/crew/bodies'
for _k, _c in CREW.items():
    _tag = 'crew_' + _c['look']
    PEOPLE[_k] = dict(body='%s/%s.glb' % (CREW_BODIES, _tag), drop=tuple('%s_%s' % (_tag, x) for x in ('hair', 'hair_fall', 'hat', 'hat_brim', 'visor')),
                      cut_z=1.165, centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
                      gear=_c['gear'], hair=_c['hair'], stubble=False, look=_c['look'], crew=True,
                      twin='slices/fight_people/%s.webp' % _c['look'], twin_face=True,
                      palette='steps of the style palette (skin %s %d, hair %s %d%s)' % (_c['skin'] + _c['hair_c'] + ((', gear %s %d' % _c['gear_c']) if _c.get('gear') else '',)),
                      kit='%s; %s' % (_c['gear'] or 'bare head', {'long': 'a long cut to the jaw', 'taper': 'a short taper', 'coil': 'a coil crown', 'shag': 'a choppy shag'}[_c['hair']]),
                      colours=dict(skin=_c['skin'], lips=_c.get('lips', (_c['skin'][0], max(0, _c['skin'][1] - 1))), hair=_c['hair_c'],
                                   gear=_c.get('gear_c', _c['hair_c']), iris=_c.get('iris', ('skin_deep', 1)),
                                   stubble=(_c['skin'][0], max(0, _c['skin'][1] - 1))))


def crew_body(who, outdir):
    """CHARACTER's tool builds the look's body (its LOOKS gains this entry in memory; its file is never written)"""
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_character_the_thirteen_through_the_rig as CH
    c = CREW[who]; spec = {}
    for k, v in c['body'].items():
        v = dict(v)
        if isinstance(v.get('hem'), str): v['hem'] = getattr(CH, v['hem'])
        spec[k] = v
    spec.setdefault('trousers', dict(colour=(40, 38, 38), wide=0.012)); spec.setdefault('shoes', dict(colour=(40, 36, 34), kind='boot', top=0.2))
    name = 'crew_' + c['look']
    CH.LOOKS[name] = dict(order=99, shape='crew: ' + c['look'], dials=dict(height=0.0, belly=0.0, shoulders=0.0, hips=0.0),
                          worn=c.get('worn', c['look']), hair=dict(style='taper', colour=CH.HAIR_DARK), **spec)
    CH.build(name, os.path.join(ROOT, outdir))


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

    def scalp(x, y, z):
        """where the hair grows on the skull: the poacher's and the thug's back and sides (rounds 1 and 2), and for the
        crew's cuts the crown above a hairline 70 mm over the head's centre at the brow, the long cuts down to the jaw"""
        st = P['hair']
        back = (z > -0.030 and y > 0.000) or (z > -0.020 and y > -0.026 and abs(x) > RX * 0.8)
        if st in ('buzz', 'curls'): return back
        # the front hairline is ragged, never a ruler line (cycle 1: a smooth edge read as a helmet's rim): strands every
        # 13 mm hang 6 to 22 mm lower on a long cut (a fringe), 4 mm on a short one
        # (cycle 2: a 26 mm pitch stepped on the skull's rows into a saw; 40 mm clumps read as a fringe)
        jag = (0.018 if st in ('long', 'shag') else 0.004) * max(0.0, math.cos(math.pi * x / 0.040)) ** 2 * (0.7 + 0.3 * math.cos(2 * math.pi * x / 0.071))
        crown = z > 0.064 - jag - 0.040 * sstep(-0.10, 0.00, y)
        if st in ('long', 'shag'):
            return back or crown or (abs(x) > RX * 0.74 and y > -0.040 and z > -0.118) or (y > 0.010 and z > -0.165)
        return back or crown
    lower_side = [V[i].co.z < MOUTH_Z for i in range(len(V))]
    for f in head.polygons:
        if f.vertices[0] >= head_verts: continue                  # the ears are skin
        c = f.center; x, y, z = c.x, c.y, c.z; front = y < -RY * 0.55
        sides = set(lower_side[i] for i in f.vertices)
        if front and len(sides) == 2 and abs(x) < MOUTH_HALF: f.material_index = 2          # the mouth line
        elif front and abs(x) < MOUTH_HALF + 0.004 and -0.108 < z < -0.072: f.material_index = 1   # the lips
        elif P['stubble'] and z < -0.058 + 0.04 * max(0.0, min(1.0, (y + 0.05) / 0.07)) and y < 0.03 and not (abs(x) < 0.03 and z > -0.072): f.material_index = 3   # the beard line rises from the cheek to the jaw's angle
        elif scalp(x, y, z): f.material_index = 4   # the back, the sides behind the ear, a sideburn (and the crown on the crew's cuts)

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
    CAP = {'knit cap': 0.0, 'watch cap': 0.020, 'slouch beanie': 0.0, 'work cap': 0.012}
    def cap_line(y): return 0.080 - 0.085 * sstep(-0.12, 0.14, y) + CAP.get(P['gear'], 0.0)
    if P['gear'] in ('watch cap', 'slouch beanie', 'work cap'):
        # the crew's caps: the knit cap's method (the skull's own skin lifted above a line), a watch cap rolled higher on the
        # brow, a slouch beanie with its crown hanging off the back, a work cap with a flat crown and a visor
        k = P['gear']
        bm = bmesh.new(); bm.from_mesh(head)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or f.calc_center_median().z < cap_line(f.calc_center_median().y) - 0.004], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = v.co; ln = cap_line(p.y); brim = k != 'work cap' and p.z < ln + 0.030
            ang = math.atan2(p.y, p.x)
            rib = 0.0016 * max(0.0, math.cos(ang * 0.165 / 0.011)) ** 4 if (k != 'work cap' and not brim) else 0.0
            t = (0.022 if brim else (0.009 if k == 'work cap' else 0.012)) - rib
            if brim and abs(p.z - (ln + 0.030)) < 0.004: t -= 0.004
            if k == 'slouch beanie': t += 0.034 * sstep(-0.02, 0.15, p.y) * sstep(ln + 0.03, 0.17, p.z)   # the slouch off the back
            v.co = p + v.normal * t
        cap = bpy.data.meshes.new('portrait_cap'); bm.to_mesh(cap); bm.free()
        cap.materials.clear(); cap.materials.append(mat('portrait_%s_cap' % who.lower(), K['gear']))
        for f in cap.polygons: f.material_index = 0; f.use_smooth = True
        co_ = bpy.data.objects.new('portrait_cap', cap); sc.collection.objects.link(co_); co_.location = C
        bpy.context.view_layer.objects.active = co_
        for o in sc.objects: o.select_set(o is co_)
        sd = co_.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.008; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(co_)
        if k == 'work cap':   # the visor: a flat oval out over the brow, tipped down 10 degrees, the back half inside the crown
            bm = bmesh.new()
            vz = cap_line(-0.16) + 0.006
            bmesh.ops.create_cone(bm, cap_ends=True, segments=40, radius1=1.0, radius2=1.0, depth=1.0,
                                  matrix=Matrix.Translation((0.0, -RY * 0.92, vz)) @ Matrix.Rotation(math.radians(-10), 4, 'X') @ Matrix.Diagonal((RX * 0.78, 0.085, 0.007, 1.0)))
            vm = bpy.data.meshes.new('portrait_visor'); bm.to_mesh(vm); bm.free()
            vm.materials.append(cap.materials[0])
            vo = bpy.data.objects.new('portrait_visor', vm); sc.collection.objects.link(vo); vo.location = C
            objs.append(vo)
    if P['gear'] == 'cone hat':
        # the rice farmer's hat (CHARACTER's cone, sized to this head): a shallow straw cone wider than the shoulders' half,
        # its point over the crown, the weave pressed in as rings every 35 mm, its rim well above the eyes (cycle 1: 1.9 x the
        # head's width ran off the portrait's frame on both sides; 1.5 keeps the cone and the face in one square)
        bm = bmesh.new()
        top = RZ - 0.030 + 0.065
        bmesh.ops.create_cone(bm, cap_ends=True, segments=48, radius1=RX * 1.5, radius2=0.012, depth=0.11,
                              matrix=Matrix.Translation((0.0, 0.006, top)))
        bmesh.ops.subdivide_edges(bm, edges=[e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 0.01], cuts=8)
        for v in bm.verts:
            r = math.hypot(v.co.x, v.co.y - 0.006)
            if v.co.z > top - 0.06: v.co.z -= 0.004 * max(0.0, math.cos(2 * math.pi * r / 0.035)) ** 6
        bm.normal_update()
        hat = bpy.data.meshes.new('portrait_hat'); bm.to_mesh(hat); bm.free()
        hat.materials.append(mat('portrait_%s_hat' % who.lower(), K['gear']))
        ha = bpy.data.objects.new('portrait_hat', hat); sc.collection.objects.link(ha); ha.location = C
        bpy.context.view_layer.objects.active = ha
        for o in sc.objects: o.select_set(o is ha)
        sd = ha.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.010; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(ha)
    if P['hair'] in ('taper', 'long', 'shag', 'coil'):
        # THE CREW'S CUTS, the curls' method: the skull's own scalp faces lifted. A taper is a 3 to 8 mm shell combed
        # front to back; a long cut a 10 mm shell that fills to 20 mm toward the jaw; a shag the long cut in choppy lumps;
        # a coil crown the poacher's curls over the whole scalp. Under a cap only what shows below its line is kept.
        st = P['hair']; capped = P['gear'] in CAP or P['gear'] == 'knit cap'
        bm = bmesh.new(); bm.from_mesh(head)
        def keep(c):
            if not scalp(c.x, c.y, c.z): return False
            return not (capped and c.z > cap_line(c.y) + 0.010)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or not keep(f.calc_center_median())], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = v.co; ang = math.atan2(p.y, p.x)
            # strands: combed front to back over the crown, hanging down the sides and the back (cycle 1's 2.5 mm grooves
            # vanished at 128 px; 5 mm on a 12 mm pitch read as hair by the sun's own light)
            comb = 0.005 * max(0.0, math.cos(2 * math.pi * p.x / 0.012)) ** 3 if p.z > 0.08 else 0.005 * max(0.0, math.cos(2 * math.pi * ang * RX / 0.012)) ** 3
            lump = (0.5 + 0.5 * math.cos(2 * math.pi * ang * RX / 0.022)) * (0.5 + 0.5 * math.cos(2 * math.pi * p.z / 0.022))
            if st == 'taper': t = 0.003 + 0.006 * sstep(0.02, 0.13, p.z) - comb
            elif st == 'coil':
                # (cycle 1: the curls' grid lined up in rings round the crown and read as a knit cap) coils on two
                # crossed, tilted pitches and a third that breaks the rows
                a1 = ang * RX + 0.6 * p.z; a2 = ang * RX - 0.6 * p.z
                coil = (0.5 + 0.5 * math.cos(2 * math.pi * a1 / 0.019)) * (0.5 + 0.5 * math.cos(2 * math.pi * a2 / 0.023)) * (0.75 + 0.25 * math.cos(2 * math.pi * (p.x + 1.7 * p.z) / 0.031))
                t = 0.011 + 0.010 * coil ** 0.8
            else:
                t = 0.007 + 0.012 * sstep(0.0, -0.13, p.z) - comb
                if st == 'shag': t += 0.008 * lump ** 1.5
            v.co = p + v.normal * t
        for f in bm.faces: f.material_index = 0; f.smooth = True
        hm = bpy.data.meshes.new('portrait_hair'); bm.to_mesh(hm); bm.free()
        hm.materials.clear(); hm.materials.append(head.materials[4])
        hh = bpy.data.objects.new('portrait_hair', hm); sc.collection.objects.link(hh); hh.location = C
        bpy.context.view_layer.objects.active = hh
        for o in sc.objects: o.select_set(o is hh)
        sd = hh.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.004; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(hh)
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

    # 6b. STRAND NORMALS ON A DARK HEAD (CHARACTER's 8b, reused for the crew): the rig's source pass dusts every up-facing
    # surface toward a pale warm dust, so black hair and a charcoal cap rendered grey (cycle 1, measured on the longcoat and
    # the barearms). A strand's normal lies across the head, never straight up: the dark pieces' normals are tilted out
    # from the skull's axis, z held under 0.5, as CHARACTER measured. The real fix is the rig's per-material wear (routed).
    if P.get('crew'):
        for o in objs:
            if o.name not in ('portrait_hair', 'portrait_cap') or not o.data.materials: continue
            bc = next(n for n in o.data.materials[0].node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value
            if 0.2126 * bc[0] + 0.7152 * bc[1] + 0.0722 * bc[2] > 0.12: continue
            ns = []
            for v in o.data.vertices:
                n = v.normal.copy(); r = Vector((v.co.x, v.co.y, 0.0))
                r = r.normalized() if r.length > 1e-4 else Vector((0, 1, 0))
                t = max(0.0, n.z - 0.5) / 0.5
                m = n.lerp(r, t); m.z = min(m.z, 0.5); m.normalize(); ns.append(tuple(m))
            o.data.normals_split_custom_set_from_vertices(ns)

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
                 gear=P['gear'], hair=P['hair'], stubble=P['stubble'], look=P.get('look'),
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


CREW_OUT = 'records/target/portrait/crew'
CREW_FRAMES = 'records/target/portrait/rig/crew'


def crew_faces():
    """THE HAND-OFF TO RUN TWO: every crew face as square files the screens draw as they are (the roster and the settlement
    draw a face into a 64 canvas; a 72 px box on a 3x phone shows 216 device pixels, so a 128 is handed too). The square is
    the rig's portrait frame padded to square on its own background; the 64 and the 128 are BOX-resampled from the 1:1
    render (the area average a render at that size would take; never nearest, which drops the eyes). Rest, the four
    speak-along mouths and the three moods, so the talking face is the same model. Manifest: BOHEMIA_CREW_FACES.json."""
    from PIL import Image
    man = dict(version='crew-faces-10-18', lane='portrait', rule='115h', method='the face from the same model (HIS FIRST STAR)',
               draft=True, placeholder='nothing is final before the moodboard (rule 108); the old 64 face stays until RUN TWO swaps',
               how_to_draw='drawImage(face, 0, 0, box, box): already square, already sized; the 128 for boxes over 64 css px',
               keys=['rest', 'A', 'E', 'O', 'M', 'Angry', 'Sad', 'Surprised'], faces={})
    for who, c in CREW.items():
        l = who.lower(); fr = os.path.join(ROOT, CREW_FRAMES, l)
        pj = json.load(open(os.path.join(fr, 'portrait.json')))
        src = dict(rest=pj['files'][0], **pj['expression_files'])
        od = os.path.join(ROOT, CREW_OUT, c['look']); os.makedirs(od, exist_ok=True)
        ent = dict(name=c.get('name'), look=c['look'], model='records/portrait/rig/crew/%s_head.glb (rebuilt by this tool; not committed, 7 MB)' % l,
                   hair=c['hair'], gear=c['gear'], files={})
        for k in man['keys']:
            if k not in src: continue
            im = Image.open(os.path.join(ROOT, src[k])).convert('RGBA')
            # the square is the head and a little collar, not the shoulders (cycle 1: the whole rig frame boxed to 64 left the
            # head 38 px in a 64 box, smaller than the drawn face it replaces): a window 1.25 x the head's height from the top,
            # centred on the head
            side = min(im.width, int(round(pj['head_px'] * 1.25)))
            bb = im.split()[3].crop((0, 0, im.width, side)).getbbox() or (0, 0, im.width, side)
            cx = (bb[0] + bb[2]) // 2; x0 = max(0, min(im.width - side, cx - side // 2))
            sq = im.crop((x0, 0, x0 + side, side))
            for n in (64, 128):
                p = os.path.join(od, '%s_%d.png' % (k, n)); sq.resize((n, n), Image.BOX).save(p)
            ent['files'][k] = os.path.relpath(os.path.join(od, '%s_{64|128}.png' % k), ROOT)
        man['faces'][c['look']] = ent
    json.dump(man, open(os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json'), 'w'), indent=1)
    print('faces', len(man['faces']))


def crew_sheet(out):
    """the thirteen: the game's own 64 face today (at 2x) beside the new head three ways and talking, at 1:1; then the
    company line as the crew screen draws it, today against the new faces at 64"""
    from PIL import Image, ImageDraw
    BG = (22, 21, 20); PANEL = (58, 52, 46); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)
    fp = json.load(open(os.path.join(ROOT, 'slices/fight_people/fight_people.json')))
    rows = []
    for who, c in CREW.items():
        l = who.lower(); fr = os.path.join(ROOT, CREW_FRAMES, l)
        pj = json.load(open(os.path.join(fr, 'portrait.json')))
        sh = Image.open(os.path.join(ROOT, 'slices/fight_people', fp['looks'][c['look']]['file'])).convert('RGBA')
        today = sh.crop((sh.width - 64, 0, sh.width, 64))
        ims = [Image.open(os.path.join(ROOT, f)).convert('RGBA') for f in pj['files']] + \
              [Image.open(os.path.join(ROOT, pj['expression_files'][k])).convert('RGBA') for k in ('A', 'O', 'M', 'Angry')]
        rows.append((who, c, today, ims))
    pw, ph = rows[0][3][0].size
    Wd = 24 + 150 + 7 * (pw + 6); H = 70 + len(rows) * (ph + 22) + 60 + 2 * (64 + 30)
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), 'PORTRAIT: EVERY FACE FROM THE SAME MODEL (rule 115h, his first star). The thirteen faces RUN TWO\'s crew and scavenge screens show, each a MODELLED head on its own body (CHARACTER\'s tool, the look\'s worn list). A PLACEHOLDER.', fill=INK)
    d.text((12, 22), 'head 128 px chin to crown, camera tilt 80, one pixel size, block 1 | palette: style palette steps (skin from the game\'s own face, hair and gear from the worn list) | ONE light: the rig\'s sun, upper left, above | wear 0.45', fill=DIM)
    d.text((12, 36), 'columns: TODAY (the game\'s 64 px face, 2x) | S | SE | SW | talking A | O | M | Angry, all 1:1 straight from DIRECTION\'s rig, unedited', fill=HEAD)
    y = 56
    for who, c, today, ims in rows:
        d.text((12, y), '%s  (%s)  %s, %s' % (c.get('name') or c['look'].replace('cast_', '').upper(), c['look'], c['hair'], c['gear'] or 'bare head'), fill=HEAD); y += 14
        t2 = today.resize((128, 128), Image.NEAREST); S.paste(PANEL, (12, y, 140, y + 128)); S.paste(t2, (12, y), t2)
        x = 162
        for im in ims:
            S.paste(PANEL, (x, y, x + im.width, y + im.height)); S.paste(im, (x, y), im); x += pw + 6
        y += ph + 8
    y += 10
    d.text((12, y), 'THE COMPANY LINE AT THE SIZE THE CREW SCREEN DRAWS IT (64 px): today, then the new faces (BOX-resampled from the render, the hand-off files)', fill=HEAD); y += 16
    for i, (who, c, today, ims) in enumerate(rows):
        x = 12 + i * 70
        S.paste(PANEL, (x, y, x + 64, y + 64)); S.paste(today, (x, y), today)
        f = Image.open(os.path.join(ROOT, CREW_OUT, c['look'], 'rest_64.png')).convert('RGBA')
        S.paste(PANEL, (x, y + 94, x + 64, y + 158)); S.paste(f, (x, y + 94), f)
    d.text((12, y + 68), 'today', fill=DIM); d.text((12, y + 162), 'from the same model', fill=DIM)
    os.makedirs(os.path.dirname(os.path.join(ROOT, out)), exist_ok=True); S.save(os.path.join(ROOT, out)); print('sheet', out, S.size)


if __name__ == '__main__':
    if sys.argv[1] == '--crew-faces':
        crew_faces(); crew_sheet(sys.argv[2] if len(sys.argv) > 2 else 'records/target/portrait/PORTRAIT_EVERY_FACE_FROM_THE_SAME_MODEL.png'); sys.exit(0)
    if sys.argv[1] == '--crew-body':
        crew_body(sys.argv[2].upper(), sys.argv[3] if len(sys.argv) > 3 else CREW_BODIES)
    elif sys.argv[1] == '--sheet':
        sheet(sys.argv[2].upper(), sys.argv[3], sys.argv[4])
    else:
        build(sys.argv[1].upper(), os.path.abspath(sys.argv[2]))
