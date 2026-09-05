# ECONOMY -- ROUND 10: FOURTEEN PERMANENT SHOPS FOR A FEW THOUSAND PEOPLE
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q10 [market day], verbatim from VAMILY.md:
#   "The market day. How real periodic markets work (who comes, from how far,
#    how often) and what the best games do with a trading trip, for the faction
#    towns."
# Named DAY 10 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).

## 0. THE HEADLINE

[faction towns] shipped a round ago and it is good work: **fourteen seats, tiers
derived off his own power column, never typed.** I measured them by booting the
loop the way the gate does.

**Every one of those fourteen seats has a market that is open every waking hour
of every day.** There is no notion anywhere in this build of a market day, market
hours, or a market being shut.

The standard theory of periodic markets says permanent shops appear **only where
demand density is high and the friction of distance is low.** Our valley is the
exact opposite on both axes: a few thousand people, and an hour and a half of
walking to your nearest neighbour's seat.

And the number that settles it: **a rural service centre with a periodic market
serves about five thousand people.**

> **THE VALLEY SUPPORTS ROUGHLY ONE MARKET. WE GAVE IT FOURTEEN, AND WE LEFT THEM
> ALL OPEN.**

And, for the third round running, **the canon already knew.** From the Caravans'
own dossier, verbatim:
> *"A convoy arrival is a market day, a festival and a security crisis at once -
> canon."*

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE FOURTEEN SEATS, AND THEY ARE REAL
Booted through `bohemia_loop`'s own boot, the way `faction_towns_gate` does it
(33 passed, 0 failed, "14 seats, tiers off his own power column"):
```
tier      faction        at          tier      faction        at
fortress  Caravans     (26,19)       town      Anarchists   (12, 4)
fortress  Cartel       (25,26)       town      Blues        (37,12)
fortress  Mob          (41,55)       town      Church       (65,31)
fortress  Network      (22,61)       town      Reds         (86,66)
fortress  Remnants     (30,73)
camp      Colorful     (64,37)       camp      Homeless     (41,49)
camp      Custom       (64,43)       camp      Trades       (28,78)
camp      Volunteers   (26,86)
```
Five fortresses, four towns, five camps. The tier is derived from `act1_power`
and re-derives for act 3, so **a fortress can become a camp across the century
with no new field**, which is the century rule for free. That is a good piece of
design and this record is not arguing with it.

### 1b. HOW FAR IS A TRADING TRIP
```
91 pairs of seats
closest        5 cells    Remnants <-> Trades
farthest      82 cells    Anarchists <-> Volunteers
mean pair   37.8 cells

EACH SEAT TO ITS NEAREST NEIGHBOUR (city travel is 10 minutes a cell):
  Remnants / Trades     5 cells   0.8h one way   1.7h round trip
  Church / Colorful     6 cells   1.0h           2.0h
  Custom, Homeless, Mob 6 cells   1.0h           2.0h
  Caravans / Cartel     7 cells   1.2h           2.3h
  Volunteers            8 cells   1.3h           2.7h
  Blues                11 cells   1.8h           3.7h
  Network              12 cells   2.0h           4.0h
  Anarchists           15 cells   2.5h           5.0h
  Reds                 23 cells   3.8h           7.7h   <- the outlier
MEAN NEAREST HOP  8.8 cells = 1.5h one way, 2.9h round trip
A WAKING DAY IS ABOUT 16 HOURS.
```
So a trip to your nearest market and back is **about 3 hours, roughly a fifth of
the waking day**, and Reds costs half a day. **The farthest pair is 82 cells,
13.7 hours one way: you cannot cross the valley and come back.** The spacing is
good. It is the opening hours that are wrong.

### 1c. NOTHING IN THIS BUILD CAN CLOSE A MARKET
```js
function mktBtnSync(){
  el.style.display = (mktAt() && DAY.phase === 'awake') ? 'block' : 'none';
}
```
That is the entire condition. **If you are standing at a hub and awake, the
market is open.** Repo-wide there is no `marketDay`, no opening hours, no closed
state, no calendar of any kind attached to trade.

### 1d. AND THE CANON ALREADY HAS MARKET DAYS
`engine/bohemia_belonging.js`, the Caravans' entry, his canon:
> *"Everything from outside the valley, and more importantly NEWS. A convoy
> arrival is a market day, a festival and a security crisis at once - canon. They
> are the only people in the game who can tell you whether anywhere else is still
> alive."*

**A market day is already canon, already written, already attached to the one
faction whose whole job is arriving.** Nothing reads it.

