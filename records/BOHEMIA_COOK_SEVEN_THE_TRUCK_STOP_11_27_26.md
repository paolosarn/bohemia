# COOK SEVEN: THE TRUCK STOP, FINISHED, ITS STORE, ITS BAY AND ITS STEEL ROOF (11/27/26)

COMBAT FOUR's BUILD 11/21ze asked 'FOR COOK (SIX)'; VAMILY rule 480(b) (finished art where a stand-in still stands: the second of the 27 insides
COMBAT FOUR added since 11/21 with every piece a stand-in, the one he meets next most after the swap meet: the truck stop is a map kind of its own
on the freeway and seven fights in ten there go inside); rule 482 (more cooking, improving what we have); rules 461, 441, 416, 451(a), 479(b).
COOK SEVEN takes over from COOK SIX (its plan, its handoff, its tools). BUILD 11/27zd - THE TRUCK STOP.

## WHAT THIS IS
COMBAT FOUR's truck stop: its travel store or its service bay. Every one of its 20 pieces was a stand-in (the casino's screens, cage, seats and
bar, the tunnels' camp and jam, the street board's bales, heaps, wreck, container, dozer and rubble, the garage's booth and walls) on the mall's
floor, and its roof was drawn by the page. They are in the folder now under its names, and the truck stop lays them with no code changed:
- THE FLOOR (truckstop_floor_0.webp): rows 0 to 2 are THE STORE'S GRITTY TILE (floor.floor and floor.ring): 60 cm porcelain, the grout dark,
  every square its own shade, dirt tracked in from the lot in paths, soda dried in blots, a tile cracked corner to corner, one gone to its
  mortar bed, a pallet jack's two wheels dragged. Rows 3 and 4 are THE BAY'S OIL-STAINED CONCRETE (floor.bay): the garage deck's ground laid
  dark, years of oil where rigs stood, drip trails, the wheel paths east to west through the doors, a drain's grate, kitty litter over a spill.
- THE PIECES (truckstop_art.json's kit, COMBAT FOUR's 20 names). THE STORE: THE COOLERS (ts_cooler: a tile of walk-in cooler doors, fifteen on
  a 0.8 m pitch, dark glass, wire shelves seen through with a few bottles left, three doors standing open, two smashed to their frames and the
  glass on the floor; the walk-in's insulated top behind, its seams, condensers, refrigerant lines, cases stored up there, dust; a tile long so
  a run of C is one run). SHELVING (ts_shelving: three double-sided gondola runs, the pegboard backs, uprights every 1.2 m, five shelves a side
  with their price strips, a few things left, overstock on top, a shelf down in an aisle; a tile long). AN END CAP (ts_endcap: the end caps on
  the gondolas' three lines at both edges of the tile, lined up with the shelving's runs, low and stripped; a dump bin tipped, quarts of oil
  spilled, a sale sign on its back). PULLED-DOWN CASES (ts_stock). A JERKY STAND (ts_jerky: two jerky barrels, a bag left on a peg, a
  spinner rack bare, the lottery case with its scratchers' rolls, a display knocked on its face, the scratchers in a trail, THE LOTTERY
  TERMINAL'S SCREEN STILL LIT). EMPTY PALLETS (ts_pallets: stacks and throws, a pallet jack with its handle up). STACKED WATER (ts_water:
  three pallets, one still in its torn wrap, one half taken, the empties crushed round them). DELI BOOTHS (ts_booths: three, red vinyl, one
  slashed to the foam). THE HOT FOOD CASE (ts_hotcase: the roller grill's bare rollers, the pizza warmer, the heated case with its glass out,
  the menu board dark). THE COFFEE ISLAND (ts_island: the brewers, the fountain tower, the cups' shelf over it, lids in a drift). THE COUNTER
  (ts_counter: 11 m with its ends finished, so KK leaves a way through; four registers, EVERY DRAWER OPEN AND EMPTY; the card readers; a glass
  case; the cigarette wall behind, its slots bare). THE BAY: A TRACTOR'S CAB (ts_cab: nose to the camera, uncoupled, its tilt hood swung
  forward and down, the engine open, the turbo's hose off, a pane starred, the stacks, the tanks, the fifth wheel, the drive axles; one
  picture serves the cab west of its trailers and the cab east of them). A TRAILER (ts_trailer: a 40-foot dry van on its landing legs with
  both its ends, so TT is two trailers nose to tail; its name painted out, rust down from the rivets). A LIFT, RAISED (ts_lift: a drive-on
  four-post lift at 1.8 m, A PICKUP ON IT WITH ALL FOUR WHEELS GONE, THE LUG NUTS IN ITS HUBCAP ON THE FLOOR). STACKED TIRES (ts_tires). A TOOL
  CHEST (ts_toolchest: a red roll cab and its top chest, drawers pulled and empty, a blue one shut beside it, the workbench and its vise
  behind, a creeper, a floor jack). OIL DRUMS (ts_drums: two spill pallets, one drum on its side and its oil pooled, a hand pump). THE
  COMPRESSOR (ts_compressor: the shop compressor on its tank, a tire changer, a wheel balancer, the parts washer with its lid up). THE
  BUILDING'S WALL (ts_wall_ew, _ns: painted block to 3 m over a dark wainscot, the travel center's stripe, a cap, an empty extinguisher box,
  stains, a block knocked out).
