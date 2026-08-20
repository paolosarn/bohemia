# THE STREET NOBODY FURNISHED

**8/20/26 — WORLD lane. The arterial cell is the most-walked type in the game: 2,434 of
the valley's 9,216 cells, the mile grid every district in Bohemia fronts onto. Its
legend declares eighteen kinds of tile. The generator was emitting seven. A 96 x 96
metre block of Las Vegas had TWO OBJECTS on it.**

---

## WHAT WAS ON THE STREET

```
asphalt roadway   10,232 tiles      62.5%
sidewalk           2,944            18.0%
landscape strip    1,534             9.4%
raised median        640             3.9%
white lane line      520             3.2%
curb + gutter        512             3.1%
streetlight            2
```

Two streetlights. That is the entire furniture of a city block. No power poles, no
street trees, no bus stop, no storm drain, no car left at the curb — and not one inch
of the yellow line that marks a left-turn bay, which is the only yellow paint the LINE
COLOR LAW allows anywhere on an arterial.

Every one of those has a legend entry. Every one has a name, a kind, and a sentence of
act-1 flavour written for it — *"transit stop pad with a bent shelter frame, the ad
panel long gone"*. The tiling phase reads that legend and believes it. DISTRICT DOSSIER
LAW (Paolo 7/19) makes it the record of what the place **is**.

It was a record of a place that did not exist.

## SIX PLACEMENTS, ONE CAUSE

The code to build all of it was there. It ran every bake. It produced nothing, silently,
and it had been doing that for nine days.

The cause is one thing wearing six hats, and it is the same thing that put a block wall
down the west side of every street until 8/19: **a constant moved and its dependents
stayed behind.** Paolo's 8/11 ruling — *"the streets should FILL THE WHOLE FUCKING BOX
ABSOLUTELY... THE STREETS DONT HAVE WALLS"* — widened the pavement. That moved `BOX`
out to 46 and squeezed the amenity band from 47..63 down to 47..52. Then:

| what | why it made nothing |
|---|---|
| **power poles** | placed at offset 61, which *was* landscape setback and *is* now sidewalk. `put()` only writes over the amenity code, so every pole was computed, handed over, and dropped. 100% of them. |
| **street trees** | same, at offsets 56–61. 100% of them. |
| **streetlights** | guarded by `|t - C| <= BOX` — a junction guard on a cell that has no junction. `BOX` 46 swallows 93 of 128 rows, leaving exactly `t = 6` and `t = 126`. That is where the two came from. |
| **bus stop** | position `26..85`, guard needs `< 18` or `> 110`. **The range and the guard do not intersect.** Not rare — impossible, at every seed, forever. |
| **dead car** | position `20..99`, guard needs `< 14` or `> 114`. Same. |
| **turn pocket** | needs `oa >= BOX + 1 && oa <= POCKET`, which with `BOX` 46 and `POCKET` 30 reads *"at least 47 and at most 30"*. Empty set. |

The streetlight one is the sharpest. **The lane-striping loop forty lines further up had
already been fixed for exactly this**, and carries the comment: *"NEVER STRIPE THROUGH
THE JUNCTION — BUT ONLY IF THERE IS ONE."* The fix did not travel down the file.

A dead branch that *used to be live* is worse than one that never was, because the code
reads as working and the legend keeps promising what it makes.

## AND THE SIDEWALK WAS NINE METRES WIDE

The other half of the look, and it was hiding in plain sight in the numbers above:
18% of the cell was **sidewalk**. `AMEN` 52 / `WALK` 63 gave the amenity strip 6 tiles
(4.5 m) and the walk **twelve** (9 m). Nine metres of blank concrete per side — wider
than two travel lanes, the single biggest thing you look at outside the roadway.

A detached walk in Clark County is **five feet**, and the standard is explicit that
nothing above ground may stand on it; the width belongs to the parkway, which is where
the trees and the poles are *required* to be. It is also what Paolo asked for in the
first place — *"SIDE A LITTLE, THEN STREET"* — and a 9 m sidewalk is not "a little".

So the surplus went where the real one puts it: `AMEN` 58 / `WALK` 64. A 9 m planted
parkway carrying the furniture, a 4.5 m walk behind it, out to the cell boundary.

## THE SPACINGS ARE REAL

Not eyeballed. Checked against the actual standards before a tile moved:

- **streetlights** — 350–500 ft between successive heads, staggered on alternate sides,
  "approximately every other utility pole"
