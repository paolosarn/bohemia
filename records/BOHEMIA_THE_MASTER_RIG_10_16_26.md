# THE MASTER RIG: ONE CAMERA, REAL METRES, THE MODEL TURNS (DIRECTION 10/16/26, row [the master rig])

Rule 108 ROUND EIGHT (b), rule 107 (eight drawn facings), rule 102 (true size), rule 105 (the floor). Sweep AI order (3).

## WHAT EXISTS NOW
- tools/bohemia_direction_master_rig.py: run with Blender's own Python, CPU only, headless (`python3 -m venv v &&
  v/bin/pip install bpy==4.2.0 numpy pillow`, then `v/bin/python tools/bohemia_direction_master_rig.py <model.glb>
  <out_dir> [--real-length m]`). It builds the scene every time from the script (the script IS the master file: a
  committed .blend would be a binary nobody can diff; the script makes the same scene byte for byte).
- 57 px a metre (CHARACTER's measurement: the live man is 98 px = 1.72 m). The model is scaled to its real length
  BEFORE the render; nothing is scaled after.
- One orthographic camera, tilted 45 degrees from straight down, facing north, never turned. ONE camera for every model.
- One sun from the upper left, above, and a dim sky fill.
- The model's ground centre snapped to a whole pixel; it turns 0, 45 ... 315 under the camera: N, NE, E, SE, S, SW, W, NW.
- Cycles on the CPU, 128 samples, no edge filter (this bpy build has no Workbench). About 9 seconds for eight facings.
- Post: every pixel snapped to the family's palette (skills/bohemia-pixel-art/references/palettes/prop.gpl, his
  colours); the silhouette's outer pixel 20% darker (the card's soft ring, never a black line); cropped.
- rig.json beside every render; gates/sprite_scale_gate.py refuses any rig.json off the ruler (57 ppm, ortho, tilt 45,
  turn 0, eight facings on disk), with a planted wrong one it must refuse first. 3 passed. For PLUMBER: into the suite.

## I INTENDED X 60 / Z 45, MEASURED, NOW DOING X 45 / Z 0 (rule 97)
The row's camera turns 45 degrees (an isometric diamond). His grid is square (the third votes, LOCKED) and his packs
are drawn front-on from 45 degrees above (the craft laws' 3/4 view; COOK FOUR's front gables). So the camera does not
turn, and tilts 45.

## THE PROOF: A CC0 TRUCK IN EIGHT FACINGS
reference/models/kenney/vehicle-truck-yellow.glb + Textures/colormap.png (Kenney, CC0, LICENSE.txt beside them).
Sheet: records/target/master_rig/DIRECTION_THE_MASTER_RIG_TRUCK.png (the eight at 1:1, a 98 px man, his car).
The rig's own loop, by eye on the sheet: (1) the truck came out all beige, its colour atlas missing (the .glb points
at an external Textures/colormap.png): fetched; (2) the shading was grain at 16 samples: 128; (3) clean now, the
eight facings at one size with no jitter, his palette.

## TWO THINGS THE RIG MAKES PLAIN
1. **TRUE SIZE IS THREE TIMES HIS PACK.** A 5.3 m pickup at the man's 57 px a metre is 302 px long; his own pack car is
   drawn 96 px. His packs are not at the man's scale (a car the length of a man's height). Rule 102 asks true size on
   the map; rule 105 says never under the pack. Both hold at 302 px. The open question is the fight board, where a
   house is a tile: that is COMBAT's and the coordinator's to place, and the rig takes any ppm with one flag.
2. **A TOY MODEL RENDERS A TOY.** Kenney's truck is low-poly and clean, so its render is clean and toy-like, however
   true the camera. Analog horror and his packs' grit have to be in the model (wear, dents, rust in the texture) or
   come after through the burnt-car recipes (records/BOHEMIA_SEE_WHILE_YOU_DRAW_10_13_26.md). The rig fixes scale and
   facings; it does not make a look.

Not on his tab (ROUND THIRTEEN: nothing final before the moodboard).
