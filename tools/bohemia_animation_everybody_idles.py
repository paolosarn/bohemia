#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [everybody idles] (rule 130(a), Paolo 10/23, LOCKED: 'we need a lot of idle animations; right now
everyone's standing still, making my brain fry; it's looking like a chess man and I don't want that vibe at all').
NOBODY STANDS LIKE A CHESS PIECE.

MEASURED FIRST (10/23): every screen with a person drew a man standing as ONE picture. The fight's waiting men: one cell
('stand', or 'carry' with a gun), turning only to face a foe. The settlement's keepers and crowd: one render, turned an
eighth now and then. The crew screen: one render, mid-stride. The map's party and crowds at rest: one still (the map's
draw already takes a 'breathe' list and nobody filled it). The fight's beasts: their still. Nobody breathed.

THE SOURCE (rule 128, every asset a kept scene): records/target/animation/BOHEMIA_EVERYBODY_IDLES.json. Every pose is a
list of bone turns on the rig's man (the skeleton every person in the game is built on, so one list fits all of them),
every clip a list of HELD keys, three a beat at 120 (Crashbox stop-motion holds, rule 115(d); nothing between two keys is
ever drawn). Two sets: BARE (his hands free: breathing on one leg then the other, look around, roll the shoulders,
scratch, stretch, smoke, lean, shift the strap) and CARRY (the gun held in both hands at the low ready, COMBAT's carry:
breathing, look around, roll the shoulders, check the gun, shift the grip). After every pose the feet go back where they
stood (a two-bone reach, knees forward), so a weight shift bends the free knee and nobody skates.

