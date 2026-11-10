# SCAVENGE 2: THE BLOCK PLAYS THE SONG (11/10/26, BUILD 11/10r)
Lane: SCAVENGE TWO. VAMILY rule 444(c); ask line 570 (and 324, 333). Rules 441 (fully baked), 426(b) (his YES on the
skeleton), 438 (Search the lot answers), 331 and 334 (his three, the rhythm, the crew on screen).

## FOR PAOLO (five lines)
1. Same way in: a town's junk lot, "Search the lot", four hours once. Same board, same crew, up to six lit spots, one thing or nothing a spot.
2. Now every spot is a short piece of the song you PLAY. Beats come to your man around the old dial and you tap each one as it crosses the middle.
3. A house: tap the beat. The detector: it beeps a bar, you tap the same bar back. A car: hold when the slug reaches the middle, let go when its tail does.
4. Your whole crew steps on the beat. Good timing gets the best thing there. A streak across spots makes the crew step harder and the sound fuller.
5. Sound off or on Bluetooth it still plays: the picture is the judge, and the game quietly learns how late your thumb runs.

---

## 1. HIS WORDS (the only source)
- 11/10 (rule 444(c)): 'the scavenge mini game needs a little more love. I feel the skeleton, I appreciate it, but it's not rhythm
  based; out of everything I want that to be the most rhythm based minigame'.
- 11/7 (rule 426(b), his YES on the skeleton): 'I want it to be like a fun minigame'.
- 11/2 (rule 331, LOCKED): 'Search houses, the detector, the siphon: these are the only ones I liked... depending on the map, but
  somehow involving some rhythm-based game working in the Dead Shot Dial'.
- 11/2 (rule 334): 'our crew, whoever is in it, you'll see them on the screen... a really fun mini game that makes you feel like
  you're scavenging on the rhythm... awesome and unique, never been done before, but super fun'.
- 11/8 (rule 438): 'I pressed search the lot... and nothing happens' (so: the button answers every time; kept).

## 2. THE RESEARCH: HOW GOOD PHONE RHYTHM GAMES TEACH AND JUDGE A TAP (findings, not references; no game becomes a reference; nothing is copied)
Read from the games' own published rules and code where a page could be opened ([O]); a search extract only is marked [S].
| what was asked | what the good ones do | what we built from it |
|---|---|---|
| How wide is a hit? | StepMania's default: 22.5 / 45 / 90 ms, outermost 180 [O]. osu! at mid difficulty: 50 / 100 / 150 [O]. Open recreations of phone games: 41.7 / 83 / 125 and 50 / 100 / 200 [O]. A browser game's beginner charts widen to 24 / 100 / 180 [O]. | THE OLD DIAL'S OWN BANDS, with a beat riding its track for two beats, are 48 / 115 / 248 ms: already where these games sit. So the dial is the judge, unchanged. NORMAL (his default) widens them a quarter: 60 / 143 / 310. |
| Which beat is a tap for? | One family takes the earliest waiting note, another the nearest [O]. | Neither alone works with our wide bands: MEASURED on our page, nearest-wins handed a thumb 150 ms late to the wrong beat on rows with an 'and'. Ours: the beat he is LATE for, unless his touch is inside the next one's dead centre. |
| Mashing? | One game scores a far-early tap as a miss; another lets stray taps go free [O]. | A stray costs a third of a note; free while the beats are still on their way (tapping along to the count is how people learn). One stray never costs a clean phrase. |
| Holds? | The let-go is judged wider than the press, often later-leaning [O]. | A let-go is judged 1.3 times wider. Let go too soon: the hose coughs. Hold past it: a mouthful. |
| Phone lag | Touch to event 10 to 30 ms [O]. Audio out on Android 12 to 150 ms [O]. Bluetooth 170 to 300 ms and headsets under-report it [O][S]. The browser can tell the page its output delay (Chrome 102, Firefox 70, Safari 18.4) [O]. | The picture is the judge. Sounds are BOOKED AHEAD on the audio clock, earlier by the delay the phone reports, so they are heard on the picture. What the phone does not report, THE ALLOWANCE takes out. |
| Calibration | A manual slider; a tap test; or learn it from the player's own median error and shrink the correction for an erratic player [O]. | No menu, no test: the judge follows the middle of his last eight taps from the third on, in full when they agree (within 25 ms), not at all when they are wild (past 100), inside -70 to +190 ms. Kept for the next visit. |
| Judge on what clock? | Judging on the frame's clock adds delay and trains early taps; the event's own time stamp is when the glass felt it [O]. | Every tap is judged on the touch event's own time stamp. PROVEN: touches stamped at the beat read 0 ms off even on a CPU slowed six times. |
| A sound at the tap | Helps him hear early or late [O], but on Bluetooth it arrives late and drags him; the fix elsewhere is to turn it off or pre-schedule it [O][S]. | His tap sounds at once. When the phone says the ear is far (over 120 ms), the booked ghost of the phrase carries it and his own tap goes soft. |
| Teaching without words | A lead-in of 1.8 s before the first note; a comfortable approach time of 1.2 s or more for beginners [O]. Listen, then answer, as a teaching form [S]. An always-on beat picture and single-button play [S]. Phones mute web sound with the silent switch [S]. | Every beat is seen for 1.5 s before it lands (2 s on the detector). The first beat of a visit is judged half again wider. The detector IS listen-then-answer. Two-word cues. The beat is on the glass all the time. One thumb, anywhere. |
| Feel | A small pop on every hit; bursts at combo milestones; the break only stings when the combo was worth something [O]. | The crew lifts on every hit; the count pops at 4, 8, 16, 24; at those steps the crew steps deeper and the sound gains the tin, then the can, then its fifth. A broken combo just goes quiet. It never changes a find. |
| THE FINDINGS THAT PROVED US WRONG | (ours, measured) | (1) The town's screen kept drawing every frame UNDER the game's cover: on the demo it was the biggest thing on the page's thread (its fill 16% of all time) while the game's own work was under 1%; 781 of 918 frames ran over 20 ms. The town rests under the game now: 71 of 1,904. (2) Drawing twelve men from twelve 3600 x 1288 sheets every frame made the page re-open them: 1.4 ms of every frame. Each man's poses are cut out once, at load and at the tap, never inside a phrase. (3) The first build's nearest-wins matching (above). (4) A wild thumb (170 ms each side) was read as a lag by a plain median; the allowance now trusts his taps only as far as they agree. (5) NOT OURS, AND OLD: one tap on the lot could start the game by itself (above). gates/search_the_lot_answers_gate.js was red for it on main 04ead582 with none of this in (the alpha on its side 7/3, every run); with the guard 16/0 on the alpha on its side and on the demo upright. It was every sheet's hazard, a stall's first row too. |

