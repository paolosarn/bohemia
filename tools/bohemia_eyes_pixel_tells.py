#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS: THE TWO PIXEL TELLS NOBODY MEASURES (lane 17, E1, 9/5/26)

REUSE CHECK FIRST, because that is the law and because this lane's job is to find
what is NOT covered rather than to build a second one of something. The craft
machine already exists: gates/pixel_craft_gate.py holds SIX measures through
tools/bohemia_pixel_craft_audit.py -- orphan share, single-use colours, pixel block
size, pillow score, light agreement, cluster density. Nothing here re-measures any
of those.

WHAT IT DOES NOT HOLD, and the craft laws name both in their own sections:

  BANDING (law 5). Two bands of different colour running alongside each other for
  their whole length, so the eye sees a contour line that the artist did not draw.
  MEASURED HERE as: in two neighbouring rows, a run of colour A and a run of colour
  B that start and end within one pixel of each other and are at least four long --
  repeated down three or more consecutive rows. That is the shape of the fault: not
  "two colours touch" but "two colours travel together".

  JAGGIES AND DOUBLES (law 3). A line whose steps are irregular -- 1,3,1,2 instead
  of 2,2,2 -- or a step of one pixel sitting between two long runs, which reads as
  a nick in the edge. MEASURED HERE on the outline of the drawn shape, as the share
  of steps that break the run of their neighbours.

IT IS NOT A TASTE MACHINE, and that is the existing gate's rule, kept: these say
whether a piece was BUILT like pixel art, never whether it looks good.

