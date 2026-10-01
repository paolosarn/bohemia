#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION, THE FLOOR VERDICT: measures the four fights the .js tool shot and lays the
seed-5 frame out twice, as he sees it and with every thing on the ground that is not the ground marked
and numbered to records/BOHEMIA_FIGHT_VERDICT_ROUND_21_THE_FLOOR_10_1_26.md.

REFERENCE CHECK (the 9/4 standing duty): AH-01 (R1, R4, R5, R10 and the AI-slop strand's pair 2), the
style card's 5A floor, the 9/29 floor (3a <= 1.5 device px, 3b >= 0.020). Marks by eye on seed 5 at
the 390 x 844 @3x profile; the numbers are machine. No reference game.

usage: python3 tools/bohemia_direction_the_floor_verdict.py <shots dir> <out.png>
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, DIM, MARK = (13, 13, 18), (232, 224, 204), (150, 142, 128), (255, 64, 200)


def band(L):
    L = L - L.mean(); P = np.abs(np.fft.fft2(L)) ** 2; P[0, 0] = 0
    fy = np.abs(np.fft.fftfreq(L.shape[0]))[:, None]; fx = np.abs(np.fft.fftfreq(L.shape[1]))[None, :]
    t = P.sum()
    return P[(fx > 0.25) & (fy >= 0)].sum() / t, P[(fy > 0.25) & (fx >= 0)].sum() / t


def classes(a):
    """colour classes that are never ground: a LOWER BOUND (dark ovals and the diamonds escape it,
    pale faces fall into 'white'); the verdict lists by eye what the classes cannot see"""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; mx = a.max(-1); mn = a.min(-1); s = (mx - mn) / np.maximum(mx, 1e-6)
    return {'pale pads': (b > r + 0.06) & (b > g + 0.01) & (b > 0.4),
            'red': (r > 0.4) & (r > 1.9 * g) & (r > 1.9 * b),
            'white marks': (s < 0.14) & (mx > 0.62),
            'green words': (g > r + 0.12) & (g > b + 0.08) & (mx > 0.5)}


def hud(h, w, k=3):
    yy, xx = np.mgrid[0:h, 0:w] / k
    return (((xx - 292) ** 2 + (yy - 544) ** 2) < 95 ** 2) | ((xx > 150) & (xx < 240) & (yy > 480) & (yy < 610))


rows = json.load(open(f'{SRC}/rows.json'))
meas = []
for r in rows:
    a = np.asarray(Image.open(f"{SRC}/fight_{r['s']}_glass.png").convert('RGB')).astype(float) / 255
    h, w, _ = a.shape; board = ~hud(h, w)
    C = classes(a); fake = np.zeros((h, w), bool)
    for m in C.values(): fake |= m
    L = a @ [0.299, 0.587, 0.114]
    bx, by = band(L[330:1440, :])
    meas.append(dict(seed=r['s'], kind=r['kind'], canvas=f"{r['w']}x{r['h']}", unit=r['unit'],
                     band=[round(bx, 4), round(by, 4)], fake=round(100 * (fake & board).sum() / board.sum(), 1),
                     **{k: round(100 * (v & board).sum() / board.sum(), 1) for k, v in C.items()}))
for m in meas: print(json.dumps(m))
json.dump(meas, open(OUT.replace('.png', '.json'), 'w'), indent=1)

F_T, F_L, F_N = ImageFont.truetype(ROM, 30), ImageFont.truetype(ROM, 21), ImageFont.truetype(ROM, 44)
frame = Image.open(f'{SRC}/fight_5_glass.png').convert('RGB')
marked = frame.copy(); d = ImageDraw.Draw(marked)
MARKS = [  # (n, box) in glass px on seed 5, by eye
    (1, (410, 170, 1170, 310)), (1, (0, 1490, 640, 1923)), (1, (0, 490, 130, 650)),
    (2, (165, 865, 335, 1035)),
    (3, (430, 610, 740, 760)), (3, (130, 930, 370, 1080)), (3, (20, 0, 1150, 200)),
    (4, (120, 600, 380, 780)), (4, (790, 600, 1050, 780)), (4, (790, 930, 1050, 1110)), (4, (790, 1270, 1050, 1450)),
    (5, (100, 1370, 420, 1490)),
    (6, (1010, 440, 1170, 1490)),
]
for n, (x0, y0, x1, y1) in MARKS:
    d.rectangle([x0 + 3, y0 + 3, x1 - 3, y1 - 3], outline=MARK, width=7)
    d.rectangle([x0 + 3, y0 + 3, x0 + 56, y0 + 58], fill=MARK)
    d.text((x0 + 14, y0 + 6), str(n), font=F_N, fill=(0, 0, 0))

S = 0.5
A = frame.resize((int(frame.width * S), int(frame.height * S)), Image.LANCZOS)
B = marked.resize(A.size, Image.LANCZOS)
inset = frame.crop((560, 1100, 680, 1220)).resize((360, 360), Image.NEAREST)
LEG = ["1  pale ovals on the ground (pads, puddles or holes: not the ground)",
       "2  a flat red disc painted on the street",
       "3  words on the board: CLEAR, ROSA, and the lines across the top",
       "4  see-through diamonds on a square grid",
       "5  a thick white ring under your man",
       "6  the houses are two flat tans, cardboard",
       "7  every painted dot is 3 x 3 on your phone (below: a piece blown up)"]
W = 40 + A.width * 2 + 30
H = 40 + 50 + A.height + 50 + len(LEG) * 34 + 20 + 360 + 40
sheet = Image.new('RGB', (W, H), BG); dd = ImageDraw.Draw(sheet)
dd.text((20, 20), 'THE GROUND UNDER THEIR FEET', font=F_T, fill=INK)
sheet.paste(A, (20, 80)); sheet.paste(B, (20 + A.width + 30, 80))
dd.text((20, 80 + A.height + 8), 'what you see', font=F_L, fill=DIM)
dd.text((50 + A.width, 80 + A.height + 8), 'everything marked is not ground', font=F_L, fill=MARK)
y = 80 + A.height + 50
for ln in LEG:
    dd.text((20, y), ln, font=F_L, fill=INK); y += 34
sheet.paste(inset, (20, y + 10)); dd.rectangle([18, y + 8, 382, y + 372], outline=DIM, width=2)
dd.text((400, y + 20), 'a piece of the ground at 3x:', font=F_L, fill=DIM)
dd.text((400, y + 54), 'the blocks are the canvas,', font=F_L, fill=DIM)
dd.text((400, y + 88), 'not the art', font=F_L, fill=DIM)
sheet.save(OUT)
print('sheet', sheet.size)
