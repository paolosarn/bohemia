#!/usr/bin/env python3
"""THE 45 DEGREE LAW GATE (7/17/26)

Paolo, verbatim, judging the v4 signals against his lamp: "every art that I
have you make it has to be viewed from like a 45 degree angle... yours is
like a flat 90, like it's a 2D scroller."

THE LAW: every original prop Claude draws is seen from the world's
three-quarter 45 view. Horizontal cross-sections are ELLIPSES, tops are
visible and sky-lit, bands bow toward the viewer. The blessed lamp bank is
the reference. Full text: laws/BOHEMIA_ADDENDUM_45_DEGREE_ART_LAW_7_17_26.md

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this gate measures the
signature of the three-quarter view on every registered commissioned-art
bank (the registry grows as commissions land):

  1. DECLARATION: the bank carries a 'perspective' field naming the 45 law
  2. ELLIPSE PROXY: the sprite's ground hardware is an ellipse stack, not a
     flat scroller rectangle — the widest row of the base sits ABOVE the
     bottom row and the bottom row is measurably narrower (a flat-90
     rectangle base has uniform widths and fails both)
  3. TOP-LIT PROXY: the rows around the base's widest point (the visible
     top face) are brighter than the wall rows under them (a flat-90 base
     has no top face to light)

Run from repo root: python3 gates/art_45_gate.py
"""
import base64
import io
import json
import sys

import numpy as np
from PIL import Image

# (bank path, sprite list key, form). Every commissioned-original bank registers.
# form: 'prop'     — a compact object; the lit ELLIPSE base sits near the bottom
#                    (lamp, mast-arm signal). Measured at the base.
#       'building' — an iso PRISM mass; the sky-lit TOP diamond (roof) is where the
#                    45 signature lives. Measured at the roof. Same law, same
#                    "ellipse cross-section + sky-lit top, never flat-90 side-on",
#                    read where a building actually shows it.
REGISTRY = [
    ('banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt', 'signals', 'prop'),
    ('banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt', 'heroes', 'building'),
]

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL: ' + msg)


def check_prop(bank, a):
    """The lit ELLIPSE base sits near the bottom (lamp/signal)."""
    op = a[..., 3] > 0
    rows = np.where(op.any(axis=1))[0]
    bot = int(rows[-1])
    win = op[bot - 14:bot + 1]
    widths = win.sum(axis=1)
    wi = int(widths.argmax())
    chk(widths[wi] > widths[-1] * 1.15,
        '%s: base bottom row is as wide as its widest row (flat-90 rectangle)' % bank)
    chk(wi < 14,
        '%s: base widest row IS the bottom row (no ellipse)' % bank)
    lum = a[..., :3].mean(axis=2)
    wr = bot - 14 + wi
    top_sel = op[max(0, wr - 3):wr + 1]
    wall_sel = op[wr + 2:bot + 1]
    top_lum = lum[max(0, wr - 3):wr + 1][top_sel].mean() if top_sel.any() else 0
    wall_lum = lum[wr + 2:bot + 1][wall_sel].mean() if wall_sel.any() else 255
    chk(top_lum > wall_lum * 1.12,
        '%s: base top face (%d) not brighter than its wall (%d): tops must be sky-lit'
        % (bank, top_lum, wall_lum))
    print('  %s: ellipse base (widest row %d above bottom, %d vs %d px wide), '
          'top-lit %.0f vs wall %.0f' % (bank.split('/')[-1], 14 - wi,
          widths[wi], widths[-1], top_lum, wall_lum))


def check_building(bank, a):
    """An iso PRISM mass shows the 45 view in two signatures a flat side-on 2D
    sprite can't fake:
      1. a DIAMOND TOP — the roofline widens below its top point (a flat-90
         building has a straight horizontal roof edge: top row == widest);
      2. TWO differently-lit WALL FACES — the lit front-right vs the shadowed
         front-left. A flat scroller shows one uniform face; a 3/4 prism has a
         measurable left/right luminance split down the mass."""
    op = a[..., 3] > 0
    rows = np.where(op.any(axis=1))[0]
    cols = np.where(op.any(axis=0))[0]
    top, bot = int(rows[0]), int(rows[-1])
    # 1. diamond top
    win = op[top:top + 18]
    widths = win.sum(axis=1)
    wi = int(widths.argmax())
    chk(widths[wi] > widths[0] * 1.15,
        '%s: roofline top row is as wide as its widest row (flat-90 rectangle, not an iso diamond)' % bank)
    chk(wi > 0,
        '%s: roof widest row IS the very top row (no diamond top face)' % bank)
    # 2. two-toned walls: the mass BELOW the roof splits lit-right / shadow-left
    lum = a[..., :3].mean(axis=2)
    cx = int((cols[0] + cols[-1]) / 2)
    mass = slice(top + wi + 2, bot - 2)      # the wall zone, under the roof, above the base tip
    left_sel = op[mass, cols[0]:cx]
    right_sel = op[mass, cx:cols[-1] + 1]
    left_lum = lum[mass, cols[0]:cx][left_sel].mean() if left_sel.any() else 0
    right_lum = lum[mass, cx:cols[-1] + 1][right_sel].mean() if right_sel.any() else 0
    hi, lo = max(left_lum, right_lum), min(left_lum, right_lum)
    chk(hi > lo * 1.15,
        '%s: left/right walls are the same brightness (%d vs %d): a flat side-on face, not a lit + shadowed 3/4 prism'
        % (bank, left_lum, right_lum))
    print('  %s: iso-diamond roof (widest row %d below the top point, %d vs %d px wide), '
          'lit/shadow walls %.0f vs %.0f' % (bank.split('/')[-1], wi,
          widths[wi], widths[0], hi, lo))


def main():
    for bank, key, form in REGISTRY:
        try:
            d = json.load(open(bank))
        except Exception as e:
            chk(False, '%s unreadable: %s' % (bank, e))
            continue
        chk('45' in str(d.get('perspective', '')),
            '%s declares no 45 perspective contract' % bank)
        item = d[key][0]
        a = np.asarray(Image.open(io.BytesIO(base64.b64decode(item['b64']))).convert('RGBA'))
        if form == 'building':
            check_building(bank, a)
        else:
            check_prop(bank, a)
    print('ART 45 GATE: %d passed, %d failed' % (P, F))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
