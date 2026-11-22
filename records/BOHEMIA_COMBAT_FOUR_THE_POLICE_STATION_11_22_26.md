# COMBAT FOUR: THE POLICE STATION (BUILD 11/22 - THE POLICE STATION)

11/22/26. COMBAT FOUR, more boards (rule 461). The police station (the map's kind 'policestation', two cells on the valleys these runs
opened), whose fights were still in its lot. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22d)
A fight at a police station was fought on the blocks outside it.

## THE FACTS IT IS BUILT ON
- An area command station is a public lobby behind a counter of bullet-resistant glass, the squad room of desks behind it, holding cells
  along a corridor, the evidence and property cages, and the sally port: the secured garage where the patrol cars pull in and prisoners
  are walked out.
- A holding cell is block and bars, about the size of a parking space; a sally port is a garage with a door at each end.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/police/police.json`, the twenty-first in `slices/fight_ground/insides.json` (eight fights in ten at a
police station's cell, by the cell's own dice). No new rule code; the ceiling is the hospital's 'grid' (a stand-in).
- `the_squad_room`: holding cells along the top wall (their fronts of bars a blocker you see through; steel bunks inside, low cover),
  desks pushed together (cover), filing cabinets tipped (cover), case boxes spilled across the floor (rough 3 AP, low cover), the front
  counter and the lobby's bullet-resistant glass (seen through), bolted lobby chairs, a bank of officers' lockers (it hides a man), the
  evidence cage (mesh, seen through).
- `the_sally_port`: patrol cars on flat tires in two rows each side (blockers low enough to see over), property cages along both walls
  (mesh), water-filled barriers emptied and dragged in (cover), cones and stands (low cover), the roll-up doors.
- 18 tile kinds, each its cost and its effect and its Battle Brothers ground, every blocker marked whether it hides a man (the 11/22 rule,
  I12); 16 pieces, all stand-ins (the names for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are
  new, draft.

## THE GATE (gates/the_big_insides_gate.js: 350 passed, 0 failed over twenty-one insides; the police station 19 of them)
24 of 24 fights to the end on AUTO, nobody of 288 stood a whole fight; 14% of men on the bare floor after round one against 26% with rule
428's leg off; I12: the lockers and walls hide a man, the plant caught. MY FIRST CUT: 40%: the middle of both rooms was open floor;
spilled boxes, tipped files, barriers and cones went where the men stood.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:policestation, C3_INSIDE=police, through the map's own door)
The demo upright 2 fights, 11 of 11 taps; the demo on its side 2, 9 of 9; the alpha upright 2, 9 of 9; the alpha on its side 2, 11 of 11.
8 fights in the squad room, all ended on AUTO, 40 of 40 tile taps, 0 page errors. Every police station cell these runs met rolled THE
SQUAD ROOM; THE SALLY PORT is seen on the fight page opened alone (the card's top right) and in the gate.
