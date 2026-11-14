#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [ten to twelve: their places, what their verbs leave, and what each one does to the map] (11/14/26, the coordinator's
round 'BOSSES turn up', rules 337, 441, 447).

THE PLATE, THE TOOTH, THE LENS, painted exactly the way seven to nine were: the seven-to-nine places tool
(tools/bohemia_bosses_seven_to_nine_places_11_11_26.py) is imported and never edited; its scenes, render and finish run here with this
file's places, props, pieces and folder put in its globals.

  THE PRESS       a scrap yard with the last press brake under a steel roof, a heap of scrap. BEFORE: his plates stacked behind a wire
                  fence, the press dark, his chain on the gate. AFTER: the press running (a plate under its blade), the fence open.
  THE CHAIR       a dental office in a dead strip mall, a tooth sign over the door. BEFORE: the blinds down, a line of chairs outside
                  for the ones waiting. AFTER: the door open, the chair inside lit, a bucket of pulled teeth out front.
  THE OPTICIAN    a glasses shop, a big eye on its sign. BEFORE: the windows sprayed over, THE LENS SEES YOU across the glass. AFTER: the
                  spray scraped off, lenses on a rack out front.
  and what each verb leaves: A PRESSED PLATE on a block, A PAIR OF FORCEPS ON A TRAY, A SPYGLASS ON ITS TRIPOD.
  and the piece each one leaves on a street block (THE NEXT THREE's frame):
  WAGON      THE PLATE's armoured scrap wagon. BEFORE: a cart plated in pressed steel, a slit to see out, rolling. AFTER: stripped,
             parked, its plates off and stacked beside it.
  COLLECTOR  THE TOOTH's collector at a town's gate. BEFORE: his man with a cash box on a stool and a tooth sprayed on the wall. AFTER: the
             stool kicked over, the box open and empty.
  HAZE       THE LENS's mark on his side: BEFORE: an eye chart on a board, sprayed over, smoke pots smouldering. AFTER: the chart clean.

  python3 tools/bohemia_bosses_ten_to_twelve_places_11_14_26.py scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish

REFERENCE CHECK (the 9/4 standing duty): the twins are the first nine places and pieces (records/target/bosses_ten_to_twelve/compare.png);
the real things: a hydraulic press brake, a scrap metal yard; a strip-mall dental office, its tooth sign; an optician's with its eye sign,
a Snellen chart; an armoured cart (the 2020s' up-armoured trucks), a cash box. No reference game.
REUSE CHECK (REUSE-FIRST): the seven-to-nine places tool and through it THE NEXT THREE's frame, BOSSES 4's places frame, COOK's map rig.
ANALOG HORROR: a press behind a chained gate, a line of chairs outside a dentist's, an eye sprayed over a window; a steel cart with a slit.
"""
import os, sys, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_seven_to_nine_places_11_11_26 as Q

PB, HF, win = Q.PB, Q.HF, Q.win
STEEL, STEEL_DK, CONC, CONC_DK, ROOF, ROOF_DK, BRICK, BRICK_DK, RUST, RUST_DK = Q.STEEL, Q.STEEL_DK, Q.CONC, Q.CONC_DK, Q.ROOF, Q.ROOF_DK, Q.BRICK, Q.BRICK_DK, Q.RUST, Q.RUST_DK
PLATE, PLATE_DK = (142, 140, 132), (98, 96, 92)
FENCE, CHAIN, GRAVEL, BENCH = Q.FENCE, Q.CHAIN, Q.GRAVEL, Q.BENCH
TOOTH, TOOTH_DK = (214, 206, 186), (170, 160, 136)
SPRAY = (180, 40, 36)
CHAIR, CHAIR_DK = (70, 110, 120), (48, 76, 84)
GLASS = (120, 150, 160)
CHART = (214, 210, 196)
SMOKE = (60, 58, 56)
WOOD, WOOD_DK = (120, 88, 56), (86, 62, 40)
CASH = (52, 66, 54)


def press(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 13), groundc=GRAVEL)
    for x in (0.0, 7.0):
        for y in (0.0, 5.0): s.box((x, y, 0), (0.25, 0.25, 4.0), {'c': STEEL_DK})
    s.box((-0.2, -0.2, 4.0), (7.6, 5.6, 0.3), {'c': ROOF_DK})                                         # the steel roof on four posts
    s.box((2.4, 1.6, 0), (3.0, 1.4, 2.6), {'top': {'c': STEEL}, 'px': {'c': STEEL}, 'py': {'c': STEEL_DK}, 'nx': {'c': STEEL_DK}, 'ny': {'c': STEEL}})   # the press brake
    s.box((2.6, 2.7, 1.2), (2.6, 0.5, 0.12), {'c': PLATE})                                           # its bed
    s.prism(10.0, 2.0, 0, 2.0, 1.4, 14, {'c': RUST}, {'c': RUST_DK})                                 # a heap of scrap
    if not after:
        for k in range(6): s.box((8.4, 6.0 + k * 0.05, k * 0.14), (2.2, 1.6, 0.12), {'c': PLATE if k % 2 else PLATE_DK})   # his plates, stacked
        for x0 in (-0.5, 4.0): s.box((x0, 9.0, 0), (3.6, 0.12, 2.0), {'c': FENCE})                      # the wire fence, front, shut
        s.box((3.0, 9.0, 0), (1.2, 0.12, 2.0), {'c': FENCE})
        for k in range(5): s.box((3.0 + k * 0.28, 8.92, 1.0 + 0.1 * (k % 2)), (0.24, 0.24, 0.08), {'c': CHAIN})
    else:
        s.box((2.6, 2.7, 1.32), (2.6, 0.5, 0.06), {'c': PLATE})                                       # a plate under the blade
        s.box((-0.5, 9.0, 0), (3.6, 0.12, 2.0), {'c': FENCE}); s.box((7.6, 9.0, 0), (0.12, 2.6, 2.0), {'c': FENCE})   # the gate swung open
        s.box((8.4, 6.0, 0), (2.2, 1.6, 0.12), {'c': PLATE})
    return s


def chair(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (8.0, 6.0, 3.8), {'top': {'c': ROOF}, 'px': win(BRICK, 2, 1, after, 51), 'py': win(BRICK_DK, 3, 1, after, 52), 'nx': {'c': BRICK_DK}, 'ny': {'c': BRICK}})
    s.box((-0.05, -0.05, 3.7), (8.1, 6.1, 0.4), {'c': CONC_DK})
    H._door_face(s, (0, 0, 0), (8.0, 6.0, 3.8), width=1.4, ztop=2.4)
    s.box((5.2, 6.0, 2.6), (0.12, 1.0, 0.12), {'c': STEEL_DK})                                       # the sign's bracket
    s.box((5.15, 6.7, 1.6), (0.2, 0.8, 0.9), {'c': TOOTH})                                           # the tooth sign
    s.box((5.15, 6.7, 1.3), (0.2, 0.25, 0.35), {'c': TOOTH_DK}); s.box((5.15, 7.25, 1.3), (0.2, 0.25, 0.35), {'c': TOOTH_DK})   # its two roots
    if not after:
        for k in range(5): s.box((0.6 + k * 0.9, 7.0, 0), (0.6, 0.6, 0.9), {'c': CHAIR_DK})           # the line of chairs for the ones waiting
        s.box((0.4, 6.02, 0.9), (7.2, 0.06, 1.6), {'c': (90, 86, 80)})                              # the blinds down
    else:
        s.box((2.6, 6.4, 0), (1.2, 2.0, 0.9), {'c': CHAIR}); s.box((2.6, 6.4, 0.9), (1.2, 0.4, 1.2), {'c': CHAIR})   # the chair, out front
        s.prism(5.0, 8.0, 0, 0.36, 0.6, 12, {'c': STEEL}, {'c': STEEL_DK}, inner=0.3)              # a bucket of pulled teeth
        s.prism(5.0, 8.0, 0.5, 0.3, 0.06, 12, {'c': TOOTH}, {'c': TOOTH})
    return s


def optician(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (7.5, 6.0, 4.0), {'top': {'c': ROOF}, 'px': {'c': CONC}, 'py': {'c': CONC_DK}, 'nx': {'c': CONC_DK}, 'ny': {'c': CONC}})
    H._door_face(s, (0, 0, 0), (7.5, 6.0, 4.0), width=1.2, ztop=2.4)
    s.box((0.4, 6.02, 0.8), (2.6, 0.06, 1.8), {'c': SPRAY if not after else GLASS}); s.box((4.4, 6.02, 0.8), (2.6, 0.06, 1.8), {'c': SPRAY if not after else GLASS})   # the windows
    s.prism(3.75, 6.3, 4.0, 1.0, 0.25, 18, {'c': CHART}, {'c': CHART})                                # the big eye on the roof sign
    s.prism(3.75, 6.3, 4.25, 0.45, 0.05, 14, {'c': (40, 60, 80)}, {'c': (40, 60, 80)})
    if after:
        s.box((1.0, 7.4, 0), (0.12, 0.12, 1.8), {'c': WOOD}); s.box((3.2, 7.4, 0), (0.12, 0.12, 1.8), {'c': WOOD})
        s.box((0.9, 7.5, 1.0), (2.5, 0.1, 0.9), {'c': WOOD_DK})                                      # the rack of lenses out front
        for i in range(6): s.prism(1.2 + i * 0.4, 7.45, 1.4, 0.13, 0.04, 10, {'c': GLASS}, {'c': GLASS})
    return s


def pressplate(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-0.4, -0.3, 0), (0.8, 0.6, 0.5), {'c': STEEL_DK})                                          # an anvil block
    s.box((-0.6, -0.4, 0.5), (1.2, 0.8, 0.08), {'c': PLATE})                                           # a pressed plate on it
    return s


def pulled(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-0.6, -0.4, 0), (1.2, 0.8, 0.06), {'c': STEEL})                                             # a steel tray
    s.box((-0.4, -0.1, 0.06), (0.8, 0.08, 0.06), {'c': STEEL_DK}); s.box((-0.4, 0.05, 0.06), (0.8, 0.08, 0.06), {'c': STEEL_DK})   # the forceps
    s.box((0.3, -0.25, 0.06), (0.12, 0.12, 0.16), {'c': TOOTH})                                        # a tooth
    return s


def spyglass(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    for (a, b) in [(-0.6, -0.5), (0.6, -0.5), (0.0, 0.7)]:
        for k in range(7):
            t = k / 7.0; s.box((a * (1 - t) - 0.05, b * (1 - t) - 0.05, 1.3 * t), (0.1, 0.1, 0.2), {'c': WOOD})
    s.box((-0.7, -0.08, 1.35), (1.4, 0.16, 0.16), {'c': (40, 40, 42)})                                 # the glass on top
    s.box((0.7, -0.09, 1.34), (0.06, 0.18, 0.18), {'c': GLASS})
    return s


def wagon(state):
    from bohemia_iso3d import Scene
    s = Scene()
    if state == 'before':
        s.box((2.6, 3.6, 0.5), (4.8, 2.6, 1.9), {'top': {'c': PLATE}, 'px': {'c': PLATE}, 'py': {'c': PLATE_DK}, 'nx': {'c': PLATE_DK}, 'ny': {'c': PLATE}})   # the plated box
        s.box((2.6, 3.58, 1.8), (4.8, 0.04, 0.16), {'c': (20, 20, 20)})                                # a slit to see out
        for x in (3.2, 6.6):
            for y in (3.5, 6.2): s.prism(x, y, 0, 0.5, 0.3, 10, {'c': (34, 34, 34)}, {'c': (34, 34, 34)})   # its wheels
        for k in range(6): s.box((2.9 + k * 0.8, 3.56, 0.7), (0.08, 0.04, 1.3), {'c': PLATE_DK})          # the plates' seams
    else:
        s.box((2.6, 3.6, 0.5), (4.8, 2.6, 0.3), {'c': WOOD})                                           # the bed, stripped
        for x in (3.2, 6.6):
            for y in (3.5, 6.2): s.prism(x, y, 0, 0.5, 0.3, 10, {'c': (34, 34, 34)}, {'c': (34, 34, 34)})
        for k in range(4): s.box((1.0, 7.0, k * 0.12), (1.8, 1.4, 0.1), {'c': PLATE if k % 2 else PLATE_DK})   # the plates off, stacked
    return s


def collector(state):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((1.0, 7.0, 0), (8.0, 0.4, 2.6), {'c': CONC})                                                 # a stretch of the town's wall
    s.box((3.0, 6.98, 1.0), (0.9, 0.04, 1.0), {'c': SPRAY}); s.box((3.1, 6.98, 0.6), (0.25, 0.04, 0.4), {'c': SPRAY}); s.box((3.55, 6.98, 0.6), (0.25, 0.04, 0.4), {'c': SPRAY})   # his tooth, sprayed
    if state == 'before':
        Q.body(s, 5.0, 8.4, (60, 56, 50), (40, 38, 34))                                                 # his man, in front of the wall
        s.box((6.2, 8.4, 0), (0.6, 0.6, 0.7), {'c': WOOD_DK})                                           # his stool
        s.box((6.1, 8.3, 0.7), (0.8, 0.6, 0.4), {'c': CASH})                                            # the cash box
    else:
        s.box((6.0, 8.4, 0), (0.7, 0.6, 0.3), {'c': WOOD_DK})                                           # the stool, kicked over
        s.box((4.6, 8.6, 0), (0.8, 0.6, 0.3), {'c': CASH}); s.box((4.6, 8.58, 0.3), (0.8, 0.06, 0.5), {'c': CASH})   # the box open, empty
    return s


def haze(state):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((3.8, 5.0, 0), (0.15, 0.15, 2.4), {'c': WOOD}); s.box((5.8, 5.0, 0), (0.15, 0.15, 2.4), {'c': WOOD})
    s.box((3.7, 5.1, 1.0), (2.4, 0.1, 1.8), {'c': CHART})                                              # the eye chart
    for k, w in enumerate((1.0, 0.8, 0.6, 0.45, 0.3)): s.box((4.9 - w / 2, 5.0, 2.5 - k * 0.3), (w, 0.04, 0.12), {'c': (40, 40, 40)})   # its letters
    if state == 'before':
        s.box((3.8, 4.96, 1.4), (2.2, 0.04, 0.4), {'c': SPRAY})                                         # sprayed over
        for (x, y) in ((2.0, 3.0), (7.4, 3.6), (2.6, 7.2)): s.prism(x, y, 0, 0.3, 0.5, 10, {'c': RUST_DK}, {'c': SMOKE})   # smoke pots
    return s


PLACES = {'press': press, 'chair': chair, 'optician': optician}
PROPS = {'pressplate': pressplate, 'pulled': pulled, 'spyglass': spyglass}
PIECES = [('wagon', wagon, ('before', 'after')), ('collector', collector, ('before', 'after')), ('haze', haze, ('before', 'after'))]


def moving(sc, frame):
    """the smoke pots smoulder and the press's blade comes down on the beat; else the seven-to-nine tool's own"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    key = sc['key']; PJ = (lambda p: Q.NT.P(sc, p)) if sc.get('piece') else (lambda p: PB.proj(sc, p))
    if key == 'haze_before':
        for (x, y) in ((2.0, 3.0), (7.4, 3.6), (2.6, 7.2)):
            a, b = PJ((x, y, 0.9)); PB.blob(L, a + (1 if frame else -1), b - (3 if frame else 1), 5.0, (150, 146, 140), 0.5)
    elif key == 'press_after':
        a, b = PJ((3.9, 2.9, 1.5)); PB.blob(L, a, b, 3.0, (255, 220, 160), 0.8 if frame else 0.2)
    elif key == 'chair_after':
        a, b = PJ((4.0, 6.2, 1.6)); PB.blob(L, a, b, 10, (255, 230, 190), 0.24 if frame else 0.18)
    return L


Q.OUT = os.path.join(R, 'records/target/bosses_ten_to_twelve')
Q.PLACES, Q.PROPS, Q.PIECES, Q.moving = PLACES, PROPS, PIECES, moving
Q.P4.PLACES.update(PLACES); Q.P4.PROPS.update(PROPS)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): Q.scenes()
    if cmd in ('render', 'all'): Q.render()
    if cmd in ('finish', 'all'): Q.finish()
