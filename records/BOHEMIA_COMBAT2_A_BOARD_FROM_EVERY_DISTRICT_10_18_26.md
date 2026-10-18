# A BOARD FROM EVERY DISTRICT (COMBAT TWO, 10/18/26, [a board from every district], rule 52, rule 117)

A CANDIDATE (rule 100). Nothing to slices/, engine/ or the demo. VOTE `combat2-a-board-from-every-district-10-18`
(redo of `combat2-the-board-cut-from-the-map-10-18`), sheet `records/target/COMBAT2_A_BOARD_FROM_EVERY_DISTRICT_10_18.webp`.
The map read: `tools/bohemia_combat2_read_the_district_cells_10_18_26.js` (drives the demo, about a minute and a half)
-> `reference/art_bank/fight_board/COMBAT2_DISTRICT_CELLS_10_18.json` and the five near-stop pictures. The cut:
`tools/bohemia_combat2_a_board_from_every_district_cook_10_18_26.py` (seeded, about 4 minutes). Manifest
`reference/art_bank/fight_board/COMBAT2_DISTRICTS_10_18.json` (every piece, every count below, the cover in metres, the
lights, the terrain per house tile, the pack keys). The five boards regenerate bit for bit (.gitignore there).

## WHY THIS ROUND
The row: 'a fight on the Strip and a fight in the suburbs must look like the places they are'; one board cut from
each district of the region (the Strip, downtown, the suburbs, the wash, the industrial edge) with that district's
ground, buildings and blockers, side by side in VOTE from the game's camera; rule 117, a board you read in one look;
houses stay house-sized. It follows his 10/18 YES on the board cut from the map and his YES on the one-look board
('sure, better direction, not final').

## HOW THE PACK DID IT (rule 100c; measured off his tiles as bought, the ones these boards stand on)
| his tile | size | opaque | colours | mean | saturation | light, top-left vs bottom-right |
|---|---|---|---|---|---|---|
| '1. Cracked contrete tiles' #0 (the walk, the bank) | 96x94 | 93% | 3,969 | #70665a | 0.10 | 106 / 103 |
| '1. Cracked street tiles' #0 (the road) | 94x96 | 94% | 2,324 | #3a3737 | 0.03 | 59 / 57 |
| '2. Soil and dirt tiles' #18 (the suburb's yard) | 96x92 | 92% | 4,510 | #8b5d3b | 0.40 | 105 / 102 |
| '2. Soil and dirt tiles' #22 (medians, gravel, tracks) | 96x92 | 92% | 5,002 | #8f5e3b | 0.41 | 106 / 106 |
| '2. Soil and dirt tiles' #0 (the wash's sand) | 92x96 | 93% | 4,680 | #a66d41 | 0.44 | 123 / 122 |
| 'Cargo, crates and containers' #32 (the works) | 96x94 | 78% | 3,460 | #2b2926 | 0.06 | 56 / 29 |
| 'Rocks and stones (1)' #2 (the bed's boulder) | 96x96 | 69% | 5,508 | #483c25 | 0.32 | 80 / 48 |
| '6. Chain link fences' #0 (wash, works) | 96x73 | 43% | 1,387 | #21201d | 0.06 | 37 / 28 |
What it says: (1) THE GROUND IS LIT FLAT AND THE THINGS ARE LIT FROM THE TOP-LEFT: every floor tile reads the same
brightness in both quarters (106/103, 59/57), every standing piece is brighter top-left (the container 56 against 29,
the boulder 80 against 48). A board laid from his tiles has one light because the pack has one. (2) THE PACK'S
DENSITY IS 1,400 TO 5,500 COLOURS A 96-PX TILE, the ground at the top of that range: a cooked flat colour beside it is
the AI tell (rule 114) and nothing on these boards is a flat fill except COOK FOUR's roof decks (his own field laid
his way). (3) HIS SOILS ARE ALL WARM AND SATURATED (0.33 to 0.44 over all 24); the concrete (0.10) and the asphalt
(0.03) are the only quiet grounds he sold. So a district that is paved in life (the Strip, downtown) is laid on his
concrete, never his soil, and the soil is kept for the yards he said yes to, the medians, the works' gravel and the
wash's sand. (4) HIS PROPS ARE DRAWN IN ONE 96-PX BOX, so a container and a cone are the same size as bought (round
one's finding): every prop stands at the integer scale nearest its real size (x2 for cars, trees, lamps, containers,
boulders, chain link), never under 1x.

