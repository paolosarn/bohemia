# WORLD 11/2 round 3: THE PASSES, THE REAL ROADS THROUGH THE RANGES (ask line 303, rule 310; BUILD 11/3y)

His words (Paolo 11/2, through the coordinator): 'implement that immediately, that I can walk through the mountains... there should
always be, in the middle of any mountain outside of Vegas, a street going out from it, so I'm confused why I had to walk all the way
across... even if I have to, it would just take longer, that's OK, that's how Battle Brothers does it.'

## FIRST HALF, ALREADY ON MAIN (76995152, BUILD 11/3t, ask line 288): the mountains are slow ground, never a wall
records/BOHEMIA_WORLD_OVER_THE_MOUNTAIN_11_2_26.md: a mountain 3x open ground's minutes, 6x a road; every route weighs the minutes; a
mountain block takes 3 steps on the glass. Roads faster than dirt, dirt faster than mountain, the Battle Brothers order.

## THE PASSES (__THE_PASSES__, slices/bohemia_region.js)
- CHECKED AGAINST THE REAL MAP: every road he named was already on the region, drawn from real coordinates (tools/bohemia_world_region.py,
  RUN 10/18): I-15 north past Apex (36.35 N, 114.94 W) and south past Jean (35.78, 115.33) to Primm (35.61, 115.39); US-95 north-west
  past Indian Springs (36.57, 115.67) and south-east to Searchlight (35.47, 114.92); I-515 / I-11 / US-93 to Railroad Pass, through the
  River Mountains to Boulder City and old US-93 to the dam's crest (36.016, 114.737); NV-160 over Mountain Springs Pass (36.02, 115.50)
  to Pahrump; NV-159 past Red Rock to Blue Diamond (36.05, 115.40); NV-157 up Kyle Canyon off US-95 (36.30, 115.37) to the lodge
  (36.26, 115.64); NV-147 Lake Mead Boulevard east (36.20, 115.08 to 36.18, 114.95) through the gap by Frenchman and Sunrise Mountain.
  Out on the region a road over a peak is already a pass (the generator cuts '^' to hills under a road).
- WHAT WAS BROKEN: each road meets the valley's box at its PORTAL (9 of them in the land data), but the valley rolls its own rim, and
  where a portal met the rim's mountain or open ground there was no road on the valley's side. MEASURED from road block 64,78: the trip
  to Pahrump crossed 3 mountain blocks of the rim to reach NV-160 (17.0 h); 8 of the 9 portals' ways in crossed the mountain or went
  round.
- NOW each portal is joined, through the rim, to the nearest of the valley's own roads: the shortest way over the rim's mountain and
  open ground (straight in first) becomes road, named for the pass road (t.passRoad, the old ground kept as t.passWas). A portal that
  lands on a works or a farm starts from the nearest ground beside it along the edge. 55 rim blocks cut this seed; NV-564 already met
  a valley road. The painting, its tiles and the join masks are read again once the cuts land.
- AFTER, the same block: Pahrump 175 blocks 15.7 h by NV-160, 0 mountain blocks (17.0 h over the rim before the cuts, 20.0 h round
  before any of this); Mt Charleston Lodge 128 blocks 13.6 h (14.0); Indian Springs 172 blocks 15.5 h (16.5).

## PROOF
- gates/over_the_mountain_gate.js 7 of 7 (P1, P2 new; M2 now the honest case: with no pass at NV-160 the route goes over the mountain,
  17.0 h, because it beats the walls' way round, 20.0 h): P1 9 of 9 portals in with no mountain block, 55 rim blocks cut, undone 8 cross
  the mountain or go round; P2 Pahrump 15.68 h by NV-160 against 17.02 h undone.

- THE REGION IS BATTLE BROTHERS' SIZE R3 AMENDED A SECOND TIME, said plainly: the three farthest places (Mercury, Searchlight,
  Pahrump) are 0.8 days now by the real pass roads (they were a day and more while the ranges were walls, 0.9 over the mountain). That
  number measured the walls' detour, so R3 now REPORTS it and JUDGES the crossing: rim to rim on a road at least 1.5 days (1.9). For
  the coordinator: if the far places must stay a day away, that is a scale call (the region's compression), not a wall.
- Also green on the cuts: THE MAP STREETS JOIN 6 of 6 (the cut roads join), THE MAP WALK GLIDES STRAIGHT 10 of 10, REGION LAND 61 of
  61, THE FAR END IS PAINTED 11 of 11.

## LEFT
- The cut roads are painted as the valley's arterials (walks, lamp posts); a mountain pass would read better as a two-lane road
  with no walk and a guardrail. A cook or WORLD round.
