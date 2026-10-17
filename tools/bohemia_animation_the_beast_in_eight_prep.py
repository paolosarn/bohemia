#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the beast in eight]: THE FOX BECOMES THE LAB'S DIRE WOLF, IN BLENDER, BEFORE DIRECTION'S RIG
(rule 107: everything that faces is made in all eight directions; rule 108 (a): no pixel is drawn in code, the pixels
come from a 3D render; rule 108 ROUND EIGHT (b): DIRECTION owns the one camera, this tool never renders; rule 42: the
beast is lab-made, a de-extinct Aenocyon dirus on a grey-wolf surrogate; the Khronos Fox is the stage-1 source,
records/BOHEMIA_THE_BEAST_IN_EIGHT_IS_BLOCKED_10_16_26.md).

WHAT IT DOES, in Blender's own Python (bpy 4.2), on the model, never on a picture:
  1. THE COAT: the fox's one 1024 texture is recoloured at the source: the orange goes to a grizzled grey-brown, the
     white to a pale cream, the black stays, and a seeded grain breaks the toy's flat colour (analog horror is thought
     about at the source, never a filter on the sprite). The texture is packed back into the model.
  2. THE HEFT: a dire wolf is a heavier grey wolf: the body is 1.2 wider across the shoulders and the skull 1.18
     larger (the thing every reconstruction agrees on: the big head and the heavy jaw). The lateral width is the
     armature's own X scale (the model faces -Y); the skull is a scale key on the head bone in every clip.
  3. THE BITE: the fox has Survey (an idle), Walk and Run and no jaw bone. A fourth clip, Bite, two beats at 120
     (24 frames at the model's 24 fps), is posed on its own bones from the idle's first frame: it sits back low with the
     head down (the crouch), springs forward and UP with the head reaching for a man's chest, not a mouse (the
     spring; the first pose reached down and read as a fox pouncing, the rig's own loop caught it), shuts on him
     with a shake (the bite), and comes back (the recover): the quadruped's own timing (engine/bohemia_quadruped.js lunge:
     crouch .00-.33, spring .33-.50, the bite .50-.67, recover .67-1). Every rotation is about a WORLD axis applied
     after the base pose (q' = q_base * quat(axis in the bone's own frame)), so a nod is a nod on every bone whatever
     way its rest axis points. Angles stay small enough that six drawn keys read as one motion (AN ENVELOPE RAMPS
     SLOWER THAN THE GRID): the first spring changed 61 percent of the silhouette between two drawn keys (measured
     on the render), so the thrust and the head swing were cut by a third; the second still changed 53 on the crouch-to-spring key
     (the body itself moving 14 px between two keys on N), so the crouch is shallower and the spring lower: the eye
     reads a lunge as the head and the shoulders, not the whole body leaving its footprint.
  4. WRITES reference/models/bohemia/dire_wolf.glb with the four clips, and a LICENSE line beside it (the model is
     CC0 by PixelMannen, the rig and the three clips CC BY 4.0 by tomkranis; the Bite and the coat are ours).
  Then DIRECTION's rig, unchanged, turns it: tools/bohemia_direction_master_rig.py ... --real-length 1.6 --family none
  --clip Survey:12 --clip Walk:6 --clip Bite:6.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the pack's own animals sheet (reference/art_bank_index/sheets/19__Animals_and_creatures.jpg, a grey wolf facing you, 96 tall) is the twin on the card; the game's formula wolf (engine/bohemia_quadruped.js) is the placeholder this replaces; the 1.72 m man is the ruler (records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md). The beast law (rule 42): a dire wolf is a heavier grey wolf, lab-made. No reference game.
Run: <venv with bpy 4.2>/bin/python tools/bohemia_animation_the_beast_in_eight_prep.py [reference/models/khronos/Fox.glb] [out.glb]
"""
import os, sys, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'reference/models/khronos/Fox.glb')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'reference/models/bohemia/dire_wolf.glb')
WIDTH, SKULL = 1.2, 1.18
FPS, BITE_FRAMES = 24, 24   # two beats at 120 BPM = 1.0 s = 24 frames at the model's own 24 fps

# the bite, as (frame, {bone: (world-X nod degrees, world-Z shake degrees)}, root (forward units, down units; the model
# is about 100 units long)); forward is -Y on this model, nose down is +X, so the spring's nod is negative (up). Crouch 0-8, spring 8-12, the bite 12-16, recover 16-24; frame 24 is frame 0 (a loop).
BITE = [
    (0,  {}, (0.0, 0.0)),
    (6,  {'b_Neck_04': (8, 0), 'b_Head_05': (4, 0), 'b_Spine01_02': (4, 0)}, (-2.0, 2.0)),
    (10, {'b_Neck_04': (-16, 0), 'b_Head_05': (-10, 0), 'b_Spine02_03': (-7, 0), 'b_RightUpperArm_06': (-20, 0), 'b_LeftUpperArm_09': (-20, 0)}, (10.0, -3.0)),
    (14, {'b_Neck_04': (-13, 0), 'b_Head_05': (-2, 10), 'b_Spine02_03': (-6, 0), 'b_RightUpperArm_06': (-13, 0), 'b_LeftUpperArm_09': (-13, 0)}, (13.0, -2.0)),
    (18, {'b_Neck_04': (-4, 0), 'b_Head_05': (0, -4), 'b_Spine01_02': (2, 0)}, (6.0, 0.0)),
    (24, {}, (0.0, 0.0)),
]


def recolour(img, seed=7):
    """the coat at the source: orange -> grizzled grey-brown, white -> pale cream, black stays; seeded grain"""
    import numpy as np
    w, h = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    rgb = px[..., :3]
    mx = rgb.max(-1); mn = rgb.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    # the orange (saturated): a warm grey, two thirds as bright; the white (unsaturated, bright): cream; the dark stays
    tone = np.array([0.56, 0.50, 0.44], np.float32)   # the grizzle, a grey with the brown left in it
    orange = sat > 0.35
    grey = np.stack([lum * tone[0] * 1.15, lum * tone[1] * 1.15, lum * tone[2] * 1.15], -1)
    cream = np.stack([lum * 0.88, lum * 0.86, lum * 0.80], -1)
    out = np.where(orange[..., None], grey, np.where((lum > 0.5)[..., None], cream, rgb * 0.9))
    rng = np.random.default_rng(seed)
    grain = 1.0 + (rng.random((h, w, 1), dtype=np.float32) - 0.5) * 0.14   # +-7 percent, the toy's flat colour broken
    out = np.clip(out * grain, 0, 1)
    px[..., :3] = out
    img.pixels = px.ravel().tolist()
    img.pack()
    return int(orange.sum()), int(((lum > 0.5) & ~orange).sum())


def world_axis_in_bone(pb, axis):
    """a world axis expressed in the pose bone's own frame, from its current (base) pose matrix"""
    import mathutils
    return (pb.matrix.to_3x3().inverted() @ mathutils.Vector(axis)).normalized()


