#!/usr/bin/env python3
"""BOHEMIA -- COOK [the fifty perk icons] (rule 252(c), Paolo 10/26: 'I don't want a single perk without an icon, I need you to have
icons for all the perks... I need to be able to visualize it as well as what's written for it'). STEP: the fifty perks of
records/target/bb/perks.json each a small icon in the game's Crashbox HBO look (rule 115, light and form), each showing what the
perk does, reading at the crew card's size; swapped in through UI THREE's shared perk module.

MEASURED FIRST: the fifty are pen glyphs on a dark plate inside the fight only (BOHEMIA_FIGHT.html perkIcon, rule 67): gold lines
for what he carries, blue for what he presses; flat lines, no light, no form, so the one place he sees a perk does not look like the
rest of the game (the rig's clay: the truck, the robot, the cart he fell for, rule 115).

THE METHOD IS THE RIG'S (rule 115(a)): each perk is a small model in real metres (the thing that says what the perk does: a heart
for colossus, the car door for the shield expert, a bullhorn for the rally, a molotov for throwing, a gas mask for fearsome),
written as a glTF and put through DIRECTION's master rig (tools/bohemia_direction_master_rig.py: Cycles, the guide's one sun and
sky, THE SOURCE PASS, the family snap, the ring, the contact shadow), every number the guide's. Each model STANDS facing
the camera like every prop the rig draws (the rig's 3/4 stretch shows a standing face at its full height, and its top edge a
little, the token's thickness), at the rig's 57 px a metre (each model 1.4 m across: 80 px of a 96 px plate).
THE PLATE: a worn tag with light and form (lit from the upper left like everything the rig draws, a bevel, the grain), its rim
gold for what he carries and steel blue for what he presses (the fight's colours kept), the perk's row in raised dots at its foot.

  /tmp/v/bin/python tools/bohemia_cook_the_fifty_perk_icons_10_26_26.py            all fifty (models, the rig, the plates)
  /tmp/v/bin/python tools/bohemia_cook_the_fifty_perk_icons_10_26_26.py --plates   the plates only (the rig runs already done)
  ... --only colossus,taunt

SHIPS slices/perk_icons/<id>.png (96 x 96) and slices/perk_icons/perk_icons.json (each id: its picture, row, carried or pressed,
what it shows, draft:true); UI THREE's shared module draws the picture where it has one, the pen glyph where it does not.
REFERENCE CHECK: the twins are the rig's own props in the camp and the towns (one camera, one sun) and the fight's fifty glyphs
(the same subject per perk where the glyph had one: the pipe, the sledge, the hatchet, the cleaver, the blade, the pistol, the
bottle). Battle Brothers draws a perk as a painted square icon of the thing it gives (a heart, a shield, a boot); ours is the
thing modelled. No reference game added.
"""
import os, sys, json, math, time, shutil, subprocess, fcntl

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import numpy as np
from PIL import Image
import bohemia_camp2_cook_the_camp as CT
import bohemia_cook_the_camp_through_the_rig_10_26_26 as CR

OUT = os.path.join(R, 'slices/perk_icons')
WORK = os.environ.get('COOK_PERK_WORK', '/tmp/bohemia_cook_perk_rig')
PROOF = os.path.join(R, 'records/target/cook_perk_icons')
PERKS = json.load(open(os.path.join(R, 'records/target/bb/perks.json')))['rows']
ACTIVE = ['adrenaline', 'recover', 'rotation', 'rally_the_troops', 'taunt', 'footwork', 'indomitable']   # the fight's own list (FIGHT.ACTIVE)
SIZE = 96
SPAN = 1.40                                      # every model this wide or tall, metres: 80 px at the rig's 57

MAT = dict(CT.MAT)
MAT.update({
    'blood': {'rgb': (0.50, 0.06, 0.05)}, 'blood_l': {'rgb': (0.66, 0.10, 0.08)}, 'bone': {'rgb': (0.84, 0.79, 0.66)},
    'steel': {'rgb': (0.60, 0.61, 0.60)}, 'steel_d': {'rgb': (0.36, 0.37, 0.38)}, 'skin': {'rgb': (0.72, 0.52, 0.40)},
    'paper': {'rgb': (0.86, 0.82, 0.70)}, 'leather': {'rgb': (0.38, 0.23, 0.13)}, 'brass': {'rgb': (0.74, 0.57, 0.26)},
    'glass': {'rgb': (0.52, 0.66, 0.56)}, 'heart': {'rgb': (0.68, 0.11, 0.11)}, 'olive2': {'rgb': (0.42, 0.44, 0.30)},
    'black': {'rgb': (0.09, 0.09, 0.09)}, 'fur': {'rgb': (0.46, 0.43, 0.38)}, 'fur_d': {'rgb': (0.28, 0.26, 0.23)},
    'pink': {'rgb': (0.80, 0.55, 0.55)}, 'green': {'rgb': (0.36, 0.58, 0.30)}, 'glow_r': {'rgb': (1.0, 0.20, 0.12), 'emit': True},
    'car': {'rgb': (0.48, 0.09, 0.07)}, 'window': {'rgb': (0.16, 0.22, 0.26)}, 'white2': {'rgb': (0.88, 0.86, 0.80)},
})
# the reds an icon's meaning rides on (a heart, blood, the target's rings) a step deeper than a prop's: the paint pass chalks them
MAT.update({'heart': {'rgb': (0.66, 0.06, 0.06)}, 'red': {'rgb': (0.68, 0.08, 0.06)}, 'blood': {'rgb': (0.44, 0.03, 0.03)},
            'blood_l': {'rgb': (0.58, 0.05, 0.04)}, 'stripe_b': {'rgb': (0.66, 0.14, 0.09)}})


