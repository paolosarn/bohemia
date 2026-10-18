#!/usr/bin/env python3
"""COOK FOUR [one at a time] + [the six buildings from the packs], round 10 (10/18, rule 101d: one asset a round):
THE SCHOOL, THE NEXT BUILDING OF THE STRAIGHT-ROOF FAMILY, IN THE VALLEY'S TANS.

Round 9's NEXT line: 'his word; then the school, one round'.  His word came in the fourteenth votes: UP on the
warehouse, the gas station and the motel, and on the family in the tans, 'That's way better holy shit'.  Of the
six building types on [the six buildings from the packs] (church, school, gas station, motel, warehouse,
casino) the family has drawn the motel, the gas station and the warehouse; the school is the fourth.  One
version (rule 95).

THE BUILDING: the Clark County elementary school of the 1955-1970 boom (the single-storey 'finger plan' the
district built across the valley): a long classroom wing, each classroom about 9 m of front with a ribbon of
windows and its own door straight to the outside, a covered walk on posts along the doors (the desert school's
signature: no inside hallway, the walk is the hallway), and the taller multipurpose room on the end, the gym and
the lunch room in one, with its double doors and small high windows.  At the body's 57 px a metre, the same man
at the double doors as at every ranch door.

EVERY ROOF IS THE MEASURED ONE, IN THE TANS: the wing and the multipurpose room wear the straight roof read off
his pack house #30 (tools/bohemia_cook4_the_roof_measured.py, every run), in round 6's tan field, with the eave
and lean in metres from the 10 m ranch as the motel took them; the covered walk is the motel's flat walk roof in
his grey-tan slate.  The roof is measured against one storey, as on the warehouse.

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part
that exists once is laid once at 1:1; a classroom exists three times, so its windows and door are laid three
times, varied as a closed school's are.  The classroom glass is his wire-mesh window (5. #16), the safety glass
real schools of the era used; the multipurpose doors are two of his steel doors (4. #9) side by side.  No swing,
no flagpole, no bus: the packs hold none, and every pack prop is a 96 px box (rule 114).  Our paint is weather,
wear and light only: the shade under each eave and under the walk, the seams, the one-pixel outline, the contact
and cast shadow, and one light.  Analog horror, ONE wrong thing from the world's state: every classroom is
broken or boarded, but room 3's wire glass is whole and lit the cold grey-blue of a television left on.
  roofs         the tan field COOK4_ROOF_TAN_FIELD (from his clay #26); the walk in COOK4_ROOF_GRAVEL_* (#27, #15)
  walls         Wall tiles (1) #7 (flat tan render) on the wing, #5 (light stone panels) on the multipurpose room
  doors         4. Doors and entrances #7, #2 (boarded), #9 twice (the double doors)
  windows       5. Windows and broken glass #16 (wire glass), #11, #12 (broken), #6, #18 (boarded), #0, #3 high
  posts         7. Fences and palisades #2, the family's post
  fence         13. Fences and wire #0, #6 (KEEP OUT), the family's fence
  the yard      15. Street props #21 (one bin at the doors)

REUSE CHECK: every surface is a pack tile already in reference/art_bank, the roof fields are round 6's tan
files, and the walls, doors, posts, roofs, walk, fence and shadow come from the family's functions, the motel's
straight roof and walk and the warehouse's lit-glass routine (imported, not copied); the only new code is the
cold tint and the layout.

Output: reference/art_bank/settlement/COOK4_SCHOOL_STRAIGHT_ROOF.png and the sheet
records/target/COOK4_THE_SCHOOL.png (rule 100: never slices/ or engine/).
Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/
COOK4_THE_VALLEY_TANS.json.  Light: from above (+9.3 top over bottom, the study page).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the character at 1:1 at the double doors,
  the tan plain ranch of round 6 and the motel of round 7 beside it at the same scale, and the real thing: the
  1955-1970 Clark County finger-plan elementary school (classrooms 8.5 to 9.5 m of front, 3.0 to 3.4 m plates,
  window ribbons, a door per classroom off a covered walk on steel or timber posts, the multipurpose room 4.5 to
  6 m to the plate on the end).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the shadow.
  what changed: a fifth kind of building joins the family's roof, tans and ground: the first one people other
  than a family were meant to gather in.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import outline, _over, AB, ROOT
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_motel_straight_roof as motel
from bohemia_cook4_the_valley_tans import A_redirected as A
from bohemia_cook4_the_roof_measured import shade_top, M, RATIO

fam.A = A; rm.A = A                                   # the family's code, the round-6 tan fields
WALL_H, ROOF_H = fam.WALL_H, fam.ROOF_H
EAVE_PX, straight_roof, walk_roof = motel.EAVE_PX, motel.straight_roof, motel.walk_roof
CLAY = 'settlement/pack_5_roof_tiles_026.png'
W = lambda n: 'settlement/pack_5_windows_and_broken_glass_%03d.png' % n
STEEL = 'door/pack_4_doors_and_entrances_009.png'
BIN = 'prop/pack_15_street_props_021.png'
ROOMS, ROOM = 3, M(9.0)                               # three classrooms of 9 m
ROOM_H = M(3.3)                                       # a classroom's plate, a touch over a house's
MPR, MPR_H = M(11.0), M(5.2)                          # the multipurpose room on the end
PH = M(2.5)                                           # the walk's beam clears the 2.1 m doors
# each classroom: a door at the left, a ribbon of four windows touching; room 3 is the lit one
RIBBONS = [[11, 6, 12, 18], [6, 18, 6, 6], ['lit', 'lit', 'lit', 'lit']]
DOORS = ['boarded', 'boarded', 'wood']


def cold(win):
    """the one wrong thing: the wire glass whole, its dark panes lit the grey-blue of a set left on; the mesh,
    the frame and the sill left as his"""
    out = win.copy(); px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            l = 0.299 * r + 0.587 * g + 0.114 * b
            if a > 200 and l < 60 and 9 < x < out.width - 9 and 10 < y < out.height - 14:
                k = 1 - l / 60
                px[x, y] = (int(r + (126 - r) * k), int(g + (150 - g) * k), int(b + (170 - b) * k), a)
    return out


def wing():
    """three classrooms: a door and a ribbon of four windows each, the party walls as seams in shade"""
    w = fam.wall('flat', ROOM * ROOMS, ROOM_H)
    foot = []
    for k in range(ROOMS):
        x0 = k * ROOM
        dx = x0 + M(0.6)
        door = A(fam.DOOR[DOORS[k]]); glass = A(fam.WIN['b'])
        w.alpha_composite(glass.crop((8, 30, 8 + door.width, 30 + M(2.1) - door.height)), (dx, ROOM_H - M(2.1)))
        w.alpha_composite(door, (dx, ROOM_H - door.height))
        foot.append(dx)
        x = dx + door.width + M(1.0)
        for key in RIBBONS[k]:                                # a ribbon: his windows laid frame to frame
            win = cold(A(W(16))) if key == 'lit' else A(W(key))
            w.alpha_composite(win, (x, M(0.85)))
            x += win.width - 4
        if k:
            sd = Image.new('RGBA', w.size); ImageDraw.Draw(sd).rectangle([x0 - 2, 0, x0 + 1, ROOM_H], fill=(30, 20, 14, 90))
            w = _over(w, sd)
    return outline(shade_top(w)), foot


def mpr():
    """the multipurpose room: his stone panels to 5.2 m, small high windows, the steel double doors"""
    w = fam.wall('stone', MPR, MPR_H)
    for k, n in enumerate([0, 6, 3, 0]):
        win = A(W(n)).crop((0, 0, 96 if A(W(n)).width >= 96 else A(W(n)).width, 60))
        w.alpha_composite(win, (M(0.8) + k * (MPR - M(1.6) - win.width) // 3, M(0.5)))
    s = A(STEEL)
    dx = MPR - 2 * s.width - M(1.2)
    glass = A(fam.WIN['b'])
    for i in range(2):
        w.alpha_composite(glass.crop((8, 30, 8 + s.width, 30 + M(2.3) - s.height)), (dx + i * s.width, MPR_H - M(2.3)))
        w.alpha_composite(s, (dx + i * s.width, MPR_H - s.height))
    return outline(shade_top(w)), dx


def school():
    wg, foot = wing()
    mp, dx = mpr()
    WW = wg.width
    r_wing = straight_roof(WW + 2 * EAVE_PX, ROOF_H, A(CLAY))
    r_mpr = straight_roof(MPR + 2 * EAVE_PX, ROOF_H, A(CLAY))
    base = ROOF_H + MPR_H
    XW = 10 + EAVE_PX                                              # the wing first, the gym at the far end
    XM = XW + WW                                                   # the gym shares the wing's end wall
    XF = XM + MPR + M(0.8)
    wr = walk_roof(WW + M(0.4))
    p = fam.post(PH - 8)
    under = Image.new('RGBA', (WW, PH)); ud = ImageDraw.Draw(under)
    for i in range(PH // 2): ud.rectangle([0, i, WW, i], fill=(20, 14, 10, int(120 * (1 - i / (PH / 2)))))
    fen = fam.fence(3, sign=True)
    parts = [(r_mpr, XM - EAVE_PX, base - MPR_H - ROOF_H + 26, None),
             (mp, XM, base - MPR_H, (XM, XM + MPR, base)),
             (wg, XW, base - ROOM_H, (XW, XW + WW, base)),
             (r_wing, XW - EAVE_PX, base - ROOM_H - ROOF_H + 26, None),
             (under, XW, base - PH, None)]
    for k in range(ROOMS * 2 + 1):                                 # a post every half classroom
        px = XW + min(k * ROOM // 2, WW - p.width) - (p.width // 2 if 0 < k < ROOMS * 2 else 0)
        parts.append((p, px, base - p.height, None))
    parts += [(wr, XW - M(0.2), base - PH - wr.height + 8, None),
              (A(BIN), XM + dx - M(1.4), base - A(BIN).height + 6, None),
              (fen, XF, base - fen.height, None)]
    shift = -min(y for im, x, y, fp in parts)
    parts = [(im, x, y + shift, (fp[0], fp[1], fp[2] + shift) if fp else None) for im, x, y, fp in parts]
    assert A(fam.DOOR['wood']).height >= 96 and M(2.1) >= 100, 'the door must be taller than the person'
    assert MPR_H - M(2.3) >= M(2.0), 'the high windows sit clear over the double doors'
    assert ROOF_H == int(WALL_H * RATIO), 'the roof takes the measured ratio against one storey'
    assert PH > M(2.1) and PH < ROOM_H, 'the walk clears the doors and sits under the eave'
    label = ('THE SCHOOL  %.0f m: three classrooms off a covered walk on seven posts, the multipurpose room on the '
             'end, the measured tan roofs; room 3\'s glass whole and lit like a television left on'
             % ((XM + MPR - XW) / (100 / 1.75)))
    return fam.grounded(parts), (XM + dx, base + shift), label


def sheet(sc, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    ranch = A('settlement/COOK4_RANCH_TAN_PLAIN.png')
    mot = A('settlement/COOK4_MOTEL_STRAIGHT_ROOF.png')
    GAP = 44
    Wd = max(sc.width, ranch.width + GAP + mot.width) + 2 * GAP
    H = 230 + sc.height + 60 + max(ranch.height, mot.height) + 70
    S = Image.new('RGBA', (Wd, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE SCHOOL, the next building of the straight-roof family, in the valley\'s tans: three classrooms and the multipurpose room at the body\'s size (57 px a metre), every roof shaped by the numbers read off your pack house #30 (roof %.2fx one storey).' % RATIO, fill=(230, 220, 200))
    d.text((16, 28), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: from above.  A placeholder until your moodboard.', fill=(200, 190, 170))
    d.text((16, 44), 'Top left: your pack house and the 1.75 m man at 1:1.  Below the school: the tan ranch and the motel beside it at the same scale.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 70 + 96 - 107))
    y = 200
    S.alpha_composite(sc, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + A(STEEL).width - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + sc.height + 8), '1  ' + label, fill=(230, 220, 200))
    y += sc.height + 60
    rh = max(ranch.height, mot.height)
    S.alpha_composite(ranch, (GAP, y + rh - ranch.height))
    d.text((GAP + 6, y + rh + 8), 'the tan plain ranch of round 6', fill=(200, 190, 170))
    S.alpha_composite(mot, (GAP * 2 + ranch.width, y + rh - mot.height))
    d.text((GAP * 2 + ranch.width + 6, y + rh + 8), 'the motel of round 7', fill=(200, 190, 170))
    return S


if __name__ == '__main__':
    sc, foot, label = school()
    sc.save(os.path.join(AB, 'settlement/COOK4_SCHOOL_STRAIGHT_ROOF.png'))
    S = sheet(sc, foot, label)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_SCHOOL.png'))
    print('school', sc.size, 'sheet', S.size, 'wing %d px, gym %d px' % (ROOM_H, MPR_H))
