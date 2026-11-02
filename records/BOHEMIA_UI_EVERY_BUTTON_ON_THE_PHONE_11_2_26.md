# EVERY BUTTON ON THE PHONE, A BIG RELOAD, NO TURN-ORDER STRIP, THE SCREENS TRANSFORM (UI round 2, 11/2/26, BUILD 11/3g)

Asks 283, 282, 281 (with 275), 279 (with 257) in records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md; his words in
records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md notes 8 and 9:
"I want every interact button from combat to the city on the phone and then combat there's a lot of room and also the reload
button should be a lot bigger... I don't think anyone gives a fuck about which character is next... as a visual I think it's
just a waste." / "the UI transitions... not a big fan of things just disappearing and looking ugly."
Builds on round 1 (records/BOHEMIA_THE_PHONE_RUNS_THE_FIGHT_11_2_26.md). WORLD's camp, time passing and attack moments (ask 273,
BUILD 11/2zzb) were not touched; they were measured alongside (below) and hold.

All measured on the baked demo (tools/bohemia_drive_the_demo.js, real touches), upright 390x844 and sideways 844x390.
Proof shots: records/target/ui_every_button_on_the_phone/.

## 1. NO TURN-ORDER STRIP (ask 283)
- Before: the phone carried a 22-point strip of 5 faces (round 1); the fight's own strip was already off the glass.
- After: no strip on the phone (0 elements) and the fight's #top stays off the glass, upright and sideways. The order stays in
  the code: FIGHT.S.order 5 long, the fight's #order still drawn off the glass (its gates read it). A man's sheet is a tap on him
  on the board (the fight's own), his own face on the phone still opens his.
- Fixed with it: round 1's fight-page P.crew (the strip's reader) overwrote the map's P.crew (the bar's CREW) on the same object.
  Gone with the strip.
- The bench (the fight's page opened alone, COMBAT's workshop) keeps its own top bar and strip: four COMBAT gates read it there.

