# DIRECTION [the style guide] + [the look bible]: THE NUMBERS, WRITTEN DOWN, AND THE RIG READS THEM (10/18/26)

Rules 114a (the style guide is law), 115d (the look bible), the coordinator's research round two Section E. Opened by
the coordinator (rule 112); the chat before this one ran out of usage mid-round and left nothing committed, so this
round started from main. His words this round: 'I liked the robot that got made, I need you to know how to make
things that don't look vibecoded.'

## WHAT SHIPPED

| thing | file |
|---|---|
| THE STYLE GUIDE, the twenty fields with real numbers, the classes, the tests, the rig block (the look bible as numbers), three decisions against the research with the reason | records/target/BOHEMIA_STYLE_GUIDE.json |
| THE SOURCE PALETTE (field 4): 16 roles, 5 steps (glossy: 2 and a glint), hue walking cool into shadow and warm into light, 74 colours, every ramp 10 to 52 degrees of hue end to end, nothing black | records/target/BOHEMIA_STYLE_PALETTE.json, built by tools/bohemia_direction_style_palette.py |
| THE RIG, ROUND FOUR: every setting read from the guide; a calibration cube (must measure 57 px, measures 58, inside the 1 px tolerance) and sphere (the screen light measures 155.4 degrees) every run; a material-ID pass; motion blur, DoF, look, exposure, gamma, dither spelled out; rig_settings and breaks written to rig.json; --class reads the card under the guide; --seed gives a second wear; --rejudge re-reads a render without Blender | tools/bohemia_direction_master_rig.py |
| THE FIRST PROP MODELLED HERE, from the palette: a 55-gallon drum at true size, dent, two hoops, a bleached lid, the fill hole, rust grime at the base, an X of duct tape | tools/bohemia_direction_model_drum.py, reference/models/bohemia/oil_drum.glb (ours, CC0) |
| THE HAND-FINISH (Section B adapted to our look): B5 fireflies, B6 selout by the measured light, B7 staircase flags, B8 three clay highlights, B9 one glint per eye | tools/bohemia_direction_hand_finish.py, records/target/direction_style_guide/robot/finish.json |
| THE GATE: 8 planted wrongs refused first; the file, the palette, the rig's literals, every round-four render, the hand-finish, the sheets, a built model paints from the palette | gates/style_guide_gate.py |
| THREE SHEETS in VOTE | records/target/direction_style_guide/DIRECTION_THE_LOOK_BIBLE_EVERYTHING_THE_SAME.png, ..._STYLE_GUIDE_DO_AND_DONT.png, ..._HAND_FINISH_RAW_AND_FINISHED.png |

## THE THREE CALLS I MADE AGAINST THE RESEARCH (all in the guide, decisions_against_the_research)

1. **No stepped toon shading.** Round two's C5 says render through a Constant colour ramp of palette steps. His YES
   on 10/17 was on the smooth clay render (robot 5,871 colours, truck 13,047). A stepped ramp is the cel-toy look,
   a new look he never saw. The hue shift the ramp was for now lives at the source (the palette) and in the light
   (warm sun, cool sky fill). The stepped version is field 7's DON'T so he can see what was turned down. Also: this
   box's Blender has no EEVEE, and Shader-to-RGB is EEVEE only.
2. **No output colour caps.** Round one's example (12 a character, 6 a prop) is limited-palette art; his packs carry
   2,330 to 6,600 colours a tile (TUNING and MODS both measured it). The cap is on the source (materials per model,
   every base colour a palette step); the output is held to the card's floors.
3. **Small true-size things are judged by rule 105 and by density.** The card's 96 px long side and 2,330 colours
   were measured on pack tiles all drawn in one 96 px box. A 0.88 m drum at 57 px a metre is 42 x 79 and 2,268
   body pixels; rule 105 names a prop's floor 29 x 36, and his props hold 370 colours per 1,000 px at the tenth
   percentile. The drum holds 594. (Puppet jitter is also OFF until ANIMATION rules it: it is his 'tweaking'
   symptom by design.)

## MEASURED (the card under the guide, S still)

