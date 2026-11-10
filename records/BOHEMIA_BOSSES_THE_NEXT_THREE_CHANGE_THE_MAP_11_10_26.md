# BOSSES, 11/10/26: THE NEXT THREE CHANGE THE MAP, EACH HIS OWN WAY (rules 443(a), 441; ask lines 167, 522)

THE COORDINATOR 11/10 (rules 443(a) and 441 fully baked): "he voted YES on all three of your bosses. NEXT: the ladder's next three, each
found by its own sign, each handing its verb, each changing the map its OWN way, kept after a reload, proven on the real page on a phone
both ways. Whole pieces only, a build stamp each, VOTE card, handoff." The ladder (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md) rows 4 to
6: THE BURN, THE SURVEYOR, THE CLIMB. The first three: records/BOHEMIA_BOSSES_THE_FIRST_BOSS_CHANGES_THE_MAP_11_8_26.md,
records/BOHEMIA_BOSSES_THE_TAP_AND_THE_FILTER_CHANGE_THE_MAP_11_9_26.md.

SIX BOSSES, SIX WAYS THE MAP CHANGES (each read off his own ladder row, his lock and his own words; none a copy):

| | what he holds (the ladder) | the lock | WHILE HE STANDS, ON THE MAP | WHEN HE FALLS, ON THE MAP |
|---|---|---|---|---|
| THE POT | the last sound cookware | raw food | a WALL: his line cooks shut the streets into his block | the carts at the kerb, his till pays |
| THE TAP | the pressure | water somebody owns | a TOLL: a bolt a block under his pipe | the pipe a line of taps for his verb |
| THE FILTER | the last clean-water setup | bad water | GUARDS: his machines fight where they stand | every machine drops: wrecks you strip |
| THE BURN | fuel, and who gets warm | night ends your day | THE NIGHT: his side black, you see 1 block, only his drums burn | his drums burn for you: fires that light the night |
| THE SURVEYOR | the last complete map | you only know what you walked | THE MAP ITSELF: his side forgets the moment you walk out | his side back for good, his lines out to every town |
| THE CLIMB | the last hoist | above the ground floor is scenery | A HUNT: his riggers come down the street for you | the people he kept up top come down to your place |

## MEASURED FIRST (origin/main 0f4592d0f, the demo upright)

THE BURN, THE SURVEYOR and THE CLIMB already had their signs (a burned door, a man at a bar, a flyer), their askers (ABUELA PAZ, MANNY,
NENA), their fights, and their verbs (LIGHT A FIRE, FILL IN THE MAP, GO UP), walked by gates/bosses_act_one_gate.js. Their deaths changed
WORLD TWO's rows (records/target/bb/boss_map.json: 4 blocks lit, the towns shown, 4 lit), but nothing in the valley worked differently
while they stood, so nothing could change when they died: the same hole THE POT had on 11/8.

## THE BURN: HIS DARK

