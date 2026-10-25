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
banks/BOHEMIA_TUNING_LONE_WOLF_10_25_26.json, with its resume cache beside it.

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
| 40 | 7 | 2 | 2 | 2 | 4 | 5 | 6 | 6 | 3 / 3 |
| 50 | 8 | 2 | 2 | 3 | 5 | 6 | 6 | 7 | 3 / 3 |
| 60 | 8 | 2 | 2 | 3 | 5 | 7 | 7 | 8 | 3 / 3 |
| 80 | 9 | 2 | 2 | 3 | 5 | 9 | 9 | 9 | 3 / 3 |
| 100 | 10 | 2 | 2 | 3 | 5 | 10 | 11 | 11 | 3 / 3 |

Read it plainly: **a lone man's job is two men, at any skull, for fifty days and more** (a three-skull job reaches three at
level 8). Only the ROAMING parties grow: two on day one, four by day 20, six by day 40, nine to eleven by days 80 to 100.
The blocks from town barely move it (0.1 a block). So in ours the jobs never outgrow him and the roads do, which is
Battle Brothers' shape for the roads, but NOT for the jobs: Battle Brothers holds every early company's job at one floor
(section 2), so its Lone Wolf meets a new company's job, three men and more, from day one. A hire changes the job too: the
wolf and one level-1 man meet a three-skull job of 3 from day 1 and 4 from day 30 (his strength counts in full).

---------------------------------------------------------------------------------------------------------------------------
(sections 1b, 1d to 1g, 3 and 4 land in the next pieces of this round)
