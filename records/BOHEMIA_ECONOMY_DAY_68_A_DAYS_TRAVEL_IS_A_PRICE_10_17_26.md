# ECONOMY DAY 68: A DAY'S TRAVEL IS A PRICE -- WHAT A SACK OF SALT IS WORTH ONE, THREE AND SEVEN DAYS FROM WHERE IT WAS DUG
# The big swing (rule 110, Paolo 10/16: 'take big swings... I can't be checking in every three
# minutes'), on ECONOMY's MODE line: a page, prices across the region's distances, a day's travel
# is a price, under the hold (rule 88: a page without a sheet). Rule 109 (the map is Battle
# Brothers' size) is the reason the question exists now: for the first time a settlement is days
# away, so distance can cost something. Research only; nothing touches the demo, the alpha, or
# the VOTE tab. Nothing in this page is a felt number until TUNING's one table carries it.

## 0. THE QUESTION, IN ONE BREATH
Until 10/16 every settlement in this game was one tap away on a 96 by 96 valley. Rule 109 and
RUN's first region cut (records/BOHEMIA_THE_REGION_RUN_10_16_26.md) put twelve real places out
past the rim, 0.9 to 1.9 days from the city. So now there is a real question with a real answer:
WHAT DOES IT COST TO CARRY A THING FROM ONE SETTLEMENT TO ANOTHER, and does the thing sell for
more at the far end than the trip ate on the way? Battle Brothers has one answer, the real record
has an older one, and our own data files already carry every number the answer needs. This page
puts them side by side. The how of wiring it is RUN TWO's and WORLD's, after the hold.

## 1. HOW BATTLE BROTHERS DOES IT, FROM THE WIKI ITSELF (not a secondhand summary)
Sources: the wiki's Trade page, the Game Guide's Trade section, Market prices for various items,
Ambushed Trade Routes, Game Mechanics (all in reference/library/grok/wiki/PAGES_ALL.tar.gz;
bb_all/2018_Trade.txt, bb_all/0827_Game Guide.txt, bb_all/1244_Market prices for various
items.txt, bb_all/0054_Ambushed Trade Routes (Settlement Situation).txt, bb_all/0828_Game
Mechanics.txt).

**1a. DISTANCE IS NEVER A PRICE FIELD. NOWHERE.** The wiki's whole price formula has six inputs:
settlement type (small 95%, medium 102%, large 110%), attached locations (+3% each, 9 to 24%),
relations (plus or minus up to 15% selling, 30% buying), situations (multiplied after), whether
the good is made there, and the origin. Not one of them is "how far from here". This agrees with
this lane's own Day 63 finding that distance is encounter frequency wearing a skull's clothes
(GROK_139): the road costs you in fights, never in a number on the shelf.

**1b. BUT DISTANCE IS THE WHOLE TRADE LOOP ANYWAY, THROUGH TWO OTHER FIELDS.** The Game Guide:
"Trade potential is directly linked to a map layout (settlements and attached locations, terrain
and roads)." The price of a trade good depends on whether the settlement MAKES it: locally
produced, buying price unchanged and selling price 15% (the town will not buy back what it
digs); not locally produced, buying 150% and selling 110%. So the spread is between the mine
and the town that has no mine, and the only way to collect it is to cross the ground between
them. Distance is the price, paid in days, not in crowns.

**1c. THE WIKI'S OWN ARITHMETIC OF A TRIP, worked by a player on the Game Guide page (quoted
there as Drathnar):** "you also need to deduct daily wage and food expenses for the men for the
time you need to travel to a proper city hall to sell those goods." His example: Peat Bricks
bought at 111 crowns, sold at a City Hall for 131, a 20-crown margin per brick, which the page
then weighs against the inventory slot the brick occupies (a looted hatchet in that slot nets
37). That is the complete Battle Brothers answer: the margin per unit, times the units carried,
minus the company's wages and food for the days on the road, minus what else the slots could
have carried. Trade "is risk-free and as such quite useful in the early game."

**1d. THE ONE SITUATION THAT IS A DISTANCE PRICE IN DISGUISE: AMBUSHED TRADE ROUTES.** "The roads
leading here are unsafe of late, and many a caravan has been ambushed and plundered. With little
successful trade, the selection of goods is lower and the prices higher": +20% buying, +10%
selling, 25% fewer items. A town whose road is cut prices exactly like a town that is far away.
Our price table already carries this (records/target/bb/price_table.json situationMultipliers
.ambushedTradeRoutes, sell +10%). Day 52 of this lane said the same thing in one line: BB's best
price signal is the cut-off town.

