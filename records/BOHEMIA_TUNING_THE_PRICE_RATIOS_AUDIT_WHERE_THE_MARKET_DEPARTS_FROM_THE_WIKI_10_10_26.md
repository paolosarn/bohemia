# TUNING ROUND 16 -- [the price ratios] AUDIT OF THE MARKET AGAINST THE WIKI (10/10/26)
# Row: VAMILY TUNING [the price ratios] (ECONOMY routed the ratios here; their table is records/target/bb/price_table.json with engine/bohemia_pricetable.js;
# Grok GROK_119-120), RESEARCH (rule 38g). The wiki numbers are the ones I tabled in records/BOHEMIA_TUNING_THE_SELL_RATIO_WHAT_A_SETTLEMENT_PAYS_YOU_10_10_26.md
# and records/BOHEMIA_TUNING_SELL_RATIO_TABLE_10_10_26.json (wiki pages Market prices for various items and the 32 Settlement Situation pages, read here).
# Measured on 10/10 main; three audits below. Nothing built, nothing fixed by me.

## 0. WHAT ALREADY CHANGED (good news, credited)
RUN TWO took the sell-ratio finding the same day: the settlement screen's SELL_CUT went from 0.5 to 1/7 (its own comment cites my VOTE item). ECONOMY built a sourced price table
(sellCutByRelationAndSize, buy-side drop, situation multipliers, wage and hire rules). Both agree with the wiki in shape.

## 1. THE TABLE AGAINST THE WIKI
    ECONOMY's sell cut (worth paid back, Expert, relation 50 -> 100)   the wiki (my table)
    camp     .1091 -> .1251   "no wiki figure, scaled down, unsourced"    Low bracket with 1 attached location (Fortified Manor) .1282 Expert: the lowest sourced number
    village  .1364 -> .1564                                                Village Hall, 3 attached .1364 (+.02 at relation 100): MATCHES
    town     .1364 -> .1564   "no separate town figure, uses village's"    Town Hall / Castle (Medium): .1457 .1498 .1539 .1579 for 2-5 attached: THE TOWN FIGURE EXISTS
    city     .1769 -> .1969                                                City Hall, 7 attached .1769 (+.02): MATCHES
 - Relation: +0.02 of worth from 50 to 100 and buying down by 0.15 at the top of the bar: both match the wiki.
 - TOWN: ECONOMY used the village curve for towns because no figure was found. The wiki gives one: Medium bracket .1457-.1579. A town currently pays up to 1.2 points of worth too little.
 - CAMP: .1091 is below every wiki settlement (lowest .1282). A camp is not a Battle Brothers settlement, so no figure is right; the lowest sourced one (.1282, a one-location manor) is the defensible floor.
 - DIFFICULTY: the table is Expert only and states Veteran as a cross-check. My difficulty page makes STANDARD the Veteran-equivalent default, and Veteran pays about 11 percent MORE
   (x 7.41/6.67): city .1769 -> .1965, village .1364 -> .1515. Today's table under-pays the default player by a tenth.
 - SITUATIONS: the table has 9, "there is no full list". The wiki has 32 with a price effect; all 32 with buy and sell sides are in the JSON from my sell-ratio page. Examples that differ: Safe Roads
   (table: sell +0.09; the situation page: sell +10 AND buy +10, the main page says 9), Mustering Troops and Seasonal Fair (+25 buy, +25 sell), Abducted Children (+25 buy, -25 sell).
 - BUY SIDE: the wiki buying modifier is 0.95 to 1.34 of worth by bracket (High 1.22-1.34, Medium 1.08-1.17, Low 0.95-1.04). The market's buy price is value / 10 with no modifier.

## 2. THE RUNNING MARKET AGAINST THE TABLE
 - THE SCREEN DOES NOT READ THE TABLE. slices/BOHEMIA_SETTLEMENT_SCREEN.html sells back at a flat SELL_CUT = 1/7 (line 236) regardless of the place's size or your standing; it never calls
   sellFraction(tier, relation). So a village and a city pay the same, and doing contracts for a place does not improve its prices. The flat 1/7 = 0.1429 is a fair AVERAGE of the wiki (it sits at the
   Veteran middle), and the flat buy price makes the buy/sell ratio 7.0 against the wiki's 6.67 (Veteran) to 7.41 (Expert). So the totals are right and the SHAPE (size, relation, situation) is missing.
 - THE ONE-BATTERY FLOOR. The sale is max(1, floor(price / 7)). Measured on all 309 items that have a value (weapons, body armour, helmets, shields): 34 of them (11 percent) are priced so low that
   one seventh is under a battery, and they sell for 1, an effective return of 17 to 50 percent (median 25) instead of 14. Average overpay on those is 0.35 battery a sale. Seven items cost 1 to 3 batteries
   (Knife, Sackcloth, Cloth Sash, Mouthpiece, Headscarf, Leather Headband, Cultist Hood). Small in batteries, wrong in kind: the cheapest gear is the only gear that trades with almost no loss
   (a 1-battery item bought and sold is free). The wiki's crowns have no such floor; whether to keep the floor is ECONOMY's call, but the cost should be known.

## 3. THE FINDING THAT PROVES US WRONG (one against my own page)
My sell-ratio page proposed camp -> Low, town -> Medium, fortress -> High. ECONOMY's table has camp, village, town, city instead, with town sharing village's curve. The fortress tier the screen's
own open() accepts ('camp' | 'town' | 'fortress') has no row in the table at all. Three naming schemes (the screen's, the table's, mine) for one dial. They need one map before the curve is wired.
PROPOSED MAP (a proposal for ECONOMY and WORLD): camp -> Low bracket's smallest (.1282 Expert, .1424 Veteran); village -> Low (Village Hall 3 attached .1364 / .1515); town -> Medium (.1498 / .1664);
city -> High (.1769 / .1965); fortress -> High with the larger location counts (up to .1809 / .2010).

## ROUTED
- ECONOMY: the town figure, the Veteran column as the default, the 32 situations with both sides, the buy modifier, the floor decision. RUN TWO: call sellFraction(tier, relation), keep SELL_CUT only as the fallback.
- WORLD: one tier map. TUNING [numbers table]: these as references. Test material: the VOTE tile points at the sell-ratio page, which gains an AUDIT section.
