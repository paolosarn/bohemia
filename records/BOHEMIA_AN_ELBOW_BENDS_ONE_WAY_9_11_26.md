# BOHEMIA — AN ELBOW BENDS ONE WAY (ANIMATION lane, 9/11/26)

Row: `[elbows bend]` AN-ELBOW-BENDS-ONE-WAY. Tab: **ANIMATION** (and every clip in
the game). Law: `laws/BOHEMIA_ADDENDUM_A_KILLED_CLIP_IS_A_REDO_9_7_26.md`.

> "You kind of suck at bending elbows at all, and if you do, sometimes they're
> going the wrong way, looking broken." — Paolo 9/7, thumbing the whole clip list

---

## WHAT WAS ACTUALLY WRONG

Every clip that uses IK passed `bend:'auto'` — **all 24 of them**. And `'auto'`
solved *both* elbow solutions each frame and kept whichever **hung lower on
screen**. That is the GUN ELBOW GRAVITY LAW from 7/2, and gravity is not a joint.

Worse, `A.el[1] >= B.el[1]` **is a knife edge**. When the two solutions sit at
nearly the same height the comparison can land either side — so the answer was
recomputed from scratch every frame, and the joint **snapped across the arm between
one frame and the next**.

## MEASURED BEFORE ANYTHING WAS WRITTEN

40,320 arm-frames — 105 clips × 8 facings × 24 frames × 2 arms:

- **59 snaps, in 11 clips.**
- The elbow moving **as far as 36 pixels in one frame**, on a 56-pixel body. A joint
  crossing more than half the body in a single beat.

### And all eleven are clips he thumbed down

crouch-aim-2h, crouch-aim-1h, cover-rise, cover-drop, tweeze, cough, crawl-dying,
cover-fire, spear-drive, floor-rise, bat-arc.

**11 of 11.** The machine found them, and only afterwards was the list compared to
his verdict file. That is the strongest evidence available that this ruler measures
the thing he is actually looking at.

## THE FIRST RULER WAS WRONG, AND HIS OWN VERDICTS ARE WHAT PROVED IT

The first measurement asked a different question: *is the elbow in front of the
shoulder→hand reach line*, on the theory that a reaching arm puts its elbow behind.
It reported **28% of all arm-frames backwards** and its worst offenders were
`stretch` 88%, `cheer` 87.5%, `sit-chair` 63%, `kick` 59%.

**`stretch`, `sit-chair` and `kick` are clips he KEPT.** The ruler was flagging work
he was happy with, because the rule is false for overhead poses — reach up and your
elbow does come forward. A ruler that disagrees with his thumbs on clips he liked is
the ruler that is broken, and it was thrown away rather than shipped.

The flip test needs no anatomical theory at all: *a joint that reverses its bend in
one frame is broken whatever the pose is.* That one agreed with him 11 out of 11.

## THE RULE

**Which way an elbow bends is a property of the ARM, not of the frame.** It is
decided once, from the arm and the facing, and never recomputed.

Measured against the alternatives on the same 40,320 frames:

| rule | flips | clips |
|---|---|---|
| gravity — what shipped | 48 | 9 |
| elbow farthest from the chest | 156 | 18 |
| elbow outboard on the lateral axis | 126 | 16 |
| **decided once per arm + facing** | **0** | **0** |

Two of those I wrote and measured *before* touching the game, after my first attempt
— "the elbow goes away from the body" — **made it worse in the live build, 59 → 149
flips**, and dragged in `deadeye`, a clip he kept. Any per-frame binary choice flips
at its tie point; moving the tie is not removing it.

### The half the 7/2 note was missing

That note rejected fixed signs because they "chicken-winged the mirrored family".
True — of signs fixed in **screen** space. Tied to the **facing** they mirror with
the body. The right arm bends `+1` on S/SE/E/NE/N and `-1` on NW/W/SW; the left arm
mirrors it. Both halves of the mirror are held by the gate.

## AFTER

| | before | after |
|---|---|---|
| elbow flips | 59 | **7** |
| clips affected | 11 | **3** |
| worst single-frame elbow move | 36 px | **11.7 px** |

The three that remain — cover-rise, cover-drop, bat-arc — are arm-across-body
sweeps where a real arm genuinely does cross, and they moved 9–12px, not 36.

**Looked at, not just counted.** `crouch-aim-2h` in all eight facings, four phases
each, before and after: the **N row had no arms at all** before, a flat rectangle,
and now has a readable bent arm; **NE, E, W and SW** changed shape wildly between
adjacent phases and are now consistent. No chicken-winging.

**1744 pinned garment hashes unchanged** — this moved no clothing pixels.

## THE OTHER HALF OF HIS COMPLAINT IS NOT FIXED, AND IT IS NOT IN THIS FUNCTION

"Bending elbows at all" is a different defect. A no-lock clamp was written for it —
hold the target a hair inside full reach so an arm never locks flat — and **taken
back out**, because measured on the 9,216 arm-frames of the clips that use IK, 298
frames sit at zero flex **with** the clamp and **the same 298 without it**.

**79 of 105 clips never call IK at all.** They drive the arm as two rigid segments
with direct angles, so there is no joint to limit and nothing in the solver can
reach them. That is clip work — `[redo killed]` — not a rig clamp. Shipping the
clamp would have been a fix in name only.

## GATE

`gates/an_elbow_bends_one_way_gate.js` — 9 claims, **3 mutations proven caught**:
reverted to gravity (4 claims fail), a screen-space fixed sign (the chicken-wing),
and the two arms no longer mirroring.

**The gate's own first version of its main claim was wrong too.** It asserted the
*observed* side of the reach line never changes within a clip, and failed
`cover-rise` and `cover-drop` for doing what a real arm does when a hand sweeps
across the body. That is a proxy, not the rule. The rule is reachable through a test
hook now, so the gate measures the decision instead of a shadow of it.

## NEXT IN THIS LANE

`[coat follows]` and `[facing order]` are the other two rig fixes, then the 47 redos.
Nothing gets remade before all three land, or they come back thumbed down for the
same reasons.
