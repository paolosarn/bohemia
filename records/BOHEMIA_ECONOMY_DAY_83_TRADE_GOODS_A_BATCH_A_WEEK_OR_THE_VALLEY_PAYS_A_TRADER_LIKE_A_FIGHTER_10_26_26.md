# ECONOMY DAY 83: TRADE GOODS. A BATCH A WEEK, OR THE VALLEY PAYS A TRADER LIKE A FIGHTER (10/26/26)

VAMILY ECONOMY [trade goods] CARRY-IT-WHERE-IT-IS-NOT, rules 265 and 266 (Paolo 10/26, LOCKED: "all stalls and whatever no
matter the settlement always sell at least like one duct tape or something or like you know a stack of duct tape... in
battle Brothers, you can buy goods from you know whatever type of settlement it is... luxury goods that you can buy just to
move them around to different parts of the city and sell them off for higher income... I didn't know off the bat like which
city like they are they have the best selling price of my goods"; records/BOHEMIA_PAOLO_TAPE_AT_EVERY_STALL_TRADE_GOODS_AND_THE_
MAP_SHOWS_WHERE_IT_SELLS_10_26_26.md). Fired by the coordinator's routine into this session after [buy versus sell] (Day 82).
RUN TWO builds the shelf ([tape at every stall], [trade goods on the shelf]); WORLD TWO the map's marks ([where it sells best]).

Built (numbers and mechanism; no screen touched):
- records/target/bb/stall_prices.json: size_mult, sell_floor_share, tape_shelf, trade (made_here, not_made, relations, stock,
  restock_days, the twelve goods with their makers), every quote checked against its page.
- engine/bohemia_stall_prices.js: sizeOf, tapeShelf, tapePrice, tradeGood, madeHere, makes, tradeBuy, tradeSell, tradeStock.
- tools/bohemia_economy_buy_versus_sell.js runTrade(): the typical carries, the week-one trader, the stock ceiling.
- gates/buy_versus_sell_gate.js: 45/0 (G legs for goods, four new mutations).
- TUNING's one table section R: the size, the floor, the tape shelf, the back room, and the goods' rows.
- Step 1 shipped first, on its own (ede463a0), so RUN TWO could wire the tape while this page finished.

---

## 0. THE ANSWER

1. **TAPE, ALWAYS.** Every stall holds at least a stack of 20 rolls every visit: a camp 20, a town 40, a fortress 60, the
   Trades' workshop twice that; a raid never takes it under 20. One battery a roll; when the shelf is empty the keeper sells
   from the back at 2, never sold out. Restocked every 3 days. A stack is Battle Brothers' one item of tools ("200 for 20"),
   and a won fight eats about 6 rolls (9 on average, 19 in the worst tenth), so a camp's stack mends about two fights.
2. **A SMALL PLACE PAYS LESS, AND NOBODY REFUSES.** Every price at the stall moves with the place's size (Battle Brothers'
   small 95, medium 102, large 110): a camp buys a night of food two for a battery, a fortress one for one. In a glut the
   stall still pays Battle Brothers' price for any ordinary thing (15 in 100 of its calm price), so a handful of twelve or
   fewer always brings a battery.
3. **TWELVE GOODS, TWELVE MAKERS** (s2): charcoal (the Homeless), casino linen (the Mob), mountain timber (the Anarchists),
   stripped copper wire (the Trades), turquoise (the Colorful), hides (the Remnants), coffee and chile (the Caravans), salt
   (the Blues), candles and incense (the Church), pharmacy stock (the Cartel), runway cloth (the Network), pawnshop gold (the
   Reds). The Volunteers and his own camp make nothing.
4. **BATTLE BROTHERS' RULE, EXACTLY.** Where it is made: bought at the plain price, sold back for 15 percent. Anywhere else:
   bought at 150 percent, sold at 110. A good costs 10 to 53 at home and sells for 10 to 62 away, more in a bigger place.
