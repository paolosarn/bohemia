# COMBAT 2 [floor set] -- THE FIGHT'S FLOOR, ROUND 1 (10/1/26, session combat2-8ca291aa)

Paolo 10/1: "the tiles below the people dont look good." Rule 46f and 55.

SHIPPED: tools/bohemia_combat2_the_floor_set_cook_10_1_26.py ->
  banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt (JSON: ground[] and cover[], each b64 PNG)
  slices/vote/COMBAT2_THE_FLOOR_SET_10_1.png (VOTE id combat2-the-floor-set-10-1, BEFORE beside AFTER)

GROUND (9 tiles, each 515 x 515 = 12 m at 42.9 px/m, his 7/28 bank's own density, never resampled):
  street_small (1 tile: walk, kerb, gutter, two lanes, faded dashed centre line 3 m on 9 m off,
  gutter, kerb, walk), street_crossing, street_big_a + street_big_b (two tiles, the double line
  at the join), freeway_lane (four in a row is a freeway, 46g), lot, lot_b, slab (joints every
  3 m), roof (flat gravel deck in a stucco parapet, hatch, dead swamp cooler: the one high ground).
  Street tiles run EAST-WEST and tile along x (guarded: west edge == east edge); rotate 90 for N-S.
COVER (2): dead_car = his own 7/28 'wreck_road' sprite reused whole (4.36 x 2.09 m, 1.45 m tall);
  block_wall = 6 m of desert block, 1.8 m tall, cap lit NW, courses on the south face.

GUARDS (refuse the run): every tile exactly 515 px; every pixel on his ramps, his tiles or his
sprites; street tiles seamless east-west; no two tiles the same picture; every cover piece at or
over chest height (1.3 m), so it hides a man.

FOR COMBAT 1 (dropping them in): read the bank, decode ground[id].b64, draw each house tile 1:1
at the device pixel ratio (the [device canvas] rule). Map: road cells -> street_small (or big a/b
by road class), yard -> lot/lot_b alternating by seed, driveway -> slab, the climbable house ->
roof. Cover: replace the tan blocks with dead_car / block_wall. Nothing else painted on the floor.

KNOWN WEAK, NEXT ROUND ([cover pieces] row): the slab and sidewalk bands carry his tiles' heavy
cracks and read busy at half zoom; the shed is not drawn yet; north-south street variants are
a rotation, not their own sun pass.

## ROUND TWO (10/1, his fifth votes, rule 56): REAL SIDEWALKS, SEEN AT 45

His vote on round one: up, with "it's not a eagle Birdseye view 90... everything we do is 45 when
it comes to the land underneath" and four NOs on the sidewalk width.
  * SIDEWALK 1.4 m (4.6 ft) on a 9.2 m roadway: 0.15, about an eighth (Vegas 4-5 ft on 37 ft).
    Round one was 1.8 on 8.4 (0.21). A ruler guard refuses anything over a sixth.
  * 45 CAMERA: every tile is 515 x 364 (12 m wide, 12 m deep x cos45). The plan is baked square
    and NEAREST-squashed (every pixel his), then the south-looking faces are drawn at cos45: the
    north kerb's face, the roof's parapet (north inner face, south outer face, swamp cooler box),
    the walls' and shed's faces, and the cars' south flanks (his paint in its own shadow, flat
    tyres). Bank declares perspective; art_45_gate 16/0.
  * NEW TILE street_small_ns: the north-south street, its plan turned BEFORE the tilt (a rotated
    tilted tile would be wrong), so roads can cross.
  * VOTE combat2-the-floor-set-r2-10-1 (redoOf the voted one), sheet COMBAT2_THE_FLOOR_SET_R2_10_1.png;
    round one's sheet left as he voted it. The cover sheet (combat2-the-cover-pieces-10-1) re-cut
    at 45 in place (not yet voted).
FOR COMBAT 1: tiles are now 515 x 364 per house; the board's row pitch is 364 px at authored size.
NEXT (rule 57): a sheet per board kind, CUL-DE-SAC and DESERT WASH first.

## ROUND THREE (10/1, rule 57): THE BOARD KINDS, CUL-DE-SAC AND DESERT WASH

