# THE DEMO WEARS THE RIG: THE CUT (RUN, 10/18/26, [the demo wears the rig], rule 115g)

> **THE ASK (the coordinator, sweep AQ):** "cut the demo with the rig truck he voted up (rule 115g), the build stamp
> naming it, the stopwatch run on the new cut, and the 3 dead taps of 69 named and fixed if they are yours. Only assets
> with his YES ride the cut."

## WHAT RODE THE CUT
- **The truck, and only the truck.** Its card `direction-the-look-at-the-source-10-17` carries his UP in the thirteenth
  votes (records/BOHEMIA_THE_THIRTEENTH_VOTES_10_17_26.txt: "I saw how you made the robot. I liked it."). It drives the
  map's I-15 in place of the 6 x 4 yellow box (`__THE_RIG_TRUCK_ON_THE_MAP__`, last RUN round, VOTE
  run-the-rig-truck-on-the-map-10-18).
- **Nothing else rig-made has a YES that the demo can wear.** The robot is a stand-in, not a game character; the dire wolf
  in eight has a YES but the demo's fight has no beast to replace; no rig-made person has a YES (character-the-texture-set
  and cook3-the-reds are both NO). The old sprites stay, per the row.

## THE CUT
- The alpha's stamp moved to **BUILD 10/18b - THE RIG TRUCK ON THE MAP**; the demo, cut from it by
  `node tools/bohemia_cut_the_demo.js`, reads **DEMO - BUILD 10/18b - THE RIG TRUCK ON THE MAP** on its splash, and
  slices/BOHEMIA_DEMO_STAMP.txt says the same (the open demo polls it, so a phone already in the game is told).
- Before the cut the committed demo was 7,762 bytes behind the workshop (stamp DEMO - BUILD 10/13b) and `--check` was red.
  The map people were re-baked from this cut (key 7721bd283e40a953).

## THE STOPWATCH ON THE NEW CUT (five minutes at 4x, tools/bohemia_five_minutes.js --throttle 4)
| walk | door | taps landed / tried | dead taps (named) | stalls over a beat | WORST STALL | fps | page errors |
|---|---|---|---|---|---|---|---|
| 1 | 22.3 s | 49 / 98 | 0 | 17 | **1,533 ms** | 49.1 | 0 |
| 2 | 22.8 s | 47 / 97 | 1 (5x) | 13 | **1,500 ms** | 48.4 | 0 |

Both walks COUNT (20 or more landed taps) and neither stalls near 3 s: the STOP block's rule on the cut is met on the
cut itself. The row [the long freeze]'s own end state (no stall over a beat) is still NOT met: 13 to 17 whole-map draws
over 500 ms a walk; the first 15 seconds after the door average 36.9 fps against 49.7 for the rest.

## THE DEAD TAPS (the coordinator's 3 of 69)
The coordinator's per-tap file was not committed (records/BOHEMIA_FIVE_MINUTES.json holds RUN's walks only), so its three
cannot be read by name. What every walk that wrote names has found, six walks on this instrument since the fix:

| walk | dead taps | by name |
|---|---|---|
| RUN 10/18a walks 1 to 3 | 0, 0, 2 | 5x, 5x |
| this round walks 1 and 2 | 0, 1 | 5x |

**Every named dead tap is the speed pad's lit plate pressed again** (5x while already at 5x). The game is right to change
nothing: the speed is already the speed. It is not RUN's code (the pad is UI's, `__THE_PAD_IS_TRAVEL_SPEED__` in the city
file) and it is not a bug. ROUTED to UI as a feel note: a press on the lit plate could answer with a one-beat flash, so a
thumb that presses it knows it was heard. The coordinator's 3 are most likely the same three presses; the next coordinator
walk can commit its JSON (`deadByName`) so the names travel.

## ONE THING SEEN ON THE WAY
Walk 1 loaded BOHEMIA_CURRENT_SLICE.html (2.1 MB) at 131.6 s after the door: the walk opened the phone, and the phone's
page loads on first open (phoneOpen, the city file). On demand and correct; noted because it is the biggest single file
fetched during play.

## PROOF
`node tools/bohemia_cut_the_demo.js --check` (green on this tree); `node tools/bohemia_five_minutes.js --throttle 4` twice;
the truck on the demo's map by `node tools/bohemia_run_the_rig_truck_on_the_map_shot.js`.
