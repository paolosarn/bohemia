# THE LAST LIGHT
FACTIONS lane · [horror signs] round seven · volume on the approved shape, and a correction
to my own last round · 9/23/26

## THE ONE LINE
**The Volunteers hold 331 blocks of this valley and exactly one of them has power.**
Block 27,15. One sodium lamp on a camp. Measured, not written.

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## WHO HOLDS THE LIGHT
**358 lit cells of 9,216 — 3.9% of the valley**, not the 12% this lane has been repeating
from the power grid's own design note. Corrected here.

| crew | blocks | lit | of their own | **of all the light** |
|---|---|---|---|---|
| Cartel | 875 | 61 | 7.0% | **17.0%** |
| Remnants | 1028 | 54 | 5.3% | 15.1% |
| Mob | 1490 | 46 | 3.1% | 12.8% |
| Anarchists | 528 | 45 | **8.5%** | 12.6% |
| Caravans | 545 | 27 | 5.0% | 7.5% |
| Network | 1221 | 26 | 2.1% | 7.3% |
| Church | 453 | 24 | 5.3% | 6.7% |
| Reds | 654 | 21 | 3.2% | 5.9% |
| Blues | 473 | 17 | 3.6% | 4.7% |
| Custom | 363 | 14 | 3.9% | 3.9% |
| Homeless | 378 | 14 | 3.7% | 3.9% |
| Colorful | 432 | 5 | 1.2% | 1.4% |
| Trades | 445 | 3 | 0.7% | 0.8% |
| **Volunteers** | **331** | **1** | **0.3%** | **0.3%** |

**The Cartel hold 17% of all the light in the valley**, more than anybody, on the fourth
largest holding. **Anarchists have the highest share of their own ground lit** at 8.5% —
and round two measured that they also hold 100% of the running water. Two independent
systems keep pointing at the same crew.

**And the three darkest crews are all camp tier**, which round three measured as the
*cheapest* ground to walk on — two blocks in three free. Two systems nobody wired together
agree with each other:

> **The cheap ground is cheap because it is dark.**

## BOTH SUBSTATIONS ARE DARK
`34,39` on Network ground and `58,64` on Custom ground. Neither has a live circuit. **The
two buildings whose entire job is handing out power have none.**

## THE CORRECTION, AND IT IS MINE
Last round I wrote *"the data fort has all six of its blocks lit."*

Measured both ways this round:

| | all six cells |
|---|---|
| own circuit | **false** |
| touches a live street | **true** |

The radius-1 reading is the right one for a *building* — the city's own `pumpStations()`
uses exactly it, because circuits are contiguous street runs, so a non-street cell never
has one of its own. **But "all six blocks lit" is not that sentence.**

**And the fort is Cartel ground, not Network.**

The galling part: I caught myself lighting its windows a pixel off the Network teal *in
that same round*, fixed the picture, wrote it up as a near miss — and then left the wrong
claim standing in the words. **The picture was corrected and the sentence was not.**

## THE COOK
`slices/BOHEMIA_THE_LAST_LIGHT_9_23_26.html`, registered as `factions-the-last-light-9-23`.

Three frames, one wrong thing each, printed under the picture:

- **THE LAST LIGHT** — *one street lamp, on 331 blocks, and the thing that feeds it has been
  off for ten years.*
- **THE SUBSTATION** — *the building whose whole job is handing out power is the one without
  any.*
- **THE DATA FORT** — *it has no name, no windows and no light of its own, and it is still
  drawing off the street.*

**No new silhouette.** He killed three of four shapes and has not ruled on the night
re-cook, so this is the approved monument plus the one thing the bible requires anyway: a
**drawn fixture**. R4 says every lumen has a source you can point at, and on a block with
one light the lamp *is* the subject.

## AND A FOURTH DEAD STUB IN A FIRST DRAFT
`streetLamp()` and `lampGlass()`, both holding garbage strings, neither ever called. I wrote
the signatures before knowing whether a second scene would need them. It did not.

**Write the thing where it is used, and hoist it only when a second caller actually
exists.** Four rounds, four drafts, four pieces of dead scaffolding that had to be caught by
reading my own file back.

## WHERE HE SEES IT
The **VOTE tab**, in the alpha, behind the gear.

## STILL WAITING
**The night re-cook and the dark institutions are both unvoted** — 108 items in the tab, 83
verdicts. If the night cut comes back down that is a second rejection and the feature ends
for the session; that is written into the handoff so the next round cannot miss it.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**Fixing the picture is not fixing the claim.** I caught the Network-teal mistake in the
render, wrote the catch up as a win, and shipped the wrong sentence about it in the same
commit. A visual near-miss feels like the whole correction and it is only half: after you
fix what you drew, go back and re-read what you *said* about it.
