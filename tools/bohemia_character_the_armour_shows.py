#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the armour he wears shows] (rule 272, Paolo 10/26, LOCKED: 'the weapons and the shield show, but the
good armour I have on me doesn't show, like a police helmet... I know it's a lot of placeholder, we're gonna have to cook up so
much art... it's not visually shown'; records/BOHEMIA_PAOLO_ALL_EIGHTEEN_FOLLOWERS_TAPE_THAT_KEEPS_A_RUN_ALIVE_AND_THE_ARMOUR_SHOWS_10_26_26.md).

NOTHING HE WEARS IS INVISIBLE. Every helmet and body armour row of records/target/bb/armor.json is sorted into a CLASS by the
object its own display name says it is (records/target/bb/armour_names.json: 'a nose-guard riot helmet', 'a basic plate
carrier'), and every class is a PLACEHOLDER PIECE modelled at the source and rendered in the rig's look (rule 115): a small
model in real proportion to the rig's man, under the master rig's own camera (orthographic, tilted 45 from straight down,
facing north, the model's height stretched 1/cos 45, 57 pixels a metre), the style guide's one sun from the upper left
(sun_rot_deg), its sky fill, roughness 1, no shine, the paint chalky (paint_sat_mul), grain in the surface, the silhouette's
outer pixel ring darker, the hard alpha edge (alpha_threshold); turned through the eight facings the fight draws (S SE E NE N
NW W SW). The man's own head and body are HOLDOUTS: they hide the back of a piece and leave his own pixels (a face under a
visor, the face in a hood) to show through, so the piece sits ON him.

Blender is not on this box and nothing may be installed, so this is the rig's recipe run by a small ray marcher in numpy over
signed-distance models, not DIRECTION's master rig in Blender: a placeholder, said so on every card. COOK makes each named
piece's own art over the rounds through the master rig ([the armour's art]); a class's sheet is replaced file for file.

    python3 tools/bohemia_character_the_armour_shows.py classes   # records/target/bb/armour_looks.json (every row's class)
    python3 tools/bohemia_character_the_armour_shows.py render    # slices/wear/wear.webp + wear.json (8 facings, the dropped
                                                                    # helmet, the portrait's front) for every class in use
    python3 tools/bohemia_character_the_armour_shows.py all

