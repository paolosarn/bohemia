#!/usr/bin/env python3
"""THE DISTRICT BOARDS, ON HIS SCREEN  (COMBAT TWO, [the district boards, on his screen], 10/18; rule 118)

His 10/18: 'A lot of the votes you saying were on a card visible were not visible for me.' The five district boards
(1e24171e) were registered at 0142e111 nine minutes after the art, but untagged in the triage and on a 2400 x 7080
sheet whose top row put five boards across: about 75 points a board on his phone, nothing a person can judge. This
tool makes the CARD he sees: the same five boards, re-laid by round one's own code (seeded, pixel for pixel), one under
the other, each at the size the fight opens on an upright phone (1170 device px, 390 pt at 3x: the card is shown at
the tab's width, so each board reads at the fight's own size), the district's name and one plain line above it, and
on top, in words he cannot miss, that the floor under them is being redrawn (his NO on the fight floor: 'I hate the
ground. I hate the floor. It's so fucking bad'; COOK TWO [the fight floor he hates]).

THE INPUT: tools/bohemia_combat2_a_board_from_every_district_cook_10_18_26.py, imported and run as it is; only its
sheet step is swapped for this card. Its manifest is rewritten byte for byte (seeded) and its old sheet is not touched.

REFERENCE CHECK (the 9/4 standing law): compared to the world through round one's own checks (each block beside its
map block and the map's plan, his pack twins, the 112-px man at 1:1) and to the card he said YES to last
(combat2-a-board-you-read-in-one-look-10-18: 'sure, better direction, not final', the whole board at the phone's width
the way the fight opens). structure taken: that card's opening frame, the board whole at 1170 px; what changed: one
board a row at the fight's own size instead of five across a 2400-px sheet, and the floor's status said in words.
REUSE CHECK: nothing fit to reuse for the card itself and nothing is drawn here: every board pixel is round one's
(COOK TWO's cells, COOK FOUR's houses and buildings, his pack tiles as bought), laid by its own code; this file only
places the five opening frames and the words on a dark page.

[bb the battle map] Battle Brothers shows a fight's ground the way you will fight on it, from the fight's own camera;
so does this card.

CANDIDATES ONLY (rule 100): records/target and the VOTE registry; nothing to slices/, engine/ or the demo.

    python3 tools/bohemia_combat2_the_district_boards_on_his_screen_cook_10_18_26.py      (about 5 minutes)
"""
import os, sys
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_combat2_a_board_from_every_district_cook_10_18_26 as D     # round one, as it is

OUT = 'records/target/COMBAT2_THE_DISTRICT_BOARDS_ON_HIS_SCREEN_10_18.webp'
BG, INK, DIM, WARN = (14, 13, 12), (236, 226, 204), (176, 168, 152), (214, 170, 92)
LINE = {
    'strip':      'The big boulevard, a middle strip of dead trees, the casino\'s front.',
    'downtown':   'Flat roofs packed tight, two-storey shops, a parking lot.',
    'suburb':     'Rows of ranch houses with block walls between the yards.',
    'wash':       'The concrete flood channel. Its floor is low ground; chain link runs along the top.',
    'industrial': 'Warehouses and rows of shipping containers, the suburbs across the street.',
}

def card(M, plans, boards, facts, frames):
    W = D.R4.PHONE_W; pad = 36
    big, mid, small = D.R1.font(64), D.R1.font(46), D.R1.font(38)
    blocks = []                                   # (kind, payload)
    def words(t, f, col, gap=10):
        for ln in D.R1.wrap(t, f, W - 2 * pad): blocks.append(('t', (ln, f, col, f.size + gap)))
    def space(h): blocks.append(('s', h))
    words('FIVE FIGHT BOARDS, ONE FROM EACH PART OF THE CITY', big, INK); space(18)
    blocks.append(('band', None)); space(10)
    words('THE FLOOR IS BEING REDRAWN.', mid, WARN)
    words('You said you hate the fight floor. Cook 2 is redrawing it now, and these five boards get the new floor the '
          'moment it lands. Judge where things stand: the roads, the houses, the walls, the cars, the cover. Not the ground.', small, INK)
    space(10); blocks.append(('band', None)); space(22)
    words('Each picture is the whole board at the size the fight opens on your phone held upright. '
          'Each one is cut from a real block of the map in that part of the city.', small, DIM)
    space(30)
    for name in D.ORDER:
        words(D.NAME[name], mid, INK, 6)
        words(LINE[name], small, DIM)
        space(8)
        blocks.append(('img', frames[name]))
        space(44)
    words('Candidates, not in the game yet. Round one\'s full sheet (each board beside its map block, and at 1:1 with the man) '
          'stays in the files.', small, DIM)
    H = pad
    for k, v in blocks:
        H += v[3] if k == 't' else v if k == 's' else 3 if k == 'band' else v.height
    im = Image.new('RGB', (W, H + pad), BG); d = ImageDraw.Draw(im); y = pad
    for k, v in blocks:
        if k == 't':
            d.text((pad, y), v[0], font=v[1], fill=v[2]); y += v[3]
        elif k == 's':
            y += v
        elif k == 'band':
            d.rectangle([pad, y, W - pad, y + 2], fill=WARN); y += 3
        else:
            im.paste(v, (0, y)); y += v.height
    im.save(OUT, quality=86, method=6)
    print('card', im.size, os.path.getsize(OUT) // 1024, 'KB')

D.sheet = card
if __name__ == '__main__':
    D.main()
