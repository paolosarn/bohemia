# COOK -> RUN: THE MAP IN COLOUR, THE PART THAT IS CODE (10/24/26)

Rule 137 (Paolo 10/24, LOCKED: 'the map still looks like shit, so we have to remake all the map assets, and let's be
careful having everything look like a grey yellow sand color, I don't want that to flood all of our art'); 137(c): COOK
runs the remake, RUN keeps the map's code. Rule 142 (the same hour): one map at every zoom, and COOK's remade pictures
are what it shows. This is the part of the map COOK cannot swap, because it is not a picture: it is colour constants in
`slices/BOHEMIA_CITY_WORLD.html`. Nothing here is edited by COOK.

## 0. READ THIS FIRST (added at the round's end, after RUN's BUILD 10/24h)

RUN's `__ONE_MAP_AT_EVERY_ZOOM__` (ff65d67b, rule 142) draws the painting at every zoom and never draws the per-block
pictures once it is in. So since 19:44 the whole map's colour is the painting's: `VB_CCOL` (the city) and `VB_COL` (the
land). COOK's 69 district pictures are all in colour now (aea0a744) and the painting does not show them. MEASURED on the
map after both (`records/target/cook_map_colour/after/spread.json`): sand 79% far, 66% district, 42% opening, 42% step,
35% near; the near stop was 31% with COOK's pictures drawing (`batch2`), and is the painting's tan now. Rule 142(c) says
COOK's remade pictures are what the one map shows; the painting is RUN's way to be one map, so the painting must carry
their colour. THE FASTEST FIX is the table in section 2b: the painting's keys re-read off the new pictures (k-means on
each master, the rendered colour, the same method as 10/23), every value checked against the sand test.

## 2b. VB_CCOL, MEASURED OFF THE NEW PICTURES (old -> new)

| key | now | new | what it is |
|---|---|---|---|
| yard | #8c7b63 (sand) | #697160 | the suburb's yard (lawn, weeds and gravel), measured |
| yard2 | #80705a (sand) | #7e8282 | grey gravel, measured |
| roofA | #bba98e (sand) | #ae7770 | terracotta tile, measured |
| roofB | #aa997f (sand) | #86655f | dark tile, measured |
| lawn | #4f553b | #5a6d56 | the park's lawn, measured |
| pool | #3f4f45 | #3f86b8 | a pool, blue |
| poolDry | #8f897c (sand) | #a9adb0 | a drained pool |
| gold | #a3916a (sand) | #c49a48 | the resort's gold glass |
| floor | #90826b (sand) | #8c7672 | the desert floor, red-grey |
| pebble | #b09c74 (sand) | #a39d9a | pale gravel |
| wallG | #8d8270 (sand) | #bab7b0 | stucco, measured |
| roofE / roofE2 | #a08270 / #8e7262 (sand) | #ae7770 / #86655f | the estate's tile |
| trailer / trailer2 | #8f877a / #7a7367 (sand) | #a88f8a / #8a958c | pink and sage trailers |
| slab | #8f877b (sand) | #8a8886 | concrete |
| rust | #74604f (sand) | #7a4738 | rust, measured on the freeway |
| dirt | #6d6556 (sand) | #6b6a66 | grey dirt |
| line / mark | #7d725c / #857a62 (sand) | #9a9690 / #8a8682 | paint and marking |
| tie | #6b5a48 (sand) | #5e4038 | rail ties |
| shop | #837e75 (sand) | #7e4436 | brick, measured on the commercial block |
| green / tree | #5f6a45 / #3f4a30 | #4f6e3e / #2c4327 | green, a tree, measured |
| brush | #5f5440 (sand) | #4c5c36 | creosote |
| towerTop / tower | #aaa498 (sand) / #8c877f | #a8aaae / #7f8590 | the towers' concrete |

The pictures' own variety (a different stucco and tile a house, a pool in every third yard, the Strip's neon, the red
rock and basalt on the rim) is what a palette of one colour a key cannot carry; the painting could roll each house's
stucco and tile from `banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json`'s `themes.house.wall` and `.roof` the way it rolls
its heights.

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
