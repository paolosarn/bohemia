# BOHEMIA — ITEM SCALE LAW (draft from Paolo's 848 flags, 7/13/26)

## The finding (systematic, from the Great Sweep)
Paolo's TOO-BIG/TOO-SMALL flags split cleanly along one fault line:
- HAND OBJECTS at 1 cell read TOO BIG: jars, bottles, food, drinks, supplies,
  loot, blood splats, screens, small props. (542 flags)
- STRUCTURES rendered as 1-cell props read TOO SMALL: cars, building parts,
  broken walls, roofs, fences, chain link, market stalls, dead trees. (306)

## The law (draft — Paolo confirms)
1. ITEM_SCALE: hand-object families render at ~0.55 of a cell (sub-cell
   sprites, centered or scatter-anchored). One knob, engine-wide:
   `ITEM_RENDER_SCALE=0.55`, tunable per family.
2. STRUCTURE_UPSCALE: structure families never render as 1-cell props —
   they take real footprints (cars 2x3 LAW; wall/roof pieces render as
   SURFACE cells in their layer; fences as run pieces; stalls/trees
   multicell per family).
3. Paolo's per-tile flags in BOHEMIA_ACT1_CONFIRMED_SET override any default.

## Consequence
The prop layer gets believable scale hierarchy for free: a bottle is small,
a car is big, a wall is a wall. My fp=source-aspect assumption is retired.
