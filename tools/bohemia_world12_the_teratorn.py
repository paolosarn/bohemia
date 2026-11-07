#!/usr/bin/env python3
"""BOHEMIA -- WORLD 12: THE TERATORN, ONE MORE BEAST (11/7/26; VAMILY rule 431(e)(f), ask lines 516 and 517).

PAOLO 11/7: 'there's too many vultures on screen on the map... I thought they would be like an enemy type'; his answer B (the vulture
is an enemy), then 'just another animal we can fight'. The coordinator (431(f)): ONE MORE BEAST in the roster, met and fought the way
the other beasts are; no special systems, no map sign; it keeps looking like a vulture (the bald red head, the ruff, the long fingered
wings) at every size; lab-made by the beast law (laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md).

REAL FIRST: Teratornis incredibilis, the giant teratorn, described by Hildegarde Howard (1952) from Smith Creek Cave in Nevada's own
Snake Range; its smaller cousin T. merriami (the La Brea teratorn) stood about 75 cm and spanned 3.5 to 3.8 m at about 14 kg; the
Nevada bird was bigger. The lab grew it in a California condor (Gymnogyps), the nearest living bird of its shape; the coordinator's
number is about four metres of wing. So: a 4.0 m span, about 0.95 m standing, about 20 kg. The condor recovery programme tags every
bird it frees with a numbered wing tag on the leading edge (a patagial tag): that is this bird's lab mark (the hi-vis plate every lab
beast wears, rule 345 amended (d)).

WHY IT IS ITS OWN TOOL: every other beast is built on the Khronos Fox's skeleton (four legs, tools/bohemia_beasts_every_beast_its_own_
body.py). A bird is two legs and two wings, so it gets its own skeleton (26 bones: the root, the body, the neck, the head, two legs, and
each wing in three parts with its seven fingered primaries) and its own moves, and it goes through the SAME master rig, the same pack
and the same index as every beast, so the fight and the map read it like any other animal (the stand, the walk, the bite, the blow, the
fall; 18 columns, a row a facing, 64 colours).

THE BODY is grown from parts in metres (ellipsoids for the body, the belly, the thighs and the head; a cone for the bare neck, a hooked
beak, blunt toes; the wings as overlapping feather planks, the primaries seven separate fingers with gaps between them, the condor's
silver bar along the upper wing), each part riding one bone (held poses, the Crashbox way: nothing between two keys is ever drawn).
THE MOVES: the walk is a waddle with the wings half opened for balance (how a condor walks on the ground); the bite rears up with the
wings spread wide and strikes down with the hooked beak; the blow throws it back with the wings flaring; the fall tips it onto its side
with one wing sprawled on the ground. Analog horror at the source, never gore: the numbered wing tag, the bare red skin.

    <venv bpy 4.2>/bin/python tools/bohemia_world12_the_teratorn.py model     -> reference/models/bohemia/own_body/teratorn.glb
    <venv bpy 4.2>/bin/python tools/bohemia_world12_the_teratorn.py render    -> records/target/combat/rig/beast_teratorn (the master rig)
    python3 tools/bohemia_world12_the_teratorn.py pack                        -> slices/fight_rig/beast_teratorn.webp + fight_rig.json
    python3 tools/bohemia_world12_the_teratorn.py strip                       -> records/target/world12_teratorn/ (the reference check)

REFERENCE CHECK (the 9/4 standing duty): beside the 1.72 m man (98 px) and the dire wolf at the fight's pixels, its measured standing
height and span printed beside the real bird's (the audit). No reference game.
"""
import json, math, os, sys, subprocess, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = 'reference/models/bohemia/own_body/teratorn.glb'
LOOK = 'beast_teratorn'
RENDERS = 'records/target/combat/rig'
OUT = 'slices/fight_rig'
STRIPS = 'records/target/world12_teratorn'
AUDIT = 'records/target/world12_teratorn/teratorn_audit.json'
CLIPS = [('Walk', 6), ('Bite', 6), ('Hit', 2), ('Fall', 3)]
SAMPLES = int(os.environ.get('BOHEMIA_RIG_SAMPLES', '24'))
TICK = 10   # a drawn key every ten frames, at the middle of its slot, so the rig's (i + 0.5) / keys lands exactly on it

S = 1.25          # the body's scale over T. merriami's (75 cm standing -> about 0.95 m)
SPAN = 4.0        # metres, tip to tip
REAL = dict(span_m=SPAN, standing_m=0.95, kg=20,
            source='Teratornis incredibilis, Howard 1952, Smith Creek Cave, Nevada; T. merriami (La Brea) about 75 cm standing, 3.5 to 3.8 m span, about 14 kg; the coordinator: about four metres of wing; a California condor surrogate')

