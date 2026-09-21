# COOK — THE EDGE THAT DRUMS
## Round III, 9/21/26. [fight floor] round 2. THE FIGHT VERDICT round 2, item 5.
## COOKED AND REGISTERED IN VOTE: `cook-the-edge-that-drums-9-21`. Nothing went to the alpha or the demo.

---

## THE ONE THING MADE THIS ROUND

**Variants for the four kinds of ground tile that had exactly one picture each.**
`kerbL` and `kerbR` go 1 → 8. `gutterL` and `gutterR` go 1 → 4. They fold into the bank
this lane already ships, `banks/BOHEMIA_THE_FIGHT_FLOOR_9_21_26.txt`, which is now 66
images at 44 px and 66 at 88 px. Candidate: `slices/vote/COOK_THE_EDGE_THAT_DRUMS.png`.

    the strip down the side of a fight, 14 rows deep
    before:  1 picture,  the same tile 14 times in a row
    after:   8 pictures, longest run of the same tile: 1

---

## WHAT THE BOARD ASKED FOR

THE FIGHT VERDICT round 2, item 5: *"THE LEFT EDGE STRIP: one crack sprite tiles
vertically the whole frame — a repeat the eye catches in two beats (bible R3's stillness
wants nothing that drums)."*

Of that verdict's five items, one, two and the light are COMBAT's, three and four are UI's,
and item 5 is the only one that is art. This lane drew that and stopped.

---

## RULE 12: THE CAUSE IS EXACT, AND IT IS NOT A HASH BUG

The fight picks a variant with `h % n` where `h = imul(wx,73856093) ^ imul(wy,19349663)`,
and spins only the kinds in `ST_SPIN`. Counted off the shipped `COMBAT_B64`, how many
different pictures each column of the street can **ever** show:

    road 32   walk 32   lot 16   yard 16   slab 8   house 7   wall 4   median 3   lane 2
    *** kerbL 1   kerbR 1   gutterL 1   gutterR 1 ***

The street, west to east, is `walk walk kerbL gutterL lane road road road median road road
road lane gutterR kerbR walk walk`. A frame that shows the west kerb shows **one picture,
fourteen rows deep**. The hash is fine, the distribution is fine, and the pool has one tile
in it. That is the whole defect.

---

## NO NEW PIXEL WAS DRAWN. TWO CONSTRUCTIONS, BOTH HIS.

### THE KERB IS A SIDEWALK WITH A LIP, AND THAT IS MEASURED

`walk_kerb` compared to `walk_0`, row by row:

    rows 0..37   0 pixels differ
    rows 38..43  220 pixels differ

**The tile he approved IS `walk_0` plus a lip on the bottom six rows.** So applying that
same construction to his other approved sidewalks is the identical operation on a sibling,
not a redraw. Eight fields, each wearing his lip rows unchanged: the bank's `walk_0`,
`walk_1` and `walk_2`, and five tiles from the city's own 36-strong `side` pool, which
sits on the bank's concrete ramp plus the weed accents the 7/28 method allows ("accents:
up to two per tile, taken from that tile's OWN out-of-range pixels").

The tool refuses to run at all if that row test ever stops holding:

```python
if diff != list(range(LIP_FROM, TPX)):
    die('walk_kerb differs from walk_0 on rows %s, not %s -- it is NOT "a sidewalk '
        'plus a lip" and this construction is not his. Stop.')
```

### THE GUTTER HAS NO SIBLING, SO ITS FIELD IS REARRANGED, NEVER REPLACED

`road_gutter` differs from every road tile on every row: it is its own drawing, and its
field is darker than plain asphalt **because it sits in the kerb's shadow**, which is the
entire point of the tile. Swapping that field for a plain road would throw the shadow away.
So his band rows 0-5 stay exactly where he put them and the **field** is mirrored, which is
a permutation and invents nothing. Gated on the field being isotropic, measured on rows
6-43 with the band excluded:

    road_gutter quadrant spread 3.3   against plain road_0/1/2 at 3.5 / 4.0 / 2.8

No light in it to flip. Four arrangements: as drawn, mirrored left-right, mirrored
top-bottom, turned half round.

---

## THE ELEVENTH CATCH, AND THIS ONE THE TOOL CAUGHT ON ITSELF

The first run refused with:

    REFUSED: gutter field mirrored left-right came out identical to another variant

`Image.FLIP_LEFT_RIGHT` **is the integer 0**, so `if op:` silently skipped the mirror and
handed back the tile unchanged. A duplicate would have shipped as a "variant" that adds no
picture, in a cook whose entire purpose is adding pictures. The guard that caught it is the
one that exists for exactly this:

```python
if h in seen:
    die('%s %s came out identical to another variant -- that adds no picture '
        'and this whole cook exists to add pictures')
```

Fixed by comparing to `None` rather than to truth, with the reason written at the point of
use. Eleven catches now, and the method has not changed once: **measure AND look**, and put
a guard where the picture had to do the work.

---

## THE ANALOG HORROR BIBLE (rule 20, reference AH-01)

- **R3 THE LONG HOLD** is the rule the verdict cites: *"stillness is content... nothing
  animates that does not have to."* A repeat with a period short enough to read in two
  beats is motion the frame never asked for. This changes the period, which is the whole
  fix.
- **R4 THE LIGHT WAS IN THE ROOM** is why the gutter's field is mirrored rather than
  swapped: the dark band **is** the kerb's cast shadow and it stays exactly where he put it.
- **R10 GRIME IS BAKED** — every pixel here was baked on 7/28 or on 9/13. Nothing is shaded
  at runtime.

## THE REFERENCE CHECK (standing duty, 9/4 law)

- **AH-01** as above: R3, R4, R10.
- **TG-04 THE STREET TILE**, **TG-03 THE YARD TILE** — the references that put the kerb, the
  gutter and the sidewalk in the bank. Taken unchanged; this selects from them.
- **CGRD-03 A VEGAS BLOCK FROM THE AIR** — held against the whole column rather than one
  tile: a real kerb run is one continuous casting with cracks at irregular intervals, not a
  stamped unit. That is the structural rule the variant count serves, and it is why eight
  was the target rather than two.
- And rule 17's own comparison, **the street frame beside the fight frame**: the walked
  street draws its sidewalk from a pool of 36 and the fight drew its kerb from a pool of 1.

---

## THE ONE THING I AM SAYING ONCE AND NOT RE-COOKING

Verdict item 1 is *"THE LIGHT DOES NOT CARRY... the walk is warm daylight, the fight is cold
blue-grey with no fixture to point at"*, routed to COMBAT. Half of that is art and it is
already made: the fight's `road` and `walk` on main are still the pre-recook grey tiles,
734 to 1,478 colours each, while the street he walks is warm and 7. The warm bank has been
sitting in VOTE since `db792724` as `cook-the-ground-you-fight-on-9-21`, and both round 1's
and round 2's tiles are in the **same file**, so whenever COMBAT points the fight at it,
both fixes land together. Said once, not re-cooked, and not a request.

## WHAT THIS DOES NOT DO

- It does not touch `lane` (2 pictures) or `median` (3). They carry a marking that has to
  stay continuous down the column, so their variants are a different problem, and the
  verdict named the edge strip, not the lane.
- It does not touch the lot layout, the cell size, the light or the chrome.
- **Nothing was written to the alpha or the demo** (rule 18).

## HOW TO RE-RUN IT

    python3 tools/bohemia_the_edge_that_drums_cook_9_21_26.py

It prints the before-and-after run length for all four columns, and every refusal in it is
a sentence explaining what it caught.
