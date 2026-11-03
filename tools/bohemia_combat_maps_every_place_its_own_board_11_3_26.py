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
        landmark_block='apron.1', field=['apron.2', 'apron.4'], rows={0: ['apron.3']}, mirror=True, landmark_col=1, landmark_rows={'1': 3, '2': 1},
        camp_tile=[4, 2], starts={'wide': 2, 'camp': 1, 'line': 1}),
    'golf': dict(name='THE GOLF COURSE', districts=['golf', 'park'], built=True,
        landmark='THE CLUBHOUSE AND THE 18TH: the stucco clubhouse, its torn awning over the patio, the carts in their row, the dead green and its flag',
        things='the clubhouse, golf carts, the flag on a dead green, a ball washer, bunkers, the dry water hazard, a stand of dead pines',
        twist='SAND AND ROOFS: the bunkers and the dry pond are slow ground in the open; the clubhouse roof is the one height, '
              'and they may come from both flanks (an ambush from the trees and the carts)',
        horror='the flag on the dead green stands straight out in a wind that moves nothing else',
        landmark_block='golf.1', field=['golf.2'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'pincer': 1, 'wide': 1}),
    'trailer': dict(name='THE TRAILER PARK', districts=['trailer'], built=True,
        landmark='THE ROWS: single-wides on their blocks end to end, one burnt to its frame, a carport roof between two of them',
        things='trailers on blocks, propane tanks, a carport, a clothesline, a swing set, mailboxes, the park office and its laundry',
        twist='A MAZE: lanes one man wide between trailers you cannot see through, so it is close, melee ground and chokepoints; '
              'the carport roof is the one height, and they are often already in among the rows',
        horror='the washing on the line is spotless white, pegged out fresh, the only clean thing in the park (COOK PROPS\' wrong thing)',
        landmark_block='trailer.1', field=['trailer.2'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'camp': 2, 'pincer': 1, 'line': 1}),
    'desert': dict(name='THE DESERT', districts=['desert'], built=True,
        landmark='THE PYLON: a high-voltage lattice tower fallen across a dry wash, its lines on the ground, Joshua trees round it',
        things='Joshua trees, boulders, a dead car half buried, the fallen pylon and its draped lines, the dry wash',
        twist='THE LOW GROUND: open flat desert cut by a dry wash between the lines; the wash is soft sand (slow), its banks a step up, '
              'so whoever holds a bank shoots down on whoever crosses; their line starts far off on the open flat',
        horror='the half-buried car\'s headlights are on (COOK PROPS\' wrong thing); one perfect bare circle of caliche on the flat',
        landmark_block='desert.1', field=['desert.3'], cols={1: ['desert.2']}, mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'wide': 2, 'line': 1, 'camp': 1}),
    'redrock': dict(name='RED ROCK', districts=['springs'], built=True,
        landmark='THE FIN AND THE SLOT: a sandstone fin split by a slot canyon one man wide, its flanks stepping up in ledges',
        things='the fin, ledges one, two and three storeys up, the slot canyon, slickrock terraces, boulders, a dead juniper',
        twist='REAL HEIGHT: ledges one, two and three storeys up (higher hits harder and sees farther, rule 321), a climb costs the '
              'turn\'s attack (rule 328), and the slot through the fin is one man wide',
        horror='on top of the highest ledge, where nobody could climb, a cairn of stones somebody stacked (COOK PROPS\' wrong thing)',
        landmark_block='canyon.1', field=['canyon.2'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'camp': 1, 'pincer': 1}),
    'pass': dict(name='THE PASS', districts=['mountain'], built=True,
        landmark='THE JACKKNIFE: a semi folded across the road under the cut, a rockfall heaped over the other lane (climb it for the shot)',
        things='the switchback road, the guard rail, a rockfall, a jackknifed truck, the cut face and its scree, the drop',
        twist='A ROAD ON A SLOPE: the road is the only fast ground, the high side is slow scree and ledges, the low side the drop no '
              'man walks; the jackknife closes the road and the rockfall is a heap you climb to shoot down the grade',
        horror='the jackknifed trailer is empty and white inside, spotless, in a valley of dust (COOK PROPS\' wrong thing)',
        landmark_block='pass.1', field=['pass.2'], rows={0: ['pass.3']}, mirror=True, landmark_col=1, landmark_rows={'1': 2, '2': 1},
        camp_tile=[4, 2], starts={'pincer': 2, 'line': 1}),
    'shore': dict(name='THE SHORE', districts=['reservoir', 'dam'], built=True,
        landmark='THE INTAKE TOWER: the lake\'s concrete intake standing high and dry on the cracked bed, a dead dock beside it',
        things='the intake tower, dead docks standing on dry land, a boat on its side, the mud and the last of the water, the white bathtub ring',
        twist='THE MUD: the receded lake\'s mud and its last shallows are swamp (slow, and a man fights worse standing in it); the '
              'white bathtub ring is a step up onto the old shore, and the docks are decks to climb',
        horror='a runabout\'s anchor line runs taut down into the dry mud (COOK PROPS\' wrong thing); a second bathtub ring far above the first',
        landmark_block='lakebed.1', field=['lakebed.2'], rows={0: ['lakebed.2'], 2: ['lakebed.3']}, mirror=True, landmark_col=1, landmark_rows={'1': 1},
        camp_tile=[4, 2], starts={'line': 1, 'camp': 1, 'wide': 1}),
    'wash': dict(name='THE WASH', districts=['wash', 'basin'], built=True,
        landmark='THE CULVERT: the concrete flood channel running under a road embankment through three box barrels',
        things='the concrete channel, its high banks, the culvert, shopping carts, a sofa in the silt, a camp\'s tarps and tents on the bank',
        twist='THE CHANNEL: a low concrete channel between two high banks runs between the lines; its silt floor is slow, the banks '
              'are height, and the culvert is the one way through under the road: one man wide, and cover inside it',
        horror='a floor lamp stands lit beside the sofa in the silt, plugged into nothing (COOK PROPS\' wrong thing)',
        landmark_block='wash.2', field=['wash.4'], cols={1: ['wash.3']}, mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'pincer': 1, 'camp': 1}),
    'landfill': dict(name='THE LANDFILL', districts=['landfill'], built=True,
        landmark='THE FLARE: the landfill gas flare still burning on its pad among the trash mounds, a dozer stopped mid-push',
        things='trash mounds, the gas flare and its burning ground, a dozer, the gas wells and their header pipe',
        twist='HILLS AND FIRE: the trash mounds are height you climb for the shot, and the gas round the flare burns the ground '
              'from the first round (a man who ends his turn in it takes 15 to 30)',
        horror='the flare is still burning, years after anyone paid for the gas (COOK PROPS\' wrong thing)',
        landmark_block='dump.1', field=['dump.2'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'camp': 1, 'wide': 1}),
    'suburb': dict(name='THE SUBURBS', districts=['suburb', 'estate', 'gated', 'town', 'school', 'chapel', 'library'], built=True,
        landmark='THE BACKYARDS: the split-face block walls of a row of backyards, their kidney pools dug in and empty',
        things='cinder-block yard walls, empty pools, a swing set, a trampoline frame, the ranch houses, dead brown lawns',
        twist='WALLS AND PITS: the yard walls are cover you fight along and over, and an empty pool is a pit (slow to cross, '
              'nothing to hide behind in it); the houses are roofs',
        horror='two fingers of perfectly clear water in the deep end of one empty pool (COOK PROPS\' wrong thing)',
        landmark_block='yards.1', field=['yards.2'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'pincer': 1, 'camp': 1}),
    'strip': dict(name='THE STRIP', districts=['strip', 'sign', 'sphere', 'strat', 'convention'], built=True,
        landmark='THE BOULEVARD: Las Vegas Boulevard running down between the two lines, its pedestrian bridge across it, the '
                 'Welcome sign dead in its median, the casino frontages on both sides',
        things='the Welcome sign, the pedestrian bridge, porte-cocheres with their dead marquees, the plaza fountain, the fallen '
               'arrow sign, a dead LED tower, slot machines spilled out of a broken entrance, a stretch limo, cabs, a tour bus, dead palms',
        twist='THE KILL ZONE: six lanes of open boulevard between the lines, its cover the dead cars, the median\'s planters and the '
              'sign; the bridge is a perch two storeys up in the middle of it and the porte-cochere roofs are the perches on each side',
        horror='one bulb of the hundred on the fallen arrow sign is still lit (COOK PROPS\' wrong thing)',
        landmark_block='blvd.1', field=['blvd.2'], cols={0: ['stripw.1', 'stripw.2', 'stripw.3'], 1: ['blvd.2'], 2: ['stripe.1', 'stripe.2'], 3: ['stripw.2', 'stripw.3', 'stripw.1']},
        mirror=False, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1}, camp_tile=[4, 2], starts={'line': 1, 'wide': 1, 'camp': 1}),
    'downtown': dict(name='DOWNTOWN', districts=['downtown'], built=True,
        landmark='FREMONT STREET: the old casino fronts at street level under the canopy\'s bare steel vault, the cowboy on his '
                 'front, the dead screen panels fallen into the street, one still lit',
        things='the canopy\'s frame and its fallen screen, the casino fronts\' marquees and dead neon, kiosks, a stage, the zipline\'s '
               'landing tower; Fremont East\'s motel with its empty pool and its sign, a pawn shop, a parking garage, a wedding chapel, '
               'the burnt Deuce; the south side\'s roofs stepping up, the alley, Ogden Avenue',
        twist='ROOF TO ROOF (his: \'you traverse from rooftop to rooftop... accuracy... depending on your height\'): the south side\'s '
              'shops, its backs and the garages are walked roof to roof, one to three storeys, height for accuracy; the mall between '
              'the fronts is the open ground, the motel\'s walkway and the garage decks the high ground on Fremont East',
        horror='one panel of the dead canopy screen is still showing a picture (COOK PROPS\' wrong thing)',
        landmark_block='fremont.12', field=['fremont.13'], rows={0: ['fremont.10', 'fremont.11'], 1: ['fremont.13'], 2: ['fremont.14', 'fremont.15']},
        mirror=True, landmark_col=1, landmark_rows={'1': 1}, camp_tile=[4, 2], starts={'line': 1, 'pincer': 1, 'camp': 1}),
    'works': dict(name='THE WORKS', districts=['industrial', 'rail', 'railyard', 'warehouse', 'storage'], built=True,
        landmark='THE CARS AND THE GANTRY: a boxcar and a black tank car on the spur, a yard gantry crane with a car hanging from its hook',
        things='a boxcar, a tank car, the gantry crane, a shop\'s machines dragged out, stacked pipe, the spur\'s ties and ballast',
        twist='THE RAIL CARS: the cars on the spur are a wall across the yard with one crossing between them, and the stacked pipe '
              'and the gantry\'s legs are the cover either side of it',
        horror='a car hangs from the gantry\'s hook over your heads (COOK PROPS\' wrong thing)',
        landmark_block='rail.1', field=['rail.2'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'line': 1, 'camp': 1, 'pincer': 1}),
    'marina': dict(name='THE MARINA', districts=['water', 'intake'], built=True,
        landmark='THE HOUSEBOAT: a Lake Mead houseboat sat down on the dry bed on its pontoons, its top deck to climb',
        things='the houseboat, cabin cruisers on their keels, bass boats on their trailers, the dry marina bed',
        twist='BOATS ON OPEN MUD: the dry bed is open ground and the boats are the only cover on it; the houseboat\'s top deck is '
              'the one height',
        horror='a fresh towel lies at the foot of the houseboat\'s slide (COOK PROPS\' wrong thing)',
        landmark_block='basin.1', field=['basin.2'], mirror=True, landmark_col=1, landmark_rows={'0': 1, '1': 2, '2': 1},
        camp_tile=[4, 2], starts={'wide': 1, 'line': 1, 'camp': 1}),
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
    'trailer_propane': dict(kind='COVER', h=1.6, name='PROPANE TANKS', by_props='trailer.propane'),
    'trailer_car':  dict(kind='COVER', h=1.5, name='A CAR UNDER A TARP'),
    'trailer_junk': dict(kind='LOW_COVER', h=1.0, name='A YARD\'S JUNK'),
    'trailer_bins': dict(kind='COVER', h=1.4, name='DUMPSTERS'),
    'trailer_mail': dict(kind='LOW_COVER', h=1.2, name='MAILBOXES'),
    'desert_joshua': dict(kind='COVER', h=2.0, name='JOSHUA TREE'),
    'desert_boulder': dict(kind='COVER', h=1.7, name='BOULDERS', by_props='desert.boulders'),
    'desert_rocks': dict(kind='LOW_COVER', h=0.8, name='ROCKS'),
    'desert_car':   dict(kind='COVER', h=1.8, name='DEAD CAR, HALF BURIED', by_props='desert.buried_car'),
    'desert_pylon': dict(kind='COVER', h=2.0, blocks_move=True, see_through=True, name='THE FALLEN PYLON', by_props='desert.pylon'),
    'canyon_boulder': dict(kind='COVER', h=1.6, name='SANDSTONE BOULDERS'),
    'canyon_juniper': dict(kind='COVER', h=1.8, name='DEAD JUNIPER'),
    'pass_rail':    dict(kind='COVER', h=1.0, name='GUARD RAIL', by_props='pass.guardrail'),
    'pass_barricade': dict(kind='COVER', h=1.2, name='ROAD CLOSED', by_props='pass.barricade'),
    'pass_boulder': dict(kind='COVER', h=1.8, name='ROCKFALL BOULDER'),
    'pass_car':     dict(kind='LOW_COVER', h=1.2, name='DEAD CAR ON THE ROAD'),
    'pass_drop':    dict(kind='DROP', h=0.0, blocks_move=True, see_through=True, name='THE DROP'),
    'shore_boat':   dict(kind='COVER', h=2.4, name='A BOAT ON ITS SIDE', by_props='shore.boat'),
    'shore_junk':   dict(kind='LOW_COVER', h=0.9, name='BUOYS AND DRUMS'),
    'shore_car':    dict(kind='COVER', h=1.6, name='A TRUCK AND ITS BOAT TRAILER'),
    'wash_culvert': dict(kind='COVER', h=2.4, name='INSIDE THE CULVERT', by_props='wash.culvert'),
    'wash_sofa':    dict(kind='COVER', h=1.0, name='A SOFA IN THE SILT', by_props='wash.sofa'),
    'wash_jam':     dict(kind='COVER', h=1.2, name='THE FLOOD\'S JAM', by_props='wash.jam'),
    'wash_carts':   dict(kind='LOW_COVER', h=1.0, name='SHOPPING CARTS'),
    'wash_tents':   dict(kind='LOW_COVER', h=1.2, name='A CAMP\'S TENTS'),
    'wash_car':     dict(kind='COVER', h=1.5, name='DEAD CAR ON THE BANK'),
    'wash_oleander': dict(kind='COVER', h=1.8, name='DEAD OLEANDERS'),
    'wash_fence':   dict(kind='COVER', h=2.0, blocks_move=True, see_through=True, name='CHAIN-LINK, THE CHANNEL\'S'),
    'landfill_fire': dict(kind='FIRE', h=0.0, burning=True, name='THE GAS, BURNING'),
    'landfill_wells': dict(kind='COVER', h=1.3, name='GAS WELLS AND THEIR PIPE', by_props='landfill.wells'),
    'yards_wall':   dict(kind='COVER', h=1.8, name='BLOCK WALL', by_props='suburbs.yard_wall'),
    'yards_car':    dict(kind='COVER', h=1.5, name='A CAR LEFT AT THE KERB'),
    'strip_fountain': dict(kind='COVER', h=0.6, name='THE FOUNTAIN\'S RIM', by_props='strip.fountain'),
    'strip_planter': dict(kind='LOW_COVER', h=0.9, name='MARBLE PLANTER'),
    'downtown_canopy': dict(kind='COVER', h=1.4, name='THE CANOPY\'S COLUMN', by_props='downtown.canopy'),
    'downtown_dumpsters': dict(kind='COVER', h=1.9, name='DUMPSTERS', by_props='downtown.dumpsters'),
    'works_gantry': dict(kind='COVER', h=1.6, name='THE GANTRY\'S LEG', by_props='works.gantry'),
    'works_pipes':  dict(kind='COVER', h=2.5, name='STACKED PIPE', by_props='works.pipes'),
    'marina_bass':  dict(kind='COVER', h=2.0, name='A BASS BOAT ON ITS TRAILER', by_props='marina.bass_boat'),
    'strip_welcome': dict(kind='COVER', h=1.2, name='THE WELCOME SIGN\'S BASE'),
    'strip_car':    dict(kind='COVER', h=1.5, name='DEAD CARS'),
    'strip_slots':  dict(kind='COVER', h=1.6, name='SLOT MACHINES, SPILLED'),
    'strip_entrance': dict(kind='COVER', h=2.0, name='A CASINO DOOR, RECESSED'),
    'downtown_kiosk': dict(kind='COVER', h=2.2, name='A KIOSK'),
    'downtown_slots': dict(kind='LOW_COVER', h=1.2, name='SLOT MACHINES'),
    'downtown_entrance': dict(kind='COVER', h=2.0, name='A CASINO DOOR, RECESSED'),
    'downtown_car':    dict(kind='COVER', h=1.5, name='A DEAD CAR'),
    'downtown_sign':   dict(kind='COVER', h=1.6, name='THE MOTEL SIGN\'S FOOT'),
    'downtown_panels': dict(kind='LOW_COVER', h=1.0, name='FALLEN SCREEN PANELS'),
    'downtown_junk':   dict(kind='LOW_COVER', h=1.0, name='A PAWN SHOP\'S JUNK'),
    'downtown_truss':  dict(kind='COVER', h=1.6, name='A FALLEN RIB OF THE CANOPY'),
    'strip_stairs': dict(kind='COVER', h=2.5, name='THE BRIDGE\'S STAIRS'),
}
MARK_PIECE = {}      # (bid, mark) -> piece, written per block below

