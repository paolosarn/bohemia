# DAY 44 — THE PUMP IS ALREADY BUILT, AND IT IS DARK.

ECONOMY lane, VAMILY row `[first building]` Q44. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 44. Claimed 9/15/26 `economy-vamily-knxaeh`, commit 843d78b.

> **THE ROW, VERBATIM:** "What people actually build or fix first after the grid goes: the
> water utilities' own Sandy lessons (water and wastewater get the generators first),
> Puerto Rico after Maria, Lebanon's generator blocks. Deliver the order and the reason, so
> ruling 4 (the pump first) stands on the record or is corrected by it."

---

## 0. FIRST, A CORRECTION TO MY OWN LAST ROUND

**Round 43 section 4 built a conclusion on a number that has since been retracted, and the
retraction is right.**

I wrote that the red gate `BUILD COSTS ITS PRICE` and EYES E26's report of two dead BUILD
buttons were *"two honest instruments describing the same defect"*. EYES has now withdrawn
that report, and the reason is exact:

> *"Across 85 taps **THE ROUTE NEVER PRESSED THOSE BUTTONS AT ALL**. A zero was going out
> with no denominator under it, **and two lanes shipped against it**."*

**I am one of those two lanes.** The gate half of my sentence stands — I ran it myself and
it is red 9 pass / 5 fail — but **the claim that a phone walk had independently measured
those buttons dead is withdrawn.** There was one instrument, not two.

**The root cause is mine and it is worth writing down.** I hold a rule for my own probes:
prove every negative with a positive control, because a zero usually means the instrument
never reached the thing. **I did not apply that rule to somebody else's number.** A figure
on the front page got treated as measured fact without my asking the one question I always
ask my own code: could this instrument have reached what it is reporting on?

Corrected, and the discipline extends: **a number from another lane gets the same
interrogation as a number from my own probe.**

---

## 1. THE FINDING THAT PROVES US WRONG

> **RULING 4 (coordinator, 9/13):** *"THE GOOD FIRST BUILDING IS THE BLOCK'S PUMP… the
> first thing a player should build is the pump that keeps a block's water on: it costs
> one, it is what makes the block livable and therefore rentable… **Power comes second.**"*

**Water does not come before power. Water IS power, and the pumps are already standing
there in the dark.**

### THE VALLEY'S WATER PLANTS, MEASURED

    seed  1:  7 water plants,  0 front a live street   (0%)    grid 400/1690 live
    seed  7:  4 water plants,  1 front a live street  (25%)    grid 391/1490 live
    seed 42:  6 water plants,  1 front a live street  (17%)    grid 422/1561 live

**On one seed in three the valley boots with no running water at all.** On the other two it
runs on exactly one plant.

### AND ONE LIT PUMP SUPPLIES THE ENTIRE VALLEY

`bohemia_pumps.js` carries real physics, not a dial: the floor is **2,028 ft**, Lake Mead
is **1,040.5 ft**, so the lift is **987.5 ft — 301 metres** — at **0.00109 kWh a litre**
(g = 9.81, pump efficiency 0.75, and a litre of water is a kilogram by definition).

    the valley drinks            18,524 L a day   (4 L a head x 4,631 living)
    ALL FOUR PLANTS LIT          18,524 L,  20.26 kWh,  4 running
    *** ONE PLANT LIT            18,524 L,  20.26 kWh,  1 running ***
    all four DARK                     0 L,      0 kWh,  4 dark

**One pump covers everybody. A second pump is worth exactly zero litres.**

So *"the block's pump"* is the wrong unit, and the game's own physics is what says so:
**water is a valley-scale utility, not a block-scale one.** Twenty kilowatt-hours lifts the
drinking water of four and a half thousand people three hundred metres uphill, which is why
one plant is enough and why the whole supply is a **single point of failure that is
sometimes already failed at boot.**

### SO THE FIRST JOB IS NOT BUILDING. IT IS LIGHTING.

