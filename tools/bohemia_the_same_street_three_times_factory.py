#!/usr/bin/env python3
"""BOHEMIA — THE SAME STREET, THREE TIMES (9/24/26, LIFE + CITY, row [three cities]).

*** THIS IS THE ROW ITSELF, IN THE ONLY PLACE THE HOLD ALLOWS. *** Rule 31: "the city
screen draws whichever act he is in; the same ground three times." Rule 18(b) keeps
this lane's code off the play surface, and rule 22 says cook into the VOTE tab every
round. So the row's deliverable arrives as the thing it is actually about: ONE PICTURE,
ONE BLOCK, THREE DATES, stacked so they can be read against each other in one look.

AND IT NEEDED NO OTHER LANE TO GET HERE. Rule 12 says a dependency is a premise, not a
gate. Measured last round: ACT, DYNASTY, ERA, BohemiaDynasty and BohemiaDerive are ALL
UNDEFINED and there is no DAY.act -- so "draw whichever act he is in" cannot be WIRED
yet, because the act does not exist as a value anywhere in the world. But WHAT each act
looks like does not wait on that, and neither does whether the difference reads. That
is what this answers.

RULE 32(b), PAOLO 9/23, IS THE SPINE: "the right side is what the beginning is supposed
to look like and it gets better... reclaims parts of cities for economic purposes, more
techy and modern." THE RUIN IS ACT 1'S FLOOR, NEVER A FALL. NOTHING DECAYS BELOW THE
START. So every panel below is the one above PLUS something, and there is no panel
where anything is taken away.

    ACT 1   the ruin, exactly as he approved it (lifecity-the-street-that-is-still-lit)
    ACT 2   plus: the road patched, the power back, a panel array and a battery
            cabinet, the line restrung        (lifecity-the-same-street-reclaimed)
    ACT 3   plus: a second array and cabinet on the far side, the kerbs rebuilt and
            walked, the lamp doubled, and the dead lot turned into something that pays

*** THE MACHINE PROVES THE FLOOR, IT DOES NOT PROMISE IT. *** Rule 32(b) is only worth
anything if it is CHECKED, so this file draws each panel on top of the previous one's
own pixels and then COUNTS: every pixel that got darker between act 1 and act 2, and
between act 2 and act 3, is a pixel where the world went backwards. The run prints
those two numbers and REFUSES TO WRITE THE PICTURE if the dark side of the ledger is
anything but the shadow the new hardware legitimately casts. A law without a machine
gate is not enforced, and that goes for a law about pictures too.

*** AND ONE THING NEVER CHANGES IN ANY OF THE THREE. *** (Bible rule 1, and rule 7's
occupancy wrongness drawn from world data.) The third house was lit with nobody living
in it in act 1, off a measured row -- 264 stretches of lit street in this valley and
168 OF THEM WITH NOBODY ON THEM. It is lit with nobody in it in act 2. It is lit with
nobody in it in act 3. Everything around it gets better three times over and it never
does. Said in one sentence: THE STREET COMES BACK TWICE AND THE EMPTY HOUSE NEVER DOES.

AND THE LESSON FROM ACT 2 IS BUILT IN: the first cut of act 2 lit every reclaimed house
in the same warm bulb the empty house already had, so all four read identical and the
wrong thing VANISHED INTO THE IMPROVEMENT. The reclaimed light is panel-fed and cold
here, in every act, so the untouched house stays the one warm window and reads at a
glance in all three panels.

REUSE CHECK: the palette and legend are read LIVE out of engine/bohemia_suburb.js; the
block, its coordinates and its holder come from the same measured row both approved
pictures used (records/target/BOHEMIA_LIT_AND_EMPTY_9_23.json); and the layout
constants and the drawing body are the APPROVED act-1 picture's own, kept verbatim and
made act-conditional rather than redrawn, so act 1 here is the same pixels he already
voted up. Act 3 is the only new geometry. REFUSES TO RUN without the row.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing, every light with a fixture,
           nothing on the lens. Held in all three panels, and the wrong thing is the
           ONLY element that is identical across them.
  BLDG-03  three planes, ONE light direction, windows sit IN the wall. Held: the roof
           is the lightest plane, panes are recessed with a head and a sill, and every
           new fixture in acts 2 and 3 throws its light the same way as act 1's lamp.
  BLDG-05  structural sanity: a wall meets a roof, a door is on the ground, a street
           meets a curb. Held: drives run to garage doors, the walk meets a kerb, the
           restrung line lands on a pole at one end and hardware at the other.

DETERMINISTIC: no randomness, no clock. Same bytes every run.

Run from repo root:  python3 tools/bohemia_the_same_street_three_times_factory.py
Writes: slices/vote/LIFECITY_THE_SAME_STREET_THREE_TIMES_9_24.png
"""
import io, json, os, re, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBURB = os.path.join(ROOT, 'engine', 'bohemia_suburb.js')
ROW = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_LIT_AND_EMPTY_9_23.json')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_SAME_STREET_THREE_TIMES_9_24.png')
W, H = 168, 128
BAND = 13        # the caption strip above each panel, drawn at one-to-one then scaled
SCALE = 4        # three panels stacked is 3x as tall as one, so the sheet steps down
                 # from the single picture's 6x and still lands wider than a phone.

