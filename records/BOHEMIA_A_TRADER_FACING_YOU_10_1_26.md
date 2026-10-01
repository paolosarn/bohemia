# A TRADER FACING YOU (ANIMATION, [facing you], 10/1/26)

## WHY THESE TWO, NOW
The ranking this row has followed is the fight's (bat-arc 0.59 next), and the fight is HELD: rule 46f
(Paolo 10/1, "combat is soooo fucked up... the tiles below the people dont look good") makes the floor
under the fighters the fight's first measure, and nothing else on the fight ships before it reads. So the
next two came off this lane's OTHER list, the one A CLIP READS FACING YOU prints every run (clips that move
from the side and barely at all facing you), filtered by rule 50 (Paolo 9/30, THE ZOOM RANGE IS A PILLAR):
the near end of the pinch is one person you LOOK at, the talker, the trader. The two things a person there
does TO YOUR FACE, and the two worst on the list that are not gaits:

    haggle   13% of the body facing you, 6.3% from behind, against 65.7% from the side
    bow      20% facing you, 13.9% from behind, against 115.3% from the side

(walk, run, tired-walk, wander and gun-walk stay on the list under the gait exception: a man walking on
the spot moves his legs and not his middle, and that is honest.)

## THE CAUSE, THE SAME AS EVERY ONE BEFORE IT
haggle's head and spine and bow's whole bend were spF(d) terms, and spF is zero on N and S. A bow goes
forward, and forward is into the screen.

## THE FIX (head-on branches only; every side facing byte-identical over all 24 buckets)
haggle   he OFFERS (the near hand comes up and out, palm up, head cocked to it), then SHRUGS (both hands
         out low, shoulders up, head the other way): take it or leave it. One sign per forearm the whole
         clip, so no elbow flips.
bow      the whole top of him dips with the knees giving a little; the near hand drifts in over the thigh;
         the far arm sweeps out and low, where it reads against the ground.

## WHAT LOOKING FOUND: A HAND CROSSING THE BLACK COAT IS A SMUDGE
The first bow put the near hand on the belly, the courtly bow. The pixels said 30 / 41% and the picture
said squat: both forearms swung OUT (positive is out for every arm on N and S, now measured, not guessed).
Flipping the near one in folded it across the chest, and there it drew as a dark smudge with one skin
pixel left, at every fold height tried (three). The part ids say the hand IS drawn in front of the torso
(around.js: part 8 over part 4); the colour that lands there is not skin. So nothing crosses the coat in
either clip: the gestures live OUT, against the ground. Bow stopped at its third version, haggle at its
second (one bigger pass), on the rule that a fourth version means I already failed.

## MEASURED (the gate's own ruler: worst key against the first, share of the body's pixels)
    haggle   N 6.3 -> 18.8%   S 13.0 -> 25.2%   six side facings unchanged to the byte
    bow      N 13.9 -> 29.4%  S 20.0 -> 38.7%   six side facings unchanged to the byte
SMALLER WINS than the fight clips (throw 20.8 -> 34.9, stagger-hit 20.1 -> 46) and said so. bow STAYS on
the printed list: its centre of mass moves 1.41 px facing you, under the 1.5 the list uses, because the
two arms balance each other while the body dips. Named, not hidden.

