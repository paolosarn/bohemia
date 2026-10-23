#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D] 10/23/26: A RIG MASTER AS A 255-COLOUR PNG, FOR THE DISTRICT BANK.
A district picture through the rig is a 1,724 px render full of grain: as a truecolour PNG it is 1.4 to 1.8 MB, 2.35 MB
in the bank's base64, six times the factory's flat picture (0.40 MB). Fifteen of them took the bank from 28.5 MB to
56.9 MB (GitHub warns at 50 MB and refuses a file at 100 MB); all 69 would be about 162 MB, a push GitHub refuses. The
map never shows the master: the wire resamples it to 256 px. So the master is kept as an indexed PNG: 255 colours by
Pillow's fast octree over the opaque pixels, one fully transparent entry; alpha is cut at half (the wire's LANCZOS to 256
px antialiases the edge again). Measured on the strip and the mountain at the map's 256 px against the truecolour master:
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
    im = im.convert('RGBA'); a = np.asarray(im)
    op = a[..., 3] >= 128
    rgb = a[..., :3].copy()
    fill = np.median(rgb[op], axis=0).astype(np.uint8) if op.any() else np.zeros(3, np.uint8)
    rgb[~op] = fill                                            # the clear pixels spend no palette entry
    q = Image.fromarray(rgb, 'RGB').quantize(colors=255, method=Image.Quantize.FASTOCTREE)
    idx = np.asarray(q).copy(); idx[~op] = 255
    out = Image.fromarray(idx, 'P')
    pal = q.getpalette()[:255 * 3]; pal += [0, 0, 0] * (256 - len(pal) // 3)
    out.putpalette(pal); out.info['transparency'] = 255
    return out


if __name__ == '__main__':
    to_palette(Image.open(sys.argv[1])).save(sys.argv[2], optimize=True, transparency=255)
