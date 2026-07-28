# TILE FORM TF-ART-003 — PARKING LOT STRIPING (STALLS, AISLES, WHEEL STOPS)

## A. IDENTITY
- NAME: Parking lot striping (stalls, aisles, wheel stops)
- FAMILY/SET: LOT MARKING family — single stall line, double line, stall end, ADA stall with hatching, wheel stop, painted aisle arrow reuse
- THE JOB, ONE SENTENCE: this tile family exists so that every lot in the valley stops being a blank asphalt void and reads as a place cars were parked, which is the difference between the walkable-land law being satisfied and being gamed.

## B. WHY
- DEMANDED BY: the WALKABLE-LAND LAW (Paolo 7/20) — pavement is connective tissue and must be DRESSED, never a void; the vehicular-venue exemption (drive-in, truck stop, parking structure) explicitly still requires dressing. Plus BOHEMIA_TILE_REQUESTS row 7.
- WHAT LOOKS BROKEN TODAY: the drive-in, truck stop, stadium, school, storage, police impound and every commercial lot are flat asphalt with nothing on them. The fire-station v1 failure that triggered the whole walkable-land law was 52% empty apron - the same emptiness is still on every lot, just under the cap now
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. ROAD MARKINGS/ARROWS bank (84 items, 14 classes, "I like all of them", Paolo 7/17) checked FIRST and it is a genuine partial: it holds turn arrows and lane markings for ROADS, which the lot aisles can reuse directly. It does NOT hold parking STALL geometry — no stall lines, no stall ends, no ADA hatching, no wheel stops. STARTER SET road_crossing is crossing bars across traffic, not stalls. So: reuse the arrows, file this for the stall set.

## C. WHERE
- SURFACE + TAB: RUN + CITY; at map zoom lots read as texture, no icon
- DISTRICT FAMILIES: every district with a lot: commercial, drive-in, truck stop, stadium, school, storage, police, medical, terminal, waterpark, swap meet, park
- LAYER: ground
- SOLID? no — ENTERABLE? n/a
- MUST SIT BESIDE: asphalt (the starter set road tiles are the same material and must share the ramp); concrete apron; kerb; wheel stops sit ON it
- NEVER BESIDE: never on a residential driveway (a house driveway is unstriped concrete); never crossing a road lane; never on desert ground
- EDGE CONTRACT: WANG-16 edge set — a stall row has ends and corners and the line must not restart mid-row; the field between stalls is the plain asphalt tile already approved

## D. WHEN
- ACT: 1
- BEST TIME: both; paint is the one thing that still catches light at night under a working lamp
- WEATHER STATES: sunny baseline; RAIN makes faded paint briefly readable again as the wet asphalt darkens around it — a real and cheap effect
- LIT/UNLIT: no
- ANIMATION: static

## E. HOW
- EXACT SIZE: 44 px cell; a real stall is 9ft x 18ft, so ~3.6 cells long and ~1.8 wide at CELL_M 0.75 — the line tile is a cell of asphalt carrying one edge line
- VIEW: 45-degree world view — ground plane, flat, no thickness on paint
- PALETTE: asphalt family ramp + ONE white-paint accent (paint is content outside the material range, exactly like the crossing bars)
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none; paint casts nothing
- SCALE ANCHORS: car footprint is 2x3 tiles by Paolo's locked law, read out of engine/bohemia_prop_scale.js — a stall MUST fit that car with door clearance or the whole lot is wrong
- WEAR LEVEL: paint 30-70% gone, worn most in the wheel tracks and at the stall mouth, surviving best under where cars sat
- VARIANTS: single line, double line (between stalls), stall end, ADA blue+hatch, wheel stop (prop layer, filed here because it is one drawing job)

## F. THE CAPTION
```json
{
  "id": "TF-ART-003",
  "name": "parking lot striping",
  "layer": "ground",
  "solid": false,
  "enter": true,
  "district_families": [
    "every district with a lot: commercial",
    "drive-in",
    "truck stop",
    "stadium",
    "school",
    "storage",
    "police",
    "medical",
    "terminal",
    "waterpark",
    "swap meet",
    "park"
  ],
  "best_time": "both",
  "best_location": "parking lots and aisles of any non-residential district",
  "place_next_to": [
    "asphalt",
    "concrete apron",
    "kerb",
    "wheel stop"
  ],
  "never_next_to": [
    "residential driveway",
    "road lane",
    "desert ground"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "WANG-16 edge set",
  "anim": null,
  "tags": [
    "ground",
    "paint",
    "lot",
    "dressing"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the starter set road_crossing (approved white paint on approved asphalt, at the right value and the right wear) — this is the same paint job at a different geometry
- NAMED OUTSIDE REFERENCE: the overhead lot geometry in Cities: Skylines for stall pitch discipline; and real Clark County code, which is the actual reference here
- REAL-WORLD GROUNDING: Clark County parking code: standard stall 9ft x 18ft, drive aisle 24ft for two-way. Vegas lots are sealcoated asphalt, so the black goes grey-brown within a few summers and the white thermoplastic paint chalks and lifts. After thirty years with no maintenance, the SEALCOAT is what fails first: the lot goes pale and blotchy and the paint survives in patches, brightest where a car shaded it.

## H. DON'T WANT
- NOT crisp bright new paint — this lot has not been restriped since the money died
- NOT yellow lines everywhere (yellow is DIRECTION on roads by our own LINE COLOR law; stalls are white)
- NOT a full grid drawn over every lot cell — the field between stalls is plain asphalt, or the lot becomes the graph-paper failure again
- NOT stalls too small for the 2x3 car — that is an instant, visible lie

## I. ACCEPTANCE
- [ ] Seam measured (edge contract above): wrap delta within the normal neighbour
      step, no edge-darkening (the desert-pool lesson)
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1,
      pillow score, cluster density, set-wide palette
      (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md)
- [ ] Palette ceiling + this layer's value band + one-light checks green
- [ ] Squint test at map zoom (where this family has a map presence)
- [ ] 3x3 TILED PROOF SHEET rendered — never judged as a lone tile
- [ ] ON THE REAL SURFACE: screenshot in place in its district, beside the
      approved anchor named in G
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 12 | VERDICT: —
