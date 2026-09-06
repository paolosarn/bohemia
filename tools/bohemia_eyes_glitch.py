#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS: THE GLITCH DETECTORS (lane 17, E2, 9/5/26)

WHAT IT IS. The half of the glitch taxonomy a machine can already run, on a
screenshot, with no golden image and no human. Each detector answers ONE question
that the industry's own glitch lists name (EA SEED's CNN work, GlitchBench, and the
Lewis/Whitehead/Wardrip-Fruin taxonomy split of temporal and non-temporal failures),
translated into what our game actually is: 45-degree pixel art on a canvas, on a phone.

  1. DEAD FLAT PATCH   a big block of ONE exact colour inside the picture. In a
                       hand-painted 45-degree world that is a missing tile, an
                       unpainted hole, or a panel that never drew.
  2. TILE REPETITION   the same block pasted down a column. Measured by comparing
                       a strip against itself at every offset (autocorrelation),
                       and reporting the offset that matches best and how well.
  3. LETTERBOX         rows or columns of one colour along an edge: the picture
                       does not reach the glass it is drawn on.
  4. ONE-COLOUR SCREEN what a black rectangle looks like to a machine, so a
                       screen that rendered nothing can never pass as a screen.

IT NEVER JUDGES TASTE. A dead flat patch in a night sky is correct; the detector
reports it and the round decides. Numbers, then a person.

USAGE:  python3 tools/bohemia_eyes_glitch.py slices/eyes/*.png
        python3 tools/bohemia_eyes_glitch.py --json OUT.json slices/eyes/*.png
"""
import sys, os, json
from collections import Counter
import numpy as np
from PIL import Image


def load(path):
    im = Image.open(path).convert('RGB')
    return np.asarray(im)


def dead_flat_patches(a, block=48, min_blocks=6):
    """A block is DEAD if every pixel in it is the same exact colour. Neighbouring
    dead blocks of the same colour are one patch. Pixel art has flat areas on
    purpose, so the threshold is deliberately large: 6 blocks is 13,824 pixels."""
    h, w, _ = a.shape
    grid = {}
    for y in range(0, h - block + 1, block):
        for x in range(0, w - block + 1, block):
            b = a[y:y+block, x:x+block]
            if (b == b[0, 0]).all():
                grid[(x // block, y // block)] = tuple(int(v) for v in b[0, 0])
    seen, patches = set(), []
    for key in grid:
        if key in seen:
            continue
        colour, stack, cells = grid[key], [key], []
        seen.add(key)
        while stack:
            cx, cy = stack.pop()
            cells.append((cx, cy))
            for n in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
                if n in grid and n not in seen and grid[n] == colour:
                    seen.add(n); stack.append(n)
        if len(cells) >= min_blocks:
            xs = [c[0] for c in cells]; ys = [c[1] for c in cells]
            patches.append({'colour': colour, 'blocks': len(cells),
                            'pixels': len(cells) * block * block,
                            'box': [min(xs)*block, min(ys)*block, (max(xs)+1)*block, (max(ys)+1)*block]})
    patches.sort(key=lambda p: -p['blocks'])
    return patches


def repetition(a, min_period=48):
    """THE SAME BLOCK, PASTED, AND HOW A MACHINE KNOWS. A single best-matching
    offset is not enough: a grid of judge cards matches itself at one offset and is
    perfectly correct. What a copy-pasted city column has and a hand-built one does
    not is a LATTICE -- the picture matches itself at a period AND at two, three,
    four times that period. So every candidate period is scored by the MEAN of its
    harmonics, and the winner is reported with how many harmonics held up.

    Verified on our own corpus before it was trusted: the MAP screen, where the same
    apartment block is pasted down one column by eye, peaks at 96 px with harmonics
    at 288, 384, 480 and 576."""
    g = a.astype(np.float32).mean(axis=2)
    h, w = g.shape
    col = g[:, w // 4:3 * w // 4]
    col = col - col.mean(axis=0, keepdims=True)

    def corr(off):
        A, B = col[:-off], col[off:]
        den = np.sqrt(float((A * A).sum()) * float((B * B).sum())) + 1e-9
        return float((A * B).sum()) / den

    cache, best = {}, {'period_px': 0, 'lattice': 0.0, 'harmonics': 0}
    for p in range(min_period, h // 3, 8):
        scores, k = [], 1
        while p * k < h - 8 and k <= 5:
            if p * k not in cache:
                cache[p * k] = corr(p * k)
            scores.append(cache[p * k]); k += 1
        if len(scores) < 3:
            continue
        m = float(np.mean(scores))
        if m > best['lattice']:
            best = {'period_px': p, 'lattice': round(m, 3), 'harmonics': len(scores)}
    return best


def letterbox(a, tol=2):
    """Rows or columns at an edge that are one flat colour: the picture does not
    reach the glass. Counted from each side until a row stops being flat."""
    def flat_run(rows):
        n = 0
        for r in rows:
            if int(r.max()) - int(r.min()) <= tol and (r[:, 0].std() + r[:, 1].std() + r[:, 2].std()) < 1.5:
                n += 1
            else:
                break
        return n
    h, w, _ = a.shape
    return {'top': flat_run(a), 'bottom': flat_run(a[::-1]),
            'left': flat_run(np.transpose(a, (1, 0, 2))),
            'right': flat_run(np.transpose(a, (1, 0, 2))[::-1])}


def one_colour_screen(a):
    """What a black rectangle looks like to a machine."""
    q = (a // 16).reshape(-1, 3)
    c = Counter(map(tuple, q[::37]))                       # sampled, this is a shape question
    top, n = c.most_common(1)[0]
    return {'dominant_share': round(100.0 * n / len(q[::37]), 1),
            'distinct_colours_sampled': len(c)}


def look(path):
    a = load(path)
    h, w, _ = a.shape
    patches = dead_flat_patches(a)
    return {
        'file': os.path.basename(path), 'size': [w, h],
        'dead_flat_patches': patches[:4],
        'dead_flat_share_pct': round(100.0 * sum(p['pixels'] for p in patches) / (w * h), 1),
        'repetition': repetition(a),
        'letterbox_px': letterbox(a),
        'colour': one_colour_screen(a),
    }


if __name__ == '__main__':
    argv = sys.argv[1:]
    out = None
    if '--json' in argv:
        i = argv.index('--json'); out = argv[i + 1]; argv = argv[:i] + argv[i + 2:]
    args = [x for x in argv if not x.startswith('--')]
    rows = [look(p) for p in args]
    if out:
        json.dump({'what': 'the glitch detectors that need no golden image', 'rows': rows},
                  open(out, 'w'), indent=1)
    for r in rows:
        flags = []
        if r['dead_flat_share_pct'] > 12: flags.append('DEAD FLAT %.0f%%' % r['dead_flat_share_pct'])
        if r['repetition']['lattice'] > 0.12: flags.append('LATTICE every %dpx (%.2f over %d harmonics)'
            % (r['repetition']['period_px'], r['repetition']['lattice'], r['repetition']['harmonics']))
        lb = r['letterbox_px']
        for side in ('top', 'bottom', 'left', 'right'):
            if lb[side] > 24: flags.append('%s band %dpx' % (side.upper(), lb[side]))
        if r['colour']['dominant_share'] > 85: flags.append('ONE COLOUR %.0f%%' % r['colour']['dominant_share'])
        print('%-34s %s' % (r['file'], ' | '.join(flags) if flags else 'clean'))
