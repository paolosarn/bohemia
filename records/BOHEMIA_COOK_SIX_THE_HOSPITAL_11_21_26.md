# COOK SIX: THE HOSPITAL, FINISHED, AND ITS DROPPED CEILING (11/21/26)

COMBAT FOUR's BUILD 11/20w asked 'FOR COOK (SIX) 3)'; COOK SIX carries COOK FIVE's lane (VAMILY rule 461, 461(c) as amended 11/21;
rules 453, 441, 416, 451(a), 455). BUILD 11/21o - THE HOSPITAL, THE CELL BLOCK, THE SPHERE AGAIN.

## WHAT THIS IS
COMBAT FOUR's thirteenth inside (THE HOSPITAL: the emergency room, treatment bays along both walls round the nurses' station and the
pharmacy's cage, the ambulance doors; or a ward of beds in rows). Every one of its 11 pieces was a stand-in (the casino's seats, bar
and cage, the tunnels' camp, the street board's cart and drums, the garage's and casino's walls) and its ceiling was drawn by the page.
They are in the folder now under its names, and the hospital lays them with no code changed:
- THE FLOOR (hospital_floor_0.webp): rows 0 to 2 THE CORRIDOR'S VINYL, its welded seams, heel marks, a gurney's wheel tracks, pills
  spilled and a blue glove, and on a few tiles a dark smear dragged a few metres, thinning and stopping. Rows 3 and 4 THE SAME VINYL,
  SLICK: a sheen of water where the roof let it in, small spots standing, the tide marks, the mop's arcs where it gave up; a dry margin.
  NO NEW GROUND (the terminal's vinyl, the tunnels' wet and fill, the garage's white).
- THE PIECES (hospital_art.json's kit, COMBAT FOUR's 11 names): TREATMENT BAYS (hs_bay: a tile of three, each a stretcher at its
  headwall of gas outlets, the monitor dead on its arm, an IV pole, a sharps bin, the curtain tracks overhead, the curtains torn down in
  heaps and one still half up; a tile wide). WARD BEDS (hs_beds: five frames 2.4 m apart with their decks bare, head and foot boards,
  one mattress left and stained, lockers, an overbed table; a tile wide, so a run of tiles is one row). GURNEYS (hs_gurney: a gurney
  left in the corridor, its sheet half off; a wheelchair on its side). CRASH CARTS (hs_carts: the red cart, its drawers pulled out and
  empty, the defibrillator's lid open, two IV poles, the oxygen rack empty). WAITING ROOM CHAIRS (hs_chairs: rows on their beams, one
  knocked over, the take-a-number post). THE NURSES' STATION (hs_station: its counter in a U, three dead monitors, the chairs, the phone
  hanging by its cord, the charts on the floor, the board behind it with its last names). THE PHARMACY'S CAGE (hs_pharmacy: mesh on a
  steel frame round its shelves, the shelves stripped, the door cut off and on the floor, a hole cut in the mesh and bent out, the pill
  bottles spilled out of it; a tile's blocker). THE HOSPITAL'S WALL (hs_wall_ew, _ns: painted block, the crash rail, the AED cabinet
  open and empty). THE BAYS' PARTITION (hs_partition_ew, _ns: COMBAT FOUR's 'W' air wall: a stud wall painted pale green, its corner
  guards, the bay numbers, the glove boxes, a sharps bin).
- THE CEILING (hospital_ceiling.webp, rule 451(a), over the fight at his 10%): five bays by five that repeat: the dropped ceiling's
  lay-in grid (the casino's, its tees dark with dirt), tiles out in clusters where the wiring hangs and the dark over them, the 2 by 4
  light panels dead, a diffuser in every bay, a camera's dome in some, the stains where the roof leaked. hospital.json's ceiling entry:
  "have": true, "tile": [10, 10] (the one agreed edit in COMBAT FOUR's file).

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'hospital', through district 'medical'):
- BEFORE (this tree before the cut), the_emergency_room upright: THE HOSPITAL, 175 pieces, 175 of them stand-ins, the ceiling drawn by
  the page, a tile 43.9 points, 0 page errors.
- NOW, the_emergency_room: 175 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors, upright and on its side.
  the_ward: 151 pieces, 0 stand-ins, both ways, 0 page errors.
FOUND BY EYE on the way: the slick tiles first were whole teal pools that read as holes (now a sheen with small spots: water on vinyl
only darkens it); the dragged smear was a row of dashes (now one streak, thinning); the ceiling's tiles out were scattered one by one
and read as noise at 10% (now in clusters); then THE GATE caught the ceiling too faint to read at a tenth (52 steps of tone, 9% lines),
so the grid's tees went dark with dirt.
Gate THE INSIDES WEAR FINISHED ART 98/0 (the hospital the thirteenth kit; its bays and beds held to a tile's width; its ceiling C2 6.8 over itself against 8.0, C3 63 steps of tone, 13% lines). COMBAT FOUR's gates: THE BIG INSIDES 167/0, AN INSIDE SHOWS ITS CEILING 6/0.

## REFERENCE CHECK (compared to the world before calling it done)
A hospital emergency department (treatment bays round a central nurses' station, each a stretcher at a headwall of gas outlets with a
monitor on an arm, ceiling curtain tracks; a crash cart of drawers with a defibrillator on top; an inpatient pharmacy behind a secured
cage; a waiting room of beam seating; sheet vinyl with welded seams; a lay-in acoustic ceiling with 2 by 4 troffers, diffusers, dome
cameras) and a ward of beds; emptied in the order COMBAT FOUR's facts give: the drugs, the oxygen, the beds. The twins: the casino's
ceiling grid and this lane's home center kit (the same rig and cut).

[analog horror: a camera's dome in the ceiling of every few bays that nobody watches; the phone hanging by its cord at the station; a
dark smear dragged a few metres down the corridor, and stopping (rule 459(e): whose, is not said)]
[bb Battle Brothers' ruins: the bays are a row of rooms you fight in and between, and the station is the one high-walled place in the
middle]

## THE TOOLS
tools/bohemia_cook6_the_hospital_finished_11_21_26.py   plan; render hs_floor | hs_pieces | ceil_hospital; cut; sheet
  (ON the home center tool and the chain under it; the casino's lay-in grid reached through it)

## NOT DONE, SAID PLAINLY
1. COMBAT FOUR's 'W' tiles are whole tiles of partition: each draws as a small walled room between the bays (the data's shape).
2. The gurney and the crash cart are small on a 12 m tile (their real size).
3. No night versions.

VOTE: cook6-the-hospital-11-21 (MADE FROM arena2-the-pit-is-a-pit-11-7).
