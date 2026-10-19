#!/usr/bin/env python3
"""BOHEMIA -- COMBAT [the fight wears the 3D models] (rule 121, Paolo 10/19: 'a full implementation of the 3D models, that's
top priority'; 'combat is still not smooth... it looks like it's been coded by a fifth grader'). THE FIGHT'S CLIPS ON THE
RIG'S MAN.

The rig's man (reference/models/khronos/CesiumMan.glb, the body every look in the fight is built on: CHARACTER's thirteen,
PORTRAIT's crew bodies, COOK THREE's tiers) carries two clips, Stand and the walk (Anim_0). The fight needs four more: the
long gun to the shoulder and its kick, the pistol out in one hand, the club over the head and down, the blow that rocks
him, and the fall to the ground. This tool POSES THE SAME SKELETON (no vertex is touched, nothing is drawn) and writes the
poses as named actions beside the two it had, so DIRECTION's master rig renders them like the walk: eight facings, the drawn
keys only, three a beat at 120.

THE KEYS ARE HELD (Crashbox, the look bible: held poses, not smooth motion): the master rig samples a clip of N keys over its
frame range [0, 2N] at frames 2k + 1, so pose k is keyed exactly there (and the range's two ends repeat the first and the
last): the key drawn is the pose made, never a blend.

    Aim    3 keys (one beat): the gun comes up to the shoulder in both hands, the kick, the settle (a pistol is held the
           same way, two hands: the modern stance)
    Swing  3 keys: the club over the shoulder, the blow, the follow through
    Hit    2 keys: the blow lands: the chest back and the head snapped, then he finds his feet
    Fall   3 keys: the knees go, he tips back over his heels, he lies on his back (the last key is the body on the ground)

THE SKELETON'S AXES, read off the bones (armature space): +X forward (the knee and the toes are ahead of the hip), -Y up
(the neck at -1.19, the feet at 0), +Z the man's left (the left arm's bones at +z). Every turn below is about one of those
three axes, through the bone's own head, applied root first, so a turned shoulder carries the elbow and the hand.

Run with Blender's Python (bpy 4.2 in a python3.11 venv, as the master rig):
    <venv>/bin/python tools/bohemia_combat_the_fight_poses.py <in.glb> <out.glb> [--beast]
    --beast: a four-legged model (the dire wolf redone, the feral dogs, the hyena): its own clips stand (Survey, Walk, Bite);
             only Hit and Fall are added, the whole animal rocked and laid on its side.

REUSE CHECK: the skeleton, its weights, its walk and Stand are the rig's man's, reused whole; the bodies are CHARACTER's and
PORTRAIT's builds and COOK THREE's tiers, read, never edited; the render is DIRECTION's master rig, unedited.
REFERENCE CHECK (the 9/4 standing duty): the compare law: the clips are judged beside the old fight sheet's own clips
(slices/fight_people: two-hand, bat-arc, stagger-hit, sleep) on the VOTE card; analog horror AH-01; no reference game.
"""
import math, os, re, sys

F, U, L = (1, 0, 0), (0, -1, 0), (0, 0, 1)   # forward, up, the man's left, in the armature's space


