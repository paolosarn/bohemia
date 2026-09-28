# THE CHURCH HAD NO WAY INTO ITS OWN GARDEN, AND MY RULER WAS HELD WRONG
# LIFE + CITY, 9/28/26, row [honest grid] round 3 — re-aimed by rules 37 and 38

---

## 1. WHAT RULES 37 AND 38 DID TO THIS ROW

- **37(b)** places are settlement screens; on foot only in the fight and special places.
- **37(e)** FOURTEEN parts of Vegas are generated HOME BASES you can raid.
- **38(b)** tile-to-tile through the city is dead; the close grid is the FIGHT'S ground and the
  special places' (the Strip), never the city's floor. My row: "the floor-connects ratchet serves
  fight grounds and the settlement screen's special places; no city-wide walk is built."

So the sealed-floor debt that matters is not the whole valley's. It is **the floor a raid is
fought on.** Measured before touching anything: the fourteen seats, placed by the game's own seat
rule on five seeds, land on 17 district kinds; 10 carry sealed floor.

## 2. THE CHURCH'S HOME BASE WAS THE WORST, ON EVERY SEED

The Church sits on the **chapel**, every seed. 2,296 cells of it — the memorial court and the dead
orchard behind the church — were walled on every side by the columbarium wall.

**The author meant a way in and wrote it down three times.** The generator cut "the gap you walk in
through" at x60-68 of the south wall; NOTES.circulation says "the churchyard walk rings the building
to the transept door and the memorial court gate"; code 18's act-1 line is "the gate into a
memorial court". But the **nave runs x52-76 from the apse straight down through the court**, so
those gap cells were already church and the line did nothing, and the nave splits the court into two
sealed halves.

**Fix, following the written intent:** each half gets that gate (code 18), three wide, in its south
wall at the point nearest the nave where there is open ground outside to step onto. **Found, not
hard-coded**, so a change to the building cannot quietly land it on stone again.

    chapel   2,296 -> 14 sealed, on 25 of 25 seed x street-side combinations
    the 14 left: the hollow of the fallen bell (13) and the middle of the churchyard cross (1),
    both drawing choices, named and left

## 3. MY RULER WAS HELD WRONG, AND I FOUND IT BECAUSE THE CHURCH WOULD NOT ROTATE

Checking the chapel on other street sides, every side gave the identical 14. Too identical. The
chapel's generator reads `generate(seed, opts)` and takes its street from `opts.streets`.
**The game calls every generator as `generate(cell.seed >>> 0, {cw, ch, streets, district})`**
(engine/bohemia_world.js). My shared measurement had been passing **one object as the seed**, with
the street hidden in a `neighbors` key nobody reads: a call the game never makes. Generators doing
arithmetic on their seed got NaN, every street defaulted to south.

**Its numbers were stable, which is exactly why it went unnoticed. Stable is not the same as right.**
This lane's oldest mistake — a number measured in one place and used in another — in my own
ruler, the round after I built it.

Fixed in the one place the measurement lives (`gates/every_floor_region_connects_lib.js`), then
**everything re-measured with the game's call**:

| | last round said | the game's call says |
|---|---|---|
| valley before the kerb and berm | 25,544 in 40 | **25,055 in 40** |
| sign lot | 1,394 -> 0 | 1,394 -> 0 |
| pond field | 2,658 -> 0 | **2,734** -> 0 |
| valley after them | 21,492 in 38 | **20,927 in 38** |
| dam water (the water picture) | 5,329 cells, 32.5% | **5,832 cells, 35.6%** |
| **valley after the chapel** | — | **18,645 in 38** |

Every finding held. Every number that reached him was corrected: the ratchet was **re-frozen** with
the game's numbers (the old freeze would have failed pumpstation for rising 513 -> 575 when nothing
had changed but the ruler), and both unvoted VOTE items were re-rendered and their words corrected.

## 4. A PICTURE IN HIS TAB WAS ABOUT TO LIE TO HIM

Last round's sheet labelled its third row **"CHAPEL: STILL SEALED"**. The chapel got its gates this
round, so that label became a false sentence in his VOTE tab before he had voted. The row is now the
chapel's own BEFORE (the engine exactly as main carried it at 57b10258, read out of git) and AFTER,
and the factory now refuses a STILL SEALED label on a block that is not sealed, and refuses an AFTER
that did not clear 99% of its BEFORE.

## 5. THE GATE

`gates/every_floor_region_connects_gate.js`, now **11 ok, 0 failed**, with a named Church leg.

    MUTATION: the chapel's gates removed   9 ok, 2 FAILED  ("chapel 14 -> 2296", by name)

Nothing else moved: OCCUPANCY 16/0 · DISTRICT KIT 24/0 · LANDLOCKED 16/0 · INTERIOR GROUND 21/0 ·
WORLD MODEL 29/0 · EVERY CELL CLASS 12/0. City slice resynced.

## 6. THE COOK (rule 22): WHERE A RAID IS FOUGHT

`slices/vote/LIFECITY_WHERE_A_RAID_IS_FOUGHT_9_28.png`, **VOTE tab**. The six home bases that still
carry more than a sliver of sealed floor, off their own generators with the game's call:

    REMNANTS   police station    850   two inner yards, walled
    HOMELESS   pump station      575   scattered pockets in the plant
    VOLUNTEERS medical campus    568   a parking grid, every stall walled off
    REMNANTS   prison            206   a strip inside the wall
    NETWORK    radio site        167   pockets between the masts' footings
    CARAVANS   bus terminal       75   a doorway that opens onto nothing

It refuses to draw any panel that is no longer sealed. **Analog horror line:** when the raid comes,
the fight is on ground half of which does not connect to the other half, and nothing on the screen
says so.

## 7. NEXT

The six above, biggest first, each lowering the ratchet as it lands. The dead-pad leg. [three
cities] stays claimed. His note on the shift picture (SCAVENGE as a settlement-screen button, for
when you are down bad, a bonus near a recent battle) is already rule 37(k); carried, not rebuilt.