tools/bohemia_combat2_the_board_kinds_cook_10_1_26.py -> banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_10_1_26.txt,
VOTE combat2-the-board-kinds-10-1 (slices/vote/COMBAT2_THE_BOARD_KINDS_10_1.png).
A kind = one 60 x 60 m plan (5 x 5 house tiles) dressed from the banks, seen at 45 (faces drawn
where a high surface sits north of a low one), then CUT into 25 tiles of 515 x 364. Cover is NOT
baked: kinds[].cover is a placement list (piece id + metres) so the cutter can reshuffle per seed.
  culdesac: 9.2 m stem from the south, 22 m bulb, 1.4 m walks, kerb faces seen, six houses on whole
    tiles (round-two roof tile, six seeds) with 4.4 m slab drives to the kerb, dead planter island,
    cars, walls, shed placed.
  wash: a meandering dry bed 6-10 m wide, one soil per surface with ragged patches (the first cut
    checkerboarded the pool's four soils), cut banks shaded and their south faces seen, 120 creosote
    clumps from the rock's own olive, 9 grey rocks as cover, one three-dome outcrop as the mound.
  Pieces: cover bank ids plus extra_pieces rock_N and outcrop (in this bank).
GUARDS: tile size, colours (7/28 bank + desert pools bank), sidewalk ruler, placements on the
board and on legal surfaces (no wall in the road, no car in a house), no stamped tile.
NOT USED (measured): the desert pools 'boulder' list is lava spikes and blue coral; never Mojave.
FOR COMBAT 1 (the cutter): map cell kind -> kinds[id]; draw tiles[r][c]; drop cover by placement.
NEXT (rule 57): suburb block, strip lot, scrub, freeway.

## ROUND FOUR (10/1, rules 57 and 59): SUBURB BLOCK, STRIP LOT, SCRUB, FREEWAY, AND EVERY TILE TRANSLATED

tools/bohemia_combat2_four_more_board_kinds_cook_10_1_26.py (imports round three's helpers and guard)
-> banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_4_10_1_26.txt, VOTE combat2-four-more-board-kinds-10-1.
  suburb: street on the middle row (9.2 m + 1.4 m walks), 8 houses on whole tiles, drives, walls, sheds, 3 cars.
  strip: five store roofs on the north row (one climbable, four 'blocked'), 2.4 m store walk, a parking
    lot with two nose-to-nose stall rows (2.7 m stalls) and pole bases, cars in stalls, frontage road south.
  scrub: hardpan, creosote dense in noise-field patches (rough), a two-rut track, a sagging fence, 7 rocks + outcrop.
  freeway: the cut wall north (blocked row), eight lanes with dashes, shoulder lines, the yellow median
    edges and a lit median top with its face seen, the south embankment face, a jam of ten dead cars.
TERRAIN (rule 59): every kind carries terrain[5][5] from {flat, rough, debris, height, blocked}, read
from the drawn masks (houses -> height only where a roof is drawn); round three's two kinds are
translated in round_three_terrain. Key and source in the bank. No cover sits on a blocked tile (guard).
NEXT: strip-mall store fronts deserve their own facade tile (they reuse the house roof); landfill,
shore, the ruin variants (debris).

## ROUND FIVE (10/1, rules 57, 59): THE SHORE, THE LANDFILL, THE RUIN

tools/bohemia_combat2_shore_landfill_ruin_cook_10_1_26.py (imports round four) ->
banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_5_10_1_26.txt, VOTE combat2-shore-landfill-ruin-10-1.
  shore: deep water (water bank tiles 15-18, each colour snapped to the bank's own colour nearest its
    60% self: a hole, not a pool) is 'blocked'; the pale wading band (tiles 26-27) is 'water'; mud flat
    from the desert soils; the bathtub ring a bleached band with its 1.6 m face seen; rocks, a car, rubble.
  landfill: haul road, trash heaps from a noise field ('height', faces seen), 260 tyres, rubble cover.
  ruin: the suburb block soot-shaded, four of eight roofs burnt through (joists over black, 'blocked'),
    yards a debris field ('debris'), rubble and broken walls.
New tag 'water' (3 steps, defence malus). Extra pieces rubble_N in this bank.
NEXT: store-front facades, the casino floor (an interior), night light as a tile property.

## ROUND SIX (10/1, rule 59's night-lit row): THE BOARDS AT NIGHT

tools/bohemia_combat2_night_boards_cook_10_1_26.py -> banks/BOHEMIA_THE_FIGHT_BOARDS_AT_NIGHT_10_1_26.txt,
VOTE combat2-night-boards-10-1. Round four's suburb block and strip lot (cover composited in) taken
to night: x(0.30, 0.31, 0.38), then the pools of his live lamps (7/28 lamp sprites every 12 m on the
walks, 36% lit) and his burning oil drums restored warm in three hard rings (ellipses at cos45);
every pixel snapped to the allowed palette (numpy nearest). light[5][5] = 'lit' where 40% of a tile
is inside a pool. Guard: colours, size, not stamped, at least one lit tile.
NEXT: store-front facades, the casino floor interior.

## ROUND SEVEN (10/1, sweep J and rule 61): THE HOUSE AT 45, AND THE BIG BOARD

tools/bohemia_combat2_houses_at_45_and_the_big_board_cook_10_1_26.py ->
banks/BOHEMIA_THE_HOUSE_AT_45_AND_THE_BIG_BOARD_10_1_26.txt, VOTE combat2-houses-at-45-and-the-big-board-10-1.
  house45(seed, facing): on the 45 lot, a 9.6-10.6 x 7.6 m footprint; roof plane 7.6 m x cos45 of his
    roof_slope, his roof_ridge a third down, the far plane shaded, the west hip lit and the east hip in
    shade, his roof_eave along the eave; a 2.7 m x cos45 stucco face (his wall tiles) with his garage,
    door and window (north-side houses) or a slider and window (south-side, the back wall); the drive;
    the shadow SE. Pitched roofs are 'blocked'; (1,1) and (3,3) keep the flat roof as 'height'.
  suburb45: round four's suburb block with the 45 houses.
  big_board: 20 x 15 house tiles = 4 x 3 blocks of the kinds (suburb45 x4, strip, culdesac, ruin, scrub,
    freeway x4 along the south); start rows 4 and 9 (distance 5). The bank stores the layout and points at
    each kind's bank, not one giant picture. COMBAT 1 owns the cutter and the code ([board size]).
NEXT: the 45 house in the cul-de-sac, ruin and night boards; block seams; store fronts.

## ROUND EIGHT (10/2): STORE FRONTS AT 45, AND THE 45 HOUSE ON EVERY BLOCK

tools/bohemia_combat2_store_fronts_and_houses_everywhere_cook_10_2_26.py ->
banks/BOHEMIA_STORE_FRONTS_AND_HOUSES_EVERYWHERE_10_2_26.txt, VOTE combat2-store-fronts-and-houses-everywhere-10-2.
  store45: deck + parapet, a 4.5 m x cos45 face: a blank sign band with a paler ghost of the letters, the
    glass run in A[0] with mullions every 2.4 m and a few reflections, one bay boarded (his tile), his door,
    the face's shadow on the walk. Four of five bays on the strip lot (the ladder roof stays flat, 'height').
  culdesac45: the six bulb houses as house45 (north row fronts, south row backs), all 'blocked'.
  ruin45: the four burnt houses as house45 soot-shaded and broken through to the joists; two standing
    houses at 45 ('blocked'); one flat roof each side kept ('height').
  The big board card re-drawn with these kinds (same layout).

## ROUND NINE (10/2, rule 63): THE GROUND FOR THE NEW FIGHT

tools/bohemia_combat2_the_ground_for_the_new_fight_cook_10_2_26.py -> slices/fight_ground/ (published).
Eight boards x 20 x 15 house tiles from 21 blocks (suburb x3, suburb_stem x2, culdesac x2, strip x2, ruin x2,
scrub x3, wash x2, freeway, shore x2, landfill x2); variants by offsetting every seed (R and dress) in the
imported cooks. fight_ground.json: tile_px, block_tiles 5, board_tiles [20,15], start_rows [4,9], terrain_key
with BB AP, cover and cover_extra (src, metres, kind), blocks (src), boards (blocks layout, terrain 15x20,
cover in board metres). Guards: board >= 20 x 15, start rows 5 apart, no identical block side by side (the
freeway exempt: its lanes must run on), no cover on blocked, every named file exists. 18.2 MB.
SIZE: the published site was 331 MB against PAGES PUBLISH's 260 MB cap before this round (already red); this
adds 18 MB (349). Flagged for PLUMBER.

## ROUND TEN (10/2): VERIFIED ON THE REAL SURFACE, AND ROUND NINE'S WEAK SPOTS

The new fight (slices/BOHEMIA_FIGHT.html, COMBAT [rebuild] 645c31f) reads fight_ground/fight_ground.json and
bakes a board from the block PNGs and cover PNGs. Captured through Playwright at 390x844, DPR 3, FIGHT_OPTS
{board, night:false, seed:7}: culdesac and desert, at 1.5 s (the whole-board open) and 5.5 s (glided in);
zero page errors. Sheet: slices/vote/COMBAT2_THE_GROUND_IN_THE_NEW_FIGHT_10_2.png.
Fixes: R4.scrub dresses the same two soils as B.wash (soil 1 with soil 2 through a 14x14 noise cut at 160);
the landfill board's bottom row is scrub/landfill, no freeway stub. fight_ground re-cooked: 19.2 MB.

## ROUND ELEVEN (10/2, sweep L): NO BOARD IS ONE PATTERN CLONED

tools/bohemia_combat2_mixed_blocks_cook_10_2_26.py: suburb_seeded(seed, cross_col) draws which lots carry a house
(p 0.72 a side, at least two), one climbable flat roof, one burnt in six, seeded walls, sheds and cars; with
cross_col a north-south street column and a crosswalk at the block street; empty_lots(seed) pours foundation
slabs, drive aprons, chain-link, rubble. The round-nine builder (same file names) now lays every board from
PALETTES with a seeded rng: no block equals its left or upper neighbour, the cul-de-sac's stem is carried south
by suburb_stem. Old suburb.0-2 blocks removed. 26 blocks, 22.8 MB. Verified in slices/BOHEMIA_FIGHT.html on
suburb and strip at 390x844 DPR 3, 0 page errors; sheet COMBAT2_MIXED_BOARDS_IN_THE_FIGHT_10_2.png.
WEAK: cross streets end at block edges.

## ROUND TWELVE (10/2): CROSS STREETS RUN THROUGH, AND THE LIGHTS AS DATA

streets_run_through(lay, rng) in the round-nine builder: columns carrying a cross street (or a cul-de-sac stem)
keep it through every town block (corner/cornerw variants differing from left/upper/right), at most two such
columns a board (the stem's column always kept, no two side by side beside a stem), other corners become seeded
suburbs. boards[].lights: lamps every 12 m on both walks of every street block (36% live, seeded per board),
drums in some lots/scrub (live); sprites light_lamp_house_side/your_side/oil_drum.png (his 7/28 sprites);
lights_key in the manifest. 27 blocks, 23.8 MB.

## ROUND THIRTEEN (10/2): THE GROUND PACKED

tools/bohemia_combat2_fight_ground_pack_10_2_26.py: every PNG in slices/fight_ground saved as lossless WebP
(method 6), decoded back and compared on every visible pixel (refuses on any difference), PNG removed, the
manifest's src fields rewritten to .webp, every named file checked present. 23.6 MB -> 4.8 MB (71 files).
Verified in slices/BOHEMIA_FIGHT.html (culdesac, shore; 390x844 DPR 3; 0 page errors). The round-nine
builder imports and calls pack() last.

## ROUND FOURTEEN (10/4, rule 67): MANY MORE BUILDING TYPES

tools/bohemia_combat2_building_types_cook_10_4_26.py -> banks/BOHEMIA_THE_BUILDING_TYPES_10_4_26.txt, VOTE
combat2-building-types-10-4. shell(w, d, h, roof): roof plane d x cos45 (flat deck+parapet / corrugated metal /
terracotta hip or gable), face h x cos45 from his wall tiles, shadow SE. Apartments 24x11x9 (window grid, stair,
walkways, AC); church 12x18x6 + gable end + bell tower; school 30x12x4.5 (windows, doors, flagpole); gas station
(store 12x7 + canopy 20x8 on four posts, pumps); motel 30x9x3.2 (door+window per room, office); warehouse 30x20x7
(corrugated, roll-ups, dock); casino back 36x14x12 (tilt-up panels, docks, ducts). Sprites sit bottom-on-tile and
stand into the row behind. Blocks main_street (gas station, motel / church, school) and the_works (casino back,
apartments / warehouse) feed the round-nine builder (HOUSES for suburb boards, TOWN = HOUSES + main + works for
strip and the culdesac's south row); streets_run_through counts them as town and keeps cross streets out of their
columns. 30 blocks, 5.1 MB WebP. Verified in the new fight (strip, suburb; 390x844 DPR 3; 0 errors).

## ROUND FIFTEEN (10/4, his sixth votes): THE FREEWAY AND THE LANDFILL RE-CUT

tools/bohemia_combat2_freeway_and_landfill_recut_cook_10_4_26.py, VOTE combat2-freeway-and-landfill-recut-10-4.
freeway2(seed, overpass): north sound wall face 4 m (row 0 blocked), eight lanes 3.7 m with dashes, shoulders with
rumble strips, yellow inside edges, a 1.2 m jersey median top lit with its 0.8 m face seen, a seeded jam; overpass
variant: a 12 m deck x 24-36 m (column 2 'height') with railings, a faded centre line, spalls and joints, piers in
the lane gaps, its shadow east. landfill2(seed): benches 0-16 (capped soil, vents, the flare), 16-30 and 30-42 m
(open trash) with 2 m faces seen, bales (top/face pairs off his ramps), tyre stacks, the switchback haul road, the
south litter fence; rows 0-1 'height', row 2 'rough'. Wired into the round-nine builder ('freeway', 'freewayo',
'landfill'); 31 blocks, 5.1 MB WebP. Verified in the new fight (freeway, landfill; 0 errors).

## ROUND SIXTEEN (10/4, rule 67): THE LINES RUN THROUGH

Curves made periodic over one block (60 m): R5 shore waterline sin(TAU x) + sin(4 TAU x), wade band sin(2 TAU x),
bathtub ring sin(2 TAU x), landfill haul road sin(TAU x) (TAU = 2 pi / 60); B.wash meander sin(2 pi t + .6) +
sin(4 pi t) and width sin(2 pi t + 1.1); R4 scrub track sin(2 pi x / 60). The round-nine builder sets the desert
and shore layouts explicitly so each wash runs its column's whole depth (and from the lake on the shore).
31 blocks, 5.1 MB WebP. VOTE combat2-lines-run-through-10-4.

## ROUND SEVENTEEN (10/4, rule 71a): THE SETTLEMENT PICTURES

tools/bohemia_combat2_settlement_pictures_cook_10_4_26.py -> slices/settlement_ground/ (published; 0.3 MB): camp,
town, fortress, each a 4 x 3 house-tile picture (2060 x 1092) at 45 from the boards' pieces. The five usable kinds
drawn as objects: barber pole (his terracotta and white ramps, spiral stripe), the cross (T[1] on T[6]) in a
store front's sign band or on a tent, the stall (striped awning, plank table, crates), the posted wall (the cover
block wall papered 14-30 sheets), the board on a pole. settlement_ground.json: tiers[name] = {src, px, hotspots:
{kind: {box [x0,y0,x1,y1], kind}}}. Guards: all five kinds per tier, hotspots inside the picture, his colours.
VOTE combat2-settlement-pictures-10-4. Weak: the camp is sparse.

## ROUND EIGHTEEN (10/4): SETTLEMENTS FULLER, TWICE, AND AT NIGHT

Settlement tool: camp gains two tarps, a stone fire ring round a drum, a second drum, rubble, pallets, a second
wreck; every tier function returns its lights (drums; town lamps one in two lit, at least one; fortress four wall
lamps on a generator plus a drum). Two seeds a tier; each variant gets a night picture through the night-boards
cook's night() (x 0.30/0.31/0.38, hard-ringed warm pools, snapped to the allowed palette). 12 lossless WebP, 2.9 MB.
settlement_ground.json tiers[t] = {src, px, hotspots (variant 0, for the current reader), variants[...]}.

## ROUND NINETEEN (10/4, rule 73): NIGHT YOU CAN READ IN THE SUN, AND THE LAMPS' POWER

night_sun(board, lights) added to tools/bohemia_combat2_night_boards_cook_10_1_26.py: sRGB -> linear; unlit
ground x mult (mult = clamp(0.235 / day median Y, 0.58, 1.35)) x cool tint (0.86, 0.94, 1.18); pools in three
hard rings lifted x5 (up to x12) toward warm until lit:unlit >= 3.3 before the snap; back to sRGB, snapped to the
allowed palette. sun_measure(): median Y overall, unlit, lit, (lit+.05)/(unlit+.05), plain and with 25% white.
Day medians MEASURED: camp 0.283, town 0.149, fortress 0.283, suburb block 0.251, desert block 0.298.
Settlement nights (6): ground 0.215-0.256, lit:unlit 3.08-3.57, sun ground 0.348-0.387: PASS. Sun lit:unlit
2.16-2.41: FAIL (25% white over 0.2 ground caps it). The settlement cook refuses any night under the plain floors.
fight_ground lights: circuit ('grid' | 'fire') and block [r, c] (473 tagged; the builder writes them from now on).

## ROUND TWENTY (10/5, OPEN row [more building types]): WHAT EACH BUILDING DOES IN A FIGHT

Building cook: FURN_MAKERS (pump 1.0x0.6x1.8 m, dumpster 2.0x1.4x1.4, fence 6 m chain-link 1.8, steps 4.0x1.6x0.6,
dock 10x3x1.2), FURN_META (pump COVER burns; dumpster COVER; fence COVER see_through; steps LOW_COVER; dock HEIGHT);
B.piece_img patched to draw them. main_street: canopy tiles (1,0),(1,1) open; motel (1,2..4) height; pumps at the
canopy; church steps and school fence at the south row's FACE (y 48.6-49: a south-row building faces the camera);
car moved clear of the church. the_works: dumpsters on the north walk (y 24.4), the dock at the warehouse's face
(y 48.4, tile (4,1) height); the warehouse cut to 30 x 8 x 5.5 m (20 m deep spilled over the street at 45).
fight_ground rebuilt: cover_extra carries the facts; 31 blocks, 5.1 MB; new fight 0 errors (strip, suburb).
Sheets: tools/bohemia_combat2_building_fight_facts_cook_10_5_26.py -> three VOTE items.

## ROUND TWENTY-ONE (10/5, OPEN row [the wide board])

tools/bohemia_combat2_the_wide_board_cook_10_5_26.py writes into fight_ground.json: boards[b].apron = {blocks 5 x 7
(one ring of the board's own kind, edge blocks' kin, no twin left/up, freeway rows run on), playable [5,5,25,20]
tiles} and boards[b].frames per class (phone_portrait 390x844, phone_landscape 844x390, tablet 1366x1024,
computer 1920x1080): the smallest window at the glass's aspect holding the playable board, centred, clipped to the
apron; letterbox share where the apron runs out (upright phone only). Guards: frames hold the board and sit in
the apron; landscape classes letterbox 0; apron blocks all shipped. No new pictures.

## ROUND TWENTY-TWO (10/5): [tiles are legos], rule 77, SHIPPED

PAOLO 10/5: 'the tiles aren't speaking to each other, the street tiles and the freeway tiles look like dog
shit... what's facing north, east, west... these things should conjoin easily like Legos'.

MEASURED FIRST (the reader, tools/bohemia_combat2_tiles_are_legos_cook_10_5_26.py, run on the shipped boards
before any change): broken seams per board (board / with its apron): freeway 69/140, strip 93/298, ruin 43/95,
suburb 28/61, culdesac 41/101, landfill 8/21, shore 4/19, desert 1/5. What he saw on the freeway board: the
lots' street stopped dead against a parking lot, a strip of orange dirt sat between the parking lot and the
freeway, and the overpass's deck ran off into the desert and into a parking lot with no road to meet it.

THE GRAMMAR (records/target/bb/BOHEMIA_GROUND_EDGES.json, written by the reader from the pictures):
  the compass: NORTH up the screen (the far side), SOUTH the near side, EAST right, WEST left.
  the edge types: road, curb (a walk that crosses the side beside a road), yard, desert soil, water, other
  (a building: meets yard or soil). Every block's four sides are runs in metres plus the lines that cross.
  the join rule: road, curb and water runs meet within 3 px; a mostly-yard side meets a mostly-yard side and
  a mostly-desert side a mostly-desert side; a painted stroke at least 1.2 m long that crosses one side
  crosses the other within 3 px.

WHAT WAS CUT:
  1. THE STUDS. Every town block's finished picture wears one ring cut from one canonical street block (R4.yards
     + MX._street): 12 px west and east over the street band, 10 px north and south over the yard rows; the east
     ring is the west ring mirrored and the south ring the north ring mirrored, so the touching pixels across any
     seam are the same pixels. A building standing on a side is left alone (the reader names that seam and the
     generator avoids it). The freeway wears its own lane band mirrored; the desert one clean column and row of
     one reference desert block; every cross street the same canonical strip.
  2. ONE CROSS STREET. Every cross-street tile is made once, outside the block variants (seeds 19 to 27, each
     keeps its dash), so a cross street's worn dashes are the same in every block and its centre line never
     stops at a block edge.
  3. THE FREEWAY RE-CUT. The overpass carries the town's own cross street (his street tile) instead of a bare
     concrete deck, so it lands on a street at both ends; the north verge is town yard (the town above meets it
     yard to yard), the south verge desert; the deck's shadow only over the cutting; one texture for every
     freeway block. A new block, scrubroad, carries the overpass's street on south into the desert.
  4. THE STRIP MALL RE-CUT. It wears the town's street at the town's depth (24 to 36 m), its lots stop a metre
     short of its sides, its south row is yard: it now joins any town block west, east and south.
  5. THE GENERATOR. Every board except the desert and the shore (hand-laid: a wash runs the whole depth, which
     the reader cannot see) is laid by L.solve: a block goes in a cell only where its west and north edges meet
     what is already there, no twin beside or above, seeded, backtracking. The apron round each board obeys the
     same rule (the board's own kinds first, then the whole bank).

AFTER (the same reader, the same pictures the fight loads): freeway 0/0, suburb 0/0, strip 0/0, ruin 0/0,
desert 0/0; shore 3/16, culdesac 28/64, landfill 7/20 (the rest follow; the ratchet holds them).
Verified in the new fight (slices/BOHEMIA_FIGHT.html, 390 x 844 at 3x, freeway and suburb, 0 page errors): the
overpass's street runs from the town over the lanes into the desert unbroken.

THE GATE: gates/tiles_are_legos_gate.py (TILES ARE LEGOS in the suite): the freeway and street boards clean,
board and apron; every other board at or under gates/tiles_are_legos_ratchet.json; the data file true to the
pictures; and it proves it bites (a town row dropped on the freeway row, the overpass landing on dirt).

KNOWN, NOT HIDDEN: the culdesac board found no matching layout (the stem's street and the cul-de-sac's sides
disagree), the landfill and shore keep their seams; a ring stud is 12 px (0.28 m) wide, a thin property line
where a yard meets a yard; the reader cannot see a wash as different from scrub.
VOTE: combat2-tiles-are-legos-10-5 (slices/vote/COMBAT2_TILES_ARE_LEGOS_10_5.png).

## ROUND TWENTY-THREE (10/9): [the freeway redone], rule 77a, SHIPPED

PAOLO 10/9: 'the freeways and the streets look like dog shit, not the same direction, not working together like
they shared assets... an ugly ass gate wall on top of the freeway'.
WHAT HE SAW: FL.freeway2 drew a 4 m concrete sound wall's face across the whole width at the north shoulder
(a grey band with posts every 6 m: the 'gate wall'), its own concrete deck and rumble strips, six lanes at a
different paint rhythm from the street, a desert verge abutting the town.
THE RE-CUT (FL.freeway2, one function, every freeway block): the street's own asphalt (R4.road_band, his road
tiles), lane paint (C[5], 3 m dash every 12 m, the street's rhythm), curb (R4.walk_band strip + the C[5] curb
line + the same face shading as MX._street); at the freeway's width: 3 m shoulder, 2 x 3.7 m lanes, 1.2 m inner
shoulder, a 0.8 m Jersey barrier (new piece 'jersey', LOW_COVER, 6 m segments, a crossover gap), the same the
other way; fog lines C[5], median lines T[5]. NOTHING ACROSS THE ROAD: the sound wall is gone; a low chain-link
at each shoulder's edge (see-through); cover = the barrier, stalled cars, a truck's trailer (new piece 'trailer',
COVER, blocks sight). Lamps on the median (lights list, circuit 'grid'). The overpass stays only where a town
street crosses: the town's cross street on a bridge, railings with posts over the span, its shadow on the lanes.
Rule 77 still holds: freeway 0/0 (board/apron), every other board unchanged; gate TILES ARE LEGOS green.
Verified in the new fight (390 x 844 at 3x, freeway and suburb, 0 page errors).
OWED: the I-15 photo for reference/ (this container's network policy refuses Wikimedia, Wikipedia, Flickr and
Unsplash; the coordinator or a session with web access drops one in). The sheet carries I-15's measured
section instead. VOTE: combat2-the-freeway-redone-10-9 (slices/vote/COMBAT2_THE_FREEWAY_REDONE_10_9.png).

## ROUND TWENTY-FOUR (10/9): [boards by size], rule 79, SHIPPED

PAOLO 10/9: 'the actual combat map doesn't need to be so big in Battle Brothers unless it's an endgame battle or
three raiding parties hit you at the same time... on the map I want to see it more zoomed in'.
tools/bohemia_combat2_boards_by_size_cook_10_9_26.py cuts six kinds (street, suburb, lot, freeway, strip, works)
at three sizes from the shipped blocks, every one laid by L.solve (rule 77's join rule): small 2x2 blocks
(10x10 tiles, opening window 9x7), middle 3x2 (15x10, window 14x10), large 4x3 (20x15). Each carries its window
(the lead kind inside, both start columns open on half their tiles or more, the two lines joined over open
ground), start_cols five apart, and its terrain, cover and lights composed from the per-block library (the
same reading as the fight's blockLibrary). fight_ground.json sized[kind][size] + sized_key. The builder runs it
after the wide board; gate TILES ARE LEGOS LEG 1b: all 18 boards zero broken seams.
VERIFIED IN COMBAT'S FIGHT (390x844 at 3x, 0 page errors, 12 runs): each small and middle board handed to the
real fight (manifest board + ours.board_tiles routed to the sized board, a party of 3 / 8): the fight builds a
10x10 / 15x10 board and opens zoomed in on the lines at the man's 112 px.
FOR COMBAT (its code, not mine): the fight still deals its own block mixes (dealOnce) without the join rule and
crops; reading sized[kind][size] when the party is small or middle keeps every seam joined.
VOTE: combat2-boards-by-size-<kind>-10-9, six sheets.

## ROUND TWENTY-FIVE (10/9): [the casino floor], SHIPPED

The one interior board (WORLD 9/30's fifteen grounds): tools/bohemia_combat2_the_casino_floor_cook_10_9_26.py,
board 'casino' (4 x 3 blocks of casino.0 slot rows / casino.1 the cashier's cage / casino.2 the table pit).
The carpet in his terracotta ramp with a brass motif, worn per tile, stains kept off the block sides; new pieces
slot_bank (COVER 1.7 m), table (LOW_COVER 0.9 m, felt from his tiles' greens), pillar (COVER 3.6 m, blocks_move);
the cage is two HEIGHT tiles with bars on the face; every block's middle row is an open aisle. Lights: about
one slot bank in five glows on a scavenged battery (light_slot_glow.png, circuit 'grid', radius 4 m) and one or
two drum fires a block (circuit 'fire'). Rule 77: casino 0/0 (board and apron), ratchet line added; the
cul-de-sac's apron improved 64 -> 28 on this build and its ratchet is tightened to 28/28.
Verified in the new fight: FIGHT_OPTS {board:'casino'} day and night, 20 x 15, 21 units, 0 page errors.
VOTE: combat2-the-casino-floor-10-9.
