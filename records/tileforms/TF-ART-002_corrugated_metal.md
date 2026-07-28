# TILE FORM TF-ART-002 — CORRUGATED METAL WALL + ROLL-UP DOOR

## A. IDENTITY
- NAME: Corrugated metal wall + roll-up door
- FAMILY/SET: SHEET METAL family — corrugated wall panel, ribbed roll-up door (closed / pried open), steel man-door, sheet-metal roof panel
- THE JOB, ONE SENTENCE: this tile family exists so that warehouses, self-storage rows, salvage sheds, the barn and every service building can be built out of what they are actually built out of, and so the pried-open storage unit Paolo already has in the storage district finally has a real door to be pried open.

## B. WHY
- DEMANDED BY: BOHEMIA_TILE_REQUESTS row 7 + the self-storage district gate, which asserts "unit rows, ROLL-UP DOORS, pried-open units" — the geometry exists and is drawn in stucco/concrete today
- WHAT LOOKS BROKEN TODAY: the self-storage district (the density reference for the whole walkable-land law) has roll-up doors that are not roll-up doors; warehouses and the barn are stucco boxes
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. HD PACK UP list checked for a metal/industrial pack: the UP set is house/interior weighted and carries no corrugated family. STARTER SET garage_top/garage_bottom is the closest thing in the corpus and is disqualified: it is a residential garage bay in a stucco wall at house scale, one bay wide, not a repeatable industrial ribbed panel or a storage roll-up. SEAM-FIXED SURFACES (zero consumers) checked — surfaces, not building parts.

## C. WHERE
- SURFACE + TAB: RUN + CITY; at map zoom the long metal rows are the district silhouette
- DISTRICT FAMILIES: self-storage, warehouse, industrial, salvage yard, railyard (engine shed), farm (barn), fire station (bay doors), truck stop (wash bay)
- LAYER: structure
- SOLID? yes — ENTERABLE? the roll-up door is a PORTAL when open — inside is a bare concrete unit floor and whatever the interior generator puts there
- MUST SIT BESIDE: CMU block wall (TF-ART-001) — metal skin over block base is the real construction; concrete apron; asphalt drive aisle; chain-link
- NEVER BESIDE: never on a house; never beside terracotta roof; never as a residential front face
- EDGE CONTRACT: SELF-SEAMLESS horizontally with a declared rib phase (ribs MUST line up tile to tile or the whole row reads broken); roll-up door is SINGLE PLACEMENT sized to its opening

## D. WHEN
- ACT: 1
- BEST TIME: both; unlit at night unless the district owns power (12% lit law)
- WEATHER STATES: sunny baseline; RAIN is the interesting one — metal goes dark and specular-ish fast, and streaks vertically down the ribs from every rust point
- LIT/UNLIT: no
- ANIMATION: static (the roll-up door OPENING is a door clip job, not a tile — route to the door bank if Paolo wants it animated)

## E. HOW
- EXACT SIZE: 44 px cell; rib pitch ~4 px so a rib is roughly a real 7cm corrugation at CELL_M 0.75
- VIEW: 45-degree world view — the rib shadow is what sells it as metal, and it is the one place a per-rib value step is correct rather than noisy
- PALETTE: constitution ceiling; STRUCTURE band; galvanised grey family with a separate rust accent (rust is content, so it is an accent colour, not a ramp step)
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none baked; the rib self-shadow IS part of the material and stays in the tile
- SCALE ANCHORS: 2-cell door law for the man-door; a storage roll-up is ~2.5 cells wide, a warehouse dock door 3+
- WEAR LEVEL: galvanising gone chalky, rust blooming from every fastener and along the bottom edge where water sat, panels dented and one or two sprung loose
- VARIANTS: plain panel, panel with rust run, roll-up door closed, roll-up door pried open (the storage district needs this specifically), steel man-door

## F. THE CAPTION
```json
{
  "id": "TF-ART-002",
  "name": "corrugated metal wall + roll-up door",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": [
    "self-storage",
    "warehouse",
    "industrial",
    "salvage yard",
    "railyard (engine shed)",
    "farm (barn)",
    "fire station (bay doors)",
    "truck stop (wash bay)"
  ],
  "best_time": "both",
  "best_location": "industrial and service building faces, storage unit rows",
  "place_next_to": [
    "corrugated metal",
    "cmu block wall",
    "concrete apron",
    "asphalt",
    "chain-link fence"
  ],
  "never_next_to": [
    "terracotta roof",
    "residential stucco",
    "suburb lawn"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS horizontally with a declared rib phase (ribs MUST line up tile to tile or the whole row reads broken); roll-up door is SINGLE PLACEMENT sized to its opening",
  "anim": null,
  "tags": [
    "structure",
    "metal",
    "industrial",
    "portal"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the starter set garage_top/garage_bottom for how an opening is built (jambs, a real hole, the leaf edge-on) — the CONSTRUCTION is the anchor, the material is new
- NAMED OUTSIDE REFERENCE: Rimworld and Zomboid both read corrugated with a 2-value rib and nothing else; the anti-lesson is any asset that draws every rib in four values and turns to moire at walk zoom
- REAL-WORLD GROUNDING: Las Vegas industrial and storage is pre-engineered metal building: galvanised or Kynar-coated ribbed steel over a CMU stem wall, R-panel profile, ribs about 1 inch deep at 12 inch centres. In the Mojave, coated panels chalk and fade within a decade; unpainted galvanising goes flat grey; rust starts at the fastener washers and at the bottom edge where irrigation once hit it.

## H. DON'T WANT
- NOT wavy tin-shack corrugation — American commercial R-panel is a squared trapezoidal rib, not a sine wave
- NOT drawn with a keyline around each rib (Pocket City rule 3, and the measured near-black failure)
- NOT shiny/new — no specular highlights on a thirty-year dead building
- NOT the residential garage door (that already exists and is a different thing at a different scale)

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
- BOARD ROW #: 11 | VERDICT: —
