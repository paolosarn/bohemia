# COMBAT FOUR: THE RAIL YARD'S SHOPS (BUILD 11/22 - THE RAIL YARD'S SHOPS)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The rail yard (the map's kind 'railyard'), whose fights were all fought on the landfill and scrub blocks of its own cell's deal.
Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22f)
A fight at the rail yard was fought on the cell's own deal ('railyard' in slices/fight_ground/fight_ground.json: landfill and scrub
blocks), never under a roof.

## THE FACTS IT IS BUILT ON
- A rail yard's locomotive shop is a long shed with tracks running through it: engines stand over inspection pits, work platforms at
  cab height run along them, wheel sets and traction motors stand on the floor, parts racks line the walls. Its freight house is a long
  dock of boxcars, crates, baggage carts and parcel cages.
- A road locomotive is about 22 metres long and nearly five high; a boxcar about 15 metres.
- On house tiles a locomotive is a run of tiles nobody stands on and nobody sees through; a track across the floor is ground a man steps
  over, slowly.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/railshop/railshop.json`, the twenty-third in `slices/fight_ground/insides.json`. A third of the
yard's fights (share 0.35, by the cell's own dice) are fought inside; the rest stay among the cars and the rails outside, as a yard is
mostly track under the sky. No new rule code; the ceiling is the warehouse's roof ('joist', a stand-in, at 10%).
- `the_engine_shop`: four engines on their tracks, two across the top of the shop and two across the bottom (blockers you see nothing
  through, cover beside them), the rails running out from them toward the walls (rough, 3 AP), two work platforms at cab height across the middle (nobody stands
  on them, seen past, cover beside them), wheel sets and engine parts (cover), tool chests and oil drums (low cover), parts racks in the
  corners (a wall), the big doors on both ends and in the bottom wall (lit by day), a fire in a drum.
- `the_freight_house`: four boxcars at the dock, two across the room above the middle and two below it, the rails running out from
  them to the walls, freight crates (cover), baggage carts (low cover), oil drums, parcel cages along the top and bottom walls (mesh:
  nobody passes, seen through), the doors on both ends and in the bottom wall, two fires.
- 16 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the engine, the boxcar and the racks its wall; the
  platform and the cages its palisade you see through; the rails its rough ground); 13 pieces, all stand-ins (the names for COOK in the
  handoff). Every blocker says whether it hides a man ('sight', the tall things leg). NO HIGH GROUND: the platforms stand at cab height,
  but on house tiles they are a thing to go round, not a storey. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 382 passed, 0 failed over twenty-three insides in 381 s; the rail shops 19 of them)
24 of 24 fights to the end on AUTO, nobody stood a whole fight; 23% of men on the bare floor after round one against 43% with rule
428's leg off; every board's floor joined; the tall things hide a man (an engine, a boxcar, the racks) and the platform and the cages
are seen past.
MY FIRST CUT, MEASURED AND CHANGED: 46% bare. Four tracks crossed the whole engine shop from wall to wall: rails are open ground (no
cover), so the middle of the shop was a field of track both lines stood in. The track now runs only under the engines and out to the
doors; the floor between the platforms filled with wheel sets, parts, chests and drums: 23%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:railyard, C3_INSIDE=railshop, through the map's own door)
The demo upright 3 fights, 11 of 11 taps; the demo on its side 3 fights, 13 of 13; the alpha upright 3 fights, 12 of 12; the alpha on
its side 3 fights, 11 of 11. 12 fights inside, both layouts on every page and every way, all ended on AUTO, 47 of 47 tile taps (the
floor, a tool chest, wheel sets, drums, engine parts), 0 page errors; 8 more fights stayed in the yard outside, as the dice say. The
ceiling moves a pixel 1.7 to 2.4 of 255 on average.

## SAID PLAINLY
VOTE card combat4-the-rail-yards-shops-11-22 (stand_in): the engine shop and the freight house from the fight's camera, and a real
fight in the engine shop on the alpha on its side. The pictures are stand-ins (a container for an engine, a garage rail for a
platform) until COOK draws them; the ground's rules are real.
