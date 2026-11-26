# CAMP FOUR: THE CAMP READS AT A GLANCE, AND TIME YOU CAN SEE (11/26/26)

VAMILY rules 482 and 480(b)(c) on rule 472(b), ask row 728. The coordinator's routine 'CAMP FOUR: rule 482 next' (11/26): "camp as it is,
better: the crew idling and healing reads at a glance, the time passing feels like time, zooming in on a man in camp looks good (rule
472), and row 728 (camp the slowest screen on a slowed phone) until it holds its frames. Ship a build he can see." BUILD 11/26zo - THE
CAMP READS AT A GLANCE. BUILT, NOT YET SEEN (rule 179). Improve, not add (480(b), 482(d)): every piece below dresses what the camp
already does (its mending, its clock, its pinch); no new screen, button or rule.

## His words

> "More cooking up cleaning up improving things we're already doing type shit" (11/26, rule 482)
>
> "I want time to go by until everyone's healed... What if I want to zoom in on my character, see them chilling?" (11/22, rule 472)

## What it looked like (main 0ebbe568c, the demo, a camp made with HEAL with his men hurt)

- Nothing said who was hurt or how much: a man's act (lying bandaged, binding a cut, hammering his armour) was the only sign.
- Time: a clock on the phone, and the ground the day's picture or the night's, swapped in one frame at six.
- The pinch at the camp's middle ended on bare ground by the fire, his men above the glass; at the closest stop each pixel of the
  ground's art was a 22 px square on the phone (a mosaic).
- FOUND ON THE WAY: the camp's look laid the other light's picture into the screen's slots through window.PIC, and the camp screen's
  code lives in its own scope (typeof PIC in the camp's page: 'undefined'), so that swap (MOTION 3's '+', 11/10) never ran: a camp that
  stood on its first light (after a fight: the light it was fought in; HEAL: the light it was made in) kept it through the night or day.

## What changed (each with its switch back to the way it was)

