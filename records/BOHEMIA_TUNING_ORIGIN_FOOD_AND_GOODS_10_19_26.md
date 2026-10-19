# TUNING [origin food and goods]: what each start carries in the wagon, priced (10/19)

RESEARCH ONLY (rule 38g). DRAFT. Nothing in the game reads this page or its bank. Every item and worth read off the wiki dump: the fifteen origin pages' Resources table, the Provisions page (base worth for 25 units, spoil days), the Trade page and the Treasures page. Ten crowns a battery.

## The wagon, origin by origin

| origin | Battle Brothers origin | men | food (crowns) | days it feeds them (2 a man a day) | first to spoil | other goods (crowns) | the wagon in batteries | start power (mid) | start power with the wagon |
|---|---|---|---|---|---|---|---|---|---|
| THE CREW THAT IS LEFT | Rebuilding a Company | 3 | 2x Ground Grains (100) | 8.3 | 7 days | none | 10 | 227 | 237 |
| A NEW CREW | A New Company | 3 | 2x Ground Grains (100) | 8.3 | 7 days | none | 10 | 267 | 277 |
| UP FROM HENDERSON | Southern Mercenaries | 3 | 2x Rice (120) | 8.3 | 8 days | none | 12 | 267 | 279 |
| THE WATER TRUCK | Trading Caravan | 2 | 1x Bread (65), 1x Wine (110), 1x Mead (90) | 18.8 | 8 days | 1x Amber (260), 1x Cloth Rolls (140), 1x Dyes (400), 1x Furs (300), 1x Salt (340) | 171 | 158 | 329 |
| THE BLOCK WATCH | Peasant Militia | 12 | 4x Ground Grains (200) | 4.2 | 7 days | none | 20 | 208 | 228 |
| THE SCAVENGERS | Band of Poachers | 3 | 1x Cured Venison (95) | 4.2 | 12 days | 1x Furs (300) | 40 | 227 | 267 |
| THE PROMISE KEEPERS | Oathtakers | 2 | 1x Ground Grains (50) | 6.3 | 7 days | 1x Young Anselm's Skull (no price page), 1x Battle Standard (no price page) | 5 | 259 | 264 |
| THE DESERTERS | Deserters | 3 | 2x Ground Grains (100) | 8.3 | 7 days | none | 10 | 227 | 237 |
| THE RAIDERS | Northern Raiders | 4 | 1x Goat Cheese (85), 1x Smoked Ham (95) | 6.3 | 11 days | 1x Silverware (350), 1x Silver Bowl (490), 1x Warhound (no price page) | 102 | 559 | 661 |
| THE LAB RATS | Anatomists | 3 | 1x Mead (90), 1x Smoked Ham (95) | 8.3 | 11 days | 1x Greenskin Research Notes (no price page), 1x Ledger of the Dead (no price page), 1x Tome of Beasts (no price page), 1x Book of Legends (no price page), 1x Apotheosis potion (no price page) | 19 | 297 | 316 |
| THE FAITHFUL | Davkul Cultists | 4 | 1x Ground Grains (50) | 3.1 | 7 days | none | 5 | 276 | 281 |
| THE DEBT COLLECTORS | Manhunters | 6 | 3x Rice (180) | 6.3 | 8 days | 1x Company Ledger (no price page) | 18 | 254 | 272 |
| THE HUNTERS | Beast Slayers | 3 | 1x Ground Grains (50) | 4.2 | 7 days | 1x Witch Hair (no price page), 2x Unusually Large Wolf Pelt (no price page), 1x Night Owl Elixir (no price page), 1x Wardog (no price page) | 5 | 327 | 332 |
| THE FIGHT PIT | Gladiators | 3 | 1x Wine (110), 1x Dried Lamb (105) | 8.3 | 13 days | none | 22 | 520 | 542 |
| THE LONE WOLF | Lone Wolf | 1 | 1x Smoked Ham (95) | 12.5 | 12 days | none | 10 | 368 | 378 |

## Findings

1. **NO ORIGIN STARTS WITHOUT FOOD IN BATTLE BROTHERS** (every page lists provisions). The thinnest wagons: THE FAITHFUL 3.1 days for 4; THE BLOCK WATCH 4.2 days for 12; THE SCAVENGERS 4.2 days for 3; THE HUNTERS 4.2 days for 3. The fattest: THE WATER TRUCK 18.8 days; THE LONE WOLF 12.5 days; THE FIGHT PIT 8.3 days. Battle Brothers' food runs out in days, not weeks: the first market is the first hour's first errand.
2. **EVERY ORIGIN OF OURS STARTS WITH NO FOOD, AND NOBODY EATS.** records/target/bb/origins.json has no provisions or goods field on any of the fifteen; the demo charges no food (the stash engine, engine/bohemia_stash.js, carries Battle Brothers' two a man a day and terrain multipliers, and only the stash screen page loads it). So the answer to "which origin has no food" is all fifteen of ours, and none of Battle Brothers'.
3. **THE WAGON MOVES START POWER FOR TWO ORIGINS ONLY: THE ONES CARRYING GOODS TO SELL.** THE WATER TRUCK +171 batteries; THE RAIDERS +102 batteries; every other wagon is worth 40 batteries or less. The order of the labels does not change: THE RAIDERS 661, THE FIGHT PIT 542, THE LONE WOLF 378, THE HUNTERS 332 lead.
4. **UNPRICED (no base worth on the three price pages, so left out of the sum):** THE PROMISE KEEPERS: 1x Young Anselm's Skull, 1x Battle Standard; THE RAIDERS: 1x Warhound; THE LAB RATS: 1x Greenskin Research Notes, 1x Ledger of the Dead, 1x Tome of Beasts, 1x Book of Legends, 1x Apotheosis potion; THE DEBT COLLECTORS: 1x Company Ledger; THE HUNTERS: 1x Witch Hair, 2x Unusually Large Wolf Pelt, 1x Night Owl Elixir, 1x Wardog. The dogs are fighters (a Warhound, a Wardog), the books, skull and banner are origin quest items, the potions are rare; none is for sale in a market.

## ROUTED

- PEOPLE [origins] + ECONOMY: a provisions and goods field on each origin (data, not code), from the table above in our skins; the stash (engine/bohemia_stash.js) loaded by the demo so food is eaten. Rule 117: our start may carry more days than Battle Brothers' (it is the easier end), never fewer.
- TUNING table: origin.food_days and origin.wagon_batteries as derived rows.

Bank: banks/BOHEMIA_TUNING_ORIGIN_WAGON_10_19_26.json. Tool: tools/bohemia_tuning_origin_wagon.js.

[bb Battle Brothers starts every company with a few days of grain and makes the first market the first errand; the wagon is a clock.]
[analog horror: a wagon of ground grain that spoils in seven days; the smell is the clock. Named for SOUNDS, not moved.]
