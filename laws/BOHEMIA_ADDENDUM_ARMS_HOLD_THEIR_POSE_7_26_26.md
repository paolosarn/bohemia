# BOHEMIA ADDENDUM — THE ARMS HOLD THEIR POSE (7/26/26)
# the first thing all session that actually reduced the E/W morphing

Paolo: "Do what you have to do next and know what comes after."

## THE DEFECT, FINALLY ISOLATED

Once OWN CANVAS gave every part its own sheet, each part's own shape could be
measured alone. Own-shape flicker per frame (E+W, 30 clips x 24 phases):

    torso    0.38   (116 px)
    thigh-L  0.31   ( 76 px)
    thigh-R  0.29   ( 76 px)
    arm-L    1.02   ( 81 px)
    arm-R    1.98   ( 80 px)   <-- the back arm

The torso and the legs hold still. The arms are 3-6x worse at the same pixel
area. In profile an arm is a ~3px-wide strip, and inverse-sampling a 3px strip
through continuous rotation churns its own boundary every frame.

## WHY TWELVE ATTEMPTS FAILED, INCLUDING FIVE THAT SNAPPED THE ANGLE

Bucketing an angle with NO MEMORY oscillates. When the arm's angle sits near a
bucket edge it flips between two buckets frame to frame, and each flip is a
WHOLE-SHAPE change — far worse than the sub-pixel churn it replaced. Snapping was
the right idea implemented in the one way that cannot work. Every measurement
said "worse" and none of them said why until the parts were separable.

## THE FIX: HYSTERESIS

A clip is a fixed 24-phase sequence — the same grid `buildFrameCached` already
quantizes to — so the arm's angle buckets are resolved ACROSS THE WHOLE CLIP, in
order, with memory:

    stay in the current bucket unless the angle has moved more than HYST buckets

It cannot oscillate, because leaving a bucket costs twice what entering it did.
Resolved twice per clip so the loop point agrees with itself, cached per
(direction, clip), and thrown away by `rebuildFromRig` whenever the rig or a body
slider changes. The root joint is rounded to whole pixels too — a held angle on a
sliding root still slides.

    arms' own shape flicker per frame       distinct arm shapes per clip
    continuous (today)          2.96                 9.9
    24 steps, hysteresis 1.4    2.40                 6.3
    20 steps, hysteresis 1.4    1.97                 5.8
    16 steps, hysteresis 1.4    1.73                 5.3
    24 steps, hysteresis 2.0    1.44                 5.3
    20 steps, hysteresis 2.0    1.13                 5.0
    16 steps, hysteresis 2.0    0.88                 4.6   <-- SHIPPED, 70% off

ON THE COMPOSITED PICTURE — the surface he actually watches, naked E+W:

    total tone flips        6,481  ->  3,314    49% removed
    of which, parts trading pixels
                            3,810  ->  1,484    61% removed

## WHY HOLDING IS NOT A COMPROMISE

~4.6 distinct arm poses across a 24-frame clip, each held about 5 frames. That is
how pixel art animation is actually made — a classic walk cycle is 4 to 8 drawn
frames — and it is the 120 BPM LAW applied to the arms: everything quantizes. The
arm stops being a continuously resampled strip and becomes a small set of held
poses.

ONLY THE ARMS. The torso and legs already hold still (0.29-0.38) and are left
completely alone. Holding them would cost smoothness and buy nothing.

## WHAT COMES AFTER (the order, and why this order)

1. **The per-part shading fix, re-tried.** It failed three times earlier
   (`BOHEMIA_ADDENDUM_PARTS_ARE_PAINTED_7_26_26.md`) and every failure was a
   correct rule applied to a churning boundary. The boundary now holds still, so
   the same rule is worth exactly one more measured attempt — and now the split
   says it is the majority: of the 3,314 remaining flips, 55% are a cell owned by
   the SAME limb the whole time, which is shading, not ownership.
2. **The hands.** Not yet measured under the hold; they ride the arm chain and
   may already be fixed by it.
3. **The profile repaint**, still [PENDING Paolo]. The arm being a 3px strip
   inside an 8px torso is what made all of this hard; holding the pose manages
   the symptom, it does not widen the arm.

Nothing here is approved art. This is a motion fix on his existing painted arm;
it cooks zero pixels.

Tool: `tools/bohemia_arm_hold_patch.py` (idempotent).
Gate: `gates/arm_hold_gate.js`.