# THE FLOOR CHECK'S ONE ALLOWANCE. New hardware is a solid object and a solid object
# has a shadow and an edge; a roof under a panel array is legitimately darker than bare
# roof. Everything else going darker is the world falling, which rule 32(b) forbids.
DARKER_ALLOWED = 1400


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
    if not os.path.exists(ROW):
        sys.exit('REFUSING: %s is not there. Three acts are only honest if all three '
                 'are provably the SAME GROUND.' % os.path.relpath(ROW, ROOT))
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
    return tuple(max(0, min(255, int(v * k))) for v in c)


def panel(P, act):
    """One act of the same block. ACT 1 is the approved picture, untouched. Every
    later act is this body PLUS whatever its own `if act >= n` blocks add, which is
    rule 32(b) written as control flow: there is no branch anywhere below that takes
    something away in a later act."""
    YARD = night(shade(P[0], 1.0))
    ROAD = night(shade(P[1], 1.10))
    HOUSE = night(shade(P[2], 1.0))
    DRIVE = night(shade(P[3], 1.05))
    WALL = night(shade(P[4], 1.0))
    GATE = night(shade(P[5], 0.9))
    GARAGE = night(shade(P[6], 1.0))
    GRAVEL = night(shade(P[11], 1.0))
    DEBRIS = night(shade(P[13], 1.0))
    COLD_DIM, COLD = (58, 66, 74), (206, 226, 240)   # panel-fed light, in every act

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

    if act >= 2:
        # RECLAIMED: THE ROAD IS PATCHED. Act two is act one PLUS, so the patches are
        # laid ON the same asphalt and the same kerbs -- nothing about act one is
        # removed, and a patch is lighter than what it covers, never darker.
        for (px, py, pw, ph) in [(10, 64, 38, 7), (72, 68, 44, 6), (128, 63, 30, 8)]:
            d.rectangle([px, py, px + pw, py + ph], fill=night(shade(P[1], 1.34)))
            d.rectangle([px, py, px + pw, py], fill=night(shade(P[1], 1.52)))

    if act >= 3:
        # ACT THREE: THE PATCHES JOINED UP. The road is resurfaced end to end, which
        # is the same asphalt one shade further along, and then the KERBS ARE REBUILT
        # -- a real kerb with a face and a top, and a walk behind it on both sides.
        # A street you can walk is the difference between a road and a neighbourhood.
        d.rectangle([0, 62, W - 1, 80], fill=night(shade(P[1], 1.40)))
        d.rectangle([0, 62, W - 1, 62], fill=night(shade(P[1], 1.55)))
        for kx in range(0, W, 24):                      # the joints in the new slab
            d.rectangle([kx, 62, kx, 80], fill=night(shade(P[1], 1.26)))
        for (ky, face) in ((59, 60), (83, 82)):         # kerb top, then its face
            d.rectangle([0, ky, W - 1, ky], fill=night(shade(P[11], 1.30)))
            d.rectangle([0, face, W - 1, face], fill=night(shade(P[11], 0.90)))
        d.rectangle([0, 55, W - 1, 58], fill=night(shade(P[11], 1.12)))     # the walk
        d.rectangle([0, 84, W - 1, 87], fill=night(shade(P[11], 1.12)))
        for sx in range(6, W, 18):                      # its slab joints
            d.rectangle([sx, 55, sx, 58], fill=night(shade(P[11], 0.94)))
            d.rectangle([sx, 84, sx, 87], fill=night(shade(P[11], 0.94)))

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
        if act >= 2 and i != LIT:
            for wx in (hx + 4, hx + 12):
                for k in range(5):
                    t = 0.82 - k * 0.11
                    d.rectangle([wx, 45 + k, wx + 6, 45 + k],
                                fill=mix(COLD_DIM, COLD, max(0.18, t)))
                d.rectangle([wx, 45, wx + 6, 45], fill=night(shade(P[2], 0.22)))
                d.rectangle([wx, 50, wx + 6, 51], fill=night(shade(P[2], 1.20)))

    if act >= 2:
        # ---- RECLAIMED: TECHIER AND MORE MODERN, IN HIS OWN WORDS ----------
        # "reclaims parts of cities for economic purposes, more techy and modern".
        # A panel array on the first roof and a battery cabinet beside it, drawn in
        # the district's OWN palette so the new thing belongs to the same world as
        # the old one. It is ADDITION: the roof under it is untouched.
        # AND THE CODE IS THE DISTRICT'S, CHECKED, NOT REMEMBERED: the suburb palette
        # runs 0-6, 9-16 and has NO code 22. I reached for 22 out of habit because
        # that is the COMMERCIAL district's olive, from the shop two rounds ago -- a
        # palette borrowed from the wrong district is the same drift as borrowing a
        # colour from the wrong thing, and the factory refused to run rather than
        # draw it.
        ax = homes[0]
        d.rectangle([ax + 3, 18, ax + 27, 34], fill=night(shade(P[16], 1.25)))
        for gx in range(ax + 5, ax + 27, 6):
            d.rectangle([gx, 19, gx + 3, 33], fill=night(shade(P[16], 1.70)))
        d.rectangle([ax + 3, 18, ax + 27, 18], fill=night(shade(P[11], 1.10)))
        d.rectangle([ax + 30, 24, ax + 38, 34], fill=night(shade(P[6], 1.20)))  # cabinet
        d.rectangle([ax + 30, 24, ax + 38, 25], fill=night(shade(P[6], 1.60)))
        d.rectangle([ax + 33, 28, ax + 35, 29], fill=(190, 230, 190))           # indicator
        # and the line restrung from the pole to the array
        d.line([(40, 61), (ax + 27, 34)], fill=night(shade(P[4], 1.9)))

    # ---- AND THE OTHER SIDE OF THE STREET ----------------------------------
    # A STREET HAS TWO SIDES. The first cut drew four houses along the top and left
    # the bottom third of the frame as bare dirt, which does not read as a street at
    # all -- it reads as the edge of the world, which is the same defect as the black
    # band over the battery shed's roof wearing brown. These face the road, so their
    # fronts are at the TOP of their footprint and their roofs behind.
    far = [26, 64, 102, 140]
    for i, hx in enumerate(far):
        d.rectangle([hx - 2, 95, hx + 28, 125], fill=HOUSE)             # the roof
        d.rectangle([hx - 2, 124, hx + 28, 125], fill=night(shade(P[2], 0.62)))
        for ry in range(99, 125, 5):
            d.line([(hx - 1, ry), (hx + 27, ry)], fill=night(shade(P[2], 1.08)))
        d.rectangle([hx - 2, 88, hx + 28, 95], fill=night(shade(P[2], 0.80)))
        d.rectangle([hx - 2, 88, hx + 28, 89], fill=night(shade(P[2], 1.10)))
        d.rectangle([hx + 18, 88, hx + 26, 95], fill=GARAGE)
        d.rectangle([hx + 20, 83, hx + 26, 88], fill=DRIVE)
        d.rectangle([hx + 1, 84, hx + 16, 88], fill=GRAVEL)
        if act >= 2:                                    # lit now, and cold: panel-fed
            for wx in (hx + 2, hx + 9):
                for k in range(4):
                    t = 0.78 - k * 0.13
                    d.rectangle([wx, 90 + k, wx + 5, 90 + k],
                                fill=mix(COLD_DIM, COLD, max(0.18, t)))
                d.rectangle([wx, 90, wx + 5, 90], fill=night(shade(P[2], 0.95)))
                d.rectangle([wx, 94, wx + 5, 95], fill=night(shade(P[2], 0.22)))
        else:                                                           # dark windows
            for wx in (hx + 2, hx + 9):
                d.rectangle([wx, 90, wx + 5, 94], fill=night(shade(P[2], 0.34)))
                d.rectangle([wx, 90, wx + 5, 90], fill=night(shade(P[2], 0.95)))
                d.rectangle([wx, 94, wx + 5, 95], fill=night(shade(P[2], 0.22)))

    if act >= 3:
        # ACT THREE: THE FAR SIDE GETS ITS OWN. One array and one cabinet was one
        # household's luck; a second one across the road is the street doing it, and
        # that is the difference between a survivor and a neighbourhood. The line
        # runs to the second lamp's pole, so the two sides are on the same wire.
        bx = far[2]
        d.rectangle([bx + 1, 100, bx + 25, 116], fill=night(shade(P[16], 1.25)))
        for gx in range(bx + 3, bx + 25, 6):
            d.rectangle([gx, 101, gx + 3, 115], fill=night(shade(P[16], 1.70)))
        d.rectangle([bx + 1, 116, bx + 25, 116], fill=night(shade(P[11], 1.10)))
        d.rectangle([bx - 10, 100, bx - 2, 110], fill=night(shade(P[6], 1.20)))
        d.rectangle([bx - 10, 100, bx - 2, 101], fill=night(shade(P[6], 1.60)))
        d.rectangle([bx - 7, 104, bx - 5, 105], fill=(190, 230, 190))
        d.line([(128, 82), (bx + 1, 100)], fill=night(shade(P[4], 1.9)))

        # AND THE DEAD LOT TURNS INTO SOMETHING THAT PAYS. The fourth yard is the one
        # with the drift in it in act 1 -- a lot nobody used. Batteries are the money
        # (9/4), so what a reclaimed street puts on its dead lot is a SWAP STAND: a
        # hardstand, a rack of cells behind a low fence, and a cold light over it so
        # you can work at night. The drift is not erased, it is what the hardstand
        # was poured over: act three covers act one, it never rewinds it.
        # DRAW ORDER IS THE WHOLE JOB HERE. The first cut poured the hardstand, racked
        # the cells, and THEN threw the work light over the top of them -- so the pool
        # washed out the only thing it was there to let you see, and the stand came out
        # a grey blob with a glow on it. Light lands on ground, and hardware stands in
        # it: ground, then the pool, then the rack. Same family of mistake as the
        # bullseye lamp, one layer further in.
        sx = homes[3] + 1
        d.rectangle([sx, 53, sx + 20, 59], fill=night(shade(P[11], 1.22)))   # hardstand
        d.rectangle([sx, 53, sx + 20, 53], fill=night(shade(P[11], 1.42)))
        for rr, a in ((11, 0.08), (8, 0.13), (5, 0.20)):                 # its work light
            d.ellipse([sx + 10 - rr, 57 - rr // 2, sx + 10 + rr, 57 + rr // 2],
                      fill=mix(night(shade(P[11], 1.22)), COLD, a))
        d.rectangle([sx + 1, 53, sx + 19, 57], fill=night(shade(P[6], 0.90)))  # the rack
        d.rectangle([sx + 1, 53, sx + 19, 53], fill=night(shade(P[6], 1.45)))  # its top
        for cx in range(sx + 2, sx + 18, 3):                             # the cells
            d.rectangle([cx, 54, cx + 1, 56], fill=night(shade(P[16], 1.80)))
            d.point((cx, 54), fill=(190, 230, 190))
        for fx in range(sx, sx + 21, 5):                                 # the low fence
            d.rectangle([fx, 58, fx, 59], fill=night(shade(P[4], 1.55)))
        d.rectangle([sx + 9, 48, sx + 10, 52], fill=night(shade(P[4], 1.9)))  # its post
        d.rectangle([sx + 8, 47, sx + 11, 48], fill=COLD)                # and its head

    # ---- THE STREET LAMP, AND IT IS ORDINARY -------------------------------
    # Rule 4: the light has a fixture you can point at, and it lights the road it
    # stands over and nothing else. This is the peach dot he asked about, close up.
    # A POOL OF LIGHT IS FILLED, NOT RINGED. The first cut drew five ellipse
    # OUTLINES and it came out as a bullseye sitting on the road: concentric rings
    # read as a ripple or a target, never as light. Filled, largest first, each one
    # brighter than the last, is how a lamp lands on tarmac.
    # ACT THREE DOUBLES IT: one working lamp on a block is what is left; two is what
    # somebody put back. The second one stands on the far kerb and throws the same
    # way, because one street has one light direction (BLDG-03).
    lamps = [(40, 61)] + ([(128, 82)] if act >= 3 else [])
    for (lx, ly) in lamps:
        for rr, a in ((22, 0.05), (17, 0.09), (13, 0.15), (9, 0.24), (6, 0.34)):
            d.ellipse([lx - rr, ly + 3 - rr // 2, lx + rr, ly + 3 + rr // 2],
                      fill=mix(ROAD, (255, 206, 120), a))
        d.rectangle([lx - 1, ly - 4, lx + 1, ly + 1], fill=night(shade(P[4], 1.9)))
        d.rectangle([lx - 1, ly + 1, lx + 1, ly + 3], fill=(255, 224, 154))

    # ---- *** THE ONE WRONG THING, IDENTICAL IN ALL THREE *** ---------------
    # The third house has its lights on. The census on this block says nobody lives
    # here. Nothing in the frame points at it; it is just on. THIS BLOCK IS OUTSIDE
    # EVERY `if act` in the file on purpose: it is the only thing on this street that
    # does not know which act it is in.
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

    return im


def lum(px):
    return px[0] * 299 + px[1] * 587 + px[2] * 114


def floor_check(a, b):
    """RULE 32(b) AS A NUMBER, NOT A PROMISE. Counts the pixels that got DARKER from
    one act to the next. The ruin is the floor; a later act may only add light and
    material, so a big darker count means the picture is telling him the world fell,
    which is the exact thing he ruled out."""
    pa, pb = a.load(), b.load()
    darker = brighter = 0
    for y in range(H):
        for x in range(W):
            da = lum(pb[x, y]) - lum(pa[x, y])
            if da < -6000:
                darker += 1
            elif da > 6000:
                brighter += 1
    return darker, brighter


def caption(P, text, right):
    """The strip above each panel. It is OUTSIDE the frame on purpose: bible rule 1
    wants nothing inside the picture pointing at the wrong thing, and a label inside
    the frame would be exactly that."""
    im = Image.new('RGB', (W, BAND), night(shade(P[0], 0.55)))
    d = ImageDraw.Draw(im)
    d.rectangle([0, BAND - 1, W - 1, BAND - 1], fill=night(shade(P[4], 1.3)))
    d.text((3, 2), text, fill=(226, 232, 226))
    d.text((W - 4 - 6 * len(right), 2), right, fill=(150, 168, 158))
    return im


def main():
    P = _pal()
    D, B = _row()

    acts = [panel(P, a) for a in (1, 2, 3)]
    d12 = floor_check(acts[0], acts[1])
    d23 = floor_check(acts[1], acts[2])
    if d12[0] > DARKER_ALLOWED or d23[0] > DARKER_ALLOWED:
        sys.exit('REFUSING TO WRITE THE PICTURE: rule 32(b) says the ruin is the floor '
                 'and nothing decays below the start, but %d pixels went darker from '
                 'act 1 to 2 and %d from act 2 to 3 (allowed %d). A picture that shows '
                 'him the world falling is worse than no picture.'
                 % (d12[0], d23[0], DARKER_ALLOWED))

    labels = [('ACT 1   THE RUIN', 'the floor'),
              ('ACT 2   RECLAIMED', 'power back'),
              ('ACT 3   IT PAYS', 'both sides')]
    sheet = Image.new('RGB', (W, (H + BAND) * 3), night(shade(P[0], 0.55)))
    for i, im in enumerate(acts):
        sheet.paste(caption(P, labels[i][0], labels[i][1]), (0, (H + BAND) * i))
        sheet.paste(im, (0, (H + BAND) * i + BAND))

    sheet = sheet.resize((W * SCALE, (H + BAND) * 3 * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)

    print('THE SAME STREET, THREE TIMES  (row [three cities], one block, three dates)')
    print('  THE SPINE: the street comes back twice and the empty house never does.')
    print('  act 1  the ruin, the picture he already voted up')
    print('  act 2  + road patched, power back, an array and a cabinet, line restrung')
    print('  act 3  + a second array across the road, kerbs and walks rebuilt, the')
    print('         lamp doubled, and the dead lot turned into a battery swap stand')
    print('  RULE 32(b) CHECKED, NOT PROMISED (darker pixels = the world falling):')
    print('    act 1 -> act 2     : %5d darker, %5d brighter' % (d12[0], d12[1]))
    print('    act 2 -> act 3     : %5d darker, %5d brighter' % (d23[0], d23[1]))
    print('    allowed darker     : %5d  (shadow and edge under new hardware only)'
          % DARKER_ALLOWED)
    print('  AND IT IS A REAL BLOCK, off a measured row (bible rule 7):')
    print('    measured on        : %s, overmap %s' % (D['measuredOn'], D['overmap']))
    print('    lamp ground live   : %d,  dark %d' % (D['live'], D['dark']))
    print('    LIT AND EMPTY      : %d blocks   (lit and lived in: %d)'
          % (D['litEmpty'], D['litLived']))
    print('    this block         : %s, %s, on %s wire'
          % (B['at'], B['district'], (B['wire'] or 'nobody’s')))
    print('  palette              : read live from engine/bohemia_suburb.js')
    print('  wrote                : %s (%d x %d)'
          % (OUT, W * SCALE, (H + BAND) * 3 * SCALE))


if __name__ == '__main__':
    main()
