#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the beasts through the rig, the wolf redone], ROUND THREE'S SECOND BEAST: THE HYENA, MODELLED AT
THE SOURCE IN BLENDER BEFORE DIRECTION'S RIG (rule 115c: every beast comes off the rig the same way, 'everything from the
same source'; rule 108 (a): no pixel drawn in code; rule 42: lab-made from real DNA, the Ice Age and after, a surrogate of
the right size; the bestiary's number 3: records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md, the
HYENA CLAN, an Arizona lab, up the Colorado, late act one and it owns act two, 'they take the weak at the edge', a
matriarch, one to two tiles, a bounty).

WHICH HYENA: the CAVE HYENA (Crocuta crocuta spelaea), the Ice Age's own: its genome was read from fossil bone (Westbury
et al. 2020, cave hyenas from Eurasia), so a lab can make it on its living cousin, the spotted hyena, which is the right
size for the surrogate. America's own hyena (Chasmaporthetes, Arizona's running hyena) is a million years too old for any
DNA, so it is not the one (rule 42: only what real DNA allows). A cave hyena is a big spotted hyena: 1.6 m nose to tail
tip here (1.3 to 1.5 m of body and a short tail; the cave form ran larger than today's), 0.8 m at the shoulder.

THE SAME SOURCE AS THE WOLF AND THE PACK: the Khronos Fox, reshaped with its bones (each moved, never turned, so the Fox's
Survey and Walk and our Bite still play) and painted from the 3D shape through the wolf tool's texel trace. What makes it a
hyena, not a dog, in the order the eye reads it:
  1. THE SLOPE: the FRONT LEGS LONGER than the hind (1.5 against 1.12 below the belly line) and the back rising from the
     hips to the shoulders. The stretch is a smooth field over the body's long axis (front at the shoulders, hind at the
     hips), so the spine tilts with the legs and nothing tears; every bone moves by the field at its head.
  2. THE HEAD AND NECK: the skull 1.5, the muzzle 0.82 (short and blunt: the bone-crusher's jaw), the neck and chest's
     ruff 1.45 (the thick neck that carries it), the chest 1.3 deep, the body 1.3 wide.
  3. THE EARS: round, not the fox's points: 0.62 the height and pulled in toward their middle.
  4. THE TAIL: SHORT (0.55 the length, along its own chain toward its base) and thin (0.6), with a BLACK brush at the end.
  5. THE COAT: a dusky sand with ROUND near-black SPOTS on the lower flanks, the haunches and the legs (one per cell of a
     jittered 3D grid, about 6 cm, 3 px), a dark CREST along the back from behind the ears to the hips, a dark FACE from
     the eyes forward, dark STOCKINGS down the legs, a black brush on the tail, the belly the coat's own colour (never
     paler: a pale underside reads as a light from below, the shepherd's lesson). Passes A to G (the header's knobs say
     each): the rig's grain makes a bright coat busy everywhere, so the rest areas are the dark parts each view sees
     most (the crest from above, the face from the front, the brush and the stockings from behind).
     HELD AT G (records/BOHEMIA_THE_CAVE_HYENA_HELD_10_18_26.md): its colours sit 6 levels from the pit's (the pack's
     line 20, and 8.6 on a distribution ruler too); H (a lighter sand) and I (clay mustard from the source palette) moved
     it onto the shepherd or between the two and each cost a facing's rest area. A colour family per beast is DIRECTION's.
  6. THE BITE: the wolf's keys (tools/bohemia_animation_the_beast_in_eight_prep.py BITE): a hyena bites forward and holds.

