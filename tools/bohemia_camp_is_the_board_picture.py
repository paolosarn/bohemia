#!/usr/bin/env python3
"""THE CAMP IS THE FIGHT'S BOARD -- the proof picture (MOTION 3, 11/10/26, rule 442(a)).
Reads the shots gates/the_camp_is_the_fights_board_gate.js saves (--shots DIR: shots.json and the PNGs, the demo on the real page,
phone upright and on its side) and lays each board's pair side by side: THE FIGHT'S LAST FRAME | THE CAMP'S FIRST FRAME, a suburb,
the Strip, the freeway; upright on top, on its side below.
    python3 tools/bohemia_camp_is_the_board_picture.py DIR records/target/MOTION_3_THE_CAMP_IS_THE_FIGHTS_BOARD.webp
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

def font(n):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf'):
        if os.path.exists(f):
            return ImageFont.truetype(f, n)
    return ImageFont.load_default()

def main(src, out):
    shots = json.load(open(os.path.join(src, 'shots.json')))
    up = [s for s in shots if s['way'] == 'upright']
    side = [s for s in shots if s['way'] != 'upright']
    BG, INK, DIM = (14, 11, 8), (233, 220, 196), (150, 132, 104)
    UW, UH = 250, 541            # an upright glass, 390 x 844 at 0.64
    SW, SH = 470, 217            # a glass on its side, 844 x 390 at 0.56
    pad, gap = 18, 10
    f1, f2, f3 = font(22), font(15), font(13)
    rows_w = max(len(up) * (2 * UW + gap) + (len(up) - 1) * pad, len(side) * SW + (len(side) - 1) * pad) + 2 * pad
    H = pad + 34 + (26 + 18 + UH if up else 0) + (pad + 26 + 18 + 2 * SH + gap if side else 0) + pad + 22
    im = Image.new('RGB', (rows_w, H), BG)
    d = ImageDraw.Draw(im)
    d.text((pad, pad), "THE CAMP IS THE FIGHT'S BOARD: the fight's last frame, then the camp's first, the same place", font=f1, fill=INK)
    y = pad + 34
    if up:
        d.text((pad, y), 'THE PHONE UPRIGHT', font=f2, fill=DIM); y += 26
        x = pad
        for s in up:
            d.text((x, y), s['board'].upper() + ':  FIGHT  |  CAMP', font=f3, fill=INK)
            a = Image.open(s['fight']).convert('RGB').resize((UW, UH), Image.LANCZOS)
            b = Image.open(s['camp']).convert('RGB').resize((UW, UH), Image.LANCZOS)
            im.paste(a, (x, y + 18)); im.paste(b, (x + UW + gap, y + 18))
            x += 2 * UW + gap + pad
        y += 18 + UH
    if side:
        y += pad
        d.text((pad, y), 'THE PHONE ON ITS SIDE (the fight above, the camp below)', font=f2, fill=DIM); y += 26
        x = pad
        for s in side:
            d.text((x, y), s['board'].upper(), font=f3, fill=INK)
            a = Image.open(s['fight']).convert('RGB').resize((SW, SH), Image.LANCZOS)
            b = Image.open(s['camp']).convert('RGB').resize((SW, SH), Image.LANCZOS)
            im.paste(a, (x, y + 18)); im.paste(b, (x, y + 18 + SH + gap))
            x += SW + pad
        y += 18 + 2 * SH + gap
    d.text((pad, H - pad - 14), 'The demo on the real page, the phone both ways. A tile and a man the same size on the glass in both frames.', font=f3, fill=DIM)
    im.save(out, 'WEBP', quality=82, method=6)
    print(out, im.size, os.path.getsize(out), 'bytes')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
