# ECONOMY -- ROUND 7: THE CITY SITS A THOUSAND FEET ABOVE ITS OWN WATER
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q7 [water supply], verbatim from VAMILY.md:
#   "Water. Lake Mead, the real constraint on Las Vegas. What a valley of a few
#    thousand people actually needs and where it comes from when the pumps stop."
# Named DAY 7 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

**LAS VEGAS IS NOT SHORT OF WATER. IT IS ONE THOUSAND FEET ABOVE ITS WATER.**

The valley floor sits at about **2,028 feet**. Lake Mead's surface hit a record
low of **1,040.5 feet**. Everything the city drinks is lifted that gap by
machines: at the intake alone, **22 vertical pumps, each about 20 feet tall, at
3,000 to 4,600 horsepower**, then two booster stations, then eleven miles to a
treatment plant a thousand feet above the lake. The power bill for **one** of
those pumps is about **$4,000 a day**, and the water authority spends around
**$38 million a year on electricity**.

So the answer to "where does the water come from when the pumps stop" is:
**nowhere, and the lake is still full.** The water does not run out. **It stops
climbing.**

And the measurement that turns this from a doom fact into a design: **a valley of
three thousand people needs twelve cubic metres a day.** That is
**0.00035%** of what the real low-lake pumping station can move. There is not a
water shortage in a dead Las Vegas. **There is a lift problem**, and lift is
electricity, and electricity is the money we already chose.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. NOTHING IN THIS GAME PRODUCES WATER, AND EVERY PERSON DRINKS FOUR LITRES
```
water need per person per day ....... 4.0 L   (our own figure, researched, fine)
YIELD.site  water ................... 0
YIELD.scav  water ................... 0
every yield the module has ..........
   { site: {salvage:3, food:0.3}, scav: {salvage:1.2, food:0.15} }
```
Round 1 measured the consequence across six seeds: **water runs out between day
51 and day 60 in every one of them**, and it does not matter how many people
there are or how hard they work, because no job in the game makes water.

**That is not a bug in the module.** It models a block's standing water honestly:
a water heater at about 200 litres plus containers, per house, which is exactly
right. **The hole is that there is no second source at all.** No well, no spring,
no rain catch, no still.

### 1b. THE ENTIRE WATER SYSTEM OF THE VALLEY IS PAINTED SCENERY
```
dam ........... SKELETON (can never be built or demolished)
water ......... SKELETON
reservoir ..... SKELETON
intake ........ SKELETON
watertreat .... SKELETON
basin ......... SKELETON
reclaim ....... SKELETON
springs ....... SKELETON
pumpstation ... BUILDABLE
waterpark ..... BUILDABLE
```
And what any of it DOES, measured by grepping every reference outside its own art
module: **`intake`, `watertreat`, `reservoir`, `pumpstation` and `springs` are
each referenced exactly once, and every one of those single references is the
enum declaration itself.** They are names on a map with art attached and no
behaviour of any kind.

**The two water things you CAN build are a pump station and a waterpark.** The
pump station is, by the real record in section 2, the single most important
building in the valley. It currently does nothing at all.

### 1c. AND `springs` IS IN THE GAME, WHICH MATTERS MORE THAN IT LOOKS
The valley is named for its springs, and we have a `springs` district. Section 2c
is about what actually happened to them, and it is the most useful piece of Las
Vegas history for this game that I have found.

## 2. THE REAL AISLE

### 2a. THE LIFT IS THE WHOLE STORY
- Las Vegas: **~2,028 ft**. Lake Mead at record low: **1,040.5 ft**.
- Intake No. 3 sits at **860 ft elevation, about 35 ft BELOW the 895 ft "dead
  pool"** line, the level at which Hoover Dam can no longer pass water downstream
  to California, Arizona or Mexico at all. **Las Vegas deliberately built its
  drinking straw below the level where the river stops being a river.**
- The Low Lake Level Pumping Station finished in 2020 and went live in **April
  2022** when falling levels made an older station inoperable. Capacity **up to
  900 million gallons a day**.
- The lift: **275 feet** from intake to land by those 22 pumps, then uphill
  through two booster stations to a treatment plant **roughly 11 miles away and
  1,000 feet higher than the lake.**
- **$4,000 a day to power a single pump. ~$38 million a year on electricity.**

**Every drop of water in Las Vegas is a continuous act of electricity.** Not a
reservoir you draw down. A machine you keep running.

### 2b. AND THE PART NOBODY EXPECTS: INDOOR WATER IS ALMOST FREE
Nevada's Colorado River allocation is **300,000 acre-feet a year, the smallest of
any Colorado River state.** It gets away with that because it recycles **nearly
99% of indoor water** back to Lake Mead down the Las Vegas Wash, and takes
**return-flow credits**: every gallon returned lets it draw another gallon out.

