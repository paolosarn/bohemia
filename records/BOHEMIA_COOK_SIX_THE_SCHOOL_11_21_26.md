# COOK SIX: THE SCHOOL, FINISHED, AND ITS CEILING (11/21/26)

COMBAT FOUR's BUILD 11/21m asked 'FOR COOK (SIX)'; COOK SIX carries COOK FIVE's lane (VAMILY rule 461, 461(c) as amended 11/21; rules
453, 441, 416, 451(a), 455). BUILD 11/21r - THE SCHOOL.

## WHAT THIS IS
COMBAT FOUR's fifteenth inside (THE SCHOOL: the gym as the town's shelter that never emptied, or the classroom wing, rooms of desks off
one hallway lined with lockers, a door at each end of every room). Every one of its 13 pieces was a stand-in (the casino's seats, bar,
cage and screens, the tunnels' camps, the street board's tyres, bales, corral and heap, the garage's and casino's walls) and its
ceiling was drawn by the page. They are in the folder now under its names, and the school lays them with no code changed:
- THE FLOOR (school_floor_0.webp): THE SCHOOL'S MAPLE on all 25 tiles: strips 6 cm wide east to west, each its own tone, their ends
  staggered on 0.3 m so every tile's edge is a board end (any tile meets any tile); the finish worn grey where people walked; black
  scuffs; a cot's four leg marks; a hopscotch in chalk on some. ONE FLOOR FOR BOTH LAYOUTS, because COMBAT FOUR's file has one kind for
  the gym and the classrooms: no court lines (a line on a few tiles would scatter fragments over every classroom). Asked in the handoff:
  a 'court' kind for the gym and a 'hall' kind for the hallway, and this lane paints them. NO NEW GROUND (the tunnels' silt as the wood).
- THE PIECES (school_art.json's kit, COMBAT FOUR's 13 names): BLEACHERS (sc_bleachers: pulled out, a tile wide, eight rows of seat and
  foot boards on their steel stepping up to the wall, blankets left on them, a bag, names on a riser). SHELTER COTS (sc_cots_a: four
  canvas cots on their aluminium frames with blankets, pillows, bags under them, a water jug; sc_cots_b: two, a blue tarp strung between
  poles behind them for a wall, a child's toy on one). GYM MATS (sc_mats: folded on their cart, two laid out on the floor as a bed).
  FOLDED TABLES (sc_tables: two cafeteria tables folded on their wheels, one open with a stove and pots on it). STUDENT DESKS (sc_desks:
  twelve chair-desks in three rows facing the front, some knocked over, papers). THE TEACHER'S DESK (sc_teacher: the grey steel desk,
  the attendance book open, the globe, the chair, a box of the year's papers). PILED DESKS (sc_barricade: chair-desks thrown on and
  against a table on its side, a chair). THE TROPHY CASE (sc_case: the cabinet, its glass gone and on the floor, the trophies left on its
  shelves, the team's photograph). THE SCHOOL'S WALL (sc_wall_ew, _ns: painted block, the school's stripe, a bulletin board of papers,
  the clock stopped). LOCKERS (sc_lockers_ew, _ns: a tile of forty on their base, their vents, doors hanging open, a padlock left,
  stickers; COMBAT FOUR's 'L' air wall).
- THE CEILING (school_ceiling.webp, rule 451(a), over the fight at his 10%): five bays by five that repeat: the dropped ceiling's grid
  (the hospital's, its tees dark with dirt), tiles out in clusters where the wiring hangs, the 2 by 4 light panels dead, THE PA'S
  SPEAKER GRILLE in every bay, a stain where the roof leaked. school.json's ceiling entry: "have": true, "tile": [10, 10] (the one agreed
  edit in COMBAT FOUR's file).

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'school', through district 'school'):
- BEFORE (this tree before the cut), the_gym upright: THE SCHOOL, 154 pieces, 154 of them stand-ins, the ceiling drawn by the page, a
  tile 43.9 points, 0 page errors.
- NOW, the_gym: 154 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors, upright (a tile 43.9 points) and on its side
  (31.8). the_classrooms: 221 pieces, 0 stand-ins, both ways, 0 page errors. Every picture the page asked for was there.
FOUND BY EYE on the way: the bleachers' steel ran floor to top and cut dark slashes through the benches (now under each row only).
Gate THE INSIDES WEAR FINISHED ART 105/0 with all fifteen kits (the school's lockers and bleachers held to a tile's width; its ceiling
C2 7.4 over itself against 8.0, C3 63 steps of tone, 13% lines). COMBAT FOUR's gates: THE BIG INSIDES 193/0, AN INSIDE SHOWS ITS
CEILING 6/0.

## REFERENCE CHECK (compared to the world before calling it done)
An American school used as a Red Cross shelter (the gym full of canvas cots, blankets and bags, the bleachers pulled out, cafeteria
tables folded on their casters, mats on their cart); the classroom wing (student chair-desks in rows, a steel teacher's desk, painted
block walls with a school-colour stripe, bulletin boards and a wall clock, a hallway lined with lockers, a trophy case outside the gym;
a lay-in ceiling with 2 by 4 lights and a PA speaker in each room); maple floors. The twins: this lane's hospital kit (its ceiling grid)
and the cell block's (the same rig and cut).

[analog horror: a shelter that never emptied; the clock on the wall stopped; the PA's grille in every room's ceiling that clicks on with
nobody speaking (COMBAT FOUR's line); a child's toy on a cot]
[bb Battle Brothers' palisade: a wall with two gaps a room, and the gaps are the fight]

## THE TOOLS
tools/bohemia_cook6_the_school_finished_11_21_26.py   plan; render sc_floor | sc_pieces | ceil_school; cut; sheet
  (ON the cell block tool and the chain under it: thirteen deep)

## NOT DONE, SAID PLAINLY
1. One floor for the gym and the classrooms (COMBAT FOUR's file has one kind): no court lines, no hallway tile; asked for two kinds.
2. The bleachers step up to the north; on the gym's south wall they face away from the floor (one picture serves both rows).
3. No night versions.

VOTE: cook6-the-school-11-21 (MADE FROM arena2-the-pit-is-a-pit-11-7).
