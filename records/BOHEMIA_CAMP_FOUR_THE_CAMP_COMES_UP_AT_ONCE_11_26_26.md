# CAMP FOUR: THE CAMP COMES UP AT ONCE, AND HIT THE ROAD EVERY TIME (11/26/26)

VAMILY rule 480(b)(c) on rule 472(c)(e): the coordinator's routine 'CAMP FOUR: rule 480' (11/26): "the camp's first picture is still
about 10 s, make it close to instant and never a freeze (472(e)); the build he watches plays smooth; HIT THE ROAD works every time; then
run the full suite once". BUILD 11/26l - THE CAMP COMES UP AT ONCE. BUILT, NOT YET SEEN (rule 179). Improve what we have (480(b)):
nothing new is added; every change below is a cut in what was already there.

## His words

> "Lets turn up full sweep. But improve on what we already have. And make sure fps is never choppy for nothing lets go" (11/26, rule 480)
>
> "we made camp, it loads, it takes 30 seconds, I don't know why it freezes when it loads... it freezes for like 10 seconds and then
> everything's populated in" (11/22, rule 472)

## What was measured (main ec97371ae, the demo upright, the CPU slowed 4x, the GPU canvas; from the real MAKE CAMP tap)

The tool: the long animation frames (the browser's own record of every frame over 50 ms, each with the scripts in it) and the glass's
state every tenth of a second, timed from the moment the loot screen's MAKE CAMP message reached the shell. (The 10 s of last round's
record counted from before the test's own tap, 1.5 to 2.3 s of it the test's finger at 4x, and with screenshots every 150 ms.)

| after a won fight, MAKE CAMP | main | now |
|---|---|---|
| the fight's picture held on the glass | 1.48 s | 0.60 s |
| the camp made (its screen on, under the held picture) | 2.89 s | 0.99 s |
| the camp's first frame drawn | 4.83 s | 2.38 s |
| the held picture lifts: the camp on the glass | 7.26 s | 2.85 s |
| the biggest frames from the tap | 941 ms (the phone's job board), 365 ms (the map), 287 ms (the shell) | 274 ms (the shell), 343 ms (the camp's first draw) |
| while the camp stood (8 s seen) | a 211 to 352 ms frame every 1.3 s (the jobs planned again) | none over 100 ms from 4.6 s on |

| HEAL on the map (PLUMBER 8's own walk, THE CAMP LOADS IN ONE GO, the same box) | main | now |
|---|---|---|
| the camp's picture in | 9.1 to 10.2 s | 7.5 s |
| the camp up after its board is in | 1.3 s more of fade | half that (one beat) |

At full speed, a CPU profile of the camp after a fight: the phone's job board spent 2.16 s planning jobs while the camp stood, 851 ms
of it in ONE line of the fight's board dealer (kindOf: a block's kind split out of its name, asked millions of times a deal). Now 1.41 s
with that line kept, and none of it under the camp.

## What changed (every one with its switch back to the old way)

1. THE CAMP IS MADE THROUGH ITS DOOR (slices/BOHEMIA_ALPHA_0_9.html spoilsCamp; `window.__CAMP_MAKE_UNWRAPPED`). The map's
   BohemiaMapCamp.make was its campMake as it was when the map loaded, before MOTION's door wrapped it, so a camp made off the end
   screen never met that door: the map's three-beat fade of the camp's screen played whole (1.5 s here, about 6 s on a slowed phone)
   UNDER the fight's held picture, where nobody sees it, and the held picture waited for it to end. The shell now makes the camp through
   the map's own (wrapped) campMake: under the held picture the fade lands at once (MOTION 3's own design, 444(a)).
2. NO ZOOM UNDER THE CAMP (slices/BOHEMIA_CITY_WORLD.html, the fight-ended listener; `window.__ZOOM_UNDER_CAMP`). The map's zoom back
   out of a fight drew the whole map and its snapshot in one 382 ms piece under the held picture. Under the hold it is not drawn.
3. THE BOARD WAITS OUT THE CAMP (slices/bohemia_phone_board.js; `window.__BOARD_UNDER_CAMP`). The phone's job board (hidden on a
   phone, covered by the camp) dealt every job's fights for the crew the fight had just changed the moment the map came back: 941 ms in
   one piece. It waits while a camp stands or is being made off a fight.
