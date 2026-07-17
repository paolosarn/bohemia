#!/usr/bin/env python3
"""BOHEMIA TRAFFIC SIGNAL FACTORY (7/17/26) — the first commissioned original.

Paolo, verbatim intent: "a large hanging street light... the red yellow and
the green ones. It's tall and hangs above... real street lights for the cars,
overhanging, very tall, with street signs and stuff." Vegas mast-arm signals.

v8 (7/18 early, Paolo's expansion): "how far the pole goes out needs to be
more accurate to how wide the street is... a bunch of different versions of
these different widths... some of them are gonna collapse over the decades...
a broken piece on the floor next to it... maybe someone did a decent job
[splicing it back]... maybe it's broken and there's no street light [head]...
different colors if research says so... an east and west version... one more
pixel black border, it's looking a little thin."

  - ARM LAW: arm reach tracks street width. 1-lane -> short (2 cells),
    2-lane -> med (3 cells), 3-lane -> long (4.5 cells). Heads scale with
    lanes (1/2/3), like real signal warrants.
  - COLOR RESEARCH (7/18): real mast arms are HOT-DIP GALVANIZED steel —
    zinc-gray, 25-50 year coating life — so decades on, the world's masts
    are dull weathered GRAY with rust at welds/joints/bases; only the
    oldest, coating-stripped masts brown out fully. Two families: 'galv'
    (majority) + 'bronze' (rusted-through, the lamp's family).
  - WRECK KINDS: fallen_arm (jagged stub, the arm piece + a dead head on
    the ground beside the base), jury_rigged (spliced with wrap lashing,
    sagging past the splice), headless (arm up, heads gone, cable dangles).
  - EAST + WEST: every sprite ships both directions; per-entry pcx anchors
    the pole for the bake (no transpose guessing downstream).
  - THE BORDER: silhouette outline is now TWO passes — the sampled dark rim
    plus 1px true black around everything (Paolo: reading thin vs corpus).

Standing contract (unchanged): palette SAMPLED from the blessed lamp bank;
THE 45 DEGREE LAW (ellipse tops, sky-lit faces, bowed bands, gate art_45);
DEAD is the act-1 default; sign plates ILLEGIBLE; no purple; deterministic.

OUTPUT: banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt (UNJUDGED):
2 colors x 3 arms x 4 states x 2 dirs intact (48) + 2 colors x 3 wreck
kinds x 2 dirs dead (12) = 60 sprites.

Run from repo root: python3 tools/bohemia_traffic_signal_factory.py
"""
import base64
import io
import json
import math
import sys

import numpy as np
from PIL import Image

LAMPS = 'banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt'
OUT = 'banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt'
T = 44
CH = 232            # sprite height: ~5 tiles tall
POLE_CX = 16        # pole centerline in every EAST sprite (pcx in the bank)

# ARM LAW v2 (Paolo 7/18: "extend to half way of the street... cover the
# whole forward facing driving lane"): the arm reaches the MEDIAN — one
# cell from the sidewalk pole to the curb plus lanes*(2+1) cells of
# forward lanes. 1 lane -> 3 cells, 2 -> 6, 3 -> 9. Heads hang one per
# lane at the lane centers.
ARMS = [('short', 3.0, 1), ('med', 6.0, 2), ('long', 9.0, 3)]  # name, cells, heads
ARM_LAW = {1: 'short', 2: 'med', 3: 'long'}                    # street lanes -> arm
WRECKS = [('fallen_arm', 9.0), ('jury_rigged', 6.0), ('headless', 9.0),
          ('dropped_heads', 9.0)]


