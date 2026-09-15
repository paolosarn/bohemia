# HIS SCREEN IS ONE HOUSE WIDE (RUN, 9/15/26)

VAMILY `[step is a house]` / ONE-STEP-IS-ONE-LOT-AND-THE-BODY-IS-BIG.

> **PAOLO 9/15, LOCKED:** *"I just entered combat and this is not at the scale that
> I needed it to be... even when it comes to traversing the city I want people to be
> larger, cause remember each tile is the size of a house... however long it takes
> right now to walk the length of a house, that would be done in one step."*

The row says MEASURE FIRST and write three numbers down. I did, and **two of the
three numbers on the board are wrong, and the measurement refuses the ruling's
literal reading.** That is the finding.

## THE THREE NUMBERS, MEASURED ON THE GLASS

    a step      1 fine cell = 0.75 m = 0.084 min, drawn 18 px at walk zoom
    a lot       the overmap cell, FN = 128 fine cells = 96 METRES
    a house     his own, 21 x 12 fine cells = 15.75 x 9 m, drawn 378 x 216 px
    his phone   390 px wide = 21.7 fine cells = 16.3 m

Sources, so none of it is typed here: `FN` and `TW` read off the running game;
`0.75 m a cell` and `9 m a minute` from the reach module, which owns the speed;
`MIN_PER_CELL = 0.084` from the walked surface; the house from `homeFind()`.

## THE NUMBER THAT DECIDES EVERYTHING

    HIS SCREEN IS 1.03 HOUSES WIDE.

## SO THE RULING CANNOT BE SHIPPED LITERALLY, TWO WAYS OVER

**The board's reading.** It says *"a lot is FN=32 fine cells"* and *"one step lands
on the next lot"*. **FN is 128, not 32.** A lot-sized step is **96 metres** -- which
is exactly the CITY-mode step that already exists and already costs ten minutes.
Doing that on the street does not coarsen the street, it **deletes** it: the walked
view becomes the map view.

**His own words.** One step = one house = 21 cells = **a whole screen**. At 120 BPM
that is **two screens a second**. Nobody can read that, and he is the one who said
readability is the guide here.

The law anticipated this: *"a rebuild is refused unless the measurement says the
lattice cannot coarsen."* The measurement says it cannot coarsen **that far at this
zoom** -- and the reason is the zoom, which is the other half of what he asked for
in the same breath (*"I want people to be larger"*) and which is `[zoom meets]` on
this same lane.

## WHAT SHIPPED: THE STEP IS AS BIG AS THE ZOOM ALLOWS, AND IT IS ONE NUMBER

**A quarter of his own house.** You cross your own frontage in four steps instead of
twenty-one; the view moves a quarter screen a beat instead of a whole one.

    STEP_CELLS = 5      fine cells per beat on foot

Derived, not picked: his house is 21 cells on its long side and his phone holds
21.7, so a quarter house is the largest step that leaves the picture coherent today.

**ONE NUMBER IN ONE PLACE**, which the law demands twice. The bike keeps its 7/6
ladder as a **multiple** of the walk rather than a second opinion about what a step
is: `per = (RIDING ? 4 : 1) * STEP_CELLS`.

**THE CLOCK IS NOT TYPED AND CANNOT DRIFT.** Every cell crossed still pays its own
`stepCost()` into `advance()`, so the day, the distances, the jobs and the rent
nights stay exactly as true as they were. Measured on the glass, ten seconds of
holding one direction:

    before   about 19 cells    14.6 m
    after       123 cells      92.3 m     and the clock charged 9 minutes,
                                          0.0732 per cell -- between the 0.084
                                          baseline and the 0.042 pavement rate,
                                          which is what mixed ground should cost

**Six times faster in real time, and identical in game time per metre.** That is his
sentence exactly: *"It would make travel faster too, in multiples."*

## WHAT IS NOT DONE, AND IS NOT PRETENDED TO BE

- **Bodies are not bigger yet.** That is the other half of his ruling and it belongs
  with CHARACTER's cast bake; a body is about 41 px for a realistic 1.7 m at this
  zoom, and making it bigger without the zoom change makes a person taller than a
  doorway.
- **The fight board is untouched.** He entered a fight and the scale was not there;
  that is COMBAT's side of the same ruling.
- **The full house-sized step waits on the zoom**, and this record is the argument
  for why `[zoom meets]` is now the thing that unlocks the rest of rule 16 rather
  than a separate nicety.

## THE SHAPE OF THE MISTAKE I DID NOT MAKE

The easy round here was to read "one step lands on the next lot", set the step to
FN, watch the walked world turn into the map, and call rule 16 shipped. The three
numbers took ten minutes to measure and they are the whole difference between that
and a step he can actually use.
