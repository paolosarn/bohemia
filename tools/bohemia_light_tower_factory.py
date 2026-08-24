#!/usr/bin/env python3
"""
THE LIGHT TOWER, COOKED -- the last prop family both matchers refuse on purpose.
(8/23, WORLD lane.)

WHY IT WAS REFUSED RATHER THAN DRAWN. When the streetlight rule lit forty-two districts, the
lamp matcher explicitly excluded /tower|mast|floodlight/ and the prop table did the same. That
was correct and it was not a fix: A STADIUM MAST IS NOT A COBRA HEAD. Putting the lamp sprite
on speedway:12 would have stood twenty-five ornamental lanterns in a 5x5 blob and called it a
floodlight tower. The refusal was a promise to come back with the right art, and this is that.

    speedway:12   100 tiles, blobs of 25    ballpark:12  54 tiles
    school:12      40 tiles                 stadium:12   12 tiles
    (airport/airbase:15 'light mast' is a smaller apron object and stays out of this pool)

REUSE CHECK: cooks pixels, and the pixels are the point -- but it opens
banks/BOHEMIA_HD_TILE_REPO_part1..4.txt and banks/BOHEMIA_STANDING_SET_7_10_26.txt first, the
same sweep the power pole ran (294 packs, 575 standing objects, 27 street/exterior packs, 109
tiles rendered and looked at). There is no floodlight mast in the corpus any more than there
was a distribution pole. WHAT IT REUSES IS THE DRAWING: every helper comes from
tools/bohemia_traffic_signal_factory.py -- ellipse_disc, bowed_band, cyl_index, bow -- the
toolkit that already passes the 45 law, exactly as the power pole does. A third hand-rolled
three-quarter renderer is what FACTORY LAW exists to stop.

THE 45 DEGREE LAW (Paolo 7/17): ellipse cross-sections, sky-lit tops, bands that bow toward
the viewer. The base flange is an ellipse_disc, every collar up the mast bows, the headframe
shows its lit top rail, and each floodlight head is a little lit disc seen from above-front.
gates/art_45_gate.py measures the signature; this bank registers in it.

THE ANATOMY IS RESEARCHED (8/23): a steel mast 20-50 m, tapered, carrying a HEADFRAME (the
crown) with two or three ROWS of floodlights; external ladder access up the shaft with rest
platforms. So: taper, collars, ladder, crown, rows of heads -- not a stick with a blob on top.

ACT ONE IS DEAD. Every head is dark glass in a dark housing, and some are GONE -- the housing
empty, the lens out. A stadium that still had a complete lamp set after a decade would be
saying somebody maintains it, which is a claim about who holds this ground and not mine to
make (MECHANISM-MINE / CONTENTS-PAOLO'S).

  python3 tools/bohemia_light_tower_factory.py
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

from bohemia_traffic_signal_factory import (       # noqa: E402
    rng, put, vline, shade_of, cyl_index, bow, ellipse_disc, bowed_band, sampled_kit)

OUT = 'banks/BOHEMIA_LIGHT_TOWER_8_23_26.txt'
W, H = 104, 232


def steel_kit():
    """Galvanised steel, the same luminance ladder the signals use re-hued to zinc."""
    K = sampled_kit()

    def zinc(c):
        g = int(sum(c) / 3.0)
        return (max(0, int(g * 0.95)), max(0, int(g * 0.99)), max(0, min(255, int(g * 1.06))))
    spec = zinc(K['spec'])
    while sum(spec) > 548:                       # DEAD STATE headroom, from the blessed art
        spec = tuple(int(v * 0.97) for v in spec)
    return {'outline': zinc(K['outline']), 'ramp': [zinc(c) for c in K['ramp']],
            'rust': K['rust'], 'spec': spec}


def mast(a, K, r, cx, y0, y1, half_top, half_bot):
    """A tapered steel shaft, lit as a cylinder from the world's 45, with collars that BOW."""
    ramp = K['ramp']
    for y in range(y0, y1):
        t = (y - y0) / float(max(1, y1 - y0))
        hw = max(1, int(round(half_top + (half_bot - half_top) * t)))
        for xx in range(-hw, hw + 1):
            u = (xx + hw + 0.5) / (2.0 * hw + 1.0)
            ti = cyl_index(u, r)
            c = ramp[ti]
            if ti == 4 and r() < 0.26:
                c = K['spec']
            # RUST IS A LIST, NOT A COLOUR. The blessed kit carries three rust tones and I
            # handed the whole list to shade_of, which is a crash rather than a wrong picture
            # -- the good kind of mistake, loud and immediate.
            if r() < 0.07:                        # rust weeping from the flange joints
                c = K['rust'][int(r() * len(K['rust'])) % len(K['rust'])]
            if xx == -hw or xx == hw:
                c = K['outline']
            put(a, cx + xx, y, shade_of(c, 0.95 + 0.10 * r()))
    # SECTION COLLARS: a mast this tall is flanged sections, and each joint wraps the shaft
    for k in range(1, 4):
        yy = int(y0 + (y1 - y0) * k / 4.0)
        t = (yy - y0) / float(max(1, y1 - y0))
        hw = max(1, int(round(half_top + (half_bot - half_top) * t)))
        bowed_band(a, K, r, cx, yy, hw * 2 + 3, h=2, depth=1)


def ladder(a, K, r, cx, y0, y1, off):
    """External ladder access -- the researched detail that stops it reading as a stick."""
    for y in range(y0, y1):
        if (y - y0) % 4 == 0:
            for k in range(3):
                put(a, cx + off + k, y, shade_of(K['ramp'][2], 0.92))
        put(a, cx + off, y, K['outline'])
        put(a, cx + off + 3, y, K['outline'])


