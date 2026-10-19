#!/usr/bin/env python3
"""COOK FOUR [the Strip's row], round 18 (10/19, rule 101d: one asset a round): THE MOTEL SIGN TOWER, OF HIS STEEL.

The row: 'the Strip's next four, one per round in the same recipe (a second casino, a pawn shop, a wedding chapel,
a motel sign tower)'.  The tower casino, the pawn shop and the wedding chapel are in; this is the last of the four.

THE THING: the Las Vegas motel pylon of 1950 to 1965, the Strip's and Fremont's road signs (the Blue Angel, the Normandie,
the Desert Rose): a tall steel sign on two legs at the road, taller than the motel it names, a vertical blade for the
name, an arrow on top pointing drivers in, a small box under the blade for VACANCY.  At the body's 57 px a metre:
  the legs      two posts of his framed steel panel (Wall tiles 1 #13) cut narrow, 0.35 m, 2.2 m apart, 9 m tall;
  the blade     a 2 by 5 m cabinet of his steel plate (#10) between 4 and 9 m, rimmed top and foot with his panel's own
                rim, its edges turned to the light, its face blank: the packs hold no lettering, the name is his;
  the arrow     on top, a 5.5 by 1.2 m cabinet of the same plate, its point cut from his plate by a mask (nothing drawn),
                its tail over the blade;
  the box       under the blade at 3 m, a 2.4 by 0.8 m box of the plain half of his framed panel, blank: VACANCY, unlit.
  Nothing glows (the look bible's CRASHBOX line: nothing glows; never a filter): no bulb, no neon, no light from inside.
ANALOG HORROR, ONE WRONG THING, from the world's state: THE ARROW POINTS AWAY.  Every motel sign's arrow points drivers
in at the motel's door; this one, beside the motel, points the other way, out at the desert.  Nothing is painted for it.
HOW THE PACK DID IT and THE SECOND PASS (his YES, DIRECTION's card PASS): his pieces at 1:1, one sun from the upper left,
the guide's shadow (black, at most 42 percent) and nothing black inside.  NO LITERAL PIXEL (rule 108, ART PIPE A2): every
shade is a light on his own pixels, the arrow's point a mask over his plate.  The tool runs the not-vibe-coded ruler on
every 96 px cell before it saves (the church's CELL CHECK).

  steel   Wall tiles (1) #13 (framed steel panel) on the legs, the rims and the box; #10 (steel plate) on the blade and the
          arrow

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the man at 1:1 at its foot, the round-7 motel beside
  it at the same scale (the sign stands at the motel's road end), and the real thing: the Las Vegas motel pylons of the
  1950s and 60s (the Blue Angel Motel on Fremont, 1957; the Normandie; the Desert Rose): a blade, an arrow, VACANCY.
  structure taken: the body's 57 px a metre; his tiles native; the second pass's light.
  what changed: the family's first thing that is not a building, and the only arrow in the valley, pointing out.
REUSE CHECK (REUSE-FIRST, 7/22): the light and shadow are the second pass's functions (tools/bohemia_cook4_the_second_pass.py),
the cabinets the tower casino's way (tools/bohemia_cook4_the_tower_casino.py, edge_light), the cell check the church's;
every surface is his pack tile in reference/art_bank at its own pixels.  New here: the pylon, the arrow's mask, the sheet.

Output (a cook folder, PLUMBER's art-fence note 10/19): reference/art_pipe/cook4/strip/COOK4_THE_MOTEL_SIGN_TOWER.png and the
sheet records/target/COOK4_THE_MOTEL_SIGN_TOWER.webp (rule 100: never slices/ or engine/).  Native pixel size: his 96 px
pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: one sun,
upper left.

    python3 tools/bohemia_cook4_the_motel_sign_tower.py          (under a minute)
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_cook4_the_second_pass as sp
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_casino as cam
import bohemia_cook4_the_tower_casino as tc
from bohemia_cook4_the_church import cell_check

ROOT, AB, A, M = sp.ROOT, sp.AB, sp.A, rm.M
OUT_DIR = tc.OUT_DIR
ASSET = os.path.join(OUT_DIR, 'COOK4_THE_MOTEL_SIGN_TOWER.png')
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_MOTEL_SIGN_TOWER.webp')
LEG_W, LEG_GAP, LEG_H = M(0.35), M(2.2), M(9.0)
BLADE_W, BLADE_H, BLADE_FOOT = M(2.0), M(5.0), M(4.0)
ARROW_L, ARROW_H, HEAD = M(5.5), M(1.2), M(1.4)
BOX_W, BOX_H, BOX_UP = M(2.4), M(0.8), M(3.0)


def cabinet(w, h, tile, crop):
    """a steel cabinet: his steel laid to the size, his panel's rim at the top and the foot, the left edge in the sun,
    the right turned from it, the top in the eave's cool"""
    c = rm.lay(A(tile), w, h, crop=crop)
    rim_src = A(tc.PANEL); rim = rim_src.crop((4, 0, rim_src.width - 4, 9))
    top = rm.lay(rim, w, rim.height)
    c.alpha_composite(top, (0, 0)); c.alpha_composite(top.transpose(Image.FLIP_TOP_BOTTOM), (0, h - rim.height))
    c = tc.edge_light(tc.edge_light(c, 'left', 3, sp.SUN, 0.8), 'right', 10, sp.SHADE, 0.75)
    return c


