#!/usr/bin/env python3
"""BOHEMIA — TAKE THE NEXT PART, the stitcher (10/10/26, LIFE + CITY, [take the next part]).
Sets the three phone shots tools/bohemia_take_the_next_part_cook.js took of THE ALPHA side by side with one caption
each: a place you do not hold offering Take it, the fight at their gate, and the same place's build list after the win. Nothing in a shot is
drawn here.
REUSE CHECK: every pixel under the captions is the alpha as the phone shows it.
REFERENCE CHECK:  AH-01 the game's own frames.  BLDG-03 the game's light.  BLDG-05 the game's own placement.
Writes: slices/vote/LIFECITY_TAKE_THE_NEXT_PART_10_10.png
"""
import os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'records', 'lifecity_pictures', 'take_the_next_part')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_TAKE_THE_NEXT_PART_10_10.png')
CAPS = [('1_take_it', 'NOT YOURS: BUILD SAYS TAKE IT'), ('2_their_gate', 'THE FIGHT AT THEIR GATE'), ('3_yours', 'YOU WON: NOW YOU CAN BUILD THERE')]
W, BAND = 360, 30
cards = []
for k, cap in CAPS:
    f = os.path.join(SRC, k + '.png')
    if not os.path.exists(f):
        sys.exit('REFUSING: %s missing; run the .js first.' % f)
    im = Image.open(f).convert('RGB'); im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
    c = Image.new('RGB', (W, im.height + BAND), (18, 14, 10)); c.paste(im, (0, BAND))
    ImageDraw.Draw(c).text((8, 9), cap, fill=(233, 220, 196)); cards.append(c)
s = Image.new('RGB', (W * 3 + 16, cards[0].height), (8, 6, 4))
for i, c in enumerate(cards): s.paste(c, (i * (W + 8), 0))
s.save(OUT, optimize=True); print('TAKE THE NEXT PART: %d x %d, %.0f KB' % (s.size + (os.path.getsize(OUT) / 1024,)))