The game draws them with engine/bohemia_wear.js (the head and the chest found on whatever picture of him is on the glass).
"""
import json, math, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAMES = os.path.join(ROOT, 'records/target/bb/armour_names.json')
ARMOR = os.path.join(ROOT, 'records/target/bb/armor.json')
LOOKS = os.path.join(ROOT, 'records/target/bb/armour_looks.json')
GUIDE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')
OUT = os.path.join(ROOT, 'slices/wear')
DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
HEAD_R = 12.5   # the rig's man: his head 25 px across at the fight's 57 ppm (measured on all 26 crew and gang looks, S, 24-26)

# ---------------------------------------------------------------------------------------------------------------- classes
HEAD_CLASSES = {
    'riot_helmet': 'a police riot helmet: a black dome, its clear face shield down, a neck guard behind',
    'moto_helmet': 'a full-face motorcycle helmet: a scuffed oxblood shell, a smoked visor, the chin bar, one pale stripe',
    'welder_mask': "a welder's mask: a flat scorched face plate with its dark lens, on a head harness",
    'hard_hat': 'a hard hat: a chalky safety-yellow dome with a ridge and a peaked brim',
    'brim_helmet': 'an old army steel pot: an olive dome with a brim all round',
    'chain_hood': 'a hood of chain: grey links over the head and the shoulders, the face open',
    'gas_mask': 'a gas mask: olive rubber over the face, two round lenses, the filter can at the mouth',
    'rag_hood': 'a rag hood: grey cloth over the head and down the back, the face open',
    'straw_hat': 'a straw hat: a crown and a wide sun brim',
    'bandana': 'a bandana: a faded red band tied round the head, the knot and its tails behind',
    'dust_mask': 'a dust mask: a dirty white cloth over the nose and the mouth, tied behind',
}
BODY_CLASSES = {
    'police_vest': 'a police vest: a navy-black plate carrier, a pale band across the chest and the back, pouches at the belly',
    'riot_armour': 'full riot armour: a black chest plate, big shoulder pads, a collar',
    'car_door': 'a car door strapped on: a faded red door panel on his chest, its window frame and handle, straps over the shoulders',
    'plated_jacket': 'a plated jacket: grey metal scales sewn in rows over a leather jacket, shoulder caps',
    'padded_vest': 'a padded vest: a quilted olive vest, bulky, the quilting in bands',
    'work_jacket': 'a work jacket: brown duck canvas, a standing collar, pocket flaps, the sleeves capped',
}


def head_class(rid, name):
    n = name.lower()
    feats = []
    if 'spiked' in n: feats.append('spike')
    if 'horned' in n: feats.append('horns')
    if 'gas-mask' in n: return 'gas_mask', feats
    if 'dust-mask' in n: return 'dust_mask', feats
    if 'bandana' in n or 'headband' in n: return 'bandana', feats
    if 'straw' in n: return 'straw_hat', feats
    if 'rag hood' in n: return 'rag_hood', feats
    if 'hard hat' in n: return ('chain_hood' if 'chain' in n else 'hard_hat'), feats
    if 'riot helmet' in n or 'riot helm' in n:
        full = 'full riot helm' in n
        if 'closed-chain' in n or 'closed chain' in n: feats.append('chain_closed')
        elif 'chain' in n and 'chain-hood' not in n and 'heavy chain' not in n: feats.append('chain')
        if 'visor' in n or 'bucket' in n: return 'welder_mask', feats
        if 'wide-brim' in n: return 'brim_helmet', feats
        if 'chain-hood' in n or 'heavy chain' in n: return 'chain_hood', [f for f in feats if f not in ('chain', 'chain_closed')]
        return ('moto_helmet' if full else 'riot_helmet'), feats
    return 'rag_hood', feats


def body_class(rid, name):
    n = name.lower()
    feats = ['chain'] if ('chain' in n and 'chain-and-belt' not in n) else []
    if 'work jacket' in n: return 'work_jacket', []
    if 'scrap-metal' in n or 'heavy iron' in n or 'plate-coat' in n: return 'car_door', feats
    if 'padded vest' in n: return 'padded_vest', feats
    if 'scale' in n or 'plated' in n or 'belt-plate' in n or 'chain-and-belt' in n or 'belt-leather' in n: return 'plated_jacket', feats
    if 'plate carrier' in n: return 'police_vest', feats
    if 'full riot armour' in n: return 'riot_armour', feats
    return 'work_jacket', []


def classes():
    names = json.load(open(NAMES))
    armor = json.load(open(ARMOR))
    out = {
        '_about': ("CHARACTER [the armour he wears shows], rule 272 (Paolo 10/26: 'the good armour I have on me doesn't show, like a "
                   "police helmet'). Every head and body row of armor.json drawn as the object its display name says it is "
                   "(armour_names.json): 'class' picks the placeholder piece engine/bohemia_wear.js draws on the man who wears "
                   "it (crew card, fight, map, camp, portrait), 'feats' its extras (spike, horns, chain, chain_closed). Written "
                   "by tools/bohemia_character_the_armour_shows.py classes from the names; a modder may change any row's class "
                   "to any key of head_classes or body_classes, and COOK's own art for a class replaces its sheet."),
        'draft': True, 'rule': 272, 'lane': 'character',
        'head_classes': HEAD_CLASSES, 'body_classes': BODY_CLASSES,
        'head': {}, 'body': {}}
    for r in armor['head']:
        nm = names['head'].get(r['id'], r['name'])
        c, f = head_class(r['id'], nm)
        out['head'][r['id']] = dict(name=nm, **{'class': c}, **({'feats': f} if f else {}))
    for r in armor['body']:
        nm = names['body'].get(r['id'], r['name'])
        c, f = body_class(r['id'], nm)
        out['body'][r['id']] = dict(name=nm, **{'class': c}, **({'feats': f} if f else {}))
    cnt = {}
    for k in ('head', 'body'):
        for v in out[k].values(): cnt[v['class']] = cnt.get(v['class'], 0) + 1
    out['_counts'] = cnt
    json.dump(out, open(LOOKS, 'w'), indent=1)
    print('classes:', json.dumps(cnt))
    return out


# ------------------------------------------------------------------------------------------------------------- the models
def V(*a): return np.array(a, dtype=np.float64)


def length(p): return np.sqrt((p * p).sum(-1))


def sph(c, r): return lambda p: length(p - c) - r


def ell(c, rad):
    rad = np.asarray(rad, float)
    def f(p):
        q = (p - c) / rad
        k0 = length(q); k1 = length(q / rad)
        return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)
    return f


def rbox(c, half, rr=0.0):
    half = np.asarray(half, float)
    def f(p):
        q = np.abs(p - c) - half + rr
        return length(np.maximum(q, 0)) + np.minimum(q.max(-1), 0) - rr
    return f


def capsule(a, b, r0, r1=None):
    r1 = r0 if r1 is None else r1
    ba = b - a; bb = (ba * ba).sum()
    def f(p):
        pa = p - a
        h = np.clip((pa * ba).sum(-1) / bb, 0, 1)
        return length(pa - h[..., None] * ba) - (r0 + (r1 - r0) * h)
    return f


def cyl_y(c, r, half):     # a disc or can along the forward axis
    def f(p):
        q = p - c
        d = np.stack([np.sqrt(q[..., 0] ** 2 + q[..., 2] ** 2) - r, np.abs(q[..., 1]) - half], -1)
        return np.minimum(np.maximum(d[..., 0], d[..., 1]), 0) + length(np.maximum(d, 0))
    return f


def cyl_x(c, r, half):     # along the sideways axis
    def f(p):
        q = p - c
        d = np.stack([np.sqrt(q[..., 1] ** 2 + q[..., 2] ** 2) - r, np.abs(q[..., 0]) - half], -1)
        return np.minimum(np.maximum(d[..., 0], d[..., 1]), 0) + length(np.maximum(d, 0))
    return f


def torus_z(c, R, r):
    def f(p):
        q = p - c
        a = np.sqrt(q[..., 0] ** 2 + q[..., 1] ** 2) - R
        return np.sqrt(a * a + q[..., 2] ** 2) - r
    return f


def U(*fs): return lambda p: np.min(np.stack([f(p) for f in fs], 0), 0)


def I(*fs): return lambda p: np.max(np.stack([f(p) for f in fs], 0), 0)


def S(a, b): return lambda p: np.maximum(a(p), -b(p))


def above(z): return lambda p: z - p[..., 2]          # keeps z > z0


def below(z): return lambda p: p[..., 2] - z          # keeps z < z0


def hexc(h):
    h = h.lstrip('#'); return V(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)) / 255.0


# a material: (rgb, alpha) for every point, from its local position (the pattern lives in the surface, never in the pixels)
def flat(h, alpha=1.0):
    c = hexc(h)
    return lambda p: (np.broadcast_to(c, p.shape).copy(), np.full(p.shape[:-1], alpha))


def where(test, a, b):
    def m(p):
        ca, aa = a(p); cb, ab = b(p); t = test(p)
        return np.where(t[..., None], ca, cb), np.where(t, aa, ab)
    return m


def chainmail(h):
    """links: a weave of dark gaps from the point's own place on the piece"""
    c = hexc(h)
    def m(p):
        k = np.sin(p[..., 0] * 1.9 + np.sin(p[..., 2] * 1.9) * 1.2) * np.sin(p[..., 2] * 1.9 + p[..., 1] * 0.7)
        return np.broadcast_to(c, p.shape) * np.where(k > 0.25, 0.62, 1.0)[..., None], np.ones(p.shape[:-1])
    return m


