#!/usr/bin/env python3
"""COOK FOUR [one at a time] + [the six buildings from the packs], round 12 (10/18, rule 101d: one asset a round):
THE CASINO, THE LAST OF THE SIX BUILDINGS, UNDER THE STRAIGHT ROOF IN THE VALLEY'S TANS.

Round 11's NEXT line: 'his word; then the casino, the last of the six, one round'.  Of the six building types on
[the six buildings from the packs] (church, school, gas station, motel, warehouse, casino) the family has drawn
the first five; the casino closes the row.  One version (rule 95).

THE BUILDING: the valley's first casinos were ranch houses grown big.  El Rancho Vegas (1941) and the Last
Frontier (1942) opened on Highway 91, the road that became the Strip, as low western buildings under shingle
gables, the sign standing on the roof over the entrance (El Rancho's windmill).  So the straight-roof family
does not have to stretch to reach it: a casino of the valley's own first kind IS a long ranch.  At the body's
57 px a metre:
  the gaming hall  26 m of his flat render at a 4.5 m plate and NOT ONE WINDOW: a casino keeps out the sun and
                   the clock, so the hall's front is plain wall (the rest area a painter leaves, and the truth);
                   two steel fire exits on it; the measured tan roof over it, against one storey as on the
                   warehouse, the school and the church; three of his air-conditioner condensers on the roof
                   (an air-conditioned hall in the desert is what made the first casinos possible);
  the entry        six glass doors in his window glass on a steel kick plate, under the marquee: the family's
                   flat deck seen from above in his grey-tan, cantilevered 2.4 m off the wall at 3.6 m, its
                   fascia the reader board, laid with the louvre of his steel vent (Wall tiles 1 #8) so its
                   tracks run empty: the letters are gone;
  the sign         on the roof over the doors, where El Rancho's stood: a 6 by 3 m cabinet of the plain half of
                   his framed steel panel (Wall tiles 1 #13), its top 4 m over the ridge, framed with the
                   panel's rim, on two legs of the same panel rising from the marquee through the roof; its face
                   is blank steel: the packs hold no lettering, and a name in the valley is his to give.

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part
that exists once is laid once at 1:1.  Our paint is weather, wear and light only: the shade under the marquee
and the eaves, the one-pixel outline, the contact and cast shadow, and one light.

ANALOG HORROR, ONE WRONG THING from the world's state: THE DOORS ARE OPEN.  Every door the family has drawn is
boarded, chained, barred or down; the casino's middle pair stands open on a black room with no windows.  The
public doors of the old casinos were built never to lock: when the state shut them in March 2020, downtown's
El Cortez had none and its staff went looking for chains and padlocks.  Nothing is painted for it but the
dark where the two leaves were.

THE LESSON FROM THE LAST FOUR (the not-vibe-coded gate's N3: the slate walk roof and the slat curtain were the
same detail across many cells with no rest): the marquee deck is 2.4 m deep and 8.6 m long, never a walk the
length of the building, and the hall keeps its blank wall; the tool checks
every 96 px cell against the packs' own band before it saves (the church's CELL CHECK, imported) and refuses
to write a sheet with a red cell.

  roofs         the tan field COOK4_ROOF_TAN_FIELD (from his clay #26) on the hall; the gravel tan
                COOK4_ROOF_GRAVEL_FIELD (from his slate #27) and its eave (#15) on the marquee deck
  walls         Wall tiles (1) #7 (flat tan render) on the hall, #13 (framed steel panel) on the sign and its
                legs, #10 (steel plate) on the kick plates
  doors         5. Windows and broken glass #0 and #3 as the glass leaves; 4. Doors and entrances #9 (steel)
                twice as the fire exits
  the board     Wall tiles (1) #8, its louvre cut and laid as the reader board's empty tracks
  the roof      pack_miscellaneous #40 (the air-conditioner condenser, 1.5 m at 1:1), three

REUSE CHECK: every surface is a pack tile already in reference/art_bank, the roof fields are round 6's tan
files, and the walls, roofs, deck and shadow come from the family's functions, the motel's straight roof and
the church's cell check (imported, not copied); the only new code is the glass doors, the reader board's cut,
the sign and the layout.

Output: reference/art_bank/settlement/COOK4_CASINO_STRAIGHT_ROOF.png and the sheet
records/target/COOK4_THE_CASINO.png (rule 100: never slices/ or engine/).
Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/
COOK4_THE_VALLEY_TANS.json.  Light: from above (+9.3 top over bottom, the study page).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the character at 1:1 at the open doors,
  the tan plain ranch of round 6 and the church of round 11 beside it at the same scale, and the real thing:
  El Rancho Vegas (1941) and the Last Frontier (1942) on Highway 91, low western casinos under shingle gables
  with the sign on the roof over the entrance; the windowless gaming hall every casino since has kept.
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the shadow.
  what changed: the family's widest blank wall and its only open door; the sign with no name.
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import outline, _over, AB, ROOT
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_motel_straight_roof as motel
from bohemia_cook4_the_valley_tans import A_redirected as A
from bohemia_cook4_the_roof_measured import shade_top, lay, M, RATIO
from bohemia_cook4_the_church import cell_check

fam.A = A; rm.A = A                                   # the family's code, the round-6 tan fields
WALL_H, ROOF_H = fam.WALL_H, fam.ROOF_H
EAVE_PX, straight_roof = motel.EAVE_PX, motel.straight_roof
CLAY = 'settlement/pack_5_roof_tiles_026.png'
SLATE, SLATE_EAVE = 'settlement/pack_5_roof_tiles_027.png', 'settlement/pack_5_roof_tiles_015.png'
W = lambda n: 'settlement/pack_5_windows_and_broken_glass_%03d.png' % n
STEEL_DOOR = 'door/pack_4_doors_and_entrances_009.png'
PANEL = 'settlement/pack_wall_tiles_1_013.png'        # the sign's framed steel
PLATE = 'settlement/pack_wall_tiles_1_010.png'        # the kick plate under the glass
VENT = 'settlement/pack_wall_tiles_1_008.png'         # the louvre: the reader board's empty tracks
CONDENSER = 'prop/pack_miscellaneous_040.png'
HALL, HALL_H = M(26.0), M(4.5)                        # the gaming hall: 26 m at a 4.5 m plate, no windows
ENTRY_X = M(6.5)                                      # the entry bay starts 6.5 m from the road end
LEAVES = 6                                            # six glass doors, three pairs
OPEN = (2, 3)                                         # the middle pair: open
DOOR_H = M(2.3)                                       # a casino's glass doors run taller than a house door
MQ_H, MQ_D = M(3.6), M(2.4)                           # the marquee: 3.6 m clear, 2.4 m off the wall
MQ_TOP = int(MQ_D * 0.5)                              # its deck seen from above at 45 degrees (the family's walk)
BOARD = M(0.8)                                        # the reader board: the marquee's fascia
SIGN_W, SIGN_H = M(6.0), M(3.0)                       # the sign's cabinet, 6 m by 3 m
LEG_W = M(0.5)
SHEET = (6, 12, 36, 84)                               # the plain half of his framed panel: one sheet and its seam
TOWER_OVER = M(4.0)                                   # the cabinet's top 4 m over the ridge
EXITS = (M(18.5), M(23.0))                            # the two fire exits along the blank wall
CONDENSERS = (M(3.0), M(15.5), M(19.0))


def leaf(n):
    """one glass door: his window's frame and glass whole (his sill cut off, a door has none) over his steel
    kick plate, a half-glass door of the forties"""
    g = A(W(n)); g = g.crop((0, 0, g.width, g.height - 10))
    out = Image.new('RGBA', (g.width, DOOR_H))
    out.alpha_composite(g, (0, 0))
    kick = lay(A(PLATE), g.width, DOOR_H - g.height, crop=(6, 20, 70, 76))
    out.alpha_composite(kick, (0, g.height))
    return outline(out)


def doorway(w):
    """the open pair: the two leaves gone into the dark, the jambs' shade, the sill catching the light"""
    out = Image.new('RGBA', (w, DOOR_H), (8, 6, 5, 255)); d = ImageDraw.Draw(out)
    for i in range(14): d.rectangle([i, 0, i, DOOR_H], fill=(28, 22, 17, 255 - i * 12))       # the jamb in shade
    d.line([(0, DOOR_H - 3), (w, DOOR_H - 3)], fill=(120, 108, 92, 255))                      # the sill
    return outline(out)


