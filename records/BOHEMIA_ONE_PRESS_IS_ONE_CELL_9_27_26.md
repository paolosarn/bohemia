# ONE PRESS IS ONE CELL, AND IT WAS THIS LANE'S OWN NUMBER (RUN, 9/27/26)

VAMILY `[two scales]`, rule 34. The law that died was one this lane built.

> **PAOLO 9/27:** *"two main modes really: your character stays tiny even as you zoom
> out and **you move one grid at a time, that we had originally**... one house doesn't
> equal one tile, it's all fucked up... the demo is still not playable from the very
> beginning."*

## WHAT IT WAS, MEASURED ON THE GLASS BEFORE ANYTHING CHANGED

    one cell drew           11 px
    one press carried       25 cells  = 275 px
    the body drew          112 px, which is TEN CELLS wide

A person ten cells across, taking a twenty-five cell stride, on a grid where a house is
thirteen cells. That is "one house doesn't equal one tile" exactly, and **the stride was
mine**: rule 16 gave this lane THE STEP and the scale constant, and THE STEP IS A HOUSE
(9/15) is the law that put 25 there. Rule 34(c) supersedes it by name, along with A
COMBAT TILE IS A HOUSE (9/4).

## THE CHANGE IS ONE NUMBER, AND IT IS THE RIGHT ONE NUMBER

`strideFine: 25` becomes `strideFine: 1`. One press, one cell, every time, which is the
sentence rule 34(f) puts into rule 18: **THE FIRST SIXTY SECONDS ARE A GAME.**

    16 presses    16 cells    no press carrying more than one
    the squeeze   one out to the far scale, one spread back
    and back      ON THE CELL HE LEFT, not near it

**THE OLD VALUE IS NOT KEPT AS A FALLBACK.** A dial that can quietly restore a
superseded law is how a dead law comes back under a new name, and this repo has a law
about exactly that.

## THE MUTATION EXPLAINED WHY THE OLD WALK FELT BROKEN

Putting 25 back does not just make the stride long. The sixteen presses read:

    25, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

He crosses a lot, clips something on the next one, and then **fourteen presses do
nothing at all.** That is his own complaint from two rounds ago -- crashing into things
and pressing a pad that does not answer -- and it was the stride causing it, not the
walk logic. Four legs red, and the reason is legible.

## THE HARNESS LOSES THE FIRST TOUCH, AND THAT LOOKS EXACTLY LIKE A BROKEN STRIDE

Measured twice before trusting either:

    at 320 ms spacing    [1,1,0,1,0,2,1,1,1,1,1,1]
    at 700 ms spacing    [0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

The lost press's movement arrives on the next one, so a dropped touch shows up as a zero
followed by a two. Total cells always equalled the presses that landed, and no press ever
carried more than one cell of its own.

**MY FIRST FIX FOR THIS WAS WRONG AND I TOOK IT OUT.** I wrote the exception into the
tally -- forgive a 2 that follows a 0 -- and then the throwaway warm-up press was itself
the one the harness lost, so its movement landed on the first *measured* press and the
gate read 2 with no 0 in front of it. Worse, **a rule with a carve-out for the
measurement's own bad night cannot fail honestly**: that same exception would hide a real
two-cell stride. So the warm-up now **presses until one press really moves him** and only
then starts counting. The artefact is removed at its source and the rule is the plain
sentence with nothing in it.

## WHAT I DID NOT TOUCH, AND WHO HAS IT

Rule 34 is five lanes wide and three of its parts are claimed by other chats this same
round. One system, one session:

- **the one-cell BODY is CHARACTER's** `[small body]`: "the walked person is ONE CELL,
  about 28 px tall on a 32 px cell, cut down from the 112". So the body still draws 112
  here. **Said plainly: until that lands, he is a ten-cell person taking one-cell steps**,
  which is a different wrongness from the one just fixed and it is theirs.
- **the honest grid is WORLD's and LIFE+CITY's** `[honest grid]`.
- **the fight on that grid is COMBAT's**, the one-cell clips are ANIMATION's, the 32 px
  tile banks are COOK's.

## AND THE 32 PX CELL IS NOT MINE TO SET YET, WHICH IS A MEASUREMENT AND NOT A GUESS

Rule 34(d) wants a cell about 32 px on the glass. Rule 12 says a named dependency is a
premise to measure, not a gate to wait behind, so I measured it: **a house is 13 cells
today**, so at 32 px a house would draw **416 px on a 378 px screen and not fit**. The
camera moves when WORLD's block lands, in the same change, or the screen breaks. That is
on the handoff as a number rather than as a feeling.
