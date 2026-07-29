#!/usr/bin/env python3
"""
BOHEMIA — THE PALETTE A/B (7/29/26)

The one picture that decides whether the master palette lives. Same frame, same
map, same renderer, three tile sets: what Paolo approved (frozen), what the 7/28
re-cook made of it, and what one shared palette makes of it.

AND THE GREYSCALE ROW UNDERNEATH, which is the whole reason this work exists. M14
failed because a terracotta roof sat 6.5 luminance points off the gravel yard: in
colour you could tell them apart, in greyscale the roofs vanished into the ground
and the buildings stopped reading as buildings. Colour hides that. Greyscale cannot.
If the master column does not visibly separate roof from ground with the colour
turned off, it did not fix anything and it should be killed.

REUSE CHECK: draws no art. It composes three canvas screenshots taken by
tools/bohemia_master_palette_proof.js and desaturates copies of them.

  python3 tools/bohemia_palette_ab.py -> records/target/PALETTE_AB.png
"""
import os

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

T = 'records/target'
COLS = [('PAL_FROZEN.png', 'APPROVED', '9582 colours'),
        ('PAL_RECOOK.png', 'RE-COOK 7/28', '150 colours'),
        ('PAL_MASTER.png', 'ONE PALETTE 7/29', '39 colours')]
CROP = (0, 300, 968, 1180)   # the corner with roof, wall, door, ground, all at once
W, PAD, HDR = 300, 12, 46


def main():
    ims = [Image.open(os.path.join(T, f)).convert('RGB').crop(CROP) for f, _, _ in COLS]
    h = int(ims[0].size[1] * W / float(ims[0].size[0]))
    ims = [i.resize((W, h), Image.NEAREST) for i in ims]
    grey = [i.convert('L').convert('RGB') for i in ims]

    sheet = Image.new('RGB', (PAD + len(ims) * (W + PAD), HDR + h + 28 + h + PAD),
                      (18, 18, 20))
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 10), 'THE SAME STREET, THREE TILE SETS', fill=(236, 232, 224))
    d.text((PAD, 26), 'bottom row is the same picture with the colour turned off '
                      '- that is where the roofs used to disappear',
           fill=(150, 146, 140))
    for i, (im, g) in enumerate(zip(ims, grey)):
        x = PAD + i * (W + PAD)
        sheet.paste(im, (x, HDR))
        sheet.paste(g, (x, HDR + h + 28))
        d.text((x, HDR + h + 6), COLS[i][1], fill=(236, 232, 224))
        d.text((x + 150, HDR + h + 6), COLS[i][2], fill=(150, 146, 140))
    sheet.save(os.path.join(T, 'PALETTE_AB.png'))
    print('OK -> %s/PALETTE_AB.png  %s' % (T, sheet.size))


if __name__ == '__main__':
    main()
