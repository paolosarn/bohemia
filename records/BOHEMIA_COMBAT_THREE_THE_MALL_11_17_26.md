# COMBAT THREE: THE MALL (BUILD 11/17x - THE MALL)

11/17/26. The full sweep (VAMILY rule 453), job 1 again ("keep going build after build"): the next big inside from row 468's researched list, the fifth.
Rules 416, 59, 428, 451(a), 441, 454(a). Ask rows 468, 627.

## HIS WORDS
- 11/6 (row 468): "what are some large ass interiors that we could fight... I still want this to be a block and turf war."
- 11/14, his vote on the garage's ceiling (rule 451(a)): "a 10% opacity for real... an exterior that I am in the interior of."
- The list's line (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md): "THE MALL (Fashion Show; the Forum Shops' painted sky): stores as tiles, the atrium, the escalators."

## MEASURED BEFORE (main 65988fd3, BUILD 11/17p)
A fight at the mall (the map's kind 'mall') was the parking garage on four cells in ten and the lot outside on the rest. Nothing was ever fought inside it.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/mall/mall.json`, listed in `slices/fight_ground/insides.json`, laid by `slices/bohemia_big_inside.js` (the module the hall
brought): no new rule code. The only code is the ceiling's painter in the fight page (`ceilingSheet`, kind `sky`).
- WHERE: a fight at the mall, 0.7 of what the garage leaves there, by the cell's own dice (19 of 40 in the gate); never on a place's own cell.
- THE BOARD: 20 by 15 house tiles, two layouts, each mirrored: `the_atrium` (the bridge in the middle of the concourse) and `the_food_court` (the landing by
  the north stores, the tables south of it). Eight stores along the north and south walls, the concourse between them.
- 23 KINDS OF TILE, EACH ITS COST AND ITS EFFECT (rule 59): the concourse (open floor, nobody stays on it), a store's floor (walls round you, one way in),
  THE SHUTTER STUCK HALF DOWN (a store's doorway: 3 AP, one man at a time), a corral of carts and somebody's bedding and the counter and a planter (low
  cover), stock on pallets and a kiosk and the ceiling's fall (cover), the food court's tables (3 AP and low cover), a column and the lift (blockers), under
  the skylight and the mall's own doors (open floor, and by day a man there is seen), a drum fire, THE BRIDGE (high ground), stock and a planter on the
  bridge (cover on high ground), a dead escalator (the walk up; the rail is a climb).
- NOBODY HOLDS THE BRIDGE AT THE BELL: the hall's mezzanine is theirs when the fight starts; the mall's bridge is in the middle and belongs to whoever walks
  up first. Both lines start on the concourse.
- THE DARK: night inside; by day the skylight and the doors light their tiles, at night only the drum fires.
- ITS CEILING AT 10% (rule 451(a)): the painted sky of the Forum Shops, the paint let go in patches, a rib every bay, the skylight's grid along the
  concourse with panes out. The fight draws it (a stand-in) until COOK FIVE's `mall/mall_ceiling.webp` is in the folder.
- EVERY PICTURE IS A STAND-IN: 27 pieces drawn as finished pieces of the casino's, the garage's, the tunnels' and the street's kits; the store fronts are the
  casino's glass doors, the store floors its carpet, the concourse the airport apron's pale slabs. COOK FIVE's names are in the handoff.
- RULE 454(a): no line of dialogue is rewritten; the tiles' tap lines are new, draft, the fewest words.

## THE GATE (gates/the_big_insides_gate.js: 29 passed, 0 failed; 15 legs for the mall)
I1 a fight there may go inside (19 of 40, the same cell the same answer). I2 the floor joined on 24 of 24 boards, every man with a walk, all four dealt
shapes seen. I3 the escalators are the walk up and the rail a climb, 24 of 24. I4 the dark, 24 of 24. I5 27 kinds of piece, each with its picture and size,
5,634 of 5,634 stand-ins. I6 24 of 24 fights ended on AUTO inside 30 rounds (5.8 a fight), nobody of 288 stood a whole fight. I7 23 kinds of tile each with
its row, the table's AP charged on 778 tiles, 770 of 770 lines said. I8 (rule 428) after round one 18% of 250 men bare on the open floor against 48% with
the rule off, on cover or high ground 103 of his 144 and 82 of their 106, NOBODY ON THE BRIDGE AT THE BELL and 114 men on it after round one. I9 its ceiling:
sky at 0.1. Six plants caught.
THE GATE GREW ONE READING: I8 used to assume every inside's high ground is held at the bell (the hall). It now reads the inside's own `start`: 'gallery' =
a quarter to a half of the band up on it; any other start = nobody on it at the bell, and men on it after round one. The hall's legs are unchanged (15/15).
Neighbours green on this tree: AN INSIDE SHOWS ITS CEILING 6/0, EVERY MAP KIND HAS ITS FIGHT ANSWER 22/0, EVERY PLACE ITS OWN BOARD, THE PARKING GARAGE
16/0, A PLAIN CELL IS NOT THE PLACE 11/0. The sourced-numbers gate counts 69 typed, the same as main (not mine).

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, C3_INSIDE=mall)
A valley has two cells of mall; the garage takes some. Each run is a fresh page, the fight opened by the map's own hand-over:
- the demo upright (390 x 844): the mall (the_atrium), 3 v 3, AUTO to the end in 5 rounds, 2 of 2 tile taps said their line; the ceiling measured: sky at
  0.1, a pixel moves 4.09 of 255 on average, 19.7 or less on 99 pixels in 100.
- the demo on its side (844 x 390): the mall, AUTO to the end in 6 rounds; the far view taken.
- the alpha upright: the mall, AUTO to the end in 10 rounds, the tap said its line; the ceiling 3.97 of 255 on average.
- the alpha on its side: the mall, AUTO to the end in 4 rounds, 3 of 3 taps (the concourse, under the skylight, the bridge).
4 fights inside the mall, 4 ended, 6 of 6 taps, 0 page errors (and 6 garage fights at the same cells, all ended).

## SAID PLAINLY
- THE FOOD COURT LAYOUT WAS NEVER ON THE GLASS BY THE MAP'S OWN HAND: every valley these runs opened dealt the_atrium at its one mall cell. The food court is
  proven by the gate (13 of 24 boards) and looked at on the fight page opened alone with the layout asked for (the card's own 'scale' line says so).
- The men like the bridge a lot: 114 of 250 are on it after round one. It is the best ground in the mall and nobody's at the bell, so both crews go for it.
  If he reads that as a scrum, the fix is a number in the fight's roof rule, not the board.
- New driver switches: C3_INSIDE=<id> (only fights inside that inside count), C3_FAR=<notches> (a far still).

## NEXT
The distribution warehouse (racks as walls, lanes, the loading docks), then the data fort: a data file each.
