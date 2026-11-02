# HOLD PLAY, SLIDE THE SPEED (WORLD 5, 11/2/26, BUILD 11/3zp)

Rule 311, ask line 304 in records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md. Paolo: "when you hold onto the play button, you get to
slide how fast it goes when you fast forward, or regular time... I think that's the best option, so you get to choose, and the
default is [ours]... I think that's a lot better with the speed that people can consistently travel across the map... make sure it
works with the music too."
Battle Brothers ([bb] library vol 01): the world map has pause, normal and fast-forward; an event or a fight stops the map and you
come back at normal speed.

## BEFORE
- The phone's PLAY: a tap plays or pauses the map (travelSpeedSet). A held press (550 ms) opened a page of speed buttons with one
  button on it, "One speed on the map for now." (rule 151(c), his 10/24 "make the default speed 1.22 and let's keep that for now").
- The map went at 1.22 blocks a beat: a block on every beat and an extra block on about one beat in five (carried fraction).
- A road happening (a party met, a fight, a chase) paused the map; PLAY then went on at the speed before.
- BUG FOUND ON THE WAY: the extra blocks of a fast beat were timed from AFTER the beat's first block had finished its step, not from
  the beat. Measured on the gate box: at 2x the half-beat block landed 25 ms late median, 86 ms worst, every beat.

## WHAT SHIPPED
- HOLD PLAY (350 ms) and a slider comes up out of the phone's glass over PLAY's own column, under the thumb: 1x at the bottom
  (marked REGULAR), 2x, 4x at the top, the knob on the speed he has. Slide up or down: one notch for every 42 points his finger moves
  (relative to where it is, so the touch itself never jumps the knob). LET GO and that speed is his: SAVED (survives a reload), the
  mark on PLAY says it, the slider goes back into the glass. On a march it is the speed at once; on PAUSE it is the speed PLAY sets
  out at; the hold never starts the clock. A short TAP is unchanged: play or pause. Map only, as PLAY is.
- THE STEPS ARE WHOLE BLOCKS A BEAT: 1x (one block on every beat), 2x (eighth notes), 4x (sixteenths). Every extra block is now timed
  from the beat itself (beat + k x 500 / N ms). Every block still pays its own game clock, so a crossing costs the same game hours at
  every step, only fewer real seconds (measured 5.3 to 6.9 game minutes a block at every step; the spread is road against open).
- THE MUSIC IS NEVER TOUCHED: nothing in the alpha's music or sound code or engine/ reads the travel speed (checked by the probe).
  Only how many blocks fit in a beat changes.
