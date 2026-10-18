# THE DEMO BOOTS LIGHT (RUN, 10/10/26, [first load] + [load hunks], rule 66a, release line 12)

> **PAOLO 10/5:** *"I feel like I gotta wait 40 seconds for this shit to load."*

## MEASURED FIRST
PLUMBER's FIRST LOAD at phone speed (4x CPU, served like GitHub Pages), on main before this round: the title at
3.6 s, BEGIN ready at **75.0 s**, **27.1 MB** downloaded before it, the page itself downloaded twice.
Then a CPU profile of the demo from the link to BEGIN ready, at full speed, after each cut.

## THE CUTS, IN ORDER, WITH WHAT EACH WAS WORTH (full speed, BEGIN ready)
| cut | ready |
|---|---|
| main | (75 s at 4x) |
| PLUMBER's six hunks ([load hunks]: the tile warm-up stands down, the watcher reads to the stamp, the bind cache) | 16.3 s |
| the CHARACTER tab's hair, family and faction boards skipped in the demo (no such tab; 1.1 s) | 13.2 s |
| **the demo is seated on the map**: the world still seats him from his feet (LANDED, his house), but in the demo it never draws the street it is about to leave; the HUD's street lines (2.8 s) and the street drawn as its tiles arrived (1.7 s) are gone | 6.3 s |
| the map's six people put on once for all eight facings (96 rig rebuilds -> 6), and the still is the breath's own 0.25 frame (one bake, not two); the message to the map is byte for byte what it was (hashed, 4,560,392 characters, the same sha1 before and after) | 5.2 s |
| no build check 15 s in (the page just loaded is the newest build; it pulled the whole page again mid-boot) | |
| no reload when the service worker first takes over (a first visit's page is already fresh; it downloaded the whole page twice before the title) | |

## AT PHONE SPEED (FIRST LOAD)
- The title: 3.6 s -> **1.3 s** (rule 66a's two seconds: T1 green).
- BEGIN ready: 75.0 s -> **about 22 s**. NEW GAME itself is live as soon as the title's buttons are (1.9 s): it opens the
  picks, which need no world; the wait is BEGIN's.
- Downloaded before ready: 27.1 MB -> **6.7 MB**.

## WHAT IS LEFT (the 8 s budget at 4x is not met; the row stays CLAIMED)
At full speed, 5.2 s: the map's six people baked (1.4 s), the map drawn as its tiles arrive (1.2 s), his own body baked
(0.6 s), the rest small. The next cut is the cast: bake it once at cut time (it is the same 4.5 MB of packed frames on
every boot, hashed) or bake the breath after BEGIN without a freeze on the beat.

## THE WORKSHOP
Unchanged: the alpha still starts him on his street and builds the boards (THE DEMO BOOTS LIGHT, B7).

## CHECKS
- **THE DEMO BOOTS LIGHT**, new, registered slow: a profile from the link to BEGIN ready (the street drawn 0 ms, its
  lines 0 ms, the boards 0 ms), the cast's rebuilds counted, the still is the breath's frame, he is seated on the map,
  the page fetched once in 20 s, the workshop unchanged.
- **FIRST LOAD** (PLUMBER's): T1 now green.
