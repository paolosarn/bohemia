# BOHEMIA LAW — HAIR AT FOUR TIMES THE PIXELS (Paolo 8/25/26, LOCKED)

> "the side view is a lot better east and west you just have to be intentional
>  with the hairstyles making them looking good and the same and coordinated
>  from all angles. and you know we made the character model 4x and i feel like
>  with especially the hair your still playing with the orignal pixels. not the
>  pixels that are now 1 pixel because we made the canvas 4x bigger you know.
>  what you showed me looks decent asf. make whatever law u need and continue
>  with what you need to do"

Same message also lifts the P0-PROFILE hold: **the side view is passed.**
The 21 unjudged styles are no longer blocked by the view. They are blocked by
this law instead, and that is the point of writing it.

---

## CLAUSE 1 — A HAIRCUT IS ONE HAIRCUT FROM EVERY ANGLE

"making them looking good and the same and coordinated from all angles."

A hairstyle is not eight drawings. It is one object seen eight ways. Turning the
head must never change what haircut he is wearing.

That is a real risk here and not a hypothetical: genHair branches hard on
`back`, `prof` and `front`, and each branch was written at a different time for
a different complaint. The 8/2 profile fix, the back exemption and the front
curtain were three separate repairs, and nothing has ever asserted that the
three agree with each other.

**THE TEST: as the head turns one notch, the haircut may change appearance but
not IDENTITY.** Measured as the hair's own area and height, facing to adjacent
facing. A style that is a mane from the front and a crop from the side has
failed, however good either view looks alone.

## CLAUSE 2 — DRAW IN THE PIXELS WE ACTUALLY HAVE

"we made the character model 4x ... your still playing with the orignal pixels.
not the pixels that are now 1 pixel because we made the canvas 4x bigger."

The rig composes at 112. A mark drawn one CELL wide is TWO pixels there. A
generator that thinks in the old 56 grid can only make marks the old grid could
make, and the extra pixels buy a bigger haircut instead of a finer one.

**MEASURED THE DAY HE SAID IT, and he was right:**

    9 OF 15 CANON STYLES HAVE NO ONE-PIXEL MARK INSIDE THEM AT ALL.
    thinnest internal feature:  SLICK BACK 8   BOWL CUT 8   SHAG 8
                                LONG LOOSE 6   FRINGE 5   GREY WISPS 5
                                BUZZ CUT 4   CROP 4   SHOULDER LENGTH 4

Those nine are solid blocks of colour with a shaded rim and nothing inside. No
strand, no parting, no break. At 56 that was the only thing that fit. At 112
there is room and they still have nothing.

**AND A NUMBER THAT SAID OTHERWISE WAS MEASURING THE WRONG THING.** An edge-parity
audit reported 50.9% of hair edges sitting on the fine grid, which reads as "the
hair is already native". It was true and irrelevant: the 8/21 wobble gives the
OUTLINE a one-pixel step, and the outline is not the haircut. THE SHAPE IS THE
INSIDE. When a metric disagrees with him about his own art, suspect the metric.

**THE TEST: every canon style has at least one ONE-PIXEL mark inside its own
silhouette.** Not a demand for noise — a buzz cut is legitimately close to solid
— but a generator that cannot express a single one-pixel mark is still drawing at
56 and no amount of scaling fixes that.

## WHAT THIS LAW DOES NOT SAY

It does not say hair must be busy. Clause 3 of HOW HAIR AND SHAPE WORK (8/1)
still governs: little off shapes, never straight lines, deterministic so an NPC
does not shimmer. Fine detail that shimmers is worse than no fine detail.

It does not licence redrawing anything he has approved. ADD marks the finer grid
can hold; never thin a mark he ruled on. That rule is from the garment work and
it carries over unchanged.

## CLAUSE 1, PROVED THE SAME DAY, AND IT WAS BROKEN

The clause was not hypothetical. Measured hours after it was written:

    SHOULDER LENGTH   11 pixels of hair below the jaw facing S, SE and SW.
    LONG LOOSE        ZERO facing E, NE, N, NW or W.

Two of the fifteen were a mane from the front and a crop from the side. `sideF` is
how a style's LENGTH is written down, and both the 8/1 back fix and the 8/2 profile
fix clamped it to `hBot` — a floor for a cropped style and a **guillotine** for a
long one. Neither fix asked which. That is the branch-disagreement this clause was
written to catch, and the clause caught it.

**AND THE GATE THAT WAS SUPPOSED TO HOLD CLAUSE 1 WAS GREEN THROUGH ALL OF IT.** It
pinned the hair's own AREA between adjacent facings. Area SHOULD swing — from the
front you see a face and two curtains, from behind a whole skull of hair. Pinning a
quantity that legitimately moves cannot catch one that must not. **HOW FAR THE HAIR
FALLS** is a property of the object and not of the view; that is the ruler clause 1
needs, and it is the one that is pinned now.

Full finding: `records/BOHEMIA_A_HAIRCUT_IS_ONE_HAIRCUT_8_25_26.txt`

## THE GATE

`gates/hair_gate.js` — five ratchets, all downward-only:

  - **styles with no one-pixel mark inside them.** Pinned, only ever shrinks.
  - **how far a haircut FALLS, one notch of turn.** Pinned at 0.31 head-heights.
  - **a sheet of hair across his chest on a front facing.** Pinned at zero.
  - **from behind and side-on the hair reaches the jaw.** Pinned at zero short.
  - **identity swing between adjacent facings (area).** Pinned, kept as a net.

A law without a machine gate is not enforced, and this one is written the same
turn as the gate that holds it.

## WHAT HE APPROVED IN THE SAME BREATH

Three separate rulings, all in the affirmative, all recorded as verdicts:

  - "i like the boots got  stitching"
  - "i like the tiny hem pixels good job on that too"
  - "i like the scavanged armor too"
  - "i like the small things from the belts to gloves to scarfs to masks looked good"

That is FOUR FOR FOUR on the fine-detail passes -- boots, hems, armour and the
small things. Nothing was killed. The method is his now.

The fine-detail method is APPROVED: add one-pixel marks the finer grid can hold,
never thin a mark he ruled on. That is now his ruling and not my method, and it
is what clause 2 above applies to hair.
