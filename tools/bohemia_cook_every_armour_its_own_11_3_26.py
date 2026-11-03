#!/usr/bin/env python3
"""BOHEMIA -- COOK [every armour its own] (11/3/26, VAMILY rule 337, ask line 345). Paolo: 'we don't have enough assets, and
you're not creating assets, weapons, armor, the vibe, nothing.'

MEASURED FIRST: the armory's nine armours of the valley's own (records/BOHEMIA_ARMORY_TWELVE_GUNS_AND_BLADES_AND_NINE_ARMOURS_
11_2_26.md: football pads, a duct-taped carpet vest, a licence-plate vest, a riot-gear plate carrier, road-sign armour, a goalie
mask, a football helmet, a welding-mask riot helmet, a gas-visor riot helm) were DATA: each drew on the man as one of CHARACTER's
17 placeholder classes (the football pads as a quilted olive vest, the road sign as a car door, the goalie mask as a gas mask).
Nothing on the man said what he had bought.

EACH OF THE NINE ITS OWN MODEL, made of the valley, through the same pipe the police pair went through (tools/bohemia_cook_the_
armour_through_the_rig_10_26_26.py, imported, never edited): signed distances in CHARACTER's head frame (his head's centre at 0, 25
px across at the fight's 57 px a metre, -y the way he faces, the stretched space), meshed by surface nets, rendered by DIRECTION's
master rig in Blender (its light, film and source pass, the guide's 45-degree camera, the eight facings, a helmet also knocked off
and at portrait size, his head and trunk as holdouts, smoked glass where a visor is), the rig's post, and packed into CHARACTER's
own sheets (slices/wear/) beside every piece already there, cell for cell (the old cells are lifted off the sheets as they are).
records/target/bb/armour_looks.json gives each of the nine rows 'own': its key; engine/bohemia_wear.js draws a row's own piece
where the sheet has it, else its class (one line). Every other row is unchanged.

  BODY  football_pads       high school shoulder pads over a grey hoodie: two white plastic caps and their epaulets with a faded
                            maroon stripe, the front and back plates laced, black straps under the arms, the hood bunched behind
        carpet_coat         a vest cut from casino carpet (burgundy, gold swirls, black dots, its pile), silver duct tape at the
                            seams, crossed over the chest and round the hem
        licence_plate_vest  motorcycle plates wired in overlapping rows on an olive canvas vest, sunset-orange bands, dark letters,
                            bolt holes, rust at the edges, one plate on each shoulder
        riot_gear_jacket    a riot plate carrier: segmented shoulder guards in three plates, a high collar guard, a ribbed chest
                            plate, a belly flap with a pale stencilled number, a pale band across the back
        road_sign_cuirass   a yellow diamond CURVE AHEAD sign bent round his chest (black border and arrow, bullet holes, rust),
                            a green street sign on his back, a red STOP octagon on his left shoulder, seat-belt webbing for straps
                            and a chrome buckle at his side
  HEAD  goalie_mask         a bone-white hockey goalie mask (eye holes, breathing holes, a crack, two red brow stripes, old dirt)
                            on its black elastic straps over a quilted padded cap
        football_helmet     a silver football helmet (black and red centre stripes, ear holes), a grey face cage of two bars and
                            a centre bar, a white chin cup on its straps, the neck bumper
        welding_mask        a black welding hood on a black riot dome with one safety-orange stripe: a gold-mirror lens in its
                            frame, a skull sticker and a flame decal, scorch, the pivot knobs
        riot_gas_helmet     an olive-black riot helm, its smoked visor down over a rubber gas mask, the filter canister out
                            under the shield's edge at his right cheek, a yellow stencil band, a fabric neck curtain

  /tmp/v/bin/python tools/bohemia_cook_every_armour_its_own_11_3_26.py                 render the nine, pack, write the looks
  /tmp/v/bin/python tools/bohemia_cook_every_armour_its_own_11_3_26.py --only goalie_mask --proof     one, a proof only
  /tmp/v/bin/python tools/bohemia_cook_every_armour_its_own_11_3_26.py --pack          pack what is rendered

REFERENCE CHECK (the 9/4 standing duty): the real things (a high school football shoulder pad set, a casino's patterned carpet, a
Nevada motorcycle plate, a riot suit's shoulder and chest guards, an MUTCD W1 curve sign and R1 stop sign, a fibreglass goalie
mask, a football helmet's facemask, a hard-hat welding shield, a riot helmet with a gas mask under its visor); the twins are the
placeholder each replaces (its class's cells, kept side by side on the proof and the VOTE sheets) and the rig's man under it.
No reference game.
"""
import os, sys, json, math, time

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import numpy as np
from PIL import Image
import bohemia_character_the_armour_shows as CH
import bohemia_cook_the_armour_through_the_rig_10_26_26 as AR

V, sph, ell, rbox, capsule, cyl_x, cyl_y, torus_z = CH.V, CH.sph, CH.ell, CH.rbox, CH.capsule, CH.cyl_x, CH.cyl_y, CH.torus_z
U, I, S, above, below, flat, where, hexc, noise3, length = CH.U, CH.I, CH.S, CH.above, CH.below, CH.flat, CH.where, CH.hexc, CH.noise3, CH.length
TT = CH.TORSO_TOP; ZC = -42.0
OUT = AR.OUT
LOOKS = CH.LOOKS
PROOF = os.path.join(R, 'records/target/cook_every_armour')


def paint(base, *rules):
    """a material: the first rule whose test holds paints the point, else the base"""
    cb = hexc(base); rs = [(t, hexc(h)) for t, h in rules]
    def m(p):
        c = np.broadcast_to(cb, p.shape).copy(); done = np.zeros(p.shape[:-1], bool)
        for t, h in rs:
            k = t(p) & ~done; c[k] = h; done |= k
        return c, np.ones(p.shape[:-1])
    return m


