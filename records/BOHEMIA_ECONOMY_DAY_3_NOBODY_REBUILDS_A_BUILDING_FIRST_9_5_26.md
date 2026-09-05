# ECONOMY -- DAY 3: NOBODY REBUILDS A BUILDING FIRST
# (ECONOMY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q3 [rebuild order], verbatim from VAMILY.md:
#   "What people rebuild first. Cuba's Special Period, post-Katrina New
#    Orleans, Detroit, post-Soviet towns: the real order of rebuilding, for
#    the century rule's sequence."
# Day 1: BOHEMIA_ECONOMY_DAY_1_THE_PRICE_IS_NOT_THE_STORY_9_5_26.md
# Day 2: BOHEMIA_ECONOMY_DAY_2_THE_MONEY_IS_THE_CHARGE_9_5_26.md

## 0. THE HEADLINE

**IN ALL FOUR COLLAPSES THE FIRST THING THAT COMES BACK IS NOT A BUILDING. IT IS
PERMISSION, A MARKET DAY, AND A SCHOOL.** In that order, and none of the three is
a structure you place.

And the finding that goes at the wrong end of his own locked rule: the best
predictor of whether a neighbourhood comes back is not the damage, not the money
spent, and not what got built. **It is who knew whom before it happened.** After
the 1995 Kobe earthquake, most of the people pulled out of collapsed houses were
pulled out by **neighbours, not rescue workers.**

The century rule (7/26) says a dynasty that never builds gets a visibly poorer
act 3. That stands. What the record adds is that **a city can be rebuilt and
still be empty**, and our build currently has no way to tell those two apart,
because the century has no memory of who stayed.

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. FRESH NEWS, AND IT CHANGES YESTERDAY'S RECORD: THE MONEY IS NOW BATTERIES
Between day 2 and this hour another lane filled the price table. Measured just
now, not remembered:
```
PRICES rows: 11    every one { currency: 'electricity', amount: 1,
                     ruling: '8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY' }
PAYOUT rows: 1     (was 0 on day 1)
PRODUCTION rows: 0
```
**Day 1's "nothing pays and nothing is priced" is no longer true and this record
says so out loud.** A lane that reports yesterday's measurement as today's fact
is the rot this hierarchy exists to kill.

`PRODUCTION` is still empty, and its comment is the right call, not an oversight:
*"`produce()` has ZERO callers... there is no buildingId vocabulary to key on and
every row I could write here would be dead data nobody reads."* Verified: the
only two hits for `produce(` in the engine and the walked surface are its own two
definitions. **That empty table is the exact subject of Q3, and the reason it is
empty is that buildings have no economic identity yet.**

### 1a-bis. AND THE SHIP THAT DID IT LEFT A STALE RULER BEHIND
`market_gate` was 32/0 this morning and is **22 passed, 10 failed** now,
reproduced byte-identical on a clean worktree of `origin/main`. It is not a code
bug. I exercised the real buy path rather than believing the gate's text:
```
quoted: {"source":"ruled","price":1,"currency":"electricity", ruling: 8/15 + 9/4}
buy:    applied:true, paid:1, kind:"drain"
purse:  electricity 500 -> 499
```
**The purchase is perfect.** The gate watches the `resources` balance while the
debit now lands in `electricity` (so it reports "the money really left the purse
(500 -> 500)"), and four of its checks assert that his table is still empty and
that a price refuses instead of answering, which stopped being true the hour the
ruling shipped. **Fix the ruler, never the target** (Paolo 8/1). Flagged, not
fixed: one system, one session, and this lane does not implement.

### 1b. YOU CAN BUILD 59 THINGS AND THERE IS NO ORDER TO ANY OF IT
```
DISTRICT enum ....................... 79 types
BUILDABLE (placeable on desert) ..... 59
SKELETON (never buildable) .......... 16   mountain dam water freeway arterial rail
                                           railyard interchange reclaim intake basin
                                           watertreat reservoir quarry gypsum springs
prerequisites / unlocks / tiers ...... 0
anything gating a type by act, standing, population or progress ...... 0
```
The 59 include `casino`, `luxor`, `sphere`, `highroller`, `waterpark`,
`speedway`, `resort` and `golf`. **On day one of a collapsed valley you may
place a waterpark next to a farm, and nothing in the build has an opinion.** The
module says so honestly in its own header: *"Costs, rules, unlocks: [PENDING
Paolo]."*

