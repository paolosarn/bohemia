# WORLD THIRTEEN (one file per lane, written only by WORLD THIRTEEN; newest block on top)

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
