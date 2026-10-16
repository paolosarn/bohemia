# TUNING ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
TUNING (tuning-f59l1w): 10/10 (l) LATEST -- [start power] SHIPPED (research, no code touched).
TAB: VOTE, item WHAT A STARTING COMPANY IS WORTH (draft:true).
RECORD: records/BOHEMIA_TUNING_START_POWER_HARD_ORIGINS_START_RICHER_THAN_EASY_ONES_10_10_26.md
FINDING: start_power = purse + hire prices (pricetable hireCostRange); Hard origins (pit, wolf, hunt) start richer than all Easy ones, so their hardness is a rule the death roll carries, not money. Gear not counted; next row [origin gear value] added.

TUNING (tuning-f59l1w): 10/10 (k) LATEST -- [origins difficulty] SHIPPED (research, no code touched).
TAB: VOTE, item DOES THE MONEY MATCH THE LABEL (draft:true).
RECORD: records/BOHEMIA_TUNING_ORIGINS_DIFFICULTY_THE_LABELS_ARE_THE_WIKIS_THE_MONEY_DOES_NOT_FOLLOW_THEM_10_10_26.md
FINDING: Easy/Medium/Hard is the wiki's own label (no formula). Crowns per man overlaps across labels; hard origins are hard by RULE (wolf, pit, debt), which a dial cannot scale. Next row added: [start power].