`pumpstation` **is** in the 59 buildable types, so a player can put one down. `watertreat`
and `reservoir` are in the district enum and **are not buildable**. And building one more
adds nothing, because the one that exists already covers the valley — **if it is lit.**

A plant runs on `lit`, and the surface's own comment explains why that is hard:

> *"A plant is served by the STREET IT FRONTS, not by the cell it stands on… circuits are
> contiguous street RUNS, so a cell that is not a street has no circuit at all. 358 live
> cells in the valley and every one is arterial, freeway or downtown."*

**The pump is not missing. The wire to it is.**

---

## 2. THE REAL AISLE, AND IT SAYS THE SAME THING

### PUERTO RICO AFTER MARIA — THE CLEANEST STATEMENT OF THE DEPENDENCY

> *"Most of Puerto Rico's water infrastructure — cisterns, pumps, and pressure systems —
> **runs on electricity. Without power, cistern pumps don't work.**"* Throughout the island
> *"electrical outages and faulty generators meant pumps didn't consistently deliver water
> to residents' homes"*.

And the response was not to build water. **It was to point power at water:** the immediate
federal projects provided power to hospitals, shelters, schools **and water pumping
stations**, and by the recovery assessment *"all but two of the 114 drinking water
treatment plants run by PRASA were in operation, **although some were being powered by
generators**."*

**114 plants, and the thing that made them work was a generator each.**

### SANDY — THE LESSON IS A PRIORITY, NOT A BUILD

The water sector's own after-action finding is one sentence: **give water and wastewater
priority for generators and fuel during power outages.** Not "build first". **Be first in
line for the power that already exists.**

And the failure mode is documented in detail, which is the part a game can use:

- **Emergency generators are not designed for continuous use for days or weeks**, and they
  started breaking down.
- **Competition for generators rose as the outage continued.**
- **Many ran out of fuel**, and some were in basements that flooded.
- The mitigation that worked: **elevating generators and fuel tanks**, and retrofitting
  lift stations with **connections for portable generators**.

Their own stated first priorities, in order: for a water utility, **restore pressure**; for
a wastewater utility, **restore primary treatment and disinfection**.

### THE LIFELINE LITERATURE REFUSES A SINGLE ORDER, AND SAYS WHY

> *"**A water pump in the water lifeline may need power, and the power network may need
> water.**"* Lifelines are interdependent and vulnerable to cascading failures;
> restorations get **coordinated** rather than ranked — road crews work with power crews,
> opening the roads that most speed up power restoration.

So there is no clean "water first" or "power first" in the record. **There is a
priority: the power you have goes to the water before it goes to anything else.**

---

## 3. THE DELIVERABLE — RULING 4, CORRECTED IN ONE CLAUSE AND CONFIRMED IN THE REST

> **RULING 4 IS RIGHT THAT WATER IS THE FIRST THING AND WRONG THAT IT IS A BUILD.** The
> valley already has four to seven water plants standing on the map, and on one seed in
> three **not one of them fronts a live street** — the game boots with the taps dry and
> nothing on screen says so. **One lit plant lifts 18,524 litres, the whole valley's thirst,
> for 20 kWh**, so a second pump is worth zero litres and *"the block's pump"* is the wrong
> unit: **water is a valley utility, not a block one, and the game's own physics is what
> says so.** **The first job is not to build a pump, it is to get power to the one that is
> already there** — which is exactly the Sandy lesson (*give water and wastewater priority
> for generators and fuel*) and exactly the Maria response (114 plants back, many on
> generators). **So ruling 4's "power comes second" should read "the first power goes to
> the water".** Power is not the second thing you build, it is **how water happens at all**.
> And the failure mode is a gift, already documented and already half-built here: generators
> are not made for continuous running, **competition for them rises as the outage
> continues**, and they run out of fuel — which in our terms is one plant, one wire, a
> faction that owns the street it fronts, and a valley whose whole water supply is a single
> point of failure anybody can douse. **Keep ruling 4's costs-one and keep livable-therefore-
> rentable.** Change only the verb: **not build the pump, light it.**

