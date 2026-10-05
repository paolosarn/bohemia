#!/usr/bin/env python3
"""WHAT EACH BUILDING DOES IN A FIGHT: THREE SHEETS, TWO TYPES EACH  (COMBAT 2, round twenty)

OPEN row [more building types] (Paolo's sixth votes, rule 59): every building at 45 with its tiles' costs
and its cover, one sheet per two types. The pieces and the tags are made in the building cook
(tools/bohemia_combat2_building_types_cook_10_4_26.py, FURN_MAKERS / FURN_META); this cook only shows them,
from the game's camera, on the blocks the fight uses, with the tile tag in each tile's corner and the
pieces named on a key beside the picture (no text on the art itself).

  GAS STATION + MOTEL      the pumps under the canopy are cover that BURNS; the motel's walkway is high ground.
  CHURCH + SCHOOL          the church's steps are low cover; the school's fence is cover you see through; the
                           school's flat roof is high ground.
  WAREHOUSE + CASINO BACK  the warehouse's dock is high ground; the casino's back lot is dumpsters for cover.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES: every piece shows its top and its south face.
  CGRD-01 INTO THE BREACH: what a tile does is said by a thing you can see on it (a pump, a fence, steps).
  AH-01 THE BIBLE: the sun north-west, every shadow south-east.
  REUSE CHECK: the blocks, the buildings and the pieces are the building cook's; nothing is drawn here.

[bb every floor tile] records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md:
  every tile a type with its cost and effect; obstacles are cover. OURS: the obstacle is what the building was.

    python3 tools/bohemia_combat2_building_fight_facts_cook_10_5_26.py
      -> slices/vote/COMBAT2_BUILDINGS_GAS_AND_MOTEL_10_5.png
      -> slices/vote/COMBAT2_BUILDINGS_CHURCH_AND_SCHOOL_10_5.png
      -> slices/vote/COMBAT2_BUILDINGS_WAREHOUSE_AND_CASINO_10_5.png
"""
import importlib, os, sys
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
BT = importlib.import_module('bohemia_combat2_building_types_cook_10_4_26')
B, K, CV = BT.B, BT.K, BT.CV
os.chdir(REPO)
PX, PY, N = B.PX, B.PY, B.N
LETTER = {'rough': 'R', 'height': 'H', 'blocked': 'X', 'debris': 'D', 'water': 'W'}


def sheet(block, rows, out, title, key):
    board, pieces, _surf, grid = block[:4]
    cover = {k: fn() for k, fn in CV.PIECES}
    im = B.composed(board, pieces, cover).convert('RGB').crop((0, rows[0] * PY, N * PX, rows[1] * PY))
    d = ImageDraw.Draw(im)
    for r in range(rows[0], rows[1]):
        for c in range(N):
            t = grid[r][c]
            if t != 'flat': d.text((c * PX + 8, (r - rows[0]) * PY + 6), LETTER[t], font=K.font(30), fill=(255, 236, 160))
    sc = 0.5
    im = im.resize((int(im.size[0] * sc), int(im.size[1] * sc)), Image.LANCZOS)
    W = im.size[0] + 40
    o = Image.new('RGB', (W, im.size[1] + 60 + 26 * len(key) + 20), (12, 11, 10)); dd = ImageDraw.Draw(o)
    dd.text((20, 16), title, font=K.font(18), fill=(222, 181, 118))
    o.paste(im, (20, 50))
    for i, line in enumerate(key):
        dd.text((20, 60 + im.size[1] + i * 26), line, font=K.font(15), fill=(200, 170, 120))
    o.save(out, optimize=True)


def main():
    ms, wk = BT.main_street(911), BT.the_works(933)
    sheet(ms, (0, 3), 'slices/vote/COMBAT2_BUILDINGS_GAS_AND_MOTEL_10_5.png', 'THE GAS STATION AND THE MOTEL, AND WHAT THEY DO IN A FIGHT',
          ['the pumps under the canopy: cover that BURNS (a hit can set it alight)', "the motel's walkway: H, high ground you stand on", 'X: the walls you cannot enter'])
    sheet(ms, (2, 5), 'slices/vote/COMBAT2_BUILDINGS_CHURCH_AND_SCHOOL_10_5.png', 'THE CHURCH AND THE SCHOOL, AND WHAT THEY DO IN A FIGHT',
          ["the church's steps: low cover", "the school's fence: cover you can see through", "the school's flat roof: H, high ground"])
    sheet(wk, (0, 5), 'slices/vote/COMBAT2_BUILDINGS_WAREHOUSE_AND_CASINO_10_5.png', 'THE WAREHOUSE AND THE CASINO BACK, AND WHAT THEY DO IN A FIGHT',
          ["the casino's back lot: dumpsters, cover", "the warehouse's dock: H, high ground", 'X: the walls you cannot enter'])
    print('ok: three sheets')


if __name__ == '__main__':
    main()
