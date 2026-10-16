# THE POPULATION DIAL — PLUMBING FOR THE SLIDER HE IS GOING TO MAKE (8/1/26)

Paolo: "why don't you do some coding plumbing right now till I make a population
slider ... I think this is gonna be extremely important anyway as we go throughout
the three acts ... it should be something that's extremely easy to control ... the
slider can go all the way from zero to a maximum right now."

MECHANISM-MINE AT ITS PUREST: the wiring is mine, the slider and every number on
it are his.

## WHAT IT IS

ONE number. Everything in the game that asks "how many people live here"
multiplies by it, so how full the valley is became a single thing to drag instead
of an argument between three files.

    0     A GHOST VALLEY. Not "fewer people" — NOBODY, anywhere. It has to be a
          real zero or the bottom of his slider is a lie.
    1     exactly what the world does today. THE DEFAULT, so nothing moved.
    4     (DIAL_MAX) the fullest the valley is allowed to get.

Measured across the valley, sampled every third cell:

    dial 0     ->     0 people,   0 cells
    dial 0.5   -> 1,037 people, 154 cells
    dial 1     -> 2,147 people, 160 cells
    dial 2     -> 4,310 people, 162 cells
    dial 4     -> 7,026 people, 162 cells

## THE ONE DESIGN DECISION IN IT

**The dial says HOW MANY. It never says WHERE.** His 7/29 ruling is that the
valley is clusters AND no man's lands AND random spread — a shape, not a number.
So turning the dial down THINS the same valley; it never relocates anybody. The
cells alive at a lower setting are a strict subset of the cells alive higher up,
and the gate asserts exactly that. Clusters stay clusters at every setting.

## WHY IT EXISTS

records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md, measured hours earlier:
the flat placeholder said 8,282 people in the valley, the zone map said 60, and
GDD v5 says ~69,000 survive — and there was no way to move any of them without
editing code. Now there is one number, and it reaches BOTH paths (the zone map
inside occupiedRateFor, and the agents module's own placeholder), because "zero
means nobody" has to be true whichever way a caller got its rate.

## THE ACT TABLE SHIPS EMPTY

He said the slider matters "as we go throughout the three acts". Three acts
probably want three settings and WHICH numbers is his call, so `ACT_DIAL = {}`
and `dialForAct()` returns null. people_gate fails if a row lands unruled — the
realistic way this breaks is a future session adding placeholder act numbers to
"test it" and the placeholder becoming canon by shipping.

## WHERE IT LIVES

    BohemiaPopulation.dial()            what it is now
    BohemiaPopulation.setDial(v)        move it, clamped to 0..DIAL_MAX
    BohemiaPopulation.applyDial(rate)   the one place it is applied
    BohemiaPopulation.ACT_DIAL          HIS. EMPTY.

A slider only has to call setDial() and rebuild the block. Nothing else needs to
know it exists.

## GATE
people_gate.js part E, 11 claims, including the REAL RUN emptying when the dial
goes to zero — a dial nothing consumes is a decoration. Two mutations proved
red-able: zero quietly stopping meaning zero, and placeholder act numbers landing
in his table.

## WHAT IS STILL HIS
The population CONTRADICTION is not resolved by this and was not meant to be. The
dial makes the answer changeable in one place; which answer is right is still the
one-sentence question from the last turn: walking one block from home, how many
people should be on that street.
