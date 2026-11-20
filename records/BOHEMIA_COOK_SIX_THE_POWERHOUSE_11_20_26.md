# COOK SIX: THE DAM'S POWERHOUSE, FINISHED, AND ITS ROOF (11/20/26)

COMBAT FOUR's BUILD 11/20j asked 'FOR COOK (FIVE or SIX)'; COOK SIX carries COOK FIVE's lane (VAMILY rule 461, THE WHOLE
ENCHILADA; rules 453, 441, 416, 451(a), 455). BUILD 11/20q - THE DAM'S POWERHOUSE.

## WHAT THIS IS
COMBAT FOUR's tenth inside (THE POWERHOUSE: a fight in the dam's generator hall, a row of generators you cannot stand on with their
boards beside them, the lanes either side, the visitors' balcony a storey up that nobody holds at the bell). Every one of its 22
pieces was a stand-in (the garage's core for a generator, the casino's dead screens for a board, the street board's bales and
tyres), and its roof was drawn by the page. They are in the folder now under its names, through the master rig, and the
powerhouse lays them with no code changed:

- THE FLOOR (powerhouse_floor_0.webp, five tiles by five): rows 0 to 2 THE TERRAZZO, cream, with one of Allen Tupper True's
  Southwest patterns laid in rust and black in a tile's middle on most tiles (a stepped diamond, a band of zigzag, a ring of
  chevrons round a black sun; never on a tile's edge, so any tile meets any tile, and a tile here and there plain so the floor is
  not a grid of them), the dust on it. Row 3 THE SAME FLOOR WET where the dam weeps: dark water standing in the middle, the white
  lime where it dried at its edge, a streak where it comes down, a dry margin so it meets the floor. Row 4 the balcony's floor.
