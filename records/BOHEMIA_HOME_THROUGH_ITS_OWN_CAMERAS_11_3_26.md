# HOME, 11/3/26: YOUR SETTLEMENT THROUGH ITS OWN CAMERAS (rule 354; ask lines 352, 356, 368, 369)

His pick (11/3): "it was always going to be A". His idea on top: your settlement, and only yours, is seen through its own security
cameras in PS1-era footage, the loading screen's look and pipeline, the cameras upgrading through the acts; the rest of the game stays at
45 degrees; it works the same (tap a lot). "Be token friendly." His words in full: records/BOHEMIA_PAOLO_YOUR_SETTLEMENT_THROUGH_ITS_OWN_CAMERAS_11_3_26.md.

## STEP 1, THE LOOK TEST (this push)
Tool: tools/bohemia_home_cameras_11_3_26.py (render under Blender; post and card in any Python). Pictures: records/target/home_cameras/
(cam<N>_<tall|wide>_<frame>.png at the source size, lots.json, the VOTE card vote_look_test.webp). VOTE card: home-cameras-look-test-11-3.

THE BLOCK, BUILT ONCE IN 3D FROM THE KIT WE HAVE: a walled Las Vegas cul-de-sac 60 m square. An 8-inch block wall 1.8 m high runs all the
way round, with a pilaster every 6 m and a rolling steel gate in the south wall. One drive comes in to a turning circle. Round it stand five
of COOK's ranch houses (garage, porch, plain, wing, carport; built by the modeller exactly as the town screens build them). Behind them,
backyards out to the wall. COOK PROPS' empty pool is cut into the ground the way COOK PROPS cuts it, with its swing and trampoline. A burned
lot with rubble and a wreck. The game's truck, trailer, shed, drums, tyres, propane, street light and stop sign. The floor tool's ground
(caliche, the asphalt drive and circle, a concrete walk ring, rough backyards). The master rig's source pass, dents and sun. Only the block
wall and the gate are boxes, like every town's walls.

THE TWELVE LOTS (metres on the 60 m square; each is a box, and its outline is projected into every camera as the place you tap):
1 THE GATE, 2 WEST VERGE, 3 THE DRIVE, 4 HOUSE SW, 5 HOUSE SE, 6 HOUSE W, 7 HOUSE E, 8 HOUSE N, 9 THE CIRCLE, 10 WEST YARDS,
11 THE BURNED LOT, 12 THE POOL YARD.

THE THREE CAMERAS (rule 354(e)), placed where real ones go:
- CAM 1 THE GATE: a 7 m pole behind the gate's east pier, looking up the drive.
- CAM 2 THE YARDS: a pole in the pool yard's north-west corner, looking down the backyards. The north house's eave was tried first and
  showed only two or three lots.
- CAM 3 THE ROOFS: a 14 m pole in the north-east corner, looking over the roofs.
Each was aimed by measuring, not by eye. A lot counts as "a thumb wide" when its ground plus its height (a house's roof) covers at least 11
percent of the picture both ways (44 points of a 390-point phone).

| camera | upright 9:16 | sideways 16:9 |
|---|---|---|
| CAM 1 THE GATE | 1, 2, 3, 4, 9 | 1, 2, 3, 4, 5, 9 |
| CAM 2 THE YARDS | 4, 6, 10, 12 | 4, 6, 10, 12 |
| CAM 3 THE ROOFS | 3, 5, 7, 8, 9, 11 | 5, 7, 8, 9, 11 |
Every one of the twelve lots is a thumb wide in at least one camera.

ACT ONE'S LOOK, MADE AT THE SOURCE (rule 354(e): a dying system):
- RENDERED SMALL: 180 x 320 upright and 320 x 180 sideways (the PS1 era drew 320 x 240), at 5 samples with no denoiser. The grain is the
  render's own, and it moves from frame to frame (a new seed each frame).
- THE FEEDS' OWN CCTV TAPE: the starred loading screen's tape() for its scene B (mono, interlace, the head-switching tear), imported and
  never edited, after the rig's population snap.
- THE PS1'S COLOUR DEPTH: 32 levels a channel through a 4 x 4 ordered dither.
- THE CAMERA'S OWN TEXT: drawn in a bitmap font at the source size. The time stamp is wrong: 01-01-80, because the clock reset when the
  power died.
- CAM 3 IS THE DYING ONE: it drops a stop and a half on one frame, at the render.
- SIX PICTURES A SECOND (the feeds' CCTV rate), shown at whole multiples of its pixels and never smoothed.

## WHAT THIS IS NOT YET
Not in the game. It is the look, for his eye. The pieces (step 2), the screen (step 3) and the acts (step 4) follow, each its own push.
The pieces are modelled once and rendered from each camera as their own layers (same sun), so a built piece appears in every camera that
sees its lot.
