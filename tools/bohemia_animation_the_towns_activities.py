#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the town's activities] (rule 218(a), Paolo 10/26, LOCKED: 'everyone on your company... you can see
them in the settlement, maybe flirting with a girl, maybe drinking some beer, maybe walking around, maybe talking to people...
make it feel alive').

MEASURED FIRST (10/26): the settlement draws its keepers and its crowd idling on their spot (ANIMATION [everybody idles]),
its walkers on their lanes with their work (rule 131), and his lead walking up; his company is not in the picture at all, and
nothing in the bank drinks, sits, talks with a partner, flirts or picks a thing off a stall. The idles' smoke goes back to
standing square after every drag (the cigarette comes and goes), so a man cannot stand there smoking.

THE SOURCE (rule 128): records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json. Six activities, each a loop of HELD
keys (three a beat at 120, Crashbox stop-motion, rule 115(d)) on the rig's man, each with its own breaths on one leg then the
other and a few variants, starting and ending on its own rest pose so any slot follows any: DRINK (a beer bottle at his
belt, a sip, a swig, a look round), SMOKE (the cigarette held low between drags), TALK (his turn with his hands, the other's
turn listening: the partner plays the same clock a slot on), FLIRT (leaning in, a laugh, a hand to the back of his neck; a
hand up on a wall where there is one), SIT (on a crate set on end: hands on his knees, elbows on them, leaning back, a look
round), STALL (bent over the goods, looking along them, a tin picked up, turned over, put back). The pose ops, axes and bones
are the idles' (a part not named here is the idles' part); after every pose the feet go back where they stood (the idles'
two-bone plant), so a weight shift bends the free knee and a man sits with his heels where he stood.

THE STEPS (Blender's Python for pose/render: bpy 4.2 in a python3.11 venv, as the master rig; plain python3 for pack):
    <venv>/bin/python tools/bohemia_animation_the_towns_activities.py pose <in.glb> <out.glb> [act,act]
        every activity laid on any man as an action of its own (TownDrink, TownSmoke, ...: one key per distinct pose),
        beside every action the model came with; the props made in the rest pose and SKINNED to bones of their own (a hand
        prop a child of the hand, the seat a bone of its own on the ground), shown only in the poses that hold them; every
        pose's joints written beside it (<out>.joints.json: the envelope gate's ruler, in metres on the posed model itself)
    <venv>/bin/python tools/bohemia_animation_the_towns_activities.py people [LOOK|ALL|COMPANY] [workers]
        his company's men first (RUN TWO's rolled people the post deals and the company he starts with), each built by RUN
        TWO's own build (run, never edited; its committed records kept), posed here, rendered by DIRECTION's master rig at the
        street's settings (the idles' render_model, imported and called) into records/target/animation/towns/<look>/;
        a man already rendered is skipped, so a killed run resumes
    python3 tools/bohemia_animation_the_towns_activities.py pack
        slices/rig_town/<look>_<act>.webp, a sheet PER ACTIVITY (a man drinking loads only his drink: about 1 MB decoded),
        every cell cut to what is drawn, in his own 64 colours (his bare idles' palette, so a man who stops idling to drink
        keeps every colour), laid in his render's full frame by his ground pixel against the still the screens draw;
        slices/rig_town/<look>.json his cells and feet; slices/rig_town/rig_town.json the activities, timelines and looks
    engine/bohemia_idles.js plays them: BohemiaIdles.activity(look, seed, now, facing, {act}) the cell to draw now.

REUSE CHECK: the bodies are RUN TWO's builds (its tool run); the pose ops, axes, bones, the plant, the cigarette and the puff
are the idles' (records/target/animation/BOHEMIA_EVERYBODY_IDLES.json, tools/bohemia_animation_everybody_idles.py, imported:
render_model, run, people_list, the model keeping); the seat is the work's crate (the idles' source, work.props.crate) set on
end; the render is DIRECTION's master rig, called as the idles call it; nothing drawn by hand. REFERENCE CHECK (the 9/4
standing duty): the compare law's twin of every activity is the same man's own bare idle cell at the same facing, side by side
at the street's pixels (the record); analog horror AH-01, the held key; no reference game.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_animation_everybody_idles as EI   # the idles: their source, render_model, run and the people's keeping

SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json')
POSED = 'records/animation/towns'                # the posed models (regenerated, .gitignore)
RENDERS = 'records/target/animation/towns'       # the master rig's renders and the joints (regenerated, .gitignore)
OUT = 'slices/rig_town'
DIRS = EI.FIGHT_DIRS
F, U, L = EI.F, EI.U, EI.L
AX = EI.AX
JOINTS = ['P', 'C', 'N', 'H', 'RU', 'RF', 'RH', 'LU', 'LF', 'LH', 'RS', 'RA', 'LS', 'LA']


def source():
    return json.load(open(SRC))


def clip(act):
    return 'Town' + act.capitalize()


def acts_of(T, arg=None):
    a = list(T['activities'])
    return [x for x in a if x in arg.split(',')] if arg else a


def pose_list(T, D, act):
    """an activity's distinct poses in key order, each its ops: its parts joined, a part this file does not name read from
    the idles' parts"""
    P = dict(D['parts']); P.update(T['parts'])
    A = T['activities'][act]
    return [(name, [op for part in parts for op in P[part]]) for name, parts in A['poses'].items()]


def shown(T, act, prop, pose_name):
    s = T['activities'][act]['props'].get(prop)
    return s == 'all' or (isinstance(s, list) and pose_name in s)


# ------------------------------------------------------------------------------------------------ pose (bpy)
def pose(src, out, which=None):
    import bpy, mathutils
    T = source(); D = EI.source(); B = D['bones']
    acts = acts_of(T, which)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(src))
    for o in list(sc.objects):   # the importer's stray 42-vertex Icosphere (the master rig drops it too)
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    ad = arm.animation_data or arm.animation_data_create()
    acts0 = list(bpy.data.actions)
    for x in acts0:   # every action the model came with stays on its own NLA track
        if not any(s.action == x for t in ad.nla_tracks for s in t.strips):
            nm = x.name.split('_Armature')[0]
            t = ad.nla_tracks.new(); t.name = nm; t.strips.new(nm, int(x.frame_range[0]), x); t.mute = True
    stand = [x for x in acts0 if x.name.startswith('Stand')][0]
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
    legs = [(B['LT'], B['LS'], B['LA']), (B['RT'], B['RS'], B['RA'])]
    feet = {a: (PB[a].head.copy(), PB[a].matrix.to_3x3().copy()) for _, _, a in legs}
    V = lambda t: mathutils.Vector(t)
    Fv, Uv, Lv = V(F), V(U), V(L)
    gj = os.path.join(os.path.dirname(os.path.abspath(src)), os.path.basename(src)[:-4] + '.json')
    rec = json.load(open(gj)) if os.path.exists(gj) else {}
    k = (rec['model_top_m'] / rec['real_height_for_rig']) if rec.get('real_height_for_rig') else 0.89   # model units a real metre

    def rot(pb, P, R):
        pb.matrix = mathutils.Matrix.Translation(P) @ R @ mathutils.Matrix.Translation(-P) @ pb.matrix
        bpy.context.view_layer.update()

    def plant():   # the idles' two-bone reach: each ankle back where it stood, the knee forward, the foot keeps its turn
        for t, s, a in legs:
            H = PB[t].head.copy(); K0 = PB[s].head.copy(); A0 = PB[a].head.copy(); At, Rf = feet[a]
            l1, l2 = (K0 - H).length, (A0 - K0).length
            d = At - H; dist = min(d.length, (l1 + l2) * 0.9999); n = d.normalized()
            p = Fv - n * Fv.dot(n); p = p.normalized() if p.length > 1e-6 else V((1, 0, 0))
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
                pb = PB[op[1]]; v = sum((V(AX[c]) * float(x) for c, x in zip('FUL', op[2])), V((0, 0, 0)))
                pb.matrix = mathutils.Matrix.Translation(v) @ pb.matrix; bpy.context.view_layer.update()
            else:
                pb = PB[op[0]]
                rot(pb, pb.matrix.translation.copy(), mathutils.Matrix.Rotation(math.radians(op[2]), 4, V(AX[op[1]])))
        plant()

    def named(ops):
        return [(['MOVE', B[o[1]], o[2]] if o[0] == 'MOVE' else [B[o[0]], o[1], o[2]]) for o in ops]

    # THE PROPS, made in the REST pose (where skinning reads them), each SKINNED to a bone of its own (the idles' lesson: the
    # master rig anchors a skinned part to the nearest rigid part, and a prop on the hand's own bone carried his shoes)
    def mat(nm, rgb, emit=None):
        m = bpy.data.materials.new(nm); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = tuple(rgb) + (1,); b.inputs['Roughness'].default_value = 0.85
        if emit: b.inputs['Emission Color'].default_value = emit + (1,); b.inputs['Emission Strength'].default_value = 2.0
        return m
    arm.data.pose_position = 'REST'; bpy.context.view_layer.update()
    W = arm.matrix_world; Winv = W.inverted(); W3 = W.to_3x3()
    rh = W @ PB[B['RH']].head; rf = W @ PB[B['RF']].head; hand = (rh - rf).normalized()
    hd = W @ PB[B['H']].head
    facing = (W3 @ Fv).normalized(); left = (W3 @ Lv).normalized(); up = (W3 @ Uv).normalized()
    grip = (facing - hand * facing.dot(hand)).normalized(); side = hand.cross(grip).normalized()   # a fist's grip: across the forearm, forward when the arm hangs

    def mesh_from(parts, frame):
        """parts as the work's props write them (['box', c, s, rgb] | ['cyl', p0, p1, r, rgb], [f, u, l] in metres): frame
        is (origin, f axis, u axis, l axis, scale) in the world"""
        O, af, au, al, sc_ = frame
        verts, faces, mats, fmat = [], [], [], []
        def P_(c): return O + af * c[0] * sc_[0] + au * c[1] * sc_[1] + al * c[2] * sc_[2]
        def mi(rgb):
            key = tuple(round(x, 3) for x in rgb)
            if key not in mats: mats.append(key)
            return mats.index(key)
        for part in parts:
            if part[0] == 'box':
                c, s, m_ = part[1], part[2], mi(part[3]); i0 = len(verts)
                for dx in (-0.5, 0.5):
                    for dy in (-0.5, 0.5):
                        for dz in (-0.5, 0.5): verts.append(P_((c[0] + dx * s[0], c[1] + dy * s[1], c[2] + dz * s[2])))
                for a, b, c_, d in ((0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)):
                    faces.append((i0 + a, i0 + b, i0 + c_, i0 + d)); fmat.append(m_)
            else:
                a0, a1, r, m_ = P_(part[1]), P_(part[2]), part[3], mi(part[4]); n = 10
                axv = (a1 - a0).normalized(); e1 = axv.orthogonal().normalized(); e2 = axv.cross(e1); i0 = len(verts)
                for i in range(n):
                    t = 2 * math.pi * i / n; o = (e1 * math.cos(t) + e2 * math.sin(t)) * r
                    verts.append(a0 + o); verts.append(a1 + o)
                for i in range(n):
                    j = (i + 1) % n; faces.append((i0 + 2 * i, i0 + 2 * j, i0 + 2 * j + 1, i0 + 2 * i + 1)); fmat.append(m_)
                faces.append(tuple(i0 + 2 * i for i in range(n))[::-1]); fmat.append(m_)
                faces.append(tuple(i0 + 2 * i + 1 for i in range(n))); fmat.append(m_)
        return verts, faces, mats, fmat

    def make(nm, verts, faces, mats, fmat):
        me = bpy.data.meshes.new(nm); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
        for i, rgb in enumerate(mats): me.materials.append(mat('%s_%d' % (nm, i), rgb))
        for i, poly in enumerate(me.polygons): poly.material_index = fmat[i]
        ob = bpy.data.objects.new(nm, me); sc.collection.objects.link(ob); return ob

    WP = D['work']['props']
    needed = sorted(set(p for a in acts for p in T['activities'][a]['props']))
    made = []   # (prop, parent bone or None, anchor in the world, object)
    for nm in needed:
        S = T['props'][nm]; kind = S['kind']
        if kind == 'hand':
            c = rh + hand * S['along']
            ob = make(nm, *mesh_from(S['parts'], (c, hand, grip, side, (1, 1, 1)))); made.append((nm, B[S['bone']], c, ob))
        elif kind == 'cigarette':   # the idles' own: past the fingers, along the hand
            c = rh + hand * 0.13
            bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.009, depth=0.075, location=c)
            o = bpy.context.active_object; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = V((0, 0, 1)).rotation_difference(hand)
            o.data.materials.append(mat('cig_paper', (0.78, 0.74, 0.66)))
            bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=0.0095, location=c + hand * 0.04)
            e = bpy.context.active_object; e.data.materials.append(mat('cig_ember', (0.55, 0.16, 0.05), emit=(0.9, 0.3, 0.08)))
            bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); e.select_set(True); bpy.context.view_layer.objects.active = o
            bpy.ops.object.join(); ob = bpy.context.active_object; ob.name = nm
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True); made.append((nm, B[S['bone']], c, ob))
        elif kind == 'puff':   # the idles' own three grey puffs, up and off to his right
            objs = []
            for i, (fw, u_, sd, r) in enumerate([(0.1, 0.06, -0.1, 0.03), (0.13, 0.12, -0.15, 0.04), (0.15, 0.2, -0.17, 0.05)]):
                bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=hd + facing * fw + up * u_ + left * sd)
                o = bpy.context.active_object; o.data.materials.append(mat('smoke_%d' % i, (0.52, 0.5, 0.47))); objs.append(o)
            bpy.ops.object.select_all(action='DESELECT')
            for o in objs: o.select_set(True)
            bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join(); ob = bpy.context.active_object; ob.name = nm
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
            made.append((nm, B[S['bone']], hd + facing * 0.12 + up * 0.1 + left * -0.13, ob))
        elif kind == 'ground':   # the work's crate set where he sits, in the armature's frame, in real metres
            parts = WP[S['from'].split('.', 1)[1]]['parts'] if S['from'].startswith('work.') else S['parts']
            la, ra = PB[B['LA']].head.copy(), PB[B['RA']].head.copy(); G0 = (la + ra) / 2; G0 = G0 - Uv * G0.dot(Uv)
            at = W @ (G0 + (Fv * S['at'][0] + Uv * S['at'][1] + Lv * S['at'][2]) * k)
            ob = make(nm, *mesh_from(parts, (at, facing * k, up * k, left * k, S.get('scale', (1, 1, 1))))); made.append((nm, None, at, ob))
    bpy.ops.object.select_all(action='DESELECT'); bpy.context.view_layer.objects.active = arm; arm.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    for nm, parent, at, ob in made:
        eb = arm.data.edit_bones.new('prop_' + nm); eb.head = Winv @ at; eb.tail = eb.head + V((0, 0, 0.04))
        if parent: eb.parent = arm.data.edit_bones[parent]
        eb.use_connect = False; eb.use_deform = True
    bpy.ops.object.mode_set(mode='OBJECT')
    PB = arm.pose.bones
    for nm, parent, at, ob in made:
        ob.parent = arm; ob.matrix_parent_inverse = W.inverted()
        vg = ob.vertex_groups.new(name='prop_' + nm); vg.add(list(range(len(ob.data.vertices))), 1.0, 'REPLACE')
        mo = ob.modifiers.new('Armature', 'ARMATURE'); mo.object = arm
        base['prop_' + nm] = mathutils.Matrix.Identity(4)
        order.append('prop_' + nm)
    arm.data.pose_position = 'POSE'; bpy.context.view_layer.update()
    TINY = (1e-4, 1e-4, 1e-4)
    props = {nm: 'prop_' + nm for nm, _, _, _ in made}
    ad.action = stand   # hidden in the still the master rig measures him by
    for nm, bn in props.items():
        PB[bn].scale = TINY
        for fr in (f0, f1): PB[bn].keyframe_insert('scale', frame=fr)
    ad.action = None

    J = {'what': 'every pose\'s joints in the armature\'s space, metres of the model (k model units a real metre); f u l = forward, up, his left',
         'k': k, 'joints': JOINTS, 'acts': {}}
    out_made = []
    for act in acts:
        poses = pose_list(T, D, act); n = len(poses)
        name = clip(act); A = bpy.data.actions.new(name); ad.action = A
        keys = [(0, poses[0])] + [(2 * i + 1, poses[i]) for i in range(n)] + [(2 * n, poses[-1])]
        jt = {}
        for fr, (pname, ops) in keys:
            apply(named(ops))
            for nm, bn in props.items(): PB[bn].scale = (1, 1, 1) if shown(T, act, nm, pname) else TINY
            bpy.context.view_layer.update()
            for pb in PB:
                for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)
            if pname not in jt:
                row = {}
                for j in JOINTS:
                    h = PB[B[j]].head; row[j] = [round(h.dot(Fv), 4), round(h.dot(Uv), 4), round(h.dot(Lv), 4)]
                for nm, bn in props.items():
                    if shown(T, act, nm, pname):
                        h = PB[bn].head; row['prop_' + nm] = [round(h.dot(Fv), 4), round(h.dot(Uv), 4), round(h.dot(Lv), 4)]
                jt[pname] = row
        t = ad.nla_tracks.new(); t.name = name; t.strips.new(name, 0, A); t.mute = True
        J['acts'][act] = {'clip': name, 'poses': [p for p, _ in poses], 'at': jt}
        out_made.append((name, n))
    ad.action = None
    for pb in PB: pb.matrix_basis = base[pb.name].copy()
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format='GLB', export_skins=True, export_animations=True, export_apply=False,
                              use_selection=False, export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    json.dump(J, open(os.path.abspath(out)[:-4] + '.joints.json', 'w'), indent=0)
    print('POSED TOWN', out, out_made)


