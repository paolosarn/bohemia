# EYES [the new demo cut, measured]: THE NEW CUT IS BETTER ON EVERY WALK NUMBER, AND THE TRUCK IS FREE (10/18/26, eyes-opus-10-18b)

> **THE ROW (VAMILY, EYES AND EARS, THE-CUT-WITH-THE-RIG-TRUCK):** when RUN's new cut lands, one walk at 4x on the phone
> profile and one sideways, the four numbers beside AQ's (69 taps, worst 1,050 ms, 55.9 fps, 0 errors), the truck's frame
> cost measured on the map at three zooms, one line in your block and a gray card. Measured, never eyeballed.

The cut: slices/BOHEMIA_DEMO.html, **DEMO - BUILD 10/18b - THE RIG TRUCK ON THE MAP** (RUN d83958a, re-cut a34bb3e).

## THE TWO WALKS (tools/bohemia_five_minutes.js --throttle 4, run one after the other, never sharing the CPU)

| walk | box speed | door | taps landed | stalls over a beat | WORST STALL | fps | page errors | dead taps (named) |
|---|---|---|---|---|---|---|---|---|
| AQ, the coordinator, old cut 10/13b | | 16.0 s | 69 | 2 | 1,050 ms | 55.9 | 0 | 3 (unnamed) |
| **new cut, upright** (390 x 844) | 0.89x | 18.9 s | **70** | **1** | **883 ms** | **56.7** | **0** | 2 (5x at 5x) |
| **new cut, sideways** (844 x 390) | 1.10x | 11.8 s | 68 | 3 | **833 ms** | **56.6** | **0** | 4 (5x at 5x) |

- Every walk COUNTS (20 or more landed taps). No stall comes near the STOP block's 3 s; the worst is under one second on
  both. RUN's own three walks on this cut read 1,167 to 1,533 ms worst and 48 to 50 fps; mine read better, inside the box's
  own drift (0.89x and 1.10x), so the honest reading is "the cut is no worse than the old one and probably a little better",
  not a big jump.
- The rough second is the same on both: seconds 6 to 7 after the door (12 and 19 fps), when the nine city tile files have
  just landed. First 15 s average 48.8 upright and 51.4 sideways, against 57.1 and 56.9 for the rest.
- **Every dead tap, upright and sideways, is the speed pad's lit plate pressed again (5x at 5x).** Same as all seven of
  RUN's named walks. Not a bug; UI's feel note (a one-beat flash on the lit plate) is the fix if any.
- Sideways is new: before this round the walk could only hold the phone upright. `--profile phone_landscape` now passes the
  driver's own screen class through; a sideways walk writes records/BOHEMIA_FIVE_MINUTES_PHONE_LANDSCAPE.json and never
  overwrites the upright record.
- The 2.1 MB phone page (BOHEMIA_CURRENT_SLICE.html) loads at about 128 s on both walks, when the walk opens the phone. On
  demand, as RUN noted.

## THE TRUCK'S FRAME COST AT THREE ZOOMS (tools/bohemia_eyes_the_truck_frame_cost_10_18_26.js, 4x, upright)

| zoom | where | the truck drawn alone | of a 16.7 ms frame | whole-map render, truck vs box (median of 40 each) |
|---|---|---|---|---|
| 0.21 | farthest | 7.6 us | 0.046 % | 511 vs 544 ms |
| 2.48 | middle | 4.6 us | 0.028 % | 437 vs 437 ms |
| 4.74 | nearest | 4.1 us | 0.025 % | 366 vs 369 ms |

**The truck is free.** Drawn on its own, 2,000 times as the map draws it (18 points wide, smoothing off), it costs at most
8 microseconds, against about 1 microsecond for the old yellow box. On the glass at every zoom.

The whole-map number cannot see it, and saying so is the finding, not a failure: one whole render() is 366 to 597 ms on this
profile, and its own noise is plus or minus 40 ms, five thousand times the truck. The first pass put the truck first in every
pair and the box came out 126 ms SLOWER, which no 18-point picture can cause; the second render of a back-to-back pair pays
130 to 160 ms for something the first one left behind (at the far and middle zooms, not the near one). The tool now swaps the
order every pair (ABBA) and the difference falls into the noise, both signs.

## ONE THING SEEN ON THE WAY, ROUTED

**A whole redraw of the map is 0.37 to 0.6 seconds on his phone's profile, and a second one straight after costs another
0.13 to 0.16 s more.** In play the map is painted once and blitted (__THE_MAP_GROUND_IS_PAINTED_ONCE__), which is why the
walks hold 56 fps; but every time something forces the whole repaint, that is the stall. It is the same family as RUN's
[the long freeze] row (13 to 17 whole-map draws over 500 ms a walk). ROUTED: RUN [the long freeze], with this instrument as
the ruler: a render() under 100 ms at 4x on the far zoom would end that row's stalls.

## PROOF
`node tools/bohemia_five_minutes.js --throttle 4` (records/BOHEMIA_FIVE_MINUTES.json);
`node tools/bohemia_five_minutes.js --throttle 4 --profile phone_landscape` (records/BOHEMIA_FIVE_MINUTES_PHONE_LANDSCAPE.json);
`node tools/bohemia_eyes_the_truck_frame_cost_10_18_26.js 40` (records/target/BOHEMIA_EYES_THE_TRUCK_FRAME_COST_10_18_26.json).
Picture: slices/vote/EYES_THE_NEW_CUT_MEASURED.png (VOTE eyes-the-new-cut-measured-10-18).
