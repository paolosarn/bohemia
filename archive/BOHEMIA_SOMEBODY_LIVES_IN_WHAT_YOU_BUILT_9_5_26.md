# SOMEBODY LIVES IN WHAT YOU BUILT — and housing does not create people
(9/5/26, LIFE + CITY lane. VAMILY job `[people housed] HOUSING`.)

## WHAT WAS MEASURED FIRST

Build a suburb on empty desert and the valley's census does not move. **297 people
before, 297 after**, and `headsAt()` on the plot you just built answers **0** both
times.

That is not a bug in `engine/bohemia_population.js`. It is the module answering a
different question. Everything it knows comes from the **seed**: `zoneAt()` surveys a
4x4 neighbourhood, rolls his ruled three-zone share against a hash, and a quarter of
the map is `'empty'` **on purpose**
(`laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26.md`).

**The population was a function of the seed, not of what the player built**, and
there was no path at all from *"I built a house"* to *"somebody lives in it."*

The 7/26 law is LOCKED and has two halves: **"BUILDINGS: house people or produce one
of the three. That's the economy."** Production shipped earlier this round. This is
the half that was still zero.

## THE DESIGN DECISION, AND WHY IT IS ALLOWED TO BE MINE

> ### HOUSING DOES NOT CREATE PEOPLE. IT HOUSES THEM.

His 7/29 ruling is LOCKED and it is not a detail: **the population IS the food
carrying capacity** — *"mfs gotta eat and drink"* — ~65,000 in the valley, ~300
walkable bodies, and the research behind it found the food supply **cannot
meaningfully grow in a lifetime** (the valley is caliche; soil is *built*, at about
20 acres a year).

A city builder where putting up flats makes new people appear breaks that law
quietly, in the direction every city builder drifts. So:

| | |
|---|---|
| **CAPACITY** | how many your buildings *could* house — grows when you build |
| **RESIDENTS** | how many actually live in what you built — capped by the valley |

People move into what you build **from the valley they were already in**. That costs
the food ceiling nothing, it is what actually happens when better housing appears
where people already live, and it hands the **century rule** the number it has been
missing: how many the dynasty housed, act over act.

## NOTHING HERE IS TYPED

- **Which** buildings house anybody: `BohemiaPopulation.RESIDENTIAL`, the same map
  the whole valley is already counted from. A solar farm having no beds is an
  **answer**, not an unruled number.
- **How many**: `HOUSEHOLD_MEAN = 2.2`, already in that module, already researched,
  already the number the rest of the valley is counted with. One building is one
  household. **[PENDING Paolo: whether an apartment block should hold more than a
  trailer.]**
- **What counts as one building**: borrowed whole from `BohemiaProduction.placed()`,
  so a 4-lot block is one household here exactly as it is one payout there. A third
  opinion about what a building is would be this lane's fourth post-mortem on the
  subject.
- The mean lands on the **total**, never rounded per plot: ten homes house 22, not
  20. Rounding 2.2 down at every plot would quietly delete a fifth of everybody.

## WHAT HE SEES

    empty desert       "costs one battery · you have one"
                       "houses about 2 people"
    a plot he built    "2 people live here, in what you built"
    generated ground   "one person lives on this block"
    the morning card   "2 people sleep under a roof you put up."

The morning line reports a **standing fact**, not a change — a roof is not an event.
It is true every morning until he builds again, and a line that only appeared the
morning after a build would make him think they left.

## A NUMBER IS NOT HONEST UNTIL ITS UNIT IS

`headsAt()` takes a cell, resolves it to its 4x4 block, and returns **the block's**
heads. Reporting that as "people on this plot" would claim one settlement of thirteen
**sixteen times over**. So `residentsAt()` carries the scope with the number: his own
plots are `scope:'plot'`, generated ground is `scope:'block'`, and the panel says
which out loud.

## THE GATE, AND THE TWO THINGS IT CAUGHT IN MY OWN WORK

`gates/housing_gate.js`, **18 pass / 0 fail**, on the walked surface and in the cut
demo (rule 7).

**1. The law was breakable by a measurement failure.** The first cut returned `0` for
*"the valley is empty"* and for *"I cannot see a valley."* With no world to census
the cap fell through and 400 blocks of flats housed 88 people out of a valley of
none. `valleyPeople()` now returns `null` for unmeasurable, and an unmeasurable
valley houses **nobody** rather than everybody. A6b and A6c hold the two cases apart.

**2. A mutation slipped through, and the leg that let it through was mine.** Flipping
generated ground's scope to `'plot'` left the browser leg green — because that leg
decided what to expect **from the answer it was checking**. B1 now takes its
expectation from an independent fact (did *he* build this plot), and A7b was added.
**A test that grades a claim against itself is decoration.**

| mutation | legs that went red |
|---|---|
| remove the food-ceiling cap | A6, A6c |
| round the mean per plot instead of per total | A4, A5 |
| report generated ground as a plot | A7b, B1 *(neither, before the fix)* |

## THE STANDING NOTE

**A LAW YOU CAN BREAK BY FAILING TO MEASURE IS NOT ENFORCED.** The food ceiling held
in every case I had thought about and fell over in the one I had not — where the
answer was not "no" but "I don't know." Zero and unknown are different numbers, and
a system that returns the same value for both will pick the wrong one exactly when it
matters.
