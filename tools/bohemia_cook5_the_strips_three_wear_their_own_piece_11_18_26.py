#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the Strip's side: three more places wear their own piece] (11/18/26; the coordinator's routine 'COOK FIVE
next', VAMILY rules 453, 441, 408, 409(c), 455: 'take the next jobs on your own list, one build each: finished art wherever a card
still says STAND-IN; every picture lands light').

Eleven of the eighteen real places (records/target/bb/real_places.json) still wore the kit art of the kind each is like. These are
the three on the Strip's side: SHARK REEF a resort like any resort, CHANNEL 8 a radio station like any radio station, the
UNEMPLOYMENT OFFICE a library like any library. Each gets its own piece on the map by the 11/17k pipeline
(slices/bohemia_place_pieces.js draws it; NO CODE in this build: three entries in slices/place_pieces/place_pieces.json and six
lossless WebP pictures), made by this lane's places tool, which this one imports.

  SHARK REEF              the aquarium under the bay's dead gold tower. 'Nobody fed the big tank since the power went ... now there
                          are four sharks and they are very big.' The hall's roof light has lost its glass: through its bare frame,
                          the big tank's dark water. The ones who live here camp on the forecourt and will not go downstairs. On
                          the beat: 'some nights the emergency lights come on by themselves and you can see them going round and
                          round': the tank lit from under, and one long pale shape, here and then there.
  CHANNEL 8               the valley's first television station: a low 1950s studio block, the tall studio box, the mast. 'Nobody
                          has a TV, so we put the picture on the mast, the lights, and people read it from across the valley.' A
                          news van on its rims, the dishes, the generator that starts on Thursdays; on the forecourt a camera on
                          its tripod aimed at an empty chair. On the beat: the mast's lamps, one set then the other; and studio
                          B's window ('sometimes the camera in studio B comes on by itself').
  THE UNEMPLOYMENT OFFICE the state's job office on Maryland Parkway: a low tan office, its doors open on the dark, and THE LINE:
                          'the line never went home', round the block, ten years of standing, a bag left to hold a place. Over
                          the door the board still says NOW SERVING ('nobody is behind the window'). On the beat: that board,
                          and one cigarette in the line.

  python3 tools/bohemia_cook5_the_strips_three_wear_their_own_piece_11_18_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook5_the_strips_three_wear_their_own_piece_11_18_26.py render
  python3 tools/bohemia_cook5_the_strips_three_wear_their_own_piece_11_18_26.py finish
  python3 tools/bohemia_cook5_the_strips_three_wear_their_own_piece_11_18_26.py sheet <shots>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a late-1990s resort tower (a slab of gold
mirror glass in floor bands, a low podium at its foot) with an aquarium hall off its side (a big tank under a framed roof light);
a 1950s local television station (a low brick office wing, a tall windowless studio box, a red and white lattice mast, satellite
dishes, a live truck with a telescoping mast); a state employment office in a low stuccoed strip building (a band of windows, a
ticket board over the counter, a queue held by rope posts). The twins: this lane's bank, mob museum and natural history museum
(the same frame, rig and draw), and the kit's resort, radio and library blocks beside them on the map (the card shows each before
and now).
REUSE CHECK (REUSE-FIRST): this lane's places tool (its capture, render, finish, sheet and colours: imported; this file is three
scenes and three beats) and its downtown tool's helpers, and through them BOSSES' place tools and the map's rig.
ANALOG HORROR: a tank nobody feeds whose lights come on by themselves; a camera aimed at an empty chair, and a picture nobody can
watch put up in lamps; a line that has stood ten years for a window nobody is behind.
No reference game.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_places_wear_their_own_piece_11_17_26 as PW      # this lane's: the pipeline
import bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26 as DT  # this lane's: its colours and face()