# ======================================================================================================================
# THE BLOCKS: tiles (rows north to south), marks (the pieces), the ground, the roofs; the things are things_<bid>()
# ======================================================================================================================
BACKS = [3, 2, 3, 3, 2]                                                 # fremont.7's backs, their storeys column by column
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
    'apron.4': dict(name='THE STANDS', tiles=['.....', '.#...', '.....', '...##', '.....'],
                    marks=['-----', '---c-', '----C', '-----', '-C---'], pieces={'c': 'apron_loader', 'C': 'apron_tug'}, props=True),
    'apron.3': dict(name='THE GATE', tiles=['#####', '..#..', '.....', '.....', '.....'],
                    marks=['-----', '-----', '---c-', '-C---', '-----'], pieces={'c': 'apron_loader', 'C': 'apron_tug'}),
    # THE GOLF COURSE ------------------------------------------------------------------------------------------------------
    'golf.1': dict(name='THE CLUBHOUSE', tiles=['.....', 'HH...', '.....', '...d.', '.....'],
                   marks=['-----', '-----', 'CCcc-', '-----', '-----'], pieces={'C': 'golf_awning', 'c': 'golf_carts'}, roofs=[(0, 1, 1), (1, 1, 1)]),
    'golf.2': dict(name='THE FAIRWAY', tiles=['.....', '.dd..', '.....', '..dd.', '.....'],
                   marks=['---C-', '-----', '-----', '-----', 'C----'], pieces={'C': 'golf_shelter'}, piece_at={(4, 0): 'golf_pines'}),
    # THE TRAILER PARK ----------------------------------------------------------------------------------------------------
    'trailer.1': dict(name='THE ROWS', tiles=['#.#.#', '#.#.#', '.....', '.#.#.', '.#.#.'],
                      marks=['-----', '-C---', 'C-C-C', '-----', 'c---c'], pieces={'C': 'trailer_propane', 'c': 'trailer_junk'},
                      piece_at={(2, 2): 'trailer_car'}, props=True),
    'trailer.2': dict(name='THE OFFICE', tiles=['##...', '...#.', '.....', '.##..', '.....'],
                      marks=['-----', '--C-C', 'Cc---', '----c', '-c---'], pieces={'C': 'trailer_propane', 'c': 'trailer_junk'},
                      piece_at={(2, 0): 'trailer_bins', (2, 1): 'trailer_mail'}, props=True),
    # THE DESERT ----------------------------------------------------------------------------------------------------------
    'desert.1': dict(name='THE PYLON', tiles=['HddH.', 'HddH.', 'HddH.', 'HddH.', 'HddH.'],
                     marks=['----C', '-XXX-', '-XXX-', '-----', '--C--'], pieces={'X': 'desert_pylon', 'C': 'desert_boulder'},
                     piece_at={(4, 2): 'desert_car'}, props=True),
    'desert.2': dict(name='THE WASH', tiles=['HddH.', 'HddH.', 'HddH.', 'HddH.', 'HddH.'],
                     marks=['-----', '----C', '-----', '-C---', '-----'], pieces={'C': 'desert_boulder'},
                     piece_at={(3, 1): 'desert_car'}, props=True),
    'desert.3': dict(name='THE FLAT', tiles=['.....', '..r..', '.....', 'r....', '.....'],
                     marks=['-----', '----C', '---C-', '-----', '--C--'], pieces={'C': 'desert_boulder'},
                     piece_at={(2, 4): 'desert_car'}, props=True),
    # RED ROCK ------------------------------------------------------------------------------------------------------------
    'canyon.1': dict(name='THE FIN AND THE SLOT', tiles=['.H#H.', '.H#H.', '.H.H.', '.H#H.', 'r.#.r'],
                     marks=['-----', '-----', '-----', '-----', 'c---c'], pieces={'c': 'canyon_boulder'},
                     roofs=[(1, 0, 2), (1, 1, 3), (3, 1, 2), (1, 2, 2), (3, 2, 3), (3, 3, 2)], props=True),
    'canyon.2': dict(name='THE SLICKROCK', tiles=['..HH.', '.HHH.', '.....', 'H..H.', '..r..'],
                     marks=['-----', '----C', 'c----', '-----', '----c'], pieces={'c': 'canyon_boulder', 'C': 'canyon_juniper'},
                     roofs=[(3, 0, 2), (2, 1, 2), (3, 1, 3)], props=True),
    # THE PASS ----------------------------------------------------------------------------------------------------------
    'pass.1': dict(name='THE JACKKNIFE', tiles=['rrH#r', 'rr.rr', '.##H.', '.##..', 'rrrrr'],
                   marks=['-----', '-----', 'C----', 'C---C', 'VVVVV'], pieces={'C': 'pass_rail', 'V': 'pass_drop'},
                   piece_at={(2, 0): 'pass_barricade'}, props=True),
    'pass.2': dict(name='THE ROAD', tiles=['rHrr#', 'rrrHr', '.....', '.....', 'rrdrr'],
                   marks=['-----', '-----', '--C--', 'C-CC-', 'VV-VV'], pieces={'C': 'pass_rail', 'V': 'pass_drop'},
                   piece_at={(2, 2): 'pass_barricade'}, props=True),
    'pass.3': dict(name='THE CUT', tiles=['#H#H#', 'rHrrH', 'rrHrr', 'r#rrr', 'rrrHr'],
                   marks=['-----', '-----', '-----', '----C', '-C---'], pieces={'C': 'pass_boulder'},
                   roofs=[(1, 0, 3), (3, 0, 2), (1, 1, 2), (4, 1, 2)]),
    # THE SHORE -----------------------------------------------------------------------------------------------------------
    'lakebed.1': dict(name='THE INTAKE TOWER', tiles=['ww.ww', 'w.#HH', '..#..', 'ww.ww', 'ww.ww'],
                      marks=['-----', '-----', '-----', 'C----', '---C-'], pieces={'C': 'shore_boat'}, props=True),
    'lakebed.2': dict(name='THE MUD', tiles=['ww.ww', 'w...w', '...HH', 'ww..w', 'ww.ww'],
                      marks=['-----', '-C---', '-----', '-----', '----C'], pieces={'C': 'shore_boat'}, props=True),
    'lakebed.3': dict(name='THE RING', tiles=['ww.ww', 'HHHHH', '.....', '.HH..', '..#..'],
                      marks=['-----', '-----', 'c---c', '-----', 'C----'], pieces={'c': 'shore_junk', 'C': 'shore_car'}, props=True),
    # THE WASH ------------------------------------------------------------------------------------------------------------
    'wash.2': dict(name='THE CULVERT', tiles=['H.r.H', 'H.r.H', 'H#.#H', 'H.r.H', 'H.r.H'],
                   marks=['-----', '-----', '--C--', '---C-', '--C--'], pieces={'C': 'wash_jam'},
                   piece_at={(2, 2): 'wash_culvert', (4, 2): 'wash_sofa'}, props=True),
    'wash.3': dict(name='THE CHANNEL', tiles=['H.r.H', 'H.r.H', 'H.r.H', 'Hrr.H', 'H.r.H'],
                   marks=['---C-', '--C--', '-----', '-C---', '-----'], pieces={'C': 'wash_jam'},
                   piece_at={(1, 2): 'wash_sofa'}, props=True),
    'wash.4': dict(name='THE BANK', tiles=['.....', '..#..', '.....', '.....', '.....'],
                   marks=['-c--C', '-----', 'c---c', '--C--', 'X---X'], pieces={'c': 'wash_tents', 'C': 'wash_oleander', 'X': 'wash_fence'},
                   piece_at={(3, 2): 'wash_car'}),
    # THE LANDFILL -------------------------------------------------------------------------------------------------------
    'dump.1': dict(name='THE FLARE', tiles=['HH.HH', '.....', '.#..H', '..#..', 'H...H'],
                   marks=['-----', '-F---', 'F----', 'C---C', '-----'], pieces={'F': 'landfill_fire', 'C': 'landfill_wells'}, props=True),
    'dump.2': dict(name='THE CELLS', tiles=['.H.H.', '.....', 'H....', '..H.H', '.....'],
                   marks=['----C', '-----', '--C--', '-----', 'C----'], pieces={'C': 'landfill_wells'}, props=True),
    # THE SUBURBS -------------------------------------------------------------------------------------------------------
    # rule 346 (the plan gate: no landmark in the middle once the old street blocks left): every yard block is a row of houses on
    # top (their roofs walked: 'the houses are roofs'), their backyards behind them (walls, empty pools), and the street at the
    # bottom that the next block's houses face; the street runs whole through every block of its row
    'yards.1': dict(name='THE BACKYARDS', tiles=['HHHHH', '.r..r', '.....', 'r..r.', '.....'],
                    marks=['-----', 'C-C--', 'CC-CC', '-C--C', '--C--'], pieces={'C': 'yards_wall'},
                    piece_at={(4, 2): 'yards_car'}, props=True),
    'yards.2': dict(name='THE YARDS', tiles=['HH.HH', '...r.', '.....', '.r...', '.....'],
                    marks=['-----', 'C---C', '--C--', 'C---C', '-C-C-'], pieces={'C': 'yards_wall'},
                    piece_at={(4, 1): 'yards_car', (4, 3): 'yards_car'}, props=True),
    # THE STRIP (rule 346: the showcase; the Boulevard down the middle, the casino frontages either side). Every frontage reads
    # from the Boulevard out (cb 0 its sidewalk, cb 1 the drop-off under the porte-cochere, cb 2 the forecourt, cb 3-4 the casino),
    # its two drives at the same two rows as the Boulevard's aprons (DRIVES), so every road meets a road. No open tile has a mass
    # south of it taller than a third of a tile (the camera looks north: a tall mass's roof would be drawn over the tile behind it).
    'blvd.1': dict(name='THE BRIDGE AND THE WELCOME SIGN', tiles=['.....', '.....', '.HH..', '.#...', '.....'],
                   marks=['c-c-c', '---C-', 'C----', '--cC-', 'c-C-c'], pieces={'c': 'strip_planter', 'C': 'strip_car'},
                   piece_at={(2, 0): 'strip_stairs', (4, 2): 'strip_welcome'}, roofs=[(1, 2, 2), (2, 2, 2)], props=True),
    'blvd.2': dict(name='THE BOULEVARD', tiles=['.....', '.....', '.....', '.#...', '.#...'],
                   marks=['c-cC-', '-Cc-c', '--c--', '--cC-', 'c-c-c'], pieces={'c': 'strip_planter', 'C': 'strip_car'}, props=True),
    'stripw.1': dict(name='THE PORTE-COCHERE', tiles=['##...', '##.H.', '##.H.', '##...', '##...'],
                     marks=['--c--', '-----', '--C--', '--C-c', '--c--'], pieces={'c': 'strip_planter', 'C': 'strip_entrance'},
                     piece_at={(3, 2): 'strip_fountain'}, roofs=[(3, 1, 2), (3, 2, 2)], props=True),
    'stripw.2': dict(name='THE MARQUEES', tiles=['##...', '##.#.', '##...', '##.#.', '##...'],
                     marks=['--c--', '--C--', '--C--', '--C--', '----c'], pieces={'c': 'strip_planter', 'C': 'strip_slots'},
                     piece_at={(2, 2): 'strip_entrance'}, props=True),
    'stripw.3': dict(name='THE VALET', tiles=['##...', '##...', '##.#.', '##...', '##...'],
                     marks=['--C--', '----c', '-----', '--C-c', '--C--'], pieces={'c': 'strip_planter', 'C': 'strip_car'},
                     piece_at={(0, 2): 'strip_entrance'}, props=True),
    'stripe.1': dict(name='THE FALLEN SIGN', tiles=['...##', '.H.##', '.H.##', '.####', '...##'],
                     marks=['c----', '-----', '--C--', '-----', 'c-c--'], pieces={'c': 'strip_planter', 'C': 'strip_entrance'},
                     roofs=[(1, 1, 2), (1, 2, 2)], props=True),
    'stripe.2': dict(name='THE PINK TOWER', tiles=['...##', '.#.##', '...##', '.#.##', '...##'],
                     marks=['-----', '--C--', '--C--', '--C--', 'c----'], pieces={'c': 'strip_planter', 'C': 'strip_slots'},
                     piece_at={(2, 2): 'strip_entrance'}, props=True),
    # DOWNTOWN, RETHOUGHT (rule 346 amended: 'Hell nah that shit does not look right'; rule 356: roads first). From real downtown:
    # three streets east to west, every one whole through its row: FREMONT EAST on top (a motel, a pawn shop, a garage, a chapel facing
    # it, the casinos' back lot below it), FREMONT STREET in the middle (the old casino fronts at street level, the mall under the
    # canopy's bare vault, the south side's one-storey shops), and on the bottom the south side's backs (their roofs walked, stepping up),
    # the service alley and OGDEN AVENUE. Every front faces the camera or the alley; nothing tall stands south of open ground.
    'fremont.10': dict(name='THE MOTEL AND THE PAWN SHOP', tiles=['HHH..', 'Hr.##', 'H..##', '.....', '.....'],
                       marks=['----c', '--C--', '--C--', '-C-C-', 'C---C'], pieces={'c': 'downtown_junk', 'C': 'downtown_car'},
                       piece_at={(2, 2): 'downtown_sign', (4, 0): 'downtown_dumpsters', (4, 4): 'downtown_dumpsters'},
                       roofs=[(0, 0, 2), (1, 0, 2), (2, 0, 2), (0, 1, 2), (0, 2, 2)], props=True),
    'fremont.11': dict(name='THE GARAGE AND THE CHAPEL', tiles=['HHH..', 'HHH#.', 'HHH..', '.##..', '.....'],
                       marks=['----c', '-----', '----C', '----C', 'C---C'], pieces={'c': 'downtown_junk', 'C': 'downtown_car'},
                       piece_at={(4, 0): 'downtown_dumpsters', (4, 4): 'downtown_dumpsters'},
                       roofs=[(c, r, 3 - r) for c in range(3) for r in range(3)], props=True),
    'fremont.12': dict(name='UNDER THE COWBOY', tiles=['#####', '.....', '.....', '.....', 'HHHHH'],
                       marks=['-----', '-C-c-', '-CCc-', 'c--C-', '-----'], pieces={'C': 'downtown_kiosk', 'c': 'downtown_panels'},
                       piece_at={(1, 3): 'downtown_slots', (2, 1): 'downtown_canopy', (2, 2): 'downtown_canopy', (3, 3): 'downtown_truss'},
                       roofs=[(c, 4, 1) for c in range(5)], props=True),
    'fremont.13': dict(name='THE MALL', tiles=['#####', 'H....', '.....', '...H.', 'HHHHH'],
                       marks=['-----', '---C-', 'c-CC-', '-C---', '-----'], pieces={'C': 'downtown_kiosk', 'c': 'downtown_panels'},
                       piece_at={(2, 0): 'downtown_slots', (2, 2): 'downtown_canopy', (2, 3): 'downtown_canopy', (3, 1): 'downtown_truss'},
                       roofs=[(0, 1, 2), (3, 3, 1)] + [(c, 4, 1) for c in range(5)], props=True),
    'fremont.14': dict(name='THE ROOFS AND THE ALLEY', tiles=['HHHHH', 'HHHHH', '.....', '.....', '.....'],
                       marks=['-----', '-----', '-C-C-', 'C---C', '--C--'], pieces={'C': 'downtown_car'},
                       piece_at={(2, 1): 'downtown_dumpsters', (2, 3): 'downtown_dumpsters'},
                       roofs=[(c, r, BACKS[c]) for c in range(5) for r in (0, 1)], props=True),
    'fremont.15': dict(name='THE GARAGE ON OGDEN', tiles=['HHHHH', 'HHHHH', '.....', '.....', '.....'],
                       marks=['-----', '-----', 'C---C', '-C---', '---C-'], pieces={'C': 'downtown_car'},
                       piece_at={(2, 0): 'downtown_dumpsters', (2, 4): 'downtown_dumpsters'},
                       roofs=[(c, 0, 3) for c in range(3)] + [(c, 1, 2) for c in range(3)] + [(c, r, 2) for c in (3, 4) for r in (0, 1)], props=True),
    # THE WORKS ---------------------------------------------------------------------------------------------------------
    'rail.1': dict(name='THE CARS AND THE GANTRY', tiles=['....#', '.....', '##.##', '.....', '.....'],
                   marks=['-----', '-----', '-----', '-CC--', 'C--C-'], pieces={'C': 'works_pipes'},
                   piece_at={(3, 1): 'works_gantry', (3, 2): 'works_gantry'}, props=True),
    'rail.2': dict(name='THE SLAB', tiles=['.....', '.#...', '..##.', '.....', '...#.'],
                   marks=['--C--', '----C', '-----', 'C---C', '-----'], pieces={'C': 'works_pipes'}, props=True),
    # THE MARINA --------------------------------------------------------------------------------------------------------
    'basin.1': dict(name='THE HOUSEBOAT', tiles=['.....', '....#', '.HHHH', '#....', '.....'],
                    marks=['-C---', '-----', '-----', '---C-', '-----'], pieces={'C': 'marina_bass'}, props=True),
    'basin.2': dict(name='THE DRY BED', tiles=['..#..', '.....', '.....', '.#...', '.....'],
                    marks=['-----', 'C---C', '--C--', '-----', 'C--C-'], pieces={'C': 'marina_bass'}, props=True),
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
# THE REAL COLOUR OF THE GREY PLACES (rule 346, ask line 355: 'airport, shore, pass read plain grey'). New grounds rendered through
# the rig like every other (never a recolour of a picture), each the colour the real ground is: Harry Reid's apron is concrete
# made of the valley's own caliche aggregate and filmed with its dust, warm, never a grey card; Lake Mead's exposed bed is tan
# cracked mud (the white ring above it is the lime the water left); the pass's limestone scree is buff with iron-red in it.
WARM = {
    'dustslab': (dict(role=('clay_bone', 3), target=(184, 170, 146), h=0.1, alt=('tape_grey', 3), alt_amt=0.22, grit=0.1, speck=(70, 0.12),
                      joints=dict(pitch=6.0, width=0.025), panel_var=0.035, oil=dict(scale=0.7, cut=0.68, mul=0.55),
                      cracks=dict(cell=1.4, width=0.01, region=0.4, cut=0.6, depth=0.5), cal=0.9), [(0.4, 0.03, 0.08, 'gravel')]),
    'lakemud': (dict(role=('clay_bone', 2), target=(158, 134, 104), h=-0.1, alt=('clay_rust', 2), alt_amt=0.22, grit=0.2, speck=(60, 0.2),
                     mud=dict(cell=0.5, width=0.05, depth=1.2), cal=0.95), [(0.1, 0.05, 0.15, 'cobble')]),
    'passtan': (dict(role=('clay_bone', 2), target=(166, 146, 116), h=0.05, alt=('clay_rust', 2), alt_amt=0.3, grit=0.6, speck=(36, 0.6),
                     cal=0.88), [(9.0, 0.03, 0.09, 'lime'), (1.2, 0.08, 0.3, 'redrock')]),
}


