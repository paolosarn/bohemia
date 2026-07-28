# TILE FORM TF-CITY-001 — THE ROOF EDGE FAMILY (hips, ridge, eave) FOR THE
# APPROVED HOUSE SKINS

## A. IDENTITY
- NAME: The edges of a house roof — the four cut corners, the peak line, and
  the overhang lip
- FAMILY/SET: HOUSE SKIN ROOF family, edge half. One drawing job: 4 hips
  (TL/TR/BL/BR) + 1 ridge + 1 eave, cooked once per approved roof material so
  each of Paolo's 14 approved roof skins gets its own matching set.
- THE JOB, ONE SENTENCE: this tile family exists so that a house wearing his
  approved roof skin stops having an ORANGE STRIPE down every side and across
  its peak, because right now only the flat middle of the roof is skinned and
  every edge falls back to the frozen target set's terracotta.

## B. WHY
- DEMANDED BY: backlog 0S, filed 7/28 SEEN-AND-LEFT-ALONE, [PENDING Paolo];
  the HOUSE SKIN verdict itself (records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt,
  30/30 UP) — the skins were approved as the house's material and they cannot
  be that if they only cover the middle; STOP PRODUCING law is why this became
  a FORM instead of a fourth iteration in the same turn.
- WHAT LOOKS BROKEN TODAY: measured in the run's own bodyTile()
  (slices/BOHEMIA_RUN_SLICE_7_26_26.html) — the roof cap resolves to
  `roof_hipTL/TR/BL/BR`, `roof_ridge`, `roof_eave`, `roof_slope`. The 7/28
  house-skin patch maps roof_slope/roof_eave/roof_ridge onto the ONE approved
  roof pool and leaves the four hips entirely untouched, because the pool has
  no corner geometry to map them to. Result on screen: a brown shingle roof
  with a terracotta-orange border wherever the mass turns. Every house in the
  valley has it.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md row HOUSE
  SKINS — opened the bank (banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt) and
  listed all 30 keys. The roof half is 14 tiles: roof_shingle_0..5,
  roof_gravel_6..7, roof_stile_terracotta_21/22, roof_stile_desertbrown_23/24,
  roof_stile_graybrown_25/26. **Every one of them is a FIELD tile.** There is no
  hip, no ridge, no eave, no gable in the bank. Near-misses checked and
  disqualified: the STARTER TILESET's own roof_hip*/ridge/eave (that IS the
  fallback causing the bug — it is the target set's material, not his skins);
  the HD pack's roof packs (no per-material edge families, and the ones that
  exist are gable/asphalt in a different value band); roof_parapet and
  roof_deck (flat-roof commercial pieces, wrong building type). Nothing in the
  index covers a per-material roof EDGE.

## C. WHERE
- SURFACE + TAB: RUN (the walk — this is where Paolo sees it) and CITY (human
  mode building tops). At map zoom the roof is flat colour, no edge read.
- DISTRICT FAMILIES: suburb first (2,832 residential cells is the biggest
  building population in the valley), then any pitched-roof district —
  trailer, apartment, chapel, firestation, farm house. NOT flat-roof
  commercial/industrial (they use roof_parapet).
- LAYER: structure (it is the top of a solid mass, drawn as part of the
  building stack, not a separate overhead pass)
- SOLID? yes (it is the building) — ENTERABLE? no (you enter through the door
  or the garage; the roof is not a portal in act 1)
- MUST SIT BESIDE: roof_slope of the SAME material (the field it edges);
  wall_under_eave directly below the eave course; sky/yard beyond the hips.
- NEVER BESIDE: a roof edge of a DIFFERENT material on the same house (one
  house = one skin, per the 7/28 skinImg seed — mixing materials mid-roof is
  the exact bug this form kills); roof_parapet (a pitched roof and a flat
  parapet never share a mass).
- EDGE CONTRACT: WANG-16 edge set. The six pieces are the corner/edge cases of
  a rectangular mass, so the acceptance test is the SEAM RING HASH, not a wrap
  test: each piece's interior-facing edge must hash IDENTICALLY to its
  material's roof_slope edge (the constitution's seam contract, families listed
  in records/target/BOHEMIA_VISUAL_CONSTITUTION.json).

## D. WHEN
- ACT: 1
- BEST TIME: both. Nothing self-lights. At night the whole roof darkens under
  the ambient pass; the ridge keeps the last of the light because it is the
  highest thing on the mass.
- WEATHER STATES: sunny baseline; cloudy needs no change (the wash handles it);
  RAIN-WET wants a value-shifted variant on the same geometry, and the eave is
  the one place rain reads (the drip line), so the wet eave may darken the
  course below it — value only, no new shape.
- LIT/UNLIT: none. Nobody owns a roof's light. (LIGHT=TERRITORY: a roof inside
  a powered cluster gets its light from the cluster's own pass, not from art.)
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44 x 44 px per tile, matching the frozen starter tileset's
  cell_px (banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt). Footprint 1 tile
  each; 6 tiles per material. 14 approved roof materials = 84 tiles total, but
  it is ONE drawing job because every set is the same six shapes.
- VIEW: 45-degree world view. A hip is a TRIANGULAR PLANE turning away from
  you, so its shading is a plane rotation, not an outline. The ridge is the
  brightest line on the house because it is the highest sky-facing surface.
  Never a side-on scroller gable.