# ------------------------------------------------------------------------------------------------ the people
def company_first():
    """his company's men first (the men he starts with), then the men the post deals (a hire joins him in his own look),
    each in the order the idles render the valley's people"""
    import re
    mix = open(os.path.join(ROOT, 'engine/bohemia_people_mix.js')).read()
    rows = [json.loads(m) for m in re.findall(r'^\s*(\{"look":.*\})\s*,?\s*$', mix, re.M)]
    comp = [r['look'] for r in rows if r.get('company')]
    post = [r['look'] for r in rows if r.get('fight') and not r.get('company')]
    rest = [r['look'] for r in rows if not r.get('fight')]
    return comp, post, rest


def done(tag):
    return os.path.exists(os.path.join(ROOT, RENDERS, tag, 'made.txt'))


def model(pid):
    """RUN TWO's build of this man (its tool run, never edited); its committed records of the build stand as they are"""
    tag = 'person_' + pid.lower(); py = sys.executable
    glb = os.path.join(ROOT, EI.PEOPLE_MODELS, 'barber_%s.glb' % tag); gj = glb.replace('.glb', '.json')
    if not os.path.exists(glb):
        keep = {}
        for fn_ in (gj, os.path.join(ROOT, EI.PEOPLE_MODELS, tag + '.json')):
            if os.path.exists(fn_): keep[fn_] = open(fn_).read()
        EI.run([py, 'tools/bohemia_run2_no_two_people_alike.py', 'build-one', pid], glb)
        for fn_, txt in keep.items():
            with open(fn_, 'w') as f: f.write(txt)
    body = os.path.join(ROOT, EI.PEOPLE_MODELS, tag + '.glb')
    if os.path.exists(body): os.remove(body)   # the mannequin under him: the build's own scrap
    return glb, json.load(open(gj))['real_height_for_rig']


