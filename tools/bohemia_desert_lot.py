#!/usr/bin/env python3
"""BOHEMIA BIG DESERT LOT (7/18/26) — the perfect empty parcel.

Paolo: "perfect a big big big desert lot; if that's good I'll start the
city." The desert is the GROUND layer under the whole city (CELL-IS-PLOT +
the three-layer tile system: delete a building's STRUCTURE and the GROUND
desert is what's underneath). So this ground has to be flawless and BIG.

THE NAMED CRIME to avoid (VEGAS_NEIGHBORHOOD_ANATOMY law 1): DESERT
CONFETTI — per-cell random shuffle that reads as a checkerboard. My first
desert committed exactly that. The fix here is CONTINUOUS large-scale
variation that ignores cell boundaries:
  - ONE seamless sand base (cropped past the tile border), tiled
  - multi-octave value noise (low frequency, spans the whole parcel) drives
    the tone: natural sun-bleached and wind-shadowed patches, no grid
  - sparse scatter placed across the WHOLE parcel (not per cell): small
    tan pebbles, dry-wash hairlines, faint cracked-earth
  - deterministic (seeded); zero purple

Run from repo root: python3 tools/bohemia_desert_lot.py [cells]
Output: slices/BOHEMIA_DESERT_LOT_PROOF_7_18_26.png
"""
import base64
import io
import json
import sys

import numpy as np
from PIL import Image

T = 44
POOLS = 'banks/BOHEMIA_DESERT_POOLS_7_18_26.txt'
OUT = 'slices/BOHEMIA_DESERT_LOT_PROOF_7_18_26.png'


def value_noise(h, w, cells, rs, octaves=4):
    """Smooth multi-octave value noise in [0,1], seamless-ish, low freq."""
    field = np.zeros((h, w), float)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = max(2, cells * (2 ** o))
        grid = rs.rand(n + 1, n + 1)
        img = Image.fromarray((grid * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        field += amp * (np.asarray(img).astype(float) / 255.0)
        tot += amp
        amp *= 0.5
    field /= tot
    return (field - field.min()) / (field.max() - field.min() + 1e-6)


def tan_tint(a):
    a = a.astype(float)
    a[..., 0] = np.clip(a[..., 0] * 1.18 + 14, 0, 255)
    a[..., 1] = np.clip(a[..., 1] * 1.02 + 4, 0, 255)
    a[..., 2] = np.clip(a[..., 2] * 0.72, 0, 255)
    a[..., 2] = np.minimum(a[..., 2], a[..., 1])
    return a.astype(np.uint8)


def main():
    cells = int(sys.argv[1]) if len(sys.argv) > 1 else 28
    W = H = cells * T
    D = json.load(open(POOLS))
    rs = np.random.RandomState(20260718)

    # 1. seamless sand base, cropped past the border, tiled across the parcel
    def crop(b):
        im = Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB')
        m = int(min(im.size) * 0.12)
        return np.asarray(im.crop((m, m, im.width - m, im.height - m)).resize((T, T))).astype(float)
    sand = crop(D['ground'][3])
    canvas = np.zeros((H, W, 3), float)
    for y in range(cells):
        for x in range(cells):
            canvas[y * T:(y + 1) * T, x * T:(x + 1) * T] = sand

    # 2. CONTINUOUS tone: low-freq noise (sun-bleach + wind-shadow), spans the
    #    whole parcel so there is NO cell grid (the anti-confetti move)
    tone = value_noise(H, W, max(3, cells // 4), rs, octaves=4)      # big patches
    grain = value_noise(H, W, cells, rs, octaves=2)                  # fine texture
    mod = 0.80 + 0.30 * tone + 0.08 * (grain - 0.5)                  # 0.76..1.14
    canvas *= mod[..., None]
    # a faint warm bleach in the brightest patches (dune crests)
    warm = np.clip((tone - 0.6) * 2.5, 0, 1)[..., None]
    canvas = canvas * (1 - 0.10 * warm) + np.array([224, 196, 150]) * (0.10 * warm)
    canvas = np.clip(canvas, 0, 255)

    # 3. dry-wash hairlines: a few faint meandering darker channels
    for _ in range(cells // 3):
        x = rs.randint(0, W); y = rs.randint(0, H)
        ang = rs.rand() * 6.28
        for _ in range(rs.randint(W // 2, W)):
            x += int(round(np.cos(ang) * 2)); y += int(round(np.sin(ang) * 2))
            ang += (rs.rand() - 0.5) * 0.5
            if not (0 <= x < W and 0 <= y < H):
                break
            for w in range(rs.randint(1, 4)):
                if x + w < W:
                    canvas[y, x + w] = np.clip(canvas[y, x + w] * 0.86, 0, 255)

    img = Image.fromarray(canvas.astype(np.uint8)).convert('RGBA')

    # 4. sparse scatter across the WHOLE parcel (not per cell): small tan
    #    pebbles + the odd larger rock. Poisson-ish via a shuffled coarse grid.
    rocks = D['rock']
    n_scatter = int(cells * cells * 0.10)
    spots = [(rs.randint(6, W - 6), rs.randint(6, H - 6)) for _ in range(n_scatter)]
    for (px, py) in spots:
        r = rs.rand()
        art = Image.open(io.BytesIO(base64.b64decode(rocks[rs.randint(0, len(rocks))]))).convert('RGBA')
        art = Image.fromarray(np.dstack([tan_tint(np.asarray(art)[..., :3]),
                                         np.asarray(art)[..., 3]]))
        s = int(T * (0.18 + 0.5 * r * r))          # mostly tiny pebbles
        dw = max(4, s); dh = max(4, round(art.height * dw / art.width))
        art = art.resize((dw, dh), Image.NEAREST)
        img.alpha_composite(art, (px - dw // 2, py - dh))

    out = img.convert('RGB')
    a = np.asarray(out).astype(int)
    purple = ((a[..., 2] > 100) & (a[..., 0] > 80) & (a[..., 1] < 70) &
              (a[..., 2] - a[..., 1] > 50) & (a[..., 0] - a[..., 1] > 30)).sum()
    if purple:
        print('DESERT LOT REFUSES: purple (%d px)' % purple); return 1
    out.save(OUT)
    print('big desert lot: %dx%d cells (%dx%dpx), %d scatter -> %s'
          % (cells, cells, W, H, n_scatter, OUT))
    return 0


if __name__ == '__main__':
    sys.exit(main())
