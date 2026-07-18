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

## THE GATE (same turn, per the law of laws)
gates/street_connectivity_gate.js, wired into the suite as STREET CONNECT.
Three checks:
- NO DEAD-ENDS: no arterial dead-ends into an open lot (<=1 road neighbor, no
  real terminator beside it, not the edge). OPEN = {desert, suburb}; everything
  else is a legitimate street end.
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
