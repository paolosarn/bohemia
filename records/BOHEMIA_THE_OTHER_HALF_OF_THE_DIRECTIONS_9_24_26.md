# THE OTHER HALF OF "SOME OF THE DIRECTIONS LOOK LIKE DOG SHIT"
ANIMATION lane, 9/24/26 (c), row [redo killed]. Session animation-lr9y9i.

## THE QUESTION ASKED THE OTHER WAY ROUND
Last round swept all 47 killed clips on all 8 facings and fixed three that were
dead **facing the camera**, where a sideways-written motion has no projection.

The mirror question is: **is any clip dead IN PROFILE while alive head-on?**
That is worse when it happens, because a head or a chest move is MOST visible
from the side.

Asked with the same drawn-picture ruler, and each dead facing labelled head-on or
lateral off the game's own `headOn()` rather than a list I typed:

| clip | head-on best | side best | dead sideways |
|---|---|---|---|
| **nod** | 17.2% | **12.8%** | NE E SE SW NW (five of six) |
| point | 42.1% | 20.1% | SW NW |
| chest-thump | 35.7% | 29.8% | NW |
| inject | 14.3% | 25.8% | SW W NW |

`point`, `chest-thump` and `inject` are the **occlusion** family: on the back-side
facings the reaching arm is behind the body and the compositor is first-wins. That
is the feature Paolo killed three times on 9/23, and this lane is stopped on it.

**`nod` is the real one**, and it is the inverse defect.

## WHY THE NOD WAS INVISIBLE FROM THE SIDE
```js
head: f*(0.12 + 0.14*s)
```
Two things wrong in eleven characters:
1. **`0.12` is a permanent TILT.** His head sits tipped forward the whole time, so
   the swing starts from an offset instead of from rest.
2. **`0.14` rad is eight degrees.** His head is 22 px tall. Eight degrees is about
   **a pixel and a half**. A nod you can only find with a ruler.

Centred on zero, swung to 0.42, with the neck, shoulders and a hip bob following.
Every side facing rose and none is dead:

| | NE | E | SE | SW | W | NW |
|---|---|---|---|---|---|---|
| before | 4.1 | 9.7 | 6.6 | 9.1 | 12.8 | 5.5 |
| after | **14.5** | **22.8** | **17.6** | **15.6** | **21.8** | **13.5** |

Head-on is untouched (14.7 and 17.2), which is its own gate claim: the fix is in
the lateral branch, so a leak the other way would show there.

## AND THE SAME BUG AS LAST ROUND, TWICE MORE
**A THRUST GOES FORWARD, AND FORWARD IS INTO THE SCREEN.** `spear-drive` and
`shiv-jab` both aim with `gunT` and write every body term as `spF`, which is zero
on N and S. Facing you, the whole attack was a man standing still.

| | N before | N after | S before | S after |
|---|---|---|---|---|
| spear-drive | **12.3%** | **55.5%** | 18.9% | **65.2%** |
| shiv-jab | **12.6%** | **45.1%** | 16.2% | **55.5%** |

Facing you the drive is spent down and through: he sinks into the lunge, the back
leg folds, the arms punch out low, the head goes with the weight. **All twelve
side facings across both clips are unchanged to a tenth of a point.**

That is `point`'s cause on its second and third clip, which is what makes it a
class and not an anecdote.

## GATE
`gates/a_clip_reads_facing_you_gate.js` — 17 claims now, 3 more mutations caught:
- drop `spear-drive`'s head-on branch → its own claim, back to 12.3%
- put `nod`'s permanent tilt back → the profile claim, worst side facing 7.6%
- let `shiv-jab`'s head-on branch leak into the lateral path → the unchanged claim,
  all six side facings named in the failure

**AND THE CONTROL MOVED.** It used to stand on `nod` ("the headOn pattern is alive
elsewhere in the file"). `nod` is a SUBJECT of this gate now, and a control that
stands on a clip the round edited is arguing with itself. It reads `drunk`, which
this round did not touch.

## IN VOTE
`animation-the-other-half-9-24`, and it PLAYS (rule 25): the nod from the side and
both thrusts facing him, what he killed beside what they are, twelve frames a bar
on the real 120 BPM clock.

## WHERE [redo killed] STANDS
**12 of 47 touched.** `idle` (voted UP); `eat`, `drink`, `smoke`, `cough`,
`whistle` (their MOTION only — the face-reach redo is graveyarded by ruling);
`point`, `taunt`, `chest-thump`; `nod`, `spear-drive`, `shiv-jab`.

**The order is the measurement, not taste:** whichever remaining clip has the
worst single facing goes next. The holds (`pistol`, `sleep`, `lean`, `pray`,
`hands-up`, the crouch-aims) are still on all eight ON PURPOSE and are never
"fixed". The occlusion family is never touched until he asks.

## TAB
ANIMATION (the clips), and the VOTE tab in the alpha for the item.
