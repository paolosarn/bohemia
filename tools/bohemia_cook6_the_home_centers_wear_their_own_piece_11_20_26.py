#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the two home centers wear their own piece] (11/20/26; COOK FIVE's list carried on by COOK SIX: 'the
the_home_center_east and the_home_center_west on the map (the last two of the valley's fifteen)'; VAMILY rules 461, 453, 441,
408, 409(c), 455).

The last two of the valley's fifteen real places (records/target/bb/real_places.json, where 'valley') that still wore the kit
art of the kind they are like (commercial). Each gets its own piece on the map by the 11/17k pipeline (slices/bohemia_place_pieces.js
draws it; NO CODE in this build: two entries in slices/place_pieces/place_pieces.json and four lossless WebP pictures), made by
COOK FIVE's places tool, which this one imports. ONE BIG BOX, TWO STATES (WORLD's own words for each):

  THE HOME CENTER, EAST SIDE   'Everything with a plug went the first week, jefe. The generators, the propane, the chainsaws, the
                    batteries off the end caps. Then the plywood for the windows, then the wire. What's left is paint and
                    doorknobs. A crew sleeps in the lumber aisle.' The big box with its entrance gaping (the doors gone), the
                    band where its name was, the lumber canopy at its side stripped to the racks, the crew's fire smoking up
                    through a hole in the roof over the lumber aisle, the garden centre's shade cloth torn down over dead
                    plants, the night manager among them; on the lot the paint they could not eat, poured out in pools of
                    colour in front of the doors, carts on their sides, a light pole down. On the beat: the crew's fire through
                    the roof, and the night manager's lantern.
  THE HOME CENTER, WEST SIDE   'Thirty years I cut keys here. Nobody needs a key now, everything is open. Mira, all open. The
                    west side went slower than the east. There's still some in receiving, if you know where the dock door
                    is.' The same box, its doors standing open but whole, the band and most of its letters, the carts still
                    in their corral, plywood still stacked under the lumber canopy, the garden centre's shade cloth up, and
                    round the side the receiving dock: a trailer backed to one door, the next door rolled up with a pallet in
                    its wrap inside it, the key cutter in it with his lantern. On the beat: his lantern, and the spark of the
                    key machine he runs out of habit.

  python3 tools/bohemia_cook6_the_home_centers_wear_their_own_piece_11_20_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook6_the_home_centers_wear_their_own_piece_11_20_26.py render
  python3 tools/bohemia_cook6_the_home_centers_wear_their_own_piece_11_20_26.py finish
  python3 tools/bohemia_cook6_the_home_centers_wear_their_own_piece_11_20_26.py sheet <shots>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): an American big-box home improvement store