### 1c. EVERY ANCHOR THE RESEARCH NAMES ALREADY EXISTS, AND NONE OF THEM DO
### ANYTHING
`school`, `library`, `medical`, `chapel`, `firestation`, `policestation`,
`cityhall`, `courthouse`, `campus`, `farm`, `granary`, `swapmeet` and
`commercial` are all in the buildable 59. **Thirteen for thirteen.** The art and
the enum are ready. Not one of them produces, houses, or changes anything,
because `produce()` has no callers and the builder has no notion of housing a
person (`residents`, `capacity`, `population` all absent from the build verbs).

### 1d. THE BUILDER DOES NOT KNOW WHICH ACT IT IS
`bohemia_cityedit.js` contains no act state at all. And on the walked surface:
```
act1 ..... 929 hits    (every one a tile MATERIAL tag)
act2 ....... 0 hits
act3 ...... 14 hits
```
I checked what the fourteen are rather than assuming, and they are not a city
state: they are `act1`/`act3` **power ordinals in the faction table**, one per
faction. So **the only thing in this entire build that forecasts act 3 is a
ranking of who will be strong, and his century rule is about what the CITY will
look like.** Nothing forecasts that, and nothing records it either: there is no
per-act tally of what a dynasty built.

### 1e. BUT THE OTHER HALF OF THE CENTURY IS ALREADY BUILT
`bohemia_belonging.js`, `bohemia_deeds.js`, `bohemia_memory.js`. The game already
tracks who you know, what you did, and who remembers it. **The layer the research
says actually predicts recovery is the layer we have, and the layer the century
rule counts is the layer we do not.**

## 2. THE REAL ORDER, FROM FOUR COLLAPSES

### 2a. FIRST IS NOT A BUILDING. IT IS PEOPLE POOLING WHAT ALREADY EXISTS
Kobe, 1995: the majority of people dug out of collapsed houses were dug out by
**neighbours**, not by firefighters. Post-Soviet Russia: **dacha gardening is the
reason there was no famine** when state agriculture collapsed with the state;
nearly all households became self-sufficient in vegetables and potatoes, and
urban plot-holders were producing roughly **12% of the national vegetable and
potato crop, 20% of fruit and 37% of berries**. Eight million families held a
plot by 1990.

**Nothing was constructed. Existing capacity was re-pointed at survival.**

### 2b. SECOND IS A MARKET, AND IT IS A DAY, NOT A SHOP
The recovery literature is consistent that small traders come back long before
infrastructure does, and that the cheap intervention is not a building: it is
**shortened market days, relocated markets to a safe site, pop-up workshops and
seasonal events** that let people resume trade "without requiring full-scale
commercial reopening". New markets appear within days: water, roofing,
transport, childcare, food preparation, debris removal, **mobile charging**.

