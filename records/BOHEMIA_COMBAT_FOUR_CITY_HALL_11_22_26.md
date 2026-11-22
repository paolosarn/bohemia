# COMBAT FOUR: CITY HALL (BUILD 11/22 - CITY HALL)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). City Hall (the map's kind 'cityhall': downtown, beside the courthouse, the mayor arc's office), whose fights were fought on
the street blocks outside it. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22h)
A fight at City Hall was fought outside it: 'cityhall' is in the civic family (engine/bohemia_boardkinds.js), which wants 'A CIVIC
INTERIOR: a counter, a corridor spine, small rooms either side' and has no board of its own, so the fight dealt the street blocks.

## THE FACTS IT IS BUILT ON
- Las Vegas City Hall stands downtown in the civic core beside the courts; the map seats it beside the courthouse (the mayor arc's
  office, engine/bohemia_overmap.js).
- A city council chamber: the dais, a long raised bench curved round for the mayor and the council; the clerks' and staff's tables
  below it; a podium where the public speaks; the public's seats in rows with aisles; the city channel's cameras.
- The public floor below it: the service counters (licences, permits, water bills) behind glass, the offices' cubicles behind them,
  the lift core, an information desk, benches and planters.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/cityhall/cityhall.json`, the twenty-fifth in `slices/fight_ground/insides.json` (eight fights in
ten at City Hall's cell, by the cell's own dice). No new rule code; the ceiling is the casino's coffers ('coffer', a stand-in, at 10%).
- `the_council_chamber`: the dais across the top of the room and down both its ends (nobody stands on it; a man behind it is seen
  over; cover beside it), the clerks' and staff's tables (cover) inside its curve and along the walls, the podium (low cover) in front
  of it, the cameras (low cover), planters (cover), the public's seats in banks of rows with aisles (rough 3 AP, low cover), the doors
  at the back and on both sides (lit by day), two fires.
- `the_permit_floor`: two service counters across the floor, each a run of glass (nobody passes, seen through) with its ends (low
  cover); behind them the cubicles (cover), copiers (low cover) and file cabinets (cover), the lift core (walls) top and bottom; in the
  public middle the information desk (cover), benches (low cover) and planters (cover); doors on both sides and the bottom, two fires.
- 17 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the dais its palisade chest high, the glass its
  palisade you see through, the counter's end its palisade waist high, the seats its brush); 15 pieces with the walls, all stand-ins
  (the names for COOK in the handoff). NO HIGH GROUND: the dais is raised a step, not a storey. No line rewritten (465); the tiles' tap
  lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 414 passed, 0 failed over twenty-five insides in 533 s; City Hall 19 of them)
32 of 40 fights at City Hall's cell go inside (the share 0.8 of what the garage leaves); 24 of 24 fights to the end on AUTO (6.9
rounds), nobody of 288 stood a whole fight; 19% of men on the bare floor after round one against 35% with rule 428's leg off; every
board's floor joined, both layouts dealt both ways; the tall things read on both layouts (the walls of the lift core hide a man; the
dais and the counters' glass are seen past).
THE GATE'S CLOCK: 533 s for twenty-five insides, run while two page runs shared the box's four cores (alone, twenty-four took 341 s);
the suite's cap is 600 s. Each inside adds about 15 s at four at a time: the next lever is the children's count, not fewer legs.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:cityhall, C3_INSIDE=cityhall, through the map's own door)
The demo upright 1 fight (the council chamber), 4 of 4 taps (the floor, a table, the seats, the cameras); the demo on its side 1, 4
of 4 (the cameras, the floor, a table, the seats); the alpha upright 1, 5 of 5 (the floor, a table, a planter, the seats, the
cameras); the alpha on its side 1, 4 of 4. 4 fights inside, all ended on AUTO, 17 of 17 tile taps, 0 page errors; the ceiling moves a
pixel 4.7 to 8.4 of 255 on average. Each valley has at most one City Hall cell, and the cell's own dice dealt the council chamber on
every valley met; THE PERMIT FLOOR is seen on the fight page opened alone (the card's top right) and in the gate (24 boards).
SEVEN RUNS, TWO WITH NO CITY HALL: two of the seven page runs opened a valley whose map has no City Hall cell at all ('cells of cityhall
0'). Measured and routed to WORLD (records/BOHEMIA_COMBAT_FOUR_THE_ROADS_PAVE_THE_ONE_CELL_PLACES_11_22_26.md): the arterial grid paves
the seat of a one-cell place; over 40 valleys of the map alone City Hall is gone in 12, the jail in 28, the library in 7.
THE PAGE TOOL'S OWN RACE, FIXED: the demo on its side's first run ended its fight clean (6 rounds, 4 of 4 taps, 0 page errors) and then
the tool died tapping LEAVE on a spoils screen that had already closed itself ('Frame was detached'); tools/bohemia_combat_three_on_the_
page.js now lets that tap find the screen gone. Run again on the fixed tool: the demo on its side 1 fight, 4 of 4 taps, 0 page errors, the spoils left and the map again.

## SAID PLAINLY
VOTE card combat4-city-hall-11-22 (stand_in): the council chamber and the permit floor from the fight's camera, and a real fight at
City Hall on the page. The pictures are stand-ins (the casino's bar for the dais, a garage booth for a cubicle) until COOK draws them;
the ground's rules are real.
