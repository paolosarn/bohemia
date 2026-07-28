# TILE FORM TF-CITY-006 — THE DRIVEWAY APRON AND THE ROLLED CURB CUT

## A. IDENTITY
- NAME: Where a driveway crosses the kerb and meets the street
- FAMILY/SET: STREET/DRIVE joinery family. One drawing job: the apron flare
  (left and right wings), the rolled-curb cut across the gutter, and the
  driveway-to-sidewalk crossing course.
- THE JOB, ONE SENTENCE: this exists because the drivable network is a legally
  EXPLICIT car surface under the street-aware law, and right now a driveway
  simply stops at the kerb — there is no piece of art anywhere in the game
  that says a car can get from the road onto the lot.

## B. WHY
- DEMANDED BY: the STREET-AWARE / DRIVABLE ACCESS LAW (7/19) — "the drivable
  network (driveway + lot aisles) is an EXPLICIT car surface, separate from
  walking paths, and a car reaches EVERY stall from the curb". The kerb is
  named in the law itself; the crossing of it has no representation. Also the
  suburb dossier's decisions: "Every home has a proper street -> driveway ->
  front-garage (Paolo ruling)" — the arrow between street and driveway is the
  missing object.
- WHAT LOOKS BROKEN TODAY: measured in the run's tile resolver. A driveway
  cell (code 3) returns `['concrete_0','concrete_1']`, the exact same two
  tiles used for the gate mouth and for generic paving. The kerb band returns
  `walk_kerb` whenever a yard cell touches a road, with no case for "a
  driveway crosses here", and the road side returns `road_gutter` against the
  kerb regardless. So the driveway, the kerb and the gutter all meet in a butt
  joint of three unrelated tiles. On screen (scratchpad x_door.png) the
  driveway reads as a pale rectangle that stops dead at a grey line.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md. STARTER
  TILESET (42) opened and enumerated: it has `concrete_0/1`, `walk_0/1/2`,
  `walk_kerb`, `road_gutter`, `road_crossing`, `road_centre`, `road_0/1/2` —
  every one of them a straight field or a pedestrian crossing; there is no
  apron and no kerb cut. STREET BLOCKS row
  (banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt, 5 researched lanes)
  checked: lane surfaces, not kerb joinery. ROAD MARKINGS/ARROWS (84 items, 14
  classes, "I like all of them") checked and disqualified for a real reason —
  they are PAINT, and an apron is GEOMETRY; the markings bank is separately
  flagged in the index as having no live consumer, which is a routing debt,
  not this gap. Nothing in the index crosses a kerb.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At map zoom: not read.
- DISTRICT FAMILIES: suburb first, then every district that fronts a road and
  has a car entrance — which by the street-aware law is ALL of them. Commercial
  lots, storage, firestation, school, trailer, farm.
- LAYER: ground
- SOLID? no — ENTERABLE? no (it is the floor a car drives on)
- MUST SIT BESIDE: `concrete_0/1` driveway on the lot side; `road_gutter` and
  `road_0/1/2` on the street side; `walk_kerb` and `walk_0/1/2` on the two
  flanks where the sidewalk continues past it.
- NEVER BESIDE: `road_crossing` (a pedestrian crossing and a vehicle apron
  never occupy the same kerb cell — that is a real-world conflict too); a
  perimeter wall (a car cannot drive through a wall; that is the GATE,
  TF-CITY-005); a yard on the street side.
- EDGE CONTRACT: WANG-16 edge set. Three cases with left/right mirrors. Every
  edge must hash to the field tile it joins — driveway edge to `concrete`,
  street edge to `road_gutter`, flank edges to `walk_kerb` — per the
  constitution's seam contract. This piece is ALL seam, so the hash test is
  the whole acceptance test.

## D. WHEN
- ACT: 1
- BEST TIME: both. No self-light.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN-WET matters here more
  than anywhere else in the CITY lane, because the gutter is where water
  actually goes — a wet variant should read as a damp gutter line and a
  darkened apron, value shift only. (Vegas rain is rare and dramatic, per the
  7/28 weather ruling; the gutter is where it shows.)
- LIT/UNLIT: none.
- ANIMATION: static.

## E. HOW
- EXACT SIZE: 44 x 44 px cells, matching the frozen starter tileset. The apron
  is 2-3 tiles wide (a real drive is ~16-20 ft at the kerb) with a wing at
  each end.
- VIEW: 45-degree world view. Ground reads mostly flat, BUT the kerb has real
  height and the whole point of this piece is that the height goes to ZERO
  across the cut — that ramp is the object. A flat painted stripe is the
  failure.
- PALETTE: constitution ceiling. Value band: **ground** (mean 103.7, lo 49.3,
  hi 152.2). Fresh-ish concrete sits at the top of the band, the asphalt it
  meets near the bottom — the value STEP between them is what reads as a kerb.
