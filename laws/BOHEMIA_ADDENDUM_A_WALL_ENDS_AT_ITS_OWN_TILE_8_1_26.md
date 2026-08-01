# BOHEMIA ADDENDUM — A WALL ENDS AT ITS OWN TILE
## Paolo, 8/1/26, LOCKED. He described the geometry, not the symptom.

> "if I am a tile south of a wall and the wall is north of me, the game is doing
>  fine. But if I am one tile north, behind a wall, because of the view of our
>  game, the wall border should end at that first tile, base of the wall. Does
>  that make sense? And that's for all walls. I don't know if there are any. It
>  has to be a building if walls are two tiles thick."

---

## THE LAW

**1. A WALL OCCUPIES ITS OWN TILE AND NOTHING ELSE.**
Its painted face may not extend over the tile behind it. The walkable border
ends at the base of the wall. Standing IN FRONT of a wall — south of it, looking
at its face — was always correct and is untouched.

**2. NOTHING TWO TILES IS A WALL. IF IT IS TWO TILES IT IS A BUILDING.**
House facades keep their three tiles, because a house is a building. A wall is a
wall, and it is one tile.

This is stated in the projection, which is why he explained it in terms of north
and south: our view looks from the south, so a face painted "upward" lands on
the tile to the NORTH. That is the only tile at risk, and it is the tile the law
protects.

---

## WHAT WAS WRONG, measured before anything was touched

One line in the CITY tab:

    c.face=true; c.artPool_face='perimeter'; c.wallH=2;

and the draw that reads it:

    const wh  = c.wallH || WALL_H;
    const top = dy - (wh - 1) * C;      // wh=2 -> the face starts ONE TILE UP

So a wall at (x,y) painted over its own cell **and the cell to its north** — and
that cell is walkable. Swept on the real CITY frame: **22,345 perimeter wall
cells, 7,417 of them with a walkable cell underneath the face.** You could stand
inside a wall in seven thousand four hundred and seventeen places.

## AND IT WAS ALSO THE "TWO LAYERS OF WALLS"

Filed a turn earlier as an art question, wrongly. He corrected it — *"Where you
can walk"* — and the correction is what produced the measurement that found the
cause.

His thirteen approved perimeter tiles are **complete walls at 44x44**: cap,
courses, base, all of it, in one tile. Paint a self-contained wall over a
two-tile rect and it repeats — cap, courses, cap, courses. That is exactly *"a
separate tile that's a different wall in the wall"*.

**One cause, both complaints.** They were never two bugs.

## THE RUN WAS ALREADY RIGHT

`drawPerim(X,Y,S)` with `S` = one CELL, over one solid cell. The RUN has been
drawing this correctly the whole time and the CITY tab was the odd surface out.
So this fix **deletes a disagreement between the two surfaces** rather than
adding a rule to it — which is the opposite of how this lane usually goes wrong.

## WHAT DID NOT CHANGE, and why it matters

**No walkable geometry moved. Not one cell became solid.** The wall simply
stopped being painted over ground it does not own. That is deliberate: sealing
cells is how you re-create the prison the NO DISTRICT IS A PRISON ruling
(Paolo, 8/1, hours earlier) had just removed. NO PRISON re-ran green at 15/15
after this landed.

## THE BANK IS NOT CONTRADICTED

`banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt` states **WALL HEIGHT MIN 2
TILES**, and that text is intact and still asserted. It is not in conflict:

  - the BANK is stating how tall the wall **IS IN THE WORLD** — two tiles of the
    0.75m grid is ~1.5m, which is a real Vegas block wall;
  - `wallH` is how many **GROUND CELLS its face is painted across**.

Different quantities. His 44x44 tile already contains the whole height; it just
belongs on one cell. **Reading one as the other is what set `wallH=2` on 7/27**,
and that sentence exists so nobody sets it back.

## A GATE MUST NEVER OUTRANK A RULING
`gates/wallclass_gate.js` asserted `h >= 2`. It now asserts `h === 1`, plus "only
a BUILDING may be taller" — his second sentence, machine-held. Rewritten in the
same commit as the fix, not worked around.

## THE LIFE LESSON UNDERNEATH (never preached in game)
A boundary that claims ground it does not own stops being a boundary and starts
being a lie about where you are.
