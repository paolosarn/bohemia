#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the newest three bosses' map pieces, finished] (11/17/26; the coordinator's routine 'COOK FIVE full
sweep', VAMILY rules 453 and 441: 'finished art wherever a VOTE card still says STAND-IN and he meets it first, each its own
build: the newest bosses' map pieces (the Plate's wagon, the Tooth's collectors, the Lens's haze)').

BOSSES built what the ladder's 10th, 11th and 12th do to the map and painted a first piece for each
(tools/bohemia_bosses_ten_to_twelve_places_11_14_26.py: wagon, collector, haze); its three VOTE cards say STAND-IN. This is the
production artist's pass on the SAME six pictures (twelve files, two beat frames each): the same file names, the same frame
(THE NEXT THREE's, one street block across), the same rig. PICTURES ONLY. Nothing of BOSSES' code or rules is edited; this
lane's 11/14 tool (the gate, the mine, the nails) is imported for its capture, render, finish and colours, and through it
BOSSES' own. In slices/boss_places/boss_places.json only these six entries' own measurements are rewritten.

WHAT A PIECE IS: one street block across on the map, about nine pixels a metre: a thing under a third of a metre is nothing.
THE CAMERA SEES A THING'S TOP, ITS +x FACE AND ITS +y FACE. (Found here: the first collector's tooth and the first chart's
letters were painted on the -y face, the side nobody sees: the wall and the board were blank on the map.)
  WAGON      THE PLATE's armoured scrap wagon, rolling. BEFORE: a cart plated in pressed steel in a patchwork of what he had
             (no two plates one tone), a slit to see out front and side, a plough welded on its nose, teeth along its roof, a
             stovepipe, big wheels, and a lamp behind the slit that is lit while it rolls. AFTER: stripped to its frame and
             parked, a wheel off and flat, its plates off and stacked beside it, the bar they prised them off with.
  COLLECTOR  THE TOOTH's man at a town's gate. BEFORE: the wall with his TOOTH sprayed on it where you see it, a striped pole
             down across the way in, his man at a table with the take on it (a crate, batteries stood in a row, a jar) and a
             lantern that burns while he sits. AFTER: the pole in two on the ground, the table on its side, the crate open
             and empty, the stool kicked over. The tooth stays on the wall.
  HAZE       THE LENS's mark on his side. BEFORE: an eye test on a board (a big E, the rows under it) with an EYE sprayed
             over it, and his smoke pots burning round it on scorched ground. AFTER: the eye scrubbed off to a pale ghost,
             the letters clean, the pots cold and one on its side, the bucket and the brush left under the board.

  python3 tools/bohemia_cook5_the_newest_bosses_map_pieces_finished_11_17_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook5_the_newest_bosses_map_pieces_finished_11_17_26.py render
  python3 tools/bohemia_cook5_the_newest_bosses_map_pieces_finished_11_17_26.py finish
  python3 tools/bohemia_cook5_the_newest_bosses_map_pieces_finished_11_17_26.py sheet <before_dir> [page.png]

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): an improvised armoured truck as the
2010s' and 2020s' wars built them (scavenged plate of several thicknesses welded in overlapping patches, a vision slit, a
plough on the nose, no two alike); a market handcart's frame; a roadside toll as it is taken where nobody is asked (a pole on
a pivot, one man, a table, the take in the open); a Snellen eye chart (one big letter, rows that shrink) on a sign board; a
smudge pot (a cut drum burning oily rags, the ground black round it). The twins: BOSSES' own six at the same scale (the sheet
shows them side by side) and this lane's gate, mine and nails.
REUSE CHECK (REUSE-FIRST): this lane's 11/14 tool (bohemia_cook5_the_bosses_map_pieces_finished_11_14_26: scenes, render,
finish, its colours and its framed-panel maths) is imported and its tables set here, the way BOSSES' ten-to-twelve tool reuses
its seven-to-nine; BOSSES' body() for a man on a map piece, its blob() and over() for the beat frames; the district hero
factory's Scene. Only the six scenes and where their lights sit are new.
ANALOG HORROR: a steel cart with a lamp behind its slit; a tooth on a wall and a man who never looks up from the table; an eye
sprayed over an eye test, and the smoke that keeps you from seeing who put it there.
No reference game.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_bosses_map_pieces_finished_11_14_26 as C5      # this lane's (the gate, the mine, the nails)

