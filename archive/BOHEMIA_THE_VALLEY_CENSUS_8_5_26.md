# THE VALLEY CENSUS
**8/5/26. WORLD lane. 9,216 cells counted. Machine: `gates/valley_census_gate.js`,
tool: `tools/bohemia_valley_census.js`.**

> "know what comes after" — Paolo, 8/4/26

---

## WHY I COUNTED INSTEAD OF GUESSED

Every answer to *what comes next* in this lane has come off a backlog file somebody
wrote weeks ago. So I asked the shipped world model directly: for all 9,216 cells of
the valley, what district is it, does a plot of it generate, is anything standing on
it, and can you go inside.

**Nothing throws. Every building in the valley yields a real, reachable interior. Zero
failures on all three seeds.** That part of the spine is done and it is now measured
rather than asserted.

## WHAT THE VALLEY IS MADE OF

| | share | |
|---|---|---|
| **roads and terrain** | **55.4%** | arterial 2,423 · freeway 995 · mountain 895 · desert 545 · rail 90 · water 78 · wash 37 · interchange 16 |
| **housing** | **31.6%** | suburb 2,610 · apartment 123 · estate 48 · gated 18 · trailer 10 · town 9 |
| everything else | 13.0% | commercial 370 · solar 303 · resort 120 · farm 88 · strip 81 · airfields 102 · and 55 more types |

Half the valley is the ground between things. **A quarter of it is one type: the
suburb** — which is exactly why the suburb drawing 45% of itself in an uncoloured
code 0 yesterday mattered as much as it did.

## THE FINDING: 22 TYPES PUT NOTHING ON THE GROUND

A plot generates and has no building on it at all. Sorted into three piles, because
they are three completely different situations and lumping them was hiding the third:

**FLAT BY FORM — 10 types, 5,079 cells. Correct, and each carries its reason.**
A freeway has no building on its travel lanes. A ridge has nothing up there. A wash is
cut *below* grade and its way in is the tunnel mouth. The two airfields are here on
their own written ruling: their terminal and hangars are drawn but expose no footprint
because **interiors there are a CITY-lane item**, said so in `bohemia_airfield.js` long
before I looked.

**RESERVED — 2 types, 86 cells.** The Strip and the Fremont casino core. Paolo's hand
by law, never auto-generated. Flat on purpose. Not debt, canon.

**FLAT DEBT — 12 types, 29 cells. THIS IS THE ACTUAL HOLE.**

> basin 8 · datafort 6 · reclaim 4 · reservoir 3 · intake · gypsum · granary ·
> fueldepot · arsenal · quarry · radio · pumpstation

Twelve **named places** the overmap deliberately sites — a quarry that carves the south
approach hills, a granary on the rail line, the Lake Mead intake, the tank farm, the
data fort inside the beltway, the detention basins that catch the flash floods. Every
one of them is placed with real geography behind it, and every one of them generates
**empty ground**. They are not exempt and they are not finished. They are unbuilt.

**It is a ratchet now.** The list may only shrink, a type drops off the moment it puts
a building down, and the gate fails if anything new goes flat or if a debt entry stays
listed after it has been built. 29 cells is 0.3% of the valley — small, and now it
cannot quietly become 0.3% forever.

## AND THE CENSUS CAUGHT ITSELF DOING THE HOUSE BUG

Version one sampled every third cell of the map. That is a stride over **geography** —
and **21 district types are smaller than the stride**, so they were sampled zero times
and printed a dash. A dash reads exactly like *nothing to see here*. Every rare type in
the valley was invisible in the census that exists to find rare types.

**Seventh sighting of A VALUE PASSED BY HAND WHERE A VALUE COULD BE DERIVED.** The
sample size was mine; it should have been derived from the thing being sampled. It
draws per type from each type's own cell list now.

**And a second one, same shape:** the first gate ran one seed. `radio` and
`pumpstation` do not exist at all on seed 12345 and are present on the other two. **A
census of one map is a census of one map.** Three seeds now, and the two extra types
only exist in this record because of it.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