**So showers, laundry and dishwashing are effectively free against the
allocation, and only what goes on the ground is truly spent.** Most of Southern
Nevada's real consumption is outdoor, where it evaporates and cannot be credited.

**For us: washing is cheap and irrigation is expensive**, which is the exact
inverse of what a survival game would guess, and it lands straight on round 6's
laundry finding. A fortress can run a laundry far more cheaply than it can run a
garden.

### 2c. THE SPRINGS DIED OF PUMPING, NOT OF DROUGHT
The valley is "the meadows" because of artesian springs running about **5,000
acre-feet a year**. **They dried up in 1962.** Not from climate: by 1960 the
population had passed 110,000 and was pulling nearly **50,000 acre-feet a year**
out of the aquifer, far beyond recharge. Pumping peaked around **88,000 acre-feet
in 1968**. USGS measurement: groundwater levels have fallen **as much as 280 feet
since 1912** in the deeper aquifers, with land subsidence of **up to 5 feet**.

**The city drank its own springs dry, and the ground sank five feet doing it.**

### 2d. AND THE RECOVERY WAS PUMPED THERE TOO (a correction to my own hypothesis)
I expected to find that the water table rebounds when pumping stops, which would
have made a lovely finding. **It is not what happened.** Las Vegas is cited as a
rare groundwater recovery case, and the recovery is **artificial**: since 1987 the
water district and its partners have **injected more than 360,000 acre-feet of
treated Colorado River water into the aquifer**, and groundwater is now only
about **10% of supply** because they deliberately stopped leaning on it.

So the aquifer under Las Vegas is, in part, **a bank of Colorado River water that
was pumped a thousand feet uphill and put back down again.** Even the groundwater
is electricity. I am writing this correction down because the version I nearly
shipped was more flattering and less true.

### 2e. WHAT THAT BANK IS WORTH TO A VALLEY OF A FEW THOUSAND
Using our own 4 L/person/day:
```
pop      needs L/day     m3/day     share of the 900 M gal/day station
1,000          4,000        4.0     0.00012 %
3,000         12,000       12.0     0.00035 %
10,000        40,000       40.0     0.0012  %

the springs that dried up in 1962, at 5,000 acre-ft/yr = 16,896,986 L/day
   would cover 3,000 people's drinking water 1,408 times over
the 360,000+ acre-feet banked underground since 1987
   = about 101,000 YEARS of drinking water for 3,000 people
```
**A hundred thousand years of drinking water is sitting under the valley, and our
game kills everyone of thirst on day 53.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The mechanism that fits what section 2 describes is **the utility you must keep
  running**, not the resource you must find: a thing that is fine until it is off,
  and whose failure is felt everywhere at once rather than in one meter.
- The reliable shape for that is **one building whose state the whole settlement
  reads**, so the player learns the dependency by watching everything else change
  when it stops, never by reading a supply figure.
- The failure mode to avoid, and it is the one our current model is in: **the
  slow drain that ends the game**. A resource that only ticks down teaches the
  player that time is the enemy, which is the opposite of a hundred-hour game
  about rebuilding.

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE MODELLED WATER AS A PUDDLE THAT RUNS OUT. IT IS A HEIGHT YOU HAVE TO LIFT
> IT TO, AND IN A DEAD LAS VEGAS THAT MAKES WATER A POWER PROBLEM, NOT A WATER
> PROBLEM.**

Our valley dies of thirst on day 53 because the water heaters empty and nothing
refills them. The real valley has a lake it cannot reach and an aquifer it cannot
raise, both containing more water than a few thousand people could drink in a
hundred thousand years. **The scarcity is entirely in the 280 feet, and 280 feet
is amps.**

That single change makes the whole lane's work line up:
- Round 2 said the money is the CHARGE in the battery, not the battery.
- Round 6 said a fortress produces exactly what it can power and staff, and a
  high-rise has no water above the ground floor without pumps.
- LIGHT IS TERRITORY. THE NIGHT EATS POWER.
- **So the battery is not just money. It is thirst.** A player who spends charge
  on light tonight is spending tomorrow's water, and nobody has to explain that
  once, because the pump is a building you can stand in front of.

### 4b. AND THE SMALLER ONE, WHICH IS FREE
`pumpstation` is already **buildable** and already does **nothing**. Round 3 asked
for a build order driven by need. Round 4 asked what makes a placed building feel
like it did something. **A pump station is the answer to all three questions at
once**: it is the one building in this valley whose purpose needs no tutorial, it
is already placeable, and turning it on is visible, audible and immediately worth
something.

