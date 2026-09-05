# ECONOMY -- ROUND 6: A CASINO IS NOT A PRIZE, IT IS A JOB
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q6 [casino backstage], verbatim from VAMILY.md:
#   "Who runs a casino when the money is gone. The back of house as an economy:
#    laundry, kitchens, boilers, the deep dry stores (day 8). What a fortress
#    actually produces."
# The file is named DAY 6 for the machine. A round is one VAMILY, and it is
# never called a day to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

Our own economy module says the reason downtown matters is the **"deep
casino/resort dry stores"**. That sentence has been in the build since 7/19.

**There is no dry store. There is no laundry, no boiler, no loading dock, and no
back of house of any kind, anywhere in this game.**

The casino's district art is sixteen legend codes and **every one is exterior**:
sidewalk, valet lane, floor mass, roof band, hotel wing, park deck, marquee,
doors. Behind the doors, the interior grammar gives it six rooms: concourse,
counter, kitchen, locker, restroom, service.

And the real answer to "what does a fortress produce" is not a list of goods.
**A resort puts 30% of its floor area into the machine that keeps the other 70%
alive, and it takes about four thousand people to run.** A casino is not a prize
you capture. It is a payroll you inherit.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE CASINO IS A FACADE WITH A DOOR IN IT
`engine/bohemia_casino.js` is 175 lines of genuinely good research: no setback
because the old downtown blocks were platted before cars, a low wide floor
swallowing the block, a slender hotel wing on the back, the marquee as the whole
facade, the car banished to an alley deck, a service alley cutting the block.
Its sixteen legend codes:
```
0 sidewalk   1 valet/alley   2 casino floor (mass)   3 debris   4 floor roof band
5 drive entrance   6 hotel wing   7 entry apron   8 self-park deck   9 sign standard
10 abandoned vehicle   11 lane marking   12 marquee   13 casino doors (PORTAL)
14 wing roof plant   15 floor skylight
```
**Sixteen for sixteen, outside.** The only interior thing in the file is code 13,
a door. Note code 14 is "wing roof plant", which is rooftop mechanical seen from
above, not a room you can stand in.

### 1b. AND BEHIND THE DOOR, IT IS A STADIUM
`casino` declares `zone:'leisure'`, and the leisure floorplan grammar is:
```js
leisure: {roles:['concourse','counter','kitchen','locker','restroom','service'],
          bulk:'concourse', minRoom:5}
```
Six role slots. The back of house is `kitchen`, `locker` and `service`. No
laundry, no boiler, no store, no dock.

**And `bulk:'concourse'` is the part that matters.** The bulk role is what a
bigger building gets more of, and the file says why in its own comment: *"A
bigger leisure building is more CONCOURSE; that is what a concourse is for."*

**So in our build, the bigger the resort, the SMALLER its back-of-house share.**
The real curve runs the other way, and section 2a has the number.

This is not a mistake, it is an unfinished split. The same file already did this
surgery once and documented it beautifully: `institutional` was carrying eleven
building types and producing *"a school of hospital wards, a fire station of
hospital wards, an airport terminal of hospital wards"*, so it was split into
school, transit and firehouse. **`leisure` is the same shape one step behind**:
it currently carries drivein, golf, stadium, waterpark, speedway, ballpark,
minigp, resort AND casino. A stadium really is mostly concourse. **A resort is
the opposite building**, and the two are sharing one grammar.

### 1c. THE ROOMS IT NEEDS ALREADY EXIST AND ARE ALREADY DRESSABLE
`bohemia_furnish.js` can furnish **25 room roles**:
```
atrium bath bed breakroom checkout concourse counter dock floor_open gallery hall
kitchen living lobby locker meeting office reception records restroom room service
shopfloor stockroom ward
```
**`dock` and `stockroom` are both in that list.** They are used by `warehouse`
and `retail`. The casino, whose deep stores our own module calls the reason
downtown matters, is assigned **neither**. REUSE-FIRST: the dry store and the
loading dock are built, furnished, and pointed at the wrong buildings.

