#!/usr/bin/env python3
"""COOK FOUR [one at a time] + [a house a man can live in], round 7 (10/18, rule 101d: one asset a round):
THE MOTEL, THE NEXT BUILDING OF THE STRAIGHT-ROOF FAMILY, IN THE VALLEY'S TANS.

The coordinator (10/16, AL): 'the corner shop and the motel wait their turn, one per round'.  The corner shop
came in round 5; the family took his tans in round 6 ('color these roofs to make it more tan, they're looking
bright medieval orange and metal blue').  The motel is next.  The flat-roof motel of 10/11 (cook4-the-motel-10-11)
has the two faults the old corner shop had: a ROOF PLAN the pack never draws (a slab of cracked concrete seen from
straight above) and no shadow (DIRECTION 10/10: 'the houses float').  A placeholder is never edited (rule 101c),
so this is a NEW asset on the family's code, and the flat one is superseded (rule 92).  Motel versions: two
(rule 95: two is the last; a third only on his word).

THE BUILDING: the one-storey Las Vegas motor court of Fremont East and the Boulder Highway (1950-1965): an office
at the street end, a touch taller, under its own roof; six rooms in a row at 3.6 m each under one long roof; a
covered walk on posts along the room doors (the motor court's one signature, the place you stand at your door);
rooftop boxes for the coolers.  At the body's 57 px a metre, the same man at room 3 as at every ranch door.

EVERY ROOF IS THE MEASURED ONE, IN THE TANS: the ratios tools/bohemia_cook4_the_roof_measured.py reads off his
pack house #30 on every run (roof/wall about 1.49, an eave and a lean), with the roof fields redirected to the
valley tans of round 6 (tools/bohemia_cook4_the_valley_tans.py): the tile roofs in the desert tan of his render
wall, the walk's flat roof in the grey-tan of his flagstones.  ONE CHANGE, WRITTEN DOWN: the eave and the lean
were measured as fractions of the ranch's width, which is right on a 10 m house and wrong on a 26 m motel (a 14
percent eave on 21.6 m is 3 m of overhang; a 6 percent lean is a roof end leaning 1.3 m).  An eave is a rafter's
length, not a proportion of the street front, so this sheet takes the ranch's eave and lean IN METRES (the plain
ranch's 10 m front times the measured fractions) and lays them on every roof here.  The roof's depth is the
building's depth, and a motel room is as deep as a ranch, so the roof is as tall as the ranch's.

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part
that exists once is laid once at 1:1; a room exists six times, so its door and window are laid six times, the
doors varied as a real court's are after years of repairs.  Our paint is weather, wear and light only: the
shade under each eave, the dark band under the walk's roof, the one-pixel outline, the contact shadow and the
soft cast shadow.  Analog horror, ONE wrong thing from the world's state: room 4 is the marked door, its window
boarded; the other five are just tired.
  roofs         the tan field COOK4_ROOF_TAN_FIELD (from his clay #26) and eave (#14); the walk's flat roof in
                COOK4_ROOF_GRAVEL_FIELD/EAVE (from his slate #27, #15)
  walls         Wall tiles (1) #0 (cracked tan plaster) on the rooms, #7 (flat tan render) on the office
  doors         4. Doors and entrances #2, #7 (the rooms), #8 (room 4, marked), #7 (the office)
  windows       5. Windows and broken glass #0, #3 (glass), #6 (boarded, room 4), #19 (barred, the office)
  posts         7. Fences and palisades #2, its left post cut out and laid up to height
  coolers       15. Street props #29 (his grey utility box, laid on the roof as the swamp coolers), twice
  the yard      15. Street props #21 (one bin at the last room)

REUSE CHECK: every surface is a pack tile already in reference/art_bank, the roof fields are round 6's tan
files, and the walls, doors, posts, roofs and shadow come from the family's own functions (imported, not
copied); the only new code is the straight roof's lean in pixels and the motel's layout.

Output: reference/art_bank/settlement/COOK4_MOTEL_STRAIGHT_ROOF.png and the sheet
records/target/COOK4_THE_MOTEL_STRAIGHT_ROOF.png (rule 100: never slices/ or engine/).
Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/
COOK4_THE_VALLEY_TANS.json.  Light: from above (+9.3 top over bottom, the study page).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the character at 1:1 at room 3, the tan
  plain ranch of round 6 beside it at the same scale, the flat-roof motel it replaces at 1:1, and the real
  thing: the Las Vegas one-storey motor court (3.4 to 3.8 m rooms, 2.7 to 3 m plates, a covered walk on steel or
  timber posts at every party wall, the office at the street end, evaporative coolers on the roof).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the shadow.
  what changed: the motel joins the family's roof, tans and ground instead of the roof plan the pack never draws.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import outline, _over, AB, ROOT
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
from bohemia_cook4_the_valley_tans import A_redirected as A
from bohemia_cook4_the_roof_measured import lay, shade_top, M, RATIO, EAVE, LEAN

fam.A = A; rm.A = A                                   # the family's code, the round-6 tan fields
WALL_H, ROOF_H = fam.WALL_H, fam.ROOF_H
EAVE_PX = int(M(10.0) * EAVE)                         # the ranch's eave in metres, not a fraction of this front
LEAN_PX = int(M(10.0) * (1 + 2 * EAVE) * LEAN)        # the ranch's lean in pixels: the same roof depth, the same lean
ROOM, N, OFFICE = M(3.6), 6, M(5.0)
OFFICE_H = M(3.4)
COOLER = 'prop/pack_15_street_props_029.png'
BIN = 'prop/pack_15_street_props_021.png'


def straight_roof(w, h, field):
    """the family's straight roof (rm.straight_roof) with the lean in pixels instead of a fraction of the width"""
    full = rm.roof(w, h, field, LEAN_PX)
    back = int(h * .14)
    sh = Image.new('RGBA', (w, h)); d = ImageDraw.Draw(sh)
    d.rectangle([0, 0, w, back], fill=(18, 12, 8, 120))                    # the back slope, turned from the light
    d.line([(0, back), (w, back)], fill=(255, 236, 200, 200), width=3)     # the ridge
    d.line([(0, back + 3), (w, back + 3)], fill=(30, 20, 14, 140), width=2)
    for i in range(10): d.rectangle([0, h - 40 + i, w, h - 40 + i], fill=(20, 14, 10, 6 * i))
    return outline(_over(full, sh))