(a tilt-up concrete box about 130 by 100 m on a mile-street corner, one tall entrance portal with a canopy and a coloured band
for the name; a garden centre fenced in chain-link with a shade-cloth roof; a lumber or contractor canopy at one side over
racks; a lot of cart corrals and tall light poles; a receiving dock round the side with roll-up doors at trailer height and a
trailer backed in); a store looted in a collapse (doors gone, the lot littered, what has no use poured out). The twins: COOK
FIVE's thirteen places (the same frame, rig and draw), and the kit's commercial blocks beside them on the map (the card shows
each before and now).
REUSE CHECK (REUSE-FIRST): COOK FIVE's places tool (its capture, render, finish, sheet and colours), its downtown tool (face())
and its east-side tool (its bind and finish shape): imported; this file is two scenes and their beats.
ANALOG HORROR: paint poured out on the lot in front of the doors, every colour a room can be, because it was the only thing
left; a key cut every night for a door that is always open.
No reference game.
"""
import os, sys, json, math
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_places_wear_their_own_piece_11_17_26 as PW      # COOK FIVE's: the pipeline
import bohemia_cook5_downtowns_three_wear_their_own_piece_11_17_26 as DT  # COOK FIVE's: its colours and face()
import bohemia_cook5_the_east_sides_three_wear_their_own_piece_11_18_26 as ES   # COOK FIVE's: the last pieces' binding (the older places stay as made)

ST, PB, C = PW.ST, PW.PB, PW.C
CONC, CONC_DK, ROOF, ROOF_DK, STEEL, STEEL_DK, FRAME, SOOT, TYRE, LOT = PW.CONC, PW.CONC_DK, PW.ROOF, PW.ROOF_DK, PW.STEEL, PW.STEEL_DK, PW.FRAME, PW.SOOT, PW.TYRE, PW.LOT
CORR, CORR_DK, RUST, RUST_DK, WOOD, WOOD_DK = PW.CORR, PW.CORR_DK, PW.RUST, PW.RUST_DK, PW.WOOD, PW.WOOD_DK
face, VOID, SASH = DT.face, DT.VOID, DT.SASH
WHITE = (226, 222, 210)
BOX, BOX_DK = (176, 168, 150), (132, 126, 112)              # the tilt-up concrete, sun-bleached
BAND, BAND_DK = (150, 84, 52), (110, 62, 40)                # the store's band, its colour gone to rust
SHADE, SHADE_DK = (70, 84, 72), (50, 60, 52)                # the garden centre's shade cloth
DEAD, POT = (124, 104, 70), (150, 92, 60)                   # dead plants, their pots
LINES = (196, 190, 172)
PAINT = ((176, 64, 52), (222, 214, 196), (70, 104, 140), (206, 170, 70), (96, 128, 88), (186, 120, 96), (60, 60, 64))   # the paint they poured: every colour a room can be (none purple)
CART = (150, 150, 146)
TRAILER, TRAILER_DK = (206, 202, 190), (160, 156, 146)
# what moves on the beat
FIRE_E = (1.6, 4.2, 3.6)                                    # the crew's fire, seen through the hole in the roof over the lumber aisle
SMOKE_E = (1.6, 4.2, 4.4)
LANTERN_E = (8.9, 4.4, 0.9)                                 # the night manager, in the garden centre
LANTERN_W = (8.25, 1.5, 1.0)                                # the key cutter, in the dock door
SPARK_W = (8.35, 0.7, 0.95)


def big_box(s, gone=False):
    """the box, 10 by 7 by 3.6, tilt-up panels; its roof with the units on it; the tall portal on its +y face"""
    s.box((-1.6, -1.6, 0), (9.6, 6.6, 3.6), face(BOX, BOX_DK)); s.box((-1.7, -1.7, 3.6), (9.8, 6.8, 0.14), face(ROOF, ROOF_DK))
    for k in range(1, 8): s.box((-1.6 + k * 1.2, 5.005, 0), (0.04, 0.02, 3.6), C(BOX_DK))                               # the panels' joints
    for k in range(1, 6): s.box((8.005, -1.6 + k * 1.1, 0), (0.02, 0.04, 3.6), C(BOX_DK))
    for (x, y) in ((0.4, 0.2), (3.2, 1.6), (5.6, -0.4), (1.8, -1.0), (6.4, 2.6)): s.box((x, y, 3.74), (0.9, 0.7, 0.45), face(STEEL, STEEL_DK))   # the units on the roof
    for (x, y) in ((-0.6, 2.4), (4.4, 3.4), (2.6, -0.6)): s.box((x, y, 3.74), (0.7, 0.5, 0.06), C((150, 160, 160)))       # skylights
    # the portal: a taller block proud of the face, the band for the name, the canopy, the doors
    s.box((2.0, 5.0, 0), (2.8, 0.4, 4.4), face(BOX, BOX_DK)); s.box((1.9, 4.9, 4.4), (3.0, 0.6, 0.12), face(ROOF, ROOF_DK))
    s.box((2.05, 5.405, 3.3), (2.7, 0.03, 0.8), C(BAND))
    for k in range(9):                                           # its letters: HOME CENTER, some gone
        if gone and k in (1, 4, 5, 8): continue
        if not gone and k in (6,): continue
        s.box((2.2 + k * 0.28, 5.44, 3.45), (0.18, 0.02, 0.5), C(WHITE))
    s.box((1.6, 5.4, 2.3), (3.6, 1.4, 0.12), face(CONC, CONC_DK))                                                          # the canopy
    for x in (1.7, 5.0): s.box((x, 6.6, 0), (0.12, 0.12, 2.3), C(FRAME))
    s.box((2.4, 5.405, 0), (2.0, 0.03, 2.1), C(VOID))                                                                     # the doors: open, the dark inside
    if not gone:
        for k in range(4): s.box((2.45 + k * 0.5, 5.42, 0.05), (0.06, 0.03, 2.0), C((160, 170, 170)))                     # the frames still in it
        s.box((2.45, 5.6, 0.0), (0.8, 0.05, 2.0), C((150, 160, 160)))                                                    # one door stood open on the walk
    else:
        for k in range(10): s.box((2.2 + k * 0.22, 5.6 + (k % 3) * 0.2, 0.06), (0.18, 0.14, 0.02), C((196, 210, 210)))   # the glass, on the walk


def lumber_canopy(s, stripped):
    """the lumber canopy along the box's -x end of the face: posts, its roof, racks; stripped to the racks or still stacked"""
    x0, y0 = -1.6, 5.0
    s.box((x0, y0, 2.6), (3.2, 2.4, 0.1), face(CORR, CORR_DK))
    for (dx, dy) in ((0, 2.3), (3.1, 2.3)): s.box((x0 + dx, y0 + dy, 0), (0.1, 0.1, 2.6), C(FRAME))
    for k in range(3):
        y = y0 + 0.3 + k * 0.7
        s.box((x0 + 0.2, y, 0), (2.8, 0.08, 1.6), C((70, 96, 120)))                                                     # the racks' uprights, blue
        if stripped:
            if k == 1: s.box((x0 + 0.4, y + 0.1, 0.3), (1.0, 0.4, 0.12), C(WOOD))                                         # one board left
        else:
            for q in range(3): s.box((x0 + 0.3, y + 0.1, 0.2 + q * 0.45), (2.6, 0.45, 0.32), face(WOOD if q % 2 else (176, 150, 110), WOOD_DK))   # plywood and two-by, stacked


