# THE NECK IS THE ONLY THING HOLDING THE HEAD ON
ANIMATION lane, 9/18/26. VAMILY row `[redo killed]`.
His oldest unfixed complaint, the one he pointed at in his own frame.

## WHAT HE POINTED AT
Paolo 9/7, on `records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg`: on NE the
head sits up and to the right of the shoulders with a visible gap. Looking at his
grid again, the same reads on SE and SW; N, E and S look attached. It has been on
this lane's "what is left" list since, behind rig work.

## MEASURED, WITH A RULER THIS LANE ALREADY OWNED
REUSE-FIRST: the direction-free blob ruler built for the head snap gate (the one
that had to be direction-free because a lying body's neck is beside its head, not
under it). Swept over **105 clips x 8 facings x 4 phases = 3,360 frames**:

**48 frames draw the head DETACHED from the body by 2 to 8 px**, across 18 clips,
concentrated on NE, E, SE and SW -- his facings.

## AND THE CAUSE IS NOT THE POSE
**31 of those frames draw NO NECK AT ALL, and every single one of them is
detached.** Against that, of the 1,666 frames that do draw a neck, 0.7% are.
A perfect correlation on one side and almost none on the other.

Sampling the straight line from the neck joint to the head joint in the failing
frames, the pixels along it are part ids **5 and 6: the ARMS**. On `cheer E` the
entire line is arm 6.

**WHY THE ARM WINS:** the per-facing `layerOverride` puts the NEAR arm at index 0 on
NE, E and SE -- nearer than the torso, and nearer than the neck at index 4 or 5.
That is correct for an arm hanging at your side. It is wrong the moment the pose
RAISES that arm (cheer, hands-up, greet, preach, hail, pour, inject, smoke), because
the sleeve sweeps up across the throat and, being nearest, erases the one part that
connects the head to the body. The head is left floating over a dark shape, which is
exactly what he saw.

## THE RULE
**The neck draws in front of the arms.** A neck is body-core; an arm crossing your
own throat is rare, and at this size it reads as a severed head rather than as an
arm. Same family as THE NEAR HAND DRAWS IN FRONT (this lane, 9/13) -- what the pose
puts in front must draw in front -- except that covering the neck destroys the read
of the whole figure, so the neck wins outright.

**MEASURED BOTH WAYS, AND IT IS MONOTONIC:**

    detached frames      48 -> 23
    frames with no neck  31 -> 10
    worst gap             8px -> 6px
    THIRTY-SIX FRAMES BETTER, ZERO WORSE
    13% of frames change a pixel at all

Rendered before and after on his own facings: a skin-toned neck now connects head to
shoulders on `greet SE`, `preach SE`, `cheer E`, `hands-up E`, `pour NE`, `smoke NE`,
where before the head sat on a black wedge.

## AND MY FIRST CUT BROKE SOMETHING, CAUGHT BY MY OWN OLDER GATE
The first version inserted the neck at the first arm's own index. On **S, W and NW**
the draw order opens `[7, 5, ...]` -- the HAND nearest, then its own forearm -- so
the neck landed **between a hand and the arm it belongs to**.

THE NEAR HAND DRAWS IN FRONT, shipped by this lane on 9/13, went red immediately:
**2,304 frames of 6,720 drew something between a hand and its own forearm.** Triaged
against a clean origin/main checkout, where it was green, so it was mine.

A hand and its arm are one unit, so the neck now steps in front of the **whole
unit**: if the arm is immediately preceded by its own hand, the neck goes in front of
the hand instead.

**The neck gate alone would have shipped that regression** -- it stayed 8/0 through
it. The older gate is what caught it. That is the case for keeping narrow gates
around after their round is over.

## THE GATE
`gates/the_neck_holds_the_head_on_gate.js`, in the suite as **NECK HOLDS HEAD**,
8 claims, 26 seconds.

The load-bearing claim **asks the live draw order on every facing** rather than
reading a line out of the source -- the lesson from last round, where a guard that
regex'd one line stayed green while the thing it guarded moved. The ceilings are the
measurement (23 / 10 / 6px), so the count can only fall from here.

It **PRINTS the 23 frames that remain**, of which **12 are gun clips** (two-hand,
deadeye, crouch-aim-2h). Those are a different defect: the GUN-UNIT law moves parts 7
and 8, and this rule only moves the neck. Named rather than chased.

Four mutations, all caught:
  M1 the build before this rule                  -> 6 red
  M2 the regression I made, neck INTO the arm unit -> NEAR HAND red (the neck gate green)
  M3 the rule dropped from one of handOrder's two exits -> 2 red
  M4 the rule present but never moving anything  -> 4 red