def shade(m, k_fn):
    """a material darkened point by point (grime, a crease, a pile)"""
    def f(p):
        c, a = m(p); return c * k_fn(p)[..., None], a
    return f


def shell_of(sdf, t):
    return lambda p: np.abs(sdf(p)) - t


def bend(sdf, c, k):
    """a part on his back bent round him: its sides brought forward by k x^2 about c"""
    def f(p):
        q = p.copy(); q[..., 1] = q[..., 1] + k * (q[..., 0] - c[0]) ** 2
        return sdf(q)
    return f


X_, Y_, Z_ = (lambda p: p[..., 0]), (lambda p: p[..., 1]), (lambda p: p[..., 2])


# ------------------------------------------------------------------------------------------------- THE FOUR HELMETS
def goalie_mask():
    P = []
    cap = I(sph(V(0, 1.2, 1.4), 13.5), above(-2.0))
    P.append((cap, shade(flat('#3b3832'), lambda p: np.where(np.abs(np.sin(p[..., 2] * 1.25 + 0.4 * p[..., 0])) > 0.93, 0.72, 1.0))))
    face = ell(V(0, -1.0, -2.2), (12.6, 14.6, 15.6))
    mask = I(shell_of(face, 0.75), lambda p: p[..., 1] + 4.5, below(10.5), above(-17.5))
    for sx in (-1, 1):
        mask = S(mask, ell(V(sx * 4.6, -14.0, 1.4), (2.7, 6.0, 1.9)))                            # the eye holes
    holes = lambda p: (p[..., 2] < -4.5) & (p[..., 2] > -15.0) & (np.abs(p[..., 0]) < 6.5) & \
        (np.abs(((p[..., 0] + 0.9 * (np.floor(p[..., 2] / 2.0) % 2)) % 1.8) - 0.9) < 0.42) & (np.abs((p[..., 2] % 2.0) - 1.0) < 0.42)
    stripes = lambda p: (np.abs(p[..., 2] - 7.0) < 0.75) | (np.abs(p[..., 2] - 4.9) < 0.55)
    crack = lambda p: (np.abs(p[..., 0] - 2.0 - 0.5 * np.sin(p[..., 2] * 1.3)) < 0.32) & (p[..., 2] > -9) & (p[..., 2] < 3)
    dirt = lambda p: noise3(p, 0.30) > 0.68
    P.append((mask, paint('#d2cab4', (holes, '#1b1915'), (crack, '#3d3a33'), (stripes, '#8a2c22'), (dirt, '#9b927c'))))
    for z in (3.6, -7.5):                                                                         # the elastic straps
        P.append((I(torus_z(V(0, 1.2, z), 13.3, 0.75), lambda p: p[..., 1] + 2.0), flat('#161513')))
    return P


def football_helmet():
    P = []
    shell = S(I(ell(V(0, 0.8, 0.6), (15.0, 15.8, 15.4)), above(-11.5)), rbox(V(0, -13.0, -6.0), (9.6, 7.0, 8.4), 3.5))
    stripe = lambda p: (np.abs(p[..., 0]) < 1.1) & (p[..., 2] > -2.0)
    reds = lambda p: (np.abs(np.abs(p[..., 0]) - 2.2) < 0.7) & (p[..., 2] > -2.0)
    ear = lambda p: ((np.abs(p[..., 0]) > 13.0) & ((p[..., 1] - 1.0) ** 2 + (p[..., 2] + 4.0) ** 2 < 4.0))
    decal = lambda p: (np.abs(p[..., 0]) > 9.0) & (np.abs(p[..., 1] - 1.5) + np.abs(p[..., 2] - 2.5) < 4.2)   # a maroon diamond each side
    P.append((shell, paint('#8b8981', (ear, '#151515'), (stripe, '#1b1b1c'), (reds, '#7c2a24'), (decal, '#6e2622'))))
    cage = flat('#1f1f1e')
    for z in (-5.6, -10.6):
        P.append((I(torus_z(V(0, 0.4, z), 16.2, 1.25), lambda p: p[..., 1] + 4.0), cage))
    P.append((capsule(V(0, -16.6, -3.4), V(0, -15.8, -11.8), 1.25), cage))
    for sx in (-1, 1):
        P.append((capsule(V(sx * 6.0, -15.6, -4.6), V(sx * 6.4, -15.0, -11.4), 1.0), cage))
        P.append((capsule(V(sx * 13.4, -8.6, -2.6), V(sx * 13.8, -8.0, -11.0), 1.25), cage))
        P.append((capsule(V(sx * 9.8, -12.6, -11.5), V(sx * 13.0, -2.0, -12.5), 0.55), flat('#1a1a1a')))   # the chin straps
    P.append((ell(V(0, -12.4, -15.4), (4.8, 3.0, 2.6)), flat('#cdc7b6')))                            # the chin cup
    P.append((I(ell(V(0, 11.0, -11.2), (10.0, 4.2, 3.0)), above(-13.0)), flat('#2a2827')))           # the neck bumper
    return P


