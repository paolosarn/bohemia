# COMBAT [way more fight maps] 11/2/26 (ask line 252; BUILD 11/2zz - THE BOARD HAS A SHAPE)

Paolo 10/27 (records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md note 3): "more maps... it got pretty boring... we
need way more maps, way more combat maps". CLAUDE.md (Paolo 9/29): NO TWO COMBAT BOARDS ARE THE SAME.

## MEASURED BEFORE (every one of the 78 districts in records/target/BOHEMIA_BOARD_KINDS.json, 50 map cells each, the fight's own deal)
- The blocks themselves were already varied: 48.9 of 50 deals had a different block grid (the cemetery 3, by design: its stones
  are dealt fresh every time). That was never the problem.
- THE PROBLEM IS THE SHAPE: 9 of the 11 city block kinds have ONE field shape (an open row, a row of houses, open, houses, open;
  slices/fight_ground/fight_ground.json, read tile by tile). So every town and suburb board was the same horizontal stripes,
  whatever blocks were dealt. In the 52 city districts: 16.1 different board shapes in 50 deals (as few as 11), and 0.97 open
  blocks a board (of 12).

## WHAT SHIPPED (slices/BOHEMIA_FIGHT.html, THE BOARD HAS A SHAPE; the shapes are data: records/target/bb/ours.json 'board_shapes')
- A city board, once its blocks are dealt, is cut into one of 18 shapes: the street as it was (weighted 3), an open lot where the
  lines meet, a clearing, their back open, yours open, no man's land, a diagonal, a crossing, a gap, their line in the open, his
  line in the open, the top open, the bottom open, a pocket, their corner, the middle open, two corners, the step.
- A shape turns slots into THE VACANT LOT: the suburb block whose houses were never built or were knocked down (bare slabs on the
  sand, the valley after 2008), its street on the very line of every other block's: no seam, no new picture.
- Picked by a hash of the deal itself: the fight's dice never move. The place's lead slot is never emptied; the canal stays.
- Two lots side by side make one bigger lot (the twin rule is for houses). A lot's litter is dealt again on every lot (the car
  kept on its street row and moved along it, the rest moved to other tiles, each rubble piece swapped), so two lots never match.
- Picture: records/target/combat_maps_11_2/four_boards.webp (three new shapes and the old stripes).

## MEASURED AFTER (the same 78 districts, 50 cells each)
| | before | after |
|---|---|---|
| city districts: different board shapes in 50 deals (mean) | 16.1 | 29.5 |
| the worst city district | 11 | 25 |
| open blocks a city board | 0.97 | 3.22 |
| different block grids in 50 deals (all 78 districts) | 48.9 | 48.9 |
| deals that threw | 0 | 0 |
- AUTO fights on the new boards (suburb night, ruin day): played to the end, nothing thrown. Fight length: see FIGHT LENGTH below.

## WHAT IS LEFT
- Every new shape is cut from blocks that exist. Truly new shapes (a street running north to south, a plaza, a block with one
  house missing) need new block art: COOK and DIRECTION (rule 87's revamp), asked through the coordinator.
- The edge family (desert, wash, shore, landfill) was not touched: its blocks are open already (their boards differ 27 to 44% tile
  by tile).

[bb] Battle Brothers cuts every tactical map from its terrain's templates, so a forest fight and a settlement fight are different
fields. [analog horror] the half-built subdivision: rows of slabs poured for houses nobody came to build, a dead car on the street.
