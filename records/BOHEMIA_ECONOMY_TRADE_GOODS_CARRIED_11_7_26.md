# ECONOMY: TRADE GOODS CARRIED. BOUGHT WHERE THEY ARE MADE, SOLD WHERE THEY PAY (11/7/26)

VAMILY ECONOMY [trade goods carried], rule 425(b) (Paolo 11/7: 'more of the jobs I've been asking you for months... I'm just
concerned you don't have it all recorded'), asks 196 and 197, rules 265(b) and 266 (Paolo 10/26, LOCKED: 'in battle Brothers,
you can buy goods from you know whatever type of settlement it is, bro there's so many like luxury goods that you can buy just
to move them around to different parts of the city and sell them off for higher income... I didn't know off the bat which city
has the best selling price of my goods'; 'even if there's just a stall at a settlement, I can still sell at it all... you'll
probably make less money'; records/BOHEMIA_PAOLO_TAPE_AT_EVERY_STALL_TRADE_GOODS_AND_THE_MAP_SHOWS_WHERE_IT_SELLS_10_26_26.md).

## MEASURED BEFORE

- The twelve goods, their makers and Battle Brothers' prices sat in records/target/bb/stall_prices.json (trade) since ECONOMY's
  Day 83 (records/BOHEMIA_ECONOMY_DAY_83_TRADE_GOODS_A_BATCH_A_WEEK_OR_THE_VALLEY_PAYS_A_TRADER_LIKE_A_FIGHTER_10_26_26.md),
  with the engine's tradeBuy / tradeSell / tradeStock (engine/bohemia_stall_prices.js).
- The map already knew what a stall pays for each good and marked the towns best first (WORLD TWO, slices/bohemia_his_map.js
  section 5, gate WHERE IT SELLS BEST), waiting for 'the stash's tap' to call mapSellMarks. Nothing called it.
- No stall sold a good. Nothing could ride in the stash, so no stall could buy one: ask 196 was HALF (gear only) and ask 197 was
  HALF (the map's half only). On the live demo: 0 goods on any shelf, 0 in any bag.

## BUILT

1. **THE STALL'S GOODS** (slices/BOHEMIA_SETTLEMENT_SCREEN.html, __TRADE_GOODS_CARRIED__). Under the supplies and tape, one line
   a good: the good this place makes (MADE HERE, the week's batch left) and every good he carries (NOT MADE HERE). Each line has
   the stall's BUY and SELL boxes side by side, the same boxes as the supplies: one tap lights a box and the strip says what it
   does, two quick taps (a right click on a computer) do it (rule 249). The strip names the best price he KNOWS elsewhere ('Best
   you know: MOB, +33'), from his map's own knowledge, never the valley for free.
2. **THE BATCH.** A maker turns out a batch a week (Day 83's pick: a camp 1, a town or a fortress 2, moved by the town's card);
   when it is gone the box says ALL GONE until next week. Kept per town and week (bohemia.trade.bought.v1).
3. **ONE GOOD, ONE SLOT.** A unit is one piece in the stash (engine tradeItem: kind 'trade', where it was bought, for what, on
   which day), Battle Brothers' one item a good, so carrying goods costs room (rule 266(a)). The file says it: trade.slot = 1.
4. **EVERY STALL BUYS IT** (rule 265(b)). The maker buys back for 15 in 100; every other town pays 110 in 100; a small place pays
   less (95 / 102 / 110 by size); never nothing (trade.sold_floor = 1, new in the file); never as much as the same stall charges.
   The shops' bags (arms, smith, armourer) price a good the same as the stall, so a good sells wherever he stands.
5. **WHAT HE SELLS SITS ON THEIR SHELF** (rule 248): the BUY box turns BACK at what they paid him, this visit; what he bought
   sells back at what it cost.
6. **THE CREW SCREEN SHOWS IT, THE MAP MARKS IT** (slices/BOHEMIA_ROSTER_SCREEN.html). A good in the bag wears its picture. One
   tap: where he bought it and for what, the two best towns he knows ('BEST: MOB +33, HOMELESS +28'), and the map's marks for it
   are lit (mapSellMarks). Two taps (a right click): the crew screen closes onto the map with the towns marked, best ringed, a
   question mark on towns he has seen and never priced. Nobody wears a good (equip refuses it). Selling the last one takes the
   marks away. The loot screen after a fight shows a good with its own picture too.
7. **THE PICTURES ARE HIS PACKS'** (rule 108: nobody draws a tile in code): twelve pack tiles copied as-is into
   slices/market_icons/g_<good>.png, each named in the data file (icon, icon_source) and in slices/market_icons/SOURCES.txt:
   charcoal the coal heap, casino linen the crate of rolls, timber the tied log bundle, copper wire the spool, turquoise the sack
   of blue stones, hides the strapped roll, coffee and chile the sack of red, salt the white-topped sack, candles the burned-down
   candles on the ground, pharmacy stock the pill bottle, runway cloth the sealed bale, pawnshop gold the stacked bars.
8. **A MODDER EDITS ONE FILE.** records/target/bb/stall_prices.json trade.goods: id, name, unit, units, what, worth, made_by,
   icon. Add a row, it is on its maker's stall, in the bag, on the map. The rules (made_here, not_made, stock, restock_days, slot,
   sold_floor) sit beside it with their sources.

## THE NUMBERS (a calm day, a stranger; every one from the file through the engine)

| good | maker (size) | buy at the maker | maker buys back | a camp pays | a town pays | a fortress pays | best carry |
|---|---|---|---|---|---|---|---|
| CHARCOAL | Homeless (camp) | 10 | 1 | 10 | 11 | 12 | +2 at a fortress |
| CASINO LINEN | Mob (fortress) | 15 | 2 | 14 | 15 | 16 | +1 at a fortress |
| MOUNTAIN TIMBER | Anarchists (town) | 18 | 2 | 18 | 20 | 21 | +3 at a fortress |
| STRIPPED COPPER WIRE | Trades (camp) | 21 | 3 | 22 | 24 | 26 | +5 at a fortress |
| TURQUOISE | Colorful (camp) | 25 | 3 | 27 | 29 | 31 | +6 at a fortress |
| HIDES | Remnants (fortress) | 33 | 4 | 31 | 33 | 36 | +3 at a fortress |
| COFFEE AND CHILE | Caravans (fortress) | 35 | 5 | 33 | 35 | 38 | +3 at a fortress |
| SALT | Blues (town) | 35 | 5 | 35 | 38 | 41 | +6 at a fortress |
| CANDLES AND INCENSE | Church (town) | 39 | 5 | 39 | 42 | 45 | +6 at a fortress |
| PHARMACY STOCK | Cartel (fortress) | 44 | 6 | 41 | 44 | 48 | +4 at a fortress |
| RUNWAY CLOTH | Network (fortress) | 51 | 7 | 48 | 51 | 55 | +4 at a fortress |
| PAWNSHOP GOLD | Reds (town) | 53 | 7 | 54 | 58 | 62 | +9 at a fortress |

Walked on the demo (phone and computer, the same both): copper wire bought at the Trades' camp for 21; the Mob's fortress paid 26
on a calm day (33 on its market day, the card the map remembered); the Homeless' camp 22. A town's cards and what it thinks of him
move every number (Day 83: an Allied company buys up to 15 in 100 cheaper and sells 15 in 100 dearer), which is how trade becomes
a real income late, as in Battle Brothers, while a batch a week keeps it under one routine killing job a day early (Day 83: 165 in
week one for a perfect trader, against 210).

## [bb] THE SCHOOL LINE

Battle Brothers: a good made here buys at 100 and sells back at 15; anywhere else it buys at 150 and sells at 110; the settlement's
size moves both (95 / 102 / 110); each good is one item in the stash; the shops restock every three days; nothing on the world map
says who pays best (his frustration). Ours keeps every one of its numbers, restocks the goods a batch a week (our legs are hours,
theirs days), and the map says who pays from what he has seen and heard.

## ANALOG HORROR

The goods are what a dead economy leaves: candles burned down and poured again, rings and teeth melted to bars, copper pulled out
of the walls of empty houses. Nobody makes anything new; they sell what is left.

## GATES (rule 13, by name)

- TRADE GOODS CARRIED (gates/trade_goods_carried_gate.js, new, in the suite): data D1-D3 and the planted fails M (a maker paying
  110, a camp paying more than a fortress, a stall paying nothing, a missing icon, a maker that is no town: each red); the live
  demo on the phone and the computer L1-L10, including L9 planted on the live page (the stall without the engine's tradeItem
  shows no goods and L1's check reads red). 15/0 on the phone, 15/0 on the computer.
- BUY VERSUS SELL 45/0. It was 44/1 on main before this round: S1 compared trading to 'the board's lowest pay', which became a
  10-battery walk when this lane's own job pay landed (rule 323 amended). The routine contract is now the cheapest KILLING job,
  floored at job_pay.json's floor_per_skull (30); the leg's meaning is unchanged.
- The pre-push pass on the files this round touched is in the commit message.

## LEFT, SAID PLAINLY

- A good he sold to a town that does not make it vanishes when he leaves; Battle Brothers keeps it on the shelf at its price
  (rule 248(b)'s 'after he leaves it is stock at the normal price'). Small; next round if he wants it.
- The map's marks clear on the last sale and on a tap of another piece; there is no button on the map itself to clear them
  (WORLD TWO's screen).
- The goods' names are drafts (draft:true, WORDS).
- His own camp's trader follower (CAMP TWO's plus('tradeGoods')) is not wired: it will add one to a maker's batch when CAMP reads it.
