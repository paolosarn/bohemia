# COMBAT THREE: NOT THE SAME SUBURB TWICE (11/14/26) -- BUILD 11/14f - NOT THE SAME SUBURB TWICE

The coordinator's round under rule 447 ('run a full suite, turn up, 20% left'; one tight batch). Three jobs, in its order.

## 1. THE GROUND-SEAM CHECK (gate NO BOARD BREAKS ITS OWN PICTURE; rule 442(d); ask rows 547 and 577)
RED ON MAIN: the suburbs, 19.7% of cell borders 'a line you see', 14.0% 'a colour cut off dead' (floor 4%). The other 14 places passed.
MEASURED, the suburbs' board baked in the live fight, three seeds, every border between two open cells split by what meets there:
- a street against the ground beside it: 97 of 130 read as a line;
- ground against ground: 0 of 279;
- street against street: 1 of 89 (a house's roof standing over the street, not a break in it).
So the red was the new streets' own KERBS (the suburbs' houses went in tile for tile with a street in front of each, rule 442(d)'s 'every
building on the road'); every one of the suburbs' 142 street edges has its kerb or its sidewalk. A kerb is the honest grid, the way a wall
on its house tile is; the check counted it as a seam. THE CHECK NOW READS STREETS THE WAY 442(d) SAYS
(tools/bohemia_combat_maps_seams_read_11_3_26.py, gates/every_place_no_seams_gate.js):
- a street's edge against the ground is not a seam, BUT IT MUST BE A KERB: where that border is a line you see and the street's side of it
  is still its own asphalt (bare to the yard, no kerb, no sidewalk) it is counted, floor 4% of a place's street edges;
- street against street is still read as any border: a kerb drawn across a junction, a street that stops dead at its neighbour, is a line.
- PLANTED EVERY RUN, on the board with the most streets: every kerb painted over with its own asphalt reads bare (38 of 48); a kerb's
  colour drawn across every street-to-street border reads as lines (43 against 1); read the old way the honest board is the red it was
  (33 of 166).
RESULT: 15 of 15 places pass; street edges with no kerb 0 of 409 (golf 33, trailer 42, pass 108, suburb 142, strip 56, downtown 28).
NOT CHANGED: no picture, no board. Tried and dropped: starting every laid tile on a whole pixel (the hairline grid on every board is the
fight's own tile grid, baked on purpose; it is not what the check reads).
NOT DONE: a dead-end leg (a street that ends inside a board) was measured and left out: the golf course's drive ends at its clubhouse
and reads as one. The map's half of 442(d) is WORLD THIRTEEN's.

## 2. THE FIGHTS ON CELLS NO PLACE STANDS ON (rules 429(a)(c)(g), 447; ask rows 504 and 507)
WHAT WAS THERE: a place's cell deals the place's own board (WORLD THIRTEEN 11/11h, COMBAT THREE 11/11z). But every OTHER cell of a place's
districts was dealt the place's board too, a shuffle of its one or two blocks: 30 of 30 plain suburb cells the same yards (yards.1 once,
yards.2 eleven times); the same for the desert, the works, the Strip and the rest.
WHAT IT IS NOW (slices/BOHEMIA_FIGHT.html, __A_PLAIN_CELL_IS_NOT_THE_PLACE__, plainCell): A PLACE'S BOARD IS FOUGHT WHERE THE PLACE STANDS.
A cell the map hands over with no place under it (the map there stands places; no opts.template) deals from that cell's own ground and
zone: the district's block kinds in WORLD's list (the one table, BohemiaFightKinds.families), led by the zone's own, the cell's own dice.
Art that is already live (the kinds with no place have always dealt this way). opts.place false asks for it anywhere; true never.
MEASURED AND NOT SHIPPED, said plainly: the truest answer to 429(a) is the map's own block cut tile for tile (opts.street 'map', built
11/6, switched off by his 11/7 'I prefer the previous layouts'). I switched it on for plain cells and looked on the demo: the industrial
park is a dark bare tarmac field with pale pads in a checkerboard, the look he refused. It stays behind its ask until its ground is
finished art (a COOK job: one continuous ground per zone, not pads). This build is the step that is safe today.
THE GATE: A PLAIN CELL IS NOT THE PLACE (gates/a_plain_cell_is_not_the_place_gate.js, registered) 7/0: P1 420 of 420 plain cells (35
districts of the 15 places) dealt no place's own board; P2 every block of a kind WORLD's table names for its district; P3 30 plain suburb
cells are 30 different boards (they were 1), no district one board only; P4 15 of 15 places still dealt on their own cell; P5 a fight
plays on a plain cell of every place's district (5.3 rounds); P6 the same cell deals the same board twice; planted (the old deal) 420 of 420.
ON THE PAGE (rule 441; cells the map's own vbTemplateAt says no place stands on; AUTO to the end):
- the demo upright: 6 suburb cells: 'suburb + lots', 'suburb + culdesac + lots', 'culdesac + lots + suburb' ...: 6 different block sets;
- the demo on its side: 3 desert cells: 'pass + scrub', 'wash + scrub', 'scrub + scrubroad';
- the alpha upright: 2 park cells ('golf + wash', 'wash + golf'), 1 downtown ('ruin + main + strip');
- the alpha on its side: 6 suburb cells, 6 different block sets (3 of them on this build's stamp);
- a place's cell still its own board (the demo upright: the airport, the desert place; the crew on its cell);
- 20 fights, all ended, 0 page errors.

## 3. ROW 610, 'IF THE RE-DEAL SITS IN THE BOARD'S HAND-OVER': IT DOES NOT
Row 610 is the JOB board (a job he read gone 43 game minutes later), fixed by JOBS in 11/11s. The fight's board is dealt from the cell and
its ground alone (seedOf(cell, ground)): the same cell deals the same blocks in the same places every visit (gate leg P6, 35 of 35).
Nothing of the fight's to fix; the row stays JOBS' and FIXES TWO's.

## THE SITE'S WEIGHT (rule 447(b): 904 of 900 MB when this round began)
This build takes weight OFF: my eight VOTE card pictures re-encoded (1,539 KB to 684 KB, the same sizes on the glass), the new card 85 KB
twice. Net about 0.7 MB lighter. The cap itself is PLUMBER's row.

[bb Battle Brothers deals its fight map from the world tile's terrain type and what stands on it, so two forest fights are never one map; ours now does the same away from the places, and keeps a place's own board where the place is]
[analog horror: the same cul-de-sac never twice; you know the street is wrong because you have never stood on it before]
