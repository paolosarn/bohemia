# A STREET THAT IS NOT FASTER IS A PICTURE OF A STREET
# 9/5/26, WORLD lane. VAMILY [faster roads] — BB-ROADS-ARE-FAST. **SHIPPED.**

> "ROADS ARE FAST. Everybody, player included, moves at high speed along a road."
> — the row, quoting his reference game

## THE MEASUREMENT, FIRST, ON THE SURFACE HE WALKS

| | |
|---|---|
| 29 cells of **pavement** | **2 minutes** |
| 29 cells of **broken ground** | **2 minutes** |

**Identical.** Every street in this valley cost exactly what a wash cost. We have more street
than almost anything else in the project — the harmonised street bank, sidewalk sanctity, the
street-aware law, his 8/25 ruling that art and path connect like lego — and **all of it was
mechanically scenery.**

## WHY A ROAD IS THE RIGHT LEVER

A fast road does not flatten the valley, it gives it a **grain**: places near in time and far
in metres. The friction stays and the shape changes. That is the structure von Thunen says
organises everything — transport cost rises with distance, and that alone decides what happens
where.

**AND THE BASELINE DOES NOT MOVE.** 0.084 minutes a cell is about nine metres a minute, so a
sixteen-hour day walks about 8.6 km across a 9.2 km valley. The row calls that a **good
number, not a bug**, so broken ground costs exactly what it always cost and only pavement got
cheaper. Nothing regresses.

| | |
|---|---|
| a day off the roads | **8.6 km** — unchanged |
| a day on the roads | **17.1 km** |
| the valley, corner to corner | **9.2 km** |

**So you can now cross the valley in a day if you stay on the roads, and you cannot if you
don't.** That is the whole row in one line.

## THE SURFACE COMES FROM THE FOOTSTEPS

`__surfaceOf` is the classifier SOUNDS already ships — asphalt, concrete, gravel, dirt, sand,
wood — so **the ground that sounds like asphalt is the ground that walks like asphalt** and
there is no second opinion about what a tile is.

That function had its own near-miss the same round: it read two fields a city cell does not
have and returned `dirt` for all 6,561 cells around the spawn, silently, because `dirt` is an
approved sound. **Which is exactly why this leans on it rather than writing a third answer** —
one classifier that gets fixed once.

**PAVED IS ASPHALT AND CONCRETE**, the roadway and the sidewalk. A person on foot is not slower
on the walk than on the tarmac, and both are what "a road" means to somebody walking. Gravel,
dirt, sand and wood keep the baseline: a shoulder is not a road, and the row did not ask for a
ladder of surfaces.

Measured around where the game opens: **34% of the walkable ground is paved** (asphalt 716,
concrete 240, gravel 139, dirt 1,802). So the grain is real, not marginal.

## THE NUMBER, AND ITS BASIS

**Pavement is twice the speed.** REALISM FIRST: route planning has treated rough off-road going
as roughly half of road pace since Naismith, and every terrain-factor table since has kept that
order — prepared surface fastest, broken ground about half.

It ships tagged `tuned:false` with its ruling attached, like every other number this lane has
shipped, so it lands in the one generated list he tunes from after a playthrough.

## AND THE THING THAT WOULD HAVE GONE WRONG QUIETLY

The walked step hands the encounter director a slice of time: `walkInterrupt(5.04)` — the
seconds in one baseline cell. That was **right while every cell cost the same.**

On a fast road it would have paid the director a full cell's worth of seconds for half a cell's
worth of clock, so **his approved ninety-second gap between moments would have come twice as
often on pavement.** Pacing changed as a side effect of a movement fix is nobody's ruling. The
director is handed the seconds really spent now.

**Indoors is untouched.** The interior step has its own `advance()`, and a corridor is not a
highway.

## WHAT HE SEES

The reckoning already said `78 steps`. A step count **cannot show what this row changed** —
"412 steps" reads the same whether he did it on a highway or across a wash. So the card says
how far he actually got:

> **78 steps · 59 m**

A cell is 0.75 m at the game's own scale, which is the number the rest of the file already
measures distance with, so this invents nothing.

## THE GATE — `gates/roads_are_fast_gate.js`, 17 checks, registered as ROADS ARE FAST

The step charges a cost rather than a constant, the baseline is still 0.084, the factor carries
its ruling and `tuned:false`, the director is paid the real seconds, indoors is untouched, and
there is exactly one outdoor cost site so a second one cannot appear and quietly un-grain half
the map. Then on the real surface: there is genuinely pavement to walk on, a roadway and a
sidewalk both cost half, **dirt and gravel are exactly what they were**, and the same distance
is walked on both surfaces **through `stepOnce` rather than by calling the cost function** —
because a cost table that agrees with itself proves nothing about the body.

**The clock reports whole minutes**, so the walked check asserts the order and a clear margin
rather than an exact 2.000×. A test that demands an exact ratio off a clock that rounds is a
test about the clock.

**Proved red**: empty the paved set and 4 checks fail, including the walked one (39 cells in 3
minutes against 39 cells in 3 minutes).

**And one of my own checks was the broken part first.** The "indoors is untouched" regex allowed
400 characters between the comment and the `advance`, and the real gap is longer, so it went red
on correct code. Widened, and a second check added beside it.

## VERIFIED

| | |
|---|---|
| walked surface | 39 paved cells in 1 min against 39 rough in 3; asphalt 0.042, dirt 0.084 |
| demo, through the splash | identical, and the card reads "78 steps · 59 m" |
| gates | roads are fast 17, turf 23, faction towns 33, payday 38, demo build 25, purse 28, day pays 18, economy 13, demo blockers 22, four verbs 32, lights bill 30, placeholder 14 |

## WHAT IS STILL HIS

How much faster a road is (the factor is tagged and one line). Whether gravel deserves a middle
tier. Whether a vehicle changes the ratio — the bike already covers four cells a beat and this
row did not touch it.
