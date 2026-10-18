#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the beasts through the rig, the wolf redone]: THE DIRE WOLF REMODELLED AT THE SOURCE, IN BLENDER,
BEFORE DIRECTION'S RIG (rule 115c: the beasts remade through the rig; his NO on the grey one, 'the ugliest', and his eye
that the fox read better; rule 108 (a): no pixel drawn in code; rule 42: the beast is lab-made, a de-extinct Aenocyon
dirus on a grey-wolf surrogate).

WHY THE GREY ONE WAS UGLY, MEASURED ON ITS OWN SHEET BESIDE THE FOX (records/BOHEMIA_THE_WOLF_REDONE_10_18_26.md):
  1. ONE FLAT COLOUR. The fox reads in three tones (orange, white, dark socks). The old recolour caught every texel over
     0.35 saturation, and the dark-brown socks ARE saturated, so the socks went grey with the coat: one flat grey-brown
     from nose to feet, nothing for the eye to hold.
  2. THE STILL WAS A SNIFF. The eight stills were the idle's first frame (head down, tail up); the fox's were the walk's
     passing pose. Rendered here with --still pass, the fox's way.
  3. A FOX UNDER A GREY COAT. 1.2 wider made it squat, and the fox's big ears and brush tail stayed.

WHAT THIS DOES, on the model, never on a picture (bpy 4.2, headless):
  1. THE SHAPE, in the rest pose, mesh and bones together (each bone moved, never turned, so every clip still plays):
     LEGS 1.35 longer below the belly line and 1.6 thicker about their own bones (a wolf stands tall on real legs, a
     fox low on sticks); the CHEST 1.2 deeper at the shoulders tapering to the hips and the neck's RUFF 1.25 fuller;
     EARS 0.6 the height, pulled toward their base (short and rounded); MUZZLE 1.2 longer forward of the eyes (the long
     wolf face); the TAIL 0.7 as thick about its own bones (a rope, not a brush); the body 1.3 wider, the skull 1.16.
     The rig's own loop, three passes by eye beside the fox (rule 97): pass one read as a coyote on stilts (legs only),
     pass two still a skinny coyote (width and limbs 1.35), pass three a heavy wolf (the numbers above); stopped there.
  2. THE COAT, painted from the 3D shape: every texel of the one texture is traced back to its point on the body
     (rasterised through the UVs), so the coat follows the animal, not the texture's layout: a dark grizzled SADDLE
     where the back faces up (neck to tail), TAWNY flanks (the 2021 ancient-DNA paper on Aenocyon put it as a reddish
     wolf; the lab followed the genes), CREAM belly, chest and cheeks where the fox was white, DARK socks kept dark, the
     tail's tip BLACK where the fox's was white (every wolf has it), and a grizzle at body scale (a seeded noise in 3D,
     six centimetres across, plus or minus 6 percent; 12 read as mange; never per texel).
  3. THE BITE: the same clip as [the beast in eight] (tools/bohemia_animation_the_beast_in_eight_prep.py BITE), posed on
     the remodelled bones.
  4. WRITES reference/models/bohemia/dire_wolf_redone.glb (four clips) and the licence line.
  Then DIRECTION's rig, unchanged: tools/bohemia_direction_master_rig.py reference/models/bohemia/dire_wolf_redone.glb
  records/target/master_rig/dire_wolf_redone --real-length 1.7 --family none --still pass --clip Survey:12 --clip Walk:6
  --clip Bite:6

