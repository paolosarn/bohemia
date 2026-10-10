#!/usr/bin/env python3
"""BOHEMIA — BUILT ON THE BOARD, the stitcher (10/9/26, LIFE + CITY, [built on the board]).
Crops YOUR side of the board out of the two phone shots tools/bohemia_built_on_the_board_cook.js took of
COMBAT's real fight (same seed, same place, the fight's own far stop) and sets them side by side, one caption
each. Nothing in a shot is drawn here.
REUSE CHECK: every pixel under the captions is the fight as the phone shows it.
REFERENCE CHECK:  AH-01 the game's own frames.  BLDG-03 the board's light.  BLDG-05 each thing on one open tile.
Writes: slices/vote/LIFECITY_BUILT_ON_THE_BOARD_10_9.png
"""
import os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'records', 'lifecity_pictures', 'built_on_the_board')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_BUILT_ON_THE_BOARD_10_9.png')
BOX, OUTW, BAND = (0, 650, 600, 1650), 450, 30
cards = []
for k, cap in (('without', 'A FIGHT AT YOUR BASE'), ('with', 'AFTER YOU BUILT: WALL, TANK, ROOF')):
    f = os.path.join(SRC, k + '.png')
    if not os.path.exists(f):
        sys.exit('REFUSING: %s is missing; run the .js first.' % f)
    im = Image.open(f).convert('RGB').crop(BOX); im = im.resize((OUTW, round(im.height * OUTW / im.width)), Image.LANCZOS)
    c = Image.new('RGB', (OUTW, im.height + BAND), (18, 14, 10)); c.paste(im, (0, BAND))
    ImageDraw.Draw(c).text((8, 9), cap, fill=(233, 220, 196)); cards.append(c)
s = Image.new('RGB', (OUTW * 2 + 8, cards[0].height), (8, 6, 4)); s.paste(cards[0], (0, 0)); s.paste(cards[1], (OUTW + 8, 0)); s.save(OUT, optimize=True)
print('BUILT ON THE BOARD: %d x %d' % s.size)
