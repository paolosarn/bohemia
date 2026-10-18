# COOK TWO [the curb on the map], ROUND ONE (10/18)
His 10/10 note: 'a sidewalk curb is a little elevated from the street too'; his YES on the curb that stands up in the
fight (cook2-one-at-a-time-the-curb-10-11). PURPOSE (the row): the map's streets read flat next to the fight's raised
curb. Opened by the coordinator (rules 111, 112, 116), Opus 5.5, no check-in. Cook only (rule 100): records/ and tools/
only, nothing to slices/, engine/ or the demo. Nothing drawn (rule 108): every colour is one of his pixels (his road, his
slab, his slab's own south face, his yellow paint) or his pixel blended with his own lip or shadow colour, the grammar of
the curb he voted up.

## HOW BATTLE BROTHERS DID IT, AND THE PACK
[bb research] Battle Brothers' world map has no curbs: its roads are painted dirt tracks on a painted ground, one light
from the upper left, and what reads as height (hills, cliffs) is a lit edge and a cast shadow on the side away from the
light. That is the whole method here: height is a lit lip and a shadow, on the one light. His pack does the same on a
slab: every slab in '1. Cracked contrete tiles' is drawn RAISED, its south face the bottom 7 rows (lum 51, 44, 43, 44,
24, then the frame's two black rows), the curb face seen from above (records/BOHEMIA_HOW_THE_PACK_DID_IT_SIDEWALK_10_10_26.md).

## THE KIT (records/target/cook2_map_curb/, keyed in COOK2_MAP_CURB_KIT.json)
One street piece for each of the 16 ways a road block meets its road neighbours (east, west, south, north: RUN's own
d = 0..3 in mapStreetTile), two variants each (rule 114c), at three of the map's pixel counts (a block 256, 128, 64
device px: the near stop, one step out, the middle). Two families:
- BLOCK: the street IS the road block, as the map's arterial picture draws it now: his asphalt to 0.43 of the block's
  half-side, the sidewalk to the edge (0.07), his yellow double down the middle (straight through, round a quarter circle
  at a bend, stopping at a junction's edge, no paint inside a junction), a curb return at every inside corner.
- BAND: the same street at RUN's band width (asphalt TW x 0.17, kerb TW x 0.05 across the screen), for where RUN draws
  the street as a line.
The curb at each level: the lip 1 px, the face 3 / 2 / 1 px, the shadow 3 / 2 / 1 px: a curb is a pixel-scale thing, so
each level is cut at its own pixel, never a 3 px face shrunk to nothing; RUN takes the largest level at or under the
zoom's block width (a piece is only ever enlarged, under 2x).

HOW A PIXEL IS MADE: the street is a height field on the map's own 2:1 diamond (sx = u - v, sy = (u + v) / 2); the sidewalk
stands the face's height above the road. One ray a screen pixel lands on the sidewalk's top (his slab), the curb's face
(his slab's own south face, top to foot, read along the curb at his pixel), or the road (his road); a road pixel with the
sidewalk within the shadow's length toward the light is in the curb's shadow (his road blended 0.55 with his road's
darkest twentieth, as the voted curb). The light is the style guide's one light (screen 155 degrees, from the left), so a
north-south street (screen up-right to down-left) shows its west curb's face in shade and the shadow on the road beside
it, and an east-west street, whose curbs run with the sun, shows its north face in his face's own tones and casts
nothing. His texture is laid at the SCREEN's pixel (every second of his pixels, his crack at half size), folded onto the
block by the map's own lattice, so the texel beside a block's edge is the next block's. Every pixel is owned by the one
block whose ground its ray lands in, so two pieces never paint the same pixel.

## MEASURED
- 0 pixels painted twice where two pieces meet; 0 pinholes in a laid grid of streets; at all three levels, both families.
- 0 colours that are not his (his road 8, 0, 9; his slabs 28, 0, 23, 1, 27 for the top and 0, 1, 2, 6, 7 for the face; his
  yellow from his road tiles 18-21); 8,257 colours on the BLOCK 256 atlas.
- A BLOCK east-west piece at 256: 13,440 road, 256 paint, 2,048 sidewalk, 256 lip, 384 face, 0 shadow (the sun runs with
  it); north-south: 384 face and 384 shadow.
- The paint cost on the demo with the kit laid (in the page only): 138 ms at the near stop, 157 one step out, 153 at the
  middle, against 192, 275 and 256 as it ships (a picture blit is cheaper than the strokes).
- NOT VIBE CODED N3's first five: every sprite on the card passes (one round failed D5 by 0.001 on the crossing; his three
  cleanest road tiles fixed it). THE TWIN GATE: none RED (AMBER on shape or pattern, GREEN on the crossing).

## THE FINDING (FOR RUN): the map's pictures draw up to a block above their own blocks
Measured on the committed demo (tools/bohemia_cook2_the_map_anchors_measured_10_18_26.js,
records/BOHEMIA_COOK2_THE_MAP_ANCHORS_MEASURED_10_18_26.json): drawHero puts a picture at dy = p.sy + TH/2 - by * sc, and
HERO_ANCH.by is 191 to 195 for EVERY one of the 69 pictures. That is right for the 259-row towers (resort, downtown: 3
rows off) and too big by about (259 - height) for the trimmed ground pictures: the interchange 125 rows, the desert 124,
the freeway 115, the suburb 102, the arterial 101, the strip 65 (median 66; only 8 of 69 within 4 rows). At the near stop
a block is 128 device px tall, so the arterial picture sits 0.8 of a block above its block, the desert a whole block.
What it costs:
- 261 of the 273 street bands __THE_STREETS_JOIN__ draws at the near stop have their middle painted over by a picture
  drawn later (the next row's, drawn high): the street network RUN drew is on the map and almost never on the glass.
- the districts do not sit on one grid: the towers are on their blocks, the ground a block above theirs; the party stands
  on the true block, so on the shipped map it stands in the road beside the suburb it is in.
THE FIX IS ONE LINE OF DATA: HERO_ANCH[k].by = the picture's own diamond centre (its bottom vertex under the anchor column,
minus a quarter plate), the number in the JSON's 'centre'. The sheet's middle picture is the map with exactly that and
nothing else (the page only).

## IN VOTE: cook2-the-curb-on-the-map-10-18 (records/target/COOK2_THE_CURB_ON_THE_MAP.webp)
From the map's own camera (tools/bohemia_cook2_the_curb_on_the_map_shot_10_18_26.js; the raw 3x shots regenerate, the
folder ignores them): the near stop BEFORE (as it ships) | REGISTERED (the anchors fixed) | AFTER (registered, the kit
laid: the BLOCK piece in place of the arterial picture, the BAND piece where RUN's band is drawn on the other streets);
the same corner at the phone's own pixels before and after; the curb at 4x; one step out; the kit at 1:1 with a laid
grid; the twin (his slab, the curb he voted up). Sheet: tools/bohemia_cook2_the_curb_on_the_map_sheet_10_18_26.py.

## FOR RUN (the lay)
1. The anchors first (above): every street and every district lands on its own block.
2. Then the kit: in the tile loop, a road block of J value 1 draws its piece where the band is drawn (BAND), or, for the
   arterial, the BLOCK piece in place of the arterial picture; mask from the same four-neighbour test; variant row
   (x * 7 + y * 13) % 2; the level the largest at or under TW * CV_DPR; drawn at (p.sx - TW/2, p.sy - face * TW/TWk) at
   TW wide. The freeway keeps its band (a freeway has a shoulder, not a curb); a deck or a dip keeps the band.
3. The arterial picture's lamps go with it; the street lights are the rig's (rule 115a), slots for RUN.

## WEAK
- His slabs carry his eight-legged star crack (DIRECTION's 10/10 note); at the map's pixel it still shows on the sidewalk.
- No night pieces yet (RUN's night band stays at night).
- The freeway is still RUN's flat band with its dashed centre drawn half by half (a 'Y' at every block): not mine, named.
- The BLOCK pieces cover the whole road block, as the arterial picture does: at the middle zoom the arterials read wide.

## CAPTION (rule 114c)
PIXEL SIZE the map's near stop, one art pixel to one device pixel (a block 256 px; kit levels 256, 128, 64), his tiles at
every second pixel | PALETTE records/target/cook2_map_curb/COOK2_MAP_CURB_KIT.json (his road, slab, face and yellow; 0
colours not his) | LIGHT the style guide's one light, screen 155 degrees, from the left.

## [the street joins for the map]: ROUND TWO MEASURED, HIS UP KEPT (the same round)
The twin gate (PLUMBER 044890d4) read the joins card RED on colours per 1,000 px (0.01 to 0.09 of his road tile's). Three
causes, measured: the snap to his tile's top 48 colours; the shade-to-shade recolour flattening each band to one hue (his
soil 526 colours per 1,000 px -> 51; S.recolour(keep_grain=True) keeps each pixel's own offset, -> 222, off by default);
one soil tile repeated every 21 px. Round two fixed all three and passed both gates (N3 and the twin, none RED; nearest
reduction was measured and dropped, it failed N3's D5 rest area). THEN HIS VOTE ON ROUND ONE LANDED: UP, 'Way better
nice!'. At the map's camera round two turned his smooth tans into a mottle (mean difference 5.9 of 255, the same mean
tone), so his yes wins (the style guide's tie-breaker 1): round one's look is back (ROUND_TWO_GRAIN = False in the tool;
round two stays one switch away), and a voted card is no longer held by the twin gate. Kept from round two: the ramp
is a distance on the plan, not a drawn line (ART PIPE A2: the tool now writes no pixel by hand).
FOR PLUMBER (the twin gate): his UP on a card the gate read RED. The gate compares a map-scale kit (his pixel reduced
4:1, snapped) cell by cell to a 1:1 pack tile; at the map's camera he prefers the smooth one. The map's scale needs its
own line (his voted joins are the first sample), or colours per 1,000 px is not held on a kit whose look names the map.
