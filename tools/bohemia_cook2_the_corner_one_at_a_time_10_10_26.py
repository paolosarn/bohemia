#!/usr/bin/env python3
"""COOK TWO [the corners] + [how the pack did it] + [one at a time] (rules 100, 101, 104b; Paolo 10/10:
'all of the corners where there should be a sidewalk connecting the different directions, it's not connecting').
ONE asset, at the highest quality this lane can reach, on ONE sheet beside its pack twin at 1:1, in the VOTE
tab, nothing in the game (rule 100a: this tool writes to records/ only).

STUDY (records/BOHEMIA_HOW_THE_PACK_DID_IT_SIDEWALK_10_10_26.md): his sidewalk is '1. Cracked contrete tiles'
(45, all UP): 96 x 94 px, four slabs a tile, a 2 px joint at 45-48, a 3 px dark baked border (rings 1-2 at lum
24-45), light from the top (top half +13 to +25 lum), ~4,300 colours (painted, no small palette). NO corner or
kerb tile exists in any of his packs. So the corner is BUILT, from his pixels only:
  * his slabs with the baked border cut off (3 px) so two tiles meet on a joint, never a border (rule 104b);
  * tiles are only ever flipped left-right, never up-down, so the top light holds;
  * the quiet slabs (0, 1, 2, 15, 16, his thin cracks) carry it; no weeds, no star (DIRECTION round three);
  * his road ('1. Cracked street tiles' 0, 1, 7, 8, border cut the same way);
  * the kerb is HIS slab's brightest row as the lit lip and his road's darkest as the 2 px shadow under it,
    following the corner on a 1.5-tile radius (a real kerb return is 3 to 9 m; here 4.5 m at his 30 px a metre).
  python3 tools/bohemia_cook2_the_corner_one_at_a_time_10_10_26.py
"""
import json, base64, io, os
import numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
packs = {}
for i in (1, 2, 3, 4): packs.update(json.load(open(os.path.join(R, f'banks/BOHEMIA_HD_TILE_REPO_part{i}.txt')))['packs'])
UP = {(v['pack'], v['idx']) for v in json.load(open(os.path.join(R, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))['verdicts'] if v['v'] == 'UP'}
SW, RD = '1. Cracked contrete tiles', '1. Cracked street tiles'
# the baked border, MEASURED per side (first round cut 3 px everywhere and the grid showed: seam step 207):
# his slab tiles carry 4 px of dark ring on top, left and right and 7 on the bottom (the slab's south face seen
# at 45 degrees, rows at lum 0-160 against an inside of ~330); his road 5 top and bottom, 4 at the sides.
CUT = {'1. Cracked contrete tiles': (6, 7, 5, 5), '1. Cracked street tiles': (5, 5, 5, 5)}   # round two: one more px where his lit edge row survived the cut   # top, bottom, left, right
TW, TH = 82, 81     # every tile cut to one size, centred on its own joint, so the joints line up

def tile(pack, i):
    assert (pack, i) in UP
    a = np.asarray(Image.open(io.BytesIO(base64.b64decode(packs[pack][i]['b64']))).convert('RGB'))
    t, b, l, r = CUT[pack]; a = a[t:a.shape[0] - b, l:a.shape[1] - r]
    y0 = (a.shape[0] - TH) // 2; x0 = (a.shape[1] - TW) // 2
    return a[y0:y0 + TH, x0:x0 + TW]

def field(pack, ids, n, seed):
    rng = np.random.RandomState(seed); out = np.zeros((n * TH, n * TW, 3), np.uint8)
    for y in range(n):
        for x in range(n):
            t = tile(pack, ids[rng.randint(len(ids))])
            if rng.rand() < 0.5: t = t[:, ::-1]          # left-right only: the light stays on top
            out[y * TH:(y + 1) * TH, x * TW:(x + 1) * TW] = t
    return out

N = 4; T = TW; SX, SY = N * TW, N * TH; S = SX
walk = field(SW, [0, 1, 2], N, 7)   # 15 and 16 carry a yellow fleck; his three cleanest slabs
road = field(RD, [0, 1, 7, 8], N, 11)
sl = walk.reshape(-1, 3).astype(int); LIP = sl[sl.sum(1).argsort()[-len(sl) // 40:]].mean(0)
rl = road.reshape(-1, 3).astype(int); SHADOW = rl[rl.sum(1).argsort()[:len(rl) // 20]].mean(0)

# the plan: a sidewalk one tile deep along the north and west sides, turning the corner on a radius
W1 = TH; RAD = int(1.5 * TH); cx = cy = W1 + RAD
yy, xx = np.mgrid[0:SY, 0:SX]
d = np.hypot(xx - cx, yy - cy)
inner = (xx < cx) & (yy < cy)                         # the corner quarter
is_walk = (yy < W1) | (xx < W1) | (inner & (d > RAD))
img = np.where(is_walk[..., None], walk, road).astype(float)
# the kerb: the edge of the walk, measured as the distance into the road side
edge = np.where(inner, d - RAD, np.where(xx >= cx, yy - W1, xx - W1))   # >0 is road, <0 is walk
lip = (edge > -3) & (edge <= -1); shadow = (edge > 0) & (edge <= 2)
# the light is from the top: a kerb face the eye sees is the one facing south (and the curve's south half)
img[lip] = img[lip] * 0.25 + LIP * 0.75
img[shadow] = img[shadow] * 0.35 + SHADOW * 0.65
out = img.clip(0, 255).astype(np.uint8)

# the twin: his raw tiles, border and all, at 1:1
tw = Image.new('RGB', (96 * 2 + 4, 96 * 2 + 4), (14, 14, 14))
for k, (p, i) in enumerate([(SW, 0), (SW, 1), (RD, 0), (RD, 1)]):
    tw.paste(Image.open(io.BytesIO(base64.b64decode(packs[p][i]['b64']))).convert('RGB'), ((k % 2) * 98, (k // 2) * 98))
# before: the kit's placeholder corner piece today (kit_street junction_walks, a quarter at 1:1)
before = Image.open(os.path.join(R, 'slices/fight_ground/kit_street/corner_nw.webp')).convert('RGB').crop((0, 0, SX, min(SY, 364)))
sheet = Image.new('RGB', (196 + 16 + before.width + 16 + SX, max(SY, 364) + 70), (14, 14, 14)); dr = ImageDraw.Draw(sheet)
x = 0
for lab, im in (('HIS PACK (the twin, raw)', tw), ('BEFORE: the corner now', before), ('AFTER: the corner from his slabs', Image.fromarray(out))):
    sheet.paste(im, (x, 50)); dr.text((x + 2, 8), lab, fill=(235, 235, 235)); x += im.width + 16
dr.text((2, 26), 'ONE QUESTION: does the sidewalk turn the corner like a real one?', fill=(235, 200, 120))
os.makedirs(os.path.join(R, 'records/target'), exist_ok=True)
sheet.save(os.path.join(R, 'records/target/COOK2_ONE_AT_A_TIME_THE_CORNER.png'))
Image.fromarray(out).save(os.path.join(R, 'records/target/COOK2_THE_CORNER_CANDIDATE.png'))
# measured, for the proof line: border pixels at every seam (rule 104b)
T = TW
seam = [abs(out[:, k * T - 1].astype(int).sum(1) - out[:, k * T].astype(int).sum(1)).mean() for k in range(1, N)]
inside = [abs(out[:, k * T + 40].astype(int).sum(1) - out[:, k * T + 41].astype(int).sum(1)).mean() for k in range(0, N)]
json.dump({'seam_step_mean': [round(v, 1) for v in seam], 'inside_step_mean': [round(v, 1) for v in inside],
           'lip_rgb': LIP.round().tolist(), 'shadow_rgb': SHADOW.round().tolist(), 'radius_px': RAD, 'size': [SX, SY]},
          open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_CORNER_MEASURED_10_10_26.json'), 'w'), indent=1)
print('seam', [round(v, 1) for v in seam], 'inside', [round(v, 1) for v in inside])
