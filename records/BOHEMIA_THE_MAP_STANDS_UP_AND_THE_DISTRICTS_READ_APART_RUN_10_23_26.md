# RUN, 10/23 (run-3d-10-23): THE MAP STANDS UP, THE DISTRICTS READ APART, THE CUT

Opened by the coordinator (rule 112), Paolo 10/23: 'I got usage, let's go a round.' Rules 121 and 123 read first: implementation,
no cards, he meets it while playing. His words on the map: 'the main map is looking so bad'; on the painted map, 'yes but it's
flat, not elevated'; on the districts, 'the districts are looking like shit'.

## 1. [the map stands up] -- d2be5b3d, 46fb7afb

MEASURED FIRST (the painting he opens on: vbCityCore, 24 texels a block, his opening zoom a block 18 CSS px): a house rose
Q = 2 texels, 0.75 CSS px, under one phone pixel of wall; a works block 0.75 to 1.5 px; the freeway, the rail and the trees
lay on the ground; nothing cast a shadow. Only towers, casinos and the rim stood. The before shot: the suburbs a flat brick
carpet.

NOW (__THE_MAP_STANDS_UP__, slices/BOHEMIA_CITY_WORLD.html, in the worker that bakes the painting):
- houses: a block is four big lots (6 q) or nine small ones (4 q) by its own roll; one house a lot, longer one way, set back
  in its yard; a 2 T wall (one in seven 4 T) under a 1.6 T gable whose ridge runs the long way; the yard between is wider
  than a wall is tall, so the yards show (the first try, nine 3 x 3 houses with 3 T walls, merged into rows: the walls hid
  the yards behind them).
- works and shops: one to three boxes with an alley between, 4 to 9 T each, a parapet ring, plant on the roof.
- towers and casinos on a 3 T podium; one over 14 T sets back to 0.62 of its height at its edge (the Strip's wedding cakes);
  a storey every second texel of wall a dark window band.
- trees 3 T crowns; the freeway on a 3 T berm banked down to the ground it crosses, its knots (freeway on all four sides)
  6 T; the rail on a 1 T bank; the solar rows on stands; the open ground rolls (a knoll up to 2.75 T).
- THE SUN CASTS: one sweep down the land's own sun line (from -u and half -v, upper left on the glass), the shadow's top
  dropping 0.78 a step; a top under it is in shade (0.62, soft by one texel). A roof's two pitches are lit by the same sun.
- the opening zoom: the painting at 0.88 over the block pictures' grain up to a block 26 px, then the hand-over to the block
  pictures between 26 and 30 px (vbCityAlpha). It was a straight fade from 16 to 34: at a block 29 px 0.29 of the painting
  and 0.71 of the pictures, every tower doubled.

MY MISTAKE, SAID: d2be5b3d made the opening zoom the painting alone after MAP DENSITY had been read, and pushed. The floor
read 1.50 x 1.17 device px against 1.5 (G2 red on main for one commit). 46fb7afb put the grain back under it (1.19 x 1.10).

The bake: 1.4 to 1.8 s in the page against 1.0 to 1.2 before (the gate's re-bake); in the worker, off the main thread
(F9: the frame pays one picture, 3.6 ms).

## 2. [the districts connect on the map] -- 75efa200, 03522009

Round one (10/18) joined the streets (one connected network, 3,483 road blocks). What was left: the districts read apart,
from COOK's pictures. This round:
- __THE_DISTRICTS_READ_APART__ in the painting: the block's family rides into the worker beside its class (vbSubOf,
  VB_SUB). A trailer park is rows of long low boxes on gravel; an apartment block two slabs of three or four storeys with
  window bands and a striped lot between; an estate big lots with mansions under a muted terracotta tile, dark lawns and
  pools (most dry); a gated block the same behind a wall; a shop block its boxes on one half and its parking lot on the
  other; industry rust roofs on dirt yards. Shop roofs warm concrete, never metal blue (his thirteenth votes).
- COOK landed the map's first fifteen, then twenty more, district pictures through the rig this round (7010972e,
  d9a5f354, b26806b8): grimy grey-tan concrete, pale roofs, dark windows. The painting now wears that palette, read off
  his pictures: the homes at the suburb picture's own mean as the map draws it (123, 108, 88 under the family cast; the
  painted suburb 119, 106, 88); towers and casinos grey concrete with dark windows, the Strip a dull brass. So pinching in
  past a block 26 px is one city handing over to the same city in 3D, not a reddish city turning grey.
