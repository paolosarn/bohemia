#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the region's four wear their own piece] (11/20/26; COOK FIVE's list carried on by COOK SIX: 'measure how
the region draws its four real places'; measured this round, then built; VAMILY rules 461, 453, 441, 408, 409(c), 455).

THE MEASURE (records/BOHEMIA_COOK_SIX_THE_STADIUM_11_20_26.md, NOT DONE 5): the region's four real places (records/target/bb/
real_places.json, where 'region') are drawn by slices/bohemia_region.js (drawPlaces, after the whole map frame) through the map's
mapBaseDraw(tier, name): a patch the map paints of the far land, or the tier's art. slices/bohemia_place_pieces.js drew only the
valley's. So this build is ONE SEAM in that module (this lane's: a wrap of mapBaseDraw by the place's name, that draws the place's
own piece and hands back its size; any other name, or the switch off, goes on to the map's own) and FOUR SCENES, each from what
the world's own list says of the place, through COOK FIVE's places tool:

  TULE SPRINGS LAB       (the fossil beds, upper Las Vegas Wash) 'Payroll stopped, so I stopped going home. Nobody feeds them now,
                         only me... Pen four still has the wolves. The big ones, from the tooth they dug out back. The doors ran on
                         the grid, so now it's chain... the clock by the door still counts down to feeding time.' A low white lab
                         block on the pale wash, its dish and its dead chillers, the rows of pens behind it (chain wound round the
                         gates, pen four's still shut and the dire wolves in it), the excavation trench out back with its tarp and
                         the bones laid in a row, the keeper with his bucket. On the beat: the red clock by the door, and the
                         wolves' eyes in pen four.
  LENZIE STATION         (Apex, by the 15) 'Three turbines and not one cubic foot of gas... The stacks still have their lights.
                         Red, every night, for airplanes that don't come.' Three combined-cycle units in a row (the boiler box, its
                         tall stack, the turbine house), the air-cooled condenser's deck of fans on its legs (the desert plant's own
                         shape), the switchyard, the gas line dry at its valve, the battery room's door open. On the beat: the
                         stacks' red lights.
  SPRING MOUNTAIN RANCH  (Red Rock) 'Forty head left, out of four hundred. The springs still run... The rustlers come down from Blue
                         Diamond on the full moon... the old ranch house, the Hughes house. The phone in there still rings
                         sometimes.' The red ranch house under the cliff's red rock, the long barn, the corrals of rails with the
                         last cattle in them, the hay under a roof, the spring's pond and its trees, two men on the fence with
                         rifles. On the beat: the guards' fire, and a light in the house where the phone is.
  CALLVILLE BAY          (Lake Mead, the north shore) 'Forty motorhomes and not one with gas... The lake went down a hundred feet,
                         the marina sits on the mud like a dead boat... the camp host's sign still says THREE NIGHT LIMIT.' The lake's
                         edge far below where it was, the marina's docks and boats lying on the cracked mud, the motorhomes in their
                         sites with awnings out and lines of fish drying, the camp host's sign. On the beat: the cooking fires among
                         the motorhomes, and a lantern on the dead marina.

  python3 tools/bohemia_cook6_the_regions_four_wear_their_own_piece_11_20_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook6_the_regions_four_wear_their_own_piece_11_20_26.py render
  python3 tools/bohemia_cook6_the_regions_four_wear_their_own_piece_11_20_26.py finish
  python3 tools/bohemia_cook6_the_regions_four_wear_their_own_piece_11_20_26.py sheet <shots>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a low research facility on desert wash
with outdoor animal runs and a field excavation; a combined-cycle gas plant in the desert (heat recovery boilers each with one tall
stack and aviation lights, the turbine buildings, an air-cooled condenser: a raised deck of large fans on steel legs, a
switchyard); a historic ranch under a sandstone escarpment (a red-painted ranch house, a long barn, post-and-rail corrals, a hay
shed, a spring-fed pond with cottonwoods); a lakeside campground and RV park with a marina stranded by a falling lake (docks and
houseboats on cracked mud, the bathtub ring on the rock). The twins: COOK FIVE's places and this lane's two home centers (the same
frame, rig and draw), and the region's painted patch each wore (the card shows each before and now).
REUSE CHECK (REUSE-FIRST): COOK FIVE's places tool (its capture, render, finish, sheet and colours), its downtown tool (face()), its
Strip tool (the lattice) and this lane's home centers' tool (its binding): imported. New here: four scenes, their beats, and the
module's region seam.
ANALOG HORROR: a clock still counting down to a feeding nobody brings; red lights on the stacks every night for airplanes that do
not come; a phone ringing in a house whose line was cut; a sign that still says THREE NIGHT LIMIT to people eleven years in.
No reference game.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_places_wear_their_own_piece_11_17_26 as PW      # COOK FIVE's: the pipeline
import bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26 as DT  # COOK FIVE's: face()
import bohemia_cook5_the_strips_three_wear_their_own_piece_11_18_26 as SS # COOK FIVE's: the lattice
import bohemia_cook6_the_home_centers_wear_their_own_piece_11_20_26 as HC # this lane's: the last places' binding