**1e. AND THE MAP PUNISHES DISTANCE WITH TEETH, NOT CROWNS.** Game Mechanics: "Difficulty of
non-contract locations and roaming parties scales mostly with distance to civilization and
time." The far road is the expensive road because what walks it is worse.

**1f. THE TRADE GOODS TABLE, AT TEN TO ONE (rule: ten wiki crowns is one battery, his sixth
votes 10/2; the base worth is the wiki's own, the battery column is the conversion, floor one):**
| good | base worth, crowns | batteries | real-world twin in the valley (ours, draft, for WORLD) |
|---|---|---|---|
| peat bricks | 100 | 10 | charcoal from the burned subdivisions |
| cloth rolls | 140 | 14 | bolts from a dead casino's linen store |
| quality wood | 180 | 18 | the Mt Charleston lodge's timber |
| copper ingots | 220 | 22 | stripped wire, the real post-crash copper trade |
| amber shards | 260 | 26 | turquoise and petrified wood from the washes |
| furs | 300 | 30 | hides (Day 56 already priced them by count) |
| spices | 320 | 32 | coffee and chile from a warehouse that held |
| salt | 340 | 34 | salt (the real Mojave has salt flats and the dam's works) |
| incense | 380 | 38 | tobacco |
| dyes | 400 | 40 | pharmacy stock |
| silk | 460 | 46 | the runway's own cloth (rule: everyone dresses like a runway) |
| uncut gems | 520 | 52 | lithium cells, the one thing nobody can make |
The twins column is this round's sketch for WORLD [bb places] and the stall's shelf; the numbers
column is the wiki's. Nothing in the right-hand column is a ruling.

## 2. THE REAL RECORD: THE CARRIER EATS THE CARGO
**2a. ADAM SMITH, 1776, Wealth of Nations Book I chapter III.** His worked comparison: a broad-
wheeled wagon with two men and eight horses carries about four tons London to Edinburgh and back
in six weeks; a ship with six or eight men carries two hundred tons in the same time. Land
carriage was so dear that only goods worth a lot per pound could travel far by road at all; he
says plainly that the price of coal in London is far above its pit-head price for the cost of
the carriage alone. The rule it leaves: a heavy cheap thing stops close to where it is made, a
light dear thing travels.

**2b. VON THUNEN, 1826, The Isolated State.** The first model of exactly this page's question: a
single market town, flat ground, one freight cost per mile; what a farmer gets is the market
price MINUS the carriage to it, so the far producer is paid less for the same thing, and the
perishable and heavy goods are raised nearest the town in rings. It is a distance price written
as a subtraction, not a markup, which is the shape Battle Brothers happens to use too (the
producing village sells cheap; the town pays full).

**2c. DONALD ENGELS, 1978, Alexander the Great and the Logistics of the Macedonian Army.** The
number that governs every pre-engine trade route: a man carrying about 80 pounds eats about 3
pounds of grain a day; a pack animal carrying about 250 pounds eats about 20 pounds of grain and
fodder a day. So a mule carrying only its own feed has nothing left in about twelve days, and a
man carrying only his own food in about twenty-five, which is why a foot column could not go more
than a few days from a supply point without foraging or a market on the way. THE CARRIER EATS
THE CARGO. The farther the market, the bigger the share of the sack that was eaten getting there.

**2d. THE PRE-RAILWAY DAY, measured.** A loaded foot column makes about 20 to 30 km a day on a
road (the Roman standard march was about 20 Roman miles, roughly 30 km); a loaded wagon or mule
train about the same; off the road, half that. This lane's own Day 46 ruled our day at 17.1 km on
the roads and 8.6 off them, under that range on purpose (a collapsed city's foot-traffic radius,
Caracas and New Orleans, not an army's).

**2e. THE MODERN COLLAPSE CASE: THE PRICE GRADIENT COMES BACK THE DAY THE TRUCKS STOP.** The
thing a working economy hides is that a trucking network makes the whole country one price;
Zimbabwe 2008 and Venezuela 2017 to 2019 both show the gradient return within weeks of fuel
failing: border towns priced in the neighbour's currency, interior towns paying more for the
same tin of fish than the port, and the person with a working vehicle and fuel becoming a trader
by that fact alone. Day 47 found the same for water: nobody owns the pump, they own the
distance. That is the honest analog horror of this page: the price does not rise because the
goods changed, it rises because the road stopped being free.

## 3. OURS, MEASURED ON MAIN: EVERY NUMBER FOR A DAY'S PRICE ALREADY EXISTS, AND NOTHING ADDS THEM UP
**3a. What a man costs a day on the road (all from our own data files, none typed here):**
| line | value | source |
|---|---|---|
| wage, the cheap pasts | 1 battery a day | GROK_34, price_table.json wageAndHire (backgrounds.json carries the 77) |
| food, plains | 2 units a day, grains at 5 batteries a 25-stack = 0.4 battery | price_table.json dailyRates; stash_rates.json foodByTerrain plains 1.0 |
| food, open desert | 1.5x = 0.6 battery | stash_rates.json foodByTerrain desert 1.5 |
| food, the ranges | 2.0x = 0.8 battery | stash_rates.json foodByTerrain mountains 2.0 |
| water | its own stack, rule 47; no per-day battery price shipped | Day 55, the six-piles clash still his to thumb |
So a man on a plains road costs about 1.4 batteries a day, in the desert about 1.6, in the
mountains about 1.8. A three-man crew (the demo's) is 4 to 6 a day; a company of twelve is 17 to
22 a day. engine/bohemia_stash.js computes the food half per terrain (foodNeededPerDay) and
engine/bohemia_pricetable.js the wage half; they have never been called on the same trip.

**3b. What the trip takes, from RUN's own region numbers (10/16):** rim to rim 1.9 days on a road,
3.7 on open ground; the twelve places 0.9 to 1.9 days from the city. The region grid is 496
blocks of 96 m, about 48 km on a side.

**3c. THE FINDING THAT PROVES US WRONG: THE REGION IS ABOUT FOUR TIMES TOO SMALL FOR ITS OWN
NAMES.** The real places RUN placed by bearing are not where their bearings put them in
kilometres. Road distances from downtown Las Vegas, real: Henderson about 26 km, Boulder City
about 42, the Hoover Dam about 56, Jean about 51, Primm about 69, Indian Springs about 72, the
Mt Charleston lodge about 64, Searchlight about 92, Moapa about 89, Pahrump about 100, Mesquite
about 130. Pahrump to Mesquite is about 230 km as the road runs. The 48 km region puts Mesquite
about 29 km from the city. At our own ruled day (17.1 km on a road) the real Mesquite is 7.6
days away and the real Pahrump 5.8; the region cut makes them 1.9 at most. Rule 109 asks for
Battle Brothers' crossing days, which RUN has not found yet (bbDaysAcross is null in
slices/bohemia_region.js). THE POINT FOR THIS PAGE: whichever scale wins, the day's price in 3a
does not change; only the number of days does. So the table below is written per DAY, and RUN
and WORLD multiply by whatever a crossing turns out to be. Routed to RUN [the map at Battle
Brothers' size] and WORLD [the region] as one line each; not mine to pick.

**3d. Nothing in the engine prices a trip, and nothing in the engine is a trade good.**
engine/bohemia_economy.js GOODS carries water, food, salvage, meds, fuel, power and the five
surgery-kit items; not one of the wiki's twelve trade goods, and no 'made here' flag on any
settlement. bohemia_towns.minesOf (WORLD [bb places], 9/25) already attributes solar, dam and
battery runs to a holder, so the 'produced here' half of 1b exists for three things and the shop
has never asked it. No function anywhere takes (days, headcount, terrain) and returns a battery
count. This page is the arithmetic that function would do; the function is not under the hold's
exception and is not built here.

## 4. THE PAGE'S TABLE: WHAT A SACK OF SALT IS WORTH ONE, THREE AND SEVEN DAYS OUT
Worked on the wiki's own rule (1b) at ten to one, with the carrier's cost from 3a. Salt is the
example because it is the real valley's own trade good; the shape holds for all twelve.
- BUY at the place that digs it: a village (95%) with two attached works (+6%), relation neutral,
  locally produced (buying unchanged): 340 x 1.01 = 343 crowns, 34 batteries a sack.
- SELL at a place that does not dig it: a city (110%) with seven attached works (+21%), relation
  neutral, not locally produced (selling 110%): 340 x 1.31 x 1.10 = 490 crowns, 49 batteries.
- THE SPREAD: 15 batteries a sack, before the road.
| days out, one way | a man's road cost, plains to mountains | 3-man crew, round trip | 12-man company, round trip | sacks of salt that pay for the trip (3 men) | sacks (12 men) |
|---|---|---|---|---|---|
| 1 (Henderson, Boulder City at the region's scale) | 1.4 to 1.8 | 8 to 11 | 34 to 43 | 1 | 3 |
| 2 (the dam, Jean, Primm) | 2.8 to 3.6 | 17 to 22 | 67 to 86 | 2 | 5 to 6 |
| 3 (Pahrump, Searchlight) | 4.2 to 5.4 | 25 to 32 | 101 to 130 | 2 to 3 | 7 to 9 |
| 5 (Mesquite at a truer scale) | 7 to 9 | 42 to 54 | 168 to 216 | 3 to 4 | 12 to 15 |
| 7 (the real Mesquite at our ruled day) | 9.8 to 12.6 | 59 to 76 | 235 to 302 | 4 to 6 | 16 to 21 |
Read it as the wiki's player reads it: a three-man crew that carries five sacks of salt (170
batteries laid out, which a day-one crew does not have) clears the road to anywhere in the
region and comes home with 75 batteries of spread minus 8 to 32 of road, so 40 to 65 in hand.
A twelve-man company needs three to nine sacks just to break even, and the slots it spends on
salt are slots it is not spending on loot. THAT IS WHY BATTLE BROTHERS' GUIDE CALLS TRADE "QUITE
USEFUL IN THE EARLY GAME" AND NOT AFTER: the company grows, the road cost grows with it, the
spread does not. Our swag inherits that honestly: a stranger with three friends and a borrowed
battery is exactly the crew trade is for, which lands on this lane's Day 49 (he is one short every
day) from the other side.

## 5. THE THREE PLACES THE DAY'S PRICE SHOWS UP, NOTHING INVENTED
1. ON THE SHELF, as the wiki does it: a settlement that makes a thing sells it cheap and will not
   buy it back; a settlement that does not pays full. Needs one flag per settlement per good (WORLD
   [the region] and [bb places]; minesOf already carries three). No distance field, ever.
2. ON THE ROAD, as our own clock already does it: the stash eats per man per day per terrain and
   the wage comes due at nightfall (Day 53: the loan and the wage are on the day clock). Nothing to
   add; the trip IS the price once the places are days apart.
3. IN THE SITUATION, as the wiki does it: a cut road is a far road (ambushed trade routes, already in
   price_table.json). FACTIONS [a town before and after] decides when a road is cut.
The one new mechanism named (not built): a function that takes (days, headcount, terrain) and
returns what the trip eats, so the map can say "two days out, about nine batteries" before he taps.
Its numbers are all in 3a; its owner is RUN TWO (the settlement screen) with WORLD; its felt
numbers go in TUNING's one table first (rule 38g).

## 6. ROUTED
- TUNING [the 32 situations]: the road-cost-per-man-per-day line (1.4 plains, 1.6 desert, 1.8
  mountains, from the data files) as a row of the one table; the trade-good spread rule (1b) as
  three multipliers (made here: buy x1.0 sell x0.15; not made here: buy x1.5 sell x1.1).
- RUN [the map at Battle Brothers' size] and WORLD [the region]: 3c, the region is about four times
  smaller than the real kilometres of its own place names; the day's price holds at any scale.
- WORLD [bb places]: the 'made here' flag per settlement per good is the whole trade mechanic; the
  twins column in 1f is a sketch for the shelf.
- RUN TWO [settlement screen]: the trip-cost readout, after the hold, from 3a's numbers.
- FACTIONS [a town before and after]: a cut road is a far road, the situation multiplier exists.
- DYNASTY: the carrier-eats-the-cargo rule (2c) is why Gen 1 trades near and Gen 3 can trade far: a
  working vehicle in the reclaimed future collapses the day's price, which is the real shape of
  every recovery in 2e.

## 7. WHAT THIS ROUND DID NOT DO
No code, no sheet, no VOTE item (rule 88). No felt number into the game (rule 38g). No new price
digit: every battery figure above is the wiki's crown figure at ten to one or a multiplication
of two shipped data-file numbers. The 'twins' column is draft. Battle Brothers' crossing days are
still owed by RUN, not guessed here. Eight bank lines, draft:true, in
banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md.

[bb school line] Battle Brothers never writes distance on a price tag: the margin is between the
place that makes a thing and the place that does not, and the days between them are paid in
wages and food, which the Game Guide's own player tallies before calling a trade worth it.
[analog horror line] The salt costs the same at the flats as it did before the dollar died; what
changed is that nobody will drive it to you, and the number on the far stall is the road's price
wearing the salt's name.
