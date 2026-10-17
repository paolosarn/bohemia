# THE MASTER RIG, ROUND TWO: THE MODEL MOVES, AND THE FACE COMES FROM THE BODY (DIRECTION 10/17/26, row [the master rig])

Rule 110 (the big swing, no check-in), rule 108 ROUND EIGHT (b), rule 107 (eight drawn facings, each with an idle and a
step), rule 102 (true size), AN ENVELOPE RAMPS SLOWER THAN THE GRID (twelve keys a bar, nothing between two keys is
drawn), ONE ID ONE WHOLE PERSON (the face and the body are one person). Round one (b1383291) rendered a still truck;
it unblocked nobody, because the three lanes waiting on the rig (ANIMATION [the beast in eight], PORTRAIT, COOK THREE)
need a body that TURNS AND MOVES and a HEAD that is the same body's. This round is that.

## WHAT EXISTS NOW
- tools/bohemia_direction_master_rig.py, round two. Same camera (57 px a metre, ortho, tilt 45, never turned, one sun
  upper left), plus:
  * `--clip <action>:<keys>` renders the model's own glTF animation at the drawn keys only, phase (i + 0.5) / keys,
    exactly engine/bohemia_quadruped.js keys(clip): a walk is 2 beats = 6 keys, an idle 4 beats = 12 keys, 120 BPM,
    three keys a beat. In all eight facings. Nothing between two keys is rendered, because nothing between two keys
    is ever drawn.
  * `--portrait <px> --head-m <m>` renders the SAME model's head front-on and the two front three-quarters (S, SE,
    SW), camera tilt 80, at the pixels per metre that put the head at <px> (96, PORTRAIT's floor). portrait.json
    beside the body's rig.json names the same model file, so the gate can hold ONE ID, ONE WHOLE PERSON.
  * `--real-height` scales a standing thing by its height (a man), `--real-length` by its long side (a car, a wolf).
  * ONE crop box per model across every facing and every key (rig.json crop_box_px, ground_px), so a clip's frames
    never jitter against each other.
  * `--family none` for a family with no measured palette yet (people, beasts: the packs hold none).
- gates/sprite_scale_gate.py, round two legs: the stretch and the base turn (below), every clip a whole number of
  beats at three keys a beat with 8 x keys files on disk and every sampled frame inside the clip; a portrait from the
  same model, at or over 96 px, ortho, S/SE/SW on disk. Plants a wrong clip and a wrong portrait first. 9/0.
- reference/models/khronos/: Fox.glb (model CC0 by PixelMannen; rig and the Survey/Walk/Run clips CC BY 4.0 by
  tomkranis; the model ANIMATION named as its stage 1), CesiumMan.glb (CC BY 4.0, Cesium; a mannequin with their
  logo, the pipe's proof and never the game's man). LICENSE.txt beside them.
- Run: `python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow` (bpy 4.2 needs Python 3.11; on 3.13 pip
  only offers bpy 5.x, measured), then
  `v/bin/python tools/bohemia_direction_master_rig.py reference/models/khronos/Fox.glb records/target/master_rig/fox --real-length 1.5 --family none --clip Walk:6 --clip Survey:12`
  (152 renders, about 70 s on this CPU) and
  `... CesiumMan.glb records/target/master_rig/man --real-height 1.72 --family none --clip Anim_0:6 --portrait 96 --head-m 0.24`.
  Sheets: `python3 tools/bohemia_direction_master_rig_sheet.py <dir> <png> [--wolf records/target/master_rig/game_wolf] [--car]`.

## THREE THINGS THE FIRST RENDER GOT WRONG, MEASURED, FIXED (rule 97; the rig's own loop, by eye on a look sheet)
1. **NORTH AND SOUTH WERE SWAPPED.** A glTF's front comes into Blender facing -Y, straight at the camera, so facing 0
   was a fox walking INTO the lens. The base turn is now 180: N walks away, S comes at you, E heads right. On the
   sheet and in rig.json (base_turn_deg).
2. **A STANDING MAN WAS 61 PX, NOT 98.** A camera tilted 45 foreshortens height by cos(45); his packs and CHARACTER's
   live man draw every standing thing at FULL height over a ground seen from above (the 3/4 cheat every pixel pack
   makes; the ruler was measured on the sprite, 98 painted px = 1.72 m). The model's height is now stretched
   1/cos(45) = 1.414 before the render (z_stretch in rig.json, the gate holds it). The truck re-rendered the same way
   so every rig on disk is one rig. The portrait has no stretch: a face is drawn front-on.
3. **THE RULER'S BOX HELD A STRAY SPHERE.** This bpy's glTF import drops a 2 m icosphere beside every model (42
   verts, no parent), and it was inside the bounds, so the man read 1.3 m wide and rendered small. It is removed
   before anything is measured. (So the truck's round-one numbers carried it too; they are superseded by today's.)

## THE PROOF, THREE SHEETS AT 1:1 (records/target/master_rig/)
- DIRECTION_THE_MASTER_RIG_FOX.png: the fox at a grey wolf's 1.5 m nose to tail (the beast law: a dire wolf is a
  heavier grey wolf, one flag away), eight stills, WALK in SE/S/E at 6 keys, SURVEY (the idle) at 12 keys, beside the
  game's own dire wolf today (engine/bohemia_quadruped.js, SE, walk 6 and idle 12 at 112, the placeholder a beast
  replaces). MEASURED: the fox is 86 px long at true size against the placeholder's ~96; its walk keys differ by
  324 to 452 silhouette pixels from key 0 (the stride is on the drawn keys, not between them); the idle breathes
  96 to 395.
- DIRECTION_THE_MASTER_RIG_MAN.png: a 1.72 m man, eight stills (mid-stride: the still is the clip's first frame;
  a rest pose needs a model that has one), the walk at 6 keys, and his head at 96 px in S, SE, SW. MEASURED: body
  sprite 66 x 129 (98 px of height plus the stride's depth seen from above), 31,728 colours unsnapped; the head
  164 x 131 at 400 px a metre, 7,613 colours.
- DIRECTION_THE_MASTER_RIG_TRUCK.png: round one's truck on round two's rig (312 x 291, 91 colours in his prop
  palette), beside his 96 px car.

## WHAT THIS UNBLOCKS, AND WHAT IT DOES NOT
- ANIMATION [the beast in eight]: the fox is its own stage 1 model, and it now comes out in eight facings with a
  walk at 6 keys and an idle at 12, cut with one box, the ground pixel named. The turn it owed is rendered. A dire
  wolf is `--real-length 1.5` and heavier paint; the bite is still a head clip (no jaw bone), as it wrote.
- PORTRAIT: a pipe exists: the head is a crop of the SAME model at 96 px, front and two three-quarters. The face it
  needs is a model WITH a face; the mannequin proves the pipe, not the face.
- COOK THREE / CHARACTER: a person in eight at the ruler's 98 px, with a stride. The look is NOT here (round one's
  second finding stands: a toy model renders a toy); the runway and the grit are in the model or come after through
  the recipes. The packs still hold no people; this is the route the packs do not have.
- NOT DONE, NAMED: palette snap for people and beasts (no measured palette; --family none keeps the render's
  colours); a rest pose for the still; a model with a real face; the free runner (this ran on the venv, CPU).

Not on his tab as FINAL (ROUND THIRTEEN: nothing is final before the moodboard). Registered in VOTE as a PLACEHOLDER
with its twin (direction-the-rig-moves-10-17), like COOK FOUR's rows, so the round ends with a real thing in the tab
(rule 22).
