# THE RATCHET IS A MACHINE NOW, AND IT SAYS NO

PLUMBER lane, VAMILY row [never worse], 9/20/26. Paolo's rule 18c.

PAOLO 9/20:

> "I just want to restart all of this, keep our assets and start all over. I really need
> your help to not do that because I can't be showing this to people... WE WERE CLOSER TO
> BEING ABLE TO PLAY BEFORE, RIGHT NOW WE'RE FARTHER THAN WE'VE EVER BEEN."

THE GAME GOT WORSE UNDER A RULE THAT SAID NEVER WORSE, BECAUSE THE RULE WAS A SENTENCE.
Rule 14(a) has said since 9/13 that a cut must never be worse than the last one. Nothing
measured it. Six rounds later he wants to start over.

## WHAT IT DOES

`tools/bohemia_never_worse.js` runs the REAL cutter into a throwaway folder, walks the
candidate cut with the one driver (rule 14g) while every chunk still comes from the real
slices/, scores it, compares against the last ACCEPTED cut, and exits 1 if anything is
worse. It is registered in the suite as NEVER WORSE, so it refuses in the pre-push pass.

slices/ is never written. Rule 14(a) says only RUN re-cuts the demo, so the candidate is
served out of the temp folder through a `serve` map added to the driver.

## THE NUMBERS, AND WHY EACH ONE IS DECIDABLE

Every number this lane published in the last two weeks that it had to take back came
from an instrument that could not tell two situations apart. So NOTHING HERE IS A SCREEN
DIFF. The ground truth is `hx,hy`, the player's own cell. A press either changes it or it
does not.

    tappableMs      ms before a finger has anything to press (rule 18a asks for
                    "nothing tappable until loaded"; this says whether it is true)
    frozenMs        ms inside animation-frame gaps longer than one beat (500 ms)
    aimedWrong      presses that moved him the WRONG way. Should always be zero.
    cellsCovered    how far he actually got
    pageErrors      things that threw

THE DIRECTIONS ARE MEASURED, NOT ASSUMED. Each of the eight pad buttons was pressed one
at a time and the cell delta recorded first: 0 is up (0,-50 a press), 2 right (+35,0),
4 down (0,+6), 6 left (-50,0). Aim is judged on SIGN and never on size, because a
diagonal moves two cells where a cardinal moves fifty.

WALL AND DEAD ARE DECIDED, NOT GUESSED. He pressed and did not move: press the OPPOSITE
direction from the same cell. If that moves him, the pad is listening and he was against
something. If nothing moves him, the pad is not listening.

## *** FOUR THINGS WENT WRONG WHILE BUILDING IT, AND EACH ONE WAS CAUGHT BY RUNNING IT ***

**One: 17 dead presses of 24, and the pad was fine.** The reachability check asked the
CITY FRAME whether its own pad button was on top. A frame can only see inside itself, and
the thing that covers the pad is `#daycard` in the PARENT page, `inset:0` over the whole
phone. So the frame answered "nothing is in the way" while a full-screen card sat over
the lot. Every direction moved him on lap one and was dead on laps two and three. That is
not a pad that breaks after eight presses; that is an instrument looking through a card.
Fixed by asking the page, not the frame. This is round 26's lesson in a new coat:
photograph the phone, not the canvas.

**Two: the number was flaky, and shipping it would have been the worst thing this row
could do.** Seven runs of ONE UNCHANGED TREE read 0, 1, 1, 1, 13, 14, 0 dead presses.
Bimodal, not noisy: good runs agree to the press, bad ones cluster at thirteen, and cells
covered was 53 or 54 in every one. I did not find the cause. SO IT IS NOT SCORED. It is
measured, printed, and decides nothing, because a ratchet on a bimodal number refuses
honest pushes and waves bad ones through, which is Paolo's sentence again with a number
painted on it. The numbers that do decide were the same in every run.

**Three: the first planted regression proved nothing.** It hid the door element and
showed it later; the door then never armed at all, and the run was refused by the floor
for a reason that had nothing to do with the delay. A refusal for the wrong reason is not
a test. The plant is now a synchronous busy-wait that costs time and touches no element,
no handler and no state.

**Four: the ratchet refused the tree it had just accepted.** frozenMs was stored as 0,
the next honest run froze once for 533 ms, and 0 x 1.35 is still 0. AN UNCHANGED TREE WAS
REFUSED. That is the death this fleet keeps writing about, and it would have hit whoever
pushed next rather than me. Fixed with an absolute slack alongside the multiplier, set at
one freeze (750 ms) because every freeze measured across seven runs was a SINGLE gap of
517 to 567 ms. A number that only ever appears as none-or-one needs a floor in its own
units, not a percentage.

## THE SHIP TEST THE ROW ASKED FOR

> "Ship with a planted regression that it refuses."

    PLANTED (--plant 2500, the main thread held for 2.5 s in the throwaway copy):
      tappableMs   548 ->  5616   WORSE     allowed up to 740
      REFUSED, exit 1

    UNCHANGED TREE:
      tappableMs   548 ->   675   within
      frozenMs       0 ->   550   within
      aimedWrong     0 ->     0   same
      cellsCovered  66 ->   124   better
      pageErrors     0 ->     0   same
      not refused, exit 0

It says no to a real regression and it does not cry wolf at an honest one. Both were run
after every fix above, not before.

## TOLERANCES, DECLARED AND GROUNDED

    tappableMs     x1.35 or +120 ms    a wall clock on a box this lane proved runs up
    frozenMs       x1.35 or +750 ms    to 1.8x slower hour to hour
    cellsCovered   may fall to half    net displacement wanders: 41, 51, 53, 54, 66, 92,
                                       124, 136 across runs of one tree
    aimedWrong     NONE                one wrong-way press is one on any box
    pageErrors     NONE

A tolerance on a number that genuinely swings is not a loophole. A tolerance on a number
that does not swing is one, which is why the counts have none.

## THE FLOOR

A walk that pressed nothing, never reached the city, saw no frames, found a pad it does
not understand, or never got a tappable door is a BROKEN run and is REFUSED as such
rather than scored. This lane has shipped three gates that were green while measuring
nothing; a ratchet that passes when the instrument fails is worse than no ratchet.

## WHAT IS NOT DONE

  * THE FIGHT IS NOT IN THE SCORE. Rule 17(b) says the walk ends in the fight and the
    ratchet includes that frame. The tool drives the city's own encounter door and
    photographs the result, but on this cut `cityEncounterIn` is not exposed to the
    driver, so it reports NOT REACHED with the reason rather than a number. It is in the
    report, not in the verdict, and it is the next line.
  * deadPresses, above.
