# RUN 10/26: THE MAP FRAMES AROUND THE PHONE, PLAY TAKES YOU THERE, THE MAP FITS YOUR JOBS (rules 213, 227(c), 228(a), 238)

Session run-session_01ABSf1hy1, opened by the coordinator (rule 112); the worker was restarted once mid-round (a session limit) and
resumed on the coordinator's routine. BUILD 10/26zo - PLAY TAKES YOU THERE. Rows, in his order: [the map frames around the phone],
[play takes you there], [the map fits your jobs], [eyes: a job on a town's name], [eyes: the meet card's men]; first, what the last
session left unshipped on run-names-wip ([eyes: names on names], [eyes: the held talk]); and from EYES' new top row [eyes: the normie
hour, run] the frictions these rows are: F7, F8, F9, F25, F34. Then the coordinator's two new rows: [your main guy leads the walk]
(FIRST, rule 263(a)) and [make camp nearby] (rule 269(a)); [the map zooms in to the street] (rule 258) is NEXT.

UI TWO'S PHONE MERGED DURING THE ROUND (c7f98a79 and after). Every gate below was re-run against it: BohemiaPhone.padding() is the
margin now (portrait: the band under the phone's top, 286 px of a 736 glass, so the focus rides 143 px up; on its side the band
beside it). Its P.play paused first whenever the map's speed was above zero, and the speed stays 1.22 while he stands, so the first
PLAY with a job on paused: one marked line in slices/bohemia_phone.js (PAUSE only for a journey under way), NOTE on UI TWO's board.

## 0. Carried from run-names-wip (the last session was closed re-checking it)

The branch held two commits on top of what is on main (4a5b84bc, 8b19e000; checked with merge-base: door-taller IN main, names-wip
NOT). Both applied onto today's main (the gates' registry by hand, its neighbour had moved).
- [eyes: names on names] (__NO_NAME_COVERS_ANOTHER__): one list of names a frame (the panels over the glass, his crew, the towns'
  and jobs' plates, the region's places, then the land's names and shields); a name that lands on one already placed steps up a line,
  three tries, or waits for a closer zoom; a job's place and a party he is looking at always stand. ADDED THIS ROUND: UI TWO's phone
  lives in the shell over the map frame, so the list (and the gate's N2) also reads its rectangle (BOH_PHONE_RECT). Gate NO NAME
  COVERS ANOTHER, the phone: 5/0 (0 overlaps at 0.107, 0.141, 0.375, 0.456, 1 and 2.4, against 6, 7, 1 and 2 with the list off).
- [eyes: the held talk] (the materials' ten-second voice): after a wipe the men the fight left down say nothing (not their days, not
  who died); a death is said by a man with YOU, else YOU. EYES round four (q52) found the second half: 'DESI · DEAD · ANH NAKAMURA
  didn't get up, carnal.' The tag sits beside the SPEAKER's name, so a bare 'DEAD' read as DESI's own state. The tag now names the
  dead man ('ANH NAKAMURA DEAD'). THE WIPE WAKES IN TOWN W5b.

## 1. [the map frames around the phone] (rule 213(c)(d)(e), 238(b))

HIS WORDS: 'not directly in the middle of the screen, slightly off center, and as you zoom in, that's the same center... the phone
placement permanent... the same size.'

RESEARCH (the rule's own): Google's map SDK padding moves the visual centre off the covered margin and every camera move aims there;
games pad the HUD by the safe area and frame the camera by hand. UI TWO's phone module (ui-two-phone, not merged at this writing)
publishes the one function: BohemiaPhone.padding() (the phone's band on the cheaper axis: upright the band under its top, on its side
the band beside it), BOH_PHONE_RECT() in every frame, and a 'bohemia-phone' event on a flip or a turn.

MEASURED BEFORE: the camera held the crew at the glass's exact middle. On the phone the live 10/24 phone (#cityfeed, 156 x 250 at the
top right) covered the right 163 px of a 390 px glass and the crew stood at x 195, its edge 32 px from him.

NOW (__THE_MAP_FRAMES_AROUND_THE_PHONE__, slices/BOHEMIA_CITY_WORLD.html):
- THE FOCUS is the middle of the OPEN area, in the canvas's own pixels: the margin from UI TWO's padding() when it is there, else the
  live phone's rectangle as the cheaper band (the same rule as UI TWO's padFor); the open area never less than half the glass.
- The camera HOLDS the crew at the focus (camFollow), and the map's edge stops the OPEN area, not the glass (what lies under the phone
  may run past the edge). A look round by hand clamps the same way.
