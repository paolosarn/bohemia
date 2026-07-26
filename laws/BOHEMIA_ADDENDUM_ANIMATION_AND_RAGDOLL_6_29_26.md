# BOHEMIA — ADDENDUM: ANIMATION MODULE, RAGDOLL & MOTION RULES
### 6.29.26 · Babypunk / Punk4Prez
### Folds into the rig/zones canon. Read BOHEMIA_ADDENDUM_RIG_AND_ZONES_6.29.26.md first.

This logs the Animation module direction and two new gameplay-mechanic ideas. Tags:
**[LOCKED]** = decided, build to it. **[BUILT]** = exists in the prototype now.
**[IDEA]** = someday, NOT a committed mechanic yet. **[PENDING]** = needs an answer.

---

## ANIMATION MODULE — what it is
A dedicated **Animation** screen off the 0.1 home menu (its own module, not inside Rig
Lab). It exists to LET PAOLO JUDGE motion, not tune it. Everything renders through the
same HD path as the Character Lab and runs on the 120 grid.

### Hard rules carried in
- **[LOCKED] 120 BPM is the law, scrub included.** One clock, BEAT=0.5s. Every clip
  cycle is measured in beats. Nothing in the game, visual or audio, runs off the grid.
  Do not ask about this again.
- **[LOCKED] HD = scale2x, same as the Character Lab.** Author 1x (24x50), DISPLAY 2x
  via the lab's exact scale2x to 48x100. Never nearest-neighbor blow-up (the "poop").
  The anim module now renders body AND every limb at 48x100.
- **[LOCKED] Hallucinate holes, never flat-fill.** Any time a limb/leg/torso moves and
  exposes pixels (arms swinging, hip pivoting up/down in walk, kneel, etc.), inpaint
  the hole from nearest neighbors, weighted vertical >2x so the WAISTLINE reconstructs
  the torso-into-legs gradient. Flat averaged fill is banned.
- **[LOCKED] Camera never zooms into a body part.** Whole body, stable scale, always,
  every pose including horizontal ones (sleep, ragdoll). The old auto-fit that zoomed
  into the upper torso on falls/sleep was a bug and is removed.
- **[LOCKED] Paolo does NOT tune animations.** No nudge/aim/raise/export UI. That row
  is removed as wasted space. Paolo stays in the loop for COLORING and pixel/graphic
  fixes only, never animation timing. Claude owns all animation work.
- **[LOCKED] Notes box stays pinned and never moves the screen.** Typing a comment must
  not zoom or jump the view (16px input kills iOS zoom; box is fixed with its own
  scroll, COPY/CLEAR).
- **[LOCKED] Use the skeleton to its fullest.** The 8-direction rig was built for a
  reason. Build as many realistic animations as possible; Paolo judges them all. More
  good animation only helps the game.

### [BUILT] Clips currently in the module
idle, walk, run, pistol, two-hand, dead eye, melee, reload, hurt, crouch, kneel, lean,
lean+crossed, lean+pistol, lean+two-handed, sleep, ragdoll (interactive), headshot
(ragdoll death). 8-direction dial, wear toggles, play/pause, beat-locked scrub, Amalgam
title card, autoplaying 120 theme.

## ONE SKELETON DRIVES EVERYTHING [LOCKED architecture]
The ragdoll's bone renderer (each limb a solid piece drawn along its bone vector) was the
only thing that looked right, so **every animation now runs through that same renderer.**
Kinematic clips set joint angles via forward kinematics; aiming/gripping uses **two-bone
IK** so the arms truly articulate shoulder→elbow→hand and both hands can grip a gun.
- No more separate janky arm path, no floating pixels (every limb is a solid bone piece).
- **[LOCKED] Verify by rendering, never ship blind.** Poses are rendered to frames and
  eyeballed before shipping. The earlier bad poses came from shipping code that merely
  "ran." That era is over.
- **[LOCKED] Real drawn weapons:** a two-handed gun spans both hands along the barrel; a
  pistol sits in the dominant hand. Dead-shot = two-hand grip + recoil kick + muzzle
  flash + dial on the beat.
- z-order flips by facing so the far arm sits behind the torso, near arm in front.

---

## THE RAGDOLL — real-body, light physics [LOCKED direction]
Replaces the old stiff headshot drop, which was garbage. **Feel target: a real body,
not rubber.** Weighty, stiff joints, falls and settles like a corpse.

- **[BUILT] Verlet ragdoll on the rig skeleton** (head, neck, shoulders, elbows, hands,
  hip, knees, feet). Rigid torso triangle = weighty trunk; soft angular springs on
  elbows/knees so limbs resist like real mass instead of noodling. Gravity, floor
  collision + friction, settles flat. Verified stable (no blow-ups) and settling on the
  floor across all 8 facings.
