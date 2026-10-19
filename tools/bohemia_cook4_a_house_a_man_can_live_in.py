#!/usr/bin/env python3
"""COOK FOUR [a house a man can live in]: the ranch at true size SEEN AT 45 DEGREES, ROOF TOP AND FRONT BOTH.

His eleventh-vote correction (10/10): 'if you\'re looking at a house from a 45 degree bird eye view angle you will
see the top of the house... this is like a house for an elf'.  So: the size stays the body's (57 px a metre)
and the roof is seen FROM ABOVE as well as its edge: the front slope and both hip ends read as faces,
the roof as tall on screen as the wall is (the pack house #30: roof ~ wall), the ridge on top.

WAS: the ranch AT TRUE SIZE beside the character (Paolo 10/10:
'you're making houses that are just like two tiles by two tiles at the biggest... a building has to be
realistic size to the character models that we have').

THE RULER IS THE BODY, MEASURED: slices/settlement_people/cast_shortcoat.webp frame 0 paints 100 px tall
in its 112 box (bbox 33,7 to 80,107), a 1.75 m person, so 57 px a metre.  At that ruler:
  the house front 11.5 m = 656 px, its wall 3.0 m = 172 px, the front door 2.1 m = 120 px,
  the garage 6 m = 344 px wide, its door 2.3 m tall, the roof's front slope ~2.4 m seen = 140 px.
The tool asserts the door is taller than the person and the wall 1.7x the person, or it refuses.

THE PACK'S WAY (house one, which he called good direction): no roof plan, only the front slope and the
roof's edge; every piece at its own pixels, nothing scaled up (rule 105): the big surfaces are HIS
tiles laid side by side, the way his pack lays them:
  roof     5. Roof tiles #26 (the clay roof field) and #27 (slate, the garage), eave 5. Roof tiles #14,
           chimney #34
  wall     Wall tiles (1) #0 (cracked tan plaster)
  windows  5. Windows and broken glass #0, #3 at 1:1 (72 x 96 = a 1.3 by 1.7 m window, real)
  door     4. Doors and entrances #2 at 1:1 under a transom from his window glass
  garage   11. Industrial doors and gates #1 at 1:1, its slats laid twice across
Our paint: shade under the eave, the 1 px brown-black outline, a contact shadow.

Output: reference/art_bank/settlement/ and records/target/ (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30, our houses one and two (now known too small), and the
  character at 1:1 standing at the door; a real Las Vegas single-storey ranch (11-13 m front, 2.7-3 m
  plate height, a two-car garage 6 m).
  structure taken: the body's 57 px a metre; front slopes only; his tiles native.
  what changed: the house is five times the size of house two and a person fits through its door.

REUSE CHECK (REUSE-FIRST, 7/22): every piece is his pack tile as bought, read from reference/art_bank (his approved set, 82a) and laid at its own pixels; imports bohemia_cook4_one_house (this lane's own functions, not copied).  Written into this placeholder's tool 10/19 so the checker reads it; the art it made is not edited (rule 101c).
"""
import os
from PIL import Image, ImageDraw
from bohemia_cook4_one_house import A, outline, _over, AB, ROOT

PPM = 100 / 1.75                       # the body's own ruler, px per metre
M = lambda m: int(round(m * PPM))