THE STEPS (Blender's Python for pose/render/guns: bpy 4.2 in a python3.11 venv, as the master rig; plain python3 for pack):
    <venv>/bin/python tools/bohemia_animation_everybody_idles.py pose <in.glb> <out.glb>
        the two sets laid on any man as two actions, IdleBare and IdleCarry, one key per distinct pose (the timelines in the
        source say how long each is held), beside every action the model came with; a cigarette in his right hand and the
        breath he lets out ride the smoke poses only
    <venv>/bin/python tools/bohemia_animation_everybody_idles.py fight [LOOK|ALL] [workers]
        every man the fight dresses (COMBAT's posed models, records/combat/rig/<look>.glb, rebuilt by its own tool's
        `bodies` when missing): posed here, then rendered by DIRECTION's master rig exactly the way COMBAT renders the fight
        (its render(), imported and called: the same camera, sun, scale, samples), Stand first so the still and the box
        are the look's own, into records/target/animation/idles/<look>/; then COMBAT's guns rendered in his hands on the
        carry idles (its own tool run with two changes made in memory: the clip list and where the carry is read)
    python3 tools/bohemia_animation_everybody_idles.py pack
        slices/rig_idles/<look>_<set>.webp (every distinct pose of the set, eight facings, each cell cut to what is drawn,
        packed tight; a set a sheet, so the fight loads only the gun-held poses and a town only the bare ones),
        <look>_guns.webp (the three guns on the carry cells), and slices/rig_idles/rig_idles.json: the cells, the feet,
        the timelines and the sets; the colours are the look's own fight sheet's (slices/fight_rig/<look>.webp), so a man
        who stops walking keeps every colour he walked in
    engine/bohemia_idles.js plays them: one call per person per frame, his own offset and his own handful of idles.

REUSE CHECK: the bodies are PORTRAIT's and CHARACTER's builds posed by COMBAT's tool; the carry is COMBAT's carry_ops,
imported; the render is COMBAT's render() over DIRECTION's master rig, imported and called; the guns are COMBAT's tool,
run; nothing drawn by hand. REFERENCE CHECK (the 9/4 standing duty): the compare law: the twin of every idle is the same
man's own stand and carry cell on the fight's sheet, side by side at the fight's pixels (the record); analog horror AH-01,
the held key; no reference game.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_EVERYBODY_IDLES.json')
POSED = 'records/animation/idles'                 # the posed models (regenerated, .gitignore)
COMBAT_POSED = 'records/combat/rig'              # COMBAT's posed men and beasts (its tool's `bodies`)
RENDERS = 'records/target/animation/idles'        # the master rig's renders (regenerated, .gitignore)
OUT = 'slices/rig_idles'
CLIP = {'bare': 'IdleBare', 'carry': 'IdleCarry', 'beast': 'IdleBeast', 'map': 'IdleMap'}
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
F, U, L = (1, 0, 0), (0, -1, 0), (0, 0, 1)
AX = {'F': F, 'U': U, 'L': L}


def source():
    return json.load(open(SRC))


def pose_list(D, set_name):
    """the distinct poses of a set, in the order they are keyed: each pose's ops, its parts joined"""
    S = D['sets'][set_name]
    return [(name, [op for part in parts for op in D['parts'][part]]) for name, parts in S['poses'].items()]


# ------------------------------------------------------------------------------------------------ pose (bpy)
def pose(src, out, sets=('bare', 'carry')):
    import bpy, mathutils
    D = source(); B = D['bones']
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_combat_the_fight_poses as CP   # COMBAT's carry, never copied
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(src))
    for o in list(sc.objects):   # the importer's stray 42-vertex Icosphere (the master rig drops it too)
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    ad = arm.animation_data or arm.animation_data_create()
    acts = list(bpy.data.actions)
    for x in acts:   # every action the model came with stays on its own NLA track (the exporter writes every track)
        if not any(s.action == x for t in ad.nla_tracks for s in t.strips):
            nm = x.name.split('_Armature')[0]
            t = ad.nla_tracks.new(); t.name = nm; t.strips.new(nm, int(x.frame_range[0]), x); t.mute = True
    stand = [x for x in acts if x.name.startswith('Stand')][0]
    ad.action = stand; f0, f1 = stand.frame_range; still = (f0 + f1) / 2   # COMBAT's still: the Stand's middle
    sc.frame_set(int(still), subframe=still - int(still)); bpy.context.view_layer.update()
    PB = arm.pose.bones
    base = {pb.name: pb.matrix_basis.copy() for pb in PB}
    order = []
    def walk(b):
        order.append(b.name)
        for c in b.children: walk(c)
    for b in arm.data.bones:
        if b.parent is None: walk(b)
    legs = [(B['LT'], B['LS'], B['LA']), (B['RT'], B['RS'], B['RA'])]
    feet = {a: (PB[a].head.copy(), PB[a].matrix.to_3x3().copy()) for _, _, a in legs}   # where he stands: the ankles and the feet's turn

    def rot(pb, P, R):
        pb.matrix = mathutils.Matrix.Translation(P) @ R @ mathutils.Matrix.Translation(-P) @ pb.matrix
        bpy.context.view_layer.update()

    def plant():
        """two-bone reach: each thigh and shin turned so the ankle is back where it stood, the knee forward; the foot keeps
        its turn on the ground"""
        fwd = mathutils.Vector(F)
        for t, s, a in legs:
            H = PB[t].head.copy(); K0 = PB[s].head.copy(); A0 = PB[a].head.copy(); At, Rf = feet[a]
            l1, l2 = (K0 - H).length, (A0 - K0).length
            d = At - H; dist = min(d.length, (l1 + l2) * 0.9999); n = d.normalized()
            p = fwd - n * fwd.dot(n); p = p.normalized() if p.length > 1e-6 else mathutils.Vector((1, 0, 0))
            a_ = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist); h = math.sqrt(max(0.0, l1 * l1 - a_ * a_))
            K = H + n * a_ + p * h
            q = (K0 - H).rotation_difference(K - H); rot(PB[t], H, q.to_matrix().to_4x4())
            K1 = PB[s].head.copy(); A1 = PB[a].head.copy()
            q = (A1 - K1).rotation_difference(At - K1); rot(PB[s], K1, q.to_matrix().to_4x4())
            M = Rf.to_4x4(); M.translation = PB[a].matrix.translation; PB[a].matrix = M
            bpy.context.view_layer.update()

    def apply(ops):
        for pb in PB: pb.matrix_basis = base[pb.name].copy()
        bpy.context.view_layer.update()
        name = lambda op: op[1] if op[0] == 'MOVE' else op[0]
        for op in sorted(ops, key=lambda op: order.index(name(op)) if name(op) in order else -1):
            if op[0] == 'MOVE':
                pb = PB[op[1]]; v = sum((mathutils.Vector(AX[k]) * float(x) for k, x in zip('FUL', op[2])), mathutils.Vector())
                pb.matrix = mathutils.Matrix.Translation(v) @ pb.matrix; bpy.context.view_layer.update()
            else:
                pb = PB[op[0]]; ax = op[1] if isinstance(op[1], (tuple, list)) else AX[op[1]]
                rot(pb, pb.matrix.translation.copy(), mathutils.Matrix.Rotation(math.radians(op[2]), 4, mathutils.Vector(ax)))
        plant()

    def named(ops):   # the source names bones by their short names
        return [(['MOVE', B[o[1]], o[2]] if o[0] == 'MOVE' else [B[o[0]], o[1], o[2]]) for o in ops]

    # THE PROPS: a cigarette in his right hand and the breath he lets out, each SKINNED to a bone of its own (prop_<name>, a
    # child of the hand or the head), never a separate rigid part: the master rig's HOLD anchors a skinned part to the
    # nearest rigid part, and a cigarette there carried his shoes with his head's turn (measured 10/23, the longcoat's feet
    # 3 px low on lookR facing S). Shown only in the smoke poses (the prop bone's scale keyed), hidden everywhere else and
    # in the still the master rig measures him by (keyed into Stand too). Made in the REST pose, where skinning reads them.
    def mat(nm, rgb, emit=None):
        m = bpy.data.materials.new(nm); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = rgb + (1,); b.inputs['Roughness'].default_value = 1.0
        if emit: b.inputs['Emission Color'].default_value = emit + (1,); b.inputs['Emission Strength'].default_value = 2.0
        return m
    arm.data.pose_position = 'REST'; bpy.context.view_layer.update()
    W = arm.matrix_world; Winv = W.inverted()
    rh = W @ PB[B['RH']].head; rf = W @ PB[B['RF']].head; hand = (rh - rf).normalized()
    hd = W @ PB[B['H']].head; facing = (W.to_3x3() @ mathutils.Vector(F)).normalized(); left = (W.to_3x3() @ mathutils.Vector(L)).normalized()
    up = (W.to_3x3() @ mathutils.Vector(U)).normalized()
    def cig():
        c = rh + hand * 0.13   # past the fingers, so the fist does not swallow it
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.009, depth=0.075, location=c)
        o = bpy.context.active_object; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(hand)
        o.data.materials.append(mat('cig_paper', (0.78, 0.74, 0.66)))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=0.0095, location=c + hand * 0.04)
        e = bpy.context.active_object; e.data.materials.append(mat('cig_ember', (0.55, 0.16, 0.05), emit=(0.9, 0.3, 0.08)))
        return [o, e], c
    def puff():
        out_ = []
        for i, (fw, u_, sd, r) in enumerate([(0.1, 0.06, -0.1, 0.03), (0.13, 0.12, -0.15, 0.04), (0.15, 0.2, -0.17, 0.05)]):   # up and off to his right, beside his head from the front: the head is tipped back, the breath goes up
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=hd + facing * fw + up * u_ + left * sd)
            o = bpy.context.active_object; o.data.materials.append(mat('smoke_%d' % i, (0.52, 0.5, 0.47))); out_.append(o)
        return out_, hd + facing * 0.12 + up * 0.1 + left * -0.13
    made_props = []
    for nm, P_ in D['props'].items():
        bpy.ops.object.select_all(action='DESELECT')
        objs, at = (cig if nm == 'cigarette' else puff)()
        for o in objs: o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]
        if len(objs) > 1: bpy.ops.object.join()
        ob = bpy.context.active_object; ob.name = nm
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)   # its vertices in the world, its origin the world's
        made_props.append((nm, B[P_['bone']], at, ob))
    bpy.ops.object.select_all(action='DESELECT'); bpy.context.view_layer.objects.active = arm; arm.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    for nm, parent, at, ob in made_props:
        eb = arm.data.edit_bones.new('prop_' + nm); eb.head = Winv @ at; eb.tail = eb.head + mathutils.Vector((0, 0, 0.04))
        eb.parent = arm.data.edit_bones[parent]; eb.use_connect = False; eb.use_deform = True
    bpy.ops.object.mode_set(mode='OBJECT')
    PB = arm.pose.bones
    for nm, parent, at, ob in made_props:
        ob.parent = arm; ob.matrix_parent_inverse = W.inverted()
        vg = ob.vertex_groups.new(name='prop_' + nm); vg.add(list(range(len(ob.data.vertices))), 1.0, 'REPLACE')
        mo = ob.modifiers.new('Armature', 'ARMATURE'); mo.object = arm
        base['prop_' + nm] = mathutils.Matrix.Identity(4)
    arm.data.pose_position = 'POSE'; bpy.context.view_layer.update()
    TINY = (1e-4, 1e-4, 1e-4)
    props = {nm: 'prop_' + nm for nm, _, _, _ in made_props}
    # hidden in the still: the Stand action gets the prop bones' scale keyed tiny at both its ends
    ad.action = stand
    for nm, bn in props.items():
        PB[bn].scale = TINY
        for fr in (f0, f1): PB[bn].keyframe_insert('scale', frame=fr)
    ad.action = None

    carry = [list(o) for o in CP.carry_ops()]   # (bone, axis vector, deg): COMBAT's low ready
    made = []
    for set_name in sets:
        poses = pose_list(D, set_name)
        under = carry if D['sets'][set_name]['base'] == 'carry' else []
        name = CLIP[set_name]
        act = bpy.data.actions.new(name); ad.action = act
        n = len(poses)
        keys = [(0, poses[0])] + [(2 * k + 1, poses[k]) for k in range(n)] + [(2 * n, poses[-1])]
        for fr, (pname, ops) in keys:
            apply(under + named(ops))
            for nm, bn in props.items(): PB[bn].scale = (1, 1, 1) if pname in D['props'][nm]['show'] else TINY
            bpy.context.view_layer.update()
            for pb in PB:
                for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)
        t = ad.nla_tracks.new(); t.name = name; t.strips.new(name, 0, act); t.mute = True
        made.append((name, n))
    ad.action = None
    for pb in PB: pb.matrix_basis = base[pb.name].copy()
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format='GLB', export_skins=True, export_animations=True, export_apply=False,
                              use_selection=False, export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    print('POSED', out, made)


