# TILE FORM TF-ART-019 — THE GRID KIT (substation yard + battery containers)

## A. IDENTITY
- NAME: The grid's heart — the transformer bays, the switchgear lattice, the
  overhead busbars, the insulators, and the battery container banks next door
- FAMILY/SET: GRID KIT — one steel-and-porcelain vocabulary, two districts:
  substation (MAINTAINED, the NETWORK's eerily perfect half under CLUSTERED
  POWER) and battery (DEAD by its own dossier).
- THE JOB, ONE SENTENCE: the substation's 2,900 named cells and the battery
  yard's 3,360 container cells render as flat generic slabs, so the two
  districts that ARE the grid read as empty buildings instead of machinery.

## B. WHY
- DEMANDED BY: the post-board gap sweep (ART lane's own inventory ranking,
  8/21): 'transformer' and 'battery container' were the two largest named
  surfaces in the whole world still falling to the generic civic mass.
  CLUSTERED POWER is a root law (12% lit, owned, NETWORK eerily perfect)
  and the district that IS that law rendered as anonymous boxes.
- WHAT LOOKS BROKEN TODAY: the substation's 2,900 named cells and the
  battery yard's 3,360 container cells draw as flat generic slabs - two
  whole districts of machinery reading as empty warehouses. The busbar
  cells you are supposed to walk under draw as solid roof.
- MEASURED 8/21 on the walked world (geometry first, art second):
  substation 'transformer' x1547 in 19x20 BAYS (14x15 m - real firewall
  spacing; each bay is ONE transformer and its pad), 'switchgear structure'
  x771 as a thin lattice grid (1-wide runs, 9-11 long), 'busbar / conductor'
  x475 on the OVERHEAD layer, non-solid (48-55-cell runs you pass under),
  'insulator / arrestor' x90 singles; battery 'battery container' x3360 in
  14x16 BANKS (a 14-cell run is 10.5 m - a 40-foot container exactly, so a
  bank is five containers side by side and the art SUBDIVIDES what the world
  merged), 'HVAC / thermal unit' x30 singles.
- SHOPPING CHECK: the power vocabulary already exists in this lane's shipped
  banks - galv steel (TF-ART-012), rust (TF-ART-010), dead glass values
  (starter wall_window); nothing approved covers a transformer, a lattice,
  a conductor or a container lid. Harvested, not re-invented.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At MAP zoom the
  substation reads as its dark fenced rectangle; the kit is a walk-scale read.
- DISTRICT FAMILIES: substation and battery only. The kit never leaks into
  other industrial districts - a transformer bay outside the substation
  would be a lie about where the grid lives.
- LAYER: structure/solid for the transformer bays, container banks, lattice
  and insulators; OVERHEAD non-solid for the busbar runs (the world already
  ruled that - 48-55-cell conductor runs you pass under).
- SOLID? bays/containers/lattice yes - ENTERABLE? no (a transformer bay is
  not a room; interiors stay interior-matches-exterior on real buildings).
- MUST SIT BESIDE: the district's own gravel/concrete yard ground and the
  chain-link perimeter (TF-ART-004); the busbars land only over their own
  named overhead cells.
- EDGE CONTRACT: single placement for the insulator and HVAC singles;
  self-seamless within a bay/bank for the banded pieces (each cell reads
  its own position in the measured blob, so any cut edge lands on a band
  boundary the neighbours agree on).
- NEVER BESIDE: any district that is not the substation or battery yard;
  a lamp glow claiming the machinery self-lights; a busbar cell rendered
  solid (the overhead ruling is the world's, not this kit's to overturn).

## D. WHEN
- ACT: 1
- BEST TIME: both. The substation is the NETWORK's MAINTAINED half under
  CLUSTERED POWER - eerily perfect, but it does not GLOW; nothing in the
  kit self-lights (LIGHT=TERRITORY is about lamps, not machinery). The
  battery yard is DEAD by its own dossier: cold lids, no hum.
- WEATHER STATES: sunny baseline; dust and UV are the only aging. No
  green, no moss, ever.
- LIT/UNLIT: unlit, both districts, always - MAINTAINED means straight
  and clean, never glowing; DEAD means cold.
- ANIMATION: static (leaf-pixel law untouched; nothing in the kit moves).

## E. HOW
- EXACT SIZE: 44px corpus cell; pieces band multi-cell blobs (19x20 bay,
  14x16 bank) rather than exceeding the cell.