def hall():
    """the gaming hall: his flat render to 4.5 m and no window; the glass doors in the entry bay; two steel
    fire exits; returns the wall, the entry's x and the open pair's x"""
    w = fam.wall('flat', HALL, HALL_H)
    x = ENTRY_X; open_x = None
    sd = Image.new('RGBA', w.size); d = ImageDraw.Draw(sd)
    keys = [0, 3, 0, 0, 3, 0]
    lw = A(W(0)).width
    d.rectangle([ENTRY_X - M(0.3), HALL_H - DOOR_H - M(0.3), ENTRY_X + LEAVES * (lw - 2) + M(0.3), HALL_H],
                fill=(30, 20, 14, 70))                                                      # the entry's reveal
    w = _over(w, sd)
    for k in range(LEAVES):
        if k == OPEN[0]:
            open_x = x
            w.alpha_composite(doorway(2 * (lw - 2) + 2), (x, HALL_H - DOOR_H)); x += 2 * (lw - 2); continue
        if k == OPEN[1]: continue
        w.alpha_composite(leaf(keys[k]), (x, HALL_H - DOOR_H)); x += lw - 2
    s = A(STEEL_DOOR)
    for ex in EXITS:
        plate = lay(A(PLATE), s.width, M(2.1) - s.height, crop=(6, 20, 70, 60))
        w.alpha_composite(plate, (ex, HALL_H - M(2.1)))
        w.alpha_composite(s, (ex, HALL_H - s.height))
    return outline(shade_top(w, n=24, a=140)), x, open_x