def room_wing():
    """six rooms: a door and a window each, the party walls as seams in shade; returns the wall and room 3's door x"""
    W = ROOM * N
    w = fam.wall('cracked', W)
    doors = ['wood', 'boarded', 'wood', 'marked', 'boarded', 'wood']
    wins = ['b', 'a', 'a', 'boarded', 'b', 'a']
    foot = None
    for k in range(N):
        x0 = k * ROOM
        dx = x0 + M(0.45)
        fam.door_at(w, doors[k], dx)
        win = A(fam.WIN[wins[k]])
        w.alpha_composite(win, (x0 + ROOM - win.width - M(0.45), M(0.75)))
        if k == 2: foot = dx
        if k:
            sd = Image.new('RGBA', w.size); ImageDraw.Draw(sd).rectangle([x0 - 2, 0, x0 + 1, WALL_H], fill=(30, 20, 14, 90))
            w = _over(w, sd)
    return outline(shade_top(w)), foot


def office():
    """the office: flat render, a touch taller, one door, one barred window (the till), its own roof"""
    w = fam.wall('flat', OFFICE, OFFICE_H)
    door = A(fam.DOOR['wood']); glass = A(fam.WIN['b'])
    dx = OFFICE - door.width - M(0.6)
    w.alpha_composite(glass.crop((8, 30, 8 + door.width, 30 + M(2.1) - door.height)), (dx, OFFICE_H - M(2.1)))
    w.alpha_composite(door, (dx, OFFICE_H - door.height))
    bar = A('settlement/pack_5_windows_and_broken_glass_019.png')
    w.alpha_composite(bar, (M(0.6), OFFICE_H - M(0.9) - bar.height))
    return outline(shade_top(w))


def walk_roof(w):
    """the covered walk's flat roof seen from above, in the gravel tan: the family's shed roof"""
    return fam.shed_roof(w, int(M(2.4) * 0.5), 'settlement/pack_5_roof_tiles_027.png', 'settlement/pack_5_roof_tiles_015.png')


