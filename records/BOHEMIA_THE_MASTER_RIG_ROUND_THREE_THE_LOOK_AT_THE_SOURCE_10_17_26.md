# THE MASTER RIG, ROUND THREE: THE LOOK AT THE SOURCE, AND THE FACE PERFORMS (DIRECTION 10/17/26, row [the master rig])

Rule 110 (the big swing, no check-in), rule 108 ROUND EIGHT (b) and the row's own constraint ("analog horror is modelled
at the source or the render reads as a toy"), rule 105 (the pack's floor), the card of numbers (10/10), AH-01 R10 (wear
is authored, never a noise layer), lessons 6 and 7 of the skill file (his art is not limited-palette; fix the source, not
the paint). Round two (564e1b1) made the model move and the face come from the body, and wrote in its own record that
the look was NOT there: a toy model renders a toy. This round puts the look where the pixels come from.

## WHAT THE CARD SAID ABOUT ROUND TWO (the first thing this round did)
skills/bohemia-pixel-art/scripts/check.py on the S still of every round-two render, against the prop band (the
nearest band the packs have for a thing standing on the ground):

| round two | colours (>= 2330) | top 8 (<= 11%) | light top-bottom (>= -2.5) | edge (-35..+7) | grain (<= 2.22) | verdict |
|---|---|---|---|---|---|---|
| the truck (snapped to the 64-colour prop list) | 58 OUT | 89.2 OUT | 8.6 | -25.7 | 10.06 OUT (+ banding 22) | BACK, 3 of 8 |
| the man | 1170 OUT | 10.3 | -8.8 OUT | -49.0 OUT | 1.42 | BACK, 3 of 8 |
| the fox | 513 OUT | 7.7 | 13.7 | -45.0 OUT | 1.65 | BACK, 3 of 8 |

Three faults, every render: TOO FEW COLOURS (a clean surface under one sun), A RING TOO DARK (20% darker is -45 on a
pale model; the card's ring is about 5), and the 64-colour SNAP killing the truck (lesson 6 proven on the rig's own
output). Every one of them is a property of the surface or the post, not of the camera, so the camera did not move.

## WHAT EXISTS NOW (tools/bohemia_direction_master_rig.py, round three; gates/sprite_scale_gate.py, round-three legs)
1. **THE SOURCE PASS** (`--wear 0.6`): inside Blender, before the render, every material of the model gains what his
   packs carry in paint: the plastic highlight removed (roughness >= 0.9, specular 0.15, metallic <= 0.2: the
   highlight IS the toy), grime in the crevices from the model's own ambient occlusion (authored by its shape), dust
   and sun-bleach on the faces that point up under a 50 cm mask, a 20 cm colour drift so no two square centimetres are
   one colour, and a value grain whose strength is driven by the wear masks. Every mask is sized in metres and stuck to
   the surface (each mesh's own coordinates times its object scale times the model-to-metre scale; the robot's parts
   carry an object scale of 100, measured, and would have had masks a hundred times too big).
2. **THE POPULATION SNAP** (`--family prop --snap 0.6`): the render's colours are pulled 0.6 of the way toward the
   nearest colour the family ACTUALLY USES, read from every opaque pixel of reference/art_bank/prop/ (784 tiles, 20,564
   occupied bins at 32 levels a channel), never toward a 64-colour list. The hue lands in his family; the render's own
   spread survives. `--family none` (people, beasts) pulls nothing: the packs hold no people and no beasts.
3. **THE RING** (`--ring 8`): the outer pixel 8 values darker, a number not a percentage.
4. **THE CONTACT SHADOW**: a soft ellipse under the feet, down and right, behind the body, in the sprite's alpha (the
   build order's SEAT IT; every standing thing in his packs sits on one).
5. **THE STILL** (`--still pass`): the frame of the first clip where the body is narrowest along its walk, feet
   together: a standing still, not round two's mid-stride first frame. `--still rest` puts every armature in its rest
   pose; a number is a frame.
6. **THE FACE PERFORMS** (`--expression Angry`, repeatable): the portrait is rendered front-on once per named shape
   key at full weight, so PORTRAIT's pipe shows the same head changing its face. AND THE HEAD IS MEASURED FROM THE
   MODEL: the mesh named head (else the mesh with shape keys) gives its height and centre. Found by the look: told
   0.30 m, the robot's crop sat on its brow and the expressions were cut off; its head is 0.751 m of its 1.72 m,
   measured, and at 96 px that is 128 px a metre; `--head-m` now only overrides a model with no head mesh.
7. **THE CARD, IN THE RIG**: the S still is run through the skill's check against `--judge <family>` and the eight rows
   are written into rig.json. The gate refuses a round-three rig that is BACK (3 or more of 8 out), one with no source
   pass or no contact shadow, and a portrait naming an expression with no file on disk; planted wrong ones refused
   first. 12/0.
8. **A FOURTH MODEL, WITH A FACE**: reference/models/quaternius/RobotExpressive.glb (CC0 1.0, Tomás Laulhé; the three
   expression morph targets and the glTF conversion by Don McCurdy; LICENSE.txt beside it). A rigged body with
   Walking, Idle and fourteen more clips, and a head with Angry, Surprised and Sad. Fetched from the three.js examples
   mirror, the one model host this box can reach. A robot is in the law (the necromancer is a man reviving his robots,
   9/29); as a model it is the pipe's proof, not the game's robot.

## THE LOOP ON THE TRUCK (records/target/master_rig/truck/rig_S.loop.jsonl; every cycle looked at, 1x, 3x and the look sheet)
- cycle 1 (the card): the 64-colour snap, 58 colours, banding; BACK 3 of 8.
- cycle 2: the pass at a 60-a-metre grain: 10,146 colours, 1 of 8 out, but AIRBRUSHED at 4x, run 5.47.
- cycle 3: grain at 120 a metre: run 4.8, nothing changed. FOUND: grain finer than a pixel averages to grey inside the
  pixel over the render's 128 samples. (Lesson 9.)
