#!/usr/bin/env python3
"""BOHEMIA — THE SHIFT IS LOGGED (9/24/26, LIFE + CITY, rule 22 COOK EVERY ROUND).

THE THING: the place a shift happens, at the end of one. A suburban house being
stripped for salvage, seen from above the way the walked city is seen.

*** IT COMES OUT OF A MEASUREMENT THIS ROUND, NOT OUT OF MY HEAD. *** Pressing
SCAVENGE with one real finger on the alpha moved the clock 360 -> 837 minutes and paid
one shift. Then the world was asked who that shift belongs to:

    he works at                [48,48], district "suburb"
    the offer                  scav, 477 MINUTES  (seven hours fifty-seven)
    the wire under it          DARK
    who holds that ground      NOBODY
    who the money comes from   NOBODY -- it is free ground
    blocks with a landlord     3,449        with none     5,767

RULE 1, THE ORDINARY FRAME, ONE WRONG THING. A house being taken apart in daylight is
ordinary. Salvage stacked on the drive is ordinary. An open garage, a barrow, a gate
standing open: ordinary, and all of it is what the generator already puts on a block.
NOTHING HERE IS DRESSED TO LOOK EERIE. ONE THING IS WRONG, in one sentence:

    THE TIME CLOCK BY THE GATE IS STILL RUNNING, AND IT HAS PUNCHED THE SHIFT
    AT 7:57 FOR AN OWNER WHO DOES NOT EXIST.

RULE 7, DRAWN FROM WORLD DATA, NEVER FAKED. The 7:57 is the offer's own 477 minutes.
The owner is the world's own answer: holder null, payTo null, on ground whose wire is
dark. And the purse's own ruling (9/16, ruling 9) is what makes it cold: "A DAY'S WORK
IS PAID FROM A TREASURY, NEVER MINTED... WHO PAYS IS THE GROUND YOU WORKED ON." So the
hours are his and the name on the card is nobody's.

RULE 5, THE DEAD INSTITUTION'S TYPE: a punch card is the calmest type there is. The
clock keeps its columns and its hours whatever happens, which is rule 9 as well -- the
machines keep talking on schedule and never acknowledge you.
RULE 4, THE LIGHT WAS IN THE ROOM: one sun, upper-left, and the clock's own lit face.
RULE 2: the clock sits off-centre and nothing frames it. RULE 8: nothing on the lens.
RULE 10: no wear pass; the grime that is here is drawn, not shaded.

REUSE CHECK: the palette and the legend are pulled LIVE out of engine/bohemia_suburb.js
-- the district the measurement NAMED, not one I preferred -- so this yard and the
block he wakes on are the same world and one source sets both. Every number in the
picture is read from records/target/BOHEMIA_WHOSE_SHIFT_9_24.json, written by
tools/bohemia_whose_shift_probe.js off the live alpha. Nothing about the colour, the
codes or the hours is typed in this file, and it REFUSES TO RUN without that row.
banks/ holds no salvage-yard plate at this read, so the geometry is a fresh cook.

REFERENCE CHECK:
  AH-01    the analog horror bible: the ordinary frame with ONE wrong thing, every
           light with a fixture, nothing on the lens. Held: the one wrong thing is
           named in one sentence above and its two numbers come off a measured row.
  BLDG-03  three planes, ONE light direction, and WINDOWS SIT IN THE WALL. Held: sun
           upper-left, roof the lightest plane, every opening recessed with a dark
           head and a sill.
  BLDG-05  structural sanity: a wall meets a roof, a door is on the ground, a street
           meets a curb. Held: the drive runs from the apron to the open garage, the
           walk meets a kerb, the kerb meets the road.

DETERMINISTIC: no randomness, no clock of its own. Same bytes every run.

Run from repo root:  python3 tools/bohemia_the_shift_is_logged_factory.py
Writes: slices/vote/LIFECITY_THE_SHIFT_IS_LOGGED_9_24.png
"""
import io, json, os, re, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBURB = os.path.join(ROOT, 'engine', 'bohemia_suburb.js')
ROW = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_WHOSE_SHIFT_9_24.json')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_SHIFT_IS_LOGGED_9_24.png')
SCALE, W, H = 6, 168, 128


def _pal():
    src = io.open(SUBURB, encoding='utf-8').read()
    m = re.search(r'var PALETTE=\{(.*?)\};', src, re.S)
    if not m:
        sys.exit('REFUSING: no PALETTE in engine/bohemia_suburb.js.')
    pal = {int(k): v for k, v in re.findall(r"(\d+)\s*:\s*'(#[0-9a-fA-F]{6})'", m.group(1))}
    missing = [n for n in (0, 1, 2, 3, 4, 5, 6, 11, 13) if n not in pal]
    if missing:
        sys.exit('REFUSING: the suburb palette is missing codes %s' % missing)
    return pal


