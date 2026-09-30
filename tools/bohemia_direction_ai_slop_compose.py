#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [ai slop]: lays the three do/don't pairs shot by
tools/bohemia_direction_ai_slop_pairs.js on one sheet for the VOTE tab.

REFERENCE CHECK (the 9/4 standing duty): the ruler is AH-01, the bible, and its
law section 10 (the two voices; 'AI slop' named as a strand). The map pair is read
by the 9/29 floor's fine band (records/BOHEMIA_RULING_THE_FLOOR_READS_THE_CANVAS_AND_THE_BAND_9_29_26.md),
and the number is printed under each half so the picture carries its own measure.
No reference game is cited.

usage: python3 tools/bohemia_direction_ai_slop_compose.py <shots dir> <out.png>
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, DIM, GOOD, BAD = (13, 13, 18), (232, 224, 204), (140, 132, 118), (199, 154, 63), (197, 107, 107)


def band(im):
    """the fine band: FFT power share above 0.25 cycles/px, mean of the two axes"""
    L = np.asarray(im.convert('RGB')).astype(float) @ [0.299, 0.587, 0.114]
    L = L - L.mean(); P = np.abs(np.fft.fft2(L)) ** 2; P[0, 0] = 0
    fy = np.abs(np.fft.fftfreq(L.shape[0]))[:, None]; fx = np.abs(np.fft.fftfreq(L.shape[1]))[None, :]
    t = P.sum()
    return (P[(fx > 0.25) & (fy >= 0)].sum() / t + P[(fy > 0.25) & (fx >= 0)].sum() / t) / 2


def font(n):
    try:
        return ImageFont.truetype(ROM, n)
    except Exception:
        return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', n)


def fit(im, h):
    return im.resize((round(im.width * h / im.height), h), Image.NEAREST)


PH = 620
pairs = []
# PAIR 1: the machine's account is smooth and a little wrong, people are rough
pairs.append(('1  THE MACHINE TALKS SMOOTH, PEOPLE TALK ROUGH',
              fit(Image.open(f'{SRC}/one_do.png'), PH), 'DO: the valley\'s account is too polite and knows your name',
              fit(Image.open(f'{SRC}/one_dont.png'), PH), 'DON\'T: the machine sounds like a person (the feed now)'))
# PAIR 2: smoothing lives on machine screens only, never on the world
own = Image.open(f'{SRC}/map.png').convert('RGB')
soft = own.resize((own.width * 3, own.height * 3), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2.2))
soft = soft.resize(own.size, Image.BICUBIC)
b_own, b_soft = band(own), band(soft)
pairs.append(('2  SMOOTH ONLY INSIDE A SCREEN; THE WORLD STAYS ROUGH',
              fit(own, PH), f'DO: the map\'s own pixels, rough (detail {b_own:.3f})',
              fit(soft, PH), f'DON\'T: the same map airbrushed (detail {b_soft:.3f})'))
# PAIR 3: one calm wrong thing, never a glitch filter
pairs.append(('3  ONE CALM WRONG THING, NEVER A GLITCH',
              fit(Image.open(f'{SRC}/three_do.png'), PH), 'DO: same post twice, the count moved: 420, then 421',
              fit(Image.open(f'{SRC}/three_dont.png'), PH), 'DON\'T: red, zalgo, colour split, !!! (a filter)'))

F_T, F_L = font(28), font(20)
PAD, GAP, W = 28, 30, 1040
def wrap(text, f, w):
    out, line = [], ''
    for word in text.split():
        t = (line + ' ' + word).strip()
        if d0.textlength(t, font=f) <= w: line = t
        else: out.append(line); line = word
    return out + [line]
d0 = ImageDraw.Draw(Image.new('RGB', (1, 1)))
rows = []
for title, a, la, c, lc in pairs:
    half = (W - PAD * 2 - GAP) // 2
    if a.width > half:                      # the map pair: fit each half to the column
        a = a.resize((half, round(a.height * half / a.width)), Image.NEAREST)
        c = c.resize((half, round(c.height * half / c.width)), Image.NEAREST)
    la_l, lc_l = wrap(la, F_L, half), wrap(lc, F_L, half)
    h = 48 + max(a.height, c.height) + 16 + 26 * max(len(la_l), len(lc_l)) + 40
    rows.append((title, a, la_l, c, lc_l, half, h))
H = PAD + sum(r[-1] for r in rows)
sheet = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(sheet)
y = PAD
for title, a, la_l, c, lc_l, half, h in rows:
    d.text((PAD, y), title, font=F_T, fill=INK)
    yy = y + 48
    for img, x, col, lines in ((a, PAD, GOOD, la_l), (c, PAD + half + GAP, BAD, lc_l)):
        xo = x + (half - img.width) // 2
        sheet.paste(img, (xo, yy)); d.rectangle([xo - 3, yy - 3, xo + img.width + 2, yy + img.height + 2], outline=col, width=3)
        ty = yy + max(a.height, c.height) + 16
        for ln in lines:
            d.text((x, ty), ln, font=F_L, fill=col); ty += 26
    y += h
sheet.save(OUT)
print('sheet', sheet.size, 'map fine band own', round(b_own, 3), 'airbrushed', round(b_soft, 3))
