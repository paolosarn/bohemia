# "WHY WHEN I ENTER A HOUSE I CANT GO LEFT AND RIGHT" — he was standing in the doorway (8/3/26, RUN lane)

## THE ANSWER WAS WRONG ON 8/2, AND THE REASON IS THE INSTRUMENT

`records/BOHEMIA_INTERIOR_MOVEMENT_MEASURED_8_2_26.md` closed this complaint with:

> "**There is no missing left/right.**" — after flood-filling every cell reachable from
> the landing cell using the game's OWN movement predicate and its OWN 8-direction table.

That flood fill is honest and it is still true. It is also the wrong instrument. **A
flood fill says which cells are reachable IN PRINCIPLE. It never presses a direction.**
Drive the real mover instead — `stepOnce`, in a real browser, in real houses entered
through real doors — and the answer flips:

```
you land on:            the DOOR cell itself, every time
what works there:       N, NE, NW
what is BLOCKED:        E, SE, S, SW, W
houses where left or
right works on landing: 0 of 6
... one cell further in: 6 of 6
```

He is standing IN THE OPENING, with a jamb either side of him. Press left: wall. Press
right: wall. **Exactly what he said, word for word, and it was never a movement bug or a
camera bug** — both of which were investigated first and cleared.

While measuring, the 8/2 camera theory also failed on its own terms: `renderInside`'s
fit-the-plate branch only triggers below a zoom threshold, and at the shipped default
`HC=44` a 21x12 house takes the FOLLOW branch. Driving three steps changed 70.2% of the
screen. **The camera scrolls. It was never the camera.**

## THE FIX

Crossing a threshold puts you THROUGH it. On entry the body steps one cell inward off
the door, along that edge's own inward normal, only if that cell is walkable.

**One cell, deliberately, and not "walk in until you can turn."** If a house puts you in
a one-wide hall, that hall is real architecture and walking down it is the right thing
to do. One cell is the threshold, and the threshold is the whole defect.

Nothing else moves: the door is one step back the way you came, so leaving works exactly
as before and the exit rule (you may only step off the plate FROM the door cell) is
untouched.

## THE GATE

`gates/stepinside_gate.js`, registered as STEP INSIDE. It **presses the directions**
rather than inferring them:

1. entering lands you OFF the plate perimeter — through the threshold, not stood in it
2. **left or right actually moves you**, driven through the game's own `stepOnce`
3. you can still leave: the door is one step back and walkable
4. a blocked threshold does not teleport you — the rule only fires on a walkable cell

```
STEP INSIDE GATE: 8 passed, 0 failed
```

## NOT FIXED HERE, SO IT IS NOT MISTAKEN FOR FIXED

The working district has **only 6 door cells in the whole thing**
(`records/BOHEMIA_BUILDINGS_HAVE_NO_DOORS_8_2_26.md`). Every house you can walk into now
behaves correctly; there are not many houses you can walk into. That is a separate and
bigger item on his list.

## THE LESSON, WHICH IS THE SAME ONE TWICE TODAY

- A counted `drawImage` is not a visible door (`BOHEMIA_THE_SIDE_DOOR_HE_COULD_NOT_SEE_8_3_26.md`)
- A page that loads is not a world that runs (`BOHEMIA_THE_SUBURB_NEVER_HAD_THE_KIT_8_3_26.md`)
- **A reachable cell is not a pressed direction** (this one)

Three different lanes, one mistake: measuring the thing next to the thing he complained
about. When he says a button does nothing, **press the button.**
