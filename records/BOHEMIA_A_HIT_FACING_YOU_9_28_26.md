# A HIT FACING YOU (ANIMATION, [facing you], 9/28/26)

## WHY THESE TWO, NOW
Rule 38 was corrected the same hour it landed: A COMBAT TILE IS A HOUSE stands in full and the
fight is on house tiles with the full 112 body. So the fight clips at full detail are what he is
about to see swung at him. Ranked every fight clip by how much of the body moves facing the
camera against its best side view, at 112, on the 24 buckets the game draws:

    crouch-aim-1h 0.20  crouch-aim-2h 0.18   HOLDS, aiming, still on purpose: excluded by rule
    throw          34% facing you vs 85% side   ratio 0.40
    stagger-hit    40% vs 92%                    ratio 0.43
    punch-heavy    38% vs 85%                    ratio 0.45
    lunge-stretch 0.53, shove 0.55, bat-arc 0.59 ... the rest 0.6 and up

Two a round, the coordinator's pace: throw and punch-heavy. stagger-hit is next.

## THE CAUSE, THE SAME ONE AS POINT, SPEAR-DRIVE AND SHIV-JAB
Every body term was written spF(d), which is ZERO on N and S. A throw and a punch go FORWARD, and
forward is into the screen, so facing you the wind-up and the release were an arm moving beside a
man standing still.

## THE FIX (head-on branches only; the six side facings are byte-identical, checked frame by frame)
throw        the arm goes UP over the head and the weight goes AWAY (he rises and leans off the
             throwing side); the release comes AT the camera (armCompress) with the weight
             stepping INTO it and dropping.
punch-heavy  the fist cocks back, then crosses the chest at the camera with the hip behind it.

## TWO THINGS THE PICTURES AND THE GATES CAUGHT
1. LOOKING AT IT: the first head-on punch put the fist at his SIDE at impact. The numbers said 67%
   and it read as a lean, not a punch. Driving the fist across the chest to the middle fixed it.
2. AND THAT FIX FLIPPED AN ELBOW. The forearm bent one way on the wind-up and the other way on
   impact; AN ELBOW BENDS ONE WAY (this lane's 9/11 gate, from his "elbows going the wrong way,
   looking broken") went 7 -> 9 flips and was RED, and it was mine: 10/0 on the tree before this
   change. The forearm now bends one way through the whole punch. 10/0.

## MEASURED
    the gate's own ruler (worst key vs rest, facing you)
        throw        N 20.8 -> 34.9%   S 27.5 -> 45.1%   floor 30
        punch-heavy  N 16.5 -> 39.9%   S 22.6 -> 51.3%   floor 34
    the full-size range (two furthest frames)
        throw        N 34 -> 69%     punch-heavy N 38 -> 68%
    side facings: 0 drifted, all seven clips the gate holds

## PROOF
gates/a_clip_reads_facing_you_gate.js 19 claims (was 17): throw and punch-heavy added to the
head-on floors and to the frozen side table. 2 mutations caught: the fix removed (both floors
fail), and the throw branch leaking into every facing (6 side facings drift).
Regression: ENVELOPE RAMP 10/0, NEAR HAND 6/0, ELBOW 10/0, NECK HOLDS HEAD 8/0, HEAD SNAPS 13/0,
BRACE AND SHADOWBOX 9/0, FOUR (at 112) 13/0, CLIP AUDIT 5/0.
VOTE: animation-a-hit-facing-you-9-28, playing, with one side view to show it did not move.

## ANALOG HORROR LINE (rule 30)
A man who throws at you and does not move his body is a puppet with one string cut. You would
not say why it is wrong, only that it is.

## [bb facing] THE SCHOOL LINE (rule 33f)
The library (reference/library/battle_brothers/) does not say how Battle Brothers draws a fighter
attacking, so this was looked up, and HONESTLY SOURCED: the developers' own forum thread "Animation"
(battlebrothersgame.com/forums/topic/animation/) says they LEFT OUT CHARACTER ANIMATION ON PURPOSE so
nothing would stop them showing every piece of equipment on the body; they tried a weapon swing and
it "looked really dodgy when attacking enemies behind you", because the bust would have had to face
another direction for the length of the swing. The page itself is blocked by this environment's
network, so that is the search engine's summary of it, not a quote checked word for word.
WHAT IT MEANS FOR US: Battle Brothers solved "facing you" by never facing anywhere -- a still bust,
the gear on it, a hit shown by the board. We have EIGHT FACINGS and animated clips, which is exactly
the problem they walked away from, and the failure they describe (the body pointing the wrong way
for the swing) is this row's failure seen from the other side: our body pointed the right way and
did not move. What we take from them: THE GEAR MUST STAY READABLE THROUGH THE SWING (their reason for
the stillness) -- which is CHARACTER's armour attachments (rule 36c) meeting this lane's clips, and
the next thing to check when attachments land. ROUTED: CHARACTER.
