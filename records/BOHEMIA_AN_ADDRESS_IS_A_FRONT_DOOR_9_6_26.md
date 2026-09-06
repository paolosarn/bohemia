# AN ADDRESS IS A FRONT DOOR — and the dial was priced off a path the city does not use
(9/6/26, LIFE + CITY lane. VAMILY job `[more people] POPULATION-DEFAULT`.)

## THE COMPLAINT, AND IT IS EXACTLY TRUE

Playtest dispatch, item 5:

> *"IM WALKING THROUGH THE CITY I THINK I SAW ONE WATCH PERSON ON ACCIDENT ... THE
> CITY SEEMS DEAD ASF AND I DONT LIKE THIS BEING THE DEFAULT I KNOW WE HAVE A
> SLIDER AND SHIT BUT YEAH MAN."*

Measured on the running demo, standing where he wakes, counting bodies the game
actually blits, hour by hour:

```
5:00 drawn=1   9:00 drawn=1   13:00 drawn=1   17:00 drawn=1   21:00 drawn=1
6:00 drawn=1  10:00 drawn=1   14:00 drawn=1   18:00 drawn=1   22:00 drawn=1
7:00 drawn=1  11:00 drawn=1   15:00 drawn=1   19:00 drawn=1   23:00 drawn=1
8:00 drawn=1  12:00 drawn=1   16:00 drawn=1   20:00 drawn=1
```

**One person, all day.** Not a figure of speech. His sentence, measured.

## THE FIRST PROBE WAS INVALID AND IT MATTERS WHY

The first run loaded `BOHEMIA_CITY_WORLD.html` on its own and got `drawn=undefined`
at every hour. That is not the game being empty: `peoplePass()` opens with
`if (!PLAYER_CV) return 0;`, and `PLAYER_CV` only exists once the PARENT frame posts
the baked player rig in. **Standalone, the city can never draw a body.** The probe was
measuring itself.

> VERIFY ON THE REAL SURFACE is not a slogan about which file you open. It is about
> which of the two of you is producing the number.

## THE THING THAT WAS ACTUALLY WRONG

It is not the count, and the module's own 8/28 note said so already
(*"What is left is not a count, it is WHERE"*). Measured at the cell he wakes on:

| | |
|---|---|
| people living in his neighbourhood | 20 |
| nearest one of them | **64 cells** (seven screens) |
| the screen | 9 x 18 cells |
| doorway cells on the overmap cell he stands on | **4,188** (1,118 with somewhere to stand) |
| nearest front door | **14 cells** |

**The suburb is full of houses and the game seated its residents on open ground with
no relation to any of them.**

And the reason is one line of arithmetic that was already computed and thrown away.
`surveyNeighbourhood()` counts which of a neighbourhood's sixteen overmap cells are
residential — it has done since the day it was written, and `weightOf()` is built on
it. `homesIn()` then scattered people evenly across **all sixteen**: the suburb, and
also the freeway, the arterial and the rail yard beside it. His neighbourhood is six
suburb cells and ten road cells. Measured headless, **nineteen of twenty loner
residents were living off residential ground.**

## WHAT SHIPPED

Two rules, and neither one is a number.

**1. People live on the ground the survey already calls residential.** The scatter
picks a residential overmap cell first, then a cell inside it. A cluster's centre
lands on one too, instead of in the middle of the interchange next door.

**2. An address is a front door.** `homesIn` takes an optional `prefer` callback —
the same contract as `pick`, for the same stated reason: this module refuses to guess
what a surface's ground means, so it offers a candidate and the surface answers. The
city answers *"is there a doorway beside this cell"*. A second pass drops the question
entirely, so **a district with no doors seats exactly as many people as before.**

Home is the DOORSTEP, never the doorway itself — `pplStandable` already refuses to
stand in a threshold and that stays right.

Measured after, across the nine neighbourhoods around him:

