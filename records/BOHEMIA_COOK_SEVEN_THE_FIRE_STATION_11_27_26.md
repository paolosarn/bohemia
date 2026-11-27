# COOK SEVEN: THE FIRE STATION, FINISHED, ITS APPARATUS BAY, ITS QUARTERS AND ITS ROOF; AND THE FIRST KIT BUILT RULE 495'S WAY (11/27/26)

COMBAT FOUR's fire station asked 'FOR COOK (SIX)'; VAMILY rule 480(b) (the sixth of the 27 insides COMBAT FOUR added since 11/21 with every
piece a stand-in, and the first of the trigger's order: the fire station, the neon boneyard, then the others); rule 480(c) (none costing
frames, measured below); rule 482; rule 495 (one thing, one place); rules 461, 441, 416, 451(a). BUILD 11/27zz - THE FIRE STATION.

## WHAT THIS IS
COMBAT FOUR's fire station: its apparatus bay or its quarters. Every one of its 14 pieces was a stand-in (the street board's container, bales,
drums, barrier and tyres, the casino's screens, bar and seats, the tunnels' camp and jam) on the mall's floor, and its roof was drawn by the
page. They are in the folder now under its names, and the station lays them with no code changed:
- THE FLOOR (firehouse_floor_0.webp). floor.floor and floor.ring: THE BAY'S SEALED CONCRETE (the hall's calibrated slab), a trench drain's grate
  in every tile's middle, the wheel paths, oil where engines stood for years and its drips, wash water's tide marks, a squeegee's arcs. Rows 3
  and 4, floor.quarters: THE QUARTERS' VINYL (the police station's 30 cm squares), laid the day the_quarters names a floor area of kind
  'quarters'; until then the quarters wear the bay's concrete.
- THE PIECES (firehouse_art.json's kit, COMBAT FOUR's 14 names): A FIRE ENGINE (fh_engine: two pumpers on flat tires side by side in their
  bays, east to west, nose west; the cab and its glass, the roll-up compartment doors with one up and the compartment empty, the pump panel's
  gauges, the hose bed with the hose still in it, a ladder racked on top, the light bar dead; so a block of E is a yard of engines). TURNOUT GEAR
  (fh_gearwall: three double runs of open steel gear racks a tile long, A COAT AND TROUSERS STILL ON EVERY HOOK, a helmet over each, boots
  below). HOSE LAID OUT (fh_hose: six lines laid flat to dry and never rolled, brass couplings, a nozzle, two donuts nobody racked; floor dress).
  AIR BOTTLES (fh_bottles: three racks of twelve, the cascade fill station, a bottle cart, bottles and air packs dropped). A RESCUE TOOL CABINET
  (fh_toolbox: two red cabinets with drawers out, the spreader and the cutter and the power unit on the floor, a stokes basket, a backboard, a
  crib of wooden blocks). CONES AND FLARES (fh_cones: stacks spilled, two sawhorse barricades, a traffic drum rolled, flares out of their box, a
  sign on its stand). A WORKBENCH (fh_bench: its vise, the pegboard with the outlines of tools that are gone, a grinder, a parts shelf, the
  compressor, a second bench). THE BUNKS (fh_bunks: two rows of three steel beds, one stripped, its mattress on the floor, a locker at each head).
  THE KITCHEN (fh_kitchen: a tile of counters and a galley behind, the commercial range with its pots still on it, the hood, the fridge
  standing open, the sink). THE KITCHEN TABLE (fh_table: the long table on its side for cover, the second standing with the plates still on it,
  its bench, chairs thrown). THE DAY ROOM (fh_couches: three couches and three recliners on a rug, one on its back, the TV face down). THE
  CREW'S LOCKERS (fh_lockers: two red rows a tile long, five doors hanging, a name on one, the bench). THE STATION'S WALL (fh_wall_ew, _ns: block
  painted red to a metre, a white line, cream over it, scuffs where the engines backed in close).
