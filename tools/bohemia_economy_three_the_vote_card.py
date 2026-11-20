#!/usr/bin/env python3
"""BOHEMIA -- ECONOMY THREE (rule 459, 461; ask row 645; 11/20/26). THE VOTE CARD: AFTER A FIGHT, THE SAME BATTERIES.

One picture, cut from the game's own screens (the battery gate's walk of the demo, a phone upright, 390 x 844 at 3:
node gates/the_battery_is_real_gate.js demo phone_portrait --shots=<folder>), nothing drawn by hand:
  1. THE SPOILS' BAR: the purse after a fight, drawn as the batteries it is (it showed the old pile of cells until this build)
  2. WHAT A TOWN PAYS FOR A PIECE YOU LOOTED: the strip under the stash (it wore the old icon)
  3. THE PHONE'S CREW FACE: a man's night, back on the phone (11/18t's drawing had cut it off) and drawn as an AA
The words are the game's own fonts (slices/fonts); no new art.

    python3 tools/bohemia_economy_three_the_vote_card.py <the gate's --shots folder>
writes records/target/economy_three/VOTE_AFTER_THE_FIGHT_THE_SAME_BATTERIES.webp and its first picture for the card.
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WALK = sys.argv[1]
OUTD = os.path.join(R, 'records/target/economy_three')
W = 1170
INK, GOLD, DIM, BG = (233, 220, 196), (240, 196, 106), (150, 135, 110), (22, 17, 12)
font = lambda n, s: ImageFont.truetype(os.path.join(R, 'slices/fonts', n), s)
CAS, ROM = lambda s: font('BohemiaCasing-Regular.ttf', s), lambda s: font('BohemiaROM-Regular.ttf', s)


def head(text, sub=None):
    im = Image.new('RGB', (W, 96 if sub else 70), BG); d = ImageDraw.Draw(im)
    d.text((40, 18), text, font=CAS(30), fill=GOLD)
    if sub: d.text((40, 58), sub, font=ROM(22), fill=DIM)
    return im


def shot(name):
    return Image.open(os.path.join(WALK, name)).convert('RGB')


def main():
    sp, cr = shot('walk_demo_portrait_10_spoils.png'), shot('walk_demo_portrait_9_crew.png')
    top = Image.new('RGB', (W, 120), BG); d = ImageDraw.Draw(top)
    d.text((40, 22), 'AFTER A FIGHT, THE SAME BATTERIES', font=CAS(44), fill=GOLD)
    d.text((40, 80), 'the spoils screen and the phone, the game\'s own screens, a phone upright', font=ROM(22), fill=DIM)
    parts = [top,
             head('THE PURSE ON THE SPOILS SCREEN', '2,236 = 8 car batteries, 11 tool packs, 16 AA (it was the old pile of cells)'),
             sp.crop((0, 0, W, 150)),
             head('WHAT A TOWN PAYS FOR A PIECE YOU LOOTED', 'a fire axe off a thug: 5 AA (it wore the old icon)'),
             sp.crop((0, 2200, W, 2340)),
             head('A MAN\'S NIGHT, BACK ON THE PHONE', 'the crew screen\'s phone face: 2 AA a night (since 11/18 it was cut off)')]
    face = cr.crop((760, 1860, 1170, 2050)); face = face.resize((face.width * 2, face.height * 2), Image.NEAREST)
    row = Image.new('RGB', (W, face.height + 20), BG); row.paste(face, ((W - face.width) // 2, 10)); parts.append(row)
    H = sum(p.height for p in parts) + 20
    out = Image.new('RGB', (W, H), BG); y = 0
    for p in parts: out.paste(p, (0, y)); y += p.height
    os.makedirs(OUTD, exist_ok=True)
    dst = os.path.join(OUTD, 'VOTE_AFTER_THE_FIGHT_THE_SAME_BATTERIES.webp'); out.save(dst, 'WEBP', lossless=True, method=6)
    first = out.crop((0, 0, W, 436)); fd = os.path.join(R, 'records/target/vote_first'); os.makedirs(fd, exist_ok=True)
    first.save(os.path.join(fd, 'economy-three-after-the-fight-the-same-batteries-11-20.webp'), 'WEBP', lossless=True, method=6)
    print('wrote', os.path.relpath(dst, R), out.size, os.path.getsize(dst), 'bytes; first [0, 0, %d, 436]' % W)


if __name__ == '__main__':
    main()
