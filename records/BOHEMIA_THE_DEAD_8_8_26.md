# SKELETONS IN THE OPEN, HUSKS BEHIND SHUT DOORS
**8/8/26. WORLD lane. 2,674 bodies placed across the sampled valley, zero exceptions to the
ruling. Machine: `gates/dead_gate.js` 20/0.**

> "skeletons in the open, husks in sealed places, realistic mix, story-via-placement"
> — Paolo, 8/8/26

---

## FIRST, A CORRECTION ON THE RECORD

The work order cited this as an **8/4 ruling**. **There is no 8/4 record of it** — I searched
every law, record and addendum for skeletons, husks, corpses and remains, and the only
corpse-adjacent settled item in the repo points the other way (*"gore is never the mechanism.
A hurt body is a CLOCK, not a corpse"*, 7/31).

So the ruling **is the sentence in the work order itself**, and it is filed as an 8/8 ruling
rather than back-dated to a document that does not exist. The rule is his either way and it
is fully specified — nothing was blocked on this — but a citation that does not resolve is
the rot the TRUTH HIERARCHY exists to kill, and I am not going to add one.

## THE RULING IS REAL FORENSICS, WHICH IS WHY IT COULD BE BUILT AS PHYSICS

It is not a stylistic preference that happens to sound plausible. It is what actually
happens, and the research is cited in the module rather than remembered:

- **Open ground → skeleton.** A body outside in the Mojave is worked by a vertebrate
  scavenger guild — coyote, fox, vulture, raccoon, opossum, skunk, crow — that
  **disarticulates and scatters** it, on top of sun and wind. Surface remains in arid country
  take **49+ days** to skeletonise and come apart the whole time. So: incomplete, spread,
  never a tidy body.
- **Sealed → husk.** Shut in, there is no scavenger access, and extreme dry heat mummifies
  instead of rotting. It begins around the **sixth day** and then **arrests** the process —
  the literature is explicit that mummification *prevents* animals completing
  skeletonisation. So: intact, desiccated, exactly where they lay down.
- **Under a roof but open to the air** is the honest middle, not an invented third category:
  no sun, but the scavengers still walk in. Skeleton, less scattered.

**Scavenger access is the variable, and a shut door is what removes it.** That is the whole
ruling, and it falls straight out of the tile layering every district already declares.

## TRAUMATIC, NOT GORY — AND THE GATE ENFORCES IT

These are the **facts of a place**, not gore props. The module carries **no wound, no blood,
no injury, no cause of death, no damage field of any kind** — there is not a field for it,
and the gate asserts there never is, on the code *and* on every body emitted.

What is supposed to land is that **somebody shut a door and stayed behind it**, not that you
can see what happened to them.

## STORY-VIA-PLACEMENT, AND THE CORRECTION THAT MADE IT MEAN ANYTHING

Six arrangements, each a sentence the placement tells without writing it down:

| | what it says |
|---|---|
| **lone** | one person, in the open, alone. The commonest and the quietest. |
| **threshold** | on the doorstep, outside. They did not get in, and the door is shut. |
| **queue** | three along the road in a line. They died moving, and in the same direction. |
| **inside_door** | just inside a door, on this side of it. They shut it and stayed. |
| **pair** | two together in a sealed room. They were not alone for it. |
| **huddle** | four in the back of a room, away from the door. As far in as it goes. |

**Measured, then fixed, three times:**

1. **The flat pick made `queue` 72% of the dead in the open.** Three-in-a-line is a striking
   sentence and it only works if it is rare. Weighted: dying alone dominates, the loud ones
   are rationed.
2. **The two door arrangements — the most affecting in the set — came out at 1.7% and 0.4%.**
   Sampling every fourth tile and asking *"is there a door near here"* finds them almost
   never. **Story-via-placement means placing the story**, so the doors are walked and the
   decision is made *at each door*.
3. **Then I overcorrected to 93%**, because I had asked for `layer==='portal' || enter` and
   `enter` is set on **every tile of an enterable building**, not on its doorway. Overcorrecting
   is still getting it wrong. The fix was the right **definition**: portal tiles only, and a
   contiguous run of them is **one** door.

**Final mix: alone 59% · queue 16% · pair 14% · huddle 7% · inside_door 2% · threshold 1%.**
Nineteen bodies per 96-metre block.

## THE BUG WORTH THE MOST

`queue` had an 8.7% weight and was chosen **zero times in the entire valley.**

The placement draw and the arrangement draw came from the same hash with a weak tail, so the
two streams stayed **correlated**: every cell that survived the density check landed between
**0.382 and 0.634** on the arrangement draw and never once above 0.909. A full avalanche
finaliser decorrelates them.

**Placement that looks random and is not is worse than placement that is obviously regular,
because nothing about it looks wrong.** It would have shipped as "the valley just doesn't
have many of those" and nobody would ever have questioned it.

## AND ONE THING THE VALLEY TAUGHT ME

**Not every plot publishes tile layering.** The reserved and unbuilt cell types hand back a
plot with no tile API at all, and assuming it threw on the first valley-wide run. A cell
whose layering the world model does not publish is a cell whose exposure I cannot know — so
it gets **no dead, and says why**, rather than bodies placed on a guess.

## WHAT IS NOT DONE, STATED PLAINLY

**You cannot see them yet.** This is the placement system: where every body is, what shape it
is in, and what its arrangement means — complete, gated, and deterministic across the whole
valley. **Drawing them is the RUN and CITY lanes' half**, and the art is the ART lane's. That
is not a hedge, it is the one-system-one-session boundary, and the data is sitting there in
the shape those lanes already read.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