ST, PB, C = PW.ST, PW.PB, PW.C
CONC, CONC_DK, ROOF, ROOF_DK, STEEL, STEEL_DK, FRAME, SOOT, TYRE = PW.CONC, PW.CONC_DK, PW.ROOF, PW.ROOF_DK, PW.STEEL, PW.STEEL_DK, PW.FRAME, PW.SOOT, PW.TYRE
CORR, CORR_DK, RUST, RUST_DK, WOOD, WOOD_DK = PW.CORR, PW.CORR_DK, PW.RUST, PW.RUST_DK, PW.WOOD, PW.WOOD_DK
face, VOID, SASH = DT.face, DT.VOID, DT.SASH
dk = lambda c, k=0.7: tuple(int(v * k) for v in c)
WASH = (76, 72, 64)                                          # the fossil beds' wash (the plates are the far land's own tone: the rig lifts a
                                                             # dark ground about 1.4x, and the first cut's pale plates sat on the region like stickers)
DESERT = (62, 60, 55)                                        # Apex's desert, as the region paints it
PASTURE = (80, 74, 60)                                       # the ranch's dry grass
MUD, MUD_DK = (104, 92, 74), (78, 70, 56)                    # the lakebed the water left
WATER, WATER_DK = (70, 98, 104), (52, 74, 80)
WHITE, LAB, LAB_DK = (226, 222, 210), (214, 212, 202), (168, 166, 158)
RANCH_RED, RANCH_RED_DK = (150, 66, 50), (110, 48, 38)
ROCK, ROCK_DK = (176, 96, 66), (130, 70, 50)                 # Red Rock's sandstone
COTTON, COTTON_DK = (110, 116, 70), (78, 84, 50)             # cottonwoods, the only green: the spring keeps them
CATTLE = ((96, 64, 46), (60, 44, 36), (150, 110, 80), (40, 36, 34), (196, 176, 150))
RV = ((214, 210, 196), (200, 192, 170), (190, 196, 196), (220, 214, 200))
WOLF = (110, 104, 96)
# the beats
LAB_CLOCK = (2.4, 3.03, 1.9)
PEN4 = (8.6, 6.4, 0.5)
STACK_LIGHTS = ((1.0, 2.0, 7.9), (4.4, 2.0, 7.9), (7.8, 2.0, 7.9))
RANCH_FIRE = (7.4, 8.2, 0.3)
RANCH_LAMP = (2.6, 3.03, 1.2)
CAMP_FIRES = ((2.2, 7.6, 0.2), (5.8, 4.9, 0.2), (8.8, 7.9, 0.2))
MARINA_LAMP = (9.6, -0.6, 1.2)


def wolf(s, x, y, along='x', k=1.6):
    """a dire wolf as the map can have him: bigger than a dog (the bones say so), grey, head up"""
    c = WOLF; d = dk(c); L, W_, Hh, z = 1.0 * k, 0.4 * k, 0.4 * k, 0.32 * k
    if along == 'x':
        s.box((x, y, z), (L, W_, Hh), face(c, d)); s.box((x + L - 0.1 * k, y + 0.04, z + Hh - 0.05), (0.4 * k, W_ - 0.08, 0.36 * k), face(c, d))
        for dx in (0.05, L - 0.22 * k): s.box((x + dx, y, 0), (0.17 * k, W_, z), C(d))
    else:
        s.box((x, y, z), (W_, L, Hh), face(c, d)); s.box((x + 0.04, y + L - 0.1 * k, z + Hh - 0.05), (W_ - 0.08, 0.4 * k, 0.36 * k), face(c, d))
        for dy in (0.05, L - 0.22 * k): s.box((x, y + dy, 0), (W_, 0.17 * k, z), C(d))


