#!/usr/bin/env python3
"""COOK TWO [the street kit from the packs] (rule 87, Paolo 10/10: 'the original street tiles and sidewalks
we downloaded, look again'; rule 82a: the approved packs are the source).

REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 10/10 at the seam): the twin is his approved pack
(reference/art_bank/road and ground, rule 82a) and the ground twin sheet (records/BOHEMIA_THE_REFERENCE_TWIN_THE_GROUND_10_10_26.md:
an outline with a lit edge, >= 30 colours per 1000 px, wear per piece); AH-01 and AH-03.

Every pixel of this kit is cut from his approved street pools (banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt:
'street' asphalt, 'side' sidewalk, 'cross' the zebra) stamped at 2x nearest (pixel art, no blur) onto the
house tile (515 x 364 px = 12 m, depth x cos45, the 45 DEGREE ART LAW). Nothing new is drawn except the paint
line and the kerb lip, and both take their colours from the pool tiles themselves (the line from the
lane_div's measured paint, the kerb from the sidewalk's brightest decile).
The road is 12 m, the sidewalk 1.5 m (an eighth of the road, his fifth vote). Rule 77: every piece carries
four typed edges (road, walk) and its lines in metres, written to kit_street.json; every piece keys the
(pool, index) of every stamp it used.
Analog horror (9/20): the asphalt is his cracked pool, the paint is thirty years washed (markings_30yr_law),
nothing on it is new; the dread is the line that keeps going with nobody on it.
[bb street tiles] Battle Brothers builds its battle ground from small edge-matched texture stamps over a
whole map, never a painted plate; ours stamps his pack's tiles the same way, at the house scale.
  python3 tools/bohemia_cook2_the_street_kit_from_the_packs_10_10_26.py
"""
import json, base64, io, os, random
import numpy as np
from PIL import Image
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, 'slices/fight_ground/kit_street')
TW, TH, M = 515, 364, 12.0
PXM_X, PXM_Y = TW / M, TH / M
SC = 2  # stamp scale
pools = json.load(open(os.path.join(R, 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt')))['pools']
def dec(b): return Image.open(io.BytesIO(base64.b64decode(b.split(',')[-1]))).convert('RGB')
P = {k: [dec(b) for b in pools[k]] for k in ('street', 'side', 'cross', 'lane_div')}
marks = json.load(open(os.path.join(R, 'banks/BOHEMIA_MARKING_BANK_7_17_26.txt')))['classes']
MK = {k: [dec(b) for b in marks[k]] for k in ('arrow_thru_h', 'arrow_thru_v')}
FLIPS = [None, Image.FLIP_LEFT_RIGHT, Image.FLIP_TOP_BOTTOM, Image.ROTATE_180]

def stamp_field(pool, seed, w=TW, h=TH):
    rng = random.Random(seed); used = []
    img = Image.new('RGB', (w, h))
    sw, sh = 44 * SC, round(44 * SC * 0.7071)
    # round two: the 2 m repeat was a grid of stamps lined up in rows; rows now run like brick (half a
    # stamp offset) and each stamp is flipped one of four ways (asphalt and slab have no up), so the eye
    # finds no column to follow
    for r, y in enumerate(range(0, h, sh)):
        for x in range(-(sw // 2) * (r % 2), w, sw):
            i = rng.randrange(len(P[pool])); f = rng.choice(FLIPS)
            used.append([pool, i])
            t = P[pool][i] if f is None else P[pool][i].transpose(f)
            img.paste(t.resize((sw, sh), Image.NEAREST), (x, y))
    return img, used

def paint_colour():
    a = np.asarray(P['cross'][0]).reshape(-1, 3).astype(int)   # the zebra's own paint: its brightest tenth
    return tuple(int(v) for v in a[a.sum(1).argsort()[-len(a) // 10:]].mean(0))
PAINT = paint_colour()
side_px = np.asarray(P['side'][0]).reshape(-1, 3)
KERB = tuple(side_px[side_px.sum(1).argsort()[-len(side_px) // 10:]].mean(0).astype(int))
SHADE = tuple(int(c * 0.45) for c in KERB)

def washed(img, box, col, a=0.55):
    x0, y0, x1, y1 = [int(v) for v in box]
    reg = np.asarray(img.crop((x0, y0, x1, y1))).astype(float)
    reg = reg * (1 - a) + np.array(col) * a
    img.paste(Image.fromarray(reg.astype(np.uint8)), (x0, y0))

def dashes(img, axis, pos_m):
    """a centre dash: 3 m painted in every 9 m, 0.15 m wide (US MUTCD 10 ft in 40 ft, read to metres)."""
    for s in np.arange(1.5, M, 9 if False else 6.0):
        if axis == 'ew':
            washed(img, (s * PXM_X, pos_m * PXM_Y - 3, (s + 3) * PXM_X, pos_m * PXM_Y + 3), PAINT, 0.7)
        else:
            washed(img, (pos_m * PXM_X - 3, s * PXM_Y, pos_m * PXM_X + 3, (s + 3) * PXM_Y), PAINT, 0.7)

WALK = 1.5
def walk_band(img, side, seed, keys):
    band, used = stamp_field('side', seed); keys += used
    if side == 'N': box = (0, 0, TW, WALK * PXM_Y)
    if side == 'S': box = (0, TH - WALK * PXM_Y, TW, TH)
    if side == 'W': box = (0, 0, WALK * PXM_X, TH)
    if side == 'E': box = (TW - WALK * PXM_X, 0, TW, TH)
    box = tuple(int(v) for v in box)
    img.paste(band.crop(box), box[:2])
    x0, y0, x1, y1 = box
    # the kerb lip: a lit edge where the walk meets the road and, south faces seen, the kerb's face below it
    if side == 'N': img.paste(KERB, (0, y1 - 3, TW, y1)); img.paste(SHADE, (0, y1, TW, y1 + 4))
    if side == 'S': img.paste(KERB, (0, y0, TW, y0 + 3))
    if side == 'W': img.paste(KERB, (x1 - 3, 0, x1, TH)); img.paste(SHADE, (x1, 0, x1 + 3, TH))
    if side == 'E': img.paste(KERB, (x0, 0, x0 + 3, TH)); img.paste(SHADE, (x0 - 3, 0, x0, TH))

def edges(walks, lines):
    e = {}
    for s in 'NSEW':
        if s in walks: e[s] = [['walk', 0, M]]
        else:
            runs = [['road', 0, M]]
            ends = [w for w in walks if (s in 'NS' and w in 'WE') or (s in 'EW' and w in 'NS')]
            for w in ends:
                if w in 'WN': runs = [['walk', 0, WALK]] + [['road', WALK, runs[-1][2]]]
                else: runs[-1][2] = M - WALK; runs.append(['walk', M - WALK, M])
            e[s] = runs
    return {'edges': e, 'lines': lines}

PIECES = {
  # name: (walks, centre-line axis, crossing)
  'road_ew': ('', 'ew', False), 'road_ns': ('', 'ns', False),
  'road_ew_walk_n': ('N', 'ew', False), 'road_ew_walk_s': ('S', 'ew', False),
  'road_ns_walk_w': ('W', 'ns', False), 'road_ns_walk_e': ('E', 'ns', False),
  'road_ew_both': ('NS', 'ew', False), 'road_ns_both': ('WE', 'ns', False),
  'junction': ('', None, False), 'crossing_ew': ('NS', None, 'ew'), 'crossing_ns': ('WE', None, 'ns'),
  'corner_nw': ('NW', None, False), 'corner_ne': ('NE', None, False),
  'corner_sw': ('SW', None, False), 'corner_se': ('SE', None, False),
  'walk': ('NSEW', None, False),
  'road_ew_arrow': ('NS', 'ew', False), 'road_ns_arrow': ('WE', 'ns', False),
}

def main():
    os.makedirs(OUT, exist_ok=True)
    man = {'lane': 'cook 2', 'rule': '87 / 82a / 77', 'tile_px': [TW, TH], 'tile_metres': M,
           'walk_metres': WALK, 'stamp': '44 px pool tile at 2x nearest, depth x cos45',
           'paint_rgb': list(map(int, PAINT)), 'kerb_rgb': list(map(int, KERB)),
           'compass': 'NORTH up the screen, SOUTH near, EAST right', 'pieces': {}}
    for n, (walks, axis, xing) in PIECES.items():
        seed = sum(map(ord, n))
        img, keys = stamp_field('street' if n != 'walk' else 'side', seed)
        if xing:
            for k in range(6):
                z = P['cross'][k % 3]
                if xing == 'ns':  # a zebra's bars run WITH the traffic: on a N-S road they stand N-S
                    x = int((1.0 + k * 1.8) * PXM_X); w = int(0.9 * PXM_X)
                    washed(img, (x, int(4 * PXM_Y), x + w, int(8 * PXM_Y)), PAINT, 0.6)   # a zebra is 4 m along the traffic, centred
                else:
                    y = int((1.0 + k * 1.8) * PXM_Y); hh = int(0.9 * PXM_Y)
                    washed(img, (int(4 * PXM_X), y, int(8 * PXM_X), y + hh), PAINT, 0.6)
            keys.append(['cross', 'paint colour'])
        if n.endswith('_arrow'):
            # his approved worn through-arrow (marking bank), one per lane, 2x nearest, washed into the asphalt
            k = 'arrow_thru_h' if '_ew_' in n else 'arrow_thru_v'
            # only the PAINT is lifted off his tile (pixels clearly brighter than its own asphalt), scaled to
            # a real through-arrow (~5 m along the lane), then washed in so the crack shows through it
            a = np.asarray(MK[k][0]).astype(int); lum = a.sum(2)
            mask = lum > np.percentile(lum, 50) + 120
            ys, xs = np.nonzero(mask); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
            mask = mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
            L = 5.0 * (PXM_X if k.endswith('h') else PXM_Y)
            f = L / (a.shape[1] if k.endswith('h') else a.shape[0])
            sz = (max(1, round(a.shape[1] * f)), max(1, round(a.shape[0] * f)))
            ai = Image.fromarray(a.astype(np.uint8)).resize(sz, Image.NEAREST)
            mi = Image.fromarray((mask * 165).astype(np.uint8)).resize(sz, Image.NEAREST)
            for lane in (0.3, 0.7):
                if k.endswith('h'): xy = (int(TW * 0.5 - sz[0] / 2), int(TH * lane - sz[1] / 2))
                else: xy = (int(TW * lane - sz[0] / 2), int(TH * 0.5 - sz[1] / 2))
                img.paste(ai, xy, mi)
            keys.append([k, 0])
        lines = []
        if axis:
            dashes(img, axis, M / 2); lines.append({'axis': axis, 'at_m': M / 2, 'kind': 'centre dash 3 m in 6 m'})
        if n != 'walk':
            for s in walks: walk_band(img, s, seed + ord(s), keys)
        e = edges(walks if n != 'walk' else 'NSEW', lines)
        img.save(os.path.join(OUT, n + '.webp'), lossless=True)
        man['pieces'][n] = dict(src=n + '.webp', **e, keys=sorted({tuple(k) for k in keys}))
    json.dump(man, open(os.path.join(OUT, 'kit_street.json'), 'w'), indent=1, default=list)
    # a sample board, 4 x 3 house tiles: a street running east-west with a cross street and a crossing
    lay = [['walk', 'road_ns_arrow', 'walk', 'walk'],
           ['road_ew_both', 'junction', 'crossing_ew', 'road_ew_arrow'],
           ['walk', 'crossing_ns', 'walk', 'walk']]
    board = Image.new('RGB', (TW * 4, TH * 3))
    for r, row in enumerate(lay):
        for c, n in enumerate(row): board.paste(Image.open(os.path.join(OUT, n + '.webp')), (c * TW, r * TH))
    board.save(os.path.join(OUT, 'sample_board.webp'), lossless=True)
    print('pieces', len(PIECES), 'paint', PAINT, 'kerb', KERB)
main()
