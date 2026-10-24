# COOK -> RUN: THE MAP IN COLOUR, THE PART THAT IS CODE (10/24/26)

Rule 137 (Paolo 10/24, LOCKED: 'the map still looks like shit, so we have to remake all the map assets, and let's be
careful having everything look like a grey yellow sand color, I don't want that to flood all of our art'); 137(c): COOK
runs the remake, RUN keeps the map's code. Rule 142 (the same hour): one map at every zoom, and COOK's remade pictures
are what it shows. This is the part of the map COOK cannot swap, because it is not a picture: it is colour constants in
`slices/BOHEMIA_CITY_WORLD.html`. Nothing here is edited by COOK.

## THE MEASURE (tools/bohemia_cook_map_colour_spread_10_24_26.js, the map's own canvas, the one driver)

The sand family (CIELAB L* 30 to 86, chroma 5 to 40, hue 45 to 105 degrees) on the glass, before this round:

| stop | czoom | sand | green | blue | red |
|---|---|---|---|---|---|
| far (the whole valley) | 0.214 | 78.8% | 0.5% | 0.7% | 0.1% |
| district | 0.5 | 66.0% | 1.1% | 0.9% | 0.1% |
| opening (where he lands) | 1 | 46.0% | 2.1% | 1.2% | 0.3% |
| step | 2.6 | 42.7% | 0.4% | 0.3% | 0.1% |
| near | 4.74 | 39.7% | 0.3% | 0.0% | 0.1% |

At the far stop almost all of the 79% is the FAR LAND (`vbCore`'s bake from `VB_COL`), not a picture: every one of its
fourteen colours but the road, the water and the shore is in the sand family. At the district zoom it is the far land
plus the painted far city (`VB_CCOL`, which RUN read off COOK's 10/23 pictures, and those were tan). COOK's district
pictures carry the opening and the near stops; they are being remade now (the after numbers go in COOK's record).

## 1. THE FAR LAND: VB_COL (the biggest flood on the map)

The real valley from the air is not one tan: grey-brown gravel fans, the red of the Calico Hills and Red Rock in the
west, black basalt on Frenchman and the Black Mountains, grey limestone on the Sheep Range and Mt Charleston with dark
pines near its top, white playas, Lake Mead's blue inside a white bathtub ring. Every value below was checked against the
measure's own sand test (none is in it; old -> new, chroma and hue in brackets):

| key | now | proposed | why |
|---|---|---|---|
| floor | #8f7d59 (sand) | #7a7470 (C 3.4) | grey-brown gravel, the fans' real colour |
| fan | #9b8762 (sand) | #8f665c (C 19, h 39) | the red-brown alluvium |
| low | #7e6b4f (sand) | #6c5650 (C 11, h 41) | the fans' shadowed toes |
| rock | #6a5843 (sand) | #874632 (C 36, h 43) | red rock |
| high | #5b4b3a (sand) | #363234 (C 2) | black basalt / desert varnish |
| crest | #a48e66 (sand) | #aaa6a2 (C 3) | limestone crests |
| brush | #5f5440 (sand) | #4c5c36 (C 24, h 124) | creosote, green |
| pebble | #b09c74 (sand) | #a29b98 (C 3) | pale gravel |
| shoulder | #5a5244 (sand) | #5a5654 (C 2) | road shoulder |
| water | #2f4a5e | #1f6290 (C 32, h 263) | Lake Mead blue |
| shore | #4e6d7a | #d2d0cc (C 2) | the bathtub ring |
| playa | #bcae8c (sand) | #dcdad6 (C 2) | a white playa |
| haze | #8a7a58 (sand) | #7a7572 (C 3) | the haze is dust, grey, never beige |
| road | #3d3933 | keep | |

Two more the land does not have yet and the valley does: `redrock_far` #9a4e36 (C 41) for the west side's faces (the
Spring Mountains' Calico band; the compass is already in vbCore, `C.w`) and `pine` #2f3f2e for the top of Mt Charleston.
Banding the ranges by side (red on the west, black on the east and south, grey on the north) is the one change that is
more than a swap of constants; RUN's call how.

## 2. THE PAINTED FAR CITY: VB_CCOL

`__THE_MAP_STANDS_UP__` (10/23) says the painting wears COOK's pictures' own palette read off
`slices/BOHEMIA_CITY_TILES_*.js`. Those pictures are changing family by family this round (`HERO_FROM` changes with
each), so the same read again, once COOK's round ends, gives the painting its colour: yards of lawn, red and grey gravel;
terracotta, charcoal and slate roofs; cream, peach, sage, white, blue, pink and mint stucco; blue pools; red rock and
basalt on the rim. The dials COOK paints from are data: `banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json` (`palette`); the
painting can read its colours from that file instead of copies, so the two never drift again.

Keys now in the sand family that the pictures no longer are: yard #8c7b63, yard2 #80705a, roofA #bba98e, roofB #aa997f,
line #7d725c, gold #a3916a, floor #90826b, pebble #b09c74, mark #857a62, wallG #8d8270, roofE #a08270, trailer #8f877a,
slab #8f877b, rust #74604f, dirt #6d6556, tie #6b5a48.

## 3. THE OLD FILL AND THE DIAMONDS

`__CITY_VOID__` fills `#8a7a58` until the land is baked: the same as the haze, so `#7a7572`. The per-district `dia()`
colours in `renderCity`'s switch only show for a frame before a picture decodes (and for the ten districts with no
picture: estate, airbase, airport, springs, strat, gated, sphere, highroller, luxor, sign); `desert #d8b078`,
`mountain #c8a068`, `fort #c8a878`, `estate #c8b088` and `town #b09a70` are all sand. Under rule 142 (one map) they
should not show at all.

## THE CHECK

`node tools/bohemia_cook_map_colour_spread_10_24_26.js <label>` measures the glass at the six stops and says PASS when
the sand family is a third or less at every one (rule 137(b)). It is not a gate yet; PLUMBER can make it one.
