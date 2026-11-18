#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the east side: three more places wear their own piece] (11/18/26; the coordinator's routine 'COOK FIVE
next', VAMILY rules 453, 441, 408, 409(c), 455: 'take the next jobs on your own list, one build each: finished art wherever a card
still says STAND-IN; every picture lands light').

Five of the valley's fifteen real places (records/target/bb/real_places.json, where 'valley') still wore the kit art of the kind
each is like. These are three of them: CLARK STATION a battery yard like any battery yard, the ANIMAL SHELTER a warehouse like
any warehouse, THE SCRAP MILL an industrial block like any other. Each gets its own piece on the map by the 11/17k pipeline
(slices/bohemia_place_pieces.js draws it; NO CODE in this build: three entries in slices/place_pieces/place_pieces.json and six
lossless WebP pictures), made by this lane's places tool, which this one imports.

  CLARK STATION       'THE MINT': the oldest steam plant in Nevada. 'Nineteen units, and one still turns: they cut a hatch in the
                      old 1954 boiler and feed it pallets and tires. That one unit charges every battery on this side of the
                      valley.' The tall boiler house and its stack, the turbine hall, four gas units cold in a row, the
                      switchyard, the gas pipe dry at its valve, the heap of tires and pallets at the hatch and two men feeding
                      it, the charging racks under their roof and the ones who wait with batteries. On the beat: the hatch's fire,
                      and the stack's black smoke ('the whole east side smelled like it').
  THE ANIMAL SHELTER  Mojave Road: 'when the staff stopped coming I opened every kennel ... most of them went to the washes ...
                      these ones never left.' The low shelter, two blocks of outdoor runs with every gate open, the control
                      truck on its rims, the keeper and her bucket, the dogs eating in a row at the door ('oldest first'), dogs
                      lying in the open runs, and the brindle by himself at the kerb, looking out. On the beat: the lamp over
                      the intake door and its bell ('the intake bell still rings at nine every morning. There is nobody at the
                      door').
  THE SCRAP MILL      North Las Vegas, Commerce Street: 'where the dead grid ends up: copper pulled out of the walls, sheet metal
                      from the roofs, a baler that still runs on a truck battery.' A patchwork fence, two walls of cars pressed
                      flat and stacked, the heap and the crane's magnet over it, the baler and its bales in rows, a truck with
                      its hood up and a cable from its battery to the baler, coils of copper, a heap of roof sheet, pole
                      transformers stood in a line, white goods down one side. On the beat: the baler's lamp, and a torch
                      cutting.

  python3 tools/bohemia_cook5_the_east_sides_three_wear_their_own_piece_11_18_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook5_the_east_sides_three_wear_their_own_piece_11_18_26.py render
  python3 tools/bohemia_cook5_the_east_sides_three_wear_their_own_piece_11_18_26.py finish
  python3 tools/bohemia_cook5_the_east_sides_three_wear_their_own_piece_11_18_26.py sheet <shots>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a 1950s steam generating station (a tall
steel-clad boiler house, one concrete stack, a lower turbine hall beside it, later gas turbine packages in a row with short
stacks, a switchyard of lattice gantries and transformers); a municipal animal shelter (a low office block, rows of roofed
outdoor kennel runs with chain-link gates, an animal control truck with compartment doors down its side); a scrap yard (a
corrugated fence, end-of-life cars pressed and stacked, a baling press under an open shed with bales in rows, a lattice-boom
crane with a lifting magnet, copper in coils, pole transformers). The twins: this lane's ten earlier places (the same frame,
rig and draw), and the kit's battery, warehouse and industrial blocks beside them on the map (the card shows each before and
now).
REUSE CHECK (REUSE-FIRST): this lane's places tool (its capture, render, finish, sheet and colours), its downtown tool and its
Strip tool (the lattice, the finish that hands the rendered master to the beat): all imported; this file is three scenes and
three beats.
ANALOG HORROR: a power station burning tires to print the only money, its control room calling the load to nobody; a bell that
rings for intake at an empty door, and the dogs that came back; a yard where the city's own wiring is baled by a machine run
off a truck.
No reference game.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_places_wear_their_own_piece_11_17_26 as PW      # this lane's: the pipeline
import bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26 as DT  # this lane's: its colours and face()
import bohemia_cook5_the_strips_three_wear_their_own_piece_11_18_26 as SS # this lane's: the lattice, the finish