def welding_mask():
    P = []
    hat = I(ell(V(0, 0.8, 3.0), (13.9, 14.8, 13.0)), above(4.0))
    P.append((hat, paint('#33322d', (lambda p: np.abs(p[..., 0]) < 2.0, '#b4561e'))))                    # a black riot dome, one safety-orange stripe
    P.append((I(ell(V(0, -2.5, 4.4), (14.6, 16.6, 1.3)), lambda p: p[..., 1] + 4.0), flat('#2a2925')))   # its peak
    hood = ell(V(0, -0.5, -2.8), (14.9, 16.2, 16.4))
    hood = I(shell_of(hood, 0.95), lambda p: p[..., 1] - 2.0, below(4.6), above(-18.0))
    skull = lambda p: (p[..., 0] < -12.0) & ((p[..., 1] + 3.5) ** 2 + (p[..., 2] + 2.0) ** 2 < 11.0)
    skull_eye = lambda p: (p[..., 0] < -12.0) & ((((p[..., 1] + 4.6) ** 2 + (p[..., 2] - 1.0 + 2.0) ** 2) < 0.9) | (((p[..., 1] + 2.4) ** 2 + (p[..., 2] - 1.0 + 2.0) ** 2) < 0.9))
    flame = lambda p: (p[..., 0] > 12.0) & (p[..., 2] < -4.0) & (p[..., 2] > -14.0) & (np.abs(p[..., 1] + 3.0 - 1.6 * np.sin(p[..., 2] * 0.9)) < (p[..., 2] + 14.0) * 0.32)
    scorch = lambda p: noise3(p, 0.32) > 0.64
    P.append((hood, paint('#25241f', (skull_eye, '#1a1916'), (skull, '#c4bca5'), (flame, '#b45a22'), (scorch, '#3a3328'))))
    lens = rbox(V(0, -16.6, 0.6), (6.4, 1.2, 2.5), 0.5)
    P.append((lens, paint('#7a6430', (lambda p: (p[..., 0] - p[..., 2] * 0.9 > 1.2) & (p[..., 0] - p[..., 2] * 0.9 < 2.8), '#b8a265'))))
    P.append((S(rbox(V(0, -16.2, 0.6), (7.8, 1.4, 3.8), 0.6), rbox(V(0, -16.2, 0.6), (6.5, 3.0, 2.6), 0.4)), flat('#3a3833')))   # its frame
    for sx in (-1, 1):
        P.append((cyl_x(V(sx * 15.2, -1.0, 2.6), 2.6, 1.3), flat('#4d4b44')))                       # the pivot knobs
    return P


def riot_gas_helmet():
    P = []
    base = CH.head_parts('riot_helmet', [])
    recol = {0: flat('#373b33'), 7: flat('#3a382f'), 8: flat('#b3a35e')}
    for i, (f, m) in enumerate(base):
        P.append((f, recol.get(i, m)))
    P[0] = (P[0][0], shade(flat('#373b33'), lambda p: np.where(noise3(p, 0.30) > 0.66, 0.80, 1.0)))
    # the gas mask under the shield: its face piece, eyepieces, head strap (CHARACTER's), the canister moved out under the shield's
    # edge to his right cheek
    gm = CH.head_parts('gas_mask', [])
    P += [gm[0], gm[2], gm[3]]
    P.append((capsule(V(-6.0, -12.8, -9.5), V(-10.5, -16.6, -14.8), 3.4), where(lambda p: np.abs(((p[..., 1] + p[..., 2]) * 0.7) % 2.2) < 0.5, flat('#2f3127'), flat('#57583f'))))
    curtain = I(lambda p: np.abs(np.sqrt(p[..., 0] ** 2 + (p[..., 1] - 0.8) ** 2) - 14.2) - 0.9, below(-5.0), above(-17.5), lambda p: -p[..., 1] - 2.0)
    P.append((curtain, shade(flat('#4a4a3e'), lambda p: 0.82 + 0.18 * np.abs(np.sin(np.arctan2(p[..., 0], p[..., 1]) * 9.0)))))
    return P


# ------------------------------------------------------------------------------------------------- THE FIVE BODIES
def football_pads():
    P = []
    hoodie = rbox(V(0, 0.2, ZC - 1.0), (10.0, 8.0, 17.0), 4.0)
    P.append((hoodie, paint('#67635b', (lambda p: (p[..., 1] < -6.0) & (np.abs(p[..., 0]) < 6.5) & (p[..., 2] < ZC - 4.0) & (p[..., 2] > ZC - 12.0), '#5a564e'))))
    P.append((ell(V(0, 7.0, TT - 2.5), (7.6, 4.4, 4.6)), flat('#5e5a52')))                          # the hood, bunched behind
    for sx in (-1, 1):
        P.append((capsule(V(sx * 1.8, -8.6, TT - 6.0), V(sx * 2.2, -9.0, TT - 13.0), 0.45), flat('#c9c2b0')))   # the drawstrings
    white = '#c8c1ae'; stripe = lambda p: np.abs(p[..., 1] + 0.2) < 1.3
    for sx in (-1, 1):
        cap = I(ell(V(sx * 10.6, 0.2, TT - 5.6), (9.0, 10.2, 6.6)), above(TT - 11.6))
        P.append((cap, paint(white, (stripe, '#7a2c26'), (lambda p: noise3(p, 0.4) > 0.72, '#a39b88'))))
        ep = I(ell(V(sx * 14.0, 0.2, TT - 3.6), (5.6, 8.4, 4.0)), above(TT - 7.2))
        P.append((ep, paint(white, (stripe, '#7a2c26'))))
        P.append((rbox(V(sx * 10.8, 0.2, TT - 15.5), (1.0, 9.2, 1.0), 0.4), flat('#1c1b1a')))      # the straps under the arms
    lace = lambda p: (np.abs(p[..., 0]) < 1.7) & (np.sin(p[..., 2] * 2.2) > 0.2)
    P.append((rbox(V(0, -9.8, TT - 10.0), (8.6, 1.4, 6.6), 2.2), paint(white, (lace, '#262420'))))
    P.append((rbox(V(0, 9.8, TT - 10.0), (9.0, 1.4, 7.0), 2.2), flat(white)))
    return P


