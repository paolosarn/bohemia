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
        slices/rig_idles/<look>.webp (every distinct pose, eight facings, each cell cut to what is drawn, packed tight),
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
RENDERS = 'records/target/animation/idles'        # the master rig's renders (regenerated, .gitignore)
OUT = 'slices/rig_idles'
CLIP = {'bare': 'IdleBare', 'carry': 'IdleCarry'}
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
def pose(src, out):
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

    # THE PROPS: a cigarette in his right hand and the breath he lets out, rigid parts on their bones, shown only in the
    # smoke poses (scale keyed), so every other clip and the still the master rig measures him by never carry them
    props = {}
    def prop_obj(nm, bone, build):
        bpy.ops.object.select_all(action='DESELECT')
        objs = build(); ob = objs[0]
        if len(objs) > 1:
            for o in objs: o.select_set(True)
            bpy.context.view_layer.objects.active = ob; bpy.ops.object.join()
        ob.name = nm
        pb = PB[bone]; bl = arm.data.bones[bone]
        W = ob.matrix_world.copy()
        ob.parent = arm; ob.parent_type = 'BONE'; ob.parent_bone = bone
        ob.matrix_parent_inverse = (arm.matrix_world @ pb.matrix @ mathutils.Matrix.Translation((0, bl.length, 0))).inverted()
        ob.matrix_basis = W
        props[nm] = ob
        return ob

    def mat(nm, rgb, emit=None, alpha=1.0):
        m = bpy.data.materials.new(nm); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = rgb + (1,); b.inputs['Roughness'].default_value = 1.0
        if emit: b.inputs['Emission Color'].default_value = emit + (1,); b.inputs['Emission Strength'].default_value = 2.0
        if alpha < 1: b.inputs['Alpha'].default_value = alpha
        return m

    W = arm.matrix_world
    rh = W @ PB[B['RH']].head; rf = W @ PB[B['RF']].head; hand = (rh - rf).normalized()
    def cig():
        c = rh + hand * 0.13   # past the fingers, so the fist does not swallow it
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.009, depth=0.075, location=c)
        o = bpy.context.active_object; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(hand)
        o.data.materials.append(mat('cig_paper', (0.78, 0.74, 0.66)))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=0.0095, location=c + hand * 0.04)
        e = bpy.context.active_object; e.data.materials.append(mat('cig_ember', (0.55, 0.16, 0.05), emit=(0.9, 0.3, 0.08)))
        return [o, e]
    hd = W @ PB[B['H']].head; facing = W.to_3x3() @ mathutils.Vector(F)
    def puff():
        out_ = []
        for i, (fw, up, sd, r) in enumerate([(0.1, 0.06, -0.1, 0.03), (0.13, 0.12, -0.15, 0.04), (0.15, 0.2, -0.17, 0.05)]):   # up and off to his right, beside his head from the front: the head is tipped back, the breath goes up
            loc = hd + facing.normalized() * fw + mathutils.Vector((0, 0, up)) + (W.to_3x3() @ mathutils.Vector(L)).normalized() * sd
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=loc)
            o = bpy.context.active_object; o.data.materials.append(mat('smoke_%d' % i, (0.52, 0.5, 0.47))); out_.append(o)
        return out_
    for nm, P in D['props'].items():
        prop_obj(nm, B[P['bone']], cig if nm == 'cigarette' else puff)
    TINY = (1e-4, 1e-4, 1e-4)
    for ob in props.values(): ob.scale = TINY

    carry = [list(o) for o in CP.carry_ops()]   # (bone, axis vector, deg): COMBAT's low ready
    made = []
    for set_name in ('bare', 'carry'):
        poses = pose_list(D, set_name)
        under = carry if D['sets'][set_name]['base'] == 'carry' else []
        name = CLIP[set_name]
        act = bpy.data.actions.new(name); ad.action = act
        pacts = {}
        for nm, ob in props.items():
            pa = bpy.data.actions.new(name + '_' + nm); ob.animation_data_create().action = pa; pacts[nm] = pa
        n = len(poses)
        keys = [(0, poses[0])] + [(2 * k + 1, poses[k]) for k in range(n)] + [(2 * n, poses[-1])]
        for fr, (pname, ops) in keys:
            apply(under + named(ops))
            for pb in PB:
                for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)
            for nm, ob in props.items():
                ob.scale = (1, 1, 1) if pname in D['props'][nm]['show'] else TINY
                ob.keyframe_insert('scale', frame=fr)
        t = ad.nla_tracks.new(); t.name = name; t.strips.new(name, 0, act); t.mute = True
        for nm, ob in props.items():
            pad = ob.animation_data; pad.action = None
            tt = pad.nla_tracks.new(); tt.name = name; tt.strips.new(name, 0, pacts[nm]); tt.mute = True
            ob.scale = TINY
        made.append((name, n))
    ad.action = None
    for pb in PB: pb.matrix_basis = base[pb.name].copy()
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format='GLB', export_skins=True, export_animations=True, export_apply=False,
                              use_selection=False, export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    print('POSED', out, made)


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
    src = os.path.join(ROOT, CF.POSED, name + '.glb')
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
    if os.path.exists(os.path.join(ROOT, RENDERS, name, 'guns', 'shotgun_IdleCarry_SW_k%02d.png' % (n - 1))): return
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
        if os.path.exists(os.path.join(ROOT, RENDERS, name, 'guns', 'shotgun_IdleCarry_SW_k%02d.png' % (n - 1))): return
    raise SystemExit('GUNS FAILED ' + name)


