# EAST/WEST DOORS: THE ART IS READY, THE FACADE GEOMETRY IS NOT (8/2/26)

> "WE MADE A COUPLE VERSIONS OF DOORS WHEN THEY ARE FACING EAST AND WEST WHY ARE
> WE NOT DOING THAT."

## THE ART EXISTS AND IS READY TO DRAW

`banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt`, 0.5 MB:

| | |
|---|---|
| doors | 184 |
| variants each | `{side:'W'}` and `{side:'E'}` |
| total tiles | **368** |
| size | **44x44** -- already the corpus cell, blits 1:1 at the current bake |
| his locked rule, from the bank's own note | "each door's OWN painted frame-edge strip, cropped (never squished/mirrored), positioned west/east in cell. 7px width" |

Measured in the shipped renderer: **0 of 368 present.** Not one byte.

## WHY IT IS NOT A WIRING JOB (this is the part that matters)

I assumed this was another approved-but-unused wiring fix like the traffic signals.
It is not, and the difference is the whole task.

The facade pass draws a cell only when `c.face` is true, and `c.face` is set in
exactly one situation: **the cell BELOW this one is not solid.** That is a
SOUTH-facing wall -- the face you see when a building is north of you. A wall whose
open side is EAST or WEST is never marked `face`, never enters `facadePass`, and
therefore has no surface to put a door on.

So east/west doors are blocked on facade GEOMETRY, not on art selection:

1. Mark east/west faces. A solid cell whose EAST neighbour is open is an east
   face; same for west. This is new cell state (`c.faceE` / `c.faceW`), computed
   in the same realize pass that already computes `c.face`.
2. Draw them. An E/W face is a vertical strip at the cell's east or west edge --
   the bank's own note pins it: the door's own painted frame-edge strip, cropped,
   never squished or mirrored, 7px wide against a 44px cell.
3. Only then select the variant by side, which is the trivial part.

## WHY IT WAS NOT DONE IN THIS TURN

I had room to start step 1 and not finish steps 2-3. A half-landed facade change
is the exact class of thing that cost three turns on the pixel complaint. The art
is verified ready, the blocker is named, and the three steps are in order.

## WHAT DOES NOT NEED HIM

Nothing here is a judgment call. The 368 tiles are already approved, the placement
rule is written inside the bank in his own words, and the sizes already match the
bake. This is buildable start to finish without a single new ruling.
