#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [thirteen to fifteen: their places, what their verbs leave, and what each one does to the map] (11/17/26, the
coordinator's round 'BOSSES full sweep', rules 441, 453, 454(a): made with what they do, not with talk).

THE BARBER, THE INK, THE DOGS, painted exactly the way ten to twelve were: the seven-to-nine places tool
(tools/bohemia_bosses_seven_to_nine_places_11_11_26.py) is imported and never edited; its scenes, render and finish run here with this
file's places, props, pieces and folder put in its globals.

  THE BARBERSHOP  a narrow storefront, a barber pole by the door. BEFORE: the blinds down, a chain on the door, his bleach jugs stacked
                  out front. AFTER: the door open, the chair out front under the lamp, the pole turning.
  THE PARLOR      a tattoo parlor in a low block. BEFORE: every wall black with his tags, the window painted out. AFTER: the tags painted
                  over grey, the door open, the chair and its lamp inside the window.
  THE KENNEL      chain-link runs behind a block wall, dog houses in them. BEFORE: his dogs in the runs, the gate chained. AFTER: the
                  runs open and empty, the bowls out.
  and what each verb leaves: A BARBER POLE ON ITS STAND (FADE), THE COMPANY'S MARK ON A WALL (MARK), PAW PRINTS TO A STAKE (TRACK).
  and the piece each one leaves on a street block:
  RAZORLINE  THE BARBER's line across a street. BEFORE: his red and white stripe painted across the asphalt, his razor man on it. AFTER:
             the stripe painted over grey, nobody on it.
  INKTAG     THE INK's tags on a wall. BEFORE: a wall black with his tags, ink running down. AFTER: the tags painted over grey.
  PACK       THE DOGS' pack on a block. BEFORE: three dogs, heads down. AFTER: a stake and a broken chain.

  python3 tools/bohemia_bosses_thirteen_to_fifteen_places_11_17_26.py scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish

REFERENCE CHECK (the 9/4 standing duty): the twins are the first twelve places and pieces; the real things: a strip-front barbershop and
its pole, gallon bleach jugs; a tattoo parlor's painted-out window; a kennel's chain-link runs and plastic dog houses; a painted stop line
across a street. No reference game.
REUSE CHECK (REUSE-FIRST): the seven-to-nine places tool and through it THE NEXT THREE's frame, BOSSES 4's places frame, COOK's map rig.
ANALOG HORROR: a barber pole turning in front of a chained door; a wall of one man's tags; dogs in the runs with their heads down.
"""
import os, sys, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_seven_to_nine_places_11_11_26 as Q

PB, HF, win = Q.PB, Q.HF, Q.win
STEEL, STEEL_DK, CONC, CONC_DK, ROOF, ROOF_DK, BRICK, BRICK_DK, RUST, RUST_DK = Q.STEEL, Q.STEEL_DK, Q.CONC, Q.CONC_DK, Q.ROOF, Q.ROOF_DK, Q.BRICK, Q.BRICK_DK, Q.RUST, Q.RUST_DK
FENCE, CHAIN, GRAVEL = Q.FENCE, Q.CHAIN, Q.GRAVEL
POLE_R, POLE_W, POLE_B = (170, 40, 36), (226, 222, 210), (52, 76, 130)
JUG, JUG_CAP = (226, 224, 214), (52, 96, 150)
CHAIR, CHAIR_DK = (150, 40, 34), (96, 30, 26)
INK, INK_DK, GREY = (30, 32, 36), (16, 16, 18), (118, 116, 110)
LAMP = (210, 196, 150)
FUR, FUR_DK = (112, 82, 54), (66, 48, 32)
HOUSE, HOUSE_DK = (150, 120, 70), (104, 82, 48)
WHITE = (220, 216, 204)
ASPHALT = (58, 58, 60)


def pole(s, x, y, z0=0.0, h=1.8):
    """a barber pole: a white cap, a column of red, white and blue rings, a cap again"""
    s.prism(x, y, z0, 0.22, 0.12, 12, {'c': STEEL}, {'c': STEEL_DK})
    for k in range(int(h / 0.15)):
        c = (POLE_R, POLE_W, POLE_B, POLE_W)[k % 4]
        s.prism(x, y, z0 + 0.12 + k * 0.15, 0.16, 0.15, 12, {'c': c}, {'c': c})
    s.prism(x, y, z0 + 0.12 + h, 0.22, 0.14, 12, {'c': STEEL}, {'c': STEEL_DK})


def dog(s, x, y, c=FUR, cd=FUR_DK, head_down=True, k=1.0):
    """a dog, side-on along x, k times a big dog's size: its body, four legs, a head down at the ground (or up)"""
    for dx in (0.1, 0.9):
        for dy in (0.05, 0.35): s.box((x + dx * k, y + dy * k, 0), (0.12 * k, 0.12 * k, 0.45 * k), {'c': cd})
    s.box((x, y, 0.42 * k), (1.1 * k, 0.5 * k, 0.42 * k), {'top': {'c': c}, 'px': {'c': c}, 'py': {'c': cd}, 'nx': {'c': cd}, 'ny': {'c': c}})
    if head_down: s.box((x + 1.0 * k, y + 0.08 * k, 0.18 * k), (0.45 * k, 0.34 * k, 0.36 * k), {'c': cd})
    else: s.box((x + 1.0 * k, y + 0.08 * k, 0.72 * k), (0.45 * k, 0.34 * k, 0.36 * k), {'c': cd})
    s.box((x - 0.35 * k, y + 0.2 * k, 0.7 * k), (0.4 * k, 0.1 * k, 0.1 * k), {'c': cd})                # the tail


