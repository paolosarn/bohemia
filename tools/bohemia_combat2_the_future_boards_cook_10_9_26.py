#!/usr/bin/env python3
"""THE FUTURE BOARDS: THE SAME STREETS RECLAIMED, AND THE SAME STREETS FALLEN  (COMBAT 2, OPEN row [the future boards])

His second votes: 'the game starts in the ruin and the future gets better: reclaimed, techy, modern'; THE THREE
ACTS AT ONCE (the future is computed from the past); and 'the future goes both ways' (raided falls). So every
shipped fight block gets two futures on THE SAME PLAN AND THE SAME TILES, so a fight in act two or three is the
same place grown or fallen:

  RECLAIMED  solar panels on the clay roofs, raised garden beds in the yards, the wrecks hauled off the roads
             (cars and trailers out of the cover), every lamp burning (the grid is back).
  RAIDED     scorch across the ground, roofs burnt through, rubble in the yards and on the walks, every lamp
             dead (only the fires people keep), the wrecks still there.

Nothing is redrawn under the overlay and nothing comes within 0.6 m of a block's side, so every seam joins exactly
as the present day's does (rule 77; the gate reads every future board with the same reader).

  fight_ground.json futures[state] = {blocks: {id: src}, boards: {name: {cover, lights}}, what: '...'}
                                      state = 'reclaimed' | 'raided'; terrain is the present day's (same plan)

THE ANALOG HORROR LINE (rule 20): the reclaimed street is clean and lit and nobody is out; the raided one is the
same street a week after something came through.

REFERENCE CHECK (the 9/4 standing law):
  CGRD-01 INTO THE BREACH: the same board reads as the same place; the state is the overlay you notice second.
  TG-04 THE STREET TILE: the streets and their paint are untouched; only roofs, yards and debris change.
  AH-01 THE BIBLE: his ramps only (the panels' screen blue and the beds' greens are his tiles' own colours).
  REUSE CHECK: every block picture is the shipped one plus an overlay; rubble is R5.EXTRA; lights are the board's.

[bb the world state] Battle Brothers' settlements change state (raided, burning, prosperous) and their look and
  goods follow. OURS: the fight board itself follows the act and the raid.

    python3 tools/bohemia_combat2_the_future_boards_cook_10_9_26.py
"""
import json, os, random, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(REPO)
DIR = 'slices/fight_ground'
MAN = DIR + '/fight_ground.json'
A = [(16, 18, 22), (36, 35, 35), (56, 54, 50), (68, 63, 59), (80, 72, 64), (91, 81, 73), (106, 94, 80)]
C5, C3 = (170, 149, 118), (134, 118, 96)
PANEL, PANEL_LINE = (36, 35, 35), (79, 162, 194)
BEDS = [(32, 69, 50), (36, 88, 59), (55, 117, 79)]
SOIL = (80, 72, 64)
RUBBLE = ['rubble_%d' % i for i in range(12)]


def masks(a):
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    roof = (r > 150) & (g < 0.62 * r) & (b < 0.45 * r)                    # his clay roof tiles
    warm = r - b
    lot = (np.maximum(np.maximum(r, g), b) >= 112) & (warm >= 56) & (warm < 100)   # the yard tan (the edge reader's 'lot')
    return roof, lot


def keep_off_edges(m, px):
    m[:px, :] = False; m[-px:, :] = False; m[:, :px] = False; m[:, -px:] = False
    return m


