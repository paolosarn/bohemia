# FIXES 5 -- THE REST OF THE NEW REDS (11/27-28/26, FIXES 4's handoff; VAMILY rules 495, 461(c) amended)

The ask (the coordinator's VAMILY to FIXES 5): the rest of CAMP FOUR's 95 new reds (its full suite on main 1a47fd794: 434 red, 95 not on
the quarantine), bugs he can feel first; each fix where its cause lives; a stale check brought back to the truth, never loosened; each
commit naming where the cause was. Gates in the foreground with a timeout, never in the background, nothing outside the repo.

## 0. THE LIST, REBUILT

The 95 names were never committed (CAMP FOUR's runner wrote them to a BOHEMIA_SUITE_DONE file in its own container). The suite prints a
gate's owner as the first words of its description (`wh[:30]` in gates/bohemia_gates.py), which is where CAMP FOUR's 'by owner' counts
came from. So the list is rebuilt the same way: every gate in the table, not on gates/BOHEMIA_QUARANTINE.txt, whose description starts
with one of the owners CAMP FOUR counted. Where a lane has as many gates as reds (COMBAT 9, COMBAT 10, PLUMBER 3, FEED, UI TWO, WORLD 11,
PLUMBER 6, RUN SIX) the red is that gate; elsewhere the lane's gates are run one by one, felt first. Each run alone on main (ef1881941 for
the final runs of the four re-aimed gates), in the foreground, under a cap.

## 1. WALKED THIS ROUND

| gate | owner | verdict | the cause, and where it lives | after |
|---|---|---|---|---|
| THE SAVE COMES BACK THE SAME | RUN SIX | STALE INSTRUMENT (not felt) | red one reload in three, S1 to S4 in turn, alone too: after CONTINUE the party walked off. Traced: the third tap reached the map's canvas (`up` -> travelTo at the middle of the glass). The shell's own clock, one failing reload: CONTINUE at 0, the door off the glass at 664 ms, the map's hold let go at 939 ms (a beat after the door, RUN SIX's rule), the third tap after it. The thumb was `await tap(); sleep(120); await tap(); sleep(250); await tap()`, and a tap's await returns when the page has handled it: the page is busy restoring the save, so the second touch was handled at 674 ms and the third SENT at ~940 ms. A finger's touches are queued at 0, 120, 370 ms. The cause lives in the gate's thumb, not the door. | the thumb sends its touches on the finger's clock (CDP Input.dispatchTouchEvent, not awaited one by one); the map's frame counts every touch that lands on it; a NEW door leg per reload asks for none (S1 to S4: 0 on the map; the shell took 3 of 3, 'the map held'); S5 (the hold off) asks for at least one (2 on the map). On that clock a touch that does reach the map does not always move him (the second starts a journey, the third stops it, the map's own 'a second tap cancels'), so 'nothing moves' alone was blind to a door that let the thumb through: the leg is stricter. 26/0 |
| A RETREAT GETS HIM AWAY | RUN SIX | STALE (rule 472(a)) | R4 'camped 0 game hours', R5 'still holding the field'. Measured on R4's camp: CAMP.on, campDone() true, hours 0 over 120 beats. A retreat from the lineup hurts nobody, and since CAMP FOUR's __CAMP_WAITS_FOR_HIM__ (rule 472(a), Paolo 11/22: 'when everyone is healed I want time to stop') a camp made whole runs no hour. The cause is the gate's way of passing two days, not the hunters. | the two days are the camp's own old hour, run with him standing three blocks off: advance(60), six meetWalk(mapStepWorld) steps, contact read after each (the way CAMP's A TOWN IS SAFE drives the world). R4: 2,880 game minutes, 0 cards, never moved; R5: they leave the field 12 game hours after the fight. 14/0 (one probe run met 'THE FIGHT NEVER HEARD RETREAT' mid-fight once in three runs; not seen in the gate's own two runs) |
| THE FEED IS ALIVE | FEED | STALE (rule 472(a)) | C5 'camp true, 0 game hours' both profiles: the real HEAL tap on a crew that never fought. Then with his men hurt: 6 game hours ran and still no world or life post: the feed paces its talk by the glass's own seconds while the clock runs live (records/target/bb/feed_kinds.json pace.real_gap_s 12, live_jump_min 90), and a six-hour mend runs the clock about three real seconds. The camp used to run 75 real seconds. | C5: his men handed a fight through the condition's own door (BohemiaCondition.afterFight, the shell's call after every fight; tools/bohemia_hand_a_fight.js), the real HEAL tap, the hours run while they mend: 6 game hours. C5b: the clock running (that camp, then a played minute on the road), the city talks: 4 -> 9 posts, mine 5, world 3, life 1, every one from a handle in the file. 31/0 |
| A PACK HE RAN FROM LETS HIM GO | WORLD 11 | STALE (rule 472(a)) | P2 'made true, hours 0': the same whole-crew camp. | P2 hands a fight first (the same helper) and reads the camp for its whole mend, to the hour the clock stops: 6 game hours, mended, 0 cards, never within two blocks. P2b (already there) stands him two blocks off for 1,500 of the world's steps, about ten game days. 9/0 |
| AUTO AT 4X NEVER CRASHES | COMBAT 10 | UNSURE, ITS 'BEFORE' BAR (not a crash) | A1 to A5 green (16 against 30 at 4x on AUTO: no error, nothing stacked, the heap 14 -> 19 MB, the pictures let go). Red: A3's 'the way it was', the whole darkened sheets against the cells at night, 695.6 -> 362.9 MB, 1.92x against its 2x bar. The leg compares the whole picture peak, day sheets included, and the day sheets have grown since 11/6 under both numbers (A2's day peak 376.5 MB). A6 (the demo through the map) not reached inside 400 s; the gate runs about 500 s alone. | NOT CHANGED: whether the bar should read the night's own share is COMBAT's (COMBAT SIX is live on rule 484, 'combat keeps crashing'). Handed. |
| YOU SEE THEM RUN | COMBAT 9 | LOAD | | 7/0 alone |
| THE PHONE | UI TWO | LOAD (slow) | 341 s alone, past the pack's share of the clock | 268/0 alone |
| FIRST PLAY IS LIGHT | PLUMBER 6 | LOAD | | 7/0 alone |
| THE HEAP STAYS FLAT | PLUMBER 6 | LOAD | | 5/0 alone |
| WHAT LIVES ON THE MAP HAS A CAP, THE KILL GOES IN THE STASH | WORLD 12 | LOAD | | 6/0, 14/0 alone |
| THE PLACE IN THE DARK | WORLD | LOAD | (camps too, but waits for 'the camp gone or a day passed', so the stop is not a red) | 20/0 alone |
| THE MAP'S PEOPLE ARE PACKED | CHARACTER 3 | LOAD | | 9/0 alone |
| THE BOARDS ALWAYS HAVE WORK | PLUMBER 3 | TIMEOUT (slow) | its legs green to B1 at 146 s; over 330 s alone, so in the pack it is a timeout | not finished this round |