def arrow():
    """the arrow on top: his plate laid, its point cut by a mask (a triangle of his own pixels, nothing drawn), pointing
    right: away from the motel"""
    body = cabinet(ARROW_L, ARROW_H, cam.PLATE, (6, 20, 70, 76))
    a = np.asarray(body).copy()
    H, W = a.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    tip = W - 1; start = W - HEAD
    half = (H - 1) / 2
    inside = (xx < start) | ((tip - xx) >= (np.abs(yy - half) / half) * (tip - start))
    a[..., 3] = np.where(inside, a[..., 3], 0)
    return sp.outline2(Image.fromarray(a, 'RGBA'))


def sign_tower():
    t = A(tc.PANEL)
    leg = rm.lay(t, LEG_W, LEG_H, crop=(6, 12, 6 + LEG_W, t.height - 4))
    leg = sp.outline2(tc.edge_light(tc.edge_light(leg, 'left', 2, sp.SUN, 0.8), 'right', 5, sp.SHADE, 0.8))
    blade = sp.outline2(sp.shade_top2(cabinet(BLADE_W, BLADE_H, cam.PLATE, (6, 20, 70, 76))))
    box = sp.outline2(cabinet(BOX_W, BOX_H, tc.PANEL, cam.SHEET))
    ar = arrow()
    pad = 10
    X0 = pad + M(1.2)                                         # the arrow's tail reaches a little past the left leg
    ground = ARROW_H + LEG_H + M(0.4)                          # the legs' foot
    leg_xs = (X0, X0 + LEG_GAP)
    mid = X0 + (LEG_GAP + LEG_W) // 2
    blade_x = mid - BLADE_W // 2
    blade_y = ground - BLADE_FOOT - BLADE_H
    box_x = mid - BOX_W // 2
    box_y = ground - BOX_UP - BOX_H
    ar_x = blade_x - M(0.6)
    ar_y = blade_y - ARROW_H + 6
    # the blade's and the box's shade on the legs behind them, as light
    lg = []
    for lx in leg_xs:
        s = np.zeros((leg.height, leg.width))
        for (top, hh) in ((blade_y + BLADE_H - (ground - LEG_H), 18), (box_y + BOX_H - (ground - LEG_H), 12)):
            s[max(0, top):max(0, top) + hh] = 0.8
        lg.append(sp.light(leg, s, sp.SHADE))
    parts = [(lg[0], leg_xs[0], ground - LEG_H, (leg_xs[0], leg_xs[0] + LEG_W, ground)),
             (lg[1], leg_xs[1], ground - LEG_H, (leg_xs[1], leg_xs[1] + LEG_W, ground)),
             (box, box_x, box_y, None),
             (blade, blade_x, blade_y, None),
             (ar, ar_x, ar_y, None)]
    shift = -min(y for im, x, y, fp in parts) + pad
    parts = [(im, x, y + shift, (fp[0], fp[1], fp[2] + shift) if fp else None) for im, x, y, fp in parts]
    assert LEG_H + ARROW_H > M(9.5), 'the sign stands taller than a two-storey motel'
    assert BOX_UP > M(2.2), 'the box hangs clear over a man'
    im = sp.never_black(sp.guide_alpha(sp.grounded2(parts)))
    label = ('THE MOTEL SIGN TOWER  %.1f m tall: two legs of his framed steel, a 2 by 5 m blade and a box under it, both blank, '
             'nothing lit; the arrow on top points away from the motel, out at the desert' % ((ground - ar_y + 0.0) / rm.PPM))
    return im, (mid, ground + shift), label


