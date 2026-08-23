#!/usr/bin/env python3
"""
THE POWER POLE, COOKED -- because the corpus does not have one and I looked.
(8/23, WORLD lane.)

REUSE CHECK (and it came back NEGATIVE, which is the point of doing one):
Before drawing a pixel I swept the corpus for a distribution pole: 294 packs in
banks/BOHEMIA_HD_TILE_REPO_part1..4.txt, the 575-object banks/BOHEMIA_STANDING_SET_7_10_26
.txt, and 27 street/exterior packs I had not yet opened -- 109 tiles rendered and LOOKED at.
There is no utility pole anywhere in it. (I also found `tall_ratio` in the standing set reads
1.00 for all 575 objects: it was computed on the square canvas rather than the content, so the
one field that could have found a tall thin object says nothing.) So this is the first thing in
a long while that genuinely needs cooking rather than shopping, and REUSE-FIRST is satisfied by
having asked and answered, not by having skipped.
REUSE CHECK, AND IT CAME BACK NEGATIVE -- said in those words on purpose, because a reuse
check that can only ever come back positive is not a check, and this is the one that did not.

WHAT IT IS REUSED FROM IS THE DRAWING ITSELF. Every helper here comes from
tools/bohemia_traffic_signal_factory.py -- ellipse_disc, bowed_band, cyl_index, bow, put,
shade_of, mix -- which is the toolkit that passed the 45 DEGREE LAW on the signals. A second
hand-rolled three-quarter renderer is exactly the duplication FACTORY LAW exists to stop.

THE 45 DEGREE LAW (Paolo 7/17, verbatim: "yours is like a flat 90, like it's a 2D scroller").
Horizontal cross-sections are ELLIPSES, tops are visible and sky-lit, bands bow toward the
viewer. The base collar is an ellipse_disc, the crossarm shows its lit top face, every band
round the pole bows, and the insulators are little stacked ellipse discs. gates/art_45_gate.py
measures the signature and this bank registers in it.

THE ANATOMY IS RESEARCHED, NOT REMEMBERED (8/23): a wood pole from a tree trunk; a wooden
CROSSARM bolted across it and braced diagonally; insulators of porcelain that "look like
stacked plates"; usually FOUR wires -- three phase conductors and a neutral; and on some poles
a TRANSFORMER, the big can that steps voltage down for the houses underneath it.

ACT ONE IS DEAD AND THE POLE SHOWS IT. And a correction I made to my own text rather than to
the art: I first wrote that desert sun silvers these grey. UNTREATED wood silvers. A utility
pole is CREOSOTE-TREATED and stays dark brown-black for decades -- which is what the render
came out as, so the art was right and the description was the thing that was wrong. Sun-bleach
lives in the specular hit on the lit side, not in the body tone. Nothing glows, nothing hums. Some spans are SNAPPED -- the conductor leaves the insulator and stops -- because
a decade of no linemen is what the whole valley is about, and an unbroken grid overhead would
quietly contradict CLUSTERED POWER (12% of circuits live) every time he looked up.

  python3 tools/bohemia_power_pole_factory.py
"""
import base64
import io
import json
import math
import os
import sys

import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
sys.path.insert(0, os.path.join(REPO, 'tools'))

# THE TOOLKIT THAT ALREADY PASSES THE 45 LAW. Not re-implemented.
from bohemia_traffic_signal_factory import (       # noqa: E402
    rng, put, vline, hline, rect, shade_of, mix, cyl_index, bow,
    ellipse_disc, bowed_band, sampled_kit)

OUT = 'banks/BOHEMIA_POWER_POLE_8_23_26.txt'
W, H = 84, 192


