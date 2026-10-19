#!/usr/bin/env python3
"""BOHEMIA -- COMBAT [the fight wears the 3D models], the guns (rule 121; END STATE: 'COOK's guns in their hands'; rule 120(a)
GUNS FIRST: 'the guns were supposed to be the main way this is gonna be solved'). COOK'S GUNS IN THE RIG MEN'S HANDS.

COOK's guns are modelled (reference/models/bohemia/gun_pistol_a.glb, gun_rifle_a.glb, gun_shotgun_a.glb: real size, the
barrel along +X, the grip at the origin). A man's gun changes from fight to fight (the roster's kit), so the gun is not
baked into his body: for each look and each gun, the gun alone is rendered IN HIS HANDS, frame for frame with his body's
render (the same skeleton posed at the same keys, the same camera, sun and box as DIRECTION's master rig gave his body,
read back from his rig.json), with HIS BODY AS A HOLDOUT (Cycles: what of the gun his body hides is not drawn), so the gun
laid over his sheet sits in his hand and goes behind him where he is in front of it. One sheet per look, a row per facing
and a column per key of the four clips a gun is held in (his stand, the walk, the gun up, the blow), a block per gun.
    <venv>/bin/python tools/bohemia_combat_the_guns_in_their_hands.py render [LOOK|ALL]
    python3 tools/bohemia_combat_the_guns_in_their_hands.py pack
        -> slices/fight_rig/<look>_guns.webp, and 'guns' in slices/fight_rig/fight_rig.json
HOW HE HOLDS IT (read off his hands, per frame): the long gun and the shotgun with the grip in the right hand and the barrel
through the left (the gun up, both hands); carried at the low ready otherwise (the grip in the right hand, the muzzle down
and forward); the pistol in both hands when it is up (the modern stance), in the right hand pointing down otherwise.
REUSE CHECK: COOK's guns, PORTRAIT's bodies posed by tools/bohemia_combat_the_fight_poses.py, DIRECTION's master rig's
bounds, clip_actions, light_and_film and source_pass imported and called as they are; nothing drawn.
REFERENCE CHECK (the 9/4 standing duty): the compare law, the twin is COOK's gun as the VOTE tab shows it
(records/target/master_rig/cook_gun); analog horror AH-01; no reference game.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RENDERS = 'records/target/combat/rig'
GUNS = {'pistol': 'gun_pistol_a', 'rifle': 'gun_rifle_a', 'shotgun': 'gun_shotgun_a'}
CLIPS = [('Stand', 1), ('Anim_0', 6), ('Aim', 3), ('Hit', 2)]
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
RIM = (16, 11, 6, 230)


def render(look):
    import bpy, mathutils
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    rj = json.load(open(os.path.join(ROOT, RENDERS, look, 'rig.json')))
    out = os.path.join(ROOT, RENDERS, look, 'guns'); os.makedirs(out, exist_ok=True)
    for gun, model in GUNS.items():
        bpy.ops.wm.read_factory_settings(use_empty=True)
        sc = bpy.context.scene
        before = set(o.name for o in sc.objects)
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, rj['model']))
        for o in list(sc.objects):
            if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
        body = [o for o in sc.objects if o.type == 'MESH']
        arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
        # the still and the box exactly as the master rig read them (its still frame, its bounds, its scale)
        f0, f1 = MR.clip_actions(sc, 'Stand'); still = rj['still_frame']
        sc.frame_set(int(math.floor(still)), subframe=still - math.floor(still))
        root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
        lo, hi = MR.bounds(sc, body); size = hi - lo; k = rj['scale_from_model']
        centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
        for o in list(sc.objects):
            if o.parent is None and o is not root: o.parent = root; o.location -= centre
        zs = rj['z_stretch']; root.scale = (k, k, k * zs)
        # the gun: real size in the world (its own scale undoes the root's), under the root so it turns and stretches with him
        gb = set(o.name for o in sc.objects)
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % model))
        gparts = [o for o in sc.objects if o.name not in gb and o.type == 'MESH' and not (o.name.startswith('Icosphere') and len(o.data.vertices) == 42)]
        for o in [o for o in sc.objects if o.name not in gb and o not in gparts and o.type == 'MESH']: bpy.data.objects.remove(o, do_unlink=True)
        g = bpy.data.objects.new('gun', None); sc.collection.objects.link(g)
        for o in [o for o in sc.objects if o.name not in gb and o is not g and o.parent is None]: o.parent = g
        MR.source_pass(gparts, float(MR.G['wear']), 1.0, 0)
        for o in body: o.is_holdout = True
        dims = (size.x * k, size.y * k, size.z * k); res = rj['res']; ppm = rj['ppm']
        cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = res / ppm
        cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
        t = math.radians(rj['camera']['tilt_deg']); cam.rotation_euler = (t, 0, 0)
        look_at = mathutils.Vector((0, 0, dims[2] * zs / 2)); d = mathutils.Vector((0, math.sin(t), -math.cos(t)))
        cam.location = look_at - d * 30; sc.render.resolution_x = sc.render.resolution_y = res
        MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg'])))
        sc.cycles.samples = 24; sc.render.use_persistent_data = True; sc.render.film_transparent = True
        R = arm.pose.bones
        def hands():
            W = arm.matrix_world
            rw = W @ R['Skeleton_arm_joint_R__3_'].head; lw = W @ R['Skeleton_arm_joint_L__2_'].head
            re = W @ R['Skeleton_arm_joint_R__2_'].head
            return rw, lw, re
        def place(clip, i):
            """the gun in his hands for this frame, in the world: grip at the right wrist; the barrel through the left hand
            when the gun is up, else along the right forearm tipped down (the low ready)"""
            bpy.context.view_layer.update()
            rw, lw, re = hands()
            fwd = (root.matrix_world.to_3x3() @ mathutils.Vector((0, -1, 0))).normalized()   # the way he faces
            up = mathutils.Vector((0, 0, 1))
            if clip == 'Aim':
                grip = (rw + lw) / 2 if gun == 'pistol' else rw
                bar = (lw - rw) if gun != 'pistol' else fwd
                if bar.length < 1e-4 or bar.normalized().dot(fwd) < 0.2: bar = fwd
                bar = mathutils.Vector((bar.x, bar.y, bar.z * 0.15))   # level at the shoulder: the hands give the line across, the eye keeps it flat
            else:
                grip = rw
                fore = (rw - re); fore = fore.normalized() if fore.length > 1e-4 else -up
                bar = (fwd * 0.9 + fore * (0.5 if gun == 'pistol' else 0.35) - up * (0.25 if gun == 'pistol' else 0.35))
            x = bar.normalized(); y = up.cross(x)
            if y.length < 1e-4: y = mathutils.Vector((0, 1, 0)).cross(x)
            y.normalize(); z = x.cross(y)
            M = mathutils.Matrix((x, y, z)).transposed().to_4x4(); M.translation = grip
            # the gun keeps its real length (a barrel lies across the ground's plane, the 3/4 cheat stretches standing height);
            # its grip and its line are read off his stretched hands, so it sits where his hands are on the sprite
            g.matrix_world = M
        files = []
        for name, keys in CLIPS:
            a0, a1 = MR.clip_actions(sc, name)
            frames = [a0 + (a1 - a0) * (i + 0.5) / keys for i in range(keys)]   # the master rig's own keys (Stand: its one, mid-clip)
            for fi, f in enumerate(FACINGS):
                root.rotation_euler = (0, 0, math.radians(180 - 45 * fi))
                for j, fr in enumerate(frames):
                    sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
                    place(name, j)
                    fn = os.path.join(out, '%s_%s_%s_k%02d.png' % (gun, name, f, j)); sc.render.filepath = fn
                    bpy.ops.render.render(write_still=True); files.append(fn)
        print('GUNS', look, gun, len(files), flush=True)


def run_render(arg):
    looks = [d for d in sorted(os.listdir(os.path.join(ROOT, RENDERS))) if os.path.exists(os.path.join(ROOT, RENDERS, d, 'rig.json')) and not d.startswith('beast_')]
    for l in (looks if arg.upper() == 'ALL' else [arg]):
        for i in range(3):   # bpy 4.2 dies at exit now and then on this box, after the frames are written
            subprocess.call([sys.executable, os.path.abspath(__file__), '_one', l], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(os.path.join(ROOT, RENDERS, l, 'guns', 'shotgun_Hit_NW_k01.png')): break
        print('RENDERED GUNS', l, flush=True)


def pack():
    """each look's guns on one sheet: the gun's pixels only (alpha cut where the master rig cuts, at the guide's
    threshold), cropped with the look's own box so a gun cell lays exactly over the body cell, the dark day rim round it"""
    import numpy as np
    from PIL import Image
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    idx_p = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); idx = json.load(open(idx_p))
    cols = [(c, k) for c, n in CLIPS for k in range(n)]
    for look in sorted(idx['looks']):
        d = os.path.join(ROOT, RENDERS, look)
        if idx['looks'][look].get('kind') == 'beast' or not os.path.exists(os.path.join(d, 'guns', 'shotgun_Hit_NW_k01.png')): continue
        rj = json.load(open(os.path.join(d, 'rig.json'))); x0, y0, x1, y1 = rj['crop_box_px']; w, h = x1 - x0 + 2, y1 - y0 + 2
        sheet = Image.new('RGBA', (w * len(cols), h * len(FIGHT_DIRS) * len(GUNS)), (0, 0, 0, 0))
        for gi, gun in enumerate(GUNS):
            for row, f in enumerate(FIGHT_DIRS):
                for ci, (c, k) in enumerate(cols):
                    a = np.asarray(Image.open(os.path.join(d, 'guns', '%s_%s_%s_k%02d.png' % (gun, c, f, k))).convert('RGBA')).copy()
                    a = a[y0:y1, x0:x1]; op = a[..., 3] > G['alpha_threshold']; a[..., 3] = np.where(op, 255, 0)
                    a = np.pad(a, ((1, 1), (1, 1), (0, 0))); op = np.pad(op, 1)
                    near = np.zeros_like(op)
                    near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
                    a[near & ~op] = RIM; a[~(op | near)] = 0
                    sheet.paste(Image.fromarray(a, 'RGBA'), (ci * w, (gi * len(FIGHT_DIRS) + row) * h))
        f = look + '_guns.webp'
        sheet.save(os.path.join(ROOT, 'slices/fight_rig', f), 'WEBP', lossless=True, quality=100, method=6)
        idx['looks'][look]['guns'] = f
        print('PACKED GUNS', look, sheet.size, os.path.getsize(os.path.join(ROOT, 'slices/fight_rig', f)))
    idx['guns'] = dict(order=list(GUNS), cols=['%s@%d' % (c, k) for c, k in cols], clips=dict(stand=[0], walk=list(range(1, 7)), aim=[7, 8, 9], hit=[10, 11]),
                       by_class=dict(dagger='pistol', crossbow='rifle', firearm='shotgun'),
                       src='COOK\'s guns (reference/models/bohemia/gun_*_a.glb) rendered in each look\'s hands with his body as a holdout, '
                           'tools/bohemia_combat_the_guns_in_their_hands.py')
    json.dump(idx, open(idx_p, 'w'), indent=1)


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == '_one': render(sys.argv[2])
    elif cmd == 'render': run_render(sys.argv[2] if len(sys.argv) > 2 else 'ALL')
    elif cmd == 'pack': pack()
    else: sys.exit('render | pack')
