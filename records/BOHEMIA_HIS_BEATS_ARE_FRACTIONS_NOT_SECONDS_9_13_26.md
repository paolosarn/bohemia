# HIS BEATS ARE FRACTIONS, NOT SECONDS
ANIMATION lane, 9/13/26. VAMILY row `[redo killed]`, round five.
The headshot's four beats, which are a RULING and not a measurement.

## HIS SPEC, VERBATIM
laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md section 9:

> "4 beats: head snaps back on impact (0 to 0.08), torso/body gives FIRST and knees
> fold (0.10 to 0.45), arms hold UP on inertia while the body drops (0.15 to 0.35),
> torso falls BACK with a hard resistance clamp so it NEVER folds into the waist
> (spine clamped at -0.55), arms come in slightly LAST (0.72 to 1)."

## THE FIND: A UNIT, NOT A VALUE
Those are FRACTIONS of the fall. The fourth beat ends at **1**, and nothing about a
ragdoll ends one second after it starts.

The windows in `hsStep` were **0.08, 0.18, 0.22 and 0.24 SECONDS**. The fall settles
at frame 193 of a 60-per-second step: **3.22 seconds**. So every one of his beats
was being applied over about a fifth of its length, and all of them were finished
inside the first 7% of the fall:

    his beat            his window        what the code did
    head snaps back     0    to 0.08      0 to 0.08 s   = 0 to 0.025
    knees fold          0.10 to 0.45      0 to 0.18 s   = 0 to 0.056
    arms hold up        0.15 to 0.35      0 to 0.22 s   = 0 to 0.069

The number **0.08 appears in both**, once as a fraction of the fall and once as a
count of seconds. That is how it went unseen for two months. Same shape as the four
cameras still typed for a 56-row canvas, found last round: a unit, not a value.

## WHAT SHIPPED, AND WHY ONLY ONE WINDOW
All four windows were converted first and the beats measured, one ruler each, in
his own windows:

    measured                    seconds (before)   arms-up only   all four
    B1 head travel vs waist      6.1 / 4.1          5.1 / 4.1      5.1 / 4.1
    B2 knee peak -> end          38 -> 1            38 -> 5        16 -> 17
    B3 hand lag behind the body  13%                17%            53%
    B4 hand closes to the chest  5.1 px             16.0 px        0.6 px

Damping the legs across a third of the fall makes the body drop 30px instead of 12
inside beat three, which is what lifts the lag to 53% -- **and it lands the body in
a configuration where the arms never come in at all, so his fourth beat dies to buy
his third.** Arms-up alone improves three of the four and worsens none, so that is
what ships. The other two windows stay in seconds with their real units named in
the code, for the round that builds the beat MECHANISMS rather than moving windows.

**BEAT FOUR LANDS**: the hand closes 16.0px toward the chest across 0.72 to 1,
against 5.1px before.

## BEAT ONE IS NOT BUILT, AND THREE ATTEMPTS ARE WHY
Tried, in order:
  1. an impulse on headTop and neck at frame zero (2.6 px of backward velocity)
  2. the same on headTop alone, at 5.0
  3. exempting the head from the horizontal speed cap inside the snap window so a
     bigger kick could survive it

**All three measured 5.1px of head travel against the waist's 4.1** -- identical to
three significant figures, and identical to the build with no kick at all. The 5.1
comes from the window change, not from any impulse. Something downstream is pinning
the head's angle; it is not the speed cap (removing the exemption changed nothing)
and not the impulse size (2.6 and 5.0 are the same number on screen).

None of the three shipped. Code that measures the same with and without it does not
ship, and a fourth attempt at one beat is the STOP PRODUCING tell. What that beat
needs is to FIND the thing pinning the head, not another kick.

## THE GATE
`gates/his_four_beats_gate.js`, in the suite as FOUR BEATS. Seven claims.
**It reads his four windows OUT OF THE LAW FILE** rather than copying them, so the
code can never drift from his text. It carries a CONTROL that the CRUMPLE keeps its
own timings in seconds -- Paolo 7/17 ruled a head shot destroys motor control
instantly and v2 is flaccid, so a change that swept every window into fractions
would have taken his separate ruling with it.

And it **PRINTS the three beats that are still not built**, every run, so the clip
is never read as finished because a gate went green.

Four mutations, all caught:
  M1 the rig before this round             -> the naming claim red
  M2 a window edited away from his text    -> 2 red, including beat four at 10.3px
  M3 HS_FALL stops being the measurement   -> the pinning claim red
  M4 the arms-up window back to seconds    -> the code claim red, AFTER IT WAS FIXED:
     the first cut looked for hsIn('armsUp') anywhere, and the elbow line still
     matched it, and the elbow alone still carries beat four so the data claim
     could not see it either. Both call sites are named now.

## WHERE HE SEES IT
Tab: ANIMATION, clip `headshot`. The arms now come in at the end of the fall
instead of staying flung out.

RULE 14 (9/13): alpha and workshop only. The demo was NOT re-cut; RUN cuts it.
