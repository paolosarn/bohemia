#!/usr/bin/env python3
"""COOK FOUR [one at a time] + [a house a man can live in], round 5 (10/17, rule 101d: one asset a round):
THE CORNER SHOP, THE NEXT BUILDING OF THE STRAIGHT-ROOF FAMILY.

The coordinator (10/16, AL): 'the corner shop and the motel wait their turn, one per round'; the board's NEXT after
the family: the corner shop.  The flat-roof corner shop of 10/11 (cook4-the-corner-shop-10-11) was drawn before the
roof was measured and before the family's rules: it shows a ROOF PLAN (his pack never draws one, the study page), it
floats (DIRECTION 10/10: 'no shadow, the houses float'), and its proportions were guessed.  A placeholder is never
edited (rule 101c), so this is a NEW asset on the family's code, and the flat one is superseded (rule 92).

THE BUILDING: the two-storey Las Vegas corner shop (a strip corner's stucco block, 1950-1975: a 9 m front, a 3.2 m
shop floor under a 2.8 m flat above, the storefront glass, a canvas awning, a roll-down over the loading door,
a straight roof over the lot) at the body's 57 px a metre, the same man at its door as at every ranch door.

EVERY ROOF IS THE MEASURED ONE: the three ratios tools/bohemia_cook4_the_roof_measured.py reads off his pack house
#30 and roof field #26 on every run (roof/wall about 1.49, the eave about 14 percent past each wall, a lean of about
6 percent, never a triangle).  The ratio is taken against ONE storey's wall, not two: at 45 degrees the roof's seen
depth is the building's depth, and a two-storey shop is no deeper than a one-storey ranch; a roof 1.49 times a
two-storey wall would be a roof nine metres deep.  Slate (#27), the family's commercial roof (the garage wears it).

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part that
exists once (a door, a window, the awning, the shutter, the chimney) is laid once at 1:1.  Our paint is weather,
wear and light only: the shade under the eave and under the awning, the string course's shadow between the floors,
the one-pixel outline, the contact shadow and the soft cast shadow.  Analog horror, one wrong thing from the
world's state: the flat upstairs has one window barred and one boarded; the shop is half shut, its roll-down
down.  What the pack never did and we did not either: no roof plan, no gable end facing the viewer.
  roof          5. Roof tiles #27 (slate), eave strip #15 (slate), chimney #34
  walls         Wall tiles (1) #0 (cracked tan plaster), its top rim as the string course between the floors
  storefront    5. Windows and broken glass #0, #3, #0 side by side (3.8 m of glass), the door 4. Doors and
                entrances #7 under a transom of his glass, the awning from 8. Market Stalls #2's canopy
  roll-down     11. Industrial doors and gates #1, ONE door cut nine ways (one_roller_door)
  upstairs      5. Windows and broken glass #0, #19 (barred), #6 (boarded)

Output: reference/art_bank/settlement/COOK4_CORNER_SHOP_STRAIGHT_ROOF.png and the sheet
records/target/COOK4_THE_CORNER_SHOP_STRAIGHT_ROOF.png (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 and his stall 8. Market Stalls #2 at 1:1 on the sheet, the
  character at 1:1 at the door, the plain ranch of the family beside it at the same scale, the flat-roof shop it
  replaces at 1:1, and the real thing: the Las Vegas two-storey corner commercial block (stucco, a 9 to 12 m front,
  3 to 3.4 m shop floor, 2.7 to 3 m flat above, a canvas awning over the glass, a roll-down over the side door).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the shadow.
  what changed: the shop joins the family's roof and ground instead of the roof plan the pack never draws.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import A, outline, _over, AB, ROOT
from bohemia_cook4_the_roof_measured import lay, shade_top, one_roller_door, M, RATIO, EAVE, LEAN
from bohemia_cook4_the_straight_roof_family import (wall, door_at, windows, chimney, grounded, WALL_H, ROOF_H,
                                                     SLATE, WIN, DOOR)

SHOP_H, FLAT_H = M(3.2), M(2.8)                    # the shop floor and the flat above: 6 m of wall
BARRED = 'settlement/pack_5_windows_and_broken_glass_019.png'
STALL = 'settlement/pack_8_market_stalls_002.png'
SHUTTER = 'door/pack_11_industrial_doors_and_gates_001.png'


def slate_roof(w, h):
    """the family's straight roof in slate with the SLATE eave strip (#15) at its foot: the shared roof lays the
    clay strip under every field, which is wrong under slate (the garage ranch carries that and stays as it is,
    rule 101c).  Same measured shape: the lean, the ridge, the back slope in shade, the eave past the wall."""
    field = A(SLATE); inset = int(w * LEAN)
    body = lay(field, w, h, crop=(4, 4, field.width - 4, field.height - 22), dy=6)
    px = sorted(sum(p[:3]) for p in field.getdata() if p[3] > 200)
    dark = [p for p in field.getdata() if p[3] > 200 and sum(p[:3]) <= px[len(px) // 4]]
    base = Image.new('RGBA', (w, h), tuple(int(sum(c[i] for c in dark) / len(dark)) for i in range(3)) + (255,))
    base.alpha_composite(body); body = base
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon([(inset, 0), (w - inset, 0), (w - 1, h - 1), (0, h - 1)], fill=255)
    out = Image.new('RGBA', (w, h)); out.paste(body, (0, 0), m)
    e = A('settlement/pack_5_roof_tiles_015.png'); eave = lay(e, w, 30, crop=(0, 8, 96, 38))
    em = Image.new('L', (w, 30), 0); ImageDraw.Draw(em).polygon([(14, 0), (w - 14, 0), (w - 1, 29), (0, 29)], fill=255)
    out.paste(eave, (0, h - 30), em)
    sh = Image.new('RGBA', (w, h)); d = ImageDraw.Draw(sh)
    d.polygon([(0, h - 1), (inset, 0), (int(inset * 1.25), 0), (int(inset * .35), h - 1)], fill=(20, 14, 10, 105))
    d.polygon([(w - 1, h - 1), (w - inset, 0), (w - int(inset * 1.25), 0), (w - int(inset * .35), h - 1)], fill=(20, 14, 10, 55))
    back = int(h * .14)
    d.rectangle([0, 0, w, back], fill=(18, 12, 8, 120))
    d.line([(0, back), (w, back)], fill=(255, 236, 200, 200), width=3)
    d.line([(0, back + 3), (w, back + 3)], fill=(30, 20, 14, 140), width=2)
    for i in range(10): d.rectangle([0, h - 40 + i, w, h - 40 + i], fill=(20, 14, 10, 6 * i))
    return outline(_over(out, sh))


def string_course(w):
    """the band between the floors: his plaster's top rim laid along, lit on top, its shadow falling on the shop
    front below (light from above)"""
    p = A('settlement/pack_wall_tiles_1_000.png')
    band = lay(p.crop((0, 0, 77, 12)), w, 12)
    out = Image.new('RGBA', (w, 12 + 16))
    out.alpha_composite(band, (0, 0))
    d = ImageDraw.Draw(out)
    d.line([(0, 0), (w, 0)], fill=(236, 220, 190, 255), width=2)
    for i in range(16): d.rectangle([0, 12 + i, w, 12 + i], fill=(30, 20, 14, int(130 * (1 - i / 16))))
    return out


def awning(w):
    """his stall's striped canopy laid along the storefront, once, the width of the glass and the door"""
    stall = A(STALL)
    canopy = stall.crop((4, 0, stall.width - 4, 30))
    return lay(canopy, w, 30)