- A ROAD HAPPENING DROPS TO REGULAR TIME, the Battle Brothers way: a party met (the meet card), a fight, a chase that ends, a road
  event. The card holds the map as before (PAUSE, rule 44a) on the very block that met it (the rest of that beat's blocks stop), and
  the march after it goes at 1x. His saved pick is kept; he slides back up when he wants. Making camp, healing and a wipe keep his
  pick. The list is in the data file.
- THE NUMBERS ARE IN A DATA FILE: engine/bohemia_travel_speeds.json (steps, regular, the default, what drops to regular, the hold
  time, the save key), read at boot, mod-friendly; the map checks it (whole numbers 1 to 16, regular and the default among them) and
  keeps its mirror if the file is bad. Not the region's land file: that is the terrain's (WORLD 3 is in it this round), and these are
  real-time seconds, not game minutes.
- An old number (a save's 1.22, a 3 or 5 from the old pad) goes to the nearest step.

## THE CROSSINGS (the valley's 14 towns, routes on the map's own path finder, the demo, upright phone 390 x 844)
| trip | blocks | game time | 1x | 2x (default) | 4x |
|---|---|---|---|---|---|
| THE VALLEY: the longest town-to-town route (Anarchists to Remnants) | 88 (92 before WORLD 3's mountains landed this round) | 8 h 4 m | 44 s | 22 s | 11 s |
| a normal trip: the median from where a new game starts | 36 to 47 | 3 to 5 h | 18 to 24 s | 9 to 12 s | 5 to 6 s |
| the old default, 1.22 | | | the valley 36 s, a normal trip 15 to 19 s | | |
On the clock's own rate (2 blocks a second at 1x). Measured on the gate box with the drawing on (the final run, 88 blocks): 42 s at
1x, 23 s at 2x, 14 s at 4x (4x is bound by the machine, below; earlier runs on 92 blocks: 46 to 48, 23 to 25, 11 to 20).

## THE DEFAULT IS 2x, AND WHY
- A normal trip in about 10 seconds and the whole valley in 22: quick, about 1.6 times his old 1.22 ("for now"), half of regular.
- A block every quarter second, on the eighth notes: the marker still reads as walking block by block (the map glide was built for a
  step every BEAT/k), parties on the road still read as moving things he can watch close, and the meet card stops the map in time
  to choose ENGAGE or FALL BACK.
- 4x (a block every eighth of a second, a normal trip in 5 s) is fast-forward for a road he knows; 1x is there to watch.
- Any road happening drops him to 1x anyway, so the default only sets the pace of quiet road.

## THE BEAT CHECK (the engine's own ledger, TRAVEL_LATE: every block against its slot on its beat)
| | 1x | 2x | 4x | 8x (built, measured, left out) |
|---|---|---|---|---|
| THE SCHEDULE ALONE (the drawing and the frame loop off): split blocks late, median / p90 | on the beat | 0.2 to 0.6 / 0.6 to 148 ms | 0.2 to 1.6 / 1.6 to 38 ms | 150.7 / 728.7 ms |
| blocks a second (of what the step promises) | 2 of 2 | 3.98 to 3.99 of 4 | 7.92 to 7.98 of 8 | 8.61 of 16 |
| THE DRAWING ON, this machine: its own beat drifts (median) | 37.5 to 82.7 ms | 91.5 to 128 ms | 277 to 316 ms | |
| THE DRAWING ON, this machine: blocks a beat | 1 of 1 | 1.78 to 1.89 of 2 | 3.25 to 3.5 of 4 | 5.4 of 8 |
- The schedule lands on the beat and its even split when the machine keeps up: 2x and 4x within 2 ms median, every block there
  (two runs; the p90's tail is the odd stall of this box).
- 8x is OUT: even with the drawing off it fell 150 ms behind its slots and moved half its blocks. A map block costs about 20 ms of work
  before any drawing (the world's step: the clock, the parties, the road director), and 8 of them leave no room in a 500 ms beat. The
  code takes any whole number up to 16, so a modder (or a cheaper step later) can add 8 in the data file.
- THE DRAWING ON, this gate box cannot hold even 1x on time (its own metronome drifts 38 ms median): a CPU profile at 4x has the
  canvas's drawing at over half the main thread (drawImage 27%, fill 15%, restore 6.6%, getImageData 2.7%) and 3.5% idle. This box
  draws in software with no graphics chip; a phone draws with one. THE PHONE NUMBER IS OWED (below).
- THE DROP: at 4x, the meet's own door on the sixth block: the map held on that block, and no block of that beat moved after it. The
  engine names the block's slot (TRAVEL_STEP_SLOT): the final run met on slot 3 of 4, 376 ms into the beat, 1 ms after its slot
  (earlier runs 250 and 129 ms; one run on a stall 69 ms, which is why the check reads the slot, not a tolerance); PLAY then went at 1x, six blocks in three seconds, each 0 ms off the beat; the PLAY mark said 1x;
  his saved 4x stayed saved.

## PROOF
- tools/bohemia_world_slide_the_speed_probe.js on the demo, upright phone 390 x 844, a real held finger through CDP touch:
  20 ok, 0 failed on the final tree; the record of the run: records/target/world_slide_the_speed/probe.json.
- Pictures, records/target/world_slide_the_speed/: 1_held_the_slider_up_on_2x.png (the hold), 2_slid_up_one_notch_4x.png (the
  slide), 3_let_go_play_marked_4x.png (let go: PLAY marked 4x), 4_after_a_meet_back_to_1x.png (after a meet: PLAY marked 1x).
- gates/the_phone_gate.js: its computer hold leg re-aimed from "a held press opens the speeds page" to the slider (held mouse: the
  slider on the speed he has; one notch up and let go: that speed, saved, the slider gone; the clock not started). AND IT NOW WALKS
  AT REGULAR TIME: the first run with the 2x default went 189 passed, 24 failed against main's 257 / 1 without this change. Traced:
  its 3-second march after "a tap starts them again" went 6 blocks (49,51 to 43,54) instead of 4 and into a town's door, and every
  leg after it ran inside that town. The gate tests the phone, not the pace, so it pins 1x (the slider's bottom notch) and says why.
  After: THE PHONE 256 passed, 3 failed; the 3 are RELOAD IS BIG (upright, sideways, computer), which main fails on its own (a fight
  leg; the strike button's size moved on main).
- The walking gates that set out on the map with fixed waits, run against main without this change (same failures = not this):
  THE JOBS' PART 27 / 4 (main the same 4: N2, E1, E2, E3); EVERY JOB KIND 35 / 2 (main 35 / 2, P3 on both); MEET BEFORE YOU FIGHT
  13 / 2 (main the same M6, M10); PLAY TAKES YOU THERE 14 / 2 (main the same P2); PAID AT THE TOWN'S EDGE 3 / 0; CAMP HOLDS UNTIL
  HE ENDS IT 12 / 2 while another gate shared the machine (its 12 camped hours only reached 7 to 8), 14 / 0 run alone; EVERY JOB
  KIND run alone 37 / 0.
- Static: no music, sound or engine/ code reads the travel speed.

## WHAT IS LEFT
- THE PHONE NUMBER (for PLUMBER, rule 311's beat leg): on a real phone, do 2x and 4x land their blocks on the beat with the drawing on?
  This box cannot say (software drawing). The probe reads it on any machine: run it there.
- 8x waits for a map block cheaper than about 20 ms (the world's step per block), or a modder adds it.
- A party coming into sight does not slow the march by itself: only a meet, a fight, a chase or a road event drops it (Battle
  Brothers does the same; his call if he wants more).
- No sound on the notches yet (SOUNDS' call: a tick per notch would be the first sound of the slider).
- gates/the_pad_is_travel_speed_gate.js (the 9/30 pad, out of the suite and stale since 10/24's 1.22) still names PAUSE 1x 2x 3x 5x;
  left as history, not run.
