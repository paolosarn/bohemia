# ECONOMY DAY 77: THE BOWL COSTS TWO AND A HALF TIMES THE SACK, WHERE THE RECORD SAYS ABOUT A TENTH MORE, AND TUNING READ IT AS EASIER
# Row [the poverty premium] (WHAT-BUYING-BY-THE-RATION-COSTS-AGAINST-THE-STACK; the top OPEN row, rule 74, written by
# this lane from Day 72's finding). The new age (rules 112 to 117): the coordinator opened this chat on Opus 5.5 Extra;
# the round runs to the end with no check-in and no question. Under rule 88's hold: a page, no sheet, no VOTE item,
# nothing into the demo, the alpha or a data file. The row's own end state: 'which piles have a stack and which do
# not, the price step from ration to stack per pile, how Battle Brothers sells only stacks and why, and the real
# record of buying small, with the ladder of units a counter could sell; nothing picked. The one numbers table
# (TUNING) holds every number; RUN TWO owns the shelf; this page cites both and sets no digit.'
# Rule 117(e) (his 10/18): numbers across a grid, never one average. Every figure below is read across crew sizes
# 1, 3, 6, 12 and 14 (and every origin on main), plains, desert and mountains, a broke purse and a full one, a
# village, a city and the fourteen food situations.
# Words: the BOWL is the stall's 'ration of food' (two units, one man one day on plains, ONE battery); the SACK is the
# wiki's stack of 25 units (price_table.json foodStackBatteries). His own 9/4 picture of the money was the sack: 'for
# one aa battery a bag of rice' (laws/BOHEMIA_ADDENDUM_BATTERIES_ARE_THE_MONEY_AND_A_TILE_IS_A_HOUSE_9_4_26.md); his
# 10/1 ten-to-one (GROK_31, GROK_33, newest wins) put the bag of grain at five.

## 0. THE ANSWER IN SIX LINES
1. THE PREMIUM LIVES IN ONE PILE OF SIX: FOOD. Meds, tape and rounds sell at the counter at exactly the wiki bundle's
   own rate (the stall's 'six rounds' is even 17 in 100 UNDER it); water has no sack anywhere on main; batteries are
   the money. Only the bowl is a unit whose honest price is under one battery, so only the bowl gets lifted.
2. THE BOWL COSTS 2.4 TO 2.5 TIMES THE GRAIN SACK FOR EVERY CREW OF TWO OR MORE, ON EVERY GROUND. A crew of three
   on plains: 3.00 a day by the bowl, 1.25 by the sack (whole sacks only): 12 batteries a week. A crew of fourteen
   in the mountains: 117 a week.
3. THE LONE MAN PAYS THE LEAST OF IT (1.4 times on plains), because the sack rots on him: he eats 14 of 25 grains
   before the seventh day. The record says the same (section 3c).
4. THE REAL RECORD SAYS THE SIZE PREMIUM ON FOOD IS ABOUT 6 TO 9 IN 100, NOT 150. The big premiums in the record are
   water from a vendor (5 to 10 times the pipe) and credit and tariffs, never the loaf.
5. TUNING'S TABLE READS THE BOWL AS EASIER THAN BATTLE BROTHERS (ours 1 against its 5) BY COMPARING TWO UNITS WITH
   TWENTY-FIVE. Per man-day the bowl is 1 against Battle Brothers' 0.4: two and a half times HARDER.
6. THE STACK IS WITHIN EVERY NEW CREW'S REACH FROM THE FIRST SECOND (every door purse on main is 45 or more; the sack
   is 5). It bites only a crew that is broke: under five batteries a crew pays two and a half times for food until
   a job lands, and on the books on main a working crew never climbs back to five (Day 49, Day 72). That is the
   poverty trap, and it is real.

