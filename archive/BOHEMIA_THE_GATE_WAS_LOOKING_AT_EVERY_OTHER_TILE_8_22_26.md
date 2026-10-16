# THE GATE WAS LOOKING AT EVERY OTHER TILE, AND A DRIVEWAY IS ONE TILE WIDE

**8/22/26 — WORLD lane, second pass. The reachability sweep sampled a shared boundary at
stride 2, so it could not see a crossing narrower than two tiles. Three neighbourhoods were
reported sealed that a player can walk straight out of. That is the sixth ruler this week.
Fixed, and the twenty-seven cells that are genuinely sealed are now named one by one.**

---

## THE RULER

`walked_surface_gate`'s `crossable()` walked a shared cell boundary with `i += 2` — every
**even** offset, half the boundary never looked at.

A suburb's street-facing edge has **seven walkable tiles out of 128**. That is the entrance.
The block wall is the other 121. Whether those seven land on even indices is luck.

Measured, at full resolution, on the five cells the sweep called sealed while they sat
directly on a real arterial:

| cell | shared walkable tiles | at index | verdict |
|---|---|---|---|
| 16,30 | 1 | **67** | connects. Gate said sealed. |
| 91,30 | 1 | **61** | connects. Gate said sealed. |
| 58,70 | 1 | **67** | connects. Gate said sealed. |
| 73,30 | 0 | nearest 1 apart | genuinely sealed |
| 77,34 | 0 | nearest 1 apart | genuinely sealed |

61 and 67 are both odd. The gate never looked at either.

Stride 1. **82.6% → 93.1% was yesterday's relay; 93.1% → 93.2% is the ruler telling the
truth.** +3 cells that were always walkable and always reported as prison.

FIX THE RULER, NEVER THE TARGET (8/1). A sampler that steps over half the boundary cannot
see a one-tile crossing, and a one-tile crossing is what a driveway *is*.

## THE TWENTY-SEVEN THAT ARE REALLY SEALED

Not a number this time. Every one, with the mechanism measured at tile level.

### A. RINGED BY TERRAIN — 10 cells. **CORRECT, NOT A DEFECT.**

```
5,0 6,0 6,1 6,2   desert    NW corner, mountain on three sides, a solar farm on the fourth
83,2 83,3 92,8    estate  } NE corner, mountain bowls
89,9 92,9         desert  }
5,53              gypsum    mountain on ALL FOUR sides
```

A gypsum quarry in a mountain bowl has no road out because there is nowhere for a road to
go. Carving one would be inventing geography. The relay's third pass carves a spur through
**desert**; these are ringed by rock, and that is the right answer.

### B. APERTURE MISMATCH — 13 cells. **THE REAL BUG.**

Both sides open a gate on the correct shared side. The gates land in different places along
it and never meet. The relay speaks in **sides**; connection happens at **tiles**.

```
56,29 57,29 56,30 57,30  railyard ↔ suburb   gap 38, 39
78,29 79,29 78,30 79,30  farm     ↔ farm     gap 11, 12
74,56 74,61              farm     ↔ farm     gap 29
56,34 57,34              warehouse↔ warehouse gap 83
7,83                     suburb   ↔ farm     gap 11
```

Where the openings actually sit, measured as index runs along the shared edge:

```
farm 78,29 bottom  78-82        farm 78,30 top      61-67
? 56,33 bottom     105-111      warehouse 56,34 top 16-22
? 74,55 bottom     78-82        farm 74,56 top      45-49
suburb 56,28 bottom 61-67       railyard 56,29 top  105-109
```

**61-67 is the convention.** `pedGate()` in the district kit writes `Math.round(n*0.5) ± 3`
and the suburb's `punchGate()` writes `Math.round(W*0.5) ± 3`. Same midpoint, seven tiles,
independently. Any two districts that both use it meet by construction — which is why the
whole valley works.

The offenders are at 19, 47, 80, 107, 108. Those are **cluster districts** — farm,
warehouse, railyard — whose adjacent cells are laying out *independently* instead of as one
blob, so the seam does not line up even between two cells of the same farm. That is exactly
the defect world.js records as fixed on 8/19 for five other types: *"These five lay out in
VALLEY coordinates against the bounds of the whole blob and each cell copies its own window,
so the seams line up by construction."* Farm, warehouse and railyard did not get it.

**That is the next job — and I wrote "an existing mechanism to copy" and then went and
checked, which changed the answer.** Both halves, measured:

- `CLUSTER_KIT = {airport, airbase, convention, prison, dam, minigp, fort}` on the page.
  Farm, warehouse and railyard are not in it, exactly as predicted.
- **Adding them to that list does nothing.** `grep -c bounds` on `engine/bohemia_farm.js`,
  `bohemia_warehouse.js` and `bohemia_railyard.js` returns **zero**, all three. The
  generators cannot read the bounds the list would begin handing them.

So it is a real change to three generators — lay out in valley coordinates against the blob
bounds and have each cell copy its own window — plus each one's gate and dossier.
`engine/bohemia_airfield.js` is the shape that already works. A turn's work, not a patch,
and worth saying out loud before somebody spends that turn trying the one-liner.

### C. A BUILDING ACROSS THE MOUTH — 2 cells.

`73,30` and `77,34` are suburbs fronting a real arterial. Their seven-tile entrance is
walkable. The arterial's sidewalk is walkable along its whole edge **except** exactly the
seven tiles facing that entrance:

```
  i   suburb 73,30 west edge   arterial 72,30 east edge
 60   no                       WALK
 61   WALK  ┐                  no    ┐
 ...  WALK  │ the entrance     no    │ a solid mass, artPool 'hroof', walk:false
 67   WALK  ┘                  no    ┘
 68   no                       WALK
```

Both modules put a feature at the midpoint of the same edge. The neighbourhood opens there.
The street puts a building there. **The one place you can leave is the one place that is
walled.** The three cells in the ruler table above survive only because a rounding
difference shifts the street's mass to 60-66 while the gate is 61-67, leaving tile 67 open
on both sides. One tile of luck is the whole margin between a working neighbourhood and a
sealed one.

The fix is convention-shaped, not negotiation-shaped: the midpoint seven tiles of a street's
edge are where **every** district's gate is, by law, so a street may not put a mass there.

### D. A WALLED PERIMETER — 2 cells. **ARGUABLY CORRECT.**

`84,2` and `89,3`, estates whose shared edges with the neighbouring estate and solar farm
have **zero** walkable tiles on either side. A walled estate that does not open onto its
neighbour is GATED IS RICH working as ruled. Left alone deliberately.

## THE SCORE

```
                      8/21     after the relay    after the ruler
reachable on foot     82.6%        93.1%              93.2%
sealed built cells      541           30                 27
of those, housing       257           11                  8
genuinely defective       —            —          15  (B: 13, C: 2)
correct-as-built          —            —          12  (A: 10, D: 2)
```

## WHAT THIS TURN ACTUALLY BOUGHT

Three cells, and the reason the number can be trusted. A gate that reports a walkable
neighbourhood as a prison is worse than no gate: it hides real failures inside noise, and it
would have sent the next session hunting a bug in three districts that never had one.

The remaining fifteen are two named mechanisms with existing machinery to copy. Nobody has
to re-derive any of this.
