# TUNING 10/26: HEALING ON OUR CLOCK. OUR FIGHTS SIT 5.2 TIMES CLOSER THAN BATTLE BROTHERS', SO WE HEAL 5 TIMES FASTER (rule 264; research only)

HIS WORDS (records/BOHEMIA_PAOLO_YOUR_MAIN_GUY_LEADS_YOU_MAKE_HIM_FIRST_AND_HEALING_ON_OUR_CLOCK_10_26_26.md): "please do research on
how long it takes battle Brothers... to make sure you get healed and your equipment gets repaired because keep in mind the timing
that's natural in battle Brothers is not the same natural as it is in Bohemia... because the quest are so close kind of to the
settlements... I feel like one day was equal to like three or four days in battle Brothers... some of the things have to be a lot
quicker for us or we gotta be able to like quickly care about healing more often." Rule 264(b): scale our healing and mending per
map hour so the RATIO of time-to-heal to time-between-fights matches Battle Brothers', measured on our real trips. 264(f): the
coordinator's default x4 (records/BOHEMIA_COORDINATOR_THE_PACE_MATH_OUR_DAY_AGAINST_BATTLE_BROTHERS_10_26_26.md), TUNING moves it to
the measured ratio. The rows are the one table's section T; the tool tools/bohemia_tuning_healing_on_our_clock.js; the bank (draft:true,
nothing reads it) banks/BOHEMIA_TUNING_HEALING_ON_OUR_CLOCK_10_26_26.json.