```
                       before            after
on residential ground   ~half            61 of 61
at a front door           7 of 61        44 of 61
nearest resident         64 cells        33 cells
```

**THE COUNT DID NOT MOVE.** `want` is untouched, the census still reports the ruled
297, the dial is still `LANDMARK.story`. The module carries a standing 8/28 warning
that the next session must not turn that knob and call the job done. It was not
turned. `A3` is the leg that holds that line.

## AND THE FINDING THE JOB TURNED UP, WHICH IS BIGGER THAN THE JOB

The dial's own comment prices `LANDMARK.story` at *"GDD v5's ~69,000"*, read off a
sweep of `agentsForPlot`. Summing this module's own dialled heads over the valley —
which is precisely what `homesIn` then seats — gives a different answer:

```
what the note says dial 20 buys   ~69,000    (agents.js's plot model)
what the WALKED CITY seats           5,940    (headsAt x dialAt)
what census() reports                  297    (it never applies the dial)
```

Three answers for one fact, which is the exact bug
`records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md` was opened about, in a new
costume. **Two population models differ by about fourteen times and one dial rides
both**, so a default chosen by measuring one arrives wrong on the other. The zone
map's 297 is HIS 7/29 ruling and is not in question; the dial is an honest 20x on top
of it. What was wrong was the JUSTIFICATION.

Stated plainly so nobody has to rediscover it: **`DIAL_MAX` 32 is 9,504 people on the
surface he walks, against a design document that says 69,000. The top of his slider
cannot reach his own GDD.** Which of the two numbers the valley is, is HIS.
`[PENDING Paolo]`. Nothing here quietly picked one.

## WHAT THIS DOES NOT FIX, SAID OUT LOUD

**A 300-step walk east from where he wakes still meets nobody.** Measured after the
change: 100 frames looked at, **0** with anybody on screen.

The arithmetic, so the next round starts from it instead of from hope: 60 people live
across the nine neighbourhoods around him, which is 2.36 km². A 300 m walk with a 9 m
viewport sweeps 2,700 m², or 0.11% of it. **To meet one person on that walk you need
about 900 people in that area, not 60.** No placement rule inside a neighbourhood
closes a gap of fifteen times.

So the two things left, and they are both real:

- **NOBODY EVER LEAVES THE DOORSTEP.** `out=0` at every hour of the day. A resident's
  out-spot is the first free cell beside their own front door, so the valley has no
  gathering anywhere in it. A thin population reads alive by CONVERGING — five people
  at the one standpipe, not one person per block — and this world already has the
  things to converge on (the live circuits, the water and farm ground `DRAW` already
  names, `favSpot`).
- **THE COUNT, WHICH IS HIS.** See the finding above.

## THE GATE

`gates/where_people_live_gate.js`, **15 pass / 0 fail**, walked surface and cut demo.

| mutation | legs that went red |
|---|---|
| scatter over the whole square again | A2 (1/20, 3/20), B1 and C1 (54/61) |
| stop asking for a doorstep | B2 (44 of 61 falls to 7), C1 |
| answer the doorstep question with a flat yes | B4 (1,849 yes / 0 no) |

## AND A FILE THAT WAS NOT MINE

The first cut of this gate was written to `gates/address_gate.js` — which is the
PEOPLE lane's gate from 8/26, and the write silently replaced it. Caught by
`git diff --stat` before a commit, restored from `HEAD`, and this one moved to a name
nothing owned. **ONE SYSTEM, ONE SESSION applies to the ruler as much as the target,
and a new file is only new if you looked.**

## AND THE HALF OF THE ROUND NOBODY PLANS FOR: SIX OTHER GATES WENT RED

Moving where every resident in the valley lives is a change to a foundation six
other lanes measure. Every gate in the repo that touches population, people or the
census was run (30 of them), and every one that failed was then run again on a
clean `origin/main` to separate what was already broken from what this change
broke. **That comparison is the only thing that makes the next paragraph
trustworthy**, and it is cheap: twelve gates failed here, six of them fail on main
too.