# ------------------------------------------------------------------------------------------------ the beasts (bpy)
def pose_beast(src, out):
    """THE BEASTS GET THEIRS (the row: sniff, pant, shake): the beast set laid on a four-legged model (the fox's skeleton every
    beast is built on) as IdleBeast, on the still the master rig reads it by (the passing pose of its Walk, its stand cell),
    so the beast that stops walking stands where it stood. Spine, neck, head and tail only: the feet never move."""
    import bpy, mathutils
    D = source(); B = D['beast_bones']; AXB = {k: tuple(v) for k, v in D['beast_axes'].items() if k in 'FUL'}
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(src))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    objs = [o for o in sc.objects if o.type == 'MESH']
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    ad = arm.animation_data or arm.animation_data_create()
    for x in list(bpy.data.actions):
        if not any(s.action == x for t in ad.nla_tracks for s in t.strips):
            nm = x.name.split('_root')[0].split('_Armature')[0]
            t = ad.nla_tracks.new(); t.name = nm; t.strips.new(nm, int(x.frame_range[0]), x); t.mute = True
    f0, f1 = MR.clip_actions(sc, 'Walk'); still = MR.passing_frame(sc, objs, f0, f1)   # the master rig's own still
    sc.frame_set(int(math.floor(still)), subframe=still - math.floor(still)); bpy.context.view_layer.update()
    PB = arm.pose.bones
    base = {pb.name: pb.matrix_basis.copy() for pb in PB}
    order = []
    def walk(b):
        order.append(b.name)
        for c in b.children: walk(c)
    for b in arm.data.bones:
        if b.parent is None: walk(b)
    def apply(ops):
        for pb in PB: pb.matrix_basis = base[pb.name].copy()
        bpy.context.view_layer.update()
        for b, ax, deg in sorted(ops, key=lambda o: order.index(B[o[0]])):
            pb = PB[B[b]]; P = pb.matrix.translation.copy()
            R = mathutils.Matrix.Rotation(math.radians(deg), 4, mathutils.Vector(AXB[ax]))
            pb.matrix = mathutils.Matrix.Translation(P) @ R @ mathutils.Matrix.Translation(-P) @ pb.matrix
            bpy.context.view_layer.update()
    poses = pose_list(D, 'beast'); n = len(poses)
    for o in sc.objects:   # nothing else plays while the pose is keyed
        if o.animation_data: o.animation_data.action = None
    act = bpy.data.actions.new('IdleBeast'); ad.action = act
    for fr, (pname, ops) in [(0, poses[0])] + [(2 * k + 1, poses[k]) for k in range(n)] + [(2 * n, poses[-1])]:
        apply(ops)
        for pb in PB:
            for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)
    t = ad.nla_tracks.new(); t.name = 'IdleBeast'; t.strips.new('IdleBeast', 0, act); t.mute = True
    ad.action = None
    for pb in PB: pb.matrix_basis = base[pb.name].copy()
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format='GLB', export_skins=True, export_animations=True, export_apply=False,
                              use_selection=False, export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    print('POSED', out, [('IdleBeast', n)])


