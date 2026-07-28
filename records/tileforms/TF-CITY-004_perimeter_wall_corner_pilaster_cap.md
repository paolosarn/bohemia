# TILE FORM TF-CITY-004 — THE PERIMETER WALL'S CORNERS, PILASTERS AND CAP

## A. IDENTITY
- NAME: The pieces that make a block wall turn a corner, stand up, and stop
- FAMILY/SET: SUBURB BORDER WALL family, joinery half. One drawing job: outer
  corner, inner corner, pilaster (the thickened column), end pillar, and the
  cap/coping course that finishes the top of a run.
- THE JOB, ONE SENTENCE: this exists because Paolo's 13 approved suburb border
  walls are all STRAIGHT RUNS, and a wall that closes a neighbourhood turns a
  corner at every plot, so today the wall just butts into itself and dies.

## B. WHY
- DEMANDED BY: the WALL TAXONOMY law (perimeter walls and building walls never
  share a pool) — the corner has to come from the PERIMETER pool or the law is
  broken the moment a wall turns; Paolo 7/28, verbatim, on the pool itself:
  "BRO IN THE FILES THERE IS LIKE SO MANY APPROVES SUBURBA BORDER WALLS FOR
  THE WALLS CLOSING THE SUBRUB NOT FOR HOUSES"; the THREE-TILE WALL addendum
  (7/27) which made wall HEIGHT a real property and therefore made a wall TOP a
  real surface; ONE WALL PER COMMUNITY (7/28), which seeds one variant per 4x4
  plot and so guarantees long uninterrupted runs that a corner must match.
- WHAT LOOKS BROKEN TODAY: measured by opening the bank.
  banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt holds 26 entries = 13 keys
  (W26-W37 + WB4) x 2 colorways (tan / original). Every entry is a straight
  field tile. The run's drawPerim() picks one per 4x4 plot and lays it on every
  code-4 cell regardless of the wall's direction or whether the cell is a
  corner, so a wall that turns shows the same face on both legs with no
  joinery — and the wall's top edge is just where the tile stops. In
  scratchpad x_street.png the whole perimeter reads as a flat grey stripe.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md row SUBURB
  BORDER/PERIMETER WALLS — opened, all 26 entries enumerated, none is a corner
  or a cap. Adjacent banks checked and disqualified:
  BOHEMIA_WALL_CANDIDATES_POOL_7_17_26.txt (the 47 rejected candidates —
  REJECTED FOR PERIMETER and reserved for act 3 by Paolo, so unusable by
  ruling, not by taste); BOHEMIA_WALL_SEAMLESS_SET_7_10_26 and
  BOHEMIA_WALL_VARIANT_BANK_7_10_26 (pre-verdict pools, superseded by the 7/14
  picks); the STARTER TILESET's wall_end_l/wall_end_r (those are HOUSE wall
  ends — using them here is precisely the violation Paolo caught on 7/28 and
  the WALL TAXONOMY law now forbids). Nothing in the index turns a perimeter
  wall corner.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode; the CITY tab already
  draws this pool at native 44x44 with wallH=2). Map zoom: the wall is the
  district's outline, so the corner matters for the silhouette.
- DISTRICT FAMILIES: suburb, gated, estate, apartment, storage, cemetery,
  school — every district that closes itself with a block wall. Also the
  interior side-yard walls inside a suburb, which in real Clark County are the
  same CMU as the perimeter.
- LAYER: structure
- SOLID? yes — ENTERABLE? no (you go through the GATE, TF-CITY-005)
- MUST SIT BESIDE: the straight run of the SAME pool key and the SAME variant
  (one wall per community — a corner in a different design is the failure);
  yard/desert on the outside; yard/driveway on the inside.
- NEVER BESIDE: any house wall tile (WALL TAXONOMY); a roof; a different
  perimeter variant on the same community.
- EDGE CONTRACT: WANG-16 edge set. Every piece's straight-run-facing edge must
  hash IDENTICALLY to its own pool key's field tile, per the constitution's
  seam contract — a corner that does not hash to the run it joins is a visible
  step and is the kill condition.

## D. WHEN
- ACT: 1
- BEST TIME: both. No self-light. A wall is the thing the light falls on, and
  at night it is the edge of the dark — the CLUSTERED POWER law's "nobody
  patrols the dark" reads off exactly this silhouette.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN-WET — CMU and stucco
  darken dramatically wet and the CAP is the piece that stays wettest, a value
  shift only, no new geometry.
- LIT/UNLIT: none in the art. LIGHT=TERRITORY: if a community owns light, the
  pass lights its wall; the wall never lights itself.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44 x 44 px per tile — and this matters here specifically,
  because the 7/28 CITY patch had to re-embed these at NATIVE 44x44 after they
  were being drawn at quarter resolution. Author native, consume native, never
  resample (mobile render contract: non-integer scale is banned).
- VIEW: 45-degree world view. A corner is where the 45 view is proved or
  broken: you see the TOP of the cap turning, and two faces at different
  values. A pilaster is a column that STANDS PROUD of the wall plane, so it
  reads by its own cast side, not by an outline.