def carpet_coat():
    P = []
    def vest(p):
        d = S(rbox(V(0, 0.2, ZC + 0.5), (10.9, 8.9, 16.0), 4.5), sph(V(0, 0, TT + 1.0), 7.8))(p)
        return d + 0.22 * np.sin(p[..., 0] * 3.1) * np.sin(p[..., 2] * 2.9)                   # the pile
    swirl = lambda p: np.sin(0.85 * p[..., 0] + 1.3 * np.sin(0.7 * p[..., 2])) * np.cos(0.8 * p[..., 2] + 0.9 * np.sin(0.6 * p[..., 0] + 0.5 * p[..., 1])) > 0.50
    leaf = lambda p: np.sin(1.7 * p[..., 0] + 1.1 * p[..., 2] + 2.0 * np.sin(0.4 * p[..., 1])) > 0.88
    dot = lambda p: (np.sin(2.3 * p[..., 0]) * np.sin(2.3 * p[..., 2]) > 0.80)
    zz = lambda p: p[..., 2] - (ZC + 1.0)
    tape_x = lambda p: (p[..., 1] < -3.0) & ((np.abs(p[..., 0] - zz(p) * 0.55) < 1.45) | (np.abs(p[..., 0] + zz(p) * 0.55) < 1.45)) & (np.abs(zz(p)) < 13.0)
    tape_side = lambda p: (np.abs(np.abs(p[..., 0]) - 10.4) < 1.5) & (np.abs(p[..., 1]) < 4.0)
    tape_hem = lambda p: np.abs(p[..., 2] - (ZC - 13.6)) < 1.4
    shine = lambda p: np.sin(p[..., 0] * 1.7 + p[..., 2] * 0.9) > 0.6
    tape = lambda p: tape_x(p) | tape_side(p) | tape_hem(p)
    P.append((vest, paint('#5a2027', (lambda p: tape(p) & shine(p), '#b7b6ae'), (tape, '#8f8e88'), (dot, '#1d1514'), (leaf, '#4f5631'), (swirl, '#a07c3a'))))
    return P


def licence_plate_vest():
    P = []
    P.append((S(rbox(V(0, 0.2, ZC), (10.2, 8.2, 16.2), 4.0), sph(V(0, 0, TT + 1.0), 7.6)), flat('#4a4535')))
    plates = []
    for r, z in enumerate((ZC + 11.0, ZC + 6.0, ZC + 1.0, ZC - 4.0, ZC - 9.0)):
        off = 0.9 if r % 2 else -0.9
        for x in (-4.6 + off, 4.6 + off): plates.append(('f', x, z))
        if r < 4:
            for x in (-4.6 - off, 4.6 - off): plates.append(('b', x, z + 1.0))
    PL = rbox(V(0, 0, 0), (4.6, 0.42, 2.7), 0.4)
    def frame(p, kind, x, z):
        """the point in a plate's own frame: (u across it, n off its face, v up it)"""
        if kind == 'f':   # shingled: each plate's bottom edge out over the one below
            return p[..., 0] - x, p[..., 1] + 9.4 - 0.13 * (p[..., 2] - z), p[..., 2] - z
        if kind == 'b':
            return p[..., 0] - x, -(p[..., 1] - 9.8) - 0.13 * (p[..., 2] - z), p[..., 2] - z
        w = p[..., 0] - x * 11.5                                                                   # a shoulder plate: lying over it,
        return p[..., 1] - 0.2, (p[..., 2] - z) - 0.45 * x * w, w * 2.9 / 3.4                     # long side front to back, tipped out
    def sd(p):
        out = None
        for kind, x, z in plates:
            u, n, v = frame(p, kind, x, z)
            d = PL(np.stack([u, n, v], -1))
            out = d if out is None else np.minimum(out, d)
        return out
    def local(p):
        """the point in its nearest plate's own frame: (u across, v up) for the paint"""
        best = U_ = V__ = None
        for kind, x, z in plates:
            u, n, v = frame(p, kind, x, z)
            d = PL(np.stack([u, n, v], -1))
            if best is None: best, U_, V__ = d, u, v
            else:
                k = d < best; best = np.where(k, d, best); U_ = np.where(k, u, U_); V__ = np.where(k, v, V__)
        return U_, V__
    def mat(p):
        u, v = local(p)
        c = np.broadcast_to(hexc('#b2b0a5'), p.shape).copy()
        band = v > 1.6
        letters = (np.abs(v + 0.4) < 1.1) & (np.abs(u) < 3.6) & (np.sin(u * 2.7) > -0.25)
        holes = ((np.abs(np.abs(u) - 3.4) < 0.45) & (np.abs(v - 2.0) < 0.45))
        edge = (np.abs(u) > 4.0) | (np.abs(v) > 2.2)
        rust = edge & (noise3(p, 0.6) > 0.45)
        c[band] = hexc('#a8682f'); c[letters] = hexc('#2b2c30'); c[rust] = hexc('#6e4430'); c[holes] = hexc('#141414')
        return c, np.ones(p.shape[:-1])
    P.append((sd, mat))
    return P


def riot_gear_jacket():
    P = []
    base = CH.body_parts('riot_armour', [])
    P.append(base[0])                                                                               # the carrier itself
    P.append((S(rbox(V(0, 0.2, ZC + 1.0), (10.9, 9.1, 15.8), 4.5), rbox(V(0, 0.2, ZC + 1.0), (12.0, 10.0, 13.6), 4.5)),
              flat('#16171a')))                                                                     # its binding, top and hem
    for sx in (-1, 1):
        for k in range(3):                                                                          # the shoulder guard, three plates
            seg = I(ell(V(sx * (11.6 + 0.9 * k), 0.2, TT - 6.0 - 3.6 * k), (6.8 - 0.3 * k, 8.2 - 0.3 * k, 3.6)), above(TT - 9.6 - 3.6 * k))
            P.append((seg, flat(('#2d3036', '#25272c', '#2d3036')[k])))
        P.append((cyl_x(V(sx * 16.2, -1.0, TT - 8.6), 1.0, 0.6), flat('#77736a')))                  # the rivet on each
    P.append((I(torus_z(V(0, 0.4, TT - 1.0), 8.2, 2.6), above(TT - 3.2)), flat('#18191c')))        # the collar guard
    rib = lambda p: (np.abs(((p[..., 2] - ZC) % 3.4) - 1.7) < 0.45) & (np.abs(p[..., 0]) < 5.5) & (p[..., 2] > ZC - 2.0)
    P.append((rbox(V(0, -9.2, ZC + 3.0), (6.4, 1.1, 6.6), 1.6), paint('#33363c', (rib, '#1e1f23'))))   # the chest plate, ribbed
    num = lambda p: (np.abs(p[..., 2] - (ZC - 12.0)) < 1.4) & (np.abs(p[..., 0]) < 2.8) & (np.sin(p[..., 0] * 2.4) > -0.3)
    P.append((rbox(V(0, -9.6, ZC - 11.5), (5.6, 1.0, 4.6), 1.6), paint('#2a2c31', (num, '#a7a497'))))   # the belly flap, its number
    P.append((I(rbox(V(0, 0.2, ZC + 1.0), (10.9, 9.1, 15.8), 4.5), lambda p: np.abs(p[..., 2] - (ZC + 6.5)) - 1.6, lambda p: 4.0 - p[..., 1]),
              flat('#a19e92')))                                                                     # the pale band across the back
    return P


