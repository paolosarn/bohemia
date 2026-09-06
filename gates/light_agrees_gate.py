#!/usr/bin/env python3
"""
THE LIGHT AGREES GATE (COOK, [light agrees], 9/6/26)
    -- does a re-cooked tile agree with the tile it REPLACED about where the light is?

THE QUESTION IS EYES AND EARS' AND IT IS A GOOD ONE. E7 (9/5) put it plainly: the craft
gate checks the key light BY PAIRS WITHIN A FORM (wall_end_l brighter than wall_end_r),
which is the right test for a form; whether a tile agrees with THE TILE IT REPLACED is a
different question and nothing was asking it. This asks it.

*** THE ANSWER TO E7'S OWN FINDING IS NO, AND THAT IS THIS GATE'S FIRST JOB. ***
E7 reported ten of the forty-two act-1 tiles as "lit from a different corner than the
approved tile of the same name" -- road_0, road_1, road_2, road_centre, dirt,
garage_bottom, roof_slope, roof_hipTL, roof_hipBR, roof_deck -- and the board turned that
into a COOK line reading "fix the ten". Measured three ways before touching a pixel, NONE
OF THE TEN IS LIT FROM THE WRONG CORNER. Two things were wrong with the ruler:

  1. IT MEASURED PIXELS THE GAME NEVER DRAWS. key_light() converts to RGB, which turns
     every transparent pixel BLACK. roof_hipTL is a corner piece: 48.9% opaque, and the
     approved and re-cooked masks are IDENTICAL. Flattened to RGB it reads as a 67-unit
     gradient into the lower right, the single most alarming number in the report. On the
     pixels that are actually drawn its gradient is +3.86 against the approved +4.27 --
     the same direction, within a tenth.
  2. IT TAKES THE SIGN OF A DIFFERENCE WITH NO THRESHOLD. A road tile is deliberately
     flat top-to-bottom. roof_deck's vertical difference is 0.07 of 255 on one side and
     0.10 on the other -- one part in three thousand -- and the sign of that is a coin
     flip. Nine of the ten were flagged on an axis where one or both tiles carry no light
     direction at all.

AND THE PROOF THAT IT IS NOT MERELY NOISY BUT BACKWARDS: rank all 42 tiles by how far
apart the two banks' gradients ACTUALLY are (as a share of the tiles' own contrast) and
the flagged ten land at ranks 4, 5, 9, 20, 23, 27, 28, 35, 37 and 40 of 42. Six of the ten
sit in the bottom half. roof_hipBR, flagged, is the SECOND MOST SIMILAR pair in the whole
set at 0.016. The furthest apart, wall_0 at 0.311, was not flagged at all. The flag is not
a weak signal; it has no relationship to the quantity it names.

SO NO ART WAS CHANGED. Changing ten tiles to satisfy a sign test on invisible pixels is
the thing this repo forbids in as many words: fix the ruler, never the target (8/1).

WHAT THE GATE ACTUALLY HOLDS, and it is the question kept rather than the finding kept:
  1. Every tile's light DIRECTION agrees with the tile it replaced on every axis where
     both tiles have a direction to speak of. A real flip is red.
  2. No tile's gradient drifts further from its predecessor's than the worst one does
     today (a ratchet, pinned at wall_0's 0.311).
  3. The ruler itself is tested inside the gate, twice, so it cannot quietly stop working:
     a tile against its own vertical mirror MUST be caught, and a tile whose transparent
     region is filled with black MUST NOT be. The second is the exact bug above.

  python3 gates/light_agrees_gate.py
"""
import base64
import io
import json
import os
import sys

import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'

# The re-cook and the art it replaced. A pair here says "these two are the same tile at
# two ages"; add a pair when a bank replaces another, never to widen a red.
PAIRS = [
    ('banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt',
     'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'),
]

# A tile has a light DIRECTION on an axis only if the difference between its halves is
# worth this much of its own contrast. Below it the sign is noise: roof_deck's vertical
# difference is one part in three thousand of its own range.
DECIDED = 0.10
# How far the two ages of a tile may drift apart, as a share of their own contrast.
# RATCHET, pinned at today's worst (wall_0, 0.311, vertical: +2.17 against +5.92 -- the
# SAME direction, a weaker version of it). It may only ever come down.
PINNED_GAP = 0.312

_pass = 0
_fail = 0


def ok(name, cond, note=''):
    global _pass, _fail
    if cond:
        _pass += 1
        print('  ok   ' + name + ('   ' + note if note else ''))
    else:
        _fail += 1
        print('  FAIL ' + name + ('   ' + note if note else ''))


def tiles_of(path):
    d = json.load(open(os.path.join(REPO, path)))
    for key in ('tiles', 'sprites', 'frames', 'items'):
        v = d.get(key)
        if isinstance(v, list):
            return {t.get('id'): t for t in v if 'b64' in t}
        if isinstance(v, dict):
            return {k: {'b64': b} for k, b in v.items() if isinstance(b, str)}
    return {}