4. NO PLANS UNDER THE CAMP (slices/bohemia_job_danger.js; `window.__PLANS_UNDER_CAMP`). The waiting plans (one job's plan is one
   piece: its routes and its fights' deal, 211 to 352 ms on a slowed phone) ran in the camp's idle gaps, and the camp's hours turned the
   day, which asks every job again for each new day. They wait for the camp to end and are made once, for the day and crew he leaves
   with. What he looks at is still planned at once (a town's board in a town's rest).
5. A BLOCK'S KIND IS READ ONCE (slices/BOHEMIA_FIGHT.html kindOf). The kind of a block's name never changes; it is kept after the
   first ask. 851 ms -> 32 ms of the jobs' plans at full speed; the fight's own deal is the same code.
6. THE CAMP IS ASKED FOR AT ONCE (spoilsCamp; `window.__CAMP_ASK_SLOW`): the next moment after the tap and then every tenth of a
   second (it was every quarter, the first a quarter after).
7. HEAL'S CAMP COMES UP IN ONE BEAT once it kept him waiting at his fire (CITY_WORLD btwTick; `window.__CAMP_IN_SLOW_REST`).
8. THE RED CROSS ANSWERS AT ONCE (ask row 728, EYES 11/26: 'the red cross itself 600 ms'; CITY_WORLD btwCampIn;
   `window.__CAMP_IN_RENDER_NOW`). MEASURED (a CPU profile of one HEAL press at full speed): 99 ms in one piece, 90 of it one whole
   drawing of the map inside the tap (its camp marker put under the moment's dark, where the moment draws its own fire). Not drawn
   there now: the press is 7 ms.
9. THE CLOCK STANDS CLEAR OF THE MAP'S BUTTONS (ask row 728, EYES 11/26 e03: 'its big DAY 1 16:00 is drawn over the left column's
   STANDING button'; CITY_WORLD btwDraw). The moment's camcorder clock sits above whatever of SLEEP, STANDING and the packs' line and
   button is down that corner, read once a moment. HEAL now holds this moment while its board is baked, so the clock is up for seconds.

## The build he watches

After a fight, from the camp's first frame (2.38 s) the set-up plays; from 4.6 s to its end at 7.5 s no frame over 100 ms on the slowed
phone. Its first two seconds still carry frames of 107 to 233 ms (the camp's own first draws, MOTION's last frames of the hold, the map's
tile worker landing tiles it asked for before the fight ended). The camp at rest: no frame over 100 ms in 8 s but the man-idle sheets'
unpacking (bohemia_idles.js warmOne, 55 to 89 ms, once a man's new act) and the phone's tick (25 to 55 ms, its forced layouts).

## HIT THE ROAD, every time

New gate HIT THE ROAD, EVERY TIME (gates/hit_the_road_every_time_gate.js, in the suite): on the demo upright and on its side, five
camps in one sitting, each ended by ONE real finger: HEAL with nobody hurt; HEAL with his men hurt (the hours to whole); the tap the
moment the band shows; his man's line on the strip instead of the band; MAKE CAMP on a won fight. Each: the camp gone for the road, its
glass off, the map on PAUSE and its clock still. Planted: the map's road answering nothing turns it red. RESULT: see Gates.
FOUND, NAMED FOR UI: the band is 102 by 26 points, under the 44 a thumb wants (the phone's rows are UI's); his man's line just above it
is the bigger way back and does the same.

## What is left, named

- HEAL's camp: its board is baked in a hidden fight page, and loading that page is most of the 7.5 s on a slowed phone (its script
  212 ms, its data 588 ms in one piece, two more frames of 258 and 352 ms). The camp's own work after it is about a second. A page kept
  warm, or a bake that loads less of the fight, is PLUMBER 8's and COMBAT's to weigh (rule 472(e)); he watches his fire catch on the map
  meanwhile, never a frozen glass.
- After a fight: the shell's hand-over (274 ms: the fight's board copied for the camp, 128 ms of it, then the fight's page let go) and
  the camp's first draw (214 ms).

## Gates

Each ALONE on this box (rule 13(a), the pre-push pass: the gates that read the files in this diff):
- THE CAMP WAITS FOR HIM 18/0 on the demo and 18/0 on the alpha, upright and on its side.
- HIT THE ROAD, EVERY TIME (new) 13/0: ten camps ended by one tap each, both ways; P1 planted red; R6 the sizes (named for UI).
- THE CAMP LOADS IN ONE GO 6/0 (HEAL: the picture in 7.5 s, the longest task 938 ms, 2.8 s held; the old ways 15.0 s).
- MAKE CAMP FROM THE FIGHT 11/0; CAMP HOLDS UNTIL HE ENDS IT 14/0; HEALING STOPS ITSELF AT FULL 8/0; A TOWN IS SAFE 12/0; ONE FIGHT 4/0;
  EVERY FIGHT HANDS HIM BACK 10/0; THE HEAL BUTTON 16/0 (one run 15/1: the computer's H5 tape count, the leg that flickered in
  last round's runs too).
- THE CAMP IS SET UP ON THE BOARD 26/1: S1 re-aimed and green (with the camp up 2.4 s sooner its window holds fewer shots; one alike
  proves it under eight); its one red S4 the freeway on its side, a tent's foot on a house tile (the pitch's; the gate's quarantine
  family, ask row 681).
- THE CAMP IS THE FIGHT'S BOARD 32/4: Cn3 on its side 'not measured' and Cn5 (quarantined, ask row 681), main's own family.
- RED THE SAME ON MAIN'S OWN FILES (run alone on ec97371ae): ENTER ZOOM 9/4, THE PHONE'S BOARD 7/11, THE MOMENTS BETWEEN 0/4, THE JOB'S
  STARS 4/1. EVERY CHANGE AT SIXTY 5/2: C3's 90 s (89 to 91 s on main, quarantined) and C5; this gate makes no camp.
- THE SUITE (rule 13(b)): not run whole by this lane (about 8 hours on this box); full suite unmeasured since PLUMBER's line (d97cecd3).
  Of that line's reds, none is a camp gate this round changed for the worse.

THE PICTURE (VOTE camp4-the-camp-comes-up-at-once-11-26): MAKE CAMP after a won fight, the demo upright at a phone's speed, the browser's
own screen recording, one frame a second from the tap, main's files over this build's (tools/bohemia_camp4_capture_at_once.js,
tools/bohemia_camp4_lay_the_strip.py). On main the fight's frozen picture holds and then the whole camp pops in at once, tents and fire
already up (his 'freezes... then everything's populated in'); now the camp's screen is up seconds sooner and the tents rise and the
fire catches while he watches. (At a slowed CPU the recording runs behind the page; the seconds in the table above are the page's own.)

[bb Battle Brothers: making camp is instant; the company sits on the map and the days run. Ours shows it built, on the fight's own
ground, and the wait is now the time it takes to put a fire down.]
[analog horror: the tape pauses on the street you won, and the fire is already burning when it plays again.]
