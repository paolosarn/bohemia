# BOSSES, 11/26/26: RULE 480, THE WHOLE LADDER WALKED FOR REAL, AND WHAT IT FOUND (the coordinator's routine 'BOSSES: rule 480')

The routine: 'before act two, make every boss already built fully baked: each found by its sign, each fight plays start to LEAVE, each
changes the map as it should, no boss shown off the map's edge. Rule 480(c): every boss fight holds its frames on a slowed phone (390x844,
CPU slowed 4x). Act two only once all of that is green, and say which bosses you checked.' Rule 480 (Paolo 11/26): 'Lets turn up full
sweep. But improve on what we already have. And make sure fps is never choppy for nothing lets go.'

## WHY A NEW WALK
Every boss gate reached its own boss by felling the ones before him through the map's own fell(), a shortcut. EYES never reached the
later bosses in a real game (records/BOHEMIA_EYES_WALK_THE_11_21_BUILDS_11_21_26.md: THE MIDWIFE NOT REACHED; THE SMITH NOT REACHABLE
11/20). tools/bohemia_bosses_the_whole_ladder_11_26_26.js takes no shortcut: ONE new game on the demo, a 390 x 844 phone, every live
boss in the ladder's order:
- S his sign turns up on the map; the crew walks to it; his asker's and his thing's cards answered by real taps; he is found.
- F his place; his card; ENGAGE by a real tap; the fight on AUTO by a real tap, to its end; the spoils; LEAVE by a real tap. (THE MIDWIFE
  is met: the walk to her house, no card asks for a fight.)
