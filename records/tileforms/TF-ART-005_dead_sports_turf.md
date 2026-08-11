# TILE FORM TF-ART-005 — DEAD SPORTS TURF AND RUNNING TRACK

## A. IDENTITY
- NAME: Dead sports turf and running track
- FAMILY/SET: SPORTS SURFACE family — dead grass field, painted yard/field lines, running-track surface, track lane lines, infield dirt
- THE JOB, ONE SENTENCE: this tile family exists so that the school, the stadium and the park stop being flat green-less nothing where their fields are, which is most of their footprint and therefore most of what those districts ARE.

## B. WHY
- DEMANDED BY: district gates assert them: school ("field+track, courts"), stadium ("seating bowl, FIELD"), park ("field, diamond, courts"), golf ("tee/fairway/green"). Plus the walkable-land law: a field is content, not pavement, and it has to look like content.
- WHAT LOOKS BROKEN TODAY: the school and stadium fields are drawn as generic ground, so the biggest single surface in two districts carries no information at all
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. DESERT/TERRAIN picks (13) + desert/rock pools checked: those are natural Mojave ground, correct for open desert and wrong for a maintained-then-abandoned sports field, which is a DIFFERENT history — it was irrigated turf and it died, which looks nothing like ground that was never watered. STARTER yard_0/1/2 is dead gravel yard, a residential surface. Nothing in the index claims sports turf or track.

## C. WHERE
- SURFACE + TAB: RUN + CITY; at map zoom the track oval is one of the most recognisable shapes in the valley and is a strong icon candidate
- DISTRICT FAMILIES: school, stadium, park, golf (fairway/green variants), waterpark (lawn areas)
- LAYER: ground
- SOLID? no — ENTERABLE? n/a
- MUST SIT BESIDE: itself; the track surrounds the field; concrete apron and bleacher bases; chain-link backstops; desert ground at the edges where the irrigation stopped first
- NEVER BESIDE: never inside a building; never beside a residential lawn (different death: a lawn dies patchy, a field dies uniformly because it was one irrigation system)
- EDGE CONTRACT: SELF-SEAMLESS for field and track surface; the painted lines are a WANG-16 edge set so a yard line runs straight across tiles and stops where it should

## D. WHEN
- ACT: 1
- BEST TIME: both; nothing self-lights
- WEATHER STATES: sunny baseline; RAIN is the one that matters — dead turf and the dirt infield go dark and the track surface goes near-black, which is the cheapest weather read in the game
- LIT/UNLIT: no
- ANIMATION: static

## E. HOW
- EXACT SIZE: 44 px cell; a track lane is 1.22m so under two cells wide at CELL_M 0.75 — lanes will read as pairs of cells, and that is fine
- VIEW: 45-degree world view — pure ground plane, flat, quiet
- PALETTE: constitution ceiling; GROUND band; dead-turf family is straw/bone with NO green (act 1 is thirty years without water) + one paint accent for lines + a separate rust-red family for the track
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none
- SCALE ANCHORS: a football field is 100 yards; at CELL_M 0.75 that is ~122 cells, so this surface is seen mostly at distance and MUST stay quiet
- WEAR LEVEL: the turf died uniformly and then blew away in patches; the dirt underneath shows through in the traffic paths; painted lines survive as ghosts; the track surface is cracked and lifting at the seams with weeds in every crack
- VARIANTS: dead turf, turf-with-line, track surface, track-with-lane-line, infield dirt

## F. THE CAPTION
```json
{
  "id": "TF-ART-005",
  "name": "dead sports turf and running track",
  "layer": "ground",
  "solid": false,
  "enter": true,
  "district_families": [
    "school",
    "stadium",
    "park",
    "golf (fairway/green variants)",
    "waterpark (lawn areas)"
  ],
  "best_time": "both",
  "best_location": "school and stadium fields, park sports areas",
  "place_next_to": [
    "dead turf",
    "running track",
    "concrete apron",
    "chain-link fence",
    "desert ground"
  ],
  "never_next_to": [
    "building interior",
    "residential lawn"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS for field and track surface; the painted lines are a WANG-16 edge set so a yard line runs straight across tiles and stops where it should",
  "anim": null,
  "tags": [
    "ground",
    "sports",
    "dead",
    "quiet"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the starter set yard_0/1/2 for how dead ground is valued in this world; the CBB target for the ground band
- NAMED OUTSIDE REFERENCE: the abandoned-stadium photography of Pripyat and the Astrodome for what a dead field actually does — it does not become desert, it becomes a pale mat of dead thatch with the shape still in it
- REAL-WORLD GROUNDING: Las Vegas school and municipal fields are irrigated bermuda or ryegrass over sand; the moment irrigation stops in a Mojave summer, bermuda goes dormant straw-gold in about three weeks and dead in a season, leaving a pale thatch mat that persists for YEARS before it fully breaks down. Rubberised track surface (polyurethane over asphalt) is brick-red, chalks pale under UV, and fails at the seams first.

## H. DON'T WANT
- NOT green, in any act-1 tile — this is the single most likely mistake and it is a lore error, not a taste one
- NOT sand/desert — a dead field is a mat, not bare ground, and the difference is the whole point
- NOT busy: it is a huge surface at distance and must stay quiet under everything on it
- NOT crisp bright field lines

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
- STATUS: APPROVED by Paolo 8/11/26 (TILE BOARD sitting, UP; bank: banks/tileforms/TF-ART-005_CANDIDATES_8_8_26.json now carries the APPROVED law line; verdict: records/BOHEMIA_TILE_BOARD_VERDICT_8_11_26.txt). Volume unlocked, wiring open. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 14 | VERDICT: —
