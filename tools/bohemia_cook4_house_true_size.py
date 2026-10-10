#!/usr/bin/env python3
"""COOK FOUR [one at a time], the ranch AT TRUE SIZE beside the character (Paolo 10/10:
'you're making houses that are just like two tiles by two tiles at the biggest... a building has to be
realistic size to the character models that we have').

THE RULER IS THE BODY, MEASURED: slices/settlement_people/cast_shortcoat.webp frame 0 paints 100 px tall
in its 112 box (bbox 33,7 to 80,107), a 1.75 m person, so 57 px a metre.  At that ruler:
  the house front 11.5 m = 656 px, its wall 3.0 m = 172 px, the front door 2.1 m = 120 px,
  the garage 6 m = 344 px wide, its door 2.3 m tall, the roof's front slope ~2.4 m seen = 140 px.
The tool asserts the door is taller than the person and the wall 1.7x the person, or it refuses.

THE PACK'S WAY (house one, which he called good direction): no roof plan, only the front slope and the
roof's edge; every piece at its own pixels, nothing scaled up (rule 105): the big surfaces are HIS
tiles laid side by side, the way his pack lays them:
  roof     5. Roof tiles #26 (the clay roof field) and #27 (slate, the garage), eave 5. Roof tiles #14,
           chimney #34
  wall     Wall tiles (1) #0 (cracked tan plaster)
  windows  5. Windows and broken glass #0, #3 at 1:1 (72 x 96 = a 1.3 by 1.7 m window, real)
  door     4. Doors and entrances #2 at 1:1 under a transom from his window glass
  garage   11. Industrial doors and gates #1 at 1:1, its slats laid twice across
Our paint: shade under the eave, the 1 px brown-black outline, a contact shadow.

Output: reference/art_bank/settlement/ and records/target/ (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30, our houses one and two (now known too small), and the
  character at 1:1 standing at the door; a real Las Vegas single-storey ranch (11-13 m front, 2.7-3 m
  plate height, a two-car garage 6 m).
  structure taken: the body's 57 px a metre; front slopes only; his tiles native.
  what changed: the house is five times the size of house two and a person fits through its door.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import A, outline, _over, AB, ROOT

PPM = 100 / 1.75                       # the body's own ruler, px per metre
M = lambda m: int(round(m * PPM))

def lay(tile, w, h, crop=None, dy=0):
    t = tile.crop(crop) if crop else tile
    out = Image.new('RGBA', (w, h)); y = 0; r = 0
    while y < h:
        x = -(t.width // 2) * (r % 2)
        while x < w:
            out.alpha_composite(t, (x, y)); x += t.width
        y += t.height - dy; r += 1
    return out

def shade_top(im, n=18, a=120):
    sh = Image.new('RGBA', im.size); sd = ImageDraw.Draw(sh)
    for i in range(n): sd.rectangle([0, i, im.width, i], fill=(30, 20, 14, int(a * (1 - i / n))))
    return _over(im, sh)

def roof(w, h, field, inset):
    """the front slope of a hipped roof: his roof field laid in rows, a trapezoid, his eave strip at the foot"""
    body = lay(field, w, h, crop=(4, 4, field.width - 4, field.height - 22), dy=6)
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon([(inset, 0), (w - inset, 0), (w - 1, h - 1), (0, h - 1)], fill=255)
    out = Image.new('RGBA', (w, h)); out.paste(body, (0, 0), m)
    eave = lay(A('settlement/pack_5_roof_tiles_014.png'), w, 30, crop=(0, 8, 96, 38))
    em = Image.new('L', (w, 30), 0); ImageDraw.Draw(em).polygon([(14, 0), (w - 14, 0), (w - 1, 29), (0, 29)], fill=255)
    out.paste(eave, (0, h - 30), em)
    sh = Image.new('RGBA', (w, h)); ImageDraw.Draw(sh).polygon([(0, h - 1), (inset, 0), (inset + 18, 0), (18, h - 1)], fill=(20, 14, 10, 95))
    ImageDraw.Draw(sh).polygon([(w - 1, h - 1), (w - inset, 0), (w - inset - 18, 0), (w - 18, h - 1)], fill=(20, 14, 10, 60))
    ImageDraw.Draw(sh).line([(inset, 1), (w - inset, 1)], fill=(255, 232, 196, 150), width=2)   # the ridge catching light
    return outline(_over(out, sh))

def ranch():
    plaster = A('settlement/pack_wall_tiles_1_000.png')
    W_H, H_W = M(11.5), M(3.0)               # house front, wall height
    W_G, H_G = M(6.0), M(2.7)                # garage
    ROOF_H = M(2.45)
    door = A('door/pack_4_doors_and_entrances_002.png')
    glass = A('settlement/pack_5_windows_and_broken_glass_003.png')
    transom = glass.crop((8, 30, 8 + door.width, 30 + M(2.1) - door.height))
    wins = [A('settlement/pack_5_windows_and_broken_glass_000.png'), A('settlement/pack_5_windows_and_broken_glass_003.png')]
    shutter = A('door/pack_11_industrial_doors_and_gates_001.png')

    house = lay(plaster, W_H, H_W, crop=(7, 10, 70, 86))   # inner cut: his tile's rim drew a grid
    dx = W_H // 2 - door.width // 2 - M(1.2)
    house.alpha_composite(transom, (dx, H_W - M(2.1))); house.alpha_composite(door, (dx, H_W - door.height))
    for k, wx in enumerate((M(0.9), M(3.0), W_H - M(3.4), W_H - M(1.5))):
        house.alpha_composite(wins[k % 2], (wx, M(0.75)))
    house = outline(shade_top(house))
    garage = lay(plaster, W_G, H_G, crop=(7, 10, 70, 86))
    sl = shutter.crop((12, 12, shutter.width - 12, shutter.height - 4))
    gd = lay(sl, M(4.8), M(2.25), dy=0)
    frame = Image.new('RGBA', (gd.width + 8, gd.height + 4), (70, 62, 56, 255)); frame.alpha_composite(gd, (4, 4))
    garage.alpha_composite(frame, ((W_G - frame.width) // 2, H_G - frame.height))
    garage = outline(shade_top(garage))

    r_house = roof(W_H + 40, ROOF_H, A('settlement/pack_5_roof_tiles_026.png'), M(2.2))
    r_gar = roof(W_G + 30, M(1.6), A('settlement/pack_5_roof_tiles_027.png'), M(1.4))
    chim = A('settlement/pack_5_roof_tiles_034.png')

    CW = W_H + W_G + 70; CH = ROOF_H + H_W + 24 + 50
    c = Image.new('RGBA', (CW, CH))
    g = Image.new('RGBA', c.size); ImageDraw.Draw(g).rectangle([10, CH - 20, CW - 10, CH - 10], fill=(30, 22, 16, 90))
    c.alpha_composite(g)
    gx = W_H + 34; gtop = CH - 18 - H_G
    c.alpha_composite(r_gar, (gx - 15, gtop - M(1.6) + 14)); c.alpha_composite(garage, (gx, gtop))
    c.alpha_composite(r_house, (0, CH - 18 - H_W - ROOF_H + 26)); c.alpha_composite(house, (20, CH - 18 - H_W))
    c.alpha_composite(chim, (M(2.9), CH - 18 - H_W - ROOF_H + 26 - chim.height + 40))   # the chimney stands out of the slope
    door_h = M(2.1)
    assert door.height >= 96 and door_h >= 100, 'the door must be taller than the person'
    assert H_W >= 1.7 * 100, 'the wall must be 1.7 people tall'
    return c, (20 + dx + door.width + 50, CH - 18)

def sheet(h, foot):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    two = A('settlement/COOK4_HOUSE_TWO_THE_RANCH.png')
    S = Image.new('RGBA', (h.width + 360, h.height + 120), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  Right: the ranch at true size, 57 px a metre, the character at its door.  Left: his pack house, and our house two (too small: a person was as tall as it).', fill=(230, 220, 200))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(two, (30, 220)); d.text((30, 352), 'our house two', fill=(200, 190, 170))
    m2 = man.copy(); S.alpha_composite(m2, (150, 70 + 96 - 107))
    ox = 300; oy = 60
    S.alpha_composite(h, (ox, oy)); S.alpha_composite(man, (ox + foot[0] - 56, oy + foot[1] - 107))
    d.text((ox + 10, oy + h.height + 12), 'house 11.5 m, wall 3 m, door 2.1 m, garage 6 m: a 1.75 m person at the door', fill=(230, 220, 200))
    return S

if __name__ == '__main__':
    h, foot = ranch()
    h.save(os.path.join(AB, 'settlement/COOK4_THE_RANCH_TRUE_SIZE.png'))
    sheet(h, foot).save(os.path.join(ROOT, 'records/target/COOK4_THE_RANCH_TRUE_SIZE.png'))
    print('ranch', h.size, 'px per m', round(PPM, 1))
