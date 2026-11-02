# THE FIRST MINUTE: THE LOADING SCREEN, THE START SCREEN, THE HINTS SWITCH (UI round 3, 11/2/26, BUILD 11/3zi)

Asks 280 (the loading screen in the Crashbox look, alive while it loads), 261 (redo the start screen, picking your origin),
262 (the tutorial as ONE toggle at the very start of the demo, small) in records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md.
His words, records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md notes 4, 5 and 8: "the startup screen kind of
sucks of choosing like your own adventure... there's not really a tutorial system" / "The tutorial is to toggle at the very
beginning... don't go gung ho" / "the UI, the transitions of the UI, the loading screen bullshit, the whole enchilada... always
remember this economic apocalypse HBO Crashbox vibe bro please." Rule 301 (the look is the economic apocalypse in the Crashbox
vibe, always); rule 115(d) (CRASHBOX: HBO Family 1999, clay and puppets inside a handmade broken game computer, rusty tin robots).
Built inside his JUST THE FONT system (10/18: his letters alone, the cold ground, gold only for what is yours and the one next
thing, no gradient/glow/blur/round corner, words at 10 or 20 css px, one css pixel a pixel): everything that moves is drawn into
a canvas on the beat, so no element of the door carries a CSS animation.

All measured on the baked demo, his phone upright (390 x 844, 3x) and sideways (844 x 390), real touches.
Proof shots: records/target/ui_the_first_minute/ (1 to 6). VOTE: ui-the-first-minute-loading-11-2,
ui-the-first-minute-start-screen-11-2, ui-the-first-minute-hints-11-2 (slices/vote/UI_THE_FIRST_MINUTE_*_11_2.webp).

## BEFORE (BUILD 11/3k, measured)
- The title (NEW GAME / CONTINUE / SETTINGS) is what a stranger sees while the valley loads (6 to 15 s on this box): his letters,
  the three choices, the valley ground. NOTHING MOVED and NOTHING SAID IT WAS LOADING (RUN's load line is hidden under UI's look).
- NEW GAME: the title vanished in one frame (display:none) onto the picks: THE FIGHTS, THE SHELVES (three 10 px boxes each with
  a three-line sub), WHO YOU WERE (a strip of 172 px cards, two and a bit on the glass), THE MAP, THE NAME, then the terminal's
  log and bar. 517 px of picks, the origin you had was the one with a 1 px gold line.
- BEGIN: the door went in one frame (display:none) and the barber's mirror (z 2147483001) was over everything at once.
- No tutorial switch; the fight's veteran's three lessons (COMBAT, 'the first fight teaches') always on.

## WHAT SHIPPED
One new file, UI's: slices/bohemia_ui_crashbox.js (BohemiaCrashbox), its numbers in slices/crashbox/crashbox.json, the robot
baked at slices/crashbox/robot_idle_s_120.png and _52.png (DIRECTION's master-rig robot, records/target/master_rig/robot
raw_Idle_S_k00..k11, cropped to its ink, 64 colours, hard alpha; 68 KB and 19 KB). Three one-line hooks in the alpha: the
script tag; BEGIN's lift handed to BohemiaCrashbox.doorOut (it lifts at the end, or straight away with reduced motion or
without the file); nfOpts hands the fight teach:false when HINTS is OFF. RUN's logic (BOH_START, the title's act(), the load) is
untouched: this file dresses, reads and times.

### 1. THE LOADING SCREEN (ask 280): THE MACHINE
| | before | after |
|---|---|---|
| what moves while it loads | nothing | the tin robot's idle, 12 keys a bar (4 beats at 120 BPM, a key every 167 ms); 4 bulbs, one lit a beat |
| the load shown | nothing on the title | a tin gauge whose needle IS #loadpct's count (5 OF 6 reads 5/6, READY reads full), the count printed under it, the newest #loadgl line printed on a strip of masking tape |
| the look | the valley ground | a plywood box, the edge cut by hand, four screws, a rusty tin bezel with rivets, a cracked tube (scanlines baked a row in three, the corners falling away in steps), tape across a corner, a paper dial glued in |
| where | - | between his letters and NEW GAME (upright 358 x 268 max), under his letters sideways; hidden on a glass too short for 150 px |
- THE WRONGNESS (DIRECTION 11/2, 'loading_it_comes_closer', beat B3): from a saved game's third day, one load in four, the tube
  shows the empty desert with the blank figure instead of the valley and the robot; the three pictures in order, never back
  (bohemia.wrong.loading), never on a first load, never announced. Not seen on a fresh phone (measured: wrong 0).
- After NEW GAME a small machine sits by the bar (the robot's head in a 44 px tube, the four bulbs), so the load stays alive
  under the picks.

### 2. THE START SCREEN (ask 261)
One column in the order a stranger needs, by each section's own heading (RUN's words, so a section RUN adds lands after):
1. YOUR CREW'S NAME: the box written on masking tape at 20 px; ANOTHER deals a prepared name (Battle Brothers' way, the second
   votes' 'names already prepared... reshuffle... or name it yourself'); a tap types (RUN TWO's box, unchanged).
2. WHO YOU WERE: ONE big tin card at a time, the whole width (358 px), the name at 20 px, the line, the facts on a strip of tape;
   the arrows (44 x 44) and '2 OF 15' in the heading; WHAT YOU LAND ON IS YOURS: a swipe that rests on an origin picks it
   (RUN's own pick, the card's click), the arrows pick the next one; the picked card has the gold edge.
3. THE FIGHTS, THE SHELVES, THE MAP: rusty tin plates with a rivet in each corner, 44 px; the picked one gold paint on tin; what it
   does is said once, in the heading ('THE FIGHTS every crew one man smaller'), Battle Brothers' way of showing the picked
   difficulty's line.
