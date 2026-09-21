# COOK — THE FIGHT STANDS ON HIS STREET
## Round II, 9/21/26. [fight floor]. THE FIGHT VERDICT round 1, item 1, about 70% of the frame.
## COOKED AND REGISTERED IN VOTE: `cook-the-ground-you-fight-on-9-21`. Nothing went to the alpha or the demo.

---

## THE ONE THING MADE THIS ROUND

**The fight's whole ground bank, 46 tiles, rebuilt out of art Paolo has already approved.**
Bank: `banks/BOHEMIA_THE_FIGHT_FLOOR_9_21_26.txt` (46 images at 44 px and the same 46 at
88 px). Candidate: `slices/vote/COOK_THE_GROUND_YOU_FIGHT_ON.png`, top of the VOTE queue,
verified on the real tab (17 waiting, no errors).

    worst tile      1,478 colours  ->  8          (the craft ceiling is 64)
    the whole board  9,635 colours ->  57
    warm pixels        53.9%       ->  60.8%
    images replaced    25 of 46; the other 21 were already his art

---

## WHAT THE BOARD ASKED FOR, WORD FOR WORD

THE FIGHT VERDICT round 1, item 1: *"blurred cold-grey slabs at a soft non-integer scale -
the warm brick-and-tan street he was standing on is gone, and the 1:1 pixel rule that fixed
the yards never reached the board. Fix: the street's own approved ground families at house
scale, crisp, warm, drawn 1:1."* And rule 17: **COOK draws only what the verdict lists.**

Rule 22 (Paolo 9/21): *"I need to be seeing them cooking up more, every time, not never."*
A making lane cooks every round and registers it in VOTE, and *"measure your part" as a
round's whole output is DEAD*. Last round was measurement only. This one is a cook, and the
measurement from last round is what made it a five-minute job instead of a guess.

---

## WHY IT COST NO NEW PIXELS

Last round (60a52ac9) proved the fight's `road` and `walk` are the city's `street` and
`side` **as they were before the 9/13 recook, byte for byte**. So the warm versions already
exist and already ship; they simply cannot reach a document that carries its own bank.

And the 7/28 starter bank — Paolo's own words, *"I checked it to do the other 41 mark it
approved"* — already contains every remaining kind the fight needs, including two pieces
**nothing in this game has ever drawn**: `walk_kerb` and `road_gutter`.

| fight kind | n | where every variant now comes from |
|---|---|---|
| road | 8 | city `street` (the 9/13 recook) |
| walk | 8 | city `side` |
| lane | 2 | city `lane_h`, a quarter turn |
| median | 3 | city `median_h`, a quarter turn |
| kerbL / kerbR | 1 / 1 | approved `walk_kerb`, a quarter turn each way |
| gutterL / gutterR | 1 / 1 | approved `road_gutter`, a quarter turn each way |
| house | 7 | approved `roof_slope`, `roof_ridge`, `roof_eave`, `roof_hipBL`, `roof_hipBR`, `roof_deck`, `roof_parapet` |
| yard | 4 | approved `yard_0/1/2`, `dirt` |
| wall | 4 | approved `wall_0/1/2`, `wall_base` |
| lot | 4 | approved `dirt`, `yard_0/1/2` |
| slab | 2 | approved `concrete_0/1` |

**Counts are held exactly**, so the fight's own `h % n` lands on the same index for the same
cell. This is an art payload swap and nothing else — the same discipline as the yard swap
on 9/13.

---

## THE ONE REAL OPERATION, AND THE TEST THAT ALLOWED IT

The fight's street runs **north-south**. `walk_kerb` and `road_gutter` were drawn for an
**east-west** one: the kerb lip sits on the bottom edge and the gutter's kerb shadow on the
top. They have to turn a quarter. The bank's own method line forbids more than that:

> *"Paolo DREW these. His drawing is approved content and I do not get to redraw it. They
> get the craft operation only."*

So the question is whether a rotation breaks the 45-degree light law, and it was measured.

**THE FIRST TEST I WROTE WAS WRONG AND ITS OWN GUARD CAUGHT IT.** Raw corner-to-corner
brightness put `walk_kerb` at 48.1 and the tool refused the turn. That 48.1 is not light, it
is the big dark crack sitting in one quadrant. A crack, a painted line and a kerb lip all
live in the **darkest and brightest steps of the family ramp** — they are structure. Drop
those two steps and what is left is the material, which is the only place a 45-degree sun
could be. Then compare each tile to **its own plain family sibling**, because the sibling is
the same material with no feature in it:

    walk_kerb    material 18.3  against plain walk_0  18.8   -> no light of its own
    road_gutter  material  6.5  against plain road_0   5.7   -> no light of its own
    (every featureless member of every family sits at 2.8 to 4.3: nothing here is lit)

What **is** directional is one axis only: `walk_kerb`'s rows spread 96 against 39 for its
columns (the bright lip on the bottom row, 170 against 110), and `road_gutter`'s rows spread
28 against 9 (the dark kerb shadow on the top rows, 43 against 68). **A quarter turn moves a
band and touches no light.** Nothing is redrawn, nothing is re-lit, no pixel changes colour:
a rotation is a permutation.

