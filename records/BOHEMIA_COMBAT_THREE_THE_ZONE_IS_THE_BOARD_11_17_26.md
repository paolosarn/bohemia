# COMBAT THREE: THE ZONE IS THE BOARD (BUILD 11/17p - THE ZONE IS THE BOARD)

11/17/26. The full sweep (VAMILY rule 453), job 2 of three and job 3's leg on it. Rules 429(a)(g), 341, 428, 441. Ask rows 504, 507, 627.

## HIS WORDS
- 11/3: "everything just looked exactly the same as the main suburb shit we have... no variety, like true variety."
- 11/7: "not every part of town is gonna be this suburb shit... where there's more desert landscape, where there's more industrial or building going on."
- The coordinator's round (rule 453): "the open-map boards: every zone WORLD 13 names gets boards that look like that zone (desert, the works by the rail,
  trailer parks, the Strip, the lake shore), never two alike"; "AUTO played to the end on each new board, both sides using roofs and cover the way rule 428 says."

## MEASURED BEFORE (main 18cf7bbb, BUILD 11/17c)
A map cell no place stands on (a plain cell) dealt only its district's SHARED kinds from WORLD THIRTEEN's table (11/14f, NOT THE SAME SUBURB TWICE). That was
never the same suburb, but it was never the zone's own look either: the open desert was scrub and never the desert's own blocks, the works never the rail
yard's boxcars, the Strip never its boulevard, downtown never its canopy. A zone's own look stood only on the few cells its place stands on.

## WHAT SHIPPED
`slices/BOHEMIA_FIGHT.html`, `__THE_ZONE_IS_THE_BOARD__` (`plainCell`, `blockStreet`, `dealZone`, the fork in `dealOnce`):
1. A PLAIN CELL IS KNOWN BY THE MAP'S OWN WORD: `FIGHT_OPTS.ground` (WORLD THIRTEEN's seam of 11/14: sent for a cell no place stands on) makes the cell plain
   without asking the map's frame; the old way (the frame's `vbTemplateAt`) stays for a door that sends no ground.
2. A PLAIN CELL OF A DISTRICT THAT HAS A PLACE DEALS THAT PLACE'S OWN BLOCKS, ITS PLAN KEPT: a block the place pins to a column or a row stays there (the
   Strip's boulevard, Fremont's canopy, the desert's dry wash, the lake bed's shore line), WITHOUT its landmark (the landmark stands where the place stands,
   11/11h), and a share of the free slots from the zone's other kinds in WORLD's table, by the cell's own dice (`ours.plain_cells.mix` 0.4; the suburbs 0.6,
   whose own board is one block; the trailer park 0.3; the lab 0.5). No two neighbours on a board the same block.
3. THE STREET IS THE CELL'S (`FIGHT_OPTS.ground.street`): a cell with no street leans to blocks with none, a street running east to west or north to south
   to blocks whose street runs that way (`street_weight` 3; a block's street is read off its own tiles, `street_dark`, the same floor the open-street rule
   reads). It is a lean, not a law: the place's plan wins.
4. THE TWO LINES START AS A LINE OR WIDE (a camp and a pincer are round a landmark, and a plain cell has none).
5. A district with no place (the freeway, the arterials, the graveyard have their own boards) deals as before.
Every number is a sourced row (`records/target/bb/ours.json` `plain_cells`); the rules type three numbers fewer than my first cut (the sourced-numbers gate
counts 67 on this tree, the same as main before it).

## THE GATE (gates/a_plain_cell_is_not_the_place_gate.js, 11 passed, 0 failed, 113 s; registered)
- P1 to P6 as 11/14f (420 plain cells no place's own board; every block the place's or of a kind the table names; 30 suburb cells 30 boards; the place still
  where it stands; a fight plays; the same cell the same board twice).
- P7 A PLAIN CELL LOOKS LIKE ITS ZONE: 3171 of 5040 blocks (63%) on 420 plain boards are the district's own place's blocks; a landmark on 0; no district
  under three in ten.
- P8 NEVER TWO ALIKE, ZONE BY ZONE (land_use.json): strip 77/80, downtown 32/32, industry 80/80, transport 64/64, suburb 64/64, cheap_edge 16/16,
  commercial 16/16, civic 32/32, green 32/32, open 96/96, water 48/48: 557 of 560 different.
- P9 THE STREET IS THE CELL'S: 80 open-zone cells with no street carry a street on 189 of 960 blocks (7 north to south); the same cells handed a
  north-to-south street 246 (36 north to south).
- P10 AUTO TO THE END, OFF THE OPEN STREET (rule 428): 23 of 23 fights on plain cells of every place's districts ended inside 30 rounds (5.0 a fight);
  after round one 5% of 472 men bare on the open street against 10% with the rule off; on cover or a roof 143 of his 276 and 137 of their 196 (110 up on
  a roof).
- Planted: the plain cell not known, 420 of 420 a place's own board again.
Neighbours green on this tree: EVERY PLACE ITS OWN BOARD, EVERY MAP KIND HAS ITS FIGHT ANSWER 22/0, THE CREW STARTS ON ITS CELL 9/0, THE PLACES ARE
TEMPLATES 13/0, THE BIG INSIDES 15/0.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, C3_PLAIN=1)
The driver now sends a plain cell THROUGH THE MAP'S OWN DOOR (the city frame's `cityHandOver`, the meet card answered), so the fight is handed what the map
hands it (ground, zone, street), and it takes its cells zone by zone in turn. Four runs, each a phone, each fight AUTO to the end at 4x:
- the demo upright (390 x 844): the works (rail + landfill, street north to south), the trailer park, the Strip, the lake shore, the desert, downtown: 6 of 6
  ended, 84 turns, 0 page errors.
- the demo on its side (844 x 390): the airport apron twice, the mountain pass twice, the suburbs twice (two different boards each): 6 of 6, 0 errors.
- the alpha upright: the wash three times (three boards), the Strip by the sign, the marina's water twice: 6 of 6, 0 errors.
- the alpha on its side: the warehouse district (rail, landfill, works, ruin), the trailer park, the Strip by the tower, the lake shore, the desert,
  downtown: 6 of 6, 0 errors.
24 fights, 24 ended, 0 page errors. The same cell on the demo and on the alpha dealt the same board (the trailer park at 37,25; the lake shore at 58,8).
The card's picture is six of those bells off the demo upright.

## SAID PLAINLY
- The stills named `_cut` in a plain run are taken while the fight's own opening camera is still turning (dark and tilted); the `_start` stills are the
  settled board and are what the card uses. It is the picture's timing, not the board.
- This valley has no plain cell of golf, the springs or the landfill, so those three were proven by the gate only, not on the page.
- The map's own tiles cut one for one (opts.street 'map') is still not shipped (11/14's refusal stands: it reads bare and dark at the fight's scale).

## NEXT
The next big inside from row 468's list as a data file (the mall), its tiles' costs and effects, its ceiling at 10%, names agreed with COOK FIVE in the handoff.