1. THEIR BARS AT A GLANCE (slices/bohemia_camp_look.js; `window.__CAMP_NO_BARS`). Over each of his men, YOU too (walking or lying),
   the fight's own two bars (its gold rim, armour grey over blood green, BOHEMIA_FIGHT.html's sizes): a man in camp reads as he does in
   a fight. Each hour's mending eases in and the part it gave back shines for a beat. Two men side by side: one's bars stand above the
   other's. The hour everyone is whole they read full, stand three seconds and fade; then the camp is only his men idling. Never over
   the staff (the retinue's own rule).
2. THE TAPE RUNS (bohemia_camp_look.js; `window.__CAMP_NO_TAPE`). While the hours run the camp's glass carries the tape's fast-forward
   in its corner: the two arrows on the beat, the clock, '+N HOURS' since he sat down (words draft:true). The hour they are whole it
   reads a stop square, 'STOP' and the clock, 'EVERYONE WHOLE', three seconds, and goes. Drawn once an hour into a small picture.
3. THE HOURS ON THE GROUND (bohemia_camp_look.js; `window.__CAMP_FLAT_SHADOWS`). Each man's shadow follows the hour: by day it swings
   from the low morning sun to the evening one, long at either end and short at noon; by night it falls away from the fire. The hour
   drawn eases toward the camp's, so the shadows sweep.
4. THE DUSK COMES OVER (slices/BOHEMIA_SETTLEMENT_SCREEN.html campNightMix; `window.__CAMP_HARD_NIGHT`). From five to seven in the
   evening the night's picture comes over the day's (and goes, five to seven in the morning), blended once a twentieth into one picture
   and drawn as one (the blend held for a camp stopped mid-dusk, let go out of it).
5. THE NIGHT LAID IN (the camp screen hands its slots as window.__SETTLE_PIC; the look reads them). The '+' swap runs.
6. THE PINCH FINDS A MAN (the camp screen's pinchStart and pinchMove; `window.__CAMP_PINCH_PLAIN`). In a camp the point the pinch holds
   slides, as it closes in, to the nearest of his men within 140 px of the fingers (his chest): a pinch near a man ends on him.
7. THE DIGITAL ZOOM (the camp screen's draw; `window.__CAMP_ZOOM_BLOCKY`). Past twice its own pixels a camp's ground is drawn softened,
   as a camcorder's digital zoom is; his men, tents and fire stay sharp over it.
8. ROW 728 (the frame walk's 'map > camp' is HEAL at a town's edge, a town's rest): its long exposure copied the whole glass at full
   size twice a frame (487 ms of a 3.7 s profile on a slowed phone); held at half size now and laid over softened
   (`window.__TRAIL_FULL`).

## Row 728, measured (the frame walk, PLUMBER 8's tool, the demo, CPU 4x, this box's software GPU)

On main 0ebbe568c the walk read 'map > camp' 5 frames a second, 25 frames over 50 ms of which 1 was the page's code (the gate's line,
written before last round's ship: 22), the rest the drawing; 'camp > map' 33.4 a second, 0 of the page's. On this build the gate's
walk read 'map > camp' 9.7 a second, worst 150 ms, 1 frame of the page's; 'camp > map' 0 of the page's (its line: 22 and 19). The
camp's own frame loop is
where the time goes (the settlement's loop, drawPeople, and the town rest's exposure, now halved). Camp standing whole at 4x, this
round's look on and off (bars, tape, shadows, dusk, soft zoom): 4.4 and 5.1 frames a second (this box's spread), the same long tasks
(24 and 29 in 6 s); mending through dusk 3.3 and 5.3 (the dusk's blend baked: it was 2.3). A phone's GPU draws what this box's does
not; the page's own code is what travels, and it did not grow. Named for UI FIVE: the way back to the map from a camp spends its time in
bohemia_ui_nothing_pops.js check (checkVisibility over the page, 246 ms of 4.2 s at 4x).

## Gates

THE CAMP READS AT A GLANCE (new, gates/the_camp_reads_at_a_glance_gate.js, in the suite): G1 to G7 and P1, the demo upright and on its
side: 15/0.

The camp's own, one at a time on this build: THE CAMP WAITS FOR HIM 18/0; HIT THE ROAD, EVERY TIME (upright) 7/0; PINCH OUT TO THE
MAP 8/0; A TOWN IS SAFE 12/0; MAKE CAMP FROM THE FIGHT 11/0; CAMP HOLDS UNTIL HE ENDS IT 14/0. THE HEAL BUTTON 15/1 (H5's tape
count, the leg that flickered in last round's runs too: 10 rolls spent against 9.87 wanted and 0.14 of debt paid, 0.01 off). THE CAMP
LOADS IN ONE GO 5/1 (L1: HEAL's picture 9.1 s against its 9 s line); run again alone, one after the other: this build 6/0 (8.6 s, the
longest task 669 ms, 1.78 s held), main 0ebbe568c 6/0 (8.0 s, 715 ms, 1.93 s held): the box's spread. THE HEAL BUTTON again: 16/0. NEVER CHOPPY: THE FRAME WALK 5/1: R1, R2 (443 of 538
page frames), R3, P1, P2 green; W1 red on 'camp > map (not pressed)' and the reload's 300 s timeout (the gate's own note: the walks
time out opening the page again). The walk alone once more on this build (the freeze census, 4x): 'map > camp' 7.4 fps, worst 333 ms;
'camp > map' 42.5 fps, worst 550 ms, both pressed; that walk's unpressed steps were the lot's minigame instead: which step the walk
misses moves from walk to walk on this box.

[bb Battle Brothers: the company's bars are the first thing you read on any screen with men on it; ours carries the fight's own bars to
the fire, and lets them go once there is nothing left to mend.]
[analog horror: the tape fast-forwards through the hours, the shadows wheel round the men, and it stops on its own when they are whole.]
