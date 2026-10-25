#!/usr/bin/env python3
"""COOK [the PC playtest: the art's part] (10/25/26): THE FIGHT FLOOR IN ACT ONE'S PALETTE.

Rule 159 (Paolo 10/24, LOCKED: 'it's an economic apocalypse, it just happened, there shouldn't be so much colour'; and 137:
'I don't want a grey yellow sand color to flood all of our art'), rule 164 item 13 (the fight board 'more organic'). The map
is in act one's palette now (the 69 district pictures, bd6d7c46; the painting, RUN e6eb5dba; its streets and towns, this
round), and the fight he walks into from it is still the 10/22 floor: measured here, 72 percent of its pixels in the sand
family (CIELAB L 30-86, C 5-40, h 45-105; the bar under rule 137(b) is a third), median chroma 12.7. So the board was
another world from the map he came from.

THE GRADE (the ruin the map's painting took, tools/bohemia_cook_no_rainbow_10_24_26.py, sized for a picture): every pixel
keeps its value and its hue; its chroma is pulled to CHROMA_K of itself and never past CHROMA_CAP, so dust, caliche, stucco
and lawn go to the faded, dirty grey-brown of act one and the variety stays in value, wear and light (159a). A strong colour
(paint, a sign, a faction's mark: chroma over STRONG) keeps a faded accent up to ACCENT_CAP (159c). Alpha is untouched, so the
pictures keep their sizes, feet and anchors.

WHAT IS GRADED: the present-day blocks (slices/fight_ground/block_<name>.webp) and their raided futures (act one falling
further). The reclaimed futures are act three's colour (159d: colour comes back as the world heals) and are left as they are.
The pre-grade pictures stay in git (this commit's parent) for act three (rule 128).

HIS PACKS, read and printed beside (rule 82a; tools/bohemia_pack_corpus.js): the approved ground pool (his bought gravel) and
the street pools measure tan themselves (the ground pool 75 percent sand family), so the packs are where the floor's shapes
and materials come from, and rule 159 is what colour they are in act one.

  python3 tools/bohemia_cook_the_fight_floor_in_act_one_10_25_26.py measure
  python3 tools/bohemia_cook_the_fight_floor_in_act_one_10_25_26.py grade [name ...] [--cover] [--write]
      (--cover: the 51 cover pieces, slices/fight_ground/cover_*.webp, measured 45 percent sand, the block walls 96)
      (no --write: writes records/target/cook_fight_floor_act_one/<name>.webp to look at; --write swaps it into the game)
"""
import base64
import glob
import io
import json
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FLOOR = os.path.join(ROOT, 'slices', 'fight_ground')
OUT = os.path.join(ROOT, 'records', 'target', 'cook_fight_floor_act_one')
PACKS = [('ground', 'banks/BOHEMIA_GROUND_POOL_8_6_26.txt', 'buckets'),
         ('street_pools', 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt', 'pools')]

CHROMA_K = 0.3       # [DIAL] what is left of a colour's chroma in act one (the painting's ruin(): 0.3)
CHROMA_CAP = 7.0     # [DIAL] no ground, wall or roof past this chroma
STRONG = 30.0        # [DIAL] a colour this strong is paint, a sign or a mark: it keeps a faded accent
ACCENT_CAP = 16.0    # [DIAL] the faded accent's chroma at most
QUALITY = 80         # a graded block at 80 is the old block's bytes (measured: scrub.0 1.04 MB before, 1.08 MB at 80, 1.32 MB at 90)

M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
MI = np.linalg.inv(M)
WP = np.array([0.95047, 1.0, 1.08883])


def to_lab(rgb):
    a = rgb.astype(np.float64) / 255.0
    lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    xyz = (lin @ M.T) / WP
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return 116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])


def to_rgb(L, A, B):
    fy = (L + 16) / 116
    fx, fz = fy + A / 500, fy - B / 200
    f = np.stack([fx, fy, fz], axis=-1)
    xyz = np.where(f ** 3 > 0.008856, f ** 3, (f - 16 / 116) / 7.787) * WP
    lin = np.clip(xyz @ MI.T, 0, 1)
    srgb = np.where(lin <= 0.0031308, 12.92 * lin, 1.055 * lin ** (1 / 2.4) - 0.055)
    return np.clip(np.round(srgb * 255), 0, 255).astype(np.uint8)


