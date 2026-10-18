# THE SCREENS AROUND THE FIGHT, IN THE ONE TABLE (TUNING, 10/18/26)
# Row: TUNING [the settlement's numbers] THE-SAME-SEED-FOR-THE-SCREENS-AROUND-THE-FIGHT, from [the one table seeded] s4.
# Rule 21 (fight-gets-deep law s4): every number a player feels in ONE table. Rules 38g and 88: research only, a page, no sheet.
# Rule 113a: TUNING reports to COMBAT. Nothing in the game was touched; every finding below is ROUTED.

READBACK [the settlement's numbers]: I read this as: read every felt number the screens around the fight type into their
code (the settlement screen, the roster, the hire roll, the starting crew, the camp staff), each with its source or 'no
source but the code' and an owner, into the one table's typed section; done means section C holds them and a page the
lanes cite. Done.

## 1. THE ANSWER FIRST
- 48 felt numbers typed on five screens, each read off the live file by a pattern that must match exactly once and
  capture the listed value (tools/bohemia_tuning_screens_seed.js; a changed screen prints DRIFTED, proven by flipping
  one value to 31: it printed "the value is now 30"). 0 drifted on main at 0367670.
- By screen: the settlement screen 32, the hire roll (engine/bohemia_goodbros.js) 6, the starting crew
  (engine/bohemia_roster.js) 4, the roster screen 3, the camp staff (engine/bohemia_followers.js) 3.
- 17 of the 48 ALREADY SIT IN THE TABLE UNREAD: the sell-back curve, the ten-to-one rate and the floor, the contract
  pay anchor, the clinic's 20 and 0.2 and its halving, the 60/30/10 star odds (typed twice), the veteran XP formula and
  level 11, the roster cap of 20, the hiring formula. 10 have no source but the code. 6 are his rulings over the wiki
  (EVERYTHING COSTS ONE on the stall, the barber, the yard and the build; bought once on the wage).
- The one table is now 208 rows (was 160): section C holds 55 typed numbers (was 7). The fight's 153 rows are
  unchanged in value; their line numbers moved with the fight file since 10/17 and were re-read.
- Read FROM a data file, so not typed (and not rows here): the place's traits (records/target/settlement_traits.json:
  price and stock multipliers, the 0.7 roll), the injury rows' heal days, the XP level table and the star gains the
  roster's levelUp() reads, and the scavenge odds (engine/bohemia_scavenge.js: the share of the block left, a ratio of
  two counts, not one number typed). Those screens are clean where they read.

Table: records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md section C. Bank: banks/BOHEMIA_TUNING_THE_SCREENS_SEED_10_18_26.json
(draft:true, nothing reads it). Page (VOTE): slices/BOHEMIA_TUNING_THE_NUMBERS_AROUND_THE_FIGHT_10_18_26.html.

## 2. THE FINDING THAT PROVES US WRONG: A HIRED MAN LEVELS WORSE THAN BATTLE BROTHERS' MAN
The wiki's Talents page (bb_all/1926_Talents.txt), verbatim: "When you hire a new brother, he will randomly have a series
of stars next to three of his Attributes ... 60% ... 30% ... 10%", and "A talent increases the additional attribute points
available upon level-up. 1 star increases the minimum by 1, 2 stars by 2 and 3 stars also increase the maximum by one."
- The hall's man (engine/bohemia_goodbros.js generate()): stars on ONE stat (starredStatFor), and the star is applied to
  his STARTING roll (lo += 1 or 2, hi += 1 with three), the level-up rule used on the hire roll.
- The starting crew (engine/bohemia_roster.js): stars on ONE TO THREE stats (n = 1 + floor(R*3)), each as likely.
- The level-up (bohemia_roster.js levelUp) reads stat_gains_by_stars from the table correctly. So the reader is right and
  the writer is wrong: a man from the hall carries one talent where Battle Brothers gives three, so on two of the three
  stats Battle Brothers would raise faster he gains the no-star range every level. Over ten levels that is the depth his
  9/27 words asked for ("rewarding your own knowledge and skill": picking the man with the right stars) cut by two thirds,
  and the starting crew and the hall's men roll by two different rules.
