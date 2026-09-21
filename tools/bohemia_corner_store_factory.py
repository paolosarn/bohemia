#!/usr/bin/env python3
"""BOHEMIA CORNER STORE FACTORY (9/21/26, LIFE + CITY, rule 22 COOK EVERY ROUND).

THE THING: a shop you can walk up to, with its lights still on and every shelf
inside it bare. It is this lane's open row [shelves seen] in a picture -- Paolo's
own words on that row: "a player should be able to WALK INTO A SHOP and see it."
Before you can walk into one and read the shelves, the shop has to look like a shop
from the street, and that is what this is.

ANALOG HORROR AT THE SOURCE, NOT A FILTER (Paolo 9/20, rule 20). The frame is
completely ordinary: a strip of shop bays on a cracked lot, three faded awnings, a
blank pylon sign, dead trees in their kerbed islands. ONE THING IN IT IS WRONG and
it is the only warm light in the valley: THE SHOP IS STILL LIT INSIDE. The glass is
the only bright thing, the light spills a short way onto the walk the way a real
shopfront does, and what it shows you is SEVEN EMPTY SHELF RUNS and a stripped
checkout. A shop that is still open and has nothing in it is worse than a dark one.
No grime layer, no scanline, no monster.

REUSE CHECK: the palette is pulled LIVE out of engine/bohemia_commercial.js (the
commercial district's own canon PALETTE and LEGEND -- store, storefront glass,
storefront walk, the three awning colours, pylon sign, roof plant, stall marking),
so this shop and the district a player actually walks through are the same world and
one source of truth sets both. banks/ holds no shopfront at this read -- the tile
bank is ground pools and the district bank is the 1x1 city hero -- so the geometry
is a fresh cook and nothing is opened from banks/.

REFERENCE CHECK:
  BLDG-03  a pixel building is drawn in three planes with ONE light direction, and
           WINDOWS SIT IN THE WALL, not on it. Held: the sun is upper-left, the roof
           is the lightest plane, and every pane is recessed with a dark head and a
           sill, so the glass reads as a hole in the wall and not a sticker.
  BLDG-05  the structural sanity list: a wall meets a roof, a door is on the ground,
           a street meets a curb. Held: the parapet caps the wall, the doorway runs
           to the walk, the walk meets a kerb, and the kerb meets the lot.
  AH-01    the ordinary frame with one wrong thing; THE LIGHT WAS IN THE ROOM. Held:
           the only light source is behind the glass, it falls off within a few
           pixels of the sill, and nothing else in the picture is lit by it.

DETERMINISTIC: no randomness, no time, no seed. Same bytes every run.

Run from repo root:
  python3 tools/bohemia_corner_store_factory.py
Writes: slices/vote/LIFECITY_THE_SHOP_IS_STILL_LIT_9_21.png
"""
import io
import os
import re
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON = os.path.join(ROOT, 'engine', 'bohemia_commercial.js')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_SHOP_IS_STILL_LIT_9_21.png')

SCALE = 6
W, H = 168, 128


def _pal():
    """READ OUT OF THE DISTRICT, NEVER TYPED HERE. If the commercial district's canon
    changes colour, this shop changes with it. FAILS LOUDLY rather than falling back
    to a guess: a factory that quietly invents its own colours is how two versions of
    one world start to drift."""
    src = io.open(CANON, encoding='utf-8').read()
    m = re.search(r'var PALETTE=\{(.*?)\};', src, re.S)
    if not m:
        sys.exit('REFUSING: no PALETTE in engine/bohemia_commercial.js. '
                 'The shop is drawn in the district\'s colours or not at all.')
    pal = {}
    for k, v in re.findall(r"(\d+)\s*:\s*'(#[0-9a-fA-F]{6})'", m.group(1)):
        pal[int(k)] = v
    need = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    missing = [n for n in need if n not in pal]
    if missing:
        sys.exit('REFUSING: the commercial palette is missing codes %s' % missing)
    return pal


