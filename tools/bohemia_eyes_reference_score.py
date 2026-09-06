#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS: THE REFERENCE SCORE (lane 17, E7, 9/5/26)

THE LAW IT SERVES: COMPARE EVERY PIECE OF ART TO THE WORLD BEFORE CALLING IT DONE
(9/4, LOCKED). The law says compare. It never said how to write down the answer, so
a comparison has been an opinion, and an opinion cannot be checked by the next chat.

TEN QUESTIONS, YES OR NO. SEVEN A MACHINE ANSWERS, THREE A PERSON DOES. A cook and
its reference go in; a score out of ten comes out, with the seven machine answers
computed and the three human ones printed as the questions to put to a fresh pair of
eyes. That is what turns "it looks close" into a measurement.

REUSE CHECK (the E1 lesson): gates/texture_match_gate.py already derives a ruler from
the packs Paolo BOUGHT and holds painted tiles to it -- colours per tile, edge energy,
grain, saturation. This does not re-measure those four for tiles; it generalises the
IDEA to any pair of images and adds the questions that gate does not ask (light,
grain SCALE, value band, read-at-play-size), so a garment, a face or a whole screen
can be scored against its own reference too.

USAGE:  python3 tools/bohemia_eyes_reference_score.py COOK.png REFERENCE.png
        python3 tools/bohemia_eyes_reference_score.py --bank BANK.txt:ID --bank BANK.txt:ID