## 1. HOW BATTLE BROTHERS DOES IT: IT SELLS ONLY THE SACK, AND SIZE IS NEVER THE LEVER
Sources: bb_all/1608_Provisions.txt, 2018_Trade.txt, 1244_Market prices for various items.txt, 0827_Game Guide.txt
(Economy, Expenses), 0798_Food Goes Bad.txt, the fourteen '(Settlement Situation)' pages that print a food price
(reference/library/grok/wiki/PAGES_ALL.tar.gz; source: wiki dump, unverified).
- **ONE UNIT ON THE SHELF.** 'Base worth is indicated for a provision of 25 units at their highest spoil time value'
  (Provisions). Sixteen foods are for sale, from Ground Grains (50 crowns, spoils in 7) to Masterfully Cured
  Rations (150, 16); every one is a 25-unit item. Supplies are bundles too (Trade): ammunition 100 crowns for 50,
  tools 200 for 20, medicine 200 for 20. There is no loaf, no dose, no bullet.
- **WHY IT CAN.** A Battle Brothers player never stands at the counter with less than the sack: every origin opens
  with 450 to 3,200 crowns and A New Company with fifty provisions in the cart (Day 69, 1a; Day 76). The cheapest
  thing a marketplace sells is a 25-crown bandage (Day 69, 1c). Its money never meets a man with one coin, so it
  never had to price the bowl.
- **ITS ONLY FOOD LEVERS ARE THE KIND AND THE HEADCOUNT.** The Game Guide: provisions 'are the only vital resource...
  The amount that's needed can only be reduced by dismissing mercenaries or by buying cheaper types of Provisions
  like Ground Grain.' Size is not on the list, because size is not a choice.