**A market is a time and a place, not a structure.** (And note "mobile charging"
appearing unprompted in the real list. Day 2's charge economy is not invented.)

### 2c. THIRD IS PERMISSION, WHICH BEATS ANY BUILDING
Cuba, 1993: the Third Agrarian Reform gave **usufruct rights over about 70% of
agricultural land** to individuals and cooperatives, and the state got behind the
already-spontaneous urban gardens (organopónicos). **By 2001 food security in
Havana was under control.** Detroit: vacant lots now amounting to roughly the
land area of Paris became **hundreds of urban farms**, described as residents
providing "what the city's formal systems failed to provide".

**The unlock that fed two countries was a change in who is ALLOWED to use ground.
That is the third time this study has landed on the same rule: the reward is
ACCESS, not a number** (day 10 of the BB study, day 18's rung, day 2's charge).

### 2d. FOURTH IS THE ANCHOR THAT SAYS CHILDREN HAVE A FUTURE HERE
This is the hardest single finding in the day, and it is measured. In post-Katrina
New Orleans, research on which schools reopened found that **residential
rebuilding in heavily flooded neighbourhoods concentrated around the schools that
reopened, and stayed away from the schools that did not.** The wider planning
literature names the same set as "anchor facilities": **schools, groceries,
police and fire, health care**, because they "assure residents that their basic
needs will be supported". Groceries were the slow one: in disadvantaged
neighbourhoods food access did not return to pre-storm levels **until 2009, four
years after**.

### 2e. FIFTH, AND IT IS NEVER CHOSEN: ENERGY IS RATIONED, NOT REBUILT
Cuba lost its oil overnight. What followed was not a power programme; it was
**blackouts of up to 20 hours a day**, bread down to 80 grams a person, petrol
sales to individuals suspended, and **about 700,000 bicycles distributed by
1994**. People did not rebuild the grid. **They rearranged their lives around the
dark.** Our valley is 12% lit by law. That is not a gap in the design; the real
record says it is the design.

### 2f. AND IT IS PATCHY, NEVER A FRONT
New Orleans is where the shape is clearest. More than half of its 72
neighbourhoods got back above 90% of pre-storm population and sixteen gained,
while one development came back at **300%** and another at **0.1%**. The local
name for the texture is the **jack-o'-lantern**: a rebuilt house, a weedy lot, a
rebuilt house. Detroit went the other way and the numbers are the argument: 1.8
million people in 1960 to about 677,000 in 2016, on infrastructure built for two
million, with police taking an average of **58 minutes** to reach a homicide in
2013 against 11 minutes nationally.

**Recovery is not a line that advances. It is teeth with gaps, and the gaps are
where the ties were thinnest.**

## 3. *** THE FINDING THAT PROVES US WRONG ***

> **THE CENTURY RULE COUNTS BUILDINGS. THE EVIDENCE SAYS COUNT WHO STAYED.**

The four-city study of Tokyo 1923, Kobe 1995, Tamil Nadu 2004 and New Orleans
2005 reaches one conclusion: recovery differences "aren't explained by the
magnitude of the catastrophe or the amount of aid", and **pre-disaster social
capital is the best long-term predictor**, ahead of damage, wealth and
state investment. Social networks are what actually deliver the search and
rescue, the debris clearing, the childcare, the shelter and the information.

His rule says: *"if you never participate in building buildings that increase
resources or clout or electricity, the actual city in act three will be vastly
different."* **That is true and it stays.** What it cannot currently express is
the failure mode the record says is more common: **a city that was rebuilt and is
still empty.** Both halves need to compound, or act 3 delivers new buildings on
dead streets, which is his own "the city seems dead asf" complaint arriving a
hundred years late.

### 3b. THE SHARPEST VERSION, AND IT IS A HOLE IN THE THREE-CURRENCY RULE
The rule is: **a building houses people or produces resources, electricity or
clout.** Now take the one building the best-studied urban disaster in modern
history identified as predicting neighbourhood return.

**A SCHOOL HOUSES NOBODY AND PRODUCES NOTHING.**

Under the rule as written, a school cannot be expressed. Neither can a clinic, a
fire station or a grocery. They are all in our buildable 59 and all thirteen of
them are inert. **The most important building in a rebuilding city is invisible
to our economy.**

The fix is not a fourth currency, which is banned. It is that **the third thing a
building can do is MAKE PEOPLE STAY**, and that is not a new resource, it is the
population half of the 7/26 law ("whether to house more people or produce more
resources") finally doing something. `HOUSING` is already an OPEN row in WORLD
and has zero built.

### 3c. AND THE ANTI-SPREADSHEET RULE SURVIVES IT
He banned the multi-currency spreadsheet feel by name. Nothing above adds a
number to a screen. **A school's output is that a family is still on the block in
act 2**, which the player reads by walking past and seeing somebody they know,
not by opening a panel. That is the same trick as day 17's danger display and
day 2's grading a cell by ear: the world says it, not a readout.

## 4. WHAT THIS GIVES THE CENTURY RULE (mechanism only; every number stays his)
The sequence the record actually supports, as a sequence a game can hold:
```
0  SHARE      nothing is built. what exists gets re-pointed at survival.
1  MARKET DAY a time and a place. trade before any shop.
2  PERMISSION ground somebody is now allowed to use. an ACCESS unlock, not a build.
3  ANCHOR     the school, the clinic, the grocery. these make people STAY.
4  PRODUCTION only now does a building produce a thing.
5  LUXURY     the resort, the sphere, the waterpark. last, and only if anyone stayed.
```
Every rung is already a placeable type in our 59 except rungs 0 to 2, which are
not buildings at all. **Nothing here needs a new art asset.** And it is beat
friendly: a market day is a day, a permission is one tap, an anchor is one place,
and the compounding happens at the fold between acts, not per beat.

## 5. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters this record, the design, or the vocabulary.)
- The standing shape in builders is a **soft order created by need, not by a
  locked tech tree**: you can technically place anything, but only one or two
  things solve the problem you actually have this minute. That is a much better
  fit for us than prerequisites, and it costs no UI: **the 59 stay open and the
  valley's own state makes three of them obviously right.**
- The reliable first-ten-minutes trick is that **the first thing you place must
  visibly change the next thing you see** within a beat or two. Ours currently
  changes a tile and nothing else.
- The warning, which is Q4's job and is flagged here: a builder that opens with
  59 equal options and no pressure reads as a menu, not a decision.

## 6. REFUSED
- **A tech tree or hard prerequisites.** The record says need creates the order,
  not a lock, and MAP LAW plus his "radically simple" ruling both point away from
  it.
- **A fourth currency, a happiness meter, a population bar.** Banned by 7/26 and
  by day 7's obligations-not-meters finding.
- **Deciding which building anchors what.** Mechanism is mine, contents are his.
- **Rewriting the century rule.** It stands. This record proposes what it should
  ALSO carry, and that is a routed row for him, not a change I make.
- **Any implementation.** MODE: RESEARCH.

## 7. ROUTED
**WORLD**
- `ECON-THE-CENTURY-COUNTS-WHO-STAYED` -- the day's finding. The per-act record
  carries who stayed alongside what was built. Rides with `CENTURY-RECORD`, which
  is already OPEN and unbuilt, and with `HOUSING`.
- `ECON-A-SCHOOL-MAKES-PEOPLE-STAY` -- the third thing a building can do. Thirteen
  anchor types are already placeable and all thirteen are inert.
- `ECON-THE-ORDER-IS-NEED-NOT-A-LOCK` -- the 59 stay open; the valley's state makes
  a few obviously right. No tech tree.
- `ECON-PERMISSION-IS-A-BUILD` -- rungs 0 to 2 (share, market day, permission) are
  not structures. Ground somebody is now allowed to use is the unlock that fed two
  countries.
- `ECON-THE-BUILDER-KNOWS-THE-ACT` -- `bohemia_cityedit.js` has no act state, so
  nothing can compound. Smallest possible first step for the century rule.

**LIFE + CITY**
- `ECON-JACK-O-LANTERN` -- recovery renders patchy, not as a front. We already
  have the aerial and the per-cell delta; this is a look, not a system.

**FACTIONS**
- `ECON-ACT-3-IS-ONLY-A-POWER-TABLE` -- the only act-3 forecast in the build is 14
  faction power ordinals. Noted so nobody mistakes it for a city forecast.

**SHARED**
- Day 1 and day 2's row stands unchanged: a fixed price with no refusal is the
  restaurant that closed.

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections P onward. All `draft:true`,
none of it in the game.

## 9. SOURCES
Social capital: Daniel P. Aldrich, *Building Resilience: Social Capital in
Post-Disaster Recovery* (University of Chicago Press); Aldrich and Meyer, "Social
Capital and Community Resilience" (*American Behavioral Scientist*, 2015); SSRC
and University of Chicago Press summaries.
Cuba: Wikipedia, "Special Period" and "Organopónicos"; SAGE Magazine, "Urban
Farm-Fed Cities: Lessons from Cuba's Organopónicos"; CNN, "Can the West cultivate
ideas from Cuba's Special Period?"; Yale Tropical Resources Institute on Cuban
urban agriculture.
New Orleans: PNAS, "Reconstruction of New Orleans after Hurricane Katrina: A
research perspective"; MIT CoLab, "Assessing Post-Katrina Recovery in New
Orleans"; The Data Center, "Changing New Orleans Neighborhoods"; research on
Archdiocese school reopenings and surrounding rebuilding; "10 Years Later:
Changes in Food Access Disparities in New Orleans since Hurricane Katrina".
Detroit: CNU, "The shrinking city"; Washington Post (2010) on the Bing shrink
plan; Métropolitiques, "Demystifying Urban Agriculture in Detroit".
Post-Soviet: P2P Foundation, "Dacha Model of Familial Food Production in Russia";
Cambridge/*Slavic Review*, "Contesting Capitalism at the Post-Soviet Dacha";
"Changes in food provision in Russian households since Perestroyka"; Food Tank on
dachas.
Business and informal recovery: Milken Institute on small business disaster
recovery; UNDRR on small businesses and resilience; NY Fed Liberty Street
Economics on small business recovery after natural disasters; Sasakawa USA,
"Seeds of Resilience: Lessons from Japan".
