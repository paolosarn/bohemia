#!/usr/bin/env python3
"""BOHEMIA -- HOME RESEARCH, ROUND 3: OUR ONE SCREEN, THREE DIRECTIONS AS MOCKS (rule 349(e); ask line 359; 11/3/26).

A MOCK, NOTHING NEW MODELLED: each direction is drawn as our one settlement screen (upright, 390 x 844 in shape) cut from a town picture
we already ship (slices/settlement_ground_towns/<town>_tall.webp, COOK's tall towns) with words and marks laid on top: the lots you tap,
the bosses' prizes where they would stand, the daily bill, and the word MOCK on every picture. No pixel of a building is added.

  A  THE BLOCK YOU TOOK   from custom_tall.webp: the place painted like every town, about twelve fixed lots, the prizes on named lots
  B  THE CUTAWAY          from reds_tall.webp: the open concrete frame top left, enlarged, floor by floor
  C  THE RING             from volunteers_tall.webp: one heart in the middle, the lots in rings, past the reached ring dimmed

  python3 tools/bohemia_home_research_mocks_11_3_26.py
  -> records/target/home_research/mock_a.webp, mock_b.webp, mock_c.webp, vote_one_screen_abc.webp (the VOTE card's picture)
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(R, 'slices/settlement_ground_towns')
OUT = os.path.join(R, 'records/target/home_research')
PW, PH = 540, 1169                       # 390 x 844 in shape
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(n): return ImageFont.truetype(F, n)
GOLD, INK, BONE, RED, DIM = (226, 176, 82), (18, 16, 14), (232, 222, 200), (196, 72, 56), (140, 132, 120)


def tall(name):
    return Image.open(os.path.join(SRC, name + '_tall.webp')).convert('RGB')


def crop_phone(im, x0):
    """the upright phone's share of a tall town picture (full height, 0.462 of it wide), scaled to the mock"""
    w = int(round(im.size[1] * PW / PH))
    return im.crop((x0, 0, x0 + w, im.size[1])).resize((PW, PH), Image.LANCZOS), PW / w


def label(d, xy, text, size=17, fill=BONE, bg=INK, pad=5, anchor='l'):
    f = font(size); x, y = xy; w = d.textlength(text, font=f); h = size + 2 * pad
    if anchor == 'c': x -= w / 2 + pad
    d.rounded_rectangle([x, y, x + w + 2 * pad, y + h], 6, fill=bg)
    d.text((x + pad, y + pad - 1), text, font=f, fill=fill)


def lot(d, xy, n, r=15):
    x, y = xy
    d.ellipse([x - r, y - r, x + r, y + r], fill=INK, outline=BONE, width=2)
    f = font(15); t = str(n); d.text((x - d.textlength(t, font=f) / 2, y - 9), t, font=f, fill=BONE)


def prize(d, xy, text, sub, left=False):
    x, y = xy
    d.ellipse([x - 13, y - 13, x + 13, y + 13], fill=GOLD, outline=INK, width=3)
    if left:
        w1 = d.textlength(text, font=font(16)) + 10; w2 = d.textlength(sub, font=font(13)) + 8
        label(d, (x - 18 - w1, y - 22), text, 16, INK, GOLD); label(d, (x - 18 - w2, y + 4), sub, 13, BONE, INK, 4)
        return
    label(d, (x + 18, y - 22), text, 16, INK, GOLD)
    label(d, (x + 18, y + 4), sub, 13, BONE, INK, 4)


def chrome(im, title):
    """the bill on top (the same strip in every direction) and MOCK on every picture"""
    d = ImageDraw.Draw(im, 'RGBA')
    d.rectangle([0, 0, PW, 92], fill=(14, 12, 10, 228))
    d.text((14, 8), title, font=font(19), fill=BONE)
    d.text((14, 36), 'A DAY:  -18 BATTERIES   +7 BACK   9 PEOPLE', font=font(15), fill=GOLD)
    for k, (nm, v) in enumerate((('POWER', 0.62), ('FOOD', 0.48), ('WATER', 0.7))):
        x = 14 + k * 172; d.text((x, 62), nm, font=font(12), fill=DIM)
        d.rectangle([x + 58, 64, x + 158, 76], outline=DIM); d.rectangle([x + 59, 65, x + 59 + int(98 * v), 75], fill=GOLD)
    label(d, (PW - 92, 100), 'MOCK', 18, BONE, RED)
    return d


def mock_a():
    im, k = crop_phone(tall('custom'), 90)
    d = chrome(im, 'A  THE BLOCK YOU TOOK  (tap to name it)')
    P = lambda x, y: (int((x - 90) * k), int(y * k))
    for n, (x, y) in enumerate([(600, 180), (820, 330), (390, 610), (390, 820), (700, 830), (560, 1060),
                                (170, 1030), (420, 1240), (700, 1260), (400, 1480), (810, 1430), (650, 1640)], 1):
        lot(d, P(x, y), n)
    prize(d, P(210, 330), 'YOUR KITCHEN', 'THE POT, in the garage')
    prize(d, P(880, 690), 'YOUR MAIN', 'THE TAP, at the road', left=True)
    prize(d, P(880, 960), 'YOUR PURIFIER', 'THE FILTER, beside it', left=True)
    label(d, (14, PH - 44), 'TAP A LOT: what stands, its level, its look', 15)
    return im