Sources opened: StepMania Player.cpp and metrics.ini; osu! wiki (overall difficulty, notelock, judgement, approach rate, lead-in,
hitsound, offset, combo milestone); the Sonolus engines' windows.ts and offsets page; Bemuse scoring doc; Google WALT tap and
audio latency; Google Oboe Bluetooth note; Web Audio spec and MDN browser-compat data; W3C event-timing; Godot's sync-with-audio
page; padenot's web-audio-perf. [bb: Battle Brothers has no scavenge game; loot is a hidden roll after a fight or in an event.
Ours is his thumb on the beat on the battle map's own ground.]

## 3. WHAT IS BUILT
| file | what |
|---|---|
| slices/bohemia_scavenge_game.js | THE RULES. Part 1 (the spots) untouched. Part 2 new: one table of every number he feels (RIDE_BEATS, WINDOW, the slacks, POINTS, STRAY_COST, SHARE, LAG, COMBO_STEPS), PHRASES as rows a person can read ('x.x.xxx.'), phrase(), beadAt(), judge() (the dial's zoneOf on the bead's angle), match(), score(), lagOf(). |
| slices/BOHEMIA_SCAVENGE.html | THE PAGE. The skeleton kept (the fight's own dealer and bake, the plate, LEAVE, the hand-back). New: the song's clock and notes, the beats on the dial, the crew, the strip under the board, the struck sounds, the buzz. |
| gates/scavenge_is_the_rhythm_gate.js | THE GATE, in the suite as SCAVENGE IS THE RHYTHM. |
| graveyard/scavenge_on_the_dial_11_10_26/, graveyard/POSTMORTEM_SCAVENGE_ON_THE_DIAL_11_10_26.txt | the old gate and why the old play died. |
| slices/BOHEMIA_ALPHA_0_9.html, slices/BOHEMIA_DEMO.html | #buildstamp BUILD 11/10r - SCAVENGE IS THE RHYTHM; the demo re-cut. |
| slices/BOHEMIA_SETTLEMENT_SCREEN.html | TWO MARKED LINES, both found proving the game on the real page. __THE_TOWN_RESTS_UNDER_THE_GAME__: under the game's cover the town draws nothing. __ONE_TAP_ONE_ANSWER__: a tap on the town's picture is answered on the finger's lift, and a phone then sent that same touch's click to the sheet that had just opened, so ONE tap on the lot could open its sheet AND press 'Search the lot' under the thumb (the game up, four hours spent, nothing chosen); that click is swallowed now. Nothing else of the town is changed. |
NOT TOUCHED: the town's hand-off (start({ask, left, seed, night}) in, finds back through scavDone), the fight's file,
engine/bohemia_dial.js (still the old fight's engine byte for byte), WORLD's count.

## 4. HOW IT PLAYS
- THE CLOCK IS THE SONG'S. The page reads the shell's ONE BEAT (window.BOHEMIA_BEAT, rule 158: the beat as HEARD) and the song
  that is playing (MUS.fac(): its root and scale). Every phrase's notes are that song's own scale from its own root; alone on the
  bench it is SLOW CREEP's (root A, [0,1,5,6,10]). A phrase starts on the song's ONE or THREE.
- BEATS COME TO THE MAN. Tap a lit spot; the nearest man walks there (two tiles a beat). The old dial opens over him. Each beat
  is born at the thing (a ring opens on the door, the dirt, the tank), comes to the end of the dial's track, and rides the track
  to the middle in two beats. The needle sits on the next beat (a house: his torch). The dial's three bands are drawn as wide as
  the judge is, so the picture is the rule. A notch stays where each tap landed: before the middle is early, after is late.
- THE THREE WAYS.
  | | SEARCH A HOUSE | THE DETECTOR | THE SIPHON |
  |---|---|---|---|
  | the thumb | tap each beat | tap the bar back | hold, let go |
  | the phrase (NORMAL) | one bar, 4 or 5 taps ('x.x.xxx.') | it beeps a bar (4 beeps), you answer the same bar | two gulps in two bars |
  | what is seen | beads on the track | each beep a bead born at the dirt; a row of eight lamps writes the bar down | a slug: press at its head, let go at its tail |
  | what is heard | a far ghost of the knocks; your knuckles on a hollow door on each hit | the detector's own tone for the call; your taps are its beeps | a bubble up the hose every held beat, the can ringing |
  HARD and up: two-bar house rows, busier detector bars, three to five gulps. The package is the game's difficulty; the town opens NORMAL.
- THE FIND IS AS GOOD AS HIS TIMING. Each note: DEAD ON 3, GOOD 2, EARLY or LATE 1, MISS 0; a stray tap costs 1. 80% of the
  phrase's points is DEAD CENTRE (the best thing there), 55% GOOD, 25% SCRAPS, less NOTHING. The finds table is the skeleton's.
- THE WHOLE CREW MOVES TO THE BEAT. Every man on the glass drops his weight on the beat and steps in place, left then right,
  from the first frame to the last; a hit lifts them all; a clean phrase lifts them higher. Their size never changes.
- THE COMBO ACROSS SPOTS. Every note that is not a miss adds one, through the walk to the next spot. At 4, 8, 16 and 24 the count
  pops, the crew steps deeper and the boots gain a tin on the 'and', then the can on the ONE, then its fifth. While a combo of 4
  or more is alive the boots keep time between spots. It pays nothing: rule 331's 'no chain' holds for the loot.
- THE BEAT IS SEEN AS WELL AS HEARD. The beads, the needle, the pulse of the dial's middle, four lamps, the lit spots beating,
  the crew's step, and (a phone held up) a strip under the board: four big lamps and the phrase written as a row of lamps with
  the beat walking along it. With no audio at all the block plays the same (gate P4).
- LAG. Sounds on the grid are booked on the audio clock for the moment they are HEARD (the context's own output stamp), so a
  phone speaker's 10 to 40 ms and a Bluetooth ear the browser knows about are already inside. The allowance (section 2) takes
  the rest. The judge is his touch's own time stamp.
- THE SOUNDS ARE STRUCK THINGS (NO SAND; never a voice): a hollow-core door (a thin panel's close low modes), a boot heel on
  dirt (one low mode that drops), a steel jerrycan (a free bar's partials 1 : 2.756 : 5.404 : 8.933), a bubble up a hose
  (Minnaert), the detector's own oscillator. All sines and one square; no noise buffer anywhere (gate K7). A slow seven-cent
  tape drift on every pitch. They play on the shell's effects bus, so his EFFECTS slider holds.
- THE BUZZ (rule 309): a tap on a spot, a hit, a dead-on hit, a miss, a find, through the game's one haptic call.
- QUICK. NORMAL: a spot is 5 to 7.5 s from the tap on it; six spots about 40 s. The result never blocks: the next spot can be
  tapped the moment the last beat is judged.
- NOT BUILT (rule 331, unchanged): no noise meter, nobody comes, no hours per search, no greed, no loot by district, no combo that pays.

## 5. PROOF (rule 13: the pre-push pass, by name; rule 441: the real page, a phone both ways)
- SCAVENGE IS THE RHYTHM, the bench legs 38/0 (fifteen planted fails caught), run four times as the page changed; the real pages
  below. P1 a whole block with real touch events stamped by the glass, on the beat: 26 notes, all DEAD ON, worst 0 ms off, six
  finds all the best thing, combo 26. P2 a thumb 170 ms each side: scraps; no thumb: nothing; twelve taps a second: nothing, 11
  strays. P3 a thumb 150 ms late: GOOD, LATE, LATE, then DEAD ON for good; the page read his lag as 150. P4 pixels off the glass:
  the bead on the middle at the beat and at the track's end two beats before, three spots; the crew's picture changes inside a
  beat; with the audio deleted the block plays the same. P5 69 booked sounds, the worst 0.2 ms off its beat as heard, none late.
  B5 nothing scrolls and the dial is on the glass for every spot, upright, on its side, a laptop; played on its side all DEAD ON.
- THE REAL PAGES (gate B6; the lines are in the commit and the handoff): the demo and the alpha, a phone upright and on its side: a
  town's lot, 'Search the lot', the game on that town's own block; the page's clock 0.0 to 0.1 ms from the shell's ONE BEAT and on
  the same beat of the bar; its notes the playing song's own root and scale; a spot played on the beat all DEAD ON and DEAD
  CENTRE; the town rested under the game and drew again after it; LEAVE; the find paid and said by YOU.
  A whole block in the demo by hand (my own script, a phone upright): 24 notes all DEAD ON, six finds the best thing, combo 24,
  the lot emptied, YOU: 'A battery out of a dead flashlight... And 5 more things in the bag. Nothing left on this lot.'
- SIXTY FRAMES, HONESTLY.
  | where | the page's own work a frame | frames over 20 ms |
  |---|---|---|
  | the bench, a phone, 1x | 0.4 ms (it was 4.07 before each man's poses were cut out once and the board got its own sheet of glass) | 0 to 4 of about 1,700 |
  | the bench, a CPU slowed 4x, painting off the page's thread (as a phone's GPU paints) | 2.0 ms of the 16.7 | 12 of 1,693; at 6x on a 3x screen 15 of 1,508 |
  | the bench, 4x, this box's software painting on the page's thread | 2.2 ms | 467 of 633 (the box's paint, not the page) |
  | THE REAL DEMO, a phone at 3x, 1x CPU, the whole game around it | 0.45 ms | 71 of 1,904 (3.7%); BEFORE the town rested under the game: 781 of 918 (85%) |
  No frame of the page's own work over 25 ms inside a phrase (gate F1; every pose is cut out at the tap).
  NOT PROVEN HERE: a real cheap phone in a hand (this box has no phone GPU; with its software stand-in for one the demo stalls
  for seconds at a time, which says nothing either way). EYES walks it (rule 441(b)).
- Pictures: records/target/SCAVENGE_TWO_THE_BLOCK_PLAYS_THE_SONG_11_10.webp (a house on the beat, the detector answered, a gulp
  held, the game inside the demo on a town's own block, the detector's call with the phone on its side). VOTE card
  scavenge-two-the-block-plays-the-song-11-10 (a page: he plays it in the tab).

## 6. ROUTED (notes, not jobs I took)
- EYES (rule 441(b)): a real phone in a hand, sound on, sound off, a Bluetooth ear: does the allowance settle inside one spot?
- TUNING: every felt number is one table at the top of part 2 of slices/bohemia_scavenge_game.js (WINDOW, the slacks, SHARE, LAG).
- WORDS: the cue and result words are draft:true (TAP THE BEAT, LISTEN, TAP IT BACK, HOLD, LET GO, DEAD ON, GOOD, EARLY, LATE,
  MISS, TOO SOON, A MOUTHFUL, TAP A LIT SPOT).
- PLUMBER: the town now rests under the scavenge game (one marked line in its loop); the same waste is likely under every other cover that sits on the town (the camp, a fight's first frames): worth one sweep.
- RUN TWO / TOWN FIX / FIXES: two marked lines are in the town's file. __THE_TOWN_RESTS_UNDER_THE_GAME__ in loop() reads only the game's own frame, cover and S.scavOpen. __ONE_TAP_ONE_ANSWER__ beside the picture's pointer handlers swallows the one click a tap on the picture still owes (same spot within 14 px, inside 700 ms, never a click on the picture itself); window.__ONE_TAP_SWALLOWED counts them. If a town gate ever wants that click, it is there to re-aim.
- COMBAT TWO (unchanged from SCAVENGE): a board laid from the map carries dead cars only where the plan flags them.
- THE COORDINATOR: the town opens the game at NORMAL; the game's difficulty setting is not handed to it yet (one field, pkg).

[bb Battle Brothers settles a search by a hidden roll inside an event; here the roll is a phrase of the song under his thumb.]
[analog horror: the phrase is the playing song's own dark scale; every sound is a struck dead thing on a worn tape's drift; the detector is a bare tone answering itself in an empty yard.]