def stats(px):
    L, A, B = to_lab(px)
    C = np.hypot(A, B)
    h = (np.degrees(np.arctan2(B, A)) + 360) % 360
    sand = (L >= 30) & (L <= 86) & (C >= 5) & (C < 40) & (h >= 45) & (h < 105)
    return {'pixels': int(len(px)), 'sand': round(float(sand.mean()), 3), 'chroma_median': round(float(np.median(C)), 1),
            'chroma_p90': round(float(np.percentile(C, 90)), 1), 'value_median': round(float(np.median(L)), 1)}


def opaque(path, reduce=1):
    im = Image.open(path).convert('RGBA')
    if reduce > 1:
        im = im.reduce(reduce)
    a = np.asarray(im).reshape(-1, 4)
    return a[a[:, 3] > 128][:, :3]


def pack_pixels(bank, key):
    d = json.load(open(os.path.join(ROOT, bank)))
    out = []
    src = d.get(key) or {}
    vals = src.values() if isinstance(src, dict) else [src]
    for v in vals:
        for t in (v if isinstance(v, list) else []):
            b = t.get('b64') if isinstance(t, dict) else t if isinstance(t, str) and t.startswith('iVBOR') else None   # a pool's tiles are bare base64 PNGs in the street pools
            if b:
                out.append(opaque(io.BytesIO(base64.b64decode(b))))
    return np.concatenate(out) if out else None


def blocks(names=None, futures=('raided',), cover=False):
    out = []
    for f in sorted(glob.glob(os.path.join(FLOOR, 'cover_*.webp' if cover else 'block_*.webp'))):
        base = os.path.basename(f)[:-5] if cover else os.path.basename(f)[6:-5]
        fut = 'reclaimed' if base.endswith('_reclaimed') else 'raided' if base.endswith('_raided') else None
        if fut and fut not in futures:
            continue
        if names and base not in names and base.rsplit('_', 1)[0] not in names:
            continue
        out.append((base, f))
    return out


def grade_px(rgba):
    rgb = rgba[..., :3]
    L, A, B = to_lab(rgb)
    C = np.hypot(A, B)
    C2 = np.minimum(C * CHROMA_K, CHROMA_CAP)
    strong = C > STRONG
    C2 = np.where(strong, np.minimum(CHROMA_CAP + (C - STRONG) * 0.3, ACCENT_CAP), C2)
    k = np.where(C > 1e-6, C2 / np.maximum(C, 1e-6), 0)
    out = rgba.copy()
    out[..., :3] = to_rgb(L, A * k, B * k)
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    cmd = args[0] if args else 'measure'
    if cmd == 'measure':
        res = {'packs': {}, 'floor': {}}
        for alias, bank, key in PACKS:
            px = pack_pixels(bank, key)
            res['packs'][alias] = stats(px) if px is not None else 'no tiles read'
        allpx = []
        for base, f in blocks(futures=()):
            px = opaque(f, 4)
            allpx.append(px)
            res['floor'][base] = stats(px)
        res['floor_all_present_day'] = stats(np.concatenate(allpx))
        print(json.dumps({'packs': res['packs'], 'floor_all_present_day': res['floor_all_present_day']}, indent=1))
        return
    if cmd == 'grade':
        names = args[1:] or None
        write = '--write' in sys.argv
        os.makedirs(OUT, exist_ok=True)
        log = {}
        for base, f in blocks(names, cover='--cover' in sys.argv):
            im = Image.open(f)
            rgba = np.asarray(im.convert('RGBA'))
            g = grade_px(rgba)
            dst = f if write else os.path.join(OUT, base + '.webp')
            before = os.path.getsize(f)
            lossless = open(f, 'rb').read(16)[12:16] == b'VP8L'   # the cover pieces are lossless (crisp edges), the blocks lossy: each keeps its own
            Image.fromarray(g, 'RGBA').save(dst, 'WEBP', lossless=True, quality=100, method=6) if lossless else \
                Image.fromarray(g, 'RGBA').save(dst, 'WEBP', quality=QUALITY, method=6)
            a = g.reshape(-1, 4)
            log[base] = {'bytes': [before, os.path.getsize(dst)], 'after': stats(a[a[:, 3] > 128][::16, :3])}
            print(base, json.dumps(log[base]))
        with open(os.path.join(OUT, 'graded_cover.json' if '--cover' in sys.argv else 'graded.json'), 'w') as fh:
            json.dump({'dials': {'chroma_k': CHROMA_K, 'chroma_cap': CHROMA_CAP, 'strong': STRONG, 'accent_cap': ACCENT_CAP},
                       'wrote_into_the_game': write, 'blocks': log}, fh, indent=1)
        return
    print(__doc__)


if __name__ == '__main__':
    main()
