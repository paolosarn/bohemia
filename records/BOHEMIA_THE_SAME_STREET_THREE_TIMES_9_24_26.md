# THE SAME STREET, THREE TIMES
# LIFE + CITY, 9/24/26, row [three cities] — the row's own deliverable
# ONE BLOCK. THREE DATES. AND THE MACHINE COUNTS THE FLOOR INSTEAD OF PROMISING IT.

---

## 1. THE ROW SAID "THE SAME GROUND THREE TIMES", SO THAT IS WHAT GOT MADE

Rule 31: *"the city screen draws whichever act he is in; the same ground three times."*

Last round I measured the wiring half of that and it came back empty: `ACT`, `DYNASTY`,
`ERA`, `BohemiaDynasty` and `BohemiaDerive` are **all undefined** and there is no
`DAY.act`. The act does not exist as a value anywhere in the world, so "draw whichever
act he is in" cannot be wired by this lane on its own.

**Rule 12 says a dependency is a premise, not a gate.** The half that does not wait on
a variable is **what each act looks like, and whether the difference reads at all**.
That is answerable now, with no other lane, and it is the half he actually votes on.

In the **VOTE tab**: `slices/vote/LIFECITY_THE_SAME_STREET_THREE_TIMES_9_24.png`,
672 x 1692, three panels stacked.

    ACT 1   the ruin, the exact picture he already voted up
    ACT 2   + the road patched, the power back, an array and a battery cabinet,
              the line restrung
    ACT 3   + a second array across the road, the kerbs and walks rebuilt, the lamp
              doubled, and the dead lot turned into a battery swap stand

## 2. RULE 32(b) IS CHECKED BY THE MACHINE, NOT PROMISED IN A COMMENT

Paolo 9/23: **the ruin is act 1's FLOOR, never a fall. Nothing decays below the start.**

A law without a machine gate is not enforced, and that goes for a law about pictures.
So the factory renders all three panels, then walks all 21,504 pixels of each pair and
counts every pixel that got **darker** between one act and the next. Darker is the
world falling. It **refuses to write the file** if the count clears the allowance.

    act 1 -> act 2      146 darker    848 brighter
    act 2 -> act 3      451 darker   3524 brighter
    allowed darker     1400   (shadow and edge under new hardware only)

The allowance exists because new hardware is a solid object and a solid object has an
edge and a shadow: a roof under a panel array is legitimately darker than bare roof.
Everything else darkening would be the picture telling him the opposite of his ruling.

And the same law is written into the control flow: **there is not one `if act` branch
anywhere in the file that removes something.** Every later act is the earlier act's
body plus its own additions, drawn on top.

## 3. THE ONE THING THAT NEVER CHANGES

Bible rule 1 is one ordinary frame with ONE wrong thing. Bible rule 7 is that the wrong
thing is drawn from world data, never faked. The measured row both approved pictures
used is the same one here:

    lamp ground, circuit LIVE          264
    lamp ground, circuit dark        2,170
    LIT, AND THE CENSUS SAYS EMPTY     168
    lit, and somebody lives there       96
    this block                    59,4 arterial, on MOB's wire

The third house is lit with nobody in it in act 1. It is lit with nobody in it in act
2. It is lit with nobody in it in act 3. **Its code block is deliberately outside every
`if act` in the file**: it is the only thing on that street that does not know which
act it is in.

**THE STREET COMES BACK TWICE AND THE EMPTY HOUSE NEVER DOES.**

## 4. THE LESSON FROM ACT 2 IS BUILT IN, NOT REMEMBERED

Act 2's first cut lit every reclaimed house in **the same warm bulb the empty house
already had**, so all four read identical and the wrong thing vanished into the
improvement. **IF EVERYTHING GETS BETTER IN THE SAME WAY THE WRONG THING ALREADY WAS,
THE WRONG THING VANISHES** — bible rule 1 failing from the opposite direction to the
shop he killed: not six wrong things, but none.

Reclaimed light is panel-fed and **cold** in every act here, so the untouched house
stays the one warm window in a street of cold ones and reads at a glance in all three.

## 5. AND ONE DEFECT FOUND BY LOOKING AT IT, WHICH IS THE ONLY WAY THEY GET FOUND

The act-3 swap stand came out a **grey blob**. The cause was draw order: I poured the
hardstand, racked the cells, and then threw the work light **over the top of them**, so
the pool washed out the only thing it was there to let you see.

Light lands on ground and hardware stands in it: **ground, then the pool, then the
rack.** Same family as the bullseye lamp (a pool is filled, not ringed) and the grey
blind (a window is the room, not the wall dimmed less) — one layer further in each
time. Fixed, re-rendered, re-looked at.

## 6. WHAT IS STILL OPEN ON THIS ROW

**[PENDING Paolo], carried from last round and unchanged by this:** the future fits in
6.7% of the valley. 620 desert, 4,074 already built, 4,522 skeleton, of 9,216. Under
rule 32(b) either acts 2 and 3 differ from act 1 by at most that 6.7% of the ground, or
**reclaiming means REPLACING the 4,074 that are already built** — which this picture is
the argument for, since every panel above is the same footprint rebuilt, not new ground
taken. His call, not mine.

Row status: the LOOK of three acts is answered and in his hands. The WIRING waits on an
act value existing in the world, which is not this lane's file.
