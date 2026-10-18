#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION, FIGHT VERDICT 22: measures and lays out the freeway and street boards the .js shot.
Marks on the freeway frame are by eye on seed 1 at the 390 x 844 @3x profile; the numbers are machine.

REFERENCE CHECK (the 9/4 standing duty): AH-01, AH-03, the style card's 5A floor, the 9/29 floor and the
F1-F5 pass bar. No reference game.

usage: python3 tools/bohemia_direction_fight_verdict_22.py <shots dir> <out.png>
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, GOOD, BAD, DIM, MARK = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (140, 132, 118), (255, 64, 200)


def band(L):
    L = L - L.mean(); P = np.abs(np.fft.fft2(L)) ** 2; P[0, 0] = 0
    fy = np.abs(np.fft.fftfreq(L.shape[0]))[:, None]; fx = np.abs(np.fft.fftfreq(L.shape[1]))[None, :]; t = P.sum()
    return round(float(P[(fx > 0.25) & (fy >= 0)].sum() / t), 4), round(float(P[(fy > 0.25) & (fx >= 0)].sum() / t), 4)


def kpx(name):
    a = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_ground', name + '.webp')).convert('RGBA')); op = a[..., 3] > 0
    return round(len(np.unique(a[op][:, :3], axis=0)) / (op.sum() / 1000), 2)


meta = json.load(open(os.path.join(SRC, 'meta.json')))
m = {}
for b in ('freeway', 'suburb'):
    L = np.asarray(Image.open(os.path.join(SRC, b + '_open.png')).convert('L')).astype(float)[300:1950, :]
    m[b] = dict(unit=round(meta[b]['css'] * meta[b]['dpr'] / meta[b]['backing'], 2), band=band(L), errors=meta[b]['errors'])
m['jersey_col_per_kpx'], m['trailer_col_per_kpx'] = kpx('cover_jersey'), kpx('cover_trailer')
print(json.dumps(m))
json.dump(m, open(OUT.replace('.png', '.json'), 'w'), indent=1)

F_T, F_L, F_N = ImageFont.truetype(ROM, 22), ImageFont.truetype(ROM, 17), ImageFont.truetype(ROM, 44)
fw = Image.open(os.path.join(SRC, 'freeway_open.png')).convert('RGB'); d = ImageDraw.Draw(fw)
for n, b in [(1, (510, 1300, 1170, 1410)), (2, (510, 1240, 1170, 1300)), (4, (600, 960, 1170, 1240)),
             (5, (470, 940, 610, 1730)), (6, (45, 1975, 1125, 2120)), (7, (100, 330, 380, 1830))]:
    d.rectangle([b[0] + 3, b[1] + 3, b[2] - 3, b[3] - 3], outline=MARK, width=7)
    d.rectangle([b[0] + 3, b[1] + 3, b[0] + 56, b[1] + 58], fill=MARK); d.text((b[0] + 14, b[1] + 6), str(n), font=F_N, fill=(0, 0, 0))
S = 0.3
tiles = [('THE STREET (the kit)', Image.open(os.path.join(SRC, 'suburb_open.png')).convert('RGB')),
         ('THE FREEWAY, MARKED', fw),
         ('THE FREEWAY, WHOLE', Image.open(os.path.join(SRC, 'freeway_wide.png')).convert('RGB'))]
TW, TH = int(1170 * S), int(2532 * S)
LEG = [('+ no wall across the lanes; one asphalt for street and freeway; your men open at full size', GOOD),
       ('1  the barrier is a flat bar in 3 tans (%.2f colours per 1000 px, floor 1.55)' % m['jersey_col_per_kpx'], BAD),
       ('2  the edge lines are the loudest thing on the board (orange, #db7e46)', BAD),
       ('3  the new trailer piece is a box in 4 colours (%.2f per 1000 px)' % m['trailer_col_per_kpx'], BAD),
       ('4  the art is sharp (0.038) but the screen shows it soft (%.3f, bar 0.020); dark squares repeat' % m['freeway']['band'][0], BAD),
       ('5  a dark band and a grid line run down through the road', BAD),
       ('6  a box of words pops over the board', BAD),
       ('7  thick gold rings under every man', BAD)]
W = 30 + 3 * TW + 2 * 20 + 30
H = 30 + 44 + 30 + TH + 30 + len(LEG) * 30 + 30
sheet = Image.new('RGB', (W, H), BG); dd = ImageDraw.Draw(sheet)
dd.text((30, 24), 'FIGHT VERDICT 22: THE FREEWAY AGAINST THE STREET', font=F_T, fill=INK)
for i, (t, im) in enumerate(tiles):
    x = 30 + i * (TW + 20)
    dd.text((x, 74), t, font=F_L, fill=DIM)
    sheet.paste(im.resize((TW, TH), Image.LANCZOS), (x, 104))
y = 104 + TH + 30
for t, c in LEG:
    dd.text((30, y), t, font=F_L, fill=c); y += 30
sheet.save(OUT)
print('sheet', sheet.size)