- COOK's pictures are taken as they land: they are the same files (HERO_SRC in BOHEMIA_CITY_TILES_*.js), the map draws them
  above a block 30 px, nothing in RUN's code holds them back.

## 3. THE GATE: gates/the_map_stands_up_gate.js, 12/0

U1 walls 26.5% of the built texels (at least 16.7%); U2 the tallest house 5.3 T (was 2 T); U3 the freeway 6.0 T (was 0);
U4 18% of the visible tops in shade (there were none); U5 the opening zoom the painting over the grain (0.88) and the
hand-over 4 px of zoom; U6 to U8 mutations red (the sun out: 0% shade; the houses flat: 2.0 T; the berm cut: 0 T);
D1 the six families' mean colours apart, closest works/shop 10.8 (it caught estates at 2.9 from suburbs before they became
mansions; read with the rim laid down, said in the leg: the foothills' ranges own the estates' texels in the picture);
D2 the mutation (no families handed over) red at 0.5; D3 the painted suburb within 14 of COOK's suburb picture as drawn
(5.1; the old palette read 21 off it); U9 nothing threw.

## 4. THE CUT -- 009860a2, BUILD 10/23a - THE MAP STANDS UP

The demo re-cut from the workshop with the stamp naming the round (it was DEMO 10/20a, ONE SONG ONLY). The map, COOK's
district pictures and settlement screens, UI's top bar (the materials file), COMBAT's rebuilt fight and RUN TWO's roster
are live files the demo loads, so they ride every deploy; the cut carries the stamp and the map people baked to this
workshop. STOPWATCH (tools/bohemia_five_minutes.js --throttle 4, the counting walk the STOP block asks of every cut): the
door at 16.2 s; 68 taps reached their control; 0 page errors; 9 stalls over a beat, worst 917 ms (10/18b's walks 1,167 to
1,533); 3 dead taps, all '5x' pressed while lit (UI's speed pad, routed 10/18); first 15 s of play 49.3 fps, the rest
56.9. The derived slices BOHEMIA_RUN_CURRENT, BOHEMIA_CURRENT_SLICE and BOHEMIA_MAP_CURRENT re-derived by their own makers.

## 5. GATES RUN (rule 13)

On this tree: THE MAP STANDS UP 12/0 (new), MAP DENSITY 13/0, THE FAR END IS PAINTED 11/0 (F7 now reads the painting over
the grain, 0.85 or more, at the opening zoom: it said 1 while the code drew 0.89 since 10/19, so it was red on main), THE
VALLEY HAS AN EDGE 14/0, THE NEAR END IS THE BLOCK 9/0, THE MAP AT THE PHONE'S PIXELS 16/0, THE FAR END AT THE PHONE'S
PIXELS 8/0, THE ZOOM GOES THROUGH CLOUDS 8/0, DEMO BUILD 25/0, the cut --check green.
FLAKE, NAMED: THE VALLEY HAS AN EDGE E13 (one light at the far stop) read red twice in a row mid-round (city 21 to 23, land
41 to 64 at every hour) and green five times since on the same files (city 74 to 92, land 81 to 102); the two earlier city
files also read green. Not fixed; the reading is timing-sensitive.
RED, NOT RUN'S: INLINED FRESH (engine/bohemia_followers.js's closing banner is missing, the resync refuses);
DERIVED FRESHNESS (the canon index, FACTIONS' dossier pages, and the chunker's alpha and world lines COOK left out on
purpose in 7010972e). Full suite unmeasured (rule 13: not run whole).

## 6. WHERE HE MEETS IT

The DEMO: open the link, NEW GAME, BEGIN: the map he opens on stands up (houses with roofs and shadows, the boxes of the
shops and works, the freeway on its bank, the Strip's towers); pinch in past the middle and the city hands over to COOK's
3D blocks in the same colours; the build stamp under the title reads DEMO - BUILD 10/23a - THE MAP STANDS UP. No card
(rules 123, 127).

## 7. WEAK, SAID

- The painting is still a painting: at a block 18 px a house is about 15 phone pixels; it reads as a standing town, not as
  COOK's 3D houses. The 3D pictures take over at 30 px.
- The far stop: the city is small and the parties on it are big (rule 102, [only you scale], OPEN on this board).
- The rim mountains in the painting and the old far end beside them are blocky terraces on a laptop (the far end he
  preferred, 104f, kept).
- Estates and gated blocks are 49 blocks in the foothills; the ranges in front of them hide most of them in the picture.