# ----------------------------------------------------------------------------- the shapes: x right, z up, -y toward him
def ear(pts):
    """a simple polygon (x, z) cut into triangles, counter-clockwise as he sees it"""
    P = [tuple(p) for p in pts]
    area = sum(P[i][0] * P[(i + 1) % len(P)][1] - P[(i + 1) % len(P)][0] * P[i][1] for i in range(len(P)))
    idx = list(range(len(P))) if area > 0 else list(range(len(P)))[::-1]
    out = []
    def inside(p, a, b, c):
        d1 = (p[0] - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (p[1] - b[1]); d2 = (p[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (p[1] - c[1])
        d3 = (p[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (p[1] - a[1])
        return not ((d1 < 0 or d2 < 0 or d3 < 0) and (d1 > 0 or d2 > 0 or d3 > 0))
    guard = 0
    while len(idx) > 3 and guard < 5000:
        guard += 1
        for k in range(len(idx)):
            i0, i1, i2 = idx[k - 1], idx[k], idx[(k + 1) % len(idx)]
            a, b, c = P[i0], P[i1], P[i2]
            if (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 1e-12: continue
            if any(inside(P[j], a, b, c) for j in idx if j not in (i0, i1, i2)): continue
            out.append((i0, i1, i2)); idx.pop(k); break
        else:
            break
    if len(idx) == 3: out.append(tuple(idx))
    return out


def prism(m, mat, pts, d=0.16, y=0.0):
    """a flat shape in the picture's plane, d thick"""
    n = len(pts); tris = ear(pts)
    V = [(p[0], y - d / 2, p[1]) for p in pts] + [(p[0], y + d / 2, p[1]) for p in pts]
    F = [(a, c, b) for a, b, c in tris] + [(a + n, b + n, c + n) for a, b, c in tris]
    for i in range(n):
        j = (i + 1) % n; F.append((i, j, j + n)); F.append((i, j + n, i + n))
    return m.add(V, F, mat)


def bar(m, mat, p0, p1, w, d=0.14, y=0.0):
    (x0, z0), (x1, z1) = p0, p1; L = math.hypot(x1 - x0, z1 - z0) or 1e-6
    nx, nz = -(z1 - z0) / L * w / 2, (x1 - x0) / L * w / 2
    return prism(m, mat, [(x0 + nx, z0 + nz), (x0 - nx, z0 - nz), (x1 - nx, z1 - nz), (x1 + nx, z1 + nz)], d, y)


def disc(m, mat, c, r, d=0.12, y=0.0, n=28):
    return CT.cyl(m, mat, (c[0], y - d / 2, c[1]), (c[0], y + d / 2, c[1]), r, n)


def ring(m, mat, c, ro, ri, d=0.10, y=0.0, a0=0.0, a1=2 * math.pi, n=32):
    """an annulus (or a part of one, a0..a1), d thick"""
    full = abs(a1 - a0 - 2 * math.pi) < 1e-6; k = n if full else n + 1
    angs = [a0 + (a1 - a0) * i / n for i in range(k)]
    V = []
    for a in angs:
        for r in (ro, ri):
            for yy in (y - d / 2, y + d / 2):
                V.append((c[0] + r * math.cos(a), yy, c[1] + r * math.sin(a)))
    F = []
    for i in range(len(angs) - (0 if full else 1)):
        j = (i + 1) % len(angs)
        o0, i0, o1, i1 = 4 * i, 4 * i + 2, 4 * j, 4 * j + 2
        F += [(o0, i0, i1), (o0, i1, o1)]                                  # the front
        F += [(o0 + 1, o1 + 1, i1 + 1), (o0 + 1, i1 + 1, i0 + 1)]          # the back
        F += [(o0, o1, o1 + 1), (o0, o1 + 1, o0 + 1)]                      # the outside
        F += [(i0, i0 + 1, i1 + 1), (i0, i1 + 1, i1)]                      # the inside
    return m.add(V, F, mat)


def head_tri(m, mat, tip, back, w, d=0.14, y=0.0):
    """an arrowhead: its tip, the middle of its back, its width"""
    (tx, tz), (bx, bz) = tip, back; L = math.hypot(tx - bx, tz - bz) or 1e-6
    nx, nz = -(tz - bz) / L * w / 2, (tx - bx) / L * w / 2
    return prism(m, mat, [(bx + nx, bz + nz), (bx - nx, bz - nz), (tx, tz)], d, y)


def rod(m, mat, p0, p1, r, y=0.0, n=10, r2=None):
    return CT.cyl(m, mat, (p0[0], y, p0[1]), (p1[0], y, p1[1]), r, n, True, r2)


def ball(m, mat, c, rx, rz, ry=None, y=0.0, lump=0.0, seed=0, n=12):
    return CT.blob(m, mat, (c[0], y, c[1]), (rx, ry if ry is not None else min(rx, rz) * 0.75, rz), n=n, lump=lump, seed=seed, flat_bottom=False)


def tape(m, p0, p1, w=0.07, y=-0.09):
    return bar(m, 'tape', p0, p1, w, 0.02, y)


def heart(m, mat, c, s, y=0.0, d=0.30):
    pts = []
    for i in range(40):
        t = 2 * math.pi * i / 40
        x = 16 * math.sin(t) ** 3; z = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((c[0] + x / 17 * s, c[1] + z / 17 * s))
    prism(m, mat, pts[::-1], d, y)


def skull(m, c=(0, 0), s=1.0, eyes='black', y=0.0):
    ball(m, 'bone', (c[0], c[1] + 0.12 * s), 0.42 * s, 0.40 * s, 0.36 * s, y)
    prism(m, 'bone', [(c[0] - 0.26 * s, c[1] - 0.10 * s), (c[0] + 0.26 * s, c[1] - 0.10 * s), (c[0] + 0.20 * s, c[1] - 0.42 * s), (c[0] - 0.20 * s, c[1] - 0.42 * s)], 0.40 * s, y + 0.02)
    for sx in (-1, 1):
        ball(m, eyes, (c[0] + sx * 0.16 * s, c[1] + 0.06 * s), 0.11 * s, 0.10 * s, 0.05 * s, y - 0.31 * s)
    prism(m, 'black', [(c[0], c[1] - 0.06 * s), (c[0] - 0.05 * s, c[1] - 0.16 * s), (c[0] + 0.05 * s, c[1] - 0.16 * s)][::-1], 0.03, y - 0.27 * s)
    for k in range(-2, 3):
        bar(m, 'black', (c[0] + k * 0.07 * s, c[1] - 0.26 * s), (c[0] + k * 0.07 * s, c[1] - 0.40 * s), 0.025 * s, 0.03, y - 0.22 * s)


def man(m, mat, c, s=1.0, y=0.0):
    """a head and shoulders, the figure every board shows"""
    ball(m, 'skin', (c[0], c[1] + 0.30 * s), 0.17 * s, 0.20 * s, 0.17 * s, y)
    prism(m, mat, [(c[0] - 0.36 * s, c[1] - 0.45 * s), (c[0] + 0.36 * s, c[1] - 0.45 * s), (c[0] + 0.30 * s, c[1] + 0.02 * s), (c[0] + 0.12 * s, c[1] + 0.10 * s),
                   (c[0] - 0.12 * s, c[1] + 0.10 * s), (c[0] - 0.30 * s, c[1] + 0.02 * s)], 0.30 * s, y)


def target(m, c, r, y=0.0, rings=3):
    for i in range(rings):
        ro = r * (rings - i) / rings
        disc(m, 'red' if i % 2 == 0 else 'white2', c, ro, 0.06, y - 0.03 * i, 32)
    disc(m, 'red', c, r / rings * 0.5, 0.06, y - 0.03 * rings, 20)


def bullet(m, c, ang, L=0.34, r=0.06, y=-0.05):
    dx, dz = math.cos(ang), math.sin(ang)
    rod(m, 'brass', (c[0] - dx * L / 2, c[1] - dz * L / 2), (c[0] + dx * L * 0.15, c[1] + dz * L * 0.15), r, y, 12)
    rod(m, 'rust', (c[0] + dx * L * 0.15, c[1] + dz * L * 0.15), (c[0] + dx * L / 2, c[1] + dz * L / 2), r, y, 12, r2=0.01)


def knife(m, base, ang, L=1.0, y=0.0, blade='steel'):
    dx, dz = math.cos(ang), math.sin(ang); px, pz = -dz, dx; hx, hz = base[0] + dx * L * 0.36, base[1] + dz * L * 0.36
    bar(m, 'leather', base, (hx, hz), 0.17, 0.14, y)
    for t in (0.1, 0.22): tape(m, (base[0] + dx * L * t - px * 0.07, base[1] + dz * L * t - pz * 0.07), (base[0] + dx * L * t + px * 0.07, base[1] + dz * L * t + pz * 0.07), 0.05, y - 0.07)
    bar(m, 'iron', (hx - px * 0.11, hz - pz * 0.11), (hx + px * 0.11, hz + pz * 0.11), 0.05, 0.14, y)
    tx, tz = base[0] + dx * L, base[1] + dz * L
    prism(m, blade, [(hx + px * 0.11, hz + pz * 0.11), (hx - px * 0.10, hz - pz * 0.10), (tx - px * 0.03, tz - pz * 0.03), (tx, tz)], 0.06, y)


# ----------------------------------------------------------------------------- the fifty
def p_fast_adaptation(m):
    target(m, (-0.05, -0.05), 0.55)
    disc(m, 'black', (0.30, 0.22), 0.05, 0.02, -0.14, 12); disc(m, 'black', (-0.28, -0.30), 0.05, 0.02, -0.14, 12)
    for k in range(3):   # the climb: a stair of chevrons, each a miss turned into a step
        z = 0.15 + k * 0.17
        prism(m, 'brass', [(0.38, z), (0.52, z + 0.12), (0.66, z), (0.66, z - 0.07), (0.52, z + 0.05), (0.38, z - 0.07)], 0.10, -0.20)

def p_crippling_strikes(m):
    for sgn in (-1, 1):
        a = math.radians(55 if sgn < 0 else 235); cx, cz = sgn * 0.27, sgn * 0.20
        rod(m, 'bone', (cx - sgn * 0.42 * math.cos(math.radians(35)), cz - sgn * 0.42 * math.sin(math.radians(35))), (cx + sgn * 0.02, cz + sgn * 0.0), 0.085, 0, 10)
        ball(m, 'bone', (cx - sgn * 0.46 * math.cos(math.radians(35)) - 0.05, cz - sgn * 0.46 * math.sin(math.radians(35))), 0.11, 0.11, 0.10)
        ball(m, 'bone', (cx - sgn * 0.46 * math.cos(math.radians(35)) + 0.06, cz - sgn * 0.46 * math.sin(math.radians(35)) + 0.06), 0.10, 0.10, 0.09)
    prism(m, 'bone', [(-0.24, 0.17), (-0.10, 0.10), (-0.17, 0.04), (-0.05, -0.02), (-0.22, 0.08)], 0.12, 0)
    prism(m, 'bone', [(0.24, -0.17), (0.10, -0.10), (0.17, -0.04), (0.05, 0.02), (0.22, -0.08)], 0.12, 0)
    for (x, z) in ((-0.02, 0.05), (0.04, -0.05), (0.0, 0.0)):
        ball(m, 'blood_l', (x, z), 0.05, 0.05, 0.04, -0.06)

def p_colossus(m):
    heart(m, 'heart', (0.0, 0.02), 0.58)
    bar(m, 'white2', (0.34, 0.42), (0.34, 0.70), 0.10, 0.10, -0.19); bar(m, 'white2', (0.20, 0.56), (0.48, 0.56), 0.10, 0.10, -0.19)

def p_nine_lives(m):
    ball(m, 'fur_d', (0, -0.05), 0.50, 0.44, 0.34)
    for sx in (-1, 1):
        prism(m, 'fur_d', [(sx * 0.46, 0.18), (sx * 0.12, 0.30), (sx * 0.42, 0.66)][::(1 if sx < 0 else -1)], 0.18, 0.02)
        prism(m, 'pink', [(sx * 0.38, 0.28), (sx * 0.22, 0.32), (sx * 0.37, 0.52)][::(1 if sx < 0 else -1)], 0.04, -0.08)
        ball(m, 'green', (sx * 0.18, 0.02), 0.09, 0.11, 0.05, -0.30)
        ball(m, 'black', (sx * 0.18, 0.02), 0.03, 0.09, 0.03, -0.35)
        for k in (-1, 1): bar(m, 'white2', (sx * 0.18, -0.20 + k * 0.03), (sx * 0.62, -0.14 + k * 0.10), 0.018, 0.02, -0.30)
    prism(m, 'pink', [(-0.06, -0.12), (0.06, -0.12), (0.0, -0.20)][::-1], 0.04, -0.33)
    tape(m, (0.22, 0.30), (0.40, 0.12), 0.07, -0.30)

def p_bags_and_belts(m):
    bar(m, 'leather', (-0.70, 0.10), (0.70, 0.10), 0.16, 0.10, 0.0)
    prism(m, 'brass', [(-0.10, 0.22), (0.10, 0.22), (0.10, -0.02), (-0.10, -0.02)], 0.06, -0.08)
    prism(m, 'leather', [(-0.06, 0.16), (0.06, 0.16), (0.06, 0.04), (-0.06, 0.04)], 0.06, -0.12)
    for x, w in ((-0.42, 0.30), (0.42, 0.34)):
        prism(m, 'olive2', [(x - w / 2, 0.04), (x + w / 2, 0.04), (x + w / 2 - 0.02, -0.50), (x - w / 2 + 0.02, -0.50)], 0.24, -0.05)
        prism(m, 'olive_d', [(x - w / 2 - 0.01, 0.06), (x + w / 2 + 0.01, 0.06), (x + w / 2, -0.16), (x, -0.22), (x - w / 2, -0.16)], 0.06, -0.19)
        disc(m, 'brass', (x, -0.17), 0.03, 0.03, -0.23, 10)
    tape(m, (0.30, -0.30), (0.54, -0.36), 0.07, -0.18)

def p_pathfinder(m):
    prism(m, 'leather', [(-0.45, -0.30), (0.52, -0.30), (0.56, -0.18), (0.42, -0.10), (0.05, 0.02), (0.02, 0.52), (-0.36, 0.52), (-0.38, -0.05), (-0.48, -0.15)], 0.34, 0)
    bar(m, 'black', (-0.50, -0.34), (0.58, -0.34), 0.10, 0.36, 0)
    for k in range(4): bar(m, 'rope', (-0.02, 0.40 - k * 0.11), (-0.32, 0.40 - k * 0.11 + 0.03), 0.025, 0.04, -0.18)
    for (x, z, r) in ((-0.58, -0.56, 0.12), (-0.18, -0.60, 0.10), (0.22, -0.56, 0.13), (0.58, -0.60, 0.09)):
        ball(m, 'stone', (x, z), r, r * 0.7, r * 0.8, 0, 0.3, int(abs(x) * 100) + 7)

def p_adrenaline(m):
    a = math.radians(-35); dx, dz = math.cos(a), math.sin(a)
    def P(t, o=0.0): return (-0.52 * dx + t * dx - o * dz, -0.52 * dz + t * dz + o * dx)
    rod(m, 'glass', P(0.18), P(0.78), 0.14, 0, 16)
    rod(m, 'red', P(0.24), P(0.60), 0.115, -0.02, 16)
    rod(m, 'white2', P(0.78), P(0.84), 0.15, 0, 16)
    rod(m, 'steel', P(0.84), P(1.25), 0.012, 0, 6)
    rod(m, 'steel_d', P(0.0), P(0.18), 0.04, 0, 8); rod(m, 'white2', P(-0.04), P(0.02), 0.16, 0, 16)
    for t in (0.36, 0.48, 0.60): bar(m, 'black', P(t, 0.14), P(t, 0.07), 0.015, 0.02, -0.15)
    prism(m, 'brass', [(0.30, 0.62), (0.12, 0.30), (0.24, 0.30), (0.10, 0.02), (0.38, 0.38), (0.26, 0.38)], 0.08, -0.12)

def p_recover(m):
    ball(m, 'olive2', (0, -0.10), 0.42, 0.50, 0.24)
    rod(m, 'olive_d', (0, 0.36), (0, 0.48), 0.10, 0, 12); rod(m, 'black', (0, 0.48), (0, 0.56), 0.12, 0, 12)
    bar(m, 'leather', (-0.40, 0.10), (-0.62, 0.60), 0.07, 0.04, 0.0); bar(m, 'leather', (0.40, 0.10), (0.62, 0.60), 0.07, 0.04, 0.0)
    bar(m, 'canvas', (-0.38, -0.08), (0.38, -0.08), 0.16, 0.06, -0.20)
    for k in range(3): disc(m, 'tarp', (-0.18 + k * 0.18, -0.36), 0.05, 0.04, -0.22, 12)

def p_student(m):
    prism(m, 'paper', [(-0.66, -0.20), (0.0, -0.32), (0.0, 0.34), (-0.66, 0.44)], 0.06, 0.0)
    prism(m, 'paper', [(0.0, -0.32), (0.66, -0.20), (0.66, 0.44), (0.0, 0.34)], 0.06, 0.0)
    prism(m, 'leather', [(-0.70, -0.26), (0.0, -0.38), (0.70, -0.26), (0.70, -0.20), (0.0, -0.32), (-0.70, -0.20)], 0.10, 0.04)
    for k in range(5):
        z = 0.26 - k * 0.11
        bar(m, 'steel_d', (-0.56, z + 0.02 - k * 0.0), (-0.10, z - 0.04), 0.022, 0.02, -0.04)
        bar(m, 'steel_d', (0.10, z - 0.04), (0.56, z + 0.02), 0.022, 0.02, -0.04)
    a = math.radians(-50); rod(m, 'jug', (0.10, 0.62), (0.10 + 0.60 * math.cos(a), 0.62 + 0.60 * math.sin(a)), 0.045, -0.12, 6)
    rod(m, 'wood', (0.10 + 0.60 * math.cos(a), 0.62 + 0.60 * math.sin(a)), (0.10 + 0.70 * math.cos(a), 0.62 + 0.70 * math.sin(a)), 0.045, -0.12, 6, r2=0.008)

def p_executioner(m):
    rod(m, 'wood', (0.36, -0.68), (-0.28, 0.58), 0.08, 0, 10)
    tape(m, (0.30, -0.50), (0.22, -0.34), 0.13, -0.07)
    prism(m, 'steel', [(-0.30, 0.14), (-0.04, 0.34), (-0.02, 0.70), (-0.56, 0.70), (-0.74, 0.44), (-0.68, 0.18)], 0.08, -0.02)
    prism(m, 'steel_d', [(-0.68, 0.18), (-0.74, 0.44), (-0.56, 0.70), (-0.64, 0.70), (-0.80, 0.44), (-0.74, 0.16)], 0.09, -0.02)
    for (x, z, r) in ((-0.60, 0.20, 0.06), (-0.62, 0.04, 0.05), (-0.58, -0.10, 0.07)):
        ball(m, 'blood', (x, z), r * 0.8, r, r * 0.7, -0.04)
    prism(m, 'blood', [(0.18, -0.70), (0.66, -0.70), (0.58, -0.52), (0.40, -0.58), (0.30, -0.48), (0.22, -0.60)], 0.04, 0.0)

def p_bullseye(m):
    prism(m, 'wood_d', [(-0.70, -0.70), (-0.08, -0.70), (-0.08, 0.70), (-0.70, 0.70)], 0.20, -0.30)
    target(m, (0.12, 0.0), 0.56, 0.06)
    disc(m, 'black', (0.12, 0.0), 0.045, 0.02, -0.08, 12)
    ring(m, 'steel_d', (0.12, 0.0), 0.66, 0.60, 0.04, -0.40)
    for (a, b) in (((0.12, 0.66), (0.12, 0.40)), ((0.12, -0.66), (0.12, -0.40)), ((-0.54, 0.0), (-0.28, 0.0)), ((0.78, 0.0), (0.52, 0.0))):
        bar(m, 'steel_d', a, b, 0.035, 0.04, -0.40)

def p_dodge(m):
    man(m, 'olive_d', (-0.18, -0.20), 1.0, 0.0)
    for k, (z, L) in enumerate(((0.32, 0.64), (0.18, 0.46), (0.04, 0.30))):
        bar(m, 'white2', (0.70, z + 0.04), (0.70 - L, z + 0.04), 0.022, 0.02, -0.25)
    bullet(m, (0.58, 0.40), math.radians(180), 0.32, 0.055, -0.25)
    for k in range(3): bar(m, 'brass', (-0.62 - k * 0.0, 0.40 - k * 0.14), (-0.46, 0.34 - k * 0.14), 0.035, 0.04, -0.20)

def p_fortified_mind(m):
    ball(m, 'pink', (-0.16, 0.06), 0.36, 0.36, 0.32, 0, 0.18, 5)
    ball(m, 'pink', (0.16, 0.06), 0.36, 0.36, 0.32, 0, 0.18, 6)
    for k in range(5):
        bar(m, 'blood_l', (-0.44 + k * 0.2, 0.30 - (k % 2) * 0.12), (-0.34 + k * 0.2, 0.0 + (k % 2) * 0.1), 0.025, 0.03, -0.30)
    ring(m, 'steel', (0, 0.06), 0.62, 0.50, 0.20, 0.0, math.radians(200), math.radians(340))
    for x in (-0.52, 0.52): disc(m, 'iron', (x, -0.12), 0.05, 0.05, -0.12, 10)
    prism(m, 'steel', [(-0.62, -0.28), (0.62, -0.28), (0.56, -0.44), (-0.56, -0.44)], 0.30, 0)
    for x in (-0.44, -0.16, 0.16, 0.44): disc(m, 'iron', (x, -0.36), 0.035, 0.04, -0.17, 8)

def p_resilient(m):
    rod(m, 'white2', (-0.30, 0.10), (0.30, 0.10), 0.36, 0, 24)
    disc(m, 'canvas', (-0.31, 0.10), 0.36, 0.02, 0, 24)
    ring(m, 'paper', (-0.31, 0.10), 0.36, 0.10, 0.04, -0.0)
    prism(m, 'white2', [(0.18, -0.26), (0.62, -0.26), (0.66, -0.60), (0.22, -0.66)], 0.03, -0.30)
    bar(m, 'red', (0.05, 0.10), (0.05, 0.42), 0.12, 0.04, -0.37); bar(m, 'red', (-0.11, 0.26), (0.21, 0.26), 0.12, 0.04, -0.37)

def p_steel_brow(m):
    CT.blob(m, 'steel', (0, 0, -0.14), (0.56, 0.42, 0.56), n=14, flat_bottom=True)
    prism(m, 'steel_d', [(-0.70, -0.16), (0.70, -0.16), (0.62, -0.26), (-0.62, -0.26)], 0.70, 0)
    bar(m, 'steel_d', (-0.50, 0.04), (0.50, 0.04), 0.10, 0.08, -0.40)
    for x in (-0.36, -0.12, 0.12, 0.36): disc(m, 'iron', (x, 0.04), 0.03, 0.03, -0.45, 8)
    prism(m, 'brass', [(-0.06, 0.40), (0.06, 0.40), (0.08, 0.12), (-0.08, 0.12)], 0.04, -0.38)
    tape(m, (0.16, 0.36), (0.40, 0.16), 0.07, -0.40)

def p_quick_hands(m):
    bar(m, 'steel_d', (-0.62, -0.50), (0.10, 0.50), 0.12, 0.12, 0.05)
    rod(m, 'steel_d', (-0.62, -0.50), (-0.66, -0.56), 0.09, 0.05, 10)
    prism(m, 'black', [(0.10, 0.16), (0.62, 0.16), (0.62, 0.26), (0.10, 0.26)], 0.10, -0.10)
    prism(m, 'black', [(0.12, 0.16), (0.30, 0.16), (0.26, -0.18), (0.10, -0.18)], 0.10, -0.10)
    ring(m, 'brass', (0.0, 0.0), 0.62, 0.54, 0.06, -0.22, math.radians(20), math.radians(110))
    head_tri(m, 'brass', (-0.26, 0.68), (-0.16, 0.52), 0.18, 0.06, -0.22)
    ring(m, 'brass', (0.0, 0.0), 0.62, 0.54, 0.06, -0.22, math.radians(200), math.radians(290))
    head_tri(m, 'brass', (0.26, -0.68), (0.16, -0.52), 0.18, 0.06, -0.22)

def p_gifted(m):
    prism(m, 'canvas', [(-0.50, -0.62), (0.50, -0.62), (0.50, 0.10), (-0.50, 0.10)], 0.60, 0)
    prism(m, 'olive', [(-0.56, 0.10), (0.56, 0.10), (0.56, 0.28), (-0.56, 0.28)], 0.66, 0)
    bar(m, 'red', (0.0, -0.62), (0.0, 0.28), 0.16, 0.02, -0.34)
    bar(m, 'red', (-0.56, 0.18), (0.56, 0.18), 0.12, 0.02, -0.34)
    ring(m, 'red', (-0.18, 0.44), 0.18, 0.08, 0.08, -0.10); ring(m, 'red', (0.18, 0.44), 0.18, 0.08, 0.08, -0.10)
    pts = []
    for i in range(10):
        r = 0.22 if i % 2 == 0 else 0.09; a = math.pi / 2 + i * math.pi / 5
        pts.append((0.46 + r * math.cos(a), 0.52 + r * math.sin(a)))
    prism(m, 'brass', pts, 0.06, -0.36)

def p_backstabber(m):
    prism(m, 'olive_d', [(-0.56, -0.70), (0.56, -0.70), (0.52, 0.20), (0.30, 0.42), (-0.30, 0.42), (-0.52, 0.20)], 0.40, 0.05)
    ball(m, 'skin', (0, 0.52), 0.18, 0.18, 0.16, 0.05)
    bar(m, 'fur_d', (0.0, 0.42), (0.0, -0.70), 0.03, 0.02, -0.16)
    knife(m, (0.62, 0.40), math.radians(-150), 0.86, -0.20)
    for (x, z) in ((-0.06, -0.06), (-0.04, -0.20), (-0.10, -0.14)): ball(m, 'blood', (x, z), 0.07, 0.08, 0.04, -0.18)

def p_anticipation(m):
    ball(m, 'white2', (-0.12, 0.0), 0.50, 0.28, 0.22)
    prism(m, 'skin', [(-0.70, 0.0), (-0.40, 0.30), (0.0, 0.40), (0.40, 0.24), (0.46, 0.18), (0.0, 0.32), (-0.40, 0.24)], 0.40, -0.02)
    prism(m, 'skin', [(-0.70, 0.0), (-0.40, -0.24), (0.0, -0.30), (0.46, -0.16), (0.40, -0.22), (0.0, -0.38), (-0.40, -0.30)][::-1], 0.40, -0.02)
    disc(m, 'olive_d', (-0.06, 0.0), 0.18, 0.04, -0.21, 24); disc(m, 'black', (-0.04, 0.0), 0.09, 0.03, -0.24, 16)
    disc(m, 'white2', (-0.10, 0.06), 0.035, 0.02, -0.26, 8)
    bullet(m, (0.54, 0.46), math.radians(-150), 0.36, 0.06, -0.20)
    for k in range(2): bar(m, 'white2', (0.70, 0.66 - k * 0.12), (0.56, 0.58 - k * 0.12), 0.02, 0.02, -0.20)

def p_shield_expert(m):
    prism(m, 'car', [(-0.62, -0.66), (0.58, -0.66), (0.62, 0.0), (0.42, 0.18), (-0.62, 0.18)], 0.16, 0)
    prism(m, 'black', [(-0.62, 0.18), (0.42, 0.18), (0.20, 0.64), (-0.56, 0.64)], 0.10, 0.04)
    prism(m, 'window', [(-0.52, 0.24), (0.32, 0.24), (0.14, 0.56), (-0.48, 0.56)], 0.04, -0.03)
    for (x, z) in ((-0.20, 0.42), (0.02, 0.30)): bar(m, 'white2', (x, z), (x + 0.12, z + 0.10), 0.02, 0.01, -0.06)
    bar(m, 'steel', (0.16, -0.06), (0.42, -0.06), 0.06, 0.04, -0.10)
    for (x, z) in ((-0.44, -0.30), (-0.10, -0.48), (0.24, -0.34)): disc(m, 'black', (x, z), 0.035, 0.02, -0.09, 10)
    tape(m, (-0.50, -0.10), (-0.10, -0.20), 0.08, -0.10)
    bar(m, 'brass', (0.52, -0.70), (0.52, -0.40), 0.07, 0.04, -0.20); bar(m, 'brass', (0.38, -0.55), (0.66, -0.55), 0.07, 0.04, -0.20)

def p_brawny(m):
    rod(m, 'skin', (-0.56, -0.40), (0.06, -0.40), 0.16, 0, 12)
    rod(m, 'skin', (0.06, -0.40), (0.22, 0.30), 0.15, 0, 12)
    ball(m, 'skin', (-0.22, -0.30), 0.30, 0.20, 0.18)
    ball(m, 'skin', (0.26, 0.40), 0.18, 0.18, 0.16)
    prism(m, 'olive_d', [(-0.70, -0.62), (-0.48, -0.62), (-0.48, -0.16), (-0.70, -0.16)], 0.34, 0.02)
    rod(m, 'steel_d', (0.05, 0.56), (0.47, 0.56), 0.035, -0.05, 8)
    for x in (0.05, 0.47): disc(m, 'iron', (x, 0.56), 0.13, 0.08, -0.05, 18)
    tape(m, (-0.36, -0.44), (-0.34, -0.26), 0.06, -0.16)

def p_relentless(m):
    disc(m, 'steel', (0, -0.06), 0.56, 0.14, 0, 32)
    disc(m, 'paper', (0, -0.06), 0.47, 0.04, -0.08, 32)
    rod(m, 'steel_d', (0, 0.50), (0, 0.62), 0.07, 0, 10); disc(m, 'steel', (0, 0.66), 0.10, 0.10, 0, 14)
    for k in range(12):
        a = k * math.pi / 6; r0 = 0.40 if k % 3 else 0.34
        bar(m, 'black', (0.44 * math.cos(a), -0.06 + 0.44 * math.sin(a)), (r0 * math.cos(a), -0.06 + r0 * math.sin(a)), 0.03, 0.02, -0.11)
    prism(m, 'red', [(0, -0.06), (0.32, 0.10), (0.30, 0.14)], 0.02, -0.13)
    prism(m, 'red', [(0, -0.06), (0.32, 0.10), (0.30, 0.14)][::-1], 0.02, -0.13)
    bar(m, 'black', (0, -0.06), (-0.22, 0.20), 0.05, 0.02, -0.12)

def p_rotation(m):
    man(m, 'olive_d', (-0.36, -0.30), 0.62, 0.05); man(m, 'tarp_d', (0.36, -0.30), 0.62, 0.05)
    ring(m, 'brass', (0, -0.10), 0.62, 0.52, 0.06, -0.20, math.radians(30), math.radians(150))
    head_tri(m, 'brass', (-0.62, 0.0), (-0.52, 0.28), 0.22, 0.06, -0.20)
    ring(m, 'brass', (0, -0.10), 0.62, 0.52, 0.06, -0.20, math.radians(210), math.radians(330))
    head_tri(m, 'brass', (0.62, -0.20), (0.52, -0.48), 0.22, 0.06, -0.20)

def p_rally_the_troops(m):
    rod(m, 'white2', (-0.42, 0.04), (0.40, 0.26), 0.12, 0, 16, r2=0.36)
    disc(m, 'black', (0.40, 0.26), 0.33, 0.02, -0.0, 24)
    rod(m, 'red', (-0.58, 0.0), (-0.40, 0.04), 0.14, 0, 16)
    bar(m, 'black', (-0.36, 0.0), (-0.40, -0.40), 0.10, 0.10, 0.02)
    tape(m, (0.0, 0.32), (0.14, 0.02), 0.08, -0.25)
    for k in range(3):
        ring(m, 'brass', (0.42, 0.26), 0.48 + k * 0.10, 0.44 + k * 0.10, 0.04, -0.10, math.radians(-30), math.radians(70))

def p_taunt(m):
    prism(m, 'olive_d', [(-0.56, -0.70), (0.56, -0.70), (0.52, 0.20), (0.30, 0.40), (-0.30, 0.40), (-0.52, 0.20)], 0.34, 0.05)
    ball(m, 'skin', (0, 0.54), 0.18, 0.18, 0.16, 0.05)
    target(m, (0.0, -0.18), 0.34, -0.14)
    for sx in (-1, 1):
        head_tri(m, 'red', (sx * 0.08, 0.22 if sx < 0 else 0.22), (sx * 0.48, 0.52), 0.14, 0.04, -0.22)
        head_tri(m, 'red', (sx * 0.46, -0.18), (sx * 0.74, -0.18), 0.14, 0.04, -0.22)

def p_mace_mastery(m):
    rod(m, 'steel_d', (-0.48, -0.58), (0.26, 0.28), 0.075, 0, 12)
    rod(m, 'steel', (0.26, 0.28), (0.30, 0.32), 0.12, 0, 14); rod(m, 'steel_d', (0.30, 0.32), (0.56, 0.32), 0.10, 0, 14)
    rod(m, 'rust', (0.56, 0.32), (0.62, 0.32), 0.13, 0, 14)
    for k in range(4): tape(m, (-0.50 + k * 0.06, -0.40 + k * 0.07), (-0.36 + k * 0.06, -0.52 + k * 0.07), 0.06, -0.09)
    bar(m, 'brass', (-0.60, 0.40), (-0.30, 0.40), 0.06, 0.04, -0.10); bar(m, 'brass', (-0.45, 0.25), (-0.45, 0.55), 0.06, 0.04, -0.10)

def p_flail_mastery(m):
    rod(m, 'wood', (-0.58, -0.62), (-0.12, -0.04), 0.08, 0, 10)
    for k in range(5):
        a = math.radians(70 - k * 12); c = (-0.12 + 0.12 * k, 0.04 + 0.10 * k - 0.02 * k * k)
        ring(m, 'iron', c, 0.10, 0.05, 0.05, 0.0 if k % 2 else -0.03)
    disc(m, 'steel_d', (0.46, 0.30), 0.22, 0.18, 0, 20)
    for k in range(6):
        a = k * math.pi / 3; rod(m, 'steel', (0.46 + 0.20 * math.cos(a), 0.30 + 0.20 * math.sin(a)), (0.46 + 0.32 * math.cos(a), 0.30 + 0.32 * math.sin(a)), 0.04, -0.02, 6, r2=0.004)

def p_hammer_mastery(m):
    rod(m, 'wood', (-0.50, -0.66), (0.18, 0.26), 0.08, 0, 10)
    tape(m, (-0.52, -0.48), (-0.38, -0.58), 0.06, -0.07); tape(m, (-0.46, -0.40), (-0.32, -0.50), 0.06, -0.07)
    CT.box(m, 'iron', (0.20, 0.0, 0.30), (0.74, 0.30, 0.32), tilt_y=math.radians(-37))
    CT.box(m, 'steel_d', (0.20, 0.0, 0.30), (0.78, 0.26, 0.26), tilt_y=math.radians(-37))

def p_axe_mastery(m):
    rod(m, 'wood', (-0.42, -0.68), (0.20, 0.60), 0.08, 0, 10)
    prism(m, 'steel_d', [(0.04, 0.26), (0.40, 0.18), (0.62, 0.02), (0.68, 0.36), (0.58, 0.66), (0.40, 0.52), (0.14, 0.50)], 0.08, 0)
    prism(m, 'steel', [(0.58, 0.04), (0.66, 0.08), (0.70, 0.36), (0.62, 0.62), (0.56, 0.60), (0.62, 0.36)], 0.09, -0.01)
    tape(m, (-0.42, -0.50), (-0.30, -0.56), 0.07, -0.07)

def p_cleaver_mastery(m):
    knife(m, (-0.58, -0.58), math.radians(42), 0.40, 0.0)
    prism(m, 'steel', [(-0.32, -0.30), (0.12, 0.14), (0.62, 0.20), (0.66, 0.62), (0.40, 0.66), (-0.40, -0.12)], 0.06, 0)
    disc(m, 'black', (0.46, 0.48), 0.06, 0.08, 0, 12)
    for (x, z, r) in ((0.62, 0.08, 0.05), (0.58, -0.06, 0.04), (0.64, -0.18, 0.06)): ball(m, 'blood', (x, z), r * 0.8, r, r * 0.6, -0.04)

def p_sword_mastery(m):
    knife(m, (-0.60, -0.62), math.radians(45), 1.72, 0.0)

def p_dagger_mastery(m):
    knife(m, (-0.44, -0.58), math.radians(55), 1.20, 0.0)
    for k in range(3): bar(m, 'brass', (0.32 + k * 0.12, -0.10 + k * 0.12), (0.52 + k * 0.12, -0.04 + k * 0.12), 0.035, 0.04, -0.12)

def p_polearm_mastery(m):
    rod(m, 'wood', (-0.62, -0.70), (0.42, 0.52), 0.075, 0, 10)
    prism(m, 'steel', [(0.30, 0.38), (0.62, 0.70), (0.52, 0.42), (0.68, 0.30), (0.46, 0.30)], 0.06, 0)
    prism(m, 'steel_d', [(0.30, 0.38), (0.20, 0.52), (0.10, 0.46), (0.22, 0.30)], 0.06, 0)
    for t in (0.2, 0.5): tape(m, (-0.62 + 1.04 * t - 0.06, -0.70 + 1.22 * t + 0.05), (-0.62 + 1.04 * t + 0.06, -0.70 + 1.22 * t - 0.05), 0.06, -0.06)

def p_spear_mastery(m):
    rod(m, 'wood', (-0.66, -0.66), (0.40, 0.40), 0.095, 0, 10)
    prism(m, 'steel', [(0.22, 0.30), (0.38, 0.22), (0.62, 0.36), (0.74, 0.74), (0.36, 0.62), (0.22, 0.38)], 0.08, 0)
    ball(m, 'red', (0.16, 0.10), 0.16, 0.12, 0.08, -0.02, 0.3, 9); ball(m, 'red', (0.08, -0.02), 0.10, 0.14, 0.06, -0.03, 0.3, 10)   # the rag tied under the blade
    for t in (0.55, 0.62, 0.69): tape(m, (-0.66 + 1.06 * t - 0.06, -0.66 + 1.06 * t + 0.06), (-0.66 + 1.06 * t + 0.06, -0.66 + 1.06 * t - 0.06), 0.05, -0.06)
    rod(m, 'red', (0.30, 0.30), (0.20, 0.10), 0.03, -0.04, 6, r2=0.005)

def p_crossbow_mastery(m):
    prism(m, 'wood', [(-0.70, -0.26), (-0.36, -0.14), (-0.16, -0.02), (0.10, -0.02), (0.10, 0.10), (-0.28, 0.10), (-0.70, -0.06)], 0.12, 0)
    bar(m, 'iron', (-0.10, 0.04), (0.70, 0.04), 0.07, 0.07, 0)
    bar(m, 'iron', (0.0, -0.02), (0.10, -0.26), 0.09, 0.10, 0)
    rod(m, 'black', (-0.12, 0.22), (0.28, 0.22), 0.06, -0.01, 12); rod(m, 'black', (0.28, 0.22), (0.34, 0.22), 0.08, -0.01, 12)
    for x in (-0.04, 0.20): bar(m, 'black', (x, 0.10), (x, 0.18), 0.04, 0.05, 0)
    tape(m, (0.36, 0.10), (0.44, -0.02), 0.08, -0.06)
    for k in range(3): bar(m, 'brass', (-0.40 + k * 0.14, -0.52), (-0.32 + k * 0.14, -0.38), 0.05, 0.04, -0.06)

def p_bow_mastery(m):
    ring(m, 'wood', (0.20, 0.0), 0.70, 0.59, 0.10, 0, math.radians(110), math.radians(250))
    bar(m, 'white2', (-0.03, 0.64), (-0.03, -0.64), 0.022, 0.02, -0.02)
    rod(m, 'wood_d', (-0.30, 0.0), (0.60, 0.0), 0.035, -0.05, 6)
    head_tri(m, 'steel', (0.72, 0.0), (0.58, 0.0), 0.12, 0.03, -0.05)
    for s in (-1, 1): prism(m, 'red', [(-0.36, 0.0), (-0.20, 0.0), (-0.24, s * 0.08), (-0.40, s * 0.08)], 0.02, -0.05)
    tape(m, (-0.47, 0.10), (-0.47, -0.10), 0.08, -0.06)

def p_throwing_mastery(m):
    rod(m, 'glass', (-0.04, -0.66), (-0.04, 0.10), 0.22, 0, 16)
    ball(m, 'glass', (-0.04, 0.10), 0.22, 0.12, 0.22)
    rod(m, 'glass', (-0.04, 0.12), (-0.04, 0.42), 0.075, 0, 12)
    rod(m, 'jug', (-0.04, -0.62), (-0.04, -0.10), 0.20, -0.005, 16)
    prism(m, 'canvas', [(-0.10, 0.40), (0.04, 0.40), (0.10, 0.52), (-0.02, 0.56)], 0.08, -0.02)
    prism(m, 'flame_o', [(-0.14, 0.50), (0.14, 0.48), (0.24, 0.62), (0.10, 0.70), (0.12, 0.84), (-0.04, 0.72), (-0.12, 0.84), (-0.18, 0.64)], 0.08, -0.04)
    prism(m, 'flame_y', [(-0.06, 0.52), (0.08, 0.52), (0.10, 0.62), (0.02, 0.70), (-0.08, 0.62)], 0.06, -0.09)
    tape(m, (-0.26, -0.30), (0.18, -0.30), 0.10, -0.24)
    for k in range(3): bar(m, 'brass', (0.36 + k * 0.12, -0.20 + k * 0.18), (0.50 + k * 0.12, -0.16 + k * 0.18), 0.04, 0.04, -0.10)

def p_reach_advantage(m):
    rod(m, 'wood', (-0.70, -0.40), (0.50, 0.20), 0.075, 0, 10)
    prism(m, 'steel', [(0.44, 0.12), (0.56, 0.24), (0.72, 0.30), (0.58, 0.12)], 0.06, 0)
    for k in range(3):
        z = -0.62 + k * 0.17
        prism(m, 'brass', [(-0.10, z), (0.14, z + 0.12), (0.38, z), (0.38, z - 0.07), (0.14, z + 0.05), (-0.10, z - 0.07)], 0.10, -0.12)
    disc(m, 'steel_d', (-0.42, 0.32), 0.26, 0.10, -0.04, 6)

def p_overwhelm(m):
    man(m, 'olive_d', (0.0, -0.34), 0.80, 0.05)
    for (x, a) in ((-0.48, -60), (0.0, -90), (0.48, -120)):
        r = math.radians(a)
        bar(m, 'brass', (x - math.cos(r) * 0.42, 0.66), (x - math.cos(r) * 0.16, 0.34), 0.07, 0.05, -0.25)
        head_tri(m, 'brass', (x - math.cos(r) * 0.06, 0.20), (x - math.cos(r) * 0.18, 0.36), 0.20, 0.05, -0.25)

def p_lone_wolf(m):
    ball(m, 'fur', (0, 0.02), 0.40, 0.40, 0.34)
    for sx in (-1, 1):
        prism(m, 'fur_d', [(sx * 0.36, 0.20), (sx * 0.12, 0.34), (sx * 0.40, 0.70)][::(1 if sx < 0 else -1)], 0.16, 0.02)
        prism(m, 'brass', [(sx * 0.26, 0.10), (sx * 0.08, 0.06), (sx * 0.24, 0.02)][::(1 if sx > 0 else -1)], 0.03, -0.32)
    ball(m, 'fur', (0, -0.26), 0.20, 0.28, 0.30, -0.18)
    ball(m, 'black', (0, -0.18), 0.07, 0.05, 0.05, -0.47)
    prism(m, 'fur', [(-0.40, -0.10), (-0.66, -0.40), (-0.30, -0.30)], 0.20, 0.02)
    prism(m, 'fur', [(0.40, -0.10), (0.30, -0.30), (0.66, -0.40)], 0.20, 0.02)
    for k in (-1, 1): prism(m, 'white2', [(k * 0.10, -0.40), (k * 0.06, -0.52), (k * 0.03, -0.40)][::(1 if k > 0 else -1)], 0.02, -0.40)

def p_underdog(m):
    for x in (-0.44, 0.44):
        man(m, 'black', (x, -0.06), 0.95, 0.22)
    ball(m, 'fur', (0, -0.40), 0.24, 0.20, 0.20, -0.20)
    ball(m, 'fur', (0, -0.12), 0.17, 0.16, 0.15, -0.26)
    for sx in (-1, 1): prism(m, 'fur_d', [(sx * 0.14, -0.04), (sx * 0.04, 0.02), (sx * 0.18, 0.14)][::(1 if sx < 0 else -1)], 0.06, -0.30)
    ball(m, 'black', (0, -0.18), 0.04, 0.03, 0.03, -0.42)
    for sx in (-1, 1): ball(m, 'black', (sx * 0.07, -0.08), 0.025, 0.025, 0.02, -0.40)

def p_footwork(m):
    def sole(c, a, mat):
        pts = []
        for i in range(24):
            t = 2 * math.pi * i / 24; r = 1.0 + 0.18 * math.cos(t)
            x, z = 0.13 * math.cos(t) * (1.15 if math.sin(t) > 0 else 1.0), 0.30 * math.sin(t)
            ca, sa = math.cos(a), math.sin(a); pts.append((c[0] + x * ca - z * sa, c[1] + x * sa + z * ca))
        prism(m, mat, pts, 0.06, 0)
    sole((-0.36, -0.36), 0.25, 'black'); sole((0.04, 0.0), -0.10, 'leather'); sole((0.40, 0.40), 0.20, 'leather')
    ring(m, 'brass', (-0.10, -0.10), 0.62, 0.54, 0.05, -0.12, math.radians(150), math.radians(250))
    head_tri(m, 'brass', (-0.28, -0.70), (-0.40, -0.50), 0.18, 0.05, -0.12)

def p_berserk(m):
    skull(m, (0, -0.02), 1.15, 'glow_r')
    for k, x in enumerate((-0.44, 0.0, 0.44)):
        prism(m, 'flame_o', [(x - 0.12, 0.40), (x + 0.12, 0.40), (x + 0.06, 0.58), (x + 0.02, 0.72), (x - 0.06, 0.58)], 0.10, 0.12)

def p_head_hunter(m):
    ball(m, 'skin', (0, 0.04), 0.30, 0.36, 0.28)
    prism(m, 'black', [(-0.30, 0.10), (-0.20, 0.38), (0.0, 0.44), (0.24, 0.36), (0.32, 0.10), (0.20, 0.30), (-0.20, 0.30)], 0.30, 0.04)
    ring(m, 'red', (0, 0.04), 0.60, 0.52, 0.04, -0.34)
    for (a, b) in (((0, 0.70), (0, 0.30)), ((0, -0.62), (0, -0.22)), ((-0.70, 0.04), (-0.30, 0.04)), ((0.70, 0.04), (0.30, 0.04))):
        bar(m, 'red', a, b, 0.04, 0.04, -0.34)
    disc(m, 'red', (0, 0.04), 0.04, 0.04, -0.36, 10)

def p_nimble(m):
    pts = []
    for i in range(30):
        t = math.pi * i / 29; pts.append((0.24 * math.sin(t) * (1 - 0.3 * (i / 29)), -0.62 + 1.30 * i / 29))
    for i in range(29, -1, -1):
        t = math.pi * i / 29; pts.append((-0.20 * math.sin(t) * (1 - 0.3 * (i / 29)), -0.62 + 1.30 * i / 29))
    P = [(x * math.cos(0.6) - z * math.sin(0.6), x * math.sin(0.6) + z * math.cos(0.6)) for x, z in pts]
    prism(m, 'white2', P[::-1], 0.03, 0)
    bar(m, 'canvas', (0.42, -0.56), (-0.42, 0.56), 0.035, 0.05, -0.03)
    for k in range(6):
        t = 0.2 + k * 0.12; x, z = 0.42 - 0.84 * t, -0.56 + 1.12 * t
        bar(m, 'paper', (x, z), (x + 0.16, z + 0.12), 0.012, 0.01, -0.04)

def p_battle_forged(m):
    prism(m, 'steel_d', [(-0.56, -0.66), (0.56, -0.66), (0.62, 0.30), (0.34, 0.56), (0.14, 0.40), (-0.14, 0.40), (-0.34, 0.56), (-0.62, 0.30)], 0.30, 0)
    prism(m, 'steel', [(-0.46, -0.56), (0.46, -0.56), (0.50, 0.24), (0.30, 0.44), (0.12, 0.30), (-0.12, 0.30), (-0.30, 0.44), (-0.50, 0.24)], 0.06, -0.17)
    for (x, z) in ((-0.36, 0.14), (0.36, 0.14), (-0.36, -0.42), (0.36, -0.42), (0.0, 0.16), (0.0, -0.42)):
        disc(m, 'iron', (x, z), 0.045, 0.04, -0.22, 10)
    bar(m, 'steel_d', (-0.46, -0.14), (0.46, -0.14), 0.05, 0.03, -0.21)
    tape(m, (-0.30, 0.0), (0.06, -0.30), 0.08, -0.22)

def p_fearsome(m):
    ball(m, 'black', (0, 0.04), 0.48, 0.58, 0.36)
    for sx in (-1, 1):
        disc(m, 'steel_d', (sx * 0.20, 0.18), 0.16, 0.10, -0.30, 20)
        disc(m, 'glass', (sx * 0.20, 0.18), 0.12, 0.04, -0.36, 20)
    rod(m, 'olive_d', (0, -0.20), (0, -0.36), 0.18, -0.30, 18)
    disc(m, 'olive2', (0, -0.44), 0.22, 0.16, -0.36, 20)
    for k in range(6): bar(m, 'black', (-0.16 + k * 0.064, -0.36), (-0.16 + k * 0.064, -0.52), 0.02, 0.02, -0.45)
    bar(m, 'leather', (-0.50, 0.30), (-0.66, 0.50), 0.08, 0.04, 0.0); bar(m, 'leather', (0.50, 0.30), (0.66, 0.50), 0.08, 0.04, 0.0)

def p_duelist(m):
    knife(m, (-0.06, -0.66), math.radians(90), 1.38, 0.0)
    ring(m, 'brass', (-0.06, -0.28), 0.30, 0.24, 0.10, -0.04, math.radians(200), math.radians(340))
    ring(m, 'steel_d', (0.46, -0.30), 0.18, 0.13, 0.06, -0.06)

def p_killing_frenzy(m):
    for (x, z, r, s) in ((0.0, 0.0, 0.40, 1), (-0.46, 0.30, 0.12, 2), (0.44, 0.38, 0.14, 3), (-0.40, -0.46, 0.16, 4), (0.50, -0.30, 0.10, 5), (0.20, 0.58, 0.08, 6)):
        ball(m, 'blood', (x, z), r * 1.1, r, r * 0.4, 0.05, 0.3, s)
    skull(m, (0.0, 0.02), 0.62, 'black', -0.15)
    for k in range(3): bar(m, 'brass', (0.36 + k * 0.10, -0.66 + k * 0.10), (0.52 + k * 0.10, -0.62 + k * 0.10), 0.04, 0.04, -0.30)

def p_indomitable(m):
    prism(m, 'iron', [(-0.62, 0.10), (0.30, 0.10), (0.60, 0.22), (0.66, 0.30), (0.20, 0.32), (-0.62, 0.30)], 0.40, 0)
    prism(m, 'iron', [(-0.30, -0.36), (0.20, -0.36), (0.10, 0.10), (-0.20, 0.10)], 0.30, 0.02)
    prism(m, 'steel_d', [(-0.46, -0.66), (0.36, -0.66), (0.26, -0.36), (-0.36, -0.36)], 0.40, 0.02)
    ball(m, 'skin', (-0.06, 0.52), 0.26, 0.20, 0.20)
    for k in range(4): disc(m, 'skin', (-0.24 + k * 0.12, 0.46), 0.07, 0.10, -0.15, 10)
    bar(m, 'steel', (-0.62, 0.30), (0.66, 0.30), 0.02, 0.40, -0.0)


BUILD = {k[2:]: v for k, v in globals().items() if k.startswith('p_')}
SHOWS = {   # what each icon shows, a line for the shared module's alt text and the words one tap away (draft:true)
    'fast_adaptation': 'a target with two misses and three steps up', 'crippling_strikes': 'a snapped bone', 'colossus': 'a big heart and a plus',
    'nine_lives': 'a cat with a taped ear', 'bags_and_belts': 'a belt with two pouches', 'pathfinder': 'a boot over rough stones',
    'adrenaline': 'a shot of adrenaline and a bolt', 'recover': 'a canteen', 'student': 'an open notebook and a pencil',
    'executioner': 'a bloody axe', 'bullseye': 'a target behind cover, hit dead centre', 'dodge': 'a bullet passing a man',
    'fortified_mind': 'a brain held in steel', 'resilient': 'a bandage roll with a red cross', 'steel_brow': 'a steel helmet',
    'quick_hands': 'a pipe and a pistol swapping hands', 'gifted': 'a gift box with a star', 'backstabber': 'a knife in a back',
    'anticipation': 'an eye that sees the bullet coming', 'shield_expert': 'a car door for a shield, a plus', 'brawny': 'a flexed arm and a weight',
    'relentless': 'a stopwatch that keeps running', 'rotation': 'two men trading places', 'rally_the_troops': 'a bullhorn',
    'taunt': 'a man with a target on his chest', 'mace_mastery': 'a pipe', 'flail_mastery': 'a chain and a spiked weight',
    'hammer_mastery': 'a sledgehammer', 'axe_mastery': 'a hatchet', 'cleaver_mastery': 'a bloody cleaver', 'sword_mastery': 'a machete',
    'dagger_mastery': 'a knife, quicker', 'polearm_mastery': 'a billhook on a long pole', 'spear_mastery': 'a taped spear',
    'crossbow_mastery': 'a scoped rifle', 'bow_mastery': 'a bow and an arrow', 'throwing_mastery': 'a lit molotov',
    'reach_advantage': 'a long blade and stacked steps', 'overwhelm': 'three arrows coming down on one man', 'lone_wolf': 'a wolf alone',
    'underdog': 'a small dog between two big shadows', 'footwork': 'footsteps sliding out', 'berserk': 'a skull with burning eyes',
    'head_hunter': 'a head in the crosshairs', 'nimble': 'a feather', 'battle_forged': 'a riveted chest plate',
    'fearsome': 'a gas mask', 'duelist': 'one blade, one hand free', 'killing_frenzy': 'a skull in a blood splash',
    'indomitable': 'a fist on an anvil'}


# the long weapons each their own way across the tag, so no two read alike at the crew card's size: the pipe mirrored, the spear
# steep, the machete laid nearly flat (the polearm keeps the diagonal; a spear stood straight up was a hair at 32 px)
MIRROR = {'mace_mastery'}
TURN = {'spear_mastery': 15.0, 'sword_mastery': -33.0}


def model(pid):
    m = CT.Mesh(); BUILD[pid](m)
    V, F, Mt, S = m.arrays()
    if pid in TURN:                                                    # turned in the picture's plane (x, z), about its middle
        t = math.radians(TURN[pid]); c, s_ = math.cos(t), math.sin(t)
        V = np.stack([V[:, 0] * c - V[:, 2] * s_, V[:, 1], V[:, 0] * s_ + V[:, 2] * c], -1)
    if pid in MIRROR:
        V = V * np.array([-1.0, 1.0, 1.0]); F = F[:, ::-1]
    lo, hi = V.min(0), V.max(0)
    k = SPAN / max(hi[0] - lo[0], hi[2] - lo[2])                       # every model the same span on the plate
    V = (V - np.array([(lo[0] + hi[0]) / 2, 0, lo[2]])) * k
    # it STANDS, facing south to the camera like every prop the rig draws: the rig's 3/4 stretch (heights x 1/cos 45) shows a
    # standing face at its full height, and its front faces the sun, not the sky, so the source pass dusts its top, not its face
    # (a model laid back to face the 45 degree camera came out pale: every front read as a face looking up)
    out = CT.Mesh(); out.V = [tuple(v) for v in V]; out.F = [tuple(int(i) for i in f) for f in F]; out.M = list(Mt); out.smooth = list(S)
    return out


def plate(pid, tier, active):
    """the worn tag the model stands on: lit from the upper left, a bevel, the grain; gold rim for what he carries, blue for
    what he presses; the row in raised dots at its foot"""
    S = SIZE; yy, xx = np.mgrid[0:S, 0:S].astype(float) + 0.5
    r = 11.0; inset = 2.0
    qx = np.clip(np.abs(xx - S / 2) - (S / 2 - inset - r), 0, None); qy = np.clip(np.abs(yy - S / 2) - (S / 2 - inset - r), 0, None)
    d = r - np.hypot(qx, qy)                                     # inside distance to the rounded edge
    inside = np.clip(d + 0.5, 0, 1)
    base = np.array([0.155, 0.122, 0.092]) if not active else np.array([0.118, 0.130, 0.150])
    light = 1.0 + 0.30 * np.clip(1 - (xx + yy) / (1.3 * S), -1, 1)       # the one sun, upper left
    col = base[None, None, :] * light[..., None]
    rng = np.random.RandomState(sum(ord(ch) * (i + 1) for i, ch in enumerate(pid)) % (2 ** 31))
    grain = (rng.rand(S, S) - 0.5) * 0.035; col = col + grain[..., None]
    # the bevel: 3 px, its upper-left faces lit, its lower-right in shade
    bev = np.clip((4.0 - d) / 3.0, 0, 1) * (d > 0)
    face = np.clip(((S - xx) - yy) / S, -1, 1)
    col = col + (bev * face * 0.10)[..., None]
    rim = (np.abs(d - 4.2) < 0.6)
    rc = np.array([0.62, 0.48, 0.27]) if not active else np.array([0.36, 0.50, 0.66])
    col[rim] = rc * (0.85 + 0.25 * np.clip(face[rim], -1, 1))[..., None]
    for i in range(tier):                                          # the row, raised dots
        cx, cy = 10.5 + i * 4.5, S - 10.5
        dd = np.hypot(xx - cx, yy - cy); dot = dd < 1.4
        col[dot] = rc * 0.9 + 0.08; col[(dd < 1.6) & (dd >= 1.4) & (yy > cy)] = base * 0.55
    out = np.zeros((S, S, 4)); out[..., :3] = np.clip(col, 0, 1) * 255; out[..., 3] = inside * 255
    return out


def compose(pid, sprite_rgba):
    row = next(p for p in PERKS if p['id'] == pid); act = pid in ACTIVE
    P = plate(pid, row['tier'], act)
    sp = np.asarray(sprite_rgba).astype(float)
    ys, xs = np.nonzero(sp[..., 3] > 0)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    sp = sp[y0:y1, x0:x1]; h, w = sp.shape[:2]
    lim = SIZE - 16
    if max(h, w) > lim:                                            # never wider than the plate's face: the nearest pixel, never a blur
        k = lim / max(h, w); im = Image.fromarray(sp.astype(np.uint8), 'RGBA').resize((max(1, int(w * k)), max(1, int(h * k))), Image.NEAREST)
        sp = np.asarray(im).astype(float); h, w = sp.shape[:2]
    ox, oy = (SIZE - w) // 2, (SIZE - h) // 2 - 2
    reg = P[oy:oy + h, ox:ox + w]
    a = sp[..., 3:4] / 255.0
    reg[..., :3] = reg[..., :3] * (1 - a) + sp[..., :3] * a
    return Image.fromarray(np.clip(P + 0.5, 0, 255).astype(np.uint8), 'RGBA')


def main():
    a = sys.argv[1:]
    only = a[a.index('--only') + 1].split(',') if '--only' in a else [p['id'] for p in PERKS]
    os.makedirs(os.path.join(WORK, 'glb'), exist_ok=True); os.makedirs(os.path.join(WORK, 'rig'), exist_ok=True); os.makedirs(OUT, exist_ok=True)
    if '--plates' not in a:
        lk = open(CR.LOCK, 'w'); fcntl.flock(lk, fcntl.LOCK_EX)
        while CR.busy(): time.sleep(20)
        saved = CT.MAT; CT.MAT = MAT
        try:
            for pid in only:
                m = model(pid); glb = os.path.join(WORK, 'glb', pid + '.glb'); meta = CR.to_glb(pid, m, glb)
                lo, hi = np.array(meta['lo']), np.array(meta['hi']); out = os.path.join(WORK, 'rig', pid)
                if os.path.isdir(out): shutil.rmtree(out)
                t = time.time(); rj = CR.rig(pid, glb, out, float(max(hi[0] - lo[0], hi[1] - lo[1])))
                print('  %-18s rig %3.0f s  %5d colours  card %d of 8 out' % (pid, time.time() - t, rj.get('colours', 0), (rj.get('card') or {}).get('out', -1)), flush=True)
        finally:
            CT.MAT = saved; fcntl.flock(lk, fcntl.LOCK_UN)
    man = {}
    mp = os.path.join(OUT, 'perk_icons.json')
    if os.path.exists(mp): man = json.load(open(mp)).get('icons', {})
    for pid in only:
        d = os.path.join(WORK, 'rig', pid)
        body = Image.open(os.path.join(d, 'rig_S.png')).convert('RGBA'); sh = Image.open(os.path.join(d, 'shadow_S.png')).convert('RGBA') if os.path.exists(os.path.join(d, 'shadow_S.png')) else None
        if sh is not None:
            base = Image.new('RGBA', body.size, (0, 0, 0, 0)); base.alpha_composite(sh); base.alpha_composite(body); body = base
        im = compose(pid, body); im.save(os.path.join(OUT, pid + '.png'), optimize=True)
        row = next(p for p in PERKS if p['id'] == pid)
        man[pid] = {'src': pid + '.png', 'tier': row['tier'], 'pressed': pid in ACTIVE, 'shows': SHOWS[pid], 'draft': True}
    json.dump({'_about': ('COOK [the fifty perk icons] (rule 252(c)): every perk of records/target/bb/perks.json a model through the master rig on a '
                          'worn tag, %d x %d px (draw it at the crew card\'s size: 24 to 32 points); gold rim = he carries it, blue = he presses '
                          'it; the dots = its row. tools/bohemia_cook_the_fifty_perk_icons_10_26_26.py' % (SIZE, SIZE)),
               'size': SIZE, 'icons': {k: man[k] for k in sorted(man)}}, open(mp, 'w'), indent=1)
    if len(man) == len(PERKS): sheet(man)
    rj = {}                                                        # each icon's rig run, for the gate (the runs live outside the repo)
    for pid in sorted(man):
        f = os.path.join(WORK, 'rig', pid, 'rig.json')
        if os.path.exists(f):
            r = json.load(open(f)); rj[pid] = {k: r.get(k) for k in ('engine', 'real_dims_m', 'scale_from_model', 'crop_box_px', 'colours', 'card', 'breaks')}
    os.makedirs(PROOF, exist_ok=True); json.dump(rj, open(os.path.join(PROOF, 'rig_json.json'), 'w'), indent=1)


def sheet(man):
    """the fifty side by side at 1x and at the crew card's 32 px, for the reference check (a proof, not a card)"""
    ids = [p['id'] for p in PERKS]; cols = 10; rows = (len(ids) + cols - 1) // cols
    S1, S2 = SIZE, 32
    W = cols * (S1 + 6) + 6; H = rows * (S1 + S2 + 12) + 6
    sh = Image.new('RGB', (W, H), (36, 30, 24))
    for i, pid in enumerate(ids):
        im = Image.open(os.path.join(OUT, pid + '.png')).convert('RGBA'); x = 6 + (i % cols) * (S1 + 6); y = 6 + (i // cols) * (S1 + S2 + 12)
        sh.paste(im, (x, y), im); sm = im.resize((S2, S2), Image.LANCZOS); sh.paste(sm, (x + (S1 - S2) // 2, y + S1 + 4), sm)
    os.makedirs(PROOF, exist_ok=True); sh.save(os.path.join(PROOF, 'the_fifty.jpg'), quality=86)


if __name__ == '__main__':
    main()
