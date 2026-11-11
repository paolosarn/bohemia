#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [seven to nine: their places, what their verbs leave, and what each one does to the map] (11/11/26, the coordinator's
round 'the next three from the ladder'; rule 441; ask lines 167, 522).

THE LOCKSMITH, THE CHARGE, THE MACHINIST (the ladder's 7th, 8th, 9th, records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows 82-84). Painted
exactly the way BOSSES painted the first six: the district hero factory's own parts in two states, through COOK's master rig, what moves
on the beat laid over in two frames (tools/bohemia_bosses_paint_four_to_six_11_3_26.py's capture for a place and a prop, and
tools/bohemia_bosses_the_next_three_11_10_26.py's capture for a piece on a street block, both imported and never edited).

  THE LOCK SHOP     a brick shopfront with a KEY SIGN on a bracket over the door. BEFORE: the steel shutter down, a heavy chain across it
                    and his padlock, the windows dark. AFTER: the shutter rolled up, the shop lit, a board of keys out front for anybody.
  THE POWDER YARD   a quarry's magazine (the concrete bunker quarries keep explosives in) behind a wall of concrete barriers.
                    BEFORE: the red blasting flag up, a plunger box on a crate, its wire to the wall. AFTER: a HOLE blown through his own
                    wall, rubble, the flag down, the magazine door open and its crates out.
  THE PIPE SHOP     a corrugated steel workshop, a pipe rack out front, a gas bottle cage. BEFORE: the door down, the blue-white of a weld
                    flickering through the gap under it (he is in there, making guns). AFTER: the door up, a bench out front, lit warm.
  and what each verb leaves on a block: A CUT LOCK (PICK), RUBBLE (BLOW), A WELDING BENCH (WELD).
  and the piece each one leaves on a street block, ONE block across, no ground (THE NEXT THREE's frame, 1.6 times the line cooks):
  CURFEW   THE LOCKSMITH's gate across a street. NIGHT: two chain-link panels shut, a chain wrapped round and his padlock, his key
           sprayed on a panel. DAY: the panels swung back to the kerbs, the chain hanging with the padlock on it. AFTER: a panel down
           flat on the street, the chain cut in two.
  MINE     THE CHARGE's mine, once you know it is there. BEFORE: his stake with a red rag, a patch of dug dirt, a wire out of it.
           AFTER: the hole, the can pulled out of it and its wires cut, the stake thrown down.
  NAILS    THE MACHINIST's nails across a street. BEFORE: nails and welded caltrops over the block, a shredded tyre. AFTER: swept, a
           push broom leaning on a bucket of nails, a cart's two tracks down a clean street.

  python3 tools/bohemia_bosses_seven_to_nine_places_11_11_26.py scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish

REFERENCE CHECK (the 9/4 standing duty): the twins are the first six places and THE NEXT THREE's pieces at the same scale
(records/target/bosses_seven_to_nine/compare.png); the real things: a locksmith's shopfront with a projecting key sign and a roll-down
security shutter, a 13 mm chain and a laminated padlock; a quarry's explosives magazine (a reinforced concrete bunker with a steel
door), jersey barriers, a red blasting flag; a metal fabricator's shop with a roll-up door and a horizontal pipe rack, an oxy-acetylene
bottle cage; a chain-link construction gate, a buried can charge, welded road caltrops (the four-point star they throw in strikes).
No reference game.
ANALOG HORROR: a chained shutter and a street gate that locks at dark; a red flag on a wall nobody is meant to come through and a rag
on a stick over dug dirt; a weld's blue light under a shut door and a street full of nails. After: keys on a board, a hole you can walk
through, a broom and a clean road.
"""
import os, sys, json, math, pickle, subprocess
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_paint_their_places_11_2_26 as PB
import bohemia_bosses_paint_four_to_six_11_3_26 as P4
import bohemia_bosses_the_next_three_11_10_26 as NT

OUT = os.path.join(R, 'records/target/bosses_seven_to_nine')
DEST = PB.DEST
HF, win = PB.HF, PB.win
STEEL, STEEL_DK, CONC, CONC_DK, ROOF, ROOF_DK = PB.STEEL, PB.STEEL_DK, PB.CONC, PB.CONC_DK, PB.ROOF, PB.ROOF_DK
BRICK, BRICK_DK, RUST, RUST_DK = PB.BRICK, PB.BRICK_DK, PB.RUST, PB.RUST_DK
BRASS, BRASS_DK = (178, 146, 62), (128, 102, 40)
SHUTTER, SHUTTER_DK = (120, 122, 118), (84, 86, 84)
CHAIN = (70, 70, 68)
KEYBOARD = (128, 96, 62)
REDFLAG = (176, 40, 30)
BARRIER, BARRIER_DK = (156, 152, 142), (120, 116, 108)
GRAVEL = (132, 124, 110)
DIRT, DIRT_DK = (110, 98, 80), (78, 68, 54)
CRATE, CRATE_DK = (138, 108, 70), (100, 78, 50)
TIN, TIN_DK = (150, 152, 146), (100, 102, 98)
WIRE = (176, 46, 36)
RAG = (182, 42, 34)
STICK = (150, 120, 80)
NAIL = (62, 62, 60)
TYRE = (30, 30, 30)
BROOM = (176, 150, 80)
BUCKET, BUCKET_DK = (96, 104, 108), (66, 72, 76)
CORR, CORR_DK = (136, 140, 138), (100, 104, 104)
PIPE = (110, 108, 102)
BOTTLE, BOTTLE2 = (150, 44, 36), (60, 86, 70)
FENCE = (130, 132, 128)
BENCH = (110, 82, 54)


# ---------------------------------------------------------------------------------------------------- THE PLACES (P4's frame)
def lockshop(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (8.0, 6.0, 4.4), {'top': {'c': ROOF}, 'px': win(BRICK, 2, 1, after, 41), 'py': win(BRICK_DK, 3, 1, after, 42), 'nx': {'c': BRICK_DK}, 'ny': {'c': BRICK}})
    s.box((-0.05, -0.05, 4.3), (8.1, 6.1, 0.45), {'c': CONC_DK})                                   # the parapet
    H._door_face(s, (0, 0, 0), (8.0, 6.0, 4.4), width=1.4, ztop=2.4)
    s.box((5.0, 6.0, 3.2), (0.12, 1.2, 0.12), {'c': STEEL_DK})                                       # the sign's bracket, out over the street
    s.prism(5.06, 7.0, 2.3, 0.42, 0.14, 14, {'c': BRASS}, {'c': BRASS_DK}, inner=0.22)               # THE KEY: its bow (a ring, hung flat to the street)
    s.box((4.98, 7.0, 0.9), (0.16, 0.16, 1.4), {'c': BRASS})                                         # its shank, hanging
    s.box((4.98, 7.16, 0.95), (0.16, 0.3, 0.2), {'c': BRASS_DK}); s.box((4.98, 7.16, 1.3), (0.16, 0.22, 0.18), {'c': BRASS_DK})   # its bit
    if not after:
        s.box((0.4, 6.0, 0), (7.2, 0.25, 2.9), {'c': SHUTTER})                                       # the shutter down, all the way
        for k in range(9): s.box((0.4, 6.22, 0.3 + k * 0.3), (7.2, 0.04, 0.05), {'c': SHUTTER_DK})  # its slats
        for k in range(14): s.box((0.6 + k * 0.5, 6.28, 1.15 + 0.12 * math.sin(k * 0.45)), (0.36, 0.08, 0.1), {'c': CHAIN})   # a heavy chain across it
        s.box((3.7, 6.32, 0.8), (0.42, 0.14, 0.4), {'c': BRASS})                                     # his padlock
    else:
        s.box((0.3, 6.0, 2.9), (7.4, 0.5, 0.45), {'c': SHUTTER_DK})                                  # the shutter rolled up in its box
        s.box((1.0, 7.4, 0.2), (0.12, 0.12, 2.4), {'c': KEYBOARD}); s.box((3.4, 7.4, 0.2), (0.12, 0.12, 2.4), {'c': KEYBOARD})
        s.box((0.9, 7.5, 1.0), (2.7, 0.1, 1.4), {'c': KEYBOARD})                                     # the board of keys, out front
        for i in range(6):
            for j in range(3): s.box((1.1 + i * 0.4, 7.6, 1.15 + j * 0.42), (0.1, 0.03, 0.26), {'c': BRASS})
    return s


def powderyard(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 13), groundc=GRAVEL)
    s.box((1.0, 1.0, 0), (5.0, 4.0, 2.6), {'top': {'c': CONC_DK}, 'px': {'c': CONC}, 'py': {'c': CONC_DK}, 'nx': {'c': CONC_DK}, 'ny': {'c': CONC}})   # the magazine
    s.box((0.7, 0.7, 2.6), (5.6, 4.6, 0.5), {'c': DIRT})                                             # the earth on its roof
    s.box((2.9, 5.0, 0), (1.3, 0.12, 2.0), {'c': STEEL_DK if not after else (30, 30, 30)})          # its steel door (open: a dark doorway)
    if after: s.box((4.3, 5.1, 0), (0.12, 1.3, 2.0), {'c': STEEL_DK})                                # the door swung open
    s.prism(9.0, 3.0, 0, 2.2, 1.6, 16, {'c': GRAVEL}, {'c': DIRT_DK})                                # a gravel pile
    gap = range(3, 6) if after else ()
    for k in range(11):                                                                              # his wall: concrete barriers, front
        if k in gap: continue
        s.box((-0.5 + k * 1.1, 8.0, 0), (1.0, 0.6, 1.3), {'top': {'c': BARRIER}, 'px': {'c': BARRIER}, 'py': {'c': BARRIER}, 'nx': {'c': BARRIER_DK}, 'ny': {'c': BARRIER_DK}})
    for k in range(7): s.box((11.2, -0.5 + k * 1.2, 0), (0.6, 1.1, 1.3), {'top': {'c': BARRIER}, 'px': {'c': BARRIER}, 'py': {'c': BARRIER_DK}, 'nx': {'c': BARRIER_DK}, 'ny': {'c': BARRIER}})
    s.box((7.5, 6.2, 0), (0.12, 0.12, 4.2), {'c': STEEL})                                            # the flag pole
    if not after:
        s.box((7.62, 6.2, 3.4), (1.4, 0.06, 0.8), {'c': REDFLAG})                                    # the red flag, up: he is blasting
        s.box((8.2, 6.8, 0), (1.0, 0.8, 0.8), {'c': CRATE}); s.box((8.45, 7.0, 0.8), (0.5, 0.4, 0.4), {'c': (40, 40, 38)})   # the plunger box on a crate
        s.box((8.62, 7.15, 1.2), (0.06, 0.06, 0.5), {'c': STEEL}); s.box((8.42, 7.12, 1.66), (0.46, 0.12, 0.08), {'c': STEEL})
        for k in range(6): s.box((8.6 - k * 0.7, 7.3 + 0.06 * (k % 2), 0.02), (0.6, 0.06, 0.04), {'c': WIRE})   # its wire to the wall
    else:
        s.box((7.62, 6.2, 0.6), (0.06, 0.6, 0.06), {'c': REDFLAG})                                    # the flag down, on the ground
        for (x, y, h) in ((2.9, 8.2, 0.5), (3.6, 9.0, 0.35), (4.6, 8.4, 0.45), (5.4, 9.2, 0.3), (2.5, 9.4, 0.3), (4.0, 7.6, 0.25)):
            s.box((x, y, 0), (0.55, 0.45, h), {'c': BARRIER_DK})                                     # the rubble of the hole
        for (x, y) in ((5.6, 6.0), (6.6, 6.4)): s.box((x, y, 0), (0.8, 0.7, 0.6), {'c': CRATE_DK})   # his crates out, empty
    return s


def pipeshop(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (8.5, 6.0, 4.6), {'top': {'c': CORR_DK}, 'px': {'c': CORR}, 'py': {'c': CORR}, 'nx': {'c': CORR_DK}, 'ny': {'c': CORR_DK}})
    for k in range(18): s.box((0.2 + k * 0.46, 6.0, 0), (0.06, 0.04, 4.6), {'c': CORR_DK})           # the corrugation
    s.box((-0.1, -0.1, 4.6), (8.7, 6.2, 0.3), {'c': ROOF_DK})
    if not after:
        s.box((2.0, 6.02, 0.12), (4.2, 0.1, 3.3), {'c': SHUTTER_DK})                                  # the door down (a gap under it)
    else:
        s.box((2.0, 6.02, 0), (4.2, 0.06, 3.4), {'c': (40, 36, 32)})                                  # the door up, the shop open
        s.box((2.0, 6.0, 3.4), (4.2, 0.4, 0.4), {'c': SHUTTER_DK})
        s.box((2.6, 7.4, 0), (2.8, 1.0, 1.0), {'c': BENCH}); s.box((2.8, 7.6, 1.0), (1.8, 0.12, 0.12), {'c': PIPE})   # a bench out front, a pipe on it
    for x in (6.8, 8.6): s.box((x, 7.0, 0), (0.15, 1.4, 1.6), {'c': STEEL_DK})                     # the pipe rack, out front to the right
    for j in range(2):
        for i in range(5): s.box((6.7, 7.1 + i * 0.26, 0.6 + j * 0.6), (2.2, 0.2, 0.2), {'c': PIPE})
    s.box((-1.4, 2.0, 0), (1.2, 1.6, 1.8), {'c': FENCE})                                             # the gas bottle cage
    for i, c in enumerate((BOTTLE, BOTTLE2, BOTTLE)): s.prism(-1.0, 2.4 + i * 0.45, 0, 0.18, 1.6, 10, {'c': c}, {'c': c})
    return s


def cutlock(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-0.3, -0.2, 0), (0.6, 0.3, 0.5), {'c': BRASS})                                            # a padlock lying open
    s.box((-0.22, -0.16, 0.5), (0.08, 0.08, 0.36), {'c': STEEL}); s.box((-0.22, -0.16, 0.86), (0.5, 0.08, 0.08), {'c': STEEL})
    for k in range(7): s.box((0.3 + 0.14 * math.cos(k), -0.5 + k * 0.18, 0), (0.24, 0.12, 0.1), {'c': CHAIN})   # the chain off it
    return s


def rubble(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    for (x, y, h) in ((-0.6, -0.4, 0.45), (0.2, -0.6, 0.3), (0.6, 0.1, 0.4), (-0.2, 0.5, 0.35), (-0.8, 0.4, 0.25), (0.5, 0.7, 0.2)):
        s.box((x, y, 0), (0.42, 0.38, h), {'c': BARRIER_DK if (x + y) > 0 else BARRIER})
    s.box((-0.1, -0.1, 0), (0.12, 0.12, 0.7), {'c': STEEL_DK})                                       # a bar of rebar sticking up
    return s


def weldbench(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-0.7, -0.4, 0), (1.4, 0.8, 0.8), {'c': BENCH})
    s.box((-0.6, -0.1, 0.8), (1.1, 0.14, 0.14), {'c': PIPE}); s.box((0.45, -0.14, 0.78), (0.2, 0.22, 0.22), {'c': STEEL})   # a pipe, its cap
    s.prism(1.0, 0.2, 0, 0.2, 1.3, 10, {'c': BOTTLE}, {'c': BOTTLE})                                 # the gas bottle
    s.box((0.9, 0.0, 1.3), (0.1, 0.4, 0.06), {'c': (40, 40, 38)})                                    # its hose
    return s


PLACES = {'lockshop': lockshop, 'powderyard': powderyard, 'pipeshop': pipeshop}
PROPS = {'cutlock': cutlock, 'rubble': rubble, 'weldbench': weldbench}


# ---------------------------------------------------------------------------------------------------- THE PIECES ON A BLOCK (NT's frame)
body = NT.body


def curfew(state):
    from bohemia_iso3d import Scene
    s = Scene()
    for x in (1.2, 8.6): s.box((x, 5.0, 0), (0.22, 0.22, 2.6), {'c': STEEL_DK})                       # the two posts, kerb to kerb
    if state == 'night':
        for x0 in (1.4, 5.0):                                                                         # two panels shut across the street
            s.box((x0, 5.04, 0.1), (3.6, 0.08, 2.3), {'c': FENCE})
            for k in range(7): s.box((x0 + k * 0.55, 5.0, 0.1), (0.05, 0.16, 2.3), {'c': STEEL})
        for k in range(5): s.box((4.6 + 0.16 * (k % 2), 4.86, 0.9 + k * 0.18), (0.6, 0.36, 0.1), {'c': CHAIN})   # his chain round the middle
        s.box((4.75, 4.76, 0.5), (0.36, 0.16, 0.36), {'c': BRASS})                                    # his padlock
        s.box((2.2, 4.98, 1.0), (1.3, 0.04, 0.2), {'c': (200, 196, 186)}); s.prism(2.0, 4.98, 1.05, 0.22, 0.04, 10, {'c': (200, 196, 186)}, {'c': (200, 196, 186)}, inner=0.1)   # his key, sprayed
    elif state == 'day':
        s.box((1.4, 5.2, 0.1), (0.08, 3.4, 2.3), {'c': FENCE}); s.box((8.5, 5.2, 0.1), (0.08, 3.4, 2.3), {'c': FENCE})   # swung back to the kerbs
        for k in range(5): s.box((8.3, 5.3 + k * 0.32, 1.2 - k * 0.16), (0.3, 0.26, 0.1), {'c': CHAIN})   # the chain hanging off a post
        s.box((8.25, 6.85, 0.36), (0.36, 0.16, 0.36), {'c': BRASS})
    else:
        s.box((1.4, 5.2, 0.1), (0.08, 3.4, 2.3), {'c': FENCE})                                       # one panel back
        s.box((4.0, 4.0, 0.0), (3.6, 2.3, 0.08), {'c': FENCE})                                       # the other down flat on the street
        for k in range(3): s.box((2.2 + k * 0.4, 7.6, 0), (0.34, 0.2, 0.1), {'c': CHAIN})             # the chain, cut in two
        for k in range(3): s.box((7.6 + k * 0.4, 3.2, 0), (0.34, 0.2, 0.1), {'c': CHAIN})
        s.box((6.4, 7.4, 0), (0.36, 0.3, 0.16), {'c': BRASS})
    return s


def mine(state):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((3.6, 4.0, 0), (2.6, 2.2, 0.06), {'c': DIRT_DK})                                            # the dug patch
    if state == 'before':
        s.box((6.6, 3.2, 0), (0.12, 0.12, 1.9), {'c': STICK}); s.box((6.72, 3.2, 1.4), (0.08, 0.6, 0.45), {'c': RAG})   # his stake, a red rag
        s.prism(4.9, 5.1, 0.06, 0.45, 0.12, 12, {'c': DIRT}, {'c': DIRT})                            # the mound over it
        for k in range(5): s.box((5.3 + k * 0.5, 5.4 + 0.1 * (k % 2), 0.02), (0.44, 0.05, 0.04), {'c': WIRE})   # a wire out of it
    else:
        s.prism(4.9, 5.1, 0, 0.5, 0.08, 12, {'c': (40, 34, 28)}, {'c': (40, 34, 28)})                # the hole
        s.prism(6.4, 6.4, 0, 0.32, 0.6, 12, {'c': TIN}, {'c': TIN_DK})                               # the can, pulled out
        for k in range(3): s.box((6.7 + k * 0.4, 6.5, 0), (0.34, 0.05, 0.04), {'c': WIRE})           # its wires, cut
        s.box((2.4, 6.8, 0), (1.9, 0.12, 0.12), {'c': STICK}); s.box((2.3, 6.7, 0.02), (0.5, 0.3, 0.06), {'c': RAG})   # his stake, thrown down
    return s


def nails(state):
    from bohemia_iso3d import Scene
    s = Scene()
    if state == 'before':
        rng = np.random.RandomState(9)
        for _ in range(70):
            x, y = 1.0 + rng.rand() * 8.0, 1.0 + rng.rand() * 8.0
            s.box((x, y, 0), (0.22, 0.05, 0.05) if rng.rand() < 0.5 else (0.05, 0.22, 0.05), {'c': NAIL})   # the nails, everywhere
        for (x, y) in ((3.0, 3.4), (6.2, 4.8), (4.4, 7.0), (7.4, 7.6)):                               # his welded caltrops, four points
            s.box((x - 0.3, y - 0.04, 0), (0.6, 0.08, 0.08), {'c': STEEL}); s.box((x - 0.04, y - 0.3, 0), (0.08, 0.6, 0.08), {'c': STEEL})
            s.box((x - 0.04, y - 0.04, 0), (0.08, 0.08, 0.42), {'c': STEEL})
        s.prism(2.4, 7.4, 0, 0.7, 0.24, 14, {'c': TYRE}, {'c': TYRE}, inner=0.4)                     # a shredded tyre
    else:
        s.box((1.0, 3.4, 0.0), (8.0, 0.16, 0.02), {'c': (70, 66, 60)}); s.box((1.0, 5.4, 0.0), (8.0, 0.16, 0.02), {'c': (70, 66, 60)})   # a cart's two tracks
        s.prism(6.8, 7.0, 0, 0.42, 0.7, 12, {'c': BUCKET}, {'c': BUCKET_DK}, inner=0.36)              # a bucket full of nails
        s.prism(6.8, 7.0, 0.5, 0.36, 0.08, 12, {'c': NAIL}, {'c': NAIL})
        s.box((6.1, 6.7, 0.0), (0.1, 0.1, 2.0), {'c': BROOM}); s.box((5.8, 6.6, 0.0), (0.7, 0.3, 0.22), {'c': (60, 50, 40)})   # the push broom, leaning
    return s


PIECES = [('curfew', curfew, ('night', 'day', 'after')), ('mine', mine, ('before', 'after')), ('nails', nails, ('before', 'after'))]


def scenes():
    os.makedirs(OUT, exist_ok=True)
    P4.PLACES.update(PLACES); P4.PROPS.update(PROPS)          # P4's capture asks its own two tables which kind a name is (in memory)
    S = []
    for n, f in PLACES.items():
        for a in (False, True):
            sc = P4.capture(n, f, a, PB.PLATE_PX); sc['key'] = n + ('_after' if a else '_before'); S.append(sc)
    for n, f in PROPS.items():
        sc = P4.capture(n, f, False, PB.PROP_PX); sc['key'] = n; S.append(sc)
    for n, f, states in PIECES:
        got = []
        for st in states:
            sc = NT.capture(n, (lambda _a, f=f, st=st: f(st)), st != states[0])
            sc['key'] = '%s_%s' % (n, st); sc['district'] = 'boss_%s_%s' % (n, st); sc['state'] = st; sc['piece'] = True; got.append(sc)
        if len(set((g['w'], g['h']) for g in got)) > 1:      # one frame for every state (the tape draws them all into one box)
            W = max(g['w'] for g in got); Hh = max(g['h'] for g in got)
            print('  %s: states %s, framed %dx%d' % (n, [(g['w'], g['h']) for g in got], W, Hh))
        S += got
    pickle.dump(S, open(os.path.join(OUT, 'scenes.pkl'), 'wb'))
    print('captured', len(S), 'scenes')


def render():
    py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    for i, sc in enumerate(S):
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        if os.path.exists(fn): continue
        code = ('import sys,pickle; sys.path.insert(0, %r); import bohemia_cook_the_map_through_the_rig_10_20_26 as M; '
                'M.OUT=%r; M.MASTERS=%r; sc=pickle.load(open(%r,"rb"))[%d]; fn=M.render(sc["district"], sc); print(M.finish(sc["district"], sc, fn))'
                % (os.path.join(R, 'tools'), OUT, os.path.join(OUT, 'masters'), os.path.join(OUT, 'scenes.pkl'), i))
        rc = subprocess.call([py, '-c', code], cwd=R, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print('  rendered', sc['district'], 'ok' if os.path.exists(fn) else 'FAILED (rc %d)' % rc, flush=True)


def moving(sc, frame):
    """what moves on the beat: his padlock glints at night; the red flag in the wind and the plunger's handle; the weld's blue light
    under his door; the rag on the mine's stake; the nails glint"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    proj, blob = PB.proj, PB.blob
    key = sc['key']
    PJ = (lambda p: NT.P(sc, p)) if sc.get('piece') else (lambda p: proj(sc, p))
    if key == 'lockshop_before':
        x, y = PJ((3.9, 6.4, 1.0)); blob(L, x, y, 2.2, (255, 230, 150), 0.7 if frame else 0.2)
    elif key == 'lockshop_after':
        x, y = PJ((4.0, 6.2, 1.6)); blob(L, x, y, 12, (255, 220, 150), 0.24 if frame else 0.18)
    elif key == 'powderyard_before':
        x, y = PJ((8.4, 6.23, 3.8)); blob(L, x + (2 if frame else -1), y, 3.0, REDFLAG, 0.8)
    elif key == 'pipeshop_before':
        x, y = PJ((4.1, 6.1, 0.08)); blob(L, x, y, 9.0, (170, 200, 255), 0.85 if frame else 0.25); blob(L, x, y, 3.4, (240, 248, 255), 0.9 if frame else 0.3)
    elif key == 'pipeshop_after':
        x, y = PJ((4.1, 6.1, 1.6)); blob(L, x, y, 10, (255, 214, 150), 0.3 if frame else 0.24)
    elif key == 'weldbench':
        x, y = PJ((0.5, -0.05, 0.95)); blob(L, x, y, 3.0, (190, 214, 255), 0.9 if frame else 0.3)
    elif key == 'curfew_night':
        x, y = PJ((4.93, 4.76, 0.7)); blob(L, x, y, 2.4, (255, 236, 160), 0.8 if frame else 0.25)
    elif key == 'mine_before':
        x, y = PJ((6.76, 3.5, 1.62)); blob(L, x + (2 if frame else 0), y, 2.0, RAG, 0.85)
    elif key == 'nails_before':
        for (a, b) in ((3.0, 3.4), (6.2, 4.8), (4.4, 7.0)):
            x, y = PJ((a, b, 0.4)); blob(L, x, y, 1.4, (230, 230, 220), (0.7 if frame else 0.15) if (a > 4) == bool(frame) else 0.35)
    return L


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    if 'SEVEN TO NINE' not in man['about']:
        man['about'] += (' And SEVEN TO NINE (tools/bohemia_bosses_seven_to_nine_places_11_11_26.py): THE LOCK SHOP, THE POWDER YARD, THE PIPE '
                         'SHOP before and after; the cut lock, the rubble and the welding bench their verbs leave; THE LOCKSMITH\'s CURFEW gate '
                         '(night, day, after), THE CHARGE\'s MINE, THE MACHINIST\'s NAILS on a street block.')
    # one frame per piece: every state of a piece drawn into the biggest one's box, its block anchored the same (the tape draws them into one box)
    box = {}
    for sc in S:
        if sc.get('piece'):
            b = box.setdefault(sc['name'], [0, 0, 0, 0])
            b[0] = max(b[0], sc['bx']); b[1] = max(b[1], sc['by']); b[2] = max(b[2], sc['w'] - sc['bx']); b[3] = max(b[3], sc['h'] - sc['by'])
    for sc in S:
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        rig = os.path.exists(fn)
        base = np.asarray(Image.open(fn).convert('RGBA')).astype(np.float64) if rig else PB.grain(sc['bake4'].astype(np.float64), sum(map(ord, sc['district'])))
        key = sc['key']; bx, by, W, Hh = sc['bx'], sc['by'], sc['w'], sc['h']
        for fr in (0, 1):
            out = PB.over(base, moving(sc, fr))
            im = Image.fromarray(out.round().clip(0, 255).astype(np.uint8), 'RGBA')
            if sc.get('piece'):
                b = box[sc['name']]; W, Hh = b[0] + b[2], b[1] + b[3]
                big = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); big.alpha_composite(im, (b[0] - sc['bx'], b[1] - sc['by'])); im = big; bx, by = b[0], b[1]
            im.save(os.path.join(DEST, '%s_%d.png' % (key, fr)), optimize=True)
        man['pictures'][key] = dict(w=W, h=Hh, bx=bx, by=by, plate=sc['plate'], frames=['%s_0.png' % key, '%s_1.png' % key], through_the_rig=rig)
        print('  %-18s %dx%d anchor %d,%d %s' % (key, W, Hh, bx, by, 'the rig' if rig else 'the factory bake'))
    json.dump(man, open(mp, 'w'), indent=1)
    try:   # the compare sheet: THE HOIST and THE CHECKPOINT beside these, at the game's own scale
        rows = [('hoist_before', 'lockshop_before', 'lockshop_after', 'curfew_night', 'curfew_day', 'curfew_after', 'cutlock'),
                ('hoist_before', 'powderyard_before', 'powderyard_after', 'mine_before', 'mine_after', 'checkpoint_y_before', 'rubble'),
                ('hoist_before', 'pipeshop_before', 'pipeshop_after', 'nails_before', 'nails_after', 'riggers_before', 'weldbench')]
        tiles = [[Image.open(os.path.join(DEST, k + '_0.png' if os.path.exists(os.path.join(DEST, k + '_0.png')) else k + '_0.png')) for k in rw] for rw in rows]
        W = max(sum(t.width for t in r) for r in tiles) + 20 * 8; Hr = [max(t.height for t in r) + 20 for r in tiles]
        sheet = Image.new('RGBA', (W * 2, sum(Hr) * 2), (20, 18, 16, 255)); yy = 10
        for r, h in zip(tiles, Hr):
            x = 10
            for t in r:
                t2 = t.resize((t.width * 2, t.height * 2), Image.NEAREST); sheet.alpha_composite(t2, (x, yy)); x += t2.width + 20
            yy += h * 2
        sheet.save(os.path.join(OUT, 'compare.png')); print('  compare sheet', os.path.join(OUT, 'compare.png'))
    except Exception as e:
        print('  compare sheet failed:', e)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): scenes()
    if cmd in ('render', 'all'): render()
    if cmd in ('finish', 'all'): finish()
