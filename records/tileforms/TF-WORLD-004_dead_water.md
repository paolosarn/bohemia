# TILE FORM TF-WORLD-004 — DEAD WATER & THE BATHTUB RING

## A. IDENTITY
- NAME: Dead water bodies (every pool, pond, basin and lakebed with the water gone)
- FAMILY/SET: DEAD WATER family — drained pool floor + pool wall/coping + the
  hopper (deep-end) slope + cracked silt lakebed + the BATHTUB RING mineral
  band + dry fountain basin + retention/leachate basin floor + the last
  shallow standing water. ONE drawing job: they are all "the water left".
- THE JOB, ONE SENTENCE: this tile exists so that the ten districts holding a
  water body read as DRAINED rather than as a differently-coloured floor,
  because in a desert city the absence of water is the whole story.

## B. WHY
- DEMANDED BY: the theme sheet's hooks (records/BOHEMIA_DISTRICT_THEME_SHEET_
  7_28_26.md) — the waterpark's "empty pools and slides to nowhere" (Paolo:
  "so fucking terrible" today), the apartment courtyard pool, the park's dead
  pond, the golf water hazard; plus the 7/28 apocalypse research finding that
  ours is an ECONOMIC collapse in a desert, where the water bill stopping is
  the most Vegas way for a thing to die.
- WHAT LOOKS BROKEN TODAY: 10 distinct water-dead materials across waterpark,
  apartment, park, cemetery, cityhall, wash, water, watertreat, landfill and
  golf, every one a flat colour. A drained pool currently reads as a
  blue-ish rectangle, which reads as WATER — the exact opposite of the truth.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md —
  * DESERT/TERRAIN picks + desert pools: dirt and rock. Checked; no basin
    floor, no coping, no mineral ring. Also measured broken (row 4).
  * SEAM-FIXED SURFACES (act-1 seam audit set, ZERO consumers): checked —
    surface seam fixes, not a water family.
  * HD PACK UP list: no drained-pool or lakebed family.
  Nothing in the index claims dead water.

## C. WHERE
- SURFACE + TAB: RUN (you walk down INTO a drained pool — that is the hook) +
  CITY. The waterpark and Lake Mead read at map zoom.
- DISTRICT FAMILIES: waterpark, apartment, park, cemetery, cityhall, campus,
  golf, watertreat, landfill, wash, water (the lake itself), interchange
  (retention basins).
- LAYER: ground for the floor and the ring; structure for the pool wall and
  coping (it is a vertical you cannot walk through).
- SOLID? floor no, wall yes — ENTERABLE? no, but the pool floor is a real
  place you stand IN, one level below grade.
- MUST SIT BESIDE: pool coping and deck; sun deck; dead lawn; concrete plaza;
  cracked silt beside the ring; shore rock.
- NEVER BESIDE: living water anywhere (there is none in act 1); green algae.
- EDGE CONTRACT: WANG-16 for the pool-wall/coping ring (it is a closed
  boundary with corners); SELF-SEAMLESS for the floor and the silt field.

## D. WHEN
- ACT: 1
- BEST TIME: both. A drained pool at night is one of the strongest images in
  the game; no self-light.
- WEATHER STATES: sunny baseline. RAIN is the one that matters most in the
  whole game here: a drained pool is exactly where flash-flood water collects,
  so a shallow scummed puddle in the hopper is the correct wet state and it is
  the single most valuable wet variant we can have.
- LIT/UNLIT: no self-light.
- ANIMATION: static. (The last shallow water does NOT get a shimmer loop
  unless Paolo rules it — no invented motion.)

## E. HOW
- EXACT SIZE: one tile, starter-set native px. Pool depth ~1.2 m shallow to
  ~3 m hopper against a 0.75 m tile.
- VIEW: 45-degree world view. The pool wall shows a real face; the floor
  slopes — the hopper is the deep end and must read as sloping, because a
  flat-bottomed "pool" reads as a tennis court.
- PALETTE: constitution ceiling; GROUND band for floors, STRUCTURE band for
  walls. The mineral ring sits ABOVE the floor value — it is the palest thing.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked — but note a drained pool's own wall casts a big shadow
  into it, and that belongs to the shadow pass.
- SCALE ANCHORS: pool coping is ~30 cm; a lane line is 2.5 m; the ladder is
  human-scale and is what tells you it is a pool at all.
- WEAR LEVEL: this is where Vegas is unique. Drained pools here do NOT go
  green — there is no rain to fill them. They go PALE and CHALKY: plaster
  crazes, the surface chalks white, and hairline cracks spider the floor.
  Blown sand and tumbleweed collect in the hopper. Painted tile bands at the
  waterline survive longest and are the last colour left.
- VARIANTS: shallow floor, hopper floor, coping/wall, tiled waterline band,
  cracked silt lakebed, bathtub ring band, standing-scum puddle (wet).

## F. THE CAPTION
```json
{
  "id": "TF-WORLD-004",
  "name": "dead water bodies",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": ["waterpark","apartment","park","cemetery","cityhall","campus","golf","watertreat","landfill","wash","water","interchange"],
  "best_time": "any",
  "best_location": "any basin, pool, pond or lakebed the water has left",
  "place_next_to": ["pool coping","sun deck","dead lawn","concrete plaza","cracked silt","shore rock"],
  "never_next_to": ["living water","green algae"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "wang-16 coping + self-seamless floor",
  "anim": null,
  "tags": ["ground","water-dead","drained","pool","lakebed","bathtub-ring"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the cemetery district (Paolo: "very good") for how a dead
  irrigated surface should read in this world; and the frozen CBB ground band.
- NAMED OUTSIDE REFERENCE: the empty-pool sequences in The Last of Us for how
  a drained pool becomes architecture you walk through; and Bombay Beach /
  Salton Sea photography (cited in the 7/28 apocalypse research) for
  desert-drained water specifically.
- REAL-WORLD GROUNDING: **LAKE MEAD'S BATHTUB RING** — the white mineral band
  on the rock where the water used to be, tens of metres tall, the single most
  famous image of water loss in America and it is 30 miles from this map. It
  is calcium carbonate bleached bone-white against dark rock. And Vegas's
  abandoned residential pools: because there is no rainfall to fill them, they
  chalk and crack rather than turning green — the green-swamp abandoned pool
  is an EAST COAST image and would be wrong here.

## H. DON'T WANT
- NOT green swamp water. That is the wrong climate and it is the single most
  likely wrong instinct on this form.
- NOT blue. A drained pool has no blue in it except a surviving tile band.
- NOT a flat-bottomed rectangle — without the hopper slope it is not a pool.
- NOT clean white plaster; it is chalked, crazed and sand-filled.

## I. ACCEPTANCE
- [ ] Coping Wang set closes a full pool ring with corners
- [ ] Floor seam measured, no edge darkening
- [ ] Palette ceiling + bands + one-light green
- [ ] Squint test: the waterpark reads as empty pools at map zoom
- [ ] 3x3 TILED PROOF + a full assembled pool (coping + shallow + hopper)
- [ ] ON THE REAL SURFACE: the waterpark district wearing it
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: WORLD | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 33 | VERDICT: —
