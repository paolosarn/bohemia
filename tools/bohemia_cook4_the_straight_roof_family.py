#!/usr/bin/env python3
"""COOK FOUR [a house a man can live in], round 4, THE BIG SWING (rule 110, 10/16): THE STRAIGHT-ROOF FAMILY.

The coordinator's MODE line: 'five house kinds of the ranch at real size on one sheet beside the pack house,
roofs measured from the pack.  Run it to the end of the round, no check-in, no question.'

FIVE KINDS OF THE LAS VEGAS SINGLE-STOREY RANCH, the real ones a drive down any Paradise or Spring Valley
street shows: (1) THE PLAIN RANCH, a front door and three windows under one roof; (2) THE GARAGE RANCH, the
house and an attached two-car garage with one roll-up door (the one he has seen, rebuilt here from the same
code, its file untouched: a placeholder is never edited, rule 101c); (3) THE CARPORT RANCH, the open carport
on posts that half the valley's 1960s tracts have; (4) THE WING RANCH, the L: a room pushed forward under its
own lower roof; (5) THE PORCH RANCH, a covered entry across the front on posts.

EVERY ROOF IS THE MEASURED ONE: the three ratios tools/bohemia_cook4_the_roof_measured.py reads off his pack
house #30 and roof field #26 every run (roof/wall about 1.49, the eave about 14 percent past each wall, a
lean of about 6 percent, never a triangle), applied at the body's 57 px a metre.  The shed roofs on the
carport and the porch are flat slate seen from above with his slate eave strip at the foot, no ridge.

THE PACK'S WAY (rule 82a, 105, 108): every surface is HIS tile laid at its own pixels, nothing scaled; a part
that exists once (a door, a window, a chimney, a sign) is laid once at 1:1.  Our paint is weather, wear and
light only: the shade under an eave, the dark band under a porch roof, the one-pixel outline, a contact
shadow and a soft cast shadow so the house sits on the ground (DIRECTION's note: 'no shadow, the houses
float').  Analog horror, one wrong thing per house from the world's state: a boarded window, a KEEP OUT
sign wired to a fence, a chimney with no smoke.
  roof fields   5. Roof tiles #26 (clay), #27 (slate); eave strips #14 (clay), #15 (slate); chimney #34
  walls         Wall tiles (1) #0 (cracked tan plaster), #7 (flat tan render), #5 (light stone)
  windows       5. Windows and broken glass #0, #3 (glass), #6 (boarded)
  doors         4. Doors and entrances #2, #7, #8; the garage's 11. Industrial doors and gates #1
  posts         7. Fences and palisades #2, its left post cut out and laid up to height
  yard          13. Fences and wire #0 (chain link) and #6 (KEEP OUT)

Output: reference/art_bank/settlement/COOK4_RANCH_*.png (one file a kind) and the sheet
records/target/COOK4_THE_STRAIGHT_ROOF_FAMILY.png (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet, the character at 1:1 at every door, and
  the real thing: the Las Vegas single-storey ranch tract (1955-1975: 9 to 13 m fronts, 2.7 to 3 m plates,
  attached two-car garages of 6 m, open carports of 3.5 m, L-plans with a forward bedroom wing, covered
  entries on 100 by 100 posts).
  structure taken: the body's 57 px a metre; the roof ratios read from his pack; his tiles native.
  what changed: five massings where there was one, so a street is never one house copied nine times
  (DIRECTION's 10/10 note), and each sits on a shadow.
"""
import os
from PIL import Image, ImageDraw, ImageFilter
from bohemia_cook4_one_house import A, outline, _over, AB, ROOT
from bohemia_cook4_the_roof_measured import (lay, shade_top, straight_roof, one_roller_door,
                                             M, PPM, RATIO, EAVE, LEAN)

WALL_H = M(3.0)                                   # the plate height, 3 m
ROOF_H = int(WALL_H * RATIO)                      # the roof reads 1.49 walls tall at 45 degrees (measured)
CLAY, SLATE = 'settlement/pack_5_roof_tiles_026.png', 'settlement/pack_5_roof_tiles_027.png'
PLASTER = {'cracked': 'settlement/pack_wall_tiles_1_000.png',
           'flat': 'settlement/pack_wall_tiles_1_007.png',
           'stone': 'settlement/pack_wall_tiles_1_005.png'}