- THE ROOF (truckstop_ceiling.webp, rule 451(a), over the fight at his 10%; one picture for both rooms, the data names its kind 'joist'):
  five bays by five that repeat: the metal deck and its ribs, a girder on every bay's line, open-web joists every 2 m with their webs
  zigzagging between the chords, the sprinkler main, a dead high-bay lamp and a skylight in every bay, rust, holes through to the sky.
  truckstop.json's ceiling entry: "have": true, "tile": [10, 10] (the one agreed edit in COMBAT FOUR's file).

## FOUND ON THE WAY (each fixed before the cut)
1. THE PLAN'S FINE LINES NEVER REACH THE RENDER. A grout line drawn in the plan is one pixel; the ground's mesh takes a vertex every two
   pixels (to_grid, nearest), so the 60 cm grout and the squares' shades rendered as nothing (and the distance test itself aliased: 16 of 20
   grout rows at 0.033 m a pixel). The tunnels' own 4 m joints DID show, because a ground's joints are drawn by its shader at any size. So
   the store's tile is its own ground now, ts_tile: the tunnels' calibrated grey with the shader's joints every 0.6 m and every square its
   own shade (panel_var), on the tunnels' floor's measured multiplier (the same role and target; the convention hall's way, no calibration
   render). The police station's vinyl and the bank's marble take the same way (pd_vct, bk_slab). TS.joints() (one pixel where the square
   changes) stays for anything a plan must draw at a pitch.
2. HIS 'COVER YOU COULD NOT SEE' (COMBAT FOUR 11/22: a stand-in under 9% of a tile reads as bare floor): measured every piece's painted share
   of its tile; the jerky stand, the water, the pallets, the tool chest, the drums and the compressor were 4.6 to 8.5%: each made a fuller
   cluster (8.6 to 10.5% now, the coolers 102%, the shelving 79%, the counter 44%, the trailer 63%). COOK SIX's swap meet's small pieces are
   2.3 to 3.9% (named for the next pass, not changed here).
3. The walk-in's top first rendered as the palest thing on the board (a white slab 7.6 m deep): darker now, its seams, refrigerant lines,
   stored cases and dust; the skylights first sat inside the roof's deck and never drew (raised over it).

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'truckstop'; its close spots keyed 'inside:layout', since the bay shares
'the_service_bay' with the powerhouse):
- BEFORE (main a32d636c7): the_travel_store upright: THE TRUCK STOP, 192 pieces, 192 of them stand-ins, the roof drawn by the page ('joist'),
  0 page errors; the_service_bay 160, 160 stand-ins.
- NOW: the_travel_store 192 pieces, 0 stand-ins, the roof's picture drawn, 0 page errors, upright and on its side; the_service_bay 160 pieces,
  0 stand-ins, both ways, 0 page errors. Every picture the page asked for was there (no truckstop file lost).
Gate THE INSIDES WEAR FINISHED ART 126/0 with eighteen kits (A3 floor worst 5.1 against 7.2, bay 3.8 against 6.2; A4 the coolers, shelving and
end caps a tile long; A5 617,920 bytes of 900,000; the roof C2 1.1 over itself against 8.0, C3 134 steps, 34% lines, C4 32,420 bytes).

## FOR COMBAT FIVE (COMBAT FOUR's files; nothing of yours edited but the ceiling entry's two words)
THE BAY WEARS THE STORE'S TILE until the_service_bay names a floor area: one rectangle, 'floor_areas': { "the_service_bay": [{ "kind": "bay",
"x": [0, 19], "y": [0, 14] }] } in the template, and floor.bay (the oil-stained concrete, rows 3 and 4 of the sheet) is laid with no other
change (the school's and the courthouse's way, 11/22).

## REFERENCE CHECK (compared to the world before calling it done)
The travel centers on I-15 north and south of the valley (the big plazas at Apex, Jean and Primm): 60 cm porcelain, walk-in cooler doors along
the back wall, double gondola runs with end caps, a roller grill and pizza warmer by the counter, a coffee island with a fountain tower, a
deli's booths, a long counter with the cigarette wall behind; the truck service bays behind them (drive-through, tilt hoods up, drive-on
four-post lifts, roll cabs, drums on spill pallets, tire racks, a horizontal compressor). The twins: COOK SIX's swap meet and school kits
(the same rig and cut).

[analog horror: the lottery screen still lit in a store with no power anywhere else; every register drawer open; a pickup on the lift with all
four wheels taken and the lug nuts left in its hubcap]
[bb Battle Brothers' palisade: a run of shelving is a wall with ends, and the end caps are the way round; its boulders: the rigs nobody sees past]

## THE TOOLS
tools/bohemia_cook7_the_truck_stop_finished_11_27_26.py   render ts_floor | ts_pieces | ts_bay | ceil_truckstop; cut; sheet; plan (ON the swap
meet tool). Blender: python3.11 -m venv /tmp/v && /tmp/v/bin/pip install bpy==4.2.0 numpy pillow scipy (as COOK FIVE's).
tools/bohemia_cook6_the_insides_hold_their_frames_11_26_26.js takes swapmeet, truckstop, police, bank now.

## NOT DONE, SAID PLAINLY
1. The bay wears the store's tile until COMBAT FIVE names its floor area (above). The map rarely deals the bay (COMBAT FOUR: one cell, store
   or lot, on its valleys).
2. No night versions; the frame walk on the slowed phone for this inside (with its art and with its stand-ins: the art costs nothing) is in
   records/BOHEMIA_COOK_SEVEN_THE_BANK_11_27_26.md.
3. Adding three grounds puts the rig's calibration board past its 25 squares (the calibrate scene would leave them out): they carry their
   twins' measured multipliers, as the convention hall's slab did.

VOTE: cook7-the-truck-stop-11-27 (MADE FROM arena2-the-pit-is-a-pit-11-7).