REFERENCE CHECK (the 9/4 standing duty): the fox through the same rig (records/target/master_rig/fox) is the bar he named;
the old grey wolf (records/target/master_rig/dire_wolf) is the NO beside it; the 1.72 m man is the ruler. No reference game.
Run: <venv with bpy 4.2>/bin/python tools/bohemia_animation_the_wolf_redone_prep.py [Fox.glb] [out.glb]
"""
import os, sys, math, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'reference/models/khronos/Fox.glb')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'reference/models/bohemia/dire_wolf_redone.glb')
_spec = importlib.util.spec_from_file_location('beast8', os.path.join(ROOT, 'tools/bohemia_animation_the_beast_in_eight_prep.py'))
B8 = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(B8)

# the shape (model units: about 140 long, the model faces -Y, Z up)
BELLY_Z, LEG = 42.0, 1.35         # below the belly line the legs stretch, above it everything rides up
EAR_Z, EAR_Y, EAR = 70.0, -53.0, 0.6   # head vertices above 70 and behind the eyes are the ears
EYE_Y, MUZZLE = -50.0, 1.2        # head vertices forward of the eyes are the muzzle
TAIL = 0.7
WIDTH, SKULL = 1.3, 1.16
LIMB, RUFF, DEPTH = 1.6, 1.25, 1.2           # the legs thicker about their own bones; the neck and the chest's ruff fuller
LIMBS = (('b_RightUpperArm_06', 'b_RightForeArm_07', 'b_RightHand_08'), ('b_LeftUpperArm_09', 'b_LeftForeArm_010', 'b_LeftHand_011'),
         ('b_RightLeg01_019', 'b_RightLeg02_020', 'b_RightFoot01_021', 'b_RightFoot02_022'),
         ('b_LeftLeg01_015', 'b_LeftLeg02_016', 'b_LeftFoot01_017', 'b_LeftFoot02_018'))
TAILS = ('b_Tail01_012', 'b_Tail02_013', 'b_Tail03_014')

# the coat (sRGB, the byte texture's own space: Blender hands a byte image's pixels back unconverted)
TAWNY = (0.72, 0.55, 0.38)
SADDLE = (0.40, 0.36, 0.32)
CREAM = (0.90, 0.86, 0.76)
SOCK = (0.30, 0.24, 0.19)
TIP = (0.16, 0.14, 0.13)


def leg_z(z):
    return z + (LEG - 1) * BELLY_Z if z >= BELLY_Z else z * LEG


def dominant(v, names):
    return names[max(v.groups, key=lambda g: g.weight).group] if v.groups else ''


def reshape(arm, mesh):
    """the rest pose: mesh vertices and bones together; bones translate, never rotate"""
    import bpy, mathutils
    import numpy as np
    names = {g.index: g.name for g in mesh.vertex_groups}
    me = mesh.data
    dom = [dominant(v, names) for v in me.vertices]
    co = np.array([v.co[:] for v in me.vertices])
    # ears and muzzle first (head-local), on the original coordinates
    head = np.array([d == 'b_Head_05' for d in dom])
    ear = head & (co[:, 2] > EAR_Z) & (co[:, 1] > EAR_Y)
    for side in (-1, 1):
        sel = ear & (np.sign(co[:, 0]) == side)
        if sel.any():
            base_z = EAR_Z - 2
            c = co[sel].copy(); cx, cy = c[:, 0].mean(), c[:, 1].mean()
            c[:, 2] = base_z + (c[:, 2] - base_z) * EAR
            c[:, 0] = cx + (c[:, 0] - cx) * 0.85; c[:, 1] = cy + (c[:, 1] - cy) * 0.85
            co[sel] = c
    muz = head & (co[:, 1] < EYE_Y)
    co[muz, 1] = EYE_Y + (co[muz, 1] - EYE_Y) * MUZZLE
    # the tail thinner, the legs thicker, each about its own chain of rest joints
    def about_chain(bones, factor, extend):
        joints = [np.array(arm.data.bones[b].head_local[:]) for b in bones]
        joints.append(extend(joints))
        sel = np.array([d in bones for d in dom])
        for i in np.where(sel)[0]:
            p = co[i]; best = None
            for a, b in zip(joints[:-1], joints[1:]):
                ab = b - a; t = np.clip(np.dot(p - a, ab) / np.dot(ab, ab), 0, 1); q = a + t * ab
                d = np.linalg.norm(p - q)
                if best is None or d < best[0]: best = (d, q)
            co[i] = best[1] + (p - best[1]) * factor
        return int(sel.sum())
    n_tail = about_chain(TAILS, TAIL, lambda j: j[-1] + 1.6 * (j[-1] - j[-2]))
    for chain in LIMBS:
        about_chain(chain, LIMB, lambda j: np.array([j[-1][0], j[-1][1], 0.0]))
    # the ruff: neck and chest fuller across and down, about the spine's own line
    ruff = np.array([d in ('b_Neck_04', 'b_Spine02_03') for d in dom])
    cz = 58.0
    co[ruff, 0] *= RUFF
    co[ruff, 2] = cz + (co[ruff, 2] - cz) * RUFF
    # the chest deep and the belly tucked: the trunk's underside pushed down at the shoulders, less at the hips
    trunk = np.array([d in ('b_Spine02_03', 'b_Spine01_02', 'b_UpperArm') for d in dom]) & (co[:, 2] < cz)
    reach = np.clip((20.0 - co[:, 1]) / 40.0, 0.3, 1.0)   # 1 at the shoulders (y -20), 0.3 by the hips (y +8)
    co[trunk, 2] = cz - (cz - co[trunk, 2]) * (1 + (DEPTH - 1) * reach[trunk])
    # the legs: the whole model, last
    co[:, 2] = np.array([leg_z(z) for z in co[:, 2]])
    for v, c in zip(me.vertices, co): v.co = mathutils.Vector(c)
    me.update()
    # the bones: each moved by its head's displacement, so no bone turns and every clip still plays
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode='EDIT')
    for eb in arm.data.edit_bones:
        dz = leg_z(eb.head.z) - eb.head.z
        eb.head.z += dz; eb.tail.z += dz
    bpy.ops.object.mode_set(mode='OBJECT')
    return int(ear.sum()), int(muz.sum()), n_tail


def trace(mesh):
    """every texel traced to its point on the body through the UVs: (image, pixels, the fox's three classes, the 3D point,
    the normal and the bone of each texel); the feral dog pack paints from the same trace"""
    import numpy as np
    me = mesh.data
    img = me.materials[0].node_tree.nodes['Image Texture'].image
    w, h = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    rgb = px[..., :3]
    mx = rgb.max(-1); mn = rgb.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    # the fox's three classes, read from its own texture (sRGB): white, the dark socks (lum 0.22), the orange (0.6)
    white = (lum > 0.8) & (sat < 0.3)
    dark = (lum < 0.4) & ~white
    orange = ~white & ~dark
    # per-texel 3D point, normal and bone, rasterised through the UVs
    P = np.zeros((h, w, 3), np.float32); N = np.zeros((h, w, 3), np.float32); BONE = np.full((h, w), -1, np.int16)
    names = {g.index: g.name for g in mesh.vertex_groups}
    tailidx = {i for i, n in names.items() if n in TAILS}
    headidx = {i for i, n in names.items() if n in ('b_Head_05', 'b_Neck_04')}
    me.calc_loop_triangles()
    uvl = me.uv_layers[0].data
    for tri in me.loop_triangles:
        uv = np.array([uvl[l].uv[:] for l in tri.loops]) * (w, h)
        vs = [me.vertices[i] for i in tri.vertices]
        pp = np.array([v.co[:] for v in vs]); nn = np.array([v.normal[:] for v in vs])
        g = max(vs[0].groups, key=lambda g: g.weight).group if vs[0].groups else -1
        x0, y0 = np.floor(uv.min(0)).astype(int); x1, y1 = np.ceil(uv.max(0)).astype(int)
        x0, y0 = max(x0, 0), max(y0, 0); x1, y1 = min(x1, w - 1), min(y1, h - 1)
        if x1 < x0 or y1 < y0: continue
        xs, ys = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
        (ax, ay), (bx, by), (cx, cy) = uv
        den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
        if abs(den) < 1e-9: continue
        l0 = ((by - cy) * (xs - cx) + (cx - bx) * (ys - cy)) / den
        l1 = ((cy - ay) * (xs - cx) + (ax - cx) * (ys - cy)) / den
        l2 = 1 - l0 - l1
        m = (l0 >= -0.02) & (l1 >= -0.02) & (l2 >= -0.02)
        if not m.any(): continue
        L = np.stack([l0, l1, l2], -1)[m]
        iy, ix = (ys[m] - 0.5).astype(int), (xs[m] - 0.5).astype(int)
        P[iy, ix] = L @ pp; nv = L @ nn; N[iy, ix] = nv / np.maximum(np.linalg.norm(nv, axis=1, keepdims=True), 1e-6)
        BONE[iy, ix] = g
    return img, px, rgb, lum, white, dark, orange, P, N, BONE, names


def paint_coat(mesh, seed=11):
    """every texel traced to its point on the body through the UVs; the coat follows the animal"""
    import numpy as np
    img, px, rgb, lum, white, dark, orange, P, N, BONE, names = trace(mesh)
    tailidx = {i for i, n in names.items() if n in TAILS}
    headidx = {i for i, n in names.items() if n in ('b_Head_05', 'b_Neck_04')}
    covered = BONE >= 0
    # the saddle: where the back faces up, above the belly, along neck, back and the tail's top; never the face
    up = np.clip((N[..., 2] - 0.25) / 0.55, 0, 1)
    high = np.clip((P[..., 2] - (BELLY_Z * LEG + 6)) / 10, 0, 1)
    is_head = np.isin(BONE, list(headidx)) & (P[..., 1] < -44)
    saddle = up * high * (~is_head)
    # the grizzle: a seeded value noise in 3D, about 6 model units (6 cm) across, +-6 percent (12 read as mange)
    rng = np.random.default_rng(seed)
    lat = rng.random((48, 48, 48)).astype(np.float32)
    q = np.clip((P / 6.0 + 24).astype(int), 0, 47)
    griz = 1.0 + (lat[q[..., 0], q[..., 1], q[..., 2]] - 0.5) * 0.12
    shade = np.clip(lum / max(float(np.median(lum[orange])), 1e-3), 0.6, 1.25)[..., None]   # the fox's own light baked in its texture, kept
    tawny = np.array(TAWNY, np.float32) * shade
    coat = tawny * (1 - saddle[..., None]) + np.array(SADDLE, np.float32) * saddle[..., None]
    out = np.where(orange[..., None], coat, rgb)
    out = np.where(white[..., None], np.array(CREAM, np.float32), out)
    out = np.where(dark[..., None], np.array(SOCK, np.float32), out)
    tipm = white & np.isin(BONE, list(tailidx))
    out = np.where(tipm[..., None], np.array(TIP, np.float32), out)
    out = np.where(covered[..., None], out * griz[..., None], out)
    px[..., :3] = np.clip(out, 0, 1)
    img.pixels = px.ravel().tolist()
    img.pack()
    return {'texels': int(covered.sum()), 'saddle': int((saddle > 0.5).sum()), 'tip': int(tipm.sum()),
            'white': int(white.sum()), 'dark': int(dark.sum()), 'orange': int(orange.sum())}


def main():
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=SRC)
    sc = bpy.context.scene
    sc.render.fps = B8.FPS
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42:
            bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    mesh = [o for o in sc.objects if o.type == 'MESH'][0]
    n_ear, n_muz, n_tail = reshape(arm, mesh)
    coat = paint_coat(mesh)
    for a in bpy.data.actions:
        a.name = a.name.split('_')[0]
    arm.scale = (WIDTH, 1.0, 1.0)
    head = arm.pose.bones['b_Head_05']
    for a in bpy.data.actions:
        arm.animation_data.action = a
        for fr in (a.frame_range[0], a.frame_range[1]):
            head.scale = (SKULL, SKULL, SKULL); head.keyframe_insert('scale', frame=fr, group='b_Head_05')
    # the bite, the same keys as [the beast in eight], on the remodelled bones
    base = bpy.data.actions['Survey']
    arm.animation_data.action = base; sc.frame_set(int(base.frame_range[0]))
    bpy.context.view_layer.update()
    base_pose = {pb.name: (pb.rotation_quaternion.copy(), pb.location.copy(), pb.scale.copy()) for pb in arm.pose.bones}
    axes = {pb.name: (B8.world_axis_in_bone(pb, (1, 0, 0)), B8.world_axis_in_bone(pb, (0, 0, 1))) for pb in arm.pose.bones}
    root = arm.pose.bones['b_Root_00']
    root_fwd = B8.world_axis_in_bone(root, (0, -1, 0)); root_up = B8.world_axis_in_bone(root, (0, 0, 1))
    bite = bpy.data.actions.new('Bite'); arm.animation_data.action = bite
    for fr, bones, (fwd, down) in B8.BITE:
        for pb in arm.pose.bones:
            q0, l0, s0 = base_pose[pb.name]
            q = q0.copy()
            if pb.name in bones:
                nod, shake = bones[pb.name]
                ax, az = axes[pb.name]
                q = q0 @ mathutils.Quaternion(ax, math.radians(nod)) @ mathutils.Quaternion(az, math.radians(shake))
            pb.rotation_quaternion = q; pb.keyframe_insert('rotation_quaternion', frame=fr, group=pb.name)
            loc = l0 + root_fwd * fwd - root_up * down if pb.name == 'b_Root_00' else l0.copy()
            pb.location = loc; pb.keyframe_insert('location', frame=fr, group=pb.name)
            pb.scale = (SKULL, SKULL, SKULL) if pb.name == 'b_Head_05' else s0; pb.keyframe_insert('scale', frame=fr, group=pb.name)
    for fc in bite.fcurves:
        for k in fc.keyframe_points: k.interpolation = 'BEZIER'
    bite.frame_range = (0, B8.BITE_FRAMES); bite.use_frame_range = True
    ad = arm.animation_data; ad.action = None
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    for a in bpy.data.actions:
        t = ad.nla_tracks.new(); t.name = a.name; t.strips.new(a.name, int(a.frame_range[0]), a)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                              export_skins=True, export_apply=False, export_yup=True, export_image_format='AUTO', export_nla_strips=True)
    print('WROTE', os.path.relpath(OUT, ROOT), 'clips', [a.name for a in bpy.data.actions], 'ears', n_ear, 'muzzle', n_muz,
          'tail', n_tail, 'coat', coat)


if __name__ == '__main__':
    main()
