#!/usr/bin/env python3
"""BOHEMIA -- COOK [every town looks its own], THE SETTLEMENT SCREEN'S HALF: HOW ALIKE TWO TOWN PICTURES LOOK (10/25/26).
Rule 186(b) (Paolo 10/25: 'every settlement has to look unique and different a little bit; they can borrow from each other,
especially in the same tier... a settlement deep in the heart of the city should give more city vibes'). EYES 10/25w, line 106
of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md: 'IN THE TOWN one tier is still one picture: Cartel is the same yard as Mob
and Network, the same tan house, striped stall, tank, sandbags and fence; the camps are the same tents.'

LIKENESS of two pictures, 0 (nothing alike) to 1 (the same file), read off the pictures only, the way an eye compares two
screens it walked into:
  0.40 COLOUR   the share of the two pictures' pixels that fall in the same colour (CIELAB, 6 x 6 x 6 bins, the
                histograms' overlap)
  0.40 FORM     what stands where: the structural similarity of the two pictures' grey (SSIM, 7 px windows, at a fifth
                of the size, so a roof's shingles do not count and a roof does)
  0.20 LAYOUT   where the light and dark masses sit (the 16 x 8 grid's mean lightness, correlated)
THE CONTROL is EYES' own: the two pictures of one tier (town_0/town_1, camp_0/camp_1, fortress_0/fortress_1) that he and
EYES read as 'one picture'; a town's picture against the tier picture it replaces is a pair too.

  python3 tools/bohemia_cook_town_screen_likeness_10_25_26.py <a.webp> <b.webp> [...]   every pair of the pictures named
"""
import sys, itertools
import numpy as np
from PIL import Image

SMALL = (412, 218)


def lab(rgb):
    c = rgb.astype(np.float64) / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def load(path):
    im = Image.open(path).convert('RGB').resize(SMALL, Image.BILINEAR)
    return lab(np.asarray(im))


def hist(L):
    e = (np.linspace(0, 100, 7), np.linspace(-30, 30, 7), np.linspace(-30, 40, 7))
    h, _ = np.histogramdd(L.reshape(-1, 3), bins=e)
    return h / max(1, h.sum())


def ssim(a, b, w=7):
    from numpy.lib.stride_tricks import sliding_window_view as sw
    a = a[::2, ::2]; b = b[::2, ::2]
    A, Bv = sw(a, (w, w)), sw(b, (w, w))
    ma, mb = A.mean((-1, -2)), Bv.mean((-1, -2))
    va, vb = A.var((-1, -2)), Bv.var((-1, -2))
    cov = ((A - ma[..., None, None]) * (Bv - mb[..., None, None])).mean((-1, -2))
    c1, c2 = (0.01 * 100) ** 2, (0.03 * 100) ** 2
    s = ((2 * ma * mb + c1) * (2 * cov + c2)) / ((ma ** 2 + mb ** 2 + c1) * (va + vb + c2))
    return float(np.clip(s.mean(), 0, 1))


def grid(L):
    g = L[..., 0][: SMALL[1] // 8 * 8, : SMALL[0] // 16 * 16]
    return g.reshape(8, g.shape[0] // 8, 16, g.shape[1] // 16).mean((1, 3)).ravel()


def parts(La, Lb):
    colour = float(np.minimum(hist(La), hist(Lb)).sum())
    form = ssim(La[..., 0], Lb[..., 0])
    ga, gb = grid(La), grid(Lb)
    layout = float(np.clip(np.corrcoef(ga, gb)[0, 1], 0, 1)) if ga.std() > 1e-6 and gb.std() > 1e-6 else 1.0
    return colour, form, layout


def likeness(a, b):
    La, Lb = (load(a) if isinstance(a, str) else a), (load(b) if isinstance(b, str) else b)
    c, f, l = parts(La, Lb)
    return round(0.4 * c + 0.4 * f + 0.2 * l, 3), dict(colour=round(c, 3), form=round(f, 3), layout=round(l, 3))


if __name__ == '__main__':
    files = sys.argv[1:]
    cache = {f: load(f) for f in files}
    rows = []
    for a, b in itertools.combinations(files, 2):
        v, p = likeness(cache[a], cache[b]); rows.append((v, a, b, p))
    for v, a, b, p in sorted(rows, reverse=True):
        print('%.3f  %s ~ %s  %s' % (v, a.split('/')[-1], b.split('/')[-1], p))
