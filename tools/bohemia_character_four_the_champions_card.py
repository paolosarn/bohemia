#!/usr/bin/env python3
"""THE CHAMPIONS: the VOTE card (CHARACTER 4, 11/27/26, rule 493(c)). Each band's champion beside three of his own men, drawn
from the fight's own sheets (slices/fight_rig: the frame the fight draws, his first facing), at the fight's size and at three
times it, and his face as his card shows it (the face strip the pack wrote). Reads the sheets
tools/bohemia_character_four_the_champions.py pack wrote. Writes CHARACTER_FOUR_THE_CHAMPIONS.webp and the tab's first picture."""
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/character/the_champions')
FR = os.path.join(ROOT, 'slices/fight_rig')
FIRST = os.path.join(ROOT, 'records/target/vote_first/character4-the-champions-11-27.webp')
BANDS = [
    ('THE ROAD CREW', 'the one in the long black coat and the black hat with the orange band',
     ['person_anarchists_0', 'person_cartel_0', 'person_homeless_1'], ['enemy_champion_road_0', 'enemy_champion_road_1']),
    ('THE KIDS', 'a black oversize coat over the pale kids, the runners\' green at his neck, his face shows',
     ['enemy_runner_0', 'enemy_runner_3', 'enemy_runner_5'], ['enemy_champion_kids_0', 'enemy_champion_kids_1']),
    ('THE HEAVIES', 'black leather under the frame, rust plate, a welder\'s mask down',
     ['enemy_heavy_0', 'enemy_heavy_1', 'enemy_heavy_3'], ['enemy_champion_heavy_0', 'enemy_champion_heavy_1']),
]


def font(sz, bold=False):
    p = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono%s.ttf' % ('-Bold' if bold else '')
    return ImageFont.truetype(p, sz) if os.path.exists(p) else ImageFont.load_default()


def frame(I, look, row=0):
    """the fight's own Stand frame of a look (row 0 is his first facing, S; row 1 SE), cropped to its pixels"""
    e = I['looks'][look]; s = Image.open(os.path.join(FR, e['file'])).convert('RGBA')
    c = s.crop((0, row * e['h'], e['w'], (row + 1) * e['h'])); return c.crop(c.getbbox())


def face(I, look):
    F = I['faces']; S = F['size']
    for strip in [dict(file=F['file'], order=F['order'])] + list(F.get('more', [])):
        if look in strip['order']:
            k = strip['order'].index(look); im = Image.open(os.path.join(FR, strip['file'])).convert('RGBA')
            return im.crop((k * S, 0, (k + 1) * S, S))
    return None


def card():
    I = json.load(open(os.path.join(FR, 'fight_rig.json')))
    W = 1000
    BG, INK, DIM, GROUND, GOLD = (24, 21, 18), (226, 214, 190), (150, 138, 116), (118, 106, 88), (224, 160, 64)
    band_h = 34 + 140 + 380
    H = 130 + band_h * len(BANDS) + 20
    c = Image.new('RGB', (W, H), BG); g = ImageDraw.Draw(c)
    g.text((20, 16), 'THE CHAMPIONS: THE BOSS OF HIS BAND', font=font(32, True), fill=INK)
    g.text((20, 60), 'Each band\'s named man beside three of his own, the way the fight draws them:', font=font(17), fill=DIM)
    g.text((20, 84), 'one to one on the ground, then three times, and his face as his card shows it.', font=font(17), fill=DIM)
    y = 124
    for name, line, band, champs in BANDS:
        g.text((20, y), name + ':', font=font(19, True), fill=GOLD); g.text((20 + 16 * len(name) + 16, y + 2), line, font=font(15), fill=INK)
        y += 30
        # one to one: his three men, then the two champions, on the ground's colour
        g.rectangle((20, y, W - 20, y + 132), fill=GROUND)
        x = 40
        for k, lk in enumerate(band + champs):
            im = frame(I, lk); c.paste(im, (x, y + 126 - im.size[1]), im); x += im.size[0] + (60 if k == len(band) - 1 else 26)
        g.text((x + 10, y + 52), '<- his men | the champions', font=font(14), fill=(40, 34, 28))
        y += 142
        # three times: one of his men, the two champions (south and south-east), their faces
        g.rectangle((20, y, W - 20, y + 370), fill=GROUND)
        x = 34
        for lk, row in ((band[0], 0), (champs[0], 0), (champs[1], 0), (champs[1], 1)):
            im = frame(I, lk, row); big = im.resize((im.size[0] * 3, im.size[1] * 3), Image.NEAREST)
            c.paste(big, (x, y + 362 - big.size[1]), big); x += big.size[0] + (40 if lk == band[0] else 14)
        fx = W - 20 - 128 - 10
        for k, lk in enumerate(champs):
            f = face(I, lk)
            if f: c.paste(f, (fx, y + 14 + k * 176), f)
            g.text((fx, y + 146 + k * 176), 'HIS CARD', font=font(12, True), fill=(40, 34, 28))
        y += 380
    os.makedirs(D, exist_ok=True)
    out = os.path.join(D, 'CHARACTER_FOUR_THE_CHAMPIONS.webp')
    c.save(out, 'WEBP', quality=90)
    os.makedirs(os.path.dirname(FIRST), exist_ok=True)
    c.crop((0, 0, W, 124 + 30 + 142)).resize((480, int(296 * 480 / W)), Image.LANCZOS).save(FIRST, 'WEBP', quality=86)
    print('card', c.size, os.path.getsize(out) // 1024, 'KB')


if __name__ == '__main__':
    card()
