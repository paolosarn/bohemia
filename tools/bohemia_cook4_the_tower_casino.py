#!/usr/bin/env python3
"""COOK FOUR [the Strip's row], round 15 (10/19, rule 101d: one asset a round): THE SECOND CASINO, THE STRIP'S
FIRST TOWER, UNDER THE STRAIGHT ROOF IN THE VALLEY'S TANS.

The row (his YES on the casino and the church under the straight roof in the valley's tans): 'the Strip's next
four, one per round in the same recipe (a second casino, a pawn shop, a wedding chapel, a motel sign tower), each
in VOTE with its card id, analog horror, weathered; the casino and the church kept as they are.'  This is the
first of the four.  One version (rule 95).

THE BUILDING: the Strip's second wave.  The first casinos were ranches grown big (El Rancho Vegas 1941, the
round-12 casino); in 1955 the Riviera opened the Strip's first high-rise, nine storeys, the rooms stacked over the
gaming floor, the name on the roof.  The family reaches it the same way it reached the school and the church:
his pieces at the body's 57 px a metre, the measured roof, one sun.  So:
  the gaming floor  one tall storey (5 m) of his flat render (Wall tiles 1 #7, the podium darker than the tower) and NOT ONE WINDOW, as the first
                    casino: six glass doors (the first casino's leaf: his window glass over his steel kick plate)
                    under a marquee (the family's grey-tan deck seen from above, its reader board his vent's
                    louvre so the tracks run empty);
  the tower         eight storeys of rooms, 3 m each, 30 m across: two wings of his stone panels (the precast face of a 1955 tower), four rooms a
                    wing, one window a room (his window at 1:1, 1.2 by 1.7 m, its sill 0.8 m over the floor), and
                    between them the core, 0.6 m proud of the wings, with no window at all (the stairs and the
                    lifts: the rest area a painter leaves), its face in the sun and its shadow on the right wing;
                    each floor's slab edge catches the sun and drops its shadow;
  the roof          the measured straight roof at the tower's own depth (14 m, so 1.4 of the 10 m ranch's), his
                    tan field, his caps laid once along the ridge;
  the sign          over the core on the ridge, a 10 m cabinet of his framed steel panel (Wall tiles 1 #13) on
                    two legs, its face blank: the name is his to give.
HOW THE PACK DID IT (rule 100c, records/BOHEMIA_COOK4_HOW_THE_PACK_DID_IT_THE_PLACES_10_10_26.md): light from above,
his 96 px pieces at 1:1, front faces never roof plans, the ring a dark brown 1 px; THE SECOND PASS's rules (his YES,
'That's way better holy shit'; DIRECTION's card PASS): every surface cut to meet itself, the tile's own light taken out
of the wall, one sun from the upper left, the eave's one hard shadow, his dirt in the roof's grooves, the guide's
shadow (black, at most 42 percent) and nothing black inside.  Its functions are imported, not copied.
ANALOG HORROR, ONE WRONG THING, from the world's state: the two floors in reach of the street are boarded, the five
above them broken, and THE TOP FLOOR IS WHOLE: every one of its eight windows shuttered and shut, clean, the only
floor in the valley somebody keeps.  Nothing is painted for it; it is his louvred shutter (5. #17) eight times.
THE LESSON FROM THE LAST SIX (N3: the same detail across many cells is a red): the windows are 41 percent of a
floor's width and the spandrels and the core are plain; the tool runs the not-vibe-coded ruler on every 96 px cell
before it saves (the church's CELL CHECK, imported) and refuses to save a red cell (fix the part, never the ruler).
NO LITERAL PIXEL (rule 108, ART PIPE A2): nothing here writes a colour by number; every shade is a light on his own
pixels (the second pass's light()), every surface his tile.

  roofs   the tan field from his clay #26 (round 6's COOK4_ROOF_TAN_FIELD) on the tower; the gravel tan from his slate
          #27 and its eave #15 on the marquee deck
  walls   Wall tiles (1) #5 (stone panels) on the tower, the wings and the core; #7 (flat render) on the gaming floor; #13 (framed
          steel panel) on the sign; #10 (steel plate) on the kick plates; #8's louvre on the reader board
  glass   5. Windows and broken glass #6 #9 #13 #18 (boarded), #1 #2 #4 #5 #7 #11 #12 #21 (broken), #17 (shuttered)

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the man at 1:1 at the doors, the round-12
  casino and the round-11 church beside it at the same scale, and the real thing: the Riviera (1955, nine storeys, the
  Strip's first high-rise), the rooms over a windowless gaming floor, the name on the roof.
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the second pass's light.
  what changed: the family's first building over one storey high; the only whole floor in the valley.
REUSE CHECK (REUSE-FIRST, 7/22): the walls, roofs, deck, light and shadow are the second pass's functions
(tools/bohemia_cook4_the_second_pass.py), the glass doors the first casino's leaf (tools/bohemia_cook4_the_casino.py),
the cell check the church's, the ratios the measured roof's; every surface is his pack tile in reference/art_bank at
its own pixels.  New here: the stacked floors, the slab light, the sign laid without a drawn pixel, the layout, the sheet.

Output (a cook folder, PLUMBER's art-fence note 10/19: his bank holds his packs):
reference/art_pipe/cook4/strip/COOK4_THE_TOWER_CASINO.png and the sheet records/target/COOK4_THE_TOWER_CASINO.webp
(rule 100: never slices/ or engine/).  Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file:
reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: one sun, upper left.

    python3 tools/bohemia_cook4_the_tower_casino.py          (about a minute)
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_cook4_the_second_pass as sp
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_casino as cam
from bohemia_cook4_the_church import cell_check

ROOT, AB = sp.ROOT, sp.AB
A = sp.A
M = rm.M
OUT_DIR = os.path.join(ROOT, 'reference/art_pipe/cook4/strip')
ASSET = os.path.join(OUT_DIR, 'COOK4_THE_TOWER_CASINO.png')
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_TOWER_CASINO.webp')
CLAY = 'settlement/pack_5_roof_tiles_026.png'
SLATE, SLATE_EAVE = 'settlement/pack_5_roof_tiles_027.png', 'settlement/pack_5_roof_tiles_015.png'
WIN = lambda n: 'settlement/pack_5_windows_and_broken_glass_%03d.png' % n
PANEL, PLATE, VENT = cam.PANEL, cam.PLATE, cam.VENT

TOWER_W = M(30.0)                    # 30 m across: two wings of four rooms and the core
WING, CORE = M(12.0), M(6.0)
ROOMS = 4                            # rooms a wing, 3 m each
STOREY, FLOORS = M(3.0), 8           # eight storeys of rooms
GROUND = M(5.0)                      # the gaming floor, one tall storey
SILL = M(0.8)
ROOF_H = int(fam.ROOF_H * 1.4)       # the measured roof at the tower's 14 m depth (the ranch's is 10 m)
EAVE_PX = int(M(0.6))                # a tower's overhang, 0.6 m (the church's tower took the same)
DOOR_H, MQ_H, MQ_D, BOARD = cam.DOOR_H, cam.MQ_H, cam.MQ_D, cam.BOARD
MQ_TOP = int(MQ_D * 0.5)
LEAVES = 6
SIGN_W, SIGN_H, LEG_W = M(10.0), M(2.4), M(0.5)
SIGN_OVER = M(3.4)                   # the cabinet's top 3.4 m over the ridge
BOARDED = [6, 9, 13, 18]
BROKEN = [1, 2, 4, 5, 7, 11, 12, 21]
SHUT = 17                            # his louvred shutter, shut: the top floor
SEED = 1519


def edge_light(im, side, width, tint, k=1.0):
    """the light on one edge of a piece: a band of columns walked toward the sun or the cool (never a colour laid)"""
    s = np.zeros((im.height, im.width))
    if side == 'left': s[:, :width] = k
    else: s[:, -width:] = k
    return sp.light(im, s, tint)


def rows_light(im, rows, tint, k=1.0):
    s = np.zeros((im.height, im.width))
    for r in rows:
        if 0 <= r < im.height: s[r] = k
    return sp.light(im, s, tint)


def floors():
    """the eight storeys of rooms: the wings and the core in his stone panels, one window a room,
    the slab edges in the one sun; returns the wall"""
    H = STOREY * FLOORS
    wall = Image.new('RGBA', (TOWER_W, H))
    left = sp.wall2('stone', WING, H); core = sp.wall2('stone', CORE, H); right = sp.wall2('stone', WING, H)
    wall.alpha_composite(left, (0, 0)); wall.alpha_composite(core, (WING, 0)); wall.alpha_composite(right, (WING + CORE, 0))
    rng = np.random.RandomState(SEED)
    for f in range(FLOORS):                                        # f = 0 is the top floor
        top = f * STOREY
        from_street = FLOORS - f                                   # 1 = the first floor over the gaming floor
        for wing_x in (0, WING + CORE):
            for r in range(ROOMS):
                if f == 0: n = SHUT
                elif from_street <= 2: n = BOARDED[rng.randint(len(BOARDED))]
                else: n = BROKEN[rng.randint(len(BROKEN))]
                w = A(WIN(n))
                if rng.rand() < 0.5 and n != SHUT: w = w.transpose(Image.FLIP_LEFT_RIGHT)
                x = wing_x + r * M(3.0) + (M(3.0) - w.width) // 2
                y = top + STOREY - SILL - w.height
                wall.alpha_composite(w, (x, y))
    # the slab edges: each floor's slab catches the sun on its top row and drops a 3-row shadow on the wall under it
    lit, shade = [], []
    for f in range(1, FLOORS):
        y = f * STOREY; lit += [y - 1]; shade += [y, y + 1, y + 2]
    wall = rows_light(wall, lit, sp.SUN, 0.9)
    wall = rows_light(wall, shade, sp.SHADE, 0.75)
    wall = edge_light(wall, 'left', 6, sp.SUN, 0.6)                 # the corner the sun finds
    wall = edge_light(wall, 'right', 8, sp.SHADE, 0.8)              # the corner turned from it
    lit_c = np.zeros((wall.height, wall.width)); lit_c[:, WING:WING + CORE] = 0.45; lit_c[:, WING:WING + 3] = 1.0   # the core stands
    shd_c = np.zeros((wall.height, wall.width)); shd_c[:, WING + CORE:WING + CORE + 10] = 0.85   # 0.6 m proud: its face and sunny edge
    shd_c[:, WING - 2:WING] = 0.5                                                               # in the sun, its shadow on the right wing
    wall = sp.light(sp.light(wall, lit_c, sp.SUN), shd_c, sp.SHADE)
    return sp.outline2(sp.shade_top2(wall))


def gaming_floor():
    """the gaming floor: his stone panels to 5 m and no window; six glass doors in the middle; returns the wall and
    the doors' left x"""
    w = sp.wall2('flat', TOWER_W, GROUND)
    lw = A(WIN(0)).width
    span = LEAVES * (lw - 2)
    x0 = (TOWER_W - span) // 2
    reveal = np.zeros((GROUND, TOWER_W)); reveal[GROUND - DOOR_H - M(0.3):, x0 - M(0.3):x0 + span + M(0.3)] = 0.6
    w = sp.light(w, reveal, sp.SHADE)                               # the entry's reveal, in the cool
    keys = [0, 3, 0, 0, 3, 0]; x = x0
    for k in range(LEAVES):
        w.alpha_composite(cam.leaf(keys[k]), (x, GROUND - DOOR_H)); x += lw - 2
    w = edge_light(w, 'left', 6, sp.SUN, 0.6)
    w = edge_light(w, 'right', 8, sp.SHADE, 0.8)
    return sp.outline2(w), x0, span


