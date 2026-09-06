# YOU HEAR IT BEFORE YOU SEE IT — the street finally says something
(9/6/26, LIFE + CITY lane. VAMILY job `[more people] POPULATION-DEFAULT`, round 4. The row stays OPEN.)

## WHAT WAS LEFT

Round 3 put the thirteen settlements on the map. A map is a thing he has to **think
to open**. Nothing has ever told him a crowd is there **while he is walking**, and
the walked status line has been the hard-coded string `'walking your own block.'`
since the day it was written — it has never said one word about the world.

The population module's own phrase for what this should feel like:

> *"you hear a settlement before you see it"*

## THE RANGE IS DERIVED, NOT PICKED

This lane may not invent numbers about people, so the earshot is not one:

- Sound from N sources falls off as **1/d²**, so a crowd of N carries to **√N** times
  the distance one person does.
- One person is the repo's **own `SEE_RANGE`** — 9 cells, `BohemiaStanding`'s number
  for how far a body can be made out.

Which makes the module's sentence come out **literally true**: everything is heard
further than it is seen, and a crowd much further.

## MEASURED BEFORE IT WAS BUILT

A mechanism that is right and never happens is not a deliverable, so the question
"would this ever fire" came first:

```
biggest crowd standing at one place anywhere      18 people
what that buys it                                 38 cells, about 4 screens
at the cell he wakes on, every hour               NOTHING
   (the nearest place is 97 cells off, holding 8)
four 400-step walks from there at 10:00           two come within earshot,
                                                  first at step 91 and step 156
```

**He has to walk toward it.** That is the point, and it is what stops this being a
compass.

## WHAT IT SAYS, AND WHEN IT DOES NOT

```
2:00  quiet      10:00  "you can hear people, northwest."
6:00  quiet      14:00  quiet
                 18:00  "you can hear a crowd, northwest."
                 22:00  quiet
```

Two of four walks from the wake cell hear something. The valley is silent at night
because everybody is indoors, and silent in the afternoon heat because the module's
own rule sends them in. **The day has a shape in the ear.**

**WORDS, NOT AN ARROW**, which is this repo's own ruling, from the address gate:

> *"Morrowind put its directions in dialogue and no marker on the map ... Bohemia is
> a city whose phones do not work, so a compass that always knows where everybody is
> would be the strangest object in it."*

The line is an attempt, `draft:true`. It never names a distance — an ear does not
measure metres — and the old default is kept for the (many) places with nothing to
hear, because that is the honest answer and not a gap to paper over.

**The one you hear is the loudest, not the nearest.** A big crowd further off carries
over a pair of voices next door, and getting that backwards would point the line at
the wrong thing exactly when it matters most.

## WHAT IT COSTS, STATED

This lane's own new `[draw budget]` row says anything new arrives with its cost.
This draws nothing, but it walks nine neighbourhoods and the HUD repaints on every
step:

```
0.044 ms  when it recomputes        0.01% of a 500 ms beat
0.0002 ms when cached               cached per cell per ten minutes of game time
```

## THE PROBE THAT REPORTED A MISSING FEATURE THAT WAS THERE

The first check of "does it reach the glass" called `hud()`. There is no such
function; it is `updHud()`. The probe's `try/catch` swallowed it and reported the
note still reading `walking your own block.` — **which is exactly what a real defect
looks like.**

> A PROBE THAT CALLS THE WRONG NAME REPORTS THE FEATURE MISSING, AND IT IS
> INDISTINGUISHABLE FROM THE FEATURE BEING MISSING. Same family as measuring the
> wrong surface and sampling the wrong pixel; the fix is the same one every time —
> make the probe fail loudly instead of quietly answering "no".

The gate calls `updHud()` bare, with no catch, so this can never be quiet again.

## AND A SCAN OF A SLEEPING VALLEY

The measurement of "the biggest crowd anywhere" first answered **1 person**, which
contradicted round 2's own measurement of 8 at a single place. The scan had run at
whatever minute the restore had just put back — six in the morning, when the valley
is asleep. At 10:00 the answer is **18**.

> A scan of a sleeping valley is a scan of a sleeping valley. **When a measurement
> contradicts one you already trust, the probe is the first suspect, not the world.**

## THE GATE

`gates/hear_the_crowd_gate.js`, **9 pass / 0 fail**, in the cut demo.

| mutation | legs that went red |
|---|---|
| earshot infinite — it becomes a compass | A1, B4 (it speaks at the wake cell at three hours) |
| compute the line, never write it to the glass | A2, B2 |
| hear them where they sleep, not where they are | B1, B2, B3 (the whole day goes quiet) |

## WHERE THE JOB IS NOW, HONESTLY

Four rounds:

1. people live at their front doors, on ground that has houses
2. their day gathers them at places instead of scattering them — 2 of 32 walks
   meeting somebody became 9 of 32
3. the map shows the thirteen crowds
4. the street tells him when one is within earshot

**He still does not meet people WITHOUT TRYING, so the row stays OPEN.** What he has
now is: a reason to walk somewhere, a way to know where, and a voice that says
"warmer" when he gets close.

And the thing standing behind all four rounds is unchanged and is not mine:
**`[PENDING Paolo]` — is the valley the GDD's 69,000 or the zone map's ruled 297
times the dial (5,940)?** Every one of these mechanisms would read four times louder
at the larger number, and no mechanism can close a gap of twelve.

## THE STANDING NOTE

**MEASURE WHETHER THE MECHANISM WOULD EVER FIRE BEFORE YOU BUILD IT.** The earshot
rule took twenty minutes to measure and would have taken an afternoon to build. The
measurement said "two of four walks", which is what made it worth building — and if
it had said "never", that would have been the round's finding and worth just as much.