WIN = {'a': 'settlement/pack_5_windows_and_broken_glass_000.png',
       'b': 'settlement/pack_5_windows_and_broken_glass_003.png',
       'boarded': 'settlement/pack_5_windows_and_broken_glass_006.png'}
DOOR = {'boarded': 'door/pack_4_doors_and_entrances_002.png',
        'wood': 'door/pack_4_doors_and_entrances_007.png',
        'marked': 'door/pack_4_doors_and_entrances_008.png'}


def wall(kind, w, h=WALL_H):
    """his plaster laid to the wall's size; the tile's rim is cut so it does not draw a grid"""
    t = A(PLASTER[kind]); return lay(t, w, h, crop=(7, 10, t.width - 7, t.height - 10))


def door_at(wall_im, door_key, x):
    """a 2.1 m doorway: his door at 1:1 under a transom of his window glass"""
    door = A(DOOR[door_key]); glass = A(WIN['b'])
    top = M(2.1)
    transom = glass.crop((8, 30, 8 + door.width, 30 + top - door.height))
    wall_im.alpha_composite(transom, (x, wall_im.height - top))
    wall_im.alpha_composite(door, (x, wall_im.height - door.height))
    return x + door.width


def windows(wall_im, xs, keys):
    for x, k in zip(xs, keys): wall_im.alpha_composite(A(WIN[k]), (x, M(0.75)))


def shed_roof(w, h, field, eave):
    """a flat slate roof seen from above: his field laid as a rectangle, his eave strip at the foot, the far
    edge in shade; no ridge, no triangle (the carport and the porch)"""
    f = A(field)
    body = lay(f, w, h, crop=(4, 4, f.width - 4, f.height - 22), dy=6)
    e = A(eave); strip = lay(e, w, 26, crop=(0, 8, 96, 34))
    body.alpha_composite(strip, (0, h - 26))
    sh = Image.new('RGBA', body.size); d = ImageDraw.Draw(sh)
    for i in range(12): d.rectangle([0, i, w, i], fill=(18, 12, 8, 150 - i * 11))
    d.line([(0, 0), (w, 0)], fill=(255, 236, 200, 120), width=2)
    return outline(_over(body, sh))


def post(h):
    """one wooden post from his palisade #2, its left upright cut out and laid up to the height"""
    p = A('settlement/pack_7_fences_and_palisades_002.png').crop((1, 0, 17, 74))
    out = Image.new('RGBA', (p.width, h)); y = h - p.height
    while y > -p.height:
        out.alpha_composite(p, (0, max(y, 0)) if y >= 0 else (0, 0)); y -= p.height - 10
    return out


def chimney(): return A('settlement/pack_5_roof_tiles_034.png')


def fence(n, sign=False):
    """n chain-link panels at 1:1 (96 x 70 px = 1.7 by 1.2 m, a real yard fence), a KEEP OUT sheet wired on"""
    f = A('settlement/pack_13_fences_and_wire_000.png')
    out = Image.new('RGBA', (f.width * n, f.height + 10))
    for i in range(n): out.alpha_composite(f, (i * f.width, 10))
    if sign:
        s = A('settlement/pack_13_fences_and_wire_006.png')
        out.alpha_composite(s, (out.width - s.width - 12, 4))
    return out


