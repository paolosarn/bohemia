# THE MARKSMAN THROUGH THE RIG (COOK THREE, [the tiers through the rig] round 3, 10/18/26)

Rule 115(a)(c): the people are modelled at the source and rendered through DIRECTION's master rig, one tier a round.
Cook only (rule 100): nothing in slices/, engine/ or the demo. Opus 5.5 (rule 116), opened by the coordinator (rule 112).

## How the pack did it / where the tier comes from
The packs hold no people (10/11). The tier's brief is the tier paint file (engine/bohemia_cook3_tier_paint.json):
MARKSMAN = leather, a strap, the hue kept at 180 (teal). The twin is the game's own flat marksman (records/cook3/enemy_tiers_repainted.png,
cell 2): a teal shirt, a hat, brown check trousers, NO GUN. The body, bones and walk are CesiumMan, the rig's man, reused whole.

## The model (tools/bohemia_cook3_the_tiers_through_the_rig.py MARKSMAN)
- A hip-length leather jacket: the body from z 0.60 to 1.17 lifted 1.6 cm, closed, sleeves to the wrist, a stand collar.
- A bandolier: the body's faces within 2.6 cm of the line from the right shoulder (x -0.17, z 1.13) to the left hip
  (x 0.17, z 0.66), front and back, lifted 3 cm so it stands proud of the leather; canvas tan (tape_masking[1]).
- A teal scarf wound at the neck, 3.4 cm thick (clay_teal[4]): the one accent above the waist, the teal the old paint kept.
- A peaked cap: the crown is the head's skin lifted; the peak a disc segment out 7 cm over the brow, dipping to its edge,
  on the head bone.
- THE RIFLE SLUNG ACROSS THE BACK, every vertex on the chest bone (torso_joint_3): stock and fore-end in wood
  (clay_rust[2]) by the left hip, barrel and scope (cloth_black[1]) up over the right shoulder to z 1.56. His hands are
  empty, so at 28 px he is the one with a stick over his shoulder; the thug and the poacher hold theirs in the fist.
- mat() now shares one material per colour (style guide field 5: 8 a person). The marksman: skin, eyes, jacket and
  sleeves, khaki trousers, boots/cap/gun metal, wood, scarf, strap = 8.

## The cycles (logged)
1. First render: card 1 of 8 out (value span 109 vs 118); the barrel 1.1 cm round read as 0.7 px, invisible; the
   strap (rubber[3]) vanished on the oxblood leather.
2. Barrel 1.9 cm, stock 5 x 9 cm, scope 2.6 cm, muzzle raised to 1.56: the gun reads over the shoulder from S and whole
   from N and NW (a slung gun is drawn fatter than life the way a 28 px sprite needs). Strap to canvas tan, scarf to
   the top teal step: span 110.
3. Cap, boots and metal to cloth_black[1]: span 106. WORSE: the card reads value span as p95 minus p5
   (tools/bohemia_direction_the_card_of_numbers.py), so the dark end was already held by shadow; the light end needed AREA.
4. Trousers metal_painted[2] -> [3], pale khaki: span 121. 0 OF 8 OUT under the style guide (class person):
   long side 128, colours 1,274 vs 604, top 8 4.2%, saturation 0.34, light 13.7, edge -26.0, grain 1.69.

## The sheet
records/target/cook3/COOK3_THE_MARKSMAN_THROUGH_THE_RIG.png: eight facings, the S and SE walk
(6 keys = 2 beats at 120), beside the game's flat marksman at 1:1 and 4x. 57 px a metre, one pixel size; palette
records/target/BOHEMIA_STYLE_PALETTE.json; one light, the rig's sun upper left. VOTE: cook3-the-marksman-through-the-rig-10-18.

## Findings
- FOR DIRECTION (third time, the same one): the rig's up-face dust greys a dark cap to a mid grey dome (cloth_black[1]
  renders near #6a6a66 on top). A per-material dust weight would keep a black cap black.
- FOR DIRECTION / the card: the value-span row is p5 to p95, so it rewards bright AREA, not one bright accent; a dark
  tier (the marksman in oxblood leather) has to carry its light end on a big piece (the trousers). Worth a line in the
  style guide's field 8 so the next lane does not darken to fix it, as cycle 3 did.
- FOR CHARACTER / PORTRAIT: the box head stays the body's; the cap's peak hides it a little from the 45-degree camera.

## Next
The RAIDER: mail as geometry (rows of rings as a modelled surface, DIRECTION's mail HOLD from 10/10: rows, lit shoulder,
darker hem), chest and arms.

REFERENCE CHECK: the compare law; the twin is the game's own marksman; the card of numbers; no reference game.