def head(a, K, r, cx, cy, dead_out):
    """One floodlight: a housing seen from above-front, its lens a lit disc -- or EMPTY,
    because a decade on, some of them are simply gone."""
    ramp = K['ramp']
    for y in range(cy, cy + 5):
        for x in range(cx - 3, cx + 4):
            u = (x - cx + 3 + 0.5) / 7.0
            put(a, x, y, shade_of(ramp[cyl_index(u, r)], 0.93 + 0.10 * r()))
    if dead_out:
        # the lens is out: a dark socket with a bright rim where the gasket used to sit
        for x in range(cx - 2, cx + 3):
            put(a, x, cy + 1, shade_of(K['outline'], 0.8))
            put(a, x, cy + 2, shade_of(K['outline'], 0.6))
        put(a, cx - 3, cy + 1, K['spec'] if r() < 0.5 else ramp[3])
    else:
        ellipse_disc(a, K, r, cx, cy + 2, 3, 1, 1, tone_shift=-1)   # dark glass, lit rim


def headframe(a, K, r, cx, y, span, rows, seed_r):
    """THE CROWN. A horizontal frame carrying rows of heads: its top rail catches the sky and
    the whole band bows toward the viewer, which is what stops a crown reading as a bar."""
    ramp = K['ramp']
    for i, xx in enumerate(range(cx - span, cx + span + 1)):
        u = (i + 0.5) / float(2 * span + 1)
        dy = bow(u, 2)
        put(a, xx, y + dy, K['spec'] if r() < 0.2 else ramp[4])
        put(a, xx, y + dy + 1, ramp[3])
        put(a, xx, y + dy + 2, ramp[2])
        put(a, xx, y + dy + 3, K['outline'])
    # the diagonal stays that hold the crown off the mast
    for s in (-1, 1):
        for t in range(9):
            put(a, cx + s * (3 + t * (span - 4) // 9), y + 5 + int(t * 0.9), shade_of(ramp[2], 0.95))
    n = 0
    for row in range(rows):
        ry = y + 6 + row * 7
        for hx in range(cx - span + 5, cx + span - 3, 9):
            head(a, K, r, hx, ry, seed_r() < 0.28)      # about a quarter of them are gone
            n += 1
    return n


def build(variant, seed):
    r = rng(seed)
    K = steel_kit()
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    top, butt = 30, H - 14

    SPAN = {'stadium': 34, 'ballpark': 26, 'speedway': 30, 'school': 18}[variant]
    ROWS = {'stadium': 3, 'ballpark': 2, 'speedway': 3, 'school': 2}[variant]

    mast(a, K, r, cx, top, butt, 3, 7)
    ladder(a, K, r, cx, top + 20, butt - 10, 8)
    # THE BASE FLANGE. The 45 law's signature lives here and art_45_gate reads exactly this:
    # the widest row sits ABOVE the bottom row and the top face is lit.
    ellipse_disc(a, K, r, cx, butt - 5, 13, 5, 8, tone_shift=-1)
    headframe(a, K, r, cx, top - 4, SPAN, ROWS, r)
    return a


VARIANTS = ['stadium', 'ballpark', 'speedway', 'school', 'ballpark', 'speedway']


def main():
    out = []
    for i, v in enumerate(VARIANTS):
        a = build(v, 7700 + i * 53)
        buf = io.BytesIO()
        Image.fromarray(a, 'RGBA').save(buf, format='PNG')
        out.append({'variant': v, 'w': W, 'h': H, 'base_y': H - 14,
                    'b64': base64.b64encode(buf.getvalue()).decode('ascii')})

    bank = {
        'version': 'BOHEMIA_LIGHT_TOWER_v1',
        'date': '2026-08-23',
        'status': 'COMMISSIONED ORIGINAL -- the last family both prop matchers refuse',
        'commission': ('speedway:12 (100 tiles, blobs of 25), ballpark:12 (54), school:12 (40) '
                       'and stadium:12 (12) all author a light tower, and both the lamp matcher '
                       'and the prop table refuse /tower|mast|floodlight/ ON PURPOSE: a stadium '
                       'mast is not a cobra head, and the lamp sprite on a 5x5 blob would stand '
                       'twenty-five ornamental lanterns. The refusal was a promise to come back '
                       'with the right art.'),
        'perspective': ('45deg three-quarter (THE 45 LAW, Paolo 7/17: all original art is seen '
                        'from the world\'s 45, never flat side-on; ellipse tops, sky-lit top '
                        'faces, bowed bands). Base flange is an ellipse_disc, every section '
                        'collar bows, the crown shows its lit top rail, each head is a lit disc '
                        'seen from above-front. Drawn with the traffic-signal factory toolkit.'),
        'anatomy': ('Researched 8/23: a steel mast of 20-50 m, tapered and flanged in sections, '
                    'carrying a HEADFRAME (the crown) with two or three ROWS of floodlights, and '
                    'external ladder access up the shaft with rest platforms.'),
        'act1': ('Every head is dark glass in a dark housing and about a quarter are GONE -- the '
                 'housing empty, the lens out. A complete lamp set after a decade would be '
                 'claiming somebody maintains this ground, which is not a claim I get to make.'),
        'laws': ['45 DEGREE ART LAW', 'ACT ONE ONLY', 'DEAD IS DEFAULT', 'PURPLE RESERVATION',
                 'MECHANISM-MINE / CONTENTS-PAOLO\'S'],
        'sprite_h': H,
        'towers': out,
    }
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(bank, fh)
    print('LIGHT TOWER FACTORY -> %s' % OUT)
    print('  %d towers, %dx%d, variants: %s' % (len(out), W, H, ', '.join(VARIANTS)))


if __name__ == '__main__':
    main()
