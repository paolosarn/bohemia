#!/usr/bin/env python3
"""BOHEMIA — BUILD ON THE SCREEN, the stitcher (10/9/26, LIFE + CITY, [build on the screen]).

Puts the three phone shots tools/bohemia_build_on_the_screen_cook.js took of the real settlement page side
by side, one caption line over each. Nothing in a shot is drawn here.
REUSE CHECK: every pixel under the captions is the game's own page (RUN TWO's settlement screen, COMBAT
TWO's painted town, the approved street's built things cut by tools/bohemia_lot_sprites_factory.py).
REFERENCE CHECK:
  AH-01   the ordinary frame with one wrong thing: the page's own; nothing composed.
  BLDG-03 one light direction: the built things carry the street's north light, like the town's roofs.
  BLDG-05 structural sanity: the wall and the tank stand on open ground with their own shadows.
Run from repo root after the .js.   Writes: slices/vote/LIFECITY_BUILD_ON_THE_SCREEN_10_9.png
"""
import os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'records', 'lifecity_pictures', 'build_on_the_screen')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_BUILD_ON_THE_SCREEN_10_9.png')
CAP = ['THE MOB HOLDS IT: NO', 'YOURS: WALL + TANK, 1 BATT EACH', 'NEXT DAY: BOTH STAND']
W, BAND = 390, 30
shots = []
for i in range(3):
    f = os.path.join(SRC, '%d.png' % (i + 1))
    if not os.path.exists(f):
        sys.exit('REFUSING: shot %d is missing; run the .js first.' % (i + 1))
    im = Image.open(f).convert('RGB'); im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
    c = Image.new('RGB', (W, im.height + BAND), (18, 14, 10)); c.paste(im, (0, BAND))
    d = ImageDraw.Draw(c); d.text((8, 9), CAP[i], fill=(233, 220, 196)); shots.append(c)
sheet = Image.new('RGB', (W * 3 + 16, shots[0].height), (8, 6, 4))
for i, c in enumerate(shots): sheet.paste(c, (i * (W + 8), 0))
sheet.save(OUT, optimize=True)
print('BUILD ON THE SCREEN: %d x %d, %.0f KB' % (sheet.width, sheet.height, os.path.getsize(OUT) / 1024))
