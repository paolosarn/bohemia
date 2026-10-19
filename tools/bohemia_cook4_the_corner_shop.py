#!/usr/bin/env python3
"""COOK FOUR [one at a time], asset: THE CORNER SHOP, at true size, at 45 degrees.

His votes so far: the houses are 'good direction', but 'you fell in love with the roof... you're not doing
anything else'.  So the next asset is a building that is NOT about its roof: a two-storey Las Vegas
corner shop, the kind on every strip-mall corner, with its FLAT roof top seen from above (a 45 degree view
sees the top), a storefront at street level, a roll-down shutter, an awning, the flat above.

THE RULER IS THE BODY (his 10/10 correction): 57 px a metre, the character beside the door at 1:1.
  front 9 m = 514 px, two storeys 6.4 m = 366 px, the roof top's depth seen at 45 degrees ~3.4 m = 194 px
  (his pack house: the top reads about as tall as a storey), the door 2.1 m, the shop window 2.4 m wide.
EVERY PIECE IS HIS, LAID AT ITS OWN PIXELS, a part that exists once drawn once (his 10/11 garage note):
  walls    Wall tiles (1) #0 (tan plaster)            roof top  1. Cracked contrete tiles (the flat roof)
  parapet  Wall tiles (1) #0's top edge, laid          awning    8. Market Stalls #2 (its striped canopy)
  windows  5. Windows and broken glass #0, #3, #19     door      4. Doors and entrances #2
  shutter  11. Industrial doors and gates #1, ONE door cut nine ways (one_roller_door)
Our paint: shade under the parapet and awning, the outline, a contact shadow.  Nothing drawn rectangle by
rectangle (rule 108): the tool only lays and cuts his tiles.

Output: reference/art_bank/settlement/ and records/target/ (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 (the proportion of top to face), his market stall #2 (the
  awning), our ranch at the same scale; a real Las Vegas two-storey corner shop (stucco, a flat roof with a
  parapet, a roll-down over the storefront, a striped awning).
  structure taken: 57 px a metre; top and face both seen; parts once, surfaces laid.
  what changed: a flat-roofed commercial building, the first that is not a gable.

REUSE CHECK (REUSE-FIRST, 7/22): every piece is his pack tile as bought, read from reference/art_bank (his approved set, 82a) and laid at its own pixels; imports bohemia_cook4_house_true_size, bohemia_cook4_one_house (this lane's own functions, not copied).  Written into this placeholder's tool 10/19 so the checker reads it; the art it made is not edited (rule 101c).
"""
import os, glob
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import A, outline, _over, AB, ROOT
from bohemia_cook4_house_true_size import M, lay, shade_top, one_roller_door

