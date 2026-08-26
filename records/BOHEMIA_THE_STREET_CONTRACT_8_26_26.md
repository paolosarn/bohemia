# THE STREET CONTRACT — why none of the streets connected, and what connects them now
# 8/26/26, WORLD lane. Executing PLAYTEST DISPATCH item 4 (Paolo 8/25, LOCKED).

> "IM SICK OF PLAYING THIS RUN AND NONE OF THE STREETS CONNECT EVER! YOU NEED A
>  FUCKING STANDARD AWESOME WAY TO MAKE SURE IF ITS A STREET. IT WILL CONNECT ART
>  WISE AND PATHWISE TO OTHER STREETS WE NEED A STANDARDIZED WAY YOU PLACE STREETS
>  IN PERFECT MATCHING COORDINATE LIKE CONSISTENT PUZZLE PIECES AND LEGO BLOCKS SO
>  FUCKING BE IT BUT THAT NEEDS TO HAPPPEN"

## THE NUMBER

Every place two road cells touch is a SEAM. There are 4,497 of them in the valley.

| | before | after |
|---|---|---|
| seams broken, all classes | 1,405 (31.2%) | 270 (6.0%) |
| arterial to arterial | 1,702 of 2,594 | **0 of 2,594** |
| freeway to freeway | 0 of 1,415 | 0 of 1,415 |
| rail to rail | 0 of 86 | 0 of 86 |
| interchange to interchange | 3 of 24 | 3 of 24 |
| strip to strip | 4 of 115 | 4 of 115 |
| two DIFFERENT road classes meet | 263 | 263 |

Arterials are the mile grid: the streets he actually walks down. Every single one
of their 2,594 joins now agrees tile for tile.

## WHAT A CONNECTOR IS, AND THE ONE DESIGN DECISION IN THE WHOLE THING

A connector is what one edge of one street piece offers to whatever sits beside it:
the CORRIDOR, meaning the first and last drivable tile along that edge, plus whether
a body can leave on foot. Two edges AGREE when their corridors are the same tiles.
Off by one is a break.

**IT IS MEASURED OFF THE BUILT TILES, NEVER DECLARED.** The obvious way to build
this is a table — arterial: 6 lanes, centre 0, walk 6. That table would have been
GREEN all day on 8/25 while the valley was in the state Paolo played, because a
table describes what the street is supposed to be and the bug was always in what it
actually was. So the gate reads the real row of tiles along the real edge of the
real generated cell and works out where the road is from the tiles themselves. Art
and path cannot drift from the contract, because the art IS the contract. That is
also why the mutation test moves PIXELS and not a number.

## THE THREE CAUSES

**1. EVERY ARTERIAL IN THE VALLEY WAS BUILT NORTH-SOUTH.** The registration read
`o.links = ['N','S']`. The comment above it is about forcing BOTH LEGS, which is
right — a street that stops half way through a cell is not a street. But the line
forced the AXIS too. 921 road cells (26.1% of every road cell in the game, 907 of
them arterials) ran across the way the world connects them. The worst seam was 93
rows of 128: an arterial's SIDEWALK MARGIN butted against the next arterial's
CARRIAGEWAY. The world was right the whole time — `roadAxis()` measures the run and
`kitRoadLegs()` hands over `links:['E','W']` for an east-west street. This one line
threw it away. FIXED: the axis comes from the caller, only the both-legs rule is
forced. Wrong-axis cells 921 -> 14, and the 14 are all freeway.

**2. AN ARTERIAL CROSSING AN ARTERIAL WAS NOT A CROSSING.** `kitRoadLegs` decided
what counts as a cross street with `if (t.district === d) continue`, commented "my
own other half is not a cross street". That is true of a road running the SAME WAY I
do and false of one running ACROSS me, and both are called `arterial`. So every
arterial-on-arterial junction in the mile grid was thrown away, the cell stayed the
plain RUN type instead of the CROSSING type, and the crossing arms were never built:
the north-south street ran down to the edge of the east-west street's cell and
stopped in bare dirt 20 tiles (15 metres) short of the roadway. 564 seams.
FIXED: a neighbour is a cross street when its roadway REACHES the edge we share (its
own axis points at me) and it runs across me. Name has nothing to do with it.
The mile grid now resolves to 1,894 straight runs, 267 T-junctions and 271 four-ways.

