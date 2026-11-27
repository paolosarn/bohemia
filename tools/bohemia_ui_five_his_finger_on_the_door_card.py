#!/usr/bin/env python3
"""HIS FINGER ON THE DOOR, the VOTE card's picture (UI FIVE 11/27): every frame of three crew picks on the door, the phone slowed
4 times, before (the jobs planned under his finger) and now, upright and on its side. Each frame is a box as wide as it lasted:
green under 34 ms, amber to 100, red past 100 (a freeze he feels). Reads the frames written by
tools/bohemia_ui_five_his_finger_on_the_door_measure.js; writes records/target/ui5_his_finger_on_the_door_11_27/before_and_now.webp"""
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, 'records/target/ui5_his_finger_on_the_door_11_27')
try:
    F = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', n)
    FB = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', n)
except Exception:
    F = FB = lambda n: ImageFont.load_default()

BG, INK, DIM = (22, 20, 18), (236, 228, 210), (150, 142, 128)
GREEN, AMBER, RED = (96, 176, 104), (214, 170, 72), (214, 72, 60)
W, PAD, STRIP = 1260, 28, 2500.0            # one strip shows the 2.5 s after a touch
SW = (W - PAD * 2 - 40) // 3                 # three picks side by side
SX = SW / STRIP


def strip(dr, x, y, frames, h=34):
    t = 0.0
    for ms in frames:
        if t >= STRIP:
            break
        w = max(1.0, min(ms, STRIP - t) * SX)
        c = GREEN if ms < 34 else AMBER if ms <= 100 else RED
        dr.rectangle([x + t * SX, y, x + t * SX + w - (1 if w > 2 else 0), y + h], fill=c)
        t += ms
    n = len(frames); s = sum(frames) or 1
    return n * 1000.0 / s, max(frames or [0])


def main():
    rows = [('UPRIGHT', 'phone_portrait'), ('ON ITS SIDE', 'phone_landscape')]
    H = 150 + len(rows) * 2 * 92 + 60
    im = Image.new('RGB', (W, H), BG)
    dr = ImageDraw.Draw(im)
    dr.text((PAD, 22), 'A TAP ON A CREW PICK, THE PHONE SLOWED 4 TIMES', font=FB(30), fill=INK)
    dr.text((PAD, 62), 'every frame of the 2.5 seconds after each of three picks, as wide as it lasted', font=F(19), fill=DIM)
    lx = PAD
    for c, t in ((GREEN, 'smooth'), (AMBER, 'a hitch'), (RED, 'a freeze you feel (over 100 ms)')):
        dr.rectangle([lx, 98, lx + 22, 116], fill=c); dr.text((lx + 30, 96), t, font=F(18), fill=DIM); lx += 60 + int(dr.textlength(t, font=F(18)))
    y = 140
    for label, prof in rows:
        for way, name in (('before', 'BEFORE'), ('now', 'NOW')):
            d = json.load(open(os.path.join(DIR, 'frames_%s_%s.json' % (prof, way))))
            dr.text((PAD, y), label + ', ' + name, font=FB(18), fill=INK if way == 'now' else DIM)
            for k, fr in enumerate(d['picks'][:3]):
                x = PAD + k * (SW + 20)
                fps, worst = strip(dr, x, y + 28, fr)
                dr.text((x, y + 66), 'pick %d: %d frames a second, worst %d ms' % (k + 1, round(fps), worst), font=F(16), fill=RED if worst > 100 else INK)
            y += 92
        y += 4
    dr.text((PAD, H - 44), 'before: every pick planned all the valley\'s jobs again under his finger. now: they wait while he taps, and run while he reads.', font=F(17), fill=DIM)
    out = os.path.join(DIR, 'before_and_now.webp')
    im.save(out, 'WEBP', quality=92)
    print(out, im.size)


if __name__ == '__main__':
    main()
