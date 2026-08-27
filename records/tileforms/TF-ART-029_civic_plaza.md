# TILE FORM TF-ART-029 — THE LIBRARY'S PLAZAS (civic paving, plinth, planters)

## A. IDENTITY
- NAME: The library's plazas — scored civic paving, the plinth terrace
  and the dead planter beds
- FAMILY/SET: CIVIC GROUND — sibling of the landscaping (TF-ART-024) in
  the manicured-ground family.
- THE JOB, ONE SENTENCE: 6,415 cells of the library's civic plaza
  family fall to the gravel fallback.

## B. WHY
- DEMANDED BY: the fresh inventory ranking (8/26 re-sweep) named the
  library plazas in the remaining queue.
- WHAT LOOKS BROKEN TODAY: the most formal ground in the valley - the
  paving a civic architect DREW - reads as the same yard gravel as a
  scrapyard.
- MEASURED 8/27 on the walked world (cell 40,28): 'terrace / plinth'
  x2379, 'forecourt ground' x1574, 'entry plaza' x1171, 'courtyard'
  x775, 'plaza planter' x516.
- SHOPPING CHECK: the approved kerb pale
  (banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json), the approved
  dirt (banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt) and the
  approved agave straw
  (banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json) are the three
  pools; no approved bank holds scored plaza paving or a planter.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode).
- DISTRICT FAMILIES: library (and any civic district that later names
  these).
- LAYER: ground (paving, planter beds).
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: the library's own mass, the drive/lot, the roof-edge
  ring, each other.
- EDGE CONTRACT: self-seamless paving (score joints repeat at cell
  pitch); the planter is BLOB-AWARE - a lone cell is a full box, a bed
  cell draws soil with the concrete rim only on its outside edges.
- NEVER BESIDE: nothing outside the civic families.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; deep_wet stays weather's.
- LIT/UNLIT: unlit always (LIGHT=TERRITORY).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell, full-cell opaque tiles + 3px rim alpha
  overlays.
- VIEW: flat ground planes in the world's three-quarter 45; planter
  rims lit north, shaded south.
- PALETTE: harvested only - paving and rims from the approved kerb
  pale, joint grime and soil from the approved dirt, rosettes from the
  approved agave straw lifted toward the pale (dead straw reads LIGHTER
  than the soil it died in). No purple.
- LIGHT: one sky light; no self-light.
- SHADOWS: none beyond the joints' own grime.
- SCALE ANCHORS: score joints every 11px = half-metre saw cuts; plinth
  slabs at 22px = metre slabs; rosettes 10-18px = real dead shrubs.
- WEAR LEVEL: thirty years - grime settled into every joint, the odd
  spall and hairline crack, every planter shrub dead since the drip
  irrigation stopped.
- VARIANTS: pz_0/1/2 and tp_0/1/2 hashed per cell; pp_0/1 (lone box),
  pp_soil_0/1/2 + pp_rim_n/s/e/w (the bed).
- CRAFT: saw joints are machinery and may be straight; cracks and
  rosettes wander in little off strokes (8/1 law); no stipple (8/21).

## F. THE CAPTION
```json
{
  "id": "TF-ART-029",
  "name": "civic plaza - scored paving, plinth terrace, dead planter beds",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["library"],
  "best_time": "both",
  "best_location": "the entry plaza and plinth terrace of the library",
  "place_next_to": ["library mass", "drive / lot", "each other"],
  "never_next_to": ["any district outside the civic families"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless paving; blob-aware planter (lone box vs bed with edge rims)",
  "tags": ["library", "plaza", "paving", "planter", "civic"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (kerb_return_ne - the paving is its pool, so the plaza sits in the
  same value family as every kerb it meets).
- NAMED OUTSIDE REFERENCE: the civic plazas in Disco Elysium's
  Martinaise and INSIDE's municipal exteriors both read formal paving
  as VALUE-FLAT FIELDS WITH DARK JOINT LINES and nothing else - the
  grid IS the ornament, exactly this tile's grammar.
- REAL-WORLD GROUNDING: the Clark County Library on Flamingo and the
  Lied Library at UNLV both front broad scored-concrete plazas - pale
  concrete sawn into half-metre grids, raised planter beds with
  concrete rims, the desert landscaping inside them dead wherever
  irrigation stopped - and thirty years of dust settles INTO the saw
  joints first, which is why the grid darkens while the slabs stay
  pale; both patterns are these tiles.
- ALSO OPENED IN CODE:
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (dirt),
  banks/tileforms/TF-ART-024_CANDIDATES_8_25_26.json (ls_agave_0).

## H. DON'T WANT
- NOT a waffle of individual boxes - a 5x7 planter blob is ONE BED
  (the live look caught this; the blob-aware wiring is the fix).
- NOT green anywhere - nothing here has been watered in thirty years.
- NOT dot stipple (banned 8/21).
- NOT ornament beyond the grid - civic paving's ornament IS the grid.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the library (cell 40,28) -
      paving, plinth and the un-waffled bed all drawing
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/27/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-029_CANDIDATES_8_27_26.json (15 tiles),
  cook tools/tfcook/TF-ART-029_civicplaza_cook.py, wired in the run
  slice's named-cell pass ('entry plaza'/'forecourt ground'/'courtyard'
  -> pz_ hashed 3; 'terrace / plinth' -> tp_ hashed 3; 'plaza planter'
  -> blob-aware box/bed). Live frame:
  records/target/ART_WIRED_TF-ART-029.png, card in the ART tab.
  | REQUESTED BY: ART lane (fresh inventory ranking) | DATE: 8/27/26
  | PRIORITY: MED
- BOARD ROW #: 103 | VERDICT: —