def grounded(parts, pad=14):
    """lay the parts on a canvas with a contact shadow and a soft cast shadow to the lower right, so the
    house sits on the ground instead of floating (DIRECTION's note).  parts: (image, x, y, footprint) where
    footprint = (x0, x1, base_y) in canvas space, or None for a part that casts nothing"""
    W = max(x + im.width for im, x, y, fp in parts) + pad
    H = max(y + im.height for im, x, y, fp in parts) + pad + 26
    c = Image.new('RGBA', (W, H))
    sh = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(sh)
    for im, x, y, fp in parts:
        if not fp: continue
        x0, x1, by = fp
        d.rectangle([x0 - 6, by - 4, x1 + 26, by + 12], fill=(20, 14, 10, 150))     # the contact shadow
        d.polygon([(x1, by - WALL_H // 3), (x1 + 44, by + 4), (x1 + 44, by + 16), (x1, by + 16)], fill=(20, 14, 10, 90))
    c.alpha_composite(sh.filter(ImageFilter.GaussianBlur(5)))
    for im, x, y, fp in parts: c.alpha_composite(im, (x, y))
    return c


def house_block(front_m, plaster, door_key, door_m, wins, chim_m=None, roof=CLAY, roof_w_extra=0):
    """a straight-roofed box: the wall with its openings, the measured roof over it; returns (roof, wall,
    eave overhang, door x in the wall)"""
    W = M(front_m)
    w = wall(plaster, W)
    dx = door_at(w, door_key, M(door_m)) - A(DOOR[door_key]).width
    windows(w, [M(m) for m, k in wins], [k for m, k in wins])
    w = outline(shade_top(w))
    r = straight_roof(int((W + roof_w_extra) * (1 + 2 * EAVE)), ROOF_H, A(roof))
    oh = (r.width - W - roof_w_extra) // 2
    return r, w, oh, dx


# ---- the five kinds ------------------------------------------------------------------------------------

def plain_ranch():
    r, w, oh, dx = house_block(10.0, 'cracked', 'wood', 5.6, [(0.8, 'a'), (3.0, 'b'), (8.0, 'a')])
    f = fence(3, sign=True)
    X = oh + 4; top = ROOF_H - 26
    base = top + WALL_H
    parts = [(f, X + w.width - 20, base - f.height + 6, None),
             (w, X, top, (X, X + w.width, base)),
             (r, X - oh, 0, None),
             (chimney(), X + M(7.6), 26, None)]
    return grounded(parts), (X + dx, base), 'THE PLAIN RANCH  10 m front, one door, three windows, a chain-link yard'


def garage_ranch():
    r, w, oh, dx = house_block(11.5, 'cracked', 'boarded', 4.4, [(0.9, 'a'), (3.0, 'b'), (8.1, 'a'), (10.0, 'b')])
    W_G, H_G = M(6.0), M(2.7)
    g = wall('cracked', W_G, H_G)
    frame = one_roller_door(A('door/pack_11_industrial_doors_and_gates_001.png'), M(4.8), M(2.3))
    g.alpha_composite(frame, ((W_G - frame.width) // 2, H_G - frame.height)); g = outline(shade_top(g))
    GR = int(H_G * 1.1); rg = straight_roof(int(W_G * (1 + 2 * EAVE)), GR, A(SLATE)); og = (rg.width - W_G) // 2
    X = oh + 4; top = ROOF_H - 26; base = top + WALL_H
    gx = X + w.width + og + oh + 6; gtop = base - H_G
    parts = [(g, gx, gtop, (gx, gx + W_G, base)), (rg, gx - og, gtop - GR + 14, None),
             (w, X, top, (X, X + w.width, base)), (r, X - oh, 0, None),
             (chimney(), X + M(2.9), 26, None)]
    return grounded(parts), (X + dx, base), 'THE GARAGE RANCH  11.5 m house, a 6 m two-car garage, one roll-up door'


def carport_ranch():
    r, w, oh, dx = house_block(9.5, 'flat', 'marked', 1.0, [(3.2, 'b'), (5.6, 'a'), (7.6, 'boarded')])
    CW, CH = M(3.6), M(2.4)
    roof = shed_roof(int(CW * 1.12), int(CH * 0.55), SLATE, 'settlement/pack_5_roof_tiles_015.png')
    p = post(CH - 10)
    X = oh + 4; top = ROOF_H - 26; base = top + WALL_H
    cx = X + w.width - 2
    under = Image.new('RGBA', (CW, CH)); ImageDraw.Draw(under).rectangle([0, 0, CW, CH // 2], fill=(20, 14, 10, 90))
    parts = [(w, X, top, (X, X + w.width, base)), (r, X - oh, 0, None),
             (under, cx, base - CH, None),
             (p, cx + 6, base - p.height, (cx, cx + CW, base)),
             (p, cx + CW - p.width - 6, base - p.height, None),
             (roof, cx - 8, base - CH - roof.height + 30, None),
             (chimney(), X + M(1.4), 26, None)]
    return grounded(parts), (X + dx, base), 'THE CARPORT RANCH  9.5 m house, an open 3.6 m carport on posts, one window boarded'


def wing_ranch():
    r, w, oh, dx = house_block(9.0, 'stone', 'wood', 1.2, [(3.6, 'a'), (6.2, 'b')])
    WW = M(4.5); FWD = int(M(3.0) * 0.7)                   # the wing stands 3 m forward: lower on the glass at 45 degrees
    ww = wall('stone', WW); windows(ww, [M(0.6), M(2.6)], ['b', 'a']); ww = outline(shade_top(ww))
    WR = int(ROOF_H * 0.72); wr = straight_roof(int(WW * (1 + 2 * EAVE)), WR, A(CLAY)); wo = (wr.width - WW) // 2
    X = oh + 4; top = ROOF_H - 26; base = top + WALL_H
    wx = X + w.width - WW - M(0.3); wtop = top + FWD; wbase = wtop + WALL_H
    parts = [(w, X, top, (X, X + w.width, base)), (r, X - oh, 0, None),
             (chimney(), X + M(1.6), 26, None),
             (ww, wx, wtop, (wx, wx + WW, wbase)), (wr, wx - wo, wtop - WR + 26, None)]
    return grounded(parts), (X + dx, base), 'THE WING RANCH  the L: a 4.5 m room pushed 3 m forward under its own lower roof'


def porch_ranch():
    r, w, oh, dx = house_block(11.0, 'cracked', 'boarded', 3.6, [(0.8, 'b'), (6.6, 'boarded'), (9.0, 'a')])
    PW, PH = M(5.0), M(2.4)
    roof = shed_roof(int(PW * 1.06), int(PH * 0.5), SLATE, 'settlement/pack_5_roof_tiles_015.png')
    p = post(PH - 8)
    X = oh + 4; top = ROOF_H - 26; base = top + WALL_H
    px = X + M(3.0)                                        # the posts clear the windows: 3.0, 5.5 and 8.0 m along the front
    under = Image.new('RGBA', (PW, PH)); ud = ImageDraw.Draw(under)
    for i in range(PH // 2): ud.rectangle([0, i, PW, i], fill=(20, 14, 10, int(120 * (1 - i / (PH / 2)))))
    parts = [(w, X, top, (X, X + w.width, base)), (r, X - oh, 0, None),
             (under, px, base - PH, None),
             (p, px, base - p.height, None), (p, px + PW // 2 - p.width // 2, base - p.height, None),
             (p, px + PW - p.width, base - p.height, None),
             (roof, px - 6, base - PH - roof.height + 28, None),
             (chimney(), X + M(9.4), 26, None)]
    return grounded(parts), (X + dx, base), 'THE PORCH RANCH  11 m, a covered entry across 5 m of the front on three posts'


KINDS = [('plain', plain_ranch), ('garage', garage_ranch), ('carport', carport_ranch),
         ('wing', wing_ranch), ('porch', porch_ranch)]


def sheet(houses):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    GAP = 40
    rows = [[0, 1], [2, 3], [4]]
    rw = max(sum(houses[i][0].width for i in row) + GAP * (len(row) + 1) for row in rows)
    rh = [max(houses[i][0].height for i in row) + 44 for row in rows]
    W = max(rw, 1700); H = 230 + sum(rh)
    S = Image.new('RGBA', (W, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE STRAIGHT-ROOF FAMILY: five kinds of the Las Vegas ranch at the body\'s size (57 px a metre), every roof shaped by the numbers read off your pack house #30 (roof %.2fx the wall, eaves %d%% past each wall, a %d%% lean, no triangles).' % (RATIO, round(EAVE * 100), round(LEAN * 100)), fill=(230, 220, 200))
    d.text((16, 28), 'Top left: your pack house and the 1.75 m man at 1:1.  The same man stands at every door.  A placeholder until your moodboard.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 60)); d.text((30, 162), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 60 + 96 - 107))
    y = 200
    for row, h in zip(rows, rh):
        x = GAP
        for i in row:
            im, foot, label = houses[i]
            S.alpha_composite(im, (x, y + h - 44 - im.height))
            S.alpha_composite(man, (x + foot[0] + A(DOOR['wood']).width + 44 - 56, y + h - 44 - im.height + foot[1] - 107))
            d.text((x + 6, y + h - 36), '%d  %s' % (i + 1, label), fill=(230, 220, 200))
            x += im.width + GAP
        y += h
    return S


if __name__ == '__main__':
    out = []
    for name, fn in KINDS:
        im, foot, label = fn()
        im.save(os.path.join(AB, 'settlement/COOK4_RANCH_%s.png' % name.upper()))
        assert foot[1] - (ROOF_H - 26) == WALL_H and WALL_H >= 170, 'the wall must be 1.7 people tall'
        out.append((im, foot, label)); print(name, im.size)
    S = sheet(out)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_STRAIGHT_ROOF_FAMILY.png'))
    print('sheet', S.size, 'roof/wall %.2f eave %.3f lean %.3f' % (RATIO, EAVE, LEAN))