Then DIRECTION's rig, unchanged (the command is printed at the end).
REFERENCE CHECK (the 9/4 standing duty): the fox (records/target/master_rig/fox) is the bar he named and the source; the
wolf redone is the sibling it must not copy (the slope, the spots and the short tail are what a hyena is that a wolf is
not); the 1.72 m man is the ruler. No reference game.
Run: <venv with bpy 4.2>/bin/python tools/bohemia_animation_the_hyena_prep.py [out.glb]
"""
import os, sys, math, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location('pack', os.path.join(ROOT, 'tools/bohemia_animation_the_feral_dog_pack_prep.py'))
P = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(P)
W = P.W   # the wolf tool: reshape's parts, the texel trace, main()

REAL = 1.6
LEG_F, LEG_H = 1.5, 1.12          # below the belly line: the front legs long, the hind short (the slope)
Y_SHOULDER, Y_HIP = -20.0, 30.0   # where the stretch is the front's and where it is the hind's (the model faces -Y)
SHAPE = dict(LIMB=1.7, WIDTH=1.3, SKULL=1.5, MUZZLE=0.82, EAR=0.62, TAIL=0.9, RUFF=1.45, DEPTH=1.3)   # the tail 0.9 about its bones: a brush (pass F)
TAIL_LEN = 0.7                    # the tail's length along its own chain toward its base (0.55 left the view from behind no rest: pass F)
EAR_ROUND = 0.7                   # the ear pulled toward its own middle across (the fox's 0.85): round, not a point
# the coat (sRGB, the byte texture's own space)
SAND = (0.54, 0.46, 0.34)         # a dusky sand (pass A's 0.62 grey read green-grey; B's 0.68 ochre was busy everywhere under the rig's grain, D5 on six facings)
SPOT = (0.15, 0.11, 0.08)         # near-black brown spots (pass G: the dusky coat's 0.26 spots went faint)
MANE = (0.20, 0.16, 0.13)         # the mane line and the face
TIP = (0.08, 0.07, 0.06)          # the tail's black brush
LEGS = (0.30, 0.24, 0.19)         # the lower legs
SPOT_CELL, SPOT_R = 7.0, 2.6     # ROUND spots: one per 7-unit cell of a jittered 3D grid, 2.6 units across the radius (about
                                  # 6 cm, 3 px at 57 ppm); pass A's thresholded noise drew camouflage blobs, not spots
FACE_Y = 0.0                      # the dark face from the eyes forward (pass A's +2 blacked the whole head; B's -3 left the front view no rest)
FACE = (0.30, 0.25, 0.21)         # the muzzle: dark grey-brown, not the mane's near-black
SPOT_UP = 0.35                    # no spot where the body faces up more than this: the plain upper flank and back
STOCKING_Z = 40.0                 # z under which the legs are the dark LEGS colour (the stockings: a hyena's legs darken to the feet)
CREST = (6.0, 0.45)                      # (half-width in model units, normal z over which): the dark crest along the back, or the thin mane


def stretch(y):
    """the legs' stretch at a point along the body: the front's ahead of the shoulders, the hind's behind the hips"""
    t = min(1.0, max(0.0, (y - Y_SHOULDER) / (Y_HIP - Y_SHOULDER)))
    return LEG_F + (LEG_H - LEG_F) * t


def dz(y, z):
    """how far a point at (y, z) rides up: its leg stretch below the belly line, the whole of it above"""
    return (stretch(y) - 1.0) * min(z, W.BELLY_Z) if z > 0 else 0.0


def reshape(arm, mesh):
    """the wolf tool's reshape with a sloped stretch, round ears and a short tail; bones translate, never rotate"""
    import bpy, mathutils
    import numpy as np
    names = {g.index: g.name for g in mesh.vertex_groups}
    me = mesh.data
    dom = [W.dominant(v, names) for v in me.vertices]
    co = np.array([v.co[:] for v in me.vertices])
    head = np.array([d == 'b_Head_05' for d in dom])
    ear = head & (co[:, 2] > W.EAR_Z) & (co[:, 1] > W.EAR_Y)
    for side in (-1, 1):
        sel = ear & (np.sign(co[:, 0]) == side)
        if sel.any():
            base_z = W.EAR_Z - 2
            c = co[sel].copy(); cx, cy = c[:, 0].mean(), c[:, 1].mean()
            c[:, 2] = base_z + (c[:, 2] - base_z) * W.EAR
            c[:, 0] = cx + (c[:, 0] - cx) * EAR_ROUND; c[:, 1] = cy + (c[:, 1] - cy) * EAR_ROUND
            co[sel] = c
    muz = head & (co[:, 1] < W.EYE_Y)
    co[muz, 1] = W.EYE_Y + (co[muz, 1] - W.EYE_Y) * W.MUZZLE

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
    n_tail = about_chain(W.TAILS, W.TAIL, lambda j: j[-1] + 1.6 * (j[-1] - j[-2]))
    for chain in W.LIMBS:
        about_chain(chain, W.LIMB, lambda j: np.array([j[-1][0], j[-1][1], 0.0]))
    # the tail short: every tail vertex toward the tail's base along the body
    base = np.array(arm.data.bones[W.TAILS[0]].head_local[:])
    tl = np.array([d in W.TAILS for d in dom])
    co[tl] = base + (co[tl] - base) * TAIL_LEN
    ruff = np.array([d in ('b_Neck_04', 'b_Spine02_03') for d in dom])
    cz = 58.0
    co[ruff, 0] *= W.RUFF
    co[ruff, 2] = cz + (co[ruff, 2] - cz) * W.RUFF
    trunk = np.array([d in ('b_Spine02_03', 'b_Spine01_02', 'b_UpperArm') for d in dom]) & (co[:, 2] < cz)
    reach = np.clip((20.0 - co[:, 1]) / 40.0, 0.3, 1.0)
    co[trunk, 2] = cz - (cz - co[trunk, 2]) * (1 + (W.DEPTH - 1) * reach[trunk])
    # the slope, last: the whole model rides the field
    co[:, 2] = co[:, 2] + np.array([dz(y, z) for y, z in zip(co[:, 1], co[:, 2])])
    for v, c in zip(me.vertices, co): v.co = mathutils.Vector(c)
    me.update()
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode='EDIT')
    for eb in arm.data.edit_bones:
        h = np.array(eb.head[:])
        move = np.zeros(3)
        if eb.name in W.TAILS:
            move += (base + (h - base) * TAIL_LEN) - h
        move[2] += dz(h[1] + move[1], h[2] + move[2])
        eb.head = mathutils.Vector(h + move); eb.tail = mathutils.Vector(np.array(eb.tail[:]) + move)
    bpy.ops.object.mode_set(mode='OBJECT')
    return int(ear.sum()), int(muz.sum()), n_tail