5. **A TYPICAL CARRY PAYS ITS TRIP.** Each good's batch to the nearest town that pays more: every one of the twelve clears
   its leg's food and wages, the median by 4 batteries (salt from the Blues to the Remnants, 2.7 hours: +11; candles from the
   Church to the Mob: +10.5; charcoal barely: +0.5).
6. **AND IT NEVER BEATS THE BOARD IN WEEK ONE.** A maker turns out a batch a week (a camp 1, a town or a fortress 2). A
   trader who knows every price, starts with the richest purse on main (320) from any town and walks the roads makes **165**
   in week one (12 carries), **189** with the supplies of Day 82 (24 at most), under **210**, one routine job a day, while the map's pace
   holds four to six jobs a day.
7. **THE FINDING:** at Battle Brothers' own three-day restock the same trader made **797** in week one, 30 carries, about
   four jobs a day with no risk. Battle Brothers can afford its restock because its carries take days; ours take hours.

---

## 1. HOW BATTLE BROTHERS DOES IT (the wiki copy, quoted)

bb_all/0827_Game Guide.txt, "How can I increase trade profitability?":
- "Trade goods sell for their full worth (instead of 95% for Treasures and 15% for other items)."
- The base multiplier by settlement level: "Level 1 (small): 95%", "Level 2 (medium): 102%", "Level 3 (large): 110%"; "To
  that value is added the number of attached locations × 3%" (our places have no attached locations yet, so none).
- Relations: "Relations > 50: ± (relations − 50) × 0.3% for a range of 0-15% (subtracted if buying, added if selling)".
- "Locally produced: Buying price: unchanged, Selling price: 15%. Not locally produced: Buying price: 150%, Selling price:
  110%. This reflects the supply and demand economic model."
- "Shops resupply every 3 days".
- The player Drathnar's arithmetic, quoted on the page: "you also need to deduct daily wage and food expenses for the men for
  the time you need to travel to a proper city hall to sell those goods"; and Trade's own line: "Trade potential is
  directly linked to a map layout... which makes it an unreliable source of income."
