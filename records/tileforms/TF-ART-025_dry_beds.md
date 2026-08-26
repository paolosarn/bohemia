# TILE FORM TF-ART-025 — DRY BEDS (the lakebed, the hardpan, the pit floors)

## A. IDENTITY
- NAME: Dry beds — the drought-exposed lakebed, the terminal hardpan and
  the working floors of the two pits
- FAMILY/SET: DEAD GROUND — sibling of the riprap (TF-ART-023) in the
  landform-ground family.
- THE JOB, ONE SENTENCE: 8,600+ cells of the valley's most famous dead
  surfaces (Mead's bathtub bed, the pit floors) fall to the gravel
  fallback.

## B. WHY
- DEMANDED BY: the FRESH inventory ranking (8/26 re-sweep, 753 names):
  'exposed lakebed' x4109 and 'quarry floor' x3691+x3699 were the two
  largest unclaimed surfaces in the world.
- WHAT LOOKS BROKEN TODAY: the intake's drought bed - the single most
  photographed dead thing in Nevada - draws as the same yard gravel as
  everything else, and both pits' floors do too.
- MEASURED 8/26 on the walked world: 'exposed lakebed' x4109 (intake),
  'hardpan' x1223 (terminal), 'quarry floor' x3691 (quarry) + x3699
  (gypsum). Golf's 'dead fairway' x2074 ships in the same turn as PURE
  WIRING into the approved turf family.
- SHOPPING CHECK: banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (approved pale concrete) and
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (approved dirt)
  exist and are the two pools; no approved bank holds a cracked-silt or
  swept-bench ground.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode); at MAP zoom the
  bed reads as its pale flat, which is correct for a dry lake.
- DISTRICT FAMILIES: intake, terminal, quarry, gypsum (and golf for the
  fairway wiring).
- LAYER: ground.
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: the intake's shoreline works, the terminal's
  hardstand, the pits' benches and haul roads.
- EDGE CONTRACT: self-seamless - the crack polygons seed from hashed
  centres per variant and the silt base matches across cells; three
  variants break any period.
- NEVER BESIDE: nothing outside the four named districts.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; a drought bed is the driest thing in
  the game and never reads wet (deep_wet stays weather's).
- LIT/UNLIT: unlit always (LIGHT=TERRITORY).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell, full-cell opaque ground tiles.
- VIEW: flat ground planes in the world's three-quarter 45; the crack
  lips carry a one-pixel lit edge on the sun side.
- PALETTE: harvested only - warm drought silt and bench pale from the
  approved kerb pool, crack shadow and lane grime from the approved
  dirt. No purple.
- LIGHT: one sky light; no self-light.
- SHADOWS: none beyond the crack shadows themselves.
- SCALE ANCHORS: desiccation polygons 8-20px across - real half-metre
  to metre mud plates at 0.87 m/cell; the pit's wheel lanes are broad
  metre-wide value dips, not painted lines.
- WEAR LEVEL: thirty years of sun; the pit floors keep the compaction
  of the loaders that died.
- VARIANTS: three per ground (bed_0/1/2, qf_0/1/2) hashed per cell; one
  qf variant carries a blast-scar drag line.
- CRAFT: crack paths WANDER (8/1 law - little off shapes, no straight
  lines, no dots); deterministic per variant.

## F. THE CAPTION
```json
{
  "id": "TF-ART-025",
  "name": "dry beds - drought lakebed polygons and swept pit floors",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["intake", "terminal", "quarry", "gypsum"],
  "best_time": "both",
  "best_location": "the drought bed below the intake and the working floors of both pits",
  "place_next_to": ["shoreline works", "hardstand", "bench rock", "haul road"],
  "never_next_to": ["any district outside the four named", "anything wet"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless - hashed crack seeds and a matched silt base across cells; three variants",
  "tags": ["intake", "lakebed", "drought", "quarry", "gypsum", "hardpan"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (kerb_return_ne - the silt and bench pale are its pool, so the beds
  sit in the same value family as every kerb and collar they meet).
- NAMED OUTSIDE REFERENCE: the cracked-earth grounds in Kenshi and Rust
  both read a dry bed as PALE PLATES WITH DARK WANDERING SEAMS and no
  outline anywhere - one value step down into the crack, one lit lip
  out of it, exactly this tile's grammar.
- REAL-WORLD GROUNDING: Lake Mead's 2022-era bathtub bed is the most
  photographed drought surface on earth - pale carbonate silt cracked
  into half-metre desiccation polygons, ringed by the mineral band the
  run's water hero already wears; and a working gypsum pit floor is
  swept BRIGHT by loader traffic, the compacted wheel lanes reading as
  broad matte bands long after the machines stop - both patterns are
  the two tiles here, straight off the satellite.
- ALSO OPENED IN CODE:
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (dirt).

## H. DON'T WANT
- NOT straight crack lines - desiccation wanders (8/1 craft law).
- NOT dot stipple anywhere (banned 8/21).
- NOT wet - no shine, no pool, ever; the wet state is weather's.
- NOT painted wheel RUTS in the pit - compaction is a broad value dip,
  not a line pair.
- NOT the same tile at the lakebed and the pit - silt cracks, bench
  sweeps; two different grounds for two different deaths.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the intake (cell 8,89), the
      quarry (cell 47,89) and the golf fairway (cell 57,73)
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/26/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-025_CANDIDATES_8_26_26.json (6 tiles),
  cook tools/tfcook/TF-ART-025_drybeds_cook.py, wired in the run
  slice's named-cell pass (lakebed+hardpan share the bed tiles, both
  pits share the floor tiles, golf's fairway wired into the APPROVED
  turf stripes with zero new pixels). Live frames:
  records/target/ART_WIRED_TF-ART-025.png, card in the ART tab.
  | REQUESTED BY: ART lane (fresh inventory ranking) | DATE: 8/26/26
  | PRIORITY: HIGH
- BOARD ROW #: 91 | VERDICT: —
