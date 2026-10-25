# RUN TWO: THE WAGON AND THE SIX (10/25, [eyes: four currencies] + [every origin starts like itself], BUILT)

HIS WORDS (10/24, rule 164 item 2): "we have four different currencies in this game, you're only showing batteries, it's insane."
EYES (10/25, BUILD 10/25o): the bar carried the batteries alone, phone and computer, through two hours of play with buys, loot and a sale.
ECONOMY (records/BOHEMIA_ECONOMY_DAY_80_HOW_MANY_CURRENCIES_HIS_FOUR_ARE_BATTLE_BROTHERS_FOUR_AND_THE_GAME_COUNTS_ONE_10_25_26.md):
his four are Battle Brothers' (medicine, ammo, repair tools, food, then gold); the bar should carry six (BATTERIES, FOOD, WATER,
TAPE, MEDS, ROUNDS), and only one was a real number: the stall took a battery for water, meds and rounds and added nothing.

## WHAT IS BUILT (__THE_WAGON__)
1. **Every origin's own start, from the wiki.** Each origin page's Starting Funds table carries Tools, Ammunition and Medicine at
   High, Medium and Low funds (bb_all/<origin>; every origin's crowns match origins.json's, checked). Now in origins.json as
   `supplies` (TAPE, ROUNDS, MEDS by FULL, THIN, BARE shelves): A NEW CREW on full shelves 40 tape, 80 rounds, 30 meds; the Lone Wolf
   on bare 5 tape, 0 rounds, 3 meds; the fight pit 20, 0, 15.
2. **The wagon.** TUNING's food_days (a week of the bill in the wagon; the water truck 19): FOOD and WATER start at food_days times
   the company, in rations and jugs (a man eats one of each a night: the bill's per_man of 2 is one of each at the counter).
3. **One count each, the company's, in every frame** (bohemia.supplies.v1, seeded at the door with the roll, forgotten by NEW GAME).
   UI's bar reads it (one marked line in supplyCounts); the six stand from the first minute on the phone and the computer.
4. **The night eats the wagon first.** The map's bill (a RUN TWO block in RUN's map file) feeds each man a ration and a jug from the
   wagon; only what the wagon cannot give is bought in batteries, as before. Nights left count the wagon's nights, then the
   batteries at the full bill (A NEW CREW: 7 + 48 = 55). The fight pit's founding men are paid 6 a night each (TUNING).
5. **What you buy goes into its count**: at the stall a dose of meds +1, six rounds +6, a jug of water +1, a ration +1. **The loot's
   rounds go into ROUNDS** (LOOT ALL).
6. The hold on food and water now counts NIGHTS (the wagon is eaten at nightfall), like the batteries' hold: the bar never says
   DAYS (THE DAYS ONCE, his 'How many times ur gonna show how many days?').

## THE GATE
THE WAGON AND THE SIX (gates/the_wagon_and_the_six_gate.js) 9/0: C1 the file (all fifteen); C2 the six from the first minute on the
phone (290, 21, 21, 40, 30, 80); C3 a night eats 3 and 3 from the wagon and no batteries, an empty wagon is 6 batteries, 55 nights
left; C4 the stall by real taps (+1, +6, +1, +1, the map's bar says so); C5 LOOT ALL's 3 rounds 80 -> 83; C6 the pit's 18 a night, the
wolf's bare start; C7 the computer; C8 NEW GAME forgets it, nothing threw.
RE-AIMED, each keeping what it protects: THE SIX ON THE BAR S2 (the six counted from the first minute) and S5 (the hold says NIGHTS),
THE DAYS ONCE (the nights are the bill's own count; the glass carries every count the game keeps; still fits at 320, 59/0), THE
MAP'S BAR (the glass in ECONOMY's order), MONEY TEACHES (its wagon is empty: it holds the batteries' bill, 7/0).

## NOT DONE HERE (the verbs that spend them, Battle Brothers' way: one verb each)
- ROUNDS by the shot from the company's stock (COMBAT: today every gun is loaded full for a fight).
- MEDS a point a wounded man a day, no meds no healing (the crew screen's day; Battle Brothers' Medical Supplies page).
- TAPE by the fight's repairs (the armour's wear between fights is not kept yet).
- The town keeps its own top bar (batteries only); rule 190's one HUD is UI's.
Each has a NOTE on its owner's board. Until a verb lands, its count only rises: an honest count of what the company holds.

[bb Battle Brothers: crowns, food (as days), tools, medicine, ammunition on the bar; you never spend a supply, what you did spends it]
[analog horror: six worn props on cracked glass, the numbers going down at nightfall]
