#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the PC playtest: the bodies' part] (rule 164 items 21, 22, 31; Paolo 10/24 on his PC: 'if they're
using pistols they shouldn't look like they're holding rifles'; 'when they're in a building they get extra cover stats...
they shouldn't be standing up, they should look like they're in cover'; 'more and better animations when people hold
things'). A PISTOL IN ONE HAND, AND COVER THAT LOOKS LIKE COVER.

MEASURED FIRST (10/25): the fight drew every gun on the same body clips (COMBAT's poses tool: 'a pistol is held in two hands
like the long gun (the modern stance): one clip, every gun'), so a man with a pistol stood, walked and fired in the long
gun's two-handed carry and aim, his pistol between his two fists at the belly; and a man on a tile with cover (a wall, a
dead car, a shed, rubble: the fight's S.cover) stood upright beside it on the same stand cell as a man in the open. The
cover only lived in the numbers.

THE SOURCE (rule 128, the kept scene): records/target/animation/BOHEMIA_WHAT_A_MAN_HOLDS.json. Every clip a list of HELD keys
(three a beat at 120, Crashbox holds, rule 115(d)); every key a list of steps on the rig's man (the skeleton every person in
the game is built on, so one list fits every look and every act's wardrobe): bone turns, a wrist put on a point by a
two-bone reach, the feet planted, or a KNEEL (the gun side's knee on the ground under the hip, the other foot a step
forward, the pelvis dropped exactly as far as puts the knee on the ground). Ten clips:
    PIdle 6        the pistol low in the right hand at the thigh, the muzzle forward and down; a breath, a look each way,
                   the pistol up before his eyes and turned (the left hand on the slide)
    PCarryWalk 6   the walk's six keys, the pistol low in the right hand, the LEFT ARM SWINGING with the walk
    PAim 3         one arm straight out at the eye, the body bladed, the left arm back; the kick lifts the wrist; the settle
    PHit 2         the blow rocks him, the pistol kept in the right hand
    CoverLong 3    on one knee behind the cover, the long gun across him at COMBAT's low ready; a breath; a peek up
    CoverLongAim 3 up on the knee, COMBAT's aim and kick over the cover
    CoverPistol 3  on one knee, the pistol up at the chest, the muzzle up, the left hand on the knee; a breath; a peek
    CoverPistolAim 3  up on the knee, one arm out over the cover, the kick, the settle
    CoverBare 3    a man with nothing in his hands ducks low on one knee, the hands tucked in; a breath; a look
    CoverHit 2     on the knee, rocked back, whatever he holds kept in the right hand

THE STEPS (Blender's Python for pose/render/guns: bpy 4.2 in a python3.11 venv, as the master rig; plain python3 for pack):
    <venv>/bin/python tools/bohemia_animation_what_a_man_holds.py pose <in.glb> <out.glb>
        the ten clips laid on a man as ten actions beside every action his model came with
    <venv>/bin/python tools/bohemia_animation_what_a_man_holds.py fight [LOOK|ALL] [workers]
        every man the fight dresses (COMBAT's posed models, records/combat/rig/<look>.glb, rebuilt by its own tool's
        `bodies` when missing), posed here, rendered by DIRECTION's master rig exactly as COMBAT renders the fight (its
        render(), imported and called, Stand first so the still and the box are the look's own) into
        records/target/animation/hold/<look>/, then COMBAT's guns rendered in his hands on these clips (its own tool run with
        changes made in memory: the clip list, the guns per clip, and how a one-hand pistol and a kneeling gun sit)
    python3 tools/bohemia_animation_what_a_man_holds.py pack
        slices/rig_hold/<look>.webp (every key of the ten clips, eight facings, each cell cut to what is drawn and packed
        tight), <look>_guns.webp, <look>.json (the cells, each placed from the look's fight-sheet cell by his feet) and
        slices/rig_hold/rig_hold.json; the colours are the look's own fight sheet's (a man who kneels keeps every colour he
        walked in)
    COMBAT's fight plays them in ANIMATION's marked block __WHAT_A_MAN_HOLDS__ (slices/BOHEMIA_FIGHT.html).

REUSE CHECK: the bodies are PORTRAIT's and CHARACTER's builds posed by COMBAT's tool; COMBAT's carry_ops and its Aim keys are
imported, never copied; the render is COMBAT's render() over DIRECTION's master rig, imported and called; the guns are COMBAT's
tool, run; the two-bone reach and the feet are this lane's idles tool's; nothing is drawn by hand.
REFERENCE CHECK (the 9/4 standing duty): the compare law: the twin of every held clip is the same man's own carry, aim and
stand cells on the fight's sheet, side by side at the fight's pixels (the record); analog horror AH-01, the held key; no
reference game (Battle Brothers' one-handed weapon at the side and its shield arm are the study the row names).
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_WHAT_A_MAN_HOLDS.json')
POSED = 'records/animation/hold'                  # the posed models (regenerated, .gitignore)
COMBAT_POSED = 'records/combat/rig'              # COMBAT's posed men (its tool's `bodies`)
RENDERS = 'records/target/animation/hold'         # the master rig's renders (regenerated, .gitignore)
OUT = 'slices/rig_hold'
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
F, U, L = (1, 0, 0), (0, -1, 0), (0, 0, 1)
AX = {'F': F, 'U': U, 'L': L}


def source():
    return json.load(open(SRC))


def clip_list(D=None):
    D = D or source()
    return [(n, len(c['keys'])) for n, c in D['clips'].items()]


def made(name, clip):
    """this clip of this man is rendered, in his main pass or in the pass made after it (<name>_more)"""
    return any(os.path.exists(os.path.join(ROOT, RENDERS, name + sfx, 'rig_%s_S_k00.png' % clip)) for sfx in ('', '_more'))


def gun_made(name, gun, clip, D=None):
    D = D or source(); n = len(D['clips'][clip]['keys'])
    return any(os.path.exists(os.path.join(ROOT, RENDERS, name + sfx, 'guns', '%s_%s_NW_k%02d.png' % (gun, clip, n - 1))) for sfx in ('', '_more'))


def more_clips(name, D=None):
    """the clips his main pass never made (made after it): rendered as a pass of their own into <name>_more"""
    D = D or source()
    if not os.path.exists(os.path.join(ROOT, RENDERS, name, 'rig.json')): return []
    return [(c, k) for c, k in clip_list(D) if not os.path.exists(os.path.join(ROOT, RENDERS, name, 'rig_%s_S_k00.png' % c))]


def last_gun_file(D=None):
    """the last picture the guns step writes: when it is there, this look's guns are done"""
    D = D or source(); g = list(D['guns'])[-1]; c = D['guns'][g][-1]
    return '%s_%s_NW_k%02d.png' % (g, c, len(D['clips'][c]['keys']) - 1)


# ------------------------------------------------------------------------------------------------ pose (bpy)
def pose(src, out):
    import bpy, mathutils
    D = source(); B = D['bones']
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_combat_the_fight_poses as CP   # COMBAT's carry and aim, never copied
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
    walk_act = [x for x in acts if x.name.startswith('Anim_0')][0]
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
    V = lambda t: mathutils.Vector(t)
    Fv, Uv, Lv = V(F), V(U), V(L)
    legs = {'L': (B['LT'], B['LS'], B['LA']), 'R': (B['RT'], B['RS'], B['RA'])}
    feet = {a: (PB[a].head.copy(), PB[a].matrix.to_3x3().copy()) for _, _, a in legs.values()}   # where he stands
    def chain(top):
        out_ = []
        def down(b):
            out_.append(b.name)
            for c in b.children: down(c)
        down(arm.data.bones[top]); return set(out_)
    chains = {'R': chain(B['RU']), 'L': chain(B['LU'])}
    aim_keys = CP.man_keys()['Aim']                     # COMBAT's long gun up, the kick, the settle
    carry = [list(o) for o in CP.carry_ops()]           # COMBAT's low ready

    def rot(pb, P, R):
        pb.matrix = mathutils.Matrix.Translation(P) @ R @ mathutils.Matrix.Translation(-P) @ pb.matrix
        bpy.context.view_layer.update()

    def two_bone(b1, b2, b3, target, pole):
        """the chain's end on the target (or as near as it reaches), the middle joint toward the pole"""
        H = PB[b1].head.copy(); K0 = PB[b2].head.copy(); A0 = PB[b3].head.copy()
        l1, l2 = (K0 - H).length, (A0 - K0).length
        d = target - H; dist = max(1e-4, min(d.length, (l1 + l2) * 0.999)); n = d.normalized()
        p = pole - n * pole.dot(n); p = p.normalized() if p.length > 1e-6 else Fv
        a_ = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist); h = math.sqrt(max(0.0, l1 * l1 - a_ * a_))
        K = H + n * a_ + p * h
        q = (K0 - H).rotation_difference(K - H); rot(PB[b1], H, q.to_matrix().to_4x4())
        K1 = PB[b2].head.copy(); A1 = PB[b3].head.copy()
        q = (A1 - K1).rotation_difference((H + n * dist) - K1); rot(PB[b2], K1, q.to_matrix().to_4x4())

    def vec(t): return Fv * t[0] + Uv * t[1] + Lv * t[2]

    def plant(targets=None):
        """each foot back where it stood (or on its kneel target), the knee toward its pole; a foot keeps its turn"""
        for side, (t, s, a) in legs.items():
            At, Rf = feet[a]; pole = Fv; turn = None
            if targets and side in targets: At, pole, turn = targets[side]
            two_bone(t, s, a, At, pole)
            M = (turn if turn is not None else Rf).to_4x4(); M.translation = PB[a].matrix.translation; PB[a].matrix = M
            bpy.context.view_layer.update()

    def kneel(spec):
        """the named knee on the ground under the hip and its shin back along the ground; the other foot a step forward,
        flat; the pelvis dropped exactly as far as puts the knee on the ground (the skeleton's own lengths)"""
        down = spec['kneel']; up = 'L' if down == 'R' else 'R'
        t, s, a = legs[down]; l1 = (PB[s].head - PB[t].head).length; l2 = (PB[a].head - PB[s].head).length
        knee_h = 0.055                                       # the knee's own thickness off the floor (the armature's zero)
        hip = PB[t].head.copy(); hip_h = -hip.y               # the floor is the armature's zero height, up is -y
        # the hip's height over the floor: 'seat' sits him back toward his heel (the thigh slanting forward to the knee on the
        # ground), else the thigh tipped a little forward of straight down (a high kneel, to rise and fire over the cover)
        seat = spec.get('seat')
        if seat: lean = math.sqrt(max(0.0, l1 * l1 - (seat - knee_h) ** 2)); drop = hip_h - seat
        else: lean = 0.3 * l1; drop = hip_h - knee_h - math.sqrt(max(0.0, l1 * l1 - lean * lean))
        pb = PB[B['P']]; pb.matrix = mathutils.Matrix.Translation(-Uv * drop) @ pb.matrix; bpy.context.view_layer.update()
        hip = PB[t].head.copy()
        K = V((hip.x + lean, -knee_h, hip.z))                # the knee on the ground a little ahead of the hip
        Ak = K - Fv * (l2 * 0.97) + Uv * 0.015                # the shin back along the ground, the ankle a touch up on the toes
        At_up, Rf_up = feet[legs[up][2]]
        Au = At_up + Fv * spec.get('front', 0.2)
        R_down = mathutils.Matrix.Rotation(math.radians(70), 3, Lv) @ feet[a][1]   # the back foot on its toes, the sole up
        plant({down: (Ak, Fv * 0.3 - Uv, R_down), up: (Au, Fv + Uv * 0.6, Rf_up)})   # the down knee below the hip-to-ankle line, the up knee above it

    def ops_apply(ops):
        nm = lambda op: B[op[1]] if op[0] == 'MOVE' else B[op[0]]
        for op in sorted(ops, key=lambda op: order.index(nm(op)) if nm(op) in order else -1):
            if op[0] == 'MOVE':
                pb = PB[B[op[1]]]; pb.matrix = mathutils.Matrix.Translation(vec(op[2])) @ pb.matrix; bpy.context.view_layer.update()
            else:
                pb = PB[B[op[0]]]
                rot(pb, pb.matrix.translation.copy(), mathutils.Matrix.Rotation(math.radians(op[2]), 4, V(AX[op[1]])))

    def combat_ops(ops):
        """COMBAT's own turns (bone, axis vector, degrees), its bone names, root first"""
        for op in sorted(ops, key=lambda o: order.index(o[0]) if o[0] in order else -1):
            if op[0] in ('ROOT', 'WROOT'): continue
            bone, ax, deg = op; pb = PB[bone]
            rot(pb, pb.matrix.translation.copy(), mathutils.Matrix.Rotation(math.radians(deg), 4, V(ax)))

    def reach(spec):
        for side, r in spec.items():
            u1, f1, h1 = (B['RU'], B['RF'], B['RH']) if side == 'R' else (B['LU'], B['LF'], B['LH'])
            two_bone(u1, f1, h1, PB[B[r['from']]].head.copy() + vec(r['at']), vec(r['pole']))

    def key(steps):
        planted = False
        for st in steps:
            if 'ops' in st: ops_apply(st['ops'])
            if 'reach' in st: reach(st['reach'])
            if st.get('carry'): combat_ops(carry)
            if 'combat_aim' in st: combat_ops(aim_keys[st['combat_aim']])
            if 'legs' in st:
                if st['legs'] == 'plant': plant()
                else: kneel(st['legs'])
                planted = True
        return planted

    def key_all(fr):
        for pb in PB:
            for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)

    # the walk's six keys as the master rig samples them (COMBAT's CarryWalk reads them the same way)
    ad.action = walk_act; w0, w1 = walk_act.frame_range; walks = []
    for i in range(6):
        fr = w0 + (w1 - w0) * (i + 0.5) / 6
        sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr)); bpy.context.view_layer.update()
        walks.append({pb.name: pb.matrix_basis.copy() for pb in PB})
    ad.action = stand; sc.frame_set(int(still), subframe=still - int(still)); bpy.context.view_layer.update()

    made = []
    for name, C in D['clips'].items():
        act = bpy.data.actions.new(name); ad.action = act
        n = len(C['keys'])
        for fr, i in [(0, 0)] + [(2 * k + 1, k) for k in range(n)] + [(2 * n, n - 1)]:
            if C['under'] == 'walk':   # the walk under him; the arm that holds nothing keeps the walk's own swing
                keep = C.get('keep', '')
                for pb in PB:
                    held = any(pb.name in chains[s_] for s_ in 'LR' if s_ not in keep)
                    pb.matrix_basis = (base[pb.name] if held else walks[i][pb.name]).copy()
            else:
                for pb in PB: pb.matrix_basis = base[pb.name].copy()
            bpy.context.view_layer.update()
            steps = [st for part in C['keys'][i] for st in D['parts'][part]]
            key(steps)
            key_all(fr)
        t = ad.nla_tracks.new(); t.name = name; t.strips.new(name, 0, act); t.mute = True
        made.append((name, n))
    ad.action = None
    for pb in PB: pb.matrix_basis = base[pb.name].copy()
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format='GLB', export_skins=True, export_animations=True, export_apply=False,
                              use_selection=False, export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    print('POSED', out, made)


