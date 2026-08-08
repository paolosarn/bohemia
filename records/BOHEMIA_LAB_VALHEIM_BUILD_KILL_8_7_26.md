# LAB-10 KILL — AND THE NINTH ONE IS ABOUT THE FORMAT, NOT ABOUT VALHEIM (8/7/26)

> "That valheim sample was so dogshit"
> — Paolo, 8/7/26

KILLED the same day it shipped. `slices/lab/BOHEMIA_LAB_VALHEIM_BUILD_8_7_26.html` is
deleted and graveyarded, its `lab_gate.js` row is gone, and there is **no v2**. Nobody
re-pitches a build/camp reference page.

---

## THE THING I HAVE TO SAY FIRST, BECAUSE IT IS NOT ABOUT VALHEIM

**MY OWN LANE ALREADY WROTE THIS POST-MORTEM ON 7/27, AND I DID NOT READ IT.**

The A Dark Room kill, eleven days ago, in the graveyard registry, in my lane's own words:

> KILLED by Paolo ("That was really bad so bad so bad") … it was a paragraph and one
> button in a modal, **over placeholder grey tiles, while the fleet-wide look problem is
> exactly what he cannot judge past.**

I shipped placeholder grey rectangles again. Same lane, same failure, eleven days later,
with the diagnosis already written down and machine-tracked in the file the graveyard gate
reads on every single run.

## THE COUNT, WHICH IS THE REAL FINDING

Lab deliverables Paolo has killed:

| | |
|---|---|
| LABFAIL-CONDUCTOR | KILLED 7/20 "ass" |
| LABFAIL-PROMISE | KILLED 7/20 |
| LABFAIL-DANCE | KILLED 7/20, dead twice |
| LABFAIL-QUEUE | KILLED 7/20, same day it shipped |
| LABFAIL-DUEL | KILLED 7/20, same day it shipped |
| Zomboid house | KILLED 7/26 "really bad and not fun" |
| A Dark Room scavenge | KILLED 7/27 "really bad so bad so bad" |
| LAB-08 the crash | KILLED 7/31 |
| **LAB-10 Valheim build** | KILLED **8/7 "so dogshit"** |

**NINE.** Against that: the Stardew pages and the CDDA/weapons/cold models were never
verdicted at all, which under UNJUDGED IS DEAD is not a win either.

**A lane whose deliverable format has been killed nine times does not have a content
problem.** I have been treating each kill as "wrong game, wrong mechanic, pick better next
time," and every post-mortem I wrote was about the subject. The subject was never the
problem.

## AND THE LAW MANDATES THE THING THAT KEEPS KILLING IT

`laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md`, clause 6:

> they still live under `slices/lab/` labeled REFERENCE **with placeholder art**

So the lane is *required* to ship the exact thing that has now killed two of its pages
explicitly, while Paolo's standing position all this time has been that he cannot approve
anything until the world looks consistent, and while the live finding on main is that
**4,099 images he bought and judged have never drawn a pixel.**

A lab page is, by law, grey rectangles. Grey rectangles are, by his repeated verdict,
unjudgeable. **Those two facts cannot both stand, and only he can break the tie.** That is
the one thing blocking this lane and it is why this turn is a stop and not a tenth attempt.

## WHAT I AM NOT DOING

- **Not building a v2.** GRAVEYARD IS FINAL, and STOP PRODUCING names the tell exactly:
  writing another version of a thing that was just rejected means the failure already
  happened.
- **Not re-pitching the format with better art.** That would be finding a legal way to ship
  the frozen thing, which the same law calls out as itself the violation. If the format
  lives, he says so.
- **Not arguing that the gates were green.** They were. 573 checks, ten mutations caught.
  Green gates are never an argument, and a page can pass every check ever written and still
  be the wrong object to have made.

## WHAT SURVIVES, AND IT IS THE PART HE ASKED FOR

`records/BOHEMIA_RESEARCH_VALHEIM_BUILD_FEEL_8_4_26.md` — the research. He commissioned it
by name, and its load-bearing finding is sourced off real open-source C# and is unaffected
by the page dying:

**A workbench needs a roof and 70% cover to CRAFT. It needs neither to claim its build
radius nor to suppress enemy spawns.** So the house is an improvement and never a
prerequisite, and you place a camp rather than building one. Plus the refund rule: taking a
piece down returns its full cost, so being wrong is free, so nobody hesitates.

That stands as a reference ruling for the camp (COMBAT owns it, RUN owns the surface) and
needs no page to be true. **Cheap in taps, never free in time** still holds his clause 11.

The teardown and pattern note survive marked DEAD at the top, as records of what was
measured. Two gate checks survive in `lab_gate.js` because they are the most reusable thing
the row produced and the only two of 573 that asked what a human can actually SEE:
**B31** (does the thing the page claims actually land on the canvas — it did not, the
claim circle fell off-screen) and **B32** (is every drawn size big enough to see — the
player marker was computing to minus one pixel wide).

## THE LESSON, IN ONE LINE

**Read your own graveyard before you build, not after he kills the next one.** The registry
is not an archive, it is a list of things that already failed, and a gate reads it on every
run while nobody does.
