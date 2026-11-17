#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [downtown's three wear their own piece] (11/17/26; the coordinator's routine 'COOK FIVE full sweep', VAMILY
rules 453, 441, 408, 409(c), 455: 'finished art wherever a VOTE card still says STAND-IN and he meets it first ... keep going
build after build').

Three more of the eighteen real places (records/target/bb/real_places.json) wore the kit art of the kind each is like: THE BANK
and THE MOB MUSEUM a courthouse like any courthouse, the NATURAL HISTORY MUSEUM a library like any library. Each gets its own
piece on the map by the 11/17k pipeline (slices/bohemia_place_pieces.js draws it; NO CODE in this build: three entries in
slices/place_pieces/place_pieces.json and six lossless WebP pictures), made by this lane's places tool, which this one imports.

  THE BANK                    Valley Bank Plaza, 1975: sixteen floors of dark glass in concrete bands, the tallest thing downtown,
                              'a tower of paper nobody wants over the strongest room in town'. The banking hall's glass is out; the
                              money has blown into drifts on the plaza and nobody picks it up. On the fourth floor a stove is fed
                              with hundreds: one window lit, the soot up the face above it. On the beat: the stove, its smoke.
  THE MOB MUSEUM              the 1933 federal courthouse and post office: a stone base, two brick storeys, the broad stair, four
                              columns and a pediment. The family keeps it: two men on the steps, a black car at the kerb. One window
                              is lit, the hearing room ('everybody who testified in there is dead now, so the room is very quiet').
                              On the beat: that window, and a cigarette on the steps.
  THE NATURAL HISTORY MUSEUM  a low tan museum by Cashman Field, its entry hall's glass gone, and in the opening the animatronic
                              T. rex, 'the one thing in this valley that is never coming back'; the keeper of the bones under it.
                              On the beat: 'some nights his motor still roars on the backup battery': his eye, and his head a little
                              lit by it.

  python3 tools/bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26.py render
  python3 tools/bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26.py finish
  python3 tools/bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26.py sheet <shots>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a 1970s bank headquarters tower (a slab
of dark glass ribbons between pale concrete spandrels, a double-height banking hall at its foot, a paved plaza); a 1933 federal
courthouse and post office (a rusticated stone ground floor, brick above, a central stair to an arcade of columns under a
pediment, tall sash windows in ranks); a small-city natural history museum (a low stuccoed block, a taller glazed entry hall, a
full-size animatronic tyrannosaur as its sign). The twins: this lane's bus yard, greenhouses, cooling center and dome (the same
frame, rig and draw), and the kit's courthouse and library blocks beside them on the map (the card shows each before and now).
REUSE CHECK (REUSE-FIRST): this lane's places tool (its capture, render, finish, sheet and colours: imported; this file is three
scenes and three beats), and through it BOSSES' place tools and the map's rig.
ANALOG HORROR: money in drifts on a plaza and one window lit by burning it; one lit room where everybody who spoke is dead; a
machine animal whose eye still comes on.
No reference game.
"""
import os, sys
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_places_wear_their_own_piece_11_17_26 as PW      # this lane's: the pipeline

ST, PB, C, C5 = PW.ST, PW.PB, PW.C, PW.C5
CONC, CONC_DK, ROOF, ROOF_DK, STEEL, FRAME, SOOT, TYRE, LOT = PW.CONC, PW.CONC_DK, PW.ROOF, PW.ROOF_DK, PW.STEEL, PW.FRAME, PW.SOOT, PW.TYRE, PW.LOT
DARK_GLASS = PW.DARK_GLASS
PAVE, PAVE_DK = (150, 146, 136), (118, 114, 106)
SPAN, SPAN_DK = (196, 190, 176), (150, 146, 134)               # the tower's concrete bands
GLASS, GLASS_DK, VOID = (38, 50, 58), (26, 34, 40), (22, 20, 20)
NOTE = (96, 134, 92)                                        # paper money, gone pale
STOVE = (255, 170, 70)
STONE, STONE_DK = (190, 182, 162), (146, 140, 124)
BRICK, BRICK_DK = (150, 88, 66), (112, 64, 50)
SASH = (30, 34, 40)
CARB, CARB_DK = (28, 28, 32), (18, 18, 20)
STUCCO, STUCCO_DK = (198, 176, 138), (154, 134, 104)
HIDE, HIDE_DK, BELLY = (112, 128, 84), (76, 90, 58), (170, 164, 124)
BANK_STOVE = (7.86, 2.9, 3.37)                                # the lit window on the east face, the fourth floor
BANK_SMOKE = (7.9, 2.9, 4.3)
MOB_ROOM = (6.9, 6.06, 3.0)                                   # the hearing room's window
MOB_SMOKE = (3.9, 8.5, 1.5)                                   # the man on the steps, his cigarette
REX_EYE = (6.7, 10.23, 5.27)


def face(c, dk):
    return {'top': C(c), 'px': C(dk), 'py': C(c), 'nx': C(dk), 'ny': C(dk)}


def the_bank(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(31)
    H._ground(s, (-2, -2, 12, 12), groundc=PAVE)
    for k in range(4): s.box((-2 + k * 4.0, -2, 0.0), (0.05, 14, 0.02), C(PAVE_DK)); s.box((-2, -2 + k * 4.0, 0.0), (14, 0.05, 0.02), C(PAVE_DK))     # the plaza's paving
    x0, y0, w, d = 1.2, -0.6, 6.6, 5.4
    s.box((x0 - 0.5, y0 - 0.3, 0), (w + 1.0, d + 0.9, 0.25), face(SPAN, SPAN_DK))                              # the podium
    s.box((x0, y0, 0.25), (w, d, 1.5), face(VOID, VOID))                                                       # the banking hall, its glass out: dark
    for k in range(5): s.box((x0 + 0.1 + k * 1.55, y0 + d - 0.2, 0.25), (0.3, 0.3, 1.5), face(SPAN, SPAN_DK))  # its piers
    for k in range(4): s.box((x0 + w - 0.2, y0 + 0.1 + k * 1.68, 0.25), (0.3, 0.3, 1.5), face(SPAN, SPAN_DK))
    z = 1.75; FL = 0.6
    for f in range(14):                                        # fourteen office floors over the double-height hall (sixteen in all, the real tower's count): a band of concrete, a ribbon of glass
        s.box((x0, y0, z), (w, d, 0.24), face(SPAN, SPAN_DK)); s.box((x0 + 0.06, y0 + 0.06, z + 0.24), (w - 0.12, d - 0.12, 0.36), face(GLASS, GLASS_DK)); z += FL
    s.box((x0, y0, z), (w, d, 0.5), face(SPAN, SPAN_DK)); top = z + 0.5                                        # the parapet
    s.box((x0 + 0.8, y0 + 0.8, top), (2.2, 1.8, 0.7), C(STEEL)); s.box((x0 + 3.6, y0 + 2.0, top), (2.2, 2.4, 0.9), C(CONC_DK))   # the plant on the roof
    s.box((x0 + 1.5, y0 + d + 0.005, top - 0.42), (3.6, 0.03, 0.34), C((70, 74, 78)))                          # where the name was
    for k in range(4): s.box((x0 + 1.7 + k * 0.9, y0 + d + 0.02, top - 0.36), (0.5, 0.02, 0.22), C((96, 100, 104)) if k != 2 else C((70, 74, 78)))
    for (fx, fl) in ((1.6, 6), (4.4, 11), (5.3, 3), (0.8, 13)):  # panes gone, the floor's dark behind them
        s.box((x0 + fx, y0 + d - 0.05, 1.75 + fl * FL + 0.24), (0.9, 0.06, 0.36), C(VOID))
    # the fourth floor: a stove fed with hundreds. One window lit, the soot up the face above it
    zf = 1.75 + 2 * FL + 0.24
    s.box((x0 + w - 0.05, 2.4, zf), (0.06, 1.0, 0.36), C(STOVE))
    for k in range(5): s.box((x0 + w - 0.02, 2.45 + 0.04 * k, zf + 0.36 + k * 0.6), (0.03, 0.9 - 0.12 * k, 0.6), C((60 + 14 * k, 58 + 14 * k, 54 + 13 * k)))
    # the money: blown into drifts against the doors and the kerb, and nobody picks it up
    for _ in range(140):                                       # (230 made the piece heavier than a place's 30,000 bytes: the gate's S4)
        u = rng.rand()
        if u < 0.55: x = x0 + rng.uniform(-0.3, w + 0.3); y = y0 + d + 0.7 + abs(rng.normal(0, 0.55))
        elif u < 0.8: x = x0 + w + 0.7 + abs(rng.normal(0, 0.5)); y = rng.uniform(-1.5, 6.5)
        else: x = rng.uniform(-1.6, 11.4); y = rng.uniform(6.4, 11.4)
        s.box((x, y, 0.02), (0.3, 0.14, 0.03), C(NOTE if rng.rand() < 0.7 else (70, 104, 72)))
    for (x, y) in ((1.4, 6.3), (6.2, 6.4), (9.3, 2.0)):          # and banded bricks of it, dropped
        s.box((x, y, 0.0), (0.5, 0.3, 0.16), C(NOTE)); s.box((x + 0.2, y, 0.0), (0.08, 0.3, 0.17), C((230, 226, 210)))
    s.box((-1.2, 8.2, 0), (0.12, 0.12, 2.3), C(FRAME)); s.box((-1.5, 8.1, 2.3), (0.7, 0.3, 0.7), C((226, 222, 206))); s.box((-1.42, 8.41, 2.4), (0.54, 0.02, 0.5), C((36, 36, 40)))   # the plaza clock, stopped
    s.box((9.6, 8.6, 0), (1.6, 0.7, 0.45), C(STEEL)); s.box((9.7, 8.7, 0.45), (1.4, 0.5, 0.1), C(SOOT))      # a drum cut for a fire, cold
    for (x, y, k) in ((3.0, 7.6, 0), (3.5, 8.3, 1)): ST.body(s, x, y, ((84, 80, 72), (64, 70, 76))[k], (44, 42, 40))   # two who came to look, and laugh
    return s


def the_mob_museum(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PAVE)
    x0, y0, w, d = -1.0, -1.2, 12.0, 7.2
    s.box((x0, y0, 0), (w, d, 1.4), face(STONE, STONE_DK))                                                     # the stone ground floor
    for k in range(6): s.box((x0, y0 + d + 0.002, 0.2 + k * 0.2), (w, 0.01, 0.03), C(STONE_DK))               # its courses
    s.box((x0, y0, 1.4), (w, d, 2.7), face(BRICK, BRICK_DK))                                                   # two storeys of brick
    s.box((x0 - 0.12, y0 - 0.12, 4.1), (w + 0.24, d + 0.24, 0.32), face(STONE, STONE_DK))                      # the cornice
    s.box((x0 + 0.3, y0 + 0.3, 4.42), (w - 0.6, d - 0.6, 0.12), C(ROOF))
    for fl in range(2):                                        # the sash windows in ranks; one lit
        for k in range(9):
            x = x0 + 0.5 + k * 1.3
            if 3 <= k <= 5 and fl == 0: continue                # behind the columns
            lit = (fl == 1 and k == 6)
            s.box((x, y0 + d + 0.005, 1.65 + fl * 1.25), (0.6, 0.03, 0.9), C((255, 214, 150) if lit else SASH)); s.box((x - 0.05, y0 + d + 0.01, 1.6 + fl * 1.25), (0.7, 0.04, 0.06), C(STONE))
        for k in range(5): s.box((x0 + w + 0.005, y0 + 0.6 + k * 1.35, 1.65 + fl * 1.25), (0.03, 0.6, 0.9), C(SASH))
    for k in range(7): s.box((x0 + 0.6 + k * 1.6 + (0.9 if k > 3 else 0), y0 + d + 0.005, 0.45), (0.7, 0.03, 0.7), C(SASH))        # the ground floor's
    # the broad stair, the four columns, the pediment
    for k in range(5): s.box((2.4, y0 + d, 0.28 * k), (5.2, 2.3 - 0.44 * k, 0.28), face(STONE, STONE_DK))
    s.box((2.6, y0 + d - 0.1, 1.4), (4.8, 0.7, 0.05), C(STONE_DK)); s.box((3.9, y0 + d + 0.01, 1.4), (2.2, 0.03, 1.5), C(VOID))   # the porch, the doors open and dark
    for k in range(4): s.prism(2.9 + k * 1.4, y0 + d + 0.45, 1.4, 0.2, 2.5, 10, C(STONE), C(STONE))
    s.box((2.5, y0 + d - 0.05, 3.9), (5.0, 0.75, 0.3), face(STONE, STONE_DK))
    for k in range(4): s.box((2.7 + 0.55 * k, y0 + d + 0.05, 4.2 + 0.22 * k), (4.6 - 1.1 * k, 0.6, 0.22), face(STONE, STONE_DK))   # the pediment, stepped to a point
    # the family keeps it: two men on the steps, a black car at the kerb
    ST.body(s, 3.6, 8.4, (30, 30, 34), (22, 22, 24)); ST.body(s, 6.6, 8.1, (40, 36, 34), (24, 22, 22))
    s.box((7.6, 9.6, 0.22), (3.4, 1.4, 0.55), face(CARB, CARB_DK)); s.box((8.3, 9.7, 0.77), (1.8, 1.2, 0.45), face((44, 50, 58), (30, 34, 40))); s.box((8.2, 9.65, 1.22), (2.0, 1.3, 0.06), C(CARB))
    for xx in (8.0, 10.2): s.box((xx, 11.0, 0), (0.6, 0.12, 0.55), C(TYRE))
    s.box((7.6, 10.98, 0.5), (0.1, 0.04, 0.16), C((240, 236, 210))); s.box((10.9, 10.98, 0.5), (0.1, 0.04, 0.16), C((170, 40, 36)))
    for k in range(3): s.box((-1.4 + k * 0.55, 8.9, 0), (0.4, 0.4, 0.5), C(STEEL))                           # the ropes' posts, from when it sold tickets
    return s


def rex(s, x, y, k=1.15):
    """the animatronic T. rex as the old museums stood him: upright, his tail down to the floor, side-on to the map's eye (his
    length along x, his head high to the east): boxes, a dozen of them, k times life"""
    hide = face(HIDE, HIDE_DK)
    B = lambda dx, dy, z, sx, sy, sz, m=hide: s.box((x + dx * k, y + dy * k, z * k), (sx * k, sy * k, sz * k), m)
    B(-1.9, -0.4, 1.4, 1.0, 0.8, 0.65); B(-2.8, -0.3, 0.8, 1.0, 0.6, 0.55); B(-3.7, -0.2, 0.2, 1.0, 0.4, 0.45)      # the tail, stepping down
    B(-1.0, -0.6, 1.9, 1.4, 1.2, 1.3); B(0.2, -0.55, 2.4, 0.9, 1.1, 1.3)                                            # the hips, the chest
    B(-0.8, 0.6, 1.9, 1.2, 0.02, 0.5, C(BELLY)); B(0.3, 0.55, 2.4, 0.7, 0.02, 0.6, C(BELLY))                        # the belly
    for dy in (-0.62, 0.34): B(-0.5, dy, 0.0, 0.6, 0.3, 2.0); B(-0.5, dy - 0.03, 0.0, 1.1, 0.36, 0.18, C(HIDE_DK))  # the legs, the feet
    B(0.7, -0.4, 3.5, 0.7, 0.8, 0.8)                                                                                # the neck
    B(0.9, -0.45, 4.1, 1.7, 0.9, 0.75); B(1.2, -0.38, 3.78, 1.3, 0.76, 0.2, C(HIDE_DK))                             # the head, the jaw hung open
    for t in range(6): B(1.3 + t * 0.2, 0.4, 3.98, 0.09, 0.04, 0.13, C((236, 230, 206)))                            # teeth
    B(1.05, 0.55, 2.9, 0.55, 0.1, 0.12); B(1.5, 0.55, 2.72, 0.1, 0.1, 0.2)                                          # the small arm
    B(1.9, 0.452, 4.5, 0.2, 0.02, 0.16, C((40, 30, 24)))                                                            # the eye, dark (the beat lights it)


def the_natural_history_museum(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=LOT)
    s.box((-1.4, -1.4, 0), (12.8, 6.4, 2.6), face(STUCCO, STUCCO_DK)); s.box((-1.5, -1.5, 2.6), (13.0, 6.6, 0.18), face((170, 150, 118), (132, 116, 90)))      # the low block, its parapet
    s.box((-1.0, -1.0, 2.78), (12.0, 5.6, 0.06), C(ROOF))
    for k in range(4): s.box((-0.9 + k * 1.05, 5.005, 1.0), (0.7, 0.03, 0.9), C(SASH)); s.box((8.7 + k * 0.72, 5.005, 1.0), (0.5, 0.03, 0.9), C(SASH))
    for k in range(4): s.box((11.405, -0.8 + k * 1.5, 1.0), (0.03, 0.8, 0.9), C(SASH))
    # the entry hall: taller, its glass gone, dark inside
    s.box((3.4, 3.2, 0), (5.2, 4.2, 4.3), face(STUCCO, STUCCO_DK)); s.box((3.3, 3.1, 4.3), (5.4, 4.4, 0.2), face((170, 150, 118), (132, 116, 90)))
    s.box((3.9, 7.39, 0), (4.2, 0.03, 3.6), C(VOID)); s.box((8.59, 3.8, 0.3), (0.03, 2.6, 3.0), C(GLASS))
    for k in range(4): s.box((3.9 + k * 1.37, 7.4, 0), (0.1, 0.06, 3.6), C(FRAME))                             # the frames the glass hung in
    s.box((3.9, 7.4, 3.6), (4.2, 0.06, 0.1), C(FRAME))
    s.box((4.2, 7.42, 3.75), (3.6, 0.03, 0.42), C((226, 220, 200)))                                            # the sign board, its letters
    for k in range(7): s.box((4.4 + k * 0.48, 7.44, 3.82), (0.3, 0.02, 0.28), C((60, 56, 50)) if k not in (2, 5) else C((226, 220, 200)))
    rex(s, 4.4, 9.7)                                           # out on the forecourt on his plinth, side-on, clear of the hall's dark, where the map can see him
    ST.body(s, 5.6, 11.1, (72, 66, 58), (40, 38, 36))                              # the keeper of the bones, under him
    s.box((-0.2, 8.7, 0), (8.2, 2.0, 0.14), C((120, 112, 96)))                                                  # his plinth
    for (x, y) in ((9.6, 7.0), (10.3, 7.4), (9.7, 8.0)): s.box((x, y, 0), (0.7, 0.5, 0.5), face((138, 108, 70), (100, 78, 50)))   # crates the lab's people left
    s.box((0.4, 6.6, 0), (0.1, 0.1, 1.6), C(FRAME)); s.box((0.2, 6.65, 1.0), (1.5, 0.04, 0.6), C((226, 220, 200))); s.box((0.3, 6.7, 1.1), (0.5, 0.02, 0.4), C((60, 56, 50)))   # a board: what is inside
    for k in range(3): s.box((9.8 + k * 0.5, 9.4 + 0.3 * k, 0), (0.3, 0.3, 0.45), C(STEEL))
    return s


PLACES = {'the_bank': the_bank, 'the_mob_museum': the_mob_museum, 'the_natural_history_museum': the_natural_history_museum}
SAY = {'the_bank': 'THE BANK', 'the_mob_museum': 'THE MOB MUSEUM', 'the_natural_history_museum': 'NATURAL HISTORY MUSEUM'}
LIKE = {'the_bank': 'courthouse', 'the_mob_museum': 'courthouse', 'the_natural_history_museum': 'library'}
_older = PW.moving


def moving(sc, frame):
    """what moves on the beat: the stove fed with hundreds and its smoke; the hearing room's lamp and a cigarette on the steps; the rex's eye"""
    key = sc['key']
    if key not in PLACES: return _older(sc, frame)
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: PB.proj(sc, p)
    if key == 'the_bank':
        x, y = PJ(BANK_STOVE); blob(L, x, y, 3.2, (255, 190, 90), 0.95 if frame else 0.55); blob(L, x, y, 8.0, (255, 150, 60), 0.26 if frame else 0.14)
        x, y = PJ(BANK_SMOKE); blob(L, x + (3 if frame else 0), y - (7 if frame else 2), 5.0, (92, 88, 84), 0.5); blob(L, x + (7 if frame else 2), y - (15 if frame else 8), 6.5, (104, 100, 96), 0.28)
    elif key == 'the_mob_museum':
        x, y = PJ(MOB_ROOM); blob(L, x, y, 3.0, (255, 220, 160), 0.8 if frame else 0.5); blob(L, x, y, 7.0, (255, 200, 130), 0.2 if frame else 0.1)
        x, y = PJ(MOB_SMOKE); blob(L, x, y, 1.3, (255, 120, 50), 0.95 if frame else 0.2)
    elif key == 'the_natural_history_museum':
        x, y = PJ(REX_EYE); blob(L, x, y, 1.6, (255, 90, 40), 0.98 if frame else 0.12); blob(L, x, y, 6.5, (255, 110, 60), 0.3 if frame else 0.0)
    return L


def bind():
    """this file's three through the places tool's own scenes / render / finish / sheet (the four older places are not re-made)"""
    PW.PLACES = PLACES; PW.SAY = dict(PW.SAY, **SAY); PW.LIKE = dict(PW.LIKE, **LIKE); PW.moving = moving
    PW.OUT = os.path.join(R, 'records/target/cook5_places_downtown')


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'; bind()
    if cmd == 'scenes': PW.scenes()
    elif cmd == 'render': PW.render()
    elif cmd == 'finish': PW.finish()
    elif cmd == 'sheet': PW.sheet(a[1], 'COOK5_DOWNTOWNS_THREE_11_17', ('the_bank', 'the_mob_museum', 'the_natural_history_museum'), 'cook5-downtowns-three-11-17')
    else: print(__doc__)
