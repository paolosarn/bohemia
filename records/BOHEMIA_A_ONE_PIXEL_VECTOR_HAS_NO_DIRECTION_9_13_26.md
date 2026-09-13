# A ONE-PIXEL VECTOR HAS NO DIRECTION
ANIMATION lane, 9/13/26. VAMILY row `[redo killed]`, round two.
The third time this rig has been caught deciding something big with a measurement
too small to carry it.

## WHERE THIS CAME FROM
Round one re-analysed the 47 clips Paolo thumbed down on 9/7 and found that the
three rig fixes had already repaired 37 of them. Ten still had a joint that snaps:
the elbow travelling far in one frame while the hand it belongs to barely moves.
This round found the single cause of all ten and fixed it in the rig, which is the
order the row itself demands -- rig first, then the clips.

## THE MEASUREMENT
crouch-aim-1h, facing E, between two consecutive frames:

    frame 14   shoulder [64,41]   elbow [49,48]   hand [64,42]
    frame 15   shoulder [63,41]   elbow [74,29]   hand [63,40]

The shoulder moved 1 pixel. The hand moved 2.2. **The elbow moved 31**, from one
side of the body to the other, on an arm whose whole reach is 32. Nothing in the
pose did that.

The cause is in the last place the arm is decided. `solveIK` takes
`a = atan2(target - shoulder)` and puts the elbow at `a + off` on a 16-pixel
radius. In this clip the hand is held **one pixel from the shoulder**. A one-pixel
vector has no reliable direction: at frame 14 it is (0, +1) and at frame 15 it is
(0, -1), so `a` flips 180 degrees and the elbow swings the diameter of the arm.
The pose did not change. The rounding did.

This is the same shape of defect as the two already fixed on this rig:
  9/11 the elbow SIDE was a knife-edge height comparison between two solutions
  9/12 the coat's HIP was one scanline that a swinging arm kept covering
  9/13 the elbow ANGLE is a vector one pixel long
A decision taken from a measurement too small to carry it, three times.

## THE FIX
Below a quarter of the arm's own reach, the direction is blended toward the REST
arm's direction instead of the vanishing one. That is also what a folding arm
really does: the elbow stays out where the upper arm points, it does not orbit the
shoulder. At the threshold the blend IS the target's own direction, so nothing
above a quarter reach moves by a pixel. `sh` is the REST shoulder inside solveIK
(l1 is measured from it), so both vectors are in the same space.

    crouch-aim-1h E 14->15   elbow 31.4px -> 3.2px
    crouch-aim-2h E 14->15   elbow 27px   -> 4px

## AND THE RULER'S FLOOR WAS WRONG, WHICH THE FIX EXPOSED
The gate shipped in round one flagged a snap at 4 pixels of elbow travel. When
this fix took crouch-aim-1h's worst frame from 31.4px to 3.2px, **the gate
reported MORE snapping clips, not fewer.** A ruler that gets worse when the thing
it measures gets better is measuring the wrong thing.

The reason: where the hand is parked on the shoulder the ratio's denominator sits
at its 0.5 guard, so a perfectly smooth 4-pixel elbow move scores 8x. The floor is
8px now -- half the upper arm's own length on this rig -- and at 8px the three
builds separate cleanly and monotonically:

    before any rig fix        11 clips   worst ratio 60x   worst travel 36.0px
    after the elbow rule       7 clips               14x               31.4px
    after this fix             4 clips              4.1x               12.6px

## THE GATE
`gates/a_joint_does_not_snap_gate.js`, in the suite as JOINT SNAP. Six claims now:
the snapping-clip count, the worst ratio, and a NEW absolute ceiling -- no joint
may cross more than 15 pixels in one frame while its limb stands still, against
the 36 it used to. All three ratchets pinned at the measurement.

Four mutations, all caught:
  M1 the rig before any of the three fixes   -> 3 claims red (11 clips, 60x, 36px)
  M2 the rig before this fix                 -> 3 claims red (7 clips, 14x, 31.4px)
  M3 the blend threshold set to zero         -> 3 claims red (identical to M2, which
                                                is the proof the blend is what did it)
  M4 the elbow side inverted                 -> 2 claims red

## WHERE HE SEES IT
Tab: ANIMATION and CHARACTER. crouch-aim-1h facing E: the black spike that used to
shoot up past the shoulder on one frame of the cycle is gone and the arm holds one
shape through the whole loop.

RULE 14 (9/13): this ships to the alpha and the workshop only. The demo was NOT
re-cut; RUN cuts it after walking the five minutes.

## WHAT IS LEFT OF THE ROW
Four clips still snap, all small and all in the same family:
crouch-aim-2h 4, crouch-aim-1h 2, spear-drive 2, shiv-jab 1, worst 12.6px. Those
are now pose problems, not rig problems -- and the crouch-aims have a second one a
joint fix cannot touch: **neither of them crouches in profile.** They stand.
That is the clip content, and it is the rest of [redo killed].

## AND IT CAUGHT A SECOND RULER READING THE SAME NOISE
The pre-push pass went red on AN ELBOW BENDS ONE WAY, this lane's own gate from
9/11: flips 7 -> 9, both new ones on crouch-aim-1h. Checked against the alpha
before this fix, where it is green. So it was mine, and it looked like a
regression.

It is not. `sideOf` in that gate is the cross product of the elbow against the
SHOULDER-TO-HAND vector -- and on crouch-aim-1h facing E the hand sits ONE PIXEL
from the shoulder, the same degenerate vector this whole round is about. So:

    the build where that frame's elbow jumped 31.4px   the ruler called CLEAN
    the build where the same frame moves 3.2px         the ruler called A FLIP

It had the two backwards. A ruler that passes the snap and fails the repair is
reading noise, and the guard it needed was already half-written in the file: the
line above says "a REAL bend only: a near-straight arm has no meaningful side".
A FOLDED arm has no meaningful side either, for exactly the same reason, and that
mirror was missing. The hand must now sit more than 4px from the shoulder before
its side counts.

THE GUARD CANNOT SWALLOW THE MEASUREMENT, and that is a claim of its own now:
it skips 267 of 42,000 arm-frames, 0.64%, against a 2% ceiling. And the historical
mutation still bites -- the rig before the elbow rule reports 50 flips and a 36px
teleport and takes four claims red.

Flips are back to 7 (cover-rise 3, cover-drop 3, bat-arc 1), the same seven that
stood before this round, and they are the arm-across-body sweeps the 9/11 record
already named as real motion.