def mock_b():
    src = tall('reds')
    top = src.crop((0, 0, 340, 470)).resize((PW, int(470 * PW / 340)), Image.LANCZOS)
    rest = src.crop((0, 470, 340, 470 + int((PH - top.size[1]) * 340 / PW) + 2)).resize((PW, PH - top.size[1]), Image.LANCZOS)
    im = Image.new('RGB', (PW, PH)); im.paste(top, (0, 0)); im.paste(rest, (0, top.size[1]))
    d = chrome(im, 'B  THE CUTAWAY  (one building, open)')
    s = PW / 340
    for (y, t, sub, gold) in ((40, 'ROOF', 'panels and the tank', False), (135, 'FLOOR 3', 'your people\'s rooms', False),
                              (245, 'FLOOR 2', 'YOUR KITCHEN, THE POT', True), (350, 'FLOOR 1', 'PURIFIER + MAIN, THE FILTER + THE TAP', True)):
        yy = max(104, int(y * s))
        label(d, (14, yy), t, 16, INK if gold else BONE, GOLD if gold else INK)
        label(d, (14, yy + 30), sub, 13)
    yb = top.size[1] + 40
    d.rectangle([0, top.size[1], PW, top.size[1] + 6], fill=(10, 10, 10))
    label(d, (14, yb), 'BASEMENT, ACT TWO: dig down (the inside screen)', 15, BONE, (60, 30, 26))
    label(d, (14, PH - 44), 'TAP A FLOOR: what room, its level, its look', 15)
    return im


def mock_c():
    im, k = crop_phone(tall('volunteers'), 90)
    cx, cy = int((512 - 90) * k), int(900 * k)
    mask = Image.new('L', im.size, 0); ImageDraw.Draw(mask).ellipse([cx - 300, cy - 300, cx + 300, cy + 300], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    dark = ImageEnhance.Brightness(im).enhance(0.42)
    im = Image.composite(im, dark, mask)
    d = chrome(im, 'C  THE RING  (one heart, rings out)')
    for r, w, col in ((150, 3, GOLD), (300, 3, GOLD), (450, 2, DIM)):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=w)
    d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=GOLD, outline=INK, width=3)
    label(d, (cx, cy + 24), 'THE HEART: YOUR MAIN (THE TAP)', 15, INK, GOLD, anchor='c')
    import math
    for n, (rr, a) in enumerate([(150, 20), (150, 140), (150, 260), (300, 60), (300, 120), (300, 200), (300, 300), (300, 350)], 1):
        lot(d, (int(cx + rr * math.cos(math.radians(a))), int(cy + rr * math.sin(math.radians(a)))), n)
    label(d, (cx, cy - 300 - 40), 'REACHED: 8 LOTS', 15, INK, GOLD, anchor='c')
    label(d, (cx, cy + 450 - 34), 'NEXT RING: +6 LOTS, +4 BATTERIES A DAY', 14, BONE, INK, anchor='c')
    label(d, (14, PH - 44), 'THE HEART REACHES FARTHER AS YOU FEED IT', 15)
    return im


def card(a, b, c):
    w, gap, head, foot = 360, 14, 64, 150
    h = int(PH * w / PW)
    W, H = 3 * w + 4 * gap, head + h + foot
    im = Image.new('RGB', (W, H), (22, 20, 18)); d = ImageDraw.Draw(im)
    d.text((gap, 14), 'YOUR SETTLEMENT IS ONE SCREEN. WHICH ONE?   (mocks from pictures we have)', font=font(22), fill=BONE)
    words = {0: ('A  THE BLOCK YOU TOOK', ['a real place painted like every town', 'about 12 fixed lots, tap one', 'grows in place; act two: inside']),
             1: ('B  THE CUTAWAY', ['one building, cut open', 'rooms floor by floor, tap one', 'grows up a floor or down a basement']),
             2: ('C  THE RING', ['one heart in the middle', 'lots in rings round it', 'feed the heart, the rings grow'])}
    for i, m in enumerate((a, b, c)):
        x = gap + i * (w + gap)
        im.paste(m.resize((w, h), Image.LANCZOS), (x, head))
        t, lines = words[i]
        d.text((x, head + h + 10), t, font=font(20), fill=GOLD)
        for j, l in enumerate(lines): d.text((x, head + h + 42 + j * 24), l, font=font(16), fill=BONE)
    return im


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    a, b, c = mock_a(), mock_b(), mock_c()
    for n, m in (('a', a), ('b', b), ('c', c)): m.save(os.path.join(OUT, 'mock_%s.webp' % n), quality=84, method=6)
    cd = card(a, b, c); cd.save(os.path.join(OUT, 'vote_one_screen_abc.webp'), quality=86, method=6)
    print('  mocks and card', cd.size, OUT)
