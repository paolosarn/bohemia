# ECONOMY DAY 82: BUY VERSUS SELL. THE STALL PAYS HALF, AND A TOWN IN NEED PAYS THE DIFFERENCE (10/26/26)

VAMILY ECONOMY [buy versus sell] WHAT-THE-STALL-PAYS, rule 242 (Paolo 10/26, LOCKED: "at the stall where a dose of med
six rounds food and water are available, bro I should also be able to fucking sell... I have a whole fucking chat set up
to the economics so how much you can make and you know buy versus sell you know prices and shit like that";
records/BOHEMIA_PAOLO_SELL_AT_THE_STALL_10_26_26.md). Lifted from rule 121's pause for this row. Session
economy-session_01WSDvbmsS, opened by the coordinator (rule 112). RUN TWO builds the sell button ([sell at the stall]);
this page gives the numbers, the arithmetic and the proof.

Built this round (numbers and mechanism only; no screen touched):
- records/target/bb/stall_prices.json: the numbers, every row sourced, every quote the wiki copy's own words.
- engine/bohemia_stall_prices.js: the one arithmetic (buy, sell, the handful, the need, the warning), pure functions,
  read by the gate, the calculator and (next) RUN TWO's stall.
- tools/bohemia_economy_buy_versus_sell.js: the calculator (the valley's dice for a year, the arbitrage ceiling).
- gates/buy_versus_sell_gate.js, in the suite as BUY VERSUS SELL: 28/0, eight mutations each turn it red.
- TUNING's one table, section R (15 rows; P and Q are TUNING's own, landed the same hour): records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md.
- banks/BOHEMIA_ECONOMY_THE_STALLS_WORDS_10_26_26.json: the keeper's lines for the sell side, draft:true.
- records/target/bb/price_table.json: three Battle Brothers situations had only one of their two price sides (s5).

---

## 0. THE ANSWER

1. **THEY PAY HALF.** At a calm stall a night of food and water bought for 2 batteries sells for 1. A dose, a roll of
   tape or six rounds, bought for 1, sell two for a battery. One rule a fifteen-year-old reads at a glance (rule
   117(b)), and about three times what Battle Brothers pays back (0.15 of the buy price on Veteran).
2. **A TOWN IN NEED PAYS THE RISE, THE STALL KEEPS THE SAME CUT.** A sick town sells food at 4 and buys it at 3; it
   sells a dose at 3 and buys it at 2 ("they need meds here"). The need is the card's own (Sickness: food x2, meds
   x3; Refugees: food x1.25), never a second list.
3. **A NEED IS A HOLE OF A SIZE, AND IT FILLS.** A sick camp takes 2 nights of food, a town 4, a fortress 6; one dose
   (a fortress two). The first unit sells at the full need, each next one a step nearer calm, then the town is calm
   for that good until its card's week ends. Rounds and tape have no need card in Battle Brothers, so none here: they
   move only with the town's sell knob (market day, a taken town, a caravan in).
4. **THE ARBITRAGE A SMART COMPANY CAN RUN, AND WHY IT NEVER BREAKS THE SQUEEZE.** Every game's first week has six
   sick towns. Buy 22 nights of food and 7 doses at a calm fortress in the north (Network: 51 batteries), walk the
   six sick towns in about 26 hours, sell into each one's hole: 78 back, **+27**. One routine job on the board pays
   30. The best week of a whole year, every needy town reached and the road free, is **+38**; a crew of three eats
   42 a week. Trading is a bonus on the work, never the work: Battle Brothers' own guide, "spilling blood pays better
   than spilling wine."
5. **NO STALL IS A BANK.** 17,664 checks (every stall of the valley over a quarter of weeks, a stranger and a loved
   company, every count from one to twelve, and the stacked famines up to food x6): the stall never pays as much as
   the same count costs there.
