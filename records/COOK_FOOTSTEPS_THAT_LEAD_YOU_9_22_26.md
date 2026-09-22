# COOK — FOOTSTEPS THAT LEAD YOU SOMEWHERE
## Round VII, 9/22/26. [footprints], claimed this round.
## COOKED AND REGISTERED IN VOTE: `cook-footsteps-that-lead-you-9-22`. Nothing went to the alpha or the demo.

---

## FIRST: HE VOTED, AND ONE OF MINE CAME BACK DOWN

Four of this lane's candidates were judged in the first votes:

    THE EDGE THAT DRUMS          UP
    THE LANE LINE DRUMS TOO      UP
    THE TOWER THAT IS STILL STANDING   UP
    THE GROUND YOU FIGHT ON      DOWN -- "No difference"

**He was right about what he was shown, and the card was the failure, not the art.** That
card put two fields of dark asphalt side by side and asked him to find a change that was
real in the numbers (9,635 colours down to 57, cold grey to warm) and nearly invisible at
the size I drew it. DIRECTION passed the same tiles on the glass a round later and wrote
that the cold blue was gone, so the work landed. The picture I made of it did not.

**The item is consumed and is NOT resubmitted.** A vote kills the item; a redo would be a new
item that names the old one, and there is nothing to redo because the tiles are already
approved on the glass. What carries forward is the rule:

> **A CARD MUST SHOW THE THING DOING ITS JOB AT THE SIZE HE SEES IT.** Not a swatch, not a
> before-and-after of something subtle. If the only way to see the change is to be told the
> numbers, the card has already failed.

This round's card is built to that rule: one boot at eight times so the drawing can be
judged, then the same boot walking across four real grounds at the size he actually sees.

---

## THE ONE THING MADE

**A boot print, and a trail of them that leads somewhere.** His words, from the first votes:
*"make pixel art of footsteps that lead you to the conclusion."*

    bank:     banks/BOHEMIA_THE_FOOTSTEPS_9_22_26.txt
    picture:  slices/vote/COOK_FOOTSTEPS_THAT_LEAD_YOU.png
    tool:     tools/bohemia_footsteps_that_lead_you_cook_9_22_26.py

    a boot is 9 x 20 px, about a fifth of the 100 px body rule 21 fixes
    ten prints per trail, on four families: asphalt, concrete, ground, deck
    1,060 pixels pressed per patch, and NOT ONE NEW COLOUR on any surface

## RULE 12: THE TRACKS THAT EXIST ARE NOT THIS

`__WHOSE_FOOTPRINTS_ARE_THESE__` (9/12) is a **map-scale faction trail**: a coloured thread
in the holder's own ink, fading along its length, drawn at whole-valley zoom so you can see
which way a party went. DIRECTION passed it on 9/13. **It is a line, not a foot**, and it
stays exactly as it is.

Nothing anywhere in this game draws a foot shape. Swept for it before drawing: the 232 hits
on "footprint" in the city are **building** footprints from the district kit, which is the
wrong-oracle trap this lane has now been caught by eleven times, so it was opened and read
rather than counted.

---

## WHAT A PRINT IS, AND WHY IT COSTS NO NEW COLOUR