- **THE PLACE AND THE NEWS MOVE THE SACK.** The buying modifier (village 0.95 to 1.04, town 1.08 to 1.17, city 1.22
  to 1.34 at neutral relations, Expert) multiplies the worth; a settlement whose attached location makes the food
  sells it 'unusually low' (Wheat Fields, Ground Grains: this lane's [made here]); and fourteen situations print a
  food price (section 4c).
- **IT PUNISHES THE BIG PILE.** Food Goes Bad: with more than 70 food, a campaign at least 11 days old, on plains,
  swamp, farmland, steppe or hills and no Cook, the company loses one random stack (cooldown 21 days). Besides the
  spoil clock, the sack carries a second cost for holding it. Ours carries only the clock (price_table.json
  foodSpoilDays; the stash eats the soonest-to-spoil first).

## 2. OURS, MEASURED ON MAIN: WHICH PILES HAVE A SACK
Read from slices/BOHEMIA_SETTLEMENT_SCREEN.html (STALL, priceOf, traitMult), records/target/bb/price_table.json,
stash_rates.json, engine/bohemia_stash.js, engine/bohemia_pricetable.js.

| pile | what the counter sells on main | its price | the wiki's bundle at ten to one | the counter's unit, bought by the bundle | the step from counter unit to bundle |
|---|---|---|---|---|---|
| food | the bowl: 'A ration of food' (2 units) | 1 | a sack of 25: grains 5, bread 6, dried fish 7, smoked ham 9, wine 11, master rations 15 (150 / 10) | a man-day: grains 0.40, bread 0.48, ham 0.72, wine 0.88, master rations 1.20 | **x2.50 grains, x2.08 bread, x1.39 ham, x1.14 wine, x0.83 master rations** (the bowl is CHEAPER than the best food) |
| water | 'Water, four litres' | 1 | none (no wiki pile; rule 47's own) | none to compare | **no sack exists on main** |
| meds | 'A dose of meds' | 1 | 20 points for 200 crowns = 20 | 10 crowns = 1.00 | x1.00, no premium |
| tape | not on the stall (Day 69's ladder: a point at 1) | (1) | 20 points for 200 crowns = 20 | 1.00 | x1.00, no premium |
| rounds | 'Six rounds' | 1 | 50 points for 100 crowns = 10 | five rounds = 1.00 | six at one is x0.83 (under the bundle); Day 69's five is x1.00 |
| batteries | the money | | | | |

THE SACK IS IN THE DATA AND SOLD NOWHERE: price_table.json carries foodStackBatteries (grains 5 to wine 11) and
nothing in the game reads it; the only readers on main are TUNING's page and its seed tool. The stall's four lines
are RUN TWO's placeholder 'until ECONOMY rules the shelf'.

## 3. THE GRID (RULE 117(e)): THE BOWL AGAINST THE BEST SACK, EVERY CREW, EVERY GROUND
Food only, a purse big enough for either, eight weeks, whole sacks only, the stash eating the soonest-to-spoil
first, food 2 a man a day times the ground (stash_rates.json: plains 1.0, desert 1.5, mountains 2.0). Batteries a
day; 'times' is the bowl over the sack; the last column is what the sack saves in a week. The best sack is grains
in every cell (bread, ham and master rations were worked and lose).

| crew | ground | the bowl | the best sack | times | saved a week |
|---|---|---|---|---|---|
| 1 | plains | 1.00 | 0.71 | 1.40 | 2 |
| 1 | desert | 1.50 | 0.71 | 2.10 | 5.5 |
| 1 | mountains | 2.00 | 0.80 | 2.49 | 8 |
| 3 | plains | 3.00 | 1.25 | 2.40 | 12 |
| 3 | desert | 4.50 | 1.88 | 2.40 | 18 |
| 3 | mountains | 6.00 | 2.41 | 2.49 | 25 |
| 6 | plains | 6.00 | 2.41 | 2.49 | 25 |
| 6 | desert | 9.00 | 3.66 | 2.46 | 37 |
| 6 | mountains | 12.00 | 4.82 | 2.49 | 50 |
| 12 | plains | 12.00 | 4.82 | 2.49 | 50 |
| 12 | desert | 18.00 | 7.23 | 2.49 | 75 |
| 12 | mountains | 24.00 | 9.64 | 2.49 | 100 |
| 14 | plains | 14.00 | 5.62 | 2.49 | 59 |
| 14 | desert | 21.00 | 8.48 | 2.48 | 88 |
| 14 | mountains | 28.00 | 11.25 | 2.49 | 117 |

**3a. THE WORST CELLS FIRST.** A crew of fourteen in the mountains pays 117 batteries a week more for buying by the
bowl; twelve in the desert, 75. The premium in batteries grows with the crew, and the crew grows over a hundred
hours: the bowl is a late-game cost as much as a first-week one.
**3b. THE RATIO DOES NOT CARE ABOUT THE GROUND.** 2.4 to 2.5 everywhere a crew can finish a sack before it turns.
**3c. THE LONE MAN IS THE ONE EXCEPTION, AND THE RECORD AGREES.** On plains he eats 4 units in two days: 14 of a
sack's 25 grains before day seven, so his best sack costs 0.71 a day, not 0.40, and his bowl is only 1.4 times
it. In the desert he eats 21 of 25 (2.1 times); in the mountains he finishes it (2.5). Koenigsberg, Kohli and
Montoya (Columbia, 2007, 'Package Sizes for the Bottom of the Pyramid'): 'a higher unit price therefore need not be
a poverty penalty imposed on poor buyers, but a consequence of buyers being able to better match their purchases to
their desired consumption.' The small unit is partly the price of not throwing food away.

**3d. THE DOOR, ORIGIN BY ORIGIN (DAYS, Day 74's rule: nightfalls the crew gets through with nothing coming in;
the canon wage books, his 9/29; water four litres a man a day at ONE; THIN purse; plains / desert).**
| origin | men | purse | the bowl only (main today) | the sack beside the bowl | Battle Brothers, the same men (its wage, the sack only, no water, no cart) |
|---|---|---|---|---|---|
| THE LONE WOLF | 1 | 100 | 20 / 16 | 21 / 21 | 22 / 22 |
| THE WATER TRUCK | 2 | 140 | 23 / 20 | 28 / 26 | 56 / 50 |
| A NEW CREW | 3 | 240 | 26 / 21 | 33 / 30 | 44 / 39 (45 / 41 with its cart; Day 74's 46 / 41 bought grain by the unit) |
| THE RAIDERS | 4 | 100 | 6 / 5 | 7 / 7 | 12 / 10 |
| THE DEBT COLLECTORS | 6 | 200 | 14 / 11 | 19 / 17 | 45 / 35 |
| THE BLOCK WATCH | 12 | 100 | 2 / 2 | 3 / 3 | 6 / 5 |
(FULL purses: the new crew 32 / 26 by the bowl, 40 / 36 with the sack; Battle Brothers 53 / 47.) The sack adds 1
day (the lone man on plains, where it rots) to 7 (the new crew); 5 to 9 in the desert. For every origin of two men
or more the gap to Battle Brothers is bigger than the sack: the rest is WATER (one battery a man a day that Battle
Brothers never pays; section 6) and the floor of one on a cheap man's wage (a caravan hand's 8 crowns is our 1).
The calculator reproduces Day 76's 26, 32, 33 and 40 exactly and Battle Brothers' 46 / 37 / 55 within a day (whole
sacks bought at once, against Day 74's unit buying).

## 4. THE PLACE AND THE NEWS: THE SACK MOVES, THE BOWL DOES NOT
**4a. THE PLACE.** Grains at 50 crowns times the buying modifier, then divided by ten and rounded down (GROK_31):
a village at 0.95 sells the sack at 4 (the bowl x3.1), at 1.04 at 5 (x2.5); a town 5 (x2.5); a city at 1.22 to
1.34 at 6 (x2.08). The settlement screen's priceOf rounds to nearest (Day 57's open line): the village at 0.95
reads 5, the city at 1.34 reads 7. The bowl is 1 at every counter.
**4b. THE NEWS.** The fourteen situation pages that print a food price, worked on grains at a village (1.0):
| situation (food price on its card) | the sack | a man-day by the sack | the bowl over the sack |
|---|---|---|---|
| Good Harvest, Full Nets, Hunting Season (-50) | 2 | 0.16 | **6.25** |
| Bread and Games, Local Holiday (-10) | 4 | 0.32 | 3.13 |
| none | 5 | 0.40 | 2.50 |
| Public Executions, Witch Burnings (+15) | 5 | 0.40 | 2.50 |
| Refugees (+25) | 6 | 0.48 | 2.08 |
| Drought, Lost at Sea, Preparing Feast, Sickness (+100) | 10 | 0.80 | 1.25 |
| Besieged (+100 food, +25 buying) | 12 | 0.96 | 1.04 |
| Short on Food (+200) | 15 | 1.20 | **0.83: the bowl is cheaper than the sack** |
**4c. THE BOWL READS NONE OF IT.** The stall prices each good at Math.max(1, round(traitMult().buy x ...)); traitMult
carries buy, sell, stock, men and meds and NO food. So in a Short on Food town the bowl at one is the cheapest food
on the map, and in a Good Harvest town it is six times the sack. Half of that is the real record: a price pinned to
the smallest coin is sticky (section 5b, the denomination effect). The other half is not: in a famine the small unit
gets dearer too.

## 5. THE REAL RECORD OF BUYING SMALL
Search extracts of named sources (the hosts do not resolve from this container; nothing was read in full); each line
is flagged for a check before a row cites its number.
**5a. THE POVERTY PREMIUM IS REAL, AND IT IS MOSTLY NOT THE PACK SIZE.**
- Bristol, 'Paying to be poor' (Davies, Finney and Hartfree, Personal Finance Research Centre, 2016): about 490
  pounds a year for a low-income UK household, weighted by who actually pays each part. The parts: not switching to
  the best fuel tariff 233, where you live 84, higher-cost credit 55, prepayment meters 38, not using the cheapest
  billing method 33, insuring specific items 27, paper bills 12, getting cash 9. There is no line for buying food in
  small amounts. The meter is 8 in 100 of it. (A 2019 follow-up for Fair By Design: 478 pounds, not comparable.)
- UK prepayment meters: about 50 to 80 pounds a year more than direct debit before Ofgem 'levelised' the standing
  charges in April 2024 (Fair By Design; Ofgem's own analysis put it near 80); after that, sources disagree on the
  sign.
- Caplovitz, 'The Poor Pay More' (Columbia's Bureau of Applied Social Research, 1963): the name of the thing. Its
  New York findings were on credit and instalment buying (recall, not checked here).
**5b. THE SMALL UNIT, MEASURED, COSTS A LITTLE MORE.**
- Orhun and Palazzolo, 'Frugality Is Hard to Afford' (Journal of Marketing Research 56(1), 2019, Paul E. Green
  Award): low-income US households pay about 6 in 100 more a sheet of toilet paper because they buy smaller packs and
  catch fewer sales; the cause is cash on hand (liquidity), shown with shopping data. (39 against 28 in 100 of
  purchases on sale, from press coverage.)
- Dillon, De Weerdt and O'Donoghue, 'Paying More for Less: Why Don't Households in Tanzania Take Advantage of Bulk
  Discounts?' (World Bank working paper 2020; about 1,500 households, 48,501 purchases from two-week diaries): the
  average household could spend 8.7 in 100 less by buying in bulk with the same quantities. Cash was a WEAK barrier.
  The likeliest reasons: worry about eating a stock too fast, and avoiding 'social taxation' (kin and neighbours
  asking for a share of a visible pile).
- Sauer, Reardon and Mason, 'The poor do not pay more' (Agricultural Economics 54(5), 2023, Tanzania): poor
  households do not buy meaningfully smaller quantities per transaction; bulk discounts exist only above quantities
  few households reach.
- Loose cigarettes: 'Loose cigarette prices are on average higher than those of cigarettes bought in packs, and they
  respond differently to tax increases, at least partially due to a denomination effect' (Tobacco Control, 2023,
  'An overlooked market'; five countries in Africa and Asia, retailers in sixteen). Single sticks are about a third of
  cigarettes sold in Thailand and up to 80 in 100 in Zambia and Kenya (a secondary summary). In New York the loosie
  costs more a stick than a bootleg pack and less than a taxed one (CUNY's South Bronx focus groups, 2013).
- The sachet: Hindustan Lever put Sunsilk and Clinic in single-wash sachets by the late 1980s; packs of 10 ml or less
  were 98 in 100 of standard shampoo sold in India in 2013 (Euromonitor via Cosmetics Design), falling as incomes
  rose. Shopkeepers opened 1 kg bags of detergent and sold 100 grams for one rupee into the buyer's own tin (Scroll).
  THE COIN HELD AND THE QUANTITY MOVED.
**5c. WATER IS WHERE THE RECORD'S PREMIUM IS HUGE, AND IT IS A PIPE, NOT A PACK.**
- UNDP Human Development Report 2006, 'Beyond Scarcity': people in a Nairobi slum pay five to ten times more a litre
  than the city's well-off (its lead author, Kevin Watkins); 'Where does a litre of water cost more than in central
  London? In a developing country slum.' An APHRC study the same year: 3 to 30 US cents for a 20-litre jerrycan in
  Nairobi's slums against 1.70 dollars for 10,000 litres on the city's meter (about 9 to 90 times a litre, this
  page's arithmetic).
THE SHAPE, READ ACROSS: for food the size premium is about a tenth (6 to 9 in 100), sometimes nothing, and part of
it is the price of not wasting; it is huge only where the big unit is infrastructure (the pipe) or credit. Every
person in the record who skipped the sack had a reason the sack does not show on a shelf: no cash (the toilet
paper), the stock eaten too fast or asked for by kin (Tanzania), the food that turns (the sachet, our own lone man).

## 6. WHAT PROVES US WRONG
1. **THIS LANE'S DAY 72 CALLED THE BOWL 'THE REAL RECORD EXACTLY'. IT IS 16 TO 25 TIMES THE RECORD.** Day 72 cited
   Bristol's 490 pounds as 'much of it from buying in small units and on the meter'. The 490 holds no pack-size line
   and the meter is 38 of it. The food record's size premium is 6 to 9 in 100; ours is 140 to 150 for every crew of
   two or more. The bowl at one is a denomination effect (5b) pushed to the edge: the floor of one lifts a 0.4
   battery thing to 1.
2. **TUNING'S EASIER ROW IS A UNITS MISTAKE, AND IT CITES A DEAD RULING.** banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json
   'stall.goods_price': ours 1, Battle Brothers 'food 5 to 11 batteries a stack', 'EASIER THAN BB' (compared 1 against
   5, lower is easier). The 1 buys two units and the 5 buys twenty-five. Per man-day the bowl is 1 against 0.40:
   2.5 times HARDER. Rule 117's last sentence makes a number harder than Battle Brothers' a NO before he sees it.
   The row's ruling is 'EVERYTHING COSTS ONE, Paolo 8/15'; GROK_33 (his 10/1): 'The master file said everything costs
   one until he plays it. His newer line wins. A wiki price under 10 crowns still costs 1 battery.' The one on the
   bowl is the FLOOR, not the 8/15 placeholder.
3. **THIS LANE'S DAY 71 SAID THE TABLE'S THIRTEEN FOOD PRICES ARE 'NOT ON THE PAGE THEY CITE'. THEY ARE.** Fourteen
   situation pages print a food price beside the food-available line Day 71 read (section 4b): Short on Food +200,
   Drought, Lost at Sea, Preparing Feast +100, Refugees +25, Good Harvest, Full Nets, Hunting Season -50, Bread and
   Games, Local Holiday -10, Public Executions, Witch Burnings +15, and the two Day 71 called foodless: Besieged +100
   and Sickness +100 (beside its medicine +200). TUNING's JSON was right on all of them. Day 71's 3a is withdrawn for
   the food rows; its Collectors line and the missing items and recruits stand.
4. **THE PREMIUM FALLS ON THE BIG CREW, NOT THE SMALL ONE.** The lone man pays the least of it (3c). Over a hundred
   hours the crew grows to twelve or fourteen, and the bowl costs it 50 to 117 a week.
5. **THE BOWL IGNORES THE TOWN'S FOOD NEWS** (4c): in a famine it is the cheapest food on the map.
6. **THE ROSTER AND THE PRICE TABLE PAY DIFFERENT WAGES.** engine/bohemia_roster.js: Math.max(1, Math.round((daily_wage
   || 10) / 10)): the indebted's ruled 0 becomes 1 (the '|| 10'), the hedge knight's 35 becomes 4. engine/
   bohemia_pricetable.js floors (GROK_31: round down) and keeps 0 as 'a real ruled zero, never floored up'. The Lone
   Wolf reads 3 or 4 a day; the Debt Collectors 2 or 6; their DAYS 20 or 16 and 14 or 11. One wage, two engines.

## 7. THE LADDER OF UNITS A COUNTER COULD SELL (NOTHING PICKED)
Each worked for A NEW CREW on the canon wage books (DAYS, THIN 240 and FULL 290, plains / desert), and for a lone
man with 3 batteries in his pocket and nothing else (food only: how many days he eats). The step is the visible win
of rule 117(c): how much a day's food falls the moment the crew can afford the bigger unit.
| ladder | what the counter sells | THIN | FULL | broke, 3 batteries | the size premium when flush | the step (117(c)) | the real twin |
|---|---|---|---|---|---|---|---|
| A. THE BOWL ONLY (main today) | 2 units for 1 | 26 / 21 | 32 / 26 | 3 days | +150 in 100 | none | the loose cigarette at the coin |
| B. THE SACK ONLY (Battle Brothers) | 25 for 5 | 33 / 30 | 40 / 36 | 0 days (nothing under 5) | 0 | none | the warehouse club |
| C. THE SACK BESIDE THE BOWL (Day 72 and Day 76's route) | both | 33 / 30 | 40 / 36 | 3 days | 0 | a day's food -60 in 100 | the corner shop and the wholesaler on one street |
| D. THE SCOOP (the coin holds, the quantity moves) | a battery's worth at the sack's price on main (grains 5 units, bread 4, ham 2.8) | 33 / 30 | 40 / 37 | 7 days | 0 | none | the rupee of detergent poured into your own tin |
| E. THE SCOOP WITH THE KEEPER'S CUT | 4 grain units for 1 (+25 in 100) | 32 / 29 | 38 / 35 | 6 days | +25 | none | the loose stick over the pack |
| F. THE CUT SCOOP BESIDE THE SACK | E and the sack | 33 / 30 | 40 / 37 | 6 days | 0 | a day's food -20 in 100 | Tanzania's 8.7 in 100, rounded up to a whole unit |

**THE 117 CHECK AT BOTH ENDS OF THE PURSE.** Broke (1 to 4 batteries): Battle Brothers sells nothing, so every
ladder with a small unit (A, C, D, E, F) is EASIER; B is Battle Brothers' own hard end. Flush: A is 2.5 times
harder (a NO before he sees it, rule 117), E is 25 in 100 harder (a NO), B, C, D and F are level with Battle
Brothers. The ladders rule 117 allows: C, D and F.
**THE TRADE THE THREE MAKE, SAID PLAINLY.** Realism-first leads with D or F: the record's food premium is a tenth or
nothing, and D is what a till does when the small coin is the floor (the quantity moves, 5b). Rule 117(c) leads with
C: only C makes the day he buys the sack a felt win (three batteries of food a day become 1.2). F sits between: a
real premium and a small step. Realism traded for fun is his trade (the realism-first law, 8/4; rule 117(d) made
that trade once for difficulty, not for this). Not picked here.
**A ROUNDING NOTE FOR WHOEVER BUILDS D OR F.** At ham's sack price on main (9) a battery is 2.8 units, at master rations' (15) 1.7; a unit
count must be whole, so D needs its own rounding line (down, GROK_31's way, which makes the scoop of the dear foods
a premium too).

## 8. WATER HAS NO SACK, AND THE RECORD SAYS ITS SACK IS A PUMP (NOTHING PICKED)
Worked for A NEW CREW, canon wages, plains, THIN / FULL, the bowl and the sack beside it:
| water ladder | the bowl | the sack beside the bowl | desert, with the sack | the real twin |
|---|---|---|---|---|
| W0. four litres at 1 (main today) | 26 / 32 | 33 / 40 | 30 / 36 | the vendor's can |
| W1. a 20-litre can at 5 (the same rate; it only carries) | 26 / 32 | 33 / 40 | 30 / 36 | the jerrycan |
| W2. the can at 4 (the vendor's bulk rate) | 28 / 34 | 36 / 43 | 33 / 39 | the tanker |
| W3. the crew's own pump, while it sits at a base it holds | 40 / 48 | **56 / 68** | 50 / 60 | the pipe (5 to 10 times cheaper a litre, HDR 2006) |
W3 is the only rung on the canon wage books, on this page or Day 76's, that clears Battle Brothers' 46 / 41 without
a free week (48 by the bowl at FULL; 56 / 50 with the sack at THIN). It is a held place, not a bigger bottle: under rule 86 what you build lives in your base's settlement
screen, and under the third votes the company has home bases. It counts only the days the crew sits at its own pump;
the road still buys four litres at the counter. W1 changes nothing but what is carried; W2 is a discount with no
twin on the wiki.

## 9. ROUTED
- TUNING (the one table): (1) 'stall.goods_price' re-read per man-day: ours 1 against Battle Brothers' 0.40 grains,
  0.48 bread, 'HARDER THAN BB', not EASIER; its ruling is the 10/1 floor (GROK_33), not 8/15; (2) rows for the
  ladder: food.counter_unit (A to F, section 7), food.sack_beside (C or F), food.scoop_units (D: 5 grain units a
  battery; E: 4), water.can_litres and water.can_price (W1, W2), base.own_water (W3); (3) the 117 check at both ends
  of the purse (broke and flush), which A and E fail; (4) the situations JSON's fourteen food prices are on their
  cards (Day 71 withdrawn for those rows).
- RUN TWO (the stall and the settlement screen): the sack is in price_table.json and on no shelf; whichever ladder
  TUNING holds, the shelf reads foodStackBatteries rather than typing a price; the bowl reads the situation's food
  price (traitMult has no food term; floored at one either way); 'six rounds' is under the wiki's bundle (Day 69's
  five); a base's own pump belongs on the base's settlement screen when the hold lifts (W3).
- PEOPLE and RUN TWO (the roster): one wage rule in both engines (round down, a ruled zero stays zero); the Debt
  Collectors read 2 a day on one engine and 6 on the other.
- UI (the bar): when the crew buys its first sack, FOOD's days jump (rule 117(c)), the same visible win Day 74 named.
- WORLD and FACTIONS: the sack's second cost in the record is a visible pile (kin asking, Tanzania; Food Goes Bad over
  70 in Battle Brothers; our raid takes the shelf, Day 70; stealing exists, FACTIONS [beef]). Nothing on main makes a
  big stash a target yet; named, not built.
- ECONOMY (this lane): [made here] next (the attached location that makes the sack 'unusually low'); [the pump at
  home] written from section 8 (rule 74: three OPEN rows).
- WORDS (when rule 88 lifts): the eight bank lines below.

## 10. WHAT THIS ROUND DID NOT DO
No screen, no code, no data file, no VOTE item (rule 88's hold). No felt number into the game: every ladder and every
water rung is a candidate for TUNING's table, sorted by rule 117, not picked. Every battery figure is a wiki crown
figure at ten to one rounded down (GROK_31), a count in a data file on main, or a day-by-day working of those (the
calculator reproduces Day 76's 26 / 32 / 33 / 40 exactly, Battle Brothers' 46 / 37 / 55 within a day). The ladders'
unit counts (5, 4) and the water rungs (5, 4) are illustrations at the wiki's own rate and say so. Section 5 is search
extracts of named sources; nothing was fetched in full (the hosts do not resolve here); every figure is flagged for a
check. Eight bank lines, draft:true, banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md, section EEEEEEEEEEEEEEEEEEEEEEEEEE.

[bb school line] Battle Brothers sells food only by the 25-unit sack and never prices the bowl, because no player of
its ever stands at the counter with less than five; its levers are the KIND of food and the HEADCOUNT, and it charges
a second cost for the big pile (Food Goes Bad over 70). Ours sells only the bowl, at two and a half times the sack.
[analog horror line] The keeper scoops your grain from the same sack the rich crew bought whole, and the scoop is
the same scoop every night, and the sack behind her never gets any smaller.

Sources for section 5 (search extracts; spot-check before a row cites them): University of Bristol PFRC, 'Paying to
be poor' (2016) key findings and news release (bristol.ac.uk); Fair By Design and Turn2Us, 'The poverty premium: a
customer perspective' (2019); Ofgem, analysis of price differences between payment methods (ofgem.gov.uk); Which?,
'the best way to pay for energy' (2024); Caplovitz, 'The Poor Pay More' (Free Press, 1963); Orhun and Palazzolo,
'Frugality Is Hard to Afford', Journal of Marketing Research 56(1) (2019), via AMA, UC Davis Center for Poverty
Research and The Billfold; Dillon, De Weerdt and O'Donoghue, 'Paying More for Less' (World Bank, 2020; KU Leuven
working paper 2016); Sauer, Reardon and Mason, 'The poor do not pay more', Agricultural Economics 54(5):638-661 (2023);
Koenigsberg, Kohli and Montoya, 'Package Sizes for the Bottom of the Pyramid' (Columbia Business School, 2007);
'An overlooked market: loose cigarettes, informal vendors and their implications for tobacco taxation', Tobacco
Control (2023), and the CNCT summary; CUNY Academic Works, South Bronx focus groups (2018); Euromonitor via Cosmetics
Design Asia (2013); Scroll.in on Unilever's sachets; UNDP Human Development Report 2006 via IPS, Mail and Guardian and
SouthAfrica.info; APHRC Nairobi water study (2006) via the same coverage.