## AND MY OWN RED, THREE ROUNDS OLD: THE COAT PITCHED A TENT
Running the body gates for this round, THE COAT IS TIED TO THE LEGS (this lane's, 9/12) was red: "the widest
row of the coat is 1.32x the widest row of the body (ceiling 1.30)". Red on main too, so the easy read was
"not mine". IT WAS MINE. Bisected on the alpha's history: green at ee85ceca (1.19x), red from 59861c44,
ANIMATION [small clips] 9/27, "the walk had three pictures". That fix gave the side walk its first PASSING
step, legs together; on E at bucket 0 the body is 19 px wide where every old frame was 23, and the coat's
A-line cone, cut from the hip and flaring three cells to the hem, stayed 25. Main had been carrying my
commit for three rounds, and every "identical on main" triage since was comparing my bug with itself.
THE LESSON, for every lane: red on main is "not this round's", never "not mine", until the history says so.

THE FIX IS IN THE COAT, NOT THE GATE (the doctrine names editing a gate to pass code as a forbidden
shortcut, and the ruler was right: a cone wider than the man is the tent). In profile (E and W) the hem
flares 2.5 cells, not 3: 1 px a side on the 112 body. Measured on every claim of the gate:
    tent       1.32x -> 1.21x   (ceiling 1.30; 1.19 before the reach existed)
    leg spill  3.86% -> 4.07%   (ceiling 7%; E 5.2 -> 6.3, W 5.3 -> 6.2, ceiling 12)
    churn      facing you unchanged (18.6% against the body's 10.4, ceiling 22)
Two cells was tried first: 1.11x, but 2 px a side and E spill 7.7%. Half a cell is the smaller change.
LOOKED AT: the long coat on the side walk, before and after, five buckets, E and W: the same coat to the
eye, the hem a pixel in.

## PROOF
    A CLIP READS FACING YOU   23/0 (was 21): BOW and HAGGLE claims, both facings held, floors over the old
                              S as well as the old N; SIDE_WAS carries all eleven clips, 0 drifted.
                              MUTATION: the old file -> 21/2, BOW 13.9/20 and HAGGLE 6.3/13 both FAIL.
    COAT ON LEGS              10/0 (was 9/1 on main).
    ELBOWS 10/0, ENVELOPE 10/0, NEAR HAND 6/0, ARM HOLD 23/0, CLIP HEALTH 6/0, CLIP AUDIT 5/0, MOTION
    VISIBLE 24/0, FROZEN POSES 29/0, NECK 8/0, HEAD IN FRAME 12/0, BRACE AND SHADOWBOX 9/0, COMBAT ANIM
    118/0, CHARACTER OUTLINE 35/0, STRUCTURE 134/0.
    Red here and red identically on the pre-round file, not this round's: HEM FOLLOWS THE LEG 9/2 (13 new
    garments missing from the hem table), SHAPE FROZEN 11/1 (two pauldrons unfrozen) -- CHARACTER's rows.
    THE FULL SUITE: 749 run, 67 red in the pack. 32 of the 67 never read a file this round changed.
    The other 35 were re-run on the pre-round tree (alpha, VAMILY and the registry swapped back, this
    round's VOTE files moved out): every one red there too, the same claims; the only differences were
    load numbers (DEMO SOUND 9/4 under load, 10/3 alone on both). WALK FEEL and the walk samples in FPS
    ON A PHONE are red because the walk is dead (38b): nobody walks the city now, 0 cells moved.
    VOTE: animation-a-trader-facing-you-10-1, plays on the beat (12 cells moving at a phone's width, both
    sheets load), the side rows byte-identical before and after.

## [bb haggle] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
The library (reference/library/battle_brothers/08_CONTRACTS_EVENTS.md): a contract comes from "a speaker
with a portrait", and the NEGOTIATION is "ask for more (the client's face and words shift: pleased,
annoyed, angry; pushing too hard he withdraws)". Their haggle is a painted portrait whose expression
changes; the settlement is "one painted view with its buildings as clickable icons" (10_UI_AND_FEEL.md).
WHAT WE DO DIFFERENTLY: at the near end of the zoom the trader is the whole person, and his BODY haggles,
on the beat: the offer, the shrug, the bow when it is done. The portrait still talks (THE FACE PERFORMS
is PORTRAIT's); the body is the half Battle Brothers never drew.

## ANALOG HORROR LINE (rule 30)
A man who bows to you and does not move reads as tape that held on a frame too long; the dip has to land
on the beat or it is the long hold the bible warns about.
