# WORLD THIRTEEN, ROUND ONE: ONE TABLE, AND A STREET IN FRONT OF EVERY HOUSE (11/7/26)

VAMILY rules 429(b), 429(d), 426(a), 423(b)(c)(d), 428(b), 429(f); ask lines 492, 505 (and 507 for the many seeds).
BUILD 11/7o - EVERY HOUSE ON A STREET.

Paolo 11/7: 'maybe the combat map is just the whole map itself... for every building that we have on the regular map we need to
answer for that in the combat map'; 'each house should be connected by road or mini road'; 'if there's a house there's a street in
front... even on the big map scale'; 'this has to work when the world gets procedurally generated'.

The coordinator's order for this lane: (1) one table, (2) the streets in the world's generation, (3) the 15 place boards' layouts
written into the map, (4) the cut. This round ships (1) and (2). (3) and (4) are next (section 6).

## 1. ONE TABLE: EVERY MAP KIND'S FIGHT ANSWER

`records/target/bb/map_fight_kinds.json`, a modder's file (draft:true words). Every kind the map draws gets a row:

| what | how many | from |
|---|---|---|
| map block kinds | 88 | the generator's DISTRICT (engine/bohemia_overmap.js; the painter's own ~79 plus WORLD TEN's 9) |
| a town's lots | 12 | VB_TOWN_K (box, gable, shacks, trailers, tents, containers, yard, garden, plaza, lot, scrap, watch post) |
| a town's landmarks | 23 | VB_TOWN_MARKS (chapel, mast, prison, casino, truckstop, ... suburbs) |
| a town's wall and towers | 3 | the wall (a man on its walk), the corner tower, the gate tower |
| your own lot's pieces | 10 | records/target/bb/home_lots.json |
| the house models on the map | 6 | slices/bohemia_map_houses.js (the five ranches, the trailer) |

Each row: `storeys` (a mix over 1, 2, 3 that sums to 1; one storey a slight defence and no range, two defence and range, three
rare and more, rule 428(b)), `man` (in_or_roof: in it, its walls his cover, or on its roof, its storeys his height, NO LADDER,
423(c)(d); or in, roof, open, none), `cover`, `open_cover`, `blocks` (walls, fence, water, cliff, rows, barrier, rail),
`street_front` (426(a): true for every houses kind, false only for the trailer park), `place` (the place board it fights on today),
`picture` (a debt: what the map draws there today when it is not yet what the row says).

NO FELT NUMBER LIVES IN IT. What a storey does in numbers stays in ours.json (roof_storeys, height_is_accuracy, cover_defence),
TUNING's and COMBAT TWO's. The storey mixes are a reading of the real valley's housing (tract houses mostly one or two storeys,
three rare), his to correct: suburb 50/45/5, estate 30/60/10, gated 40/55/5, apartment 0/60/40, trailer 100/0/0.

`engine/bohemia_fight_kinds.js` carries the same rows word for word (written by
`tools/bohemia_world_thirteen_fight_kinds_sync.js`, never by hand) and answers `answer(kind)`, `storeysOf(kind, roll)`,
`roofOK(kind)`, `painterMix()`. Namespaces: `suburb`, `townlot:box`, `townmark:chapel`, `townworks:wall`, `home:kitchen`,
`model:ranch_plain`.

ONE ROLL, TWO PLACES. The map's painter now stands each house as tall as the table says on the house's own roll (it was one house
in seven two storeys, a roll the fight never shared). `window.vbHouseStorey(gx, gy, lot)` in the map answers the fight the same
storey for the same house.

MEASURED on the demo (phone): the valley's 13,805 standing houses read one storey 49%, two 46%, three 5%; the tallest house on the
painting 25.2 T (the old two-storey top about 17 T).

## 2. A STREET IN FRONT OF EVERY HOUSE, IN THE WORLD'S GENERATION

MEASURED BEFORE, six seeds (1337, 7, 42, 2026, 99, 31337): of about 2,760 house blocks a valley (suburb, estate, gated,
apartment) 28 to 33 in 100 had no street on any side; the biggest lump of houses with no street between them 26 to 33 blocks;
11 to 26 lumps with no street at all. Inside a block the painter stood two by two or three by three houses with no way between,
so a three-by-three block's middle house fronted nothing. On boards cut at the suburbs, 151 of 563 house tiles (27%) had a street
tile beside them: his '4 x 4 of house tiles'.

NOW:
- THE GENERATOR (engine/bohemia_overmap.js `houseLanes(m)`, `__A_STREET_IN_FRONT_OF_EVERY_HOUSE__`): every house block carries
  its own street, one byte a block (its way, east-west or north-south; which ends run on; which sides a neighbour's street comes in
  through as a T). The way is picked so it JOINS: a 0-1 breadth first from every mile street (straight on before a T, so streets
  run long through the tract). A pocket no mile street can reach (one to four blocks out on the desert or the rim) gets a track out
  onto whatever ground a man can cross. The trailer park keeps its own lanes, the one exception. buildOvermap writes it on the
  tiles (t.lane); the page recomputes it whenever any block's kind changes (a real place re-seated, a town).
- THE PAINTER (slices/BOHEMIA_CITY_WORLD.html, the houses case): the street down the block's middle, one fight tile wide (12 m:
  a sidewalk and a gutter each side, a lamp every other lot, a car left at the kerb now and then), a row of three houses each side,
  every one facing it a yard back from the sidewalk, block walls between the back yards, an estate's pool down the side, a gated
  tract's wall with its gate where the street runs out; a T takes one lot of a row; an unjoined end is a turning bulb (a cul-de-sac,
  his 10/1 ask). Apartments: two buildings a row set back from the street, their parking in front under dark carport roofs (the
  way the valley's complexes shade their cars; it also keeps the apartments reading apart from the trailer parks on the painting).
  The house models face their street (bohemia_map_houses.js pick, lot 32+). Under a home base's square no house street is laid:
  the town's own lots and lanes paint over the blocks there (and the towns land a moment after the map, so the streets are
  re-read when they do).
