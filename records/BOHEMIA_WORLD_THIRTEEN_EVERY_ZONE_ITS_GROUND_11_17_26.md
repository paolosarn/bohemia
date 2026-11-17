# WORLD THIRTEEN, ROUND SIX, BUILD TWO: EVERY ZONE ITS GROUND (11/17/26)

VAMILY rule 453(2); rules 429(a)(g); asks 504, 507, 508. BUILD 11/17zd - EVERY ZONE ITS GROUND. VOTE world13-every-zone-its-ground-11-17
(stand_in).

The coordinator 11/17: '(2) every zone's cells handed to COMBAT THREE with their ground so its open-map boards match the zone (the seam
in your handoffs).' COMBAT THREE's 11/17p THE ZONE IS THE BOARD deals a plain cell of a district that has a place that place's own
blocks; it reads FIGHT_OPTS.ground.district and .street.way.

## 1. MEASURED FIRST (22 valleys, and the demo)

- 51.0 in 100 of the map's 202,752 cells were map kinds a place board stands for. The rest dealt their kind's shared blocks: the mile
  streets (25 in 100 of every valley), the strip malls, the solar farms, the resorts, the apartment courts, the farms.
- ON THE DEMO (main): a fight the map hands over on a mile street in the open desert (no building within two blocks) carried
  district 'arterial' and street null; the shell named the fight after a nearby block ('school', 'park', 'trailer'), so the board was
  the suburbs' (cul-de-sacs, yards, lots) in the middle of the desert. The VOTE card's left picture.

## 2. THE BUILD

- THE TABLE: land_use.json's zones each name their place (strip: the Strip, downtown, industry: the works, suburb, cheap_edge: the
  trailer park, green: the golf course, open: the desert, water: the marina; mile_street 'beside'; transport, commercial and civic
  null: the freeway has its own board, the strip malls and the civic buildings deal their own blocks), place_by_district overrides
  one kind (truck stop the desert, the aircraft boneyard the airport, quarry and gypsum the pass, farm the wash). The one table
  (map_fight_kinds.json, written by tools/bohemia_world_thirteen_pieces.py) carries piece.deal.zone_place for each of the 88 map kinds;
  the fight-kinds engine re-synced.
- THE MAP (slices/BOHEMIA_CITY_WORLD.html, `__EVERY_ZONE_ITS_GROUND__`, vbZoneGround): the ground the map hands over now carries
  zone_place; for a road cell its land (the commonest kind beside it, ring by ring out to four) and the land's place, and its own way
  (ends, mouths, a house street's mouth kept); a dirt track's bits and way; and the four sides (the kind north, east, south and west).
- THE FIGHT (slices/BOHEMIA_FIGHT.html placeOwn, one marked line, COMBAT THREE's from here): a cell the map handed over deals the
  place its ground is (zone_place), ahead of the shell's district (a road cell's fight carries a nearby block's district). A place's
  own cell (opts.template) is untouched.

## 3. NUMBERS

- 22 valleys: 81.2 in 100 of the cells deal a place board's own ground (was 51.0), 10.8 the freeway's own board, the rest their own
  blocks (strip malls, civic). The mile streets: through the suburbs 13.9 in 100 of all cells, by the strip malls 3.8 (their own),
  through the desert 3.5, the works 0.8. 76,395 of 76,398 road cells carry their way; 718 of 718 track cells their way and bits.
- The fight, headless: 432 of 432 plain cells of 36 kinds with no place of their own dealt their zone place's own blocks (72 in 100
  of their blocks the place's, no landmark; apartments 35, the water park 44: their own kinds mix in by COMBAT THREE's share); 12 cells
  a kind, never two alike.
- The demo: a mile street through the desert is the desert's board (desert and wash blocks), upright and on its side.

## 4. GATES

- NEW gates/every_zone_its_ground_gate.js 14/0 (Z1 the table, Z2 22 valleys with the page's own vbZoneGround text, Z3/Z3b the fight
  deals it and not before, Z4 never two alike, Z5 three planted fails, P1/P1b/P2 the demo upright and on its side), in the suite.
- COMBAT THREE's own: A PLAIN CELL IS NOT THE PLACE 11/0, EVERY PLACE ITS OWN BOARD PASS, THE OLD LAYOUT THE NEW HOUSES 25/0, THE CREW
  STARTS ON ITS CELL 9/0. Mine: EVERY MAP KIND HAS ITS FIGHT ANSWER 22/0, THE PLACES ARE TEMPLATES 13/0.

## 5. THE SEAM (handoffs/WORLD_THIRTEEN.md, for COMBAT THREE)

FIGHT_OPTS.ground gains zone_place, land, sides, track, and street for road and track cells. The one marked line in placeOwn is yours.
Owed reads, yours to take: a road cell's own kinds (dealZone's mix) could come from ground.district (the road's own: stems, strip,
lots) or ground.land rather than the shell's nearby district; ground.sides could close a board's edge (water, the freeway's berm, the
mountain); a street's ends could close a dead end.

[bb] Battle Brothers fights a road on the terrain the road runs through; ours fights a mile street through the desert in the desert.
[analog horror] the same four lanes, out past the last house, and the sand already over the paint.