def round_spots(Pp, cell, r, seed):
    """cellular spots stuck to the body: one jittered point per cell of a 3D grid, a texel inside r of its nearest point
    is a spot (round, all about one size, never a blob)"""
    import numpy as np
    rng = np.random.default_rng(seed)
    jit = rng.random((48, 48, 48, 3)).astype(np.float32) * 0.8 + 0.1
    q = Pp / cell + 24.0
    i0 = np.floor(q).astype(int)
    best = np.full(Pp.shape[:-1], 1e9, np.float32)
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for dz_ in (-1, 0, 1):
                c = np.clip(i0 + np.array([dx, dy, dz_]), 0, 47)
                pt = (c + jit[c[..., 0], c[..., 1], c[..., 2]]) * cell - 24.0 * cell
                best = np.minimum(best, np.linalg.norm(Pp - pt, axis=-1))
    return best < r


def paint(mesh, seed=23):
    import numpy as np
    img, px, rgb, lum, white, dark, orange, Pp, N, BONE, names = W.trace(mesh)
    covered = BONE >= 0
    headidx = {i for i, n in names.items() if n == 'b_Head_05'}
    neckidx = {i for i, n in names.items() if n in ('b_Neck_04', 'b_Spine02_03')}
    tailidx = {i for i, n in names.items() if n in W.TAILS}
    is_head = np.isin(BONE, list(headidx)); is_neck = np.isin(BONE, list(neckidx)); is_tail = np.isin(BONE, list(tailidx))
    shade = np.clip(lum / max(float(np.median(lum[orange])), 1e-3), 0.6, 1.25)[..., None]
    out = np.where(covered[..., None], np.array(SAND, np.float32) * shade, rgb)
    spots = round_spots(Pp, SPOT_CELL, SPOT_R, seed) & covered & ~is_head & ~is_tail & (N[..., 2] < SPOT_UP)
    out = np.where(spots[..., None], np.array(SPOT, np.float32) * shade, out)
    mane = (is_neck | is_head) & (N[..., 2] > 0.55) & (np.abs(Pp[..., 0]) < 3.5) & (Pp[..., 1] > W.EYE_Y + 4)
    if CREST is not None:   # the crest from behind the ears down the spine to the hips: the end-on views' rest area
        mane = covered & ~is_tail & (N[..., 2] > CREST[1]) & (np.abs(Pp[..., 0]) < CREST[0]) & (Pp[..., 1] > W.EYE_Y + 4) & (Pp[..., 1] < 30)
    face = is_head & (Pp[..., 1] < W.EYE_Y + FACE_Y)
    out = np.where(mane[..., None], np.array(MANE, np.float32) * shade, out)
    out = np.where(face[..., None], np.array(FACE, np.float32), out)
    out = np.where(dark[..., None], np.array(LEGS, np.float32), out)
    if STOCKING_Z is not None:
        legidx = {i for i, n in names.items() if any(b in n for b in ('Arm', 'Hand', 'Leg', 'Foot'))}
        stock = np.isin(BONE, list(legidx)) & (Pp[..., 2] < STOCKING_Z)
        out = np.where(stock[..., None], np.array(LEGS, np.float32) * shade, out)
    tipm = is_tail & (white | (Pp[..., 1] > float(np.percentile(Pp[is_tail][:, 1], 55)) if is_tail.any() else white))
    out = np.where(tipm[..., None], np.array(TIP, np.float32), out)
    px[..., :3] = np.clip(out, 0, 1)
    img.pixels = px.ravel().tolist()
    img.pack()
    return dict(spots=int(spots.sum()), mane=int(mane.sum()), face=int(face.sum()), tip=int(tipm.sum()), texels=int(covered.sum()))


def build(out=None):
    for k, v in SHAPE.items(): setattr(W, k, v)
    W.LEG = 1.0                       # the wolf's uniform stretch off: the slope does it
    W.SRC = os.path.join(ROOT, 'reference/models/khronos/Fox.glb')
    W.OUT = out or os.path.join(ROOT, 'reference/models/bohemia/cave_hyena.glb')
    W.reshape = reshape
    W.paint_coat = paint
    W.main()
    print('RIG: <venv>/bin/python tools/bohemia_direction_master_rig.py %s records/target/master_rig/cave_hyena --real-length %.2f '
          '--family none --still pass --clip Survey:12 --clip Walk:6 --clip Bite:6' % (os.path.relpath(W.OUT, ROOT), REAL))


if __name__ == '__main__':
    build(sys.argv[1] if len(sys.argv) > 1 else None)
