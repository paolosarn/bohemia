# YOU KILLED THIS, AND HERE IS WHAT CHANGED
ANIMATION lane, 9/13/26. VAMILY row `[redo killed]`, round three.

## THE RULING, THE WHOLE SENTENCE
> "A lot of the ones I thumbed down were because some of the DIRECTIONS look like
> dog shit ... **We gotta re-analyze a lot of these.** IF I KILLED IT I DON'T WANT
> IT GONE. I just think it could be done better. Make a new one."

Three rounds of rig work later the reasons he gave are measured gone. He has to be
able to SEE that when he looks again, or the second verdict is worth no more than
the first: he would be re-judging blind, against the same memory that produced the
first thumbs-down.

## WHAT SHIPPED
JUDGE ALL (ANIMATION tab) has a fourth filter, **ONES YOU KILLED**, and on those
47 rows and no others a green line: *YOU KILLED THIS. <what was wrong, what
changed>*. The row still plays its own clip beside its own thumbs.

Every line is MEASURED. They are generated from one probe run twice -- on the rig
at `b923fc3^`, before the first of his three complaints was fixed, and on the rig
now -- across all eight facings and 24 buckets. Nothing in them is a claim:

    crouch-aim-1h  far arm drew over the head; hand hid behind the head with its
                   arm in front; elbow jumped 30px a frame, now 11
    tweeze         far arm drew over the head; elbow jumped 30px a frame, now 5
    idle           far arm drew over the head

Forty of the 47 carry only the first clause, because the far-arm-over-head defect
hit every single one of them and most of them had nothing else wrong.

## THREE THINGS THIS ROUND MEASURED AND THREW AWAY
Worth writing down, because each one would have been a round of work aimed at
nothing.

**1. THE CROUCH-AIMS DO CROUCH.** Last round's handoff said "neither of them
crouches in profile". Measured against idle on the same facing, the hip drops 4px
and the head 5 to 8px, on every facing including E. It is a shallow crouch, not an
absent one, and the handoff was wrong. Corrected here.

**2. THE LEGS SHRINK INSTEAD OF THE KNEES BENDING, AND THAT IS LEGAL.** The crouch
clips lower the body by compressing the leg: crouch-aim-1h's leg measures 25.3
against idle's 39, a 35% shortening, with the knee at 0 degrees. That looked like
a defect until the WIDTH LAW turned up (7/2/26, LOCKED): "Limb compression crunches
pixels together ALONG the bone only ... Verified: crouch leg width == idle leg
width exactly; direct engine test, 40 percent compression." Compression IS the
crouch mechanism and he locked it. An approved mechanism was one edit away from
being written up as a bug.

**3. AND THE KNEE ANGLE DOES NOT PREDICT HIS VERDICTS.** The follow-up idea was
that a 0-degree knee is what he disliked. His own file kills it: duck, cower and
take-cover all bend 0 degrees and are all THUMBS UP, while floor-rise bends 14.7
and was killed. The elbow rule earned its place by agreeing with his kills 11 out
of 11. This agrees with nothing, so it is not the defect.

## AND THE LAST FOUR SNAPS ARE THE CLIP, NOT THE JOINT
crouch-aim-2h 4, crouch-aim-1h 2, spear-drive 2, shiv-jab 1, worst 12.6px. Widening
the one-pixel blend to 0.4 of the reach and easing it measured WORSE (13.0px, and
crouch-aim-1h went 2 to 4), so it was reverted. Then looked at, which settled it:
on crouch-aim-2h facing NW the arm hangs down at k2 and is out horizontal at k3.
That is the clip's own key-to-key motion with nothing in between, not a joint
misbehaving. The ratio ruler at 12px is now measuring the animation. Same lesson as
the two rulers corrected in round two: stop when the ruler starts reading the work
instead of the fault.

## THE GATE
`gates/you_killed_this_gate.js`, in the suite as YOU KILLED THIS. Ten claims.
THE LIST IS READ FROM HIS OWN PASTE -- records/BOHEMIA_CLIP_VERDICTS_9_7_26.txt --
and not copied into the gate, so the panel can never drift from what he said. It
also holds the CONTROL that not one of the 56 he KEPT gets a line, and the row
height, which the 9/5 record paid for once: a note allowed to wrap full-width took
a row to 200px and put four clips on a phone screen instead of ten.

(The first cut of the parser read his line "CANDIDATES THUMBS DOWN (18) -- HIS
AMENDMENT BELOW: NOT DELETED, REDONE: stagger-hit..." by stopping at the FIRST
colon, so it counted his amendment as two clip names and reported 48. The last
colon on the line is the one that matters.)

Three mutations, all caught:
  M1 a clip he KEPT is given a repair line -> the control red
  M2 the filter button removed             -> 4 claims red
  M3 the line allowed to wrap              -> the row hits 189px, red

## WHERE HE SEES IT
Tab: ANIMATION. Open JUDGE ALL and tap ONES YOU KILLED. Measured on the real
surface at phone width: 47 rows, 47 repair lines, tallest row 88px, no page errors.

RULE 14 (9/13): alpha and workshop only. The demo was NOT re-cut; RUN cuts it.