COL = {   # sRGB
    'feather': (27, 23, 20), 'feather2': (36, 29, 24), 'feather3': (44, 36, 30), 'silver': (138, 133, 124), 'ruff': (217, 210, 195),
    'neck': (176, 74, 59), 'head': (194, 64, 47), 'caruncle': (143, 42, 34), 'beak': (216, 203, 163), 'beaktip': (58, 51, 43),
    'eye': (58, 18, 16), 'leg': (156, 139, 128), 'toe': (110, 98, 90), 'talon': (42, 38, 34), 'tag': (183, 224, 30), 'tagnum': (20, 20, 18)}


def lin(c): return tuple(((v / 255.0 + 0.055) / 1.055) ** 2.4 if v / 255.0 > 0.04045 else (v / 255.0) / 12.92 for v in c)


# ---------------------------------------------------------------------------------------------------------------- the skeleton
def bones():
    """name -> (head, tail, parent), metres, nose toward -Y, up +Z, the bird's left +X"""
    B = {
        'root': ((0, 0, 0), (0, 0, 0.15), None),
        'body': ((0, 0.18 * S, 0.38 * S), (0, -0.18 * S, 0.52 * S), 'root'),
        'neck': ((0, -0.20 * S, 0.52 * S), (0, -0.30 * S, 0.66 * S), 'body'),
        'head': ((0, -0.30 * S, 0.66 * S), (0, -0.44 * S, 0.68 * S), 'neck'),
    }
    for sd, k in (('L', 1), ('R', -1)):
        B[sd + '_leg'] = ((k * 0.07 * S, 0.05 * S, 0.30 * S), (k * 0.07 * S, 0.04 * S, 0.03), 'body')
        sh = (k * 0.15 * S, -0.10 * S, 0.56 * S)
        el = (k * 0.56, -0.10 * S, 0.58 * S)
        wr = (k * 1.06, -0.06 * S, 0.60 * S)
        hd = (k * 1.42, -0.02 * S, 0.60 * S)
        B[sd + '_up'] = (sh, el, 'body'); B[sd + '_fore'] = (el, wr, sd + '_up'); B[sd + '_hand'] = (wr, hd, sd + '_fore')
        for i, (phi, ln) in enumerate(FINGERS):
            bx = 1.22 + 0.033 * i
            base = (k * bx, -0.05 * S + 0.03 * i, 0.60 * S)
            a = math.radians(phi)
            tip = (base[0] + k * ln * math.cos(a), base[1] + ln * math.sin(a), base[2])
            B['%s_f%d' % (sd, i + 1)] = (base, tip, sd + '_hand')
    return B


FINGERS = [(2, 0.80), (8, 0.78), (14, 0.74), (20, 0.69), (26, 0.63), (32, 0.56), (38, 0.48)]   # degrees back from straight out, length