def marquee(width):
    """the family's grey-tan deck seen from above over the doors, its fascia the reader board: his steel plate rimmed,
    his vent's louvre as the empty tracks; the shade it throws is laid on the wall as light, after"""
    deck = sp.shed_roof2(width, MQ_TOP, SLATE, SLATE_EAVE)
    v = A(VENT); louvre = v.crop((14, 16, 62, 44))
    board = Image.new('RGBA', (width, BOARD))
    board.alpha_composite(rm.lay(A(PLATE), width, BOARD, crop=(6, 20, 70, 20 + BOARD)))
    board.alpha_composite(rm.lay(louvre.crop((4, 4, louvre.width - 4, louvre.height - 4)), width - 16, BOARD - 14), (8, 7))
    board = sp.outline2(sp.light(board, sp.rows_fade(BOARD, width, 8, peak=0.8), sp.SHADE))
    return deck, board


def sign(legs_h):
    """a 10 m cabinet of the plain half of his framed steel panel, rimmed top and foot with the panel's own rim, on two
    legs of the same panel: its face blank"""
    t = A(PANEL)
    cab = rm.lay(t, SIGN_W, SIGN_H, crop=cam.SHEET)
    rim = t.crop((4, 0, t.width - 4, 9))
    top = rm.lay(rim, SIGN_W, rim.height)
    cab.alpha_composite(top, (0, 0)); cab.alpha_composite(top.transpose(Image.FLIP_TOP_BOTTOM), (0, SIGN_H - rim.height))
    cab = edge_light(cab, 'left', 2, sp.SUN, 0.8)
    cab = edge_light(cab, 'right', 12, sp.SHADE, 0.7)
    cab = sp.outline2(sp.shade_top2(cab))
    leg = sp.outline2(rm.lay(t, LEG_W, legs_h, crop=(6, 12, 6 + LEG_W, t.height - 4)))
    out = Image.new('RGBA', (SIGN_W, SIGN_H + legs_h))
    xs = (int(SIGN_W * .2), int(SIGN_W * .8) - LEG_W)
    for x in xs: out.alpha_composite(leg, (x, SIGN_H - 4))
    out = sp.light(out, np.pad(np.ones((16, SIGN_W)) * 0.8, ((SIGN_H, legs_h - 16), (0, 0))), sp.SHADE)  # the cabinet's shade on its legs
    out.alpha_composite(cab, (0, 0))
    return out


