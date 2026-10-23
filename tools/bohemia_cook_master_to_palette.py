#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D] 10/23/26: A RIG MASTER AS A 255-COLOUR PNG, FOR THE DISTRICT BANK.
A district picture through the rig is a 1,724 px render full of grain: as a truecolour PNG it is 1.4 to 1.8 MB, 2.35 MB
in the bank's base64, six times the factory's flat picture (0.40 MB). Fifteen of them took the bank from 28.5 MB to
56.9 MB (GitHub warns at 50 MB and refuses a file at 100 MB); all 69 would be about 162 MB, a push GitHub refuses. The
map never shows the master: the wire resamples it to 256 px. So the master is kept as an indexed PNG: 255 colours (175
by octree over every opaque pixel, about 80 over the coloured ones by hue family: to_palette), one fully transparent entry; any pixel
with ink is opaque, so the crop stays the content's own box (the square icons gate). Measured on the strip and the mountain at the map's 256 px against the truecolour master:
octree 0.27 to 0.36 MB, mean difference 0.8 to 1.4 of 255 (max 9); median cut 0.75 MB, 0.2 to 0.4. Octree: the bank
stays where it was (28.5 MB), the difference is under a step of the map's own grain.

  python3 tools/bohemia_cook_master_to_palette.py <in.png> <out.png>

REFERENCE CHECK (the 9/4 standing duty): nothing is drawn; a picture is re-encoded. No reference game.
REUSE CHECK (REUSE-FIRST): Pillow's own octree quantizer.
TASTE CHECK: compared at the map's 256 px against the truecolour master (records/BOHEMIA_COOK_EVERY_2D_ASSET_INTO_3D_ROUND_TWO_10_23_26.md).
"""
import sys
import numpy as np
from PIL import Image


def to_palette(im):
    """10/23 (after the hue gate went red on the first indexed batch): an octree over every pixel gives its 255 entries to
    the bulk of the picture, the grey-brown ground and walls, and merges the rare coloured pixels (a yellow door, a red
    cross, a teal pool) into their neighbours, so an icon that carried four hue families came out with one. So the palette
    is built in two: 175 entries by octree over all the opaque pixels, and about 80 over the coloured ones (the hue gate's
    own test: saturation 0.18 or more, brightest channel 40 or more) shared out by HUE FAMILY, every family present at
    least two entries of its own; every pixel takes its nearest entry"""
    im = im.convert('RGBA'); a = np.asarray(im)
    op = a[..., 3] >= 1                                        # any ink is ink: the crop is the content's own box
    rgb = a[..., :3]
    px = rgb[op].astype(np.int16)
    mx, mn = px.max(1), px.min(1)
    chroma = (mx >= 40) & ((mx - mn) >= 0.18 * mx)
    def octree(p, n):
        if len(p) == 0: return np.zeros((0, 3), np.uint8)
        side = int(np.ceil(np.sqrt(len(p))))
        pad = np.zeros((side * side, 3), np.uint8); pad[:len(p)] = p; pad[len(p):] = p[0]
        q = Image.fromarray(pad.reshape(side, side, 3), 'RGB').quantize(colors=n, method=Image.Quantize.FASTOCTREE)
        used = np.unique(np.asarray(q))
        return np.array(q.getpalette()[:3 * 256], np.uint8).reshape(-1, 3)[used]
    # the bulk keeps the octree's own mapping (it groups a grainy picture into runs a PNG packs: 0.3 MB a master, where
    # a nearest-entry mapping of every pixel came out 0.5 to 0.7 MB)
    fill = rgb.copy(); fill[~op] = np.median(rgb[op], axis=0).astype(np.uint8) if op.any() else 0
    q = Image.fromarray(fill, 'RGB').quantize(colors=175, method=Image.Quantize.FASTOCTREE)
    base = np.array(q.getpalette()[:3 * 175], np.uint8).reshape(-1, 3)
    idx = np.asarray(q).astype(np.uint8).copy()
    # the coloured pixels by hue family (the hue gate's twelve 30-degree buckets), every family present its own entries,
    # and only the coloured pixels look for their nearest entry again
    cp = px[chroma].astype(np.float32) / 255.0; parts = [base]
    if len(cp):
        M = cp.max(1); m = cp.min(1); dd = np.maximum(M - m, 1e-6); r, g, b = cp[:, 0], cp[:, 1], cp[:, 2]
        hue = np.where(M == r, ((g - b) / dd) % 6, np.where(M == g, (b - r) / dd + 2, (r - g) / dd + 4)) / 6.0
        fam = (hue * 12).astype(int) % 12; cnt = np.bincount(fam, minlength=12)
        share = np.sqrt(cnt) / max(np.sqrt(cnt).sum(), 1e-6)
        for f in np.flatnonzero(cnt):
            parts.append(octree(px[chroma][fam == f].astype(np.uint8), int(max(2, round(80 * share[f])))))
    pal = np.concatenate(parts)[:255]
    P = pal.astype(np.int32); flat = np.flatnonzero(op.ravel())[chroma]; src = rgb.reshape(-1, 3)
    for k in range(0, len(flat), 200000):
        c = src[flat[k:k + 200000]].astype(np.int32)
        idx.ravel()[flat[k:k + 200000]] = ((c[:, None, :] - P[None, :, :]) ** 2).sum(2).argmin(1).astype(np.uint8)
    idx[~op] = 255
    out = Image.fromarray(idx, 'P')
    full = pal.ravel().tolist(); full += [0, 0, 0] * (256 - len(full) // 3)
    out.putpalette(full); out.info['transparency'] = 255
    return out


if __name__ == '__main__':
    to_palette(Image.open(sys.argv[1])).save(sys.argv[2], optimize=True, transparency=255)
