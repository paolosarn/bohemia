# TILE FORM TF-ART-028 — THE DATAFORT'S ROOFS AND COOLERS

## A. IDENTITY
- NAME: The datafort's roofs and coolers — the hall membrane, the
  generator-wing deck and the cooling-unit rows
- FAMILY/SET: DEAD INDUSTRY ROOFS — sibling of the reservoir deck
  (TF-ART-020 volume) in the per-cell roof-plate family.
- THE JOB, ONE SENTENCE: 6,300+ cells of the datafort's built mass
  (2,966 hall + 2,167 generator roof + 1,189 cooling units) draw as
  undifferentiated brown noise.

## B. WHY
- DEMANDED BY: the fresh inventory ranking (8/26 re-sweep): 'data hall'
  x2966 was the third-largest unclaimed name in the world.
- WHAT LOOKS BROKEN TODAY: the district whose hero is a four-hundred-
  thousand-square-foot windowless box reads as a smear of brown static
  from the 45; nothing says machine, roof or cooling.
- MEASURED 8/27 on the walked world (cell 67,69): 'data hall' x2966 in
  9 blobs (the hero 80x55, the wings 68x5 strips), 'second roof /
  generator' x2167 (one blob 76x51 plus 9x5 blocks), 'cooling unit'
  x1189 in 30 blobs from 1x1 singles to a 49x12 yard.
- SHOPPING CHECK: the approved kerb pale
  (banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json), the approved
  galv (banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json), the
  approved rust (banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json) and
  the approved dirt
  (banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt) are the four
  pools; no approved bank holds a membrane roof or a chiller module.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode).
- DISTRICT FAMILIES: datafort (and any district that later names these).
- LAYER: structure (the hall and generator cells are the solid mass -
  the per-cell skin dresses their TOP; the run's !body guard keeps the
  3/4 front face untouched); the cooling units are structure rows on
  their own concrete.
- SOLID? follows the district's own occupancy - ENTERABLE? no.
- MUST SIT BESIDE: each other, the service yard, the access road.
- EDGE CONTRACT: self-seamless - the membrane carries N+W sheet seams
  per cell (the reservoir-deck contract), the deck's standing seams run
  one way, units repeat cleanly in rows.
- NEVER BESIDE: nothing outside the datafort.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; deep_wet stays weather's.
- LIT/UNLIT: unlit always - the most on-the-nose building in the valley
  for LIGHT=TERRITORY, and it is dark.
- ANIMATION: static; every fan is stopped (the blades read as a dark
  still cross).

## E. HOW
- EXACT SIZE: 44px corpus cell, full-cell opaque tiles.
- VIEW: flat roof planes in the world's three-quarter 45; the cooling
  units carry a lit north edge, shaded south and a soft south ground
  shadow.
- PALETTE: harvested only - membrane from the approved kerb pale cooled
  toward the approved galv (so a roof never reads as desert sand), deck
  and unit bodies from the galv, weeps from the approved rail-plate
  rust, dirt streaks from the approved dirt. No purple.
- LIGHT: one sky light; no self-light anywhere.
- SHADOWS: the units' own south shadow; nothing else casts.
- SCALE ANCHORS: membrane sheets read in 44px courses (2m sheet at 0.87
  m/cell); a cooling unit fills its cell - a real 3m CRAC module; fan
  rings 24px = 2m fans.
- WEAR LEVEL: thirty years - dirt streaking with the sheet direction, a
  patch weld, a clogged-drain pond ring, oil stain and seam rust on the
  deck, rusted unit bases.
- VARIANTS: dh_0/1/2 and gr_0/1/2 hashed per cell, cu_0/1 hashed per
  cell.
- CRAFT: seams and ribs are machinery and may be straight; fan rings
  are solid strokes, never dotted (8/21 stipple ban); stains wander
  (8/1 law).

## F. THE CAPTION
```json
{
  "id": "TF-ART-028",
  "name": "datafort roofs - hall membrane, generator deck, cooling units",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["datafort"],
  "best_time": "both",
  "best_location": "the hall roofs and cooling rows of the datafort",
  "place_next_to": ["service yard", "access road", "each other"],
  "never_next_to": ["any district outside the datafort"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless - N+W membrane seams per cell, one-way standing seams, row-repeating units",
  "tags": ["datafort", "membrane", "roof", "cooling", "generator"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-020_ROOF_OVERFLOW_VOLUME_8_25_26.json
  (tr_deck_0 - the approved per-cell roof-plate grammar with N+W joint
  seams this family extends).
- NAMED OUTSIDE REFERENCE: the data-center roofs in Cities: Skylines'
  industry DLC and every satellite view of a hyperscale campus read as
  exactly two surfaces - a vast pale membrane plate and darker plant
  wings with rows of round fan units along the faces - never windows,
  which is the point of the building.
- REAL-WORLD GROUNDING: the Switch SUPERNAP campus in Las Vegas is the
  real datafort - from above it is white TPO membrane over the halls
  (streaked grey where drainage ran for years), darker standing-seam
  metal over the generator wings, and unbroken rows of round-fan
  chiller modules lining every hall face; thirty dead years turns the
  white membrane dun, stops every fan, and rusts the unit bases -
  which is precisely what these eight tiles draw.
- ALSO OPENED IN CODE:
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (kerb_return_ne),
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json (parapet_galv_run_n_a),
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json (rail_plate_0),
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (dirt).

## H. DON'T WANT
- NOT windows - the hall famously has none; the membrane IS the read.
- NOT spinning fans or self-light - everything here died with the grid.
- NOT desert-sand membrane - cooled toward galv on purpose.
- NOT dot stipple (banned 8/21) - rings are solid strokes.
- NOT the front face - the 3/4 wall face belongs to the mass skin
  system and the !body guard protects it.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the datafort (cell 67,69) -
      membrane, deck and units all drawing, front faces intact
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/27/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-028_CANDIDATES_8_27_26.json (8 tiles),
  cook tools/tfcook/TF-ART-028_datafort_cook.py, wired in the run
  slice's named-cell pass ('data hall' -> dh_ hashed 3, 'second roof /
  generator' -> gr_ hashed 3, 'cooling unit' -> cu_ hashed 2). Live
  frame: records/target/ART_WIRED_TF-ART-028.png, card in the ART tab.
  | REQUESTED BY: ART lane (fresh inventory ranking) | DATE: 8/27/26
  | PRIORITY: HIGH
- BOARD ROW #: 102 | VERDICT: —
