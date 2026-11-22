# COMBAT FOUR: THE SPEEDWAY (BUILD 11/22 - THE SPEEDWAY)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The speedway (the map's kind 'speedway': 'SPEEDWAY (EDC / LVMS): beside the air base', engine/bohemia_overmap.js; four
cells by three, about ten a valley), whose fights were all fought outside. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22s)
A fight at the speedway was fought outside: 'speedway' is in the infrastructure family (engine/bohemia_boardkinds.js: 'AN APRON: open
paved ground, one long shed, a perimeter fence'), which has no board of its own, so the fight dealt the street blocks. The speedway
keeps 402 cells over 40 valleys, in 40 of 40.

## THE FACTS IT IS BUILT ON
- The map's own comment: the speedway beside the air base is the Las Vegas Motor Speedway and its festival ground (EDC).
- The dead's own line for the kind (engine/bohemia_dead.js): 'the infield camp'.
- A speedway's infield holds the garage row: team bays side by side, each a car on jack stands with its tool chests, tyre stacks and
  fuel jugs, block walls between the bays, the haulers (semi trailers) parked in a line behind; and the inspection shed, where the cars
  go up on lifts, sit on the scales and are checked against the templates hung on their racks, with the parts shelves along the walls
  and a floor drain.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/speedway/speedway.json`, the thirty-fourth in `slices/fight_ground/insides.json` (about one fight
in three on the speedway's cells, share 0.3: the rest is the track, the grandstands and the infield's asphalt). No new rule code; the
ceiling is the warehouse's roof ('joist', a stand-in, at 10%).
- `the_garage_row`: three columns of bays down the room, each bay walled off from the next by its block wall (it hides a man), a race
  car on its stands (cover) and a tool chest (cover) in each, tyre stacks and fuel jugs (low cover) in the lanes between the bays, the
  haulers in the four corners (they hide a man); doors on both sides and the bottom, two fires.
- `the_inspection_shed`: cars up on lifts in two crosses (cover), the template racks in the middle (they hide a man), cars on the
  scales (cover), the parts shelves along the walls (they hide a man), tool chests (cover), tyres and fuel jugs (low cover), and the
  floor drain backed up (STANDING WATER: Battle Brothers' swamp, 4 AP, a man in it fights worse); doors on both sides and the bottom,
  two fires.
- 14 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the bay walls, shelves and racks its wall, the
  haulers its boulders, the drain its swamp); 11 pieces with the walls, all stand-ins painting at least 9% of a tile (I13) (the names for
  COOK in the handoff). NO HIGH GROUND: the grandstands are outside. No line rewritten (465); the tiles' tap lines are new, draft.
  The infield camp (the dead's line, the festival ground) is the map's and WORLD's; nothing of it is built here.

## THE GATE (gates/the_big_insides_gate.js: 595 passed, 0 failed over thirty-four insides, in its two halves (301 in 321 s, 294 in 283 s); the speedway 21 of them alone, in 61 s)
13 of 40 fights on the speedway's cells go inside (the share 0.3); 24 of 24 fights to the end on AUTO (6.3 rounds), nobody of 288 stood a
whole fight; 5% of men on the bare floor after round one against 18% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 STANDING WATER IS SWAMP: a man of his on the drain is struck more often than on the same tile dry (6% against 5%
at the gate's range); I12 the shelves, the template racks and the bay walls hide a man; I13: every stand-in piece paints at least 9% of a
tile.
MY FIRST CUT, MEASURED AND CHANGED: 18% bare after round one (the garage row 22%, the shed 24% one way): the lanes between the bays and
the shed's middle were open floor. Tyres, fuel jugs and tool chests went into them: 5%.
THE GATE'S CLOCK (FOR PLUMBER): with thirty-four insides each half runs 283 to 321 s against the suite's 600 s cap, about 17 s more a
half for every two insides. At this pace a half reaches about 450 s near forty-two insides; cutting the list in three (the same
every-other cut, every third) is the fix when it is needed. Not needed yet, not built.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:speedway, C3_INSIDE=speedway, through the map's own door)
10 fights inside of the 33 the tool walked to on the speedway's cells (the rest rolled the asphalt outside): the demo upright 2 (the
inspection shed), 10 of 10 taps; the alpha on its side 2 (the shed), 12 of 12; the demo on its side 3 (the shed twice, THE GARAGE ROW),
18 of 18; the alpha upright 3 (the garage row, the shed twice), 9 of 9. All ended, 49 of 49 tile taps (tyres, the floor, a car on a
lift, fuel jugs, tool chests, race cars), 0 page errors. Run two at a time.
REBASED ON PLUMBER 8's BUILD 11/22t (the city page's crowd and first play; nothing the insides gate loads): the demo upright and the alpha on
its side again through the map's door, 4 fights inside, 22 of 22 taps, 0 page errors.

## SAID PLAINLY
VOTE card combat4-the-speedway-11-22 (stand_in): the garage row and the inspection shed from the fight's camera, and a real fight in the
garage row. The pictures are stand-ins (a container for a hauler, a car wreck for a race car on stands, an overturned car for a car on a
lift) until COOK draws them; the ground's rules are real.
