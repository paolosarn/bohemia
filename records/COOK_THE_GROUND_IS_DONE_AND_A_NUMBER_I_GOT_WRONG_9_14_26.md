# COOK -- [streets fixed] ROUND 3: THE GROUND IS DONE, THE HOUSES ARE 4%, AND I PUBLISHED A NUMBER THAT WAS NOT TRUE

**Lane 16 COOK (the Production Artist), 9/14/26. Board row: `[streets fixed]`, round 3.**

---

## 1. WHAT I CAME IN TO BUILD, AND WHY I DID NOT BUILD IT

My round-2 handoff said round 3 was the house pools: `hroof` 14 tiles, `hwall` 4,
`hwindow` 3, `hdoor` 3, `hboarded` 3 -- all 16x16, all blurred x2.75 into the 44px bake,
exactly the disease round 2 cured on the yard, with 44px approved art waiting in the bank
for all of them.

Rule 12 says measure the premise before believing it. So before cooking anything I asked
the running game how much of his first five minutes is actually house:

| what | cells | share |
|---|---|---|
| `hyard` (the ground, fixed round 2) | 605 | **72%** |
| street pool via colour (fixed round 1) | 105 | 12.5% |
| `street` (fixed round 1) | 70 | 8% |
| `side` (fixed round 1) | 28 | 3% |
| procedural dirt kind | 22 | 2.6% |
| **`hroof`** | **11** | **1.3%** |
| perimeter wall faces | 22 | 2.6% |
| **`hwall` faces** | **1** | **0.1%** |

**The houses are about 4% of his first five minutes.** Cooking them would have been the
street mistake for the third time: a whole round spent on a sliver because it was next on
my own list instead of next on his screen. **The house swap is not wrong, it is just not
next, and nothing was cooked this round.**

It would also have been risky for a reason the contact sheet made obvious and the file
names hid: the bank's wall and roof tiles are **structural roles**, not interchangeable
variants -- `wall_base`, `wall_under_eave`, `wall_end_l/r`, `roof_ridge`, `roof_eave`,
`roof_hipTL/BL/TR/BR`. Dropped into a random-variant pool, a hip corner lands in the middle
of a flat wall and an eave shadow band lands halfway up a house. Only three map cleanly by
name and material (`wall_0/1/2` -> `hwall`, `wall_window` -> `hwindow`, `wall_boarded` ->
`hboarded`), and `hroof` must not be swapped at all: the live pool carries three roof
COLOURS (red, brown, grey) and the bank's roofs are all terracotta, so the swap would cost
variety on top of placing corners wrong.

## 2. *** A NUMBER I PUBLISHED LAST ROUND WAS NOT TRUE ***

Round 2's record, handoff, board row and commit all carried this line:

> *138 of 841 cells (16%) draw with no pool at all, by flat colour.*

**It is wrong. The real number is ZERO.**

My probe read `c.markPool || c.gArtPool || ('flat ' + c.g)` and called everything that fell
through "flat colour, no tile art". But **a cell carrying no pool is not a cell carrying no
tile.** `texFor(col)` resolves the colour to a pool through `SA_MAP` at DRAW time, and
anything it does not know falls to `texForKind`, which generates its texture procedurally
**at 44px**. I asked the cell what it was carrying; the renderer asks a different question
a moment later.

So this round I asked the page's own `texFor`, for all 841 cells, the way the renderer asks
it:

```
seen 841    tiled 841    untiled 0
```

**Not one cell in his first five minutes is a flat fill.** The 105 cells of `#8a8a86` are
the street pool, which round 1 already cooked. The 22 of `#8a7a5e` are the procedural dirt
kind, already at full resolution. There was never a 16% hole.

This is the **third** time in three rounds that a clean number from the wrong oracle nearly
became a fact, and **the first time it got past me into a record, a handoff, a board row
and a commit message that nineteen lanes read.** Round 1 caught the sign pool by rendering a
contact sheet. Round 2 caught `tf_cu` (a COOLING UNIT, not a curb) by reading a name table.
This one was not caught at all until I went back to check it. The round-2 record is
corrected in place with the reason written out, rather than quietly edited.

**The rule this lane now holds: a probe that reports an ABSENCE has to be asked the same
question the renderer asks, in the renderer's own words, before the absence is a finding.**

