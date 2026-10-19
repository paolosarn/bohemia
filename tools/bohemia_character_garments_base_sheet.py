#!/usr/bin/env python3
"""CHARACTER GARMENTS BASE: THE SHEETS, one per card (THE SHIRTS, THE COLLARS, THE HEAVY ONES AND THE RUNWAY). Per top,
one row: the game's flat body wearing it today (buildFrame, SE, 1:1), the model's eight facings at 1:1 (DIRECTION's rig,
unedited) and the head and shoulders at the portrait's 128 (S, SE). Grouped by shape.

Run: python3 tools/bohemia_character_garments_base_sheet.py [held names, comma separated]
Out: records/target/character/CHARACTER_BASE_ONE_<1|2|3>.png, its first picture _FIRST.png (+ .json, the rect)
REUSE CHECK: the rows are the hair sheet's (tools/bohemia_character_hair_one_sheet.py row()), the pixels the rig's and
buildFrame's, pasted whole. REFERENCE CHECK: the twin is the game's own flat top as the body wears it today, 1:1.
"""
import json
import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_garments_base as GB  # noqa: E402
import bohemia_character_hair_one_sheet as HS  # noqa: E402

BASE = os.path.join(ROOT, 'records/target/character/barber')
OUT = os.path.join(ROOT, 'records/target/character/CHARACTER_BASE_ONE_%d.png')


def main():
    held = set(n.strip().upper() for n in (sys.argv[1] if len(sys.argv) > 1 else '').split(',') if n.strip())
    for k, (title, _, shapes) in enumerate(GB.PARTS, 1):
        tops = [G for G in sorted(GB.BANK, key=lambda G: (GB.SHAPES.index(G['shape']), G['name']))
                if G['shape'] in shapes and G['name'] not in held and os.path.exists(os.path.join(BASE, G['tag'], 'rig_S.png'))]
        if not tops: continue
        rows = []
        for G in tops:
            r = HS.row(G['name'], G['tag'], BASE)
            d = ImageDraw.Draw(r); d.rectangle((6, 18, 150, 32), fill=HS.BG); d.text((6, 20), G['shape'], fill=HS.HEAD)
            rows.append((G['name'], r))
        W = max(r.width for _, r in rows) + 24
        H = 70 + sum(r.height + 6 for _, r in rows)
        out = Image.new('RGBA', (W, H), HS.BG + (255,)); dr = ImageDraw.Draw(out)
        dr.text((12, 8), "CHARACTER: BASE 1, %s: the game's %d tops on the barber's mannequin, each option modelled once, each top in its own colour." % (title, len(rows)), fill=HS.INK)
        dr.text((12, 24), "Each row: the game's flat top today (1:1), the model in eight facings (1:1), the head and shoulders at the portrait's 128. Draft: nothing is final.", fill=HS.DIM)
        dr.text((12, 40), "57 px a metre, one pixel size | palette: each top's own ramp in the game (mid, its trim in dk and lt) | light: the rig's one sun, upper left", fill=HS.DIM)
        y = 64; at = {}
        for n, r in rows:
            out.alpha_composite(r, (12, y)); at[n] = [12, y, r.width, r.height]; y += r.height + 6
        out.convert('RGB').save(OUT % k, optimize=True)
        first = rows[0][0]
        first_p = (OUT % k).replace('.png', '_FIRST.png')
        dict(rows)[first].convert('RGB').save(first_p, optimize=True)
        json.dump({'first': first, 'firstAt': at[first], 'rows': at}, open(first_p.replace('.png', '.json'), 'w'), indent=1)
        print('wrote %s %dx%d, %d tops' % (os.path.relpath(OUT % k, ROOT), W, H, len(rows)))


if __name__ == '__main__':
    main()