def corner_shop():
    W = M(9.0); H = SHOP_H + FLAT_H
    w = wall('cracked', W, H)
    # the shop floor: 3.8 m of storefront glass, the door under its transom, the awning over both
    glass = [A(WIN['a']), A(WIN['b']), A(WIN['a'])]
    gx = M(0.5)
    for g in glass:
        w.alpha_composite(g, (gx, H - M(0.5) - g.height)); gx += g.width - 2
    dx = gx + M(0.3)
    door_end = door_at(w, 'wood', dx)
    aw = awning(door_end + M(0.3) - M(0.3))
    ay = H - M(2.45)
    w.alpha_composite(aw, (M(0.3), ay))
    sh = Image.new('RGBA', w.size); sd = ImageDraw.Draw(sh)
    for i in range(16): sd.rectangle([M(0.3), ay + 30 + i, M(0.3) + aw.width, ay + 30 + i], fill=(20, 14, 10, 130 - i * 8))
    w = _over(w, sh)
    # the one roll-down over the loading door at the right
    roll = one_roller_door(A(SHUTTER), M(3.0), M(2.6))
    w.alpha_composite(roll, (W - roll.width - M(0.5), H - roll.height))
    # the flat above: three windows, one barred, one boarded (the one wrong thing)
    ups = [A(WIN['a']), A(BARRED), A(WIN['boarded'])]
    for k, im in enumerate(ups):
        w.alpha_composite(im, (M(0.9) + k * M(3.0), M(0.7)))
    # the string course between the floors, its shadow on the shop front
    w.alpha_composite(string_course(W), (0, FLAT_H - 12))
    w = outline(shade_top(w))
    # the measured roof over the lot: one storey's ratio, slate, the chimney out of the slope
    r = slate_roof(int(W * (1 + 2 * EAVE)), ROOF_H)
    oh = (r.width - W) // 2
    X = oh + 4; top = ROOF_H - 26; base = top + H
    parts = [(w, X, top, (X, X + W, base)),
             (r, X - oh, 0, None),
             (chimney(), X + M(6.6), 26, None)]
    assert A(DOOR['wood']).height >= 96 and M(2.1) >= 100, 'the door must be taller than the person'
    assert H >= 3.4 * 100, 'two storeys must be 3.4 people tall'
    assert ROOF_H == int(WALL_H * RATIO), 'the roof takes the measured ratio against one storey'
    return grounded(parts), (X + dx, base), 'THE CORNER SHOP  9 m front, a 3.2 m shop floor under a 2.8 m flat, the measured slate roof, one roll-down'