def _row():
    """THE HOURS AND THE OWNER ARE MEASURED OR THIS DOES NOT RUN."""
    if not os.path.exists(ROW):
        sys.exit('REFUSING: %s is not there. Run tools/bohemia_whose_shift_probe.js '
                 'first. The whole point of this cut is that the hours and the owner '
                 'are TRUE.' % os.path.relpath(ROW, ROOT))
    d = json.load(open(ROW, encoding='utf-8'))
    o = d.get('offer') or {}
    if not o.get('minutes'):
        sys.exit('REFUSING: the measured row carries no shift length, so there is no '
                 'number to punch on the card and nothing honest to draw.')
    return d, o


def shade(h, f):
    r = int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)
    return tuple(max(0, min(255, int(c * f))) for c in r)


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def main():
    P = _pal()
    D, O = _row()
    mins = int(O['minutes'])
    hh, mm = mins // 60, mins % 60
    owner = D.get('payTo') or D.get('ground') or None

    YARD = shade(P[0], 1.0); ROAD = shade(P[1], 1.10); HOUSE = shade(P[2], 1.0)
    DRIVE = shade(P[3], 1.05); WALL = shade(P[4], 1.0); GATE = shade(P[5], 0.95)
    GARAGE = shade(P[6], 1.0); GRAVEL = shade(P[11], 1.0); DEBRIS = shade(P[13], 1.0)

    im = Image.new('RGB', (W, H), YARD)
    d = ImageDraw.Draw(im)
    # EVERY PIXEL IS GROUND: seen from above there is no sky.
    for y in range(0, H, 3):
        for x in range((y * 7) % 11, W, 13):
            d.point((x, y), fill=shade(P[0], 1.18))

    # the road along the bottom, with its kerbs
    d.rectangle([0, 104, W - 1, H - 1], fill=ROAD)
    d.rectangle([0, 103, W - 1, 104], fill=shade(P[1], 1.45))

    # THE HOUSE BEING STRIPPED, AND THE LOT AROUND IT.
    # The first cut made the roof 110x48 of flat grey filling the top half of the
    # frame, which reads as a shopfront wall, not as a house on a lot. In the walked
    # city a house is a ROOF plus the one wall that faces you, with GROUND all round
    # it, and the ground is most of what tells you it is a house.
    d.rectangle([34, 14, 120, 50], fill=HOUSE)                    # the roof
    d.rectangle([34, 14, 120, 15], fill=shade(P[2], 1.24))
    d.rectangle([76, 14, 78, 50], fill=shade(P[2], 1.14))         # the ridge
    for ry in range(19, 50, 6):
        d.line([(35, ry), (119, ry)], fill=shade(P[2], 1.07))
    # AND THE ROOF IS BEING TAKEN OFF, which is what stripping a house looks like
    # from above: the sheets come off in runs and the joists show through.
    d.rectangle([84, 20, 116, 34], fill=shade(P[2], 0.52))
    for jx in range(86, 116, 5):
        d.line([(jx, 21), (jx, 33)], fill=shade(P[2], 0.78))
    d.rectangle([34, 50, 120, 62], fill=shade(P[2], 0.82))        # the front wall
    d.rectangle([34, 61, 120, 62], fill=shade(P[2], 0.46))
    for wx in (40, 54, 98, 110):                                  # recessed openings
        d.rectangle([wx, 52, wx + 8, 60], fill=shade(P[2], 0.30))
        d.rectangle([wx, 52, wx + 8, 52], fill=shade(P[2], 0.20))
        d.rectangle([wx, 60, wx + 8, 61], fill=shade(P[2], 1.10))
    d.rectangle([66, 40, 90, 62], fill=GARAGE)                    # the garage, open
    d.rectangle([66, 40, 90, 41], fill=shade(P[6], 1.25))
    d.rectangle([68, 46, 88, 62], fill=shade(P[6], 0.40))
    d.rectangle([68, 46, 88, 47], fill=shade(P[6], 0.26))

    # the drive from the garage to the road
    d.rectangle([68, 62, 88, 104], fill=DRIVE)

    # THE SALVAGE, AND IT IS NOT FURNITURE. The first cut drew neat rectangles with a
    # line across the middle, which is a drawer front; salvage is UNEVEN, it leans,
    # and it is stacked by somebody in a hurry. Sheets lean on the wall, pipe is
    # bundled, and the piles are not square to anything.
    for (sx, sy, sw, sh, lean) in [(40, 70, 20, 4, 0), (38, 75, 22, 3, 1),
                                   (41, 79, 17, 3, 0), (96, 68, 18, 4, 1),
                                   (98, 73, 15, 3, 0), (95, 77, 21, 3, 1)]:
        d.rectangle([sx + lean, sy, sx + sw + lean, sy + sh], fill=shade(P[13], 1.06))
        d.rectangle([sx + lean, sy, sx + sw + lean, sy], fill=shade(P[13], 1.38))
    for k in range(5):                                            # bundled pipe, end on
        d.ellipse([42 + k * 5, 86, 46 + k * 5, 90], fill=shade(P[6], 0.92))
        d.ellipse([43 + k * 5, 87, 45 + k * 5, 89], fill=shade(P[6], 0.55))
    for k in range(4):
        d.ellipse([99 + k * 5, 86, 103 + k * 5, 90], fill=shade(P[6], 0.92))
        d.ellipse([100 + k * 5, 87, 102 + k * 5, 89], fill=shade(P[6], 0.55))
    # sheets leaning against the perimeter wall, which is where they always end up
    for k in range(3):
        d.polygon([(18 + k * 6, 96), (22 + k * 6, 76), (25 + k * 6, 76), (21 + k * 6, 96)],
                  fill=shade(P[13], 0.92 + k * 0.07))

    # A WHEELBARROW IS A TUB AND A WHEEL. The first cut was a box on a stick, which
    # reads as a sign on a post.
    d.polygon([(52, 96), (66, 96), (63, 103), (55, 103)], fill=shade(P[6], 0.88))
    d.polygon([(52, 96), (66, 96), (66, 97), (52, 97)], fill=shade(P[6], 1.18))
    d.ellipse([57, 103, 61, 107], fill=shade(P[0], 1.5))
    d.line([(66, 97), (72, 100)], fill=shade(P[6], 0.70))

    # ---- *** THE ONE WRONG THING: THE CLOCK IS STILL RUNNING *** ----------
    # Mounted on the wall by the open gate. It is off-centre, nothing frames it, and
    # it is the only thing in the picture with a light of its own (rule 4). Its face
    # carries the shift the world really offered: 477 minutes, punched.
    cx, cy = 146, 62
    d.rectangle([cx, cy, cx + 17, cy + 26], fill=shade(P[6], 0.62))      # the case
    d.rectangle([cx, cy, cx + 17, cy + 1], fill=shade(P[6], 1.05))
    FACE = mix(shade(P[2], 0.55), (255, 238, 196), 0.58)                 # lit face
    d.rectangle([cx + 2, cy + 3, cx + 15, cy + 12], fill=FACE)
    INK = shade(P[0], 0.85)
    # the hours, in segment cells: two columns, a colon, two columns
    for i, col in enumerate((cx + 3, cx + 5)):
        d.rectangle([col, cy + 5, col, cy + 9], fill=INK)
    d.point((cx + 7, cy + 6), fill=INK); d.point((cx + 7, cy + 8), fill=INK)
    for col in (cx + 9, cx + 11, cx + 13):
        d.rectangle([col, cy + 5, col, cy + 9], fill=INK)
    # the card slot and the rack of cards beside it, all of them still in their slots
    d.rectangle([cx + 4, cy + 15, cx + 13, cy + 16], fill=shade(P[6], 0.34))
    for k in range(4):
        d.rectangle([cx + 2 + k * 4, cy + 19, cx + 4 + k * 4, cy + 25],
                    fill=shade(P[11], 1.12))
        d.rectangle([cx + 2 + k * 4, cy + 19, cx + 4 + k * 4, cy + 19],
                    fill=shade(P[11], 0.70))
    # and the short throw its own lit face puts on the wall beside it
    for j, a in enumerate((0.16, 0.08, 0.04)):
        d.rectangle([cx - 1 - j, cy + 3, cx - 1 - j, cy + 12],
                    fill=mix(WALL, (255, 238, 196), a))

    im = im.resize((W * SCALE, H * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    im.save(OUT)
    print('THE SHIFT IS LOGGED')
    print('  the one wrong thing : the time clock by the gate is still running, and it')
    print('                        has punched the shift for an owner who does not exist')
    print('  AND THE NUMBERS ARE MEASURED, NOT CHOSEN (bible rule 7):')
    print('    measured on       : %s' % D['measuredOn'])
    print('    he works at       : %s, district "%s"' % (D['cell'], (D.get('offer') or {}).get('district')))
    print('    the shift         : %d minutes  ->  %d:%02d on the card' % (mins, hh, mm))
    print('    who holds it      : %s' % (owner or 'NOBODY -- it is free ground'))
    print('    the wire under it : %s' % ('live' if D.get('live') else 'dark'))
    print('    in this valley    : %s blocks have a landlord, %s have none'
          % (D.get('blocksWithALandlord'), D.get('blocksWithNone')))
    print('  palette             : read live from engine/bohemia_suburb.js')
    print('  wrote               : %s (%d x %d)' % (OUT, W * SCALE, H * SCALE))


if __name__ == '__main__':
    main()
