#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [flip look]: measures how much the flip changes the world today, then draws the card's
four-beat flip on the game's own act-1 and act-3 frames (390 x 844 @3x): HOLD, TEAR (tape damage inside the phone
only), DRAIN (the world's value multiplied down, hue untouched), CUT (the same camera, the other date).

REFERENCE CHECK (the 9/4 standing duty): AH-01 (R2, R4, R8), the AI-slop strand, AH-03, the three eras card. No
reference game.

usage: python3 tools/bohemia_direction_flip_look.py <shots dir> <out.png>
"""
import sys, os, json, glob
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, GOOD, BAD, DIM = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (140, 132, 118)
PHONE = (680, 360, 1120, 1320)          # the phone's glass at this profile, by eye on the frame

a1 = np.asarray(Image.open(os.path.join(SRC, 'a1.png')).convert('RGB')).astype(float)
a3 = np.asarray(Image.open(os.path.join(SRC, 'a3.png')).convert('RGB')).astype(float)
world = np.ones(a1.shape[:2], bool); world[PHONE[1]:PHONE[3], PHONE[0]:PHONE[2]] = False; world[:330] = False
changed = float((np.abs(a1 - a3).max(-1) > 24)[world].mean())
peak = 0.0
for f in sorted(glob.glob(os.path.join(SRC, 't*.png'))):
    t = np.asarray(Image.open(f).convert('RGB')).astype(float)
    peak = max(peak, float((np.abs(t - a1).max(-1) > 24)[world].mean()))
m = dict(world_changed_act1_to_act3=round(changed, 4), most_world_changed_during_flip=round(peak, 4),
         **json.load(open(os.path.join(SRC, 'meta.json'))))
print(json.dumps(m)); json.dump(m, open(OUT.replace('.png', '.json'), 'w'), indent=1)

F_T, F_L, F_P = ImageFont.truetype(ROM, 24), ImageFont.truetype(ROM, 17), ImageFont.truetype(ROM, 40)
x0, y0, x1, y1 = PHONE
def tear(img):                            # beat 1: the phone's own tape loses tracking; nothing outside it moves
    a = np.asarray(img).copy(); rng = np.random.default_rng(7)
    for _ in range(22):
        y = int(rng.integers(y0, y1 - 40)); h = int(rng.integers(8, 40)); dx = int(rng.choice([-1, 1]) * rng.integers(40, 140))
        a[y:y + h, x0:x1] = np.roll(a[y:y + h, x0:x1], dx, axis=1)
    yb = int(y1 - 120); a[yb:yb + 10, x0:x1] = (a[yb:yb + 10, x0:x1] * 0.4 + 150).clip(0, 255)   # head-switch band at the foot
    return Image.fromarray(a.astype('uint8'))
def drain(img, k=0.32):                   # beat 2: night arithmetic on the world, value only (R4); the phone stays lit
    a = np.asarray(img).astype(float); out = a * k
    out[y0:y1, x0:x1] = 0; out[:330] = a[:330]
    im = Image.fromarray(out.clip(0, 255).astype('uint8')); d = ImageDraw.Draw(im)
    d.text((x0 + 40, y0 + 330), 'PERLA', font=F_P, fill=(214, 202, 168))
    d.text((x0 + 40, y0 + 400), '+70 YEARS', font=F_P, fill=(160, 150, 124))
    return im
A1 = Image.fromarray(a1.astype('uint8')); A3 = Image.fromarray(a3.astype('uint8'))
beats = [('BEAT 0  HOLD', 'act 1; his thumb\non a face', A1),
         ('BEAT 1  TEAR', 'tape damage, inside\nthe phone only', tear(A1)),
         ('BEAT 2  DRAIN', 'the world goes dark;\nthe phone says who\nand when', drain(A1)),
         ('BEAT 3  CUT', 'same camera, other date;\nthe world must show\nwhat changed', A3)]
S = 0.26; TW, TH = int(1170 * S), int(2532 * S)
W = 30 + 4 * TW + 3 * 18 + 30; H = 30 + 44 + 30 + TH + 16 + 3 * 24 + 20 + 5 * 26 + 30
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet)
d.text((30, 24), 'THE FLIP IN FOUR BEATS (2 seconds), DRAWN ON THE GAME\'S OWN FRAMES', font=F_T, fill=INK)
for i, (t, cap, im) in enumerate(beats):
    x = 30 + i * (TW + 18); y = 78
    d.text((x, y), t, font=F_L, fill=GOOD); y += 30
    sheet.paste(im.resize((TW, TH), Image.LANCZOS), (x, y)); y += TH + 16
    for ln in cap.split('\n'): d.text((x, y), ln, font=F_L, fill=DIM); y += 24
y = 78 + 30 + TH + 16 + 3 * 24 + 20
for t, c in [('TODAY: flipping act 1 to act 3 changes %.1f%% of the world on screen. Same map, same clock, same' % (100 * m['world_changed_act1_to_act3']), BAD),
             ('batteries; only the phone moves. That is the cheap flip he ruled out.', BAD),
             ('THE FIRST TIME an act opens: 16 beats, the narrator reads the year, and what changed rises on the beat.', GOOD),
             ('NEVER: a whoosh, a white flash, a swirl, a glitch over the world, a camera move, a "70 YEARS LATER" card.', BAD),
             ('(beat 3 is act 3 as the game draws it now: the world there is not derived yet)', DIM)]:
    d.text((30, y), t, font=F_L, fill=c); y += 26
sheet.save(OUT); print('sheet', sheet.size)