### 1d. AN HONEST CORRECTION TO A CLAIM I ALMOST MADE
The floorplan file says the floor pool *"maps 36 names"* and lists `plant`,
`dining`, `corridor`, `garage`, `study` and `exam` as sitting unused. I was about
to route "the boiler room art already exists". **It does not, or at least not
where it counts:** `plant`, `dining` and `corridor` are not among the 25 rooms
`bohemia_furnish.js` can dress. A boiler room is a real art ask, not a free
rewire, and this record says so.

**And the same check found a live gap that is not mine:** the floorplan assigns
`study` (school) and `garage` (firehouse) and **the furnisher dresses neither**.
Two zones are placing rooms nothing can furnish. Routed, not fixed.

### 1d-bis. AND BOTH FLOORPLAN GATES PASS
`FLOORPLAN GATE: 11 passed, 0 failed (12 zones)` and `floor_gate PASS 18 ok`.
Run this round, green. They check that the zones are well formed; **neither asks
whether a zone's rooms make sense for its buildings, and neither asks whether an
assigned role can actually be furnished.** So a resort built out of concourse
passes, and two zones placing rooms the furnisher cannot dress pass. This is the
same shape round 1 found in `economy_gate`: the checks prove the structure is
consistent and never ask whether it is right. **Consistency is not truth**, and
it is worth saying out loud that nothing here is anybody's negligence -- no gate
was ever pointed at the question.

### 1e. THE SENTENCE WITH NOTHING UNDER IT
```
engine/bohemia_economy.js:29
//   deep casino/resort dry stores -- THE reason downtown matters.
```
Repo-wide, that string appears three times: the module and its two inlined
copies. **Nothing reads it, nothing implements it, and no room in the valley is a
dry store.** It is a design intention that has been sitting in a comment since
7/19 while the thing it describes was never built.

### 1f. THE OTHER HALF: `strip` IS A ROAD, NOT A BUILDING
I checked before writing, because `strip` declares `zone:'default'` (roles
`room, room, service`) and "the Strip is three rooms called room" was a sentence
I very much wanted to write. **It is false.** `strip` has no `foot:` function and
sits in `ROADSET` alongside freeway, arterial and beltway. It generates no
buildings. What IS true and does matter: **`farm` declares `default` and does
have footprints**, so a farm's interior is `room, room, service`, and day 3 named
the farm as one of the anchors that brings people back.

## 2. THE REAL AISLE: WHAT A RESORT ACTUALLY IS

### 2a. THIRTY PERCENT OF IT IS THE PART GUESTS NEVER SEE
Hotel design standards put back of house at **20-30% of total floor area**, and
the split by class is the finding: **about 10% for an economy hotel and about 30%
for a resort hotel.** Inside that, housekeeping and laundry alone take **13-20%
of floor area**, staff areas **5-8%**, and a kitchen runs about **40% of the
dining area it serves** (the standard is 60 dining / 40 kitchen).

**So the richer and more serviced the building, the MORE of it is machine.** Our
`bulk:'concourse'` produces exactly the inverse curve.

### 2b. IT IS A TOWN'S WORKFORCE, IN ONE BUILDING
Reported headcounts for single Las Vegas properties: **the Venetian around 4,100;
Bellagio around 2,500; MGM Grand in the 1,500 to 5,000 range** depending on
source. One resort employs more people than live in a small town.

**That is the answer to "who runs a casino when the money is gone."** Nobody
runs it. **A faction that takes a resort has taken a building it cannot staff**,
and what it can actually operate is set by how many people it can feed, not by
how many it can arm.

### 2c. WHAT IT WEIGHS, PER DAY
Laundry is the one back-of-house number with a hard industry figure:
**8 to 12 pounds per occupied room per day, and over 12 for luxury properties**,
at an operator rate of **85 to 132 pounds per operator hour**. A resort at even a
few hundred occupied rooms is running tons of laundry a day and needs bodies,
water, heat and power to do it.

