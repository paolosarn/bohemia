#!/usr/bin/env python3
"""BOHEMIA -- COOK DEAD [the dead are everywhere] 11/3/26 (rule 360 THE DEAD ARE EVERYWHERE; rule 337 NO MORE CONTENT
WITHOUT ITS ASSETS; ask line 384).
Paolo 11/3: 'we don't see enough corpses even throughout the world or in the combat map... I understand... the maps not
very big of a corpse won't realistically show up, but I feel like we should take the opportunity to make things as
realistic as possible, bro, like in this economic apocalypse... at least billions of people have died.'
Canon: two to three billion dead in the first decade (laws/BOHEMIA_GDD_v2.md).

WHAT IT IS. The dead as real models at their real size in metres, built the way COOK PROPS built every place's things
(tools/bohemia_cook_props_every_place_its_own_11_3_26.py: its modeller's hands are imported whole, the props modeller's
palette materials, roughness 1, specular 0), exported as a .glb the board's renderer imports, and shot ALONE from the
fight camera through DIRECTION's master rig (source pass at the rig's prop wear, dents, the 1/cos45 height stretch, one
sun, the film; orthographic, tilted 45, facing north, 42.92 px a metre, the block's own ruler) onto a shadow catcher.
COMBAT MAPS 3 places them after its roads and WORLD on the map; this lane never lays a board.

THE PEOPLE ARE ONE BODY (PERSON below): one skeleton of named joints, posed per piece (face down, on its back, seated,
slumped out of a door, folded in a cart), dressed in the runway law's clothes gone to rag in the valley's tans (the drab,
the black gone grey in the sun, oxblood, ochre, bone), a long coat where a coat was. The same joints make the bones
(SKELETON). Nothing is drawn by hand.

ANALOG HORROR AT THE SOURCE (the 9/20 law), NEVER GORE: covered and half seen, the shoes, a hand, the flies (specks
over the still ones, never over the bones), and every piece tells who touched them last: the living MOVED them (the
bags, the cart, the trench), ROBBED them (the pockets out, the shoes gone, the car's battery gone), BURIED them (the
mounds, the cross), or NOBODY did (the man on the bench, the man by his car in the desert). One piece is the wrong
thing and is never explained: the coat on the fence that is almost a man.

RULE 360 AMENDED THE SAME ROUND (Paolo 11/3: 'keep the bodies lore friendly... if it's a busy civilized settlement or
part of the town, obviously they don't have [corpses], but the gameplay should be very simplified'): where people live
and keep order there are no bodies, only graves (the counts in tools/bohemia_cook_dead_card_11_3_26.py say so per
place); every piece is scenery, at most what a board already does with a thing on a tile (cover, a blocker).

  <venv>/bin/python tools/bohemia_cook_dead_the_dead_are_everywhere_11_3_26.py models [id ...]   (the .glb and the lone shots)
  python3 tools/bohemia_cook_dead_the_dead_are_everywhere_11_3_26.py manifest                     (the contract, from the ledger)
  python3 tools/bohemia_cook_dead_the_dead_are_everywhere_11_3_26.py card                         (the ONE VOTE card)
  venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy

REFERENCE CHECK (the 9/4 standing law): the real things at their real sizes: a man 1.72 m (the ruler), a body bag
2.2 x 0.9 m, a 3 x 3 m pop-up canopy, a mummy sleeping bag 2.1 m, a sedan's front door (the kit's own wreck), a grave
dug 2.1 x 0.9 m, #6 rebar (19 mm), a long trench dug by a dozer's blade at 3.6 m across; the real record: the valley's
own (Lake Mead's falling water gave up its dead in 2022), the morgue tents and refrigerated trucks of 2020, the long
trenches of Hart Island, the desert's heat deaths found by their cars. Each picture sits beside a real fight board on
the VOTE card at the fight's size beside the fight's man. No reference game.
REUSE CHECK (REUSE-FIRST): COOK PROPS' modeller (M, B, C, S, ROD, BAR, MESH, LOFT, ROCK, STAINS, MARK, MOVE, IMPORT,
join, reset, rig_scene, camera_on) imported whole; the kit's wreck.glb (twice), cart.glb, fence.glb, dozer.glb and the
graveyard's two fresh graves (COMBAT 10/24) imported whole, never remodelled; the props modeller's sack for the lime.
"""
import os, sys, json, math, time
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_props_every_place_its_own_11_3_26 as CP
from bohemia_cook_props_every_place_its_own_11_3_26 import (M, B, C, S, ROD, BAR, MESH, LOFT, ROCK, STAINS, MARK, MOVE, IMPORT,
                                                            GROUND, OBJS)

MODELS = os.path.join(R, 'reference/models/bohemia/dead')
OUT = os.path.join(R, 'records/target/dead')
RAW = '/tmp/claude-0/dead_raw'
PPM, CELL, STOREY, TILT = CP.PPM, CP.CELL, CP.STOREY, CP.TILT

bpy = mu = None
DEAD = {}


def dead(pid, name, role, kind, tile, who, see=False, landmark=False, sight=None, holes=(), against=None, what='', tells='',
         wrong='', flies=False):
    """role: cover | blocking | none; kind: the fight's own (COVER, LOW_COVER, HEIGHT, MOUND, NONE); who: moved | robbed |
    buried | nobody (who touched them last); holes: [(cx, cy, hx, hy)] rectangles the board cuts its ground inside"""
    def deco(fn):
        DEAD[pid] = dict(id=pid, name=name, fn=fn, role=role, kind=kind, tile=tile, who=who, see=see, landmark=landmark,
                         sight=(role in ('blocking', 'cover') and not see and kind != 'LOW_COVER') if sight is None else sight,
                         holes=list(holes), against=against, what=what, tells=tells, wrong=wrong, flies=flies)
        return fn
    return deco


def V(*a):
    return mu.Vector(a[0] if len(a) == 1 else a)


def HM(role, step):
    """a hair material: named so the rig's wear table gives it a hair's share of the dust (0.15), never a cap's grey"""
    import bohemia_cook_model_props as PM
    k = ('hair', role, step)
    if k not in CP.MC or CP.MC[k].name not in bpy.data.materials:
        CP.MC[k] = PM.mat(bpy, 'dead_hair_%s_%d' % (role, step), role, step)
    return CP.MC[k]


# ======================================================================================================================
# THE BODY: one soft shape, one limb, one person, one skeleton
# ======================================================================================================================
def _ell(n=12, r=7, pw=0.7):
    Vs, F = [(0.0, 0.0, -1.0)], []
    for i in range(1, r):
        th = -math.pi / 2 + math.pi * i / r
        for k in range(n):
            ph = 2 * math.pi * k / n
            x, y, z = math.cos(th) * math.cos(ph), math.cos(th) * math.sin(ph), math.sin(th)
            Vs.append(tuple(math.copysign(abs(c) ** pw, c) for c in (x, y, z)))
    Vs.append((0.0, 0.0, 1.0))
    for k in range(n): F.append([0, 1 + (k + 1) % n, 1 + k])
    for i in range(r - 2):
        for k in range(n):
            a, b = 1 + i * n + k, 1 + i * n + (k + 1) % n
            F.append([a, b, b + n, a + n])
    top, base = len(Vs) - 1, 1 + (r - 2) * n
    for k in range(n): F.append([base + k, base + (k + 1) % n, top])
    return Vs, F


def _frame(p0, p1, front):
    a = V(p1) - V(p0); L = a.length; a.normalize()
    f = V(front); f = f - a * f.dot(a)
    if f.length < 1e-6:
        f = V(0, 0, 1) if abs(a.z) < 0.9 else V(1, 0, 0); f = f - a * f.dot(a)
    f.normalize(); s = a.cross(f)
    return a, f, s, L


def SOFT(m, p0, p1, w, d, front=(0, 0, 1), pw=0.7, taper=0.0, sag=0.0, name='soft'):
    """a soft box from p0 to p1 (a torso, a bag, a bundle): w across, d front-to-back, front the way its face looks;
    taper narrows the p1 end, sag pulls its middle down toward -front"""
    a, f, s, L = _frame(p0, p1, front)
    mid = (V(p0) + V(p1)) / 2; Vs, F = _ell(14, 8, pw); out = []
    for x, y, z in Vs:
        k = 1 - taper * (z + 1) / 2
        out.append(mid + s * (x * w / 2 * k) + f * (y * d / 2 * k - sag * (1 - z * z)) + a * (z * L / 2))
    return MESH(m, out, F, name)


def LIMB(m, p0, p1, r0, r1, ends=True, v=8, name='limb'):
    c, L, e = CP._aim(p0, p1)
    o = C(m, r0, max(L, 0.01), c, e, v, r2=r1, name=name)
    if ends:
        S(m, r0, V(p0), seg=8, ring=5, name=name + '_j0'); S(m, r1, V(p1), seg=8, ring=5, name=name + '_j1')
    return o


def XF(J, loc=(0, 0, 0), rz=0.0):
    """a pose moved: points turned about z then shifted, directions only turned"""
    Rm = mu.Matrix.Rotation(math.radians(rz), 3, 'Z'); T = V(loc); out = {}
    for k, v in J.items():
        if k in ('front', 'face', 'crown') or k.startswith('top_') or k.startswith('palm_'): out[k] = Rm @ V(v)
        else: out[k] = Rm @ V(v) + T
    return out


