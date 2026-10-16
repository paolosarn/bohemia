# PROPER SIDEWALKS (8/20/26, WORLD lane)

> **Paolo, 8/20:** *"Dont forget the proper sidewalks too"*

## THE SIDEWALK WAS ALREADY RIGHT. EVERYTHING THAT MAKES IT PROPER WAS NOT

Measured on 12 real arterial cells (196,608 tiles) on the running page, before touching
anything:

| code | tile | tiles | art it wore |
|---|---|---|---|
| 1 | asphalt roadway | 122,664 | `street` — his approved asphalt, correct |
| 7 | landscape strip | 36,192 | `hyard` — a dirt verge; yard dirt is fair |
| 6 | **sidewalk** | 16,868 | **`side` — correct, and it is the good one** |
| 4 | raised median | 7,680 | `hyard` — a landscaped island; fair |
| 2 | **white lane line** | 6,240 | **`street` — PLAIN ASPHALT. NO LINE.** |
| 5 | **curb + gutter** | 6,000 | **`hyard` — HOUSE-YARD DIRT, ON A KERB** |
| 3 | **crosswalk** | **0** | **never emitted, anywhere in the valley** |

The walking surface has been wearing his good concrete all along. The **kerb** beside it was
wearing the pool used for the dirt in a house's back yard, the **lane line** was wearing
blank asphalt so the road had no line on it, and there is **not one marked crossing** in the
valley.

## HIS BANK HAD THE RIGHT TILE FOR EVERY ONE OF THEM SINCE 7/14

Opened and **looked at** — rendered to PNG and viewed, per REUSE-FIRST, not read about:

- `pools.side` (36) — pale concrete, scored panel joints, weeds up through the cracks
- `pools.lane_div` (2) — the white lane line, already thirty-year washed
- `pools.median` (3) — the **double-yellow centre line**. Paint, *not* a raised island
- `pools.cross` (3) — the crossing bars, a real zebra

**Looking is why the raised median was left alone.** `pools.median` is the double-yellow
centre line; a raised median is a kerbed landscaped island. Wiring the one to the other on
the strength of a matching *name* would have painted road markings onto a planting bed.

## WHY IT WAS UNREACHABLE — THE SIGNAL BUG, AGAIN

The renderer chose the marking pools by **hard-coded colour**:

```js
if (c.g === '#b8a040' || c.g === '#d8d4c4')   // median, lane
```

Those are the **old parametric street colours**. Since *A ROAD WITH ITS OWN MODULE DRAWS
ITSELF*, the arterial emits its own palette — lane line `#b3ab97`, kerb `#6b6b74`, median
`#6f6a5e` — and not one matches, so four approved pools could never be requested by
anything. **Identical in shape to `m.road` going false and taking his 348 traffic signals
off 274 intersections: a lookup keyed on a value that moved.**

So the mapping is by **what the tile is**, not what colour it happens to be. The legend
already says *"curb + gutter"* and *"white lane line"* in plain words. That is the world's
own notion of the tile, it is what the hazard classifier already derives from, and it does
not move when somebody repaints a palette.

## AND THE ORIENTED PAIRS WERE A LIE

Wiring it produced a lane line running **across** a north-south road: ladder rungs. The
suffix looked wrong, so I swapped it — and got a **pixel-identical screenshot**. That is the
tell.

**`lane_h` and `lane_v` in `SA_TILES` are byte-identical.** So are `cross_ns` and `cross_ew`.
Rendered all four and looked: both lane tiles carry a horizontal line, both cross tiles carry
vertical bars. The bank ships an `orientation_table` saying which tiles are authored NS and
must be rotated 90° for an EW road, and whoever built `SA_TILES` **duplicated them instead of
rotating one copy**. The pair existed in name only, which is why asking for the other member
changed nothing.

Fixed at use: one quarter turn, cached per (pool, variant) — the derive-once-blit-forever
rule `tallTex` already follows, because a per-frame rotate is a transform in the hot path.

## THE RESULT

- **curb + gutter:** 6,000 tiles moved from house-yard dirt to his pale jointed concrete
- **white lane line:** now his washed line, running *along* the road as one continuous stripe
- **`lane_h` / `lane_v`** joined the live pools — the never-requested list went **13 → 11**,
  and the ratchet held

## WHAT I SAID THIS DOES NOT DO — AND THE CLAIM WAS FALSE

**I shipped this:** *"It does not place a single crosswalk. Code 3 is declared in the
arterial legend and the generator emits zero... There is not one marked crossing in the
valley."*

**Wrong.** Crossings are emitted, and they are emitted exactly where a crossing belongs:

| district | crosswalk tiles emitted |
|---|---|
| `arterial_x` (the **intersection** variant) | **960** |
| `medical` | 643 |
| `strip` | 368 |
| `rail` | 79 |
| `arterial` (plain mid-block run) | 0 |

A plain length of arterial between two junctions **should** have no crossing on it. The
crossings live on `arterial_x`, the intersection piece — which I never tested. I measured
one variant of one district, found a zero, and generalised it to the whole valley.

Confirmed on the running page: `cross_ns` is requested **1,993 times** in a proper sweep.
**There was never a crosswalk gap. I invented one.**

## AND THE GATE THAT AGREED WITH ME WAS MEASURING ITS OWN BLIND SPOT

`approved_art_arrives_gate.js` listed `cross_ns` **and** `perimeter` — his 13 approved
border walls — as never requested. Both were working the whole time. The sweep rendered
**one viewpoint per district**, the centre of the cell, and a perimeter wall or a kerb can
sit anywhere in a 128-tile plot that does not fit in a phone-sized viewport.

Re-measured with **five** viewpoints per cell:

| pool | one viewpoint | five viewpoints |
|---|---|---|
| `perimeter` | 0 | **22,089** |
| `cross_ns` | 0 | **1,993** |
| traffic signals | 6 draws | **99 draws** |

**The sweep's coverage was the thing being measured, and I published its shortfall as a
fact about the game.** Third time in two days that my instrument, not the world, was the
broken part. The rule that comes out of it: **a negative result is a claim about your
instrument until you have shown the instrument could have seen a positive one.**

Genuinely never requested, after honest coverage: `roof`, `wallface`, `wallwin`,
`pocket_v`, `pocket_h`, `shoulder`, `median_h`, `median_v` — eight, all plausibly
superseded by the roads drawing themselves, and "plausibly" is left as a question rather
than a conclusion. Plus `lane_v` and `cross_ew`, which are byte-identical duplicates the
renderer deliberately never asks for.

---
**On the surface:** `tools/bohemia_city_proper_sidewalks_patch.py` · **Gate:**
`gates/approved_art_arrives_gate.js` (the never-requested ratchet, 13 → 11) · **In a tab:**
RUN — stand on any big road. The picture is **THE KERB AND THE LANE LINE** in the LOOK tab.
