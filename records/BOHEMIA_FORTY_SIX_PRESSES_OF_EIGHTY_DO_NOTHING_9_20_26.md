# FORTY-SIX PRESSES OF EIGHTY DO NOTHING
# THE LANDING RULE, MEASURED, FOR RUN [one camera]
# LIFE + CITY, 9/20/26, under PAOLO 9/20 rule 18 THE PLAYABLE CUT
# laws/BOHEMIA_ADDENDUM_THE_PLAYABLE_CUT_9_20_26.md

> "I'm zooming out and my person becomes bigger... walking the same distance and
>  crashing into walls because it's forcing me to move like 67 tiles at a time, so when
>  I'm trying to walk past the wall it's not allowing me to because I'm just missing it."

Rule 18 holds this lane: nothing ships to the alpha except loading, walking and the
fight, and a held lane spends the round measuring its part of the three. This lane's
part is named in RUN's own row — "a press moves him to the next standable place toward
the press **using LIFE+CITY's landing rule**" — and the lane's MODE line says the
landing rule may ship for that alone. This is the rule, and the number on it.

---

## 1. THE NUMBER

80 presses around the block he wakes on, driven on the demo, both rules run on a copy
of his position so neither of them touches the game's own step.

    he wakes at 6218,6268.  Today a press is 25 cells. A lot is 24.

                        stuck   cells   slid   ended at a gap   places reached
      what ships today     46     804      0                0               23
      the landing rule      0   1,625     27                8               69

**FORTY-SIX OF EIGHTY PRESSES DO NOTHING TODAY.** More than half. That is his sentence
with a number on it, and RUN's ship test for the row is "zero stuck presses", which the
rule meets.

**And the live stride is 25 cells, one cell MORE than a whole lot.** A press is longer
than a house. That is the "67 tiles at a time" half of what he said: the jump is fixed,
so it either clears the wall entirely or refuses, and it can never put him beside a
doorway.

## 2. WHAT THE RULE IS

`BOH_LATTICE.stride(hx, hy, direction, ctx)`. Walk from where he actually stands,
toward the press, **cell by cell**, and stop:

- at the first cell that is not standable, so it can **never end in a wall**
- and never **past a gap**, for the same reason: a gap is a cell it will not enter, so
  it cannot be crossed. No leaping.
- at one lot, which is the **CEILING and never a grid**. The ground decides how much of
  it he gets.
- with **no corner test on the diagonals**, so a one-cell doorway is a doorway. That is
  the other half of "I'm just missing it".

**The landing and the stride are two different answers, and confusing them is the bug
he is describing.** `landing()` is where an ARRIVAL goes: a city tap names a place and
the lot's doorstep is where you are put down. A stride is not that. Snapping a stride
to lot corners **is** "it's forcing me to move like 67 tiles at a time" — it lands him
past the doorway he was aiming at. So the lot is a ceiling here and nothing else.

## 3. THE SLIDE TOOK THREE GOES, AND THE FIRST TWO WERE BOTH WRONG

**One tier, 45 degrees.** Useless against a straight wall. Press east at a wall running
north-south and NE and SE are just as much into it. On a test world with exactly that
shape it answered STUCK where a player would have walked.

**Two tiers, longest run wins.** Now it slides — a **whole lot sideways**. Which is his
complaint again wearing a different coat: press east at a wall with a doorway three
cells north of you and it carries you 24 cells south, past it.

**Stop at the gap.** A slide ends the moment **the direction he pressed** opens up
again. He finishes lined up with the way through, and the next press takes it. Two
presses to get past a wall, which is what "walk past the wall" means.

So the choice between the two slide directions is not the longer run:

    a run that ends lined up wins
    between two lined-up runs, the SHORTER, because that is the nearer gap
    if neither lines up, the longer, because then he is just making his way along
    ties to the clockwise side, so one press always does one thing