TUNING (tuning-f59l1w): 10/10 (j) LATEST -- [the board sizes' numbers] SHIPPED (research, no code touched).
TAB: VOTE, item HOW BIG THE BOARD IS (party sliders, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_BOARD_SIZES_THE_WIKI_GIVES_NO_MAP_SIZE_SO_THE_PARTY_SETS_IT_10_10_26.md
FINDING: the wiki gives NO map width or depth; only a minimum (5 gap, 1-2 deep, bow 7 in range). small/middle/large are ours. The fight cuts by formula (8-10 wide, longest line + 2 tall; 20x15 only for 3+ parties); the COMBAT TWO sized boards are not read by the crop, so "middle" is never picked, and a 2v2 is 8x4. Routed to COMBAT: floor on height, middle threshold (proposed 5 men or 2 parties, draft).

TUNING (tuning-f59l1w): 10/10 (i) LATEST -- [the gun reach table] SHIPPED (research, no code touched).
TAB: VOTE, item HOW FAR EACH WEAPON REACHES (reach cells chart, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_GUN_REACH_TABLE_BOWS_AND_CROSSBOWS_FIRE_AT_ONE_EXACT_DISTANCE_10_10_26.md
FINDING (a real bug, found by lifting inRange/rangeMax/rangeMin/isRanged/RANGED out of BOHEMIA_FIGHT.html unchanged and running them on weapons.json):
all 8 bows have range_min = range_max (6 or 7) and all 4 crossbows 6..6, and the fight requires d >= range_min, so a bow shoots ONLY at exactly 7 tiles
and the demo's RIFLE (light crossbow) ONLY at exactly 6 on level ground. The wiki gives bows/crossbows a single tilerange (7, 6) and no minimum; the data copied
max into min. Rule 83 (min 2) is then a DATA fix: bows 2..7, crossbows 2..6. All melee (100 rows) meet 'reach 1'; handgonne 2..2 and throwing 2..4/2..6 are the wiki's own.
PISTOL = DAGGER (1..1) breaks 'every gun starts at 2' (his 9/22 law said pistol one tile; 10/10 rule 83 is newer) and needs a row or a ruled override.
'throwable_item' (7 rows, 3..3) is missing from RANGED so they act as melee reaching 3.
NEXT OPEN: [the board sizes' numbers], [origins difficulty].
TUNING (tuning-f59l1w): 10/10 (h) LATEST -- [the price ratios] SHIPPED (research, no code touched).
TAB: VOTE, item THE MARKET AGAINST THE WIKI (an AUDIT block added to the sell-ratio page).
RECORD: records/BOHEMIA_TUNING_THE_PRICE_RATIOS_AUDIT_WHERE_THE_MARKET_DEPARTS_FROM_THE_WIKI_10_10_26.md
CREDIT: RUN TWO already moved SELL_CUT 0.5 -> 1/7 citing my page; ECONOMY built price_table.json. Audit vs the wiki: village and city MATCH; TOWN has
no figure in ECONOMY's table (uses village) but the wiki has Medium .1457-.1579 (Expert); camp .1091 is unsourced and below every wiki settlement
(lowest .1282); the table is Expert-only but the default player is Veteran-equivalent (x1.11: city .1965); situations 9 of 32 and some one-sided
(Safe Roads sell+buy 10); buy side has no 0.95-1.34 modifier. The SCREEN does not read the table at all: flat 1/7, never calls sellFraction, so size and
relation are ignored. One-battery floor: 34 of 309 items (11%) sell for 1 instead of < 1 (17-50% return, median 25%). Three tier names (screen camp/town/fortress,
table camp/village/town/city, mine) need one map; proposal in the record.
NEXT OPEN: [the board sizes' numbers], [origins difficulty].

TUNING (tuning-f59l1w): 10/10 (g) LATEST -- [mood and desertion] SHIPPED (research, no code touched); also CORRECTED my 10/9 difficulty page.
TAB: VOTE, item WHEN A MAN WALKS (band + trait slider, draft:true); the difficulty page tile is fixed.
RECORD: records/BOHEMIA_TUNING_MOOD_AND_DESERTION_THE_BANDS_THE_DRIFT_AND_A_CLOCK_THE_WIKI_DOES_NOT_GIVE_10_10_26.md
Mood page (read here): 7 bands (Euphoric 86-100 ... Angry 0-15), starting-confident 75/50/25 for Euphoric/Eager/Good Spirits, Dissatisfied->steady or
worse, Disgruntled->wavering or worse, Angry->breaking or worse, daily drift toward 50. Traits (read here): Loyal 50% less likely to desert,
Disloyal 100% more, Pessimist +33% negative, Optimist +33% positive. The -1/-2 daily deltas are GROK's (the wiki's template tables are not in the
dump). The wiki gives NO day count. If -1 = one band step, a Content hire is Angry on day 3 (= his 'a couple of days'); greedy day 1.5. That reading is
unverified. THE DEMO HAS NO COMPANY MOOD OR DESERTION (its only 'mood' is facial brow/speech tone), so unpaid wages cost nothing.
CORRECTION: Game Guide table: contract rewards and selling prices are 100/100/90 percent Beginner/Veteran/Expert; Beginner is NOT +10. Fixed in the
difficulty record, its VOTE page and the draft table (econ.contract_pay_mult).
NEXT OPEN: [origins difficulty] (origins.json already carries a difficulty and d per origin; read it first).
TUNING (tuning-f59l1w): 10/10 (f) LATEST -- [the roll tables] SHIPPED (research, no code touched).
TAB: VOTE, item EVERY ROLL A MAN MAKES (stars, per-level gains, XP, with a red box of departures, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_ROLL_TABLES_EVERY_ROLL_A_MAN_MAKES_AND_FIVE_WHERE_THE_DEMO_DEPARTS_10_10_26.md
Closes a Grok gap: GROK_128 could not print the 60/30/10 labels; the wiki Talents page (read here) does.
DEPARTURES in engine/bohemia_roster.js (owner RUN TWO [climbing]; I fixed nothing): D1 manOf gives 1-3 starred stats, wiki says EXACTLY 3
(mean stars 3.0 vs 4.5; 7+ stars 1 in 55 vs 1 in 18; the file's header wrongly says the star rule is not in the repo); D2 star odds typed
in code (q<.6, q<.9) not read from rules.json experience.talent_star_odds; D3 levelUp raises 3 RANDOM stats, the wiki tip ("each star adds 5
by level 11" on a stat you always raise) implies the player chooses, so stars are worth ~1.9 not 5 (unverified: page says "can increase");
D4/D5 dailyWageBatteries and hireCostRange (wiki wage and hire formulas) are BUILT in engine/bohemia_pricetable.js but NOTHING CALLS THEM, so
wages never climb and hire price ignores level. MATCHES: level table, veteran XP, cap 33, no perk past 11, +1 on three, gain ranges, 20/80 kill split.
I first wrote D5 as 'no formula'; I read the price-table engine and corrected it before shipping.
NEXT OPEN: [origins difficulty] (last).
TUNING (tuning-f59l1w): 10/10 (e) LATEST -- [recruit odds] SHIPPED (research, no code touched).
TAB: VOTE, item HOW HARD IS A KILLER (a star-bar slider, draft:true).
RECORD: records/BOHEMIA_TUNING_RECRUIT_ODDS_36_KILLERS_AS_HARD_AS_12_10_10_26.md (BB facts from the wiki dump; odds are my arithmetic).
FINDING: every BB recruit has stars on 3 of 8 stats (1 star 60%, 2 stars 30%, 3 stars 10%): 7+ total stars is 1 in 18, 8+ 1 in 100,
all-three-3-star 1 in 1000. 12 killers at the 7-star bar = ~216 recruits seen; 36 = ~648. Three ways to make 36 cost what 12 costs:
lower the bar one point (7 to 6, 3.5x easier), three companies (the three acts run at once, so 36 = 12 per act = BB-hard each),
or inheritance (12 hard-won + 24 heirs at one star less). Recommended: companies + heirs. BB caps the roster by WAGES and food and
the enemy scales only off the 12 STRONGEST (multiplier 0.94 x (0.01 x strength)^0.89, strength = sum of 10+2(level-1), clamped 0.75-5,
x 0.85/1.00/1.15 by combat difficulty), so a bench is free of enemy scaling but not of wages. Heir rows proposed (star_loss 1).
Hire cost 500 x (level-1)^1.5 (guide's own 0-3000 range disagrees with its formula); upkeep base 3-35 x 1.1^(level-1).
NEXT OPEN: [origins difficulty] (last row); after it ships I write the next from the jump list.
TUNING (tuning-f59l1w): 10/10 (d) LATEST -- [respec] SHIPPED (research, no code touched).
TAB: VOTE, item WHAT A RESPEC COSTS (BB potion vs ours vs XP past 11, draft:true).
RECORD: records/BOHEMIA_TUNING_RESPEC_BB_ALREADY_HAS_A_RESET_AND_IT_COSTS_SEVEN_RARE_PARTS_10_10_26.md (BB facts from the wiki dump).
FINDING: his premise is half wrong: vanilla BB HAS a respec, the Potion of Oblivion (worth 2500, resets ALL perks, crafted only,
7 rare monster parts + 5000 crowns). What players lack is a PARTIAL, AFFORDABLE one, which is his rule. Past level 11 a level costs
4000+1000 per level above 11 (12: 19,000 total; 13: 24,000; 14: 30,000), gives NO perk point, stats capped +1 x3, so a swap is the
one thing late XP buys. Price anchored to 1/10 of the potion: 25-50 batteries (default 40 is MY pick), a few days, one mastery per
visit, training ground, masteries only. Rule 56: death.base 0.20 + death.per_mark 0.05 (my pick), cap 4 marks = 0.40 max, under BB's 0.67.
Recall/unverified: what the Legends and respec mods do.
NEXT OPEN: [recruit odds], [origins difficulty].

TUNING (tuning-f59l1w): 10/10 (c) LATEST -- [ammo] SHIPPED (research, no code touched).
TAB: VOTE, item WHEN THE AMMO RUNS OUT (start kit x gun x shooters, draft:true).
RECORD: records/BOHEMIA_TUNING_AMMO_A_BULLET_COSTS_ONE_AND_BB_MAKES_IT_A_STOCK_NOT_A_PRICE_10_10_26.md (all BB numbers from the wiki dump).
FINDING: BB makes ammo scarce by STOCK and LOAD, not price: one stock in points (bundle 50 = 100 crowns), cap 300 (500 Beginner,
+100 quartermaster), quiver 10 uses, auto-refill after each fight, replace costs 1 (arrow/bolt) / 2 (handgonne) / 3 (thrown),
start kits 20/40/80 points, handgonne reload = a whole 9-AP turn. 4 bow shooters burn 40 points in a 10-round fight, so a Medium
start is ONE fight. OURS HAS NO AMMO ECONOMY: no company stock, no refill, no ammo on the settlement screen or in the start kit
(the fight tracks only per-weapon loads). Copying BB's price would change nothing; copy the stock, cap, refill and start kit.
Act curve proposal: arrows/bolts act 1, powder (Alchemist) act 2, bullets act 3, as an availability table.
NEXT OPEN: [respec], [recruit odds], [origins difficulty].

TUNING (tuning-f59l1w): 10/10 (b) LATEST -- [the sell ratio] SHIPPED (research, no code touched).
TAB: VOTE, item WHAT A SETTLEMENT PAYS YOU (a slider vs BB's big town and village vs our shop, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_SELL_RATIO_WHAT_A_SETTLEMENT_PAYS_YOU_10_10_26.md
DATA FOR ECONOMY: records/BOHEMIA_TUNING_SELL_RATIO_TABLE_10_10_26.json (3 brackets by attached locations, Veteran derived
from Expert x 7.41/6.67 and checked against the wiki's own 18.73-19.61 City Hall range; relations +2pts sell / -0.15 buy;
32 situation rows). All from the wiki dump, read here.
FINDING: BB buy/sell ratio is fixed at 6.67 (Veteran) / 7.41 (Expert): you recover 13-20% of worth. Our settlement screen
sells back at 50% (SELL_CUT, unsourced) = 2.5-3.8x too generous. Second: whole batteries + a floor of 1 make cheap gear
sell at ~33% (knife: should be 0.45 battery, floors to 1). ECONOMY must pick a rounding rule. Tier map proposal:
camp->Low, town->Medium, fortress->High.
NEXT OPEN: [ammo], [respec], [recruit odds], [origins difficulty].
TUNING (tuning-f59l1w): 10/10 (b) LATEST -- [the sell ratio] SHIPPED (research, no code touched).
TAB: VOTE, item WHAT A SETTLEMENT PAYS YOU (a slider vs BB's big town and village vs our shop, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_SELL_RATIO_WHAT_A_SETTLEMENT_PAYS_YOU_10_10_26.md
DATA FOR ECONOMY: records/BOHEMIA_TUNING_SELL_RATIO_TABLE_10_10_26.json (3 brackets by attached locations, Veteran derived
from Expert x 7.41/6.67 and checked against the wiki's own 18.73-19.61 City Hall range; relations +2pts sell / -0.15 buy;
32 situation rows). All from the wiki dump, read here.
FINDING: BB buy/sell ratio is fixed at 6.67 (Veteran) / 7.41 (Expert): you recover 13-20% of worth. Our settlement screen
sells back at 50% (SELL_CUT, unsourced) = 2.5-3.8x too generous. Second: whole batteries + a floor of 1 make cheap gear
sell at ~33% (knife: should be 0.45 battery, floors to 1). ECONOMY must pick a rounding rule. Tier map proposal:
camp->Low, town->Medium, fortress->High.
NEXT OPEN: [ammo], [respec], [recruit odds], [origins difficulty].
TUNING (tuning-f59l1w): 10/10 LATEST -- [the felt numbers table] SHIPPED (research, no code touched).
TAB: VOTE, item EVERY NUMBER THE FIGHT FEELS (85 rows with sources, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_FELT_NUMBERS_TABLE_IS_REAL_AND_MY_FIGHT_FINDINGS_ARE_STALE_10_10_26.md
INSTRUMENT: tools/bohemia_felt_numbers_audit.js [--write]: 86 static R() keys, 85 resolve, 71 wiki, 10 rulings, 4 other
sourced, 0 without a verbatim quote, 0 stray numbers in the fight-rules script (COMBAT's own rule holds).
BIGGEST FINDING (AGAINST MYSELF): the DEMO fights in slices/BOHEMIA_FIGHT.html (rule 63, BB rebuilt, 13 data files through
R()), NOT the old COMBAT_B64 tab I measured 9/28-10/1. So FIVE POINTS, HOW LONG A FIGHT TAKES, WHO DIES (rates) and
DIFFICULTY DIALS describe the old fight; appended STALE pointers. Most important: the new fight uses initiative, AP and
fatigue (BB's sequential turns), so "50 s, one beat" is probably FALSE for the demo and his 15-minute ceiling is unmeasured
there. EYES [where the minutes go] should time the new fight.
Gaps: HOLD_MS 450 and MAN_OF_TILE 0.86 outside the table; settlement SELL_CUT 0.5 unsourced; wages/rations/medicine/repair
absent from the demo.
MISTAKES FIXED EARLIER: broad sed on rows, now anchored to my section.
NEXT OPEN: [the sell ratio], [ammo], [respec], [recruit odds], [origins difficulty].

TUNING (tuning-f59l1w): 10/9 (b) LATEST -- [the difficulty steps] SHIPPED (research, no code touched).
TAB: VOTE, item WHAT EACH DIFFICULTY CHANGES (three tables from the wiki, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md (for the door and COMBAT [the enemy math]).
FINDING: BB has TWO difficulties (combat, economic) plus a separate Ironman, each Beginner/Veteran/Expert.
Combat: Beginner = your roll -5, theirs +5, +10% XP, crisis 5 days later; Expert = harder groups sooner.
Economic: pay -10% per level (Beginner +10% is MY reading), sell -10% on Expert, carry caps tools 200/150/150,
ammo 500/300/300, medicine 150/100/100, deserters take gear on Expert; start kits High/Medium/Low 2500/2000/1500
crowns. Ironman = no manual saves, NOT worse death odds (my old pages said otherwise; fixed).
BB's own accuracy lever is as small as ours, so my 10/1 blame of the five tiers was the wrong lever: BB's difficulty is
felt in group count/tier/arrival and in money. Recommendation for the manager: split the door's stamp in two + checkbox.
MISTAKE FIXED: my broad sed claimed the QUESTS and MODS chats' own [grok sources] rows; restored them. Claims now
anchor to my own section.
NEXT OPEN: [the felt numbers table], [the sell ratio], [ammo], [respec], [recruit odds], [origins difficulty].
TUNING (tuning-f59l1w): 10/9 (b) LATEST -- [the difficulty steps] SHIPPED (research, no code touched).
TAB: VOTE, item WHAT EACH DIFFICULTY CHANGES (three tables from the wiki, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md (for the door and COMBAT [the enemy math]).
FINDING: BB has TWO difficulties (combat, economic) plus a separate Ironman, each Beginner/Veteran/Expert.
Combat: Beginner = your roll -5, theirs +5, +10% XP, crisis 5 days later; Expert = harder groups sooner.
Economic: pay -10% per level (Beginner +10% is MY reading), sell -10% on Expert, carry caps tools 200/150/150,
ammo 500/300/300, medicine 150/100/100, deserters take gear on Expert; start kits High/Medium/Low 2500/2000/1500
crowns. Ironman = no manual saves, NOT worse death odds (my old pages said otherwise; fixed).
BB's own accuracy lever is as small as ours, so my 10/1 blame of the five tiers was the wrong lever: BB's difficulty is
felt in group count/tier/arrival and in money. Recommendation for the manager: split the door's stamp in two + checkbox.
MISTAKE FIXED: my broad sed claimed the QUESTS and MODS chats' own [grok sources] rows; restored them. Claims now
anchor to my own section.
NEXT OPEN: [the felt numbers table], [the sell ratio], [ammo], [respec], [recruit odds], [origins difficulty].
TUNING (tuning-f59l1w): 10/9 LATEST -- [grok sources] SHIPPED: my six research pages checked against the wiki and Grok pages.
TAB: VOTE, item WHO DIES (now with a red BATTLE BROTHERS REAL button; draft:true).
RECORD: records/BOHEMIA_TUNING_THE_WIKI_CHECK_WHAT_I_HAD_WRONG_10_9_26.md ; corrections appended to the death-rule,
difficulty and fight-length pages; reference rows added to the draft numbers table (nothing reads it).
BIGGEST CORRECTION: BB survival at 0 HP is a FLAT 33% (90% with Survivor), never better for winning; none if the last
hit was a fatality, the man was retreating, or it was bleeding. So BB kills 67 in 100 struck-down men; his 20 is far
kinder (median life 118 vs 21 fights at 5% struck). My "lose a fight = 30%" idea had no basis and is struck.
Also: injury gate = hit of >=10 and 25-60% of max HP (so snipers and bats cause injuries, goons rarely); armour also
takes 0.1 x armour off every hit that passes; BB has no enemy level or gear dial (strength from your crew's 12
strongest men plus days; difficulty raises count and tier together); Paolo gave NO fight-length number (Grok 83).
STILL OPEN IN MY QUEUE: [the difficulty steps], [the felt numbers table], [the sell ratio] (wiki-fed), [ammo], [respec]
(note rule 56 changed who dies: flat 20, a little more per trait/injury, re-read before writing), [recruit odds],
[origins difficulty].

TUNING (tuning-f59l1w): 10/1 LATEST -- [difficulty sliders] SHIPPED (research, no code touched). [grok sources] LEFT OPEN.
TAB: VOTE, item THE DIFFICULTY DIALS (presets + four dials, draft:true).
RECORD: records/BOHEMIA_TUNING_DIFFICULTY_SLIDERS_THE_FIVE_TIERS_BARELY_MOVE_ANYTHING_10_1_26.md
FINDING: the five packages (EASY..BOHEMIAN) set the player's dial AND the enemy's aim from one number
(THREAT_BY_PKG 1.00..1.60 divides the enemy MISS). Top tier = 21% more enemy hits than NORMAL, median life 96
vs 121 fights: nobody can feel it. They never reach damage, count, level, gear, death odds or pay (the V121
comment says damage; the code scales only the miss). Design: three kinds of slider kept apart: PRESSURE (the
world), STAKES (death rule), ASSIST (dial and beat window, accessibility). Four presets, measured: STEADY
median life 440, STANDARD 117 (his rule), HARD 72, IRON 29. Rules never move.
[grok sources]: reference/library/grok/ has only its README, no page has passed EYES' filter, so nothing
cites Grok and no table number was corrected; re-read my rows when the first page lands.
NEXT OPEN: [respec], [recruit odds], [ammo], [origins difficulty].
TUNING (tuning-f59l1w): 9/30 LATEST -- [death rule] SHIPPED (research, no code touched).
TAB: VOTE, item WHO DIES (a company toy, draft:true).
RECORD: records/BOHEMIA_TUNING_DEATH_RULE_WHAT_TWENTY_PERCENT_DOES_TO_A_COMPANY_9_30_26.md
FINDING: his 20%/10% is the SECOND half of the rule. The felt number is how often a man is
STRUCK DOWN per fight (the missing row). At 20% struck, 54% die before their 20th fight and the
veteran 10% never fires; at 5%, median life 122 fights. Men out at once = fights/day x fielded x
p x 0.85 x days, so 30-40 days out is safe only with fights spaced or p near 5% (joint row with
WORLD). A survivor collects about 8 scars: cap marks at 4, the fifth is a retirement (feeds heirs).
Main character never dies: his 20% becomes THE SEVERE MARK. Losing a fight = 30%.
Recall-grade: BB left-for-dead mechanic. NEXT OPEN: [respec], [recruit odds], [difficulty sliders],
[origins difficulty], [ammo].
TUNING (tuning-f59l1w): 9/29 LATEST -- [fight length] SHIPPED (research, no code touched); [dead citation] SHIPPED.
TAB: VOTE, item HOW LONG A FIGHT TAKES (two bars vs the 15 minute ceiling, draft:true).
RECORD: records/BOHEMIA_TUNING_FIGHT_LENGTH_WHY_BB_RUNS_40_MINUTES_AND_OURS_DOES_NOT_9_29_26.md
FINDING: BB minutes = rounds x units x seconds each, turns are sequential (12 v 25 x 13 rounds
x 5 s = about 40 min, his number). Ours: everyone on one beat, 9.4 rounds measured (8/19),
about 50 s routine, about 4 min with level+gear+mistake all up, 13 min with everything maxed.
So we are UNDER every ceiling; the risk is a fight too short for formation and gear to
matter. Morale is already on (V199 FEAR_ON). Three dials = three multipliers on rounds.
NOT MEASURED: real human minutes on a phone (EYES [where the minutes go]); BB seconds per
unit is recall calibrated to his 30-40. NEXT OPEN: [respec], [recruit odds], [death rule].
MISTAKE I MADE AND FIXED: a broad sed marked ECONOMY's [dead citation] row as mine; reverted.

TUNING (tuning-f59l1w): 9/28 (c) LATEST -- [numbers table] SHIPPED as research (the SHAPE, rule 38g).
TAB: VOTE, item EVERY NUMBER YOU FEEL (41 cards, draft:true).
RECORD: records/BOHEMIA_TUNING_THE_NUMBERS_TABLE_SHAPE_9_28_26.md
DRAFT: records/BOHEMIA_TUNING_NUMBERS_TABLE_DRAFT_9_28_26.json (33 rows: 21 live,
8 proposed, 4 his rulings not built; + 8 enemy kinds). NOTHING READS IT.
INSTRUMENT: node tools/bohemia_tuning_census.js [--write] refreshes live values from
the fight blob and flags any that moved; 128 numeric consts, 21 felt, 0 missing.
FINDING: enemy hit chance (0.97 - 0.60 x dist, x0.6, x0.8) and the vital 0.55 are
bare inline numbers, not consts; the future gate must check a felt LIST, not consts.
Build day (his call): PLUMBER+COMBAT wire TUNE[] at the top of the blob, defaults =
today's values, and a ratchet gate. NEXT: [death rule] research page.

TUNING (tuning-f59l1w): 9/28 (b) LATEST -- [lifespans] SHIPPED (research, no code touched).
TAB: VOTE, item HOW LONG THEY LIVE (a roll toy, draft:true).
RECORD: records/BOHEMIA_TUNING_LIFESPANS_HOW_OLD_PEOPLE_LIVE_IS_A_ROLL_9_28_26.md
FINDING: hard places kill the middle-aged, not the old (Russia 1990-94), and the
years come back. Recommended: a yearly risk, Gompertz-Makeham (doubles every 8.2
years), set by the world's times: crash median 69, hard 76, good 81 (adults from
18, 20k lives each). Scars raise it; the body shows it first (omen at 3%/yr);
a death of age lands at the fold or a year-end, never in a fight. At a fold,
54-76% of adults you knew are still alive, so nobody may assume they are dead.
[PENDING Paolo] for the coordinator: can the main three die of age? Default no.
NEXT: [death rule] research page. Earlier this round: [bb numbers] SHIPPED.

TUNING (tuning-f59l1w): 9/28 LATEST -- [bb numbers] SHIPPED (school, no code touched).
TAB: VOTE, item FIVE POINTS (a slider toy, draft:true).
RECORD: records/BOHEMIA_TUNING_BB_NUMBERS_HOW_FIVE_POINTS_ARE_FELT_9_28_26.md
THE FINDING: Battle Brothers makes 5 points felt because a small number flips a
whole-number breakpoint (hits to kill), through armour as a second pool, weapon
vs armour matchups, and fatigue as the price. OUR PLATE EATS ONE WHOLE HIT OF ANY
SIZE (ppAbsorb), and enemy armour is 0 on everyone but the boss (9 vs a kill of
100). So "slightly better armour" cannot exist in the build. Proposal for
[numbers table]: a HOLD number per plate; hits over it crack the plate and spill.
The record's section 4 lists every felt number in the decoded fight (first fill).
NEXT: [lifespans] (school). Coordinator's 9/28 verdict item says TUNING stays
research until Paolo says build; nothing here edits code.