ST, PB, C = PW.ST, PW.PB, PW.C
CONC, CONC_DK, ROOF, ROOF_DK, STEEL, STEEL_DK, FRAME, SOOT, TYRE, LOT = PW.CONC, PW.CONC_DK, PW.ROOF, PW.ROOF_DK, PW.STEEL, PW.STEEL_DK, PW.FRAME, PW.SOOT, PW.TYRE, PW.LOT
face, PAVE, PAVE_DK, VOID, SASH, STUCCO, STUCCO_DK, BRICK, BRICK_DK = DT.face, DT.PAVE, DT.PAVE_DK, DT.VOID, DT.SASH, DT.STUCCO, DT.STUCCO_DK, DT.BRICK, DT.BRICK_DK
GOLD, GOLD_DK, GOLD_BAND = (176, 144, 80), (124, 100, 54), (84, 70, 44)        # the tower's mirror glass, gone dull
WATER = (5, 16, 20)   # (dark and flat at grade: the map's rig keeps such a top dark, the way it keeps a road; a top any higher it dusts pale.
                      #  And over 0.06: the factory's pad under every piece has its top at 0.05, measured: at 0.04 the water was under the paving)
HALL_H = 2.2                                                   # the big tank, dark
HALL, HALL_DK = (170, 160, 140), (126, 118, 102)
SHARK = (206, 214, 208)
RIBC = (168, 166, 156)                                        # the roof light's ribs: pale over the dark water
TANK = (0.0, 2.2, 9.8, 6.2, 0.1)                              # the big tank under the roof light: x, y, wide, deep, the water's height
RED, WHITE = (176, 46, 36), (226, 222, 210)
MAST = (9.8, 2.2)
LAMPS = [(MAST[0] + 0.5, MAST[1] + 0.56, 1.6 + k * 1.05) for k in range(8)]     # the lamps down the mast's face
STUDIO_B = (4.3, 4.42, 3.0)
BOARD = (3.8, 4.46, 2.2)                                      # NOW SERVING, over the door
LINE_SMOKE = (10.9, 8.6, 1.7)


