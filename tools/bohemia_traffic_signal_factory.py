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
    return {'outline': smooth(2), 'ramp': [smooth(15), smooth(35), smooth(55),
            smooth(75), smooth(90)], 'rust': rust}


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
    """Tone index 0..4 across a cylinder: dark edges, highlight band at ~0.35.
    Dithered boundaries so bands read painted, not vector."""
    u = u + (r() - 0.5) * 0.09
    if u < 0.07 or u >= 0.93:
        return 0
    if u < 0.16 or u >= 0.80:
        return 1
    if u < 0.24 or u >= 0.62:
        return 2
    if 0.28 <= u < 0.46:
        return 4
    return 3


class RustField(object):
    """Coherent rust: seeded elliptical blotches, not per-pixel confetti."""
    def __init__(self, r, x0, x1, y0, y1, k=6):
        self.blobs = []
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
    """Vertical cylinder: pole sections, collars, base discs."""
    ramp = K['ramp']
    for yy in range(y0, y1):
        w = w_of(yy)
        x0 = int(round(cx - w / 2.0))
        wob = 0.05 * math.sin(yy * 0.11)
        for i in range(w):
            u = (i + 0.5) / w + wob
            ti = min(4, max(0, cyl_index(u, r) + tone_shift))
            c = ramp[ti]
            c = shade_of(c, 0.93 + 0.14 * r())      # gentle grain, not noise
            if rust is not None:
                rw = rust.w(x0 + i, yy)
                if rw > 0.18 and r() < rw:
                    c = mix(c, K['rust'][int(r() * 3) % 3], 0.55 + 0.3 * rw)
            put(a, x0 + i, yy, c)