def man_keys():
    """every clip as a list of keys; a key is a list of (bone, axis, degrees) turns, plus ('ROOT', pivot, axis, degrees,
    move) for the whole body. Positive degrees turn by the right hand about the axis."""
    T1, T2, T3 = 'Skeleton_torso_joint_1', 'Skeleton_torso_joint_2', 'torso_joint_3'
    N1, N2 = 'Skeleton_neck_joint_1', 'Skeleton_neck_joint_2'
    LU, LF, LH = 'Skeleton_arm_joint_L__4_', 'Skeleton_arm_joint_L__3_', 'Skeleton_arm_joint_L__2_'
    RU, RF, RH = 'Skeleton_arm_joint_R', 'Skeleton_arm_joint_R__2_', 'Skeleton_arm_joint_R__3_'
    LT, LS, LA = 'leg_joint_L_1', 'leg_joint_L_2', 'leg_joint_L_3'
    RT, RS, RA = 'leg_joint_R_1', 'leg_joint_R_2', 'leg_joint_R_3'
    # THE SIGNS, read off the axes: about L, +deg tips up toward forward (a hanging arm at -deg comes up in front of him; the
    # chest at +deg leans forward); about U, +deg turns forward toward his left; about F, +deg lifts his left side's arm out
    # sideways (the right arm goes out at -deg)
    aim = [(RU, L, -50), (RU, F, -35), (RF, U, 80), (RF, L, -30), (LU, L, -75), (LU, U, -25), (LF, L, -10), (T2, U, -10), (N2, U, 10)]
    kick = aim + [(T2, L, -7), (N1, L, -4), (RU, L, -6), (LU, L, -10)]
    wind = [(RU, L, -160), (RU, F, -15), (RF, L, -70), (LU, L, -30), (T2, U, -25), (T2, L, -6), (N2, U, 20)]
    blow = [(RU, L, -40), (RF, L, -10), (LU, L, -20), (T2, U, 15), (T2, L, 14), (N1, L, 6)]
    follow = [(RU, L, -5), (RU, U, 30), (LU, L, -10), (T2, U, 25), (T2, L, 10)]
    rock = [(T2, L, -16), (N1, L, -18), (RU, F, -25), (LU, F, 25), (RF, L, -20), (LF, L, -20)]
    rock2 = [(T2, L, -8), (N1, L, -6), (RU, F, -12), (LU, F, 12), (RT, L, 12), (RS, L, 10)]
    # the fall: the knees buckle and the hips drop, he tips back over his heels, he lies on his back
    buckle = [('ROOT', (0, 0, 0), L, 0, (0, 0.16, 0)), (LT, L, -50), (LS, L, 95), (LA, L, -45), (RT, L, -40), (RS, L, 80), (RA, L, -40),
              (T2, L, 18), (N1, L, 10), (RU, F, -10), (LU, F, 10)]
    tip = [('ROOT', (0, 0, 0), L, -42, (0.15, 0.0, 0)), (LT, L, -40), (LS, L, 60), (RT, L, -24), (RS, L, 40), (T2, L, -10), (N1, L, -16),
           (RU, F, -30), (LU, F, 30)]
    still = [('ROOT', (0, 0, 0), L, -90, (0.5, -0.1, 0)), (LT, L, -8), (LS, L, 14), (RT, L, -2), (RS, L, 4), (N1, L, -6), (N2, U, 24),
             (RU, F, -58), (LU, F, 52), (RF, L, -16), (LF, L, -14)]
    # a pistol is held in two hands like the long gun (the modern stance): one clip, every gun
    return dict(Aim=[aim, kick, aim], Swing=[wind, blow, follow], Hit=[rock, rock2], Fall=[buckle, tip, still])


def beast_keys(arm):
    """a beast's Hit and Fall: the whole animal rocked away from the blow, then laid on its side"""
    root = arm.pose.bones[0].name
    for pb in arm.pose.bones:
        if pb.parent is None: root = pb.name; break
    return root


