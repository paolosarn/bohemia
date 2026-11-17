#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the places wear their own piece] (11/17/26; the coordinator's routine 'COOK FIVE full sweep', VAMILY
rules 453, 441, 408 and 409(c): 'finished art wherever a VOTE card still says STAND-IN and he meets it first, each its own
build: ... the bus yard and the greenhouses, WORLD 14's two newest places').

THE REAL PLACES (records/target/bb/real_places.json, WORLD TEN and WORLD FOURTEEN) are on the map at their real spots, each
with a person who talks. On the map each one WEARS THE KIT ART OF THE KIND IT IS LIKE (the bus yard a terminal like any
terminal, the greenhouses a farm like any farm): slices/bohemia_real_places.js says so in its own words, 'until COOK FOUR's
golden piece (rule 408)', and WORLD FOURTEEN's handoff asks for them by name: 'the yard of buses in rows and the long plastic
houses with the lights'. Nobody made them. These are the pieces, and slices/bohemia_place_pieces.js draws a place's own piece
on its block (the way BOSSES' places are drawn on theirs).

  THE BUS YARD     (the RTC's Sunset Maintenance Facility) a fleet with no diesel: the long maintenance shed across the back
                   with its bay doors (one still lit: the mechanics who stayed), and the buses in rows, nose out, white with the
                   transit band, the battery packs on their roofs. One is up on blocks with its pack pulled and stacked on a
                   pallet beside it; one burned; one still has its sign lit.
  THE GREENHOUSES  (Urban Seed's on Wynn Road) four long plastic houses side by side, hoop after hoop, the plastic lit rose
                   from inside by the grow lights (rose, never purple: PURPLE RESERVATION), a door planked shut, the water
                   totes in their cages, the crates of greens stacked by the way in.

HIS RULING ON AN ICON (8/2, bohemia_district_hero_factory._ground): 'THE BUILDING IS THE ICON... it just needs to fill up the
square', no parking lot smear. So the buses are few and big and the shed spans the lot; the four houses fill theirs.

  python3 tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py render
  python3 tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py finish      (slices/place_pieces/: the pictures, lossless WebP, and place_pieces.json)
  python3 tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py sheet <shots_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a transit maintenance yard (a long
shed of roll-up bays, buses parked nose out in ranks, battery-electric buses carry their packs in a box on the roof); a bus up
on cribbing with its pack out; a commercial hoop-house range (steel hoops under milky polythene, end walls with a door, IBC
totes in cages for water, the rose-magenta of LED grow lights seen through plastic at night, here rose). The twins: BOSSES'
places at the same frame and scale (the lock shop, the pipe shop) and the kit's own terminal and farm blocks beside them on
the map.
REUSE CHECK (REUSE-FIRST): BOSSES' frame for a whole place (bohemia_bosses_paint_four_to_six_11_3_26.capture: a ground plate
150 pixels across), its render through the map's rig, its over() and blob() for the beat frames and its colours; the district
hero factory's ground and Scene; this lane's 11/14 tool for the shared colours. Only the scenes and their lights are new.
ANALOG HORROR: two hundred buses with their doors open and one sign still lit; plastic houses that glow rose all night with a
door planked shut from the outside.
No reference game.
"""
import os, sys, json, math, pickle
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_bosses_map_pieces_finished_11_14_26 as C5      # this lane's: BOSSES' tools through it

ST, PB, C = C5.ST, C5.PB, C5.C
P4 = ST.P4
OUT = os.path.join(R, 'records/target/cook5_places')
DEST = os.path.join(R, 'slices/place_pieces')
STEEL, STEEL_DK, CONC, CONC_DK, ROOF, ROOF_DK, RUST, RUST_DK = PB.STEEL, PB.STEEL_DK, PB.CONC, PB.CONC_DK, PB.ROOF, PB.ROOF_DK, PB.RUST, PB.RUST_DK
LOT, DIRT_LOT, DARK_GLASS, LIT = PB.GROUND_LOT, PB.GROUND_DIRT, PB.DARK_GLASS, PB.LIT
CORR, CORR_DK = (136, 140, 138), (100, 104, 104)
BUS, BUS_DK, BAND = (214, 210, 198), (170, 166, 156), (44, 104, 142)
PACK, PACK_DK = (120, 124, 126), (84, 88, 90)
TYRE, SOOT, FRAME, WOOD, WOOD_DK = C5.TYRE, (40, 38, 36), C5.FRAME, (120, 88, 56), (86, 62, 40)
LINE = (150, 146, 132)
STRIPE = (46, 100, 138)
POLY, POLY_DK, POLY_LIT = (198, 206, 198), (150, 158, 152), (226, 170, 168)     # the plastic; lit rose from inside
HOOP = (112, 118, 114)
TOTE, CAGE = (222, 222, 214), (90, 94, 92)
GREEN, GREEN_DK = (76, 128, 62), (52, 92, 44)
CRATE, CRATE_DK = (138, 108, 70), (100, 78, 50)
ROSE = (255, 104, 118)                                        # the grow lights (not purple: r, then b under g + 25)


# ---------------------------------------------------------------------------------------------------- THE BUS YARD
def bus_y(s, x, y, L=5.0, lit=False, pack=True, burned=False, blocks=False):
    """a transit bus parked along y, nose toward +y (the camera sees its +x side and its nose): 1.7 wide, L long"""
    body, dk = (SOOT, (28, 26, 24)) if burned else (BUS, BUS_DK); z0 = 0.5 if blocks else 0.3
    if blocks:
        for yy in (y + 0.6, y + L - 1.2): s.box((x + 0.2, yy, 0), (1.3, 0.6, 0.5), C(WOOD_DK))            # up on cribbing
    else:
        for yy in (y + 0.7, y + L - 1.4): s.box((x + 1.66, yy, 0), (0.08, 0.8, 0.62), C(TYRE))            # its wheels
    s.box((x, y, z0), (1.7, L, 1.9), {'top': C(body), 'px': C(body), 'py': C(dk), 'nx': C(dk), 'ny': C(dk)})
    if not burned: s.box((x + 1.7, y, z0 + 0.25), (0.03, L, 0.34), C(BAND)); s.box((x, y + L, z0 + 0.25), (1.7, 0.03, 0.34), C(BAND))   # the transit band
    s.box((x + 1.7, y + 0.5, z0 + 0.95), (0.035, L - 1.0, 0.6), C(DARK_GLASS))                           # its windows
    s.box((x + 0.15, y + L, z0 + 0.85), (1.4, 0.035, 0.72), C(DARK_GLASS))                               # its windscreen
    s.box((x + 0.25, y + L, z0 + 1.62), (1.2, 0.04, 0.2), C((255, 176, 60) if lit else (22, 22, 22)))     # its sign
    if pack and not burned: s.box((x + 0.2, y + 0.5, z0 + 1.9), (1.3, L * 0.46, 0.34), {'top': C(PACK), 'px': C(PACK_DK), 'py': C(PACK_DK), 'nx': C(PACK_DK), 'ny': C(PACK_DK)})   # the battery pack on its roof
    else: s.box((x + 0.2, y + 0.5, z0 + 1.9), (1.3, L * 0.46, 0.05), C((30, 30, 30)))                    # where the pack was


def bus_x(s, x, y, L=5.0, lit=False):
    """the same bus parked along x, nose toward +x (the camera sees its +y side)"""
    for xx in (x + 0.7, x + L - 1.4): s.box((xx, y + 1.66, 0), (0.8, 0.08, 0.62), C(TYRE))
    s.box((x, y, 0.3), (L, 1.7, 1.9), {'top': C(BUS), 'px': C(BUS_DK), 'py': C(BUS), 'nx': C(BUS_DK), 'ny': C(BUS_DK)})
    s.box((x, y + 1.7, 0.55), (L, 0.03, 0.34), C(BAND)); s.box((x + L, y, 0.55), (0.03, 1.7, 0.34), C(BAND))
    s.box((x + 0.5, y + 1.7, 1.25), (L - 1.0, 0.035, 0.6), C(DARK_GLASS))
    s.box((x + L, y + 0.15, 1.15), (0.035, 1.4, 0.72), C(DARK_GLASS))
    s.box((x + L, y + 0.25, 1.92), (0.04, 1.2, 0.2), C((255, 176, 60) if lit else (22, 22, 22)))
    s.box((x + 0.5, y + 0.2, 2.2), (L * 0.46, 1.3, 0.34), {'top': C(PACK), 'px': C(PACK_DK), 'py': C(PACK_DK), 'nx': C(PACK_DK), 'ny': C(PACK_DK)})


BUS_SIGN = (3.75, 8.6, 2.02)                                  # the one whose sign is still lit
BAY_LIT = (4.3, 2.44, 1.3)                                    # the bay door the mechanics work behind


def the_bus_yard(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=LOT)
    for k in range(7): s.box((-1.3 + k * 2.1, 3.2, 0.0), (0.1, 5.6, 0.012), C(LINE))                      # the ranks' painted lines
    # the maintenance shed across the back: corrugated, its roll-up bays to the yard
    s.box((-1.6, -1.6, 0), (13.2, 4.0, 3.5), {'top': C(ROOF), 'px': C(CORR_DK), 'py': C(CORR), 'nx': C(CORR_DK), 'ny': C(CORR_DK)})
    s.box((-1.65, -1.65, 3.0), (13.3, 4.1, 0.5), {'top': C(ROOF_DK), 'px': C(STRIPE), 'py': C(STRIPE), 'nx': C(STRIPE), 'ny': C(STRIPE)})   # the transit band round its eaves
    for k in range(5):
        x0 = -1.0 + k * 2.55; lit = (k == 2)
        s.box((x0, 2.4, 0), (1.9, 0.04, 2.6), C((236, 190, 110) if lit else (30, 32, 34)))                # a bay (one lit: the mechanics who stayed)
        if not lit and k != 4:
            for j in range(4): s.box((x0, 2.44, 0.5 + j * 0.55), (1.9, 0.02, 0.06), C(CORR_DK))           # a door down, its slats
    s.box((7.9, 0.2, 3.5), (2.2, 1.6, 0.8), C(STEEL)); s.box((1.0, -0.6, 3.5), (1.6, 1.4, 0.6), C(STEEL))  # the roof's units
    s.prism(11.0, -0.6, 3.5, 0.3, 1.6, 8, C(STEEL_DK), C(SOOT))                                            # a flue
    # the ranks, nose out
    bus_y(s, -1.0, 3.5); bus_y(s, 1.1, 3.5, lit=False); bus_y(s, 3.2, 3.5, lit=True); bus_y(s, 5.3, 3.5, burned=True)
    bus_y(s, 7.4, 3.5, pack=False, blocks=True)                                                           # the one they pulled the pack from
    for k in range(3): s.box((9.6, 4.2 + 0.1 * k, k * 0.36), (1.5, 1.9, 0.34), {'top': C(PACK), 'px': C(PACK_DK), 'py': C(PACK_DK), 'nx': C(PACK_DK), 'ny': C(PACK_DK)})   # its pack, in three on a pallet
    s.box((9.5, 4.1, 0.0), (1.7, 2.2, 0.08), C(WOOD))
    for k in range(5): s.box((9.2 - 0.02 * k, 6.4 + k * 0.32, 0.02), (0.1, 0.34, 0.06), C((176, 46, 36)))  # a cable out of it
    bus_x(s, -1.2, 9.9); bus_x(s, 4.6, 9.9)                                                               # two more along the front
    s.box((10.6, 8.2, 0), (1.1, 1.1, 2.1), {'top': C(ROOF_DK), 'px': C(CORR), 'py': C(CORR_DK), 'nx': C(CORR_DK), 'ny': C(CORR_DK)}); s.box((11.7, 8.5, 1.0), (0.03, 0.5, 0.6), C(DARK_GLASS))   # the gate's hut
    return s


# ---------------------------------------------------------------------------------------------------- THE GREENHOUSES
HOUSES = (-0.5, 2.7, 5.9, 9.1)                                # the four houses' middle lines (y)
HX0, HX1, HW, HH = -1.6, 10.5, 1.35, 2.3                    # the houses fill the square (his 8/2 ruling); an apron 1.5 wide for the water and the crates


def hoop_house(s, yc, lit, planked=False):
    """a polythene tunnel along x: two walls, two shoulders, a crown; hoops every 1.2 m; an end wall with its door"""
    top = POLY_LIT if lit else POLY; side = (212, 176, 172) if lit else POLY_DK
    a, b, c, d = yc - HW, yc - HW * 0.55, yc + HW * 0.55, yc + HW; z1, z2 = HH * 0.6, HH
    s.quad((HX0, d, 0), (HX1, d, 0), (HX1, d, z1), (HX0, d, z1), C(side), (0, 1, 0))                      # the wall the camera sees
    s.quad((HX0, d, z1), (HX1, d, z1), (HX1, c, z2), (HX0, c, z2), C(top), (0, 0.6, 0.8))                 # its shoulder
    s.quad((HX0, c, z2), (HX1, c, z2), (HX1, b, z2), (HX0, b, z2), C(top), (0, 0, 1))                     # the crown
    s.quad((HX0, b, z2), (HX1, b, z2), (HX1, a, z1), (HX0, a, z1), C(side), (0, -0.6, 0.8))               # the far shoulder
    s.quad((HX1, a, 0), (HX1, d, 0), (HX1, d, z1), (HX1, a, z1), C(side), (1, 0, 0))                      # the end wall
    s.quad((HX1, a, z1), (HX1, d, z1), (HX1, c, z2), (HX1, b, z2), C(side), (1, 0, 0))
    x = HX0 + 0.1
    while x < HX1:                                             # the hoops
        s.quad((x, d + 0.02, 0), (x + 0.1, d + 0.02, 0), (x + 0.1, d + 0.02, z1), (x, d + 0.02, z1), C(HOOP), (0, 1, 0))
        s.quad((x, d + 0.02, z1), (x + 0.1, d + 0.02, z1), (x + 0.1, c, z2 + 0.02), (x, c, z2 + 0.02), C(HOOP), (0, 0.6, 0.8))
        s.quad((x, c, z2 + 0.02), (x + 0.1, c, z2 + 0.02), (x + 0.1, b, z2 + 0.02), (x, b, z2 + 0.02), C(HOOP), (0, 0, 1))
        x += 1.2
    s.box((HX1, yc - 0.45, 0), (0.04, 0.9, 1.5), C((250, 150, 150) if lit else (40, 44, 42)))              # the door
    s.box((HX1, yc - 0.55, 0), (0.05, 0.1, 1.6), C(FRAME)); s.box((HX1, yc + 0.45, 0), (0.05, 0.1, 1.6), C(FRAME)); s.box((HX1, yc - 0.55, 1.5), (0.05, 1.1, 0.1), C(FRAME))
    if planked:
        for z in (0.4, 0.9): s.box((HX1 + 0.05, yc - 0.7, z), (0.05, 1.4, 0.16), C(WOOD))                  # planked shut, from the outside


def tote(s, x, y):
    s.box((x, y, 0.12), (1.0, 1.0, 1.0), {'top': C(TOTE), 'px': C((196, 200, 196)), 'py': C(TOTE), 'nx': C((196, 200, 196)), 'ny': C((196, 200, 196))})
    for (dx, dy, w, dd) in ((0, 0, 1.0, 0.06), (0, 0.94, 1.0, 0.06), (0, 0, 0.06, 1.0), (0.94, 0, 0.06, 1.0)): s.box((x + dx, y + dy, 0), (w, dd, 1.16), C(CAGE))
    s.box((x - 0.04, y - 0.04, 0), (1.08, 1.08, 0.12), C(WOOD_DK))


def the_greenhouses(_after=False):
    H = PB.HF(); from bohemia_iso3d import Scene
    s = Scene()
    H._ground(s, (-2, -2, 12, 12), groundc=DIRT_LOT)
    for i, yc in enumerate(HOUSES): hoop_house(s, yc, lit=(i in (1, 2, 3)), planked=(i == 2))
    for y in (0.2, 1.6, 6.4): tote(s, 10.85, y)                                                             # the water, in its cages
    s.box((10.6, 3.2, 0), (1.3, 0.2, 0.2), C(STEEL_DK)); s.box((11.3, 0.4, 1.16), (0.12, 3.0, 0.12), C(STEEL_DK))   # the pipe that feeds the houses
    for k in range(3):                                         # the crates of greens by the way in
        for j in range(2 if k < 2 else 1):
            s.box((10.7 + 0.62 * j, 8.6 + 0.1 * k, k * 0.42), (0.6, 1.0, 0.4), {'top': C(GREEN), 'px': C(CRATE_DK), 'py': C(CRATE), 'nx': C(CRATE_DK), 'ny': C(CRATE_DK)})
    s.box((10.7, 10.4, 0), (1.2, 1.1, 0.5), {'top': C(GREEN_DK), 'px': C(WOOD_DK), 'py': C(WOOD), 'nx': C(WOOD_DK), 'ny': C(WOOD_DK)})   # a bed outside, what they could not fit
    return s


PLACES = {'the_bus_yard': the_bus_yard, 'the_greenhouses': the_greenhouses}
SAY = {'the_bus_yard': 'THE BUS YARD', 'the_greenhouses': 'THE GREENHOUSES'}
LIKE = {'the_bus_yard': 'terminal', 'the_greenhouses': 'farm'}


def moving(sc, frame):
    """what moves on the beat: the lit bay and the one bus's sign; the rose light in the plastic, one house then the next"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: PB.proj(sc, p); key = sc['key']
    if key == 'the_bus_yard':
        x, y = PJ(BAY_LIT); blob(L, x, y, 7.0, (255, 200, 120), 0.4 if frame else 0.26)
        x, y = PJ(BUS_SIGN); blob(L, x, y, 2.4, (255, 180, 70), 0.95 if frame else 0.3)
    elif key == 'the_greenhouses':
        for i, yc in enumerate(HOUSES):
            if i == 0: continue
            for xx in (0.5, 4.3, 8.2):
                x, y = PJ((xx, yc + HW * 0.5, HH * 0.85)); blob(L, x, y, 9.0, ROSE, (0.3 if (i % 2) == frame else 0.16))
            x, y = PJ((HX1 + 0.1, yc, 0.8)); blob(L, x, y, 3.2, ROSE, 0.7 if (i % 2) == frame else 0.4)
    return L


def scenes():
    os.makedirs(OUT, exist_ok=True); S = []
    P4.PLACES.update(PLACES)                                  # P4's capture asks its own table whether a name is a place (in memory)
    for n, f in PLACES.items():
        sc = P4.capture(n, f, False, PB.PLATE_PX); sc['key'] = n; sc['district'] = 'place_' + n; S.append(sc)
        print('  %-18s %dx%d anchor %d,%d, %d faces' % (n, sc['w'], sc['h'], sc['bx'], sc['by'], len(sc['faces'])))
    pickle.dump(S, open(os.path.join(OUT, 'scenes.pkl'), 'wb'))
    print('captured', len(S), 'scenes')


def render():
    ST.OUT = OUT; os.makedirs(os.path.join(OUT, 'masters'), exist_ok=True)
    ST.render()


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb')); os.makedirs(DEST, exist_ok=True)
    mp = os.path.join(DEST, 'place_pieces.json')
    man = json.load(open(mp)) if os.path.exists(mp) else {
        'about': "THE PLACES WEAR THEIR OWN PIECE (COOK FIVE 11/17, VAMILY rules 453, 408, 409(c)). A real place (records/target/bb/real_places.json, by its id) "
                 "drawn on its own block of the map by slices/bohemia_place_pieces.js, over the kit art of the kind it is like. bx/by = the block's ground "
                 "centre in the picture, plate = the ground plate across in picture pixels (the game scales it to the block, times 'wide'), frames = the "
                 "two beat frames. Made by tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py through the map's rig. A modder adds a place's "
                 "id and its pictures here and it is drawn; a place with no entry wears its kind's kit art as before.",
        'lane': 'cook 5', 'wide': 1.3, 'min_css': 46, 'min_block_px': 10, 'pictures': {}}
    for sc in S:
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        if not os.path.exists(fn): raise SystemExit('not rendered: ' + sc['district'])
        base = np.asarray(Image.open(fn).convert('RGBA')).astype(np.float64); key = sc['key']
        for fr in (0, 1):
            im = Image.fromarray(PB.over(base, moving(sc, fr)).round().clip(0, 255).astype(np.uint8), 'RGBA')
            im.save(os.path.join(DEST, '%s_%d.webp' % (key, fr)), 'WEBP', lossless=True, method=6, exact=True)
        man['pictures'][key] = dict(w=sc['w'], h=sc['h'], bx=sc['bx'], by=sc['by'], plate=sc['plate'], frames=['%s_0.webp' % key, '%s_1.webp' % key],
                                    name=SAY[key], like=LIKE[key], through_the_rig=True, finished='cook 5, 11/17')
        print('  %-18s %dx%d anchor %d,%d  %d + %d bytes' % (key, sc['w'], sc['h'], sc['bx'], sc['by'], os.path.getsize(os.path.join(DEST, key + '_0.webp')), os.path.getsize(os.path.join(DEST, key + '_1.webp'))))
    json.dump(man, open(mp, 'w'), indent=1)


def sheet(shots, name='COOK5_THE_BUS_YARD_AND_THE_GREENHOUSES_11_17', keys=None, card='cook5-the-bus-yard-and-the-greenhouses-11-17'):
    """the VOTE card's picture: each place's piece at three times its pixels, and the map on his phone with the piece off and on
    (<shots>/<id>_off.png, <id>_on.png, from tools/bohemia_the_place_pieces_on_the_page_11_17_26.js)"""
    from PIL import Image, ImageDraw, ImageFont
    keys = keys or list(PLACES); man = json.load(open(os.path.join(DEST, 'place_pieces.json')))['pictures']
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1290; INK_, DIM, BG, ROAD = (232, 222, 196), (150, 140, 118), (16, 14, 12), (74, 70, 64); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK_)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    first_row = None
    for key in keys:
        title(man[key]['name'] + ', ITS OWN PIECE', 'left: the piece at three times its pixels. right: the map on his phone, the kit art it wore (' + man[key]['like'] + ') and its own piece')
        im = Image.open(os.path.join(DEST, key + '_1.webp')).convert('RGBA'); big = im.resize((im.width * 3, im.height * 3), Image.NEAREST)
        cw = 500; a = Image.open(os.path.join(shots, key + '_off.png')).convert('RGB'); b = Image.open(os.path.join(shots, key + '_on.png')).convert('RGB')
        pg = json.load(open(os.path.join(shots, 'page_phone_portrait.json')))['places'][key]; q = pg['on_shot']; kk = a.width / float(pg['shot_points'][0])
        cx, cy = (q['x'] + q['w'] / 2.0) * kk, (q['y'] + q['h'] * 0.62) * kk; half = 105 * kk                      # 210 points of the map round the piece
        box = (int(max(0, min(a.width - 2 * half, cx - half))), int(max(0, min(a.height - 2 * half, cy - half)))); box = box + (int(box[0] + 2 * half), int(box[1] + 2 * half))
        sw = (WID - cw - 20) // 2; sh = sw; ch = max(big.height + 20, sh + 26)
        r = Image.new('RGB', (WID, ch), BG); d = ImageDraw.Draw(r); cell = Image.new('RGBA', (cw, ch), ROAD + (255,)); cell.alpha_composite(big, ((cw - big.width) // 2, (ch - big.height) // 2)); r.paste(cell.convert('RGB'), (0, 0))
        d.text((cw + 14, 4), 'BEFORE: THE KIT ART IT WORE', font=font(14), fill=INK_); r.paste(a.crop(box).resize((sw, sh), Image.LANCZOS), (cw + 10, 26))
        d.text((cw + sw + 24, 4), 'NOW: ITS OWN PIECE', font=font(14), fill=INK_); r.paste(b.crop(box).resize((sw, sh), Image.LANCZOS), (cw + sw + 20, 26))
        rows.append(r)
        if first_row is None: first_row = len(rows) - 1
    out = Image.new('RGB', (WID, sum(q.height + 8 for q in rows)), BG); y = 0; fy = 0
    for i, q in enumerate(rows):
        out.paste(q, (0, y))
        if i == first_row: fy = y
        y += q.height + 8
    dst = os.path.join(R, 'records/target/%s.webp' % name); out.save(dst, 'WEBP', quality=76, method=6)
    first = out.crop((0, fy, 500, fy + rows[first_row].height)); first.save(os.path.join(R, 'records/target/vote_first/%s.webp' % card), 'WEBP', quality=82, method=6)
    print('sheet', out.size, os.path.getsize(dst), 'first at', (0, fy, 500, rows[first_row].height))


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'
    if cmd == 'scenes': scenes()
    elif cmd == 'render': render()
    elif cmd == 'finish': finish()
    elif cmd == 'sheet': sheet(a[1])
    else: print(__doc__)
