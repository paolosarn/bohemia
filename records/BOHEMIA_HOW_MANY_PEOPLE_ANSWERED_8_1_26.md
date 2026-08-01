# THE ANSWER: ABOUT A THOUSAND PEOPLE (8/1/26, PEOPLE lane)

Paolo asked me to answer my own question, and told me how:

> "if we know the scale model of our Las Vegas compared to real Las Vegas and
> imagine if that scale model had nothing to do with an apocalypse, but it was
> just like the full amount of people living in Vegas in 2040, 2050 - millions of
> people right - but then you get the scale model of it and now it's not millions
> of people, and then on top of it now we have an apocalypse"

That is the correct method and it settles a number three files had been
disagreeing about all day. Reproduce it any time with:

    node tools/bohemia_scale_model.js

It runs against the LIVE MAP, so the answer can never drift from the world it
describes. Change the map, re-run it, the number moves with it.

## THE MAP, MEASURED

    48 x 48 cells at 96 m         = 4,608 m per side = 21.23 km2
    residential cells             = 628 of 2,304
    DWELLINGS ACTUALLY DRAWN      = 12,260

## THE SCALE, TWO INDEPENDENT WAYS

    by AREA      1 : 65.9    21.2 km2 against the valley's 540 sq mi (1,398.6 km2)
    by HOUSING   1 : 78.2    12,260 homes against Clark County's 958,705 units

**They agree within 16%, and that agreement is the whole foundation.** Two
measures taken from completely different things landing in the same place is what
says our Las Vegas is a coherent scale model and not a doodle that happens to be
Vegas-shaped. The housing scale is the load-bearing one, because our houses are
real countable objects and people live in houses, not in square kilometres. The
area number is slightly smaller because the map also carries the Strip, the
airport, the freeways and the mountains - land that holds nobody.

## STEP 1 — 2050 VEGAS AT OUR SCALE, NO APOCALYPSE

Clark County is ~2.34 M today. UNLV's CBER forecast puts it at 2.77 M by 2040 and
passing 3 M in 2055, so ~2.9 M is the fair 2050 figure.

    2,900,000 / 78.2 = 37,085 PEOPLE

**His point exactly: millions becomes thirty-seven thousand, purely from the
scale model, before a single thing has gone wrong in the world.**

Cross-check: the map full to the brim - every one of the 12,260 drawn homes
occupied - is 26,972 people. So a living Las Vegas would slightly overflow our
map, which is what you would expect from a model that compresses a real city.

## STEP 2 — THEN THE APOCALYPSE

GDD v5: ~2.3 M pre-crash, ~3% remain.

    37,085 x 3% = **1,113 PEOPLE IN THE WHOLE VALLEY**

## STEP 3 — WHAT THAT MEANS FOR THE SIM

    occupied households   506 of 12,260 homes
    OCCUPANCY RATE        4.1%
    per residential cell  1.8 people on average

## THE ANSWER TO THE QUESTION

**Walking one block from home you should USUALLY SEE NOBODY. Sometimes one
person. In a cluster, a dozen.**

1.8 residents per residential cell, and only about a third of a day is spent
outdoors, so the expected number of bodies on a given street at a given moment is
under one. The emptiness is not a bug. It is what a city of a thousand survivors
in a hundred-thousand-person shell actually looks like, and his 7/29 zone map -
clusters AND no man's lands AND random spread - is exactly the right shape to
hang it on.

## AND IT GRADES BOTH OF THE NUMBERS THAT WERE LIVE

    flat placeholder (0.30)   8,282 people   7.4x TOO MANY
    zone map at dial 1           60 people   19x TOO FEW
    the scale model            1,113 people   <- the answer

Both were wrong, in opposite directions, which is why neither felt right.

## WHAT CHANGED IN THE CODE

- `OCCUPIED_RATE` 0.30 -> **0.038**, with the full derivation written at the
  constant. This replaces a value whose own comment called it a placeholder
  [PENDING Paolo] with arithmetic off his own GDD and public data. Measured
  result: 1,047 people valley-wide, 6% under the derived 1,113 - occupancy is a
  per-house hash roll, so it lands near the target rather than on it.
- `DIAL_MAX` 4 -> **32**. The zone-map path needs about 19x to reach the truthful
  number, and a slider that cannot reach the right answer is a broken slider.
- NOTHING IN THE ZONE MAP ITSELF. Its SHAPE is his 7/29 ruling and it is correct;
  only its head counts are low, and those are his to move. The widened dial means
  his slider can reach the truth without anybody editing that ruling.

## GATE
people_gate part G, 9 claims, 115 total. G3 is the foundation (the two scales must
agree), G6 is the teeth (the SIM must hold what the arithmetic says, within 25%),
G7 stops the rate going back to a round guess, G9 keeps the slider able to reach
the answer. Mutation-proved twice: putting 0.30 back fails G6 and G7; narrowing
the dial fails G9.

## STILL HIS
Whether ~1,113 FEELS right when he walks it. The arithmetic is honest; the feel is
a verdict. If he wants a busier valley the honest lever is now one number, and the
derivation says exactly what he would be trading away.

## SOURCES
- UNLV CBER, 2025-2060 Population Forecasts for Clark County
- Clark County 2024 Housing Unit Estimates (958,705 units)
- Las Vegas Valley urbanized footprint, 540 sq mi
