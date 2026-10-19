#!/usr/bin/env python3
"""COOK FOUR [the Strip's row], round 17 (10/19, rule 101d: one asset a round): THE WEDDING CHAPEL, UNDER THE
STRAIGHT ROOF IN THE VALLEY'S TANS.

The row: 'the Strip's next four, one per round in the same recipe (a second casino, a pawn shop, a wedding chapel,
a motel sign tower)'.  The tower casino and the pawn shop are in; this is the third.

THE BUILDING: the Las Vegas wedding chapel of the Strip's own kind (the Little Church of the West, 1942; the Little
White Wedding Chapel, 1951): a small one-room chapel, not a parish church: a 9 m front at one storey, two round-topped
windows, a pair of doors under a small canopy, a bell cote on the ridge, and a sign on a pole bigger than the chapel,
because on the Strip a chapel sells weddings to people driving by.  At the body's 57 px a metre:
  the front     9 m of his cracked plaster (Wall tiles 1 #0) to a 3.6 m plate; one of his round-topped windows (5. #15)
                either side; his plank doors (4. #7, one mirrored) under a transom of his glass (the church's tower doors,
                the same pieces; the arched window the church set over them would hide behind the canopy, so it is not laid);
  the canopy    over the doors, the family's grey-tan deck seen from above (3.2 m, 1.6 m deep) on two of his posts;
  the bell cote on the ridge, a 1.6 m box of his stone panels (#5) with his louvred window (5. #17) as the bell opening,
                his cross (the church's, cut from Wall tiles 1 #4) under it, its own measured cap;
  the roof      the measured straight roof against one storey, his tan field, his caps once, his dirt (the second pass);
  the sign      at the left on one pole of his framed steel, a 3.4 by 1.6 m cabinet 4.6 m up, its face blank;
  the boxes     two of his flower boxes (17. Benches and seating #2) either side of the doors.
ANALOG HORROR, ONE WRONG THING, from the world's state: THE FLOWERS ARE ALIVE.  His two boxes by the doors are in
bloom, red and gold, the only living colour in a valley where nobody waters anything; the doors are shut.  Nothing is
painted for it: it is his tile as bought, laid where a chapel keeps its flowers.
HOW THE PACK DID IT (rule 100c) and THE SECOND PASS (his YES, DIRECTION's card PASS): his pieces at 1:1, front faces never
roof plans, every surface cut to meet itself, the tile's light out of the wall, one sun from the upper left, the eave's one
hard shadow, the guide's shadow and nothing black inside.  NO LITERAL PIXEL (rule 108, ART PIPE A2): every shade is a light
on his own pixels.  The tool runs the not-vibe-coded ruler on every 96 px cell before it saves (the church's CELL CHECK).

  roof    the tan field from his clay #26, his caps; the gravel tan from his slate #27 and its eave #15 on the canopy
  walls   Wall tiles (1) #0 (cracked plaster); #5 (stone panels) on the bell cote; #13 (framed steel) on the sign
  glass   5. Windows and broken glass #15 (round-topped) twice, #3 as the transom, #17 (louvred) in the cote
  door    4. Doors and entrances #7 (plank), one mirrored
  props   17. Benches and seating #2 (the flower box) twice; 7. Fences and palisades #2's upright as the canopy posts

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the man at 1:1 at the doors, the round-11 church and
  the round-16 pawn shop beside it at the same scale, and the real thing: the Strip's wedding chapels (the Little Church
  of the West, 1942, a small gabled chapel with a bell cote; the Little White Wedding Chapel, 1951, its sign on a pole
  taller than the chapel).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the second pass's light.
  what changed: the family's smallest building with its biggest sign, and its only living thing.
REUSE CHECK (REUSE-FIRST, 7/22): the walls, roof, deck, light and shadow are the second pass's functions
(tools/bohemia_cook4_the_second_pass.py), the doors and the cross the church's (tools/bohemia_cook4_the_church.py), the
posts the family's, the sign the tower's way on one leg (tools/bohemia_cook4_the_tower_casino.py), the cell check the
church's; every surface is his pack tile in reference/art_bank at its own pixels.  New here: the chapel, the bell cote,
the layout, the sheet.

Output (a cook folder, PLUMBER's art-fence note 10/19): reference/art_pipe/cook4/strip/COOK4_THE_WEDDING_CHAPEL.png and the
sheet records/target/COOK4_THE_WEDDING_CHAPEL.webp (rule 100: never slices/ or engine/).  Native pixel size: his 96 px
pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: one sun,
upper left.

    python3 tools/bohemia_cook4_the_wedding_chapel.py          (about a minute)
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_cook4_the_second_pass as sp
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_church as chm
import bohemia_cook4_the_tower_casino as tc
import bohemia_cook4_the_pawn_shop as pw
from bohemia_cook4_the_church import cell_check

ROOT, AB, A, M = sp.ROOT, sp.AB, sp.A, rm.M
OUT_DIR = tc.OUT_DIR
ASSET = os.path.join(OUT_DIR, 'COOK4_THE_WEDDING_CHAPEL.png')
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_WEDDING_CHAPEL.webp')
FRONT, PLATE_H = M(9.0), M(3.6)
ROOF_H = int(PLATE_H * rm.RATIO)
ARCH = 'settlement/pack_5_windows_and_broken_glass_015.png'
LOUVRE = 'settlement/pack_5_windows_and_broken_glass_017.png'
FLOWERS = 'prop/pack_17_benches_and_seating_002.png'
SLATE, SLATE_EAVE = tc.SLATE, tc.SLATE_EAVE
DOOR_M = M(2.3)
CAN_W, CAN_D, CAN_H = M(3.2), M(1.6), M(2.7)
COTE_W, COTE_H = M(1.6), M(2.4)
SIGN_W, SIGN_H, SIGN_UP, POLE_W = M(3.4), M(1.6), M(4.6), M(0.4)


def front():
    w = sp.wall2('cracked', FRONT, PLATE_H)
    door = A(fam.DOOR['wood']); right = door.transpose(Image.FLIP_LEFT_RIGHT)
    glass = A(fam.WIN['b'])
    dx = (FRONT - 2 * door.width) // 2
    for i, d in enumerate((door, right)):
        w.alpha_composite(glass.crop((8, 30, 8 + d.width, 30 + DOOR_M - d.height)), (dx + i * door.width, PLATE_H - DOOR_M))
        w.alpha_composite(d, (dx + i * door.width, PLATE_H - d.height))
    arch = A(ARCH)                                           # (over the doors the canopy stands; no window hides behind it)
    for k, x in enumerate((M(1.3), FRONT - M(1.3) - arch.width)):
        a = arch.transpose(Image.FLIP_LEFT_RIGHT) if k else arch
        w.alpha_composite(a, (x, PLATE_H - M(1.0) - a.height))
    w = tc.edge_light(tc.edge_light(w, 'left', 6, sp.SUN, 0.6), 'right', 8, sp.SHADE, 0.8)
    return sp.outline2(sp.shade_top2(w)), dx + door.width


def canopy():
    """the family's grey-tan deck from above on two of his posts, its shade on the wall laid as light, after"""
    deck = sp.shed_roof2(CAN_W, int(CAN_D * 0.5), SLATE, SLATE_EAVE)
    post = sp.outline2(fam.post(CAN_H))
    return deck, post


