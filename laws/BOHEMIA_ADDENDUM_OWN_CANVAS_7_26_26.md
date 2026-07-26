# BOHEMIA ADDENDUM — EVERY PART GETS ITS OWN CANVAS (Paolo 7/26/26, LOCKED)
# and: THE E/W MORPHING IS THE ARMS' OWN RESAMPLE, AND THE RENDERER CANNOT FIX IT

Paolo's words: "So build it differently, so the arm and the torso don't share
pixels. Just imagine on the right side of the screen you do the front arm, on the
left side of the screen you do the back arm, and in the middle of the screen you
do the torso, and then you put them back together."

## THE LAW (shipped)

Every part is sampled ALONE, on its own private canvas, and only composited
afterwards, nearest first, in his authored draw order.

`skin()` used to sample every part into ONE shared screen with a running `claim`
buffer, so a far part could not take a cell a nearer part had already claimed:

    if (claim[sc] || mask[sc]) continue;   // screen cell already owned

The torso's own shape therefore depended on where the arm happened to be that
frame. Now it does not. **Occlusion decides what is SEEN; it never decides what a
part IS.** Gate: `own_canvas_gate.js`.

## HONEST RESULT: IT DID NOT MOVE THE PICTURE

    tone flips, naked E+W, 30 clips x 24 phases
    before  6,537
    after   6,518

Effectively nothing, and the reason is worth keeping: the cells the far part was
being denied are exactly the cells the near part covers, so it loses them at
composite either way. The composited output is nearly identical. The change is
right — it is the architecture he asked for, and it is what makes any future
per-part work meaningful — but it is not the fix, and it is not being sold as
one.

## WHAT IT DID DO: ISOLATE THE DEFECT TO ONE COMPONENT

With every part now on its own canvas, each part's OWN shape can be measured
alone. How much of a part's own shape appears/disappears/reappears across three
consecutive frames (E+W, 30 clips x 24 phases):

    part      own-shape flicker/frame    avg area
    torso            0.38                  116 px
    thigh-L          0.31                   76 px
    thigh-R          0.29                   76 px
    arm-L            1.02                   81 px
    arm-R            1.98                   80 px    <-- the back arm

**The torso and the legs are stable. The arms are 3 to 6 times worse at the same
pixel area, and the BACK arm is worst of all.** That is, word for word, what he
reported from the start: "morph pixels underneath the arms and the back leg in
the back arm."

WHY: in profile an arm is a ~3px-wide strip. Inverse-sampling a 3px strip through
continuous rotation churns its own boundary every frame — a single sub-pixel step
flips a large fraction of a shape that narrow. The torso is 8px wide and the
thighs barely rotate, which is exactly why they hold still.

## EVERYTHING RULED OUT, ALL MEASURED, ALL NEGATIVE

    ownership separation (this patch)          6,537 -> 6,518   neutral
    shading once at rest, combined grid        6,266 -> 7,524   worse
    shading per part at rest, carried by src   6,266 -> 6,735   worse
    shading per part on own deformed shape     6,266 -> 7,238   worse
    refineSkin off for arms/hands              1.02/1.98 -> 1.13/2.03 per frame, worse
    arm-only angle snap, 64 steps              3.01 -> 3.21     worse
    arm-only angle snap, 48 steps              3.01 -> 3.11     worse
    arm-only angle snap, 32 steps              3.01 -> 4.38     worse
    arm-only angle snap, 24 steps              3.01 -> 4.67     worse
    arm-only angle snap, 16 steps              3.01 -> 4.19     worse
    whole-pose joint snap to 1/2px and 1px     null
    rigid limb stamp, 48/32/24/16/12/8 steps   4.76 -> 3.32 only at 45deg steps
    EVERY PIXEL LANDS + FAR-ARM DARKENING off  45% less fabrication, picture unmoved

THE METRIC WAS CHECKED TOO, because a limb reversing at the end of a swing would
trip an A/B/A test legitimately. Flips are spread evenly across all 24 phases
(157 to 500 per phase) while genuine hand reversals cluster at 4 phases and
number 0 to 10. The metric is measuring instability, not animation.

## THE CONCLUSION, AND IT IS NOT A RENDERER FIX

A 3-pixel-wide painted arm resampled through arbitrary angles will churn its own
boundary. That is arithmetic, not a bug to code around, and eleven measured
attempts across two sessions say so.

The two real options, both his call, both art rather than code:

1. **STOP RESAMPLING THE ARMS.** Draw each arm as ART at a fixed set of angles —
   a sprite per angle, chosen per frame instead of computed. This is how pixel
   art animation is actually made, and it is the only approach that makes a 3px
   limb hold still. Cost: real art volume, per arm, per direction.
2. **REPAINT THE PROFILE** so the arm is not a 3px strip lying inside an 8px
   torso. Already standing as [PENDING Paolo] since 7/26.

Nothing further should be attempted in the renderer for this defect without one
of those two decisions. A twelfth attempt is not a plan.
