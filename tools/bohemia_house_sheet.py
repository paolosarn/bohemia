#!/usr/bin/env python3
"""
BOHEMIA — HOUSE 01 AGAINST A PERSON (7/29/26)

Paolo: "lets make a single house realistic to human sizing please."

THE ONLY PROOF OF HUMAN SIZING IS A HUMAN. A dimension table saying "the door is
2.03 m" checks my arithmetic against itself. This puts the ACTUAL player sprite —
lifted off the CHARACTER tab's own canvas by tools/bohemia_house_scale_proof.js, not
redrawn — next to the front door at the same scale, which is the comparison his eye
can make in one second.

THE SPRITE MEASURES 102 px TALL. At this world's 1.705 cm per pixel that is 1.74 m,
which is a real adult, so the character is not the thing that is wrong. The door
beside it is 119 px = 2.03 m, and a door standing 29 cm over a person's head is what
a door does.

FOR CONTRAST, THE SAME PERSON AGAINST THE DOOR THE TILE GRID GIVES YOU: 2 cells is
88 px is 1.50 m, which is 24 cm SHORTER than he is. That panel is on the sheet
because the number alone does not land the way the picture does.

REUSE CHECK: cooks no colour and draws no art. It composites two existing images
(records/target/HOUSE_01.png and HERO_SPRITE.png) and rules some measuring lines.

  python3 tools/bohemia_house_sheet.py -> records/target/HOUSE_01_SHEET.png
"""
import json
import os

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

T = 'records/target'
PX_M = 0.75 / 44.0
INK, DIM, BG = (236, 232, 224), (150, 146, 140), (18, 18, 20)
ACC = (199, 154, 63)


def main():
    house = Image.open(os.path.join(T, 'HOUSE_01.png')).convert('RGBA')
    sprite = Image.open(os.path.join(T, 'HERO_SPRITE.png')).convert('RGBA')
    bx, by, bw, bh = json.load(open(os.path.join(T, 'HERO_SPRITE.json')))
    hero = sprite.crop((bx, by, bx + bw, by + bh))

    HW, HH = house.size
    PAD, HDR = 26, 92
    sheet = Image.new('RGB', (HW + PAD * 2, HDR + HH + 300), BG)
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 14), 'HOUSE 01   BUILT TO A REAL PERSON', fill=INK)
    d.text((PAD, 32), '15.0 x 9.0 m footprint (1453 sq ft) / 8 ft plate / '
                      '36x80 in door / 16x7 ft garage', fill=DIM)
    d.text((PAD, 48), 'the figure is the actual player sprite, same scale, '
                      'not a stand-in', fill=DIM)
    d.text((PAD, 64), '1 pixel = 1.7 cm', fill=ACC)

    y0 = HDR
    sheet.paste(house, (PAD, y0), house)
    ground = y0 + HH

    # THE PERSON STANDS BESIDE THE FRONT DOOR, not wherever there was room. The
    # first version put him in front of a window, which compares him to nothing.
    # The door is the reference everyone already knows the size of.
    gx = int(round(0.9 / PX_M))
    door_x = gx + int(round(4.877 / PX_M)) + int(round(1.2 / PX_M))
    hx = PAD + door_x + int(round(0.914 / PX_M)) + 14
    sheet.paste(hero, (hx, ground - hero.size[1]), hero)

    # ---- measuring lines. Only three, and each one is a number he can check.
    def vdim(x, top, bot, label):
        d.line([(x, top), (x, bot)], fill=ACC)
        d.line([(x - 4, top), (x + 4, top)], fill=ACC)
        d.line([(x - 4, bot), (x + 4, bot)], fill=ACC)
        # a dark plate behind the text: version one ruled these straight over the
        # stucco and the numbers were unreadable, which defeats a measuring line
        ty = (top + bot) // 2 - 6
        d.rectangle([x + 5, ty - 2, x + 9 + 7 * len(label), ty + 12], fill=(14, 13, 12))
        d.text((x + 7, ty), label, fill=ACC)

    door_h = int(round(2.032 / PX_M))
    plate = int(round(2.44 / PX_M))
    vdim(PAD + 8, ground - plate, ground, '2.44 m  plate')
    vdim(hx + hero.size[0] + 10, ground - hero.size[1], ground,
         '1.74 m  the person')

    d.text((PAD, ground + 14),
           'the door is 2.03 m, which is 29 cm over his head. That is what a door does.',
           fill=INK)
    d.text((PAD, ground + 34),
           'WHAT THIS FIXES: the tile grid can only give a 2-cell door, and 2 x 0.75 m '
           '= 1.50 m.', fill=(255, 122, 109))
    d.text((PAD, ground + 50),
           'That is 24 cm SHORTER than he is. He could not walk through his own front '
           'door standing up.', fill=(255, 122, 109))
    d.text((PAD, ground + 82),
           'NOT APPROVED. Candidate 1 of a target 16. Thumb it and I build the other '
           'fifteen to these numbers.', fill=DIM)

    # THE OLD DOOR, DRAWN TO SCALE, WITH THE SAME MAN BESIDE IT. The first version
    # sketched a 40x60 box and called it 1.50 m, which is a made-up rectangle in a
    # picture whose entire subject is scale. Both doors and both figures here are
    # the same pixels per metre as the house above them.
    bad = int(round(1.50 / PX_M))
    bx0 = PAD + HW - 210
    base = ground + 108 + hero.size[1]
    for lbl, hgt, col, ox in (('2.03 m', door_h, ACC, 0), ('1.50 m', bad, (255, 122, 109), 118)):
        d.rectangle([bx0 + ox, base - hgt, bx0 + ox + 54, base], outline=col)
        d.text((bx0 + ox, base + 6), lbl, fill=col)
    sheet.paste(hero, (bx0 + 62, base - hero.size[1]), hero)
    d.text((bx0 - 4, base + 26), 'the door he has now, and the one he needs',
           fill=DIM)

    sheet.save(os.path.join(T, 'HOUSE_01_SHEET.png'))
    print('OK -> %s/HOUSE_01_SHEET.png  %s' % (T, sheet.size))
    print('   hero %dx%d px = %.2f m tall' % (hero.size[0], hero.size[1],
                                              hero.size[1] * PX_M))
    print('   door %d px = %.2f m   plate %d px = %.2f m'
          % (door_h, door_h * PX_M, plate, plate * PX_M))


if __name__ == '__main__':
    main()