- **[LOCKED] Falls respect all 8 facings.** A headshot drops the body BACKWARD relative
  to the way it was facing (E tips left, W right, SE up-left, SW up-right, etc.), not a
  left/right tip-over. This is WHY the 8 directions exist.
- **[LOCKED] Realistic headshot death:** torso pitches back, knees buckle, hands fly up
  from inertia, body collapses and settles. Not a stiff rotation.
- **[BUILT] Drag-to-fling:** thumb-grab any joint and throw the body; the rest follows
  through the constraints. Paolo can play with the skeleton directly.
- **[IDEA→OK to pursue] Lightest-of-light physics in the live game is acceptable** to
  Paolo. Don't go overboard; a real-body death/impact ragdoll is welcome.

---

## NEW GAMEPLAY MECHANICS (logged, judge later)

### [IDEA] Dual pistols / akimbo — risk vs reward
Paolo wants to explore carrying TWO pistols instead of one as a risk/reward mechanic.
NOT designed yet. The shape to figure out later: more output/coverage in exchange for a
real cost (e.g., harder dial, no support hand for cover/reload, accuracy or wound
penalty). Flagged for a dedicated design pass. **[PENDING]** the exact trade.

### [LOCKED] Grid movement lands on the 120 grid
We haven't built tile movement yet, but lock the rule now: **moving one tile in any
direction completes exactly on a beat** — you arrive dead-center on the next tile on the
120 grid. Footfalls, arrival, and the walk cycle all quantize to 120. This matters a lot
once positioning is built.

---

## THE DEPTH ILLUSION — faking toward/away in a 2D paper-doll [LOCKED]
A 2D rig can only TIP left/right in-plane. Toward-camera and away-from-camera falls
and the four diagonals are sold with a **scale + foreshorten trick** (the same insight
as the crouch shrink), driven by facing:
- `depth = sin(faceAngle)` (+1 faces camera / S, -1 faces away / N).
- `lateral = cos(faceAngle)` (+1 E, -1 W).
- **Lateral** is handled by the in-plane physics tip (E tips left, W right).
- **Depth** is handled at render time: as the body falls, scale the whole figure UP +
  slide DOWN when falling toward the camera, scale DOWN + slide UP when falling away,
  with a vertical foreshorten (squash) as it goes flat. Diagonals blend both.
- A headshot drops the body BACKWARD relative to facing, so a south-facer (facing you)
  falls away and shrinks; a north-facer falls toward you and grows. Verified in render.
- **[LOCKED] Same trick belongs in walk and any "toward/away" motion** — never literally
  translate the character to fake depth; scale/foreshorten + a planted-foot shuffle. The
  walk reads as walking toward you on S without the character actually leaving its spot
  (the world will scroll later).

## POSE FIXES FOLDED IN [BUILT]
- **Idle:** legs stay planted; only the upper body breathes. No whole-body float.
- **Walk:** legs are clean solid pieces that TRANSLATE (lift + shuffle), not rotate
  (rotation was spawning the floating pixels). Seam inpainted. Forward-sell via the
  depth scale on the stepping leg. No more detached pixels.
- **Dead Eye:** both arms actually animate, raise to a two-handed dead-shot aim, recoil
  kick + muzzle flash on the beat, dial needle snaps to center on fire. Real shooting.
- **Crouch:** keeps the shrink, plus a small facing-depth foreshorten.
- **Lean-crossed:** real crossed forearms over the chest (body arms removed, two
  forearms posed crossing). **Lean-pistol / lean-2H:** body's flat arms removed, posed
  arms actually hold the weapon. No more goofy flat arms.
- **Sleep:** the horizontal body is centered and rotated within the scene buffer so the
  "invisible square window" no longer chops it.
- **Ragdoll spring resistance [LOCKED]:** when the torso tries to crunch down onto the
  legs, a human-like spring snaps it back the other way (neck/shoulders repelled from
  the foot point below a threshold). Death no longer folds flat like a deck chair.

---

## STILL OPEN
- **[PENDING]** Dual-pistol risk/reward trade — full design pass.
- Pose polish is Claude's job, not Paolo's: aim/lean/kneel angles are v1 and will be
  refined by Claude (Paolo judges, doesn't tune).
- Dead Eye Dial in the anim module is a first attempt (arc + sweeping needle firing on
  the beat); the real dial visuals live in the combat build and will reconcile later.
- More animations to come (Paolo: as many realistic ones as possible).

---
*Addendum 6.29.26 — folds into the rig/zones canon. File is the memory.*
