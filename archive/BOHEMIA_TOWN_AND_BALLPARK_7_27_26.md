# THE TOWN AND THE BALLPARK (7/27/26, WORLD lane)

Two more of the valley's buildable landmark cell types, built as real kit districts with
their city builder icons the same turn (the 7/27 icon law):
`engine/bohemia_town.js` (9 cells) and `engine/bohemia_ballpark.js` (8).
Valley **97.0% -> 97.2% generated.** Gate LANDMARKS grew 52 -> 107 checks.

---

## THE TOWN IS A BLOCK, NOT A MAIN STREET

The first version had every correct PART — one wide main street, angle parking, a wall of
attached false-front storefronts, boardwalk, back alleys, houses, a water tower — and it
was a **barcode**. Five full-height stripes running unbroken from the top of the plot to
the bottom, all in the same brown. It was found by rendering it to a PNG and looking at
it, which is the only way that class of defect is ever found.

The diagnosis is worth keeping because it generalises: **a town's structure is not its
main street, it is its BLOCK, and a block is what you get when CROSS STREETS cut the row.**
A main street with no junction is a corridor. Three cross streets, unit widths that vary
so no two neighbours match, and anchors that land on corners are what turn a stripe into a
place.

Also fixed in the same pass, all of them visible only on the render:
- **Everything was one brown.** Storefront, false front, boardwalk, house and dirt were
  within a few values of each other, so the plot read as a single material. It now
  separates by MATERIAL, which is also the truth of the place: masonry shopfronts warm,
  timber houses grey and silvered, dirt pale, alley dark, boardwalk pale timber.
- **The boardwalk was invisible.** It is now the clearest band on the plot, which is right:
  in a desert town shade over the footway is not decoration.
- **The fallen town sign spanned the full carriageway** and sealed the town in half —
  34% of the drive network stranded north of it. It fell; it did not become a wall. You
  get past on one side now.

What is in it: main street with angle bays down both kerbs; the street wall on both sides
under a continuous shade canopy; the saloon and the hall as the two anchor units; three
cross streets; back alleys cut the same way; houses and sheds on dirt lots behind; the
gas station at the town's mouth with pumps under a canopy you walk **under** (the one
overhead layer in the district); and the water tower, which in a desert town is the
tallest thing and the reason the town is where it is at all.

---

## THE BALLPARK IS A WEDGE, NOT A RING

The distinction that matters, and the one the gate measures: **a stadium is a closed ring
around a rectangle; a ballpark is a quarter circle opening away from one corner.** Get
that wrong and this district is just the stadium district again with a different name.

**THE COORDINATE SYSTEM IS THE WHOLE DESIGN.** Everything on a ballpark site is placed
relative to home plate, and the two useful measures are not x and y:

- `a` — how far **along** a foul line you are (home plate 0, the foul pole FOUL)
- `q` — how **deep into foul territory** you are (on the line 0, growing behind the plate)

Both are the 45-degree rotation of (dx, dy). Once you have them the bowl is three bands of
depth — foul dirt, seats, concourse — that wrap behind the plate and run down both lines
on their own, which is the shape a real grandstand is.

**The first version used radius from home plate and it did not work.** A ring behind the
plate is a ring: the seating came out as two disconnected side wings with a hole where the
backstop belongs, and home plate sat so low on the plot that the bowl ran off the bottom
edge anyway. Radius is the wrong measure for a wedge. The fix that made it curve properly:
depth is `q` down the lines and **radius** behind the plate, and the two agree exactly
where `a = 0`, so the boundary is straight along both baselines and curves round the
backstop. Pure `q` gave a pointed chevron — a grey arrowhead, not a bowl.

Three more real defects, all caught by measurement or by looking:
1. **`G.rect` takes `(x0, y0, x1, y1)` and I was passing `(x0, x1, y0, y1)`.** Systematic,
   across both new districts. The town's back alleys never drew and its houses were
   mis-shaped; the ballpark's dugouts and bullpens never drew at all.
2. **The bullpens were axis-aligned rectangles drawn straight through the lot ring**, which
   severed the parking from the entrance (driveReach 0.76 against a 0.85 bar) and merged
   them into the grandstand blob (2 footprints where there should be 5). Dugouts and
   bullpens live in FOUL TERRITORY, parallel to the baselines, which is only expressible
   in `(a, q)`.
3. **Foul territory was laid as one solid dirt apron** and the whole park read as a brown
   blob. It is grass now; only the circle round home plate and the warning strip along the
   front of the stands are skinned, which is what a real park is.
4. **The lot was a barcode too** — stripes every sixth row edge to edge. It is blocks now,
   with cross aisles and a clear entrance drive.

Final: driveReach 1.00 on all six orientations, 5 footprints, content 49% vs pavement 46%.

---

## THE ICONS

Both shipped with their ground, per `laws/BOHEMIA_ADDENDUM_ICON_WITH_EVERY_BUILD_7_27_26.md`.
Hand-built 3D volumes baked through `bohemia_iso3d`, palette and landmarks pulled from the
engine module (the 7/24 law: "as long as it kind of resembles the actual walking map of
that district then I'm so happy"). Every part written into PARTS for the dossier gate.

**The ballpark icon is drawn from BEHIND HOME PLATE, and that is not a stylistic choice.**
Put the plate at the front and the grandstand stands between the viewer and the entire
park. Home goes at the back corner and the field opens toward the viewer — and because the
foul lines then run along the two ground axes, the infield square renders as a true
**diamond** in the 45-degree view for free. The real geometry, not a drawn shape.

Two iterations on it, both by baking and looking:
- The bowl wrapped 270 degrees and read as a closed ring, i.e. as the stadium icon. It
  wraps 200 now, stopping 35 degrees short of each foul line — the same reason the walkable
  district's stands stop partway down each line.
- The outfield wall was as tall as the stands, so wall + bowl together read as one ring.
  It is a low fence now, which is what an outfield wall is.

---

## WIRING

Both are real `DISTGEN` districts in `engine/bohemia_world.js` (town -> residential,
ballpark -> leisure), so they carry territory, economy, spawn tiers and quest addresses
like any other district. Tilespec dossiers generated; CITY IN_ZONE patched (the zone patch
tool is now general and idempotent rather than hard-coded to two names); phone slice,
map tab, quest placement judge, current slice and run slice all rebuilt.

Also fixed on the way: `tools/bohemia_district_grid_dump.js` had its scratch path
hard-coded to one dead session's private directory — the same defect already fixed in the
hero factory. Portable now (`BOHEMIA_SCRATCH` or the system temp dir).

---

## WHAT IS LEFT OF THE VALLEY

**97.2% generated.** 255 cells still flat:
- **199 are RESERVED FOR PAOLO'S HAND BY LAW** (resort 118, strip 81) — leave them.
- **12 more are his** (casino 5, sphere 4, strat/luxor/highroller/sign 1 each).
- **44 are the remaining buildable landmark set:** basin 8, convention 6, datafort 6,
  prison 4, dam 4, reservoir 3, reclaim 2, plus eleven single-cell landmarks
  (granary, fort, springs, radio, minigp, arsenal, gypsum, pumpstation, intake, quarry).
  That is the next ground item and it needs nothing from him.
