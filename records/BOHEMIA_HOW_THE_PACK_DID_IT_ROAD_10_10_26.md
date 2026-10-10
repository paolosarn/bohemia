# HOW THE PACK DID IT: THE ROAD
COOK [how the pack did it], 10/10/26, rule 100c. 290 of his purchased road tiles, judged
UP in his 7/13 sweep, measured as files in `reference/art_bank/road`.

Paolo 10/10: *"not getting inspired from the assets I downloaded, UNDERSTANDING HOW
THOSE ARE COOKED UP so when we implement them they don't stick out like sore thumbs."*

**This lane picked the family and says so.** The pass (rule 98) has one plate and COOK
is not a station on it, so nobody named my next asset. I took the road because rule 77b
names COOK on the map's roads, because he named them himself on 10/10 ("BRO ON THE MAP
NOT ON THE COMBAT, and even then it's looking like shit"), and because after the ground
the road is the most looked-at thing on a map.

## THE SEVEN NUMBERS

| | his road tiles | what it means for anything we draw |
|---|---|---|
| PIXELS | 95 x 96 median, 66 to 96 wide, 9024 px a tile | this is the CEILING the family was drawn at, not the size it is used at |
| COLOURS | 4821 in one tile (1741 to 8442) | ours ship with seven; this is the gap he is pointing at |
| HOW FEW IT LEANS ON | the top eight colours carry 8% | a ramp leans on its top eight almost entirely; his does not, so it is a SURFACE and not a ramp |
| VALUE SPAN | 255 of 255 inside one tile | a tile that spans this much carries its own light and does not need the scene to light it |
| LIGHT | left minus right +0.8, top minus bottom +5.4, 90% lighter at the top | his ground tiles are lit from ABOVE, near enough flat across, so a tile carries no corner shadow of its own and the SCENE does the lighting |
| OUTLINE | edge minus inside +15.1, 26% have a darker ring | NO DARK OUTLINE: the edge is +15, which is LIGHTER than the inside, so the surface simply ends and often catches a little light as it does. Anything we draw with a dark line round it will stick out exactly the way he said |
| CLUSTER | a value holds 1.90 px across a row at 16 steps, 66% of runs are a lone pixel | this is GRAIN: a value holds for a stretch and then steps, so a checkerboard dither of ours would read as noise beside it |
| THE EDGE | joint over inside 2.00 across, 3.08 down; 22% tile cleanly | most of the family is NOT built to repeat: these are slabs meant to be laid in a grid with their own edges showing, not seamless fields |

## WHAT THIS CHANGES ABOUT WHAT I WAS ABOUT TO DRAW

1. **The colour count is the whole complaint.** 4821 colours in one of his tiles against the seven
   a tile of ours carries. No amount of better shape fixes that; it is a different kind
   of object. A ramp cannot be made into a surface by adding steps to it.
2. **The top eight carry only 8%.** That is the number that says SURFACE rather than
   palette. Our tiles put nearly everything on their top eight, which is what banding is.
3. **No outline.**
4. **The grain is CLUSTERED, not dithered** (1.90 px a run at sixteen value steps). A dither we add on top will read as noise beside his grain, which is the "sore thumb" he described.
5. **22% of his road family does not tile.** They are slabs, laid in a grid. So the
   edge rule for anything we cut from them is not "make it seamless", it is "make the
   seam part of the drawing", which is how a real road is built anyway.

## THE TILES THAT PROVE IT

Laid twice each in `records/target/COOK_HOW_THE_PACK_DID_IT_ROAD.png`.

MEET BEST: pack:1. Floor tiles (1)#16, pack:2. Rusted metal floor tiles#20, pack:1. Cobblestone floor tiles#46

MEET WORST: pack:Floor tiles#10, pack:Floor tiles!#10, pack:Floor tiles!#46

## THE EIGHTH NUMBER: HIS ROAD PAINT, AND HOW IT WAS NEARLY MISSED

The first cut of the map road tile asked his MARKING family whether the packs hold road
paint. That family is warning signs, blood and bones, so the answer came back NO, and on
that answer a lane line was cooked and eight guards went green. Then the picture was
looked at, at one art pixel to one phone pixel, and the line read as a scuff.

**His road paint is in the ROAD family, painted on the road, which is where road paint
actually is.** 13 of these 290 tiles carry it:

| tile | paint | rows with paint | its colour |
| --- | --- | --- | --- |
| `1. Cracked contrete tiles#17` | 26.1% | 84 of 94 | rgb(165, 121, 53) |
| `1. Cracked contrete tiles#8` | 25.4% | 85 of 94 | rgb(173, 126, 57) |
| `1. Cracked street tiles#23` | 11.3% | 89 of 96 | rgb(170, 109, 34) |
| `2. Rusted metal floor tiles#19` | 7.4% | 81 of 96 | rgb(160, 96, 40) |
| `1. Cracked contrete tiles#36` | 6.3% | 76 of 89 | rgb(186, 133, 49) |
| `1. Cracked street tiles#20` | 5.7% | 22 of 96 | rgb(174, 112, 35) |
| `1. Cracked street tiles#18` | 5.6% | 22 of 96 | rgb(171, 110, 33) |
| `1. Cracked street tiles#22` | 5.4% | 32 of 96 | rgb(173, 111, 33) |
| `1. Cracked contrete tiles#37` | 5.4% | 75 of 89 | rgb(189, 135, 51) |
| `1. Cracked street tiles#19` | 4.3% | 22 of 96 | rgb(171, 111, 36) |

AND THE SWEEP IS A CANDIDATE LIST, CHECKED BY EYE, WHICH IS THE WHOLE POINT OF THIS
SECTION. `2. Rusted metal floor tiles#19` is rust, not paint: warm, saturated and a
minority on grey metal, so the number cannot tell them apart and looking can. The ones
confirmed by looking are the cracked street set (#18 to #23, worn orange lane paint on
dark asphalt) and the cracked concrete set (#8, #17, #36, #37, yellow hazard stripes).

THE LESSON FOR EVERY LANE THAT READS THIS PAGE: a measurement can be green and still be
answering the wrong question. MEASURE AND LOOK. The sweep above exists so nobody has to
find this twice.

## ROUTED

- **COOK TWO** (the ground, rule 87): these seven numbers are the bar for every fight
  tile, street, sidewalk and kerb cut from the packs. The colour count and the top-eight
  share are the two that decide whether a tile sticks out.
- **COOK FOUR** (the places): the no-outline line and the cluster line apply to house
  skins as much as to ground.
- **DIRECTION**: rule 90 round 8 asks for a card of numbers built from these pages; this
  is the road page and its numbers are in a table above, ready to go on it.
- **EVERY ART LANE**: his road paint exists and is listed above. Nobody cooks road paint.
