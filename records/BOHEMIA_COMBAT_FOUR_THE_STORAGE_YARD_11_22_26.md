# COMBAT FOUR: THE STORAGE YARD (BUILD 11/22 - THE STORAGE YARD)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The self-storage yard (the map's kind 'storage', about forty cells a valley), whose fights were all fought on the works yard.
Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22q)
A fight at a storage yard was fought on the board of the kind it is like ('storage' is in the works yard's family, engine/
bohemia_boardkinds.js 'landfill'), never inside. The map lays 40.2 storage cells a valley (28 to 53, in 40 of 40 valleys: the most
common place this lane has given an inside to).

## THE FACTS IT IS BUILT ON
- The map lays self-storage along the streets ('self-storage sprawl', engine/bohemia_overmap.js) and gives it a share of every works
  zone (LAND_USE industry: industrial 0.5, warehouse 0.35, storage 0.15).
- The dead's own line for the kind (engine/bohemia_dead.js): 'people lived in the units. some never opened again'.
- A self-storage yard is a climate-controlled building of units off long halls (roll-up doors, a freight lift, hand carts by the
  doors), drive-up rows outside, and, in Las Vegas, RV and boat parking under steel canopies. People living in storage units and in
  stored RVs is a real thing when the rent runs out.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/storage/storage.json`, the thirty-second in `slices/fight_ground/insides.json` (two fights in five
at a storage cell, share 0.4: the rest in the drive-up rows, on the works yard). No new rule code; the ceiling is the warehouse's roof
('joist', a stand-in, at 10%).
- `the_unit_halls`: runs of shut units back to back (the doors down and padlocked: they hide a man), units with the door rolled up (a
  steel box a man shoots out of: cover), units somebody lived in (a mattress, a camp stove, a life in boxes: cover), the halls between
  with stacked boxes and furniture pulled out (cover), hand carts (low cover) and units tipped out across the floor (rough 3 AP, low
  cover); the freight lift chained in two corners; doors on both sides and the bottom, two fires.
- `the_rv_canopy`: RVs in their stalls, boats on their trailers and two moving trucks (all of them hide a man), stored cars under
  their covers (cover), an RV's camp with its awning out (somebody lives in this one: cover), jerry cans and generators, stacked tyres,
  hand carts (low cover); the gate on both sides and the bottom, two fires.
- 19 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the shut units its wall, the open unit its palisade,
  the RVs, boats and trucks its boulders, a tipped-out unit its brush); 17 pieces with the walls, all stand-ins painting at least 9% of
  a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 559 passed, 0 failed over thirty-two insides, in its two halves (283 in 273 s, 276 in 242 s); the yard 20 of them alone, in 40 s)
17 of 40 fights at the yard's cells go inside (the share 0.4); 24 of 24 fights to the end on AUTO (7.0 rounds), nobody of 288 stood a whole
fight; 10% of men on the bare floor after round one against 20% with rule 428's leg off; every board's floor joined, both layouts dealt
both ways; I12 the tall things hide a man on both layouts (units, RVs, boats, trucks); I13: 15 stand-in pieces, each painting at least 9%
of a tile; I1: a road cell beside the yard went inside on 0 of 40, and the works yards' own place boards (place_works) are never taken.
MY FIRST CUT, MEASURED AND CHANGED: 25% bare after round one (the halls 26%, the canopy 27%): the halls' three cross aisles and the
canopy's middle drive were open floor, and the men who ran out of steps stood in them. Carts, boxes, a tipped-out unit and gear went into
them: the halls 12%, the canopy 10% (the gate's own count 10%). The RVs were first drawn as a container end on, a thin post on the board;
they are the container side on now (33% of a tile).

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:storage, C3_INSIDE=storage, through the map's own door)
13 fights inside of the 42 the tool walked to on storage cells (the rest rolled the works yard outside, as the dice say): the demo
upright 3 (the unit halls twice, the canopy), 10 of 10 taps; the demo on its side 3 (the canopy three times), 15 of 16; the alpha upright
4 (both layouts twice), 10 of 10; the alpha on its side 3 (the halls twice, the canopy), 10 of 10. All ended, 45 of 46 tile taps, 0 page
errors. THE ONE MISS: a tap on a fire read the fight's adrenaline line ('ADRENALINE: first next round for you') where the tile's word
would be: the fight's own notice on the same line at that moment, not the tile.
THE FIRST RUN, THROWN AWAY: four browsers at once on this box (load 27 on 4 cores) and the alpha on its side never got past the barber
(the character maker) before its first fight; its taps chose a haircut. Two at a time, the same way ran clean. Not a fault of the page.

## SAID PLAINLY
VOTE card combat4-the-storage-yard-11-22 (stand_in): the unit halls and the RV canopy from the fight's camera, and a real fight in the
unit halls. The pictures are stand-ins (a shipping container for a run of units, a camp for a lived-in unit) until COOK draws them; the
ground's rules are real. The yard is the most common place given an inside yet: about forty cells a valley.