- THE CEILING (firehouse_ceiling.webp, rule 451(a), 'joist'): the truck stop's steel roof (the deck, the girders, the open-web joists, a skylight
  and a dead lamp in every bay) and over every bay the exhaust hoses hanging dead from their rail. firehouse.json's ceiling entry: "have": true,
  "tile": [10, 10] (the one agreed edit in COMBAT FOUR's file).

## RULE 495, PULLED (b093bf91b, before this kit)
The four kits before it (truck stop, police station, bank, library) each carried their own copy of the same ~180 lines: the cut, the sizes and
art files, the ceiling's hand-off, the share print, the VOTE sheet. They live once now, in tools/bohemia_cook7_inside_kit.py; each tool says
only what is its own in one KIT.make(...). Proved by re-cutting all four from the folded tools: every shipped file byte-identical. The fire
station is the first kit written on it: its tool is its ground, its pieces, its boxes and its words, nothing else.

## FOUND ON THE WAY
1. A trench drain through every tile at the same place (so the drains would run on) drew a dark line through the middle of every house tile:
   a half-tile grid line on his board. It is a short grate in each tile's middle now, touching no edge.
2. The first oil stains were soft cones that read as nothing at his pixels: flat-topped pools with their drips now.
3. HIS 'COVER YOU COULD NOT SEE': seven pieces were small clusters at the first render (the bottles, the cabinet, the cones, the bench, the
   bunks, the table, the day room). Each was made a fuller cluster before the cut: 10.2% (the cones) to 30.3% (the bunks) of the tile, the
   engines 88%, the gear 79%. One 12 m house holds two engines side by side, as a drive-through bay does.

## WHAT IT COSTS IN FRAMES (rule 480(c); tools/bohemia_cook6_the_insides_hold_their_frames_11_26_26.js, the real fight page, 390 x 844, the
## CPU slowed four times; the same tree with the art file moved aside, so the board falls back to its stand-ins; two runs with the art)
                 LOAD fps (now / stand-ins)     OPEN fps             PAN fps            AUTO fps
  fire station   27.1, 25.0 / 27.1              9.5, 8.9 / 11.5      2.9, 2.8 / 3.1     37.8, 33.4 / 33.1
  library        19.7, 18.6 / 25.5, 23.6        11.3, 9.5 / 9.6, 8.2 3.1, 2.8 / 2.9, 3.0 36.4, 26.9 / 29.0, 35.2
The fire station's pictures cost nothing: every phase inside the run-to-run noise. SAID PLAINLY: the library's LOADING SCREEN runs about 5
frames a second slower with its pictures than with its stand-ins (its worst frame the same, 2.0 to 2.4 s either way, the loading screen's own);
that is where its pictures are decoded, before they are needed, as 480(c) asks. The board itself, from its first frame, is the same or better.
Both opened AT NIGHT and the night board is the slideshow (PAN about 3 fps), the fight page's night path as measured for the bank, not the
pictures. *** FOR PLUMBER 8 AND COMBAT FIVE (rule 480(c), (d)): the numbers above; nothing of yours edited here.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'firehouse', spots for both rooms):
- BEFORE (main): the_apparatus_bay upright: THE FIRE STATION, 172 pieces, 172 of them stand-ins, the ceiling drawn by the page ('joist'), 0
  page errors; the_quarters 164, 164 stand-ins.
- NOW: the_apparatus_bay 172 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors, upright and on its side; the_quarters 164, 0
  stand-ins, both ways, 0 page errors. No fire station file lost.
Gate THE INSIDES WEAR FINISHED ART 154/0 with twenty-two kits (A3 floor worst 3.2 against 5.8, the quarters' vinyl 3.5 against 6.8; A4 the
gear racks, kitchen and lockers a tile long; A5 570,816 bytes of 900,000; C3 134 steps, 34% lines).

## REFERENCE CHECK (compared to the world before calling it done)
The valley's fire stations: drive-through apparatus bays of sealed concrete with trench drains, Type I pumpers about 10 m long with roll-up
compartment doors, a pump panel and a hose bed, turnout gear on open steel racks along the bay wall, SCBA bottles on racks and a cascade fill
station, a rescue tool cabinet with the hydraulic spreader and cutter and wooden cribbing, the exhaust extraction hoses on their rails over each
bay; the quarters: a bunk room, a big kitchen with a commercial range and a long table the crew eats at together, a day room of recliners, the
crew's lockers. The twins: this lane's truck stop (the roof) and police station (the vinyl, the lockers) kits.

[analog horror: every coat still on its hook and every helmet over it, as if the crew went out on a call and never came back; the pots still on
the range, the plates still on the table]
[bb Battle Brothers' wagon-fort: the engines are the walls you fight between, nobody stands on one and nobody sees through one]

## THE TOOLS
tools/bohemia_cook7_the_fire_station_finished_11_27_26.py   render fh_floor | fh_bay | fh_quarters | ceil_firehouse; cut; sheet (ON the
library tool, through the inside kit).

## NOT DONE, SAID PLAINLY
1. The quarters wear the bay's concrete until COMBAT FIVE adds a floor area of kind 'quarters' to the_quarters (one rectangle, the whole
   layout); the vinyl is in the sheet's rows 3 and 4 waiting.
2. No night versions; the night board's frames are the page's (above).
3. The library's loading screen measured above is not chased here: its board is not slower.
4. *** FOR COMBAT FIVE (FOUND, NOT MINE TO FIX): GATE THE BIG INSIDES I8 FIREHOUSE is red on main before this art and identical with it
   (node gates/the_big_insides_gate.js firehouse, run both ways: 'after the first round 101 of 250 men (40%) stand on the bare open floor,
   with the rule off 142 of 250 (57%)'; 21 passed, 1 failed either way). It is the station's layout and AUTO's choice of ground (the bay's
   open floor between the engine blocks), not a picture: a picture changes no tile. The other 21 legs pass with the art in.

VOTE: cook7-the-fire-station-11-27 (MADE FROM arena2-the-pit-is-a-pit-11-7).