def sheet(sg, foot, label):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    motel = A('settlement/COOK4_MOTEL_STRAIGHT_ROOF.png')
    GAP = 44
    Wd = motel.width + GAP + sg.width + 2 * GAP + 200
    rh = max(motel.height, sg.height)
    Hs = 230 + rh + 80 + sg.height + 80
    S = Image.new('RGBA', (Wd, Hs), (22, 19, 16, 255)); d = ImageDraw.Draw(S); s = sp.font(17)
    d.text((16, 10), 'ALL AT 1:1.  THE MOTEL SIGN TOWER, the Strip\'s last of four: a pylon of your framed steel and steel plate at the body\'s '
                     'size (57 px a metre), a blade, an arrow, a box for VACANCY, all blank, nothing lit.', font=s, fill=(230, 220, 200))
    d.text((16, 34), 'Native pixel size: your 96 px pieces at 1:1.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  '
                     'Light: one sun, upper left.  A placeholder until your moodboard.', font=s, fill=(200, 190, 170))
    d.text((16, 58), 'One wrong thing: beside the motel, the arrow points away from it, out at the desert.  Top: the sign at the motel\'s road end; '
                     'below: the sign alone with the man at its foot.', font=s, fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 96)); d.text((30, 198), 'his pack #30', font=s, fill=(200, 190, 170))
    S.alpha_composite(man, (150, 96 + 96 - 107))
    y = 230
    S.alpha_composite(motel, (GAP, y + rh - motel.height - 14))
    S.alpha_composite(sg, (GAP + motel.width + GAP, y + rh - sg.height))
    d.text((GAP + 6, y + rh + 10), 'the motel of round 7, its sign at its road end', font=s, fill=(200, 190, 170))
    y += rh + 80
    S.alpha_composite(sg, (GAP, y))
    S.alpha_composite(man, (GAP + foot[0] + 50, y + foot[1] - 107))
    d.text((GAP + 6, y + sg.height + 10), label, font=s, fill=(230, 220, 200))
    return S, (GAP, y, sg.width, sg.height)


if __name__ == '__main__':
    sg, foot, label = sign_tower()
    red = cell_check(sg)
    for r in red: print('CELL CHECK red at', r)
    out = os.environ.get('COOK4_DRAFT')
    if out:
        sg.save(out); print('draft', sg.size, len(red), 'red'); raise SystemExit
    assert not red, 'a red cell: the same detail everywhere with no rest (fix the part, never the ruler)'
    os.makedirs(OUT_DIR, exist_ok=True)
    sg.save(ASSET)
    S, at = sheet(sg, foot, label)
    S.convert('RGB').save(SHEET, lossless=True, method=6)
    print('sign tower', sg.size, 'sheet', S.size, 'the pair on the sheet at y 230; the sign alone at', at, label)