def reclaimed(img, tile, seed):
    a = np.asarray(img.convert('RGB')).copy()
    roof, lot = masks(a)
    PX, PY = tile; H, W = a.shape[:2]; edge = int(PX / 12 * 0.6)
    roof, lot = keep_off_edges(roof, edge), keep_off_edges(lot, edge)
    over = Image.new('RGB', (W, H)); od = ImageDraw.Draw(over)
    paint = np.zeros((H, W), bool)
    rng = random.Random(seed)
    for ty in range(0, H, PY):
        for tx in range(0, W, PX):
            rm = roof[ty:ty + PY, tx:tx + PX]
            if rm.mean() > 0.12:                                          # SOLAR: a panel array over the roof
                ys, xs = np.where(rm)
                x0, x1 = tx + np.percentile(xs, 12), tx + np.percentile(xs, 88)
                y0, y1 = ty + np.percentile(ys, 10), ty + np.percentile(ys, 60)
                od.rectangle([x0, y0, x1, y1], fill=PANEL)
                for x in np.arange(x0, x1, 22): od.line([(x, y0), (x, y1)], fill=PANEL_LINE, width=2)
                for y in np.arange(y0, y1, 14): od.line([(x0, y), (x1, y)], fill=PANEL_LINE, width=1)
                od.rectangle([x0, y0, x1, y1], outline=C3, width=2)       # never the lane paint's colour
                sub = np.zeros((H, W), bool); sub[int(y0):int(y1) + 1, int(x0):int(x1) + 1] = True
                paint |= sub & roof
            lm = lot[ty:ty + PY, tx:tx + PX]
            if lm.mean() > 0.55 and rng.random() < 0.55:                  # GARDENS: raised beds in a yard
                bw, bh = int(PX * 0.1), int(PY * 0.32)
                for k in range(5):
                    x0 = tx + int(PX * 0.12) + k * int(PX * 0.16); y0 = ty + int(PY * 0.3)
                    od.rectangle([x0, y0, x0 + bw, y0 + bh], fill=SOIL)
                    for y in range(y0 + 6, y0 + bh - 4, 10): od.line([(x0 + 4, y), (x0 + bw - 4, y)], fill=BEDS[(k + y // 10) % 3], width=5)
                    sub = np.zeros((H, W), bool); sub[y0:y0 + bh + 1, x0:x0 + bw + 1] = True
                    paint |= sub & lot
    o = np.asarray(over)
    a[paint] = o[paint]
    return Image.fromarray(a)


def raided(img, tile, seed):
    a = np.asarray(img.convert('RGB')).copy()
    roof, lot = masks(a)
    PX, PY = tile; H, W = a.shape[:2]; edge = int(PX / 12 * 0.6)
    roof = keep_off_edges(roof, edge)
    rng = random.Random(seed)
    for ty in range(0, H, PY):                                            # BURNT THROUGH: some roofs char, a hole in each
        for tx in range(0, W, PX):
            rm = roof[ty:ty + PY, tx:tx + PX]
            if rm.mean() > 0.12 and rng.random() < 0.8:
                sub = a[ty:ty + PY, tx:tx + PX]
                ys, xs = np.where(rm)
                sub[rm] = np.where((ys[:, None] * 7 + xs[:, None] * 3) % 9 < 5, np.array(A[2]), np.array(A[1]))
                cy, cx = int(np.median(ys)), int(np.median(xs))
                hole = np.zeros_like(rm); hole[max(0, cy - 30):cy + 30, max(0, cx - 55):cx + 55] = True
                sub[hole & rm] = A[0]
    over = Image.new('L', (W, H), 0); od = ImageDraw.Draw(over)
    for _ in range(40):                                                   # SCORCH across the ground
        x, y = rng.randrange(edge, W - edge - 200), rng.randrange(edge, H - edge - 120)
        od.ellipse([x, y, x + rng.randrange(60, 200), y + rng.randrange(30, 120)], fill=255)
    sc = np.asarray(over) > 0
    sc = keep_off_edges(sc, edge)
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    road = (np.maximum(np.maximum(r, g), b) < 112) & (r - b < 45)        # the asphalt keeps its paint: scorch is on the ground beside it
    paint = np.zeros(sc.shape, bool)
    for col in ((170, 149, 118), (227, 130, 71), (255, 255, 250)): paint |= (np.abs(a.astype(int) - np.array(col)).max(2) <= 4)
    sc &= ~road & ~paint
    a[sc & ((np.indices(sc.shape).sum(0)) % 3 == 0)] = A[1]
    a[sc & ((np.indices(sc.shape).sum(0)) % 3 == 1)] = A[2]
    return Image.fromarray(a)


def main():
    m = json.load(open(MAN))
    tile = tuple(m['tile_px']); tm = m['tile_metres']
    fut = {'reclaimed': {'blocks': {}, 'boards': {}, 'what': 'act two/three grown: solar on the roofs, gardens in the yards, the wrecks hauled off, every lamp lit'},
           'raided': {'blocks': {}, 'boards': {}, 'what': 'the raid fell on it: scorch, roofs burnt through, rubble, every grid lamp dead, only the fires'}}
    for bid, b in sorted(m['blocks'].items()):
        im = Image.open(os.path.join(DIR, b['src'])).convert('RGB')
        for state, fn in (('reclaimed', reclaimed), ('raided', raided)):
            out = fn(im, tile, hash((bid, state)) & 0xffff if False else sum(map(ord, bid + state)))
            src = 'block_%s_%s.webp' % (bid.replace('.', '_'), state)
            out.save(os.path.join(DIR, src), 'WEBP', lossless=True, quality=100, method=4)
            fut[state]['blocks'][bid] = src
        print('  future', bid)
    for name, B in m['boards'].items():
        cars = ('car_lane', 'car_kerb', 'car_drive', 'trailer')
        rec_cover = [c for c in B['cover'] if c['piece'] not in cars]
        rec_lights = [dict(l, live=True) for l in B.get('lights', [])]
        rng = random.Random('raid-' + name)
        terr = B['terrain']; extra = []
        for _ in range(24 + 3 * len(B['blocks'][0]) * len(B['blocks'])):
            for _t in range(30):
                tx, ty_ = rng.randrange(len(terr[0])), rng.randrange(len(terr))
                if terr[ty_][tx] in ('flat', 'rough'): break
            extra.append(dict(piece=rng.choice(RUBBLE), x_m=round(tx * tm + 2 + rng.random() * 7, 1), y_m=round(ty_ * tm + 2 + rng.random() * 7, 1)))
        raid_lights = [dict(l, live=(l.get('circuit') == 'fire')) for l in B.get('lights', [])]
        fut['reclaimed']['boards'][name] = dict(cover=rec_cover, lights=rec_lights)
        fut['raided']['boards'][name] = dict(cover=B['cover'] + extra, lights=raid_lights)
    for k in RUBBLE:
        if k not in m['cover_extra']: sys.exit('REFUSED: %s is not a shipped piece' % k)
    m['futures'] = fut
    m['futures_key'] = {'states': 'reclaimed (act two/three grown) | raided (the future fallen)', 'terrain': 'the present day\'s: the same plan',
                        'use': 'swap blocks[id].src for futures[state].blocks[id] and the board\'s cover and lights for futures[state].boards[name]'}
    json.dump(m, open(MAN, 'w'), indent=1)
    print('ok: %d blocks x 2 futures, %d boards' % (len(m['blocks']), len(m['boards'])))


if __name__ == '__main__':
    main()