def person_one(tag, which=None):
    T = source(); D = EI.source(); acts = acts_of(T, which)
    pid = tag[len('person_'):]
    glb, h = model(pid)
    posed = os.path.join(ROOT, POSED, tag + '.glb')
    EI.run([sys.executable, os.path.abspath(__file__), 'pose', glb, posed, ','.join(acts)], posed)
    out = os.path.join(ROOT, RENDERS, tag)
    EI.render_model(posed, out, h, [('Stand', 1)] + [(clip(a), len(pose_list(T, D, a))) for a in acts])
    os.replace(posed[:-4] + '.joints.json', os.path.join(out, 'joints.json'))
    os.remove(posed)
    for f in os.listdir(out):   # the master rig's raw frames and shadows: nothing here reads them
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    with open(os.path.join(out, 'made.txt'), 'w') as f: f.write(','.join(acts) + '\n')
    if os.environ.get('BOHEMIA_TOWN_KEEP') != '1' and os.path.exists(glb): os.remove(glb)   # 37 MB a man, rebuilt on demand
    print('TOWN person', tag, flush=True)


def people(arg='COMPANY', workers=4):
    comp, post, rest = company_first()
    pool = comp + post if arg.upper() in ('ALL', 'CREW') else comp if arg.upper() == 'COMPANY' else arg.split(',')
    todo = [t for t in pool if t.startswith('person_') and not done(t)]
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
def preview(glb, out, which=None, facings='S,SE,E,N'):
    T = source(); D = EI.source()
    return EI.preview_clips(glb, out, [(clip(a), len(pose_list(T, D, a))) for a in acts_of(T, which)], facings)