ST, PB, C = PW.ST, PW.PB, PW.C
CONC, CONC_DK, ROOF, ROOF_DK, STEEL, STEEL_DK, FRAME, SOOT, TYRE, LOT = PW.CONC, PW.CONC_DK, PW.ROOF, PW.ROOF_DK, PW.STEEL, PW.STEEL_DK, PW.FRAME, PW.SOOT, PW.TYRE, PW.LOT
CORR, CORR_DK, RUST, RUST_DK, WOOD, WOOD_DK, CRATE = PW.CORR, PW.CORR_DK, PW.RUST, PW.RUST_DK, PW.WOOD, PW.WOOD_DK, PW.CRATE
face, VOID, SASH, STUCCO, STUCCO_DK = DT.face, DT.VOID, DT.SASH, DT.STUCCO, DT.STUCCO_DK
WHITE, RED = SS.WHITE, SS.RED
YARD = (112, 104, 92)                                         # packed dirt and oil
PIPE = (196, 160, 60)                                         # the gas main's yellow
COPPER = (186, 112, 62)
HATCH = (0.4, 3.02, 0.7)                                      # the hatch they cut in the 1954 boiler
STACK_TOP = (-0.2, -0.6, 13.6)
CTRL = (10.52, 0.6, 2.3)                                      # the control room's window
INTAKE = (2.6, 3.06, 2.0)                                     # the lamp over the intake door
BELL = (1.3, 3.5, 1.5)
BALER = (8.4, 6.56, 2.8)                                      # the baler's lamp
TORCH = (0.3, 8.7, 0.9)


