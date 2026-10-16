#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the master rig]: the proof sheet. The eight facings from tools/bohemia_direction_master_rig.py
at one art pixel to one, beside his own car (the twin, '10. Abandoned cars' #3, his 7/13 UP set) and a 1.72 m man as
a 98 px ruler, so the true-size question is on the page, not in a sentence.

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index, the card of numbers,
skills/bohemia-pixel-art, AH-01, AH-03. No reference game.

usage: python3 tools/bohemia_direction_master_rig_sheet.py <rig out dir> <sheet.png>
"""
import os, sys, json
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D, OUT = sys.argv[1], sys.argv[2]
meta = json.load(open(os.path.join(D, 'rig.json')))
F = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf'), 16)
ims = [(f, Image.open(os.path.join(D, 'rig_%s.png' % f))) for f in meta['facings']]
twin = Image.open(os.path.join(ROOT, 'reference/art_bank/prop/pack_10_abandoned_cars_003.png')).convert('RGBA')
H = max(i.height for _, i in ims) + 90; W = sum(i.width for _, i in ims) + 14 * 11 + twin.width + 40
s = Image.new('RGB', (W, H), (22, 21, 20)); d = ImageDraw.Draw(s); x = 14
d.text((14, 6), 'THE MASTER RIG: ONE CAMERA (45 deg tilt, never turned), %d PX A METRE, EIGHT FACINGS, 1:1' % meta['ppm'], font=F, fill=(236, 230, 218))
for f, im in ims:
    s.paste(im, (x, 40 + (H - 90 - im.height)), im); d.text((x, H - 40), f, font=F, fill=(226, 162, 72)); x += im.width + 14
man = 98; d.rectangle([x, 40 + (H - 90 - man), x + 6, H - 50], fill=(150, 190, 160)); d.text((x - 4, H - 40), '1.72m', font=F, fill=(150, 190, 160)); x += 40
s.paste(twin, (x, 40 + (H - 90 - twin.height)), twin); d.text((x, H - 40), 'HIS CAR', font=F, fill=(150, 190, 160))
d.text((14, 24), 'model %s, real %s m; his car is drawn 96 px long: at true size a car is %d px' % (os.path.basename(meta['model']), meta['real_dims_m'], round(max(meta['real_dims_m'][:2]) * meta['ppm'])), font=F, fill=(146, 138, 126))
s.save(OUT); print(s.size)
