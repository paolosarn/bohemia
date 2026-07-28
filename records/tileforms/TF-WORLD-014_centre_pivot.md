# TILE FORM TF-WORLD-014 — CENTRE-PIVOT IRRIGATION & DEAD ALFALFA (his own correction)

## A. IDENTITY
- NAME: Centre-pivot irrigation arm and the dead alfalfa circle under it
- FAMILY/SET: NEVADA AGRICULTURE family — the pivot arm span on its wheeled
  towers + the pivot point + the circular dead alfalfa field + wheel-track ruts
  + a windbreak line. ONE drawing job.
- THE JOB, ONE SENTENCE: this tile exists so the farm district stops growing
  row crops in the Mojave desert, which is the specific thing Paolo called out.

## B. WHY
- DEMANDED BY: Paolo's bulk verdict, verbatim: farm — **"this is nevada nevada
  is in a dessert so"**. He is factually right and the district is factually
  wrong. Also EVERY DISTRICT IS ITS OWN LANDMARK (7/28): a quarter-mile steel
  irrigation arc is one of the strongest silhouettes available anywhere in the
  game and we are not using it.
- WHAT LOOKS BROKEN TODAY: the farm district declares "crop rows", "field
  soil", "irrigation" and "farmyard" and draws straight row crops — an eastern
  /midwestern image. In the real Mojave that farm does not exist.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * DESERT/TERRAIN + desert pools: natural desert; a cultivated field is a
    made surface. Checked, does not cover, and is measured broken (row 4).
  * The coming DEAD FOLIAGE SET (row 5: dead lawns, dry shrubs, dead trees,
    dead palm, tumbleweed, brown-striped mown grass): the closest near-miss.
    Checked and disqualified — a mown lawn stripe is not a cut alfalfa
    windrow, and neither the pivot arm nor the circular field geometry is
    foliage at all. Row 5 should supply the windbreak trees; this form supplies
    the field and the machine.
  * HD PACK UP list: no agricultural family.
  Nothing in the index claims Nevada agriculture.

## C. WHERE
- SURFACE + TAB: RUN + CITY + MAP — the pivot CIRCLE is a map-zoom silhouette
  in its own right, and a circle in a rectilinear valley is instantly legible.
- DISTRICT FAMILIES: farm; the granary landmark cell; any agricultural margin.
- LAYER: ground for the field and ruts; structure for the pivot arm and its
  towers (you cannot walk through the span's legs).
- SOLID? field no, arm/towers yes — ENTERABLE? no
- MUST SIT BESIDE: desert ground immediately outside the circle — the HARD
  EDGE between irrigated circle and raw desert is the entire image; the
  farmyard and windbreak at one side.
- NEVER BESIDE: straight row crops (they are the thing being replaced); green
  living crop.
- EDGE CONTRACT: SELF-SEAMLESS for the field surface; SINGLE PLACEMENT for the
  pivot arm, the pivot point and the towers.

## D. WHEN
- ACT: 1
- BEST TIME: both; no self-light.
- WEATHER STATES: sunny baseline; rain darkens the field and fills the wheel
  ruts, which are the lowest ground in the circle.
- LIT/UNLIT: none.
- ANIMATION: static. The pivot is STOPPED MID-ROTATION — that is the frozen
  event this district's hook is built on, and a rotation loop would destroy it.

## E. HOW
- EXACT SIZE: the field is a tiling ground surface; the arm is a long
  single-placement structure. A real quarter-mile pivot is ~400 m — far larger
  than a 96 m cell, so it MUST be compressed the way the ballpark and stadium
  already are: keep the geometry true (a straight span on wheeled towers,
  rotating about a fixed point, describing a circle) and compress the yardage.
- VIEW: 45-degree world view. The span is a lattice truss — draw it as an open
  structure you see through, and the tower wheels get ellipse cross-sections
  per the 45-degree law.
- PALETTE: constitution ceiling; GROUND band for the field, STRUCTURE for the
  arm. The dead alfalfa is a distinct dead-green/straw note, deliberately not
  the same as dead lawn.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; the span throws a long thin shadow across the circle
  and that is the pass's job.
- SCALE ANCHORS: tower wheels are roughly tractor-tyre height; the span is a
  few metres above the crop. The arm's height above the field is what makes
  the scale read.
- WEAR LEVEL: galvanised steel spans survive the desert almost indefinitely —
  so the machine is INTACT and simply stopped, which is far more unsettling
  than a collapsed one. The alfalfa under it is dead in place: a crop that was
  cut on a schedule and then never cut again, so the last windrows are still
  faintly visible under a season of dead regrowth. The circle's edge stays
  razor sharp against the desert for years.
- VARIANTS: field surface (last-windrow variant + uncut dead regrowth), pivot
  arm span, pivot point, wheel tower, wheel ruts.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-014",
  "name": "centre-pivot irrigation and dead alfalfa",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["farm","granary"],
  "best_time": "any",
  "best_location": "a circular irrigated field with raw desert immediately outside its edge",
  "place_next_to": ["desert ground (hard edge)","farmyard","windbreak trees","wheel ruts"],
  "never_next_to": ["straight row crops","living green crop"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless field + single-placement machine",
  "anim": null,
  "tags": ["ground","agriculture","nevada","pivot","landmark-silhouette","paolo-correction"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved DESERT/TERRAIN values for the raw desert the
  circle must sit against — the contrast between them IS the asset.
- NAMED OUTSIDE REFERENCE: the centre-pivot circles visible from any flight
  over the American West (the "green polka dots" of satellite imagery) — the
  form is famous precisely because it reads instantly from above, which is what
  we need at map zoom. Stardew Valley for how a field surface stays quiet.
- REAL-WORLD GROUNDING: Nevada is the driest state in the union, and its
  agriculture is overwhelmingly ALFALFA HAY grown under centre-pivot or flood
  irrigation — alfalfa is by a wide margin Nevada's largest crop by acreage,
  grown for cattle feed, and it is cut several times a season into windrows.
  Row crops in the open Mojave are not a thing; the water simply is not there.
  Paolo's correction is the accurate one and this form is that correction.

## H. DON'T WANT
- NOT straight row crops. That is the exact error being fixed.
- NOT green. Dead alfalfa is straw and dead-olive, never living green.
- NOT a collapsed or rusted machine — galvanised steel survives here; the
  horror is that it is intact and stopped.
- NOT a soft edge to the circle. The boundary against desert is razor sharp and
  that sharpness is the whole silhouette.
- NOT rotating.

## I. ACCEPTANCE
- [ ] Field seam measured, no edge darkening
- [ ] Squint test at 1-tile map zoom: the CIRCLE reads, and reads as farm
- [ ] 45-degree check on the towers and wheels
- [ ] Palette ceiling + bands + one-light green
- [ ] Assembled proof: the arm standing across a dead circle with desert
      immediately outside the edge
- [ ] ON THE REAL SURFACE: the farm district, beside the current row-crop
      render for contrast
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 23 | VERDICT: —
