#!/usr/bin/env python3
"""COOK FOUR [the Strip's row], round 16 (10/19, rule 101d: one asset a round): THE PAWN SHOP, UNDER THE STRAIGHT
ROOF IN THE VALLEY'S TANS.

The row: 'the Strip's next four, one per round in the same recipe (a second casino, a pawn shop, a wedding chapel,
a motel sign tower)'.  The second casino went in last round (the tower); this is the second of the four.

THE BUILDING: the Las Vegas pawn shop, the Strip's and Fremont's oldest kind of storefront after the casino itself:
one storey of stucco, a 14 m front, the display windows barred, a steel door, the name on a fascia box over the
glass.  In this valley the dollar died and the batteries are the money (9/4): the pawn shop is the bank now, where
a man turns what he owns into what the valley spends.  At the body's 57 px a metre:
  the front     14 m of his cracked plaster (Wall tiles 1 #0, the ranches' own wall) to a 3.8 m plate; four of his
                barred windows (5. #20) as the display windows, sills low at 0.6 m, two each side of the door; his
                steel door (4. #9) under a transom of his steel plate (#10) to 2.1 m;
  the sign      a 7 m fascia box over the glass, the plain half of his framed steel panel (#13) rimmed with its own
                rim, its face blank: the packs hold no lettering, and a name in the valley is his to give;
  the roof      the measured straight roof against one storey, his tan field, his caps once along the ridge, his dirt
                in the grooves (the second pass's roof), one of his swamp coolers on it (15. #29, the motel's);
  the queue     in front of the door, his post-and-rail (7. #2) laid as a bank's switchback, three rows of rails 2.2 m
                apart, the gaps at alternate ends: a line for forty people.
ANALOG HORROR, ONE WRONG THING, from the world's state: THE QUEUE IS EMPTY.  Everybody in the valley comes here now,
so somebody built the rails for forty; there is nobody in them, and the door is shut.  Nothing is painted for it.
HOW THE PACK DID IT (rule 100c, records/BOHEMIA_COOK4_HOW_THE_PACK_DID_IT_THE_PLACES_10_10_26.md) and THE SECOND PASS
(his YES 'That's way better holy shit', DIRECTION's card PASS): his pieces at 1:1, front faces never roof plans, every
surface cut to meet itself, the tile's own light out of the wall, one sun from the upper left, the eave's one hard
shadow, the guide's shadow (black, at most 42 percent) and nothing black inside.  NO LITERAL PIXEL (rule 108, ART PIPE
A2): every shade is a light on his own pixels.  The tool runs the not-vibe-coded ruler on every 96 px cell before it
saves and refuses a red cell (the church's CELL CHECK; fix the part, never the ruler).

  roof    the tan field from his clay #26 (round 6), his caps; 15. Street props #29 (the swamp cooler, 1:1)
  walls   Wall tiles (1) #0 (cracked plaster); #13 (framed steel panel) on the sign; #10 (steel plate) as the transom
  glass   5. Windows and broken glass #20 (barred) four times, two mirrored
  door    4. Doors and entrances #9 (steel)
  queue   7. Fences and palisades #2 (post and rail), twelve, flipped by turn

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the man at 1:1 at the door, the round-15 tower
  casino and the round-5 corner shop beside it at the same scale, and the real thing: the Las Vegas pawn shop
  (one-storey stucco storefronts on Fremont Street and Las Vegas Boulevard since the 1950s: barred display glass,
  a steel door, a fascia sign; the bank's rope-and-post queue).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native; the second pass's light.
  what changed: the family's first storefront with its glass behind bars, and a queue for nobody.
REUSE CHECK (REUSE-FIRST, 7/22): the walls, roof, light and shadow are the second pass's functions
(tools/bohemia_cook4_the_second_pass.py), the sign the tower's way without its legs (tools/bohemia_cook4_the_tower_casino.py),
the cell check the church's, the ratios the measured roof's; every surface is his pack tile in reference/art_bank at its
own pixels.  New here: the storefront, the queue's switchback, the layout, the sheet.

Output (a cook folder, PLUMBER's art-fence note 10/19): reference/art_pipe/cook4/strip/COOK4_THE_PAWN_SHOP.png and the
sheet records/target/COOK4_THE_PAWN_SHOP.webp (rule 100: never slices/ or engine/).  Native pixel size: his 96 px pieces
at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: one sun, upper left.

    python3 tools/bohemia_cook4_the_pawn_shop.py          (about a minute)
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_cook4_the_second_pass as sp
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_casino as cam
import bohemia_cook4_the_tower_casino as tc
from bohemia_cook4_the_church import cell_check

ROOT, AB, A, M = sp.ROOT, sp.AB, sp.A, rm.M
OUT_DIR = tc.OUT_DIR
ASSET = os.path.join(OUT_DIR, 'COOK4_THE_PAWN_SHOP.png')
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_PAWN_SHOP.webp')
FRONT, PLATE_H = M(14.0), M(3.8)
ROOF_H = int(PLATE_H * rm.RATIO)                 # the measured roof against one storey (as the casino's hall)
BARRED = 'settlement/pack_5_windows_and_broken_glass_020.png'
POSTRAIL = 'settlement/pack_7_fences_and_palisades_002.png'
COOLER = 'prop/pack_15_street_props_029.png'
SILL = M(0.6)                                    # a display window sits low
SIGN_W, SIGN_H = M(7.0), M(0.9)
DOOR_M = M(2.1)
ROWS, RAILS, ROW_GAP = 3, 4, 2.2                 # the switchback: three rows of four rails, 2.2 m apart (a lane a person walks)


def front():
    """the shop front: his plaster, four barred display windows, the steel door and its transom, the fascia box"""
    w = sp.wall2('cracked', FRONT, PLATE_H)
    door = A(cam.STEEL_DOOR); dx = (FRONT - door.width) // 2
    trans = rm.lay(A(cam.PLATE), door.width, DOOR_M - door.height, crop=(6, 20, 70, 60))
    w.alpha_composite(trans, (dx, PLATE_H - DOOR_M)); w.alpha_composite(door, (dx, PLATE_H - door.height))
    bar = A(BARRED); bw = bar.width
    xs = [dx - M(4.6), dx - M(2.4), dx + door.width + M(2.4) - bw, dx + door.width + M(4.6) - bw]
    for k, x in enumerate(xs):
        b = bar.transpose(Image.FLIP_LEFT_RIGHT) if k % 2 else bar
        w.alpha_composite(b, (x, PLATE_H - SILL - b.height))
    # the fascia box over the glass: the tower's sign, no legs
    t = A(tc.PANEL)
    cab = rm.lay(t, SIGN_W, SIGN_H, crop=cam.SHEET)
    rim = t.crop((4, 0, t.width - 4, 9)); top = rm.lay(rim, SIGN_W, rim.height)
    cab.alpha_composite(top, (0, 0)); cab.alpha_composite(top.transpose(Image.FLIP_TOP_BOTTOM), (0, SIGN_H - rim.height))
    cab = tc.edge_light(tc.edge_light(cab, 'left', 2, sp.SUN, 0.8), 'right', 10, sp.SHADE, 0.7)
    cab = sp.outline2(cab)
    sy = PLATE_H - DOOR_M - SIGN_H - M(0.25)
    shade = np.zeros((PLATE_H, FRONT)); shade[sy + SIGN_H:sy + SIGN_H + M(0.35), (FRONT - SIGN_W) // 2:(FRONT + SIGN_W) // 2] = 0.55
    w = sp.light(w, shade, sp.SHADE)                              # the box's shadow on the wall under it
    w.alpha_composite(cab, ((FRONT - SIGN_W) // 2, sy))
    w = tc.edge_light(tc.edge_light(w, 'left', 6, sp.SUN, 0.6), 'right', 8, sp.SHADE, 0.8)
    return sp.outline2(sp.shade_top2(w)), dx + door.width // 2


def queue(base):
    """the bank's switchback in front of the door: three rows of four of his post-and-rail, the gaps at alternate ends;
    returns the parts (image, x, y, footprint) in the shop's frame"""
    r = A(POSTRAIL); parts = []
    run = RAILS * (r.width - 4)
    x0 = (FRONT - run) // 2 + 10 + EAVE()
    for row in range(ROWS):
        y = base + int(M(1.4 + row * ROW_GAP) * fam.WALL_H / fam.WALL_H * 0.7)   # the family's 0.7 of depth
        gap_left = row % 2 == 1
        for k in range(RAILS):
            if (gap_left and k == 0) or (not gap_left and k == RAILS - 1): continue   # the turn of the line
            im = r.transpose(Image.FLIP_LEFT_RIGHT) if (k + row) % 2 else r
            x = x0 + k * (r.width - 4)
            parts.append((sp.outline2(im), x, y - im.height, (x + 8, x + im.width - 8, y)))
    return parts