## HOW BATTLE BROTHERS DID IT (rule 41; reference/library/battle_brothers/02_COMBAT_RULES.md)
'A fight is generated from the map terrain where it happens (forest tiles block sight, hills give height, swamps cost
more AP to enter, snow slows)', and a fight in or by a settlement stands in that settlement's buildings. The place is
read off the ground and the blockers, never off a label; terrain is a rule (high ground +10% to hit, low ground -10%).
OURS: five districts, five grounds, five sets of blockers, each cut from a real block of the map; the terrain per
house tile is written beside each board (blocked, part blocked, low, rough, flat), and the wash's channel floor is
LOW ground: the bank shoots down into it (BB's -10%, rule 59's translation, for COMBAT and TUNING to read).

## THE RULER IS WORLD'S, AND MY LAST ROUND'S WAS WRONG
WORLD [the one ruler] (72a83f32, a note on my row): the map's fine cell is 0.75 m. The demo's own cells paint a lane
four cells and a line (3.4 m), a house 17 x 12 cells (12.8 x 9 m); LANE_W = 2 is the 7/16 graphics engine's, which the
map does not paint. I read 1.8 m last round. So: a house tile (11.5 m) is 15.3 fine cells, COOK TWO's 1.44 m cell is
1.92 fine cells, and every map roof is laid as ONE piece where it stands, at 1:1. The round before's three boards
([the board at Battle Brothers' size]) are 2.4 times too stretched; that sheet stays as it was, a candidate he can
kill, and this round's boards supersede it as the map cut.

## THE FIVE BLOCKS (the map's own district word, the word nfKind hands the fight)
Chosen by tools/bohemia_combat2_read_the_district_cells_10_18_26.js: for each district the block with the most of
its own family around it, ties to the nearest the party (48,48). The industrial edge must have at least one block of
something else beside it (the edge).
| district | map block | the map's word | its family around (of 8) | blocks from the party | window (fine x, y) | feature share | room to fight |
|---|---|---|---|---|---|---|---|
| THE STRIP | 44,48 | strip | 8 | 4 | 149, 99 | 24% | 76% |
| DOWNTOWN | 47,25 | downtown | 8 | 24 | 85, 139 | 47% | 52% |
| THE SUBURBS | 57,51 | suburb | 8 | 12 | 133, 115 | 28% | 69% |
| THE WASH | 20,43 | wash | 3 | 33 | 45, 147 | 33% | 95% |
| THE INDUSTRIAL EDGE | 80,61 | industrial | 3 | 45 | 37, 139 | 38% | 53% |

The board is the middle board, 14 x 10 house tiles (161 x 115 m, 215 x 154 fine cells, 9,184 x 6,480 px): the routine
fight's size (rule 79). Its window's middle stays inside the district's own block and slides, eight fine cells a step,
to where the district's FEATURE (its roofs; the wash's channel) and room to fight are most even.

## WHAT GOES WHERE (nothing drawn, rule 108; every pixel his pack's or COOK FOUR's file at 1:1)
- THE STRIP: the boulevard's lanes on COOK TWO's road cells (the lane dashes stay off: one look); the planted median
  on his soil #22 with one dead tree a stretch (the map's 2 x 2 solids down the median are its palms; no palm exists
  in the bank, a named hole); the wide walks and the resort's forecourt paved with COOK TWO's concrete (a planted band
  wider than 12 m is no median); the resort's roof as COOK FOUR's gravel field laid his way, with his casino along its
  south edge; the map's lamps, spaced.
- DOWNTOWN: flat roofs packed tight (each map roof a gravel deck the shape of its own cells), COOK FOUR's two-storey
  corner shop along every south edge that has room, then the casino and the motel; the courtyards and alleys paved;
  the map's parking lot with the map's own parked cars (its 4 x 2 solids), one a house tile; a dumpster a building.
- THE SUBURBS: each map roof one of COOK FOUR's five tan ranches, the width nearest the roof's within the room
  between its neighbours, never one kind twice running (the plain one cut to its body, below); the map's block walls
  thinned to one line, whole; his soil #18 (the yards he said yes to); a dead tree a house at most.
