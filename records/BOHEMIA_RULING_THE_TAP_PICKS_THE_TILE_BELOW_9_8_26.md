# THE TAP PICKS THE TILE BELOW (Paolo 9/8/26, from his frame)
# "When I click a tile in city builder mode, it's not the tile that it's sitting on. It's
# like below. It's very awkward. Can you fix that?"
# The frame: records/target/PAOLO_THE_TAP_PICKS_THE_WRONG_TILE_9_8_26.png (his red circle:
# the highlighted plot is one row below the roof he tapped)

## WHAT THE CODE DOES (read, not guessed)
The city's tap-to-plot goes through CBcellAt(sx,sy), which inverts the ground-plane
isometric projection with one fixed vertical offset (half a tile height) and rounds.
Two things it does not know about:
1. **The tiles are drawn LIFTED.** A LIFT constant of 1.6 exists in the aerial draw:
   a roof is painted above its own footprint. The picker asks "which ground diamond is
   under the finger", the eye asks "which roof is under the finger", and the roof
   belongs to the diamond BEHIND it. So the pick lands one row below where he looked.
   The classic isometric picking bug, and it gets worse the taller the tile.
2. **Phone pixels versus canvas pixels.** The finger's coordinates are page pixels;
   the math uses the canvas's own width. On a phone those differ by the device pixel
   ratio, which is another fraction of a row of drift in the same direction.

## THE FIX SHAPE
- Pick against the DRAWN tile, not the ground plane: either walk the rows from the
  front of the screen and take the top-most drawn roof that contains the point, or
  subtract the drawn lift before inverting. Either way, what the eye is on is what
  the tap selects.
- Scale the tap by canvas width over element width before any math.
- THE GATE, learned from the pad this week: a REAL driven tap on a phone viewport at
  the drawn centre of a sample of tiles, asserting the selected plot equals that tile,
  every zoom level. An in-page hit test said 12 of 12 for the pad while real taps
  landed 2 of 11; only a driven tap counts.

## A NOTE ON THE OTHER FRAME
This frame shows tiles; the frame two minutes earlier showed slabs. So the aerial has
levels: near enough and the tiles draw, farther out and it collapses to the diagram.
COOK [city from above] and LIFE+CITY [tiles not slabs] stand for the far level; this
picking bug is at the near one.

## ROUTED
- LIFE+CITY [tap picks]: top of LIFE+CITY.
- PLUMBER [tap gate]: the driven-tap gate, shared with the pad's.
