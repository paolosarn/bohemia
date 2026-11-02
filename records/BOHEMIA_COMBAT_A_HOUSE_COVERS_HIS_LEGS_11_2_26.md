# COMBAT [a house covers his legs] 11/2/26 (ask line 251; BUILD 11/3zo - HOUSES COVER LEGS)

Paolo 10/27 (records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md note 3): "if I'm in the street during combat mode
and there's a house one tile beneath me, south of me... if that house is a one or two or three story house then it would cover
up the legs of my character... the layers of this 45 degree combat model". The layers shipped in BUILD 11/2x
(records/BOHEMIA_COMBAT_THE_FIGHTS_LAYERS_11_2_26.md); the one-storey suburb ranch covered 0% of a man behind it. This round
makes it cover him.

## MEASURED BEFORE (why a ranch covered nothing)
- The fight's man is MAN_ROWS 1.8 tiles tall (655 art px; a house tile is 515 x 364 art px, 12 m x 12 m), his feet at 0.9 of his
  tile, so a man in the tile right behind a house stands 36 px (1.2 m) north of the house tile's back line. To cover any of him
  a house's top must stand higher than that on the screen.
- The rig's ranch (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py place_houses) was SQUEEZED to stay inside its own
  tile: depth x 0.82 x its width's fit (0.71 to 0.78 of the builders' 8 m), height x its width's fit (0.87 to 0.95 of the
  builders' 2.7 m wall), its front on the old facade line. Its back eave stood 3 to 4 m short of the tile's back line, its top
  76 px (0.21 of a tile) BELOW the tile's top edge at its highest (records/target/cook_floor_rig/blocks.json, the 10/19 ledger).
- On this camera (the 45 law: a height is 1:1 on the glass at 42.92 px a metre, a depth x 0.7071) a straight roof's highest point
  seen from the south is its BACK EAVE, not its ridge, for any pitch under 35 degrees: the ridge stands 4 m further south. So
  for a one-storey ranch the honest reach is its back eave's height at the back line, nothing more.
- The fight STAGGERS every row a quarter tile (slices/BOHEMIA_FIGHT.html STAGGER 0.25): a standing man is never behind a
  house's middle. Tried and dropped this round (one region each, records/target/cook_floor_not_final/render): a back wing under
  a cross gable (a T ranch) reached 22.6% at the house's middle but only 15.7% where a man stands, and from this camera its two
  slopes read as a tall box behind the roof: a fake second storey. Not shipped.

## WHAT SHIPPED (records/target/cook_floor_rig/house_lot.json; re-rendered through the same rig)
- Every suburb ranch (subs 0-3, corner 0-2, culdesac 0-1, suburb_stem 0-1: 74 houses) stands at its REAL size and at the BACK
  of its lot: its front exactly where it was (so a man standing on its roof, which the fight lifts 0.2 of a tile, still stands
  on its roof), its back wall 0.05 m inside its tile's back line, its eave over the line as a real eave is. The roof keeps its
  ridge along the front (COOK FOUR's family: no gable end at the camera) and reads LOWER for the depth (13.8 to 17.9 degrees):
  one row of windows, one storey.
- Its height is a 2000s Las Vegas tract house's: the subdivision the crash left half-built, a 9-ft ceiling on its slab, 2.97 m
  to the plate (the builders draw a 1960s ranch at 2.7 m and the fit had shrunk it to 2.35-2.57 m). Doors and windows scale with
  it (the door 2.31 m, an 8-ft door of those years is 2.44 m).
- A house on a block's top row (the cul-de-sac's four) keeps its old stance: the tile north of it is another block's and its
  chimney, grown back and up, stood past the picture's top edge.
- The rig renders the houses once more ALONE at one sample, each one flat colour (the Raw view, so the colour reads back exactly):
  the composite takes the new house from the render to the pixel (it now stands up into the tile north of its own), and each
  house's top edge (33 columns) goes into the ledger (records/target/cook_floor_rig/blocks.json 'top').
- tools/bohemia_combat_the_fight_layers_11_2_26.py reads those tops into slices/fight_ground/fight_stands.json (how: 'mask'), ON A
  PICTURE ONLY IF THAT PICTURE IS DRAWN WITH THOSE HOUSES: the shipped file matches the rig's lossless render of it, and its sha1
  is pinned in the ledger ('new_pictures') so any machine can check it. A picture still showing the old house gets no outline
  (a cover where no roof is drawn would lay ground over his legs). The fight's layers code is untouched. 221 standing pieces on
  37 pictures (66 on 15 before).
