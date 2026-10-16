# ONE LINE HAD BUILT EVERY FREEWAY IN THE VALLEY SIDEWAYS
# 8/28/26, WORLD lane. Four failed attempts, one measurement that was asking the
# wrong question, and then the cause turned out to be a fix made once and never swept.

## THE LINE

`engine/bohemia_freeway.js`, in the kit registration:

```js
o.same = o.links = o.streets = ['N', 'S'];
```

It forces both legs **and the axis**, so **every freeway in this valley was built
north-south however it actually ran.**

`gates/street_contract_gate.js` has described this identical line, in the arterial, as that
module's defect number one since the day it was written:

> **EVERY ARTERIAL IN THE VALLEY WAS BUILT NORTH-SOUTH.** The registration forced
> `o.links = ['N','S']`, axis included. 921 cells (26% of every road cell) ran across the
> way the world connects them.

Fixed there on 8/26. **Nobody swept the class.** Third time this month: the dead-green
palette went the same way, fixed three separate times one module at a time.

## WHAT IT COST, MEASURED

`freeway(15,13)` runs east-west and has freeway cells to its east and west. Its edges:

```
N 18..110    S 18..110    E -1..-1    W -1..-1
```

**The carriageway drawn ninety degrees to the direction the road runs.** The whole east-west
leg of the corridor sat in two- and three-cell islands.

| | before | after |
|---|---|---|
| separate road networks in the valley | 214 | **100** |
| biggest network's share of road cells | 91.6% | **95.8%** |
| freeway cells stranded off it | **249 of 952** | **2** |
| `freeway ↔ freeway` broken seams | 40 | **14** |
| where two road classes meet | 129 | **34** |

**You can drive the interstate now.** You could not before.

The module was correct all along: handed `same=['S','W','E']` it builds east-west exactly
right. This one line threw the world's answer away before the module ever saw it. The
both-legs rule it was really about is kept, and only that — a caller that says nothing, or
says one leg, still gets a through-running cell exactly as before.

## AND IT TOOK FOUR FAILURES TO FIND, EVERY ONE OF THEM A GUESS

1. **A map fact.** Off two sampled cells. Wrong.
2. **The beltway's four corners.** Derived by reading the overmap. Built, run: the count
   changed by exactly zero. Reverted.
3. **"Does my sibling carriageway have a cross street."** Built, run: 40 → 199. Reverted.
4. **The same question asked symmetrically**, scanning the shared ribbon so both halves must
   agree. Built, run: 40 → 216. Reverted.

Attempts 3 and 4 were both about the **overpass decks**, because I had photographed a seam
and seen two carriageways whose bridges did not line up. **The photograph was real and the
conclusion drawn from it was still wrong** — the decks do not line up *because the road under
them is drawn sideways*, and I was fixing the symptom I could see instead of asking why.

## THE MEASUREMENT THAT ACTUALLY FOUND IT

Not another seam count. A **network**: turn the connector data into a graph, one node per
cell with any corridor, an edge wherever two cells' corridors overlap at their shared seam,
then connected components.

The very first run said: **214 separate road networks, 249 freeway cells cut off, and every
single one of them on row 13.** A pattern that obvious cannot survive being looked at.

**A COUNT IS NOT A LOCATION**, and that is what cost the four attempts. Every seam number I
had told me how bad it was and nothing about where to go. The network measure named a row.

It is worth noticing that attempt 4 moved the seam count and **did not move the network at
all** — which was the signal that the seams and the connectivity were not the same problem
and I had been chasing the wrong one for two turns.

## THE GATES

`street_contract_gate.js` is 21 checks now, with two that are about the whole map rather than
one edge:

- **THE VALLEY IS ONE ROAD NETWORK** — the share of road cells reachable from the biggest
  network, floored at 95.5% and only ever going up, so no future fix can quietly cut the map
  in half while every local seam still passes.
- **AND YOU CAN DRIVE THE INTERSTATE** — freeway cells stranded off the main network,
  ceiling 4, measured 2.

Ceilings ratcheted: cross-class 129 → **34**, freeway 40 → **14**, reach 700 → **642**.
Arterial and rail still hold at zero with no allowance. Road cell, walkable-land, drive
network, occupancy, sidewalk sanctity, district kit, tilespec and line colour all green.

## THE LESSON

**A FIX THAT IS NOT A SWEEP IS A FIX THAT WILL BE MADE AGAIN**, and this is the second time
this week that sentence has been the headline. The arterial's post-mortem for this exact line
is sitting in the gate that measures the freeway, and it took four wrong guesses and a
different kind of measurement to find the same line one module over.

When a post-mortem names a defect by its *shape* rather than its file, the work is not done
until `grep` has been run on the shape.
