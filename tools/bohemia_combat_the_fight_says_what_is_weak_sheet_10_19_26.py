#!/usr/bin/env python3
"""THE FIGHT SAYS WHAT IS WEAK, the VOTE sheet (COMBAT [the fight says your weapon is weak], rule 120(b)). Called by
tools/bohemia_combat_the_fight_says_what_is_weak_10_19_26.js with the frames it took from the game's own camera; this file
only lays them out and writes the captions. Nothing on the frames is drawn here."""
import json
import sys
from PIL import Image, ImageDraw, ImageFont

FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
BG, INK, DIM, GOLD = (13, 11, 9), (230, 217, 194), (156, 140, 116), (217, 168, 90)
FW, PAD = 330, 14


def fit(img, w):
    return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)


def wrap(d, text, font, w):
    out, line = [], ''
    for word in text.split():
        t = (line + ' ' + word).strip()
        if d.textlength(t, font=font) > w and line:
            out.append(line)
            line = word
        else:
            line = t
    if line:
        out.append(line)
    return out


def main(spec_path):
    spec = json.load(open(spec_path))
    f_big, f_mid, f_small = ImageFont.truetype(BOLD, 30), ImageFont.truetype(BOLD, 17), ImageFont.truetype(FONT, 14)
    frames = [(f['name'], f['say'], fit(Image.open(f['file']).convert('RGB'), FW)) for f in spec['frames']]
    width = len(frames) * (FW + PAD) + PAD
    fh = max(im.height for _, _, im in frames)
    height = 92 + fh + 150
    sheet = Image.new('RGB', (width, height), BG)
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 14), 'THE FIGHT SAYS WHAT IS WEAK', font=f_big, fill=GOLD)
    for i, ln in enumerate(wrap(d, 'Tap a man once: his chance, and what one blow does to his health and his armour, the fight\'s own math. '
                                   'When your weapon is bad for him it says so in plain words, and names your man who does it better. '
                                   'Tap again: what it did. His phone upright, the game\'s camera.', f_small, width - 2 * PAD)):
        d.text((PAD, 52 + i * 17), ln, font=f_small, fill=DIM)
    x, y = PAD, 92
    for name, say, im in frames:
        sheet.paste(im, (x, y))
        d.text((x, y + im.height + 6), name, font=f_mid, fill=GOLD)
        for i, ln in enumerate(wrap(d, '"' + say.replace('\n', ' ') + '"', f_small, FW)[:6]):
            d.text((x, y + im.height + 28 + i * 17), ln, font=f_small, fill=INK)
        x += FW + PAD
    sheet.save(spec['out'], 'JPEG', quality=62, optimize=True, progressive=True)


if __name__ == '__main__':
    main(sys.argv[1])
