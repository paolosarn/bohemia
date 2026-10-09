#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the demo verdict]: lays out the screens the .js shot, each with its mark in
two short lines, numbered to records/BOHEMIA_THE_DEMO_VERDICT_EVERY_SCREEN_10_9_26.md.

REFERENCE CHECK (the 9/4 standing duty): AH-01 (the bible and its AI-slop strand), AH-03 (the vibe-coded
tells), the style card, the floor pass bar. No reference game.

usage: python3 tools/bohemia_direction_the_demo_verdict.py <shots dir> <out.png>
"""
import sys, os, glob
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, GOOD, BAD, DIM = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (140, 132, 118)

def coarse(f):
    a = np.asarray(Image.open(f).convert('L').resize((390, 844))).astype(float)
    return np.abs(np.diff(a, axis=1)).mean()
cuts = sorted(glob.glob(os.path.join(SRC, '5_cut_*.png')))
if cuts:  # the frame of the cut that carries the least detail is the blob he sees
    Image.open(min(cuts, key=coarse)).save(os.path.join(SRC, '5_cut.png'))
SCREENS = [  # file, title, right, slop
    ('1_title', '1 TITLE', 'power lines, one lit window', 'gold-glitter logo; "NO RUN SAVED"'),
    ('2_picks', '2 PICKS', 'one screen, paper cards', 'loading list stapled under it'),
    ('3_map', '3 MAP', 'parties are people, the lamps', 'every lot the same grey grit'),
    ('4_arrived', '4 ARRIVED', 'travel works, the clock runs', 'nothing opens; labels collide'),
    ('5_cut', '5 INTO THE FIGHT', '-', 'a brown blob fills the screen'),
    ('6_fight', '6 FIGHT', 'the floor is a street now', 'men tiny; a box pops up'),
    ('7_fight_close', '7 FIGHT, ON AUTO', 'roofs, kerb and road read', 'not one man on the glass'),
    ('8_after', '8 AFTER', 'back on the map, paused', 'no "you won"; a box, no face'),
]
F_T, F_L, F_H = ImageFont.truetype(ROM, 22), ImageFont.truetype(ROM, 15), ImageFont.truetype(ROM, 30)
S = 0.25
TW, TH = int(1170 * S), int(2532 * S)
COLS, GAP, PAD = 3, 18, 22
cells = SCREENS + [None]
rows = (len(cells) + COLS - 1) // COLS
CH = 34 + TH + 8 + 21 * 4 + 18
W = PAD * 2 + COLS * TW + (COLS - 1) * GAP
H = PAD + 50 + rows * CH + PAD
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet)
d.text((PAD, PAD), 'THE DEMO, EVERY SCREEN A STRANGER MEETS', font=F_H, fill=INK)
for i, c in enumerate(cells):
    x = PAD + (i % COLS) * (TW + GAP); y = PAD + 50 + (i // COLS) * CH
    if c is None:
        d.text((x, y), '9 NOT IN THE DEMO', font=F_T, fill=INK)
        d.rectangle([x, y + 34, x + TW, y + 34 + TH], outline=BAD, width=3)
        for k, ln in enumerate(['no settlement screen', 'no market', 'no bag', 'no home', '',
                                'a tap on a place', 'walks you there', 'and nothing opens']):
            d.text((x + 18, y + 70 + k * 30), ln, font=F_T, fill=BAD if k < 4 else DIM)
        continue
    f, title, good, bad = c
    im = Image.open(os.path.join(SRC, f + '.png')).convert('RGB').resize((TW, TH), Image.LANCZOS)
    d.text((x, y), title, font=F_T, fill=INK)
    sheet.paste(im, (x, y + 34))
    ty = y + 34 + TH + 8
    for txt, col in ((('+ ' + good) if good != '-' else '', GOOD), ('x ' + bad, BAD)):
        line = ''
        for w in txt.split():
            if d.textlength((line + ' ' + w).strip(), font=F_L) > TW:
                d.text((x, ty), line, font=F_L, fill=col); ty += 21; line = w
            else: line = (line + ' ' + w).strip()
        if line: d.text((x, ty), line, font=F_L, fill=col); ty += 21
sheet.save(OUT)
print('sheet', sheet.size)
