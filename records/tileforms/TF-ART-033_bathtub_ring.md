# TILE FORM TF-ART-033 — BATHTUB RING (the white band the lake left)

## A. IDENTITY
- NAME: Bathtub ring — the mineral band on the rock marking where the
  water used to be
- FAMILY/SET: DEAD GROUND — sibling of the dry beds (TF-ART-025) and
  the riprap (TF-ART-023) in the landform-ground family; the ring is
  deposited ON the riprap's own rock and sits one value step ABOVE the
  bed it borders.
- THE JOB, ONE SENTENCE: 108,559 ground cells at the water and dam
  districts (plus 1,274 structure cells at the intake) of the most
  photographed drought mark on earth draw the generic fallback.

## B. WHY
- DEMANDED BY: the 8/28 walked-world census — 'bathtub ring' was the
  largest remaining name with NO approved art after Phase 2E wired
  every family that had one.
- WHAT LOOKS BROKEN TODAY: the shrunken lake's shoreline — the single
  image that says "the water is gone" — is indistinguishable from the
  ground beside it.
- MEASURED 8/28 on the walked world: 'bathtub ring' x108,559 (water,
  dam), 'bathtub ring / roof' x1,274 (intake, structure).
- SHOPPING CHECK: no approved bank holds a mineral band; the crust
  pale exists (TF-ART-018 kerb pool) and the under-rock exists
  (TF-ART-023 riprap pool), so the cook harvests both and paints no
  new pool.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode); at MAP zoom the
  ring reads as the pale line around the dead lake, which is correct.
- DISTRICT FAMILIES: water, dam, intake.
- LAYER: ground (the shoreline band); the intake's 'bathtub ring /
  roof' is structure and wears the same crust through c.sPool.
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: exposed lakebed, cracked silt, shallow water, the
  intake works, riprap.
- EDGE CONTRACT: self-seamless along the band — the stand lines sit at
  CANONICAL rows shared by every variant, wander +/-1 mid-tile and are
  PINNED back to the canonical row at both edges, so any two ring
  cells join without a jump; two variants per axis break the period.
- NEVER BESIDE: nothing wet-looking — the whole point of the ring is
  that the water left.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; the ring never reads wet.
- LIT/UNLIT: unlit always (LIGHT=TERRITORY).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell, full-cell opaque ground tiles.
- VIEW: flat ground plane in the world's three-quarter 45.
- PALETTE: harvested only — the crust is the approved kerb pale lifted
  one step (carbonate and caliche are the same mineral family), the
  worn holes are the approved riprap rock. No purple.
- LIGHT: one sky light; no self-light.
- SHADOWS: a one-value rock shadow inside the worn holes only.
- SCALE ANCHORS: stand lines a handful of pixels apart — successive
  seasonal stands of a lake dropping for thirty years; worn holes
  2-6px, boulder-scale breaks in the crust.
- WEAR LEVEL: thirty years of sun and no water; the crust is chalky,
  cracked through in patches, never glossy.
- VARIANTS: br_h_0/1 (band running E-W), br_v_0/1 (N-S), hashed per
  cell; the axis follows the kit's own run, read the same way the
  channel bank reads its slope.
- CRAFT: stand lines WANDER +/-1 in 3-5 cell steps with per-step
  jitter, never a fixed 2 (the 8/28 loc-part lesson) and never ruled
  straight (8/1); worn holes are off-shape clusters, no dot stipple;
  14 deliberate one-pixel crust pits per tile (8/25 clause 2);
  deterministic per variant.

## F. THE CAPTION
```json
{
  "id": "TF-ART-033",
  "name": "bathtub ring - the white mineral band the lake left as it dropped",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["water", "dam", "intake"],
  "best_time": "both",
  "best_location": "the shoreline band between the old high-water rock and the exposed lakebed",
  "place_next_to": ["exposed lakebed", "cracked silt", "shallow water", "riprap", "intake works"],
  "never_next_to": ["anything wet-looking", "any district outside the three named"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless - canonical stand rows shared across variants, wander pinned at both tile edges; two variants per axis",
  "tags": ["water", "dam", "intake", "drought", "lakebed", "shoreline"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (kerb_return_ne — the crust is its pale pool lifted one step, so the
  ring sits in the same value family as every kerb it meets) and
  banks/tileforms/TF-ART-023_CANDIDATES_8_25_26.json (rip_0 — the rock
  in the worn holes IS the rock the wash is armored with).
- NAMED OUTSIDE REFERENCE: the shoreline bands in Kenshi's dead lakes
  and the Lake Mead sections of Fallout: New Vegas both read the ring
  as A PALE BAND WITH FAINT PARALLEL STANDS and no outline — one value
  step up from the bed, exactly this tile's grammar.
- REAL-WORLD GROUNDING: Lake Mead's ring is calcium carbonate left on
  the canyon rock as the lake dropped ~170 feet — stark pale against
  the varnished rock, visibly banded by successive stands, and it does
  not wash off; the measured tiles hold the same relationship (ring
  mean value 150.5 vs bed 117.5, a full step brighter).

## H. DON'T WANT
- NOT white-out — the crust is chalky pale, never paper white.
- NOT ruled stand lines — they wander, pinned only at the edges.
- NOT dot stipple (banned 8/21); worn holes are clustered off-shapes.
- NOT wet — no shine, no reflection, ever.
- NOT a second mechanism — the axis read reuses the kit-run method the
  channel bank and the embankment already use.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] Edge join proven on a rendered h0|h1|h0 strip before wiring
- [x] ON THE REAL SURFACE: verified on foot at the water district
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/30/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-033_CANDIDATES_8_30_26.json (4 tiles),
  cook tools/tfcook/TF-ART-033_bathtub_ring_cook.py, wired on the
  WALKED surface (the migration's pool file + the ground name table's
  axis branch; the intake's structure name rides c.sPool).
  | REQUESTED BY: ART lane (the 8/28 census, board row 107's last
  leftover with no art) | DATE: 8/30/26 | PRIORITY: MED
- BOARD ROW #: 107 | VERDICT: —
