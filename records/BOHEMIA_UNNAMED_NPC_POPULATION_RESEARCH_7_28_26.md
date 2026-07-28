# BOHEMIA — HOW MANY PEOPLE, AND WHAT LIVES THEY LIVE
### Unnamed-NPC population research, 7/28/26. CITY lane. NO CODE WAS WRITTEN.

> "big brain research on just unnamed NPC's, the lives that they could live, how
>  many realistically we should be in the game especially per district... just do
>  research in our system files deep in our system... obviously act three more
>  people next, but it doesn't have to be crazy crazy research."

Everything below is measured out of OUR OWN FILES or anchored to a real-world
number with its source named. Nothing here is invented canon. The decisions at
the bottom are yours.

---

# PART 1 — WHAT THE SYSTEM ALREADY DECIDED (and nobody has been reading)

Four numbers already exist in this repo. They have never been put in the same
room, and **two of them contradict each other by a factor of eight.**

**1. THE FOOD CEILING — locked, in the GDD.** The valley inherits ~10,000 acres
of irrigable soil. *"Calorie ceiling: 10,000 acres feeds ~50,000-80,000 people
honestly. THE GRASS CANNOT FEED 2 MILLION. Post-crash Vegas's maximum population
is written in its dirt."* That is a hard lid on the whole valley, forever, in
every act.

**2. THE DEATH MATH — in the GDD, split PENDING.** Pre-crash ~2.3M. *"~3%
remain"* — roughly 69,000 people. Mostly exodus down the 15, then die-off.

Those two agree beautifully: **69,000 survivors against a 50-80k ceiling.** The
city is living right at what its dirt can carry. That is a good, tense number and
it is already canon.

**3. THE ENGINE'S DIE-OFF DIAL — a flagged placeholder that disagrees.**
`bohemia_agents.js` ships `OCCUPIED_RATE = 0.30`, commented as *"~70% of the
pre-collapse population gone"*, and marked **[PENDING Paolo]** since 7/19.
70% gone vs the GDD's 97% gone. **The engine is currently building a city eight
times more populated than the story says exists.** This is the single number you
are being asked for, and it has been sitting unruled for nine days.

**4. HOUSEHOLD SIZE — built, grounded.** Vegas averaged 2.6 persons/household
pre-collapse (ACS). The engine weights survivor households to a mean of ~2.2,
because collapse survivors trend to small kin groups. That one is fine.

---

# PART 2 — A SCALE PROBLEM I FOUND WHILE MEASURING, AND YOU SHOULD KNOW

The VALLEY SCALE LAW (7/6, LOCKED) says: 1 overmap cell = 1 neighborhood = 128
fine cells = **96m**, valley span **5.7 miles**, "Los Santos scale."

The code today says `OVER_N=96, TILE_FINE=32, TILE_M=24`.

So one cell is **24m**, not 96m, and the walkable valley is **2,304m — 1.43
miles across, not 5.7.** The neighborhood unit survived (the suburb generator
still builds a 128x128 grid, it just spans a 4x4 GROUP of cells now), but the
VALLEY got four times smaller in each direction — **1/16th the area the law
locked** — because the cell shrank without the grid growing.

I am not touching it. It changes every distance in the game and that is your
call. But every population number below is computed against **the valley that
actually exists today**, and if you ever restore the 5.7-mile valley, every
number here multiplies by 16.

---

# PART 3 — THE VALLEY, COUNTED (measured from the real generator, seed 7)

All 9,216 cells, by district. This is what the game actually builds:

| cells | share | district | reads as |
|---|---|---|---|
| 2,623 | 28.5% | **suburb** | the body of the city |
| 2,353 | 25.5% | arterial | road |
| 989 | 10.7% | freeway | road |
| 885 | 9.6% | mountain | empty |
| 656 | 7.1% | desert | empty |
| 361 | 3.9% | **commercial** | strip malls, lots |
| 301 | 3.3% | solar | power |
| 118 | 1.3% | **resort** | mega-blocks |
| 111 | 1.2% | **apartment** | dense housing |
| 90 | 1.0% | rail | road |
| 87 | 0.9% | **farm** | food |
| 81 | 0.9% | **strip** | the Strip |
| 75 | 0.8% | water | empty |
| 58 | 0.6% | **wash** | the tunnels |
| 54 / 40 | 1.0% | airbase / airport | |
| 53 / 24 | 0.8% | **estate / gated** | rich housing |
| 35 / 30 | 0.7% | park / **downtown** | |
| 12 / 10 / 9 / 9 / 9 | | trailer / school / storage / industrial / **town** | |
| 1-8 each | | 30 more one-off landmarks (dam, prison, campus, datafort, casino, sphere, stadium, jail, fort, springs, granary…) | |

