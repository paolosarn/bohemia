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
  * THE COLOURS are steps of the style palette's roles (records/target/BOHEMIA_STYLE_PALETTE.json; the style guide's
    field 5), linearised for the renderer, at most 8 materials a person; the runway's black for the thug's cloth, one
    red accent above the waist. The rig's source pass then puts the wear in (matte, crevice grime, up-face dust, drift,
    grain). Round 2 moved the thug here from the tier paint file: his value span went 105 -> 134 (the card's floor 118).
  * THE POACHER'S COAT (round 2): the coat above the hip is the body lifted (sleeves to the wrist, a stand collar); below
    the hip it is a SKIRT built as rings to the knee, split into four panels by the open front and the back vent, each
    panel skinned to its own thigh bone more and more toward the hem (pelvis at the top, 90 percent thigh at the hem),
    so the tails swing with the legs: his 'a trenchcoat and there's no trenchcoat action' answered. Knee length, not the
    floor: TRENCHCOATS ARE FOR BADASSES (8/27). A wide field hat on the head bone is the tier's silhouette feature.
  * THE MARKSMAN (round 3): a hip-length leather jacket, a bandolier lifted proud of it on a line from the right shoulder
    to the left hip, a teal scarf (the tier paint file's keepHue 180), a peaked cap, and a scoped rifle slung across the
    back on the chest bone (torso_joint_3), the muzzle over the right shoulder: the hands are empty, so at 28 px he is
    told from the thug and the poacher by the stick over his shoulder. One colour is one material (mat() shares them),
    eight a person. The value span is read p5 to p95 (the card of numbers), so the pale khaki trousers carry the light end.

  * THE POACHER'S BODY AGAIN (round 4, after his NO on round 2's body and his first STAR on PORTRAIT's poacher face):
    a black oilcloth coat (the tails kept on the thigh bones), a pale coyote pelt over the shoulders with its tail down
    the back on the chest bone, pale khaki trousers, a bone shirt, and NO hat of this lane's: --whole puts PORTRAIT's
    starred head on this body by calling PORTRAIT's own tool (read, never edited), so the face is the starred face:
    v/bin/python tools/bohemia_cook3_the_tiers_through_the_rig.py POACHER records/cook3/rig/poacher_again_body.glb
    v/bin/python tools/bohemia_cook3_the_tiers_through_the_rig.py --whole POACHER records/cook3/rig/poacher_again_body.glb records/cook3/rig/poacher_again.glb
    then the rig on poacher_again.glb into records/target/cook3/rig/poacher_again, then --sheet as below.
    (bpy 4.2 may segfault on exit AFTER writing its files; the outputs are whole.)

  * THE RAIDER (the row's round 4; DIRECTION's 10/10 mail HOLD: rows, a lit shoulder, a darker hem): Battle Brothers'
    brigand raider (records/target/bb/enemies.json) in our skin. A mail shirt whose ROWS ARE GEOMETRY, each row hanging
    like a shingle (12 mm in at its top under the lip above, out at its own lip, a row every 5 cm = 3 px), so the lips
    are lit and the tops shadowed from every facing; the shoulder lit because it faces the sun; the skirt the poacher
    coat's rings split front and back on the thigh bones, the hem dagged and its last rows and the cuffs rusted (wear
    authored). A coif and aventail cut round PORTRAIT's skull (its numbers read, never edited) and hugging the torso; a
    pointed nasal helmet whose bar clears PORTRAIT's nose; brass bracers (the faction's gold); a cable drum's end for a
    round shield on the left forearm bone; a machete for the falchion. The head is PORTRAIT's, by --whole on HEADS:
    v/bin/python tools/bohemia_cook3_the_tiers_through_the_rig.py RAIDER records/cook3/rig/raider_body.glb
    v/bin/python tools/bohemia_cook3_the_tiers_through_the_rig.py --whole RAIDER records/cook3/rig/raider_body.glb records/cook3/rig/raider.glb
    then the rig on raider.glb into records/target/cook3/rig/raider, then --sheet RAIDER.

Run with Blender's Python (bpy 4.2; see tools/bohemia_direction_master_rig.py), TIER is THUG, POACHER, MARKSMAN or RAIDER:
    v/bin/python tools/bohemia_cook3_the_tiers_through_the_rig.py THUG records/cook3/rig/thug.glb
then the rig, then the sheet (plain python3):
    v/bin/python tools/bohemia_direction_master_rig.py records/cook3/rig/thug.glb records/target/cook3/rig/thug \
        --real-height 1.72 --family none --wear 0.6 --still pass --clip Anim_0:6 --class person
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


# THE BASE COLOURS ARE STEPS OF THE STYLE PALETTE'S ROLES (records/target/BOHEMIA_STYLE_PALETTE.json; the style guide's
# field 5: 'every base colour is a step of one role's ramp in the source palette'). Round 1 painted from the tier paint
# file and came out 2 of 8 on the card: VALUE SPAN 105 against 118 (the oat gambeson sat mid-ramp, nothing on the body
# reached the light end) and COLOURS 1,743 against the prop tile's 2,330 (a person is judged by the person class's
# floor, 800, with --class person; the colour row was the wrong ruler, the span row was a real fault).
PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']


def step(role, i):
    h = PAL[role]['ramp'][i].lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


