# COMBAT FOUR: THE FUEL DEPOT (BUILD 11/22 - THE FUEL DEPOT)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). THE FUEL DEPOTS, Paolo's own places (7/5/26, engine/bohemia_overmap.js, E. THE FUEL DEPOTS, 'name pending his pick'): 'the
city's two straws for gasoline... Both pipes dead at crash, both terminals were the most fought-over stockpiles of the hell years.'
Their fights were fought on the works yard outside. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651. THE NAME: the board is called
THE FUEL DEPOT, the kind's own word; the depots' names are still his pick (the map's note), nothing here names them.

## MEASURED BEFORE (main, BUILD 11/22w)
A fight at a fuel depot was fought on the board of the kind it is like ('fueldepot' is in the works yard's family, engine/
bohemia_boardkinds.js 'landfill'), never inside. The map keeps 60 depot cells over 40 valleys (37 valleys hold one or both).

## THE FACTS IT IS BUILT ON
- Paolo's words above, the map's own comment: CalNev (550 miles from LA, two pipes, 128,000 barrels a day, 90% of the fuel, ending at
  Nellis) by the rail north; UNEV (400 miles from Salt Lake, 60,000 a day, ending at Apex) beside the landfill corridor.
- The dead's own line for the kind (engine/bohemia_dead.js): 'the fuel fight'.
- A pipeline terminal is its tank farm, its pump house (the mainline pumps on their skids, the manifolds of valves that send each
  product to its tank, the meter skids, the control desk) and its truck loading rack: tankers in bays under a canopy, the loading arms
  on their risers, the drum line, the berms round it all.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/fueldepot/fueldepot.json`, the thirty-sixth in `slices/fight_ground/insides.json` (three fights
in five at a depot's cell, share 0.6: the rest among the tanks). No new rule code; the ceiling is the warehouse's roof ('joist', a
stand-in, at 10%).
- `the_pump_house`: mainline pumps in pairs (they hide a man), day tanks in the corners (they hide a man), two long manifolds across
  the room (cover), valve stands, meter skids and the control desks (cover), pipe runs across the floor (rough 3 AP, low cover), fuel
  drums (low cover), fuel slicks on the floor (Battle Brothers' swamp: 4 AP, a man in it fights worse); doors on both sides and the
  bottom, a fire somebody keeps far too near the fuel.
- `the_loading_rack`: tankers in their bays, three tiles long (they hide a man), the loading arms on their islands (cover), jerry cans
  in rows and fuel drums (low cover), sandbagged berms (low cover), fuel slicks; the bays open on both sides and the bottom, a fire.
- 17 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the pumps and the tankers its boulders, the day
  tanks its wall, the pipes its brush, the berms its palisade waist high, the slick its swamp); 14 pieces with the walls, all stand-ins
  painting at least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap
  lines are new, draft. Who holds the fuel, and what a barrel is worth, are FACTIONS' and ECONOMY's; nothing of it is built here.

## THE GATE (gates/the_big_insides_gate.js: 631 passed, 0 failed over thirty-six insides, in its two halves (319 in 287 s, 312 in 296 s); the depot 21 of them alone, in 63 s)
25 of 40 fights at the depots' cells go inside (the share 0.6); 24 of 24 fights to the end on AUTO (6.5 rounds), nobody of 288 stood a
whole fight; 13% of men on the bare floor after round one against 25% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 STANDING WATER IS SWAMP: a man of his on a fuel slick is struck at 20% where the same tile dry reads 10%; I12 the
pumps and the tankers hide a man; I13: 12 stand-in pieces, each painting at least 9% of a tile.
MY FIRST CUT, MEASURED AND CHANGED: 20% bare after round one (the loading rack 30%): the rack's middle lanes between the bays were open.
Drums, jerry cans and a berm went into them: 13%. The tankers were first drawn as a container end on, a thin post on the board; they
are the container side on now (33% of a tile), as the storage yard's RVs.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:fueldepot, C3_INSIDE=fueldepot, through the map's own door)
The demo upright 2 fights (THE PUMP HOUSE, THE LOADING RACK), 8 of 8 taps; the alpha on its side 2 (both), 10 of 10; the demo on its
side 2 (both), 5 of 5; the alpha upright 2 (both), 9 of 9 (the floor, the control desk, the manifold, valve stands, a fuel slick,
loading arms, drums, jerry cans). 8 fights inside, both rooms on every way, all ended on AUTO, 32 of 32 tile taps, 0 page errors. THE
VALLEYS: the depots are two cells in 37 valleys of 40; the demo on its side and the alpha upright took seven runs each to meet one that
had a depot whose dice dealt the inside (runs with no depot, or its fight on the works yard: 0 page errors). Run two at a time.

## SAID PLAINLY
VOTE card combat4-the-fuel-depot-11-22 (stand_in): the pump house and the loading rack from the fight's camera, and a real fight in the
pump house. The pictures are stand-ins (a bulldozer for a pump, a container for a tanker, a rack for a loading arm) until COOK draws
them; the ground's rules are real.
