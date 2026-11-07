# THE BOARDS WEAR THEIR DRESSING (COMBAT TWO, 11/7/26)

Rule 419, ask line 479. Paolo 11/7: "it feels like you got rid of the rest of the maps, we need more love and better shit."
Reopened by the coordinator for one round. BUILD 11/7g - THE BOARDS WEAR THEIR DRESSING. BUILT, NOT YET SEEN. VOTE combat2-the-boards-wear-their-dressing-11-7 (stage
stand_in): records/target/COMBAT2_THE_BOARDS_WEAR_THEIR_DRESSING_11_7.webp, the fight's first frame on his phone upright, before
(the bare 11/6h board) and after, one camera set by hand for both (tools/bohemia_combat_two_the_boards_dressed_bench_11_7_26.js,
_sheet_11_7_26.py): the desert, the Strip, the suburb at the demo's door (its dressing mostly under the fight's fog: houses block sight).

## WHAT WENT WRONG (measured, main 53a5b228)
COMBAT TWO's 11/6h (rule 407(g) step one) lays a fight from the map out of the map's own block INSTEAD of the district's template
boards. The layout came back (the map's streets, houses and lots tile for tile) and the dressing went: the template boards he liked
on 11/4 ("we're doing good on the combat maps") carried COMBAT MAPS 3's hand-made props, cover, roofs, the floor's effects, the
places' set pieces and where the two sides start, and the laid board carried the map's dead cars, its lamps and the burned
houses' rubble, nothing else. 407(f) said nothing of the fight is torn down; the boards' dressing was.

THE COUNT (gates/the_board_is_the_city_at_that_spot_gate.js, the new K1 leg, run on main before the fix): the gate's 3 valleys x 6
districts, each spot dealt twice in the fight with the same seed and cell: the TEMPLATE it dealt before 11/6h (opts.street false)
and the laid board. 18 of 18 spots poorer on 2 to 6 of the 6 counts. Worst: the Strip 76 props to 0, the desert 39 to 0, downtown's
roofs 94 to 0-5, the suburb's props 86 to 21-34, every place's own start (their camp, a pincer, wide) gone to the plain line.
The counts, the same on both boards, over the whole 20 x 15 board: PROPS the pieces standing on it; COVER tiles where a man hides
(COVER or LOW_COVER, rule 170(a)); BLOCKERS tiles nobody steps on; ROOFS the high ground (every height tile); EFFECTS the floor's
effects (rule 59: rough, rubble, water, fire); DISTINCT the different pieces.

## THE TABLE (template before 11/6h / the bare laid board of 11/6h / **the dressed laid board now**)
| valley | spot | template (before 11/6h) | props | cover | blockers | roofs | effects | distinct |
|---|---|---|---|---|---|---|---|---|
| 2691674296 | suburb [58,24] | yards | 86 / 32 / **114** | 86 / 32 / **114** | 0 / 126 / **105** | 49 / 28 / **49** | 26 / 32 / **57** | 2 / 11 / **23** |
| 2691674296 | strip [43,31] | stripw + blvd + stripe | 76 / 0 / **79** | 76 / 0 / **81** | 107 / 90 / **107** | 8 / 4 / **8** | 0 / 0 / **0** | 7 / 0 / **20** |
| 2691674296 | downtown [46,24] | fremont | 64 / 4 / **74** | 64 / 4 / **75** | 34 / 92 / **34** | 94 / 3 / **94** | 2 / 4 / **4** | 9 / 4 / **29** |
| 2691674296 | industrial [80,60] | rail | 48 / 9 / **63** | 48 / 9 / **63** | 49 / 80 / **80** | 0 / 10 / **10** | 0 / 9 / **9** | 2 / 5 / **15** |
| 2691674296 | town [12,88] | yards | 86 / 12 / **102** | 86 / 12 / **102** | 0 / 73 / **36** | 49 / 12 / **49** | 26 / 12 / **38** | 2 / 9 / **26** |
| 2691674296 | desert [22,87] | desert | 39 / 0 / **46** | 39 / 0 / **46** | 6 / 3 / **9** | 30 / 1 / **31** | 48 / 27 / **66** | 3 / 0 / **10** |
| 7 | suburb [22,24] | yards | 86 / 34 / **126** | 86 / 34 / **126** | 0 / 117 / **86** | 49 / 18 / **49** | 26 / 34 / **60** | 2 / 12 / **26** |
| 7 | strip [43,31] | stripw + blvd + stripe | 76 / 0 / **79** | 76 / 0 / **81** | 107 / 81 / **107** | 8 / 3 / **8** | 0 / 0 / **0** | 7 / 0 / **24** |
| 7 | downtown [46,25] | fremont | 64 / 0 / **70** | 64 / 0 / **73** | 34 / 82 / **34** | 94 / 0 / **94** | 2 / 0 / **2** | 9 / 0 / **20** |
| 7 | industrial [24,71] | rail | 48 / 22 / **75** | 48 / 22 / **77** | 49 / 62 / **62** | 0 / 10 / **10** | 0 / 22 / **22** | 2 / 11 / **20** |
| 7 | town [81,88] | yards | 86 / 9 / **96** | 86 / 9 / **96** | 0 / 82 / **43** | 49 / 10 / **49** | 26 / 81 / **107** | 2 / 7 / **26** |
| 7 | desert [73,89] | desert | 39 / 0 / **43** | 39 / 0 / **43** | 6 / 8 / **10** | 30 / 4 / **34** | 48 / 24 / **48** | 3 / 0 / **13** |
| 4242 | suburb [77,24] | yards | 86 / 21 / **111** | 86 / 21 / **111** | 0 / 135 / **109** | 49 / 23 / **49** | 26 / 21 / **47** | 2 / 11 / **22** |
| 4242 | strip [51,33] | stripw + blvd + stripe | 76 / 0 / **76** | 76 / 0 / **80** | 107 / 97 / **107** | 8 / 6 / **8** | 0 / 0 / **0** | 7 / 0 / **18** |
| 4242 | downtown [53,24] | fremont | 64 / 16 / **84** | 64 / 16 / **84** | 34 / 75 / **34** | 94 / 5 / **94** | 2 / 16 / **16** | 9 / 11 / **30** |
| 4242 | industrial [19,33] | rail | 48 / 22 / **74** | 48 / 22 / **74** | 49 / 75 / **75** | 0 / 9 / **9** | 0 / 22 / **22** | 2 / 11 / **20** |
| 4242 | town [81,88] | yards | 86 / 16 / **94** | 86 / 16 / **94** | 0 / 53 / **14** | 49 / 10 / **49** | 26 / 88 / **113** | 2 / 9 / **24** |
| 4242 | desert [80,10] | desert | 39 / 7 / **51** | 39 / 7 / **51** | 6 / 18 / **22** | 30 / 5 / **35** | 48 / 7 / **48** | 3 / 5 / **16** |

Every spot now at least the template on every count (K1 18 of 18); the demo's own door (W1, the suburb at 58,24) the first row.

## HOW (slices/bohemia_street_board.js dress(); the fight: slices/BOHEMIA_FIGHT.html __THE_BOARDS_WEAR_THEIR_DRESSING__)
The map's layout is never touched: no street, house, lot or building moves (THE BOARD IS THE CITY AT THAT SPOT stays green, H1/H2
houses and S1/S2 streets 100% on all 18 spots). The fight deals, first, the very template the same spot deals (templateDeal: the
deal and its cover fitted, exactly the template branch), then lays the map's block and dresses it with that template, seeded by
the spot, so no two boards are the same (rule 46, 9/29):
1. LIFTED TILES. A template tile that carries something (a baked prop, a cover piece, rough, rubble or water, a rise, a lamp or a
   drum) is lifted WHOLE onto a laid tile of the same ground: its own picture (a source rect of its block's own picture: the ground
   entry reads 'block_yards_1.webp#3,1', h when mirrored), its terrain, its cover entry, its light. Its own place first. Elsewhere
   (the nearest that fits, 6 tiles at most) only a tile whose border is the place's own bare ground (a pool, a boulder, a wall's
   end held inside it): a pattern that runs on (the wash's bed, a road) stays where it lay or does not come. Never asphalt (the
   map's streets keep COOK TWO's kit), never a building's roof or wall (a picture cut through a building reads broken: tried and
   thrown away this round, see WEAK), never a tile a building south of it stands up into.