def EAVE(): return int(M(10.0) * rm.EAVE)       # the ranch's eave in metres (the motel's way)


def pawn_shop():
    fr, door_mid = front()
    ex = EAVE()
    roof = sp.straight_roof2(FRONT + 2 * ex, ROOF_H, A(fam.CLAY))
    XF = 10 + ex
    roof_top = 0
    wall_top = roof_top + ROOF_H - 26
    base = wall_top + PLATE_H
    cool = A(COOLER)
    parts = [(fr, XF, wall_top, (XF, XF + FRONT, base)),
             (roof, XF - ex, roof_top, None),
             (sp.outline2(cool), XF + M(9.5), roof_top + int(ROOF_H * .28), None)]
    parts += queue(base)
    assert DOOR_M >= M(2.1) and A(cam.STEEL_DOOR).height < DOOR_M, 'the door is taller than the person, laid not scaled'
    assert ROOF_H == int(PLATE_H * rm.RATIO), 'the roof takes the measured ratio against one storey'
    assert A(POSTRAIL).height < 96, 'a rail is his piece at 1:1, about 1.3 m'
    im = sp.never_black(sp.guide_alpha(sp.grounded2(parts)))
    label = ('THE PAWN SHOP  %.0f m: one storey of his plaster under the measured tan roof, four barred display windows, the steel '
             'door, the fascia box with no name, a swamp cooler; in front, the bank\'s switchback for forty people, empty' % ((FRONT + 2 * ex) / rm.PPM))
    return im, (XF + door_mid, base), label


