# THE STREETS ARE JOINED, THE PICTURE IS NOT (WORLD, 10/18/26)

Row: WORLD [the map's roads as one kit] (Paolo 10/10: 'BRO ON THE MAP NOT ON THE COMBAT').
The help RUN's [the districts connect on the map] asked for (Paolo 10/18: 'the districts
look like shit, the streets look like shit, doesn't look like shit's connected that smart
like it should'). Coordinator's brief: "help it if your data is the cause".

## The answer to the coordinator's question: is WORLD's data the cause?

Mostly no. Measured on the game's own seed ('bohemia' -> 2691674296, read out of the CITY
frame RUN ships, whose generator is engine/bohemia_overmap.js inlined byte for byte):

- 2,515 street cells. The street grid underneath is joined: every street is in one network
  (the generator's island prune), and only **1** street end in the whole valley stops at
  plain ground for no reason (75,7: a three-cell stub hugging the I-15; the generator's
  dead-end prune counts the freeway beside it as a road, so it survives).
- **The picture is the cause.** The map draws every street cell with one straight picture,
  mirrored for its axis (renderCity -> drawHero(d,p,heroFlip(d,x,y)), CITY frame ~45917).
  **556 of the 2,515 (22 percent) are junctions**: 269 crossings, 215 tees, 72 corners.
  Every one of them shows a straight road where two roads meet, so the grid reads as
  stripes laid side by side, not a city. The kit already holds a crossing picture
  (arterial_x, strip_x, loaded at ~44109) that the map never asks for; only the walked
  street view calls kitRoadType.
- 43 street ends stopped at the railway (33) or a wash (10) with the same street picking up
  on the far side. Real Las Vegas crosses the Union Pacific line and bridges its washes.
  They are now named as crossings: **17 level crossings, 7 bridges** (one crossing serves
  the ends on both sides). 162 freeway cells carry a street deck (agrees with the frame's
  own overpassAt).

## What shipped

- `engine/bohemia_map_joins.js` (pure, no DOM, same answer every run). `joinsFor(om)`
  gives every road cell its kind (street, boulevard, freeway, interchange, rail), its
  joined sides as a mask (N1 E2 S4 W8), its piece (straight, corner, tee, cross, end) and
  its quarter turns; the crossings (level over rail, bridge over a wash, over across the
  freeway band); the stops (an end at a landmark, the rim, water, the map edge) and the
  breaks. `pieceAt(J,x,y)` is the one call a renderer needs.
- THE RULE, one table (JOIN): street, boulevard and interchange join each other; freeway
  joins freeway and interchange; rail joins rail. **A street never joins a freeway's side**:
  it goes over or under it, or meets it at an interchange (30 street cells touch a freeway
  side on the game's seed and are kept apart). The stop rule is the generator's own
  NO-STREET-BREAK LAW (Paolo 7/18): a stub with a landmark at its side is that landmark's
  drive.
- Gate MAP JOINS, `gates/map_joins_gate.js`, 23/0, registered. A: byte-equal twice. B: every
  join two-sided (3,573 road cells agree). C: every join in the table, no street on a
  freeway side. D: every crossing sits on what it says and the street carries on both
  sides. E: breaks ratchet, 1 on the game's seed, 7 worst of twenty valleys (mean 3.3).
  F: the seed and the generator read out of the CITY frame. G: seven hand-made valleys.
  Mutation-proved three ways (a street|freeway join in the table, crossings switched off,
  a one-sided join): each goes red.

## For RUN (the drawing is RUN's, rule 77b)

Inline engine/bohemia_map_joins.js into the CITY frame and, in renderCity, ask
`pieceAt(J,x,y)` for each street cell: cross -> arterial_x / strip_x today (269 cells fixed
with art that is already loaded); corner, tee and end need pictures. The gate prints
"the CITY frame reads this data: NO" until it does; it never reds RUN's file.

## For COOK TWO ([the street joins for the map])

The valley's piece bill on the game's seed: corner x72, tee x215, end x125, level crossing
x17, bridge x7, all at the base pose plus quarter turns (the module's ROT). The kit has
straight and cross only. That is the exact list of joins to cut from the approved tiles.

## Not done

Nothing drawn and no VOTE sheet (rule 88's hold names WORLD; the drawing is RUN's). The row
stays CLAIMED: its ship test is the map drawing from this data and the before/after in VOTE.
The one real data break (75,7) is the generator's prune counting a freeway side as a join;
fixing it re-cuts the valley under twenty other gates, so it is a finding, not a change.