2. THE TEMPLATE'S OWN PIECES that did not come with a tile (a dead car on its asphalt, a jersey barrier, a shed, a boulder) stand
   on the laid streets and open ground nearest where they stood, at the same place inside the tile; a baked piece with no picture
   of its own takes the kit's nearest of its kind (a car is a car).
3. ROOFS AND HIGH GROUND: the map's houses, then its low buildings, become roofs you can get onto (third votes: high ground is a
   roof) until the board has the template's roofs, never taking its blockers under the template's; then the kit's masses you
   climb (a container, a stack of bales) and the rubble heaps you stand on (a rise: a wolf may walk it), against the buildings.
4. THE FLOOR'S EFFECTS: more of the template's own rough, rubble and water where it holds it inside its tile; where none fits, the
   kit's rubble pile on rubble ground (BB snow, slow).
5. BLOCKERS: the kit's masses (a container, bales, a dead dozer, the sign) against the buildings, where still short.
6. THE KIT by context until the board carries the template's props, cover and distinct pieces, then 4 to 7 more on every board
   (the alleys: propane, drums and cones, tyres; the yards' junk: tyres, a cart, a rolled car; the burned blocks: the heap and the
   rubble pile; the Strip and the lots: the barrier, sandbags, a patrol car, a wreck, a cart corral; a casino's front: the dead
   sign, twice a board at most). The lanes are filled last; a car lies along its street.
