#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [four phones]: lays the four live phone shots side by side with the act and the one line
that says what changed. REFERENCE CHECK (the 9/4 standing duty): AH-01, the AI-slop strand, AH-03, the UI three-acts
law, the three eras card. No reference game.
usage: python3 tools/bohemia_direction_four_phones.py <shots dir> <out.png>"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, GOOD, DIM = (13, 13, 18), (232, 224, 204), (199, 154, 63), (150, 142, 128)
P = [('salvage', 'ACT 1  CRACKED', ['as it ships: the worn rail,', 'one crack from the corner', 'it was dropped on']),
     ('repaired', 'ACT 2  REPAIRED', ['a rubber bumper, a screen', 'protector over the old crack,', 'tape where it started']),
     ('slab', 'ACT 3  RICH: THE SLAB', ['thin light metal, no crack,', 'smooth black glass: the', 'machine\'s finish']),
     ('yellowed', 'ACT 3  POOR: YELLOWED', ['act 1\'s phone forty years', 'on: yellowed, shattered,', 'the backlight dying'])]
ims = [Image.open(os.path.join(SRC, k + '.png')).convert('RGB') for k, _, _ in P]
H0 = max(i.height for i in ims); sc = 620 / H0
ims = [i.resize((int(i.width * sc), int(i.height * sc)), Image.LANCZOS) for i in ims]
F_T, F_L, F_S = ImageFont.truetype(ROM, 24), ImageFont.truetype(ROM, 17), ImageFont.truetype(ROM, 15)
CW = max(i.width for i in ims) + 60
W = 30 + 4 * CW + 10; H = 30 + 44 + 34 + 620 + 20 + 3 * 22 + 40 + 2 * 24 + 30
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet)
d.text((30, 24), 'THE FOUR PHONES: THE SAME PHONE, ACT BY ACT (the game\'s own phone, new values)', font=F_T, fill=INK)
for i, ((k, t, cap), im) in enumerate(zip(P, ims)):
    x = 30 + i * CW; y = 78
    d.text((x, y), t, font=F_L, fill=GOOD); y += 34
    sheet.paste(im, (x + (CW - 60 - im.width) // 2, y)); y += 620 + 20
    for ln in cap: d.text((x, y), ln, font=F_S, fill=DIM); y += 22
y = 78 + 34 + 620 + 20 + 3 * 22 + 30
for t in ['The words on the glass never change; the object around them does. Act 3 is the ledgers\' call, rich or poor.',
          'Rendered live: the game\'s phone reading the card\'s values. The tape is one new strip; the rest is settings.']:
    d.text((30, y), t, font=F_S, fill=INK); y += 24
sheet.save(OUT); print('sheet', sheet.size)
