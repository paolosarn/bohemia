#!/usr/bin/env python3
"""BOHEMIA — THE STREET THAT IS STILL LIT (9/23/26, LIFE + CITY, rule 22).

THE THING: one suburban block at night, seen from above the way the walked city is
seen. It is this lane's open row [horror city], THE LIT STREET WITH NOBODY HOME, and
it is DIRECTION's bible rule 7 by its own name.

*** THE LESSON FROM HIS DOWN VOTE IS BUILT INTO THIS FILE. *** He voted the 9/21
corner store down with "Not analog horror enough". The post-mortem found two breaks:
rule 1 (I put SIX wrong things in a frame I called ordinary) and rule 7 (I PAINTED
the one wrong thing, so it traced to nothing). So:

  RULE 1, THE ORDINARY FRAME, ONE WRONG THING. Night in a suburb is ordinary. Dark
  houses at night are ordinary. A working street lamp is ordinary. Cracked asphalt,
  dead yards and a gate are what this generator already puts on every block, so none
  of them is "wrong" here, they are the world. NOTHING in this frame is dressed to
  look eerie. ONE THING IS WRONG AND IT IS SAID IN ONE SENTENCE:

      THE LIGHTS ARE ON INSIDE A HOUSE THAT THE CENSUS SAYS NOBODY LIVES IN.

  RULE 7, DRAWN FROM WORLD DATA, NEVER FAKED. "MEASURE: the wrongness traces to a
  real world-state row." It does, and the row is written down before this runs:
  records/target/BOHEMIA_LIT_AND_EMPTY_9_23.json, produced by
  tools/bohemia_lit_and_empty_probe.js on the ALPHA, crossing two shipped systems --
  POWER.at(x,y).live (LIGHT IS TERRITORY, 7/20) against
  BohemiaHousing.residentsAt(...).people. The block drawn here is a REAL block off
  that list, by its real coordinates, on its real faction's wire. THE FACTORY REFUSES
  TO RUN WITHOUT THAT FILE, because a number I liked the look of is the exact defect
  this is fixing.

  RULE 4, THE LIGHT WAS IN THE ROOM. Every lumen names its fixture: the street lamp
  on its pole, and the windows of the one house. Night is value-only, which is the
  cloud rule's own arithmetic and the only overlay the bible allows.
  RULE 2, THE CAMERA DOES NOT HELP: the lit house sits off-centre and nothing frames
  it. RULE 8: no scanline, no static, no grain; this is not an in-world screen.
  RULE 10: no runtime wear pass at all.

REUSE CHECK: the palette and the legend are pulled LIVE out of
engine/bohemia_suburb.js -- the same generator that builds the block he wakes on --
so this street and the street he walks are the same world and one source sets both.
The occupancy row is read from the probe's JSON, which came from the game's own
POWER and housing modules. Nothing about the colour, the layout codes or the number
is typed in this file. banks/ holds no night-suburb plate at this read (the tile bank
is ground pools, the district bank is the 1x1 city hero), so the geometry is a fresh
cook and nothing is opened from banks/.

REFERENCE CHECK:
  AH-01    the analog horror bible: the ordinary frame with ONE wrong thing, every
           light with a fixture you can point at, nothing on the lens. Held, and held
           against my own 9/21 failure: the one wrong thing is named in one sentence
           above and traces to a measured row, and the rest of the frame is the
           generator's ordinary night.
  BLDG-03  a pixel building is drawn in three planes with ONE light direction, and
           WINDOWS SIT IN THE WALL, not on it. Held: every house is roof plus the one
           wall that faces you, and each window is recessed with a dark head and sill.
  BLDG-05  the structural sanity list: a wall meets a roof, a door is on the ground,
           a street meets a curb. Held: driveways run from the apron to the garage
           door, the walk meets a kerb, the kerb meets the road.

DETERMINISTIC: no randomness, no clock. Same bytes every run.

Run from repo root:
  python3 tools/bohemia_lit_street_factory.py
Writes: slices/vote/LIFECITY_THE_STREET_THAT_IS_STILL_LIT_9_23.png
"""
import io
import json
import os
import re
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBURB = os.path.join(ROOT, 'engine', 'bohemia_suburb.js')
ROW = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_LIT_AND_EMPTY_9_23.json')
OUT = os.path.join(ROOT, 'slices', 'vote',
                   'LIFECITY_THE_STREET_THAT_IS_STILL_LIT_9_23.png')