def barbershop(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (6.0, 6.0, 3.6), {'top': {'c': ROOF}, 'px': win(BRICK, 2, 1, after, 61), 'py': win(BRICK_DK, 2, 1, after, 62), 'nx': {'c': BRICK_DK}, 'ny': {'c': BRICK}})
    s.box((-0.05, -0.05, 3.5), (6.1, 6.1, 0.4), {'c': CONC_DK})
    H._door_face(s, (0, 0, 0), (6.0, 6.0, 3.6), width=1.2, ztop=2.4)
    s.box((3.2, 6.02, 0.9), (2.4, 0.06, 1.5), {'c': (60, 66, 70)})                                    # the shop window
    pole(s, 2.0, 6.5)
    if not after:
        s.box((0.6, 6.02, 0.9), (1.2, 0.06, 1.6), {'c': (90, 86, 80)})                               # the blinds down in the door
        for k in range(5): s.box((1.0 + k * 0.22, 5.94, 1.3 + 0.08 * (k % 2)), (0.2, 0.2, 0.08), {'c': CHAIN})   # a chain across the door
        for i in range(3):
            for j in range(2): s.box((3.4 + i * 0.6, 6.8 + j * 0.0, j * 0.62), (0.5, 0.36, 0.6), {'c': JUG})   # his bleach jugs, stacked
        s.box((3.55, 6.86, 1.24), (0.16, 0.16, 0.12), {'c': JUG_CAP})
    else:
        s.box((3.0, 7.0, 0), (1.1, 1.2, 0.8), {'c': STEEL_DK}); s.box((3.0, 7.0, 0.8), (1.1, 1.0, 0.25), {'c': CHAIR})   # the chair, out front
        s.box((3.0, 7.0, 1.05), (1.1, 0.25, 1.1), {'c': CHAIR}); s.box((2.9, 7.0, 0.8), (0.18, 1.0, 0.45), {'c': CHAIR_DK}); s.box((4.0, 7.0, 0.8), (0.18, 1.0, 0.45), {'c': CHAIR_DK})
        s.box((4.6, 7.2, 0), (0.1, 0.1, 2.4), {'c': STEEL_DK}); s.box((4.3, 7.1, 2.4), (0.7, 0.4, 0.2), {'c': LAMP})   # the lamp over it
    return s