**THIS IS THE THIRD ROUND IN A ROW WITH THIS EXACT SHAPE.** Round 2: the quest
line already graded batteries ("real ones, charged, not that swollen junk") and no
system could hear it. Round 6: the economy module already called the casino dry
stores "THE reason downtown matters" and no dry store existed. Round 10: a market
day is canon and every market is always open. **The writing in this project is
consistently ahead of the machine, and it is the cheapest source of design we
have.**

### 1e. AND THE POPULATION IS UNSET, WHICH MATTERS HERE
`POPULATION-DEFAULT` is still an OPEN row in RUN and its note is "the number is
his". So I cannot say how many people the valley holds. **Section 2 gives the
threshold anyway, and at any plausible number the answer is the same.**

## 2. THE REAL AISLE

### 2a. THE THEOREM, AND IT RUNS BACKWARDS FOR US
The rationale for periodic markets is not tradition, it is arithmetic:
> *"markets are open only once every few days because the per capita demand for
> the goods sold in the market is low, and high transport limits the extent of the
> market, and the aggregate demand is therefore insufficient to support permanent
> sellers."*

And the converse, stated just as plainly:
> *"Periodic markets will be replaced by permanent shops or daily markets where
> there is a HIGH DENSITY OF DEMAND and a LOW FRICTION OF DISTANCE."*

**Bohemia is low density and high friction. Both conditions point at periodic
markets, and we built the thing the theory says only appears in a city that
works.**

Thresholds also track spending power: in poor economies markets are periodic
partly because people **can only buy once in a while**. Our valley starts the
player with an empty purse (round 1) and a money supply that only shrinks
(round 8).

### 2b. HOW FAR PEOPLE COME
- Catchment extends to about **one hour of walking, which is 5 to 6 km or more.**
- In Yorubaland, rural markets spaced at **10 km intervals**, which was "the
  maximum walking distance for those wishing to attend".
- A rural service centre serves **around 5,000 people** in a radius **not usually
  exceeding 10 km**, and its services are a primary school, a health post, a
  police post **and a primary market, often operating periodically.**

**That last line is round 3's anchor list and round 10's market in one sentence,
from the planning literature rather than from us.** School, clinic, police,
market. We already found the first three matter; this says they arrive together
and the market among them is periodic.

**Against our measurement:** our mean nearest hop is 1.5 hours of walking against
a real catchment of about 1 hour. **Our seats are spaced slightly wider than real
market spacing, which is fine and even good.** The error is not where they are.

### 2c. THE MARKET WEEK IS A REAL, SMALL, REPEATING NUMBER
Traders follow **"well established cyclical itineraries between different
markets"** -- a ring. And the periodicity is standardised across a region:
> *"Everywhere in West Africa there is a standard 'market-week' such that all the
> periodic markets in the locality are based on the same cycle, and there are
> effectively only four common market weeks"* -- with **4- and 8-day weeks
> widespread**, plus **3-, 6- and 5-day** cycles.

**So a market week is a single small integer that the whole region shares**, and
the seats take different days within it. That is a tiny amount of state.

### 2d. AND PRODUCERS WANT IT THIS WAY
> *"Producers often wish to buy or sell in the marketplace on only one or two days
> per week in order not to disrupt their production schedule."*

A market day is not a restriction imposed on traders. **It is what lets them do
anything else with the rest of the week**, which is exactly the tension our day
loop is made of.

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The reliable shape for a trading trip: **the trip is the content, not the
  shop.** What makes it memorable is what happened on the road and whether you
  arrive in time, never the transaction screen at the end.
- **A shop that is always open is a menu. A shop that is open on Thursday is a
  plan.** The deadline is what converts travel into a decision.
- The standing warning, and we are exactly here: **when every vendor stocks
  everything and is always available, the world map stops being a map** and
  becomes a list of equivalent buttons.
- And the mechanism the tiers already give us for free: **a place you can always
  reach and a place you must catch** are different kinds of destination, and
  having both is what makes a map worth reading.

## 4. *** THE FINDING THAT PROVES US WRONG ***

> **WE BUILT FOURTEEN SUPERMARKETS IN A VALLEY THAT CAN SUPPORT ABOUT ONE MARKET
> DAY, AND THE THING THAT FIXES IT IS ALREADY CANON, ALREADY TIERED, AND ALREADY
> ON A CLOCK.**

The theory is unambiguous: permanent shops are what you get when demand is dense
and distance is cheap. We have neither. A real service centre with a periodic
market covers about five thousand people; the valley is a few thousand **in
total**, spread over a map whose corners are fourteen hours apart on foot.

Fourteen always-open shops does not read as a collapsed city. **It reads as a
functioning retail economy**, which is the one thing this game is not about.

