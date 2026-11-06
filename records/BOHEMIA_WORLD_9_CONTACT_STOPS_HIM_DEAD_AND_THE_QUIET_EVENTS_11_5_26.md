# WORLD 9 (chat 02, the map): CONTACT STOPS HIM DEAD, THE QUIET EVENTS, THE SPACE BAR, AND NOT ALL HUNTS (11/5-11/6/26)

Opened by the coordinator for rule 409's first wave. Four jobs, in his order: 401(b), 398(b), 396's computer half, 399 with 389.
BUILD 11/6b - CONTACT STOPS HIM DEAD, SPACE HOLDS 4X. BUILT, NOT YET SEEN.

## 1. RULE 401(b): CONTACT STOPS HIM DEAD (ask line 443)
His words (11/4): 'you still kind of slightly walking after someone wants to attack you'.

MEASURED BEFORE (the demo, phone, the default 2x, a chase into the nearest roaming party, every drawn frame sampled; the probe is
the gate's C1 leg): the logic stops on the block that met them, but the picture rides behind the logic (THE MAP GLIDES ALONG THE
ROAD keeps it about six tenths of a block back so the speed on the glass never jumps). When the card came up the picture was
0.725 of a block behind the logic and walked on 0.725 of a block, for 268 ms, under the card. The coordinator's read was right.