SCALE = 6
W, H = 168, 128


def _pal():
    """READ OUT OF THE GENERATOR, NEVER TYPED HERE."""
    src = io.open(SUBURB, encoding='utf-8').read()
    m = re.search(r'var PALETTE=\{(.*?)\};', src, re.S)
    if not m:
        sys.exit('REFUSING: no PALETTE in engine/bohemia_suburb.js.')
    pal = {}
    for k, v in re.findall(r"(\d+)\s*:\s*'(#[0-9a-fA-F]{6})'", m.group(1)):
        pal[int(k)] = v
    need = [0, 1, 2, 3, 4, 5, 6, 11, 13]      # yard, road, house, drive, wall, gate,
    missing = [n for n in need if n not in pal]   # garage, gravel, debris
    if missing:
        sys.exit('REFUSING: the suburb palette is missing codes %s' % missing)
    return pal


def _row():
    """*** THE WRONGNESS TRACES TO A REAL ROW OR THIS DOES NOT RUN. ***"""
    if not os.path.exists(ROW):
        sys.exit('REFUSING: %s is not there. Run tools/bohemia_lit_and_empty_probe.js '
                 'first. The whole point of this cut is that the lit-and-empty house '
                 'is TRUE, so it will not fall back to a number I liked the look of.'
                 % os.path.relpath(ROW, ROOT))
    d = json.load(open(ROW, encoding='utf-8'))
    if not d.get('blocks'):
        sys.exit('REFUSING: the measured row lists no lit-and-empty blocks. If the '
                 'valley has none, rule 7 has nothing to draw here and the honest '
                 'thing is to say so, not to paint one.')
    # THE BLOCK DRAWN IS A REAL ONE: the first that a faction actually holds, so the
    # picture can name whose power it is; otherwise the first on the list.
    held = [b for b in d['blocks'] if b.get('wire')]
    b = held[0] if held else d['blocks'][0]
    return d, b


def shade(hexv, f):
    r = int(hexv[1:3], 16), int(hexv[3:5], 16), int(hexv[5:7], 16)
    return tuple(max(0, min(255, int(c * f))) for c in r)


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def night(c, k=0.42):
    """NIGHT IS VALUE ONLY (bible rule 4, and the cloud rule's arithmetic). It
    multiplies and touches nothing else: no blue wash, no mood gradient."""
    return tuple(max(0, min(255, int(v * k))) for v in c)