# ------------------------------------------------------------------------------------------------ render (bpy)
def idles():
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_animation_everybody_idles as I
    return I


def combat():
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_combat_the_fight_wears_the_rig as CF
    return CF


def men(arg):
    return [l for l in combat().pick(arg) if l[1] != 'beast']


def claimed(name):
    """one worker a man: a lock file with the worker's pid; a lock whose worker is gone is taken over"""
    os.makedirs(os.path.join(ROOT, RENDERS), exist_ok=True)
    lk = os.path.join(ROOT, RENDERS, '.%s.lock' % name)
    for _ in range(2):
        try:
            fd = os.open(lk, os.O_CREAT | os.O_EXCL | os.O_WRONLY); os.write(fd, str(os.getpid()).encode()); os.close(fd)
            import atexit; atexit.register(lambda: os.path.exists(lk) and os.remove(lk)); return True
        except FileExistsError:
            try: pid = int(open(lk).read().strip() or 0); os.kill(pid, 0); return False   # his worker is alive: not mine
            except (ValueError, ProcessLookupError, PermissionError, OSError): os.remove(lk)
    return False


def fight_one(name):
    if not claimed(name): print('SKIP', name, 'another worker has him', flush=True); return
    CF = combat(); I = idles(); py = sys.executable
    src = os.path.join(ROOT, COMBAT_POSED, name + '.glb')
    if not os.path.exists(src):   # COMBAT's own build of this man, as its tool makes it
        I.run([py, 'tools/bohemia_combat_the_fight_wears_the_rig.py', 'bodies', name], src)
    glb = os.path.join(ROOT, POSED, name + '.glb')
    if not os.path.exists(glb):
        I.run([py, os.path.abspath(__file__), 'pose', src, glb], glb)
    if not os.path.exists(os.path.join(ROOT, RENDERS, name, 'rig.json')):
        # the render: COMBAT's render() over the master rig, pointed at this posed model and this folder
        CF.POSED, CF.RENDERS = POSED, RENDERS
        CF.render(name, clips=[('Stand', 1)] + clip_list(), suffix='')
    guns(name)
    more = more_clips(name)
    if more and not all(made(name, c) for c, _ in more):   # clips made after his main pass: his model posed again with every clip, those rendered alone
        I.run([py, os.path.abspath(__file__), 'pose', src, glb], glb)
        CF.POSED, CF.RENDERS = POSED, RENDERS
        CF.render(name, clips=[('Stand', 1)] + more, suffix='_more')
    if more: guns(name + '_more', [c for c, _ in more])
    print('HOLD', name, flush=True)