def road_sign_cuirass():
    P = []
    P.append((S(rbox(V(0, 0.2, ZC), (10.2, 8.2, 16.2), 4.0), sph(V(0, 0, TT + 1.0), 7.6)), flat('#2e2b26')))
    c0 = V(0, -10.0, ZC + 3.0)
    def sign(p):
        q = p - c0; q[..., 1] = q[..., 1] - 0.030 * q[..., 0] ** 2                                  # its sides bent back round him
        d = (np.abs(q[..., 0]) + np.abs(q[..., 2]) - 15.0) / math.sqrt(2.0)
        return np.maximum(d, np.abs(q[..., 1]) - 0.6) - 0.35
    def sign_mat(p):
        q = p - c0; a = np.abs(q[..., 0]) + np.abs(q[..., 2])
        c = np.broadcast_to(hexc('#c79a2c'), p.shape).copy()
        arrow = (np.abs(q[..., 0] - 3.0 * np.sin(q[..., 2] * 0.28)) < 1.25) & (q[..., 2] > -7.5) & (q[..., 2] < 4.5)
        head = (q[..., 2] >= 4.0) & (q[..., 2] < 8.5) & (np.abs(q[..., 0] - 3.0 * math.sin(4.0 * 0.28)) < (8.5 - q[..., 2]) * 0.75)
        holes = np.zeros(p.shape[:-1], bool)
        for hx, hz in ((-5.0, -4.0), (6.0, 2.5), (-2.0, 6.5)):
            holes |= (q[..., 0] - hx) ** 2 + (q[..., 2] - hz) ** 2 < 0.55
        rust = noise3(p, 0.40) > 0.70
        c[rust] = hexc('#8a6436'); c[(a > 12.6) & (a < 13.9)] = hexc('#1b1a17'); c[arrow | head] = hexc('#1b1a17'); c[holes] = hexc('#0e0e0e')
        return c, np.ones(p.shape[:-1])
    P.append((sign, sign_mat))
    back = bend(rbox(V(0, 10.0, ZC + 5.0), (10.8, 0.6, 3.8), 0.4), V(0, 0, 0), 0.030)
    P.append((back, paint('#2f5a3c', (lambda p: (np.abs(p[..., 0]) > 9.6) | (np.abs(p[..., 2] - (ZC + 5.0)) > 2.9), '#cfcabb'),
                          (lambda p: (np.abs(p[..., 2] - (ZC + 5.0)) < 1.3) & (np.abs(p[..., 0]) < 7.5) & (np.sin(p[..., 0] * 2.5) > -0.2), '#d6d1c2'))))
    webbing = flat('#34332f')
    for sx in (-1, 1):
        P.append((rbox(V(sx * 6.4, 0.2, TT - 3.6), (1.7, 10.4, 1.2), 0.5), webbing))
    P.append((S(rbox(V(0, 0.2, ZC - 9.5), (11.4, 9.6, 1.3), 4.0), rbox(V(0, 0.2, ZC - 9.5), (10.4, 8.6, 3.0), 3.5)), webbing))
    P.append((rbox(V(11.0, -3.0, ZC - 9.5), (0.9, 2.2, 1.8), 0.3), flat('#aaa9a1')))              # the seat-belt buckle
    cs = V(11.6, 0.2, TT - 5.0)
    def stop(p):
        q = p - cs; q[..., 2] = q[..., 2] - 0.45 * (q[..., 0])                                      # tipped down to the outside
        o = np.maximum(np.maximum(np.abs(q[..., 0]), np.abs(q[..., 1])), (np.abs(q[..., 0]) + np.abs(q[..., 1])) / math.sqrt(2.0)) - 7.4
        return np.maximum(o, np.abs(q[..., 2] + 0.02 * (q[..., 0] ** 2 + q[..., 1] ** 2)) - 0.55) - 0.25
    def stop_mat(p):
        q = p - cs
        o = np.maximum(np.maximum(np.abs(q[..., 0]), np.abs(q[..., 1])), (np.abs(q[..., 0]) + np.abs(q[..., 1])) / math.sqrt(2.0))
        c = np.broadcast_to(hexc('#9a2922'), p.shape).copy()
        c[(o > 6.0) & (o < 6.8)] = hexc('#d0cabb')
        c[(np.abs(q[..., 1]) < 1.3) & (np.abs(q[..., 0]) < 4.2) & (np.sin(q[..., 0] * 2.4) > -0.1)] = hexc('#d0cabb')
        c[noise3(p, 0.5) > 0.74] = hexc('#6a3a2c')
        return c, np.ones(p.shape[:-1])
    P.append((stop, stop_mat))
    return P