DRESS = {
    # the runway law (Rick Owens' drab and black, Balenciaga's oversize, Bottega's oxblood), every one gone to rag in the sun
    'drab_coat':   dict(top=('metal_painted', 2), coat=('metal_painted', 1), trou=('cloth_black', 3), shoe=('rubber', 1), skin=('skin_mid', 2), hair=('cloth_black', 1)),
    'black_long':  dict(top=('cloth_black', 3), coat=('cloth_black', 2), trou=('cloth_black', 2), shoe=('rubber', 2), skin=('skin_light', 1), hair=('clay_mustard', 1)),
    'oxblood':     dict(top=('clay_rust', 1), coat=None, trou=('metal_painted', 1), shoe=('rubber', 1), skin=('skin_deep', 2), hair=('cloth_black', 0)),
    'ochre_work':  dict(top=('clay_mustard', 1), coat=None, trou=('clay_teal', 1), shoe=('clay_rust', 1), skin=('skin_mid', 1), hair=('cloth_black', 1)),
    'bone_shirt':  dict(top=('clay_bone', 2), coat=('tape_masking', 2), trou=('metal_painted', 2), shoe=('rubber', 1), skin=('skin_light', 2), hair=('tape_grey', 2)),
}


def PERSON(J, dress, shoe_off=None, hat=None, seed=0, name='man'):
    """one person on named joints: head neck pelvis sL sR eL eR hL hR hipL hipR kL kR aL aR toeL toeR, and directions
    front (the chest's face), face (where the face looks), crown (the top of the head); top_L / top_R override a shoe's
    top. The clothes are the dress's roles; a long coat where the dress has one."""
    D = DRESS[dress] if isinstance(dress, str) else dress
    top, trou, shoe, skin = M(*D['top']), M(*D['trou']), M(*D['shoe']), M(*D['skin'])
    coat = M(*D['coat']) if D.get('coat') else None
    face, crown = V(J['face']).normalized(), V(J['crown']).normalized()
    # the head, the hair on the back of it
    S(skin, 0.098, J['head'], sc=(0.95, 0.95, 1.0), name='head')
    if D.get('hair'): S(HM(*D['hair']), 0.101, V(J['head']) + crown * 0.018 - face * 0.022, sc=(1, 1, 0.98), name='hair')
    LIMB(skin, J['neck'], V(J['head']) - crown * 0.06, 0.05, 0.048, ends=False, name='neck')
    # the torso, the shoulders' yoke, the coat's skirt down the thighs
    pel, nk = V(J['pelvis']), V(J['neck'])
    SOFT(coat or top, pel + (pel - nk).normalized() * 0.04, nk, 0.40, 0.23, J['front'], pw=0.6, taper=-0.05, name='torso')
    LIMB(coat or top, J['sL'], J['sR'], 0.075, 0.075, name='yoke')
    if coat:
        km = (V(J['kL']) + V(J['kR'])) / 2
        SOFT(coat, pel - (km - pel).normalized() * 0.12, pel + (km - pel) * 0.95, 0.47, 0.18, J['front'], pw=0.55, taper=-0.18, name='skirt')
        LIMB(coat, V(J['sL']) * 0.6 + nk * 0.4 + V(J['front']) * 0.06, nk + V(J['front']) * 0.05 + (nk - pel).normalized() * 0.07, 0.04, 0.04, name='collar')
    # the arms
    sl = coat or top
    for s_ in 'LR':
        LIMB(sl, J['s' + s_], J['e' + s_], 0.058, 0.052, name='upper_arm')
        LIMB(sl, J['e' + s_], J['h' + s_], 0.05, 0.044, name='forearm')
        dh = (V(J['h' + s_]) - V(J['e' + s_])).normalized()
        SOFT(skin, J['h' + s_], V(J['h' + s_]) + dh * 0.17, 0.085, 0.035, J.get('palm_' + s_, (0, 0, 1)), pw=0.6, name='hand')
    # the legs and the shoes (a shoe off is a sock, and the shoe lies where it was knocked)
    for s_ in 'LR':
        LIMB(trou, J['hip' + s_], J['k' + s_], 0.082, 0.064, name='thigh')
        LIMB(trou, J['k' + s_], J['a' + s_], 0.062, 0.05, name='shin')
        a_, t_ = V(J['a' + s_]), V(J['toe' + s_]); fd = (t_ - a_).normalized()
        topv = V(J['top_' + s_]) if ('top_' + s_) in J else (V(J['k' + s_]) - a_).normalized()
        if shoe_off == s_:
            SOFT(M('clay_bone', 2), a_ - fd * 0.04, t_ - fd * 0.02, 0.085, 0.07, topv, pw=0.6, name='sock')
        else:
            SOFT(shoe, a_ - fd * 0.06, t_ + fd * 0.01, 0.105, 0.105, topv, pw=0.55, name='shoe')
    if hat == 'brim':
        c = V(J['head']) + crown * 0.075
        e = crown.to_track_quat('Z', 'Y').to_euler()
        C(M('tape_masking', 1), 0.19, 0.014, c - crown * 0.02, e, v=16, name='hat_brim'); C(M('tape_masking', 1), 0.095, 0.11, c + crown * 0.03, e, v=12, r2=0.085, name='hat_crown')
    return D


def SHOE(m, loc, rz=0.0, side=False, name='shoe_off'):
    """a shoe on its own, knocked off: on its side or upright"""
    o = SOFT(m, V(loc) + V(math.cos(math.radians(rz)), math.sin(math.radians(rz)), 0) * -0.14,
             V(loc) + V(math.cos(math.radians(rz)), math.sin(math.radians(rz)), 0) * 0.14, 0.105, 0.105,
             (0, 0, 1) if not side else (math.sin(math.radians(rz)), -math.cos(math.radians(rz)), 0.3), pw=0.55, name=name)
    for v in o.data.vertices: v.co.z = max(v.co.z, 0.0) + 0.052
    return o


def SKELETON(J, rags=('metal_painted', 1), boots=('rubber', 1), seed=0):
    """the same joints as bones: the skull and its sockets, the spine and the ribs, the pelvis, the long bones and their
    knobs; the boots outlast him, and a rag of what he wore"""
    bone, bone2, dark = M('clay_bone', 4), M('clay_bone', 3), M('cloth_black', 0)
    face, crown = V(J['face']).normalized(), V(J['crown']).normalized(); s = crown.cross(face).normalized()
    h = V(J['head'])
    S(bone, 0.088, h, sc=(0.92, 0.92, 0.98), name='skull')
    SOFT(bone2, h - crown * 0.05 + face * 0.03, h - crown * 0.1 + face * 0.075, 0.075, 0.05, face, pw=0.6, name='jaw')
    for k in (-1, 1): S(dark, 0.023, h + face * 0.072 + s * 0.032 * k + crown * 0.012, name='socket')
    S(dark, 0.012, h + face * 0.086 - crown * 0.022, name='nose')
    pel, nk = V(J['pelvis']), V(J['neck'])
    LIMB(bone2, pel, nk, 0.02, 0.018, name='spine'); LIMB(bone2, nk, h - crown * 0.07, 0.016, 0.016, ends=False, name='neckbone')
    a, f, sd, L = _frame(pel, nk, J['front'])
    for i in range(6):                                                      # six ribs a side, sloping down to the front
        t = 0.5 + 0.075 * i; c = pel + (nk - pel) * t; rs = 0.135 * (1 - 0.6 * ((t - 0.72) / 0.3) ** 2); rf = 0.095
        for side in (-1, 1):
            pts = []
            for k in range(9):
                th = -math.pi / 2 + (math.pi * 0.86) * k / 8
                pts.append(c + sd * (side * rs * math.cos(th)) + f * (rf * math.sin(th)) - a * (0.05 * (1 + math.sin(th))))
            for p0, p1 in zip(pts, pts[1:]): ROD(bone, p0, p1, 0.011, 4, name='rib')
    SOFT(bone2, pel - a * 0.05, pel + a * 0.09, 0.27, 0.12, J['front'], pw=0.6, name='pelvis_bone')
    for sd_ in 'LR':
        LIMB(bone, J['s' + sd_], J['e' + sd_], 0.02, 0.018, ends=False, name='humerus')
        LIMB(bone, J['e' + sd_], J['h' + sd_], 0.017, 0.015, ends=False, name='forearm_bone')
        for p in (J['s' + sd_], J['e' + sd_]): S(bone2, 0.028, p, seg=8, ring=5, name='knob')
        dh = (V(J['h' + sd_]) - V(J['e' + sd_])).normalized()
        for k in (-1, 0, 1): ROD(bone, V(J['h' + sd_]) + V(0, 0, 0.004 * k), V(J['h' + sd_]) + dh * 0.15 + sd * 0.025 * k, 0.008, 4, name='finger')
        LIMB(bone, J['hip' + sd_], J['k' + sd_], 0.024, 0.021, ends=False, name='femur')
        LIMB(bone, J['k' + sd_], J['a' + sd_], 0.02, 0.017, ends=False, name='tibia')
        for p in (J['hip' + sd_], J['k' + sd_]): S(bone2, 0.032, p, seg=8, ring=5, name='knob')
        a_, t_ = V(J['a' + sd_]), V(J['toe' + sd_]); fd = (t_ - a_).normalized()
        topv = V(J['top_' + sd_]) if ('top_' + sd_) in J else (V(J['k' + sd_]) - a_).normalized()
        SOFT(M(*boots), a_ - fd * 0.06, t_ + fd * 0.01, 0.11, 0.11, topv, pw=0.55, name='boot')
        LIMB(M(*boots), a_, a_ + (V(J['k' + sd_]) - a_) * 0.32, 0.058, 0.055, ends=False, name='boot_shaft')
    if rags:
        rg = M(*rags)                                                          # what is left of the trousers, the belt
        for sd_ in 'LR': LIMB(rg, J['hip' + sd_], V(J['hip' + sd_]) + (V(J['k' + sd_]) - V(J['hip' + sd_])) * 0.55, 0.07, 0.062, ends=False, name='rag_thigh')
        LIMB(M('rubber', 2), V(J['hipL']) + a * 0.06, V(J['hipR']) + a * 0.06, 0.035, 0.035, name='belt')