def wood_kit():
    """A WEATHERED-WOOD ladder built from the blessed kit's LUMINANCE, re-hued.
    Same trick the signal factory uses for galvanised zinc, and for the same reason: the
    approved art's tonal spacing is what makes it read, so the ladder is kept and only the
    hue is moved. Desert wood is silver-grey on the sun side and creosote-brown in the
    shade, so the ramp runs warm-dark to bleached-pale."""
    K = sampled_kit()

    def wood(c, warm):
        g = sum(c) / 3.0
        return (max(0, min(255, int(g * (1.02 + 0.10 * warm)))),
                max(0, min(255, int(g * (0.97 + 0.02 * warm)))),
                max(0, min(255, int(g * (0.90 - 0.04 * warm)))))
    ramp = [wood(c, 1.0 - i / 4.0) for i, c in enumerate(K['ramp'])]
    spec = wood(K['spec'], 0.0)
    # DEAD STATE HEADROOM, set from the blessed art rather than from nerves: the approved
    # dark lamp peaks at luminance ~180 and the approved signals at ~169, both while being
    # emphatically dead. Sun on silvered wood belongs in that band.
    while sum(spec) > 548:
        spec = tuple(int(v * 0.97) for v in spec)
    while sum(spec) < 430:
        spec = tuple(min(255, int(v * 1.04) + 1) for v in spec)
    return {'outline': shade_of(wood(K['outline'], 0.6), 0.85), 'ramp': ramp,
            'rust': K['rust'], 'spec': spec}


def metal_kit():
    """Hardware: bolts, the transformer can, the arm braces. Weathered zinc."""
    K = sampled_kit()

    def zinc(c):
        g = int(sum(c) / 3.0)
        return (max(0, int(g * 0.95)), max(0, int(g * 0.99)), max(0, min(255, int(g * 1.06))))
    spec = zinc(K['spec'])
    while sum(spec) > 548:
        spec = tuple(int(v * 0.97) for v in spec)
    return {'outline': zinc(K['outline']), 'ramp': [zinc(c) for c in K['ramp']],
            'rust': K['rust'], 'spec': spec}


def pole_shaft(a, K, r, cx, y0, y1, half):
    """The trunk, lit as a cylinder from the world's 45."""
    ramp = K['ramp']
    for y in range(y0, y1):
        # a real pole tapers: thicker at the butt
        t = (y - y0) / float(max(1, y1 - y0))
        hw = int(round(half * (0.82 + 0.30 * t)))
        for xx in range(-hw, hw + 1):
            u = (xx + hw + 0.5) / (2.0 * hw + 1.0)
            ti = cyl_index(u, r)
            c = ramp[ti]
            # THE SUN HITS IT. Measured against the blessed banks before changing anything:
            # this pole's MEAN (37-39) and p90 (94) already matched the approved signals
            # (38-40 / 93-95) -- the eye said "far too dark" and the eye was reading a black
            # contact sheet. What was actually missing was the TOP END: max 128 against the
            # lamp's 180 and the signals' 169, because the shaft never took a specular hit at
            # all. A weathered pole in desert sun has a bright edge on the lit side.
            if ti == 4 and r() < 0.30:
                c = K['spec']
            # GRAIN: vertical checking, the way a dried pole splits
            if r() < 0.09:
                c = shade_of(c, 0.86)
            if xx == -hw or xx == hw:
                c = K['outline']
            put(a, cx + xx, y, shade_of(c, 0.95 + 0.10 * r()))


def crossarm(a, KW, KM, r, cx, y, span, depth=3):
    """A wooden beam seen from 45: its LIT TOP FACE is visible above the front face,
    and the whole band bows toward the viewer."""
    ramp = KW['ramp']
    x0, x1 = cx - span, cx + span
    for i, xx in enumerate(range(x0, x1 + 1)):
        u = (i + 0.5) / float(x1 - x0 + 1)
        dy = bow(u, 2)
        for k in range(depth):                       # the TOP face, sky-lit
            c = (KW['spec'] if r() < 0.22 else ramp[4]) if k == 0 else ramp[3]
            put(a, xx, y + dy + k, shade_of(c, 0.96 + 0.10 * r()))
        for k in range(depth, depth + 4):            # the front face, in shade
            ti = 2 if k < depth + 2 else 1
            put(a, xx, y + dy + k, shade_of(ramp[ti], 0.94 + 0.10 * r()))
        put(a, xx, y + dy + depth + 4, KW['outline'])
    # the diagonal braces back to the pole -- what stops an arm folding
    for s in (-1, 1):
        for t in range(10):
            bx = cx + s * (4 + int(round(t * (span - 6) / 10.0)))
            by = y + 8 + int(round(t * 1.1))
            put(a, bx, by, shade_of(KM['ramp'][2], 0.95))
            put(a, bx, by + 1, KM['outline'])