USAGE:  python3 tools/bohemia_eyes_pixel_tells.py [--json OUT.json] [--limit N]
"""
import os, sys, json, glob, base64, io
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ART_KEYS = ('tiles', 'sprites', 'frames', 'items', 'garments', 'faces', 'hair')


def banks():
    """EVERY bank in the repo that holds base64 art, not the two the craft audit
    happens to name. The coverage gap is itself a finding."""
    out = []
    for f in sorted(glob.glob('banks/*.txt')) + sorted(glob.glob('banks/*.json')):
        try:
            d = json.load(open(f))
        except Exception:
            continue
        if not isinstance(d, dict):
            continue
        for k in ART_KEYS:
            v = d.get(k)
            if isinstance(v, list) and v and isinstance(v[0], dict) and 'b64' in v[0]:
                out.append((f, k, v))
                break
    return out


def rle(row):
    """(colour, start, length) for one row of pixels."""
    runs, s = [], 0
    for i in range(1, len(row) + 1):
        if i == len(row) or row[i] != row[s]:
            runs.append((row[s], s, i - s))
            s = i
    return runs


def banding(im, min_rows=6, min_run=3):
    """TWO BANDS FOLLOWING THE SAME PATH, which is what banding actually is.

    TWO WRONG VERSIONS CAME FIRST and both are written down, because a detector that
    reads 0.0% on a deliberately banded ramp is worse than no detector and this lane
    has already shipped that mistake once today.
      v1 keyed its streak on the run's exact start column, so a band marching
         diagonally broke its own streak every two rows.
      v2 looked for a DIFFERENT colour directly under a run. On a diagonal ramp the
         thing under a run is mostly the SAME colour, shifted, so it never fired.
    What banding IS: the boundary between colour 1 and colour 2 and the boundary
    between colour 2 and colour 3 running PARALLEL -- a constant gap, row after row,
    so the eye reads a stripe the artist never drew. So the gaps between consecutive
    colour boundaries are measured per row, and a band is a gap that stays the same
    (within one pixel) for six rows or more.
    """
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()
    # THE BACKGROUND IS NOT THE ART. A hair sheet is four views on a near-black
    # ground, and the first run of this measured the GROUND: stable gaps row after
    # row, 88% banding, on a sheet whose subject is a few hundred pixels of hair.
    # Any single opaque colour covering more than 40% of the picture is treated as
    # ground and dropped, the same way the craft audit drops transparent corners.
    # AND "MOST OF THE PICTURE" IS NOT ENOUGH TO CALL SOMETHING GROUND. The first
    # attempt at this dropped any colour over 40% and killed the detector's own bite
    # test, because the widest band of a five-band ramp is 40% of a small tile and is
    # THE ART. Ground is what SURROUNDS the subject: it must both cover a lot of the
    # picture AND own most of the border.
    from collections import Counter as _C
    counts = _C(px[x, y] for y in range(h) for x in range(w) if px[x, y][3] > 8)
    border = [px[x, 0] for x in range(w)] + [px[x, h - 1] for x in range(w)] + \
             [px[0, y] for y in range(h)] + [px[w - 1, y] for y in range(h)]
    ground = None
    if counts:
        c, n = counts.most_common(1)[0]
        if n > 0.40 * w * h and border.count(c) > 0.70 * len(border):
            ground = c
    gaps_by_row = []
    for y in range(h):
        row = [px[x, y] if (px[x, y][3] > 8 and px[x, y] != ground) else None for x in range(w)]
        runs = [r for r in rle(row) if r[0] is not None and r[2] >= min_run]
        edges = [s + l for _, s, l in runs[:-1]]              # where one colour ends
        gaps_by_row.append([edges[i + 1] - edges[i] for i in range(len(edges) - 1)])
    # THE SIGNATURE IS THE MEDIAN GAP, NOT THE EXACT LIST. A band marching across the
    # picture gains and loses a stripe at the edges every few rows, so an exact tuple
    # resets the streak constantly -- v3 scored a fully banded ramp at 6.2% for that
    # reason alone. The median survives a stripe entering or leaving.
    def sig_of(gaps):
        g = sorted(gaps)
        return g[len(g) // 2] if len(g) >= 2 else None

    banded_rows, run_len, prev = 0, 0, None
    for gaps in gaps_by_row:
        sig = sig_of(gaps)
        if sig is not None and prev is not None and abs(sig - prev) <= 1:
            run_len += 1
        else:
            run_len = 1
        prev = sig
        if run_len == min_rows:
            banded_rows += min_rows
        elif run_len > min_rows:
            banded_rows += 1
    drawn = sum(1 for y in range(h) for x in range(w) if px[x, y][3] > 8)
    return round(100.0 * banded_rows / max(1, h), 1), banded_rows, drawn


def jaggies(im):
    """The steps of the drawn edge, and how many of them break their neighbours."""
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()
    steps = []
    for y in range(h):
        xs = [x for x in range(w) if px[x, y][3] > 8]
        if not xs:
            continue
        steps.append(min(xs))
    if len(steps) < 6:
        return None
    runs = [l for _, _, l in rle(steps)]
    if len(runs) < 3:
        return None
    bad = 0
    for i in range(1, len(runs) - 1):
        a, b, c = runs[i - 1], runs[i], runs[i + 1]
        if b == 1 and a >= 3 and c >= 3:            # a nick between two long steps
            bad += 1
        elif abs(b - a) >= 2 and abs(b - c) >= 2:   # a step that agrees with neither side
            bad += 1
    return round(100.0 * bad / max(1, len(runs)), 1)


def look(im):
    band_pct, band_rows, drawn = banding(im)
    return {'banding_pct': band_pct, 'banding_rows': band_rows,
            'jaggy_pct': jaggies(im), 'drawn_px': drawn, 'size': list(im.size)}


def main():
    argv = sys.argv[1:]
    out = None
    if '--json' in argv:
        i = argv.index('--json'); out = argv[i + 1]; argv = argv[:i] + argv[i + 2:]
    limit = int(argv[argv.index('--limit') + 1]) if '--limit' in argv else 0
    rows, per_bank = [], []
    for path, key, items in banks():
        vals_b, vals_j, n = [], [], 0
        for t in items:
            if limit and n >= limit:
                break
            try:
                im = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
            except Exception:
                continue
            r = look(im)
            r['bank'] = os.path.basename(path); r['id'] = t.get('id', '?')
            rows.append(r); n += 1
            vals_b.append(r['banding_pct'])
            if r['jaggy_pct'] is not None:
                vals_j.append(r['jaggy_pct'])
        if not vals_b:
            continue
        per_bank.append({'bank': os.path.basename(path), 'pieces': n,
                         'banding_pct_mean': round(sum(vals_b) / len(vals_b), 1),
                         'jaggy_pct_mean': round(sum(vals_j) / len(vals_j), 1) if vals_j else None})
    per_bank.sort(key=lambda b: -b['banding_pct_mean'])
    print('%-46s %6s %9s %8s' % ('bank', 'pieces', 'banding%', 'jaggy%'))
    for b in per_bank:
        print('%-46s %6d %9.1f %8s' % (b['bank'][:46], b['pieces'], b['banding_pct_mean'],
                                       b['jaggy_pct_mean'] if b['jaggy_pct_mean'] is not None else '-'))
    if out:
        json.dump({'what': 'banding and jaggies across every bank that holds art',
                   'per_bank': per_bank, 'pieces': rows}, open(out, 'w'), indent=1)
        print('\nwrote', out, '(%d pieces)' % len(rows))


if __name__ == '__main__':
    main()