# ---------------------------------------------------------------------------------------------------------------- the parts
def build(bpy, bmesh, Matrix, Vector):
    parts = []   # (bm, material, bone)

    def new(): return bmesh.new()

    def ell(c, r, mat, bone, rot=None, seg=(18, 12)):
        bm = new(); bmesh.ops.create_uvsphere(bm, u_segments=seg[0], v_segments=seg[1], radius=1.0)
        M = Matrix.Translation(Vector(c)) @ (rot or Matrix.Identity(4)) @ Matrix.Diagonal((r[0], r[1], r[2], 1))
        bmesh.ops.transform(bm, matrix=M, verts=bm.verts); parts.append((bm, mat, bone))

    def box(c, size, mat, bone, rot=None):
        bm = new(); bmesh.ops.create_cube(bm, size=1.0)
        M = Matrix.Translation(Vector(c)) @ (rot or Matrix.Identity(4)) @ Matrix.Diagonal((size[0], size[1], size[2], 1))
        bmesh.ops.transform(bm, matrix=M, verts=bm.verts); parts.append((bm, mat, bone))

    def cone(a, b, r1, r2, mat, bone, seg=10):
        a, b = Vector(a), Vector(b); d = b - a; L = d.length
        bm = new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r1, radius2=r2, depth=L)
        q = Vector((0, 0, 1)).rotation_difference(d.normalized())
        M = Matrix.Translation((a + b) / 2) @ q.to_matrix().to_4x4()
        bmesh.ops.transform(bm, matrix=M, verts=bm.verts); parts.append((bm, mat, bone))

    def rx(deg): return Matrix.Rotation(math.radians(deg), 4, 'X')
    def rz(deg): return Matrix.Rotation(math.radians(deg), 4, 'Z')

    # the body: a dark barrel tilted chest-up, the belly a step browner, the thighs' feathered 'trousers', the back's cape
    ell((0, 0.04 * S, 0.44 * S), (0.17 * S, 0.30 * S, 0.16 * S), 'feather', 'body', rx(-25))
    ell((0, -0.02 * S, 0.40 * S), (0.14 * S, 0.24 * S, 0.13 * S), 'feather3', 'body', rx(-25))
    for k in (1, -1):
        ell((k * 0.08 * S, 0.06 * S, 0.31 * S), (0.065 * S, 0.09 * S, 0.09 * S), 'feather2', 'body')
    ell((0, 0.10 * S, 0.53 * S), (0.15 * S, 0.24 * S, 0.06 * S), 'feather2', 'body', rx(-12))
    # the tail: a short square fan, tipped down
    for j, x in enumerate((-0.12, -0.06, 0.0, 0.06, 0.12)):
        ell((x * S, 0.40 * S, 0.40 * S - abs(x) * 0.2), (0.045 * S, 0.16 * S, 0.008), 'feather' if j % 2 else 'feather2', 'body', rx(18), seg=(12, 6))
    # the RUFF: the pale collar at the neck's root, fluffed (a ring of soft lumps)
    for i in range(10):
        a = 2 * math.pi * i / 10
        c = (math.cos(a) * 0.075 * S, -0.19 * S + math.sin(a) * 0.055 * S, 0.54 * S + 0.012 * math.sin(3 * a))
        ell(c, (0.045 * S, 0.04 * S, 0.035 * S), 'ruff', 'body', seg=(10, 7))
    ell((0, -0.19 * S, 0.53 * S), (0.08 * S, 0.07 * S, 0.05 * S), 'ruff', 'body', seg=(12, 8))
    # the bare neck and the bald red head, its wrinkled caruncles, the dark eye, the long hooked beak
    cone((0, -0.20 * S, 0.53 * S), (0, -0.31 * S, 0.665 * S), 0.040 * S, 0.033 * S, 'neck', 'neck')
    ell((0, -0.355 * S, 0.68 * S), (0.052 * S, 0.075 * S, 0.052 * S), 'head', 'head')
    for c in ((0.03, -0.33, 0.70), (-0.03, -0.33, 0.70), (0.0, -0.32, 0.725), (0.035, -0.36, 0.66), (-0.035, -0.36, 0.66)):
        ell((c[0] * S, c[1] * S, c[2] * S), (0.018 * S, 0.018 * S, 0.015 * S), 'caruncle', 'head', seg=(8, 6))
    for k in (1, -1):
        ell((k * 0.04 * S, -0.385 * S, 0.695 * S), (0.010 * S, 0.010 * S, 0.010 * S), 'eye', 'head', seg=(8, 6))
    cone((0, -0.41 * S, 0.68 * S), (0, -0.50 * S, 0.665 * S), 0.026 * S, 0.016 * S, 'beak', 'head')
    cone((0, -0.495 * S, 0.668 * S), (0, -0.515 * S, 0.635 * S), 0.016 * S, 0.006 * S, 'beaktip', 'head', seg=8)
    # the legs: bare grey-pink shanks, three toes forward and one back, blunt dark talons (a vulture's are blunt)
    for sd, k in (('L', 1), ('R', -1)):
        cone((k * 0.07 * S, 0.045 * S, 0.27 * S), (k * 0.07 * S, 0.04 * S, 0.03), 0.026 * S, 0.022 * S, 'leg', sd + '_leg')
        for ang, ln in ((-25, 0.11), (0, 0.13), (25, 0.11), (180, 0.06)):
            a = math.radians(ang); d = Vector((math.sin(a) * k, -math.cos(a), 0))
            base = Vector((k * 0.07 * S, 0.04 * S, 0.022)); tip = base + d * ln * S
            cone(tuple(base), tuple(tip), 0.016, 0.011, 'toe', sd + '_leg', seg=6)
            cone(tuple(tip), tuple(tip + d * 0.025 + Vector((0, 0, -0.012))), 0.010, 0.002, 'talon', sd + '_leg', seg=6)
    # the WINGS, spread (the rest pose): the leading edge, the coverts with the silver bar, the secondaries, the hand, seven fingers
    B = bones()
    for sd, k in (('L', 1), ('R', -1)):
        sh, el = Vector(B[sd + '_up'][0]), Vector(B[sd + '_up'][1]); wr = Vector(B[sd + '_fore'][1]); hd = Vector(B[sd + '_hand'][1])
        def plank(x0, x1, y0, y1, z, mat, bone, th=0.012):   # a feather: a flattened ellipsoid, rounded at the tip, overlapping its neighbour
            ell(((x0 + x1) / 2, (y0 + y1) / 2, z), (abs(x1 - x0) * 0.62, abs(y1 - y0) * 0.52, th * 0.6), mat, bone, seg=(14, 6))
        # the leading edge (a thick dark roll along the bone) on each segment
        cone(tuple(sh), tuple(el), 0.035, 0.03, 'feather2', sd + '_up'); cone(tuple(el), tuple(wr), 0.03, 0.026, 'feather2', sd + '_fore')
        cone(tuple(wr), tuple(hd), 0.026, 0.02, 'feather2', sd + '_hand')
        # tertials on the upper arm, secondaries on the forearm (each its own plank, a little ragged), the silver bar over them
        n = 0
        for (a0, a1, bone, chord) in ((sh.x, el.x, sd + '_up', 0.40), (el.x, wr.x, sd + '_fore', 0.46)):
            steps = max(3, int(abs(a1 - a0) / 0.065))
            for i in range(steps):
                x0 = a0 + (a1 - a0) * i / steps; x1 = a0 + (a1 - a0) * (i + 1.25) / steps
                ln = chord * (1.0 - 0.06 * ((n * 7) % 3)); n += 1
                plank(x0, x1, sh.y + 0.03, sh.y + 0.03 + ln * S, sh.z + 0.012 - 0.002 * (i % 2), 'feather' if n % 3 else 'feather3', bone)
            plank(a0, a1, sh.y + 0.04, sh.y + 0.16 * S, sh.z + 0.026, 'silver', bone, th=0.01)
            plank(a0, a1, sh.y - 0.01, sh.y + 0.06, sh.z + 0.03, 'feather2', bone, th=0.014)
        # the hand's coverts
        plank(wr.x, hd.x, wr.y - 0.02, wr.y + 0.22 * S, wr.z + 0.02, 'feather2', sd + '_hand', th=0.014)
        # the seven fingered primaries, each its own feather with a gap to the next, a little narrower at the tip
        for i in range(7):
            b0, b1 = Vector(B['%s_f%d' % (sd, i + 1)][0]), Vector(B['%s_f%d' % (sd, i + 1)][1])
            d = (b1 - b0); L = d.length; ang = math.atan2(d.y, d.x)
            R = Matrix.Rotation(ang, 4, 'Z')
            ell(tuple(b0 + d * 0.50), (L * 0.52, 0.046, 0.008), 'feather' if i % 2 else 'feather3', '%s_f%d' % (sd, i + 1), R, seg=(14, 6))
        # THE LAB MARK: the condor programme's numbered wing tag on the leading edge, near the shoulder, both faces
        tc = sh + (el - sh) * 0.45
        box((tc.x, tc.y - 0.03, tc.z), (0.085, 0.022, 0.075), 'tag', sd + '_up')
        box((tc.x, tc.y - 0.043, tc.z), (0.045, 0.004, 0.03), 'tagnum', sd + '_up')
    return parts


