#!/usr/bin/env python3
"""
BOHEMIA — MEAN SATURATION OF HIS PURCHASED GROUND TILES (7/31/26)

REUSE CHECK: cooks NOTHING. It decodes tiles out of the PURCHASED library
banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt and reports a number per tile. No
pixel is drawn, altered or written anywhere. Under BOUGHT BEATS PAINTED that is the
whole point: this exists so his art can be PLACED well, never changed.

WHY: his "1. Cracked contrete tiles" pack is not one texture, it is a desert range.
The same 20 tiles run from pale poured concrete (saturation ~0.19) to brown dirt and
gravel (~0.37). The run was laying all 20 on the sidewalk and leaving the YARD -- the
biggest surface on the block -- as a flat painted tan field, which looked nothing like
the rich bought asphalt right next to it.

So build_run_slice.js splits his pack by this number: the brown ones dress the yard,
the pale ones stay poured concrete. That is a PLACEMENT decision, clause 4 of his law
(DETERMINISTIC PLACEMENT), and every tile still blits 1:1 verbatim.

The split lives here rather than inline in the builder so the number the JS uses and
the number any record quotes come from ONE implementation.

  python3 tools/bohemia_tile_saturation.py   -> {"pack#idx": saturation, ...} on stdout
"""
import base64
import colorsys
import io
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

LIB = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'


def mean_sat(b64):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    b = im.tobytes()
    n = len(b) // 3
    if not n:
        return 0.0
    tot = 0.0
    for i in range(0, len(b), 3):
        tot += colorsys.rgb_to_hsv(b[i] / 255.0, b[i + 1] / 255.0, b[i + 2] / 255.0)[1]
    return tot / n


def main():
    bank = json.load(open(LIB))
    out = {}
    for t in bank['tiles']:
        if not t.get('b64'):
            continue
        out['%s#%s' % (t.get('pack'), t.get('idx'))] = round(mean_sat(t['b64']), 4)
    print(json.dumps(out))


if __name__ == '__main__':
    main()
