#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the map verdict]: measures the map stops the .js shot and lays them out beside Battle
Brothers' map at the same distance, in words from our library (their pictures are egress-blocked).

REFERENCE CHECK (the 9/4 standing duty): AH-01, AH-03, the BB density floor (3a/3b) and the [bb look] card.
Battle Brothers stays in its department (the map). No other reference game.

usage: python3 tools/bohemia_direction_map_verdict.py <shots dir> <out.png>
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, GOOD, BAD, DIM, BB = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (140, 132, 118), (150, 170, 190)


def band(L):
    L = L - L.mean(); P = np.abs(np.fft.fft2(L)) ** 2; P[0, 0] = 0
    fy = np.abs(np.fft.fftfreq(L.shape[0]))[:, None]; fx = np.abs(np.fft.fftfreq(L.shape[1]))[None, :]; t = P.sum()
    return round(float(P[(fx > 0.25) & (fy >= 0)].sum() / t), 3)


stops = json.load(open(os.path.join(SRC, 'stops.json')))
near = Image.open(os.path.join(SRC, 'near.png')).convert('RGB'); far = Image.open(os.path.join(SRC, 'far.png')).convert('RGB')
bn = band(np.asarray(near.convert('L')).astype(float)[1150:2250]); bf = band(np.asarray(far.convert('L')).astype(float)[1150:2250])
m = dict(stops=stops, band_near=bn, band_far=bf); print(json.dumps(m)); json.dump(m, open(OUT.replace('.png', '.json'), 'w'), indent=1)

F_T, F_L, F_S = ImageFont.truetype(ROM, 22), ImageFont.truetype(ROM, 16), ImageFont.truetype(ROM, 15)
S = 0.28; TW, TH = int(1170 * S), int(2532 * S)
COLS = [
    ('NEAR (where the map opens)', near,
     ['+ sharp now: detail %.3f (bar 0.020)' % bn, '+ parties are people, the lamps'],
     ['x every lot is the same grey grit', 'x a place reads only by its label'],
     ['each tile is one kind of ground', 'with its own painting; a town is', 'a cluster drawn bigger than life']),
    ('THE MIDDLE', None, [], ['x THERE IS NO MIDDLE: one pinch', '  jumps from %.2f straight to %.2f' % (stops[0], stops[1])],
     ['one painting at every size: the', 'wheel zooms smoothly, nothing', 'swaps or jumps']),
    ('FAR (the whole valley)', far,
     ['+ painted ridges, the lit Strip', '+ detail %.3f (bar 0.020)' % bf],
     ['x the city sits on a raised slab', '  with cliff walls, a game board', 'x every ridge is the same band', 'x every block is the same block'],
     ['forest, hills, roads and towns', 'stay distinct shapes by value', 'alone, under a three-value fog']),
]
W = 30 + 3 * TW + 2 * 26 + 30
H = 30 + 44 + 34 + TH + 20 + 7 * 24 + 20 + 26 + 3 * 22 + 30 + 4 * 26 + 30
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet)
d.text((30, 26), 'THE MAP AT EVERY STOP, AGAINST BATTLE BROTHERS', font=F_T, fill=INK)
for i, (title, im, good, bad, bb) in enumerate(COLS):
    x = 30 + i * (TW + 26); y = 76
    d.text((x, y), title, font=F_L, fill=DIM); y += 34
    if im is None:
        d.rectangle([x, y, x + TW, y + TH], outline=BAD, width=3)
        d.text((x + 20, y + TH // 2 - 20), 'NOTHING HERE', font=F_T, fill=BAD)
    else:
        sheet.paste(im.resize((TW, TH), Image.LANCZOS), (x, y))
    y += TH + 20
    for t in good: d.text((x, y), t, font=F_S, fill=GOOD); y += 24
    for t in bad: d.text((x, y), t, font=F_S, fill=BAD); y += 24
    y = 76 + 34 + TH + 20 + 7 * 24 + 20
    d.text((x, y), 'BATTLE BROTHERS HERE:', font=F_S, fill=BB); y += 26
    for t in bb: d.text((x, y), t, font=F_S, fill=BB); y += 22
y = 76 + 34 + TH + 20 + 7 * 24 + 20 + 26 + 3 * 22 + 24
for t in ['WHAT COOK PAINTS FIRST: 1 the city edge melting into the desert (no slab)',
          '2 lot kinds at the near end (yard, slab, lot, roof)   3 no two ridges alike',
          'RUN: a middle stop, one continuous pinch (rule 50)',
          '(their side is words from our notes: their screenshots are blocked from here)']:
    d.text((30, y), t, font=F_S, fill=INK if not t.startswith('(') else DIM); y += 26
sheet.save(OUT); print('sheet', sheet.size)
