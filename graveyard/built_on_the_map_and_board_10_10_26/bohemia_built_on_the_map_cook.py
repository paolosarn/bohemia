#!/usr/bin/env python3
"""BOHEMIA — BUILT ON THE MAP, the stitcher (10/9/26, LIFE + CITY, [built on the map]).
Crops your base out of the two shots tools/bohemia_built_on_the_map_cook.js took of the alpha's own map,
around the point the game itself drew the base (MAP_DREW.baseAt, where.json), and sets them side by side
with one caption each. Nothing in a shot is drawn here.
REUSE CHECK: every pixel under the captions is the alpha's own canvas.
REFERENCE CHECK:
  AH-01   the game's own frames, nothing composed.  BLDG-03 the street's north light.  BLDG-05 they stand.
Writes: slices/vote/LIFECITY_BUILT_ON_THE_MAP_10_9.png
"""
import json, os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'records', 'lifecity_pictures', 'built_on_the_map')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_BUILT_ON_THE_MAP_10_9.png')
W = json.load(open(os.path.join(SRC, 'where.json')))
DPR, HALF_W, UP, DOWN, BAND, OUTW = 3, 80, 50, 50, 30, 540
cards = []
for k, cap in (('before', 'YOUR BASE ON THE MAP'), ('after', 'NEXT MORNING: A WALL AND A TANK')):
    p = W.get(k)
    if not p:
        sys.exit('REFUSING: the game drew no plate for the base in the %s shot.' % k)
    im = Image.open(os.path.join(SRC, k + '.png')).convert('RGB')
    cx, cy = (p['sx'] - 30) * DPR, p['cy'] * DPR   # centred a little west: what you built stands there
    box = (int(cx - HALF_W * DPR), int(cy - UP * DPR), int(cx + HALF_W * DPR), int(cy + DOWN * DPR))
    crop = im.crop(box); crop = crop.resize((OUTW, round(crop.height * OUTW / crop.width)), Image.NEAREST)
    c = Image.new('RGB', (OUTW, crop.height + BAND), (18, 14, 10)); c.paste(crop, (0, BAND))
    ImageDraw.Draw(c).text((8, 9), cap, fill=(233, 220, 196)); cards.append(c)
sheet = Image.new('RGB', (OUTW * 2 + 8, cards[0].height), (8, 6, 4))
sheet.paste(cards[0], (0, 0)); sheet.paste(cards[1], (OUTW + 8, 0)); sheet.save(OUT, optimize=True)
print('BUILT ON THE MAP: %d x %d' % sheet.size)
