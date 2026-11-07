#!/usr/bin/env python3
"""WORLD THIRTEEN 11/7 (rules 426(a), 429(b)(d)): the VOTE sheet for a street at every house.

Three panels from his phone, the game's own camera, by day: the suburb at the street stop with the house streets OFF (the map as
it was), the same spot with them ON, and the fight cut from the map there. Inputs are the pictures
tools/bohemia_world_thirteen_suburb_shots.js and the board gate's --shots write.

  python3 tools/bohemia_world_thirteen_vote_sheet.py BEFORE.png AFTER.png FIGHT.png OUT.webp
"""
import sys
from PIL import Image, ImageDraw, ImageFont

def main(before, after, fight, out):
    H = 1688
    ims = []
    for p in (before, after, fight):
        im = Image.open(p).convert('RGB')
        w = round(im.width * H / im.height)
        ims.append(im.resize((w, H), Image.LANCZOS))
    gut, top = 24, 120
    W = sum(i.width for i in ims) + gut * (len(ims) + 1)
    sheet = Image.new('RGB', (W, H + top + gut), (22, 20, 18))
    g = ImageDraw.Draw(sheet)
    try:
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 40)
    except OSError:
        f = ImageFont.load_default()
    words = ['BEFORE: THE MAP', 'NOW: THE MAP', 'NOW: THE FIGHT, CUT FROM IT']
    x = gut
    for im, t in zip(ims, words):
        sheet.paste(im, (x, top))
        g.text((x + 8, 40), t, fill=(214, 200, 168), font=f)
        x += im.width + gut
    sheet.save(out, 'WEBP', lossless=False, quality=88, method=6)
    print(out, sheet.size, [i.width for i in ims], 'first at', [gut + ims[0].width + gut, top, ims[1].width, H])

if __name__ == '__main__':
    main(*sys.argv[1:5])
