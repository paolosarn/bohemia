# ORIGINS -- EACH ORIGIN ITS OWN (11/7/26, BUILD 11/7x)
Rule 427(c), asks 103 and 233; RUN THREE's row [each origin its own] (step 1: records/BOHEMIA_RUN3_EACH_ORIGIN_ITS_OWN_HOW_BATTLE_BROTHERS_DOES_IT_10_26_26.md),
RUN TWO's row [eyes: the god is too heavy] (EYES 10/25w k02 to k09). Session origins-01gkdyuu.

His words: "what makes each origin unique, unique shit you can buy, how their shit looks... it all looks the same right now... it's gonna be more
personalized" (10/26, rules 236 and 287); "every origin starts like itself and gets personal: its own look, things only it can buy, its own way of
playing (Battle Brothers' origins, our swag); the Lone Wolf a gilded god with three stars in the stats that matter, really felt in the fight" (11/7,
through the coordinator).

## MEASURED BEFORE
- Every origin's men wore the same people's clothes and the same placeholder armour; the start town sold what every town sells; of the fifteen origins'
  Battle Brothers rules only the company, the caps, the start money, the south start and the fight pit's wage ran (RUN THREE's step 1).
- THE LONE WOLF, rolled as the door rolls him, alone on the live fight (slices/BOHEMIA_FIGHT.html's own rules headless, AUTO, 30 seeded fights a row,
  the same seeds before and after; the bench: tools/bohemia_tuning_the_whole_grid.js engine):

| day-one fight      | won before | won after | his health left before -> after | rounds before -> after |
|--------------------|-----------:|----------:|--------------------------------|------------------------|
| 2 road thugs       | 30 of 30   | 30 of 30  | 97% -> 99%                     | 4.8 -> 3.8             |
| 3 road thugs       | 30 of 30   | 30 of 30  | 93% -> 98%                     | 8.3 -> 5.3             |
| 4 road thugs       | 30 of 30   | 30 of 30  | 89% -> 95%                     | 10.6 -> 7.9            |
| 6 road thugs       | 16 of 30   | 26 of 30  | 42% -> 72%                     | 10.2 -> 9.7            |
| 2 dire wolves      | 28 of 30   | 30 of 30  | 82% -> 96%                     | 9.4 -> 7.4             |
| 3 dire wolves      | 14 of 30   | 26 of 30  | 43% -> 76%                     | 10.7 -> 10.3           |
| 2 hyenas           | 30 of 30   | 30 of 30  | 93% -> 96%                     | 7.8 -> 6.2             |

  His breath in the fight 53 of 117 -> about 61 (59 to 64 a roll) (the heaviest riot kit weighed 58 to 62; the gilded pair weighs 44, before Brawny). Swings a turn
  1.24 to 1.47 -> 1.33 to 1.59. EYES' 'swings twice and stands': WINDED ON 0 OF 377 TURNS against two dire wolves and two hyenas now (a turn with
  no swing is now a turn spent walking to a beast, 13 to 17 in 100, or a beast out of reach); the door's 'If you go down, it ends' and the game
  going on disagreed (the main character never dies, third votes 9/27).

