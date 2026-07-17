# BOHEMIA ADDENDUM: STREET COMPOSITION LAWS (7/14/26)
Paolo's calls, locked this session, from the street tuner review.

## LANE LAW (LOCKED)
- Lanes per direction: 1 to 4 depending on how busy the street is. 5 per
  direction for freeways only.
- Typical: most streets run 2 or 3 lanes per direction.
- LANE WIDTH NEVER CHANGES. One fixed lane width across the whole game.

## SIDEWALK WIDTH LAW (LOCKED)
- Most sidewalks: width 1.
- Busier streets: width 2.
- The Strip: width 3 MAXIMUM. Nothing anywhere exceeds 3.

## CROSSWALK LAW (LOCKED)
- Crosswalks exist ONLY at intersection crossings (real Vegas: no mid-block
  crosswalks).
- Most crosswalks: width 1. Busier streets: width 2.

## MEDIAN LAW (LOCKED)
- Most streets: median width 1. Busier streets: width 2.
  (Voice-to-text "meeting width" = median width.)

## STREET LAMP SPACING (RESEARCH FILED, game math = Paolo's call)
Source: Clark County Area Uniform Standard Drawings (dwg 300/311/311.1/312,
the real spec Vegas is built to).
| street class | real spacing | ~meters (1 cell ~ 1m) |
|---|---|---|
| Arterial (100ft+ ROW, mile roads) | staggered both sides, 160ft same-side / 80ft opposite offset (Clark Co unincorporated 120/60, some entities 140/70) | pole every ~24m alternating sides (~49m same side); tight version ~18m |
| Collector (80ft ROW) | 170ft same-side / 85ft staggered | every ~26m alternating |
| Residential (60ft or less ROW) | 170-180ft, one side allowed | every ~52-55m, single side |
| Intersections | poles required at every corner | every corner |
| Medians | lighting allowed when median >= 10ft; Henderson/Boulder City REQUIRE median lighting on 100ft+ ROW | median >= ~3m carries lamps |
[PENDING, Paolo's call]: the equivalent in-game spacing numbers. Paolo does
the math; these are the grounded real refs.

## STAGGERED LAMP LAW (LOCKED, Paolo 7/14/26: "Real Vegas")
Street lamps STAGGER, alternating sides of the street, per the Clark County
staggered layout. Never placed as facing pairs. Spacing knob = distance
between consecutive lamps (which alternate sides), so same-side distance is
2x the knob. In-game numeric spacing = Paolo's math [PENDING].

## STREET TUNER FIX QUEUE
1. FIRE BARREL MISLABEL, root cause found: the lamp sprites come from tile
   pack "18. Light sources and fire barrels" and the tuner inherited the
   pack name. FIX: split into separate families (street_lamp vs
   fire_barrel), tuner label reads "street lamp".
2. CAR OVERLAP LAW (LOCKED): cars must NEVER overlap each other. Placement
   gets a collision check.
3. CAR ROTATION LAW (LOCKED): cars face all four ways, not just E-W. Rotate
   props freely; N-S facing cars are normal street furniture.

## GROUNDING
All widths and spacings trace to real Vegas street anatomy (Clark County
USD). Lane counts match real valley arterials (2-4 per direction) and the
5-lane freeway sections of the 15/95.

## NO SINGLE STREET LAW (LOCKED, Paolo 7/14/26)
There is no one way to make a street. Street variety is the point: the
composition laws above are RANGES, and generation must vary lanes, medians,
sidewalks, dressing, and damage within them per block. Paolo's tuner
directions are the variety envelope, never a fixed template.