ST, PB, NT, C = C5.ST, C5.PB, C5.NT, C5.C
OUT = os.path.join(R, 'records/target/cook5_bosses_newest')
DEST = C5.DEST
STEEL, STEEL_DK, CONC, CONC_DK, RUST, RUST_DK = ST.STEEL, ST.STEEL_DK, ST.CONC, ST.CONC_DK, ST.RUST, ST.RUST_DK
PLATE, PLATE_DK, PLATE_LT = (142, 140, 132), (98, 96, 92), (172, 170, 160)                 # BOSSES' plate, and one paler
TYRE, FRAME, GRIP, PAINT, BRASS = C5.TYRE, C5.FRAME, C5.GRIP, C5.PAINT, C5.BRASS
WOOD, WOOD_DK = (120, 88, 56), (86, 62, 40)
SPRAY, GHOST = (184, 38, 34), (196, 168, 158)
CASH = (52, 66, 54)
TOOTH = (214, 206, 186)
CHART, INK = (214, 210, 196), (38, 38, 40)
SMOKE, SOOT, ASH = (60, 58, 56), (40, 38, 36), (128, 124, 118)
POLE_R, POLE_W = (176, 46, 36), (220, 214, 200)
COAT, COAT_DK = (60, 56, 50), (40, 38, 34)
BATT = ((176, 120, 60), (70, 110, 120), (150, 44, 36))
LAMPBOX = (120, 96, 50)


# ---------------------------------------------------------------------------------------------------- THE PLATE's wagon
WAGON_LAMP = (7.46, 4.9, 1.45)                                # the lamp behind the front slit
WAGON_PIPE = (6.7, 4.3, 3.6)


def wheel_y(s, x, y, r=0.55, off=False):
    """a cart wheel seen from its side (its face is +y): the tyre, the hub"""
    for (w, z0, z1) in ((1.1 * r, 0.0, 0.3 * r), (1.7 * r, 0.3 * r, 0.6 * r), (2.0 * r, 0.6 * r, 1.4 * r), (1.7 * r, 1.4 * r, 1.7 * r), (1.1 * r, 1.7 * r, 2.0 * r)):   # round, in five courses
        s.box((x - w / 2, y, z0), (w, 0.24, z1 - z0), C(TYRE))
    s.box((x - 0.2, y + 0.24, r - 0.2), (0.4, 0.04, 0.4), C(STEEL)); s.box((x - 0.07, y + 0.28, r - 0.07), (0.14, 0.03, 0.14), C(FRAME))