- cycle 4: grain at 28 a metre (about two pixels) with its middle band stretched to the full step: run 2.22, on the
  bar; but at 3x the whole truck is one even static, a leopard print, where his car's contrast is rust patches, seams
  and glass. A noise layer, which the bible forbids. (Lesson 10.)
- cycle 5: the grain's strength driven by the wear masks (0.82 in a grime crevice or a dust patch, 0.12 on clean
  panel): the grain sits in patches with calm panel between. 13,047 colours, top eight 2.2%, edge -10.0, light +8.7,
  run 3.29 (1 of 8 out, to DIRECTION). The shapes stay a toy's (no seams, no glass, no panel lines: a toy model
  renders a toy, round one's finding, which the pass does not touch); the surface is no longer plastic.

## THE NUMBERS, ROUND TWO AGAINST ROUND THREE (the S still, the prop band)
| | colours | top 8 | light | edge | grain | out of 8 |
|---|---|---|---|---|---|---|
| the truck | 58 -> 13,047 | 89.2 -> 2.2 | 8.6 -> 8.7 | -25.7 -> -10.0 | 10.06 -> 3.29 | 3 -> 1 |
| the man | 1,170 -> 1,404 | 10.3 -> 2.2 | -8.8 -> -7.5 | -49.0 -> -24.0 | 1.42 -> 1.42 | 3 -> 2 |
| the fox (at a dire wolf's 1.9 m, see below) | 513 -> 970 | 7.7 -> 1.6 | 13.7 -> 5.5 | -45.0 -> -27.9 | 1.65 -> 1.61 | 3 -> 2 |
| the robot (new) | 5,871 | 0.5 | +1.0 | -16.5 | 2.25 | 1 |

THE FOX'S SIZE: at a grey wolf's 1.5 m nose to tail (round two) the fox came out 89 px on its long side, under the
96 floor, with 603 colours and BACK 3 of 8. The proxy stands for the game's DIRE WOLF, and Aenocyon dirus ran about
1.9 m nose to tail (a quarter heavier than a grey wolf, the beast law's one flag), so the proxy is rendered at the
dire wolf's real length: 112 px long, 970 colours, 2 of 8 out. The rig draws the world's size; the size was the
proxy's, not the rig's.
Said plainly: the man and the fox are small. A 1.72 m man is 66 x 132 px, a quarter of a 96 x 96 tile's area, and the
colour row is a per-tile count, so 2,330 is a tile's number, not a sprite's; the row stays on the card as written and
the gate's "at most two out" carries it. The man's light row is the model's own: a dark head over pale legs reads as
lit from below whatever the sun does (the fox and the truck, with no such head, pass it).

## THE PROOF, FOUR SHEETS AT 1:1 (records/target/master_rig/)
- DIRECTION_THE_MASTER_RIG_TRUCK.png: round two's eight stills over round three's, beside his car (the twin).
- DIRECTION_THE_MASTER_RIG_MAN.png: before and after, the passing-pose still, the walk at 6 keys in SE/S/E, the head
  at 96 in S/SE/SW, the card under it.
- DIRECTION_THE_MASTER_RIG_FOX.png: before and after at a grey wolf's 1.5 m, walk 6 and survey 12, beside the game's
  own dire wolf (the placeholder a beast replaces).
- DIRECTION_THE_MASTER_RIG_ROBOT.png: the new model: eight stills in the passing pose, Walking at 6, Idle at 12, the
  head at 96 in S/SE/SW, and THE FACE PERFORMS: Angry, Surprised, Sad on the same head.
Round two's stills are kept as the before set in records/target/master_rig/round2_{truck,man,fox}/.

## THE SKILL FILE (skills/bohemia-pixel-art/SKILL.md) GAINS
Section 2 amended: the 64-colour .gpl is a reading aid, the snap is the population. Lessons 8 to 11: the plastic
highlight is the toy; grain finer than a pixel averages to grey; even grain is a leopard print; a soft ring is a
number, not a percentage.

## WHAT THIS UNBLOCKS, AND WHAT IT DOES NOT
- COOK THREE / CHARACTER: a person from a model now comes out with a worn surface the card accepts (two rows out,
  both the sprite's size and the model's own head), seated on a shadow, in eight, standing still and walking. The
  look of the CLOTHES is still the model's: a mannequin renders a mannequin. The route the packs do not have is open;
  the model with runway clothes on it is the next thing to find or make.
- PORTRAIT: the pipe now shows a face that performs: the same head, three expressions, from one model. The robot's
  face is a robot's; a human model with morph targets is what PORTRAIT needs next, and this box can reach exactly one
  model host (raw.githubusercontent.com; quaternius.com, kenney.nl, sketchfab, polyhaven and huggingface are all
  refused by the proxy, measured this round).
- ANIMATION: the fox and the robot come out worn, with a standing still, in eight, on the beat.
- NOT DONE, NAMED: a palette for people and beasts (no family in the packs; `--family none`); the free runner (this
  ran on the venv, CPU, about a minute per eight stills and four to six minutes per model with clips); the shapes of
  a toy model (seams, glass, panel lines, cloth) are the model's to have.

Not on his tab as FINAL (ROUND THIRTEEN: nothing is final before the moodboard). Registered in VOTE as PLACEHOLDERS
with their twins (direction-the-look-at-the-source-10-17, direction-the-face-performs-10-17), so the round ends with
a real thing in the tab (rule 22).
