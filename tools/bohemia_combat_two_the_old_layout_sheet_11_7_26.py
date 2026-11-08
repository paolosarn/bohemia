#!/usr/bin/env python3
"""THE OLD LAYOUT, THE NEW HOUSES, THE SHEET (COMBAT TWO 11/7/26, rule 423, ask lines 484 to 488).

One VOTE sheet from the bench's own pictures (tools/bohemia_combat_two_the_boards_dressed_bench_11_7_26.js --shots dir --dsf 2):
for each spot, the fight's first frame on his phone upright (the game's own camera, one camera set by hand for both) BEFORE (the
board laid from the map's own block, 11/6h and 11/7g: the layout he called dogshit, the bench's 'laid') beside AFTER (the template
layout he liked with the new houses in it, of one, two and three storeys: the bench's 'template' now), a label over each. Nothing
is drawn but the labels; the frames are the game's pixels.
Run: python3 tools/bohemia_combat_two_the_old_layout_sheet_11_7_26.py <shots dir> [spot spot ...]
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'records/target/COMBAT2_THE_OLD_LAYOUT_THE_NEW_HOUSES_11_7.webp')
FIRST = os.path.join(ROOT, 'records/target/vote_first/combat2-the-old-layout-the-new-houses-11-7.webp')
NAMES = {'suburb': 'THE SUBURB (the demo\'s own door)', 'town': 'A TOWN', 'strip': 'THE STRIP', 'desert': 'THE DESERT'}


def font(n):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(f):
            return ImageFont.truetype(f, n)
    return ImageFont.load_default()


def main():
    d = sys.argv[1]
    spots = sys.argv[2:] or ['suburb', 'town']
    W = 1170
    fw = W // 2
    rows = []
    for s in spots:
        a = Image.open(os.path.join(d, s + '_laid_play.png')).convert('RGB')
        b = Image.open(os.path.join(d, s + '_template_play.png')).convert('RGB')
        fh = round(a.height * fw / a.width)
        a, b = a.resize((fw, fh), Image.LANCZOS), b.resize((fw, fh), Image.LANCZOS)
        head = 64
        row = Image.new('RGB', (W, fh + head), (24, 20, 16))
        row.paste(a, (0, head)); row.paste(b, (fw, head))
        g = ImageDraw.Draw(row)
        g.text((14, 8), NAMES.get(s, s.upper()), fill=(232, 214, 170), font=font(22))
        g.text((14, 38), 'BEFORE: the map\'s block, houses in lumps', fill=(190, 150, 130), font=font(16))
        g.text((fw + 14, 38), 'AFTER: the old layout, the new houses', fill=(170, 210, 150), font=font(16))
        g.line([(fw, head), (fw, fh + head)], fill=(0, 0, 0), width=3)
        rows.append(row)
    sheet = Image.new('RGB', (W, sum(r.height for r in rows) + 6 * (len(rows) - 1)), (0, 0, 0))
    y = 0
    for r in rows:
        sheet.paste(r, (0, y)); y += r.height + 6
    sheet.save(OUT, quality=88, method=6)
    os.makedirs(os.path.dirname(FIRST), exist_ok=True)
    sheet.crop((0, 0, W, 826)).save(FIRST, quality=90, method=6)
    print(OUT, sheet.size, os.path.getsize(OUT) // 1024, 'KB;', FIRST)


if __name__ == '__main__':
    main()