def rig():
    import bohemia_combat_maps_new_blocks_through_the_rig_11_2_26 as NB
    import bohemia_combat_maps_every_ground_its_own_11_2_26 as EG
    NF, F = NB.rig()
    if 'dustslab' not in EG.NEW:                                         # appended after every ground: no other ground's id moves
        for n, (spec, st) in WARM.items(): EG.NEW[n] = spec; EG.NEW_STONES[n] = st
        EG.ID, EG.NAMES = EG.ids()
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
    if bid.split('.')[0] in ('desert', 'canyon', 'pass', 'lakebed', 'golf', 'dump', 'basin'):
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
        pen = (mark == 'X') & (fx > 0.9) & (fx < 11.1) & (fy > 0.9) & (fy < 11.1)
        gid[pen] = ID['concrete']                                           # each pen's pad, inside its fence (never on the grid line)
        gid[pen & (np.abs(fx - 6) < 3.2) & (np.abs(fy - 6.5) < 2.4) & (n2 > 0.1)] = ID['gravel']   # its straw-and-grit floor
        ln = (mark != 'X') & (code == '.')
        gid[ln & (((np.abs(fx - 1.4) < 0.16) | (np.abs(fx - 10.6) < 0.16)) & (np.abs(fy - 6) < 6))] = ID['hazard']   # lane edge stripes, inside the lane
        gid[code == 'd'] = ID['gravel']
        if bid == 'lab.2':
            gid[band(49.5, 58.0) & (xm > 1.5) & (xm < 46)] = ID['concrete']; gid[band(38.4, 39.4) & (xm < 36) & (xm > 2)] = ID['hazard']   # the dock apron, its stop line
            gid[(np.abs(xm - 42) < 5.5) & (np.abs(ym - 42) < 5.5)] = ID['hazard']                  # the decon pad
            gid[(np.abs(xm - 42) < 4.6) & (np.abs(ym - 42) < 4.6)] = ID['epoxy']
        if bid == 'lab.3':                                                  # the intake lot: the yard's own sealed floor (rule 346: one ground a place)
            gid[(n3 > 0.55) & (n2 > 0.0)] = ID['oilcrete']
            gid[((np.abs(xm % 6.0 - 3.0)) < 0.08) & band(37.5, 46.5)] = ID['hazard']   # the bay lines, inside their row
            gid[(mark == 'X') & (fx > 0.9) & (fx < 11.1) & (fy > 0.9) & (fy < 11.1)] = ID['gravel']
            gid[band(26.0, 34.0) & (n1 > -0.3)] = ID['concrete']           # the drive through the gate
    elif kind == 'apron':
        gid[:] = ID['dustslab']                                             # Harry Reid's slabs, the valley's dust on them (6 m joints)
        gid[(n3 > 0.7)] = ID['oilcrete']                                    # where aircraft stood and leaked
        gid[(n3 > 0.62) & (n2 > 0.45)] = ID['tiedown']                      # the black of the tyres where they turned
        gid[band(29.8, 30.2)] = ID['hazard']                                # the taxi lane's yellow centre line, edge to edge
        gid[(np.abs(xm % 12.0 - 6.0) < 0.12) & (ym < 11.0) & (ym > 2.5)] = ID['hazard']   # the stand lead-in lines, ending at the stop bar
        gid[(np.abs(ym - 2.5) < 0.12) & (np.abs(xm % 12.0 - 6.0) < 2.0)] = ID['hazard']    # the stop bars
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
        gid[band(28.4, 31.6)] = ID['concrete']                              # the cart path, edge to edge in every block
        if bid == 'golf.1':
            green = ((xm - 33) / 9.0) ** 2 + ((ym - 7.0) / 5.6) ** 2 < 1.0 + 0.05 * n2
            gid[green] = ID['deadlawn_b']                                   # the 18th green: dead, smooth, still rolled
            gid[band(24.6, 36.6) & (xm > 3.5) & (xm < 23.4)] = ID['pooltile']   # the patio under the awning (the path runs on past it)
            gid[band(24.6, 36.6) & (xm > 3.5) & (xm < 23.4) & (n2 > 0.4)] = ID['concrete']
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
        gid[band(26.0, 34.0)] = ID['asphalt']; gid[band(26.0, 34.0) & (n1 > 0.4) & (np.minimum(xm, 60 - xm) > 4)] = ID['gravel']   # the lane, patched, edge to edge in every block
        if bid == 'trailer.2':                                              # the office's lot, inside the block, and its drive down to the lane
            gid[band(37.2, 47.4) & (xm > 1.6) & (xm < 23.4)] = ID['asphalt']; gid[band(33.5, 37.5) & (xm > 8) & (xm < 13)] = ID['asphalt']
            gid[band(37.2, 47.4) & (np.abs(xm % 3.0 - 1.5) < 0.06) & (xm > 3) & (xm < 22)] = ID['paint']
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
        gid[(soft_tiles(T, '.', xm, ym) > 0.66) & (n3 > 0.62)] = ID['slickrock']   # bare slickrock sheets in the open, broad (their
        # edges a metre inside the open tiles, never along the grid's line: rule 346)
    elif kind == 'pass':
        gid[:] = ID['passtan']                                              # buff limestone scree, iron-red in it
        gid[(code == '.') & (roww >= 2) & (roww <= 3)] = ID['pavement']     # the road's verges, crushed rock gone brown (wandered: never a tile's edge)
        gid[band(25.0, 34.8)] = ID['asphalt'] if bid in ('pass.1', 'pass.2') else gid[band(25.0, 34.8)]
        if bid in ('pass.1', 'pass.2'):
            gid[band(24.7, 25.0) | band(34.8, 35.3)] = ID['pavement']       # the shoulders (their edges off the grid's lines)
            gid[band(25.25, 25.4) | band(34.4, 34.55)] = ID['paint']         # the fog lines
        gid[mark == 'V'] = ID['tie']                                         # the drop: falling away into its own shadow
    elif kind == 'lakebed':
        gid[:] = ID['lakemud']                                              # the cracked bed, Lake Mead's tan
        bar = soft_tiles(T, '.H' if bid == 'lakebed.3' else '.', xm, ym) + 0.06 * (n1 - n1.mean()) / (n1.std() + 1e-6) > 0.66
        gid[bar] = ID['pavement']                                           # the old gravel bar, varnished brown: the firm way through the mud,
        if bid == 'lakebed.3':                                              # its edge a soft shape a metre inside its own tiles (rule 346)
            gid[band(36, 48)] = ID['ring']                                  # the white bathtub ring
            gid[band(53.2, 54.0)] = ID['ring']                              # and the second, higher than the lake ever stood (horror)
            gid[ym < 36] = ID['pavement']; gid[(ym < 24) & (np.abs(xm - 30) < 7)] = ID['concrete']   # the old shore, the launch ramp
            gid[band(48, 60) & ~bar] = ID['lakemud']
    elif kind == 'wash':
        gid[:] = ID['pavement'] if bid == 'wash.4' else ID['concrete']
        if bid == 'wash.4':                                                 # the bank: its gravel patches off every edge (rule 346)
            far = (np.minimum.reduce([xm, 60.0 - xm, ym, 60.0 - ym]) + 0.8 * wx) > 3.5
            gid[(n3 > 0.62) & far] = ID['gravel']; gid[soft_tiles(M, 'X', xm, ym) > 0.66] = ID['gravel']   # the fence lines' gravel, a soft strip
        else:                                                               # the channel runs on north and south: its stains off those edges
            far = (np.minimum(ym, 60.0 - ym) + 0.8 * wy) > 3.5
            gid[soft_tiles(T, 'r', xm, ym) + 0.05 * (n1 - n1.mean()) / (n1.std() + 1e-6) > 0.66] = ID['silt']   # the channel's floor: silt
            # over the concrete, lying a metre in from the slopes' feet (never along the grid's line: rule 346)
            gid[(code == 'r') & (n2 > 0.5) & far] = ID['cobble']
            gid[(code == '.') & (n3 > 0.5) & far] = ID['oilcrete']          # the channel's sloped concrete, stained
    elif kind == 'dump':
        gid[:] = ID['coversoil']                                            # grey cover soil, the trash working up through it
        gid[(code == 'H')] = ID['coversoil']
        gid[band(37.5, 46.5)] = ID['gravel']                                # the haul road, block to block at one row
        if bid == 'dump.1': gid[(xm > 13) & (xm < 23) & band(25, 35)] = ID['concrete']   # the flare's pad
        gid[soft_tiles(M, 'F', xm, ym) > 0.66] = ID['tie']                  # scorched where the gas burns (soft shapes inside their tiles)
        gid[soft_tiles(M, 'C', xm, ym) > 0.66] = ID['gravel']
    elif kind == 'yards':
        gid[:] = ID['deadlawn']                                             # dead brown lawns, yard by yard
        gid[n3 > 0.72] = ID['deadlawn_b']
        gid[band(2.6, 10.0)] = ID['asphalt']                                 # the street the next block's houses face, edge to edge
        gid[band(10.0, 11.0) | band(1.4, 2.6)] = ID['concrete']             # its kerbs and sidewalks, off the grid's lines
        gid[band(6.2, 6.4) & ((xm % 6.0) < 3.0)] = ID['paint']
        for r_ in range(5):
            for c_ in range(5):
                if T[r_][c_] == 'r':                                        # the pool's deck round the pit
                    cx_, cy_ = centre(c_, r_); gid[(np.abs(xm - cx_) < 4.9) & (np.abs(ym - cy_) < 4.4)] = ID['concrete']   # a metre in from the tile's edge
    elif kind == 'rail':
        gid[:] = ID['oilcrete']                                             # the yard's slab, black with oil
        trackrows = [(24.0, 36.0)]                                          # every block's spur at the same row: the tracks run on
        for (a, b) in trackrows:
            gid[band(a + 1.5, b - 1.5)] = ID['ballast']; gid[band(a + 3.6, b - 3.6) & ((xm % 0.65) < 0.25)] = ID['tie']
        gid[(code == '#') & ~np.isin(row, [2])] = ID['concrete']
    elif kind == 'basin':
        gid[:] = ID['lakemud']                                              # the marina's dry bed, cracked, Lake Mead's tan
        gid[(n3 > 0.7)] = ID['silt']
    elif kind == 'blvd':                                                    # Las Vegas Boulevard, north to south down the block
        wyf = wx * np.clip(np.minimum(ym, 60.0 - ym) / 6.0, 0, 1)            # a wander that dies at the block's north and south edges
        inner = (np.minimum(ym, 60.0 - ym) + 0.8 * wy) > 4.0                 # off the block's north and south edges (the road runs on)
        gid[:] = ID['pavement']                                             # the sidewalks' warm pavers, kerb off the grid's lines
        road = (xm > 10.0) & (xm < 50.0)
        gid[road] = ID['asphalt']
        for lx in (15.7, 21.3, 38.7, 44.3): gid[(np.abs(xm - lx) < 0.09) & ((ym % 6.0) < 3.0)] = ID['paint']   # the lane dashes
        gid[(np.abs(xm - 10.4) < 0.1) | (np.abs(xm - 49.6) < 0.1)] = ID['paint']                         # the edge lines
        gid[(np.abs(xm - 26.6) < 0.1) | (np.abs(xm - 33.4) < 0.1)] = ID['hazard']                       # the median's yellow lines
        med = (xm > 27.0) & (xm < 33.0)
        gid[med] = ID['cobble']                                             # the raised median
        gid[(n3 > 0.62) & road & ~med & inner] = ID['oilcrete']              # oil where the cars died
        for ay in DRIVES: gid[(np.abs(ym - ay) < 2.4) & ~road] = ID['asphalt']   # the aprons across both sidewalks, to every drive
        gid[(np.abs(xm - 30.0 + 0.3 * wyf) < 0.12) & med & inner & (n2 > 0.2)] = ID['gutter']   # the median's crack
    elif kind in ('stripw', 'stripe'):                                      # a casino frontage: its sidewalk, its drop-off, its forecourt
        xb = (60.0 - xm) if kind == 'stripw' else xm                       # metres in from the Boulevard's side
        inner = (np.minimum(ym, 60.0 - ym) + 0.8 * wy) > 4.0
        wyf = wx * np.clip(np.minimum(ym, 60.0 - ym) / 6.0, 0, 1)
        gid[:] = ID['pavement']                                             # the Boulevard's warm pavers, carried in to the doors
        gid[np.abs(xb - 6.3 - 0.2 * wyf) < 0.45] = ID['pooltile']           # the forecourt's teal border band, edge to edge
        u = ((xb - 30.0) % 6.0) - 3.0; v = (ym % 6.0) - 3.0
        fore = (xb > 25.6 + 0.5 * wyf) & (xb < 36.0)
        gid[fore & (np.abs(u) + np.abs(v) < 2.1)] = ID['marble']            # the forecourt's inlaid marble diamonds
        gid[fore & (np.abs(np.abs(u) + np.abs(v) - 2.35) < 0.2) & inner] = ID['pooltile']   # each one edged in teal
        lane = (xb > 13.5) & (xb < 22.5) & (ym > 15.6) & (ym < 44.4)        # the drop-off lane between the two drives
        gid[lane] = ID['asphalt']
        for ay in DRIVES: gid[(np.abs(ym - ay) < 2.4) & (xb < 22.5)] = ID['asphalt']
        gid[lane & (np.abs(xb - 18.0) < 0.08) & ((ym % 3.0) < 1.5) & (ym > 21) & (ym < 39)] = ID['paint']
        gid[lane & (n3 > 0.66) & inner] = ID['oilcrete']
    elif kind == 'fremont':
        inner = (np.minimum(xm, 60.0 - xm) + 0.8 * wx) > 4.0                 # off the block's east and west sides (the streets run on)
        if bid in ('fremont.10', 'fremont.11'):                             # FREMONT EAST and the casinos' back lot
            gid[:] = ID['concrete']
            gid[band(14.0, 22.4)] = ID['asphalt']; gid[band(18.1, 18.3) & ((xm % 6.0) < 3.0)] = ID['paint']
            gid[band(14.0, 22.4) & (n3 > 0.66) & inner] = ID['oilcrete']
            gid[band(0.0, 10.8)] = ID['oilcrete']; gid[band(0.0, 10.8) & (n2 > 0.55) & inner] = ID['tiedown']   # the back lot, black with oil
            if bid == 'fremont.10':                                         # the motel's court, its drive out to the street
                gid[(xm > 13.2) & (xm < 34.8) & (ym > 25.2) & (ym < 46.8)] = ID['asphalt']
                gid[(xm > 25.0) & (xm < 34.8) & (ym > 22.0) & (ym < 25.6)] = ID['asphalt']
                gid[(np.abs(xm % 4.0 - 2.0) < 0.06) & (xm > 14) & (xm < 34) & (ym > 37) & (ym < 46)] = ID['paint']
                gid[(xm > 37.2) & (xm < 58.8) & (ym > 49.2) & (ym < 58.8)] = ID['rubbleg']   # the pawn shop's yard
            else:                                                           # the chapel's lawn and its walk; the garage's way in
                gid[(xm > 37.2) & (xm < 46.8) & (ym > 25.2) & (ym < 34.8)] = ID['deadlawn']
                gid[(np.abs(xm - 42.0) < 1.0) & (ym > 22.0) & (ym < 36.0)] = ID['concrete']
                gid[(xm > 2.0) & (xm < 9.0) & (ym > 22.0) & (ym < 25.6)] = ID['asphalt']
        elif bid in ('fremont.12', 'fremont.13'):                           # FREMONT STREET: the mall's warm pavers, the wave inlaid
            gid[:] = ID['pavement']
            wave = np.abs(((xm + 2.5 * np.sin(ym / 5.0)) % 12.0) - 6.0) < 0.9
            gid[wave & (ym > 15.0) & (ym < 45.0)] = ID['cobble']
            gid[np.abs(ym - 30.0) < 1.0] = ID['cobble']
            gid[(n3 > 0.68) & inner & (ym > 16) & (ym < 44)] = ID['oilcrete']
            for c_ in range(5):                                             # the terrazzo at each casino's doors
                gid[(np.abs(xm - (c_ * 12 + 6)) < 3.8) & (ym > 43.6) & (ym < 47.6)] = ID['marble']
        else:                                                               # the south side's alley and OGDEN AVENUE
            gid[:] = ID['concrete']
            gid[band(25.4, 34.6)] = ID['asphalt']; gid[band(25.4, 34.6) & (n2 > 0.6) & inner] = ID['oilcrete']
            gid[band(13.6, 22.4)] = ID['pavement']                         # the kerbside strip where cars stand
            gid[band(2.0, 10.4)] = ID['asphalt']; gid[band(6.1, 6.3) & ((xm % 6.0) < 3.0)] = ID['paint']
            gid[band(2.0, 10.4) & (n3 > 0.66) & inner] = ID['oilcrete']
    # ONE GROUND AT EVERY EDGE (rule 346: no straight line where two of a place's pictures meet, no colour stopping dead): the
    # place's base ground in a 3 m margin round the block, its edge wandering, except under a mass and where a road or a track
    # runs through to the next block (every block of the place carries it at the same place)
    base = MARGIN.get(kind)
    if base:
        dist = np.minimum.reduce([xm, 60.0 - xm, ym, 60.0 - ym]) + 0.8 * wx
        keep = np.isin(code, ['#', 'H']) | np.isin(gid, [ID['asphalt'], ID['paint']] + [ID[k] for k in THROUGH.get(kind, [])])
        gid[(dist < 3.0) & ~keep] = ID[base]
    return gid, np.ones((H, W), bool), np.full((H, W), 255, np.uint8), np.zeros((H, W, 3), np.uint8), np.zeros((H, W), bool)


GONE = ('plaza.1', 'plaza.2', 'fremont.1', 'fremont.2', 'fremont.3', 'fremont.4', 'fremont.5', 'fremont.6', 'fremont.7')   # rule 346 and its amendment                 # rule 346 killed them: graveyard/the_strip_and_downtown_11_3_26/
def soft_tiles(T, chars, xm, ym, sigma=3.0):
    """how much of the ground round a point belongs to tiles of these kinds, the tile map blurred (the block's edge tiles carried
    on past its sides, so a shape that runs off the block runs on): a threshold over a half puts a shape's edge inside its own
    tiles, never on the grid's line, where a plain rule of the tiles always puts it"""
    from scipy.special import erf
    f = np.zeros_like(xm, dtype=np.float32); s2 = sigma * math.sqrt(2.0)
    for r in range(-1, 6):
        for c in range(-1, 6):
            if T[min(max(r, 0), 4)][min(max(c, 0), 4)] not in chars: continue
            x0, x1, y0, y1 = c * TM, (c + 1) * TM, 60.0 - (r + 1) * TM, 60.0 - r * TM
            f += 0.25 * (erf((xm - x0) / s2) - erf((xm - x1) / s2)) * (erf((ym - y0) / s2) - erf((ym - y1) / s2))
    return f


DRIVES = (18.0, 42.0)                                                  # the Strip's drives: every frontage and the Boulevard at these rows
MARGIN = {'lab': 'epoxy', 'apron': 'dustslab', 'golf': 'fairway', 'trailer': 'gravel', 'desert': 'pavement', 'canyon': 'redsand',
          'pass': 'passtan', 'lakebed': 'lakemud', 'dump': 'coversoil', 'yards': 'deadlawn', 'rail': 'oilcrete', 'basin': 'lakemud'}
THROUGH = {'golf': ['concrete'], 'rail': ['ballast', 'tie'], 'lakebed': ['ring', 'pavement'], 'desert': ['silt', 'cobble', 'calcrete'],
           'pass': ['pavement', 'tie'], 'trailer': [], 'apron': ['hazard'], 'dump': ['gravel'], 'yards': ['concrete']}


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


EDGE_TOL = 0.15
_SIZES = {}