- The 60/30/10 split is typed in both files (0.60/0.90 and .6/.9); experience.talent_star_odds holds it unread.

## 3. TWO MORE, SMALLER, BOTH MEASURED
- CAMP STAFF ARE FREE. The hall's button: 'Take the cook on' with '1 battery a night'. The click sets S.hired and posts
  'hire'; it debits nothing, and no host (the city world, the loop) charges on 'hire' or at night. The staff's own line
  (engine/bohemia_followers.js) says "for 200 batteries, once" (scout and lookout 250, blacksmith 300, paymaster and
  surgeon 350, all tuned:false), and the city's old companion road DOES charge that once through hirePrice(). Three
  prices for one man on two doors, and the door the demo uses charges zero.
- THE SOURCED DOOR EXISTS AND NO SCREEN WALKS THROUGH IT. engine/bohemia_pricetable.js (with price_table.json) computes
  sellFraction(tier, relation), buyFraction(relation), hireCostRange(background, level) and contractPayBatteries(heads)
  from the wiki's own numbers; only the MODS schema page loads it. So the screens type their own: SELL_CUT 1/7 (close to
  the town's 0.1364, but one number where the wiki gives camp 0.109 to city 0.177 by relation), no buy markup at all, and
  the hire prices from the Game Guide's OBSERVED ranges, which backgrounds.json itself says "include equipment and level,
  not the base". With the kit the hall hands each man, the wiki's formula (base 30 to 150 + 1.25 x gear, level 1) tops out:
  farmhand 29 batteries (ours up to 41), thief 27 (ours 45), militia 49 (OURS 225, 4.6 times). A 225-battery militiaman
  is two and a half three-skull jobs (90 each).
- Two small data-versus-screen splits: market day adds TWO men at the posts while settlement_traits.json says recruits +1;
  the board holds TWO contracts while the wiki's Contracts page says "You may only have one active contract at a time"
  (bb_all/0441_Contracts.txt). Neither is wrong by itself; each is a twist nobody wrote down, and a twist is said.

## 4. [bb] HOW BATTLE BROTHERS DID IT
Every one of these numbers lives in one place in Battle Brothers (the settlement's own scripts read the world's
difficulty and the faction relation for every price; the recruit roll is one function for every hire, with three
talents always). Ours split the same numbers across five files, two of which disagree on the stars. The wiki gives no
per-skull contract curve and no retinue price; those two stay 'TUNING owns the curve' and 'tuned:false', named as such.

## 5. [analog horror]
Numbers carry no look; the one tie is the bar's night trim (0.5, SOUNDS'): the place half as loud after dark is the quiet
that the genre's dread lives in, and it is a typed number with no row. Named, not moved.

## ROUTED (research only; nothing built by this lane)
- PEOPLE (engine/bohemia_goodbros.js) and RUN TWO (engine/bohemia_roster.js): stars on three stats, read from
  experience.talent_star_odds, applied to level-ups only (section 2); one recruit roll for the hall and the start.
- RUN TWO and ECONOMY: the camp staff's price on the hall (charge hirePrice() once, or rule 'free' and say so); the
  screens load engine/bohemia_pricetable.js for the sell-back, buy price and hire range; the clinic's 20/0.2/0.5 read
  from injuries.json in ONE function (it is typed twice today, roster and settlement).
- COMBAT (the lead, rule 113a): the table's section C is the list of every felt number outside the fight's one door.
- MODS: the 48 rows are the screens' half of 'nothing live reads content that is not in a data file'.
- WORLD: contract slots two versus the wiki's one, and offers by size, are its call with RUN TWO.
- In VOTE: one line, gray (a research page).