**Laundry is the perfect first back-of-house industry for us**: it is
labour-hungry, it needs water and heat, its output is visible on a person, and
day 20's dispatch already established that everyone dresses like a runway. **Who
has clean clothes is a readable class marker with no number attached.**

### 2d. AND THE MOMENT THE POWER STOPS, MOST OF IT IS DEAD WEIGHT
- **A full walk-in freezer holds about 48 hours. Half full, about 24.** After
  that the deep stores our module is banking on are spoilage, not treasure.
- **Water pressure in a high-rise runs on electric pumps.** No power means no
  water above the ground floor. The hotel wing on the back of our casino is, on
  day one of a dead grid, a stack of rooms nobody can wash in.
- Generators run on stored fuel and stop when it is gone.

**So a resort's stores are not a vault, they are a countdown**, which is day 10
of the BB study arriving in a kitchen.

### 2e. THE ONE THAT IS ALMOST OUR LAW, WRITTEN BY A REAL OPERATOR
A Las Vegas operator built a **100 MW solar array supplying up to 90% of the
DAYTIME power** for **13 of its resorts**. Read the qualifier. **Daytime.** The
biggest private power project on that Strip runs the buildings while the sun is
up and does nothing at night.

**That is LIGHT IS TERRITORY and THE NIGHT EATS POWER, already true in the real
Las Vegas, before we invented anything.** Our solar district and our 12% grid are
not a fiction we have to justify. They are a documented arrangement.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The standing stronghold shape: **a holding produces only what its assigned
  people produce**, so the interesting decision is never "do I own it" but "who
  do I put in it and what do I therefore not have elsewhere". A building with no
  staffing question is a trophy, not a system.
- **Capacity beats inventory.** A base that is interesting has a throughput you
  can raise, not a chest you can empty. Our economy is currently a chest.
- The failure mode this avoids, and it is the one we are closest to: **a
  landmark that is only a landmark.** A building the player captures, sees change
  colour, and never thinks about again.

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE HAVE BEEN TREATING THE CASINO AS THE PRIZE AT THE END OF DOWNTOWN. THE
> REAL BUILDING IS THIRTY PERCENT MACHINE AND FOUR THOUSAND PEOPLE, AND THE
> MOMENT THE POWER STOPS IT IS THE MOST EXPENSIVE THING IN THE VALLEY TO HOLD.**

Our own module calls the dry stores "THE reason downtown matters", which frames a
resort as a container of loot. Every real number says the opposite. The stores
spoil in 48 hours without power. The rooms have no water above the ground floor
without pumps. The laundry that keeps a few thousand people in clean clothes is
13-20% of the floor plate and needs water, heat and hands.

**A fortress does not produce because it is big. It produces exactly what it can
still power and still staff, and everything else in it is a liability.** That is
a far better game than a loot building, it costs no new currency, and it lands
straight on FACTIONS: **whoever holds a resort is whoever can field a laundry
crew and a boiler man**, which is a much stranger and better thing to fight over
than a vault.

### 4b. AND THE SMALLER, SHARPER ONE
`leisure` carrying both a stadium and a resort is the `institutional` mistake one
step behind. The file already knows the pattern, already documented the fix, and
already did the surgery once. **A stadium is mostly concourse. A resort is mostly
back of house. Sharing `bulk:'concourse'` gives us the one building in Las Vegas
whose insides get emptier the bigger it gets.**

## 5. WHAT A FORTRESS ACTUALLY PRODUCES (mechanism only; every number stays his)
From the real record, in the order a dead resort can restart them:
```
1  WATER      it has tanks, and it has the only pumps worth fixing. needs power.
2  HEAT       boilers. laundry and kitchen both die without it.
3  LAUNDRY    labour-hungry, water-hungry, and the output is VISIBLE ON PEOPLE.
4  KITCHEN    cooks for a crowd, which is the thing a household cannot do.
5  BEDS       last, not first: no water above the ground floor until 1 works.
```
Every one of those is a **capacity**, not a stock. Every one is gated on power,
which is gated on light, which is territory. And none of it needs a number on
screen: **you can see who has clean clothes and who does not.**

