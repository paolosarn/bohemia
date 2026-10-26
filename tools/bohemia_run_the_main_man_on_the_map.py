#!/usr/bin/env python3
"""THE MAIN MAN ON THE MAP (RUN 10/26, row [your main guy leads the walk], rule 263(a)).

PAOLO 10/26: 'the character that's walking through Bohemia is not ... the main character of the origin.'

MEASURED: the map's lead figure is CHARACTER's generic body (BOHEMIA_RIG_PEOPLE 'body', records/target/character/rig/body), while the
crew screen and the fight draw the main man as the combat rig's YOU (slices/fight_rig/you.webp, records/target/combat/rig/you): two
different people. The fight's sheet is 3600 x 1288 (18.5 MB decoded) for 25 clips; the map walks on 7 (stand and six walk keys).

THIS CUTS HIS OWN FIGHT BODY, NOTHING REDRAWN: the stand and the six walk keys of the fight's YOU, in its eight turns, moved into the
map's people format (98 x 143 a frame, the foot at 135, the man's bottom two pixels above it, centred at 49, the same as every man
on BOHEMIA_RIG_PEOPLE and rig_mix: measured, the fight's YOU stands 110 px, the map's body 108, so no scaling). One sheet of its own,
slices/BOHEMIA_RIG_YOU.png + .json, 686 x 1144 (3.1 MB decoded), so the people's sheet and its colours are untouched.

Run: python3 tools/bohemia_run_the_main_man_on_the_map.py   (re-run when COMBAT re-renders YOU; the map reads it at boot)
"""
import json
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
PEOPLE = json.load(open(os.path.join(ROOT, 'slices/BOHEMIA_RIG_PEOPLE.json')))

def main():
    look = FR['looks']['you']
    src = Image.open(os.path.join(ROOT, 'slices/fight_rig', look['file'])).convert('RGBA')
    sw, sh, (fx, fy) = look['w'], look['h'], look['foot']
    cols = FR['cols']
    want = [cols.index('stand')] + [cols.index('walk@%d' % k) for k in range(6)]
    dirs = FR['dirs']
    assert dirs == PEOPLE['dirs'], 'the fight and the map turn the same eight ways'
    W, H, FOOT = PEOPLE['w'], PEOPLE['h'], PEOPLE['foot']
    # the fight's man stands on (fx, fy) with his lowest pixel 8 below it; the map's 2 above its foot line
    bottom_src = fy + 8
    dx, dy = W // 2 - fx, (FOOT - 2) - bottom_src
    out = Image.new('RGBA', (W * len(want), H * len(dirs)), (0, 0, 0, 0))
    for di in range(len(dirs)):
        for ci, c in enumerate(want):
            frame = src.crop((c * sw, di * sh, (c + 1) * sw, (di + 1) * sh))
            cell = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            cell.paste(frame, (dx, dy), frame)
            out.paste(cell, (ci * W, di * H))
    png = os.path.join(ROOT, 'slices/BOHEMIA_RIG_YOU.png')
    out.save(png, optimize=True)
    meta = {
        'what': "RUN [your main guy leads the walk] 10/26 (rule 263(a)): HIS main man on the map, the fight's own YOU (stand and six walk keys, eight turns), cut into the map's people format; nothing redrawn",
        'src': {'you': look.get('rig', 'records/target/combat/rig/you/rig.json'), 'sheet': 'slices/fight_rig/' + look['file']},
        'tool': 'tools/bohemia_run_the_main_man_on_the_map.py',
        'walks': ['you'], 'w': W, 'h': H, 'foot': FOOT, 'cols': len(want), 'gangs': ['you'], 'dirs': dirs,
    }
    json.dump(meta, open(os.path.join(ROOT, 'slices/BOHEMIA_RIG_YOU.json'), 'w'), indent=1)
    print('wrote', png, out.size, os.path.getsize(png), 'bytes')

if __name__ == '__main__':
    main()