## 0. THE ANSWER
1. OUR GAP BETWEEN FIGHTS, MEASURED ON OUR REAL TRIPS: 4.6 game hours (5.2 fights a 24-hour map day). Every job the valley knows
   (the 44 job rows and the board's four) offered at all 14 home bases, 602 trips, each costed by the game's own trip (the map's road,
   the map's clock, the carts' pace, the way home when he is paid at home) over the fights the job brings (each by its chance).
2. BATTLE BROTHERS' GAP: about a day, 24 map hours (12 to 48).
3. THE RATIO: 24 / 4.6 = 5.2. Proposed: our healing and mending per map hour x5 (the coordinator's x4 moves to x5): 5 hit points an
   hour on the march, 10 camped; armour 15 points a piece an hour, 30 camped; the cook +5; one TAPE still mends 15 (the cost, not the
   speed); the surgeon's day and the injury days unchanged. With it a typical fight's wounds take the same share of the gap to the
   next fight as in Battle Brothers: hit points 1.17 gaps against its 1.13, armour 0.51 against 0.49. At x4 it is 1.47 and 0.63.
4. THE FINDING THAT PROVES US WRONG (beyond the default): his 30 to 40 days of a struck-down man's fresh wound (rule 234) are 156 to
   208 of OUR fights at this pace, against 30 to 40 fights for the same days in Battle Brothers. His number stands (it is his); the
   clinic's half and the fade carry it. Named for the coordinator.

## 1. BATTLE BROTHERS (the wiki copy, reference/library/grok/wiki/PAGES_ALL.tar.gz, and the coordinator's sources)
- THE CLOCK: "A complete day in-game is about 1 minute 45 seconds in real time... The passage of time is also halted while in town,
  while in an event dialogue, or during combat" (bb_all/0828). Camping does not speed it.
- THE RATES: hit points 1 an hour on the march, 2 camped (bb_all/0160); armour 3 points an hour, doubled camped, one tool for 15
  (bb_all/2014); temporary injuries 1 to 9 days with a medicine a day (bb_all/1936, 1253).
- THE GAP: contracts are days: an escort quoted at "an approximation of the time required (e.g. two days)" (bb_all/2107 Update
  1.2.0.17), a patrol limited to ten days (bb_all/1415), privateering "return after 5 days" (bb_all/1604); the developers sped the
  clock up "to help remedy the longer distances" (bb_all/0626). A veteran brother logs 179 to 306 battles over a 350 to 400 day run
  (the coordinator's record, from sevastromo and the Steam forums): about ONE FIGHT A MAP DAY, often less early.
- A TYPICAL FIGHT'S WOUNDS AT BATTLE BROTHERS' RATES (our live fight is Battle Brothers' rules; 600 AUTO fights, 423 won, rule 234's
  reading, banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json): hit points whole in 27 hours on the march (median), armour in 12, the
  whole company in 36. Against a 24-hour gap: hit points 1.13 gaps, armour 0.49 gaps. So in Battle Brothers a man is MOSTLY healed by
  the next fight on the march, and camping makes him whole: that is the feel to keep.

## 2. OURS, MEASURED ON THE LIVE DEMO (BOHEMIA_DEMO.html, the game's own BohemiaJobKinds.trip and fightsOf)
| the jobs | trips | the gap between fights | fights a 24-hour day |
|---|---|---|---|
| every job, every home base | 602 | 4.6 h | 5.2 |
| only the jobs with a sure fight | 462 | 3.4 h | 7.1 |
| only the trips under a day | 585 | 4.1 h | 5.9 |
| the town board's four | 112 | 2.9 h | 8.3 |
By kind (the trip there, and back when paid at home; median, p90): clear a crew 0.9 h (1.3), clear a camp 1.3 h (13.6), recover and
return 2.4 h (3.9), hunt 2.7 h (4.4, three packs), find a person 3.0 h (4.3), find a place 4.0 h (22.6), patrol 4.3 h (6.8), haul a
caravan 4.4 h (21.3), carry 9.9 h (11.4). By home base the gap runs 3.7 h (the Anarchists) to 7.2 h (the Remnants). The road's
chance fights add nearly nothing today (WORLD measured 0.0038 an hour). NOT COUNTED: the walk from where a paid-there job ends to the
next board, and time standing still (the map's clock stops then): so 4.6 h is the moving gap, and the true gap is a little longer.
The coordinator's estimate (3 to 6 hours, about 5 fights a day) is CONFIRMED.

## 3. THE SCALE (the one table's section T)
| our rate per map hour | Battle Brothers | x4 (the coordinator's default) | x5 (PROPOSED) | x6 |
|---|---|---|---|---|
| hit points, on the march / camped | 1 / 2 | 4 / 8 | 5 / 10 | 6 / 12 |
| armour, a worn piece, on the march / camped | 3 / 6 | 12 / 24 | 15 / 30 | 18 / 36 |
| a typical fight's hit points, in our gaps (BB 1.13) | 5.9 | 1.47 | 1.17 | 0.98 |
| a typical fight's armour, in our gaps (BB 0.49) | 2.5 | 0.63 | 0.51 | 0.42 |
| a man from ONE hitpoint (the median 57), on the march / camped | 56 h / 28 h | 14 h / 7 h | 11 h / 5.6 h | 9 h / 4.7 h |
| the same, in our gaps on the march (BB 2.3) | 12.2 | 3.0 | 2.4 | 2.0 |
WHY x5: it is the measured 5.2 rounded to a number a person keeps in his head, inside 4 percent of Battle Brothers' share on both
hit points and armour, and on the easier side of the coordinator's x4 (rule 117: start easier). x6 would heal a typical fight's hit
points before the next fight on the march, which Battle Brothers never does: the reason to camp would go.
WHAT DOES NOT SCALE: one TAPE mends 15 points (the price of mending, not its speed); the cook's +1 scales with the rest (+5); the
blacksmith's x1.2 and x0.8 are already shares; the surgeon's one day and the struck-down fresh wound's 30 to 40 days stay his and
CAMP's; a temporary injury from a hit (1 to 9 Battle Brothers days) would, by the same ratio, be its days / 5 in ours when the camp
carries them between fights (today the fight's hit injuries end with the fight; a NOTE for CAMP).

## 4. WHAT IT DOES ON THE GLASS (for CAMP and rule 259)
At x5 a won fight's wounds are whole in about 3.6 camped hours (18 / 5), which is 1.8 seconds on the camp's clock (an hour a beat,
slices/BOHEMIA_CITY_WORLD.html campHour), the 1-hitpoint man 2.8 seconds. Rule 259 wants him to SEE his men heal and mend at camp. If
1.8 seconds is too quick to see, the camp's clock is the lever, not the rates: at the map's own pace (about 4.6 beats an hour on dirt,
Battle Brothers' own way, its camp never speeds the clock) the same heal is 8 seconds and the game time it costs is unchanged.
THE ECONOMY UNDER IT (ECONOMY's, named, not measured here): a night's food and a man's wage are counted by the game day, and our day
holds 5 fights to Battle Brothers' 1; a heal that costs a fifth of the hours costs a fifth of the food and wages.

## 5. HIS 30 TO 40 DAYS (rule 234), IN FIGHTS
At 5.2 fights a day, a fresh wound of 30 to 40 days lasts 156 to 208 fights; the same days in Battle Brothers hold about 30 to 40.
The fade (it halves by the middle day) and the clinic (half at once, 6 to 16 batteries proposed) carry most of it, and he chose the
days. TUNING keeps them and says so; if the coordinator reads 'days' as felt time, Battle Brothers' felt equivalent is 6 to 8 of ours.

## 6. NOT MEASURED, SAID
The true gap with the stops and the walks between boards (a long play on the demo, EYES' ten fights in a row, would give it); a
phone's CPU; the hold-defend waves (one place, several fights, left out); whether fightsOf's chance weights match what the map deals
(WORLD's gate reads them).

## ROUTED
- CAMP [healing on our clock]: x5 in condition.json (hp_per_hour_march 5, hp_per_hour_camp 10, cook_hp_per_hour 5, armour_per_hour 15,
  camp_repair_mult 2 unchanged; durability_per_tape 15 unchanged); the camp's clock if 1.8 s is too quick to see. (NOTE.)
- WORLD: the gap is measured with your trip() and fightsOf() on all 14 bases (your NOTE's ask answered). (NOTE.)
- ECONOMY: food and wages per game day under a five-fight day (named). (in the CAMP NOTE's record; no row.)
[bb the clock: Battle Brothers fights about once a map day and heals 1 an hour, so a man is mostly whole by the next fight; ours
fights every 4.6 hours, so ours heals 5 an hour to stand in the same place]
[analog horror: the clock that heals them runs faster than the one that pays them, and nobody on the street can tell you why]
