#!/usr/bin/env python3
"""BOHEMIA -- COMBAT MAPS 3 [every place its own board] 11/3/26 (rule 341, ask line 350; supersedes the narrow brief of 349).
Paolo 11/3: 'everything just looked exactly the same as the main suburb shit we have and then you gave a bunch of greenery to
the suburb, bro this is an economic apocalypse, nothing made them uniquely unique, nothing made them fun to do, no variety,
like true variety, it was just recycled hogwash... you're not done.'

WHAT IT IS. Every place's fight board is its own board: its own plan built from that place (never the suburb's rows under a
new floor), its landmark you know in one look, its own things modelled through the master rig and standing on the honest
grid as cover and blockers with Battle Brothers' costs, one tactical twist that changes what a good turn is there (built from
the fight's own rules: height is accuracy (rule 321), cover on the tile (rule 170a), blockers that stop the shot, fences that
stop the step and not the shot, slow ground (BB rough and swamp), climb-or-attack (rule 328)), and where the two sides start
from the place (BB's line, its camp you walk into, its ambush). A place is a LANDMARK BLOCK (dealt between the two lines, in a
row the deal picks) and FIELD BLOCKS round it, each block a 60 m piece of five house tiles a side:
   '.' flat (BB flat, 2 AP)   'r' rough (BB forest floor, 3 AP)   'd' debris (BB snow, 3 AP)   'w' water (BB swamp)
   'H' height (+1 level)      '#' blocked (BB's rock and tree: no step, no shot through)
and on top of the tile, what stands on it (its MARK):
   'C' cover (a man there hides behind it)   'c' low cover   'X' a fenced tile: no step, the shot goes through (chain link)
   '-' nothing.
Every 'X', 'C' and 'c' is a named piece modelled INTO its block's picture (cover_extra, baked: no sprite of its own), every '#'
and 'H' has its mass drawn on it, and nothing tall stands on a '.' tile with no mark: the picture, the cost and what it does agree.

THE RIG SIDE renders through the same machinery as every fight block since 10/19 (the floor tool's ground, grid, heights and
stones; the not-final tool's junk and grime; the master rig's source pass, dents, one sun, film; the block camera, 2575 x
1820 at 42.92 px a metre), with COMBAT MAPS 2's grounds (tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py) as the
floor's materials, and COMBAT MAPS 1's scaffold (tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py) as the
plan-and-things hook. Only the present is rendered: the fight never reads the futures' pictures (measured: no line of
slices/BOHEMIA_FIGHT.html reads fight_ground.json's futures).

  /tmp/claude-0/v/bin/python tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py --render <bid> [--quick]
  python3 tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py --swap <bid> ...
  python3 tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py --data      (boards, pieces, roofs, ours.place_boards)
  venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy

REFERENCE CHECK (the 9/4 standing duty): the real places: a vivarium's outdoor run block and its decon line (the beasts are
lab-made, rule of 9/29), Harry Reid's general-aviation apron and a Beech 1900 on its belly, a Henderson country club's 18th and
its clubhouse gone to dust (AB 356, the valley's dead turf); every block beside its neighbours on the same camera, light and
ruler. No reference game outside its department: Battle Brothers for the terrain lesson only.
REUSE CHECK (REUSE-FIRST): no second renderer, no second material language, no second plan grid; the floor, not-final and
master rig tools render; COMBAT MAPS 2 lends its grounds; COMBAT MAPS 1 lends the hook and the swap; the fight's own rules
carry every twist (no new rule).
"""
import os, sys, json, math, time
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/fight_ground')
BASE = os.path.join(R, 'records/target/combat_maps_11_3')
OURS = os.path.join(R, 'records/target/bb/ours.json')
TM, BT = 12.0, 5

# ======================================================================================================================
# THE PLACES (all fifteen named, the built ones dealt; the data the gate and the fight read: ours.place_boards)
# ======================================================================================================================
PLACES = {
    'lab': dict(name='THE LAB YARD', districts=['medical'], built=True,
        landmark='THE PENS: a block of chain-link beast pens off the vivarium, one burst open from inside, its den door chewed',
        things='beast pens, gurneys, a decon shower line, the cold-store truck at the dock, biohazard drums, a dead ambulance',
        twist='LANES AND GATES: the pens are chain link, a shot goes through and a man does not, so the fight runs down one-tile '
              'lanes; shooters own it, melee has to find the gate',
        horror='one pen\'s water trough is full and clean, years after the last keeper; the burst pen\'s straw is dragged out the gate',
        landmark_block='lab.1', field=['lab.2', 'lab.3'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'camp': 2, 'line': 1}),
    'airport': dict(name='THE AIRPORT', districts=['airport', 'airbase', 'terminal'], built=True,
        landmark='THE WRECK: a twin-prop commuter on its belly in the middle of the apron, its tail broken off, the bags all over',
        things='the commuter wreck, the hangar, a fuel truck, a baggage cart train, the terminal\'s glass and a jet bridge stub',
        twist='A SHOOTER\'S GROUND: wide open slab, their line starts far off, and the wreck is the one big cover everybody wants; '
              'the hangar roof three storeys up',
        horror='one suitcase stands upright and packed on the bare slab, far from the wreck, its tag on',
        landmark_block='apron.1', field=['apron.0', 'apron.2'], rows={0: ['apron.3']}, mirror=True, landmark_col=1, landmark_rows={'1': 3, '2': 1},
        camp_tile=[4, 2], starts={'wide': 2, 'camp': 1, 'line': 1}),
    'golf': dict(name='THE GOLF COURSE', districts=['golf', 'park'], built=True,
        landmark='THE CLUBHOUSE AND THE 18TH: the stucco clubhouse, its torn awning over the patio, the carts in their row, the dead green and its flag',
        things='the clubhouse, golf carts, the flag on a dead green, a ball washer, bunkers, the dry water hazard, a stand of dead pines',
        twist='SAND AND ROOFS: the bunkers and the dry pond are slow ground in the open; the clubhouse roof is the one height, '
              'and they may come from both flanks (an ambush from the trees and the carts)',
        horror='the flag on the dead green stands straight out in a wind that moves nothing else',
        landmark_block='golf.1', field=['golf.2', 'golf.0'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'pincer': 1, 'wide': 1}),
    'trailer': dict(name='THE TRAILER PARK', districts=['trailer'], built=True,
        landmark='THE ROWS: single-wides on their blocks end to end, one burnt to its frame, a carport roof between two of them',
        things='trailers on blocks, propane tanks, a carport, a clothesline, a swing set, mailboxes, the park office and its laundry',
        twist='A MAZE: lanes one man wide between trailers you cannot see through, so it is close, melee ground and chokepoints; '
              'the carport roof is the one height, and they are often already in among the rows',
        horror='the swing on the A-frame hangs stopped at the top of its swing, nobody on it',
        landmark_block='trailer.1', field=['trailer.2', 'trailer.0'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'camp': 2, 'pincer': 1, 'line': 1}),
    'desert': dict(name='THE DESERT', districts=['desert'], built=True,
        landmark='THE PYLON: a high-voltage lattice tower fallen across a dry wash, its lines on the ground, Joshua trees round it',
        things='Joshua trees, boulders, a dead car half buried, the fallen pylon and its draped lines, the dry wash',
        twist='THE LOW GROUND: open flat desert cut by a dry wash between the lines; the wash is soft sand (slow), its banks a step up, '
              'so whoever holds a bank shoots down on whoever crosses; their line starts far off on the open flat',
        horror='one perfect bare circle of caliche on the flat, nothing growing in it, nothing on it',
        landmark_block='desert.1', field=['desert.3'], cols={1: ['desert.2']}, mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'wide': 2, 'line': 1, 'camp': 1}),
    'redrock': dict(name='RED ROCK', districts=['springs'], built=True,
        landmark='THE FIN AND THE SLOT: a sandstone fin split by a slot canyon one man wide, its flanks stepping up in ledges',
        things='the fin, ledges one, two and three storeys up, the slot canyon, slickrock terraces, boulders, a dead juniper',
        twist='REAL HEIGHT: ledges one, two and three storeys up (higher hits harder and sees farther, rule 321), a climb costs the '
              'turn\'s attack (rule 328), and the slot through the fin is one man wide',
        horror='a line of red handprints climbs the fin far higher than a man can reach',
        landmark_block='canyon.1', field=['canyon.2', 'canyon.0'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'camp': 1, 'pincer': 1}),
    'pass': dict(name='THE PASS', districts=['mountain'], built=True,
        landmark='THE JACKKNIFE: a semi folded across the road under the cut, a rockfall closing the rest of it',
        things='the switchback road, the guard rail, a rockfall, a jackknifed truck, the cut face and its scree, the drop',
        twist='A ROAD ON A SLOPE: the road is the only fast ground, the high side is slow scree and ledges, the low side the drop no '
              'man walks; the jackknife and the rockfall close the road to one lane',
        horror='the jackknifed truck\'s hazards still blink, years on',
        landmark_block='pass.1', field=['pass.2', 'pass.0'], rows={0: ['pass.3']}, mirror=True, landmark_col=1, landmark_rows={'1': 2, '2': 1},
        camp_tile=[4, 2], starts={'pincer': 2, 'line': 1}),
    'shore': dict(name='THE SHORE', districts=['reservoir', 'dam'], built=True,
        landmark='THE INTAKE TOWER: the lake\'s concrete intake standing high and dry on the cracked bed, a dead dock beside it',
        things='the intake tower, dead docks standing on dry land, a boat on its side, the mud and the last of the water, the white bathtub ring',
        twist='THE MUD: the receded lake\'s mud and its last shallows are swamp (slow, and a man fights worse standing in it); the '
              'white bathtub ring is a step up onto the old shore, and the docks are decks to climb',
        horror='a second bathtub ring runs far above the first, higher than the lake ever stood',
        landmark_block='lakebed.1', field=['lakebed.2'], rows={0: ['lakebed.2'], 2: ['lakebed.3']}, mirror=True, landmark_col=1, landmark_rows={'1': 1},
        camp_tile=[4, 2], starts={'line': 1, 'camp': 1, 'wide': 1}),
    'wash': dict(name='THE WASH', districts=['wash', 'basin'], built=True,
        landmark='THE CULVERT: the concrete flood channel running under a road embankment through three box barrels',
        things='the concrete channel, its high banks, the culvert, shopping carts, a sofa in the silt, a camp\'s tarps and tents on the bank',
        twist='THE CHANNEL: a low concrete channel between two high banks runs between the lines; its silt floor is slow, the banks '
              'are height, and the culvert is the one way through under the road: one man wide, and cover inside it',
        horror='a line of bare footprints walks into the culvert and none walks out',
        landmark_block='wash.2', field=['wash.4'], cols={1: ['wash.3']}, mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'pincer': 1, 'camp': 1}),
    'landfill': dict(name='THE LANDFILL', districts=['landfill'], built=False,
        landmark='the methane flare', things='trash mounds, a methane flare, a dead dozer',
        twist='the mounds are height; the flare\'s ground burns'),
    'suburb': dict(name='THE SUBURBS', districts=['suburb', 'estate', 'gated', 'town', 'school', 'chapel', 'library'], built=False,
        landmark='the empty pool in a walled backyard', things='cinder-block yard walls, empty pools, a cul-de-sac',
        twist='walls you fight along and over; an empty pool is a pit; brown dead lawns'),
    'strip': dict(name='THE STRIP', districts=['strip', 'casino', 'highroller', 'luxor', 'resort', 'convention', 'sign', 'sphere', 'strat'], built=False,
        landmark='a fallen casino sign', things='a dry fountain, a fallen casino sign, a pedestrian bridge',
        twist='the bridge is height over the boulevard; the fountain\'s rim is cover'),
    'downtown': dict(name='DOWNTOWN', districts=['downtown'], built=False,
        landmark='the canopy over the street', things='the canopy, the alleys',
        twist='under the canopy no shot from a roof; alleys one or two wide'),
    'works': dict(name='THE WORKS', districts=['industrial', 'rail', 'railyard', 'warehouse', 'storage'], built=False,
        landmark='the gantry over the rail cars', things='rail cars, a gantry, machines',
        twist='the rail cars are a wall of cover; the gantry is height'),
    'marina': dict(name='THE MARINA', districts=['water', 'intake'], built=False,
        landmark='the boats sitting on the dry bed', things='boats on the dry bed',
        twist='the boats are cover on open mud'),
}
GATE_DISTRICT = {'lab': 'medical', 'airport': 'airport', 'golf': 'golf', 'trailer': 'trailer', 'desert': 'desert', 'redrock': 'springs',
                 'pass': 'mountain', 'shore': 'reservoir', 'wash': 'wash', 'landfill': 'landfill', 'suburb': 'suburb', 'strip': 'strip',
                 'downtown': 'downtown', 'works': 'industrial', 'marina': 'water'}

# ======================================================================================================================
# THE PIECES (cover_extra, baked into their block's picture): what a man reads on the tile, what it does
# ======================================================================================================================
PIECES = {
    'lab_pen':      dict(kind='COVER', h=2.6, blocks_move=True, see_through=True, name='BEAST PEN, CHAIN LINK'),
    'lab_fence':    dict(kind='COVER', h=2.4, blocks_move=True, see_through=True, name='CHAIN-LINK RUN'),
    'lab_gurney':   dict(kind='LOW_COVER', h=0.9, name='GURNEYS'),
    'lab_decon':    dict(kind='COVER', h=2.4, name='DECON SHOWER'),
    'lab_drums':    dict(kind='LOW_COVER', h=0.9, name='BIOHAZARD DRUMS'),
    'lab_ambulance': dict(kind='COVER', h=2.6, name='DEAD AMBULANCE'),
    'apron_wreck':  dict(kind='COVER', h=2.2, name='THE WRECK, ITS WING'),
    'apron_tail':   dict(kind='LOW_COVER', h=1.2, name='THE TAIL, BROKEN OFF'),
    'apron_carts':  dict(kind='LOW_COVER', h=1.3, name='BAGGAGE CARTS'),
    'apron_tug':    dict(kind='COVER', h=1.6, name='DEAD TUG'),
    'apron_loader': dict(kind='LOW_COVER', h=1.4, name='BELT LOADER'),
    'golf_awning':  dict(kind='COVER', h=1.1, name='THE PATIO, UNDER THE AWNING'),
    'golf_carts':   dict(kind='LOW_COVER', h=1.2, name='GOLF CARTS'),
    'golf_shelter': dict(kind='COVER', h=2.4, name='RAIN SHELTER'),
    'golf_pines':   dict(kind='COVER', h=1.8, name='DEAD PINES'),
    'trailer_propane': dict(kind='LOW_COVER', h=1.2, name='PROPANE TANKS'),
    'trailer_car':  dict(kind='COVER', h=1.5, name='A CAR UNDER A TARP'),
    'trailer_junk': dict(kind='LOW_COVER', h=1.0, name='A YARD\'S JUNK'),
    'trailer_bins': dict(kind='COVER', h=1.4, name='DUMPSTERS'),
    'trailer_mail': dict(kind='LOW_COVER', h=1.2, name='MAILBOXES'),
    'desert_joshua': dict(kind='COVER', h=2.0, name='JOSHUA TREE'),
    'desert_boulder': dict(kind='COVER', h=1.6, name='BOULDERS'),
    'desert_rocks': dict(kind='LOW_COVER', h=0.8, name='ROCKS'),
    'desert_car':   dict(kind='LOW_COVER', h=0.9, name='DEAD CAR, HALF BURIED'),
    'desert_pylon': dict(kind='COVER', h=2.0, blocks_move=True, see_through=True, name='THE FALLEN PYLON'),
    'canyon_boulder': dict(kind='COVER', h=1.6, name='SANDSTONE BOULDERS'),
    'canyon_juniper': dict(kind='COVER', h=1.8, name='DEAD JUNIPER'),
    'pass_rail':    dict(kind='LOW_COVER', h=0.8, name='GUARD RAIL'),
    'pass_boulder': dict(kind='COVER', h=1.8, name='ROCKFALL BOULDER'),
    'pass_car':     dict(kind='LOW_COVER', h=1.2, name='DEAD CAR ON THE ROAD'),
    'pass_drop':    dict(kind='DROP', h=0.0, blocks_move=True, see_through=True, name='THE DROP'),
    'shore_boat':   dict(kind='COVER', h=2.0, name='A BOAT ON ITS SIDE'),
    'shore_junk':   dict(kind='LOW_COVER', h=0.9, name='BUOYS AND DRUMS'),
    'shore_car':    dict(kind='COVER', h=1.6, name='A TRUCK AND ITS BOAT TRAILER'),
    'wash_culvert': dict(kind='COVER', h=2.4, name='INSIDE THE CULVERT'),
    'wash_sofa':    dict(kind='LOW_COVER', h=0.8, name='A SOFA IN THE SILT'),
    'wash_carts':   dict(kind='LOW_COVER', h=1.0, name='SHOPPING CARTS'),
    'wash_tents':   dict(kind='LOW_COVER', h=1.2, name='A CAMP\'S TENTS'),
    'wash_car':     dict(kind='COVER', h=1.5, name='DEAD CAR ON THE BANK'),
    'wash_oleander': dict(kind='COVER', h=1.8, name='DEAD OLEANDERS'),
    'wash_fence':   dict(kind='COVER', h=2.0, blocks_move=True, see_through=True, name='CHAIN-LINK, THE CHANNEL\'S'),
}
MARK_PIECE = {}      # (bid, mark) -> piece, written per block below