"""
import sys, os, json, base64, io, math
import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'


def load(spec):
    """A file path, or BANK.txt:index / BANK.txt:id for art that lives in a bank."""
    if ':' in spec and not os.path.exists(spec):
        path, key = spec.rsplit(':', 1)
        d = json.load(open(os.path.join(REPO, path)))
        for k in ('tiles', 'sprites', 'frames', 'items', 'garments', 'faces', 'hair'):
            if isinstance(d.get(k), list):
                items = d[k]
                break
        else:
            raise SystemExit('no art list in ' + path)
        pick = None
        if key.isdigit():
            pick = items[int(key)]
        else:
            for it in items:
                if it.get('id') == key:
                    pick = it
                    break
        if pick is None or 'b64' not in pick:
            raise SystemExit('no b64 art at ' + spec)
        return Image.open(io.BytesIO(base64.b64decode(pick['b64']))).convert('RGB')
    return Image.open(spec).convert('RGB')


def arr(im):
    return np.asarray(im, dtype=np.float64)


def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def sat(a):
    mx, mn = a.max(axis=2), a.min(axis=2)
    return np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-9), 0.0)


def edge_energy(a):
    """Local contrast: the average step between neighbouring pixels."""
    l = lum(a)
    return float((np.abs(np.diff(l, axis=0)).mean() + np.abs(np.diff(l, axis=1)).mean()) / 2)


def colours_per_kpx(a):
    q = (a // 8).astype(int).reshape(-1, 3)
    uniq = len(set(map(tuple, q)))
    return 1000.0 * uniq / max(1, q.shape[0])


def grain_scale(a):
    """The size of the repeating structure: the first autocorrelation peak."""
    l = lum(a)
    l = l - l.mean()
    h, w = l.shape
    best, off = 0.0, 0
    for d in range(2, max(3, min(h, w) // 2)):
        A, B = l[:-d], l[d:]
        den = math.sqrt(float((A * A).sum()) * float((B * B).sum())) + 1e-9
        c = float((A * B).sum()) / den
        if c > best:
            best, off = c, d
    return off, round(best, 3)


def key_light(a):
    """Which corner is lit: the sign of the luminance gradient, as a compass step."""
    l = lum(a)
    h, w = l.shape
    top, bot = l[:h // 2].mean(), l[h // 2:].mean()
    left, right = l[:, :w // 2].mean(), l[:, w // 2:].mean()
    return ('upper' if top > bot else 'lower') + '-' + ('left' if left > right else 'right'), \
           round(float(abs(top - bot) + abs(left - right)), 2)


def read_at_play_size(a, px=24):
    """Downscale to the size the game shows it at and ask whether anything survives."""
    im = Image.fromarray(a.astype(np.uint8))
    small = arr(im.resize((px, px), Image.BILINEAR))
    l = lum(small)
    return round(float(l.max() - l.min()), 1)


def value_band(a):
    l = lum(a)
    return float(np.percentile(l, 5)), float(np.percentile(l, 95))


def overlap(b1, b2):
    lo = max(b1[0], b2[0]); hi = min(b1[1], b2[1])
    if hi <= lo:
        return 0.0
    span = max(b1[1] - b1[0], b2[1] - b2[0], 1e-9)
    return (hi - lo) / span


QUESTIONS_HUMAN = [
 "Is it the same MATERIAL? (a fresh pair of eyes names what each one is made of; if the "
 "two words differ, the cook is not the reference's material however close the numbers are)",
 "Does it belong to THIS world? (the 9/4 compare law's real question, and no machine "
 "answers it)",
 "What would a stranger call it in one word, for each picture? (if the two words differ, "
 "stop and look again)",
]


def score(cook, ref):
    A, B = arr(cook), arr(ref)
    out, passed = [], 0

    def q(name, ok, detail):
        nonlocal passed
        out.append({'q': name, 'pass': bool(ok), 'detail': detail})
        if ok:
            passed += 1

    ea, eb = edge_energy(A), edge_energy(B)
    q('same DETAIL ORDER (local contrast within 2.5x)',
      eb > 0 and 0.4 <= ea / eb <= 2.5, 'cook %.1f vs reference %.1f (%.2fx)' % (ea, eb, ea / max(eb, 1e-9)))

    ca, cb = colours_per_kpx(A), colours_per_kpx(B)
    q('same COLOUR DENSITY (colours per 1000 px within 3x)',
      cb > 0 and 0.33 <= ca / cb <= 3.0, 'cook %.1f vs reference %.1f' % (ca, cb))

    sa, sb = float(np.median(sat(A))), float(np.median(sat(B)))
    q('same SATURATION BUDGET (median within 0.10)',
      abs(sa - sb) <= 0.10, 'cook %.3f vs reference %.3f' % (sa, sb))

    va, vb = value_band(A), value_band(B)
    ov = overlap(va, vb)
    q('same VALUE BAND (5th-95th percentile overlaps 60%)',
      ov >= 0.60, 'cook %.0f-%.0f vs reference %.0f-%.0f, overlap %.0f%%' % (va[0], va[1], vb[0], vb[1], 100 * ov))

    ga, gb = grain_scale(A), grain_scale(B)
    q('same GRAIN SCALE (structure repeats at a similar size)',
      gb[0] > 0 and 0.5 <= ga[0] / gb[0] <= 2.0, 'cook every %dpx vs reference every %dpx' % (ga[0], gb[0]))

    ka, kb = key_light(A), key_light(B)
    q('same LIGHT (the lit corner agrees)', ka[0] == kb[0], 'cook %s vs reference %s' % (ka[0], kb[0]))

    ra, rb = read_at_play_size(A), read_at_play_size(B)
    q('still READS at play size (contrast survives the shrink, within 2x)',
      rb > 0 and 0.5 <= ra / rb <= 2.0, 'cook %.0f vs reference %.0f of 255' % (ra, rb))

    return out, passed


def main():
    args = [a for a in sys.argv[1:] if a != '--bank']
    if len(args) < 2:
        raise SystemExit(__doc__)
    cook, ref = load(args[0]), load(args[1])
    rows, passed = score(cook, ref)
    print('THE REFERENCE SCORE  --  %s  against  %s' % (os.path.basename(args[0]), os.path.basename(args[1])))
    print('-' * 78)
    for r in rows:
        print('  %s  %-52s %s' % ('YES' if r['pass'] else ' NO', r['q'], r['detail']))
    print('-' * 78)
    print('  MACHINE SCORE: %d of 7' % passed)
    print('  AND THE THREE ONLY A PERSON ANSWERS:')
    for i, h in enumerate(QUESTIONS_HUMAN, 8):
        print('   %2d. %s' % (i, h))
    print('  TOTAL IS OUT OF TEN. A cook is not done until the seven are yes and the three are asked.')


if __name__ == '__main__':
    main()