## 3. WHAT DID SHIP: THE ONE DRIVER NOW DRIVES BOTH SURFACES

Rule 14(g), added this round: *"There is one driver... every lane that walks the five
minutes uses it or extends it."* I extended it, because pointed at the alpha it failed on a
game that boots perfectly.

**Two bugs, both of which would make a lane report the alpha broken.**

1. **IT GUESSED HOW LONG THE DOOR TAKES.** Two blind waits -- 15 s for the splash, 22 s for
   the city frame -- tuned to the demo on one machine. Both now **poll** for the thing they
   were waiting for, keeping the old numbers only as the ceiling. Nothing changes for the
   demo.
2. **THERE ARE TWO FRONT DOORS AND ONLY ONE OF THEM OPENS.** The alpha carries **both**
   `#fronttap` and `#front`. The driver picked `#fronttap` with an `||` and clicked it, and
   on the alpha that is the wrong element: measured, the splash sat there with `#fronttap`
   present and `display:block` for eighty seconds while nothing happened. Tapping `#front`
   opened it on the first try. It now taps **both**, with a real finger, keeping `click()`
   as the belt.

**Why this matters beyond my own round:** every building lane ships to the **alpha**, and
only THE RUN re-cuts the demo. EYES E26 measured it this round -- the demo is stamped
9/13z, the alpha 9/14a, and *"six lanes shipped against last round's list and the demo he
opens is the same demo."* A driver that can only reach the demo can only ever measure work
that is at least one cut old. It can now reach the surface the work actually lands on.

**Regression-tested on the demo it was written for, since it is LIFE + CITY's tool and
every lane uses it:** opens in 63 s, state reads `mode human, hzoom 44, hx 6205, hy 6271`,
23 controls found, screenshot taken. Unchanged.

## 4. WHERE [streets fixed] ACTUALLY STANDS

Measured, on the glass, with the one driver:

- **Every one of the 841 cells around him is on a real tile, and all four of the pools that
  make up 95% of them have been cooked** -- the road, the sidewalk and the marking pools in
  round 1 (74 tiles, 1,235 median colours -> 7), the yard in round 2 (72% of the screen,
  16px blurred -> 44px lossless, from the set he approved on 7/28).
- **There is no remaining art lie on the ground of his first five minutes that this lane
  can find by measuring.** What is left is small by area (houses 4%, perimeter wall 2.6%)
  or is not art at all.

## 5. WHAT IS LEFT, AND WHOSE IT IS

1. **The sidewalk repeat.** `BOHEMIA_CITY_WORLD.html:36538` and `:36577`,
   `c.gArtVariant=_sw%3` -- 36 distinct sidewalk tiles exist, three are ever drawn. The
   per-plot seed beside it is Paolo's 7/14 desert-dominance ruling and must stay; it is the
   modulus that is wrong. **LIFE + CITY / WORLD.** Unchanged from round 1 and still open.
2. **`walk_kerb` and `road_gutter` are approved, 44px, undrawn.** The suburb has 15 cell
   codes and not one is a kerb, because Paolo's 7/31 ruling puts the walk hard against the
   kerb -- so the kerb is an EDGE on the road side of the walk, not its own cell. The
   marking pass at `:40481` already resolves oriented pools from neighbours and `__rotTex`
   already exists. **Art: exists, approved. Placement: LIFE + CITY / WORLD.**
3. **The house pools** (`hroof` 14, `hwall` 4, `hwindow` 3, `hboarded` 3) are still 16px
   and still blurred, with 44px approved art for three of the four. **COOK, when 4% of the
   screen is the biggest thing left, and not before.** The `hroof` swap should not be done
   at all without new art: the live pool has three roof colours, the bank's has one.
4. **40 of the 42 tiles Paolo approved on 7/28 are still drawn zero times** (round 2 placed
   the three yards). That is the standing finding and it is bigger than any one row.

## 6. PROOF

- `tools/bohemia_drive_the_demo.js` -- extended, not replaced (rule 14g). Regression-tested
  on the demo; now opens the alpha too.
- `records/COOK_THE_YARD_HE_APPROVED_9_13_26.md` -- corrected in place, with the reason.
- **No art cooked this round, on purpose.**
- pre-push pass green; full suite unmeasured since 9d0c8a4e (rule 13: no SUITE LINE yet).
- Did not re-cut the demo (rule 14a).
