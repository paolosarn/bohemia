#!/usr/bin/env python3
"""COOK TWO [stretch the pack] round two: THE 47-TILE BLOB SET (rule 108 ROUND EIGHT (e): 'a 47-tile blob autotile set
generated from a 15-tile template'). records/ only, nothing drawn. The 'template' here is not hand-drawn edges:
it is HIS slab and road fields (frame cut, the recipes) and HIS slab's own south face as the curb, and every one
of the 47 cases is rendered from a mask: the centre cell and its eight neighbours, walk or road, a corner counted
only when both its sides are walk (the blob rule, which is what makes 256 cases collapse to 47).
The mask is rounded by a blur-and-threshold (convex and concave corners both soften, 12 px), the curb is laid
where the nearest walk is straight north (the face the 45 degree eye sees), the lit lip everywhere else.
Proof: the 47 on one sheet, and a random sidewalk layout tiled from them beside the same layout as hard squares.
  python3 tools/bohemia_cook2_stretch_the_pack_47_10_13_26.py

REFERENCE CHECK (added at the seam by DIRECTION 10/16, the 9/4 standing duty): the compare law
(laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md), the approved asset index (his 7/13 UP set),
the card of numbers and skills/bohemia-pixel-art, AH-01 and AH-03. The source is his own tiles. No reference game.

REUSE CHECK (REUSE-FIRST, 7/22, written 10/18): his own tiles from the approved set (his HD tile repo and his 7/13 UP list, through the pack readers); every pixel cut, padded, layered or recoloured from them, nothing drawn (rule 108).

TASTE CHECK (written 10/18): his rulings on the ground are the bar: his 10/10 "look again at the tiles we downloaded", his UP on the curb, the crossing and the 47, his NO on the Vegas block (composition); the sheet goes to DIRECTION, then the VOTE tab.
"""
import json, os, sys, itertools
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S
TW, TH = 82, 81; FH = 7; BLUR = 6
WALKS, ROADS = [0, 1, 2, 6, 7], [0, 1, 7, 8, 2, 9]
rng = np.random.RandomState(1013)
def cell(fam, ids):
    a = S.pad(S.cut_frame(S.pack(fam, ids[rng.randint(len(ids))]), fam), TW, TH)[..., :3]
    return a[:, ::-1] if rng.rand() < 0.5 else a
FACE = np.concatenate([S.pack(S.SIDEWALK, i)[-FH:, 5:-5, :3] for i in WALKS] * 3, axis=1).astype(float)
NB = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]   # NW N NE W E SW S SE
def blob(bits):
    """the blob rule: a corner counts only if both its edges are set."""
    b = dict(zip(NB, bits)); n, w, e, s = b[(-1, 0)], b[(0, -1)], b[(0, 1)], b[(1, 0)]
    return (b[(-1, -1)] and n and w, n, b[(-1, 1)] and n and e, w, e, b[(1, -1)] and s and w, s, b[(1, 1)] and s and e)
CASES = sorted({blob(bits) for bits in itertools.product((0, 1), repeat=8)})
assert len(CASES) == 47, len(CASES)