GLASS = 'glass'   # a material key: see-through, the man's own face under it


def head_parts(cls, feats):
    """[(sdf, material)] in the head's own frame: centre of his head at 0, x his left, -y the way he faces, z up (the stretched
    space the rig renders in: a sphere draws as a circle)"""
    P = []
    if cls == 'riot_helmet':
        shell = I(sph(V(0, 0.6, 1.4), 14.2), lambda p: (-6.5 - 0.33 * p[..., 1]) - p[..., 2])
        P.append((shell, flat('#323741')))
        rim = I(torus_z(V(0, 0.6, -2.6), 13.6, 1.25), lambda p: p[..., 1] - 2.0)
        P.append((rim, flat('#1c1e22')))
        brow = I(sph(V(0, 0.6, 1.4), 14.9), S(lambda p: np.abs(p[..., 2] - 2.6) - 1.4, lambda p: p[..., 1] - (-3.0)))
        P.append((I(brow, lambda p: p[..., 1] + 3.0), flat('#16181b')))
        visor = I(lambda p: np.abs(length(p - V(0, 0.4, 0.6)) - 15.6) - 0.55, lambda p: p[..., 1] + 3.5,
                  lambda p: p[..., 2] - 2.4, lambda p: -13.0 - p[..., 2], lambda p: np.abs(p[..., 0]) - 12.8)
        P.append((visor, GLASS))
        frame = I(lambda p: np.abs(length(p - V(0, 0.4, 0.6)) - 15.6) - 0.75, lambda p: p[..., 1] + 3.5,
                  lambda p: np.maximum(p[..., 2] - 2.4, -13.0 - p[..., 2]), lambda p: np.abs(p[..., 0]) - 12.8,
                  lambda p: np.minimum(np.minimum(np.abs(p[..., 2] - 2.4), np.abs(p[..., 2] + 13.0)), np.abs(np.abs(p[..., 0]) - 12.8)) - 1.0)   # the shield's rim only
        P.append((frame, flat('#555b63')))
        for sx in (-1, 1):
            P.append((cyl_x(V(sx * 14.6, -1.5, 1.2), 2.0, 1.0), flat('#3c4047')))
        guard = I(lambda p: np.abs(length(p - V(0, 0.6, 1.4)) - 14.4) - 0.9, lambda p: 3.5 - p[..., 1],
                  lambda p: p[..., 2] - (-6.0), lambda p: -15.5 - p[..., 2])
        P.append((guard, flat('#24221f')))
        decal = I(sph(V(0, 0.6, 1.4), 14.35), lambda p: np.abs(p[..., 2] - 7.5) - 1.6, lambda p: -p[..., 1] - 3.0, lambda p: np.abs(p[..., 0]) - 3.2)
        P.append((decal, flat('#a9a79c')))
    elif cls == 'moto_helmet':
        shell = I(ell(V(0, 0.8, -0.5), (15.2, 15.8, 15.6)), above(-15.0))
        stripe = lambda p: (np.abs(p[..., 0]) < 1.5) & (p[..., 2] > 2.0)
        P.append((shell, where(stripe, flat('#b3ab98'), flat('#6a302b'))))
        visor = I(ell(V(0, 0.6, -0.5), (14.4, 16.6, 14.8)), lambda p: p[..., 1] + 6.0, lambda p: np.abs(p[..., 2] + 1.5) - 5.2,
                  lambda p: np.abs(p[..., 0]) - 11.5)
        P.append((visor, where(lambda p: (p[..., 0] - p[..., 2] * 0.8 > 2.5) & (p[..., 0] - p[..., 2] * 0.8 < 4.5), flat('#4d5560'), flat('#15171b'))))
        P.append((ell(V(0, -11.5, -10.5), (10.5, 5.5, 4.6)), flat('#5a2925')))
    elif cls == 'welder_mask':
        def plate(p):
            q = p.copy(); q[..., 1] = q[..., 1] - 0.034 * q[..., 0] ** 2      # the plate bends round his face
            return rbox(V(0, -13.0, -2.5), (12.6, 2.2, 13.6), 2.2)(q)
        lens = lambda p: (np.abs(p[..., 0]) < 6.6) & (np.abs(p[..., 2] - 2.6) < 2.4) & (p[..., 1] < -12.0)
        scorch = lambda p: noise3(p, 0.35) > 0.62
        P.append((plate, where(lens, flat('#101a13'), where(scorch, flat('#24231f'), flat('#3d3f35')))))
        P.append((I(torus_z(V(0, 0.6, 4.6), 13.6, 1.5), lambda p: p[..., 1] + 9.5), flat('#2a2925')))     # the head band
        for sx in (-1, 1):
            P.append((cyl_x(V(sx * 13.6, -3.5, 1.5), 3.0, 1.3), flat('#57574c')))                            # the pivot knobs
    elif cls == 'hard_hat':
        dome = I(ell(V(0, 0.6, 2.4), (13.6, 14.6, 12.6)), above(-1.6))
        P.append((dome, flat('#b09846')))
        P.append((I(ell(V(0, 0.6, 2.4), (2.0, 14.9, 13.4)), above(-1.0)), flat('#a38b3c')))
        brim = U(ell(V(0, 0.6, -1.7), (15.0, 15.8, 1.4)), ell(V(0, -3.5, -1.5), (12.0, 17.2, 1.3)))
        P.append((brim, flat('#9e8840')))
    elif cls == 'brim_helmet':
        P.append((I(sph(V(0, 0.5, 2.0), 14.0), above(-2.8)), flat('#4e513e')))
        def brim(p):
            q = p.copy(); q[..., 2] = q[..., 2] + 0.012 * (q[..., 0] ** 2 + q[..., 1] ** 2)
            return ell(V(0, 0.5, -2.4), (20.0, 20.0, 1.25))(q)
        P.append((brim, flat('#464934')))
    elif cls == 'chain_hood':
        hood = S(sph(V(0, 1.0, 0.6), 14.6), rbox(V(0, -12.0, -3.0), (8.8, 8.0, 8.5), 3.0))
        P.append((U(hood, ell(V(0, 4.0, -14.0), (14.0, 11.0, 7.5))), chainmail('#6e706b')))
    elif cls == 'gas_mask':
        P.append((ell(V(0, -9.6, -3.6), (10.2, 5.6, 10.8)), flat('#3d4033')))
        P.append((I(torus_z(V(0, 1.0, 1.6), 13.2, 1.05), lambda p: p[..., 1] + 6.0), flat('#2b2c26')))
        for sx in (-1, 1):
            ring = lambda p, sx=sx: np.sqrt((p[..., 0] - sx * 5.0) ** 2 + (p[..., 2] - 1.6) ** 2)
            P.append((cyl_y(V(sx * 5.0, -13.6, 1.6), 3.8, 0.9), lambda p, ring=ring: (np.where((ring(p) > 2.7)[..., None], hexc('#6b6a5c'), hexc('#161a1c')), np.ones(p.shape[:-1]))))
        can = capsule(V(0, -13.5, -8.0), V(0, -19.0, -12.0), 3.6)
        P.append((can, where(lambda p: (np.abs(((p[..., 1] + p[..., 2]) * 0.7) % 2.2) < 0.5), flat('#2f3127'), flat('#55573f'))))
    elif cls == 'rag_hood':
        hood = S(sph(V(0, 1.3, 0.8), 14.9), rbox(V(0, -12.0, -3.4), (8.6, 8.0, 9.0), 3.2))
        P.append((U(hood, ell(V(0, 5.0, -14.5), (13.6, 10.0, 8.5))), flat('#56534a')))
    elif cls == 'straw_hat':
        P.append((I(ell(V(0, 0.6, 6.6), (13.4, 13.4, 9.6)), above(2.4)), flat('#a38d60')))   # the crown fits his big head
        P.append((I(ell(V(0, 0.6, 6.6), (13.7, 13.7, 9.9)), lambda p: np.abs(p[..., 2] - 4.6) - 1.3), flat('#4a3626')))
        def brim(p):
            q = p.copy(); q[..., 2] = q[..., 2] + 0.010 * (q[..., 0] ** 2 + q[..., 1] ** 2)
            return ell(V(0, 0.6, 2.9), (23.5, 23.5, 1.25))(q)
        P.append((brim, flat('#988354')))
    elif cls == 'bandana':
        band = I(lambda p: np.abs(length(p - V(0, 0.3, 0.0)) - 13.0) - 0.9, lambda p: np.abs(p[..., 2] - 4.6) - 2.8)
        P.append((band, flat('#7d3b31')))
        P.append((sph(V(0, 13.2, 4.4), 2.6), flat('#6f342b')))
        for sx in (-1, 1):
            P.append((capsule(V(sx * 1.2, 13.6, 3.2), V(sx * 3.4, 15.8, -4.5), 1.6, 1.0), flat('#6f342b')))
    elif cls == 'dust_mask':
        P.append((I(ell(V(0, -10.6, -5.0), (10.4, 4.8, 7.0)), lambda p: p[..., 1] + 6.5), flat('#8d8673')))
        P.append((torus_z(V(0, 0.6, -3.6), 12.9, 0.85), flat('#8f887a')))   # the ties, round behind his head
    if 'spike' in feats:
        P.append((capsule(V(0, 0.4, 13.5), V(0, 0.4, 21.0), 2.6, 0.3), flat('#77736a')))
    if 'horns' in feats:
        for sx in (-1, 1):
            P.append((capsule(V(sx * 12.0, -0.5, 5.0), V(sx * 18.0, -3.0, 15.0), 2.6, 0.5), flat('#b3a688')))
    if 'chain' in feats or 'chain_closed' in feats:
        curtain = I(lambda p: np.abs(np.sqrt(p[..., 0] ** 2 + (p[..., 1] - 0.8) ** 2) - 13.8) - 1.1, below(-5.5), above(-16.5))
        if 'chain' in feats: curtain = I(curtain, lambda p: -p[..., 1] - 4.0)
        P.append((curtain, chainmail('#6e706b')))
    return P


