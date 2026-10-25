# COOK [every town looks its own] (rule 186(b)) and line 8 of his list (the towns part of the map, never stickers; rule 154)
# BUILT 10/25, NOT YET SEEN (rule 179)

## HIS WORDS
"every settlement has to look unique and different a little bit. You know if I understand the frontiers of settlements and they can
borrow from each other, especially if they're in the same tier, but still like they'll look the same... if there's a settlement
that's deep in the heart of the city like it should give more like city vibes... all the settlements just have to look a little
more unique" (rule 186, 10/25). And, asked many times: the towns sit in the ground, never a sticker (rule 154). EYES 10/25 and the
coordinator: line 8 NOT SEEN, "Blues on the map is a flag and a lot inside the blocks" (records/eyes_every_ask_10_25/q08).

## WHAT WAS WRONG (measured on BUILD 10/25, tools/bohemia_cook_every_town_its_own_10_25_26.js)
- A town was the CITY'S OWN SUBURB inside a ring: the painter (a6e1ad1d) drew a fortress's concrete wall, a town's junk ring or a
  camp's wrecks, cleared a band round it, and left the city's houses standing inside. A camp was a cleared lot, a few tents round
  a fire. Blues, Custom, Trades, Colorful and Homeless were the same suburb inside different rings.
- A FLAG stood over every painted town, the faction's colour on a pole: the thing that read as the town was the flag.
- The likeness of the old towns' pictures, colour alone: the most alike pair 0.969 (Anarchists and Blues), the median 0.81.

## WHAT IS BUILT (slices/BOHEMIA_CITY_WORLD.html, __EVERY_TOWN_ITS_OWN__)
Every home base (14) and every place on the region's land (34) is built from ITS OWN PLAN, rolled once on its name, and the map's
painter draws that plan in its own texels, light and shadows, at every zoom (the same painter as the city: a town is never laid
over the map, it is the map there):
- WHERE IT STANDS: u, the city's weight in the nine by nine blocks round it (towers, casinos, the Strip heavy; works and shops
  middling; a suburb light). The heart (u >= 0.6: Church 1.0, Mob 1.0, Reds 0.95) is concrete boxes four to nine storeys wall to
  wall, plant and tanks on the roofs, signs, awnings on the street: 5.5 to 5.7 T tall on average. The edge (u < 0.3: Blues,
  Caravans, Anarchists, Cartel, Remnants, Homeless, Custom, Colorful, Trades) is shacks of tin and plywood, lean-tos, containers,
  trailers, houses built up, watch posts: 0.9 to 2.4 T. Network (0.45) and Volunteers (0.39) between.
- ITS TIER: a fortress dense and walled with corner towers and gates; a town ringed in what was to hand with a market square;
  a camp loose, living on its streets the way a Las Vegas encampment does (tents and lean-tos the length of both sidewalks, the
  middle lanes kept), its edge running out into the lots round it.
- ITS FACTION: its own colour faded (rule 159) on a share of its tarps, awnings, a hall's roof, a tower's crown; never a whole town.
- ITS TRADE, one landmark on its middle block: Church a nave and steeple, a parish hall, graves, a soup line; Network a mast and
  dishes behind a fence; Remnants three cell blocks and guard towers; Mob a casino tower stepped on its podium, its sign; Caravans
  semis in rows under a canopy, a fuel tank; Cartel storage rows behind a dark wall, a watchtower; Homeless a rust tank over the
  tunnel mouths, under blue tarps; Trades a sawtooth shop and a crane, scrap; Volunteers a clinic in a cross, its landing pad,
  tents; Reds a bank tower with its crown; Blues the co-op's hall, greenhouses, a wind turbine, a rain tank, the beds; Anarchists
  a stage in a ring of burnt cars, a painted wall, burnt cars across their streets; Colorful a hall in its colour, tents; Custom
  the crew's own shop and yard. The region's places by what they were (Ivanpah's power tower in its mirrors, Creech's hangars,
  the marinas' boats on the mud, the quarry towns' spoil); two places of one trade take its variants in turn.
- ITS PALETTE: its own materials from where it stands (the heart's warm Las Vegas concrete and tar, the edge's stucco, tin and
  plywood), its own value and a little warm or cool, rolled on its name.
- NO FLAG stands in for a town (mapBaseDraw, painted and region branches). Its name and its people at the gate say whose it is.

## MEASURED AFTER (the demo, his phone 390 x 844 and a computer 1440 x 900)
- THE LIKENESS of every pair of the 48 (0.35 colour + 0.35 what stands + 0.15 heights + 0.15 fullness): the most alike pair now
  0.804 (two small region camps, Corn Creek and Overton), the most alike home bases 0.795 (Church and Mob, both the heart); the
  median about 0.46. Colour alone, like for like with before: home bases' most alike pair 0.969 -> 0.869, median 0.81 -> 0.60.
- THE CONTROL: a town built twice the same way (the same rules, blocks, faction, trade, palette and landmark, only its lots
  rolled again) scores 0.93 to 0.96 against itself. The gate's line, 0.85, sits between the two.
- A TOWN, NEVER A LOT: the lots carry 0.735 to 0.96 of the ground a lot can stand on in every town.
- No flag drawn over a painted town at the opening and the near stops; nine towns painted in at the opening.
- No rainbow, never grey: every town's median colour 2.7 to 14.3.
Pictures (the game's own camera, every town at the opening, mid, step and near stops):
records/target/cook_towns/final/sheet_<opening|mid|step|near>_computer.jpg and sheet_<step|near>_phone_portrait.jpg; all 48 drawn alone side by
side: records/target/cook_towns/final/every_town_alone.jpg; every town's look for the
settlement screens: records/target/cook_towns/BOHEMIA_EVERY_TOWN_ITS_OWN.json.

## SAID PLAINLY: WHAT THE FAR ZOOMS SHOW
At the opening and mid stops a town is a few blocks at its true size (rule 102), built into the city: no plate, no frame, no flag.
From that far it is told by its people and its name; its own look reads from the step stop in. That is the rule, not a miss.

## THE GATE
gates/every_town_looks_its_own_gate.js (EVERY TOWN LOOKS ITS OWN, in the suite): every pair under 0.85, the twin over it, every
town built with its landmark and its lots carrying 0.55 of its ground, the heart twice as tall as the edge and mostly concrete
boxes, no flag over a painted town, no rainbow and never grey. 8 of 8.

## FOR RUN TWO (NOTE on their board): the settlement screens follow this file: where each town stands, its trade and landmark,
its palette (roof, tin, its colour, its tarps), what stands there, how tall.

## REFERENCE CHECK (the 9/4 standing duty)
Battle Brothers' world map: every town its own drawing from where it stands and what it does (a walled town's keep, a fishing
village's huts on the shore, a mining camp's spoil), its banner beside it; ours keeps the "own drawing" and drops the banner
(rule 143(f), 154). Real Las Vegas from above: downtown's blocks wall to wall, the north valley's ranches in yards, the truck
stops' canopies and trailer rows on the 15, the encampments along the sidewalks of Foremaster Lane under blue tarps.

## NOT DONE, SAID
EYES has not seen it (rule 179). The towns' footprints stay their tier's (2, 3, 4 blocks); WORLD's [the three sizes of place]
owns the sizes. A camp at the far stops is small: true size.