def shark_reef(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PAVE)
    # the bay's tower behind it: gold mirror glass in floor bands, dead, panes gone
    x0, y0, w, d = 1.2, -1.9, 9.6, 2.8; z = 0.0; FL = 0.56
    for f in range(16):
        s.box((x0, y0, z), (w, d, 0.12), face(GOLD_BAND, GOLD_BAND)); s.box((x0 + 0.04, y0 + 0.04, z + 0.12), (w - 0.08, d - 0.08, 0.44), face(GOLD, GOLD_DK)); z += FL
    s.box((x0, y0, z), (w, d, 0.6), face(GOLD_BAND, GOLD_BAND)); top = z + 0.6
    s.box((x0 + 1.0, y0 + 0.5, top), (2.4, 1.6, 0.6), C(STEEL)); s.box((x0 + 5.8, y0 + 0.7, top), (2.8, 1.4, 0.8), C(CONC_DK))
    for (fx, fl, n) in ((1.2, 12, 2), (5.6, 7, 1), (7.4, 14, 3), (3.0, 5, 1), (8.2, 9, 1), (2.2, 9, 1)):       # panes gone: the dark of the floor behind them
        s.box((x0 + fx, y0 + d - 0.03, fl * FL + 0.12), (0.7 * n, 0.05, 0.44), C(VOID))
    s.box((x0 + w - 0.03, y0 + 0.8, 10 * FL + 0.12), (0.05, 1.2, 0.44), C(VOID))
    # the reef's hall at its foot, most of the block; the roof light over the big tank has lost its glass
    tx, ty, tw, td, tz = TANK; hx0, hx1, hy0, hy1, hh = -1.3, 11.0, 0.9, 9.5, HALL_H
    s.box((hx0, hy0, 0), (tx - hx0, hy1 - hy0, hh), face(HALL, HALL_DK)); s.box((tx + tw, hy0, 0), (hx1 - tx - tw, hy1 - hy0, hh), face(HALL, HALL_DK))
    s.box((tx, hy0, 0), (tw, ty - hy0, hh), face(HALL, HALL_DK)); s.box((tx, ty + td, 0), (tw, hy1 - ty - td, hh), face(HALL, HALL_DK))
    s.box((tx, ty, 0.06), (tw, td, tz - 0.06), C(WATER))                                                                 # the water, down in the dark of the hall
    s.box((tx, ty, tz), (tw, 0.03, hh - tz), C((52, 74, 72))); s.box((tx, ty, tz), (0.03, td, hh - tz), C((38, 56, 56)))                # the tank's far walls, stained to the water line
    s.box((tx, ty + 0.03, tz), (tw, 0.02, 0.5), C((24, 36, 36))); s.box((tx + 0.03, ty, tz), (0.02, td, 0.5), C((18, 28, 28)))
    for k in (1, 2):                                           # the roof light's ribs, bare; one fallen in half way
        s.box((tx + k * tw / 3.0 - 0.08, ty, hh), (0.16, td if k != 2 else td * 0.4, 0.1), C(RIBC))
    s.box((tx, ty + td / 2.0 - 0.08, hh), (tw, 0.16, 0.1), C(RIBC))
    s.box((tx + 0.12, ty + 0.12, hh + 0.02), (tw / 3.0 - 0.24, td / 2.0 - 0.24, 0.04), C((176, 186, 180)))     # one pane still in it, gone white with dust
    s.box((hx0 + 0.15, hy0 + 0.1, hh), (0.9, 1.0, 0.5), C(STEEL)); s.box((hx1 - 1.05, hy1 - 1.2, hh), (0.9, 1.0, 0.6), C(STEEL))        # the pumps' housings
    # the way in: the canopy, the fin on it, the letters, the door on the dark
    s.box((3.6, hy1, 0), (2.6, 0.03, 1.8), C(VOID)); s.box((3.3, hy1, 1.8), (3.2, 1.2, 0.22), face((60, 96, 100), (40, 68, 72)))
    s.quad((3.7, hy1 + 0.6, 2.02), (6.0, hy1 + 0.6, 2.02), (5.7, hy1 + 0.6, 4.0), (5.5, hy1 + 0.6, 4.0), C((132, 144, 144)), (0, 1, 0))         # the fin
    s.box((7.0, hy1 + 0.005, 1.2), (3.6, 0.03, 0.7), C((60, 96, 100)))
    for k in range(9): s.box((7.15 + k * 0.38, hy1 + 0.02, 1.32), (0.26, 0.02, 0.46), C(WHITE) if k not in (1, 6) else C((60, 96, 100)))  # its letters, two gone
    # the ones who will not go downstairs: their camp on the forecourt
    PW.canopy(s, -1.7, 10.0, 2.2, 1.7, 1.7); PW.canopy(s, 9.4, 10.1, 2.3, 1.7, 1.7)
    s.prism(7.6, 11.0, 0, 0.32, 0.7, 9, C(STEEL_DK), C(SOOT))
    for k, (x, y) in enumerate(((7.0, 10.4), (8.3, 11.3), (1.2, 10.7), (-0.4, 11.3))): ST.body(s, x, y, ((120, 110, 92), (84, 96, 108), (140, 104, 72), (104, 104, 92))[k], (46, 44, 40))
    for (x, y) in ((9.6, 10.5), (-1.5, 10.4)): s.box((x, y, 0.0), (1.7, 0.6, 0.14), C(PW.COT))
    for k in range(3): s.box((2.2 + k * 0.5, 11.3, 0), (0.34, 0.34, 0.5), C(PW.CRATE))
    s.box((6.5, 10.0, 0), (0.1, 0.1, 1.3), C(FRAME)); s.box((6.1, 10.05, 0.8), (0.9, 0.04, 0.6), C(WHITE)); s.box((6.2, 10.09, 0.95), (0.7, 0.02, 0.14), C(RED)); s.box((6.2, 10.09, 1.17), (0.5, 0.02, 0.1), C((40, 38, 36)))   # a board somebody painted: do not go down
    return s


