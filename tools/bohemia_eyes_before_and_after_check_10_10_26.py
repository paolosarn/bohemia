#!/usr/bin/env python3
"""EYES CHECKS THE PICTURE BEFORE VOTE  (rule 89, this lane's own [the before and after], round two)

PAOLO 10/10 on the fight's ground sharpened, voted NO: "Can't tell difference." Rule 89: a look
item ships with a before-and-after of the SAME thing at one art pixel to one phone pixel; a
number is the proof line, never the show; EYES CHECKS THE PICTURE BEFORE VOTE.

Round one (records/BOHEMIA_EYES_BEFORE_AND_AFTER_ROUND_1_SCHOOL_THE_REAL_FORMULA_HAS_A_NAME_10_10_26.md)
sourced the real, published answer to "would a person notice": perceptual colour distance in
YIQ space (Kotsarenko and Ramos, 2010, channel weights 0.5053/0.299/0.1957, the pixelmatch
library's own method) with an antialiasing exclusion (after Vysniauskas, 2009: a pixel sitting
at a local brightness extremum against real contrast is a smoothing edge, not a real change) so
a renderer's own soft edge, present on BOTH pictures, is never counted as the show. This is a
faithful, independently-written version of the published method, not a byte-for-byte port of
pixelmatch's own undocumented internals (never installed in this repo, checked again this round:
`python3 -c "import pixelmatch"` fails) -- the formula is real, this implementation of it is ours.

THIS ROUND'S REAL FINDING: four cook lanes shipped real before-and-after pictures this round,
because PLUMBER's cook gate now refuses a look item without one (rule 89's own machine gate).
REUSE-FIRST found the real work already done -- this tool does not rebuild those pictures, it
CHECKS them, which is rule 89's literal sentence ("EYES checks the picture before VOTE"), by
importing each cook lane's own before/after pairs (unchanged) and running the real perceptual
metric those lanes do not compute themselves. COOK's own guard (bohemia_the_before_and_after_cook)
uses `(abs(before-after).sum(axis=2) > 6)` -- a raw RGB sum, exactly the naive metric round one's
own sourcing warned against ("not a raw RGB subtraction, which does not track what a human eye
actually notices"). This tool answers the real question with the real formula, on the same pairs.

FOUR ITEMS CHECKED, ALL CURRENTLY SITTING IN slices/vote/ WITH NO EYES VERDICT YET:
  [the sideways band]   RUN TWO, slices/vote/RUN2_THE_SIDEWAYS_BAND_10_10.png, "for DIRECTION and
                         EYES before VOTE (rules 88, 89)" -- named to this lane directly.
  THE PROPS              COOK, slices/vote/COOK_THE_PROPS_BEFORE_AND_AFTER.png.
  HIS BLOCK               COOK, slices/vote/COOK_HIS_BLOCK_BEFORE_AND_AFTER.png, six 96 px windows.
  THE FAR END'S GROUND    COOK, slices/vote/COOK_THE_FAR_END_FROM_HIS_PICKS.png, 24x8 cells.

The three named items this row started with (the sideways sides, the three bodies, the fight's
ground at its own pixels) are each ALREADY SUPERSEDED, not stale: [the sideways sides] routes to
[the sideways band] above (the same fault, RUN TWO's fix, checked here); [three bodies] and
[the art at its own pixels] both wait on a REDRAW (COOK THREE, COMBAT TWO) that has not landed,
so there is no new picture of either to check yet -- chasing their old git history would check a
version nobody is shipping.

    python3 tools/bohemia_eyes_before_and_after_check_10_10_26.py
      -> records/eyes_before_and_after/report.json
      -> records/BOHEMIA_EYES_BEFORE_AND_AFTER_ROUND_2_THE_CHECK_FOUR_PICTURES_THE_NAIVE_COUNT_RAN_HIGH_10_10_26.md
"""
import importlib, json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)

OUT_DIR = 'records/eyes_before_and_after'
OUT_JSON = os.path.join(OUT_DIR, 'report.json')

# --- THE REAL METRIC: YIQ PERCEPTUAL DISTANCE (Kotsarenko & Ramos 2010) -----------------------