- PALETTE: constitution ceiling. Value band: **wall** (mean 96.0, lo 37.5, hi
  167.6). The cap's sky-facing top belongs in the **top** band (110.2,
  72.8-137.4) — this piece straddles two bands and that is correct, not a bug:
  a mass is brightest on top (constitution light rule).
- LIGHT: upper left, shadows down and to the right. NO keyline. NO dither.
- SHADOWS: none baked. A wall's cast shadow onto the ground is the runtime
  pass, and it is the single biggest thing the wall contributes to the scene.
- SCALE ANCHORS: wall height is min 2 tiles by the pool's own law, and the
  CITY tab sets a perimeter to wallH=2 while a house facade is 3 (a block wall
  really is shorter than a house). A real Clark County residential perimeter
  wall is 6 ft; over 6 ft needs an administrative deviation, so 6 ft is the
  effective ceiling and 2 tiles is the right read.
- WEAR LEVEL: ten years, no maintenance, and CMU fails in specific ways:
  stucco spalls off in sheets at the base showing grey block underneath;
  hairline step-cracks run diagonally from the corners (that is where a wall
  cracks); caps get knocked off and lie in the dirt; graffiti is a Paolo-canon
  question, not an art decision, so NONE unless he rules it.
- VARIANTS: one joinery set per pool key that actually gets placed, in both
  the tan and original colorways the bank already carries (85/15 tan per the
  TAN WALL law). Same shapes, different material = colorway, one form.

## F. THE CAPTION
```json
{
  "id": "TF-CITY-004",
  "name": "perimeter wall corners, pilasters and cap",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["suburb", "gated", "estate", "apartment", "storage", "cemetery", "school"],
  "best_time": "any",
  "best_location": "wherever a community wall turns, ends, or tops out",
  "place_next_to": ["perimeter wall straight run (same key, same variant)", "yard", "desert", "driveway"],
  "never_next_to": ["any house wall tile", "roof", "a different perimeter variant on the same community"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["structure", "perimeter", "wall", "cmu", "joinery", "suburb"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt — his own 13
  keys ARE the material truth, and the corner is cooked FROM the key it joins.
  This is a REUSE-FIRST cook by construction: the source pixels are already
  approved, the ask is joinery in the same hand.
- NAMED OUTSIDE REFERENCE: Project Zomboid's fence and wall corner sets for
  the joinery VOCABULARY (which cases you actually need before a wall stops
  looking broken: outer corner, inner corner, end, and a top course — four,
  not forty). Take the vocabulary, never the palette. Secondary: the blessed
  lamp bank for how a proud vertical element (a pilaster is one) reads at 45
  without an outline.
- REAL-WORLD GROUNDING: the Clark County subdivision perimeter wall is one of
  the most standardised objects in Las Vegas and the code is specific. A
  residential perimeter wall over 24 inches needs a permit and over 6 feet
  needs an administrative deviation, so 6 ft is the real height. PILASTERS,
  where used, are limited to a maximum 24 feet on centre — that is the real
  rhythm and it is exactly the kind of number that makes a wall read as a real
  Vegas wall instead of a texture: a thickened column every ~24 ft, not every
  tile and not never. And the code requires that perimeter walls MATCH THE
  DESIGN of abutting subdivision walls, continuing until the next street
  intersection — which is the real-world justification for our own ONE WALL
  PER COMMUNITY rule, arrived at independently. The material is CMU block,
  usually stucco-coated tan, with a solid cap course; after a decade of sun and
  no repair the stucco spalls and the block shows through.

## H. DON'T WANT
- NOT a house wall. Not wall_end_l/wall_end_r, not the starter set, not a
  skin. This is the exact confusion Paolo blew up about on 7/28 and the WALL
  TAXONOMY law exists because of it.
- NOT a different design from the run it joins. A corner in another key is
  worse than no corner.
- NOT a pilaster on every cell. That is a colonnade, not a block wall. ~24 ft
  on centre is the real rhythm (see grounding).
- NOT taller than a house. 2 tiles, not 3 — the THREE-TILE WALL law is about
  walls that CARRY A DOOR, and this wall does not.
- NOT clean, NOT freshly stuccoed, NOT graffitied (graffiti is Paolo's canon
  call, MECHANISM-MINE/CONTENTS-PAOLO'S).
- NOT green, no vines. NOT purple (PURITY law).

## I. ACCEPTANCE
- [ ] Seam ring hash: every piece's run-facing edge hashes identically to its
      own pool key's straight field tile
- [ ] Palette ceiling + **wall** band for the faces, **top** band for the cap's
      sky face + one-light + no-keyline + no-dither checks green
- [ ] Squint test: at map zoom the walled district's OUTLINE must read as a
      continuous closed shape — that is what a corner buys
- [ ] 3x3 tiled proof plus a CLOSED-PLOT proof: a full rectangular community
      wall with all four outer corners, an inner corner, a pilaster rhythm and
      the cap, at one of Paolo's actual approved keys
- [ ] ON THE REAL SURFACE: the run, walking the perimeter, beside today's
      butt-jointed render
- [ ] Native 44x44, no resampling anywhere in the path (the 7/28 quarter-res
      regression is the named failure)
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (bank opened and all 26 entries
  enumerated 7/28) | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 63 | VERDICT: —
