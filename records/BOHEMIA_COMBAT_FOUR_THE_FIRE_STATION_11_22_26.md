# COMBAT FOUR: THE FIRE STATION (BUILD 11/22 - THE FIRE STATION)

11/22/26. COMBAT FOUR, more boards (rule 461). The fire station (the map's kind 'firestation'), whose fights were still on its apron.
Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22e)
A fight at the fire station was fought on the main street and ruin blocks outside it.

## THE FACTS IT IS BUILT ON
- A fire station is the apparatus bay (the engines and the ladder truck parked nose to the doors, turnout gear racked along the walls,
  hose drying, air bottles on their racks) and behind it the quarters: the bunk room, the kitchen and the day room.
- A pumper engine is about ten metres long and three high.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/firehouse/firehouse.json`, the twenty-second in `slices/fight_ground/insides.json` (eight fights in
ten at the fire station's cell, by the cell's own dice). No new rule code; the ceiling is the warehouse's 'joist' (a stand-in).
- `the_apparatus_bay`: six engines in two rows (three tiles each, the 'obstacles' row: nobody sees through an engine, the 11/22 rule),
  turnout gear racked on both end walls (it hides a man too), hose laid on the floor and never rolled (rough 3 AP, no cover), air
  bottles and cones (low cover), rescue tool cabinets and workbenches (cover), the bay doors.
- `the_quarters`: bunks in rows (low cover), the kitchen's counters along the wall (waist high: seen over), the long table on its side
  (cover), the day room's couches (low cover), the crew's lockers (they hide a man), tool cabinets and bottles.
- 16 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the engines and gear racks its walls, the hose its
  rough ground); 14 pieces, all stand-ins (the names for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap
  lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 366 passed, 0 failed over twenty-two insides; the fire station 19 of them)
24 of 24 fights to the end on AUTO, nobody of 288 stood a whole fight; 24% of men on the bare floor after round one against 49% with rule
428's leg off, at the first cut.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:firestation, C3_INSIDE=firehouse, through the map's own door)
The demo upright 1 fight, 5 of 5 taps (its first run met the cell that rolls the street, the 2 in 10); the demo on its side 1, 6 of 6;
the alpha upright 1, 4 of 4; the alpha on its side 1, 7 of 7. 4 fights in the apparatus bay, all ended on AUTO, 22 of 22 tile taps, 0
page errors. THE QUARTERS is seen on the fight page opened alone (the card's top right) and in the gate.