- **power poles** — consequently ~175–250 ft, so every other pole carries a head
- **street trees** — 20–30 ft on centre in the amenity zone, which Clark County requires
  planted. In act 1 about half are gone; the rest are stumps, which is what a street
  nobody waters looks like after ten years.
- **fire hydrants** — 500 ft each side on arterials over 30,000 vpd *(Clark County Fire's
  own guideline; noted here because it is the next thing this cell should carry and it
  has no legend entry yet)*
- **bus stops** — RTC runs arterial stops at about a quarter mile, so roughly **one cell
  in four** has one. Seeded, not stamped on every block. Measured after: 15 of 64.

## THE RESULT

```
                    before      after
streetlight              2          2      (the standard: it was right by accident)
power pole               0          4
dead palm / shrub        0         13
storm drain inlet        0         12
dead car                 0        7.1 avg  (59% of cells)
bus stop                 0        3.3 avg  (23% of cells)
yellow turn-pocket       0        140      (on the crossing, first time in nine days)

content share        19.6%      29.0%
```

## THE GATE THAT GOES RED

`DISTRICT FILL` was already red on arterial and freeway — two of the fleet's 29. It is
green now, and *not* because the furniture fixed it. Furniture is 140 tiles out of
16,384; it cannot move a percentage.

Both floors were measured on **8/2** and both counted content **Paolo himself deleted on
8/11**:

- **arterial** — the 8/2 cell was a thin ribbon of asphalt inside 33 tiles per side of
  landscape setback behind a CMU block wall. He deleted the setback and the wall.
- **freeway** — the 8/2 cell carried an overpass deck and its bridge columns. He killed
  them: *"the freeway overpass underpass shit... its looking god awfully terrible"*, and
  sent the deck to the INTERCHANGE, which still builds it and is **not** re-baselined.

The baseline file already had the rule written into it, from the last time this happened:

> *"A floor exists to catch ACCIDENTAL emptying; a RULING re-baselines it."*

— set on 8/2 when NO CANOPIES took content off four civics. Same rule, same move, and
**A GATE MUST NEVER OUTRANK A RULING** (8/1). Holding a road to a cross-section his own
ruling deleted would make this gate an argument for putting the wall back — and the wall
is the thing that sealed the player into one cell until yesterday.

The new floors are the **post-furnishing** measurements, so they still ratchet.

## THE BLOCK WALL IS RETIRED, NOT JUST UNBUILT

Legend code 8, `block wall`, is deleted from the arterial family — legend, palette,
`body` predicate and layering note, all four. Leaving an entry called *block wall* in the
legend of a **street** type is an open invitation to put it back, and putting it back is
what reduced the reachable valley to three cells of 9,216. The dossier is supposed to
describe the world that exists.

## THE MACHINE: `gates/legend_kept_gate.js`

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. Every tile a district **declares**, it must
**make**.

Across the whole registry: **55 of 1,071 declared tiles, in 28 legend families, are
promises the world does not keep.** mountain declares a ravine floor, a dry drainage,
boulders and an alluvial fan and builds none of them. The airport declares jet bridges
and dead airliners and parks nothing.

Two things the gate is careful about, because *a checker that cannot tell a mention from
a use is the broken one* (8/1):

1. **Legends are shared.** arterial and arterial_x are one module and one LEGEND object;
   the run has no crosswalk and the crossing has no mid-block bus stop, and neither is a
   defect. So the unit is the **legend**, not the type — a code passes if any type
   sharing that legend emits it. That distinction alone was the difference between 82
   findings and 57.
2. **Modes.** Seven street configs *plus* a synthetic 3x3 cluster block walked window by
   window, because a cluster district lays its runway in valley coordinates and each cell
   copies its own window. Generate it without bounds and of course the terminal never
   appears.

Ratcheted like squint and hue: the debt is named and may only shrink, and **fixing one
and leaving it listed fails too** — a debt list that lies about being paid hides the next
regression behind a name that is already there.

The debt list also says which of three things each entry is, because they have three
different fixes: a feature a ruling retired (**delete the legend entry, do not place the
tile**), the `0` safety floor (unplaced is the success case), or a real unbuilt promise.

## THE LESSON

**A silent no-op is the most expensive kind of bug this repo has.** Nothing threw,
nothing warned, the cell rendered fine, and the only symptom was that the world looked
empty — which reads as an art problem, or a taste problem, or nothing at all.

Six of them at once, in one file, for nine days, on the cell the player walks more than
any other. What found them was not reading the code — I had read this file twice this
week. It was **counting what the generator actually emitted and comparing it to what the
module said it would.** That comparison is now a gate.