def insulator(a, K, r, cx, cy):
    """Porcelain: "stacked plates" is the phrase in the field guides, so it is three
    small ellipse discs, each lit on top."""
    for i, (rx, ry) in enumerate(((4, 2), (3, 1), (2, 1))):
        ellipse_disc(a, K, r, cx, cy - i * 3, rx, ry, 1, tone_shift=1 if i == 0 else 0)


def conductor(a, K, r, x0, y0, x1, y1, snapped=False):
    """A span leaving the insulator. Catenary sag, and some of them stop in mid-air
    because nobody has climbed a pole in this valley for a decade."""
    n = max(2, abs(x1 - x0))
    end = int(n * (0.34 + 0.22 * r())) if snapped else n
    for i in range(end + 1):
        t = i / float(n)
        x = int(round(x0 + (x1 - x0) * t))
        # SAG, NOT DROOP. The first cut used four times this and the spans read as a heavy
        # black web across the whole sprite instead of wire hanging off a pole.
        sag = 10.0 * (t - t * t) * 1.7
        y = int(round(y0 + (y1 - y0) * t + sag))
        put(a, x, y, K['outline'])
        if r() < 0.18:
            put(a, x, y + 1, shade_of(K['ramp'][1], 0.9))
    if snapped:                                   # the loose end curls down
        t = end / float(n)
        x = int(round(x0 + (x1 - x0) * t))
        y = int(round(y0 + (y1 - y0) * t + 10.0 * (t - t * t) * 4.0))
        for k in range(1, 7 + int(4 * r())):
            put(a, x + int(round(math.sin(k * 0.7) * 2)), y + k, K['outline'])


def transformer(a, K, r, cx, cy):
    """The big can. A cylinder with a lit elliptical lid -- the 45 law's own shape."""
    rx, ry, hgt = 7, 3, 16
    for y in range(hgt):
        for xx in range(-rx, rx + 1):
            u = (xx + rx + 0.5) / (2.0 * rx + 1.0)
            c = K['ramp'][cyl_index(u, r)]
            put(a, cx + xx, cy + y, shade_of(c, 0.94 + 0.10 * r()))
    ellipse_disc(a, K, r, cx, cy, rx, ry, 1, tone_shift=1)          # the lid
    bowed_band(a, K, r, cx, cy + hgt - 3, rx * 2 + 1, h=2, depth=1) # the base rib
    for s in (-1, 1):                                                # the mounting lugs
        vline(a, cx + s * (rx + 1), cy + 3, cy + hgt - 3, K['outline'])