TIERS = {
    'THUG': dict(
        what='a quilted gambeson to mid-thigh with half sleeves, a wide leather belt, a knit cap with a folded brim, work trousers, boots, a length of rusted pipe',
        garment=dict(material='padded', colour=step('tape_masking', 2), z=(0.47, 1.15), sleeve_x=0.36, chest_t=0.026, skirt_t=0.05,
                     quilt=dict(every_m=0.075, depth_m=0.013, ring_x=0.22)),
        belt=dict(colour=step('clay_rust', 1), z=(0.645, 0.705), t=0.062),
        cap=dict(colour=step('blood', 1),   # step 0 bleached to grey under the rig's up-face dust (cycle 5); the mid holds red
                 down_m=0.075, t=0.012, brim_m=0.03, brim_t=0.02),
        trousers=step('cloth_black', 2), sleeves=step('cloth_black', 2), boots=step('rubber', 2), skin=step('skin_mid', 2),
        eyes=step('skin_mid', 0),
        weapon=dict(kind='pipe', colour=step('clay_rust', 2), r=0.022, back=0.08, fore=0.42),
        head_scale=1.2),
    # THE POACHER (round 2): his NO on the Reds loop, 'a trenchcoat and there's no trenchcoat action', answered with
    # geometry. The coat stops at the KNEE, not the floor: TRENCHCOATS ARE FOR BADASSES (8/27) reserves the floor-length
    # coat; a poacher's is a hunting coat in the law's THIGH-to-knee band. Its skirt is four panels (open at the front, a
    # vent at the back) each skinned to its own thigh bone, so the tails swing with the legs on the walk.
    # THE POACHER'S BODY AGAIN (round 4): his NO on round 2's body, no words, while PORTRAIT's poacher FACE on the same
    # model got his FIRST STAR, and his YES on the thug ('analog horror AI slop and I love it') and the marksman ('finally
    # they're all pale face from Batman'). Round 2 read as one mud: a saddle coat the colour of the ground, a mushroom hat
    # on a box head, nothing pale and nothing dark. Round 4 goes the thug's and the marksman's way: the runway's black
    # (an oilcloth coat, cloth_black, the tails still on the thigh bones), the light end carried by a big PALE piece
    # (a dead coyote pelt over the shoulders, the poacher's trade worn as the silhouette's one feature; a bone shirt; pale
    # khaki trousers), and NO hat of this lane's: the head is PORTRAIT's starred head, modelled on this body (whole()).
    'POACHER': dict(
        what='a knee-length black oilcloth coat open at the front with a back vent, its four tails swinging on the thigh bones, a stand collar, a pale coyote pelt slung over the shoulders, a bone shirt, pale khaki trousers, boots, a rusted hatchet; the head is PORTRAIT\'s starred head on the same model',
        coat=dict(colour=step('cloth_black', 2), z_top=1.17, sleeve_x=0.465, t=0.016, open_from_z=0.80,
                  skirt_top=0.70, hem_z=0.36,
                  vent_z=0.56, flare_x=1.16, flare_y=1.45, swing=0.9, collar=(1.12, 1.20, 0.028)),
        pelt=dict(colour=step('tape_grey', 3), z=(0.93, 1.19), x=0.25, front_z=1.06,   # cycle 2: down the front and the upper arms it read as a grey shirt; a pelt sits on the shoulders and hangs down the back
                  t=0.034, tuft_m=0.03, tuft_d=0.012, tail=(0.20, 0.62)),
        head='portrait',
        shirt=True, trousers=step('metal_painted', 3), sleeves=step('clay_bone', 3), boots=step('rubber', 2), skin=step('skin_deep', 3),   # the hands are the starred face's skin: one id, one whole person
        eyes=step('skin_deep', 0),
        weapon=dict(kind='hatchet', colour=step('tape_grey', 1), r=0.014, back=0.06, fore=0.34),
        head_scale=1.2),
    # THE MARKSMAN (round 3): the tier paint file's MARKSMAN is leather, a strap, the hue kept at 180 (teal). As a model:
    # a hip-length dark leather jacket (the body lifted, closed, a stand collar), a bandolier strap over the right
    # shoulder to the left hip standing proud of the leather, a teal scarf wound at the neck (the one accent above the
    # waist, the teal the old paint kept), a peaked cap, and the RIFLE SLUNG ACROSS HIS BACK on the spine bone, the
    # muzzle and scope standing over his right shoulder: the silhouette's one feature, and his hands are empty, so at
    # 28 px he is the one with a stick over his shoulder, not a stick in his fist like the thug and the poacher.
    'MARKSMAN': dict(
        what='a hip-length dark leather jacket with a stand collar, a bandolier strap from the right shoulder to the left hip, a teal scarf wound at the neck, a peaked cap, pale khaki trousers, boots, a scoped rifle slung across his back',
        jacket=dict(colour=step('clay_rust', 1), z_bot=0.60, z_top=1.17, sleeve_x=0.465, t=0.016, collar=(1.12, 1.19, 0.026)),
        strap=dict(colour=step('tape_masking', 1), a=(-0.17, 1.13), b=(0.17, 0.66), half_w=0.026, t=0.03),
        scarf=dict(colour=step('clay_teal', 4), z=(1.115, 1.21), t=0.034),
        peak=dict(colour=step('cloth_black', 1), down_m=0.07, t=0.012, peak_m=0.07, peak_t=0.012),
        shirt=False, trousers=step('metal_painted', 3), sleeves=step('clay_rust', 1), boots=step('cloth_black', 1), skin=step('skin_mid', 2),
        eyes=step('skin_mid', 0),
        weapon=None,
        slung=dict(kind='rifle', wood=step('clay_rust', 2), metal=step('cloth_black', 1), low=(0.17, 0.80), high=(-0.22, 1.56), out_m=0.085,
                   barrel_r=0.019, stock=(0.26, 0.05, 0.09), scope_r=0.026, scope_l=0.18),
        head_scale=1.2),
    # THE RAIDER (the row's round 4). HOW BATTLE BROTHERS DID IT (rule 41; records/target/bb/enemies.json, brigand_raider): a Worn
    # or a Patched Mail Shirt at double chance, a Nasal Helmet with Rusty Mail or a Rusty Mail Coif, a one-handed weapon
    # (a Falchion, a Handaxe, a Boar Spear...) and 66 percent a Wooden Shield. The tier paint file's RAIDER is mail,
    # chest and arms; DIRECTION's 10/10 HOLD on the mail (third ask): ROWS, a LIT SHOULDER, a DARKER HEM. As a model:
    # the mail shirt is the body lifted with its rows of rings pressed in as geometry (a rounded ridge every 4.5 cm,
    # 2.5 px at the ruler, the gap under each a shadow the sun makes), so the shoulder is lit because it faces the sun,
    # and the hem is authored dark: the last rows and the cuffs gone to rust, the hem dagged where links tore out. The
    # skirt is the poacher's coat's skirt (rings, split front and back, its halves on the thigh bones). Over PORTRAIT's
    # modelled head a coif of the same mail with an aventail over the shoulders, and the pointed nasal helmet gone to
    # rust (the silhouette's point). Our skin: the shield is the end of a wooden cable drum (two crossed layers of
    # planks, the arbor hole's steel plate for a boss), the falchion a machete. The faction's gold kept as the tell
    # (the tier paint's raider and leader share it; the game's raider wears gold cuffs): brass bracers.
    'RAIDER': dict(
        what='a mail shirt to mid-thigh with elbow sleeves, its rows of rings modelled, rusted dark at the dagged hem and the cuffs, split front and back on the thigh bones; a mail coif with an aventail over the shoulders; a pointed nasal helmet gone to rust; brass bracers; a round shield cut from a cable drum\'s end on the left forearm; a machete in the right fist; the head is PORTRAIT\'s modelled head on the same model',
        mail=dict(colour=step('tape_grey', 2), rust=step('clay_rust', 1), z_bot=0.62, z_top=1.165, sleeve_x=0.36, t=0.016,
                  row_m=0.05, row_d=0.012, link_m=0.02, link_a=0.15, skirt_top=0.70, hem_z=0.47, flare_x=1.10, flare_y=1.25,
                  split_z=0.60, swing=0.8, dag_m=0.06, dag_d=0.026, rust_band=0.055, cuff_x=0.33),
        coif=dict(gap=0.014, open=(0.094, 0.12, -0.04), throat=(0.112, 0.118, 0.020), aventail=(1.06, 0.12, 0.12, 0.012), row_m=0.045, row_d=0.007),
        helmet=dict(rim_zr=0.085, apex_m=0.06, band_m=0.028, rib_m=0.004, nasal=(0.022, -0.046)),
        bracers=dict(colour=step('clay_mustard', 2), x=(0.375, 0.445), t=0.013),
        shield=dict(wood=step('tape_masking', 2), d=0.52, t=0.024, out_m=0.085, fwd=0.6, board_m=0.09, boss_r=0.055),
        head='portrait',
        trousers=step('cloth_black', 1), boots=step('rubber', 2), skin=step('skin_light', 2),   # cycle 5: the runway black one step down, the dark end of the span under the bright mail
        sleeves=step('tape_masking', 2),   # the padded jack under the mail, undyed linen, on the forearms: the shield's wood
        # step, one material (cycle 3: all steel and black, value span 117 against 118; the light end needed pale AREA)
        eyes=step('skin_light', 0),
        weapon=dict(kind='machete', colour=step('rubber', 2), blade=step('tape_grey', 2), r=0.016, back=0.05, grip=0.12, fore=0.55),
        head_scale=1.2),
}

# THE HEADS THIS LANE ASKS OF PORTRAIT'S TOOL for a tier PORTRAIT has no row for yet (rule 115h: the face from the same
# model is every face's method): its THUG row (the skull's centre and radii fit every body this tool builds, all on the
# same 1.2x head bone) with this tier's own colours, and no gear of PORTRAIT's (the raider's coif and helmet are this
# lane's, on the body). PORTRAIT's file is read and called, never edited; its own row for the tier wins once it exists.
HEADS = {
    'RAIDER': dict(base='THUG', drop=(), gear='mail coif', hair='buzz', stubble=True,
                   kit='a mail coif and a nasal helmet (COOK THREE\'s, on the body)', palette='steps of the style palette (skin_light 2, a clay_rust 1 beard)',
                   colours=dict(skin=('skin_light', 2), lips=('skin_light', 1), stubble=('clay_rust', 1), hair=('clay_rust', 1))),
}