- SHIPPED THIS BUILD: 22 of the 33 suburb pictures: the present day of subs 0-3, corner 0-2 and suburb_stem 0-1 (9), their
  reclaimed futures (9) and the raided futures of subs 0-3 (4). STILL RENDERING when this shipped (records/target/cook_floor_*
  masters, same tools): the cul-de-sac's 6 (its top-row fix) and the raided futures of corner 0-2 and suburb_stem 0-1 (5).
  Those 11 keep their old pictures and no outline until they are swapped in and the layers tool is run again.
- The two futures (reclaimed, raided) are re-rendered from the same houses through their own tool
  (tools/bohemia_cook_the_futures_through_the_rig_10_22_26.py, which wraps the same place_houses): the future is still computed
  from the past.
- THE JUNK MOVED: the rig's litter is placed off the floor plans, which are regenerated each run and were never kept
  (records/target/cook_floor_rig/plans is ignored); today's plans put the bags, paper, a couch and the fires in other spots than
  the 10/20 run did, the same kinds and about the same number. It is the ground's dressing, not cover; the three times of a
  block were rendered from the same plans and match each other.
- Picture (phone upright, 390 x 844 @3x, the real fight, seed 1 suburb board, one of his men on the tile right behind a ranch,
  the close stop): records/target/combat_layers_11_2/phone_houses_before_after.webp. Made by
  tools/bohemia_combat_a_house_covers_his_legs_shot_11_2_26.js (before = main's pictures through the driver's serve map).

## MEASURED AFTER (a man standing in the tile right behind it, at the spot the fight's stagger stands him)
| what stands south of him | before | after |
|---|---|---|
| a suburb ranch house (one storey), porch kind | 0% | 16.0 to 16.3% |
| a suburb ranch house (one storey), plain kind | 0% | 16.7 to 17.0% |
| the motel row (one storey, main) | 23% | 23% (unchanged) |
| the shop (two storeys, main) | 21% | 21% (unchanged) |
| the warehouse (three storeys, works) | 48% | 48% (unchanged) |
| the church (gable, main) | 51% | 51% (unchanged) |
- Across his legs (the middle 0.14 of a tile) and at his middle the ranch is the same within 0.1%: the back eave is a straight
  line, so the cover does not depend on which way the stagger stands him. Feet, ankles and shins: his knees are at about 28%.
- 62 houses on the 9 shipped blocks, every one covers a man behind it (16.0 to 17.0%). The cul-de-sac's 12 (the four top-row
  ones keep their old stance: nobody stands behind them inside their block) ship with its fix.
- The fight colour gate: 121 pictures, the lowest kept 100% of its remembered chroma; the 35 present-day blocks median 12.7
  against 12.7 remembered.

## WHAT IS LEFT (honest)
- THE ASK SAID 20 TO 35% FOR ONE STOREY; THE HONEST RANCH IS 16 TO 17%. A man drawn 1.8 tiles tall is about 15 m at a house's
  scale, so a 3 m eave can only reach his shins. Past that the house would have to be taller than a one-storey house is, or
  show a tall shape behind its roof (the T was tried and read as a second storey). The order holds: one storey 16-17%, two
  storeys 21%, three 48%.
- The motel (one storey) covers 23% because its picture stands about 3 m INTO the tile north of it (the town blocks' measures,
  records/target/cook_floor_not_final/town.json): a man in that tile stands inside the motel's back. The town blocks are COOK's
  3D re-render; whether they move back into their own tiles is a COOK / COMBAT question for the next round.
- THE 11 STILL RENDERING: the cul-de-sac's present day and both futures (culdesac 0-1) and the raided futures of corner 0-2 and
  suburb_stem 0-1. To finish: swap them in (tools/bohemia_cook_the_floor_not_final_10_20_26.py --swap culdesac.0 culdesac.1;
  tools/bohemia_cook_the_futures_through_the_rig_10_22_26.py --swap <state> <blocks>), run the layers tool, ship. If the
  container is gone, re-render those (each tool takes the block names; about 15 and 10 minutes each).
- The renders: 33 pictures, about 15 minutes a present-day block and 10 a future on this machine (two queues side by side).

[bb] Battle Brothers hides a brother behind a house or a tree only to the height of what is drawn in front of him: a low hut
hides his legs, a tall house the brother; the depth is in the drawing order, the height is the picture's.
[analog horror] the ranches of the subdivision the money stopped building, at the size a 2008 tract house really is, their
roofs run back to the lot line over yards nobody fenced; behind one the man loses his boots to a roof's edge, the glass's own
pixels laid over him.
