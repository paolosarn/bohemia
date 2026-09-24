# THE LIGHT IS NOT IN CLUSTERS (9/24/26, WORLD lane)

Rule 31's floor, the CLUSTERED POWER law (Paolo 7/14, LOCKED), rule 22 and rule
29. **Nothing shipped to a play surface** — rule 18 holds. The cook went to the
VOTE tab and it is drawn.

---

## 1. WHY THIS ROUND, AND WHAT I DID NOT CLAIM

My board row `[future city]` says *"waits for DYNASTY's two school rounds; claim
nothing here yet."* **I did not claim it.** Measured the blocker first, as rule
12 requires: DYNASTY's school round one **shipped** 9/23; `[the derive]`, round
two, is **still OPEN**. So the blocker is real, half of it, and the derive is
not mine to design.

But round one makes **four claims about my engine** and nobody has checked one
of them. Closing hole 1, the floor of a do-nothing future, it says:

> *"the same streets and the same lot lines, a third of the lots bare, green
> where houses were, **the power pulled back to the corridors that still pay, a
> small live core**, and people living in all of it. Every one of those is a
> thing our engine already draws: the layout is the streets, **CLUSTERED POWER
> is already the law that decides which corridors are lit**, and the grid
> already answers dark or live per cell."*

The map, the grid and the towns are this lane's. So that sentence is mine to
check, and it does not need the derive to exist.

## 2. *** THE LAW SAYS CLUSTERS. THE CODE ROLLS A COIN. ***

The CLUSTERED POWER law, his own words, locked 7/14 with *"I like the answers"*:

> Street lighting fails **by circuit**, not by lamp: one dead feeder or one
> stretch of stripped copper kills an entire run. **So outages/survivals are
> CLUSTERS, never alternating.**
> Act-1 live fraction: ~10-15% of lamps, **all in clusters**.
> **Every lit cluster is OWNED.**

The grid:

```js
const live = r() < litFraction;      // one independent coin, per feeder
```

**That is the definition of alternating.**

## 3. MEASURED, BEHAVIOURALLY, BECAUSE A SOURCE SCAN CANNOT TELL THE DIFFERENCE

```
seed 1337   432 lit cells in 178 SEPARATE BLOBS, biggest 12 cells
seed    7   391 lit cells in 158 SEPARATE BLOBS, biggest 13 cells
seed   42   422 lit cells in 154 SEPARATE BLOBS, biggest 14 cells
```

**The biggest lit thing in Las Vegas is twelve cells.**

And the decay test, which is the one that settles it. Take a lit cell and ask
what share of the street cells around it are also lit. Under an independent roll
that share equals the global fraction at every range:

```
                    range 1     range 6     global
seed 1337            35.0%       15.7%      12.2%
seed    7            33.6%       13.5%      11.3%
seed   42            37.3%       16.3%      11.9%
```

**Past one feeder the light is statistically indistinguishable from scatter.**
The clustering at range 1 is real but it is not the law: it is the feeder's own
length, because `buildCircuits` slices a street run into sixes, so six cells
light together and that is the whole of it. A code artifact, not an obeyed law.

## 4. AND THIS IS THE PART THAT BLOCKS RULE 31

**There is no core to pull back to.** Planned shrinkage means concentrating what
still works and letting the rest wind down. Thin a uniform scatter and you get a
thinner uniform scatter — the same rash, fainter. The floor rule 31 needs is
*"a small live core"*, and the valley has 178 of them, each the size of one
block.

DYNASTY's sentence is right about the LAW and wrong about the CODE, and nobody
could have known that without measuring it.

## 5. THE LAW, BUILT, SO THE FIX IS A SIZE AND NOT AN OPINION

Light spreads from a source along the wire — which is what a live substation
actually does — through touching feeders, until the valley reaches the law's own
fraction. **The only free number is how many sources, and it is derived, not
tuned: one per faction that holds ground**, which is the law's own *"every lit
cluster is OWNED"*. Measured: 18 outfits in his graph, 14 of them can hold
ground, so 14 sources.

