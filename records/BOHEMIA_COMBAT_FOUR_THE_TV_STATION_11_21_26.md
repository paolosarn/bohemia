# COMBAT FOUR: THE TV STATION (BUILD 11/22 - THE TV STATION)

11/21-22/26. COMBAT FOUR, more boards (rule 461). The TV station (the map's kind 'tvstation'), whose fights were still round its masts
and its lot. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/21zh)
A fight at the TV station was fought on the blocks outside it.

## THE FACTS IT IS BUILT ON
- A local TV station is a studio (the news set and its backdrop, studio cameras on pedestals, a lighting grid overhead, cable all over
  the floor) beside a newsroom of desks and a master control room walled in monitors.
- A green screen stands at one end of the studio; the set's desk is built heavy, to be lit and shot from the front.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/tvstation/tvstation.json`, the nineteenth in `slices/fight_ground/insides.json` (eight fights in
ten at the station's cell, by the cell's own dice). No new rule code; the ceiling is the hospital's 'grid' (the lighting grid's stand-in).
- `the_studio`: the green screen along the back wall (a blocker), the news set's backdrop (a wall: no sight through), the news desk at
  each end (cover), studio cameras on pedestals, light stands and teleprompters (low cover), set flats and equipment racks (blockers),
  cable runs underfoot (rough 3 AP, no cover), the sound-lock doors.
- `the_newsroom`: a wall of dead monitors at each end (blockers), the control consoles (cover), desks in pods (cover), office chairs
  kicked over in heaps (rough 3 AP, low cover), cable runs.
- 17 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the backdrop and the monitor wall its wall, the
  flats its palisade, the chairs its brush, the cables its rough ground); 15 pieces, all stand-ins (the names for COOK in the handoff).
  NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 299 passed, 0 failed over nineteen insides; the TV station 18 of them)
24 of 24 fights to the end on AUTO, nobody of 288 stood a whole fight; 6% of men on the bare floor after round one against 25% with rule
428's leg off (a studio is packed with gear). MY FIRST CUT: 32%: the set's middle and the newsroom's aisles were open; cameras,
prompters and desks went where the men stood.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:tvstation, C3_INSIDE=tvstation, through the map's own door)
The demo upright 1 fight, 4 of 4 taps; the demo on its side 1, 5 of 5; the alpha upright 1, 4 of 4; the alpha on its side 1, 5 of 5. 4
fights in the studio, all ended on AUTO, 18 of 18 tile taps, 0 page errors; the ceiling moves a pixel 3.6 to 7.6 of 255 on average. The
station's cell rolled THE STUDIO on every valley these runs opened; THE NEWSROOM is seen on the fight page opened alone (the card's top
right) and in the gate.