- THE PIECES (powerhouse_art.json's kit, COMBAT FOUR's 22 names under 20 pictures):
  A GENERATOR (pw_unit): the round steel housing 10 m across, its plate seams, its unit number big on the face, the exciter on top,
  the rail round the top, a ladder up its side, a dead alarm. A UNIT'S BOARD (pw_board): six cabinets of dead dials, the desk with a
  log book open and a phone, a chair pushed back. A ROTOR ON ITS STAND (pw_rotor): the rotor on its cribbing, its copper poles round
  it. THE CRANE'S HOOK (pw_hook): the block in yellow and black let down to the floor, the hook, its cable slack in coils.
  CRATED SPARES (pw_spares, _b: six crates stencilled, a lid prised off; two, and what was in one out on the floor). CABLE REELS
  (pw_cable, _b: reels on their sides and the cable run off them across the floor). TOOL CARTS (pw_cart, _b: two carts, a parts
  trolley, spanners on the floor). SOMEBODY'S BEDDING (pw_camp_a, _b; pw_bedding_a, _b the same two pictures): bedding on cardboard
  by a unit with a stove and a pot, water, a lantern, the shoes, a child's drawing of the generator; a cot under a tarp strung
  between two tool carts. A COLUMN (pw_column): square, its bronze band, names on it. THE BALCONY (pw_balcony: its floor and its
  runner, the fascia with the bronze band and the cast panels, a tour's leaflets), ITS BENCHES (pw_bench, somebody asleep on one),
  its stairs east and west (the hall's concrete stair), ITS RAIL (pw_rail_ew: bronze, the Deco plaques), THE HALL'S WALL (pw_wall_ew,
  _ns: cast concrete, its panels, the bronze band, a plaque, where it weeps and its lime).
- THE ROOF (powerhouse_ceiling.webp, rule 451(a), over the fight at his 10%): ONE PICTURE THE SIZE OF THE BOARD, 20 by 15 tiles (as
  the stadium's: the crane runways are on the hall's long walls, so the roof cannot repeat): the roof far up and a beam across it
  every tile, its purlins, the runways along both long walls, two bridge cranes across the hall with their trolleys and their hooks
  hanging, forty hanging lamps and one of them still on, the stains where it leaks. powerhouse.json's ceiling entry: "have": true,
  "tile": [20, 15] (the one agreed edit in COMBAT FOUR's file).

22 pictures, 792,730 bytes in the folder (its budget 900,000); the floor 284,848, the roof 56,316.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'powerhouse', through district 'dam') on the real fight page, 390 x 844 and
844 x 390:
- BEFORE (main d972db85a, the powerhouse's art file absent), the generator floor upright: THE POWERHOUSE, 165 pieces, 165 of them
  stand-ins, the roof drawn by the page (the 'crane' stand-in), a fight tile 43.9 points; 0 page errors.
- NOW, upright, the generator floor: 165 pieces, 0 stand-ins, the roof's picture drawn at 0.1 over [20, 15], a tile 43.9 points,
  0 page errors. On its side: the same, a tile 28.6 points, 0 page errors. The service bay upright: 166 pieces, 0 stand-ins, 0 errors.
- The one picture any run asked for and did not get is fight_ground/sphere/sphere_art.json: COMBAT FOUR's Sphere, not this build.
- Close in (the page as it is): the generators and their boards, the balcony, the hook, a camp, the wet floor, the river doors; the
  service bay's units, rotor, column and balcony.
FOUND BY EYE on the way: the first floor had a pattern on four tiles in five in strong rust and black, and the board read as wallpaper
over the men (now on fewer than half the tiles, rust and grey-brown, measured 154,104,91 against a target of 152,108,86); a black
disc at a pattern's middle rendered as a hole (now a ring); the roof's one lit lamp hid under a crane (moved into the open); a beam
over every tile drew his grid at 10% (now every tile and a quarter).
Gate THE INSIDES WEAR FINISHED ART 70/0 (the powerhouse a ninth kit: A1 to A6, P1; its roof a tenth ceiling, C2b's second
board-sized picture). COMBAT FOUR's gates on this tree: THE BIG INSIDES 123/0, AN INSIDE SHOWS ITS CEILING 6/0.

## REFERENCE CHECK (compared to the world before calling it done)
Hoover Dam's powerhouse (Bureau of Reclamation): two wings at the dam's foot, each about 198 m long; a line of generator units in
round housings with their exciters on top; terrazzo floors laid in Allen Tupper True's Southwest patterns; bridge cranes on runways
along both walls that lift a rotor out for service; the visitors' balcony over the floor; cast concrete and bronze in the Art Deco
of the 1930s. The twins: the stadium's kit and the terminal's (the card shows the hall before and now).

[analog horror: the dam's own tour from the balcony, the floor below empty, one lamp of forty still on; a family asleep against the
side of a generator nobody knows if it still turns (rule 459(e): it is not said)]
[bb Battle Brothers' boulders: a stone you cannot stand on breaks a line into the gaps between; a row of generators is that row of
stones, and they have to read as stones at a glance]

## THE TOOLS
tools/bohemia_cook6_the_powerhouse_finished_11_20_26.py   cal; render pw_floor | pw_pieces | ceil_powerhouse; cut; sheet
  (ON this lane's stadium tool and COOK FIVE's chain under it: eight deep)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js <outdir> powerhouse [upright,sideways] [the_generator_floor|the_service_bay]

## NOT DONE, SAID PLAINLY
1. The 'galleries in the concrete' are not on the board (COMBAT FOUR's word: a tile is a house, never a hallway); nothing of them drawn.
2. The units' numbers are blocks, not legible letters, at the fight's zoom; the board's dials are dots.
3. The balcony's runner reads as stripes along it from the map's eye.
4. No night versions. The service bay was shot upright only (the generator floor both ways).
5. Next on this lane: THE SPHERE, when COMBAT FOUR's names for it land (the page already asks for its art file).

VOTE: cook6-the-powerhouse-11-20 (MADE FROM arena2-the-pit-is-a-pit-11-7).