# how each held clip puts the gun in his hand (the guns tool's place(), extended in memory): the grip and the line the
# barrel takes, from his wrists, the right elbow, the way he faces and up
PLACE = r'''
def _hold_place(clip, gun, rw, lw, re, fwd, up):
    import mathutils
    fore = (rw - re); fore = fore.normalized() if fore.length > 1e-4 else -up
    if clip in ('PIdle', 'PCarryWalk'):            # the pistol low in one hand: along the forearm, the muzzle forward and down
        return rw, fwd * 0.75 + fore * 0.35 - up * 0.55
    if clip in ('PAim', 'CoverPistolAim'):         # one hand at the eye: along the arm, kept level
        bar = fore if fore.dot(fwd) > 0.3 else fwd
        return rw, mathutils.Vector((bar.x, bar.y, bar.z * 0.3))
    if clip == 'CoverPistol':                      # up at the chest, the muzzle up
        return rw, up * 0.85 + fwd * 0.45
    if clip == 'CoverLong':                        # the low ready on the knee: grip in the right hand, through the left
        bar = lw - rw
        if bar.length < 1e-4 or bar.normalized().dot(fwd) < 0.2: bar = fwd - up * 0.2
        return rw, bar
    if clip == 'CoverLongAim':                     # at the shoulder over the cover, as COMBAT's Aim
        bar = lw - rw
        if bar.length < 1e-4 or bar.normalized().dot(fwd) < 0.2: bar = fwd
        return rw, mathutils.Vector((bar.x, bar.y, bar.z * 0.15))
    if clip in ('PReload', 'CoverPReload'):        # tilted up before his chest, the muzzle up, his left hand at its butt and slide
        return rw, up * 0.75 + fwd * 0.55
    if clip in ('LReload', 'CoverLReload'):        # up in his LEFT hand at the fore-end, the muzzle up and forward, the right hand free
        d = (fwd * 0.756 + up * 0.655 * _ZS).normalized()   # the line his hands were posed on, in the stretched 3/4 body
        return lw - d * 0.32, d
    return None                                    # PHit, CoverHit: COMBAT's own blow (in the right hand)
'''


