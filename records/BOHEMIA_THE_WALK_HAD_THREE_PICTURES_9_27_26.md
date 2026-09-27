# THE CUT TO ONE CELL SURVIVES, AND IT FOUND THE WALK HAD THREE PICTURES
ANIMATION lane, 9/27/26, row [small clips], the FIRST LINE under rule 34.

## HIS RULING
Rule 34, TWO SCALES ONE GAME (Paolo 9/27, LOCKED): the walked character is
**ONE CELL**, about 28 px on a 32 px cell, one cell per step. **THE STEP IS A
HOUSE is dead.** The 112 px art is the **SOURCE**, not the product.

## 1. THE QUESTION THAT HAD TO BE ANSWERED FIRST
Cut 112 down to 28 and **is there still an animation in there?** Measured at 112,
at 56 (what ships to the street today) and at 28, using the game's own
nearest-neighbour cut:

| | 112 | 56 | 28 |
|---|---|---|---|
| body rows, facing S | 98 | 49 | **24** |
| lit pixels | 2,732 | 680 | **168** |
| colours | 22 | 22 | **15** |
| identical facings, of 28 pairs | 0 | 0 | **0** |
| lonely pixels (lit, 0 or 1 lit neighbours) | | | **0** |

**THE CUT SURVIVES.** Eight facings stay eight different pictures. Nothing had to
be redrawn. The 112 art is the source exactly as he said.

## 2. AND IT FOUND A DEFECT THAT WAS THERE AT EVERY SIZE
The same sweep reported **6 identical pairs of 48** for the walk — at 112, at 56
AND at 28, the same six every time. **So it was never the cut.**

Named: `NE 0=0.5 | E 0=0.5 | SE 0=0.5 | SW 0=0.5 | W 0=0.5 | NW 0=0.5`.
All six side facings. Run had exactly the same six.

**THE CAUSE IS ONE LETTER.** The lateral walk is driven entirely by
`s = sin(ph*2*Math.PI)`, and **sin is zero at ph 0 AND at ph 0.5**, so both keys
resolve to the same "legs together" pose, byte for byte.

**THE SIDE WALK HAD THREE PICTURES, NOT FOUR.** At 112 you might not notice. At
one cell, 24 rows tall, it reads as a limp.

## 3. THE FIX IS ANATOMY, NOT A NUDGE
A real walk's two crossings are not the same: on one the left leg is passing
forward, on the other the right is. What tells them apart is the **direction of
travel** — `cos`, which is `+1` at ph 0 and `-1` at ph 0.5 — and **the passing
foot clears the ground.**

```js
const c = Math.cos(ph*2*Math.PI), pass = 0.55*F;
shinR: m*(F*Math.max(0,-s) + pass*Math.max(0,-c)),
shinL: m*(F*Math.max(0, s) + pass*Math.max(0, c)),
```

Duplicates: **6 of 48 → 0**, at 28 AND at 112. Run the same, with a bigger clear
(`0.7*F`) because a run's passing foot lifts further.

The fix is at the SOURCE size, not only at 28, because the defect was never the
cut and a fix that only held small would be a fix in the wrong place.

## 4. A HYPOTHESIS I MEASURED AND THREW AWAY
Looking at the 28 px sheet, the coat read **speckled** to me, so I wrote a second
cut: average the 4x4 block, snap to a colour the art already uses, and require
most of a block to be ink before the cell is ink.

**The ruler said ZERO lonely pixels in BOTH cuts.** There was no speckle: the
light marks are his hands and the coat's highlights, and they are connected to
their neighbours. The second cut moved 105 pixels, added a colour, and fixed
nothing measurable. **Deleted.**

**A HYPOTHESIS THAT MEASURES THE SAME IS NOT A FIX.**

## 5. WHAT THIS ROUND DID NOT DO, SAID PLAINLY
- **The grid is not rebuilt.** The law calls it a rebuild and it is the map's and
  the world's, not the animation's. The street still runs on the old grid.
- **The street's sprite size is not changed.** `CAST_PX` is the one constant and
  moving it is the rebuild's call, not a clip change.
- What this lane owns and did: **the clips are ready at the new size when it
  lands**, and they now have four pictures instead of three.

## GATE
`gates/the_walk_has_four_pictures_at_one_cell_gate.js` — 9 claims, 3 mutations
caught (the passing foot removed, the lift driven off `|cos|` so both crossings
lift the same, and an EMPTY cut), with a **control** that the cut draws a real
body and not an empty box, because a cut that drew nothing would score zero
duplicates and zero lonely pixels and pass everything by drawing nothing.

Regression, all green after the walk and run change: SLIDE AND TURN 17/0, NECK
HOLDS HEAD 8/0, HEAD SNAPS 13/0, ELBOW BENDS 10/0, READS FACING YOU 17/0,
ENVELOPE RAMP 10/0, ELDER STOOPS 9/0.

## IN VOTE
`animation-he-walks-at-one-cell-9-27`, and it PLAYS (rule 25): the walk at one
cell on three side facings, three pictures beside four, on the real clock, with
a panel at **actual size** so the page cannot flatter it.

## TAB
ANIMATION (the clips), and the VOTE tab in the alpha for the item.
