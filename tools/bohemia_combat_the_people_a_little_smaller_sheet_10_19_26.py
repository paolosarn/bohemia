#!/usr/bin/env python3
"""THE PEOPLE A LITTLE SMALLER, the VOTE sheet (COMBAT [the people a little smaller]). Called by
tools/bohemia_combat_the_people_a_little_smaller_10_19_26.js with the frames it took from the game's own camera; this file
only lays them out and writes the captions. Nothing on the frames is drawn here."""
import json
import sys
from PIL import Image, ImageDraw, ImageFont

FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
BG, INK, DIM, GOLD = (13, 11, 9), (230, 217, 194), (156, 140, 116), (217, 168, 90)
FW, PAD = 300, 14
NAME = {104: 'BEFORE: 104', 92: 'NOW: 92, AN EIGHTH SMALLER', 84: 'A STEP MORE: 84'}


def fit(img, w):
    return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)


def main(spec_path):
    spec = json.load(open(spec_path))
    f_big, f_mid, f_small = ImageFont.truetype(BOLD, 30), ImageFont.truetype(BOLD, 17), ImageFont.truetype(FONT, 14)
    rows = spec['rows']
    opens = [fit(Image.open(r['open']).convert('RGB'), FW) for r in rows]
    closes = [fit(Image.open(r['close']).convert('RGB'), FW) for r in rows]
    width = len(rows) * (FW + PAD) + PAD
    oh, ch = max(i.height for i in opens), max(i.height for i in closes)
    height = 80 + 24 + oh + 56 + 24 + ch + 56
    sheet = Image.new('RGB', (width, height), BG)
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 14), 'THE PEOPLE A LITTLE SMALLER', font=f_big, fill=GOLD)
    d.text((PAD, 52), 'The same board, the same moment, three sizes. The house tiles do not change; the men do. His phone upright.', font=f_small, fill=DIM)
    y = 80
    d.text((PAD, y), 'AT THE OPEN, BOTH TEAMS', font=f_mid, fill=INK)
    y += 24
    for i, (r, im) in enumerate(zip(rows, opens)):
        x = PAD + i * (FW + PAD)
        sheet.paste(im, (x, y))
        d.text((x, y + im.height + 6), NAME.get(r['px'], str(r['px'])), font=f_mid, fill=GOLD)
        d.text((x, y + im.height + 28), 'the man %.1f house tiles tall' % (r['m']['man'] / r['m']['tile']), font=f_small, fill=INK)
    y += oh + 56
    d.text((PAD, y), 'CLOSE IN (THE PINCH\'S NEAR STOP)', font=f_mid, fill=INK)
    y += 24
    for i, (r, im) in enumerate(zip(rows, closes)):
        x = PAD + i * (FW + PAD)
        sheet.paste(im, (x, y))
        d.text((x, y + im.height + 6), NAME.get(r['px'], str(r['px'])), font=f_mid, fill=GOLD)
        d.text((x, y + im.height + 28), '%d px tall on his phone' % round(r['near']['man']), font=f_small, fill=INK)
    sheet.save(spec['out'], 'JPEG', quality=62, optimize=True, progressive=True)


if __name__ == '__main__':
    main(sys.argv[1])