def guns(name, only=None):
    """COMBAT's guns tool on the held clips: its own render() with changes made in memory (the clip list, the guns per
    clip, the hold for a one-hand pistol and a kneeling gun), reading the rig.json of this folder (a look's main pass, or
    <look>_more with only the clips made after it)"""
    D = source(); out = os.path.join(ROOT, RENDERS, name, 'guns')
    rj = json.load(open(os.path.join(ROOT, RENDERS, name, 'rig.json')))
    clips = [c for c in (only or [c for c, _ in clip_list(D)]) if c in rj.get('clips', {})]   # only what this folder's render holds
    look = name[:-5] if name.endswith('_more') else name
    clips = [c for c in clips if not all(gun_made(look, g, c, D) for g, gl in D['guns'].items() if c in gl)]   # only what is missing
    want = [(g, c) for g, gl in D['guns'].items() for c in gl if c in clips]
    if not want: return
    code = open(os.path.join(ROOT, 'tools/bohemia_combat_the_guns_in_their_hands.py')).read()
    a = "CLIPS = [('Carry', 1), ('CarryWalk', 6), ('Aim', 3), ('Hit', 2), ('Swing', 3)]"
    b = "            if clip == 'Aim':"
    c = "RENDERS = 'records/target/combat/rig'"
    d = "        for name, keys in CLIPS:\n"
    e = "GUNS = {'pistol': 'gun_pistol_a', 'rifle': 'gun_rifle_a', 'shotgun': 'gun_shotgun_a'}"
    z = "        zs = rj['z_stretch']; root.scale = (k, k, k * zs)"
    for s in (a, b, c, d, e, z): assert code.count(s) == 1, 'COMBAT\'s guns tool changed: re-read it before patching in memory'
    code = code.replace(z, "        zs = rj['z_stretch']; globals()['_ZS'] = zs; root.scale = (k, k, k * zs)")
    keys = dict(clip_list(D))
    code = code.replace(a, "CLIPS = %r" % [(k, keys[k]) for k in clips])
    code = code.replace(b, "            _h = _hold_place(clip, gun, rw, lw, re, fwd, up)\n            if _h: grip, bar = _h\n            elif clip == 'Aim':")
    code = code.replace(c, "RENDERS = %r" % RENDERS)
    code = code.replace(d, d + "            if name not in _GUN_CLIPS[gun]: continue\n")
    code = code.replace(e, e + "\n_GUN_CLIPS = %r\n_ZS = 1.0\n" % D['guns'] + PLACE)
    code = code.replace("if __name__ == '__main__':", "if False:")
    prog = ('import sys; sys.argv = [%r]; __file__ = %r\n' % ('guns', os.path.join(ROOT, 'tools/bohemia_combat_the_guns_in_their_hands.py'))) + code + '\nrender(%r)\n' % name
    for i in range(3):
        r = subprocess.run([sys.executable, '-c', prog], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        if all(gun_made(look, g, c, D) for g, c in want): return
    raise SystemExit('GUNS FAILED ' + name + ': ' + (r.stderr or '')[-600:])


def done(name):
    D = source()
    return all(made(name, c) for c, _ in clip_list(D)) and all(gun_made(name, g, c, D) for g, gl in D['guns'].items() for c in gl)


def fight(arg, workers=1):
    todo = [l[0] for l in men(arg) if not done(l[0])]
    if workers <= 1:
        for nm in todo: fight_one(nm)
        return
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    procs = []
    for w in range(workers):
        mine = todo[w::workers]
        if not mine: continue
        sh = ' ; '.join('%s %s fight_one %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


# ------------------------------------------------------------------------------------------------ the valley's rolled men
# RUN TWO's rolled people on COMBAT's board (slices/fight_rig/fight_rig.json, kind 'person': most bands are dealt from them):
# each built by RUN TWO's own build (its tool run, never edited; its committed records kept), the held clips laid on that
# model as it is, rendered at the street's settings the way his fight sheet was; packed into his gang's cell (his look's
# 'ref', the cell his fight sheet sits in) with his gang's guns, exactly as RUN TWO packs his fight sheet
PEOPLE_MODELS = 'records/character/rig'
PEOPLE_ROLL = 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json'


ENEMY_ROLL = 'records/character/BOHEMIA_THE_THREE_ENEMIES_ROLL.json'   # CHARACTER's three enemies (the Mechanic, the Runners, the Heavy)


def fight_people():
    """the men on COMBAT's board who are their own body in a reference gang's cell, holding that gang's guns: RUN TWO's rolled
    people (kind 'person') and CHARACTER's three enemies (kind 'enemy', the same build pipe)"""
    F = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    return {k: v for k, v in F['looks'].items() if v.get('kind') in ('person', 'enemy')}


def person_done(tag):
    return os.path.exists(os.path.join(ROOT, RENDERS, tag, 'made.txt'))


def person_complete(tag):
    return person_done(tag) and all(made(tag, c) for c, _ in clip_list())


def person_one(tag):
    if not claimed(tag): print('SKIP', tag, 'another worker has him', flush=True); return
    I = idles(); py = sys.executable
    if person_complete(tag): return
    if tag.startswith('enemy_'):   # CHARACTER's enemy: its own build, its model under the barber's name for a rolled person
        pid = next(p['id'] for p in json.load(open(os.path.join(ROOT, ENEMY_ROLL))) if 'enemy_' + p['id'].lower() == tag)
        glb = os.path.join(ROOT, PEOPLE_MODELS, 'barber_person_%s.glb' % pid.lower())
        build = [py, 'tools/bohemia_character_the_three_enemies.py', 'build-one', pid]
    else:
        pid = next(p['id'] for p in json.load(open(os.path.join(ROOT, PEOPLE_ROLL))) if 'person_' + p['id'].lower() == tag)
        glb = os.path.join(ROOT, PEOPLE_MODELS, 'barber_%s.glb' % tag)
        build = [py, 'tools/bohemia_run2_no_two_people_alike.py', 'build-one', pid]
    gj = glb.replace('.glb', '.json')
    kept = open(gj).read() if os.path.exists(gj) else None
    if not os.path.exists(glb) or kept is None:
        bj = os.path.join(ROOT, PEOPLE_MODELS, tag + '.json'); bkept = open(bj).read() if os.path.exists(bj) else None
        I.run(build, glb)
        for fn_, txt in ((gj, kept), (bj, bkept)):   # the build's committed records stand as they are
            if txt is not None:
                with open(fn_, 'w') as f: f.write(txt)
    h = json.load(open(gj))['real_height_for_rig']
    main = not person_done(tag)
    more = [] if main else [m for m in more_clips(tag) if not made(tag, m[0])]   # clips made after his main pass, rendered alone
    if not main and not more: return
    posed = os.path.join(ROOT, POSED, tag + '.glb')
    I.run([py, os.path.abspath(__file__), 'pose', glb, posed], posed)
    out = os.path.join(ROOT, RENDERS, tag + ('' if main else '_more'))
    I.render_model(posed, out, h, [('Stand', 1)] + (clip_list() if main else more))
    os.remove(posed)
    for f in os.listdir(out):
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    if main:
        with open(os.path.join(out, 'made.txt'), 'w') as f: f.write('hold\n')
    print('HOLD person', tag, '' if main else 'the clips made after (%s)' % ', '.join(c for c, _ in more), flush=True)


def people(workers=2):
    todo = [t for t in fight_people() if not person_complete(t)]
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    procs = []
    for w in range(workers):
        mine = todo[w::workers]
        if not mine: continue
        sh = ' ; '.join('%s %s person_one %s' % (sys.executable, os.path.abspath(__file__), x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


def regun(since, clips=('PReload', 'LReload', 'CoverPReload', 'CoverLReload')):
    """the guns of these clips rendered before a change to how they sit (the time, seconds) are rendered again, nothing else"""
    for look in sorted(os.listdir(os.path.join(ROOT, RENDERS))):
        g = os.path.join(ROOT, RENDERS, look, 'guns')
        if look.startswith(('person_', 'enemy_')) or not os.path.isdir(g): continue
        old = [f for f in os.listdir(g) if f.split('_')[1] in clips and os.path.getmtime(os.path.join(g, f)) < since]
        if not old: continue
        for f in old: os.remove(os.path.join(g, f))
        guns(look); print('REGUN', look, len(old), flush=True)


def queue():
    """everyone the fight draws, in the order he meets them: YOU and the hall's hires (his own company: rolled men holding YOU's
    guns), each gang and then its rolled men (a rolled man holds his gang's guns), the tiers, then the cast"""
    named = [l[0] for l in men('ALL')]; P = fight_people(); out = ['you']
    out += sorted(t for t in P if P[t].get('ref') == 'you')                   # the hall's hires: his own company, YOU's guns
    for g in [n for n in named if n.startswith('faction_')]:                   # each gang, then its men (they hold its guns)
        out += [g] + sorted(t for t in P if P[t].get('ref') == g)
    out += [n for n in named if n.startswith('tier_')] + sorted(t for t in P if t not in out)
    return out + [n for n in named if n not in out]


def all_(workers=2):
    todo = [t for t in queue() if not (person_complete(t) if t.startswith(('person_', 'enemy_')) else done(t))]
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    procs = []
    for w in range(workers):
        mine = todo[w::workers]
        if not mine: continue
        sh = ' ; '.join('%s %s %s %s' % (sys.executable, os.path.abspath(__file__), 'person_one' if x.startswith(('person_', 'enemy_')) else 'fight_one', x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


def preview(glb, out, clips='', facings='S,SE,E,N'):
    want = [c for c in clips.split(',') if c]
    cl = [(n, k) for n, k in clip_list() if not want or n in want]
    idles().preview_clips(glb, out, cl, facings)


# ------------------------------------------------------------------------------------------------ pack (python3)
def pack(only=None):
    import numpy as np
    from PIL import Image
    D = source()
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    RIM = tuple(FR['rim'])
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    ip = os.path.join(ROOT, OUT, 'rig_hold.json')
    index = json.load(open(ip)) if os.path.exists(ip) else None
    if not index:   # never rebuilt from nothing: the renders live only in the container that made them, so a man already packed stays
        index = dict(version='rig-hold-10-25', lane='animation', row="[the PC playtest: the bodies' part]", rule='164 (items 21, 22, 31), 128',
                     source='records/target/animation/BOHEMIA_WHAT_A_MAN_HOLDS.json (the clips), laid on COMBAT\'s posed men by '
                            'tools/bohemia_animation_what_a_man_holds.py, rendered by DIRECTION\'s master rig the way COMBAT renders the fight',
                     dirs=FIGHT_DIRS, keys_per_beat=3, clips={n: k for n, k in clip_list(D)}, guns={g: v for g, v in D['guns'].items()},
                     hold=D['hold'], cell='[x, y, w, h, dx, dy]: the cell on the sheet and where its top left sits from the look\'s '
                     'fight-sheet cell origin (so his feet are where they were: the fight sheet\'s foot)', looks={})
    index['clips'] = {n: k for n, k in clip_list(D)}; index['guns'] = {g: v for g, v in D['guns'].items()}
    index['timelines'] = {k: v for k, v in D['timelines'].items() if k != 'why'}   # how a man holds still in a held clip (the fight's block plays them)
    for look in sorted(os.listdir(os.path.join(ROOT, RENDERS)), key=lambda k: (k.startswith(('person_', 'enemy_')), k)):   # the gangs first: a rolled man holds his gang's guns
        if only and look not in only: continue
        d = os.path.join(ROOT, RENDERS, look)
        if look not in FR['looks'] or not os.path.exists(os.path.join(d, 'rig.json')): continue
        person = FR['looks'][look].get('kind') in ('person', 'enemy')   # his own body, his reference gang's guns
        if person and not os.path.exists(os.path.join(d, 'made.txt')): continue
        if person and FR['looks'][look].get('ref') not in index['looks']:
            print('SKIP', look, 'his gang\'s guns are not packed yet'); continue

        jp = os.path.join(ROOT, OUT, look + '.json')
        if only is None and look in index['looks'] and os.path.exists(jp):   # packed after his last render: nothing new to pack
            newest = max(os.path.getmtime(os.path.join(dd, f)) for dd in (d, d + '_more', os.path.join(d, 'guns'), os.path.join(d + '_more', 'guns'))
                         if os.path.isdir(dd) for f in os.listdir(dd))
            ref = FR['looks'][look].get('ref'); rp = os.path.join(ROOT, OUT, (ref or '') + '.json')
            if ref and os.path.exists(rp): newest = max(newest, os.path.getmtime(rp))   # his gang's guns re-packed: his cells copy theirs
            if os.path.getmtime(jp) > newest: continue
        rj = json.load(open(os.path.join(d, 'rig.json')))
        fl = FR['looks'][look]
        # the look's own fight cell is the frame of reference: the same model, still and camera (Stand first), so the same
        # full frame; his feet are the one point both know (the fight sheet's foot, this render's ground pixel)
        cx0, cy0, cx1, cy1 = rj['crop_box_px']
        fx0 = cx0 + rj['ground_px'][0] - fl['foot'][0]; fy0 = cy0 + rj['ground_px'][1] - fl['foot'][1]
        sheet_pal = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', fl['file'])).convert('RGBA'))
        pal = np.array(sorted(set(map(tuple, sheet_pal[sheet_pal[..., 3] > 0][:, :3].tolist()))), np.int32)   # his painted colours only
        def to_pal(a):
            u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
            dd = ((u.astype(np.int32)[:, None, :] - pal[None, :, :]) ** 2).sum(2)
            a[..., :3] = pal[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); return a
        def full(fn, cb):
            a = np.asarray(Image.open(fn).convert('RGBA')).copy()
            if a.shape[0] != rj['res'] or a.shape[1] != rj['res']:
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
        dm = d + '_more'; rm = json.load(open(os.path.join(dm, 'rig.json'))) if os.path.exists(os.path.join(dm, 'rig.json')) else None
        if rm: assert rm['res'] == rj['res'] and rm['ground_screen'] == rj['ground_screen'], look + ': the pass made after is not his frame'
        if not all(made(look, c) for c, _ in clip_list(D)) or (not person and not all(gun_made(look, g, c, D) for g, gl in D['guns'].items() for c in gl)):
            print('SKIP', look, 'not every clip is rendered yet'); continue
        def frame(clip, f, k):   # a clip of the main pass, or of the pass made after it (its own crop of the same full frame)
            fn = os.path.join(d, 'rig_%s_%s_k%02d.png' % (clip, f, k))
            return (fn, rj['crop_box_px']) if os.path.exists(fn) else (os.path.join(dm, 'rig_%s_%s_k%02d.png' % (clip, f, k)), rm['crop_box_px'])
        def gframe(gun, clip, f, k):
            fn = os.path.join(d, 'guns', '%s_%s_%s_k%02d.png' % (gun, clip, f, k))
            return fn if os.path.exists(fn) else os.path.join(dm, 'guns', '%s_%s_%s_k%02d.png' % (gun, clip, f, k))
        imgs, cells, gimgs, gcells = [], {}, [], {}
        for clip, n in clip_list(D):
            for k in range(n):
                for row, f in enumerate(FIGHT_DIRS):
                    a = full(*frame(clip, f, k))
                    r = cut(a, int(G['alpha_threshold']))
                    ix = None
                    if r is not None:
                        a, x0, y0 = r; ix = len(imgs); imgs.append((to_pal(a), x0 - fx0, y0 - fy0))
                    cells.setdefault(clip, [[None] * 8 for _ in range(n)])[k][row] = ix
                    for gun, gl in D['guns'].items():
                        if clip not in gl or person: continue   # a rolled man holds his gang's guns (below)
                        ga = full(gframe(gun, clip, f, k), (0, 0, rj['res'], rj['res']))
                        gr = cut(ga, int(G['alpha_threshold']))
                        gi = None
                        if gr is not None: gi = len(gimgs); gimgs.append((to_pal(gr[0]), gr[1] - fx0, gr[2] - fy0))
                        gcells.setdefault(gun, {}).setdefault(clip, [[None] * 8 for _ in range(n)])[k][row] = gi
        def shelf(items, width):
            order = sorted(range(len(items)), key=lambda i: -items[i][0].shape[0]); x = y = sh = 0; rects = [None] * len(items)
            for i in order:
                h, w = items[i][0].shape[:2]
                if x + w > width: x = 0; y += sh; sh = 0
                rects[i] = [x, y, w, h, int(items[i][1]), int(items[i][2])]; x += w; sh = max(sh, h)
            im = Image.new('RGBA', (width, y + sh), (0, 0, 0, 0))
            for i, (a, _, _) in enumerate(items): im.paste(Image.fromarray(a, 'RGBA'), (rects[i][0], rects[i][1]))
            return im, rects
        body, rects = shelf(imgs, 2048)
        body.save(os.path.join(ROOT, OUT, look + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
        if person:   # his gang's guns, in his gang's cell (the fight sheet's way: the skeleton, the poses and the scale are one)
            ref = json.load(open(os.path.join(ROOT, OUT, index['looks'][fl['ref']]['json'])))
            guns_e = ref['guns']; gim = None
        else:
            gim, grects = shelf(gimgs, 1024)
            gim.save(os.path.join(ROOT, OUT, look + '_guns.webp'), 'WEBP', lossless=True, quality=100, method=6)
            guns_e = dict(file=look + '_guns.webp', size=list(gim.size), cells=grects, clips=gcells)
        entry = dict(fight=fl['file'], foot=fl['foot'], sheet=dict(file=look + '.webp', size=list(body.size), cells=rects), clips=cells, guns=guns_e)
        if person: entry['ref'] = fl['ref']
        # what his model holds in a fist (COOK THREE's tiers: the thug's pipe, the poacher's hatchet; CHARACTER's Runners' sling), read off the render's own
        # parts as the idles pack reads them: it hangs below his soles, and the gate is told so
        parts = set(k for c in rj.get('clips', {}).values() for f_ in c.get('motion_px', {}) for key in c['motion_px'][f_] for k in key)
        held = sorted(p_ for p_ in parts if any(w in p_.lower() for w in ('pipe', 'hatchet', 'club', 'bat', 'knife', 'axe', 'machete', 'spear', 'sling')))   # the Runners' sling: cords out of his right fist
        if held: entry['held'] = held
        json.dump(entry, open(os.path.join(ROOT, OUT, look + '.json'), 'w'), separators=(',', ':'))
        index['looks'][look] = dict(json=look + '.json')
        print('PACKED', look, body.size, os.path.getsize(os.path.join(ROOT, OUT, look + '.webp')), 'guns', gim.size if gim else 'his gang\'s (%s)' % fl['ref'], flush=True)
    json.dump(index, open(ip, 'w'), separators=(',', ':'))
    print('INDEX', ip, len(index['looks']), 'looks')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[2:]
    if cmd == 'pose': pose(a[0], a[1])
    elif cmd == 'fight_one': fight_one(a[0])
    elif cmd == 'fight': fight(a[0] if a else 'ALL', int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'guns': guns(a[0])
    elif cmd == 'person_one': person_one(a[0])
    elif cmd == 'people': people(int(a[0]) if a else 2)
    elif cmd == 'all': all_(int(a[0]) if a else 2)
    elif cmd == 'regun': regun(float(a[0]))
    elif cmd == 'tail':   # one more worker from the back of the queue (the lock keeps two off one man)
        for t in reversed([t for t in queue() if not (person_complete(t) if t.startswith(('person_', 'enemy_')) else done(t)) and not t.startswith('enemy_')]):
            subprocess.call([sys.executable, os.path.abspath(__file__), 'person_one' if t.startswith('person_') else 'fight_one', t], cwd=ROOT)
    elif cmd == 'preview': preview(*a)
    elif cmd == 'pack': pack(a or None)
    else: sys.exit('pose <in> <out> | fight [LOOK|ALL] [workers] | preview <glb> <png> [clips] [facings] | pack [LOOK ...]')