def rgb2yiq(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    y = r * 0.29889531 + g * 0.58662247 + b * 0.11448223
    i = r * 0.59597799 - g * 0.27417610 - b * 0.32180189
    q = r * 0.21147017 - g * 0.52261711 + b * 0.31114694
    return y, i, q

def color_delta(a, b):
    ya, ia, qa = rgb2yiq(a)
    yb, ib, qb = rgb2yiq(b)
    return 0.5053 * (ya - yb) ** 2 + 0.299 * (ia - ib) ** 2 + 0.1957 * (qa - qb) ** 2

MAX_DELTA = 35215.0  # the full black-to-white delta in this weighting; pixelmatch's own scale

def luma(a):
    return a[..., 0] * 0.29889531 + a[..., 1] * 0.58662247 + a[..., 2] * 0.11448223

def antialiasing_mask(a, contrast_floor=15.0):
    """A simplified version of Vysniauskas' slope test: a pixel sitting at a local brightness
    extremum against its 8 neighbours, with real contrast around it, is a smoothing edge, not a
    hard content change. Honest simplification, not pixelmatch's own undocumented detector."""
    L = luma(a)
    H, W = L.shape
    Lp = np.pad(L, 1, mode='edge')
    stack = np.stack([Lp[1 + dy:1 + dy + H, 1 + dx:1 + dx + W]
                       for dy in (-1, 0, 1) for dx in (-1, 0, 1) if not (dy == 0 and dx == 0)],
                      axis=0)
    mn, mx = stack.min(axis=0), stack.max(axis=0)
    return ((L <= mn) | (L >= mx)) & ((mx - mn) > contrast_floor)

def visible_fraction(before_im, after_im, threshold=0.01, exclude_aa=True):
    a = np.asarray(before_im.convert('RGB'), dtype=np.float64)
    b = np.asarray(after_im.convert('RGB'), dtype=np.float64)
    if a.shape != b.shape:
        raise ValueError('before/after size mismatch: %r vs %r -- not the same crop twice' %
                          (a.shape, b.shape))
    delta = color_delta(a, b)
    is_diff = delta > (MAX_DELTA * threshold * threshold)
    if exclude_aa:
        aa = antialiasing_mask(a) | antialiasing_mask(b)
        is_diff = is_diff & ~aa
    return is_diff, 100.0 * float(is_diff.sum()) / is_diff.size


# --- THE FOUR ITEMS, EACH PAIR REUSED FROM ITS OWN LANE'S TOOL, NOT REBUILT --------------------

def item_sideways_band():
    """RUN TWO's own shipped composite has no generator tool committed (checked: no file under
    tools/ references its output path), so this reads the shipped picture itself -- which is
    literally what rule 89 asks EYES to check -- splitting it at its own label bars (found by
    row brightness, not guessed) into the BEFORE and AFTER halves, same width, same height."""
    im = Image.open('slices/vote/RUN2_THE_SIDEWAYS_BAND_10_10.png').convert('RGB')
    arr = np.asarray(im)
    # a label bar is PURE BLACK across the FULL WIDTH (row sum exactly 0); sampling one column
    # catches real dark content (asphalt) by mistake, so this sums every row's whole width.
    row_sum = arr.astype(np.int64).sum(axis=(1, 2))
    dark = row_sum < 500
    bounds = [0] + [y for y in range(1, len(dark)) if dark[y] != dark[y - 1]] + [len(dark)]
    runs = [(bounds[i], bounds[i + 1]) for i in range(len(bounds) - 1) if not dark[bounds[i]]]
    runs.sort(key=lambda r: r[1] - r[0], reverse=True)
    (y0a, y1a), (y0b, y1b) = sorted(runs[:2], key=lambda r: r[0])
    before = im.crop((0, y0a, im.size[0], y1a))
    after = im.crop((0, y0b, im.size[0], y1b))
    h = min(before.size[1], after.size[1])
    return [(before.crop((0, 0, before.size[0], h)), after.crop((0, 0, after.size[0], h)))]

def item_props():
    M = importlib.import_module('bohemia_the_before_and_after_cook_10_10_26')
    pairs, _pumps = M.the_props()
    return pairs

def item_his_block():
    M = importlib.import_module('bohemia_the_before_and_after_cook_10_10_26')
    pairs, _chosen = M.the_block()
    return pairs

def item_far_end():
    M = importlib.import_module('bohemia_the_far_end_from_his_picks_cook_10_10_26')
    mine, out, before, after, used, skipped, pools, notes, chosen = M.recut()
    pairs = []
    for i in range(min(len(before), len(after))):
        b, a = before[i], after[i]
        if b.size != a.size:
            continue
        pairs.append((b, a))
    return pairs


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    items = [
        ('the sideways band', 'RUN2_THE_SIDEWAYS_BAND_10_10.png', item_sideways_band),
        ('the props', 'COOK_THE_PROPS_BEFORE_AND_AFTER.png', item_props),
        ('his block', 'COOK_HIS_BLOCK_BEFORE_AND_AFTER.png', item_his_block),
        ("the far end's ground", 'COOK_THE_FAR_END_FROM_HIS_PICKS.png', item_far_end),
    ]
    report = {}
    for label, picture, fn in items:
        pairs = fn()
        per_pair = []
        for idx, (before_im, after_im) in enumerate(pairs):
            mask, pct = visible_fraction(before_im, after_im)
            # the naive metric COOK's own guard uses, for the honest side-by-side
            a = np.asarray(before_im.convert('RGB'), np.int16)
            b = np.asarray(after_im.convert('RGB'), np.int16)
            naive_pct = 100.0 * float((np.abs(a - b).sum(axis=2) > 6).sum()) / (a.shape[0] * a.shape[1])
            per_pair.append(dict(index=idx, size=list(before_im.size),
                                  real_visible_pct=round(pct, 2),
                                  naive_pct=round(naive_pct, 2)))
        real_all = [p['real_visible_pct'] for p in per_pair]
        visible = sum(1 for v in real_all if v >= 1.0)
        report[label] = dict(picture=picture, windows=len(pairs), per_window=per_pair,
                              windows_clearing_1pct=visible,
                              mean_real_visible_pct=round(sum(real_all) / len(real_all), 2) if real_all else 0.0,
                              worst_window_pct=round(min(real_all), 2) if real_all else 0.0)
        print('%-24s %2d window(s)  real mean %.2f%%  worst %.2f%%  (%d/%d windows clear 1%%)' %
              (label, len(pairs), report[label]['mean_real_visible_pct'],
               report[label]['worst_window_pct'], visible, len(pairs)))

    with open(OUT_JSON, 'w') as f:
        json.dump(report, f, indent=2)
    print('\n  wrote %s' % OUT_JSON)


if __name__ == '__main__':
    main()