- LIGHT: upper left, shadows down and to the right. NO keyline (a kerb line
  drawn as black is the single most likely violation in this whole form). NO
  dither.
- SHADOWS: none baked. The kerb's own micro-shadow is the runtime pass.
- SCALE ANCHORS: a Clark County residential driveway is ~16-20 ft at the kerb
  and the suburb dossier already measures a 6 m driveway on a 16 m lot; a
  standard kerb face is 6 inches, so at ~0.75 m per cell the kerb's height is
  a SLIVER, not a step you would trip over. Get that wrong and the street
  reads as a canal.
- WEAR LEVEL: ten years, no street maintenance, and this specific joint is
  where pavement fails first in real life: the apron cracks along the cold
  joint where the driveway meets the county concrete, silt and gravel wash
  into the gutter and stay, the kerb face spalls where cars clipped it. Dead
  weeds in the gutter joint are a DEAD FOLIAGE ask (board row 5), not this
  form — but this form must leave room for them.
- VARIANTS: rolled-curb version (the residential standard) and a vertical-kerb
  version (the arterial/commercial case). Two variants, same job. Left/right
  mirrors count as the edge set, not as variants.

## F. THE CAPTION
```json
{
  "id": "TF-CITY-006",
  "name": "driveway apron and kerb cut",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["suburb", "commercial", "storage", "firestation", "school", "trailer", "farm"],
  "best_time": "any",
  "best_location": "the one cell run where a driveway crosses the kerb onto the street",
  "place_next_to": ["driveway concrete", "road_gutter", "road", "walk_kerb", "sidewalk"],
  "never_next_to": ["road_crossing", "perimeter wall", "yard on the street side"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16",
  "anim": null,
  "tags": ["ground", "drivable", "kerb", "apron", "street-aware", "seam"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen CBB starter tileset's `concrete_0/1`,
  `walk_kerb` and `road_gutter` — this piece is cooked to join them, so they
  are its colour and value truth by definition, and its seam rings are already
  published in records/target/BOHEMIA_VISUAL_CONSTITUTION.json.
- NAMED OUTSIDE REFERENCE: Cities: Skylines' kerb-cut geometry for the
  VOCABULARY of what an apron actually needs (a flare, a ramp, a wing) — take
  the anatomy, never the rendering. Secondary: Project Zomboid's driveway
  entrances for how little you need at this zoom before a car surface reads
  as continuous.
- REAL-WORLD GROUNDING: Clark County publishes this exact object as a Uniform
  Standard Drawing, and the details are specific and usable. Residential
  streets in the valley use ROLLED (R-type) curb and gutter, and the standard
  restricts R-type curb to DRIVEWAY LOCATIONS unless otherwise approved — so
  in a real Vegas subdivision the kerb profile literally changes where the
  driveway is, which is precisely the visual event this form is asking for and
  is the reason it is worth a tile rather than a paint decal. The standard
  also requires the driveway to be MONOLITHIC to the asphalt line, meaning
  the concrete runs unbroken to the road with no gap — so the failure line
  after ten years is a crack along that joint, not a missing chunk. Arterials
  and commercial frontages use the "L" type vertical curb, which is why this
  form carries two variants.

## H. DON'T WANT
- NOT a painted stripe. This is geometry, not markings. The markings bank
  exists and is a separate routing question.
- NOT a tall kerb. A 6-inch face at our scale is a sliver; a chunky kerb turns
  every residential street into a canal and destroys the human scale the
  starter set establishes.
- NOT a black kerb line. Value step, per the constitution's outline rule.
- NOT a commercial loading apron. Wrong width, wrong wear, wrong district.
- NOT clean new concrete. Ten years of no street maintenance.
- NOT weeds baked into the tile — those come from the DEAD FOLIAGE set (board
  row 5) at the prop layer, so this tile must not pre-empt them.

## I. ACCEPTANCE
- [ ] Seam ring hash on ALL FOUR neighbours (concrete, road_gutter, road,
      walk_kerb) — this piece is entirely seam, so a hash miss is a fail
- [ ] Palette ceiling + **ground** band (103.7, 49.3-152.2) + one-light +
      no-keyline + no-dither checks green
- [ ] Squint test: at walk zoom the car surface must read as CONTINUOUS from
      street to garage — that is the law being satisfied
- [ ] 3x3 tiled proof of the joint, plus a FULL FRONTAGE proof: street,
      gutter, apron, driveway, garage bay, in one strip
- [ ] ON THE REAL SURFACE: the run, standing in the street outside a house,
      beside today's butt-jointed render
- [ ] Both variants (rolled and vertical) shown together
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CITY lane (measured 7/28 in the run's tile
  resolver — driveway, kerb and gutter are three unrelated field tiles butted
  together) | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 65 | VERDICT: —