def FLIES(c, n=9, spread=(0.7, 0.4), z=(0.04, 0.3), seed=0):
    """the flies: specks over the still ones, a cloud that hangs and does not leave"""
    import random
    rnd = random.Random(seed); m = M('cloth_black', 0)
    for i in range(n):
        S(m, 0.019, (c[0] + rnd.gauss(0, spread[0] / 2), c[1] + rnd.gauss(0, spread[1] / 2), c[2] + rnd.uniform(*z)), seg=6, ring=4, name='fly')


def DRAPE(m, segs, x0, x1, y0, y1, nx=46, ny=30, lift=0.05, slope=1.05, seed=0, base=0.012, name='tarp'):
    """a sheet thrown over a shape: a height field that rides the body's capsules and falls to the ground at the
    cloth's own slope, with folds where it hangs and a ragged hem"""
    import random
    rnd = random.Random(seed); Vs, F = [], []
    ph = [rnd.uniform(0, 6.28) for _ in range(6)]
    for j in range(ny + 1):
        for i in range(nx + 1):
            u, w = i / nx, j / ny
            x, y = x0 + (x1 - x0) * u, y0 + (y1 - y0) * w
            if i in (0, nx) or j in (0, ny): x += rnd.uniform(-0.03, 0.03); y += rnd.uniform(-0.03, 0.03)
            h = base
            for (p0, p1, r) in segs:
                ax, ay = p1[0] - p0[0], p1[1] - p0[1]; l2 = ax * ax + ay * ay
                t = 0.0 if l2 < 1e-9 else max(0.0, min(1.0, ((x - p0[0]) * ax + (y - p0[1]) * ay) / l2))
                d = math.hypot(x - p0[0] - ax * t, y - p0[1] - ay * t); zc = p0[2] + (p1[2] - p0[2]) * t
                h = max(h, zc + r + lift - slope * max(0.0, d - r * 0.5))
            if h > base + 0.02:
                h += 0.022 * math.sin(7.0 * x + ph[0]) * math.cos(5.0 * y + ph[1]) + 0.012 * math.sin(13 * (x + y) + ph[2])
            Vs.append((x, y, max(base - 0.004, h)))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i
            F.append([a, a + 1, a + nx + 2, a + nx + 1])
    return MESH(m, Vs, F, name)


def BAG(m, L=2.15, W=0.78, H=0.27, loc=(0, 0, 0), rz=0.0, sheet=False, name='bag'):
    """a body bag (or a body in a sheet, tied at the neck and the ankles): a long soft shape over a body's own
    rise and fall: the head, the shoulders, the hips, the feet up at the end"""
    st = []
    prof = [(0.0, 0.16, 0.36), (0.06, 0.26, 0.62), (0.14, 0.24, 0.55), (0.22, 0.30, 0.62), (0.36, 0.33, 0.66), (0.52, 0.33, 0.62),
            (0.62, 0.29, 0.52), (0.74, 0.27, 0.45), (0.86, 0.24, 0.42), (0.93, 0.25, 0.62), (1.0, 0.18, 0.4)]
    if sheet:
        prof = [(0.0, 0.11, 0.30), (0.05, 0.2, 0.62), (0.11, 0.14, 0.45), (0.2, 0.3, 0.66), (0.36, 0.31, 0.7), (0.52, 0.32, 0.66),
                (0.66, 0.26, 0.55), (0.82, 0.21, 0.45), (0.9, 0.13, 0.36), (0.95, 0.19, 0.6), (1.0, 0.12, 0.35)]
    for (t, hw, hh) in prof:
        st.append((-L / 2 + L * t, W * hw * 1.6 if not sheet else W * hw * 1.5, H * hh, H * hh * 0.98))
    o = LOFT(m, st, n=14, p=2.6 if not sheet else 2.2, flat=0.95, name=name)
    o.location = loc; o.rotation_euler = (0, 0, math.radians(rz))
    return o


def CINDER(loc, rz=0.0):
    B(M('tape_grey', 3), (0.4, 0.2, 0.2), (loc[0], loc[1], 0.1), rot=(0, 0, math.radians(rz)), name='cinder')


def STAKE(loc, h=0.9, tape=('clay_mustard', 3)):
    B(M('tape_masking', 1), (0.045, 0.045, h), (loc[0], loc[1], h / 2), name='stake')
    B(M(*tape), (0.03, 0.02, 0.32), (loc[0] + 0.04, loc[1] - 0.02, h - 0.2), rot=(0, math.radians(-15), 0), name='survey_tape')


# ======================================================================================================================
# THE POSES (local: a body along +x, its feet near x = 0, its head near x = 1.7; z up)
# ======================================================================================================================
SUPINE = dict(head=(1.64, 0, 0.11), neck=(1.48, 0, 0.1), pelvis=(0.92, 0, 0.11), front=(0, 0, 1), face=(0.15, 0, 1), crown=(1, 0, 0),
              sL=(1.40, 0.19, 0.1), sR=(1.40, -0.19, 0.1), eL=(1.13, 0.27, 0.06), eR=(1.13, -0.30, 0.06),
              hL=(0.88, 0.30, 0.04), hR=(0.98, -0.47, 0.03), hipL=(0.92, 0.1, 0.1), hipR=(0.92, -0.1, 0.1),
              kL=(0.5, 0.12, 0.08), kR=(0.5, -0.12, 0.08), aL=(0.1, 0.16, 0.08), aR=(0.1, -0.16, 0.08),
              toeL=(0.04, 0.25, 0.27), toeR=(0.04, -0.25, 0.27), top_L=(-1, 0.3, 0.5), top_R=(-1, -0.3, 0.5), palm_R=(0, 0, 1))
PRONE = dict(head=(1.63, 0.03, 0.1), neck=(1.48, 0.01, 0.1), pelvis=(0.93, 0, 0.12), front=(0, 0, -1), face=(0.1, 0.8, -0.6), crown=(1, 0, 0),
             sL=(1.40, 0.19, 0.11), sR=(1.40, -0.19, 0.11), eL=(1.66, 0.34, 0.05), eR=(1.13, -0.28, 0.05),
             hL=(1.86, 0.27, 0.03), hR=(0.91, -0.27, 0.04), hipL=(0.93, 0.1, 0.11), hipR=(0.93, -0.1, 0.11),
             kL=(0.52, 0.18, 0.07), kR=(0.5, -0.1, 0.07), aL=(0.11, 0.23, 0.07), aR=(0.09, -0.1, 0.07),
             toeL=(-0.13, 0.25, 0.03), toeR=(-0.15, -0.1, 0.03), top_L=(0, 0, -1), top_R=(0, 0, -1), palm_L=(0, 0, -1), palm_R=(0, 0, -1))


# ======================================================================================================================
# THE SET, worst gap first (the brief's order)
# ======================================================================================================================
@dead('dead.tarp', 'A BODY UNDER A TARP', 'none', 'NONE', '.', 'moved', flies=True,
      what='a man on his back under a sun-rotted tarp held down at the corners with cinder blocks and a tyre; his boots stick '
           'out at one end, toes up, and one hand at the side, palm up',
      tells='the living covered him: somebody found the blocks and the tyre and weighed the corners down against the wind')
def dead_tarp():
    PERSON(SUPINE, 'drab_coat', seed=1)
    segs = [((0.92, 0, 0.13), (1.45, 0, 0.14), 0.21), ((1.66, 0, 0.12), (1.66, 0, 0.12), 0.13),
            ((0.92, 0.1, 0.1), (0.3, 0.13, 0.08), 0.09), ((0.92, -0.1, 0.1), (0.3, -0.13, 0.08), 0.09),
            ((1.40, 0.19, 0.1), (0.88, 0.3, 0.04), 0.07)]
    DRAPE(M('clay_teal', 2), segs, 0.34, 2.05, -0.82, 0.86, lift=0.07, slope=0.75, seed=3, name='tarp')
    for (x, y, r) in ((0.42, -0.86, 10), (2.0, -0.8, -20), (2.02, 0.88, 5)): CINDER((x, y), r)
    C(M('rubber', 1), 0.33, 0.2, (0.42, 0.9, 0.1), v=16, name='tyre_on_corner'); C(M('rubber', 0), 0.18, 0.21, (0.42, 0.9, 0.1), v=12, name='tyre_hole')
    STAINS((1.2, 0.0, 0.3, 1.2, 1.0, 'z'), 5, 11, (('clay_bone', 2), ('clay_teal', 1), ('clay_mustard', 1)), (0.12, 0.3))
    FLIES((1.1, 0.0, 0.2), n=12, seed=4)


