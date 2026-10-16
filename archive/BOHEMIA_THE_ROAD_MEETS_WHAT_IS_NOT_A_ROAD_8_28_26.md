# 36% TO 9.5%: THE ROAD LEARNED TO MEET THINGS THAT ARE NOT ROADS
# 8/28/26, WORLD lane. Second turn on Paolo's "streets are stillls uper fucked".

## THE NUMBER, OVER TWO TURNS

| | |
|---|---|
| edges in the valley where a street reaches one | 7,562 |
| broken when the blindness was first measured | **2,668 (36.3%)** |
| broken after the arterial learned to cut its kerb | 1,616 (22.0%) |
| **broken now** | **700 (9.5%)** |

## 1. THE METRIC WAS COUNTING A CORRECT JUNCTION AS A BREAK — 231

```
OFFSET  commercial(37,91) -S-> arterial(37,92)   47..57  vs  47..81
```

That is a shop's drive approach feeding onto a road. It is **right**. The first version of
this measure demanded the two corridors be the *same tiles*, which is exactly correct where
two arterials meet and plainly wrong here — **a driveway is not required to be as wide as the
road it joins.**

So the rule splits by what the seam actually is:

- **road ↔ road is a CONTINUATION.** Tile for tile, no allowance. Unchanged.
- **road ↔ city is a JUNCTION.** The smaller mouth must be *contained* in the larger, with
  nothing hanging off the side.

Partial overlap and disjoint are still broken — that is a driveway that half-misses the road,
which is the thing that actually looks wrong standing there.

Reading four samples changed the metric. **Nothing about the world had to change to fix 231 of
these; they were never broken.**

## 2. LAS VEGAS BOULEVARD GOT WHAT THE ARTERIAL GOT — 57

`strip ↔ resort`, both directions. The biggest resorts on the Strip each build a porte-cochere
drive out to their property line, and the boulevard presented an unbroken 12 m promenade and a
kerb in front of every one of them.

New code 25, **kind `gate`** — a body walks straight through it and a car drives across it, so
the widest continuous pedestrian surface in the valley is not cut in half by every entrance on
the boulevard. Same shape as the arterial's driveway apron, for the same reason.

All three lessons the arterial's version cost were already paid for and did not recur: match
the run exactly and never widen it; run to 64 not 63; a run wider than a real approach is
frontage, not a door.

## 3. THE DESERT OWNS A DOOR AFTER ALL — 576, THE BIGGEST SHAPE LEFT

The first cut skipped open ground outright — *"desert, mountain, water own no driveway"* — and
then the measurement came back with `desert ↔ arterial` as **the single biggest shape in the
valley**, 576 seams, once the shops were connected.

They are **two-tracks**: two and three tiles wide, running out of an empty lot straight at a
mile-grid arterial and stopping in its frontage. Out there the county grades an apron at every
one of them, because a truck leaving the blacktop at speed has to have somewhere to put its
wheels.

New code 23, **graded turnout, kind `drive`, dirt**. Not the poured concrete a shopping plaza
gets: **giving a two-track an apron would be the same lie as giving a dead lawn a green.** A
run wider than 8 tiles out there is a wash or a quarry floor touching the boundary, not a door,
and is left alone.

## AND THE ONE I FAILED, FOR THE THIRD TIME, AND STOPPED

The 40 `freeway ↔ freeway` seams. Filed as a **map fact** off two sampled cells. Filed as **the
beltway's four corners** after reading the overmap; that fix was built, run, and changed the
count by exactly zero.

So this time **I photographed one**, which is what I had written down that I would do.

**THE PICTURE:** two freeway carriageways running abreast, and the **overpass decks do not line
up across them.** One half carries a bridge at rows 47..81 and the half beside it has bare
embankment at those rows — `47..81 vs -1..-1`, which is what every one of the 40 profiles says.
A bridge over an eight-lane freeway that stops half way across.

The cause is a guard in the world: `if(!cross.length)` means a carriageway that has a crossing
*of its own* never asks whether its sibling is carrying a bridge across it. The 8/27 note had
already found that removing the guard made things worse (40 → 192) and drew the wrong
conclusion — that the guard should stay. **The guard was never the problem. The test inside it
was.** "My sibling touches any road of another district anywhere" is true almost everywhere on
a ribbon that runs the length of the valley. **A loose test behind a tight guard looks like a
tight test, and the day you remove the guard you find out it never was one.**

I replaced it with the real question, asked with the same function the cell uses on itself:
*does my sibling carriageway have a cross street?* Measured: **40 → 199.** Worse.

**Reverted.** Because a boolean is not enough: both halves have to build the deck **at the same
position along the run**, and a cell that is only spanning through does not know where its
sibling's bridge is. The next attempt passes the deck's POSITION, not a flag — the same "the
world measures the neighbour and tells the module" shape that closed 576 desert turnouts an
hour later.

**Three attempts, one photograph, one honest revert.** The photograph is the only one of the
four that produced a fact.

## WHAT IS LEFT, MEASURED

| | |
|---|---|
| 99 | `arterial ↔ freeway` offset — a ramp, which is a piece that does not exist |
| 40 | `freeway ↔ freeway` — the deck position, above |
| 35 | `solar ↔ desert` |
| 47 | `desert ↔ freeway` — an interstate has no turnouts, so these may be correct as they are |
| 700 | total, across 166 shapes, none larger than 99 |

## THE GATES

`street_contract_gate.js` 19/19, with `REACH_DEBT` ratcheted 1616 → **700**. Arterial 0 of
2594 and rail 0 of 86 still hold at zero with no allowance; the 4 km sidewalk walk is still
unbroken on both sides. Drive network, occupancy, sidewalk sanctity, district kit,
walkable-land, road cell, tilespec and dead valley all green. Legend codes went 1064 → 1066
with the dead count unchanged at 16, so **both new codes are actually drawn**.
