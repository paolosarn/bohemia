# DANGEROUS GROUND LOOKS DANGEROUS (8/20/26, WORLD lane)

> **§2.6 of the RF4 lift:** *never explain something the floor could have shown.*

## THE FLOOR COULD KILL YOU AND IT COULD NOT TELL YOU

Three days of work made the ground mean something: 31 hazard tiles across 22 districts, a
third occupancy state for the four real holes, ceiling rubble and lift shafts indoors.
**Every one of them drew as flat colour.** Loose ballast you cannot brace on was the same
picture as the concrete beside it. The only thing on screen that said the floor was
dangerous was **a line of text in the corner** — the system explaining itself because the
picture could not.

## THREE FORMS, DERIVED, NOT PAINTED

The mark is chosen by the tile's **hazard class**, which is itself derived from the
district's own legend. A drained pool authored into a new district next month is lethal that
afternoon **and looks lethal that afternoon**, with no edit here and no pixels cooked. A
hand-painted per-tile bank would be nineteen pictures that go stale the first time a
generator adds a twentieth tile.

- **LOOSE** (AMPLIFIES) — angular chips, four sizes, four values, no two shapes alike and no
  regular spacing. A regular scatter reads as a *pattern*, which is the barcode mistake that
  made the parking lot dogshit on 7/29.
- **WET** (DISABLES) — a translucent dark, blue-shifted wash with uneven scum in it and a
  lighter rim where it meets dry ground. **No highlight in the middle:** a shine in the
  centre reads as a swimming pool, and nothing in this valley is clean.
- **DROP** (KILLS / void) — a bright lip on the near edge and a hard shadow inside the far
  edge, drawn only where the neighbour is not itself a hole. That is the 45 DEGREE read: you
  are looking down into it from the south.

## THE GATE READS THE BAKED PIXELS, AND THAT IS THE WHOLE POINT

**Every flag was already correct before a single mark was drawn.** `c.haz` was stamped on
all 29 hazard tiles on the walked surface and the picture was byte-identical. A gate that
asserted *"the class is on the cell"* would have been green through a feature that did not
exist.

So `gates/hazard_look_gate.js` opens the real page, bakes a real chunk, and reads the actual
RGBA the player is looking at. Measured, on the glass:

| | broken-up | luminance | visible by |
|---|---|---|---|
| plain ground | 2.7% | 122 | — |
| **AMPLIFIES** | **7.6%** | 120 | TEXTURE |
| **KILLS** | **8.3%** | 50 | TEXTURE + VALUE |
| **DISABLES** | 2.5% | 85 | VALUE |

Kill the draw call and two classes fall back to *"look like plain dirt"*, the classes stop
being distinguishable, and the void's rim collapses from 6.6% to 1.0%. Make all three draw
the same mark and the distinctness check goes red. Both mutations confirmed.

## THREE THINGS THE PIXELS TOLD ME THAT READING THE CODE DID NOT

**1. THE CHIPS WERE INVISIBLE ON HALF THE VALLEY.** The first cut multiplied the base colour
by 0.62–1.42. That is fine on tan desert and *invisible* on railyard ballast: multiply a dark
grey by anything near 1 and you get another dark grey, on a tile that is already dark and
already textured. The step is **absolute** now, and its direction is chosen by the base's own
luminance — dark ground gets chips lighter than itself, light ground gets chips darker.

**2. THE WET MARK WAS WIPING THE GROUND.** It filled the tile with flat colour and measured
**0.0% broken-up** against 2.7% for ordinary dirt: a clean sheet of colour with the material
underneath erased. That is the one thing the ask forbids by name — *wet without reading as
clean.* And I had looked at the picture, read the flat teal as "water", and moved on. **The
pixels disagreed with my eye.** It is a translucent wash now, so the ground keeps its grain
and goes darker and bluer through it.

**3. AND MY GATE'S FIRST CLAIM WOULD HAVE MADE WATER LOOK LIKE GRAVEL.** It demanded every
class be *more broken up* than ordinary ground. That is right for loose rock and wrong for a
liquid: standing water **is** smoother than the dirt around it, and that is not a defect, it
is what water is. Chasing that number would have meant adding texture to a puddle to satisfy
a gate — the GOODHART GUARD in its purest form. The claim is now the one that was always
meant: **visibly different, by texture or by value.** Both are ways of being seen; requiring
a particular one is requiring a particular material.

## THE REUSE CHECK ENDED IN A REFUSAL AGAIN

Both banks were opened. `banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt` (via
`records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md`) is roadway, sidewalk, markings
and parking — 30-year street wash, not broken rock. `banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt`
has jersey barriers and sandbags in its `cover` family: **objects on the ground, not ground.**
Nothing in either bank is a ground hazard, so nothing fit, and rather than hand-paint
nineteen tiles this draws three procedural forms in the same idiom as the page's existing
texture generators.

**A hand-painted bank is still ART's to make if he wants one.** This is the honest interim,
and because it is derived it covers every tile including the ones authored next month.

---
**On the surface:** `tools/bohemia_city_hazard_look_patch.py` · **Gate:**
`gates/hazard_look_gate.js` (6 checks, two mutations confirmed) · **In a tab:** RUN, and the
pictures are **THE BAD FOOTING** and **THE HOLE** in the LOOK tab.