def fit_in(v, half, lo=0.0, hi=60.0, most=1.5):
    """a centre moved in so its half-width stays inside the block (by at most 1.5 m: more is a placement to fix by hand)"""
    if v - half < lo - EDGE_TOL and (lo + half) - v <= most and v + half <= hi: return lo + half
    if v + half > hi + EDGE_TOL and v - (hi - half) <= most and v - half >= lo: return hi - half
    return v


def model_size(mid):
    if not _SIZES: _SIZES.update({k_: m['size_m'][:2] for k_, m in props().items()})
    return _SIZES[mid]


class Kit:
    """the things of one block: boxes, prisms, horizontal tubes, gables, rocks; one instanced mesh per material"""
    def __init__(self, bpy, NF, F, g, h, seed):
        self.bpy, self.NF, self.F, self.g, self.h = bpy, NF, F, g, h
        self.rng = np.random.RandomState(seed); self.M = {}; self.items = {}; self.rocks = {}; self.models = []
        dv = np.array([[0, -0.5, 0], [0.5, -0.5, 0.5], [0, -0.5, 1], [-0.5, -0.5, 0.5], [0, 0.5, 0], [0.5, 0.5, 0.5], [0, 0.5, 1], [-0.5, 0.5, 0.5]], np.float32)
        df = np.array([[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]], np.int32)
        self.T = {'box': (NF.CUBE_V, NF.CUBE_F), 'cyl': prism(12), 'tube': prism(12, 'x'), 'gable': gable(), 'cyl6': prism(6), 'diamond': (dv, df)}
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
        # NO ASSET CUT AT THE PICTURE'S EDGE (rule 356(c)): a thing that reaches a little past its block's side is moved in (or, past
        # both sides, made to fit), so the picture never cuts it; edge_clips() measures what is left
        dy_ = max(sy, sz) if abs(tilt) > 0.5 else sy
        c, s_ = abs(math.cos(rz)), abs(math.sin(rz)); ex, ey = (sx * c + dy_ * s_) / 2, (sx * s_ + dy_ * c) / 2
        x, y = fit_in(x, ex), fit_in(y, ey)
        if s_ < 0.01 and ex > 30.0 + EDGE_TOL: sx = 60.0
        if c < 0.01 and ex > 30.0 + EDGE_TOL: sy = 60.0
        self.items.setdefault((tpl, m), []).append((x, y, z, sx, sy, sz, rz, tilt))
    def box(self, m, x, y, z, sx, sy, sz, rz=0.0, tilt=0.0): self.put('box', m, x, y, z, sx, sy, sz, rz, tilt)
    def cyl(self, m, x, y, z, d, hgt, rz=0.0): self.put('cyl', m, x, y, z, d, d, hgt, rz)
    def tube(self, m, x, y, z, length, d, rz=0.0, tilt=0.0): self.put('tube', m, x, y, z, length, d, d, rz, tilt)
    def roof(self, m, x, y, z, sx, sy, sz, rz=0.0): self.put('gable', m, x, y, z, sx, sy, sz, rz)
    def rock(self, m, x, y, s, flat=0.6, sink=0.25, z=None):
        x, y = fit_in(x, s / 2, most=4.0), fit_in(y, s / 2, most=4.0)    # a rock can always roll in
        L = self.rocks.setdefault((m, flat), ([], [], []))
        L[0].append((x, y)); L[1].append(s); L[2].append((self.z(x, y) if z is None else z) - s * flat * sink)
    def scatter(self, m, x0, x1, y0, y1, n, lo, hi, flat=0.6):
        for _ in range(n): self.rock(m, self.rng.uniform(x0, x1), self.rng.uniform(y0, y1), lo * (hi / lo) ** (self.rng.rand() ** 1.5), flat)
    def model(self, mid, x, y, quarter=0, z=None):
        """one of COOK PROPS' models (records/target/fight_props/manifest.json): its .glb, origin at its ground centre, facing south,
        turned in quarters on the board (their rule), set on the ground here"""
        sx, sy = model_size(mid)
        if quarter % 2: sx, sy = sy, sx
        x, y = fit_in(x, sx / 2), fit_in(y, sy / 2)
        self.models.append((mid, x, y, quarter, self.z(x, y) if z is None else z))
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
        for (mid, x, y, q, z) in self.models:
            out += import_model(bpy, mid, x, y, q, z)
        return [o for o in out if o is not None]


PROPS = os.path.join(R, 'records/target/fight_props/manifest.json')


DEAD_MAN = os.path.join(R, 'records/target/dead/manifest.json')


def props():
    """COOK PROPS' models and COOK DEAD's (rule 360: the dead through the same rig), one lookup by id"""
    out = {m['id']: m for m in json.load(open(PROPS))['models']} if os.path.exists(PROPS) else {}
    if os.path.exists(DEAD_MAN): out.update({m['id']: m for m in json.load(open(DEAD_MAN))['models']})
    return out


def import_model(bpy, mid, x, y, quarter, z):
    """the .glb into this block's scene, turned and set, its transform baked into its vertices (the rig's source pass, dents and
    the camera's vertical stretch then treat it as one of the block's own meshes, never twice)"""
    m = props()[mid]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(R, m['model']))
    new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    for o in roots:
        o.location = (x, y, z); o.rotation_mode = 'XYZ'; o.rotation_euler = (0.0, 0.0, quarter * math.pi / 2)
    bpy.context.view_layer.update()
    meshes = []
    for o in new:
        if o.type != 'MESH': continue
        mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
        o.data = o.data.copy(); o.data.transform(o.matrix_world); o.matrix_world = __import__('mathutils').Matrix.Identity(4)
        meshes.append(o)
    for o in new:
        if o.type != 'MESH': bpy.data.objects.remove(o, do_unlink=True)
    # its footprint's middle on the tiles it names (a model's origin may sit at its footing, the pylon's does): the box of its
    # vertices centred on (x, y), its ground kept
    if meshes:
        V = np.concatenate([np.array([v.co[:] for v in o.data.vertices], np.float32) for o in meshes])
        dx = x - (V[:, 0].min() + V[:, 0].max()) / 2; dy = y - (V[:, 1].min() + V[:, 1].max()) / 2
        for o in meshes: o.data.transform(__import__('mathutils').Matrix.Translation((dx, dy, 0.0)))
    return meshes


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


SPECIES = [(170, 56, 46), (66, 110, 132), (214, 178, 70), (226, 222, 210)]   # the pens' colour codes: dire wolf, sloth, bear, quarantine


