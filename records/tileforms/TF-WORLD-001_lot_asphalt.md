# TILE FORM TF-WORLD-001 — LOT ASPHALT & APRON (the biggest surface in the valley)

## A. IDENTITY
- NAME: Parking-lot asphalt (the cracked black-grey everything is parked on)
- FAMILY/SET: PAVED SURFACE family — lot asphalt base + a cracked/patched
  variant + the asphalt-to-desert and asphalt-to-concrete blob edges. ONE
  drawing job.
- THE JOB, ONE SENTENCE: this tile exists so that the single largest man-made
  surface in Las Vegas stops rendering as a flat grey fill and reads as real
  weathered asphalt, because the approved 84-item MARKING bank has nothing to
  be painted ON.

## B. WHY
- DEMANDED BY: the 7/28 measured finding in
  records/BOHEMIA_LEGIBILITY_BIBLE_7_28_26.md — **Las Vegas devotes 32% of its
  central city to parking, the highest of any major American city**; plus
  Paolo's bulk verdict twice over ("way to many parking spots" on commercial,
  "the parking is fucked" on ballpark). The ruling that followed:
  PAVEMENT IS NOT CONTENT UNTIL SOMETHING HAPPENS ON IT — but it still has to
  BE something, and right now it is nothing.
- WHAT LOOKS BROKEN TODAY: 45 district generators declare a paved surface
  (parking asphalt / lot asphalt / apron / drive aisle / secure-yard concrete /
  concrete pad), all of them rendering as one flat value. A third of most plots
  is a grey rectangle. It is the visual definition of an absence.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * ROAD MARKINGS/ARROWS (84 items, 14 classes, "I like all of them"): these
    are the PAINT, not the surface. They are approved and they have nothing to
    sit on. This form is the substrate they need.
  * STREET BLOCKS (5 researched lanes, REAL_VEGAS R2): those are the ROADWAY
    between kerbs — a different material with a different wear pattern (wheel
    polish in two tracks, centre crown). A car park is flat, cracked all over,
    and patched. Does not cover.
  * STARTER TILESET (42, frozen CBB): one residential street. No lot surface.
  * DESERT/TERRAIN pool: measured broken (row 4) and is dirt, not asphalt.
  Nothing in the index claims lot asphalt.

## C. WHERE
- SURFACE + TAB: RUN (the walk) + CITY (the human-mode ground plane). At map
  zoom it is flat colour, no icon.
- DISTRICT FAMILIES: nearly all — commercial, mall, medical, apartment,
  waterpark, warehouse, storage, school, ballpark, stadium, speedway, drivein,
  truckstop, swapmeet, terminal, policestation, jail, firestation, campus,
  town, plus every district apron.
- LAYER: ground
- SOLID? no — ENTERABLE? n/a (it is the floor)
- MUST SIT BESIDE: itself endlessly; the approved MARKING bank painted on top;
  kerb + gutter (TF-WORLD-002); desert ground (TF-RUN-001) via blob edge;
  concrete plaza; building footprints.
- NEVER BESIDE: interior floors; dead turf without a kerb or edge between them
  (asphalt never fades into grass — there is always an edge, that is what
  makes it man-made).
- EDGE CONTRACT: SELF-SEAMLESS base (wraps all 4 edges) + BLOB-47 for the
  asphalt-to-desert transition. Seam MEASURED before judging, per the
  desert-pool lesson — no edge darkening of any kind.

## D. WHEN
- ACT: 1
- BEST TIME: both. At night it is the darkest large surface in a district and
  the thing lit places sit inside of; no self-light.
- WEATHER STATES: sunny baseline; cloudy needs nothing; RAIN-WET matters most
  here — asphalt is the surface that most obviously goes dark and reflective
  when wet, and per the 7/28 weather ruling rain is rare and therefore worth
  selling. Value-shift colorway, same geometry.
- LIT/UNLIT: no self-light. Pole lights are separate props and LIGHT=TERRITORY
  decides which lots are lit at all.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: one tile = the run's grid cell, authored at the frozen starter
  tileset's native px (CITY blits at 22px; both must consume without
  resampling). Footprint 1x1.
- VIEW: 45-degree world view; a ground plane, sky-lit top, no side faces.
- PALETTE: constitution ceiling; GROUND value band (must sit UNDER structure
  values so building fronts pop).
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked — the shadow pass is separate.
- SCALE ANCHORS: a parking stall is ~2.6 m x 5.4 m; at 0.75 m/tile that is
  roughly 3.5 x 7 tiles, so crack spacing must not read as stall-sized.
- WEAR LEVEL: sun-destroyed. Mojave UV greys asphalt from black to pale
  grey-brown within years; then it goes CROCODILE — interlocking block
  cracking — then weeds take the cracks. Patches are darker than the field
  they sit in. No potholes deep enough to read as holes at walk zoom.
- VARIANTS: base, heavy-cracked, patched, wet colorway. Shape variants beyond
  that need their own form.

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-001",
  "name": "lot asphalt",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["commercial","mall","medical","apartment","waterpark","warehouse","storage","school","ballpark","stadium","speedway","drivein","truckstop","swapmeet","terminal","policestation","jail","firestation","campus","town"],
  "best_time": "any",
  "best_location": "any lot, apron or drive aisle inside a district boundary",
  "place_next_to": ["lot asphalt","stall marking","kerb and gutter","concrete plaza","desert ground (blob edge)"],
  "never_next_to": ["interior floor","dead turf without an edge"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "self-seamless + blob-47 to desert",
  "anim": null,
  "tags": ["ground","pavement","asphalt","parking","substrate"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved ROAD MARKING bank (84 items) — this surface
  must be authored so those markings read correctly painted onto it; and the
  frozen CBB target's ground value band.
- NAMED OUTSIDE REFERENCE: Pocket City 2 for how a paved surface stays QUIET
  under busy buildings without going flat-dead (Paolo's own stated bar). Also
  Disco Elysium's paving for wear that reads as history rather than noise.
- REAL-WORLD GROUNDING: Clark County surface lots. Asphalt here is laid over
  caliche subgrade; UV and 45 C summers oxidise the bitumen so the black is
  gone in a few years and it goes pale grey. The failure mode is CROCODILE
  CRACKING (interlocking polygons from fatigue), then crack-seal patches in
  darker fresh bitumen, then weeds in every joint. There is no frost heave
  here — Vegas asphalt dies of sun, not ice, so the damage is even and
  all-over rather than edge-first.

## H. DON'T WANT
- NOT fresh black asphalt. Nothing in this world was resurfaced.
- NOT potholes as dark blobs — reads as damage decals, not a surface.
- NOT a regular crack lattice: cracking that repeats on the tile grid becomes
  exactly the graph-paper failure the desert pool was killed for.
- NOT noisy. This is the QUIET floor under everything; a busy lot is a failed
  lot, and it is the biggest surface on screen.
- NOT wet-look by default (that is the rain colorway only).

## I. ACCEPTANCE
- [ ] Seam measured: wrap delta within the normal neighbour step, zero edge
      darkening (the desert-pool ruler)
- [ ] Palette ceiling + GROUND value band + one-light checks green
- [ ] 10x10 boredom check: no visible repeat motif, no crack aligning to grid
- [ ] 3x3 TILED PROOF SHEET
- [ ] ON THE REAL SURFACE: a commercial or ballpark lot wearing it, with
      approved markings painted on top, beside the current flat-grey render
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 10 | VERDICT: —