def fight(arg, workers=1):
    todo = [l[0] for l in men(arg) if not os.path.exists(os.path.join(ROOT, RENDERS, l[0], 'guns', 'shotgun_IdleCarry_SW_k%02d.png' % (len(source()['sets']['carry']['poses']) - 1)))]
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
    MR.clip_actions(sc, 'Stand'); sc.frame_set(1); lo, hi = MR.bounds(sc, objs)
    centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z)); k = 1.72 / (hi.z - lo.z)
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
    sets = {s: [p for p in D['sets'][s]['poses']] for s in ('bare', 'carry')}
    index = dict(version='rig-idles-10-23', lane='animation', row='[everybody idles]', rule='130(a), 128',
                 source='records/target/animation/BOHEMIA_EVERYBODY_IDLES.json (the poses and the timelines), laid on COMBAT\'s posed '
                        'men by tools/bohemia_animation_everybody_idles.py, rendered by DIRECTION\'s master rig the way COMBAT renders the fight',
                 dirs=FIGHT_DIRS, keys_per_beat=3, sets=sets, timelines={k: v for k, v in D['timelines'].items() if k != 'why'},
                 idles=D['idles'], guns=['pistol', 'rifle', 'shotgun'], cell='[x, y, w, h, dx, dy]: the cell on the sheet and where its top left '
                 'sits from the look\'s fight-sheet cell origin (so his feet are where they were: the fight sheet\'s foot)', looks={})
    for look in sorted(os.listdir(os.path.join(ROOT, RENDERS))):
        d = os.path.join(ROOT, RENDERS, look)
        if look not in FR['looks'] or not os.path.exists(os.path.join(d, 'rig.json')): continue
        rj = json.load(open(os.path.join(d, 'rig.json')))
        fl = FR['looks'][look]
        # the look's own fight cell is the frame of reference: the same model, still and camera (Stand first), so the same
        # full frame; his feet are the one point both know (the fight sheet's foot, this render's ground pixel)
        cx0, cy0, cx1, cy1 = rj['crop_box_px']
        fx0 = cx0 + rj['ground_px'][0] - fl['foot'][0]; fy0 = cy0 + rj['ground_px'][1] - fl['foot'][1]   # the fight cell's origin in the full frame
        sheet_pal = Image.open(os.path.join(ROOT, 'slices/fight_rig', fl['file'])).convert('RGB')
        pal = np.array(sorted(set(map(tuple, np.asarray(sheet_pal).reshape(-1, 3).tolist()))), np.int32)
        def to_pal(a):
            rgb = a[..., :3].reshape(-1, 3).astype(np.int32); out = np.empty_like(rgb)
            for i in range(0, len(rgb), 65536):
                c = rgb[i:i + 65536]; dd = ((c[:, None, :] - pal[None, :, :]) ** 2).sum(2); out[i:i + 65536] = pal[dd.argmin(1)]
            a[..., :3] = out.reshape(a.shape[:2] + (3,)).astype(np.uint8); return a
        cells, imgs, gcells, gimgs = {}, [], {}, []
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
        for s, poses in sets.items():
            clip = CLIP[s]
            for pi, p in enumerate(poses):
                for row, f in enumerate(FIGHT_DIRS):
                    a = full(os.path.join(d, 'rig_%s_%s_k%02d.png' % (clip, f, pi)), rj['crop_box_px'])
                    r = cut(a, int(G['alpha_threshold']))
                    if r is None: continue
                    a, x0, y0 = r; a = to_pal(a)
                    cells.setdefault(s, {}).setdefault(p, [None] * 8)[row] = len(imgs); imgs.append((a, x0 - fx0, y0 - fy0))
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
        body, rects = atlas(imgs, 2048)
        body.save(os.path.join(ROOT, OUT, look + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
        entry = dict(file=look + '.webp', fight=fl['file'], foot=fl['foot'], cells=rects,
                     poses={s: {p: cells[s][p] for p in sets[s]} for s in sets})
        if gimgs:
            gim, grects = atlas(gimgs, 1024)
            gim.save(os.path.join(ROOT, OUT, look + '_guns.webp'), 'WEBP', lossless=True, quality=100, method=6)
            entry['guns'] = dict(file=look + '_guns.webp', cells=grects, poses=gcells)
        index['looks'][look] = entry
        print('PACKED', look, body.size, os.path.getsize(os.path.join(ROOT, OUT, look + '.webp')), 'guns', gimgs and gim.size, flush=True)
    json.dump(index, open(os.path.join(ROOT, OUT, 'rig_idles.json'), 'w'), separators=(',', ':'))
    print('INDEX', os.path.join(OUT, 'rig_idles.json'), len(index['looks']), 'looks')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[2:]
    if cmd == 'pose': pose(a[0], a[1])
    elif cmd == 'fight_one': fight_one(a[0])
    elif cmd == 'fight': fight(a[0] if a else 'ALL', int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'guns': guns(a[0])
    elif cmd == 'preview': preview(*a)
    elif cmd == 'pack': pack()
    else: sys.exit('pose | fight [LOOK|ALL] [workers] | preview <glb> <png> [bare|carry] | pack')