@dead('dead.doorway', 'A BODY IN A SLEEPING BAG IN A DOORWAY', 'blocking', 'COVER', '#', 'robbed', against='a building\'s street face: its back (+y) flush on the wall',
      what='a shop\'s deep doorway, its steel door shut and its shutter box over it; a man zipped into a mummy bag on a flattened '
           'box across the step, the hood pulled shut, his feet out of the end in grey socks; his pack pulled open and emptied onto '
           'the sidewalk', flies=True,
      tells='the living robbed him: his shoes are gone, his pack is turned out, and nobody closed the bag over his feet')
def dead_doorway():
    wall, wall2, dark, steel, step = M('tape_masking', 3), M('tape_masking', 2), M('cloth_black', 0), M('metal_painted', 1), M('tape_grey', 3)
    for x in (-1.65, 1.65): B(wall, (1.1, 0.35, 3.4), (x, 0.175, 1.7), name='pier')
    B(wall, (4.4, 0.35, 0.8), (0, 0.175, 3.0), name='lintel')
    for x in (-1.1, 1.1): B(wall2, (0.12, 1.0, 2.6), (x, 0.5, 1.3), name='reveal')
    B(wall2, (2.2, 0.12, 2.6), (0, 1.06, 1.3), name='back_wall')
    B(steel, (1.0, 0.06, 2.15), (-0.35, 0.99, 1.08), name='steel_door'); B(dark, (0.7, 0.04, 1.9), (0.62, 0.99, 1.15), name='sidelight_gone')
    B(M('chrome', 0), (0.12, 0.04, 0.04), (0.05, 0.95, 1.05), name='door_bar')
    B(step, (2.2, 1.0, 0.08), (0, 0.5, 0.04), name='step'); B(M('tape_grey', 2), (2.3, 0.2, 0.3), (0, 0.15, 2.48), name='shutter_box')
    B(M('clay_teal', 2), (3.4, 0.08, 0.45), (0, -0.03, 2.95), name='shop_sign'); B(M('clay_bone', 3), (1.6, 0.03, 0.22), (-0.6, -0.08, 2.95), name='sign_letters')
    for x in (-1.65, 1.65): STAINS((x, -0.01, 1.3, 0.9, 2.2, '-y'), 3, 21 + int(x), (('clay_mustard', 2), ('tape_masking', 2)), (0.08, 0.2))
    B(M('tape_masking', 2), (2.0, 0.85, 0.02), (0.0, 0.48, 0.09), rot=(0, 0, 0.04), name='cardboard')
    # the mummy bag across the step, the hood shut at +x, the feet out of the open foot at -x
    LOFT(M('clay_rust', 1), [(-0.72, 0.17, 0.11, 0.2), (-0.6, 0.24, 0.15, 0.24), (-0.2, 0.3, 0.17, 0.27), (0.2, 0.34, 0.2, 0.3),
                             (0.55, 0.33, 0.19, 0.29), (0.78, 0.25, 0.17, 0.26), (0.92, 0.18, 0.15, 0.24), (1.0, 0.08, 0.08, 0.22)],
         n=14, p=2.4, flat=0.9, name='mummy_bag')
    for o in OBJS[-1:]: o.location = (0.08, 0.5, 0.0)
    S(HM('cloth_black', 1), 0.05, (1.02, 0.5, 0.29), name='hair_at_the_hood')
    for y in (0.43, 0.58):
        SOFT(M('clay_bone', 3), (-0.66, y, 0.17), (-0.95, y + 0.03, 0.13), 0.1, 0.085, (-0.2, 0, 1), pw=0.6, name='sock')
    # the pack, opened and emptied onto the sidewalk
    SOFT(M('clay_mustard', 1), (1.35, -0.35, 0.05), (1.65, -0.55, 0.1), 0.38, 0.2, (0, 0, 1), pw=0.6, sag=0.04, name='pack_emptied')
    for k, (x, y, r) in enumerate(((0.9, -0.6, 0.3), (1.1, -0.9, 1.2), (1.9, -0.8, 0.6), (0.6, -1.0, 2.0), (2.1, -0.4, 0.2))):
        B(M(*[('clay_bone', 4), ('tape_grey', 3), ('clay_rust', 2), ('clay_teal', 3), ('tape_masking', 3)][k]), (0.22, 0.15, 0.04), (x, y, 0.02), rot=(0, 0, r), name='turned_out')
    FLIES((0.1, 0.4, 0.2), n=10, spread=(0.8, 0.3), seed=22)


@dead('dead.bag_row', 'A ROW OF BODY BAGS AT A CLINIC', 'none', 'NONE', '.', 'moved', see=True, sight=False,
      what='a clinic\'s pop-up canopy with a faded cross on its roof, a folding table and a cooler under it; six body bags laid '
           'feet-first in a row beside it, a paper tag on every foot, and the seventh only a sheet tied at the neck and the ankles',
      tells='the living moved them: carried out one at a time and laid straight, tagged, the row longer than the bags',
      flies=True)
def dead_bag_row():
    leg, cloth, red = M('tape_grey', 2), M('clay_bone', 3), M('clay_rust', 2)
    cx = -3.0
    for dx in (-1.45, 1.45):
        for dy in (-1.45, 1.45): C(leg, 0.025, 2.2, (cx + dx, dy, 1.1), v=6, name='canopy_leg')
    pts = [(cx - 1.5, -1.5, 2.2), (cx + 1.5, -1.5, 2.2), (cx + 1.5, 1.5, 2.2), (cx - 1.5, 1.5, 2.2), (cx, 0, 2.75)]
    MESH(cloth, pts, [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]], name='canopy_roof')
    for (x0, y0, x1, y1) in ((cx - 1.5, -1.5, cx + 1.5, -1.5), (cx - 1.5, 1.5, cx + 1.5, 1.5), (cx - 1.5, -1.5, cx - 1.5, 1.5), (cx + 1.5, -1.5, cx + 1.5, 1.5)):
        BAR(cloth, (x0, y0, 2.08), (x1, y1, 2.08), 0.02, 0.24, name='valance')
    k = math.atan2(0.55, 1.5)   # the cross on the roof's south face, laid on its slope
    for (w, d) in ((1.25, 0.34), (0.34, 1.25)):
        B(red, (w, d * math.cos(k) + 0.02, 0.02), (cx, -0.62, 2.2 + 0.55 * 0.62 / 1.5 + 0.02), rot=(-k, 0, 0), name='cross')
    B(M('tape_grey', 3), (1.8, 0.75, 0.04), (cx, 0.4, 0.74), name='table_top')
    for dx in (-0.8, 0.8): BAR(leg, (cx + dx, 0.1, 0.0), (cx + dx, 0.7, 0.72), 0.03, name='table_leg'); BAR(leg, (cx + dx, 0.7, 0.0), (cx + dx, 0.1, 0.72), 0.03, name='table_leg')
    B(M('clay_teal', 3), (0.55, 0.38, 0.38), (cx - 0.4, 0.4, 0.95), name='cooler'); B(M('tape_masking', 3), (0.4, 0.3, 0.22), (cx + 0.4, 0.45, 0.87), name='box')
    B(M('clay_bone', 4), (0.24, 0.32, 0.01), (cx + 0.05, 0.25, 0.765), rot=(0, 0, 0.2), name='clipboard')
    bag = M('cloth_black', 2)
    for i in range(7):
        x = -0.8 + i * 0.86
        if i < 6:
            BAG(bag, loc=(x, 0.1, 0.0), rz=-90 + (i % 3 - 1) * 2, name='body_bag')
            BAR(M('tape_grey', 2), (x + 0.02, 1.15, 0.27), (x + 0.02, -0.85, 0.25), 0.02, 0.01, name='zip')
        else:
            BAG(cloth, loc=(x, 0.1, 0.0), rz=-90, sheet=True, name='sheet')
            for yy in (0.95, -0.82): C(M('tape_masking', 1), 0.17, 0.035, (x, yy, 0.1), (0, math.pi / 2, math.pi / 2), v=10, name='tie')
        B(M('clay_bone', 4), (0.09, 0.14, 0.01), (x + 0.08, -0.98, 0.16), rot=(math.radians(-40), 0, 0.3), name='toe_tag')
    FLIES((1.8, 0.0, 0.2), n=16, spread=(4.0, 1.2), seed=31)


@dead('dead.car_driver', 'A BODY SLUMPED OUT OF A CAR\'S DRIVER SEAT', 'cover', 'COVER', '#', 'robbed', flies=True,
      what='the kit\'s dead sedan, the driver\'s door hanging open; the driver slumped sideways out of his seat, his head and one arm '
           'hanging out of the door toward the road, one foot out on the ground; the bonnet up and the battery gone',
      tells='the living robbed him: they took the battery out of the car and left the man in it')