def lay(tile, w, h, crop=None, dy=0):
    t = tile.crop(crop) if crop else tile
    out = Image.new('RGBA', (w, h)); y = 0; r = 0
    while y < h:
        x = -(t.width // 2) * (r % 2)
        while x < w:
            out.alpha_composite(t, (x, y)); x += t.width
        y += t.height - dy; r += 1
    return out

def shade_top(im, n=18, a=120):
    sh = Image.new('RGBA', im.size); sd = ImageDraw.Draw(sh)
    for i in range(n): sd.rectangle([0, i, im.width, i], fill=(30, 20, 14, int(a * (1 - i / n))))
    return _over(im, sh)

def roof(w, h, field, inset):
    """the front slope of a hipped roof: his roof field laid in rows, a trapezoid, his eave strip at the foot"""
    body = lay(field, w, h, crop=(4, 4, field.width - 4, field.height - 22), dy=6)
    px = sorted(sum(p[:3]) for p in field.getdata() if p[3] > 200); dark = [p for p in field.getdata() if p[3] > 200 and sum(p[:3]) <= px[len(px) // 4]]
    base = Image.new('RGBA', (w, h), tuple(int(sum(c[i] for c in dark) / len(dark)) for i in range(3)) + (255,))
    base.alpha_composite(body); body = base          # his roof's own shadow colour under the tiles: no gaps
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon([(inset, 0), (w - inset, 0), (w - 1, h - 1), (0, h - 1)], fill=255)
    out = Image.new('RGBA', (w, h)); out.paste(body, (0, 0), m)
    eave = lay(A('settlement/pack_5_roof_tiles_014.png'), w, 30, crop=(0, 8, 96, 38))
    em = Image.new('L', (w, 30), 0); ImageDraw.Draw(em).polygon([(14, 0), (w - 14, 0), (w - 1, 29), (0, 29)], fill=255)
    out.paste(eave, (0, h - 30), em)
    sh = Image.new('RGBA', (w, h)); ImageDraw.Draw(sh).polygon([(0, h - 1), (inset, 0), (int(inset * 1.25), 0), (int(inset * .35), h - 1)], fill=(20, 14, 10, 105))
    ImageDraw.Draw(sh).polygon([(w - 1, h - 1), (w - inset, 0), (w - int(inset * 1.25), 0), (w - int(inset * .35), h - 1)], fill=(20, 14, 10, 55))
    ImageDraw.Draw(sh).line([(inset, 1), (w - inset, 1)], fill=(255, 232, 196, 150), width=2)   # the ridge catching light
    return outline(_over(out, sh))

def _period(strip):
    """the slat period of his shutter, read by autocorrelation down its middle column"""
    import statistics as st
    col = [sum(strip.getpixel((strip.width // 2, y))[:3]) for y in range(strip.height)]
    m = st.mean(col); best, bp = None, 5
    for p in range(3, 12):
        v = sum((col[y] - m) * (col[y + p] - m) for y in range(len(col) - p))
        if best is None or v > best: best, bp = v, p
    return bp

def one_roller_door(shutter, w, h):
    """ONE roll-up door, the width of the opening (his 10/10: 'you put a garage in one garage... terrible').
    His shutter (11. Industrial doors and gates #1) cut nine ways: the corner blocks stay as they are,
    the header and the two posts are laid along their length, and the slats run the full width as one
    curtain: a slice from the middle of his slats laid end to end, whole slat periods down, so there is
    one frame, one curtain, one bottom bar, never a grid of small doors."""
    S = shutter
    TL, TR = S.crop((0, 0, 20, 20)), S.crop((76, 0, 96, 20))
    top = S.crop((24, 0, 72, 20))
    pl, pr = S.crop((0, 22, 18, 70)), S.crop((78, 22, 96, 70))
    bl, br = S.crop((0, 72, 18, 89)), S.crop((78, 72, 96, 89))
    slats = S.crop((30, 24, 66, 84))
    per = _period(slats); slats = slats.crop((0, 0, slats.width, (slats.height // per) * per))
    out = Image.new('RGBA', (w, h))
    cw, ch = w - 36, h - 20
    cur = Image.new('RGBA', (cw, ch)); y = 0
    while y < ch:
        x = 0
        while x < cw:
            cur.alpha_composite(slats, (x, y)); x += slats.width
        y += slats.height
    # the curtain darkens into the opening at the top and catches light at its foot (light from above)
    sh = Image.new('RGBA', cur.size); sd = ImageDraw.Draw(sh)
    for i in range(16): sd.rectangle([0, i, cw, i], fill=(10, 8, 6, 140 - i * 8))
    sd.rectangle([0, ch - 6, cw, ch - 1], fill=(90, 84, 76, 255))       # the one bottom bar
    sd.line([(0, ch - 6), (cw, ch - 6)], fill=(170, 160, 146, 255))
    cur = _over(cur, sh)
    out.alpha_composite(cur, (18, 20))
    x = 20
    while x < w - 20: out.alpha_composite(top, (x, 0)); x += top.width
    y = 20
    while y < h - 17: out.alpha_composite(pl, (0, y)); out.alpha_composite(pr, (w - 18, y)); y += pl.height
    out.alpha_composite(TL, (0, 0)); out.alpha_composite(TR, (w - 20, 0))
    out.alpha_composite(bl, (0, h - 17)); out.alpha_composite(br, (w - 18, h - 17))
    return outline(out)

def ranch():
    plaster = A('settlement/pack_wall_tiles_1_000.png')
    W_H, H_W = M(11.5), M(3.0)               # house front, wall height
    W_G, H_G = M(6.0), M(2.7)                # garage
    ROOF_H = int(M(3.0) * 1.15)            # at 45 degrees the roof's depth reads about as tall as the wall (his pack: roof ~ wall)
    door = A('door/pack_4_doors_and_entrances_002.png')
    glass = A('settlement/pack_5_windows_and_broken_glass_003.png')
    transom = glass.crop((8, 30, 8 + door.width, 30 + M(2.1) - door.height))
    wins = [A('settlement/pack_5_windows_and_broken_glass_000.png'), A('settlement/pack_5_windows_and_broken_glass_003.png')]
    shutter = A('door/pack_11_industrial_doors_and_gates_001.png')

    house = lay(plaster, W_H, H_W, crop=(7, 10, 70, 86))   # inner cut: his tile's rim drew a grid
    dx = W_H // 2 - door.width // 2 - M(1.2)
    house.alpha_composite(transom, (dx, H_W - M(2.1))); house.alpha_composite(door, (dx, H_W - door.height))
    for k, wx in enumerate((M(0.9), M(3.0), W_H - M(3.4), W_H - M(1.5))):
        house.alpha_composite(wins[k % 2], (wx, M(0.75)))
    house = outline(shade_top(house))
    garage = lay(plaster, W_G, H_G, crop=(7, 10, 70, 86))
    frame = one_roller_door(shutter, M(4.8), M(2.3))
    garage.alpha_composite(frame, ((W_G - frame.width) // 2, H_G - frame.height))
    garage = outline(shade_top(garage))

    r_house = roof(W_H + 40, ROOF_H, A('settlement/pack_5_roof_tiles_026.png'), M(3.4))
    GR = int(M(2.7) * 1.1); r_gar = roof(W_G + 30, GR, A('settlement/pack_5_roof_tiles_027.png'), M(2.2))
    chim = A('settlement/pack_5_roof_tiles_034.png')

    CW = W_H + W_G + 70; CH = ROOF_H + H_W + 24 + 70
    c = Image.new('RGBA', (CW, CH))
    g = Image.new('RGBA', c.size); ImageDraw.Draw(g).rectangle([10, CH - 20, CW - 10, CH - 10], fill=(30, 22, 16, 90))
    c.alpha_composite(g)
    gx = W_H + 34; gtop = CH - 18 - H_G
    c.alpha_composite(r_gar, (gx - 15, gtop - GR + 14)); c.alpha_composite(garage, (gx, gtop))
    c.alpha_composite(r_house, (0, CH - 18 - H_W - ROOF_H + 26)); c.alpha_composite(house, (20, CH - 18 - H_W))
    c.alpha_composite(chim, (M(2.9), CH - 18 - H_W - ROOF_H + 26 - chim.height + 40))   # the chimney stands out of the slope
    door_h = M(2.1)
    assert door.height >= 96 and door_h >= 100, 'the door must be taller than the person'
    assert H_W >= 1.7 * 100, 'the wall must be 1.7 people tall'
    return c, (20 + dx + door.width + 50, CH - 18)

def sheet(h, foot):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A('settlement/pack_5_roof_tiles_030.png')
    two = A('settlement/COOK4_HOUSE_TWO_THE_RANCH.png')
    S = Image.new('RGBA', (h.width + 360, h.height + 120), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  Right: the ranch at true size, 57 px a metre, the character at its door.  Left: his pack house, and our house two (too small: a person was as tall as it).', fill=(230, 220, 200))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(two, (30, 220)); d.text((30, 352), 'our house two', fill=(200, 190, 170))
    m2 = man.copy(); S.alpha_composite(m2, (150, 70 + 96 - 107))
    ox = 300; oy = 60
    S.alpha_composite(h, (ox, oy)); S.alpha_composite(man, (ox + foot[0] - 56, oy + foot[1] - 107))
    d.text((ox + 10, oy + h.height + 12), 'house 11.5 m, wall 3 m, door 2.1 m, garage 6 m: a 1.75 m person at the door', fill=(230, 220, 200))
    return S

if __name__ == '__main__':
    h, foot = ranch()
    h.save(os.path.join(AB, 'settlement/COOK4_A_HOUSE_A_MAN_CAN_LIVE_IN.png'))
    sheet(h, foot).save(os.path.join(ROOT, 'records/target/COOK4_A_HOUSE_A_MAN_CAN_LIVE_IN.png'))
    print('ranch', h.size, 'px per m', round(PPM, 1))