# ---------------------------------------------------------------------------------------------------------------- the poses
def frame_rot(Vector, Matrix, a0, t0, a, t):
    """the rotation that takes a bone's rest frame (its axis a0, its feathers' trailing direction t0) to (a, t)"""
    a0, t0, a, t = Vector(a0).normalized(), Vector(t0), Vector(a).normalized(), Vector(t)
    t0 = (t0 - a0 * a0.dot(t0)).normalized(); t = (t - a * a.dot(t)).normalized()
    A0 = Matrix((a0, t0, a0.cross(t0))).transposed(); A1 = Matrix((a, t, a.cross(t))).transposed()
    return (A1 @ A0.transposed()).to_quaternion()


def poses(Vector, Matrix, Quaternion):
    """each pose: absolute rotations F (in the rest frame's axes, about each joint) plus the root's offset; the converter makes them
    each bone's local rotation through the chain"""
    def R(axis, deg): return Quaternion(Vector(axis), math.radians(deg))
    I = Quaternion()
    B = bones()

    def fold(sd, open_=0.0, lift=0.0):
        k = 1 if sd == 'L' else -1
        F = {}
        up = frame_rot(Vector, Matrix, (k, 0, 0), (0, 1, 0), (k * 0.10, 1, -0.10), (k * 0.45, 0, -1))
        fo = frame_rot(Vector, Matrix, (k, 0, 0), (0, 1, 0), (k * 0.12, -1, -0.12), (k * 0.45, 0, -1))
        ha = frame_rot(Vector, Matrix, (k, 0, 0), (0, 1, 0), (k * 0.05, 1, -0.30), (k * 0.40, 0, -1))
        sp = R((0, 1, 0), -k * lift)   # spread, the tip raised by lift degrees
        F[sd + '_up'] = up.slerp(sp, open_); F[sd + '_fore'] = fo.slerp(sp, open_); F[sd + '_hand'] = ha.slerp(sp, open_)
        for i, (phi, ln) in enumerate(FINGERS):
            unsplay = R((0, 0, 1), -k * phi)
            F['%s_f%d' % (sd, i + 1)] = (ha @ unsplay).slerp(sp, open_)
        return F

    def spread(sd, lift=0.0, sweep=0.0, splay=1.0):
        k = 1 if sd == 'L' else -1
        q = R((0, 0, 1), -k * sweep) @ R((0, 1, 0), -k * lift)
        F = {sd + '_up': q, sd + '_fore': q, sd + '_hand': q}
        for i, (phi, ln) in enumerate(FINGERS):
            F['%s_f%d' % (sd, i + 1)] = q @ R((0, 0, 1), -k * phi * (1 - splay))
        return F

    def pose(body=0.0, neck=0.0, head=0.0, legL=0.0, legR=0.0, roll=0.0, root=(0, 0, 0), wings=None, rootrot=None):
        F = {'root': rootrot or I, 'body': R((1, 0, 0), body) @ R((0, 1, 0), roll), 'neck': R((1, 0, 0), neck), 'head': R((1, 0, 0), head),
             'L_leg': R((1, 0, 0), legL), 'R_leg': R((1, 0, 0), legR)}
        for w in (wings or [fold('L'), fold('R')]): F.update(w)
        return F, root

    P = {}
    # the walk: a waddle, the weight from foot to foot, the wings eased open for balance, the head bobbing (6 keys, 2 beats)
    P['Walk'] = [pose(body=4, neck=18, legL=-24, legR=14, roll=-6, root=(0, 0, 0.000), wings=[fold('L', 0.22, 20), fold('R', 0.12, 10)]),
                 pose(body=2, neck=24, legL=-8, legR=4, roll=-3, root=(0, 0, 0.025), wings=[fold('L', 0.10, 10), fold('R', 0.10, 10)]),
                 pose(body=4, neck=16, legL=10, legR=-10, roll=2, root=(0, 0, 0.012), wings=[fold('L', 0.05), fold('R', 0.05)]),
                 pose(body=4, neck=18, legL=14, legR=-24, roll=6, root=(0, 0, 0.000), wings=[fold('L', 0.12, 10), fold('R', 0.22, 20)]),
                 pose(body=2, neck=24, legL=4, legR=-8, roll=3, root=(0, 0, 0.025), wings=[fold('L', 0.10, 10), fold('R', 0.10, 10)]),
                 pose(body=4, neck=16, legL=-10, legR=10, roll=-2, root=(0, 0, 0.012), wings=[fold('L', 0.05), fold('R', 0.05)])]
    # the bite: it rears with the wings thrown wide (the fingers splayed), then strikes down with the hooked beak, mantling over it
    P['Bite'] = [pose(body=-14, neck=-26, head=10, root=(0, 0.04, 0.02), wings=[spread('L', 22, 0, 0.8), spread('R', 22, 0, 0.8)]),
                 pose(body=-22, neck=-34, head=14, root=(0, 0.06, 0.05), wings=[spread('L', 34), spread('R', 34)]),
                 pose(body=18, neck=34, head=10, root=(0, -0.16, 0.02), wings=[spread('L', 12, 16), spread('R', 12, 16)]),
                 pose(body=24, neck=48, head=16, root=(0, -0.20, 0.0), wings=[spread('L', -6, 22), spread('R', -6, 22)]),
                 pose(body=10, neck=20, head=0, root=(0, -0.08, 0.0), wings=[fold('L', 0.6, 14), fold('R', 0.6, 14)]),
                 pose(body=4, neck=16, root=(0, 0, 0), wings=[fold('L', 0.25, 10), fold('R', 0.25, 10)])]
    # the blow: thrown back, the wings flaring up; then it finds its feet
    P['Hit'] = [pose(body=-24, neck=-30, head=-10, root=(0, 0.10, 0.03), wings=[fold('L', 0.75, 48), fold('R', 0.75, 48)]),
                pose(body=-8, neck=6, root=(0, 0.05, 0), wings=[fold('L', 0.30, 20), fold('R', 0.30, 20)])]
    # the fall: it staggers with one wing dropping, slumps forward, and lies on its breast with both wings sprawled flat on the ground
    # and the bare neck stretched out along it (a dead bird, seen from above; its legs folded under it)
    P['Fall'] = [pose(body=10, neck=30, roll=12, root=(0.02, 0, -0.03), wings=[fold('L', 0.55, -8), fold('R', 0.30, 24)]),
                 pose(body=22, neck=48, head=10, legL=-40, legR=-40, root=(0, -0.04, -0.12), wings=[spread('L', -10, -8, 0.5), spread('R', -16, -4, 0.4)]),
                 pose(body=30, neck=62, head=14, legL=-80, legR=-80, root=(0, -0.08, -0.20), wings=[spread('L', -9, -14, 0.8), spread('R', -9, -10, 0.8)])]
    return P


