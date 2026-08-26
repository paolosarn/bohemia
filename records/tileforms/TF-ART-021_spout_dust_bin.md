# TILE FORM TF-ART-021 — SPOUT / DUST BIN (the granary's loadout hardware)

## A. IDENTITY
- NAME: Spout / dust bin — the loadout spouts over the track side and the
  cyclone dust collectors at the silo bases
- FAMILY/SET: GRANARY HARDWARE — second member of the granary's own
  vocabulary (the rail spur was first; the gallery and headhouse remain).
- THE JOB, ONE SENTENCE: 1,514 'spout / dust bin' cells fall to the
  gravel fallback, so the elevator's working row reads as bare dirt.

## B. WHY
- DEMANDED BY: the inventory ranking (ART lane's standing instrument):
  after the reservoir hatches, this was the next largest named surface
  drawing as a fallback lie.
- WHAT LOOKS BROKEN TODAY: the dump apron and spur side of every silo
  cluster is studded with named hardware cells that draw dirt - the
  loadout row, the single thing a grain elevator exists to do, is absent.
- MEASURED 8/24 on the walked world: 1,514 cells in 81 blobs - singles
  and pairs at the silo bases plus long sparse strips (36x6, 39x8, 15x3
  bounding boxes) along the apron. Neighbour census: dump apron 1001,
  rail spur 511, concrete silo 111, gallery/rail shed 81.
- SHOPPING CHECK: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  (approved galv) and banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  (approved rust) exist and cover the metal; no approved bank holds a
  cyclone ellipse or a spout boom, so the two shapes are cooked from the
  approved pools.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode); absent at MAP zoom.
- DISTRICT FAMILIES: granary only.
- LAYER: ground (squat hardware standing on the apron; nothing here is a
  wall course).
- SOLID? no - ENTERABLE? no.
- MUST SIT BESIDE: dump apron, rail spur, concrete silo, gallery / rail
  shed - exactly the measured census.
- EDGE CONTRACT: single placement - each piece is complete in its cell;
  the loadout ROW read comes from the world's own cell placement.
- NEVER BESIDE: nothing outside the granary; never on the spur's own
  track cells.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; dust and UV only, never green.
- LIT/UNLIT: unlit always (LIGHT=TERRITORY; the elevator is dead).
- ANIMATION: static - no grain has dropped in thirty years.

## E. HOW
- EXACT SIZE: 44px corpus cell, one piece per cell.
- VIEW: the world's three-quarter 45 - the cyclone is an ELLIPSE with a
  lit north rim and the cone falling to a dark centre throat; the spout
  boom is a top-lit arm with its dark drop mouth and a shadow south.
- PALETTE: harvested only - galv steel (TF-ART-012), rust (TF-ART-010),
  pale concrete lifted for the grain-dust bleach (TF-ART-018). No purple.
- LIGHT: one sky light, top-lit; no self-light.
- SHADOWS: each piece's own small foot/mouth shadow only; the runtime
  pass owns cast shadows.
- SCALE ANCHORS: the cyclone is ~24px in a 44px cell - a real 2 m
  collector body; the spout mouth is ~10px - a real 0.8 m telescoping
  chute head.
- WEAR LEVEL: thirty years dead - dusty steel, rust streak or weep on
  variant 1, bleached grain-dust halo on the deck under the spouts.
- VARIANTS: two per piece (sd_bin_0/1, sd_spout_0/1) picked by th().
- BASE: RGBA riding on bought concrete drawn first by the wiring - the
  apron's own ground, never a material island.

## F. THE CAPTION
```json
{
  "id": "TF-ART-021",
  "name": "granary loadout hardware - cyclone dust collectors and loadout spouts",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["granary"],
  "best_time": "both",
  "best_location": "the dump apron and rail spur side of the silo clusters",
  "place_next_to": ["dump apron", "rail spur", "concrete silo", "gallery / rail shed"],
  "never_next_to": ["any district that is not the granary", "the spur's own track cells"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "single placement - each piece complete in its own cell; rows read from the world's cell placement",
  "tags": ["granary", "elevator", "spout", "cyclone", "dust bin", "loadout"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  (parapet_galv_run_n_a - the hardware steel is harvested from it, so it
  matches the galv already on the valley's roofs).
- NAMED OUTSIDE REFERENCE: SimCity 4's agriculture-industry lots and
  Transport Fever's grain-silo assets both read elevator hardware from
  above as SMALL DARK ROUND BODIES against pale concrete - one clear
  value step, no internal detail - which is the read this kit uses.
- REAL-WORLD GROUNDING: a country grain elevator loads out through
  telescoping spouts hung from the gallery over the rail siding or truck
  lane, and controls dust with cyclone collectors standing at the silo
  bases; on satellite, Nevada and Utah elevators (the Wells and Ogden
  sites) show exactly the measured pattern - a hardware row hugging the
  apron edge on the spur side, round collector bodies clustered where
  the conveyors meet the silos, and pale grain-dust bleach on the
  concrete under every spout mouth.
- ALSO OPENED IN CODE: banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  (rust) and banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (pale
  concrete for the dust bleach).

## H. DON'T WANT
- NOT circles - the 45 view makes every round body an ellipse.
- NOT dot stipple for the dust bleach (banned 8/21) - the halo is a soft
  alpha value patch.
- NOT a bright concrete island per cell - the base is the apron's own
  bought concrete.
- NOT markings or lettering on any bin (words are his).
- NOT working machinery - nothing moves, nothing glows, nothing drops.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the granary (cell 57,16) -
      cyclone rows on the apron, spouts on the spur side
- [x] No purple, no self-light, no readable text, no dot stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/24/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-021_CANDIDATES_8_24_26.json (4 pieces),
  cook tools/tfcook/TF-ART-021_spout_bin_cook.py, wired in the run
  slice's named-cell pass (spur-adjacent cells get the spout, the rest
  get the cyclone, all riding on bought concrete). Live frame:
  records/target/ART_WIRED_TF-ART-021.png, card in the ART tab.
  | REQUESTED BY: ART lane (inventory ranking) | DATE: 8/24/26
  | PRIORITY: HIGH
- BOARD ROW #: 95 | VERDICT: —

## K. VOLUME 8/26/26: THE GALLERY GETS ITS ROOF (thin runs only, on purpose)
- MEASURED: 'gallery / rail shed' x2121 (signature blob 101x3 - the
  elevated conveyor gallery running the whole silo row - plus 9x9 rail
  sheds) and 'headhouse' x310. All drew as generic mass.
- WIRED: gable galv for THIN RUNS (width <= 3): each cell banded by its
  place across the run's thin axis (the berm lesson) - ridge on the
  centreline with a bright cap flashing, lit slope north/west, shaded
  slope south/east with a rust streak, ribs perpendicular to the run
  as CONTINUOUS lines.
- SCOPED AFTER LOOKING: the first wire skinned the 9x9 sheds too and
  they read as one giant corduroy sheet WITH THE PLAYER WALKING ON IT -
  wrong twice over. Wide blobs keep their generic mass until a real
  shed treatment exists; the gable is the BRIDGE's read. Pieces stay
  banked for whatever that treatment reuses.
- COOK: tools/tfcook/TF-ART-021_gallery_cook.py (6 axis-specific
  pieces, galv from the approved pool, rust from the approved plate).
  Bank: banks/tileforms/TF-ART-021_GALLERY_VOLUME_8_26_26.json.
  Verified live at the granary: the gallery ribbons read as galvanized
  bridge runs with the ridge glint. STATUS: COOKED AND WIRED 8/26/26
  (thin runs); the shed treatment is an open item, not a claim.