# ======================================================================================================================
# THE BLOCKS: tiles (rows north to south), marks (the pieces), the ground, the roofs; the things are things_<bid>()
# ======================================================================================================================
BLOCKS = {
    # THE LAB YARD ---------------------------------------------------------------------------------------------------------
    'lab.1': dict(name='THE PENS', tiles=['.....', '.....', '.....', '..d..', '.....'],
                  marks=['X-X-X', 'X-X-X', '-c-c-', 'X---X', 'X-X-X'], pieces={'X': 'lab_pen', 'c': 'lab_gurney'}),
    'lab.2': dict(name='THE DOCK', tiles=['##H..', '.....', '##...', '.....', '.....'],
                  marks=['-----', '-c-C-', '-----', 'XX-XX', '--c--'], pieces={'X': 'lab_fence', 'c': 'lab_gurney', 'C': 'lab_decon'},
                  piece_at={(2, 4): 'lab_drums'}),
    'lab.3': dict(name='THE INTAKE LOT', tiles=['.....', '.....', '.....', '.....', '.....'],
                  marks=['-C--c', 'XX-XX', '-----', 'c--C-', '--XXX'], pieces={'X': 'lab_fence', 'C': 'lab_ambulance', 'c': 'lab_drums'},
                  piece_at={(0, 3): 'lab_gurney'}),
    # THE AIRPORT ----------------------------------------------------------------------------------------------------------
    'apron.1': dict(name='THE WRECK', tiles=['.....', '.....', '.##..', '.....', '.....'],
                    marks=['-----', '-CC--', '---c-', '-CC--', '-----'], pieces={'C': 'apron_wreck', 'c': 'apron_tail'}),
    'apron.2': dict(name='THE HANGAR', tiles=['HH...', 'HH...', '...#.', '.....', '.....'],
                    marks=['-----', '-----', '-----', '-ccc-', '-----'], pieces={'c': 'apron_carts'}, roofs=[(0, 0, 3), (1, 0, 3), (0, 1, 3), (1, 1, 3)]),
    'apron.3': dict(name='THE GATE', tiles=['#####', '..#..', '.....', '.....', '.....'],
                    marks=['-----', '-----', '---c-', '-C---', '-----'], pieces={'c': 'apron_loader', 'C': 'apron_tug'}),
    # THE GOLF COURSE ------------------------------------------------------------------------------------------------------
    'golf.1': dict(name='THE CLUBHOUSE', tiles=['.....', 'HH...', '.....', '...d.', '.....'],
                   marks=['-----', '-----', 'CCcc-', '-----', '-----'], pieces={'C': 'golf_awning', 'c': 'golf_carts'}, roofs=[(0, 1, 1), (1, 1, 1)]),
    'golf.2': dict(name='THE FAIRWAY', tiles=['.....', '.dd..', '.....', '..dd.', '.....'],
                   marks=['---C-', '-----', '-----', '-----', 'C----'], pieces={'C': 'golf_shelter'}, piece_at={(4, 0): 'golf_pines'}),
    # THE TRAILER PARK ----------------------------------------------------------------------------------------------------
    'trailer.1': dict(name='THE ROWS', tiles=['#.#.#', '#.#.d', '.....', '.#H#.', '.#.#.'],
                      marks=['-----', '-c---', 'c-C-c', '-----', 'c---c'], pieces={'c': 'trailer_propane', 'C': 'trailer_car'},
                      piece_at={(2, 0): 'trailer_junk', (4, 0): 'trailer_junk'}, roofs=[(2, 3, 1)]),
    'trailer.2': dict(name='THE OFFICE', tiles=['##...', '.....', '...#.', '.##..', '.....'],
                      marks=['-----', '--c-c', 'C----', '----c', '-c---'], pieces={'c': 'trailer_propane', 'C': 'trailer_bins'},
                      piece_at={(1, 2): 'trailer_mail', (3, 4): 'trailer_junk', (4, 1): 'trailer_junk'}),
    # THE DESERT ----------------------------------------------------------------------------------------------------------
    'desert.1': dict(name='THE PYLON', tiles=['HddH.', 'HddH.', 'Hdd..', 'HddH.', 'HddH.'],
                     marks=['----C', '---XX', '-cX--', '----C', '--c--'], pieces={'X': 'desert_pylon', 'C': 'desert_joshua', 'c': 'desert_rocks'}),
    'desert.2': dict(name='THE WASH', tiles=['HddH.', 'HddH.', 'HddH.', 'HddH.', 'HddH.'],
                     marks=['C----', '----C', '--c--', 'C---c', '-c---'], pieces={'C': 'desert_joshua', 'c': 'desert_rocks'},
                     piece_at={(4, 3): 'desert_car'}),
    'desert.3': dict(name='THE FLAT', tiles=['.....', '..r..', '.....', 'r....', '.....'],
                     marks=['-C---', '----c', 'C--C-', '-----', '--c-C'], pieces={'C': 'desert_joshua', 'c': 'desert_rocks'},
                     piece_at={(2, 3): 'desert_boulder', (4, 2): 'desert_car', (4, 4): 'desert_boulder'}),
    # RED ROCK ------------------------------------------------------------------------------------------------------------
    'canyon.1': dict(name='THE FIN AND THE SLOT', tiles=['.H#H.', '.H#H.', '.H.H.', '.H#H.', 'r.#.r'],
                     marks=['-----', '-----', '-----', '-----', 'c---c'], pieces={'c': 'canyon_boulder'},
                     roofs=[(1, 0, 2), (1, 1, 3), (3, 1, 2), (1, 2, 2), (3, 2, 3), (3, 3, 2)]),
    'canyon.2': dict(name='THE SLICKROCK', tiles=['..HH.', '.HH#.', '.....', '#..H.', '..r..'],
                     marks=['-----', '----C', 'c----', '-----', '----c'], pieces={'c': 'canyon_boulder', 'C': 'canyon_juniper'},
                     roofs=[(3, 0, 2), (2, 1, 2)]),
    # THE PASS ------------------------------------------------------------------------------------------------------------
    'pass.1': dict(name='THE JACKKNIFE', tiles=['rrH#r', 'r#rdr', '.##d.', '.....', 'rrrrr'],
                   marks=['-----', '---C-', '----c', 'cc-cc', 'VVVVV'], pieces={'C': 'pass_boulder', 'c': 'pass_rail', 'V': 'pass_drop'},
                   piece_at={(2, 4): 'pass_car'}),
    'pass.2': dict(name='THE ROAD', tiles=['rHrr#', 'rrrHr', '.....', '.....', 'rrdrr'],
                   marks=['-----', '-----', '--c--', 'c-cc-', 'VV-VV'], pieces={'c': 'pass_rail', 'V': 'pass_drop'},
                   piece_at={(2, 2): 'pass_car'}),
    'pass.3': dict(name='THE CUT', tiles=['#H#H#', 'rHrrH', 'rrHrr', 'r#rrr', 'rrrHr'],
                   marks=['-----', '-----', '-----', '----C', '-C---'], pieces={'C': 'pass_boulder'},
                   roofs=[(1, 0, 3), (3, 0, 2), (1, 1, 2), (4, 1, 2)]),
    # THE SHORE -----------------------------------------------------------------------------------------------------------
    'lakebed.1': dict(name='THE INTAKE TOWER', tiles=['wwwww', 'w.Hww', '..#..', 'ww.ww', 'ww.ww'],
                      marks=['-----', '-----', '-----', 'C---c', '---C-'], pieces={'C': 'shore_boat', 'c': 'shore_junk'}),
    'lakebed.2': dict(name='THE MUD', tiles=['wwwww', 'ww..w', 'w..ww', '..www', '.wwww'],
                      marks=['-----', '-C---', '-----', '---c-', '--c-C'], pieces={'C': 'shore_boat', 'c': 'shore_junk'}),
    'lakebed.3': dict(name='THE RING', tiles=['ww.ww', 'HHHHH', '.....', '.HH..', '..#..'],
                      marks=['-----', '-----', 'c---c', '-----', 'C----'], pieces={'c': 'shore_junk', 'C': 'shore_car'}),
    # THE WASH ------------------------------------------------------------------------------------------------------------
    'wash.2': dict(name='THE CULVERT', tiles=['H.r.H', 'H.r.H', 'H#.#H', 'H.r.H', 'H.r.H'],
                   marks=['-c---', '-----', '--C--', '---c-', '--c--'], pieces={'C': 'wash_culvert', 'c': 'wash_carts'},
                   piece_at={(2, 4): 'wash_sofa'}),
    'wash.3': dict(name='THE CHANNEL', tiles=['H.r.H', 'H.r.H', 'H.r.H', 'H.r.H', 'H.r.H'],
                   marks=['---c-', '--c--', '-----', '-c---', '-----'], pieces={'c': 'wash_carts'},
                   piece_at={(2, 1): 'wash_sofa'}),
    'wash.4': dict(name='THE BANK', tiles=['.....', '..#..', '.....', '.....', '.....'],
                   marks=['-c--C', '-----', 'c---c', '--C--', 'X---X'], pieces={'c': 'wash_tents', 'C': 'wash_oleander', 'X': 'wash_fence'},
                   piece_at={(2, 3): 'wash_car'}),
}
CODE = {'.': 'flat', 'r': 'rough', 'd': 'debris', 'w': 'water', 'H': 'height', '#': 'blocked'}


def piece_of(bid, c, r):
    B = BLOCKS[bid]; m = B['marks'][r][c]
    if m == '-': return None
    return (B.get('piece_at') or {}).get((r, c)) or B['pieces'][m]


def tile_m(c, r):
    """a tile's box in metres: x0, x1, y0 (south), y1 (north)"""
    return c * TM, (c + 1) * TM, 60.0 - (r + 1) * TM, 60.0 - r * TM


def centre(c, r):
    x0, x1, y0, y1 = tile_m(c, r); return (x0 + x1) / 2, (y0 + y1) / 2


# ======================================================================================================================
# THE RIG SIDE (only under Blender's python)
# ======================================================================================================================
def rig():
    import bohemia_combat_maps_new_blocks_through_the_rig_11_2_26 as NB
    import bohemia_combat_maps_every_ground_its_own_11_2_26 as EG
    NF, F = NB.rig()
    return NB, EG, NF, F


