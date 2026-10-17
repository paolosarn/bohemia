# THE LONG FREEZE (RUN, 10/16/26, [the long freeze], rule 94: the cause under the stop)

> **THE STOP (the coordinator, sweeps AK and AL):** a freeze of 14.8 s on BUILD 10/11f and of 9.1 s on BUILD 10/13b during
> play, on the 4x throttled phone profile (tools/bohemia_five_minutes.js --throttle 4); three runs in a row over a beat.

## HOW IT WAS MEASURED
The coordinator's own instrument, unchanged, run by a wrapper that adds a CPU profile of the whole walk and a log of every
tap (scratch fivep.js); then every unbroken busy stretch over a second (no idle sample inside) listed with the stacks that
ran in it and the tap before it. Three runs on main's committed demo (BUILD 10/13b), three on this round's tree.

## THE CAUSE
During play, every long busy stretch is **the whole map drawn several times in one frame**. A step on the map starts four
animation loops, and each one draws the whole map on every frame:
- the movers' tween (`moversAdvance`'s `tw`: the cargo and the plane), 420 ms of frames after every step;
- the party's glide (`cityGlideAt`'s frame);
- the beat (`animate`'s loop), a whole beat of frames after a step;
- the roaming parties' glide.
All four run in the same frame and each draws everything. One draw is 0.4 to 0.7 s on the phone profile, so a frame stacks
to 1.6 to 2.8 s. Measured on BUILD 10/13b: busy stretches of 2.6 s (`tw > render` 1,645 ms + `loop > render` 444 ms +
the parties' glide 377 ms), 2.1 s and 1.7 s, each after a tap that moved the map. A heavier view (pinched out, more on
the glass) or one more loop running stacks the same way to the 9.1 and 14.8 s the cord saw. A gap between the map's frames
is what the walk counts as a stall, so one stacked frame is one long stall.

Also over a second, and not this: the morning offer's street blocks (1.0 to 2.1 s each; gone with [ten seconds to play]
round five, the ring's distance baked by the cut, and a block a task until then), the phone app's first open (it builds
its own world map, 0.6 s), and his body drawn before the door.

## THE FIX (`__ONE_RENDER_A_FRAME__`, slices/BOHEMIA_CITY_WORLD.html)
A draw asked for from inside an animation frame happens AT MOST ONCE in that frame; another ask in the same frame is moved
to the next frame, one draw there for all of them. Every loop's state is time-based (the glide, the tween, the parties),
so the one draw shows all of them. A draw asked for anywhere else (a tap, a timer, a message, a check that reads the
canvas right after) is untouched.

## THE NUMBERS (five minutes at 4x, three runs each)
| | stalls over a beat | worst stall |
|---|---|---|
| main, BUILD 10/13b | 18, 21, 24 | 2.9, 2.4, 1.65 s |
| this round | 11, 18, 12 | 1.2, 1.2, 1.07 s |

## WHAT IS LEFT (the row's end state is no stall over a beat)
One whole draw of the map is 0.6 to 0.9 s on the phone profile, so any frame that draws stalls over a beat: the map has
to draw cheaper (PLUMBER's native map budget, rule 40g: painted once per zoom into a cache). The phone's first open and his
body before the door are one each.

## CHECKS
THE MAP ANSWERS AFTER BEGIN M11 (new): on his first trip at 4x the draws are folded (20 times) and no gap between the map's
frames passes 1.5 s (633 ms). The fold removed: no folds, 1,433 ms, red.
