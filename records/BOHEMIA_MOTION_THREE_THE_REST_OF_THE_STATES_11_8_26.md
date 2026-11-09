# MOTION 3 -- THE REST OF THE STATES (11/8-11/9/26)

Rule 436(a) (Paolo 11/8, 'Do more'), asks 151, 257, 278. His words (ask 151, rule 229): 'the UI morphs: every big change (map, town,
fight, camp, shop, jobs, the crew) transforms the shared pieces into each other with smart, quick, on-the-beat animation; never static,
never a cut'; (257) 'nothing just disappears'; (278) 'nothing just appears or vanishes'.

## 1. MEASURED FIRST: every change of state on the demo

Tool: `tools/bohemia_motion_three_every_change.js` (new). It opens the demo on his phone (390 x 844 at 3, touch), presses every change
the way he presses it (a finger at the real spot: the phone's HEAL, CREW, SETTINGS and LEAVE apps, the town's buildings, a shelf's
slot, a job's line, the sheet's x; the map's own door only where a finger cannot reach one: a town on the map, a road fight), and for
each change keeps two records:

- the browser's screen recorder (every frame the compositor sent, JPEG): the biggest share of the glass that changed between two
  frames in a row, against all the change the eye saw (`inOne`);
- EVERY FRAME THE PAGE DREW (requestAnimationFrame in the top page): for each piece (the sheet, the weapon card, the man strip, the
  settings, the loot screen's door, the crew door, the layer's stand-ins) its share of the glass, its box times its opacity through
  every frame it sits in.

THE RECORDER IS BLIND ON THIS BOX TO WHAT THE COMPOSITOR DRAWS ALONE (a software-drawn box): a quarter-second CSS slide and a Web
Animation both showed as one or two frames in it. So the recorder is the witness, and the drawn frames are the verdict. One honest
correction this caused: my first list called the shop sheet's open a cut (60% of the glass in one recorded frame); the drawn frames
show it was a 250 ms slide up from the bottom of the glass (CSS `ease`), not a cut, but not out of the building either.

### BEFORE (main at e38f3d6c, the demo, phone upright; three runs, the third written here)

| change | what the eye got | the recorder's biggest frame |
|---|---|---|
| the town he wakes in -> the map (LEAVE) | MOTION 1's shrink | 49%, spread over 7 frames |
| the map -> a town | MOTION 1's grow; its hand-off to the real town a 10% step | 10% |
| the town -> a shop (a building tapped) | a quarter-second slide up from the bottom of the glass, never from the building | 60% (dropped frames) |
| a weapon tapped on the shelf | **CUT**: its card and the man strip pop on in one frame | 31%, all of it in one frame |
| the sheet's x | the sheet slides down; **the town's signs pop back over it in one frame** | 72% |
| the town -> the board | the same slide | 53% |
| a job tapped on the board | **CUT**: the job's card replaces the board in one frame | 36%, all of it in one frame |
| the town -> the scavenge lot | the same slide (a small sheet) | 6% |
| the crew screen opened | MOTION 1's grow, its hand-off **38% of the glass in one frame** (the board plate at a third, then gone) | 38%, 78% of it in one frame |
| HEAL (make camp) | **two grows of the same frame** (the town's and the camp's: one door, two morphs) and the plate waited out its full 2 s (CAMP TWO's 'drawn' answers false now) | 6% |
| the settings opened | a partial fade | 46% |
| the settings closed | **CUT**: gone in one frame | 23%, all of it in one frame |
| the map -> a fight | MOTION 2's dive | 12% |
| the fight's end | **CUT**: a black box over the whole glass while the loot screen's page loads (half a second to a second), then the loot screen drawn into it | 93% |
| the loot screen's LEAVE | it vanishes in one frame, a dark frame, then MOTION 2's climb | 35% |

## 2. WHAT IS NEW (slices/bohemia_motion.js, `__THE_REST_OF_THE_STATES__`; nobody's screen rewritten)

THE REAL THING MOVES. These pieces are pages of DOM (a shop sheet is hundreds of elements); a copy of one would cost a tenth of a second
on this box (PLUMBER 4's measure of the phone's copy), and the real one is already drawn. `realMorph()`:

- keeps the element's own inline styles, lays it at its own place with its transition off;
- plays ONE Web Animation of transform and opacity, each pose a keyframe held `step-end` until the next hold, so the stop-motion grid
  (six holds a beat, the music's own clock, the first eighth past 500 ms for anything over a tenth of the glass, past 250 ms for a card)
  is the animation's own and the compositor plays it (PLUMBER 7's numbers: what the page's thread does in a change is what a cheap
  phone shows). A box laid again while it grows (a shop's sheet laid whole-glass a beat after it opens) re-lays the keyframes on the
  same clock (a ResizeObserver);
- IN, it grows out of what he tapped, with the tin's lean, squash and overshoot and the rivets on landing; OUT, the owner's hide is held
  off (the sheet's slide, the card's and the settings' display none) until its last pose, it goes back into what it came from and fades
  on its last poses, and only then is it gone;
- a piece that covers more than a quarter of the glass travels on an even curve (the emphasized curve put 80% of a whole-glass sheet's
  travel on its first pose: a cut with extra steps, the layer's own __A_STALL_HOLDS__ finding);
- A FINGER HOLDS IT: a tap on a piece coming in pauses its animation until the tap is through (the press and the lift land on the same
  button), then it lands; a piece going out takes no finger (the tap reaches what it uncovers);
- REDUCED MOTION (the gear's MOTION at LESS): a fade in place over two holds;
- `window.__MOTION_THREE_OFF = true` is the old way (the gate's planted fail).

THE DOORS (watched, never rewritten):
- THE TOWN'S SHEET (RUN TWO's settlement screen): a building's sheet grows out of THE BUILDING HE TAPPED (its box in the town's own
  picture, VAR.boxes with view.s/ox/oy, read and never panned; rule 438(a) takes UI 9's floating signs off, so the building is the
  piece, the sign only while it stands, else his finger's spot) and goes back into it. The signs, while they stand, were meant to fade
  up as it goes home; THE PHONE STRIP SHOWS THEY STILL POP BACK OVER THE CLOSING SHEET (the fade does not reach them); rule 438(a) takes
  them off (TOWN FIX), so this is left as it is.
- A sheet his finger froze while it grew (a job tapped before the board's sheet landed) lands the moment the page he turned changes,
  and the job's card grows (the phone strip caught the job's card skipping its morph behind a frozen board; fixed).
- A PAGE HE TURNS IN THE SHEET (the board to a job's card, a job back to the board): when #sbody's pages change within 900 ms of a tap
  inside the sheet, the new page grows out of the line he tapped (a redraw the screen does by itself is never morphed).
- THE WEAPON CARD (UI 8's #bwcard, rule 433: a detail when he taps for it) and THE MAN STRIP (#shopfaces): out of the slot he tapped,
  and the card back into it when a tap puts it away.
- THE SETTINGS (#setwrap): out of the phone's SETTINGS (else the bar's gear) and back into it.
- THE LOOT SCREEN (RUN TWO's __THE_SPOILS__ door): the board stays on the glass under a door you cannot see until the loot screen's
  page is drawn (fonts in, its text in, one frame more; 2.5 s at most), then it comes up out of his phone (the ability tray in a fight);
  LEAVE (the shell's spoilsClose, wrapped) lets the shell drop its handles at once and folds the door back into the phone while the way
  home starts, then removes it.
- HEAL: the phone's HEAL wears data-morph="camp", so the camp grows out of it.

TWO FIXES IN MOTION'S OWN CODE:
- __ONE_MORPH_A_DOOR__: HEAL ran the town's grow and the camp's on the same frame (campMake opens its camp through loopOpenTown). The
  camp's door is the camp's morph alone. Taking the second grow off showed a bug it had been hiding: inside the door WORLD's moment
  between eases the camp screen up from 0, and the camp's grow saved that 0 as the frame's rest and gave it back at its landing, so the
  camp screen stood invisible for the whole camp (measured, then fixed: the rest is read before the door runs).
- The camp's ready: its name plate is its clock and CAMP TWO's drawn() answers false on the demo now, so every camp waited out the 2 s
  behind the plate; it is ready when its clock is on its plate.
- The hand-off of a grown screen (the crew, the town) dissolves in four quarter steps (.75 on the landing hold, .5, .25, gone), never a
  third of the glass in one frame.

## 3. AFTER: THE OLD WAY AND THE NEW, BACK TO BACK ON THE SAME BOX

`tools/bohemia_motion_three_every_change.js --old` (window.__MOTION_THREE_OFF = true armed before the page) and then the new way, the
demo at 390 x 844, full speed, this software-drawn box. 'Drawn frames' = the piece's share of the glass in every frame the page drew:
its biggest step in one frame, and how many frames it spent between where it started and where it ended. The loot screen's LEAVE row
is the gate's run after the calm-frame start (section 2), the rest the back-to-back run.

| change | OLD fps, worst ms | OLD drawn frames | NEW fps, worst ms | NEW morph | NEW drawn frames |
|---|---|---|---|---|---|
| a building -> its sheet (the shop) | 56.5, 33 | sheet: biggest 35% in one frame, 5 between (a fast slide from the bottom) | 54.6, 33 | the sheet out of the building, 705 ms, 9 poses | 2 > 88%, biggest 21%, 26 between |
| a weapon tapped | 56.5, 33 | card: 32% in ONE frame, 0 between; strip 7% in one | 48.3, 100 | card 352 ms, 5 poses; strip 330 ms, 4 poses | card 0 > 31%, biggest 14%, 13 between |
| the sheet's x | 58.8, 33 | sheet 26%, 7 between; card 32% in ONE frame; signs popped | 55.9, 33 | card back 437 ms; the sheet into its building 673 ms, 9 poses | sheet 88 > 0%, biggest 20%, 20 between |
| the board's sheet | 50.8, 33 | 15%, 6 between | 49.9, 33 | 612 ms, 8 poses | 0 > 50%, biggest 13%, 19 between |
| a job tapped on the board | 49.9, 117 | the page swapped in one frame | 55.2, 33 | the job's card out of its line, 515 ms, 7 poses | (the sheet's own height steps 17% when the page is shorter: WEAK) |
| the lot's sheet | 49.2, 33 | 4%, 3 between | 56.4, 33 | 705 ms, 9 poses | 1 > 14%, biggest 8%, 9 between |
| the settings open | 59.4, 33 | 35%, 9 between | 60, 17 | out of the phone's gear, 667 ms, 9 poses | 0 > 100%, biggest 23%, 30 between |
| the settings close | 60, 17 | **100% in ONE frame, 0 between** | 55.6, 133 | into the gear, 558 ms, 7 poses | 100 > 0%, biggest 31%, 19 between |
| the fight's end | 6, 233 | **the black door 86% of the glass at once** | 21, 267 | the board stays until the loot page is drawn (913 to 1,193 ms), then it rises out of the phone, 577 ms, 7 poses | 0 > 100%, biggest 26%, 9 between (gate: 26 between) |
| the loot screen's LEAVE | 8.5, 633 | **100% gone in ONE frame** | 46.5, 683 (the way home's own frame) | folds into the phone from the first calm frame, 541 ms, 7 poses | 100 > 0%, biggest 31%, 12 between |
| HEAL | 25.8, 233 | (one morph already: --old keeps this round's camp fix) | 29.5, 150 | ONE grow, the camp's, no wait (the old main: two grows, the 2 s wait) | |
| the town, the crew, the map's dive | 41 to 59 | MOTION 1 and 2's | 32 to 60 | unchanged | |

FRAMES (rule 436(a): 60 on a cheap phone; PLUMBER 7's 11/7zd numbers the baseline): every change the new morphs play held 46 to 60
frames a second on this box with no frame over 133 ms in the town and the settings (the old way 49 to 60); the fight's end and the way
home ran FASTER the new way (21 and 46 against 6 and 8.5: the black door's page load no longer stands over a board that is still drawing
under it). The crew screen's first open and the dive are not this round's and vary 10 to 55 between runs on this box either way.
THE MORPHS ARE PLAYED BY THE COMPOSITOR: on a phone with a GPU the page's own slow frames (the way home's 433 to 683 ms) no longer
freeze them.

THE FRAME RATE, CHECKED AGAINST MAIN (the coordinator's 60 on a cheap phone): EVERY CHANGE AT SIXTY (PLUMBER 7) flips between runs on
this box: main's own run 6/1 (C1, the crew screen's first open, 267 ms), this tree 6/1 (C5, the first way out of a town, 183 ms) and on
a slower run 5/2 (617 and 333 ms; that run's old way moved too). So a clean A/B of just the town's grow and leave, main's motion file and
this one served alternately into the same demo, two rounds of three each (tools in the scratch, the driver's `serve` map): the way out
of a town 52 to 56 frames a second on both, worst frame 50 to 67 ms on main and 66 to 100 on this tree (one to two frames); the first
town open 12 to 14 fps on main and 11 to 18 on this tree (the town's own first draw, the same on both). No regression of substance; the
legs that flip are PLUMBER's to steady.

## 4. THE GATE

`gates/the_ui_morphs_everywhere_gate.js` (THE UI MORPHS EVERYWHERE, SOLO, in the suite): 19 passed, 0 failed (its first run 16/3 found
the loot screen's LEAVE eaten by the way home's slow frame, the camp resting in a town waiting 2 s, and a 9 px close too small to aim
at mid-grow; all three fixed). E0 to E9 and P1 as its header says; the
verdict is the drawn frames (a piece that moves a tenth of the glass spends 3+ drawn frames between and never steps more than 35% of the
glass in one) plus the layer's own record (the real element, on the beat, in budget). P1: the old way (`__MOTION_THREE_OFF`) turns a
weapon's card and the settings' close RED under the same check.

## 5. WEAK, ROUTED, NEXT

- The recorder on this box cannot see compositor-only frames; a real phone with a GPU will draw the in-between poses the drawn-frame
  sampler counts. The phone frames for the VOTE card (records/target/MOTION_3_NOTHING_JUST_APPEARS.webp) were taken with
  `BohemiaMotion.slowly(8)` (the camera's knob; the game never sets it), so the in-between poses can be seen.
- The fight's own end card (COMBAT's showOver in BOHEMIA_FIGHT.html) comes on over the board in one frame (26% of the glass) before the
  loot screen: COMBAT's file, not touched (rule 436(a) keeps MOTION off the fight's files); routed to COMBAT.
- The phone (UI TWO's #bohphone) steps off the glass when a shop's sheet stands whole-glass and back when it closes: UI TWO's rule; the
  phone itself could fold into its corner the way MOTION 1 folds the old one (next).
- The crew screen's first open is the crew key turning (PLUMBER 7's A_NEW_CREW_IS_PLANNED_OVER_FRAMES): its frame rate on this box
  varies 10 to 55 between runs with or without this round's morphs (section 3); PLUMBER's.
- A job tapped on the board: the job's card grows out of its line, but the sheet's own height steps once (17% of the glass) when the new
  page is shorter than the board; the sheet's height could follow on the same clock (next).
- HEAL next to a town rests in that town (CAMP rule 273(b)): the camp's grow now knows the place that opened is drawn under its own name
  (measured: the plate read 'Cartel' and waited out 2 s).
- THE BOARD NOW OPENS ON ITS FIRST JOB'S CARD (main, 11/9): the page turn measured is a job's line to its card when the board lists
  them, else that card's 'Not now' back to the board; both grow out of what he tapped.
- Next: the meet card's entrance (RUN's), the road's events, the phone's own step off the glass in a shop, the fight's end card.

[bb] Battle Brothers' town opens a building's panel in place and closes it in place; ours comes out of the building you tapped and goes
back into it, and the loot screen rises out of your phone instead of a loading black.
[analog horror] every piece is the real thing on held frames, the tin leaning into its travel, a rivet popping in where it lands; nothing
is a smooth glossy slide, and no black box ever stands where the game should be.