def dead_car_driver():
    d0 = MARK(); meshes = IMPORT('wreck.glb'); MOVE(d0, rot=(0, 0, math.pi))     # the kit's wreck faces +x: turned, its driver's side is south, to the camera
    paint = next((o.data.materials[0] for o in meshes if o.name.startswith('bonnet') and o.data.materials), M('clay_teal', 2))
    for o in meshes:
        if o.name.startswith('bonnet'):                                    # the bonnet up, hinged at its windscreen edge
            co = [o.matrix_basis @ v.co for v in o.data.vertices]
            hx, hz = max(c.x for c in co), max(c.z for c in co); ang = math.radians(44)
            T = mu.Matrix.Translation((hx, 0, hz)) @ mu.Matrix.Rotation(ang, 4, 'Y') @ mu.Matrix.Translation((-hx, 0, -hz))
            o.matrix_basis = T @ o.matrix_basis
            lx, ly0, ly1 = min(c.x for c in co), min(c.y for c in co), max(c.y for c in co)
            B(M('cloth_black', 1), (hx - lx - 0.1, ly1 - ly0 - 0.1, 0.05), ((hx + lx) / 2, (ly0 + ly1) / 2, hz - 0.02), name='engine_bay')
            B(M('clay_rust', 0), (0.32, 0.2, 0.04), (lx + 0.45, ly0 + 0.3, hz + 0.0), name='battery_tray_empty')
            ROD(M('clay_rust', 2), (lx + 0.45, ly0 + 0.25, hz + 0.02), (lx + 0.2, ly0 - 0.02, hz - 0.25), 0.012, 4, name='cable_red')
            ROD(M('rubber', 1), (lx + 0.55, ly0 + 0.3, hz + 0.02), (lx + 0.35, ly0 - 0.03, hz - 0.3), 0.012, 4, name='cable_black')
    side = [o for o in meshes if o.name.startswith('body_low')]
    by = min((o.matrix_basis @ v.co).y for o in side for v in o.data.vertices) if side else -0.9
    # the door opening (dark), the door hanging open on its front hinge
    B(M('cloth_black', 0), (1.05, 0.02, 0.52), (-0.25, by - 0.012, 0.59), name='door_opening')
    hinge = V(-0.8, by - 0.02, 0.0); dv = V(math.cos(math.radians(-62)), math.sin(math.radians(-62)), 0)
    B(paint, (1.05, 0.07, 0.55), hinge + dv * 0.53 + V(0, 0, 0.6), rot=(0, 0, math.radians(-62)), name='door')
    for z0, z1, t in ((0.88, 1.25, 0.0), (0.88, 1.2, 1.0)): ROD(paint, hinge + dv * (0.05 + 0.95 * t) + V(0, 0, z0), hinge + dv * (0.08 + 0.85 * t) + V(0, 0, z1), 0.022, 4, name='door_frame')
    ROD(paint, hinge + dv * 0.05 + V(0, 0, 1.25), hinge + dv * 0.92 + V(0, 0, 1.2), 0.022, 4, name='door_frame')
    J = dict(head=(-0.36, -1.18, 0.55), neck=(-0.27, -1.0, 0.66), pelvis=(-0.05, -0.42, 0.52), front=(0.1, -0.3, -1), face=(0.0, -0.4, -1), crown=(0.0, -1, -0.15),
             sL=(-0.22, -0.95, 0.82), sR=(-0.2, -0.72, 0.9), eL=(-0.42, -1.2, 0.52), eR=(-0.05, -0.75, 0.62),
             hL=(-0.48, -1.28, 0.2), hR=(0.12, -0.6, 0.5), hipL=(-0.05, -0.52, 0.52), hipR=(-0.05, -0.32, 0.52),
             kL=(-0.45, -0.95, 0.5), kR=(-0.45, -0.35, 0.6), aL=(-0.55, -1.25, 0.08), aR=(-0.8, -0.35, 0.2),
             toeL=(-0.8, -1.3, 0.05), toeR=(-1.05, -0.35, 0.12), palm_L=(0, -1, 0))
    PERSON(J, 'oxblood', seed=4)
    FLIES((-0.4, -1.2, 0.4), n=12, spread=(0.6, 0.5), seed=41)


@dead('dead.desert_skeleton', 'A SKELETON BY A DEAD CAR IN THE DESERT', 'cover', 'LOW_COVER', '.', 'nobody',
      what='the kit\'s dead sedan sunk to its sills in the drift, its bonnet up where the radiator boiled; in its shade a man\'s bones '
           'sit against the driver\'s door, his skull tipped to one shoulder, his boots still on, an empty water jug on its side',
      tells='nobody moved him: the car died on the way out, he sat down in its shade, and he never got up')
def dead_desert_skeleton():
    d = MARK(); meshes = IMPORT('wreck.glb'); MOVE(d, rot=(0, 0, math.pi))
    for o in meshes:
        if o.name.startswith('bonnet'):
            co = [o.matrix_basis @ v.co for v in o.data.vertices]
            hx, hz = max(c.x for c in co), max(c.z for c in co)
            T = mu.Matrix.Translation((hx, 0, hz)) @ mu.Matrix.Rotation(math.radians(64), 4, 'Y') @ mu.Matrix.Translation((-hx, 0, -hz))
            o.matrix_basis = T @ o.matrix_basis
    MOVE(d, loc=(0, 0, -0.26), rot=(math.radians(-2), math.radians(3), 0))
    sand = M('clay_bone', 2)
    ROCK(sand, (0.8, 1.2, 0), (6.0, 2.4, 0.4), seed=81, sub=3, rough=0.1, sink=0.05, name='drift')
    ROCK(sand, (2.6, -0.4, 0), (2.0, 1.8, 0.35), seed=82, sub=3, rough=0.1, sink=0.05, name='drift')
    ROCK(sand, (-0.75, -1.75, 0), (0.9, 0.7, 0.07), seed=83, sub=2, rough=0.1, sink=0.05, name='drift_at_his_feet')
    by = -0.92
    J = dict(head=(0.1, -0.13, 0.69), neck=(0.02, -0.08, 0.6), pelvis=(0.0, -0.2, 0.11), front=(0, -1, 0.15), face=(0.25, -0.8, -0.45), crown=(0.4, -0.25, 0.9),
             sL=(0.18, -0.08, 0.54), sR=(-0.17, -0.08, 0.54), eL=(0.26, -0.16, 0.3), eR=(-0.24, -0.2, 0.3),
             hL=(0.3, -0.3, 0.04), hR=(-0.05, -0.42, 0.16), hipL=(0.1, -0.22, 0.11), hipR=(-0.1, -0.22, 0.11),
             kL=(0.14, -0.66, 0.12), kR=(-0.14, -0.5, 0.4), aL=(0.18, -1.08, 0.09), aR=(-0.12, -0.78, 0.09),
             toeL=(0.22, -1.13, 0.33), toeR=(-0.13, -1.03, 0.05), top_L=(0, 1, 0.3), top_R=(0, -0.2, 1))
    SKELETON(XF(J, (-0.55, by, 0.0)), rags=('clay_mustard', 1))
    C(M('clay_bone', 4), 0.12, 0.28, (0.35, by - 1.0, 0.12), (math.pi / 2, 0, 0.7), v=10, name='water_jug_empty'); B(M('clay_bone', 4), (0.04, 0.12, 0.03), (0.42, by - 1.05, 0.2), name='jug_handle')
    C(M('tape_masking', 1), 0.21, 0.015, (-1.15, by - 0.65, 0.02), v=16, name='hat_brim'); C(M('tape_masking', 1), 0.1, 0.1, (-1.15, by - 0.65, 0.06), v=12, r2=0.085, name='hat_crown')


@dead('dead.bones', 'BONES IN THE SAND, HALF BURIED', 'none', 'NONE', '.', 'moved',
      what='a low drift of sand with a man\'s bones coming out of it: the skull half sunk, the ribs\' arc, a femur dragged clear, '
           'one boot on its side with the shin still in it, a rag of his coat caught on a dead creosote',
      tells='the beasts moved him: the bones are dragged apart over four metres, the way coyotes leave them')
def dead_bones():
    sand, bone, bone2 = M('tape_masking', 2), M('clay_bone', 4), M('clay_bone', 3)
    ROCK(sand, (0, 0.1, 0), (3.2, 1.7, 0.12), seed=91, sub=3, rough=0.1, sink=0.05, name='drift')
    ROCK(sand, (1.2, 0.5, 0), (1.3, 0.9, 0.09), seed=92, sub=2, rough=0.1, sink=0.05, name='drift')
    S(bone, 0.088, (-0.75, 0.1, 0.1), sc=(0.95, 1, 0.9), name='skull_half_sunk')
    for k in (-1, 1): S(M('cloth_black', 0), 0.022, (-0.75 + 0.032 * k, 0.02, 0.15), name='socket')
    c = V(0.0, 0.0, 0.18)
    for i in range(5):                                                       # the ribs' arc out of the sand, the spine under them
        x = -0.32 + i * 0.11
        pts = [V(x, -0.15 * math.cos(t), 0.06 + 0.13 * math.sin(t)) for t in np.linspace(0.1, math.pi - 0.1, 7)]
        for p0, p1 in zip(pts, pts[1:]): ROD(bone, p0, p1, 0.011, 4, name='rib')
    ROD(bone2, (-0.5, 0, 0.08), (0.3, 0, 0.09), 0.02, 5, name='spine')
    LIMB(bone, (0.95, -0.85, 0.05), (1.35, -0.6, 0.06), 0.024, 0.022, name='femur_dragged')
    LIMB(bone, (-1.6, -0.7, 0.04), (-1.3, -0.95, 0.04), 0.017, 0.015, name='forearm_bone')
    for k in range(5): S(bone2, 0.022, (0.55 + 0.07 * k, -0.25 + 0.02 * k, 0.09 + 0.01 * k), seg=6, ring=4, name='vertebra')
    SOFT(bone2, (0.45, 0.05, 0.06), (0.62, 0.1, 0.11), 0.26, 0.12, (0, 0, 1), pw=0.6, name='pelvis_bone')
    SOFT(M('rubber', 1), (1.7, -1.1, 0.06), (1.95, -1.25, 0.06), 0.11, 0.12, (0.2, -1, 0.2), pw=0.55, name='boot_on_its_side')
    LIMB(M('rubber', 1), (1.7, -1.1, 0.06), (1.5, -0.95, 0.07), 0.056, 0.054, ends=False, name='boot_shaft')
    LIMB(bone, (1.5, -0.95, 0.07), (1.15, -0.72, 0.08), 0.019, 0.017, ends=False, name='tibia')
    for a in (0.2, 1.1, 2.0, 2.9, 3.8, 4.7, 5.6):                            # the dead creosote, the rag caught on it
        r = 0.55 + 0.15 * math.sin(3 * a)
        ROD(M('metal_painted', 1), (-1.45, 0.95, 0.0), (-1.45 + r * math.cos(a), 0.95 + r * math.sin(a), 0.65 + 0.2 * math.cos(2 * a)), 0.018, 4, name='creosote_dead')
    SOFT(M('metal_painted', 2), (-1.55, 0.7, 0.55), (-1.25, 0.66, 0.2), 0.32, 0.02, (0, -1, 0.2), pw=0.8, name='coat_rag')


