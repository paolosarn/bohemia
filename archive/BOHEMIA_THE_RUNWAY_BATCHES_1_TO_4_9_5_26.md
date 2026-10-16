# THE RUNWAY -- BATCHES 1, 2 AND 3 (9/5/26, COOK lane, cook-mce6r5)

*(Batch 1 is the lower half; batch 2, added the same day in the second round of the
same job, is the outer rail and the two flattest rails in the game. The job
[runway clothes] WARDROBE-REMAKE is STILL CLAIMED, not shipped: its ship test is
EVERY garment, and gear, back, head and face have not been touched.)*

Paolo 9/4, LOCKED (laws/BOHEMIA_ADDENDUM_THE_RUNWAY_AND_ART_AT_ALL_TIMES_9_4_26.md):

> "every piece of clothing and every hairstyle should be modeled after like fashion
>  brands... Balenciaga, Rick Owens... no matter their faction no matter what's
>  going on I want everyone to look like they could be in a Balenciaga or Rick
>  Owens show."

First job of the COOK lane. VAMILY row: `WARDROBE-REMAKE`.

---

## THE MEASUREMENT THAT PICKED THE BATCH

Taken before a pixel moved. Every canon garment's generator call, with the RAMP
FIELD STRIPPED OUT -- so two entries that differ only in colour collapse into one
shape. That is STRUCTURE-NOT-COLOR (7/19) turned into a number:

```
    base   70 garments ->  21 shapes (30%)      head  19 ->  8 (42%)
    legs   26 garments ->   4 shapes (15%)      gear  26 -> 13 (50%)
    feet   22 garments ->   2 shapes ( 9%)      back  12 ->  6 (50%)
    outer  55 garments ->  15 shapes (27%)      neck   7 ->  2 (29%)
    TOTAL non-hair: 256 garments -> 79 distinct shapes = 31%
```

**TWENTY-TWO PAIRS OF SHOES AND TWO SHAPES. TWENTY-SIX PAIRS OF TROUSERS AND
FOUR.** Two thirds of this wardrobe is colourways.

And the two thinnest rails are exactly the two the register he named is loudest
in. That is why the first runway batch is trousers and boots and not another
coat: **the hole and the brief are the same place.**

---

## THE REFERENCE CHECK (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md)

Compared side by side before anything was drawn. Structural rules taken, in plain
words, with no borrowed name entering the design (8/28 stands: BALENCIAGA and
RICK OWENS are in the reference set because HE put them there, and nothing else
is).

* **RICK OWENS / DRKSHDW trousers.** The crotch seam sits low and the leg tapers
  to the ankle: **widest at the hip, narrowest at the floor.** Also taken: a leg
  cut LONGER than the leg, so it collapses in folds over the boot.
* **RICK OWENS footwear.** A thick stacked sole that lifts the whole shoe and
  overhangs the foot; and a tall shaft that SLOUCHES instead of standing rigid.
* **BALENCIAGA under Demna.** **Proportional contrast is the signature** -- boxy
  oversized shoulder against a cropped, narrow lower half; and the other pole,
  the high-waisted wide pleated trouser.
* **THE PIXEL AISLE**, because a rule that does not survive 56 pixels is not a
  rule. The standing practitioner test is: black the sprite out and look at the
  outline; if you cannot tell the pieces apart in one colour, no amount of
  shading will fix it. Budget is 2-3 colours per part.

**WHAT THE COMPARISON CHANGED: every shape in this batch is a SILHOUETTE edit and
none is a surface edit.** No seam, no topstitch, no logo, no texture. That is the
happy finding and it is worth writing down for every future batch:

> **THE REGISTER HE PICKED IS THE ONE REGISTER THAT SURVIVES OUR PIXEL BUDGET,
> BECAUSE IT IS MADE OF PROPORTION, AND PROPORTION IS WHAT AN OUTLINE IS MADE OF.**

A house that signed its work with embroidery would be unbuildable here. This one
signs it with the shape of a shoulder.

---

## WHAT SHIPPED

Nine new shapes, twenty garments, in three existing generators. No new generator,
no new colour, no new bank.