- EVERY ZOOM THAT IS NOT A PINCH anchors on the focus: setZoomAt with no pivot, the wheel (it was the cursor), Page Up / Page Down
  and Shift (two marked lines in the materials' __BATTLE_BROTHERS_KEYS__), the double tap, the far fit. A pinch zooms between the
  fingers once he has let the crew go; while the camera holds him the crew stays at the focus through it (rule 163(c), his 'keep this
  in mind as I zoom in and zoom out').
- THE FLIP AND THE TURN: the 'bohemia-phone' event, a resize and an orientation change re-read the margin at once and the camera
  eases there in 450 ms; the live phone (no event) is looked at twice a second, a re-draw only on a change.
- [COORDINATOR'S DEFAULT, rule 205, read plainly] 'slightly off centre': the off-centre is exactly half the phone's band, UI TWO's
  number; nothing of mine added to it.

GATE THE MAP FRAMES AROUND THE PHONE (new): F1 the margin read and the focus off the middle away from it; F2 held (his ground 0.00
px off, drawn 1.1); F3 four zooms without fingers (within 2.1 px); F4 a pan by hand (off 167 px) taken back (1.1 px); F5 a travel
of 13 blocks never under the phone, at the focus at its end (5.0 px drawn: he stands on the freeway's berm there, mapStandLift; his
ground on the focus); F6 let go, a zoom keeps the world under the focus (0.00 px); F7 the flip mirrors the focus (-58.5 / +58.5) and
the crew eased there in 481 and 723 ms; F8 turned on its side (844 x 330) and back, the focus recomputed both times; F9 the margin
off, he goes back to the middle (82 px off the focus); F10. PHONE 10/0, COMPUTER (see s6).

## 1b. Rule 286 on the map (the coordinator's routine, 08:20: 'the most important thing I want to fix': 'the settlement, camp, map
menu, portrait and landscape, getting fixed to look good with the phone depending on what side of the screen it's on, and making
sure we don't have repeating buttons')

LOOKED AT on the demo (records' pictures in the probe, phone 390 x 844 at 3x, tall and wide, the phone right and left): the crew in
the open area each time (tall: the band under the phone's top, he sits centred over it; wide: the band beside it, he sits on the far
side of the middle from it); the bar across the top, the phone in its corner, nothing of the map's own under it.
NO BUTTON TWICE, MEASURED: the map's reachable presses beside the phone were three in every layout: the bar's crew chip ('your
company', his face and 3/20), the settings gear, NOTES. The chip opens the company screen, the phone's CREW app's door: the one
double. NOW, on the map with the phone on, the chip is the count it shows and nothing to press (its plate like the bar's DAY
readout; a marked style in the map file, the materials untouched); the phone's CREW is the one door. The gear and NOTES are on no
phone app and stay. A flip of the phone's side re-lays the map in 129 to 453 ms (under a beat, F7); a turn in F8.
GATE THE MAP FRAMES AROUND THE PHONE F11 (no press beside the phone does what a phone app does, tall and wide, right and left) and
F12 (the line off, the chip comes back as the double): see the handoff for the run. The town's, the camp's and the fight's bars are
their owners' (RUN TWO, CAMP TWO, COMBAT TWO), UI TWO's sweep NOTEs them.

## 2. [play takes you there] (rule 227(c); the normie hour F9)

HIS WORDS: 'or when you press play it just walks you automatically towards the quest, perfectly.'

MEASURED BEFORE: the map's only path finder (cityRoute) is breadth-first, fewest BLOCKS, blind to the ground under them and to who
is on it. GO on the live pad with a job on and nothing picked did nothing (EYES F9, 'nothing moves for 8 s'); UI TWO's PLAY fell back
to a tap's door.

NOW (__PLAY_TAKES_YOU_THERE__):
- ONE CALL, window.mapPlayToJob(id), the one UI TWO's PLAY already makes (bohemia_phone.js P.jobGo asks it first). With a job on, the
  party sets out for where the job sends him NEXT (BohemiaJobKinds.nextOf: its place, the next post, the pack, or the paying town
  once it is done, rule 222), the job PLAY was given or the first he took.
- THE BEST ROUTE THE MAP KNOWS (mapBestRoute): Dijkstra over the valley's blocks by MINUTES, each block's own clock (cityStepMins:
  asphalt faster than dirt, the scout, a caravan's pace), plus the danger he can see: a crew hunting him, two blocks clear; a roaming
  party in his sight, a block clear; never round the job's own place or the town he is going to. A town is reached at its nearest
  side (the door's own rule) and opens on arrival.
- Legs with nothing on them run on (a patrol's posts, then home to be paid); a fight, a meet card or a town stops it; the next PLAY
  goes on. A tap anywhere else on the map is his own way (no PLAY mark on it, no run-on).
- Until UI TWO's phone lands, the live pad's GO and the spacebar ARE PLAY to the job when nothing is set and a job is on.
- Off the valley (the region's land) the route is the region's own (townTap, travelTo).

GATE PLAY TAKES YOU THERE (new): P1 PLAY alone, two real jobs off Church's board: 21 blocks to the wolves (39, 49), where the hunt
sends him; P2 PLAY's journey IS mapBestRoute's, and on 40 seeded trips across the valley never more minutes than the fewest-blocks
route, quicker on 20 (634 minutes saved in all); P3 a crew hunting him put on the plain route's middle: PLAY's keeps 4 blocks clear
for 2 more blocks; P4 the job done and owed in Church: PLAY sets out for Church (11 blocks) and arriving opens it; P5 a tap of his own
is his own; P6 no job, nothing; P7 the route off turns P1 red; P8. PHONE 8/0, COMPUTER (see s6).

## 3. [the map fits your jobs] (rule 228(a); the normie hour F7)

HIS WORDS: 'when you get out of the settlement the map should be as big as the two quests you added... depending where they are on
the map, with the padding, the screen flipped or straight up, it has to zoom out so the edges are where the quests are.'

MEASURED BEFORE: LEAVE put him back on the map at the zoom he went in at, the camera on him; at 2.4 the wolves' place was at x -102 on
a 390 glass (J5, the fit off).

NOW (__THE_MAP_FITS_YOUR_JOBS__): leaving a town with jobs held (the settlement's LEAVE) and taking a job out on the map ease the
camera in 650 ms to the zoom and centre where HE and every place his jobs send him next (and the main quest's place, when the game
has one: BohemiaMainQuest.place(), read if it exists, nothing faked) sit inside the OPEN area with room past them (40 px a side, 84 on
top where a man and his plate stand, 34 below). It only eases OUT from where he was (never closer than the opening zoom or his own),
so one near job keeps it close and two far ones show the city. The live phone hides in a town and comes back a moment after LEAVE:
the fit waits for it (1.5 s at most) so it fits the open area he will see. The camera lets go of him for the look; a pinch or a pan
during or after it is his; a journey takes the camera back (rule 163).

GATE THE MAP FITS YOUR JOBS (new): see s6.

## 4. [eyes: a job on a town's name] (EYES round two q24, q25; the normie hour F34)

MEASURED (EYES): a job's label ('FIND · THE SOUTH ROAD') over MOB's own name took the tap first (mapTapWhat asked the job kinds
before anything) and set out 16 blocks south for 3 h 16; the rescue's mark on Anarchists' name started the rescue fight (F34).
NOW (__THE_TOWN_TAKES_ITS_OWN_TAP__): a town's plate and building are asked FIRST; a job's label answers only where no town's is under
the finger. And by the names list (s0) a job's label never lands on a town's name: it steps up.

## 5. [eyes: the meet card's men] (EYES 10/25w k06, 10/25z q35; rule 198(g), the coordinator's 'fall back holds, now')

MEASURED: 'THE DOGS IN THE WRECKS · 4 MEN · SOME' for a dire wolf and a hyena; 'IN THE DARK' at 13:08; and after FALL BACK the
hyenas' card came back on every step toward Colorful. In the job kinds a pack that smells him (4 blocks) moves a block for each of
his, so he could never gain one, and FALL BACK stepped him away from the job's target, not from the pack.
WORLD reworked the same card this round (rule 224: no lone count, the count in data-n, their men drawn, beasts as eyes in the dark,
no words); merged on top of it:
- __THE_MEET_CARD_SAYS_WHAT_STANDS__: the count is the rolled band when there is one; a beast is never a man (WORLD's word when it
  rolled one, else BEASTS, HYENAS by the label); the dark is never said by day (WORLD's eyes replace the words).
- __FALL_BACK_HOLDS__: FALL BACK steps him away from THEM (the pack, the crew); for his next ten blocks the same party is never the
  card again unless he AIMS a walk at them (a tap on them, a walk that ends beside them, a chase); a walk past them to the town he
  was heading for is not a fight. The pack loses his scent for those blocks (WORLD's file, one marked line in STEP['hunt-kind']); a
  crew hunting him stays slower than him (the hunters' rule).
GATE MEET BEFORE YOU FIGHT (M9 to M11 new): see s6.

## 5b. The normie hour (EYES round four), the rest of RUN's eight

- F8 'Crew on the road. One touch sizes them up, a second goes.' with no crew in sight: the line now needs a party DRAWN this frame
  with its body in the open area (never under the phone or off the glass), within eight blocks (the materials' tenTeach).
- F7 = [the map fits your jobs]; F9 = [play takes you there]; F25 = [eyes: the held talk]; F34 = [eyes: a job on a town's name].
- NOT DONE THIS ROUND, said: F12 (paid on arrival with no pay moment: the job kinds fire 'bohemia-job-paid' and the voice says it,
  so the silence is where the town screen opens over it; not measured), F24 (the batteries at 22:00 while a toll line is cut off by
  the meet card), F31 (after a wipe the end screen's two words and three men drawn on the map: CAMP's company, rule 234).

## 5c. [your main guy leads the walk] (rule 263(a))

HIS WORDS: 'the character that's walking through Bohemia is not ... the main character of the origin.'
MEASURED: the map's lead was CHARACTER's generic 'body' (BOHEMIA_RIG_PEOPLE, records/target/character/rig/body: dark skin, dark hair;
its head reads 79,68,59), while the crew screen (the roster's man flagged main is look 'you') and the fight draw the combat rig's
YOU (slices/fight_rig/you.webp: pale, white hair, his own face on faces.webp; head 164,157,146). Two different men.
NOW (__YOUR_MAIN_GUY_LEADS_THE_WALK__): tools/bohemia_run_the_main_man_on_the_map.py cuts the fight's own YOU, his stand and six
walk keys in eight turns, into the map's people format with nothing redrawn (both stand 108 to 110 px, so no scaling; 686 x 1144,
3.1 MB decoded, slices/BOHEMIA_RIG_YOU), and the lead is drawn from it; when the saved company's main man carries a look of his own
(RUN THREE's maker, rule 263(b)) that look's model leads; the old body only if his sheet failed. WEAK, SAID: his gear in hand (the
fight's gun sheet) is not on the map yet; nobody on the map carries a weapon.
GATE YOUR MAIN GUY LEADS THE WALK (new): Y1 56 frames equal the fight sheet's (worst 2 levels), Y2 the lead drawn from his sheet at
the opening zoom and 2.4, Y3 on the glass his head reads 147,141,131 (28 from YOU, 123 from the old body), Y4 the roster's own man
flagged main is 'you', Y5 a main man with his own look (a rig_mix person) leads as himself, Y6 his sheet failed: the old body, read as
the other man, Y7.

## 5d. [make camp nearby] (rule 269(a))

HIS WORDS: 'if an enemy or a quest is stationary, before you enter combat: fall back, engage, and a third option, heal and set up
camp nearby; if they're roaming you don't have this option.'
NOW (__MAKE_CAMP_NEARBY__): the meet card's third button, MAKE CAMP NEARBY (draft words; key C), only before a STILL enemy: a
contract's crew at its spot, a job's camp, its lair, the guards on the thing to get back, a base he walks up to take. Never for a pack,
the raiders on the road, a thief running, a patrol's band, a wave coming at a town, a crew hunting him or a party he chased. It undoes
what the contact set (as FALL BACK), steps him ONE block back from them and makes CAMP's camp there (BohemiaMapCamp.make); they do not
move. When he breaks camp himself (campBreak 'left', one marked line in CAMP's block) he walks the block back into them and the card
asks again: ENGAGE from the camp when he is ready, or FALL BACK, or camp again. The compass on the camp's edges (269(b)) and the
pitching scene (269(c)) are CAMP's and CAMP TWO's.

## 6. Gates, both profiles (on the rebased tree, UI TWO's phone live)

THE MAP FRAMES AROUND THE PHONE 10/0 phone (the real phone: focus 195,225 on 390 x 736, F8 on its side 844 x 330 the band beside) and
10/0 computer (the 10/24 phone, before the merge); PLAY TAKES YOU THERE 8/0 phone (with the real phone) and 8/0 computer; THE MAP FITS
YOUR JOBS 6/0 phone (real phone: 4.74 -> 2.87, both jobs inside the top 450 px) and 6/0 computer (14.2 -> 8.87); MEET BEFORE YOU FIGHT
see the handoff; NO NAME COVERS ANOTHER 10/0 (phone and computer, after the panels' children were taken into their boxes: the speed
pad's buttons reach 7 px above it); ANY SIDE OF A TOWN IS ITS DOOR 9/0 phone after S6 and S6b were re-aimed (a finger on the phone is
on the phone: he looks at the town first; S6b reads the camera it taps) and 9/0 computer; MAP DENSITY 13/0 (G2 re-aimed by this lane:
the painted unit is read in the OPEN area beside the phone, what he sees: 1.48 x 1.26, it had read 1.51 over the whole canvas once
the camera moved, the painting under the phone included); THE MAP STANDS TALLER 13/0 phone; THE MAP'S KEYS 11/0; THE WIPE WAKES IN
TOWN 9/0; DEMO BUILD 25/0. RED, NOT MINE: EVERY JOB KIND E5 on the computer (a lost caravan fight left 1 of 2 crates where the gate
expects the bell's 2 of 2, WORLD's END['haul-caravan']); THE LOOP PLAYS ON THE MAP L6 to L8b (red before this round: Church's first
job is a patrol now; mine to re-aim).

## 7. For the lanes

- UI TWO: mapPlayToJob(id) is live; your P.play pauses first whenever TRAVEL_SPEED > 0, and the map's speed stays at 1.22 while he
  stands, so the first PLAY with a job on pauses (F9 again on your phone): test TRAVEL && TRAVEL_SPEED > 0 for PAUSE. The map reads
  your padding() and the event; the names list reads BOH_PHONE_RECT.
- WORLD: one marked line in bohemia_job_kinds.js (the pack's shy count); the card's beast word when rollInto could not roll.
- WORLD TWO: the bake's memory line, s8.
- UI: two marked lines in __BATTLE_BROTHERS_KEYS__ (the keys zoom about the focus); the crew-in-sight line (tenTeach) and the death's
  tag in RUN's own voice block.

## 8. For WORLD TWO: what the map's bake can carry inside the memory line (rule 173)

MEASURED last round (records/BOHEMIA_RUN_THE_CRASH_AND_ONLY_THE_FINAL_LOOK_10_25_26.md): twenty fights in a row on the phone, after a
CRITICAL memory notice, held at most 1,228 MB of the tab (WebKit's line about 1.5 GB) and 349 MB of canvases and bitmaps against
Safari's 384 MB: 35 MB of canvas headroom, and that is the tight line. A glass-sized canvas at his phone's pixels (1170 x 2532) is
11.8 MB; the painter's depth is 5.5 MB; FOG.cv (992 x 992) is 3.9 MB.
WHAT THE BAKE CAN TAKE: (1) the unseen city faint under static: REUSE FOG.cv (it is already the unseen mask, two texels a block,
tape static, 'bohemia.fog.v1'): change its look (the unseen alpha down from 246 so the painted city shows through, the static
stronger), no new canvas; (2) his pins and the cross where a man died: plates through the map's names list (mapNameTake, so they
step aside like every name), their record in localStorage, no canvas; (3) the boss found by a sign: a plate and a light on the block,
no canvas; (4) the boss changes his district: the painter re-bakes tiles in its worker from the block families; hand RUN the blocks
and the new family and RUN gives you the repaint call (a block's tiles dropped from the cache and re-asked), no second painting kept.
BUDGET: 8 MB of new canvas or bitmap in all (a quarter of the headroom), nothing glass-sized, nothing allocated per frame; THE MAP
STANDS TALLER's frame-cost leg and TWENTY FIGHTS NO CRASH are the checks.

## 9. [the map zooms in to the street] (rule 258; the coordinator's routine: 'after [the map fits your jobs]')

PAOLO 10/26: 'I want the zoom to zoom in a lot more, even on the main map... I should be able to zoom in more and see more detail,
almost like I'm on the combat map, or maybe use assets of the combat map... you feel like you're actually watching your team walk
through the city... you can easily zoom back out... it doesn't have to transition to a whole other screen or phase... the map is very
far from final.'

MEASURED BEFORE: the demo's map stopped at a block 85 CSS px wide on his phone (256 on his computer), where a house in the painting is
the size of his man's chest; a squeeze past it did nothing (rule 142's one map). The fight's ground is COMBAT TWO's painted blocks
(slices/fight_ground, fight-ground-10-2): 35 present-day blocks of five houses a side (a house 12 m, 515 x 364 art px), each 2575 x
1820, 18.7 MB once decoded, seen STRAIGHT ON from the south at 45 degrees; the map is seen CORNER-ON. The fight deals a district's
own 3 x 4 layout (fight_ground.json 'districts', 78 of the map's district names). A map block is 384 m (WORLD's one ruler), so six
fight blocks a side. The fight draws a house 171 CSS px wide to its 104 px man; the map's man is 55 px (his 72.5 px box).

THE CALL: the same pinch goes on past the old closest stop, on the same map, and the camera TURNS to the fight's own (an eighth of a
circle and a tip, corner-on to straight-on) through the first doubling, because the fight's blocks are painted straight on and laying
them corner-on would lean every house; the ground gives way from the painting to the fight's blocks as it turns, and goes on down to
THE STREET STOP, where a house stands to his man as in the fight (90 px to 55: 1.64, the fight's 1.64; a map block 2,700 px). The
person keeps his size (THE GROUND MAY ZOOM, THE PERSON MAY NOT), so 'his fight size' is read as the fight's proportion, not the fight's
104 px. If COOK paints the blocks corner-on one day (the NOTE), the turn is one number (STREET.swing, the tip and turn in streetCam).

BUILT (slices/BOHEMIA_CITY_WORLD.html __THE_MAP_ZOOMS_IN_TO_THE_STREET__; tools/bohemia_run_the_street_ground.py; slices/street_ground):
- the pictures: each present-day block at 160, 320, 640 and 1288 px wide (12.9 MB on disk, nothing redrawn) and one 14 KB index with
  the fight's district and board layouts. The map asks only the width the glass needs; far off a map block's thirty-six are laid once
  into one small picture (64 to 512 px); one byte budget (20 MB), the oldest let go first, never one on the glass, the sharpest width
  to the blocks nearest him and a lighter one past three quarters of the budget; the painting's own close tiles let go once the turn is
  half done (they were allowed 28 MB) and everything of the street let go three seconds after he leaves it.
- THE CAMERA: a point of the ground goes to the glass as F + M (w - W): W is the ground at the focus beside the phone, read off the
  map's own camera (so the crew is held, a drag looks around, the edge stops, exactly as on the map); M turns and tips with the zoom.
  What lies flat on the ground (the painting, the fog, WORLD TWO's tape) is drawn by the map's own code under one transform (L). The
  map's camera is whole pixels; on the street one of its pixels is up to 44 of these, so the street's camera is the exact one. The map
  holds the top of his block at the focus and stands him on his block's raised ground; through the turn the street comes to hold his
  FEET there and the lift goes, so he never hops at the hand-over (measured: the biggest frame-to-frame move 15.8 px phone, 18.6 computer).
- THE ZOOM: setZoomAt's first word (streetZoomAt): a pinch, the wheel or the keys past the closest stop go on into the street; a zoom
  with no pivot (the double tap, the far fit, a fit to his jobs) is a place to go and leaves it; pinched out past the turn the rest of
  the pinch is the map's. The alpha's walked-street seam is untouched (the street is the demo map's).
- THE WALK READS: past the old stop a journey never crosses the glass faster than a brisk walk: the map's 1.22 blocks a beat at the
  old stop, down to 60 CSS px a second by the end of the turn (a block 45 s at the street stop). Every block still pays its own minutes
  the beat he reaches it, as at any speed, so the clock runs slower while he watches. Between beats he walks TOWARD the next block (the
  lead: the share of the step the beats have paid for), so a town opens when he is at its gate; paused he holds; stopped between blocks
  he walks back onto his. His stride is the ground's (46 px a stride), his two keep his pace, he faces the block he walks to.
- ON THE STREET: the towns (their blocks dealt from the fight's town, fort and trailer layouts, their edge in their colour, their name,
  a finger on either the town's), the roaming parties he can see and the one hunting him at their size (their glide the whole gap
  between their steps), the ring where he stops, the fog only when a block on the glass is unseen (it was a third of the frame), his
  ring, him and his two, the names list, the night's wash. A tap is the block under the finger (CBcellAt). A drag moves the street
  under the finger.

GATE: THE MAP ZOOMS IN TO THE STREET (new, Z1-Z10 a profile): real squeezes past the old stop into the street on the same map (the
phone and the bar unmoved); the street stop straight on, all fight blocks, nothing missing, the proportion 1.64 to 1.64; a journey
there held at the focus (0 to 1 px), the ground by at 57 to 62 px a second, the stride turning, facing E walking E, his two with him;
a roaming party drawn in its people with a hit box; a tap travels to the block under the finger; squeezes back out to the whole city,
no jump over 30 px; frames: the street far 11 to 17 ms, the street stop 13 to 17, the turn 19 to 56, the map's own closest 56 to 148
(this box); two minutes at the close end: 15.5 to 19.9 MB held of 20, the painting's tiles 0 of 28, 0 failed; the street off turns Z1
red. THE NEAR END IS THE BLOCK re-aimed (N2 goes on into the street; N8 comes back out; N7 reads UI TWO's phone and its PLAY).

WEAK, SAID: (1) the fight's art is a suburb's: a downtown, the Strip's towers and a casino are drawn from what the fight has (low
houses, a casino FLOOR), so the city loses its towers past the turn; (2) the fight's blocks run their streets east-west (one freeway
block, no north-south freeway), so the street view's streets do not follow the map's own roads; (3) the turn crossfades two pictures
for about half the first doubling (rule 142 hated two maps ghosting; this one is a turning camera, short); (4) the crowds at the
places, the turf edges, the jobs' marks, the cargo truck and WORLD TWO's pins are not drawn on the street yet; (5) the clock slows
while he watches (his call, said in the reply); (6) the futures (raided, reclaimed) of each block are not used yet; (7) a new route
mid-block from a different next block starts him from his block's middle. NOTEs: COOK (the corner-on or north-south blocks and the
towers), ANIMATION (the walk call at the street stop), WORLD TWO (the pins' projection: window.streetTo), MOTION (the turn).