def cow(s, x, y, col, along='x'):
    d = dk(col)
    if along == 'x':
        s.box((x, y, 0.45), (1.4, 0.55, 0.55), face(col, d)); s.box((x + 1.3, y + 0.08, 0.7), (0.4, 0.4, 0.4), face(col, d))
        for dx in (0.08, 1.12): s.box((x + dx, y + 0.05, 0), (0.2, 0.45, 0.45), C(d))
    else:
        s.box((x, y, 0.45), (0.55, 1.4, 0.55), face(col, d)); s.box((x + 0.08, y + 1.3, 0.7), (0.4, 0.4, 0.4), face(col, d))
        for dy in (0.08, 1.12): s.box((x + 0.05, y + dy, 0), (0.45, 0.2, 0.45), C(d))


def rails_x(s, x0, x1, y, h=1.1, n=3, col=WOOD):
    for k in range(n): s.box((x0, y, 0.3 + k * (h - 0.3) / max(1, n - 1)), (x1 - x0, 0.08, 0.08), C(col))
    x = x0
    while x <= x1 + 1e-6: s.box((x - 0.06, y - 0.03, 0), (0.12, 0.14, h + 0.08), C(dk(col))); x += 1.5


def rails_y(s, y0, y1, x, h=1.1, n=3, col=WOOD):
    for k in range(n): s.box((x, y0, 0.3 + k * (h - 0.3) / max(1, n - 1)), (0.08, y1 - y0, 0.08), C(col))
    y = y0
    while y <= y1 + 1e-6: s.box((x - 0.03, y - 0.06, 0), (0.14, 0.12, h + 0.08), C(dk(col))); y += 1.5


