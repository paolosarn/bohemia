# BOHEMIA — DISTRICT MERGE LAW (Paolo, 7/14/26)

## THE LAW (LOCKED)
Adjacent same-type overmap cells MAY work together as ONE merged plot:
- 2 touching residential -> one walled neighborhood spanning both grids
  (single perimeter ring around the union, NO wall between them).
- 4 touching residential -> one big tract (256x256 fine cells).
- Same for commercial (shared parking field + longer storefront runs)
  and industrial.
"MAY" = merging is not guaranteed: per-cluster seeded decision,
deterministic from the overmap seed. [PENDING Paolo: merge probability
default (starting at 60%), max cluster size beyond 2x2, whether quality
must match to merge.]

## REAL GROUNDING
This is literally Vegas fabric: master-planned communities span many
blocks behind one continuous wall; shopping centers share parking fields
across parcels. Single-parcel = the exception in the suburbs, not the rule.

## ENGINE CONSEQUENCE
- plotgen: generate(kind, seed, quality, {shape}) where shape = cluster
  rectangle (1x1, 2x1, 1x2, 2x2). Wall ring wraps the UNION. Gates on
  street-facing outer edges. Commercial apron spans the full frontage.
- bridge: clusterFor(overmap, x, y) detects the maximal same-district
  rect (cap 2x2), seeded merge coin, returns the cluster + which cell of
  it (so any cell queried renders its slice of the merged plot).