def wagon(state):
    from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(31)
    if state == 'before':
        for x in (3.4, 6.5): wheel_y(s, x, 3.42); wheel_y(s, x, 6.14)
        s.box((2.4, 3.6, 0.55), (5.2, 2.6, 0.25), C(WOOD_DK))                                              # the cart under it
        s.box((2.6, 3.7, 0.8), (4.8, 2.4, 1.75), {'top': C(PLATE), 'px': C(PLATE_DK), 'py': C(PLATE_DK), 'nx': C(PLATE_DK), 'ny': C(PLATE_DK)})   # the box
        tones = (PLATE, PLATE_DK, PLATE_LT, RUST, STEEL, RUST_DK, PLATE)
        for row in range(2):                                   # its side: plates in overlapping patches, no two one tone
            x = 2.6
            while x < 7.3:
                w = min(rng.uniform(0.8, 1.3), 7.4 - x); z0 = 0.8 + row * 0.86 + rng.uniform(-0.04, 0.04)
                s.box((x, 6.1, z0), (w - 0.06, 0.06, 0.84), C(tones[rng.randint(len(tones))])); x += w
        for row in range(2):                                   # and its nose
            y = 3.7
            while y < 6.0:
                w = min(rng.uniform(0.7, 1.1), 6.1 - y); s.box((7.4, y, 0.8 + row * 0.86), (0.06, w - 0.06, 0.84), C(tones[rng.randint(len(tones))])); y += w
        s.box((7.46, 4.1, 1.9), (0.03, 1.6, 0.2), C((16, 16, 16)))                                         # the slit he sees you through
        s.box((3.4, 6.16, 1.95), (3.0, 0.03, 0.16), C((16, 16, 16)))                                       # and the one down its side
        s.box((7.46, 4.72, 1.3), (0.05, 0.36, 0.3), C(LAMPBOX))                                            # the lamp
        for (ya, yb) in ((3.7, 4.9), (6.1, 4.9)):              # the plough welded on its nose
            s.quad((7.4, ya, 0.3), (8.5, yb, 0.3), (8.5, yb, 1.25), (7.4, ya, 1.25), C(STEEL if ya > 5 else STEEL_DK))
        s.quad((7.4, 3.7, 1.25), (8.5, 4.9, 1.25), (8.5, 4.9, 1.25), (7.4, 6.1, 1.25), C(PLATE_LT), (0, 0, 1))
        k = 0; x = 2.7
        while x < 7.3: s.box((x, 5.92, 2.55), (0.14, 0.14, 0.4 if k % 2 else 0.3), C(STEEL)); x += 0.46; k += 1   # teeth along its roof
        y = 3.8
        while y < 5.9: s.box((7.22, y, 2.55), (0.14, 0.14, 0.34), C(STEEL)); y += 0.46
        s.box((4.0, 4.3, 2.55), (1.3, 1.1, 0.12), C(PLATE_DK)); s.box((4.1, 4.4, 2.67), (0.3, 0.14, 0.12), C(STEEL))   # the hatch
        s.prism(6.7, 4.3, 2.55, 0.16, 0.95, 8, C(SOOT), C(SOOT))                                           # the stovepipe
    else:
        for x in (3.4, 6.5): wheel_y(s, x, 3.42)
        wheel_y(s, 3.4, 6.14)
        s.box((6.2, 6.0, 0), (0.6, 0.5, 0.52), C(CONC_DK))                                                 # a block under the axle where the fourth wheel was
        s.prism(8.2, 7.2, 0, 0.56, 0.2, 12, C(TYRE), C(TYRE), inner=0.2)                                   # the fourth wheel, off and flat
        s.box((2.4, 3.6, 0.55), (5.2, 2.6, 0.25), C(WOOD_DK)); s.box((2.6, 3.7, 0.8), (4.8, 2.4, 0.12), C(WOOD))   # the bed, bare
        for (x, y) in ((2.6, 3.7), (7.26, 3.7), (2.6, 5.96), (7.26, 5.96), (4.9, 3.7), (4.9, 5.96)):       # its frame, stripped
            s.box((x, y, 0.92), (0.14, 0.14, 1.6), C(FRAME))
        s.box((2.6, 5.96, 2.44), (4.8, 0.14, 0.12), C(FRAME)); s.box((2.6, 3.7, 2.44), (4.8, 0.14, 0.12), C(FRAME))
        s.box((7.26, 3.7, 2.44), (0.14, 2.4, 0.12), C(FRAME)); s.box((2.6, 3.7, 2.44), (0.14, 2.4, 0.12), C(FRAME))
        s.box((2.6, 5.96, 1.6), (2.3, 0.1, 0.1), C(FRAME))
        tones = (PLATE, PLATE_DK, PLATE_LT, RUST, PLATE, STEEL, PLATE_DK, PLATE_LT)
        for k, t in enumerate(tones):                          # the plates off, stacked beside it
            s.box((0.5 + 0.08 * (k % 3), 6.9 + 0.1 * ((k * 2) % 3), k * 0.13), (2.1, 1.5, 0.11), C(t))
        s.quad((2.9, 7.2, 0.0), (2.9, 8.5, 0.0), (2.6, 8.5, 1.0), (2.6, 7.2, 1.0), C(RUST), (1, 0, 0.3))    # one leaning on the stack
        s.quad((4.2, 7.4, 0.04), (4.34, 7.3, 0.04), (5.9, 8.4, 0.04), (5.76, 8.5, 0.04), C(GRIP), (0, 0, 1)); s.box((5.8, 8.36, 0), (0.3, 0.2, 0.08), C(FRAME))   # the bar they prised them off with
    return s


