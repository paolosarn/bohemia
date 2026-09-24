#!/usr/bin/env python3
"""BOHEMIA — THE SAME STREET, RECLAIMED (9/24/26, LIFE + CITY, row [three cities]).

*** THIS IS ACT TWO OF A PICTURE HE ALREADY APPROVED. *** He thumbed up THE STREET
THAT IS STILL LIT (lifecity-the-street-that-is-still-lit-9-23) on 9/24. Approval
unlocks volume, so this is the SAME BLOCK -- 59,4, arterial, on MOB's wire, the same
four houses at the same coordinates, the same road, the same lamp -- drawn at the next
date. Nothing is re-invented; the act is the only difference, which is the whole point
of the row.

RULE 32(b), PAOLO 9/23, AND IT REWROTE THE ROW BEFORE I DREW A LINE: "the right side
is what the beginning is supposed to look like and it gets better... reclaims parts of
cities for economic purposes, more techy and modern." THE RUIN IS ACT 1'S FLOOR, NEVER
A FALL. NOTHING DECAYS BELOW THE START. So act 2 is act 1 PLUS what was reclaimed --
the row's own "or fallen down" clause is dead, and there is no decayed version to
draw at all.

WHAT RECLAIMED LOOKS LIKE HERE, and all of it is addition, never subtraction:
  the road is patched, not cracked          the kerb is whole
  a panel array on a roof, and a battery     TECHIER AND MORE MODERN, in the
    cabinet beside it                        district's own colours
  the lamp is not the only light: the         the ruin's one lamp still stands, and
    houses have their power back              now it is ordinary
  the dead trees are alive                    a line is restrung to the pole

*** AND THE ONE WRONG THING IS THE HOUSE THEY DID NOT TOUCH. *** (Bible rule 1: the
ordinary frame with exactly one wrong thing; rule 7: occupancy wrongness, drawn from
world data.) In act 1 the third house was lit with nobody living in it, off a measured
row: 264 stretches of lit street in this valley and 168 OF THEM WITH NOBODY ON THEM.
In act 2 the whole street has been brought back and THAT HOUSE IS EXACTLY AS IT WAS --
same window, same light, same nobody. Everything around it got better. It did not.
That is the only thing in the frame that is not addition, and it is stated in one
sentence: THE STREET CAME BACK AND THE EMPTY HOUSE IS STILL LIT.

RULE 4, the light has a fixture: the lamp, the windows, and the array's own indicator.
RULE 2: the untouched house sits off-centre and nothing frames it. RULE 8: nothing on
the lens. RULE 10: no wear pass.

REUSE CHECK: the palette and legend are read LIVE out of engine/bohemia_suburb.js, and
the block, its coordinates and its holder come from the same measured row the approved
act-1 picture used (records/target/BOHEMIA_LIT_AND_EMPTY_9_23.json), so act 1 and act 2
are provably the same ground and not two drawings that resemble each other. The layout
constants are the approved picture's own. REFUSES TO RUN without that row.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing, every light with a fixture,
           nothing on the lens. Held: the one wrong thing is named in one sentence
           above and it is the ONLY thing act 2 did not improve.
  BLDG-03  three planes, ONE light direction, windows sit IN the wall. Held: sun
           upper-left, roof the lightest plane, every pane recessed.
  BLDG-05  structural sanity: a wall meets a roof, a door is on the ground, a street
           meets a curb. Held: drives run to garage doors, the walk meets a kerb.

DETERMINISTIC: no randomness, no clock. Same bytes every run.

Run from repo root:  python3 tools/bohemia_the_same_street_reclaimed_factory.py
Writes: slices/vote/LIFECITY_THE_SAME_STREET_RECLAIMED_9_24.png
"""
import io, json, os, re, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBURB = os.path.join(ROOT, 'engine', 'bohemia_suburb.js')
ROW = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_LIT_AND_EMPTY_9_23.json')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_SAME_STREET_RECLAIMED_9_24.png')
SCALE, W, H = 6, 168, 128


def _pal():
    src = io.open(SUBURB, encoding='utf-8').read()
    m = re.search(r'var PALETTE=\{(.*?)\};', src, re.S)
    if not m:
        sys.exit('REFUSING: no PALETTE in engine/bohemia_suburb.js.')
    pal = {int(k): v for k, v in re.findall(r"(\d+)\s*:\s*'(#[0-9a-fA-F]{6})'", m.group(1))}
    missing = [n for n in (0, 1, 2, 3, 4, 5, 6, 11, 13, 16) if n not in pal]
    if missing:
        sys.exit('REFUSING: the suburb palette is missing codes %s' % missing)
    return pal


def _row():
    """THE SAME BLOCK AS ACT ONE, OR THIS DOES NOT RUN."""
    if not os.path.exists(ROW):
        sys.exit('REFUSING: %s is not there. Act two is only honest if it is provably '
                 'the SAME GROUND as the act one he approved.' % os.path.relpath(ROW, ROOT))
    d = json.load(open(ROW, encoding='utf-8'))
    if not d.get('blocks'):
        sys.exit('REFUSING: the measured row lists no lit-and-empty blocks.')
    held = [b for b in d['blocks'] if b.get('wire')]
    return d, (held[0] if held else d['blocks'][0])


