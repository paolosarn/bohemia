# TILE FORM TF-ART-006 — EMPTY POOL AND CONCRETE BASIN

## A. IDENTITY
- NAME: Empty pool and concrete basin
- FAMILY/SET: BASIN family — pool floor (shallow/deep with the slope), pool wall + coping, tile band, drain, ladder anchor, treatment-basin variant
- THE JOB, ONE SENTENCE: this tile family exists so that the drained pool — the single most recognisable image of a dead Las Vegas — actually exists as a thing you can stand in, instead of being a hole with nothing drawn in it.

## B. WHY
- DEMANDED BY: district gates assert them: apartment ("drained pool"), waterpark, water treatment ("circular clarifiers, aeration/filter basins"), golf ("pond"). Also BOHEMIA_TILE_REQUESTS row 7.
- WHAT LOOKS BROKEN TODAY: the apartment complex's drained pool and the water treatment plant's clarifiers are geometry with no material, so the most evocative object in a dead-Vegas district is invisible
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full. STARTER TILESET (42, CBB, md5-locked) is the only approved TILE set and it is one residential street: asphalt, sidewalk/kerb, gravel yard, concrete slab, dirt, stucco wall, terracotta roof, flat deck. STARTER concrete_0/concrete_1 checked and it is the honest near-miss: a poured slab is the right FAMILY but a pool is not a slab — it has a curved floor slope, a coping edge, a waterline tile band, and a drain, and the whole read is the tide-line of dirt and algae stain that only a basin gets. INTERIOR POOL (465 tiles) checked: interior room surfaces, not exterior basins.

## C. WHERE
- SURFACE + TAB: RUN + CITY; a drained pool is a strong map-zoom shape at apartments and the waterpark
- DISTRICT FAMILIES: apartment, waterpark, water treatment, golf (dry pond), estate/gated, hotel remnants
- LAYER: ground for the floor; structure for the wall face; the coping is the seam between them
- SOLID? no on the floor (you walk in it); yes on the wall face — ENTERABLE? the pool IS an enterable depression — you walk down into it, which is real verticality the engine map lists as MISSING and this is the cheapest possible pilot
- MUST SIT BESIDE: concrete apron/deck all round; pool coping; dead turf; chain-link (pool fencing is code in Clark County and is a real detail)
- NEVER BESIDE: never full of clean blue water in act 1; never beside desert ground without a deck
- EDGE CONTRACT: WANG-16 edge set — a pool has a rim, corners, and a floor that slopes, so its edges are not interchangeable

## D. WHEN
- ACT: 1
- BEST TIME: both; the deep end holds shade and is the darkest exterior place in a suburb, which is a genuine gameplay affordance
- WEATHER STATES: sunny baseline; RAIN puts an inch of filthy water in the deep end and that is a real, cheap, memorable state
- LIT/UNLIT: no
- ANIMATION: static (any water is a separate call, not this form)

## E. HOW
- EXACT SIZE: 44 px cell; a residential pool is ~4x8m, so ~5x11 cells at CELL_M 0.75
- VIEW: 45-degree world view — the far wall of the basin is visible and the near wall is not, which is exactly what makes a hole read as a hole
- PALETTE: constitution ceiling; concrete family ramp shared with the approved slab tiles + one dark stain accent for the tide line and one for the algae残
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither.
- SHADOWS: none baked; the basin's own interior shade is geometry, not a shadow pass
- SCALE ANCHORS: pool depth 1m shallow to 2m deep = 1.3 to 2.7 cells of drop against a 1.75m human
- WEAR LEVEL: dry for decades: a hard brown tide line where the water sat longest, cracked plaster, the blue waterline tile band mostly intact because ceramic outlives everything, silt and blown sand in the deep end, one cracked wall from ground movement
- VARIANTS: shallow floor, sloped floor, deep floor, wall+coping, waterline tile band, drain, treatment-basin (circular, industrial)

## F. THE CAPTION
```json
{
  "id": "TF-ART-006",
  "name": "empty pool and concrete basin",
  "layer": "ground",
  "solid": false,
  "enter": true,
  "district_families": [
    "apartment",
    "waterpark",
    "water treatment",
    "golf (dry pond)",
    "estate/gated",
    "hotel remnants"
  ],
  "best_time": "both",
  "best_location": "apartment courtyards, waterpark, treatment plants, estate back yards",
  "place_next_to": [
    "concrete apron",
    "pool coping",
    "dead turf",
    "chain-link fence"
  ],
  "never_next_to": [
    "clean water",
    "desert ground without a deck"
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
    "structure",
    "concrete",
    "vertical",
    "landmark"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the starter set concrete_0/concrete_1 — the pool must be visibly the same concrete family as the approved slab, or the district falls apart
- NAMED OUTSIDE REFERENCE: the empty-pool photography of the 2008 Nevada foreclosure crisis, which is literally this world one crash earlier; and Zomboid for how a walk-in depression reads at 3/4 without a camera change
- REAL-WORLD GROUNDING: Clark County residential pools are gunite with a plaster finish and a 6in ceramic waterline tile band, coping in cast concrete or brick. Drained and left in Vegas sun, plaster crazes and chalks, the tile band survives almost perfectly, and a hard mineral tide line marks the last waterline permanently. Blown sand collects in the deep end. Empty pools also FLOAT out of the ground when the water table rises, which is why so many abandoned Vegas pools sit cracked and tilted.

## H. DON'T WANT
- NOT blue and clean
- NOT a flat blue rectangle painted on the ground — the whole value is that it is a HOLE you can walk into
- NOT skate-park smooth: this is cracked, silted, and stained
- NOT green algae water (that is not act 1 and it is not a Mojave read)

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
- STATUS: CANDIDATES COOKED 8/9/26 (was OPEN; bank: banks/tileforms/TF-ART-006_CANDIDATES_8_8_26.json, proofs: records/tileforms_proofs/TF-ART-006/, judge: the ART tab, TILE BOARD card). UNJUDGED until Paolo thumbs it. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 15 | VERDICT: —