- M his fall plays his change on the map (the beat, its pieces on the tape, the after card's line of what changed, his thing in hand).
- E through his beat's hold, his place is on the glass (the map's own iso() on the origin the map hands this lane's draw).
- R frames from ENGAGE to LEAVE and from LEAVE to his card, the CPU slowed 4x (Chrome's throttle, PLUMBER's SMOOTH IS A BUDGET's), the
  page's own BohemiaFrameMeter, every long frame named by its scripts (Chrome's long-animation-frame entries).

## WHAT THE FIRST WALK FOUND (before the fixes; all 19 live bosses, one game, the CPU slowed 4x in each fight)
19 walked: S 19 of 19 (each found by his sign), F 19 of 19 (each fight to LEAVE by a real tap; THE MIDWIFE met), M 19 of 19 (each
changed the map), E 18 of 19, 0 page errors. The checker ended 17 fights for the walk to go on (see THE CREW below).
(boss: S | the fight | M (pieces on the tape) | E | fight fps, worst ms, frames over 50 ms | beat fps, worst ms | this lane's code ms in the
fight + in the beat)

```
 1 THE POT       S True | won 113s 3/3 | M True (4) | E True | fight 9.2 fps worst 3249.8 ms, 727 over 50 | beat 2.3 fps worst 2049.9 | boss code 0+1061 ms
 2 THE TAP       S True | lost 124s 3/3 checker | M True (8) | E True | fight 10.3 fps worst 2799.9 ms, 943 over 50 | beat 1.8 fps worst 1133.3 | boss code 0+1045 ms
 3 THE FILTER    S True | lost 81s 3/3 checker | M True (4) | E True | fight 7.7 fps worst 5483.1 ms, 503 over 50 | beat 2.3 fps worst 1216.7 | boss code 0+819 ms
 4 THE BURN      S True | lost 52s 2/3 checker | M True (5) | E True | fight 9.4 fps worst 5099.8 ms, 313 over 50 | beat 1.8 fps worst 1416.6 | boss code 0+1163 ms
 5 THE SURVEYOR  S True | lost 83s 2/2 checker | M True (5) | E True | fight 5.1 fps worst 4899.8 ms, 235 over 50 | beat 2.1 fps worst 2083.2 | boss code 0+436 ms
 6 THE CLIMB     S True | lost 51s 2/2 checker | M True (4) | E True | fight 9.7 fps worst 4583.1 ms, 346 over 50 | beat 1.2 fps worst 4183.1 | boss code 6+1742 ms
 7 THE LOCKSMITH S True | lost 60s 2/2 checker | M True (5) | E True | fight 5 fps worst 4599.8 ms, 214 over 50 | beat 1.9 fps worst 1283.3 | boss code 0+1204 ms
 8 THE CHARGE    S True | lost 62s 2/2 checker | M True (3) | E True | fight 6.6 fps worst 5449.8 ms, 265 over 50 | beat 1.7 fps worst 1483.3 | boss code 0+1267 ms
 9 THE MACHINIST S True | lost 41s 2/2 checker | M True (15) | E True | fight 6.8 fps worst 5566.4 ms, 208 over 50 | beat 2.7 fps worst 1266.6 | boss code 0+1318 ms
10 THE PLATE     S True | lost 60s 2/2 checker | M True (2) | E True | fight 5.7 fps worst 4766.6 ms, 257 over 50 | beat 1.9 fps worst 1499.9 | boss code 0+1308 ms
11 THE TOOTH     S True | lost 31s 2/2 checker | M True (4) | E True | fight 8.8 fps worst 4833.2 ms, 244 over 50 | beat 1.9 fps worst 1183.2 | boss code 0+1056 ms
12 THE LENS      S True | lost 30s 2/2 checker | M True (3) | E True | fight 9 fps worst 4066.5 ms, 232 over 50 | beat 2.1 fps worst 1333.3 | boss code 6+1113 ms
13 THE BARBER    S True | lost 36s 2/2 checker | M True (21) | E False | fight 8.3 fps worst 3983.2 ms, 262 over 50 | beat 1.5 fps worst 3783.1 | boss code 0+1129 ms
14 THE INK       S True | lost 38s 2/2 checker | M True (1) | E True | fight 7 fps worst 4766.4 ms, 299 over 50 | beat 1.5 fps worst 1383.3 | boss code 0+1015 ms
15 THE DOGS      S True | lost 44s 2/2 checker | M True (4) | E True | fight 9.4 fps worst 4166.4 ms, 336 over 50 | beat 1.9 fps worst 1333.2 | boss code 0+1262 ms
16 THE WARD      S True | lost 35s 2/2 checker | M True (4) | E True | fight 8.4 fps worst 4266.5 ms, 298 over 50 | beat 1.4 fps worst 5866.4 | boss code 0+1108 ms
17 THE CISTERN   S True | lost 37s 2/2 checker | M True (4) | E True | fight 6.6 fps worst 5249.8 ms, 256 over 50 | beat 1.4 fps worst 2149.9 | boss code 0+1322 ms
18 THE SMITH     S True | lost 44s 2/2 checker | M True (4) | E True | fight 4.5 fps worst 5349.9 ms, 258 over 50 | beat 1.4 fps worst 1349.9 | boss code 0+1316 ms
19 THE MIDWIFE   S True | met | M True (4) | E True | fight - fps worst - ms, - over 50 | beat 1.9 fps worst 1066.7 | boss code 0+0 ms
```

FOUND, AND FIXED THIS ROUND (this lane's):
1. THE BARBER'S HOLD WAS SKIPPED ON THE SLOWED PHONE (E false): one frame was longer than the hold (700 ms), and the beat went
   glide > wipe > show: his place was never held on the glass before it changed. The beat's phases ran on the clock alone. NOW
   (slices/bohemia_bosses.js tick()): a phase is drawn at least once; a frame that would skip one steps to the next phase only and
   sets the beat's clock to that phase's start, so a slow phone sees glide, hold, wipe, show, a little later (LAST.beat.caught counts it).
2. THE NEXT SIGN STALLED EVERY BOSS'S BEAT: 0.8 to 1.3 s of 'bohemia_his_map.js setTimeout' inside each beat on the slowed phone.
   Measured (a profiler on the phone): the placing itself is 2 ms; the cost was the whole map's redraw forced in the timer, on top of
   the frame's own (63 to 81 ms a placing, 235 to 282 ms slowed), and it landed 1.5 s after the fall, inside the camera's move. NOW
   (WORLD TWO's slices/bohemia_his_map.js, edited by BOSSES as on 11/9 and 11/21): the redraw goes through the map's own
   ONE_RENDER.soon (the next frame, merged with it): the timer is 2 ms, 8 to 15 slowed; and the placing waits while a boss's beat plays
   or his after card is up (BohemiaBosses.busy(), new; a rumour's or an asker's card never holds a sign back; 2 minutes at most).
3. THE INK'S CARD SAID NOTHING OF WHAT CHANGED ('null'): he fell before his stain reached a town, and his row had no line for
   nothing to count. Twelve rows had none (THE TAP, THE FILTER, THE BURN, THE SURVEYOR, THE CLIMB, THE BARBER, THE INK, THE DOGS, THE
   WARD, THE CISTERN, THE SMITH, THE MIDWIFE). NOW each has one, the plain fact without the count (records/target/bb/boss_act_one.json
   'card_none'; 'HIS INK IS GONE', 'HIS TANKS ARE OPEN'...). No line rewritten (rules 454(a), 465): every 'card' is as it was.

4. EVERY BOSS'S FALL DREW THE WHOLE MAP INSIDE ITSELF: measured with the profiler on the slowed phone, a fall (the map's fell(), run 400 ms
   after the fight) took 455 ms, 446 of them in this lane's 'bohemia:boss-fell' listener, whose last line forced the whole map's draw; the
   map's fell() ended the same way. NOW both go through ONE_RENDER.soon (the next frame, merged with the beat's own): the fall is 74 ms
   slowed (the rest the fog's own cover, WORLD 15's) and 27 ms on the phone unslowed. This is the boss leg of EYES' row 725 (LEAVE from a
   fight freezes about a second), which is PLUMBER 8's for every fight.