**3. THE CURB RAMP ATE THE CROSSING STREET.** This was the biggest single class and
the last one standing. At a junction the curb ramp is drawn out from the corner
across the full parkway and walk — twenty tiles — and it was allowed to overwrite
asphalt. At the far end of that run it landed on the PERPENDICULAR street's
carriageway, right at the cell boundary, and took two tiles off each side of it. So
the crossing read 22..106 and the straight run beside it read 20..108. **1,138 seams
— one in four of every road join in the game — from four tiles at a corner.**
FIXED, two ways: a curb ramp never paints over a travel lane (the ladder crosswalk
already carries the crossing over the roadway, so nothing is lost), and it has its
own legend entry now.

## AND THE RAMP WAS A LIE ABOUT WHAT IT IS

It was drawn with code 3, the ladder crosswalk, which is kind `marking` — and a
marking is DRIVABLE everywhere in this codebase. The ramp runs from the curb line
out to the cell boundary across the whole parkway, so **every corner of every
arterial crossing was declaring fifteen metres of planted parkway to be roadway.**
It is a ramp. You walk up it. `arterial:18 curb ramp`, kind `walk`, in the sidewalk's
own concrete — no new colour cooked for it (REUSE-FIRST).

## THE GATE

`gates/street_contract_gate.js`, on the real page, 14 checks:

- every seam between two pieces of the SAME class agrees tile for tile, **per family,
  with no allowance for arterial, freeway or rail** — a single mismatched edge fails
- the two families that still carry a break have that number WRITTEN DOWN, named, and
  ratcheting (interchange 3, strip 4 — see below)
- cross-class seams counted and ratcheting (263)
- a new road family cannot arrive with a silent allowance
- **HE CAN WALK A STRAIGHT LINE ACROSS THREE DISTRICTS**: 384 tiles (288 m) east down
  the traffic lane through two cell boundaries, every tile ground he can stand on —
  and the same walk down the SIDEWALK, because art and path are one contract
- **THE MUTATION TEST**: shift the arterial generator's whole output one tile
  sideways, throw both caches away, re-run the identical sweep. 0 broken becomes
  631 broken. Then the world is put back and proved unchanged.

## WHAT IS STILL BROKEN, NAMED

- **interchange, 3 seams.** A stack is a BLOB drawn in valley coordinates across a
  cluster of cells, and three of its internal seams land one tile out. An off-by-one
  in a blob's coordinate mapping, not in the street contract.
- **strip, 4 seams.** Las Vegas Boulevard runs TWO CELLS ABREAST, and a boulevard's
  junction box is wider than a cell, so at a crossing the box reaches the far edge of
  the cell and meets the sibling half's plain margin. The Strip needs a two-cell-wide
  crossing piece and does not have one.
- **263 cross-class seams**, mostly an arterial dying on a freeway flank (97) and
  level crossings with rail (43). A freeway is not an arterial and should not match
  one; what is missing is the PIECE that belongs where they meet — a frontage road, a
  proper level crossing. Counted so it can only go down.

## THE LESSON, WHICH IS THE SAME LESSON AGAIN

**THE INSTRUMENT WAS THE BROKEN PART, THREE TIMES IN A ROW.** The first metric
counted any change in solidity across a seam, which flags every legitimate wall. The
second demanded a road continue across its own FLANK, which is nonsense. The third
filtered on a "declared connector" flag that turned out to mean "a road neighbour
exists in that direction" and therefore filtered nothing — it returned exactly the
unfiltered count, 4485 of 4485, which is the signature of a filter that is not
filtering. A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN
THE INSTRUMENT COULD HAVE SEEN A POSITIVE ONE. That is why the gate ships with a
mutation test and not with a green number.

And a smaller one worth keeping: the fourth metric flagged 1,956 seams where a
raised median met a junction box, and where a burnt-out semi sat in a lane. Both are
correct world. **The question is where the ROAD is, not whether every tile is
clear** — an island in the middle of a street does not move the street, and neither
does a wreck.
