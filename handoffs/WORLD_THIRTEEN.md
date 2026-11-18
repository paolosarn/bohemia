# WORLD THIRTEEN (one file per lane, written only by WORLD THIRTEEN; newest block on top)

WORLD THIRTEEN (11/18, round seven, build one): BUILD 11/18o - THE PAINTING NEVER WAITS IN LINE, BUILT, NOT YET SEEN (rule 453;
asks 440, 475). Record: records/BOHEMIA_WORLD_THIRTEEN_THE_PAINTING_NEVER_WAITS_IN_LINE_11_18_26.md. VOTE
world13-the-painting-never-waits-in-line-11-18 (STAND-IN).
- The whole painting (vbCityReady) is asked of the painters' pool (vbTileSend), never VB.worker's line behind the land past the map:
  the first after the page opens 10.5 s -> 2.4 s, warm 2 to 3 s both ways. VB_CITY_ON_VB the old way (plant). VBT.queue: a job with
  every painter busy waits its turn (it was painted on the page). The reaper replaces a dead painter. VBC.askAt / VBC.landMs.
- TRIED AND TAKEN BACK: the painting in four stitched quarters (no gain warm, and it changes buildings' rolls); in the record.
- FOR PLUMBER 8: on this box the far stop's long frames are the software GPU (getImageData readbacks), the page thread 77 in 100 idle.
- Gate THE MAP PAINTS ON EVERY CORE now 7 legs (Q6 the whole painting on the pool). Neighbours green (in the record).

WORLD THIRTEEN (world-thirteen-01gkdyuw): 11/17 LATEST -- (the START head until 11/18o) round six, build three: BUILD 11/17zq - THE MAP PAINTS ON EVERY CORE, BUILT, NOT YET SEEN (rule 453(3);
rules 418(c), 441; asks 440, 475). Record: records/BOHEMIA_WORLD_THIRTEEN_THE_MAP_PAINTS_ON_EVERY_CORE_11_17_26.md. VOTE
world13-the-map-paints-on-every-core-11-17 (STAND-IN).
- THE MEASURE: tools/bohemia_world_thirteen_map_speed.js (the demo at a phone's size, --throttle, --valleys, --pool, --quick,
  --stops, --json; the same spots run to run). Its first table (4x) is in the record: the near stop 21 to 52 s to fill.
- THE BUILD (slices/BOHEMIA_CITY_WORLD.html __THE_MAP_PAINTS_ON_EVERY_CORE__): vbTilePool (half the cores, 1 to 3), vbTileSend,
  vbTileReap, VBT.fly/flying/idle/pool; VB_QUICK_S 60 (a bare close tile asked at 60 first). VBT.busy keeps its meaning.
- THE GATE: gates/the_map_paints_on_every_core_gate.js (solo, it times; about 20 min, --quick 8 min): Q1 to Q5 6/0, the alpha on its
  side included. Neighbours green: the houses stand up close 28/0, the map stands up 13/0, the map's streets join 6/0, the near end
  is the block 7/0, the Strip reads as the Strip 5/0.
- RED ON MAIN, NOT MINE: EVERY TOWN LOOKS ITS OWN, '*** THE HEART LOOKS LIKE THE CITY ***' (heart 4.6 T, edge 1.9 T), the same on
  main and on main before my 11/17q: COOK's gate (rule 186(b)).
- FOR PLUMBER 8 (the freeze rows): the far stop on a new valley is the whole painting (12 million texels) on VB.worker, 20 s at 4x;
  sliding frames of 2 to 14 s on this box while tiles and the painting land (its four cores shared with SwiftShader).
- OWED, MINE: the whole painting split across the pool by bands; the close tile's 12 x 12 block margin cut by what stands up at
  that zoom; the 15 place boards' layouts painted onto the map at their cells.

WORLD THIRTEEN (11/17, round six, build two): BUILD 11/17zd - EVERY ZONE ITS GROUND, BUILT, NOT YET SEEN (rule 453(2); rules
429(a)(g); asks 504, 507, 508). Record: records/BOHEMIA_WORLD_THIRTEEN_EVERY_ZONE_ITS_GROUND_11_17_26.md. VOTE
world13-every-zone-its-ground-11-17 (STAND-IN).
- land_use.json zones[z].place (+ place_by_district) -> map_fight_kinds.json piece.deal.zone_place (tools/bohemia_world_thirteen_pieces.py,
  then the fight-kinds sync) -> the map's vbZoneGround in cityHandOver -> FIGHT_OPTS.ground -> the fight's placeOwn (one marked line).
- 22 valleys: 81.2 in 100 of the cells deal a place board's own ground (was 51.0), 10.8 the freeway's board. Gate EVERY ZONE ITS GROUND
  14/0, in the suite.
*** THE SEAM, FOR COMBAT THREE (the fields only grew; nothing of yours moved but one marked line): ***
- FIGHT_OPTS.ground now also carries:
    zone_place  'place_<id>': the place board whose own blocks the cell's ground is (its own place, else its zone's); null where the
                cell deals its own (strip malls, civic buildings) or the freeway's board
    land        a road cell's land (the commonest kind beside it, ring by ring out to four)
    street      for a road cell its own way { way, ends, mouths (a house street's mouth kept), road }; for a dirt track
                { way, ends, mouths, track: true }
    track       the dirt track's bits (1 N, 2 E, 4 S, 8 W)
    sides       { n, e, s, w }: the map kind on each side of the cell
- ONE MARKED LINE in your placeOwn (__EVERY_ZONE_ITS_GROUND__): with opts.ground.zone_place (and no opts.template) the place is the
  zone place, ahead of the shell's district. MEASURED: a road cell's fight carries a nearby block's district ('school', 'park',
  'trailer'), so a mile street through the desert dealt the suburbs'. It is yours from here.
- OWED READS, YOURS IF YOU WANT THEM: dealZone's mix-in kinds come from the shell's district (a desert road mixes a 'park' golf
  block in): ground.district (the road's own stems, strip, lots) or ground.land is the cell's truth; ground.sides could close a board's
  edge (water, the freeway's berm, the mountain); a street's ends a dead end.
- NEXT, MINE (rule 453(3)): the map measured on a cheap phone at every zoom on many seeds (tools/bohemia_world_thirteen_map_speed.js).

WORLD THIRTEEN (11/17, round six, build one): BUILD 11/17q - EACH ZONE LOOKS LIKE ITSELF, BUILT, NOT YET SEEN (rule 453; rules
429(g)(h); asks 508, 509). Record: records/BOHEMIA_WORLD_THIRTEEN_EACH_ZONE_LOOKS_LIKE_ITSELF_11_17_26.md. VOTE
world13-each-zone-looks-like-itself-11-17 (STAND-IN).
- THE WORKS AS SHEDS UP CLOSE: VB_TALL.closeK { works 1.1, shops 1.4, casinos 2.5 } on the close tiles (S at least 96); the homes
  and the freeway keep the far stretch (THE HOUSES STAND UP CLOSE M3 holds them).
- THE DESERT HAS ITS TRACKS: landTracks(m, lanes) in engine/bohemia_overmap.js (re-inlined), t.track per block (bits 1 N, 2 E,
  4 S, 8 W, as a lane's ends); the page's vbTracksValley() (none under a home base's square); the painter's packed strip and two
  ruts. 718 track blocks on 22 valleys join 369 of 389 pockets; the gate THE GENERATED WORLD HOLDS counts them (G1 99.8, G2 99.5).
*** FOR COMBAT THREE: a fight on a track block still sends FIGHT_OPTS.ground with street null; build two adds the track and the
  zone's own ground table to it (the seam below stays, the fields only grow). ***
- RED ON MAIN, NOT MINE: THE MAP STANDS TALLER W1 (the near stop's glass), W3b (the berm), C1 (timing): 20/6 on main without this
  build, 21/5 with it. RUN's (it holds the near stop's glass and the berm walk).
- NEXT, MINE (rule 453): (2) each zone's cells handed to COMBAT THREE with their ground; (3) the map measured on a cheap phone at
  every zoom on many seeds.

WORLD THIRTEEN (world-thirteen-01gkdyuw): 11/14 LATEST -- (the START head until 11/17q) round five: BUILD 11/14c - THE GENERATED WORLD HOLDS, BUILT, NOT YET SEEN (rules 429(f)(g)(h), 447; asks
507, 508, 509). Record: records/BOHEMIA_WORLD_THIRTEEN_THE_GENERATED_WORLD_HOLDS_11_14_26.md. VOTE world13-the-generated-world-holds-11-14.
- On 22 valleys: one joined road network (99.5 in 100 of the road blocks; off it only dirt-track pockets and Strip stubs), 98 in 100 of
  the building lumps on it and 99.76 fronting a road, houses under 30 in 100 with the desert, the works, the Strip and the lake
  each its share. Gate gates/the_generated_world_holds_gate.js 8/0, in the suite.
*** THE SEAM, FOR COMBAT THREE (the cells no place stands on): ***
- FIGHT_OPTS.ground = { cell: [gx, gy], district, zone (land_use.json's), cls (the painter's class), building, ground and kind
  (the board ground and board kind the one table names), families (its block families), street: { way: 'ew'|'ns'|null, ends (bits:
  1 the west/north end runs on, 2 the east/south), mouths (bits: 1 N, 2 E, 4 S, 8 W: a side street comes in) } or null }.
  Sent by the map's cityHandOver for a fight that starts on a cell no place stands on; a place's cell sends FIGHT_OPTS.template
  instead (11/11h). Nothing in the fight reads FIGHT_OPTS.ground yet: it is yours to cut a board there.
- OWED, MINE: the pockets' dirt tracks joined across the desert to the network (generator and painter), a road to the lake's intake;
  the painter writing the 15 place boards' layouts onto the map at their cells.

WORLD THIRTEEN (11/11, round four, step three): BUILD 11/11h - THE CUT, BUILT, NOT YET SEEN (rule 429(a)(c), 430; ask line 504).
Record: records/BOHEMIA_WORLD_THIRTEEN_THE_CUT_11_11_26.md. VOTE world13-the-cut-11-11 (STAND-IN).
*** THE SEAM, FOR COMBAT THREE (step three, the fight's half): ***
- The map's cityHandOver now sends msg.template = { id, board: 'place_<id>', tx, ty, flip (false for now), cell: [gx, gy] } for a
  fight that starts on a cell of one of the 15 places the map stood (vbTemplateAt); the shell's nfOpts hands it on as
  FIGHT_OPTS.template (a boss's own board first).
- I put ONE MARKED BLOCK in your BOHEMIA_FIGHT.html, dealOwn (__THE_CUT__), and one field in dealt() (cut): with
  opts.template for that place, the place's own board block for block (fight_ground.json boards place_<id>), not the shuffle;
  housesIn after as before. It is yours from here: move it, keep it, or replace it; the gate the_places_are_templates P3 holds
  the outcome (a map hand-over on the suburbs' place is dealt that board block for block).
- OWED, YOURS: start the crew on the cell's tiles (template.tx..tx+2, ty..ty+2) instead of the start rows.
- every_place_no_seams is RED on main without my build too (suburb 19.7% / 14.0% against a 4% floor): yours.
- NEXT, MINE: the painter writes each place board's layout into the map at its cells (row 504), so the map shows what the fight
  stands there.

WORLD THIRTEEN (11/11, round four, step two): BUILD 11/11b - THE PLACES ARE TEMPLATES, BUILT, NOT YET SEEN (rules 429(a)(c)(f), 430;
asks 504, 506, 507). Record: records/BOHEMIA_WORLD_THIRTEEN_THE_PLACES_ARE_TEMPLATES_11_11_26.md. VOTE
world13-the-places-are-templates-11-11 (STAND-IN).
- records/target/bb/place_templates.json (the 15 place boards: kinds = the fight's place_boards districts, per_valley, min_cells,
  spacing, mirror, the Strip's slack); placeTemplates/templateAt in engine/bohemia_overmap.js (synced by
  tools/bohemia_world_thirteen_place_templates_sync.js, then re-inline the generator); m.templates, m.templateAt(x, y) lazy.
- The map page: vbTemplatesValley(), vbTemplateAt(x, y) -> { id, board: 'place_<name>', tx, ty (the block's top-left tile on the
  board), flip, x0, y0 } or null; no cell under a home base's square.
- Gate gates/the_places_are_templates_gate.js 11/0 (22 valleys; the page upright and on its side), in the suite.
- THE SEAM FOR COMBAT THREE, STEP THREE (next build): cityHandOver will send msg.template = vbTemplateAt(cell) with the fight; the
  fight, when it has one, stands G.boards[msg.template.board] (mirrored if flip) and starts the crew on the template's tiles
  (tx..tx+2, ty..ty+2) of it. Your board path for it is the one opts.board already takes (BOHEMIA_FIGHT.html setup: 'else if
  (opts.board && G.boards[opts.board])'): passing board: msg.template.board is enough to stand it whole.
- NEXT: (3) the cut.

WORLD THIRTEEN (11/11, round four, step one): BUILD 11/11a - THE PIECE THAT ANSWERS IT, BUILT, NOT YET SEEN (rule 429(a)(b)(c), 430;
asks 504, 505, 506; row 586 FIXED). Record: records/BOHEMIA_WORLD_THIRTEEN_THE_PIECE_THAT_ANSWERS_IT_11_11_26.md. VOTE
world13-the-piece-that-answers-it-11-11 (STAND-IN).

*** THE SEAM, FOR COMBAT THREE (the boards' half). Read this, nothing else of mine needed: ***
- WHERE: engine/bohemia_fight_kinds.js (the fight already loads it, BOHEMIA_FIGHT.html line 33). window.BohemiaFightKinds.
- CALL: BohemiaFightKinds.piece(district) -> { deal, cut }. district is what cityHandOver already sends (opts.district).
  deal = { kind, ground, families: [...block families of fight_ground.json, the first leads], lead, place: 'place_<name>' or null,
  landmark: a block name (place only), field: [block names] (place only), stand_in: bool, wants: words }.
  cut = { tiles: [the cut's tile kinds], pieces: ['house:<model>' | 'building:<name>' | 'ground:<name>' | 'streets:<piece>' or
  'streets:*' | 'cover:<name>'], stand_in, wants }. piece('townlot:box'), piece('townmark:tank'), piece('home:kitchen'),
  piece('model:ranch_porch') the same (their deal is the town district's). BohemiaFightKinds.families(district) the deal list alone.
- WHAT IT IS TODAY: written from YOUR tables (BOHEMIA_BOARD_KINDS.json, ours.json board_grounds and place_boards) and your cut code
  (bohemia_street_board.js BUILDING_BY, plan()'s tile kinds), so reading it changes nothing a fight deals: measured on the fight
  page, all 88 map kinds dealt only from the blocks it names (gate the_map_kinds_have_fight_answers P4, upright and on its side).
- TO MAKE IT THE ONE SOURCE: dealOnce/placeKinds/placeOwn can read piece(opts.district).deal instead of the three tables (one
  marked line each), and nfKind's regex in the alpha and the demo can go (cityHandOver sends the district; the fight asks the
  table). Until you switch, tools/bohemia_world_thirteen_pieces.py re-derives from your tables, and F17 goes red the moment the
  table and your tables disagree: change yours, run the tool, run tools/bohemia_world_thirteen_fight_kinds_sync.js.
- STAND-INS WANTED (24 map kinds dealt on a catch-all; the cut's stand-ins): the record's section 2 lists them.
- STILL OWED FROM 11/7: lay() makes six map houses in seven solid walls; the table says every house is a tile a man can be on
  (423(c)); BohemiaFightKinds.roofOK(name) answers it.

- ROW 586, FIXED: engine/bohemia_region_news.js PICKED_CLEAN_DAYS 14 (a town a crew took is left alone two weeks; a crew that
  finds it picked clean takes nothing). THE NEWS DOWN THE ROAD 28/0; the most-raided place APEX 17 a year (was LAKE BOHEMIA 27).
- TOOLS: tools/bohemia_world_thirteen_pieces.py (writes the pieces; --check), tools/bohemia_world_thirteen_piece_shots.js OUTDIR
  [kinds] (the fight on a phone for each kind, its dealt blocks in pieces.json).
- NEXT, IN THE COORDINATOR'S ORDER: (2) the 15 place boards as templates the generator places, held over 22 seeds (430); (3) the cut.

WORLD THIRTEEN (11/10, round three): BUILD 11/10j - THE CORNERS JOIN, BUILT, NOT YET SEEN (rule 442(d), the map's half; ask line 547;
COMBAT TWO shipped the boards' half as 11/10f). Record: records/BOHEMIA_WORLD_THIRTEEN_THE_CORNERS_JOIN_11_10_26.md. VOTE
world13-the-corners-join-11-10 (STAND-IN).
- THE GENERATOR: laneMouths (engine/bohemia_overmap.js, inside houseLanes): a mile street's own byte carries the mouths (16/32/64/128 a
  side street in from N/E/S/W). The page re-runs it after a home base's square takes its streets, then clears the squares again.
- THE PAINTER (__THE_CORNERS_JOIN__, slices/BOHEMIA_CITY_WORLD.html road case): the mouth's walk, gutter, lamp and pylon open 4.55 to
  7.45 q, a crosswalk across, the sidewalks turning the corner; the T's roadway runs through (houses and works); the works drives have
  a sidewalk and gutter now.
- GATES: NEW the_corners_join 7/0 (22 valleys node; 5 valleys x 6 tiles x 3 zooms in the page; planted shut / wide / kerb each red).
  Registered in the suite with my three older ones (kinds 17/0, a street in front 10/0, zones 9/0), all marked slow. the_map_streets_join
  J1 now reads a mouth as a join and waits for the towns (6/0). After the rebase: the board 193/0 alone, COMBAT TWO's the_streets_join
  13/0, every_building_on_the_road 9/0, home_base 86/0.
- NAMED FOR BOSSES (not hidden): the_first_boss_changes_the_map moves with where the boss lands, and the gate lands him somewhere new
  every run (freshStart takes Date.now ^ Math.random when no campaign code is set). G1 measured: main (ebfefc6e) 3 of 3 green; main
  f03752fd green G1 but red C1b once; this build with the corners switched off 2 of 2 green; this build 1 of 6 green (its C1b red too).
  No input of his ground reads anything this round changed (bossPlace, makeGround, cityRoute, cityWalkable and its three wraps,
  cityStepMins, freshStart: the map's kinds and the walk only; the street bytes reach only the painter's two inputs). Lopsided, not
  explained: BOSSES, pin the gate's campaign code (WORLD_SEED) so G1 and C1b measure the same place every run, then it says which.
- THE DEPLOY: shipped to main a66075f7 (VOTE sha 12986bd7). pages run 4398 (12986bd7) FAILED, all three deploy tries did not land
  (GitHub's side: 4396 before it SUCCESS); the workflow sent its fresh run 4402 (576b813d, carries a66075f7), on try 1 when this was
  written. Until a run carrying a66075f7 is SUCCESS the live site may still be 11/10i or older: the stamp says which.
- TOOLS: tools/bohemia_world_thirteen_corner_shots.js OUTDIR LABEL [X,Y,DX,DY] (the phone at a mouth, near and street stops).
- NOTES OWED: COOK FOUR: an apartment block at the street stop is a tall grey striped stack (the painter's slab, no close-up model),
  with the house models next door drawn over it; on main before this round too. The works models stay owed.
- NEXT, IN THE COORDINATOR'S ORDER: (3) the 15 place boards (fight_ground.json boards place_*) as templates the generator places, every
  asset kept (430), the template format first; then (4) the cut, with COMBAT TWO.

WORLD THIRTEEN (11/10): BUILD 11/10c - THE VALLEY HAS ITS ZONES (ship adb18098), BUILT, NOT YET SEEN. Record:
records/BOHEMIA_WORLD_THIRTEEN_THE_VALLEY_HAS_ITS_ZONES_11_10_26.md. VOTE world13-the-valley-has-its-zones-11-10 (STAND-IN). His vote 11/9 on
world13-a-street-at-every-house-11-7: YES.
- (1) ZONES, SHIPPED (429(g)): records/target/bb/land_use.json (twelve zones, shares, rules, streets); landUse() in engine/bohemia_overmap.js
  after the districts, before the real places: the works along the rail and I-15 and the two parks, no house inside the works, the
  estate seam, trailer parks on the cheap edge. 22 seeds: industry 2.8-3.4% (was 0.6-0.8), the cheap edge 0.7-1.0% (was 0.2-0.3).
  Gate gates/the_valley_has_its_zones_gate.js 9/0.
- (2) THE TABLE, EXTENDED: every map kind its zone (F14). COMBAT TWO's fight already loads engine/bohemia_fight_kinds.js.
- 429(h) THE MAP'S HALF: every works block a truck drive (houseLanes, LANE_WORKS), a container yard at a dead end, cross streets every
  third block through back-to-back house rows. The rest of the map's buildings (resorts, downtown packed together) next.
- TOOLS: tools/bohemia_world_thirteen_inline_generator.py puts the WHOLE generator into the map page (run it after every engine edit;
  Z5 holds it); tools/bohemia_world_thirteen_land_use_sync.js; tools/bohemia_world_thirteen_zone_map.js (a valley's zones as a picture).
- NOTES OWED: COMBAT TWO: its lay() still makes six map houses in seven solid walls (one marked line can read BohemiaFightKinds.roofOK,
  423(c)); its board gate is 193/0 alone and moved to 190/2 once under load (S1 at an industrial spot, K1 blockers at seed 7's Strip):
  it re-rolls valleys inside the page while the frame loop runs, a likely cause not proven. COOK FOUR: the works blocks up close are
  the painting's boxes (no models, unlike the houses); with the works now a corridor, a warehouse and a shed model are owed.
- NEXT, IN THE COORDINATOR'S ORDER: (3) the 15 place boards (fight_ground.json boards place_*) as templates the generator places
  where that kind of place lands, every asset kept (430), the template format first; then (4) the cut.

WORLD THIRTEEN (11/7, after the ship): THE COORDINATOR'S ROUTINES (rules 430, 429(f)(g)(h)) READ; the round's order is now (1) zones,
(2) the table (SHIPPED), (3) templates, (4) the cut, with 429(h) (every building on one road network) under (1) and (3), and 430 (every
asset of the 15 boards kept and used; only layout, placement and rules change).
- MEASURED FOR 429(g), 22 seeds (tools/bohemia_world_thirteen_zones_measure.js, every district read into twelve zones): the zones all
  exist but the balance is not the real valley's: houses 29.2-30.7% of the map, mile streets 25.5-27.9%, open land 18.8-20.9%,
  transport 12.1-13.2%, commercial 3.6-4.3%, the Strip 2.3-2.4%, green 1.3-1.9%, water 0.8-1.0%, INDUSTRY 0.6-0.8%, civic 0.4-0.6%,
  downtown 0.3-0.4%, the cheap edge (trailer parks, swap meets) 0.2-0.3%. Industry is scattered single blocks: 2,328 house blocks touch
  one, 6 sit inside one. NEXT: the land-use file (zones, share ranges from the real valley's zoning, adjacency rules, a street pattern
  per zone), an industrial corridor by the rail and I-15, the cheap edges by the freeways and the industry, then the gate over 22 seeds
  with planted fails; then every non-house building on the network (97 in 100 built blocks already touch a street; the misses are
  resorts and downtown blocks packed together).

WORLD THIRTEEN (11/7, chat 02m, the map's generation and ONE MAP; VAMILY rule 429, asks 492, 504, 505, 507, 508, 509). BUILD 11/7o (ship f5880ae8) -
EVERY HOUSE ON A STREET. BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_THIRTEEN_ONE_TABLE_AND_A_STREET_AT_EVERY_HOUSE_11_7_26.md.
VOTE world13-a-street-at-every-house-11-7 (stage stand_in).
- (1) ONE TABLE, SHIPPED: records/target/bb/map_fight_kinds.json (a modder's file): 88 map kinds, the town's 12 lots, 23 landmarks
  and its wall and two towers, your lot's 10 pieces, the map's 6 house models: storeys (a 1/2/3 mix), in or on the roof (no
  ladder), cover, what blocks, a street in front. engine/bohemia_fight_kinds.js (BohemiaFightKinds) carries it word for word
  (tools/bohemia_world_thirteen_fight_kinds_sync.js writes it). The painter stands each house as tall as the table says on its
  own roll; vbHouseStorey(gx, gy, lot) answers the fight the same storey. Gate gates/the_map_kinds_have_fight_answers_gate.js.
- (2) THE STREETS, SHIPPED: engine/bohemia_overmap.js houseLanes(m) (__A_STREET_IN_FRONT_OF_EVERY_HOUSE__): every house block its
  own street down its middle, joined to a mile street straight on or as a T, a pocket's track out, the trailer park the one
  exception; the painter lays it (the houses case: a sidewalk each side, a row of houses each side facing it, a bulb where it ends);
  the models face it (bohemia_map_houses.js pick, lot 32+). The fight gets it by being cut from the map. Gate
  gates/a_street_in_front_of_every_house_gate.js (22 seeds). Before: 27% of house tiles on suburb boards had a street beside them;
  now 100%.
- NEXT, IN ORDER: 429(h) the map's half (every building, not only houses, on one joined road network, roads 1 to 4 tiles); 429(c)+(f)
  the 15 place boards (fight_ground.json boards place_*) as templates the generator places where that kind of place lands; 429(g)
  the land-use layer; then 429(a) the cut with COMBAT TWO.
- NOTES OWED (in the record, section 5): COMBAT TWO (lay()'s one-in-seven roof can read vbHouseStorey; its board gate's truth now
  reads the house streets, one marked block); RUN (the_map_stands_taller H1 holds the old storey roll, one marked block); COOK FOUR
  (a two- and three-storey house model are owed: the table is 45 in 100 two storeys).
