# BOHEMIA — LANDLOCKED DISTRICT LAW (Paolo, 7/21/26, LOCKED)

## The law
Paolo, reviewing the valley aerial: "new rule, if there is an interior district not touching a
street it has to be a suburb or apt complex that has roads from another suburb/apt complex
touching the street, so the two districts' street touch... remember that for your seed
generation too."

Two parts, both machine-gated:

1. **TYPE.** A cell that does not directly touch a real street (no road-type neighbor — freeway,
   arterial, beltway, strip) may only be a **suburb-family** district (suburb / gated / estate;
   apartment complex is [PENDING Paolo, not yet built]) or bare undeveloped **desert** — no
   commercial, industrial, park, trailer, storage, or any other built type may sit fully interior.
2. **CONNECTIVITY.** A landlocked suburb/apt cell must gain street access by having its own road
   network physically connect, at the shared edge, through a neighboring suburb/apt cell that
   itself touches a real street (or itself relays further inward) — "the two districts' street
   touch."

## Grounding
Matches how real Sunbelt master-planned communities actually work (see the 7/21 Vegas-specific
research: Summerlin's village model) — interior tracts don't get their own arterial frontage,
they reach the street network through the neighboring subdivision's road, not by teleporting a
driveway onto a highway two blocks away.

## Implementation
- **Type half** — `engine/bohemia_overmap.js`, `proceduralDistrict()`: a `streetAdjacent` flag
  (one tile off a real mile-arterial line, `x%9===1||x%9===8` on either axis) now gates every
  non-suburb, non-desert roll (park/trailer/storage/industrial/commercial). A truly interior cell
  (`!streetAdjacent`) short-circuits straight to `DISTRICT.SUBURB`.
- **Connectivity half** — `engine/bohemia_world.js`: `rawStreetEdges(m,x,y)` (a real, no-default
  street-edge check, unlike `neighborStreets` which fakes `['S']`), and `buildLandlockConnect(m)`
  — a one-time BFS over the whole overmap, computed once per `world(seed)`, that finds for every
  landlocked cell the shortest chain of **same-family** neighbors out to a cell that truly touches
  a real street, then marks the connecting edge on BOTH sides of every hop. `plot(x,y)` unions
  `rawStreetEdges` with the computed relay edges before calling the district's own `generate()` —
  identical to `neighborStreets()`'s old behavior for any cell that already touches a real street
  (no regression), and a REAL relay instead of a blind `['S']` default for landlocked ones.
  Generalized beyond suburb-family: multi-cell blob types (downtown's rect, a farm/park blob)
  hit the exact same shape of problem one level up and relay through the same machinery, keyed on
  same-district-type adjacency (`familyOf()`).
- Gate placement stays centered (`n/2`) on whichever edge regardless of rotation (kit's
  `pedGate` / suburb's `denseFill`), so two neighbors that both open toward each other land on the
  same tile offset — the roads actually meet, not just both technically "have a gate."

## Known residual (reported, not hidden)
A handful of **isolated single-cell landmark types** (school/medical/jail/courthouse/
policestation/substation/chapel/cemetery/industrial/commercial/golf/park), each placed via its
own hand-tuned fixed rect in `skeleton()`/`layoutFromSeed()` rather than a same-type blob, can
still land 2+ tiles off a street with no same-type neighbor to relay through. Fixing each
landmark's placement individually is a separate pass through overmap.js's ~20 bespoke rects,
out of this session's scope. `gates/landlocked_gate.js` keeps this bounded (≤12% of landlocked
cells, measured ~5-6% across seeds) and prints the exact breakdown every run rather than
pretending the map is 100% clean.

## Enforcement
`gates/landlocked_gate.js` (registered in `bohemia_gates.py`): across 3 seeds, asserts
suburb-family landlocked cells relay-connect ≥92% of the time, the total landlocked gap (type +
connectivity) stays ≤12%, and every relay-connected cell's plot generates without throwing.