| rail | new shape | what it is |
|---|---|---|
| legs | `cut:'drop'` | low yoke to mid-thigh, then the legs separate and taper to the ankle |
| legs | `cut:'wide'` | high waistband, the leg opens all the way to the floor, pleated |
| legs | `cut:'stack'` | a leg longer than the leg: it pools over the boot in hard fold bands |
| legs | `cut:'crop'` | cut above the ankle with a wide turn-up, not tapered |
| feet | `shaft:'mid'` | four rows of shin, between the ankle shoe and the knee boot |
| feet | `shaft:'slouch'` | a tall shaft that collapses: wider than the leg, creased, top line asymmetric |
| feet | `sole:'stack'` | two cells of sole and one of midsole, overhanging the foot, lifting the shoe |
| base | `shoulder:'wide'` | the shoulder runs two cells past the body and squares off, then drops |
| base | `cut:'long'` | a longline hem past the hip, so below the waist is one mass, not two |

Wardrobe after: **276 garments -> 92 shapes.** LEGS 4 -> 8, FEET 2 -> 6, BASE 21 -> 26.

Measured on the real picker, 3,000 citizens through `BOH_PERSONLOOK.lookFor`:
**1,629 of 3,000 are wearing at least one piece of this batch, and all twenty are
worn by somebody.** Nothing here is a seventeenth invisible hat.

---

## THE GATE, AND THE RULER THAT WAS WRONG FIRST

`gates/runway_gate.js` cannot tell you whether a trouser looks like a runway
trouser. That is DIRECTION's judgement and then his thumb. What it can hold is
the one bar this wardrobe has already failed **in writing, with a verdict on it**:

> n:'STEEL V-NECK TEE' | 7/25/26 | DOWN, all 3 (Paolo: "delete these terrible").
> "the neck:'v' carve ... reads as visually IDENTICAL to a plain crew neck ... A
> 'new shape' that cannot be told apart from the shape beside it is not
> structure, it is a recolor wearing a new name."

So **the dead garment is the ruler**, measured live as a control on every run.

**AND THE FIRST RULER I REACHED FOR WAS THE BROKEN ONE.** The obvious measurement
is AREA -- what share of the garment's cells changed. On that scale:

```
    THE DEAD V-NECK      6.74%
    oversized shoulder   5.71%
```

**The garment he deleted outscores the loudest thing in the register he named.**
A gate written that morning would have gone green on the corpse and red on the
new work. Measured on the OUTLINE instead -- rows whose left or right edge moves,
the widest line, the vertical extent:

```
    THE DEAD V-NECK      0 rows moved of 18,   widest line 16 -> 16
    oversized shoulder   4 rows moved of 18,   widest line 16 -> 20
```

**ZERO.** The garment he deleted does not move one pixel of the outline and does
not change the widest line by one. That is his verdict, in a number, and it is
what the gate is built on. Area counts cells wherever they are; a player reads
the edge.

This is the same lesson this repo keeps paying for, with the sign flipped: WHEN A
NUMBER DISAGREES WITH HIM ABOUT A PICTURE, FIX THE RULER (8/27). Here the number
disagreed with a picture in his favour and the ruler was still the thing to fix.

Three axes, because "different" comes in three flavours at 56 pixels: **wider**,
**longer or shorter**, **a different line down the side**. A cut that moves none
of them is a colourway. Gate: 35 checks, 0 failed, and the dead V-neck fails the
gate's own bar as a built-in mutation test that is not synthetic.

---

## FOUR THINGS ONLY LOOKING CAUGHT, AND ALL FOUR PASSED THE GATE

His 8/25 order (item 3) and VERIFY ON THE REAL SURFACE (7/18). Every one of these
was green on every check when it was found.

1. **THE SHOULDER PADS WERE FLOATING IN THE AIR.** The pad was grown from the
   arm's global min/max column -- which is the widest row, the ELBOW. The real
   rig's shoulder rows are narrower than that, so the fabric was painted two
   cells out from a column the body does not occupy up there: two small dark tabs
   with a gap of background between them and the man. **THE MANNEQUIN COULD NOT
   SHOW IT, BECAUSE ITS ARMS ARE PERFECT RECTANGLES.** Fixed by growing the pad
   off *this row's* own body edge, so it stays attached on any rig in any facing.
