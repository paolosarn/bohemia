#!/usr/bin/env python3
"""BOHEMIA TRAFFIC SIGNAL FACTORY (7/17/26) — the first commissioned original.

Paolo, verbatim intent: "a large hanging street light... the red yellow and
the green ones. It's tall and hangs above... real street lights for the cars,
overhanging, very tall, with street signs and stuff." Vegas mast-arm signals.

v4 (7/17 night, Paolo at zoom: "looks like dog shit in comparison. Please
keep cooking"). He put my pole next to his lamp and the gap was the whole
craft: the lamp is a PAINTED CYLINDER — dark silhouette outline, volume
shading with a highlight band, coherent rust blotches, stacked hardware.
v3 was a flat dark strip with salt-and-pepper flecks. v4 paints like the
corpus:
  - TONE RAMP sampled from the blessed lamp (5 luminance tones + warm rust
    cluster), not three flat colors
  - CYLINDRICAL SHADING: edge-dark -> mid -> highlight band -> mid -> dark,
    dithered boundaries, vertical wobble (hand-painted read)
  - 1px SILHOUETTE OUTLINE around everything (the corpus look)
  - RUST AS BLOTCHES + drip streaks below joints, never per-pixel confetti
  - HARDWARE: stacked base discs with bolts, bulged collar rings, cap,
    rivet seam, gusset strut

THE DRAWING CONTRACT (unchanged):
  - PALETTE IS SAMPLED, NOT INVENTED (the blessed lamp bank is the source)
  - DEAD IS THE DEFAULT STATE (act-1 dark; the grid-power ruling is Paolo's)
  - THE STREET-NAME PLATE IS ILLEGIBLE: names are canon
  - NO PURPLE ANYWHERE; self-gate sweeps
  - Deterministic, seeded, no dice the fold can't replay

OUTPUT: banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt (UNJUDGED),
3 mast variants x 4 states (dead/red/amber/green) = 12 sprites.

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
CW, CH = 200, 232   # canvas: arm spans ~3.6 cells, pole ~5 tiles tall
POLE_CX = 16        # pole centerline (bank metadata; the bake reads it)


def rng(seed):
    s = seed & 0xffffffff
    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def tone_ramp():
    """Sample the blessed lamp into a paint kit: outline tone, a 5-step
    luminance ramp for cylinder shading, and the warm rust cluster."""
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
    # v6: the lamp's tonal RANGE is the point — its brass glints run far
    # brighter than my old p90 cap. 'spec' is the true specular cluster.
    return {'outline': smooth(2), 'ramp': [smooth(15), smooth(35), smooth(55),
            smooth(75), smooth(90)], 'rust': rust, 'spec': smooth(97, win=60)}


def put(a, x, y, c, alpha=255):
    if 0 <= x < CW and 0 <= y < CH:
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
    """Tone index 0..4 across a cylinder: dark edges, a NARROW bright band
    at ~0.33 (v6: the lamp's bands are smooth and decisive; wide dither made
    v5 muddy). Small dither only at the boundaries."""
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
    """THE 45 DEGREE LAW (Paolo 7/17): horizontal edges wrap the cylinder
    toward the viewer. 0 at the edges, `depth` px at the center."""
    return int(round(depth * (1.0 - (2.0 * u - 1.0) ** 2)))


def ellipse_disc(a, K, r, cx, cy, rx, ry, wall_h, tone_shift=0):
    """A disc seen from the world's 45: a lit elliptical top face plus a
    cylinder-wall skirt hanging from its front edge. This is what separates
    the corpus from a 2D scroller: you can SEE the tops of things."""
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
            # brass catch-light on the upper-left rim (the lamp's read)
            if yy == -edge and xx < 0 and r() < 0.45:
                c = K['spec']
            put(a, cx + xx, cy + yy, shade_of(c, 0.94 + 0.12 * r()))
        for k in range(1, wall_h + 1):
            ti = max(0, cyl_index(u, r) - 1)
            put(a, cx + xx, cy + edge + k, shade_of(ramp[ti], 0.92 + 0.12 * r()))


def bowed_band(a, K, r, cx, y, w, h=3, depth=2, tone_shift=1):
    """A ring wrapping the pole, seen from 45: edges ride high, the center
    bows down toward the viewer, the top lip catches the sky."""
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
    """Coherent rust: seeded elliptical blotches, not per-pixel confetti.
    v6: pass `centers` to put the rust where water actually sits (below
    collars, on the base skirt, at the arm junction)."""
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
    """Vertical cylinder: pole sections, collars, base discs. v6: calm
    grain, and the highlight band carries true specular glints — the lamp's
    brass catch-light, not a slightly-lighter brown."""
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
            c = shade_of(c, 0.95 + 0.10 * r())      # calm grain, not fuzz
            if rust is not None:
                rw = rust.w(x0 + i, yy)
                if rw > 0.18 and r() < rw:
                    c = mix(c, K['rust'][int(r() * 3) % 3], 0.55 + 0.3 * rw)
            put(a, x0 + i, yy, c)


def paint_cyl_h(a, K, r, x0, x1, y_of, h_of, rust=None):
    """Horizontal cylinder: the mast arm. THE 45 LAW: the sky lights the
    TOP of the cylinder, so the highlight rides the upper surface and the
    tones fall away underneath."""
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
    """Rust drip streaks running down from a joint line."""
    for _ in range(n):
        x = x0 + int(r() * max(1, x1 - x0))
        ln = 3 + int(r() * 9)
        for k in range(ln):
            if r() < 0.75 and a[min(CH - 1, y + k), min(CW - 1, x), 3] > 0:
                base = a[y + k, x, :3].astype(int)
                a[y + k, x, :3] = np.array(mix(tuple(base.tolist()),
                                               K['rust'][int(r() * 3) % 3], 0.5))


def draw_head(a, K, hx, hy, state, r, big=True):
    """A 3-lens signal head: outlined housing, protruding visors, lenses.
    state: dead | red | amber | green"""
    hw, lens = (20, 12) if big else (14, 9)
    hh = lens * 3 + 14
    side = 3 if big else 2                    # visible right side face (the 45 view)
    back = (38, 36, 20)                       # weathered backplate, desert-yellowed
    HRAMP = [(12, 12, 14), (24, 24, 26), (40, 40, 44), (64, 66, 74)]
    # backplate with a ridge highlight on its left edge + 45-view side face
    rect(a, hx - 3, hy - 2, hx + hw + 3, hy + hh + 2, back)
    vline(a, hx - 3, hy - 2, hy + hh + 2, shade_of(back, 1.45))
    for k in range(side):                     # right side face, shadowed depth
        vline(a, hx + hw + 3 + k, hy - 1 + k, hy + hh + 2, shade_of(back, 0.5))
    # top + bottom edges BOW toward the viewer (the box seen from 45 above)
    for xx in range(hx - 3, hx + hw + 3 + side):
        u = (xx - hx + 3 + 0.5) / (hw + 6.0 + side)
        dy = bow(u, 1)
        put(a, xx, hy - 2 + dy, shade_of(back, 1.5))     # sky-lit top face
        put(a, xx, hy - 1 + dy, shade_of(back, 1.2))
        put(a, xx, hy + hh + 1 + dy, shade_of(back, 0.55))
    # housing: horizontal gradient (light catches the left) + lit top face
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
    # corner bolts
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
        cx = hx + hw // 2
        rad = lens // 2
        # visor hood: wraps the lens, BOWED toward the viewer (45 view),
        # sky-lit top over a shadowed underside
        for xx in range(cx - rad - 3, cx + rad + 4):
            u = (xx - (cx - rad - 3) + 0.5) / (2.0 * rad + 7)
            dy = bow(u, 1)
            put(a, xx, cy - 3 + dy, (88, 92, 102) if r() < 0.3 else HRAMP[3])
            put(a, xx, cy - 2 + dy, HRAMP[0])
        # lens: radial shading; dead glass keeps a cold glint top-left
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
            put(a, cx - rad // 2, cy + rad // 2 - rad // 2, (104, 106, 116))
        if on:  # glow: rgb-only brightening ring, no structure change
            for yy in range(-rad - 2, rad + 3):
                for xx in range(-rad - 2, rad + 3):
                    d2 = xx * xx + yy * yy
                    if rad * rad < d2 <= (rad + 2) * (rad + 2):
                        gx, gy = cx + xx, cy + rad // 2 + yy + 1
                        if 0 <= gx < CW and 0 <= gy < CH and a[gy, gx, 3] > 0:
                            base = a[gy, gx, :3].astype(int)
                            mixed = (base * 0.45 + np.array(lit) * 0.55).astype(int)
                            a[gy, gx, :3] = np.clip(mixed, 0, 255)
    return hh


def draw_sign_plate(a, K, x0, y, w, r):
    """Illegible street-name plate: green municipal steel, hung a pixel
    askew, weathered marks where text would be. NEVER letters."""
    plate = (24, 62, 44)
    half = x0 + w // 2
    for xx in range(x0, x0 + w):
        dy = 1 if xx >= half else 0          # askew: the far half sags
        for yy in range(y + dy, y + 15 + dy):
            v = (yy - y - dy) / 15.0
            f = 1.25 if v < 0.2 else (1.0 if v < 0.7 else 0.72)
            put(a, xx, yy, shade_of(plate, f * (0.92 + 0.16 * r())))
    # 45 view: lit top edge, shadowed right end cap
    for xx in range(x0, x0 + w):
        put(a, xx, y - 1 + (1 if xx >= half else 0), shade_of(plate, 1.55))
    vline(a, x0 + w - 1, y + 2, y + 16, shade_of(plate, 0.5))
    # mounting tabs
    put(a, x0 + 3, y - 2, K['ramp'][1]); put(a, x0 + w - 4, y - 1, K['ramp'][1])
    # unreadable wear-marks where text would be
    for k in range(w // 5):
        if r() < 0.7:
            mx = x0 + 3 + int(r() * (w - 6))
            ml = 1 + int(r() * 3)
            hline(a, mx, mx + ml, y + 4 + int(r() * 4) + (1 if mx >= half else 0),
                  (168, 172, 160))


def outline_pass(a, col):
    """1px silhouette outline, the corpus look: every opaque region gets a
    dark rim drawn into the transparent pixels that touch it."""
    op = a[..., 3] > 0
    nb = np.zeros_like(op)
    nb[1:, :] |= op[:-1, :]; nb[:-1, :] |= op[1:, :]
    nb[:, 1:] |= op[:, :-1]; nb[:, :-1] |= op[:, 1:]
    edge = nb & ~op
    a[edge, 0] = col[0]; a[edge, 1] = col[1]; a[edge, 2] = col[2]; a[edge, 3] = 255


def draw_signal(K, variant, state, seed):
    r = rng(seed)
    a = np.zeros((CH, CW, 4), dtype=np.uint8)
    ground_y = CH - 2
    top_y = 12
    # THE 45 DEGREE LAW (Paolo 7/17, verbatim: "every art... has to be viewed
    # from like a 45 degree angle... yours is like a flat 90, like it's a 2D
    # scroller"). Horizontal cross-sections are ELLIPSES, tops are visible
    # and sky-lit, bands bow toward the viewer. The blessed lamp is the
    # reference. The art_45 gate machine-checks the base ellipse + top-light.
    cy3 = ground_y - 7                 # base disc centers, stacked ellipses
    cy2 = cy3 - 7
    cy1 = cy2 - 5
    pole_top = top_y + 4
    pole_bot = cy1 - 2
    # v6: rust lives where water sits — below each collar, on the base skirt
    collar_ys = [pole_top + int((pole_bot - pole_top) * f) for f in (0.22, 0.52, 0.78)]
    rust = RustField(r, POLE_CX - 8, POLE_CX + 8, pole_top, pole_bot, k=3,
                     centers=[(POLE_CX - 4, cyy + 5) for cyy in collar_ys] +
                             [(POLE_CX + 4, collar_ys[1] + 5), (POLE_CX, cy1 - 8)])

    def pole_w(yy):
        t = (yy - pole_top) / float(pole_bot - pole_top)
        return 10 + int(5 * t)

    # the mast: painted cylinder, dark iron with a highlight band
    paint_cyl_v(a, K, r, POLE_CX, pole_top, pole_bot + 3, pole_w, rust=rust)
    # stacked base: three ellipse discs, tops visible, walls in shadow
    ellipse_disc(a, K, r, POLE_CX, cy1, 8, 2, 2, tone_shift=1)
    ellipse_disc(a, K, r, POLE_CX, cy2, 11, 3, 3)
    ellipse_disc(a, K, r, POLE_CX, cy3, 13, 4, 3)
    # anchor bolts sitting ON the base's top face
    put(a, POLE_CX - 9, cy3 - 1, K['ramp'][4]); put(a, POLE_CX - 9, cy3, K['outline'])
    put(a, POLE_CX + 9, cy3 - 1, K['ramp'][4]); put(a, POLE_CX + 9, cy3, K['outline'])
    # cap: a lidded ellipse + knob, tops visible from the 45
    ellipse_disc(a, K, r, POLE_CX, pole_top - 1, 7, 2, 2, tone_shift=1)
    ellipse_disc(a, K, r, POLE_CX, pole_top - 4, 3, 1, 1, tone_shift=1)
    # collar rings: bowed toward the viewer, drips below
    for by in collar_ys:
        w = pole_w(by) + 4
        bowed_band(a, K, r, POLE_CX, by, w, h=3, depth=2)
        drips(a, K, r, POLE_CX - w // 2, POLE_CX + w // 2, by + 6, n=2)
    # rivet seam down the centerline
    for yy in range(pole_top + 8, pole_bot - 4, 11):
        put(a, POLE_CX + 1, yy, K['outline'])
        put(a, POLE_CX + 1, yy + 1, K['ramp'][4])

    # arm: a real mast-arm CURVE (v6: the straight pipe with a kink read
    # stiff, nothing in the corpus is straight plumbing): rises off a LOW
    # junction in a smooth quadratic and levels out over the road, so the
    # capped pole shows above the arm the way a real Vegas mast does
    junction_y = top_y + 30
    rise = 18
    arm_x1 = CW - 8
    arm_lvl = junction_y - rise            # the level cruising height

    def arm_y(xx):
        s = (xx - POLE_CX) / float(arm_x1 - POLE_CX)
        e = min(1.0, s / 0.40)
        return int(round(junction_y - rise * (1 - (1 - e) ** 2)))

    def arm_h(xx):
        s = (xx - POLE_CX) / float(arm_x1 - POLE_CX)
        return 9 - int(round(3 * s))

    arust = RustField(r, POLE_CX, arm_x1, arm_lvl - 4, junction_y + 6, k=4,
                      centers=[(POLE_CX + 14, junction_y - 10)])
    paint_cyl_h(a, K, r, POLE_CX, arm_x1, arm_y, arm_h, rust=arust)
    # arm-to-pole joint collar (bowed) + gusset strut tucked under the curve
    bowed_band(a, K, r, POLE_CX, junction_y - 2, pole_w(junction_y) + 6, h=5, depth=2)
    for k in range(20):
        sx = POLE_CX + 6 + k
        sy = junction_y + 14 - k
        if sy <= arm_y(sx) + arm_h(sx) - 1:
            break
        put(a, sx, sy, K['ramp'][1])
        put(a, sx + 1, sy, K['ramp'][2])
        put(a, sx + 2, sy, K['ramp'][0])
    # mounting clamps on the level span where heads hang
    for cxx in (CW - 36, CW - 88, CW - 128):
        rect(a, cxx + 6, arm_lvl - 1, cxx + 12, arm_lvl + 5, K['ramp'][1])
        hline(a, cxx + 6, cxx + 12, arm_lvl - 1, K['spec'] if r() < 0.5 else K['ramp'][3])

    # heads + sign per variant (hanger brackets first, heads over them)
    def hang(hx):
        vline(a, hx + 8, arm_lvl + 6, arm_lvl + 13, K['ramp'][1], 2)
        vline(a, hx + 8, arm_lvl + 6, arm_lvl + 13, K['ramp'][3], 1)

    if variant == 0:      # two heads + sign plate mid-arm
        for hx in (CW - 44, CW - 96):
            hang(hx)
            draw_head(a, K, hx, arm_lvl + 13, state, r)
        draw_sign_plate(a, K, POLE_CX + 32, arm_lvl + 14, 56, r)
    elif variant == 1:    # three heads across the span (the big arterial mast)
        for hx in (CW - 40, CW - 86, CW - 132):
            hang(hx)
            draw_head(a, K, hx, arm_lvl + 13, state, r)
    else:                 # two heads + pole-mounted near-side head + sign
        for hx in (CW - 44, CW - 100):
            hang(hx)
            draw_head(a, K, hx, arm_lvl + 13, state, r)
        draw_head(a, K, POLE_CX + 14, junction_y + 34, state, r, big=False)
        draw_sign_plate(a, K, POLE_CX + 32, arm_lvl + 14, 36, r)

    drips(a, K, r, POLE_CX - 5, POLE_CX + 5, junction_y + 8, n=2)
    outline_pass(a, K['outline'])
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
    K = tone_ramp()
    out = {'version': 'BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_v3', 'date': '2026-07-17',
           'perspective': ('45deg three-quarter (THE 45 LAW, Paolo 7/17: all original '
                           'art is seen from the world\'s 45, never flat side-on like a '
                           '2D scroller; ellipse tops, sky-lit top faces, bowed bands)'),
           'status': 'UNJUDGED (first commissioned original; Paolo judges on the intersection proof)',
           'commission': ('Paolo 7/17 verbatim intent: large hanging street light, red yellow '
                          'green, very tall, hangs above, street signs and stuff. Vegas mast-arm.'),
           'laws': ('palette sampled from the blessed lamp poles (v4: full tone ramp + '
                    'silhouette outline + cylinder shading, per Paolo\'s zoom verdict); '
                    'DEAD is act-1 default (grid-power ruling pending Paolo); lit r/a/g are '
                    'the powered pairs; sign plates ILLEGIBLE (names are canon); no purple; '
                    'deterministic.'),
           'sprite_px': [CW, CH], 'pole_center_px': POLE_CX,
           'anchor': 'pole base bottom-left; arm extends right; '
           'mirror at bake for opposite approaches',
           'signals': []}
    n = 0
    STATE_SEED = {'dead': 0, 'red': 1, 'amber': 2, 'green': 3}
    # NOT hash(state): str hash is salted per process, which silently broke
    # the determinism law in v1-v3. Fixed mapping, replayable forever.
    for variant in range(3):
        for state in ('dead', 'red', 'amber', 'green'):
            a = draw_signal(K, variant, state, 55000 + variant * 419 + STATE_SEED[state] * 131)
            err = verify(a, state)
            if err:
                print('FACTORY REFUSES [v%d %s]: %s' % (variant, state, err))
                return 1
            buf = io.BytesIO()
            Image.fromarray(a).save(buf, 'PNG')
            out['signals'].append({'variant': variant, 'state': state,
                                   'b64': base64.b64encode(buf.getvalue()).decode()})
            n += 1
    json.dump(out, open(OUT, 'w'))
    print('drew %d signal sprites (3 masts x dead/red/amber/green) -> %s' % (n, OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
