#!/usr/bin/env python3
"""BOHEMIA — A RAID ON YOUR BASE, the stitcher (10/9/26, LIFE + CITY, [a raid on your base]).
Sets the three phone shots tools/bohemia_a_raid_on_your_base_cook.js took of THE ALPHA side by side with one caption
each: the crew coming (the phone says it), the fight at your gate, and the phone's word after. Nothing in a shot is
drawn here.
REUSE CHECK: every pixel under the captions is the alpha as the phone shows it.
REFERENCE CHECK:  AH-01 the game's own frames.  BLDG-03 the game's light.  BLDG-05 the game's own placement.
Writes: slices/vote/LIFECITY_A_RAID_ON_YOUR_BASE_10_9.png
"""
import os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'records', 'lifecity_pictures', 'a_raid_on_your_base')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_A_RAID_ON_YOUR_BASE_10_9.png')
CAPS = [('1_coming', 'A CREW IS COMING FOR YOUR BASE'), ('2_the_gate', 'YOU ARE HOME: THE FIGHT AT YOUR GATE'), ('3_held', 'YOU WON: YOUR BASE HELD')]
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
s.save(OUT, optimize=True); print('A RAID ON YOUR BASE: %d x %d, %.0f KB' % (s.size + (os.path.getsize(OUT) / 1024,)))
