#!/usr/bin/env python3
"""BOHEMIA TURN ARROW FACTORY (7/17/26)

The act-1 gap queue's open art_gaps item: turn-pocket lane markings shipped
their LINES (TURN_MARKING_CANDIDATES, 7/14, unjudged) but never their ARROWS
(dual/triple left pockets, right pockets, TWLTL center arrows). This factory
cooks the arrow family in the certified style:

  - BASE: the candidates' own asphalt, paint erased and inpainted from
    neighboring texture — the approved surface, byte-faithful where unpainted.
  - PAINT: WHITE ONLY (LINE COLOR LAW: an arrow is a lane-level marking;
    yellow belongs to direction separation and never appears here).
  - WEATHERING: paint dropped where the asphalt's cracks run dark, plus seeded
    noise erosion, brightness matched to the certified paint's own range.

SELF-VERIFICATION (the factory's gate; it refuses to write on any failure):
  - zero yellow pixels in every cooked tile
  - zero purple (the purity gate re-checks the bank in the suite anyway)
  - paint budget inside the certified weathered range per tile
  - every base pixel outside the arrow's footprint identical to the source

Output: banks/BOHEMIA_TURN_ARROW_CANDIDATES_7_17_26.txt  (status UNJUDGED —
Paolo judges via tools/BOHEMIA_MARKING_PICKER_7_17_26.html, thumbs + export)

Run from repo root: python3 tools/bohemia_turn_arrow_factory.py

REUSE CHECK:
used BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt (the certified asphalt
base is inpainted from this bank's own candidates, byte-faithful outside
the arrow footprint - not a fresh ground texture).
"""
import base64
import io
import json
import sys

import numpy as np
from PIL import Image

SRC = 'banks/BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt'
OUT = 'banks/BOHEMIA_TURN_ARROW_CANDIDATES_7_17_26.txt'
T = 44
PAINT_MIN, PAINT_MAX = 30, 170   # certified weathered-paint budget per tile


def rng(seed):
    s = seed & 0xffffffff
    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def load_bases():
    """Erase the certified tiles' paint; keep their asphalt."""
    d = json.load(open(SRC))
    bases = []
    for key in ('pocket_line_v', 'pocket_line_h'):
        for b64 in d['candidates'][key]:
            a = np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')).astype(int)
            r, g, b = a[..., 0], a[..., 1], a[..., 2]
            sat = np.abs(r - b) + np.abs(r - g) + np.abs(g - b)
            paint = ((r > 105) & (g > 105) & (b > 95) & (sat < 90)) | \
                    ((r > 110) & (g > 80) & (b < 90) & (r - b > 40))
            # dilate: weathered paint has dim fringes the threshold misses
            pd = paint.copy()
            pd[1:, :] |= paint[:-1, :]; pd[:-1, :] |= paint[1:, :]
            pd[:, 1:] |= paint[:, :-1]; pd[:, :-1] |= paint[:, 1:]
            paint = pd
            ys, xs = np.where(paint)
            for y, x in zip(ys, xs):
                # inpaint from the nearest unpainted neighbor ring
                for radius in range(1, 6):
                    y0, y1 = max(0, y - radius), min(T, y + radius + 1)
                    x0, x1 = max(0, x - radius), min(T, x + radius + 1)
                    patch = a[y0:y1, x0:x1]
                    mask = ~paint[y0:y1, x0:x1]
                    if mask.sum():
                        a[y, x] = patch[mask].mean(axis=0)
                        break
            bases.append(a)
    return bases, d


