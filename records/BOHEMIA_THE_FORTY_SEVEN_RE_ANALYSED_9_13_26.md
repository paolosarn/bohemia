# THE FORTY-SEVEN, RE-ANALYSED
ANIMATION lane, 9/13/26. VAMILY row `[redo killed] FORTY-SEVEN-CLIPS-ARE-REDONE-NOT-DELETED`,
round one. The row stays CLAIMED; this is the measurement the remake has to stand on.

## HIS WORDS, THE WHOLE SENTENCE
The board quotes the last third of what he said on 9/7. The whole thing
(records/BOHEMIA_CLIP_VERDICTS_9_7_26.txt, pasted verbatim) is why this round
measured before it cooked:

> "A lot of the ones I thumbed down were because some of the DIRECTIONS look like
> dog shit: when it's facing north-east the hand was behind the head even though
> it's supposed to be in front. **We gotta re-analyze a lot of these.** IF I
> KILLED IT I DON'T WANT IT GONE. I just think it could be done better. Make a
> new one."

He named the REASON for the thumbs-down, and it is the three rig defects this
lane has since fixed: elbows (9/11), the coat (9/12), the facing order (9/13).
Rule 12 says a dependency is a premise and the lane measures it. So does a
diagnosis: remaking a clip the rig already repaired throws away work he might
now like, and remaking 47 blind is the STOP PRODUCING failure with a fresh coat.

## WHAT THE THREE FIXES ACTUALLY DID TO THE 47
Measured on the real rig, all 47 clips x 8 facings x 24 buckets, against the alpha
at `b923fc3^` -- the commit before the first of the three fixes.

**THE FACING ORDER: every single one of the 47 was affected, and all of it is gone.**

    far-arm-painted-over-the-head frames   144 on EVERY clip  ->  0 on every clip
    hand-behind-head-while-its-arm-is-in-front
      crouch-aim-1h, cover-rise, cover-drop, gun-walk, cover-fire, pistol   192 -> 0
      crouch-aim-2h, deadeye                                                82 -> 0

That is his own sentence, and it was true of all 47 at once because it was one
static per-facing order serving every clip.

**THE ELBOW: nine clips had a joint crossing 30 pixels in a single frame.**

    crawl-dying 36->3.6   floor-rise 36->34.5*  spear-drive 32.1->12.4
    crouch-aim-2h 31.6->26.6*  cough 31.1->8.6  tweeze 30.1->5.1
    cover-drop 30.1->3    crouch-aim-1h 30.1->31.4*  cover-rise 30->3.2
    cover-fire 30->11

## AND A RULER WAS REPLACED, WHICH IS THE PART WORTH KEEPING
The first pass ranked the 47 by how far an elbow moves between frames. It put
**jumping-jacks at the top with 218 offences** and floor-rise, bat-arc, throw and
shadowbox right behind it -- and every one of those is a clip that is SUPPOSED to
throw its arms. Meanwhile a genuine 30-pixel joint flip on tweeze sat below them.
Distance measures speed, and speed is not a defect.

The signature of a broken joint is the ELBOW travelling far in one frame while THE
HAND IT BELONGS TO hardly travels at all: the limb went nowhere, the joint jumped
to the other solution. A ratio, not a distance, ignoring moves under 4px where
pixel rounding dominates.

    clips with a snapping joint, ratio > 2
      before the three fixes   11, worst 60x   (elbow 30px while the hand moved 0px)
      after them               10, worst 14x   and every 30-to-60x flip is gone

## THE ACTUAL REDO LIST IS TEN, NOT FORTY-SEVEN
    crouch-aim-2h 22   crouch-aim-1h 12   deadeye 6   cough 4   spear-drive 4
    cover-fire 3       shiv-jab 3         pour 1      tweeze 1  crawl-dying 1

The two crouch-aims are the real remainder and they are not close: crouch-aim-1h
still throws an elbow 31.4px while the hand moves 2.2px, and it is the one clip of
the 47 that the elbow fix made slightly WORSE (30.1 -> 31.4). Everything below
deadeye is one to four small snaps of 4 to 10 pixels.

The other 37 of the 47 carry none of the three defects he named. They are not
"done" -- he has not seen them since -- but they are not broken, and the honest
next step for them is to go back in front of him, not into a rewrite.

## THE GATE
`gates/a_joint_does_not_snap_gate.js`, in the suite as JOINT SNAP. Five claims,
both ratchets PINNED AT THE MEASUREMENT (10 clips, 15x) because the first cut left
slack at 12 and 18 and a mutation that inverted the elbow side walked straight
through it at 11 clips and 13.9x. A ratchet with room in it does not bite.

Two CONTROLS, and they are the reason the ruler is a ratio: the fast clips must
really be throwing the elbow (jumping-jacks 12.2px, bat-arc 20.6px, throw 15.8px)
AND not one of them may be called a snap. If they ever appear in the list the
ruler has gone back to measuring speed.

Two mutations, both caught:
  M1 the rig at b923fc3^, before the elbow fix -> worst 60x, red
  M2 the elbow side inverted                   -> 12 clips, red

## NEXT ROUND
Remake the ten, crouch-aim-1h and crouch-aim-2h first, on the fixed rig, and put
the other 37 back in front of him unchanged. The two headshot clips are NOT in the
snap list and they carry HIS OWN LOCKED SPEC
(laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md section 9, four
beats, verbatim) -- redo those to that text beat for beat regardless, because the
spec is a ruling and the measurement does not overrule it.