def closeup(glb, out, act, names='', facings='S,SE,E,SW'):
    """the idles' quick look, closer: chosen poses of one activity at 360 px a cell, the camera on his chest (never shipped)"""
    import bpy, mathutils
    T = source(); D = EI.source(); allp = [p for p, _ in pose_list(T, D, act)]
    want = [p for p in (names.split(',') if names else allp)]
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(glb))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
    objs = [o for o in sc.objects if o.type == 'MESH']
    root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
    MR.clip_actions(sc, 'Stand'); sc.frame_set(1); lo, hi = MR.bounds(sc, objs)
    centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z)); k = 1.72 / (hi.z - lo.z)
    for o in list(sc.objects):
        if o.parent is None and o is not root: o.parent = root; o.location -= centre
    root.scale = (k, k, k * 1.414)
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = 1.7
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    t = math.radians(45); cam.rotation_euler = (t, 0, 0); cam.location = mathutils.Vector((0, 0, 1.45)) - mathutils.Vector((0, math.sin(t), -math.cos(t))) * 30
    R = 360; sc.render.resolution_x = sc.render.resolution_y = R
    MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg']))); sc.cycles.samples = 8; sc.render.film_transparent = True
    from PIL import Image
    FA = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; fs = facings.split(',')
    sheet = Image.new('RGBA', (R * len(want), R * len(fs)), (70, 66, 60, 255))
    tmp = os.path.join(os.path.dirname(os.path.abspath(out)), '_cu.png')
    a0, a1 = MR.clip_actions(sc, clip(act)); n = len(allp)
    for i, p in enumerate(want):
        j = allp.index(p); fr = a0 + (a1 - a0) * (j + 0.5) / n; sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
        for r, f in enumerate(fs):
            root.rotation_euler = (0, 0, math.radians(180 - 45 * FA.index(f)))
            sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
            sheet.alpha_composite(Image.open(tmp).convert('RGBA'), (R * i, R * r))
    sheet.save(out); print('CLOSEUP', out, act, want)


