# THE MISSING REAL PLACES (WORLD TEN, 11/6; VAMILY rules 409(c) and 411; ask line 458)

## HIS WORDS
Paolo 11/5: "I want you to research every building type in Pocket City 2 and like the eight different genres that they have
buildings for and see if you're missing any of those buildings." The check is records/BOHEMIA_PAOLO_POCKET_CITY_2_BUILDINGS_AGAINST_OURS_11_5_26.md
(Pocket City 2 is a checklist of building kinds only, rule 409(b): never its look, rules or fantasy pieces).

## WHAT WAS BUILT (in rule 409(c)'s order, as far as one round went)
Each is a REAL Las Vegas place in the collapse at its real spot. The one list a modder edits: records/target/bb/real_places.json.

| # | place (map name) | Pocket City 2 kind | where, real | where in the game | its use |
|---|---|---|---|---|---|
| 1 | TULE SPRINGS LAB | eco research lab | the fossil beds' south-east edge (36.305 N, 115.235 W); the beasts law s3 puts the lab on the bones | region block 32,-2, open desert, 6.1 h on foot from the city | fortress, fight ground; a settlement screen on arrival; its own finds (a cryo tray's coolant cell, tranquilliser darts, feed pellets, lab tape); the den is 8 blocks off |
| 2 | THE BANK | bank | Valley Bank Plaza, 300 S 4th at Bridger (1975, the state's tallest office building then; now Tower 300) | the valley: downtown by the courts, every seed | settlement screen; scavenge (safe deposit boxes); fights on downtown's board (the strip kind) |
| 3 | UNEMPLOYMENT OFFICE | employment center | Nevada JobConnect, 3405 S Maryland Pkwy (DETR's office is 2800 E St Louis) | the valley: nine blocks east of the Strip at its middle | settlement screen (the line round the block: where a company finds men who need work); scavenge |
| 4 | HOME CENTER (x2) | home improvement center | the big-box hardware stores on the mile-street corners (no one address) | the valley: one east side, one west side | settlement screen; scavenge (tape, seed, a lantern battery) |
| 5 | CLARK STATION | power plant | Edward W. Clark Generating Station, Whitney (36.1106 N, 115.0987 W): gas, 1,102 MW, first unit 1954 | the valley: sixteen blocks east of the Strip, a little south of its middle | settlement screen; fights on the plant ground (solar_and_pumps); scavenge |
| 5b | LENZIE STATION | large power plant | Chuck Lenzie Generating Station, Apex (36.3837 N, 114.9218 W, GEM): gas, about 1,100 MW | region block 105,-25, by APEX, 12.1 h on foot | fortress, fight ground; settlement screen; finds |
| 6 | SHARK REEF | aquarium | Shark Reef Aquarium at Mandalay Bay, the Strip's south end | the valley: the resort row south of Luxor | settlement screen; the Strip's board; scavenge |
| 7 | ANIMAL SHELTER | animal shelter | The Animal Foundation, 655 N Mojave Rd (Nevada's largest shelter) | the valley: east of downtown | settlement screen; scavenge; the dog in the company starts here (a NOTE) |
| 11 | THE MOB MUSEUM | museum | 300 Stewart Ave, the 1933 federal courthouse (the Kefauver hearings, 1950) | the valley: downtown, a block north of the civic core | settlement screen; the Mob's own temple (FACTIONS may read it); scavenge |
| 11 | NATURAL HISTORY MUSEUM | museum | Las Vegas Natural History Museum, 900 on the Boulevard North, by Cashman Field | the valley: by Cashman Field | settlement screen; where the lab's science is written on the walls (the T. rex the labs could never bring back) |
| 12 | CHANNEL 8 | news station | KLAS-TV, 3228 Channel 8 Dr (on the air 1953) | the valley: east of the Strip at Desert Inn | settlement screen; the feed's other voice (FEED may read it) |

Every one: a first-arrival feed post in its own voice (draft words), its own finds (each one of the six goods, draft words).
NOT BUILT THIS ROUND (rule 409(c)'s order, honestly): 8 the ranch and the greenhouse, 9 the bus yard (the RTC yard's address
did not verify), 10 the campground and RV park, and the smaller ones (public works yard, rec center, scrap mill, fishing dock,
indoor amusement park, billboards). They are the next round's, same file, same machinery.

## HOW IT IS BUILT (one list, the generator's own way, nothing else moves)
- THE LIST: records/target/bb/real_places.json. A valley place carries a SEAT said against the valley's own real pieces
  (the Strip, the courthouse, Cashman Field, Luxor; the valley rolls its east-west mirror and its turns, rule 344), a LIKE (the
  kind whose kit art, plot and paint it borrows until COOK FOUR's golden piece, rule 408), a GROUND (the fight board's) and a
  category. tools/bohemia_world_ten_real_places_sync.js writes the seats into engine/bohemia_overmap.js between its two DATA
  lines; the gate fails if they ever differ.
- THE GENERATOR (engine/bohemia_overmap.js __THE_MISSING_REAL_PLACES__): nine new map kinds (bank, jobsoffice, hardware,
  powerplant, aquarium, shelter, mobmuseum, natmuseum, tvstation). The layout lists each place's clear blocks nearest its real
  spot (the FACTORY LAW nudger's own clear test, never on a half-mile collector, off the rim); then, LAST OF ALL, on the finished
  valley, each is stamped on the first that is ordinary ground (a home, a shop, a lot, downtown, the resort row) with a street
  beside it, never touching another. The block keeps what it was (t.was).
- A TOWN WAS BUILT FIRST: MEASURED, stamping changed the faction seats on 4 of 10 seeds (16 of 140 seats moved; the seat placer
  is order-dependent), which would have moved an old save's towns. FIXED: engine/bohemia_towns.js districtsOf reads t.was, so the
  seats are chosen from the same valley as before (0 of 140 moved). MEASURED next: a seat's painted ground then covered 101 of
  1,200 places across 120 valleys. FIXED: restampRealPlaces moves any place on a town's ground (and the block round it) to its
  next clear block; the page does it once a valley after the towns (slices/bohemia_real_places.js settle()), and asks the
  painting again. 0 under a town, 0 unseated, the worst 11 blocks from the real spot (93% within 5).
- THE TABLES (each place on the kind it is like): the kit's taxonomy (engine/bohemia_district_kit.js), the kit plots
  (engine/bohemia_world.js DISTGEN), the fight's grounds (engine/bohemia_boardterrain.js FROM; records/target/BOHEMIA_BOARD_TERRAINS.json
  and BOHEMIA_BOARD_KINDS.json regenerated by their own tools), the shell's nfKind in the alpha and the demo and its mirror
  (engine/bohemia_boardkinds.js RULES: no new catch-all, the ratchet holds at 24), the scavenge (engine/bohemia_scavenge.js
  SEARCHABLE, and findsOf(kind or id): the file's own finds, loaded by the engine itself in node and in a page), the map's paint
  families (slices/BOHEMIA_CITY_WORLD.html vbClass/vbSubOf).
- THE REGION'S TWO: tools/bohemia_world_region.py PLACES (re-run; engine/BOHEMIA_REGION_LAND.json is that tool's output, 36
  places now). The region's own machinery draws them with the settlement art, names them, and opens them on arrival.
- THE USE ON THE MAP (slices/bohemia_real_places.js, loaded after bohemia_region.js, wrapping by name): the name plate (only
  once a block is 20 px or wider, never on another name: the map's own taken/free list, never through the fog), the tap (the
  plate and the block answer like a town's, MAP_TOWN_HIT), the screen (loopTownAt answers the place, so arriving opens the
  settlement screen with the place's own kind as its district, so SCAVENGE searches the place's ground), the post (the first
  arrival, one draft post).

## WHAT IS NOT LIVE YET, SAID PLAINLY
- The place's OWN finds are in the data and served by BohemiaScavenge.findsOf; the settlement screen still deals the six goods
  evenly (its scavenge() picks from FIND). One marked line in slices/BOHEMIA_SETTLEMENT_SCREEN.html reads them: RUN TWO's (RUN
  FIVE is in that file this round, so this lane did not touch it). NOTE on RUN TWO's board.
- The pictures are the like-kind's kit art (a roof block for the bank, the resort's for Shark Reef). COOK FOUR's golden piece
  for each (rule 408) is owed; no placeholder was registered in the VOTE tab as a candidate.
- Jobs to these places (WORLD 9's board mix): not touched. The ids are in the file for WORLD 9 to deal from.
- The lab's story beat (what broke out, read on its walls) is DYNASTY's lore and QUESTS' research; the ids are there.

## SOURCES
Valley Bank Plaza: vintagelasvegas.com (1975 post), skyscraperpage.com/b5125. JobConnect and DETR: legalconsumer.com's Clark
County listing, news3lv.com. Clark Station: en.wikipedia.org/wiki/Edward_W._Clark_Generating_Station, NV Energy's Clark fact
sheet. Lenzie: en.wikipedia.org/wiki/Chuck_Lenzie_Generating_Station, gem.wiki. The rest from their own sites, in the file.
The RTC bus yard's address did not verify, so the bus yard waits.

## GATES
gates/the_missing_real_places_gate.js (node legs R1 to R9, the demo legs R10 to R15); the touched ones are listed in the
handoff with their numbers.