def paint_cyl_h(a, K, r, x0, x1, y_of, h_of, rust=None):
    """Horizontal cylinder: the mast arm. Highlight rides the top."""
    ramp = K['ramp']
    for xx in range(x0, x1):
        h = h_of(xx)
        yt = y_of(xx)
        for i in range(h):
            u = (i + 0.5) / h
            ti = cyl_index(u, r)
            c = shade_of(ramp[ti], 0.93 + 0.14 * r())
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
    back = (38, 36, 20)                       # weathered backplate, desert-yellowed
    HRAMP = [(14, 14, 16), (24, 24, 26), (38, 38, 42), (54, 54, 60)]
    # backplate with a ridge highlight on its left edge
    rect(a, hx - 3, hy - 2, hx + hw + 3, hy + hh + 2, back)
    vline(a, hx - 3, hy - 2, hy + hh + 2, shade_of(back, 1.45))
    hline(a, hx - 3, hx + hw + 3, hy - 2, shade_of(back, 1.3))
    hline(a, hx - 3, hx + hw + 3, hy + hh + 1, shade_of(back, 0.6))
    # housing: horizontal gradient (light catches the left)
    for yy in range(hy, hy + hh):
        for xx in range(hx, hx + hw):
            u = (xx - hx + 0.5) / hw
            ti = 3 if u < 0.18 else (2 if u < 0.5 else (1 if u < 0.85 else 0))
            if r() < 0.10:
                ti = max(0, ti - 1)
            put(a, xx, yy, HRAMP[ti])
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
        # visor hood: protrudes past the housing, dark top with a lit lip
        hline(a, cx - rad - 2, cx + rad + 3, cy - 2, HRAMP[0])
        hline(a, cx - rad - 2, cx + rad + 3, cy - 1, HRAMP[3])
        put(a, cx - rad - 3, cy - 1, HRAMP[1]); put(a, cx + rad + 3, cy - 1, HRAMP[1])
        put(a, cx - rad - 3, cy, HRAMP[0]); put(a, cx + rad + 3, cy, HRAMP[0])
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
    # mounting tabs
    put(a, x0 + 3, y - 1, K['ramp'][1]); put(a, x0 + w - 4, y, K['ramp'][1])
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
    pole_top = top_y + 4
    pole_bot = ground_y - 10
    rust = RustField(r, POLE_CX - 8, POLE_CX + 8, pole_top, pole_bot, k=6)

    def pole_w(yy):
        t = (yy - pole_top) / float(pole_bot - pole_top)
        return 10 + int(5 * t)

    # the mast: painted cylinder, dark iron with a highlight band
    paint_cyl_v(a, K, r, POLE_CX, pole_top, pole_bot, pole_w, rust=rust)
    # cap: a squat disc + tip
    paint_cyl_v(a, K, r, POLE_CX, top_y, pole_top, lambda yy: 12, tone_shift=1)
    hline(a, POLE_CX - 3, POLE_CX + 4, top_y - 1, K['ramp'][3])
    # collar rings: bulged, brighter, with drips below
    plen = pole_bot - pole_top
    for frac in (0.22, 0.52, 0.78):
        by = pole_top + int(plen * frac)
        w = pole_w(by) + 4
        paint_cyl_v(a, K, r, POLE_CX, by, by + 4, lambda yy: w, tone_shift=1)
        hline(a, POLE_CX - w // 2, POLE_CX + w // 2 + 1, by + 4, K['outline'])
        drips(a, K, r, POLE_CX - w // 2, POLE_CX + w // 2, by + 5, n=2)
    # rivet seam down the centerline
    for yy in range(pole_top + 6, pole_bot - 4, 11):
        put(a, POLE_CX + 1, yy, K['outline'])
        put(a, POLE_CX + 1, yy + 1, K['ramp'][4])
    # stacked base discs with anchor bolts
    for k, (dw, dh) in enumerate(((19, 3), (23, 3), (27, 4))):
        y0 = pole_bot + sum(h for _, h in ((19, 3), (23, 3), (27, 4))[:k])
        paint_cyl_v(a, K, r, POLE_CX, y0, y0 + dh, lambda yy: dw, tone_shift=1 if k == 0 else 0)
    put(a, POLE_CX - 11, ground_y - 2, K['ramp'][4])
    put(a, POLE_CX + 11, ground_y - 2, K['ramp'][4])

    # the arm: horizontal cylinder rising off the mast, tapering out
    arm_y0 = top_y + 10
    arm_x1 = CW - 8
    arust = RustField(r, POLE_CX, arm_x1, arm_y0 - 8, arm_y0 + 8, k=5)

    def arm_y(xx):
        t = (xx - POLE_CX) / float(arm_x1 - POLE_CX)
        return arm_y0 - int(6 * min(1.0, t * 2.2) * (1 - t * 0.15))

    def arm_h(xx):
        t = (xx - POLE_CX) / float(arm_x1 - POLE_CX)
        return 8 - int(3 * t)

    paint_cyl_h(a, K, r, POLE_CX, arm_x1, arm_y, arm_h, rust=arust)
    arm_tip_y = arm_y0 - 6
    # arm-to-pole joint collar + gusset strut underneath
    paint_cyl_v(a, K, r, POLE_CX, arm_y0 - 2, arm_y0 + 6, lambda yy: pole_w(yy) + 4, tone_shift=1)
    for k in range(16):
        put(a, POLE_CX + 6 + k, arm_y0 + 16 - k, K['ramp'][1])
        put(a, POLE_CX + 7 + k, arm_y0 + 16 - k, K['ramp'][2])
        put(a, POLE_CX + 8 + k, arm_y0 + 16 - k, K['ramp'][0])
    # mounting clamps on the arm where heads hang
    for cxx in (CW - 36, CW - 88, CW - 128):
        rect(a, cxx + 6, arm_tip_y - 1, cxx + 12, arm_tip_y + 5, K['ramp'][1])
        hline(a, cxx + 6, cxx + 12, arm_tip_y - 1, K['ramp'][3])

    # heads + sign per variant (hanger brackets first, heads over them)
    def hang(hx):
        vline(a, hx + 8, arm_tip_y + 4, arm_tip_y + 10, K['ramp'][1], 2)
        vline(a, hx + 8, arm_tip_y + 4, arm_tip_y + 10, K['ramp'][3], 1)

    if variant == 0:      # two heads + sign plate mid-arm
        for hx in (CW - 44, CW - 96):
            hang(hx)
            draw_head(a, K, hx, arm_tip_y + 10, state, r)
        draw_sign_plate(a, K, POLE_CX + 32, arm_tip_y + 9, 56, r)
    elif variant == 1:    # three heads across the span (the big arterial mast)
        for hx in (CW - 40, CW - 86, CW - 132):
            hang(hx)
            draw_head(a, K, hx, arm_tip_y + 10, state, r)
    else:                 # two heads + pole-mounted near-side head + sign
        for hx in (CW - 44, CW - 100):
            hang(hx)
            draw_head(a, K, hx, arm_tip_y + 10, state, r)
        draw_head(a, K, POLE_CX + 14, arm_y0 + 46, state, r, big=False)
        draw_sign_plate(a, K, POLE_CX + 32, arm_tip_y + 8, 36, r)

    drips(a, K, r, POLE_CX - 5, POLE_CX + 5, arm_y0 + 6, n=2)
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
    out = {'version': 'BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_v2', 'date': '2026-07-17',
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