6. **A WRONG TAP COSTS NOTHING.** His rule 248 (10/26, the same hour): what he sold sits on the stall's count marked
   his and buys back at exactly what it brought while he is in that town ("I can just re-buy it back at the at the sell
   price not like it increased"); this page adds the other way, what he bought there sells back at what it cost.
   Battle Brothers buys back food too. A sale that leaves the crew under a night of food asks first (rule 242(a)).

---

## 1. HOW BATTLE BROTHERS DOES IT (the wiki copy, reference/library/grok/wiki/PAGES_ALL.tar.gz)

**The spread.** bb_all/1244_Market prices for various items.txt, the one page that measured it:
- "Buying price modifier/Selling price modifier = 6.67 (approx) in both cases. And this ratio applies to all
  settlements when playing on Veteran difficulty (all other factors being equal: Neutral (50) Relations, no
  settlement situation modifiers)." So a marketplace pays back **0.15** of what it charges.
- "Expert Economic difficulty has a higher ratio (approx 7.41) due to lower Selling price modifiers." **0.135.**
  bb_all/0828_Game Mechanics.txt: "Selling prices for various items at settlements are also reduced by 10% on Expert."
- By size, Expert, Neutral: a village hall buys at 0.95 to 1.04 of worth and sells at 0.128 to 0.140; a city hall
  1.22 to 1.34 and 0.165 to 0.181. "City Halls generally give the best base selling prices while Village Halls and
  Fortified Manors generally have the cheapest buying prices."
- Relations (Neutral 50 to Allied 100): "the maximum increase is about '2% of worth' for selling price modifiers",
  "the maximum decrease is about '15% of worth' for buying price modifiers", both added; situations multiply after:
  "These are applied multiplicatively on price modifiers after Relations has been factored in."
- Trade goods sell at about 7.48 times the regular sell modifier, so near the buy price: their margin is the
  made-here discount ("If a settlement has an attached location that produces the item in question... it will be
  unusually low in price") and the city's better sell side.

**Supplies.** "Supplies (tools/medicine/ammo) purchase generally also use the same buying price modifier, but in some
settlements, buying prices can be '''1.5x''' of what is expected." Worth: Medical Supplies 200 (bb_all/1253), Tools
and Supplies 200 (bb_all/2014), Ammunition 100 (bb_all/0055). Tools, medicine and ammunition go into a pool when
bought and are never sold back (the coordinator's recall in Paolo's record; no page says they sell). **Food does
sell back**: bb_all/2150_Update 1.5.0.14.txt, "Fixed food counter at the top bar not updating immediately when the
player would buy back food that they previously sold"; the dev blog (bb_all/1415): "Fixed provisions counter in UI
not updating properly when selling food."

**Need, by situation (the cards, bb_all/*(Settlement Situation).txt).** Food: Short on Food +200% food prices, Drought,
Lost at Sea, Preparing Feast and Besieged +100% (Besieged also +25% buying), Sickness +100% food and "+200% medicine
buying prices", Refugees +25%, Public Executions and Witch Burnings +15%, Bread and Games and Local Holiday -10%, Good
Harvest, Full Nets and Hunting Season -50%. No situation on the wiki moves ammunition or tools alone. The general
knobs: Seasonal Fair +25/+25, Mustering Troops +25/+25, Ambushed Trade Routes +20/+10, Snow Storms and Sand Storm
+20/+10, Abducted Children, Disappearing Villagers and Terrified Villagers +25/-25, Warehouse Burned Down +25/+5,
Safe Roads +10/+10, Rich Veins +10/+10, Conquered and Unhold Attacks +10/-10, High Spirits -5/+5, Disbanded Troops and
Well Supplied -10/-10.

**What Battle Brothers' own arithmetic says about trading supplies.** Buy food in a Good Harvest town (x0.5) and sell
it in a Short on Food town (x3), the best food trade its cards allow: 0.5 x buy against 3 x 0.15 x buy on Veteran =
**a 10 percent loss**. Battle Brothers' food never pays as a trade; only trade goods do, and its guide says why
(bb_all/0834 Getting Started): "Beware, though: you're a mercenary band--and believe it or not, spilling blood pays
better than spilling wine." The calculator confirms it on our valley: Battle Brothers' spread at the slider's hard
end pays **0** on any trade, all year.

**The marketplace's stock** (bb_all/1415, Specialized Shops, 15 January 2016): "the selection on the marketplace is
limited to what those traders bought themselves and are now reselling"; bb_all/1763: "the selection of market items
usually refreshes every 3 days" (our RESTOCK_DAYS 3).

---

## 2. THE RULE AND THE NUMBERS (records/target/bb/stall_prices.json; engine/bohemia_stall_prices.js)

**What each line costs and pays** (a town stall, a stranger; the calculator's own print):

| the town | a night of food (buy / sell) | a dose (buy / sell) | six rounds | a roll of tape |
|---|---|---|---|---|
| calm | 2 / 1 | 1 / two for 1 | 1 / two for 1 | 1 (not sold yet) / two for 1 |
| SICK ("they need food", "they need meds") | 4 / 3 (4 nights, easing) | 3 / 2 (1 dose) | 1 / two for 1 | two for 1 |
| sick on market day | 5 / 3 | 4 / 3 | 1 / two for 1 | two for 1 |
| refugees ("they need food") | 3 / 1 (4 nights, easing: four bring 5) | 1 / two for 1 | 1 / two for 1 | two for 1 |
| market day | 3 / 1 | 1 / two for 1 | 1 / two for 1 | two for 1 |
| taken, or a caravan just in | 2 / two for 1 | 1 / three for 1 | three for 1 | three for 1 |
| a glut (Battle Brothers' harvest, food x0.5; no card on main yet) | 1 / takes none ("we have plenty") | | | |

**The four lines of arithmetic** (the module's header):
1. BUY = price x the town's need x (1 - the standing's cut) x the town's buy knob, rounded, never under 1. Today's stall
   already does price x need x knob; the standing (up to 0.15 off at Allied) is what the gear already gets.
2. SELL = price x (need - 0.5 + the standing's add) x the town's sell knob. Calm (need 1): half. Need 2: one and a half
   times the calm price. A glut at need 0.5: nothing.
3. The need's units a week (food 2 / 4 / 6, meds 1 / 1 / 2 by camp / town / fortress), the first at the card's full
   need, easing in even steps to calm.
4. A sale of k units pays the floor of their sum, and never as much as k cost at that stall (rule 242(d)). The
   stall always keeps something: a unit never sells for more than 0.85 of what the stall charges a stranger for it.

**Why the realistic model leads** (realism first, 8/4; the realistic option wins by default and the trade is his):
- *The stall keeps the same cut, the rise is the seller's.* The farm-to-shelf margin is mostly a fixed cost per unit
  handled (Gardner, "The Farm-Retail Price Spread in a Competitive Food Industry", AJAE 1975), so when the shelf price
  rises the spread does not rise with it. A dealer's spread narrows as goods move faster (Demsetz, "The Cost of
  Transacting", QJE 1968): in a shortage the stock turns the same day and the dealer needs less cut to carry it.
- *A glut drops the buyer's price first.* Prices paid to sellers fall faster than shelf prices (Peltzman, "Prices Rise
  Faster than They Fall", JPE 2000): a harvest town takes no more food.
- *Half.* A small shop's buy at half its shelf price is the trade's oldest rule (keystone: the shelf price is double
  the cost); a grocer in a calm economy works on a gross margin near a quarter; Battle Brothers pays back 0.15. Half
  sits between the shop and the game, and it is one word.
- Battle Brothers' own (a situation multiplies both sides alike) is the slider's hard end: a sick town would buy food
  at 2 and gain nothing.

**The slider (rule 117(a)):** EASIEST 0.67 back (it breaks the squeeze: week one 34, worst week 49; his comfort, his
trade); THE START 0.5, the realistic need; BATTLE BROTHERS 0.15, need multiplying both sides (no trade ever pays).

---

## 3. WHAT A TOWN SHORT OF A THING REALLY PAYS (the crash-economy reading)

- **Medicine: as much as it takes.** Demand for medical care barely moves with price (RAND's review of the health
  care elasticity literature, Ringel and others 2002: about -0.2). A town with a sickness pays what it must, which is
  why Battle Brothers' Sickness card is the only one that moves medicine and moves it most (+200%). Venezuela's
  shortage years are the crash version: most medicines off the shelves (the pharmacists' federation put it near 85
  percent in 2017) and a resale market that paid many times the controlled price. Our sick town's dose at 3 to buy and
  2 to sell is that, at a stall's scale.
- **Food: only where people still have money.** Sen (Poverty and Famines, 1981) found that famines are a collapse of
  what people can buy, not always of food: in Bengal 1943 rice rose several times over, but in Wollo 1973 the famine
  area's food prices barely rose while people starved, and grain moved OUT toward towns that could pay (the food
  countermovement; Ireland's 1840s exports the old case). So a town in need pays more for food only where its people
  have something to pay with. Our game already reads it that way: a raided town is EMPTY, not dear (Day 70), and the
  dear one is the neighbour that took its refugees (RUN TWO [the neighbour takes the refugees]).
- **What you sell to eat, you sell cheap.** In a famine the price of what people own collapses against food (Sen's
  distress sales: the herder's goat buys less grain each week). Selling your kit at a calm stall is that lesson: a
  NEW CREW's whole FULL kit (30 meds, 40 tape, 80 rounds) brings 41 batteries, about seven nights for three, and
  leaves them unable to heal, patch or shoot.
- **A shortage is a moment, not a mine.** Grain arriving is what broke the famine price (Sen); in our valley the map's
  own caravans set Well Supplied where they land (records/target/bb/arrival_traits.json). The need eases with every
  unit and is gone in a week. The life lesson underneath, never said out loud: the first one there collects, and the
  hole is only so big.

---

## 4. THE ARBITRAGE A SMART COMPANY CAN RUN, AND THE PROOF IT NEVER BREAKS THE SQUEEZE

**The squeeze, written down** (the row's step 4; rule 117 says easier than Battle Brothers, and the coordinator's
step says trading must not break the first week; this lane's definition, with why):
- **S1, the first week:** the best week of trading pays under ONE routine contract (30, records/target/BOHEMIA_BOARD_
  SHELF.json's one-skull pay). Battle Brothers' own rule: blood pays better than wine.
- **S2, any week:** the best week of trading never feeds a crew of three (3 men x 2 batteries x 7 nights = 42). Trading
  can soften the squeeze; it cannot replace the work.
- **S3:** no stall sells for as much as it charges (no money pump inside one town).
- **S4:** a calm town pays exactly half.

**The ceiling, measured on the live dice** (tools/bohemia_economy_buy_versus_sell.js): every town's cards for 52 weeks
by the map's own roll (engine/bohemia_livingmap.js traitsFor over records/target/settlement_traits.json, the same
function the settlement screen runs and a gate holds equal), the 14 home bases at their tiers (engine/bohemia_towns.js:
5 fortresses, 4 towns, 5 camps). For each week: buy at the cheapest stall in the valley, sell into every needy town up
to its units, every needy town reached, nothing charged for the road or the nights. A smart company cannot beat it.

**Week one, every game** (the cards' seed is the town's name and the week, so week one is the same in every game,
s5): twelve of fourteen towns carry a card; six are sick (Anarchists, Blues, Reds: towns; Cartel: a fortress;
Colorful, Trades: camps), five of them on market day too. The two calm towns, Network (fortress) and Volunteers (camp),
sit together in the north and are the cheapest stalls.

| the stop | sold | for | bought for | gain |
|---|---|---|---|---|
| Network (buy everything) | | | 22 nights + 7 doses = 51 | |
| Reds, town, sick + market (5 cells) | 4 nights, 1 dose | 11 + 3 | 8 + 1 | +5 |
| Colorful, camp, sick + market (33) | 2 nights, 1 dose | 6 + 3 | 4 + 1 | +4 |
| Anarchists, town, sick + market (28) | 4 nights, 1 dose | 11 + 3 | 8 + 1 | +5 |
| Cartel, fortress, sick + market (40) | 6 nights, 2 doses | 16 + 5 | 12 + 2 | +7 |
| Trades, camp, sick + market (22) | 2 nights, 1 dose | 6 + 3 | 4 + 1 | +4 |
| Blues, town, sick (16) | 4 nights, 1 dose | 9 + 2 | 8 + 1 | +2 |
| **the loop** | **22 nights, 7 doses** | **78** | **51** | **+27** |

145 cells at the map's 10.75 minutes a cell (slices/BOHEMIA_CITY_WORLD.html cityStepMins), about 26 hours on the road.
**+27 against a routine job's 30: S1 holds.** A company every town loves: +23 (the stall's buy drops for a friend, and
a sale never reaches the friend's buy).

**The year:** mean +21.9 a week, the best week (week 3) **+38** from 16 needy lines on a 25.6-hour loop; loved, +36.
**Under 42: S2 holds.** Sick place-weeks: 43.1 percent (RUN TWO's NOTE to TUNING: only two cards roll).

**S3:** 17,664 checks, 0 at or over. **S4:** a calm night sells for exactly 1.

**The stacked ceiling, reported, never on the dice:** every town at once sick, on market day and full of refugees, the
company Allied everywhere and the source well supplied: +108 a week (a fortress 8 on food and 3 on meds, a town 6 and
1, a camp 4 and 1). The dice cannot make it: both rolled cards land on one town about one week in five, all fourteen
together never.

**How the units were picked** (the sweep is in the calculator's history, this round): flat needs (every unit at the
full need) fail S1 at anything over one unit a town (food 3 / 6 / 9 and meds 2 / 3 / 4 made week one +83); the easing
need lets a fortress want six nights and still hold both bars with a margin (27 of 30, 38 of 42). Meds stay at one
dose (two in a fortress) because the dose's need is x3. The gate re-measures on the live dice every run: if TUNING
rolls fewer sick weeks the units can grow; if a lane adds a famine card, the gate says so before it ships.

**What the squeeze still has, for the record:** the Lone Wolf eats 14 a week, so a week of trading (+27) feeds him
about twice over; his squeeze is the hall and the gear, not the bill (TUNING's section J; reported, not tested). A
company that sells its whole kit buys about a week (s3) and cannot fight after it.

---

## 5. THE FINDINGS THAT PROVE US WRONG

1. **Week one's town cards are the same in every game.** The settlement screen's rollTraits and the map's traitsFor
   seed the dice with the town's name and the week only (`name + ':traits:' + week`), never the save's seed. Every new
   game opens with the same six sick towns (Anarchists, Blues, Cartel, Colorful, Reds, Trades) and the same calm north.
   Rule 146(c) (A WORLD MADE FRESH: 'where you start and the world around you change each playthrough') says
   otherwise. One fix, two files held equal by a gate: RUN TWO (the screen's rollTraits) and LIFE+CITY (livingmap's
   traitsFor) add the save's seed together. The squeeze numbers do not move with it (the gate measures every week of a
   year, so any week can be week one).
2. **This lane's own situation table had half of three cards.** records/target/bb/price_table.json (GROK_120's reading,
   10/4) gave Ambushed Trade Routes only its +10% selling (the card: +20% buying too, -25% items), Well Supplied only
   its -10% buying (the card: -10% selling too, as arrival_traits.json already reads it) and Safe Roads only its sell
   (the card: +10% buying too; the Market prices page says 9% selling, the card 10%). Fixed this round with a
   `_corrected` line. WORLD's engine/bohemia_region_news.js copied the half (well_supplied sell 0, ambushed buy 0);
   routed.
3. **The coordinator's 242(d) asks that 'a famine pays more for food', and there is no famine on main.** The only
   cards that move food are Sickness (x2) and Refugees (x1.25). Battle Brothers' five food shortages (Short on Food,
   Drought, Lost at Sea, Preparing Feast, Besieged) and its three gluts are not in the valley (Day 71 counted 44
   situations). The gate's famine leg reads Sickness until FACTIONS or RUN TWO adds one; the sell side already takes
   any need, x6 included.
4. **Battle Brothers never buys supplies back.** His words beat it (rule 242), and Battle Brothers' own arithmetic shows
   why it can afford to: its food trade loses 10 percent at the best cards it has. Ours is easier (rule 117), so ours
   needs the hole's size to hold the squeeze; the hole is the realistic part, not a patch.
5. **Most of the valley carries a card most weeks.** 43.1 percent of place-weeks are sick. With Battle Brothers' rarer
   situations, the town's hole could be twice as deep for the same squeeze. TUNING's knob (settlement_traits.json
   roll), RUN TWO's NOTE already on TUNING's board.

---

## 6. FOR RUN TWO ([sell at the stall])

- Load `../engine/bohemia_stall_prices.js` and fetch `../records/target/bb/stall_prices.json` (the page already fetches
  from records/target/). Each STALL line becomes `BohemiaStallPrices.line(file, good, ctx)` with
  ctx = `{tier: S.place.tier, need: good==='food' ? stm.food : good==='meds' ? stm.meds : 1, buyMult: stm.buy,
  sellMult: stm.sell, relBuySub: relPrice().buySub, relSellAdd: relPrice().sellAdd, soldToNeed: <count>}`.
- `soldToNeed`: units of that good sold into this place's need in this card week (key it `place + ':' +
  Math.floor(day / 7)`, the dice's own period); a unit bought back the same visit gives one back.
- The line shows buy and sell side by side as battery icons and the count (rule 224): buy `line.buy` for one;
  sell `line.handfulPays` for `line.handful` (one when a unit already brings a battery; two or three in a calm town;
  0 means the stall does not take it here). A sale of k: `pays(file, good, ctx, k)`.
- `line.word === 'short'` says the need in a word ('they need meds here'), `line.needLeft` how many more;
  `'plenty'` says the stall is full.
- Before a food sale: `warns(file, 'food', foodAfter, crew)` asks first.
- The undo (undo_same_visit; his rule 248 is your row [what you sell sits on their shelf] too): keep this visit's sales
  and buys; a sold unit sits on the stall's count marked YOURS, SOLD and buys back at what it brought, a bought unit
  sells back at what it cost; the flags clear when he leaves the town.
- Tape: the stall buys it now (two for a battery); selling it a roll at 1 is your line to add (goods.tape.buy).
- The gate's 242(d) screen legs are yours; the numbers' legs are in BUY VERSUS SELL.

---

## 7. ROUTED

- **RUN TWO**: the sell side as s6 (a NOTE on your board); the dice's seed with LIFE+CITY (s5.1).
- **LIFE+CITY**: traitsFor takes the save's seed with RUN TWO's rollTraits (s5.1).
- **TUNING**: section R is yours to move (the share, the units, the slider); the sick roll (s5.5); the Lone Wolf's
  week (s4).
- **WORLD**: engine/bohemia_region_news.js SITUATIONS carry both sides of Well Supplied and Ambushed Trade Routes
  (s5.2).
- **FACTIONS**: a famine card (Short on Food, the wiki's +200%) when the valley wants one (s5.3).
- **UI**: the stall's two prices as icons and the count, the need word, the warning, in the kit (rule 224).
- **WORDS**: the keeper's sell-side lines, banks/BOHEMIA_ECONOMY_THE_STALLS_WORDS_10_26_26.json, draft:true.
- **EYES**: 242(d) on the phone and the computer once RUN TWO's button is in.

---

## 8. GATES (rule 13, by name)

BUY VERSUS SELL 28/0 (new, eight mutations); PRICE TABLE 19/0 and THE NEWS DOWN THE ROAD 28/0 after the price
table's three cards; the others named in the handoff. The suite runner itself was down on main (THE GATE TABLE IS
MALFORMED: row 913, AUTO KILLS ONE AT A TIME, three fields, from COMBAT TWO 50d5cba1); the missing `slow` field added
(True: it plays 600 fights), so `python3 gates/bohemia_gates.py --only` runs again for every lane.