# ---------------------------------------------------------------------------------------------------------------- model
def model():
    import bpy, bmesh
    from mathutils import Matrix, Vector, Quaternion
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; sc.render.fps = 24
    B = bones()
    ad = bpy.data.armatures.new('teratorn_rig'); arm = bpy.data.objects.new('teratorn_rig', ad); sc.collection.objects.link(arm)
    bpy.context.view_layer.objects.active = arm; arm.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    for name, (h, t, p) in B.items():
        e = ad.edit_bones.new(name); e.head = h; e.tail = t
    for name, (h, t, p) in B.items():
        if p: ad.edit_bones[name].parent = ad.edit_bones[p]
    bpy.ops.object.mode_set(mode='OBJECT')
    # the parts, each one object with one material and one bone's group; joined into one mesh
    mats = {}
    # the names say what the surface is, the style guide's way (wear_by_material: 'hair, skin and eyes are not paint'): the feathers are
    # a coat (hair: the sun's dust takes a little of it, never the paint's grey), the bare head and neck are skin, the eye an eye
    NAME = {'feather': 'feather_hair', 'feather2': 'feather2_hair', 'feather3': 'feather3_hair', 'silver': 'silver_hair', 'ruff': 'ruff_hair',
            'neck': 'neck_skin', 'head': 'head_skin', 'caruncle': 'caruncle_skin', 'eye': 'eye'}
    for k, c in COL.items():
        m = bpy.data.materials.new(NAME.get(k, k)); m.use_nodes = True; bsdf = m.node_tree.nodes.get('Principled BSDF')
        bsdf.inputs['Base Color'].default_value = lin(c) + (1.0,)
        bsdf.inputs['Roughness'].default_value = 0.35 if k in ('eye', 'beak', 'beaktip', 'talon', 'tag') else 0.9
        if 'Specular IOR Level' in bsdf.inputs: bsdf.inputs['Specular IOR Level'].default_value = 0.2 if k.startswith('feather') else 0.35
        mats[k] = m
    objs = []
    for i, (bm, mat, bone) in enumerate(build(bpy, bmesh, Matrix, Vector)):
        me = bpy.data.meshes.new('part%d' % i); bm.to_mesh(me); bm.free()
        o = bpy.data.objects.new('part%d' % i, me); sc.collection.objects.link(o)
        o.data.materials.append(mats[mat]); vg = o.vertex_groups.new(name=bone); vg.add(list(range(len(me.vertices))), 1.0, 'REPLACE')
        objs.append(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    body = bpy.context.view_layer.objects.active; body.name = 'teratorn'; body.data.name = 'teratorn'
    for p in body.data.polygons: p.use_smooth = False
    body.parent = arm; mod = body.modifiers.new('Armature', 'ARMATURE'); mod.object = arm
    # the moves
    P = poses(Vector, Matrix, Quaternion)
    arm.animation_data_create()
    restq = {b.name: b.matrix_local.to_quaternion() for b in ad.bones}
    parent = {n: B[n][2] for n in B}
    for pb in arm.pose.bones: pb.rotation_mode = 'QUATERNION'
    for clip, keys in P.items():
        act = bpy.data.actions.new(clip); arm.animation_data.action = act
        frames = [(i + 0.5) * TICK for i in range(len(keys))]
        seq = [(0.0, keys[0])] + list(zip(frames, keys)) + [(len(keys) * TICK, keys[-1])]
        for fr, (F, root) in seq:
            for pb in arm.pose.bones:
                # the wing's parts are given in the body's frame (each its own orientation); a part's rotation on its joint is its own
                # orientation over its parent's; every other bone's is given on its joint already
                n = pb.name; f = F.get(n, Quaternion()); p = parent[n]
                rel = (F.get(p, Quaternion()).inverted() @ f) if (p and ('_fore' in p or '_up' in p or '_hand' in p)) else f
                Rb = restq[n]
                pb.rotation_quaternion = Rb.inverted() @ rel @ Rb
                pb.location = (0, 0, 0)
                if n == 'root':
                    pb.location = Rb.inverted() @ Vector(root)
                pb.keyframe_insert('rotation_quaternion', frame=fr); pb.keyframe_insert('location', frame=fr)
    ad_ = arm.animation_data; ad_.action = None
    for t in list(ad_.nla_tracks): ad_.nla_tracks.remove(t)
    for act in bpy.data.actions:
        t = ad_.nla_tracks.new(); t.name = act.name; t.strips.new(act.name, int(act.frame_range[0]), act)
    out = os.path.join(ROOT, MODEL); os.makedirs(os.path.dirname(out), exist_ok=True)
    # the audit: what it measures folded (the walk) and spread (the bite), in metres
    def dims(clip, frame):
        ad_.action = bpy.data.actions[clip]; sc.frame_set(int(frame))
        dg = bpy.context.evaluated_depsgraph_get(); ev = body.evaluated_get(dg); me = ev.to_mesh()
        xs = [ (ev.matrix_world @ v.co) for v in me.vertices ]; ev.to_mesh_clear()
        lo = Vector((min(v.x for v in xs), min(v.y for v in xs), min(v.z for v in xs))); hi = Vector((max(v.x for v in xs), max(v.y for v in xs), max(v.z for v in xs)))
        return [round(hi.x - lo.x, 3), round(hi.y - lo.y, 3), round(hi.z - lo.z, 3), round(lo.z, 3)]
    aud = dict(real=REAL, walk_passing=dims('Walk', 2.5 * TICK), bite_spread=dims('Bite', 1.5 * TICK), fall_lying=dims('Fall', 2.5 * TICK),
               bones=len(ad.bones), verts=len(body.data.vertices), clips=[a.name for a in bpy.data.actions])
    ad_.action = None
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                              export_skins=True, export_apply=False, export_yup=True, export_image_format='AUTO', export_nla_strips=True)
    os.makedirs(os.path.join(ROOT, STRIPS), exist_ok=True)
    json.dump(aud, open(os.path.join(ROOT, AUDIT), 'w'), indent=1)
    print('WROTE', MODEL, json.dumps(aud), flush=True)


