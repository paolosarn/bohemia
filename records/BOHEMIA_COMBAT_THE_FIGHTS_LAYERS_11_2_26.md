# COMBAT [the fight's layers] 11/2/26 (ask line 251; BUILD 11/2x - HOUSES COVER LEGS)

Paolo 10/27 (records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md note 3): "a graphic system where it recognizes the
overlays... if I'm in the street during combat mode and there's a house one tile beneath me south of me... if that house is a one
or two or three story house then it would cover up like the legs of my character... the layers of this 45 degree combat model".

## MEASURED BEFORE
- slices/BOHEMIA_FIGHT.html drew the whole ground (blocks with their buildings painted in, then the cover pieces, then the lamps)
  in one pass, then every man on top, sorted only against other men. Nothing south of a man could ever cover him.
- The town blocks' tall buildings are painted UP into the tile north of their own (COOK's 3D re-render, records/target/
  cook_floor_not_final/town.json): a man standing in the street behind the motel, the church, a shop or the warehouse was drawn
  standing ON the roof (picture 1 and 2, left). A lamp, car, wall or shed south of a man's feet was drawn under him (picture 3, left).

## WHAT SHIPPED
- tools/bohemia_combat_the_fight_layers_11_2_26.py reads every building's top edge off the block pictures (guessed from COOK's
  height and depth on the 45 law, snapped to the picture's strongest edge within a few pixels: main.0's shop guessed 914.5, edge
  916; the church's gable and tower and the gas station traced by hand) into slices/fight_ground/fight_stands.json: 66 outlines
  on 15 pictures (main, works, ruin, present day and both futures; strip's roofs stop at the block's top edge).
- THE LAYERS in the fight: before the first body or man is drawn, the glass under every man who has something standing in front
  of him is kept (only where it overlaps him); after his body, it is laid back over him through the outline of what stands in
  front: a building's measured outline, a car's / wall's / shed's / crypt's / lamp's outline read off its own picture. So the cover
  is the very pixels the glass showed (night, lamp pools, chalk on the tiles), never a second drawing. His bars stay over it.
  In front = a building whose own tile row is south of his feet (a man on a roof stands on it); a piece or a lamp whose foot is
  south of his feet. The fallen are covered the same way.
- Pictures (phone upright, 390 x 844, before | after): records/target/combat_layers_11_2/phone_before_after_1.webp (the shop),
  _2.webp (the church), _3.webp (a street lamp in front of his boot).

## MEASURED AFTER (a man standing in the tile right behind it, the man 1.8 tiles tall)
| what stands south of him | covered of him |
|---|---|
| the church (gable, main) | 51% |
| the warehouse (three storeys, works) | 48% |
| the warehouse's office | 34% |
| the motel row (main) | 23% |
| the shop (two storeys, main) | 21% |
| the ruin's and the works' shops | 17 to 19% |
| the gas station's kiosk / canopy | 14% / 3% |
| a suburb ranch house (one storey) | 0% |
- Frame (bench, phone upright, software canvas, the road board with 9 of 21 men covered every frame): 13.4 ms before, 17.3 ms
  after (the glass under them is kept until the camera, the turn, a mark or a tile changes; copying it every frame cost 29 ms,
  a mask blended per man 102 ms: both measured and dropped).

## WHAT IS LEFT (honest)
- A ONE-STOREY HOUSE COVERS NOTHING: every ranch house is drawn inside its own tile (its roof 0 to 0.21 of a tile below the tile's
  top edge, records/target/cook_floor_rig/blocks.json), and a man stands at the front of the tile north of it, so there is no
  overlap to layer. The layering is in; for "one storey covers his legs" the suburb houses would have to be drawn about a tile
  taller than they are (the man is 1.8 tiles, a ranch house 0.8): an art call for DIRECTION / COOK, not a drawing-order bug.
- Gore drops and hit ripples are still drawn over everything (they are in the air).

[bb] Battle Brothers draws a hex row's tall pieces after the brothers on the rows behind it: a brother behind a house is hidden to
the height of the house. [analog horror] the cover is the same frame of tape: the roof over his legs is the glass's own pixels.