def bell_cote():
    """a 1.6 m box of his stone panels on the ridge: his louvred window as the bell opening, the church's cross under
    it, its own measured cap at the cote's own depth"""
    b = sp.wall2('stone', COTE_W, COTE_H)
    lv = A(LOUVRE); b.alpha_composite(lv, ((COTE_W - lv.width) // 2, M(0.2)))
    c = chm.cross(); b.alpha_composite(c, ((COTE_W - c.width) // 2, COTE_H - c.height - M(0.15)))
    b = tc.edge_light(tc.edge_light(b, 'left', 3, sp.SUN, 0.7), 'right', 6, sp.SHADE, 0.8)
    b = sp.outline2(sp.shade_top2(b))
    cap = sp.straight_roof2(COTE_W + 2 * M(0.3), int(fam.ROOF_H * 0.3), A(fam.CLAY))
    return b, cap


def sign():
    """the Strip's chapel sign: a cabinet of his framed steel on one pole, its face blank"""
    t = A(tc.PANEL)
    cab = rm.lay(t, SIGN_W, SIGN_H, crop=tc.cam.SHEET)
    rim = t.crop((4, 0, t.width - 4, 9)); top = rm.lay(rim, SIGN_W, rim.height)
    cab.alpha_composite(top, (0, 0)); cab.alpha_composite(top.transpose(Image.FLIP_TOP_BOTTOM), (0, SIGN_H - rim.height))
    cab = sp.outline2(tc.edge_light(tc.edge_light(cab, 'left', 2, sp.SUN, 0.8), 'right', 10, sp.SHADE, 0.7))
    pole = sp.outline2(tc.edge_light(rm.lay(t, POLE_W, SIGN_UP, crop=(6, 12, 6 + POLE_W, t.height - 4)), 'right', 6, sp.SHADE, 0.7))
    out = Image.new('RGBA', (SIGN_W, SIGN_H + SIGN_UP))
    out.alpha_composite(pole, ((SIGN_W - POLE_W) // 2, SIGN_H - 4))
    out = sp.light(out, np.pad(np.ones((14, SIGN_W)) * 0.8, ((SIGN_H, SIGN_UP - 14), (0, 0))), sp.SHADE)
    out.alpha_composite(cab, (0, 0))
    return out


def chapel():
    fr, door_mid = front()
    ex = pw.EAVE()
    roof = sp.straight_roof2(FRONT + 2 * ex, ROOF_H, A(fam.CLAY))
    cote, cap = bell_cote()
    deck, post = canopy()
    sg = sign()
    XS = 10                                                    # the sign's pole at the left of the chapel
    XF = XS + SIGN_W + M(1.2) + ex
    cote_top = cap.height - 30
    ridge = cote_top + COTE_H - M(0.1)                         # the cote sits on the ridge
    roof_top = ridge - int(ROOF_H * .14)
    wall_top = roof_top + ROOF_H - 26
    base = wall_top + PLATE_H
    sign_top = base - SIGN_UP - SIGN_H
    top_shift = max(0, -sign_top)
    can_x = XF + door_mid - CAN_W // 2
    deck_y = base - CAN_H - deck.height + 8
    # the canopy's shade on the wall under it, as light
    s = np.zeros((PLATE_H, FRONT)); r0 = PLATE_H - CAN_H
    for i in range(int(CAN_H * 0.5)):
        if 0 <= r0 + i < PLATE_H: s[r0 + i, max(0, can_x - XF):can_x - XF + CAN_W] = 0.8 * (1 - i / (CAN_H * 0.5))
    fr = sp.light(fr, s, sp.SHADE)
    fl = sp.outline2(A(FLOWERS))
    parts = [(fr, XF, wall_top, (XF, XF + FRONT, base)),
             (roof, XF - ex, roof_top, None),
             (cote, XF + FRONT // 2 - COTE_W // 2, cote_top, None),
             (cap, XF + FRONT // 2 - cap.width // 2, cote_top - cap.height + 30, None),
             (sg, XS, sign_top, (XS + (SIGN_W - POLE_W) // 2, XS + (SIGN_W + POLE_W) // 2, base)),
             (post, can_x + 6, base - CAN_H, None), (post, can_x + CAN_W - post.width - 6, base - CAN_H, None),
             (deck, can_x, deck_y, None)]
    for k, fx in enumerate((can_x - fl.width - M(0.3), can_x + CAN_W + M(0.3))):
        parts.append((fl if k == 0 else fl.transpose(Image.FLIP_LEFT_RIGHT), fx, base + M(0.4) - fl.height, (fx + 6, fx + fl.width - 6, base + M(0.4))))
    if top_shift:
        parts = [(im, x, y + top_shift, (fp[0], fp[1], fp[2] + top_shift) if fp else None) for im, x, y, fp in parts]
        base += top_shift
    assert DOOR_M >= M(2.1) and A(fam.DOOR['wood']).height < DOOR_M, 'the doors are taller than the person, laid not scaled'
    assert ROOF_H == int(PLATE_H * rm.RATIO), 'the roof takes the measured ratio against one storey'
    assert A(FLOWERS).height == 96, 'the flower box is his piece at 1:1'
    im = sp.never_black(sp.guide_alpha(sp.grounded2(parts)))
    label = ('THE WEDDING CHAPEL  %.0f m: one room of his plaster under the measured tan roof, the bell cote with his cross on the ridge, '
             'two round-topped windows, his plank doors under the canopy, the sign on its pole with no name; the two flower boxes '
             'by the doors in bloom' % ((FRONT + 2 * ex) / rm.PPM))
    return im, (XF + door_mid, base), label


def sheet(cp, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    ch = A('settlement/COOK4_CHURCH_STRAIGHT_ROOF.png')
    ps = Image.open(pw.ASSET).convert('RGBA')
    GAP = 44
    Wd = max(cp.width + 300, ch.width + GAP + ps.width) + 2 * GAP
    Hs = 230 + cp.height + 70 + max(ch.height, ps.height) + 80
    S = Image.new('RGBA', (Wd, Hs), (22, 19, 16, 255)); d = ImageDraw.Draw(S); s = sp.font(17)
    d.text((16, 10), 'ALL AT 1:1.  THE WEDDING CHAPEL, the Strip\'s third of four: one room at the body\'s size (57 px a metre), the roof shaped by '
                     'the numbers read off your pack house #30, your round-topped windows, your plank doors, your cross on the bell cote.', font=s, fill=(230, 220, 200))
    d.text((16, 34), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  '
                     'Light: one sun, upper left.  A placeholder until your moodboard.', font=s, fill=(200, 190, 170))
    d.text((16, 58), 'One wrong thing: the two flower boxes by the doors are in bloom, the only living colour in the valley.  Below: the church and '
                     'the pawn shop at the same scale.', font=s, fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 96)); d.text((30, 198), 'his pack #30', font=s, fill=(200, 190, 170))
    S.alpha_composite(man, (150, 96 + 96 - 107))
    y = 230
    S.alpha_composite(cp, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] - 56, y + foot[1] - 107))
    d.text((GAP + 6, y + cp.height + 10), label, font=s, fill=(230, 220, 200))
    y += cp.height + 70
    rh = max(ch.height, ps.height)
    S.alpha_composite(ch, (GAP, y + rh - ch.height)); d.text((GAP + 6, y + rh + 10), 'the church of round 11', font=s, fill=(200, 190, 170))
    S.alpha_composite(ps, (GAP * 2 + ch.width, y + rh - ps.height)); d.text((GAP * 2 + ch.width + 6, y + rh + 10), 'the pawn shop of round 16', font=s, fill=(200, 190, 170))
    return S, (GAP, 230, cp.width, cp.height)


if __name__ == '__main__':
    cp, foot, label = chapel()
    red = cell_check(cp)
    for r in red: print('CELL CHECK red at', r)
    out = os.environ.get('COOK4_DRAFT')
    if out:
        cp.save(out); print('draft', cp.size, len(red), 'red'); raise SystemExit
    assert not red, 'a red cell: the same detail everywhere with no rest (fix the part, never the ruler)'
    os.makedirs(OUT_DIR, exist_ok=True)
    cp.save(ASSET)
    S, at = sheet(cp, foot, label)
    S.convert('RGB').save(SHEET, lossless=True, method=6)
    print('chapel', cp.size, 'sheet', S.size, 'on the sheet at', at, label)