| render | colours | card under the guide | the row out |
|---|---|---|---|
| robot (his maquette, Idle passing pose) | 5,860 | 1 of 8 | grain 2.26 (bar 2.22) |
| truck (his maquette, prop snap 0.6) | 13,087 | 1 of 8 | grain 3.3 (the frost-dust, below) |
| man (CesiumMan, 1.72 m) | 1,412 | 1 of 8 | light: top minus bottom -7.5 (his white hood is lit, his dark boots are not: a model problem) |
| fox at a dire wolf's 1.9 m | 980 | 1 of 8 | value span 110 |
| drum (made here) | 1,348 | 1 of 8 | grain 2.36 |
| drum, wear seed 2 | 1,297 | 1 of 8 | grain 2.53 |
| DON'T: sun from below | 25,715 (all files) | 3 of 8, BACK, light measured 247.8 | as it should |
| DON'T: wear 0 (clean) | | 3 of 8, BACK | as it should |

The drum took three goes, all in the model, none in the pixels: round one was BACK 4 of 8 (value span 101 against
118; a mid-value teal object with a rust lid). A dark fill hole and base grime did not move the span (the card
reads the 5th to 95th percentile, so one dark spot is nothing); a sun-bleached bone lid did (152). That is the lesson
for every cook: the span is AREA at both ends, not a dark pixel.

## THE HAND-FINISH, HOW BIG IT REALLY IS

3,592 of 49,283 body pixels on the robot's eight facings moved: 7.3 percent. Per facing 6.6 to 8.5 percent. Fireflies
0 to 5 a facing (the rig is clean at 128 samples). The glints first landed on the brow bars, because the robot's brow
and lens are one material; the eye step now takes the lower, darker half of the eye cluster, and every front facing
carries two glints on the glass. Section B's last word stands: the look comes from the rig; the hand is a tenth.

## WHAT THE EVERYTHING-THE-SAME SHEET SHOWS THAT IS NOT YET RIGHT (the three differences on its card)

1. SIZE: at true size the truck is 320 px long; his pack car on COMBAT TWO's 1:1 board is about 150. Rule 102 draws
   the world's size; his packs drew every car in one box. COMBAT TWO already places pack props at the integer scale
   nearest real size; the cars in his packs are the ones that are small.
2. THE MAN: the free test model's white-and-blue suit comes from no table of ours: the sheet's one TWO WORLDS IN ONE
   FRAME. CHARACTER's runway bodies through the rig replace it (rule 115c).
3. THE DUST on the yellow truck reads as frost. The source pass's dust colour (0.66, 0.60, 0.50) is paler than a
   bright paint; on a pale body, wear must go darker (rust, grime), never paler. Routed to the next rig round as a
   rule: dust value capped at the base's value on bright materials.

## ROUTED

- PLUMBER [the not vibe coded gates]: read thresholds from the guide's tests[].reads keys (MODS' shape); G1 to G10 and
  D1 are named there; D1 is built (style_guide_gate.py).
- TUNING: the twenty numbers are in one file now; each becomes a row of the one table with its FEEL line.
- CHARACTER, COOK THREE: pass --class person; build models' base colours from the palette's skin and cloth roles.
- ANIMATION: puppet jitter is yours to rule (0 cm in the guide); field 15 carries your grid.
- COOK, COOK FOUR: props through the rig with --class prop and two wear seeds (field 12).
- UI: field 14 names your fonts, materials and the never-fonts; the G10 leg is yours.

## REFERENCE CHECK (the 9/4 duty)

Compared to the world: every render sits on COMBAT TWO's 1:1 board of his pack tiles in the sheet; the twin on each
VOTE card is his own art (the abandoned car, the robot sheet he chose). No reference game cited; the claymation shows
and the ten analog horror games are genre studies only (rule 115d).

## THE GRAIN ROW IS THE ONE THAT KEEPS FAILING (five of six candidates)

Every candidate's one row out is the grain (2.26 to 3.3 px a run against his 2.22), except the man (light) and the fox
(span). The rig's grain is 28 a metre, about two pixels at 57 px a metre; on a small sprite the wear masks make runs
longer. That is the next rig round's one number, not this round's: field 11 carries grain_run_px [1.6, 2.22] and the
gate reads the card, so a fix shows up as a row turning OK, nothing else to change.