2. **THE DROP RISE READ AS A POUCH.** At 0.45 of the leg the yoke stopped at the
   hip and the legs below were ordinary, so it read as padding strapped round the
   waist with the hands sitting on top of it. The idea is that the gap between
   the legs STARTS LOW; the yoke now reaches 0.58 and the leg tapers. Also cut
   from two cells of overhang to one, because at two it reached out under the
   HANDS -- drape hangs off a body, it does not stick out past the arms.
3. **THE STACKED HEM WAS A DITHER, NOT A FOLD.** One-cell bands alternating over
   six rows read as noise on cloth. Two-cell pitch gives three real creases.
4. **THE CROP DEPENDS ON WHAT IS UNDER IT.** On the real rig the shin below a
   cropped trouser is dark, so the tonal break is quiet. The turn-up went from
   one cell to two: the hem itself has to be the thing you see.

Plus one caught by the ASCII harness before it reached the picture: the mid shaft
had **no line of its own** in the shading and fell through to the padded-collar
fill, rendering as one flat dark tube. A new length with no shape in it is the
dead V-NECK again.

---

## WHAT THIS BATCH DELIBERATELY DID NOT DO

* **The 10% long-coat cap (8/27) is untouched.** Not one garment here is an outer
  coat. The gate counts it rather than asserting it.
* **No colour was invented.** Every ramp spent was already in the file. COLOUR IS
  TERRITORY (8/26): the runway gives the CUT, the faction gives the COLOUR, and a
  faction's colour is not this lane's to spend.
* **The graveyard was read first.** No dead trouser, shoe or top SHAPE exists.
  The one clothing kill is the V-neck, which is a neck, and nothing here is a
  neck. Nothing was revived.
* **Nobody is dressed in it by hand.** Who wears what is CHARACTER's wiring and
  his ruling. The crowd picks it up because it is canon, which is the mechanism
  that already existed.
* **The approved wardrobe did not move.** `gates/clothes_4x_gate.js` passes
  13/0 with all 1,744 pinned 56-pixel hashes unchanged.

---

## THE ONE THING THIS LANE IS MISSING, AND IT IS NOT A BLOCKER

