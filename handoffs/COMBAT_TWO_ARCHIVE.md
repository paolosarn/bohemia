# COMBAT TWO ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
COMBAT TWO (combat2-8ca291aa): 10/10 (ae) LATEST -- [the district seeds the board] SHIPPED: fight_ground.json districts (78 seeded joined boards, gate LEG 6); [FOR COMBAT] open districts[handover district]. Still CLAIMED [the boards from the packs] waiting on COOK TWO's four-way piece and freeway/lot/house kits. NEXT: [the warehouse inside].
COMBAT TWO (combat2-8ca291aa): 10/10 (ad) LATEST -- [the boards from the packs] ROUND ONE SHIPPED: every town street laid from COOK TWO's kit (from_the_kit, kit_plan in the manifest, kit_override in the reader, gate LEG 5). [FOR COOK TWO] a one-tile four-way piece with walks on all sides (cornerw waits on it), then the freeway, lot and house kits; I re-lay the round each lands. NEXT: lay each COOK TWO kit as it lands; meanwhile [the district seeds the board].
COMBAT TWO (combat2-8ca291aa): 10/10 (ac) LATEST -- [the rest join] SHIPPED: all nine boards 0 broken seams on the board; aprons shore 6, culdesac 38, strip 12 (two got worse, ratcheted). Reader: a crossing line starts within a tile; edge dashes never wear; ruin curb lines. NEXT (rules 82, 87, 88): [the boards from the packs] FIRST, laying boards from COOK TWO's kits; every art sheet needs its reference twin.
COMBAT TWO (combat2-8ca291aa): 10/9 (ab) LATEST -- [the freeway round two] SHIPPED: BT.jersey/trailer redrawn with _grain texture, FL.freeway2 fog lines C[5], median G[5], per-cell patches and cracks inside the lanes, overpass shadow 0.84; rebuild + futures + sizes regenerated; gate green. NEXT: [the rest join].
COMBAT TWO (combat2-8ca291aa): 10/9 (aa) LATEST -- [the future boards] SHIPPED: tools/bohemia_combat2_the_future_boards_cook_10_9_26.py writes futures[reclaimed|raided] (block pictures block_<id>_<state>.webp + per-board cover and lights), run last by the builder; overlays never touch asphalt, lane paint or the 0.6 m edge band; gate LEG 1c. NEXT: [the rest join]; new OPEN [the future settlements] (rule 74). Reference gate's 2 reds are tools/bohemia_cook_good_bros.js (not this lane).
COMBAT TWO (combat2-8ca291aa): 10/9 (z) LATEST -- [the casino floor] SHIPPED: tools/bohemia_combat2_the_casino_floor_cook_10_9_26.py (carpet, slot_bank/table/pillar pieces via CF.install into BT.FURNITURE, the cage as HEIGHT), board 'casino' in BOARDS (hand-laid 4x3), its slot glows + drums in the lights list, light_slot_glow.png; rule 77 0/0; culdesac ratchet tightened to 28/28. NEXT: [the future boards]; new OPEN [the warehouse inside] (rule 74).
COMBAT TWO (combat2-8ca291aa): 10/9 (y) LATEST -- [boards by size] SHIPPED (rule 79): tools/bohemia_combat2_boards_by_size_cook_10_9_26.py writes fight_ground.json sized[kind][size] for street/suburb/lot/freeway/strip/works x small(2x2 blocks, window 9x7)/middle(3x2, 14x10)/large(4x3), laid by L.solve, with window, start_cols, terrain, cover, lights; runs at the end of the builder; gate LEG 1b. Verified by routing a sized board into the real fight (it builds 10x10/15x10, opens at 112 px). FOR COMBAT: dealOnce mixes blocks without the join rule; deal from sized. NEXT: [the casino floor]; new OPEN [the rest join] (rule 74).
COMBAT TWO (combat2-8ca291aa): 10/9 (x) LATEST -- [the freeway redone] SHIPPED (rule 77a): FL.freeway2 is now the street's kit at freeway width (R4.road_band asphalt, C[5] 3-in-12 dashes, walk-band curb + curb line), 2+2 lanes, Jersey barrier = new BT piece 'jersey' (LOW_COVER) in 6 m segments with a crossover gap, chain-link at the shoulders, the north sound wall deleted, new piece 'trailer' (COVER, blocks sight), median lamps in the lights list. Rule 77 freeway 0/0, gate green. [PENDING coordinator] the I-15 photo for reference/: this container cannot reach any photo host. NEXT: [boards by size] (rule 79: 9x7 / 14x10 / 20x15 from the Lego grammar; L.solve takes any grid).
COMBAT TWO (combat2-8ca291aa): 10/5 (w) LATEST -- [tiles are legos] SHIPPED (rule 77, Paolo 10/5): tools/bohemia_combat2_tiles_are_legos_cook_10_5_26.py reads every fight block's four edges from its picture (road / curb / yard / soil / water / other + the painted strokes that cross) into records/target/bb/BOHEMIA_GROUND_EDGES.json with the compass (NORTH up the screen); L.stud rings every town/freeway/desert block from one canonical strip (east and south mirrored, so touching pixels are identical); one cross-street tile (seeds 19-27, made outside the variants); FL.freeway2 overpass = the town's cross street, north verge yard; new block scrubroad; R4.strip re-cut onto the town street depth; the builder lays every board but desert/shore by L.solve, the wide board lays aprons by it too. Seams board/apron: freeway, suburb, strip, ruin, desert 0/0; culdesac 28/64, landfill 7/20, shore 3/16 in gates/tiles_are_legos_ratchet.json. Gate gates/tiles_are_legos_gate.py in the suite (slow: ~3 min, the stroke reader). NEXT: [settlement traits]. The culdesac board has no matching layout yet (its stem vs its sides) -- the first of 'the rest follow'.
COMBAT TWO (combat2-8ca291aa): 10/5 (v) LATEST -- [the wide board] SHIPPED: fight_ground.json boards[b].apron
(7 x 5 blocks with a one-block ring of the same city, playable tiles given) and boards[b].frames (phone_portrait,
phone_landscape, tablet, computer: rect in aproned px + letterbox share). FOR COMBAT: draw the apron, open on the
class's frame; the landscape classes have no bars. Tool tools/bohemia_combat2_the_wide_board_cook_10_5_26.py (the
builder should call it after pack; until then re-run it after any rebuild). OPEN: [settlement traits], [the casino
floor], [the future boards]. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/5 (u) LATEST -- [more building types] SHIPPED (round twenty): building fight
facts (pumps burn, canopy open, motel walkway and school roof and warehouse dock high ground, church steps low cover,
school fence see-through cover, casino dumpsters) in the building cook (FURN_MAKERS/FURN_META), in fight_ground.json
cover_extra (burns, see_through, kind). Three VOTE sheets. OPEN rows now: [the wide board], [settlement traits],
[the casino floor] (rule 74: three always). LESSON: check every placement against the block's grid BEFORE the
25-minute rebuild (three restarts this round). [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/4 (t) LATEST -- ROUND NINETEEN SHIPPED (rule 73): settlement nights re-cut with
night_sun() (night cook; linear light, adaptive multiplier >= 0.58 and to the 0.20 floor, pools lifted to 3:1),
each variant's numbers in settlement_ground.json night_measured; plain floor PASS on all six, sun-test lit:unlit
2.16-2.41 (3 asked; unreachable without white pools; the slider). fight_ground lights carry circuit
('grid'/'fire') and block [r, c] for the map's power. FOR COMBAT [night you can read]: use NB.night_sun's
numbers (x0.58+ linear, pools to 3:1), not the round-six 0.30. [PENDING]: none for Paolo; for the coordinator,
rule 73's sun-test 3:1 lit/unlit is not reachable with a 0.20 ground (measured).

COMBAT TWO (combat2-8ca291aa): 10/4 (s) LATEST -- ROUND EIGHTEEN SHIPPED: settlement pictures, two variants a
tier, each with a night_src (round six's night: his lamps and drums only), the camp filled out.
settlement_ground.json tiers[t].variants[] = {src, night_src, px, hotspots, lights}; tiers[t].src/hotspots
still point at variant 0 for RUN TWO's current reader. 12 webp, 2.9 MB. VOTE combat2-settlement-pictures-night-10-4.
NEXT: the fight boards' night with the same light (the manifest's lights; COMBAT draws it), more settlement
variants by trait (rule 71: a raided town, a market day). [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/4 (r) LATEST -- ROUND SEVENTEEN SHIPPED (rule 71a): settlement pictures for
RUN TWO, slices/settlement_ground/{camp,town,fortress}.webp (2060 x 1092, 45, lossless) + settlement_ground.json
(tiers[].hotspots{barber,clinic,stall,posts,board}.box in picture px). FOR RUN TWO: draw the picture, light
the box under the finger, name it only then. Tool tools/bohemia_combat2_settlement_pictures_cook_10_4_26.py.
VOTE combat2-settlement-pictures-10-4. WEAK/NEXT: the camp is sparse (more tarps, a fire ring, scrap);
seeded variants per settlement; night versions with the lamps. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/4 (q) LATEST -- ROUND SIXTEEN SHIPPED (rule 67, lines run through): every
curve crossing a block edge is periodic over 60 m (shore waterline/wade/ring, landfill haul road, scrub
track, wash meander in its depth); the desert and shore boards' washes run the full depth (explicit layouts
after BOARDS). 31 blocks, 5.1 MB. VOTE combat2-lines-run-through-10-4. NEXT: rule 69 is COMBAT's (the
character bank in the fight); this lane: the shore's deep-water seam under the lighter wade band, night
art per rule 70a's one light (lights data is in the manifest). [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/4 (p) LATEST -- ROUND FIFTEEN SHIPPED: the freeway and the landfill
re-cut (tools/bohemia_combat2_freeway_and_landfill_recut_cook_10_4_26.py: freeway2 with sound walls,
median, overpass variant 'freewayo'; landfill2 with benches, bales, tyres, switchback, vents, flare);
wired into the round-nine builder. 31 blocks, 5.1 MB. VOTE combat2-freeway-and-landfill-recut-10-4.
NEXT: lines across block seams (shore waterline, wash bed, landfill benches meeting scrub). [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/4 (o) LATEST -- ROUND FOURTEEN SHIPPED (rule 67): seven building types at
45 (tools/bohemia_combat2_building_types_cook_10_4_26.py: apartments, church, school, gas station, motel,
warehouse, casino back; tall sprites stand into the row behind), blocks main_street and the_works mixed
into the town boards (round-nine builder: HOUSES/TOWN palettes; cross streets avoid those columns).
fight_ground 30 blocks, 5.1 MB. VOTE combat2-building-types-10-4, combat2-buildings-in-the-fight-10-4.
NEXT (his sixth votes): RE-CUT THE LANDFILL AND THE FREEWAY ('look like dog shit'), lines that agree
across block seams (the shore's waterline, the wash's bed). [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/2 (n) LATEST -- ROUND THIRTEEN SHIPPED: slices/fight_ground is lossless
WebP now (23.6 -> 4.8 MB, pixel-identical where visible, manifest src -> .webp, fight code unchanged),
verified in the new fight at the phone profile (0 errors). The round-nine builder calls the packer last.
NEXT: night pools are COMBAT's to wire from boards[].lights; this lane: more cover kinds at 45 (dumpster,
fence runs, a bus), the shore's block seams. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/2 (m) LATEST -- [floor set] ROUND TWELVE SHIPPED: cross streets run
through whole board columns (streets_run_through in the round-nine builder; at most two a board; the
cul-de-sac stem's column continues), and fight_ground.json boards[].lights (lamp/drum, x_m/y_m sprite
base, live, radius_m) + light_*.png sprites, lights_key in the manifest: FOR COMBAT [rebuild]: at night
draw live pools (round six's look) instead of the flat wash. 27 blocks, 23.8 MB (site over cap; PLUMBER).
VOTE combat2-streets-run-through-10-2. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/2 (l) LATEST -- [floor set] ROUND ELEVEN SHIPPED (sweep L): boards no
longer clone one row. tools/bohemia_combat2_mixed_blocks_cook_10_2_26.py (suburb_seeded: houses per seed,
burnt one in six, an optional cross street column; empty_lots) feeds round nine's builder, whose BOARDS
are now seeded layouts from PALETTES (no twin beside or above; the cul-de-sac's stem is carried south).
slices/fight_ground: 26 blocks, 22.8 MB (site over cap; PLUMBER). Verified in the new fight (suburb,
strip; phone profile; 0 errors); VOTE combat2-mixed-boards-in-the-fight-10-2. WEAK: cross streets stop
at the block edge (they do not continue into the block above or below); night still a flat wash in
the fight. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/2 (k) LATEST -- [floor set] ROUND TEN SHIPPED: verified on the real
surface. The new fight loads slices/fight_ground; phone-profile captures (culdesac, desert; far and near;
0 page errors) are the VOTE sheet (combat2-the-ground-in-the-new-fight-10-2). Fixed round nine's weak
spots: scrub wears the wash's two soils (no boxed wash), landfill's freeway stub gone. fight_ground
19.2 MB (site already over the 260 MB cap; PLUMBER). NEXT: night as art in the manifest (the fight
currently lays a flat blue wash for night; round six's lit pools could ship as a light layer per
board), shore seams between blocks. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/2 (j) LATEST -- [floor set] ROUND NINE SHIPPED (rule 63): the ground
for the NEW fight. slices/fight_ground/fight_ground.json + block_*.png + cover_*.png: eight boards
(suburb, culdesac, strip, ruin, desert, freeway, shore, landfill), each 20 x 15 house tiles of
515 x 364 = 4 x 3 blocks, terrain[15][20] (flat/rough/debris/water/height/blocked, BB AP in the key),
cover placements in metres, start_rows [4, 9]. FOR COMBAT [rebuild]: load the manifest, draw a board's
blocks at block offsets (5 tiles = 2575 x 1820 px each), read terrain per tile, drop cover PNGs at
x_m*42.9, y_m*42.9*cos45. COST FLAGGED: +18 MB published (site was already 331 MB over the 260 cap,
now 349; PLUMBER's call whether to trim variants). WEAK: the wash blocks' soil does not match the scrub
around them (boxed); landfill's freeway stub ends abruptly. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/2 (i) LATEST -- [floor set] ROUND EIGHT SHIPPED: store fronts at 45
on the strip lot, the 45 house on the cul-de-sac and (burnt) on the ruin, the big board re-drawn.
Bank banks/BOHEMIA_STORE_FRONTS_AND_HOUSES_EVERYWHERE_10_2_26.txt, VOTE
combat2-store-fronts-and-houses-everywhere-10-2. NEXT: block seams on the big board (a street that
meets a back yard), night boards re-cut with the 45 houses. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 (h) LATEST -- [floor set] ROUND SEVEN SHIPPED (sweep J, rule 61):
the house at 45 (hip roof, stucco face, door/window/garage, drive, shadow; pitched = blocked) and the
big board, 20x15 house tiles from the kinds as 5x5 blocks, start lines 5 apart (layout in the bank,
for COMBAT [board size]). Bank banks/BOHEMIA_THE_HOUSE_AT_45_AND_THE_BIG_BOARD_10_1_26.txt, VOTE
combat2-houses-at-45-and-the-big-board-10-1. NEXT: put the 45 house into the cul-de-sac, ruin and
night boards too; seams between blocks (a street that meets a back yard); store-front facades.
[PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 (g) LATEST -- [floor set] ROUND SIX SHIPPED (rule 59 night-lit):
the suburb block and strip lot at night (snapped to his palette, his lamps and drums as the only
light, a light[5][5] lit/dark tag from the drawn pools). Bank
banks/BOHEMIA_THE_FIGHT_BOARDS_AT_NIGHT_10_1_26.txt, VOTE combat2-night-boards-10-1. The cook takes
~4 min (palette snap over 250k allowed colours). NEXT, FIRST (rule 61, COMBAT [board size]): the
board kinds are 5x5; Battle Brothers' board is twenty-plus across with lines five apart, so re-cut
every kind at COMBAT's board size (the plan generator takes N; the cutter seeds it). Then store-front
facades, the casino floor.
[PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 (f) LATEST -- [floor set] ROUND FIVE SHIPPED (rules 57, 59): the
shore, the landfill and the ruin as 5x5 boards with terrain tags (new tag 'water': wade, 3 steps,
defence malus). Nine board kinds in three banks (round 3, 4, 5). Bank
banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_5_10_1_26.txt, VOTE combat2-shore-landfill-ruin-10-1.
NEXT: store-front facade tile, the casino floor interior, night light as a tile property.
[PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 (e) LATEST -- [floor set] ROUND FOUR SHIPPED 7cbf69f (rules 57, 59):
suburb block, strip lot, scrub, freeway boards (5x5, 45, cover placements) and a terrain[5][5] tag on
all six kinds (flat/rough/height/blocked, read off the drawn masks, per the BB school table). Bank
banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_4_10_1_26.txt, VOTE combat2-four-more-board-kinds-10-1.
NEXT: store-front facade tile, landfill, shore, ruin (debris). [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 (d) LATEST -- [floor set] ROUND THREE SHIPPED (rule 57): the first
two board kinds, CUL-DE-SAC and DESERT WASH, each a 60 m plan cut into 25 house tiles at 45 with a
cover placement list. Bank banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_10_1_26.txt, VOTE
combat2-the-board-kinds-10-1, record records/BOHEMIA_COMBAT2_THE_FLOOR_SET_10_1_26.md (round three).
NEXT: suburb block, strip lot, scrub, freeway (same tool, new kind functions). The desert pools
'boulder' list is lava/coral: never use it. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 (c) LATEST -- [floor set] ROUND TWO SHIPPED (his fifth votes,
rule 56): real sidewalks (1.4 m on 9.2 m, ruler guard), the 45 camera (tiles 515x364, south faces
seen, cars with flanks), a north-south street tile; cover sheet re-cut at 45. VOTE
combat2-the-floor-set-r2-10-1. Record: records/BOHEMIA_COMBAT2_THE_FLOOR_SET_10_1_26.md (round two).
NEXT: rule 57, a sheet per board kind, CUL-DE-SAC and DESERT WASH first (no row line yet for it
on the board; the coordinator's note on [floor set] names it). [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 (b) LATEST -- [cover pieces] SHIPPED. Seven cover pieces at
42.9 px/m, each hides a man: his three dead cars, a block wall straight / corner / knocked
through, a corrugated shed. Bank banks/BOHEMIA_THE_FIGHT_COVER_10_1_26.txt, VOTE
combat2-the-cover-pieces-10-1, records/BOHEMIA_COMBAT2_THE_COVER_PIECES_10_1_26.md. The floor set's
walks and slab quieted (same bank, rebuilt). QUEUE EMPTY: both rows shipped; COMBAT 1 drops them
in. Left weak: north-south street sun pass. [PENDING Paolo]: none.

COMBAT TWO (combat2-8ca291aa): 10/1 LATEST -- [floor set] SHIPPED. Nine house-sized ground tiles
(small street, crossing, big street two halves, freeway lane, two lots, slab, standable roof) and
two cover pieces (his own dead car sprite, a block wall), all at 42.9 px/m from the 7/28 bank,
guarded (size, his colours, seamless, not stamped, cover hides a man). Bank
banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt; VOTE combat2-the-floor-set-10-1; how COMBAT 1 drops
them in: records/BOHEMIA_COMBAT2_THE_FLOOR_SET_10_1_26.md. NEXT: [cover pieces] (the shed, calmer
slab and walk bands, north-south sun pass). [PENDING Paolo]: none.