# ------------------------------------------------------------------------------------------------- THE PLACEHOLDERS, THEIR OWN
# the classes the shops sell most, each its own model of the valley (every row of the class wears it; its extras, the mail, the
# horns, laid over it as CHARACTER's own)
def moto_helmet():
    """a full-face motorcycle helmet in oxblood, rode hard: a smoke visor with a scratch's glint, a chin vent, a crack in the
    shell held with silver duct tape, scuffs to the primer, the pale stripe kept"""
    P = []
    shell = I(ell(V(0, 0.8, -0.5), (15.2, 15.8, 15.6)), above(-15.0))
    stripe = lambda p: (np.abs(p[..., 0]) < 1.5) & (p[..., 2] > 2.0)
    tape = lambda p: (np.abs(p[..., 0] - 7.5 + 0.35 * (p[..., 2] - 6.0)) < 1.4) & (p[..., 2] > 2.0) & (p[..., 2] < 12.0) & (p[..., 1] < 4.0)
    shine = lambda p: tape(p) & (np.sin(p[..., 2] * 2.2) > 0.3)
    scuff = lambda p: noise3(p, 0.45) > 0.70
    P.append((shell, shade(paint('#4f2320', (shine, '#b9b8b0'), (tape, '#8e8d86'), (stripe, '#aea591'), (scuff, '#6d6559')),
                           lambda p: np.where(p[..., 2] > 8.0, 0.88, 1.0))))
    visor = I(ell(V(0, 0.6, -0.5), (14.4, 16.6, 14.8)), lambda p: p[..., 1] + 6.0, lambda p: np.abs(p[..., 2] + 1.5) - 5.2, lambda p: np.abs(p[..., 0]) - 11.5)
    P.append((visor, where(lambda p: (p[..., 0] - p[..., 2] * 0.8 > 2.5) & (p[..., 0] - p[..., 2] * 0.8 < 4.0), flat('#5a626c'), flat('#121417'))))
    for sx in (-1, 1): P.append((cyl_x(V(sx * 14.8, -4.0, -1.5), 2.2, 0.8), flat('#2a2725')))          # the visor's pivot plates
    P.append((ell(V(0, -11.5, -10.5), (10.5, 5.5, 4.6)), paint('#4a201d', (lambda p: (np.abs(p[..., 0]) < 4.0) & (np.abs(((p[..., 0]) % 1.6) - 0.8) < 0.35), '#151313'))))
    P.append((capsule(V(-6.0, -6.0, -15.6), V(-7.0, -8.5, -20.5), 0.6), flat('#1a1918')))           # the chin strap, hanging
    return P


def hard_hat():
    """a builder's hard hat off a Strip site: dirty yellow, the crown ridge, the brim, stickers (a union's, a red one with its words
    gone), scuffs, and a headlamp on its band for the dark"""
    P = []
    dome = I(ell(V(0, 0.6, 2.4), (13.6, 14.6, 12.6)), above(-1.6))
    sticker = lambda p: (p[..., 0] > 10.0) & ((p[..., 1] + 1.0) ** 2 + (p[..., 2] - 5.0) ** 2 < 7.0)
    sticker2 = lambda p: (p[..., 0] < -9.5) & (np.abs(p[..., 1] - 2.0) < 2.6) & (np.abs(p[..., 2] - 4.0) < 1.5)
    P.append((dome, paint('#b89c40', (sticker, '#d3ccba'), (sticker2, '#8f2a22'))))
    P.append((I(ell(V(0, 0.6, 2.4), (2.0, 14.9, 13.4)), above(-1.0)), flat('#a38b3c')))
    brim = U(ell(V(0, 0.6, -1.7), (15.0, 15.8, 1.4)), ell(V(0, -3.5, -1.5), (12.0, 17.2, 1.3)))
    P.append((brim, flat('#9b843d')))
    P.append((I(torus_z(V(0, 0.6, 1.0), 14.2, 0.8), lambda p: p[..., 1] - 6.0), flat('#1c1b1a')))    # the lamp's band
    P.append((cyl_y(V(0, -15.0, 4.0), 2.6, 1.6), flat('#2c2b29')))                                  # the headlamp
    P.append((cyl_y(V(0, -16.7, 4.0), 1.9, 0.3), flat('#e3d6a6')))                                  # its glass
    return P


def padded_vest():
    """a moving blanket cut into a vest: maroon-grey quilting stitched in diamonds, the edges bound in black, a cargo strap for a belt"""
    P = []
    def quilt(p):
        d = rbox(V(0, 0.2, ZC), (10.9, 8.9, 16.0), 5.0)(p)
        u = (p[..., 0] + p[..., 2]) * 0.5; v = (p[..., 0] - p[..., 2]) * 0.5
        return d + 0.45 * np.minimum(np.abs(np.sin(u * 0.95)), np.abs(np.sin(v * 0.95)))
    stitch = lambda p: np.minimum(np.abs(np.sin((p[..., 0] + p[..., 2]) * 0.475)), np.abs(np.sin((p[..., 0] - p[..., 2]) * 0.475))) < 0.10
    edge = lambda p: (np.abs(p[..., 2] - (ZC - 15.0)) < 1.0) | ((np.abs(p[..., 0]) < 1.0) & (p[..., 1] < -6.0))
    P.append((quilt, paint('#5c3a3b', (edge, '#1d1b1a'), (stitch, '#3a2627'), (lambda p: noise3(p, 0.30) > 0.70, '#6c5a55'))))
    P.append((S(rbox(V(0, 0.2, ZC - 7.0), (11.6, 9.6, 1.2), 4.5), rbox(V(0, 0.2, ZC - 7.0), (10.4, 8.4, 3.0), 4.0)), flat('#a6772c')))   # the cargo strap
    P.append((rbox(V(0, -10.2, ZC - 7.0), (1.8, 0.8, 1.6), 0.3), flat('#8a8a84')))                   # its ratchet
    return P