# ---------------------------------------------------------------------------------------------------- TULE SPRINGS LAB
def the_lab(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(41)
    H._ground(s, (-2, -2, 12, 12), groundc=WASH)
    # the lab: a long low white block, its plant on the roof, the dish, the door with the clock over it
    s.box((-1.6, -1.6, 0), (7.2, 4.6, 2.6), face(LAB, LAB_DK)); s.box((-1.7, -1.7, 2.6), (7.4, 4.8, 0.14), face(ROOF, ROOF_DK))
    for k in range(5): s.box((-1.1 + k * 1.4, 3.005, 1.1), (0.9, 0.03, 0.8), C(SASH))
    for k in range(3): s.box((5.605, -1.0 + k * 1.4, 1.1), (0.03, 0.9, 0.8), C(SASH))
    s.box((1.9, 3.005, 0), (1.0, 0.03, 1.8), C((140, 146, 150))); s.box((2.3, 3.02, 0.1), (0.06, 0.04, 1.6), C(FRAME))    # the door, chained
    for k in range(5): s.box((2.0 + k * 0.17, 3.03, 0.85 + 0.05 * (k % 2)), (0.12, 0.03, 0.06), C((150, 150, 146)))
    s.box((2.2, 3.03, 1.85), (0.4, 0.03, 0.16), C((40, 30, 28)))                                                          # the clock (the beat lights it)
    s.box((-1.2, 3.005, 2.2), (2.6, 0.03, 0.3), C((70, 96, 110)))                                                         # its name, letters gone
    for (x, y) in ((0.2, -0.8), (3.0, 0.4)): s.box((x, y, 2.74), (1.2, 0.9, 0.7), face(STEEL, STEEL_DK)); s.prism(x + 0.6, y + 0.45, 3.44, 0.36, 0.08, 10, C((60, 62, 62)), C((40, 40, 40)))   # the chillers, dead
    s.prism(4.6, 1.8, 2.74, 0.1, 0.8, 6, C(FRAME), C(FRAME)); s.prism(4.6, 1.8, 3.54, 0.7, 0.14, 14, C((200, 200, 192)), C(WHITE))   # the dish
    # the pens behind it: two rows of runs, chain-link, every gate chained; pen four still shut, the wolves in it
    for r in range(2):
        y0 = 5.0 + r * 2.6
        for k in range(4):
            x0 = 1.0 + k * 2.4
            s.box((x0, y0, 0), (0.08, 2.2, 1.6), C((132, 136, 134))); s.box((x0, y0, 0), (2.4, 0.08, 1.6), C((132, 136, 134)))
            s.box((x0 + 2.4, y0, 0), (0.08, 2.2, 1.6), C((132, 136, 134)))
            s.box((x0 + 0.2, y0 + 2.2, 0), (2.0, 0.06, 1.6), C((150, 154, 152)))                                         # the gate
            s.box((x0 + 1.1, y0 + 2.24, 0.7), (0.3, 0.04, 0.4), C((120, 110, 90)))                                      # the chain
            s.box((x0 + 0.1, y0 + 0.1, 1.6), (2.2, 1.0, 0.06), face(CORR, CORR_DK))                                     # its shade
    wolf(s, 7.6, 6.2); wolf(s, 8.3, 7.2, along='y'); wolf(s, 9.0, 5.6, k=1.4)                                           # pen four (8.2 to 10.6, row one): the wolves, the big ones
    for k in range(3): s.box((1.6 + k * 2.4, 5.6, 0.06), (0.7, 0.5, 0.05), C((196, 190, 176)))                          # the empty pens' water bowls, dry
    # the dig out back: the trench, its tarp, the bones laid in a row, the tooth
    s.box((-1.6, 7.4, 0.0), (2.0, 3.6, 0.07), C((140, 124, 96))); s.box((-1.5, 7.5, 0.07), (1.8, 3.4, 0.01), C((110, 96, 72)))
    s.box((-1.7, 7.3, 0.6), (2.2, 1.2, 0.06), face((70, 96, 120), (52, 70, 90))); s.box((-1.7, 7.3, 0), (0.08, 0.08, 0.6), C(FRAME)); s.box((0.42, 7.3, 0), (0.08, 0.08, 0.6), C(FRAME))
    for k in range(6): s.box((0.9, 7.6 + k * 0.5, 0.06), (0.9 - 0.08 * k, 0.12, 0.08), C((222, 214, 190)))                 # the bones in a row
    s.box((0.9, 10.7, 0.06), (0.3, 0.2, 0.2), C((236, 226, 196)))                                                        # the tooth
    ST.body(s, 3.8, 4.0, (86, 96, 92), (46, 48, 46)); s.prism(4.6, 4.3, 0, 0.2, 0.36, 8, C((150, 150, 146)), C((90, 80, 60)))   # the keeper and his bucket (empty)
    for k in range(4): s.box((5.4 + k * 0.5, 3.8, 0), (0.4, 0.5, 0.5), face((200, 176, 120), (150, 130, 90)))               # the feed sacks, slit, empty
    return s


# ---------------------------------------------------------------------------------------------------- LENZIE STATION
def lenzie_station(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=DESERT)
    for k, x in enumerate((-0.4, 3.0, 6.4)):                                                                             # three units: the boiler box, its stack, the turbine house in front
        s.box((x, -1.4, 0), (2.2, 3.0, 4.6), face((176, 172, 162), (132, 128, 120))); s.box((x - 0.05, -1.45, 4.6), (2.3, 3.1, 0.1), C(ROOF))
        for q in range(4): s.box((x, 1.605, 1.0 + q * 0.9), (2.2, 0.02, 0.06), C((140, 136, 128)))
        s.prism(x + 1.4, 2.0, 0, 0.5, 8.0, 14, C((186, 180, 168)), C(SOOT)); s.prism(x + 1.4, 2.0, 6.9, 0.52, 0.4, 14, C((176, 70, 54)), C((176, 70, 54)))   # the stack, its red band
        s.box((x - 0.2, 1.8, 0), (1.4, 1.6, 2.4), face((150, 156, 156), (110, 114, 114))); s.box((x - 0.25, 1.75, 2.4), (1.5, 1.7, 0.08), C(ROOF))      # the turbine house
        s.box((x + 0.2, 3.405, 0), (0.6, 0.03, 1.4), C(VOID) if k == 1 else C((120, 124, 122)))                         # its door: one open (the watcher turns the shafts by hand)
    # the air-cooled condenser: a deck of fans high on its legs (the desert plant's own shape)
    for i in range(4):
        for j in range(2):
            x, y = 0.0 + i * 2.4, 6.6 + j * 2.2
            for (dx, dy) in ((0.1, 0.1), (2.1, 0.1), (0.1, 1.9), (2.1, 1.9)): s.box((x + dx, y + dy, 0), (0.14, 0.14, 3.4), C(FRAME))
            s.box((x, y, 3.4), (2.3, 2.1, 0.3), face((150, 154, 152), (110, 114, 112))); s.prism(x + 1.15, y + 1.05, 3.7, 0.85, 0.08, 16, C((70, 72, 72)), C((40, 42, 42)))   # its fan, still
    s.box((-0.2, 6.4, 3.7), (9.8, 0.1, 1.0), C((136, 140, 138)))                                                           # the wind wall
    # the switchyard, its gantries and the lines going nowhere
    for gx in (8.8, 10.6):
        for k in range(2): SS.lattice(s, gx, 2.6, 1.3 * k, 0.5, 0.5, 1.3, (132, 136, 134))
        SS.lattice(s, gx, 5.0, 0.0, 0.5, 0.5, 1.3, (132, 136, 134)); SS.lattice(s, gx, 5.0, 1.3, 0.5, 0.5, 1.3, (132, 136, 134))
    s.box((8.8, 2.8, 2.5), (2.4, 0.08, 0.08), C((40, 40, 40))); s.box((8.8, 5.2, 2.5), (2.4, 0.08, 0.08), C((40, 40, 40)))
    for k in range(2): s.box((9.2 + k * 1.1, 3.6, 0), (0.9, 0.8, 1.1), face((120, 126, 124), (88, 92, 92)))
    # the gas line in along the edge, dry at its valve
    s.box((-1.8, -1.8, 0.5), (12.0, 0.24, 0.24), C((196, 160, 60))); s.prism(3.0, -1.68, 0.74, 0.3, 0.08, 10, C((176, 64, 52)), C((176, 64, 52)))
    for k in range(6): s.box((-1.6 + k * 2.2, -1.8, 0), (0.12, 0.12, 0.5), C(FRAME))
    s.box((9.0, 0.0, 0), (1.6, 1.2, 1.3), face(CONC, CONC_DK)); s.box((9.0, 1.205, 0), (0.7, 0.03, 1.0), C(VOID))           # the battery room, its door open
    for k in range(4): s.box((9.2 + k * 0.32, 1.5, 0), (0.26, 0.3, 0.26), C((54, 56, 60)) if k != 2 else C((176, 60, 44)))   # what came out of it
    ST.body(s, 4.4, 3.8, (84, 96, 108), (46, 46, 44))                                                                   # the watcher, at the open door
    return s


# ---------------------------------------------------------------------------------------------------- SPRING MOUNTAIN RANCH
def spring_mountain_ranch(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(53)
    H._ground(s, (-2, -2, 12, 12), groundc=PASTURE)
    # the cliff: Red Rock's sandstone along the back
    # (one mass stepping back in tiers, its bands of darker stone: the first cut's separate blocks read as crates)
    s.box((-2.0, -2.0, 0), (14.0, 1.6, 2.2), face(ROCK, ROCK_DK))
    s.box((-2.0, -2.0, 2.2), (14.0, 1.0, 1.6), face(ROCK, ROCK_DK)); s.box((-2.0, -2.0, 3.8), (9.0, 0.6, 1.2), face(ROCK, ROCK_DK))
    for (x0, w, z) in ((-2.0, 14.0, 0.7), (-2.0, 14.0, 1.5), (-2.0, 14.0, 2.9), (-2.0, 9.0, 4.4)):
        s.box((x0, -2.0 + (1.6 if z < 2.2 else 1.0 if z < 3.8 else 0.6) + 0.001, z), (w, 0.02, 0.12), C(ROCK_DK))
    for k in range(5): s.box((-1.4 + k * 2.6, -0.42, 0), (0.9, 0.5, 0.35), face(ROCK_DK, dk(ROCK_DK)))                  # what fell off it
    # the ranch house, red, its porch, the window where the phone is
    s.box((0.0, 0.6, 0), (3.6, 2.4, 2.0), face(RANCH_RED, RANCH_RED_DK)); s.box((-0.15, 0.45, 2.0), (3.9, 2.7, 0.22), face((120, 92, 76), (90, 70, 60))); s.box((-0.15, 1.6, 2.22), (3.9, 0.4, 0.22), C((100, 78, 64)))   # its roof and ridge
    s.box((-0.1, 3.0, 1.6), (3.8, 0.9, 0.08), face(WOOD, WOOD_DK)); s.box((0.0, 3.8, 0), (0.08, 0.08, 1.6), C(WOOD)); s.box((3.5, 3.8, 0), (0.08, 0.08, 1.6), C(WOOD))
    for k in range(3): s.box((0.3 + k * 1.1, 3.005, 0.8), (0.6, 0.03, 0.7), C(SASH))
    s.box((1.6, 3.005, 0), (0.6, 0.03, 1.4), C((90, 60, 44)))
    # the long barn and the hay under its own roof
    s.box((5.0, -0.4, 0), (5.0, 2.4, 2.4), face(WOOD, WOOD_DK)); s.box((4.85, -0.55, 2.4), (5.3, 2.7, 0.2), face(CORR, CORR_DK)); s.box((4.85, 0.6, 2.6), (5.3, 0.4, 0.25), C(CORR_DK))   # its tin roof and ridge
    s.box((7.0, 2.005, 0), (1.2, 0.03, 1.8), C(VOID))
    for (dx, dy) in ((0, 0), (2.2, 0), (0, 1.8), (2.2, 1.8)): s.box((8.9 + dx, 3.0 + dy, 0), (0.12, 0.12, 2.0), C(WOOD_DK))
    s.box((8.8, 2.9, 2.0), (2.5, 2.1, 0.08), face(CORR, CORR_DK))
    for k in range(3): s.box((9.0, 3.1, k * 0.5), (2.1, 1.6, 0.48), face((206, 182, 120), (160, 140, 90)))               # the hay
    # the corrals: rails, and the last cattle in them
    rails_x(s, 0.0, 6.0, 5.0); rails_x(s, 0.0, 6.0, 9.8); rails_y(s, 5.0, 9.8, 0.0); rails_y(s, 5.0, 9.8, 6.0); rails_y(s, 5.0, 9.8, 3.0)
    for k, (x, y, a) in enumerate(((0.6, 5.6, 'x'), (1.0, 7.4, 'y'), (2.0, 8.6, 'x'), (3.6, 5.8, 'x'), (4.0, 7.2, 'y'), (4.6, 8.8, 'x'), (1.6, 6.4, 'x'))):
        cow(s, x, y, CATTLE[k % len(CATTLE)], a)
    for k in range(2): s.box((0.4 + k * 3.2, 9.0, 0), (1.6, 0.5, 0.4), face((150, 150, 146), (110, 110, 106)))            # the troughs
    # the spring: its pond and its cottonwoods, the only green for miles
    s.prism(9.0, 8.4, 0.06, 1.5, 0.02, 16, C(WATER), C(WATER_DK))
    for (x, y, r) in ((7.6, 9.6, 0.9), (10.4, 7.0, 0.8), (10.6, 10.2, 1.0)):
        s.prism(x, y, 0, 0.14, 1.6, 6, C(WOOD_DK), C(WOOD_DK))
        for (dx, dy, rr, z, h) in ((0, 0, r * 0.75, 1.4, 1.0), (r * 0.45, 0.2, r * 0.6, 1.7, 0.9), (-r * 0.35, r * 0.35, r * 0.55, 1.9, 0.8), (0.1, -r * 0.4, r * 0.5, 2.1, 0.7)):
            s.prism(x + dx, y + dy, z, rr, h, 9, C(COTTON), C(COTTON_DK if z < 2 else (126, 132, 82)))   # a canopy in lumps (one drum read as a tank)
    # the two on the fence with rifles, their fire
    ST.body(s, 6.6, 7.6, (96, 84, 66), (48, 44, 40)); ST.body(s, 7.8, 9.0, (84, 96, 108), (46, 46, 44))
    s.prism(7.4, 8.2, 0.06, 0.3, 0.06, 8, C((60, 56, 50)), C((40, 38, 36)))
    return s


# ---------------------------------------------------------------------------------------------------- CALLVILLE BAY
def rv(s, x, y, col, along='x', awning=True):
    d = dk(col)
    if along == 'x':
        s.box((x, y, 0.3), (3.0, 1.1, 1.5), face(col, d)); s.box((x + 3.0, y + 0.1, 0.3), (0.4, 0.9, 1.0), face(col, d)); s.box((x + 3.0, y + 0.15, 0.9), (0.38, 0.8, 0.4), C((52, 60, 66)))
        s.box((x + 0.2, y - 0.01, 1.1), (2.4, 0.02, 0.3), C((120, 84, 62))); s.box((x, y, 1.8), (3.0, 1.1, 0.06), C(d))
        for xx in (x + 0.4, x + 2.4): s.box((xx, y - 0.02, 0), (0.5, 0.1, 0.35), C(TYRE))
        if awning: s.box((x + 0.4, y - 1.2, 1.5), (2.2, 1.2, 0.05), face((150, 112, 80), (110, 80, 60))); s.box((x + 0.4, y - 1.2, 0), (0.06, 0.06, 1.5), C(FRAME)); s.box((x + 2.54, y - 1.2, 0), (0.06, 0.06, 1.5), C(FRAME))
    else:
        s.box((x, y, 0.3), (1.1, 3.0, 1.5), face(col, d)); s.box((x + 0.1, y + 3.0, 0.3), (0.9, 0.4, 1.0), face(col, d)); s.box((x + 0.15, y + 3.0, 0.9), (0.8, 0.38, 0.4), C((52, 60, 66)))
        s.box((x + 1.09, y + 0.2, 1.1), (0.02, 2.4, 0.3), C((120, 84, 62))); s.box((x, y, 1.8), (1.1, 3.0, 0.06), C(d))
        for yy in (y + 0.4, y + 2.4): s.box((x + 1.08, yy, 0), (0.1, 0.5, 0.35), C(TYRE))
        if awning: s.box((x + 1.1, y + 0.4, 1.5), (1.2, 2.2, 0.05), face((150, 112, 80), (110, 80, 60)))


def callville_bay(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(59)
    H._ground(s, (-2, -2, 12, 12), groundc=(78, 74, 66))
    # the lake far out, and the mud it left: cracked, the bathtub ring on the rock
    s.box((-2.0, -2.0, 0.06), (14.0, 3.4, 0.02), face(MUD, MUD_DK))
    s.box((-2.0, -2.0, 0.08), (14.0, 1.2, 0.02), face(WATER, WATER_DK))
    for k in range(18): x = rng.uniform(-1.8, 11.6); y = rng.uniform(-0.6, 1.2); s.box((x, y, 0.081), (rng.uniform(0.4, 1.2), 0.04, 0.01), C(MUD_DK))   # the cracks
    for k in range(2): s.box((-2.0, 1.4 + k * 0.12, 0.06), (14.0, 0.1, 0.03), C((222, 216, 200)))                    # the bathtub ring
    # the marina on the mud: its docks lying down, the boats on their sides
    for k in range(3): s.box((6.0 + k * 1.6, -1.8, 0.1), (0.5, 2.8, 0.12), face((176, 170, 158), (132, 128, 120)))
    s.box((6.0, 0.8, 0.1), (4.2, 0.5, 0.12), face((176, 170, 158), (132, 128, 120)))
    for (x, y, c) in ((6.6, -1.2, WHITE), (8.2, -0.4, (196, 200, 204)), (9.7, -1.4, WHITE)):
        s.box((x, y, 0.1), (1.0, 2.2, 0.6), face(c, dk(c))); s.box((x + 0.2, y + 0.6, 0.7), (0.6, 0.9, 0.5), C((60, 70, 76)))
    s.box((9.4, -0.8, 0.1), (1.0, 0.8, 0.9), face((150, 154, 152), (110, 114, 112)))                                     # the marina's store, on the mud
    # the campground: motorhomes in their sites, the drying lines of fish, the camp host's sign
    rv(s, -1.2, 3.6, RV[0]); rv(s, 3.0, 3.4, RV[1]); rv(s, -1.4, 6.9, RV[2], along='y'); rv(s, 1.2, 7.4, RV[3]); rv(s, 5.0, 7.0, RV[0], along='y')
    rv(s, 7.2, 4.4, RV[2], awning=False); rv(s, 7.6, 8.4, RV[1]); rv(s, 3.4, 10.0, RV[3], awning=False)
    for (x, y) in ((1.4, 5.6), (5.2, 6.2), (9.4, 6.6)):                                                                   # the fish, drying on lines
        s.box((x, y, 1.2), (1.6, 0.03, 0.03), C(FRAME))
        for k in range(6): s.box((x + 0.1 + k * 0.26, y, 0.85), (0.08, 0.03, 0.35), C((180, 170, 140)))
    for (x, y, z) in CAMP_FIRES: s.prism(x, y, 0.06, 0.28, 0.06, 8, C((60, 56, 50)), C((40, 38, 36)))
    for (x, y, c) in ((2.6, 6.8, (96, 84, 66)), (6.4, 5.2, (84, 96, 108)), (8.2, 7.4, (124, 96, 84))): ST.body(s, x, y, c, (46, 46, 44))
    s.box((-1.6, 10.6, 0), (0.1, 0.1, 1.4), C(WOOD_DK)); s.box((-1.9, 10.55, 1.0), (1.4, 0.06, 0.6), C((90, 70, 50)))      # the camp host's sign
    s.box((-1.8, 10.53, 1.1), (1.2, 0.02, 0.12), C((226, 214, 176))); s.box((-1.8, 10.53, 1.3), (0.9, 0.02, 0.12), C((226, 214, 176)))
    return s


PLACES = {'the_lab': the_lab, 'lenzie_station': lenzie_station, 'spring_mountain_ranch': spring_mountain_ranch, 'callville_bay': callville_bay}
SAY = {'the_lab': 'TULE SPRINGS LAB', 'lenzie_station': 'LENZIE STATION', 'spring_mountain_ranch': 'SPRING MOUNTAIN RANCH', 'callville_bay': 'CALLVILLE BAY'}
LIKE = {'the_lab': 'region:fortress', 'lenzie_station': 'region:fortress', 'spring_mountain_ranch': 'region:camp', 'callville_bay': 'region:camp'}
_older = HC.moving


def moving(sc, frame):
    """what moves on the beat: the clock by the lab's door and the wolves' eyes; the stacks' red lights; the guards' fire and the
    house's lamp; the cooking fires and a lantern on the dead marina"""
    key = sc['key']
    if key not in PLACES: return _older(sc, frame)
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: PB.proj(sc, p)
    if key == 'the_lab':
        x, y = PJ(LAB_CLOCK); blob(L, x, y, 1.5, (255, 60, 50), 0.95 if frame else 0.2)
        x, y = PJ(PEN4); blob(L, x, y, 1.0, (230, 240, 180), 0.0 if frame else 0.9); blob(L, x + 2, y + 1, 1.0, (230, 240, 180), 0.0 if frame else 0.85)
    elif key == 'lenzie_station':
        for p in STACK_LIGHTS: x, y = PJ(p); blob(L, x, y, 1.6, (255, 50, 40), 0.95 if frame else 0.1); blob(L, x, y, 4.0, (255, 60, 50), 0.3 if frame else 0.0)
    elif key == 'spring_mountain_ranch':
        x, y = PJ(RANCH_FIRE); blob(L, x, y, 2.0, (255, 170, 70), 0.95 if frame else 0.55); blob(L, x, y, 5.0, (255, 140, 60), 0.25 if frame else 0.12)
        x, y = PJ(RANCH_LAMP); blob(L, x, y, 1.6, (255, 220, 150), 0.25 if frame else 0.9)
    else:
        for i, p in enumerate(CAMP_FIRES): x, y = PJ(p); blob(L, x, y, 1.8, (255, 170, 70), 0.95 if (i + frame) % 2 else 0.45); blob(L, x, y, 4.5, (255, 140, 60), 0.22)
        x, y = PJ(MARINA_LAMP); blob(L, x, y, 1.5, (255, 220, 150), 0.9 if frame else 0.3)
    return L


def bind():
    """this file's four through the places tool's own scenes / render / finish / sheet (the fifteen older places are not re-made)"""
    HC.bind()
    PW.PLACES = PLACES; PW.SAY = dict(PW.SAY, **SAY); PW.LIKE = dict(PW.LIKE, **LIKE); PW.moving = moving
    PW.OUT = os.path.join(R, 'records/target/cook6_places_region')


def finish():
    PW.finish()
    mp = os.path.join(PW.DEST, 'place_pieces.json'); man = json.load(open(mp))
    for k in PLACES: man['pictures'][k]['finished'] = 'cook 6, 11/20'; man['pictures'][k]['where'] = 'region'
    man['region'] = ("A place with where 'region' is drawn by the region's own draw (slices/bohemia_region.js drawPlaces, through the map's "
                     "mapBaseDraw by its name): its picture in place of the painted patch, the plate scaled to the patch's own blocks "
                     "(a fortress 4, a camp 2) times 0.85, never under min_css (COOK SIX 11/20)")
    json.dump(man, open(mp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'; bind()
    if cmd == 'scenes': PW.scenes()
    elif cmd == 'render':
        import glob
        for f in glob.glob(os.path.join(PW.OUT, 'masters', '*.png')): os.remove(f)      # (the render skips a master on disk: a changed scene must render again)
        PW.render()
    elif cmd == 'finish': finish()
    elif cmd == 'sheet': PW.sheet(a[1], 'COOK6_THE_REGIONS_FOUR_11_20', tuple(PLACES), 'cook6-the-regions-four-11-20')
    else: print(__doc__)