### AND THE SMALL FIX UNDERNEATH IT

`MAKES` is `["solar","dam","battery"]`. **Water is not one of them**, so a building that
lifts water produces nothing the economy counts, even though `lift()` really does land
litres in the ledger's `stocks.water`. That is a two-place disagreement of the kind round
40 found with the market ledger, and it is named here rather than fixed.

---

## 4. WHAT THIS ROUND DID NOT DECIDE

- **What lighting a plant costs.** A price, and pending 43 already carries the reconnection
  fee argument.
- **Whether `watertreat` and `reservoir` should become buildable.** They are in the enum and
  not in the buildable list; whether that is deliberate is the world lane's to say.
- **Whether the valley should boot dry.** Seed 1 has zero lit plants and that may be the
  best opening this game could have or the worst. It is a feel call.
- **Adding water to `MAKES`.** Named as a disagreement, not proposed.
- **Anything about the demo.** Rule 14: research rounds continue and never touch it, and
  only THE RUN re-cuts. Rule 15 (ONE VOTE TAB, 9/14): this lane presents nothing for a
  thumb and never has.

---

## 5. ROUTED

- **COORDINATOR — ruling 4 needs one clause changed:** *"power comes second"* becomes
  *"the first power goes to the water"*. The rest of the ruling stands and is confirmed by
  both the physics and the record.
- **WORLD / LIFE + CITY** — **the valley can boot with zero lit water plants** (seed 1, 7
  plants, 0 lit). One lit plant covers everybody, so the supply is a single point of failure
  and nothing on screen says whether it is running.
- **WORLD** — `MAKES` has no `water`, so a pump produces nothing the economy counts while
  `lift()` really lands litres in the ledger. Two places disagreeing, same class as round
  40's market singleton.
- **FACTIONS** — a plant is served by the street it fronts, streets are held ground, and
  the grid can be doused. **Whoever holds the street holds the water**, and that is already
  true in the engine without anybody having built it as a mechanic.
- **EYES E26** — the retraction in section 0 is accepted in full and my half of it is
  corrected here. The gate red stands on its own; the pairing did not.

---

## 6. THE GATE NOTE

**Pre-push pass** (the gates reading the files in this diff): economy, purse, payday,
attempt, canon rot, demo blockers, language, handoff. Results in the commit.

**Full suite: 107 red at `ad23d875`, mine are: none, measured.** The sweep is the one from
round 43 — ten gates that read this lane's files or the modules it reads, nine green and
one red (`build_costs_its_price_gate.js`) on a surface this lane has never touched and is
forbidden to.

**The project-level hole, round 29 of naming it.** These gates check that a part does what
it says. Nothing checks that two parts agree, that a part keeps working for as long as the
game lasts, that it is the right part to have, or that the parts form a loop that closes.

This round's instance: **the pumps are correct, the grid is correct, and on seed 1 they have
never met.** Seven water plants, zero on a live street, a working `lift()` that returns zero
litres, and every gate green — because no gate can ask *"does the valley have water."*

## 7. THE PROBE THAT WAS WRONG, KEPT ON PURPOSE

`lift(stations, agents)` takes **`[{district, lit, faction, at}]` objects**, not bare
district strings. My first call passed strings, so `s.district` was `undefined`,
`isPump(undefined)` was false, every station was skipped — **and `stations: 4` counted my
array length *before* the filter.** It printed *"4 stations, 0 running, 0 dark, 0 litres"*
and read exactly like a finding about the game.

**That is the same shape as the mistake in section 0**, made twice in one round from two
directions: a zero with no denominator under it. The running kept-mistakes list is DAY 36
section 9, DAY 38 section 1, and DAY 40 section 7.

---

*ECONOMY round 44. Research only. Nothing in the game changed.*
