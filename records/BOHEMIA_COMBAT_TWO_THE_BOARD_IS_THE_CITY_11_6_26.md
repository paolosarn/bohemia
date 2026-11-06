# THE BOARD IS THE CITY AT THAT SPOT (COMBAT TWO, 11/6/26)

Rule 407(g) STEP ONE, ask line 450. Paolo 11/4: "imagine if you made a combat map whose street layout was exactly like the
city, the way you make the regular combat map, and the sizing is the same... use all the same assets, right now it's two
different maps." Opened by the coordinator in rule 411's third wave (COMBAT TWO: the board is the city; CAMP THREE: the camp
on the board; PLUMBER FIVE: the site size). Only step one: the zoom down (step two) and the transition (step three, at final,
rule 404) are not this round. BUILD 11/6h - THE BOARD IS THE CITY. BUILT, NOT YET SEEN.

## MEASURED BEFORE (main d449bf33)
A fight from the map handed the fight its district and its cell; the fight dealt that district's TEMPLATE (ours.place_boards:
the suburb's, the Strip's, downtown's, the works' own five-tile blocks), seeded by the cell. The board was OF the district and
never the streets the map drew there. At the gate's suburb spot (58,24 on the demo's valley) the old deal put 0 of the map's
153 houses on their tiles; at its downtown spot 0 of the map's 57 street tiles were a street on the board (the gate's M3 leg
reads this every run).

## HOW A BOARD IS MADE NOW
1. THE MAP IS ASKED (slices/bohemia_street_board.js plan(), loaded in the map's frame beside bohemia_map_houses.js). The fight's
   page finds the map's frame (the shell's cityFrame) and asks it, once, for the board and a ring of 10 tiles round it. The
   map's own painter (vbCityCore) is run on exactly the blocks under that area at 12 texels a block (a texel is the painter's
   q, 3 m), with its 'coli' (every texel's kind and part as it paints it) and 'hs' (its height) and its house lots (the lots
   bohemia_map_houses.js stands its models on). Nothing of the painter is copied: it is called.
2. ONE RULER: a map block is BohemiaMapHouses.H.B = 36 m; a fight tile is a house, 12 m (fight_ground.json tile_metres).
   A block is 3 x 3 tiles, a tile is 4 x 4 of the painter's texels. The plan refuses a ruler that does not divide.
3. EVERY TILE TAKES WHAT ITS 16 TEXELS ARE: a street (sidewalk on whichever edges the map paints it, the centre line's way,
   the map's dead cars, its lamps, the freeway's Jersey barrier), a yard, a house (the SAME model the map stands there, by the
   map's own pick(): ranch_plain, _porch, _wing, _garage, _carport, fitted to its lot by the map's own rule, 0.8 to 1 of its
   metres), a trailer, a burned house (rubble), a shop's / works' / civic / town block's building, a tower, a casino's podium,
   the parking, the desert, the water, the rail bed, the airfield's concrete.
