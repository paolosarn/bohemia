# BOHEMIA ADDENDUM — NO-STREET-BREAK LAW (Paolo 7/18/26, LOCKED)

Ruled while looking at the first aerial city map: "there should really be no
breaking in any of the street layouts... a couple of the streets are broken
off from each other and that was from the previous generation... unless it is
the strip and its casinos that's gonna be really big architecture."

## THE LAW
The overmap surface-street grid runs CONTINUOUS. No street dead-ends into an
empty buildable lot. A street may legitimately END only at something real:
the map edge, water, mountain, wash, the freeway, OR any claimed
big-architecture landmark (the Strip and its casinos, estates, malls, solar
fields, gated communities, the airport, downtown, etc.). Ending into OPEN
desert or suburb — a street just stopping in nothing — is the banned "break."

Big architecture (the Strip and casinos above all) is the ONLY thing allowed
to interrupt the grid, because it is a mass unto itself.

## WHAT CHANGED (engine/bohemia_overmap.js)
1. The old `half` truncation that let extra local streets dead-end mid-block
   is REMOVED — every surface street now runs through, arterial to arterial.
2. A STREET DEAD-END PRUNE post-pass runs LAST (after the freeway sweep and
   the parallel-side-street pass, the two passes that used to leave streets
   dangling): it iteratively returns any arterial stub whose only non-road
   neighbors are OPEN (desert/suburb), with <=1 road neighbor and not the map
   edge, back to desert — until the grid has zero breaks.

Result on seed 12345: 56 breaks -> 0. 2503 arterials, mile grid intact.

## SECOND PASS (Paolo 7/18/26, aerial map: "look at all these streets that are
## not connected to each other. That's not how it's gonna be.")
Zero dead-ends was not enough — the grid was still FRAGMENTED. Two more root
causes, both fixed:
1. COLLECTORS WERE PER-BLOCK, not per-strip. Each mile block picked its own
   collector offset (hash of bx,by), so adjacent blocks' collectors were off by
   a cell and never lined up — a grid of streets that don't meet. Now the
   collector offset is per-STRIP (one column-pick per mile-column across the
   whole map, one row-pick per mile-row), so every collector runs unbroken the
   full length of the valley. The per-block "extra local street" is removed.
3. ORPHAN ROAD ISLANDS. The dead-end prune heals stubs into empty lots, but
   leaves arterial fragments BOXED IN by real terminators (an estate, the dam,
   a jail, rail, water, the mountain ring, the map edge) — they have no OPEN
   neighbor so the stub prune never touches them, yet no road reaches them: a
   street with no way in. New STREET ISLAND PRUNE post-pass (runs after the
   dead-end prune): label every road cell's connected component, keep the
   LARGEST (the main grid), demote every orphan ARTERIAL in any other component
   back to desert. Only arterials are pruned; freeway/strip/downtown/beltway are
   masses of their own and stay put. On seed 12345 this cleared 10 islands to 0.

## THIRD PASS (Paolo 7/18/26, circled the aerial map: "even monuments... would
## just be in their big ass plots not breaking any city streets")
Still not clean. ROOT CAUSE: in skeleton(), the landmark rects are stamped
BEFORE the arterial/collector lines, so ANY landmark that overlapped a street
cell ERASED it — leaving a stub. That was every break Paolo circled: a school,
a mall, a fire station sitting ON a street and cutting it.

THE RULE (LOCKED): the ONLY thing allowed to break the surface-street grid is
BIG ARCHITECTURE — real physical masses (mountain/water/freeway/rail/wash/the
mines), genuinely huge installations (airport/airbase/speedway/prison/datafort/
arsenal/landfill/stadium/ballpark/convention/waterpark), and the blessed
megablocks (the Strip and its casinos/luxor/sphere/highroller/strat). EVERY
other landmark — school, mall, gated community, golf course, medical campus,
downtown, fire station — is normal city fabric that sits IN its plot, with the
streets running around (and through) it, unbroken.

TWO ENGINE CHANGES (engine/bohemia_overmap.js):
1. GRID RE-ASSERT post-pass: recompute the full street predicate (mile
   arterials + per-strip collectors) and punch ARTERIAL back through every cell
   a SOFT landmark had overwritten. BIG masses keep their cell. Result: streets
   go up 2258 -> 2335 (the erased segments restored).
2. DEAD-END PRUNE rewritten: a street may end ONLY at another road, a BIG mass,
   or the map edge. A nub with <=1 road neighbor and no BIG mass beside it =
   a stub poking into fabric -> pruned. True stubs: 153 -> 0. The 124 remaining
   dead-ends all terminate AT big architecture (the mile spine meeting a
   mountain/lake/casino), the one legit break.

DOWNSTREAM (expected, not a regression): adding 77 arterials re-rolls the power
grid's 12%-live circuit lottery, so the V11 lamp slice relit one block. The V11
lamp factory's lit-art path (never finished) is now wired: a live cell shows the
approved lamp body + a runtime amber head-glow (rgb-only, per the light law, no
new baked art). The demo is now robust to any future power reshuffle.

## THE GATE (same turn, per the law of laws)
gates/street_connectivity_gate.js, wired into the suite as STREET CONNECT.
Three checks:
- NO DEAD-ENDS: a street may end only at another road, a BIG mass, or the map
  edge. A nub with <=1 road neighbor and no BIG mass beside it (it stops in
  fabric — desert/suburb/a soft landmark) is a break. The gate's BIG set mirrors
  the engine's exactly, so a monument breaking a street fails the gate.
- ONE CONNECTED GRID: flood-fill from a mile arterial across all road cells;
  every road cell must be reached. Any island = "streets not connected to each
  other" and the gate fails.
- MILE GRID INTACT: >= 2000 arterial cells survive (the spine is not over-pruned).

## NOTE ON THE CUL-DE-SAC CANON
This does NOT conflict with VEGAS_NEIGHBORHOOD_ANATOMY (suburbs are
curvilinear, loops + culs, discontinuous). That character lives INSIDE the
suburb PLOT (the fine-tile interior layout, a finer layer, still [PENDING
Paolo]). The overmap arterial grid — the connective tissue between plots — is
the mile grid and it stays whole.
