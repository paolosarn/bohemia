# EVERY FIGHT HANDS HIM BACK (RUN, 10/1/26, [fight returns], rule 57)

> **PAOLO 10/1:** *"I entered combat and it was so dog shit and then combat didn't end so I
> couldn't get back into the overworld bro."*

## REPRODUCED ON THE DEMO, BEFORE ANY CHANGE

A road party's fight, started by the game's own call (the toll crew):

- **60 s of SHOOT, 60 s of RUN: no end.** One goon at long range in the dark. The first shot misses
  OUT OF RANGE, SHOOT leaves the ring, "he hits you 0%", and he never closes.
- **The fight has a WAY OUT, and while it has one, putting everyone down is not the win.**
  Reaching it is. The screen only says "WAY OUT 4T". Walking to it with the ring ends the fight in
  two or three moves.
- **And every fight that did end froze for 10 to 11 seconds on its last frame.** The way home
  clicked the map tab, and that click re-baked his body (1.2 s) and the whole cast (6.7 s) on the
  one thread before the shell could do anything else. Seen from the chair, that is a fight that
  did not end.

## FIXED (RUN's half: the way home)

The way home takes the map tab without the re-bake (the map already holds his body and the cast
from the door, and a fight changes neither). **Three fights in a row: home 0.79 s, 0.87 s, 0.88 s
after the fight's end. It was 11.0, 10.0 and 10.3 s.**

## CHECK

**EVERY FIGHT HANDS HIM BACK**, new, 9/0, registered slow, driver-played on the demo: a road fight
opens from the map; walking to the way out with real taps ends it; he is back on the map on the
block he left in under 3 s; the result is written ("You walked out of that one."); a lost and a
cleared fight hand him back too; the next step can meet the next fight. Mutations: the re-bake put
back; the shell never taking him home.

## ROUTED TO COMBAT (the end condition is theirs)

A player who only shoots never ends a road fight: the goon stays out of range and passive, SHOOT
disappears after the first miss, and the only ending is a way out nothing teaches. The gate prints
this every run as a NOTE for COMBAT. What would close it, their call: the goon advances when out of
range, or SHOOT stays and says MOVE CLOSER, or clearing the board wins even with a way out.
