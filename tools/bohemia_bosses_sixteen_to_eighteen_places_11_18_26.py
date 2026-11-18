#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [sixteen to eighteen: their places, what their verbs leave, and what each one does to the map] (11/18/26, the
coordinator's round 'BOSSES next', rules 441, 453, 454(a): made with what they do, not with talk).

THE WARD, THE CISTERN, THE SMITH, painted exactly the way thirteen to fifteen were: the seven-to-nine places tool
(tools/bohemia_bosses_seven_to_nine_places_11_11_26.py) is imported and never edited; its scenes, render and finish run here with this
file's places, props, pieces and folder put in its globals.

  THE CLINIC      a low concrete clinic, its red cross over the door. BEFORE: the cross painted over black, plywood on the windows, a
                  chain on the door and a gurney out front with a sheet over somebody. AFTER: the door open and lit, the cross red on
                  white again, the gurney empty, a bench by the door.
  THE ROOF TANKS  a two-storey block with blue tanks on its roof, the gutters run down into them. BEFORE: his chain round the spigot
                  under them, his key on the wall. AFTER: the spigot open, jugs lined up under it, a puddle.
  THE FORGE       a corrugated shed with a brick chimney. BEFORE: the door down, the forge's glow through the gap, his scrap chained in
                  a heap. AFTER: the door up, the anvil out front on its stump, the fire lit warm inside.
  and what each verb leaves: AN OPEN FIRST-AID BOX AND ITS BANDAGE (TREAT), A TARP FUNNEL OVER A BARREL (CATCH), A ROW OF CAST
  BULLETS BY A CAN STOVE (SMELT).
  and the piece each one leaves on a street block:
  WARDTAPE   THE WARD's edge across a street. BEFORE: two posts and his tape between them, a sheet hung on it with his black cross.
             AFTER: the tape cut and hanging off one post, the sheet on the ground.
  TANK       THE CISTERN's tank on a block. BEFORE: a blue tank on a stand, his chain round its tap, his man with a jug. AFTER: the tap
             open, two jugs under it, nobody.
  ANVIL      THE SMITH's mark where his reach ends: BEFORE: an anvil on a stump with his chain round it and a heap of his scrap.
             AFTER: the chain cut, the anvil there for anybody.

  python3 tools/bohemia_bosses_sixteen_to_eighteen_places_11_18_26.py scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish

REFERENCE CHECK (the 9/4 standing duty): the twins are the first fifteen places and pieces; the real things: a one-storey community
clinic with a projecting red cross, a hospital gurney; 1,500-litre blue poly rain tanks, a downspout, five-gallon jugs; a corrugated
smithy shed, a brick forge chimney, a 50 kg anvil on a stump; barricade tape between two posts; a can stove and cast lead. No reference
game.
REUSE CHECK (REUSE-FIRST): the seven-to-nine places tool and through it THE NEXT THREE's frame, BOSSES 4's places frame, COOK's map rig.
ANALOG HORROR: a red cross painted out and a sheet over somebody on a gurney outside a chained door; a man with a key standing over the
last clean water; a heap of everybody's scrap chained to one man's anvil.
"""
import os, sys, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_seven_to_nine_places_11_11_26 as Q

PB, HF, win = Q.PB, Q.HF, Q.win
STEEL, STEEL_DK, CONC, CONC_DK, ROOF, ROOF_DK, BRICK, BRICK_DK, RUST, RUST_DK = Q.STEEL, Q.STEEL_DK, Q.CONC, Q.CONC_DK, Q.ROOF, Q.ROOF_DK, Q.BRICK, Q.BRICK_DK, Q.RUST, Q.RUST_DK
FENCE, CHAIN, CORR, CORR_DK, BENCH = Q.FENCE, Q.CHAIN, Q.CORR, Q.CORR_DK, Q.BENCH
CROSS, WHITE, BLACK, PLY = (176, 36, 32), (222, 218, 206), (24, 24, 26), (150, 120, 80)
SHEET, GURNEY = (204, 200, 188), (150, 152, 150)
TANK, TANK_DK, JUG, JUG_DK, PUDDLE = (52, 110, 168), (34, 76, 120), (70, 132, 186), (46, 92, 138), (62, 80, 96)
TAPE, TAPE_DK, POST = (214, 178, 52), (150, 120, 30), (120, 118, 112)
IRON, IRON_DK, STUMP, SCRAP, SCRAP_DK, LEAD = (70, 68, 66), (40, 38, 36), (110, 82, 52), (120, 96, 72), (84, 66, 50), (126, 128, 132)
TARP, BARREL, BARREL_DK, POLE = (48, 96, 160), (52, 84, 130), (36, 58, 92), (130, 110, 76)
KIT, KIT_DK, BLOOD = (196, 44, 38), (140, 30, 26), (130, 30, 26)


def clinic(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (8.0, 6.0, 3.2), {'top': {'c': ROOF}, 'px': win(CONC, 3, 1, after, 71), 'py': win(CONC_DK, 2, 1, after, 72), 'nx': {'c': CONC_DK}, 'ny': {'c': CONC}})
    s.box((-0.05, -0.05, 3.1), (8.1, 6.1, 0.35), {'c': CONC_DK})
    H._door_face(s, (0, 0, 0), (8.0, 6.0, 3.2), width=1.6, ztop=2.4)
    # the cross over the door, built of panels (paint on a wall does not survive the rig: a panel of its own colour does)
    s.box((2.6, 6.02, 2.55), (1.4, 0.06, 0.45), {'c': WHITE if after else BLACK})
    s.box((3.05, 6.04, 2.35), (0.5, 0.06, 0.85), {'c': CROSS if after else BLACK}); s.box((2.75, 6.05, 2.6), (1.1, 0.06, 0.32), {'c': CROSS if after else BLACK})
    if not after:
        for x0 in (4.6, 6.2): s.box((x0, 6.03, 0.8), (1.2, 0.06, 1.5), {'c': PLY})                     # plywood over the windows
        for k in range(6): s.box((2.4 + k * 0.24, 5.94, 1.2 + 0.08 * (k % 2)), (0.22, 0.22, 0.08), {'c': CHAIN})   # a chain across the door
        s.box((5.0, 7.6, 0.0), (0.08, 0.08, 0.8), {'c': STEEL_DK}); s.box((7.0, 7.6, 0.0), (0.08, 0.08, 0.8), {'c': STEEL_DK})   # the gurney out front
        s.box((4.9, 7.4, 0.8), (2.3, 0.8, 0.12), {'c': GURNEY})
        s.box((5.0, 7.45, 0.92), (2.1, 0.7, 0.32), {'c': SHEET}); s.box((6.6, 7.5, 1.2), (0.45, 0.6, 0.16), {'c': SHEET})   # a sheet over somebody
    else:
        s.box((5.0, 7.6, 0.0), (0.08, 0.08, 0.8), {'c': STEEL_DK}); s.box((7.0, 7.6, 0.0), (0.08, 0.08, 0.8), {'c': STEEL_DK})
        s.box((4.9, 7.4, 0.8), (2.3, 0.8, 0.12), {'c': GURNEY})                                         # the gurney, empty
        s.box((0.4, 6.7, 0), (1.6, 0.5, 0.45), {'c': BENCH})                                            # a bench by the door
    return s


def rooftanks(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=PB.GROUND_LOT)
    s.box((0, 0, 0), (7.0, 6.0, 5.6), {'top': {'c': ROOF}, 'px': win(BRICK, 3, 2, after, 81), 'py': win(BRICK_DK, 2, 2, after, 82), 'nx': {'c': BRICK_DK}, 'ny': {'c': BRICK}})
    H._door_face(s, (0, 0, 0), (7.0, 6.0, 5.6), width=1.2, ztop=2.4)
    for (cx, cy) in ((1.6, 1.8), (4.2, 1.8), (2.9, 4.2)):                                               # his blue tanks on the roof
        s.prism(cx, cy, 5.6, 1.05, 1.6, 16, {'c': TANK}, {'c': TANK_DK})
        s.prism(cx, cy, 7.2, 0.3, 0.12, 10, {'c': TANK_DK}, {'c': TANK_DK})
    s.box((6.2, 6.05, 0.9), (0.18, 0.18, 4.8), {'c': STEEL_DK}); s.box((6.2, 5.6, 5.5), (0.18, 0.6, 0.18), {'c': STEEL_DK})   # the downspout
    s.box((5.4, 6.05, 0.8), (0.9, 0.12, 0.12), {'c': STEEL}); s.box((5.4, 6.1, 0.65), (0.12, 0.12, 0.18), {'c': STEEL_DK})   # the spigot
    if not after:
        for k in range(5): s.box((5.3 + k * 0.2, 6.12, 0.72 + 0.08 * (k % 2)), (0.18, 0.18, 0.08), {'c': CHAIN})   # his chain on it
        s.box((3.2, 6.03, 1.6), (1.4, 0.05, 0.2), {'c': IRON_DK}); s.box((3.8, 6.04, 0.9), (0.2, 0.05, 0.9), {'c': IRON_DK})   # his key on the wall
    else:
        for k in range(4): s.prism(4.3 + k * 0.7, 7.2, 0, 0.28, 0.6, 12, {'c': JUG}, {'c': JUG_DK})        # jugs lined up under it
        s.box((5.0, 6.3, 0), (1.4, 0.8, 0.02), {'c': PUDDLE})                                            # a puddle
    return s


def forge(after):
    H = HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 13, 12), groundc=Q.GRAVEL)
    s.box((0, 0, 0), (7.5, 6.0, 3.4), {'top': {'c': CORR_DK}, 'px': {'c': CORR}, 'py': {'c': CORR_DK}, 'nx': {'c': CORR_DK}, 'ny': {'c': CORR}})
    s.box((5.6, 0.6, 3.4), (1.2, 1.2, 2.8), {'c': BRICK})                                               # the brick chimney
    s.box((5.5, 0.5, 6.2), (1.4, 1.4, 0.3), {'c': BRICK_DK})
    s.box((1.0, 6.01, 0.0), (3.0, 0.06, 2.6), {'c': (30, 26, 22)})                                      # the door's hole
    if not after:
        s.box((1.0, 6.03, 0.25), (3.0, 0.06, 2.35), {'c': CORR_DK})                                     # the door down, a gap under it
        for (x, y, h) in ((5.0, 7.0, 0.7), (5.6, 7.6, 0.5), (6.3, 7.1, 0.8), (5.3, 8.1, 0.4), (6.6, 8.0, 0.55)):
            s.box((x, y, 0), (0.6, 0.5, h), {'c': SCRAP if (x * 10) % 2 < 1 else SCRAP_DK})             # his scrap in a heap
        for k in range(6): s.box((4.9 + k * 0.32, 7.35 + 0.18 * (k % 2), 0.75), (0.28, 0.22, 0.08), {'c': CHAIN})   # his chain over it
    else:
        s.box((1.0, 6.03, 2.3), (3.0, 0.06, 0.3), {'c': CORR_DK})                                       # the door rolled up
        s.prism(2.4, 7.5, 0, 0.42, 0.7, 12, {'c': STUMP}, {'c': (140, 108, 70)})                        # the anvil on its stump
        s.box((1.9, 7.25, 0.7), (1.1, 0.5, 0.4), {'c': IRON}); s.box((3.0, 7.35, 0.85), (0.4, 0.3, 0.25), {'c': IRON_DK})   # the horn
    return s


def bandage(_after):
    """an open first-aid box on the ground, its lid back, a bandage roll out of it with blood on the end"""
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((-0.5, -0.3, 0), (1.0, 0.6, 0.32), {'top': {'c': WHITE}, 'px': {'c': KIT}, 'py': {'c': KIT_DK}, 'nx': {'c': KIT_DK}, 'ny': {'c': KIT}})
    s.box((-0.5, 0.3, 0.32), (1.0, 0.08, 0.6), {'c': KIT})                                              # the lid back
    s.box((-0.15, 0.31, 0.5), (0.3, 0.06, 0.1), {'c': WHITE}); s.box((-0.05, 0.31, 0.4), (0.1, 0.06, 0.3), {'c': WHITE})   # its cross
    s.prism(0.8, -0.2, 0, 0.16, 0.18, 12, {'c': WHITE}, {'c': WHITE})                                   # the roll
    s.box((0.8, -0.6, 0), (0.7, 0.18, 0.02), {'c': WHITE}); s.box((1.3, -0.6, 0.0), (0.2, 0.18, 0.025), {'c': BLOOD})   # unrolled, blood at the end
    return s


def raintarp(_after):
    """a blue tarp pulled into a funnel on four poles, a blue barrel under its mouth"""
    from bohemia_iso3d import Scene
    s = Scene()
    for (x, y) in ((-1.0, -1.0), (1.0, -1.0), (-1.0, 1.0), (1.0, 1.0)): s.box((x, y, 0), (0.08, 0.08, 1.9), {'c': POLE})
    for k in range(4):                                                                                  # the tarp, sagging to the middle
        d = 1.0 - k * 0.25
        s.box((-d, -d, 1.85 - k * 0.22), (2 * d, 2 * d, 0.05), {'c': TARP if k % 2 == 0 else (40, 82, 140)})
    s.prism(0.0, 0.0, 0, 0.42, 1.0, 14, {'c': BARREL}, {'c': BARREL_DK})                                # the barrel under its mouth
    return s


def ingot(_after):
    """a can stove with a steel pot of lead on it, and a row of cast bullets on a board by it"""
    from bohemia_iso3d import Scene
    s = Scene()
    s.prism(-0.5, 0.0, 0, 0.34, 0.5, 12, {'c': STEEL_DK}, {'c': IRON_DK})                               # the can stove
    s.prism(-0.5, 0.0, 0.5, 0.3, 0.3, 12, {'c': STEEL}, {'c': LEAD})                                    # the pot of lead on it
    s.box((0.2, -0.4, 0), (1.2, 0.5, 0.06), {'c': BENCH})                                               # a board
    for k in range(6): s.prism(0.32 + k * 0.18, -0.15, 0.06, 0.05, 0.16, 8, {'c': LEAD}, {'c': (170, 150, 90)})   # the cast rounds
    return s


def wardtape(state):
    from bohemia_iso3d import Scene
    s = Scene()
    s.box((1.0, 4.8, 0), (0.16, 0.16, 1.5), {'c': POST}); s.box((8.4, 4.8, 0), (0.16, 0.16, 1.5), {'c': POST})   # two posts
    if state == 'before':
        for k in range(9): s.box((1.16 + k * 0.81, 4.84, 1.2), (0.81, 0.06, 0.16), {'c': TAPE if k % 2 == 0 else BLACK})   # his tape
        s.box((3.6, 4.86, 0.2), (2.2, 0.05, 1.0), {'c': SHEET})                                            # a sheet hung on it
        s.box((4.5, 4.84, 0.35), (0.4, 0.05, 0.75), {'c': BLACK}); s.box((4.2, 4.84, 0.6), (1.0, 0.05, 0.25), {'c': BLACK})   # his black cross
    else:
        for k in range(3): s.box((8.4 - (k + 1) * 0.3, 4.84, 1.2 - k * 0.38), (0.3, 0.06, 0.16), {'c': TAPE if k % 2 == 0 else BLACK})   # cut, hanging
        s.box((3.4, 5.0, 0), (2.4, 1.2, 0.03), {'c': SHEET})                                               # the sheet on the ground
    return s


def tank(state):
    from bohemia_iso3d import Scene
    s = Scene()
    for (x, y) in ((3.4, 3.4), (5.4, 3.4), (3.4, 5.4), (5.4, 5.4)): s.box((x, y, 0), (0.16, 0.16, 1.0), {'c': STEEL_DK})   # its stand
    s.box((3.3, 3.3, 1.0), (2.4, 2.4, 0.12), {'c': STEEL_DK})
    s.prism(4.5, 4.5, 1.12, 1.1, 2.0, 16, {'c': TANK}, {'c': TANK_DK})                                     # the tank
    s.box((4.4, 5.6, 0.6), (0.12, 0.6, 0.12), {'c': STEEL})                                                # its tap
    if state == 'before':
        for k in range(4): s.box((4.3, 5.7 + k * 0.16, 0.5 + 0.08 * (k % 2)), (0.3, 0.14, 0.08), {'c': CHAIN})   # his chain round it
        Q.NT.body(s, 6.6, 6.2, (70, 78, 88), (48, 54, 62), tall=1.08)                                      # his man, a jug at his feet
        s.prism(7.6, 6.9, 0, 0.28, 0.6, 12, {'c': JUG}, {'c': JUG_DK})
    else:
        for k in range(2): s.prism(4.1 + k * 0.8, 6.6, 0, 0.28, 0.6, 12, {'c': JUG}, {'c': JUG_DK})          # two jugs under the tap
    return s


def anvil(state):
    from bohemia_iso3d import Scene
    s = Scene()
    s.prism(4.0, 4.6, 0, 0.55, 0.8, 12, {'c': STUMP}, {'c': (140, 108, 70)})                               # the stump
    s.box((3.3, 4.3, 0.8), (1.4, 0.6, 0.5), {'c': IRON}); s.box((4.7, 4.42, 1.0), (0.5, 0.36, 0.3), {'c': IRON_DK})   # the anvil, its horn
    if state == 'before':
        for (x, y, h) in ((5.6, 4.2, 0.8), (6.3, 4.9, 0.6), (5.8, 5.6, 0.9), (6.8, 5.7, 0.5), (2.2, 5.6, 0.6)):
            s.box((x, y, 0), (0.7, 0.6, h), {'c': SCRAP if int(x * 10) % 2 else SCRAP_DK})                  # his heap of scrap
        for k in range(7): s.box((3.3 + k * 0.3, 4.2 + 0.12 * (k % 2), 1.25), (0.26, 0.22, 0.08), {'c': CHAIN})   # his chain over the anvil
    else:
        for k in range(3): s.box((3.0 + k * 0.28, 5.2, 0.02), (0.24, 0.2, 0.06), {'c': CHAIN})               # the chain cut, on the ground
    return s


PLACES = {'clinic': clinic, 'rooftanks': rooftanks, 'forge': forge}
PROPS = {'bandage': bandage, 'raintarp': raintarp, 'ingot': ingot}
PIECES = [('wardtape', wardtape, ('before', 'after')), ('tank', tank, ('before', 'after')), ('anvil', anvil, ('before', 'after'))]


def moving(sc, frame):
    """the clinic's light; the weld-orange of the forge under its door and the smoke; the water in the jugs glints; the tape in the wind"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64)
    key = sc['key']; PJ = (lambda p: Q.NT.P(sc, p)) if sc.get('piece') else (lambda p: PB.proj(sc, p))
    if key == 'clinic_after':
        a, b = PJ((3.2, 6.2, 1.4)); PB.blob(L, a, b, 12, (230, 240, 255), 0.26 if frame else 0.18)
    elif key == 'clinic_before':
        a, b = PJ((6.0, 7.8, 1.1)); PB.blob(L, a, b, 5, (200, 210, 230), 0.10 if frame else 0.04)
    elif key == 'forge_before':
        a, b = PJ((2.5, 6.1, 0.1)); PB.blob(L, a, b, 9, (255, 140, 60), 0.7 if frame else 0.35)
        a, b = PJ((6.2, 1.2, 6.8)); PB.blob(L, a + (2 if frame else 0), b - (3 if frame else 0), 6, (150, 146, 140), 0.35)
    elif key == 'forge_after':
        a, b = PJ((2.5, 5.6, 1.0)); PB.blob(L, a, b, 12, (255, 170, 90), 0.36 if frame else 0.26)
    elif key == 'rooftanks_after':
        a, b = PJ((5.6, 6.5, 0.05)); PB.blob(L, a, b, 3, (200, 226, 255), 0.5 if frame else 0.2)
    elif key == 'wardtape_before':
        a, b = PJ((4.7, 4.9, 1.3)); PB.blob(L, a + (1 if frame else -1), b, 2.0, TAPE, 0.35)
    elif key == 'ingot':
        a, b = PJ((-0.5, 0.0, 0.85)); PB.blob(L, a, b, 3.0, (255, 160, 80), 0.6 if frame else 0.3)
    return L


Q.OUT = os.path.join(R, 'records/target/bosses_sixteen_to_eighteen')
Q.PLACES, Q.PROPS, Q.PIECES, Q.moving = PLACES, PROPS, PIECES, moving
Q.P4.PLACES.update(PLACES); Q.P4.PROPS.update(PROPS)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if cmd in ('scenes', 'all'): Q.scenes()
    if cmd in ('render', 'all'): Q.render()
    if cmd in ('finish', 'all'): Q.finish()
