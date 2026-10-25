# TUNING: THE FIRST FIFTY DAYS AND THE LONE WOLF (10/25, rule 183, RESEARCH ONLY)

Row: TUNING [the first fifty days and the lone wolf]. Research only (rule 38g): nothing in the game was changed by this page.
Everything here is a work in progress (rule 178): the numbers are better known now, never final.

HIS WORDS (10/25, verbatim, voice to text): "there definitely isn't incentive for like the first 50 days for sure just to not
really grow your crew unless it's just like God Bros God tier recruits type shit that's why battle Brothers I always loved
playing on Lonewolf cause you just get started off with it mega (god) bro who when you get him good equipment is a virtually
impossible to kill until the game starts getting hard harder on you"

THE BENCH: tools/bohemia_tuning_lone_wolf.js (research instrument, not a gate). Every fight is THE LIVE FIGHT
(slices/BOHEMIA_FIGHT.html and exactly the data files its own loadAll() reads, played headless through the whole grid's engine,
no hooks), both sides on the fight's own brain (AUTO), seeded. The map's sums are the live map's (records/target/bb/party_math.json
read the way BOHEMIA_CITY_WORLD.html partyMath reads it). BANK (draft:true, nothing in the game reads it):
banks/BOHEMIA_TUNING_LONE_WOLF_10_25_26.json (the resume cache, 15 MB of per-day logs, is not committed: the bench replays it,
seeded, in about 45 minutes on four cores). 12,600 ladder fights and 2,150 runs of 100 days (about 85,000 fights) in all.

## 0. THE ANSWER IN SHORT
- **Today the Lone Wolf is not a near-god.** He is a level-4 label on a level-1 body, in the first crew member's rags (90
  armour, a pistol and a car door). He wins 57 to 64 in 100 of his first ten days' fights and falls in the rest.
- **In good gear he is exactly what Paolo remembers.** The hedge knight's own kit takes his first fifty days to 94 in 100, one
  lost fight a run, a third of runs never losing; Battle Brothers' three door levels on top take it to 96 and half the runs.
- **The game turns hard on day 60, all at once**, when the enemy's late mix switches on: 93 -> 68 in one window. Battle
  Brothers' turn lands at day 80 to 100 and is foretold at 50 to 70.
- **An ordinary early hire makes him worse in every row** (the map counts the hire, the hire falls and is laid up a month, the
  XP splits). **A god-tier hire makes him safer, and the post never offers one.**
- The numbers that would put his words on the live game are in section 3, NOTEd to RUN, RUN TWO, WORLD and COMBAT.

---------------------------------------------------------------------------------------------------------------------------

## 1a. WHO STANDS AT THE DOOR WHEN HE PICKS THE LONE WOLF (measured off the live files)

origins.json gives the Lone Wolf one man: `{background: hedge_knight, level: 4}`, 125 / 100 / 75 batteries (full / thin / bare
shelves), room for 12. NOTHING NAMES HIS GEAR. The fight (setup) puts him in the first place in the line, YOU's (ours.crew[0]),
so he walks in wearing YOU's kit. The crew screen (BOHEMIA_ROSTER_SCREEN.html open + engine/bohemia_roster.js manOf) does the same.