def render(case, centre=True):
    g = np.zeros((3, 3), bool); g[1, 1] = centre
    for (dy, dx), v in zip(NB, case): g[1 + dy, 1 + dx] = bool(v)
    m = np.kron(g, np.ones((TH, TW), bool)).astype(np.uint8) * 255
    m = np.asarray(Image.fromarray(m).filter(ImageFilter.GaussianBlur(BLUR))) > 127
    walk = np.vstack([np.hstack([cell(S.SIDEWALK, WALKS) for _ in range(3)]) for _ in range(3)])
    road = np.vstack([np.hstack([cell(S.ROAD, ROADS) for _ in range(3)]) for _ in range(3)])
    img = np.where(m[..., None], walk, road).astype(float)
    # the vertical distance up to the walk (the face the eye sees) and the distance in any direction (for the lip)
    H, W = m.shape; up = np.full((H, W), 99)
    for k in range(1, FH + 4):
        hit = np.zeros_like(m); hit[k:] = m[:-k]; up = np.where((up == 99) & hit & ~m, k, up)
    near = np.full((H, W), 99); grow = m.copy()
    for k in range(1, 4):
        grow = np.asarray(Image.fromarray(grow.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0
        near = np.where((near == 99) & grow & ~m, k, near)
    face = (~m) & (up <= FH)
    u = np.tile(np.arange(W), (H, 1)) % FACE.shape[1]
    img[face] = FACE[(up[face] - 1).clip(0, FH - 1), u[face]]
    shd = (~m) & (up > FH) & (up <= FH + 3); img[shd] *= 0.55
    inner = m & ~(np.asarray(Image.fromarray((~m).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) == 0)
    img[inner] = img[inner] * 0.35 + np.array([214, 200, 176]) * 0.65   # the lip: his slab's lit edge colour (LIP, the corner tool's measure)
    return img[TH:2 * TH, TW:2 * TW].clip(0, 255).astype(np.uint8)

def main():
    # round two's own catch: the curb face and its shadow land on the ROAD cell south of the walk, so the road
    # cells need their 47 too (the same blob rule, read with the walk as the neighbour): 94 tiles, 47 + 47
    tiles = {c: render(c) for c in CASES}
    rtiles = {c: render(c, False) for c in CASES}
    cols = 8; rows = (len(CASES) + cols - 1) // cols
    sh = Image.new('RGB', (cols * (TW + 6), rows * (TH + 6)), (14, 14, 14))
    for i, c in enumerate(CASES): sh.paste(Image.fromarray(tiles[c]), ((i % cols) * (TW + 6), (i // cols) * (TH + 6)))
    # a random sidewalk layout (plazas, a street, a lot): tiled from the 47, beside the same plan as hard squares
    L = np.zeros((8, 10), bool); r2 = np.random.RandomState(7)
    L[:, :3] = True; L[:2, :] = True; L[5:7, 5:9] = True; L[3, 7] = True; L[r2.rand(8, 10) < 0.12] ^= True
    Lp = np.pad(L, 1)
    out = np.zeros((8 * TH, 10 * TW, 3), np.uint8); hard = np.zeros_like(out)
    for y in range(8):
        for x in range(10):
            sl = (slice(y * TH, (y + 1) * TH), slice(x * TW, (x + 1) * TW))
            if L[y, x]:
                bits = tuple(int(Lp[1 + y + dy, 1 + x + dx]) for dy, dx in NB)
                out[sl] = tiles[blob(bits)]; hard[sl] = cell(S.SIDEWALK, WALKS)
            else:
                bits = tuple(int(Lp[1 + y + dy, 1 + x + dx]) for dy, dx in NB)
                out[sl] = rtiles[blob(bits)]; hard[sl] = cell(S.ROAD, ROADS)
    W = out.shape[1]
    sheet = Image.new('RGB', (W * 2 + 20, out.shape[0] + 60 + sh.height + 30), (14, 14, 14)); d = ImageDraw.Draw(sheet)
    sheet.paste(Image.fromarray(hard), (0, 50)); sheet.paste(Image.fromarray(out), (W + 20, 50))
    sheet.paste(sh, (0, out.shape[0] + 80))
    d.text((4, 6), 'A SIDEWALK PLAN AS HARD SQUARES (his tiles, frame cut)', fill=(235, 235, 235))
    d.text((W + 24, 6), 'THE SAME PLAN FROM THE 47 (every edge and corner curbed)', fill=(235, 235, 235))
    d.text((4, 26), 'ONE QUESTION: does every corner connect, whatever the shape?', fill=(235, 200, 120))
    d.text((4, out.shape[0] + 60), 'THE 47 SIDEWALK CELLS (and 47 road cells beside them, on the record): every case of a cell and its eight neighbours', fill=(235, 235, 235))
    sheet.save(os.path.join(R, 'records/target/COOK2_STRETCH_THE_PACK_47.png'))
    json.dump({'cases': [list(map(int, c)) for c in CASES], 'order': 'NW N NE W E SW S SE', 'tile': [TW, TH], 'blur_px': BLUR, 'face_rows': FH,
               'walk': [S.SIDEWALK, WALKS], 'road': [S.ROAD, ROADS]},
              open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_47_10_13_26.json'), 'w'), indent=1)
    print('47 + 47 rendered')
if __name__ == '__main__':
    main()