# ---------------------------------------------------------------------------------------------------------------- render / pack / strip
def run(cmd, out):
    import time
    for i in range(3):
        t0 = time.time()
        if subprocess.call(cmd, cwd=ROOT) == 0: return
        if out and os.path.exists(out) and os.path.getmtime(out) >= t0 - 1: return
    raise SystemExit('FAILED three times: ' + ' '.join(cmd))


def render():
    """DIRECTION's master rig with the fight's two changes in memory (the five beasts' own), and one more: the frame is wide enough for
    four metres of spread wing (the rig sizes its frame off the still, a folded bird; a bite spreads four metres)"""
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    a, b = 'lights.append(light_footprint(', "sc.render.engine = G['engine'];"
    c = 'span = math.hypot(dims[0], dims[1]) + dims[2] * zs + 0.6'
    assert src.count(a) == 1 and src.count(b) == 1 and src.count(c) == 1, 'the master rig changed: re-read it before patching in memory'
    th = int(os.environ.get('BOHEMIA_RIG_THREADS', '0'))
    src = src.replace(a, 'False and lights.append(light_footprint(').replace(b, "sc.render.use_persistent_data = True; " +
        ("sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % th if th else '') + b)
    aud = json.load(open(os.path.join(ROOT, AUDIT)))
    src = src.replace(c, 'span = max(math.hypot(dims[0], dims[1]) + dims[2] * zs + 0.6, %.3f)' % (SPAN + 1.0 * 1.414 + 0.8))
    real_len = max(aud['walk_passing'][0], aud['walk_passing'][1])   # the rig scales the still's long side to this: the model is already metres
    out = os.path.join(ROOT, RENDERS, LOOK)
    argv = ['bohemia_direction_master_rig.py', os.path.join(ROOT, MODEL), out, '--real-length', '%.3f' % real_len, '--family', 'none',
            '--set', 'samples=%d' % SAMPLES, '--no-calibration', '--no-id-pass', '--set', 'dent_m=0']
    for cl, k in CLIPS: argv += ['--clip', '%s:%d' % (cl, k)]
    if os.environ.get('BOHEMIA_PREVIEW'):
        out = os.path.join(os.environ['BOHEMIA_PREVIEW'], LOOK); argv[2] = out; argv += ['--stills-only']
    code = ('import sys; sys.argv = %r; __file__ = %r\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'))) + src
    run([sys.executable, '-c', code], os.path.join(out, 'rig.json'))
    print('RENDERED', os.path.relpath(out, ROOT), flush=True)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, path))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


