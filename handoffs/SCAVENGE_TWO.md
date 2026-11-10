# SCAVENGE TWO -- the handoff block (written only by SCAVENGE TWO; chat opened 11/10 by the coordinator for rule 444(c); newest on top)

SCAVENGE TWO (scavenge-two-01gkdyuw, session_01GKDyuwd9J5VgYGseoRfqTe): 11/10 LATEST -- [scavenge rhythm] (rule 444(c), Paolo 11/10: 'the scavenge mini game
needs a little more love. I feel the skeleton, I appreciate it, but it's not rhythm based; out of everything I want that to be the most
rhythm based minigame'; ask lines 570, 324, 333; rules 441, 426(b), 438) BUILT, BUILD 11/10r - SCAVENGE IS THE RHYTHM, NOT YET SEEN.
Record (with the research): records/BOHEMIA_SCAVENGE_TWO_THE_BLOCK_PLAYS_THE_SONG_11_10_26.md.

WHAT IS IN THE GAME NOW (TAB: RUN, a town's junk lot, 'Search the lot'; and TAB: VOTE, the card he can play):
- THE SKELETON KEPT, untouched: the block's own board (the fight's dealer and bake in its camp mode), the crew at the fight's man size,
  up to six lit spots from the board's own tiles, one thing or nothing a spot, the finds table, the four hours once, LEAVE, the hand-off
  to the town (start({ask, left, seed, night}) in, scavDone(finds) out). slices/BOHEMIA_SETTLEMENT_SCREEN.html: TWO marked lines.
  __THE_TOWN_RESTS_UNDER_THE_GAME__ in loop() (under the game's cover the town draws nothing; MEASURED on the demo: frames over 20 ms
  85% -> 3.7%). __ONE_TAP_ONE_ANSWER__ by the picture's pointer handlers: FOUND, OLD, NOT THIS BUILD'S: a tap on the picture is answered on
  the lift and a phone sent that touch's click to the sheet that had just opened, so one tap on the lot could also press 'Search the lot'
  (SEARCH THE LOT ANSWERS was 7/3 on main for it, the alpha on its side); the click a tap on the picture still owes is swallowed now.
- THE PLAY IS NEW: every spot is a phrase of the PLAYING SONG (the shell's BOHEMIA_BEAT for the clock, MUS.fac() for its root and
  scale), four to eight beats at 120. Beats are born at the thing, come to the end of the old dial's track and ride it to the middle
  in two beats; he taps as each crosses. A house: taps on the beat ('x.x.xxx.'). The detector: it beeps a bar, each beep a bead, he
  taps the bar back a bar later. The siphon: a slug; press at its head, let go at its tail. THE DIAL'S OWN BANDS JUDGE: 48 / 115 /
  248 ms at HARD, times 1.25 at NORMAL (60 / 143 / 310). The find is the share of the phrase's points (80% best, 55% good, 25% scraps).
- FORGIVING: a tap goes to the beat he is late for; a let-go 1.3 times wider; the first beat of a visit 1.5 times; a stray costs a
  third of a note; THE ALLOWANCE takes a steady lag off his touch from the third tap (median of eight, trusted by how well his taps
  agree, -70 to +190 ms, kept in localStorage boh.scav.lag). Judged on the touch event's own time stamp.
- THE BEAT IS SEEN: beads, the needle on the next beat, the dial's middle pulsing, four lamps, the lit spots beating, the whole crew
  stepping in place on the beat, a strip under the board (a phone held up) with the phrase written as lamps. No audio at all: same play.
- THE SOUNDS: oscillator banks of named struck things (a hollow door, a boot on dirt, a steel jerrycan, a bubble up a hose, the
  detector's own tone), never a noise buffer, never a voice; on the shell's effects bus; grid sounds booked ahead on the audio clock
  for when they are HEARD (output stamp), further ahead the further the ear; past 120 ms to the ear his own tap goes soft and the
  booked ghost carries the phrase. Haptics through the one call (tap, dial_shot, deny, paid).
- THE COMBO ACROSS SPOTS: counted through the walk; at 4 / 8 / 16 / 24 the count pops, the crew steps deeper, the boots gain the tin,
  the can, its fifth; alive at 4 or more the boots keep time between spots. It never changes a find (rule 331's 'no chain' holds).
- NOT BUILT (rule 331, unchanged): noise, they come, hours per search, greed, district loot, a combo that pays.

FILES: slices/bohemia_scavenge_game.js (part 2 rewritten: ONE TABLE of every felt number at its top, PHRASES as readable rows),
slices/BOHEMIA_SCAVENGE.html (the play, the sounds, three sheets of glass, each man's poses cut out once), gates/scavenge_is_the_rhythm_gate.js
(registered as SCAVENGE IS THE RHYTHM), graveyard/scavenge_on_the_dial_11_10_26/ + graveyard/POSTMORTEM_SCAVENGE_ON_THE_DIAL_11_10_26.txt,
the alpha's and the demo's #buildstamp, records/target/BOHEMIA_VOTE_REGISTRY.json (one card), this file, the START entry.
BENCH: slices/BOHEMIA_SCAVENGE.html?bench=suburb&seed=11 (&pkg=0..4, &left=N, &night=1, &again=1 deals a new block when one is done).

GATES (rule 13, the pre-push pass by name; all on the final page and the final town file):
- SCAVENGE IS THE RHYTHM 42/0, twice in full (the bench 38 with sixteen planted fails; B6 the demo upright and on its side, the alpha
  upright and on its side: the clock 0.0 to 0.1 ms from the shell's beat, the playing song's root and scale, a spot all DEAD ON, the
  town resting under the game, the find paid and said by YOU).
- SEARCH THE LOT ANSWERS 16/0 on the alpha on its side (7/3 on main 04ead582 without __ONE_TAP_ONE_ANSWER__) and 16/0 on the demo upright.
- THE SETTLEMENT SCREEN 75/0. THE FOURTEEN EYES FOUND --only F538 9/0 (the game up: longest frame 100 ms). DEMO BUILD 25/0. HANDOFF 10/0.
- VOTE TAB 61/5, none mine (two DYNASTY whys, a PLUMBER 8 card's why and stage, a WORLD THIRTEEN why, the three alpha-lands-on-VOTE legs).
- RED ON MAIN, NOT MINE: GATE REGISTRY 6/1 (older orphans; this gate is registered), PAGES PUBLISH 27/1 (the published surface 907 MB
  over the 900 cap; it was 906 before this ship, whose picture is 250 KB).
- After the last two rebases (BOSSES' and COOK FIVE's ships, neither touching a file of this one): DEMO BUILD 25/0, HANDOFF 10/0, the
  gate's node legs 17/0. The full suite was not run by this lane; THE SUITE LINE is PLUMBER 8's.
- THE VOTE CARD, PLAYED: the alpha on a phone upright and on its side, the card first in the tab, in colour, LOOK AT IT, two spots all
  DEAD ON inside the card (my own script; the card's page is slices/vote/SCAVENGE_TWO_PLAY_IT.html).
MEASURED: the page's own work 0.4 ms a frame at 1x (was 4.07: twelve 18 MB sheets were being re-opened every frame; each man's poses
are cut out once now, at load and at the tap), 2.2 ms on a CPU slowed four times; with painting off the page's thread (as a phone's GPU)
12 of 1,693 frames over 20 ms at 4x; IN THE REAL DEMO at 1x 71 of 1,904 frames over 20 ms (781 of 918 before the town rested under the
game). The page's clock sits 0.0 to 0.1 ms from the shell's one beat. NOT PROVEN: a real phone in a hand, a real Bluetooth ear (EYES, 441(b)).

ROUTED: EYES (a real phone, sound on and off, a Bluetooth ear: does the allowance settle inside one spot; the levels against the music);
TUNING (the one table); WORDS (the cue and result words, draft:true); PLUMBER (the town rests under this game now; the same waste is
likely under the town's other covers); RUN TWO / TOWN FIX (one marked line in your loop());
THE COORDINATOR (the town opens it at NORMAL; the game's difficulty is not handed to it: one field, pkg).
NEXT, ONLY ON HIS WORD: his verdict on the card; anything he says about the feel goes in the same two files.

[bb Battle Brothers settles a search by a hidden roll inside an event; here the roll is a phrase of the song under his thumb.]
[analog horror: the phrase is the playing song's own dark scale; every sound a struck dead thing on a worn tape's drift.]
