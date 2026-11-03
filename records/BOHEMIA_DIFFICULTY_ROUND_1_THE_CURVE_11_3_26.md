# DIFFICULTY ROUND 1: THE CURVE (11/3/26; VAMILY rule 351(c)(d), ask line 363)

HIS WORDS (records/BOHEMIA_PAOLO_THE_CEILING_AT_DAY_20_11_3_26.md): "I'm at day 20 with like 10 super soldiers... I'm playing on the easiest
difficulty. I started with Lonewolf because that's definitely my favorite way to play... I want to be able to change the difficulty right now...
three difficulties... the beginning of the game is so fucking tough... as the game goes out and out and out, I feel like Battle Brothers kinda got
too easy... only because I had kick ass formation... you can play on the hardest difficulty in the early game isn't gonna be just a fucking hell...
even with a beef up Lone wolf character... no one can kill me... I reached the ceiling."
HIS EARLIER VOTES THIS STANDS ON: 'easier than Battle Brothers' (rule 117, 10/18); 'make it just slightly harder than that' (the 70 line,
10/18); 'whatever Battle Brothers does, I don't need you to do this' on THE DIFFICULTY DIALS (10/1): so the levels are Battle Brothers' own
three, translated, and nothing here asks him a technical question.

## 0. THE ANSWER IN PLAIN WORDS
1. HIS CEILING IS MEASURED, AND IT IS BATTLE BROTHERS' OWN SHAPE. On the easiest level every company won the day's hardest job 100 times in
   100 from day 7 to day 30. On the hardest level a Lone Wolf won a day-5 job 20 in 100 (hell), then 100 from day 25. The start is brutal and
   the end is flat, the U the developers and players describe.
2. THE CAUSE IS ONE LINE IN OUR MATH: an enemy crew is dressed for the CALENDAR'S day at most, so a company standing at day-57 strength on day
   20 still meets day-20 men, and the late kinds (marauders, a leader, champions) wait for day 60. The hardest level adds 20 days to the dress
   from day one, which is why its start is hell and its end is not.
3. THE PLAN: (a) THE SWITCH: the three levels he knows from the door (NEW HERE, SEEN IT, OUTLIVED IT, draft names) on the game's settings
   card behind the gear, changed any time, from the next fight. (b) THE CURVE: after the first week a strong company meets the men its strength
   stands for, sooner on a harder level (about day 29, 25, 19); the hardest level's start is one step tougher, never the middle game on day one;
   Battle Brothers' brigand leaders join the middle game (the wiki's words) and its champions join the late game (rows we already hold). Every
   number in the data files, nothing new in the fight's code.

## 1. HOW BATTLE BROTHERS SCALES THE THREAT (the wiki copy in the repo, reference/library/grok/wiki/PAGES_ALL.tar.gz, read this round)
- CONTRACTS grow with THE ROSTER, not the day: "Contract difficulty scales with the strength of your roster (which equals a sum of
  individual strengths [10 + 2*(lvl-1)] of 12 strongest brothers), the difficulty rating (skulls), the type of contract" (bb_all/0828
  Game Mechanics:105); "contract-spawned mobs and locations are always closely matched to the player's party" (:109). The multiplier is
  0.94 x (strength/100)^0.89, held to 0.75..5 (Grok 105, already in party_math.json job_bb). The ^0.89 BENDS DOWN: a roster twice as
  strong meets 1.85 times the men.
- ROAMING PARTIES AND LAIRS grow with TIME and DISTANCE: "scales mostly with distance to civilization and time. Roaming parties also
  scale slightly with player strength... non-contract locations don't scale with player strength at all" (:107).
- WHAT THE DAYS DO: kinds and stats step at day gates: thugs early, raiders, then marauders "in the middle game", a leader in most late
  groups (bb_all/0299 Brigands); a raider's melee 65 "before day 40, 70 after" (bb_all/0297); the marauder's best armour "only after day
  60" (bb_all/0293). Three-skull contracts "start to appear only after a few days have passed" (bb_all/0626 Developer Posts).
- CHAMPIONS (bb_all/0363 Champions): "stronger versions of enemies that always have a named item", 1.35 health, 1.15 skill, 1.25
  defence, 1.5 resolve, 1.15 damage; each kind has a base chance (a brigand leader 1%, an orc warrior 1%, an orc warlord 10%), "1 skull
  contract -99%, 3 skulls contract +5%, before day 90 -1%". So before day 90 a champion is a three-skull thing, about one slot in twenty.
  OUR DATA ALREADY HOLDS THE ROWS: brigand_leader_champion, orc_warrior_champion, goblin_skirmisher_champion (records/target/bb/
  enemies.json); played this round on the live fight, headless, they stand and fight with no new code.