def portrait():
    """PORTRAIT's head tool as a module, read (its PEOPLE table and build()), never edited"""
    import importlib.util
    spec = importlib.util.spec_from_file_location('portrait_head', os.path.join(ROOT, 'tools/bohemia_portrait_the_head_from_the_model.py'))
    ph = importlib.util.module_from_spec(spec); spec.loader.exec_module(ph)
    return ph


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


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

    made = {}
    def mat(name, rgb, rough=0.95):
        # one colour, one material (the style guide's field 5 caps a person at 8): a second piece of the same colour
        # shares the first one's material
        if rgb is not None and tuple(rgb) in made: return made[tuple(rgb)]
        m = bpy.data.materials.new(name); m.use_nodes = True
        if rgb is not None: made[tuple(rgb)] = m
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
    # the style guide's field 5 caps a person at 8 materials: the sleeves and the trousers are one cloth when one colour
    cloth = mat('%s_cloth' % tier.lower(), T['trousers']) if T['sleeves'] == T['trousers'] else None
    for nm, rgb in (('skin', T['skin']), ('sleeves', T['sleeves']), ('trousers', T['trousers']), ('boots', T['boots'])):
        body.data.materials.append(cloth if nm in ('sleeves', 'trousers') and T['sleeves'] == T['trousers'] else mat('%s_%s' % (tier.lower(), nm), rgb))
    for f in body.data.polygons:
        c = world(f.center)
        if c.z > 1.19: i = 0
        elif abs(c.x) > 0.47: i = 0
        elif abs(c.x) > 0.30 and c.z > 0.75: i = 1
        elif T.get('shirt') and c.z > 0.62: i = 1   # the shirt: the sleeves' colour carried over the torso
        elif c.z < 0.10: i = 3
        else: i = 2
        f.material_index = i

    def lift(name, keep, thick, colour, rim=0.012, subdiv=2, groove=None, material=None):
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
        g.data.materials.clear(); g.data.materials.append(material or mat(name, colour))
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

    def band(za, zb):
        """the body's cross-section between two heights: centre and half-widths in x and y"""
        ps = [M @ v.co for v in body.data.vertices if za <= (M @ v.co).z <= zb and abs((M @ v.co).x) < 0.25]
        xs = [q.x for q in ps]; ys = [q.y for q in ps]
        return (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (max(xs) - min(xs)) / 2, (max(ys) - min(ys)) / 2

    def skin_to(o, weights):
        """parent a built mesh to the armature and give every vertex its bone weights: weights(world point) -> {bone: w}"""
        mw = o.matrix_world.copy(); o.parent = arm; o.matrix_world = mw
        groups = {}
        for v in o.data.vertices:
            for bn, w in weights(o.matrix_world @ v.co).items():
                if w <= 0: continue
                if bn not in groups: groups[bn] = o.vertex_groups.new(name=bn)
                groups[bn].add([v.index], w, 'REPLACE')
        am = o.modifiers.new('Armature', 'ARMATURE'); am.object = arm

    def coat(K):
        """THE COAT: the body above the hip lifted (sleeves to the wrist, a stand collar, open down the front below the
        chest), and below the hip a SKIRT built as rings, four panels split by the front opening and the back vent, each
        panel skinned to its own thigh bone more and more toward the hem: the tails swing with the legs"""
        cm = mat('%s_coat' % tier.lower(), K['colour'], rough=0.9)
        def half_open(z):   # the front opening's half-width at a height: shut at the chest, a widening V below it
            return 0.0 if z >= K['open_from_z'] else 0.014 + (K['open_from_z'] - z) * 0.10
        def upper(p):
            if not (0.60 <= p.z <= K['z_top'] and abs(p.x) < K['sleeve_x']): return False
            return not (p.y < -0.02 and abs(p.x) < half_open(p.z))
        lift('%s_coat' % tier.lower(), upper, lambda p: K['t'], None, rim=0.008, subdiv=2, material=cm)
        za, zb, ct = K['collar']
        lift('%s_collar' % tier.lower(), lambda p: za <= p.z <= zb and abs(p.x) < 0.11 and not (p.y < -0.02 and abs(p.x) < 0.02),
             lambda p: ct, None, rim=0.008, subdiv=1, material=cm)
        # the skirt, from just inside the coat's lower edge to the knee
        cx, cy, rx0, ry0 = band(0.62, 0.70)
        rx0 += K['t'] + 0.006; ry0 += K['t'] + 0.006
        z0_, z1_ = K['skirt_top'], K['hem_z']; rows = 16; segs = 64
        bm = bmesh.new(); grid = []
        for r in range(rows + 1):
            u = r / rows; z = z0_ + (z1_ - z0_) * u
            rx = rx0 * (1 + (K['flare_x'] - 1) * u); ry = ry0 * (1 + (K['flare_y'] - 1) * u)
            grid.append([bm.verts.new((cx + rx * math.cos(2 * math.pi * k / segs), cy + ry * math.sin(2 * math.pi * k / segs), z)) for k in range(segs)])
        for r in range(rows):
            for k in range(segs):
                k2 = (k + 1) % segs; vs = (grid[r][k], grid[r][k2], grid[r + 1][k2], grid[r + 1][k])
                mx = sum(v.co.x for v in vs) / 4; my = sum(v.co.y for v in vs) / 4; mz = sum(v.co.z for v in vs) / 4
                if my < cy and abs(mx - cx) < half_open(mz): continue                      # the open front
                if my > cy and mz < K['vent_z'] and abs(mx - cx) < 0.012: continue         # the back vent
                bm.faces.new(vs)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new('%s_coat_skirt' % tier.lower()); bm.to_mesh(me); bm.free()
        sk = bpy.data.objects.new(me.name, me); sc.collection.objects.link(sk)
        for f in me.polygons: f.use_smooth = True
        me.materials.append(cm)
        bpy.context.view_layer.objects.active = sk
        for o in sc.objects: o.select_set(o is sk)
        so = sk.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.008; so.offset = 1; so.use_rim = True
        bpy.ops.object.modifier_apply(modifier='rim')
        def w(p):
            t = max(0.0, min(1.0, (z0_ - p.z) / (z0_ - z1_))) ** 1.3 * K['swing']
            split = p.y < cy or p.z < K['vent_z'] + 0.01   # a panel edge at the front or in the vent belongs to one leg
            side = (1.0 if p.x > cx else 0.0) if split else max(0.0, min(1.0, 0.5 + (p.x - cx) / 0.08))
            return {'Skeleton_torso_joint_1': 1 - t, 'leg_joint_L_1': t * side, 'leg_joint_R_1': t * (1 - side)}
        skin_to(sk, w)

    def hat(H, top):
        """a wide-brimmed field hat: a crown and a drooping brim, every vertex on the head bone (the silhouette's one feature)"""
        hb = 'Skeleton_neck_joint_2'
        hv = [M @ v.co for v in body.data.vertices if (M @ v.co).z > top - 0.12]
        hx = (min(q.x for q in hv) + max(q.x for q in hv)) / 2; hy = (min(q.y for q in hv) + max(q.y for q in hv)) / 2
        hr = max(max(q.x for q in hv) - min(q.x for q in hv), max(q.y for q in hv) - min(q.y for q in hv)) / 2
        base = top - H['down_m']
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=hr * H['crown_r'] + 0.008, depth=H['crown_h'] + H['down_m'],
                                            location=(hx, hy, base + (H['crown_h'] + H['down_m']) / 2))
        cr = bpy.context.active_object
        for v in cr.data.vertices:   # the crown pinched at the top and dented down the middle front to back
            if v.co.z > 0:
                v.co.x *= 0.82; v.co.y *= 0.88
                v.co.z -= 0.018 * max(0.0, 1 - abs(v.co.x) / (hr * 0.5))
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=hr * H['brim_r'], depth=H['brim_t'], end_fill_type='TRIFAN', location=(hx, hy, base + 0.004))
        br = bpy.context.active_object
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.subdivide(number_cuts=3); bpy.ops.object.mode_set(mode='OBJECT')
        for v in br.data.vertices:   # the brim droops at the front and the back, up at the sides a little
            d = math.hypot(v.co.x, v.co.y) / (hr * H['brim_r'])
            ang = math.atan2(v.co.y, v.co.x)
            v.co.z -= H['droop'] * d * d * (0.6 + 0.4 * abs(math.sin(ang)))
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        for o in sc.objects: o.select_set(o in (cr, br))
        bpy.context.view_layer.objects.active = cr; bpy.ops.object.join()
        cr.name = '%s_hat' % tier.lower()
        for f in cr.data.polygons: f.use_smooth = True
        cr.data.materials.append(mat('%s_hat' % tier.lower(), H['colour']))
        skin_to(cr, lambda p: {hb: 1.0})

    def jacket(K):
        """THE JACKET: the body from the hip to the shoulder lifted, sleeves to the wrist, closed, and a stand collar"""
        jm = mat('%s_jacket' % tier.lower(), K['colour'], rough=0.85)
        lift('%s_jacket' % tier.lower(), lambda p: K['z_bot'] <= p.z <= K['z_top'] and abs(p.x) < K['sleeve_x'], lambda p: K['t'], None, rim=0.01, subdiv=2, material=jm)
        za, zb, ct = K['collar']
        lift('%s_collar' % tier.lower(), lambda p: za <= p.z <= zb and abs(p.x) < 0.11, lambda p: ct, None, rim=0.008, subdiv=1, material=jm)

    def strap(S):
        """THE BANDOLIER: the body's faces within half_w of the line from the right shoulder to the left hip (front and
        back, the same line in x and z), lifted proud of the jacket"""
        (ax, az), (bx, bz) = S['a'], S['b']
        dx, dz = bx - ax, bz - az; L2 = dx * dx + dz * dz
        def near(p):
            if abs(p.x) > 0.25 or not (min(az, bz) - 0.03 <= p.z <= max(az, bz) + 0.03): return False
            u = max(0.0, min(1.0, ((p.x - ax) * dx + (p.z - az) * dz) / L2))
            return math.hypot(p.x - ax - u * dx, p.z - az - u * dz) < S['half_w']
        lift('%s_strap' % tier.lower(), near, lambda p: S['t'], S['colour'], rim=0.008, subdiv=1)

    def peaked_cap(P, top):
        """a peaked cap: the crown is the head's own skin lifted, the peak a disc segment standing out over the brow"""
        cz = top - P['down_m']
        cm = mat('%s_cap' % tier.lower(), P['colour'])
        lift('%s_cap' % tier.lower(), lambda p: p.z >= cz, lambda p: P['t'], None, rim=0.01, subdiv=1, material=cm)
        hv = [M @ v.co for v in body.data.vertices if (M @ v.co).z > top - 0.12]
        hx = (min(q.x for q in hv) + max(q.x for q in hv)) / 2; hy = (min(q.y for q in hv) + max(q.y for q in hv)) / 2
        hr = (max(q.x for q in hv) - min(q.x for q in hv)) / 2
        front = min(q.y for q in hv)
        R = (hy - front) + P['peak_m']
        bm = bmesh.new()
        bmesh.ops.create_circle(bm, cap_ends=True, cap_tris=True, segments=40, radius=1.0)
        for v in bm.verts: v.co = mathutils.Vector((hx + v.co.x * hr * 1.05, hy + v.co.y * R, cz + 0.004))
        bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=2, use_grid_fill=True)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().y > front + 0.02], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        for v in bm.verts:   # the peak dips toward its edge
            v.co.z -= 0.25 * max(0.0, front - v.co.y)
        me = bpy.data.meshes.new('%s_peak' % tier.lower()); bm.to_mesh(me); bm.free()
        pk = bpy.data.objects.new(me.name, me); sc.collection.objects.link(pk); me.materials.append(cm)
        bpy.context.view_layer.objects.active = pk
        for o in sc.objects: o.select_set(o is pk)
        so = pk.modifiers.new('rim', 'SOLIDIFY'); so.thickness = P['peak_t']; so.offset = 0; so.use_rim = True
        bpy.ops.object.modifier_apply(modifier='rim')
        skin_to(pk, lambda p: {'Skeleton_neck_joint_2': 1.0})

    def slung(S):
        """THE RIFLE ACROSS THE BACK: a stock at the low end by the left hip, the barrel up over the right shoulder, a scope
        on top; every vertex on the upper spine bone, so it rides the torso and does not swing with an arm"""
        def back_y(z): return max((M @ v.co).y for v in body.data.vertices if abs((M @ v.co).z - z) < 0.04 and abs((M @ v.co).x) < 0.2)
        (lx, lz), (hx_, hz) = S['low'], S['high']
        lo = mathutils.Vector((lx, back_y(lz) + S['out_m'], lz)); hi = mathutils.Vector((hx_, back_y(min(hz, 1.1)) + S['out_m'], hz))
        ax = (hi - lo).normalized(); L = (hi - lo).length
        rot = mathutils.Vector((0, 0, 1)).rotation_difference(ax)
        parts = []
        def place(o, t_, off=mathutils.Vector((0, 0, 0))):
            o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = rot; o.location = lo + ax * t_ + off
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True); parts.append(o)
        sl, sw, sh = S['stock']   # the stock: long along the gun, thin across the back, deep away from it
        bpy.ops.mesh.primitive_cube_add(size=1.0); st = bpy.context.active_object; st.scale = (sw, sh, sl)
        place(st, sl / 2); st.data.materials.append(mat('%s_rifle_wood' % tier.lower(), S['wood'], rough=0.7))
        bpy.ops.mesh.primitive_cube_add(size=1.0); fe = bpy.context.active_object; fe.scale = (sw * 0.8, sh * 0.6, L * 0.30)   # the fore-end, wood
        place(fe, sl + L * 0.15); fe.data.materials.append(st.data.materials[0])
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=S['barrel_r'], depth=L - sl); br = bpy.context.active_object
        place(br, sl + (L - sl) / 2); br.data.materials.append(mat('%s_rifle_metal' % tier.lower(), S['metal'], rough=0.6))
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=S['scope_r'], depth=S['scope_l']); scp = bpy.context.active_object
        out = mathutils.Vector((0, 1, 0))
        place(scp, sl + L * 0.10, out * (sh * 0.5 + S['scope_r'])); scp.data.materials.append(br.data.materials[0])
        for o in sc.objects: o.select_set(o in parts)
        bpy.context.view_layer.objects.active = st; bpy.ops.object.join(); st.name = '%s_rifle' % tier.lower()
        skin_to(st, lambda p: {SPINE: 1.0})

    def ring_groove(u, a, K):
        """MAIL AS GEOMETRY: how far (metres) the surface is pressed in at row coordinate u (in rows from the top) and arc a
        (metres round, or None). Each row HANGS like a shingle: pressed in deep at its top, under the lip of the row above,
        and standing out at its own lower lip, so the face of a row tilts down and out (darker) and every lip is a hard lit
        edge over the shadowed top of the row below: rows from every facing, DIRECTION's 10/10 HOLD. (Cycle 1's rounded
        ridges, 6 mm on 4.5 cm, read as quilting in the close look and as a pale sweater at 1x.) Along the lip a ring every
        link_m, offset half a ring on alternate rows (riveted mail's brick), link_a of the depth: for the close portrait,
        under a pixel at 1x"""
        f = u - math.floor(u)
        d = K['row_d'] * (1.0 - f) ** 2
        if a is not None:
            g_ = a / K['link_m'] + 0.5 * (math.floor(u) % 2)
            d += K['link_a'] * K['row_d'] * (1.0 - abs(math.sin(math.pi * g_))) ** 2 * f * f
        return d

    def hauberk(K):
        """THE MAIL SHIRT: the body from the hip to the neck lifted, elbow sleeves, the rows pressed in (round the body on
        the torso, round the arm on the sleeves, a seam where they meet at the shoulder), the cuffs rusted; below the hip
        the poacher coat's skirt of rings, split front and back from split_z, each half on its own thigh bone, the rows
        running on round it, the hem dagged where links tore out and the last rows rusted (the darker hem, authored)"""
        mm = mat('%s_mail' % tier.lower(), K['colour'], rough=0.8)
        rm = mat('%s_rust' % tier.lower(), K['rust'], rough=0.95)
        RM = K['row_m']
        def rows(p):
            ax_ = abs(p.x)
            if ax_ > 0.20 and p.z > 0.80:   # a sleeve: rows round the arm, counted from the shoulder joint toward the elbow
                s = (ax_ - 0.096) * 0.893 - (p.z - 1.074) * 0.450
                return ring_groove(s / RM, None, K) + (K['row_d'] if ax_ < 0.207 else 0.0)   # the shoulder seam
            return ring_groove((K['z_top'] - p.z) / RM, math.atan2(p.y - 0.01, p.x) * 0.15, K)
        g = lift('%s_mail' % tier.lower(), lambda p: K['z_bot'] <= p.z <= K['z_top'] and abs(p.x) < K['sleeve_x'],
                 lambda p: K['t'], None, rim=0.008, subdiv=3, groove=rows, material=mm)
        g.data.materials.append(rm)
        for f in g.data.polygons:
            c = M @ f.center
            if abs(c.x) > K['cuff_x'] and c.z > 0.75: f.material_index = 1
        # the skirt
        cx, cy, rx0, ry0 = band(0.62, 0.70)
        rx0 += K['t'] + 0.008; ry0 += K['t'] + 0.008
        z0_, z1_ = K['skirt_top'], K['hem_z']; nrow = 46; segs = 144
        def tooth(ang): return int((ang * 0.15) / K['dag_m']) % 2
        bm = bmesh.new(); grid = []
        for r in range(nrow + 1):
            u = r / nrow; z = z0_ + (z1_ - z0_) * u
            rx = rx0 * (1 + (K['flare_x'] - 1) * u); ry = ry0 * (1 + (K['flare_y'] - 1) * u)
            ring = []
            for k in range(segs):
                ang = 2 * math.pi * k / segs
                d = ring_groove((K['z_top'] - z) / RM, ang * 0.15, K)
                ring.append(bm.verts.new((cx + (rx - d) * math.cos(ang), cy + (ry - d) * math.sin(ang), z)))
            grid.append(ring)
        for r in range(nrow):
            for k in range(segs):
                k2 = (k + 1) % segs; vs = (grid[r][k], grid[r][k2], grid[r + 1][k2], grid[r + 1][k])
                mx = sum(v.co.x for v in vs) / 4; my = sum(v.co.y for v in vs) / 4; mz = sum(v.co.z for v in vs) / 4
                if mz < K['split_z'] and abs(mx - cx) < 0.012: continue                      # the riding splits, front and back
                hem = z1_ + K['dag_d'] * tooth(2 * math.pi * (k + 0.5) / segs)
                if mz < hem: continue                                                         # the dags
                f = bm.faces.new(vs); f.material_index = 1 if mz < hem + K['rust_band'] else 0
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new('%s_mail_skirt' % tier.lower()); bm.to_mesh(me); bm.free()
        sk = bpy.data.objects.new(me.name, me); sc.collection.objects.link(sk)
        for f in me.polygons: f.use_smooth = True
        me.materials.append(mm); me.materials.append(rm)
        bpy.context.view_layer.objects.active = sk
        for o in sc.objects: o.select_set(o is sk)
        so = sk.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.008; so.offset = 1; so.use_rim = True
        bpy.ops.object.modifier_apply(modifier='rim')
        def w(p):
            t = max(0.0, min(1.0, (z0_ - p.z) / (z0_ - z1_))) ** 1.3 * K['swing']
            side = (1.0 if p.x > cx else 0.0) if p.z < K['split_z'] + 0.01 else max(0.0, min(1.0, 0.5 + (p.x - cx) / 0.08))
            return {'Skeleton_torso_joint_1': 1 - t, 'leg_joint_L_1': t * side, 'leg_joint_R_1': t * (1 - side)}
        skin_to(sk, w)

    def head_frame():
        """PORTRAIT's modelled head as this body will wear it (whole()): its centre and radii from PORTRAIT's THUG row,
        read, and its face_push, so the coif and the helmet are cut to the real skull, nose and chin"""
        ph = portrait(); row = ph.PEOPLE['THUG']
        return ph, mathutils.Vector(row['centre']), row['radii']

    def coif(K, MK):
        """THE COIF AND THE AVENTAIL: a hood of the shirt's mail over PORTRAIT's skull (a gap all round it), open for the
        face from the brow to the chin, the throat closed under the jaw, and a cape of mail out over the shoulders, every
        ring far enough off the body and the shirt below the neck; the rows run round it; the hood on the head bone, the
        cape blending to the chest bone"""
        ph, C, (RX, RY, RZ) = head_frame()
        g = K['gap']; mm = mat('%s_mail' % tier.lower(), MK['colour'], rough=0.8)
        tax, tay, tcy = K['throat']; az, aax, aay, acy = K['aventail']
        rings = []
        phi0, phi1 = 0.05, math.acos(-0.10 / (RZ + g))
        for i in range(56):   # the dome over the skull, even in arc length
            ph_ = phi0 + (phi1 - phi0) * i / 55
            rings.append((C.z + (RZ + g) * math.cos(ph_), (RX + g) * math.sin(ph_), (RY + g) * math.sin(ph_), C.y))
        z_, ax_, ay_, cy_ = rings[-1]; zt = C.z - 0.20
        for i in range(1, 16):   # the throat, under the chin, closing in toward the neck
            u = i / 15; rings.append((z_ + (zt - z_) * u, ax_ + (tax - ax_) * u, ay_ + (tay - ay_) * u, cy_ + (tcy - cy_) * u))
        for i in range(1, 19):   # the aventail, down over the shoulders like a short cape; it hugs the body under it (need, below):
            # cycle 2 flared it to 0.245 m and it stood off the shoulders as a flat ruff
            u = i / 18; e = math.sin(u * math.pi / 2)
            rings.append((zt + (az - zt) * u, tax + (aax - tax) * e, tay + (aay - tay) * e, tcy + (acy - tcy) * u))
        segs = 128
        hg = gidx['Skeleton_neck_joint_2']; armg = {gidx[b] for b in gidx if b.startswith('Skeleton_arm_joint')}
        pts = []
        for v in body.data.vertices:   # what the cape must clear: the torso under the neck (PORTRAIT cuts the box head off at
            p = M @ v.co               # 1.165), not the arms: cycle 3 wrapped the bind pose's raised arms and left a flange
            if p.z > 1.168 or abs(p.x) > 0.34: continue                                     # standing out when they came down
            if next((gg.weight for gg in v.groups if gg.group == hg), 0.0) > 0.5: continue
            if sum(gg.weight for gg in v.groups if gg.group in armg) > 0.5: continue
            pts.append(p)
        clear = MK['t'] + 0.008 + 0.014
        ox, oh, oz = K['open']
        bm = bmesh.new(); grid = []
        for (z, ax2, ay2, cy2) in rings:
            need = [0.0] * segs
            if z < 1.17:
                for p in pts:
                    if abs(p.z - z) > 0.014: continue
                    dx, dy = p.x, p.y - cy2; k = int(round((math.atan2(dy, dx) % (2 * math.pi)) / (2 * math.pi) * segs))
                    for kk in range(k - 2, k + 3): need[kk % segs] = max(need[kk % segs], math.hypot(dx, dy) + clear)
            ring = []
            for k in range(segs):
                th = 2 * math.pi * k / segs; c_, s_ = math.cos(th), math.sin(th)
                r = ax2 * ay2 / max(1e-6, math.hypot(ay2 * c_, ax2 * s_))
                r = max(r, need[k]) - ring_groove((C.z + RZ + g - z) / K['row_m'], th * 0.15, dict(MK, row_d=K['row_d']))
                ring.append(bm.verts.new((r * c_, cy2 + r * s_, z)))
            grid.append(ring)
        top = bm.verts.new((0.0, C.y, C.z + RZ + g))
        for k in range(segs): bm.faces.new((top, grid[0][(k + 1) % segs], grid[0][k]))
        for r in range(len(grid) - 1):
            for k in range(segs):
                k2 = (k + 1) % segs; vs = (grid[r][k], grid[r][k2], grid[r + 1][k2], grid[r + 1][k])
                mx = sum(v.co.x for v in vs) / 4; my = sum(v.co.y for v in vs) / 4; mz = sum(v.co.z for v in vs) / 4
                if my < C.y and (mx / ox) ** 2 + ((mz - C.z - oz) / oh) ** 2 < 1.0: continue   # the face
                bm.faces.new(vs)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        for v in bm.verts:   # the face opening's edge laid on its ellipse, not the quads' stairs (cycle 1's close look)
            if v.is_boundary and v.co.y < C.y and v.co.z > C.z - 0.20:
                e = (v.co.x / ox) ** 2 + ((v.co.z - C.z - oz) / oh) ** 2
                if e > 0.3: s_ = e ** -0.5; v.co.x *= s_; v.co.z = C.z + oz + (v.co.z - C.z - oz) * s_
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new('%s_coif' % tier.lower()); bm.to_mesh(me); bm.free()
        co_ = bpy.data.objects.new(me.name, me); sc.collection.objects.link(co_)
        for f in me.polygons: f.use_smooth = True
        me.materials.append(mm)
        bpy.context.view_layer.objects.active = co_
        for o in sc.objects: o.select_set(o is co_)
        so = co_.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.007; so.offset = 1; so.use_rim = True
        bpy.ops.object.modifier_apply(modifier='rim')
        skin_to(co_, lambda p: {'Skeleton_neck_joint_2': sstep(1.13, 1.22, p.z), SPINE: 1.0 - sstep(1.13, 1.22, p.z)})

    def helmet(K, CK, MK):
        """THE NASAL HELMET: a pointed cap over the coif from a brow band to a point, four raised ribs (front, back, the
        sides: a frame of strips), and the nasal bar down over the nose, standing clear of PORTRAIT's nose; gone to rust;
        every vertex on the head bone"""
        ph, C, (RX, RY, RZ) = head_frame()
        g = CK['gap']; rm = mat('%s_rust' % tier.lower(), MK['rust'], rough=0.95)
        def coif_r(zr):
            e = max(0.0, 1 - (zr / (RZ + g)) ** 2) ** 0.5; return (RX + g) * e, (RY + g) * e
        rz0 = K['rim_zr']; top = RZ + g + K['apex_m']
        rax, ray = coif_r(rz0); rax += 0.012; ray += 0.012
        segs = 128; bm = bmesh.new(); rings = []
        for i in range(40):
            t = i / 39 * 0.985
            zr = rz0 + (top - rz0) * t; prof = (1 - t ** 1.6) ** 0.9
            cax, cay = coif_r(zr)
            ax2 = max(cax + 0.011, rax * prof); ay2 = max(cay + 0.011, ray * prof)
            ring = []
            for k in range(segs):
                th = 2 * math.pi * k / segs
                out = (K['rib_m'] if abs(math.sin(2 * th)) < 0.09 else 0.0) + (K['rib_m'] * 1.25 if zr < rz0 + K['band_m'] else 0.0)
                ring.append(bm.verts.new(((ax2 + out) * math.cos(th), C.y + (ay2 + out) * math.sin(th), C.z + zr)))
            rings.append(ring)
        apex = bm.verts.new((0.0, C.y, C.z + top))
        for r in range(len(rings) - 1):
            for k in range(segs):
                k2 = (k + 1) % segs; bm.faces.new((rings[r][k], rings[r][k2], rings[r + 1][k2], rings[r + 1][k]))
        for k in range(segs): bm.faces.new((rings[-1][k], rings[-1][(k + 1) % segs], apex))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        # the nasal: from inside the band down to the bridge of the nose, its back clear of the nose by 7 mm
        w0, zb = K['nasal']
        def face_y(zr): return C.y - (RY * max(0.0, 1 - (zr / RZ) ** 2) ** 0.5 + ph.face_push(0.0, zr))
        yt = C.y - ray - K['rib_m'] * 1.25 + 0.002; yb = min(yt, face_y(zb) - 0.007)
        zt_ = C.z + rz0 + K['band_m'] * 0.9; zb_ = C.z + zb
        q = [bm.verts.new(c) for c in ((-w0 / 2, yt, zt_), (w0 / 2, yt, zt_), (w0 * 0.38, yb, zb_), (-w0 * 0.38, yb, zb_),
                                       (-w0 / 2, yt - 0.005, zt_), (w0 / 2, yt - 0.005, zt_), (w0 * 0.38, yb - 0.005, zb_), (-w0 * 0.38, yb - 0.005, zb_))]
        for fc in ((0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)): bm.faces.new([q[i] for i in fc])
        me = bpy.data.meshes.new('%s_helmet' % tier.lower()); bm.to_mesh(me); bm.free()
        he = bpy.data.objects.new(me.name, me); sc.collection.objects.link(he)
        me.materials.append(rm)
        bpy.context.view_layer.objects.active = he
        for o in sc.objects: o.select_set(o is he)
        so = he.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.004; so.offset = -1; so.use_rim = True
        bpy.ops.object.modifier_apply(modifier='rim')
        skin_to(he, lambda p: {'Skeleton_neck_joint_2': 1.0})

    def shield(S, MK):
        """THE SHIELD, our skin on Battle Brothers' Wooden Shield: the end of a wooden cable drum, a disc of planks
        running along the forearm with the gaps pressed in, the arbor hole's steel plate standing out as the boss, the
        four drive holes; strapped on the left forearm, its face turned out and a little forward, every vertex on the
        forearm bone, so it swings with the arm"""
        elbow = arm.matrix_world @ arm.data.bones['Skeleton_arm_joint_L__3_'].head_local
        wrist = arm.matrix_world @ arm.data.bones['Skeleton_arm_joint_L__2_'].head_local
        a = (wrist - elbow).normalized()
        n0 = mathutils.Vector((1.0, -S['fwd'], 0.0)).normalized(); n = (n0 - a * n0.dot(a)).normalized()
        v_ = n.cross(a).normalized(); ctr = (elbow + wrist) / 2 + n * S['out_m']; R_ = S['d'] / 2
        wm = mat('%s_wood' % tier.lower(), S['wood'], rough=1.0); rm = mat('%s_rust' % tier.lower(), MK['rust'], rough=0.95)
        bm = bmesh.new()
        bmesh.ops.create_grid(bm, x_segments=72, y_segments=72, size=1.0)
        ext = max(max(abs(vt.co.x), abs(vt.co.y)) for vt in bm.verts)
        for vt in bm.verts: vt.co.x *= R_ / ext; vt.co.y *= R_ / ext
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().length > R_], context='FACES')
        bmesh.ops.delete(bm, geom=[vt for vt in bm.verts if not vt.link_faces], context='VERTS')
        holes = [(0.13 * math.cos(math.pi / 4 + i * math.pi / 2), 0.13 * math.sin(math.pi / 4 + i * math.pi / 2)) for i in range(4)]
        for vt in bm.verts:
            if vt.is_boundary: vt.co.xy = vt.co.xy.normalized() * R_   # a round edge, not the grid's stairs
            x2, y2 = vt.co.x, vt.co.y
            gap = abs(((y2 / S['board_m']) + 0.5) % 1.0 - 0.5) * S['board_m']
            press = 0.005 if gap < 0.004 else 0.0
            if any(math.hypot(x2 - hx, y2 - hy) < 0.017 for hx, hy in holes): press = 0.012
            vt.co = ctr + a * x2 + v_ * y2 - n * press
        bm.normal_update()
        me = bpy.data.meshes.new('%s_shield' % tier.lower()); bm.to_mesh(me); bm.free()
        sh = bpy.data.objects.new(me.name, me); sc.collection.objects.link(sh); me.materials.append(wm)
        if sum((p.normal for p in me.polygons), mathutils.Vector()).dot(n) < 0: me.flip_normals()
        bpy.context.view_layer.objects.active = sh
        for o in sc.objects: o.select_set(o is sh)
        so = sh.modifiers.new('rim', 'SOLIDIFY'); so.thickness = S['t']; so.offset = -1; so.use_rim = True
        bpy.ops.object.modifier_apply(modifier='rim')
        bm = bmesh.new()   # the boss: the arbor plate, a low dome
        bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=12, radius=1.0)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().z < -0.05], context='FACES')
        bmesh.ops.delete(bm, geom=[vt for vt in bm.verts if not vt.link_faces], context='VERTS')
        for vt in bm.verts: vt.co = ctr + a * vt.co.x * S['boss_r'] + v_ * vt.co.y * S['boss_r'] + n * (max(0.0, vt.co.z) * S['boss_r'] * 0.45 - 0.002)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        mb = bpy.data.meshes.new('%s_shield_boss' % tier.lower()); bm.to_mesh(mb); bm.free()
        bo = bpy.data.objects.new(mb.name, mb); sc.collection.objects.link(bo); mb.materials.append(rm)
        for o in (sh, bo): skin_to(o, lambda p: {'Skeleton_arm_joint_L__3_': 1.0})

    SPINE = 'torso_joint_3'   # the chest bone (CesiumMan names it without the Skeleton_ prefix)
    if 'mail' in T: hauberk(T['mail'])
    if 'coif' in T: coif(T['coif'], T['mail'])
    if 'helmet' in T: helmet(T['helmet'], T['coif'], T['mail'])
    if 'bracers' in T:
        BR = T['bracers']   # brass bracers on both forearms, a raised band at each end: the faction's gold, the tell
        lift('%s_bracers' % tier.lower(), lambda p: BR['x'][0] <= abs(p.x) <= BR['x'][1] and p.z > 0.78, lambda p: BR['t'], BR['colour'],
             rim=0.006, subdiv=2, groove=lambda p: 0.003 if min(abs(abs(p.x) - BR['x'][0] - 0.012), abs(abs(p.x) - BR['x'][1] + 0.012)) > 0.006 else 0.0)
    if 'shield' in T: shield(T['shield'], T['mail'])
    if 'coat' in T: coat(T['coat'])
    if 'jacket' in T: jacket(T['jacket'])
    if 'strap' in T: strap(T['strap'])
    if 'scarf' in T:
        F = T['scarf']; scm = mat('%s_scarf' % tier.lower(), F['colour'])
        lift('%s_scarf' % tier.lower(), lambda p: F['z'][0] <= p.z <= F['z'][1] and abs(p.x) < 0.13, lambda p: F['t'], None, rim=0.012, subdiv=2, material=scm)
    if 'slung' in T: slung(T['slung'])
    if 'pelt' in T:
        # THE PELT: the shoulders and upper chest and back lifted thick, with tufts pressed in (fur reads by its broken
        # light, a shape the sun falls across), and the tail hanging down the back on the chest bone's skin
        PL = T['pelt']; pm = mat('%s_pelt' % tier.lower(), PL['colour'], rough=1.0)
        def tufts(p):
            u = math.sin(p.x / PL['tuft_m'] * 6.1) * math.sin(p.z / PL['tuft_m'] * 5.3 + p.y * 40)
            return PL['tuft_d'] * max(0.0, u) ** 3
        def drape(p):   # deeper at the shoulder's top, thinning down the chest and back
            return PL['t'] * (0.55 + 0.45 * max(0.0, min(1.0, (p.z - PL['z'][0]) / (PL['z'][1] - PL['z'][0]))))
        lift('%s_pelt' % tier.lower(), lambda p: PL['z'][0] <= p.z <= PL['z'][1] and abs(p.x) < PL['x'] and (p.y > 0 or p.z > PL['front_z']),
             drape, None, rim=0.014, subdiv=2, groove=tufts, material=pm)
        # the tail: a tapered tube down the back from the left shoulder blade, on the chest bone
        def back_y(z): return max((M @ v.co).y for v in body.data.vertices if abs((M @ v.co).z - z) < 0.04 and abs((M @ v.co).x) < 0.2)
        x0, z1 = PL['tail']; z0 = 1.02
        bm = bmesh.new(); rings = []
        for r in range(9):
            u = r / 8; z = z0 + (z1 - z0) * u; rad = 0.035 * (1 - 0.7 * u) + 0.006
            cy = back_y(min(z, 1.0)) + 0.045 + rad * 0.6; cx = x0 - 0.04 * u
            rings.append([bm.verts.new((cx + rad * math.cos(2 * math.pi * k / 10), cy + rad * 0.8 * math.sin(2 * math.pi * k / 10), z)) for k in range(10)])
        for r in range(8):
            for k in range(10): bm.faces.new((rings[r][k], rings[r][(k + 1) % 10], rings[r + 1][(k + 1) % 10], rings[r + 1][k]))
        bm.faces.new(rings[-1][::-1])
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new('%s_pelt_tail' % tier.lower()); bm.to_mesh(me); bm.free()
        tl = bpy.data.objects.new(me.name, me); sc.collection.objects.link(tl); me.materials.append(pm)
        for f in me.polygons: f.use_smooth = True
        skin_to(tl, lambda p: {SPINE: 1.0})
    G = T.get('garment') or dict(z=(0, 0), sleeve_x=0, chest_t=0, skirt_t=0, quilt=None, colour=None)
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
    if 'garment' in T: lift('%s_gambeson' % tier.lower(), in_coat, coat_t, G['colour'], rim=0.014, subdiv=2, groove=quilt)

    B = T.get('belt')
    if B: lift('%s_belt' % tier.lower(), lambda p: B['z'][0] <= p.z <= B['z'][1] and abs(p.x) < 0.25, lambda p: B['t'], B['colour'], rim=0.008, subdiv=1)

    # the cap sits from the crown down to the brow, measured from the SCALED head's top (the head grew 1.3x)
    C = T.get('cap') or T.get('hat') or T.get('peak') or {}
    top = max((M @ v.co).z for v in body.data.vertices)
    cz = top - C.get('down_m', 0)   # lower at the back of the skull (+y is behind)
    # THE EYES: two sockets in the brow's shadow, a material on the body's own faces (2 px a socket at the ruler)
    body.data.materials.append(mat('%s_eyes' % tier.lower(), T['eyes']))
    ez = top - 0.075   # the sockets sit at the brow whatever is on the head (cycle 2: a hat's line put them under the brim)
    front = min((M @ f.center).y for f in body.data.polygons if (M @ f.center).z > ez - 0.15)
    for f in body.data.polygons:
        c = M @ f.center
        if ez - 0.07 <= c.z <= ez - 0.025 and c.y < front + 0.045 and 0.01 < abs(c.x) < 0.065: f.material_index = len(body.data.materials) - 1
    if 'cap' in T:
        capm = mat('%s_cap' % tier.lower(), C['colour'])   # the crown and the folded brim are one knit: one material
        lift('%s_cap' % tier.lower(), lambda p: p.z >= cz - 0.025 * (p.y > 0.0), lambda p: C['t'], C['colour'], rim=0.01, subdiv=1, material=capm)
        lift('%s_cap_brim' % tier.lower(), lambda p: cz - 0.025 * (p.y > 0.0) <= p.z <= cz + C['brim_m'] - 0.025 * (p.y > 0.0), lambda p: C['brim_t'], C['colour'], rim=0.012, subdiv=1, material=capm)
    elif 'peak' in T:
        peaked_cap(C, top)
    elif 'hat' in T:
        hat(C, top)   # (a head='portrait' tier wears PORTRAIT's head and its gear instead: whole())

    # 3. THE WEAPON: a length of pipe in the right fist, every vertex on the hand bone
    W = T.get('weapon')
    if W:
        hb = arm.data.bones['Skeleton_arm_joint_R__3_']; eb = arm.data.bones['Skeleton_arm_joint_R__2_']
        wrist = arm.matrix_world @ hb.head_local; elbow = arm.matrix_world @ eb.head_local
        fore = (wrist - elbow).normalized()
        fist = wrist + fore * 0.075
        axis = (fore * 0.9 + mathutils.Vector((0, -1, 0)) * 0.3).normalized()   # carried low at his side, the far end ahead of the knee
        L = W['back'] + W.get('grip', W['fore'])   # a machete's cylinder is its grip only; the blade is its own flat piece
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=W['r'], depth=L)
        p = bpy.context.active_object; p.name = '%s_%s' % (tier.lower(), W['kind'])
        rot = mathutils.Vector((0, 0, 1)).rotation_difference(axis)
        p.rotation_mode = 'QUATERNION'; p.rotation_quaternion = rot
        p.location = fist + axis * (L / 2 - W['back'])
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        def join(c):
            for o in sc.objects: o.select_set(o in (p, c))
            bpy.context.view_layer.objects.active = p; bpy.ops.object.join()
        if W['kind'] == 'pipe':   # a collar near each end (a pipe fitting): the silhouette's one feature
            for t_ in (W['fore'] - 0.03, -W['back'] + 0.02):
                bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=W['r'] * 1.45, depth=0.035)
                c = bpy.context.active_object; c.rotation_mode = 'QUATERNION'; c.rotation_quaternion = rot; c.location = fist + axis * t_
                bpy.ops.object.transform_apply(location=True, rotation=True, scale=True); join(c)
        elif W['kind'] == 'hatchet':   # a wedge head at the far end, its edge turned away from the body (outward, +x is his left)
            out_ = axis.cross(mathutils.Vector((0, 1, 0))).normalized()
            if out_.x > 0: out_ = -out_   # the right hand is at -x: the blade points away from the leg
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            c = bpy.context.active_object
            c.scale = (0.11, 0.022, 0.065)   # 11 cm out, 2.2 cm thick, 6.5 cm tall at the edge
            frame = mathutils.Matrix((out_, out_.cross(axis).normalized(), axis)).transposed()   # columns: blade out, flat, along the haft
            c.rotation_mode = 'QUATERNION'; c.rotation_quaternion = frame.to_quaternion()
            c.location = fist + axis * (W['fore'] - 0.04) + out_ * 0.04
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
            for v in c.data.vertices:   # the wedge: thin at the edge, flared top and bottom (a bearded axe)
                q = v.co - (fist + axis * (W['fore'] - 0.04) + out_ * 0.04); along_out = q.dot(out_)
                if along_out > 0:
                    flat = out_.cross(axis).normalized()
                    v.co -= flat * q.dot(flat) * 0.8
                    v.co += axis * q.dot(axis) * 0.5
            join(c)
        elif W['kind'] == 'machete':   # Battle Brothers' falchion as a machete: a flat blade, the spine in line with the grip, a belly toward the tip, a clipped point
            out_ = axis.cross(mathutils.Vector((0, 1, 0))).normalized()
            if out_.x > 0: out_ = -out_
            g0, f0 = W['grip'] - 0.01, W['fore']
            prof = ((g0, -0.014), (f0 - 0.10, -0.014), (f0 - 0.025, -0.004), (f0, 0.014), (f0 - 0.035, 0.042), (g0 + 0.26, 0.044), (g0 + 0.06, 0.030), (g0, 0.026))
            bm = bmesh.new(); vs = [bm.verts.new(fist + axis * t_ + out_ * e_) for t_, e_ in prof]; bm.faces.new(vs)
            me = bpy.data.meshes.new('%s_blade' % tier.lower()); bm.to_mesh(me); bm.free()
            c = bpy.data.objects.new(me.name, me); sc.collection.objects.link(c)
            bpy.context.view_layer.objects.active = c
            for o in sc.objects: o.select_set(o is c)
            so = c.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.006; so.offset = 0; so.use_rim = True
            bpy.ops.object.modifier_apply(modifier='rim')
            p.data.materials.append(mat('%s_%s' % (tier.lower(), W['kind']), W['colour'], rough=0.8))   # the grip, first
            c.data.materials.append(mat('%s_blade' % tier.lower(), W['blade'], rough=0.8))
            join(c)
        if not p.data.materials: p.data.materials.append(mat('%s_%s' % (tier.lower(), W['kind']), W['colour'], rough=0.8))
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


