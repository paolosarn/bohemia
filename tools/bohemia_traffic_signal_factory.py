#!/usr/bin/env python3
"""BOHEMIA TRAFFIC SIGNAL FACTORY (7/17/26) — the first commissioned original.

Paolo, verbatim intent: "a large hanging street light... the red yellow and
the green ones. It's tall and hangs above... real street lights for the cars,
overhanging, very tall, with street signs and stuff." Vegas mast-arm signals.

THE DRAWING CONTRACT (first original art; the rules that keep it lawful):
  - PALETTE IS SAMPLED, NOT INVENTED: pole/arm metals come from the blessed
    lamp bank's own pole pixels (the world's rust); housings run the corpus's
    weathered near-blacks; lens glass is dark until the grid says otherwise.
  - DEAD IS THE DEFAULT STATE (act-1 dark; the grid-power ruling is Paolo's).
    Lit red / amber / green ship as the powered pairs, lamp-bank style.
  - THE STREET-NAME PLATE IS ILLEGIBLE: names are canon. The plate carries
    weathered unreadable marks, never letters.
  - NO PURPLE ANYWHERE (the reservation). Green lens is lawful (TILECAT green
    exists); purple is not, and the self-gate sweeps for it.
  - Deterministic, seeded, no dice the fold can't replay.

OUTPUT: banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt (UNJUDGED),
3 mast variants x 4 states (dead/red/amber/green) = 12 sprites, ~5 tiles tall
with arms spanning ~3 cells. Judged on the intersection proof.

Run from repo root: python3 tools/bohemia_traffic_signal_factory.py
"""
import base64
import io
import json
import sys

import numpy as np
from PIL import Image

LAMPS = 'banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt'
OUT = 'banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt'
T = 44
CW, CH = 200, 232   # canvas: arm spans ~3.6 cells, pole ~5 tiles tall


def rng(seed):
    s = seed & 0xffffffff
    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def sample_metal_palette():
    """The world's rust: pull the lamp poles' actual colors."""
    d = json.load(open(LAMPS))
    a = np.asarray(Image.open(io.BytesIO(base64.b64decode(d['lamps'][0]['b64']))).convert('RGBA'))
    op = a[..., 3] > 200
    px = a[op][:, :3].astype(int)
    # 7/17 v3 lesson: the lamps' DOMINANT metal is the near-black cluster
    # (mean ~27,20,14). v2 sampled lum 40-150 and built the whole pole from
    # rust highlights: bright orange poles, nothing like the world. The base
    # is dark iron; rust is the accent.
    lum = px.mean(axis=1)
    def cluster(lo, hi, fallback):
        sel = px[(lum >= lo) & (lum < hi)]
        return tuple(sel.mean(axis=0).astype(int).tolist()) if len(sel) else fallback
    return {
        'shade': cluster(0, 40, (27, 20, 14)),     # the body of the metal
        'mid': cluster(40, 70, (69, 52, 35)),      # worn edges, catch-light
        'light': cluster(70, 110, (122, 85, 43)),  # rust bloom, SPARSE only
    }


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


def draw_head(a, hx, hy, state, r, big=True):
    """A 3-lens signal head hanging from the arm: housing, visors, lenses.
    state: dead | red | amber | green"""
    hw, lens = (20, 12) if big else (14, 9)
    hh = lens * 3 + 14
    housing = (26, 26, 28)
    housing_hi = (52, 52, 56)
    back = (38, 36, 20)                       # weathered backplate, desert-yellowed
    # backplate
    rect(a, hx - 3, hy - 2, hx + hw + 3, hy + hh + 2, back)
    # housing
    rect(a, hx, hy, hx + hw, hy + hh, housing)
    vline(a, hx, hy, hy + hh, housing_hi)     # left edge catch-light
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
        # visor hood above each lens
        hline(a, hx + 1, hx + hw - 1, cy - 2, shade_of(housing, 1.6))
        # round-ish lens
        cx = hx + hw // 2
        rad = lens // 2
        for yy in range(-rad, rad + 1):
            for xx in range(-rad, rad + 1):
                if xx * xx + yy * yy <= rad * rad:
                    wear = 0.75 + 0.25 * r()
                    put(a, cx + xx, cy + rad // 2 + yy + 1,
                        shade_of(col, wear if not on else 1.0))
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