Code: slices/bohemia_bosses.js section (11); the one marked line __THE_BURNS_DARK__ in slices/BOHEMIA_CITY_WORLD.html's fogRadius (beside
__THE_BOSS_FIRES_LIGHT_THE_NIGHT__, the same seam: the map's fog asks BohemiaBosses how far the crew sees); data: THE BURN's 'dark' row in
records/target/bb/boss_act_one.json (a modder's row: radius 5, sight 1, 4 drums 2 to 4 out, the words); art: tools/bohemia_bosses_the_next_three_11_10_26.py (DRUM).
- HIS DRUMS: the moment WORLD TWO stands him somewhere, 4 of his stokers' fire drums stand on street blocks 2 to 4 out from his yard
  (never by a town, 3 apart), worked out once off his place and kept. Raul at the burned door now says it: "He took every fire on his
  side: at night it is black, only his stokers' drums burn."
- WHILE HE STANDS: at night, on his side (5 blocks round his door), the crew sees 1 block; the rest of the valley the night's half (3).
  The map paints his side black at night with only his drums glowing through it (a drum: his stoker in a heavy coat with a poker, his
  red jerrycans, a board with his mark burned in). The first night the crew walks in, one of yours says "His side is black at night. He
  took every fire but his own. We can't see past our feet.", the number rises (HIS DARK: 1 BLOCK SEEN), and @abuela_paz posts it.
- WHEN HE FALLS: the kill's camera rolls his 4 drums over on the same tape as his fuel yard; his stokers walk off and every drum is a
  fire of yours (lit(): at night, 2 blocks round each, you see like in the day), painted with the neighbours warming their hands, a kid,
  a pot on the drum; ABUELA PAZ's card says it under his fuel: "HIS 4 DRUMS BURN FOR YOU NOW: AT NIGHT, 2 BLOCKS ROUND EACH, YOU SEE LIKE
  IN THE DAY."; @abuela_paz posts it beside the radio.
- KEPT AFTER A RELOAD: the drums, his dark gone, every drum lit.
THE GATE: gates/the_next_three_change_the_map_gate.js "THE BURN" (one gate for the three, registered once a boss; both ways: the demo
upright, the alpha on its side). Run 1 on the demo upright: 16 passed, 1 failed, the red the gate's own (D1 read the drums' paint from
his tag 13 blocks away, where the phone shows none of them; it now reads them with the crew among them). In run 1: the tag at 68,17,
his place 55,21; drums 59,18 59,25 55,18 51,18; at night at 59,17 sight 1, 117 blocks painted black, outside at 56,14 sight 3, said;
his card, his fight (the checker ended it: AUTO lost); the beat with 4 drums on the tape and the card's line; after, at night at 59,17
sight 6, 4 of 4 drums lit, painted after, glowing, nothing black; the feed; P2, P3 red; the reopen held (sight 6, 4 lit). Run 1 on the
alpha on its side: 0/3: THE ALPHA COMES OUT OF THE TOWN IN THE CLOSE VIEW (MODE 'human'), where the map does not run, so no boss's sign
was ever placed; a stranger pinches out to the map, and the pinch calls the game's own swapMode(): the gate now does the same.
Runs 2 to 5 on the alpha on its side found the four things below, one at a time (no boss card after the first, nothing of his painted).
THE LAST PASS, on the tree rebased onto main 56653218d (JOBS' 11/10o, after HOME BASE's 11/10n; the pass on aa0a4df20 gave the same): THE DEMO UPRIGHT 18 passed, 0 failed; THE ALPHA ON ITS
SIDE 18 passed, 0 failed (every card's buttons on the screen without a scroll, C2); THE FILTER's own gate on the same tree, alone, green
(run beside two others, its fights and its asker timed out: the load, not the game).
THE ALPHA, BOTH WAYS (rule 441), FOUR THINGS MEASURED AND FIXED ON THE WAY:
1. THE MAP WAS BLACK ON THE ALPHA, upright and on its side: the map's canvas measured 1 x 1 px (cvPixels()) with its stage 844 x 288
   (on its side) and 390 x 739 (upright); the map's fit() had run while #stage had no size, and nothing measured it again until a
   window resize (a resize brought the whole city back). One marked line in slices/BOHEMIA_CITY_WORLD.html after fit's resize listener,
   __THE_MAP_SIZES_WHEN_ITS_STAGE_DOES__: a ResizeObserver on #stage re-fits it when its size changes (on the next frame, so it never
   loops; a no-op where it already fits). After: 844 x 288, THE BURN's drums painted on the alpha on its side. RUN's file: told in the handoff.
2. A BOSS CARD'S BUTTON UNDER THE EDGE: on the alpha on its side the map frame is 348 px tall and CONTENT's card 308 (a scroll box);
   RAUL's flyer card put LATER under its bottom edge, the tap missed it, the card stood, and every card after it waited (THE TAP's,
   THE FILTER's and THE BURN's never came). The bosses' cards now fit a short screen (fitCard: the face 44 px, the words and buttons
   tighter; this file dresses only the cards it asks for): 278 px, both buttons on the screen. The gate scrolls a card that runs past
   the edge before it presses, the way a thumb would, and C2 goes red if it ever had to.
