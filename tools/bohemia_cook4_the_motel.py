#!/usr/bin/env python3
"""COOK FOUR [one at a time], asset: THE MOTEL, at true size, at 45 degrees.

A third kind of building (his 'you fell in love with the roof... you're not doing anything else'): the
one-storey Las Vegas motor lodge, six rooms in a row and the office at the end, the kind that lines
Fremont and the Boulder Highway.  Its flat roof is seen from above (45 degrees sees the top).

THE RULER IS THE BODY: 57 px a metre, the character at a room door at 1:1.
  a room 3.6 m wide = 206 px, the row of six 21.6 m, the office 4.5 m, the wall 2.9 m = 166 px,
  the roof's top seen at 45 degrees ~2.6 m = 148 px, each door 2.1 m (his door + a transom of his glass).
A ROOM EXISTS SIX TIMES, SO ITS DOOR IS DRAWN SIX TIMES; a part that exists once is drawn once (his
10/11 garage note): one office door, one office window, one roll-down on the office's back store.
EVERY PIECE IS HIS: Wall tiles (1) #0 plaster, 1. Cracked contrete tiles (the roof top), 4. Doors and
entrances #2 #3 #7 (the room doors, varied as a real motel's are after years of repairs), 5. Windows and
broken glass #0 #3 #19 #20, 11. Industrial doors and gates #1 (one roll-down), 8. Market Stalls #3's canopy
(the office awning).  Nothing drawn rectangle by rectangle (rule 108).

Output: reference/art_bank/settlement/ and records/target/ (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 (top to face), our corner shop at the same scale, and a
  real Las Vegas 1950s motor court (one storey, a long flat roof, a door and a window per room, the office
  at the street end).
  structure taken: 57 px a metre; top and face; repeats only where the real thing repeats.
  what changed: the first long, low building; the rhythm of six rooms.

REUSE CHECK (REUSE-FIRST, 7/22): every piece is his pack tile as bought, read from reference/art_bank (his approved set, 82a) and laid at its own pixels; imports bohemia_cook4_house_true_size, bohemia_cook4_one_house (this lane's own functions, not copied).  Written into this placeholder's tool 10/19 so the checker reads it; the art it made is not edited (rule 101c).
"""
import os, glob, random
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import A, outline, _over, AB, ROOT
from bohemia_cook4_house_true_size import M, lay, shade_top, one_roller_door

def motel():
    rng = random.Random('motel')
    plaster = A('settlement/pack_wall_tiles_1_000.png')
    conc = Image.open(sorted(glob.glob(os.path.join(AB, '*/pack_1_cracked_contrete_tiles_001.png')))[0]).convert('RGBA')
    ROOM, N, OFF = M(3.6), 6, M(4.5)
    W, H, TOP, PAR = ROOM * N + OFF, M(2.9), int(M(2.9) * .9), 14
    face = lay(plaster, W, H, crop=(7, 10, 70, 86))
    glass = A('settlement/pack_5_windows_and_broken_glass_003.png')
    doors = [A('door/pack_4_doors_and_entrances_%03d.png' % i) for i in (2, 3, 7)]
    wins = [A('settlement/pack_5_windows_and_broken_glass_%03d.png' % i) for i in (0, 3, 19, 20)]
    foot = None
    for k in range(N):
        x0 = OFF + k * ROOM
        dr = doors[rng.randrange(3)]; tr = glass.crop((8, 30, 8 + dr.width, 30 + M(2.1) - dr.height))
        dx = x0 + M(0.5)
        face.alpha_composite(tr, (dx, H - M(2.1))); face.alpha_composite(dr, (dx, H - dr.height))
        w = wins[rng.randrange(4)]; face.alpha_composite(w, (x0 + ROOM - w.width - M(0.5), M(0.55)))
        if k == 2: foot = (dx + dr.width + 40, None)
        # a room's party wall shows as the plaster's seam in shade
        sd = Image.new('RGBA', face.size); ImageDraw.Draw(sd).rectangle([x0 - 2, 0, x0 + 1, H], fill=(30, 20, 14, 90)); face = _over(face, sd)
    # the office at the street end: one door, one big window, its awning
    od = doors[0]; face.alpha_composite(glass.crop((8, 30, 8 + od.width, 30 + M(2.1) - od.height)), (M(2.8), H - M(2.1))); face.alpha_composite(od, (M(2.8), H - od.height))
    face.alpha_composite(wins[1], (M(0.4), H - M(0.6) - wins[1].height))
    can = A('settlement/pack_8_market_stalls_003.png').crop((4, 0, 92, 28))
    face.alpha_composite(lay(can, M(4.0), 28), (M(0.25), H - M(2.6)))
    face = outline(shade_top(face, n=12, a=110))
    top = lay(conc.crop((4, 4, conc.width - 4, conc.height - 4)), W, TOP)
    dk = Image.new('RGBA', top.size); dd = ImageDraw.Draw(dk); dd.rectangle([0, 0, W, TOP], fill=(24, 20, 18, 70))
    for i in range(18): dd.rectangle([0, TOP - PAR - 18 + i, W, TOP - PAR - 18 + i], fill=(16, 12, 10, 8 * i))
    top = _over(top, dk)
    top.alpha_composite(lay(plaster.crop((0, 4, 77, 4 + PAR + 8)), W, PAR + 8), (0, TOP - PAR - 8))
    ImageDraw.Draw(top).line([(0, TOP - PAR - 8), (W, TOP - PAR - 8)], fill=(236, 220, 190, 255), width=2)
    top = outline(top)
    c = Image.new('RGBA', (W + 40, TOP + H + 30))
    g = Image.new('RGBA', c.size); ImageDraw.Draw(g).rectangle([6, TOP + H + 4, W + 34, TOP + H + 14], fill=(30, 22, 16, 90))
    c.alpha_composite(g); c.alpha_composite(top, (20, 0)); c.alpha_composite(face, (20, TOP))
    assert H >= 1.6 * 100
    return c, (20 + foot[0], TOP + H)

def sheet(h, foot):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    S = Image.new('RGBA', (h.width + 200, h.height + 90), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  The motel: six rooms and the office, 26 m long, one storey, its flat roof seen from above, the character at room 3.  Left: his pack house.', fill=(230, 220, 200))
    S.alpha_composite(twin, (40, 70)); S.alpha_composite(man, (40, 200))
    ox, oy = 170, 50
    S.alpha_composite(h, (ox, oy)); S.alpha_composite(man, (ox + foot[0] - 56, oy + foot[1] - 107))
    return S

if __name__ == '__main__':
    h, foot = motel()
    h.save(os.path.join(AB, 'settlement/COOK4_THE_MOTEL.png'))
    sheet(h, foot).save(os.path.join(ROOT, 'records/target/COOK4_THE_MOTEL.png'))
    print('motel', h.size)
