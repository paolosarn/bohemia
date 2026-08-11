# TILE FORM TF-ART-001 — CMU BLOCK WALL (GREY CONCRETE MASONRY UNIT)

## A. IDENTITY
- NAME: CMU block wall (grey concrete masonry unit)
- FAMILY/SET: CMU BLOCK family — plain course, bond-beam top course, pilaster/corner, vent block
- THE JOB, ONE SENTENCE: this tile family exists so that the twenty-odd industrial, civic and service districts stop being drawn in suburban house stucco, which is the wrong material on every one of them.

## B. WHY
- DEMANDED BY: BOHEMIA_TILE_REQUESTS row 7 (ACT-1 TILESET REMAINDER, ART lane queue) + the district registry: storage, warehouse, industrial, substation, jail, police, school gym, water treatment and railyard are all CMU in real Clark County and all render in stucco today
- WHAT LOOKS BROKEN TODAY: every non-residential building in the valley wears the same pale suburban stucco as the houses, so a jail, a warehouse and a family home are the same material. Paolo has already named this class of miss ("you really should be using the suburb district" was the same complaint from the other side)
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. PERIMETER WALL POOL (26 entries) checked and disqualified: those are approved for the SUBURB BOUNDARY wall specifically (WB4 "PERIMETER"), a freestanding site wall, not a building face with courses and a bond beam. HOUSE SKINS (30 UP) are residential stucco/roof/window, explicitly the house language. HD PACK UP list has no Clark-County CMU family. Nothing in the index claims a building-face masonry unit.

## C. WHERE
- SURFACE + TAB: RUN (the walk) + CITY (human mode); at map zoom it is the building block colour, no icon
- DISTRICT FAMILIES: industrial, warehouse, self-storage, substation, jail, police station, water treatment, railyard, school (gym + service walls), fire station (bays), landfill (scale house)
- LAYER: structure
- SOLID? yes — ENTERABLE? no — openings are their own tiles
- MUST SIT BESIDE: itself horizontally and vertically; its own corner/pilaster tile; the concrete apron and asphalt at its base; roll-up door and steel man-door openings (TF-ART-002); chain-link running off it (TF-ART-006)
- NEVER BESIDE: never beside terracotta roof tiles (residential language on an industrial box); never carrying a residential window tile; never meeting desert ground without an apron or base course
- EDGE CONTRACT: SELF-SEAMLESS horizontally (a wall runs any length) with a declared course phase so blocks line up across tiles; the bond-beam top course is SINGLE PLACEMENT

## D. WHEN
- ACT: 1
- BEST TIME: both; unlit at night — nobody owns light on a dead service building (LIGHT=TERRITORY)
- WEATHER STATES: sunny baseline; cloudy wash needs nothing; RAIN darkens and saturates the block face and shows a wet base band where splashback hits
- LIT/UNLIT: no
- ANIMATION: static

## E. HOW
- EXACT SIZE: 44 px cell (THE CORPUS CELL) — wall unit is one cell; a real 8x8x16in CMU is ~40cm long, so roughly two blocks per cell wide and three courses tall at CELL_M 0.75
- VIEW: 45-degree world view — front face plus the sky-lit top only where the wall is capped
- PALETTE: constitution ceiling; STRUCTURE value band (front 0.97 / away 0.56); its own grey family ramp of 5-7 steps, NOT the stucco ramp
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none baked; the eave/cap shadow is the runtime pass
- SCALE ANCHORS: the 2-cell door law fixes storey height; a course line every ~1/3 cell reads as a real 8in block
- WEAR LEVEL: thirty years: efflorescence bloom in pale streaks, spalled corners, mortar washed proud, graffiti-free (that is a Paolo call, not mine)
- VARIANTS: plain course, bond-beam cap, corner/pilaster, vent-block (the pierced screen block that is everywhere in 60s-80s Vegas). Colourways only beyond that.

## F. THE CAPTION
```json
{
  "id": "TF-ART-001",
  "name": "cmu block wall",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": [
    "industrial",
    "warehouse",
    "self-storage",
    "substation",
    "jail",
    "police station",
    "water treatment",
    "railyard",
    "school (gym + service walls)",
    "fire station (bays)",
    "landfill (scale house)"
  ],
  "best_time": "both",
  "best_location": "exterior faces of service, industrial and civic buildings",
  "place_next_to": [
    "cmu block wall",
    "concrete apron",
    "asphalt",
    "roll-up door",
    "steel man-door",
    "chain-link fence"
  ],
  "never_next_to": [
    "terracotta roof",
    "residential stucco window",
    "desert ground without apron"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS horizontally (a wall runs any length) with a declared course phase so blocks line up across tiles; the bond-beam top course is SINGLE PLACEMENT",
  "anim": null,
  "tags": [
    "structure",
    "masonry",
    "industrial",
    "civic"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the frozen starter set wall_0/wall_base/wall_under_eave — same construction logic (base course, field, eave course), different material; and the CBB target screen for the structure value band
- NAMED OUTSIDE REFERENCE: Project Zomboid for how a low industrial box reads at 3/4 without becoming a texture swatch — its CMU keeps a course line and nothing else; NOT its palette
- REAL-WORLD GROUNDING: Clark County commercial construction is overwhelmingly CMU: grey 8x8x16 block, running bond, a poured bond beam at the top, often a painted or stuccoed street face and RAW BLOCK on the sides and back. In Vegas sun, unpainted block goes chalky pale grey with white efflorescence streaks under any joint that ever held water; the south and west faces bleach hardest.

## H. DON'T WANT
- NOT stucco with lines drawn on it — the block is a different colour family and a different surface, not a scored render
- NOT brick (that is TF-ART-003, a different bond and a different colour entirely)
- NOT clean/new grey — this is a dead world, thirty summers in
- NOT drawn block-by-block as an outlined grid: Slynyrd's own rule, "avoid depicting every single brick as this would appear noisy", and our measured 74%-orphan disaster was exactly this failure
- NOT a flat side-on scroller face (45 DEGREE ART LAW)

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
- STATUS: APPROVED by Paolo 8/11/26 (TILE BOARD sitting, UP; bank: banks/tileforms/TF-ART-001_CANDIDATES_8_8_26.json now carries the APPROVED law line; verdict: records/BOHEMIA_TILE_BOARD_VERDICT_8_11_26.txt). Volume unlocked, wiring open. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 10 | VERDICT: —
