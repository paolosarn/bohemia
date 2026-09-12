# THE NEAR HAND DRAWS IN FRONT
ANIMATION lane, 9/13/26. VAMILY row `[facing order] THE-NEAR-HAND-DRAWS-IN-FRONT`.
The third and last of Paolo's three 9/7 rig complaints.

## THE RULING
> "when it's facing north-east the hand was behind the head even though it's
> supposed to be in front; some of the directions look like dog shit."

## WHAT THE DRAW ORDER ACTUALLY IS
Worth writing down, because two comments in the file contradict each other and
one of them is wrong. The skinner composites with `if (partCv[cb+sc] && !out[sc])`
-- the FIRST part in the order to claim a screen cell keeps it. So **index 0 is
NEAREST**. `paoloOrder(d)` sorts the base list by `BAKED.layerOverride[d]`, which
exists for all eight facings and is Paolo's own authored export. The comment above
the base ORDER still says "front-most last" from an older painter's-algorithm
implementation; the sort's own comment ("lowest index = NEAREST") is the true one.

`handOrder(d, present, P)` then rides on top. Before this round it changed that
order for exactly two things: a clip that declares `_gun`, and S/N with a declared
`_handsBack`. Both of the once-dynamic per-pose rules are `if(false&&...)`, retired
7/26 under AUTHORED LAYERING IS THE LAW because they inferred depth from a
continuous signal and flipped an arm mid-swing (144 order changes on NE, 164 on
NW). So for 105 clips and every frame, one static order per facing.

## DEFECT ONE: A HAND WAS LEAVING ITS OWN ARM BEHIND
    460 frames, all eight facings, EVERY ONE a gun clip
    66 of them on NE -- the facing he named

The GUN-UNIT law's own first words are "hands holding a weapon are ONE unit with
it, never independently dynamic". The code moved parts 7 and 8 and left 5 and 6
exactly where they were. When the aim points away the hands went to the BACK of
the order -- behind the head -- while their own forearms stayed in FRONT of it.
A wrist cut in half by the skull, which is his sentence word for word.

Every depth move now moves the PAIR, keeping the pair's own authored inside order.

## DEFECT TWO: THE HEAD WAS ORDERED INCONSISTENTLY AGAINST THE FAR ARM
Behind the far arm on S and SE, in FRONT of it on the other six. So on six of the
eight facings an arm on the far side of the body painted over a skull that sits
between it and the camera:

    dir   cells the far arm stole from the head
    S         0        SE        0
    E      4343        NE     8228
    N      2577        NW     8469
    W      4217        SW     7395
    TOTAL 35229

And N was the worst kind of wrong: the head sat BETWEEN the two arms
(armL 6, handL 7, head 8, face 9, armR 10, handR 11), so on a HEAD-ON facing --
where neither arm is nearer the camera than the other -- every two-handed grip was
split down the middle. two-hand, deadeye, crouch-aim-2h, spear-drive, pray,
floor-rise: one grip, two depths, 2,577 cells.

THE RULE: the head sits BETWEEN the near arm-unit and the far arm-unit. Near is
whichever arm THE AUTHORED ORDER ALREADY PUTS IN FRONT OF THE TORSO -- nothing is
read from the pose, so the answer is identical on every frame of a clip and cannot
flicker the way the 7/26 rules did. Both arms near (S) leaves the head where it
is; both arms far (N) puts the head in front of both, which is also what fixes the
grip split. Only the far pair moves, to just behind the face; every other part
keeps its authored place. RIG LAW holds: `BAKED.layerOverride` is untouched, this
is pipeline law only, exactly as the retired rules were.

AFTER: 35,229 -> 0 and 460 -> 0.

## THE GATE
`gates/near_hand_draws_in_front_gate.js`, in the suite as NEAR HAND. Six claims
over 105 clips x 8 facings x 8 phases = 6,720 frames: everything builds; nothing
is drawn between a hand and its own forearm; the head never comes between them;
the far arm is behind the head on all eight; the near arm is in front of it; and a
CONTROL that facing you, where BOTH arms are near, the head stays BEHIND both.

The control is the one that matters. Every other claim would pass if the rule
simply shoved the head to the front of everything, and that would silently change
the S picture he has already seen.

Its first cut went red for a good reason and the fix is worth keeping: a gun aimed
AWAY from camera on S is a hand on the far side of the body, so that pair belongs
behind the head. Counting it as a failure was the ruler arguing with the geometry.
Declared frames are excluded from the control; 768 undeclared S frames hold it.

Three mutations, all caught:
  M1 the gun rule moves bare hands again  -> 4 claims red (454 far-in-front, 436 near-behind)
  M2 the head rule skipped on laterals    -> 1 claim red (3840 frames)
  M3 the head shoved in front of BOTH arms-> the CONTROL red, and nothing else

## WHERE HE SEES IT
Tab: ANIMATION (any clip that raises a hand: hands-up, stretch, cheer, pray,
two-hand, deadeye) and CHARACTER. Looked at before and after on hands-up in all
eight facings: the black arm that used to slash across the white skull on NE, NW
and W is behind it now, and the head reads as one shape.

## WHAT THIS DOES NOT FIX
Looking at his own frame (records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg)
there is a second thing wrong on NE that is NOT draw order: the head sits up and
to the right of the shoulders with a visible gap, joined by a thin pale strip. That
is the pose, not the layering, and no order can close it. Left for the redo.
