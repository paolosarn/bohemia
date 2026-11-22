# COMBAT FOUR: THE ARSENAL (BUILD 11/22 - THE ARSENAL)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). THE ARSENAL, Paolo's own place (7/5/26, engine/bohemia_overmap.js): 'the range that houses tanks + helicopters, one block off
the strip on the rail side (real: behind Circus Circus). The Remnants saw it as super important; contested with the cartel.' Its fights
were fought on the street outside it. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22k)
A fight at the arsenal was fought outside it: 'arsenal' is in the plant family (engine/bohemia_boardkinds.js: 'A COMPOUND: a wall with
one gate, tanks and sheds inside it'), which has no board of its own, so the fight dealt the street blocks. The arsenal keeps its cell
on the map in 40 of 40 valleys (the roads find's count).

## THE FACTS IT IS BUILT ON
- Paolo's words above, the map's own comment.
- A shooting range: a firing line of booths, lanes downrange to the backstop (a sand berm or a steel bullet trap), target stands on their
  frames, drill barricades in the lanes; behind the line the counter with its glass cases and the racks. Its display hall holds the
  vehicles.
- A main battle tank is about 10 metres long with its gun and 2.4 high; a Huey's fuselage about 12.7 metres; a Humvee about 4.6 long
  and 1.8 high: on house tiles each is a run of tiles nobody stands on and nobody sees through.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/arsenal/arsenal.json`, the twenty-eighth in `slices/fight_ground/insides.json` (eight fights in ten
at the arsenal's cell, by the cell's own dice). No new rule code; the ceiling is the warehouse's roof ('joist', a stand-in, at 10%).
- `the_firing_range`: the backstop down one wall (steel over sand: it hides a man), the lanes downrange with target stands (low cover),
  drill barricades (low cover) and sandbag positions (low cover), the firing line of booths across the room with three gaps (cover),
  behind it the counter (cover), ammo crates (cover) and the gun racks (they hide a man); doors on the far side and its corner, a fire.
- `the_vehicle_hall`: six tanks in runs of three tiles, two helicopters' fuselages four tiles long across the middle, four Humvees
  (all of them blockers that hide a man, cover beside them); sandbag emplacements, ammo crates and drums between them; gun racks in the
  corners; doors on both sides and the bottom, two fires.
- 16 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the vehicles its boulders, the backstop and the
  racks its wall, the sandbags its palisade waist high, the booths its palisade); 14 pieces with the walls, all stand-ins, every one
  painting at least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND: a tank's deck is a climb nobody makes under
  fire on house tiles. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 490 passed, 0 failed over twenty-eight insides in 384 s, alone on the box; the arsenal 20 of them)
36 of 40 fights at the arsenal's cell go inside (the share 0.8 of what the garage leaves); 24 of 24 fights to the end on AUTO (6.8
rounds), nobody of 288 stood a whole fight; 14% of men on the bare floor after round one against 30% with rule 428's leg off; every
board's floor joined, both layouts dealt both ways; the tall things read on both layouts (the racks, a tank, a Humvee, the helicopter
hide a man); I13: 12 stand-in pieces, each painting at least 9% of a tile.
MY FIRST CUTS, MEASURED AND CHANGED: the vehicle hall 29% bare after round one (the range 17%): the floor between the vehicles was open;
sandbags, crates and drums went between them: 9%. Then the gate: one tile of the range's corner walled in by the racks (215 of 216 open
tiles reached on 11 boards) and the vehicle hall with no fire (dark at night everywhere): the corner opened, two fires lit.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:arsenal, C3_INSIDE=arsenal, through the map's own door)
The demo upright 1 fight (THE VEHICLE HALL), 3 of 3 taps (the floor, sandbags, drums); the demo on its side 1 (the vehicle hall), 3 of
3; the alpha upright 1 (THE FIRING RANGE, another valley's arsenal), 3 of 3 (a booth, the floor, a barricade); the alpha on its side 1
(the firing range), 6 of 6 (the floor, a booth, ammo crates, the fire, a barricade, sandbags). 4 fights inside, both rooms, all ended on
AUTO, 15 of 15 tile taps, 0 page errors. THE ALPHA ON ITS SIDE TOOK FIVE RUNS, ALL FIVE FIGHTS ENDED CLEAN WITH 0 PAGE ERRORS: two never
gave the tool's finger a turn (AUTO played the fight out first: nothing to tap), and one tapped the ammo crates and read the floor one
tile over. THE PAGE TOOL'S OWN RACE, FIXED: the tool checked the tile under the finger and tapped while the camera was still gliding to
the man whose turn it was (the tap after it read right); tools/bohemia_combat_three_on_the_page.js now waits for the glide to end, and
the next run tapped all six, the ammo crates among them.

## SAID PLAINLY
VOTE card combat4-the-arsenal-11-22 (stand_in): the firing range and the vehicle hall from the fight's camera, and a real fight in the
arsenal. The pictures are stand-ins (a bulldozer for a tank, a container for the helicopter, a wreck for a Humvee) until COOK draws
them; the ground's rules are real. Who holds the arsenal (the Remnants, the cartel) is FACTIONS' and WORLD's; nothing of it is built
here.
