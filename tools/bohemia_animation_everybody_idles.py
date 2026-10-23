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


# ------------------------------------------------------------------------------------------------ the work (bpy)
def job_of(tag):
    """his job, seeded off his look inside his gang's leaning (the source's work.by_gang)"""
    W = source()['work']; P = next((p for p in json.load(open(os.path.join(ROOT, PEOPLE_ROLL))) if 'person_' + p['id'].lower() == tag), None)
    g = (P['gang'] if P else 'body').lower()
    jobs = W['by_gang'].get(g) or W['by_gang']['body']
    h = 2166136261
    for ch in tag: h = ((h ^ ord(ch)) * 16777619) & 0xffffffff
    return jobs[h % len(jobs)]


def pose_work(src, out, job, real_h):
    """THE WORK (rule 131): his job's prop modelled in the scene and skinned to a bone of its own, then two actions beside
    the ones the model came with: WorkWalk (the walk's six keys as the master rig samples them, his arms holding the thing,
    his feet walking) and Work (the job's distinct poses on his still, the feet planted); the prop is hidden in Stand, so
    the still and its box are his own"""
    import bpy, mathutils
    D = source(); W = D['work']; J = W['jobs'][job]; Bn = D['bones']
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(src))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    ad = arm.animation_data or arm.animation_data_create()
    acts = list(bpy.data.actions)
    for x in acts:
        if not any(s.action == x for t in ad.nla_tracks for s in t.strips):
            nm = x.name.split('_Armature')[0]
            t = ad.nla_tracks.new(); t.name = nm; t.strips.new(nm, int(x.frame_range[0]), x); t.mute = True
    stand = [x for x in acts if x.name.startswith('Stand')][0]; walk_act = [x for x in acts if x.name.startswith('Anim_0')][0]
    ad.action = stand; f0, f1 = stand.frame_range; still = (f0 + f1) / 2
    sc.frame_set(int(still), subframe=still - int(still)); bpy.context.view_layer.update()
    PB = arm.pose.bones
    base = {pb.name: pb.matrix_basis.copy() for pb in PB}
    order = []
    def walk(b):
        order.append(b.name)
        for c in b.children: walk(c)
    for b in arm.data.bones:
        if b.parent is None: walk(b)
    V = lambda t: mathutils.Vector(t)
    Fv, Uv, Lv = V(F), V(U), V(L)
    # model units a real metre: the model stands model_top_m tall for real_height_for_rig (CHARACTER's build record)
    gj = os.path.join(os.path.dirname(os.path.abspath(src)), os.path.basename(src)[:-4] + '.json')
    k = (json.load(open(gj))['model_top_m'] / real_h) if os.path.exists(gj) else 0.89
    la, ra = PB[Bn['LA']].head.copy(), PB[Bn['RA']].head.copy()
    G0 = (la + ra) / 2; G0 = G0 - Uv * G0.dot(Uv)   # the ground between his feet (the floor is the armature's zero height)
    legs = [(Bn['LT'], Bn['LS'], Bn['LA']), (Bn['RT'], Bn['RS'], Bn['RA'])]
    feet = {a: (PB[a].head.copy(), PB[a].matrix.to_3x3().copy()) for _, _, a in legs}

    def rot(pb, P, R):
        pb.matrix = mathutils.Matrix.Translation(P) @ R @ mathutils.Matrix.Translation(-P) @ pb.matrix
        bpy.context.view_layer.update()

    def two_bone(b1, b2, b3, target, pole):
        """the chain's end on the target (or as near as it reaches), the middle joint toward the pole"""
        H = PB[b1].head.copy(); K0 = PB[b2].head.copy(); A0 = PB[b3].head.copy()
        l1, l2 = (K0 - H).length, (A0 - K0).length
        d = target - H; dist = min(d.length, (l1 + l2) * 0.999); n = d.normalized()
        p = pole - n * pole.dot(n); p = p.normalized() if p.length > 1e-6 else Fv
        a_ = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist); h = math.sqrt(max(0.0, l1 * l1 - a_ * a_))
        K = H + n * a_ + p * h
        q = (K0 - H).rotation_difference(K - H); rot(PB[b1], H, q.to_matrix().to_4x4())
        K1 = PB[b2].head.copy(); A1 = PB[b3].head.copy()
        q = (A1 - K1).rotation_difference((H + n * dist) - K1); rot(PB[b2], K1, q.to_matrix().to_4x4())

    def plant():
        for t, s, a in legs:
            At, Rf = feet[a]
            two_bone(t, s, a, At, Fv)
            M = Rf.to_4x4(); M.translation = PB[a].matrix.translation; PB[a].matrix = M
            bpy.context.view_layer.update()

    def point(spec):
        ref, (f_, u_, l_) = spec
        o = G0 if ref == 'G' else PB[Bn['P']].head.copy()
        return o + (Fv * f_ + Uv * u_ + Lv * l_) * k

    # THE PROP: a mesh in the armature's space, its own frame at the armature's origin (f, u, l -> the armature's axes),
    # skinned to a parentless bone whose pose matrix IS where the prop is
    P_ = W['props'][J['prop']]
    verts, faces, mats, fmat = [], [], [], []
    def matidx(rgb):
        key = tuple(round(c, 3) for c in rgb)
        if key not in mats: mats.append(key)
        return mats.index(key)
    def quad(a, b, c, d, mi): faces.append((a, b, c, d)); fmat.append(mi)
    def box(c, s, rgb):
        mi = matidx(rgb); i0 = len(verts)
        for dx in (-0.5, 0.5):
            for dy in (-0.5, 0.5):
                for dz in (-0.5, 0.5):
                    verts.append(Fv * (c[0] + dx * s[0]) * k + Uv * (c[1] + dy * s[1]) * k + Lv * (c[2] + dz * s[2]) * k)
        for a, b, c_, d in ((0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)): quad(i0 + a, i0 + b, i0 + c_, i0 + d, mi)
    def cyl(p0, p1, r, rgb, n=8):
        mi = matidx(rgb); a0 = (Fv * p0[0] + Uv * p0[1] + Lv * p0[2]) * k; a1 = (Fv * p1[0] + Uv * p1[1] + Lv * p1[2]) * k
        ax = (a1 - a0).normalized(); e1 = ax.orthogonal().normalized(); e2 = ax.cross(e1)
        i0 = len(verts)
        for i in range(n):
            t = 2 * math.pi * i / n; o = (e1 * math.cos(t) + e2 * math.sin(t)) * r * k
            verts.append(a0 + o); verts.append(a1 + o)
        for i in range(n):
            j = (i + 1) % n; quad(i0 + 2 * i, i0 + 2 * j, i0 + 2 * j + 1, i0 + 2 * i + 1, mi)
        faces.append(tuple(i0 + 2 * i for i in range(n))[::-1]); fmat.append(mi); faces.append(tuple(i0 + 2 * i + 1 for i in range(n))); fmat.append(mi)
    for part in P_['parts']:
        if part[0] == 'box': box(part[1], part[2], tuple(part[3]))
        else: cyl(part[1], part[2], part[3], tuple(part[4]))
    me = bpy.data.meshes.new('prop_' + J['prop']); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    for rgb in mats:
        m = bpy.data.materials.new('prop_%s_%d' % (J['prop'], len(me.materials))); m.use_nodes = True; bs = m.node_tree.nodes['Principled BSDF']
        bs.inputs['Base Color'].default_value = rgb + (1,); bs.inputs['Roughness'].default_value = 0.85
        me.materials.append(m)
    for i, poly in enumerate(me.polygons): poly.material_index = fmat[i]
    ob = bpy.data.objects.new('prop_' + J['prop'], me); sc.collection.objects.link(ob)
    bpy.ops.object.select_all(action='DESELECT'); bpy.context.view_layer.objects.active = arm; arm.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    eb = arm.data.edit_bones.new('prop_' + J['prop']); eb.head = (0, 0, 0); eb.tail = (0, 0.05, 0); eb.roll = 0; eb.use_deform = True
    bpy.ops.object.mode_set(mode='OBJECT')
    PB = arm.pose.bones; pbp = PB['prop_' + J['prop']]
    rest = arm.data.bones['prop_' + J['prop']].matrix_local.copy()
    ob.parent = arm; ob.matrix_world = arm.matrix_world.copy()
    vg = ob.vertex_groups.new(name='prop_' + J['prop']); vg.add(list(range(len(me.vertices))), 1.0, 'REPLACE')
    mo = ob.modifiers.new('Armature', 'ARMATURE'); mo.object = arm
    base['prop_' + J['prop']] = mathutils.Matrix.Identity(4)
    order.append('prop_' + J['prop'])
    TINY = mathutils.Matrix.Diagonal((1e-4, 1e-4, 1e-4, 1.0))

    def place(spec):
        """the prop's frame: 'at' a point (its axes the body's), or 'from' its origin 'to' a point along its +u"""
        if 'at' in spec:
            M = mathutils.Matrix.Translation(point(spec['at']))
        else:
            a, b = point(spec['from']), point(spec['to']); u = (b - a).normalized()
            q = Uv.rotation_difference(u); M = mathutils.Matrix.Translation(a) @ q.to_matrix().to_4x4()
        pbp.matrix = M @ rest; bpy.context.view_layer.update()
        return M

    def reach(spec, M):
        """each hand's wrist on its grip: a number is a length along the prop's +u in metres, a list a point on the prop
        ([f, u, l] in its frame) or on the body (['G'|'P', [f, u, l]])"""
        for side, val in spec.items():
            u1, f1, h1 = (Bn['RU'], Bn['RF'], Bn['RH']) if side == 'R' else (Bn['LU'], Bn['LF'], Bn['LH'])
            if isinstance(val, (int, float)): tgt = M @ (Uv * val * k)
            elif isinstance(val[0], str): tgt = point(val)
            else: tgt = M @ ((Fv * val[0] + Uv * val[1] + Lv * val[2]) * k)
            side_v = -Lv if side == 'R' else Lv
            two_bone(u1, f1, h1, tgt, (-Uv * 0.5 - Fv * 0.6 + side_v * 0.7))

    def ops_apply(ops):
        nm = lambda op: Bn[op[1]] if op[0] == 'MOVE' else Bn[op[0]]
        for op in sorted(ops, key=lambda op: order.index(nm(op)) if nm(op) in order else -1):
            if op[0] == 'MOVE':
                pb = PB[Bn[op[1]]]; v = (Fv * op[2][0] + Uv * op[2][1] + Lv * op[2][2])
                pb.matrix = mathutils.Matrix.Translation(v) @ pb.matrix; bpy.context.view_layer.update()
            else:
                pb = PB[Bn[op[0]]]
                rot(pb, pb.matrix.translation.copy(), mathutils.Matrix.Rotation(math.radians(op[2]), 4, V(AX[op[1]])))

    def key_all(fr):
        for pb in PB:
            for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)

    # the prop hidden in Stand and the walk the model came with
    for a_ in (stand, walk_act):
        ad.action = a_
        for fr in a_.frame_range: pbp.matrix_basis = TINY; pbp.keyframe_insert('scale', frame=fr); pbp.keyframe_insert('location', frame=fr); pbp.keyframe_insert('rotation_quaternion', frame=fr)
    # WorkWalk: the walk's six keys, the arms laid back to the still's and then on the prop
    ad.action = walk_act; w0, w1 = walk_act.frame_range; unders = []
    for i in range(6):
        fr = w0 + (w1 - w0) * (i + 0.5) / 6
        sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr)); bpy.context.view_layer.update()
        unders.append({pb.name: pb.matrix_basis.copy() for pb in PB})
    act = bpy.data.actions.new('WorkWalk'); ad.action = act
    held = set(J['walk']['reach'])   # an arm that holds nothing keeps the walk's own swing
    chains = {'R': set(arm_chain(arm, Bn['RU'])), 'L': set(arm_chain(arm, Bn['LU']))}
    for fr, i in [(0, 0)] + [(2 * i + 1, i) for i in range(6)] + [(12, 5)]:
        for pb in PB:
            if pb.name == pbp.name: continue
            if any(pb.name in chains[s_] for s_ in held): pb.matrix_basis = base[pb.name].copy()
            else: pb.matrix_basis = unders[i][pb.name].copy()
        bpy.context.view_layer.update()
        M = place(J['walk']['place']); reach(J['walk']['reach'], M); key_all(fr)
    t = ad.nla_tracks.new(); t.name = 'WorkWalk'; t.strips.new('WorkWalk', 0, act); t.mute = True
    # Work: the job's distinct poses on his still, the feet planted
    names = list(J['poses']); act = bpy.data.actions.new('Work'); ad.action = act; n = len(names)
    for fr, i in [(0, 0)] + [(2 * i + 1, i) for i in range(n)] + [(2 * n, n - 1)]:
        for pb in PB: pb.matrix_basis = base[pb.name].copy()
        bpy.context.view_layer.update()
        Pz = J['poses'][names[i]]
        ops_apply(Pz['body']); plant()
        M = place(Pz['place']); reach(Pz['reach'], M); key_all(fr)
    t = ad.nla_tracks.new(); t.name = 'Work'; t.strips.new('Work', 0, act); t.mute = True
    ad.action = None
    for pb in PB: pb.matrix_basis = base[pb.name].copy()
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format='GLB', export_skins=True, export_animations=True, export_apply=False,
                              use_selection=False, export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    print('POSED WORK', job, out, names)


