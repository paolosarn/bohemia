# HE PICKED 1, SO THE PAD IS ONE RING NOW (9/7/26, UI lane 11, row [pad broken])

PAOLO 9/7, one word: **"I want 1."** That is option 1, THE DIAL, off
`slices/BOHEMIA_THE_PAD_IS_ONE_RING_9_7_26.html`, which he was asked about for four
rounds. His original words, from the round before:

> "I want the action button to be only surrounded by one other circle, and that circle
> is cut into how many parts of the directions that we need. I don't want them to be
> independent circles. Like a circle outside of a circle, maybe kind of looking like a
> key lock or something."

## WHAT WAS THERE, AND WHY HIS PHOTOGRAPH LOOKED BROKEN
Eight separate 42 px circles, each placed by an inline `left`/`top` written for a 180 px
box, plus a face pinned at `left:50px; top:50px`. Dead centre is only dead centre while
the box is 180 wide. `[half size]` made the box 90, and:

- the face went to the **bottom-right corner**, because 50px of a 90px box is the corner;
- the eight keys had to be halved by a second, separate piece of code, and drifted;
- three more numbers (two CSS border-triangles, a key size) had to be halved as well.

Eleven numbers that all had to agree, in three places. His frame is what disagreement
looks like: arrows scattered out of any ring, the face shoved into a corner in its own
box.

## WHAT IT IS NOW
**One SVG annulus, cut into eight even segments with 3.5 degree gaps, drawn in a 180
viewBox, with the action button as its centre.**

    centre 90,90    ring r50 to r86    8 segments    3.5 degree cuts    arrows at r68
    the face: 44.4% of the box, centred with a percentage, never a pixel offset

A viewBox scales from ONE number, so half size is a scale and not a scatter. The face is
sized and centred in percentages of the same box, so it cannot come apart from the ring
it sits in. The eleven numbers are gone; there is nothing left to keep in step.

**A segment is a BIGGER target than the circle it replaces:** about 1770 square px
against 1385.

## EIGHT AND NOT FOUR, AND WHY THAT IS NOT A DRIFT
The `[pad broken]` row (written by the coordinator from his photograph) asked for four
arrows. The ring sheet put four (option 3) beside eight (option 1) with the trade
written on the page in his words -- bigger targets, but you lose the diagonals -- and he
picked eight. It is his own pick and it is the newer one. NEWEST DATE WINS.

## THE GATE, BECAUSE THE ROW DEMANDED ONE
`gates/pad_ring_gate.js`, **19 ok, 0 failed**, run at FULL and HALF size on a 390x844
phone against the shipped page. It asks the four things his photograph showed broken:

1. every direction is a segment of ONE svg, not its own loose circle;
2. the face sits within 2 px of the ring's centre -- **at both sizes**;
3. no two directions lie on top of each other;
4. **all eight segments deliver their own direction to the game** -- eight presses, and
   during each one the game is asked what direction it is holding.

Measured: ring 180 to 90, face 80 to 40, both exactly 0.500x, face 0.0,0.0 px off centre
at both sizes, 8 of 8 presses reach the game at both sizes.

**MUTATION-PROVED.** Push the face to `left:62%` and the gate goes red at 21.6 px (full)
and 10.8 px (half) -- the exact failure in his frame.

## THREE INSTRUMENTS CAUGHT LYING, ALL BEFORE THEY WERE TRUSTED
**The overlap check caught itself first.** Its first cut compared the eight bounding
rectangles and reported eight overlaps on a ring whose wedges do not touch -- because the
box around a pie slice contains most of its neighbours. It asks the shapes now
(`isPointInFill` over a grid of 8281 points; 3528 land on the ring, none on two segments
at once). Same class of lie as the three harnesses in `[half size]`: a measurement
disagreeing with the thing itself.

**"Did he move" is the wrong question to ask of a button.** The gate's first version
demanded that all eight presses move the player, and on a re-run it called the down-right
segment dead while every other run had eight of eight. Nothing about the pad had changed:
by the eighth press he had walked into something solid, and a man pushed against a wall
does not move however honest the button is. The gate asks two questions now, because
they are two questions. **Did the game receive the press** -- read `held`, the direction
index `startHold` sets, while the finger is down; that is the button, and all eight must
pass it. **Did he move** -- reported, with a floor rather than a demand, because the map
is allowed to have walls in it. Measured: 8 of 8 heard at both sizes, 7 of 8 moved at
full size and 8 of 8 at half.

**And `thumb_gate` has been mis-naming every SVG control it ever saw.** An SVG element's
`className` is not a string, so `String(n.className)` is `"[object SVGAnimatedString]"`.
It never showed because nothing measured on this surface was SVG until now; the moment
the pad became one, twelve controls reported under a name no exemption could match. Fixed
to read the attribute. Proved it was mine and not pre-existing by running `thumb_gate` in
a clean `origin/main` worktree first: 15/0 there, 14/1 in my tree.

## WHAT THE PICTURE SHOWED THAT NO GATE ASKED
The face went a rounded SQUARE at half size: `.uihalf` sets a 3 px radius and
`height:auto`, right for a text chip, wrong for a portrait -- it came back 40 wide and
SIX tall. Both fixed by naming the face's own size and radius in the half rules. **Found
by looking at it, not by a gate**, which is the whole argument for a picture every round.

## STILL TRUE AND NOT FIXED
The bottom of the ring sits over the frame's dark band at the foot of the screen. All
eight segments still walk him there (measured, not assumed), so it is a look problem and
not a dead zone. Noted, not hidden.
