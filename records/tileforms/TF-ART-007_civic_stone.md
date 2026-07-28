# TILE FORM TF-ART-007 — CIVIC CUT-STONE MASONRY

## A. IDENTITY
- NAME: Civic cut-stone masonry
- FAMILY/SET: CIVIC STONE family — ashlar block face, column/pilaster, cornice band, grand step, plinth
- THE JOB, ONE SENTENCE: this tile family exists so that the courthouse, the city hall, the library and the church stop wearing warehouse block or house stucco, because civic buildings are the one place this valley ever spent money on material and that difference is the entire read.

## B. WHY
- DEMANDED BY: the district gates assert the geometry already: courthouse ("columned building, dome, portico, grand steps"), city hall ("clock tower"), library ("columned building, colonnade+steps"), church ("cruciform, bell tower, arcade"). Four approved districts, all rendering in the wrong material.
- WHAT LOOKS BROKEN TODAY: a courthouse and a self-storage unit are made of the same pixels today, so the civic core of the valley has no visual authority at all
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. HOUSE SKINS (30 UP) is residential. PERIMETER WALL POOL is a boundary wall. HD PACK UP list checked for a stone/civic family: the UP set skews house and interior; nothing civic survived the sweep. DISTRICT HERO CANDIDATES v7 checked and deliberately NOT used: that bank is UNJUDGED (flagged in the index as the inversion) and building on unjudged art would outrank Paolo's approvals.

## C. WHERE
- SURFACE + TAB: RUN + CITY; these are the districts most likely to want a real map icon
- DISTRICT FAMILIES: courthouse, city hall, library, church, terminal (the grand hall), downtown (older podium)
- LAYER: structure
- SOLID? yes — ENTERABLE? no — doors and the portico opening are their own tiles
- MUST SIT BESIDE: its own cornice and plinth; grand steps; concrete plaza; the columned arcade
- NEVER BESIDE: never beside corrugated metal; never carrying a residential window; never on a small building (this material means importance and using it on a shed destroys that meaning)
- EDGE CONTRACT: SELF-SEAMLESS horizontally with a declared ashlar course phase; cornice, plinth and column are SINGLE PLACEMENT

## D. WHEN
- ACT: 1
- BEST TIME: both; these are the buildings most likely to be lit in the 12% CLUSTERED POWER law — a lit courthouse is a territorial statement
- WEATHER STATES: sunny baseline; RAIN darkens stone dramatically and unevenly, which is one of the best-looking cheap weather effects available
- LIT/UNLIT: a LIT variant is wanted here specifically, because LIGHT=TERRITORY and these are the buildings somebody would claim
- ANIMATION: static

## E. HOW
- EXACT SIZE: 44 px cell; ashlar course ~0.4m so roughly two courses per cell at CELL_M 0.75
- VIEW: 45-degree world view; the cornice is where the sky-lit top face earns its keep
- PALETTE: constitution ceiling; STRUCTURE band; a pale warm limestone family — deliberately LIGHTER and less saturated than the stucco family so civic reads as civic at a glance
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none baked; the cornice shadow is the runtime pass and it is what makes the building look heavy
- SCALE ANCHORS: 2-cell door law; a civic storey is taller than a house storey (that height difference is half the read); columns are ~1 cell wide and 4+ tall
- WEAR LEVEL: stone ages best of anything here: soiled and streaked below every ledge, wind-etched on the south face, steps worn hollow at the centre, but structurally intact — this is the material that outlived the economy
- VARIANTS: plain ashlar, cornice band, plinth/base course, column, grand step

## F. THE CAPTION
```json
{
  "id": "TF-ART-007",
  "name": "civic cut-stone masonry",
  "layer": "structure",
  "solid": true,
  "enter": false,
  "district_families": [
    "courthouse",
    "city hall",
    "library",
    "church",
    "terminal (the grand hall)",
    "downtown (older podium)"
  ],
  "best_time": "both",
  "best_location": "civic building faces: courthouse, city hall, library, church, terminal",
  "place_next_to": [
    "civic stone",
    "grand steps",
    "concrete plaza",
    "column"
  ],
  "never_next_to": [
    "corrugated metal",
    "residential stucco window",
    "small outbuildings"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS horizontally with a declared ashlar course phase; cornice, plinth and column are SINGLE PLACEMENT",
  "anim": null,
  "tags": [
    "structure",
    "stone",
    "civic",
    "landmark"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the starter set wall_base/wall_under_eave for the base-field-cap construction logic and the structure value band; the material is new, the grammar is approved
- NAMED OUTSIDE REFERENCE: the Las Vegas Federal Courthouse and the old Post Office (now the Mob Museum) are the literal real references; for the pixel read, Pocket City 2 keeps civic buildings lighter and simpler than commercial ones, which is exactly the trick
- REAL-WORLD GROUNDING: Southern Nevada civic buildings are cast stone and pale limestone-look precast over concrete frame, not true quarried ashlar — the 1933 Post Office is Tufa-clad, the newer federal buildings are precast panel. Both read as pale warm stone that stays pale: Vegas dust is the same colour as the stone, so unlike the block and metal, civic buildings do NOT go grey with age. They streak dark under ledges and stay bright everywhere else.

## H. DON'T WANT
- NOT grey castle stone — this is warm pale desert limestone, not medieval granite
- NOT rusticated random rubble — American civic is smooth ashlar in regular courses
- NOT drawn stone-by-stone with outlines (the noise failure again)
- NOT the same value as the stucco house walls, or the whole point of the material is lost

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
  | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 16 | VERDICT: —