TORSO_TOP = -19.0      # under his chin, in the stretched space (the neck pinches 16 px under the head's centre on the glass)


def body_parts(cls, feats):
    P = []
    zc = -42.0
    if cls == 'police_vest':
        shell = S(rbox(V(0, 0.2, zc), (10.4, 8.4, 16.0), 4.0), sph(V(0, 0, TORSO_TOP + 1), 7.5))   # the neck hole
        band = lambda p: (np.abs(p[..., 2] - (zc + 7.5)) < 2.2) & (np.abs(p[..., 1]) > 5.0)
        P.append((shell, where(band, flat('#a8a69c'), flat('#22252b'))))
        for sx in (-1, 1):
            P.append((rbox(V(sx * 6.0, 0.2, TORSO_TOP - 5.0), (2.2, 8.6, 1.6), 0.8), flat('#1b1d21')))
        for x in (-6.0, 0.0, 6.0):
            P.append((rbox(V(x, -8.8, zc - 9.0), (2.4, 1.4, 3.0), 0.6), flat('#2c3036')))
    elif cls == 'riot_armour':
        P.append((rbox(V(0, 0.2, zc + 1), (10.6, 8.8, 15.5), 4.5), flat('#202226')))
        for sx in (-1, 1):
            P.append((I(ell(V(sx * 11.8, 0.2, TORSO_TOP - 8.5), (6.4, 7.6, 6.0)), above(TORSO_TOP - 14.0)), flat('#2e3137')))
            P.append((I(ell(V(sx * 12.4, 0.2, TORSO_TOP - 13.0), (5.6, 7.0, 4.0)), above(TORSO_TOP - 18.0)), flat('#26282d')))
        P.append((I(torus_z(V(0, 0.4, TORSO_TOP - 1.5), 7.6, 2.4), above(TORSO_TOP - 4.0)), flat('#18191c')))
        P.append((rbox(V(0, -8.9, zc + 2.0), (6.0, 0.9, 6.0), 1.5), flat('#33363c')))
    elif cls == 'car_door':
        def panel(p):
            q = p.copy(); q[..., 1] = q[..., 1] + 0.02 * q[..., 0] ** 2
            return rbox(V(0, -9.8, zc + 1.0), (12.8, 1.3, 17.0), 1.5)(q)
        win = lambda p: (p[..., 2] > zc + 7.6) & (np.abs(p[..., 0]) < 10.2)            # the window: dark glass in its frame
        frame = lambda p: (p[..., 2] > zc + 6.6) & ~((p[..., 2] > zc + 7.6) & (p[..., 2] < zc + 16.4) & (np.abs(p[..., 0]) < 10.2))
        crease = lambda p: np.abs(p[..., 2] - (zc - 2.0)) < 0.8
        rust = lambda p: noise3(p, 0.22) > 0.6
        body = where(crease, flat('#77705f'), where(rust, flat('#7a4a34'), flat('#a49d8a')))  # a pale old sedan's door, rust coming through
        P.append((panel, where(frame, flat('#5f5d57'), where(win, flat('#1d2326'), body))))
        P.append((rbox(V(7.0, -11.4, zc + 4.0), (2.6, 0.8, 0.9), 0.4), flat('#2a2723')))
        for sx in (-1, 1):
            P.append((rbox(V(sx * 7.2, -0.8, TORSO_TOP - 3.6), (1.7, 9.6, 1.3), 0.6), flat('#2e2a24')))
        P.append((rbox(V(0, -9.0, zc - 7.0), (13.4, 1.6, 1.4), 0.5), flat('#2e2a24')))
    elif cls == 'plated_jacket':
        def scales(p):
            row = np.floor((p[..., 2] - zc) / 4.2)
            off = (row % 2) * 2.4
            u = ((p[..., 0] + off) % 4.8) / 4.8
            v = ((p[..., 2] - zc) % 4.2) / 4.2
            shade = 0.72 + 0.34 * v - 0.18 * np.abs(u - 0.5)
            gap = (u < 0.08) | (v < 0.12)
            c = hexc('#7b7972')[None] * np.where(gap, 0.55, shade)[..., None]
            return c.reshape(p.shape), np.ones(p.shape[:-1])
        P.append((rbox(V(0, 0.2, zc), (10.4, 8.4, 16.5), 4.0), scales))
        for sx in (-1, 1):
            P.append((I(ell(V(sx * 11.0, 0.2, TORSO_TOP - 8.0), (5.4, 7.0, 5.4)), above(TORSO_TOP - 13.0)), flat('#5d5148')))
    elif cls == 'padded_vest':
        def quilt(p):
            d = rbox(V(0, 0.2, zc), (10.9, 8.9, 16.0), 5.0)(p)
            return d + 0.55 * np.abs(np.sin((p[..., 2] - zc) * math.pi / 4.6))
        P.append((quilt, flat('#5a5a3f')))
    elif cls == 'work_jacket':
        P.append((rbox(V(0, 0.2, zc - 1.0), (10.0, 8.0, 17.5), 4.0), where(lambda p: (np.abs(p[..., 0]) < 0.6) & (p[..., 1] < -6.0), flat('#4a3a28'), flat('#7a5f40'))))
        P.append((I(torus_z(V(0, 0.4, TORSO_TOP - 0.5), 7.4, 2.0), above(TORSO_TOP - 3.0)), flat('#6b5236')))
        for sx in (-1, 1):
            P.append((ell(V(sx * 10.6, 0.2, TORSO_TOP - 10.0), (4.8, 6.2, 7.2)), flat('#725a3c')))
            P.append((rbox(V(sx * 4.6, -8.3, zc + 6.5), (3.0, 0.7, 2.0), 0.5), flat('#5e4930')))
    if 'chain' in feats:
        P.append((rbox(V(0, 0.2, zc - 17.0), (10.6, 8.6, 4.0), 3.5), chainmail('#6e706b')))   # the mail hem under it
    return P


