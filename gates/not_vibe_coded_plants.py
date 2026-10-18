"""Planted sprites for the NOT VIBE CODED gate's self-tests (10/18/26, PLUMBER). Each is drawn here from a
seeded rule so the gate proves every check passes the made shape and fails the vibe-coded one. These are test
fixtures: nothing here is art, nothing here ships, and gates/ sits outside the art pipe fence's sweep (tools/)."""
import colorsys
import numpy as np
from PIL import Image

W = 64


def _ramp(h0, h1, n=4):
    """a hue-shifted ramp: dark is cooler, light is warmer (h in degrees)."""
    out = []
    for i in range(n):
        t = i / (n - 1.0)
        h = (h0 + (h1 - h0) * t) % 360
        r, g, b = colorsys.hsv_to_rgb(h / 360.0, 0.55 - 0.15 * t, 0.22 + 0.7 * t)
        out.append((int(r * 255), int(g * 255), int(b * 255)))
    return out


def _silhouette():
    y, x = np.mgrid[0:W, 0:W]
    body = ((x - 32) / 18.0) ** 2 + ((y - 40) / 20.0) ** 2 <= 1
    head = ((x - 32) / 9.0) ** 2 + ((y - 14) / 9.0) ** 2 <= 1
    return body | head


def made(light=(-1, -1), ramp=None):
    """one light, a hue-shifted ramp in flat clusters, a 1 px outline, one busy focal patch."""
    ramp = ramp or _ramp(10, 45)
    m = _silhouette()
    y, x = np.mgrid[0:W, 0:W]
    proj = ((x - 32) * light[0] + (y - 32) * light[1]) / 40.0  # -1 .. 1 toward the light
    step = np.clip(((proj + 1.1) / 1.6 * 3).astype(int), 0, 2) + 1
    img = np.zeros((W, W, 4), np.uint8)
    for i in (1, 2, 3):
        img[(step == i) & m, :3] = ramp[i]
    # a focal patch: the face, busy on purpose
    fx = (x >= 26) & (x < 38) & (y >= 9) & (y < 19) & m
    img[fx & ((x // 2 + y // 2) % 2 == 0), :3] = ramp[1]
    img[fx & ((x // 2 + y // 2) % 3 == 0), :3] = ramp[3]
    img[m, 3] = 255
    # outline: darkest step on the silhouette's edge
    p = np.pad(m, 1)
    edge = m & ~(p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:])
    img[edge, :3] = ramp[0]
    return Image.fromarray(img, 'RGBA')


def mixels():
    """the left half drawn at 1 px, the right half the same art scaled up 2x: two pixel sizes in one sprite."""
    rng = np.random.default_rng(7)
    a = np.asarray(made()).copy()
    small = rng.integers(0, 4, (W // 2, W // 4))
    pal = np.array(_ramp(10, 45))
    big = np.kron(small, np.ones((2, 2), int))
    m = a[..., 3] > 0
    for yy in range(W):
        for xx in range(W):
            if not m[yy, xx]:
                continue
            if xx < W // 2:
                a[yy, xx, :3] = pal[rng.integers(0, 4)]
            else:
                a[yy, xx, :3] = pal[big[yy, xx - W // 2]]
    return Image.fromarray(a, 'RGBA')


def smooth():
    """thousands of colours: a smooth radial gradient over the silhouette."""
    m = _silhouette(); y, x = np.mgrid[0:W, 0:W]
    img = np.zeros((W, W, 4), np.uint8)
    img[..., 0] = np.clip(x * 4, 0, 255); img[..., 1] = np.clip(y * 4, 0, 255); img[..., 2] = (x * y) % 256
    img[..., 3] = m * 255
    return Image.fromarray(img, 'RGBA')


def lit_from_below():
    return made(light=(1, 1))


def straight_dark():
    """every ramp is the base colour darkened: the shade() function's signature."""
    base = np.array([200, 120, 60])
    return made(ramp=[tuple(int(c) for c in base * k) for k in (0.3, 0.5, 0.75, 1.0)])


def noise_everywhere():
    """the same detail on every block: a random pick of the ramp per pixel, no rest area."""
    rng = np.random.default_rng(3)
    a = np.asarray(made()).copy(); m = a[..., 3] > 0
    pal = np.array(_ramp(10, 45))
    idx = rng.integers(0, 4, (W, W))
    a[m, :3] = pal[idx[m]]
    return Image.fromarray(a, 'RGBA')


def box():
    img = np.zeros((W, W, 4), np.uint8); img[4:60, 4:60] = (120, 90, 70, 255)
    img[4:60, 4] = img[4:60, 59] = img[4, 4:60] = img[59, 4:60] = (40, 30, 50, 255)
    return Image.fromarray(img, 'RGBA')


def one_value():
    a = np.asarray(made()).copy(); m = a[..., 3] > 0
    a[m, :3] = (128, 120, 110); a[m & (np.arange(W)[None, :] % 9 == 0), :3] = (132, 124, 114)
    return Image.fromarray(a, 'RGBA')


def salted():
    """the made sprite with stray single pixels sprinkled through it."""
    rng = np.random.default_rng(11)
    a = np.asarray(made()).copy(); m = a[..., 3] > 0
    ys, xs = np.nonzero(m)
    pick = rng.choice(len(ys), 60, replace=False)
    a[ys[pick], xs[pick], :3] = (230, 40, 200)
    return Image.fromarray(a, 'RGBA')


def tiled_sheet(vary):
    """a 160x160 ground sheet of 16 px tiles; vary=False repeats one tile, vary=True mixes eight."""
    rng = np.random.default_rng(5)
    tiles = [rng.integers(60, 140, (16, 16, 3)) for _ in range(8)]
    img = np.zeros((160, 160, 4), np.uint8); img[..., 3] = 255
    for ty in range(10):
        for tx in range(10):
            t = tiles[rng.integers(0, 8)] if vary else tiles[0]
            img[ty * 16:(ty + 1) * 16, tx * 16:(tx + 1) * 16, :3] = t
    return Image.fromarray(img, 'RGBA')


def ground_sheet(bad_cell=False, noise=False):
    """a 192 px ground sheet of four of his own pack tiles (the tile class's ruler, 10/18); bad_cell swaps the
    last for a noise cell, noise fills all four."""
    import glob, os
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    packs = [f for f in sorted(glob.glob(os.path.join(root, 'reference', 'art_bank', 'ground', 'pack_*.png')))
             if Image.open(f).size == (96, 96)]   # his tiles at his size, never resized
    rng = np.random.default_rng(1)
    im = Image.new('RGBA', (192, 192))
    for i, (x, y) in enumerate([(0, 0), (96, 0), (0, 96), (96, 96)]):
        if noise or (bad_cell and i == 3):
            c = rng.integers(0, 256, (96, 96, 4), dtype=np.uint8); c[..., 3] = 255
            im.paste(Image.fromarray(c, 'RGBA'), (x, y))
        else:
            im.paste(Image.open(packs[i]).convert('RGBA'), (x, y))
    return im
