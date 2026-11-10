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

## [bb] BATTLE BROTHERS FIRST

- Night on the Battle Brothers map shrinks what your company sees and lets things come at you unseen; a fire you make yourself is the
  game's own answer here (his verb). THE BURN's dark is that night made his: on his side it is darker than anywhere, because he took the
  fires. His drums after are the camp fires of the people he froze out.
- A location's men hold the ground round it (dev blog #66, the home bases file): his stokers keep his drums, and leave them when he falls.

## ANALOG HORROR

THE BURN: one fire in a black street and a man beside it who decides who stands near it; after, hands over a drum and a kid's face lit
orange.