def arm_chain(arm, top):
    out = []
    def down(b):
        out.append(b.name)
        for c in b.children: down(c)
    down(arm.data.bones[top]); return out


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
    def to_pal(a, P):   # each distinct colour matched once
        u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
        dd = ((u.astype(np.int32)[:, None, :] - P[None, :, :]) ** 2).sum(2)
        a[..., :3] = P[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); return a
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
        # where the map's cell sits in the full frame both renders share (the same model, still and camera: checked above):
        # RUN's bake lays each picture's middle on the cell's middle and the look's lowest painted standing row on the
        # cell's foot, so a crop pixel (px, py) lands at (w/2 - iw/2 + px, foot - gfoot + py). Never the old render's
        # ground_px: before the master rig's round seven it was the look point, not the feet (CHARACTER's body, 50 px
        # off: his head went above the map's frame and was cut, seen on the real map 10/23)
        st = [Image.open(os.path.join(ROOT, rec, 'rig_%s.png' % f)) for f in FIGHT_DIRS]
        gfoot = max(im.getbbox()[3] for im in st); iw = st[0].size[0]
        fx0 = mine['crop_box_px'][0] - (m['w'] // 2 - iw // 2); fy0 = mine['crop_box_px'][1] - (m['foot'] - gfoot)
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


# ------------------------------------------------------------------------------------------------ the valley's people
# THE ROLLED PEOPLE (RUN TWO [no two people alike], 10/23): every keeper, every man in a town's crowd and every man in a
# gang's party on the map is one of 152 people rolled from CHARACTER's pieces. Each is built by RUN TWO's own build (its
# tool run, never edited; the model kept for the work clips), the bare idles laid on that model as it is (the street's
# still is its own Stand, so nothing else is posed under them), and rendered on the master rig at the street's settings
# (the same samples, real height and camera: his Stand here is the still the settlement draws, checked in `people_pack`).
# An order that covers every gang and the places' own people a man at a time, so a part-run still reaches every screen.
PEOPLE_ROLL = 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json'
PEOPLE_STILLS = 'records/target/character/barber'   # the stills the screens draw (RUN TWO's renders)
PEOPLE_MODELS = 'records/character/rig'


def people_list():
    """the men on COMBAT's board first (the fight is where he plays most), then every gang and the places' people a man at
    a time"""
    R = json.load(open(os.path.join(ROOT, PEOPLE_ROLL))); groups = {}
    for p in R: groups.setdefault(p['gang'], []).append(p['id'])
    order = []
    for k in range(max(len(v) for v in groups.values())):
        for g in sorted(groups):
            if k < len(groups[g]): order.append(groups[g][k])
    fp = set(t[len('person_'):] for t in fight_people())
    return [p for p in order if p.lower() in fp] + [p for p in order if p.lower() not in fp]


def person_done(tag):
    return os.path.exists(os.path.join(ROOT, RENDERS, tag, 'made.txt'))


def work_done(tag):
    return os.path.exists(os.path.join(ROOT, RENDERS, tag + '_work', 'work.txt'))


def walker(tag):
    """a man RUN TWO walks on the settlement's lanes: he has a walk sheet of his own"""
    return os.path.exists(os.path.join(ROOT, 'slices/rig_walk', tag + '.json'))


def fight_people():
    """RUN TWO's rolled men on COMBAT's board (slices/fight_rig/fight_rig.json, kind 'person'): their gang's cell and guns"""
    F = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    return {k: v for k, v in F['looks'].items() if v.get('kind') == 'person'}


def carry_done(tag):
    return os.path.exists(os.path.join(ROOT, RENDERS, tag + '_carry', 'carry.txt'))


def carry_one(pid):
    """a fight man's gun-held idles (the carry set over COMBAT's low ready, imported) on his own model, at the street's
    settings; his guns are his gang's, as on his fight sheet"""
    tag = 'person_' + pid.lower(); py = sys.executable
    glb = os.path.join(ROOT, PEOPLE_MODELS, 'barber_%s.glb' % tag); gj = glb.replace('.glb', '.json')
    kept = open(gj).read() if os.path.exists(gj) else None
    if not os.path.exists(glb) or kept is None:
        bj = os.path.join(ROOT, PEOPLE_MODELS, tag + '.json'); bkept = open(bj).read() if os.path.exists(bj) else None
        run([py, 'tools/bohemia_run2_no_two_people_alike.py', 'build-one', pid], glb)
        for fn_, txt in ((gj, kept), (bj, bkept)):   # RUN TWO's committed records of the build stand as they are
            if txt is not None:
                with open(fn_, 'w') as f: f.write(txt)
    h = json.load(open(gj))['real_height_for_rig']
    posed = os.path.join(ROOT, POSED, tag + '_carry.glb')
    run([py, os.path.abspath(__file__), 'pose_sets', glb, posed, 'carry'], posed)
    out = os.path.join(ROOT, RENDERS, tag + '_carry')
    render_model(posed, out, h, [('Stand', 1), ('IdleCarry', len(source()['sets']['carry']['poses']))])
    os.remove(posed)
    for f in os.listdir(out):
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    with open(os.path.join(out, 'carry.txt'), 'w') as f: f.write('carry\n')
    print('CARRY person', pid, flush=True)


def person_one(pid):
    tag = 'person_' + pid.lower()
    if not person_done(tag): person_idles(pid)
    if tag in fight_people() and not carry_done(tag):
        try: carry_one(pid)
        except BaseException as e: print('CARRY FAILED', pid, e, flush=True)
    if walker(tag) and not work_done(tag):
        try: work_one(pid)
        except BaseException as e: print('WORK FAILED', pid, e, flush=True)


def work_one(pid):
    """rule 131: his job's prop and clips on his own model (kept by the idles' pass, else built again), rendered at the
    street's settings into <tag>_work"""
    tag = 'person_' + pid.lower(); py = sys.executable
    glb = os.path.join(ROOT, PEOPLE_MODELS, 'barber_%s.glb' % tag); gj = glb.replace('.glb', '.json')
    kept = open(gj).read() if os.path.exists(gj) else None
    if not os.path.exists(glb) or kept is None:
        bj = os.path.join(ROOT, PEOPLE_MODELS, tag + '.json'); bkept = open(bj).read() if os.path.exists(bj) else None
        run([py, 'tools/bohemia_run2_no_two_people_alike.py', 'build-one', pid], glb)
        for fn_, txt in ((gj, kept), (bj, bkept)):   # RUN TWO's committed records of the build stand as they are
            if txt is not None:
                with open(fn_, 'w') as f: f.write(txt)
    h = json.load(open(gj))['real_height_for_rig']; job = job_of(tag)
    posed = os.path.join(ROOT, POSED, tag + '_work.glb')
    run([py, os.path.abspath(__file__), 'pose_work', glb, posed, job, str(h)], posed)
    out = os.path.join(ROOT, RENDERS, tag + '_work')
    render_model(posed, out, h, [('Stand', 1), ('WorkWalk', 6), ('Work', len(source()['work']['jobs'][job]['poses']))])
    os.remove(posed)
    for f in os.listdir(out):
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    with open(os.path.join(out, 'work.txt'), 'w') as f: f.write(job + '\n')
    print('WORK person', pid, job, flush=True)


def work(arg='ALL', workers=4):
    todo = [p for p in people_list() if (arg.upper() == 'ALL' or p == arg) and walker('person_' + p.lower()) and not work_done('person_' + p.lower())]
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // max(1, workers))),
               BOHEMIA_BPY=os.environ.get('BOHEMIA_BPY') or sys.executable)
    procs = []
    for w in range(max(1, workers)):
        mine = todo[w::max(1, workers)]
        if not mine: continue
        sh = ' ; '.join('%s %s work_one %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


def work_sheets():
    """RUN TWO's walk sheet of every walker with his work rendered, made again the way its own walk_sheets() makes it (his
    still, then the six keys of his walk, eight turns, every cell one box with his ground pixel at one spot, his own 256
    colours) with the work after it: the six keys of his walk carrying the job's thing, then the job's poses. The json
    says which: 'walk' is the carrying walk (the screen's own key, so no code changes), 'walk_plain' his walk without it,
    'work' the stop's loop, three keys a beat, column by column as the source's timeline holds them."""
    from PIL import Image
    D = source(); WJ = D['work']['jobs']
    od = os.path.join(ROOT, 'slices/rig_walk'); n = 0
    dirs = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
    for fn in sorted(os.listdir(os.path.join(ROOT, RENDERS))):
        if not fn.endswith('_work') or not work_done(fn[:-5]): continue
        tag = fn[:-5]; wd = os.path.join(ROOT, RENDERS, fn)
        if not walker(tag): continue
        job = open(os.path.join(wd, 'work.txt')).read().strip(); J = WJ[job]; names = list(J['poses'])
        stow = os.path.join(ROOT, 'records/run2/people', tag)
        src = stow if os.path.exists(os.path.join(stow, 'rig_S.png')) else os.path.join(ROOT, PEOPLE_STILLS, tag)
        rr = json.load(open(os.path.join(ROOT, PEOPLE_STILLS, tag, 'rig.json'))); rw = json.load(open(os.path.join(wd, 'rig.json')))
        gx, gy = rr['crop_box_px'][0] + rr['ground_px'][0], rr['crop_box_px'][1] + rr['ground_px'][1]   # his ground pixel, in the full frame
        cb_r = rr['crop_box_px'][:2]
        cb_w = (gx - rw['ground_px'][0], gy - rw['ground_px'][1])   # the work's crop laid so its ground pixel is his (a frame two pixels wider shifts)
        # THE MATCH (as the idles'): his work render's still against RUN TWO's, every facing; a man built again a different
        # colour keeps RUN TWO's own sheet (his walk without work), never two men on one lane
        import numpy as np
        worst = (1.0, 0.0)
        for t in dirs:
            A = Image.open(os.path.join(wd, 'rig_%s.png' % t)).convert('RGBA'); B = Image.open(os.path.join(src, 'rig_%s.png' % t)).convert('RGBA')
            Z = Image.new('RGBA', (rr['res'] + 64, rr['res'] + 64)); Y = Z.copy()
            Z.alpha_composite(A, (32 + cb_w[0], 32 + cb_w[1])); Y.alpha_composite(B, (32 + cb_r[0], 32 + cb_r[1]))
            a_, b_ = np.asarray(Z).astype(int), np.asarray(Y).astype(int); oa, ob = a_[..., 3] > 127, b_[..., 3] > 127
            ag = (oa & ob).sum() / max(1, (oa | ob).sum()); st = float(np.abs(a_[..., :3] - b_[..., :3])[oa & ob].mean()) if (oa & ob).any() else 255.0
            worst = (min(worst[0], ag), max(worst[1], st))
        plain = worst[0] < PEOPLE_MATCH['alpha'] or worst[1] > PEOPLE_MATCH['rgb']
        if plain: print('NO MATCH, his work waits (RUN TWO\'s own sheet stands):', tag, round(worst[0], 3), round(worst[1], 1))
        rows = []
        for t in dirs:
            row = [(Image.open(os.path.join(src, 'rig_%s.png' % t)).convert('RGBA'), cb_r)]
            row += [(Image.open(os.path.join(src, 'rig_Anim_0_%s_k%02d.png' % (t, k))).convert('RGBA'), cb_r) for k in range(6)]
            if not plain:
                row += [(Image.open(os.path.join(wd, 'rig_WorkWalk_%s_k%02d.png' % (t, k))).convert('RGBA'), cb_w) for k in range(6)]
                row += [(Image.open(os.path.join(wd, 'rig_Work_%s_k%02d.png' % (t, k))).convert('RGBA'), cb_w) for k in range(len(names))]
            rows.append(row)
        bb = [(cb[0] + b[0], cb[1] + b[1], cb[0] + b[2], cb[1] + b[3]) for row in rows for im, cb in row for b in [im.getbbox()] if b]
        half = max(max(gx - b[0], b[2] - gx) for b in bb) + 1
        top, bot = min(b[1] for b in bb), max(b[3] for b in bb)
        w, h, foot = 2 * half, bot - top + 1, gy - top
        cols = len(rows[0])
        sheet = Image.new('RGBA', (w * cols, h * 8), (0, 0, 0, 0))
        for r, row in enumerate(rows):
            for c, (im, cb) in enumerate(row): sheet.alpha_composite(im, (c * w + half - gx + cb[0], r * h - top + cb[1]))
        sheet.quantize(256, method=Image.FASTOCTREE, dither=Image.NONE).save(os.path.join(od, tag + '.png'), optimize=True)
        if plain:   # RUN TWO's walk_sheets() layout and json, as its own tool writes them
            with open(os.path.join(od, tag + '.json'), 'w') as f:
                json.dump(dict(w=w, h=h, foot=foot, mid=half, cols=7, dirs=dirs, walk=[1, 2, 3, 4, 5, 6], still=0, look=tag), f); f.write('\n')
            continue
        first = 13
        loop = [first + names.index(p) for p, keys in J['timeline'] for _ in range(keys)]
        with open(os.path.join(od, tag + '.json'), 'w') as f:
            json.dump(dict(w=w, h=h, foot=foot, mid=half, cols=cols, dirs=dirs, walk=[7, 8, 9, 10, 11, 12], still=0, look=tag,
                           walk_plain=[1, 2, 3, 4, 5, 6], work=loop, job=job, work_poses=names,
                           work_src='ANIMATION [everybody idles] rule 131: records/target/animation/BOHEMIA_EVERYBODY_IDLES.json work.jobs.' + job), f); f.write('\n')
        n += 1
    print('work sheets', n, '->', os.path.relpath(od, ROOT))


def person_idles(pid):
    tag = 'person_' + pid.lower(); py = sys.executable
    glb = os.path.join(ROOT, PEOPLE_MODELS, 'barber_%s.glb' % tag); gj = glb.replace('.glb', '.json')
    kept = open(gj).read() if os.path.exists(gj) else None   # RUN TWO's committed record of his build: his real height stays its own
    if not os.path.exists(glb) or kept is None:
        bj = os.path.join(ROOT, PEOPLE_MODELS, tag + '.json'); bkept = open(bj).read() if os.path.exists(bj) else None
        run([py, 'tools/bohemia_run2_no_two_people_alike.py', 'build-one', pid], glb)
        for fn_, txt in ((gj, kept), (bj, bkept)):   # RUN TWO's committed records of the build stand as they are
            if txt is not None:
                with open(fn_, 'w') as f: f.write(txt)
    body = os.path.join(ROOT, PEOPLE_MODELS, tag + '.glb')
    if os.path.exists(body): os.remove(body)   # the mannequin under him: the build's own scrap (RUN TWO deletes it too)
    posed = os.path.join(ROOT, POSED, tag + '.glb')
    run([py, os.path.abspath(__file__), 'pose_sets', glb, posed, 'bare'], posed)
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    out = os.path.join(ROOT, RENDERS, tag)
    render_model(posed, out, h, [('Stand', 1), ('IdleBare', len(source()['sets']['bare']['poses']))])
    os.remove(posed)
    for f in os.listdir(out):   # the master rig's raw frames and shadows: nothing here reads them
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    stamp = 'unknown'
    try:
        import re
        stamp = re.search(r"^STAMP = '([^']+)'", open(os.path.join(ROOT, 'tools/bohemia_run2_no_two_people_alike.py')).read(), re.M).group(1)
    except Exception: pass
    with open(os.path.join(out, 'made.txt'), 'w') as f: f.write(stamp + '\n')
    print('IDLES person', pid, flush=True)


PEOPLE_MATCH = dict(alpha=0.98, rgb=4)   # his Stand here against the still the screens draw: the same build, so nearly exact


def people_pack():
    """every rolled person with his renders in: slices/rig_idles/<tag>_bare.webp and <tag>.json (the settlement and the crew
    card), and his map cells on one sheet per map sheet of RUN TWO's (slices/rig_idles/map_<sheet>.webp, map_people.json),
    added to the index beside the cast and the gangs; a man whose Stand does not match the still the screens draw keeps
    his still. Cells here sit in his render's full frame (dx, dy from its top left), and `feet` is where his still stands in
    that frame, facing by facing: the still's own middle column and the row under its lowest painted pixel, the two numbers
    the settlement draws the still by (BohemiaRigBodies.standing), so an idle lands where the still stood."""
    import numpy as np
    from PIL import Image
    D = source(); G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    thr = int(G['alpha_threshold'])
    bare = list(D['sets']['bare']['poses']); mposes = list(D['sets']['map']['poses'])
    ip = os.path.join(ROOT, OUT, 'rig_idles.json'); index = json.load(open(ip))
    MX = json.load(open(os.path.join(ROOT, 'slices/rig_mix/index.json')))
    sheet_of = {l: n for n, ls in MX['sheets'].items() for l in ls}
    mix_meta, mix_pal = {}, {}
    dirty = set()   # the map sheets a newly packed man stands on: only those are drawn again

    def full(fn, r, off=(0, 0), res=None):
        """a render laid in a full frame: its own, or (off, res) the still's, shifted so the two ground pixels agree"""
        a = np.asarray(Image.open(fn).convert('RGBA')).copy(); R = res or r['res']
        x0, y0 = r['crop_box_px'][:2] if a.shape[0] != r['res'] or a.shape[1] != r['res'] else (0, 0)
        x0 += off[0]; y0 += off[1]; z = np.zeros((R, R, 4), np.uint8)
        xa, ya = max(0, -x0), max(0, -y0); xb, yb = min(a.shape[1], R - x0), min(a.shape[0], R - y0)
        if xb > xa and yb > ya: z[y0 + ya:y0 + yb, x0 + xa:x0 + xb] = a[ya:yb, xa:xb]
        return z

    def cut(a):
        op = a[..., 3] > thr; a = a.copy(); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
        ys, xs = np.nonzero(op)
        if not len(xs): return None
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        return a[y0:y1, x0:x1].copy(), int(x0), int(y0)

    def to_pal(a, P):
        u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
        dd = ((u.astype(np.int32)[:, None, :] - P[None, :, :]) ** 2).sum(2)
        out = a.copy(); out[..., :3] = P[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8)
        out[a[..., 3] == 0] = 0
        return out

    def layout(items, width):
        order = sorted(range(len(items)), key=lambda i: -items[i][0].shape[0]); x = y = sh = 0; rects = [None] * len(items)
        for i in order:
            h, w = items[i][0].shape[:2]
            if x + w > width: x = 0; y += sh; sh = 0
            rects[i] = [x, y, w, h, int(items[i][1]), int(items[i][2])]; x += w; sh = max(sh, h)
        return rects

    def atlas(items, width):
        rects = layout(items, width)
        im = Image.new('RGBA', (width, max(r[1] + r[3] for r in rects) if rects else 1), (0, 0, 0, 0))
        for i, (a, _, _) in enumerate(items): im.paste(Image.fromarray(a, 'RGBA'), (rects[i][0], rects[i][1]))
        return im, rects

    maps = {}   # map sheet -> [(cut, dx, dy)], {tag: poses}
    n_ok = 0
    for tag in sorted(os.listdir(os.path.join(ROOT, RENDERS))):
        d = os.path.join(ROOT, RENDERS, tag); rec = os.path.join(ROOT, PEOPLE_STILLS, tag)
        if not tag.startswith('person_') or not person_done(tag) or not os.path.exists(os.path.join(rec, 'rig.json')): continue
        mine_j, cache = os.path.join(ROOT, OUT, tag + '.json'), os.path.join(d, 'map_cells.npz')
        if os.path.exists(mine_j) and os.path.exists(cache) and os.path.getmtime(mine_j) >= os.path.getmtime(os.path.join(d, 'made.txt')):
            index['looks'][tag] = dict(json=tag + '.json'); n_ok += 1   # packed already: his sheet stands, his map cells from the cache
            z = np.load(cache, allow_pickle=True); n = str(z['sheet'])
            if n:
                L = maps.setdefault(n, ([], {})); mp = {}
                for (p, row, x, y), a in zip(z['keys'].tolist(), z['cells']):
                    mp.setdefault(p, [None] * 8)[int(row)] = len(L[0]); L[0].append((a, int(x), int(y)))
                L[1][tag] = mp
            continue
        rj = json.load(open(os.path.join(d, 'rig.json'))); mine = json.load(open(os.path.join(rec, 'rig.json')))
        # his render laid on the still's frame by the two ground pixels (a model built again can be a millimetre deeper, and
        # the master rig's frame two pixels wider: measured on person_trades_0, 230 against 232)
        off = (mine['crop_box_px'][0] + mine['ground_px'][0] - rj['crop_box_px'][0] - rj['ground_px'][0],
               mine['crop_box_px'][1] + mine['ground_px'][1] - rj['crop_box_px'][1] - rj['ground_px'][1])
        mfull = lambda fn: full(fn, rj, off, mine['res'])
        # THE MATCH, all eight facings
        worst = (1.0, 0.0)
        for f in FIGHT_DIRS:
            A = mfull(os.path.join(d, 'rig_%s.png' % f)).astype(np.int32); B = full(os.path.join(rec, 'rig_%s.png' % f), mine).astype(np.int32)
            oa, ob = A[..., 3] > 127, B[..., 3] > 127; ag = (oa & ob).sum() / max(1, (oa | ob).sum())
            st = float(np.abs(A[..., :3] - B[..., :3])[oa & ob].mean()) if (oa & ob).any() else 255.0
            worst = (min(worst[0], ag), max(worst[1], st))
        if worst[0] < PEOPLE_MATCH['alpha'] or worst[1] > PEOPLE_MATCH['rgb']:
            print('NO MATCH, keeps his still:', tag, round(worst[0], 3), round(worst[1], 1)); continue
        # where his still stands, facing by facing, in the full frame
        cb = mine['crop_box_px']; feet = []; stills = []
        for f in FIGHT_DIRS:
            im = Image.open(os.path.join(rec, 'rig_%s.png' % f)).convert('RGBA'); stills.append(im)
            al = np.asarray(im)[..., 3]; rows = np.nonzero((al > 24).any(1))[0]
            feet.append([round(cb[0] + im.size[0] / 2, 1), int(cb[1] + (rows.max() + 1 if len(rows) else im.size[1]))])
        cuts = {}
        for pi, p in enumerate(bare):
            for row, f in enumerate(FIGHT_DIRS):
                c = cut(mfull(os.path.join(d, 'rig_IdleBare_%s_k%02d.png' % (f, pi))))
                if c is not None: cuts[(p, row)] = c
        # his 64 colours (the fight sheet's count), read off his own idles by median cut
        mosaic = np.concatenate([c[0].reshape(-1, 4) for c in cuts.values()])
        mosaic = mosaic[mosaic[:, 3] > 0][:, :3]
        q = Image.fromarray(mosaic.reshape(1, -1, 3).astype(np.uint8), 'RGB').quantize(64, method=Image.Quantize.MEDIANCUT)
        P = np.array(q.getpalette()[:3 * 64], np.int32).reshape(-1, 3)
        imgs, cells = [], {}
        for (p, row), (a, x0, y0) in cuts.items():
            cells.setdefault(p, [None] * 8)[row] = len(imgs); imgs.append((to_pal(a, P), x0, y0))
        body, rects = atlas(imgs, 2048); fn = tag + '_bare.webp'
        body.save(os.path.join(ROOT, OUT, fn), 'WEBP', lossless=True, quality=100, method=6)
        entry = dict(person=True, foot=feet[0], feet=feet, match=[round(worst[0], 3), round(worst[1], 1)], frame_shift=list(off),
                     sheets=dict(bare=dict(file=fn, cells=rects, size=list(body.size))), poses=dict(bare={p: cells.get(p, [None] * 8) for p in bare}))
        json.dump(entry, open(os.path.join(ROOT, OUT, tag + '.json'), 'w'), separators=(',', ':'))
        index['looks'][tag] = dict(json=tag + '.json')
        n_ok += 1
        # THE MAP: his ten on his map sheet's frame (RUN's bake: the picture's middle on the cell's middle, the lowest
        # painted standing row over his eight stills on the cell's foot), in that sheet's own colours
        n = sheet_of.get(tag)
        if not n:
            np.savez(os.path.join(d, 'map_cells.npz'), sheet=np.array(''), keys=np.zeros((0, 4)), cells=np.array([], dtype=object)); continue
        if n not in mix_meta:
            mix_meta[n] = json.load(open(os.path.join(ROOT, 'slices/rig_mix', n + '.json')))
            pa = np.asarray(Image.open(os.path.join(ROOT, 'slices/rig_mix', n + '.png')).convert('RGBA'))
            mix_pal[n] = np.array(sorted(set(map(tuple, pa[pa[..., 3] > 0][:, :3].tolist()))), np.int32)
        m = mix_meta[n]
        gfoot = max(im.getbbox()[3] for im in stills); iw = stills[0].size[0]
        fx0 = cb[0] - (m['w'] // 2 - iw // 2); fy0 = cb[1] - (m['foot'] - gfoot)
        L = maps.setdefault(n, ([], {})); dirty.add(n)
        mp = {}; keys, cl = [], []
        for p in mposes:
            for row in range(8):
                c = cuts.get((p, row))
                if c is None: continue
                a_ = to_pal(c[0], mix_pal[n]); x_, y_ = c[1] - fx0, c[2] - fy0
                mp.setdefault(p, [None] * 8)[row] = len(L[0]); L[0].append((a_, x_, y_))
                keys.append((p, row, x_, y_)); cl.append(a_)
        L[1][tag] = mp
        ca = np.empty(len(cl), dtype=object)
        for i_, a_ in enumerate(cl): ca[i_] = a_
        np.savez(os.path.join(d, 'map_cells.npz'), sheet=np.array(n), keys=np.array(keys, dtype=object), cells=ca)
    mj = dict(what='ANIMATION [everybody idles]: the map\'s rolled people (RUN TWO\'s sheets in slices/rig_mix), ten idles each, '
                   'a sheet per map sheet; a cell [x, y, w, h, dx, dy] sits from that map sheet\'s cell origin', files={}, looks={})
    for n, (items, looks) in sorted(maps.items()):
        fn = 'map_%s.webp' % n
        if n in dirty or not os.path.exists(os.path.join(ROOT, OUT, fn)):
            im, rects = atlas(items, 2048)
            im.save(os.path.join(ROOT, OUT, fn), 'WEBP', lossless=True, quality=100, method=6)
        else:   # the same men in the same order: the same layout, the sheet on disk stands
            rects = layout(items, 2048); im = Image.open(os.path.join(ROOT, OUT, fn))
        mj['files'][fn] = rects
        for tag, poses in looks.items(): mj['looks'][tag] = dict(mix=n, file=fn, poses=poses)
        print('PACKED map', n, im.size, os.path.getsize(os.path.join(ROOT, OUT, fn)), len(looks), 'people', flush=True)
    json.dump(mj, open(os.path.join(ROOT, OUT, 'map_people.json'), 'w'), separators=(',', ':'))
    index['map_people'] = dict(json='map_people.json')
    # THE FIGHT'S ROLLED MEN (RUN TWO put 51 on COMBAT's board, each packed into his gang's cell by his ground pixel, his
    # gang's guns in his hands): fight_<tag>.json, his cells in that cell's frame. Bare: the very cells of his street sheet,
    # moved (no second picture). Gun-held: his carry renders, in his fight sheet's colours with its one-pixel rim, and his
    # gang's gun-held idle guns (the same skeleton, poses and cell, as RUN TWO gave him his gang's gun sheet).
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); RIM = tuple(FR['rim'])
    for k in [k for k in index['looks'] if k.startswith('fight_person_')]: del index['looks'][k]
    nf = 0
    for tag, fl in sorted(fight_people().items()):
        sj = os.path.join(ROOT, OUT, tag + '.json'); cd_ = os.path.join(ROOT, RENDERS, tag + '_carry'); ref = fl.get('ref')
        rj_ref = os.path.join(ROOT, OUT, (ref or '') + '.json')
        if tag not in index['looks'] or not carry_done(tag) or not os.path.exists(rj_ref): continue
        fj = os.path.join(ROOT, OUT, 'fight_' + tag + '.json')
        if os.path.exists(fj) and os.path.getmtime(fj) >= max(os.path.getmtime(sj), os.path.getmtime(os.path.join(cd_, 'carry.txt'))):
            index['looks']['fight_' + tag] = dict(json='fight_' + tag + '.json'); nf += 1; continue
        S = json.load(open(sj)); rec = os.path.join(ROOT, PEOPLE_STILLS, tag); mine = json.load(open(os.path.join(rec, 'rig.json')))
        gx, gy = mine['crop_box_px'][0] + mine['ground_px'][0], mine['crop_box_px'][1] + mine['ground_px'][1]
        fx0, fy0 = gx - fl['foot'][0], gy - fl['foot'][1]   # his fight cell's origin in his street frame
        bare = dict(S['sheets']['bare']); bare['cells'] = [[c[0], c[1], c[2], c[3], c[4] - fx0, c[5] - fy0] for c in bare['cells']]
        rc = json.load(open(os.path.join(cd_, 'rig.json')))
        off = (gx - rc['crop_box_px'][0] - rc['ground_px'][0], gy - rc['crop_box_px'][1] - rc['ground_px'][1])
        fs = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', fl['file'])).convert('RGBA'))
        P = np.array(sorted(set(map(tuple, fs[fs[..., 3] > 0][:, :3].tolist()))), np.int32)
        imgs, cells = [], {}
        for pi, p in enumerate(D['sets']['carry']['poses']):
            for row, f in enumerate(FIGHT_DIRS):
                c = cut(full(os.path.join(cd_, 'rig_IdleCarry_%s_k%02d.png' % (f, pi)), rc, off, mine['res']))
                if c is None: continue
                a, x0, y0 = c; a = np.pad(a, ((1, 1), (1, 1), (0, 0))); op = a[..., 3] > 0
                near = np.zeros_like(op)
                near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                a = to_pal(a, P); a[near & ~op] = RIM + (255,) if len(RIM) == 3 else RIM
                cells.setdefault(p, [None] * 8)[row] = len(imgs); imgs.append((a, x0 - 1 - fx0, y0 - 1 - fy0))
        body, rects = atlas(imgs, 2048); fn = 'fight_%s_carry.webp' % tag
        body.save(os.path.join(ROOT, OUT, fn), 'WEBP', lossless=True, quality=100, method=6)
        G = json.load(open(rj_ref)).get('guns')
        entry = dict(person_of=tag, fight=fl['file'], foot=fl['foot'], guns=G, guns_of=ref,
                     sheets=dict(bare=bare, carry=dict(file=fn, cells=rects, size=list(body.size))),
                     poses=dict(bare=S['poses']['bare'], carry={p: cells.get(p, [None] * 8) for p in D['sets']['carry']['poses']}))
        json.dump(entry, open(fj, 'w'), separators=(',', ':'))
        index['looks']['fight_' + tag] = dict(json='fight_' + tag + '.json'); nf += 1
    print('PACKED fight people', nf, 'of', len(fight_people()), flush=True)
    json.dump(index, open(ip, 'w'), separators=(',', ':'))
    print('PACKED people', n_ok, 'with idles;', len(mj['looks']), 'on the map', flush=True)


def people(arg='ALL', workers=4):
    todo = [p for p in people_list() if (arg.upper() == 'ALL' or p == arg) and not person_done('person_' + p.lower())]
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // max(1, workers))),
               BOHEMIA_BPY=os.environ.get('BOHEMIA_BPY') or sys.executable)
    procs = []
    for w in range(max(1, workers)):
        mine = todo[w::max(1, workers)]
        if not mine: continue
        sh = ' ; '.join('%s %s person_one %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


# ------------------------------------------------------------------------------------------------ preview (bpy)
def preview(glb, out, set_name='bare', facings='S,SE,E,N'):
    if set_name.startswith('work:'):   # work:<job>: the WorkWalk's six and the job's poses, one row each
        J = source()['work']['jobs'][set_name[5:]]
        return preview_clips(glb, out, [('WorkWalk', 6), ('Work', len(J['poses']))], facings)
    return preview_clips(glb, out, [(CLIP[set_name], len(pose_list(source(), set_name)))], facings, beast=set_name == 'beast')


def preview_clips(glb, out, clips, facings='S,SE,E,N', beast=False):
    """a quick look at every pose of a set at four facings (Cycles 8 samples, 3x), to judge the bone turns before the real
    render; never shipped"""
    import bpy, mathutils
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(glb))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
    objs = [o for o in sc.objects if o.type == 'MESH']
    root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
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
    from PIL import Image
    FA = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; fs = facings.split(',')
    cols = max(n for _, n in clips)
    sheet = Image.new('RGBA', (240 * cols, 240 * len(fs) * len(clips)), (70, 66, 60, 255))
    tmp = os.path.join(os.path.dirname(os.path.abspath(out)), '_pv.png')
    for ci, (name, n) in enumerate(clips):
        a0, a1 = MR.clip_actions(sc, name)
        for i in range(n):
            fr = a0 + (a1 - a0) * (i + 0.5) / n; sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
            for r, f in enumerate(fs):
                root.rotation_euler = (0, 0, math.radians(180 - 45 * FA.index(f)))
                sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
                im = Image.open(tmp).convert('RGBA'); sheet.alpha_composite(im, (240 * i, 240 * (r + ci * len(fs))))
    sheet.save(out); print('PREVIEW', out, clips)


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
        def to_pal(a):   # each distinct colour matched once, then laid back on every pixel
            u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
            dd = ((u.astype(np.int32)[:, None, :] - pal[None, :, :]) ** 2).sum(2)
            a[..., :3] = pal[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); return a
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
        # what his model holds in a fist (COOK THREE's tiers: the thug's pipe, the poacher's hatchet), read off the render's
        # own parts: it swings with his arm below his soles, and the feet gate is told so
        parts = set(k for c in rj['clips'].values() for f in c['motion_px'] for key in c['motion_px'][f] for k in key)
        held = sorted(p for p in parts if any(w in p.lower() for w in ('pipe', 'hatchet', 'club', 'bat', 'knife', 'axe', 'machete', 'spear')))
        if held: entry['held'] = held
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
    elif cmd == 'person_one': person_one(a[0])
    elif cmd == 'carry_one': carry_one(a[0])
    elif cmd == 'pose_work': pose_work(a[0], a[1], a[2], float(a[3]))
    elif cmd == 'work_one': work_one(a[0])
    elif cmd == 'work': work(a[0] if a else 'ALL', int(a[1]) if len(a) > 1 else 4)
    elif cmd == 'work_sheets': work_sheets()
    elif cmd == 'people_pack': people_pack()
    elif cmd == 'people': people(a[0] if a else 'ALL', int(a[1]) if len(a) > 1 else 4)
    elif cmd == 'preview': preview(*a)
    elif cmd == 'pack': pack()
    elif cmd == 'packmap':   # the map's sheet alone, into the index as it stands
        ix = json.load(open(os.path.join(ROOT, OUT, 'rig_idles.json'))); pack_map(ix)
        json.dump(ix, open(os.path.join(ROOT, OUT, 'rig_idles.json'), 'w'), separators=(',', ':'))
    else: sys.exit('pose | fight [LOOK|ALL] [workers] | preview <glb> <png> [bare|carry] | pack')
