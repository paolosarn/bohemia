#!/usr/bin/env python3
"""COOK FOUR [one at a time] + [the six buildings from the packs], round 8 (10/18, rule 101d: one asset a round):
THE GAS STATION, THE NEXT BUILDING OF THE STRAIGHT-ROOF FAMILY, IN THE VALLEY'S TANS.

Round 7's NEXT line: 'his word; then the gas station, one round'.  The gas station is the first of the six
building types on [the six buildings from the packs] (church, school, gas station, motel, warehouse, casino)
that this family has not drawn; the motel came in round 7.  One version (rule 95).

THE BUILDING: the Las Vegas service station of the Boulder Highway and Las Vegas Boulevard (1955-1970): a
free-standing canopy over the pump island at the street side, the sales office with its glass front, and two
service bays with roll-up doors, the bays a storey taller than the office because a car goes up on a lift.
At the body's 57 px a metre, the same man at the office door as at every ranch door.

EVERY ROOF IS THE MEASURED ONE, IN THE TANS: the office and the bays wear the straight roof read off his pack
house #30 (tools/bohemia_cook4_the_roof_measured.py, every run), in round 6's tan field, with the eave and lean
in metres from the 10 m ranch as the motel took them (an eave is a rafter, not a fraction of the front).  The
canopy is the family's flat shed roof (the carport, the porch, the motel's walk) in the grey-tan of his slate,
seen from above, 6 m deep, its front beam at 4.3 m so a box truck clears it.

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part
that exists once is laid once at 1:1.  His packs draw every prop in one 96 px box (COMBAT TWO's finding), so
only the props whose real size IS about 1.7 m are used at 1:1: the pumps are his green street cabinet (a
1960s pump stands 1.6 to 1.8 m), the sign is his KEEP OUT on its post.  No drum, no tyre, no car: at 1:1
they read as giants and at another scale they mix pixel sizes (rule 114).  Our paint is weather, wear and
light only: the shade under each eave and under the canopy, the dark in the open bay, the one-pixel outline,
the contact and cast shadow.  Analog horror, ONE wrong thing from the world's state: bay 2's roll-up stopped
0.7 m off the ground and nothing but dark under it; the rest is just a station nobody has fuelled at in years.
  roofs         the tan field COOK4_ROOF_TAN_FIELD (from his clay #26, eave #14); the canopy in
                COOK4_ROOF_GRAVEL_FIELD/EAVE (from his slate #27, #15)
  walls         Wall tiles (1) #7 (flat tan render) on the office, #0 (cracked tan plaster) on the bays,
                #5 (light stone) as the pump island's kerb
  doors         4. Doors and entrances #7 (the office); 11. Industrial doors and gates #1 cut to one roll-up
                per bay (the family's one_roller_door)
  windows       5. Windows and broken glass #0, #3 (the sales glass), #19 (barred, the till)
  posts         7. Fences and palisades #2, its left post cut out and laid up to height
  pumps         15. Street props #28 (his green utility cabinet), twice, on the island
  sign          17. Warning signs and road props #1 (KEEP OUT), at the island's end
  the yard      15. Street props #21 (one bin at the office)

REUSE CHECK: every surface is a pack tile already in reference/art_bank, the roof fields are round 6's tan
files, and the walls, doors, posts, roofs, roll-up and shadow come from the family's own functions and the
motel's straight roof (imported, not copied); the only new code is the canopy's depth and the station's layout.

Output: reference/art_bank/settlement/COOK4_GAS_STATION_STRAIGHT_ROOF.png and the sheet
records/target/COOK4_THE_GAS_STATION.png (rule 100: never slices/ or engine/).
Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/
COOK4_THE_VALLEY_TANS.json.  Light: from above (+9.3 top over bottom, the study page).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the character at 1:1 at the office door,
  the tan plain ranch of round 6 and the tan motel of round 7 beside it at the same scale, and the real thing:
  the 1960s Las Vegas service station (a canopy 4.3 to 4.9 m clear over one island of two or three pumps, a
  sales office of 4 to 6 m with a glass front, two lift bays of 3.5 to 4 m each with 3 m roll-up doors under a
  plate of 3.8 to 4.3 m).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the shadow.
  what changed: a third kind of building joins the family's roof, tans and ground: the first one with a
  free-standing roof and the first with a bay taller than a house.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import outline, _over, AB, ROOT
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_motel_straight_roof as motel
from bohemia_cook4_the_valley_tans import A_redirected as A
from bohemia_cook4_the_roof_measured import shade_top, one_roller_door, M, RATIO

fam.A = A; rm.A = A                                   # the family's code, the round-6 tan fields
WALL_H, ROOF_H = fam.WALL_H, fam.ROOF_H
EAVE_PX, straight_roof = motel.EAVE_PX, motel.straight_roof
CLAY = 'settlement/pack_5_roof_tiles_026.png'
OFFICE, BAY, NBAY = M(6.0), M(4.0), 2
BAY_H = M(4.0)                                        # a lift bay: the car goes up, so the plate is a storey higher
CAN_W, CAN_D, CAN_H = M(8.0), M(6.0), M(4.3)          # the canopy: 8 m over the island, 6 m deep, 4.3 m clear
CAN_TOP = int(CAN_D * 0.5)                            # its roof seen from above at 45 degrees (the family's walk)
PUMP = 'prop/pack_15_street_props_028.png'
SIGN = 'prop/pack_17_warning_signs_and_road_props_001.png'
BIN = 'prop/pack_15_street_props_021.png'
SHUTTER = 'door/pack_11_industrial_doors_and_gates_001.png'


def office():
    """the sales office: flat render, the glass front, the door, the barred till window"""
    w = fam.wall('flat', OFFICE)
    gx = M(0.4)
    for k in ('a', 'b'):
        g = A(fam.WIN[k]); w.alpha_composite(g, (gx, WALL_H - M(0.5) - g.height)); gx += g.width - 2
    dx = gx + M(0.3)
    fam.door_at(w, 'wood', dx)
    bar = A('settlement/pack_5_windows_and_broken_glass_019.png')
    w.alpha_composite(bar, (OFFICE - bar.width - M(0.3), M(0.75)))
    return outline(shade_top(w)), dx


def bays():
    """two lift bays: one roll-up each, cut from his shutter; bay 2's curtain stopped 0.7 m off the floor"""
    W = BAY * NBAY
    w = fam.wall('cracked', W, BAY_H)
    DW, DH = M(3.0), M(3.2)
    for k in range(NBAY):
        door = one_roller_door(A(SHUTTER), DW, DH)
        if k == 1:                                   # the one wrong thing: the dark under a door that stopped
            sh = Image.new('RGBA', door.size); sd = ImageDraw.Draw(sh)
            gap = M(0.7)
            sd.rectangle([18, DH - gap, DW - 19, DH - 1], fill=(6, 5, 4, 255))
            for i in range(10): sd.rectangle([18, DH - gap + i, DW - 19, DH - gap + i], fill=(30, 24, 18, 200 - i * 18))
            sd.line([(18, DH - gap - 1), (DW - 19, DH - gap - 1)], fill=(170, 160, 146, 255))
            door = _over(door, sh)
        w.alpha_composite(door, (k * BAY + (BAY - DW) // 2, BAY_H - DH))
        if k:
            sd = Image.new('RGBA', w.size); ImageDraw.Draw(sd).rectangle([k * BAY - 2, 0, k * BAY + 1, BAY_H], fill=(30, 20, 14, 90))
            w = _over(w, sd)
    return outline(shade_top(w))


def canopy():
    """the free-standing canopy: the family's flat shed roof seen from above, its front beam at 4.3 m on three
    of his posts, two back posts a canopy-depth up the ground, and the shade it throws on the island"""
    roof = fam.shed_roof(CAN_W, CAN_TOP, 'settlement/pack_5_roof_tiles_027.png', 'settlement/pack_5_roof_tiles_015.png')
    # his slate's notches are holes in a laid field; a canopy is a deck, so the holes show its dark underside
    px = [c for c in roof.getdata() if c[3] == 255]
    dark = tuple(int(sorted(c[i] for c in px)[len(px) // 6]) for i in range(3)) + (255,)
    deck = Image.new('RGBA', roof.size, dark); deck.alpha_composite(roof); roof = outline(deck)
    p = fam.post(CAN_H - 8)
    pb = fam.post(CAN_H - CAN_TOP - 8)
    dim = Image.new('RGBA', pb.size, (20, 14, 10, 110)); dim.putalpha(Image.eval(pb.getchannel('A'), lambda a: a * 110 // 255))
    pb = _over(pb, dim)                                     # the back posts stand in the canopy's shade
    shade = Image.new('RGBA', (CAN_W, CAN_TOP)); d = ImageDraw.Draw(shade)
    for i in range(CAN_TOP): d.rectangle([0, i, CAN_W, i], fill=(20, 14, 10, int(40 + 50 * (1 - i / CAN_TOP))))
    return roof, p, pb, shade


def island():
    """the pump island: a kerb of his light stone, two of his cabinets as the pumps, his KEEP OUT at the end"""
    pump = A(PUMP)
    IW, IH = M(5.2), M(0.25)
    kerb = outline(shade_top(fam.wall('stone', IW, IH), n=4, a=60))
    I = Image.new('RGBA', (IW, IH + pump.height))
    I.alpha_composite(kerb, (0, pump.height))
    for x in (M(1.0), M(3.2)): I.alpha_composite(pump, (x, 6))
    return I


def station():
    off, dx = office()
    bay = bays()
    roof, p, pb, shade = canopy()
    isl = island()
    r_off = straight_roof(OFFICE + 2 * EAVE_PX, ROOF_H, A(CLAY))
    r_bay = straight_roof(bay.width + 2 * EAVE_PX, ROOF_H, A(CLAY))
    base = ROOF_H + BAY_H                                          # one ground line for every part
    CX = 10                                                        # the canopy's left edge
    XO = CX + CAN_W + M(2.0)                                       # the office, 2 m of forecourt past the canopy
    XB = XO + OFFICE                                               # the bays share the office's side wall
    parts = [
        # the canopy, back to front: its shade on the forecourt, the back posts, the island, the front posts, the roof
        (shade, CX, base - CAN_TOP, (CX, CX + CAN_W, base)),
        (pb, CX + 4, base - CAN_TOP - pb.height, None),
        (pb, CX + CAN_W - pb.width - 4, base - CAN_TOP - pb.height, None),
        (isl, CX + (CAN_W - isl.width) // 2, base - CAN_TOP // 2 - isl.height, None),
        (A(SIGN), CX + (CAN_W + isl.width) // 2 + M(0.3), base - CAN_TOP // 3 - A(SIGN).height, None),
    ]
    for x in (CX, CX + (CAN_W - p.width) // 2, CX + CAN_W - p.width):
        parts.append((p, x, base - p.height, None))
    parts += [(roof, CX, base - CAN_H - CAN_TOP + 8, None),
              (bay, XB, base - BAY_H, (XB, XB + bay.width, base)),
              (r_bay, XB - EAVE_PX, base - BAY_H - ROOF_H + 26, None),
              (A(BIN), XO - M(1.2), base - A(BIN).height + 6, None),
              (off, XO, base - WALL_H, (XO, XO + OFFICE, base)),
              (r_off, XO - EAVE_PX, base - WALL_H - ROOF_H + 26, None)]
    shift = -min(y for im, x, y, fp in parts)
    parts = [(im, x, y + shift, (fp[0], fp[1], fp[2] + shift) if fp else None) for im, x, y, fp in parts]
    assert A(fam.DOOR['wood']).height >= 96 and M(2.1) >= 100, 'the door must be taller than the person'
    assert BAY_H > WALL_H and M(3.2) < BAY_H, 'a lift bay is taller than the office and its door fits under its plate'
    assert CAN_H - 8 > M(4.0), 'the canopy clears a box truck'
    assert A(PUMP).height == 96, 'a pump is his 96 px cabinet at 1:1, about 1.7 m'
    assert ROOF_H == int(WALL_H * RATIO), 'the roof takes the measured ratio against one storey'
    label = ('THE GAS STATION  %.0f m: the canopy on five posts (a 6 m deck) over two pumps, the sales office, two lift bays, '
             'the measured tan roofs; bay 2 stopped 0.7 m off the floor' % ((XB + bay.width - CX) / (100 / 1.75)))
    return fam.grounded(parts), (XO + dx, base + shift), label


def sheet(st, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    ranch = A('settlement/COOK4_RANCH_TAN_PLAIN.png')
    mot = A('settlement/COOK4_MOTEL_STRAIGHT_ROOF.png')
    GAP = 44
    W = max(st.width, ranch.width + GAP + mot.width) + 2 * GAP
    H = 230 + st.height + 60 + max(ranch.height, mot.height) + 70
    S = Image.new('RGBA', (W, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE GAS STATION, the next building of the straight-roof family, in the valley\'s tans: canopy, office and two bays at the body\'s size (57 px a metre), every roof shaped by the numbers read off your pack house #30 (roof %.2fx one storey).' % RATIO, fill=(230, 220, 200))
    d.text((16, 28), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: from above.  A placeholder until your moodboard.', fill=(200, 190, 170))
    d.text((16, 44), 'Top left: your pack house and the 1.75 m man at 1:1.  Below the station: the tan ranch and the tan motel beside it at the same scale, the street it would stand on.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 70 + 96 - 107))
    y = 200
    S.alpha_composite(st, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + A(fam.DOOR['wood']).width + 24 - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + st.height + 8), '1  ' + label, fill=(230, 220, 200))
    y += st.height + 60
    rh = max(ranch.height, mot.height)
    S.alpha_composite(ranch, (GAP, y + rh - ranch.height))
    d.text((GAP + 6, y + rh + 8), 'the tan plain ranch of round 6', fill=(200, 190, 170))
    S.alpha_composite(mot, (GAP * 2 + ranch.width, y + rh - mot.height))
    d.text((GAP * 2 + ranch.width + 6, y + rh + 8), 'the tan motel of round 7', fill=(200, 190, 170))
    return S


if __name__ == '__main__':
    st, foot, label = station()
    st.save(os.path.join(AB, 'settlement/COOK4_GAS_STATION_STRAIGHT_ROOF.png'))
    S = sheet(st, foot, label)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_GAS_STATION.png'))
    print('station', st.size, 'sheet', S.size, 'canopy top %d px, bay plate %d px' % (CAN_TOP, BAY_H))