def beasts(arg='ALL'):
    CF = combat(); py = sys.executable; n = len(source()['sets']['beast']['poses'])
    for name, kind, src in CF.pick(arg):
        if kind != 'beast': continue
        posed = os.path.join(ROOT, COMBAT_POSED, name + '.glb')
        if not os.path.exists(posed): run([py, 'tools/bohemia_combat_the_fight_wears_the_rig.py', 'bodies', name], posed)
        glb = os.path.join(ROOT, POSED, name + '.glb')
        run([py, os.path.abspath(__file__), 'pose_beast', posed, glb], glb)
        CF.POSED, CF.RENDERS = POSED, RENDERS
        CF.BEAST_CLIPS = [('Walk', 6), ('IdleBeast', n)]   # Walk first: the master rig's still and box are the beast's own
        CF.render(name)
        print('IDLES', name, flush=True)


# ------------------------------------------------------------------------------------------------ the map's people
# THE MAP DRAWS ITS OWN MODELS (RUN's two sheets, tools/bohemia_bake_the_rig_cast.py): CHARACTER's thirteen gangs for a gang's
# party, and his body, the barber's three cuts and COOK THREE's three tiers for him, his two men, a crowd and a job. Each is
# rebuilt by its own lane's builder (run, never edited), posed with the map's ten, and rendered the fight's fast way; a model
# whose rebuilt still does not match the picture the map already draws keeps its still (MATCH below: the builder moved on).
MAP_GANGS = ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'colorful', 'homeless', 'mob', 'network', 'reds', 'remnants', 'trades', 'volunteers']
MAP_PEOPLE = {'body': 'records/target/character/rig/body', 'coil_crown': 'records/target/character/barber/coil_crown',
              'temple_taper': 'records/target/character/barber/temple_taper', 'layered_fall': 'records/target/character/barber/layered_fall',
              'thug': 'records/target/cook3/rig/thug', 'marksman': 'records/target/cook3/rig/marksman', 'poacher': 'records/target/cook3/rig/poacher_again'}
MATCH = dict(alpha=0.9, rgb=28)   # the rebuilt still against the map's: silhouette agreement and mean colour step where both are painted


def map_models():
    out = [(g, 'gangs', 'records/target/character/rig/' + g) for g in MAP_GANGS]
    return out + [(k, 'people', v) for k, v in MAP_PEOPLE.items()]


def map_build(name, rec):
    """the map model's own source, by its own lane's builder"""
    rj = json.load(open(os.path.join(ROOT, rec, 'rig.json'))); glb = os.path.join(ROOT, rj['model']); py = sys.executable
    if os.path.exists(glb): return glb, rj
    base = os.path.basename(glb)[:-4]
    if rec.startswith('records/target/character/rig/'):
        run([py, 'tools/bohemia_character_the_thirteen_through_the_rig.py', 'build', name.capitalize(), 'records/character/rig'], glb)
    elif base.startswith('barber_'):
        run([py, 'tools/bohemia_character_the_barber_on_the_skull.py', 'build', base[len('barber_'):]], glb)
    elif base == 'poacher_again':
        body = os.path.join(ROOT, 'records/cook3/rig/poacher_again_body.glb')
        run([py, 'tools/bohemia_cook3_the_tiers_through_the_rig.py', 'POACHER', body], body)
        run([py, 'tools/bohemia_cook3_the_tiers_through_the_rig.py', '--whole', 'POACHER', body, glb], glb)
    else:
        run([py, 'tools/bohemia_cook3_the_tiers_through_the_rig.py', base.upper(), glb], glb)
    return glb, rj


def render_model(glb, out, real_h, clips):
    """DIRECTION's master rig run the way COMBAT runs it for the fight (its two in-memory changes: the movers' light pass off,
    Cycles keeps its scene), samples and dents as COMBAT's"""
    CF = combat()
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    a, b = 'lights.append(light_footprint(', "sc.render.engine = G['engine'];"
    assert src.count(a) == 1 and src.count(b) == 1, 'the master rig changed: re-read it before patching in memory'
    th = int(os.environ.get('BOHEMIA_RIG_THREADS', '0'))
    src = src.replace(a, 'False and lights.append(light_footprint(').replace(b, "sc.render.use_persistent_data = True; " +
        ("sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % th if th else '') + b)
    argv = ['bohemia_direction_master_rig.py', glb, out, '--real-height', str(real_h), '--family', 'none', '--set', 'samples=%d' % CF.SAMPLES,
            '--no-calibration', '--no-id-pass', '--set', 'dent_m=0']
    for c, k in clips: argv += ['--clip', '%s:%d' % (c, k)]
    code = ('import sys; sys.argv = %r; __file__ = %r\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'))) + src
    run([sys.executable, '-c', code], os.path.join(out, 'rig.json'))