def parlor(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (7.5, 6.0, 3.4), {'top': {'c': ROOF}, 'px': {'c': CONC}, 'py': {'c': CONC_DK}, 'nx': {'c': CONC_DK}, 'ny': {'c': CONC}})
    H._door_face(s, (0, 0, 0), (7.5, 6.0, 3.4), width=1.2, ztop=2.4)
    s.box((3.6, 6.02, 0.8), (3.2, 0.06, 1.8), {'c': INK_DK if not after else (70, 76, 80)})          # the window: painted out, or glass
    s.prism(1.6, 6.3, 3.4, 0.7, 0.18, 6, {'c': INK}, {'c': INK})                                      # his sign over the door: a black star
    tags = [(0.3, 0.6, 1.0, 0.5), (0.4, 2.2, 1.4, 0.4), (3.8, 2.7, 2.4, 0.5), (5.4, 0.3, 1.2, 0.4), (6.6, 1.4, 0.7, 0.9)]
    for (x0, z0, w, h) in tags:                                                                       # his tags on the front wall
        s.box((x0, 6.03, z0), (w, 0.04, h), {'c': INK if not after else GREY})
    for k in range(6):                                                                                # and down the side wall
        s.box((7.53, 0.4 + k * 0.9, 0.5 + 0.4 * (k % 3)), (0.04, 0.7, 0.5 + 0.2 * (k % 2)), {'c': INK if not after else GREY})
    if not after:
        for (x0, z0) in ((0.6, 0.6), (4.4, 2.7), (5.6, 0.3)): s.box((x0, 6.035, z0 - 0.5), (0.06, 0.03, 0.5), {'c': INK})   # the ink run down
    else:
        s.box((4.4, 5.2, 0), (1.0, 0.7, 0.7), {'c': CHAIR_DK}); s.box((4.4, 5.2, 0.7), (1.0, 0.25, 0.9), {'c': CHAIR_DK})   # the chair inside
        s.box((5.8, 5.4, 0), (0.08, 0.08, 1.9), {'c': STEEL_DK}); s.box((5.5, 5.3, 1.9), (0.6, 0.35, 0.16), {'c': LAMP})
    return s


def kennel(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 13), groundc=GRAVEL)
    s.box((0, 0, 0), (10.0, 0.4, 1.8), {'c': CONC_DK}); s.box((0, 0, 0), (0.4, 9.0, 1.8), {'c': CONC_DK})   # the block wall behind
    for i in range(3):                                                                                # three runs of chain-link
        x0 = 1.0 + i * 3.0
        s.box((x0, 1.0, 0), (0.08, 6.0, 2.0), {'c': FENCE}); s.box((x0 + 2.8, 1.0, 0), (0.08, 6.0, 2.0), {'c': FENCE})
        s.prism(x0 + 1.4, 2.4, 0, 0.9, 1.0, 4, {'c': HOUSE_DK}, {'c': HOUSE})                        # a dog house in each
        if not after:
            s.box((x0, 7.0, 0), (2.88, 0.08, 2.0), {'c': FENCE})                                     # the run's gate, shut
            dog(s, x0 + 0.6, 4.6, head_down=(i != 1))
        else:
            s.box((x0, 7.0, 0), (0.08, 1.2, 2.0), {'c': FENCE})                                      # the gate swung open
            s.prism(x0 + 1.4, 5.6, 0, 0.3, 0.12, 10, {'c': STEEL}, {'c': STEEL_DK}, inner=0.24)       # the bowl out
    if not after:
        for k in range(5): s.box((4.6 + k * 0.28, 6.92, 1.0 + 0.1 * (k % 2)), (0.24, 0.24, 0.08), {'c': CHAIN})   # his chain on the middle gate
    return s


def fadepole(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    pole(s, 0.0, 0.0, 0.0, 1.5)
    return s


def inkmark(_after):
    """the company's mark: a stretch of wall in three panels, the middle one painted white with the mark's black bar across it (paint on a
    wall does not survive the rig's pass, measured 11/17: a panel of its own colour does)"""
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-1.2, -0.15, 0), (0.7, 0.3, 1.6), {'c': CONC}); s.box((0.5, -0.15, 0), (0.7, 0.3, 1.6), {'c': CONC})
    s.box((-0.5, -0.15, 0), (1.0, 0.3, 1.6), {'c': WHITE})
    s.box((-0.5, -0.15, 0.9), (1.0, 0.3, 0.25), {'c': INK}); s.box((-0.12, -0.15, 0.3), (0.24, 0.3, 0.6), {'c': INK})
    return s


