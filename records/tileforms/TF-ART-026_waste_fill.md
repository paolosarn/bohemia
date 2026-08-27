# TILE FORM TF-ART-026 — WASTE FILL (the landfill's compacted trash)

## A. IDENTITY
- NAME: Waste fill — the compacted trash surface of the landfill's cells,
  with the cell berms wired as pure reuse of the approved magazine berms
- FAMILY/SET: DEAD GROUND — sibling of the dry beds (TF-ART-025) in the
  landform-ground family.
- THE JOB, ONE SENTENCE: the landfill's DOMINANT surface (6,400+ cells
  per district cell) draws as the same gravel fallback as every
  unclaimed ground.

## B. WHY
- DEMANDED BY: the fresh inventory ranking (8/26 re-sweep) put 'waste
  fill' at the top of the remaining queue; the 8/27 walk MEASURED it at
  6,803 and 6,469 cells on the two landfill district cells - the
  biggest single surface in the district by 40%.
- WHAT LOOKS BROKEN TODAY: the dump - the district whose whole identity
  is its ground - draws its fill as generic yard gravel, and its berm
  rings draw as nothing at all.
- MEASURED 8/27 on the walked world: 'waste fill' x6803+x6469,
  'cell berm' x2406+x2052 (thin-axis histogram: 1,917 of 2,406 cells at
  exactly 3 thick - the same ridge grammar as the arsenal's magazine
  berms), 'cover soil / dirt' x4026+x4818 (already lands in the dirt
  family by name, correct).
- SHOPPING CHECK: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt
  (approved dirt), banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json
  (approved pale) and banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  (approved rust) exist and are the three pools; the berm needs NO new
  pixels - the approved mag_ pieces already ARE an earth berm ridge.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode).
- DISTRICT FAMILIES: landfill only.
- LAYER: ground (waste fill); structure (cell berm - blocks, like the
  magazine berms it reuses).
- SOLID? fill no - berm follows the district's own occupancy; ENTERABLE? no.
- MUST SIT BESIDE: cover soil, haul roads, the cell berms that ring
  each fill cell, the perimeter fence.
- EDGE CONTRACT: self-seamless - matched earth base across the three
  hashed variants; the berm bands by the thin axis of its ring arm
  exactly like the magazine branch.
- NEVER BESIDE: nothing outside the landfill.

## D. WHEN
- ACT: 1
- BEST TIME: both.
- WEATHER STATES: sunny baseline; deep_wet stays weather's.
- LIT/UNLIT: unlit always (LIGHT=TERRITORY).
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44px corpus cell, full-cell opaque ground tiles.
- VIEW: flat ground plane in the world's three-quarter 45; the berm
  reuses the mag_ ridge pieces whose lit/shaded flanks already carry
  the NW light.
- PALETTE: harvested only - cover-soil earth from the approved dirt,
  bleached-plastic flecks from the approved kerb pale, scrap rust from
  the approved rail plate (red-leads-both-channels test). No purple.
- LIGHT: one sky light; no self-light.
- SHADOWS: none beyond the refuse patches' own darkness.
- SCALE ANCHORS: refuse patches 3-8px wandering blobs - metre-scale
  breaches in the cover at 0.87 m/cell; flecks 2-4px, real half-metre
  debris.
- WEAR LEVEL: thirty years picked over; the compactor track pass on one
  variant reads as compaction, the machine itself long dead.
- VARIANTS: three (wf_0/1/2) hashed per cell; wf_2 carries the track.
- CRAFT: refuse patches are drunk-walk grown, never discs; flecks are
  little OFF shapes, never single-pixel salt (8/1 law, 8/21 stipple ban).

## F. THE CAPTION
```json
{
  "id": "TF-ART-026",
  "name": "waste fill - compacted trash under worn cover soil",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["landfill"],
  "best_time": "both",
  "best_location": "the fill cells inside the landfill's berm rings",
  "place_next_to": ["cell berm", "cover soil", "haul road"],
  "never_next_to": ["any district outside the landfill", "anything wet"],
  "weather_ok": ["sunny", "cloudy"],
  "acts": [1],
  "edge_contract": "self-seamless - matched earth base across three hashed variants",
  "tags": ["landfill", "trash", "fill", "dump", "berm"],
  "anim": "static"
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt
  (dirt - the cover soil IS the approved earth, so the fill sits in the
  same value family as every dirt yard it meets).
- NAMED OUTSIDE REFERENCE: the trash-field grounds in Fallout 4's
  Junkyard cells and Kenshi's waste zones both read landfill as EARTH
  FIRST, refuse second - a dun ground with dark chaos breaking through,
  never a carpet of drawn objects, exactly this tile's grammar.
- REAL-WORLD GROUNDING: Apex Regional Landfill north-east of Vegas is
  the largest landfill in America - from the air its active face is
  exactly this: dun daily-cover soil rolled flat by compactors, dark
  refuse showing through where the cover is thin, the white-and-pale
  fleck of plastic that never rots, all of it ringed by engineered
  earth berms about two metres high - the three-cell ridge the wiring
  reuses from the arsenal's approved magazine berms.
- ALSO OPENED IN CODE:
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json (kerb_return_ne),
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json (rail_plate_0).

## H. DON'T WANT
- NOT a carpet of drawn trash objects - the fill is a GROUND, earth
  first, refuse breaking through.
- NOT dot stipple (banned 8/21) - flecks are 2-4px off shapes.
- NOT bright plastic colors - thirty years of sun killed them to bleach
  and rust.
- NOT a new berm cook - the approved mag_ ridge IS the berm (REUSE-FIRST).
- NOT wet, no shine, ever.

## I. ACCEPTANCE
- [x] Cooked from approved banks only (REUSE CHECK in the cook docstring)
- [x] ON THE REAL SURFACE: verified live at the landfill (cell 56,7) -
      fill field and banded berm rings both drawing
- [x] No purple, no self-light, no readable text, no stipple
- [x] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: COOKED AND WIRED 8/27/26 under EVERYTHING IS A THUMB (8/9):
  bank banks/tileforms/TF-ART-026_CANDIDATES_8_27_26.json (3 tiles),
  cook tools/tfcook/TF-ART-026_wastefill_cook.py, wired in the run
  slice's named-cell pass ('waste fill' -> wf_ hashed 3; 'cell berm' ->
  the APPROVED mag_ berm pieces banded by thin axis, zero new pixels).
  Live frame: records/target/ART_WIRED_TF-ART-026.png, card in the ART
  tab.
  | REQUESTED BY: ART lane (fresh inventory ranking) | DATE: 8/27/26
  | PRIORITY: HIGH
- BOARD ROW #: 100 | VERDICT: —
