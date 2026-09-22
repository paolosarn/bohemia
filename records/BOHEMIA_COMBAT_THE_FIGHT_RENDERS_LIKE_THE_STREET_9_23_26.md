# V224 — THE LAST SIZE LIE WAS THE CANVAS, NOT THE DRAWING (COMBAT lane, `[fight looks]`)

**The coordinator's note on my row, 9/23, from V223:**

> *"the last size lie is the glass: 112 CSS px on the street against 56 in the fight at
> the same body constant, device pixel ratio. Rule 21's fight leg is exactly this:
> measure the fighter ON THE PHONE PROFILE in CSS px, same as body_scale_gate measures
> the street, and `[fight feel]` does not start until it reads 112."*

---

## THE MEASUREMENT, ON THE PHONE, BOTH SURFACES IN ONE SESSION

```
  THE WALK    canvas 378 backing / 378 CSS   k=1    the person is 112 CSS
  THE FIGHT   canvas 780 backing / 390 CSS   k=2    the person is  56 CSS
```

Their number exactly. And the cause is **one line**, and it is the same shape as every
other finding in this row: two surfaces, two different rules, and the fight invented
its own.

```
  THE STREET   function fit(){  ... cv.width=w; cv.height=h; ... }      1:1 with CSS
  THE FIGHT    function size(){ const dpr=Math.min(...,2);
                                cv.width=r.width*dpr; ... }             2x on a phone
```

**No constant inside the fight could ever have fixed this**, because the lie was in the
canvas and not in the drawing. V223 put the body at the ruled 112 *box* and the box was
already right; it was worth half as many pixels of glass as the street's.

---

## WHAT SHIPPED

The fight sizes its canvas the way the walked street sizes its own — copied from their
`fit()` (round the width, ceil the height so the canvas covers the sub-pixel remainder)
rather than invented here. With nothing else touched, and because V223 derives the lot
from the body, **the body and the ground move together**:

```
  the fighter    56 CSS  ->  112 CSS     rule 21, in body_scale_gate's own unit
  a house lot    98 CSS  ->  196 CSS     1.75 sprite widths, still his dial
  he stands      0.571 lots              UNCHANGED, because both moved
  the two canvases                       same backing-per-CSS, so the same sharpness
```

**And it is a quarter of the pixels**: 780x1354 becomes 390x677, so the fight paints
528,030 pixels a frame where it painted 1,056,120 — the direction rule 23 asks for
("quicker", PLUMBER's 60-on-a-phone floor), free, as a side effect of telling the truth
about the size.

### The first cut of this made the picture worse, and the photograph caught it

The board went from 3.6 lots across to 5.4 and the people went small again. The auto
frame's pad, slack and floor (96, 70, 80) are written in **canvas pixels** and were
tuned on a canvas twice this one, so halving the canvas doubled the margin they eat and
silently pulled the camera back. A pad and a slack are a **thumb margin**, and a thumb
is a physical size, so they live in CSS pixels and are converted by the canvas's own
backing-per-CSS: at the old 2x canvas that reproduces 96, 70 and 80 byte for byte, and
at the street's 1:1 it keeps the same margin on the glass. The ceiling and the 0.20
floor are ratios and do not move.

---

## PROOF, AND WHAT IN IT IS NOT PROOF

**Sound:** `the_person_is_112_gate` — **32 passed, 0 failed**, on THE WORKSHOP and THE
CUT HE OPENS, on the phone profile `body_scale_gate` uses (390x844, ratio 3, mobile),
reading the street's own 112 CSS in the same session as the fight's.

**Also sound — the before and after**, by the one driver (rule 14g), on the cut, on that
same phone profile, one run each side:

```
  MAIN      canvas 780 backing / 390 CSS   k=2   the fighter is  56 CSS
  V224      canvas 390 backing / 390 CSS   k=1   the fighter is 112 CSS
```

**NOT sound, and said rather than dressed up:** this gate's *mutation* run against main
reports `k=0`, `NaN` and `Infinity`, which means it never reached a live board on that
tree — so its ten reds say nothing about the fighter's size. **Four cuts of the frame
finder, each failing the mutation run in a different direction:**

1. `G` and `#fire` alone — takes a **dead** frame whose board is 0x0.
2. a board with pixels **and** a box — same.
3. pixels only, box waited for separately — finds **no fight at all** on main, which
   hides the very numbers the mutation exists to show.
4. prefer a live board, fall back to any — falls back to the dead one.

V221 already wrote down that more than one frame answers the city's URL and only one is
alive; the same is true of the fight frame. **The fleet's answer already exists and is
rule 14(g): use the one driver.** Rewriting this gate onto
`tools/bohemia_drive_the_demo.js` is a job, not a fifth patch at the end of a round —
and writing a fourth version of anything means I already failed, so I stopped.

---

## WHAT IT COSTS, SAID PLAINLY

A phone shows about two to three house lots during a fight. **That is not new and it is
not mine**: it is what his three rulings say when all three are obeyed at once — a
person is 112 (rule 21), a lot is 1.75 sprite widths (his dial), a phone is 390 CSS px
wide. V223 named the same collision at 3.03 lots.

## STILL OPEN, MEASURED, NOT FIXED

1. **The fight's auto frame still scales the PERSON as well as the ground.** At a wide
   frame he reads **71 CSS on the glass** rather than 112. Rule 21 says that camera
   moves the ground and never his size. This is the remaining half of rule 21's fight
   leg and it belongs beside `[fight feel]`.
2. **The way out is placed at 3.5 to 6.4 lots** off `sightTiles`, so it can sit off the
   glass — a placement derived from the wrong thing, not a reason to shrink anybody.
3. The gutter shadow, the half-transparent roof corners, the light not carrying, and
   the roof reading as a floor: all carried from V223, unchanged.

---

**Tool:** `tools/bohemia_fight_renders_like_the_street_patch.py` · **Gate:**
`gates/the_person_is_112_gate.js` (both surfaces, phone profile) · **Stamp:** 9/23g ·
**Tab:** COMBAT, and any fight you walk into from CITY.