def pawprints(_after):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((0.4, 0.4, 0), (0.12, 0.12, 0.9), {'c': (110, 86, 58)})                                     # a stake
    for k in range(6):
        x, y = -0.9 + k * 0.28, -0.6 + k * 0.18 + (0.12 if k % 2 else 0)
        s.box((x, y, 0), (0.14, 0.14, 0.02), {'c': FUR_DK})                                          # paw prints in the dirt, to it
    return s


def razorline(state):
    from bohemia_iso3d import Scene
    s = Scene()
    for k in range(10):                                                                               # his stripe across the street
        c = (POLE_R if k % 2 else POLE_W) if state == 'before' else GREY
        s.box((0.4 + k * 0.9, 4.4, 0), (0.9, 1.1, 0.03), {'c': c})
    if state == 'before':
        Q.body(s, 5.0, 6.4, (214, 210, 200), (40, 40, 42))                                            # his razor man on the line
        s.box((5.6, 6.3, 1.0), (0.04, 0.3, 0.06), {'c': STEEL})                                       # the razor in his hand
    return s


def inktag(state):
    """his tags on a wall: the wall built of panels, his tagged ones black (grey once painted over), ink run onto the pavement"""
    from bohemia_iso3d import Scene
    s = Scene()
    tagged = (0, 2, 3, 5, 7)
    for k in range(8):
        c = CONC if k not in tagged else (INK if state == 'before' else GREY)
        s.box((1.0 + k * 1.0, 7.0, 0), (1.0, 0.4, 2.6 - 0.25 * (k % 3)), {'c': c})
    if state == 'before':
        for k in (0, 3, 5): s.box((1.3 + k * 1.0, 6.4, 0), (0.4, 0.6, 0.03), {'c': INK})               # the ink run out onto the pavement
    return s


def pack(state):
    from bohemia_iso3d import Scene
    s = Scene()
    if state == 'before':
        dog(s, 1.2, 2.2, k=1.9); dog(s, 4.8, 4.2, head_down=False, k=1.9); dog(s, 2.2, 6.4, k=1.9)
    else:
        s.box((4.6, 4.6, 0), (0.14, 0.14, 0.9), {'c': (110, 86, 58)})                                  # a stake
        for k in range(6): s.box((4.8 + k * 0.22, 4.7 + 0.1 * (k % 2), 0.02), (0.2, 0.12, 0.06), {'c': CHAIN})   # a broken chain off it
    return s


PLACES = {'barbershop': barbershop, 'parlor': parlor, 'kennel': kennel}
PROPS = {'fadepole': fadepole, 'inkmark': inkmark, 'pawprints': pawprints}
PIECES = [('razorline', razorline, ('before', 'after')), ('inktag', inktag, ('before', 'after')), ('pack', pack, ('before', 'after'))]


def moving(sc, frame):
    """the pole's lamp and the parlor's lamp on the beat; the dogs' breath in the cold; else the seven-to-nine tool's own"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    key = sc['key']; PJ = (lambda p: Q.NT.P(sc, p)) if sc.get('piece') else (lambda p: PB.proj(sc, p))
    if key == 'barbershop_after':
        a, b = PJ((4.6, 7.3, 2.4)); PB.blob(L, a, b, 9, (255, 230, 190), 0.26 if frame else 0.16)
    elif key == 'barbershop_before':
        a, b = PJ((2.0, 6.5, 2.0)); PB.blob(L, a, b, 4, (255, 120, 110), 0.30 if frame else 0.10)
    elif key == 'parlor_after':
        a, b = PJ((5.8, 5.5, 1.9)); PB.blob(L, a, b, 8, (255, 230, 190), 0.24 if frame else 0.18)
    elif key == 'pack_before':
        a, b = PJ((5.6, 4.7, 1.0)); PB.blob(L, a + (1 if frame else 0), b - (2 if frame else 0), 3.0, (200, 200, 200), 0.35)
    return L


Q.OUT = os.path.join(R, 'records/target/bosses_thirteen_to_fifteen')
Q.PLACES, Q.PROPS, Q.PIECES, Q.moving = PLACES, PROPS, PIECES, moving
Q.P4.PLACES.update(PLACES); Q.P4.PROPS.update(PROPS)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): Q.scenes()
    if cmd in ('render', 'all'): Q.render()
    if cmd in ('finish', 'all'): Q.finish()