# ---------------------------------------------------------------------------------------------------- THE TOOTH's collector
COLL_LAMP = (7.45, 8.05, 1.25)


def tooth(s, x, y, z, c):
    """his tooth, on a wall's +y face: the crown with its notch, two roots, the drips"""
    s.box((x, y, z + 0.62), (1.5, 0.03, 0.9), C(c)); s.box((x + 0.12, y, z + 1.52), (0.5, 0.03, 0.14), C(c)); s.box((x + 0.88, y, z + 1.52), (0.5, 0.03, 0.14), C(c))   # the crown, its two cusps
    s.box((x + 0.08, y, z + 0.2), (0.5, 0.03, 0.42), C(c)); s.box((x + 0.92, y, z + 0.2), (0.5, 0.03, 0.42), C(c))                                                     # the roots, shorter than the crown
    s.box((x + 0.2, y, z - 0.08), (0.26, 0.03, 0.28), C(c)); s.box((x + 1.04, y, z - 0.08), (0.26, 0.03, 0.28), C(c))                                                 # and their tips
    for dx, L in ((0.3, 0.3), (1.14, 0.18)): s.box((x + dx, y, z - 0.08 - L), (0.07, 0.03, L), C(c))                                                                   # the drips


def collector(state):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((0.8, 6.3, 0), (8.4, 0.5, 2.7), {'top': C(CONC), 'px': C(CONC_DK), 'py': C(CONC), 'nx': C(CONC_DK), 'ny': C(CONC_DK)})   # a stretch of the town's wall
    s.box((0.7, 6.24, 2.7), (8.6, 0.62, 0.16), C(CONC_DK))                                                 # its coping
    tooth(s, 2.2, 6.82, 0.75, SPRAY)                                                                       # his tooth, where it is seen
    s.box((1.3, 8.9, 0), (0.3, 0.3, 1.25), C(FRAME)); s.box((1.2, 8.8, 0), (0.5, 0.5, 0.16), C(CONC_DK))   # the pole's post
    if state == 'before':
        for k in range(9): s.box((1.5 + k * 0.7, 8.98, 1.0), (0.7, 0.14, 0.14), C(POLE_R if k % 2 == 0 else POLE_W))   # the pole, down across the way in
        s.box((7.8, 8.9, 0), (0.16, 0.3, 1.0), C(FRAME))                                                  # its rest
        ST.body(s, 5.2, 7.7, COAT, COAT_DK)                                                               # his man
        for (x, y) in ((6.2, 7.5), (7.6, 7.5), (6.2, 8.3), (7.6, 8.3)): s.box((x, y, 0), (0.1, 0.1, 0.75), C(WOOD_DK))
        s.box((6.1, 7.4, 0.75), (1.7, 1.1, 0.1), C(WOOD))                                                  # the table
        s.box((6.25, 7.5, 0.85), (0.7, 0.5, 0.38), {'top': C((30, 38, 32)), 'px': C(CASH), 'py': C(CASH), 'nx': C(CASH), 'ny': C(CASH)})   # the crate the take goes in
        for k, c in enumerate(BATT): s.prism(7.1 + 0.2 * k, 8.3, 0.85, 0.09, 0.3, 8, C(c), C(BRASS))        # batteries, stood in a row
        s.prism(7.25, 7.6, 0.85, 0.13, 0.3, 8, C(TOOTH), C(TOOTH))                                         # a jar
        s.box((7.36, 7.96, 0.85), (0.2, 0.2, 0.34), C(LAMPBOX)); s.box((7.4, 8.0, 1.19), (0.12, 0.12, 0.1), C(FRAME))   # the lantern
        s.box((5.2, 8.5, 0), (0.5, 0.5, 0.5), C(WOOD_DK))                                                  # his stool
    else:
        for k in range(4): s.box((1.6 + k * 0.7, 9.2 + 0.1 * k, 0.0), (0.7, 0.14, 0.14), C(POLE_R if k % 2 == 0 else POLE_W))   # the pole, in two on the ground
        for k in range(4): s.box((5.6 + k * 0.7, 8.9 - 0.16 * k, 0.0), (0.7, 0.14, 0.14), C(POLE_W if k % 2 == 0 else POLE_R))
        s.box((6.2, 7.5, 0), (1.7, 0.12, 1.1), C(WOOD))                                                    # the table, on its side
        for z in (0.1, 0.9): s.box((6.2, 7.0, z), (0.1, 0.5, 0.1), C(WOOD_DK)); s.box((7.8, 7.0, z), (0.1, 0.5, 0.1), C(WOOD_DK))
        s.box((4.2, 8.0, 0), (0.7, 0.5, 0.38), {'top': C((22, 24, 22)), 'px': C(CASH), 'py': C(CASH), 'nx': C(CASH), 'ny': C(CASH)})   # the crate, open and empty
        s.quad((4.2, 8.5, 0.38), (4.9, 8.5, 0.38), (4.9, 8.8, 0.8), (4.2, 8.8, 0.8), C(CASH), (0, 0.6, 0.6))  # its lid thrown back
        s.box((5.5, 8.9, 0), (0.5, 0.75, 0.3), C(WOOD_DK))                                                 # the stool, kicked over
        s.prism(7.3, 8.6, 0, 0.13, 0.06, 8, C(TOOTH), C(TOOTH)); s.box((7.6, 8.4, 0), (0.1, 0.1, 0.04), C(TOOTH)); s.box((7.1, 8.9, 0), (0.1, 0.1, 0.04), C(TOOTH))   # the jar, and what was in it
    return s


