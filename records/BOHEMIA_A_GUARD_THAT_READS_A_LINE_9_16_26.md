# A GUARD THAT READS A LINE IS MEASURING SOMETHING NARROWER THAN IT NAMES
ANIMATION lane, 9/16/26, rule 16 THE STEP IS A HOUSE. Round three on his ruling,
and this one is entirely about a hole in my own work.

## WHAT I CAME BACK TO CHECK
Last round I guarded the coupling between the size this lane ships to the street
(CAST_PX) and the size the city draws bodies into. The guard read the city's rung
ladder **out of its source with a regular expression** and asserted
`2 x CAST_PX === that rung`.

CHARACTER shipped in the meantime, and their change is the reason that guard was
already wrong.

## WHAT CHARACTER FIXED, AND IT IS BETTER THAN WHAT I REPORTED
My last record said the chain was "armed and waiting on one global" --
`window.BOHEMIA_STEP_FINE`, read once and written nowhere. CHARACTER found the same
thing and went further, in their own words in the file:

> "I wrote this to watch `window.BOHEMIA_STEP_FINE`. RUN named its constant
> STEP_CELLS, so my wire was DANGLING -- a second name for one number, which is the
> exact bug the law's 'one number in one place' is about, committed by the lane
> quoting it. AND IF I HAD SIMPLY REPOINTED IT AT STEP_CELLS IT WOULD HAVE BEEN
> WORSE... 550 px of person on a 378 px screen."

So the trigger is not a flag at all now. It is **whether a house fits on the
screen**, self-measuring off the real camera, which cannot produce a giant on a
tight camera by construction. That is a better answer than the one I wrote down,
and it is theirs.

## AND IT PUT A HOLE STRAIGHT THROUGH MY GUARD
`bodyLadder` now has **two paths**: a legacy ladder, and a ruled one that fires the
moment a lot fits on screen. **My guard regex'd the legacy line.**

**MEASURED: the ruled path is already live.** In human mode at C 14 to 22 the city
draws the body into a **224 px** box today, not the 112 my guard was checking:

       C | path   | box it draws into | sprite from a 56 ship | agree
       6 | RULED  |                56 |         1x ->      56 | yes
       8 | RULED  |               112 |         2x ->     112 | yes
      14 | RULED  |               224 |         4x ->     224 | yes
      22 | RULED  |               224 |         4x ->     224 | yes
      28 | legacy |                56 |         1x ->      56 | yes
      44 | legacy |               112 |         2x ->     112 | yes
      88 | legacy |               224 |         4x ->     224 | yes

**A guard that reads a hardcoded expression measures something narrower than the
thing it names.** Mine would have stayed green while the real box doubled. That is
the same shape as every ruler bug this clip has had -- seconds read as fractions,
56-space numbers on a 112 rig, two endpoints called a peak, an eighth of a fall
called a fall, one facing called a measurement. **Sixth of this session, and the
first one that was in a guard I wrote to prevent exactly this.**

## THE INVARIANT THAT COVERS BOTH PATHS
The guard asks the city's own functions now, at every zoom it can be at:

> **the sprite the city builds from what this lane ships must equal the box it
> draws into.**

14 zooms, both paths, and it holds at CAST_PX=56 because the city's rungs
28/56/112/224 are exactly 0.5x, 1x, 2x and 4x of 56. Raise CAST_PX alone and **0 of
14 zooms agree**, which is the regression, now visible at every zoom instead of one.

## AND THE SECOND CLAIM WAS VACUOUS, CAUGHT BY MUTATION
I added "both paths were exercised" so the check could not quietly become
single-path. It asked `lotFitsOnScreen(C)` **itself** -- which measures the
CONDITION, not the branch. Hardcoding `bodyLadder` to its legacy line leaves the
condition perfectly true and the branch dead, and that mutation scored **12 passed,
0 failed**.

It wraps the real function and asks `bodyLadder`, so the claim is now "bodyLadder
CONSULTED the condition", which is the branch actually running. The same mutation
now reports **0 consultations** and goes red.

Two vacuous controls in two rounds, both mine, both caught by mutation rather than
by reading. The lesson is not "be careful"; it is that **a claim about code must be
made by running the code, and a claim that a path exists must be made by watching
that path get taken.**

## ONE MUTATION THAT WAS NOT A HOLE, AND SAYING SO
I changed the city's top rung from 224 to 448 expecting red. It stayed green, and
it was right to: `bodySpriteC` derives its answer from `bodyLadder`, so the sprite
follows the box by construction and the two cannot disagree that way. The only
things that can break the agreement are CAST_PX moving (caught, 0 of 14) or the
draw code's multiplier mapping changing. A mutation that does not bite is not
automatically a gate bug, and calling it one would have sent the next round hunting
a defect that is not there.

## WHAT SHIPPED
The guard only. **Nothing about the rig, the constant or the street changed**, and
there is no new build. ONE NUMBER FOR A BODY, 12 claims, behavioural end to end.

## STILL TRUE, FOR WHOEVER OWNS THE STREET DRAW
At C 14 to 22 the city already draws a 224 px body by **quadrupling** the 56 this
lane ships -- and that 56 is itself the rig's native 112 halved. Two changes make it
sharp and they must land together or the guard bites: the city's ladder reads the
shipped size off `m.w`, and this lane raises CAST_PX to 112 the same round. Measured
cost: 2.14x on the wire, 0.94x bake time, **0.95x the pixels the phone holds**.
