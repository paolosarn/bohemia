# A BEARING IS A PLACE — the day was what emptied the street
(9/6/26, LIFE + CITY lane. VAMILY job `[more people] POPULATION-DEFAULT`, round 2. The row stays OPEN.)

## WHERE ROUND 1 LEFT IT

`records/BOHEMIA_AN_ADDRESS_IS_A_FRONT_DOOR_9_6_26.md` put every resident on
residential ground at their own front door — 61 of 61 off the freeway, 44 of 61 at
a doorstep — and said plainly what it did not fix: **a 300-step walk still met
nobody.**

That record then named the next round wrong, and this one starts by correcting it:

> *"NOBODY EVER LEAVES THE DOORSTEP. `out=0` at every hour of the day."*

**That was not measured, it was inferred**, from a stale comment in the source and
from an `out` counter that only ever counted people who were **drawn** — of whom
there was exactly one. Measured properly, across all 61 people rather than the one
on screen:

```
 5:00 out= 0/61      10:00 out=41/61      16:00 out=36/61
 6:00 out= 3/61      11:00 out=33/61      17:00 out=40/61
 8:00 out=29/61      12:00 out=12/61      18:00 out=33/61
 9:00 out=37/61      14:00 out= 7/61      23:00 out= 2/61
```

They leave. Two thirds of them are outside at ten in the morning, and there is a
siesta at 14:00 the module's own heat rule puts there.

## WHAT IS ACTUALLY WRONG, AND IT IS WORSE AND MORE FIXABLE

Measured at the busiest hour, the same 61 people:

| | nearest neighbour | most on one screen |
|---|---|---|
| **at home** | 1 cell | 4 |
| **out** | **14 cells** | 3 |

**THE DAY IS WHAT EMPTIES THE STREET.** At home they are in households, shoulder to
shoulder. The morning takes the only cluster the game has and dissolves it:
sixty-one people, sixty-one private rays, sixty-one private destinations, and not
one of them near anybody else's.

## THE MODULE HAD ALREADY WRITTEN THE FIX AND NOBODY DID IT

`engine/bohemia_population.js`, on the `workDir` field, since 7/31:

> *"A bearing and a distance, not a district name — **NAMING THE WORKPLACE IS THE
> SURFACE'S JOB** because only the surface knows what is actually there."*

The surface resolved the bearing to *the most open cell along the ray*. That is a
**coordinate**. A place is a thing **other people also go to**. The module handed
over a bearing and the surface never turned it into anywhere.

## WHAT SHIPPED

**A neighbourhood has PLACES, and a bearing picks one.** Nothing here is a number I
chose:

- **How many** is `HEADS.cluster` — the population module's own size for a
  settlement, already researched and ruled. One place per settlement's worth of
  people. A literal here would have been a population knob wearing a placement
  rule's clothes, and this lane is not allowed to touch how many.
- **Where** is measured with `pplOpenness` and `pplDoorstep`, the two instruments
  the surface already had. Openness alone does not discriminate on this map (90% of
  the ground scores 22-24), so *the openest cell* was picking the middle of an empty
  lot — a crowd standing in open desert is not a place, it is a coincidence. A place
  is **frontage**: open ground with a door on it. That is also where a walking
  player goes, because doorways line the streets buildings front.
- **A faction seat beats a street corner.** BB-TURF put fourteen real markets on the
  map on 9/5 and nothing on the walked surface had ever asked where they were.

Their own bearing still chooses *which* place, so the 7/31 address book survives
intact: two people on identical schedules still walk opposite ways. They now arrive
somewhere instead of nowhere.

And **the old ray is still underneath**. Ground whose art has no doors and no open
corners behaves exactly as it did, or this rule would quietly empty every district
nobody has filled in yet.

## WHAT IT DID

```
                      before            after
share a screenful      3                13
nearest neighbour     18 cells           1 cell
```

Standing at the nearest place, 97 cells from where he wakes — bodies actually
blitted, hour by hour:

```
6:00  1     10:00  6     14:00  2     18:00  8     22:00  2
8:00  4     12:00  2     16:00  4     20:00  2
```

Against **one body, everywhere, all day** before round 1. And the day has a shape
you can feel: a morning, a dead middle, a busy evening, a quiet night.

## THE HEADLINE, AND IT IS NOT A WIN YET

Four straight 400-step walks from the cell he wakes on, at 06:00, 10:00 and 18:00,
counting only people who were **not already on the glass** before he took a step —
the same protocol run on the code before and after:

```
before   0 of 12 walks met anybody
after    3 of 12, median first meeting at step 157
```

**Three of twelve is not "he meets people without trying" and the row stays OPEN.**
It is the first number above zero this lane has ever measured on that walk.

The arithmetic that is left: a place is a point, and two points in a 512-cell square
are hard to walk into. The crowd is real when you are standing in it and invisible
when you are not. **What is left is not placement any more, it is FINDING** — the
module's own phrase is *"you hear a settlement before you see it"*, and this game
has a city phone with a feed on it that this lane built on 9/5 and never pointed at
anything.

## THREE LEGS THAT WERE ACCIDENTALLY CORRECT, IN ONE GATE

The mutations are the whole reason the numbers above can be trusted, and three legs
had to be rewritten because **breaking the target did not make them red**.

**B3 — "no two places sit inside one screenful of each other."**
- *Cut one* asked the nine neighbourhoods around the wake cell. Those are loner and
  spread ground and get **one or two places each**, so the frontage cells were far
  apart whether the rule existed or not. Spacing rule deleted: **still green.**
- *Cut two* asked the single **busiest settlement in the valley**, which sounded
  like the hardest case. It is not: with the rule off that settlement still measured
  20 cells, because **the closest pair in the valley is not in the biggest
  settlement**. Still green.
- *Cut three* asks the minimum over **every pair everywhere** — 704 places across
  133 settlements. 20 cells with the rule, **12 without** (12 is the sampling
  lattice showing through, which is exactly what the rule exists to stop). Red.

> **A LEG THAT ASKS THE CASE THAT SOUNDS HARDEST IS STILL GUESSING.** The rule is a
> floor on every pair everywhere, so the leg has to be the minimum over everything
> the rule claims to cover.

**B1b — "a settlement does not empty into one spot."**
Counted distinct destination **cells**, and could not fail: the OCCUPANCY LAW rings
a crowd around its spot, so twenty-five people sent to **one** place still stand on
twenty-five different cells. It counts distinct **places** now, and the mutation
goes red at 8 bearings collapsing to 3.

**B4 — "stand at a place and there is a crowd."**
Ran on the standalone walked surface and measured **zero bodies at every hour** on
working code. `peoplePass()` opens with `if (!PLAYER_CV) return 0`, and `PLAYER_CV`
only exists once the parent frame posts the baked player rig in — so on the
standalone city **nobody is ever blitted**. It runs in the demo now.

> This lane has now been caught by that same trap **three times in two rounds**. It
> is written into the gate at the point of use so the fourth time is somebody
> reading rather than re-deriving.

## THE GATE

`gates/people_gather_gate.js`, **13 pass / 0 fail**, walked surface and cut demo.

| mutation | legs that went red |
|---|---|
| delete the places (a bearing is a coordinate again) | B1 (4 on a screen, not 13), B4 |
| delete the spacing rule | B3 (closest pair anywhere 12, not 20) |
| stop preferring frontage | B2 (0 of 12 places on a door) |
| ignore the person's bearing | A3, B1b (8 bearings → 3 places) |

## THE STANDING NOTE

**A NUMBER YOU INFERRED FROM A COMMENT IS NOT A MEASUREMENT, AND IT WILL AIM THE
NEXT ROUND AT THE WRONG THING.** Round 1's own record told this round to go and fix
people who never leave home. They leave home. An hour of building against that
sentence would have produced nothing, and the only reason it did not is that the
first thing this round did was measure the claim it had inherited.
