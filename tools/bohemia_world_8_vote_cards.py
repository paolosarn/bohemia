#!/usr/bin/env python3
"""WORLD 8's VOTE cards: the frames tools/bohemia_world_8_vote_cards.js took from the game's camera, stitched into moving pictures.
  python3 tools/bohemia_world_8_vote_cards.py <frames dir>     ->  records/target/world_8/<card>.webp (+ a still .jpg, its first look)
"""
import os, sys, glob
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, 'records/target/world_8')
CARDS = {'pinch': ('ONE_PINCH_TO_THE_STREET', 420), 'sight': ('WHAT_HE_SEES_NOW', 420), 'quest': ('TAP_A_QUEST_YOUR_PEOPLE_GO', 300)}


def main(src):
    os.makedirs(OUT, exist_ok=True)
    for card, (name, ms) in CARDS.items():
        fs = sorted(glob.glob(os.path.join(src, card, '*.png')))
        if not fs:
            continue
        ims = []
        for f in fs:
            im = Image.open(f).convert('RGB')
            if im.width < im.height:   # the map above the phone (the camera holds his crew there): a card fits one phone screen
                im = im.crop((0, 0, im.width, int(im.height * 0.64)))
            w = 390
            ims.append(im.resize((w, round(im.height * w / im.width)), Image.LANCZOS))
        dur = [ms] * len(ims); dur[-1] = 1600
        fn = os.path.join(OUT, name + '.webp')
        ims[0].save(fn, save_all=True, append_images=ims[1:], duration=dur, loop=0, quality=72, method=4)
        ims[len(ims) // 2 if card == 'sight' else -6].save(os.path.join(OUT, name + '.jpg'), quality=82)
        print(card, len(ims), 'frames', os.path.getsize(fn) // 1024, 'KB', fn)


if __name__ == '__main__':
    main(sys.argv[1])