### AND THE TURN CHECKED ITSELF AGAINST THE GAME

`kerbL` and `kerbR` came out **byte-identical to what the fight already draws.** Somebody
derived the same quarter turn independently, and that is the strongest confirmation the
direction is right.

**`gutterL` and `gutterR` came out exactly swapped from the fight's.** The kerb at `wx=-4`
is immediately west of the gutter at `wx=-3`, so the shadow it casts belongs on the gutter's
**west** edge; the fight has it on the east, and mirrored on the other side of the road.
Measured on the edges (brightness of each outer row and column):

    gutterL  the fight now:  left 62, right 43     the kerb is on its LEFT
    gutterL  this cook:      left 43, right 62

That is a lighting error, which is bible rule R4 (THE LIGHT WAS IN THE ROOM), and it is one
tile on each side of the road. Stated as what was measured, not as a claim about intent.

---

## TWO THINGS THE PICTURE CAUGHT THAT NO NUMBER WOULD HAVE

Both are now **guards inside the tool**, so a picture never has to catch them again.

**THE NINTH WRONG-ORACLE CATCH: the markings were drawn for the wrong road.** The first cut
used the city's `lane_v` and `median_v` on the assumption that `_v` meant "for a vertical
street". Stacked down the fight's column they make **ladder rungs across the road** instead
of a line along it. The city rotates these at draw time —
`BOHEMIA_CITY_WORLD.html`: *"the `_h`/`_v` pairs in SA_TILES ARE... rot90 for an EW road, and
whoever built SA_TILES duplicated them instead of rotating."* Turned, `lane_h` gives one
unbroken line down the middle (a lane divider) and `lane_v` gives a double line (a centre
marking). So the divider is `lane_h` turned and the centre is the orange median turned.

**THE TENTH: two of the approved roof pieces are half sky.** `roof_hipTL` is 48.9% opaque and
`roof_hipTR` is 51.1%. On a roof they are corners. Laid flat as ground with nothing behind
them they **punch black triangles through the floor**, and the rendered board showed two rows
of them. The opaque roof pieces took their place, and the tool now refuses any ground tile
under 100% opaque, with the reason written at the point of use:

```python
# A GROUND TILE IS OPAQUE OR IT IS A HOLE.
op = sum(1 for p in im.getdata() if p[3] > 250) / float(im.size[0] * im.size[1])
if op < 0.9999:
    die('%s is %.1f%% opaque -- a ground tile with a transparent pixel is a '
        'HOLE IN THE FLOOR and renders black. Not a ground tile.' % (prov, 100 * op))
```

Nine and ten, on the same list as the other eight. The method that keeps working is the
same one: **measure AND look.**

---

## THE ANALOG HORROR BIBLE (rule 20, reference AH-01)

- **R4 THE LIGHT WAS IN THE ROOM** — passes by construction. The measurement above shows no
  baked mood gradient anywhere in this material, and this cook adds none. The gutter fix
  puts a cast shadow back on the side the thing casting it is actually on.
- **R10 GRIME IS BAKED, NEVER SHADED** — the bible's own reading fails the fight on R10 and
  names the cause: *"blurred floor is scale, not grime."* Every kind ships at **44 px
  (native, 1:1)** and at **88 px (a clean 2x, nearest neighbour, every pixel a 2x2 block,
  verified to invent no colour)**, so a whole-number draw is available. Which one the board
  uses is COMBAT's `ring`, not art: 44 → 67 is scale 1.523 and doubles 23 of the 44 rows,
  which is the blur.
- **R1, R3, R5, R7** are placement, motion, type and occupancy. Not a ground tile's to pass.

## THE REFERENCE CHECK (standing duty, 9/4 law)

**No new art was drawn, so there is no shot in the dark to defend.** What was compared, and
against what: the fight board beside **the street he walks**, which is rule 17's own
comparison and the only authority on whether the fight is in the same world; the **analog
horror bible AH-01** on R4 and R10 above; and the 7/28 bank's own Vegas references (TG-01
lot sizes, TG-03 the block wall), which are what put these tiles in the bank in the first
place. Changed from the sources: orientation only, on six tiles, by a quarter turn, with the
light measured before and after.

---

## WHAT THIS DOES NOT DO, ON PURPOSE

- **The lot layout is untouched.** `lotSubKind` alternates `house`/`yard` every row and puts
  a `wall` every fourth column; that is the checkerboard Paolo named on 9/18, it is COMBAT's
  code, it is **my own from 9/6**, and THE FIGHT VERDICT has not listed it. The candidate
  card says so in plain words rather than hiding the lot band out of frame.
- **The cell size is not picked here.** That is COMBAT's `ring`. Both legal sizes ship.
- **Nothing was written to the alpha or the demo** (rule 18). The bank is a bank and the
  candidate is a VOTE item.
- **Item 5 of the verdict, the cover objects, was not started.** It is the next thing this
  lane cooks: the board is empty slabs and the approved street furniture that makes cover
  legible is absent from the picture.

## HOW TO RE-RUN IT

    python3 tools/bohemia_the_fight_stands_on_his_street_cook_9_21_26.py

Every refusal in that tool is a sentence explaining what it caught and why, including the
one that caught the tool's own first sun test.