def main():
    import bpy, mathutils
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    src, out, beast = a[0], a[1], '--beast' in a
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(src))
    for o in list(sc.objects):   # the importer's stray 42-vertex Icosphere (the master rig drops it too)
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    ad = arm.animation_data or arm.animation_data_create()
    acts = list(bpy.data.actions)
    base_act = [x for x in acts if x.name.startswith('Stand')] or [x for x in acts if x.name.startswith('Survey')] or acts
    # every action the model came with is kept on its own NLA track (the exporter writes every track)
    for x in acts:
        if not any(s.action == x for t in ad.nla_tracks for s in t.strips):
            nm = re.sub(r'(_Armature)+$', '', x.name)   # the importer names Anim_0 'Anim_0_Armature_Armature'
            t = ad.nla_tracks.new(); t.name = nm; t.strips.new(nm, int(x.frame_range[0]), x); t.mute = True
    ad.action = base_act[0]
    f0, f1 = base_act[0].frame_range
    still = (f0 + f1) / 2
    if not base_act[0].name.startswith(('Stand', 'Survey')):
        # no Stand (COOK THREE's tiers carry the walk only): the walk's passing pose, the narrowest frame, as the master rig
        # reads its still, and it is written as Stand so every look carries the same clips
        meshes = [o for o in sc.objects if o.type == 'MESH']
        best = None
        for i in range(24):
            fr = f0 + (f1 - f0) * (i + 0.5) / 24
            sc.frame_set(int(fr), subframe=fr - int(fr)); bpy.context.view_layer.update()
            xs, ys = [], []
            for o in meshes:
                ev = o.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
                for v in ev.vertices:
                    w = o.matrix_world @ v.co; xs.append(w.x); ys.append(w.y)
                o.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh_clear()
            d = min(max(xs) - min(xs), max(ys) - min(ys))
            if best is None or d < best[0]: best = (d, fr)
        still = best[1]
    sc.frame_set(int(still), subframe=still - int(still))
    bpy.context.view_layer.update()
    need_stand = not any(x.name.startswith('Stand') for x in acts) and not beast
    base = {pb.name: pb.matrix_basis.copy() for pb in arm.pose.bones}
    order = []
    def walk(b):
        order.append(b.name)
        for c in b.children: walk(c)
    for b in arm.data.bones:
        if b.parent is None: walk(b)

    def pose(ops):
        for pb in arm.pose.bones: pb.matrix_basis = base[pb.name].copy()
        bpy.context.view_layer.update()
        for op in sorted(ops, key=lambda o: order.index(o[0]) if o[0] in order else -1):
            if op[0] == 'ROOT':
                _, piv, ax, deg, move = op
                pb = arm.pose.bones[order[0]]
                M = pb.matrix.copy(); P = mathutils.Vector(piv)
                R = mathutils.Matrix.Translation(P + mathutils.Vector(move)) @ mathutils.Matrix.Rotation(math.radians(deg), 4, mathutils.Vector(ax)) @ mathutils.Matrix.Translation(-P)
                pb.matrix = R @ M
            else:
                bone, ax, deg = op
                pb = arm.pose.bones[bone]
                M = pb.matrix.copy(); P = M.translation.copy()
                R = mathutils.Matrix.Translation(P) @ mathutils.Matrix.Rotation(math.radians(deg), 4, mathutils.Vector(ax)) @ mathutils.Matrix.Translation(-P)
                pb.matrix = R @ M
            bpy.context.view_layer.update()

    if beast:
        root = beast_keys(arm)
        hip = arm.pose.bones[root].matrix.translation.copy()
        # a beast's own space: read its long axis off its bones (the head is the far end from the tail)
        side = mathutils.Vector((0, 0, 1))
        keys = dict(Hit=[[('ROOT', tuple(hip), tuple(side), -10, (0, 0, 0))], [('ROOT', tuple(hip), tuple(side), -5, (0, 0, 0))], [('ROOT', tuple(hip), tuple(side), -1, (0, 0, 0))]])
        clips = keys
    else:
        clips = man_keys()
        if need_stand: clips = dict([('Stand', [[]])] + list(clips.items()))
    made = []
    for name, keys in clips.items():
        act = bpy.data.actions.new(name)
        ad.action = act
        n = len(keys)
        for fr, ops in [(0, keys[0])] + [(2 * k + 1, keys[k]) for k in range(n)] + [(2 * n, keys[-1])]:
            pose(ops)
            for pb in arm.pose.bones:
                for ch in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(ch, frame=fr)
        t = ad.nla_tracks.new(); t.name = name; t.strips.new(name, 0, act); t.mute = True
        made.append((name, len(keys)))
    ad.action = None
    for pb in arm.pose.bones: pb.matrix_basis = base[pb.name].copy()
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(out), export_format='GLB', export_skins=True, export_animations=True, export_apply=False,
                              use_selection=False, export_animation_mode='NLA_TRACKS', export_force_sampling=True)
    print('POSED', out, made)


if __name__ == '__main__':
    main()
