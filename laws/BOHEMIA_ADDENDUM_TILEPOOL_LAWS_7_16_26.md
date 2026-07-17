# BOHEMIA — TILE POOL LAWS + INTEGRATION (7/16/26)

## WHY THIS FILE EXISTS

Four laws Paolo locked on 7/14 live in the verdict files and **nowhere else**.
They are not in `BOHEMIA_GRAPHICS_LAWS_MASTER_7_16_26.md` (grepped: zero hits for
weather rarity, the 30-year wash, unlit-no-flicker, and the door leaf law). Two of
them had no engine code at all. Filed here, and two of them are now built.

Source verdicts: `BOHEMIA_V6_VERDICTS_7_14_26.txt`, `BOHEMIA_ANIM_COOK_VERDICTS_7_14_26.txt`.

---

## LAW 1 — WEATHER RARITY (LOCKED, Paolo 7/14, V6-0)

**Parents 88% / weathered 12%. Uniform sibling draw is BANNED.**

Verdict V6-0 was DOWN with the reason "tile colors shifted (uniform weather-sibling
draw)". That symptom has one cause: the draw was keyed on the tile FAMILY, so a whole
surface resolved to its weather sibling at once and the ground changed color. Weathered
tiles are supposed to be **rare instances scattered through a field of parents**, not a
mode the surface switches into.

**Now built.** The draw keys on the fine CELL, never on the family.

## LAW 2 — MARKINGS, 30 YEARS (LOCKED, Paolo 7/14)

**Every marking white and yellow washes toward asphalt at 0.55.**

Act-1 is the base every act builds on, so the wash is baked into the act-1 pool. It is
not a render-time filter, and act-2/act-3 build up from the washed base rather than
starting from fresh paint. Thirty years of sun and tires, no repainting crew.

**Now built.**

## LAW 3 — UNLIT FUEL, NO FLICKER (LOCKED, Paolo 7/14)

**Unlit fuel gets no idle flicker. Fire is a state change, not an idle.**

Verdict: `p_camp_firewood_stack_21` DOWN, "not on fire — no idle flicker". A woodpile
sitting there is a woodpile. It only flickers once something lights it. Any prop whose
anim is a fire loop must first answer whether it is BURNING.

Filed as canon. Enforcement belongs in the fire-flicker bank's anim assignment, not
in the tile pool.

## LAW 4 — DOOR LEAF (LOCKED, Paolo 7/14)

**A single door swings as ONE leaf hinged on one side. Center split is DOUBLE doors only.**

Verdicts: `prov_Doors_and_Arch_00/01/05` all DOWN, "single door — no center split".
Three doors died to the same mistake, which means it was the factory's rule and not
three bad frames.

Filed as canon. Enforcement belongs in the door anim factory.

---

## INTEGRATION — `bohemia_tilepool.js` (new, 7/16)

**What it is:** the art-bind choke point. Blockgen and plotgen emit SEMANTIC cells
(`lane`, `lane_div`, `median`, `crosswalk`, `side`, `yard_dirt`...). This module is
the only place a semantic cell becomes an actual tile. Same shape as
`bohemia_prop_scale.js`, which is the choke point for size.

### FORMAT THE CODE ACCEPTS

```js
const entries = [
  {key:'asphalt_a', pack:'Streets props and urban', idx:12, weathered:false, weight:2},
  {key:'asphalt_b', pack:'Streets props and urban', idx:13, weathered:false},
  {key:'asphalt_a_sun', pack:'Streets props and urban', idx:41, weathered:true}
];
const pool = BOH_TILEPOOL.makePool(entries);
```

- `weathered:true` marks a **weather sibling** of a parent tile (same art, sun-bleached
  or cracked or stained). Absent = parent.
- `weight` is optional, defaults 1, and biases within a bucket only. It does **not**
  touch the 88/12 split.
- A pool with zero parents throws. That is intentional: an all-weathered pool is the
  uniform draw wearing a different hat.

### PLUG-IN POINT

One call, at the moment a renderer resolves a cell:

```js
const tile = pool.pick(fx, fy, blockSeed);   // fx,fy = FINE CELL coords
```

`fx, fy` must be the **fine cell coordinates**, not a family id, not a variant index,
not a surface id. That argument IS the law. Passing anything family-scoped reintroduces
exactly the bug V6-0 killed.

Deterministic: same cell + same seed = same tile forever, so saves stay stable and
nothing shimmers between frames. No state, no cache, no allocation per call.

### THE WASH

```js
const {pixels, touched} = BOH_TILEPOOL.washMarkings(rgba, {amount:0.55, asphalt:[62,60,58]});
```

Bake-time, once, when the act-1 marking pool is built. Runs on the RGBA byte array.
- Classifies marking pixels: bright near-greys (white) and the bright red>=green>>blue
  band (yellow). Asphalt, curbs, dirt, rust and blood are left alone.
- Alpha is never touched. Transparent pixels are skipped.
- Does not mutate the input, returns a copy plus a `touched` count so a bake can assert
  it actually hit something.

### CONSUMING FUNCTIONS

- `BOH_BLOCKGEN.gen*` already tags marking rows with a `color` class
  (`white_lane`, `yellow_direction`) per LINE COLOR LAW. Those classes select which pool.
- `BOH_SCALE.sizeFor` sizes what the pool picks. Pool answers WHICH, scale answers HOW BIG.
- `BOH_LIGHT` runs after, on the composed cell.

---

## GATE

`bohemia_graphics_tests.js`: **105 pass / 0 fail** (was 83, +22 new).

The tilepool gate asserts:
- share is exactly 0.12; weathered lands within 2 points across a 128x128 field
- deterministic per cell; seed changes the field
- **no uniform surface draw** (64 cells of one semantic resolve to 5+ distinct tiles)
- **no slabbing**: weathered runs stay short, and no 3x3 all-weathered block exists
  anywhere in a 128x128 field
- **small seeds resample, not permute**
- wash amount 0.55; white moves exactly 55% toward asphalt; yellow and white classify;
  asphalt and dark blood do not; alpha untouched; input unmutated

## BUG KILLED DURING THE BUILD

First hash folded the seed into the same low bits as `x` via XOR. Consequence: any two
seeds below 512 produced **the same multiset of draws, merely permuted** — seeds 1, 7
and 42 each returned exactly 68 weathered tiles in a 512-cell row. The field looked
random and the share was right, so it would have passed any naive test and shipped.

Fix is structural: coordinates avalanche first, seed enters after, fmix32 last.
Seeds now resample independently (row counts 49 / 60 / 73 / 55 / 58, field fraction
0.1200 / 0.1184 / 0.1195 / 0.1214 / 0.1220). A permanent gate asserts it can't come back.

---

## PENDING PAOLO

- **`ASPHALT_BASE` rgb** — default `[62,60,58]`. This is the color the markings wash
  TOWARD, so it should be the act-1 street pool's actual asphalt. His pick.
- Do act-2 / act-3 re-wash at lower amounts, or repaint fresh over the washed base?
- Which act-1 tiles are weather SIBLINGS of which parents. The 88/12 machinery is
  built and gated; the sibling pairing itself is a verdict pass, not a Claude call.
