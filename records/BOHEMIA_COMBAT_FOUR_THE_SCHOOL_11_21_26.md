# COMBAT FOUR: THE SCHOOL (BUILD 11/21m - THE SCHOOL)

11/21/26. COMBAT FOUR's second build since the coordinator's routine picked the lane up (rule 461: 'more boards, more ground'). Row 468's list
was built whole on 11/20; this is the next map kind with a big room that still fought outside: the school. And a bug found building it,
fixed at its root in every inside. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main 7ee36c614)
A fight at a school (the map's kind 'school': 'its classrooms, the gym, the yard') was fought on the suburb's blocks outside.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/school/school.json`, the twelfth in `slices/fight_ground/insides.json` (six in ten of a school's fights,
by the cell's dice: the gate 25 of 40). No new rule code; the ceiling is the hospital's 'grid' (a stand-in).
- `the_gym`: the gym used as the town's shelter and never emptied (the Red Cross's shelters are mostly school gyms): rows of cots (low
  cover), gym mats (low cover), cafeteria tables folded on their wheels (cover), drum fires, the yard doors, and the bleachers pulled out along
  both long walls: steps a man climbs over (3 AP) with low cover, NOT high ground (a bleacher's rise is not a storey).
- `the_classrooms`: a hallway down the middle with its lockers on both walls (walls you see nothing through), three classrooms each side
  (rows of student desks, low cover; the teacher's desk, cover; desks piled into a barricade, cover), the shelter's overflow in the hallway
  (cots, the trophy case), and A DOOR AT EACH END OF EVERY ROOM: the doors are the fight. [bb] the lockers are its palisade.
- 15 tile kinds, each its cost and effect and its Battle Brothers ground; 13 pieces, all stand-ins (the names for COOK in the handoff). No line
  rewritten (465). No high ground.

## THE BUG, FOUND BUILDING IT, FIXED FOR EVERY INSIDE
A stand-in piece borrows another kit's finished picture, and `kit()` in `slices/bohemia_big_inside.js` merged that kit's whole entry under
ours, so its 'nobody stands here' came along. Measured over 8 boards of each of the twelve insides: the cell block's officers' desk (16
tiles) and the school's trophy case (24) borrow the casino's cage picture, and every one of those tiles was a WALL while the table priced it
at 2 AP and called it cover. The gate never saw it: its AP leg skips a tile it cannot price. NOW a piece's blocks_move is this inside's own
word and never the picture's kit's (0 such tiles in all twelve), and gate THE BIG INSIDES leg I5 fails any walkable tile that reads as a
wall, with a plant (a piece made to block: 24 tiles caught in the cell block, 32 in the school).
MY FIRST CUTS: 39% of men bare in the classrooms (both lines met in an empty hallway): the shelter's overflow went into it (25%), then two
rooms were cut off by pieces in front of their doors (the leak above), then two of his men stood a whole fight in a room whose one door
was behind them: AUTO will not step away from the enemy to get out of a room. Two doors a room fixed it on this board.
FOR WHOEVER OWNS AUTO'S WALK (COMBAT / FIXES): a man in a room whose way out is behind him idles the whole fight (the school's first cut,
seed 1700, men c1 and c9: 9 rounds of 'idle'). Every inside with rooms is laid so it does not happen, but the brain should walk out.

## THE GATE (gates/the_big_insides_gate.js: 193 passed, 0 failed over twelve insides)
THE SCHOOL 18/0: 24 of 24 fights to the end on AUTO (6.8 rounds), nobody of 288 stood a whole fight, 28% bare after round one against 46%
with rule 428's leg off; the plant of the new I5 leg caught.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:school, C3_INSIDE=school)
The demo upright 2 fights (the gym and the classrooms), 9 of 9 taps; the demo on its side 2 (both), 8 of 8; the alpha upright 2 (both),
8 of 8; the alpha on its side 2 (both), 7 of 7. 8 fights in the school, 8 ended on AUTO, 32 of 32 tile taps, 0 page errors; the ceiling
moves a pixel 3.6 to 7.7 of 255 on average. Every valley these runs opened had 14 school cells.
