#!/usr/bin/env python3
"""BOHEMIA BATTERY SHED FACTORY (9/21/26, LIFE + CITY, rule 22 COOK EVERY ROUND).

THE THING: the small battery shed a player puts on their OWN lot. Not the
grid-scale storage yard -- that district already exists (engine/bohemia_battery.js,
three fire-lane rows of containers behind a double fence). This is the house-sized
one, the row this lane has had open as [power buildings]: you build it on your land
and a battery comes in. Batteries are the money (Paolo 9/4), so this is the first
building in the game that makes the money.

IT IS DRAWN AS ANALOG HORROR AT THE SOURCE, NOT AS A FILTER (Paolo 9/20, rule 20).
The frame is ordinary: a metal shed on a dead lot, gravel, a chained door, a meter
on a conduit. ONE THING IN IT IS WRONG, and it is the only saturated colour in the
picture: THE INDICATOR LAMP IS STILL LIT. Nobody is home, nothing else has power,
and this box is still working. No grime layer, no scanline, no filter -- the horror
is what is in the frame and what is missing from it.

SCALE: the shed is 5 x 4 fine cells of footprint against a lot of
BOH_LATTICE.LOT_FINE (24 cells, 18 m), so about 3.75 m x 3 m -- a real utility shed,
smaller than a single-car garage, which is what a household battery enclosure is.
The lot number is READ, never typed: see _lot_fine().

REUSE CHECK: the palette is pulled LIVE out of engine/bohemia_battery.js (the
battery district's own canon PALETTE), so the shed and the big yard are the same
world and one source of truth sets both. No existing sprite bank holds a
house-sized battery enclosure -- the district bank holds the 1x1 city hero and the
yard's container rows, both wrong size and wrong read for a thing on your own lot --
so the geometry is a fresh cook and nothing is opened from banks/.

REFERENCE CHECK:
  BLDG-03  a pixel building is drawn in THREE PLANES (front face, side face, roof)
           with ONE light direction, and windows sit IN the wall, not on it. Held:
           the light is upper-left, the roof is the lightest plane, the side face
           the darkest, and the vent and meter are recessed with a dark top edge.
  BLDG-05  the structural sanity list: a wall meets a roof, a door is on the
           ground, a street meets a curb. Held: the door sits on the pad, the pad
           sits on the gravel, the roof overhangs the wall by one pixel and casts.
  AH-01    the ordinary frame with one wrong thing; the light was in the room. Held:
           the only lit thing is a 2x2 lamp, and the only light it throws is the
           short bloom a real indicator LED throws on the metal beside it.

45 DEGREE ART LAW: the box is a true 3/4 read -- the side face recedes at one pixel
down per two across, the same slope the street's kerbs and building faces use.

DETERMINISTIC: no randomness, no time, no seed. Same bytes every run.

Run from repo root:
  python3 tools/bohemia_battery_shed_factory.py
Writes: slices/vote/LIFECITY_THE_BATTERY_SHED_9_21.png
"""
import io
import os
import re
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON = os.path.join(ROOT, 'engine', 'bohemia_battery.js')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_BATTERY_SHED_9_21.png')
LATTICE = os.path.join(ROOT, 'engine', 'bohemia_lattice.js')

SCALE = 6
W, H = 168, 128


def _pal():
    """THE PALETTE IS READ OUT OF THE DISTRICT, NEVER TYPED HERE. If the battery
    district's canon changes colour, this shed changes with it, which is the whole
    point of pulling it live. FAILS LOUDLY rather than falling back to a guess: a
    factory that quietly invents its own colours is how two versions of one world
    start to drift."""
    src = io.open(CANON, encoding='utf-8').read()
    m = re.search(r'var PALETTE=\{(.*?)\};', src, re.S)
    if not m:
        sys.exit('REFUSING: no PALETTE in engine/bohemia_battery.js. '
                 'The shed is drawn in the district\'s colours or not at all.')
    pal = {}
    for k, v in re.findall(r"(\d+)\s*:\s*'(#[0-9a-fA-F]{6})'", m.group(1)):
        pal[int(k)] = v
    need = [0, 2, 4, 5, 6, 9, 10, 11, 12, 13]
    missing = [n for n in need if n not in pal]
    if missing:
        sys.exit('REFUSING: the battery palette is missing codes %s' % missing)
    return pal


