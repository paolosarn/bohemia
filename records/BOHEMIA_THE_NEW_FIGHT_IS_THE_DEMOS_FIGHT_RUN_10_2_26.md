# THE NEW FIGHT IS THE DEMO'S FIGHT (RUN, 10/2/26, [fold the loop], rule 63)

> **PAOLO 10/2:** *"combat is so glitchy ugly and fucked up... start combat over from the ground
> up... re-create Battle Brothers combat."* Rule 63: "the loop hosts it and RUN folds it into the
> demo." [fold the loop]'s 10/2 note: "swap the fight file in when it lands."

COMBAT shipped it (645c31f, `slices/BOHEMIA_FIGHT.html`, THE REBUILT FIGHT PLAYS 33/0).

## THE FOLD (`__THE_NEW_FIGHT_IS_THE_FIGHT__`, the shell)
- **Every fight the map starts opens the rebuilt fight**, through the same door (the city's
  `cityHandOver`, the shell's `cityEncounterIn`) and the same way home (`cityFightHome`). So road
  parties, the loop's JOBs and every other way in need no second path. The frozen fight is not
  opened and not touched (rule 63a).
- **The map tells it the board and the night.** The handover now carries the block's district.
  The shell picks the board of that kind (COMBAT TWO cut eight boards from the city's own block
  kinds), and night comes from the map's clock.
- **It tells the map won or lost** (its one message, `BOHEMIA_FIGHT_OVER`). The shell reads who
  fell and who ran off the fight's own state. The loop settles the contract: won pays, lost loses
  it.
- **Its result card stays up four beats, then he is home.** A tap on the card takes him home at
  once. The card's "again" button is the fight's test-bench door, so it is hidden.
- **The shell's gear steps out while the fight is up.** It sat on the fight's ROUND line.

## MEASURED
| | |
|---|---|
| a whole road fight on AUTO (real tap), suburb board | lost in 13 rounds, home 2.0 s after its end |
| a lost fight / a cleared fight with a tap on the card | home in 2.3 s / 0.6 s |
| the loop: a JOB fight on AUTO, landfill board | won, paid 1 battery (5 to 6) |
| a second contract, cleared | paid (6 to 7), the bar says 7 |

## ONE BOARD STALLS, ROUTED TO COMBAT
I played all eight boards alone on AUTO (seed 5). Seven ended in 6 to 19 rounds. **The freeway
board did not end.** At round 60 the band was still holding its line out of sight, and the last
two of yours were Breaking and Wavering, with no end. A fight that never ends is his 10/1 bug, so
**freeway blocks fight on the strip board** (`NF_FREEWAY_BOARD`) until COMBAT says the freeway
board ends. The gate prints this every run as a NOTE.

## CHECKS
- **EVERY FIGHT HANDS HIM BACK**, re-aimed to the rebuilt fight, 9/0. A whole fight plays to its
  end, then he is home on the block he left in under 3 s. A lost fight and a cleared fight come
  home too, and a tap on the card goes home at once. Three mutations, each red: the frozen fight
  put back; the shell never taking him home; the card not wired.
- **THE LOOP PLAYS ON THE MAP**, re-aimed, 12/0. The JOB opens the rebuilt fight; AUTO plays it
  out and the loop keeps its word; a second contract is cleared and paid.
- The frozen fight's walk-out legs went with the frozen fight (rule 63: its gates stop counting).
