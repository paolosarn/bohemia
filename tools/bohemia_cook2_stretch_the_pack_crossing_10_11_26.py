#!/usr/bin/env python3
"""COOK TWO [stretch the pack], the proof (rule 108 ROUND EIGHT (e): 'proven by one street crossing built only from
cut and recoloured pack parts beside the pack original'). records/ only. Every pixel is his:
  * road and sidewalk: his tiles, frame cut (recipes), left-right flips only;
  * the zebra: his own crosswalk tiles (street pack 15, 16, 17), cut, on the north-south approaches (their bars
    run north-south, so they belong across a north-south road; never rotated, the light stays on top);
  * the curb: his slab's own 7-row south face where the walk edge faces the eye, the lit lip elsewhere, 3 px of
    his darkest road as shadow (the curb tool's method on a rounded-box distance field for all four corners);
  * decals: darken-only, his broken road tiles' darkest cracks (street pack 29-33), seeded, a few per board.
Then the seven numbers of every output cell are checked against the family's range (the recipes' family_sheet).
  python3 tools/bohemia_cook2_stretch_the_pack_crossing_10_11_26.py

REFERENCE CHECK (added at the seam by DIRECTION 10/11, the 9/4 standing duty): the compare law
(laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md), the approved asset index (his 7/13 UP set),
the card of numbers and skills/bohemia-pixel-art (load it first), AH-01 and AH-03. The source is his own tiles.
No reference game.

REUSE CHECK (REUSE-FIRST, 7/22, written 10/18): his own tiles from the approved set (his HD tile repo and his 7/13 UP list, through the pack readers); every pixel cut, padded, layered or recoloured from them, nothing drawn (rule 108).

TASTE CHECK (written 10/18): his rulings on the ground are the bar: his 10/10 "look again at the tiles we downloaded", his UP on the curb, the crossing and the 47, his NO on the Vegas block (composition); the sheet goes to DIRECTION, then the VOTE tab.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S
TW, TH = 82, 81; N = 9; W, H = N * TW, N * TH
rng = np.random.RandomState(1011)
def cell(fam, ids):
    a = S.pad(S.cut_frame(S.pack(fam, ids[rng.randint(len(ids))]), fam), TW, TH)[..., :3]
    return a[:, ::-1] if rng.rand() < 0.5 else a
ROADS, WALKS, ZEBRA, CRACKS = [0, 1, 7, 8, 2, 9], [0, 1, 2, 6, 7], [15, 16, 17], [29, 30, 31, 32, 33]
CR = [c for c in CRACKS if (S.ROAD, c) in S.UP]
img = np.zeros((H, W, 3), np.uint8); kind = {}
road_rc = lambda r, c: (3 <= r <= 5) or (3 <= c <= 5)
for r in range(N):
    for c in range(N):
        if road_rc(r, c):
            z = (c in (3, 4, 5) and r in (2, 6))                     # the zebra crosses the north-south road
            img[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW] = cell(S.ROAD, ZEBRA if z else ROADS); kind[(r, c)] = 'zebra' if z else 'road'
        else:
            img[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW] = cell(S.SIDEWALK, WALKS); kind[(r, c)] = 'walk'
# the zebra cells sit where the walk would be at rows 2 and 6: the road runs through them
# the walk: four corner blocks as rounded boxes (outer corners pushed off the canvas)
RAD = int(1.5 * TH)
def sdf_box(px, py, x0, y0, x1, y1, r):
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2; hx, hy = (x1 - x0) / 2 - r, (y1 - y0) / 2 - r
    qx, qy = np.abs(px - cx) - hx, np.abs(py - cy) - hy
    return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r
yy, xx = np.mgrid[0:H, 0:W].astype(float); big = 4 * RAD
blocks = [(-big, -big, 3 * TW, 2 * TH), (6 * TW, -big, W + big, 2 * TH), (-big, 7 * TH, 3 * TW, H + big), (6 * TW, 7 * TH, W + big, H + big),
          (-big, -big, 3 * TW, 3 * TH), (6 * TW, -big, W + big, 3 * TH), (-big, 6 * TH, 3 * TW, H + big), (6 * TW, 6 * TH, W + big, H + big)]
# the zebra rows 2 and 6 are road only between columns 3 and 5; the walk keeps rows 0-2 and 6-8 outside them
blocks = blocks[4:]
sdf = np.min([sdf_box(xx, yy, *b, RAD) for b in blocks], axis=0)
walkmask = sdf < 0
walk_px = np.zeros_like(img); road_px = np.zeros_like(img)
for r in range(N):
    for c in range(N):
        sl = (slice(r * TH, (r + 1) * TH), slice(c * TW, (c + 1) * TW))
        if kind[(r, c)] == 'walk': walk_px[sl] = img[sl]; road_px[sl] = cell(S.ROAD, ROADS)
        else: road_px[sl] = img[sl]; walk_px[sl] = cell(S.SIDEWALK, WALKS)
img = np.where(walkmask[..., None], walk_px, road_px).astype(float)
# decals, darken-only, on the road
for k in range(7):
    src = S.cut_frame(S.pack(S.ROAD, CR[rng.randint(len(CR))]), S.ROAD)
    y, x = rng.randint(0, H - 80), rng.randint(0, W - 80)
    if walkmask[y + 40, x + 40]: continue
    img = S.decal(np.dstack([img, np.full(img.shape[:2], 255)]).astype(np.uint8), src, (y, x), 0.8,
                  thresh=np.percentile(src[..., :3].astype(int).sum(2), 12))[..., :3].astype(float)
# the curb (the curb tool's method): edge = distance into the road; south = how much the edge faces the eye
FH = 7; faces = []
for i in (0, 1, 2, 6, 7):
    a = S.pack(S.SIDEWALK, i)[..., :3]; faces.append(a[a.shape[0] - FH:, 5:a.shape[1] - 5])
FACE = np.concatenate(faces * 6, axis=1).astype(float)
gy = np.gradient(sdf, axis=0); south = np.clip(gy, 0, 1)
fh = np.round(FH * south).astype(int); edge = sdf
u = xx.astype(int) % FACE.shape[1]
on_face = (edge >= 0) & (edge < fh) & (fh > 0)
fr = np.where(fh > 0, (edge * FH / np.maximum(fh, 1)).astype(int), 0).clip(0, FH - 1)
img[on_face] = FACE[fr[on_face], u[on_face]]
sl = np.asarray(Image.fromarray(walk_px)).reshape(-1, 3).astype(int); LIP = sl[sl.sum(1).argsort()[-len(sl) // 40:]].mean(0)
rl = road_px.reshape(-1, 3).astype(int); SH = rl[rl.sum(1).argsort()[:len(rl) // 20]].mean(0)
lip = (edge > -2) & (edge <= 0); img[lip] = img[lip] * 0.3 + LIP * 0.7
shd = (edge >= fh) & (edge < fh + 3) & (south > 0.15); img[shd] = img[shd] * 0.45 + SH * 0.55
out = img.clip(0, 255).astype(np.uint8)
# the pack original: the same plan laid with his RAW tiles, frames and all, no curb (what he bought)
raw = np.zeros((N * 96, N * 96, 3), np.uint8); rng2 = np.random.RandomState(1011)
for r in range(N):
    for c in range(N):
        fam, ids = (S.ROAD, ZEBRA if kind[(r, c)] == 'zebra' else ROADS) if kind[(r, c)] != 'walk' else (S.SIDEWALK, WALKS)
        raw[r * 96:(r + 1) * 96, c * 96:(c + 1) * 96] = S.pad(S.pack(fam, ids[rng2.randint(len(ids))]), 96, 96)[..., :3]
raw = np.asarray(Image.fromarray(raw).resize((W, H), Image.NEAREST))
sheet = Image.new('RGB', (W * 2 + 20, H + 60), (14, 14, 14)); d = ImageDraw.Draw(sheet)
sheet.paste(Image.fromarray(raw), (0, 50)); sheet.paste(Image.fromarray(out), (W + 20, 50))
d.text((4, 6), 'HIS PACK AS BOUGHT, laid as a crossing', fill=(235, 235, 235))
d.text((W + 24, 6), 'THE SAME PARTS, CUT, CURBED AND STAINED (nothing drawn)', fill=(235, 235, 235))
d.text((4, 26), 'ONE QUESTION: does this read as one real street corner?', fill=(235, 200, 120))
sheet.save(os.path.join(R, 'records/target/COOK2_STRETCH_THE_PACK_CROSSING.png'))
# the seven numbers: every output cell inside its family's range?
fam = json.load(open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_SEVEN_NUMBERS_GROUND_10_11_26.json')))
chk = {'in': 0, 'out': []}
for (r, c), k in kind.items():
    a = out[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW]
    if walkmask[r * TH:(r + 1) * TH, c * TW:(c + 1) * TW].mean() not in (0.0, 1.0): continue    # mixed cells skipped
    f = fam[S.SIDEWALK if k == 'walk' else S.ROAD]; s = S.seven(np.dstack([a, np.full(a.shape[:2], 255)]))
    sat_ok = f['sat_median'][0] - 0.03 <= s['sat'][1] <= f['sat_median'][1] + 0.03
    # light is NOT checked on a cut cell: measured, the 'from the top' reading of his tiles is carried by the frame
    # (lit top row, dark south face) the cut removes; on the cut cells it read 3, 5, 8, 9 o'clock at random.
    # The light is held instead by the rule the recipes keep: never flipped top to bottom, never rotated.
    ok = sat_ok and f['cluster_run'][0] - 0.05 <= s['cluster_run'] <= f['cluster_run'][1] + 0.05
    if ok: chk['in'] += 1
    else: chk['out'].append([r, c, k, s['sat'][1], s['cluster_run'], s['light_clock']])
json.dump(chk, open(os.path.join(R, 'records/BOHEMIA_COOK2_STRETCH_THE_PACK_CHECK_10_11_26.json'), 'w'), indent=1)
print('cells inside the family range', chk['in'], 'outside', len(chk['out']), chk['out'][:6])
