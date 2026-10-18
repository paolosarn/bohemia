# TUNING ROUND 10 -- [the sell ratio] WHAT A SETTLEMENT PAYS YOU FOR YOUR GOODS (10/10/26)
# Row: VAMILY TUNING [the sell ratio], RESEARCH (rule 38g). For ECONOMY's data file. RUN TWO's 'half' (SELL_CUT = 0.5 in
# slices/BOHEMIA_SETTLEMENT_SCREEN.html, "TUNING: unsourced") is the number under test.
# EVERY NUMBER FROM THE WIKI, READ HERE: pages 'Market prices for various items' and the 32 'Settlement Situation' pages
# in reference/library/grok/wiki/PAGES_ALL (CC BY-SA 3.0, battlebrothers.fandom.com). Grok GROK_119 (unverified) said the same;
# the wiki page confirms it and gives the full table. Data: records/BOHEMIA_TUNING_SELL_RATIO_TABLE_10_10_26.json.

## 1. HOW BATTLE BROTHERS PAYS YOU (the whole mechanism in four lines)
1. Every settlement has ONE selling modifier for all regular goods (weapons, armour, pelts, fangs): a fraction of the item's WORTH.
   A full helm worth 3500 sells for 689, so that settlement pays 19.7 percent. Prices are truncated.
2. It also has ONE buying modifier (what you pay, as a multiple of worth). The two move together, and BUYING DIVIDED BY SELLING IS
   FIXED PER DIFFICULTY: 6.67 on Veteran (Beginner grouped with it), 7.41 on Expert. So a settlement that is dear to buy from is
   also better to sell to.
3. Treasure (signet rings, silverware, gems) sells at about 6.33 times the regular modifier and trade goods (cloth, wood, amber,
   salt) at about 7.48 times. That is why loot is spread across item kinds: the regular gear you pick up is the WORST thing to carry to a market.
4. Supplies (tools, medicine, ammo) cost the normal buying modifier, but in some settlements up to 1.5 times it.

## 2. THE TABLE BY SETTLEMENT SIZE (Expert, neutral relations 50, no situation) , WITH VETERAN DERIVED
| bracket | settlement types | attached locations | selling (Expert) | selling (Veteran, derived x1.111) | buying |
| High   | City Hall, Stronghold  | 8 7 6 5 4 | .1809 .1769 .1727 .1688 .1647 | .201 .197 .192 .188 .183 | 1.34 1.31 1.28 1.25 1.22 |
| Medium | Town Hall, Castle      | 5 4 3 2   | .1579 .1539 .1498 .1457       | .175 .171 .166 .162      | 1.17 1.14 1.11 1.08 |
| Low    | Village Hall, Fortified Manor | 4 3 2 1 | .1404 .1364 .1323 .1282 | .156 .152 .147 .142 | 1.04 1.01 .98 .95 |
(The wiki's own Veteran City Hall range, 18.73 to 19.61 percent, matches the derivation.) More attached locations means better prices
inside a bracket. THREE MORE LAYERS, applied in this order:
- RELATIONS (start 50, cap 100; a finished contract is about +8; back to 50 after about 33 days): at 100, selling rises by about 2
  percentage points of worth (17.69 to 19.69 in a City Hall) and buying falls by about 0.15 (1.04 to 0.89), added not multiplied.
- SITUATION, multiplied on top (32 situations carry a price effect; all in the JSON). Examples, buy / sell: Safe Roads +10 / +10,
  Mustering Troops +25 / +25, Seasonal Fair +25 / +25, Well Supplied -10 / -10, High Spirits -5 / +5, Besieged +25 buy and food +100,
  Abducted Children +25 / -25, Sickness medicine buying +200. (The main page says Safe Roads 9 percent; the situation page says 10. Use the situation page.)
- DIFFICULTY: Expert is about 10 percent lower on selling (already in the Expert column), per my 10/9 difficulty page.

## 3. THE FINDING THAT PROVES US WRONG
*** OUR SETTLEMENT PAYS 50 PERCENT. BATTLE BROTHERS PAYS 13 TO 20 PERCENT. *** The screen buys at value/10 batteries with no
modifier (GROK_33) and sells back at half. The wiki says you recover about one part in 6.67 of what you paid (15 percent on Veteran,
13.5 on Expert), from 5.3 to 7.4 depending on the bracket and relations. At half, a company could buy, sell, rebuy and lose
only half each trip, and picked-up gear is worth three times what it is in Battle Brothers. That inflates the whole loop that the
rules were built to be tight ("a company without money and supplies will quickly have no members left", the wiki's words).
A second, smaller finding: batteries are WHOLE NUMBERS and the screen floors a sale at 1. A knife worth 30 buys for 3 and, at 15
percent of worth, should sell for 0.45; the floor turns that into 1, a 33 percent return on the cheapest gear. The wiki's crowns
have no such floor. ECONOMY must choose a rounding rule (round down to 0, or keep money in a smaller unit); that is the one real decision here.

## 4. WHAT TO PUT IN ECONOMY'S FILE (rows; nothing is built, nothing here converts crowns to batteries)
sell.base[bracket][attached] and buy.base[bracket][attached] from section 2; sell.veteran_over_expert 1.111;
relations.sell_plus 0.02, relations.buy_minus 0.15, relations.per_contract 8, relations.reset_days 33;
situation[name].buy_pct / sell_pct (32 rows); sell.treasure_mult 6.33, sell.trade_mult 7.48; supplies.buy_max_mult 1.5.
Map for our tiers (the screen has camp, town, fortress): camp -> Low, town -> Medium, fortress -> High. That mapping is a proposal;
ECONOMY and WORLD may differ. The ratio is the point: whatever the buy price, the sell price is about one seventh of it.

## ROUTED
- ECONOMY: section 4 into the data file; the rounding decision in section 3; replace SELL_CUT 0.5.
- RUN [settlement screen]: SELL_CUT is the only number in that screen with no source; this is the source.
- TUNING [numbers table]: the sell rows go in as references; the felt-numbers audit already lists SELL_CUT as a gap.
- Test material: the VOTE page is draft:true.