## 2. THE CLASS, SWEPT (WORLD's 8/29 lesson: one cause, every gate it reaches)

Three of the reds were one cause: a checker made camp to pass time, and since rule 472(a) a whole crew's camp holds the clock. Every gate
that calls BohemiaMapCamp.make() or taps HEAL was read: CAMP's own gates (they hurt the crew first, or test the stop itself), THE PLACE
IN THE DARK (waits for the camp gone or a day, green), WHAT LIVES ON THE MAP HAS A CAP (reads the embers, not hours, green), THE MOMENTS
BETWEEN and THE FIGHT OPENS THE FIGHT (quarantined, their owners' lines), and gates/everyone_in_the_fight_holds_gate.js (camps 'until the
half day is spent': the same stale step, and it is NOT in the suite's table at all, an orphan file; PLUMBER's).

## 3. ONE THING, ONE PLACE (rule 495(b))

tools/bohemia_hand_a_fight.js: a checker that needs his men hurt hands a fight's wounds through BohemiaCondition.afterFight, the shell's own
call, instead of writing 'bohemia.condition.v1' by hand. Two gates use it this round. Fourteen gates still write that storage by hand (the
camp's, the face's, the fight's); each moves to the helper when its owner next touches it (PLUMBER 9's count, rule 495(c)).

## 3b. THE PRE-PUSH PASS (rule 13(a))

HANDOFF 10/0, SUITE HONESTY 28/0, THE RED DEBT ONLY SHRINKS 4/0, MERGE DEBRIS 4/0; the four re-aimed gates as above. THE PATCH LAYERS ONLY
GO DOWN 9/1 here AND the same on clean main ef1881941: R5 pasted copies 42 against PLUMBER 9's ratchet of 41 (hz and rngOf in
bohemia_big_inside.js, bohemia_casino_floor.js, bohemia_flood_tunnels.js, bohemia_parking_garage.js; hash in bohemia_arena.js,
bohemia_aftermath.js, bohemia_freeway_boards.js): a copy landed on main after the ratchet was set (71a38fe42); PLUMBER 9's, named, not
this diff's.

