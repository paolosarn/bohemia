#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the beasts through the rig, the wolf redone], ROUND TWO: THE FERAL DOG PACK, MODELLED AT THE
SOURCE IN BLENDER BEFORE DIRECTION'S RIG (rule 115c: every beast comes off the rig the same way, 'everything from the same
source'; rule 108 (a): no pixel drawn in code; rule 42: lab-made or already here; the bestiary's number 1:
records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md, 'Vegas's own pets', act one's first fight,
'wolves flank (direwolf lite)', one tile, the pack splits).

WHY THREE DOGS AND NOT ONE: a pack of strays is never three copies. Las Vegas's shelters are filled, in this order, by
pit-bull mixes, shepherd mixes and the yellow-and-white curs of the desert towns (Clark County's intake and every
south-western shelter's count put the pit type first by a distance), so the pack is those three, each a different body
from the same Fox source, each keeping one thing from the house it left: a collar.

THE SAME SOURCE AS THE WOLF: tools/bohemia_animation_the_wolf_redone_prep.py does the work (the reshape with mesh and
bones together, bones translated never turned so the Fox's Survey and Walk and our Bite play; the texel trace through the
UVs). This file only sets each dog's numbers and paints each dog's coat from the 3D shape:
  * THE PIT MIX: the short, heavy one. Legs 1.18, limbs 2.0 thick, the body 1.55 wide, the skull 1.42, the muzzle 0.8
    (the short broad face), ears 0.5 (rose ears, small), the tail 0.55 thin (a whip), the chest 1.4 deep, the ruff 1.15. A DARK
    BRINDLE (near-black brown with sparse fawn streaks down the flanks, from the body's own long axis, broken by a 3D
    noise), a WHITE chest and blaze, dark feet, a faded red collar. Pass one (fawn with dark stripes, white paws) read as
    a tabby cat and the white paws lit it from below (the card's light row OUT, -8.9). 1.1 m nose to tail.
  * THE SHEPHERD MIX: the tall one with the ears. Legs 1.32, limbs 1.4, ears 1.0 (they stand), the muzzle 1.12, the tail
    0.9 (it keeps its brush), the ruff 1.12. Tan with a dark SABLE SADDLE wider than the wolf's and a black mask forward
    of the eyes; STOPPED AT PASS FIVE and HELD BACK by DIRECTION's card (3 of 8: colours, value span 115 of 118, light
    -2.8 against -2.5), so it is not on the VOTE card; no white (the fox's white goes pale tan); no collar (it was never anyone's, or it lost it).
    1.4 m (1.35 left it at 94 px, under the 96 floor; a shepherd mix is 1.4 to 1.5 m nose to tail tip). Three passes by eye, then stopped (rule 97).
  * THE YELLOW CUR: the village dog. Legs 1.28, limbs 1.3, ears 0.78, muzzle 1.0, the tail 0.62. OFF-WHITE under big
    soft PATCHES of liver brown from a slow 3D noise (patches the size of a hand, never spots), one patch always over
    the right eye and ear, and two MANGE patches where the coat is gone to grey skin (analog horror: the thing is sick).
    A faded blue collar. 1.25 m.
  Every coat keeps the Fox texture's own baked light (the wolf's way) and a body-scale grizzle at 0 (short coats; the
  rig's own grain is enough, and a coat grain too left no flat rest area: NOT VIBE CODED D5).

Then DIRECTION's rig, unchanged, once per dog (the commands are printed at the end).

REFERENCE CHECK (the 9/4 standing duty): the fox (records/target/master_rig/fox) is the bar he named and the source; the
wolf redone is the sibling the pack must not copy; the 1.72 m man is the ruler. No reference game.
Run: <venv with bpy 4.2>/bin/python tools/bohemia_animation_the_feral_dog_pack_prep.py [pit|shepherd|cur ...]
"""
import os, sys, math, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location('wolf', os.path.join(ROOT, 'tools/bohemia_animation_the_wolf_redone_prep.py'))
W = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(W)

# the shape, in the wolf tool's own names (model units: about 140 long, the model faces -Y, Z up)
DOGS = {
    'pit': dict(LEG=1.18, LIMB=2.0, WIDTH=1.55, SKULL=1.42, MUZZLE=0.8, EAR=0.5, TAIL=0.55, RUFF=1.15, DEPTH=1.4, real=1.1),
    'shepherd': dict(LEG=1.32, LIMB=1.4, WIDTH=1.25, SKULL=1.14, MUZZLE=1.12, EAR=1.0, TAIL=0.9, RUFF=1.12, DEPTH=1.15, real=1.4),
    'cur': dict(LEG=1.28, LIMB=1.3, WIDTH=1.2, SKULL=1.1, MUZZLE=1.0, EAR=0.78, TAIL=0.62, RUFF=1.0, DEPTH=1.1, real=1.25),
}
# the coats (sRGB, the byte texture's own space)
FAWN, BRINDLE, WHITE = (0.68, 0.52, 0.38), (0.24, 0.19, 0.15), (0.88, 0.86, 0.80)
TAN, BLACK, PALE_TAN = (0.70, 0.53, 0.34), (0.14, 0.12, 0.10), (0.95, 0.88, 0.74)   # pass two: 0.14 bleached to the wolf grey under the rig sun; pass three: the pale belly lighter (value span 100, line 118); pass four (a card fix, not a look pass): the 0.06 saddle lit the top darker than the belly (light -3.4), 0.10 barely moved it (-3.3), so the saddle back to 0.14 (a sable, not a black-and-tan) with the paler belly kept; stopped
OFF_WHITE, LIVER, SKIN = (0.84, 0.80, 0.70), (0.36, 0.25, 0.19), (0.58, 0.50, 0.47)
RED_COLLAR, BLUE_COLLAR = (0.50, 0.24, 0.20), (0.26, 0.34, 0.42)


# THE DOG'S BITE: the wolf's keys (tools/bohemia_animation_the_beast_in_eight_prep.py BITE) with the spring lifted: the
# first render rose 4 px (the pit) and 7 (the cur) from crouch to spring against the line of 8, because a 1.1 m dog
# doing a 1.7 m wolf's lunge reaches a man's knee. A dog jumps UP at a man: the root lifts 6 units at the spring, not 3,
# and the neck comes up 22 degrees, not 16; the shake and the timing stay the wolf's.
DOG_BITE = [
    (0,  {}, (0.0, 0.0)),
    (6,  {'b_Neck_04': (8, 0), 'b_Head_05': (4, 0), 'b_Spine01_02': (4, 0)}, (-2.0, 2.0)),
    (10, {'b_Neck_04': (-22, 0), 'b_Head_05': (-12, 0), 'b_Spine02_03': (-10, 0), 'b_RightUpperArm_06': (-26, 0), 'b_LeftUpperArm_09': (-26, 0)}, (10.0, -6.5)),
    (14, {'b_Neck_04': (-18, 0), 'b_Head_05': (-3, 10), 'b_Spine02_03': (-8, 0), 'b_RightUpperArm_06': (-18, 0), 'b_LeftUpperArm_09': (-18, 0)}, (13.0, -5.0)),
    (18, {'b_Neck_04': (-5, 0), 'b_Head_05': (0, -4), 'b_Spine01_02': (2, 0)}, (6.0, -1.0)),
    (24, {}, (0.0, 0.0)),
]


def smooth_noise(P, cell, seed):
    """a value noise in 3D, trilinear, about `cell` model units across: soft blobs stuck to the body"""
    import numpy as np
    rng = np.random.default_rng(seed)
    lat = rng.random((40, 40, 40)).astype(np.float32)
    q = P / cell + 20.0
    i = np.clip(np.floor(q).astype(int), 0, 38); f = np.clip(q - i, 0, 1)
    f = f * f * (3 - 2 * f)
    out = 0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (f[..., 0] if dx else 1 - f[..., 0]) * (f[..., 1] if dy else 1 - f[..., 1]) * (f[..., 2] if dz else 1 - f[..., 2])
                out = out + w * lat[i[..., 0] + dx, i[..., 1] + dy, i[..., 2] + dz]
    return out


def collar_band(mesh, P, BONE, names, width=3.2):
    """the texels on the neck within a band across the neck's own axis, halfway from the shoulders to the skull"""
    import numpy as np
    arm = mesh.parent if mesh.parent is not None and mesh.parent.type == 'ARMATURE' else None
    if arm is None:
        import bpy
        arm = [o for o in bpy.context.scene.objects if o.type == 'ARMATURE'][0]
    a = np.array(arm.data.bones['b_Neck_04'].head_local[:]); b = np.array(arm.data.bones['b_Head_05'].head_local[:])
    c = a + 0.5 * (b - a); ax = (b - a) / np.linalg.norm(b - a)
    neckidx = [i for i, n in names.items() if n in ('b_Neck_04', 'b_Spine02_03', 'b_Head_05')]
    return np.isin(BONE, neckidx) & (np.abs((P - c) @ ax) < width)


def painter(kind, seed=7):
    def paint(mesh):
        import numpy as np
        img, px, rgb, lum, white, dark, orange, P, N, BONE, names = W.trace(mesh)
        covered = BONE >= 0
        headidx = {i for i, n in names.items() if n in ('b_Head_05',)}
        tailidx = {i for i, n in names.items() if n in W.TAILS}
        is_head = np.isin(BONE, list(headidx))
        shade = np.clip(lum / max(float(np.median(lum[orange])), 1e-3), 0.6, 1.25)[..., None]
        out = rgb.copy(); stats = {}
        if kind == 'pit':
            # brindle: dark stripes down the flanks, across the body's long axis (y), wavered by a 3D noise; never the belly
            # pass two: a DARK brindle (dark base, sparse fawn streaks broken by a 3D noise), the cat's tabby was pass one
            wav = smooth_noise(P, 9.0, seed) * 7.0
            streak = (np.sin((P[..., 1] + wav) * 2 * math.pi / 8.0) > 0.55) & (smooth_noise(P, 11.0, seed + 1) > 0.42)
            streak &= orange & (N[..., 2] < 0.7)
            coat = np.array(BRINDLE, np.float32) * 1.25 * shade
            coat = np.where(streak[..., None], np.array(FAWN, np.float32) * 0.8 * shade, coat)
            out = np.where(orange[..., None], coat, out)
            tail = np.isin(BONE, list(tailidx))
            out = np.where((white & ~tail)[..., None], np.array(WHITE, np.float32) * shade, out)   # the white chest and blaze
            out = np.where((white & tail)[..., None], np.array(BRINDLE, np.float32) * 1.25, out)   # a pit's tail has no white tip
            out = np.where(dark[..., None], np.array(BRINDLE, np.float32), out)                    # dark feet: white paws lit it from below
            stripe = streak
            band = collar_band(mesh, P, BONE, names) & ~white
            out = np.where(band[..., None], np.array(RED_COLLAR, np.float32) * shade, out)
            stats = dict(stripe=int(stripe.sum()), collar=int(band.sum()))
        elif kind == 'shepherd':
            up = np.clip((N[..., 2] + 0.15) / 0.4, 0, 1)        # pass two: the saddle wraps further down the flanks
            high = np.clip((P[..., 2] - (W.BELLY_Z * W.LEG + 2)) / 8, 0, 1)
            saddle = up * high * (~(is_head & (P[..., 1] < -40)))
            mask = is_head & (P[..., 1] < W.EYE_Y - 2)
            coat = np.array(TAN, np.float32) * shade * (1 - saddle[..., None]) + np.array(BLACK, np.float32) * saddle[..., None]
            out = np.where(orange[..., None], coat, out)
            # the bright cream only high up (the cheeks and the throat): a bright belly lit the bottom over the top (pass four)
            out = np.where(white[..., None], np.array(PALE_TAN, np.float32) * (0.84 + 0.16 * is_head[..., None]) * shade, out)
            out = np.where(dark[..., None], np.array(TAN, np.float32) * 0.85, out)
            out = np.where((mask & ~white)[..., None], np.array(BLACK, np.float32), out)   # a tan face instead measured worse (-19.5), kept
            tipm = np.isin(BONE, list(tailidx)) & white
            out = np.where(tipm[..., None], np.array(BLACK, np.float32), out)
            stats = dict(saddle=int((saddle > 0.5).sum()), mask=int(mask.sum()))
        else:
            blob = smooth_noise(P, 20.0, seed + 3)   # 14 made patches the size of a hand all over: no rest area (D5)
            patch = (blob > 0.62)
            eye = is_head & (P[..., 0] > 0) & (P[..., 1] > W.EYE_Y - 6)            # the right eye and ear, always
            patch = (patch | eye) & covered
            mange = (smooth_noise(P, 9.0, seed + 9) > 0.86) & ~is_head & ~patch & covered
            out = np.where(covered[..., None], np.array(OFF_WHITE, np.float32) * shade, out)
            out = np.where(patch[..., None], np.array(LIVER, np.float32) * shade, out)
            out = np.where(mange[..., None], np.array(SKIN, np.float32) * shade, out)
            out = np.where(dark[..., None] & ~patch[..., None], np.array(OFF_WHITE, np.float32) * 0.8, out)
            band = collar_band(mesh, P, BONE, names)
            out = np.where(band[..., None], np.array(BLUE_COLLAR, np.float32) * shade, out)
            stats = dict(patch=int(patch.sum()), mange=int(mange.sum()), collar=int(band.sum()))
        rng = np.random.default_rng(seed)
        lat = rng.random((48, 48, 48)).astype(np.float32)
        q = np.clip((P / 5.0 + 24).astype(int), 0, 47)
        griz = 1.0 + (lat[q[..., 0], q[..., 1], q[..., 2]] - 0.5) * 0.0   # none: the rig adds its own grain, and ours left no rest area (NOT VIBE CODED D5 on N and NW)
        out = np.where(covered[..., None], out * griz[..., None], out)
        px[..., :3] = np.clip(out, 0, 1)
        img.pixels = px.ravel().tolist()
        img.pack()
        stats['texels'] = int(covered.sum())
        return stats
    return paint


def build(kind):
    d = DOGS[kind]
    for k, v in d.items():
        if k != 'real': setattr(W, k, v)
    W.SRC = os.path.join(ROOT, 'reference/models/khronos/Fox.glb')
    W.OUT = os.path.join(ROOT, 'reference/models/bohemia/feral_dog_%s.glb' % kind)
    W.paint_coat = painter(kind)
    W.B8.BITE = DOG_BITE
    W.main()
    print('RIG: <venv>/bin/python tools/bohemia_direction_master_rig.py reference/models/bohemia/feral_dog_%s.glb '
          'records/target/master_rig/feral_dog_%s --real-length %.2f --family none --still pass --clip Survey:12 --clip Walk:6 --clip Bite:6'
          % (kind, kind, d['real']))


if __name__ == '__main__':
    for kind in (sys.argv[1:] or list(DOGS)):
        build(kind)
