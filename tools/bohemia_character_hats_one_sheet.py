#!/usr/bin/env python3
"""CHARACTER HATS 1: THE SHEET. Per hat, one row: the game's flat body wearing it today (buildFrame, SE, 1:1), the model's
eight facings at 1:1 (DIRECTION's rig, unedited) and the head at the portrait's 128 (S, SE). Grouped by shape.

Run: python3 tools/bohemia_character_hats_one_sheet.py
Out: records/target/character/CHARACTER_HATS_ONE.png, its first picture CHARACTER_HATS_ONE_FIRST.png (+ .json, the rect)
REUSE CHECK: the rows are the hair sheet's (tools/bohemia_character_hair_one_sheet.py row()), the pixels the rig's and
buildFrame's, pasted whole. REFERENCE CHECK: the twin is the game's own flat hat as the body wears it today, 1:1.
"""
import json
import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hats_one as HT  # noqa: E402
import bohemia_character_hair_one_sheet as HS  # noqa: E402

BASE = os.path.join(ROOT, 'records/target/character/barber')
OUT = os.path.join(ROOT, 'records/target/character/CHARACTER_HATS_ONE.png')
FIRST = os.path.join(ROOT, 'records/target/character/CHARACTER_HATS_ONE_FIRST.png')


def main():
    order = sorted(HT.HATS, key=lambda h: (list(HT.SHAPE_NAME).index(h[1]), h[0]))
    rows = []
    for n, shape, _ in order:
        r = HS.row(n, 'hat_' + n.lower().replace(' ', '_'), BASE)
        d = ImageDraw.Draw(r); d.rectangle((6, 18, 150, 32), fill=HS.BG); d.text((6, 20), HT.SHAPE_NAME[shape], fill=HS.HEAD)
        rows.append((n, r))
    W = max(r.width for _, r in rows) + 24
    H = 70 + sum(r.height + 6 for _, r in rows)
    out = Image.new('RGBA', (W, H), HS.BG + (255,)); dr = ImageDraw.Draw(out)
    dr.text((12, 8), "CHARACTER: HATS 1, THE GAME'S 21 HATS ON THE STARRED HEAD: seven shapes modelled once, each hat in its own colour.", fill=HS.INK)
    dr.text((12, 24), "Each row: the game's flat hat today (1:1), the model in eight facings (1:1), the same head at the portrait's 128. Draft: nothing is final.", fill=HS.DIM)
    dr.text((12, 40), "57 px a metre, one pixel size | palette: each hat's own ramp in the game (the runway paint) | light: the rig's one sun, upper left", fill=HS.DIM)
    y = 64; at = {}
    for n, r in rows:
        out.alpha_composite(r, (12, y)); at[n] = [12, y, r.width, r.height]; y += r.height + 6
    out.convert('RGB').save(OUT, optimize=True)
    first = 'SLATE WORK CAP'
    dict(rows)[first].convert('RGB').save(FIRST, optimize=True)
    json.dump({'firstAt': at[first], 'rows': at}, open(FIRST.replace('.png', '.json'), 'w'), indent=1)
    print('wrote %s %dx%d' % (os.path.relpath(OUT, ROOT), W, H))


if __name__ == '__main__':
    main()