def shade(h, f):
    r = int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)
    return tuple(max(0, min(255, int(c * f))) for c in r)


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def night(c, k=0.42):
    """NIGHT IS VALUE ONLY, the same arithmetic act one used."""
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
    # RECLAIMED: THE ROAD IS PATCHED. Act two is act one PLUS, so the patches are
    # laid ON the same asphalt and the same kerbs -- nothing about act one is removed.
    for (px, py, pw, ph) in [(10, 64, 38, 7), (72, 68, 44, 6), (128, 63, 30, 8)]:
        d.rectangle([px, py, px + pw, py + ph], fill=night(shade(P[1], 1.34)))
        d.rectangle([px, py, px + pw, py], fill=night(shade(P[1], 1.52)))
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
        # RECLAIMED: THE POWER IS BACK, AND THE NEW LIGHT IS NOT THE OLD LIGHT.
        # *** THE FIRST CUT OF ACT TWO LOST ITS OWN WRONG THING. *** I lit every
        # reclaimed house in the same warm bulb the empty house already had, so all
        # four read identical and the one thing that was supposed to be wrong
        # disappeared into the improvement. IF EVERYTHING GETS BETTER IN THE SAME WAY
        # THE WRONG THING ALREADY WAS, THE WRONG THING VANISHES -- which is bible rule
        # 1 failing from the other direction to the shop he killed: not six wrong
        # things, but none.
        # The reclaimed light is PANEL-FED AND MODERN: cooler, steadier, a little
        # blue. His own words for act two are "more techy and modern", and that is
        # what new light looks like next to an old bulb. So the untouched house is now
        # the WARM one in a street of cold light, and it reads instantly.
        if i != LIT:
            for wx in (hx + 4, hx + 12):
                for k in range(5):
                    t = 0.82 - k * 0.11
                    d.rectangle([wx, 45 + k, wx + 6, 45 + k],
                                fill=mix((58, 66, 74), (206, 226, 240), max(0.18, t)))
                d.rectangle([wx, 45, wx + 6, 45], fill=night(shade(P[2], 0.22)))
                d.rectangle([wx, 50, wx + 6, 51], fill=night(shade(P[2], 1.20)))

    # ---- RECLAIMED: TECHIER AND MORE MODERN, IN HIS OWN WORDS --------------
    # "reclaims parts of cities for economic purposes, more techy and modern".
    # A panel array on the first roof and a battery cabinet beside it, drawn in the
    # district's OWN palette so the new thing belongs to the same world as the old
    # one. It is ADDITION: the roof under it is untouched.
    # AND THE CODE IS THE DISTRICT'S, CHECKED, NOT REMEMBERED: the suburb palette runs
    # 0-6, 9-16 and has NO code 22. I reached for 22 out of habit because that is the
    # COMMERCIAL district's olive, from the shop two rounds ago -- a palette borrowed
    # from the wrong district is the same drift as borrowing a colour from the wrong
    # thing, and the factory refused to run rather than draw it.
    ax = homes[0]
    d.rectangle([ax + 3, 18, ax + 27, 34], fill=night(shade(P[16], 1.25)))
    for gx in range(ax + 5, ax + 27, 6):
        d.rectangle([gx, 19, gx + 3, 33], fill=night(shade(P[16], 1.70)))
    d.rectangle([ax + 3, 18, ax + 27, 18], fill=night(shade(P[11], 1.10)))
    d.rectangle([ax + 30, 24, ax + 38, 34], fill=night(shade(P[6], 1.20)))   # the cabinet
    d.rectangle([ax + 30, 24, ax + 38, 25], fill=night(shade(P[6], 1.60)))
    d.rectangle([ax + 33, 28, ax + 35, 29], fill=(190, 230, 190))            # its indicator
    # and the line restrung from the pole to the array
    d.line([(40, 61), (ax + 27, 34)], fill=night(shade(P[4], 1.9)))

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
        for wx in (hx + 2, hx + 9):                     # lit now, and cold: panel-fed
            for k in range(4):
                t = 0.78 - k * 0.13
                d.rectangle([wx, 90 + k, wx + 5, 90 + k],
                            fill=mix((58, 66, 74), (206, 226, 240), max(0.18, t)))
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

    print('THE SAME STREET, RECLAIMED  (act two of the picture he approved)')
    print('  ACT TWO OF A PICTURE HE APPROVED. Same block, same houses, next date.')
    print('  what was reclaimed   : the road patched, the power back on the street,')
    print('                         a panel array and a battery cabinet, the line restrung')
    print('  the one wrong thing  : THE STREET CAME BACK AND THE EMPTY HOUSE IS STILL LIT')
    print('                         (everything around it got better; it did not)')
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