### 4b. AND THE FIX IS ALREADY PAID FOR
Everything a market ring needs has shipped:
```
the seats        14 of them, placed, gated, and never on empty ground
the tiers        fortress / town / camp, DERIVED, and they already scale DEPTH
                 (1, 0.67, 0.33 of the goods list)
the day loop     DAY.phase, a waking day, a nightfall, a reckoning card
the canon        "a convoy arrival is a market day" -- his own dossier
the distances    a nearest hop of 1.5h against a 16h day: a trip is a decision
```
**Periodicity is the tier system in time instead of in breadth.** DEPTH already
says a camp carries a third of the goods. **A market week says a camp opens a
third as often**, and it is the same derived number doing a second job.

That single change buys:
- **a week**, which the game does not currently have and a hundred-hour campaign
  badly wants,
- **a reason to travel on a particular day**, which is what makes the map a map,
- **a trader who ARRIVES rather than a shop that EXISTS**, which is the Caravans'
  entire canon job,
- and **scarcity with a rhythm** instead of a flat line, which is round 1's
  complaint answered from a completely different direction.

### 4c. THE HONEST COUNTER-ARGUMENT, STATED BECAUSE IT IS STRONG
A closed shop is a locked door, and a locked door on a phone is a bad turn.
Round 4 measured how thin the feedback already is; making a player walk 1.5 hours
to a shut market once would be a genuinely bad experience.

**So the mechanism has to be that you can always SEE when a seat is open before
you go.** That is a map affordance, not a market one, and it is UI's call. The
research says the market week is *public knowledge everyone in the region shares*
-- so in fiction, knowing which day is which is not information you have to earn.
**Nobody in a real market economy is ever surprised by market day.**

## 5. REFUSED
- **Choosing the market week.** Whether it is three, four, five or eight is a
  number, and numbers are his.
- **Deciding which seat opens on which day.** MAP LAW: who sits where and when is
  canon.
- **Closing markets without a way to see the day first.** Section 4c. Proposing
  the first without the second would be proposing a bad turn.
- **Touching the towns module.** It shipped one round ago, it is correct, and it
  is WORLD's file.
- **A calendar UI, a schedule screen, or an opening-hours table.** Round 5 settled
  the number question; this should be readable the way everything else is.
- **Any implementation.** MODE: RESEARCH.

## 6. ROUTED
**WORLD** (owns the towns module)
- `ECON-A-MARKET-IS-A-DAY-NOT-A-SHOP` -- the day's finding. Fourteen always-open
  shops in a valley that supports about one. The tiers already carry the
  periodicity: DEPTH scales goods by tier, a market week scales days by the same
  derived number.
- `ECON-THE-CONVOY-IS-THE-MARKET-DAY` -- his canon already says it, in the
  Caravans' own dossier, and nothing reads it. Third round running that the
  writing was ahead of the machine.

**UI**
- `ECON-YOU-CAN-SEE-WHICH-DAY` -- the counter-argument in 4c. A market week is
  public knowledge in every real market economy; nobody is ever surprised by
  market day. Without this, do not ship the first row.

**FACTIONS**
- `ECON-A-CAMP-OPENS-RARELY` -- the tier already means thinner. It should also
  mean rarer. Rides with the just-shipped [faction towns].

**RUN**
- Feeds the existing `POPULATION-DEFAULT` row with a threshold from outside the
  project: a rural service centre with a periodic market serves about 5,000
  people. Whatever number he picks, that is the scale it should be read against.

## 7. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections XX onward. All
`draft:true`, none of it in the game.

## 8. SOURCES
Periodic market theory: R.H.T. Smith, "Periodic market-places and periodic
marketing" (Progress in Human Geography, 1979 and 1980); "The rationale of
periodic markets", *Annals of the Association of American Geographers* 65(4);
ScienceDirect topic overview, "Periodic Market"; Wikipedia, "Threshold
population" and "Market town"; "Why Periodic Markets Are Held: Considering
Products, People, and Place in the Yunnan-Vietnam Border Area"; work on
spatio-temporal synchronization of periodic markets and West African market
weeks.
Catchment and service centres: FAO, "Identifying the need for rural markets"
(y4851e) and the FAO rural market planning chapters, including the Yorubaland
10 km spacing and the ~5,000-person rural service centre.
Our own: engine/bohemia_towns.js, gates/faction_towns_gate.js,
engine/bohemia_belonging.js (the Caravans' canon), engine/bohemia_loop.js boot,
slices/BOHEMIA_CITY_WORLD.html mktBtnSync, and rounds 1, 2, 3, 4, 6 and 8 of this
lane.
