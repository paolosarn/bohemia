# COMBAT THREE: THE DISTRIBUTION WAREHOUSE (BUILD 11/17zf - THE WAREHOUSE)

11/17/26. The full sweep (VAMILY rule 453), job 1 a third time ("keep going build after build"): the sixth big inside of row 468's researched list.
Rules 416, 59, 428, 451(a), 441, 454(a). Ask rows 468, 627.

## HIS WORDS
- 11/6 (row 468): "what are some large ass interiors that we could fight... I still want this to be a block and turf war."
- The list's line (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md): "A DISTRIBUTION WAREHOUSE (North Las Vegas' industrial parks): racks as walls, lanes, the
  loading docks, forklifts."

## MEASURED BEFORE (main 805ffaaa9, BUILD 11/17x)
A fight in the warehouse district (the map's kind 'warehouse') or the industrial blocks was always outside: the rail works' own board on its place's cells,
the works zone's board on the rest (11/17p). Nothing was fought inside a building there.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/warehouse/warehouse.json`, the third in `slices/fight_ground/insides.json`, laid by `slices/bohemia_big_inside.js`: no
new rule code. The only code is the ceiling's painter (`ceilingSheet`, kind `joist`).
- WHERE: the warehouse district, half its fights that are not on a place's own cell; the industrial blocks, one in five (`share_by_district`); by the
  cell's own dice (the gate: warehouse 22 of 40, industrial 9 of 40), the rest outside on the zone's board.
- THE BOARD: 20 by 15 house tiles, two layouts, each mirrored. `the_lanes`: four long rows of racking east to west, a lane between each, two cross-aisles,
  the dock apron and six dock doors along the south wall, the pick mezzanine along the north wall. `the_cross_dock`: docks down both long walls, short
  blocks of racking in a grid, the conveyor down the middle, the mezzanine in the centre.
- 19 KINDS OF TILE, EACH ITS COST AND ITS EFFECT (rule 59): THE RACK (no way through, no sight through: racks as walls), THE LANE (open floor, and a gun
  sees down the whole of it; nobody stays on it on AUTO), pallets and a bay come down and the lock-up cage (cover), somebody's bedding and drums and the
  shipping desk (low cover), THE CONVEYOR (you climb over it: 3 AP, low cover), a forklift and a trailer at its dock and a column (blockers), a dock door
  (open floor, and by day a man there is seen), a drum fire, the mezzanine (high ground; pallets and drums on it), the stairs (the walk up; the rail a climb).
- NOBODY HOLDS THE MEZZANINE AT THE BELL (the mall's way, not the hall's): both lines start in the lanes.
- THE DARK: night inside; by day the dock doors light their tiles, at night only the drum fires.
- ITS CEILING AT 10% (rule 451(a)): the corrugated roof deck, an open-web joist every tile, a girder every bay, strip lights mostly dead, clear panels,
  the red sprinkler mains. The fight draws it until COOK FIVE's `warehouse/warehouse_ceiling.webp` is in.
- EVERY PICTURE IS A STAND-IN: 23 pieces drawn as finished pieces of other kits (the rack's face is the casino's wall of dead screens, the forklift the
  street's dozer, the trailer its container, the floor COOK FIVE's own hall slab with its numbered bays). COOK FIVE's names are in the handoff.
- RULE 454(a): no line of dialogue is rewritten; the tiles' tap lines are new, draft, the fewest words.

## THE GATE (gates/the_big_insides_gate.js: 43 passed, 0 failed; three insides, 15 legs for the warehouse)
I1 31 of 80 fights at its districts go inside, the same cell the same answer, never on a place's own cell. I2 the floor joined on 24 of 24 boards, all four
dealt shapes seen. I3 the stairs the walk and the rail a climb, 24 of 24. I4 the dark, 24 of 24. I5 23 kinds of piece each with its picture and size, all
stand-ins. I6 24 of 24 fights ended on AUTO inside 30 rounds (7.6 a fight), nobody of 288 stood a whole fight. I7 19 kinds of tile each with its row, the
table's AP charged on 686 tiles, 680 of 680 lines said. I8 (rule 428) after round one 27% of 249 men bare on the open floor against 43% with the rule off;
on cover or high ground 102 of his 144 and 73 of their 105; nobody on the mezzanine at the bell, 43 men on it after round one. I9 its ceiling: joist at 0.1.
Six plants caught.
FOUND BY THE GATE ON THE WAY: my first cut of `the_lanes` stood a column in each cross-aisle's mouth, so the lanes were cut off from the docks (65 of 163
tiles reached, I2 red). Moved; and cover added down every lane after I8 read 42% bare.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, C3_PLAIN=1 C3_INSIDE=warehouse: through the map's own door, plain cells only)
- the demo upright (390 x 844): 3 fights in the warehouse (the_lanes), all ended on AUTO; 8 of 8 tile taps said their line (the lane, bedding, pallets,
  the mezzanine, drums); the ceiling measured: joist at 0.1, a pixel moves 2.2 to 2.5 of 255 on average, 11.7 or less on 99 pixels in 100.
- the demo on its side (844 x 390): 2 fights (the_cross_dock), both ended; 3 of 3 taps.
- the alpha upright: 1 fight (the_cross_dock), ended; 4 of 4 taps; the ceiling 2.39 of 255.
- the alpha on its side: 1 fight (the_cross_dock), ended; 3 of 3 taps.
7 fights inside the warehouse, 7 ended, 18 of 18 taps, 0 page errors; both layouts dealt by the map's own hand. The 14 other fights those runs opened in
the same districts were the zone's own board outside (rail, works, ruin, landfill), all ended.

## SAID PLAINLY
- THE LANES ARE EXPOSED AND STAY THAT WAY: 27% of men stand on bare lane after round one (the mall 18%). A lane between racks is a
  shooting gallery; that is the board's character. The gate's bound is 30%; it passes with little room.
- Two of the demo-upright fights ran before the last two cover tiles went onto the dock apron; the third ran after, and so did the alpha on its side.
- One house tile of lane stands for three or four real aisles (the data file says so): the racks are drawn a tile deep.

## NEXT
The data fort (server rows, the cold, the one place with power), then the airport terminal: a data file each.