# ---------------------------------------------------------------------------------------------------- CLARK STATION
def clark_station(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=YARD)
    # the 1954 unit: the boiler house, steel-clad, and its one stack
    s.box((-1.6, -1.6, 0), (4.4, 4.6, 6.6), face(CORR, CORR_DK)); s.box((-1.7, -1.7, 6.6), (4.6, 4.8, 0.14), face(ROOF, ROOF_DK))
    for k in range(4): s.box((-1.6, 3.005, 1.4 + k * 1.3), (4.4, 0.02, 0.07), C(CORR_DK)); s.box((2.805, -1.6, 1.4 + k * 1.3), (0.02, 4.6, 0.07), C(CORR_DK))     # its girts
    for k in range(3): s.box((-1.1 + k * 1.5, 3.01, 4.6), (0.9, 0.03, 1.2), C(SASH)); s.box((2.81, -1.0 + k * 1.5, 4.6), (0.03, 0.9, 1.2), C(SASH))                # the high windows, dark
    s.prism(-0.2, -0.6, 6.7, 0.62, 6.2, 14, C((176, 170, 158)), C(SOOT)); s.prism(-0.2, -0.6, 12.9, 0.66, 0.7, 14, C((70, 64, 58)), C(SOOT))                     # the stack, black at its lip
    s.prism(-0.2, -0.6, 10.2, 0.64, 0.5, 14, C(RED), C(RED))
    s.box((-0.2, 3.01, 0), (1.2, 0.04, 1.3), C((255, 150, 60))); s.box((-0.3, 3.03, 1.3), (1.4, 0.05, 0.12), C(SOOT)); s.box((-0.3, 3.03, 0), (0.1, 0.05, 1.3), C(SOOT)); s.box((1.0, 3.03, 0), (0.1, 0.05, 1.3), C(SOOT))   # the hatch they cut: fire in it
    for k in range(4): s.box((-0.25 + 0.04 * k, 3.015, 1.42 + k * 0.5), (1.3 - 0.1 * k, 0.02, 0.5), C((70 + 16 * k, 66 + 16 * k, 62 + 15 * k)))                # the soot up the cladding over it
    # the turbine hall beside it, and the control room on its end
    s.box((2.8, -1.3, 0), (7.6, 3.6, 3.3), face((168, 162, 150), (124, 120, 110))); s.box((2.9, -1.2, 3.3), (7.4, 3.4, 0.08), C(ROOF))
    for k in range(6): s.box((3.3 + k * 1.15, 2.305, 1.9), (0.7, 0.03, 0.9), C(SASH))
    s.box((10.405, -0.6, 1.9), (0.03, 2.4, 0.8), C((60, 74, 80)))                                             # the control room's glass (the beat lights it)
    for k in range(3): s.prism(4.2 + k * 2.2, 0.5, 3.38, 0.34, 0.7, 10, C(STEEL), C(STEEL_DK))               # the hall's vents
    # the four gas units, cold, in a row
    for k in range(4):
        x = 4.0 + k * 1.9
        s.box((x, 3.6, 0), (1.3, 1.7, 1.25), face(STEEL, STEEL_DK)); s.box((x + 0.1, 3.4, 0.3), (1.1, 0.2, 0.8), C((96, 100, 100))); s.prism(x + 0.65, 4.7, 1.25, 0.27, 1.9, 10, C((150, 146, 138)), C(VOID))
    # the gas main, dry: in along the yard's edge to its valve
    for k in range(5): s.box((-1.7, 4.2 + k * 1.6, 0), (0.12, 0.12, 0.7), C(FRAME))
    s.box((-1.75, 3.6, 0.7), (0.24, 7.6, 0.24), C(PIPE)); s.prism(-1.63, 5.0, 0.94, 0.3, 0.08, 10, C(RED), C(RED)); s.box((-1.75, 11.2, 0), (0.24, 0.24, 0.94), C(PIPE))
    # what it burns now: the heap of tires and pallets at the hatch, and two men feeding it
    for (x, y, n) in ((1.6, 3.8, 4), (2.3, 4.3, 3), (1.4, 4.7, 2), (2.6, 3.5, 2), (2.0, 5.2, 1)):
        for k in range(n): s.prism(x + 0.05 * k, y, 0.28 * k, 0.36, 0.26, 10, C(TYRE), C((34, 34, 36)), inner=0.16)
    for k in range(4): s.box((-1.0, 4.4, 0.16 * k), (1.2, 1.0, 0.13), C(WOOD if k % 2 else WOOD_DK))
    ST.body(s, 0.5, 4.0, (70, 64, 58), (40, 38, 36)); ST.body(s, -0.2, 5.6, (96, 84, 66), (48, 44, 40))
    # the switchyard: two gantries, their lines, three transformers
    for gx in (6.4, 9.6):
        for gy in (6.6, 10.2):
            for k in range(2): SS.lattice(s, gx, gy, 1.3 * k, 0.6, 0.6, 1.3, (132, 136, 134))
        s.box((gx + 0.2, 6.6, 2.6), (0.2, 4.2, 0.2), C((132, 136, 134)))
        for k in range(3): s.box((gx + 0.26, 7.3 + k * 1.2, 2.2), (0.08, 0.08, 0.4), C((90, 60, 44)))
    for k in range(3): s.box((6.7, 7.2 + k * 1.2, 2.5), (3.2, 0.04, 0.04), C((40, 40, 40)))
    for k in range(3):
        x = 7.2 + k * 0.05; y = 7.0 + k * 1.25
        s.box((x, y, 0), (1.5, 0.9, 1.3), face((120, 126, 124), (88, 92, 92))); s.box((x + 1.5, y + 0.1, 0.2), (0.25, 0.7, 0.9), C((96, 100, 100)))
        for q in range(2): s.prism(x + 0.4 + q * 0.7, y + 0.45, 1.3, 0.09, 0.5, 6, C((176, 150, 120)), C((176, 150, 120)))
    # the mint: the charging racks under their roof, a cable to them from the hall, and the ones who wait with what they have
    for (dx, dy) in ((0, 0), (4.4, 0), (0, 2.6), (4.4, 2.6)): s.box((-0.4 + dx, 7.6 + dy, 0), (0.12, 0.12, 2.1), C(FRAME))
    s.box((-0.6, 7.4, 2.1), (4.9, 3.1, 0.1), face(CORR, CORR_DK))
    for r in range(3):
        s.box((0.0, 7.9 + r * 0.8, 0), (3.6, 0.5, 0.08), C(FRAME)); s.box((0.0, 7.9 + r * 0.8, 0.7), (3.6, 0.5, 0.06), C(FRAME))
        for k in range(9):
            for z in (0.08, 0.76): s.box((0.1 + k * 0.39, 7.96 + r * 0.8, z), (0.3, 0.38, 0.36), C((54, 56, 60)) if (k + r) % 4 else C((176, 60, 44)))
    for k in range(8): s.box((4.3 + 0.0 * k, 2.4 + k * 0.66, 0.06), (0.14, 0.7, 0.1), C((24, 24, 24)))
    for k, (x, y) in enumerate(((1.0, 11.0), (2.0, 11.2), (3.0, 11.0), (4.2, 11.3))):
        ST.body(s, x, y, ((120, 108, 90), (84, 96, 108), (140, 104, 72), (104, 104, 92))[k], (48, 46, 42)); s.box((x + 0.62, y + 0.1, 0), (0.3, 0.3, 0.34), C((54, 56, 60)))
    return s