**THE STYLE CARD DOES NOT EXIST YET.** The 9/4 law says DIRECTION writes it
first, in pixel terms, and COOK cooks under it. It has not landed, so this batch
was cooked to the register the law itself states in words a cook can use
("monochrome and dust, drape and asymmetry, elongated and oversized proportion,
layered jersey and leather, destroyed and distressed on purpose, heavy boots")
plus the reference check above. **That was the right call rather than idling** --
the art lane never idles, by the same law -- but it means DIRECTION may want
different numbers, and every shape here is a named dial that can be re-tuned
without re-cooking anything.

---

## FILES

```
tools/bohemia_runway_cook_9_5_26.py       the cook: eleven exact-once patches into the alpha
tools/bohemia_runway_picture_9_5_26.js    before/after on the REAL rig, three facings, rule named
gates/runway_gate.js                      35 checks; the dead V-NECK is the calibration control
slices/look/runway-before-after.png       the sheet
```

Tab: **CHARACTER** (the wardrobe, try them on) and **RUN** (the crowd is already
wearing them).


---
---

# BATCH 2 -- THE OUTER RAIL, AND THE TWO FLATTEST RAILS IN THE GAME

Second round of the same job, same day. The measurement was re-run after batch 1
and it named the next rail without anybody deciding anything.

## ELEVEN OF FIFTEEN "SHAPES" WERE THE SAME COAT

```
    OUTER  55 garments -> 15 shapes
        9  genCoat{vest:true}        7  genCoat{len:0.34}      2  genCoat{len:0.82}
        7  genCoat{jacket:true}      7  genCoat{len:0.56}      2  genCoat{len:0.86}
        6  genCoat{len:0.88}         3  genCoat{len:0.9}       2  genCoat{len:0.8}
        3  genPoncho{}               2  genApron{}             1  genCoat{len:0.84}
    NECK    7 garments -> 2 shapes   (a scarf, and the same scarf with a long tail)
    HANDS   4 garments -> 1 shape    (one glove, four colours)
```

**A LENGTH IS A REAL SHAPE** -- the 8/27 hip and thigh bands proved it and the
trenchcoat gate still holds those band floors -- **BUT ELEVEN LENGTHS OF ONE COAT
IS STILL ONE COAT.** Open down the middle, straight shoulders, an A-line skirt
that only ever flares wider as it falls. No wrap, no asymmetry, no closed round
shoulder anywhere. NECK and HANDS are simpler and worse: one shape each, eleven
garments between them.

## FIVE MORE SHAPES

| rail | new shape | what it is |
|---|---|---|
| outer | `wrap:true` | no front opening at all; one panel crosses, a belt holds it |
| outer | `asym:true` | the hem cut on a slant, one side long and one short |
| outer | `cocoon:true` | widest at the body, narrowing to the hem: the inverse of the A-line |
| neck | `kind:'cowl'` | a mass on the shoulders, not a ring on the neck |
| hands | `kind:'handwrap'` | strapping past the wrist, up the forearm |

Ten garments. All three coats are cut at HIP and THIGH, never at or past 0.70:
the 8/27 cap says "no matter what" and the reason is the heat, so a runway coat
earns its look from the CUT. The gate now checks the length of every coat this
batch adds rather than asserting that it added none.

**Wardrobe after both batches: 256 -> 286 garments, 79 -> 99 shapes.**
LEGS 4->8, FEET 2->6, BASE 21->26, OUTER 15->20, NECK 2->3, HANDS 1->2.
On the real picker, 3,000 citizens: **2,086 wear at least one piece, and all
thirty are worn by somebody.**

## THE GATE FAILED TWO OF MY OWN SHAPES, AND ONLY ONE OF THEM WAS THE SHAPE'S FAULT

This is the part worth keeping.

**THE WRAP COAT SCORED ZERO.** Nought rows of outline moved, widest line
unchanged -- the same score as the dead V-NECK. And it is obviously a different
garment: it closes the front slit that every other coat in this wardrobe hangs
open. **The slit is INSIDE the per-row span, so a test that reads only the
leftmost and rightmost painted cell of each row cannot see it.** The
practitioners' test can: black the sprite out and the slit is still there, a hole
with the body showing through. **A HOLE IS PART OF THE OUTLINE.** Second blind
spot found in this ruler in one day.

**AND THE FIX HAD TO BE CALIBRATED ON THE CORPSE, NOT ON MY WORK,** because this
is precisely where a gate starts serving its author. Measured before adopting
anything:

```
                     hole delta    columns moved
    THE DEAD V-NECK      12            4/16 = 25%
    wrap coat            66            3/17 = 18%
    asymmetric coat       6           11/17 = 65%
```

A per-COLUMN top/bottom axis would have rescued the asymmetric coat at 65% -- and
it would have **let the dead V-neck through at 25%.** So it was refused. The hole
axis was adopted with its bar set at **three times what the dead garment scores on
that same axis** (12 -> 36), which is one rule derived from the corpse rather than
a number picked to fit. The wrap passes at 66; the V-neck fails, and the gate
re-measures that every run.

**THE ASYMMETRIC COAT WAS JUST WEAK.** 12% of the outline, one pixel of width: an
asymmetric hem you have to be told about is the V-NECK with a new name. The rise
went from 0.34 of the skirt to 0.55 with a four-cell floor, so the two sides now
differ by more than half the skirt -- one hip, one thigh. It passes at 19% on the
row axis it was already being measured by, with no bar moved.

## AND TWO MORE THINGS ONLY LOOKING CAUGHT

6. **THE COCOON GREW PALE SLABS DOWN BOTH SLEEVES.** The round shoulder lit every
   arm pixel that was not on an edge, so the coat read as two objects tacked to
   the man. The width is what makes a cocoon; the sleeve keeps the shading it had.
7. **THE COWL WAS A BOX ON HIS SHOULDERS** -- a flat trapezoid, widest at the top,
   cut off level at the bottom. That is a yoke, not cloth. It starts at the neck's
   own width now, spreads onto the shoulders two rows down, sits four rows deep
   instead of five, and its hem is uneven. The first uneven hem was every other
   cell, which at this size read as a **crown**: a repeating notch is a straight
   line with holes in it (8/1). Hashed off the column instead, deterministic so
   nobody in a crowd shimmers.

Gate: 47 checks, 0 failed.


---
---

# BATCH 3 -- THE WAIST, THE BACK, AND ONE HAT NOBODY HAS EVER WORN

## THE FIRST MOVE THIS ROUND WAS AN AUDIT, NOT A COOK

Because this repo's most repeated failure is not a missing shape. It is a shape
that exists and never reaches the player: seventeen invisible hats, four bright
garments nobody wore, a face maker with no door, fifty-one approved sounds with no
caller. So before drawing anything, every `kind` the five kinded generators can
DRAW was pulled out of their own source and diffed against every `kind` the
wardrobe ASKS for:

```
    genHat    can draw  4   UNREACHED: wrap
    genAcc    can draw 12   UNREACHED: none
    genGear   can draw 14   UNREACHED: none
    genBag    can draw  4   UNREACHED: none
```

**`genHat kind:'wrap'` IS BUILT, IS DRAWABLE, KNOTS AT THE NAPE FROM BEHIND AND
TIES AT THE SIDE IN PROFILE, AND NO GARMENT HAS EVER ASKED FOR IT.** Two entries
and no pixels. That is worth more than a new shape, because the art was already
drawn and already good.

*(One false positive, recorded because the lesson is the gate's own: the sweep
first reported `genTop.hoodUp` unreached. It is reached, as `hoodUp:CLO_HOODUP`,
not `hoodUp:true`. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN
ONE -- 8/1, and it caught me inside the tool written to catch that exact class.)*

## TWO NEW SHAPES

| rail | new shape | what it is |
|---|---|---|
| waist | `kind:'wrapbelt'` | a deep wrapped band up the ribs, knotted off-centre, standing a cell off the body |
| back | `oneShoulder:true` | one shoulder covered, the cloth crossing diagonally to the opposite hip |

The waist rail was three shapes for five garments and its belt is TWO ROWS: at 56
pixels a line and a mass are different objects, and that rail only had lines. The
back rail's cape and mantle are both mirror-symmetric, so the drape is the first
thing on it whose left and right differ -- and unlike the coat's asymmetric hem it
reads from the FRONT, where a player spends most of the game looking at people.

## WHAT THE COMPARISON REFUSED, WHICH IS THE USEFUL HALF

**A BALACLAVA.** Both named houses build one and it was first on the list. It
cannot be cooked here: genHat's `put()` refuses every pixel below THE HAT LINE --
the durag line, Paolo's own 7/18 ruling, *"the durag I have already established...
will be the borders of any sort of hat or beanie."* **A garment that has to cross a
locked line is not a cook, it is a request for a ruling**, so it is a [PENDING
Paolo] in the handoff and not something I quietly built a way around.

**A WIDER BRIM**, for a duller reason: `kind:'brim'` already runs its ring to the
head span plus two cells each side, so a wider one is a DIAL. Shipping a dial as a
shape is what the dead V-NECK was.

**Wardrobe after three batches: 256 -> 292 garments, 79 -> 102 shapes.**
On the real picker, 3,000 citizens: **2,378 wear at least one piece, and all
thirty-six are worn by somebody.** Gate: 52 checks, 0 failed.

---
---

# BATCH 4 -- THE FACE, AND THE FIRST MEASUREMENT OF THE CARD'S TWO POLES

## THE FACE RAIL

GEAR was measured and left alone: all 13 of its kinds run against each other
through runway_gate's four-axis ruler pass **78 of 78 pairs**. It is the healthiest
rail in the wardrobe and padding it would be volume for its own sake. FACE was thin
in COUNT (10 garments over 4 shapes) while every shape it had was real, so it got
shapes and not colourways.

| rail | new shape | what it is |
|---|---|---|
| face | `kind:'visor'` | a shield running PAST the head at the eye line, so the blacked-out head is wider |
| face | `kind:'facewrap'` | cloth round the jaw, a cell proud of the skull on each side, carrying onto the neck |

Both change the blacked-out HEAD, which is the only kind of change a face garment
can make at 56 pixels. The two canon pairs of shades and the dust mask all sit
INSIDE the head's outline by construction.

**THE FENCES WERE CHECKED FIRST, BECAUSE THE FACE IS THE MOST RULED-ON PLACE IN THE
WARDROBE.** "Never at/above the eyes" is the DUST MASK'S OWN rule, not the rail's --
the gasmask's own comment says so and then covers the eyes -- so an eye-covering
class is legal with the gasmask as precedent, and the wrap still starts below the
eyes because it is a mask-class garment. A BALACLAVA stays refused: it must cross
the durag line, which is his 7/18 ruling, and that is [PENDING Paolo].

## AND THE GATE'S NEW CHECK WOULD HAVE CONDEMNED HIS APPROVED DUST MASK

The first version derived the eye band from the RAW widest rows of the face part
(9..13 on the mannequin) and flagged anything painting row 13 or above. **The canon
dust mask paints row 12. So does the new wrap. Identical.**

The generator's own band is narrower and deliberately so: genAcc clamps the widest
rows to two cells at the centre, with its own comment giving the reason -- *"Fraction
math kept landing the mask on the eyes (balaclava bug)."* Clamped, the band is 10..11
and mouthY is 12, exactly where both garments start.

**THE RULER WAS THE BROKEN ONE (8/1), for the third time in this job.** The check now
measures the band the way the code that draws it does, and **THE CANON DUST MASK RUNS
AS A LIVE CONTROL BESIDE THE NEW WRAP** -- the same role the dead V-NECK plays for
shape. If a future edit to this check starts failing his approved garment, the gate
says so out loud instead of quietly condemning it.

## THE FIRST MEASUREMENT OF SECTION 2, AND IT DISAGREES WITH OUR RIG

The card's section 2 says every dressed body must commit to POLE A (wide at the top)
or POLE B (tall and stacked) "or it reads as neither", and gives pixel numbers.
Nobody had measured our shapes against them. Measured now, at 56, on the alpha's own
generators:

```
hip span = 8 px.   POLE A wants shoulder >= hip+2 (>=10).   POLE B wants shoulder <= hip (<=8).

    plain top            shoulder 16   -> POLE A
    WIDE SHOULDER        shoulder 20   -> POLE A
    LONGLINE             shoulder 16   -> POLE A
    SHOULDER + LONGLINE  shoulder 20   -> POLE A
```

**A PLAIN T-SHIRT IS POLE A. AND POLE B IS UNREACHABLE BY ANY GARMENT.** The reason
is not a bad card, it is two different bodies: the card measures the PAPERDOLL body
(24x50, module 13) whose hip and shoulder are both torso, while a dressed sprite's
shoulder includes THE ARMS, which are 16 px across before any cloth. No garment can
make a shoulder narrower than the arms it covers.

That is a finding for DIRECTION, not a licence for this lane to pick its own number:
the card is theirs to keep current. What this lane can say is what the rig actually
measures, which is above. **A SHOULDER RULE FOR A DRESSED SPRITE HAS TO BE WRITTEN
AGAINST THE ARMS, NOT THE TORSO** -- as a ratio to the plain-top baseline of 16, the
oversized shoulder is +25%, and that number does separate it from everything else.

The other two pole tests are met and are useful as they stand:

```
POLE B, the leg: widest between hip and knee, tapering to the ankle
    plain trouser   thigh  8  ankle  8   does not taper
    DROP RISE       thigh 10  ankle  6   TAPERS
    CROPPED         thigh  8  ankle  0   tapers (it ends above the ankle)
    WIDE PLEAT      thigh 10  ankle 14   opens -- pole A's leg, not pole B's
    STACKED HEM     thigh  8  ankle 12   opens -- the pool is the point

POLE B, the boot as a pedestal: a dark platform >= 2 px tall that widens the base
    plain shoe      base  8 vs foot 8   0 rows   not a pedestal
    STACKED SOLE    base 10 vs foot 8   2 rows   PEDESTAL
    MID + STACK     base 10 vs foot 8   2 rows   PEDESTAL
    SLOUCH          base  8 vs foot 8   0 rows   not a pedestal
```

So the batch already carries a real POLE B leg (drop rise) and a real POLE B base
(the stacked sole), and the wide pleat and stacked hem are deliberately the other
pole. Nothing here needs re-cutting; what needs settling is one number in the card.

**Wardrobe after four batches: 256 -> 296 garments, 79 -> 104 shapes.** All forty of
this lane's garments sit inside the card's palette, and the card's headline number
is **42%**, from the 32% it shipped at. Gate: 61 checks, 0 failed.

---
---

# THE CARD'S SHAPE RULES, MEASURED AND HELD (round after batch 4)

The style card does not only govern colour, and until this round the gate held none
of its SHAPE rules. Section 2 gives pixel numbers for the two poles. Three are
testable on our rig; two are now held by machine and one cannot be.

## RNWY-01 -- THE SQUARE SHOULDER. HELD.

```
    plain top        row 18  20..35   row 19  20..35   corner rounding 0 px
    WIDE SHOULDER    row 18  18..37   row 19  18..37   corner rounding 0 px   SQUARE
```

**THE FIRST RULER MEASURED THE WRONG THING AND WOULD HAVE FAILED THE PAD.** It took
how far the edge moved across FIVE rows and reported 2 px. Those 2 px are the pad
*ending* -- its deliberate hard drop off the shoulder -- not a rounded corner. A
corner is the top two rows. Measured there, the pad is perfectly square.

## RNWY-07 -- THE ASYMMETRIC HEM. HELD, WITH A CONTROL.

```
    plain coat 0.56    skirt hem spans 0 px across the body   level
    ASYMMETRIC COAT    skirt hem spans 8 px                   A DIAGONAL EVENT
    ASH ASYM 0.34      skirt hem spans 5 px                   A DIAGONAL EVENT
    plain coat 0.34    skirt hem spans 0 px                   level
```

**THE FIRST RULER SCORED A PLAIN COAT AT 22 PX -- IDENTICAL TO AN ASYMMETRIC ONE.**
It took the lowest painted row per column across the WHOLE garment, sleeves and
collar included, so it was measuring the coat's height and calling it a hem. Now it
reads the skirt hem only, and it discriminates: symmetric coats score 0, the
asymmetric ones 5 and 8. **THE PLAIN COAT IS KEPT AS A LIVE CONTROL THAT MUST SCORE
ZERO** -- a ruler that cannot tell them apart is measuring the wrong thing, and this
gate now catches that automatically.

## THE ONE THAT CANNOT BE HELD, AND WHY IT IS REPORTED RATHER THAN ENFORCED

The card's POLE A / POLE B **shoulder span** rule is written against the PAPERDOLL
body, whose shoulder and hip are both torso. A DRESSED SPRITE'S shoulder is its
ARMS -- 16 px across before any cloth, against a hip of 8. So a plain t-shirt is
pole A and pole B is unreachable by any garment ever cooked. That number is
DIRECTION's to settle; this lane measured it and left the card alone.

## THE COUNT THAT MATTERS MOST IN THIS WHOLE JOB

**Six rulers have been wrong in this job, and not one shape was ever changed to fit
a bar.**

1. AREA scored the dead V-NECK above the oversized shoulder.
2. The OUTLINE ruler scored the wrap coat at zero (a slit is a hole).
3. The FACE check would have condemned his approved dust mask.
4. The SHOULDER CORNER ruler measured the pad's drop, not its corner.
5. The ASYMMETRY ruler measured the coat's height, not its hem.
6. And the one that was NOT a ruler bug: the asymmetric coat really was too weak,
   and was fixed as a SHAPE (rise 0.34 -> 0.55), not by moving the bar.

Every fix was to measure what the player sees or what the drawing code does. The
gate now carries three live controls that must FAIL their own rules -- the dead
V-NECK for shape, his approved DUST MASK for the face rule, a PLAIN COAT for the
hem rule -- because a check nothing can fail is not a check. Gate: 65, 0 failed.
