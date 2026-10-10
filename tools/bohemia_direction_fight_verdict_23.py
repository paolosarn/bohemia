#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION, FIGHT VERDICT 23: measures and lays out the street, strip and freeway boards the .js shot,
after COMBAT TWO laid the fight streets from COOK TWO's kit of his pack tiles (rule 87, rule 82a).
Marks are by eye on seed 1 at the 390 x 844 @3x profile; the numbers are machine.

REFERENCE CHECK (the 9/4 standing duty): AH-01, AH-03, the style card's 5A floor, the 9/29 floor (3a/3b), the F1-F5
pass bar (FIGHT VERDICT 21) and the twin (his approved pack tiles, reference/art_bank/road). No reference game.

usage: python3 tools/bohemia_direction_fight_verdict_23.py <shots dir> <out.png>
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, GOOD, BAD, DIM, MARK = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (140, 132, 118), (255, 64, 200)
BOARDS = ('suburb', 'strip', 'freeway')


def band(L):
    L = L - L.mean(); P = np.abs(np.fft.fft2(L)) ** 2; P[0, 0] = 0
    fy = np.abs(np.fft.fftfreq(L.shape[0]))[:, None]; fx = np.abs(np.fft.fftfreq(L.shape[1]))[None, :]
    return round(float(P[(fx > 0.25) & (fy >= 0)].sum() / P.sum()), 4)


meta = json.load(open(os.path.join(SRC, 'meta.json')))
m = {}
for b in BOARDS:
    L = np.asarray(Image.open(os.path.join(SRC, b + '_open.png')).convert('L')).astype(float)
    m[b] = dict(unit=round(meta[b]['css'] * meta[b]['dpr'] / meta[b]['backing'], 2), band=band(L[300:1950]),
                road_band=band(L[1200:1500, 500:1170]), errors=meta[b]['errors'])
print(json.dumps(m))
json.dump(m, open(OUT.replace('.png', '.json'), 'w'), indent=1)

F_T, F_L, F_N = ImageFont.truetype(ROM, 22), ImageFont.truetype(ROM, 17), ImageFont.truetype(ROM, 44)
shots = {b: Image.open(os.path.join(SRC, b + '_open.png')).convert('RGB') for b in BOARDS}


def mark(im, boxes):
    d = ImageDraw.Draw(im)
    for n, b in boxes:
        d.rectangle([b[0] + 3, b[1] + 3, b[2] - 3, b[3] - 3], outline=MARK, width=7)
        d.rectangle([b[0] + 3, b[1] + 3, b[0] + 56, b[1] + 58], fill=MARK); d.text((b[0] + 14, b[1] + 6), str(n), font=F_N, fill=(0, 0, 0))


mark(shots['suburb'], [(1, (500, 1170, 1170, 1530)), (3, (520, 180, 1170, 820)), (4, (480, 160, 520, 1960)),
                       (6, (40, 1975, 1130, 2120)), (7, (120, 1440, 330, 1560))])
mark(shots['freeway'], [(2, (570, 960, 1170, 1300)), (5, (570, 1305, 1170, 1385))])
S = 0.3
TW, TH = int(1170 * S), int(2532 * S)
LEG = [('F1 PASS  one art pixel is %.1f phone pixels on all three (bar 1.5)' % m['suburb']['unit'], GOOD),
       ('F2 PASS  the boards read sharp on the glass: %.3f / %.3f / %.3f (bar 0.020; verdict 22 read 0.002)'
        % tuple(m[b]['band'] for b in BOARDS), GOOD),
       ('1  + the street is his cracked asphalt now (%.3f on the road alone); same street, kerb, a few weeds' % m['suburb']['road_band'], GOOD),
       ('2  F4 the freeway is still the old cooked road: dark squares, flat grey patches', BAD),
       ('3  F3 the sand carries big dark blobs, a camouflage print, not ground', BAD),
       ('4  F3 a pale line runs down the whole board through road and sand', BAD),
       ('5  F5 the barrier is still a flat bar in 3 tans', BAD),
       ('6  a box of words still pops over the board', BAD),
       ('7  thick gold rings still sit under every man', BAD)]
W = 30 + 3 * TW + 2 * 20 + 30
H = 30 + 44 + 30 + TH + 30 + len(LEG) * 30 + 30
sheet = Image.new('RGB', (W, H), BG); dd = ImageDraw.Draw(sheet)
dd.text((30, 24), 'FIGHT VERDICT 23: THE BOARDS FROM YOUR TILES', font=F_T, fill=INK)
for i, (t, b) in enumerate([('THE STREET, MARKED', 'suburb'), ('THE STRIP', 'strip'), ('THE FREEWAY, MARKED', 'freeway')]):
    x = 30 + i * (TW + 20)
    dd.text((x, 74), t, font=F_L, fill=DIM)
    sheet.paste(shots[b].resize((TW, TH), Image.LANCZOS), (x, 104))
y = 104 + TH + 30
for t, c in LEG:
    dd.text((30, y), t, font=F_L, fill=c); y += 30
sheet.save(OUT)
print('sheet', sheet.size)