bb_all/2018_Trade.txt: the twelve goods' worth (Peat Bricks 100 to Uncut Gems 520) and the supplies: "Repairs Equipment
Base worth: 200 for 20", heals wounds 200 for 20, reloads ammunition 100 for 50. At ten to one: a roll of tape 1, a dose 1,
six rounds 1.2 (the floor's 1). Our stall's one battery a thing is Battle Brothers' own price.
bb_all/2014_Tools and Supplies.txt: "Workshop substantially increases availability at adequate price"; "Large settlements
have higher availability."
bb_all/0834_Getting Started.txt: "spilling blood pays better than spilling wine."

---

## 2. WHO MAKES WHAT (from what each place really is; engine/BOHEMIA_faction_graph.json, the map's seats)

| good (Battle Brothers' twin, worth) | maker | why it is theirs |
|---|---|---|
| CHARCOAL (Peat Bricks, 10) | the Homeless (camp) | burned out of what the fires left; the poorest place makes the cheapest good |
| CASINO LINEN (Cloth Rolls, 14) | the Mob (fortress) | the Strip's casinos' linen stores; they hold the Strip |
| MOUNTAIN TIMBER (Quality Wood, 18) | the Anarchists (town) | pine off the Spring Mountains' south slope, where nobody owns the trees; their seat is on that edge |
| STRIPPED COPPER WIRE (Copper Ingots, 22) | the Trades (camp) | the skilled workers strip the dead grid: the real crash's scrap trade |
| TURQUOISE (Amber Shards, 26) | the Colorful (camp) | stones from the washes, cut and set by the community's makers |
| HIDES (Furs, 30) | the Remnants (fortress) | the escaped lab beasts shot on the military range they hold |
| COFFEE AND CHILE (Spices, 32) | the Caravans (fortress) | brought in from outside on the I-15; they are the valley's door |
| SALT (Salt, 34) | the Blues (town) | evaporation ponds on Lake Mead's dropped shore; the environmentalists let the sun work |
| CANDLES AND INCENSE (Incense, 38) | the Church (town) | Battle Brothers' incense is a temple good |
| PHARMACY STOCK (Dyes, 40) | the Cartel (fortress) | stolen and cut pharmacy stock, the black market's own |
| RUNWAY CLOTH (Silk, 46) | the Network (fortress) | the runway's cloth (everyone dresses like a runway), in through the strongest outside ties |
| PAWNSHOP GOLD (Uncut Gems, 52) | the Reds (town) | rings, watches and teeth bought cheap at the pawn counter; a crash runs to gold (Argentina 2001, Venezuela 2016) |

Day 68's sketch had tobacco for incense and lithium cells for gems: the Church's candles are the closer twin, and a cell sits
too near the money (batteries are the money, 9/4). The Volunteers are "resource-poor by design" and his own camp makes what
he builds (the mayor arc, Day 81). Names draft:true (WORDS).

**What a sack costs and brings** (a stranger, a calm day): at its maker 10 to 53, bought back there for 1 to 7; away, a camp
buys at 14 to 74 and pays 10 to 54, a town 15 to 80 and 11 to 58, a fortress 17 to 86 and 12 to 62. A good made in a
fortress pays only at another fortress (1.21 against 1.10): Battle Brothers' "buy in small villages... sell in large
developed cities", exactly. A company every town loves (Allied) buys gold at 45 and sells it at 71: trade is a late-game
income, as in Battle Brothers.

---

## 3. THE ARBITRAGE, AND THE SQUEEZE

**The tests, written down** (rule 266(c) and the row's step 3; the bar is this lane's, with why):
- **T1, a typical carry pays its trip.** For each good, its maker's batch to the nearest town that pays more than the maker
  charges (the obvious carry the map will show him first), the one leg on dirt (the slow ground: the honest cost), against
  three men's food (2 a night) and the median hired man's wage (1 a day, backgrounds.json at ten to one): 0.375 batteries
  an hour. The median of the twelve must clear it.
- **T2, the first week's squeeze.** The richest start on main (the Lab Rats' FULL purse, 320), from every one of the 14
  towns, every price known, the roads everywhere (the fast ground: the honest ceiling), week one's real cards, the trader
  taking again and again the carry that pays most an hour. Week one's food is in the wagon (origins.json food_days 7), so
  everything made is profit. The bar: under one routine contract a day, 7 x 30 = 210. The map's pace holds four to six jobs
  a day (records/BOHEMIA_COORDINATOR_THE_PACE_MATH_OUR_DAY_AGAINST_BATTLE_BROTHERS_10_26_26.md): blood pays better than
  wine, by four to six times.
- **T3, goods and supplies together** in week one, the same bar.

**Measured** (tools/bohemia_economy_buy_versus_sell.js runTrade):

| the batch a maker turns out | restock | week one, the perfect trader | the stock ceiling | the obvious carries that pay | the median carry's net |
|---|---|---|---|---|---|
| 2 / 3 / 4 (camp / town / fortress) | 3 days (Battle Brothers) | **797** (30 carries) | 873 | | |
| 1 / 1 / 1 | 3 days | 247 | 276 | | |
| 1 / 2 / 2 | 7 days | **165** (12 carries) | 166 | 12 of 12 | **+4** |
| 2 / 2 / 2 | 7 days | 182 | 184 | 12 of 12 | +7.1 |
| 2 / 2 / 3 | 7 days | 215 | 217 | 12 of 12 | +8.1 |

**The pick: a batch a week, 1 / 2 / 2.** Week one 165 on goods, 189 with Day 82's supplies (23 at the size rule, 24 for a
loved company), under 210 with 21 to spare; every good's obvious carry pays; the median clears its trip by 4. Every start town makes the same
165 (the valley is small enough to reach every maker in a week from anywhere), which is what a ceiling should look like.