@dead('dead.grave_cross', 'A GRAVE WITH A REBAR CROSS', 'none', 'NONE', '.', 'buried',
      what='a long mound of turned desert soil ringed with stones laid one by one, a cross of two rebar bars wired together, '
           'his cap hung on it, a faded plastic flower, a water bottle left full',
      tells='the living buried him and took their time: every stone of the ring was carried, and the bottle is full')
def dead_grave_cross():
    SOFT(M('clay_mustard', 1), (0, -1.0, 0), (0, 1.0, 0), 0.92, 0.5, (0, 0, 1), pw=0.5, name='mound')
    import random
    rnd = random.Random(102)
    for k in range(5): ROCK(M('clay_mustard', 2), (rnd.uniform(-0.3, 0.3), rnd.uniform(-0.8, 0.8), 0.18), (0.25, 0.2, 0.1), seed=140 + k, sub=1, rough=0.25, sink=0.3, name='clod')
    for k in range(26):
        a = 2 * math.pi * k / 26; x, y = 0.62 * math.cos(a), 1.2 * math.sin(a)
        ROCK(M(*[('tape_grey', 2), ('clay_bone', 1), ('clay_rust', 2)][k % 3]), (x, y, 0), (0.22, 0.18, 0.13), seed=103 + k, sub=1, rough=0.2, sink=0.2, name='ring_stone')
    rb = M('clay_rust', 1)
    ROD(rb, (0.0, 1.3, 0.0), (0.0, 1.3, 1.25), 0.016, 5, name='rebar_upright'); ROD(rb, (-0.34, 1.3, 0.92), (0.34, 1.3, 0.92), 0.016, 5, name='rebar_arm')
    S(M('tape_grey', 2), 0.032, (0.0, 1.3, 0.92), name='tie_wire')
    SOFT(M('metal_painted', 1), (0.25, 1.24, 0.95), (0.25, 1.24, 0.79), 0.2, 0.14, (0, -1, 0), pw=0.6, name='cap_hung_on_the_arm'); B(M('metal_painted', 1), (0.16, 0.08, 0.012), (0.25, 1.15, 0.8), rot=(0.6, 0, 0), name='cap_bill')
    ROD(M('clay_teal', 2), (-0.3, 0.95, 0.15), (-0.32, 0.92, 0.5), 0.008, 4, name='flower_stem'); S(M('clay_rust', 3), 0.055, (-0.32, 0.92, 0.52), name='plastic_flower')
    C(M('clay_bone', 4), 0.04, 0.24, (0.32, 1.0, 0.12), v=8, name='water_bottle_full')


@dead('dead.grave_row', 'A ROW OF FRESH GRAVES', 'none', 'NONE', '.', 'buried', holes=[(4.2, 0.0, 0.48, 1.08)],
      what='six graves in a row on a field: four plain mounds of dark turned soil with survey stakes and their tape, two with a photo '
           'and a jar (the graveyard\'s own fresh graves), and the last one open: dug, empty, its spoil beside it and the shovel standing in it',
      tells='the living buried them, one a day by the soil\'s colour, the newest darkest',
      wrong='there is always one more grave dug than there are dead')
