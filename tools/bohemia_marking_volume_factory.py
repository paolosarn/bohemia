#!/usr/bin/env python3
"""BOHEMIA MARKING VOLUME FACTORY (7/17/26)

APPROVAL UNLOCKS VOLUME. Paolo approved all 84 marking candidates (records/
BOHEMIA_MARKING_VERDICTS_7_17_26.txt), so every class goes to production
width. The volume rule: NEW GEOMETRY IS NEVER INVENTED after approval —

  - the 6 approved originals per class carry VERBATIM (byte-identical)
  - new variants re-dress APPROVED paint geometry: the approved tile's paint
    mask is lifted and transplanted onto a different certified asphalt base
    with fresh seeded weathering (erosion + crack-eating + brightness jitter)
  - arrow classes may also re-run the approved generator with fresh seeds
    (same masks, new weathering) — the generator itself is what was approved

SELF-VERIFICATION per tile (refuses to write on any failure):
  - color law: yellow appears ONLY in twlt line classes (direction separation);
    arrow + pocket classes are white-only; purple never
  - paint budget within the certified weathered range
  - base texture untouched outside the paint footprint

Output: banks/BOHEMIA_MARKING_BANK_7_17_26.txt — the production bank,
status APPROVED-VOLUME. The candidates stay banked as the judged record.

Run from repo root: python3 tools/bohemia_marking_volume_factory.py [width]
Default width: 16 variants per class (6 approved + 10 cooked).

REUSE CHECK:
used BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt (approved line geometry,
paint masks lifted verbatim).
used BOHEMIA_TURN_ARROW_CANDIDATES_7_17_26.txt (approved arrow geometry,
re-run with fresh seeds). No new geometry invented per the volume rule
above - this file is expansion of already-judged material, never a fresh
cook.
"""
import base64
import io
import json
import sys

import numpy as np
from PIL import Image

LINES = 'banks/BOHEMIA_TURN_MARKING_CANDIDATES_7_14_26.txt'
ARROWS = 'banks/BOHEMIA_TURN_ARROW_CANDIDATES_7_17_26.txt'
OUT = 'banks/BOHEMIA_MARKING_BANK_7_17_26.txt'
T = 44
PAINT_MIN, PAINT_MAX = 18, 200   # lines run sparser than arrows; one honest envelope
YELLOW_OK = {'twlt_v_L', 'twlt_v_R', 'twlt_h_T', 'twlt_h_B'}


def rng(seed):
    s = seed & 0xffffffff
    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def img_of(b64):
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')).astype(int)


def b64_of(a):
    buf = io.BytesIO()
    Image.fromarray(a.astype(np.uint8)).save(buf, 'PNG')
    return base64.b64encode(buf.getvalue()).decode()