def pen(k, c, r, burst=False, horror=False, code=None):
    """a beast pen: a 10 m chain-link run on its pad, a plywood den with its dark door, a steel trough, straw"""
    x0, x1, y0, y1 = tile_m(c, r); ix0, ix1, iy0, iy1 = x0 + 1.0, x1 - 1.0, y0 + 1.0, y1 - 1.0
    chainlink(k, ix0, iy0, ix1, iy1, 3.0, gate='w', torn='nes' if burst else None)   # burst: three sides down, the tile open (debris)
    k.rgb('den', (128, 112, 90), 'clay_bone'); k.rgb('denroof', (82, 78, 72), 'tape_grey'); k.rgb('dark', (26, 24, 23), 'rubber')
    k.rgb('trough', (150, 152, 150), 'chrome'); k.rgb('straw', (176, 152, 102), 'tape_masking'); k.rgb('water', (60, 86, 92), 'clay_teal')
    dx, dy = ix1 - 3.0, iy1 - 2.6
    rf = 'denroof'
    if code is not None:                                         # its species' colour on the den's roof and the mat at its gate
        rf = 'denroof_%d' % code; k.rgb(rf, SPECIES[code], 'clay_rust' if code == 0 else 'clay_teal' if code == 1 else 'clay_mustard' if code == 2 else 'tape_grey')
        k.box(rf, ix0 + 0.9, (iy0 + iy1) / 2, 0.0, 1.4, 3.2, 0.03)
    k.box('den', dx, dy, 0.0, 3.6, 3.0, 1.9); k.roof(rf, dx, dy, 1.9, 3.9, 3.3, 0.6)
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
            pen(k, c, r, horror=(c, r) == (2, 1), code=(c * 3 + r) % 4)
        pen(k, 2, 3, burst=True)                                 # the one burst open from inside
        k.rgb('placard', (214, 178, 60), 'clay_mustard'); k.rgb('placard_k', (30, 28, 27), 'rubber'); k.rgb('qtape', (214, 110, 50), 'clay_rust')
        for (c, r) in [(0, 0), (2, 0), (4, 0), (0, 1), (2, 1), (4, 1), (0, 3), (2, 3), (4, 3), (0, 4), (2, 4), (4, 4)]:
            x0, x1, y0, y1 = tile_m(c, r)                         # the biohazard placard on each pen's south fence (more love: rule 346)
            k.box('placard', (x0 + x1) / 2 - 2.0, y0 + 0.92, 1.3, 0.9, 0.04, 0.9); k.box('placard_k', (x0 + x1) / 2 - 2.0, y0 + 0.9, 1.6, 0.4, 0.04, 0.3)
        for (xa, ya, xb, yb) in ((13.0, 40.0, 23.0, 41.4), (37.0, 16.6, 46.0, 15.2), (13.5, 16.0, 17.0, 16.4)):
            k.line('qtape', xa, ya, xb, yb, 0.12, 0.04, 1.0)       # quarantine tape across the lanes, torn short
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
        for i in range(4): k.box('pallet', tx - 6.0 - (i % 2) * 1.4, ty - 3.4 - (i // 2) * 1.2, 0.0, 1.2, 1.0, 0.15 + 0.6 * (i == 1))   # beside its doors, inside the block
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


def tug(k, x, y, rz):
    """a dead baggage tug, its tow bar down"""
    k.rgb('tugbody', (196, 160, 64), 'clay_mustard'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('tyre', (34, 32, 31), 'rubber')
    k.box('tugbody', x, y, 0.2, 3.4, 2.0, 1.5, rz); k.line('steel', x + 1.5 * math.cos(rz), y + 1.5 * math.sin(rz), x + 4.5 * math.cos(rz), y + 4.5 * math.sin(rz), 0.12, 0.12, 0.4)


def loader(k, x, y, rz):
    """a belt loader, its belt up to a hold that is not there"""
    k.rgb('belt', (52, 52, 52), 'rubber'); k.rgb('tugbody', (196, 160, 64), 'clay_mustard')
    k.box('tugbody', x, y, 0.3, 4.0, 2.0, 1.0, rz); k.box('belt', x, y, 1.3, 7.5, 0.9, 0.12, rz, -0.25)


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
    elif bid == 'apron.4':                                         # rule 346: the stands, COOK PROPS' fuel truck and baggage train
        k.model('airport.fuel_truck', *centre(1, 1), quarter=0)    # the fuel truck left at its stand (c1, row 1)
        k.model('airport.baggage', 48.0, 18.0, 0)                  # the baggage train dead across c3-c4, row 3
        k.rgb('cone', (190, 96, 50), 'clay_rust'); k.rgb('chock', (196, 158, 62), 'clay_mustard')
        for (cx, cy) in ((4, 44), (20, 46), (33, 8), (40, 30)): k.put('cyl6', 'cone', cx, cy, 0.0, 0.4, 0.4, 0.7)
        for (cx, cy) in ((12, 38), (14, 38)): k.box('chock', cx, cy, 0.0, 0.5, 0.3, 0.25)
        for (c, r) in ((3, 1), (4, 2), (1, 4)):
            x, y = centre(c, r); pc = piece_of(bid, c, r)
            if pc == 'apron_tug': tug(k, x, y, k.rng.uniform(0, 3.1))
            elif pc == 'apron_loader': loader(k, x, y, 0.4)
        luggage(k, 30.0, 26.0, 5.0, 14)
    elif bid == 'apron.3':
        k.rgb('mull', (92, 96, 98), 'tape_grey'); k.rgb('tglass', (66, 84, 92), 'glass_eye'); k.rgb('tconc', (176, 172, 162), 'clay_bone')
        k.box('tconc', 30.0, 55.0, 0.0, 60.0, 10.0, 8.4)            # the terminal (row 0): two storeys of glass and concrete, edge to edge
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
    if bid == 'trailer.1':                                            # COOK PROPS' single-wides end to end, north to south
        for c in (0, 2): k.model('trailer.trailer', centre(c, 0)[0], 48.0, 1)
        k.model('trailer.burnt', centre(4, 0)[0], 48.0, 1)
        for c in (1, 3): k.model('trailer.trailer', centre(c, 3)[0], 12.0, 3)
        for (c, r) in ((1, 1), (0, 2), (4, 2)): k.model('trailer.propane', *centre(c, r), quarter=int(k.rng.randint(4)))
        k.model('trailer.carport', *centre(2, 3))                       # between two homes (no height: its roof sags)
        k.model('trailer.clothesline', *centre(3, 1), quarter=1)        # the spotless washing (COOK PROPS' wrong thing)
        cx, cy = centre(2, 2)                                            # the car under a tarp in the lane (this lane's)
        k.box('tarp', cx, cy, 0.0, 4.6, 2.1, 1.4, 0.1); k.roof('tarp', cx, cy, 1.4, 4.4, 2.0, 0.2, 0.1)
        for (u, v) in ((-1.6, -1.05), (1.6, -1.05), (-1.6, 1.05), (1.6, 1.05)): k.tube('tyre', cx + u, cy + v, 0.0, 0.3, 0.65, 0.1)
        junk(0, 4); junk(4, 4)
    elif bid == 'trailer.2':
        k.rgb('office', (200, 190, 170), 'clay_bone'); k.rgb('sign', (150, 60, 44), 'clay_rust'); k.rgb('laundry', (176, 172, 160), 'tape_grey')
        k.rgb('troof', (168, 168, 160), 'tape_grey'); k.rgb('glass', (40, 48, 52), 'glass_eye')
        k.box('office', 12.0, 54.0, 0.0, 23.0, 10.5, 3.2); k.box('troof', 12.0, 54.0, 3.2, 23.4, 11.0, 0.15)
        k.box('dark', 6.0, 48.7, 0.0, 1.2, 0.05, 2.1)
        for i in range(3): k.box('glass', 12 + i * 3.5, 48.7, 1.2, 2.0, 0.05, 1.2)
        k.cyl('steel', 2.0, 46.5, 0.0, 0.15, 4.5); k.box('sign', 2.0, 46.5, 4.0, 3.2, 0.2, 1.4)   # the park's sign
        cx, cy = centre(3, 1); k.box('laundry', cx, cy, 0.0, 9.0, 7.0, 3.0); k.roof('troof', cx, cy, 3.0, 9.6, 7.6, 1.0)
        k.box('dark', cx - 2.0, cy - 3.52, 0.0, 1.2, 0.05, 2.1)
        k.model('trailer.trailer', 24.0, 18.0, 0)                        # a single-wide east to west across row 3, c1-c2
        for (c, r) in ((2, 1), (4, 1)): k.model('trailer.propane', *centre(c, r), quarter=int(k.rng.randint(4)))
        k.model('trailer.clothesline', *centre(3, 4))
        k.rgb('mailbox', (150, 152, 150), 'chrome'); x, y = centre(1, 2); y += 4.6           # the mailboxes on the lane's verge
        for i in range(3): k.box('mailbox', x - 2 + i * 2, y, 0.0, 1.8, 0.5, 1.4)
        k.rgb('dumpster', (66, 86, 98), 'clay_teal'); x, y = centre(0, 2); y -= 5.0            # the bins on the far verge
        for i in range(2): k.box('dumpster', x - 1.5 + i * 3.4, y, 0.0, 3.0, 1.6, 1.4, 0.1 * i)
        k.scatter('board', x - 4, x + 4, y - 4, y + 4, 12, 0.2, 0.5, 0.3)
        junk(4, 3); junk(1, 4)


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


JOSHUAS = {'desert.1': [(4, 1), (4, 3), (0, 4), (4, 4)], 'desert.2': [(4, 0), (0, 2), (4, 3), (0, 4)],
           'desert.3': [(1, 0), (0, 2), (3, 3), (4, 4), (2, 1), (1, 4)]}


def things_desert(k, bid):
    k.rgb('bould', (104, 98, 90), 'tape_grey'); k.rgb('bould_d', (76, 70, 64), 'rubber')
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('tyre', (34, 32, 31), 'rubber')
    T = BLOCKS[bid]['tiles']; M = BLOCKS[bid]['marks']
    for r in range(5):
        for c in range(5):
            pc = piece_of(bid, c, r); x, y = centre(c, r); x0, x1, y0, y1 = tile_m(c, r)
            if pc == 'desert_boulder': k.model('desert.boulders', x, y, int(k.rng.randint(4)))
            elif pc == 'desert_car': k.model('desert.buried_car', x, y, int(k.rng.randint(4)))
            elif pc is None and (c, r) in JOSHUAS.get(bid, ()):         # Joshua trees: decoration (COOK PROPS: the fight walks past)
                k.model('desert.joshua' if (c + r) % 2 else 'desert.joshua_small', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), int(k.rng.randint(4)))
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
    if bid == 'desert.1':                                             # COOK PROPS' pylon down across the wash (c1-c3, rows 1-2)
        k.model('desert.pylon', 30.0, 36.0, 0)
    if False:                                                         # (this lane's own pylon, kept for a place with no props)
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
            if T[r][c] == 'H': k.model('redrock.ledge_%d' % lv.get((c, r), 1), x, y, int(k.rng.randint(4)))   # COOK PROPS' ledges
            elif T[r][c] == '#' and bid != 'canyon.1': fin(k, x0 - 0.5, x1 + 0.5, y0 - 0.3, y1 + 0.3, 4, k.rng)
            elif T[r][c] == 'r': k.scatter('aztec_d', x0, x1, y0, y1, 18, 0.3, 1.1, 0.55)
            pc = piece_of(bid, c, r)
            if pc == 'canyon_boulder':
                for i in range(6): k.rock('aztec' if i % 2 else 'aztec_d', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), k.rng.uniform(1.2, 2.2), 0.7)
            elif pc == 'canyon_juniper':
                k.rgb('jun', (90, 78, 62), 'clay_rust'); k.rgb('jundead', (120, 100, 76), 'clay_bone')
                k.cyl('jun', x, y, 0.0, 0.5, 2.0)
                for i in range(6): k.rock('jundead', x + k.rng.uniform(-1.8, 1.8), y + k.rng.uniform(-1.8, 1.8), 1.3, 0.6, z=1.4 + k.rng.uniform(0, 1.2))
    if bid == 'canyon.1':                                             # COOK PROPS' fin either side of their slot, one man wide
        k.model('redrock.fin', 30.0, 48.0, 1); k.model('redrock.fin', 30.0, 12.0, 1); k.model('redrock.slot', 30.0, 30.0, 0)
        k.scatter('aztec_d', 26, 34, 25, 35, 14, 0.2, 0.6, 0.5)


def things_pass(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('tyre', (34, 32, 31), 'rubber'); k.rgb('glass', (40, 48, 52), 'glass_eye')
    k.rgb('lime', (122, 112, 98), 'tape_grey'); k.rgb('lime_d', (92, 84, 74), 'tape_grey'); k.rgb('rail', (170, 172, 168), 'chrome')
    k.rgb('pine', (70, 70, 56), 'metal_painted'); k.rgb('pinedead', (122, 98, 70), 'clay_bone')
    B = BLOCKS[bid]; T = B['tiles']; lv = {(c, r): n for (c, r, n) in B.get('roofs', [])}
    for r in range(5):
        for c in range(5):
            x0, x1, y0, y1 = tile_m(c, r); x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == '#' and not (bid == 'pass.1' and (c, r) in ((1, 2), (2, 2), (1, 3), (2, 3))):   # (the truck's own tiles: no rock)
                k.scatter('lime_d', x0 + 0.5, x1 - 0.5, y0 + 0.8, y1 - 0.8, 16, 4.0, 7.0, 0.8)
            elif T[r][c] == 'H' and (bid, c, r) == ('pass.1', 3, 2): k.model('pass.rockfall', x, y, 0)   # the heap across the lane
            elif T[r][c] == 'H':
                for kk in range(lv.get((c, r), 1)):
                    for _ in range(5): k.rock('lime' if kk % 2 else 'lime_d', k.rng.uniform(x0 + 3, x1 - 3), k.rng.uniform(y0 + 3, y1 - 3), 4.6, 0.3, z=kk * 3.0)
            elif T[r][c] in 'rd' and pc != 'pass_drop':
                k.scatter('lime_d', x0, x1, y0, y1, 40 if T[r][c] == 'r' else 60, 0.2, 0.8 if T[r][c] == 'r' else 1.4, 0.55)
            if pc == 'pass_boulder': boulders(k, x, y, 6, 2.4, 'lime')
            elif pc == 'pass_rail': k.model('pass.guardrail', x, y1 - 2.2, 0)          # COOK PROPS' W-beam on the road's lip
            elif pc == 'pass_barricade': k.model('pass.barricade', x, y, 0)
            elif pc == 'pass_drop':                                      # the drop: the slope falls away, dark, pines far below
                for _ in range(8): k.rock('lime_d', k.rng.uniform(x0, x1), k.rng.uniform(y0, y1), k.rng.uniform(0.8, 2.0), 0.5)
                for _ in range(3): k.rock('pine', k.rng.uniform(x0 + 1, x1 - 1), k.rng.uniform(y0 + 1, y1 - 3), k.rng.uniform(1.2, 2.0), 0.9, z=-0.4)
            elif pc == 'pass_car':
                k.rgb('car_c', (120, 132, 140), 'clay_teal'); k.box('car_c', x, y, 0.3, 4.4, 1.8, 1.1, 0.3); k.box('glass', x + 0.4, y + 0.1, 1.4, 1.6, 1.6, 0.4, 0.3)
                for (u, v) in ((-1.4, -0.9), (1.4, -0.9), (-1.4, 0.9), (1.4, 0.9)): k.tube('tyre', x + u, y + v, 0.0, 0.25, 0.6, 0.3)
    if bid == 'pass.1': k.model('pass.truck', 24.0, 24.0, 0)          # COOK PROPS' jackknifed semi across the road (c1-c2, rows 2-3)
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
            if pc == 'shore_boat': k.model('shore.boat', x, y, int(k.rng.randint(4)))             # COOK PROPS' runabout on its side
            elif pc == 'shore_junk':
                for i in range(5): k.cyl('buoy' if i % 2 else 'drum_w', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), 0.0, 0.7, 0.9)
                k.tube('drum_w', x + 2, y - 2, 0.0, 1.0, 0.7, 0.7)
            elif pc == 'shore_car':
                k.rgb('truck', (120, 120, 116), 'tape_grey'); k.box('truck', x - 3, y, 0.4, 5.5, 2.1, 1.6, 0.0)
                k.box('glass', x - 1.6, y, 1.6, 0.05, 1.8, 0.6)
                k.rgb('hull', (196, 192, 180), 'tape_grey'); k.tube('hull', x + 3.5, y, 0.6, 6.0, 2.0, 0.0)
                for (u, v) in ((-4.6, -1), (-1.6, -1), (-4.6, 1), (-1.6, 1), (3.5, -1), (3.5, 1)): k.tube('tyre', x + u, y + v, 0.0, 0.3, 0.75, 0.0)
            if T[r][c] == 'w': k.scatter('mudrock', x0, x1, y0, y1, 3, 0.2, 0.5, 0.5)
    if bid == 'lakebed.1':                                             # COOK PROPS' intake tower (c2, rows 1-2), a dock come to rest (c3-c4)
        k.model('shore.intake', 30.0, 36.0, 0); k.model('shore.dock', 48.0, 42.0, 0)
        for (c, r) in ((4, 3), (1, 0)): k.model('shore.buoys', *centre(c, r), quarter=int(k.rng.randint(4)))
    if bid == 'lakebed.2':
        k.model('shore.dock', 48.0, 30.0, 2)
        for (c, r) in ((3, 3), (2, 4)): k.model('shore.buoys', *centre(c, r), quarter=int(k.rng.randint(4)))
    if bid == 'lakebed.3':                                             # the white bathtub ring (a step up) and a second one far above it
        k.model('shore.dock', 18.0, 18.0, 0)                          # two docks' worth of deck on the old shore, row 3
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
            elif pc == 'wash_sofa': k.model('wash.sofa', x, y, 0)                     # COOK PROPS' sofa, its lamp lit
            elif pc == 'wash_jam': k.model('wash.jam', x, y, int(k.rng.randint(4)))
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
    if bid == 'wash.2':                                                # COOK PROPS' twin-box culvert under the road (c2), the fill either side
        k.model('wash.culvert', 30.0, 30.0, 0)
        k.rgb('asph', (70, 68, 64), 'rubber')
        for (a, b) in ((12.0, 22.6), (37.4, 48.0)): k.box('wconc', (a + b) / 2, 30.0, 0.0, b - a, 12.0, 4.0); k.box('asph', (a + b) / 2, 30.0, 4.0, b - a, 9.0, 0.08)
    if bid in ('wash.2', 'wash.3', 'wash.4'):
        for _ in range(2): k.model('wash.cart', k.rng.uniform(26, 34), k.rng.uniform(4, 56) if bid != 'wash.4' else k.rng.uniform(4, 56), int(k.rng.randint(4)))
    if bid in ('wash.2', 'wash.3'):
        k.scatter('wconc_d', 26, 34, 0, 60, 14, 0.2, 0.6, 0.5)


def things_dump(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber')
    k.rgb('trash_w', (190, 188, 180), 'tape_grey'); k.rgb('trash_b', (44, 42, 44), 'cloth_black'); k.rgb('trash_t', (80, 104, 110), 'clay_teal')
    k.rgb('trash_r', (150, 70, 50), 'clay_rust'); k.rgb('scorch', (38, 33, 29), 'rubber')
    B = BLOCKS[bid]; T = B['tiles']
    for r in range(5):
        for c in range(5):
            x0, x1, y0, y1 = tile_m(c, r); x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == 'H': k.model('landfill.mound', x, y, int(k.rng.randint(4)))            # COOK PROPS' trash mound
            elif pc == 'landfill_wells': k.model('landfill.wells', x, y, int(k.rng.randint(2)) * 2)
            elif pc == 'landfill_fire':
                for _ in range(10): k.rock('scorch', x + k.rng.uniform(-5, 5), y + k.rng.uniform(-5, 5), k.rng.uniform(1.5, 3.0), 0.012, -1.0)
            if T[r][c] == '.' and pc is None:                                  # the trash working up through the cover soil
                for m_ in ('trash_w', 'trash_b', 'trash_t', 'trash_r'):
                    for _ in range(4): k.box(m_, x + k.rng.uniform(-5.5, 5.5), y + k.rng.uniform(-5.5, 5.5), 0.0, k.rng.uniform(0.3, 0.9), k.rng.uniform(0.2, 0.6), 0.1, k.rng.uniform(0, 3))
    if bid == 'dump.1':
        k.model('landfill.flare', *centre(1, 2)); k.model('landfill.dozer', *centre(2, 3), quarter=0)


def things_yards(k, bid):
    k.rgb('block', (168, 150, 126), 'clay_bone'); k.rgb('cap', (186, 172, 150), 'clay_bone')
    B = BLOCKS[bid]; T = B['tiles']
    for r in range(5):
        for c in range(5):
            x0, x1, y0, y1 = tile_m(c, r); x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == 'r': k.model('suburbs.pool', x, y, int(k.rng.randint(2)) * 2)          # COOK PROPS' empty pool
            if pc == 'yards_wall':                                             # their wall corner, and the run it belongs to
                k.model('suburbs.yard_wall', x + k.rng.uniform(-2, 2), y + k.rng.uniform(-2, 2), int(k.rng.randint(4)))
                k.box('block', x, y, 0.0, 12.0, 0.22, 1.8); k.box('cap', x, y, 1.8, 12.1, 0.3, 0.06)   # the lot line's run, east to west
                for px_ in (x - 5.9, x + 5.9): k.box('cap', px_, y, 0.0, 0.45, 0.45, 2.0)                # its pilasters
            if pc == 'yards_car': car(k, x + k.rng.uniform(-2, 2), 7.6 if (c % 2) else 5.0, k.rng.uniform(-0.1, 0.1),
                                      ((150, 146, 140), (96, 104, 112), (150, 40, 36), (206, 204, 196))[c % 4], wreck=c == 3)
    # the houses on row 0, their backs to the yards and the camera: stucco, a sliding door and a patio slab, the roof walked
    k.rgb('stucco', (196, 178, 150), 'clay_bone'); k.rgb('stucco2', (176, 160, 140), 'clay_bone'); k.rgb('tile', (150, 96, 70), 'clay_rust')
    k.rgb('glass', (40, 48, 52), 'glass_eye'); k.rgb('patio', (170, 164, 150), 'tape_grey')
    for c in range(5):
        if T[0][c] != 'H': continue
        x = c * 12.0 + 6.0
        k.box('stucco' if c % 2 else 'stucco2', x, 54.0, 0.0, 11.4, 11.0, 3.0); k.roof('tile', x, 54.0, 3.0, 11.8, 11.4, 1.0)
        k.box('glass', x - 1.5, 48.46, 0.2, 3.0, 0.05, 2.1); k.box('patio', x - 1.5, 47.0, 0.0, 6.0, 2.8, 0.08)
    if bid == 'yards.1': k.model('suburbs.swing', *centre(2, 1), quarter=0); k.model('suburbs.trampoline', *centre(2, 3))
    else: k.model('suburbs.swing', *centre(2, 2), quarter=0); k.model('suburbs.trampoline', *centre(0, 2))


def things_rail(k, bid):
    k.rgb('rail', (170, 172, 174), 'chrome')
    for (a, b) in [(24.0, 36.0)]:
        for v in (-0.72, 0.72): k.box('rail', 30.0, (a + b) / 2 + v, 0.1, 60.0, 0.08, 0.16)
    B = BLOCKS[bid]
    for r in range(5):
        for c in range(5):
            x, y = centre(c, r); pc = piece_of(bid, c, r)
            if pc == 'works_pipes': k.model('works.pipes', x, y, int(k.rng.randint(2)) * 2)
    if bid == 'rail.1':
        k.model('works.boxcar', 12.0, 30.0, 0); k.model('works.tankcar', 48.0, 30.0, 0); k.model('works.gantry', 24.0, 18.0, 0)
        k.model('works.machines', *centre(4, 0))
    else:
        k.model('works.machines', *centre(1, 1)); k.model('works.machines', *centre(3, 4), quarter=2); k.model('works.boxcar', 36.0, 30.0, 0)


def things_basin(k, bid):
    B = BLOCKS[bid]; T = B['tiles']
    for r in range(5):
        for c in range(5):
            x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == '#': k.model('marina.cruiser', x, y, int(k.rng.randint(4)))
            elif pc == 'marina_bass': k.model('marina.bass_boat', x, y, int(k.rng.randint(4)))
    if bid == 'basin.1': k.model('marina.houseboat', 24.0, 30.0, 0); k.model('shore.dock', 46.0, 30.0, 0)   # moored to its dock, both
    # come to rest on the dry bed (rule 346: the landmark a group of four cells between the lines)
    k.rgb('mudrock', (140, 132, 118), 'tape_grey'); k.scatter('mudrock', 0, 60, 0, 60, 30, 0.2, 0.6, 0.5)


def dead_palm(k, x, y, hgt):
    k.rgb('ptrunk', (120, 104, 80), 'clay_bone'); k.rgb('pfrond', (112, 92, 64), 'clay_bone'); k.rgb('pfrond_d', (84, 70, 52), 'clay_bone')
    k.cyl('ptrunk', x, y, 0.0, 0.55, hgt)
    for i in range(12):                                                      # the dead fronds hang in a skirt under where the crown was
        a = i * 0.52; k.rock('pfrond' if i % 2 else 'pfrond_d', x + 0.6 * math.cos(a), y + 0.6 * math.sin(a), 0.9, 2.2, z=hgt - 2.6)


def car(k, x, y, rz, body=(150, 146, 140), cab=False, wreck=False):
    """a sedan (or a cab: yellow, its roof sign): body, cabin glass, wheels"""
    nm = 'car_%d_%d_%d' % body; k.rgb(nm, body, 'tape_grey'); k.rgb('glass', (40, 48, 52), 'glass_eye'); k.rgb('tyre', (34, 32, 31), 'rubber')
    ca, sa = math.cos(rz), math.sin(rz); P = lambda u, v: (x + u * ca - v * sa, y + u * sa + v * ca)
    k.box(nm, x, y, 0.3, 4.6, 1.85, 0.75, rz, 0.06 if wreck else 0.0)
    cx, cy = P(-0.2, 0); k.box(nm, cx, cy, 1.05, 2.4, 1.7, 0.5, rz); k.box('glass', cx, cy, 1.06, 2.2, 1.72, 0.42, rz)
    for (u, v) in ((-1.45, -0.92), (1.45, -0.92), (-1.45, 0.92), (1.45, 0.92)):
        tx, ty = P(u, v); k.tube('tyre', tx, ty, 0.0, 0.25, 0.64, rz + math.pi / 2)
    if cab: k.rgb('cabsign', (226, 220, 200), 'tape_grey'); k.box('cabsign', cx, cy, 1.55, 0.9, 0.3, 0.3, rz)


def tower(k, x0, x1, y0, y1, hgt, wall, glass, band, roof, storey=3.2, letters=None, pool=False):
    """a casino's mass on its own tiles, its south face to the camera: storeys of glass between bands of wall, a gold crown,
    its roof plant; dead neon letters standing on the roof's south edge; a rooftop pool"""
    cx, cy, w = (x0 + x1) / 2, (y0 + y1) / 2, x1 - x0
    k.rgb('hvac', (160, 162, 160), 'chrome'); k.rgb('poolw', (88, 150, 150), 'clay_teal')
    k.box(wall, cx, cy, 0.0, w, y1 - y0, hgt); k.box(roof, cx, cy, hgt, w + 0.3, y1 - y0 + 0.3, 0.3)
    fy = y0 - 0.06
    k.box(band, cx, fy, 0.0, w, 0.1, 5.0)                                  # the podium's gold fascia, the doors' storey
    for i in range(int((hgt - 7.0) // storey)):                            # the glass storeys between the wall's bands
        k.box(glass, cx, fy - 0.02, 6.0 + i * storey, w - 0.8, 0.08, storey - 0.9)
    k.box(band, cx, fy - 0.04, hgt - 1.2, w + 0.2, 0.12, 1.2)                # the crown
    rng = k.rng
    for i in range(int(w // 9)):
        k.box('hvac', x0 + 4 + i * 9 + rng.uniform(-1, 1), cy + rng.uniform(-8, 8), hgt + 0.3, 2.6, 2.0, 1.3)
    if pool:                                                               # the rooftop pool, its water still standing, gone green
        k.rgb('pooldeck', (214, 210, 196), 'tape_grey')
        k.box('pooldeck', cx, y0 + 10.0, hgt + 0.3, min(w - 2, 18.0), 10.0, 0.2); k.box('poolw', cx, y0 + 10.0, hgt + 0.5, min(w - 6, 13.0), 5.5, 0.06)
    if letters:                                                            # the name on its frame, every letter dead
        k.rgb('ltr', letters, 'clay_rust'); k.rgb('lframe', (90, 90, 92), 'rubber')
        n = max(4, int(w // 3.4)); k.box('lframe', cx, y0 + 1.5, hgt + 0.3, w - 2.0, 0.3, 0.5)
        for i in range(n): k.box('ltr', x0 + 1.8 + i * (w - 3.6) / (n - 1), y0 + 1.4, hgt + 0.8, 2.2, 0.35, 3.4 if i % 3 else 2.8)


def front(k, x0, x1, y0, y1, hgt, wall, sign, neon, bulbs=True):
    """a Fremont casino front on its own tiles, its face to the street and the camera: the sign band with its dead letters,
    the windows over it, the cornice"""
    cx, cy, w = (x0 + x1) / 2, (y0 + y1) / 2, x1 - x0
    k.rgb('roofg', (120, 116, 108), 'tape_grey'); k.rgb('win', (40, 44, 48), 'glass_eye'); k.rgb('fdark', (30, 28, 27), 'rubber')
    k.rgb('signc', sign, 'clay_mustard'); k.rgb('neonc', neon, 'clay_rust')
    k.box(wall, cx, cy, 0.0, w, y1 - y0, hgt); k.box('roofg', cx, cy, hgt, w + 0.2, y1 - y0 + 0.2, 0.3)
    fy = y0 - 0.06
    k.box('fdark', cx, fy, 0.0, w - 0.6, 0.08, 4.6)                        # the ground floor's dark glass, the doors behind it
    k.box('signc', cx, fy - 0.1, 5.4, w, 0.2, 3.4)                          # the sign band
    n = max(3, int(w // 2.2))
    for i in range(n): k.box('neonc', x0 + 1.2 + i * (w - 2.4) / max(1, n - 1), fy - 0.25, 5.9, 1.3, 0.12, 2.4)   # its dead letters
    if bulbs:
        k.rgb('bulb', (210, 190, 130), 'clay_mustard')
        for i in range(int(w // 0.9)): k.box('bulb', x0 + 0.45 + i * 0.9, fy - 0.3, 9.0, 0.22, 0.12, 0.22)
    for j in range(int((hgt - 11.0) // 3.2)):                              # the windows over it
        for i in range(int(w // 3.0)): k.box('win', x0 + 1.5 + i * 3.0, fy - 0.02, 10.8 + j * 3.2, 1.4, 0.06, 1.8)
    k.box(wall, cx, fy - 0.3, hgt - 1.0, w + 0.4, 0.6, 1.0)                 # the cornice


def slots(k, x, y, n=8):
    k.rgb('slotcab', (120, 30, 34), 'clay_rust'); k.rgb('slotscr', (30, 34, 38), 'glass_eye'); k.rgb('slottop', (196, 170, 90), 'clay_mustard')
    for i in range(n):
        sx, sy, a = x + k.rng.uniform(-4, 4), y + k.rng.uniform(-4, 4), k.rng.uniform(0, 3.1)
        tip = 1.45 if i % 3 == 0 else 0.0
        k.box('slotcab', sx, sy, 0.0, 0.8, 0.7, 1.7, a, tip); k.box('slotscr', sx, sy, 0.9 if not tip else 0.36, 0.6, 0.72, 0.5, a, tip)
        if not tip: k.box('slottop', sx, sy, 1.7, 0.82, 0.72, 0.15, a)


def planter(k, x, y, palm=True):
    k.rgb('planter', (196, 190, 178), 'tape_grey'); k.box('planter', x, y, 0.0, 2.6, 2.6, 0.8)
    if palm: dead_palm(k, x, y, k.rng.uniform(8.0, 11.0))


def streetlight(k, x, y, arms=(-1, 1)):
    k.rgb('pole', (110, 112, 112), 'chrome'); k.cyl('pole', x, y, 0.0, 0.32, 11.0)
    for a in arms: k.box('pole', x + a * 1.8, y, 10.6, 3.6, 0.22, 0.22); k.box('pole', x + a * 3.4, y, 10.2, 0.9, 0.5, 0.35)


def things_blvd(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome')
    T = BLOCKS[bid]['tiles']
    for r in range(5):
        for c in range(5):
            x, y = centre(c, r); pc = piece_of(bid, c, r)
            if pc == 'strip_planter': planter(k, x + (-1.0 if c == 0 else 1.0 if c == 4 else 0.0), y + k.rng.uniform(-2, 2), palm=(c != 2 or r % 2 == 0))
            elif pc == 'strip_car':                                         # a cab and a wreck in the lane, nose to tail where they died
                yel = (c + r) % 2 == 0
                car(k, x - 1.6, y + 2.4, math.pi / 2 + k.rng.uniform(-0.25, 0.25), (226, 190, 60) if yel else (150, 40, 36), cab=yel)
                car(k, x + 1.9, y - 2.6, math.pi / 2 + k.rng.uniform(-0.7, 0.7), (96, 104, 112), wreck=True)
    for (lx, ly) in ((4.5, 8.0), (55.0, 30.0), (5.5, 52.0)):                 # what the last tourists dropped on the sidewalks
        luggage(k, lx, ly, 1.6, 7)
    for yy in (0.0, 12.0, 24.0, 36.0, 48.0):                                 # the median's lights, dead, every tile
        if not (bid == 'blvd.1' and yy in (24.0, 0.0)): streetlight(k, 30.0, yy + 3.0)
    if bid == 'blvd.1':
        k.model('strip.bridge', 21.0, 30.0, 0)                               # COOK PROPS' bridge, kerb to median, two storeys up (c1-c2, row 2)
        k.rgb('pier', (186, 180, 168), 'tape_grey')
        k.box('pier', 31.0, 30.0, 0.0, 2.4, 2.4, 6.6)                       # its pier in the median
        k.box('pier', 6.5, 30.0, 0.0, 6.0, 5.0, 7.2); k.rgb('stair', (70, 74, 78), 'rubber')   # its stair tower on the sidewalk
        for i in range(8): k.box('stair', 6.5, 27.2 + i * 0.7, 0.4 + i * 0.85, 5.0, 0.6, 0.12)
        k.model('strip.limo', *centre(1, 3), quarter=1)                     # their limo dead in the lane, under the bridge
        # the Welcome sign in the median: its diamond on two posts, the white face, the red rim, its circles and dead bulbs
        wx_, wy_ = centre(2, 4); k.rgb('wsign', (232, 228, 214), 'tape_grey'); k.rgb('wrim', (190, 70, 52), 'clay_rust'); k.rgb('wteal', (70, 110, 118), 'clay_teal')
        k.rgb('wbulb', (210, 186, 120), 'clay_mustard'); k.rgb('wbase', (196, 190, 178), 'tape_grey')
        k.box('wbase', wx_, wy_, 0.0, 5.2, 2.6, 1.0)
        for v in (-1.6, 1.6): k.cyl('steel', wx_ + v, wy_, 1.0, 0.28, 2.6)
        k.put('diamond', 'wrim', wx_, wy_, 3.0, 7.6, 0.3, 4.8); k.put('diamond', 'wsign', wx_, wy_ - 0.12, 3.25, 6.9, 0.3, 4.3)
        for i in range(7): k.tube('wteal' if i % 2 else 'wrim', wx_ - 2.4 + i * 0.8, wy_ - 0.32, 5.3, 0.06, 0.62, math.pi / 2)
        for i in range(16): a = i * 0.39; k.tube('wbulb', wx_ + 3.1 * math.cos(a), wy_ - 0.34, 5.35 + 1.8 * math.sin(a), 0.06, 0.2, math.pi / 2)
        k.box('wrim', wx_, wy_ - 0.3, 3.8, 3.4, 0.08, 0.5); k.box('wteal', wx_, wy_ - 0.3, 6.8, 2.2, 0.08, 0.35)
    else:                                                                    # the tour bus on its side across two lanes (c1, rows 3-4)
        k.rgb('bus', (206, 204, 196), 'tape_grey'); k.rgb('busband', (150, 54, 50), 'clay_rust'); k.rgb('glass', (40, 48, 52), 'glass_eye')
        k.box('bus', 18.0, 12.0, 0.0, 2.6, 12.4, 3.2, 0.05, 1.45); k.box('busband', 18.7, 12.0, 0.5, 0.4, 12.2, 2.4, 0.05, 1.45)
        k.box('glass', 19.4, 12.0, 0.3, 0.2, 11.0, 1.2, 0.05, 1.45)


def things_strip_front(k, bid):
    """a casino frontage, from the Boulevard out: xb is metres in from the Boulevard's side (the west frontage mirrored)"""
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (140, 142, 140), 'chrome'); k.rgb('brass', (196, 160, 80), 'clay_mustard')
    west = bid.startswith('stripw'); X = (lambda xb: 60.0 - xb) if west else (lambda xb: xb)
    T = BLOCKS[bid]['tiles']
    if west:                                                                 # the west house: bone stone, amber glass, its gold
        k.rgb('wallA', (186, 160, 126), 'clay_bone'); k.rgb('glassA', (200, 166, 92), 'chrome'); k.rgb('bandA', (214, 178, 96), 'clay_mustard')
        k.rgb('roofA', (164, 146, 120), 'clay_bone'); ltr = (150, 54, 50); hgt = {'stripw.1': 24.0, 'stripw.2': 21.0, 'stripw.3': 27.0}[bid]
    else:                                                                    # the east house: the pink tower, teal glass, white crown
        k.rgb('wallA', (204, 140, 146), 'clay_rust'); k.rgb('glassA', (64, 108, 116), 'clay_teal'); k.rgb('bandA', (232, 226, 214), 'tape_grey')
        k.rgb('roofA', (176, 150, 150), 'clay_rust'); ltr = (70, 110, 118); hgt = {'stripe.1': 30.0, 'stripe.2': 27.0}[bid]
    masscols = [c for c in range(5) if all(T[r][c] == '#' for r in range(5))]
    xa, xz = min(c * 12.0 for c in masscols), max((c + 1) * 12.0 for c in masscols)
    tower(k, xa + 0.4, xz - 0.4, 0.4, 59.6, hgt, 'wallA', 'glassA', 'bandA', 'roofA', letters=ltr if not bid.endswith('.1') else None, pool=bid.endswith('.1'))
    for r in range(5):
        for c in range(5):
            x, y = centre(c, r); pc = piece_of(bid, c, r)
            if T[r][c] == '#' and c not in masscols and bid != 'stripe.1':  # an LED pylon by the sidewalk, its dead screen to the street
                k.rgb('ledframe', (60, 60, 64), 'rubber'); k.rgb('ledface', (34, 38, 44), 'glass_eye'); k.rgb('ledpix', (90, 130, 140), 'clay_teal')
                px_ = X(20.0); hg = 13.0 if r == 1 else 11.0
                k.box('ledframe', px_, y, 0.0, 3.6, 3.6, 2.6); k.box('ledframe', px_, y, 2.6, 1.6, 1.6, hg - 7.6)
                k.box('ledframe', px_, y, hg - 5.2, 9.6, 1.0, 5.6); k.box('ledface', px_, y - 0.56, hg - 4.8, 9.0, 0.05, 4.8)
                for i in range(5): k.box('ledpix', px_ - 3.6 + i * 1.8, y - 0.6, hg - 2.6 - (i % 2) * 1.2, 0.5, 0.04, 0.4)
            if pc == 'strip_planter': planter(k, x, y)
            elif pc == 'strip_entrance':                                    # the vestibule out of the casino's face: dark glass, brass, a gold lid
                ex = X(34.4); k.box('dark', ex, y, 0.0, 3.2, 8.0, 3.4)
                for v in (-4.0, 4.0): k.box('brass', X(32.7), y + v, 0.0, 0.4, 0.4, 3.6)
                k.box('bandA', X(34.0), y, 3.4, 4.4, 9.0, 0.4); slots(k, X(28.0), y, 3)
            elif pc == 'strip_slots': slots(k, x, y, 9)
            elif pc == 'strip_fountain': k.model('strip.fountain', x, y, 0)
            elif pc == 'strip_car':                                         # the valet's last cars, nose in, keys still in the box
                for i, col_ in enumerate(((150, 30, 34), (20, 20, 22), (226, 222, 214))):
                    car(k, x - 3.4 + i * 3.4, y + k.rng.uniform(-0.4, 0.4), math.pi / 2 + k.rng.uniform(-0.08, 0.08), col_)
    if bid.endswith('.1'):                                                   # the porte-cochere over the drop-off: posts, the canopy, its dead marquee
        k.rgb('pcanopy', (232, 228, 216), 'tape_grey'); k.rgb('pled', (40, 40, 44), 'glass_eye')
        for v in (26.0, 36.0, 46.0):
            for u in (13.2, 22.8): k.cyl('steel', X(u), v, 0.0, 0.55, 6.0)
        k.box('pcanopy', X(18.0), 36.0, 6.0, 11.0, 22.4, 0.6); k.box('bandA', X(18.0), 36.0, 6.6, 11.2, 22.6, 0.45)
        k.box('pled', X(18.0), 24.7, 6.2, 9.0, 0.2, 1.4)
        k.rgb('luggage', (150, 60, 44), 'clay_rust')
        for i in range(3): k.box('steel', X(24.0), 27.0 + i * 3.0, 0.3, 1.0, 1.8, 0.1); k.box('luggage', X(24.0), 27.0 + i * 3.0, 0.4, 0.7, 0.5, 0.45)
    if bid == 'stripe.1': k.model('strip.sign', 24.0, 18.0, 0)              # COOK PROPS' arrow sign fallen across the drive (c1-c2, row 3)
    if bid == 'stripw.1': car(k, X(17.5), 40.0, math.pi / 2 + 0.1, (226, 190, 60), cab=True)   # a cab left at the drop-off
    if bid == 'stripe.2': car(k, X(18.0), 20.0, math.pi / 2 - 0.15, (20, 20, 22))
    if bid == 'stripw.3':                                                   # the valet stand on the drop-off and its key box, open
        k.rgb('podium', (120, 30, 34), 'clay_rust'); k.box('podium', X(23.4), 30.0, 0.0, 1.0, 1.4, 1.2); k.box('brass', X(23.4), 31.2, 0.0, 0.4, 0.6, 1.6)
        k.rgb('rope', (150, 30, 34), 'clay_rust')
        for i in range(4): k.cyl('brass', X(23.6), 22.0 + i * 2.6, 0.0, 0.18, 1.0)
        for i in range(3): k.line('rope', X(23.6), 22.0 + i * 2.6, X(23.6), 24.6 + i * 2.6, 0.06, 0.06, 0.8)


def vegas_vic(k, x, y, hgt=14.0):
    """the cowboy sign: a steel lattice tower, the flat cowboy on it, his arm up, his cigarette, the neon dead"""
    k.rgb('vic', (226, 214, 186), 'tape_grey'); k.rgb('vicshirt', (180, 70, 50), 'clay_rust'); k.rgb('vichat', (230, 226, 214), 'tape_grey')
    k.rgb('lattice', (120, 122, 120), 'tape_grey')
    for (u, v) in ((-1.4, -1.0), (1.4, -1.0), (-1.4, 1.0), (1.4, 1.0)): k.cyl('lattice', x + u, y + v, 0.0, 0.25, hgt * 0.45)
    for i in range(5): k.box('lattice', x, y, i * hgt * 0.09, 3.0, 2.2, 0.15)
    z = hgt * 0.45
    k.box('vicshirt', x, y, z + 3.0, 2.6, 0.4, 3.2); k.box('vic', x, y, z, 2.2, 0.4, 3.0)          # his jeans, his shirt
    k.box('vic', x, y, z + 6.2, 1.4, 0.4, 1.6); k.box('vichat', x, y, z + 7.8, 3.4, 0.5, 0.5); k.box('vichat', x, y, z + 8.3, 1.6, 0.5, 1.0)
    k.box('vicshirt', x + 1.8, y, z + 5.0, 0.6, 0.4, 3.2, 0.0, 0.0)                                  # the arm up, waving
    k.box('vic', x - 1.8, y, z + 3.6, 0.6, 0.4, 2.2)


def seg(k, m, x, y0, z0, y1, z1, w=0.3):
    """a straight member from (y0, z0) to (y1, z1) in the north-south plane at x: a box leaned about x"""
    L = math.hypot(y1 - y0, z1 - z0); k.box(m, x, y0, z0, w, w, L, 0.0, math.atan2(-(y1 - y0), (z1 - z0)))


def vic_flat(k, x, y, z0=1.2):
    """the cowboy on his front: flat on the face, his arm up, his hat, his cigarette, every bulb dead"""
    k.rgb('vic', (226, 214, 186), 'tape_grey'); k.rgb('vicshirt', (180, 70, 50), 'clay_rust'); k.rgb('vichat', (232, 228, 216), 'tape_grey')
    k.rgb('vicjeans', (70, 96, 120), 'clay_teal'); k.rgb('vicbulb', (210, 186, 120), 'clay_mustard')
    k.box('vicjeans', x - 0.5, y, z0, 0.7, 0.3, 3.4); k.box('vicjeans', x + 0.5, y, z0, 0.7, 0.3, 3.4)
    k.box('vicshirt', x, y, z0 + 3.4, 2.4, 0.3, 3.0); k.box('vic', x, y, z0 + 6.4, 1.2, 0.3, 1.4)
    k.box('vichat', x, y - 0.05, z0 + 7.7, 3.0, 0.3, 0.35); k.box('vichat', x, y - 0.05, z0 + 8.0, 1.5, 0.3, 0.8)
    k.box('vicshirt', x + 1.6, y, z0 + 5.2, 0.6, 0.3, 2.8); k.box('vic', x + 1.6, y, z0 + 8.0, 0.6, 0.3, 0.7)   # the arm up, the hand
    k.box('vicshirt', x - 1.5, y, z0 + 4.0, 0.6, 0.3, 2.2)
    for i in range(14): k.box('vicbulb', x - 1.6 + (i % 7) * 0.53, y - 0.12, z0 + 3.6 + (i // 7) * 2.4, 0.12, 0.06, 0.12)


def things_fremont(k, bid):
    k.rgb('dark', (26, 24, 23), 'rubber'); k.rgb('steel', (110, 112, 112), 'chrome'); k.rgb('brass', (196, 160, 80), 'clay_mustard')
    k.rgb('glass', (40, 48, 52), 'glass_eye'); k.rgb('hvac', (160, 162, 160), 'chrome'); k.rgb('conc', (168, 164, 154), 'tape_grey')
    T = BLOCKS[bid]['tiles']
    for r in range(5):
        for c in range(5):
            x, y = centre(c, r); pc = piece_of(bid, c, r)
            if pc == 'downtown_kiosk':
                k.rgb('kiosk', (150, 60, 44), 'clay_rust'); k.rgb('kioskt', (214, 178, 96), 'clay_mustard')
                k.box('kiosk', x, y, 0.0, 3.4, 2.4, 2.4); k.roof('kioskt', x, y, 2.4, 3.8, 2.8, 0.7)
            elif pc == 'downtown_slots': slots(k, x, y, 6)
            elif pc == 'downtown_dumpsters': k.model('downtown.dumpsters', x, y, 0)
            elif pc == 'downtown_car':
                body = ((150, 146, 140), (96, 104, 112), (150, 40, 36), (206, 204, 196), (60, 64, 70))[(c * 3 + r) % 5]
                car(k, x + k.rng.uniform(-2, 2), y + k.rng.uniform(-1.2, 1.2), k.rng.uniform(-0.15, 0.15), body, wreck=(c + r) % 3 == 0)
            elif pc == 'downtown_panels':                                   # the screen's panels where they fell, face down
                k.rgb('panel', (34, 36, 40), 'glass_eye'); k.rgb('panelback', (90, 92, 94), 'chrome')
                for i in range(5):
                    a = k.rng.uniform(0, 3.1); px_, py_ = x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3)
                    k.box('panelback' if i % 2 else 'panel', px_, py_, 0.0 + i * 0.12, 2.4, 1.6, 0.1, a, k.rng.uniform(0, 0.4))
            elif pc == 'downtown_junk':                                     # the pawn shop's yard: what nobody bought
                k.rgb('junk', (120, 104, 84), 'clay_bone'); k.rgb('tyre', (34, 32, 31), 'rubber')
                k.scatter('junk', x - 4, x + 4, y - 4, y + 4, 12, 0.4, 1.0, 0.5)
                for i in range(3): k.tube('tyre', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), 0.0, 0.3, 0.7, k.rng.uniform(0, 3))
    if bid in ('fremont.10', 'fremont.11'):                                 # FREMONT EAST: its lights along the north kerb
        for xx in (6.0, 30.0, 54.0): streetlight(k, xx, 23.0, arms=(1,))
    if bid == 'fremont.10':
        # THE MOTEL: two storeys, salmon stucco, turquoise doors, its walkway along the court; the back wing (row 0) and the west wing
        k.rgb('motel', (206, 156, 132), 'clay_rust'); k.rgb('mdoor', (70, 130, 132), 'clay_teal'); k.rgb('mtrim', (232, 228, 216), 'tape_grey')
        k.box('motel', 18.0, 54.0, 0.0, 35.2, 11.2, 6.4); k.box('mtrim', 18.0, 54.0, 6.4, 35.6, 11.6, 0.35)
        k.box('motel', 6.0, 36.2, 0.0, 11.2, 23.6, 6.4); k.box('mtrim', 6.0, 36.2, 6.4, 11.6, 24.0, 0.35)
        for i in range(6):                                                  # the back wing's doors, both storeys, facing the court
            for z in (0.0, 3.3):
                k.box('mdoor', 14.0 + i * 3.6, 48.36, z, 1.0, 0.06, 2.2); k.box('glass', 15.0 + i * 3.6, 48.36, z + 1.0, 0.9, 0.05, 0.9)
        k.box('mtrim', 24.0, 47.4, 3.1, 23.6, 2.0, 0.2); k.box('steel', 24.0, 46.5, 3.3, 23.6, 0.06, 1.0)   # the upper walkway, its rail
        k.box('motel', 6.0, 24.3, 0.0, 9.0, 0.08, 0.0); k.box('glass', 6.0, 24.36, 1.0, 6.0, 0.05, 1.6)       # the office's window
        k.box('mdoor', 9.0, 24.36, 0.0, 1.0, 0.06, 2.2)
        k.model('suburbs.pool', *centre(1, 1), quarter=0)                   # the pool, empty, in the court (row 1)
        sx, sy = centre(2, 2)                                               # the sign: a pole, the board to the street, the arrow
        k.rgb('signboard', (226, 216, 190), 'tape_grey'); k.rgb('signred', (170, 56, 46), 'clay_rust'); k.rgb('bulb', (210, 186, 120), 'clay_mustard')
        k.box('conc', sx, sy, 0.0, 1.4, 1.4, 1.0); k.cyl('steel', sx, sy, 1.0, 0.45, 7.0)
        k.box('signboard', sx, sy - 0.3, 6.0, 6.4, 0.4, 3.2); k.box('signred', sx, sy - 0.52, 7.9, 5.8, 0.05, 1.0)
        for i in range(5): k.box('signred', sx - 2.3 + i * 1.15, sy - 0.55, 6.4, 0.8, 0.06, 1.1)          # M O T E L, dead
        for i in range(12): k.box('bulb', sx - 3.0 + i * 0.55, sy - 0.56, 9.3, 0.15, 0.06, 0.15)
        # THE PAWN SHOP: one storey, its grilles down, the yellow band, PAWN in red
        k.rgb('pawn', (186, 170, 140), 'clay_bone'); k.rgb('pawnband', (214, 178, 70), 'clay_mustard'); k.rgb('grille', (90, 92, 94), 'chrome')
        k.box('pawn', 48.0, 36.0, 0.0, 23.2, 23.2, 4.4); k.box('conc', 48.0, 36.0, 4.4, 23.6, 23.6, 0.3)
        k.box('pawnband', 48.0, 24.32, 3.0, 23.0, 0.08, 1.2)
        for i in range(4): k.box('signred', 41.0 + i * 3.2, 24.24, 3.15, 2.2, 0.06, 0.9)                    # P A W N
        k.box('glass', 48.0, 24.34, 0.6, 18.0, 0.05, 2.0)
        for i in range(24): k.box('grille', 39.4 + i * 0.75, 24.3, 0.5, 0.06, 0.06, 2.2)                      # its bars
        for i in range(2): k.box('hvac', 44.0 + i * 8, 38.0, 4.7, 2.2, 1.6, 1.0)
        k.rgb('fence', (130, 132, 132), 'chrome')
        for xx in (37.0, 59.0): k.box('fence', xx, 54.0, 0.0, 0.06, 11.0, 2.0)                               # the yard's chain-link
    if bid == 'fremont.11':
        # THE GARAGE: three decks stepping up north (rows 2, 1, 0 at one, two, three storeys), its parapets, its ramp up from the street
        k.rgb('deck', (176, 172, 162), 'tape_grey'); k.rgb('hz', (196, 158, 62), 'clay_mustard'); k.rgb('pillar', (150, 146, 138), 'tape_grey')
        for (r, z) in ((2, 3.0), (1, 6.0), (0, 9.0)):
            y0, y1 = 60.0 - (r + 1) * 12.0 + 0.4, 60.0 - r * 12.0 - 0.4 + (0.4 if r == 0 else 0.0)
            k.box('deck', 18.0, (y0 + y1) / 2, z - 0.4, 35.2, y1 - y0, 0.4)
            k.box('deck', 18.0, y0 + 0.15, z, 35.2, 0.3, 1.0); k.box('hz', 18.0, y0 + 0.0, z + 0.3, 35.2, 0.05, 0.3)   # its parapet, striped
            for xx in (3.0, 12.0, 24.0, 33.0):
                for yy in (y0 + 1.0, y1 - 1.0): k.box('pillar', xx, yy, 0.0, 0.6, 0.6, z - 0.4)
            k.rgb('lvl', (40, 40, 44), 'rubber'); k.box('lvl', 30.0, y0 - 0.04, z + 0.2, 2.2, 0.05, 0.6)                # P1, P2, P3
            k.rgb('stall', (214, 210, 196), 'tape_grey'); k.rgb('oil', (60, 58, 56), 'rubber')
            for xx in range(4, 34, 3): k.box('stall', float(xx), (y0 + y1) / 2 + 2.0, z, 0.12, 5.0, 0.02)       # the stalls' lines
            k.box('oil', 10.0 + r * 6.0, (y0 + y1) / 2 + 2.0, z, 1.6, 2.4, 0.015, 0.4)
        seg(k, 'deck', 5.5, 22.4, 0.0, 25.0, 3.0, 5.0)                      # the ramp up from Fremont East to the first deck
        k.rgb('cone', (190, 96, 50), 'clay_rust')
        for (cx, cy, cz) in ((10, 28, 3.0), (26, 40, 6.0), (16, 52, 9.0)): k.put('cyl6', 'cone', cx, cy, cz, 0.4, 0.4, 0.7)
        # THE CHAPEL: white, a red door, its steeple, the arch on the lawn, WEDDINGS 24 HRS
        k.rgb('chapel', (232, 228, 218), 'tape_grey'); k.rgb('chroof', (176, 70, 60), 'clay_rust'); k.rgb('chdoor', (150, 40, 36), 'clay_rust')
        cx, cy = centre(3, 1)
        k.box('chapel', cx, cy, 0.0, 9.0, 10.6, 3.4); k.roof('chroof', cx, cy, 3.4, 9.6, 11.2, 1.6, math.pi / 2)
        k.box('chapel', cx, cy - 4.4, 3.4, 2.2, 2.2, 3.6); k.roof('chroof', cx, cy - 4.4, 7.0, 2.6, 2.6, 1.8)   # the steeple
        k.box('chdoor', cx, cy - 5.34, 0.0, 1.6, 0.06, 2.4)
        ax, ay = centre(3, 2); k.rgb('arch', (226, 222, 210), 'tape_grey')
        for u in (-1.4, 1.4): k.cyl('arch', ax + u, ay, 0.0, 0.18, 2.6)
        k.box('arch', ax, ay, 2.6, 3.2, 0.2, 0.25)
        k.cyl('steel', ax + 4.0, ay - 4.0, 0.0, 0.2, 4.0); k.box('signboard' if False else 'chapel', ax + 4.0, ay - 4.1, 3.2, 3.0, 0.2, 1.4)
        k.rgb('chsign', (150, 40, 36), 'clay_rust'); k.box('chsign', ax + 4.0, ay - 4.22, 3.4, 2.6, 0.04, 0.4)
        k.model('downtown.deuce', 24.0, 18.0, 0)                            # the Deuce, burnt out on Fremont East (row 3, c1-c2)
    if bid in ('fremont.12', 'fremont.13'):
        # THE OLD CASINO FRONTS (row 0): four storeys, at street level, facing the mall and the camera
        if bid == 'fremont.12':
            runs = [(0.0, 21.0, (176, 150, 120), (206, 170, 90), (150, 54, 50)), (21.0, 38.0, (120, 56, 48), (226, 214, 186), (196, 170, 90)),
                    (38.0, 60.0, (70, 96, 104), (214, 178, 96), (190, 70, 52))]
        else:
            runs = [(0.0, 17.0, (196, 186, 164), (150, 54, 50), (70, 110, 118)), (17.0, 40.0, (196, 160, 80), (90, 60, 40), (226, 214, 186)),
                    (40.0, 60.0, (150, 120, 100), (214, 178, 96), (150, 54, 50))]
        for i, (x0, x1, w_, sg, ne) in enumerate(runs):
            nm = 'fw_%d' % i; k.rgb(nm, w_, 'clay_bone')
            front(k, x0 + 0.2, x1 - 0.2, 48.4, 59.6, 11.2, nm, sg, ne)
            k.rgb('marq', (44, 40, 42), 'rubber'); k.rgb('mbulb', (210, 190, 130), 'clay_mustard')
            mx = (x0 + x1) / 2; k.box('marq', mx, 46.4, 4.0, x1 - x0 - 3.0, 4.0, 0.7)                        # its marquee over the sidewalk
            for j in range(int((x1 - x0 - 3) // 0.8)): k.box('mbulb', x0 + 1.9 + j * 0.8, 44.36, 4.2, 0.2, 0.08, 0.2)
        if bid == 'fremont.12': vic_flat(k, 29.5, 48.2)                     # the cowboy on the middle front
        else:                                                               # the horseshoe on the gold front, every bulb dead
            k.rgb('shoe', (214, 178, 96), 'clay_mustard')
            for a in range(9):                                              # a U of nine pieces, open to the sky (for luck)
                t = math.pi + math.pi * a / 8.0; k.box('shoe', 28.5 + 2.6 * math.cos(t), 48.2, 7.6 + 2.6 * math.sin(t), 0.8, 0.2, 0.8)
        # THE CANOPY CAME DOWN: its columns still stand along both sides (some snapped), one bay of it still standing (COOK PROPS'),
        # its ribs and its screen fallen into the street (cover), one panel still lit where it lies (the horror)
        k.rgb('vault', (96, 98, 100), 'chrome'); k.rgb('panel', (34, 36, 40), 'glass_eye'); k.rgb('panelit', (238, 214, 150), 'sodium')
        for yy in (13.6, 46.4):
            for xx in (3.0, 15.0, 27.0, 39.0, 51.0): k.cyl('vault', xx, yy, 0.0, 0.7, k.rng.choice([6.0, 6.0, 4.2, 2.6]))
        k.model('downtown.canopy', 22.5 if bid == 'fremont.12' else 37.5, 30.0, 0)
        for r in range(5):
            for c in range(5):
                if piece_of(bid, c, r) != 'downtown_truss': continue
                x, y = centre(c, r); a0 = k.rng.uniform(-0.5, 0.5)            # a rib lying on its side: its curve, its lattice
                pts = [(x + 5.4 * math.cos(a0 + t), y + 3.2 * math.sin(a0 + t) - 1.0) for t in [math.pi * (q / 8.0 - 0.5) for q in range(9)]]
                for (xa, ya), (xb, yb) in zip(pts[:-1], pts[1:]):
                    k.line('vault', xa, ya, xb, yb, 0.35, 0.35, 0.2); k.line('vault', xa + 0.6, ya + 0.4, xb + 0.6, yb + 0.4, 0.25, 0.25, 0.9)
                for (xa, ya) in pts[1::2]: k.box('vault', xa + 0.3, ya + 0.2, 0.2, 0.2, 0.9, 0.9, a0)
                for q in range(4): k.box('panel', x + k.rng.uniform(-3, 3), y + k.rng.uniform(-3, 3), 0.1 * q, 2.4, 1.6, 0.1, k.rng.uniform(0, 3), k.rng.uniform(0, 0.5))
            if bid == 'fremont.12' and r == 3: k.box('panelit', 42.6, 17.8, 0.55, 2.4, 1.6, 0.1, 0.4, 0.2)   # the one still showing a picture
        k.rgb('chips', (150, 54, 50), 'clay_rust'); k.scatter('chips', 6, 54, 16, 44, 18, 0.08, 0.14, 0.3)
        k.rgb('litter', (196, 186, 160), 'tape_grey'); k.scatter('litter', 2, 58, 15, 45, 30, 0.15, 0.4, 0.2)
        # THE SOUTH SIDE'S SHOPS (row 4): one storey, their roofs walked, their awnings over the mall's sidewalk
        cuts = [0.0, 8.5, 19.0, 30.5, 41.5, 52.0, 60.0]
        rc = [(70, 68, 66), (150, 110, 80), (110, 70, 56), (176, 166, 146), (84, 92, 96), (132, 120, 104)]
        aw = [(150, 54, 50), (70, 110, 118), (214, 178, 96), (150, 54, 50), (226, 222, 210), (70, 110, 118)]
        for i in range(6):
            nm = 'shop_%d' % i; an = 'awn_%d' % i; k.rgb(nm, rc[i], 'clay_bone'); k.rgb(an, aw[i], 'clay_rust')
            k.box(nm, (cuts[i] + cuts[i + 1]) / 2, 6.0, 0.0, cuts[i + 1] - cuts[i] - 0.15, 11.2, 3.6)
            k.box(an, (cuts[i] + cuts[i + 1]) / 2, 12.6, 2.6, cuts[i + 1] - cuts[i] - 1.0, 2.0, 0.15, 0.0, -0.25)
            k.box('hvac', (cuts[i] + cuts[i + 1]) / 2 + k.rng.uniform(-1.5, 1.5), 5.0, 3.6, 1.8, 1.4, 0.8)
        if bid == 'fremont.13':                                             # the zipline's landing tower (row 1, c0) and the stage (row 2, c3)
            x, y = centre(0, 1); k.rgb('zip', (60, 62, 66), 'rubber')
            for (u, v) in ((-4, -4), (4, -4), (-4, 4), (4, 4)): k.cyl('zip', x + u, y + v, 0.0, 0.4, 6.0)
            k.box('zip', x, y, 6.0, 9.0, 9.0, 0.5); k.line('steel', x, y, 52.0, y + 1.0, 0.06, 0.06, 6.5); k.cyl('zip', 52.0, y + 1.0, 0.0, 0.5, 7.0)
            for i in range(6): k.box('zip', x - 4.5 + i * 0.6, y - 4.5, 0.3 + i * 0.95, 1.2, 1.2, 0.15)
            x, y = centre(3, 3); k.rgb('stage', (40, 38, 40), 'rubber')
            k.box('stage', x, y, 0.0, 10.0, 8.0, 1.5); k.box('steel', x, y + 3.8, 1.5, 10.0, 0.3, 4.0)
            for u in (-4.6, 4.6): k.box('stage', x + u, y + 3.2, 1.5, 1.2, 1.0, 2.2)                               # its dead speakers
    if bid in ('fremont.14', 'fremont.15'):
        # THE SOUTH SIDE'S BACKS (rows 0-1): their roofs walked roof to roof at their own storeys, their faces to the alley
        k.rgb('back', (132, 84, 64), 'clay_rust'); k.rgb('back_d', (104, 70, 56), 'clay_rust'); k.rgb('win', (40, 44, 48), 'glass_eye')
        k.rgb('rdoor', (150, 146, 136), 'chrome'); k.rgb('parapet', (96, 70, 58), 'clay_rust'); k.rgb('plank', (150, 124, 90), 'clay_bone')
        tars = [(214, 208, 196), (96, 92, 88), (156, 100, 70), (190, 176, 150), (120, 128, 126)]
        cols = range(5) if bid == 'fremont.14' else (3, 4)
        st = BACKS if bid == 'fremont.14' else [3, 3, 3, 2, 2]
        for c in cols:
            nm = 'back' if c % 2 else 'back_d'; x = c * 12.0 + 6.0; hb = st[c] * 3.0
            k.rgb('tar_%d' % c, tars[c], 'tape_grey')
            k.box(nm, x, 48.0, 0.0, 11.9, 23.2, hb); k.box('tar_%d' % c, x, 48.0, hb, 12.0, 23.4, 0.25)      # on its own two rows (0-1), the
            k.box('parapet', x, 36.7, hb, 11.9, 0.3, 0.7)                                                      # alley (row 2) open before it
            k.box('hvac', x + k.rng.uniform(-3, 3), 50.0 + k.rng.uniform(-6, 6), hb + 0.25, 2.0, 1.6, 0.9)
            k.rgb('skylt', (70, 84, 92), 'glass_eye'); k.rgb('tank', (120, 96, 72), 'clay_rust'); k.rgb('dish', (206, 204, 196), 'tape_grey')
            for q in range(3): k.box('skylt', x - 3.0 + q * 3.0, 43.0, hb + 0.25, 1.6, 2.4, 0.3)           # skylights, their glass gone grey
            if c in (0, 3): k.cyl('tank', x + 3.0, 52.0, hb + 0.25, 2.6, 2.4); k.roof('tank', x + 3.0, 52.0, hb + 2.65, 2.8, 2.8, 0.8)
            if c == 2: k.cyl('steel', x - 3.5, 54.0, hb + 0.25, 0.1, 1.2); k.box('dish', x - 3.5, 54.0, hb + 1.4, 1.4, 0.2, 1.4, 0.3, 0.6)
            k.rgb('junkr', (120, 104, 84), 'clay_bone')                     # roof junk, on the roof (the walked roofs)
            for q in range(5): k.box('junkr', x + k.rng.uniform(-5, 5), k.rng.uniform(39.0, 57.0), hb + 0.25, 0.9, 0.6, 0.5, k.rng.uniform(0, 3))
            if c not in (1, 3) or bid == 'fremont.15':
                for i in range(3): k.box('win', x - 3.6 + i * 3.6, 36.33, 2.0 + hb * 0.3, 1.4, 0.06, 1.6)
                k.box('rdoor', x, 36.32, 0.0, 4.2, 0.06, 3.2)
        if bid == 'fremont.14':
            for c in (1, 3): k.model('downtown.fire_escape', c * 12.0 + 6.0, 35.2, 0)   # the ways up from the alley
            for c in range(4):
                if BACKS[c] != BACKS[c + 1]: k.box('plank', (c + 1) * 12.0, 48.0 + k.rng.uniform(-8, 8), max(BACKS[c], BACKS[c + 1]) * 3.0 - 1.4, 2.6, 0.5, 0.08, 0.0, 0.55)
        else:
            # THE GARAGE ON OGDEN (c0-c2): its face of open levels to the alley, the decks at two and three storeys, its ramp from the alley
            k.rgb('deck', (176, 172, 162), 'tape_grey'); k.rgb('hz', (196, 158, 62), 'clay_mustard'); k.rgb('pillar', (150, 146, 138), 'tape_grey')
            k.rgb('stall', (214, 210, 196), 'tape_grey')
            for (z, y0, y1) in ((3.0, 36.4, 59.6), (6.0, 36.4, 59.6), (9.0, 48.4, 59.6)):
                k.box('deck', 18.0, (y0 + y1) / 2, z - 0.4, 35.2, y1 - y0, 0.4)
                k.box('deck', 18.0, y0 + 0.15, z, 35.2, 0.3, 1.0); k.box('hz', 18.0, y0, z + 0.3, 35.2, 0.05, 0.3)
            for xx in range(4, 34, 3): k.box('stall', float(xx), 54.0, 9.0, 0.12, 5.0, 0.02)                    # the top deck's stalls
            for xx in (1.0, 12.0, 24.0, 35.0):
                for yy in (37.0, 47.5, 59.0): k.box('pillar', xx, yy, 0.0, 0.6, 0.6, 5.6 if yy < 48 else 8.6)
            seg(k, 'deck', 30.0, 33.6, 0.0, 37.0, 3.0, 4.6)                 # the ramp in from the alley
            k.rgb('lvl', (40, 40, 44), 'rubber'); k.box('lvl', 10.0, 36.36, 1.0, 3.0, 0.05, 1.0)
        for xx in (6.0, 30.0, 54.0): streetlight(k, xx, 11.4, arms=(-1,))    # OGDEN's lights along its north kerb


# THE DEAD (rule 360 AMENDED, Paolo 11/3: 'keep the bodies lore friendly... if it's a busy civilized settlement or part of the town,
# obviously they don't have [corpses]... very simplified'): COOK DEAD's models (records/target/dead/manifest.json) set by hand where
# nobody is left to move them, about one a block (COOK DEAD's counts a board: downtown 11, the Strip 4), never on a road's lane, never
# on a marked piece's tile; graves only where somebody stayed (the chapel's yard). Scenery: no new rule, no interaction.
DEAD = {
    'blvd.1': [('dead.sidewalk', 5.0, 38.0, 0), ('dead.bench', 54.0, 18.0, 0)],
    'blvd.2': [('dead.tarp', 54.0, 20.0, 1)],
    'stripw.1': [('dead.bag_row', 30.0, 42.0, 0)],                          # the casinos were the morgues
    'stripw.2': [('dead.sidewalk', 54.0, 40.0, 0)],
    'stripe.1': [('dead.bag_row', 30.0, 54.0, 0)],
    'fremont.10': [('dead.tarp', 30.0, 6.0, 0)],
    'fremont.11': [('dead.grave_cross', 40.0, 54.0, 0), ('dead.grave_cross', 44.5, 55.0, 0)],   # the chapel's yard: somebody stayed
    'fremont.12': [('dead.doorway', 8.0, 50.6, 0), ('dead.sidewalk', 6.0, 40.0, 1)],
    'fremont.13': [('dead.tarp', 18.0, 28.0, 0)],
    'fremont.14': [('dead.cart', 30.0, 29.0, 0)],
    'fremont.15': [('dead.sidewalk', 30.0, 16.0, 0)],
    'lab.1': [('dead.tarp', 30.0, 30.6, 0), ('dead.sidewalk', 18.0, 6.0, 1)],    # the staff who stayed with the animals
    'lab.2': [('dead.bag_row', 42.0, 54.0, 0)],                             # bagged on the dock for a truck that never came
    'lab.3': [('dead.tarp', 30.0, 30.0, 1)],
}


def place_dead(k, bid):
    for (mid, x, y, q) in DEAD.get(bid, []): k.model(mid, x, y, q)


class DryKit(Kit):
    """the things of one block without Blender: what stands where, for the edge leg (rule 356(c),(f))"""
    def rgb(self, name, c, role='clay_bone', alpha=None): self.M.setdefault(name, None); return name
    def mat(self, name, role, step, mul=1.0): self.M.setdefault(name, None); return name


def edge_clips(bid, tol=0.15):
    """every thing of a block that reaches past its picture's edge (the picture stops there, so the thing is cut: rule 356(c)
    'no asset cut at a cell edge'): boxes, cylinders, tubes, gables by their turned footprint, COOK PROPS' models by the
    manifest's size and their quarter turn, rocks by their size"""
    NB, EG, NF, F = rig()
    k = DryKit(None, NF, F, np.zeros((8, 8), np.uint8), np.zeros((8, 8), np.float32), 1)
    THINGS[bid.split('.')[0]](k, bid); place_dead(k, bid)
    size = {k_: m['size_m'] for k_, m in props().items()}
    out = []
    def check(what, x, y, ex, ey):
        if x - ex < -tol or x + ex > 60.0 + tol or y - ey < -tol or y + ey > 60.0 + tol:
            out.append('%s at (%.1f, %.1f) reaches %.1f-%.1f, %.1f-%.1f' % (what, x, y, x - ex, x + ex, y - ey, y + ey))
    for (tpl, m), items in k.items.items():
        for (x, y, z, sx, sy, sz, rz, tilt) in items:
            if abs(tilt) > 0.5: sy = max(sy, sz)                          # lying on its side: its height is now its depth
            c, s_ = abs(math.cos(rz)), abs(math.sin(rz))
            check('%s %s' % (tpl, m), x, y, (sx * c + sy * s_) / 2, (sx * s_ + sy * c) / 2)
    for (mid, x, y, q, z) in k.models:
        sx, sy = size[mid][0], size[mid][1]
        if q % 2: sx, sy = sy, sx
        check('model ' + mid, x, y, sx / 2, sy / 2)
    for (m, flat), (pts, sizes, zs) in k.rocks.items():
        for (x, y), s_ in zip(pts, sizes): check('rock ' + m, x, y, s_ / 2, s_ / 2)
    return out


THINGS = {'lab': things_lab, 'apron': things_apron, 'golf': things_golf, 'trailer': things_trailer, 'desert': things_desert,
          'canyon': things_canyon, 'pass': things_pass, 'lakebed': things_lakebed, 'wash': things_wash, 'dump': things_dump,
          'yards': things_yards, 'fremont': things_fremont, 'rail': things_rail, 'basin': things_basin,
          'blvd': things_blvd, 'stripw': things_strip_front, 'stripe': things_strip_front}


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
        THINGS[bid.split('.')[0]](k, bid); place_dead(k, bid)
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


def data(hold=()):
    """each place's blocks into fight_ground.json (one named board a place, its blocks in its default layout, so the fight's
    block library holds them), the pieces into cover_extra (baked: no sprite), the roofs into ours.roof_storeys, and the
    places themselves into ours.place_boards (the fight deals from it, the gate measures it)"""
    p = os.path.join(SHIP, 'fight_ground.json'); G = json.load(open(p))
    have = set(built_blocks())
    for k, d in PIECES.items():
        G['cover_extra'][k] = dict(d, baked=True, by='tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py')
    span = TM * BT
    for pid, P in PLACES.items():
        if not P.get('built') or pid in hold: continue                  # a held place keeps its board as on main (its pictures not rendered yet)
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
    for b in GONE: G['blocks'].pop(b, None)                                  # rule 346: the old Strip and downtown, graveyarded
    G.setdefault('made_11_3', {})['combat_maps_3'] = dict(tool='tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py',
        names={b: v['name'] for b, v in BLOCKS.items()}, futures='the fight reads no futures picture; only the present is rendered')
    json.dump(G, open(p, 'w'), indent=1)
    O = json.load(open(OURS))
    rs = O['roof_storeys']['value']
    for bid, spec in BLOCKS.items():
        if spec.get('roofs'): rs['blocks'][bid] = [list(q) for q in spec['roofs']]
    for b in GONE: rs['blocks'].pop(b, None)
    for k in ('apron', 'golf'):
        if k not in rs['roof_kinds']: rs['roof_kinds'].append(k)
    rs.setdefault('not_roofs', {})['apron.0'] = [[3, 3]]                     # the air-stairs truck's platform is no roof
    rs['not_roofs']['golf.0'] = [[4, 1]]                                     # the tee box is a rise of ground
    places, was = {}, ((O.get('place_boards') or {}).get('value') or {}).get('places') or {}
    for pid, P in PLACES.items():
        if pid in hold and pid in was: places[pid] = was[pid]; continue
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
    'trailer': ('The trailer park is its own board now, single-wides end to end on their blocks with one burnt out, propane tanks, a '
                'carport and the washing on the line, and the lanes between them are one man wide, so it is close fighting and they are often already in among the rows.'),
    'desert': ('The desert is its own board now, open dark desert pavement cut by a dry wash with a power pylon fallen across it, '
               'Joshua trees, boulders and a car half buried, and the wash is soft and slow while its banks are a step up.'),
    'redrock': ('Red Rock is its own board now, a sandstone fin split by a slot canyon one man wide with ledges one, two and three '
                'storeys up on both sides, so height wins the shot and the climb costs your attack.'),
    'pass': ('The pass is its own board now, a mountain road with a jackknifed semi across it, a rockfall you climb over the other '
             'lane, scree and ledges above and the drop below that nobody walks, and they often come at you from above and below the road.'),
    'shore': ('The shore is its own board now, the lake\'s intake tower standing on the dry bed with docks and boats left on the mud, '
              'and the mud is slow and you fight worse in it, so the one gravel bar and the white bathtub ring\'s step are what you hold.'),
    'wash': ('The wash is its own board now, a concrete flood channel between two high banks running between the lines with a twin '
             'culvert under the road, a sofa and the flood\'s junk in the silt, and the culvert is the one covered way through.'),
    'landfill': ('The landfill is its own board now, trash mounds you climb for the shot, the gas flare still burning on its pad with '
                 'the ground round it on fire from the first round, a dozer stopped mid-push and the gas wells for cover.'),
    'suburb': ('The suburbs are their own board now and dead brown, a row of backyards with the block walls you fight along and over, '
               'empty pools that are pits to cross, a swing set and a trampoline frame between the ranch houses.'),
    'strip': ('The Strip is its own board now, an open marble casino plaza with a dry fountain whose rim is the cover, a giant arrow '
              'sign fallen on it, a stretch limo at the valet and the pedestrian bridge two storeys over the Boulevard.'),
    'downtown': ('Downtown is its own board now, a bay of the Fremont canopy over the street with the burnt double-decker under it, '
                 'and brick hotel backs with fire escapes to their roofs and alleys between them one man wide.'),
    'works': ('The works is its own board now, a boxcar and a black tank car on the spur making a wall across the yard with one '
              'crossing, a gantry crane with a car hanging off its hook, the shop\'s machines and stacked pipe for cover.'),
    'marina': ('The marina is its own board now, the dry marina bed open on all sides with a houseboat sat on its pontoons, '
               'cabin cruisers on their keels and bass boats on their trailers as the only cover, the houseboat\'s deck the one height.'),
}


def cards(ids=None):
    """one card a place: BEFORE (the board on main: rule 341's own first picture once it has one, else COMBAT MAPS 2's after
    shot) | AFTER (the opening view) | IN PLAY"""
    from PIL import ImageDraw, ImageFont
    L = json.load(open(os.path.join(BASE, 'shots', 'shots.json')))
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
    except Exception: font = ImageFont.load_default()
    out = {}
    for pid, m in L.items():
        if ids and pid not in ids: continue
        b346 = os.path.join(BASE, 'before346_%s.webp' % pid)
        if os.path.exists(b346): before = Image.open(b346).convert('RGB')
        else:
            old = Image.open(os.path.join(R, 'records/target/combat_maps_11_2c/ground_%s.webp' % m['district'])).convert('RGB')
            before = old.crop((old.width - 390, old.height - 844, old.width, old.height))
        after = Image.open(os.path.join(R, m['after'])).convert('RGB'); play = Image.open(os.path.join(R, m['play'])).convert('RGB')
        C = Image.new('RGB', (390 * 3 + 16, 844 + 40), (14, 13, 12)); d = ImageDraw.Draw(C)
        for i, (im, t) in enumerate(((before, 'BEFORE (on main)'), (after, 'AFTER: ITS OWN BOARD'), (play, 'IN PLAY, ROUND %d' % m['round']))):
            if i == 1 and os.path.exists(b346): t = 'AFTER: ' + TITLE_346C[pid] if pid in TITLE_346C else 'AFTER: REBUILT' if pid in REBUILT_346 else 'AFTER: NO SEAMS'
            C.paste(im, (i * 398, 40)); d.text((i * 398 + 8, 11), t, fill=(236, 226, 196), font=font)
        fn = os.path.join(BASE, 'card_%s.webp' % pid); C.save(fn, quality=82, method=6); out[pid] = os.path.relpath(fn, R)
        print('  card', pid, os.path.getsize(fn) // 1024, 'KB')
    return out


def first_of(pid):
    """the card's FIRST picture (the VOTE tab's rule 89: one thing, one phone screen): the AFTER panel of its card"""
    fn = os.path.join(BASE, 'first_%s.webp' % pid)
    Image.open(os.path.join(BASE, 'card_%s.webp' % pid)).convert('RGB').crop((398, 40, 788, 884)).save(fn, quality=82, method=6)
    return '../' + os.path.relpath(fn, R)


REBUILT_346 = ('strip', 'downtown')
SAID_346C = {'downtown': 'Hell nah that shit does not look right', 'strip': 'More work more love', 'lab': 'More work more love'}
TITLE_346C = {'downtown': 'RETHOUGHT', 'strip': 'MORE LOVE', 'lab': 'MORE LOVE'}
SAID_346 = {'strip': 'The worststtt this needs to be THE BESTTTT Work in progress keep going',
            'downtown': 'Looks like shit Work in progress keep going'}
EVERY_GROUND_346 = ('Needs way more work watch out for atraight lines at grid borders and colors that end abruptly and roads that dont '
                    'connect and things that dont visually and logically make sense')
CARD_SAYS_346 = {
    'strip': ('The Strip has more love: the Boulevard, its bridge and Welcome sign, gold and pink towers, and its tourists who never '
              'left, body bags in rows on the forecourts that became morgues, a body on a bench, luggage dropped along the sidewalks.'),
    'downtown': ('Downtown is rethought from the real one: Fremont East with its motel, garage and chapel, the old casino fronts with '
                 'the canopy fallen into the mall, the south side walked roof to roof, and its dead in the doorways nobody cleared.'),
    'airport': ('The airport is warm desert-dusted slab now, not a grey card, with a third block of stands (a fuel truck, a baggage '
                'train), and its taxi line runs whole across the board.'),
    'shore': ('The shore is Lake Mead\'s tan cracked bed now, not grey, and its gravel bars are soft shapes that meet bar to bar '
              'across every block, so the firm way through the mud never ends at a line.'),
    'pass': ('The pass is buff rock with iron red in it now, not grey, and each road runs whole across the board with its verges '
             'off the grid lines.'),
    'trailer': ('The trailer park\'s lane runs whole through every block now, the office lot sits inside its block with a drive to the '
                'lane, and the mailboxes stand on the verge, not in the road.'),
    'works': ('The works\' rail spur runs at the same row in every block now, so the tracks run on across the yard, and the old town '
              'block whose streets met nothing is gone.'),
    'landfill': ('The landfill\'s haul road runs whole across the board now, the scorch and the gas wells are soft shapes, not squares, '
                 'and no mound is cut at a picture\'s edge.'),
    'golf': ('The golf course\'s cart path runs whole across every block now, past the clubhouse patio, and the old block that did not '
             'match is gone.'),
    'marina': ('The marina is Lake Mead\'s tan dry bed now, the same at every edge, its houseboat moored to a dock on the dry bed, and '
               'the old town block whose streets met nothing is gone.'),
    'redrock': ('Red Rock\'s slickrock sheets are soft shapes now, never along the grid\'s lines, and its ledges sit whole inside their '
                'blocks.'),
    'suburb': ('The suburb is rows of houses now, their roofs walked, their walled yards and empty pools behind them and a street below '
               'each row that runs whole, in place of the old street blocks whose roads met nothing.'),
    'wash': ('The wash\'s silt floor lies a metre in from the channel\'s slopes now, so no line runs on the grid, and its gravel and '
             'stains stay off the block edges.'),
    'desert': ('The desert already held at its seams, and now its one boulder cut at a picture\'s edge sits whole inside it too.'),
    'lab': ('The lab yard has more love: a biohazard placard on every pen, quarantine tape torn across the lanes, and the staff who '
            'stayed with the animals, bagged on the dock for a truck that never came and under tarps in the aisles.'),
}


def register(sha, ids, tag=None):
    rp = os.path.join(R, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
    L = json.load(open(os.path.join(BASE, 'shots', 'shots.json')))
    said = ('everything just looked exactly the same as the main suburb shit we have and then you gave a bunch of greenery to the '
            'suburb, bro this is an economic apocalypse, nothing made them uniquely unique, nothing made them fun to do, no variety, '
            'like true variety... you\'re not done')
    new = []
    for pid in ids:
        P = PLACES[pid]
        if tag == '346c':                                                    # a redo of a 346 card he has voted on
            new.append(dict(id='combat-place-%s-11-3c' % pid, kind='redo', redoOf='combat-place-%s-11-3b' % pid, lane='combat', sha=sha,
                            made='11/3', draft=True, title='%s: %s' % (P['name'], TITLE_346C[pid]), said=SAID_346C[pid],
                            why=CARD_SAYS_346[pid] + ' You see it in every fight there on the map.',
                            options=['A, yes, that is the place and it plays different', 'B, better, push it further', 'C, no, still wrong'],
                            show=dict(how='image', src='../records/target/combat_maps_11_3/card_%s.webp' % pid,
                                      first=first_of(pid), firstAt=[398, 40, 390, 844]),
                            before_after=dict(before='the board as his last card had it (rule 346 push 1)',
                                              after='downtown rethought from the real one, roads first' if pid == 'downtown' else 'more love: the dead where nobody moved them',
                                              scale='his phone, 390 x 844, by day, the fight\'s opening view and a few rounds in')))
            continue
        if tag == '346':
            new.append(dict(id='combat-place-%s-11-3b' % pid, kind='redo', redoOf='combat-place-%s-11-3' % pid, lane='combat', sha=sha,
                            made='11/3', draft=True, title='%s: %s' % (P['name'], 'REBUILT' if pid in REBUILT_346 else 'NO SEAMS'),
                            said=SAID_346.get(pid, EVERY_GROUND_346),
                            why=CARD_SAYS_346[pid] + ' You see it in every fight there on the map.',
                            options=['A, yes, that is the place and nothing breaks the picture', 'B, better, push it further',
                                     'C, no, still wrong'],
                            show=dict(how='image', src='../records/target/combat_maps_11_3/card_%s.webp' % pid,
                                      first=first_of(pid), firstAt=[398, 40, 390, 844]),
                            before_after=dict(before='the board on main (rule 341, its own board)',
                                              after='rule 346: ' + ('rebuilt' if pid in REBUILT_346 else 'no seam, no cut-off, every road met'),
                                              scale='his phone, 390 x 844, by day, the fight\'s opening view and a few rounds in')))
            continue
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
    if a[0] == '--data': data(tuple(a[a.index('--hold') + 1].split(',')) if '--hold' in a else ())
    elif a[0] == '--cards': cards(a[1:] or None)
    elif a[0] == '--clips': print(json.dumps({b: (edge_clips(b) if b in BLOCKS else ['not this tool\'s block']) for b in (a[1:] or list(BLOCKS))}))
    elif a[0] == '--register': register(a[1], [x for x in a[2:] if not x.startswith('--')], '346c' if '--346c' in a else '346' if '--346' in a else None)
    elif a[0] == '--swap':
        for b in a[1:]: swap(b)
    elif a[0] == '--render':
        render(a[1], '--quick' in a)
    sys.stdout.flush(); os._exit(0)
