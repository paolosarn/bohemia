#!/usr/bin/env python3
"""BOHEMIA BOLD MARKING FACTORY (7/17/26, evening)

Paolo's verdict on the first arrows at phone zoom: "Wtf is the purpose of
these lines" — the glyphs weathered into confetti. ROOT CAUSE: arrow strokes
at 2-3px eroded below legibility; the pocket line rendered mid-lane instead
of on the lane boundary. This cook fixes both:

  - BOLD GLYPHS: 5px shafts, 9px heads, solid 7-row tip triangles; erosion
    cut to a surface scuff (paint reads first, decay second)
  - EDGE LINES: pocket separation dashes sit ON the tile edge shared with the
    through lane (pocket_edge_* classes), where lane paint actually lives
  - still WHITE ONLY (LINE COLOR LAW), still on the certified erased bases

STATUS: UNJUDGED candidates. The intersection proof is the judging surface;
Paolo's eye on the proof rules them up or down. Never mixed into the approved
bank until then.

REUSE CHECK:
used BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt (the erased-base source
crops this cook re-strokes bolder; not a fresh ground-up cook - fixing the
approved base's legibility problem, not replacing the base).

Run from repo root: python3 tools/bohemia_marking_bold_factory.py
"""
import base64
import io
import json
import sys

import numpy as np
from PIL import Image

SRC = 'banks/BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt'
OUT = 'banks/BOHEMIA_MARKING_BOLD_CANDIDATES_7_17_26.txt'
T = 44
PAINT_MIN, PAINT_MAX = 60, 400


def rng(seed):
    s = seed & 0xffffffff
    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def load_bases():
    d = json.load(open(SRC))
    bases = []
    for key in ('pocket_line_v', 'pocket_line_h'):
        for b64 in d['candidates'][key]:
            a = np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')).astype(int)
            r, g, b = a[..., 0], a[..., 1], a[..., 2]
            sat = np.abs(r - b) + np.abs(r - g) + np.abs(g - b)
            paint = ((r > 105) & (g > 105) & (b > 95) & (sat < 90)) | \
                    ((r > 110) & (g > 80) & (b < 90) & (r - b > 40))
            pd = paint.copy()
            pd[1:, :] |= paint[:-1, :]; pd[:-1, :] |= paint[1:, :]
            pd[:, 1:] |= paint[:, :-1]; pd[:, :-1] |= paint[:, 1:]
            ys, xs = np.where(pd)
            for y, x in zip(ys, xs):
                for radius in range(1, 6):
                    y0, y1 = max(0, y - radius), min(T, y + radius + 1)
                    x0, x1 = max(0, x - radius), min(T, x + radius + 1)
                    patch = a[y0:y1, x0:x1]
                    mask = ~pd[y0:y1, x0:x1]
                    if mask.sum():
                        a[y, x] = patch[mask].mean(axis=0)
                        break
            bases.append(a)
    return bases


def glyph(kind):
    m = np.zeros((T, T), bool)
    def shaft_v(cx, y0, y1, w=5):
        m[y0:y1, cx - w // 2:cx + (w + 1) // 2] = True
    def tip_left(cx, y):
        for i in range(7):
            m[y - 5 + i:y + 6 - i, cx - 9 - 6 + i] = True
        m[y - 2:y + 3, cx - 9:cx] = True
    def tip_right(cx, y):
        for i in range(7):
            m[y - 5 + i:y + 6 - i, cx + 9 + 6 - i] = True
        m[y - 2:y + 3, cx:cx + 9] = True
    def tip_up(cx, y):
        for i in range(7):
            m[y - i, cx - (7 - i):cx + (7 - i) + 1] = True
    if kind == 'bold_left_h':          # EW road, arrow bends left of travel
        shaft_v(26, 12, 34); tip_left(26, 14)
    elif kind == 'bold_right_h':
        shaft_v(18, 12, 34); tip_right(18, 14)
    elif kind == 'bold_thru_h':
        shaft_v(22, 14, 36); tip_up(22, 12)
    elif kind.endswith('_v'):
        return glyph(kind[:-2] + '_h').T[::-1, :].copy()
    elif kind == 'edge_h':             # dashes on the tile's TOP edge
        for x0 in range(2, T - 2, 11):
            m[1:5, x0:x0 + 7] = True
    elif kind == 'edge_v':             # dashes on the tile's LEFT edge
        for y0 in range(2, T - 2, 11):
            m[y0:y0 + 7, 1:5] = True
    return m


def paint(base, mask, seed):
    r = rng(seed)
    out = base.copy()
    lum = base.mean(axis=2)
    painted = 0
    for y, x in zip(*np.where(mask)):
        if lum[y, x] < 45 and r() < 0.30:
            continue
        if r() < 0.08:
            continue
        v = 168 + int(r() * 60)
        tint = int(r() * 10)
        out[y, x] = [min(255, v + tint), min(255, v + tint), v]
        painted += 1
    return out, painted


def verify(tile, base, mask, painted):
    a = tile.astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    if ((r > 110) & (g > 80) & (b < 90) & (r - b > 40)).sum():
        return 'YELLOW: LINE COLOR LAW'
    if ((b > 100) & (r > 80) & (g < 70) & (b - g > 50) & (r - g > 30)).sum():
        return 'PURPLE'
    if not (PAINT_MIN <= painted <= PAINT_MAX):
        return 'paint budget %d outside %d-%d' % (painted, PAINT_MIN, PAINT_MAX)
    if not (tile[~mask] == base[~mask]).all():
        return 'base modified outside glyph'
    return None


def main():
    bases = load_bases()
    kinds = ['bold_left_h', 'bold_right_h', 'bold_thru_h',
             'bold_left_v', 'bold_right_v', 'bold_thru_v',
             'edge_h', 'edge_v']
    out = {'version': 'MARKING_BOLD_CANDIDATES_v1', 'date': '2026-07-17',
           'status': 'UNJUDGED (Paolo judges on the intersection proof)',
           'why': ('7/17 evening verdict on v1 arrows at phone zoom: illegible confetti. '
                   'Bold glyphs + edge-positioned pocket lines. White only.'),
           'candidates': {}}
    n = 0
    for ki, kind in enumerate(kinds):
        tiles = []
        for v in range(6):
            base = bases[(ki * 5 + v * 2) % len(bases)]
            mask = glyph(kind)
            tile, painted = paint(base, mask, 77000 + ki * 313 + v * 29)
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
    print('cooked %d bold tiles (%d classes x 6) -> %s' % (n, len(kinds), OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
