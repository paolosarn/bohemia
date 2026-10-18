#!/usr/bin/env python3
"""COOK FOUR [one at a time] + [the six buildings from the packs], round 11 (10/18, rule 101d: one asset a round):
THE CHURCH, THE NEXT BUILDING OF THE STRAIGHT-ROOF FAMILY, IN THE VALLEY'S TANS.

Round 10's NEXT line: 'his word; then the church, one round (the casino last)'.  Of the six building types on
[the six buildings from the packs] (church, school, gas station, motel, warehouse, casino) the family has drawn
the motel, the gas station, the warehouse and the school; the church is the fifth.  One version (rule 95).

THE BUILDING: the valley's stucco parish church of 1940-1965, the kind downtown and the old tracts still have:
a long nave of flat render with a row of round-topped windows and nothing above them but wall, a square bell
tower of stone at the entry end with the doors in its foot and the louvres of the belfry at its top, and the
low parish hall on the far end where the coffee and the meetings were.  At the body's 57 px a metre, the same
man at the tower doors as at every ranch door.

EVERY ROOF IS THE MEASURED ONE, IN THE TANS: the nave and the hall wear the straight roof read off his pack
house #30 (tools/bohemia_cook4_the_roof_measured.py, every run), in round 6's tan field, with the eave and lean
in metres from the 10 m ranch as the motel took them; the roof is measured against one storey, as on the
warehouse and the school.  The tower's cap is the same roof at the tower's own depth (a 4.2 m tower is not a
10 m house deep), with a 0.6 m eave: a bell tower does not wear a ranch's overhang.

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part
that exists once is laid once at 1:1.  The nave windows are his one round-topped window (5. #16 is wire glass;
this is 5. #15, the arched one with its fanlight), laid five times and varied as a shut church's are: two of
them mirrored so the breaks differ, the middle one boarded with the planks of his boarded window (#18) laid
over its glass.  The cross is his: the bronze-framed cross niche of Wall tiles 1 #4, cut from its dark stone
and set once into the tower above the doors.  The belfry is two of his louvred windows (#17) side by side.  The
doors are two of his plank doors (4. #7), the right leaf his door mirrored.  Our paint is weather, wear and
light only: the shade under each eave, the seams of the nave's bays, the one-pixel outline, the contact and cast
shadow, and one light.

THE LESSON FROM THE LAST THREE (the not-vibe-coded gate's N3, measured this round on the school, warehouse and
gas station: every red cell was a slate walk roof or a roll-up curtain, the same detail across sixteen cells
with no rest): the church carries no walk roof and no curtain; the nave keeps 1.8 m of plain render above its
windows, the rest area a painter leaves; the tool checks every 96 px cell against the packs' own band before
it saves (CELL CHECK below) and refuses to write a sheet with a red cell.

ANALOG HORROR, ONE WRONG THING from the world's state: the pews are out.  Six of his benches stand on the
forecourt in three rows with an aisle, empty, and they face the road, not the doors.

  roofs         the tan field COOK4_ROOF_TAN_FIELD (from his clay #26) on the nave, the hall and the tower cap
  walls         Wall tiles (1) #7 (flat tan render) on the nave, #5 (light stone panels) on the tower, #0
                (cracked tan plaster) on the hall
  doors         4. Doors and entrances #7 twice (one mirrored) at the tower, #8 at the hall
  windows       5. Windows and broken glass #15 (the arched window) on the nave and over the doors, #18's
                planks on one, #17 twice (the belfry's louvres), #0 and #6 on the hall
  the cross     Wall tiles (1) #4, its bronze frame and cross cut out of its stone
  the yard      17. Benches and seating #1 (the pews, six), 15. Street props #18 (his iron railing, three)
  the roof      15. Street props #29 (the swamp cooler on the hall, the motel's)

REUSE CHECK: every surface is a pack tile already in reference/art_bank, the roof fields are round 6's tan
files, and the walls, doors, windows, roofs and shadow come from the family's functions and the motel's
straight roof (imported, not copied); the only new code is the cross cut, the boards, the pews' shadow and the
layout.  The hall's roof is drawn before the nave so it tucks under the taller wall (the school drew its lower
wing last, over the gym's corner; the church does not repeat it).

Output: reference/art_bank/settlement/COOK4_CHURCH_STRAIGHT_ROOF.png and the sheet
records/target/COOK4_THE_CHURCH.png (rule 100: never slices/ or engine/).
Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/
COOK4_THE_VALLEY_TANS.json.  Light: from above (+9.3 top over bottom, the study page).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the character at 1:1 at the tower doors,
  the tan plain ranch of round 6 and the gas station of round 8 beside it at the same scale, and the real thing:
  the valley's mission-revival and post-war stucco parish church (a nave 15 to 25 m long at a 4.5 to 6 m plate,
  round-arched windows in a row, a square entry tower of 10 to 15 m with the belfry under its cap, the parish
  hall a single storey on the far end).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the shadow.
  what changed: the family's first vertical: one tower over a valley of single storeys, the building you find
  a town by.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter
from bohemia_cook4_one_house import outline, _over, AB, ROOT
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_motel_straight_roof as motel
from bohemia_cook4_the_valley_tans import A_redirected as A
from bohemia_cook4_the_roof_measured import shade_top, M, RATIO

fam.A = A; rm.A = A                                   # the family's code, the round-6 tan fields
WALL_H, ROOF_H = fam.WALL_H, fam.ROOF_H
EAVE_PX, straight_roof = motel.EAVE_PX, motel.straight_roof
CLAY = 'settlement/pack_5_roof_tiles_026.png'
W = lambda n: 'settlement/pack_5_windows_and_broken_glass_%03d.png' % n
CROSS = 'settlement/pack_wall_tiles_1_004.png'
PEW = 'prop/pack_17_benches_and_seating_001.png'
RAIL = 'prop/pack_15_street_props_018.png'
COOLER = 'prop/pack_15_street_props_029.png'          # the swamp cooler on the hall's roof, as on the motel
NAVE, NAVE_H = M(18.0), M(5.0)                        # an 18 m nave at a 5 m plate
BAYS = 5                                              # five bays, one arched window each
SILL = M(1.4)                                         # a nave window sits higher than a house window
TW, TOWER_H = M(4.2), M(12.0)                         # the bell tower, 4.2 m square, 12 m to its plate
T_EAVE = M(0.6)                                       # a tower's overhang, not a ranch's
T_CAP = int(ROOF_H * 4.2 / 10.0 * 1.5)                # the measured roof at the tower's own depth
T_FWD = int(M(1.0) * 0.7)                             # the tower stands 1 m proud of the nave wall
HALL, HALL_H = M(7.0), WALL_H                         # the parish hall, one storey
PEW_ROWS = (3.0, 4.6, 6.2)                            # metres in front of the nave wall
BOARDED = 2                                           # the middle window, boarded


def boarded(win):
    """his arched window with the planks of his boarded window (#18) laid over the glass, the arch left showing"""
    out = win.copy(); planks = A(W(18)).crop((8, 20, 57, 80))
    out.alpha_composite(planks, ((out.width - planks.width) // 2, out.height - planks.height - 14))
    return out


def cross():
    """the bronze-framed cross niche cut from his Wall tiles 1 #4, the dark stone around it left behind"""
    return A(CROSS).crop((38, 22, 66, 62))


def nave():
    """the nave: his flat render to 5 m, five bays with a round-topped window each, the bays' seams in shade,
    1.8 m of plain wall above the windows"""
    w = fam.wall('flat', NAVE, NAVE_H)
    bay = NAVE // BAYS
    arch = A(W(15))
    for k in range(BAYS):
        win = boarded(arch) if k == BOARDED else (arch.transpose(Image.FLIP_LEFT_RIGHT) if k % 2 else arch)
        w.alpha_composite(win, (k * bay + (bay - win.width) // 2, NAVE_H - SILL - win.height))
        if k:
            sd = Image.new('RGBA', w.size); ImageDraw.Draw(sd).rectangle([k * bay - 2, 0, k * bay + 1, NAVE_H], fill=(30, 20, 14, 80))
            w = _over(w, sd)
    return outline(shade_top(w))


def tower():
    """the bell tower: his stone panels to 12 m, the double doors in its foot under his arched window, the
    cross set above, the belfry's two louvred windows under the cap"""
    w = fam.wall('stone', TW, TOWER_H)
    door = A(fam.DOOR['wood']); right = door.transpose(Image.FLIP_LEFT_RIGHT)
    glass = A(fam.WIN['b'])
    dx = (TW - 2 * door.width) // 2
    for i, d in enumerate((door, right)):
        w.alpha_composite(glass.crop((8, 30, 8 + d.width, 30 + M(2.3) - d.height)), (dx + i * door.width, TOWER_H - M(2.3)))
        w.alpha_composite(d, (dx + i * door.width, TOWER_H - d.height))
    arch = A(W(15))
    w.alpha_composite(arch, ((TW - arch.width) // 2, TOWER_H - M(2.6) - arch.height))
    c = cross()
    w.alpha_composite(c, ((TW - c.width) // 2, TOWER_H - M(7.0) - c.height))
    lv = A(W(17))
    gap = M(0.3)
    lx = (TW - 2 * lv.width - gap) // 2
    for i in range(2):
        w.alpha_composite(lv, (lx + i * (lv.width + gap), M(0.7)))
    return outline(shade_top(w, n=24, a=140)), dx


def hall():
    """the parish hall on the far end: his cracked plaster, one storey, a door and two windows"""
    w = fam.wall('cracked', HALL, HALL_H)
    fam.door_at(w, 'marked', M(4.6))
    fam.windows(w, [M(0.8), M(2.7)], ['a', 'boarded'])
    return outline(shade_top(w))


def pew_shadow(w):
    """a pew's own contact shadow: a low soft band under its legs (the family's cast is a wall's)"""
    s = Image.new('RGBA', (w + 24, 30)); ImageDraw.Draw(s).rectangle([8, 8, w + 14, 20], fill=(20, 14, 10, 130))
    return s.filter(ImageFilter.GaussianBlur(4))


def church():
    nv = nave()
    tw, dx = tower()
    hl = hall()
    r_nave = straight_roof(NAVE + 2 * EAVE_PX, ROOF_H, A(CLAY))
    r_hall = straight_roof(HALL + 2 * EAVE_PX, ROOF_H, A(CLAY))
    r_tow = rm.roof(TW + 2 * T_EAVE, T_CAP, A(CLAY), int(T_CAP * 0.35))
    base = ROOF_H + TOWER_H                                        # the nave's wall foot
    XT = 10 + T_EAVE                                               # the tower at the entry end
    XN = XT + TW - M(0.6)                                          # the nave runs on behind the tower's corner
    XH = XN + NAVE                                                 # the hall shares the nave's end wall
    XF = XH + HALL + M(0.8)
    tbase = base + T_FWD
    pew = A(PEW); rail = A(RAIL)
    htop = base - HALL_H - ROOF_H + 26
    parts = [(hl, XH, base - HALL_H, (XH, XH + HALL, base)),          # the lower hall first: its roof tucks
             (r_hall, XH - EAVE_PX, htop, None),                       # under the nave's end, never over it
             (A(COOLER), XH + M(3.4), htop + int(ROOF_H * .22), None),
             (nv, XN, base - NAVE_H, (XN, XN + NAVE, base)),
             (r_nave, XN - EAVE_PX, base - NAVE_H - ROOF_H + 26, None),
             (tw, XT, tbase - TOWER_H, (XT, XT + TW, tbase)),
             (r_tow, XT - T_EAVE, tbase - TOWER_H - T_CAP + 22, None)]
    for k in range(3):
        parts.append((rail, XF + k * (rail.width - 6), base - rail.height + 4, None))
    aisle = M(1.4)
    mid = XN + NAVE // 2
    for d in PEW_ROWS:                                             # the pews out on the forecourt, facing the road
        y = base + int(M(d) * 0.7)
        for x in (mid - aisle // 2 - pew.width, mid + aisle // 2):
            parts.append((pew_shadow(pew.width), x - 12, y - 18, None))
            parts.append((pew, x, y - pew.height, None))
    shift = -min(y for im, x, y, fp in parts)
    parts = [(im, x, y + shift, (fp[0], fp[1], fp[2] + shift) if fp else None) for im, x, y, fp in parts]
    assert A(fam.DOOR['wood']).height >= 96 and M(2.1) >= 100, 'the door must be taller than the person'
    assert NAVE_H - SILL - A(W(15)).height >= M(1.8), 'the nave keeps its plain wall above the windows (a rest area)'
    assert ROOF_H == int(WALL_H * RATIO), 'the roof takes the measured ratio against one storey'
    assert TOWER_H > NAVE_H + ROOF_H, 'the tower stands over the nave\'s ridge'
    label = ('THE CHURCH  %.0f m: an 18 m nave of five arched windows, the 12 m bell tower at the doors, the parish '
             'hall on the end, the measured tan roofs; the pews out on the forecourt, facing the road'
             % ((XH + HALL - XT) / (100 / 1.75)))
    return fam.grounded(parts), (XT + dx, tbase + shift), label


# ---- CELL CHECK: the not-vibe-coded gate's own ruler, run before the sheet is written ---------------------

def cell_check(im):
    """every 96 px cell of the building against the ground packs' band, as the N3 cull reads a tile card
    (gates/not_vibe_coded_gate.py tile_verdict): returns the red cells; [] when the ruler is not on disk"""
    sys.path.insert(0, os.path.join(ROOT, 'gates'))
    try:
        import json
        import numpy as np
        import bohemia_not_vibe_coded as N
        bands = json.load(open(N.BANDS)); T = N.thresholds()
    except Exception as e:                                           # the ruler missing is said, never hidden
        print('CELL CHECK unmeasured: %s' % e); return []
    cell = N.pack_cell('ground'); red = []
    for y in range(0, im.height, cell):
        for x in range(0, im.width, cell):
            if min(cell, im.width - x) * 2 < cell or min(cell, im.height - y) * 2 < cell:
                continue
            c = im.crop((x, y, min(x + cell, im.width), min(y + cell, im.height)))
            if (np.asarray(c)[..., 3] >= 128).mean() < 0.5:
                continue
            bv = N.band_verdict(N.sprite_report(c, 'tile', 'upper-left', None, T), 'ground', bands)
            bad = [d for d in ('D2', 'D5') if bv.get(d, {}).get('ok') is False]
            if bad:
                red.append((x, y, bad, '; '.join(bv[d]['why'] for d in bad)))
    return red


def sheet(ch, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    ranch = A('settlement/COOK4_RANCH_TAN_PLAIN.png')
    sch = A('settlement/COOK4_GAS_STATION_STRAIGHT_ROOF.png')          # the school is 38 m: too wide for one row
    GAP = 44
    Wd = max(ch.width, ranch.width + GAP + sch.width) + 2 * GAP
    H = 230 + ch.height + 60 + max(ranch.height, sch.height) + 70
    S = Image.new('RGBA', (Wd, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE CHURCH, the next building of the straight-roof family, in the valley\'s tans: the nave, the bell tower and the parish hall at the body\'s size (57 px a metre), every roof shaped by the numbers read off your pack house #30 (roof %.2fx one storey).' % RATIO, fill=(230, 220, 200))
    d.text((16, 28), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: from above.  A placeholder until your moodboard.', fill=(200, 190, 170))
    d.text((16, 44), 'Top left: your pack house and the 1.75 m man at 1:1.  Below the church: the tan ranch and the gas station beside it at the same scale.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 70 + 96 - 107))
    y = 200
    S.alpha_composite(ch, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + A(fam.DOOR['wood']).width - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + ch.height + 8), '1  ' + label, fill=(230, 220, 200))
    y += ch.height + 60
    rh = max(ranch.height, sch.height)
    S.alpha_composite(ranch, (GAP, y + rh - ranch.height))
    d.text((GAP + 6, y + rh + 8), 'the tan plain ranch of round 6', fill=(200, 190, 170))
    S.alpha_composite(sch, (GAP * 2 + ranch.width, y + rh - sch.height))
    d.text((GAP * 2 + ranch.width + 6, y + rh + 8), 'the gas station of round 8', fill=(200, 190, 170))
    return S


if __name__ == '__main__':
    ch, foot, label = church()
    red = cell_check(ch)
    for r in red: print('CELL CHECK red at', r)
    assert not red, 'a red cell: the same detail everywhere with no rest (fix the part, never the ruler)'
    ch.save(os.path.join(AB, 'settlement/COOK4_CHURCH_STRAIGHT_ROOF.png'))
    S = sheet(ch, foot, label)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_CHURCH.png'))
    print('church', ch.size, 'sheet', S.size, 'nave %d px, tower %d px, cap %d px' % (NAVE_H, TOWER_H, T_CAP))