def arrow_mask(kind, seed):
    """Pixel arrow on a TxT grid. kind: left/right/thru x v/h, twlt v/h."""
    m = np.zeros((T, T), bool)
    r = rng(seed)
    def shaft(cx, y0, y1, w=3):
        m[y0:y1, cx - w // 2:cx + (w + 1) // 2] = True
    def head_left(cx, y, l=7):
        m[y:y + 3, cx - l:cx] = True                        # elbow bar left
        for i in range(5):                                  # solid tip triangle
            m[y - 3 + i:y + 6 - i, cx - l - 4 + i] = True
    def head_right(cx, y, l=7):
        m[y:y + 3, cx:cx + l] = True
        for i in range(5):
            m[y - 3 + i:y + 6 - i, cx + l + 4 - i] = True
    def head_up(cx, y):
        for i in range(4):
            m[y - i, cx - (4 - i):cx + (4 - i) + 1] = True  # triangle
    if kind == 'arrow_left_v':
        shaft(26, 15, 32); head_left(26, 15)
    elif kind == 'arrow_right_v':
        shaft(18, 15, 32); head_right(18, 15)
    elif kind == 'arrow_thru_v':
        shaft(22, 14, 32); head_up(22, 13)
    elif kind == 'arrow_left_h':
        m2 = arrow_mask('arrow_left_v', seed); return m2.T[::-1, :].copy()
    elif kind == 'arrow_right_h':
        m2 = arrow_mask('arrow_right_v', seed); return m2.T[::-1, :].copy()
    elif kind == 'arrow_thru_h':
        m2 = arrow_mask('arrow_thru_v', seed); return m2.T[::-1, :].copy()
    elif kind == 'twlt_arrow_v':
        shaft(16, 9, 20); head_left(16, 9, 5)
        shaft(28, 26, 37); head_right(28, 31, 5)            # opposing pair
    elif kind == 'twlt_arrow_h':
        m2 = arrow_mask('twlt_arrow_v', seed); return m2.T[::-1, :].copy()
    return m


def weather(base, mask, seed):
    """Certified-style weathering: drop paint in dark cracks + seeded erosion,
    brightness in the certified white range with per-pixel variance."""
    r = rng(seed)
    out = base.copy()
    lum = base.mean(axis=2)
    ys, xs = np.where(mask)
    painted = 0
    for y, x in zip(ys, xs):
        if lum[y, x] < 55 and r() < 0.6:    # cracks eat paint
            continue
        if r() < 0.16:                       # general erosion
            continue
        v = 150 + int(r() * 70)              # certified white range, worn
        tint = int(r() * 12)
        out[y, x] = [min(255, v + tint), min(255, v + tint), v]
        painted += 1
    return out, painted


def verify(tile, base, mask, painted):
    a = tile.astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    yellow = ((r > 110) & (g > 80) & (b < 90) & (r - b > 40)).sum()
    purple = ((b > 100) & (r > 80) & (g < 70) & (b - g > 50) & (r - g > 30)).sum()
    if yellow:
        return 'YELLOW in an arrow tile (%d px): arrows are white, LINE COLOR LAW' % yellow
    if purple:
        return 'PURPLE (%d px): the reservation' % purple
    if not (PAINT_MIN <= painted <= PAINT_MAX):
        return 'paint budget %d outside certified range %d-%d' % (painted, PAINT_MIN, PAINT_MAX)
    outside = ~mask
    if not (tile[outside] == base[outside]).all():
        return 'base texture modified outside the arrow footprint'
    return None


def main():
    bases, src = load_bases()
    kinds = ['arrow_left_v', 'arrow_right_v', 'arrow_thru_v',
             'arrow_left_h', 'arrow_right_h', 'arrow_thru_h',
             'twlt_arrow_v', 'twlt_arrow_h']
    out = {'version': 'TURN_ARROW_CANDIDATES_v1', 'date': '2026-07-17',
           'status': 'UNJUDGED',
           'law_basis': ('arrows are lane-level markings: WHITE ONLY (LINE COLOR LAW). '
                         'TWLT center arrows are the opposing white pair; the yellow '
                         'borders live in the 7/14 TWLT line tiles. base asphalt: the '
                         'certified 7/14 candidates, paint erased. dual/triple pockets '
                         '= this arrow tile repeated per pocket lane (blockgen places).'),
           'source': 'BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt',
           'candidates': {}}
    n = 0
    for ki, kind in enumerate(kinds):
        tiles = []
        for v in range(6):
            base = bases[(ki * 6 + v) % len(bases)]
            mask = arrow_mask(kind, 7000 + ki * 101 + v)
            tile, painted = weather(base, mask, 9000 + ki * 131 + v * 17)
            err = verify(tile, base, mask, painted)
            if err:
                print('FACTORY REFUSES [%s v%d]: %s' % (kind, v, err))
                return 1
            buf = io.BytesIO()
            Image.fromarray(tile.astype(np.uint8)).save(buf, 'PNG')
            tiles.append(base64.b64encode(buf.getvalue()).decode())
            n += 1
        out['candidates'][kind] = tiles
    json.dump(out, open(OUT, 'w'))
    print('cooked %d arrow tiles (%d classes x 6 weathered variants) -> %s'
          % (n, len(kinds), OUT))
    print('every tile passed: white-only, purity, paint budget, base-faithful')
    return 0


if __name__ == '__main__':
    sys.exit(main())