A print in dust is a shallow **depression**, not a stain. So it is lit the way every other
solid in this game is lit: the sun is north-west (the approved roof set names `roof_hipTL`
the lit corner and `roof_hipTR` the shaded one, and the sign cook's shadow goes east), so
the far lip of the hollow catches light and the near wall falls into shade.

In pixels: **the sole is the family's own dark end, and any sole pixel with open ground to
its north or west is the lip, which takes the family's light end.** The rim is *derived*
from the shape rather than drawn into the mask, so it can never get out of step with the
light. Every tone is a step of the ramp the ground already uses, so ONE PALETTE PER FAMILY
cannot break — and the tool asserts it:

> NO PRINT INVENTED A COLOUR: every pixel of every print is already in the ground it is
> pressed into, or on that family's own ramp.

**It fades the way the trail DIRECTION already passed fades.** From the 9/13 verdict: *"every
trail fades along its length with the brightest end as the head... a trail is the only mark
with a luminance gradient along a path."* Same rule, one scale down: the newest print is the
deepest, and the fade has a floor of 0.62 so the whole run stays followable.

---

## I HIT THE STOP PRODUCING TELL AT THE FOURTH VERSION, AND HERE IS WHAT IT WAS

    v1  every covered pixel nudged ONE step from its own value.
        779 pixels pressed per patch, every guard green, and NOTHING VISIBLE on any of the
        four surfaces. On a cracked seven-value ground a one-step nudge is smaller than the
        noise already there, and a print laid across a crack came out half light and half
        dark, which is not a boot, it is more noise.
    v2  a solid shape, two steps off the local median. Faint ovals.
    v3  full depth off the family's own ends. Visible, and reading as a pale ghost.
    v4  THE MASK ITSELF.

**Three times I treated "it does not read" as a numbers problem — nudge harder, go darker,
push the ramp ends — when it was a drawing problem.** The old mask was 7 px wide with a
one-pixel rim on *both* sides, so five of every seven pixels were edge and the sole it was
supposed to have was three pixels of core. It was mostly outline, which is exactly how it
rendered. The fix was not another value; it was a sole that is actually a sole: solid at
9 x 20, with the rim derived from the shape.

STOP PRODUCING says a fourth version means you already failed. It is named here rather than
quietly fixed, and the number that lied is named too: **1,060 pixels pressed** is the same
kind of green as "9,635 colours down to 57" — true, and no evidence at all that anything
reads. **The number lied and the picture told the truth**, for the twelfth time in this lane.

(A fifth pass changed the patch size and the stride, not the art: a boot is 20 px and a human
stride is about two and a half boots, so consecutive prints need ~52 px between them or they
smear into each other, and the patch has to be wide enough to hold a real walk. That is
layout, and the tool now refuses if a trail lays fewer than sixty pixels per print.)

---

## THE ANALOG HORROR BIBLE (rule 20, reference AH-01)

- **R1 THE ORDINARY FRAME, ONE WRONG THING.** An empty street, and one set of prints crossing
  it that nobody is at the end of.
- **R4 THE LIGHT WAS IN THE ROOM.** A depression is lit by the same sun as everything else,
  and that is the entire drawing rule here. No mark glows and nothing is tinted.
- **R3 THE LONG HOLD.** Prints do not animate. They are a still fact left behind, which is the
  cheapest dread this game owns.

## THE REFERENCE CHECK (standing duty, 9/4 law)

- **AH-01** as above.
- **TG-03 THE YARD TILE / TG-04 THE STREET TILE** — the families and their ramps, taken
  unchanged. A print borrows the ground's own colours and adds none.
- **CGRD-03 A VEGAS BLOCK FROM THE AIR** — in real dust a walked line stays visible long after
  individual prints have blurred, and individual prints survive only in soft ground. That is
  the structural rule behind the four surfaces: deep and crisp in the dust yard, shallow and
  short-lived on asphalt, which is exactly how they render.
- **REUSE CHECK** — the ground under every trail is the city's own shipped street and side and
  the bank's yard, dirt and roof deck. No ground pixel is authored here.

## WHAT THIS DOES NOT DO

- It does not place the trails in the world. Where a trail starts and what it arrives at is
  content and it is the world's, not a tile bank's.
- It does not touch the map trail, which stays as DIRECTION passed it.
- **Nothing was written to the alpha or the demo** (rule 18). It goes on the ground the round
  the hold allows, along with the lane line, the edge and the tower, which he voted UP.

## HOW TO RE-RUN IT

    python3 tools/bohemia_footsteps_that_lead_you_cook_9_22_26.py