def build(variant, seed):
    r = rng(seed)
    KW, KM = wood_kit(), metal_kit()
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    top, butt = 18, H - 12

    pole_shaft(a, KW, r, cx, top, butt, 4)

    # THE BASE. An ellipse collar of packed earth and old concrete: the 45 law's signature
    # lives here, and art_45_gate reads exactly this -- the widest row sits ABOVE the bottom
    # row, and the top face is lit. A flat-90 rectangle base fails both.
    ellipse_disc(a, KM, r, cx, butt - 4, 11, 4, 7, tone_shift=-1)

    arm_y = top + 16
    crossarm(a, KW, KM, r, cx, arm_y, 30)

    # FOUR WIRES: three phases on the arm, a neutral lower on the pole (the researched
    # standard configuration).
    xs = (cx - 24, cx - 9, cx + 9, cx + 24)
    for i, ix in enumerate(xs):
        insulator(a, KM, r, ix, arm_y - 1)
        snapped = (variant in ('snapped', 'wrecked')) and (i % 2 == 0)
        conductor(a, KM, r, ix, arm_y - 7, 0 if i < 2 else W - 1, arm_y - 7 + int(6 * r()),
                  snapped=snapped)
        conductor(a, KM, r, ix, arm_y - 7, W - 1 if i < 2 else 0, arm_y - 7 + int(6 * r()),
                  snapped=snapped and r() < 0.6)
    nx = cx
    insulator(a, KM, r, nx, arm_y + 26)
    conductor(a, KM, r, nx, arm_y + 20, 0, arm_y + 26, snapped=(variant == 'wrecked'))
    conductor(a, KM, r, nx, arm_y + 20, W - 1, arm_y + 26, snapped=False)

    if variant in ('transformer', 'wrecked'):
        transformer(a, KM, r, cx + 13, arm_y + 34)

    return a


VARIANTS = ['plain', 'transformer', 'snapped', 'wrecked', 'plain', 'transformer']


def main():
    out = []
    for i, v in enumerate(VARIANTS):
        a = build(v, 9100 + i * 37)
        im = Image.fromarray(a, 'RGBA')
        buf = io.BytesIO()
        im.save(buf, format='PNG')
        out.append({'variant': v, 'w': W, 'h': H, 'base_y': H - 12,
                    'b64': base64.b64encode(buf.getvalue()).decode('ascii')})

    bank = {
        'version': 'BOHEMIA_POWER_POLE_v1',
        'date': '2026-08-23',
        'status': 'COMMISSIONED ORIGINAL -- cooked because the corpus has none',
        'commission': ('arterial:10 and arterial_x:10 author a power pole and it has drawn as '
                       'a flat coloured square since the district was written. A REUSE-FIRST '
                       'sweep of 294 corpus packs, the 575-object standing set and 27 unopened '
                       'street/exterior packs found no distribution pole of any kind.'),
        'perspective': ('45deg three-quarter (THE 45 LAW, Paolo 7/17: all original art is seen '
                        'from the world\'s 45, never flat side-on; ellipse tops, sky-lit top '
                        'faces, bowed bands). Drawn with the traffic-signal factory\'s own '
                        'toolkit -- ellipse_disc, bowed_band, cyl_index, bow -- rather than a '
                        'second hand-rolled three-quarter renderer.'),
        'anatomy': ('Researched 8/23: wood pole from a tree trunk; a wooden CROSSARM bolted '
                    'across and braced diagonally; porcelain insulators that "look like '
                    'stacked plates"; four wires, three phase conductors and a neutral; and on '
                    'some poles a TRANSFORMER, the can that steps voltage down for the houses '
                    'under it.'),
        'act1': ('CREOSOTE-DARK, not silvered: untreated wood silvers in desert sun but a '
                 'utility pole is treated and stays dark brown-black for decades. The bleach '
                 'lives in the specular hit on the lit side, not in the body tone. Nothing '
                 'glows and nothing hums. Some spans are SNAPPED and the loose end curls down '
                 '-- a decade with no linemen is the premise, and an unbroken grid overhead '
                 'would contradict CLUSTERED POWER every time he looked up.'),
        'laws': ['45 DEGREE ART LAW', 'ACT ONE ONLY', 'DEAD IS DEFAULT',
                 'PURPLE RESERVATION', 'REUSE-FIRST (asked, answered negative)'],
        'sprite_h': H,
        'poles': out,
    }
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(bank, fh)
    print('POWER POLE FACTORY -> %s' % OUT)
    print('  %d poles, %dx%d, variants: %s' % (len(out), W, H, ', '.join(VARIANTS)))
    print('  drawn with the traffic-signal factory toolkit (45 law), not a second renderer')


if __name__ == '__main__':
    main()