def gradients(im):
    """Vertical and horizontal half-differences and the tile's own spread.

    ON THE PIXELS THE GAME DRAWS. Everything transparent is excluded, because the colour
    stored under alpha=0 is never seen and reading it is what produced E7's loudest
    false positive."""
    a = np.asarray(im.convert('RGBA'), dtype=np.float64)
    m = a[..., 3] > 0
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    h, w = lum.shape
    rows = np.zeros_like(m)
    rows[:h // 2] = True
    cols = np.zeros_like(m)
    cols[:, :w // 2] = True

    def half(sel):
        v = lum[sel & m]
        return float(v.mean()) if v.size else 0.0

    sd = float(lum[m].std()) if m.any() else 0.0
    return half(rows) - half(~rows), half(cols) - half(~cols), (sd or 1.0)


def img(entry):
    return Image.open(io.BytesIO(base64.b64decode(entry['b64'])))


def compare(now_im, was_im):
    """-> (worst normalised gap, list of axes where the DIRECTION really flipped)."""
    av, ah, asd = gradients(now_im)
    bv, bh, bsd = gradients(was_im)
    sd = (asd + bsd) / 2.0
    flips = []
    for axis, (a, b) in (('vertical', (av, bv)), ('horizontal', (ah, bh))):
        if abs(a) / sd >= DECIDED and abs(b) / sd >= DECIDED and (a > 0) != (b > 0):
            flips.append('%s (now %+.2f, was %+.2f, on a tile whose spread is %.1f)'
                         % (axis, a, b, sd))
    return max(abs(av - bv), abs(ah - bh)) / sd, flips


def main():
    print('\nTHE LIGHT AGREES GATE')

    # ---- 3. THE RULER IS TESTED BEFORE IT IS TRUSTED -------------------------------
    # A checker that cannot fail is not a checker, and the ruler this replaces failed in
    # two specific ways. Both are reproduced here as fixtures.
    g = np.linspace(40, 200, 44)
    lit = np.repeat(g[:, None], 44, axis=1)                      # bright at the top
    flipped = lit[::-1]                                          # bright at the bottom
    def rgba(l, alpha=None):
        a = np.dstack([l, l, l, np.full_like(l, 255.0) if alpha is None else alpha])
        return Image.fromarray(a.astype(np.uint8), 'RGBA')
    _, flips = compare(rgba(flipped), rgba(lit))
    ok('the ruler catches a tile lit from the opposite side', len(flips) == 1,
       '(' + (flips[0] if flips else 'IT DID NOT, so every green below means nothing') + ')')

    # the same tile twice, but one of them has black under a transparent corner. This is
    # E7's roof_hipTL exactly, and it must NOT be reported.
    alpha = np.full((44, 44), 255.0)
    alpha[:22, :22] = 0
    blacked = lit.copy()
    blacked[:22, :22] = 0
    _, flips2 = compare(rgba(blacked, alpha), rgba(lit, alpha))
    ok('and it is not fooled by black stored under a transparent corner', len(flips2) == 0,
       '(this is roof_hipTL: 48.9% opaque, identical masks, and the pixels nobody '
       'sees read as a 67-unit gradient once alpha is flattened)')

    # ---- 1 and 2. THE REAL BANKS ---------------------------------------------------
    worst = []
    for now_path, was_path in PAIRS:
        now, was = tiles_of(now_path), tiles_of(was_path)
        shared = sorted(set(now) & set(was))
        ok('the pair is readable and shares tiles (%s)' % os.path.basename(now_path),
           len(shared) >= 10, '(%d shared of %d and %d)' % (len(shared), len(now), len(was)))
        flipped_tiles, gaps = [], []
        for k in shared:
            gap, flips = compare(img(now[k]), img(was[k]))
            gaps.append((gap, k))
            for f in flips:
                flipped_tiles.append('%s %s' % (k, f))
        gaps.sort(reverse=True)
        worst += gaps[:5]
        ok('*** no tile is lit from a different corner than the tile it replaced ***',
           not flipped_tiles,
           ('\n         ' + '\n         '.join(flipped_tiles)) if flipped_tiles
           else '(%d tiles, both axes, opaque pixels only)' % len(shared))
        ok('and no tile drifts further from its predecessor than %.3f' % PINNED_GAP,
           gaps[0][0] <= PINNED_GAP,
           '(worst is %s at %.3f)' % (gaps[0][1], gaps[0][0]))

    print('\n  the five furthest apart, for whoever raises this next:')
    for gap, k in sorted(worst, reverse=True)[:5]:
        print('    %-16s %.3f' % (k, gap))
    print('  E7 flagged ten tiles here. They rank 4, 5, 9, 20, 23, 27, 28, 35, 37 and 40')
    print('  of 42 by this measure, and the furthest apart of all was not among them.')

    print('\nTHE LIGHT AGREES GATE: %d passed, %d failed' % (_pass, _fail))
    return 1 if _fail else 0


if __name__ == '__main__':
    sys.exit(main())
