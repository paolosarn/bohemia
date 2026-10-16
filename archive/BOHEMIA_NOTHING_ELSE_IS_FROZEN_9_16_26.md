# NOTHING ELSE IS FROZEN, AND NOW A MACHINE HOLDS THAT
FACTIONS lane · THE FIVE MINUTES (rule 14), round ten · 9/16/26

## THE ONE LINE
Last round found the valley's whole war frozen out of existence by a cache that was
filled one beat too early. This round asked the obvious next question — **is anything
else?** — and the answer is **no**, measured against every cache in the city. The
product of the round is not the answer, it is the checker: the one-off instrument
that caught it is now a standing gate, and putting the original bug back turns it red.

## FIRST, THE TRIGGER MY HANDOFF WAS WATCHING FOR
Rule 16, THE STEP IS A HOUSE, moves the tile, and every layer this lane draws is
sized off it. `LOT_FINE` **is in the city file now** — fifteen mentions, where last
round there were none — so the trigger looked like it had fired. Measured before
acting on it:

    on foot        tile 18      human   city renderer 0   sky 0
    one zoom out   tile 13.09   city    city renderer 1   sky 0   borders 14, lights 205
    two zooms out  tile 3.74    city    city renderer 0   sky 1

**Identical to the last two rounds.** `const LOT_FINE = 24` is scoped inside its own
module and is not a global the render reads; the lattice has landed, the render scale
has not. So this lane's layers are untouched and there is nothing to re-measure yet.
One run to know that instead of a guess, and the trigger stays armed.

## THE SWEEP
The test that caught the parties needs no theory and no list of dependencies: **drop
the cache, let the game's own function fill it again, and see whether the answer
changes.** If what the game is holding is not what it would work out right now, it was
settled too early. Run against every keyed cache in the city:

| what the game keeps | as held | rebuilt | |
|---|---|---|---|
| who is seated | 14 seats | 14 seats | same |
| who holds what | n=96, own | n=96, own | same |
| who is out there | 14 patrol, 10 caravan, **4 crew** | the same | same |
| what the ground makes | 5 keys | 5 keys | same |
| where the people are | 5 keys | 5 keys | same |
| where home is | the same box | the same box | same |
| the market hub | seat:Church | seat:Church | same |

Nothing else in the city is frozen the way the parties were. And the party row
reading **4 crews on both sides** is last round's fix holding on main.

## AND I NEARLY REPORTED A PASS ON AN UNASKED QUESTION
The first run of that sweep came back with three rows reading `null` — and `null`
matches `null`, so all three scored **"same"** and would have gone into the table as
checked. They were not checked. I had guessed the filler function names (`pplMap`,
`minesMap`, `homeOf`); the real ones are `pplGrid`, `minesGrid`, `homeFind`. With the
right names all three answer properly and all three are genuinely the same.

**A cache that answers "null" twice has not been tested, it has been skipped**, and it
looks exactly like a pass. That is the fifth invented identifier this lane has caught
itself using, and the first one that would have produced a confident wrong "clean".

## THE PRODUCT OF THE ROUND
`gates/frozen_before_it_was_known_gate.js`, **8/0**, registered in the suite.

It holds the shape rather than the instance: five answers that are meant to be steady
inside one day, each dropped and rebuilt by the game's own function, plus a floor
before any comparison (two empty readings match perfectly, and this lane has shipped a
claim that passed on an empty set before), plus one named claim that the party list
really contains crews — so a rebuild that quietly stops producing them reads as the
bug it is rather than as a quiet world.

**Mutation-proved:** put the original freeze back and two claims go red, naming the
held answer and the rebuilt one side by side.

What it deliberately does not claim: that caching is wrong, or that everything must
rebuild identically forever. A cache whose answer is *meant* to move belongs on a
different check, and putting one here would make this gate lie the first time somebody
built it.

## GATES
`frozen_before_it_was_known` 8/0 (new, registered). alpha_loads 20/0, engine sync 19
modules zero drift. **No game file changed this round** — the whole diff is one
checker and its registry line.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
A negative result is worth shipping when it is **bounded and mechanical**. "Nothing
else is frozen" is worth little on its own and worth a lot with a gate under it,
because the sentence decays the moment somebody adds the sixth cache and the gate does
not.
