#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the reference twin] round two: THE PLACES (rule 82, 82a; rule 86, Paolo 10/10: 'the
settlements all look like dogshit and not organic with the map'). Ours beside the thing it should look like, at the
same pixels: the place as the map shows it now, COOK FOUR's new map house from his skins, and the same place in the
settlement screen built from his pack; then the ground between places beside his pack ground. Three differences per
row and the one change that closes most of the gap.

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (reference/art_bank, his 7/13 confirmed set), AH-01 and AH-03. The pack is the ruler; no
reference game.

usage: python3 tools/bohemia_direction_twin_places.py <map screenshot, phone 3x> <out.png>
"""
import sys, os, glob, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP, OUT = sys.argv[1], sys.argv[2]
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BANK = os.path.join(ROOT, 'reference/art_bank')
BG, INK, GOOD, BAD, DIM, TWIN = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (150, 142, 128), (150, 190, 160)


def detail(im):
    L = np.asarray(im.convert('L')).astype(float)
    return round(float(np.maximum(np.abs(np.diff(L, axis=1))[:-1], np.abs(np.diff(L, axis=0))[:, :-1]).mean()), 1)


def values(im):
    L = np.asarray(im.convert('L')).astype(float)
    return int(np.percentile(L, 95) - np.percentile(L, 5))


mp = Image.open(MAP).convert('RGB')
place = mp.crop((60, 1700, 500, 2060))                         # the CUSTOM place at the map's opening stop, 1:1
lots = mp.crop((560, 1300, 1000, 1660))                        # the lots between places, 1:1
hero = Image.open(os.path.join(ROOT, 'slices/cook4_map_houses/town.png')).convert('RGBA')
hero = hero.resize((hero.width * 2, hero.height * 2), Image.NEAREST)   # COOK FOUR's hero at 2x, as a 3x phone draws it near
settle = Image.open(os.path.join(ROOT, 'slices/vote/COOK4_THE_SETTLEMENT_FROM_THE_PACKS_TWIN.webp')).convert('RGB').crop((1215, 600, 1655, 960))
g = [Image.open(f).convert('RGBA') for f in sorted(glob.glob(os.path.join(BANK, 'ground', 'pack_2_dirt_path_tiles_*.png')))[:4]
     + sorted(glob.glob(os.path.join(BANK, 'ground', 'pack_2_dirt_path_tiles_*.png')))[20:24]
     + sorted(glob.glob(os.path.join(BANK, 'ground', 'pack_15_dead_trees_and_dry_plants_*.png')))[:4]
     + sorted(glob.glob(os.path.join(BANK, 'ground', 'pack_7_burnt_ground_tiles_*.png')))[:4]]
pack_ground = Image.new('RGB', (440, 480), (40, 38, 34))
for k, t in enumerate(g):
    t.thumbnail((110, 120), Image.NEAREST); pack_ground.paste(t, ((k % 4) * 110, (k // 4) * 120), t)

ROWS = [('THE PLACE', [('ON THE MAP NOW', place), ("COOK FOUR'S NEW MAP HOUSE", hero), ('THE SAME PLACE, SETTLEMENT SCREEN', settle)],
         ['the place is a raised square plate with a pale edge: a board piece set on the map, not a place on the ground',
          'the place is three flat boxes; his pack house has a tiled roof, glass, a door, a lamp and wear',
          "COOK FOUR's new house is the right material, but it is one house copied in rows at one angle, still on a plate"],
         'the map shows a small copy of the settlement screen\'s own picture, standing on the ground with a shadow, no plate'),
        ('THE GROUND BETWEEN', [('ON THE MAP NOW', lots), ('HIS PACK GROUND (the twin)', pack_ground)],
         ['every lot is the same grey grit, busy everywhere at one value: noise, not ground; his has dirt, dry plants, burnt patches',
          'every lot is a ruled square with straight edges; his tiles break at the edge into the next',
          'no lot reads as a kind: a yard, a slab, a ruin, a roof all look the same from here'],
         'lay the lots from his ground families, one family per kind, so the map reads as places before it reads labels')]

F_T, F_L, F_S = ImageFont.truetype(ROM, 26), ImageFont.truetype(ROM, 17), ImageFont.truetype(ROM, 15)
CW, GAP = 440, 30
W = 30 + 3 * CW + 2 * GAP + 30
H = 80 + sum(34 + 400 + 30 + 26 * 5 + 40 for _ in ROWS)
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet)
d.text((30, 24), 'THE TWIN: THE PLACES. OURS LEFT, HIS PACK RIGHT, ONE PIXEL TO ONE', font=F_T, fill=INK)
y = 80; m = {}
for title, cols, diffs, change in ROWS:
    for i, (cap, im) in enumerate(cols):
        x = 30 + i * (CW + GAP)
        d.text((x, y), cap, font=F_L, fill=TWIN if 'PACK' in cap or 'SETTLEMENT' in cap else GOOD)
        c = im.convert('RGBA'); c.thumbnail((CW, 400), Image.NEAREST)  # a 4-row twin shrinks; the 1:1 crops do not
        sheet.paste(c, (x, y + 34), c)
        m['%s / %s' % (title, cap)] = dict(detail=detail(im), value_range=values(im))
        d.text((x, y + 34 + 400 + 4), 'detail %.1f  value range %d' % (detail(im), values(im)), font=F_S, fill=DIM)
    y += 34 + 400 + 30
    for k, t in enumerate(diffs): d.text((30, y), '%d  %s' % (k + 1, t), font=F_S, fill=BAD); y += 26
    d.text((30, y), 'THE ONE CHANGE: ' + change, font=F_S, fill=GOOD); y += 26 * 2 + 40
sheet.save(OUT)
json.dump(m, open(OUT.replace('.png', '.json'), 'w'), indent=1)
print(json.dumps(m))