- THE WASH: the map's flood channel: COOK TWO's concrete as the banks, and as the floor the same road-cell recipe with
  his sand where the asphalt would be, so his slab's south face falls where the bank drops to the floor; chain link
  along the map's lines; the desert bed beside it in his sand with his boulders where the map has rock and creosote
  where it has brush.
- THE INDUSTRIAL EDGE: the works' roofs as gravel decks with COOK FOUR's warehouse along their south edges (the gas
  station where the run is short: it reads as the yard's office and pumps); the map's 12 x 3 m trailer rows as his
  containers end to end (grey and green; the blue and the purples too loud for the vibrance-down rule); chain link along
  the map's fence lines; the suburb's ranches and back walls across the street (the edge).
- ON ALL FIVE: one fire barrel with its scorch; cracks only along the kerb; the map's lamps, none within two house
  tiles of another; one wreck a stretch of street, none at a crossing; nothing stands on a roof.

## THE COUNT, AT THE OPENING FRAME (the board whole on an upright phone, 1,170 device px; rule 104a)
| | the strip | downtown | the suburbs | the wash | the industrial edge |
|---|---|---|---|---|---|
| the ground (share of the board) | roadway 33.5%, walk 34.9%, yard 7.1%, roof 23.9% | roadway 16.9%, walk 17.2%, yard 19.6%, roof 45.0% | roadway 16.7%, walk 13.2%, yard 38.8%, roof 27.8% | roadway 15.6%, walk 29.2%, yard 16.0%, channel 32.2%, desert bed 1.4% | roadway 37.8%, walk 5.9%, yard 9.9%, roof 37.2%, trailer rows 6.9% |
| houses (COOK FOUR's ranches, one a map roof) | 0 | 0 | 53 | 0 | 16 |
| shop fronts / roof decks | 2 / 3 | 21 / 36 | 0 / 0 | 0 / 0 | 6 / 3 |
| other things standing | 31 | 32 | 322 | 224 | 256 |
| of them, by kind | barrel 1, car 11, lamp 6, tree 13 | barrel 1, car 16, dumpster 10, lamp 5 | barrel 1, car 10, lamp 4, tree 12, wall 295 | barrel 1, boulder 1, car 1, chain 212, creosote 9 | barrel 1, car 7, chain 135, container 100, lamp 6, tree 7 |
| with no fight fact | 0 | 0 | 0 | 0 | 0 |
| LIT (lamps, the fire barrel) | 7 | 6 | 5 | 1 | 7 |
| LABELLED (words) | 0 | 0 | 0 | 0 | 0 |
| LOUD (warning paint) | 0 | 0 | 0 | 0 | 0 |
| OUTLINED: cracks / chain-link pieces | 10 / 0 | 4 / 0 | 11 / 0 | 1 / 212 | 4 / 135 |
| specks (a thing under 10 px at the frame) | 0 | 0 | 0 | 0 | 0 |
| most things on one house tile | 2 | 2 | 3 | 1 | 10 |
| cover pieces | 25 | 27 | 318 | 224 | 250 |
| THE EYE'S COUNT at the opening frame | 41 | 57 | 69 | 23 | 152 |
| of them specks | 7 | 0 | 0 | 3 | 20 |
| terrain (house tiles: blocked / part / low / rough / flat) | 36/4/0/0/100 | 66/27/0/0/47 | 28/45/0/0/67 | 0/0/48/0/92 | 53/45/0/0/42 |
| colours per 96 px window (the pack's ground 4,140) | 2180 | 3060 | 3536 | 3536 | 2050 |

THE EYE'S COUNT is round one-look's instrument (tools/bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26.py,
spots()): the opening frame against the same board's ground and decals with nothing standing; every joined blob that
moved more than 24 levels is one thing the eye counts. PROVED POINTED AT THE RIGHT THING this round too: twelve of his
cars planted on the suburb board's bare ground read 12 of 12.

## FINDINGS FOR OTHER LANES (named, not touched)
1. FOR RUN AND WORLD: THE MAP HAS TWO DRAWINGS OF THE STRIP AND DOWNTOWN AND THEY DISAGREE. At the near stop the map
   draws the Strip block 44,48 and downtown 47,25 as towers (tall dark slabs, blue glass); its fine grid (cellAt, the
   walk's realizer, the only layer that says where a road, a walk and a wall are) draws the same Strip block as an
   eight-lane boulevard with medians and the resort as one low roof, and downtown as low flat roofs and lots. The board
   follows the fine grid. The sheet shows both side by side on every row. One of the two is wrong for a fight board.
2. FOR COOK FOUR: the plain tan ranch (COOK4_RANCH_TAN_PLAIN.png) carries a chain-link stub with a KEEP OUT plate at
   its right side: a word on the board (one-look rule 1). These boards cut that file at the last column where the house
   stands taller than its fence (709 of 935 px); nothing redrawn. The plate was on round two's and round one-look's
   boards too.
3. FOR DIRECTION (rule 114, the style guide): there is no tower, no resort mass and no palm in the cook files or the
   bank; the Strip's resort is COOK FOUR's casino in front of a gravel roof deck. When the rig (rule 115) makes the
   first tall thing, the Strip and downtown boards are where it stands.
4. MY OWN, FIXED HERE AND OWED BACK: round one's car family (R1.CARS) deals all 35 of his cars, #19 (the police car,
   the analog horror line) among them, so the earlier boards could show a second police car by chance. These boards
   deal 34 and stand #19 once. The earlier candidates are left as they are (rule 100: no fourth version of a candidate).

## WEAK, SAID
- The roof decks are COOK FOUR's gravel field laid flat over the map's roof cells: big flat fields with a front on
  their south edge only; no east, west or north wall shows. Downtown reads as roofs, not streets of buildings.
- A front faces south whatever side the street is on (no back of a building exists in the cook files).
- The wash's channel floor is one sand for 52 m: a big warm field at the opening frame.
- The industrial edge has 150 things the eye counts (100 containers in 33 rows): the busiest board. Each row of three
  reads as one block at the opening frame, but the count is the count.
- His soils are warm (0.33 to 0.44 saturation, all 24): the suburb and the wash read orange at the opening frame. It
  is the soil he said yes to; DIRECTION's style guide decides a quieter one.
- 2x props on 1x ground (MIXELS, rule 114's first tell) wait on DIRECTION's style guide field 1; under rule 115 the
  pack cars, containers and trees are the first things a rig-made piece replaces.
- The fight draws a man 0.86 of a tile tall against these boards' house ruler: one COMBAT reader change at FINAL.

## ANALOG HORROR LINE (rule 20)
The same clean police car (his '9. Abandoned cards' #19), parked straight at a kerb, on all five boards: the Strip,
downtown, the suburbs, the wash, the works. It follows you from district to district and nobody is in it.

## GATES
Pre-push pass (rule 13), run by name on the files this round touches:
- REFERENCE CHECK 494/0 (286 cook tools, 201 carry checks).
- THE ONE RULER GREEN 32/0 (it reads this round's manifest: fine_cell_m 0.75, agreeing).
- REUSE-FIRST: both of my tools PASS (the map cut's tool had no REUSE CHECK block; added); 36 reds on main, none mine.
- ART PIPE A2: this tool lays 0 literal pixels; the map cut's tool laid 1 (the outline on its sheet's map picture, a
  draw.polygon) and is off the list now (20 -> 19); the 19 left are other lanes' tools, red on main before me.
- VOTE TAB 38/1 with the card registered: the card is on top and clean; the one red is DYNASTY's two whys with no
  'where', red on main before me.
- NOT VIBE CODED 29/1 with the card registered: N3 names none of my four cards (before this round it named exactly my
  three); its red now is other lanes' new rows (COOK FOUR's gas station, warehouse and school fail D5 on a roof cell;
  CHARACTER's two and COOK's three rig cards name no sprites).
Full suite unmeasured (rule 13).

## THE CARD'S SPRITES (rule 114c), AND MY THREE EARLIER CARDS
NOT VIBE CODED N3 was red on main on exactly three items, all mine: the map cut, the five houses and the one-look
cards named no sprites and no look. Every one of my four cards now names its 1:1 crops (the pixels the sheet shows at
1:1, lossless, in reference/art_bank/fight_board/sprites/) as class tile with px 1, its manifest as the palette and the
light upper-left, and every crop passes D1 to D5 (D3 is not held on a tile). MEASURED ON THE WAY: the map cut's yard
crop cut from its LOSSY sheet failed D5 by 0.001 (evenness 0.038 against 0.039); the same window re-laid lossless by
that round's own code (mean difference 3.7 levels, the webp loss) passes. A lossy copy is not the art.