def dead_grave_row():
    xs = [-5.4, -3.6, -1.8, 0.0, 1.9]
    tones = [('clay_bone', 1), ('clay_bone', 1), ('tape_masking', 1), ('clay_mustard', 1), ('clay_mustard', 0)]
    for i, x in enumerate(xs):
        if i in (1, 3):
            dd = MARK(); IMPORT('graveyard_grave_fresh_%d.glb' % (i // 2)); MOVE(dd, loc=(x, 0.1, 0), rot=(0, 0, math.radians(90)))
        else:
            SOFT(M(*tones[i]), (x, -1.05, 0), (x, 1.05, 0), 0.95, 0.5, (0, 0, 1), pw=0.5, name='fresh_mound')
            for k in range(4): ROCK(M(*tones[i]), (x + 0.25 * math.sin(3 * k + i), -0.7 + 0.45 * k, 0.17), (0.28, 0.22, 0.12), seed=150 + 7 * i + k, sub=1, rough=0.25, sink=0.3, name='clod')
            STAKE((x + 0.1, -1.25))
    # the open grave, the spoil, the shovel
    gx, hy, hx, dp = 4.2, 1.08, 0.48, 1.4
    soil, soil2 = M('clay_mustard', 0), M('clay_rust', 1)
    B(soil, (2 * hx + 0.3, 2 * hy + 0.3, 0.12), (gx, 0, -dp - 0.06), name='grave_floor')
    for sx in (-1, 1): B(soil2, (0.15, 2 * hy + 0.3, dp), (gx + sx * (hx + 0.075), 0, -dp / 2), name='grave_wall')
    for sy in (-1, 1): B(soil if sy > 0 else soil2, (2 * hx + 0.3, 0.15, dp), (gx, sy * (hy + 0.075), -dp / 2), name='grave_wall')
    SOFT(M('clay_mustard', 0), (gx + 1.2, -1.15, 0), (gx + 1.2, 1.15, 0), 1.2, 1.0, (0, 0, 1), pw=0.75, name='spoil')
    for k in range(5): ROCK(M('clay_mustard', 0), (gx + 1.1 + 0.2 * math.sin(k), -0.9 + 0.45 * k, 0.35), (0.35, 0.3, 0.18), seed=160 + k, sub=1, rough=0.3, sink=0.3, name='clod')
    ROD(M('tape_masking', 1), (gx + 1.2, 0.3, 0.5), (gx + 1.05, 0.25, 1.55), 0.02, 5, name='shovel_handle')
    B(M('metal_painted', 1), (0.24, 0.03, 0.3), (gx + 1.22, 0.31, 0.38), rot=(0, math.radians(-8), 0), name='shovel_blade')
    STAKE((gx - 0.1, -1.3), tape=('clay_rust', 3))


@dead('dead.sidewalk', 'A BODY FACE DOWN ON THE SIDEWALK, ONE SHOE OFF', 'none', 'NONE', '.', 'robbed', flies=True,
      what='a man face down where he fell, one arm out past his head, his long black coat gone grey in the sun; one shoe off a metre '
           'away, his sock to the sky, his hat rolled into the gutter, his coat pockets pulled inside out',
      tells='the living robbed him: the pockets are out and the lining shows; nobody moved him after that')
def dead_sidewalk():
    J = XF(PRONE, (-0.85, 0.0, 0.0), 8)
    PERSON(J, 'black_long', shoe_off='L', seed=9)
    SHOE(M('rubber', 2), (-1.55, 0.95, 0.0), rz=40, side=True)
    for (x, y) in ((-0.15, 0.28), (-0.05, -0.3)):
        SOFT(M('clay_bone', 2), (x, y, 0.16), (x - 0.03, y + 0.11 * (1 if y > 0 else -1), 0.05), 0.09, 0.02, (0, 0, 1), pw=0.8, name='pocket_out')
    C(M('cloth_black', 1), 0.2, 0.015, (1.25, -0.62, 0.02), v=16, name='hat_brim'); C(M('cloth_black', 1), 0.1, 0.11, (1.2, -0.57, 0.12), (0.4, 1.2, 0), v=12, r2=0.09, name='hat_crown')
    FLIES((0.0, 0.0, 0.18), n=13, seed=91)


@dead('dead.cart', 'REMAINS IN A SHOPPING CART', 'none', 'NONE', '.', 'moved',
      what='the kit\'s shopping cart with a body folded into the basket, wrapped in a striped blanket tied with rope, the legs over the '
           'front in work trousers and boots; pushed this far and left', flies=True,
      tells='the living moved him: somebody was wheeling him to the pit and stopped here')
def dead_cart():
    d = MARK(); IMPORT('cart.glb'); MOVE(d, rot=(0, 0, math.radians(8)))
    bl, st = M('metal_painted', 2), M('clay_rust', 1)
    SOFT(bl, (0.5, 0.0, 1.05), (-0.25, 0.02, 0.72), 0.52, 0.42, (0.4, 0, 1), pw=0.6, name='blanket_bundle')
    for t in (0.25, 0.6): SOFT(st, (0.5 - 0.75 * t - 0.04, 0.0, 1.05 - 0.33 * t), (0.5 - 0.75 * t + 0.04, 0.0, 1.05 - 0.33 * t), 0.55, 0.45, (1, 0, 0.3), pw=0.6, name='blanket_stripe')
    S(bl, 0.17, (0.52, 0.0, 1.16), name='blanket_head')
    for t in (0.15, 0.7): ROD(M('tape_masking', 2), (0.5 - 0.75 * t, -0.27, 1.17 - 0.33 * t), (0.5 - 0.75 * t, 0.27, 1.17 - 0.33 * t), 0.015, 4, name='rope')
    tr, sh = M('clay_teal', 1), M('clay_rust', 1)
    for y in (-0.11, 0.11):
        LIMB(tr, (-0.25, y, 0.85), (-0.55, y, 1.02), 0.075, 0.062, name='thigh'); LIMB(tr, (-0.55, y, 1.02), (-0.68, y * 1.3, 0.6), 0.062, 0.05, name='shin')
        SOFT(sh, (-0.66, y * 1.3, 0.62), (-0.86, y * 1.35, 0.55), 0.105, 0.105, (0.2, 0, 1), pw=0.55, name='boot')
    FLIES((0.1, 0.0, 1.1), n=10, spread=(0.6, 0.4), seed=101)


@dead('dead.mass_grave', 'THE PIT: A MASS GRAVE\'S EDGE', 'blocking', 'NONE', '#', 'moved', see=True, sight=False, landmark=True,
      holes=[(0.0, 0.0, 9.0, 1.8)],
      what='a trench cut by a dozer\'s blade, eighteen metres by three and a half, a metre and a half deep: the dead laid crosswise in '
           'it in bags and sheets, the west end under a tarp, the middle under a white crust of lime with the shapes showing through, '
           'the east end the newest, not yet limed; the spoil heaped along the north lip, the lime in sacks, three more in sheets '
           'waiting on the south lip, the dozer parked at the end and a light tower for the night shift',
      tells='the living moved them: by the truckload, at night, under the light tower; nobody wrote the names down')
def dead_mass_grave():
    hx, hy, dp = 9.0, 1.8, 1.5
    soil, soil2, lime, lime2 = M('clay_mustard', 1), M('clay_rust', 1), M('clay_bone', 4), M('clay_bone', 3)
    B(soil, (2 * hx + 0.6, 2 * hy + 0.6, 0.12), (0, 0, -dp - 0.06), name='pit_floor')
    for sx in (-1, 1): B(soil2, (0.3, 2 * hy + 0.6, dp), (sx * (hx + 0.15), 0, -dp / 2), name='pit_wall')
    for sy in (-1, 1): B(soil if sy > 0 else soil2, (2 * hx + 0.6, 0.3, dp), (0, sy * (hy + 0.15), -dp / 2), name='pit_wall')
    for k in range(9): B(M('clay_mustard', 0), (2 * hx, 0.02, 0.06), (0, hy - 0.005, -0.15 - 0.15 * k), name='blade_marks')
    import random
    rnd = random.Random(121); bag, sheet = M('cloth_black', 2), M('clay_bone', 3)
    x = -hx + 0.5
    while x < hx - 0.4:                                                      # the dead laid crosswise, two deep along the trench
        for row, yc in enumerate((-0.85, 0.95)):
            m = bag if rnd.random() < 0.55 else sheet
            BAG(m, L=2.0, W=0.7, H=0.25, loc=(x + rnd.uniform(-0.08, 0.08), yc + rnd.uniform(-0.1, 0.1), -dp), rz=90 + rnd.uniform(-6, 6), sheet=(m is sheet), name='laid')
        x += 0.62
    # the west end under a tarp, the middle under lime, the east end the newest
    DRAPE(M('clay_teal', 2), [((-8.6, -1.6, -dp + 0.1), (-8.6, 1.6, -dp + 0.1), 0.2), ((-4.2, -1.6, -dp + 0.1), (-4.2, 1.6, -dp + 0.1), 0.2),
                             ((-6.4, -1.6, -dp + 0.1), (-6.4, 1.6, -dp + 0.1), 0.2)], -hx - 0.1, -3.6, -hy - 0.1, hy + 0.1, nx=40, ny=20, lift=0.05, slope=0.25, seed=122,
          base=-dp + 0.36, name='tarp')
    segs = []
    for xx in np.arange(-3.4, 4.6, 0.62):
        segs += [((xx, -1.6, -dp + 0.17), (xx, -0.1, -dp + 0.17), 0.17), ((xx, 0.1, -dp + 0.17), (xx, 1.7, -dp + 0.17), 0.17)]
    DRAPE(lime, segs, -3.6, 4.7, -hy, hy, nx=70, ny=24, lift=0.025, slope=0.5, seed=123, base=-dp + 0.2, name='lime')
    for k in range(18): B(lime2, (rnd.uniform(0.4, 1.2), rnd.uniform(0.3, 0.8), 0.02), (rnd.uniform(4.6, 8.6), rnd.uniform(-1.5, 1.5), -dp + 0.27), rot=(0, 0, rnd.uniform(0, 3)), name='lime_dust')
    # the spoil along the north lip, the lime sacks, the three waiting, the dozer, the light tower
    ridge = [(-9.8, 2.2, 0.35), (-7.5, 2.0, 0.95), (-5.2, 2.4, 0.7), (-2.6, 2.1, 1.1), (0.0, 2.5, 0.8), (2.6, 2.2, 1.15), (5.0, 2.0, 0.75), (7.4, 2.3, 1.05), (9.4, 2.2, 0.4)]
    DRAPE(M('clay_mustard', 1), [((x0, hy + y0, z0), (x1, hy + y1, z1), 0.35) for (x0, y0, z0), (x1, y1, z1) in zip(ridge, ridge[1:])],
          -10.8, 10.4, hy + 0.15, hy + 4.4, nx=110, ny=26, lift=0.0, slope=0.95, seed=124, name='spoil_berm')
    import bohemia_cook_model_props as PM
    for k in range(12):
        OBJS.append(PM.sack(bpy, 'lime_sack', lime, (0.6, 0.4, 0.16), (10.4 + 0.65 * (k % 3), -2.6 + 0.45 * ((k // 3) % 2), 0.08 + 0.16 * (k // 6)), (0, 0, 0.05 * k), rnd))
    B(M('tape_masking', 1), (2.1, 1.0, 0.14), (11.05, -2.38, 0.0), name='pallet')
    for k in range(3): BAG(sheet, L=1.95, W=0.72, H=0.25, loc=(-2.0 + k * 0.95, -hy - 1.25, 0.0), rz=90 + 4 * (k - 1), sheet=True, name='waiting')
    d = MARK(); IMPORT('dozer.glb'); MOVE(d, loc=(12.6, 0.9, 0), rot=(0, 0, math.radians(180)))
    lt = M('metal_painted', 2)
    B(M('metal_painted', 2), (1.8, 1.0, 0.7), (-11.0, -2.8, 0.75), name='light_tower_trailer')
    for sx in (-1, 1):
        for sy in (-1, 1): ROD(lt, (-11.0 + sx * 0.9, -2.8 + sy * 0.4, 0.6), (-11.0 + sx * 1.6, -2.8 + sy * 1.1, 0.0), 0.03, 4, name='outrigger')
    ROD(lt, (-11.0, -2.8, 1.2), (-11.0, -2.8, 7.5), 0.07, 6, name='mast')
    B(lt, (1.4, 0.15, 0.6), (-11.0, -2.9, 7.6), name='lamp_bar')
    for k in range(4): B(M('clay_bone', 4), (0.3, 0.06, 0.25), (-11.5 + 0.33 * k, -2.98, 7.6), name='lamp_dead')


@dead('dead.coat_fence', 'A COAT ON A FENCE', 'blocking', 'COVER', '#', 'nobody', see=True,
      what='the kit\'s chain-link run, and on it a long black coat hung by its collar at a man\'s shoulder height, its sleeves '
           'pinned out along the wire, a wide hat on a stick pushed through the mesh where the head would be, and a pair of '
           'boots standing on the ground under the hem, toes out',
      tells='nobody explains it: somebody hung it there, and nobody has taken it down',
      wrong='it is almost a man: the boots are laced, and there is nobody in them')
def dead_coat_fence():
    IMPORT('fence.glb')
    coat, coat2 = M('cloth_black', 2), M('cloth_black', 3)
    y = 0.08 - 0.12 - 0.11
    SOFT(coat, (0.0, y, 0.82), (0.0, y, 1.5), 0.47, 0.19, (0, -1, 0), pw=0.6, name='coat_body')
    SOFT(coat2, (0.0, y - 0.01, 0.42), (0.0, y, 0.95), 0.6, 0.16, (0, -1, 0), pw=0.55, taper=0.25, name='coat_skirt')
    ROD(coat, (-0.26, y, 1.45), (0.26, y, 1.45), 0.075, 6, name='shoulders')
    for s in (-1, 1):
        LIMB(coat, (s * 0.25, y, 1.43), (s * 0.5, y + 0.02, 1.12), 0.062, 0.055, name='sleeve_upper')
        LIMB(coat, (s * 0.5, y + 0.02, 1.12), (s * 0.58, y + 0.02, 0.84), 0.055, 0.05, name='sleeve_lower')
        B(M('tape_grey', 3), (0.03, 0.04, 0.05), (s * 0.58, y + 0.06, 0.84), name='wire_tie')
    LIMB(coat2, (-0.12, y + 0.02, 1.53), (0.12, y + 0.02, 1.53), 0.045, 0.045, name='collar_up')
    ROD(M('tape_masking', 1), (0.0, 0.05, 1.5), (0.0, y, 1.78), 0.012, 4, name='stick_through_the_mesh')
    C(M('cloth_black', 1), 0.21, 0.016, (0.0, y, 1.79), (math.radians(6), 0, 0), v=18, name='hat_brim')
    C(M('cloth_black', 1), 0.1, 0.12, (0.0, y, 1.86), (math.radians(6), 0, 0), v=12, r2=0.09, name='hat_crown')
    for s in (-1, 1):
        SOFT(M('rubber', 1), (s * 0.1, y + 0.02, 0.06), (s * 0.15, y - 0.24, 0.05), 0.11, 0.11, (0, 0, 1), pw=0.55, name='boot')
        LIMB(M('rubber', 1), (s * 0.1, y + 0.04, 0.06), (s * 0.1, y + 0.04, 0.3), 0.06, 0.058, ends=False, name='boot_shaft')
        for k in range(3): B(M('clay_bone', 2), (0.08, 0.012, 0.01), (s * 0.1, y - 0.03, 0.14 + 0.05 * k), name='laces')


@dead('dead.bench', 'A MAN ON A BUS BENCH', 'none', 'NONE', '.', 'nobody', flies=True,
      what='a bus stop on a street nobody is left on: its bench, its shelter\'s roof and its dead ad panel; a man sitting on the bench '
           'as if waiting for a bus that stopped running, chin on his chest, his hat tipped over his face, his hands in his lap',
      tells='nobody moved him: nobody is left on this street to')
def dead_bench():
    fr, sl, gl = M('tape_grey', 2), M('clay_mustard', 2), M('cloth_black', 1)
    for x in (-0.85, 0.85):
        B(fr, (0.06, 0.45, 0.06), (x, 0.0, 0.42), name='bench_frame'); BAR(fr, (x, -0.1, 0.0), (x, -0.1, 0.42), 0.05, name='bench_leg'); BAR(fr, (x, 0.2, 0.0), (x, 0.2, 0.42), 0.05, name='bench_leg')
    for k in range(3): B(sl, (1.9, 0.13, 0.04), (0, -0.15 + 0.15 * k, 0.46), name='slat')
    for k in range(2): B(sl, (1.9, 0.04, 0.12), (0, 0.26, 0.68 + 0.16 * k), rot=(math.radians(-10), 0, 0), name='back_slat')
    for x in (-1.2, 1.2): C(fr, 0.04, 2.5, (x, 0.55, 1.25), v=8, name='shelter_post')
    B(M('metal_painted', 2), (2.8, 1.5, 0.08), (0, 0.15, 2.52), rot=(math.radians(-4), 0, 0), name='shelter_roof')
    B(fr, (1.2, 0.08, 1.9), (1.85, 0.55, 1.15), name='ad_frame'); B(gl, (1.05, 0.04, 1.7), (1.85, 0.5, 1.15), name='ad_glass_gone')
    B(M('clay_bone', 3), (0.9, 0.02, 1.2), (1.85, 0.47, 1.25), name='ad_poster_bleached'); B(M('clay_rust', 2), (0.5, 0.02, 0.35), (1.8, 0.455, 1.45), name='ad_poster_face')
    J = dict(head=(0.15, -0.05, 1.03), neck=(0.15, 0.07, 0.96), pelvis=(0.15, 0.06, 0.52), front=(0, -1, 0.05), face=(0, -0.5, -0.85), crown=(0, -0.45, 0.9),
             sL=(0.34, 0.11, 0.9), sR=(-0.04, 0.11, 0.9), eL=(0.37, -0.02, 0.66), eR=(-0.07, -0.02, 0.66),
             hL=(0.22, -0.2, 0.57), hR=(0.08, -0.22, 0.56), hipL=(0.25, 0.04, 0.52), hipR=(0.05, 0.04, 0.52),
             kL=(0.28, -0.4, 0.54), kR=(0.03, -0.4, 0.54), aL=(0.18, -0.82, 0.11), aR=(0.1, -0.8, 0.15),
             toeL=(0.2, -0.95, 0.3), toeR=(0.1, -0.92, 0.36), palm_L=(0, 0, 1), palm_R=(0, 0, 1))
    PERSON(J, 'bone_shirt', hat='brim', seed=12)
    FLIES((0.15, -0.1, 0.7), n=9, spread=(0.5, 0.4), z=(0.1, 0.5), seed=121)


ORDER = ['dead.tarp', 'dead.doorway', 'dead.bag_row', 'dead.car_driver', 'dead.desert_skeleton', 'dead.bones', 'dead.grave_cross',
         'dead.grave_row', 'dead.sidewalk', 'dead.cart', 'dead.mass_grave', 'dead.coat_fence', 'dead.bench']


# ======================================================================================================================
# THE LONE SHOT: COOK PROPS' shot, the catcher cut to every pit the piece has (a grave dug, the trench)
# ======================================================================================================================
def shot(o, fn, holes=(), samples=64):
    sc = bpy.context.scene
    co = np.zeros(len(o.data.vertices) * 3, np.float32); o.data.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
    co_g = co[co[:, 2] > -0.05]                                                # what stands above the ground frames the shot
    lo, hi = co_g.min(0).astype(float), co_g.max(0).astype(float)
    RIG = CP.rig_scene([o])
    t = math.radians(TILT); h = float(hi[2])
    reach = h * 0.9 + 1.0
    sx0, sx1 = lo[0] - 0.6, hi[0] + 0.6 + reach
    sy0, sy1 = lo[1] * math.cos(t) - 0.6 - reach * 0.7, hi[1] * math.cos(t) + h + 0.6
    bpy.ops.mesh.primitive_plane_add(size=1, location=((sx0 + sx1) / 2, (lo[1] + hi[1]) / 2 - reach * 0.5, 0.0))
    pl = bpy.context.active_object; pl.scale = ((sx1 - sx0) * 1.6, (hi[1] - lo[1]) + 2 * reach + 6, 1); pl.is_shadow_catcher = True
    if holes:
        import bmesh
        bpy.ops.object.transform_apply(location=True, scale=True)
        bm = bmesh.new(); bm.from_mesh(pl.data)
        bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=160, use_grid_fill=True)
        kill = [f for f in bm.faces if any(abs(f.calc_center_median().x - cx) < hx and abs(f.calc_center_median().y - cy) < hy for (cx, cy, hx, hy) in holes)]
        bmesh.ops.delete(bm, geom=kill, context='FACES'); bm.to_mesh(pl.data); bm.free()
    RIG.light_and_film(sc, dict(sun_rot=list(RIG.G['sun_rot_deg']))); sc.render.film_transparent = True
    sc.cycles.samples = samples; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    W, H, X0, Y1 = CP.camera_on(sc, sx0, sx1, sy0, sy1)
    sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
    return dict(origin_px=[round((0 - X0) * PPM, 1), round((Y1 - 0) * PPM, 1)], size_m=[round(float(v), 2) for v in (hi - lo)],
                bounds_m=[[round(float(v), 2) for v in lo], [round(float(v), 2) for v in hi]],
                depth_m=round(float(-co[:, 2].min()), 2) if co[:, 2].min() < -0.1 else 0.0)


def models(ids):
    global bpy, mu
    import bpy as _b, mathutils as _m
    bpy, mu = _b, _m; CP.bpy, CP.mu = _b, _m
    from PIL import Image
    os.makedirs(MODELS, exist_ok=True); os.makedirs(OUT, exist_ok=True); os.makedirs(RAW, exist_ok=True)
    led_fn = os.path.join(OUT, 'ledger.json'); L = json.load(open(led_fn)) if os.path.exists(led_fn) else {}
    for pid in (ids or ORDER):
        t0 = time.time(); CP.reset(); OBJS.clear()
        DEAD[pid]['fn']()
        stem = pid.split('.')[1]
        o = CP.join(stem)
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True)
        glb = os.path.join(MODELS, stem + '.glb')
        bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_apply=True, export_extras=True)
        nv, nmat = len(o.data.vertices), len(o.data.materials)
        raw = os.path.join(RAW, stem + '.png')
        info = shot(o, raw, DEAD[pid]['holes'])
        a = Image.open(raw).convert('RGBA'); bb = a.getchannel('A').point(lambda v: 255 if v > 6 else 0).getbbox()
        a = a.crop(bb); pic = os.path.join(OUT, stem + '.webp'); a.save(pic, quality=90, method=6)
        info.update(model=os.path.relpath(glb, R), picture=os.path.relpath(pic, R), picture_px=list(a.size),
                    anchor_px=[round(info['origin_px'][0] - bb[0], 1), round(info['origin_px'][1] - bb[1], 1)],
                    verts=nv, materials=nmat, glb_kb=os.path.getsize(glb) // 1024, seconds=round(time.time() - t0))
        info.pop('origin_px')
        L[pid] = info
        json.dump(L, open(led_fn, 'w'), indent=1)
        print('  %-22s %5.1f x %5.1f x %4.1f m  %6d verts  %4d KB  %s px  %ds' % (pid, *info['size_m'], nv, info['glb_kb'], a.size, info['seconds']), flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'models': models(a[1:])
    elif a[0] == 'manifest':
        import bohemia_cook_dead_card_11_3_26 as K; K.manifest()
    elif a[0] == 'card':
        import bohemia_cook_dead_card_11_3_26 as K; K.card()
    sys.stdout.flush(); os._exit(0)