7. WHERE THE TWO SIDES START: the template's own (line, wide, their camp, a pincer) and its camp on the nearest open tile.
8. THE GROUND: the board's bare yards and dirt, and the ground under its houses, take the template's own bare ground (its median
   light, a tile with a wall's shadow cut at its edge left out), so a lifted tile sits in its own ground; the ring round the board
   too, a quarter of it the template's dressed tiles (seen, never walked).
Level 2 everything; level 1 nothing new that blocks a step (asked when 2 cuts his line from theirs); 0 bare (last). opts.dress false
deals the bare board (the gate's M4, a bench).

## THE KIT GREW (rule 419(c); tools/bohemia_combat_two_the_boards_wear_their_dressing_11_7_26.py)
28 pieces, 268 KB, slices/fight_ground/street_board/kit/: the master rig's own renders of 16 approved models (records/target/
master_rig/cook_*: 45 degrees, one sun, the source pass, their contact shadow), cut from 57 to 42.9 px a metre, two facings where a
piece has a long side. EVERY ONE IS A STAND-IN (rule 408(c), stage stand_in in dressing.json): none has DIRECTION's PASS against
the bar. THE ONE GOLDEN CANDIDATE is the burned block's rubble pile (sb_rubble_S, 0 of 8 out on the rig's own card), to DIRECTION's
eye first (408(b)); the rest are remade from its recipe once he passes it. The lift table (88 blocks x 25 tiles: asphalt share,
light, border light, family) is the only other new data; the lifted tiles are drawn from the blocks' own pictures (no new bytes).

## GATES RUN (one at a time, rule 13)
THE BOARD IS THE CITY AT THAT SPOT 194/0 (was 170/0; K1 18 new legs, M4 6 new legs: the bare 11/6h board is caught on every boot
spot). AUTO AT 4X NEVER CRASHES: A1 to A5 ok; A6 (the demo through the map's own door, 11 against 16, AUTO at 4x,
the laid and dressed board) ran red once because the box restarted under it ("Target page, context or browser has been closed"),
then ran alone: over, won in 7 rounds, 0 errors, the pictures' peak 335 MB under the 450 MB ceiling, the tab 1,384 MB on the map and
2,185 MB at the fight's peak (COMBAT 10's own after: 1,203-1,435 -> 1,978-2,122 MB; this board's peak is about 60 MB over its worst,
the template's two or three block pictures the lifted tiles are drawn from: named for PLUMBER 7). THE CAMP IS PITCHED ON THE BOARD
14/0 (the camp's board is the laid board, its fingerprint 'laid'). THE ZOOM DOWN INTO THE BOARD 22/0 (MOTION's way in, on the
dressed board). THE WHOLE LOOP PLAYS 11/0. The kit's 28 pictures: purity 0 purple, 0 lava (gates/bohemia_purity_gate.py check_png).
VOTE TAB 62/4 with the card registered, the same four red on main 13ca3774 (two DYNASTY cards with no where, the alpha landing on RUN not VOTE, the gear's VOTE): none this round's. PIL worked on this box (the kit, the lift table, the sheet).

## COST
A laid board now loads the template's two or three block pictures it lifts from (each 2575 x 1820, 0.2 to 0.6 MB on the wire, about
19 MB decoded) and the kit pieces it stands (2 to 15 KB each); the template boards loaded twelve or more blocks. The template deal
before the lay is a few milliseconds.

## FOR MOTION (the way into a fight) AND CAMP THREE
The entry point is unchanged: FIGHT.setup(opts). The laid boardDef keeps its shape (laid, roofs, street) and gains start and camp
(the template's); laid.ground entries may now be 'block_<name>.webp#col,row[h]' (a tile of a block's picture; BohemiaStreetBoard.
picOf(entry) gives the picture); laid.sprites may carry kind 'kit' (a container, bales, a heap, a dozer, the sign standing on a
whole tile); laid.cover entries may carry tx, ty (the tile a tall kit piece stands on); laid.dressed says what was put on. THE LAID
PICTURE CHANGED (it is dressed); its streets, houses and buildings are where they were.

## WEAK, SAID OUT LOUD
- Built tiles were lifted onto the map's built blocks' bare ground first: a shop row or a casino floor cut through at the tile's
  edge read as broken art. Thrown away. So downtown's 94 roofs come from the map's own buildings made climbable and about 30 kit
  masses (containers, bales, heaps): downtown reads as a container yard between warehouses, repetitive. A row of the template's own
  shopfronts laid whole along a laid block is the better answer; not this round.
- The Strip's template is mostly asphalt with its props baked in; its 76 props come back as the kit's cars, barriers and sandbags
  on the laid boulevard and walks, not the template's own planters and welcome sign.
- The kit is stand-ins (408(c)); the golden candidate has not been to DIRECTION.
- A plan handed whole (a gate, a bench) cannot grow (rule 378(b)): a crew too big for the laid board's open ground deals the
  template on the bench; the game asks the map again at the grown size.
- The template's own pieces moved off their asphalt keep the template's in-tile spot, so a moved car can sit across a kerb.

[bb] Battle Brothers dresses every tactical map from its tile's own doodads; ours dresses the map's own street with the template
boards' own tiles and props and the rig's.
[analog horror] the same block the map showed a second ago, and now you see what was left in it: a patrol car across the lane, the
yard's pool drained, a sign that still points at a casino nobody runs.
