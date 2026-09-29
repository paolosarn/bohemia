# TAKING A HIT FACING YOU (ANIMATION, [facing you], 9/29/26)

Rule 39(a), Paolo 9/28: build it, don't ask; COMBAT builds the house-tile fight NOW. Rule 40: the
fight is quicker and the world gets the hours. So the fight's reactions, at full size, are what he
sees in every fight. Continuing the ranking from last round (facing you against the best side view,
at 112, on the 24 drawn buckets): stagger-hit 0.43 and shove 0.55 were next (lunge-stretch 0.53 is a
warm-up stretch, not a fight move, and waits).

## THE CAUSE, THE SAME AS THE FIVE BEFORE IT
stagger-hit: the knock-back was spine/head spF and the lurch was hipOff -(spF)*2.8, all ZERO on N and S.
shove: every body term spF; the arms pushed "out" in the image plane, which facing you is sideways.

## THE FIX (head-on branches only; every side facing byte-identical over all 24 buckets)
stagger-hit  the head snaps back, the knees buckle so he drops 3 px, the arms come up, and he lurches
             to one side -- the OTHER side on the second hit of the bar (two hits a bar), because
             nobody takes two hits the same way.
shove        the hands pull in to the chest, then come together in front of it as the weight drops
             into the push; the forearms bend one way the whole move, so no elbow flips.

## LOOKING FOUND THE SHOVE'S FIRST VERSION INVISIBLE
Both arms foreshortened toward the camera disappeared into the black coat: 48% by the number, nothing
by the eye. The second version brings both pale hands to the front of the chest. It is the smaller
win and it stops at the second try.

## MEASURED
    gate ruler (worst key vs rest):  stagger-hit N 20.1 -> 46, S 23.5 -> 50.7 (floor 38)
                                     shove       N 24.2 -> 30.6, S 34.5 -> 47.8 (floor 28)
    full-size range:                 stagger-hit 40 -> 71%, shove 42 -> 57%
The shove's N gain is small and the floor is set just above the old value on purpose, not generously.

## PROOF
gates/a_clip_reads_facing_you_gate.js 21 claims (was 19); both in the head-on floors and the frozen
side table (nine clips now). Mutations: fix removed (both floors fail); stagger branch leaking to every
facing (6 side facings drift). Regression: ENVELOPE RAMP 10/0, ELBOW 10/0, NEAR HAND 6/0, NECK 8/0,
HEAD SNAPS 13/0, BRACE AND SHADOWBOX 9/0, CLIP AUDIT 5/0.
VOTE: animation-taking-a-hit-9-29, playing, with the side view to show it did not move.

## [bb hit] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
The library's own words on Battle Brothers' fight feel (reference/library/battle_brothers/10_UI_AND_FEEL.md):
"weapon impacts by material, grunts, death cries, the shield thud", on "a fight that is slow, heavy and
legible (every number visible on hover)". BB carries a hit with SOUND and NUMBERS on a still figure; its
developers left body animation out on purpose to keep the gear readable (last round's line).
WHAT WE DO DIFFERENTLY: the BODY takes the hit. He drops, flinches and lurches on the beat, facing any of
eight ways, and the lurch changes side hit to hit. The sound stays SOUNDS' (the thud by material is still
the right call and is routed there), but the read of "that hurt" is his body, which is our twist on a
fight that has to be quicker than theirs (rule 40): a hit you can see lands in a beat; a number you
hover to read does not.

## ANALOG HORROR LINE (rule 30)
A man hit from the front who does not move reads as a recording that skipped the frame where it happened.
