# "ID DINT SEE THE SIDE DOOR" — the two geometry bugs, and the gate that could not catch them (8/3/26, RUN lane)

Paolo 8/2: *"if there is a door i need you to have it stick out slightly on the next tile
that its supposed to be on... lets say its assigned to tile 0 it will have a slight
appearance in tile -1 or 1."*

Paolo 8/3, after v1 shipped green: **"id dint see the side door."**

He was right. v1 drew 4 jamb blits per door, the gate counted them, the gate went green,
and nothing he could see changed.

## THE ART, MEASURED

`banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt` — 184 doorways x {W,E} = 368 tiles, 44x44 RGBA.
Measured on all 184, zero variation:

```
side W   44x44   opaque columns  0..6    7px on the LEFT edge of the tile
side E   44x44   opaque columns 37..43   7px on the RIGHT edge of the tile
```

The paint sits at the EDGE of its own tile. That single fact is what both bugs missed.

## BUG 1 — WRONG PLACE

v1 blitted the W tile at `dx-C` and the E tile at `dx+C`: a whole cell over. Shift a
tile whose paint is on its edge by a whole cell and the paint lands on the FAR edge of
the neighbour — **37px of blank wall between the door and its own frame.** That is not a
jamb, that is a stripe.

A strip painted at the tile edge only crosses the boundary if you shift the tile by the
STRIP's width, not the CELL's. W goes to `dx-7`, E to `dx+7` (scaled `C/44`), which puts
the paint flush against the opening on both sides.

## BUG 2 — THE EAST ONE WAS BURIED

`facadePass` walks `gx` ascending, so the cell to the door's RIGHT is drawn AFTER the
door. Its wall covered the east jamb every single time, on every door in the world.

Jambs now queue and flush at the END of each row, after every wall in that row is down.
Per ROW, not per pass, so a facade one row south still occludes it correctly.

## WHY THE GATE WENT GREEN ANYWAY

The old gate counted `drawImage` calls. **A counted draw is not a visible door.** It was
the same class of mistake as the render-time kerb trick and the cached stretch: proof
that a thing ran, mistaken for proof that a thing is on screen.

`gates/doorjamb_gate.js` no longer counts calls. It renders the door WITH the jambs and
WITHOUT them and diffs the 7px band on either side of the door cell:

```
THE FRAME IS ON SCREEN, WEST of the door tile (>25% of a 7px x 88px band changes)
THE FRAME IS ON SCREEN, EAST of the door tile — v1 shipped this buried under the next wall
and it does NOT bleed two cells out (control band ~0%)
```

The CONTROL band two cells out must NOT change, so a future "fix" that passes because the
whole frame moved is caught too. It also machine-locks both bugs by name: the offset must
be `JAMB_PX*C/44` and never `dx-C`, and `jambFlush()` must sit between the gx loop's
closing brace and the gy loop's.

## A THIRD BUG, IN MY OWN PROBE

The first probe invented its own camera (`cv.width/2 - hx*C - C/2`). `renderHuman` uses
`Math.round(cv.width/2 - hx*C)`. Half a tile out, so the probe read the wrong pixels and
called a working door dead. The gate now copies the camera from `renderHuman` verbatim,
with a comment saying why. **A probe that invents its own geometry is a side-door probe,
and a side-door probe is a lie** (7/18 law, and it caught me on the door about the door).

## PROOF

```
node gates/doorjamb_gate.js
DOOR JAMB GATE: 15 passed, 0 failed
```
Verified by eye on the real preview canvas at HC=44, jambs on vs off, 6x nearest-neighbour
crop: OFF = the door boxed inside its own tile. ON = stone jambs standing proud on both
sides, crossing into the next tiles.

## STILL HIS TO JUDGE

The bank marks itself UNJUDGED: *"7px was approved for the demo doors ONLY — these are
CANDIDATES; widths adjustable per doorway when judged."* He has now asked for the
BEHAVIOUR twice, which is the ruling on the behaviour. The WIDTH is one number
(`JAMB_PX`) and it is still his.