## 2. A BIG RELOAD (ask 282)
| | before | after |
|---|---|---|
| RELOAD on the phone, upright | 24x25 square, 3rd row | 50x50 plate, its own row, first, the word RELOAD, its AP (4.2x the area; 50 tall, over the 44 thumb) |
| STRIKE, upright | 24x25 | 50x50 beside it |
| sideways (the phone at its smaller scale) | 22x23 | 45x45 |
| computer (the phone at 1.25) | 30x31 | 62x63 |
The row is the room the strip freed plus the empty grid (round 1 measured about 90 of the ability page's 235 points empty). The
rest of the abilities stay four a row under it; a man with only STRIKE and RELOAD reads "No skills on this man yet" (draft:true).

## 3. EVERY INTERACT BUTTON ON THE PHONE, COMBAT TO CITY (ask 281)
Every visible press on the glass not on the phone, hit-tested from the top, every frame (upright):
| screen | on the glass before | where it lives now |
|---|---|---|
| map | none (round 1) | - |
| town | none (LEAVE on the phone since 10/26; the buildings are the town's own taps and stay) | - |
| camp | none | - |
| fight | none (round 1) | - |
| YOUR COMPANY (the crew screen) | DONE (72x44, top right) and the stash's tabs PERK / ALL / WEAPONS / ARMOUR (and SORT when it shows) | ON THE PHONE: the phone turns into the company's face (its title and stash count, the tabs as plates two a row, DONE a thumb tall, 102x46 upright, 92x41 sideways); the screen's own copies are off the glass (0 shown); each press presses the screen's own button (one handler) |
| the men's slots, the gear, the stash's pockets, the stat rows | on the screen | stay on the screen: they are the screen's things, as a town's buildings |
Also fixed: CREW pressed on the phone a second time did not close the company screen (measured: the screen stayed up through the
camp). DONE on the phone closes it.

## 4. THE TRANSITIONS (asks 279, 257)
Recorded as the screen's own frames (CDP screencast), measured as the share of the glass that changes between two shown frames.
A cut moves most of the glass in one frame; a transform spreads it over held poses.
| change | before (largest one-frame change) | after upright | after sideways | what changed |
|---|---|---|---|---|
| a phone page opens / closes (the feed) | a pop (display none to shown) | 3.6% / 3.9%, 4 to 5 poses | 2.8% / 3.2% | every face of the phone (a page, the fight's face, the company's face) comes up out of the glass on twos (six holds a beat, 500 ms, an overshoot where the tin bends) and goes back in three holds (375 ms); what was under stays until it is covered |
| the fight's face to the apps at the fight's end | a cut to a red COMBAT card, then a fade | the fight's face goes back into the glass over the apps | same | no red flash at the end |
| the strike card at the fight's start | a cut to red | fades up over two holds, the apps hidden only once it covers them | same | |
| the phone itself coming on / going off | a pop | rises from under the glass's edge / sinks back | same | |
| map to fight (the clouds) | 61.9% in ONE frame (the fight's page built in the same task as the clouds' 250 ms fade; its build held the glass 223 ms) | the map darkens and the clouds roll in over 8+ shown frames; the page is built one eighth later (250 ms) under the clouds | same | __THE_CLOUDS_COVER_FIRST__ in the shell's nfOpen; the clouds' own boil while the fight loads (a re-roll every so often, 34-44% of the glass) is their stop-motion look, left as is |
| town to map (LEAVE) | 67.3% (the shrink's first pose took 55% of its travel, inside a 107-143 ms stall) | 39.5%, six visible poses, the town shrinking into its place | 39.8% | MOTION's whole-screen grow and shrink ease in and out (a sine on the same holds); every pose is shown on at least one drawn frame: a stall slides the poses still owed later (logged as slipped), never skips them (__A_STALL_HOLDS__) |
| map to YOUR COMPANY | 26.5% (the real screen in one frame) | 21.6% | 11.8% | the grown plate dissolves into the real screen over three holds (.67, .33, gone) |
| YOUR COMPANY to map (DONE) | 24.3%, the screen gone at once and a blank plate in its place | 24.7%, the screen itself folds down into the phone's corner over six poses with its picture on it | 17.8% | engine/bohemia_crew_door.js close(): one pose a hold, never two in one frame |
| camp, time passing, they come (WORLD, 11/2zzb) | - | make camp 11.4%, break camp 2.6% | 9.1%, 4.2% | untouched, held |
A screen-sized plate shrinking will always move a lot of pixels in a pose (the map uncovered around it); the test that matters is
the strips: every one of these now reads as one thing moving into the next, frame by frame (the _before and _after strips).

## CHECKS
- RUN on this tree: THE PHONE 258 passed, 0 failed (upright, sideways, computer; both corners); THE UI MORPHS 37 passed, 13 failed,
  the same 13 as main's baseline below (the crew fold, the town's grow and the fight's bar lift all pass); THE DAYS ONCE 59 ok, 0
  failed; THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE 48 passed, 0 failed.
- gates/the_phone_gate.js: the strip leg replaced by NO TURN-ORDER STRIP (none on the phone or the glass, the order in the code)
  and A BIG RELOAD (first in its row, a press on top, 44 points tall at the phone's scale, four of the old squares or more); a new
  leg THE COMPANY SCREEN (DONE and the tabs on the phone and not on the glass, a tab pressed on the phone is the screen's own,
  DONE on the phone closes it).
- gates/the_days_once_gate.js: re-aimed (no strip of faces on the phone; the round still rides it).
- gates/the_ui_morphs_gate.js: unchanged; the crew fold writes its own row in BohemiaMotion.log (measured t0, t1, frames), and a
  stall's hold never pushes a morph past its own budget (the bar's lift off stays inside 250 to 500 ms).
- BASELINE on main (07bcfbbd, my changes stashed), the same gates: THE UI MORPHS 37 passed, 13 failed (the old phone's fold and
  return, the camp's grow and shrink now WORLD's moments, the phone's fold into the old ability tray, MOTION's LESS button); NO TOP
  BAR IN THE FIGHT 61 ok, 1 failed (its PLANTED leg); THE PHONE sideways 8 failed (the job card's DROP, then the walk times out);
  ONE ENGINE 0 passed, 1 failed (the front door takes its click). None of these are this round's; they are on their owners' rows.
- gates/one_engine_gate.js: its fight-sound leg waits for the fight's window (built 250 ms after the door now) instead of reading
  it at 300 ms.
- Page errors in every run: 0.

## LEFT
- The bench's own strip (COMBAT's workshop) is COMBAT's to drop if they want it gone there too.
- The clouds' boil while a fight loads is a full-glass re-roll; RUN/COMBAT could make it a slow drift if he calls it a jump.
- The loading and start screens are the next UI round.