**The obvious carries** (a calm day, a stranger): charcoal Homeless to the Anarchists, 1 sack, 1.3 h, +0.5; linen Mob to
Network, 2, 0.9 h, +1.7; gold Reds to the Volunteers, 2, 0.9 h, +1.7 (the Mob pays +17.7 for the same walk: the map's marks
matter); turquoise Colorful to the Church, +3.1; hides Remnants to the Cartel, +3.6; timber Anarchists to the Caravans,
+3.8; copper Trades to the Remnants, +4; coffee Caravans to the Cartel, +5.1; pharmacy Cartel to the Caravans, +7.1; runway
cloth Network to the Mob, +7.7; candles Church to the Mob, +10.5; salt Blues to the Remnants, +11.

**Why a batch a week is the realistic number too.** A charcoal pit, a salt pond and a pawn counter turn out a batch, not a
fresh shelf every three days; Battle Brothers' three-day restock is a shop shuffling its goods, and its carries take days,
so its traders meet a restocked town once a trip. Ours walk the valley in hours (one of our days holds four to six of
theirs): at its restock the perfect trader met every maker three times in week one. Tape, supplies and gear keep the three
days (they are the shop's own shelf).

**What it still allows, for the record.** After week one the standing grows: a company the makers and the buyers love buys
at up to 0.15 off and sells at up to 0.15 on, Battle Brothers' own, so gold bought at 45 sells for 71. That is trade
becoming a real income once he has earned the towns, which is how Battle Brothers plays it.

---

## 4. THE FINDINGS THAT PROVE US WRONG

1. **Battle Brothers' restock in our valley pays a trader like a fighter.** 797 in week one at a three-day restock, about
   four jobs a day with nothing to lose. The same percentages that keep trade "an unreliable source of income" there make it
   the best income here, because the restock is counted in days and our days are dense.
2. **The size rule moved Day 82's numbers.** A fortress now pays 10 percent more for everything, so the worst week of supplies
   trading went from 38 to 41 against the 42 bar; the fortress's second dose of meds came out (need 1 / 1 / 1), and the worst
   week is 37 again (week one 23).
3. **His "a small place pays less" and Day 82's "a glut takes nothing" disagreed.** His 265(b) wins: the stall never refuses,
   it pays Battle Brothers' 15 percent.
4. **Rule 265(c)'s town with shelves and no stall** is RUN TWO's row; the numbers above work for any stall that exists.

---

## 5. FOR RUN TWO AND WORLD TWO

- RUN TWO [tape at every stall]: `tapeShelf(file, {place, tier, stockMult})` and `tapePrice(file, {..., soldThisRestock})`.
  [trade goods on the shelf]: `makes(file, place)` is the good on its stall; `tradeStock(file, id, {place, tier, stockMult})`
  how many this week (the batch: key it `place + ':' + Math.floor(mapDay / 7)`); `tradeBuy` / `tradeSell(file, id, {place,
  tier, buyMult, sellMult, relBase: relPrice().buySub})` the two prices; a good takes a stash slot. Gear: multiply sellBack by
  `sizeOf(file, tier)` (265(b)).
- WORLD TWO [where it sells best]: the mark on a town for a good is `tradeSell(file, id, ctx)` with that town's ctx (its tier,
  its cards' knobs on the day he learned it); best first; a town he never visited or heard of shows a question mark (266(b)).
- FEED: a price heard is a town's `tradeSell` on the day it was posted (rule 215); old ones fade on the map.

---

## 6. GATES (rule 13, by name)

BUY VERSUS SELL 45/0 (G1 to G9 new; mutations: Battle Brothers' three-day restock, three times the batch, a maker buying
back at full price, a worth the page does not say: each turns it red). PRICE TABLE 19/0, THE NEWS DOWN THE ROAD 28/0,
HANDOFF 10/0 in the pre-push pass; the other reds on main as before (rule 13).