NOW (slices/BOHEMIA_CITY_WORLD.html __CONTACT_STOPS_HIM_DEAD__): the picture stops WHERE IT STANDS on the frame the card comes up.
- travelInterrupt('meet') (a crew's meet card) and travelInterrupt('event') (a road event that asks him something) call glideDead():
  the glide's queue is dropped where the picture IS, never a snap forward to the logic's block; a block the logic took on that very
  tick is not walked; every roaming party's picture stops the same way.
- While that card stands no picture takes a new block (glideHeld()); the hold waits out the few ms the card takes to build.
- The hop sets down over a quarter beat (glideLandLift, eased), never a drop in one frame; the legs stand (the idle pose).
- The card's dark (THE MOMENTS BETWEEN, btwCome) closes on where he stands on the glass, not on the logic's block.
- When the card goes, the next block starts from where the picture stands (FALL BACK, CAMP NEARBY, his choice): no snap either way.
- The logic is untouched: the fight, FALL BACK, the get-away and every rule that asks where he is read his whole block.
- CONTACT_DEAD.on false is the before (the gate's mutation).

AFTER (the same probe): the picture moved 0 blocks after the card in 2.5 s (it stood 1.17 blocks short of the logic's block on that
run: the step the logic took on the tick of contact is never walked).

## 2. RULE 398(b): AN EVENT WITH NOTHING TO DECIDE IS A POST (ask line 438)
His words (11/4): 'these little pop-up events are fucking with my fast speed vibe, if I make it four I have to make it again'.

MEASURED BEFORE: all 45 road events ask something (15 with two choices, 30 with three), so none of them is quiet; the quiet ones
were what came AFTER: every choice was followed by a SECOND card, the person's answer with one button (GO ON), and every side quest
ended on one too (records/target/BOHEMIA_SIDE_QUESTS.json, 15 quests). The map stayed on PAUSE under it until he pressed it. The 26
one-button talk lines inside the 15 side quests are the middle of a conversation he chose (one is 380 letters of a doctor's
dilemma): they stay cards. And a hole on the way: the road's posts went only to the old stream (BOHEMIA_FEED.push), which the phone
stops reading once the FEED engine has posts (bohemia_phone.js P.posts), so not one of them reached his screen.

NOW:
- slices/bohemia_road_events.js __A_QUIET_EVENT_IS_A_POST__: a card marked quiet with one way on or none (the answer after his
  choice, a side quest's ending) is never shown and never stops the map; its words are a post ('@theroad', the speaker's name and
  the line, what it gave him in brackets), its one way on runs at once, and a march that was set goes on at THE SPEED HE HAD
  (398(a)). QUIET.on false is the before.
- slices/BOHEMIA_CITY_WORLD.html, the feed's mouth (BohemiaFeed.mouth): the map's own verbatim lines go into BohemiaFeed.read()
  newest first by the game minute, so the FEED app and the strip under the phone show them like any other post; FEED's engine, its
  rows, its pace and its gates are untouched; the old stream keeps them too for a page without the engine.
- Only a real choice or real danger stops the map: the event's two or three choices, a crew's meet card.

## 3. RULE 396's COMPUTER HALF: THE SPACE BAR HOLDS 4X (ask line 435)
His words (11/4): 'when I hold, I want it to go four times as fast'; the rule: 'on a computer the same hold, with the mouse or the
space bar'.

NOW (slices/BOHEMIA_CITY_WORLD.html __SPACE_HOLDS_FOUR_TIMES__, and the shell's half in slices/bohemia_phone.js):
- A TAP (let go before TRAVEL_CLOCK.holdMs, the phone's own 350 ms) is the pause and the play it always was (rule 163(a)), on the
  key's release so a hold is never first a pause.
- A HOLD runs the map at the fastest step (4x) while the key is down; letting go gives back the speed he had (a pause stays a
  pause). His kept speed (TRAVEL_SPEED_LAST, the slider's saved pick) never moves.
- A card that comes up while he holds keeps the map held and gives his own speed back when it goes, never the 4x (the phone's rule).
- Both doors: the map's own page when it has the focus, and the shell (phone.js forwards the key down and up to the map's spaceKey
  and keeps the shell's old keydown from also pausing). Never while he types, never over a fight, a meet card or a road card, never
  over a town's screen. A key let go in another window gives his speed back and is never a tap.
- The mouse half was already the phone's PLAY hold (the coordinator, 11/5).

## 4. RULES 399 AND 389: WAY MORE QUESTS, NOT ALL HUNTS, THE GIANTS RARE (ask lines 439, 422)
His words (11/4): 'we definitely need more quests, I keep going all around the city just killing the sabre-tooth tigers'; 'the
amount of beasts I'm slaying, I feel like that's not realistic'.

MEASURED BEFORE (the demo, every town's board dealt for days 1 to 30, every refresh window, 14 places):
- THE BOARD WAS NOT THE CAUSE. Without the day's danger floor: 263 offers, recover-return 18%, haul 17%, find-place 12%, hunt 7%,
  big game 4%; with the floor's reads in: 241 offers, haul 19%, recover 16%, find-place 13%, hunt 7%; no window's top kind over 26%.
- THE HUNT WAS. A hunt asks for 4, 7 or 10 kills from three roaming packs of 2 to 4; every pack drew its animal from the ground it
  spawned on (beasts_by_ground); a cleared pack came back four blocks farther out, toward the rim; and the hills' mix was four parts in
  nine slow lab giants (sabre-tooth, short-faced bear, ground sloth, the American lion), the open desert five in thirteen (Camelops,
  the bear, the lion). So one hunt near the rim walked him in rings round the town killing packs of sabre-tooths, up to ten.
- The show's two tigers (qd-aa15) asked for 2 but sent three packs of 2 to 4 lions.

NOW (rule 389's default, built):
- records/target/BOHEMIA_JOB_KINDS.json 'giants' (kinds: sabres, bears, sloths, prides, camels; max_share 0.05): the slow giants are
  out of every ground's mix; the hills and the open desert are the real Mojave in their place (wild burros and horses, coyotes, a
  mountain lion now and then); beast_looks pack_max (a mountain lion two at most, a giant one).
- slices/bohemia_job_kinds.js __THE_GIANTS_ARE_RARE__: a giant is never drawn for a pack, a hunt or a guard even if a modder puts
  one back in a mix; a giant named as a foe is always ONE animal (need 1, one pack of one); a hunt row may set its own count (the
  show's two tigers: one pack of two); a board row may carry its own legs.
- THE GIANTS AS NAMED RARE HUNTS (big game, one beast, one fight, its own row's legs): the old lion is now the lab's American lion
  (it was drawn as a mountain lion), and two more: the sabre-tooth in the red rocks (fortress boards) and the ground sloth at Tule
  Springs (the valley's own fossil beds, where its bones were found).
- FIVE NEW KINDS (rule 399(b), Battle Brothers' contract list as the floor, Bohemia's skin, data rows with legs, no code of their own):
  THE DEN (root out a lair: one den, all of it at once, in its yard), FIND OUT (rule 388's stew: ask the butcher, look behind the old
  Albertsons, tell her the truth or keep it), THE MEAT (rule 392: what the vultures found, tell the camp where it is, paid in meat),
  FOLLOW (rule 391's long game through a faction we have, rule 374: follow the courier after dark, a man in a Network pin; take the
  bag, let it go, or take his batteries), THE FARM (the Mob's grow house when the power fails, held till the lights come back). Each
  has its board person (draft:true words), its pay baked by ECONOMY's formula (tools/bohemia_economy_job_pay.js: the den 60, find out
  10, the meat 10, follow 78, the farm 76, the sabre-tooth 110, the sloth 95).
- The kinds now: 24 (19 before), 60 offer rows (53).

## NOT DONE, SAID OUT LOUD
- 399(a)'s 'a town offers what its people need (a faction's own jobs)': the deal (slices/bohemia_board_shelf.js, RUN TWO's) picks by
  tier only; a row has no faction to be honoured by. The new rows name their factions in their words (the Mob's farm, the Network's
  man, the clinic's Church sister), but which town posts them is still the tier's. The next step is a 'faction' on a row and the deal
  putting a place's own faction's rows first: RUN TWO's file.
- The arena's nights (375) and the Mob's farm as a story chain: the farm is one job, no chain.
- 409(c), the missing places from the Pocket City 2 check: next round's, as the coordinator said.

## GATES (one at a time, this box)
- NEW gates/contact_stops_him_dead_gate.js: 18 passed, 0 failed (computer; C1 a real chase slid 0.000 block, C6 the mutation slid 0.62; Q2 the march on at 4x after his choice; Q4 a quiet card on a 4x march, no stop; S1 to S3 on both doors).
- NEW gates/way_more_quests_not_all_hunts_gate.js: 7 passed, 0 failed (278 offers in a month: top kind 25% in its worst window, hunts 7%, giants 3.5% of 254 expected fights, the sabre-tooth 2 fights; dogs 40, lions 9, wolves 7; the mutation deals 7 giant packs in 252).
- RAN, one at a time: a job pays for the time and the risk 23/0 (after the pay bake), DEMO BUILD 25/0, THE MAP GLIDES 14/0, EVERY JOB KIND
  37/0, THE FEED IS ALIVE 29/0, THE RADIO LIVES IN THE FEED 5/0, NOTHING POPS, VOICES CLEAR 38/0, THE BOARDS ALWAYS HAVE WORK 24/0, THE
  BOARD'S QUESTS ARE PEOPLE 17/0 (its one red was mine: four new lines had three sentences, the client speaks a job in two; fixed).
- RED, NOT MINE, main's files swapped in with the same numbers: THE PARTIES WALK 6/4 (walking people on 0 frames, a party moving 7.299
  blocks in a frame, his two at his shoulders 0, nobody walking after the clock stops 0); MEET BEFORE YOU FIGHT 9/6 (M6, M9, M11, M13 to
  M15, every one the same on main).
- RED, MY DATA MEETS A GATE'S TIMING (UI's THE PHONE, 159/5): its leg 'PLAY alone sets off toward it' took the new den job off the board;
  the tap on the job's card already walks him toward it for up to 3 s (rule 376), the den is 6 blocks out, so he is at it before PLAY
  is pressed (measured: the den 6 blocks from Anarchists and from him). The other four reds in that run are the fight's phone strike and
  two 'the walk finished' throws after it (the right-hand run; the left-hand run of the same legs is green). For UI: the leg wants a job
  farther than the walk it lets run, or to stop the walk before it can arrive.

## ONE LATE CHANGE
- A road card's dead stop is only for a march in progress: a job's talk card on arrival (the march already ended) lets the picture walk
  in to the block he arrived on. The contact gate was rerun after it: 18/0.

[bb Battle Brothers stops the company the instant a party engages it, and the event screen pauses the world only when it asks you to choose; its beasts are packs of wolves and direwolves, its giants (the Lindwurm, the Unhold) are rare named hunts.]
