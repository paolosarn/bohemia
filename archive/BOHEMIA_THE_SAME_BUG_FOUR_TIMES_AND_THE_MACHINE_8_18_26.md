# THE SAME BUG FOUR TIMES IN ONE DAY, AND THE MACHINE THAT ENDS IT (8/18/26, WORLD lane)

**A district's engine module is finished, gated and dossiered. The surface Paolo actually
walks draws something else. Every gate in this repo that reads `engine/` was green through
all four instances — which is the whole point.**

---

## THE FOUR

| | what was wrong | cells |
|---|---|---|
| **1. The Strip** | resort / strip / casino had **no module at all** | 204 |
| **2. Eighteen types** | utility ×12, airfield ×2, campus, speedway, town, ballpark had a module the page **did not carry** | 165 |
| **3. The roads** | arterial / freeway had a module the page carried **and ignored** for its own four-number XSEC table — 8.6% and 17.9% drawn | 3,386 |
| **4. The terrain** | desert / mountain / water / wash / rail, same — **one or two colours** | 1,771 |

**5,526 cells. 60% of the valley.**

A checker that reads the SOURCE cannot see a page that does not read the source. That is
not a gap in any one gate; it is a gap in the *shape* of every gate we had.

---

## THE FOURTH ONE, MEASURED

Three cells per type, every third tile, asked of the page's own render function:

| type | cells | before | after |
|---|---|---|---|
| mountain | 927 | 2 colours, **99.7% one colour**, 0.3% built | **8 colours**, 37.6% built |
| desert | 620 | 2 colours, 99.7% one colour | **11 colours** |
| water | 74 | **1 colour, 100%** | **10 colours** |
| wash | 60 | 2 colours, 99.8% | **11 colours**, 11.8% built |
| rail | 90 | 3 colours, 97.7% fallback dirt, **0% built** | **19 colours**, 19.4% built |

Meanwhile their modules were building — every frame, and throwing it away — a limestone
ridge with cliff bands and talus fans; varnished desert pavement with creosote in its
evenly-spaced grid (they poison each other's roots, which is why the spacing is even); the
**bathtub ring** the lake left on the rock as it dropped over twenty years; and a lined
trapezoidal flood channel with the **sewer tunnel mouth** that is the way IN.

**Terrain is sampled in GLOBAL coordinates** from one valley-wide noise field, so a cell
that is not told where it is draws a ridge that stops at its own boundary. `cellX`/`cellY`
go in with the request.

---

## THE MACHINE

`gates/walked_surface_gate.js` — **the only gate here that opens the real alpha, walks to
RUN, and asks the page.** Per district type, off three cells spread across that type's own
footprint:

* **which path drew it** — the district kit, the suburb generator, or a fallback;
* **how many distinct surfaces came back** — a cell drawn in two colours is a painted
  rectangle whatever its module contains.

Three cells, not one, because **the first cell found is always a valley edge cell and edges
are not typical** — sampling one is exactly how the first version of this sweep reported
suburb and desert wrong, and I nearly shipped that number.

**Result: 75 district types, 9,191 of 9,216 cells — 99.7% — drawn by their own module.**

The debt is named, carries a **written reason** per entry, and **ratchets both ways**: a
type that gets fixed and stays on the list fails too, because a stale debt entry is how a
list like this quietly stops describing the build and starts decorating it.

---

## WHAT IS LEFT: 25 CELLS, AND SIX OF THEM ARE NOT MINE

**Buildable — this lane's next item (16 cells):**
`convention` (6, the LVCC: exhibit halls + a dock wall), `prison` (4, a desert correctional
facility, distinct from the downtown `jail`), `dam` (4, Hoover — an arch-gravity dam is a
CLUSTER like the airfield), `minigp` (1, a kart circuit), `fort` (1, the Old Mormon Fort).

**Identity — [PENDING Paolo] (9 cells):**
`sphere` (4), `luxor`, `strat`, `sign` (the Welcome sign), `highroller`, `springs`. Every
one is a **named, real** Las Vegas landmark, and what each one IS in Bohemia — who holds it,
what it became — is his ruling. Building them before he rules would be inventing canon he
reserved (MECHANISM-MINE / CONTENTS-PAOLO'S).

**And one measured exclusion:** `interchange` (16 cells) still draws from the table, because
routed through its module it came back **worse** — 8,843 bare tiles and three tiles of road
against 20% drawn. A stack is built from its cluster's **approach data** (which arm climbs,
which dives, where each ramp lands) and the page can hand it bounds but not that.
`clusterApproach` on the walked surface is the fix.
