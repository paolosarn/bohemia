# BOHEMIA ADDENDUM — TWICE THE PIXELS ON THE PEOPLE (Paolo 8/14/26,
# LOCKED, watching a cutscene: "the character models need to have twice as
# many pixels on them and then the black border around the character has
# to be thinner, like half as thin... the tiles are higher quality than
# the people right now... more pixels available for clothing... set up a
# game plan so everything is the same progress, nothing has to reset, and
# it will automatically know to make everything work, animations,
# clothing, hair included.")

## 0. HE DIAGNOSED IT EXACTLY, WITHOUT SEEING A LINE OF CODE
He said the tiles look higher quality than the people. That is not a
feeling, it is literally what the build does:
- THE RIG IS AUTHORED AT 56 PIXELS. Proof: `drawChar` in the alpha
  computes its skeleton scale as `const S=W/56`.
- IT IS ALREADY BEING DOUBLED AT DISPLAY TIME, ALGORITHMICALLY. `G.hd`
  defaults to **true** and every frame runs through `Scale2x` (an
  edge-preserving pixel-art upscaler) on its way to the screen.
- So the people on screen are a 56px drawing MACHINE-ENLARGED to 112,
  while the tiles are authored natively at their real size. Upscaled art
  next to native art is exactly the quality gap he saw.

## 1. THE RULING (LOCKED)
THE CANONICAL CHARACTER RESOLUTION DOUBLES: 56 -> 112. Native, authored,
not upscaled. Everything that wears the rig comes with it: bodies,
clothing, hair, faces, animation.

## 2. HIS TWO ASKS ARE ONE OPERATION (the good news)
The black border is NOT painted into his art — the renderer DERIVES it
(its own comment: "The renderer outlines a limb's outer AND inner
column"). At 56px that outline is one source pixel, which Scale2x doubles
to two screen pixels. THAT is the thick border he is looking at.
So: author at 112 and keep deriving the outline at ONE pixel, and the
border is automatically HALF AS THICK relative to the body — exactly what
he asked for, for free, as a consequence of the same change. There is no
separate outline project.

## 3. THE GAME PLAN — WHY NOTHING RESETS (his actual question)
NOTHING IS RE-AUTHORED AND NOTHING IS RE-JUDGED. The migration is one
deterministic transform plus a switch:
1. HIS PAINTED PIXELS DOUBLE EXACTLY. Each source pixel becomes a 2x2
   block. This is lossless, reversible, and adds no interpretation —
   which is what keeps RIG LAW intact: his regions are not reshaped,
   meshed, mirrored or "fixed", they are the same drawing at twice the
   grid. The SACROSANCT rule is satisfied by construction, not by care.
2. EVERY COORDINATE MULTIPLIES BY 2. Bones, region maps, garment anchors,
   hair anchors, animation keyframes, offsets. One mechanical pass, no
   judgement calls. An animation authored yesterday plays identically
   tomorrow.
3. SCALE2X GETS TURNED OFF. Once the source is native 112, the display
   upscale is redundant — and removing it is where the visible quality
   jump actually comes from. It also gives CPU back every frame.
4. THE OUTLINE IS RE-DERIVED AT 1PX (section 2). Not doubled.
5. THEN DETAIL LANDS PROGRESSIVELY, PER ITEM, FOREVER. Day one, every
   garment, hairstyle and clip already works at the new resolution and
   looks no worse. From then on, each item can be refined into the new
   pixels as its lane cooks — a jacket gets a real collar, a face gets a
   real eye, a fade can finally blend into skin tone (the [UNBUILT] item
   in the hair-and-shape law that 56px could not hold). NOTHING WAITS FOR
   ALL OF IT. That is what makes this "same progress, nothing resets"
   rather than a reboot.
THE ORDER MATTERS: the transform ships FIRST and alone (everything looks
the same but sharper, nothing regresses), and new detail is a separate
stream of normal cooks after it. A lane that mixes step 5 into steps 1-4
turns a provable migration into a redesign, and that is how this goes
wrong.

## 4. WHY THE MACHINE CAN PROVE NOTHING BROKE
This repo has EIGHTEEN gates that measure character scale, rig fidelity
and canvas ratios (rig_is_law, rig_no_drift, bone_scale, clothes_follow,
head_follows_rig, face_feature_scale, hair, bodyvar, canvas_scale,
canvas_memory, human_scale, scale_truth, render_like_the_rig and kin).
They exist because scale bugs have burned this project repeatedly — and
that makes them the migration's safety net: the doubling is correct when
every one of them is green against re-blessed numbers. This is the rare
change where the gate suite is the proof, not the obstacle.
RE-BLESS, DO NOT DELETE: canvas_scale_gate pins integer display ratios
(and it learned on 8/6 to measure the CONTENT box, borders included) —
every declared width doubles and must stay integer, including the hair
picker tiles and the 8-facing spin bar. A gate whose number changed for a
ruled reason gets a new number and a comment saying whose ruling changed
it. A GATE MUST NEVER OUTRANK A RULING (8/1).

## 5. THE ONE REAL RISK, AND IT MUST BE MEASURED NOT ASSUMED
Doubling the grid QUADRUPLES the pixels per frame. The frame caches
(HD_CACHE holds 768 frames) and every character canvas grow with it,
against a measured ~224MB iOS ceiling. MEASURE FIRST, on the real phone
profile, before the flip: canvas_memory_gate exists for exactly this.
Offsetting it: dropping Scale2x removes a per-frame CPU cost and the
cache can hold native frames instead of upscaled ones. If the numbers
come back tight, the answer is cache budget, not a smaller rig — the
resolution is ruled.

## 6. ROUTING — THE CHARACTER LANE OWNS THIS (his question answered)
He asked whether to tell the ART chat or the CHARACTER chat. THE ANSWER
IS CHARACTER, and it is not close: the rig is that lane's law
(laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md), and bodies, clothing,
hair and animation are all its systems. ONE SYSTEM, ONE SESSION — this
must not be split across two chats or they will fight over the same
files.
- CHARACTER: the whole migration (sections 3-5), then progressive detail.
- ART: NOT involved in the rig. Its tiles are already native and are the
  quality bar the people are being raised to meet. If a garment cook
  later needs bank pixels, normal REUSE-FIRST applies.
- SOUNDS/RUN/COMBAT: unaffected — the combat surface consumes the same
  rig, so it inherits the change; COMBAT re-runs combat_scale_gate after
  the flip and reports, nothing more.
DEMO: this is NOT demo-blocking and must not displace the demo P0s
(RUN P0-DOOR, SOUNDS P0-WALK). It is the biggest LOOK upgrade available
and it is safe to land in parallel because it changes no gameplay wiring.
If the migration is not flipped before the demo, the demo ships on the
current rig and loses nothing.