- THE DIFFICULTY LEVELS (bb_all/0828:14-27, TUNING's 10/9 page): combat difficulty is a 5-point hit roll on Beginner only, "harder enemy
  groups appear sooner" on Expert, the crisis 5 days later on Beginner; "Enemies will carry the same equipment with the same stats on
  all difficulty levels" (:64). Set ONCE, at the start.

## 2. WHY ITS LATE GAME GOES FLAT (the developers, then the players)
- THE DEVELOPERS, in their own words (bb_all/0626 Developer Posts): "We agree that the endgame is a weak spot of the current game as
  players tend to outscale enemies a lot through perks and character stat progression." And why: "Enemies use most of the weapons
  throughout the game as enemies do not level like the player does." Your men climb eleven levels and wear famed gear; theirs step
  three times on the calendar.
- THE PLAYERS (Steam discussions): "Combat difficult just slows scaling of the enemies. In lategame combat difficulty makes no
  difference." "I'd recommend Expert difficulty, then it feels quite balanced, otherwise if you know what you're doing it is a bit too
  easy." "Building a small number of brothers to level 11 before hiring more makes the game much easier than straight up hiring 12
  brothers ASAP" (the roster counts heads, so a few strong men are under-counted). And the other half: "the beginning of the game is
  so tough" is his own, and players call the early scaling "artificial scaling and capping at its ugliest".
- SO THE CURVE IS A U: brutal at the start (one skull is sized for 'about 8 level 1 characters', the 0.75 floor), easy at the end (the
  count bends down at ^0.89, the kinds step on the calendar, the difficulty only slows the calendar).

## 3. WHAT ITS MODDERS DO ABOUT IT (nexusmods, GitHub)
- HARDENED (darxo/hardened, GitHub): "Most vanilla difficulty scaling methods (day/player strength/renown scaling) are disabled";
  contracts get "1% more difficult for every 10 Renown, up to a maximum of 1000%", pay rises the same; every other encounter "1.3% more
  difficult per day, up to 400% at day ~300". The threat follows WHAT YOU HAVE DONE, not what you carry.
- LIMIT BREAK and SOULS MODE (Steam): remove the scaling caps, and push Expert's party step "from 1.15 to 1.5".
- A party-size mod (nexusmods 341): "keep late-game difficulty climbing by enlarging enemy parties".
- MAX BROTHERS SCALE (nexusmods 587): choose how many brothers count, the strongest first.
- LEGENDS players: "runs go as long as 800 days with no easy dip" under its recruit scaling.
  The common thread: THE CAP AND THE BEND are the ceiling; the fixes lift the cap and tie the threat to the company.

## 4. HOW THE BEST-LOVED TACTICS GAMES KEEP THE LATE GAME HARD
- XCOM 2: a hidden FORCE LEVEL rises with the campaign's date (a modding thread: "The force level of a mission... is based on the date
  in the game"), and it changes WHO comes (new enemy kinds), not only their numbers; the Avatar clock keeps pressure on top.
- DARKEST DUNGEON: a hero two resolve levels above a dungeon "will refuse to be added to the party" (the wiki): a strong team cannot
  farm the easy work, so the board itself rises to meet it.
- INTO THE BREACH: each island gets harder "the more other islands you cleared", and the final fight scales with how many you cleared:
  the threat reads your PROGRESS, not a clock.
- WHAT THEY SHARE, AND WHAT WE TAKE: the threat is tied to how strong you have become, it shows up as NEW KINDS and elites (not just
  more bodies), and the start is gentle because it is measured against a weak company.

## 5. OUR GAME, MEASURED (tools/bohemia_difficulty_the_curve.js; the live fight headless, AUTO both sides, 20 fights a point, the map's own job
## math line for line; raw in banks/BOHEMIA_DIFFICULTY_THE_CURVE_BEFORE_11_3_26.json, draft:true)
THE COMPANIES (a growth line, said plainly: the fights do not feed back into who he hires): LONE WOLF = the door's own level-4 hedge knight in his
kit, alone to day 5, then a good hire every couple of days, 10 men on day 20 (his game), 12 on day 30, the town's armour from day 10 and the
city's from day 20. FULL CREW = the Block Watch's twelve from day 1, level 1 to 6 by day 30, the town's shelf from day 12, the city's from day 24.
THE JOB = one skull to day 3, two to day 7, then the hardest the board offers (three skulls); factions in turn (brigands twice, machines, kids,
heavies). Beasts are left out of every line alike (WORLD's curve keeps them off a lone man's board).

LONE WOLF (the day's hardest job: won in 100 / men struck down a fight / men killed a fight / his men v theirs)
| level | day 1 | day 3 | day 5 | day 7 | day 10 | day 13 | day 16 | day 20 | day 25 | day 30 |
|---|---|---|---|---|---|---|---|---|---|---|
| NEW HERE | 100 / 0 / 0 | 100 / 0 / 0 | 70 / 0.3 / 0 | 100 / 0.15 / 0.05 | 100 / 0 / 0 | 100 / 0 / 0 | 100 / 0 / 0 | 100 / 0.25 / 0 | 100 / 0.45 / 0.15 | 100 / 0.1 / 0.05 |
| SEEN IT | 100 / 0 / 0 | 90 / 0.1 / 0 | 55 / 0.45 / 0 | 80 / 0.65 / 0.1 | 95 / 0.4 / 0 | 100 / 0 / 0 | 100 / 0.2 / 0.05 | 100 / 0.3 / 0 | 100 / 0.25 / 0.35 | 100 / 0.25 / 0.05 |
| OUTLIVED IT | 85 / 0.15 / 0 | 75 / 0.25 / 0 | 20 / 0.8 / 0 | 50 / 1.15 / 0.15 | 45 / 1.6 / 0.15 | 80 / 0.85 / 0.25 | 80 / 1.45 / 0.5 | 90 / 1.35 / 0.3 | 100 / 0.3 / 0.15 | 100 / 0.25 / 0.1 |
| men v men (SEEN IT) | 1 v 1.6 | 1 v 2.4 | 1 v 3.8 | 2 v 3.8 | 3 v 4.8 | 5 v 4.8 | 7 v 7 | 10 v 10.2 | 11 v 10.2 | 12 v 10.2 |

FULL CREW (the day's hardest job: won in 100 / men struck down a fight / men killed a fight / his men v theirs)
| level | day 1 | day 3 | day 5 | day 7 | day 10 | day 13 | day 16 | day 20 | day 25 | day 30 |
|---|---|---|---|---|---|---|---|---|---|---|
| NEW HERE | 100 / 0.05 / 0.05 | 100 / 0 / 0.05 | 100 / 0.25 / 0.2 | 100 / 0.35 / 0.2 | 100 / 0.35 / 0.1 | 100 / 0.15 / 0 | 100 / 0.15 / 0.1 | 100 / 0.4 / 0.35 | 100 / 0.55 / 0.1 | 100 / 0.45 / 0.05 |
| SEEN IT | 100 / 0.05 / 0 | 100 / 0.25 / 0.05 | 95 / 0.65 / 0.2 | 100 / 0.5 / 0.2 | 95 / 1.65 / 0.2 | 100 / 0.15 / 0 | 100 / 0.3 / 0.05 | 90 / 1.9 / 0.4 | 100 / 0.25 / 0.25 | 100 / 0.6 / 0.2 |
| OUTLIVED IT | 95 / 1.25 / 0.15 | 100 / 0.65 / 0.25 | 85 / 3.1 / 0.85 | 75 / 4 / 0.75 | 50 / 5.65 / 1.3 | 90 / 2.25 / 0.55 | 90 / 2.65 / 0.45 | 90 / 2.4 / 0.25 | 100 / 0.6 / 0.15 | 100 / 0.9 / 0.2 |
| men v men (SEEN IT) | 12 v 3 | 12 v 3 | 12 v 5.4 | 12 v 6.4 | 12 v 8 | 12 v 9.2 | 12 v 9.2 | 12 v 10.2 | 12 v 10.2 | 12 v 10.2 |

STASH (batteries, one job a day, 30 a skull won, 2 a man a night)
wolf|new {"1":153,"3":209,"5":298,"7":403,"10":657,"13":901,"16":1133,"20":1421,"25":1765,"30":2099}
wolf|seen {"1":153,"3":205,"5":277,"7":360,"10":587,"13":826,"16":1058,"20":1346,"25":1690,"30":2024}
wolf|out {"1":149,"3":191,"5":228,"7":273,"10":383,"13":541,"16":719,"20":958,"25":1284,"30":1618}
crew|new {"1":131,"3":143,"5":215,"7":287,"10":485,"13":683,"16":881,"20":1145,"25":1475,"30":1805}
crew|seen {"1":131,"3":143,"5":211,"7":281,"10":470,"13":664,"16":862,"20":1103,"25":1415,"30":1745}
crew|out {"1":130,"3":141,"5":199,"7":244,"10":330,"13":465,"16":636,"20":864,"25":1176,"30":1506}

TWO SKULLS from day 10: crew new d10 100, crew new d13 100, crew new d16 100, crew new d20 100, crew new d25 100, crew new d30 100, crew out d10 70, crew out d13 100, crew out d16 100, crew out d20 90, crew out d25 95, crew out d30 100, crew seen d10 100, crew seen d13 100, crew seen d16 100, crew seen d20 95, crew seen d25 100, crew seen d30 100, wolf new d10 100, wolf new d13 100, wolf new d16 100, wolf new d20 100, wolf new d25 100, wolf new d30 100, wolf out d10 85, wolf out d13 100, wolf out d16 100, wolf out d20 100, wolf out d25 100, wolf out d30 100, wolf seen d10 100, wolf seen d13 100, wolf seen d16 100, wolf seen d20 95, wolf seen d25 100, wolf seen d30 100

WHAT THE TABLES SAY: on NEW HERE nothing past day 5 ever beats either company (his ceiling, before day 20 already); on SEEN IT the hardest job is
90 to 100 from day 10 on; on OUTLIVED IT the Lone Wolf's day 5 is 20 in 100 and the crew's day 10 is 50 with 5.65 men struck down a fight,
then both climb to 100 by day 25 (the U). The dress column of the bank reads the calendar's day at every point from day 7: the strength never
moved it (the cause, s0.2). The stash is never the squeeze on any level (over 1,500 batteries by day 30): the money half is ECONOMY's.

## 6. ONE FINDING THAT PROVES US WRONG
THE HARDEST LEVEL WAS HARD IN THE WRONG PLACE. Our 'outlived it' added 20 days to every crew's dress from day one (ours.json enemy_tiers
difficulty_days), which is Battle Brothers' Expert in miniature: the middle game's marauders and marksmen against one man on day 1, and nothing
new for a strong company on day 25. The number meant to make the late game hard made only the start hard.

## 7. THE PLAN, BUILT IN ROUND 2 (numbers in the data files; the switch in the settings)
- THE SWITCH: one FIGHTS row on the settings card (slices/bohemia_difficulty.js), the door's own three ids, written where the door keeps its
  pick, so the map's party math and the shell's hand-over both read it; it holds from the next fight; the crew already counted on a card keeps
  its count. Not on the start screen (rule 348).
- THE THREAT MEETS THE COMPANY (party_math.json job_bb.dress_ahead): after the first week each calendar day counts 2.5, 3 or 4 days by level,
  never past the day the company's own strength stands for. A weak company meets the easy dress on every level; a strong one meets the late
  kinds about day 29, 25, 19.
- THE HARD START, NOT HELL (ours.json enemy_tiers.difficulty_days): OUTLIVED IT's +20 becomes +8: day one is the early phase (thugs and lower
  raiders), never the middle.
- THE LEADER IN THE MIDDLE GAME (ours.json enemy_tiers.mix): "Brigand Leaders start appearing in the middle game" (bb_all/0290).
- THE CHAMPIONS (ours.json enemy_tiers.mix late): brigand_leader_champion, goblin_skirmisher_champion (KID), orc_warrior_champion (HEAVY), at
  about one slot in twenty, Battle Brothers' own +5% on a three-skull job.
- KEPT: the hit chances (+5 / +5 / Battle Brothers' own), the crew sizes (0.85 / 1 / 1.15), the 13 most a job sends (his frames, his worry),
  the Lone Wolf's body on every level, the first day's cap.

## ROUTED
- DIFFICULTY round 2: the switch and the numbers above (this lane).
- ECONOMY (NOTE): the stash never squeezes on any level (over 1,500 by day 30); Battle Brothers' economic difficulty (pay 90% and prices 10%
  lower on Expert) is not in our three levels yet.
- WORLD (NOTE): the day-fifty curve reads the job's worth; a level change moves the worth, so the board re-reads after a switch.
[bb the ramp: Battle Brothers grows a contract with the roster but dresses it by the calendar, and lets the difficulty only slow the calendar;
ours dresses a strong company by its strength, sooner on a harder level, so the late game rises to meet it]
[analog horror: the men on the road get better because you did; nobody says so, the coats just get heavier]

## SOURCES (read this round)
- The wiki copy: reference/library/grok/wiki/PAGES_ALL.tar.gz, bb_all/0828 Game Mechanics, 0363 Champions, 0626 Developer Posts, 0290 Brigand
  Leader, 0293 Brigand Marauder, 0297 Brigand Raider, 0299 Brigands (CC BY-SA 3.0, battlebrothers.fandom.com).
- Players: https://steamcommunity.com/app/365360/discussions/0/154644928863774838 ,
  https://steamcommunity.com/app/365360/discussions/3/1752400953962015191 , https://steamcommunity.com/app/365360/discussions/0/2971775284257693403
- Modders: https://github.com/darxo/hardened (Hardened), https://www.nexusmods.com/battlebrothers/mods/341/ (bigger late parties),
  https://www.nexusmods.com/battlebrothers/mods/587/?tab=posts (Max Brothers Scale)
- XCOM 2: https://forums.nexusmods.com/topic/3797990-alertlevel-and-forcelevel ; Darkest Dungeon: https://darkestdungeon.wiki.gg/wiki/Resolve ;
  Into the Breach: https://steamcommunity.com/app/590380/discussions/0/1697167168520657423