def tower():
    fl = floors()
    gf, door_x, span = gaming_floor()
    roof = sp.straight_roof2(TOWER_W + 2 * EAVE_PX, ROOF_H, A(CLAY))
    XT = 10 + EAVE_PX
    sign_top = 0
    roof_top = sign_top + SIGN_H + SIGN_OVER - int(ROOF_H * .14)    # the ridge 3.4 m under the cabinet's top
    wall_top = roof_top + ROOF_H - 26
    floors_foot = wall_top + fl.height
    base = floors_foot + GROUND
    mq_w = span + M(1.6)
    MX = XT + door_x - M(0.8)
    deck, board = marquee(mq_w)
    deck_y = base - MQ_H - MQ_TOP + 8
    board_y = deck_y + MQ_TOP - 8
    sg = sign(roof_top + int(ROOF_H * .14) - sign_top - SIGN_H + 6)
    sg_x = XT + WING + (CORE - SIGN_W) // 2
    # the marquee's shade on the gaming floor, as light on his panels (never a sheet laid over)
    s = np.zeros((GROUND, TOWER_W)); top_row = GROUND - MQ_H
    for i in range(int(MQ_H * 0.7)):
        if 0 <= top_row + i < GROUND: s[top_row + i, max(0, MX - XT):MX - XT + mq_w] = 0.85 * (1 - i / (MQ_H * 0.7))
    gf = sp.light(gf, s, sp.SHADE)
    parts = [(fl, XT, wall_top, None),
             (gf, XT, floors_foot, (XT, XT + TOWER_W, base)),
             (roof, XT - EAVE_PX, roof_top, None),
             (sg, sg_x, sign_top, None),
             (deck, MX, deck_y, None),
             (board, MX, board_y, None)]
    assert DOOR_H >= M(2.1), 'the glass doors are taller than the person'
    assert MQ_H - BOARD > DOOR_H, 'the reader board hangs clear over the doors'
    assert A(WIN(SHUT)).height == 96, 'the shutters are his piece at 1:1'
    im = sp.never_black(sp.guide_alpha(sp.grounded2(parts)))
    label = ('THE TOWER CASINO  %.0f m across, %.0f m of wall to the eave: eight storeys of rooms over a windowless gaming floor, the '
             'core of his stone with no window, the measured tan roof, the sign on the ridge with no name; the two floors in reach '
             'boarded, the five over them broken, the top floor shuttered and whole' % ((TOWER_W + 2 * EAVE_PX) / rm.PPM, (base - wall_top) / rm.PPM))
    return im, (XT + door_x + span // 2, base), label


def sheet(tw, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    cs = A('settlement/COOK4_CASINO_STRAIGHT_ROOF.png')
    ch = A('settlement/COOK4_CHURCH_STRAIGHT_ROOF.png')
    GAP = 44
    row2 = cs.width + GAP + ch.width
    Wd = max(tw.width + 260, row2) + 2 * GAP
    Hs = 230 + tw.height + 70 + max(cs.height, ch.height) + 80
    S = Image.new('RGBA', (Wd, Hs), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    f, s = sp.font(22), sp.font(17)
    d.text((16, 10), 'ALL AT 1:1.  THE TOWER CASINO, the second casino of the Strip, the family\'s first building over one storey: the rooms '
                     'over the gaming floor at the body\'s size (57 px a metre), the roof shaped by the numbers read off your pack house #30.', font=s, fill=(230, 220, 200))
    d.text((16, 34), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  '
                     'Light: one sun, upper left.  A placeholder until your moodboard.', font=s, fill=(200, 190, 170))
    d.text((16, 58), 'One wrong thing: the top floor is the only whole floor in the valley, every shutter shut.  Below: the first casino and the church '
                     'at the same scale.', font=s, fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 96)); d.text((30, 198), 'his pack #30', font=s, fill=(200, 190, 170))
    S.alpha_composite(man, (150, 96 + 96 - 107))
    y = 230
    S.alpha_composite(tw, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + tw.height + 10), label, font=s, fill=(230, 220, 200))
    y += tw.height + 70
    rh = max(cs.height, ch.height)
    S.alpha_composite(cs, (GAP, y + rh - cs.height)); d.text((GAP + 6, y + rh + 10), 'the casino of round 12', font=s, fill=(200, 190, 170))
    S.alpha_composite(ch, (GAP * 2 + cs.width, y + rh - ch.height)); d.text((GAP * 2 + cs.width + 6, y + rh + 10), 'the church of round 11', font=s, fill=(200, 190, 170))
    return S, (GAP, 230, tw.width, tw.height)


if __name__ == '__main__':
    tw, foot, label = tower()
    red = cell_check(tw)
    for r in red: print('CELL CHECK red at', r)
    out = os.environ.get('COOK4_DRAFT')
    if out:                                              # a draft for the eye, never the asset
        tw.save(out); print('draft', tw.size, len(red), 'red'); raise SystemExit
    assert not red, 'a red cell: the same detail everywhere with no rest (fix the part, never the ruler)'
    os.makedirs(OUT_DIR, exist_ok=True)
    tw.save(ASSET)
    S, at = sheet(tw, foot, label)
    S.convert('RGB').save(SHEET, lossless=True, method=6)
    print('tower', tw.size, 'sheet', S.size, 'the tower on the sheet at', at, label)