def lattice(s, x, y, z, w0, w1, h, col):
    """one section of the mast: four legs, a ring at its foot, one brace on each face the camera sees"""
    c = C(col)
    for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)):
        s.box((x + dx * (w0 - 0.1), y + dy * (w0 - 0.1), z), (0.1, 0.1, h), c)
    s.box((x, y + w0 - 0.1, z), (w0, 0.1, 0.1), c); s.box((x + w0 - 0.1, y, z), (0.1, w0, 0.1), c)
    s.quad((x, y + w0, z), (x, y + w0, z + 0.14), (x + w0, y + w0, z + h), (x + w0, y + w0, z + h - 0.14), c, (0, 1, 0))
    s.quad((x + w0, y, z + h - 0.14), (x + w0, y, z + h), (x + w0, y + w0, z + 0.14), (x + w0, y + w0, z), c, (1, 0, 0))


def dish(s, x, y, z, r):
    s.prism(x, y, 0 if z < 0.5 else z - 0.5, 0.1, 0.5 if z >= 0.5 else z, 6, C(FRAME), C(FRAME)); s.prism(x, y, z, r, 0.14, 14, C((176, 176, 168)), C(WHITE)); s.prism(x, y, z + 0.14, 0.12, 0.3, 6, C(FRAME), C(FRAME))