```
             AS WE SHIP IT                  AS HIS LAW SAYS
seed 1337    432 lit, 178 blobs, max 12     425 lit,  11 blobs, max 104
seed    7    391 lit, 158 blobs, max 13     414 lit,  10 blobs, max 106
seed   42    422 lit, 154 blobs, max 14     425 lit,  10 blobs, max  83
```

**Same light. Sixteen times fewer pieces. A core nine times bigger. Not one
extra lamp**, and both sides inside his 10-15% band.

## 6. THE COOK, AND IT IS DRAWN

**THE VALLEY AT NIGHT.** `slices/vote/WORLD_THE_VALLEY_AT_NIGHT.png`

The whole 96×96 valley after dark, twice, 1:1, from the real generator and the
real grid. Left is what he plays. Right is his own law. The finding is a picture
and no number says it as fast.

Compared to the world before calling it done (DIST-03, CB-03, CB-06, TG-05,
AH-01):

- **DIST-03 / CB-06** — the valley's real shape does the composition. The
  mountains ring it, the freeway spine and the beltway are the only man-made
  lines readable from this height. Nothing is arranged; the generator put it
  there.
- **TG-05** — a dark surface reads by what breaks it. The ground is held to
  three near-black steps so every bright pixel is a lamp.
- **AH-01** — ordinary frame, one thing wrong. A city at night from above is the
  most familiar photograph there is. The wrong thing is that **the light is in
  the wrong shape for a city**: evenly spread over a valley with nobody in most
  of it. His own law already names the image the right panel makes possible —
  *"NETWORK territory kept eerily, perfectly lit, the Amalgamation's glowing
  empty streets."*

**TWO CUTS, AND THE FIRST ONE BROKE ITS OWN ARGUMENT.** I gave every lamp a
two-cell glow pool. 178 separate lamps each carrying a halo lay down far more
glowing pixels than 11 clusters do, so **the left panel looked brighter than the
right while carrying seven fewer lamps** — and *same light, different shape* is
the entire claim. Tight pools now, which is also the truer drawing: a street lamp
from that height is a point, not a bloom. The dead street grid was also two steps
too light and the whole frame read as graph paper.

**MAP LAW is not in the way.** Nothing here designs a layout. The map, the
streets and the feeders are the generator's and untouched. This is *which* of
them are lit, and his locked law already ruled that.

## 7. THE GATES

```
LIGHT CLUSTERS   new, 38/0, red three ways
```

Cluster the grid -> 8 red, and the message says *"somebody clustered the grid
and this gate must be re-aimed"* rather than just going red. Move the lit
fraction out of his band -> 11. Make the right panel merely brighter -> 1.

**AND TWO OF MY OWN CHECKS WERE WRONG BEFORE THE CODE WAS:** one read a wrapped
sentence in DYNASTY's record without allowing for the line break, and one read
`graph.factions` as an array when it is an object of 18, so `undefined >= 14` was
false and the gate reported that the number was not derived when the truth was
that I could not read the file. Both fixed, and the second now asks the pockets
module for the 14 holders instead of counting.

## 8. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One row, a picture: **THE VALLEY AT NIGHT**.

## 9. ROUTED

**TO DYNASTY**, for school round two, and this is the correction worth carrying:

> The floor's four ingredients are not all built. The streets are (measured last
> round: the layout is a pure function of the seed). The grid does answer dark
> or live per cell. But **CLUSTERED POWER is a law the code does not obey**, so
> the live core the Detroit floor is built on does not exist yet. The fix is one
> place and it is measured; the floor is still the right answer.

**TO WHOEVER LIFTS THE HOLD**, and it is one place, named:

`engine/bohemia_powergrid.js`, `powerMap()`, the `live` roll. Spread from a
source along touching feeders to the same fraction instead of rolling each feeder
alone. Source count derived from the faction roster, never typed. The gate holds
both states and the numbers either side.