# ---------------------------------------------------------------------------------------------------- THE LENS's haze
POTS = ((1.9, 3.0), (7.6, 3.8), (2.6, 7.6))


def eye(s, y, c, pupil=True):
    """an eye on the board's +y face, the way a can draws one: two stepped lids, the pupil, the drips"""
    for (x0, x1, zt, zb) in ((4.3, 5.5, 2.5, 1.2), (3.75, 4.3, 2.34, 1.36), (5.5, 6.05, 2.34, 1.36), (3.4, 3.75, 2.14, 1.56), (6.05, 6.4, 2.14, 1.56)):
        s.box((x0, y, zt), (x1 - x0, 0.03, 0.16), C(c)); s.box((x0, y, zb), (x1 - x0, 0.03, 0.16), C(c))
    s.box((3.26, y, 1.78), (0.16, 0.03, 0.3), C(c)); s.box((6.38, y, 1.78), (0.16, 0.03, 0.3), C(c))
    if pupil:
        s.box((4.6, y, 1.62), (0.6, 0.03, 0.62), C(c))
        for dx, L in ((4.5, 0.5), (5.3, 0.3), (3.9, 0.24)): s.box((dx, y, 1.2 - L), (0.07, 0.03, L), C(c))


def haze(state):
    from bohemia_iso3d import Scene
    s = Scene(); f = 5.24
    for x in (3.2, 6.5): s.box((x, 5.0, 0), (0.16, 0.16, 3.1), C(WOOD))                                    # the board's two posts
    s.box((3.0, 5.12, 0.9), (3.8, 0.12, 2.1), {'top': C(CHART), 'px': C(CHART), 'py': C(CHART), 'nx': C(WOOD_DK), 'ny': C(WOOD_DK)})   # the eye test
    s.box((3.0, 5.1, 0.84), (3.8, 0.16, 0.06), C(WOOD_DK)); s.box((3.0, 5.1, 3.0), (3.8, 0.16, 0.06), C(WOOD_DK))
    s.box((4.55, f, 2.42), (0.14, 0.02, 0.5), C(INK))                                                      # the big E
    for z in (2.42, 2.61, 2.8): s.box((4.55, f, z), (0.6 if z != 2.61 else 0.44, 0.02, 0.12), C(INK))
    for row, (n, w) in enumerate(((3, 0.34), (4, 0.26), (6, 0.16), (8, 0.1))):                             # the rows under it, smaller each one
        z = 2.14 - row * 0.3; span = 3.0; x0 = 4.9 - span / 2
        for k in range(n): s.box((x0 + (k + 0.5) * span / n - w / 2, f, z), (w, 0.02, max(0.08, w * 0.6)), C(INK))
    if state == 'before':
        eye(s, f + 0.02, SPRAY)                                                                            # an eye, sprayed over it
        for (x, y) in POTS:                                    # his smoke pots, burning, the ground black round them
            s.prism(x, y, 0, 0.95, 0.012, 11, C(SOOT), C(SOOT)); s.prism(x, y, 0.012, 0.44, 0.62, 10, C(RUST_DK), C(SOOT), inner=0.36)
            s.prism(x, y, 0.012, 0.36, 0.5, 8, C(SOOT), C((92, 44, 24)))
    else:
        eye(s, f + 0.02, GHOST, pupil=False)                                                               # scrubbed to a ghost
        for i, (x, y) in enumerate(POTS):                      # the pots, cold; one on its side
            s.prism(x, y, 0, 0.95, 0.012, 11, C(SOOT), C(SOOT))
            if i == 1: s.box((x - 0.5, y - 0.3, 0.012), (0.95, 0.62, 0.6), C(RUST_DK)); s.prism(x + 0.9, y + 0.2, 0.012, 0.5, 0.03, 8, C(ASH), C(ASH))
            else: s.prism(x, y, 0.012, 0.44, 0.62, 10, C(RUST_DK), C(ASH), inner=0.36); s.prism(x, y, 0.012, 0.36, 0.4, 8, C(SOOT), C(ASH))
        s.prism(5.6, 6.2, 0, 0.34, 0.6, 10, C(C5.BUCKET_DK), C(C5.BUCKET), inner=0.28); s.prism(5.6, 6.2, 0, 0.28, 0.46, 8, C(GHOST), C(GHOST))   # the bucket, its water pink
        s.box((4.6, 6.3, 0), (0.6, 0.26, 0.18), C((60, 50, 40))); s.box((4.8, 6.36, 0.18), (0.16, 0.12, 0.5), C(WOOD))   # and the brush
    return s


