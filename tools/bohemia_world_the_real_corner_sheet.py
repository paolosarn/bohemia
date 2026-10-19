#!/usr/bin/env python3
"""WORLD [the dam in one place], round two (10/19): the VOTE sheet. Two crops of the demo's own map frame at the corner,
side by side at 1:1 (no scaling, the phone's own pixels), from tools/bohemia_world_the_real_corner_shot.js:
  LEFT  NOW        the valley's corner as main draws it (the lake as rows of pools, the dam's wall, Boulder City's roofs,
                   and the far land's painted LAKE MEAD beside it)
  RIGHT THE REAL   the same frame with the candidate applied (the McCullough foothills, MacDonald Highlands' hill houses,
                   the Pittman flood basin; no lake beside the city)
  python3 tools/bohemia_world_the_real_corner_sheet.py <scratch-dir>   ->  slices/vote/WORLD_THE_REAL_CORNER_10_19.jpg
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
S = sys.argv[1]
BOX = (0, 700, 680, 1800)            # the corner, left of the phone's feed, at the shot's own pixels
OUT = os.path.join(ROOT, 'slices/vote/WORLD_THE_REAL_CORNER_10_19.jpg')
FONT = os.path.join(ROOT, 'slices/fonts/BohemiaCasing-Regular.ttf')

a = Image.open(os.path.join(S, 'now.png')).convert('RGB').crop(BOX)
b = Image.open(os.path.join(S, 'real.png')).convert('RGB').crop(BOX)
w, h = a.size
pad, head = 16, 64
sheet = Image.new('RGB', (w * 2 + pad * 3, h + head + pad), (16, 13, 10))
sheet.paste(a, (pad, head)); sheet.paste(b, (pad * 2 + w, head))
d = ImageDraw.Draw(sheet)
f = ImageFont.truetype(FONT, 30)
d.text((pad, 16), 'NOW: THE DAM AND BOULDER CITY IN TOWN', font=f, fill=(232, 220, 196))
d.text((pad * 2 + w, 16), 'THE REAL: HILLS, HILL HOUSES, A FLOOD BASIN', font=f, fill=(232, 220, 196))
sheet.save(OUT, quality=86)
print(OUT, sheet.size, os.path.getsize(OUT))