3. THE ALPHA COMES OUT OF THE TOWN IN THE CLOSE VIEW (MODE 'human'), where the map does not run, so no sign was placed: the gate pinches
   out (the game's own swapMode(), what the pinch calls). A fight can hand him back there too, so HER CARD AFTER A KILL WAITS FOR THE
   MAP (talkTick): the kill's camera is never skipped.
4. The driver's d.shot crops to the canvas box it measured at the door (3 x 3 px on the alpha on its side): the gate shoots the whole
   phone screen as he sees it.
Phone pictures (webp): records/target/the_next_three_change_the_map/burn/ (phone_portrait = the demo upright, phone_landscape_alpha =
the alpha on its side: 0 she asks, 1 the door read out, 2 his dark at night, 3 his card, 4 she says what changed, 5 his drums after,
6 opened again).

## THE SURVEYOR: HIS HOLE IN THE MAP

Code: slices/bohemia_bosses.js section (12); data: THE SURVEYOR's 'hole' row in records/target/bb/boss_act_one.json (a modder's row:
radius 5, 4 posts 2 to 5 out, the words); art: tools/bohemia_bosses_the_next_three_11_10_26.py (SIGNPOST). No line in anybody's file:
the map's own fog is read and written here the way its fogReveal writes it (FOG.seen and its mask, never its generation).
- HIS SIGN POLES: the moment WORLD TWO stands him somewhere, 4 of his cut sign poles stand on street blocks round his office (the blades
  cut off, his orange flagging round the stub, an orange X sprayed on the street, a stake pulled up). Britain took its signposts down in
  1940 so an invader could not find his way; THE SURVEYOR does it so you buy his map. The man at the bar now says it: "His chainmen take
  the street signs down on his side: walk out and you forget it."
- WHILE HE STANDS: the map forgets his side (5 blocks round his office, never a town's ground): every block of it the crew cannot see
  from where it stands goes back under the static, the fog's own bit and its own mask. Walk in and you see it; walk out and it is gone.
  The first time, once he is known, one of yours says "His chainmen took every street sign down on his side. We walk out and the map
  loses it.", the number rises (THE MAP FORGOT HIS SIDE) and @manny_trucks posts it.
- WHEN HE FALLS: his map is copied. On the kill's tape his sign poles get their blades back and his side comes out of the fog for good
  (when the tape tracks in, so the BEFORE is the hole and the AFTER the map); then his chain lines run out from his door to every town in
  the valley, the map's own route to each, out of the fog a town at a time (no frame waits on twenty routes). MANNY's card says it under
  his map: "HIS SIDE IS BACK ON THE MAP FOR GOOD, AND HIS LINES RUN OUT TO ALL N TOWNS."; @manny_trucks posts it beside the radio.
- KEPT AFTER A RELOAD: his side seen, the lines seen, nothing forgotten again (a reload in the middle of his lines goes on drawing them).
THE GATE: gates/the_next_three_change_the_map_gate.js "THE SURVEYOR" (registered THE SURVEYOR CHANGES THE MAP), both ways. MEASURED ON
THE WAY: run 1 the demo upright 18/0 (the bar at 81,60, his office 68,59; 54 of his 121 blocks seen inside his side, 0 once out, the
fog's mask 248/255 back over them; 13 towns, his lines out of the fog; the reopen held), the alpha on its side 17/1 (H1 read his poles'
paint from the bar, off the short screen: now read with the crew among them). THE VOTE CARD showed nothing: under the map's own faint
fog a forgotten block looks like any unseen one, so his forgotten side now carries a dead signal (once he is known, so it never gives
his place away before the man at the bar); and the map drew once between his fall and the kill's camera, so his side had lifted
before the camera got there: A FALLEN BOSS'S CHANGE NOW WAITS FOR HIS CAMERA (beatOwed: THE BURN's dark had the same gap). Run 3:
his lines lit 12 and 11 of the 13 towns' own doors (the route stops beside a door: the line now lights the town at its end) and the
gate, planning each route again, got a different route after a reload (470 of 557): the game keeps the blocks its lines drew and the
gate reads exactly those. THE LAST PASS (base 158450da9): THE DEMO UPRIGHT 18 passed, 0 failed (his side 105 blocks, 13 towns, 13
lines, 13 doors, 531 of 531 drawn blocks on the map after the reopen); THE ALPHA ON ITS SIDE 18 passed, 0 failed (86 blocks, 13 lines,
493 of 493). Shipped rebased onto 68e7b5889 (HOME BASE's 11/10u and MOTION 3's 11/10t since: the home seam and the camp board, nothing
of the fog, the bosses file or their data). VOTE: records/target/bosses_vote_surveyor_11_10/ (BOSSES_AWAY=14). Phone pictures (webp):
records/target/the_next_three_change_the_map/surveyor/ (2 in his side, 2b out of it, 5 his side after).