def work_jacket():
    """a duck-canvas chore jacket worn to the shape of the man: brown canvas, a dark corduroy collar, two chest pockets with
    flaps, a reflective strip across the back, the zip"""
    P = []
    P.append((rbox(V(0, 0.2, ZC - 1.0), (10.0, 8.0, 17.5), 4.0),
              paint('#7a5c3c', (lambda p: (np.abs(p[..., 0]) < 0.6) & (p[..., 1] < -6.0), '#3a2e22'),
                    (lambda p: (np.abs(p[..., 2] - (ZC + 4.0)) < 1.3) & (p[..., 1] > 5.0), '#b7b4a6'),
                    (lambda p: noise3(p, 0.35) > 0.70, '#5f4a33'))))
    P.append((I(torus_z(V(0, 0.4, TT - 0.5), 7.6, 2.2), above(TT - 3.0)),
              shade(flat('#3b2c20'), lambda p: 0.82 + 0.18 * np.abs(np.sin(np.arctan2(p[..., 0], p[..., 1]) * 14.0)))))
    for sx in (-1, 1):
        P.append((ell(V(sx * 10.6, 0.2, TT - 10.0), (4.8, 6.2, 7.2)), flat('#6f5539')))
        P.append((rbox(V(sx * 4.8, -8.3, ZC + 6.5), (3.0, 0.7, 2.4), 0.5), flat('#6a5136')))
        P.append((rbox(V(sx * 4.8, -8.9, ZC + 8.3), (3.2, 0.6, 0.9), 0.4), flat('#4f3c28')))           # the flaps
    return P


def plated_jacket():
    """a coat of scales cut from flattened cans off the Strip's gutters: aluminium scales in rows, a can's red or gold left on some,
    each riveted at its top, on a leather jacket's shoulders"""
    P = []
    def scales(p):
        row = np.floor((p[..., 2] - ZC) / 4.2); off = (row % 2) * 2.4
        col = np.floor((p[..., 0] + off) / 4.8)
        u = ((p[..., 0] + off) % 4.8) / 4.8; v = ((p[..., 2] - ZC) % 4.2) / 4.2
        k = ((col * 7 + row * 13) % 5).astype(int)
        base = np.stack([hexc('#9b9a94'), hexc('#8e2c26'), hexc('#a99a5c'), hexc('#a2a19b'), hexc('#7d7c76')])[k]
        shade_ = 0.72 + 0.36 * v - 0.18 * np.abs(u - 0.5)
        gap = (u < 0.08) | (v < 0.12)
        rivet = (np.abs(u - 0.5) < 0.09) & (np.abs(v - 0.82) < 0.08)
        c = base * np.where(gap, 0.50, shade_)[..., None]
        c[rivet] = hexc('#3a3834')
        return c.reshape(p.shape), np.ones(p.shape[:-1])
    def sd(p):
        d = rbox(V(0, 0.2, ZC), (10.4, 8.4, 16.5), 4.0)(p)
        v = ((p[..., 2] - ZC) % 4.2) / 4.2
        return d - 0.35 * v
    P.append((sd, scales))
    for sx in (-1, 1):                                                                              # the shoulders scaled too, flatter
        P.append((I(ell(V(sx * 11.4, 0.2, TT - 7.4), (6.6, 8.2, 4.2)), above(TT - 11.0)), scales))
    return P


CLASS_OWN = {'moto_helmet': ('head', moto_helmet), 'hard_hat': ('head', hard_hat), 'padded_vest': ('body', padded_vest),
             'work_jacket': ('body', work_jacket), 'plated_jacket': ('body', plated_jacket)}
CLASS_WHAT = {'moto_helmet': ['oxblood shell', 'smoke visor', 'duct-taped crack', 'chin vent', 'pivot plates', 'hanging chin strap'],
              'hard_hat': ['yellow dome', 'ridge', 'brim', 'union sticker', 'red sticker', 'headlamp'],
              'padded_vest': ['moving blanket', 'diamond quilting', 'bound edges', 'cargo strap', 'ratchet'],
              'work_jacket': ['duck canvas', 'corduroy collar', 'chest pockets and flaps', 'reflective strip', 'zip'],
              'plated_jacket': ['can scales', 'red and gold cans', 'rivets', 'scaled shoulders']}


OWN = {
    'goalie_mask': ('head', goalie_mask), 'football_helmet': ('head', football_helmet), 'welding_mask': ('head', welding_mask),
    'riot_gas_helmet': ('head', riot_gas_helmet),
    'football_pads': ('body', football_pads), 'carpet_coat': ('body', carpet_coat), 'licence_plate_vest': ('body', licence_plate_vest),
    'riot_gear_jacket': ('body', riot_gear_jacket), 'road_sign_cuirass': ('body', road_sign_cuirass),
}
KEY = lambda rid: 'own_' + rid
WHAT = {
    'goalie_mask': ['goalie mask', 'eye holes', 'breathing holes', 'crack', 'brow stripes', 'elastic straps', 'padded cap'],
    'football_helmet': ['shell', 'centre stripes', 'ear holes', 'face cage', 'chin cup', 'chin straps', 'neck bumper'],
    'welding_mask': ['black riot dome', 'safety-orange stripe', 'welding hood', 'gold-mirror lens', 'lens frame', 'skull sticker', 'flame decal', 'pivot knobs'],
    'riot_gas_helmet': ['olive-black shell', 'smoked visor', 'gas mask under it', 'filter canister', 'stencil band', 'neck curtain'],
    'football_pads': ['grey hoodie', 'hood', 'shoulder caps', 'epaulets', 'maroon stripe', 'laced front plate', 'back plate', 'arm straps'],
    'carpet_coat': ['casino carpet', 'gold swirls', 'pile', 'duct tape cross', 'taped seams', 'taped hem'],
    'licence_plate_vest': ['canvas vest', 'plates in rows', 'sunset bands', 'letters', 'bolt holes', 'rust', 'shoulder plates'],
    'riot_gear_jacket': ['carrier', 'segmented shoulder guards', 'rivets', 'collar guard', 'ribbed chest plate', 'belly flap number', 'back band'],
    'road_sign_cuirass': ['curve-ahead sign', 'bullet holes', 'street sign on the back', 'stop sign shoulder', 'seat-belt webbing', 'buckle'],
}

_hp, _bp = CH.head_parts, CH.body_parts