5. THE WALK'S OWN READING WAS FIXED TOO: in the second walk THE LOCKSMITH read 1,356 px off the glass in his hold; the walk had read the
   map's origin in its own frame callback, a frame old (mid-glide) on a slow phone. Both the walk and the gate now read his place inside
   the very draw that paints the hold.

THE GATE: gates/every_boss_holds_its_frames_gate.js, EVERY BOSS HOLDS ITS FRAMES (registered): D1 the lines for nothing (19 rows), B1
the beat draws every phase with a 1.8 s frame planted in its glide, B2 his place on the glass through the hold, G1 the sign waits through
the beat and the card, G2 then turns up, its timer under 40 ms, F1 his fall draws nothing in its own frame (under 60 ms); planted
fails each. One phone, about 3 minutes. 13 passed, 0 failed (11/26).

## FOUND, NOT THIS LANE'S (for PLUMBER 8, the biggest first, and each owner; rows 723 and 725)
- THE FIGHT'S FIRST BOARD PAINT: every fight has one frame of 3.2 to 5.5 s on the slowed phone, 12 to 22 s after ENGAGE, of which
  'BOHEMIA_FIGHT.html frame' is 0.6 to 1.5 s of script and the rest is the page's paint (COMBAT, PLUMBER 8). The fights themselves ran
  4.5 to 10.3 frames a second slowed, 'BOHEMIA_FIGHT.html frame' the largest script by far (29 s of script in THE POT's 102 s).
- THE PHONE'S BOARD PAINT, NOW THE BIGGEST: 'bohemia_phone_board.js paint' in one frame, slowed: 15.1 s (THE DOGS' beat, the final
  walk), 11.2 s (a frame of THE INK's fight), 5.0 s (THE WARD's beat, the first walk), 3.3 to 3.5 s (THE BARBER, THE CLIMB). It reads every
  job's danger for the crew again (PLUMBER 4, 11/5: 276 ms unslowed) and skips only while a fight covers the map (UI, PLUMBER 8).
- THE MOTION TIMER: 'bohemia_motion.js setTimeout' 1.7 s in THE POT's beat, 'stopPic' 0.9 s in THE FILTER's fight (ANIMATION).
- THE MAP'S REDRAW: the beat redraws the whole map each frame (the camera moves); slowed it runs 1.2 to 2.7 frames a second (PLUMBER 8's
  map budget, PHONE4 'map far 3').
- This box paints the canvas in software on the page's own thread, so the slowed numbers are far under a phone's (PLUMBER 7, 11/7: 'a
  phone's GPU paints off it'); the hitches above are named by what took the time, which a phone shares.

## THE CREW (for TUNING and the fight's owners, not changed here)
The walk fights the 19 back to back with the crew the game starts with, never resting, hiring or buying. AUTO won THE POT (113 s, 3 of
3 standing) and lost the next 17 (the crew wounded from the fight before; one man dead at THE BURN, two after). A player rests, hires and
buys between bosses; the walk does none of that, so these numbers say the 17 are not won by a crew of three that never rests, and
nothing about a played game. In the final walk AUTO won THE POT, THE TAP and THE FILTER and lost the next 15 the same way.

