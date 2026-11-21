#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [the nineteenth: THE MIDWIFE, her house, her cradles, what her verb leaves] (11/21/26, the coordinator's routine
'BOSSES: the Midwife is yours', rules 441, 461, 454(a)).

THE MIDWIFE is met, never fought (WORLD TWO's boss_map row 19, 'how': 'meet'). Painted exactly the way sixteen to eighteen were: the
seven-to-nine places tool (tools/bohemia_bosses_seven_to_nine_places_11_11_26.py) imported and never edited.

  THE BIRTH HOUSE  a low stucco house with a porch light and a white sheet on the line. BEFORE: the curtains drawn, one lamp in the
                   back room, a basin and towels on the step. AFTER: the door open and lit, a cradle on the porch, the sheet dry.
  and what her verb leaves: A CRADLE ON A STEP (DELIVER).
  and the piece on a street block where a birth is coming:
  CRADLES  BEFORE: a dark house front, one candle in the window, a pail by the door. AFTER: the window warm, a cradle by the door.

  python3 tools/bohemia_bosses_the_midwife_places_11_21_26.py scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish

REFERENCE CHECK (the 9/4 standing duty): the twins are the eighteen places; the real things: a home birth's porch light, towels and
a basin, a wooden cradle, a candle in a window. No reference game.
REUSE CHECK (REUSE-FIRST): the seven-to-nine places tool and through it THE NEXT THREE's frame, BOSSES 4's places frame, COOK's map rig.
ANALOG HORROR: one candle in a dark window and a pail of water by the door; then a warm window and a cradle on the step.
"""
import os, sys
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_seven_to_nine_places_11_11_26 as Q

PB, HF, win = Q.PB, Q.HF, Q.win
CONC, CONC_DK, ROOF, STEEL_DK = Q.CONC, Q.CONC_DK, Q.ROOF, Q.STEEL_DK
STUCCO, STUCCO_DK = (196, 178, 150), (150, 134, 110)
SHEET, TOWEL, BASIN, WOOD, WOOD_DK, CURTAIN = (222, 218, 206), (196, 186, 170), (150, 152, 150), (138, 104, 68), (96, 70, 44), (120, 60, 52)
DARK, PAIL = (30, 28, 26), (120, 124, 126)


def cradle_at(s, x, y, k=1.0):
    """a wooden cradle on two rockers"""
    s.box((x, y, 0.10 * k), (0.9 * k, 0.5 * k, 0.35 * k), {'top': {'c': SHEET}, 'px': {'c': WOOD}, 'py': {'c': WOOD_DK}, 'nx': {'c': WOOD_DK}, 'ny': {'c': WOOD}})
    s.box((x - 0.05 * k, y + 0.05 * k, 0), (1.0 * k, 0.08 * k, 0.12 * k), {'c': WOOD_DK}); s.box((x - 0.05 * k, y + 0.37 * k, 0), (1.0 * k, 0.08 * k, 0.12 * k), {'c': WOOD_DK})


def birthhouse(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (7.0, 6.0, 3.0), {'top': {'c': ROOF}, 'px': win(STUCCO, 2, 1, after, 91), 'py': win(STUCCO_DK, 2, 1, after, 92), 'nx': {'c': STUCCO_DK}, 'ny': {'c': STUCCO}})
    H._door_face(s, (0, 0, 0), (7.0, 6.0, 3.0), width=1.1, ztop=2.3)
    s.box((-0.2, 6.0, 2.6), (7.4, 1.6, 0.15), {'c': CONC_DK})                                           # the porch roof
    s.box((0.0, 7.4, 0), (0.12, 0.12, 2.6), {'c': WOOD_DK}); s.box((6.9, 7.4, 0), (0.12, 0.12, 2.6), {'c': WOOD_DK})
    s.box((8.0, 2.0, 0), (0.08, 0.08, 1.8), {'c': STEEL_DK}); s.box((8.0, 6.0, 0), (0.08, 0.08, 1.8), {'c': STEEL_DK})   # the line
    s.box((8.0, 3.0, 0.9), (0.04, 1.6, 0.9), {'c': SHEET})                                              # a sheet on it
    if not after:
        for x0 in (3.6, 5.2): s.box((x0, 6.03, 0.9), (1.1, 0.05, 1.3), {'c': CURTAIN})                  # the curtains drawn
        s.prism(2.2, 7.0, 0, 0.35, 0.25, 12, {'c': BASIN}, {'c': (90, 110, 120)})                       # a basin and towels on the step
        s.box((2.7, 6.7, 0), (0.6, 0.5, 0.25), {'c': TOWEL})
    else:
        cradle_at(s, 3.4, 6.8)                                                                           # a cradle on the porch
    return s


def cradle(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-0.8, -0.4, 0), (1.6, 0.8, 0.12), {'c': CONC})                                                # a step
    cradle_at(s, -0.45, -0.25, 0.9)
    return s


def cradles(state):
    """a house front facing the street (the camera sees the +x and +y faces), a birth coming behind it"""
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((1.0, 3.2, 0), (7.0, 0.6, 2.8), {'top': {'c': ROOF}, 'px': {'c': STUCCO}, 'py': {'c': STUCCO}, 'nx': {'c': STUCCO_DK}, 'ny': {'c': STUCCO_DK}})   # a house front
    s.box((2.0, 3.82, 0), (1.0, 0.06, 2.0), {'c': DARK})                                                 # its door, on the street side
    s.box((4.4, 3.82, 1.0), (1.6, 0.06, 1.0), {'c': DARK if state == 'before' else (230, 196, 130)})     # the window: dark, or warm
    if state == 'before':
        s.prism(5.2, 3.95, 1.0, 0.07, 0.28, 8, {'c': SHEET}, {'c': (255, 220, 140)})                     # one candle in it
        s.prism(3.5, 4.5, 0, 0.28, 0.5, 12, {'c': PAIL}, {'c': (80, 100, 110)})                          # a pail by the door
    else:
        cradle_at(s, 3.2, 4.3)                                                                           # a cradle by the door
    return s


PLACES = {'birthhouse': birthhouse}
PROPS = {'cradle': cradle}
PIECES = [('cradles', cradles, ('before', 'after'))]


def moving(sc, frame):
    """the one candle flickers; the house's light after"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    key = sc['key']; PJ = (lambda p: Q.NT.P(sc, p)) if sc.get('piece') else (lambda p: PB.proj(sc, p))
    if key == 'cradles_before':
        a, b = PJ((5.2, 3.95, 1.3)); PB.blob(L, a + (1 if frame else 0), b, 2.2, (255, 210, 130), 0.75 if frame else 0.45)
    elif key == 'birthhouse_before':
        a, b = PJ((4.2, 6.1, 1.5)); PB.blob(L, a, b, 4, (255, 200, 120), 0.25 if frame else 0.12)
    elif key == 'birthhouse_after':
        a, b = PJ((3.0, 6.4, 1.4)); PB.blob(L, a, b, 12, (255, 226, 170), 0.26 if frame else 0.2)
    return L


Q.OUT = os.path.join(R, 'records/target/bosses_the_midwife')
Q.PLACES, Q.PROPS, Q.PIECES, Q.moving = PLACES, PROPS, PIECES, moving
Q.P4.PLACES.update(PLACES); Q.P4.PROPS.update(PROPS)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): Q.scenes()
    if cmd in ('render', 'all'): Q.render()
    if cmd in ('finish', 'all'): Q.finish()