def proxies(body=True):
    """his own head, neck and trunk: holdouts that hide what is behind them and leave his pixels to show"""
    P = [sph(V(0, 0, 0), HEAD_R - 0.4), capsule(V(0, 0.5, -8.0), V(0, 0.5, TORSO_TOP - 3.0), 5.8)]
    if body: P.append(rbox(V(0, 0.4, -42.0), (8.6, 6.8, 16.5), 4.0))
    return P


# --------------------------------------------------------------------------------------------------------------- the camera
def guide():
    g = json.load(open(GUIDE))['rig']
    rx, ry, rz = [math.radians(x) for x in g['sun_rot_deg']]
    v = np.array([0, 0, -1.0])
    Rx = np.array([[1, 0, 0], [0, math.cos(rx), -math.sin(rx)], [0, math.sin(rx), math.cos(rx)]])
    Rz = np.array([[math.cos(rz), -math.sin(rz), 0], [math.sin(rz), math.cos(rz), 0], [0, 0, 1]])
    d = Rz @ (Rx @ v)
    return dict(L=-d / np.linalg.norm(d), fill=np.array(g['fill_rgb']) * g['fill_strength'] / 0.35 * 0.38,
                sat=g['paint_sat_mul'], ring=g['ring'], alpha=g['alpha_threshold'], tilt=g['tilt_deg'])