**RESIDENTIAL CELLS: 2,832** (suburb 2,623 + apartment 111 + estate 53 + gated 24
+ trailer 12 + town 9) = **177 neighborhoods** of 4x4 cells.

**MEASURED HOUSING STOCK.** The run's own generator puts **23 homes** in one
128x128 suburb neighborhood. So:

> 177 neighborhoods x 23 homes x 2.6 people = **~10,600 people, pre-collapse,
> in the entire walkable valley.**

That is the honest carrying capacity of the world we can actually walk. Not
2.3 million — the ABSTRACTION LAW covers the rest (the overmap glyph is the
class, the fine layer is the reality).

---

# PART 4 — THE THREE POPULATION NUMBERS, AND WHY YOU NEED ALL THREE

Confusing these is what makes games feel either dead or fake. Keep them separate.

### A. THE CANON NUMBER — 50,000 to 70,000 in the valley
Never simulated, never spawned. It lives in dialogue, faction sheets, the
economy, the feed. It is what a character means when they say "the city."
**Already canon. No decision needed.**

### B. THE SIMULATED NUMBER — how many bodies exist in the walkable world
The walkable valley holds ~10,600 homes' worth of pre-collapse capacity. Apply
the die-off:

| die-off | survivors in the walkable valley | per residential neighborhood | reads as |
|---|---|---|---|
| 70% gone (engine placeholder, 0.30) | ~2,690 | ~15 | a living village on every block. **Contradicts the dead world.** |
| 90% gone | ~900 | ~5 | a family or two per block |
| **97% gone (the GDD's ~3% remain)** | **~320** | **~1.8** | **almost every house empty** |
| 99% gone | ~106 | 0.6 | you could walk an hour and meet nobody |

### C. THE ON-SCREEN NUMBER — how many you can see at once
This is a phone. The camera holds ~17x35 cells. **8-14 visible bodies is the
comfortable ceiling** before it reads as a crowd, and the LOD system already
built for this (`bohemia_loop.js`: HOT within 15 cells = full sim, WARM to 34 =
counted only, COLD beyond = asleep).

---

# PART 5 — THE RECOMMENDATION: PEOPLE CLUSTER, THEY DO NOT SPREAD

**~320 people spread evenly over 177 neighborhoods is 1.8 per block — which
means you meet nobody and the world feels like a screensaver.** The same 320
clustered is the best version of this game.

This is not a gameplay cheat, it is what actually happens. Post-collapse
populations concentrate at water, food and defensibility, and abandon the rest.
Every real case does this — siege Sarajevo, post-Katrina New Orleans, every
famine migration. The empty ground between is the point.

**THE SHAPE, at ~97% gone (the GDD's own number):**

| | people | where |
|---|---|---|
| **6-10 SETTLEMENTS** | 20-40 each, ~250 total | at water, food or a defensible mass |
| **HOLDOUTS** | 1-3 each, ~50 total | ~25 scattered neighborhoods |
| **THE ROAD** | ~20 moving at any time | walkers, caravans, scavengers |
| **~150 of 177 residential neighborhoods** | **ZERO** | empty shells, enterable, scavengeable |

What that gives you as a player: **you walk for real minutes through nothing, and
arriving somewhere with people in it is an EVENT.** That is the dead world you
have been asking for all week, and it comes from your own canon number.

---

# PART 6 — PER DISTRICT: HOW MANY, AND WHY THERE

Every "why" is a real reason from our own survival accounting, not vibes.

### SETTLEMENT-GRADE — where people actually are

| district | cells | people | why there (grounded) |
|---|---|---|---|
| **wash / tunnels** | 58 | **30-60** | Vegas's storm drains really did house a documented population of several hundred before the crash, and the GDD says it plainly: *"tunnels 20 degrees cooler — the Homeless knew first."* First shelter anyone found. Also your demo's spine. |
| **farm** | 87 | **40-80** | The only calories. The GDD: full conversion needs 5,000-10,000 farm workers valley-wide; at our scale that is the biggest single employer. Whoever organizes farm labor organizes the city. |
| **downtown** | 30 | **30-50** | Towers = thermal mass, defensible verticality, and the deep casino/resort dry stores the GDD names as *"THE reason downtown matters."* |
| **resort** | 118 | **20-40** | Mega-blocks: water tanks, kitchens, laundry plant, thousands of beds. One resort can be a whole faction's keep. Sparse per cell, dense at the anchor. |
| **campus / medical** | 10 | **10-25** | Medicine is the brutal ledger. The GDD flags *UNLV chemistry as the pharmacy* [PENDING]. Whoever restarted a lab is the most protected person alive. |
| **dam / intake / watertreat** | 9 | **10-20** | Water and 2GW. The GDD calls the reclaim plant THE survival event. Held, not lived in — a garrison, not a village. |
| **town / swapmeet** | 10 | **15-30** | Trade. The barter stage already has a district built for it. |

### THIN — a holdout, a squat, a watcher

| district | cells | people | why |
|---|---|---|---|
| suburb | 2,623 | **40-70 total**, in ~20-25 of 164 neighborhoods | Sprawl is the worst place to survive: no water pressure, no thermal mass, indefensible. Most of it is empty. This is the number that makes the walk feel dead. |
| apartment / trailer | 123 | 10-20 | Denser than suburb, easier to hold one stairwell |
| estate / gated | 77 | 5-15 | Walls are why anyone is there at all. Small, armed, unfriendly |
| commercial | 361 | 10-20 | Picked clean years ago. Squatters and ambushes, not homes |
| strip | 81 | 5-15 | Loud, exposed, symbolic. Nobody sane sleeps there |
| industrial / storage / railyard | 24 | 5-15 | Materials and workshops. Salvage crews, day use |
| solar | 301 | 5-10 | Panels need patrolling, not populating |
| park / golf | 41 | 5-10 | GDD: *"golf courses are the crown jewels"* — irrigation already in the ground. Worked, not slept in |

### EMPTY — zero residents, by design
mountain, desert, water, basin (1,624 cells / 17.6%), every road class (arterial
+ freeway + rail = 3,432 cells / 37%), airport, airbase, landfill, cemetery,
prison, jail, boneyard, drivein, speedway, stadium, sphere, convention.

**That is 55%+ of the valley with nobody living in it, and that is correct.**
Roads and desert are where you MEET people (see the road number above), never
where they live.

---

# PART 7 — THE LIVES THEY LIVE

The engine already has **four** archetypes (`bohemia_agents.js`, corrected by you
on 7/19 after everyone woke up at once): **worker / scav / keeper / watch**, each
with its own real clock — worker shifts stagger 05:30-09:00, scav takes Mojave
midday shelter, keeper barely leaves, watch sleeps late and works dusk.

That skeleton is right and it is grounded (desert labor really does run
07:00-15:00 to dodge 40C afternoons). What it is missing is that **all four are
the same person with a different alarm clock.** A life is not a schedule, it is
a schedule plus *a reason to be somewhere* plus *something that can change.*

### THE SIX MORE THAT THE WORLD ALREADY IMPLIES
Each one is justified by a district or system that already exists — I am not
inventing roles, I am naming the ones the map has already built jobs for.

1. **FARMHAND** — the biggest employer in the valley by the GDD's own labor math.
   Walks out before dawn, works the wash-fed fields and golf-course strip-fields,
   home after dark. Seasons invert: winter grows, summer survives.
2. **WATER CARRIER** — 4L/day/person and dead household plumbing means somebody
   moves water every single day. The most repeated journey in the city and the
   most reliable place to meet a stranger.
3. **CORPSE COLLECTOR** — the GDD locks corpse collection as *"a natural in-game
   system"*, and which fertilizer story is true is deliberately deferred. That is
   a job somebody does. Nobody talks to them.
4. **CARAVANNER** — the 15 NORTH is the fuel road (Salt Lake refining) and the 15
   SOUTH is the exodus road. Passes through, does not live here, carries news.
   The one NPC who knows what is outside the valley.
5. **TUNNEL DWELLER** — not a job, a place. Lives underground, comes up at night,
   knows the storm drains better than the streets. Act 1's demo population.
6. **THE TOUCHED** — the ones the Amalgamation has been near. In ACT 1 THIS MUST
   READ AS POSSESSION, NOT TECHNOLOGY (locked 7/24): they know things they should
   not, speak in someone else's words, move wrong. Nobody says the word
   "Amalgamation" and nothing explains it. Rare — one or two in the whole act.

### WHAT MAKES THEM FEEL ALIVE, IN ORDER OF VALUE PER UNIT OF WORK
1. **They are somewhere for a REASON you can see.** A water carrier walking from
   a tank to a house reads as a life. The same body wandering reads as a bot.
   The schedule system already supports this; what is missing is that the
   destination should be a REAL place on the map, not a direction.
2. **They react to being looked at.** Cheapest realism there is.
3. **They remember one thing about you.** The feed and CLOUT already track what
   you did. An NPC who mentions it once is worth more than fifty new bodies.
4. **A few of them die or leave and do not come back.** The world should thin.

---

# PART 8 — ACT 3 HAS MORE PEOPLE

You said it, and the system already agrees in two places: the ACT TEXTURE
PROGRESSION (act 1 rubble → act 2 patched → act 3 rebuilt + green) and the asset
sweep, where **vegetation is an ACT 3 category** — grass, gardens, fountains,
spring trees. The world literally regrows.

Population should follow the food, because the food ceiling is the law:

| | population | share of the 50-80k ceiling | what it looks like |
|---|---|---|---|
| **ACT 1** | ~320 walkable / ~69k valley | ~90% of the ceiling, but starving and scattered | empty shells, 6-10 settlements, most of the map dead |
| **ACT 2** | **x3-4 → ~1,000-1,300** | consolidating, farms working | settlements merge into districts, roads get used, first markets |
| **ACT 3** | **x6-8 → ~2,000-2,600** | at the ceiling, fed | neighborhoods live again, the empty suburb is the exception |

Act 3 is not "more spawns." **Act 3 is the empty neighborhoods filling in** — the
same map, the same houses, now occupied. That costs no new districts and it is
the most legible way to show a century of recovery: you walk the block you
scavenged in act 1 and somebody lives there.

---

# PART 9 — THE PLUMBING GAPS (mechanism, no code written)

Found while reading. Each is real, none is fixed here.

1. **THE DIE-OFF DIAL IS UNRULED AND WRONG.** `OCCUPIED_RATE=0.30` (70% gone) vs
   the GDD's ~3% remain (97% gone). Eight times apart. One line, waiting on you
   for nine days. **This is decision #1 below.**
2. **AGENTS ONLY EXIST FOR SUBURB PLOTS.** `agentsForPlot` places people on
   world-model *homes*. Every non-residential district in the table above has no
   population path at all — a farm has no farmhands because nothing puts them
   there. That is the biggest mechanism gap between this research and the game.
3. **NOTHING CLUSTERS.** Occupancy is a per-house dice roll, so people spread
   evenly. Part 5 needs settlements to be a real thing the world model places,
   not an emergent accident of a uniform roll.
4. **THE JOB LOOKUP IS RADIUS-3.** An agent finds a site job within 3 overmap
   cells = 72m at today's scale. Nobody can work at the farm two neighborhoods
   over, so almost everybody falls through to 'scav'.
5. **THE SCALE DISCREPANCY** in Part 2.

---

# WHAT I NEED FROM YOU (the three that unlock everything)

**1. THE DIE-OFF.** Your GDD says ~3% remain. The engine ships 30%. Which is
true? My recommendation is **~3% remain (97% gone)** — it is already your canon,
it agrees with the food ceiling, and it is the only one that produces the dead
world you keep asking for.

**2. CLUSTERED OR SPREAD?** Recommendation: **clustered** — 6-10 settlements plus
scattered holdouts, most neighborhoods empty. Grounded in every real collapse,
and it turns "meeting someone" into an event instead of scenery.

**3. THE ACT 3 MULTIPLIER.** Recommendation: **x6-8**, which lands act 3 at the
food ceiling the GDD already locked. Same map, empty houses filling in.

Everything else in here is measurement and can be built the moment you rule
those three.
