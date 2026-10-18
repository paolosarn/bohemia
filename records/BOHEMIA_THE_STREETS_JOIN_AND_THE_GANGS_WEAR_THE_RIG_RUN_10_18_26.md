# THE STREETS JOIN, AND THE GANGS WEAR THE RIG (RUN, 10/18, BUILD 10/18c)

Rows: RUN [the districts connect on the map] (first), RUN [the demo wears the rig] (second).
His words: "the districts are looking like shit, the streets looking like shit, doesn't look like shit's
connected that smart like it should" (the map's card); "is the demo changing, I liked the robot" (rule 115g).

## 1. THE DISTRICTS CONNECT ON THE MAP

MEASURED BEFORE ANYTHING WAS DRAWN (the demo's own map, the one driver):
- The valley's street network was NOT broken: 3,483 road blocks (arterial 2,434, freeway 952, strip 81,
  interchange 16), ONE 4-connected piece.
- What broke is the picture. Every road block is its own baked tile with little lanes and lots inside it; the
  lanes never meet the next block's; and the asphalt sat at the same grey value as the suburbs' roofs
  (arterial 26% of the map, suburb 28%). So no street read as a line that runs, and no district started or ended.
- Out past the rim, 31 of the 34 region places stand ON a road (3,298 road blocks in WORLD's pass grid), but the
  roads were only the land picture's faint lines, so every town read as a stamp on sand.

WHAT CHANGED (slices/BOHEMIA_CITY_WORLD.html, slices/bohemia_region.js):
- __THE_STREETS_JOIN__: each road block draws, RIGHT AFTER its own art (so a building in front still stands in
  front), a band from its middle to the middle of each shared edge with a road neighbour, flat-ended there, so the
  two halves meet exactly. Asphalt #34322f with the sidewalk's tan #a39a84 as the kerb; freeways wider (#2a2927)
  with a faded centre dash; a deck rises with the overpass and a street that dips under it dips. A street meeting a
  freeway is a street (an on-ramp). Off under 6 px a block (the far end's own city picture).
- __THE_DISTRICTS_READ_APART__: one quiet cast per district family over its own art (source-atop, made once per
  picture): homes warm tan (his "roofs more tan, never bright orange or metal blue"), shops and offices cool dust,
  industry rust, towers and roads untouched.
- __THE_ROADS_OUT_JOIN__: the region's road blocks drawn as the same band, joined at the rim to the valley's roads;
  a block with two links at a right angle draws the straight cut between its two edge middles, so a staircase of
  blocks reads as ONE diagonal highway; the three places off a road (Apex Landfill, Tule Springs, Gypsum Cave) get a
  dashed dirt track to the nearest road.
- All three paint inside the cached map ground (painted once per zoom, never per frame while the camera slides).

COST, one fresh ground paint on this box (noisy, single runs, before then after): zoom 1.21 134-180 -> 153-179 ms;
2.4 113-175 -> 141-206 ms; laptop 1.21 135 -> 163-202 ms; 0.3 98-135 -> 92-123 ms. Up to about 30 ms a paint at the
closer zooms; the cache means a paint per zoom change, not per frame. [the long freeze] still owns the paint's cost.

PICTURE: slices/vote/RUN_THE_STREETS_JOIN_10_18.png (tools/bohemia_run_the_streets_join_shot.js): phone middle
zoom, phone one step closer, phone pulled out to the roads out, laptop middle zoom; before and after each.
VOTE run-the-streets-join-10-18.

## 2. THE DEMO WEARS THE RIG: THE GANGS

YES SINCE THE LAST CUT (the registry's verdicts): character-the-thirteen-through-the-rig-10-18 UP ("Nice direction
very good not final"), cook3 thug and marksman UP, the wolf redone UP, the rig props UP.
THE MAP'S ROAMING PARTIES ARE THE THIRTEEN GANGS (MAP_ART.fac, the same thirteen names as CHARACTER's rig folders),
and they were drawn from the street's twelve generic cast bodies under a coloured flag. So each party now wears its
own gang's rig model.
- tools/bohemia_bake_the_rig_cast.py packs CHARACTER's renders (records/target/character/rig) into ONE sheet:
  296 frames (13 gangs x 8 turns standing, plus a 6-key walk in 8 for the four gangs CHARACTER walked: Anarchists,
  Cartel, Reds, Trades), every frame on one ground line in a 72 x 131 cell, no resampling (one native pixel size),
  held to 256 colours with no dither (1.7 MB -> 366 KB; checked side by side at 2x, the same).
  slices/BOHEMIA_RIG_CAST.png + .json.
- __THE_GANGS_WEAR_THE_RIG__ (the city file): fetched the first time a party is drawn, never at the door; each
  gang's set cut once into the cast's own frame (112 wide, feet at 0.93), so mapPersonDraw draws it at the cast's
  size, the same height as the people beside it. Until the sheet lands, and for a party with no gang, the cast.
- Seen on the demo after six hours of clock: 18 parties out, 30 of 32 party people drawn are rig people.
- NOT CHANGED: his own company (his origin crew, not a rig asset with a YES), the crowds at the places (no gang
  named), the fight (COMBAT's). The wolf waits for a fight with beasts; the props for a lane that places them.

PICTURE: slices/vote/RUN_THE_GANGS_WEAR_THE_RIG_10_18.png (tools/bohemia_run_the_gangs_wear_the_rig_shot.js): the
Reds, the Cartel, the Anarchists and the Trades on the road, before and after at the closer zoom.
VOTE run-the-gangs-wear-the-rig-10-18.

## ALSO
- tools/bohemia_drive_the_demo.js: the 'computer' profile threw at the door (it tapped a touchscreen the context
  does not have); a mouse click there now. The laptop picture needed it.
- THE CUT: BUILD 10/18c - THE STREETS JOIN, THE GANGS WEAR THE RIG.