## THE CLIMB: HIS RIGGERS

Code: slices/bohemia_bosses.js section (13); data: THE CLIMB's 'riggers' row in records/target/bb/boss_act_one.json (a modder's row:
sight 6, leash 8, two riggers a fight, back in a day, the three he kept up top by name and look, the words); art:
tools/bohemia_bosses_the_next_three_11_10_26.py (RIGGERS). The people he kept go to your settlement through HOME BASE's one seam
(rule 445: BohemiaHomeMap.give, kind 'person', shipped by HOME BASE as BUILD 11/10u): no line in anybody's file.
- HIS RIGGERS: a party of two off his hoist waits at its foot (Battle Brothers: a location sends parties because it holds). The flyer
  now says it: "He keeps people up there who paid to go up and can't pay to come down, and his riggers come down the street for
  anybody who gets close."
- WHILE HE STANDS: the moment the crew is within 6 blocks of his hoist, his riggers come down the street for it, a block for every block
  the crew walks, never past 8 from the hoist, painted only where the crew could see them (the map's own sight, mapSees: Battle
  Brothers draws a party only inside your sight); out of sight they walk back. When they reach the crew: their card first (ENGAGE or
  FALL BACK, RUN's one door), two of them on the board; beaten, they are down until another party comes off the hoist a day later. One
  of yours says it the first time ("His riggers came down the hoist. They're coming for us."), @nena_scraps posts it. Not a wall, not
  a toll, not a man at a post, not the night, not the map: the danger walks.
- WHEN HE FALLS: his riggers are gone, and the people he kept up top come down: LUZ, DON ARTURO and MARISOL stand at the foot of his
  towers (painted: a woman with everything on her back, a case, the rope dropped). The crew stepping onto one takes her home: with his
  place planted she moves in at once (+1 AT YOUR PLACE, the company posts it); with none planted yet she waits for it (the seam keeps her,
  the phone says so) and planting places her. NENA's card says it under his hook.
- KEPT AFTER A RELOAD: no party, the ones who came down live at his place, nobody moves in twice.
THE GATE: gates/the_next_three_change_the_map_gate.js "THE CLIMB" (registered THE CLIMB CHANGES THE MAP), both ways. Run 1: the demo
upright 16/2, the alpha on its side 15/3, the game right each time: the walk to LUZ passed over DON ARTURO and he came then (the gate
now takes whoever has not come); the others' paint was read from LUZ's block with them off the screen (now read while NENA's card is
up, the camera on his towers); the planted 'his riggers back' left them beaten (it now stands a party up). Run 2: the demo upright 18
passed, 0 failed (the riggers walked 6 blocks at the crew, AUTO beat them; LUZ waited and moved in at the plant, MARISOL at once; 3 at
his place after the reopen); the alpha on its side 18 passed, 0 failed (3 blocks, LUZ and DON ARTURO). Then the camera's BEFORE paints
his riggers at the hoist (beatOwed; a party is otherwise painted only inside the crew's sight): the demo upright again 18 passed, 0 failed. VOTE:
records/target/bosses_vote_climb_11_10/. Phone pictures (webp): records/target/the_next_three_change_the_map/climb/ (2 his riggers and
their card, 5 they came down).

## THE SIX-BOSS GATE AFTER ALL THREE

gates/bosses_act_one_gate.js on the shipped tree (677a61354): 108/1, the red its own: it lit THE BURN's fire at his yard, which his
drums now light once he falls (this round's change), so 'dark before' could not hold there; it now lights the fire on a block nothing
lights yet. Again: 109 passed, 0 failed (lit false -> true, the street beside lit, sight 3 -> 6).

## WHAT THEY GIVE STANDS IN HIS SETTLEMENT (rule 445, ask line 571; the coordinator's routine 'BOSSES: prizes land in his settlement')

PAOLO: "what the bosses give us after they die... everything will be in our own custom settlement that we build from the ground up."
MEASURED: HOME BASE's seam (BUILD 11/10u) hands the prizes its own table lists (home_base.json prizes: cook, open, purify, with what they
pay the bill), so THE POT's, THE TAP's and THE FILTER's stood there; THE BURN's fuel, THE SURVEYOR's map and THE CLIMB's hook did not
(a gate run with all six down showed only prize:cook, prize:open, prize:purify waiting).
NOW (slices/bohemia_bosses.js (14)): every verb his kills handed him that HOME BASE's table does not list goes through the same seam in
the same shape and under the same id, BohemiaHomeMap.give({id: 'prize:<verb>', kind: 'prize', name: the hand's name, pic:
'boss_places/hand_<verb>.png', from: the boss, says: the hand's one plain line}); nothing is placed here (HOME BASE places it: the back
lots, a door on his town screen). Before he plants it waits and the seam says so; planting places it. Her card after the kill says where
it is, in the thing's own header: "HIS FUEL IS YOURS: IT WAITS FOR YOUR PLACE" or "...: IT STANDS AT YOUR PLACE". THE CLIMB's three
people go the same way (kind 'person').
THE GATE: G1 in gates/the_next_three_change_the_map_gate.js (the prize in the seam's record with his name, his picture and his boss, and
her card saying where; P5 planted: no prize turns it red); THE CLIMB's C1b also asks that his hook stands there once he plants.
THE PASS (base 36d698f01): THE BURN on the alpha on its side 20 passed, 0 failed (HIS FUEL waiting, her card 'IT WAITS FOR YOUR
PLACE', every card's buttons on the screen); THE CLIMB on the demo upright 20 passed, 0 failed (before he plants all six prizes wait:
prize:cook, open, purify, burn, survey, climb, and LUZ; planting placed them, his hook stands there). BUILD 11/10z.

## [bb] BATTLE BROTHERS FIRST

- Night on the Battle Brothers map shrinks what your company sees and lets things come at you unseen; a fire you make yourself is the
  game's own answer here (his verb). THE BURN's dark is that night made his: on his side it is darker than anywhere, because he took the
  fires. His drums after are the camp fires of the people he froze out.
- A location's men hold the ground round it (dev blog #66, the home bases file): his stokers keep his drums, and leave them when he falls.
- A location SENDS parties because it holds, and they come for you on the map inside your sight (the roaming parties): THE CLIMB's riggers
  are that, a party off his hoist that walks at you; beaten, another comes a day later, until he falls.
- Battle Brothers has no map of yours that forgets: its fog only ever lifts. THE SURVEYOR's hole is our own way (the map is a city whose
  signs a man can take down), and his lines after are the roads the company walks.

## ANALOG HORROR

THE CLIMB: two men coming down an empty street with a hook swinging, and lit windows high in a dead tower; after, a woman at the bottom of
the tower with everything she owns on her back.
THE SURVEYOR: a pole with no names on it and orange tape moving in the wind, and a map that un-draws behind you; after, a street with its
name back and white chalk lines running off to every town.
THE BURN: one fire in a black street and a man beside it who decides who stands near it; after, hands over a drum and a kid's face lit
orange.