- PALETTE: constitution ceiling (80,000 corpus colours, currently 46,082 —
  headroom exists but a 6-tile set must not eat it). Value band: **top**
  (mean 110.2, lo 72.8, hi 137.4). The ridge sits at the top of the band, the
  eave at the bottom (it is the piece in its own shadow).
- LIGHT: upper left, shadows down and to the right — one direction, measured
  and frozen. NO black keyline (constitution max near-black 0.06, target
  measures 0.029). NO dither (max alt energy 0.1123, target 0.039).
- SHADOWS: none baked. The eave's cast shadow onto the wall below is the
  ENGINE's runtime shadow pass, not pixels in this tile (shadow_note in the
  starter tileset is explicit: a cast shadow cannot live in a tile).
- SCALE ANCHORS: the 2-tile door and the 2-tile garage bay already in the
  starter set. A real Vegas tract eave overhangs ~18-24 inches, which at 44px
  per ~0.75m cell is a THIN lip, roughly a fifth of the tile — not a deep
  chalet overhang.
- WEAR LEVEL: ten years with no maintenance. Concrete tile does not rot, it
  CRACKS and slips: individual tiles missing at the hips (the hips are where
  the wind gets under them), the underlayment showing black through the gaps,
  ridge caps knocked out of line. Asphalt shingle roofs lose granules and go
  chalky-pale before they curl. No moss, no green, ever — this is the Mojave.
- VARIANTS: one edge set per approved roof material (14 sets). Same six
  shapes, different material = colorway, so it is ONE form per
  STRUCTURE-NOT-COLOR. A gable end is a DIFFERENT silhouette and is NOT in
  this form.

## F. THE CAPTION
```json
{
  "id": "TF-CITY-001",
  "name": "roof edge family (hips, ridge, eave)",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["suburb", "trailer", "apartment", "chapel", "firestation", "farm"],
  "best_time": "any",
  "best_location": "the perimeter cells of any pitched roof mass",
  "place_next_to": ["roof_slope (same material)", "wall_under_eave", "yard", "sky"],
  "never_next_to": ["roof edge of a different material on the same house", "roof_parapet"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["roof", "structure", "house-skin", "edge", "suburb"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt — the 14
  approved roof field tiles ARE the colour truth. Each edge set is cooked FROM
  its own field tile, so the acceptance test is that they read as one material.
  Secondary anchor: the frozen CBB target screen's roof_hip*/ridge/eave for
  the SHAPE (their geometry is correct; only their material is wrong).
- NAMED OUTSIDE REFERENCE: Project Zomboid's roof edge tiles for the exact
  problem this solves — its per-material hip/ridge/eave sets are why its houses
  read as houses from a 45 view instead of coloured rectangles. Take the
  STRUCTURE of its edge families, never its palette or its outline weight.
  Secondary: Graveyard Keeper's roofs for how a ridge line carries the eye
  along a mass at this zoom.
- REAL-WORLD GROUNDING: Las Vegas tract housing is dominated by CONCRETE TILE
  in HOA subdivisions (Summerlin, Green Valley, the whole 1990s-2000s build-out)
  with asphalt shingle surviving mostly in older non-HOA neighbourhoods near
  downtown and North Las Vegas. Concrete "S-tile" and flat-profile tile roofs
  are almost always HIPPED, not gabled, in those subdivisions — which is
  exactly why the run's generator produces four hips per house and why this gap
  is visible on every single home. The Vegas failure mode is specific and
  documented: 1990s builders installed partially-cured "green" tile during the
  boom-era shortages, and thirty years on those roofs crack under foot and
  shed tiles. That IS our wear level, and it is real, not invented.

## H. DON'T WANT
- NOT the current bug: no terracotta-orange edge on a brown or grey roof. The
  ORANGE STRIPE is the kill condition.
- NOT a black keyline separating hip from slope. The turn of the plane is a
  VALUE STEP (constitution outline rule) — that is the whole point of the 45
  law.
- NOT a deep alpine overhang. A Vegas eave is a thin lip; a fat overhang reads
  as a ski chalet and kills the desert.
- NOT green, ever. No moss, no algae, no weathering-toward-green. (PURITY law
  also: no purple anywhere near this.)
- NOT clean and new. A ten-year-dead roof is not a showroom roof.
- NOT a gable. If the mass wants a gable end that is a separate form with a
  separate silhouette (STRUCTURE-NOT-COLOR: a new shape is a new ask).

## I. ACCEPTANCE
- [ ] Seam ring hash: each piece's interior edge hashes identically to its own
      material's roof_slope (constitution seam contract)
- [ ] Palette ceiling + **top** value band (110.2 mean, 72.8-137.4) + one-light
      (upper left) + no-keyline + no-dither checks green
- [ ] Squint test: at walk zoom the roof must read as ONE material, edge to
      edge — the failure being fixed is exactly a squint-test failure
- [ ] 3x3 TILED PROOF SHEET per material, plus a WHOLE-HOUSE proof (a full
      rectangular mass with all four hips, ridge and eave assembled)
- [ ] ON THE REAL SURFACE: screenshot of a suburb block on THE RUN wearing it,
      beside today's orange-striped render for contrast. Not the CITY tab —
      Paolo plays the run.
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (measured 7/28 from the run's own
  bodyTile + the skin bank's 30 keys) | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 60 | VERDICT: —
