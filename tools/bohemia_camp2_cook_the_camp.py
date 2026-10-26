#!/usr/bin/env python3
"""BOHEMIA -- CAMP TWO [the camp is your own settlement] + [the camp grows] (rules 260, 259, 269(c); 10/26/26): HIS CAMP, MADE
AT THE SOURCE. Paolo 10/26: 'the visuals of the camp and how the camp is growing... if it's one person, one tent, maybe two
people fit in a tent, and maybe there's a shopping cart... the camp screen is gonna be the camp, a settlement vibe, it's very
important to me'; 'I'm proud of the way you've been animating... this Bohemian Crashbox HBO style, I love it' (246(e)).

MEASURED FIRST: the camp screen drew COOK's squat-camp picture (slices/settlement_ground_packs/camp_0.webp): SEVEN strangers'
tents, a market stall, a car and a notice board, the same seven for one man or twelve; nothing in it was his. What he owns
(one tent a pair, the cart, the fire, each follower's piece) has no picture anywhere: the rig renders hold the shopping cart
(records/target/master_rig/cook_cart, his cart, rendered through DIRECTION's master rig) and the truck and the trailer, and
nothing else of a camp.

WHY THIS IS NOT THE MASTER RIG ITSELF: the rig is Blender (bpy 4.2 on Python 3.11) and this session may not install it. So
this file is THE RIG'S RECIPE IN NUMPY, every number read from records/target/BOHEMIA_STYLE_GUIDE.json's rig block (the look
bible as numbers), so the pieces sit in the same light as the cart beside them:
  * THE CAMERA: orthographic, facing north, tilted 45 degrees, heights x 1.414 (the 3/4 cheat), 57 px a metre (the guide's ppm;
    the man is the ruler, 98 px for 1.72 m), every piece cut on a whole pixel of its ground point.
  * THE ONE SUN: the guide's sun_rot (40, 0, -35) as Blender turns a sun lamp, its energy, and the sky fill below it; cast
    shadows from a shadow map (a piece shades itself and lays its shadow on the ground in the sprite's own alpha, at most
    shadow_alpha_max, as the rig's contact shadow).
  * THE SOURCE PASS: paint_sat_mul and bleach_up on the base colours; crevice grime from the piece's own depth (a screen-space
    occlusion over the ground it stands on); grain at grain_per_m, a colour drift at drift_per_m, dust at dust_per_m darkening
    a bright base by dust_on_bright_mul (never frost); chips through to a dark undercoat (chip_mul) at the turns of the shape.
  * THE RING: the silhouette's outer pixel ring values darker. THE SNAP: colours pulled 0.6 toward the colours his prop family
    uses (reference/art_bank/prop, binned at 32 levels), never a short list.
  * THE CARD: every sprite through skills/bohemia-pixel-art/scripts/check.py as a prop; the rows written into kit.json.
A rig run replaces any of these the day a session has Blender: the shapes are written here as plain metres (NOTE COOK).

WHAT IT MAKES (slices/camp_two/):
  kit.png + kit.json   one sheet: the tents (three cloths: the olive army tent, the blue tarp ridge, the striped beach
                       tent, each patched with duct tape), the fire in six keys (two beats at three keys a beat: the flames
                       are the only part that moves, the stones and logs hold), the bedroll, the supply pile out of the
                       cart, the smart cart (a salvaged delivery robot with one cyan eye, the law of 7/24), each follower's
                       piece (the cook's pot on a tripod, the blacksmith's anvil on a stump with tape, the surgeon's cot, the
                       lookout's pallet stand, the scout's bike, the paymaster's strongbox), the slain under a tarp in three
                       sizes (rule 267(c)), and the fire's cold ring. Each entry: its rectangle, its ground point, its
                       footprint on the ground in metres (the walk's blocks and the taps).
  plate.webp           his ground: 2060 x 1092 of the rig's own desert (COOK's camp render, its sand, rocks and scrub) with
                       every stranger's thing taken out: quilted from the clean sand in that picture (patches, a cut along
                       the least-different seam), so the grain is the rig's grain.
  plate_night.webp     the same ground under the moon, at the night pictures' measured ground median (0.215); the fire's
                       light is laid at run time, on the beat.

  python3 tools/bohemia_camp2_cook_the_camp.py            (about a minute)

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twins are his own: the shopping cart through the rig
(records/target/master_rig/cook_cart, the 7/24 law's cart) and COOK's camp render for the ground and the tents' size and light
(slices/settlement_ground_packs/camp_0.webp); real things: a 2-person ridge tent is about 2.1 m long, 1.5 m wide, 1.1 m high
(the army pup tent, the shelter-half pair); a fire ring of fist-to-head stones about a metre across; a folding army cot
1.9 x 0.7 m; a Mojave squat camp's tarps, crates and a bike against a pallet (the 8/3 dossier's camp). Machine Party's grime
over every edge (the 8/3 dossier 3.1). The card of numbers and skills/bohemia-pixel-art. No reference game.
REUSE CHECK (REUSE-FIRST): the style guide's rig block (every number), the prop family's colours (reference/art_bank/prop),
the master rig's cart render (used as it is, not redrawn), COOK's camp render (the sand), the pixel-art card (check.py).
Nothing is read from banks/.
TASTE CHECK: his 'the rig is the look' (rule 115) and 'Crashbox HBO style, I love it' (246(e)); duct tape on everything, a
clay shine never.
"""
import os, sys, json, math, subprocess
import numpy as np
from PIL import Image
from scipy import ndimage

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, 'slices/camp_two')
GUIDE = json.load(open(os.path.join(R, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
PPM = float(GUIDE['ppm'])
SS = 3                                   # supersample: three render pixels a sprite pixel, then the hard alpha
TILT = math.radians(GUIDE['tilt_deg'])
STRETCH = 1.0 / math.cos(TILT)           # 1.414: the 3/4 cheat
CT, ST = math.cos(TILT), math.sin(TILT)


def sun_dir():
    """the guide's sun_rot as Blender turns a sun lamp (XYZ Euler, degrees); the lamp shines down its own -Z.
    Returns the direction TOWARD the sun."""
    rx, ry, rz = [math.radians(a) for a in GUIDE['sun_rot_deg']]
    v = np.array([0.0, 0.0, -1.0])
    Rx = np.array([[1, 0, 0], [0, math.cos(rx), -math.sin(rx)], [0, math.sin(rx), math.cos(rx)]])
    Ry = np.array([[math.cos(ry), 0, math.sin(ry)], [0, 1, 0], [-math.sin(ry), 0, math.cos(ry)]])
    Rz = np.array([[math.cos(rz), -math.sin(rz), 0], [math.sin(rz), math.cos(rz), 0], [0, 0, 1]])
    d = Rz @ Ry @ Rx @ v
    return -d / np.linalg.norm(d)


SUN = sun_dir()
FILL = np.array(GUIDE['fill_rgb']) * GUIDE['fill_strength']
SUN_K = GUIDE['sun_energy'] / math.pi    # a Lambert surface of albedo a under Blender's sun of this strength
GROUND_ALBEDO = 0.55                     # the camp render's sand under the same sun, less what the piece's own shade takes


# ----------------------------------------------------------------------------- the shapes, in metres (x east, y north, z up)
class Mesh:
    def __init__(self):
        self.V = []; self.F = []; self.M = []; self.smooth = []

    def add(self, V, F, mat, smooth=False):
        o = len(self.V); self.V.extend([tuple(map(float, v)) for v in V])
        for f in F:
            self.F.append((f[0] + o, f[1] + o, f[2] + o)); self.M.append(mat); self.smooth.append(smooth)
        return self

    def arrays(self):
        return np.array(self.V, float), np.array(self.F, int), list(self.M), np.array(self.smooth, bool)


def xf(V, rot=0.0, tilt_x=0.0, tilt_y=0.0, at=(0, 0, 0), scale=(1, 1, 1)):
    V = np.array(V, float) * np.array(scale, float)
    if tilt_x:
        c, s = math.cos(tilt_x), math.sin(tilt_x); V = V @ np.array([[1, 0, 0], [0, c, s], [0, -s, c]])
    if tilt_y:
        c, s = math.cos(tilt_y), math.sin(tilt_y); V = V @ np.array([[c, 0, -s], [0, 1, 0], [s, 0, c]])
    if rot:
        c, s = math.cos(rot), math.sin(rot); V = V @ np.array([[c, s, 0], [-s, c, 0], [0, 0, 1]])
    return V + np.array(at, float)


def box(m, mat, c, size, rot=0.0, tilt_x=0.0, tilt_y=0.0):
    sx, sy, sz = [s / 2 for s in size]
    V = [(-sx, -sy, -sz), (sx, -sy, -sz), (sx, sy, -sz), (-sx, sy, -sz), (-sx, -sy, sz), (sx, -sy, sz), (sx, sy, sz), (-sx, sy, sz)]
    F = [(0, 2, 1), (0, 3, 2), (4, 5, 6), (4, 6, 7), (0, 1, 5), (0, 5, 4), (1, 2, 6), (1, 6, 5), (2, 3, 7), (2, 7, 6), (3, 0, 4), (3, 4, 7)]
    return m.add(xf(V, rot, tilt_x, tilt_y, c), F, mat)


def cyl(m, mat, a, b, r, n=10, cap=True, r2=None):
    """a cylinder (or a cone, r2) from point a to point b"""
    a, b = np.array(a, float), np.array(b, float); ax = b - a; L = np.linalg.norm(ax); ax = ax / L
    t = np.array([1.0, 0, 0]) if abs(ax[0]) < 0.9 else np.array([0, 1.0, 0])
    u = np.cross(ax, t); u /= np.linalg.norm(u); w = np.cross(ax, u)
    r2 = r if r2 is None else r2
    V = []
    for i in range(n):
        th = 2 * math.pi * i / n; d = u * math.cos(th) + w * math.sin(th)
        V.append(a + d * r); V.append(b + d * r2)
    F = []
    for i in range(n):
        j = (i + 1) % n
        F.append((2 * i, 2 * j, 2 * j + 1)); F.append((2 * i, 2 * j + 1, 2 * i + 1))
    if cap:
        V.append(a); V.append(b); ca, cb = 2 * n, 2 * n + 1
        for i in range(n):
            j = (i + 1) % n
            F.append((ca, 2 * j, 2 * i)); F.append((cb, 2 * i + 1, 2 * j + 1))
    return m.add(V, F, mat, smooth=True)


def blob(m, mat, c, radii, n=10, rot=0.0, lump=0.0, seed=0, flat_bottom=True):
    """an ellipsoid (a stone, a body under a tarp, a sack), lumped by a seeded wobble"""
    rng = np.random.RandomState(seed)
    V, F = [], []
    rows, cols = n, 2 * n
    for i in range(rows + 1):
        ph = math.pi * i / rows
        for j in range(cols):
            th = 2 * math.pi * j / cols
            p = np.array([math.sin(ph) * math.cos(th), math.sin(ph) * math.sin(th), math.cos(ph)])
            V.append(p)
    V = np.array(V)
    if lump:
        k = rng.randn(3, 3) * 1.3
        wob = 1 + lump * (np.sin(V @ k[0] * 2.1 + rng.rand() * 6) * 0.5 + np.sin(V @ k[1] * 3.3 + rng.rand() * 6) * 0.3)
        V = V * wob[:, None]
    V = V * np.array(radii)
    if flat_bottom:
        V[:, 2] = np.maximum(V[:, 2], -radii[2] * 0.15)
    for i in range(rows):
        for j in range(cols):
            a = i * cols + j; b = i * cols + (j + 1) % cols; c2 = (i + 1) * cols + j; d = (i + 1) * cols + (j + 1) % cols
            F.append((a, c2, b)); F.append((b, c2, d))
    V = xf(V, rot, at=(c[0], c[1], c[2] + (radii[2] * 0.15 if flat_bottom else 0)))
    return m.add(V, F, mat, smooth=True)


def quad(m, mat, a, b, c, d, smooth=False):
    return m.add([a, b, c, d], [(0, 1, 2), (0, 2, 3)], mat, smooth)


def tri(m, mat, a, b, c):
    return m.add([a, b, c], [(0, 1, 2)], mat)


# ----------------------------------------------------------------------------- the materials (base colours before the pass)
MAT = {
    'olive':  {'rgb': (0.52, 0.53, 0.37)}, 'olive_d': {'rgb': (0.40, 0.41, 0.28)},
    'tarp':   {'rgb': (0.32, 0.46, 0.62)}, 'tarp_d': {'rgb': (0.24, 0.35, 0.50)},
    'stripe_a': {'rgb': (0.86, 0.79, 0.62)}, 'stripe_b': {'rgb': (0.72, 0.30, 0.22)},
    'tape':   {'rgb': (0.66, 0.66, 0.62)}, 'dark': {'rgb': (0.07, 0.06, 0.05)}, 'inside': {'rgb': (0.11, 0.09, 0.07)},
    'pole':   {'rgb': (0.42, 0.40, 0.36)}, 'rope': {'rgb': (0.62, 0.56, 0.42)},
    'stone':  {'rgb': (0.46, 0.42, 0.37)}, 'stone_d': {'rgb': (0.34, 0.31, 0.28)}, 'ash': {'rgb': (0.20, 0.19, 0.18)},
    'log':    {'rgb': (0.33, 0.22, 0.14)}, 'char': {'rgb': (0.12, 0.09, 0.07)},
    'flame_o': {'rgb': (1.00, 0.52, 0.12), 'emit': True}, 'flame_y': {'rgb': (1.00, 0.82, 0.38), 'emit': True},
    'ember':  {'rgb': (0.95, 0.32, 0.08), 'emit': True},
    'blanket': {'rgb': (0.47, 0.20, 0.17)}, 'blanket_b': {'rgb': (0.70, 0.60, 0.40)}, 'pad': {'rgb': (0.26, 0.30, 0.22)},
    'wood':   {'rgb': (0.50, 0.38, 0.24)}, 'wood_d': {'rgb': (0.36, 0.27, 0.17)},
    'metal':  {'rgb': (0.38, 0.38, 0.38)}, 'rust': {'rgb': (0.45, 0.24, 0.12)}, 'iron': {'rgb': (0.18, 0.18, 0.19)},
    'canvas': {'rgb': (0.55, 0.52, 0.40)}, 'red': {'rgb': (0.62, 0.12, 0.10)}, 'white': {'rgb': (0.80, 0.78, 0.72)},
    'robot':  {'rgb': (0.70, 0.70, 0.66)}, 'robot_d': {'rgb': (0.22, 0.22, 0.24)}, 'eye': {'rgb': (0.30, 0.95, 0.95), 'emit': True},
    'tyre':   {'rgb': (0.10, 0.10, 0.10)}, 'sack': {'rgb': (0.56, 0.48, 0.34)}, 'jug': {'rgb': (0.72, 0.64, 0.30)},
    'pot':    {'rgb': (0.20, 0.20, 0.21)}, 'boot': {'rgb': (0.16, 0.12, 0.09)}, 'cloth_g': {'rgb': (0.40, 0.40, 0.36)},
    'bike':   {'rgb': (0.55, 0.16, 0.12)}, 'gold': {'rgb': (0.60, 0.50, 0.22)}, 'lantern': {'rgb': (1.0, 0.78, 0.40), 'emit': True},
}


# ----------------------------------------------------------------------------- the pieces
def tent(cloth='olive', seed=1):
    """a two-man ridge tent, its door to the camera, the flaps tied back, tape on the tears, pegs and two guy ropes"""
    m = Mesh(); L, W, H = 2.1, 1.5, 1.1
    c, cd = {'olive': ('olive', 'olive_d'), 'tarp': ('tarp', 'tarp_d'), 'stripe': ('stripe_a', 'stripe_b')}[cloth]
    y0, y1 = -L / 2, L / 2
    ov = 0.12                               # the fly hangs past the ends
    A = (-W / 2, y0 - ov, 0.0); B = (0, y0 - ov, H); C = (W / 2, y0 - ov, 0.0)
    A2 = (-W / 2, y1 + ov, 0.0); B2 = (0, y1 + ov, H); C2 = (W / 2, y1 + ov, 0.0)
    if cloth == 'stripe':                   # the beach tent's panels: stripes down the slope, two colours
        n = 6
        for side in (-1, 1):
            for i in range(n):
                ya, yb = y0 - ov + (L + 2 * ov) * i / n, y0 - ov + (L + 2 * ov) * (i + 1) / n
                quad(m, c if i % 2 == 0 else cd, (side * W / 2, ya, 0), (side * W / 2, yb, 0), (0, yb, H), (0, ya, H))
    else:
        quad(m, c, A, A2, B2, B); quad(m, c, C, B, B2, C2)
    # the back wall and the front wall (the door): the inside dark, the two flaps tied back to each side
    tri(m, cd, (-W / 2 + 0.06, y1, 0), (W / 2 - 0.06, y1, 0), (0, y1, H - 0.05))
    tri(m, 'inside', (-W / 2 + 0.08, y0 + 0.05, 0), (W / 2 - 0.08, y0 + 0.05, 0), (0, y0 + 0.05, H - 0.07))
    tri(m, c, (-W / 2 + 0.05, y0, 0.0), (-0.16, y0 - 0.05, 0.0), (-0.02, y0, H - 0.08))     # the left flap, tied back
    tri(m, c, (0.16, y0 - 0.05, 0.0), (W / 2 - 0.05, y0, 0.0), (0.02, y0, H - 0.08))
    # the poles at the door and the back, the ridge rope
    cyl(m, 'pole', (0, y0 - ov - 0.02, 0), (0, y0 - ov - 0.02, H + 0.08), 0.018, 6)
    cyl(m, 'pole', (0, y1 + ov + 0.02, 0), (0, y1 + ov + 0.02, H + 0.08), 0.018, 6)
    # guy ropes out to pegs, front and back
    for yy, d in ((y0 - ov, -1), (y1 + ov, 1)):
        cyl(m, 'rope', (0, yy, H + 0.06), (0, yy + d * 0.55, 0.02), 0.009, 4, cap=False)
        box(m, 'wood_d', (0, yy + d * 0.55, 0.04), (0.04, 0.04, 0.08))
    for x in (-W / 2 - 0.05, W / 2 + 0.05):
        for yy in (y0 + 0.1, y1 - 0.1):
            box(m, 'wood_d', (x, yy, 0.03), (0.035, 0.035, 0.06))
    # duct tape on the tears: pale strips laid on the slope, a few, seeded
    rng = np.random.RandomState(seed)
    for k in range(4):
        side = 1 if rng.rand() < 0.5 else -1
        t = 0.25 + rng.rand() * 0.55; ya = y0 + 0.1 + rng.rand() * (L - 0.6); ln = 0.18 + rng.rand() * 0.25
        x0 = side * W / 2 * (1 - t); z0 = H * t
        nx, nz = side * H, W / 2; nl = math.hypot(nx, nz); nx, nz = nx / nl * 0.012, nz / nl * 0.012
        quad(m, 'tape', (x0 + nx - side * 0.05, ya, z0 + nz + 0.05 * 2 * H / W), (x0 + nx - side * 0.05, ya + ln, z0 + nz + 0.05 * 2 * H / W),
             (x0 + nx + side * 0.05, ya + ln, z0 + nz - 0.05 * 2 * H / W), (x0 + nx + side * 0.05, ya, z0 + nz - 0.05 * 2 * H / W))
    return m


def fire(key=None, cold=False, seed=3):
    """the ring of stones, the crossed logs, the ash; and, keyed, the flames (the only part that moves)"""
    m = Mesh(); rng = np.random.RandomState(seed)
    blob(m, 'ash', (0, 0, -0.03), (0.42, 0.36, 0.05), n=8, flat_bottom=False)
    n = 11
    for i in range(n):
        a = 2 * math.pi * i / n + rng.rand() * 0.2
        r = 0.48 + rng.rand() * 0.04
        s = 0.09 + rng.rand() * 0.05
        blob(m, 'stone' if i % 3 else 'stone_d', (math.cos(a) * r, math.sin(a) * r * 0.95, 0), (s * 1.2, s, s * 0.85), n=6, rot=a, lump=0.25, seed=seed * 31 + i)
    for i, a in enumerate((0.3, 1.9, 3.6)):
        cx, cy = math.cos(a) * 0.05, math.sin(a) * 0.05
        cyl(m, 'char' if not cold else 'log', (cx - math.cos(a) * 0.36, cy - math.sin(a) * 0.36, 0.05 + 0.03 * i), (cx + math.cos(a) * 0.30, cy + math.sin(a) * 0.30, 0.10 + 0.04 * i), 0.055, 7)
    if cold or key is None:
        return m
    # the flames: tongues as thin cones, their heights and leans moving key to key (six keys a loop, two beats)
    ph = 2 * math.pi * key / 6.0
    for i in range(7):
        a = 2 * math.pi * i / 7 + 0.4
        r = 0.10 + 0.06 * ((i * 37) % 5) / 5
        bx, by = math.cos(a) * r, math.sin(a) * r * 0.8
        h = 0.34 + 0.16 * math.sin(ph + i * 1.7) + 0.06 * math.sin(2 * ph + i)
        lean = 0.05 * math.sin(ph * 1 + i * 2.3)
        cyl(m, 'flame_o', (bx, by, 0.08), (bx + lean, by + lean * 0.5, 0.08 + h), 0.07, 6, r2=0.005)
    for i in range(4):
        a = 2 * math.pi * i / 4 + 1.1
        bx, by = math.cos(a) * 0.05, math.sin(a) * 0.04
        h = 0.22 + 0.10 * math.sin(ph + i * 2.1 + 1)
        cyl(m, 'flame_y', (bx, by - 0.03, 0.09), (bx, by - 0.03, 0.09 + h), 0.05, 6, r2=0.004)
    for i in range(3):   # the embers in the ash
        a = 2 * math.pi * i / 3 + ph * 0.2
        blob(m, 'ember', (math.cos(a) * 0.2, math.sin(a) * 0.16, 0), (0.03, 0.03, 0.02), n=4)
    return m


def bedroll(seed=5):
    m = Mesh()
    blob(m, 'pad', (0, 0, 0), (0.36, 0.95, 0.05), n=8, lump=0.05, seed=seed)
    blob(m, 'blanket', (0, -0.15, 0.04), (0.33, 0.62, 0.07), n=8, lump=0.12, seed=seed + 1)
    for k in range(3):   # the serape's bands
        blob(m, 'blanket_b', (0, -0.55 + k * 0.32, 0.075), (0.335, 0.035, 0.045), n=6, seed=seed + 2 + k)
    cyl(m, 'cloth_g', (-0.30, 0.78, 0.07), (0.30, 0.78, 0.07), 0.07, 8)   # the rolled pillow
    return m


def crate(m, c, s=(0.55, 0.40, 0.38), rot=0.0, mat='wood'):
    box(m, mat, c, s, rot)
    # the slats: dark lines as thin boxes standing proud on the front and the side
    for k in (-1, 1):
        box(m, 'wood_d', (c[0], c[1] - s[1] / 2 - 0.004, c[2] + k * s[2] * 0.22), (s[0] * 1.0, 0.01, 0.02), rot)
    return m


def supplies(seed=7):
    """what comes out of the cart: crates, sacks, a water jug, a coil of rope, a tarp folded"""
    m = Mesh()
    crate(m, (0, 0, 0.19)); crate(m, (0.05, 0.02, 0.57), (0.48, 0.36, 0.34), rot=0.15)
    crate(m, (0.62, -0.05, 0.16), (0.44, 0.34, 0.32), rot=-0.2, mat='wood_d')
    blob(m, 'sack', (-0.55, -0.05, 0), (0.24, 0.20, 0.26), n=8, lump=0.15, seed=seed)
    blob(m, 'sack', (-0.48, 0.30, 0), (0.22, 0.20, 0.22), n=8, lump=0.15, seed=seed + 1)
    cyl(m, 'jug', (0.65, -0.32, 0), (0.65, -0.32, 0.32), 0.12, 10)
    cyl(m, 'jug', (0.65, -0.32, 0.32), (0.65, -0.32, 0.40), 0.03, 6)
    box(m, 'tarp_d', (-0.1, -0.42, 0.06), (0.6, 0.30, 0.12), 0.1)
    return m


def smart_cart():
    """the salvaged delivery robot (the 7/24 law: a following cart, ED-E's beeps and lights): a bin on six small wheels, a
    lid strapped down with tape, one cyan eye bar, a whip flag"""
    m = Mesh()
    box(m, 'robot', (0, 0, 0.33), (0.66, 0.90, 0.40))
    box(m, 'robot_d', (0, 0, 0.56), (0.68, 0.92, 0.06))
    box(m, 'robot_d', (0, -0.455, 0.38), (0.44, 0.02, 0.10))
    box(m, 'eye', (0, -0.47, 0.38), (0.32, 0.01, 0.035))
    for y in (-0.35, 0, 0.35):
        for x in (-0.33, 0.33):
            cyl(m, 'tyre', (x - 0.04, y, 0.11), (x + 0.04, y, 0.11), 0.11, 10)
    box(m, 'tape', (0, 0, 0.595), (0.70, 0.08, 0.012)); box(m, 'tape', (0.0, 0.25, 0.595), (0.70, 0.06, 0.012))
    box(m, 'red', (0.18, -0.2, 0.60), (0.16, 0.12, 0.02))   # a sticker
    cyl(m, 'pole', (0.26, 0.40, 0.59), (0.26, 0.40, 1.35), 0.008, 4)
    tri(m, 'stripe_b', (0.26, 0.40, 1.35), (0.26, 0.40, 1.15), (0.46, 0.40, 1.25))
    return m


def cook_pot():
    m = Mesh()
    for a in (0.0, 2.1, 4.2):
        cyl(m, 'iron', (math.cos(a) * 0.42, math.sin(a) * 0.42, 0), (0, 0, 1.05), 0.018, 5)
    cyl(m, 'iron', (0, 0, 1.05), (0, 0, 0.62), 0.006, 4, cap=False)
    cyl(m, 'pot', (0, 0, 0.36), (0, 0, 0.62), 0.17, 12, r2=0.18)
    cyl(m, 'iron', (0, 0, 0.62), (0, 0, 0.64), 0.19, 12)
    m2 = fire(cold=True, seed=11)
    V, F, M, S = m2.arrays(); m.add(V * np.array([0.55, 0.55, 0.6]), F.tolist(), 'stone')
    m.M[-len(F):] = M
    return m


def anvil():
    m = Mesh()
    cyl(m, 'log', (0, 0, 0), (0, 0, 0.48), 0.24, 12)
    cyl(m, 'char', (0, 0, 0.48), (0, 0, 0.49), 0.22, 12)
    box(m, 'iron', (0, 0, 0.56), (0.18, 0.40, 0.14))
    box(m, 'iron', (0, 0, 0.66), (0.24, 0.55, 0.08))
    cyl(m, 'iron', (0, -0.27, 0.66), (0, -0.42, 0.67), 0.04, 6, r2=0.005)
    box(m, 'metal', (0.48, 0.10, 0.48), (0.06, 0.85, 0.95), rot=0.2, tilt_y=0.25)   # a car door leaning, waiting
    box(m, 'rust', (0.51, 0.10, 0.62), (0.065, 0.55, 0.30), rot=0.2, tilt_y=0.25)
    for k, (x, y) in enumerate(((-0.42, -0.2), (-0.36, 0.08), (-0.40, -0.05))):
        cyl(m, 'tape', (x, y, 0.0 + k * 0.0), (x, y, 0.07), 0.09, 10)
        cyl(m, 'dark', (x, y, 0.07), (x, y, 0.072), 0.04, 8)
    return m


def cot():
    m = Mesh()
    for x in (-0.33, 0.33):
        cyl(m, 'pole', (x, -0.9, 0.38), (x, 0.9, 0.38), 0.02, 6)
    for y in (-0.8, 0.8):
        cyl(m, 'pole', (-0.33, y - 0.1, 0.0), (0.33, y + 0.1, 0.38), 0.015, 5); cyl(m, 'pole', (0.33, y - 0.1, 0.0), (-0.33, y + 0.1, 0.38), 0.015, 5)
    quad(m, 'canvas', (-0.33, -0.9, 0.39), (0.33, -0.9, 0.39), (0.33, 0.9, 0.39), (-0.33, 0.9, 0.39))
    box(m, 'white', (0.62, -0.25, 0.15), (0.38, 0.28, 0.30))
    box(m, 'red', (0.62, -0.392, 0.17), (0.16, 0.01, 0.05)); box(m, 'red', (0.62, -0.392, 0.17), (0.05, 0.012, 0.16))
    cyl(m, 'white', (0.55, 0.35, 0.0), (0.55, 0.35, 0.1), 0.06, 8)    # a roll of bandage
    return m


def lookout():
    """a pallet stand: two pallets on cinder blocks, a lawn chair up top, a bottle"""
    m = Mesh()
    for x in (-0.45, 0.45):
        for y in (-0.4, 0.4):
            box(m, 'stone_d', (x, y, 0.2), (0.2, 0.39, 0.4))
    for z in (0.43, 0.56):
        box(m, 'wood', (0, 0, z), (1.2, 1.0, 0.04))
        for y in (-0.45, 0, 0.45):
            box(m, 'wood_d', (0, y, z - 0.05), (1.2, 0.1, 0.06))
    # the chair: a frame and a woven seat and back
    box(m, 'pole', (0, 0.05, 0.85), (0.5, 0.48, 0.03))
    box(m, 'stripe_b', (0, 0.05, 0.87), (0.46, 0.44, 0.02))
    box(m, 'stripe_b', (0, 0.30, 1.12), (0.46, 0.03, 0.5), tilt_x=-0.2)
    for x in (-0.24, 0.24):
        for y in (-0.15, 0.25):
            cyl(m, 'pole', (x, y, 0.58), (x, y, 0.86), 0.012, 4)
    cyl(m, 'jug', (0.4, -0.3, 0.58), (0.4, -0.3, 0.80), 0.04, 8)
    return m


def bike():
    m = Mesh()
    def wheel(cy):
        n = 16
        for i in range(n):
            a1, a2 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
            cyl(m, 'tyre', (0, cy + math.cos(a1) * 0.33, 0.34 + math.sin(a1) * 0.33), (0, cy + math.cos(a2) * 0.33, 0.34 + math.sin(a2) * 0.33), 0.025, 5, cap=False)
        cyl(m, 'metal', (-0.04, cy, 0.34), (0.04, cy, 0.34), 0.04, 6)
    wheel(-0.52); wheel(0.52)
    P = {'bb': (0, 0.0, 0.32), 'seat': (0, 0.12, 0.85), 'head': (0, -0.42, 0.85), 'rear': (0, 0.52, 0.34), 'front': (0, -0.52, 0.34)}
    for a, b in (('bb', 'seat'), ('bb', 'head'), ('seat', 'head'), ('bb', 'rear'), ('seat', 'rear'), ('head', 'front')):
        cyl(m, 'bike', P[a], P[b], 0.022, 5)
    box(m, 'boot', (0, 0.12, 0.89), (0.11, 0.25, 0.05))
    cyl(m, 'iron', (-0.25, -0.40, 0.95), (0.25, -0.40, 0.95), 0.016, 5)
    box(m, 'wood', (0, -0.52, 0.80), (0.30, 0.22, 0.16))     # a crate on the front: the scout's maps
    box(m, 'white', (0.02, -0.52, 0.89), (0.22, 0.16, 0.02), rot=0.3)
    V, F, M, S = m.arrays()
    out = Mesh(); out.add(xf(V, tilt_y=0.18), F.tolist(), 'bike')
    out.M = M; out.smooth = list(S)
    return out


def strongbox():
    m = Mesh()
    crate(m, (0, 0, 0.19))
    box(m, 'iron', (0, 0, 0.52), (0.42, 0.30, 0.28))
    box(m, 'gold', (0, -0.152, 0.55), (0.06, 0.01, 0.08))
    for x in (-0.12, 0.12):
        box(m, 'metal', (x, 0, 0.53), (0.035, 0.31, 0.29))
    cyl(m, 'iron', (0.32, 0.05, 0.38), (0.32, 0.05, 0.40), 0.07, 8)
    cyl(m, 'lantern', (0.32, 0.05, 0.40), (0.32, 0.05, 0.56), 0.05, 8)
    cyl(m, 'iron', (0.32, 0.05, 0.56), (0.32, 0.05, 0.60), 0.06, 8, r2=0.02)
    return m


def seats(seed=17):
    """the places by the fire for who travels with him (the retinue's spot, Battle Brothers' campfire with tents): two crates for
    stools, an upturned bucket, a folded blanket"""
    m = Mesh()
    crate(m, (-0.45, 0.05, 0.17), (0.42, 0.34, 0.34), rot=0.3)
    crate(m, (0.40, -0.05, 0.17), (0.40, 0.34, 0.34), rot=-0.25, mat='wood_d')
    cyl(m, 'rust', (0.0, 0.42, 0.0), (0.0, 0.42, 0.34), 0.17, 12, r2=0.14)
    box(m, 'blanket', (0.40, -0.05, 0.37), (0.36, 0.28, 0.05), rot=-0.25)
    box(m, 'blanket_b', (0.40, -0.05, 0.40), (0.36, 0.05, 0.02), rot=-0.25)
    return m


def slain(n=3, seed=13):
    """the dead under tarps, laid in a row; their boots out the end (rule 267(c): bigger with more dead)"""
    m = Mesh(); rng = np.random.RandomState(seed)
    for i in range(n):
        row, col = divmod(i, 4)
        x = rng.rand() * 0.15 + row * 0.35; y = (col - 1.5) * 0.55 + row * 0.25
        blob(m, ['tarp', 'cloth_g', 'tarp_d', 'olive'][i % 4], (x, y, 0.02 * row), (0.88, 0.25, 0.13), n=9, lump=0.12, seed=seed + i, rot=(rng.rand() - 0.5) * 0.15)
        for k in (-1, 1):
            box(m, 'boot', (x + 0.95, y + k * 0.08, 0.07 + 0.02 * row), (0.14, 0.09, 0.12))
    return m


def turned(mesh, deg):
    """the same piece turned on the ground (a bedroll, a cot, the dead and the bike lie across the picture, never into it)"""
    V, F, M, S = mesh.arrays(); out = Mesh(); out.add(xf(V, rot=math.radians(deg)), F.tolist(), 'x')
    out.M = list(M); out.smooth = list(S); return out


# ----------------------------------------------------------------------------- the render
def project(V):
    """metres (heights stretched) to render pixels: x right, screen-up, and depth (smaller is nearer the camera)"""
    z = V[:, 2] * STRETCH
    sx = V[:, 0]
    up = V[:, 1] * ST + z * CT
    dep = V[:, 1] * CT - z * ST
    return sx, up, dep


def raster(P2, D, F, W, H, vals=None):
    """z-buffer every triangle: per pixel the face, the depth and the barycentrics"""
    zb = np.full((H, W), np.inf); fid = np.full((H, W), -1, int); bc = np.zeros((H, W, 3))
    for i, (a, b, c) in enumerate(F):
        xa, ya = P2[a]; xb, yb = P2[b]; xc, yc = P2[c]
        x0 = int(max(0, math.floor(min(xa, xb, xc)))); x1 = int(min(W - 1, math.ceil(max(xa, xb, xc))))
        y0 = int(max(0, math.floor(min(ya, yb, yc)))); y1 = int(min(H - 1, math.ceil(max(ya, yb, yc))))
        if x1 < x0 or y1 < y0:
            continue
        den = (yb - yc) * (xa - xc) + (xc - xb) * (ya - yc)
        if abs(den) < 1e-12:
            continue
        X, Y = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
        l1 = ((yb - yc) * (X - xc) + (xc - xb) * (Y - yc)) / den
        l2 = ((yc - ya) * (X - xc) + (xa - xc) * (Y - yc)) / den
        l3 = 1 - l1 - l2
        ins = (l1 >= -1e-6) & (l2 >= -1e-6) & (l3 >= -1e-6)
        if not ins.any():
            continue
        z = l1 * D[a] + l2 * D[b] + l3 * D[c]
        sub = zb[y0:y1 + 1, x0:x1 + 1]
        win = ins & (z < sub)
        if not win.any():
            continue
        sub[win] = z[win]
        fid[y0:y1 + 1, x0:x1 + 1][win] = i
        bsub = bc[y0:y1 + 1, x0:x1 + 1]
        bsub[win] = np.stack([l1[win], l2[win], l3[win]], -1)
    return zb, fid, bc


def noise3(P, freq, seed):
    """value noise in 3D at a frequency a metre (trilinear over a hashed lattice), 0..1"""
    p = P * freq + seed * 17.13
    i = np.floor(p).astype(np.int64); f = p - i
    f = f * f * (3 - 2 * f)
    def h(ix, iy, iz):
        n = (ix * 73856093) ^ (iy * 19349663) ^ (iz * 83492791) ^ (seed * 2654435761)
        n = (n ^ (n >> 13)) * 1274126177
        return ((n ^ (n >> 16)) & 0xffff) / 65535.0
    out = 0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (f[..., 0] if dx else 1 - f[..., 0]) * (f[..., 1] if dy else 1 - f[..., 1]) * (f[..., 2] if dz else 1 - f[..., 2])
                out = out + w * h(i[..., 0] + dx, i[..., 1] + dy, i[..., 2] + dz)
    return out


def desat(rgb, k):
    l = rgb @ np.array([0.299, 0.587, 0.114])
    k = np.asarray(k, float)
    if k.ndim == l.ndim and k.ndim > 0:
        k = k[..., None]
    return l[..., None] + (rgb - l[..., None]) * k


SNAP = None


def snap_lut():
    """every colour his prop family uses, binned at 32 levels a channel, and for every bin its nearest used bin"""
    global SNAP
    if SNAP is not None:
        return SNAP
    d = os.path.join(R, 'reference/art_bank/prop'); used = np.zeros((32, 32, 32), bool)
    for fn in sorted(os.listdir(d)):
        if not fn.lower().endswith('.png'):
            continue
        a = np.asarray(Image.open(os.path.join(d, fn)).convert('RGBA'))
        op = a[..., 3] > 127
        q = (a[..., :3][op] // 8).astype(int)
        used[q[:, 0], q[:, 1], q[:, 2]] = True
    _, ind = ndimage.distance_transform_edt(~used, return_indices=True)
    SNAP = (np.stack(ind, -1).astype(np.float64) * 8 + 4) / 255.0
    return SNAP


def render(mesh, name, frames_hold=None, pad_m=0.15):
    V, F, M, smooth = mesh.arrays()
    Vs = V.copy(); Vs[:, 2] *= STRETCH                      # the geometry the camera and the sun see
    # face normals (stretched space), and vertex normals for the smooth parts
    e1 = Vs[F[:, 1]] - Vs[F[:, 0]]; e2 = Vs[F[:, 2]] - Vs[F[:, 0]]
    FN = np.cross(e1, e2); FN /= (np.linalg.norm(FN, axis=1, keepdims=True) + 1e-12)
    VN = np.zeros_like(Vs)
    for k in range(3):
        np.add.at(VN, F[:, k], FN)
    VN /= (np.linalg.norm(VN, axis=1, keepdims=True) + 1e-12)
    sx, up, dep = project(V)
    # the canvas: the piece plus its shadow on the ground (the sun's direction carried to z = 0), padded
    shx = -SUN[0] / SUN[2]; shy = -SUN[1] / SUN[2]
    gx = V[:, 0] + shx * Vs[:, 2]; gy = V[:, 1] + shy * Vs[:, 2]
    gup = gy * ST
    xmin = min(sx.min(), gx.min()) - pad_m; xmax = max(sx.max(), gx.max()) + pad_m
    ymin = min(up.min(), gup.min()) - pad_m; ymax = max(up.max(), gup.max()) + pad_m
    k = PPM * SS
    # the ground point (0, 0, 0) on a whole sprite pixel
    ox = math.ceil(-xmin * PPM) ; oy = math.ceil(ymax * PPM)
    W = int(math.ceil((xmax * PPM) + ox)) + 1; H = int(math.ceil(oy - ymin * PPM)) + 1
    W2, H2 = W * SS, H * SS
    P2 = np.stack([(sx * k) + ox * SS, (oy * SS) - up * k], -1)
    zb, fid, bc = raster(P2, dep, F, W2, H2)
    hit = fid >= 0
    # per pixel: the world position (stretched), the normal
    fv = F[np.maximum(fid, 0)]
    Pw = (bc[..., 0:1] * Vs[fv[..., 0]] + bc[..., 1:2] * Vs[fv[..., 1]] + bc[..., 2:3] * Vs[fv[..., 2]])
    sm = smooth[np.maximum(fid, 0)]
    Nv = bc[..., 0:1] * VN[fv[..., 0]] + bc[..., 1:2] * VN[fv[..., 1]] + bc[..., 2:3] * VN[fv[..., 2]]
    Nv /= (np.linalg.norm(Nv, axis=-1, keepdims=True) + 1e-12)
    N = np.where(sm[..., None], Nv, FN[np.maximum(fid, 0)])
    # a face seen from behind (a thin sheet) turns its normal to the camera
    view = np.array([0, -CT, ST]); back = (N @ view) < 0
    N[back] = -N[back]
    # THE SHADOW MAP: the piece seen from the sun
    Ls = SUN; ua = np.cross(Ls, [0, 0, 1.0]); ua /= np.linalg.norm(ua); va = np.cross(Ls, ua)
    LK = PPM * SS * 1.2
    lu = Vs @ ua; lv = Vs @ va; ld = -(Vs @ Ls)
    lu0, lv0 = lu.min() - 0.1, lv.min() - 0.1
    LW = int((lu.max() - lu0 + 0.1) * LK) + 2; LH = int((lv.max() - lv0 + 0.1) * LK) + 2
    Lz, _, _ = raster(np.stack([(lu - lu0) * LK, (lv - lv0) * LK], -1), ld, F, LW, LH)
    Lz = ndimage.grey_erosion(np.where(np.isinf(Lz), 1e9, Lz), size=2)   # a little bias room at the edges
    def lit_at(Pq, bias=0.02):
        qu = ((Pq @ ua) - lu0) * LK; qv = ((Pq @ va) - lv0) * LK; qd = -(Pq @ Ls)
        out = np.ones(Pq.shape[:-1])
        acc = np.zeros(Pq.shape[:-1])
        for du in (-1, 0, 1):
            for dv in (-1, 0, 1):
                iu = np.clip((qu + du).astype(int), 0, LW - 1); iv = np.clip((qv + dv).astype(int), 0, LH - 1)
                acc += (qd <= Lz[iv, iu] + bias)
        return acc / 9.0
    # THE SOURCE PASS on the base colours
    base = np.zeros((H2, W2, 3)); emit = np.zeros((H2, W2), bool)
    mats = np.array([M[i] for i in range(len(M))], dtype=object)
    names = sorted(set(M))
    for nm in names:
        sel = hit & (mats[np.maximum(fid, 0)] == nm)
        if not sel.any():
            continue
        base[sel] = MAT[nm]['rgb']; emit[sel] = bool(MAT[nm].get('emit'))
    Pm = Pw.copy(); Pm[..., 2] /= STRETCH                     # the masks stick to the real metres
    wear = GUIDE['wear']
    base = desat(base, GUIDE['paint_sat_mul'])
    upf = np.clip(N[..., 2], 0, 1)
    base = desat(base, 1 - GUIDE['bleach_up'] * upf * wear)
    drift = noise3(Pm, GUIDE['drift_per_m'], 1) - 0.5
    base = base * (1 + 0.27 * drift[..., None] * np.array([1.0, 0.9, 0.8]))
    dustm = np.clip((noise3(Pm, GUIDE['dust_per_m'], 2) - 0.45) * 2.5, 0, 1) * upf * wear
    lum = base @ np.array([0.299, 0.587, 0.114])
    lo, hi = GUIDE['dust_bright_value']
    bright = np.clip((lum - lo) / (hi - lo), 0, 1)
    dusty = np.where(bright[..., None] > 0.5, base * np.array(GUIDE['dust_on_bright_mul']), base * 0.75 + np.array([0.52, 0.45, 0.33]) * 0.25)
    base = base + (dusty - base) * (dustm * 0.8)[..., None]
    g = noise3(Pm, GUIDE['grain_per_m'], 3)
    g = np.clip((g - 0.5) * 2.0, -1, 1)
    gs = GUIDE['grain_rest'] * 0.6 + (GUIDE['grain_wear'] * 0.6 - GUIDE['grain_rest'] * 0.6) * np.clip(dustm * 2, 0, 1)
    base = base * (1 + 0.18 * gs * g)[..., None]
    # the chips at the turns of the shape: where the normal turns between neighbours
    Nn = N.copy(); Nn[~hit] = 0
    turn = np.zeros((H2, W2))
    for dy, dx in ((0, SS), (SS, 0)):
        nb = np.roll(Nn, (dy, dx), (0, 1))
        turn = np.maximum(turn, 1 - np.sum(Nn * nb, -1))
    edge = (turn > 0.35) & hit
    edge = ndimage.binary_dilation(edge, iterations=max(1, int(GUIDE['edge_m'] * PPM * SS * 0.5)))
    chip = edge & (noise3(Pm, GUIDE['chip_per_m'], 4) > 1 - GUIDE['edge_wear'] * 0.5) & ~emit
    base[chip] = base[chip] * np.array(GUIDE['chip_mul']) / max(GUIDE['chip_mul'])
    # THE LIGHT: the sun (shadowed), the sky's fill, the crevice grime
    sunl = np.clip(N @ SUN, 0, 1) * lit_at(Pw + N * 0.02)
    sky = FILL[None, None, :] * (0.55 + 0.45 * np.clip(N[..., 2], -1, 1))[..., None]
    # the desert under it gives the sun back: the sand's albedo times the sun on the ground, on what faces sideways and down
    # (a piece in the rig stands in no world; here it stands on sand, so its shadow side is one step down, never black)
    sky = sky + (GROUND_ALBEDO * SUN_K * SUN[2] * (0.5 - 0.5 * np.clip(N[..., 2], -1, 1)))[..., None] * np.array([1.0, 0.93, 0.82])
    # the grime: a screen-space look at what stands nearer the camera around each pixel, over the ground plane
    gz = np.full((H2, W2), np.inf)
    Y2 = (np.arange(H2)[:, None] + 0.5); upg = (oy * SS - Y2) / k        # screen-up of a ground pixel, in metres
    gz = (upg / ST) * CT + 0 * np.zeros((H2, W2))                        # ground depth at y = up / sin(tilt)
    Z = np.where(hit, zb, gz)
    occ = np.zeros((H2, W2)); rad = 0.22 * k; nS = 12
    for i in range(nS):
        a = 2 * math.pi * i / nS; r = rad * (0.35 + 0.65 * ((i * 7) % nS) / nS)
        dx, dy = int(round(math.cos(a) * r)), int(round(math.sin(a) * r))
        nb = np.roll(Z, (dy, dx), (0, 1))
        dd = Z - nb
        occ += np.clip(dd / 0.25, 0, 1) * (dd < 0.6)
    ao = 1 - 0.68 * np.clip(occ / nS * 1.6, 0, 1)
    col = base * (1.30 * SUN_K * sunl[..., None] + sky) * ao[..., None]
    col[emit] = base[emit] * 1.15
    col = np.clip(col, 0, 1)
    # THE GROUND'S SHADOW, in the sprite's own alpha: the ground under every pixel the piece does not cover
    Xg = (np.arange(W2)[None, :] + 0.5 - ox * SS) / k
    Pg = np.stack([np.broadcast_to(Xg, (H2, W2)), np.broadcast_to(upg / ST, (H2, W2)), np.zeros((H2, W2))], -1)
    shade = 1 - lit_at(Pg, bias=0.03)
    shade = ndimage.gaussian_filter(shade, SS * 1.2)
    # down to the sprite's pixels: the colour averaged over what the piece covers, the alpha hard (alpha_threshold)
    cov = hit.reshape(H, SS, W, SS).mean((1, 3))
    csum = (col * hit[..., None]).reshape(H, SS, W, SS, 3).sum((1, 3))
    c1 = csum / np.maximum(1e-9, (hit.reshape(H, SS, W, SS).sum((1, 3))))[..., None]
    sh1 = shade.reshape(H, SS, W, SS).mean((1, 3))
    solid = cov >= GUIDE['alpha_threshold'] / 255.0
    # the clay's hard light: a step more between the lit and the shaded side (the card's value span, his packs' 118 and up)
    lv = c1 @ np.array([0.299, 0.587, 0.114])
    c1 = np.clip(c1 * ((lv + 0.30 * np.clip(lv - 0.30, 0, None)) / np.maximum(lv, 1e-3))[..., None], 0, 1)
    # THE SNAP toward his family's colours
    lut = snap_lut(); qi = np.clip((c1 * 255) // 8, 0, 31).astype(int)
    tgt = lut[qi[..., 0], qi[..., 1], qi[..., 2]]
    em1 = emit.reshape(H, SS, W, SS).mean((1, 3)) > 0.5
    pull = np.where(em1, 0.15, 0.6)
    c1 = c1 + (tgt - c1) * pull[..., None]
    # THE GRAIN, at the sprite's own pixels (the guide's grain_per_m, about two pixels at 57 ppm, and its octave): his packs
    # never hold two pixels of one colour side by side for long, and a grain laid before the average is averaged away
    hs = hit.reshape(H, SS, W, SS).sum((1, 3)).astype(float)
    P1 = (Pm * hit[..., None]).reshape(H, SS, W, SS, 3).sum((1, 3)) / np.maximum(1, hs)[..., None]
    wm = np.clip((dustm * hit).reshape(H, SS, W, SS).sum((1, 3)) / np.maximum(1, hs) * 2, 0, 1)
    g1 = (noise3(P1, GUIDE['grain_per_m'], 5) - 0.5) * 2 * 0.7 + (noise3(P1, GUIDE['grain_per_m'] * 2.1, 6) - 0.5) * 2 * 0.3
    amp = (GUIDE['grain_rest'] + (GUIDE['grain_wear'] - GUIDE['grain_rest']) * wm) * 0.46
    amp = np.where(em1, 0.03, amp)
    fine = noise3(P1, 171.0, 7) - 0.5                       # under a pixel: his packs' thousands of colours, a value or two each way
    c1 = np.clip(c1 * (1 + amp * g1)[..., None] + (0.07 * fine * np.where(em1, 0.3, 1.0))[..., None] * np.array([1.0, 0.96, 0.9]), 0, 1)
    # THE RING: the outer pixel a few values darker
    ring = solid & ~ndimage.binary_erosion(solid)
    c1[ring] = np.clip(c1[ring] - GUIDE['ring'] / 255.0, 0, 1)
    out = np.zeros((H, W, 4), np.uint8)
    out[..., :3] = np.clip(c1 * 255 + 0.5, 0, 255).astype(np.uint8)
    out[..., 3] = np.where(solid, 255, np.clip(sh1 * GUIDE['shadow_alpha_max'] * 255, 0, 255)).astype(np.uint8)
    out[~solid, :3] = (12, 9, 6)
    im = Image.fromarray(out, 'RGBA')
    # the footprint on the ground (metres, x and y) for the walk and the taps
    foot = [float(V[:, 0].min()), float(V[:, 1].min()), float(V[:, 0].max()), float(V[:, 1].max())]
    return im, {'foot_px': [ox, oy], 'footprint_m': [round(v, 3) for v in foot], 'height_m': round(float(V[:, 2].max()), 3)}


# ----------------------------------------------------------------------------- the ground plate, quilted from the rig's sand
CLEAN = [(40, 980, 640, 1090), (660, 930, 1700, 1090), (1250, 690, 1690, 925), (40, 700, 560, 880), (900, 380, 1400, 470),
         (60, 220, 600, 370), (880, 120, 1250, 310), (1380, 0, 2050, 100), (1000, 0, 1290, 120)]


def plate():
    src = np.asarray(Image.open(os.path.join(R, 'slices/settlement_ground_packs/camp_0.webp')).convert('RGB')).astype(np.float64)
    # the render's own slow light and dark goes (it came out as blocks when quilted); its grain, rocks and scrub stay
    low = ndimage.gaussian_filter(src, (36, 36, 0))
    src = src - low + np.median(src.reshape(-1, 3), 0)
    PW, PH, P, O = 2060, 1092, 120, 30
    rng = np.random.RandomState(260)
    cands = []
    for (x0, y0, x1, y1) in CLEAN:
        for yy in range(y0, max(y0 + 1, y1 - P), 9):
            for xx in range(x0, max(x0 + 1, x1 - P), 9):
                if xx + P <= src.shape[1] and yy + P <= src.shape[0]:
                    cands.append((xx, yy))
    cands = np.array(cands)
    out = np.zeros((PH + P, PW + P, 3)); step = P - O
    for by in range(0, PH, step):
        for bx in range(0, PW, step):
            pick = cands[rng.choice(len(cands), size=min(60, len(cands)), replace=False)]
            best, bs, scored = None, 1e18, []
            for (xx, yy) in pick:
                patch = src[yy:yy + P, xx:xx + P]; e = 0
                if bx > 0:
                    e += ((patch[:, :O] - out[by:by + P, bx:bx + O]) ** 2).sum()
                if by > 0:
                    e += ((patch[:O, :] - out[by:by + O, bx:bx + P]) ** 2).sum()
                scored.append((e, xx, yy))
            scored.sort(key=lambda t: t[0])
            e, xx, yy = scored[rng.randint(0, min(6, len(scored)))]   # one of the six best, so no stone repeats in a row
            patch = src[yy:yy + P, xx:xx + P].copy()
            mask = np.ones((P, P))
            if bx > 0:   # the least-different seam down the left overlap
                err = ((patch[:, :O] - out[by:by + P, bx:bx + O]) ** 2).sum(-1)
                cut = seam(err)
                for r in range(P):
                    mask[r, :cut[r]] = 0
            if by > 0:
                err = ((patch[:O, :] - out[by:by + O, bx:bx + P]) ** 2).sum(-1).T
                cut = seam(err)
                for c in range(P):
                    mask[:cut[c], c] = np.minimum(mask[:cut[c], c], 0)
            mask = ndimage.gaussian_filter(mask, 1.2)
            if bx == 0 and by == 0:
                mask[:] = 1
            reg = out[by:by + P, bx:bx + P]
            out[by:by + P, bx:bx + P] = reg * (1 - mask[..., None]) + patch * mask[..., None]
    out = out[:PH, :PW]
    # the slow light and dark of the open ground (the render's own patches of darker sand), seeded
    lo = ndimage.gaussian_filter(rng.rand(PH // 64 + 2, PW // 64 + 2), 1.0)
    lo = np.asarray(Image.fromarray(((lo - lo.min()) / (np.ptp(lo) + 1e-9) * 255).astype(np.uint8)).resize((PW, PH), Image.BICUBIC)) / 255.0
    out = out * (0.90 + 0.14 * lo[..., None])
    day = np.clip(out, 0, 255).astype(np.uint8)
    # the night: the moon's grey-blue at the night pictures' measured ground median
    lum = (out @ np.array([0.299, 0.587, 0.114])) / 255.0
    med = float(np.median(lum)); want = 0.215
    n = out / 255.0 * (want / med)
    n = desat(n, 0.55) * np.array([0.86, 0.93, 1.10])
    night = np.clip(n * 255, 0, 255).astype(np.uint8)
    return Image.fromarray(day), Image.fromarray(night), med


def seam(err):
    """the least-different path down an overlap (rows x cols), one column a row"""
    Hh, Ww = err.shape; E = err.copy(); back = np.zeros((Hh, Ww), int)
    for r in range(1, Hh):
        for c in range(Ww):
            lo, hi = max(0, c - 1), min(Ww, c + 2)
            j = lo + int(np.argmin(E[r - 1, lo:hi])); back[r, c] = j; E[r, c] += E[r - 1, j]
    path = np.zeros(Hh, int); path[-1] = int(np.argmin(E[-1]))
    for r in range(Hh - 1, 0, -1):
        path[r - 1] = back[r, path[r]]
    return path


# ----------------------------------------------------------------------------- the sheet
def pack(items):
    """shelf-pack the sprites into one sheet, 2 px apart"""
    items = sorted(items, key=lambda t: -t[1].size[1])
    Wmax = 2048; x = y = rowh = 0; rects = {}
    for name, im, meta in items:
        w, h = im.size
        if x + w > Wmax:
            x = 0; y += rowh + 2; rowh = 0
        rects[name] = (x, y, w, h); x += w + 2; rowh = max(rowh, h)
    sheet = Image.new('RGBA', (Wmax, y + rowh), (0, 0, 0, 0))
    for name, im, meta in items:
        x, y, w, h = rects[name]; sheet.paste(im, (x, y))
    # trim the width to what is used
    used = max(r[0] + r[2] for r in rects.values())
    return sheet.crop((0, 0, used, sheet.size[1])), rects


def card(im, name):
    tmp = os.path.join('/tmp', 'camp2_card_' + name + '.png'); im.save(tmp)
    r = subprocess.run([sys.executable, os.path.join(R, 'skills/bohemia-pixel-art/scripts/check.py'), tmp, 'prop'], capture_output=True, text=True)
    os.remove(tmp)
    return {'back': r.returncode != 0, 'rows': [l.strip() for l in r.stdout.splitlines() if l.strip().startswith(('ok', 'OUT', 'out', 'FAIL', 'IN', 'in', '  '))][:24]}


def main():
    os.makedirs(OUT, exist_ok=True)
    pieces = [('tent_olive', tent('olive', 1)), ('tent_tarp', tent('tarp', 2)), ('tent_stripe', tent('stripe', 3)),
              ('fire_cold', fire(cold=True)), ('bedroll', turned(bedroll(), 90)), ('supplies', supplies()), ('smart_cart', smart_cart()),
              ('f_cook', cook_pot()), ('f_blacksmith', anvil()), ('f_surgeon', turned(cot(), 90)), ('f_lookout', lookout()),
              ('f_scout', turned(bike(), 75)), ('f_paymaster', strongbox()), ('seats', seats()), ('slain_few', slain(2)), ('slain_some', slain(4)), ('slain_many', slain(7))]
    pieces += [('fire_%d' % i, fire(key=i)) for i in range(6)]
    items, meta = [], {}
    for name, mesh in pieces:
        im, mt = render(mesh, name)
        items.append((name, im, mt)); meta[name] = mt
        print('  %-14s %4d x %-4d  foot %s' % (name, im.size[0], im.size[1], mt['foot_px']))
    # the fire's keys share one box, so the flames never jitter: every key padded to the widest
    fw = max(meta['fire_%d' % i]['foot_px'][0] for i in range(6)); fh = max(meta['fire_%d' % i]['foot_px'][1] for i in range(6))
    fr = max(dict((n, i) for n, i, m in items)['fire_%d' % k].size[0] - meta['fire_%d' % k]['foot_px'][0] for k in range(6))
    fb = max(dict((n, i) for n, i, m in items)['fire_%d' % k].size[1] - meta['fire_%d' % k]['foot_px'][1] for k in range(6))
    for j, (name, im, mt) in enumerate(items):
        if name.startswith('fire_') and name != 'fire_cold':
            c = Image.new('RGBA', (fw + fr, fh + fb), (0, 0, 0, 0)); c.paste(im, (fw - mt['foot_px'][0], fh - mt['foot_px'][1]))
            items[j] = (name, c, mt); meta[name] = dict(mt, foot_px=[fw, fh])
    sheet, rects = pack(items)
    sheet.save(os.path.join(OUT, 'kit.png'), optimize=True)
    cards = {}
    for name, im, mt in items:
        if name.startswith('fire_') and name not in ('fire_0', 'fire_cold'):
            continue
        cards[name] = card(im, name)
    kit = {'_about': 'CAMP TWO (rules 260, 259, 267(c), 269(c)): his camp\'s pieces, made at the source on the style guide\'s rig numbers '
                     '(tools/bohemia_camp2_cook_the_camp.py); rect [x, y, w, h] on kit.png, foot the ground point inside the rect, '
                     'footprint_m the piece on the ground in metres (x east, y north) about that point; ppm the sheet\'s pixels a metre.',
           'ppm': PPM, 'man_px': 98, 'draft': True, 'tool': 'tools/bohemia_camp2_cook_the_camp.py',
           'cart_rig': '../records/target/master_rig/cook_cart/', 'truck_rig': '../records/target/master_rig/truck/',
           'trailer_rig': '../records/target/master_rig/cook_trailer/',
           'fire_keys': 6, 'fire_keys_per_beat': GUIDE['keys_per_beat'],
           'pieces': {n: {'rect': list(rects[n]), 'foot': meta[n]['foot_px'], 'footprint_m': meta[n]['footprint_m'], 'height_m': meta[n]['height_m']} for n in rects},
           'card': {n: c['back'] for n, c in cards.items()}}
    day, night, med = plate()
    day.save(os.path.join(OUT, 'plate.webp'), quality=88, method=6)
    night.save(os.path.join(OUT, 'plate_night.webp'), quality=88, method=6)
    kit['plate'] = {'src': 'plate.webp', 'night_src': 'plate_night.webp', 'px': [2060, 1092], 'ppm': 515 / 12.0,
                    'day_ground_median': round(med, 3), 'night_ground_median': 0.215,
                    'from': 'slices/settlement_ground_packs/camp_0.webp, quilted from its clean sand (CLEAN boxes in the tool)'}
    json.dump(kit, open(os.path.join(OUT, 'kit.json'), 'w'), indent=1)
    backs = [n for n, c in cards.items() if c['back']]
    print('sheet %d x %d; card BACK on %d of %d: %s' % (sheet.size[0], sheet.size[1], len(backs), len(cards), ', '.join(backs) or 'none'))


if __name__ == '__main__':
    main()