def sheet(ps, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    tw = Image.open(tc.ASSET).convert('RGBA')
    shop = A('settlement/COOK4_CORNER_SHOP_STRAIGHT_ROOF.png')
    GAP = 44
    Wd = max(ps.width + 300, tw.width + GAP + shop.width) + 2 * GAP
    Hs = 230 + ps.height + 70 + max(tw.height, shop.height) + 80
    S = Image.new('RGBA', (Wd, Hs), (22, 19, 16, 255)); d = ImageDraw.Draw(S); s = sp.font(17)
    d.text((16, 10), 'ALL AT 1:1.  THE PAWN SHOP, the Strip\'s second of four: one storey at the body\'s size (57 px a metre), the roof shaped by '
                     'the numbers read off your pack house #30, your barred windows, your steel door, your post-and-rail.', font=s, fill=(230, 220, 200))
    d.text((16, 34), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  '
                     'Light: one sun, upper left.  A placeholder until your moodboard.', font=s, fill=(200, 190, 170))
    d.text((16, 58), 'One wrong thing: a queue for forty people in front of the door, and nobody in it.  Below: the tower casino and the corner '
                     'shop at the same scale.', font=s, fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 96)); d.text((30, 198), 'his pack #30', font=s, fill=(200, 190, 170))
    S.alpha_composite(man, (150, 96 + 96 - 107))
    y = 230
    S.alpha_composite(ps, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + 70, y + foot[1] - 107))
    d.text((GAP + 6, y + ps.height + 10), label, font=s, fill=(230, 220, 200))
    y += ps.height + 70
    rh = max(tw.height, shop.height)
    S.alpha_composite(tw, (GAP, y + rh - tw.height)); d.text((GAP + 6, y + rh + 10), 'the tower casino of round 15', font=s, fill=(200, 190, 170))
    S.alpha_composite(shop, (GAP * 2 + tw.width, y + rh - shop.height)); d.text((GAP * 2 + tw.width + 6, y + rh + 10), 'the corner shop of round 5', font=s, fill=(200, 190, 170))
    return S, (GAP, 230, ps.width, ps.height)


if __name__ == '__main__':
    ps, foot, label = pawn_shop()
    red = cell_check(ps)
    for r in red: print('CELL CHECK red at', r)
    out = os.environ.get('COOK4_DRAFT')
    if out:
        ps.save(out); print('draft', ps.size, len(red), 'red'); raise SystemExit
    assert not red, 'a red cell: the same detail everywhere with no rest (fix the part, never the ruler)'
    os.makedirs(OUT_DIR, exist_ok=True)
    ps.save(ASSET)
    S, at = sheet(ps, foot, label)
    S.convert('RGB').save(SHEET, lossless=True, method=6)
    print('pawn shop', ps.size, 'sheet', S.size, 'on the sheet at', at, label)