def whole(tier, body_glb, out):
    """ONE ID, ONE WHOLE PERSON: PORTRAIT's head for this tier (the starred poacher face, rule 115h) modelled onto THIS
    body by PORTRAIT's own tool, read and called, never edited: its table row is copied (or, for a tier PORTRAIT has no
    row for, HEADS above on PORTRAIT's THUG row), its body path pointed at this lane's new body, and the result written
    to this lane's folder. The face is PORTRAIT's face, untouched."""
    ph = portrait()
    if tier in ph.PEOPLE: row = dict(ph.PEOPLE[tier])
    else:
        h = dict(HEADS[tier]); row = dict(ph.PEOPLE[h.pop('base')]); row.update(h)
    row['body'] = os.path.relpath(body_glb, ROOT)
    ph.PEOPLE[tier] = row
    ph.build(tier, out)


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
    d.text((12, 24), '57 px a metre (1.72 m = 98 px), one pixel size, block 1 | palette: records/target/BOHEMIA_STYLE_PALETTE.json, every base colour a step of a role | ONE light: the rig\'s sun, upper left, above', fill=(160, 154, 140))
    import textwrap
    for i, ln in enumerate(textwrap.wrap('every garment is geometry on the man\'s bones: ' + TIERS[tier]['what'], 170)[:2]): d.text((12, 38 + 10 * i), ln, fill=(160, 154, 140))
    def strip(ims, y, labels):
        x = 12
        for im, lb in zip(ims, labels):
            S.paste(GROUND, (x, y, x + cw, y + ch)); S.paste(im, (x, y), im); d.text((x, y + ch + 2), lb, fill=(160, 154, 140)); x += cw + 6
    y = 58; d.text((12, y), 'EIGHT FACINGS, STILL (the passing pose)', fill=(200, 190, 120)); strip(row1, y + 14, fac)
    y += ch + 34; d.text((12, y), 'THE WALK, S then SE, 6 DRAWN KEYS = 2 BEATS AT 120 (%s%s)' % (('the %s swings with the hand: it is on the hand bone' % TIERS[tier]['weapon']['kind']) if TIERS[tier].get('weapon') else 'the %s rides the chest bone across his back; his hands are empty' % TIERS[tier]['slung']['kind'],
                                                                                             '; the shield rides the left forearm bone, the skirt\'s halves the thigh bones' if 'shield' in TIERS[tier] else ''), fill=(200, 190, 120))
    strip(row2, y + 14, ['S k%d' % k for k in range(6)] + ['SE k%d' % k for k in range(6)])
    y += ch + 34
    d.text((12, y), 'OURS (the model)  |  HIS TWIN TODAY: the game\'s own flat %s as last painted   at 1:1, then 4x' % tier, fill=(200, 190, 120)); y += 16
    x = 12
    for im in (s1, tw): S.paste(GROUND, (x, y, x + im.width, y + im.height)); S.paste(im, (x, y), im); x += im.width + 16
    x += 24
    for im in (s1, tw):
        b = im.resize((im.width * 4, im.height * 4), Image.NEAREST); S.paste(GROUND, (x, y, x + b.width, y + b.height)); S.paste(b, (x, y), b); x += b.width + 16
    y += 4 * max(ch, tw.height) + 10
    c = rig.get('card_guide') or rig['card']
    d.text((12, y), 'the card on the S still, under the style guide (class %s): %s' % (c.get('cls', c.get('family')), c['verdict']), fill=(200, 190, 120))
    for i, r in enumerate(c['rows']): d.text((12 + (i % 2) * 560, y + 16 + 14 * (i // 2)), r, fill=(150, 144, 132))
    d.text((12, y + 78), 'colours across the set %d; model %s; rendered %s' % (rig['colours'], rig['model'], rig['still']), fill=(120, 116, 108))
    os.makedirs(os.path.dirname(out), exist_ok=True); S.save(out); print('sheet', out)


if __name__ == '__main__':
    if sys.argv[1] == '--sheet':
        sheet(sys.argv[2].upper(), sys.argv[3], sys.argv[4])
    elif sys.argv[1] == '--whole':
        whole(sys.argv[2].upper(), os.path.abspath(sys.argv[3]), os.path.abspath(sys.argv[4]))
    else:
        tier = sys.argv[1].upper(); out = sys.argv[2]
        build(tier, os.path.abspath(out))
