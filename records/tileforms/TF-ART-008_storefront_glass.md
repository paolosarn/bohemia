# TILE FORM TF-ART-008 — STOREFRONT GLASS AND ALUMINIUM

## A. IDENTITY
- NAME: Storefront glass and aluminium
- FAMILY/SET: STOREFRONT family — glazed bay (dead dark glass), mullion post, boarded bay, smashed bay, transom band, roll-down security grille
- THE JOB, ONE SENTENCE: this tile family exists so that the commercial strip, the terminal and the downtown podium have a ground floor that reads as a shopfront, which is what makes a street feel like a street rather than a row of boxes.

## B. WHY
- DEMANDED BY: district gates assert the geometry: commercial ("corner plaza: STORES"), downtown ("podium blocks + towers"), terminal ("waiting hall"), swap meet ("market hall"). Plus BOHEMIA_TILE_REQUESTS row 7.
- WHAT LOOKS BROKEN TODAY: every shop in the valley has a blank stucco ground floor; a strip mall and a warehouse are the same building
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. STARTER wall_window and wall_boarded checked — these are the closest and they are RESIDENTIAL: a house window in a stucco field, punched opening, sill, house scale. A storefront is the opposite construction: a continuous glazed bay between slim mullions running floor to transom, and it must read as glass you could walk through, not a hole in a wall. HOUSE SKINS (30 UP) confirmed residential. Reused DIRECTLY from the approved corpus: the DEAD DARK GLASS rule and its measured hot-yellow ceiling, which this must obey exactly.

## C. WHERE
- SURFACE + TAB: RUN + CITY
- DISTRICT FAMILIES: commercial, downtown, terminal, swap meet, medical (lobby), truck stop (store), library (entry)
- LAYER: structure
- SOLID? yes (glass blocks); the smashed variant is NOT solid, which is how you get inside — ENTERABLE? the smashed/open bay is a PORTAL — inside is the looted retail interior the approved interior pool already covers
- MUST SIT BESIDE: CMU or stucco above it (a storefront is always the ground floor of something else); mullion posts; the concrete walk in front; the transom band above
- NEVER BESIDE: never on a house; never above the ground floor of a low-rise (upper floors are punched windows, not storefront)
- EDGE CONTRACT: SELF-SEAMLESS horizontally at the mullion pitch — the mullions ARE the tile boundary, which makes this one of the few tiles where the seam is a feature

## D. WHEN
- ACT: 1
- BEST TIME: both; DEAD DARK GLASS in act 1, day and night, no exceptions — that is existing law and the measured ceiling is under 2% hot-yellow pixels
- WEATHER STATES: sunny baseline; glass is where rain reads best but ONLY as darkening — no reflections
- LIT/UNLIT: no in act 1 (dead world)
- ANIMATION: static

## E. HOW
- EXACT SIZE: 44 px cell; a storefront bay is ~1.5m wide and 3m tall = 2 cells x 4 cells at CELL_M 0.75
- VIEW: 45-degree world view; the glass plane sits slightly back from the mullions and that recess is the whole depth cue
- PALETTE: constitution ceiling; STRUCTURE band; aluminium grey family + the approved DEAD DARK glass accent
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none baked; the recess shadow is geometry
- SCALE ANCHORS: 2-cell door law for the entry; a storefront transom sits at ~4 cells, which is why commercial ground floors read taller than houses
- WEAR LEVEL: glass either intact and filthy, boarded with the approved board treatment, or smashed with the frame still holding shards at the edges; aluminium frames pitted and chalked; security grilles jammed half-down
- VARIANTS: glazed bay, mullion post, boarded bay, smashed bay, transom band, half-down grille

## F. THE CAPTION
```json
{
  "id": "TF-ART-008",
  "name": "storefront glass and aluminium",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": [
    "commercial",
    "downtown",
    "terminal",
    "swap meet",
    "medical (lobby)",
    "truck stop (store)",
    "library (entry)"
  ],
  "best_time": "both",
  "best_location": "ground floor of commercial and civic buildings on a street or plaza",
  "place_next_to": [
    "storefront glass",
    "mullion post",
    "sidewalk",
    "cmu block wall above",
    "stucco above"
  ],
  "never_next_to": [
    "house wall",
    "upper floors",
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
  "edge_contract": "SELF-SEAMLESS horizontally at the mullion pitch",
  "anim": null,
  "tags": [
    "structure",
    "glass",
    "commercial",
    "portal"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the starter set wall_window (the approved DEAD DARK glass value and its hot-yellow ceiling) and wall_boarded (the approved boarding treatment) — both reused as the material truth at a new geometry
- NAMED OUTSIDE REFERENCE: Zomboid's storefronts for the recess-and-mullion read at 3/4; the anti-lesson is any storefront drawn as a bright reflective pane, which instantly reads as a living city
- REAL-WORLD GROUNDING: Las Vegas strip-mall retail is aluminium storefront system: 2in mullions, 1/4in glass, an anodised or bronze finish, a transom band, and a stucco or split-face band above. After thirty years the anodising chalks white, the sealant fails and falls out, and the glass survives far better than people expect — most abandoned Vegas retail still has most of its glass, filthy and intact, with a few bays smashed at the entrance.

## H. DON'T WANT
- NOT reflective or bright — DEAD DARK GLASS is law and a warm glow is a measured failure
- NOT the residential window tile stretched wide
- NOT every bay smashed: mostly intact and filthy is both truer and more unsettling
- NOT a flat side-on face (45 DEGREE ART LAW)

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
- BOARD ROW #: 17 | VERDICT: —