PIECES = [('wagon', wagon, ('before', 'after')), ('collector', collector, ('before', 'after')), ('haze', haze, ('before', 'after'))]
KEYS = ('wagon_before', 'wagon_after', 'collector_before', 'collector_after', 'haze_before', 'haze_after')
SAY = dict(wagon_before='THE WAGON, ROLLING', wagon_after='STRIPPED', collector_before='THE COLLECTOR', collector_after='GONE', haze_before='THE HAZE', haze_after='SCRUBBED')


def moving(sc, frame):
    """what moves on the beat: the lamp behind the wagon's slit and the breath of its stovepipe; the collector's lantern; the
    pots' embers and their smoke, one way then the other"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: NT.P(sc, p); key = sc['key']
    if key == 'wagon_before':
        x, y = PJ(WAGON_LAMP); blob(L, x, y, 5.5, (255, 196, 110), 0.5 if frame else 0.22); blob(L, x, y, 2.2, (255, 236, 180), 1.0 if frame else 0.55)
        x, y = PJ(WAGON_PIPE); blob(L, x + (2 if frame else -1), y - (4 if frame else 1), 4.2, (88, 84, 80), 0.5)
    elif key == 'collector_before':
        x, y = PJ(COLL_LAMP); blob(L, x, y, 5.0, (255, 190, 100), 0.5 if frame else 0.28); blob(L, x, y, 2.0, (255, 232, 170), 1.0 if frame else 0.6)
    elif key == 'haze_before':
        for i, (a, b) in enumerate(POTS):
            x, y = PJ((a, b, 0.66)); blob(L, x, y, 2.0, (255, 120, 40), 0.9 if (i % 2) == frame else 0.4)
            x, y = PJ((a, b, 1.5)); blob(L, x + (2 if frame else -2), y - (3 if frame else 0), 6.5, (112, 108, 104), 0.5)
            x, y = PJ((a, b, 2.6)); blob(L, x + (4 if frame else -3), y - (2 if frame else 0), 8.0, (120, 116, 112), 0.3)
    return L


def bind():
    """this lane's 11/14 tool runs with this file's pieces, folder and lights (BOSSES' own way of reusing a tool)"""
    C5.PIECES, C5.OUT, C5.moving = PIECES, OUT, moving


def finish():
    bind(); C5.finish()
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    for k in KEYS: man['pictures'][k]['finished'] = 'cook 5, 11/17'
    note = ' COOK FIVE 11/17 (rule 453, tools/bohemia_cook5_the_newest_bosses_map_pieces_finished_11_17_26.py): THE PLATE\'s WAGON, THE TOOTH\'s COLLECTOR and THE LENS\'s HAZE redrawn as finished pieces, the same keys, frame and rig.'
    if 'COOK FIVE 11/17' not in man['about']: man['about'] += note
    json.dump(man, open(mp, 'w'), indent=1)


def sheet(before_dir, page=None):
    """records/target/COOK5_THE_NEWEST_BOSSES_MAP_PIECES_11_17.webp: each piece as it was (BOSSES', from before_dir) beside the
    same piece finished, on the map's own asphalt tone at three times the picture's pixels, and the map shots if given"""
    from PIL import Image, ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1290; INK_, DIM, BG, ROAD = (232, 222, 196), (150, 140, 118), (16, 14, 12), (74, 70, 64); rows = []; k = 2
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK_)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    def strip2(keys):
        ims = [(SAY[key] + (', THE FIRST ONE' if folder == before_dir else ''), Image.open(os.path.join(folder, key + '_0.png')).convert('RGBA')) for folder in (before_dir, DEST) for key in keys]
        cw = (WID - 30) // 4; ch = max(i.height for _, i in ims) * k + 30; r = Image.new('RGB', (WID, ch), BG); d = ImageDraw.Draw(r); x = 0
        for lab, im in ims:
            cell = Image.new('RGBA', (cw, ch - 26), ROAD + (255,)); big = im.resize((im.width * k, im.height * k), Image.NEAREST)
            cell.alpha_composite(big, ((cw - big.width) // 2, (ch - 26 - big.height) // 2)); r.paste(cell.convert('RGB'), (x, 26)); d.text((x + 4, 4), lab, font=font(14), fill=INK_); x += cw + 10
        rows.append(r)
    title('THE PLATE\'S ARMOURED WAGON', 'left pair: the first one (BOSSES\'). right pair: finished. Twice the map\'s own pixels')
    strip2(KEYS[:2]); first_row = len(rows) - 1
    title('THE TOOTH\'S COLLECTOR AT A TOWN\'S GATE', 'left pair: the first one. right pair: finished'); strip2(KEYS[2:4])
    title('THE LENS\'S HAZE', 'left pair: the first one. right pair: finished'); strip2(KEYS[4:])
    if page and os.path.exists(page):
        title('ON THE MAP, ON HIS PHONE', 'top: while each of the three stands (the Plate, the Tooth, the Lens). bottom: after he falls. The game\'s own camera, 390 x 844')
        n = Image.open(page).convert('RGB'); rows.append(n.resize((WID, int(n.height * WID / n.width)), Image.LANCZOS))
    out = Image.new('RGB', (WID, sum(q.height + 8 for q in rows)), BG); y = 0; fy = 0
    for i, q in enumerate(rows):
        out.paste(q, (0, y))
        if i == first_row: fy = y
        y += q.height + 8
    dst = os.path.join(R, 'records/target/COOK5_THE_NEWEST_BOSSES_MAP_PIECES_11_17.webp'); out.save(dst, 'WEBP', quality=74, method=6)
    cw = (WID - 30) // 4; h = rows[first_row].height - 26; first = out.crop((2 * (cw + 10), fy + 26, 2 * (cw + 10) + cw, fy + 26 + h))
    first.save(os.path.join(R, 'records/target/vote_first/cook5-the-newest-bosses-map-pieces-11-17.webp'), 'WEBP', quality=80, method=6)
    print('sheet', out.size, os.path.getsize(dst), 'first at', (2 * (cw + 10), fy + 26, cw, h))


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'
    if cmd == 'scenes': bind(); C5.scenes()
    elif cmd == 'render': bind(); C5.render()
    elif cmd == 'finish': finish()
    elif cmd == 'sheet': sheet(a[1], a[2] if len(a) > 2 else None)
    else: print(__doc__)
