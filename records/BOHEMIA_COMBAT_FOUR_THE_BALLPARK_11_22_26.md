# COMBAT FOUR: THE BALLPARK (BUILD 11/22 - THE BALLPARK)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The ballpark (the map's kind 'ballpark': the Las Vegas Ballpark in Summerlin, the Aviators' park, engine/bohemia_overmap.js;
eight cells), whose fights were all fought outside. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22l)
A fight at the ballpark was fought outside: 'ballpark' is in the infrastructure family (engine/bohemia_boardkinds.js: 'AN APRON: open
paved ground, one long shed, a perimeter fence'), which has no board of its own, so the fight dealt the street blocks. The ballpark
keeps its cells in 40 of 40 valleys.

## THE FACTS IT IS BUILT ON
- The map's ballpark is the Las Vegas Ballpark in Summerlin, the Aviators' park, opened in 2019.
- A ballpark's concourse runs behind the seats: concession stands, the team store, tables, condiment stations and beer carts, the
  restrooms, and the tunnels out into the seating bowl, where the daylight comes in.
- Under the stands is the home clubhouse: the lockers, the batting cages (netting on frames, a pitching machine in each), the weight
  room, the trainers' room with its tables and steel tubs, the laundry.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/ballpark/ballpark.json`, the twenty-ninth in `slices/fight_ground/insides.json` (two fights in five
on the ballpark's cells, share 0.4: the rest is the field, the bowl and the lots). No new rule code; the ceiling is the warehouse's
roof ('joist', a stand-in, at 10%).
- `the_concourse`: concession stands (cover) in runs across the concourse, the team store (cover) and the restrooms' block walls (they
  hide a man) at both ends, tables and umbrellas, bins, condiment stations (low cover), beer carts (cover), the tunnels out to the seats
  on both sides (open; by day the light comes down them), the gates at the end, a fire.
- `the_clubhouse`: lockers along both walls (they hide a man), the batting cages (netting: nobody passes, seen through) with pitching
  machines (low cover), equipment trunks (cover), the weight room's racks (cover), benches (low cover), the trainers' tables and steel
  tubs (cover), laundry carts (low cover); doors on both sides and the bottom, two fires.
- 21 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the cages its palisade you see through, the lockers
  and the restrooms its wall, the condiment stations its palisade waist high); 18 pieces with the walls, all stand-ins painting at
  least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND: the seats are out in the bowl beyond the tunnels. No
  line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 507 passed, 0 failed over twenty-nine insides in 437 s, alone on the box; the ballpark 20 of them)
16 of 40 fights on the ballpark's cells go inside (the share 0.4 of what the garage leaves); 24 of 24 fights to the end on AUTO (6.5
rounds), nobody of 288 stood a whole fight; 14% of men on the bare floor after round one against 38% with rule 428's leg off; every
board's floor joined, both layouts dealt both ways; the cages are seen past; I13: 16 stand-in pieces, each painting at least 9% of a
tile.
THE GATE'S OWN PLANT, FIXED FOR GOOD: I5p made the kit's first piece block and counted the tiles that turned to walls on one dealt
board. Three times (the aquarium, the campus, now the ballpark's tables, which the clubhouse does not have) that board did not lay the
piece and the plant read nothing (a red on a right board). The plant now takes the first piece the dealt board lays (green: the
ballpark's trunks, 12 tiles; the aquarium's benches, 22).

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:ballpark, C3_INSIDE=ballpark, through the map's own door)
The demo upright 2 fights inside of 8 on the ballpark's cells (the clubhouse twice), 11 of 11 taps; the demo on its side 2 of 8, 7 of
7; the alpha on its side 2 of 8, 9 of 9; the alpha upright on another valley 3 of 4 (THE CONCOURSE three times: the floor, a fire,
tables, a concession stand, bins), 13 of 14, and on a second run 2 of 8 (the clubhouse), 13 of 13. 11 fights inside, both rooms, all
ended on AUTO, 53 of 54 tile taps, 0 page errors. THE ONE MISS: a tap aimed at the team store read the doors two tiles over (the
camera moving under the finger between the tool's read and its tap, the arsenal's race again, rarer now that the tool waits for the
glide); the second run on that way tapped 13 of 13.

## SAID PLAINLY
VOTE card combat4-the-ballpark-11-22 (stand_in): the concourse and the clubhouse from the fight's camera, and a real fight under the
stands. The pictures are stand-ins until COOK draws them; the ground's rules are real.