def draw_sign_plate(a, x0, y, w, r):
    """Illegible street-name plate: green municipal plate, weathered marks.
    NEVER letters — names are Paolo's."""
    plate = (24, 62, 44)
    rect(a, x0, y, x0 + w, y + 15, plate)
    hline(a, x0, x0 + w, y, shade_of(plate, 1.5))
    # unreadable wear-marks where text would be
    for k in range(w // 5):
        if r() < 0.7:
            mx = x0 + 3 + int(r() * (w - 6))
            ml = 1 + int(r() * 3)
            hline(a, mx, mx + ml, y + 4 + int(r() * 4), (168, 172, 160))


def weather_pass(a, r):
    """Rust streaks below joints, grit specks, sun-fade on top edges."""
    h, w = a.shape[:2]
    for _ in range(int(w * h * 0.004)):
        x = int(r() * w); y = int(r() * h)
        if a[y, x, 3] > 0:
            streak = int(r() * 8)
            rust = (96 + int(r() * 40), 52 + int(r() * 20), 24)
            for k in range(streak):
                if y + k < h and a[y + k, x, 3] > 0 and r() < 0.7:
                    base = a[y + k, x, :3].astype(int)
                    a[y + k, x, :3] = ((base * 0.55 + np.array(rust) * 0.45).astype(int))


def draw_signal(variant, state, seed):
    r = rng(seed)
    a = np.zeros((CH, CW, 4), dtype=np.uint8)
    M = sample_metal_palette()
    pole_x = 8
    ground_y = CH - 2
    # base flange + anchor bolts
    rect(a, pole_x - 5, ground_y - 4, pole_x + 11, ground_y, shade_of(M['shade'], 0.9))
    put(a, pole_x - 4, ground_y - 5, M['mid']); put(a, pole_x + 9, ground_y - 5, M['mid'])
    # tapered pole: 10px at base -> 7px at top. v3: DARK IRON body like the
    # lamps; rust blooms are sparse per-pixel accents, never the base coat.
    top_y = 14
    for yy in range(top_y, ground_y - 4):
        t = (yy - top_y) / (ground_y - top_y)
        w = 7 + int(3 * t)
        for dx in range(w):
            c = M['mid'] if dx == 0 else (M['shade'] if dx < w - 1 else shade_of(M['shade'], 0.7))
            if r() < 0.07:
                c = M['light']              # rust bloom fleck
            j = 0.86 + 0.28 * r()          # per-pixel metal grain
            put(a, pole_x + dx, yy, shade_of(c, j))
    # collar bands where sections join
    for by in (top_y + 30, top_y + 90, ground_y - 60):
        hline(a, pole_x - 1, pole_x + 9, by, shade_of(M['shade'], 0.8), 2)
    # arm: gentle rise then level, tapering 5px -> 3px, spanning the canvas
    arm_y0 = top_y + 8
    arm_tip_y2 = arm_y0 - 6
    arm_len = CW - pole_x - 14
    for xx in range(arm_len):
        t = xx / arm_len
        yy = arm_y0 - int(6 * min(1.0, t * 2.2) * (1 - t * 0.15))
        w = 7 - int(3 * t)
        for dy in range(w):
            c = M['mid'] if dy == 0 else (M['shade'] if dy < w - 1 else shade_of(M['shade'], 0.7))
            if r() < 0.07:
                c = M['light']
            put(a, pole_x + 9 + xx, yy + dy, shade_of(c, 0.86 + 0.28 * r()))
    # mounting clamps where heads hang
    for cxx in (CW - 36, CW - 88, CW - 128):
        rect(a, cxx + 6, arm_tip_y2 - 1, cxx + 12, arm_tip_y2 + 5, shade_of(M['shade'], 0.85))
    arm_tip_y2 = arm_y0 - 6
    # brace strut from pole to arm, doubled
    for k in range(18):
        put(a, pole_x + 8 + k, arm_y0 + 14 - k, M['shade'])
        put(a, pole_x + 9 + k, arm_y0 + 14 - k, M['mid'])
        put(a, pole_x + 10 + k, arm_y0 + 14 - k, shade_of(M['mid'], 0.8))
    # heads + sign per variant
    if variant == 0:      # two heads + sign plate mid-arm
        for hx in (CW - 44, CW - 96):
            vline(a, hx + 8, arm_tip_y2 + 4, arm_tip_y2 + 10, M['shade'], 2)
            draw_head(a, hx, arm_tip_y2 + 10, state, r)
        draw_sign_plate(a, pole_x + 40, arm_tip_y2 + 9, 56, r)
    elif variant == 1:    # three heads across the span (the big arterial mast)
        for hx in (CW - 40, CW - 86, CW - 132):
            vline(a, hx + 8, arm_tip_y2 + 4, arm_tip_y2 + 10, M['shade'], 2)
            draw_head(a, hx, arm_tip_y2 + 10, state, r)
    else:                 # two heads + pole-mounted near-side head + sign
        for hx in (CW - 44, CW - 100):
            vline(a, hx + 8, arm_tip_y2 + 4, arm_tip_y2 + 10, M['shade'], 2)
            draw_head(a, hx, arm_tip_y2 + 10, state, r)
        draw_head(a, pole_x + 12, arm_y0 + 46, state, r, big=False)
        draw_sign_plate(a, pole_x + 40, arm_tip_y2 + 8, 36, r)
    weather_pass(a, r)
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
    out = {'version': 'BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_v1', 'date': '2026-07-17',
           'status': 'UNJUDGED (first commissioned original; Paolo judges on the intersection proof)',
           'commission': ('Paolo 7/17 verbatim intent: large hanging street light, red yellow '
                          'green, very tall, hangs above, street signs and stuff. Vegas mast-arm.'),
           'laws': ('palette sampled from the blessed lamp poles; DEAD is act-1 default '
                    '(grid-power ruling pending Paolo); lit r/a/g are the powered pairs; '
                    'sign plates ILLEGIBLE (names are canon); no purple; deterministic.'),
           'sprite_px': [CW, CH], 'anchor': 'pole base bottom-left; arm extends right; '
           'mirror at bake for opposite approaches',
           'signals': []}
    n = 0
    for variant in range(3):
        for state in ('dead', 'red', 'amber', 'green'):
            a = draw_signal(variant, state, 55000 + variant * 419 + hash(state) % 997)
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
