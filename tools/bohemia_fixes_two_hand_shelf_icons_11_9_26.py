"""FIXES 11/9 (ask row 537, rule 424(c)): the three two-handed objects the fight draws (WEAPONS 11/7: the gift-shop claymore, the
ditch blade, the tow chain) had no shelf picture, so the smith sold a two-handed sword on the one-hand machete's tile. Their
pictures are WEAPONS' own renders of those models (records/target/cook_every_weapon/alone_<n>/side.png, the master rig), turned
to the bag's diagonal the way COOK's shelf renders lie (do_shelf: crop, box filter down, a hard alpha), sized to the kit's tiles
(96 px on the long side). Nothing is drawn by hand; no pixel of the renders is changed but the turn and the scale.

    python3 tools/bohemia_fixes_two_hand_shelf_icons_11_9_26.py
"""
import os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/cook_every_weapon')
OUT = os.path.join(ROOT, 'slices/market_icons')
WANT = {'gift_shop_claymore': 'w_claymore', 'ditch_blade': 'w_ditch_blade', 'tow_chain': 'w_tow_chain'}
LONG = 96
for model, tile in WANT.items():
    im = Image.open(os.path.join(SRC, 'alone_' + model, 'side.png')).convert('RGBA')
    im = im.crop(im.getbbox()).rotate(45, resample=Image.BICUBIC, expand=True)
    im = im.crop(im.getbbox())
    k = LONG / max(im.width, im.height)
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.BOX)
    a = im.split()[3].point(lambda v: 255 if v > 96 else 0); im.putalpha(a)
    im.save(os.path.join(OUT, tile + '.png'), optimize=True)
    print(tile, im.size)
p = os.path.join(OUT, 'SOURCES.txt'); t = open(p).read()
for model, tile in WANT.items():
    line = ('%s (11/9, FIXES [the smith\'s shelf], rule 424(c), ask row 537): not a pack tile; WEAPONS\' own side render of '
            'reference/models/bohemia/item_%s.glb (records/target/cook_every_weapon/alone_%s/side.png) turned to the bag\'s diagonal '
            '(tools/bohemia_fixes_two_hand_shelf_icons_11_9_26.py)') % (tile, model, model)
    if tile + ' (11/9' not in t: t = t.rstrip('\n') + '\n' + line
open(p, 'w').write(t + '\n')
