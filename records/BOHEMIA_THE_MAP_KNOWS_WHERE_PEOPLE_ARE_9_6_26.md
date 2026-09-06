# THE MAP KNOWS WHERE PEOPLE ARE — the half nobody came back for
(9/6/26, LIFE + CITY lane. VAMILY job `[more people] POPULATION-DEFAULT`, round 3. The row stays OPEN.)

## WHAT WAS LEFT

Round 1 put residents on residential ground at their own front doors. Round 2 gave
a neighbourhood **places** and sent the working half of it there, taking a walk from
2 meetings in 32 to 9. Both records ended on the same sentence: **a crowd is real
when you are standing in it and invisible when you are not.** What was left was not
placement. It was **finding**.

## AND THE MAP HAD NEVER ASKED

`renderCity()` does not call `headsAt()`, `census()` or `pplPeople()`. Not once. You
can open the map of the whole valley and **nothing on it says a single person lives
anywhere.**

The best part is that this file has already written that sentence, forty lines below,
about a different thing:

> *"MEASURED FIRST: renderCity() did not call ctBases() once ... you could open the
> map of the whole valley and nothing on it said that anybody held any of it — while
> the canon says LIGHT=TERRITORY, CLUSTERED POWER, OWNED."*

Somebody found that, fixed it for territory, and **people were the half nobody came
back for.**

## THE NUMBER THAT MAKES IT WORTH DRAWING

**He wakes one kilometre from a settlement of 220 people.** Eight overmap cells. A
twenty-minute walk on the roads `BB-ROADS-ARE-FAST` made fast. The game has never had
any way to tell him it is there.

```
the valley        13 settlements, 139 neighbourhoods holding anybody, 5,940 people
nearest crowd     8 overmap cells = 1.02 km, 220 people
```

## WHAT SHIPPED

One mark per **settlement** — thirteen on a 96x96 valley — off a flat array built
once with the valley, exactly as `turfGrid()` is: one entry per neighbourhood, 576
of them, an array index per visible cell when it draws.

**The rules are the map's own**, taken from the territory pass above it rather than
invented:

- **MAP LAW: nothing is placed.** Every mark is a neighbourhood the zone map already
  decided. A map that invents a settlement is a map that lies.
- **NOT A HUD PIN.** It is not on the walking screen and it does not follow him. A map
  he chooses to open, showing a fact that is true whether or not he is looking.
- **No fill.** A wash of colour buries the streets and the lights the map is for.
- **No faction hue**, because COLOUR IS TERRITORY (8/26) reserves those for Paolo.

Keyed on the seed **and the rules version**, so a mass edit can never leave the map
drawing the pre-edit world.

## TWO THINGS THE REAL SCREEN KILLED, AND NEITHER WAS VISIBLE FROM THE CODE

**1. It marked too much.** The first cut also drew a faint outline on all 139
neighbourhoods that hold anybody. On the actual screen that is clutter over the
streets the map exists for — and worse, **a small pale diamond is indistinguishable
from the gold diamonds this map already draws for every single landmark it has.**

> A MARK THAT READS AS A DIFFERENT MARK IS WORSE THAN NO MARK.

He does not need telling that a household exists somewhere. He needs to know where
the two hundred people are, and there are thirteen such places.

**2. It was too faint.** Measured **2.41:1** against the ground it sits on, under the
3:1 floor for a graphic — in the same round the EYES lane measured 38 pieces of text
on the screen he lands on as too faint to read. **Adding a 39th would have been its
own defect.** Full alpha, a dark rim so it holds on lit blocks and dark desert alike,
and a ring rather than a disc so it is not one of the map's filled icons either:
**10.5:1**.

Neither of those was findable by reading the diff. Both came from opening the map and
looking at it.

## AND THE MEASUREMENT THAT WAS MEASURING THE WRONG PIXEL

The contrast probe read the **centre** of the mark and reported 2.41:1 after the fix
had already landed. The centre of the mark is a deliberate dark hole. It was
measuring the hole against the ground and calling it the mark.

> Same class of mistake as measuring the wrong surface, one round after this lane
> wrote that one down three times. **Sample the thing you are claiming, not the place
> it happens to be.**

## THE LEG THAT HAD TO BE ADDED AFTER THE MUTATIONS

Loosening the mark back to *every household* — the exact decision the real screen
forced — went **completely uncaught**. 69 marks in view instead of 6, contrast
unchanged, pixels merrily changing, twelve of twelve green.

> **"IS IT DRAWN" AND "IS IT BRIGHT" SAY NOTHING ABOUT WHAT IS DRAWN.** A gate can
> hold a design decision only if some leg states it. B2b counts the settlements whose
> centre lands on screen, itself, off the module rather than off the grid, and
> requires the drawn count to be exactly that.

## THE GATE

`gates/map_knows_people_gate.js`, **12 pass / 0 fail**, walked surface and cut demo.

| mutation | legs that went red |
|---|---|
| mark every household instead of the settlements | B2b (69 drawn against 6) |
| draw the mark faint | B3 (1.58:1) |
| return no grid at all | B1, B2, B2b, B3, B4, C1 |

## WHAT THIS STILL DOES NOT DO

**It does not tell him a crowd is there while he is walking.** The map is a thing he
opens; the module's own phrase is *"you hear a settlement before you see it"*, and
hearing one is the SOUNDS lane's ground, not this one. A mark on a map he has to
think to open is the cheapest honest half of finding, not the whole of it.

And the row stays **OPEN** because the sentence it exists for is still not true: he
does not yet meet people **without trying**. He can now find out where they are.

## THE STANDING NOTE

**A DRAWING IS FINISHED WHEN YOU HAVE LOOKED AT IT, NOT WHEN IT COMPILES.** Both real
defects in this round — a shape that collided with the map's existing vocabulary, and
a brightness under the readability floor — were invisible in the diff, invisible to
every leg I had written, and obvious in the first screenshot.