## THE FINAL WALK (every fix in: a new game, the same shape, the CPU slowed 4x in each fight)
19 walked: S 19, F 19, M 19, E 19 of 19, 0 page errors. (A second walk between, with fixes 1 to 3 in, read S 19, F 19, M 19 and E 18:
THE LOCKSMITH, the walk's own stale reading, fix 5; THE BARBER held, THE INK's card 'HIS INK IS GONE'.) The first walk against the final,
per boss (SFME: found, fought to LEAVE, changed the map, on the glass; the beat's worst frame and this lane's code in it, before -> after):
```
boss          | SFME  | the fight (AUTO, s, standing)      | fight fps/worst  | beat worst ms       | this lane in the beat  
THE POT       | 1111  | won 88s 3/3                        | 8.1/3166.5       | 2049.9 -> 916.6     |  1061 -> 16 ms
THE TAP       | 1111  | won 90s 3/3                        | 9.3/3149.9       | 1133.3 -> 783.3     |  1045 -> 0 ms
THE FILTER    | 1111  | won 73s 3/3                        | 8.4/1866.6       | 1216.7 -> 683.3     |   819 -> 0 ms
THE BURN      | 1111  | lost 146s 3/3 checker              | 3.1/4283.2       | 1416.6 -> 3249.9    |  1163 -> 72 ms
THE SURVEYOR  | 1111  | lost 108s 2/3 checker              | 3.9/2966.6       | 2083.2 -> 1566.6    |   436 -> 576 ms
THE CLIMB     | 1111  | lost 45s 2/2 checker               | 9.9/3849.9       | 4183.1 -> 2383.3    |  1742 -> 11 ms
THE LOCKSMITH | 1111  | lost 49s 2/2 checker               | 7.9/8866.4       | 1283.3 -> 1133.3    |  1204 -> 21 ms
THE CHARGE    | 1111  | lost 35s 2/2 checker               | 8.8/3499.8       | 1483.3 -> 666.6     |  1267 -> 24 ms
THE MACHINIST | 1111  | lost 52s 2/2 checker               | 8.5/3933.2       | 1266.6 -> 633.3     |  1318 -> 11 ms
THE PLATE     | 1111  | lost 52s 2/2 checker               | 6/6249.8         | 1499.9 -> 1283.4    |  1308 -> 10 ms
THE TOOTH     | 1111  | lost 50s 2/2 checker               | 6.2/6816.3       | 1183.2 -> 933.3     |  1056 -> 11 ms
THE LENS      | 1111  | lost 74s 1/2 checker               | 6.1/4799.8       | 1333.3 -> 1466.6    |  1113 -> 339 ms
THE BARBER    | 1111  | lost 51s 1/1 checker               | 5.7/5683         | 3783.1 -> 1133.3    |  1129 -> 63 ms
THE INK       | 1111  | lost 39s 1/1 checker               | 5.7/11349.6      | 1383.3 -> 1383.3    |  1015 -> 23 ms
THE DOGS      | 1111  | lost 44s 1/1 checker               | 5.9/5766.5       | 1333.2 -> 15232.8   |  1262 -> 13 ms
THE WARD      | 1111  | lost 33s 1/1 checker               | 6.1/5349.7       | 5866.4 -> 5233.1    |  1108 -> 17 ms
THE CISTERN   | 1111  | lost 41s 1/1 checker               | 6.5/5533.1       | 2149.9 -> 1600      |  1322 -> 19 ms
THE SMITH     | 1111  | lost 29s 1/1 checker               | 6/4083.1         | 1349.9 -> 1199.9    |  1316 -> 13 ms
THE MIDWIFE   | 1111  | met                                | -                | 1066.7 -> 916.6     |     0 -> 0 ms
beat worst, the median of 19: 1383.3 ms before, 1199.9 ms after; this lane in all 19 beats: 20684 ms before, 1239 ms after
```
THE SURVEYOR's 576 ms and THE LENS's 339 ms of 'bohemia_his_map.js setTimeout' in the final walk are the map's fell() of the fight's end
(the fog's cover, WORLD 15's; the next sign is no longer in it). The worst frames left in the beats are not this lane's:
'bohemia_phone_board.js paint' 15.1 s in one frame of THE DOGS' beat, 2.7 s in THE BURN's, 1.0 to 1.5 s in five more, and 11.2 s in a
frame of THE INK's fight, slowed (UI; PLUMBER 4 measured the same paint 11/5: it reads every job's danger for the crew again, 276 ms
unslowed, and skips only while a fight covers the map; the crew changes after every boss fight, so it runs in his beat).

## THE BOSSES CHECKED (rule 480(b): say which)
All nineteen live: THE POT, THE TAP, THE FILTER, THE BURN, THE SURVEYOR, THE CLIMB, THE LOCKSMITH, THE CHARGE, THE MACHINIST, THE PLATE,
THE TOOTH, THE LENS, THE BARBER, THE INK, THE DOGS, THE WARD, THE CISTERN, THE SMITH, THE MIDWIFE.

## WHAT RAN BEFORE THE SHIP (BUILD 11/26o, on main as ECONOMY THREE's 11/26n left it)
- EVERY BOSS HOLDS ITS FRAMES 13 passed, 0 failed (the fall 19.5 ms, the sign's timer 8.4 ms, the hold on the glass after a planted 1.8 s
  frame); WORLD TWO's HIS MAP green (its B6: the next sign near where he fell, untouched by the wait, which only a shown after card or a
  playing beat holds); HANDOFF, PAGES PUBLISH, BOSS LADDER, ATTEMPT green.
- The nineteen per-boss gates were not run again one by one (about 25 to 40 minutes a way each); the final walk played every one of
  them end to end on the real page in one game, which is more than each gate's own shortcut walk does.
- ACT TWO (THE SOIL, the 20th) is not started: the routine says act two only once all of this is green, and this record is what says so.