def rng(seed):
    s = seed & 0xffffffff
    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def sampled_kit():
    """Sample the blessed lamp into a paint kit: outline tone, a 5-step
    luminance ramp, the warm rust cluster, the true specular cluster."""
    d = json.load(open(LAMPS))
    a = np.asarray(Image.open(io.BytesIO(base64.b64decode(d['lamps'][0]['b64']))).convert('RGBA'))
    op = a[..., 3] > 200
    px = a[op][:, :3].astype(int)
    lum = px.mean(axis=1)
    order = np.argsort(lum)

    def smooth(p, win=150):
        i = int(p / 100.0 * (len(order) - 1))
        sel = px[order[max(0, i - win):i + win]]
        return tuple(sel.mean(axis=0).astype(int).tolist())

    warm = px[(px[:, 0] - px[:, 2] > 45) & (lum > 50)]
    if len(warm) < 30:
        rust = [(96, 56, 26), (136, 86, 38), (170, 118, 52)]
    else:
        wl = warm.mean(axis=1)
        wo = np.argsort(wl)
        rust = [tuple(warm[wo[len(wo) // 5]].tolist()),
                tuple(warm[wo[len(wo) // 2]].tolist()),
                tuple(warm[wo[(4 * len(wo)) // 5]].tolist())]
    return {'outline': smooth(2), 'ramp': [smooth(15), smooth(35), smooth(55),
            smooth(75), smooth(90)], 'rust': rust, 'spec': smooth(97, win=60)}


def palette(color):
    """'bronze' = the sampled lamp kit verbatim (rusted-through steel).
    'galv' = the same sampled luminance LADDER re-hued to weathered zinc
    (the researched majority: hot-dip galvanized gray, rust at the joints —
    rust stays the sampled warm cluster because rust is rust)."""
    K = sampled_kit()
    if color == 'bronze':
        return K
    def zinc(c):
        g = int(sum(c) / 3.0)
        return (max(0, int(g * 0.96)), max(0, int(g * 1.00)), max(0, min(255, int(g * 1.07))))
    spec = zinc(K['spec'])
    while sum(spec) > 548:                      # dead-state law headroom
        spec = tuple(int(v * 0.97) for v in spec)
    return {'outline': zinc(K['outline']), 'ramp': [zinc(c) for c in K['ramp']],
            'rust': K['rust'], 'spec': spec}


def put(a, x, y, c, alpha=255):
    if 0 <= x < a.shape[1] and 0 <= y < a.shape[0]:
        a[y, x] = [c[0], c[1], c[2], alpha]


def vline(a, x, y0, y1, c, w=1):
    for yy in range(y0, y1):
        for dx in range(w):
            put(a, x + dx, yy, c)


def hline(a, x0, x1, y, c, w=1):
    for xx in range(x0, x1):
        for dy in range(w):
            put(a, xx, y + dy, c)


def rect(a, x0, y0, x1, y1, c):
    for yy in range(y0, y1):
        for xx in range(x0, x1):
            put(a, xx, yy, c)


def shade_of(c, f):
    return (max(0, min(255, int(c[0] * f))), max(0, min(255, int(c[1] * f))),
            max(0, min(255, int(c[2] * f))))


def mix(c1, c2, t):
    return (int(c1[0] * (1 - t) + c2[0] * t), int(c1[1] * (1 - t) + c2[1] * t),
            int(c1[2] * (1 - t) + c2[2] * t))


def cyl_index(u, r):
    """Tone index 0..4 across a cylinder: dark edges, a narrow decisive
    bright band at ~0.33, small boundary dither only."""
    u = u + (r() - 0.5) * 0.05
    if u < 0.055 or u >= 0.945:
        return 0
    if u < 0.14 or u >= 0.82:
        return 1
    if u < 0.23 or u >= 0.60:
        return 2
    if 0.27 <= u < 0.40:
        return 4
    return 3


def bow(u, depth=2):
    """THE 45 DEGREE LAW: horizontal edges wrap toward the viewer."""
    return int(round(depth * (1.0 - (2.0 * u - 1.0) ** 2)))


def ellipse_disc(a, K, r, cx, cy, rx, ry, wall_h, tone_shift=0):
    """A disc from the world's 45: lit elliptical top face + wall skirt."""
    ramp = K['ramp']
    for xx in range(-rx, rx + 1):
        u = (xx + rx + 0.5) / (2.0 * rx + 1.0)
        edge = int(round(ry * math.sqrt(max(0.0, 1.0 - (xx / (rx + 0.001)) ** 2))))
        for yy in range(-edge, edge + 1):
            ti = 4 if yy <= 0 else 3
            if r() < 0.12:
                ti -= 1
            ti = min(4, max(0, ti + tone_shift))
            c = ramp[ti]
            if yy == -edge and xx < 0 and r() < 0.45:
                c = K['spec']
            put(a, cx + xx, cy + yy, shade_of(c, 0.94 + 0.12 * r()))
        for k in range(1, wall_h + 1):
            ti = max(0, cyl_index(u, r) - 1)
            put(a, cx + xx, cy + edge + k, shade_of(ramp[ti], 0.92 + 0.12 * r()))


def bowed_band(a, K, r, cx, y, w, h=3, depth=2, tone_shift=1):
    """A ring wrapping the pole: edges high, center bows toward the viewer,
    top lip catches the sky."""
    ramp = K['ramp']
    x0 = int(round(cx - w / 2.0))
    for i in range(w):
        u = (i + 0.5) / w
        dy = bow(u, depth)
        for k in range(h):
            ti = min(4, max(0, cyl_index(u, r) + tone_shift))
            if k == 0:
                c = K['spec'] if r() < 0.3 else ramp[min(4, ti + 1)]
            else:
                c = ramp[ti]
            put(a, x0 + i, y + dy + k, shade_of(c, 0.94 + 0.12 * r()))


class RustField(object):
    """Coherent rust blotches; `centers` puts them where water sits."""
    def __init__(self, r, x0, x1, y0, y1, k=6, centers=None):
        self.blobs = []
        for cx, cy in (centers or []):
            self.blobs.append((cx + (r() - 0.5) * 3, cy + r() * 4,
                               1.5 + r() * 2.0, 3.0 + r() * 7.0))
        for _ in range(k):
            self.blobs.append((x0 + r() * (x1 - x0), y0 + r() * (y1 - y0),
                               1.5 + r() * 2.5, 3.0 + r() * 9.0))

    def w(self, x, y):
        best = 0.0
        for bx, by, rx, ry in self.blobs:
            d = ((x - bx) / rx) ** 2 + ((y - by) / ry) ** 2
            if d < 4.0:
                best = max(best, math.exp(-d))
        return best


def paint_cyl_v(a, K, r, cx, y0, y1, w_of, rust=None, tone_shift=0):
    """Vertical cylinder with calm grain and true spec glints on the band."""
    ramp = K['ramp']
    for yy in range(y0, y1):
        w = w_of(yy)
        x0 = int(round(cx - w / 2.0))
        wob = 0.03 * math.sin(yy * 0.07)
        for i in range(w):
            u = (i + 0.5) / w + wob
            ti = min(4, max(0, cyl_index(u, r) + tone_shift))
            c = ramp[ti]
            if ti == 4 and r() < 0.22:
                c = K['spec']
            c = shade_of(c, 0.95 + 0.10 * r())
            if rust is not None:
                rw = rust.w(x0 + i, yy)
                if rw > 0.18 and r() < rw:
                    c = mix(c, K['rust'][int(r() * 3) % 3], 0.55 + 0.3 * rw)
            put(a, x0 + i, yy, c)


def paint_cyl_h(a, K, r, x0, x1, y_of, h_of, rust=None):
    """Horizontal cylinder, sky-lit from the top (THE 45 LAW)."""
    ramp = K['ramp']
    for xx in range(x0, x1):
        h = h_of(xx)
        yt = y_of(xx)
        for i in range(h):
            u = (i + 0.5) / h + (r() - 0.5) * 0.06
            ti = 4 if u < 0.26 else (3 if u < 0.5 else (2 if u < 0.72 else (1 if u < 0.9 else 0)))
            c = K['spec'] if (ti == 4 and r() < 0.18) else ramp[ti]
            c = shade_of(c, 0.95 + 0.10 * r())
            if rust is not None:
                rw = rust.w(xx, yt + i)
                if rw > 0.18 and r() < rw:
                    c = mix(c, K['rust'][int(r() * 3) % 3], 0.55 + 0.3 * rw)
            put(a, xx, yt + i, c)


def drips(a, K, r, x0, x1, y, n=3):
    for _ in range(n):
        x = x0 + int(r() * max(1, x1 - x0))
        ln = 3 + int(r() * 9)
        for k in range(ln):
            yy = y + k
            if 0 <= yy < a.shape[0] and 0 <= x < a.shape[1] and \
                    r() < 0.75 and a[yy, x, 3] > 0:
                base = a[yy, x, :3].astype(int)
                a[yy, x, :3] = np.array(mix(tuple(base.tolist()),
                                            K['rust'][int(r() * 3) % 3], 0.5))


def draw_head(a, K, hx, hy, state, r, big=True, facing=0):
    """3-lens signal head: outlined box with a 45-view top + side face,
    wrapping visors, radial lenses. state: dead | red | amber | green.
    facing: 0 = at the camera; +1/-1 = east/west (v11, Paolo's circle:
    an east/west stoplight still LOOKS LIKE THE STOPLIGHT — full-mass
    head, lights readable; the facing shows as the lenses biased toward
    that edge and the visor cowls reaching out on that side, never a
    skinny sliver)."""
    hw, lens = (20, 12) if big else (14, 9)
    hh = lens * 3 + 14
    side = 3 if big else 2
    back = (38, 36, 20)
    HRAMP = [(12, 12, 14), (24, 24, 26), (40, 40, 44), (64, 66, 74)]
    rect(a, hx - 3, hy - 2, hx + hw + 3, hy + hh + 2, back)
    vline(a, hx - 3, hy - 2, hy + hh + 2, shade_of(back, 1.45))
    for k in range(side):
        vline(a, hx + hw + 3 + k, hy - 1 + k, hy + hh + 2, shade_of(back, 0.5))
    for xx in range(hx - 3, hx + hw + 3 + side):
        u = (xx - hx + 3 + 0.5) / (hw + 6.0 + side)
        dy = bow(u, 1)
        put(a, xx, hy - 2 + dy, shade_of(back, 1.5))
        put(a, xx, hy - 1 + dy, shade_of(back, 1.2))
        put(a, xx, hy + hh + 1 + dy, shade_of(back, 0.55))
    for yy in range(hy, hy + hh):
        for xx in range(hx, hx + hw):
            u = (xx - hx + 0.5) / hw
            ti = 3 if u < 0.18 else (2 if u < 0.5 else (1 if u < 0.85 else 0))
            if r() < 0.10:
                ti = max(0, ti - 1)
            put(a, xx, yy, HRAMP[ti])
    for xx in range(hx, hx + hw):
        u = (xx - hx + 0.5) / hw
        put(a, xx, hy + bow(u, 1), HRAMP[3])
    for bx2, by2 in ((hx + 1, hy + 1), (hx + hw - 2, hy + 1),
                     (hx + 1, hy + hh - 2), (hx + hw - 2, hy + hh - 2)):
        put(a, bx2, by2, K['outline'])
        put(a, bx2 + 1, by2, HRAMP[3])
    LENS = {
        'red':   ((70, 18, 16), (235, 60, 38)),
        'amber': ((66, 44, 12), (250, 176, 40)),
        'green': ((14, 48, 30), (60, 220, 110)),
    }
    for i, name in enumerate(('red', 'amber', 'green')):
        cy = hy + 4 + i * (lens + 3)
        dark, lit = LENS[name]
        on = (state == name)
        col = lit if on else dark
        cx = hx + hw // 2 + facing * 3      # lenses ride the facing edge
        rad = lens // 2
        vx0 = cx - rad - 3 - (4 if facing < 0 else 0)
        vx1 = cx + rad + 4 + (4 if facing > 0 else 0)
        for xx in range(vx0, vx1):
            u = (xx - vx0 + 0.5) / float(vx1 - vx0)
            dy = bow(u, 1)
            if facing and ((facing > 0 and xx >= vx1 - 2) or (facing < 0 and xx < vx0 + 2)):
                dy += 1                     # the cowl tip droops past the box
            put(a, xx, cy - 3 + dy, (88, 92, 102) if r() < 0.3 else HRAMP[3])
            put(a, xx, cy - 2 + dy, HRAMP[0])
        for yy in range(-rad, rad + 1):
            for xx in range(-rad, rad + 1):
                if xx * xx + yy * yy <= rad * rad:
                    if on:
                        f = 1.0
                    else:
                        f = 0.62 + 0.38 * (1 - (xx * xx + yy * yy) / float(rad * rad))
                        f *= 0.85 + 0.15 * r()
                    put(a, cx + xx, cy + rad // 2 + yy + 1, shade_of(col, f))
        if not on:
            put(a, cx - rad // 2, cy, (104, 106, 116))
        if on:
            for yy in range(-rad - 2, rad + 3):
                for xx in range(-rad - 2, rad + 3):
                    d2 = xx * xx + yy * yy
                    if rad * rad < d2 <= (rad + 2) * (rad + 2):
                        gx, gy = cx + xx, cy + rad // 2 + yy + 1
                        if 0 <= gx < a.shape[1] and 0 <= gy < a.shape[0] and a[gy, gx, 3] > 0:
                            base = a[gy, gx, :3].astype(int)
                            mixed = (base * 0.45 + np.array(lit) * 0.55).astype(int)
                            a[gy, gx, :3] = np.clip(mixed, 0, 255)
    return hh


def draw_sign_plate(a, K, x0, y, w, r):
    """Illegible street-name plate, hung a pixel askew. NEVER letters."""
    plate = (24, 62, 44)
    half = x0 + w // 2
    for xx in range(x0, x0 + w):
        dy = 1 if xx >= half else 0
        for yy in range(y + dy, y + 15 + dy):
            v = (yy - y - dy) / 15.0
            f = 1.25 if v < 0.2 else (1.0 if v < 0.7 else 0.72)
            put(a, xx, yy, shade_of(plate, f * (0.92 + 0.16 * r())))
    for xx in range(x0, x0 + w):
        put(a, xx, y - 1 + (1 if xx >= half else 0), shade_of(plate, 1.55))
    vline(a, x0 + w - 1, y + 2, y + 16, shade_of(plate, 0.5))
    put(a, x0 + 3, y - 2, K['ramp'][1]); put(a, x0 + w - 4, y - 1, K['ramp'][1])
    for k in range(w // 5):
        if r() < 0.7:
            mx = x0 + 3 + int(r() * (w - 6))
            ml = 1 + int(r() * 3)
            hline(a, mx, mx + ml, y + 4 + int(r() * 4) + (1 if mx >= half else 0),
                  (168, 172, 160))


def draw_head_back(a, K, hx, hy, state, r, big=True):
    """A signal head seen from BEHIND (v9, Paolo: "what about when it's
    facing north or south"). Heads serving the southbound approach face
    north, so the world's 45 camera sees their backs: the yellowed
    backplate, the housing's ribbed back panel, visor edges poking out at
    each lens height — NO lenses. A lit head shows only as light SPILL
    haloing the housing edges."""
    hw, lens = (20, 12) if big else (14, 9)
    hh = lens * 3 + 14
    back = (38, 36, 20)
    HRAMP = [(12, 12, 14), (24, 24, 26), (40, 40, 44), (64, 66, 74)]
    # backplate, full face of it this time (it's what faces the camera)
    rect(a, hx - 3, hy - 2, hx + hw + 3, hy + hh + 2, back)
    for yy in range(hy - 2, hy + hh + 2):
        for xx in range(hx - 3, hx + hw + 3):
            if r() < 0.15:
                put(a, xx, yy, shade_of(back, 0.8 + 0.4 * r()))
    for xx in range(hx - 3, hx + hw + 3):
        u = (xx - hx + 3 + 0.5) / (hw + 6.0)
        dy = bow(u, 1)
        put(a, xx, hy - 2 + dy, shade_of(back, 1.5))
        put(a, xx, hy + hh + 1 + dy, shade_of(back, 0.55))
    # housing back panel, inset, with rib seams between the lens chambers
    rect(a, hx + 2, hy + 1, hx + hw - 2, hy + hh - 1, HRAMP[1])
    vline(a, hx + 2, hy + 1, hy + hh - 1, HRAMP[2])
    for i in range(1, 3):
        sy = hy + 4 + i * (lens + 3) - 3
        hline(a, hx + 2, hx + hw - 2, sy, HRAMP[0])
        hline(a, hx + 2, hx + hw - 2, sy + 1, HRAMP[2])
    # hatch bolts on the back panel
    for bx2, by2 in ((hx + 4, hy + 3), (hx + hw - 5, hy + 3),
                     (hx + 4, hy + hh - 4), (hx + hw - 5, hy + hh - 4)):
        put(a, bx2, by2, K['outline'])
    LENS_LIT = {'red': (235, 60, 38), 'amber': (250, 176, 40), 'green': (60, 220, 110)}
    for i, name in enumerate(('red', 'amber', 'green')):
        cy = hy + 4 + i * (lens + 3)
        # visor edges poke out past the plate at each lens height
        put(a, hx - 4, cy - 1, HRAMP[0]); put(a, hx - 4, cy, HRAMP[1])
        put(a, hx + hw + 3, cy - 1, HRAMP[0]); put(a, hx + hw + 3, cy, HRAMP[1])
        if state == name:
            lit = LENS_LIT[name]
            # light SPILL: rgb-only tint on the plate rim + visor tips
            for xx in range(hx - 4, hx + hw + 4):
                for yy in (cy - 2, cy - 1, cy, cy + 1):
                    if 0 <= xx < a.shape[1] and 0 <= yy < a.shape[0] and a[yy, xx, 3] > 0:
                        if xx < hx or xx >= hx + hw:
                            base = a[yy, xx, :3].astype(int)
                            a[yy, xx, :3] = np.clip(
                                (base * 0.55 + np.array(lit) * 0.45).astype(int), 0, 255)
    return hh


def draw_sign_back(a, K, x0, y, w, r):
    """The street-name plate from behind: unpainted metal back, bracket,
    no green, no marks (there is nothing to read on the back of a sign)."""
    for xx in range(x0, x0 + w):
        dy = 1 if xx >= x0 + w // 2 else 0
        for yy in range(y + dy, y + 15 + dy):
            v = (yy - y - dy) / 15.0
            ti = 3 if v < 0.2 else (2 if v < 0.75 else 1)
            put(a, xx, yy, shade_of(K['ramp'][ti], 0.9 + 0.16 * r()))
    vline(a, x0 + w // 2, y + 1, y + 15, K['ramp'][0])   # mounting channel
    put(a, x0 + 3, y - 2, K['ramp'][1]); put(a, x0 + w - 4, y - 1, K['ramp'][1])


def outline_pass(a, col):
    """1px rim drawn into the transparent pixels touching the silhouette."""
    op = a[..., 3] > 0
    nb = np.zeros_like(op)
    nb[1:, :] |= op[:-1, :]; nb[:-1, :] |= op[1:, :]
    nb[:, 1:] |= op[:, :-1]; nb[:, :-1] |= op[:, 1:]
    edge = nb & ~op
    a[edge, 0] = col[0]; a[edge, 1] = col[1]; a[edge, 2] = col[2]; a[edge, 3] = 255


def composite(a, piece, x0, y0):
    h, w = piece.shape[:2]
    y1 = min(a.shape[0], y0 + h); x1 = min(a.shape[1], x0 + w)
    if y1 <= y0 or x1 <= x0:
        return
    sub = piece[0:y1 - y0, 0:x1 - x0]
    m = sub[..., 3] > 0
    a[y0:y1, x0:x1][m] = sub[m]


def draw_mast(a, K, r, pcx, y_off=0):
    """The standing mast: ellipse base stack, planted pole, cap, collars,
    rivets (v7 occlusion order). Shared by every signal orientation.
    Returns the layout dict."""
    ground_y = y_off + CH - 4
    top_y = y_off + 12
    cy3 = ground_y - 7
    cy2 = cy3 - 7
    cy1 = cy2 - 5
    pole_top = top_y + 4
    pole_bot = cy1 - 2
    collar_ys = [pole_top + int((pole_bot - pole_top) * f) for f in (0.22, 0.52, 0.78)]
    rust = RustField(r, pcx - 8, pcx + 8, pole_top, pole_bot, k=3,
                     centers=[(pcx - 4, cyy + 5) for cyy in collar_ys] +
                             [(pcx + 4, collar_ys[1] + 5), (pcx, cy1 - 8)])

    def pole_w(yy):
        t = (yy - pole_top) / float(pole_bot - pole_top)
        return 10 + int(5 * t)

    ellipse_disc(a, K, r, pcx, cy3, 13, 4, 3)
    ellipse_disc(a, K, r, pcx, cy2, 11, 3, 3)
    ellipse_disc(a, K, r, pcx, cy1, 8, 2, 2, tone_shift=1)
    put(a, pcx - 9, cy3 - 1, K['ramp'][4]); put(a, pcx - 9, cy3, K['outline'])
    put(a, pcx + 9, cy3 - 1, K['ramp'][4]); put(a, pcx + 9, cy3, K['outline'])
    paint_cyl_v(a, K, r, pcx, pole_top, cy1 + 1, pole_w, rust=rust)
    ellipse_disc(a, K, r, pcx, pole_top - 1, 7, 2, 2, tone_shift=1)
    ellipse_disc(a, K, r, pcx, pole_top - 4, 3, 1, 1, tone_shift=1)
    for by in collar_ys:
        w = pole_w(by) + 4
        bowed_band(a, K, r, pcx, by, w, h=3, depth=2)
        drips(a, K, r, pcx - w // 2, pcx + w // 2, by + 6, n=2)
    for yy in range(pole_top + 8, pole_bot - 4, 11):
        put(a, pcx + 1, yy, K['outline'])
        put(a, pcx + 1, yy + 1, K['ramp'][4])
    return {'ground_y': ground_y, 'top_y': top_y, 'junction_y': top_y + 30,
            'pole_w': pole_w}


def draw_signal_vert(K, spec, seed):
    """v12 (Paolo, 7/18: "if its facing west or east... the stop lights
    [arm] will be UP OR DOWN"): the east/west-facing stoplight's arm spans
    the EW road, which on screen is VERTICAL. Same mast; the arm runs up
    (north, arm_dir n) or down (south, arm_dir s) from the junction, full
    map length (arm_cells * T, the ARM LAW on the grid), with the full-mass
    heads hanging along it. spec['head_facing'] (+1 east / -1 west) is
    INDEPENDENT of the arm side, because a pole east of its road carries
    the arm on its west side while the lights can still face east (the
    v13 lesson: arm chirality and lens facing are separate axes).
    Returns (array, base_y)."""
    r = rng(seed)
    arm_len = int(spec['arm_cells'] * T)
    up = spec['arm_dir'] == 'n'
    hf = spec.get('head_facing', 1)
    kind = spec['kind']
    pcx = 26
    W = 108
    junction_local = 42                     # junction depth below sprite-local top
    pad_top = max(0, arm_len + 8 - junction_local) if up else 0
    pad_bot = max(0, (junction_local + arm_len + 40) - (CH - 4)) if not up else 0
    if kind == 'fallen_arm' and not up:
        # the fallen span lies from the BASE southward along the road
        pad_bot = max(pad_bot, int(arm_len * 0.85) + 24)
    H = CH + pad_top + pad_bot
    a = np.zeros((H, W, 4), dtype=np.uint8)
    M = draw_mast(a, K, r, pcx, y_off=pad_top)
    junction_y = M['junction_y']
    ax = pcx + 16                           # the arm rides off the pole line
    ay0, ay1 = (junction_y - arm_len, junction_y) if up else \
               (junction_y, junction_y + arm_len)

    def aw(yy):
        t = abs(yy - junction_y) / float(arm_len)
        return 7 - int(2 * t)

    n = spec['heads']
    if kind == 'fallen_arm':
        # v16 (Paolo: "take it how it is and break it and add it to the
        # floor"): the vertical arm sheared at the junction — a jagged
        # stub remains, and the span lies on the ROAD beside its old
        # line, dead heads still bolted, lenses staring at the sky.
        paint_cyl_h(a, K, r, pcx + 2, ax + 4, lambda xx: junction_y - 2, lambda xx: 6)
        bowed_band(a, K, r, pcx, junction_y - 2, M['pole_w'](junction_y) + 6, h=5, depth=2)
        stub = 24
        s0, s1 = (junction_y - stub, junction_y) if up else (junction_y, junction_y + stub)
        paint_cyl_v(a, K, r, ax, s0, s1, aw)
        for _ in range(10):                            # jagged shear
            by = (s0 + int(r() * 5)) if up else (s1 - 1 - int(r() * 5))
            bx = ax - 3 + int(r() * 7)
            if 0 <= by < H:
                a[by, bx] = 0
        drips(a, K, r, ax - 4, ax + 4, (s0 + 2) if up else (s1 - 8), n=2)
        # v17 (Paolo): the broke-off part lies AT THE BASE of the mast,
        # on the floor, running out along the road from the foot
        gx = ax + 14
        glen = int(arm_len * 0.85)
        base_row = pad_top + CH - 8
        g0, g1 = (base_row - glen, base_row) if up else \
                 (base_row - 16, base_row - 16 + glen)
        paint_cyl_v(a, K, r, gx, g0, g1, lambda yy: 7)
        for _ in range(8):                             # sheared both ends
            for ey in (g0 + int(r() * 4), g1 - 1 - int(r() * 4)):
                ex = gx - 3 + int(r() * 7)
                if 0 <= ey < H:
                    a[ey, ex] = 0
        for i in range(min(2, n)):                     # heads on their backs
            cy = (g0 + int((0.5 + 3 * i) * T)) if up else \
                 (g1 - 56 - int((0.5 + 3 * i) * T))
            draw_head(a, K, gx + 8, cy, 'dead', r)
            for _ in range(8):                         # shattered lens glass
                put(a, gx - 4 + int(r() * 44), cy + 30 + int(r() * 26),
                    (70, 18, 16) if r() < 0.5 else (66, 44, 12))
    else:
        # heads FIRST, at the LANE CENTERS measured from the median end,
        # DIRECTLY UNDER the arm (v15, Paolo: "these should be under the
        # pole, not just jutting out to the side") — the box centers
        # beneath the pipe with a small lean toward the facing side so the
        # lens column clears the arm, then the arm paints OVER their
        # middles (v14: we are looking down at it)
        clamp_ys = [(ay0 + int((0.5 + 3 * i) * T)) if up else
                    (ay1 - int((0.5 + 3 * i) * T)) for i in range(n)]
        hx = ax - 13 + 4 * hf
        if kind != 'dropped_heads':
            for cy in clamp_ys:
                draw_head(a, K, hx, cy - 26, spec['state'], r, facing=hf)
        else:
            # v17 (Paolo): pole and arm stay UP, the lights themselves lie
            # on the floor — each head dropped straight down from its old
            # clamp, on its back beside the pipe, glass around it
            for cy in clamp_ys:
                draw_head(a, K, ax + 6, cy - 12, 'dead', r)
                for _ in range(7):
                    put(a, ax - 6 + int(r() * 44), cy + 46 + int(r() * 10),
                        (70, 18, 16) if r() < 0.5 else (66, 44, 12))
        # elbow stub from the pole into the vertical arm + junction collar
        paint_cyl_h(a, K, r, pcx + 2, ax + 4, lambda xx: junction_y - 2, lambda xx: 6)
        bowed_band(a, K, r, pcx, junction_y - 2, M['pole_w'](junction_y) + 6, h=5, depth=2)
        # the arm OVER the heads
        paint_cyl_v(a, K, r, ax, ay0, ay1, aw)
        hline(a, ax - 3, ax + 4, (ay0 - 1) if up else ay1, K['ramp'][1])  # tip cap
        # clamps riding the arm over each hidden hanger
        for cy in clamp_ys:
            rect(a, ax - 3, cy - 2, ax + 4, cy + 2, K['ramp'][1])
            hline(a, ax - 3, ax + 4, cy - 2, K['spec'] if r() < 0.5 else K['ramp'][3])
    drips(a, K, r, pcx - 5, pcx + 5, junction_y + 8, n=2)
    outline_pass(a, K['outline'])
    outline_pass(a, (5, 5, 5))
    return a, pad_top + CH - 2


def draw_signal(K, spec, seed):
    """spec: {'arm_cells','heads','kind','state'} -> east-facing RGBA array."""
    r = rng(seed)
    W = int(POLE_CX + 12 + spec['arm_cells'] * T)
    a = np.zeros((CH, W, 4), dtype=np.uint8)
    kind = spec['kind']
    M = draw_mast(a, K, r, POLE_CX)
    ground_y = M['ground_y']
    top_y = M['top_y']
    pole_w = M['pole_w']

    # the arm: smooth quadratic off a low junction, leveling over the road
    junction_y = top_y + 30
    rise = 18
    arm_x1 = W - 8
    arm_lvl = junction_y - rise
    xs = POLE_CX + int(0.45 * (arm_x1 - POLE_CX))      # jury-rig splice point

    def arm_y(xx):
        s = (xx - POLE_CX) / float(arm_x1 - POLE_CX)
        e = min(1.0, s / 0.40)
        y = junction_y - rise * (1 - (1 - e) ** 2)
        if kind == 'jury_rigged' and xx >= xs:
            y += min(7, (xx - xs) // 6)                # sag past the splice
        return int(round(y))

    def arm_h(xx):
        s = (xx - POLE_CX) / float(arm_x1 - POLE_CX)
        return 9 - int(round(3 * s))

    arust = RustField(r, POLE_CX, arm_x1, arm_lvl - 4, junction_y + 6, k=4,
                      centers=[(POLE_CX + 14, junction_y - 10)])
    if kind == 'fallen_arm':
        stub_x1 = POLE_CX + 22
        paint_cyl_h(a, K, r, POLE_CX, stub_x1, arm_y, arm_h, rust=arust)
        for _ in range(10):                            # jagged shear at the break
            bx = stub_x1 - 1 - int(r() * 5)
            by = arm_y(bx) + int(r() * arm_h(bx))
            a[by, bx] = 0
        drips(a, K, r, stub_x1 - 8, stub_x1, arm_y(stub_x1 - 1) + 4, n=2)
    else:
        paint_cyl_h(a, K, r, POLE_CX, arm_x1, arm_y, arm_h, rust=arust)
    bowed_band(a, K, r, POLE_CX, junction_y - 2, pole_w(junction_y) + 6, h=5, depth=2)
    for k in range(20):
        sx = POLE_CX + 6 + k
        sy = junction_y + 14 - k
        if sy <= arm_y(sx) + arm_h(sx) - 1:
            break
        put(a, sx, sy, K['ramp'][1])
        put(a, sx + 1, sy, K['ramp'][2])
        put(a, sx + 2, sy, K['ramp'][0])

    if kind == 'jury_rigged':
        # the splice: somebody lashed it back with scavenged wrap + a plate
        for dx in range(-2, 6):
            top = arm_y(xs + dx) - 1
            bot = arm_y(xs + dx) + arm_h(xs + dx) + 1
            c = (30, 26, 20) if dx % 2 else (74, 66, 48)
            vline(a, xs + dx, top, bot, c)
        rect(a, xs - 4, arm_y(xs - 4) + 1, xs - 1, arm_y(xs - 4) + 4, K['ramp'][3])

    # heads, hangers, sign — ONE HEAD PER LANE at the lane centers,
    # measured from the median end of the arm (ARM LAW v2)
    n = spec['heads']
    head_xs = [arm_x1 - int((0.5 + 3 * i) * T) - 13 for i in range(n)]

    def hang(hx, sag=0):
        vline(a, hx + 8, arm_lvl + 6 + sag, arm_lvl + 13 + sag, K['ramp'][1], 2)
        vline(a, hx + 8, arm_lvl + 6 + sag, arm_lvl + 13 + sag, K['ramp'][3], 1)

    if kind in ('intact', 'jury_rigged'):
        for hx in head_xs:
            sag = (min(7, (hx - xs) // 6) if (kind == 'jury_rigged' and hx >= xs) else 0)
            rect(a, hx + 6, arm_y(hx + 8) - 1, hx + 12, arm_y(hx + 8) + 5, K['ramp'][1])
            hline(a, hx + 6, hx + 12, arm_y(hx + 8) - 1,
                  K['spec'] if r() < 0.5 else K['ramp'][3])
            hang(hx, sag)
            face = spec.get('face', 's')
            if face == 'n':
                draw_head_back(a, K, hx, arm_lvl + 13 + sag, spec['state'], r)
            else:
                draw_head(a, K, hx, arm_lvl + 13 + sag, spec['state'], r,
                          facing={'e': 1, 'w': -1}.get(face, 0))
        if n <= 2 and head_xs[-1] - 20 > POLE_CX + 30:
            sw2 = min(48, head_xs[-1] - 24 - POLE_CX - 26)
            if spec.get('face', 's') == 'n':
                draw_sign_back(a, K, POLE_CX + 26, arm_lvl + 14, sw2, r)
            else:
                draw_sign_plate(a, K, POLE_CX + 26, arm_lvl + 14, sw2, r)
    elif kind == 'headless':
        for hx in head_xs:
            rect(a, hx + 6, arm_y(hx + 8) - 1, hx + 12, arm_y(hx + 8) + 5, K['ramp'][1])
            hang(hx)
        # a cable still dangles where a head used to hang
        cx0 = head_xs[0] + 8
        for k in range(14):
            put(a, cx0 + int(1.5 * math.sin(k * 0.8)), arm_lvl + 13 + k, (22, 20, 16))
        put(a, cx0, arm_lvl + 27, K['rust'][1])
    elif kind == 'dropped_heads':
        # v17 (Paolo): the arm stays attached, the lights themselves are
        # on the floor — each head dropped from its clamp lies dead on the
        # road below, one tipped on its side, glass around them
        for hx in head_xs:
            rect(a, hx + 6, arm_y(hx + 8) - 1, hx + 12, arm_y(hx + 8) + 5, K['ramp'][1])
            hang(hx)
        for gi, hx in enumerate(head_xs):
            gy0 = ground_y - 58
            if gi % 2 == 0:
                draw_head(a, K, hx, gy0, 'dead', r)
            else:
                temp = np.zeros((70, 40, 4), dtype=np.uint8)
                draw_head(temp, K, 8, 6, 'dead', r)
                piece = np.rot90(temp, 3).copy()
                composite(a, piece, hx - 8, ground_y - 42)
            for _ in range(8):
                put(a, hx - 4 + int(r() * 40), ground_y - 3 - int(r() * 5),
                    (70, 18, 16) if r() < 0.5 else (66, 44, 12))
    elif kind == 'fallen_arm':
        # the broken span lies beside the base, one dead head still bolted on
        plen = int(spec['arm_cells'] * T * 0.6)
        gx0 = POLE_CX + 34

        def gy(xx):
            return ground_y - 9 + (xx - gx0) // 40

        paint_cyl_h(a, K, r, gx0, gx0 + plen, gy, lambda xx: 7)
        for _ in range(8):                             # jagged shear both ends
            for ex in (gx0 + int(r() * 4), gx0 + plen - 1 - int(r() * 4)):
                ey = gy(ex) + int(r() * 7)
                if 0 <= ey < CH:
                    a[ey, ex] = 0
        # dead heads still bolted along the fallen span at the lane spots
        for gi in range(min(2, spec['heads'])):
            px_ = gx0 + plen - 52 - gi * int(3 * T * 0.6)
            temp = np.zeros((70, 40, 4), dtype=np.uint8)
            draw_head(temp, K, 8, 6, 'dead', r)
            piece = np.rot90(temp, 1 if gi % 2 == 0 else 3).copy()  # on its side
            composite(a, piece, px_, ground_y - 40)
            for _ in range(10):                        # shattered lens glass
                put(a, px_ + 6 + int(r() * 48), ground_y - 2 - int(r() * 5),
                    (70, 18, 16) if r() < 0.5 else (66, 44, 12))

    drips(a, K, r, POLE_CX - 5, POLE_CX + 5, junction_y + 8, n=2)
    # THE BORDER (Paolo 7/18: "one more pixel... looking a little thin"):
    # the sampled dark rim, then 1px TRUE BLACK around everything
    outline_pass(a, K['outline'])
    outline_pass(a, (5, 5, 5))
    return a


def verify(a, state):
    rgb = a[..., :3].astype(int)
    op = a[..., 3] > 0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    purple = (op & (b > 100) & (r > 80) & (g < 70) & (b - g > 50) & (r - g > 30)).sum()
    if purple:
        return 'PURPLE (%d px)' % purple
    bright = (op & (r + g + b > 560)).sum()
    if state == 'dead' and bright > 40:
        return 'dead state carries glow-bright pixels (%d)' % bright
    if op.sum() < 1500:
        return 'sprite too sparse (%d px)' % op.sum()
    return None


def main():
    out = {'version': 'BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_v4', 'date': '2026-07-18',
           'status': 'UNJUDGED (first commissioned original; Paolo judges on the intersection proof)',
           'commission': ('Paolo 7/17-18: Vegas mast-arm signals; arm reach tracks street '
                          'width; collapse/decay variants; researched colors; east+west; '
                          'thicker black border.'),
           'perspective': ('45deg three-quarter (THE 45 LAW, Paolo 7/17: all original '
                           'art is seen from the world\'s 45, never flat side-on; '
                           'ellipse tops, sky-lit top faces, bowed bands)'),
           'color_law': ('researched 7/18: real mast arms are hot-dip galvanized steel '
                         '(25-50yr zinc coat) -> decades on, the majority weather to dull '
                         'zinc GRAY with rust at welds/joints/bases; only coating-stripped '
                         'masts brown out to the lamp family. galv = majority, bronze = '
                         'the old stripped ones.'),
           'arm_law': {'lanes_to_arm': ARM_LAW,
                       'cells': {nm: c for nm, c, _ in ARMS}},
           'laws': ('palette sampled from the blessed lamp bank; DEAD is act-1 default '
                    '(grid-power ruling pending Paolo); lit r/a/g are the powered pairs; '
                    'sign plates ILLEGIBLE (names are canon); no purple; deterministic; '
                    'double outline (sampled rim + true black).'),
           'sprite_h': CH,
           'anchor': 'pole base bottom; pcx per entry is the pole centerline; '
           'dir e = arm extends east (right), dir w = arm extends west (left)',
           'face_law': ('v9-v12 (Paolo 7/18, final ruling: "if its facing west or '
                        'east it wont be having the stop lights extending east or '
                        'west, it will be UP OR DOWN"): face s = horizontal arm, '
                        'lenses at the camera; face n = horizontal arm, the BACKS '
                        '(ribbed panel, no lenses, lit = spill only); face e / face '
                        'w = the arm runs VERTICALLY on screen (it spans the EW '
                        'road): arm_dir n = arm extends north (up-screen), arm_dir '
                        's = south (down-screen), full map length per the ARM LAW, '
                        'full-mass heads hanging along the vertical arm with lenses '
                        'biased toward the facing edge. base_y per entry anchors the '
                        'pole foot for the bake (vertical-south sprites extend BELOW '
                        'the base). Mirroring flips e<->w and the bank stores the '
                        'TRUE face after the flip. Wrecks ship face s only.'),
           'signals': []}
    n = 0
    STATE_SEED = {'dead': 0, 'red': 1, 'amber': 2, 'green': 3}
    jobs = []
    for ci, color in enumerate(('galv', 'bronze')):
        for ai, (arm, cells, heads) in enumerate(ARMS):
            for fi, face in enumerate(('s', 'n')):
                for state in ('dead', 'red', 'amber', 'green'):
                    jobs.append(('h', color, {'arm_cells': cells, 'heads': heads,
                                              'kind': 'intact', 'state': state,
                                              'face': face},
                                 arm,
                                 81000 + ci * 7919 + ai * 761 + fi * 373 +
                                 STATE_SEED[state] * 131))
            # v12-v13: east/west-facing masts arm UP or DOWN the screen (the
            # arm spans the EW road); head facing is drawn BOTH ways because
            # arm chirality and lens facing are independent axes
            for di, arm_dir in enumerate(('n', 's')):
                for hi, hf in enumerate((1, -1)):
                    for state in ('dead', 'red', 'amber', 'green'):
                        jobs.append(('v', color, {'arm_cells': cells, 'heads': heads,
                                                  'kind': 'intact', 'state': state,
                                                  'face': 'e' if hf > 0 else 'w',
                                                  'arm_dir': arm_dir,
                                                  'head_facing': hf},
                                     arm,
                                     91000 + ci * 7919 + ai * 761 + di * 449 +
                                     hi * 239 + STATE_SEED[state] * 131))
        for wi, (kind, cells) in enumerate(WRECKS):
            jobs.append(('h', color, {'arm_cells': cells,
                                      'heads': 2 if kind == 'jury_rigged' else 3,
                                      'kind': kind, 'state': 'dead', 'face': 's'},
                         [nm for nm, c, _ in ARMS if c == cells][0],
                         88000 + ci * 7919 + wi * 977))
        # v16-17: the VERTICAL masts break too — the span at the base on
        # the floor, or the arm holding while the heads lie dropped
        for di, arm_dir in enumerate(('n', 's')):
            for ki, vkind in enumerate(('fallen_arm', 'dropped_heads')):
                jobs.append(('v', color, {'arm_cells': 9.0, 'heads': 3,
                                          'kind': vkind, 'state': 'dead',
                                          'face': 'e', 'arm_dir': arm_dir,
                                          'head_facing': 1},
                             'long', 96500 + ci * 7919 + di * 449 + ki * 173))
    for shape, color, spec, arm, seed in jobs:
        K = palette(color)
        if shape == 'v':
            a, base_y = draw_signal_vert(K, spec, seed)
        else:
            a = draw_signal(K, spec, seed)
            base_y = a.shape[0]
        err = verify(a, spec['state'])
        if err:
            print('FACTORY REFUSES [%s %s %s %s %s]: %s'
                  % (color, arm, spec['kind'], spec['face'], spec['state'], err))
            return 1
        drawn_pcx = 20 if shape == 'v' else POLE_CX
        for direction in ('e', 'w'):
            arr = a if direction == 'e' else np.ascontiguousarray(a[:, ::-1])
            pcx = drawn_pcx if direction == 'e' else arr.shape[1] - 1 - drawn_pcx
            # mirroring flips which way a head FACES: store the truth
            face_out = spec['face']
            if direction == 'w' and face_out in ('e', 'w'):
                face_out = 'w' if face_out == 'e' else 'e'
            buf = io.BytesIO()
            Image.fromarray(arr).save(buf, 'PNG')
            entry = {'color': color, 'arm': arm, 'kind': spec['kind'],
                     'state': spec['state'], 'dir': direction, 'face': face_out,
                     'w': int(arr.shape[1]), 'h': int(arr.shape[0]),
                     'pcx': int(pcx), 'base_y': int(base_y),
                     'b64': base64.b64encode(buf.getvalue()).decode()}
            if shape == 'v':
                entry['arm_dir'] = spec['arm_dir']
            out['signals'].append(entry)
            n += 1
    json.dump(out, open(OUT, 'w'))
    kinds = {}
    for s in out['signals']:
        kinds[s['kind']] = kinds.get(s['kind'], 0) + 1
    print('drew %d signal sprites -> %s' % (n, OUT))
    print('  ' + ', '.join('%s: %d' % kv for kv in sorted(kinds.items())))
    return 0


if __name__ == '__main__':
    sys.exit(main())
