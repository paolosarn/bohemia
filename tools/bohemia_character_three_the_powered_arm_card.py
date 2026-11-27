#!/usr/bin/env python3
"""THE POWERED ARM: the VOTE card (CHARACTER 3, 11/27/26, rule 486). The model up close (a flat render of his posed arm, two
sides), both men in all eight turns at twice the fight's size, and both at the fight's own size on the ground's colour.
Reads records/target/character/the_powered_arm/ (tools/bohemia_character_three_the_powered_arm.py look; the close-ups by the
same model rendered close). Writes CHARACTER_THREE_THE_POWERED_ARM.webp and the tab's first picture."""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/character/the_powered_arm')
FIRST = os.path.join(ROOT, 'records/target/vote_first/character3-the-powered-arm-11-27.webp')
TURNS = ('S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW')


def font(sz, bold=False):
    p = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono%s.ttf' % ('-Bold' if bold else '')
    return ImageFont.truetype(p, sz) if os.path.exists(p) else ImageFont.load_default()


def card():
    W = 1000
    BG, INK, DIM, GROUND = (24, 21, 18), (226, 214, 190), (150, 138, 116), (74, 66, 54)
    stills = [[Image.open(os.path.join(D, 'look', 'enemy_powered_arm_%d' % m, 'rig_%s.png' % t)).convert('RGBA') for t in TURNS] for m in (0, 1)]
    close = [Image.open(os.path.join(D, 'close_%d_%d.webp' % (m, k))).convert('RGB') for m, k in ((0, 0), (0, 1), (1, 1))]
    H = 150 + 330 + 2 * 250 + 220
    c = Image.new('RGB', (W, H), BG); g = ImageDraw.Draw(c)
    g.text((20, 16), 'THE POWERED ARM', font=font(34, True), fill=INK)
    g.text((20, 62), 'Pulled off a dead man, refitted in a back room: a carbon socket on what is left', font=font(18), fill=DIM)
    g.text((20, 86), 'of his left arm, a gunmetal hand, tape, and a battery that is not its own.', font=font(18), fill=DIM)
    g.text((20, 110), 'UP CLOSE (the model):', font=font(16, True), fill=DIM)
    x = 20
    for im in close:
        im = im.resize((310, 310), Image.LANCZOS); c.paste(im, (x, 136)); x += 322
    y = 136 + 310 + 24
    for m, row in enumerate(stills):
        g.text((20, y), ('HIM IN A TANK TOP' if m == 0 else 'HIM UNDER A VEST AND A WATCH CAP') + ', EVERY TURN, TWICE THE FIGHT\'S SIZE', font=font(16, True), fill=DIM)
        x = 20
        for im in row:
            big = im.resize((im.size[0] * 2, im.size[1] * 2), Image.NEAREST)
            c.paste(big, (x, y + 22 + 228 - big.size[1]), big); x += big.size[0] + 44
        y += 250
    g.text((20, y + 4), 'AT THE FIGHT\'S OWN SIZE (one to one):', font=font(16, True), fill=DIM)
    g.rectangle((20, y + 30, W - 20, y + 30 + 150), fill=GROUND)
    x = 60
    for m in (0, 1):
        for t in ('S', 'SW', 'W'):
            im = stills[m][TURNS.index(t)]; c.paste(im, (x, y + 30 + 140 - im.size[1]), im); x += im.size[0] + 40
        x += 60
    g.text((560, y + 70), 'His own right arm is skin;', font=font(16), fill=INK)
    g.text((560, y + 94), 'the left is a dark socket, two', font=font(16), fill=INK)
    g.text((560, y + 118), 'bands of tape and a grey hand.', font=font(16), fill=INK)
    c.save(os.path.join(D, 'CHARACTER_THREE_THE_POWERED_ARM.webp'), 'WEBP', quality=90)
    os.makedirs(os.path.dirname(FIRST), exist_ok=True)
    c.crop((0, 0, W, 470)).resize((480, 226), Image.LANCZOS).save(FIRST, 'WEBP', quality=86)
    print('card', c.size, os.path.getsize(os.path.join(D, 'CHARACTER_THREE_THE_POWERED_ARM.webp')) // 1024, 'KB')


if __name__ == '__main__':
    card()