## 5. WHERE THE WATER COMES FROM WHEN THE PUMPS STOP (the question, answered)
Ranked by what the real record supports, cheapest first:
```
1  WHAT IS STANDING IN THE BUILDINGS   water heaters and tanks. WE ALREADY MODEL
                                       THIS and it is the only source we have.
2  A WELL, WITH A LIFT                 the aquifer is 280 ft down and effectively
                                       bottomless at our population. needs power,
                                       or a hand pump and a lot of labour.
3  THE WASH AND THE RECLAIM PLANT      99% of indoor water is recoverable; the
                                       real city already does exactly this.
4  THE LAKE                            1,000 ft below the valley. the biggest
                                       prize and the most expensive to reach.
5  RAIN                                the Mojave. essentially nothing.
```
Every one of 2, 3 and 4 is gated on power. **Water is downstream of electricity in
Las Vegas, in reality, today.**

## 6. REFUSED
- **A thirst meter on the player.** Day 7 of the BB study and 7/26 both ban it,
  and section 3 says the drain is the wrong teacher anyway.
- **Rebalancing the water yield so the valley survives.** Same refusal as round 1:
  the famine and the drought get REPORTED to him, not tuned away. It may be his
  premise. NO DAMAGE BEFORE THE DIAL covers the spirit.
- **Deciding who owns the intake, the wash or the pump stations.** MAP LAW: the
  layout and the owners are his.
- **Inventing a litres-per-turn yield for a well.** Mechanism is mine, numbers
  are his.
- **Any implementation.** MODE: RESEARCH.

## 7. ROUTED
**WORLD**
- `ECON-WATER-IS-A-LIFT-NOT-A-STOCK` -- the finding. Water is not a draining
  puddle, it is a height, and the height is powered. Rides with
  BB-THE-NIGHT-EATS-POWER and with round 2's charge economy.
- `ECON-THE-PUMP-STATION-DOES-SOMETHING` -- `pumpstation` is already buildable and
  inert. The one building in the valley that needs no tutorial. Also answers
  round 3's need-driven order and round 4's "make a placement feel like
  something", so three rounds of this lane converge on one row.
- `ECON-A-WELL-IS-THE-SECOND-SOURCE` -- nothing in the game makes water; the
  aquifer is 280 feet down and, at our population, effectively bottomless.

**FACTIONS**
- `ECON-WHOEVER-PUMPS-DRINKS` -- water is downstream of power and power is
  clustered and owned. Same shape as round 2's "whoever holds the light is the
  mint". Rides with the claimed [faction homes] row.

**LIFE + CITY**
- `ECON-WASHING-IS-CHEAP-AND-GARDENS-ARE-DEAR` -- indoor water is ~99%
  recoverable and outdoor water is gone for good. The inverse of the intuition,
  and it lands on round 6's laundry and round 3's farm.

**COOK / DIRECTION**
- `ECON-THE-SPRINGS-ARE-A-STORY` -- the valley is named for springs that died of
  overpumping in 1962 and took five feet of ground level with them. We already
  have a `springs` district. That is set dressing with a hundred years of
  consequence in it.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections II onward. All
`draft:true`, none of it in the game.

## 9. SOURCES
Lake Mead and the intakes: SNWA, "Intake 3 & Low Lake Level Pumping Station" and
"Intake No. 3"; Penn State EARTH 111, "The Third Straw"; Las Vegas Sun, "Third
straw at plunging Lake Mead nearly complete"; CBS News on uncapping the third
straw; The Nevada Independent on the low-level pumps and "Day Zero"; Las Vegas
Review-Journal, "Follow a gallon of water from Lake Mead to a Las Vegas tap" and
the pump station construction piece.
Return-flow credits and recycling: SNWA, "Where Your Water Comes From" and its
conservation pages; Las Vegas Review-Journal, "Lake Mead 'credits' let Nevada use
more than its Colorado River share"; TPO Magazine, "How Las Vegas Turns
Wastewater into a Lifeline for Lake Mead"; LVGEA water infrastructure pages.
Springs, aquifer and subsidence: Penn State EARTH 111, "A Familiar History of
Water and Population Growth"; USGS, "Ground-water conditions in Las Vegas Valley,
Clark County, Nevada, Part II"; Nevada Bureau of Mines and Geology on Las Vegas
Valley subsidence; Las Vegas Sun, "Las Vegas groundwater management a success,
but overpumping issues loom"; Nevada Current / News From The States on the
groundwater recovery study; LVVWD, "Where your water comes from".
Elevations: Las Vegas city elevation references; reporting on Lake Mead's record
low surface elevation.
Our own: engine/bohemia_economy.js, engine/bohemia_cityedit.js,
engine/bohemia_overmap.js, and round 1's six-seed water measurement in
records/BOHEMIA_ECONOMY_DAY_1_THE_PRICE_IS_NOT_THE_STORY_9_5_26.md.