def head_parts(cls, feats):
    if cls.startswith('own_'): return OWN[cls[4:]][1]()
    if cls in CLASS_OWN: return CLASS_OWN[cls][1]() + _hp('-', feats)      # its own model, the extras CHARACTER's
    return _hp(cls, feats)


def body_parts(cls, feats):
    if cls.startswith('own_'): return OWN[cls[4:]][1]()
    if cls in CLASS_OWN: return CLASS_OWN[cls][1]() + _bp('-', feats)
    return _bp(cls, feats)


CH.head_parts, CH.body_parts = head_parts, body_parts


def old_sprites(skip):
    """every piece already on CHARACTER's sheets, lifted off as it is (the cells, the drop, the portrait)"""
    w = json.load(open(os.path.join(OUT, 'wear.json')))
    sh = np.asarray(Image.open(os.path.join(OUT, w['sheet'])).convert('RGBA')); fc = np.asarray(Image.open(os.path.join(OUT, w['face_sheet'])).convert('RGBA'))
    out = []
    for key, e in w['pieces'].items():
        if key in skip: continue
        for f, c in e.items():
            if not c: out.append((key, f, None, 0, 0)); continue
            a = (fc if f == 'portrait' else sh)[c[1]:c[1] + c[3], c[0]:c[0] + c[2]].copy()
            out.append((key, f, a, c[4], c[5]))
    return out


def main():
    a = sys.argv[1:]
    only = set(a[a.index('--only') + 1].split(',')) if '--only' in a else None
    todo = [(OWN[rid][0], KEY(rid), KEY(rid), []) for rid in OWN if not only or rid in only]
    C = AR.combos()
    ctodo = [(slot, key, cls, feats) for (slot, key), (cls, feats) in sorted(C.items()) if cls in CLASS_OWN and (not only or cls in only)]
    if '--classes' in a: todo = ctodo if '--classes-only' in a else todo + ctodo
    if '--pack' not in a:
        for slot, key, cls, feats in todo:
            t = time.time(); AR.render_piece(slot, key, cls, feats); print('  %-26s %3.0f s' % (key, time.time() - t), flush=True)
    if '--proof' in a:
        proof([(s_, k) for s_, k, c, f in todo]); return
    keys = [KEY(rid) for rid in OWN]
    redone = [(slot, key) for slot, key, cls, feats in ctodo if os.path.exists(os.path.join(AR.WORK, key, 'shots.json'))] if '--classes' in a else []
    sprites = old_sprites(set(keys) | set(k for s_, k in redone))
    for rid in OWN:
        if os.path.exists(os.path.join(AR.WORK, KEY(rid), 'shots.json')): sprites += AR.sprites_of(KEY(rid), OWN[rid][0])
    for slot, key in redone: sprites += AR.sprites_of(key, slot)
    print('sheets', AR.pack_all(sprites))
    w = json.load(open(os.path.join(OUT, 'wear.json')))
    w['what'] = ("COOK [the armour's art], rule 272(b): CHARACTER's pieces (the same shapes, its classes and extras) meshed and rendered "
                 "through DIRECTION's master rig in Blender (its light, film and source pass; the guide's camera at 45 degrees, the stretch, "
                 "57 px a metre; his head and trunk as holdouts; the family snap and the ring), the police riot helmet and the police vest "
                 "with their own art (tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py); COOK [every armour its own] 11/3: the "
                 "armory's nine pieces of the valley's own each its own model, keys own_<row> (tools/bohemia_cook_every_armour_its_own_11_3_26.py). "
                 "The anchors and cells are CHARACTER's.")
    json.dump(w, open(os.path.join(OUT, 'wear.json'), 'w'), separators=(',', ':'))
    # the rig's run of each new piece beside the old ones (the gate reads it)
    pj = os.path.join(R, 'records/target/cook_armour_rig/pieces.json'); P = json.load(open(pj))
    for rid in OWN:
        m = os.path.join(AR.WORK, KEY(rid), 'meta.json')
        if os.path.exists(m): P[KEY(rid)] = dict(json.load(open(m)), own_art=WHAT[rid])
    for slot, key in redone:
        P[key] = dict(json.load(open(os.path.join(AR.WORK, key, 'meta.json'))), own_art=CLASS_WHAT[key.split('+')[0]])
    json.dump(P, open(pj, 'w'), indent=1)
    # each of the nine rows draws its own piece
    L = json.load(open(LOOKS))
    for rid, (slot, fn) in OWN.items():
        if KEY(rid) in w['pieces'] and rid in L[slot]: L[slot][rid]['own'] = KEY(rid)
    L['_own'] = ("COOK [every armour its own] 11/3 (rule 337): a row with 'own' draws that piece off slices/wear (its own model), "
                 "else its class's (engine/bohemia_wear.js piece())")
    json.dump(L, open(LOOKS, 'w'), indent=1, ensure_ascii=False)
    print('own pieces', sorted(k for k in w['pieces'] if k.startswith('own_')))


def proof(keys):
    rows = []
    for slot, key in keys:
        new = {s[1]: s for s in AR.sprites_of(key, slot)}
        row = Image.new('RGBA', (8 * 70, 70), (88, 80, 70, 255))
        for i, f in enumerate(CH.DIRS):
            _, _, arr, dx, dy = new[f]
            if arr is None: continue
            row.alpha_composite(Image.fromarray(arr, 'RGBA'), (int(35 + i * 70 + dx), int((40 if slot == 'head' else 6) + dy)))
        rows.append(row)
    out = Image.new('RGBA', (8 * 70, 70 * len(rows)))
    for i, r in enumerate(rows): out.paste(r, (0, i * 70))
    os.makedirs(PROOF, exist_ok=True)
    out.resize((out.width * 3, out.height * 3), Image.NEAREST).save(os.path.join(PROOF, 'proof.png'))
    print('proof', os.path.join(PROOF, 'proof.png'))


if __name__ == '__main__':
    main()