def rotz(t):
    c, s = math.cos(t), math.sin(t)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1.0]])


def noise3(p, freq):
    q = p * freq
    i = np.floor(q); f = q - i
    def h(ix, iy, iz):
        n = (ix * 73856093 + iy * 19349663 + iz * 83492791).astype(np.int64) & 0x7fffffff
        n = (n ^ (n >> 13)) * 1274126177 & 0x7fffffff
        return (n & 0xffff) / 65535.0
    ix, iy, iz = i[..., 0].astype(np.int64), i[..., 1].astype(np.int64), i[..., 2].astype(np.int64)
    u = f * f * (3 - 2 * f)
    r = 0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (u[..., 0] if dx else 1 - u[..., 0]) * (u[..., 1] if dy else 1 - u[..., 1]) * (u[..., 2] if dz else 1 - u[..., 2])
                r = r + w * h(ix + dx, iy + dy, iz + dz)
    return r


def render(parts, holds, theta_deg, box, scale=1.0, ss=4, tilt=45.0, G=None, pre=None):
    """parts/holds in the model's frame; the model turned theta (CCW from above, S = 0); box = (x0, y0, x1, y1) on the glass in
    model units around the anchor (y down); scale pixels a unit; tilt from straight down, the master rig's way (45 the
    fight, 80 the portrait, nearly eye level). Returns an RGBA array."""
    G = G or guide()
    x0, y0, x1, y1 = box
    W = int(round((x1 - x0) * scale)); H = int(round((y1 - y0) * scale))
    t = math.radians(90.0 - tilt)      # the view's angle under the horizon
    Xs = np.array([1.0, 0, 0]); Us = np.array([0, math.sin(t), math.cos(t)]); Ds = np.array([0, math.cos(t), -math.sin(t)])
    R = rotz(math.radians(theta_deg)); Ri = R.T
    sx = x0 + (np.arange(W * ss) + 0.5) / (ss * scale); sy = y0 + (np.arange(H * ss) + 0.5) / (ss * scale)
    gx, gy = np.meshgrid(sx, sy)
    O = gx[..., None] * Xs + (-gy)[..., None] * Us - Ds * 80.0
    O = O.reshape(-1, 3); D = np.broadcast_to(Ds, O.shape)
    Ol = O @ Ri.T; Dl = D @ Ri.T          # into the model's frame (turning the world the other way)
    if pre: Ol = pre(Ol); Dl = pre(Dl, True)
    fs = [f for f, m in parts]; ms = [m for f, m in parts]
    def scene(p, skip_glass=False):
        ds = [f(p) for f in fs]
        if skip_glass: ds = [d if ms[i] != GLASS else np.full_like(d, 1e9) for i, d in enumerate(ds)]
        ds += [h(p) for h in holds]
        D_ = np.stack(ds, 0); k = D_.argmin(0)
        return D_.min(0), k
    def march(o, d, skip_glass=False, tmax=170.0):
        n = len(o); tt = np.zeros(n); hit = np.full(n, -1); alive = np.ones(n, bool)
        for _ in range(140):
            idx = np.nonzero(alive)[0]
            if not len(idx): break
            p = o[idx] + d[idx] * tt[idx, None]
            dd, k = scene(p, skip_glass)
            done = dd < 0.03
            hit[idx[done]] = k[done]
            tt[idx] += np.maximum(dd, 0.02)
            alive[idx[done | (tt[idx] > tmax)]] = False
        return tt, hit
    tt, hit = march(Ol, Dl)
    npart = len(parts)
    rgb = np.zeros((len(Ol), 3)); alpha = np.zeros(len(Ol))
    def shade(org, idx, tt_, kk):
        p = org[idx] + Dl[idx] * tt_[idx, None]
        e = 0.06
        nrm = np.zeros_like(p)
        for a in range(3):
            o = np.zeros(3); o[a] = e
            nrm[:, a] = scene(p + o)[0] - scene(p - o)[0]
        nrm /= np.maximum(length(nrm)[:, None], 1e-6)
        col = np.zeros_like(p); al = np.ones(len(p))
        for i in range(npart):
            sel = kk == i
            if not sel.any(): continue
            if ms[i] == GLASS:
                c = np.broadcast_to(hexc('#5d6b74'), (sel.sum(), 3)).copy(); a_ = np.full(sel.sum(), 0.30)
            else:
                c, a_ = ms[i](p[sel])
            col[sel] = c; al[sel] = a_
        nw = nrm @ R.T            # back to the world, where the sun is
        lam = np.clip(nw @ G['L'], 0, 1)
        # the shadow: what of him or the piece stands between the point and the sun
        so = (p + nrm * 0.35) @ R.T
        sd = np.broadcast_to(G['L'], so.shape)
        sl = so @ Ri.T; sdl = sd @ Ri.T
        if pre: sl = pre(sl); sdl = pre(sdl, True)
        st, sh = march(sl, sdl, skip_glass=True, tmax=40.0)
        lit = (sh < 0).astype(float)
        ao = np.clip(scene(p + nrm * 1.6, True)[0] / 1.6, 0, 1)
        grey = col.mean(1, keepdims=True); col = grey + (col - grey) * G['sat']        # the paint chalky
        grain = noise3(p, 0.9) * 0.6 + noise3(p, 2.7) * 0.4
        col = col * (0.93 + 0.14 * grain)[:, None]
        light = G['fill'][None] * (0.75 + 0.25 * ao[:, None]) + 0.80 * (lam * lit)[:, None] * np.array([1.0, 0.97, 0.9])
        up = np.clip(nw[:, 2], 0, 1)
        col = col * light + 0.04 * up[:, None] * (1 - col)                               # the bleach where it faces up
        return np.clip(col, 0, 1), al
    has = hit >= 0
    piece = has & (hit < npart)
    idx = np.nonzero(piece)[0]
    if len(idx):
        c, a = shade(Ol, idx, tt, hit[idx])
        rgb[idx] = c; alpha[idx] = a
        g = idx[np.array([ms[k] == GLASS for k in hit[idx]], bool)]
        if len(g):   # under the glass: the piece's inside, or his own face (left to show)
            o2 = Ol[g] + Dl[g] * (tt[g, None] + 0.9)
            t2, h2 = march(o2, Dl[g], skip_glass=True)
            behind = (h2 >= 0) & (h2 < npart)
            if behind.any():
                gi = g[behind]
                Olb = Ol.copy(); Olb[gi] = o2[behind]
                tt2 = np.zeros(len(Ol)); tt2[gi] = t2[behind]
                c2, _ = shade(Olb, gi, tt2, h2[behind])
                rgb[gi] = rgb[gi] * 0.5 + c2 * 0.5; alpha[gi] = 1.0
    img = np.zeros((H * ss, W * ss, 4))
    img[..., :3] = rgb.reshape(H * ss, W * ss, 3); img[..., 3] = alpha.reshape(H * ss, W * ss)
    cov = (img[..., 3] > 0).astype(float)
    a4 = img[..., 3].reshape(H, ss, W, ss).mean((1, 3))
    covm = cov.reshape(H, ss, W, ss).mean((1, 3))
    c4 = (img[..., :3] * cov[..., None]).reshape(H, ss, W, ss, 3).sum((1, 3)) / np.maximum(cov.reshape(H, ss, W, ss).sum((1, 3)), 1e-6)[..., None]
    out = np.zeros((H, W, 4))
    out[..., :3] = c4
    solid = covm >= G['alpha'] / 255.0
    glass = a4 / np.maximum(covm, 1e-6)
    out[..., 3] = np.where(solid, np.where(glass > 0.99, 1.0, glass), 0)
    # the ring: the silhouette's outer pixel, a few values darker (the guide's ring)
    m = out[..., 3] > 0.99
    edge = m & ~(np.roll(m, 1, 0) & np.roll(m, -1, 0) & np.roll(m, 1, 1) & np.roll(m, -1, 1))
    out[edge, :3] = np.clip(out[edge, :3] - G['ring'] * 2.2 / 255.0, 0, 1)
    return (np.clip(out, 0, 1) * 255).round().astype(np.uint8)