## WHAT IS BUILT
THE DATA A MODDER EDITS: records/target/bb/origins.json, a 'personal' block on each of the fifteen (look, shelf, rule with Battle Brothers' words and
its wiki page, 'does' in fifteen named levers); records/target/bb/armory.json, thirty rows with 'origin' (the file a modder adds an origin's piece in).
THE ENGINE: engine/bohemia_origin_ways.js (loaded by the alpha and the demo; every frame reads the top page's): current(), does(), fight(),
reserved(), home(), shelfFor(). Marked __EACH_ORIGIN_ITS_OWN__ wherever the game reads it.

1. ITS OWN LOOK (rule 337: the art ships with it). Thirty pieces of origin gear, each ITS OWN MODEL: signed distances in CHARACTER's head and trunk
   frame, meshed, rendered through DIRECTION's master rig in Blender (bpy 4.2), packed into slices/wear beside every piece already there
   (tools/bohemia_origins_their_own_gear.py, through COOK's every-armour-its-own pipe, imported, never edited). Every man of every origin walks in
   wearing his origin's own (the door kit), and the wear engine draws it on him wherever he is drawn (the crew card, the fight, the map, the camp,
   the portrait). The fifteen: the gilded full riot armour and helm (the Lone Wolf); the dead crew's black-band vest and names-taped hard hat; the
   new crew's surplus olive; up from Henderson's road-dust vest with the 95's shield and a sun wrap; the water truck's hi-vis rubber and white hard
   hat; the Block Watch's denim with an orange armband and a house number, and an orange bandana; the scavengers' hardware-store apron vest with a
   tool belt and a headlamp hood; the promise keepers' black funeral coat with a white lily and a ribboned helmet; the deserters' olive carrier with
   the patches torn off and a steel pot; the raiders' leather hung with keys, tags and other crews' patches, and a red hand on the helmet; the lab
   rats' lab coat gone brown with a badge and a respirator; the faithful's ash robe with the screen's test circle on the back and a bone cowl; the
   debt collectors' black suits and their debtors' numbered orange; the hunters' hide-patch vest with a cord of teeth and a dire wolf fur ruff; the
   fight pit's oxblood satin robe and red sparring headgear.
2. THINGS ONLY IT CAN BUY. Those pieces sit first on the armourer's shelf of the origin's HOME town (the town the new game opens in, rule 236; else
   the first town the game opens) and on no other shelf; no loot and no hire carries them (the arena's reserved() way). Numbers: the armory's own
   sum, the mean of the two Battle Brothers rows around what the men wore before, so TUNING's measured starts barely move; the Lone Wolf's two are
   Battle Brothers' own golden named pieces (Golden Scale Armor: 264 to 300, weight 28; Golden Feathered Helmet: 264 to 300, weight 16).
3. ITS OWN WAY (Battle Brothers' lever, our swag), each running where the game already decides it:
   | origin | rule | Battle Brothers | where it runs |
   |---|---|---|---|
   | THE LONE WOLF | THE GILDED GOD: Lone Wolf (+15% skill, defence, nerve with nobody within 3 tiles) and Fearsome on top of his levels, the Player Character's +10 resolve | Lone Wolf origin, Player Character, the Lone Wolf and Fearsome perks | the door's roll; the fight's own perks |
   | THE WATER TRUCK | TRADER: buy 10% cheaper, sell 10% dearer | Trading Caravan | the town's prices |
   | THE BLOCK WATCH | LOWBORN ONLY: no rare man at the post | Peasant Militia | the post's rare chance |
   | THE SCAVENGERS | THEY COUNT: every crew reads as its number | Band of Poachers | the map's party word |
   | THE DESERTERS | FIRST TO ACT in round one | Deserters | the fight's round order |
   | THE RAIDERS | STRIP THE DEAD: a missed piece gets a second look | Northern Raiders | the spoils |
   | THE LAB RATS | NOT FIGHTERS: never confident | Anatomists | the fight's nerve |
   | THE FAITHFUL | THE FAITH HOLDS: never flee | Davkul Cultists (the fanatics' resolve); ours | the fight's nerve |
   | THE PROMISE KEEPERS | THE STANDARD: a tenth of the bearer's resolve to his men within 4 tiles | Oathtakers' Battle Standard | the fight's nerve |
   | THE DEBT COLLECTORS | THE WHIP: a debtor near a collector stops at wavering | Manhunters, Crack the Whip | the fight's nerve |
   | THE HUNTERS | BEAST SLAYERS: towns 10% worse, an extra hide off a kill half the time | Beast Slayers | the town's prices; the kill's goods |
   | THE FIGHT PIT | PAID FIGHTERS: 6 batteries a man a night, roster 12 | Gladiators | the map's bill (it ran before) |
   | UP FROM HENDERSON | UP THE 95: starts in the south | Southern Mercenaries | the map's start (it ran before) |
   | A NEW CREW | A CLEAN START: no rule, the control | A New Company ('without any particular advantages or disadvantages') | none, on purpose |
   | THE CREW THAT IS LEFT | THE NAMES ON THE TAPE: no rule of its own yet | Rebuilding a Company (the Hoggart hunt) | OWED: the man who broke the old crew, a job of its own (WORLD) |
4. THE TRUE LINES. The Lone Wolf's door: 'Just you, in gold. Lose a fight and you wake up in the nearest town.' A one-man company's wipe: 'Somebody
   drags you to the nearest town. You wake up alone, your gear still on you.' (was 'they have your men and your gear').

## THE GATE
gates/each_origin_its_own_gate.js (EACH ORIGIN ITS OWN), in the suite. O1 the file; O2 their own art (30 pieces, eight facings, the rig's run, never
the placeholder); O3 the numbers and the door (1,100 men in 20 games each, all in their own but the raiders' monk); O4a-g every rule against its control
without the rule (first to act 10 of 10 vs 0 of 10; confident 0 vs 178; fled 0 vs 40; past wavering 0 vs 15; nerve held 29.0% vs 24.7% beside the
standard; 1,565 pieces vs 1,406 off 400 dead; the kill's goods read the 50); O5 the gilded god (200 rolls, 19 of 20 against two and three dire wolves, breath 64,
winded 0); O6 the demo on the phone (the water truck opens in its home town, its two pieces first at the Trader's price, another town sells none, its men
fight in the hi-vis vest drawn as its own model, the scavengers' 'EXACTLY 5' vs 'SOME', the Block Watch's rare chance 0 vs 0.06); O7 the demo on the
computer (the Lone Wolf gilded with his gifts, the true lines); O8 nothing threw. PLANTED FAIL: ORIGINS_PLANT=1 takes the deserters' rule and the hi-vis
vest's model out of the gate's copy: O1, O2 and O4a go red, exit 1 (run 11/7).
Re-aimed: gates/every_origin_starts_like_itself_gate.js W1, W2, W8 (the Lone Wolf's body and head are his gilded pieces, his resolve +10, every man's
body and head the file's door kit).

## OWED, SAID
- THE PEOPLE UNDER THE GEAR are still the company's twelve rolled people for every origin: the gear is the look. A crew's own BODIES (a lab rat's face,
  a deserter's haircut) are COOK THREE's and CHARACTER's (NOTE).
- The forced systems, each a row of its own: the oaths (promise keepers), the sacrifice (the faithful), the potions (the lab rats), the whip as a
  button and the debtors' ratio (the debt collectors); the dead crew's man who broke them (the Hoggart). None is built.
- The hunters' 'see tracks from further away' and the poachers' map speed (111 for 105) are not built: the map's clock has no one place a speed
  sits (measured: the travel step reads the pad's beat, not a pace).
- UI: the crew screen still shows his fatigue before his armour (EYES' 118 vs 55; now 117 vs about 61 (59 to 64 a roll)). NOTE on UI's board.
- EYES plays the Lone Wolf's first three jobs (the row's DONE WHEN).

[bb Battle Brothers makes an origin its own with six levers (who joins, money, standing, one forced system, small edges, content only it meets);
thirteen of ours now pull one that runs, the plain start pulls none on purpose, and the forced systems wait as rows of their own.]
[analog horror: every crew walks in wearing the night the dollar died: the gold rubbed through where he was hit, the patches torn off, the screen's
test circle on a robe, the names of the dead on black tape.]