# ---------------------------------------------------------------------------------------------------- THE ANIMAL SHELTER
DOGS = ((196, 160, 110), (44, 40, 38), (226, 220, 206), (120, 84, 54), (150, 138, 120), (84, 70, 58))
BRINDLE = (104, 76, 48)


def dog(s, x, y, col, lying=False, along='x', k=1.3):
    """a dog as the map can have him: a body, four legs (or none, lying), a head up at one end. Bigger than life, the way the
    map's people are, or he is a speck"""
    dk = tuple(int(v * 0.7) for v in col); L, W_, Hh = 1.0 * k, 0.38 * k, 0.36 * k; z = 0.0 if lying else 0.3 * k
    if along == 'x':
        s.box((x, y, z), (L, W_, Hh), face(col, dk)); s.box((x + L - 0.08 * k, y + 0.03, z + Hh - 0.05), (0.36 * k, W_ - 0.06, 0.34 * k), face(col, dk))
        if not lying:
            for dx in (0.04, L - 0.2 * k): s.box((x + dx, y, 0), (0.16 * k, W_, z), C(dk))
        s.box((x - 0.14 * k, y + W_ / 2 - 0.04, z + Hh - 0.08), (0.16 * k, 0.08, 0.08), C(dk))
    else:
        s.box((x, y, z), (W_, L, Hh), face(col, dk)); s.box((x + 0.03, y + L - 0.08 * k, z + Hh - 0.05), (W_ - 0.06, 0.36 * k, 0.34 * k), face(col, dk))
        if not lying:
            for dy in (0.04, L - 0.2 * k): s.box((x, y + dy, 0), (W_, 0.16 * k, z), C(dk))
        s.box((x + W_ / 2 - 0.04, y - 0.14 * k, z + Hh - 0.08), (0.08, 0.16 * k, 0.08), C(dk))


def runs_x(s, x0, y0, n, L=3.0, w=0.95):
    """a block of outdoor kennel runs, side by side along y, their gates to +x: a back wall, low walls between, a shade roof
    over the back half, and every gate standing open"""
    s.box((x0, y0, 0), (0.14, n * w + 0.1, 1.5), face(CONC, CONC_DK))
    for k in range(n + 1): s.box((x0, y0 + k * w, 0), (L, 0.08, 0.9), face(CONC, CONC_DK))
    s.box((x0 - 0.1, y0 - 0.1, 1.5), (L * 0.55, n * w + 0.3, 0.08), face(CORR, CORR_DK))
    for k in range(n + 1): s.box((x0 + L - 0.06, y0 + k * w, 0), (0.07, 0.08, 1.4), C(FRAME))
    s.box((x0 + L - 0.06, y0, 1.34), (0.07, n * w + 0.08, 0.06), C(FRAME))
    for k in range(n): s.box((x0 + L, y0 + k * w + 0.06, 0.1), (0.75, 0.04, 1.2), C((132, 136, 134)))        # the gate, open


