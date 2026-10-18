#!/usr/bin/env python3
"""COOK FOUR [one at a time] + [the six buildings from the packs], round 9 (10/18, rule 101d: one asset a round):
THE WAREHOUSE, THE NEXT BUILDING OF THE STRAIGHT-ROOF FAMILY, IN THE VALLEY'S TANS.

Round 8's NEXT line: 'his word; then the warehouse, one round'.  Of the six building types on [the six buildings
from the packs] (church, school, gas station, motel, warehouse, casino) the family has drawn the motel and the
gas station; the warehouse is the third.  One version (rule 95).

THE BUILDING: the Las Vegas light-industrial warehouse of Industrial Road and Western Avenue (1960-1980): a
tall box of concrete panels, about 6 m to the plate, a loading dock 1.2 m high (a truck bed's height) and 2 m
deep along its front, three dock doors of 3 x 3.6 m standing on the dock, a row of small high windows under the
eave, and a one-storey office stuck on the end where the man door is.  At the body's 57 px a metre, the same
man at the office door as at every ranch door.

EVERY ROOF IS THE MEASURED ONE, IN THE TANS: the shed and the office wear the straight roof read off his pack
house #30 (tools/bohemia_cook4_the_roof_measured.py, every run), in round 6's tan field, with the eave and lean
in metres from the 10 m ranch as the motel and the gas station took them.  The roof is measured against one
storey, as on the gas station's tall bays: a roof seen from above at 45 degrees shows its depth, not its wall.

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part
that exists once is laid once at 1:1.  The shed's wall is his light stone panel (Wall tiles 1 #5), the nearest
thing in the packs to tilt-up concrete; the dock is his pale cracked slab (Floor and wall tiles #22), its face
and its top seen from above; the dock doors are his shutter cut to one roll-up each (the family's
one_roller_door); the fence is his chain link with his KEEP OUT wired on (the family's fence).  No pallet, no
drum, no truck: every pack prop is a 96 px box, so at 1:1 they are giants and at any other scale they mix
pixel sizes (rule 114).  Our paint is weather, wear and light only: the shade under each eave, the seams
between the panels, the one-pixel outline, the contact and cast shadow, and one light.  Analog horror, ONE
wrong thing from the world's state: every door is down and the yard is dead, but the office's barred window
is lit warm from inside.  Somebody keeps the lights on in a building nobody uses.
  roofs         the tan field COOK4_ROOF_TAN_FIELD (from his clay #26, eave #14)
  walls         Wall tiles (1) #5 (light stone panels) on the shed, #7 (flat tan render) on the office
  dock          Floor tiles and wall tiles #22 (pale cracked slab), face and top
  doors         4. Doors and entrances #7 (the office); 11. Industrial doors and gates #1 cut to one roll-up
                per dock door
  windows       5. Windows and broken glass #0, #3, #6 (the high row, one boarded), #19 (barred, lit)
  fence         13. Fences and wire #0, #6 (KEEP OUT), the family's fence
  the yard      15. Street props #21 (one bin at the office)

REUSE CHECK: every surface is a pack tile already in reference/art_bank, the roof field is round 6's tan file,
and the walls, doors, roofs, roll-up, fence and shadow come from the family's own functions and the motel's
straight roof (imported, not copied); the only new code is the dock's face and top, the lit window and the
layout.

Output: reference/art_bank/settlement/COOK4_WAREHOUSE_STRAIGHT_ROOF.png and the sheet
records/target/COOK4_THE_WAREHOUSE.png (rule 100: never slices/ or engine/).
Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/
COOK4_THE_VALLEY_TANS.json.  Light: from above (+9.3 top over bottom, the study page).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the character at 1:1 at the office door,
  the tan plain ranch of round 6 and the gas station of round 8 beside it at the same scale, and the real thing:
  the 1960s-1970s Las Vegas warehouse (concrete panel walls 5.5 to 7 m to the plate, a dock at truck-bed height
  1.1 to 1.3 m, dock doors 2.7 to 3 m wide and 3 to 3.6 m tall at 5 to 6 m centres, a small office on one end).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the shadow.
  what changed: a fourth kind of building joins the family's roof, tans and ground: the first with a raised
  floor in front of its wall and the first twice a house's height.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import outline, _over, AB, ROOT
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_motel_straight_roof as motel
from bohemia_cook4_the_valley_tans import A_redirected as A
from bohemia_cook4_the_roof_measured import lay, shade_top, one_roller_door, M, RATIO

fam.A = A; rm.A = A                                   # the family's code, the round-6 tan fields
WALL_H, ROOF_H = fam.WALL_H, fam.ROOF_H
EAVE_PX, straight_roof = motel.EAVE_PX, motel.straight_roof
CLAY = 'settlement/pack_5_roof_tiles_026.png'
SLAB = 'settlement/pack_floor_tiles_and_wall_tiles_022.png'
SHUTTER = 'door/pack_11_industrial_doors_and_gates_001.png'
LIT = 'settlement/pack_5_windows_and_broken_glass_019.png'
BIN = 'prop/pack_15_street_props_021.png'
SHED_H = M(6.0)                                       # the plate of the shed, two storeys of a house
BAYS, BAY = 3, M(5.5)                                 # three dock doors at 5.5 m centres
SHED_W = BAYS * BAY + M(1.5)                          # 18 m of front
DOCK_H, DOCK_D = M(1.2), M(2.0)                       # a truck bed's height, 2 m deep
DOCK_TOP = int(DOCK_D * 0.5)                          # its top seen from above at 45 degrees (the family's walk)
DW, DH = M(3.0), M(3.6)                               # a dock door
OFFICE, OFFICE_H = M(5.0), M(3.2)


def lit(win):
    """the one wrong thing: the barred window's dark glass lit warm from inside, its bars left dark"""
    out = win.copy(); px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            l = 0.299 * r + 0.587 * g + 0.114 * b
            if a > 200 and l < 70 and 10 < x < out.width - 10 and 10 < y < out.height - 10:
                k = 1 - l / 70
                px[x, y] = (int(r + (214 - r) * k), int(g + (160 - g) * k), int(b + (84 - b) * k), a)
    return out