def sheet(shop, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png'); stall = A(STALL)
    ranch = A('settlement/COOK4_RANCH_PLAIN.png')
    old = A('settlement/COOK4_THE_CORNER_SHOP.png')
    GAP = 44
    row_h = max(shop.height, ranch.height, old.height) + 60
    W = GAP + shop.width + GAP + ranch.width + GAP + old.width + GAP
    H = 250 + row_h
    S = Image.new('RGBA', (W, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE CORNER SHOP, the next building of the straight-roof family: two storeys at the body\'s size (57 px a metre), its roof shaped by the numbers read off your pack house #30 (roof %.2fx one storey, eaves %d%% past each wall, a %d%% lean, no triangle, no roof plan).' % (RATIO, round(EAVE * 100), round(LEAN * 100)), fill=(230, 220, 200))
    d.text((16, 28), 'Top left: your pack house, your stall and the 1.75 m man at 1:1.  Middle: the plain ranch beside it, the same street, the same scale.  Right: the flat-roof shop it replaces.  A placeholder until your moodboard.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 60)); d.text((30, 162), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(stall, (140, 60)); d.text((140, 162), 'his stall #2', fill=(200, 190, 170))
    S.alpha_composite(man, (250, 60 + 96 - 107))
    y = 230
    x = GAP
    S.alpha_composite(shop, (x, y + row_h - 60 - shop.height))
    S.alpha_composite(man, (x + foot[0] + A(DOOR['wood']).width + 44 - 56, y + row_h - 60 - shop.height + foot[1] - 107))
    d.text((x + 6, y + row_h - 50), '1  ' + label, fill=(230, 220, 200))
    x += shop.width + GAP
    S.alpha_composite(ranch, (x, y + row_h - 60 - ranch.height))
    d.text((x + 6, y + row_h - 50), 'the plain ranch of the family, its neighbour at the same scale', fill=(200, 190, 170))
    x += ranch.width + GAP
    S.alpha_composite(old, (x, y + row_h - 60 - old.height))
    d.text((x + 6, y + row_h - 50), 'the flat-roof shop of 10/11 it replaces: a roof plan the pack never draws, no shadow', fill=(200, 190, 170))
    return S


if __name__ == '__main__':
    shop, foot, label = corner_shop()
    shop.save(os.path.join(AB, 'settlement/COOK4_CORNER_SHOP_STRAIGHT_ROOF.png'))
    S = sheet(shop, foot, label)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_CORNER_SHOP_STRAIGHT_ROOF.png'))
    print('shop', shop.size, 'sheet', S.size, 'roof/wall %.2f eave %.3f lean %.3f' % (RATIO, EAVE, LEAN))
