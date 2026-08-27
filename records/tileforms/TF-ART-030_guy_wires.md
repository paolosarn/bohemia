# TILE FORM TF-ART-030 — GUY WIRES (the radio site's rigging)

## A. IDENTITY
- NAME: Guy wires — the radial rigging fans of the radio site's guyed
  masts
- FAMILY/SET: DEAD INFRASTRUCTURE — sibling of the barricade post-and-
  cable (TF-ART-022) in the rigging family.
- THE JOB, ONE SENTENCE: 2,798 cells of mast rigging draw as plain
  ground, erasing the geometry that makes a guyed AM site readable.

## B. WHY
- DEMANDED BY: the fresh inventory ranking (8/26 re-sweep) - 'guy wire'
  x2798, flagged marginal until the measurement showed the fans ARE the
  district's shape.
- WHAT LOOKS BROKEN TODAY: a guyed mast without its guys is a flagpole;
  the whole site reads as empty scrub with towers in it.
- MEASURED 8/27 on the walked world (cell 37,26): 'guy wire' x2798 in
  132 blobs - irregular radial fans (up to 66x59 bounding boxes)
  running from the 45 'guyed mast' cells out to the named anchor
  blocks and base plates.
- SHOPPING CHECK: the approved galv
  (banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json) is the steel; no
  approved bank holds an overhead cable seen from above.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode).
- DISTRICT FAMILIES: radio (and any district that later names rigging).
- LAYER: ground overlay (the wire is far overhead; what you meet on
  foot is its line and its shadow).
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: guyed masts, anchor blocks, the site ground.
- EDGE CONTRACT: single placement per cell - each wire cell bears on
  its NEAREST MAST, snapped to eight directions; neighbouring cells of
  one radial share a bearing so the line joins across cells.
- NEVER BESIDE: nothing outside the rigging fans.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: all - steel does not care.
- LIT/UNLIT: unlit always.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell alpha overlays, eight of them (gw_0..7
  at 22.5-degree steps; a line is symmetric under 180 degrees so eight
  covers the circle).
- VIEW: from the 45 above a taut guy is a thin line - 1px steel, a 1px
  galv glint on the sun side, a faint offset shadow 2px SE.
- PALETTE: harvested only - steel and glint from the approved galv. No
  purple.
- LIGHT: one sky light; the glint is reflectance, not self-light.
- SHADOWS: the wire's own faint SE shadow line.
- SCALE ANCHORS: 1px at 0.87 m/cell is generous for bridge strand -
  the read is the LINE, not the gauge.
- WEAR LEVEL: none visible at this scale; the anchor hardware carries
  the rust story.
- VARIANTS: direction is the variant - the mast bearing picks the tile.
- CRAFT: a taut guy has NO sag from above; straight is what the
  machinery is (8/1 bans straight lines in organic shapes, not
  rigging). Mast positions are lazily cached per district cell so the
  bearing costs one scan, not one per frame.

## F. THE CAPTION
```json
{
  "id": "TF-ART-030",
  "name": "guy wires - the mast rigging fans from above",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["radio"],
  "best_time": "both",
  "best_location": "the radial fans around the guyed masts",
  "place_next_to": ["guyed mast", "anchor block", "site ground"],
  "never_next_to": ["anything outside the rigging fans"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement - per-cell bearing on the nearest mast, snapped to eight directions",
  "tags": ["radio", "mast", "rigging", "wire", "antenna"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-022_CANDIDATES_8_24_26.json
  (the barricade post-and-cable - the approved sagging ground cable
  this family is the overhead sibling of).
- NAMED OUTSIDE REFERENCE: the pylon and mast rigging in Death
  Stranding's overhead map view reads exactly as thin bearing-true
  lines with offset shadows and no gauge - the geometry carries it,
  which is this form's whole method.
- REAL-WORLD GROUNDING: the KDWN AM array north of Vegas is six guyed
  masts each held by three radial guy sets at 120 degrees, anchored at
  concrete blocks a mast-height out - from the air the site is a web
  of straight lines converging on the towers over bare desert, and
  that convergence (every wire POINTS AT ITS MAST) is precisely what
  the nearest-mast bearing draws.
- ALSO OPENED IN CODE:
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json (parapet_galv_run_n_a).

## H. DON'T WANT
- NOT sag - a taut guy from above is straight.
- NOT thick cables - the read is the line, never the gauge.
- NOT random directions - a wire that does not point at a mast is set
  dressing, not rigging.
- NOT self-light, no purple, no dots.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the radio site (cell
      37,26) - the radial line runs continuous across cells toward its
      mast
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/27/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-030_CANDIDATES_8_27_26.json (8 overlays),
  cook tools/tfcook/TF-ART-030_guywire_cook.py, wired in the run
  slice's named-cell pass ('guy wire' -> ground, then the bearing-
  snapped cable; mast list cached per district cell). Live frame:
  records/target/ART_WIRED_TF-ART-030.png, card in the ART tab.
  | REQUESTED BY: ART lane (fresh inventory ranking) | DATE: 8/27/26
  | PRIORITY: MED
- BOARD ROW #: 104 | VERDICT: —