def garden(s, torn, who):
    """the garden centre on the box's +x side: chain-link on posts, the shade cloth over it (torn down or still up), dead plants
    in their pots, pallets of bagged soil"""
    x0, y0 = 8.0, 0.2
    for k in range(5): s.box((x0 + 2.2, y0 + k * 1.2, 0), (0.08, 0.08, 2.0), C(FRAME)); s.box((x0 + 0.05, y0 + k * 1.2, 1.9), (2.2, 0.06, 0.06), C(FRAME))
    s.box((x0 + 2.2, y0, 0), (0.03, 4.8, 1.8), C((132, 136, 134)))                                                       # the chain-link, end on
    s.box((x0, y0 + 4.8, 0), (2.25, 0.03, 1.8), C((132, 136, 134)))
    if torn:
        s.box((x0 + 0.1, y0 + 0.1, 1.95), (2.1, 2.0, 0.04), face(SHADE, SHADE_DK))                                       # what is still up
        s.box((x0 + 0.3, y0 + 2.4, 0.0), (1.9, 2.2, 0.08), face(SHADE, SHADE_DK))                                       # the rest, down on the plants
    else:
        s.box((x0 + 0.05, y0 + 0.05, 1.96), (2.2, 4.75, 0.04), face(SHADE, SHADE_DK))
    rng = np.random.RandomState(9 if torn else 11)
    for i in range(4):
        for j in range(6):
            if torn and j >= 3 and i % 2: continue
            x, y = x0 + 0.3 + i * 0.48, y0 + 0.4 + j * 0.7
            s.prism(x, y, 0, 0.16, 0.2, 8, C(POT), C(POT)); s.prism(x, y, 0.2, 0.2 if torn else 0.24, 0.3, 7, C(DEAD if torn else (110, 104, 66)), C(DEAD))
    for k in range(2): s.box((x0 + 0.2 + k * 1.0, y0 + 4.3, 0), (0.8, 0.4, 0.3 + 0.12 * k), face((120, 100, 76), (90, 76, 58)))   # the bagged soil
    ST.body(s, *who, (104, 92, 72), (52, 46, 40))


def lot(s, x0, y0, x1, y1, rng, looted):
    """the lot's lines, its light poles, the cart corral and the carts"""
    for k in range(6): s.box((x0 + k * 1.3, y0, 0.06), (0.06, 1.1, 0.01), C(LINES))                          # (flat things start at 0.06: the plate's pad is 0.05, COOK FIVE measured)
    for (x, y, down) in ((x0 - 0.4, y1 - 0.4, looted), (x1 - 0.4, y0 + 0.3, False)):
        if down: s.box((x, y, 0.06), (3.6, 0.12, 0.12), C((112, 116, 114))); s.box((x + 3.6, y - 0.1, 0), (0.4, 0.3, 0.16), C((120, 124, 120)))
        else: s.prism(x, y, 0, 0.08, 4.4, 6, C((112, 116, 114)), C((112, 116, 114))); s.box((x - 0.4, y - 0.1, 4.4), (0.8, 0.2, 0.12), C((120, 124, 120)))
    cx, cy = x0 + 3.0, y0 + 1.6                                                                                            # the cart corral
    s.box((cx, cy, 0), (2.0, 0.06, 0.9), C(FRAME)); s.box((cx, cy + 0.8, 0), (2.0, 0.06, 0.9), C(FRAME))
    n = 1 if looted else 5
    for k in range(n): s.box((cx + 0.1 + k * 0.3, cy + 0.15, 0.1), (0.7, 0.5, 0.5), C(CART))
    for k in range(4 if looted else 1):                                                                                    # the strays
        x, y = x0 + rng.uniform(0, 6), y0 + rng.uniform(-0.6, 1.4)
        if looted and k % 2: s.box((x, y, 0.06), (0.7, 0.5, 0.06), C(CART)); s.box((x, y + 0.5, 0), (0.7, 0.05, 0.5), C(CART))   # on its side
        else: s.box((x, y, 0.1), (0.7, 0.5, 0.5), C(CART))


