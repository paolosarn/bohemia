# V213 — THE WALKED STREET CAN START A FIGHT (COMBAT lane, `[first fight]`)

> **Paolo, 9/13:** *"I have not experienced any combat yet... it says a car is gonna
> pull up on me and then nothing happens."*

First line of this lane under **rule 14, THE FIVE MINUTES**. The row: within five
minutes of walking from the door, a card says a fight is coming **and the fight
comes**, measured with a stopwatch on the walked surface.

---

## THE STOPWATCH, BEFORE A LINE WAS WRITTEN

Three walks of five minutes each — 600 steps, one per beat at 120 BPM — driving the
shipped `stepOnce`, which is the one place a walked cell fires both directors.

| | |
|---|---|
| where he wakes | **suburb** |
| `ROAD_TABLE[suburb]` | **no row** |
| `WALK_TABLE[suburb]` | a row: four moments by day, five by night |
| cards | **0** |
| **fights** | **0, in every walk** |
| what did fire | `ghost_robotaxi` (ambient), `scavenger_shakedown` (interactive) |

**The car that pulls up is `ghost_robotaxi`, and I can quote it:** *"An empty cab
pulls to the curb ahead and opens its door for nobody. Waits its ninety seconds.
Pulls off."* The one after it is `scavenger_shakedown`: *"somebody steps out. they
want something."*

**He was describing the game accurately.**

## THE CAUSE: TWO DIRECTORS, AND ONLY ONE CAN START A FIGHT

- **`roadDirector`** — its `tableFor` reads `ROAD_TABLE` **only**. Its `roadInterrupt`
  is the one that calls V203's `roadContactFight` and `roadCard`, so it is the only
  path to a fight — **and it has no table where he wakes.**
- **`walkDirector`** — its `tableFor` falls back to `WALK_TABLE`, so it fires
  correctly on the walked street. And `walkInterrupt`'s entire response is
  `walkSay()`, which writes **one line** into `#packline` and stops. For every kind,
  including interactive and forced.

> The walked street's authored moments have never been able to become anything. The
> material was written, the fight machinery was built by V203 one row over, and
> nothing joined them. **The car pulls up, somebody steps out and wants something,
> and nothing happens** — exactly, and for a reason you can point at.

Seventh time this lane has found this shape.

## WHAT WAS BUILT, REUSING V203 AND INVENTING NOTHING

- **forced** → the fight starts where you stand, through `roadContactFight`. His own
  ruling: a forced party does not ask.
- **interactive** → the road's own card opens, which V203 already gave a real fight
  arm.
- **ambient** → **untouched.** `walkInterrupt`'s own comment is right that a modal
  card for *"a coyote is following you"* turns set dressing into homework.
  `ghost_robotaxi` is ambient and stays ambient — its words say the cab waits and
  pulls off, which is honest atmosphere, not a promise. What was broken was never the
  cab; it was that nothing **else** could ever become a fight.
- **the line** is still said first, every time, for every kind.
- **and not indoors.** `roadContactFight` refuses indoors on purpose, so a card opened
  in a garage would show a DROP HIM arm that does nothing — a card that promises and
  does not deliver, which rule 14(d) calls the worst bug in the game.

**No table, no district, no moment and no number is authored.** NO GLOBAL SPAWNS EVER
still holds: a district with no walk row still produces nothing.

## WHAT IT LOOKS LIKE NOW

At **step 58 of 600 — about 29 seconds** — the card is on the glass:

> **DESPERATE SCAVENGER SHAKEDOWN**
> *"A guy steps out with a length of pipe and he's already talking. 'Look. Look, I
> don't want, I'm...'"*
> **GIVE HIM SOMETHING** (1 salvage) · **FACE HIM DOWN** (15 min) · **DROP HIM** (a fight)

Press DROP HIM and a real street fight opens, with that man in it.

## PROOF

`gates/first_fight_gate.js` — **9 passed, 0 failed.** Mutation-proved three ways: the
card never opens → **5 red**; the indoors guard removed → **1 red**; the fight never
comes → **2 red**.

### THREE TIMES MY OWN INSTRUMENT LIED, AND THAT IS THE USEFUL PART

**ONE: I measured a half-loaded world and got three confident zeroes.** The first
harness walked immediately and every step threw `ctSawCell is not defined`. It looked
like a whole script block was dead. It was not: **the walked city needs about 8 to 11
seconds after the tap before one step works at all**, and I had been reading a
document that was still parsing. Two runs even gave different truncation lengths,
which is what gave it away. That number is a finding in its own right and is routed.

**TWO: I proved the fight came, on a path I had not tested.** The walk wandered into
a garage, I pressed the arm, a fight opened, and I nearly wrote it down. The posted
message said `room: true`, `roster: 5`, label *"garage interior"* — **it was the
interior door's fight, not the card's.** Every encounter this gate checks is now
fingerprinted by `why`, `street` and `room`.

**THREE: I tested a copy of my own code.** The indoors arm re-implemented the
`if/else` inside the gate, so deleting the real guard left it **green**. It drives the
shipped `walkInterrupt` now, and the same mutation turns it red.

> That is the same defect three different ways: **a green result produced by
> something other than the thing you claim to be testing.**

## NOT MOVED ON THE WAY PAST

The walked street charges **no minutes** and takes **no salvage** for these.
`ROAD_COST` and `roadLeave` are the road's rulings for the road, and the walked branch
already spends its own 0.084 minutes a cell. Pacing and the salvage economy are not
this row's to move.

**The demo was not re-cut** — rule 14(a): only RUN re-cuts the demo.

## THE DIAL

No damage value, hit chance or roll is authored. This connects two things that were
already built.

---

**Tool:** `tools/bohemia_first_fight_patch.py` (MARK `__THE_WALK_IS_A_FIGHT__`,
replayable onto fresh main; touches the city slice only) · **Gate:** registered as
**FIRST FIGHT** · **Tab:** CITY to walk it, COMBAT once the fight opens.

**ROUTED:** the walked city takes **8 to 11 seconds** after the tap before a single
step works, because the last script block is still parsing. Until then no director
fires and no fight can start — which lands squarely on RUN's `[loading screen]` row
and on his "glitchy, nothing's complete". Measured here, not fixed here.

**Also noted for WORDS:** the card's header reads *"ON THE ROAD · SUBURB · DAY"* while
he is walking a street, not travelling a road.