| | THE LIVE GAME (the fight's own build) | THE CREW SCREEN'S CARD | BATTLE BROTHERS' LONE WOLF (average of 2,000 rolls) |
|---|---|---|---|
| level | 4 | 4 (manOf deals 1, startLevel writes 4) | 4 |
| what levels 2-4 gave him | NOTHING: stats rolled at level 1 | NOTHING: 3 perk points, 0 level-up rolls | three level-ups he takes (3 picks each) |
| hitpoints | 70 | 69 | 67.5 |
| fatigue (breath) | 105 | 107 | 117.3 |
| melee skill | 65 | 64 | 69.3 |
| melee defence | 9 | 7 | 12.7 (the page's -2 applied: 4 to 8 before levels) |
| resolve / initiative | 41 / 102 | 39 / 96 | 41.5 / 94.5 |
| perks | adrenaline, dodge, rotation (the fight's PISTOL build) | none (3 points unspent) | three he picks |
| in his hands | the pistol (dagger) and the car door (wooden shield) | the same | 'great equipment' (the page's words, no item named) |
| on his body | a work jacket (padded surcoat) 50 + a rag hood (open leather cap) 40 = **90 armour** | the same | the hedge knight's own kit: 210 to 320 body + 280 to 300 helm = **490 to 620** |
| breath left in his kit | 85 | 85 | about 42 to 70 by kit |

Three things are off before a single fight:
1. **He is not a near-god at the door.** The three levels Battle Brothers hands as choices (its scenario gives LevelUps = 3 and
   PerkPoints = 3, recall; the wiki page states 'experienced hedge knight') hand him nothing here but perk points: about
   -4 melee skill, -4 melee defence and -12 breath against the man Battle Brothers builds.
2. **He has no great equipment.** He wears the first crew member's starting rags: 90 armour against Battle Brothers' 490+.
   What 'great equipment' is in pieces is not in our wiki copy (CORE_WIKITEXT.md:3786-3852 says the words and names no
   item); the hedge knight's own kit off the wiki's Hedge Knight (Enemy) page (one of ten top weapons, a 210 to 320 body,
   a 280 to 300 helm, a kite or heater with a one-hander) is the honest stand-in this page uses as GOOD.
3. **Every Lone Wolf is the same man.** The fight rolls a named man's stats from his name, look and background (crewUnit's
   own roll), so YOU as a hedge knight is 70 / 105 / 65 / 9 in every game. Battle Brothers rolls a new hedge knight each campaign.
4. A smaller one: a man the roster hands a sword fights with NO perks (ours.perk_builds has rows for the crew's six jobs only:
   pipe, sledge, pistol, rifle, shotgun, bottles; a sword or an axe has none), so a Lone Wolf who buys a sword loses his three.

## 2. BATTLE BROTHERS FIRST (rule 33: how did Battle Brothers do it)

Sources: the wiki copy in the library (reference/library/grok/wiki/CORE_WIKITEXT.md, PAGES_ALL.tar.gz bb_all/), Grok's two
pages (GROK_ORIGIN_LIST_STARTING_DIFFERENCES_2026_10_24.md, GROK_LATE_GAME_CRISIS_LIST_2026_10_24.md, both PASSED FILTER), and
what is marked (recall) where the library is silent.

**THE LONE WOLF ORIGIN** (CORE_WIKITEXT.md:3786-3852, bb_all/1194_Lone Wolf.txt):
- One hedge knight, level 4, 'great equipment', low funds: 1,250 / 1,000 / 750 crowns (minus 100 on Expert), tools 20 / 10 / 5,
  medicine 10 / 6 / 3, no ammunition. Renown 200 from the start (a head start: renown is what contracts pay on).
- Elite Few: never more than 12 in the roster. 90 inventory slots, not 99.
- Avatar: the campaign ends if he dies (ours: downed, never dead, the third votes; it stands).
- His melee defence is moved -2 (a range of 4 to 8); he cannot start Survivor, Greedy or Disloyal; no event can kill him.
- Three events of its own: a squire, another squire, a depressing lady (the squire events are how a Lone Wolf grows a crew
  of men who are worth it).
- (recall, not in the library) the scenario hands the knight three level-ups and three perk points to spend at the start, and
  equips him as the hedge knight background does; a Grok ask can confirm the exact items.

**THE LONE WOLF PERK** (bb_all/1195_Lone Wolf (Perk).txt; tier 5 in our perks.json): with no ally within 3 tiles, +15% melee
skill, ranged skill, melee defence, ranged defence and resolve. The origin's man is the perk's ideal owner.

**WHAT THE MAP HANDS ONE MAN, AND WHAT OUTGROWS HIM** (bb_all/0828_Game Mechanics.txt:101-111; GROK_ASK_105 PASSED FILTER,
from the Game Mechanics and Game Guide pages):
- A CONTRACT scales with the roster's strength (10 + 2 x (level - 1) for each of the 12 strongest), the skulls and the type.
  Renown does not change its size, only its pay.
- **BUT IT HAS A FLOOR, AND THE FLOOR IS THE LONE WOLF'S WHOLE EARLY GAME.** A company of fewer than three men counts 10 a man
  whatever his level, and the contract multiplier, 0.94 x (strength / 100)^0.89, is held between 0.75 and 5. It only climbs off
  0.75 past a strength of about 80 (eight level-1 men, or six level-4 men). So in Battle Brothers a lone level-4 knight
  (strength 10), a new crew of three (30) and a crew of six (60) are all handed THE SAME contracts, at 0.75 of the type's
  base. **The Lone Wolf is not handed fights sized to one man: he is handed a new company's fights, alone.** That is why he
  must be a near-god, and why the great equipment and the three levels are the origin, not a bonus.
  The multiplier by company (0.94 x (strength/100)^0.89, held to 0.75 .. 5):

  | company | strength | the formula | what the job is sized at |
  |---|---|---|---|
  | the Lone Wolf alone (under three men count 10) | 10 | 0.12 | **0.75** |
  | a new crew of three, level 1 | 30 | 0.32 | **0.75** |
  | six, level 1 | 60 | 0.60 | **0.75** |
  | eight, level 1 | 80 | 0.77 | 0.77 |
  | twelve, level 1 | 120 | 1.11 | 1.11 |
  | twelve, level 5 | 216 | 1.87 | 1.87 |
  | twelve, level 11 | 312 | 2.59 | 2.59 |

  Camps and other places on the map do not look at the company at all: they grow with the days to about three times their
  size by day 267; roaming parties grow with the days and stop growing at day 100 (GROK_60 PASSED FILTER); late days add
  small buffs to the enemy (5 melee skill, 10% damage).
- Ours does not do this (measured in 1c below): party_math sizes a job straight off the strength with no floor, so one man's
  job is 2 enemies at every skull for a long time, while a new crew's two-skull job is 3.
- ROAMING PARTIES AND LOCATIONS scale 'mostly with distance to civilization and time', roaming parties 'slightly' with your
  strength, locations not at all. **These are what outgrow one man**: the days make them bigger whatever the roster is.
- The combat difficulty raises both numbers and tier ('harder enemy groups appear sooner').
- XP: a kill is 20% to the killer and 80% shared by the party (rules.json kill_split): **one man takes all of it.** A crew of
  three splits the same fight three ways, so the Lone Wolf climbs about two to three times faster on the same fights.

**THE LATE GAME CRISES** (bb_all/1146_Late Game Crises.txt, Grok's crisis page PASSED FILTER):
- Four kinds (the noble war, the undead scourge, the greenskin invasion, the holy war); the first can be chosen or random.
- Foretold around day 50 to 70, started around day 80 to 100. No renown needed, BUT 'a certain amount of days need to have
  passed, as well [as] a minimum roster (determined by average level and number of men)'. A company too small or too green
  does not trigger it on time.
- A crisis lasts 30 to 100 days; another can follow within 100 days after at least 50 of peace; never the same twice running.
- The greenskin and undead crises can burn settlements for good; the noble war takes them without burning (the suggested
  first crisis 'since it'll give your company more time to build up').

**HOW RARE A 'GOD-TIER' RECRUIT IS** (bb_all/0370_Character Backgrounds_Sources.txt; 0973 Hedge Knight (Background); the Game
Guide in backgrounds.json hiring_and_wage_rules):
- A hedge knight is only ever offered in CITIES (2.2 to 2.8% a vacant recruit slot) and FORTS (2.6 to 5.7%), never a village;
  a swordmaster cities and forts 2.2 to 3.7%; a sellsword cities, forts and keeps 2.2 to 8.3%. Barracks add one; the
  Disbanded Troops situation adds three.
- On top of the background, three of eight attributes carry talents, one star 60%, two 30%, three 10% (Talents page). A man
  with the right background AND the right stars AND a high roll is a few in a hundred of the men a player sees.
- The price says it: a base of 30 for the worst to about 150 for the best (400 for a swordmaster), plus 500 x (level - 1)^1.5
  for his level (0 to 3,000), plus his gear at 1.25 its value. A level-2 hedge knight in his kit costs thousands of crowns.
- His wage: a hedge knight's base is 35 a day, the most of any background (the Game Guide: a level-11 hedge knight costs 91 a day).
- The Recruiter follower (3,000 crowns, unlocked by recruiting 12): 2 to 4 more men at every settlement, 10% off the price.

## 1b. THE LADDER: ONE MAN, AT THE DOOR'S LEVEL 4, AGAINST 1 TO 8 BRIGANDS DRESSED FOR THE DAY (60 seeded fights a cell)

The fight file measured is the one on main at a132d9c6, WITH COMBAT's new AUTO brain (e0f39941 + 9fa7d655, built from this
lane's last page: one brain, focus, the roof worth holding, the standoff end). A frozen copy of that commit played every fight,
so nothing moved under the numbers. Brigands are the map's faction; ours.enemy_tiers dresses them by the day (thugs only to
day 7; thugs and a few raiders from 8; raiders, marksmen, poachers, marauders from 20; the late mix with a leader from 60; their
skills step up at day 40). Day 60 and day 100 read the same because the dress stops changing at 60.

WON IN 100 (and, after the slash, FELL IN 100; the rest are standoffs):

| who (level 4) | day | vs 1 | vs 2 | vs 3 | vs 4 | vs 5 | vs 6 | vs 8 |
|---|---|---|---|---|---|---|---|---|
| TODAY (the live game: rags, the pistol build) | 1 | 92 / 8 | **73 / 27** | 33 / 67 | 12 / 88 | 12 / 88 | 8 / 92 | 5 / 95 |
| | 20 | 73 / 27 | 52 / 48 | 28 / 72 | 12 / 88 | 8 / 92 | 3 / 97 | 5 / 95 |
| | 60 | 52 / 48 | 15 / 85 | 12 / 88 | 2 / 98 | 2 / 98 | 2 / 98 | 3 / 97 |
| BATTLE BROTHERS' LEVELS IN TODAY'S RAGS | 1 | 97 / 3 | 75 / 25 | 38 / 62 | 27 / 73 | 17 / 83 | 15 / 85 | 10 / 90 |
| TODAY'S MAN IN GOOD GEAR | 1 | 100 / 0 | **98 / 2** | **87 / 13** | 53 / 47 | 23 / 77 | 15 / 85 | 7 / 93 |
| | 20 | 92 / 8 | 80 / 20 | 60 / 40 | 37 / 63 | 15 / 85 | 5 / 95 | 2 / 98 |
| | 60 | 58 / 30 | 32 / 68 | 17 / 83 | 2 / 98 | 0 / 100 | 0 / 100 | 0 / 100 |
| BATTLE BROTHERS' LONE WOLF (levels + good gear) | 1 | 100 / 0 | **100 / 0** | **92 / 8** | 68 / 32 | 43 / 57 | 22 / 78 | 13 / 87 |
| | 20 | 95 / 5 | 90 / 10 | 70 / 30 | 48 / 52 | 23 / 77 | 13 / 87 | 5 / 95 |
| | 60 | 62 / 27 | 43 / 57 | 20 / 80 | 10 / 90 | 0 / 100 | 0 / 100 | 0 / 100 |
| THE SAME WITH THE GREATSWORD | 1 | 100 / 0 | 98 / 2 | 88 / 12 | **72 / 28** | 32 / 68 | 17 / 83 | 12 / 88 |
| | 20 | 93 / 7 | 80 / 20 | 65 / 35 | 38 / 62 | 22 / 78 | 8 / 92 | 0 / 100 |

HOW CLOSE HE COMES (his lowest health in the fight, average, % of his hitpoints), day 1: TODAY 86 / 65 / 30 against 1 / 2 / 3;
GOOD 100 / 96 / 84; BATTLE BROTHERS' LONE WOLF 100 / 100 / 90. In good gear two day-one thugs barely scratch him (4 points of
health lost on average): that IS the near-god he remembers, against two. Against four the good-gear man is spent (out of breath
on a quarter of his turns: four men swinging twice a turn cost him 2 a miss and 5 a hit, Battle Brothers' own rule, faster than
his 15 back a turn), and he wins half.

What the ladder says:
1. **The live Lone Wolf is not a near-god. He is a strong recruit in rags.** One day-one thug puts him down 8 times in 100; the
   map's day-one pair puts him down 27 in 100 and leaves him at 65% on average when he wins.
2. **The gear is most of the god.** Good gear takes him from 73 to 98 against two, 33 to 87 against three. Battle Brothers'
   three door levels alone (in rags) add almost nothing (73 to 75); on top of the gear they add the last step (98 to 100
   against two, 87 to 92 against three, 53 to 68 against four).
3. **A god against the map's job, not against a crowd.** Even Battle Brothers' Lone Wolf in great gear wins only 43 in 100
   against five day-one thugs. That is right by his words ('make sure he doesn't run into any group too big').
4. **At his door level the late dress (day 60) beats him.** That is the turn arriving, but at level 4 (the campaign below
   plays it at the level he has really reached by then).

## 1c. WHAT THE MAP HANDS ONE MAN, DAY BY DAY (party_math.json as the live map sums it; NEW HERE, the door's default)

His level by day is the median the GOOD campaign reached (1d). A job is sized off the roster's strength (10 + 2 a level past 1),
the skulls and the difficulty, at least 2; a roaming party off the days, the blocks from town and a little of the strength;
the first game day is capped at the company plus one; a camp is a job plus two.

| day | his level | job, 1 skull | 2 skulls | 3 skulls | a camp (3) | roaming at a town | 4 blocks out | 8 blocks out | A NEW CREW OF THREE, 2 skulls / 3 skulls |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 4 | 2 | 2 | 2 | 4 | 2 | 2 | 2 | 3 / 3 |
| 10 | 5 | 2 | 2 | 2 | 4 | 3 | 3 | 3 | 3 / 3 |
| 20 | 6 | 2 | 2 | 2 | 4 | 3 | 4 | 4 | 3 / 3 |
| 30 | 7 | 2 | 2 | 2 | 4 | 4 | 5 | 5 | 3 / 3 |
| 40 | 8 | 2 | 2 | 3 | 5 | 5 | 6 | 6 | 3 / 3 |
| 50 | 9 | 2 | 2 | 3 | 5 | 6 | 6 | 7 | 3 / 3 |
| 60 | 10 | 2 | 2 | 3 | 5 | 7 | 7 | 8 | 3 / 3 |
| 80 | 11 | 2 | 3 | 3 | 5 | 9 | 9 | 9 | 3 / 3 |
| 100 | 11 | 2 | 3 | 3 | 5 | 10 | 11 | 11 | 3 / 3 |

Read it plainly: **a lone man's job is two men at one and two skulls for eighty days** (a three-skull job reaches three at
level 8, about day 40). Only the ROAMING parties grow: two on day one, four by day 20, six by day 40, nine to eleven by days 80 to 100.
The blocks from town barely move it (0.1 a block). So in ours the jobs never outgrow him and the roads do, which is
Battle Brothers' shape for the roads, but NOT for the jobs: Battle Brothers holds every early company's job at one floor
(section 2), so its Lone Wolf meets a new company's job, three men and more, from day one. A hire changes the job too: the
wolf and one level-1 man meet a three-skull job of 3 from day 1 and 4 from day 30 (his strength counts in full).

## 1d. THE DAYS, PLAYED: FROM THE DOOR TO DAY 100 (100 seeds a row, a fight every second day)

Each seed plays the Lone Wolf from the door: a fight every second day (the cadence the men-out sums of earlier pages assumed;
1 and 4 days in 1f), the party the map hands (1c), dressed by the day, on the live fight; the XP the fight counts (one man takes
it all); his level-ups his choice on his star rolls (four picks, rule 162: melee skill, melee defence, fatigue, ranged
defence; Battle Brothers' wolf three); perks one a level to 11; the purse from the door's 125 (FULL SHELVES, the door's
default), the board's 30 a skull (x1.5 on full shelves) for a job won, nothing for a roaming party, two batteries a night.
A fall is a lost fight (he is downed, never dead; the wipe wakes him in town).
TAKES: every fight day the map hands him a party and he meets it (a job half the time, one to three skulls alike, one in five
a camp; a roaming party the other half, 0 to 8 blocks from town). PICKS: he looks first (MEET BEFORE YOU FIGHT, rule 151(e)),
takes the best-paid job the map sizes at A FEW (2 or 3), and falls back from any roaming party bigger than that (his words:
'make sure he doesn't run into any group too big').

WON IN 100 / FELL IN 100, by ten days (his median level at the window's end in brackets):

| days | TODAY, takes | TODAY, picks | GOOD GEAR, takes | GOOD GEAR, picks | BATTLE BROTHERS' WOLF, takes |
|---|---|---|---|---|---|
| 1-10 | 57 / 43 (4) | 64 / 36 (4) | **90 / 10 (5)** | **96 / 4 (5)** | 95 / 5 (5) |
| 11-20 | 43 / 57 (5) | 55 / 45 (5) | 89 / 11 (6) | 97 / 3 (6) | 95 / 5 (6) |
| 21-30 | 32 / 68 (5) | 55 / 45 (5) | 77 / 23 (7) | 86 / 13 (6) | 81 / 19 (7) |
| 31-40 | 32 / 68 (5) | 53 / 47 (5) | 79 / 21 (8) | 91 / 9 (7) | 84 / 16 (8) |
| 41-50 | 31 / 69 (6) | 50 / 50 (5) | 73 / 27 (9) | 95 / 5 (7) | 77 / 23 (9) |
| 51-60 | 31 / 69 (6) | 47 / 53 (5) | 74 / 26 (10) | 93 / 7 (7) | 74 / 26 (10) |
| **61-70** | 19 / 81 (6) | 32 / 68 (6) | **39 / 60 (10)** | **68 / 30 (8)** | **40 / 59 (10)** |
| 71-80 | | | 42 / 58 (11) | 72 / 26 (8) | 43 / 57 (11) |
| 81-90 | 21 / 79 (6) | 30 / 70 (6) | 42 / 58 (11) | 66 / 34 (8) | 43 / 57 (11) |
| 91-100 | | | 38 / 62 (11) | 67 / 33 (9) | 38 / 62 (12) |

(TODAY's last two rows are days 61-80 and 81-100.)

THE PURSE, median, GOOD GEAR: 287 batteries by day 10, 1,062 by day 50 (takes); 377 and 1,647 (picks). A winning Lone Wolf is
rich: no wages, two batteries a night, and the best-paid jobs sized at two men. TODAY's wolf, who loses half his fights, is not.

What the days say:
1. **The live Lone Wolf loses.** 57 in 100 in his first ten days if he meets what comes, 64 if he picks only the smallest
   parties; he is level 6 at day 100 because a lost fight teaches little. Against his words, the early fights are NOT
   winnable alone in the live game.
2. **In good gear he is the near-god he remembers for sixty days**: 90 to 96 in 100 through day 20, still 73 to 95 to day 60,
   with a closest call under a quarter of his health in 1 or 2 fights in 100. That is 'virtually impossible to kill'.
3. **The turn comes at day 60, and it is a cliff, not a ramp**: the good-gear wolf drops from 74 to 39 in 100 in one window
   (93 to 68 if he picks his fights) the day ours.enemy_tiers switches to its late mix (raiders, marksmen, marauders and a
   leader, from day 60; their skills stepped up at 40). Battle Brothers' turn is a 50 to 100 day ramp with the crisis
   foretold at 50 to 70 and landing at 80 to 100.
4. Between days 20 and 60 the roads grow (four to six men) and the takes wolf loses a fall in four or five; the picks wolf, who
   turns those away, stays at 86 to 95. **Picking the fight is the skill his words describe, and it pays.**

THE FIRST FIFTY DAYS IN ONE LINE A ROW (per run, 100 seeds; 'never lost' is the share of runs with no lost fight in fifty days):

| row | fights | won in 100 | lost fights a run | runs that never lost | his level at day 50 | purse at day 50 |
|---|---|---|---|---|---|---|
| TODAY, takes | 25 | 39 | 15.3 | 0 in 100 | 6 | 612 |
| TODAY, picks | 16.6 | 57 | 7.2 | 0 | 5 | 988 |
| BATTLE BROTHERS' LEVELS IN TODAY'S RAGS, takes | 25 | 45 | 13.7 | 0 | 6 | 612 |
| TODAY, BUYS THE GOOD KIT AS THE PURSE ALLOWS, picks | 16.6 | 78 | 3.7 | 0 | 6 | 739 |
| GOOD GEAR, takes | 25 | 82 | 4.6 | 1 | 9 | 1,062 |
| GOOD GEAR, picks | 16.6 | **94** | **1.0** | **34** | 7 | 1,647 |
| BATTLE BROTHERS' WOLF, takes | 25 | 87 | 3.4 | 5 | 9 | 1,107 |
| BATTLE BROTHERS' WOLF, picks | 16.6 | **96** | **0.6** | **52** | 7 | 1,651 |

THE KIT IS CHEAP AGAINST THE PAY. The TODAY wolf who buys the good kit piece by piece (body first, a week of food kept) has the
reinforced mail (200 batteries) on day 4, the helm (300) and the heater (25) on day 18 and the sword (125) on day 22, in every
seed: the 650-battery kit is three weeks of two-man jobs. So the rags cost him his first three weeks, not his fifty days.
(Whether a town's market shelf carries a 2,000-crown hauberk is RUN TWO's shelf rule, not measured here.)

## 1e. WHAT A HIRE IS WORTH IN THOSE DAYS (the same days, a second man hired; 100 seeds a row)

THE ORDINARY HIRE is the best man the post offers today: a militia (engine/bohemia_goodbros.js deals six lowborn backgrounds,
the militia's ranges the best), level 1, his one star, walking in with his knife (a pistol in our hands) and a padded surcoat,
priced the hall's way: **37 batteries, 1 a night in wage, 2 in food**. THE GOD-TIER HIRE is what the post NEVER offers: a
hedge knight, level 2, rolled in the top quarter of his range, three talents on melee skill, melee defence and fatigue, in his
own mid kit (a winged mace, a kite shield, mail, a nasal helm with mail), priced on Battle Brothers' formula with the hall's
four fifths: **497 batteries, 4 a night in wage**. A hired man down is laid up 30 days; the fight decides who dies.

FIRST FIFTY DAYS, WON IN 100 / LOST FIGHTS A RUN / RUNS THAT NEVER LOST, and the cost:

| the wolf | alone | + the ordinary hire, day 1 | + the god-tier hire, day 1 | + the god-tier hire the day the purse covers him (day 16) | + the ordinary hire, day 25 |
|---|---|---|---|---|---|
| TODAY, picks | 57 / 7.2 / 0 | **43 / 9.4 / 0** | 75 / 4.0 / 17 | | |
| GOOD GEAR, picks | 94 / 1.0 / 34 | **89 / 1.9 / 14** | **97 / 0.5 / 74** | 95 / 0.8 / 48 | 90 / 1.6 / 14 |
| GOOD GEAR, takes | 82 / 4.6 / 1 | **76 / 6.0 / 0** | 87 / 3.2 / 31 | | |
| his level at day 50 (good, picks) | 7 | 7 | 6 | 7 | 7 |
| his purse at day 50 (good, picks) | 1,647 | 1,036 | 441 | 683 | 1,338 |
| the hire dead by day 100 | | 42 to 50 in 100 | 25 to 42 in 100 | 38 in 100 | 49 in 100 |

By ten days (GOOD GEAR, picks): alone 96 / 97 / 86 / 91 / 95 / 93; with the ordinary hire 97 / 94 / 78 / 82 / 80 / 85; with the
god-tier hire 100 / 100 / 96 / 92 / 93 / 95.

Why the ordinary hire makes him WORSE:
1. **The map counts him.** One more man is 10 more strength: the wolf and a level-1 hire are handed a three-skull job of 3 from
   day 1 and 4 from about day 30, where the wolf alone was handed 2 (1c). The job grows by more than the hire adds.
2. **He falls, and he is gone a month.** A level-1 militia in a surcoat goes down in most fights the wolf wins, and a fallen hire
   is laid up 30 days: in the TODAY row the hire stood in only 175 of the 500 first-ten-day fights. Half of them are dead by
   day 100.
3. **He takes half the experience** (the party's 80% is split), and he costs 37 down and 3 a night.

Why the god-tier hire is worth it, if he can be paid: he turns the good-gear wolf's 34 runs in 100 that never lose into 74, and
the live wolf's 57 in 100 into 75. He costs 497 batteries the wolf does not have on day 1 (the purse sits under zero for two
weeks in that row), 4 a night, and a level of the wolf's by day 50. **That is exactly the trade his words describe: early, the
crew grows only for a god-tier man, and only when he is rare and priced like one.** Today the post never offers one.

## 1f. THE OTHER ROWS: THE CADENCE, BATTLE BROTHERS' JOB FLOOR, THE TURN

THE CADENCE (GOOD GEAR, picks, first fifty days): a fight every day: 32 fights, 95 in 100, level 9 by day 50, 3,265 batteries;
every second day: 16.6 fights, 94, level 7; every fourth day: 8.8 fights, 86, level 5. Fewer fights means fewer levels, and the
roads grow by the calendar, not by his fights: **the wolf who fights less is weaker when the turn comes** (days 61-70: 77 in 100
fighting every day, 68 every second, 65 every fourth).

BATTLE BROTHERS' JOB FLOOR, tested (a job never sized for less than a new crew of three, strength 30): the good-gear wolf
82 -> 80 in 100 (takes), Battle Brothers' wolf 87 -> 85, the live wolf 39 -> 31. The floor turns his two-man jobs into three-man
jobs from day 10, and a near-god shrugs at it. It costs the live man in rags the most. (The full Battle Brothers floor, which
holds every company under a strength of about 80 at one size, is bigger than this test: it is a WORLD and RUN question for the
day party_math's numbers are tuned against Grok's formula.)

THE TURN: in every good-gear row the win rate falls 20 to 35 points between days 51-60 and 61-70 and stays there. That is the
day ours.enemy_tiers changes to its late mix (from_day 60). Nothing about the roster or the map changes on day 60. **The good-gear
wolf who picks his fights (level 7 to 8) wins 93 in 100 in days 51-60 and 68 in days 61-70; the one who meets what comes
(level 10) falls from 74 to 39**; Battle Brothers' wolf the same (95 -> 68 picking, 74 -> 40 taking).

## 1g. WHAT IS OFF AGAINST HIS WORDS (measured; the fixes are proposals for the lanes that build them, section 3)

| his words | the live game | off? |
|---|---|---|
| 'you start with a mega god' | a level-4 label on a level-1 body (three door levels give no stats) | **OFF** |
| 'when you get him good equipment' | no gear named for him: he wears YOU's 90-armour rags and the pistol; the good kit is about 650 batteries at the market (three weeks of jobs) | **OFF at the door; reachable by day ~22** |
| 'virtually impossible to kill' (in good gear, early) | in good gear: 94 to 96 in 100 of the first fifty days, one lost fight a run, a third to a half of runs never lose, his worst won fight leaves him at 81% health (median run) | **RIGHT, once he has the gear** |
| the early fights are winnable alone | live: 57 to 64 in 100 in his first ten days; in good gear: 90 to 98 | **OFF live; RIGHT in good gear** |
| 'until the game starts getting harder' | the turn is real and felt, but it is a cliff on day 60 (the late mix switching on), 20 to 40 days before Battle Brothers' crisis, with no warning | **SHAPE RIGHT, DAY AND RAMP OFF** |
| 'no incentive... unless it's god-tier recruits' | an ordinary hire makes him worse in every row (the map counts the hire, the hire falls and is laid up a month, the experience splits); a god-tier hire makes him safer | **RIGHT for the ordinary man** |
| god-tier recruits exist, rare, priced like it, read as exceptional | the post deals six lowborn backgrounds only (farmhand, messenger, butcher, brawler, thief, militia), level 1; no hedge knight, sellsword or swordmaster ever stands at a post | **OFF: none exist** |
| (Battle Brothers) the Lone Wolf meets a new company's jobs alone | ours sizes his jobs at two men for eighty days | different from Battle Brothers, measured mild (the floor costs a good wolf 2 points) |
| (Battle Brothers) a new hedge knight every campaign | every Lone Wolf is the same man (70 / 105 / 65 / 9) | **OFF** |

## 3. THE NUMBERS (the one table's section I, records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md; proposals, nothing reads them yet)

Each is the smallest change that puts his words on the live game, with what it measured to. Better now, never final (rule 178):
every one is re-measured when perks, gear, enemies or acts arrive.

THE DOOR AND THE START (RUN, with RUN TWO's crew screen)
- **wolf.door_gear**: the Lone Wolf's one man carries Battle Brothers' 'great equipment', the hedge knight's own kit off the wiki:
  an arming sword and a heater shield (or the greatsword, his pick at the door), a reinforced mail hauberk (210) and a closed
  flat top with mail (280), and the pistol in his bag so guns first (rule 120(a)) still holds. Measured: his first fifty days
  go from 57 to 94 in 100 won (picks), one lost fight a run, a third of runs never lose. (The bag pistol was not in the bench.)
- **wolf.door_levelups = 3**: three level-ups wait at the door for him to take (four picks of eight each, rule 162), with the three
  perk points he already gets. Measured on top of the gear: 94 -> 96 won, never-lost runs 34 -> 52 in 100. Alone, in rags,
  they buy almost nothing (39 -> 45): the gear comes first.
- **wolf.rolled_per_game**: the knight is rolled anew each game inside the hedge knight's range (melee defence 4 to 8, the Lone
  Wolf page's -2), with three talents; today every Lone Wolf is the same man.
- wolf.funds stand (125 / 100 / 75): with the gear at the door, low funds are Battle Brothers' own trade.

THE RECRUITS AND THEIR PRICES (RUN TWO)
- **recruit.ordinary stays as it is** (37 batteries, 1 a night wage, 2 food): measured, it already teaches the lesson he
  described: an early ordinary hire costs the good wolf 5 points of wins and two thirds of his never-lost runs (34 -> 14 in 100).
- **recruit.rare**: a rare man at the post, Battle Brothers' way: a hedge knight, a sellsword or a swordmaster (our names: road
  knight, gun for hire, blade master), only at a city or a stronghold, never a village or a camp, **3 in 100 a post slot**
  (the wiki's 2.2 to 8.3%; a post of seven men shows one about one week in five); level 2 to 3, rolled in his background's
  range, three talents; priced on Battle Brothers' formula through the hall (base up to 150, 400 for the blade master, + 500 x
  (level - 1)^1.5, + his kit at 1.25, x 0.8): **about 500 batteries at level 2 in mid kit**; wage his background's (a hedge
  knight 4 a night at level 2, BohemiaWages already). Measured: hired the day the purse covers him (day 16 median), the good
  wolf's first fifty days hold at 95 in 100 and his never-lost runs go 34 -> 48; hired on day 1 (on credit) 34 -> 74.
- **recruit.rare_reads_rare**: on the hall's card he shows his background in our name, his three stars lit, the price that
  says it, and one line from his own mouth (rule 133 change 9's card already carries stars, trait, price and night).

THE ENEMY'S RISE BY DAY (COMBAT for the dress, WORLD for the roads and the crisis)
- **enemy.late_from_day: 60 -> 80**, Battle Brothers' crisis window (foretold 50 to 70, landing 80 to 100). Measured today: the
  good-gear wolf falls from 93 to 68 (picks), 74 to 39 (takes) on day 61, with nothing on the map to say why.
- **enemy.late_ramp_days = 20**: the late mix comes in over twenty days (its share rising from nothing to all) instead of on one
  morning, so the turn is felt and seen coming. (Not measured: the bench's next row.)
- **enemy.turn_foretold**: the feed on the city screen (rule 4/9) says it from day 50 to 70, Battle Brothers' foretelling.
- roaming.per_day = 0.1 stands (two to six men by day 40, nine to eleven by 80 to 100): it is what makes him pick his fights.
- job.floor: Battle Brothers holds every company under a strength of about 80 at one job size; ours sizes a lone man's job at
  two. Measured mild (a floor of a new crew of three costs the good wolf 2 points, the live wolf 8). **Not now**: it is a WORLD
  and RUN question for the day party_math is tuned against Grok's formula (ask 105), and it should land only with the door's gear.

THE FIGHT (COMBAT)
- **perk_builds for the melee arms**: rows for the sword, axe, mace, hammer, flail, cleaver, spear and polearm (today a man with a
  sword fights with no perks at all). The bench's sword row: colossus, steel brow, brawny, sword mastery, lone wolf, battle
  forged, shield expert, nine lives, indomitable, killing frenzy.
- The breath rule stays Battle Brothers' (2 a block or miss, 5 a hit, 15 back a turn): it is what makes four men too many for one
  man in heavy armour, and that is right.

## 4. NOTES POSTED (VAMILY.md, on each board)

RUN [lone wolf numbers] (the door and the start), RUN TWO [lone wolf numbers] (recruits and prices, the crew screen's door
levels), WORLD [the enemy's rise by day] (the roads, the turn, the crisis, the floor), COMBAT [the enemy's rise by day] (the late
mix's day and ramp, the melee perk rows, the man rolled per game).

## NOT MEASURED (what this page does not know)
- The bag pistol with the good kit; the greatsword in the campaign (only on the ladder).
- Armour wear between fights, healing days, and the main's injuries carried between fights: every fight starts whole.
- Whether a town's market shelf carries the 2,000-crown hauberk (the market's percentile shelves, RUN TWO).
- The hire's laid-up days are a flat 30 here (the fight rolls them).
- Beasts, the kids, the heavies and the machines on the Lone Wolf (brigands only: the map's roads and clear jobs are brigands).
- The late mix moved to day 80 or ramped (proposals, not played); a full company at day 61+ (the killer company page played
  twelve against late brigands: 99 in 100 at level 11).
- A human hand: AUTO plays the wolf (COMBAT's new brain). A player who backs into a doorway against four will do better.
- Renown's pay multiplier (CLOUT, x1 to x4.5) is not in the purse.

## ROUTED
- RUN: the door's gear and levels (s3). RUN TWO: the rare man at the post, the crew screen's three waiting level-ups, the
  origin's gear on the card. COMBAT: the late mix's day and ramp, the melee perk rows, a man rolled per game. WORLD: the turn
  foretold, the floor question. EYES: plays the Lone Wolf start next round (rule 183(e)); this page's 1a is what it will meet.
- A Grok ask the coordinator may want: the Lone Wolf scenario's exact starting items, talents and pending level-ups
  (lone_wolf_scenario.nut), so 'great equipment' is the game's own list and not the hedge knight's enemy kit.

[bb the Lone Wolf: the jobs are a new company's size from day one (the 0.75 floor); the great gear and three levels are the
origin; the roads and the crisis are what outgrow him]
[analog horror: day 61 nothing on the map changes, and the same road that let him walk through it for sixty days takes him down]