def motel():
    wing, foot = room_wing()
    off = office()
    WW = wing.width
    r_wing = straight_roof(WW + 2 * EAVE_PX, ROOF_H, A('settlement/pack_5_roof_tiles_026.png'))
    r_off = straight_roof(OFFICE + 2 * EAVE_PX, ROOF_H, A('settlement/pack_5_roof_tiles_026.png'))
    lift = OFFICE_H - WALL_H                                       # the office stands 0.4 m taller
    X0 = EAVE_PX + 4                                               # the office wall's left edge
    top_o = ROOF_H - 26; base = top_o + OFFICE_H
    XW = X0 + OFFICE                                               # the wing shares the office's side wall
    top_w = base - WALL_H
    # the covered walk: a flat roof over the door line, a post at every party wall, the shade under it
    PH = M(2.4)                                                    # the walk's beam clears the 2.1 m doors
    wr = walk_roof(WW + M(0.4))
    p = fam.post(PH - 8)
    under = Image.new('RGBA', (WW, PH)); ud = ImageDraw.Draw(under)
    for i in range(PH // 2): ud.rectangle([0, i, WW, i], fill=(20, 14, 10, int(120 * (1 - i / (PH / 2)))))
    parts = [(wing, XW, top_w, (XW, XW + WW, base)),
             (r_wing, XW - EAVE_PX, top_w - ROOF_H + 26, None)]
    cool = A(COOLER)
    for cx in (XW + M(5.0), XW + M(15.8)):
        parts.append((cool, cx, top_w - ROOF_H + 26 + int(ROOF_H * .22), None))
    parts += [(under, XW, base - PH, None)]
    for k in range(N + 1):
        px = XW + min(k * ROOM, WW - p.width) - (p.width // 2 if 0 < k < N else 0)
        parts.append((p, px, base - p.height, None))
    parts += [(wr, XW - M(0.2), base - PH - wr.height + 8, None),
              (A(BIN), XW + WW - M(1.6), base - A(BIN).height + 6, None),
              (off, X0, top_o, (X0, X0 + OFFICE, base)),
              (r_off, X0 - EAVE_PX, top_o - ROOF_H + 26, None)]
    shift = -min(y for im, x, y, fp in parts)
    parts = [(im, x, y + shift, (fp[0], fp[1], fp[2] + shift) if fp else None) for im, x, y, fp in parts]
    assert A(fam.DOOR['wood']).height >= 96 and M(2.1) >= 100, 'the door must be taller than the person'
    assert WALL_H >= 170 and OFFICE_H > WALL_H, 'a room is 1.7 people tall; the office stands taller'
    assert ROOF_H == int(WALL_H * RATIO), 'the roof takes the measured ratio against one storey'
    assert EAVE_PX < M(1.6), 'an eave is a rafter, not a proportion of a 26 m front'
    label = 'THE MOTEL  the office and six rooms, %.1f m, the measured tan roofs, a covered walk on seven posts, room 4 marked' % ((OFFICE + WW) / (100 / 1.75))
    return fam.grounded(parts), (XW + foot, base + shift), label


def sheet(mot, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    ranch = A('settlement/COOK4_RANCH_TAN_PLAIN.png')
    old = A('settlement/COOK4_THE_MOTEL.png')
    GAP = 44
    W = max(mot.width, ranch.width + GAP + old.width) + 2 * GAP
    H = 230 + mot.height + 60 + max(ranch.height, old.height) + 70
    S = Image.new('RGBA', (W, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE MOTEL, the next building of the straight-roof family, in the valley\'s tans: the office and six rooms at the body\'s size (57 px a metre), every roof shaped by the numbers read off your pack house #30 (roof %.2fx one storey), the eave and lean taken in metres from the ranch.' % RATIO, fill=(230, 220, 200))
    d.text((16, 28), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: from above.  A placeholder until your moodboard.', fill=(200, 190, 170))
    d.text((16, 44), 'Top left: your pack house and the 1.75 m man at 1:1.  Below the motel: the tan ranch beside it at the same scale, and the flat-roof motel it replaces.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 70 + 96 - 107))
    y = 200
    S.alpha_composite(mot, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + A(fam.DOOR['wood']).width + 30 - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + mot.height + 8), '1  ' + label, fill=(230, 220, 200))
    y += mot.height + 60
    rh = max(ranch.height, old.height)
    S.alpha_composite(ranch, (GAP, y + rh - ranch.height))
    d.text((GAP + 6, y + rh + 8), 'the tan plain ranch of round 6, its neighbour at the same scale', fill=(200, 190, 170))
    S.alpha_composite(old, (GAP * 2 + ranch.width, y + rh - old.height))
    d.text((GAP * 2 + ranch.width + 6, y + rh + 8), 'the flat-roof motel of 10/11 it replaces: a roof plan the pack never draws, no shadow', fill=(200, 190, 170))
    return S


if __name__ == '__main__':
    mot, foot, label = motel()
    mot.save(os.path.join(AB, 'settlement/COOK4_MOTEL_STRAIGHT_ROOF.png'))
    S = sheet(mot, foot, label)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_MOTEL_STRAIGHT_ROOF.png'))
    print('motel', mot.size, 'sheet', S.size, 'eave %d px lean %d px roof %d px' % (EAVE_PX, LEAN_PX, ROOF_H))