def the_tv_station(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=LOT)
    # the office wing (1950s: long, low, brick, a ribbon of windows) and the studio box behind it
    s.box((-1.4, 0.6, 0), (9.2, 3.8, 2.3), face(BRICK, BRICK_DK)); s.box((-1.5, 0.5, 2.3), (9.4, 4.0, 0.16), face(CONC, CONC_DK)); s.box((-1.2, 0.8, 2.46), (8.8, 3.4, 0.05), C(ROOF))
    s.box((-1.4, -1.6, 0), (6.4, 2.4, 4.0), face((150, 146, 136), (112, 108, 100))); s.box((-1.3, -1.5, 4.0), (6.2, 2.2, 0.06), C(ROOF_DK))       # the studios: no windows
    s.box((2.6, 0.8, 0), (2.6, 3.62, 3.5), face((150, 146, 136), (112, 108, 100))); s.box((2.7, 0.9, 3.5), (2.4, 3.4, 0.06), C(ROOF_DK))           # studio B, to the front
    s.box((3.8, 4.425, 2.7), (1.0, 0.03, 0.55), C((60, 74, 80)))                                                # its one window (the beat lights it)
    for k in range(4): s.box((-1.0 + k * 0.85, 4.405, 0.9), (0.62, 0.03, 0.9), C(SASH))
    for k in range(3): s.box((5.5 + k * 0.75, 4.405, 0.9), (0.55, 0.03, 0.9), C(SASH))
    s.box((7.805, 1.0 + 0.0, 0.9), (0.03, 2.8, 0.9), C(SASH))
    s.box((2.9, 4.43, 0), (1.2, 0.03, 1.9), C(VOID)); s.box((2.6, 4.42, 1.9), (1.8, 0.7, 0.14), face(CONC, CONC_DK))                              # the door, its canopy
    # the 8 on the studio's face
    s.box((-0.6, 0.81, 2.5), (1.5, 0.03, 1.4), C(WHITE))
    for (dx, dz, sx, sz) in ((0.35, 0.12, 0.8, 0.14), (0.35, 0.62, 0.8, 0.14), (0.35, 1.12, 0.8, 0.14), (0.35, 0.12, 0.16, 1.14), (0.99, 0.12, 0.16, 1.14)):
        s.box((-0.6 + dx, 0.84, 2.5 + dz), (sx, 0.02, sz), C(RED))
    # the roof: two dishes, the plant
    dish(s, 0.4, 2.4, 3.0, 0.75); dish(s, 6.2, 2.0, 3.1, 0.6); s.box((4.0, -1.2, 4.06), (1.4, 1.2, 0.6), C(STEEL))
    # the mast: red and white, nine sections, the lamps they hung down it
    mx, my = MAST; z = 0.0
    s.box((mx - 0.3, my - 0.3, 0), (1.9, 1.9, 0.2), C(CONC_DK))
    for k in range(9):
        w0 = 1.3 - k * 0.1; off = k * 0.05
        lattice(s, mx + off, my + off, z + 0.2, w0, w0 - 0.1, 1.15, RED if k % 2 == 0 else WHITE); z += 1.15
    s.box((mx + 0.56, my + 0.56, z + 0.2), (0.12, 0.12, 1.6), C(FRAME))
    for (lx, ly, lz) in LAMPS: s.box((lx - 0.09, ly, lz - 0.09), (0.18, 0.06, 0.18), C((70, 60, 50)))
    # the big dish on the lot, the generator that starts on Thursdays, its drums
    dish(s, 10.4, 6.0, 1.5, 1.2)
    s.box((-1.5, 6.0, 0.45), (2.2, 1.2, 1.2), face(PW.GEN, PW.GEN_DK)); s.box((-1.7, 5.9, 0.28), (2.6, 1.4, 0.17), C(FRAME))
    for xx in (-1.3, -0.1): s.box((xx, 7.3, 0), (0.55, 0.13, 0.5), C(TYRE))
    for k in range(3): s.prism(1.3 + 0.6 * k, 6.3 + 0.2 * (k % 2), 0, 0.26, 0.75, 9, C((150, 60, 44)), C((110, 44, 32)))
    # the live truck on its rims: the mast still up, the dish still aimed
    vx, vy = 5.2, 9.3
    s.box((vx, vy, 0.3), (3.0, 1.3, 1.25), face(WHITE, (176, 172, 160))); s.box((vx, vy + 1.3, 0.75), (3.0, 0.02, 0.22), C(RED)); s.box((vx + 3.0, vy + 0.1, 0.3), (0.9, 1.1, 0.85), face(WHITE, (176, 172, 160)))
    s.box((vx + 3.0, vy + 0.2, 0.85), (0.92, 0.9, 0.34), C((40, 46, 52)))
    for xx in (vx + 0.3, vx + 2.7): s.box((xx, vy + 1.3, 0), (0.55, 0.12, 0.34), C(TYRE))
    s.box((vx + 0.9, vy + 0.55, 1.55), (0.1, 0.1, 2.6), C(STEEL)); dish(s, vx + 0.95, vy + 0.6, 4.2, 0.42)
    # on the forecourt: a camera on its tripod and a lamp on its stand, aimed at an empty chair
    s.box((1.9, 9.0, 0), (0.07, 0.07, 1.3), C(FRAME)); s.box((1.7, 8.9, 1.3), (0.5, 0.3, 0.3), C((34, 34, 38))); s.box((2.2, 8.98, 1.36), (0.2, 0.14, 0.16), C((60, 74, 80)))
    s.box((0.9, 10.2, 0), (0.06, 0.06, 1.9), C(FRAME)); s.box((0.75, 10.1, 1.9), (0.4, 0.3, 0.34), C((200, 196, 180)))
    s.box((3.6, 8.9, 0), (0.5, 0.5, 0.45), C((70, 60, 50))); s.box((4.02, 8.9, 0.45), (0.08, 0.5, 0.6), C((70, 60, 50)))
    for k in range(6): s.box((2.3 + k * 0.22, 9.2 + 0.1 * k, 0.06), (0.26, 0.07, 0.05), C((20, 20, 20)))      # its cable
    ST.body(s, 2.2, 5.2, (60, 66, 74), (40, 44, 50)); ST.body(s, 4.6, 5.4, (84, 78, 70), (52, 48, 44))        # the night crew at the door
    return s