def plan(bid, F):
    """the ground per pixel, from the block's tiles and what stands on them (COMBAT MAPS 2's grounds by name)"""
    NB, EG, NF, _ = rig()
    ID = EG.ID
    W, H = F.W, F.H
    yy, xx = np.mgrid[0:H, 0:W]
    xm = (xx + 0.5) / F.PPM; ym = F.SIDE * (1 - (yy + 0.5) / H)
    rng = np.random.RandomState(sum(map(ord, bid)) + 311)
    n1 = F.vnoise((H, W), 3.0 * F.PPM, rng); n2 = F.vnoise((H, W), 0.9 * F.PPM, rng); n3 = F.vnoise((H, W), 9.0 * F.PPM, rng)
    col = np.clip((xm // TM).astype(int), 0, 4); row = np.clip(((60.0 - ym) // TM).astype(int), 0, 4)
    T = BLOCKS[bid]['tiles']; M = BLOCKS[bid]['marks']
    code = np.array([[T[r][c] for c in range(5)] for r in range(5)])[row, col]
    mark = np.array([[M[r][c] for c in range(5)] for r in range(5)])[row, col]
    # the ground's edge between two tiles wanders up to 2.4 m (a patch of mud or crust has no square edge; the fight's tile is still
    # the tile, only the ground's colour wanders, never a mass), for the places where nothing square stands
    wx = F.vnoise((H, W), 4.0 * F.PPM, rng); wy = F.vnoise((H, W), 4.0 * F.PPM, rng)
    wx = np.clip((wx - wx.mean()) / (wx.std() + 1e-6), -2, 2) * 1.2; wy = np.clip((wy - wy.mean()) / (wy.std() + 1e-6), -2, 2) * 1.2
    colw = np.clip(((xm + wx) // TM).astype(int), 0, 4); roww = np.clip(((60.0 - ym + wy) // TM).astype(int), 0, 4)
    if bid.split('.')[0] in ('desert', 'canyon', 'pass', 'lakebed', 'golf'):
        code = np.array([[T[r][c] for c in range(5)] for r in range(5)])[roww, colw]
        mark = np.array([[M[r][c] for c in range(5)] for r in range(5)])[roww, colw]
    vein = lambda nz, w: np.abs(nz - np.median(nz)) < w                    # a wandering line (a contour of smooth noise)
    fx = xm - col * TM; fy = (60.0 - ym) - row * TM                       # metres inside the tile, from its north-west corner
    band = lambda a, b: (ym >= a) & (ym < b)
    gid = np.full((H, W), ID['concrete'], np.uint8)
    kind = bid.split('.')[0]
    if kind == 'lab':
        gid[:] = ID['epoxy']                                                # the vivarium yard: sealed epoxy
        gid[(n3 > 0.62)] = ID['oilcrete']                                   # where the sealer wore through
        pen = (mark == 'X')
        gid[pen] = ID['concrete']                                           # each pen's pad
        gid[pen & (np.abs(fx - 6) < 3.2) & (np.abs(fy - 6.5) < 2.4) & (n2 > 0.1)] = ID['gravel']   # its straw-and-grit floor
        ln = (mark != 'X') & (code == '.')
        gid[ln & (((fx < 0.35) | (fx > 11.65)) & (np.abs(fy - 6) < 6))] = ID['hazard']             # lane edge stripes
        gid[code == 'd'] = ID['gravel']
        if bid == 'lab.2':
            gid[band(48, 60)] = ID['concrete']; gid[band(37.0, 38.2) & (xm < 36)] = ID['hazard']    # the dock apron and its stop line
            gid[(np.abs(xm - 42) < 5.5) & (np.abs(ym - 42) < 5.5)] = ID['hazard']                  # the decon pad
            gid[(np.abs(xm - 42) < 4.6) & (np.abs(ym - 42) < 4.6)] = ID['epoxy']
        if bid == 'lab.3':
            gid[:] = ID['asphalt']; gid[(n3 > 0.55)] = ID['oilcrete']        # the intake lot
            gid[((xm % 6.0) < 0.12) & band(36, 48)] = ID['paint']           # the bay lines
            gid[mark == 'X'] = ID['gravel']
            gid[band(26.0, 34.0)] = ID['concrete']                          # the drive through the gate
    elif kind == 'apron':
        gid[:] = ID['apronslab']                                            # Harry Reid's slabs (6 m joints by the plate)
        gid[(n3 > 0.7)] = ID['oilcrete']                                    # where aircraft stood and leaked
        gid[band(29.85, 30.15) & (xm > 40)] = ID['hazard']                  # the taxi lane's yellow centre line
        gid[(np.abs(xm % 12.0 - 6.0) < 0.12) & (ym < 12.0)] = ID['hazard']  # the stand lead-in lines
        if bid == 'apron.1':                                                # the fuel spill under the wreck
            spill = ((xm - 24) / 11.0) ** 2 + ((ym - 29) / 7.0) ** 2 < 1.0 + 0.35 * n1
            gid[spill] = ID['oilcrete']
            gid[spill & (n2 > 0.55)] = ID['tiedown']
        if bid == 'apron.2':
            gid[band(36, 60) & (xm < 24.5)] = ID['concrete']                # the hangar's floor
            gid[band(33.0, 36.0) & (xm < 24.5)] = ID['hazard']              # its door track
        if bid == 'apron.3':
            gid[band(48, 60)] = ID['concrete']                              # the terminal's footing
            gid[band(45.0, 45.25)] = ID['hazard']                           # the equipment restraint line
    elif kind == 'golf':
        gid[:] = ID['fairway']                                              # the dead fairway, grey-brown thatch (AB 356)
        gid[((ym + 1.2 * n1) % 9.0) < 4.5] = ID['fairway_b']                 # the old mowing bands, faint (never a camouflage: 10/19)
        gid[n3 > 0.74] = ID['caliche']                                      # where the turf gave out to the dirt under it, broad
        pond_t = {'golf.2': [(2, 3), (3, 3)]}.get(bid, [])
        dt = [(c, r) for r in range(5) for c in range(5) if T[r][c] == 'd' and (c, r) not in pond_t]
        sand = np.zeros((H, W), bool)
        for (c, r) in dt:                                                   # a bunker is a shape, most of its tile, never a square
            cx, cy = centre(c, r)
            sand |= ((xm - cx) / 5.3) ** 2 + ((ym - cy) / 4.7) ** 2 < 1.0 + 0.25 * n2
            if (c + 1, r) in dt:
                sand |= ((xm - cx - 6) / 5.0) ** 2 + ((ym - cy + 1.2) / 3.4) ** 2 < 1.0 + 0.2 * n2
        gid[sand] = ID['bunker']
        gid[band(28.4, 31.6) & (xm > 4)] = ID['concrete']                   # the cart path
        if bid == 'golf.1':
            green = ((xm - 33) / 9.0) ** 2 + ((ym - 7.0) / 5.6) ** 2 < 1.0 + 0.05 * n2
            gid[green] = ID['deadlawn_b']                                   # the 18th green: dead, smooth, still rolled
            gid[band(24, 37) & (xm < 24)] = ID['pooltile']                   # the patio under the awning
            gid[band(24, 37) & (xm < 24) & (n2 > 0.4)] = ID['concrete']
            gid[band(37, 48) & (xm < 24.5)] = ID['concrete']                # the clubhouse's footing
        if bid == 'golf.2':
            pond = ((xm - 36) / 11.0) ** 2 + ((ym - 18) / 5.4) ** 2 < 1.0 + 0.1 * n1
            gid[pond] = ID['mud']                                           # the dry water hazard's cracked bed
            gid[pond & (((xm - 36) / 10.0) ** 2 + ((ym - 18) / 4.6) ** 2 > 1.0)] = ID['tie']   # its torn liner's edge
            gid[(xm < 13) & (ym < 12)] = ID['caliche']                      # under the dead pines, the needles and the dirt
    elif kind == 'trailer':
        gid[:] = ID['gravel']                                               # the park's gravel lots
        gid[(n3 > 0.55)] = ID['caliche']
        gid[(code == '.') & (((fx > 3) & (fx < 9)) | ((fy > 3) & (fy < 9))) & (mark == '-') & (n2 > 0.3)] = ID['track']   # worn paths
        gid[(code == '#') | (code == 'H')] = ID['concrete']                 # the pads under the homes and the carport
        gid[code == 'd'] = ID['rubbleg']                                     # the burnt one's ash and rubble
        if bid == 'trailer.1': gid[band(26.0, 34.0)] = ID['asphalt']; gid[band(26.0, 34.0) & (n1 > 0.4)] = ID['gravel']   # the lane, patched
        if bid == 'trailer.2': gid[band(36, 60) & (xm < 25)] = ID['asphalt']; gid[band(36.4, 36.6) & (xm < 25)] = ID['paint']
    elif kind == 'desert':
        gid[:] = ID['pavement']                                             # varnished desert pavement, never the yellow sand
        gid[(n3 > 0.7)] = ID['calcrete']                                    # caliche crust showing through, broad
        washc = (code == 'd')
        gid[washc] = ID['silt']                                             # the wash: pale silt, cobble bars running down it
        gid[washc & vein(n3, 0.045)] = ID['cobble']                        # its braided channels
        gid[washc & vein(n1, 0.035)] = ID['cobble']
        if bid == 'desert.3':                                               # the one perfect bare circle of caliche (the horror)
            gid[(xm - 36) ** 2 + (ym - 42) ** 2 < 3.2 ** 2] = ID['caliche']
    elif kind == 'canyon':
        gid[:] = ID['redsand']
        gid[(code == 'H') | (code == '#')] = ID['slickrock']
        gid[(code == '.') & (n3 > 0.62)] = ID['slickrock']                  # bare slickrock sheets in the open, broad
    elif kind == 'pass':
        gid[:] = ID['scree']                                                # limestone scree
        gid[(code == '.') & (row >= 2) & (row <= 3)] = ID['gravel']
        gid[band(25.0, 34.8)] = ID['asphalt'] if bid in ('pass.1', 'pass.2') else gid[band(25.0, 34.8)]
        if bid in ('pass.1', 'pass.2'):
            gid[band(23.6, 25.0) | band(34.8, 36.2)] = ID['gravel']         # the shoulders
            gid[band(25.25, 25.4) | band(34.4, 34.55)] = ID['paint']         # the fog lines
        gid[mark == 'V'] = ID['tie']                                         # the drop: falling away into its own shadow
    elif kind == 'lakebed':
        gid[:] = ID['mud']                                                  # the cracked bed
        gid[code == '.'] = ID['cobble']                                     # the old gravel bar: the firm way through the mud
        if bid == 'lakebed.2': gid[(row == 0) & (fy > 2.0 + 2.0 * n1)] = ID['mud']
        if bid == 'lakebed.3':
            gid[band(36, 48)] = ID['ring']                                  # the white bathtub ring
            gid[band(53.2, 54.0)] = ID['ring']                              # and the second, higher than the lake ever stood (horror)
            gid[ym < 36] = ID['cobble']; gid[(ym < 24) & (np.abs(xm - 30) < 7)] = ID['concrete']   # the old shore, the launch ramp
            gid[band(48, 60) & (code == 'w')] = ID['mud']
    elif kind == 'wash':
        gid[:] = ID['pavement'] if bid == 'wash.4' else ID['concrete']
        if bid == 'wash.4':
            gid[(n3 > 0.62)] = ID['gravel']; gid[mark == 'X'] = ID['gravel']
        else:
            gid[code == 'r'] = ID['silt']                                   # the channel's floor: silt over the concrete
            gid[(code == 'r') & (n2 > 0.5)] = ID['cobble']
            gid[(code == '.') & (n3 > 0.5)] = ID['oilcrete']                # the channel's sloped concrete, stained
    return gid, np.ones((H, W), bool), np.full((H, W), 255, np.uint8), np.zeros((H, W, 3), np.uint8), np.zeros((H, W), bool)


# ---- templates (every face a quad, as the not-final tool's instancer wants) ------------------------------------------
def prism(n, axis='z'):
    a = np.arange(n) * (2 * np.pi / n) + np.pi / n
    if axis == 'z':
        v = [[0.5 * math.cos(t), 0.5 * math.sin(t), z] for z in (0, 1) for t in a]
    else:                                                        # along x, sitting on z 0, unit diameter
        v = [[x, 0.5 * math.cos(t), 0.5 + 0.5 * math.sin(t)] for x in (-0.5, 0.5) for t in a]
    f = [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    for i in range(1, n - 2, 2):                                 # the caps as a fan of quads (n even)
        f.append([0, i + 2, i + 1, i]); f.append([n, n + i, n + i + 1, n + i + 2])
    return np.array(v, np.float32), np.array(f, np.int32)


def gable():
    """a pitched roof (or a wedge): base 1 x 1 on z 0, ridge along x at z 1"""
    v = [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.02, 1], [0.5, -0.02, 1], [0.5, 0.02, 1], [-0.5, 0.02, 1]]
    f = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]]
    return np.array(v, np.float32), np.array(f, np.int32)


class Kit:
    """the things of one block: boxes, prisms, horizontal tubes, gables, rocks; one instanced mesh per material"""
    def __init__(self, bpy, NF, F, g, h, seed):
        self.bpy, self.NF, self.F, self.g, self.h = bpy, NF, F, g, h
        self.rng = np.random.RandomState(seed); self.M = {}; self.items = {}; self.rocks = {}
        self.T = {'box': (NF.CUBE_V, NF.CUBE_F), 'cyl': prism(12), 'tube': prism(12, 'x'), 'gable': gable(), 'cyl6': prism(6)}
    def z(self, x, y):
        F = self.F; ny, nx = self.g.shape
        c = int(round((x + 1.0) / F.STEP)); r = int(round(((F.SIDE + 1.0) - y) / F.STEP))
        return float(self.h[min(max(r, 0), ny - 1), min(max(c, 0), nx - 1)])
    def rgb(self, name, c, role='clay_bone', alpha=None):
        if name not in self.M:
            m = self.NF.srgb_mat(self.bpy, name, c, role)
            if alpha is not None:
                b = m.node_tree.nodes['Principled BSDF']; b.inputs['Alpha'].default_value = alpha
                try: m.blend_method = 'BLEND'
                except Exception: pass
            self.M[name] = m
        return name
    def mat(self, name, role, step, mul=1.0):
        if name not in self.M: self.M[name] = self.NF.material(self.bpy, name, role, step, mul)
        return name
    def put(self, tpl, m, x, y, z, sx, sy, sz, rz=0.0, tilt=0.0):
        self.items.setdefault((tpl, m), []).append((x, y, z, sx, sy, sz, rz, tilt))
    def box(self, m, x, y, z, sx, sy, sz, rz=0.0, tilt=0.0): self.put('box', m, x, y, z, sx, sy, sz, rz, tilt)
    def cyl(self, m, x, y, z, d, hgt, rz=0.0): self.put('cyl', m, x, y, z, d, d, hgt, rz)
    def tube(self, m, x, y, z, length, d, rz=0.0, tilt=0.0): self.put('tube', m, x, y, z, length, d, d, rz, tilt)
    def roof(self, m, x, y, z, sx, sy, sz, rz=0.0): self.put('gable', m, x, y, z, sx, sy, sz, rz)
    def rock(self, m, x, y, s, flat=0.6, sink=0.25, z=None):
        L = self.rocks.setdefault((m, flat), ([], [], []))
        L[0].append((x, y)); L[1].append(s); L[2].append((self.z(x, y) if z is None else z) - s * flat * sink)
    def scatter(self, m, x0, x1, y0, y1, n, lo, hi, flat=0.6):
        for _ in range(n): self.rock(m, self.rng.uniform(x0, x1), self.rng.uniform(y0, y1), lo * (hi / lo) ** (self.rng.rand() ** 1.5), flat)
    def line(self, m, x0, y0, x1, y1, w, hgt, z=0.0):
        """a straight bar from one point to another (a rail, a hose, a strap), w wide and hgt tall"""
        L = math.hypot(x1 - x0, y1 - y0); self.box(m, (x0 + x1) / 2, (y0 + y1) / 2, z, L, w, hgt, math.atan2(y1 - y0, x1 - x0))
    def objects(self, ico):
        bpy, NF, F = self.bpy, self.NF, self.F; out = []
        for (tpl, m), items in self.items.items():
            if m not in self.M: self.mat(m, 'tape_grey', 2)
            out.append(NF.instances(bpy, 'cm3_%s_%s' % (tpl, m), self.T[tpl], items, self.M[m]))
        for (m, flat), (pts, sizes, zs) in self.rocks.items():
            if not pts: continue
            if m not in self.M: self.rgb(m, (120, 114, 104))
            out.append(F.stones_mesh(bpy, 'cm3_rock_' + m, np.array(pts, np.float32), np.array(sizes, np.float32), np.array(zs, np.float32), self.rng, ico, self.M[m], flat))
        return [o for o in out if o is not None]


# ---- the things, by kind ---------------------------------------------------------------------------------------------
def chainlink(k, x0, y0, x1, y1, hgt=2.6, gate=None, wire=True, torn=None):
    """a chain-link run round a rectangle (metres): posts every 3 m, a top rail, the mesh (seen through), razor wire on top.
    gate: the side ('s','n','e','w') with a closed gate panel; torn: the side burst outward (panels down on the ground)"""
    k.rgb('post', (120, 122, 120), 'tape_grey'); k.rgb('mesh', (150, 154, 152), 'tape_grey', alpha=0.34); k.rgb('razor', (176, 178, 176), 'chrome')
    sides = {'s': (x0, y0, x1, y0), 'n': (x0, y1, x1, y1), 'w': (x0, y0, x0, y1), 'e': (x1, y0, x1, y1)}
    for s, (ax, ay, bx_, by_) in sides.items():
        L = math.hypot(bx_ - ax, by_ - ay); n = max(1, int(round(L / 3.0))); ang = math.atan2(by_ - ay, bx_ - ax)
        if torn and s in torn:                                   # the panels lie on the ground, pushed out, the posts bent out
            nx_, ny_ = (0, -1) if s == 's' else (0, 1) if s == 'n' else (-1, 0) if s == 'w' else (1, 0)
            for i in range(n + 1):
                px, py = ax + (bx_ - ax) * i / n, ay + (by_ - ay) * i / n
                lean = 0.5 + 0.6 * k.rng.rand() if 0 < i < n else 0.15
                k.line('post', px, py, px + nx_ * hgt * math.sin(lean), py + ny_ * hgt * math.sin(lean), 0.09, 0.09, 0.0)
                k.cyl('post', px, py, 0.0, 0.1, hgt * math.cos(lean) * 0.5)
            mx, my = (ax + bx_) / 2 + nx_ * hgt * 0.45, (ay + by_) / 2 + ny_ * hgt * 0.45
            k.box('mesh', mx, my, 0.05, L * 0.95 if s in 'sn' else hgt * 0.9, hgt * 0.9 if s in 'sn' else L * 0.95, 0.04, 0.0, 0.0)
            continue
        for i in range(n + 1):
            k.cyl('post', ax + (bx_ - ax) * i / n, ay + (by_ - ay) * i / n, 0.0, 0.1, hgt)
        k.line('post', ax, ay, bx_, by_, 0.07, 0.07, hgt - 0.05)
        k.line('mesh', ax, ay, bx_, by_, 0.03, hgt - 0.1, 0.05)
        if wire:
            for j in range(int(L / 0.7)):
                t = (j + 0.5) / int(L / 0.7); cx, cy = ax + (bx_ - ax) * t, ay + (by_ - ay) * t
                k.cyl('razor', cx, cy, hgt + 0.05, 0.42, 0.06)
        if gate == s:
            k.rgb('gatepanel', (92, 96, 96), 'tape_grey')
            k.line('gatepanel', ax + (bx_ - ax) * 0.4, ay + (by_ - ay) * 0.4, ax + (bx_ - ax) * 0.6, ay + (by_ - ay) * 0.6, 0.12, 0.12, 1.2)


def pen(k, c, r, burst=False, horror=False):
    """a beast pen: a 10 m chain-link run on its pad, a plywood den with its dark door, a steel trough, straw"""
    x0, x1, y0, y1 = tile_m(c, r); ix0, ix1, iy0, iy1 = x0 + 1.0, x1 - 1.0, y0 + 1.0, y1 - 1.0
    chainlink(k, ix0, iy0, ix1, iy1, 3.0, gate='w', torn='nes' if burst else None)   # burst: three sides down, the tile open (debris)
    k.rgb('den', (128, 112, 90), 'clay_bone'); k.rgb('denroof', (82, 78, 72), 'tape_grey'); k.rgb('dark', (26, 24, 23), 'rubber')
    k.rgb('trough', (150, 152, 150), 'chrome'); k.rgb('straw', (176, 152, 102), 'tape_masking'); k.rgb('water', (60, 86, 92), 'clay_teal')
    dx, dy = ix1 - 3.0, iy1 - 2.6
    k.box('den', dx, dy, 0.0, 3.6, 3.0, 1.9); k.roof('denroof', dx, dy, 1.9, 3.9, 3.3, 0.6)
    k.box('dark', dx - 0.6, dy - 1.51, 0.0, 1.0, 0.05, 1.1)
    if burst:                                                    # the den door chewed through, splinters on the pad
        k.rgb('splinter', (150, 132, 104), 'clay_bone')
        for _ in range(14): k.box('splinter', dx - 0.6 + k.rng.uniform(-2.5, 2.5), dy - 2.2 - k.rng.uniform(0, 4.5), 0.0, k.rng.uniform(0.2, 0.9), 0.08, 0.05, k.rng.uniform(0, 3))
        k.roof('denroof', dx - 4.0, dy + 3.4, 0.0, 3.9, 3.3, 0.6, 0.9)          # the den's roof thrown off
        for _ in range(70): k.rock('straw', k.rng.uniform(ix0, ix1), k.rng.uniform(iy0, y1 + 4.0), k.rng.uniform(0.15, 0.45), 0.15)   # dragged out north
        k.rgb('claw', (40, 34, 30), 'rubber')
        for j in range(4): k.box('claw', dx + 0.4 + j * 0.18, dy - 1.52, 0.4, 0.05, 0.03, 1.0, 0.0, 0.2)
    else:
        k.scatter('straw', ix0 + 1, ix1 - 1, iy0 + 1, iy1 - 4, 40, 0.15, 0.45, 0.15)
    tx, ty = ix0 + 2.2, iy0 + 1.2
    k.box('trough', tx, ty, 0.0, 2.2, 0.8, 0.55)
    if horror: k.box('water', tx, ty, 0.5, 2.0, 0.6, 0.06)     # full and clean (the analog horror line)
    k.rgb('signplate', (196, 158, 62), 'clay_mustard'); k.box('signplate', ix0 - 0.05, (iy0 + iy1) / 2 + 2.0, 1.4, 0.04, 0.8, 0.6)


def gurneys(k, c, r, n=3):
    x, y = centre(c, r)
    k.rgb('gurneypad', (196, 198, 194), 'tape_grey'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('strap', (40, 40, 42), 'rubber')
    for i in range(n):
        gx, gy, a = x + k.rng.uniform(-3.5, 3.5), y + k.rng.uniform(-3.5, 3.5), k.rng.uniform(0, math.pi)
        if i == 0:                                               # one on its side
            k.box('steel', gx, gy, 0.0, 2.0, 0.7, 0.05, a); k.box('gurneypad', gx, gy + 0.3, 0.0, 1.9, 0.12, 0.6, a, 1.4)
        else:
            for sx in (-0.8, 0.8):
                for sy in (-0.25, 0.25): k.cyl('steel', gx + sx * math.cos(a) - sy * math.sin(a), gy + sx * math.sin(a) + sy * math.cos(a), 0.0, 0.06, 0.75)
            k.box('steel', gx, gy, 0.72, 2.0, 0.66, 0.06, a); k.box('gurneypad', gx, gy, 0.78, 1.9, 0.6, 0.12, a)
            k.box('strap', gx, gy, 0.9, 0.08, 0.7, 0.02, a)
    k.rgb('medcart', (170, 176, 172), 'tape_grey'); k.box('medcart', x + 2.5, y - 3.0, 0.0, 1.0, 0.6, 1.1, 0.3, 0.0)
    k.cyl('steel', x - 3.0, y + 2.5, 0.0, 0.05, 1.9); k.box('steel', x - 3.0, y + 2.5, 1.85, 0.6, 0.05, 0.05)


def drums(k, c, r, n=7, colour=(184, 150, 54)):
    x, y = centre(c, r); k.rgb('drum_y', colour, 'clay_mustard'); k.rgb('drumtop', (60, 56, 50), 'rubber')
    for i in range(n):
        dx, dy = x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3)
        if i % 4 == 3: k.tube('drum_y', dx, dy, 0.0, 0.9, 0.6, k.rng.uniform(0, 3))
        else: k.cyl('drum_y', dx, dy, 0.0, 0.6, 0.9); k.cyl('drumtop', dx, dy, 0.9, 0.5, 0.02)


def vehicle_box(k, x, y, rz, body, cab, length=6.5, width=2.3, hgt=2.6, stripe=None, light=None, doors_open=True):
    """a box-bodied vehicle (an ambulance, a van, a reefer): the box, the cab ahead of it, wheels, windows"""
    k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('glass', (40, 48, 52), 'glass_eye')
    ca, sa = math.cos(rz), math.sin(rz)
    P = lambda u, v: (x + u * ca - v * sa, y + u * sa + v * ca)
    bx_, by_ = P(-0.6, 0); k.box(body, bx_, by_, 0.5, length * 0.68, width, hgt - 0.5, rz)
    cx, cy = P(length * 0.32, 0); k.box(cab, cx, cy, 0.45, length * 0.22, width * 0.96, 1.7, rz)
    wx, wy = P(length * 0.43, 0); k.box('glass', wx, wy, 1.25, 0.06, width * 0.85, 0.7, rz)
    for u in (-length * 0.3, length * 0.3):
        for v in (-width * 0.48, width * 0.48):
            tx, ty = P(u, v); k.tube('tyre', tx, ty, 0.0, 0.85, 0.85, rz + math.pi / 2)
    if stripe:
        for v in (-width / 2 - 0.01, width / 2 + 0.01):
            sx, sy = P(-0.6, v); k.box(stripe, sx, sy, 1.3, length * 0.68, 0.02, 0.3, rz)
    if light:
        lx, ly = P(length * 0.32, 0); k.box(light, lx, ly, 2.15, 0.3, width * 0.8, 0.15, rz)
    if doors_open:
        dx_, dy_ = P(-0.6 - length * 0.34, 0); k.box('dark', dx_, dy_, 0.5, 0.04, width * 0.9, hgt - 0.7, rz)
        for v in (-1, 1):
            ox, oy = P(-0.6 - length * 0.34 - 0.5, v * (width / 2 + 0.3)); k.box(body, ox, oy, 0.55, 1.0, 0.05, hgt - 0.8, rz + v * 1.2)


def things_lab(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber')
    if bid == 'lab.1':
        for (c, r) in [(0, 0), (2, 0), (4, 0), (0, 1), (2, 1), (4, 1), (0, 3), (4, 3), (0, 4), (2, 4), (4, 4)]:
            pen(k, c, r, horror=(c, r) == (2, 1))
        pen(k, 2, 3, burst=True)                                 # the one burst open from inside
        gurneys(k, 1, 2, 5); gurneys(k, 3, 2, 4)
        k.rgb('hose', (150, 60, 40), 'clay_rust')               # a hose run down the aisle to the pens
        pts = [(2.0, 30.5), (14, 31.5), (26, 29.5), (38, 30.8), (50, 29.6), (58, 30.4)]
        for a, b in zip(pts, pts[1:]): k.line('hose', a[0], a[1], b[0], b[1], 0.1, 0.1)
        k.rgb('track', (70, 62, 54), 'rubber')                 # the drag of something heavy out of the burst pen, down the lane
        for i in range(16): k.box('track', 30.0 + k.rng.uniform(-0.6, 0.6) + i * 0.5, 24.0 + i * 0.75, 0.0, 0.5, 0.7, 0.01, 0.4)   # out the burst pen, up the aisle
    elif bid == 'lab.2':
        k.rgb('block', (172, 166, 152), 'clay_bone'); k.rgb('roofgrey', (122, 120, 116), 'tape_grey'); k.rgb('hvac', (160, 162, 160), 'chrome')
        k.rgb('hazardp', (196, 158, 62), 'clay_mustard'); k.rgb('bump', (30, 28, 27), 'rubber')
        k.box('block', 12.0, 54.0, 0.0, 24.4, 12.4, 7.2)          # the vivarium's back wall, two storeys (tiles c0, c1 of row 0)
        k.box('roofgrey', 12.0, 54.0, 7.2, 24.6, 12.6, 0.25)
        for i in range(3): k.box('hvac', 5.0 + i * 7.0, 55.5, 7.45, 2.6, 2.2, 1.4)
        k.box('dark', 7.0, 47.75, 0.0, 4.2, 0.05, 4.0); k.box('dark', 18.0, 47.75, 0.0, 4.2, 0.05, 4.0)   # the roll-up doors
        k.box('hazardp', 12.0, 47.74, 4.4, 2.0, 0.04, 1.2)       # the biohazard placard
        k.box('block', 30.0, 54.0, 0.0, 12.0, 12.0, 1.25)         # the loading dock (row 0, tile c2): you climb it
        for i in range(3): k.box('bump', 25.0 + i * 5.0, 47.9, 0.25, 0.6, 0.3, 0.8)
        k.box('block', 30.0, 56.5, 1.25, 10.0, 7.0, 4.6); k.box('dark', 30.0, 52.98, 1.25, 3.4, 0.05, 3.2)
        k.rgb('reefer', (206, 206, 200), 'tape_grey'); k.rgb('reefband', (64, 86, 96), 'clay_teal'); k.rgb('cab', (150, 60, 44), 'clay_rust')
        k.rgb('frost', (214, 226, 230), 'tape_grey')
        tx, ty = 10.0, 30.0                                      # the cold-store truck across row 2, c0..c1: its reefer box
        k.box('reefer', tx, ty, 1.2, 15.5, 2.6, 2.9); k.box('reefband', tx, ty - 1.31, 2.0, 15.4, 0.02, 0.4)
        k.box('hvac', tx + 7.9, ty, 2.0, 0.6, 2.2, 1.8)
        for u in (-6.5, -5.2, 4.5):
            for v in (-1.2, 1.2): k.tube('tyre', tx + u, ty + v, 0.0, 1.0, 1.0, math.pi / 2)
        k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('glass', (40, 48, 52), 'glass_eye')
        k.box('cab', tx + 10.2, ty, 0.6, 3.0, 2.5, 2.4); k.box('glass', tx + 11.72, ty, 1.9, 0.05, 2.1, 0.8)
        for v in (-1.2, 1.2): k.tube('tyre', tx + 10.4, ty + v, 0.0, 1.0, 1.0, math.pi / 2)
        k.box('dark', tx - 7.76, ty, 1.3, 0.04, 2.3, 2.6)         # its back doors open on the dark
        for v in (-1, 1): k.box('reefer', tx - 8.4, ty + v * 1.6, 1.25, 1.2, 0.05, 2.7, v * 1.15)
        k.box('frost', tx - 7.8, ty, 3.9, 0.06, 2.4, 0.18)        # rime on the open doors' head, years after the power died
        k.rgb('pallet', (150, 124, 90), 'clay_bone')
        for i in range(4): k.box('pallet', tx - 10.5 - (i % 2) * 1.4, ty - 2.2 + (i // 2) * 1.4, 0.0, 1.2, 1.0, 0.15 + 0.6 * (i == 1))
        gurneys(k, 1, 1)
        # the decon line (row 1, c3): two shower frames over the drain pad, curtains, the hose
        k.rgb('pipe', (198, 160, 64), 'clay_mustard'); k.rgb('curtain', (196, 204, 200), 'tape_grey', alpha=0.55)
        for i, cx in enumerate((39.4, 44.6)):
            cy = 42.0
            for sx in (-1.2, 1.2):
                for sy in (-1.2, 1.2): k.cyl('pipe', cx + sx, cy + sy, 0.0, 0.12, 2.5)
            for sy in (-1.2, 1.2): k.box('pipe', cx, cy + sy, 2.45, 2.5, 0.1, 0.1)
            for sx in (-1.2, 1.2): k.box('pipe', cx + sx, cy, 2.45, 0.1, 2.5, 0.1)
            k.box('curtain', cx, cy + 1.2, 0.3, 2.3, 0.03, 2.1)
            if i == 0: k.box('curtain', cx - 1.2, cy, 0.3, 0.03, 2.3, 2.1)
            k.box('dark', cx, cy, 0.0, 0.8, 0.8, 0.02)
        k.box('pipe', 42.0, 46.6, 0.0, 0.6, 0.6, 1.0)               # the boiler stub, its gauge
        drums(k, 2, 4)
        for (x0, x1) in ((0.6, 23.4), (36.6, 59.4)):               # the run fence across row 3, the gate open at c2
            for c0 in range(int(x0 // 12), int(x1 // 12) + 1):
                xa, xb, ya, yb = tile_m(c0, 3); chainlink(k, xa + 0.6, ya + 0.6, xb - 0.6, yb - 0.6, 2.4)
                k.rgb('genbox', (104, 110, 98), 'metal_painted')
                if c0 in (0, 4): k.box('genbox', (xa + xb) / 2, (ya + yb) / 2, 0.0, 4.0, 2.2, 2.0)   # a generator in its cage
                else: drums(k, c0, 3, 9, (170, 60, 46))                                               # the red bins in theirs
    elif bid == 'lab.3':
        k.rgb('amb', (210, 208, 200), 'tape_grey'); k.rgb('ambred', (170, 54, 40), 'clay_rust'); k.rgb('ambcab', (196, 194, 186), 'tape_grey')
        k.rgb('lightbar', (172, 60, 46), 'clay_rust')
        vehicle_box(k, 18.0, 54.0, 0.2, 'amb', 'ambcab', 7.0, 2.4, 2.8, stripe='ambred', light='lightbar')
        k.rgb('van', (186, 186, 180), 'tape_grey'); k.rgb('vancab', (176, 176, 170), 'tape_grey')
        vehicle_box(k, 42.0, 18.0, 2.9, 'van', 'vancab', 6.0, 2.1, 2.5)
        drums(k, 4, 0)
        gurneys(k, 0, 3)
        for c0 in (0, 1, 3, 4):                                   # the run fence across row 1, the gate at c2 hanging open
            xa, xb, ya, yb = tile_m(c0, 1); chainlink(k, xa + 0.6, ya + 0.6, xb - 0.6, yb - 0.6, 2.4)
            k.rgb('kennel', (120, 108, 92), 'clay_bone')
            for j in range(3): k.box('kennel', xa + 2.5 + j * 3.5, ya + 2.0, 0.0, 2.2, 1.6, 1.3)
        for c0 in (2, 3, 4):
            xa, xb, ya, yb = tile_m(c0, 4); chainlink(k, xa + 0.6, ya + 0.6, xb - 0.6, yb - 0.6, 2.4)
            drums(k, c0, 4, 6, (170, 60, 46))
        k.rgb('gatepanel', (92, 96, 96), 'tape_grey'); k.line('gatepanel', 24.6, 36.6, 27.0, 40.5, 0.12, 2.0)   # the gate, swung out


def plane(k, x, y, rz, broken=True, white=(208, 206, 198), stripe=(70, 96, 104)):
    """a twin-prop commuter on its belly (a Beech 1900 class, 17.6 m long, 17.7 m span): the tube, the wings, the nacelles, the
    props bent, the T-tail; broken: the tail section lies apart, behind"""
    k.rgb('fuse', white, 'tape_grey'); k.rgb('fstripe', stripe, 'clay_teal'); k.rgb('fdark', (110, 110, 106), 'tape_grey'); k.rgb('glass', (40, 48, 52), 'glass_eye')
    k.rgb('prop', (52, 50, 48), 'rubber'); k.rgb('cowl', (176, 176, 170), 'tape_grey')
    ca, sa = math.cos(rz), math.sin(rz)
    P = lambda u, v: (x + u * ca - v * sa, y + u * sa + v * ca)
    L = 13.0 if broken else 17.6
    cx, cy = P(-(17.6 - L) / 2 + 0.0, 0)
    k.tube('fuse', cx, cy, -0.25, L, 2.0, rz, 0.0)                   # the tube, sunk a hand into the slab (gear gone)
    nx, ny = P(L / 2 - 0.0 + 0.2, 0); k.tube('fuse', nx, ny, -0.15, 1.6, 1.6, rz)                      # the nose
    gx, gy = P(L / 2 + 0.7, 0); k.tube('glass', gx, gy, 0.55, 0.4, 0.7, rz)                            # the windscreen
    for side in (-1.01, 1.01):
        sx, sy = P(-0.5, side); k.box('fstripe', sx, sy, 0.85, L * 0.92, 0.02, 0.3, rz)
        for i in range(8):
            wx, wy = P(-L / 2 + 2.0 + i * 1.1, side * 0.99); k.box('glass', wx, wy, 1.12, 0.35, 0.03, 0.32, rz)
    # the wings: low, one tip on the slab
    wx, wy = P(0.6, 0)
    k.box('fuse', wx, wy, 0.15, 2.0, 17.7, 0.28, rz, 0.06)
    for v in (-3.2, 3.2):
        ex, ey = P(1.6, v); k.tube('cowl', ex, ey, 0.1, 4.2, 1.2, rz)
        px, py = P(3.8, v)
        for b in range(3):
            a = b * 2.094 + (0.6 if v > 0 else 0.0)
            k.box('prop', px, py + 0.0, 0.7 + 0.6 * math.sin(a) * (0.3 if v > 0 else 1.0), 0.08, 2.4 * abs(math.cos(a)) + 0.3, 0.12, rz, a if v < 0 else 1.2)
    # the tail
    if broken:
        tx, ty = P(-L / 2 - 9.0, 1.4); trz = rz + 0.35          # thrown nine metres past the break
        k.tube('fuse', tx, ty, -0.1, 4.2, 1.6, trz); k.box('fdark', tx + 0.0, ty, 0.0, 0.3, 1.5, 1.4, trz)   # its torn end
        fx, fy = tx - 1.0 * math.cos(trz), ty - 1.0 * math.sin(trz)
        k.box('fuse', fx, fy, 1.3, 2.4, 0.25, 3.2, trz, 0.0); k.box('fstripe', fx, fy, 3.4, 2.4, 0.27, 0.6, trz)
        k.box('fuse', fx - 0.4 * math.cos(trz), fy - 0.4 * math.sin(trz), 4.5, 1.6, 6.5, 0.15, trz, 0.18)
        k.rgb('beacon', (226, 80, 60), 'sodium'); k.box('beacon', fx, fy, 4.6, 0.25, 0.2, 0.2, trz)
        bx, by = P(-L / 2 - 0.2, 0); k.box('fdark', bx, by, -0.1, 0.4, 2.0, 1.9, rz)                         # the open break
        for j in range(8):                                                                                 # skin torn off between
            px, py = P(-L / 2 - 1.5 - j * 0.9, k.rng.uniform(-1.6, 1.6)); k.box('fuse', px, py, 0.0, k.rng.uniform(0.6, 1.4), k.rng.uniform(0.4, 0.9), 0.05, k.rng.uniform(0, 3))
    k.rgb('door', white, 'tape_grey'); dx, dy = P(-3.0, -2.6); k.box('door', dx, dy, 0.0, 1.6, 0.8, 0.12, rz + 0.4)


def luggage(k, x, y, spread, n):
    cols = [(150, 60, 44), (44, 42, 44), (66, 86, 98), (176, 150, 100), (90, 84, 70), (160, 150, 130)]
    for i, c in enumerate(cols): k.rgb('bag%d' % i, c, 'clay_rust' if i == 0 else 'cloth_black' if i == 1 else 'clay_teal' if i == 2 else 'tape_masking')
    for _ in range(n):
        i = k.rng.randint(0, len(cols)); bx_, by_ = x + k.rng.normal(0, spread), y + k.rng.normal(0, spread)
        k.box('bag%d' % i, bx_, by_, 0.0, k.rng.uniform(0.5, 0.8), k.rng.uniform(0.3, 0.5), k.rng.uniform(0.2, 0.35), k.rng.uniform(0, 3.1))


def bag_cart(k, x, y, rz, n=4):
    k.rgb('cartframe', (120, 124, 122), 'tape_grey'); k.rgb('cartroof', (196, 166, 70), 'clay_mustard'); k.rgb('tyre', (34, 32, 31), 'rubber')
    k.rgb('tugbody', (196, 160, 64), 'clay_mustard')
    ca, sa = math.cos(rz), math.sin(rz)
    tx, ty = x + 2.2 * ca, y + 2.2 * sa; k.box('tugbody', tx, ty, 0.2, 3.0, 1.8, 1.3, rz)
    for i in range(n):
        u = -1.5 - i * 3.1; cx, cy = x + u * ca, y + u * sa
        tilt = 1.25 if i == n - 1 else 0.0
        k.box('cartframe', cx, cy, 0.35, 2.6, 1.5, 0.12, rz, tilt)
        if not tilt:
            for v in (-0.7, 0.7): k.box('cartframe', cx - v * sa, cy + v * ca, 0.35, 2.6, 0.06, 1.3, rz)
            k.box('cartroof', cx, cy, 1.7, 2.7, 1.6, 0.06, rz)
            luggage(k, cx, cy, 0.4, 4)
        else: luggage(k, cx - 1.6 * sa, cy + 1.6 * ca, 1.2, 7)


def things_apron(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('glass', (40, 48, 52), 'glass_eye')
    if bid == 'apron.1':
        plane(k, 20.0, 30.0, math.pi, broken=True)                # nose west to your line (c1-c2, the '#' row), its tail torn off east (c3)
        k.rgb('ld3', (176, 178, 176), 'chrome'); k.rgb('ld3b', (150, 152, 150), 'tape_grey')
        for (c, r) in ((1, 1), (2, 1), (1, 3), (2, 3)):         # the hold burst: LD3 cargo cans strewn on the four cover tiles
            x, y = centre(c, r)
            for j in range(3):
                cx, cy, a = x + k.rng.uniform(-3.5, 3.5), y + k.rng.uniform(-3.0, 3.0), k.rng.uniform(0, 3.1)
                k.box('ld3' if j % 2 else 'ld3b', cx, cy, 0.0, 2.0, 1.55, 1.63, a, 1.5 if j == 2 else 0.0)
        luggage(k, 22.0, 41.0, 4.0, 30); luggage(k, 22.0, 19.0, 4.0, 26)   # the bags round the cover tiles (rows 1 and 3)
        k.rgb('seat', (70, 76, 92), 'clay_teal')
        for _ in range(7): k.box('seat', 16 + k.rng.uniform(-4, 10), 18 + k.rng.uniform(-3, 3), 0.0, 0.5, 0.5, 0.9, k.rng.uniform(0, 3), 1.2)
        k.rgb('cowl', (176, 176, 170), 'tape_grey'); k.tube('cowl', 13.5, 43.5, 0.0, 2.2, 1.1, 0.8)   # an engine cowling thrown off
        luggage(k, 52.0, 8.0, 0.01, 1)                            # the one suitcase upright and packed on the bare slab (horror)
        k.rgb('upright', (150, 60, 44), 'clay_rust'); k.box('upright', 50.0, 8.0, 0.0, 0.5, 0.25, 0.75, 0.3)
        k.rgb('tag', (226, 220, 200), 'tape_grey'); k.box('tag', 50.1, 7.84, 0.62, 0.08, 0.02, 0.12, 0.3)
        k.rgb('cone', (190, 96, 50), 'clay_rust')
        for (cx, cy) in ((8, 26), (8, 34), (44, 22)): k.put('cyl6', 'cone', cx, cy, 0.0, 0.4, 0.4, 0.7)
    elif bid == 'apron.2':
        k.rgb('hangar', (150, 152, 148), 'tape_grey'); k.rgb('hangar_r', (122, 112, 100), 'clay_rust'); k.rgb('hwall', (176, 176, 168), 'tape_grey')
        k.box('hwall', 12.0, 48.0, 0.0, 23.6, 23.6, 6.0)             # the hangar on rows 0-1, c0-1: three storeys to its ridge
        k.roof('hangar', 12.0, 48.0, 6.0, 23.8, 24.4, 3.2, math.pi / 2)
        for i in range(5): k.box('hangar_r', 3.0 + i * 4.6, 48.0, 7.6 - 0.0, 0.25, 22.0, 0.05)   # rust streaks down the roof
        k.box('dark', 12.0, 36.18, 0.0, 14.0, 0.05, 5.4)            # the big doors, half open on the dark
        k.box('hwall', 3.6, 36.0, 0.0, 6.6, 0.25, 5.6); k.box('hwall', 20.4, 35.6, 0.0, 6.6, 0.25, 5.6, 0.12)
        k.rgb('sock', (206, 110, 50), 'clay_rust'); k.rgb('steel', (140, 142, 140), 'chrome'); k.cyl('steel', 26.0, 58.0, 0.0, 0.12, 6.0)
        k.box('sock', 26.9, 58.0, 5.6, 1.6, 0.35, 0.35, 0.0, 0.0)  # the windsock hangs (no wind)
        k.rgb('tank', (196, 196, 190), 'tape_grey'); k.rgb('tcab', (176, 60, 44), 'clay_rust'); k.rgb('hazardp', (196, 158, 62), 'clay_mustard')
        tx, ty = 42.0, 30.0                                          # the fuel truck (row 2, c3)
        k.tube('tank', tx - 1.0, ty, 0.6, 7.6, 2.4); k.box('tcab', tx + 4.0, ty, 0.5, 2.4, 2.4, 2.0); k.box('glass', tx + 5.21, ty, 1.5, 0.04, 2.0, 0.6)
        k.box('hazardp', tx - 4.82, ty, 1.6, 0.03, 0.8, 0.6)
        for u in (-3.5, -2.3, 4.0):
            for v in (-1.2, 1.2): k.tube('tyre', tx + u, ty + v, 0.0, 0.95, 0.95, math.pi / 2)
        k.rgb('hose', (40, 40, 40), 'rubber')
        for i in range(5): k.line('hose', tx - 4.8 + i * 0.6, ty - 1.3 - (i % 2) * 0.5, tx - 4.2 + i * 0.6, ty - 1.8 + (i % 2) * 0.5, 0.12, 0.12)
        bag_cart(k, 44.5, 18.0, 0.0, 3); bag_cart(k, 25.5, 18.5, 0.05, 4)   # two cart trains across row 3, c1 to c3
        k.rgb('chock', (196, 158, 62), 'clay_mustard')
        for (cx, cy) in ((50, 50), (52, 48), (6, 6)): k.box('chock', cx, cy, 0.0, 0.5, 0.3, 0.25)
    elif bid == 'apron.3':
        k.rgb('mull', (92, 96, 98), 'tape_grey'); k.rgb('tglass', (66, 84, 92), 'glass_eye'); k.rgb('tconc', (176, 172, 162), 'clay_bone')
        k.box('tconc', 30.0, 55.0, 0.0, 60.2, 10.0, 8.4)            # the terminal (row 0): two storeys of glass and concrete
        k.box('tglass', 30.0, 49.96, 1.0, 58.0, 0.05, 6.4)
        for i in range(21): k.box('mull', 1.5 + i * 2.85, 49.92, 0.8, 0.18, 0.06, 6.8)
        k.box('mull', 30.0, 49.92, 4.2, 58.0, 0.06, 0.2); k.box('tconc', 30.0, 55.0, 8.4, 60.4, 10.4, 0.4)
        k.rgb('crack', (30, 30, 30), 'rubber')
        for i in range(6): k.line('crack', 8 + i * 9.0, 49.9, 9.5 + i * 9.0 + k.rng.uniform(-1, 1), 49.9, 0.03, 4.0 + k.rng.uniform(0, 2), 1.4)
        k.rgb('bridge', (176, 178, 172), 'tape_grey'); k.rgb('blit', (238, 214, 150), 'sodium')
        k.box('bridge', 30.0, 44.0, 3.6, 3.2, 12.0, 2.8, 0.0, -0.12)   # the jet bridge stub, its far end dropped
        k.rgb('steel', (140, 142, 140), 'chrome'); k.cyl('steel', 30.0, 40.0, 0.0, 0.5, 3.6)
        for v in (-1, 1): k.tube('tyre', 30.0 + v * 0.9, 40.0, 0.0, 1.0, 1.0, math.pi / 2)
        k.box('dark', 30.0, 37.96, 2.6, 2.4, 0.05, 2.2); k.box('blit', 30.0, 37.94, 3.6, 1.6, 0.03, 0.8)   # its end, and the light on in it
        k.rgb('belt', (52, 52, 52), 'rubber'); k.rgb('tugbody', (196, 160, 64), 'clay_mustard')
        k.box('tugbody', 42.0, 30.0, 0.3, 4.0, 2.0, 1.0); k.box('belt', 42.0, 30.0, 1.3, 7.5, 0.9, 0.12, 0.0, 0.0)  # the belt loader (row 2, c3)
        k.box('belt', 45.0, 30.0, 2.2, 3.0, 0.9, 0.12, 0.0, 0.0)
        k.box('tugbody', 18.0, 18.0, 0.2, 3.4, 2.0, 1.5, 0.4)      # the dead tug (row 3, c1), a tow bar
        k.line('steel', 19.5, 18.6, 23.0, 20.4, 0.12, 0.12, 0.4)
        k.rgb('gpu', (110, 112, 100), 'metal_painted'); k.box('gpu', 46.5, 26.0, 0.0, 2.2, 1.4, 1.3, 0.2)
        k.rgb('cone', (190, 96, 50), 'clay_rust')
        for (cx, cy) in ((26, 34), (34, 34), (52, 10)): k.put('cyl6', 'cone', cx, cy, 0.0, 0.4, 0.4, 0.7)


def golf_cart(k, x, y, rz, on_side=False):
    k.rgb('gcart', (206, 204, 194), 'tape_grey'); k.rgb('gseat', (96, 70, 52), 'clay_rust'); k.rgb('groof', (190, 188, 178), 'tape_grey')
    k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('bagg', (60, 56, 52), 'cloth_black')
    if on_side:
        k.box('gcart', x, y, 0.0, 2.4, 1.2, 1.0, rz, 1.45); k.box('groof', x + 0.0, y + 1.5, 0.0, 2.2, 0.1, 1.2, rz, 1.45); return
    ca, sa = math.cos(rz), math.sin(rz)
    k.box('gcart', x, y, 0.3, 2.4, 1.2, 0.5, rz); k.box('gseat', x - 0.2 * ca, y - 0.2 * sa, 0.8, 0.6, 1.1, 0.5, rz)
    for u in (-0.9, 0.9):
        for v in (-0.5, 0.5): k.cyl('steel', x + u * ca - v * sa, y + u * sa + v * ca, 0.8, 0.05, 1.1)
    k.box('groof', x, y, 1.9, 2.3, 1.3, 0.08, rz)
    k.cyl('bagg', x - 1.1 * ca, y - 1.1 * sa, 0.5, 0.35, 1.0)
    for u in (-0.85, 0.85):
        for v in (-0.62, 0.62): k.tube('tyre', x + u * ca - v * sa, y + u * sa + v * ca, 0.0, 0.25, 0.5, rz + math.pi / 2)


def dead_pine(k, x, y, hgt):
    k.rgb('pinebark', (88, 72, 58), 'clay_rust'); k.rgb('pinedead', (122, 98, 70), 'clay_bone')
    k.cyl('pinebark', x, y, 0.0, 0.45, hgt)
    for i in range(7):                                       # the dead boughs: stubs and a few brown clumps
        a = k.rng.uniform(0, 6.3); z = hgt * (0.35 + 0.08 * i); L = (1.0 - 0.1 * i) * 2.6
        k.line('pinebark', x, y, x + L * math.cos(a), y + L * math.sin(a), 0.12, 0.12, z)
        if i % 2 == 0: k.rock('pinedead', x + L * math.cos(a) * 0.8, y + L * math.sin(a) * 0.8, 0.9, 0.5, z=z + 0.3)


def things_golf(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome')
    k.rgb('stucco', (196, 182, 156), 'clay_bone'); k.rgb('tile', (150, 76, 52), 'clay_rust'); k.rgb('awn', (60, 90, 84), 'clay_teal')
    if bid == 'golf.1':
        k.box('stucco', 12.0, 42.6, 0.0, 23.0, 9.6, 3.2)            # the clubhouse (row 1, c0-1): one storey, its tile roof
        k.roof('tile', 12.0, 42.6, 3.2, 24.2, 10.8, 1.8)
        k.box('stucco', 21.0, 44.5, 4.0, 1.2, 1.2, 1.4)             # the chimney
        for i in range(5): k.box('dark', 3.0 + i * 4.4, 37.78, 0.8, 1.6, 0.05, 1.6)   # its windows, boarded black
        k.rgb('board', (150, 124, 90), 'clay_bone')
        for i in (1, 3): k.box('board', 3.0 + i * 4.4, 37.74, 1.3, 1.8, 0.04, 0.25, 0.0, 0.0)
        # the patio under the awning (row 2, c0-1): torn canvas on its posts, tables and chairs knocked about
        for i in range(6): k.cyl('steel', 2.0 + i * 4.0, 25.6, 0.0, 0.1, 2.7)
        k.box('awn', 12.0, 31.0, 2.7, 23.0, 11.0, 0.05, 0.0, -0.08)
        k.box('awn', 18.0, 25.0, 1.4, 3.6, 0.05, 1.3, 0.1)           # a torn flap hanging, dead still
        k.rgb('table', (180, 176, 166), 'tape_grey')
        for (tx, ty, knocked) in ((5, 33, 0), (11, 29, 1), (17, 33, 0), (8, 27, 0), (20, 28, 1)):
            if knocked: k.cyl('table', tx, ty, 0.0, 1.1, 0.08); k.cyl('steel', tx + 0.4, ty, 0.04, 0.06, 0.2)
            else: k.cyl('table', tx, ty, 0.72, 1.1, 0.05); k.cyl('steel', tx, ty, 0.0, 0.1, 0.72)
            for a in range(3):
                ang = a * 2.1 + k.rng.uniform(0, 0.5); cx, cy = tx + 1.0 * math.cos(ang), ty + 1.0 * math.sin(ang)
                k.box('table', cx, cy, 0.0 if (a == 1 and knocked) else 0.42, 0.5, 0.5, 0.06, ang, 1.3 if (a == 1 and knocked) else 0.0)
        for i, (cx, cy, rz) in enumerate(((27.0, 31.0, 0.5), (30.6, 29.4, 0.5), (34.2, 31.0, 0.5), (39.0, 29.0, 0.5), (43.4, 31.2, 0.5))):
            golf_cart(k, cx, cy, rz, on_side=(i == 3))              # the cart row (row 2, c2-3), one on its side
        k.box('steel', 46.0, 26.0, 0.0, 0.1, 0.1, 0.95); k.rgb('washer', (60, 84, 70), 'clay_teal'); k.box('washer', 46.0, 26.0, 0.95, 0.3, 0.2, 0.4)   # the ball washer
        k.rgb('rake', (150, 124, 90), 'clay_bone'); k.line('rake', 40.0, 15.0, 42.0, 16.4, 0.05, 0.05, 0.05)    # in the bunker (row 3, c3)
        # the 18th: the flag on the dead green, standing straight out in a wind that moves nothing else (the analog horror line)
        k.cyl('steel', 33.0, 7.0, 0.0, 0.05, 2.3)
        k.rgb('flagcloth', (170, 60, 46), 'clay_rust'); k.box('flagcloth', 33.35, 7.0, 1.75, 0.7, 0.02, 0.5, 0.0)
        k.box('dark', 33.0, 7.0, 0.0, 0.15, 0.15, 0.01)
        for (px, py) in ((2.0, 54.0), (26.0, 50.0), (55.0, 52.0)): dead_pine(k, px, py, k.rng.uniform(7, 9))
    elif bid == 'golf.2':
        k.rgb('shelter', (150, 118, 88), 'clay_rust'); k.rgb('stone', (150, 140, 124), 'clay_bone')
        x0, x1, y0, y1 = tile_m(3, 0); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2   # the rain shelter (row 0, c3): stone piers, a hip roof
        for sx in (-2.2, 2.2):
            for sy in (-1.8, 1.8): k.box('stone', cx + sx, cy + sy, 0.0, 0.7, 0.7, 2.3)
        k.box('stone', cx, cy + 1.8, 0.0, 5.0, 0.4, 1.1); k.roof('shelter', cx, cy, 2.3, 6.2, 5.4, 1.3)
        k.rgb('bench', (120, 96, 70), 'clay_rust'); k.box('bench', cx, cy + 1.2, 0.45, 3.0, 0.5, 0.08)
        golf_cart(k, cx + 4.5, cy - 3.0, 2.2)
        for i in range(6):                                          # the stand of dead pines (row 4, c0): BB's forest, its cover
            dead_pine(k, 2.5 + (i % 3) * 3.6 + k.rng.uniform(-0.8, 0.8), 3.0 + (i // 3) * 5.0 + k.rng.uniform(-0.8, 0.8), k.rng.uniform(7, 10))
        k.scatter('pinedead', 0.5, 11.5, 0.5, 11.5, 30, 0.2, 0.5, 0.2)
        k.rgb('pondrock', (122, 116, 104)); k.rgb('liner', (40, 38, 36), 'rubber')
        for i in range(30):                                         # the dry pond's rim stones
            a = i * 0.21; k.rock('pondrock', 36 + 11.4 * math.cos(a), 18 + 5.8 * math.sin(a), k.rng.uniform(0.4, 1.0), 0.6)
        for i in range(5): k.box('liner', 30 + i * 2.4, 16 + k.rng.uniform(-2, 2), 0.0, 1.8, 0.9, 0.02, k.rng.uniform(0, 3), 0.15)
        k.rgb('ball', (236, 232, 222), 'tape_grey')
        for _ in range(9): k.rock('ball', 36 + k.rng.uniform(-6, 6), 18 + k.rng.uniform(-2.5, 2.5), 0.06, 0.9)   # the balls the water hid
        k.box('steel', 7.0, 30.0, 0.0, 0.1, 0.1, 0.95); k.rgb('washer', (60, 84, 70), 'clay_teal'); k.box('washer', 7.0, 30.0, 0.95, 0.3, 0.2, 0.4)
        k.rgb('rake', (150, 124, 90), 'clay_bone'); k.line('rake', 16.0, 44.0, 18.5, 45.0, 0.05, 0.05, 0.05)
        for (px, py) in ((54.0, 8.0), (52.0, 44.0)): dead_pine(k, px, py, k.rng.uniform(7, 9))


def single_wide(k, x, y, rz, tint, burnt=False, swamp=True, length=20.0):
    k.rgb('board', (150, 124, 90), 'clay_bone'); k.rgb('steel', (140, 142, 140), 'chrome')
    """a 1970s single-wide on its blocks: the box, the metal roof with its seams, windows, the hitch, the skirting gone"""
    k.rgb('tw_%d%d%d' % tint, tint, 'clay_bone'); k.rgb('troof', (168, 168, 160), 'tape_grey'); k.rgb('tseam', (120, 120, 114), 'tape_grey')
    k.rgb('cblock', (150, 146, 136), 'tape_grey'); k.rgb('glass', (40, 48, 52), 'glass_eye'); k.rgb('char', (40, 36, 33), 'rubber')
    k.rgb('rustroof', (122, 82, 60), 'clay_rust')
    ca, sa = math.cos(rz), math.sin(rz); P = lambda u, v: (x + u * ca - v * sa, y + u * sa + v * ca)
    for u in np.linspace(-length / 2 + 1, length / 2 - 1, 6):
        for v in (-1.6, 1.6): bx_, by_ = P(u, v); k.box('cblock', bx_, by_, 0.0, 0.4, 0.4, 0.75, rz)
    if burnt:                                                    # burnt to its frame: the chassis, the roof sheets fallen in, ash
        for v in (-2.0, 2.0): bx_, by_ = P(0, v); k.box('char', bx_, by_, 0.6, length, 0.2, 0.25, rz)
        for i in range(9):
            u = -length / 2 + 1.0 + i * length / 9; bx_, by_ = P(u, k.rng.uniform(-1, 1))
            k.box('rustroof' if i % 3 else 'char', bx_, by_, 0.3 + k.rng.uniform(0, 0.4), 2.2, 4.0, 0.05, rz + k.rng.uniform(-0.2, 0.2), k.rng.uniform(-0.4, 0.4))
        for i in range(5): bx_, by_ = P(-length / 2 + 2 + i * 4, 2.1); k.box('char', bx_, by_, 0.6, 0.12, 0.12, 2.2 - (i % 2) * 1.2, rz)
        k.scatter('char', min(P(-length / 2, -2)[0], P(length / 2, 2)[0]), max(P(-length / 2, -2)[0], P(length / 2, 2)[0]),
                  min(P(-length / 2, -2)[1], P(length / 2, 2)[1]), max(P(-length / 2, -2)[1], P(length / 2, 2)[1]), 40, 0.2, 0.7, 0.4)
        return
    cx, cy = P(0, 0); m = 'tw_%d%d%d' % tint
    k.box(m, cx, cy, 0.75, length, 4.3, 2.5, rz)
    k.box('troof', cx, cy, 3.25, length + 0.2, 4.5, 0.12, rz)
    for i in range(int(length / 1.2)): sx, sy = P(-length / 2 + 0.6 + i * 1.2, 0); k.box('tseam', sx, sy, 3.37, 0.05, 4.4, 0.03, rz)
    for i in range(4):
        for v in (-2.16, 2.16): wx, wy = P(-length / 2 + 3 + i * 4.6, v); k.box('glass', wx, wy, 1.6, 1.3, 0.05, 0.9, rz)
    hx, hy = P(length / 2 + 0.9, 0); k.box('cblock', hx, hy, 0.5, 1.8, 0.3, 0.12, rz)
    if swamp: sx, sy = P(-length / 4, 0); k.box('tseam', sx, sy, 3.37, 1.0, 1.0, 0.8, rz)   # the swamp cooler on the roof
    k.rgb('awning', (176, 176, 168), 'tape_grey'); k.rgb('lattice', (150, 130, 100), 'clay_bone')
    ax, ay = P(0, -4.0); k.box('awning', ax, ay, 2.6, length * 0.8, 3.4, 0.08, rz)                # the aluminium awning down its side
    for u in np.linspace(-length * 0.38, length * 0.38, 5): px_, py_ = P(u, -5.6); k.cyl('steel', px_, py_, 0.0, 0.08, 2.6)
    for v in (-5.8,): fx, fy = P(0, v); k.box('lattice', fx, fy, 0.0, length * 0.9, 0.06, 1.0, rz)    # its yard fence
    dx, dy = P(length / 6, -3.0); k.box('board', dx, dy, 0.0, 2.4, 1.6, 0.8, rz)


def things_trailer(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('board', (150, 124, 90), 'clay_bone')
    k.rgb('propane', (206, 204, 196), 'tape_grey'); k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('tarp', (66, 86, 98), 'clay_teal')
    def propane(c, r, big=True):
        x, y = centre(c, r)
        if big: k.tube('propane', x - 1.5, y + 1.0, 0.3, 2.9, 1.0, 0.3); k.box('steel', x - 1.5, y + 1.0, 0.0, 0.3, 0.8, 0.35, 0.3)
        for i in range(4): k.cyl('propane', x + 1.0 + (i % 2) * 0.5, y - 1.0 - (i // 2) * 0.5, 0.0, 0.38, 1.2)
    def junk(c, r):
        x, y = centre(c, r)
        k.rgb('grill', (40, 38, 36), 'rubber'); k.cyl('grill', x - 2, y + 2, 0.0, 0.6, 0.9)
        for i in range(3): k.box('board', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), 0.0, 1.8, 0.6, 0.3 + 0.3 * i, k.rng.uniform(0, 3))
        k.tube('tyre', x + 2.5, y - 2, 0.0, 0.3, 0.7, 0.4); k.tube('tyre', x + 2.6, y - 1.2, 0.0, 0.3, 0.7, 1.0)
        k.rgb('chair', (176, 150, 90), 'clay_mustard'); k.box('chair', x - 0.5, y - 2.5, 0.0, 0.6, 0.6, 0.9, 0.5)
    if bid == 'trailer.1':
        tints = [(196, 186, 160), (184, 150, 130), (176, 172, 160), (190, 170, 140), (170, 160, 150)]
        for i, (c, burnt) in enumerate(((0, False), (2, False))):        # end-on, north to south, rows 0-1
            x, _ = centre(c, 0); single_wide(k, x, 48.0, math.pi / 2, tints[i])
        x, _ = centre(4, 0); single_wide(k, x, 48.0, math.pi / 2, tints[2], burnt=True, length=21.0)   # the burnt one (its back half is the rubble tile)
        for i, c in enumerate((1, 3)):                                   # rows 3-4
            x, _ = centre(c, 3); single_wide(k, x, 12.0, math.pi / 2, tints[3 + i])
        x0, x1, y0, y1 = tile_m(2, 3)                                    # the carport between them: its roof is the one height
        k.rgb('carport', (150, 148, 140), 'tape_grey')
        for px_ in (x0 + 1.0, x1 - 1.0):
            for py_ in (y0 + 1.0, y1 - 1.0): k.cyl('steel', px_, py_, 0.0, 0.12, 2.8)
        k.box('carport', (x0 + x1) / 2, (y0 + y1) / 2, 2.8, 10.6, 10.6, 0.12)
        for i in range(10): k.box('tseam', x0 + 1.0 + i * 1.1, (y0 + y1) / 2, 2.93, 0.05, 10.4, 0.03)
        propane(1, 1, big=False); propane(0, 2); propane(4, 2)
        cx, cy = centre(2, 2)                                            # the car under a tarp in the lane
        k.box('tarp', cx, cy, 0.0, 4.6, 2.1, 1.4, 0.1); k.roof('tarp', cx, cy, 1.4, 4.4, 2.0, 0.2, 0.1)
        for (u, v) in ((-1.6, -1.05), (1.6, -1.05), (-1.6, 1.05), (1.6, 1.05)): k.tube('tyre', cx + u, cy + v, 0.0, 0.3, 0.65, 0.1)
        junk(2, 0); junk(0, 4); junk(4, 4)
        k.rgb('line', (210, 206, 196), 'tape_grey'); k.rgb('wash1', (150, 60, 44), 'clay_rust'); k.rgb('wash2', (66, 86, 98), 'clay_teal')
        for px_ in (13.5, 22.5): k.cyl('steel', px_, 40.0, 0.0, 0.08, 2.0)   # the clothesline in the north lane
        k.line('line', 13.5, 40.0, 22.5, 40.0, 0.02, 0.02, 1.95)
        for i in range(5): k.box('wash1' if i % 2 else 'wash2', 14.5 + i * 1.7, 40.0, 1.2, 0.8, 0.03, 0.75)
        k.rgb('swing', (176, 60, 44), 'clay_rust')                       # the swing stopped at the top of its swing (the horror)
        sx, sy = 56.0, 7.0
        for v in (-1.2, 1.2): k.line('steel', sx - 1.0, sy + v, sx, sy + v, 0.08, 0.08, 0.0); k.cyl('steel', sx - 1.0, sy + v, 0.0, 0.08, 2.4); k.cyl('steel', sx + 1.0, sy + v, 0.0, 0.08, 2.4)
        k.box('steel', sx, sy, 2.4, 0.1, 2.6, 0.1)
        k.box('swing', sx + 1.4, sy, 1.75, 0.5, 0.45, 0.05, 0.0, 0.0)
        k.line('steel', sx, sy - 0.2, sx + 1.4, sy - 0.2, 0.02, 0.02, 2.0); k.line('steel', sx, sy + 0.2, sx + 1.4, sy + 0.2, 0.02, 0.02, 2.0)
    elif bid == 'trailer.2':
        k.rgb('office', (200, 190, 170), 'clay_bone'); k.rgb('sign', (150, 60, 44), 'clay_rust'); k.rgb('laundry', (176, 172, 160), 'tape_grey')
        k.box('office', 12.0, 54.0, 0.0, 23.0, 10.5, 3.2)
        k.rgb('troof', (168, 168, 160), 'tape_grey'); k.box('troof', 12.0, 54.0, 3.2, 23.4, 11.0, 0.15)
        k.box('dark', 6.0, 48.7, 0.0, 1.2, 0.05, 2.1); k.rgb('glass', (40, 48, 52), 'glass_eye')
        for i in range(3): k.box('glass', 12 + i * 3.5, 48.7, 1.2, 2.0, 0.05, 1.2)
        k.cyl('steel', 2.0, 46.5, 0.0, 0.15, 4.5); k.box('sign', 2.0, 46.5, 4.0, 3.2, 0.2, 1.4)   # the park's sign
        cx, cy = centre(3, 2); k.box('laundry', cx, cy, 0.0, 9.0, 7.0, 3.0); k.roof('troof', cx, cy, 3.0, 9.6, 7.6, 1.0)
        k.box('dark', cx - 2.0, cy - 3.52, 0.0, 1.2, 0.05, 2.1)
        single_wide(k, 24.0, 18.0, 0.0, (190, 176, 150))                  # a trailer east-west across row 3, c1-c2
        propane(2, 1, big=False); propane(4, 1); propane(4, 3)
        k.rgb('mailbox', (150, 152, 150), 'chrome')                     # the mailbox bank
        x, y = centre(1, 2)
        for i in range(3): k.box('mailbox', x - 2 + i * 2, y, 0.0, 1.8, 0.5, 1.4)
        k.rgb('dumpster', (66, 86, 98), 'clay_teal'); x, y = centre(0, 2)
        for i in range(2): k.box('dumpster', x - 1.5 + i * 3.4, y + 1, 0.0, 3.0, 1.8, 1.4, 0.1 * i)
        k.scatter('board', x - 4, x + 4, y - 4, y + 4, 12, 0.2, 0.5, 0.3)
        junk(3, 4); junk(4, 1)
        k.rgb('boat', (196, 192, 180), 'tape_grey'); x, y = centre(1, 4)    # a boat on its trailer, a flat tyre
        k.tube('boat', x, y, 0.5, 5.5, 1.9, 0.3); k.tube('tyre', x, y - 1.0, 0.0, 0.3, 0.6, 0.3)


def joshua(k, x, y, hgt):
    """a Joshua tree: the shaggy trunk, branches turning up, each ending in a spiky crown (dull grey-olive, dry)"""
    k.rgb('jbark', (98, 86, 70), 'clay_bone'); k.rgb('jleaf', (112, 112, 88), 'metal_painted'); k.rgb('jdead', (126, 110, 84), 'clay_bone')
    k.cyl('jbark', x, y, 0.0, 0.6, hgt * 0.55)
    n = k.rng.randint(2, 5)
    for i in range(n):
        a = i * 6.28 / n + k.rng.uniform(-0.4, 0.4); L = k.rng.uniform(1.2, 2.4); z0 = hgt * 0.5
        ex, ey = x + L * math.cos(a), y + L * math.sin(a)
        k.line('jbark', x, y, ex, ey, 0.35, 0.35, z0); k.cyl('jbark', ex, ey, z0, 0.35, hgt * 0.35)
        for j in range(4): k.rock('jleaf', ex + k.rng.uniform(-0.3, 0.3), ey + k.rng.uniform(-0.3, 0.3), 0.95, 1.0, z=z0 + hgt * 0.35 + 0.1 + j * 0.25)
        k.rock('jdead', ex, ey, 1.1, 0.9, z=z0 + hgt * 0.28)                 # the dead leaf skirt under each crown


def boulders(k, x, y, n, big, mat='bould'):
    k.rgb('bould', (104, 98, 90), 'tape_grey'); k.rgb('bould_d', (76, 70, 64), 'rubber')
    for i in range(n): k.rock(mat if i % 2 else 'bould_d', x + k.rng.uniform(-2.5, 2.5), y + k.rng.uniform(-2.5, 2.5), big * k.rng.uniform(0.6, 1.1), 0.7)


def things_desert(k, bid):
    k.rgb('bould', (104, 98, 90), 'tape_grey'); k.rgb('bould_d', (76, 70, 64), 'rubber')
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('tyre', (34, 32, 31), 'rubber')
    T = BLOCKS[bid]['tiles']; M = BLOCKS[bid]['marks']
    for r in range(5):
        for c in range(5):
            pc = piece_of(bid, c, r); x, y = centre(c, r); x0, x1, y0, y1 = tile_m(c, r)
            if pc == 'desert_joshua': joshua(k, x + k.rng.uniform(-2, 2), y + k.rng.uniform(-2, 2), k.rng.uniform(5.0, 7.5)); joshua(k, x + 3.5, y - 3, 3.5)
            elif pc == 'desert_boulder': boulders(k, x, y, 7, 2.2)
            elif pc == 'desert_rocks': boulders(k, x, y, 9, 1.0)
            elif pc == 'desert_car':
                k.rgb('carbody', (150, 120, 90), 'clay_rust'); k.rgb('rust', (110, 60, 40), 'clay_rust')
                k.box('carbody', x, y, -0.5, 4.4, 1.9, 1.3, 0.4, 0.15); k.box('rust', x - 0.3, y, 0.8, 2.2, 1.7, 0.5, 0.4, 0.15)
                k.rgb('glass', (40, 48, 52), 'glass_eye'); k.box('glass', x + 0.6, y + 0.2, 0.9, 0.05, 1.5, 0.4, 0.4)
            if T[r][c] == 'H':                                        # the wash's cut bank: a lip of rock along its edge, creosote on top
                ex = x0 + 11.0 if c == 0 else x0 + 1.0
                for _ in range(10): k.rock('bould_d' if k.rng.rand() < 0.5 else 'bould', ex + k.rng.uniform(-0.8, 0.8), k.rng.uniform(y0, y1), k.rng.uniform(0.4, 0.9), 0.6)
            if T[r][c] == 'H' and pc is None:
                k.rgb('creo', (92, 90, 72), 'metal_painted')
                for _ in range(3): k.rock('creo', x + k.rng.uniform(-5, 5), y + k.rng.uniform(-5, 5), k.rng.uniform(0.6, 1.0), 0.8, z=0.2)
            if T[r][c] == 'r':                                        # a creosote thicket: slow, no cover (BB's forest floor)
                k.rgb('creo', (92, 90, 72), 'metal_painted')
                for _ in range(16): k.rock('creo', x + k.rng.uniform(-5.5, 5.5), y + k.rng.uniform(-5.5, 5.5), k.rng.uniform(0.6, 1.1), 0.8, z=0.1)
            if T[r][c] == '.' and pc is None and k.rng.rand() < 0.6:   # creosote on the flat, low (no cover: BB's grass)
                k.rgb('creo', (92, 90, 72), 'metal_painted')
                for _ in range(2): k.rock('creo', x + k.rng.uniform(-5, 5), y + k.rng.uniform(-5, 5), k.rng.uniform(0.4, 0.7), 0.8, z=0.1)
    if bid == 'desert.1':                                             # the pylon down: a 40 m lattice tower lying across the wash
        k.rgb('lattice', (140, 140, 136), 'tape_grey'); k.rgb('insul', (190, 196, 196), 'chrome'); k.rgb('wire', (50, 50, 50), 'rubber')
        x0, y0, x1, y1 = 58.0, 44.0, 22.0, 31.0                       # its foot east (r1 c4), its head across the wash (r2 c2)
        L = math.hypot(x1 - x0, y1 - y0); a = math.atan2(y1 - y0, x1 - x0); ca, sa = math.cos(a), math.sin(a)
        for i in range(4):                                             # the four legs, narrowing to the head
            for t in (0,):
                w0, w1 = 3.0, 0.9; v0 = (-1 if i % 2 else 1) * w0; v1 = (-1 if i % 2 else 1) * w1; z0, z1 = (0.2, 0.2) if i < 2 else (3.6, 1.6)
                ax, ay = x0 - v0 * sa, y0 + v0 * ca; bx_, by_ = x1 - v1 * sa, y1 + v1 * ca
                k.line('lattice', ax, ay, bx_, by_, 0.18, 0.18, (z0 + z1) / 2)
        for j in range(16):                                            # the cross bracing
            t = j / 16.0; w = 3.0 - 2.1 * t; px, py = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            k.line('lattice', px - w * sa, py + w * ca, px + w * sa, py - w * ca, 0.1, 0.1, 0.2 + (j % 2) * 2.4)
            k.line('lattice', px - w * sa, py + w * ca, px + (x1 - x0) / 16 + w * sa, py + (y1 - y0) / 16 - w * ca, 0.08, 0.08, 1.4)
        hx, hy = x1 - 2.0 * ca, y1 - 2.0 * sa                         # the cross arms at the head, their insulator strings
        k.line('lattice', hx - 9 * sa, hy + 9 * ca, hx + 9 * sa, hy - 9 * ca, 0.3, 0.3, 0.6)
        for v in (-8, -4, 4, 8):
            ix, iy = hx + v * -sa, hy + v * ca; k.box('insul', ix, iy, 0.3, 1.6, 0.3, 0.3, a)
        for v in (-8, 8):                                              # the conductors draped back over the desert
            ix, iy = hx - v * sa, hy + v * ca; k.line('wire', ix, iy, ix - 30 * ca, iy - 30 * sa + v * 0.4, 0.06, 0.06, 0.05)
        for i in range(8): k.box('dark', x0 + k.rng.uniform(-2, 2), y0 + k.rng.uniform(-2, 2), 0.0, 1.2, 0.8, 0.4, k.rng.uniform(0, 3))   # its torn footing
    if bid == 'desert.3':                                             # the bare caliche circle, nothing in it (the horror): drawn by the plan
        pass


def fin(k, x0, x1, y0, y1, levels, rng):
    """sandstone stacked in cross-bedded slabs up to levels storeys (3 m a storey): broad, rounded, its top flat to stand on"""
    k.rgb('aztec', (150, 92, 68), 'clay_rust'); k.rgb('aztec_d', (116, 70, 54), 'clay_rust'); k.rgb('aztec_l', (176, 128, 96), 'clay_rust')
    for kk in range(levels * 2):
        zt = kk * 1.5; m = 'aztec_d' if kk % 2 else 'aztec'
        for _ in range(4):
            x = rng.uniform(x0 + 2.5, x1 - 2.5); y = rng.uniform(y0 + 2.5, y1 - 2.5)
            k.rock(m, x, y, rng.uniform(4.0, 5.5) * (1 - kk * 0.04), 0.35, z=zt)
    for _ in range(3): k.rock('aztec_l', rng.uniform(x0 + 3, x1 - 3), rng.uniform(y0 + 3, y1 - 3), 4.5, 0.18, z=levels * 3.0 - 0.6)


def things_canyon(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber')
    B = BLOCKS[bid]; T = B['tiles']; lv = {(c, r): n for (c, r, n) in B.get('roofs', [])}
    for r in range(5):
        for c in range(5):
            x0, x1, y0, y1 = tile_m(c, r); x, y = centre(c, r)
            if T[r][c] == '#': fin(k, x0 - 0.5, x1 + 0.5, y0 - 0.3, y1 + 0.3, 4, k.rng)
            elif T[r][c] == 'H': fin(k, x0 + 0.3, x1 - 0.3, y0 + 0.3, y1 - 0.3, lv.get((c, r), 1), k.rng)
            elif T[r][c] == 'r': k.scatter('aztec_d', x0, x1, y0, y1, 18, 0.3, 1.1, 0.55)
            pc = piece_of(bid, c, r)
            if pc == 'canyon_boulder':
                for i in range(6): k.rock('aztec' if i % 2 else 'aztec_d', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), k.rng.uniform(1.2, 2.2), 0.7)
            elif pc == 'canyon_juniper':
                k.rgb('jun', (90, 78, 62), 'clay_rust'); k.rgb('jundead', (120, 100, 76), 'clay_bone')
                k.cyl('jun', x, y, 0.0, 0.5, 2.0)
                for i in range(6): k.rock('jundead', x + k.rng.uniform(-1.8, 1.8), y + k.rng.uniform(-1.8, 1.8), 1.3, 0.6, z=1.4 + k.rng.uniform(0, 1.2))
    if bid == 'canyon.1':                                             # the slot: its walls close, one man wide; the handprints climbing
        k.rgb('hand', (150, 50, 40), 'clay_rust')
        for i in range(7): k.box('hand', 25.0 + i * 0.4, 37.6, 1.2 + i * 1.4, 0.22, 0.04, 0.26)
        k.scatter('aztec_d', 26, 34, 25, 35, 14, 0.2, 0.6, 0.5)


def things_pass(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('glass', (40, 48, 52), 'glass_eye')
    k.rgb('lime', (122, 112, 98), 'tape_grey'); k.rgb('lime_d', (92, 84, 74), 'tape_grey'); k.rgb('rail', (170, 172, 168), 'chrome')
    k.rgb('pine', (70, 70, 56), 'metal_painted'); k.rgb('pinedead', (122, 98, 70), 'clay_bone')
    B = BLOCKS[bid]; T = B['tiles']; lv = {(c, r): n for (c, r, n) in B.get('roofs', [])}
    for r in range(5):
        for c in range(5):
            x0, x1, y0, y1 = tile_m(c, r); x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == '#':
                k.scatter('lime_d', x0 + 0.5, x1 - 0.5, y0 + 0.8, y1 - 0.8, 16, 4.0, 7.0, 0.8)
            elif T[r][c] == 'H':
                for kk in range(lv.get((c, r), 1)):
                    for _ in range(5): k.rock('lime' if kk % 2 else 'lime_d', k.rng.uniform(x0 + 3, x1 - 3), k.rng.uniform(y0 + 3, y1 - 3), 4.6, 0.3, z=kk * 3.0)
            elif T[r][c] in 'rd' and pc != 'pass_drop':
                k.scatter('lime_d', x0, x1, y0, y1, 40 if T[r][c] == 'r' else 60, 0.2, 0.8 if T[r][c] == 'r' else 1.4, 0.55)
            if pc == 'pass_boulder': boulders(k, x, y, 6, 2.4, 'lime')
            elif pc == 'pass_rail':                                      # the guard rail on its posts along the road's lip
                k.line('rail', x0, y1 - 2.0, x1, y1 - 2.0 + k.rng.uniform(-0.3, 0.3), 0.08, 0.35, 0.5)
                for i in range(6): k.cyl('steel', x0 + 1 + i * 2, y1 - 2.0, 0.0, 0.15, 0.8)
            elif pc == 'pass_drop':                                      # the drop: the slope falls away, dark, pines far below
                for _ in range(8): k.rock('lime_d', k.rng.uniform(x0, x1), k.rng.uniform(y0, y1), k.rng.uniform(0.8, 2.0), 0.5)
                for _ in range(3): k.rock('pine', k.rng.uniform(x0 + 1, x1 - 1), k.rng.uniform(y0 + 1, y1 - 3), k.rng.uniform(1.2, 2.0), 0.9, z=-0.4)
            elif pc == 'pass_car':
                k.rgb('car_c', (120, 132, 140), 'clay_teal'); k.box('car_c', x, y, 0.3, 4.4, 1.8, 1.1, 0.3); k.box('glass', x + 0.4, y + 0.1, 1.4, 1.6, 1.6, 0.4, 0.3)
                for (u, v) in ((-1.4, -0.9), (1.4, -0.9), (-1.4, 0.9), (1.4, 0.9)): k.tube('tyre', x + u, y + v, 0.0, 0.25, 0.6, 0.3)
    if bid == 'pass.1':                                                # the jackknife: the cab and its 16 m box folded across the road
        k.rgb('semibox', (196, 196, 190), 'tape_grey'); k.rgb('semicab', (150, 60, 44), 'clay_rust'); k.rgb('hazard', (226, 160, 80), 'sodium')
        k.box('semibox', 20.0, 30.0, 1.2, 16.0, 2.6, 2.9, 0.12)
        for u in (-6.5, -5.2):
            for v in (-1.2, 1.2): k.tube('tyre', 20 + u, 30 + v + u * 0.12, 0.0, 0.45, 1.0, 0.12 + math.pi / 2)
        k.box('semicab', 31.5, 26.5, 0.6, 3.2, 2.6, 2.6, -1.1); k.box('glass', 32.2, 25.0, 1.9, 2.2, 0.05, 0.8, -1.1)
        for v in (-1.3, 1.3): k.tube('tyre', 31.5 + v, 26.5 + 0.6 * v, 0.0, 0.45, 1.0, -1.1 + math.pi / 2)
        k.box('hazard', 30.5, 24.6, 1.0, 0.25, 0.1, 0.2, -1.1); k.box('hazard', 12.1, 29.0, 1.0, 0.1, 0.25, 0.2, 0.12)   # still blinking (the horror)
        k.rgb('cargo', (176, 150, 100), 'tape_masking')
        for _ in range(14): k.box('cargo', 10 + k.rng.uniform(-3, 4), 24 + k.rng.uniform(-3, 2), 0.0, 1.0, 0.8, 0.6 + k.rng.uniform(0, 0.5), k.rng.uniform(0, 3))
        x0, x1, y0, y1 = tile_m(3, 2)                                  # the rockfall over the road's other lane (debris: slow)
        k.scatter('lime', x0, x1, y0, y1, 40, 0.4, 2.0, 0.6); k.scatter('lime_d', x0 - 2, x1, y0 + 2, y1 + 6, 25, 0.8, 2.6, 0.6)
    if bid in ('pass.1', 'pass.2'):
        k.rgb('roadline', (196, 170, 90), 'clay_mustard')
        for i in range(10): k.box('roadline', 3 + i * 6, 29.8, 0.0, 3.0, 0.15, 0.02)


def boat_on_side(k, x, y, rz, length=8.0):
    k.rgb('hull', (196, 192, 180), 'tape_grey'); k.rgb('hull_d', (92, 88, 80), 'tape_grey'); k.rgb('antifoul', (120, 60, 50), 'clay_rust')
    k.tube('hull', x, y, 0.0, length, 2.6, rz, 1.1); k.tube('antifoul', x + 0.3 * math.sin(rz), y - 0.3 * math.cos(rz), 0.0, length * 0.9, 1.6, rz, 1.1)
    k.box('hull_d', x - 0.8 * math.sin(rz), y + 0.8 * math.cos(rz), 0.6, length * 0.5, 0.2, 1.6, rz, 1.1)


def things_lakebed(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('glass', (40, 48, 52), 'glass_eye')
    k.rgb('dock', (128, 112, 92), 'clay_bone'); k.rgb('float', (170, 166, 152), 'tape_grey'); k.rgb('pile', (60, 56, 52), 'rubber')
    k.rgb('buoy', (196, 96, 50), 'clay_rust'); k.rgb('drum_w', (180, 178, 170), 'tape_grey')
    k.rgb('mudrock', (140, 132, 118), 'tape_grey')
    B = BLOCKS[bid]; T = B['tiles']
    for r in range(5):
        for c in range(5):
            x0, x1, y0, y1 = tile_m(c, r); x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == 'H' and bid != 'lakebed.3' or (bid == 'lakebed.3' and r == 3 and T[r][c] == 'H'):   # a dead dock on the dry bed: its deck to climb
                k.box('float', x, y, 0.0, 10.6, 3.2, 0.9)
                for i in range(26): k.box('dock', x0 + 0.8 + i * 0.4, y, 0.9, 0.32, 3.3, 0.08)
                for i in range(3): k.box('float', x0 + 2 + i * 4, y + 3.4, 0.0, 1.4, 3.8, 0.9); k.cyl('pile', x0 + 2 + i * 4, y - 1.8, 0.0, 0.35, 3.6)
            if pc == 'shore_boat': boat_on_side(k, x, y, k.rng.uniform(-0.4, 0.4), k.rng.uniform(7, 9))
            elif pc == 'shore_junk':
                for i in range(5): k.cyl('buoy' if i % 2 else 'drum_w', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), 0.0, 0.7, 0.9)
                k.tube('drum_w', x + 2, y - 2, 0.0, 1.0, 0.7, 0.7)
            elif pc == 'shore_car':
                k.rgb('truck', (120, 120, 116), 'tape_grey'); k.box('truck', x - 3, y, 0.4, 5.5, 2.1, 1.6, 0.0)
                k.box('glass', x - 1.6, y, 1.6, 0.05, 1.8, 0.6)
                k.rgb('hull', (196, 192, 180), 'tape_grey'); k.tube('hull', x + 3.5, y, 0.6, 6.0, 2.0, 0.0)
                for (u, v) in ((-4.6, -1), (-1.6, -1), (-4.6, 1), (-1.6, 1), (3.5, -1), (3.5, 1)): k.tube('tyre', x + u, y + v, 0.0, 0.3, 0.75, 0.0)
            if T[r][c] == 'w': k.scatter('mudrock', x0, x1, y0, y1, 3, 0.2, 0.5, 0.5)
    if bid == 'lakebed.1':                                             # the intake tower, high and dry: its shaft, its gallery, its gates
        k.rgb('tower', (176, 172, 162), 'clay_bone'); k.rgb('tower_d', (120, 116, 108), 'tape_grey'); k.rgb('stain', (90, 86, 76), 'tape_grey')
        x, y = centre(2, 2)
        k.cyl('tower', x, y, 0.0, 9.0, 11.0); k.cyl('tower_d', x, y, 11.0, 10.0, 0.6); k.cyl('tower', x, y, 11.6, 6.0, 3.0)
        k.cyl('stain', x, y, 0.0, 9.1, 4.0)                            # the lake's own line round its foot
        for i in range(4):
            a = i * math.pi / 2 + math.pi / 4; k.box('dark', x + 4.52 * math.cos(a), y + 4.52 * math.sin(a), 1.0, 0.1, 1.8, 2.4, a)
        k.box('steel', x, y + 9.0, 10.8, 1.8, 10.0, 0.4)                # its bridge to the old shore, broken off
        for i in range(6): k.box('mudrock', x + k.rng.uniform(-6, 6), y + k.rng.uniform(-6, -3), 0.0, 1.2, 0.8, 0.4, k.rng.uniform(0, 3))
    if bid == 'lakebed.3':                                             # the white bathtub ring (a step up) and a second one far above it
        k.rgb('ringcrust', (224, 222, 214), 'tape_grey'); k.rgb('ringrock', (196, 194, 186), 'tape_grey')
        for i in range(70): k.rock('ringcrust' if i % 3 else 'ringrock', k.rng.uniform(0, 60), k.rng.uniform(37.5, 46.5), k.rng.uniform(1.4, 2.6), 0.45, z=0.2)
        k.rgb('store', (176, 164, 140), 'clay_bone'); x, y = centre(2, 4)
        k.box('store', x, y, 0.0, 10.0, 9.0, 3.4); k.roof('tower_d' if 'tower_d' in k.M else 'store', x, y, 3.4, 10.6, 9.6, 1.0)
        k.rgb('ramp', (166, 162, 154), 'tape_grey')


def things_wash(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('glass', (40, 48, 52), 'glass_eye')
    k.rgb('wconc', (168, 164, 154), 'tape_grey'); k.rgb('wconc_d', (128, 124, 116), 'tape_grey'); k.rgb('cart', (176, 178, 176), 'chrome')
    k.rgb('sofa', (120, 84, 70), 'clay_rust'); k.rgb('tarp', (66, 86, 98), 'clay_teal'); k.rgb('tent', (150, 120, 70), 'clay_mustard')
    B = BLOCKS[bid]; T = B['tiles']
    def carts(x, y, n=3):
        for i in range(n):
            cx, cy, a = x + k.rng.uniform(-2.5, 2.5), y + k.rng.uniform(-2.5, 2.5), k.rng.uniform(0, 3)
            k.box('cart', cx, cy, 0.3 if i % 3 else 0.0, 0.9, 0.55, 0.8, a, 0.0 if i % 3 else 1.3)
    for r in range(5):
        for c in range(5):
            x0, x1, y0, y1 = tile_m(c, r); x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == 'H' and bid != 'wash.4':                     # the channel's high bank: a concrete levee one level up
                k.box('wconc', x, y, 0.0, 12.0, 12.0, 2.6)
                k.box('wconc_d', x + (5.2 if c == 0 else -5.2), y, 0.0, 1.6, 12.0, 2.62, 0.0, 0.0)
                if c == 0: k.box('steel', x - 5.5, y, 2.6, 0.08, 12.0, 1.0)
            if pc == 'wash_carts': carts(x, y)
            elif pc == 'wash_sofa':
                k.box('sofa', x, y, 0.0, 2.2, 0.9, 0.5, 0.5, 0.15); k.box('sofa', x - 0.4 * math.sin(0.5), y + 0.4 * math.cos(0.5), 0.4, 2.2, 0.25, 0.6, 0.5, 0.15)
                carts(x + 3, y - 3, 1)
            elif pc == 'wash_tents':
                for i in range(2): tx, ty = x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3); k.roof('tent' if i else 'tarp', tx, ty, 0.0, 2.8, 2.2, 1.3, k.rng.uniform(0, 3))
                carts(x + 2, y - 2, 2); k.box('tarp', x - 2, y + 2, 0.0, 3.0, 2.0, 0.05, 0.3, 0.1)
            elif pc == 'wash_car':
                k.rgb('car_w', (150, 140, 120), 'clay_bone'); k.box('car_w', x, y, 0.3, 4.6, 1.9, 1.2, 0.2); k.box('glass', x + 0.4, y + 0.1, 1.5, 1.8, 1.7, 0.4, 0.2)
                for (u, v) in ((-1.5, -0.95), (1.5, -0.95), (-1.5, 0.95), (1.5, 0.95)): k.tube('tyre', x + u, y + v, 0.0, 0.25, 0.65, 0.2)
            elif pc == 'wash_oleander':
                k.rgb('olea', (104, 96, 74), 'clay_bone'); k.rgb('olea_d', (84, 76, 60), 'clay_bone')
                for i in range(9): k.rock('olea' if i % 2 else 'olea_d', x + k.rng.uniform(-4.5, 4.5), y + k.rng.uniform(-4.5, 4.5), k.rng.uniform(1.0, 1.6), 0.8)
            elif pc == 'wash_fence':
                chainlink(k, x0 + 0.6, y0 + 0.6, x1 - 0.6, y1 - 0.6, 2.0, wire=False)
    if bid == 'wash.2':                                                # the road embankment over the culvert, its three barrels
        k.box('wconc', 30.0, 30.0, 0.0, 36.0, 12.0, 2.6)                # the road's fill, the H banks either side join it
        k.rgb('asph', (70, 68, 64), 'rubber'); k.box('asph', 30.0, 30.0, 2.6, 60.0, 9.0, 0.08)
        k.box('steel', 30.0, 25.6, 2.6, 60.0, 0.1, 0.9); k.box('steel', 30.0, 34.4, 2.6, 60.0, 0.1, 0.9)
        for bx_ in (18.0, 30.0, 42.0): k.box('dark', bx_, 23.99, 0.0, 3.0 if bx_ == 30.0 else 2.4, 0.05, 2.0)   # the barrels' mouths
        k.rgb('foot', (60, 50, 44), 'rubber')
        for i in range(9): k.box('foot', 30.0 + (0.25 if i % 2 else -0.25), 10.0 + i * 1.5, 0.0, 0.18, 0.3, 0.01)   # bare feet in, none out
    if bid in ('wash.2', 'wash.3'):
        k.scatter('wconc_d', 26, 34, 0, 60, 14, 0.2, 0.6, 0.5)


THINGS = {'lab': things_lab, 'apron': things_apron, 'golf': things_golf, 'trailer': things_trailer, 'desert': things_desert,
          'canyon': things_canyon, 'pass': things_pass, 'lakebed': things_lakebed, 'wash': things_wash}


def install():
    NB, EG, NF, F = rig()
    EG.install()
    for bid, spec in BLOCKS.items():
        NB.BLOCKS[bid] = dict(name=spec['name'], tiles=spec['tiles'], cover=[], lights=[])
    _plan, _things = NB.plan, NB.things
    def plan_(bid, F_):
        return plan(bid, F_) if bid in BLOCKS else _plan(bid, F_)
    def things_(bpy, g, h, bid, seed):
        if bid not in BLOCKS: return _things(bpy, g, h, bid, seed)
        k = Kit(bpy, NF, F, g, h, seed)
        THINGS[bid.split('.')[0]](k, bid)
        return k.objects(NB.ico2(bpy)), []
    NB.plan, NB.things = plan_, things_
    NB.BASE = BASE
    return NB


def render(bid, quick=False):
    NB = install()
    NB.render('present', bid, quick)


# ======================================================================================================================
# THE BOARD SIDE (plain python)
# ======================================================================================================================
def file_of(bid):
    return 'block_%s.webp' % bid.replace('.', '_')


def swap(bid):
    src = os.path.join(BASE, 'present', file_of(bid))
    a = Image.open(src).convert('RGB'); assert a.size == (2575, 1820), a.size
    dst = os.path.join(SHIP, file_of(bid)); a.save(dst, quality=76, method=6)
    print('  swapped', bid, '->', os.path.relpath(dst, R), os.path.getsize(dst) // 1024, 'KB', flush=True)


def built_blocks():
    return [b for b in BLOCKS if os.path.exists(os.path.join(SHIP, file_of(b)))]


def data():
    """each place's blocks into fight_ground.json (one named board a place, its blocks in its default layout, so the fight's
    block library holds them), the pieces into cover_extra (baked: no sprite), the roofs into ours.roof_storeys, and the
    places themselves into ours.place_boards (the fight deals from it, the gate measures it)"""
    p = os.path.join(SHIP, 'fight_ground.json'); G = json.load(open(p))
    have = set(built_blocks())
    for k, d in PIECES.items():
        G['cover_extra'][k] = dict(d, baked=True, by='tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py')
    span = TM * BT
    for pid, P in PLACES.items():
        if not P.get('built'): continue
        cols, rows = P.get('cols') or {}, P.get('rows') or {}
        blocks = [P['landmark_block']] + P['field'] + sum(cols.values(), []) + sum(rows.values(), [])
        new = sorted(set(b for b in blocks if b in BLOCKS))
        if not all(b in have for b in new): P['built'] = False; continue
        def pick(by, bx):
            L = cols.get(bx) or rows.get(by) or P['field']; return L[(bx + by) % len(L)]
        lay = [[pick(by, bx) for bx in range(4)] for by in range(3)]
        lay[int(max(P['landmark_rows'], key=lambda k: P['landmark_rows'][k]))][P['landmark_col']] = P['landmark_block']
        for b in set(blocks) - set(x for r_ in lay for x in r_):        # every block of the place in its board (the library reads it)
            lay[0][3 if lay[0][3] != P['landmark_block'] else 2] = b
        terr, cover = [], []
        for by in range(3):
            for r in range(5):
                row = []
                for bx in range(4):
                    bid = lay[by][bx]
                    if bid in BLOCKS: row += [CODE[ch] for ch in BLOCKS[bid]['tiles'][r]]
                    else: row += old_tiles(G, bid)[r]
                terr.append(row)
        for by in range(3):
            for bx in range(4):
                bid = lay[by][bx]
                if bid in BLOCKS:
                    for r in range(5):
                        for c in range(5):
                            pc = piece_of(bid, c, r)
                            if pc: cover.append(dict(piece=pc, x_m=round(bx * span + c * TM + TM / 2, 2), y_m=round(by * span + r * TM + TM / 2, 2)))
                else:
                    cover += old_cover(G, bid, bx, by)
        G['boards']['place_' + pid] = dict(blocks=lay, terrain=terr, cover=cover, lights=[])
        for b in new: G['blocks'][b] = dict(src=file_of(b))
    G.setdefault('made_11_3', {})['combat_maps_3'] = dict(tool='tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py',
        names={b: v['name'] for b, v in BLOCKS.items()}, futures='the fight reads no futures picture; only the present is rendered')
    json.dump(G, open(p, 'w'), indent=1)
    O = json.load(open(OURS))
    rs = O['roof_storeys']['value']
    for bid, spec in BLOCKS.items():
        if spec.get('roofs'): rs['blocks'][bid] = [list(q) for q in spec['roofs']]
    for k in ('apron', 'golf'):
        if k not in rs['roof_kinds']: rs['roof_kinds'].append(k)
    rs.setdefault('not_roofs', {})['apron.0'] = [[3, 3]]                     # the air-stairs truck's platform is no roof
    rs['not_roofs']['golf.0'] = [[4, 1]]                                     # the tee box is a rise of ground
    places = {}
    for pid, P in PLACES.items():
        q = {k: v for k, v in P.items()}
        q['gate_district'] = GATE_DISTRICT[pid]
        places[pid] = q
    O['place_boards'] = dict(value=dict(places=places, wide_extra=2),
        source='records/BOHEMIA_PAOLO_THE_FIGHT_MAPS_ARE_NOT_DONE_TRUE_VARIETY_11_3_26.md (rule 341, ask line 350)',
        quote="everything just looked exactly the same as the main suburb shit we have... nothing made them uniquely unique, nothing made them fun to do... no variety, like true variety",
        why='COMBAT MAPS 3: a place with built: true deals only its own blocks (its landmark between the lines in a row the deal '
            'picks, its field blocks round it, mirrored or not, never beside its twin) and starts the two sides by its own '
            'weights (line; wide: their line wide_extra tiles farther off; camp: round the landmark; pincer: both flanks). '
            'Every place names its landmark, its things and its twist (gates/every_place_its_own_board_gate.js reads them). '
            'An unbuilt place deals as before. TUNING may move the weights.',
        draft=True)
    json.dump(O, open(OURS, 'w'), indent=1)
    man = dict(about='COMBAT MAPS 3 11/3: every place its own board (tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py)',
               pieces={b: dict(src=file_of(b), exception='rendered through the master rig like every fight block since 10/19 (rule 121(j), rule 123): '
                       'the floor tool\'s ground with COMBAT MAPS 2\'s grounds, the not-final tool\'s junk and grime, modelled things; no pack tile is cut into it')
                       for b in sorted(have)})
    json.dump(man, open(os.path.join(SHIP, 'combat_maps_3_11_3.json'), 'w'), indent=1)
    print('  data: places built', [k for k, v in PLACES.items() if v.get('built')], 'blocks', sorted(have))


def old_tiles(G, bid):
    base, flip = bid.split('|')[0], '|h' in bid
    for B in G['boards'].values():
        for by, row in enumerate(B['blocks']):
            for bx, n in enumerate(row):
                if n == base:
                    t = [B['terrain'][by * 5 + r][bx * 5:(bx + 1) * 5] for r in range(5)]
                    return [list(reversed(x)) for x in t] if flip else t
    raise KeyError(bid)


def old_cover(G, bid, bx, by):
    base, flip = bid.split('|')[0], '|h' in bid; span = TM * BT
    for B in G['boards'].values():
        for oy, row in enumerate(B['blocks']):
            for ox, n in enumerate(row):
                if n == base:
                    out = []
                    for c in B.get('cover', []):
                        if ox * span <= c['x_m'] < (ox + 1) * span and oy * span <= c['y_m'] < (oy + 1) * span:
                            x = c['x_m'] - ox * span; y = c['y_m'] - oy * span
                            if flip: t = int(x // TM); x = (BT - 1 - t) * TM + (x - t * TM)
                            out.append(dict(piece=c['piece'], x_m=round(x + bx * span, 2), y_m=round(y + by * span, 2)))
                    return out
    return []


CARD_SAYS = {
    'lab': ('The lab yard is its own board now, rows of chain-link beast pens (one burst open from inside), decon showers, gurneys '
            'and the cold-store truck, and you can shoot through the fences but not walk through them, so the fight is lanes and gates.'),
    'airport': ('The airport is its own board now, open slab with a commuter plane wrecked on its belly in the middle, a hangar roof '
                'three storeys up and the cart trains, and their line usually starts far off, so the wreck is the cover everybody runs for.'),
    'golf': ('The golf course is its own board now and dead, the clubhouse with a roof you can climb, the carts, a brown 18th green '
             'with its flag, bunkers and a dry pond that slow you, no green anywhere, and sometimes they come at you from both flanks.'),
}


def cards():
    """one card a place: BEFORE (COMBAT MAPS 2's after shot, the board on main) | AFTER (the opening view) | IN PLAY"""
    from PIL import ImageDraw, ImageFont
    L = json.load(open(os.path.join(BASE, 'shots', 'shots.json')))
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
    except Exception: font = ImageFont.load_default()
    out = {}
    for pid, m in L.items():
        old = Image.open(os.path.join(R, 'records/target/combat_maps_11_2c/ground_%s.webp' % m['district'])).convert('RGB')
        before = old.crop((old.width - 390, old.height - 844, old.width, old.height))
        after = Image.open(os.path.join(R, m['after'])).convert('RGB'); play = Image.open(os.path.join(R, m['play'])).convert('RGB')
        C = Image.new('RGB', (390 * 3 + 16, 844 + 40), (14, 13, 12)); d = ImageDraw.Draw(C)
        for i, (im, t) in enumerate(((before, 'BEFORE (on main)'), (after, 'AFTER: ITS OWN BOARD'), (play, 'IN PLAY, ROUND %d' % m['round']))):
            C.paste(im, (i * 398, 40)); d.text((i * 398 + 8, 11), t, fill=(236, 226, 196), font=font)
        fn = os.path.join(BASE, 'card_%s.webp' % pid); C.save(fn, quality=82, method=6); out[pid] = os.path.relpath(fn, R)
        print('  card', pid, os.path.getsize(fn) // 1024, 'KB')
    return out


def first_of(pid):
    """the card's FIRST picture (the VOTE tab's rule 89: one thing, one phone screen): the AFTER panel of its card"""
    fn = os.path.join(BASE, 'first_%s.webp' % pid)
    Image.open(os.path.join(BASE, 'card_%s.webp' % pid)).convert('RGB').crop((398, 40, 788, 884)).save(fn, quality=82, method=6)
    return '../' + os.path.relpath(fn, R)


def register(sha, ids):
    rp = os.path.join(R, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
    L = json.load(open(os.path.join(BASE, 'shots', 'shots.json')))
    said = ('everything just looked exactly the same as the main suburb shit we have and then you gave a bunch of greenery to the '
            'suburb, bro this is an economic apocalypse, nothing made them uniquely unique, nothing made them fun to do, no variety, '
            'like true variety... you\'re not done')
    new = []
    for pid in ids:
        P = PLACES[pid]
        new.append(dict(id='combat-place-%s-11-3' % pid, kind='redo', redoOf='combat-ground-%s-11-2' % L[pid]['district'], lane='combat', sha=sha,
                        made='11/3', draft=True, title='%s: ITS OWN BOARD' % P['name'], said=said,
                        why=CARD_SAYS[pid] + ' You see it here before, after and in play on the phone, and in every fight there on the map.',
                        options=['A, yes, that is the place and it plays different', 'B, the place reads but push the twist further',
                                 'C, no, still too much like the others'],
                        show=dict(how='image', src='../records/target/combat_maps_11_3/card_%s.webp' % pid,
                                  first=first_of(pid), firstAt=[398, 40, 390, 844]),
                        before_after=dict(before='the old board (COMBAT MAPS 2: its own floor under the shared plan)',
                                          after='its own board: %s' % P['landmark'].split(':')[0].lower(), scale='his phone, 390 x 844, by day, the fight\'s opening view and a few rounds in')))
    txt = open(rp).read()
    for it in new:                                           # a re-run replaces its own item, found by its id
        blk = ',\n' + '\n'.join('  ' + ln for ln in json.dumps(it, indent=1, ensure_ascii=False).split('\n'))
        mark = ',\n  {\n   "id": "%s"' % it['id']
        if mark in txt:
            i = txt.index(mark); j = txt.index('\n  }', i + len(mark)) + len('\n  }'); txt = txt[:i] + blk + txt[j:]
        else:
            j = txt.index('\n ],\n "verdicts"'); txt = txt[:j] + blk + txt[j:]
    open(rp, 'w').write(txt); json.loads(txt)
    print('  registered', [n['id'] for n in new])


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == '--data': data()
    elif a[0] == '--cards': cards()
    elif a[0] == '--register': register(a[1], a[2:])
    elif a[0] == '--swap':
        for b in a[1:]: swap(b)
    elif a[0] == '--render':
        render(a[1], '--quick' in a)
    sys.stdout.flush(); os._exit(0)