def the_animal_shelter(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=LOT)
    # the shelter: a low block, the intake door, the lamp over it, the bell on its post
    s.box((-1.6, -1.6, 0), (7.4, 4.6, 2.5), face(STUCCO, STUCCO_DK)); s.box((-1.7, -1.7, 2.5), (7.6, 4.8, 0.26), face((176, 156, 122), (136, 120, 94))); s.box((-1.4, -1.4, 2.76), (7.0, 4.2, 0.04), C(ROOF))
    s.box((0.2, -1.0, 2.8), (1.4, 1.1, 0.5), C(STEEL)); s.box((3.6, 0.2, 2.8), (1.2, 1.0, 0.5), C(STEEL))
    s.box((2.0, 3.005, 0), (1.2, 0.03, 1.8), C(VOID)); s.box((1.8, 3.0, 1.8), (1.6, 0.8, 0.12), face(CONC, CONC_DK)); s.box((2.45, 3.02, 1.94), (0.3, 0.05, 0.2), C((255, 214, 150)))     # the intake door, its lamp
    for k in range(3): s.box((-1.2 + k * 0.95, 3.005, 0.9), (0.65, 0.03, 0.9), C(SASH))
    for k in range(2): s.box((3.8 + k * 0.95, 3.005, 0.9), (0.65, 0.03, 0.9), C(SASH))
    for k in range(3): s.box((5.805, -1.0 + k * 1.4, 0.9), (0.03, 0.8, 0.9), C(SASH))
    s.box((-1.2, 3.005, 2.0), (2.6, 0.03, 0.4), C((70, 96, 110)))                                             # the shelter's name, letters gone
    for k in range(7): s.box((-1.1 + k * 0.35, 3.02, 2.08), (0.22, 0.02, 0.24), C(WHITE) if k not in (2, 5) else C((70, 96, 110)))
    s.box((1.25, 3.45, 0), (0.08, 0.08, 1.5), C(FRAME)); s.box((1.12, 3.4, 1.36), (0.34, 0.2, 0.3), C((196, 160, 70)))                                         # the intake bell
    # the runs: two blocks, every gate open
    runs_x(s, 6.6, -1.6, 6); runs_x(s, -1.7, 6.6, 5)
    # the control truck on its rims: compartment doors down its side
    vx, vy = 6.0, 9.2
    s.box((vx, vy, 0.3), (2.8, 1.3, 1.3), face(WHITE, (176, 172, 160))); s.box((vx + 2.8, vy + 0.1, 0.3), (0.9, 1.1, 0.9), face(WHITE, (176, 172, 160))); s.box((vx + 2.8, vy + 0.2, 0.9), (0.92, 0.9, 0.3), C((40, 46, 52)))
    for k in range(3): s.box((vx + 0.2 + k * 0.88, vy + 1.3, 0.5), (0.7, 0.02, 0.8), C((40, 44, 48)) if k != 1 else C(VOID))
    for xx in (vx + 0.3, vx + 2.9): s.box((xx, vy + 1.3, 0), (0.55, 0.12, 0.34), C(TYRE))
    # the keeper and her bucket; the dogs eating in a row at the door, oldest first
    ST.body(s, 3.6, 4.6, (124, 96, 84), (60, 50, 46)); s.prism(4.4, 4.9, 0, 0.2, 0.36, 8, C((150, 150, 146)), C((90, 80, 60)))
    for k in range(7):
        x = -1.0 + k * 0.95; dog(s, x + 0.2, 4.4, DOGS[k % len(DOGS)], along='y'); s.prism(x + 0.4, 5.75, 0.06, 0.2, 0.08, 8, C((206, 206, 198)), C((130, 100, 70)))
    for k in range(4): s.box((4.9 + 0.5 * (k % 2), 3.3 + 0.3 * (k // 2), 0.14 * (k // 2)), (0.5, 0.3, 0.14), C((200, 176, 120)))                               # the sacks they never got to
    # the ones that never left: lying in the open runs, loose on the lot, and the brindle by himself at the kerb, looking out
    dog(s, 6.9, 0.2, DOGS[1], lying=True, along='y')
    dog(s, 7.2, 2.3, DOGS[0], lying=True); dog(s, 8.4, -0.4, DOGS[3], along='x'); dog(s, 8.1, 1.3, DOGS[2], lying=True)
    dog(s, -0.9, 8.2, DOGS[4], lying=True); dog(s, 0.5, 9.4, DOGS[5]); dog(s, 2.0, 7.2, DOGS[2], lying=True, along='y')
    dog(s, 9.9, 5.6, DOGS[0]); dog(s, 4.6, 7.4, DOGS[1], along='y')
    dog(s, 3.2, 10.6, BRINDLE, along='y', k=1.55)
    return s


# ---------------------------------------------------------------------------------------------------- THE SCRAP MILL
CARS = ((150, 70, 52), (96, 112, 124), (206, 200, 186), (170, 150, 110), (84, 88, 84), (132, 60, 48), (120, 132, 110))


def the_scrap_mill(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(77); dk = lambda c: tuple(int(v * 0.7) for v in c)
    H._ground(s, (-2, -2, 12, 12), groundc=YARD)
    # the fence: sheet off other people's roofs, no two panels alike
    for k in range(9):
        c = ((136, 140, 138), (150, 92, 60), (112, 120, 124), (170, 160, 140), (120, 76, 54))[k % 5]
        s.box((-1.9 + k * 1.52, -1.9, 0), (1.5, 0.1, 1.5 + 0.2 * (k % 3)), face(c, dk(c))); s.box((-1.9, -1.8 + k * 1.52, 0), (0.1, 1.5, 1.5 + 0.2 * ((k + 1) % 3)), face(c, dk(c)))
    # cars pressed flat and stacked, two walls of them
    n = 0
    for (x, y, h, ax) in ((-1.5, -1.6, 6, 'x'), (1.2, -1.6, 5, 'x'), (3.9, -1.6, 6, 'x'), (-1.5, -0.4, 3, 'x'), (1.2, -0.4, 2, 'x'), (-1.6, 1.0, 5, 'y'), (-1.6, 3.7, 4, 'y'), (-0.4, 1.0, 2, 'y')):
        for k in range(h):
            c = CARS[n % len(CARS)]; n += 1; o = rng.uniform(-0.07, 0.07)
            s.box((x + o, y + o, k * 0.38), (2.5, 1.1, 0.34) if ax == 'x' else (1.1, 2.5, 0.34), face(c, dk(c)))
    # the heap: what the magnet has dropped
    SCRAP = ((160, 96, 60), (128, 78, 54), (150, 92, 60), (136, 140, 138), (112, 120, 124), (176, 152, 108), (140, 62, 48), (150, 70, 52), (96, 100, 100))
    for _ in range(150):
        r = 3.0 * math.sqrt(rng.rand()); a = rng.uniform(0, 6.2832); top = 3.9 * (1 - r / 3.0) ** 0.75; z = top * rng.uniform(0.45, 1.0); c = SCRAP[rng.randint(len(SCRAP))]
        s.box((5.3 + r * math.cos(a) - 0.3, 1.9 + r * math.sin(a) * 0.8 - 0.3, max(0.0, z - 0.35)), (rng.uniform(0.4, 1.0), rng.uniform(0.35, 0.9), rng.uniform(0.3, 0.7)), face(c, dk(c)))
    # the crane: a lattice mast, a jib over the heap, the magnet and what it holds
    for k in range(5): SS.lattice(s, 9.6, 0.6, 1.25 * k, 0.8, 0.8, 1.25, (150, 92, 60))
    s.box((4.6, 0.86, 6.25), (5.9, 0.26, 0.32), C((150, 92, 60))); s.box((9.5, 0.5, 6.25), (1.0, 1.0, 0.9), face((170, 160, 140), (124, 116, 100)))
    s.box((5.5, 0.96, 4.6), (0.07, 0.07, 1.65), C((30, 30, 30))); s.prism(5.53, 1.0, 4.3, 0.55, 0.32, 12, C(STEEL_DK), C((60, 60, 60)))
    for k in range(5): s.box((5.1 + rng.uniform(0, 0.6), 0.7 + rng.uniform(0, 0.5), 3.9 + rng.uniform(0, 0.2)), (0.45, 0.35, 0.3), face(CARS[k], dk(CARS[k])))
    # the baler, out in the yard, a truck's battery running it; its bales in rows
    bx, by = 7.0, 4.8
    s.box((bx, by, 0), (2.8, 1.7, 0.5), face(STEEL_DK, (50, 52, 52))); s.box((bx, by, 0.5), (0.34, 1.7, 2.1), face(STEEL_DK, (50, 52, 52))); s.box((bx + 2.46, by, 0.5), (0.34, 1.7, 2.1), face(STEEL_DK, (50, 52, 52)))
    s.box((bx, by, 2.6), (2.8, 1.7, 0.36), face(STEEL_DK, (50, 52, 52)))
    s.box((bx + 0.5, by + 0.2, 1.45), (1.8, 1.3, 1.1), face((214, 176, 52), (156, 126, 36))); s.box((bx + 0.6, by + 0.3, 0.5), (1.6, 1.1, 0.7), face((150, 150, 146), (104, 104, 100)))   # the ram, a bale under it
    s.box((bx + 1.25, by + 1.72, 2.68), (0.3, 0.05, 0.22), C((255, 180, 70)))                                 # its lamp
    for i in range(5):
        for j in range(3):
            for k in range(2 if (i * 2 + j) % 3 else 1):
                c = ((150, 150, 146), (132, 110, 90), (120, 128, 126), (160, 120, 80))[(i + j + k) % 4]
                s.box((6.0 + i * 0.86, 7.6 + j * 0.86, k * 0.72), (0.76, 0.76, 0.68), face(c, dk(c)))
    px, py = 2.4, 5.2                                          # the truck, its hood up, the cable from its battery
    TR = (96, 112, 124)
    s.box((px, py, 0.3), (2.0, 1.2, 0.5), face(TR, dk(TR))); s.box((px + 2.0, py, 0.3), (1.2, 1.2, 1.1), face(TR, dk(TR))); s.box((px + 2.1, py + 0.1, 0.9), (1.0, 1.0, 0.4), C((40, 46, 52)))
    s.box((px + 3.2, py, 0.3), (0.9, 1.2, 0.6), face(TR, dk(TR))); s.box((px + 3.2, py, 0.9), (0.08, 1.2, 0.9), C(dk(TR)))
    for xx in (px + 0.3, px + 3.0): s.box((xx, py + 1.2, 0), (0.6, 0.12, 0.4), C(TYRE))
    for k in range(5): s.box((px + 4.1 + k * 0.5, py + 0.4, 0.06), (0.52, 0.12, 0.08), C((24, 24, 24)))
    # the copper: pulled out of the walls, coiled, on pallets
    for (x, y, n2) in ((1.8, 8.4, 3), (2.7, 8.6, 2), (2.0, 9.4, 2), (3.0, 9.6, 3), (3.9, 8.8, 1), (4.0, 9.9, 2)):
        s.box((x - 0.45, y - 0.45, 0), (0.9, 0.9, 0.12), C(WOOD))
        for k in range(n2): s.prism(x, y, 0.12 + k * 0.24, 0.38, 0.22, 10, C(COPPER), C((150, 84, 46)), inner=0.14)
    # roof sheet in a heap, and a man cutting it
    for k in range(12):
        c = ((136, 140, 138), (150, 92, 60), (112, 120, 124))[k % 3]
        s.box((-1.3 + rng.uniform(-0.15, 0.15), 6.8 + rng.uniform(-0.15, 0.15), k * 0.07), (1.5, 2.2, 0.05), face(c, dk(c)))
    ST.body(s, 0.5, 8.4, (70, 64, 58), (40, 38, 36)); ST.body(s, 6.2, 6.2, (96, 84, 66), (48, 44, 40)); ST.body(s, 4.8, 8.2, (84, 96, 108), (48, 46, 42))
    # pole transformers, stood in a line: the grid, come here to die
    for k in range(7): s.prism(5.6 + k * 0.78, 11.2, 0, 0.3, 0.9, 10, C((126, 132, 130)), C((96, 100, 100))); s.prism(5.6 + k * 0.78, 11.2, 0.9, 0.08, 0.3, 6, C((176, 150, 120)), C((176, 150, 120)))
    # white goods down the yard's east side: every kitchen in the valley, in a row
    for k in range(8):
        for q in range(2 if k % 3 else 1):
            c = ((226, 222, 210), (206, 200, 186), (190, 196, 196))[(k + q) % 3]
            s.box((10.7 + 0.04 * q, 3.4 + k * 0.92, q * 0.86), (0.9, 0.8, 0.82), face(c, dk(c)))
    for k in range(3): s.box((-1.3 + k * 1.2, 10.6, 0), (1.0, 0.9, 0.5 + 0.2 * (k % 2)), face((60, 58, 54), (40, 40, 38)))                                    # cable, chopped, in bins
    return s


PLACES = {'clark_station': clark_station, 'the_animal_shelter': the_animal_shelter, 'the_scrap_mill': the_scrap_mill}
SAY = {'clark_station': 'CLARK STATION', 'the_animal_shelter': 'ANIMAL SHELTER', 'the_scrap_mill': 'THE SCRAP MILL'}
LIKE = {'clark_station': 'battery', 'the_animal_shelter': 'warehouse', 'the_scrap_mill': 'industrial'}
_older = SS.moving


def moving(sc, frame):
    """what moves on the beat: the hatch's fire and the stack's black smoke; the intake door's lamp and its bell; the baler's
    lamp and a torch cutting"""
    key = sc['key']
    if key not in PLACES: return _older(sc, frame)
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: PB.proj(sc, p)
    if key == 'clark_station':
        x, y = PJ(STACK_TOP)                                    # tires: the smoke is black, and it leans
        for i in range(5):
            t = i + (0.5 if frame else 0.0); blob(L, x + t * 3.4 + math.sin(t * 1.4) * 1.5, y - t * 3.0 - 1, 3.2 + t * 1.5, (34, 32, 32), 0.8 * max(0.0, 1 - t / 5.6))
        x, y = PJ(HATCH); blob(L, x, y, 2.6, (255, 170, 70), 0.95 if frame else 0.6); blob(L, x, y + 2, 7.0, (255, 130, 50), 0.3 if frame else 0.16)
        x, y = PJ(CTRL); blob(L, x, y, 1.6, (206, 232, 236), 0.2 if frame else 0.8)
    elif key == 'the_animal_shelter':
        x, y = PJ(INTAKE); blob(L, x, y, 2.4, (255, 220, 160), 0.9 if frame else 0.4); blob(L, x, y + 3, 7.0, (255, 200, 130), 0.22 if frame else 0.08)
        x, y = PJ(BELL); blob(L, x + (1 if frame else -1), y, 1.3, (255, 232, 150), 0.95 if frame else 0.25)
    elif key == 'the_scrap_mill':
        x, y = PJ(BALER); blob(L, x, y, 1.8, (255, 190, 90), 0.95 if frame else 0.25)
        x, y = PJ(TORCH); blob(L, x, y, 1.4, (226, 244, 255), 0.25 if frame else 0.98); blob(L, x, y, 4.5, (190, 224, 255), 0.0 if frame else 0.3)
    return L


def bind():
    """this file's three through the places tool's own scenes / render / finish / sheet (the ten older places are not re-made)"""
    PW.PLACES = PLACES; PW.SAY = dict(PW.SAY, **SS.SAY, **SAY); PW.LIKE = dict(PW.LIKE, **SS.LIKE, **LIKE); PW.moving = moving
    PW.OUT = os.path.join(R, 'records/target/cook5_places_east')


def finish():
    PW.finish()
    mp = os.path.join(PW.DEST, 'place_pieces.json'); man = json.load(open(mp))
    for k in PLACES: man['pictures'][k]['finished'] = 'cook 5, 11/18'
    json.dump(man, open(mp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'; bind()
    if cmd == 'scenes': PW.scenes()
    elif cmd == 'render': PW.render()
    elif cmd == 'finish': finish()
    elif cmd == 'sheet': PW.sheet(a[1], 'COOK5_THE_EAST_SIDES_THREE_11_18', ('clark_station', 'the_animal_shelter', 'the_scrap_mill'), 'cook5-the-east-sides-three-11-18')
    else: print(__doc__)