def the_unemployment_office(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(211)
    H._ground(s, (-2, -2, 12, 12), groundc=LOT)
    x0, y0, w, d, h = -1.0, -1.4, 9.4, 5.8, 2.5
    s.box((x0, y0, 0), (w, d, h), face(STUCCO, STUCCO_DK)); s.box((x0 - 0.1, y0 - 0.1, h), (w + 0.2, d + 0.2, 0.3), face((176, 156, 122), (136, 120, 94))); s.box((x0 + 0.3, y0 + 0.3, h + 0.3), (w - 0.6, d - 0.6, 0.04), C(ROOF))
    for (ax, ay) in ((0.2, 0.0), (3.4, 1.6), (6.0, 0.2)): s.box((x0 + ax + 0.6, y0 + ay + 0.6, h + 0.34), (1.3, 1.0, 0.5), C(STEEL))
    fy = y0 + d
    for k in range(4): s.box((x0 + 0.4 + k * 0.92, fy + 0.005, 0.8), (0.7, 0.03, 1.0), C(SASH))               # the band of windows, dark: nobody is behind them
    for k in range(4): s.box((x0 + 5.6 + k * 0.92, fy + 0.005, 0.8), (0.7, 0.03, 1.0), C(SASH))
    for k in range(3): s.box((x0 + w + 0.005, y0 + 0.8 + k * 1.6, 0.8), (0.03, 1.0, 1.0), C(SASH))
    s.box((3.1, fy + 0.005, 0), (1.5, 0.03, 1.9), C(VOID))                                                     # the doors, open on the dark
    s.box((3.05, fy + 0.02, 1.95), (1.6, 0.03, 0.45), C((255, 176, 70)))                                       # NOW SERVING: the one thing lit
    for k in range(3): s.box((3.9 + k * 0.2, fy + 0.04, 2.05), (0.12, 0.02, 0.26), C((60, 36, 20)))            # 2 1 1
    s.box((x0 + 0.6, fy + 0.005, h + 0.03), (w - 1.2, 0.03, 0.24), C((70, 96, 110)))                           # the state's name on the parapet, letters gone
    for k in range(16):
        if k in (2, 3, 9, 13): continue
        s.box((x0 + 0.9 + k * 0.47, fy + 0.02, h + 0.07), (0.3, 0.02, 0.16), C((226, 222, 210)))
    s.box((1.2, fy + 0.4, 0), (1.9, 0.9, 0.7), face((150, 52, 44), (108, 38, 32))); s.box((1.3, fy + 0.5, 0.7), (0.8, 0.7, 0.02), C((40, 40, 44)))   # the vending machine, on its face
    s.box((10.6, 0.6, 0), (0.1, 0.1, 5.4), C(STEEL)); s.box((10.7, 0.62, 4.6), (0.5, 0.04, 0.28), C((150, 140, 124)))                               # the flag pole, a rag left on it
    # THE LINE: from the door along the front, down the east side, along the kerb, up the west side. It never went home
    path = [(4.9, 5.2), (11.0, 5.2), (11.0, 11.2), (-1.5, 11.2), (-1.5, 6.4)]; pts = []; step = 0.92
    for (ax, ay), (bx, by) in zip(path[:-1], path[1:]):
        L = math.hypot(bx - ax, by - ay); n = int(L / step)
        for i in range(n): t = i / float(n); pts.append((ax + (bx - ax) * t, ay + (by - ay) * t))
    COATS = ((150, 138, 116), (98, 92, 84), (150, 110, 74), (84, 104, 124), (126, 126, 110), (176, 160, 130), (112, 84, 70), (130, 140, 122), (196, 190, 172), (70, 74, 82))
    for i, (x, y) in enumerate(pts):
        x += rng.uniform(-0.12, 0.12); y += rng.uniform(-0.12, 0.12); u = rng.rand(); c = COATS[rng.randint(len(COATS))]; dk = tuple(int(v * 0.66) for v in c)
        if i in (9, 21):                                       # a place held by a bag: whoever it was has not come back
            s.box((x, y, 0), (0.42, 0.3, 0.34), C((70, 66, 58))); continue
        if u < 0.16: s.box((x - 0.05, y - 0.05, 0), (0.5, 0.45, 0.42), C(PW.CRATE)); ST.body(s, x, y, c, dk, z=0.42, tall=0.55)       # sat on a crate
        else: ST.body(s, x, y, c, dk, tall=(0.86 if u < 0.3 else 1.0))
        if u > 0.8: s.box((x + 0.62, y + 0.1, 0), (0.24, 0.24, 0.36), C((206, 214, 216)))                       # a jug of water at his feet
    for k in range(5): s.box((5.2 + k * 1.2, 4.75, 0), (0.1, 0.1, 0.85), C(STEEL)); s.box((5.2 + k * 1.2, 4.78, 0.72), (1.2 if k < 4 else 0.0, 0.03, 0.06), C((120, 40, 36)))   # the rope and its posts
    s.box((6.6, 8.0, 0), (1.6, 0.5, 0.42), C(PW.WOOD)); s.box((6.6, 7.9, 0.42), (1.6, 0.1, 0.5), C(PW.WOOD_DK))                                  # the bus stop's bench; nobody sits out of the line
    s.box((8.6, 7.9, 0), (0.08, 0.08, 2.2), C(STEEL)); s.box((8.45, 7.92, 1.8), (0.4, 0.03, 0.4), C((70, 96, 110)))
    return s


PLACES = {'shark_reef': shark_reef, 'the_tv_station': the_tv_station, 'the_unemployment_office': the_unemployment_office}
SAY = {'shark_reef': 'SHARK REEF', 'the_tv_station': 'CHANNEL 8', 'the_unemployment_office': 'UNEMPLOYMENT OFFICE'}
LIKE = {'shark_reef': 'resort', 'the_tv_station': 'radio', 'the_unemployment_office': 'library'}
_older = DT.moving
SWIM = (((2.4, 4.3), -0.785), ((4.7, 3.7), 2.356))             # (a heading of -45 or 135 degrees lies level across the picture: its whole length shows)                  # where the long pale shape is, frame 0 and frame 1: (the tank's x, y), its heading


def in_the_tank(sc):
    """the picture's pixels that are the tank's water as the map's eye has it through the roof light (the near walls hide the
    water under them: a wall HALL_H high hides that much of the floor behind it), and of those the dark ones: a light under
    the water and what swims in it never paint the roof light's pale ribs or its dusty panes"""
    from PIL import Image, ImageDraw
    tx, ty, tw, td, tz = TANK; x1, y1 = tx + tw - HALL_H, ty + td - HALL_H
    pts = [PB.proj(sc, p) for p in ((tx, ty, tz), (x1, ty, tz), (x1, y1, tz), (tx, y1, tz))]
    m = Image.new('L', (sc['w'], sc['h']), 0); ImageDraw.Draw(m).polygon([(float(x), float(y)) for x, y in pts], fill=255); m = np.asarray(m) > 0
    base = sc.get('_base')
    if base is not None and m.any():
        m &= base[..., :3].mean(-1) < 104                      # (the water in the walls' shadow and in the sun are two darks; the ribs and the panes are pale)
    return m.astype(np.float64)


def moving(sc, frame):
    """what moves on the beat: the tank's own lights and the long pale shape; the mast's lamps and studio B; NOW SERVING"""
    key = sc['key']
    if key not in PLACES: return _older(sc, frame)
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: PB.proj(sc, p)
    if key == 'shark_reef':
        tx, ty, tw, td, tz = TANK; W = np.zeros_like(L); cu, su = math.cos, math.sin
        x, y = PJ((tx + (tw - HALL_H) / 2, ty + (td - HALL_H) / 2, tz)); blob(W, x, y, 70.0, (110, 226, 200), 0.62 if frame else 0.06)          # the emergency lights, by themselves
        def fish(sx, sy, a, k, al):                            # a long pale shape, nose to tail along its heading, k times a big one
            n = 30
            for i in range(n):                                 # the body: thick at the shoulder, drawn out to the tail
                u = i / float(n - 1); r = (0.9 + 3.0 * math.sin(math.pi * min(1.0, u * 1.7) * 0.62)) * (1.0 - 0.72 * max(0.0, u - 0.45) / 0.55)
                t = (u - 0.42) * 4.4 * k; x, y = PJ((sx - t * cu(a), sy - t * su(a), tz)); blob(W, x, y, r * k, SHARK, al)
            for side in (-1, 1):
                for q in (0.5, 1.0):                           # its two fins, swept back
                    t = (-0.12 + 0.1 * q) * 4.4 * k; w = side * 0.62 * q * k
                    x, y = PJ((sx - t * cu(a) + w * su(a), sy - t * su(a) - w * cu(a), tz)); blob(W, x, y, 1.7 * k, SHARK, al * 0.9)
                t = 0.6 * 4.4 * k; w = side * 0.42 * k           # its tail
                x, y = PJ((sx - t * cu(a) + w * su(a), sy - t * su(a) - w * cu(a), tz)); blob(W, x, y, 1.6 * k, SHARK, al * 0.9)
        (sx, sy), a = SWIM[frame]; fish(sx, sy, a, 1.2, 0.95 if frame else 0.24)
        if frame: fish(4.3, 5.6, -0.785, 0.5, 0.4)             # and another under it, deeper
        W[..., 3] *= in_the_tank(sc); L = W
        x, y = PJ((7.6, 11.0, 0.9)); blob(L, x, y, 2.2, (255, 150, 60), 0.8 if frame else 0.55)                          # the camp's fire
    elif key == 'the_tv_station':
        for i, p in enumerate(LAMPS):
            x, y = PJ(p); on = (i % 2) == frame; blob(L, x, y, 1.7, (255, 214, 150) if i % 3 else (255, 96, 60), 0.98 if on else 0.1)
            if on: blob(L, x, y, 4.5, (255, 190, 120), 0.22)
        x, y = PJ(STUDIO_B); blob(L, x, y, 3.0, (206, 232, 236), 0.9 if frame else 0.15); blob(L, x, y, 7.0, (190, 224, 230), 0.2 if frame else 0.0)
    elif key == 'the_unemployment_office':
        x, y = PJ(BOARD); blob(L, x, y, 3.4, (255, 190, 90), 0.75 if frame else 0.3); blob(L, x, y, 8.5, (255, 160, 70), 0.2 if frame else 0.08)
        x, y = PJ(LINE_SMOKE); blob(L, x, y, 1.2, (255, 120, 50), 0.2 if frame else 0.95)
    return L


def bind():
    """this file's three through the places tool's own scenes / render / finish / sheet (the seven older places are not re-made)"""
    PW.PLACES = PLACES; PW.SAY = dict(PW.SAY, **SAY); PW.LIKE = dict(PW.LIKE, **LIKE); PW.moving = moving
    PW.OUT = os.path.join(R, 'records/target/cook5_places_strip')


def finish():
    """the places tool's finish, with each scene's rendered master in hand for the tank's mask, and this build's date on its three"""
    import pickle
    from PIL import Image
    S = pickle.load(open(os.path.join(PW.OUT, 'scenes.pkl'), 'rb')); base = {}
    for sc in S: base[sc['key']] = np.asarray(Image.open(os.path.join(PW.OUT, 'masters', '%s.png' % sc['district'])).convert('RGBA')).astype(np.float64)
    inner = moving
    def with_base(sc, frame): sc['_base'] = base.get(sc['key']); return inner(sc, frame)
    PW.moving = with_base; PW.finish()
    mp = os.path.join(PW.DEST, 'place_pieces.json'); man = json.load(open(mp))
    for k in PLACES: man['pictures'][k]['finished'] = 'cook 5, 11/18'
    json.dump(man, open(mp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'; bind()
    if cmd == 'scenes': PW.scenes()
    elif cmd == 'render': PW.render()
    elif cmd == 'finish': finish()
    elif cmd == 'sheet': PW.sheet(a[1], 'COOK5_THE_STRIPS_THREE_11_18', ('shark_reef', 'the_tv_station', 'the_unemployment_office'), 'cook5-the-strips-three-11-18')
    else: print(__doc__)