## 4. STILL TO WALK (in this order: felt first, the many-gate lanes by gate)

UI 4 (NOTHING POPS, VOICES CLEAR, TOOLTIPS), RUN THREE (THE GAME STARTS IN A TOWN, YOUR CREW LIVES IN THE TOWN), PORTRAIT (THE FACE SHOWS
THE WOUND, EVERY FACE BREATHES), WORDS THREE 3, RUN FOUR 4, MOTION 3 3, COMBAT 7 5, BOSSES 6, UI FIVE 7, WORLD 14 11, CHARACTER 5, PEOPLE
22, ANIMATION 18, UI 21, RUN 7. AUTO AT 4X's A6 needs its own run under the full cap.

## 5. WHAT HE WOULD MEET

Nothing new on the screen this round: four checks that cried wolf now tell the truth, and the door that keeps a hurried thumb off the map
is measured where it holds. TAB: none (the checks are the studio's).

## 6. THE SECOND STRETCH (11/28, BUILD 11/28j - A NAME IS NEVER CUT)

| gate | owner | verdict | the cause, and where it lives | after |
|---|---|---|---|---|
| ONE HAND OR TWO | UI FIVE | REAL (felt, small) | on its side the shop strip is a 172 px column whose box keeps its height for every piece (UI FIVE: 'nothing moves from one piece to the next'), so a name has one line, cut with an ellipsis: 'Beat-up guard carbine' (ARMORY 3's) is 175 px. Measured over every name the shop can sell, in its font: 40 of 221 were wider than the line (armour and weapons; 'Bundle of Heavy Throwing Axes' 241 px). The cause lives where the strip writes the name (slices/BOHEMIA_SETTLEMENT_SCREEN.html shopStripFill). FIRST TRY WRONG, SEEN ON THE GLASS: a name let wrap took a second line its fixed row clipped under the numbers ('Beat-up guard' and two dots), and the gate's 'name whole' passed it (it asked only that the name sit in the facts box). | shopNameFits: a name wider than its line closes its letters up, then steps down a pixel at a time to the 11 px floor; 38 of the 40 now fit (the carbine at 164 px, 13 px type). The two longest ('duct-taped carpet padded vest', 'Bundle of Heavy Throwing Axes', 192 px at the floor) still need a second line the box has not got: UI FIVE's box or WORDS' name. The gate's H2 now also asks the name to sit inside its own row (less than a quarter of a letter below it; the row's own padding is 2 px, the clipped line was 14). 25/0 demo and alpha, upright and on its side; THE WAGON AND THE SIX 10/0 and NO LINE UNDER ANOTHER 3/0 (the stall strip unmoved) |
| THE VOICE HOLDS | WORDS THREE | STALE FIXTURE | its plant ONE GOOD REWRITE opens the job board's mouth on a copy and adds one marked line; since JOBS 2's 11/27zzd (THE CARAVAN GOES TOWN TO TOWN) that mouth carries six new lines, legal while it is closed (H1 counts them), unmarked, one with Spanish ('nunca antes'), so opened they rightly fail H2 and H5 and the plant stopped asking its own question | the plant's copy is the mouth as frozen plus the one marked line. 11/0. For WORDS THREE: the day he opens the job board's mouth, those six are a rewriter's to mark, and the Spanish one is H5's |
| THE FIGHT'S WEIGHT, THE UI MORPHS EVERYWHERE | MOTION 3 | FRAMES (handed) | red alone on a quiet box: a blow's frame 320 to 420 ms with the CPU slowed 4x (W1 to W3), LEAVE's fold one drawn frame, E6 under 40 fps. MOTION 3 measured a blow's beat at one or two frames (about 140 ms) on 11/10. The idle fight at 4x: median 44 ms a frame, 80 percent of the time the browser's own painting ('(program)'), the script on top small (the phone strip's layout reads, bohemia_phone.js fitStrip and offsetIn, about 6 percent). On this box (no graphics chip) the fight's frame is heavier than when these were written | NOT CHANGED: the fight page is three lanes' this round (COMBAT SIX, FIGHT SCREEN 4, CHARACTER 4); the frame budget is PLUMBER 8's |
| EVERY BOSS HOLDS ITS FRAMES | BOSSES | REAL (data, not felt) | D1: BOSSES' 11/27zu lairs (bosses 10 to 18) carry a card line ('{WORD}: +{haul} BATTERIES') and no line for nothing to count; the game hides the line when the hoard pays 0 (only on a purse error), so nothing wrong shows | handed to BOSSES (live; their own new data's words) |
| THE KILL CAMS | COMBAT 7 | TIMEOUT (slow) | 9/0 alone in 564 s of the 600 s cap | wants splitting (COMBAT's) |
| THE BOSS ARRIVES | BOSSES | TIMEOUT (slow) | 27/0 alone in 403 s | wants splitting (BOSSES') |
| EVERY LEVEL WAITS, SCRAP IS TAPE, OPTIMIZE LOOT, MAKE CAMP FROM THE FIGHT | RUN FOUR | LOAD | | 12/0, 11/0, 22/0, 11/0 alone |
| RETREAT IS A RUN FOR THE EDGE, THE ENEMY WANTS TO LIVE, THE DECOY, HEAVY ARMOUR COSTS A TILE | COMBAT 7 | LOAD | | 5/0, 4/0, 6/0, 8/0 alone |
| THE CARD WAITS ITS TURN | BOSSES | LOAD | | 10/0 alone |
| THE PERKS FIT, EACH SLOT ITS OWN PICTURE | UI FIVE | LOAD | | 10/0, 29/0 alone |
| NOTHING POPS, VOICES CLEAR, TOOLTIPS | UI 4 | LOAD | | 38/0 alone |
| THE GAME STARTS IN A TOWN, YOUR CREW LIVES IN THE TOWN | RUN THREE | LOAD | | 15/0, 10/0 alone |
| THE FACE SHOWS THE WOUND, EVERY FACE BREATHES | PORTRAIT | LOAD | | 32/0, 15/0 alone |
| HIS ANSWER IS KEPT, THE VOTE TAB IS NEVER CHOPPY | WORDS THREE | LOAD | | 15/0, 7/0 |
| THE CAMP LETS GO WHEN HE LEAVES | MOTION 3 | LOAD | | 7/0 alone |

THIS LANE'S OWN ORPHANS: FIXES 4's three gates of 11/27 (LEAVE LIGHTS ON THE GLASS, A BEAST BITES LIKE A BEAST, NO LINE UNDER ANOTHER)
were run by hand and never put in the suite's table, so nothing ran them after. Registered (3/0, 8/0, 3/0 alone).

STILL TO WALK: UI FIVE's three (THE ALPHA SAYS CONTINUE, HIS FINGER ON THE DOOR, THE UI HOLDS ITS FRAMES, THE CLOCK UP TOP), the later
BOSSES three (4 TO 6, 7 TO 9, THE HARD PLACES: newer than CAMP FOUR's run), WORLD 14 11, CHARACTER 5, PEOPLE 22, ANIMATION 18, UI 21, RUN 7;
AUTO AT 4X's A6 under the full cap.

WHAT HE WOULD MEET (TAB: RUN on the alpha link, and the demo link): at a smith or an armourer with the phone on its side, a long name
('Beat-up guard carbine') reads whole in the strip beside the shelf, its letters a little closer, nothing else moved.
