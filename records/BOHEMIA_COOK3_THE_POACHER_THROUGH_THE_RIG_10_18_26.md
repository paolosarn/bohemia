# THE THUG'S TWO ROWS, AND THE POACHER THROUGH THE RIG (COOK THREE, [the tiers through the rig] round 2, 10/18/26)

Rule 115(a)(c): the people are modelled at the source and rendered through DIRECTION's master rig, one tier a round.
Cook only (rule 100): nothing in slices/, engine/ or the demo. Ran on Opus 5.5 (rule 116), opened by the coordinator (rule 112).

## 1. The thug's two rows (the card was 2 of 8 out on round 1, 17cc8b7)
- ROW "value span >= 118": 105. A REAL FAULT. The base colours came from the tier paint file (oat padding 124,106,82,
  mid-ramp), so nothing on the body reached the light end of a ramp. FIX: every base colour is now a STEP OF A ROLE in
  the style palette (records/target/BOHEMIA_STYLE_PALETTE.json; the style guide's field 5): the gambeson
  tape_masking[2] #c2a878, the cloth cloth_black[2], boots rubber[2], skin skin_mid[2], belt clay_rust[1], pipe
  clay_rust[2], cap blood[1]. Span 105 -> 134.
- ROW "colours >= 2330": 1,743. THE WRONG RULER. 2,330 is the tenth percentile of his PROP TILES (96 px boxes, about
  6,000 opaque pixels); the thug's S still has 1,921 opaque pixels, so it could not hold 2,330 colours if every pixel
  were different. The style guide (DIRECTION, field 5 and classes.person) judges a person by the person class's floor,
  800, or 370 per 1,000 opaque pixels: the rig does this with --class person (round 1 rendered with the prop class by
  default). 1,803 colours against 711: OK.
- Also: the cap. blood[0] bleached to grey under the rig's up-face dust (the round-1 finding to DIRECTION); blood[1]
  holds a faded red. Sleeves and trousers share one cloth material and the cap's crown and brim one knit, so the thug
  is 8 materials (the person cap).
- RESULT: 0 of 8 out under the style guide; the craft rows OK (stray 4.0%, block 1, no banding, light 260.6 deg).
  Under the old prop band it reads 1 of 8 (the colour row, for the reason above). No breaks against the guide's rig keys.

## 2. The poacher (the next tier)
His NO that started this lane's rows: 'a trenchcoat and there's no trenchcoat action'. The answer is geometry that moves.
- THE COAT: saddle leather (clay_mustard[1]). Above the hip it is the body lifted 1.6 cm (sleeves to the wrist, a stand
  collar 2.8 cm). Below the hip it is a SKIRT built as 16 rings by 64 segments from 0.70 m to the knee (0.36 m on the
  1.5 m source body), flaring 1.16x side to side and 1.45x front to back for the stride, 8 mm thick with a rim. It is
  FOUR PANELS: open at the front from the waist down, a vent at the back below 0.56 m. Each panel is skinned to the
  pelvis at the top and to ITS OWN THIGH BONE toward the hem ((depth)^1.3 x 0.9), so the tails swing with the legs on
  the walk (see SE k1 to k4 on the sheet).
- KNEE LENGTH, NOT THE FLOOR: TRENCHCOATS ARE FOR BADASSES (8/27) reserves the floor-length coat; this is a hunting coat
  in the law's thigh-to-knee band.
- THE HAT: a wide field hat (tape_masking[2]), crown pinched and dented, brim drooping front and back, every vertex on the
  head bone: the tier's one silhouette feature (style guide field 10).
- THE REST: a bone shirt (clay_bone[2]) showing in the front opening, olive trousers (metal_painted[2]), boots (rubber[2]),
  tan skin (skin_deep[3]), a hatchet in the right fist (tape_grey[1]; a bearded wedge head turned away from the leg, on
  the hand bone). 8 materials.
- RESULT: 0 of 8 out under the style guide (colours 1,920 vs 734, span 141, top eight 0.9%, light top-minus-bottom 54,
  edge -14.6, grain 1.73); craft rows OK (light 266.7 deg). No breaks.

## The cycles (poacher)
1. Brim 1.9x the head's half-width, crown 1.0x: from the 45-degree camera the hat swallowed the head (a sombrero).
2. Brim 1.45x, crown 0.85x, set 3.5 cm down from the crown not 6. The head shows. Skin skin_light read pink under the dust;
   the front opening from the chest cut a jagged V through the body's coarse faces; the eye sockets followed the hat's line
   and sat under the brim.
3. Skin skin_deep[3]; opening from the waist down; the sockets at a fixed 7.5 cm under the crown whatever is on the head;
   the hatchet tape_grey (rust read pink). This is the sheet.

## Findings (routed; not this lane's files)
- TO DIRECTION: the eye sockets do not read under a brim from the 45-degree camera: a hat shades the face to one value.
  For a poacher that is in character; for a tier he must read by the face it is not. The person model with a skull and a
  brow (round 1's finding) is where eyes get depth.
- TO DIRECTION: the rig judges with --class prop unless told; a person rendered without --class person is read against
  his prop tiles' colour floor. Default --class from --real-height would stop the next lane making round 1's mistake.
- The test body's head is still a box (round 1). Every tier inherits it until CHARACTER's person model exists.

## Files
- tools/bohemia_cook3_the_tiers_through_the_rig.py (TIERS: THUG, POACHER; coat(), hat(), skin_to(), band())
- records/cook3/rig/thug.glb, poacher.glb (+ .json); records/target/cook3/rig/thug/, poacher/ (eight stills, the walk in
  eight at six keys, rig.json with card and card_guide)
- records/target/cook3/COOK3_THE_THUG_THROUGH_THE_RIG.png, COOK3_THE_POACHER_THROUGH_THE_RIG.png
- VOTE: cook3-the-thug-through-the-rig-10-18 (why updated, no vote on it yet), cook3-the-poacher-through-the-rig-10-18 (new,
  with sprites, class person and look, rule 114c).

## Next
MARKSMAN (leather with a strap, the rifle across the back on the spine bone), then RAIDER (mail as modelled rows),
LEADER (plate lames, gold trim), MARAUDER (plate with spikes).

REFERENCE CHECK: the twin is the game's own flat tier (records/cook3/enemy_tiers_repainted.png); DIRECTION's rendered man;
the style guide and palette; the card of numbers through skills/bohemia-pixel-art/scripts/check.py; analog horror AH-01.
No reference game.