def marquee(w):
    """the marquee: the family's flat deck in his grey-tan seen from above, its fascia the reader board laid
    with his vent's louvre so the tracks run empty, the deep shade it throws on the wall under it"""
    deck = fam.shed_roof(w, MQ_TOP, SLATE, SLATE_EAVE)
    px = [c for c in deck.getdata() if c[3] == 255]
    dark = tuple(int(sorted(c[i] for c in px)[len(px) // 6]) for i in range(3)) + (255,)
    under = Image.new('RGBA', deck.size, dark); under.alpha_composite(deck); deck = outline(under)
    v = A(VENT); louvre = v.crop((14, 16, 62, 44))                        # his louvre: six slats in a steel frame
    board = Image.new('RGBA', (w, BOARD))
    rim = lay(A(PLATE), w, BOARD, crop=(6, 20, 70, 20 + BOARD))
    board.alpha_composite(rim)
    tracks = lay(louvre.crop((4, 4, louvre.width - 4, louvre.height - 4)), w - 16, BOARD - 14)
    board.alpha_composite(tracks, (8, 7))
    board = outline(shade_top(board, n=8, a=90))
    shade = Image.new('RGBA', (w, MQ_H)); sd = ImageDraw.Draw(shade)
    for i in range(MQ_H): sd.rectangle([0, i, w, i], fill=(20, 14, 10, int(150 * max(0.0, 1 - i / (MQ_H * 0.7)))))
    return deck, board, shade


def sign(legs_h):
    """the sign on the roof over the doors, where El Rancho's stood: a cabinet of his steel plate (Wall tiles 1
    #3) 6 m by 3 m, framed top and foot with the rim of his framed panel (#13), on two legs of that panel; its
    face blank: the name is gone.  Returns the sign and the legs' x inside it."""
    t = A(PANEL)
    cab = lay(t, SIGN_W, SIGN_H, crop=SHEET)                              # sheet steel, a seam every half-tile
    rim = t.crop((4, 0, t.width - 4, 9))
    top = lay(rim, SIGN_W, rim.height); cab.alpha_composite(top, (0, 0))
    cab.alpha_composite(top.transpose(Image.FLIP_TOP_BOTTOM), (0, SIGN_H - rim.height))
    sh = Image.new('RGBA', cab.size); d = ImageDraw.Draw(sh)
    d.rectangle([SIGN_W - 12, 0, SIGN_W, SIGN_H], fill=(18, 12, 8, 90))                       # its far edge turned
    d.line([(1, 0), (1, SIGN_H)], fill=(220, 214, 200, 80))                                   # its lit edge
    cab = outline(shade_top(_over(cab, sh), n=20, a=110))
    leg = outline(shade_top(lay(t, LEG_W, legs_h, crop=(6, 12, 6 + LEG_W, t.height - 4)), n=12, a=90))
    out = Image.new('RGBA', (SIGN_W, SIGN_H + legs_h))
    xs = (int(SIGN_W * .22), int(SIGN_W * .78) - LEG_W)
    for x in xs: out.alpha_composite(leg, (x, SIGN_H - 4))
    under = Image.new('RGBA', (SIGN_W, 16)); ud = ImageDraw.Draw(under)
    for i in range(16): ud.rectangle([0, i, SIGN_W, i], fill=(18, 12, 8, 120 - i * 7))       # the cabinet's shade on its legs
    out.alpha_composite(under, (0, SIGN_H))
    out.alpha_composite(cab, (0, 0))
    return out, xs


def casino():
    hl, entry_end, open_x = hall()
    r_hall = straight_roof(HALL + 2 * EAVE_PX, ROOF_H, A(CLAY))
    base = ROOF_H + TOWER_OVER + HALL_H                            # the hall's wall foot
    XH = 10 + EAVE_PX
    wall_top = base - HALL_H
    roof_top = wall_top - ROOF_H + 26
    mq_w = entry_end - ENTRY_X + M(1.6)
    MX = XH + ENTRY_X - M(0.8)
    deck, board, shade = marquee(mq_w)
    deck_y = base - MQ_H - MQ_TOP + 8                              # the deck's far edge at the wall, 3.6 m up
    board_y = deck_y + MQ_TOP - 8
    sg_x = MX + (mq_w - SIGN_W) // 2
    sg_top = roof_top + int(ROOF_H * .14) - TOWER_OVER             # 4 m over the ridge
    sg, legs = sign(board_y - sg_top - SIGN_H + 4)
    cond = A(CONDENSER)
    parts = [(hl, XH, wall_top, (XH, XH + HALL, base)),
             (r_hall, XH - EAVE_PX, roof_top, None)]
    for cx in CONDENSERS:
        parts.append((cond, XH + cx, roof_top + int(ROOF_H * .30), None))
    parts += [(shade, MX, base - MQ_H, None),
              (sg, sg_x, sg_top, None),
              (deck, MX, deck_y, None),
              (board, MX, board_y, None)]
    shift = -min(y for im, x, y, fp in parts)
    parts = [(im, x, y + shift, (fp[0], fp[1], fp[2] + shift) if fp else None) for im, x, y, fp in parts]
    assert DOOR_H >= M(2.1) and A(W(0)).height < DOOR_H, 'the glass doors are taller than the person and laid, not scaled'
    assert SIGN_H < TOWER_OVER, 'the sign stands clear over the ridge'
    assert MQ_H - BOARD > DOOR_H, 'the reader board hangs clear over the doors'
    assert ROOF_H == int(WALL_H * RATIO), 'the roof takes the measured ratio against one storey'
    assert A(CONDENSER).height < 96 and A(CONDENSER).width < 96, 'a condenser is his piece at 1:1, about 1.5 m'
    label = ('THE CASINO  %.0f m: a 26 m gaming hall with no windows under the measured tan roof, three condensers, '
             'six glass doors under the marquee and its empty reader board, the sign on the roof with no name; the middle '
             'pair open on the dark' % ((HALL + 2 * EAVE_PX) / (100 / 1.75)))
    return fam.grounded(parts), (XH + open_x, base + shift), label


def sheet(cs, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    ranch = A('settlement/COOK4_RANCH_TAN_PLAIN.png')
    ch = A('settlement/COOK4_CHURCH_STRAIGHT_ROOF.png')
    GAP = 44
    Wd = max(cs.width, ranch.width + GAP + ch.width) + 2 * GAP
    H = 230 + cs.height + 60 + max(ranch.height, ch.height) + 70
    S = Image.new('RGBA', (Wd, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE CASINO, the last of the six buildings of the straight-roof family, in the valley\'s tans: the gaming hall, the marquee and the sign at the body\'s size (57 px a metre), the roof shaped by the numbers read off your pack house #30 (roof %.2fx one storey).' % RATIO, fill=(230, 220, 200))
    d.text((16, 28), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: from above.  A placeholder until your moodboard.', fill=(200, 190, 170))
    d.text((16, 44), 'Top left: your pack house and the 1.75 m man at 1:1.  Below the casino: the tan ranch and the church beside it at the same scale.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 70 + 96 - 107))
    y = 200
    S.alpha_composite(cs, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + 40 - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + cs.height + 8), '1  ' + label, fill=(230, 220, 200))
    y += cs.height + 60
    rh = max(ranch.height, ch.height)
    S.alpha_composite(ranch, (GAP, y + rh - ranch.height))
    d.text((GAP + 6, y + rh + 8), 'the tan plain ranch of round 6', fill=(200, 190, 170))
    S.alpha_composite(ch, (GAP * 2 + ranch.width, y + rh - ch.height))
    d.text((GAP * 2 + ranch.width + 6, y + rh + 8), 'the church of round 11', fill=(200, 190, 170))
    return S


if __name__ == '__main__':
    cs, foot, label = casino()
    red = cell_check(cs)
    for r in red: print('CELL CHECK red at', r)
    out = os.environ.get('COOK4_DRAFT')
    if out:                                              # a draft for the eye, never the asset
        cs.save(out); print('draft', cs.size, len(red), 'red'); raise SystemExit
    assert not red, 'a red cell: the same detail everywhere with no rest (fix the part, never the ruler)'
    cs.save(os.path.join(AB, 'settlement/COOK4_CASINO_STRAIGHT_ROOF.png'))
    S = sheet(cs, foot, label)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_CASINO.png'))
    print('casino', cs.size, 'sheet', S.size, 'hall %d px, marquee %d px, roof %d px' % (HALL_H, MQ_H, ROOF_H))