def map_one(name):
    rec = dict((m[0], m[2]) for m in map_models())[name]
    glb, rj = map_build(name, rec); py = sys.executable
    stood = os.path.join(ROOT, POSED, 'map_%s_stand.glb' % name)
    run([py, 'tools/bohemia_combat_the_fight_poses.py', glb, stood], stood)   # COMBAT's poses: a Stand for a model that has none
    posed = os.path.join(ROOT, POSED, 'map_%s.glb' % name)
    run([py, os.path.abspath(__file__), 'pose_sets', stood, posed, 'map'], posed)
    out = os.path.join(ROOT, RENDERS, 'map_' + name)
    render_model(posed, out, rj['real_dims_m'][2], [('Stand', 1), ('IdleMap', len(source()['sets']['map']['poses']))])
    print('IDLES map', name, flush=True)


def maps(arg='ALL', workers=1):
    todo = [m[0] for m in map_models() if (arg.upper() == 'ALL' or m[0] == arg) and not os.path.exists(os.path.join(ROOT, RENDERS, 'map_' + m[0], 'rig.json'))]
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // max(1, workers))))
    procs = []
    for w in range(max(1, workers)):
        mine = todo[w::max(1, workers)]
        if not mine: continue
        sh = ' ; '.join('%s %s map_one %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


def pack_map(index):
    """the map's idles on one sheet, cells placed against RUN's sheet cell: the map lays a cell's middle on the 112 frame's
    middle and its ground line at 0.93 of it (rigSheetSet's cut), so a cell here says where it sits from that cell's origin"""
    import numpy as np
    from PIL import Image
    D = source(); G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    poses = list(D['sets']['map']['poses']); imgs, out = [], {}
    pal = {}
    for which, f in (('gangs', 'BOHEMIA_RIG_CAST'), ('people', 'BOHEMIA_RIG_PEOPLE')):
        m = json.load(open(os.path.join(ROOT, 'slices', f + '.json')))
        p_ = np.asarray(Image.open(os.path.join(ROOT, 'slices', f + '.png')).convert('RGBA')); p_ = p_[p_[..., 3] > 0][:, :3]
        pal[which] = (m, np.array(sorted(set(map(tuple, p_.tolist()))), np.int32))
    def to_pal(a, P):
        rgb = a[..., :3].reshape(-1, 3).astype(np.int32); o = np.empty_like(rgb)
        for i in range(0, len(rgb), 65536):
            c = rgb[i:i + 65536]; dd = ((c[:, None, :] - P[None, :, :]) ** 2).sum(2); o[i:i + 65536] = P[dd.argmin(1)]
        a[..., :3] = o.reshape(a.shape[:2] + (3,)).astype(np.uint8); return a
    for name, which, rec in map_models():
        d = os.path.join(ROOT, RENDERS, 'map_' + name)
        if not os.path.exists(os.path.join(d, 'rig.json')): continue
        rj = json.load(open(os.path.join(d, 'rig.json'))); mine = json.load(open(os.path.join(ROOT, rec, 'rig.json')))
        m, P = pal[which]
        # THE MATCH: his rebuilt still beside the still the map draws, facing S, in the full frame
        def fullf(fn, r):
            a = np.asarray(Image.open(fn).convert('RGBA')).astype(np.int32)
            z = np.zeros((r['res'], r['res'], 4), np.int32); x0, y0, x1, y1 = r['crop_box_px']; z[y0:y1, x0:x1] = a; return z
        A = fullf(os.path.join(d, 'rig_S.png'), rj); B = fullf(os.path.join(ROOT, rec, 'rig_S.png'), mine)
        if A.shape != B.shape: print('MISMATCH frame', name); continue
        oa, ob = A[..., 3] > 127, B[..., 3] > 127; agree = (oa & ob).sum() / max(1, (oa | ob).sum())
        step = float(np.abs(A[..., :3] - B[..., :3])[oa & ob].mean()) if (oa & ob).any() else 255
        if agree < MATCH['alpha'] or step > MATCH['rgb']:
            print('NO MATCH, keeps his still:', name, round(agree, 3), round(step, 1)); continue
        # where the map's cell puts his ground point: RUN's bake lays each picture's middle on the cell's middle and the
        # look's lowest painted standing row on the cell's foot
        st = [Image.open(os.path.join(ROOT, rec, 'rig_%s.png' % f)) for f in FIGHT_DIRS]
        gfoot = max(im.getbbox()[3] for im in st); iw = st[0].size[0]
        gx = m['w'] // 2 - iw // 2 + mine['ground_px'][0]; gy = m['foot'] - gfoot + mine['ground_px'][1]
        fx0 = rj['crop_box_px'][0] + rj['ground_px'][0] - gx; fy0 = rj['crop_box_px'][1] + rj['ground_px'][1] - gy
        cells = {}
        for pi, p in enumerate(poses):
            for row, f in enumerate(FIGHT_DIRS):
                a = fullf(os.path.join(d, 'rig_IdleMap_%s_k%02d.png' % (f, pi)), rj).astype(np.uint8)
                op = a[..., 3] > int(G['alpha_threshold']); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
                ys, xs = np.nonzero(op)
                if not len(xs): continue
                y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
                cells.setdefault(p, [None] * 8)[row] = len(imgs); imgs.append((to_pal(a[y0:y1, x0:x1].copy(), P), x0 - fx0, y0 - fy0))
        out[name] = dict(sheet=which, poses=cells, match=[round(agree, 3), round(step, 1)])
    if not imgs: return
    order = sorted(range(len(imgs)), key=lambda i: -imgs[i][0].shape[0]); x = y = sh = 0; rects = [None] * len(imgs); W = 2048
    for i in order:
        h, w = imgs[i][0].shape[:2]
        if x + w > W: x = 0; y += sh; sh = 0
        rects[i] = [x, y, w, h, int(imgs[i][1]), int(imgs[i][2])]; x += w; sh = max(sh, h)
    im = Image.new('RGBA', (W, y + sh), (0, 0, 0, 0))
    for i, (a, _, _) in enumerate(imgs): im.paste(Image.fromarray(a, 'RGBA'), (rects[i][0], rects[i][1]))
    im.save(os.path.join(ROOT, OUT, 'map.webp'), 'WEBP', lossless=True, quality=100, method=6)
    json.dump(dict(file='map.webp', cells=rects, looks=out, sets=dict(gangs='BOHEMIA_RIG_CAST', people='BOHEMIA_RIG_PEOPLE')),
              open(os.path.join(ROOT, OUT, 'map.json'), 'w'), separators=(',', ':'))
    index['map'] = dict(json='map.json')
    print('PACKED map', im.size, os.path.getsize(os.path.join(ROOT, OUT, 'map.webp')), len(out), 'looks', flush=True)


# ------------------------------------------------------------------------------------------------ the fight's men
def combat():
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_combat_the_fight_wears_the_rig as CF
    return CF


def men(arg):
    CF = combat()
    return [l for l in CF.pick(arg) if l[1] != 'beast']


def run(cmd, out):
    """bpy 4.2 headless dies now and then at exit, after the file is written (COMBAT measured it 10/19): a run that wrote
    its output worked; else again, three times at most"""
    import time
    for i in range(3):
        t0 = time.time()
        r = subprocess.call(cmd, cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if r == 0 and os.path.exists(out): return
        if os.path.exists(out) and os.path.getmtime(out) >= t0 - 1: return
    raise SystemExit('FAILED three times: ' + ' '.join(cmd))


def fight_one(name):
    CF = combat()
    D = source(); py = sys.executable
    src = os.path.join(ROOT, COMBAT_POSED, name + '.glb')
    if not os.path.exists(src):   # COMBAT's own build of this man, as its tool makes it
        run([py, 'tools/bohemia_combat_the_fight_wears_the_rig.py', 'bodies', name], src)
    glb = os.path.join(ROOT, POSED, name + '.glb')
    run([py, os.path.abspath(__file__), 'pose', src, glb], glb)
    # the render: COMBAT's render() over the master rig, pointed at this posed model and this folder
    CF.POSED, CF.RENDERS = POSED, RENDERS
    clips = [('Stand', 1)] + [(CLIP[s], len(D['sets'][s]['poses'])) for s in ('bare', 'carry')]
    CF.render(name, clips=clips, suffix='')
    guns(name)
    print('IDLES', name, flush=True)


def guns(name):
    """COMBAT's guns tool on the carry idles: its own render() with two changes made in memory (the clip list is IdleCarry
    only; IdleCarry is held like the Carry it is built on), reading this look's rig.json"""
    D = source(); n = len(D['sets']['carry']['poses'])
    if os.path.exists(os.path.join(ROOT, RENDERS, name, 'guns', 'shotgun_IdleCarry_NW_k%02d.png' % (n - 1))): return
    code = open(os.path.join(ROOT, 'tools/bohemia_combat_the_guns_in_their_hands.py')).read()
    a = "CLIPS = [('Carry', 1), ('CarryWalk', 6), ('Aim', 3), ('Hit', 2), ('Swing', 3)]"
    b = "elif clip in ('Carry', 'CarryWalk'):"
    c = "RENDERS = 'records/target/combat/rig'"
    for s in (a, b, c): assert code.count(s) == 1, 'COMBAT\'s guns tool changed: re-read it before patching in memory'
    code = code.replace(a, "CLIPS = [('IdleCarry', %d)]" % n).replace(b, "elif clip in ('Carry', 'CarryWalk', 'IdleCarry'):").replace(c, "RENDERS = %r" % RENDERS)
    code = code.replace("if __name__ == '__main__':", "if False:")
    prog = ('import sys; sys.argv = [%r]; __file__ = %r\n' % ('guns', os.path.join(ROOT, 'tools/bohemia_combat_the_guns_in_their_hands.py'))) + code + '\nrender(%r)\n' % name
    for i in range(3):
        subprocess.call([sys.executable, '-c', prog], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(os.path.join(ROOT, RENDERS, name, 'guns', 'shotgun_IdleCarry_NW_k%02d.png' % (n - 1))): return
    raise SystemExit('GUNS FAILED ' + name)


def fight(arg, workers=1):
    todo = [l[0] for l in men(arg) if not os.path.exists(os.path.join(ROOT, RENDERS, l[0], 'guns', 'shotgun_IdleCarry_NW_k%02d.png' % (len(source()['sets']['carry']['poses']) - 1)))]
    if workers <= 1:
        for nm in todo: fight_one(nm)
        return
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    procs = []
    for w in range(workers):
        mine = todo[w::workers]
        if not mine: continue
        sh = ' && '.join('%s %s fight_one %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


# ------------------------------------------------------------------------------------------------ preview (bpy)
def preview(glb, out, set_name='bare', facings='S,SE,E,N'):
    """a quick look at every pose of a set at four facings (Cycles 8 samples, 3x), to judge the bone turns before the real
    render; never shipped"""
    import bpy, mathutils
    D = source(); poses = pose_list(D, set_name); name = CLIP[set_name]
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(glb))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
    objs = [o for o in sc.objects if o.type == 'MESH']
    root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
    beast = set_name == 'beast'
    MR.clip_actions(sc, 'Walk' if beast else 'Stand'); sc.frame_set(1); lo, hi = MR.bounds(sc, objs)
    centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z)); k = (1.7 / max(hi.x - lo.x, hi.y - lo.y)) if beast else 1.72 / (hi.z - lo.z)
    for o in list(sc.objects):
        if o.parent is None and o is not root: o.parent = root; o.location -= centre
    root.scale = (k, k, k * 1.414)
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = 2.9
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(45); cam.rotation_euler = (t, 0, 0); cam.location = mathutils.Vector((0, 0, 1.25)) - mathutils.Vector((0, math.sin(t), -math.cos(t))) * 30
    sc.render.resolution_x = sc.render.resolution_y = 240
    MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg']))); sc.cycles.samples = 8; sc.render.film_transparent = True
    a0, a1 = MR.clip_actions(sc, name); n = len(poses)
    from PIL import Image
    FA = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; fs = facings.split(',')
    sheet = Image.new('RGBA', (240 * n, 240 * len(fs)), (70, 66, 60, 255))
    tmp = os.path.join(os.path.dirname(os.path.abspath(out)), '_pv.png')
    for i in range(n):
        fr = a0 + (a1 - a0) * (i + 0.5) / n; sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
        for r, f in enumerate(fs):
            root.rotation_euler = (0, 0, math.radians(180 - 45 * FA.index(f)))
            sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
            im = Image.open(tmp).convert('RGBA'); sheet.alpha_composite(im, (240 * i, 240 * r))
    sheet.save(out); print('PREVIEW', out, [p[0] for p in poses])


# ------------------------------------------------------------------------------------------------ pack (python3)
def pack():
    import numpy as np
    from PIL import Image
    D = source()
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    RIM = tuple(FR['rim'])
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    for fn in os.listdir(os.path.join(ROOT, OUT)):   # everything here is made by this step: last pack's files go first
        if fn.endswith(('.webp', '.json')): os.remove(os.path.join(ROOT, OUT, fn))
    sets = {s: [p for p in D['sets'][s]['poses']] for s in ('bare', 'carry', 'beast')}
    index = dict(version='rig-idles-10-23', lane='animation', row='[everybody idles]', rule='130(a), 128',
                 source='records/target/animation/BOHEMIA_EVERYBODY_IDLES.json (the poses and the timelines), laid on COMBAT\'s posed '
                        'men by tools/bohemia_animation_everybody_idles.py, rendered by DIRECTION\'s master rig the way COMBAT renders the fight',
                 dirs=FIGHT_DIRS, keys_per_beat=3, sets=sets, timelines={k: v for k, v in D['timelines'].items() if k != 'why'},
                 breathe={k: v for k, v in D['breathe'].items() if k != 'why'},
                 idles=D['idles'], guns=['pistol', 'rifle', 'shotgun'], cell='[x, y, w, h, dx, dy]: the cell on the sheet and where its top left '
                 'sits from the look\'s fight-sheet cell origin (so his feet are where they were: the fight sheet\'s foot)', looks={})
    for look in sorted(os.listdir(os.path.join(ROOT, RENDERS))):
        d = os.path.join(ROOT, RENDERS, look)
        if look not in FR['looks'] or not os.path.exists(os.path.join(d, 'rig.json')): continue
        rj = json.load(open(os.path.join(d, 'rig.json')))
        fl = FR['looks'][look]
        if fl.get('kind') != 'beast' and not os.path.exists(os.path.join(d, 'guns', 'shotgun_IdleCarry_NW_k%02d.png' % (len(sets['carry']) - 1))):
            print('SKIP', look, 'his guns are not rendered yet'); continue
        # the look's own fight cell is the frame of reference: the same model, still and camera (Stand first), so the same
        # full frame; his feet are the one point both know (the fight sheet's foot, this render's ground pixel)
        cx0, cy0, cx1, cy1 = rj['crop_box_px']
        fx0 = cx0 + rj['ground_px'][0] - fl['foot'][0]; fy0 = cy0 + rj['ground_px'][1] - fl['foot'][1]   # the fight cell's origin in the full frame
        sheet_pal = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', fl['file'])).convert('RGBA'))
        pal = np.array(sorted(set(map(tuple, sheet_pal[sheet_pal[..., 3] > 0][:, :3].tolist()))), np.int32)   # his painted colours only
        def to_pal(a):
            rgb = a[..., :3].reshape(-1, 3).astype(np.int32); out = np.empty_like(rgb)
            for i in range(0, len(rgb), 65536):
                c = rgb[i:i + 65536]; dd = ((c[:, None, :] - pal[None, :, :]) ** 2).sum(2); out[i:i + 65536] = pal[dd.argmin(1)]
            a[..., :3] = out.reshape(a.shape[:2] + (3,)).astype(np.uint8); return a
        cells, imgs, gcells, gimgs = {}, {}, {}, []   # a sheet per set: the fight loads only the gun-held poses, a town only the bare
        def full(fn, cb):
            a = np.asarray(Image.open(fn).convert('RGBA')).copy()
            if a.shape[0] != rj['res']:   # a cropped render: lay it back into the full frame
                z = np.zeros((rj['res'], rj['res'], 4), np.uint8); z[cb[1]:cb[3], cb[0]:cb[2]] = a; a = z
            return a
        def cut(a, thr):
            op = a[..., 3] > thr; a = a.copy(); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
            ys, xs = np.nonzero(op)
            if not len(xs): return None
            y0, y1, x0, x1 = ys.min() - 1, ys.max() + 2, xs.min() - 1, xs.max() + 2
            a = np.pad(a, ((1, 1), (1, 1), (0, 0)))[y0 + 1:y1 + 1, x0 + 1:x1 + 1].copy(); op = a[..., 3] > 0
            near = np.zeros_like(op)
            near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
            a[near & ~op] = RIM
            return a, x0, y0
        mine = ('beast',) if fl.get('kind') == 'beast' else ('bare', 'carry')
        for s, poses in sets.items():
            if s not in mine: continue
            clip = CLIP[s]
            for pi, p in enumerate(poses):
                for row, f in enumerate(FIGHT_DIRS):
                    a = full(os.path.join(d, 'rig_%s_%s_k%02d.png' % (clip, f, pi)), rj['crop_box_px'])
                    r = cut(a, int(G['alpha_threshold']))
                    if r is None: continue
                    a, x0, y0 = r; a = to_pal(a)
                    lst = imgs.setdefault(s, [])
                    cells.setdefault(s, {}).setdefault(p, [None] * 8)[row] = len(lst); lst.append((a, x0 - fx0, y0 - fy0))
                    if s == 'carry':
                        for gun in index['guns']:
                            ga = full(os.path.join(d, 'guns', '%s_%s_%s_k%02d.png' % (gun, clip, f, pi)), (0, 0, rj['res'], rj['res']))
                            gr = cut(ga, int(G['alpha_threshold']))
                            gcells.setdefault(gun, {}).setdefault(p, [None] * 8)[row] = None if gr is None else len(gimgs)
                            if gr is not None: gimgs.append((to_pal(gr[0]), gr[1] - fx0, gr[2] - fy0))
        def atlas(items, width):
            """shelf packing, tallest first: every cell its own rectangle, so a standing man costs his own pixels, not the
            fall's wide box"""
            order = sorted(range(len(items)), key=lambda i: -items[i][0].shape[0]); x = y = sh = 0; rects = [None] * len(items)
            for i in order:
                h, w = items[i][0].shape[:2]
                if x + w > width: x = 0; y += sh; sh = 0
                rects[i] = [x, y, w, h, int(items[i][1]), int(items[i][2])]; x += w; sh = max(sh, h)
            H = y + sh; im = Image.new('RGBA', (width, H), (0, 0, 0, 0))
            for i, (a, _, _) in enumerate(items): im.paste(Image.fromarray(a, 'RGBA'), (rects[i][0], rects[i][1]))
            return im, rects
        entry = dict(fight=fl['file'], foot=fl['foot'], sheets={}, poses={s: {p: cells[s][p] for p in sets[s]} for s in sets if s in cells})
        for s_, lst in imgs.items():
            body, rects = atlas(lst, 2048); fn = '%s_%s.webp' % (look, s_)
            body.save(os.path.join(ROOT, OUT, fn), 'WEBP', lossless=True, quality=100, method=6)
            entry['sheets'][s_] = dict(file=fn, cells=rects, size=list(body.size))
        if gimgs:
            gim, grects = atlas(gimgs, 1024)
            gim.save(os.path.join(ROOT, OUT, look + '_guns.webp'), 'WEBP', lossless=True, quality=100, method=6)
            entry['guns'] = dict(file=look + '_guns.webp', cells=grects, poses=gcells)
        json.dump(entry, open(os.path.join(ROOT, OUT, look + '.json'), 'w'), separators=(',', ':'))   # a look's cells, fetched only by a screen that draws him
        index['looks'][look] = dict(json=look + '.json')
        print('PACKED', look, {k: v['size'] for k, v in entry['sheets'].items()}, 'guns', gimgs and gim.size, flush=True)
    pack_map(index)
    json.dump(index, open(os.path.join(ROOT, OUT, 'rig_idles.json'), 'w'), separators=(',', ':'))
    print('INDEX', os.path.join(OUT, 'rig_idles.json'), len(index['looks']), 'looks')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[2:]
    if cmd == 'pose': pose(a[0], a[1])
    elif cmd == 'fight_one': fight_one(a[0])
    elif cmd == 'fight': fight(a[0] if a else 'ALL', int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'guns': guns(a[0])
    elif cmd == 'pose_beast': pose_beast(a[0], a[1])
    elif cmd == 'pose_sets': pose(a[0], a[1], tuple(a[2].split(',')))
    elif cmd == 'map_one': map_one(a[0])
    elif cmd == 'maps': maps(a[0] if a else 'ALL', int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'beasts': beasts(a[0] if a else 'ALL')
    elif cmd == 'preview': preview(*a)
    elif cmd == 'pack': pack()
    else: sys.exit('pose | fight [LOOK|ALL] [workers] | preview <glb> <png> [bare|carry] | pack')
