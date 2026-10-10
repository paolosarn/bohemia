# COOK FOUR [the house skins back on the map], round 1 (10/10/26)

The map's near stop shows each block's hero picture one art pixel to one device pixel. The 'suburb' and 'town'
heroes (slices/BOHEMIA_CITY_TILES_02.js) were flat-shaded grey 3D boxes. tools/bohemia_cook4_map_houses.py rebuilds
both as isometric houses whose every face is one of his thirty approved house skins projected on to the box:
stucco walls with their windows and doors, clay roofs (terracotta, desert brown, grey brown), gravel flat roofs on
the town's shops, desert-tan / mojave-gold yards, and a street from his cracked street pack. Paint is light only:
one sun from the north-west, faces shaded by which way they look, shadows thrown south-east.

DROP-IN: same names, same canvas (256x154, 256x160), same plate pixels; HERO_ANCH and HERO_PLATE hold unchanged.
Output slices/cook4_map_houses/ (suburb.png, town.png, map_houses.json). TAKER: RUN (HERO_SRC lives in the tile
chunks, built by tools/bohemia_city_chunk_tile_bank.py; RUN's to swap). NOT LIVE until DIRECTION passes it (rule 87).
Twin: slices/vote/COOK4_THE_HOUSE_SKINS_ON_THE_MAP_TWIN.png (the live heroes left, the skin-built ones right, 2x).

Three differences I see myself:
1. One skin cell is 16 px on the map, so a window is a dark square; the pack-level detail is not there at this scale.
2. The town is crowded; it wants one open lot or a parking apron on the street.
3. No props yet (a car in a driveway, a carport, a palm): the heroes read empty at the near stop.

## Round 2 (10/10, cook4)
- Props from his packs (UP-only): wrecked cars on the street and in driveways (9. Abandoned cards), dead trees
  (16. Dead trees and plants), one burn barrel per block; each with a small shadow.
- The town gets an open lot where a house was, with two parked cars and the burn barrel.
- The TRAILER hero (256x138) rebuilt: single-wides in rows from the wall skins with gravel roofs, a dirt lane, cars.
- Twin sheet redrawn with all three (live left, skin-built right, 2x). Still at DIRECTION; TAKER RUN.
