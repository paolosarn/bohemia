# WHAT "TWEAKING" WAS: AN ENVELOPE THAT RAMPS FASTER THAN THE GAME DRAWS
ANIMATION lane, 9/24/26, row [redo killed]. Session animation-lr9y9i.

## HIS WORDS
Paolo 9/21, voting DOWN `animation-the-hand-reaches-the-face-9-21`:

> "it looks like all of them Northeast and south tweaking."

Five clips: **eat, drink, smoke, cough, whistle**.

## THE ROUND BEFORE PROVED IT IS NOT PLACEMENT
9/23 (`records/BOHEMIA_A_CLIP_DECLARES_A_HAND_AT_THE_FACE_9_23_26.md`) measured
the two facings he named. On S and NE the hand was already 5 to 8 px from the
face BEFORE the redo and after it, and the sheets bake **byte-identical** there.
The `_face` declaration fixed the facings he did NOT name (N, NW, NE-away). So
his complaint on S and NE was never about where the hand is. It is the MOTION.

## THE DEFECT, NAMED
The body is posed on a grid of `POSEHOLD.keys` keys a bar. **Twelve.** That is
the whole budget: nothing between two of those keys is ever drawn. An envelope
written as a smooth continuous curve can still move a joint further between two
drawn keys than the eye reads as travel, and when it does the joint does not
appear to move, it appears to JUMP, and then to jump BACK.

Two instances, both in the five clips he named:

**eat** was `Math.abs(Math.sin(ph*2*Math.PI))` — TWO bites a bar. The hand went
from 0.42 of the reach to the full reach in three drawn keys, three times a bar,
reversing direction at every hump. Measured: **3 reversals of 12 on south alone**,
the hand crossing up to 13 px between two drawings.

**cough** was `Math.max(0,Math.sin(t*Math.PI*3))*(t<0.6?1:0)`. Sampled at `i/12`
that is `0, 1, 0, 0, 0, 0`: **THE WHOLE CONVULSION IS ONE KEY WIDE.** The head
moved **10.44 px on north-east** and came straight back inside a single drawing,
twice a bar. That is not a cough. That is a twitch.

This is the SAME FAMILY as the tweeze bug this file already carries in a comment:
*"sin(2\*pi\*6\*t) sampled at t=i/12 is ZERO at every keyframe."* Nobody had
generalised it into a law, so it came back.

## THE RULER
Step the 12 drawn keys. A step that goes **back the way the last one came**
(direction flipped by more than 120 degrees) is a reversal. That is the shape of
a jitter, and it is invisible to any "how far did it move" ruler, which is why
five rounds of distance measurements never found this.

Joints: handR, handL, headTop, neck, waC. Facings: his two (S, NE) plus E.

## MEASURED, BEFORE AND AFTER
| | before | after |
|---|---|---|
| reversals on the two facings he named | **26** | **0** |
| reversals adding east | **43** | **5** |
| worst travel between two drawn keys | **10.44 px** | **7.28 px** |
| drawn keys the cough occupies | **2 of 12** | **6 of 12** |

The body is about 98 rows tall, so 10.44 px is a tenth of the man crossed inside
one drawing.

Of the 5 left: four are the cough's own duck and return on east, which is what a
cough does, and the fifth is whistle's far hand breathing, which reads the same
before and after and was never mine to claim.

## THE FIX
Four envelopes, no new art, no rig change, no draw-order change.

```js
eat    c  = e(0.05,0.45)*(1-e(0.62,0.95))     /* was |sin(ph*2pi)|: two bites a bar */
drink  up = e(0.04,0.44)*(1-e(0.62,0.96))     /* was e(0.1,0.3)*(1-e(0.7,0.9))      */
smoke  up = e(0.02,0.42)*(1-e(0.52,0.92))     /* was e(0.05,0.2)*(1-e(0.45,0.6))    */
cough  b  = e2(0.02,0.22)*(1-e2(0.26,0.58))   /* was max(0,sin(t*3pi))*(t<0.6)      */
       head: spF(d)*(0.1+0.05*b)              /* amplitude halved with the spread   */
```

## WHAT DID NOT SHIP, AND WHY
The five REDONE hand poses (the ones aimed from the head instead of the gun
target) are still **out of the alpha**. They take NECK HOLDS HEAD from 15
detached frames to 19, all four new ones on the profile facings, because the
forearm reaching the mouth in profile owns rows 26 to 29 inside the neck's own
columns while the neck's top row is 30.

Good news that is still not enough: the spread envelopes alone took that 22/23
down to **19**. Four frames from green.

**AND I SWEPT THE HEIGHT A FIFTH TIME AND IT IS WORSE, SO IT STOPS HERE.**
Seven reach heights, whole-suite detached count each:

| lift | detached | worst | hand reads at face |
|---|---|---|---|
| +0 | **19** | 4px | 39/40 |
| +1 | 20 | 4px | 39/40 |
| +1.5 | 22 | 7px | 39/40 |
| +2 | 21 | 8px | 39/40 |
| +2.5 | 25 | 8px | 39/40 |
| +3 | 25 | 9px | 40/40 |
| +4 | 22 | 9px | 40/40 |

That is the fifth attempt at the same knob and it confirms the fourth. STOP
PRODUCING: named, not nudged a sixth time.

## AND ONE RULER I BUILT AND THREW AWAY, BECAUSE IT WAS BLIND
I proposed replacing the detached ruler with a connected-component one: flood the
drawn pixels 8 ways and ask whether the head blob and the torso blob are one
island. That is what his eye asks, and it would have passed the four frames.

Mutation-tested it before believing it: with `_neckHolds` neutered, the old ruler
goes **15 -> 48** (reproducing the historical number exactly) and the new one
stays at **0 -> 0**. The island ruler cannot see the defect at all. It was
deleted, and the detached ratchet was not touched.

A RULER THAT PASSES THE THING YOU WANT TO SHIP IS THE FIRST ONE TO MUTATION-TEST.

## GATE
`gates/an_envelope_ramps_slower_than_the_grid_gate.js` — 9 claims, with a control
that pushes the exact shape the cough bug had through the same walk and requires
it to still score reversals, so the ruler cannot go quietly blind.

## IN VOTE
`animation-the-tweak-is-gone-9-24`, and it PLAYS (rule 25): eating and coughing,
south and north-east, what is in the game now beside the fix, twelve frames a bar
on the real 120 BPM clock, cropped to the head and hand at twice the pixels.

## TAB
ANIMATION (the clips), and the VOTE tab in the alpha for the item.
