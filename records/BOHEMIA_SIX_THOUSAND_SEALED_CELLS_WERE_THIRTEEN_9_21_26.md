# SIX THOUSAND SEALED CELLS WERE THIRTEEN
# THE WINDOW WAS THE WALL
# LIFE + CITY, 9/21/26, under PAOLO 9/20 rule 18 THE PLAYABLE CUT
# laws/BOHEMIA_ADDENDUM_THE_PLAYABLE_CUT_9_20_26.md

Rule 18 holds this lane: a held lane spends the round measuring its part of loading,
walking or the fight. This is WALKING, and it turned out to be about the instrument
every lane has been judging the ground with, including mine.

---

## 1. WHAT I WENT TO MEASURE

RUN [one camera] shipped the stride and ended its round with a handover:

> "FOUND AND NOT FIXED, NOT MINE: five presses on his own block go into ground a body
>  cannot reach (6270,6268 and 6270,6270), the same shape as 45 doorsteps and 0 straight
>  walkable ways out -- the suburb generator seals yards."

The suburb generator is this lane's. So: size it.

## 2. MY OWN FIRST PASS AGREED, AND WAS WRONG IN EXACTLY THE SAME SHAPE

A flood over the game's own walk flags, in a 384-cell window around his door:

    walkable cells in the window          128,771
    cells he can reach                    122,677
    CELLS HE CANNOT REACH                   6,094     (4.7%)
    in three islands                5,690 / 391 / 13

And the big one looked damning. 5,690 cells, a 117x67 block in a suburb, made of
3,022 cells of house yard, **1,652 cells of ROADWAY** and 422 of sidewalk, walled by
perimeter fence and house wall. That reads like a whole street with its pavements that
nobody can get to, which is a very good match for his own sentence about street for no
purpose.

It is not true.

## 3. RE-RUN WITHOUT THE WINDOW

Flood from each island with no box, until it either meets his ground or runs out:

    the 5,690    SAME GROUND as his
    the 391      SAME GROUND as his
    the 13       ran out of ground in thirteen cells: genuinely separate

**6,081 of those 6,094 cells are his own ground. The honest number is THIRTEEN**, one
5x5 patch behind a chapel.

A flood needs a limit or it runs for ever, and **a limit looks exactly like a wall from
the inside.** My window was the wall.

And the two cells RUN named, measured on this tree: both standable, both **his own
ground**, by a four-way flood and by an eight-way flood, so diagonals are not the
difference either. Said as a measurement and not as a verdict on another lane's gate:
if a flood is bounded, this is the shape that produces that sentence.

## 4. SO THE TEST LIVES IN THE LATTICE NOW, AND IT ANSWERS IN THREE STATES

`BOH_LATTICE.reaches(ax, ay, bx, by, ctx, opts)`:

    joined              the same ground, and the walk found it
    closed              it ran out of GROUND and never pressed the box edge: SEPARATE
    ranOut              it ran out of BUDGET, or closed against the box: UNKNOWN

**There is no bare false to misread.** A caller that treats `ranOut` as sealed is making
this mistake again, so the field is named for what it is, and every answer carries the
window it was taken in, because a number without its window is not a measurement.

**AN INSTRUMENT THAT CANNOT SAY "I DO NOT KNOW" WILL SAY "NO".** That is the line this
round is for. It is the same family as three earlier ones from this lane:

    an instrument that cannot return "no" is not an instrument        (9/15)
    a straight line is not a body                                    (9/16)
    an instrument that assumes a step length measures its assumption  (9/20)

## 5. AND TO PROVE TWO THINGS ARE SEPARATE, FLOOD THE SMALL ONE

The first working version only ever flooded from the first point, and on the real
surface that made the answer depend on which end you named.

Flooding out of his own street presses the box edge thousands of times and can never
close, so the thirteen-cell pocket came back **UNKNOWN** — correctly cautious, and
useless. Flooding out of the pocket closes in **thirteen cells** and proves it.

Separation is symmetric, so the test tries the other end whenever the first is
inconclusive, and says which end answered. **It never flips a "no" into a "yes"**: only
a clean close, with the box never pressed, is allowed to prove anything.

## 6. THE GATE

`gates/the_window_is_not_a_wall_gate.js`, in the suite as THE WINDOW IS NOT A WALL.
15 pass / 0 fail.

Leg B is the three states on worlds with known answers, and the two that matter are:

- **an endless wall in an endless world must come back UNKNOWN, never SEALED**
- **a tiny sealed pocket in a huge open world must be PROVED, from the small end**, in
  under a hundred cells looked at

Leg C is the real surface, and it prints the whole finding every run:

    a 384-cell window says he cannot reach : 6094 cells
       5690 cells at 6026,6076  ->  SAME GROUND
        391 cells at 6401,6401  ->  SAME GROUND
         13 cells at 6095,6415  ->  RAN OUT OF GROUND: PROVED SEPARATE (13 explored)
    PROVED separate, unbounded            : 13 cells

Mutation: treat a limit as a wall, which is the old mistake, and B3, B4 and B8 go red.

## 7. WHAT THIS MEANS FOR THE THING HE ACTUALLY PLAYS

**The suburb does not seal his block.** Thirteen cells of unreachable ground in a
384-cell window, behind a chapel, is not a defect anyone would feel.

That does not make RUN's five presses imaginary. A press can be refused for reasons
that have nothing to do with sealed ground, and this round only settles one of them:
**it is not that the ground is cut off.** The stride's own numbers (0 stuck of 45 after
their fix) are the measure of the rest.

## 8. WHAT THIS ROUND DID NOT DO

Nothing else shipped; the lane is held. The walked surface carries one addition, the
reachability test, exported and called by nothing in the game. No art, no generation,
no movement changed.

`BOH_LATTICE.reaches` is on `__proof.lattice` with the surface's own walkability wired
as `__proof.latCtx()`, so any lane can ask the question without writing a fourth flood.