def corner_shop():
    plaster = A('settlement/pack_wall_tiles_1_000.png')
    conc = Image.open(sorted(glob.glob(os.path.join(AB, '*/pack_1_cracked_contrete_tiles_000.png')))[0]).convert('RGBA')
    W, H = M(9.0), M(6.4); TOP = M(3.4); PAR = 14
    face = lay(plaster, W, H, crop=(7, 10, 70, 86))
    # ground floor: the storefront (one big window), the door, the one roll-down
    win_big = [A('settlement/pack_5_windows_and_broken_glass_000.png'), A('settlement/pack_5_windows_and_broken_glass_003.png')]
    gf = H - M(3.2)
    for k in range(2): face.alpha_composite(win_big[k], (M(0.6) + k * (win_big[0].width - 2), H - M(0.6) - win_big[0].height))
    door = A('door/pack_4_doors_and_entrances_002.png')
    dx = M(0.6) + 2 * win_big[0].width + M(0.4)
    face.alpha_composite(door, (dx, H - door.height))
    sh = one_roller_door(A('door/pack_11_industrial_doors_and_gates_001.png'), M(3.4), M(2.6))
    face.alpha_composite(sh, (W - sh.width - M(0.5), H - sh.height))
    # the flat upstairs: three windows, one barred
    ups = [A('settlement/pack_5_windows_and_broken_glass_000.png'), A('settlement/pack_5_windows_and_broken_glass_019.png'), A('settlement/pack_5_windows_and_broken_glass_003.png')]
    for k, im in enumerate(ups):
        face.alpha_composite(im, (M(0.9) + k * M(2.8), M(0.6)))
    # the awning over the storefront: his stall's canopy, the striped band laid along
    stall = A('settlement/pack_8_market_stalls_002.png')
    canopy = stall.crop((4, 0, stall.width - 4, 30))
    aw = lay(canopy, dx + door.width + M(0.3), 30)
    face.alpha_composite(aw, (M(0.3), gf - 4))
    sh2 = Image.new('RGBA', face.size); sd = ImageDraw.Draw(sh2)
    for i in range(14): sd.rectangle([M(0.3), gf + 26 + i, M(0.3) + aw.width, gf + 26 + i], fill=(20, 14, 10, 120 - i * 8))
    face = outline(shade_top(_over(face, sh2), n=12, a=110))
    # the roof top seen from above: his cracked concrete laid flat, the parapet's lip round it
    top = lay(conc.crop((4, 4, conc.width - 4, conc.height - 4)), W, TOP)
    d = ImageDraw.Draw(top)
    lip = lay(plaster.crop((0, 0, 77, PAR)), W, PAR)
    top.alpha_composite(lip, (0, TOP - PAR)); top.alpha_composite(lay(plaster.crop((0, 0, 77, 8)), W, 8), (0, 0))
    # the roof is further from the sun's full face than the street front and sits below the parapet:
    # darker and cooler, with the parapet's shadow along its foot (light from above, the study page)
    dk = Image.new('RGBA', top.size, (0, 0, 0, 0)); dd = ImageDraw.Draw(dk)
    dd.rectangle([0, 0, W, TOP], fill=(24, 20, 18, 70))
    for i in range(18): dd.rectangle([0, TOP - PAR - 18 + i, W, TOP - PAR - 18 + i], fill=(16, 12, 10, 8 * i))
    top = _over(top, dk)
    lipf = lay(plaster.crop((0, 4, 77, 4 + PAR + 8)), W, PAR + 8)
    top.alpha_composite(lipf, (0, TOP - PAR - 8))
    ImageDraw.Draw(top).line([(0, TOP - PAR - 8), (W, TOP - PAR - 8)], fill=(236, 220, 190, 255), width=2)  # the lip catches the light
    top = outline(top)
    c = Image.new('RGBA', (W + 40, TOP + H + 40))
    g = Image.new('RGBA', c.size); ImageDraw.Draw(g).rectangle([6, TOP + H + 4, W + 34, TOP + H + 14], fill=(30, 22, 16, 90))
    c.alpha_composite(g); c.alpha_composite(top, (20, 0)); c.alpha_composite(face, (20, TOP))
    assert door.height >= 96 and H >= 3.4 * 100
    return c, (20 + dx + door.width + 40, TOP + H)

def sheet(h, foot):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png'); stall = A('settlement/pack_8_market_stalls_002.png')
    S = Image.new('RGBA', (h.width + 300, h.height + 90), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  Right: the corner shop, 9 m by two storeys, its flat roof seen from above, the character at its door.  Left: his pack house and stall.', fill=(230, 220, 200))
    S.alpha_composite(twin, (40, 70)); S.alpha_composite(stall, (40, 200)); S.alpha_composite(man, (150, 70 + 96 - 107))
    ox, oy = 270, 50
    S.alpha_composite(h, (ox, oy)); S.alpha_composite(man, (ox + foot[0] - 56, oy + foot[1] - 107))
    return S

if __name__ == '__main__':
    h, foot = corner_shop()
    h.save(os.path.join(AB, 'settlement/COOK4_THE_CORNER_SHOP.png'))
    sheet(h, foot).save(os.path.join(ROOT, 'records/target/COOK4_THE_CORNER_SHOP.png'))
    print('shop', h.size)
