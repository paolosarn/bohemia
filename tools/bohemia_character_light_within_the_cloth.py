#!/usr/bin/env python3
"""CHARACTER [lit from below] -- the light read INSIDE each cloth, so a dark hat over a pale skirt is not a light.

    python3 tools/bohemia_character_light_within_the_cloth.py                 # the fight sheets' standing frames
    python3 tools/bohemia_character_light_within_the_cloth.py --rig           # the rig renders of the thirteen
    python3 tools/bohemia_character_light_within_the_cloth.py --json OUT.json

Reads only (rule 100: cook only). MODS 2d9f2d9 measured four looks lit from BELOW on most frames (satchel 68/68,
colorful 66, caravans 62, church 45) with the 7/27 audit's light angle: the luminance-weighted direction across the
WHOLE sprite. On a person that sum is dominated by WHICH colours sit where (dark hair up top, pale trousers below)
before it sees any shading. This tool splits a frame into its materials (opaque pixels grouped by hue and chroma,
value left free so a ramp stays one material), takes the brightness gradient inside each material only, and sums
the materials' gradients weighted by pixel count. Same convention as the audit: 270 is straight up, 180 is left;
180 to 360 is light from above.
"""
import os, sys, json, math, glob
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FP = os.path.join(ROOT, 'slices', 'fight_people')
RIG = os.path.join(ROOT, 'records', 'target', 'character', 'rig')
LYING = ('sleep', 'floor-rise', 'crawl-dying')


def lum(rgb):
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def materials(rgb, m):
    """label each opaque pixel by material: 12 hue sectors x 2 chroma bands, greys as one; value is ignored."""
    r, g, b = [rgb[..., i] / 255.0 for i in range(3)]
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    c = mx - mn
    h = np.zeros_like(mx)
    nz = c > 1e-6
    rr, gg, bb = (mx == r) & nz, (mx == g) & nz & (mx != r), (mx == b) & nz & (mx != r) & (mx != g)
    h[rr] = ((g - b)[rr] / c[rr]) % 6
    h[gg] = (b - r)[gg] / c[gg] + 2
    h[bb] = (r - g)[bb] / c[bb] + 4
    sat = np.where(mx > 0, c / np.maximum(mx, 1e-6), 0)
    lab = (np.floor(h * 2).astype(int) % 12) * 2 + (sat > 0.45)
    lab[sat < 0.12] = 99
    lab[~m] = -1
    return lab


def whole_angle(rgb, m):
    ys, xs = np.nonzero(m)
    if len(xs) < 8:
        return None
    L = lum(rgb)[m]
    gx = ((xs - xs.mean()) * (L - L.mean())).sum(); gy = ((ys - ys.mean()) * (L - L.mean())).sum()
    return (math.degrees(math.atan2(gy, gx)) + 360) % 360


STEP = 40   # a neighbour more than this many value steps away is another surface (hair against a coat), not a ramp


def within_angle(rgb, m):
    """the light read between NEIGHBOURS ON ONE SURFACE: each pixel pair one step apart, both the same material and
    under STEP apart in value, adds its brightness step to the gradient. A first cut that summed each material's whole
    moment was fooled the same way the audit is: dark hair and a brown coat share a hue, so the hair counted as the
    coat's dark top (measured on cast_longcoat: the coat's material ran 15 at the crown to 103 at the hem)."""
    lab = materials(rgb, m); L = lum(rgb)
    def pairs(a, b, la, lb):
        ok = (la >= 0) & (la == lb) & (np.abs(b - a) < STEP)
        return (b - a)[ok].sum(), int(ok.sum())
    GY, ny = pairs(L[:-1], L[1:], lab[:-1], lab[1:])        # + = brighter going DOWN the screen
    GX, nx = pairs(L[:, :-1], L[:, 1:], lab[:, :-1], lab[:, 1:])  # + = brighter going right
    if ny + nx == 0 or (GX == 0 and GY == 0):
        return None, 0
    return (math.degrees(math.atan2(GY, GX)) + 360) % 360, ny + nx


def above(a):
    return a is None or 180 <= a <= 360 or a == 0


def frame(img):
    a = np.asarray(img.convert('RGBA')).astype(float)
    m = a[..., 3] > 127
    return a[..., :3], m


def sheets():
    d = json.load(open(os.path.join(FP, 'fight_people.json')))
    F, rows, cols = d['frame'], d['rows'], d['cols']
    for key, lk in d['looks'].items():
        s = Image.open(os.path.join(FP, lk['file']))
        out = []
        for ri, r in enumerate(rows):
            for ci, c in enumerate(cols):
                if c.split('@')[0] in LYING:
                    continue
                rgb, m = frame(s.crop((ci * F, ri * F, ci * F + F, ri * F + F)))
                if m.sum() < 8:
                    continue
                out.append(('%s %s' % (r, c), rgb, m))
        yield key, out


def rigs():
    for d in sorted(glob.glob(os.path.join(RIG, '*'))):
        fs = sorted(glob.glob(os.path.join(d, '*.png')))
        out = []
        for f in fs:
            rgb, m = frame(Image.open(f))
            if m.sum() >= 8:
                out.append((os.path.basename(f), rgb, m))
        if out:
            yield os.path.basename(d), out


def main():
    src = rigs() if '--rig' in sys.argv else sheets()
    res = {}
    for key, frames in src:
        w = [whole_angle(rgb, m) for _, rgb, m in frames]
        i = [within_angle(rgb, m)[0] for _, rgb, m in frames]
        res[key] = {'frames': len(frames),
                    'whole_below': sum(1 for a in w if not above(a)),
                    'within_below': sum(1 for a in i if not above(a)),
                    'within_median_deg': round(float(np.median([a for a in i if a is not None])), 1) if any(a is not None for a in i) else None,
                    'within_below_frames': [n for (n, _, _), a in zip(frames, i) if not above(a)][:12]}
        r = res[key]
        print('%-20s frames %3d   whole-sprite below %3d   within-the-cloth below %3d   median %s'
              % (key, r['frames'], r['whole_below'], r['within_below'], r['within_median_deg']))
    if '--json' in sys.argv:
        json.dump(res, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1)


if __name__ == '__main__':
    main()
