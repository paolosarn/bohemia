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

# (bank path, sprite list key). Every commissioned-original bank registers.
REGISTRY = [
    ('banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt', 'signals'),
]

P = F = 0


def chk(ok, msg):
    global P, F
    if ok:
        P += 1
    else:
        F += 1
        print('  FAIL: ' + msg)


def main():
    for bank, key in REGISTRY:
        try:
            d = json.load(open(bank))
        except Exception as e:
            chk(False, '%s unreadable: %s' % (bank, e))
            continue
        chk('45' in str(d.get('perspective', '')),
            '%s declares no 45 perspective contract' % bank)
        item = d[key][0]
        a = np.asarray(Image.open(io.BytesIO(base64.b64decode(item['b64']))).convert('RGBA'))
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
        top_rows = (slice(max(0, wr - 3), wr + 1),)
        wall_rows = (slice(wr + 2, bot + 1),)
        top_sel = op[top_rows[0]]
        wall_sel = op[wall_rows[0]]
        top_lum = lum[top_rows[0]][top_sel].mean() if top_sel.any() else 0
        wall_lum = lum[wall_rows[0]][wall_sel].mean() if wall_sel.any() else 255
        chk(top_lum > wall_lum * 1.12,
            '%s: base top face (%d) not brighter than its wall (%d): tops must be sky-lit'
            % (bank, top_lum, wall_lum))
        print('  %s: ellipse base (widest row %d above bottom, %d vs %d px wide), '
              'top-lit %.0f vs wall %.0f' % (bank.split('/')[-1], 14 - wi,
              widths[wi], widths[-1], top_lum, wall_lum))
    print('ART 45 GATE: %d passed, %d failed' % (P, F))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
