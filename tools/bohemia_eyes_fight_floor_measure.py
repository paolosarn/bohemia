#!/usr/bin/env python3
"""BOHEMIA -- [fight floor measured] ROUND TWO: the F2 (fine band) and F3 (never-ground colour
classes) measures, independently written from DIRECTION's own verdict spec (records/
BOHEMIA_FIGHT_VERDICT_ROUND_21_THE_FLOOR_10_1_26.md), reusing their published formulas so the
number means the same thing, proven on synthetic known-answer data (C2, C3) before it ever reads
a real screenshot.

usage: python3 tools/bohemia_eyes_fight_floor_measure.py '<rows json from the js driver>'
prints one JSON object to stdout: {"controls":[C2,C3], "bands":[[bx,by],...], "classes":[{...}]}
"""
import sys, json
import numpy as np
from PIL import Image

rows = json.loads(sys.argv[1])


def band(L):
    """F2: the share of spatial-frequency power above 0.25 cycles/px on each axis -- high
    frequency content is fine detail; a canvas blown up to coarse blocks loses it."""
    L = L - L.mean()
    P = np.abs(np.fft.fft2(L)) ** 2
    P[0, 0] = 0
    fy = np.abs(np.fft.fftfreq(L.shape[0]))[:, None]
    fx = np.abs(np.fft.fftfreq(L.shape[1]))[None, :]
    t = P.sum()
    if t <= 0:
        return 0.0, 0.0
    return float(P[(fx > 0.25) & (fy >= 0)].sum() / t), float(P[(fy > 0.25) & (fx >= 0)].sum() / t)


def classes(a):
    """F3: colour classes that never occur on honest ground art (DIRECTION's own thresholds,
    reused so the number is comparable): pale blue-ish pads, saturated red, near-white marks,
    green-dominant words. A lower bound by DIRECTION's own admission (dark ovals/diamonds escape
    it) -- this tool does not claim to improve on that, only to reproduce it independently."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1); s = (mx - mn) / np.maximum(mx, 1e-6)
    return {
        'pale pads': (b > r + 0.06) & (b > g + 0.01) & (b > 0.4),
        'red': (r > 0.4) & (r > 1.9 * g) & (r > 1.9 * b),
        'white marks': (s < 0.14) & (mx > 0.62),
        'green words': (g > r + 0.12) & (g > b + 0.08) & (mx > 0.5),
    }


# *** C2, BEFORE ANYTHING REAL: a flat mid-grey "ground" patch must fire NO class; a saturated red
# patch must fire ALMOST ENTIRELY as 'red' and nothing else. Caught nothing wrong the first time
# this was tried (both synthetic cases read correctly on the first cut), kept as a standing proof
# rather than removed, per this lane's own rule that a measuring tool is proven before it is trusted. ***
grey = np.full((40, 40, 3), 0.5)
red = np.zeros((40, 40, 3)); red[..., 0] = 0.8
c_grey = classes(grey); c_red = classes(red)
grey_clean = not any(v.any() for v in c_grey.values())
red_fires = c_red['red'].mean() > 0.95 and sum(v.mean() for k, v in c_red.items() if k != 'red') < 0.01
C2 = {'name': 'C2 THE CLASSIFIER KNOWS GROUND FROM A MARK',
      'pass': bool(grey_clean and red_fires),
      'detail': 'flat grey patch fired classes=' + json.dumps({k: bool(v.any()) for k, v in c_grey.items()})
                + '; saturated red patch read red=' + str(round(float(c_red['red'].mean()), 3))
                + ' (must be >0.95) with other classes at ' + str(round(sum(v.mean() for k, v in c_red.items() if k != 'red'), 4))}

# *** C3: a perfectly flat patch (zero spatial variance) must read band ~ 0 on both axes; a
# single-pixel checkerboard (the highest possible spatial frequency an image can carry) must read
# band close to 1 on both axes. ***
flat = np.zeros((64, 64))
cb = np.indices((64, 64)).sum(axis=0) % 2 * 1.0
bx_flat, by_flat = band(flat)
bx_cb, by_cb = band(cb)
C3 = {'name': 'C3 THE BAND READER KNOWS FINE FROM FLAT',
      'pass': bool(bx_flat < 0.01 and by_flat < 0.01 and bx_cb > 0.9 and by_cb > 0.9),
      'detail': 'flat patch band=(' + str(round(bx_flat, 4)) + ',' + str(round(by_flat, 4))
                + ') (must be ~0); checkerboard band=(' + str(round(bx_cb, 4)) + ',' + str(round(by_cb, 4)) + ') (must be ~1)'}

controls = [C2, C3]
result = {'controls': controls}
if C2['pass'] and C3['pass']:
    bands = []
    classlist = []
    for r in rows:
        a = np.asarray(Image.open(r['shot']).convert('RGB')).astype(float) / 255
        h, w, _ = a.shape
        L = a @ [0.299, 0.587, 0.114]
        # the board region: DIRECTION's own crop drops the top strip and bottom HUD bar; this
        # reuses the same fractional crop (330:1440 of 1923 tall at their profile) scaled to
        # whatever this walk's own canvas height actually is, rather than a hardcoded pixel range.
        y0, y1 = int(h * 330 / 1923), int(h * 1440 / 1923)
        bx, by = band(L[y0:y1, :])
        bands.append([round(bx, 4), round(by, 4)])
        C = classes(a)
        fake = np.zeros((h, w), bool)
        for v in C.values():
            fake |= v
        row = {k: round(100 * float(v.mean()), 2) for k, v in C.items()}
        row['fake_pct'] = round(100 * float(fake.mean()), 2)
        classlist.append(row)
    result['bands'] = bands
    result['classes'] = classlist
print(json.dumps(result))