4. LAID (lay(), pure): one ground piece a tile and the buildings standing on them, from THE STREET BOARD KIT
   (slices/fight_ground/street_board/, tools/bohemia_combat_two_the_street_board_kit_11_6_26.py, 2.9 MB, 28 files):
   COOK TWO's street kit read where it lies (21 pieces); one-tile cuts of the fight's own blocks for the ground between, chosen
   by machine (flat, no cover, no building over it, its colour, least texture); the map's five ranch models as the master rig
   rendered them at the fight's camera (45 degrees, south faces, their own cast shadow), taken from 57 to 42.9 px a metre; the
   rig's warehouse, pawn shop, gas station, motel, school, church, chapel and casino for the built blocks, ONE picture a block.
   Houses block (one roof in seven is a roof you can get onto, the map's one in seven two storeys); a one-storey shop is a roof.
5. THE RING round the board is the same read further out: the map past the board's edge IS the map (no template blocks).
6. NOTHING OF THE FIGHT IS TORN DOWN (407(f)): its rules, UI, cover pieces, lamps, layers, ladders, fog and the camp read the
   board as before. A boss's board, a named board, the graveyard, the arena (cut), a test board (flat), the tuning bench and any
   fight the map cannot say (no cell, off the valley, no map frame) still deal the template. A cut that does not join his line
   to theirs is moved a tile or two along the same streets (13 shifts), never re-dealt.
7. THE DEALER'S ENTRY POINT IS UNCHANGED (CAMP THREE): FIGHT.setup(opts). With opts.cell and the map up, the board is laid;
   opts.street = a plan object hands one whole (a gate, a bench); opts.street = false forces the template. A laid board's
   boardDef carries laid (its pieces), roofs (per tile), street (cell, district, origin, shift); its blocks are 'street.0'
   placeholders, so read terrain, cover and lights from FIGHT.S as always.

## THE MATCH, MEASURED (gates/the_board_is_the_city_at_that_spot_gate.js, 170 passed, 0 failed, 62 s)
Three valleys (the demo's 2691674296 and 7 and 4242, rebuilt the way a loaded save rebuilds them), six spots each: the suburbs,
the Strip, downtown, industrial, a town, the desert. The map's truth is read by another road: its own 8 x 8 tiles at 36 texels
a block (vbTileInput, the lots BohemiaMapHouses stands, its own pick) and its districts (om.at, vbClassOf, vbThruOf).
- H1/H2 houses on the same tile with the same model, both ways: 18 of 18 spots exact (e.g. 153/153 suburb, 90/90 town,
  54/54 industrial, 22/22 Strip). R1 the ring: every map house there on the board's ring (e.g. 306/306).
- S1/S2 streets: 18 of 18 at 100% both ways (e.g. 120/120 industrial, 108/108 Strip).
- B1 every house blocks or is a roof. P1 AUTO plays two rounds on each district's laid board, 0 page errors.
- W1 the demo's own door (the shell's nfOpen at a suburb block) opens a fight that asked the map itself: laid, the same cell,
  153 houses, the map read in 10 ms.
- MUTATIONS, each caught: the plan moved one tile east (H1 22/153 at the suburb); one house's model swapped (152/153); the old
  template deal at the same spot (the suburb's houses 0/153, downtown's streets 0/57).
Picture: records/target/COMBAT2_THE_BOARD_IS_THE_CITY_11_6.webp (left the map's own ground top down, its houses marked; right
the board the fight dealt). VOTE card combat2-the-board-is-the-city-11-6.

## THE COST (rule 400: the board streams in only around the fight)
- The map is read only under the board and its ring (14 x 12 blocks at most), once, at the fight's start: 8 to 109 ms on this
  box (median about 22), 10 ms through the demo's own door; 53 ms at 4x CPU in the probe.
- Only the kit pieces a board uses load (about 20 of 28).
- FRAMES, the phone profile (390 x 844 at 3, CPU 4x), AUTO, 9 s each, the same spot laid against its template, draw() alone:
  suburb 111 ms vs 79 ms, the Strip 93 vs 71, downtown 86 vs 76 (median); the frame (rAF) 117 to 167 ms vs 100 to 117. This box
  draws in software at 3 device pixels, so neither is a phone's number; the difference is: +13 to +40% per frame, and it is
  THE LAYERS: a laid board has 166 to 310 standing pictures (every house a man can stand behind) against 0 on the templates
  measured, so the glass behind a house is laid back over more men. Named for PLUMBER (rule 400(a)), not tuned here.
- THE FIRST laid fight's start, cold: 9.4 s at 4x (the kit's pictures decoded once); later laid fights 0.5 to 0.9 s; the
  templates 1.3 to 2.4 s warm.

## GATES RUN (one at a time, rule 13)
THE BOARD IS THE CITY AT THAT SPOT 170/0 (new, registered). THE HOUSES STAND UP CLOSE 28/0 (bohemia_map_houses.js touched: pick
exported). THE WHOLE LOOP PLAYS 11/0 (its fight opened on SUBURB, the laid board); one earlier run of it went red at step 6 (the
road event's card stayed up) and the same gate on clean main went red at step 10 (the reload), both passing on the next run:
flaky, not this round's. EVERY PLACE ITS OWN BOARD PASS (the tuning bench's headless engine still deals the templates: it has no
window and no kit). No image-comparing leg was needed; PIL worked on this box for the kit and the sheet.

## WEAK, SAID OUT LOUD
- 407 AMENDED AGAIN (ask 452, the coordinator's call 'the board is OF the place, not a copy of it') says a copy may make long
  straight streets and rows of the same house. This round built the copy the brief asked for (407(g)); a suburb block of nine
  12 m lots is nine houses, solid, and the fight is in its streets and yards. Whether a laid board is a good fight is the next
  question, not answered here.
- Downtown's towers are drawn by the rig's casino or school (10 m): the tower casino stands 34 m and covered five rows north of
  it. The Strip's resort blocks repeat the rig's one casino. Water is the shore block's bank tile repeated. Parks are dirt.
- The map's arterial is 36 m: three tiles of asphalt with COOK TWO's faint centre dashes; no crosswalks yet.
- Every house faces south (the rig rendered S, SE, SW); a house fronting a street to its north shows its front away from it.
- The dirt between houses is three one-tile cuts: their joins read faintly.
- A fight off the valley (the region's places) and a handed plan whose size differs (a board that grew for a big crew, on a
  bench) deal the template.
- The men stand where the fight's deployment puts them, not where the map had them (that is step two).

[bb] Battle Brothers lays its battlefield from the world tile it is fought on; ours is the very street the map drew there, the
ring round it the map itself.
[analog horror] the board is a recording of the block a second before: every dead car still where the map left it, the burned
house still burned.