def shed():
    """the shed's wall: his stone panels to 6 m, the seams between the bays, the high windows under the eave,
    three dock doors standing 1.2 m up on the dock"""
    w = fam.wall('stone', SHED_W, SHED_H)
    x0 = M(0.75)
    sd = Image.new('RGBA', w.size); d = ImageDraw.Draw(sd)
    for k in range(1, BAYS):                                              # the panel joints between the bays
        x = x0 + k * BAY - (BAY - DW) // 2
        d.rectangle([x - 2, 0, x + 1, SHED_H], fill=(30, 20, 14, 90))
    w = _over(w, sd)
    highs = ['a', 'b', 'boarded', 'a', 'b', 'a']
    for k, key in enumerate(highs):                                       # small high windows under the eave
        win = A(fam.WIN[key]).crop((0, 0, 96, 60))
        w.alpha_composite(win, (x0 + k * (SHED_W - 2 * x0 - 96) // (len(highs) - 1), M(0.6)))
    for k in range(BAYS):
        door = one_roller_door(A(SHUTTER), DW, DH)
        w.alpha_composite(door, (x0 + k * BAY + (BAY - DW) // 2 - M(0.25), SHED_H - DOCK_H - DH))
    return outline(shade_top(w))


def dock(width):
    """the loading dock: his slab as the face (in shade, facing us under a light from above) and as the top
    (seen from above, lit), a dark lip where the top meets the face"""
    t = A(SLAB); c = (6, 6, t.width - 6, t.height - 6)
    top = lay(t, width, DOCK_TOP, crop=c)
    face = lay(t, width, DOCK_H, crop=c)
    sh = Image.new('RGBA', face.size, (24, 16, 10, 70))
    face = _over(face, sh)
    D = Image.new('RGBA', (width, DOCK_TOP + DOCK_H))
    D.alpha_composite(top, (0, 0)); D.alpha_composite(face, (0, DOCK_TOP))
    d = ImageDraw.Draw(D)
    d.line([(0, DOCK_TOP), (width, DOCK_TOP)], fill=(232, 220, 196, 255), width=2)   # the dock's edge catches light
    d.line([(0, DOCK_TOP + 2), (width, DOCK_TOP + 2)], fill=(30, 20, 14, 200), width=2)
    return outline(D)


def office():
    """the office on the end: flat render, the man door, the barred window lit from inside"""
    w = fam.wall('flat', OFFICE, OFFICE_H)
    door = A(fam.DOOR['wood']); glass = A(fam.WIN['b'])
    dx = M(0.5)                                               # the door on the street end, clear of the dock
    w.alpha_composite(glass.crop((8, 30, 8 + door.width, 30 + M(2.1) - door.height)), (dx, OFFICE_H - M(2.1)))
    w.alpha_composite(door, (dx, OFFICE_H - door.height))
    w.alpha_composite(lit(A(LIT)), (OFFICE - A(LIT).width - M(0.6), OFFICE_H - M(0.9) - A(LIT).height))
    return outline(shade_top(w)), dx


def warehouse():
    sh = shed()
    off, dx = office()
    dk = dock(SHED_W)
    fen = fam.fence(3, sign=True)
    r_shed = straight_roof(SHED_W + 2 * EAVE_PX, ROOF_H, A(CLAY))
    r_off = straight_roof(OFFICE + 2 * EAVE_PX, ROOF_H, A(CLAY))
    base = ROOF_H + SHED_H                                         # the wall's foot, one ground line for both walls
    XO = 10 + EAVE_PX
    XS = XO + OFFICE                                               # the shed shares the office's side wall
    XF = XS + SHED_W + M(0.6)                            # the yard fence past the shed's end
    parts = [(r_shed, XS - EAVE_PX, base - SHED_H - ROOF_H + 26, None),
             (sh, XS, base - SHED_H, (XS, XS + SHED_W, base)),
             (dk, XS, base - DOCK_H, (XS, XS + SHED_W, base + DOCK_TOP)),
             (fen, XF, base + DOCK_TOP - fen.height, None),
             (A(BIN), XO - M(1.2), base - A(BIN).height + 6, None),
             (off, XO, base - OFFICE_H, (XO, XO + OFFICE, base)),
             (r_off, XO - EAVE_PX, base - OFFICE_H - ROOF_H + 26, None)]
    shift = -min(y for im, x, y, fp in parts)
    parts = [(im, x, y + shift, (fp[0], fp[1], fp[2] + shift) if fp else None) for im, x, y, fp in parts]
    assert A(fam.DOOR['wood']).height >= 96 and M(2.1) >= 100, 'the door must be taller than the person'
    assert SHED_H - DOCK_H - DH >= M(0.8), 'a dock door fits under the plate with the high windows over it'
    assert 1.1 <= DOCK_H / (100 / 1.75) <= 1.3, 'the dock stands at a truck bed\'s height'
    assert ROOF_H == int(WALL_H * RATIO), 'the roof takes the measured ratio against one storey'
    label = ('THE WAREHOUSE  %.0f m: a 6 m shed of concrete panels, three dock doors on a 1.2 m dock, high windows, '
             'the office on the end, the measured tan roofs; the office window lit from inside'
             % ((XS + SHED_W - XO) / (100 / 1.75)))
    return fam.grounded(parts), (XO + dx, base + shift), label


def sheet(wh, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    ranch = A('settlement/COOK4_RANCH_TAN_PLAIN.png')
    gas = A('settlement/COOK4_GAS_STATION_STRAIGHT_ROOF.png')
    GAP = 44
    W = max(wh.width, ranch.width + GAP + gas.width) + 2 * GAP
    H = 230 + wh.height + 60 + max(ranch.height, gas.height) + 70
    S = Image.new('RGBA', (W, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE WAREHOUSE, the next building of the straight-roof family, in the valley\'s tans: shed, dock and office at the body\'s size (57 px a metre), every roof shaped by the numbers read off your pack house #30 (roof %.2fx one storey).' % RATIO, fill=(230, 220, 200))
    d.text((16, 28), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: from above.  A placeholder until your moodboard.', fill=(200, 190, 170))
    d.text((16, 44), 'Top left: your pack house and the 1.75 m man at 1:1.  Below the warehouse: the tan ranch and the gas station beside it at the same scale, the street it would stand on.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 70 + 96 - 107))
    y = 200
    S.alpha_composite(wh, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + A(fam.DOOR['wood']).width + 24 - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + wh.height + 8), '1  ' + label, fill=(230, 220, 200))
    y += wh.height + 60
    rh = max(ranch.height, gas.height)
    S.alpha_composite(ranch, (GAP, y + rh - ranch.height))
    d.text((GAP + 6, y + rh + 8), 'the tan plain ranch of round 6', fill=(200, 190, 170))
    S.alpha_composite(gas, (GAP * 2 + ranch.width, y + rh - gas.height))
    d.text((GAP * 2 + ranch.width + 6, y + rh + 8), 'the gas station of round 8', fill=(200, 190, 170))
    return S


if __name__ == '__main__':
    wh, foot, label = warehouse()
    wh.save(os.path.join(AB, 'settlement/COOK4_WAREHOUSE_STRAIGHT_ROOF.png'))
    S = sheet(wh, foot, label)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_WAREHOUSE.png'))
    print('warehouse', wh.size, 'sheet', S.size, 'shed %d px, dock %d px' % (SHED_H, DOCK_H))
