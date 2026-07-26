# BOHEMIA ADDENDUM: ONE PACKAGE LAWS
Date: 7/2/26. Status: LOCKED by Paolo.

## 1. ONE PACKAGE LAW (locked)
Nothing we build is standalone. Every tool, module, and view speaks to and translates to every other one. If Paolo changes something in the rig, it changes in the character view, the animation view, the ramps, the combat, everywhere. When coding ANY feature, do not just do the task asked: build the engine plumbing so every similar task is seamless and consistent under the same laws. A feature that works in isolation but does not propagate is a bug.

Implementation (Alpha 0.4):
- The embedded rig tool broadcasts its full live state (layers, skeleton, pose, swingAmt, layerOverride) to the parent app via postMessage every 700ms when anything changed (ONE-PACKAGE BRIDGE, injected at build; rig source file untouched).
- The app listens, replaces BAKED state, and runs rebuildFromRig(): rebuilds all 8 Skinners, rest grids, RIG pose base, and swing slider. Character and Animation tabs update live off the next frame.
- Rig edits ARE the canon, live. No re-bake step needed inside the app.

## 2. HAND LAYER LAW (locked)
Hands (parts 7 and 8) ALWAYS render one layer nearer than the arms. Arm clothing must NEVER bleed onto or supersede the hand layer.

Implementation (engine law, Skinner module, single implementation everyone obeys):
- `Skinner.handLaw(bodyGrid, garmentCol, garmentBone, opts)`: any garment pixel bound to an arm bone (uArmA, fArmA, uArmB, fArmB) is nulled if it lands on a screen cell owned by a hand part (7/8).
- Future gloves: a garment can opt out with `opts.coversHands = true`. [PENDING, Paolo's call: whether gloves become a slot.]
- Cover fill: parts 7/8 removed from jacket and shirt SLOT_COVER entirely (old 3.2px hand-joint radius hack deleted, superseded by the law).
- Verified headless: 79 hand cells across S/SE/E/N walk frames, 0 garment-over-hand violations, plus visual strip render.

## 3. HEAD BOB LAW (locked)
Facing N or S (head-on), the head gets a slight 1px pixel-snapped bob. Walk/run: one dip per step (two per cycle). Idle: one gentle dip per cycle. This supersedes the old "no bob" rule for the HEAD ONLY; the body still has no sway on N/S gait. Moves neck and headTop together so hair and hats follow rigidly.

Implementation: `Skinner.headBob(sk, dir, clip, ph)`, applied in the app after retarget pose. Other facings untouched.

## Files
- `bohemia_engine.js`: Skinner gains handLaw, headBob, HAND_PARTS, ARM_BONE_IDX. RigData module (14) holds Paolo's rig verbatim.
- `_skinner.js` (kit): synced with the same laws (build source for the app).
- `_build18.py`: builds `BOHEMIA_ALPHA_0_4.html` (bridge injection + law wiring + N/S bob + hand law composite).
