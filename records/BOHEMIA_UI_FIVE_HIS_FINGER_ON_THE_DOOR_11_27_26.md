# BOHEMIA -- HIS FINGER ON THE DOOR (UI FIVE, 11/27/26, BUILD 11/27z)

The coordinator's routine 'UI FIVE: keep cooking' (rule 482): after the clock check and the VOTE check, "the next screen he meets,
better and never choppy". Rules 480(c) (every change at full frames on a slowed phone), 441 (proven on the real glass, demo, upright
and sideways).

## THE SCREENS HE MEETS FIRST, MEASURED (the demo, a fresh phone, 390 x 844 and 844 x 390, the CPU slowed 4x, the valley loaded)

| | upright | on its side |
|---|---|---|
| the title standing | 60 fps, worst 17 ms | 60, 17 |
| NEW GAME (the title to the picks) | 60, 33 | 60, 17 |
| the picks standing | 58.5, 117 | 58, 150 |
| **a tap on a crew pick** | **30.5 fps, worst 400 ms, long tasks 425, 243, 219, 145** | **41, 333, tasks 337, 210** |

The pick was the one choppy thing. THE PROFILE (CDP, the 2 s after the tap): 876 ms inside the jobs' planner
(slices/bohemia_job_danger.js planSlice -> planOne -> fightsFor -> roll, trip), the door's own redraw about 20 ms. A pick turns the crew
key (the company, its cap: rule 491, the enemy grows with his company), so every job in the valley is queued to be planned again, and
the planner makes them one job a slice, about 300 ms each at 4x, the first 100 ms after his tap: on top of the door redrawing under his
finger, for a board nobody can see from the door.

## THE FIX (slices/bohemia_job_danger.js __NO_PLANS_UNDER_HIS_FINGER_ON_THE_DOOR__)

While the door (the top page's #front, before BEGIN) or the barber's chair (#mainmaker) is on the glass, the plans wait for 2.5 s after
his last touch there (pointerdown or a key, heard once on the top page), and run while he reads, as before. Beside CAMP FOUR's
__NO_PLANS_UNDER_THE_CAMP__, same function, same shape. window.__PLANS_UNDER_THE_DOOR = the way it was.

FIRST TRIED AND MEASURED WRONG: holding the plans for the whole door. The picks went smooth (54.7 fps, worst 117) but the plans only
moved: they all ran after GO, on the squad's tape (GO and the 10 s after: 38 -> 24 frames a second). Under the finger rule the plans
are still done by GO (measured: the door's queue empty before BEGIN after a few seconds of reading; nothing planned after GO either way).

## AFTER (the card's own run, tools/bohemia_ui_five_his_finger_on_the_door_measure.js, the 2.5 s after each of three picks)

| | pick 1 | pick 2 | pick 3 |
|---|---|---|---|
| upright before | 29.9 fps, worst 467 | 56.0, 83 | 26.6, 417 |
| upright now | 57.8, 33 | 56.3, 67 | 58.1, 33 |
| on its side before | 41.8, 333 | 58.1, 50 | 36.2, 383 |
| on its side now | 57.0, 50 | 57.3, 67 | 55.5, 83 |

(Pick 2 is smooth before too: it lands on the crew the first pick's plans were already dropped for, nothing queued.) One of two runs on
its side had a 617 ms frame 1.1 s after the third pick, not at the touch, with no plan running (the gate's counts): something else
behind the door, not this; the other run and every gate run held 55 to 59.

NOT THIS ROUND'S: BEGIN to the barber (25 to 27 fps, tasks 530 to 635 ms) and GO with its first seconds (30 to 38 fps, a 1.6 to 2.4 s
frame either way) are ask row 724, PLUMBER 8's, and measured no worse with this (GO: 30 old, 31.4 now in the same walk).

## THE GATE: HIS FINGER ON THE DOOR (gates/his_finger_on_the_door_gate.js, in the suite)

Through the one driver (its beforeTap: the title, NEW GAME, the valley loaded, the CPU 4x on the door only):
D1 three picks, no plan made inside the 2.5 s after each touch (the page's own clock; the read after must fall inside it) and the planner
says it waited; D2 5 s untouched, it works again; D3 on the map it never waits for the door; D4 nothing threw.
Upright 4/0, on its side 4/0; PLANTED (__PLANS_UNDER_THE_DOOR): D1 red, 5 to 6 plans under a pick.
Also run: THE CLOCK UP TOP 22/0 on this main (CAMP FOUR's 11/27s included), the planner's other gate EVERY CHANGE AT SIXTY is on the
quarantine (PLUMBER 8) and measures after BEGIN, where this never applies.

VOTE ui5-his-finger-on-the-door-11-27 (STAND-IN, a chart: every frame of three picks, before and now, both ways).
[bb Battle Brothers' new-campaign screen: you click through origins and nothing behind it moves]
[analog horror: the camera feed holds still while you choose; the hum behind it waits for your hand to leave the glass]

## AND ROOM ON THE PUBLISHED LIST

PAGES PUBLISH was red on main before this build: the published list 900.402 MB, 16,900 files, over its 900 MB cap (this build adds
0.002 MB before its card). Room made from this lane's own pictures: the clock card's before_and_now.webp 678 -> 84 KB and the alpha
continue card's 553 -> 94 KB (the same pictures re-saved as WebP quality 80, checked by eye: every word and edge reads). After:
899.376 MB, room for this card.