Four were mine. **Not one of them was a broken mechanism.** In every case the code
did the better of the things it is written to do and the LEG could not see it.

| gate | what the leg asserted | what was actually true |
|---|---|---|
| `against_gate` J | a body at war is in the cell you FACE | followers TRAIL you, so that cell is two steps out of their reach; the leg was green because a 300-step walk used to stop in a lucky spot |
| `casting_gate` | the QUEST casts from exactly ONE block | its own header, three paragraphs up: *"A QUEST DOES NOT HAVE AN ADDRESS, IT HAS ONE PER ROLE, and going from one to the other IS the job."* Measured after: fixer at 8,7, lineman at 18,14, one person each — **the law being satisfied, reported as a failure** |
| `casting_gate` card | the card of whoever was standing nearest | households now sit together, so that was the housemate, whose card correctly has no job row |
| `address_gate` | `affiliated === 0` near the front door | that was this gate's 8/26 PREMISE, not its law. Factions hold GROUND and nobody holds a freeway, so people who had no outfit because the game had parked them on a motorway now have the one whose ground they live on: **441 people within three blocks, 69 affiliated, up from zero** |
| `faction_between_gate` P6 | the vouched person's card | the housemate's card again, then a second time after a sweep that advances the world by days |

### THE ONE I GOT WRONG, AND HOW IT WAS CAUGHT

The first fix to `against_gate` J accepted a blocker **anywhere within arm's
reach**. It went green instantly. Then `ctBlockCell()` was stubbed to return null —
the entire get-in-your-way mechanism deleted — and **the leg still passed**, because
an ordinary follower ends up beside you anyway.

> **A LEG THAT CANNOT TELL THE MECHANISM FROM ITS ABSENCE IS DECORATION.** Making a
> gate green by widening what it accepts is not fixing a ruler, it is unplugging
> one. The only proof that a fixed leg is still a leg is breaking the target and
> watching it go red.

Reverted, and the reason is written where the next person will try the same
shortcut. The leg now BUILDS the situation the row is about — a cell the player
faces, empty, within one step of a body at war — so if somebody is standing there
afterwards, the mechanism put them there and nothing else could have.

Every one of the four fixes was mutation-tested:

| gate | mutation | result |
|---|---|---|
| `against_gate` | `ctBlockCell()` returns null | 5 FAILED / 61 ok |
| `casting_gate` | the cast follows whatever block you stand on (the 8/26 bug) | 576 of 576 blocks, RED |
| `casting_gate` | drop the THE JOB row from the card | RED |
| `address_gate` | `ctFactionOf` returns an outfit for everybody | 441 of 441, RED |
| `faction_between_gate` | drop the THEY WERE IN, ONCE row | RED |

### THE SHAPE OF ALL OF THEM

Three of the four picked a person and then trusted the game to hand back the same
person. `ctAdjacent()` returns the NEAREST body and measures MANHATTAN distance, so
its four diagonal tries never answer at all. That was safe while residents lived
alone on open ground and stopped being safe the moment a household sits down at one
address.

`faction_between_gate` had already written this exact lesson on 8/28 — *"A TEST THAT
PICKS A PERSON AND THEN TRUSTS THE GAME TO PICK THE SAME ONE IS TESTING THE
CROWD"* — and then left a fallback in on the grounds that it "cannot be made worse
than it was". **That fallback is exactly how it got worse.** A fallback that keeps a
test running after its setup failed does not preserve the old behaviour; it converts
a setup failure into a false claim about the game.

## THE STANDING NOTE

**A NUMBER CHOSEN BY MEASURING ONE PATH IS NOT A SETTING, IT IS AN ASSUMPTION ABOUT
THE OTHER PATH.** The dial was moved to 20 in good faith off a real measurement of a
real model. It just was not the model that draws the street he walks down.