# ------------------------------------------------------------------------------------------------ pack (python3)
def pack(only=None):
    """a sheet per activity per man, his cells in his render's full frame laid on the still the screens draw by the two
    ground pixels (the idles' people_pack, the same numbers), his own 64 colours (his bare idles' sheet's), `feet` where his
    still stands facing by facing; a man whose Stand here does not match that still keeps nothing (never two men in one)"""
    import numpy as np
    from PIL import Image
    T = source(); D = EI.source()
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']; thr = int(G['alpha_threshold'])
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    ip = os.path.join(ROOT, OUT, 'rig_town.json')
    index = json.load(open(ip)) if os.path.exists(ip) else {'looks': {}}
    index.update(version='rig-town-10-26', lane='animation', row="[the town's activities]", rule='218(a), 128',
                 source='records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json, laid on each man\'s own build by '
                        'tools/bohemia_animation_the_towns_activities.py, rendered by DIRECTION\'s master rig at the street\'s settings',
                 dirs=DIRS, keys_per_beat=3, slot=24,
                 timelines={k: v for k, v in T['timelines'].items() if k != 'why'},
                 activities={a: {k: v for k, v in A.items() if k in ('rest', 'breathe', 'idles', 'habit', 'fidget', 'turns', 'wall')}
                             for a, A in T['activities'].items()},
                 cell='[x, y, w, h, dx, dy]: the cell on its sheet and where its top left sits in his render\'s full frame; feet[f] is '
                      'where his still stands in that frame (the bare idles\' numbers, so an activity lands where his still stood)')
    IDL = os.path.join(ROOT, 'slices/rig_idles')

    def full(fn, r, off, R):
        a = np.asarray(Image.open(fn).convert('RGBA')).copy()
        x0, y0 = r['crop_box_px'][:2] if a.shape[0] != r['res'] or a.shape[1] != r['res'] else (0, 0)
        x0 += off[0]; y0 += off[1]; z = np.zeros((R, R, 4), np.uint8)
        xa, ya = max(0, -x0), max(0, -y0); xb, yb = min(a.shape[1], R - x0), min(a.shape[0], R - y0)
        if xb > xa and yb > ya: z[y0 + ya:y0 + yb, x0 + xa:x0 + xb] = a[ya:yb, xa:xb]
        return z

    def cut(a):
        op = a[..., 3] > thr; a = a.copy(); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
        ys, xs = np.nonzero(op)
        if not len(xs): return None
        return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1].copy(), int(xs.min()), int(ys.min())

    def to_pal(a, P):
        u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
        dd = ((u.astype(np.int32)[:, None, :] - P[None, :, :]) ** 2).sum(2)
        o = a.copy(); o[..., :3] = P[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); o[a[..., 3] == 0] = 0
        return o

    def atlas(items, width):
        order = sorted(range(len(items)), key=lambda i: -items[i][0].shape[0]); x = y = sh = 0; rects = [None] * len(items)
        for i in order:
            h, w = items[i][0].shape[:2]
            if x + w > width: x = 0; y += sh; sh = 0
            rects[i] = [x, y, w, h, int(items[i][1]), int(items[i][2])]; x += w; sh = max(sh, h)
        im = Image.new('RGBA', (width, y + sh), (0, 0, 0, 0))
        for i, (a, _, _) in enumerate(items): im.paste(Image.fromarray(a, 'RGBA'), (rects[i][0], rects[i][1]))
        return im, rects

    n_ok = 0
    for tag in sorted(os.listdir(os.path.join(ROOT, RENDERS))):
        if only and tag not in only: continue
        d = os.path.join(ROOT, RENDERS, tag); rec = os.path.join(ROOT, EI.PEOPLE_STILLS, tag)
        if not tag.startswith('person_') or not done(tag) or not os.path.exists(os.path.join(rec, 'rig.json')): continue
        mj = os.path.join(ROOT, OUT, tag + '.json')
        if os.path.exists(mj) and os.path.getmtime(mj) >= os.path.getmtime(os.path.join(d, 'made.txt')):
            index['looks'][tag] = dict(json=tag + '.json'); n_ok += 1; continue
        acts = open(os.path.join(d, 'made.txt')).read().strip().split(',')
        rj = json.load(open(os.path.join(d, 'rig.json'))); mine = json.load(open(os.path.join(rec, 'rig.json')))
        off = (mine['crop_box_px'][0] + mine['ground_px'][0] - rj['crop_box_px'][0] - rj['ground_px'][0],
               mine['crop_box_px'][1] + mine['ground_px'][1] - rj['crop_box_px'][1] - rj['ground_px'][1])
        mfull = lambda fn: full(fn, rj, off, mine['res'])
        worst = (1.0, 0.0)   # THE MATCH, all eight facings: his Stand here against the still the screens draw
        for f in DIRS:
            A = mfull(os.path.join(d, 'rig_%s.png' % f)).astype(np.int32); B_ = full(os.path.join(rec, 'rig_%s.png' % f), mine, (0, 0), mine['res']).astype(np.int32)
            oa, ob = A[..., 3] > 127, B_[..., 3] > 127; ag = (oa & ob).sum() / max(1, (oa | ob).sum())
            st = float(np.abs(A[..., :3] - B_[..., :3])[oa & ob].mean()) if (oa & ob).any() else 255.0
            worst = (min(worst[0], ag), max(worst[1], st))
        if worst[0] < EI.PEOPLE_MATCH['alpha'] or worst[1] > EI.PEOPLE_MATCH['rgb']:
            print('NO MATCH, no activities for him:', tag, round(worst[0], 3), round(worst[1], 1)); continue
        cb = mine['crop_box_px']; feet = []
        for f in DIRS:
            im = Image.open(os.path.join(rec, 'rig_%s.png' % f)).convert('RGBA')
            al = np.asarray(im)[..., 3]; rows = np.nonzero((al > 24).any(1))[0]
            feet.append([round(cb[0] + im.size[0] / 2, 1), int(cb[1] + (rows.max() + 1 if len(rows) else im.size[1]))])
        # his colours: the 64 of his bare idles' sheet when it is there (one man, one palette on every screen), else his own
        bj = os.path.join(IDL, tag + '_bare.webp')
        if os.path.exists(bj):
            pa = np.asarray(Image.open(bj).convert('RGBA')); P = np.array(sorted(set(map(tuple, pa[pa[..., 3] > 0][:, :3].tolist()))), np.int32)
        else: P = None
        entry = dict(person=True, foot=feet[0], feet=feet, match=[round(worst[0], 3), round(worst[1], 1)], frame_shift=list(off), sheets={}, poses={})
        for act in acts:
            names = [p for p, _ in pose_list(T, D, act)]; cl = clip(act); imgs, cells = [], {}
            for pi, p in enumerate(names):
                for row, f in enumerate(DIRS):
                    c = cut(mfull(os.path.join(d, 'rig_%s_%s_k%02d.png' % (cl, f, pi))))
                    if c is None: continue
                    cells.setdefault(p, [None] * 8)[row] = len(imgs); imgs.append(c)
            Pa = P
            if Pa is None or any(T['activities'][act]['props']):   # a bottle, a tin, a crate: his colours and the prop's
                mosaic = np.concatenate([c[0].reshape(-1, 4) for c in imgs]); mosaic = mosaic[mosaic[:, 3] > 0][:, :3]
                q = Image.fromarray(mosaic.reshape(1, -1, 3).astype(np.uint8), 'RGB').quantize(64, method=Image.Quantize.MEDIANCUT)
                own = np.array(q.getpalette()[:3 * 64], np.int32).reshape(-1, 3)
                if Pa is not None:   # his palette first, the prop's colours only where his own are far (a bottle is not his coat)
                    dd = ((own[:, None, :] - Pa[None, :, :]) ** 2).sum(2).min(1)
                    Pa = np.concatenate([Pa, own[dd > 24 ** 2][:16]])
                else: Pa = own
            imgs = [(to_pal(a, Pa), x0, y0) for a, x0, y0 in imgs]
            body, rects = atlas(imgs, 1024); fn = '%s_%s.webp' % (tag, act)
            body.save(os.path.join(ROOT, OUT, fn), 'WEBP', lossless=True, quality=100, method=6)
            entry['sheets'][act] = dict(file=fn, cells=rects, size=list(body.size))
            entry['poses'][act] = {p: cells.get(p, [None] * 8) for p in names}
        json.dump(entry, open(mj, 'w'), separators=(',', ':'))
        index['looks'][tag] = dict(json=tag + '.json', acts=acts); n_ok += 1
        print('PACKED town', tag, {a: v['size'] for a, v in entry['sheets'].items()}, flush=True)
    json.dump(index, open(ip, 'w'), separators=(',', ':'))
    print('INDEX', os.path.relpath(ip, ROOT), n_ok, 'looks')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    a = sys.argv[2:]
    if cmd == 'pose': pose(a[0], a[1], a[2] if len(a) > 2 else None)
    elif cmd == 'person_one': person_one(a[0], a[1] if len(a) > 1 else None)
    elif cmd == 'people': people(a[0] if a else 'COMPANY', int(a[1]) if len(a) > 1 else 4)
    elif cmd == 'preview': preview(*a)
    elif cmd == 'closeup': closeup(*a)
    elif cmd == 'pack': pack(set(a) if a else None)
    else: sys.exit('pose <in.glb> <out.glb> [acts] | person_one <look> [acts] | people [COMPANY|CREW|look,look] [workers] | preview <glb> <png> [acts] [facings] | pack [looks]')