def main():
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=SRC)
    sc = bpy.context.scene
    sc.render.fps = FPS
    for o in list(sc.objects):   # the importer's stray 2 m icosphere (DIRECTION measured it inside the ruler's box)
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    mesh = [o for o in sc.objects if o.type == 'MESH'][0]
    # 1. the coat
    img = mesh.data.materials[0].node_tree.nodes['Image Texture'].image
    n_orange, n_white = recolour(img)
    # clean clip names (the importer suffixes _root)
    for a in bpy.data.actions:
        a.name = a.name.split('_')[0]
    # 2. the heft: the shoulders, and the skull in every clip (a scale key at the clip's two ends)
    arm.scale = (WIDTH, 1.0, 1.0)
    head = arm.pose.bones['b_Head_05']
    for a in bpy.data.actions:
        arm.animation_data.action = a
        for fr in (a.frame_range[0], a.frame_range[1]):
            head.scale = (SKULL, SKULL, SKULL); head.keyframe_insert('scale', frame=fr, group='b_Head_05')
    # 3. the bite, from the idle's first frame
    base = bpy.data.actions['Survey']
    arm.animation_data.action = base; sc.frame_set(int(base.frame_range[0]))
    bpy.context.view_layer.update()
    base_pose = {pb.name: (pb.rotation_quaternion.copy(), pb.location.copy(), pb.scale.copy()) for pb in arm.pose.bones}
    axes = {pb.name: (world_axis_in_bone(pb, (1, 0, 0)), world_axis_in_bone(pb, (0, 0, 1))) for pb in arm.pose.bones}
    root = arm.pose.bones['b_Root_00']
    root_fwd = world_axis_in_bone(root, (0, -1, 0)); root_up = world_axis_in_bone(root, (0, 0, 1))
    bite = bpy.data.actions.new('Bite'); arm.animation_data.action = bite
    for fr, bones, (fwd, down) in BITE:
        for pb in arm.pose.bones:
            q0, l0, s0 = base_pose[pb.name]
            q = q0.copy()
            if pb.name in bones:
                nod, shake = bones[pb.name]
                ax, az = axes[pb.name]
                q = q0 @ mathutils.Quaternion(ax, math.radians(nod)) @ mathutils.Quaternion(az, math.radians(shake))
            pb.rotation_quaternion = q; pb.keyframe_insert('rotation_quaternion', frame=fr, group=pb.name)
            loc = l0.copy()
            if pb.name == 'b_Root_00':
                loc = l0 + root_fwd * fwd - root_up * down
            pb.location = loc; pb.keyframe_insert('location', frame=fr, group=pb.name)
            pb.scale = (SKULL, SKULL, SKULL) if pb.name == 'b_Head_05' else s0; pb.keyframe_insert('scale', frame=fr, group=pb.name)
    for fc in bite.fcurves:
        for k in fc.keyframe_points: k.interpolation = 'BEZIER'
    bite.frame_range = (0, BITE_FRAMES); bite.use_frame_range = True
    # every clip on its own NLA track so the exporter writes all four
    ad = arm.animation_data; ad.action = None
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    for a in bpy.data.actions:
        t = ad.nla_tracks.new(); t.name = a.name; t.strips.new(a.name, int(a.frame_range[0]), a)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                              export_skins=True, export_apply=False, export_yup=True, export_image_format='AUTO', export_nla_strips=True)
    print('WROTE', os.path.relpath(OUT, ROOT), 'clips', [a.name for a in bpy.data.actions], 'orange px recoloured', n_orange, 'white px', n_white,
          'width x%s skull x%s bite %d frames' % (WIDTH, SKULL, BITE_FRAMES))


if __name__ == '__main__':
    main()