- THE FIGHT gets it for free: the board is cut from these texels (slices/bohemia_street_board.js plan, COMBAT TWO's code, untouched).

MEASURED AFTER, 22 seeds (429(f)): 60,720 house blocks, every one with its own street; every house block in a lump that touches a
mile street is joined to it street to street (0 missed); the lowest valley 98.6% joined, the rest are 608 pocket blocks in all,
none sealed in. On boards cut at the suburbs: 557 of 557 house tiles (100%) have a street tile beside them. 13,884 of 13,884 models
face their street. The fight's own board check (the_board_is_the_city_at_that_spot) 194/0 after its truth learned the house
streets from the generator's byte (a second road to the same answer, never the painter).

## 3. GATES

- `gates/the_map_kinds_have_fight_answers_gate.js` 16/0 (three runs): F1-F4 every kind has a row; F5 well formed; F6 every house tile a man can
  be on, no ladder; F7 three storeys rare; F8 every houses kind on a street but the trailer park; F9 the painter's class agrees;
  F10 the engine is the file; F11 the painter reads the table; F13 22 generated valleys, every kind that lands answered; F12
  PLANTED FAIL (suburb taken out, a ladder, three storeys common, a new kind with no row, a house with no street: 5/5 red); P1-P3
  the page.
- `gates/a_street_in_front_of_every_house_gate.js` 10/0: N1-N5 on 22 seeds; N6 PLANTED FAIL (streets taken away, streets turned
  across: both red); P1 the painter paints it (2,689 of 2,712 block middles street); P2 the fight's board 100% (before 27%); P3
  the models face it; P4 nothing threw.
- Touched and re-run on the final code: the_map_stands_up 13/0; the_houses_stand_up_close 28/0; the_board_is_the_city_at_that_spot
  194/0 (three runs at once, each 194/0); the_map_streets_join 6/0; the_far_end_is_painted 11/0; the_strip_reads_as_the_strip
  green; pages_publish 28/0; attempt 15/0; handoff 10/0; demo_build 25/0. Red and red on main too (measured on a clean main
  worktree, not this lane's): inlined_fresh (PEOPLE's ambitions banner), derived_freshness (the faction records), the_map_stands_taller
  W1, W3b, C1 (phone) and W4 (computer).
- CHECKER EDITS, each one marked __A_STREET_IN_FRONT_OF_EVERY_HOUSE__ or __FIGHT_KINDS__ and each because the old reading could not
  see the new street, never to make a red go away: the_map_stands_taller H1 holds the storeys at the old roll so it measures the
  TALL factor alone; the_map_stands_up U7's mutation lays the street-layout houses flat too (it went green when it should go red,
  now red again at 6.0 T) and D1 leaves a house block's own street out of the family's colour (the mile streets were never a
  family); the_houses_stand_up_close M2 reads the yard's own height under a model, not the picture's depth (a freeway berm in
  front covered 16 of 67 yards on the picture); the_board_is_the_city_at_that_spot's truth reads the house streets off the
  generator's byte, and it waits for the home bases to land before it reads (it read half before and half after under load).

## 4. THE PICTURES

The VOTE card world13-a-street-at-every-house-11-7: the suburb at the street stop on his phone, the house streets off and on, in
the same game; and the fight cut from the map there. Stage STAND-IN (the houses are the ranch models; the two-storey picture is
owed).

## 5. NOTES TO OTHER LANES (nothing of theirs touched except where named)

- COMBAT TWO: the table is `BohemiaFightKinds` (engine/bohemia_fight_kinds.js); the map answers `vbHouseStorey(gx, gy, lot)` for a
  house's storey (lot is the painter's LOTS index, L[j + 9]). Your lay() still makes one roof in seven ('height') on its own roll:
  one marked line can read the map's storey instead, so a house is the same height on the map and in the fight. Your board gate's
  truth now reads the house streets from the generator (one block, marked __A_STREET_IN_FRONT_OF_EVERY_HOUSE__).
- RUN: gates/the_map_stands_taller_gate.js H1 holds the storeys at the old roll (window.__FIGHT_KINDS_OFF) so it measures the TALL
  factor alone; one marked block.
- COOK FOUR: the table's houses are 45 in 100 two storeys and 5 in 100 three: the map's models are all one-storey ranches. A
  two-storey and a three-storey house model are owed (the `picture` field names the debt).

## 6. NEXT (this lane, in the coordinator's order, with 429(f)(g)(h) landed this round)

1. 429(h), the map's half: every building (a store, a warehouse, a casino) fronts a road on one joined network, roads one to four
   tiles wide; the gate over 20+ seeds with its planted fails.
2. 429(c)+(f): the 15 place boards (fight_ground.json boards place_*) become templates the generator places wherever that kind of
   place lands, seeded, with variation; the map paints them; the fight reads them back by being the map.
3. 429(g): the land-use layer.
4. 429(a): the cut, judged against the boards he liked, with COMBAT TWO through handoffs/.

[bb] Battle Brothers lays its battlefield from the world tile it is fought on; ours is the same street the map drew, every house on
it. [analog horror] the same quiet street, block after block, every one ending in a bulb you only see once you are in it.
