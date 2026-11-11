# WORLD THIRTEEN, ROUND FOUR, STEP ONE: THE PIECE THAT ANSWERS IT (11/11/26)

VAMILY rule 429(a)(b)(c), 430; ask lines 504, 505, 506 (and row 586 in passing). BUILD 11/11a - THE PIECE THAT ANSWERS IT.
VOTE world13-the-piece-that-answers-it-11-11 (stand_in, his phone's own pictures).

The coordinator 11/11: '(1) the fight-answer table finished: every building kind on the map names the board piece that answers it
... COMBAT THREE now holds the boards' half and will read your table from your handoff, so write the seam there plainly.'

## 1. MEASURED FIRST

The one table (records/target/bb/map_fight_kinds.json, 11/7) said what a kind IS in a fight (storeys, in or on the roof, cover,
what blocks). It did not say WHICH PIECE of the fight's kit stands for it, and the fight never asked it: a fight on the map sends
only its district and cell (cityHandOver, slices/BOHEMIA_CITY_WORLD.html), the shell guesses a kind with a regex (nfKind in the
alpha and the demo), and the fight picks its pieces from three other tables and its cut code:
- the board kind: records/target/BOHEMIA_BOARD_KINDS.json districts[].boardKind (87 rows; the beltway had none);
- the block families: records/target/bb/ours.json board_grounds (43 districts, 15 grounds), the first leading on half the slots;
- the place boards: ours.json place_boards (15 places, each its districts, its landmark block, its field): dealt FIRST;
- the cut from the map (slices/bohemia_street_board.js plan/lay): tile kinds by painter class, the street kit's houses, buildings
  (BUILDING_BY), ground and street pieces, the fight's cover.
BohemiaFightKinds was read by the fight in one place only (housesIn: the storey mix).

## 2. THE PIECE

`tools/bohemia_world_thirteen_pieces.py` writes into every row of the one table the piece that answers it, read off what the fight
does today, so nothing the fight deals changes; the sync carries it into engine/bohemia_fight_kinds.js word for word, and
`BohemiaFightKinds.piece(name)` / `.families(name)` answer it on every page that loads the module (the map, the fight).
- piece.deal, every map kind: kind, ground, families (the block families of fight_ground.json it deals, the first leads), lead,
  place ('place_<name>' where a built place stands there) with its landmark block and field blocks, stand_in where the fight has
  no block of the kind's own, with what is wanted (BOARD_KINDS familiesWithNoBlock: the civic interior, the apron, the compound).
- piece.cut, every row: the cut's tile kinds and the kit pieces it lays ('house:ranch_porch', 'building:warehouse',
  'ground:apron', 'streets:*', 'cover:trailer'), stand_in with what is wanted where the kit has nothing of its own.
- The town's lots, landmarks and wall, your own lot's pieces deal the town's board (deal 'town'); the house models name
  themselves; the four real places out on the region with no map kind (the lab, Lenzie, Spring Mountain Ranch, Callville Bay)
  deal the board of the closest kind (the lab yard, the power plant, the farm, the marina).
- Counts: 88 map kinds, 35 dealt on a place board, 24 on a stand-in board; 34 block families, 88 blocks, 31 boards, 39
  street-kit pieces, 130 cover pieces in the kit, every name the table uses one of them. The beltway now has its row (the
  freeway's).
- WANTED (the stand-ins, for COOK and COMBAT THREE): the civic interior (city hall, the courts, the jails, the police and fire
  stations, the medical centre, the radio), the apron (the airports, the speedways, the stadiums, the terminal), the compound
  (the arsenal, the data fort, the granary, the fort, the substations, the pumps, the water plant); in the cut, a garden
  apartment slab, a tower a fight can live beside, a tank, a container, a scrap heap, a watch post, a shack, a tent, a stage.

## 3. ROW 586 (THE NEWS DOWN THE ROAD, red on main): FIXED

Since the Callville Bay camp (WORLD 14, 7adce071) stood beside it, LAKE BOHEMIA was raided 27 times a year, every 13 days: a
raid stopped new crews for one week only. engine/bohemia_region_news.js: a town a crew took has nothing worth the walk for two
weeks (PICKED_CLEAN_DAYS 14: the week it stands raided, then a week to restock); no crew sets out for it, and a crew that reaches
it inside that finds it picked clean and takes nothing (Battle Brothers: a raided village is not raided again until it recovers).
The most-raided place is now APEX, 17 a year. The gate 28/0.

## 4. GATES

- the_map_kinds_have_fight_answers 22/0: NEW F15 every row names its piece; F16 every name is the kit's own; F17 the pieces are the
  fight's own (re-derived, in step) and the engine carries them; F12 planted now 8/8 (suburb's piece taken out, a family the kit
  does not have, a building the kit does not have: each red); NEW P4 on the fight page on a phone upright (390 x 844) and on its
  side (844 x 390): dealt a board for every one of the 88 map kinds the way a fight on the map asks, 88 of 88 lay only the blocks
  the table names; planted, the same boards read against the wrong kind's pieces, 84 of 88 off.
- the_news_down_the_road 28/0.

## 5. NEXT

(2) the 15 place boards as templates the generator places wherever that kind of place lands, held over 22 seeds (rule 430: every
asset kept, only layout, placement and rules change); (3) the cut: the fight's board cut from the map cell it starts on, with
COMBAT THREE through the seam in handoffs/WORLD_THIRTEEN.md.

[bb] Battle Brothers' every location type names its own fight map; ours names, for every kind the map draws, the piece of the
fight that stands for it, and says plainly where the piece is still a stand-in.
[analog horror] the airport's apron is still a stand-in: a flat grey field, one shed, a fence, and nothing to hide behind.