def crop(a):
    ys, xs = np.nonzero(a[..., 3])
    if not len(ys): return None, (0, 0)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    return a[y0:y1, x0:x1], (int(x0), int(y0))


def tip(points, is_dir=False):
    """the dropped helmet: knocked off and lying on its side (turned 100 degrees about his forward axis, sunk to the ground)"""
    t = math.radians(100)
    R = np.array([[math.cos(t), 0, math.sin(t)], [0, 1, 0], [-math.sin(t), 0, math.cos(t)]])
    return points @ R.T


def build():
    L = json.load(open(LOOKS))
    G = guide()
    combos = {}
    for slot in ('head', 'body'):
        for rid, r in L[slot].items():
            key = r['class'] + ''.join('+' + f for f in sorted(r.get('feats', [])))
            combos.setdefault((slot, key), (r['class'], sorted(r.get('feats', []))))
    os.makedirs(OUT, exist_ok=True)
    sprites = []    # (key, kind, image, anchor offset dx, dy)
    for (slot, key), (cls, feats) in sorted(combos.items()):
        parts = head_parts(cls, feats) if slot == 'head' else body_parts(cls, feats)
        box = (-30, -36, 30, 30) if slot == 'head' else (-24, 6, 24, 54)
        for i, d in enumerate(DIRS):
            a = render(parts, proxies(True), 45 * i, box, 1.0, 4, 45.0, G)
            c, (cx, cy) = crop(a)
            if c is None: sprites.append((key, d, None, 0, 0)); continue
            sprites.append((key, d, c, box[0] + cx, box[1] + cy))
        if slot == 'head':
            # dropped: on the ground beside him, the dome toward the sun side; the anchor is its ground point
            a = render(parts, [], 0, (-30, -36, 30, 30), 1.0, 4, 45.0, G, pre=tip)
            c, (cx, cy) = crop(a)
            sprites.append((key, 'drop', c, -c.shape[1] // 2, -c.shape[0]))
            # the portrait: front-on, the camera near eye level (the master rig's portrait tilt 80), three times the pixels
            a = render(parts, proxies(False), 0, (-30, -36, 30, 30), 3.0, 3, 80.0, G)
            c, (cx, cy) = crop(a)
            sprites.append((key, 'portrait', c, (-30 * 3 + cx), (-36 * 3 + cy)))
        print('rendered', slot, key)
    # pack: two sheets (the fight's own pieces, and the portraits', which only a screen with a face loads), shelf packed
    cells = {}
    def pack(items, W, name):
        x = y = rowh = 0; place = []
        for key, d, c, dx, dy in items:
            if c is None: cells.setdefault(key, {})[d] = None; continue
            h, w = c.shape[:2]
            if x + w > W: x = 0; y += rowh + 1; rowh = 0
            place.append((c, x, y)); cells.setdefault(key, {})[d] = [x, y, w, h, int(dx), int(dy)]
            x += w + 1; rowh = max(rowh, h)
        H = y + rowh + 1
        sheet = np.zeros((H, W, 4), np.uint8)
        for c, px, py in place: sheet[py:py + c.shape[0], px:px + c.shape[1]] = c
        Image.fromarray(sheet, 'RGBA').save(os.path.join(OUT, name), lossless=True, quality=100, method=6)
        return [W, H]
    size = pack([q for q in sprites if q[1] != 'portrait'], 512, 'wear.webp')
    fsize = pack([q for q in sprites if q[1] == 'portrait'], 512, 'wear_face.webp')
    W, H = size
    meta = dict(
        what=("CHARACTER [the armour he wears shows], rule 272: one placeholder piece per armour class and extra, modelled at the "
              "source in the rig's look (tools/bohemia_character_the_armour_shows.py: the master rig's camera, tilt 45, the 1/cos "
              "stretch, the guide's sun and fill, the ring, the hard alpha; a numpy ray marcher, Blender not on the box). COOK's "
              "own art per named piece replaces these over the rounds."),
        draft=True, rule=272, sheet='wear.webp', size=size, face_sheet='wear_face.webp', face_size=fsize, dirs=DIRS,
        head_ref_px=HEAD_R * 2, head_anchor='the centre of his head (top + half his head across), at a head 25 px across',
        body_anchor='the same point: the body piece hangs from the centre of his head (his trunk under it)',
        portrait_ref_px=HEAD_R * 2 * 3, portrait_tilt_deg=80,
        cells='[x, y, w, h, dx, dy]: the piece on the sheet; dx, dy where its top left sits from the anchor, at ref scale; '
              'drop: from his ground point; portrait: at three times',
        pieces=cells)
    json.dump(meta, open(os.path.join(OUT, 'wear.json'), 'w'), separators=(',', ':'))
    print('sheets', size, fsize, '->', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('classes', 'all'): classes()
    if cmd in ('render', 'all'): build()


def screens():
    """the VOTE card's second sheet: his own screens on his phone (the gate's --shoot), bare above, wearing them below"""
    from PIL import ImageDraw
    d = os.path.join(ROOT, 'records/target/character/the_armour_shows')
    names = [('CREW', 'THE CREW CARD'), ('FIGHT', 'THE FIGHT'), ('CAMP', 'CAMP'), ('MAP', 'THE MAP'), ('MAP_CLOSE', 'THE MAP, CLOSE END')]
    pics = [(t, Image.open(os.path.join(d, 'SCREEN_%s_BEFORE.png' % n)).convert('RGBA'), Image.open(os.path.join(d, 'SCREEN_%s_AFTER.png' % n)).convert('RGBA'))
            for n, t in names if os.path.exists(os.path.join(d, 'SCREEN_%s_AFTER.png' % n))]
    H = max(p[1].height for p in pics); W = sum(p[1].width for p in pics) + 24 * (len(pics) + 1)
    out = Image.new('RGBA', (W, 40 + 2 * H + 60), (42, 37, 32, 255)); dr = ImageDraw.Draw(out)
    x = 24
    for t, b, a in pics:
        dr.text((x, 10), t, fill=(216, 204, 176, 255))
        out.alpha_composite(b, (x, 40)); out.alpha_composite(a, (x, 40 + H + 40))
        x += b.width + 24
    dr.text((24, 40 + H + 12), 'BEFORE (above): nothing he wears is drawn.   AFTER (below): the police riot helmet and the police vest on him.', fill=(168, 154, 124, 255))
    out.save(os.path.join(d, 'CHARACTER_THE_ARMOUR_ON_EVERY_SCREEN.png'))
    print('screens', out.size)


if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'screens':
    screens()