def the_home_center_east(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(31)
    H._ground(s, (-2, -2, 12, 12), groundc=LOT)
    big_box(s, gone=True); lumber_canopy(s, stripped=True); garden(s, torn=True, who=(8.6, 4.0))
    s.box((1.1, 3.7, 3.74), (1.0, 1.0, 0.03), C(VOID)); s.box((1.0, 3.6, 3.74), (1.2, 0.1, 0.1), C(SOOT)); s.box((1.0, 4.7, 3.74), (1.2, 0.1, 0.1), C(SOOT))   # the hole they opened over the lumber aisle
    for k in range(3): s.box((0.6 + k * 0.05, 3.4 - k * 0.3, 3.75), (1.8 - 0.2 * k, 0.3, 0.02), C((70 + 20 * k, 66 + 20 * k, 62 + 18 * k)))        # its soot on the roof
    lot(s, -1.4, 7.6, 7.0, 11.4, rng, True)
    # the paint they could not eat, poured out in pools of colour in front of the doors, and its cans
    for k in range(9):
        c = PAINT[k % len(PAINT)]; x, y = 1.2 + rng.uniform(-0.6, 3.8), 6.9 + rng.uniform(-0.3, 1.6); r = rng.uniform(0.55, 1.05)
        s.prism(x, y, 0.06 + 0.004 * k, r, 0.01, 14, C(c), C(c))
        for q in range(2): s.prism(x + rng.uniform(-0.5, 0.5), y + rng.uniform(-0.5, 0.5), 0, 0.1, 0.18 if q else 0.02, 8, C((170, 170, 166)), C(c))
    for k in range(6): s.box((5.6 + rng.uniform(0, 1.6), 6.2 + rng.uniform(0, 1.2), 0), (0.3, 0.2, 0.12), C((196, 160, 70)))                     # doorknobs and hinges in their boxes, kicked about
    s.box((-1.0, 8.6, 0.06), (1.6, 0.9, 0.05), face((176, 150, 110), WOOD_DK)); s.box((-0.9, 8.7, 0.11), (1.4, 0.7, 0.03), C(WOOD))            # one sheet of ply left on the lot, walked on
    ST.body(s, 0.0, 6.4, (70, 64, 58), (40, 38, 36))                                                                       # one of the crew, at the canopy
    return s


def the_home_center_west(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(37)
    H._ground(s, (-2, -2, 12, 12), groundc=LOT)
    big_box(s, gone=False); lumber_canopy(s, stripped=False)
    # the receiving dock round the +x side (the garden centre is on this store's far side): its apron, three doors, a trailer backed in
    s.box((8.0, -1.6, 0), (0.6, 4.8, 1.2), face(CONC, CONC_DK))                                                           # the dock's step
    for k in range(3):
        y = -1.3 + k * 1.5
        s.box((8.005, y, 1.2), (0.03, 1.1, 1.6), C(VOID if k == 1 else (150, 154, 152)))
        if k != 1:
            for q in range(5): s.box((8.02, y, 1.3 + q * 0.3), (0.02, 1.1, 0.03), C((120, 124, 122)))
        s.box((8.6, y - 0.05, 0), (0.06, 0.12, 1.2), C((40, 40, 40))); s.box((8.6, y + 1.03, 0), (0.06, 0.12, 1.2), C((40, 40, 40)))   # the bumpers
    s.box((7.9, -0.15, 1.2), (0.6, 0.9, 1.0), face((210, 206, 196), (170, 166, 156)))                                     # the pallet nobody unwrapped, in the open door
    ST.body(s, 8.25, 1.25, (90, 96, 104), (46, 46, 44))                                                                    # the key cutter, in the next door's light
    s.box((8.62, 1.6, 0), (4.0, 1.25, 1.1), face(TRAILER, TRAILER_DK)); s.box((8.62, 1.6, 1.1), (4.0, 1.25, 1.3), face(TRAILER, TRAILER_DK))   # a trailer backed to the third door
    s.box((8.62, 2.85, 0.0), (4.0, 0.02, 0.2), C((110, 112, 110)))
    for xx in (11.0, 11.6): s.box((xx, 2.86, 0), (0.45, 0.1, 0.4), C(TYRE))
    s.box((9.0, 1.58, 1.3), (3.0, 0.02, 0.6), C((70, 104, 140)))                                                          # its band, a line that went under
    s.box((9.6, -1.4, 0), (1.3, 0.8, 0.9), face(STEEL, STEEL_DK)); s.box((10.9, -1.3, 0.3), (0.5, 0.6, 0.06), C(FRAME))   # a forklift, parked square
    s.box((9.6, -1.4, 0.9), (0.08, 0.08, 1.0), C(FRAME)); s.box((10.2, -1.4, 0.9), (0.08, 0.08, 1.0), C(FRAME)); s.box((9.6, -1.4, 1.9), (0.7, 0.8, 0.06), C(FRAME))
    lot(s, -1.4, 7.6, 7.0, 11.4, rng, False)
    for k in range(3): x, y = 1.0 + k * 2.0, 9.6 + 0.3 * (k % 2); car = ((96, 112, 124), (170, 150, 110), (150, 70, 52))[k]; s.box((x, y, 0.15), (1.6, 0.8, 0.5), face(car, tuple(int(v * 0.7) for v in car))); s.box((x + 0.35, y + 0.05, 0.65), (0.9, 0.7, 0.35), C((60, 70, 76)))   # three cars that never left the lot
    for k in range(4): s.box((5.6 + k * 0.32, 6.0, 0), (0.28, 0.28, 0.5), face((60, 60, 64), (40, 40, 42)))               # contractor bags, tied, by the doors
    return s


PLACES = {'the_home_center_east': the_home_center_east, 'the_home_center_west': the_home_center_west}
SAY = {'the_home_center_east': 'HOME CENTER, EAST SIDE', 'the_home_center_west': 'HOME CENTER, WEST SIDE'}
LIKE = {'the_home_center_east': 'commercial', 'the_home_center_west': 'commercial'}
_older = ES.moving


def moving(sc, frame):
    """what moves on the beat: the crew's fire through the roof and its smoke, the night manager's lantern; the key cutter's
    lantern and the spark of the key machine"""
    key = sc['key']
    if key not in PLACES: return _older(sc, frame)
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: PB.proj(sc, p)
    if key == 'the_home_center_east':
        x, y = PJ(FIRE_E); blob(L, x, y, 2.4, (255, 170, 70), 0.95 if frame else 0.55); blob(L, x, y, 6.0, (255, 130, 50), 0.28 if frame else 0.14)
        x, y = PJ(SMOKE_E)
        for i in range(4):
            t = i + (0.5 if frame else 0.0); blob(L, x + t * 2.2 + math.sin(t * 1.3), y - t * 2.6 - 1, 2.4 + t * 1.2, (86, 82, 78), 0.6 * max(0.0, 1 - t / 4.6))
        x, y = PJ(LANTERN_E); blob(L, x, y, 1.6, (255, 214, 150), 0.9 if frame else 0.5); blob(L, x, y, 4.5, (255, 190, 120), 0.18 if frame else 0.1)
    else:
        x, y = PJ(LANTERN_W); blob(L, x, y, 2.2, (255, 214, 150), 0.95 if frame else 0.35); blob(L, x, y, 6.5, (255, 190, 120), 0.32 if frame else 0.1)   # his lantern, swinging
        x, y = PJ(SPARK_W); blob(L, x + (1 if frame else 0), y, 1.6, (255, 240, 200), 0.0 if frame else 0.98); blob(L, x, y, 3.6, (255, 220, 160), 0.0 if frame else 0.3)   # the key machine's spark
        # (the first cut moved 5 pixels between its frames: the gate's S3 said it did not move)
    return L


def bind():
    """this file's two through the places tool's own scenes / render / finish / sheet (the thirteen older places are not re-made)"""
    ES.bind()
    PW.PLACES = PLACES; PW.SAY = dict(PW.SAY, **SAY); PW.LIKE = dict(PW.LIKE, **LIKE); PW.moving = moving
    PW.OUT = os.path.join(R, 'records/target/cook6_places_home_centers')


def finish():
    PW.finish()
    mp = os.path.join(PW.DEST, 'place_pieces.json'); man = json.load(open(mp))
    for k in PLACES: man['pictures'][k]['finished'] = 'cook 6, 11/20'
    json.dump(man, open(mp, 'w'), indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'; bind()
    if cmd == 'scenes': PW.scenes()
    elif cmd == 'render': PW.render()
    elif cmd == 'finish': finish()
    elif cmd == 'sheet': PW.sheet(a[1], 'COOK6_THE_HOME_CENTERS_11_20', ('the_home_center_east', 'the_home_center_west'), 'cook6-the-home-centers-11-20')
    else: print(__doc__)
