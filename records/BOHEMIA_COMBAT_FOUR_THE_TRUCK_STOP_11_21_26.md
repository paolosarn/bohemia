# COMBAT FOUR: THE TRUCK STOP (BUILD 11/21 - THE TRUCK STOP)

11/21/26. COMBAT FOUR, more boards (rule 461). The truck stop on the freeway (the map's kind 'truckstop'), whose fights were still on its
lot. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/21za)
A fight at the truck stop was fought on the scrub road, main street and works blocks (its own cell's deal: 'strip' on 'industrial').

## THE FACTS IT IS BUILT ON
- A travel center on the interstate is a fuel plaza, a store the size of a small supermarket's floor (coolers along the back wall, rows
  of shelving, a hot food case, the counter by the doors) and, at the bigger ones, a truck service bay.
- A service bay takes a whole rig: a tractor and its trailer end to end, a lift beside it, tires stacked along the walls, the bay doors
  at each end so a truck drives through.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/truckstop/truckstop.json`, the fifteenth in `slices/fight_ground/insides.json` (seven fights in ten at
the truck stop's cell, by the cell's own dice: the gate 31 of 40). No new rule code; the ceiling is the warehouse's roof ('joist', a
stand-in).
- `the_travel_store`: the coolers along the back wall (nobody stands there, cover beside them), four runs of stripped shelving each side
  of a centre aisle (a run is a tile you cannot stand on; it blocks a shot along the aisle), end caps at the runs' ends (low cover),
  cases pulled down (cover), jerky stands (low cover), empty pallets where the water was (rough 3 AP, low cover), stacked water nobody
  could carry (cover), the deli's booths (low cover), the hot food cases (cover), the coffee island (a blocker), the counter by the front
  doors (cover), side doors and two fires.
- `the_service_bay`: two rigs a side, each a cab and its trailer (blockers), drive-on lifts raised with a pickup still on them (blockers),
  stacked tires (cover), tool chests, oil drums and the compressor (low cover), bay doors at both ends (lit by day), four fires.
- 22 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the shelving its palisade, the pallets its brush,
  the island, the cab and the lift its boulder or obstacle, the coolers and the trailer its wall); 20 pieces, all stand-ins (the names
  for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 238 passed, 0 failed over fifteen insides; the truck stop 18 of them)
24 of 24 fights to the end on AUTO (6.8 rounds), nobody of 288 stood a whole fight; 18% of men on the bare floor after round one against
32% with rule 428's leg off.
MY FIRST CUT, MEASURED AND CHANGED: 35% bare: the store's centre aisle and its deli held both lines in the open (the bay 24%). The middle
of two runs each side closed with end caps, cases and water pulled into the centre aisle, the deli filled: 19%. Then the bay's
inspection pits drew as plain floor (a pit has no picture: a tile you cannot cross that looks walkable); they became raised lifts with a
picture: 18%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:truckstop, C3_INSIDE=truckstop, through the map's own door)
The demo upright 2 fights (the store), 5 of 5 taps; the demo on its side 2 (the store), 4 of 4; the alpha upright 1 (the store), 4 of 4;
the alpha on its side 1 (the store), 4 of 4. 6 fights inside, all ended on AUTO, 17 of 17 tile taps, 0 page errors; the ceiling moves a
pixel 1.8 of 255 on average. Each valley has one truck stop cell; across these runs it stood at one of two spots, one rolling the
store and the other the lot (3 runs met the lot: the 3 in 10). THE SERVICE BAY was not dealt by the map on these valleys: it is seen on the fight page opened alone (the card's
top right) and in the gate (13 of 24 boards).