## 6. REFUSED
- **Inventing what a resort yields per round.** PRODUCTION is empty on purpose
  and correctly so; the ids are not real yet and the numbers are his.
- **A fourth currency, a staffing meter, a morale bar.** Banned by 7/26 and by
  day 7.
- **Splitting the `leisure` zone myself.** That is LIFE + CITY's file and their
  call; this lane measured the inversion and routed it.
- **Claiming the boiler art is free.** Section 1d: it is not, and I nearly said
  it was.
- **Deciding who holds which resort.** MAP LAW: the layout and the owners are his.
- **Any implementation.** MODE: RESEARCH.

## 7. ROUTED

**LIFE + CITY** (owns the floorplan)
- `ECON-A-RESORT-IS-NOT-A-STADIUM` -- split `leisure` the way `institutional` was
  split. A stadium is mostly concourse; a resort is 30% back of house. Today they
  share `bulk:'concourse'` and the resort gets emptier as it grows.
- `ECON-THE-DRY-STORE-EXISTS-ALREADY` -- `dock` and `stockroom` are furnishable
  today and assigned to warehouse and retail only. The casino gets neither, while
  our economy module calls its stores the reason downtown matters. Reuse-first,
  no new art.
- `ECON-TWO-ZONES-PLACE-ROOMS-NOBODY-CAN-FURNISH` -- not this lane's question and
  found on the way past: floorplan assigns `study` (school) and `garage`
  (firehouse); `bohemia_furnish.js` dresses neither.

**FACTIONS**
- `ECON-A-RESORT-IS-A-PAYROLL` -- holding a seat is a staffing problem, not a
  conquest. What it produces is set by what it can power and staff. Rides with
  the claimed `[faction homes]` FACTION-SEATS row.

**WORLD**
- `ECON-THE-STORES-ARE-A-COUNTDOWN` -- 48 hours of freezer, no water above the
  ground floor without pumps. The deep stores are a clock, not a vault.
- `ECON-DAYTIME-ONLY-IS-REAL` -- a real operator's 100 MW array covers up to 90%
  of daytime load for 13 resorts and nothing at night. Our 12% grid and
  night-eats-power law are documented fact, not invention. Worth citing in the
  law rather than defending it again.

**COOK**
- `ECON-THE-BOILER-ROOM` -- a `plant` room is a genuine art ask; `plant`,
  `dining` and `corridor` are not in the furnisher's 25. Only after the split.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections DD onward. All
`draft:true`, none of it in the game.

## 9. SOURCES
Back-of-house space: Cornell (deRoos), "Planning and Programming a Hotel";
FSM.How, "Hotel Space Standards: A Guide to Sizing Every Area from Bedrooms to
Kitchens"; Hospitality Facilities Design, administration and back-of-house
allocations; hotel design area requirement guides.
Laundry: industry guides on pounds per occupied room per day and pounds per
operator hour (Caldwell & Gregory; Western State Design; Softrol; Hotel Business).
Headcounts: ZoomInfo and RocketReach company profiles for MGM Grand, Bellagio and
the Venetian Resort Las Vegas; MacroTrends for MGM Resorts International.
Power and outage behaviour: PR Newswire and pv magazine on the 100 MW Mega Solar
Array supplying up to 90% of daytime power to 13 Las Vegas resorts; commercial
generator and hotel backup power guides; freezer hold times and high-rise pump
dependence from power-outage preparedness guidance.
Our own: engine/bohemia_casino.js, engine/bohemia_floorplan.js,
engine/bohemia_furnish.js, engine/bohemia_world.js DISTGEN,
engine/bohemia_economy.js.