def pack():
    """into the fight's sheet exactly as the five beasts are packed: a row per facing, 18 columns (the still, the walk 6, the bite 6,
    the blow 2, the fall 3), the one-pixel day rim, 64 colours with the lab tag's own entry, lossless; merged into the index"""
    import numpy as np
    from PIL import Image
    WR = load('wears', 'tools/bohemia_combat_the_fight_wears_the_rig.py')
    idx_path = os.path.join(ROOT, OUT, 'fight_rig.json'); index = json.load(open(idx_path))
    cols = [('stand', None, 1), ('walk', 'Walk', 6), ('bite', 'Bite', 6), ('hit', 'Hit', 2), ('fall', 'Fall', 3)]
    d = os.path.join(ROOT, RENDERS, LOOK); r = json.load(open(os.path.join(d, 'rig.json')))
    x0, y0, x1, y1 = r['crop_box_px']; w, h = x1 - x0 + 2, y1 - y0 + 2
    sheet = Image.new('RGBA', (w * 18, h * len(WR.FIGHT_DIRS)), (0, 0, 0, 0))
    for row, f in enumerate(WR.FIGHT_DIRS):
        col = 0
        for n, c, ks in cols:
            for k in range(ks):
                fn = os.path.join(d, 'rig_%s_%s_k%02d.png' % (c, f, k)) if c else os.path.join(d, 'rig_%s.png' % f)
                a = np.pad(np.asarray(Image.open(fn).convert('RGBA')).copy(), ((1, 1), (1, 1), (0, 0)))
                op = a[..., 3] > 0; near = np.zeros_like(op)
                near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                a[near & ~op] = WR.RIM
                sheet.paste(Image.fromarray(a, 'RGBA'), (col * w, row * h)); col += 1
    a = np.asarray(sheet)
    f = a[..., :3].astype(np.float32); mark = (a[..., 3] > 0) & (f[..., 1] > f[..., 0] * 1.05) & (f[..., 1] > f[..., 2] * 1.8) & (f[..., 1] > 70)
    n_res = 1 if mark.sum() >= 4 else 0
    q = np.asarray(Image.fromarray(a[..., :3]).quantize(WR.SHEET_COLOURS - n_res, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')).copy()
    if n_res: q[mark] = f[mark].mean(0).round().astype(np.uint8)
    sheet = Image.fromarray(np.dstack([q, a[..., 3]]), 'RGBA')
    file = LOOK + '.webp'
    sheet.save(os.path.join(ROOT, OUT, file), 'WEBP', lossless=True, quality=100, method=6)
    index['looks'][LOOK] = dict(file=file, w=w, h=h, foot=[r['ground_px'][0] + 1, r['ground_px'][1] + 1], height_m=r['real_dims_m'][2],
                                kind='beast', rig=os.path.relpath(os.path.join(d, 'rig.json'), ROOT),
                                clips=dict(stand=[0], walk=list(range(1, 7)), bite=list(range(7, 13)), hit=[13, 14], fall=[15, 16, 17]),
                                by='WORLD 12 [the teratorn] 11/7, tools/bohemia_world12_the_teratorn.py')
    json.dump(index, open(idx_path, 'w'), indent=1)
    print('PACKED', sheet.size, os.path.getsize(os.path.join(ROOT, OUT, file)), 'mark px', int(mark.sum()))


def strip():
    """the reference check: its eight stills, then its walk, bite, blow and fall facing SE, at the fight's pixels, beside the dire wolf
    and the 1.72 m man's height marked; and one card: the man's ruler, the wolf, the teratorn standing and the teratorn striking"""
    from PIL import Image, ImageDraw
    os.makedirs(os.path.join(ROOT, STRIPS), exist_ok=True)
    index = json.load(open(os.path.join(ROOT, OUT, 'fight_rig.json'))); dirs = index['dirs']
    L = index['looks'][LOOK]; s = Image.open(os.path.join(ROOT, OUT, L['file'])).convert('RGBA')
    cell = lambda row, col: s.crop((col * L['w'], row * L['h'], (col + 1) * L['w'], (row + 1) * L['h']))
    se = dirs.index('SE')
    frames = [cell(r, 0) for r in range(len(dirs))] + [cell(se, c) for c in range(1, 18)]
    img = Image.new('RGBA', (L['w'] * len(frames), L['h']), (24, 22, 20, 255))
    for i, f in enumerate(frames): img.alpha_composite(f, (i * L['w'], 0))
    dr = ImageDraw.Draw(img); fx, fy = L['foot']; dr.line([(1, fy), (1, fy - 98)], fill=(200, 60, 50, 255), width=2)
    img.save(os.path.join(ROOT, STRIPS, 'teratorn_strip.png'))
    W = index['looks']['beast_dire_wolf']; ws = Image.open(os.path.join(ROOT, OUT, W['file'])).convert('RGBA')
    wolf = ws.crop((0, se * W['h'], W['w'], (se + 1) * W['h']))
    stand, strike = cell(se, 0), cell(se, 8)
    gap = 10; H = max(L['h'], W['h']) + 2 * gap; Wd = 12 + W['w'] + L['w'] * 2 + 5 * gap
    card = Image.new('RGBA', (Wd, H), (24, 22, 20, 255)); d2 = ImageDraw.Draw(card)
    base = H - gap
    d2.line([(gap, base), (gap, base - 98)], fill=(200, 60, 50, 255), width=3)
    x = gap + 12
    card.alpha_composite(wolf, (x, base - W['foot'][1])); x += W['w'] + gap
    card.alpha_composite(stand, (x, base - L['foot'][1])); x += L['w'] + gap
    card.alpha_composite(strike, (x, base - L['foot'][1]))
    card.resize((card.width * 2, card.height * 2), Image.NEAREST).save(os.path.join(ROOT, STRIPS, 'teratorn_beside_the_wolf_and_the_man.png'))
    print('STRIPS', STRIPS)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    {'model': model, 'render': render, 'pack': pack, 'strip': strip}.get(cmd, lambda: sys.exit('model | render | pack | strip'))()