## 4. ONE PRESS IN EVERY DIRECTION, FROM WHERE HE WAKES

    press N   -> 24 cells                       LOT
    press NE  -> 13 cells, going N              SLID TO THE GAP
    press E   -> 24 cells                       LOT
    press SE  ->  2 cells                       GROUND
    press S   ->  2 cells                       GROUND
    press SW  ->  2 cells                       GROUND
    press W   -> 24 cells                       LOT
    press NW  -> 24 cells                       LOT

The short ones are the kerb two cells south of his door. The rule gives him the two
cells instead of refusing the press, which is the whole difference.

## 5. THE GATE

`gates/the_stride_never_misses_gate.js`, in the suite as THE STRIDE NEVER MISSES.
18 pass / 0 fail.

Leg B is the three-goes history frozen on a world with a known answer: the wall with a
doorway, the wall without one, the one-cell world, the box. Leg C is the 80 presses on
the demo, and it also checks the two invariants that must never break — **no stride
lands in a wall, no stride is longer than a lot**.

Mutations, both run:

    drop the slide from the engine        -> B4, B5, B6, B8, B10 red
    drop it from the shipped copy         -> C1 red at 40 stuck of 80

That second one matters: the gate measures the surface he plays, not the file I edited,
so it would have caught a fix that landed in the engine and never reached the game.

## 6. WHAT THIS ROUND DID NOT DO

**Nothing else shipped.** Rule 18 holds this lane and the walked surface carries one
addition: the rule, exported, called by nothing yet. The player still moves 25 cells a
press, because the step belongs to RUN [one camera] and this is the ground under it.

`BOH_LATTICE.stride` is on `__proof.lattice` with the surface's own walkability already
wired as `__proof.latCtx()`, so RUN's step can call it without writing a second opinion
about what is standable.

The two parts of [one camera] that are not mine are untouched and unmeasured here: one
walking camera where a house fits, and the body at one fixed size that does not change
when he pinches. `BOH_LATTICE.LOT_FINE` and `BODY_LOTS` are the numbers those read.

## 7. A LIMIT OF MY OWN RULE, FOUND BY MY OWN GATE, BEFORE RUN BUILDS ON IT

THE STREET IS REACHABLE FROM THE DOOR went red this round and the reason was not the
street. Its walk had been aiming in single cells and pressing a pad that now moves 25,
so it overshot its own plan and circled: 40 presses, no arrival, on a block it had
reached in five a few rounds earlier. **The block had not changed. The stride had.**

Rebuilt to follow the route and measured three ways from his door to the nearest road,
21 cells away:

    one cell at a time                  21 presses, ARRIVES
    a full stride every press           60 presses, never arrives, oscillates
    the shipped 25-cell step            the same, and it is where cut 2 got stuck

    6218,6268 -> 6216,6270   (route 21)
    6216,6270 -> 6192,6270   (route 19)
    6192,6270 -> 6216,6246   (route 21)
    6216,6246 -> 6225,6255   (route 33)   <- going backwards now
    6225,6255 -> 6221,6255   (route 31)
    6221,6255 -> 6208,6242   (route 27)
    6208,6242 -> 6221,6255   (route 37)   <- and ping-ponging

**A STRIDE THE LENGTH OF A HOUSE OVERSHOOTS A ROUTE SHORTER THAN A HOUSE, AND THEN
OVERSHOOTS IT BACK.** That is the same shape as his own sentence, and it is a property
of a long stride, not of a bad one: my rule does it too. The slide fixes lining up with
a WALL; nothing yet fixes lining up with a PLACE that is nearer than one press.

**This is not mine to decide** — how far one press goes is RUN [one camera], and the
lot ceiling is Paolo's own 9/15 ruling. Named here with the numbers so RUN meets it
before building the camera on top of it, rather than after. If it wants a shape from
this lane: the ceiling could be the distance to the thing he is heading for when that
is nearer than a lot, which is the same sentence the slide already follows for walls.

The gate now decides on the ground claim only — follow the route one cell at a time,
21 presses, arrives — and **prints both stride walks beside it without deciding on
them**, so the oscillation is visible every single run instead of folded into a pass.
