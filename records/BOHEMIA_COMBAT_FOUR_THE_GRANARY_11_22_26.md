# COMBAT FOUR: THE GRANARY (BUILD 11/22 - THE GRANARY)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). THE GRANARY, Paolo's own place (7/6/26, engine/bohemia_overmap.js): 'the oldest building in the world, a dead grocery
distribution center recommissioned. Harvest storage, seed stock, and the cold rooms double as the MEDICINE VAULT.' One of the
legendary gear places, guarded. Its fights were fought on the street outside it. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22v)
A fight at the granary was fought outside it: 'granary' is in the plant family (engine/bohemia_boardkinds.js: 'A COMPOUND: a wall with
one gate, tanks and sheds inside it'), which has no board of its own, so the fight dealt the street blocks. The granary keeps its one
cell on the map in 38 of 40 valleys.

## THE FACTS IT IS BUILT ON
- Paolo's words above, the map's own comment; one cell by the rail.
- The dead's own line for the kind (engine/bohemia_dead.js): 'guarded the grain to the end'.
- A grocery distribution center is a hall of pallet racking in long rows with aisles between, dock doors along its side, forklifts,
  and its cold rooms: walk-in freezers and coolers behind insulated walls a foot thick, the refrigeration plant beside them. Grain keeps
  in sacks on pallets and in bins; seed in crates; medicine that must stay cold in the cold rooms while their power lasts.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/granary/granary.json`, the thirty-fifth in `slices/fight_ground/insides.json` (eight fights in
ten at the granary's cell, by the cell's own dice; the rest at its docks). No new rule code; the ceiling is the warehouse's roof
('joist', a stand-in, at 10%).
- `the_grain_hall`: six long rows of pallet racking loaded with the harvest (they hide a man), the aisles between with sacks of grain
  on pallets and the seed stock in its crates (cover), spilled grain (rough 3 AP, low cover), the guards' sandbags across the aisles
  (low cover), THE GUARDS' CAMP in the middle aisles (they guarded the grain to the end: cover), forklifts (cover), steel grain bins in
  the four corners (they hide a man); the dock doors on both sides and the bottom, two fires.
- `the_cold_rooms`: four cold rooms behind their insulated walls (they hide a man), their doors; inside each THE MEDICINE VAULT'S shelves
  (they hide a man), carts of boxed medicine (low cover) and the melt water standing on the floor (STANDING WATER: Battle Brothers'
  swamp, 4 AP, a man in it fights worse); the hall between with the refrigeration plant (it hides a man), the dispensing counters,
  seed crates (cover), sandbags and carts (low cover), the guards' camps; doors on both sides and the bottom, two fires.
- 18 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the racking, the vault and the cold rooms' walls its
  wall, the bins and the plant its boulders, the spilled grain its brush, the sandbags its palisade waist high, the melt water its
  swamp); 15 pieces with the walls, all stand-ins painting at least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH
  GROUND. No line rewritten (465); the tiles' tap lines are new, draft. Who holds the granary and what the vault holds are FACTIONS',
  WORLD's and ECONOMY's; nothing of it is built here.

## THE GATE (gates/the_big_insides_gate.js: 613 passed, 0 failed over thirty-five insides, in its two halves (319 in 285 s, 294 in 269 s); the granary 21 of them alone, in 40 s)
36 of 40 fights at the granary's cell go inside (the share 0.8); 24 of 24 fights to the end on AUTO (8.2 rounds), nobody of 288 stood a
whole fight; 10% of men on the bare floor after round one against 27% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 STANDING WATER IS SWAMP: a man of his on the melt water is struck at 20% where the same tile dry reads 10%; I12 the
racking, the cold rooms' walls and the plant hide a man; I13: 12 stand-in pieces, each painting at least 9% of a tile.
MY FIRST CUT, MEASURED AND CHANGED: 20% bare after round one (the grain hall 29% one way): the racking's middle cross aisle and the cold
rooms' hall were open floor. Sacks, seed crates, spilled grain, sandbags, carts and counters went into them: 10%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:granary, C3_INSIDE=granary, through the map's own door)
One cell a valley, so one fight a run, and the cell's own dice send one fight in five outside: of 11 runs, 7 met a valley that rolled the
fight outside (the works yard, 0 page errors) and 4 went inside: the demo on its side 3 of 3 taps (the floor, grain sacks, spilled
grain), the demo upright 7 of 7 (spilled grain, seed crates, the floor, sandbags), the alpha on its side 6 of 6 (the floor, a fire,
seed crates, sandbags), the alpha upright 8 of 8 (sandbags, the floor, grain sacks, spilled grain). 4 fights inside, all THE GRAIN HALL,
all ended on AUTO, 24 of 24 tile taps, 0 page errors. THE COLD ROOMS are seen on the fight page opened alone (the card's top right) and
in the gate (24 boards). Run two at a time.

## SAID PLAINLY
VOTE card combat4-the-granary-11-22 (stand_in): the grain hall and the cold rooms from the fight's camera, and a real fight in the grain
hall. The pictures are stand-ins (a casino's screens for the racking, bales for grain sacks, a camp for the guards' camp, an elevator
core for the vault's shelves) until COOK draws them; the ground's rules are real.
