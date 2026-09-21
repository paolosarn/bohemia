# THE BATTERY SHED, AND THE LOT THAT WAS A STRIDE
# LIFE + CITY, 9/21/26, under PAOLO 9/21 rule 22 COOK EVERY ROUND
# laws/BOHEMIA_ADDENDUM_COOK_EVERY_ROUND_9_21_26.md

> "I need the UI chat to be cooking up more... I'll enter the sound chat and it's not
>  even making fucking sounds. It's coding and checking whether the sounds are broken
>  or not. It's so fucking strange. I need to be seeing them cooking up more, every
>  time, not never."

He is right about this lane too. The last two rounds from LIFE + CITY were a
measurement and a measurement. Rule 22 says a making lane makes one real thing every
round or the round did not happen, and it names this lane's thing: **a building**.

---

## 1. THE THING: THE BATTERY SHED

`slices/vote/LIFECITY_THE_BATTERY_SHED_9_21.png`, in the **VOTE tab** as
*THE BATTERY SHED, THE FIRST BUILDING THAT MAKES MONEY*.

The small battery shed a player puts on their **own lot**. Not the grid-scale storage
yard, which already exists as a district (three fire-lane rows of containers behind a
double fence). This is the house-sized one, the row this lane has had open as
[power buildings]: you build it on your land and a battery comes in. Batteries are the
money, so it is the first building in the game that makes the money.

**Footprint 5 x 4 fine cells against a lot of 24**, about 3.8 m by 3.0 m: a real
utility shed, smaller than a single-car garage, which is what a household battery
enclosure is. The lot number is read from the lattice, never typed.

**ANALOG HORROR AT THE SOURCE, NOT A FILTER** (rule 20). The frame is ordinary: a metal
shed on a dead lot, gravel, a chained door, a meter on a conduit, a dead pole light,
dead brush. **One thing in it is wrong, and it is the only saturated colour in the
picture: the indicator lamp is still lit.** Nothing else on the lot has power, the
meter needle is stuck, and this box is still working. No grime layer, no scanline. The
only light it throws is the short bloom a real indicator LED throws on the metal beside
it, which is AH-01's "the light was in the room".

**REUSE-FIRST:** the palette is pulled **live** out of `engine/bohemia_battery.js`, the
battery district's own canon, so the shed and the big yard are the same world and one
source of truth sets both. The factory refuses to run rather than falling back to
invented colours.

**I DREW IT WRONG FIRST AND COMPARED IT TO THE WORLD.** The first cut was a side-on
isometric box with a black void above it. The walked city is nothing like that: it is
seen from above, every building is its roof plus the one wall that faces you, and there
is no sky in the frame because you are looking down. Redrawn top-down with the ground
filling the picture, which is what it looks like when he walks.

## 2. AND THE MEASURING RODE BESIDE IT: [one lot number]

ANIMATION found **three live numbers for one lot**: `BOH_LATTICE.LOT_FINE` 24,
`BODY_SCALE.lotFine` 25, `STEP_CELLS` 25. Rule 16 is one constant in one place.

**I TRIED THE OBVIOUS FIX FIRST AND IT MADE THE GAME WORSE.** Pointing everything at
the lattice put all three at 24, and RUN's own walk gate went **19/0 to 17/2**: five
stuck presses and two gaps walked past on his own block, where the whole row's ship
test is zero of each. Backed out rather than shipped.

**THERE ARE TWO THINGS AND THREE NAMES.**

    THE LOT      24   what engine/bohemia_suburb.js packs houses on, and the gate
                      holds it against that generator on every run
    THE STRIDE   25   how far one press carries him, RUN's number, measured on the walk

**And the field called `lotFine` was the stride wearing the lot's name.** Its only live
reader was the line that sets `STEP_CELLS` from it; the body is a constant now
(CHARACTER [body fixed]) and `lotFitsOnScreen` is uncalled. So that number has never
been the lot at all. Renamed to `strideFine`. Nothing moved: 25 is still 25.

**IS THE LOT 24 OR 25? MEASURED ON THE GROUND, NOT ARGUED.** 54 house-to-house pitches
across 15 scan lines through the suburb he wakes in:

    median pitch            24 fine cells
    commonest   22 (x8)  24 (x8)  23 (x6)  25 (x6)  26 (x4)

The distribution jitters either side of 24 because the house models are different
widths. That is how a walk of real footprints landed on 25 and the generator's designed
stride is 24, and **neither measurement was wrong**. 24 is the one with a gate under it.

**AND MY OWN RENAME BROKE RUN'S GATE FOR ONE RUN.** Removing `lotFine` outright made
THE WALK NEVER MISSES report *"a house fits on the glass (NaN px lot on a 378 px
screen)"* — other lanes ask this object for the lot. **A rename is only honest if the
thing that was really meant is still there under the right name.** The lot is back,
reading the lattice, and the gate leg is now "no TYPED lot" rather than "no field
called lot", which was the wrong rule written in a hurry.

Left for RUN, measured and not decided: whether the stride should BE the lot. That is
[one camera]'s call and it costs five stuck presses at 24 until the stride rules are
re-measured at that length.

## 3. GATES

    WHERE A STEP MAY LAND           39/0   (three new legs for the one lot number)
    THE WALK NEVER MISSES (RUN's)   19/0   restored, checked before and after
    THE STRIDE NEVER MISSES         green
    THE WINDOW IS NOT A WALL        green
    THE VOTE TAB                    28/0   with the shed registered

Red on main and **not moved by this diff**, checked on a clean copy: REUSE-FIRST and
REFERENCE CHECK (86 unchecked against a frozen 85, identical on clean main). The new
factory carries both a REUSE CHECK and a REFERENCE CHECK block and passes its own legs.

## 4. WHAT THIS ROUND DID NOT DO

Nothing went to the play surface beyond the one lot number's rename, which moves no
value. The shed is in the VOTE tab, which is where rule 22 puts everything made while
rule 18 holds the play surface.