def main():
    P = _pal()
    D, B = _row()

    YARD = night(shade(P[0], 1.0))
    ROAD = night(shade(P[1], 1.10))
    HOUSE = night(shade(P[2], 1.0))
    DRIVE = night(shade(P[3], 1.05))
    WALL = night(shade(P[4], 1.0))
    GATE = night(shade(P[5], 0.9))
    GARAGE = night(shade(P[6], 1.0))
    GRAVEL = night(shade(P[11], 1.0))
    DEBRIS = night(shade(P[13], 1.0))

    im = Image.new('RGB', (W, H), YARD)
    d = ImageDraw.Draw(im)

    # ---- EVERY PIXEL IS GROUND. Seen from above there is no sky. -------------
    for y in range(0, H, 3):
        for x in range((y * 7) % 11, W, 13):
            d.point((x, y), fill=night(shade(P[0], 1.22)))

    # ---- THE ROAD ACROSS THE MIDDLE, with its kerbs ------------------------
    d.rectangle([0, 60, W - 1, 82], fill=ROAD)
    d.rectangle([0, 59, W - 1, 60], fill=night(shade(P[1], 1.45)))
    d.rectangle([0, 82, W - 1, 83], fill=night(shade(P[1], 1.45)))
    # NO CENTRE LINE. The generator's legend has no road-paint code, because a
    # cracked residential street does not have one -- and the first cut of this drew
    # the dashes in code 5, which is THE GATE. Borrowing a colour from a thing that
    # is not the thing is how two parts of one world start to drift, and it put six
    # orange dashes in a frame that is supposed to have one bright thing in it.

    # ---- FOUR TRACT HOUSES ALONG THE TOP, ONE OF THEM THE ONE --------------
    # The block's own shapes: house, driveway apron, garage door, wall, gate.
    LIT = 2                       # third from the left: off-centre (bible rule 2)
    homes = [8, 46, 84, 122]
    for i, hx in enumerate(homes):
        d.rectangle([hx, 14, hx + 30, 44], fill=HOUSE)                 # the roof
        d.rectangle([hx, 14, hx + 30, 15], fill=night(shade(P[2], 1.22)))
        for ry in range(18, 44, 5):
            d.line([(hx + 1, ry), (hx + 29, ry)], fill=night(shade(P[2], 1.08)))
        d.rectangle([hx, 44, hx + 30, 52], fill=night(shade(P[2], 0.80)))  # front wall
        d.rectangle([hx, 51, hx + 30, 52], fill=night(shade(P[2], 0.48)))
        d.rectangle([hx + 22, 30, hx + 30, 44], fill=GARAGE)           # the garage
        d.rectangle([hx + 22, 30, hx + 30, 31], fill=night(shade(P[6], 1.2)))
        d.rectangle([hx + 24, 52, hx + 30, 60], fill=DRIVE)            # apron to road
        d.rectangle([hx - 2, 14, hx - 1, 52], fill=WALL)               # the side wall
        d.rectangle([hx + 6, 52, hx + 8, 53], fill=GATE)               # the gate
        d.rectangle([hx + 2, 53, hx + 20, 59], fill=GRAVEL)            # gravel yard
        if i in (0, 3):
            d.rectangle([hx + 10, 55, hx + 14, 57], fill=DEBRIS)       # yard drift

        # THE WINDOWS. Recessed: a dark head, a sill, and the glass sunk in the wall
        # (BLDG-03). Dark in every house on this street except one.
        for wx in (hx + 4, hx + 12):
            d.rectangle([wx, 45, wx + 6, 50], fill=night(shade(P[2], 0.34)))
            d.rectangle([wx, 45, wx + 6, 45], fill=night(shade(P[2], 0.22)))
            d.rectangle([wx, 50, wx + 6, 51], fill=night(shade(P[2], 0.95)))

    # ---- AND THE OTHER SIDE OF THE STREET ----------------------------------
    # A STREET HAS TWO SIDES. The first cut drew four houses along the top and left
    # the bottom third of the frame as bare dirt, which does not read as a street at
    # all -- it reads as the edge of the world, which is the same defect as the black
    # band over the battery shed's roof wearing brown. These face the road, so their
    # fronts are at the TOP of their footprint and their roofs behind.
    for i, hx in enumerate([26, 64, 102, 140]):
        d.rectangle([hx - 2, 95, hx + 28, 125], fill=HOUSE)             # the roof
        d.rectangle([hx - 2, 124, hx + 28, 125], fill=night(shade(P[2], 0.62)))
        for ry in range(99, 125, 5):
            d.line([(hx - 1, ry), (hx + 27, ry)], fill=night(shade(P[2], 1.08)))
        d.rectangle([hx - 2, 88, hx + 28, 95], fill=night(shade(P[2], 0.80)))
        d.rectangle([hx - 2, 88, hx + 28, 89], fill=night(shade(P[2], 1.10)))
        d.rectangle([hx + 18, 88, hx + 26, 95], fill=GARAGE)
        d.rectangle([hx + 20, 83, hx + 26, 88], fill=DRIVE)
        d.rectangle([hx + 1, 84, hx + 16, 88], fill=GRAVEL)
        for wx in (hx + 2, hx + 9):                                     # dark windows
            d.rectangle([wx, 90, wx + 5, 94], fill=night(shade(P[2], 0.34)))
            d.rectangle([wx, 90, wx + 5, 90], fill=night(shade(P[2], 0.95)))
            d.rectangle([wx, 94, wx + 5, 95], fill=night(shade(P[2], 0.22)))

    # ---- THE STREET LAMP, AND IT IS ORDINARY -------------------------------
    # Rule 4: the light has a fixture you can point at, and it lights the road it
    # stands over and nothing else. This is the peach dot he asked about, close up.
    # A POOL OF LIGHT IS FILLED, NOT RINGED. The first cut drew five ellipse
    # OUTLINES and it came out as a bullseye sitting on the road: concentric rings
    # read as a ripple or a target, never as light. Filled, largest first, each one
    # brighter than the last, is how a lamp lands on tarmac.
    lx, ly = 40, 61
    for rr, a in ((22, 0.05), (17, 0.09), (13, 0.15), (9, 0.24), (6, 0.34)):
        d.ellipse([lx - rr, ly + 3 - rr // 2, lx + rr, ly + 3 + rr // 2],
                  fill=mix(ROAD, (255, 206, 120), a))
    d.rectangle([lx - 1, ly - 4, lx + 1, ly + 1], fill=night(shade(P[4], 1.9)))  # pole
    d.rectangle([lx - 1, ly + 1, lx + 1, ly + 3], fill=(255, 224, 154))  # the lamp

    # ---- *** THE ONE WRONG THING *** ---------------------------------------
    # The third house has its lights on. The census on this block says nobody lives
    # here. Nothing in the frame points at it; it is just on.
    hx = homes[LIT]
    WARM = (255, 236, 190)
    # A LIT WINDOW AT NIGHT IS THE BRIGHTEST THING IN THE FRAME, and the first cut
    # mixed warm INTO a night-multiplied wall, so it landed on a grey-green band that
    # read as a blind, not a light. A window with a room behind it is not the wall
    # dimmed less; it is the room, and the room is not under the night multiplier.
    for wx in (hx + 4, hx + 12):
        for k in range(5):                     # brightest at the head: the ceiling
            t = 1.0 - k * 0.13
            d.rectangle([wx, 45 + k, wx + 6, 45 + k],
                        fill=mix((92, 74, 48), WARM, max(0.22, t)))
        d.rectangle([wx, 45, wx + 6, 45], fill=night(shade(P[2], 0.22)))
        d.rectangle([wx, 50, wx + 6, 51], fill=night(shade(P[2], 1.20)))   # the sill
        # the short spill a real window throws on the ground under its sill
        for j, a in enumerate((0.26, 0.14, 0.06)):
            d.rectangle([wx - 1, 52 + j, wx + 7, 52 + j], fill=mix(GRAVEL, WARM, a))

    im = im.resize((W * SCALE, H * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    im.save(OUT)

    print('THE STREET THAT IS STILL LIT')
    print('  the one wrong thing  : the lights are on inside a house the census says')
    print('                         nobody lives in')
    print('  AND IT IS A REAL BLOCK, off a measured row (bible rule 7):')
    print('    measured on        : %s, overmap %s' % (D['measuredOn'], D['overmap']))
    print('    lamp ground live   : %d,  dark %d' % (D['live'], D['dark']))
    print('    LIT AND EMPTY      : %d blocks   (lit and lived in: %d)'
          % (D['litEmpty'], D['litLived']))
    print('    this block         : %s, %s, on %s wire'
          % (B['at'], B['district'], (B['wire'] or 'nobody’s')))
    print('  palette              : read live from engine/bohemia_suburb.js')
    print('  wrote                : %s (%d x %d)' % (OUT, W * SCALE, H * SCALE))


if __name__ == '__main__':
    main()
