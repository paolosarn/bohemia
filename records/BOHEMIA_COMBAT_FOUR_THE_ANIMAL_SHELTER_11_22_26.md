# COMBAT FOUR: THE ANIMAL SHELTER (BUILD 11/22 - THE ANIMAL SHELTER)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The animal shelter (the map's kind 'shelter', WORLD's real place on Mojave Road), whose fights were fought on its works yard.
Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22i)
A fight at the animal shelter was fought on the board of the kind it is like ('shelter' is in the fight's 'landfill' family: the works
yard's blocks), never inside it.

## THE FACTS IT IS BUILT ON
- WORLD's real place (records/target/bb/real_places.json, 'the_animal_shelter'): The Animal Foundation, 655 North Mojave Road east of
  downtown, Nevada's largest animal shelter, tens of thousands of animals a year; 'the valley's feral dogs came from somewhere; the
  kennels opened the week the staff stopped coming'.
- A shelter's kennel building is rows of runs, each a concrete floor with a block wall to the waist and chain link above it and a gate,
  aisles between the rows; beside it the clinic (stainless cage banks, exam tables), the intake counter and the lobby, the food store
  and the laundry.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/shelter/shelter.json`, the twenty-sixth in `slices/fight_ground/insides.json` (seven fights in ten at the
shelter's cell, by the cell's own dice). No new rule code; the ceiling is the warehouse's roof ('joist', a stand-in, at 10%).
- `the_kennels`: rows of kennel runs across the building (block and chain link, their gates open: nobody crosses a row, a man is seen
  through it, cover beside it), with gaps between the runs; in the aisles feed bag pallets (cover), wire dog crates and drums (low
  cover); the doors on both sides and the bottom (lit by day), two fires.
- `the_clinic_and_intake`: the stainless cage banks along the top wall (they hide a man), supply shelves (they hide a man), exam tables
  (cover) and supply carts (low cover); the intake counter's glass in two runs across the room (seen through, never crossed) and their ends
  (low cover); in the lobby dog crates and drums (low cover); kibble sacks stacked (cover) and torn across the floor (rough 3 AP, low
  cover); the laundry's washers in the corners (cover); doors on both sides and the bottom, two fires.
- 17 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the runs and the glass its palisade you see
  through, the cage bank and the shelves its wall, the spilled kibble its brush); 15 pieces with the walls, all stand-ins (the names
  for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 430 passed, 0 failed over twenty-six insides in 385 s; the shelter 19 of them)
31 of 40 fights at the shelter's cell go inside (the share 0.7 of what the garage leaves); 24 of 24 fights to the end on AUTO (6.7
rounds), nobody of 288 stood a whole fight; 13% of men on the bare floor after round one against 26% with rule 428's leg off; every
board's floor joined, both layouts dealt both ways; the tall things read on both layouts (the supply shelves hide a man; the runs and
the intake glass are seen past; a cage bank stands against the wall, never between two floors, so the gate has no spot to read it
across, and its data says it hides a man).
MY FIRST CUT, MEASURED AND CHANGED: the kennels 30% bare after round one (the clinic 22%): the aisles between the runs were open
concrete where both lines stood. The aisles filled with crates, drums and feed bags: 6%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:shelter, C3_INSIDE=shelter, through the map's own door)
The demo upright 1 fight (the kennels), 3 of 3 taps (the floor, dog crates, drums); the demo on its side 1, 4 of 4 (the floor,
crates, feed bags, drums); the alpha upright 1, 4 of 4; the alpha on its side 1 (another valley's shelter, at [30,26]), 4 of 4. 4
fights inside, all ended on AUTO, 15 of 15 tile taps, 0 page errors; the ceiling moves a pixel 1.8 to 2.6 of 255 on average. Each
valley has one shelter (40 of 40 valleys keep its cell, the roads find), and the cell's own dice dealt the kennels on every valley met;
THE CLINIC AND INTAKE is seen on the fight page opened alone (the card's top right) and in the gate (24 boards).

## SAID PLAINLY
VOTE card combat4-the-animal-shelter-11-22 (stand_in): the kennels and the clinic from the fight's camera, and a real fight in the
shelter on the page. The pictures are stand-ins (the casino's cage for a row of runs) until COOK draws them; the ground's rules are real.
The dogs are not here: the runs are empty and their gates hang open. A dog in the company starting here is WORLD's NOTE to HIRES and
PEOPLE (the real place's 'use'), nothing of it built by this lane.