- VIEW: the world's three-quarter 45 (45 DEGREE ART LAW) - sky-lit tops,
  ellipse cross-sections on the bushings, lids bowing toward the viewer.
- PALETTE: harvested only - galv steel greys (TF-ART-012), rust
  (TF-ART-010), dead glass values (starter set). No purple, ever.
- LIGHT: one sky light, top-lit; no self-light, no glow.
- SHADOWS: none baked beyond each mass's own face shading (the separate-
  shadow law; the runtime pass owns cast shadows).
- SCALE ANCHORS: a transformer tank fills most of its bay cell footprint;
  a container lid is exactly 14 cells per five-lid run; bushings read at
  2-3px ellipses, one pixel not three at cell scale.
- WEAR LEVEL: substation MAINTAINED (straight rows, clean pads,
  humming-silent); battery DEAD (streaked lids, one gap seam where a
  container was hauled out).
- VARIANTS: two per banded piece (the th() dither picks), singles carry
  their own two states; conductors are 1px sagging CONTINUOUS lines,
  never dotted (dots read as stipple, banned 8/21).
- SEAMS: bay pieces band by position in the measured 19x20 bay (pad ring,
  tank, radiator wall); container pieces band the 14-cell run so five
  40-foot lids subdivide what the world merged. Full build spec lives in
  the cook docstring (tools/tfcook/TF-ART-019_grid_cook.py).
- NO readable text anywhere (words are his).

## F. THE CAPTION
```json
{
  "id": "TF-ART-019",
  "name": "grid kit - substation machinery and battery containers",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": ["substation", "battery"],
  "best_time": "both",
  "best_location": "the substation's transformer bays and the battery yard's container banks",
  "place_next_to": ["gravel yard", "concrete_0", "chain-link fence", "busbar / conductor"],
  "never_next_to": ["any district that is not the substation or the battery yard", "a lamp glow claiming the machinery self-lights"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "single placement for the insulator and HVAC singles; self-seamless within a banded bay or container bank",
  "tags": ["substation", "battery", "transformer", "switchgear", "busbar", "container", "grid"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json (the
  approved galv steel, parapet_galv_run_n_a - the tank and lattice metal is
  harvested from it, so the kit sits beside the roofs it already matches).
- NAMED OUTSIDE REFERENCE: the SimCity 4 power-plant sprite family and
  Factorio's substation/accumulator pieces - both read a transformer as
  TANK MASS + RADIATOR WALL + BUSHINGS at a glance from a 45-ish view, the
  exact silhouette hierarchy this kit borrows; neither outlines every fin.
- REAL-WORLD GROUNDING: a US distribution substation spaces transformer
  bays on ~14x15 m centres for firewall separation, which is exactly the
  19x20-cell bay the walked world measured; a 40-foot ISO container is
  12.19 m = 14 cells at 0.87 m/cell, so a 14-cell "battery container" run
  is FIVE containers side by side; grid-scale battery yards (e.g. the real
  Techren/Gemini sites outside Vegas) park those containers in exactly
  such touching rows with HVAC packs on the ends.
- ALSO OPENED IN CODE: banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  (approved rust, rail_plate_0) and banks/BOHEMIA_STARTER_TILESET_ACT1_
  RECOOK_7_28_26.txt (dead glass values, yard grounds).

## H. DON'T WANT
- NOT a generic industrial box with pipes drawn on - the bay reads from the
  tank mass + radiator wall + bushings, or it is not a transformer.
- NOT dotted/stippled conductor lines (banned 8/21; two faint continuous
  1px lines are the busbar).
- NOT a glowing substation - MAINTAINED is straight and clean, never lit.
- NOT container logos, unit numbers or any readable text - words are his.
- NOT flat side-on elevations (45 DEGREE ART LAW).

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the substation and battery yard
      (sitting-record pass 37, live frames in the ART tab card)
- [x] Busbar cells stay pass-under (overhead layer respected)
- [x] No purple, no self-light, no readable text
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED (8/21/26) | REQUESTED BY: ART lane (own queue,
  the post-board gap sweep) | DATE: 8/21/26 | PRIORITY: HIGH
- VERDICT: shipped under EVERYTHING IS A THUMB (8/9). Details in the cook
  docstring and sitting-record pass 37.
