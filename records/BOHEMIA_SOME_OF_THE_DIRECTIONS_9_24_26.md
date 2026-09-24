# "SOME OF THE DIRECTIONS LOOK LIKE DOG SHIT", MEASURED ACROSS ALL FORTY-SEVEN
ANIMATION lane, 9/24/26 (b), row [redo killed]. Session animation-lr9y9i.

## HIS WORDS
Paolo 9/7, handing over the thumbs on the whole clip list
(`records/BOHEMIA_CLIP_VERDICTS_9_7_26.txt`):

> "A lot of the ones I thumbed down were because some of the DIRECTIONS look like
> dog shit: when it's facing north-east the hand was behind the head even though
> it's supposed to be in front."

The second half of that sentence was answered on 9/13 (draw order) and 9/23 (the
`_face` declaration, whose clips he then killed three times). **The first half was
never measured.** "Some of the directions" names a SPREAD, not a defect.

## THE SWEEP
All 47 killed clips, all 8 facings, on the drawn picture: the share of body pixels
the worst key of the bar changes against that clip's own rest frame.

- **21 of 47 have at least one DEAD facing** (under 12%).
- The gap between a clip's best and worst direction runs to **126 points**
  (`lunge-stretch`: W 153.5%, N 27.7%).

Worst spreads: lunge-stretch 125.8, throw 108, bat-arc 97, dig 93.1, spear-drive
89.8, drunk 85.3, stagger-hit 84.4, shout 80.8, flee-sprint 76.6.

**A LOW NUMBER IS NOT AUTOMATICALLY A DEFECT.** `pistol`, `sleep` and `lean` are
HOLDS: still on all eight, which is what they are for. The defect is a clip that
is ALIVE on one facing and DEAD on another.

## THE THREE FIXED, AND ONE CAUSE EACH
All three were dead **facing the camera**, where nothing is occluded, so the motion
simply was not expressed.

| clip | cause | N before | N after | S before | S after |
|---|---|---|---|---|---|
| `point` | aimed with `gunT`, which pushes a point FORWARD along the facing. Facing you, forward is into the screen and `cos(angle)` is ~0. | **3.1%** | **30.6%** | 7.2% | **42.1%** |
| `taunt` | the arch and the thrown-back head are both `spF` terms, and `spF` is zero on N and S. | **10.7%** | **34.9%** | 13.1% | **40.4%** |
| `chest-thump` | the chin lift and the arch, same. | **8.2%** | **27.5%** | 17.6% | **35.7%** |

Facing you: a point throws the arm up and out with the body leaning behind it; a
taunt opens the chest with the weight riding up on the beat; a thump drives the
fist in and the body takes it.

**The six side facings of all three are unchanged to a tenth of a point.** That is
its own gate claim, because a head-on branch leaking into the lateral path would
pass every other claim.

## ONE CUT THROWN AWAY BY LOOKING
`taunt`'s first head-on branch put both arms out at 1.15 rad. **Every number was
better and the silhouette read as a rig in its bind pose** — the one shape in this
game that says BROKEN. Lowered to 0.82 with more elbow and a bigger bounce, and
looked at again.

## AND ONE CLIP I DELIBERATELY DID NOT TOUCH
`inject` is dead on N, SW, W and NW. Its cause is `woundPt`, the chest point pushed
along the facing — the same family — but the back-side facings are dead because the
reaching arm is **behind the body** and the compositor is first-wins. That is the
occlusion problem whose feature Paolo killed three times on 9/23
(`records/BOHEMIA_GRAVEYARD_THE_HAND_AT_THE_FACE_9_24_26.md`). This lane is stopped
on it by ruling. Same reason `point` and `chest-thump` keep a low SW and NW.

## MY OWN GATE BUG, CAUGHT BY READING ITS OUTPUT
The first cut of the three new claims stored the whole reading instead of its
percentage, so they printed `[object Object]%` — and the "side facings unchanged"
claim silently compared an object to a number. `Math.abs(obj - num)` is `NaN`,
`NaN > 0.05` is `false`, so it reported **"0 drifted" and PASSED VACUOUSLY.**
**A COMPARISON THAT CANNOT FAIL IS NOT A CLAIM.**

## GATE
`gates/a_clip_reads_facing_you_gate.js` — 13 claims now, 3 more mutations caught:
drop `point`'s branch (its own claim), let `taunt`'s branch leak into the six side
facings (the unchanged claim, all six named), and wire `chest-thump` to S only
(the N leg). Floors are per clip and set **over** what the bug scored.

## IN VOTE
`animation-the-directions-9-24`, and it PLAYS (rule 25): all three facing him,
what he killed beside what they are, twelve frames a bar on the real 120 BPM clock.

## WHAT IS LEFT ON [redo killed]
47 killed. Done: `idle` (voted UP), the five hand clips' motion (their face-reach
redo is graveyarded by ruling), and these three. **38 to go**, and the sweep above
is the order: the 18 remaining with a dead facing first, the holds never.

## TAB
ANIMATION (the clips), and the VOTE tab in the alpha for the item.

---

## AND ONE THING FOR EVERY LANE, FOUND AT THE REBASE
Appending one row to `records/target/BOHEMIA_VOTE_REGISTRY.json` by
`json.load` / `json.dumps` **rewrites the whole file in your own style**. Measured
on this push: a one-row append came out as **53 insertions and 38 deletions**,
because main's file is not internally consistent (COOK's rows sit one space deeper
than the rest) and `ensure_ascii` has been flipped by at least two lanes.

That is how a one-line change becomes a hundred-line conflict for whoever pushes
next, and it is the same shape as the two conflicted registries that reached main
on 9/23.

**SPLICE THE ROW IN AS TEXT.** Read main's raw file, find the close of `items[]`,
insert the one serialised object at the indentation the last item actually uses,
`json.loads` the result before writing. Same push, done that way: **15 insertions,
0 deletions.**