def paint_masks(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    sat = np.abs(r - b) + np.abs(r - g) + np.abs(g - b)
    white = (r > 105) & (g > 105) & (b > 95) & (sat < 90)
    yellow = (r > 110) & (g > 80) & (b < 90) & (r - b > 40)
    return white, yellow


def erase(a):
    """Certified-base recovery: erase paint (dilated), inpaint from asphalt."""
    w, y = paint_masks(a)
    paint = w | y
    pd = paint.copy()
    pd[1:, :] |= paint[:-1, :]; pd[:-1, :] |= paint[1:, :]
    pd[:, 1:] |= paint[:, :-1]; pd[:, :-1] |= paint[:, 1:]
    out = a.copy()
    ys, xs = np.where(pd)
    for yy, xx in zip(ys, xs):
        for radius in range(1, 6):
            y0, y1 = max(0, yy - radius), min(T, yy + radius + 1)
            x0, x1 = max(0, xx - radius), min(T, xx + radius + 1)
            patch = a[y0:y1, x0:x1]
            mask = ~pd[y0:y1, x0:x1]
            if mask.sum():
                out[yy, xx] = patch[mask].mean(axis=0)
                break
    return out, pd


def transplant(src_tile, base, seed):
    """Approved paint geometry, fresh base, fresh weathering."""
    white, yellow = paint_masks(src_tile)
    r = rng(seed)
    out = base.copy()
    lum = base.mean(axis=2)
    painted = 0
    footprint = white | yellow
    for yy, xx in zip(*np.where(footprint)):
        if lum[yy, xx] < 55 and r() < 0.55:
            continue
        if r() < 0.18:
            continue
        if yellow[yy, xx]:
            v = 120 + int(r() * 60)
            out[yy, xx] = [v + 40, v + 10, max(0, v - 70)]
        else:
            v = 150 + int(r() * 70)
            tint = int(r() * 12)
            out[yy, xx] = [min(255, v + tint), min(255, v + tint), v]
        painted += 1
    return out, painted, footprint


def verify(cls, tile, base, footprint, painted):
    a = tile.astype(int)
    w, y = paint_masks(a)
    purple = ((a[..., 2] > 100) & (a[..., 0] > 80) & (a[..., 1] < 70) &
              (a[..., 2] - a[..., 1] > 50) & (a[..., 0] - a[..., 1] > 30)).sum()
    if purple:
        return 'PURPLE (%d px)' % purple
    if cls not in YELLOW_OK and y.sum() > 0:
        return 'YELLOW in a white-only class (%d px): LINE COLOR LAW' % y.sum()
    if not (PAINT_MIN <= painted <= PAINT_MAX):
        return 'paint budget %d outside %d-%d' % (painted, PAINT_MIN, PAINT_MAX)
    outside = ~footprint
    if not (tile[outside] == base[outside]).all():
        return 'base modified outside the paint footprint'
    return None


def main():
    width = int(sys.argv[1]) if len(sys.argv) > 1 else 16
    lines = json.load(open(LINES))
    arrows = json.load(open(ARROWS))
    sources = {}
    sources.update(lines['candidates'])
    sources.update(arrows['candidates'])

    # certified base pool: every candidate tile, paint erased
    bases = []
    for cls, tiles in sources.items():
        for b64 in tiles:
            base, _ = erase(img_of(b64))
            bases.append(base)

    out = {'version': 'BOHEMIA_MARKING_BANK_v1', 'date': '2026-07-17',
           'status': 'APPROVED-VOLUME (all source classes UP, Paolo 7/17; '
                     'volume = approved geometry re-weathered, no new shapes)',
           'verdict_record': 'records/BOHEMIA_MARKING_VERDICTS_7_17_26.txt',
           'sources': [LINES, ARROWS],
           'law_basis': ('yellow = direction separation, twlt line classes only; '
                         'white = lane-level (pockets, arrows); LINE COLOR LAW certified'),
           'classes': {}}
    total = 0
    for ci, (cls, tiles) in enumerate(sorted(sources.items())):
        prod = list(tiles)   # the approved six, verbatim
        need = max(0, width - len(prod))
        v = 0
        attempts = 0
        while v < need and attempts < need * 8:
            attempts += 1
            src = img_of(tiles[v % len(tiles)])
            base = bases[(ci * 7 + v * 3 + attempts) % len(bases)]
            tile, painted, fp = transplant(src, base, 40000 + ci * 977 + attempts * 61)
            err = verify(cls, tile, base, fp, painted)
            if err:
                continue   # re-roll the seed; the gate never bends
            prod.append(b64_of(tile))
            v += 1
        if v < need:
            print('FACTORY REFUSES [%s]: only %d/%d volume variants passed the gate'
                  % (cls, v, need))
            return 1
        out['classes'][cls] = prod
        total += len(prod)
        print('%-16s %d approved + %d cooked = %d' % (cls, len(tiles), v, len(prod)))
    json.dump(out, open(OUT, 'w'))
    print('VOLUME BANK: %d tiles across %d classes -> %s' % (total, len(out['classes']), OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
