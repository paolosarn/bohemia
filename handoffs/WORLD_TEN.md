# WORLD TEN (one file per lane, written only by WORLD TEN; newest block on top)

WORLD TEN (11/6, chat 02b, the map's places; VAMILY rules 409(c) and 411; ask line 458). BUILD 11/6b - THE MISSING REAL PLACES.
BUILT, NOT YET SEEN.
- WHAT: Pocket City 2's missing building kinds as REAL Las Vegas places at their real spots, each with a use. Twelve places, one
  list a modder edits (records/target/bb/real_places.json). ON THE VALLEY, nine new map kinds the generator seats on every seed:
  THE BANK (Valley Bank Plaza, 300 S 4th, by the courts), UNEMPLOYMENT OFFICE (JobConnect, Maryland Pkwy), HOME CENTER x2 (the
  big-box hardware stores, east and west), CLARK STATION (the valley's gas plant at Whitney, 1954), SHARK REEF (the resort row
  south of Luxor), ANIMAL SHELTER (Mojave Rd), THE MOB MUSEUM (the 1933 courthouse), NATURAL HISTORY MUSEUM (by Cashman Field),
  CHANNEL 8 (KLAS, Desert Inn). ON THE REGION: TULE SPRINGS LAB (the fossil beds, the beasts law s3) and LENZIE STATION (Apex).
- USE: every one opens a settlement screen on arrival (the screen gets the place's own kind as its district, so SCAVENGE searches
  it), a first-arrival feed post (draft), its own finds in the data (each one of the six goods), a fight board by the kind it is
  like. Valley ones are named on the map once a block is 20 px wide, tap their plate or block to walk there.
- HOW: engine/bohemia_overmap.js __THE_MISSING_REAL_PLACES__ (the DATA block is written by tools/bohemia_world_ten_real_places_sync.js
  from the file; seatRealPlaces in the layout, stampRealPlaces LAST on the finished valley, restampRealPlaces off the towns'
  ground). A TOWN WAS BUILT FIRST: measured, stamping moved 16 of 140 faction seats; engine/bohemia_towns.js districtsOf now reads
  t.was, so 0 move (old saves keep their towns); a town's ground then covered 101 of 1,200 places, so the page moves them off it
  once a valley (slices/bohemia_real_places.js settle(), the painting asked again). Tables: kit taxonomy, DISTGEN aliases,
  boardterrain FROM, boardkinds RULES + the alpha's nfKind (demo re-cut), scavenge SEARCHABLE + findsOf, the map's paint families.
  Region: tools/bohemia_world_region.py PLACES, re-run (36 places). Record: records/BOHEMIA_WORLD_TEN_THE_MISSING_REAL_PLACES_11_6_26.md.
- GATE: gates/the_missing_real_places_gate.js (R1-R9 node, R10-R15 the demo). Numbers in the commit.
- NOT DONE (409(c)'s order): the ranch and the greenhouse, the bus yard (the RTC yard's address did not verify), the campground and
  RV park, the smaller ones. Same file, same machinery: add a place, run the sync tool, re-inline the generator.
- NOTES OWED TO OTHER LANES (nothing of theirs touched):
  RUN TWO: slices/BOHEMIA_SETTLEMENT_SCREEN.html scavenge() picks one of FIND evenly; one marked line there can read
    BohemiaScavenge.findsOf(S.place.district) (a list of {says, good}) so the bank's box and the lab's darts are found there.
  WORLD 9: the ids are in the file for the board mix (a job to the vault, the line at the jobs office, the lab).
  COMBAT 8: the new kinds reach the fight with the board kind of their like (bank on the strip kind, Clark on landfill); a vault
    board and the Shark Reef tunnel are yours if wanted (ours.board_grounds.districts takes a list per district).
  COOK FOUR: each place's golden piece (rule 408); today they wear their like's kit art.
  FACTIONS / DYNASTY / FEED / HIRES: the Mob Museum (the Mob's temple), the lab and the museum (the lore), Channel 8 (the feed's
    other voice), the shelter (the company's dog) carry ids for you.
- RE-INLINED: the generator in slices/BOHEMIA_CITY_WORLD.html and slices/BOHEMIA_RUN_CURRENT.html; the district kit and world.js
  where they were verbatim; towns.js in the city page. The generic resync (tools/bohemia_city_module_resync.py) refuses on
  engine/bohemia_followers.js's missing closing banner (not mine, PEOPLE's line on the front page), so the swaps were done by
  each module's old body, verbatim.