def shade(hexv, f):
    r = int(hexv[1:3], 16), int(hexv[3:5], 16), int(hexv[5:7], 16)
    return tuple(max(0, min(255, int(c * f))) for c in r)


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def main():
    P = _pal()
    ASPHALT = shade(P[1], 1.28)
    STORE = P[2]
    ISLAND = shade(P[4], 1.10)
    AMBER = P[5]
    WALK = shade(P[6], 0.92)
    GLASS = P[7]
    AWN = [P[8], P[9], P[10]]
    TICK = shade(P[11], 0.70)
    POLE = shade(P[12], 0.80)
    PLANT = shade(P[13], 0.80)
    DARK = shade(P[14], 1.0)

    roof = shade(STORE, 1.16)
    wall = shade(STORE, 0.84)
    edge = shade(STORE, 0.42)

    GRAVEL = shade(P[0], 1.95)
    BACK = shade(P[1], 1.10)

    # ---- EVERY PIXEL IS GROUND -----------------------------------------------
    # THE WORLD IS SEEN FROM ABOVE, SO THERE IS NO SKY AND THERE IS NO VOID. The
    # first cut of the battery shed failed on exactly this and so did the first
    # cut of this one: a dark band over the roof reads as a hole in the world, not
    # as air. Behind the store is the service strip a delivery truck backs onto;
    # either side of it is the neighbour's apron. All of it is ground he can walk.
    im = Image.new('RGB', (W, H), ASPHALT)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W - 1, 13], fill=GRAVEL)          # the dry unpaved strip
    for y in range(1, 13, 2):
        for x in range((y * 3) % 5, W, 9):
            d.point((x, y), fill=shade(P[0], 2.45))
    d.rectangle([0, 13, W - 1, 73], fill=BACK)           # the aprons either side
    d.rectangle([0, 13, W - 1, 14], fill=shade(P[1], 1.45))
    for y in range(18, 72, 7):                            # cracks in the apron
        d.line([(2, y), (11, y + 2)], fill=shade(P[1], 1.32))
        d.line([(156, y + 3), (166, y)], fill=shade(P[1], 1.32))
    d.rectangle([2, 40, 12, 56], fill=shade(P[14], 1.45))   # a bin against the wall
    d.rectangle([2, 40, 12, 41], fill=shade(P[14], 2.1))

    # ---- THE LOT OUT FRONT, seen from above ---------------------------------
    d.rectangle([0, 74, W - 1, H - 1], fill=ASPHALT)
    for y in range(76, H, 3):
        for x in range((y * 5) % 7, W, 11):
            d.point((x, y), fill=shade(P[1], 1.45))
    for x in range(10, W, 18):                      # faded stall ticks, most gone
        if x % 36 == 10:
            continue
        d.line([(x, 96), (x, 110)], fill=TICK)
    d.rectangle([0, 74, W - 1, 75], fill=shade(P[1], 1.6))   # the kerb line
    for cx in (28, 108):                             # kerbed landscape islands
        d.rectangle([cx - 9, 87, cx + 9, 101], fill=shade(P[1], 1.62))   # the kerb
        d.rectangle([cx - 8, 88, cx + 8, 100], fill=ISLAND)
        d.rectangle([cx - 8, 88, cx + 8, 89], fill=shade(P[4], 1.35))
        d.line([(cx, 100), (cx, 88)], fill=shade(P[0], 1.9))
        d.line([(cx, 92), (cx - 4, 86)], fill=shade(P[0], 1.9))
        d.line([(cx, 90), (cx + 5, 85)], fill=shade(P[0], 1.9))
        d.line([(cx + 10, 88), (cx + 10, 101)], fill=shade(P[1], 0.80))  # its shadow
        d.line([(cx - 9, 102), (cx + 10, 102)], fill=shade(P[1], 0.80))

    # ---- THE STORE: roof first, the footprint from above --------------------
    d.rectangle([14, 8, 154, 52], fill=roof)
    for y in range(10, 52, 6):
        d.line([(15, y), (153, y)], fill=shade(STORE, 1.06))
    d.rectangle([14, 8, 154, 9], fill=shade(STORE, 1.30))
    for bx in (40, 88, 122):                          # rooftop plant, stripped
        d.rectangle([bx, 16, bx + 16, 28], fill=PLANT)
        d.rectangle([bx, 16, bx + 16, 17], fill=shade(P[13], 1.25))
        d.line([(bx + 3, 20), (bx + 13, 20)], fill=shade(P[13], 0.62))
        d.line([(bx + 3, 24), (bx + 13, 24)], fill=shade(P[13], 0.62))
    d.rectangle([14, 50, 154, 52], fill=shade(STORE, 0.96))   # the parapet

    # ---- THE FRONT WALL: the one plane you see, and the glazing line in it ---
    d.rectangle([14, 52, 154, 70], fill=wall)
    d.rectangle([14, 52, 154, 53], fill=shade(STORE, 1.02))
    d.rectangle([14, 69, 154, 70], fill=edge)         # where wall meets the walk

    # the three bays. BAY 2 IS THE ONE THAT IS LIT.
    bays = [(20, 58), (68, 58), (116, 38)]
    lit = 1
    for i, (bx, bw) in enumerate(bays):
        gx0, gx1 = bx, bx + bw
        # the pane, RECESSED: dark head, dark reveals, a sill (BLDG-03)
        d.rectangle([gx0, 56, gx1, 68], fill=shade(GLASS, 0.70))
        d.rectangle([gx0, 56, gx1, 57], fill=edge)
        d.rectangle([gx0, 56, gx0 + 1, 68], fill=edge)
        d.rectangle([gx1 - 1, 56, gx1, 68], fill=edge)
        d.rectangle([gx0, 68, gx1, 69], fill=shade(STORE, 1.08))
        if i != lit:
            # dark and mostly out: one cracked pane, the rest boarded behind
            d.line([(gx0 + 6, 58), (gx0 + 20, 67)], fill=shade(GLASS, 1.35))
            d.line([(gx0 + 24, 57), (gx0 + 14, 68)], fill=shade(GLASS, 1.2))
            for sy in (60, 64):
                d.line([(gx0 + 3, sy), (gx1 - 3, sy)], fill=shade(GLASS, 0.5))

    # ---- *** THE ONE WRONG THING: BAY 2 IS LIT, AND THE SHELVES ARE BARE ***
    # AH-01: the light was in the room. The only source is behind this glass, it
    # falls off within a few pixels of the sill, and it lights nothing else.
    bx, bw = bays[lit]
    GLOW = (255, 236, 190)
    BASE = shade(GLASS, 0.9)
    # THE LIGHT IS IN THE ROOM AND IT FALLS OFF (AH-01). The first cut filled the
    # bay with one flat bright colour, and a flat fill is a white card taped to a
    # wall, not a lit room. The source is the ceiling, so it is brightest at the
    # head of the glass and dimmest at the floor.
    for yy in range(57, 69):
        t = max(0.12, 0.56 - (yy - 57) * 0.032)
        d.line([(bx + 2, yy), (bx + bw - 2, yy)], fill=mix(BASE, GLOW, t))
    INSIDE = mix(BASE, GLOW, 0.34)
    for tx in (bx + 8, bx + 30):                 # the two tubes still burning
        d.rectangle([tx, 58, tx + 13, 58], fill=(255, 248, 220))
    # SEVEN EMPTY SHELF RUNS, seen end-on through the glass: uprights and rails,
    # nothing on any of them. Dark against the light, the way a lit shop reads.
    for k in range(7):
        sx = bx + 6 + k * 7
        d.line([(sx, 60), (sx, 67)], fill=mix(INSIDE, DARK, 0.72))
        for ry in (62, 64, 66):
            d.line([(sx, ry), (sx + 5, ry)], fill=mix(INSIDE, DARK, 0.46))
    # the checkout, stripped down to its base
    d.rectangle([bx + bw - 14, 64, bx + bw - 4, 67], fill=mix(INSIDE, DARK, 0.62))
    # the mullions, in front of all of it
    for mxx in (bx + 19, bx + 38):
        d.line([(mxx, 57), (mxx, 68)], fill=edge)
    # and the spill on the walk: short, and only under this bay
    for j, a in enumerate((0.34, 0.22, 0.12, 0.06)):
        d.rectangle([bx + 2, 70 + j, bx + bw - 2, 70 + j],
                    fill=mix(WALK, (255, 232, 180), a))

    # ---- the covered walk along the shopfronts, then the kerb ---------------
    d.rectangle([14, 70, 154, 74], fill=WALK)
    for x in range(18, 154, 12):
        d.line([(x, 70), (x, 74)], fill=shade(P[6], 0.80))
    # glass underfoot, which the legend asks for by name
    for gx, gy in ((32, 72), (50, 73), (96, 72), (140, 73), (78, 74)):
        d.point((gx, gy), fill=shade(P[7], 1.5))

    # ---- the three awnings, faded, one torn away at the end -----------------
    for i, (bx2, bw2) in enumerate(bays):
        col = shade(AWN[i], 0.80)
        if i == 2:
            d.rectangle([bx2, 53, bx2 + bw2 - 12, 55], fill=col)   # torn end
        else:
            d.rectangle([bx2, 53, bx2 + bw2, 55], fill=col)
        d.rectangle([bx2, 53, bx2 + bw2 - (12 if i == 2 else 0), 53],
                    fill=shade(AWN[i], 1.05))

    # ---- the pylon sign, standing out on the lot, board blank ---------------
    # FROM ABOVE YOU SEE ITS TOP AND ITS SHADOW, and it stands where a pylon sign
    # really stands: out on the lot by the kerb, not clipped off the frame edge.
    d.rectangle([138, 86, 160, 106], fill=shade(P[12], 0.66))
    d.rectangle([138, 86, 160, 87], fill=shade(P[12], 1.15))
    d.rectangle([141, 90, 157, 102], fill=shade(P[0], 1.55))        # the blank board
    d.rectangle([161, 88, 163, 107], fill=shade(P[1], 0.74))        # its shadow
    d.rectangle([140, 107, 163, 108], fill=shade(P[1], 0.74))
    d.rectangle([147, 106, 151, 118], fill=POLE)                    # the post to ground

    # ---- one doorway standing open, dark ------------------------------------
    d.rectangle([96, 58, 108, 70], fill=DARK)
    d.rectangle([96, 58, 108, 59], fill=edge)
    d.rectangle([107, 58, 108, 70], fill=shade(STORE, 0.64))

    # ---- the building's shadow, cast from the one light direction ----------
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).polygon([(154, 8), (160, 12), (160, 78), (154, 74)],
                               fill=(0, 0, 0, 72))
    im = Image.alpha_composite(im.convert('RGBA'), sh).convert('RGB')

    big = im.resize((W * SCALE, H * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    big.save(OUT)
    print('THE SHOP IS STILL LIT')
    print('  palette        : read live from engine/bohemia_commercial.js')
    print('  bays           : 3, one of them lit, %d empty shelf runs behind its glass' % 7)
    print('  the light      : only source is behind the glass, spill 4 px onto the walk')
    print('  wrote          : %s (%d x %d)' % (OUT, W * SCALE, H * SCALE))


if __name__ == '__main__':
    main()
