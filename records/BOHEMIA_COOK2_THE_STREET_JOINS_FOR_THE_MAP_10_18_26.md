# COOK TWO [the street joins for the map], ROUND ONE (10/18)
His words on the map (sweep AR): 'the districts look like shit, the streets look like shit, doesn't look connected'.
RUN's [the districts connect on the map] needs the pieces that join one district's street to the next. Opened by the
coordinator (rules 111, 112, 116), Opus 5.5, no check-in. Cook only (rule 100): records/ only,
nothing to slices/, engine/ or the demo. Nothing drawn (rule 108): every pixel cut, padded, layered, recoloured shade to
shade, placed or darkened from his packs or COOK FOUR's tanned buildings.

## WHAT IS LAID (records/target/COOK2_THE_STREET_JOINS_FOR_THE_MAP.webp)
Four of the map's own 96 m cells across, three down (OVER_N / TILE_FINE / CELL_M in the map):
- THE SUBURB (two cells): his YES street's tract. 11 m locals with 1.5 m sidewalks and curbs, caliche yards, COOK
  FOUR's five tanned ranch kinds facing south on four E-W locals, block walls lining the arterial (the backs of the
  tract, as a real Las Vegas collector is lined).
- THE WORKS (one cell): no sidewalk; his soil recoloured to a grey gravel, concrete yards from his slab, COOK FOUR's
  warehouse.
- THE FREEWAY (the east cell): four lanes and a median barrier in open desert (his soil in valley tan, his rocks and
  dry shrubs, sparse and clustered).

## THE JOINS (the kit: records/target/cook2_map_joins/, keyed in COOK2_MAP_JOINS_KIT.json with each edge in metres)
| piece | what it joins |
|---|---|
| J1_SEAM_SUBURB_TO_WORKS_ARTERIAL | a street crossing a district line: ONE asphalt and ONE yellow double run across; only the edges change (curb and sidewalk end on the line, a gravel shoulder starts) |
| J2_CELL_LOCAL_RUNS_OUT_INTO_DESERT | a road meeting a different ground: the sidewalk ends at the tract wall, the pavement crumbles (his broken-edge tiles 30-32, their own alpha holes) into a caliche dirt track |
| J3A_CELL_ARTERIAL_TURNS_ONTO_THE_RAMP | the freeway on-ramp, top: the arterial curves south as a 5 m ramp |
| J3B_CELL_RAMP_MERGES_GORE | the on-ramp, bottom: the ramp closes on the southbound shoulder; the gore hatch is his tile 23's hatch recoloured shade to shade onto his own white paint |
| J4_SEAM_WORKS_TO_DESERT_ARTERIAL | the arterial leaves the works into open desert: yards stop, the bare pavement edge runs on |
| J5_SEAM_TRACT_WALL_SIDEWALK_ENDS | the tract's south wall: the sidewalk ends, the street runs on without one |
A SEAM piece straddles a cell line, 12 m each side; a CELL piece is one whole map cell. Every piece is GROUND ONLY
(the buildings are COOK FOUR's and RUN's to stand on it). Standing props (chain link, the freeway sign, street lights)
are slots in the JSON for the rig (rule 115a).

## FROM THE MAP'S CAMERA (records/target/COOK2_THE_STREET_JOINS_MAP_CAMERA.png)
The map draws a cell as a 2:1 diamond (EYES' four numbers: TW0 18, TH0 9; the near stop is a block 256 device px
wide). The ground is projected the same way at the near stop's pixel count; the buildings are NOT projected, they are
reduced and stood upright on their projected feet, the way the map stands a building. Beside it on the sheet: the same
plan with his tiles AS BOUGHT (orange soil, frames on, his 96 grid), and THE MAP NOW (EYES' photograph of the committed
demo at zoom 0.5): every street a thin grey line and every district the same speckle, which is his 'not connected'.

## SCALE (rule 114, the first tell)
One pixel size in the scene: his native 57 px a metre reduced 4 to 1 (14.25 px a metre), every reduced tile snapped
back onto its own tile's top 48 colours (no new colour). The near stop is 2.67 px a metre, so the kit sits 5.3x above it
and RUN reduces, never enlarges. Real widths (arterial 14 m, local 11 m, freeway 25 m, ramp 5 m); the map's BW table
draws arterial 9 m and freeway 12 m, written in the kit JSON so RUN matches one to the other.

## MEASURED (records/BOHEMIA_COOK2_THE_STREET_JOINS_FOR_THE_MAP_10_18_26.json)
- THE CONNECTION: at the suburb-to-works line and the works-to-desert line, 100% of the arterial's rows are road on
  both sides of the line; the tone step across the line is 0.1 of 255 (one asphalt, no seam).
- 0 sidewalk pixels outside the suburb (the curb stops on the district line).
- 289 distinct colours (5 bits a channel) across the whole ground.

## IN VOTE: cook2-the-street-joins-for-the-map-10-18 (rule 114b; NOT VIBE CODED N3, class tile, family road)
(Round one.) Measured first under the old ruler: all six pieces passed D1, D2, D4 and D5 and failed D3 alone (a top-down ground
has no light direction; his own tiles failed it 92%). PLUMBER's ground ruler landed the same round (5d50863,
records/BOHEMIA_THE_GROUND_RULER_AND_THE_THREE_READINGS_10_18_26.md: a 96 px cell at a time, D3 not held on a slab), and
under it the six pieces pass the first five; the item is registered with its sprites, class tile, family road, and its
look. The kit lives in records/target/cook2_map_joins/ (it first sat in reference/art_bank/, where the gate counted it
as a new pack family and the band went stale; moved, N2 green). RUN does not wait on the vote: the kit is on disk for
[the districts connect on the map].

## WEAK
- One warehouse kind (COOK FOUR has one); the works read by ground and yards, not by buildings.
- The ranch sprites face south only, so every house fronts a street to its south (no backs exist).
- The yellow double is near-invisible at the near stop (2 px wide at the kit's pixel): right for a rest area, thin
  for a map.

## HIS VOTE: UP, 'Way better nice!' (10/18). ROUND TWO MEASURED AND SHELVED
The twin gate read this card RED (colours per 1,000 px); round two removed the snap, kept the grain and laid four soil
tiles, and passed it; then his UP on round one landed, and round two had turned the smooth tans into a mottle at the
map's camera. His yes wins: round one's look stands (ROUND_TWO_GRAIN = False). The full account and the note to PLUMBER
are in records/BOHEMIA_COOK2_THE_CURB_ON_THE_MAP_10_18_26.md.

## CAPTION (rule 114c)
PIXEL SIZE his pixel reduced 4:1, 14.25 px a metre, one size in the scene; the camera picture at the near stop's
256 px block | PALETTE records/BOHEMIA_COOK2_THE_STREET_JOINS_PALETTE_10_18_26.json | LIGHT from above, as his pack paints it.

Tool: tools/bohemia_cook2_the_street_joins_for_the_map_10_18_26.py (~5 min). Gates: reference check 492/0.
