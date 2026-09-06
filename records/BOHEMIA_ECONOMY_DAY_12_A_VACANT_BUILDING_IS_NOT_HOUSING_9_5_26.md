# ECONOMY -- ROUND 12: A VACANT BUILDING IS NOT HOUSING
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q12 [who's housed], verbatim from VAMILY.md:
#   "Housing. How people actually house themselves after a collapse (squatting,
#    doubling up, who gets the good buildings) for the other half of the economy
#    law."
# Named DAY 12 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

**HOUSING SHIPPED THIS ROUND**, from LIFE + CITY, while I was working. It is good
and this record is not arguing with it. Its central decision is the realistic one
rather than the convenient one:
```
CAPACITY   how many your buildings COULD house      (grows when you build)
RESIDENTS  how many actually live in what you built (capped by the valley)
```
> *"HOUSING DOES NOT CREATE PEOPLE. IT HOUSES THEM."*

That is correct, it protects his 7/29 food-ceiling ruling, and it is the answer
most city builders get wrong.

**What it counts is what the player BUILT.** `homes(edits)` reads
`production.placed(edits)`, so the roughly sixty-five thousand buildings already
standing in the valley house nobody, mechanically.

And the real record says that is **exactly right, and exactly half the story**:

> **A VACANT BUILDING IS NOT HOUSING. HABITABILITY IS. AND THE PATH FROM ONE TO
> THE OTHER IS REPAIR, WHICH IS HIS OWN LOCKED RULING FROM 8/1, WHOSE PLUMBING IS
> ALREADY BUILT, AND WHICH THE NEW HOUSING MODULE DOES NOT YET COUNT.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. WHAT LANDED, AND IT IS RIGHT
`engine/bohemia_housing.js`, 183 lines, and it did the thing this study keeps
asking for: **it measured first.** Its own header:
> *"build a suburb on empty desert and the valley's census does not move. 297
> people before, 297 after, and headsAt() on the plot you just built answers 0
> both times."*

It reuses `HOUSEHOLD_MEAN = 2.2` rather than inventing a number, reuses
`BohemiaPopulation.RESIDENTIAL` rather than adding a second list of building
types, and reuses `production.placed()` so a 4-lot block is one household here
exactly as it is one payout there. **One building, one household.** It carries its
own [PENDING Paolo]: whether an apartment block should hold more than a trailer.

### 1b. AND IT HOUSES ONLY WHAT YOU BUILD
```js
function homes(edits) {
  var b = PROD().placed(edits) || [], out = [];
  for (var i = 0; i < b.length; i++) if (capacityOf(b[i].type) > 0) out.push(b[i]);
  return out;                       // <- the valley's existing buildings are not here
}
```
Repo-wide there is **no squat, no occupy, no move-in** against existing stock.
A player who never places a single building has housed nobody, in a valley that
is already full of houses.

### 1c. BUT HIS RULING ALREADY SAYS THE OTHER HALF, AND THE PLUMBING EXISTS
From `engine/bohemia_population.js`, quoting him verbatim (8/1):
> *"when you fully repair a district, kind of like Stardew Valley - get rid of all
> the junk cars and make sure the electricity is on, solar panels everywhere -
> then more people will want to move in and live in the recovered ruins ... maybe
> towards the middle end of act one"*

And the machinery is there. The module carries **per-district dials** so "you fix
this district, THIS district fills up, and the one next door does not", and it
records a measurement of exactly that:
> *"Measured on cell (3,5): two residents before the repair, four after."*

**So occupancy already moves when a district is repaired. It just does not reach
the housing count**, because housing counts placements and repair is not a
placement.

**Two doors lead to the same number, and only one of them is wired.**

## 2. THE REAL AISLE

### 2a. THE NUMBER THAT SETTLES IT, FROM A CITY WITH TENS OF THOUSANDS OF EMPTY
### HOUSES
Detroit has an estimated **24,000 fewer units of HABITABLE housing** than its
population needs, which leaves **9% of all households** with no option but to
leave the city, live in blighted housing, or double up with another family.

And the reason the empty houses do not absorb them, stated plainly:
> **"the vacant housing often cannot be occupied due to its condition."**

**A city can hold tens of thousands of empty houses and a housing shortage at the
same time.** Vacancy and habitability are different quantities, and only one of
them is housing.

### 2b. SO PEOPLE DOUBLE UP EVEN WHERE HOUSES ARE FREE
The measured outcomes for a household that loses its home are: leave, take
blighted housing, **double up with another family**, or a shelter. Not "move into
one of the empty ones". Our module's rule is one building, one household, 2.2
people. **The real pressure valve is two households in one building**, and it is
the commonest single response in the record.

### 2c. WHO GETS THE GOOD BUILDINGS: ORGANISATION, NOT STRENGTH
- Informal settlements run on **"neighbourhood associations and councils"** that
  "manage land allocation, dispute resolution, infrastructure maintenance".
- They form either through an **organised occupation** or, more often, through
  **"gradual accretion as people move in over time"**.
- Occupiers prefer ground it is **harder to be removed from**.
- And the line that decides the map: **"the poorest residents occupy the most
  dangerous locations."**

**Good ground goes to whoever is organised enough to hold it. The unorganised get
the dangerous ground.** For us that is not a new system: **a faction seat IS an
organised occupation** (round 10 measured all fourteen), and a person with no
outfit gets the wash, the landfill and the boneyard.

### 2d. AND REPAIR IS WHAT RECOVERY PROGRAMMES ACTUALLY FUND
Real disaster-housing practice is not "build new". It is **funding repairs to
bring vacant homes up to code so survivors can occupy them**, because it is
cheaper and it keeps people in the same place. Multifamily rental is the least
likely thing to be rebuilt, because repairs are expensive and ownership is
tangled.

**The real world spends its money making standing buildings habitable. His 8/1
ruling is the same instinct, arrived at independently.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The shape that fits: **clearing and fixing a place is a build**, and it should
  count as one. A game that only rewards new construction teaches the player to
  ignore the city that is already there, which is the opposite of what this game
  is about.
- **A repaired ruin reads better than a new building** in a collapse setting,
  because the before-and-after is visible on the same ground.
- The failure to avoid: **housing as a number that goes up.** The measured
  version of this finding is that the player should see a street get lit and
  lived-in, not a counter increment.

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE HAVE TWO WAYS TO HOUSE SOMEBODY AND WE ONLY COUNT ONE. BUILDING NEW IS THE
> RARE ONE IN THE REAL RECORD; REPAIRING WHAT STANDS IS THE COMMON ONE, IT IS HIS
> OWN RULING, AND ITS PLUMBING IS ALREADY MEASURED AND WORKING.**

The housing module is right that placements house people. The gap is that in a
valley of sixty-five thousand standing buildings, **the first hundred people a
dynasty houses will almost certainly be housed by fixing a roof, not by pouring a
slab.** Detroit is the proof: the houses are there, the habitability is not, and
the shortage is real anyway.

And the two halves join with no new concept, because **both produce the same
quantity**: capacity. One from a placement, one from a repair. The module already
separates CAPACITY from RESIDENTS, which is exactly the seam a repair number
plugs into.

### 4b. AND THE SMALLER ONE, WHICH IS A PRESSURE VALVE
One building, one household, 2.2 people is right for a normal world. The record
says the response to a housing shortage is **doubling up**, and the module already
carries an open question about capacity per type. **Whether a building can hold a
second household under pressure is the same question one step further**, and it
is the thing that lets a valley absorb more people than it has good roofs.

### 4c. AND THE MAP CONSEQUENCE, FOR FREE
"The poorest residents occupy the most dangerous locations" gives the valley a
readable social geography with **zero new systems**: the fourteen faction seats
are the organised occupations, and the unaffiliated end up on the ground nobody
defends. Round 3's jack-o-lantern pattern and round 10's seats are the same
finding seen from two ends.

## 5. REFUSED
- **Rewriting or extending the housing module.** It shipped an hour ago, it is
  correct, and it is LIFE + CITY's file. This lane measured and routed.
- **Inventing a repair cost, a repair time, or how much capacity a fixed ruin
  yields.** Numbers are his, and the module already has a [PENDING Paolo] of its
  own on capacity per type.
- **A housing meter, a homeless count, or a satisfaction number.** Round 5 and
  7/26 both settle it.
- **Deciding which factions hold which ground.** MAP LAW.
- **Any implementation.** MODE: RESEARCH.

## 6. ROUTED
**LIFE + CITY** (owns housing and the district dials)
- `ECON-A-REPAIRED-RUIN-IS-A-HOME` -- the day's finding. Housing counts
  placements; his 8/1 ruling says repaired districts fill up; the per-district
  dial already moves occupancy (measured: cell (3,5), two before, four after) and
  does not reach the housing count. Two doors, one number, one of them wired.
- `ECON-DOUBLING-UP` -- one building, one household is right until there is
  nowhere to go. Doubling up is the commonest real response to a housing
  shortage. Rides with the module's existing [PENDING Paolo] on capacity.

**WORLD / FACTIONS**
- `ECON-THE-ORGANISED-GET-THE-GOOD-GROUND` -- "the poorest residents occupy the
  most dangerous locations". The fourteen seats are already the organised
  occupations; the unaffiliated get the wash and the landfill. No new system.

**RUN**
- Feeds `POPULATION-DEFAULT` again: the valley's ceiling is food (his 7/29
  ruling), but the number of people who are HOUSED is a separate quantity, and
  round 12 says it is set by habitable roofs rather than by standing walls.

## 7. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections HHH onward. All
`draft:true`, none of it in the game.

## 8. SOURCES
Detroit: University of Michigan Poverty Solutions, "Losing Home: Housing
Instability and Availability in Detroit" and its Detroit housing-shortage
reporting; Michigan Advance on Detroit's affordable housing; Citizens Research
Council of Michigan, "Examining Detroit's Vacancy Rate Drop"; SPUR, "Making
Detroit Home".
Post-disaster housing: National Low Income Housing Coalition, "Fixing America's
Broken Disaster Housing Recovery System"; Texas A&M Hazard Reduction and Recovery
Center disaster housing recovery planning; the Post-Disaster Housing Recovery
handbook (Humanitarian Library).
Squatting and allocation: Wikipedia, "Squatting" and its country articles;
UNHCR, "Informal settlements"; ScienceDirect topic overview, "Squatter
Settlement"; Albert.io AP Human Geography review on squatter settlements and
informal housing.
Our own: engine/bohemia_housing.js (shipped this round by LIFE + CITY),
engine/bohemia_population.js (his 8/1 repair ruling and the per-district dials),
engine/bohemia_production.js placed(), and rounds 3, 10 and 11 of this lane.
