# RUN SIX (chat 01f, the save): THE SAVE COMES BACK THE SAME, AND THE ROAD FIGHT'S TWO GATES (11/6/26)

The finish line, stage 1 item 1: nothing breaks a run, the saves included. Two jobs from the coordinator's dispatch: (1) PLUMBER 4's
whole-loop smoke test saw a save made after a fight come back with the clock about 5.5 hours later, twice in four loops; (2) the UI
morphs gate (34/14) and the no-top-bar gate (6/6) were red on main's own files because `roadContactFight` opened no fight.

## 1. THE SAVE THAT CAME BACK HOURS LATER

### Reproduced, with every clock move traced on both pages

A scratch probe (the session's scratchpad, probe_save.js) played PLUMBER 4's loop on the demo at 390 x 844 (a town, the map, a
journey, a crew met, ENGAGE, the fight won, the end screen's LEAVE, a save, the tab closed, the link opened again, CONTINUE) with
`advance`, `applyRestore`, `travelTo`, `travelPath` and every touch wrapped before any page script ran (the driver's `arm`).
One run of three reproduced it:

- The save was RIGHT. Saved at day 1 06:37; both save slots held 06:37 (gens 17 and 18); the reload's `applyRestore` put 06:37 back
  at 1.5 s into the page.
- Then, at 9.7 s, the party set off by itself: 70 blocks of travel (`stepOnce` from the metronome, 5.4 minutes each, one road
  interruption of 20), 32 blocks across the valley, 353 game minutes. The glass read 12:30-ish when the gate looked. Nothing on the
  page asked for a journey.

### The cause: a touch that falls through the door onto the map

The door's way in (UI's `doorOut`, the old set switching off, slices/bohemia_ui_crashbox.js) makes the door
`pointer-events:none` for its beat, so a finger already on the next screen (the barber's GO) is not kept waiting. The map is a
separate document in the frame under the door. A second finger in that beat (a double tap on CONTINUE, or a tap repeated while
the door seems slow) falls THROUGH the door onto the map, and on the map a tap is where you are going: `HTMLCanvasElement.up ->
travelTo -> travelPath -> travelGoes`. The shell never hears a touch over the frame, so the set's own hurry never saw it.

Proven deterministically (probe_door.js): CONTINUE, a tap on the door, a second tap 80 ms later in the middle of the glass: the
door then read `display:flex; pointer-events:none; cbx-off cbx-line`, the map got `pointerdown` on `#cv` 2 ms later, `travelTo`
fired, the party moved and 10 game minutes ran. PLUMBER 4's driver taps CONTINUE every 400 ms while the title is up and knocks the
door twice per knock (`#fronttap`, then `#front`'s middle), which is exactly that double tap; whether it lands inside the beat is
timing, hence two in four. A plain save in a town came back exact because the town's screen was under the finger, not the map.

A player does this: a double tap on CONTINUE is the most common thumb there is.

### The fix (slices/BOHEMIA_ALPHA_0_9.html, the door, RUN's)

`__THE_DOOR_KEEPS_ITS_TAPS__`: from BEGIN until a beat (500 ms) after the door is off the glass, the map's frame takes no touch
(`pointer-events:none` on `#cityFrame`); a finger over it lands on the shell, which hurries the set off (UI's own listener) and is
spent there. The barber's chair, the tape and the rest of the shell keep their touches. A second BEGIN extends the hold; it is let
go five seconds after the last BEGIN if the door never lifts. `window.__DOOR_HOLD_OFF` is the gate's mutation (the before), never set
by the game. After the fix the same probe: the hold engaged and let go (`__DOOR_HOLD` held 1, let 1), no touch reached the map,
0 game minutes, he stayed.

### Found on the way, fixed the same way: the fight's bell outlived the fight by 2.5 s

`__THE_FIGHT_SAVES_AT_ITS_START__` (FINISHER 11/2) copies every game key at the bell and puts them back on a reload until the map is
home. `nfHome` cleared the record on a 2.5 s timer, a guess at when the map has saved. Measured: the record still stood 2.5 s after
LEAVE (the probe's 'fightStart true' to +2.6 s), so a tab closed in those seconds put the won fight back at turn one with its loot
gone. `__THE_BELL_GOES_WHEN_THE_MAP_HAS_SAVED__`: the shell asks the map to save the moment the fight is home (`bohemiaSaveNow`,
behind the fight's end in the map's own message queue, so what the fight's end changed is in it); the map answers after the save
(`bohemiaCitySaved`), and the record goes the moment that answer lands. The 2.5 s timer stays as the fall-back for a map that cannot
save yet.

### What the save keeps (unchanged, read back by the new gate)

The day and the minute, the block he stands on, the purse (batteries), the century, the lots, the home bases, the market, the
people, the heirs and the acts, the day loop and its quest, the map's own game (the jobs held and done, last night's bill), the
zoom. The company, the hired, the bag and the climb are their own keys and are written the moment they change. NOT kept, on
purpose: a journey under way (he stands after a reload, as Battle Brothers loads paused), a camp (he is up after a reload), the
speed pick (back to the regular pick).

## 2. THE GATE: THE SAVE COMES BACK THE SAME (gates/the_save_comes_back_the_same_gate.js, in the suite)

One stranger's game on the demo, the tab closed and the link opened again at four moments, every reload through the title the
way a hurried thumb does (CONTINUE twice, 120 ms apart, then the middle of the glass while the door switches off):
S1 in a town, S2 mid-travel, S3 after a fight (the tab goes one second after the map is back), S4 at camp; at each, back is
exactly what the save held, the save is the glass when the tab went (to the minute when standing; at most one save beat behind
when walking or camped), the batteries and the crew as they were, and nothing moves for four seconds after CONTINUE; S3 also: the
fight does not come back. S5 THE LEG CAN FAIL: the same thumb with the door's hold off must move him. S6 nothing threw.

RESULT on the stamped demo (BUILD 11/6k; the stamp was 11/6i when this ran, renamed on the rebase), phone upright: 22 passed, 0 failed, 14.5 minutes. S1 day 1 06:00 back 06:00 to the
block; S2 the glass 06:37 walking, the save a moment before 06:26, back 06:37 at the same block, standing; S3 the bell record
cleared one second after LEAVE, back 06:37 with the fight's 291 batteries, no fight; S4 camped 11:37, the save a moment before
08:37, back 11:37, the camp's hours stopped; S5 with the hold off the same thumb moved him (11:37 -> 11:43, one block): the gate
sees the bug. Earlier runs, kept honest: 19/3 (the gate pressed the end screen's LEAVE before it stood, the fight never closed, and
that open fight's bell then spoiled S4), 20/2 (the gate's own arithmetic: a moving game came back newer than the save read a moment
before the tab went, which is right; the check now asks for between the two).

## 3. THE GATES THAT SAID roadContactFight OPENS NO FIGHT

FIRST, DOES A ROAD FIGHT OPEN FOR A PLAYER: yes. THE WHOLE LOOP PLAYS (PLUMBER 4's smoke test, run as it is on main's files at the
start of this round): 11 passed, 0 failed; step 7 a crew met him, the meet card's ENGAGE (a real tap) opened the fight, 6 men on the
Strip's board; step 8 won and home.

THEN WHY THE GATES SAID NO (a probe, the gates' own call on the gates' own valley, fog off): before the call he stood at 48,48 on a
town's painted ground (townGround true); after the gates' two steps (stepOnce 0 and 4) at 48,49, still on it; roadContactFight
returned false with the contact flag clear, no town-safe block, nothing inside: cityHandOver refused it, because a crew never starts
a fight on a town's ground (WORLD 8's __A_TOWN_IS_ALWAYS_A_DOOR__, rule 381, Paolo 11/3). The game was right; the gates were stale.

RE-AIMED, one line each (marked RE-AIMED 11/6 BY RUN SIX): off any town's ground first (the nearest walkable block three clear of
any town's ground), then the crew on a walked step (meetWalk: the meet card first, the driver's ENGAGE), the way he meets one.
- gates/no_top_bar_in_the_fight_gate.js: 61 passed, 1 failed (was 6/6). Both fights open on both screens. The one red is the gate's
  PLANTED leg 'the fight's bar forced back on the glass is caught' ([none]): its CSS (#top.bmhost display block) no longer brings the
  fight's bar back under html.bm-nobar; it was never reached before (no fight opened). UI's plant, routed.
- gates/the_ui_morphs_gate.js: 36 passed, 14 failed (was 34/14). M8 the map to a fight is green on both screens (the bar lifts off
  in budget, 464 ms planned, 0 frames without it; no bar in the fight). The 14 reds, measured, none about the road fight: the old
  phone's fold out of a town and back (the old phone is gone, rule 238), the camp's grow and shrink (CAMP THREE is rebuilding the
  camp this round, rule 406), the phone folding into the fight's abilities and back, and the settings card's MOTION button (absent).
  Routed to UI and MOTION.

## GATES RUN THIS ROUND (one at a time, on this box; it draws with a software GPU and no image-comparing leg was involved)

THE SAVE COMES BACK THE SAME 22/0 (new). THE WHOLE LOOP PLAYS 11/0 (main's files, before the change). NO TOP BAR IN THE FIGHT 61/1
(re-aimed). THE UI MORPHS 36/14 (re-aimed). DEMO BUILD 25/0. HANDOFF 10/0. Not run: the full suite (rule 13: pre-push pass only).

## ROUTED

- PLUMBER 4's THE WHOLE LOOP PLAYS step 10 prints the two slots as 'day undefined': the slots are an envelope ({gen, p}), read
  through CITYSAVE.load() instead (fixed in the gate's print, one line).
- UI: `doorOut`'s pointer-events:none is right for the shell's own next screen; the map's frame is now held by the door itself.

[bb Battle Brothers loads a save paused: the company stands where it was saved, the clock still, nothing moves until he says;
ours now comes back the same way, and a thumb on the way in never orders a march.]
[analog horror: the tape picks up where it was paused, to the second; nothing on it moved while the screen was dark.]
