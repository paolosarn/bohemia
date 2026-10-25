# ECONOMY DAY 81: THE MAYOR ARC, RESEARCHED. YOU PAY FOR THE CORE; THE PEOPLE BUILD THE CITY (10/25/26)

VAMILY ECONOMY [the mayor arc, researched], rule 161 (Paolo 10/24: "slowly over time become the pseudo-mayor of
Bohemia and build things... there's a city grid for a reason... research how we're going to do this, it has to be
lore friendly, the costs have to sound right, it's a big cost to revamp a whole city over three acts... every
building needs to come with a purpose, it has to look right... not immediately"). MODE: RESEARCH. Nothing here is
built, nothing here enters the game, no VOTE sheet (rule 88). Every number is a DRAFT for TUNING's one table
(rule 117: easier than Battle Brothers). Session economy-vamily-10-25, opened by the coordinator (rule 112).

Status of this page: written in pieces, committed as it grows (the coordinator's 15-minute rule).

---

## 0. THE ANSWER, SHORT

1. The canon already has the whole shape and it still holds: three rungs (YOUR GROUND, then THE CITY BACKS YOU,
   then THE HOUSE everybody calls the mayor), zone and the people build, road, power and water first, three
   cities across three acts, nothing built where nobody holds it. What was missing is what each building is FOR,
   what it COSTS, and what the map SHOWS. This page writes those.
2. THE FINDING THAT PROVES US WRONG: every real city that came back from the dead was mostly rebuilt by its own
   people, by hand, a room at a time, once somebody gave them the hard core (water, a roof slab, light, safety).
   Quinta Monroy: the state paid for half a house and the families built the other half themselves inside two
   years. Havana 1995: 25,000 family plots grew most of the city's vegetables. Warsaw fired new bricks out of its
   own rubble. So "a big cost to revamp a whole city" is true in HANDS AND YEARS, but most of it is never the
   player's batteries. The player pays for the CORE; his standing unlocks the PEOPLE; the people pay the rest in
   labour. Today's builder does the opposite: the player pays one battery for every single lot and the people
   build nothing ("the society builds", 7/1, has zero code).
3. A COST THAT SOUNDS RIGHT is priced in HAND-DAYS, because after the dollar dies a day of somebody's work is the
   only honest unit, and a hand-day costs about 3 batteries all in (a labourer's wage, his food, his water). Every
   building below is that many hand-days, plus TAPE for the materials, plus the days it takes, plus the rung or
   act that lets you build it at all (earned AND paid).
4. Thirty building kinds in eleven needs, each with its purpose for the company, the people and the money; its
   draft cost; when it unlocks; its look in each act (rule 159's palette: act one faded and rare, colour coming back
   as the city heals); and what changes on the map.
5. THE TEN FIRST, ranked by fun and purpose: the pump house over a well, the roof on a dead house, the lookout,
   the workshop, the garden plots, the first-aid room, the wind rig, the wall and gate, the swap stall, the
   bunkhouse.

---

## 1. WHAT THE CANON ALREADY SAYS (newest date wins)

| date | file | what it settles |
|---|---|---|
| 6/30 | laws/BOHEMIA_ADDENDUM_PERSISTENT_CONSEQUENCE_MAYOR_6_30_26.md | Three rungs: TERRITORY (build where a faction loves you), POPULAR MANDATE (about 49% of factions friendly: you build even where the local faction is cool), MAYOR (building easier, cheaper, faster, fewer limits). "Mayor" is a PSEUDO-mayor: the family the city defers to, never a restored office (Texas failed rebuilding the old thing; city-states are what grows instead). What you clear stays cleared in an act. The father's book shows his city. Act two: most of what gen one built stands (his lean, a lore reason wanted). |
| 7/1 | laws/BOHEMIA_ADDENDUM_CITYBUILDER_MODEL_7_1_26.md | Pocket City 2 as the base: ZONE, the SOCIETY builds; nothing works without road, power and water; buildings upgrade; three cities = three generations; act-gated buildings (act one survivable, act two hard, act three the top of the mountain); the train stations and shipping are the story's spine; every building can anchor a quest; everything can genuinely be rubble. |
| 7/26 | laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md | Buildings HOUSE PEOPLE or PRODUCE: resources, electricity, clout. No spreadsheet sim. THE CENTURY RULE: what the dynasty built compounds into act three's city; amended 9/7: some people count too, by the years passed. |
| 7/27 | laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md | The camp is carried, not a base; nothing in survival may assume a fixed home. (The home base came later as a SECOND thing, 9/27; the camp stays the road's.) |
| 7/31 | laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md | Upkeep, income and bankruptcy DEAD; buildings are EARNED (levels, quests, act tier), not afforded. The one hole it named: neglect has to bite somehow. |
| 9/4, 9/5 | laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md | Batteries are the money; nobody sells money; CERTAIN buildings make batteries (one a day to start); a currency anyone can farm is the oldest way money dies. |
| 9/27 | laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md | Home bases and roaming parties, not painted territory; the future goes both ways (raided falls). |
| 9/29 | rule 40(b), engine/bohemia_lotbuild.js | Building is back INSIDE a home base's settlement screen: tap a lot, build, it costs batteries and time, it shows on the map, on the fight board and in the derived future. |
| 9/29 | rule 47 | The six: batteries, food, meds, rounds, tape, water, used the Battle Brothers way. |
| 10/10 | rule 86 | The map is for looks; what you build lives in your base's settlement screen and nowhere else; no micro-features on the map. |
| 10/23 | rule 128 | Every asset is a kept scene re-rendered per act (the ruin, then reclaimed and techy, then the third era). |
| 10/24 | rule 159 | Act one is faded, dirty and rare; colour as an accent; colour returns over the acts. |
| 10/24 | rule 161 | This page: lore-friendly, costs that sound right, a purpose for every building, the look per act. |
| 10/24 | rule 164, "for later" | The city grows about 17% in act two and about 33% in act three, from the outskirts, depending on how you help it. |
| 10/10, 10/18 | rules 84, 117 | An act is about a year in play; every felt number starts easier than Battle Brothers'. |

## 2. THREE PLACES THE CANON FIGHTS ITSELF, AND HOW THIS PAGE READS THEM

**(a) "Earned, not afforded" (7/31) against "the costs have to sound right, a big cost" (10/24).** Newest wins, but
10/24 did not bring back upkeep or bankruptcy; it asked for COSTS. So: EARNED AND PAID. A building needs a
permission you went and got (the rung, the act, sometimes a quest or a person who knows how) AND a one-time price
(batteries, tape, hands, days). There is still no upkeep bill and no bankruptcy (7/31 stands on that). The hole
7/31 named, "neglect has to bite", is closed by a ruling he already made: THE FUTURE GOES BOTH WAYS (9/27, raided
falls). A base you never guard gets raided; a raided lot is bare ground again (lotbuild already does this). Neglect
bites with a fight at the gate, never with a bill.

**(b) "The map is for looks; you build in the settlement screen and nowhere else" (rule 86, 10/10) against
"there's a city grid for a reason, this is meant to implement changes to the city" (10/24).** Both hold. You ACT in
one place, the settlement screen of a base you hold. The MAP SHOWS the result, as looks only: the base's picture
re-rendered with what stands (rule 128's kept scene), lit windows at night where there is power, a cleared road
drawn as road, and between acts the city's outskirts grow on the grid by how much you built (section 6). Nobody
taps the map to build; nothing on the map is a button that was not one before.

**(c) Three currencies (7/26) against the six (rule 47, 9/29).** The six are what the COMPANY carries and spends;
the 7/26 three are what a BUILDING makes. They are the same stuff grouped two ways: RESOURCES are food, water and
tape (his 7/28 icon: an apple, a hammer, duct tape); ELECTRICITY is batteries; CLOUT is standing, which nobody can
buy. So a building is priced in the six and pays out in one of the three. Day 80 (the currency page) carries the
bar's half of this.

## 3. THE UNIT OF COST: THE HAND-DAY

After money dies, the honest price of a building is how many days of somebody's work it eats, plus what it is
made of. So every price on this page starts as HAND-DAYS and turns into batteries at one rate.

**What a hand-day costs, from what main already says:**
- His exchange, 10 crowns to 1 battery (reference/library/grok/GROK_31_TEN_TO_ONE_2026_10_01.md).
- A labourer's wage: Battle Brothers' daytaler 6 crowns a day, miner 6, mason 8, farmhand 10, all one battery a
  day at the floor (reference/library/grok/GROK_34_WAGE_BATTERIES_2026_10_01.md).
- He eats and drinks: one food and one water a man a day at the ration counter, 42 batteries a quiet plains week
  for three (records/BOHEMIA_ECONOMY_DAY_72_A_WEEK_AT_THE_COUNTER_IS_42_AND_EVERY_PURSE_ON_MAIN_IS_HARDER_THAN_BATTLE_BROTHERS_10_18_26.md).
- So ONE HAND-DAY = 1 battery wage + 1 food + 1 water = **about 3 batteries** bought at the counter (about 2 at the
  sack). Your own crew building costs no wage but still eats and drinks (2 a day) and is not out earning.

**What it is made of: TAPE.** Rule 47 makes tape the repair stack (Battle Brothers' tools); his 7/28 icon puts a
hammer and duct tape in the same mark. So tape is the materials line: salvaged lumber, sheet metal, wire, pipe,
fasteners, all one count. One tape point is worth about 2 batteries at the counter (Battle Brothers' tools are worth
200 crowns a stack, 20 batteries before the town's markup, GROK_31; the stack size is the library's, so the 2 is a
draft for TUNING). Salvage on the road and the scrap trade fill it.

**How long: DAYS ON THE MAP.** A building takes calendar days because only so many hands fit on a lot. Days pass
on the map clock, so a building rises while the company is out on a job.

**What the company earns, so the prices can be judged:** the board pays 30, 60 or 90 a job by the star today, and
the pay that holds a company of twelve is about 207 to 282 a won routine job
(records/BOHEMIA_ECONOMY_DAY_79_THE_GRIDS_MONEY_10_19_26.md). So a 40-battery building is a good week's work for a
small crew; a 1,000-battery work is a season for a big company; anything in the tens of thousands is a generation
and the city's labour, not one purse.
