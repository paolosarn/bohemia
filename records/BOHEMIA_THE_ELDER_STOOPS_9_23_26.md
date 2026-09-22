# THE ELDER STOOPS — ANIMATION, row [spine bend], 9/23/26

## HIS WORDS, AND WHAT WAS ACTUALLY WRONG
Paolo 9/21, on the ages he had just voted YES to: **"the old person looks like
shit."** CHARACTER measured why (e357361, 5c6aebb): **young adult, adult and elder
land within 3% of each other.** Three ages, one body.

The only dials the age system had were HEIGHT and LEG FRACTION, and the elder
shared its height with the young adult (both 0.97) and had no bias at all. So
"old" meant a young adult, very slightly shorter.

**AND THE RIG'S OWN NOTE ALREADY SAID WHAT WAS MISSING.** Sitting directly above
the elder's line, since whenever the stages were written:

    The ELDER narrows nothing: old age compresses the spine, it does not
    narrow the shoulders.

Nothing in the rig could compress a spine. **A NOTE THAT NAMES A MECHANISM NOBODY
BUILT IS A PLAN, NOT A FEATURE**, and it sat there reading like a decision for as
long as the elder has existed.

## THE BEND
One pivot, just above the hips, at 15% of the way from the waist to the crown.
Everything above it moves on a SQUARED curve of its height above the pivot, so the
higher a joint sits the further it travels: the back ROUNDS instead of the whole
torso tipping over like a plank. Arms come along because they hang off the
shoulders. In the 45 degree view the upper body also comes round the way he is
facing, by a per-facing sign, or the curve does not read at all.

0.20 was LOOKED AT, not picked off a table: below about 0.12 it reads as bad
posture on a young man; above about 0.28 his head passes his toes and he reads as
bent double rather than old.

## MEASURED, ACROSS EIGHT FACINGS
                                        before     after
    how much shorter than the adult       2.4%     11.6%
    head out over his own hip            0.00px    2.65px
    drawn crown, rows lower on screen        2         8
    facings whose drawn body differs       0/8       8/8

## THE LOAD-BEARING CLAIM: HIS LEGS DO NOT MOVE
The pivot is above the hips. A stoop that dragged a knee is a body FALLING OVER,
not an old man. Measured: 0 leg joints off where the 0.97 height scale puts them,
worst 0.18px.

**AND MUTATING IT TAUGHT THE SHAPE OF ITS OWN GUARD.** Adding the leg joints to
the bend's own list is a NO-OP, because the clamp `Math.max(0, piv - y)` makes any
joint below the pivot score zero travel. The legs are protected BY CONSTRUCTION,
not by a list somebody has to remember. The mutation that does move them takes the
clamp out, and then the claim goes 0 to 32 joints, worst 10.7px.

## THE RULER THAT NEARLY LIED, AGAIN
The first bake set `G.age` and rendered, and got THREE IDENTICAL BODIES. I was one
step from reporting that the bend does not read. `G.age` alone draws nothing:
`rebuildFromRig()` is what turns a stage into a body package. Eleventh instrument
of this family, and the tell was the same as always — a result too clean to be
true, caught by looking at the picture.

## THE GATE
gates/the_elder_stoops_gate.js, 9 ok, in the suite as ELDER STOOPS. Three mutations
caught (the bend switched off; the clamp removed so the legs move; every age given
the stoop). It carries a CONTROL that the young adult is untouched, so a global
change cannot pass by merely showing up worst on the elder, and it checks the DRAWN
frame as well as the skeleton, because a skeleton that moved while the art did not
would pass every joint claim and this lane has shipped that exact green before.

## WHERE IT IS
  slices/BOHEMIA_ALPHA_0_9.html                   the bend, in the age system
  slices/vote/ANIMATION_THE_ELDER_STOOPS.html     three ages, eight facings, playing
TAB: VOTE for the clip. It is in the game, on every direction and every clip,
because the bend is in the REST skeleton rather than in one pose.
