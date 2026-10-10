#!/usr/bin/env python3
"""COOK TWO [no borders] + [one at a time] (rule 104b, Paolo 10/10: 'make sure when the floor tiles are touching
each other you can't see their border'; rules 100, 101, 108). ONE asset on ONE sheet, records/ only, nothing in
the game. NOT DRAWN (rule 108a): every pixel is his, from '1. Cracked contrete tiles' and '1. Cracked street
tiles', the baked frame cut per side as measured in records/BOHEMIA_HOW_THE_PACK_DID_IT_SIDEWALK_10_10_26.md
(the cut is the corner tool's, reused). The sheet: his tiles laid edge to edge AS THEY COME (the borders he
sees) beside the same tiles with the frame cut, a sidewalk strip over a road strip, 1:1.
MEASURED: 'border pixels' = pixels in the 3 px either side of a seam darker than the darkest 5% of the tile
insides; counted at every seam of both versions.
  python3 tools/bohemia_cook2_no_borders_one_at_a_time_10_10_26.py
"""
import json, base64, io, os, importlib.util
import numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('c', os.path.join(R, 'tools/bohemia_cook2_the_corner_one_at_a_time_10_10_26.py'))
src = open(spec.origin).read().split('\nN = 4;')[0]          # the corner tool's packs, UP set and per-side cut
C = {'__file__': spec.origin}; exec(compile(src, spec.origin, 'exec'), C)
SW, RD, packs, tile, TW, TH = C['SW'], C['RD'], C['packs'], C['tile'], C['TW'], C['TH']
COLS = 6
def raw(p, i): return np.asarray(Image.open(io.BytesIO(base64.b64decode(packs[p][i]['b64']))).convert('RGB'))[:94, :92]
def strip(fn, p, ids, w, h):
    out = np.zeros((h * 2, w * COLS, 3), np.uint8)
    for r in range(2):
        for c in range(COLS):
            out[r * h:(r + 1) * h, c * w:(c + 1) * w] = fn(p, ids[(r * COLS + c) % len(ids)])
    return out
SWI, RDI = [0, 1, 2, 6, 7, 15], [0, 1, 7, 8, 2, 9]   # no weed, no lane paint: the seam is the only thing on trial
before = np.vstack([strip(raw, SW, SWI, 92, 94), strip(raw, RD, RDI, 92, 94)])
after = np.vstack([strip(tile, SW, SWI, TW, TH), strip(tile, RD, RDI, TW, TH)])
def border_px(a, w, h):
    l = a.astype(int).sum(2); dark = np.percentile(l, 5); n = 0
    for c in range(1, COLS): n += (l[:, c * w - 3:c * w + 3] < dark).sum()
    for r in range(1, a.shape[0] // h): n += (l[r * h - 3:r * h + 3] < dark).sum()
    return int(n)
def dark_in(a): return np.percentile(a.astype(int).sum(2), 5)
# one threshold for both: the darkest 5% of the cut tiles' own insides, so the comparison is fair
thr = dark_in(after)
def count(a, w, h):
    l = a.astype(int).sum(2); n = 0
    for c in range(1, COLS): n += (l[:, c * w - 3:c * w + 3] < thr).sum()
    for r in range(1, a.shape[0] // h): n += (l[r * h - 3:r * h + 3] < thr).sum()
    area = (COLS - 1) * 6 * a.shape[0] + (a.shape[0] // h - 1) * 6 * a.shape[1]
    return int(n), round(100 * n / area, 1)
bn, bp = count(before, 92, 94); an, ap = count(after, TW, TH)
# the inside, for scale: the same count on lines through the middle of the tiles
def inside(a, w, h):
    l = a.astype(int).sum(2); n = 0; area = 0
    for c in range(COLS): n += (l[:, c * w + w // 2 - 3:c * w + w // 2 + 3] < thr).sum(); area += 6 * a.shape[0]
    return round(100 * n / area, 1)
ip = inside(after, TW, TH)
W = max(before.shape[1], after.shape[1]); H = max(before.shape[0], after.shape[0])
sheet = Image.new('RGB', (W * 2 + 20, H + 70), (14, 14, 14)); d = ImageDraw.Draw(sheet)
sheet.paste(Image.fromarray(before), (0, 60)); sheet.paste(Image.fromarray(after), (W + 20, 60))
d.text((2, 8), f'YOUR TILES AS THEY COME: {bp}% of the seam is border', fill=(235, 235, 235))
d.text((W + 22, 8), f'THE SAME TILES, FRAME CUT: {ap}% (inside a tile: {ip}%)', fill=(235, 235, 235))
d.text((2, 30), 'ONE QUESTION: can you see where two tiles meet?', fill=(235, 200, 120))
sheet.save(os.path.join(R, 'records/target/COOK2_ONE_AT_A_TIME_NO_BORDERS.png'))
m = dict(before_border_px=bn, before_pct=bp, after_border_px=an, after_pct=ap, inside_pct=ip, threshold_lum=float(thr),
         sidewalk=[SW, SWI], road=[RD, RDI], cut=C['CUT'], tile=[TW, TH])
json.dump(m, open(os.path.join(R, 'records/BOHEMIA_COOK2_NO_BORDERS_MEASURED_10_10_26.json'), 'w'), indent=1)
print(m)