4. HINTS: ON / OFF (below).
Nothing is forced: everything is picked already, BEGIN lights the moment the valley is in. Measured upright: the picks end at
y 646, BEGIN at 756, the column fits (scrollHeight 844 of 844); sideways the picks scroll in their own column (the bare look's
grid), the card 108 px.

### 3. THE HINTS SWITCH (ask 262)
- One switch, ON by default (a stranger is who the demo is for), kept on the phone (bohemia.hints = on/off).
- ON: (a) the fight's veteran teaches his three lessons as COMBAT built them (first aim, first cover, first empty gun); (b) the
  first time the map, a town, a camp is on the glass and quiet (8 s on the map, 3 s in a town or camp; the phone's own screen
  reading), the company's veteran (never YOU; a lone wolf hears nobody) says ONE line on a tin plate beside the phone: his
  portrait (BohemiaCrewFaces, his own look: person_town_0 for DESI), his mouth talking (talk()), the line typed on the beat
  (24 letters a beat), held 8 beats, up out of the phone in three holds and back in three. Each once ever (bohemia.hints.said).
  Never over the door, the barber's mirror, the settings or any sheet laid over the place (the middle of the glass must be the
  game's own frame). The lines are draft:true in crashbox.json for WORDS.
- OFF: none of the three, and the shell hands the fight teach:false (no veteran lessons).
- Measured: ON, a new crew, the game opens in a town: 'DESI: Tap a building to go in. LEAVE on the phone takes us back out.'
  spoken at 3 s after the town settled, plate 260 x 80 over the phone; OFF: nothing logged in 30 s.

### 4. NOTHING POPS (asks 279, 280)
| change | before | after |
|---|---|---|
| title to picks (NEW GAME) | one frame | three holds (375 ms): the choices go down off the glass, his letters slide onto the picks' letters, the title thins to the picks under it, the machine drops into its small self by the bar; RUN's .gone then does what RUN wrote |
| picks to the game (BEGIN) | one frame, the barber over everything | an old set switching off, four holds (one beat): the picture squeezes to half, to a line, the line to a dot; the door is held over the barber's mirror for that beat, so the barber is what is left when the dot goes |
Measured (BohemiaCrashbox.log): title-to-picks holds at 1, 126, 254, 380 ms; door-off at 0, 191, 358, 612, 782 ms on a loaded
phone-speed page (a stall slides a hold later, never skips one). Reduced motion (settings): no travel, the old cut.

## CHECKS
Run on this tree (the baked demo), the door's gates:
- THE FRONT SCREEN, JUST THE FONT (UI's, his 10/18 system): 42 ok, 0 failed, upright and sideways. On the way it caught four real
  things, all fixed at the source: the tin a shade too light for the sun test (rule 73; the tin's base now #26281f), 2 px edges
  that put the gold plates' dark under a word past a tenth (1 px now), the facts' tape too dark (a light tape of our own), and the
  sideways picks running 149 px past their column (two columns sideways now, nothing scrolls); and old log lines scrolled off the
  little receipt still counting as on the glass (only the two newest print).
- THE SCREEN HOLDS THE LOADING 27 passed, 0 failed (first run: the bar 2 px into BEGIN with the small machine 48 tall; 40 now).
- THE FRONT DOOR 7/0, THE DOOR WAITS 10/0, THE COMPANY TAKES HIS NAME 6/0, EVERY ORIGIN STARTS LIKE ITSELF 15/0.
- A FRESH PHONE SEES THE DOOR 7 passed, 2 failed: F0 and F1 (a save written before play) are red on main too (baseline below);
  F5 re-aimed: it read the door's display the instant play began, so a door that switches off over one beat read 'flex'; it now
  waits that beat out (two at most) and still wants the door gone (ok: began true, the door none).
- ONLY THE FINAL LOOK, six runs of both profiles after the fix: 10/0, 10/0, 9/1, 10/0, 10/0, 9/1 (both misses on the phone profile: the first frame after the lift came late, at +250 ms once, after a stall while the barber builds; the leg wants it under 250 ms). Before the fix it was red one run in two. Main: one run, 10/0; whether main misses one in six is not measured. Re-aimed with reason: BEGIN opens a quiet black second by design (the barber's QUIET and the tape's,
  1000 ms, the second votes' 'nothing happens in the first second'); on main the lift lands both compared frames inside it; the
  switch-off spends part of it, so the frame the leg compares against is the last one still inside that second, counted from the
  BEGIN press (__BEGIN_AT, a real pointer). The switch-off itself went to six holds a beat (83 ms, four holds) so it is over well
  inside that second, and a touch during it ends it at once.
- BASELINE ON MAIN (this tree's alpha and demo stashed): A FRESH PHONE 7/2 (F0, F1), STOP AND COME BACK 22/3, THE TAP PICKS WHAT
  YOU SEE 3/3 (0 driven taps), ONLY THE FINAL LOOK 10/0. Mine: STOP AND COME BACK 22/3 and THE TAP PICKS 3/3, the same legs.
- Page errors in every drive: 0.

## LEFT
- WORDS: the three place lines and the switch's words are drafts.
- The wrongness picture on the tube is decided from a save's day (B3 read as day 3+); if DIRECTION/COORDINATOR give the beats a
  shared clock, read it instead.
- The machine is drawn at one css pixel a pixel; on a computer the robot is 81 x 120 px. A bigger robot sheet would read better
  on a monitor.
- A hint for the crew screen (YOUR COMPANY) and the first job is not written: small, not gung ho, his word.