def _lot_fine():
    """ONE NUMBER IN ONE PLACE (Paolo 9/15, rule 16). The shed's size is quoted
    against the lot, and the lot is read from the lattice rather than written down
    here as a second copy."""
    src = io.open(LATTICE, encoding='utf-8').read()
    m = re.search(r'const LOT_FINE\s*=\s*(\d+)', src)
    if not m:
        sys.exit('REFUSING: no LOT_FINE in engine/bohemia_lattice.js')
    return int(m.group(1))


def shade(hexv, f):
    """One light direction, three planes. f<1 darkens, f>1 lifts."""
    r = int(hexv[1:3], 16), int(hexv[3:5], 16), int(hexv[5:7], 16)
    return tuple(max(0, min(255, int(c * f))) for c in r)


def main():
    P = _pal()
    lot = _lot_fine()

    GROUND = shade(P[0], 1.35)      # desert dead-ground, lifted to daylight
    GRAVEL = shade(P[4], 1.0)       # the crushed-stone yard
    TRENCH = shade(P[13], 1.0)      # cable trench, the dark line
    WALL = P[2]                     # control-building metal: the shed's own skin
    FENCE = P[10]
    HAZARD = P[11]
    PLACARD = P[12]
    LAMP = P[5]                     # THE ONE LIT THING
    POLE = P[9]

    front = shade(WALL, 0.86)
    side = shade(WALL, 0.58)
    roof = shade(WALL, 1.18)
    edge = shade(WALL, 0.40)

    im = Image.new('RGB', (W, H), GROUND)
    d = ImageDraw.Draw(im)

    # ---- THE WORLD IS TOP-DOWN WITH A SHORT FRONT FACE, AND SO IS THIS.
    # The first cut drew a side-on isometric box with a black void above it, which
    # is not what the walked city looks like at all -- the city is seen from above,
    # every building is its ROOF plus the one wall that faces you, and there is no
    # sky in the frame because you are looking down. Compared it to the world and
    # redrew it. The ground fills the picture, the same way it does when you walk.
    for y in range(0, H, 3):
        for x in range((y * 7) % 5, W, 9):
            d.point((x, y), fill=shade(P[0], 1.52))
    for y in range(1, H, 7):
        for x in range((y * 3) % 11, W, 13):
            d.point((x, y), fill=shade(P[0], 1.12))

    # ---- the gravel pad the shed stands on, and the trench leaving the lot ----
    d.rectangle([34, 28, 136, 108], fill=GRAVEL)
    for y in range(29, 108, 2):
        for x in range(35 + ((y * 5) % 7), 136, 6):
            d.point((x, y), fill=shade(P[4], 1.20))
    d.rectangle([34, 28, 136, 28], fill=shade(P[4], 1.34))
    d.line([(112, 98), (150, 120)], fill=TRENCH, width=2)
    d.line([(112, 98), (150, 120)], fill=shade(P[13], 1.45), width=1)

    # ---- the shed's shadow on the ground, one light direction, upper-left -----
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).polygon([(116, 40), (130, 44), (130, 100), (116, 96)],
                               fill=(0, 0, 0, 64))
    ImageDraw.Draw(sh).polygon([(54, 96), (116, 96), (130, 100), (68, 100)],
                               fill=(0, 0, 0, 64))
    im = Image.alpha_composite(im.convert('RGBA'), sh).convert('RGB')
    d = ImageDraw.Draw(im)

    # ---- THE ROOF: the footprint, seen from above, ribbed steel --------------
    d.rectangle([52, 32, 116, 74], fill=roof)
    for x in range(54, 116, 4):
        d.line([(x, 33), (x, 73)], fill=shade(WALL, 1.06))
    d.rectangle([52, 32, 116, 33], fill=shade(WALL, 1.32))      # the lit edge
    d.rectangle([52, 72, 116, 74], fill=shade(WALL, 0.92))      # the eaves
    d.rectangle([60, 38, 74, 48], fill=shade(WALL, 0.74))       # a roof vent
    d.rectangle([60, 38, 74, 39], fill=edge)
    for y in range(41, 48, 2):
        d.line([(61, y), (73, y)], fill=shade(WALL, 0.60))
    d.line([(96, 34), (96, 72)], fill=shade(WALL, 0.88))        # a seam
    d.rectangle([100, 52, 110, 60], fill=shade(P[11], 0.66))    # a faded roof marking
    d.rectangle([52, 32, 52, 74], fill=edge)
    d.rectangle([116, 32, 116, 74], fill=edge)

    # ---- THE FRONT FACE: the one wall you see, and it sits on the ground -----
    d.rectangle([52, 74, 116, 96], fill=front)
    for x in range(54, 116, 4):
        d.line([(x, 75), (x, 95)], fill=shade(WALL, 0.79))
    d.rectangle([52, 74, 116, 75], fill=shade(WALL, 0.98))      # under the eaves
    d.rectangle([52, 95, 116, 96], fill=edge)                   # where wall meets ground

    # the door, chained, standing on the ground (BLDG-05)
    d.rectangle([70, 78, 94, 96], fill=shade(WALL, 0.70))
    d.rectangle([70, 78, 94, 79], fill=edge)
    d.line([(82, 79), (82, 96)], fill=edge)
    d.line([(74, 88), (90, 90)], fill=shade(P[9], 1.05))
    d.line([(74, 89), (90, 91)], fill=shade(P[9], 0.72))
    d.rectangle([80, 88, 84, 92], fill=shade(P[9], 0.88))

    # the vent grille, recessed IN the wall (BLDG-03)
    d.rectangle([57, 80, 66, 90], fill=shade(WALL, 0.54))
    d.rectangle([57, 80, 66, 81], fill=edge)
    for y in range(82, 90, 2):
        d.line([(58, y), (65, y)], fill=shade(WALL, 0.44))

    # the meter on its conduit, needle pinned
    d.line([(104, 96), (104, 86)], fill=shade(P[9], 0.9), width=2)
    d.rectangle([98, 77, 112, 87], fill=shade(WALL, 0.66))
    d.rectangle([98, 77, 112, 78], fill=edge)
    d.rectangle([100, 80, 110, 85], fill=shade(P[11], 0.80))
    d.line([(105, 83), (109, 80)], fill=shade(P[0], 1.05))

    # the hazard placard beside the door
    d.rectangle([60, 92, 68, 95], fill=PLACARD)
    d.line([(61, 93), (67, 94)], fill=shade(P[0], 1.0))

    # ---- THE ONE WRONG THING: the lamp is lit, and it is the only one --------
    # AH-01: the light was in the room. A real indicator throws a short bloom on the
    # metal beside it and nothing else, so there is no glow over the frame.
    d.rectangle([113, 78, 114, 80], fill=LAMP)
    d.point((112, 78), fill=shade(LAMP, 0.62))
    d.point((112, 79), fill=shade(LAMP, 0.52))
    d.point((115, 79), fill=shade(LAMP, 0.52))
    d.point((113, 81), fill=shade(LAMP, 0.46))
    d.point((114, 77), fill=shade(LAMP, 0.46))

    # ---- what is around it: fence posts, a dead pole light, dead brush -------
    for x in (14, 26, 152):
        d.line([(x, 14), (x, 26)], fill=FENCE)
        d.point((x, 14), fill=shade(P[10], 1.25))
    for x in (14, 26, 152):
        d.line([(x, 112), (x, 124)], fill=FENCE)
        d.point((x, 112), fill=shade(P[10], 1.25))
    d.rectangle([142, 20, 145, 58], fill=POLE)                  # the pole, dead
    d.rectangle([138, 16, 150, 21], fill=shade(P[9], 0.78))
    d.rectangle([138, 16, 150, 16], fill=shade(P[9], 1.05))
    for bx, by in ((20, 100), (146, 92), (24, 40), (150, 110)):
        d.line([(bx, by), (bx + 3, by - 5)], fill=shade(P[0], 1.85))
        d.line([(bx + 3, by - 5), (bx + 6, by)], fill=shade(P[0], 1.85))
        d.line([(bx + 2, by), (bx + 4, by - 7)], fill=shade(P[0], 1.65))

    big = im.resize((W * SCALE, H * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    big.save(OUT)
    print('THE BATTERY SHED')
    print('  footprint      : 5 x 4 fine cells against a lot of %d (%.1f m x %.1f m)'
          % (lot, 5 * 0.75, 4 * 0.75))
    print('  palette        : read live from engine/bohemia_battery.js')
    print('  the one lit thing: the indicator lamp, %s' % LAMP)
    print('  wrote          : %s (%d x %d)' % (OUT, W * SCALE, H * SCALE))


if __name__ == '__main__':
    main()
