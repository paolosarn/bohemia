# HOW BATTLE BROTHERS SCALES THE ENEMY TO THE COMPANY, AND WHAT A STRONG COMPANY GOES AFTER (BESTIARY 3 11/27, VAMILY rules 491(c)(e), 493(b): RESEARCH FIRST, every row cited by its page file in reference/library/grok/wiki/PAGES_ALL.tar.gz; for the fresh BESTIARY's rule 491 build and the champions)


Source: the Battle Brothers wiki dump, `scratchpad/wiki/bb_all/` (2,255 pages). Every claim cites its page file.
Big pages carry a line number (`L123`). The two richest pages are `0827_Game Guide.txt` (formulas pulled
from the game scripts) and `0626_Developer Posts.txt` (Overhype dev answers on Steam and the forums).
Where two pages disagree, both are given and the newer or script-based one is marked.

---

## A. How enemy parties scale to the player

### A1. Three channels, three different rules (the core finding)

| What spawns the enemy | What it scales with | How tightly | Cite |
|---|---|---|---|
| **Contract** enemies (and the locations a contract fills) | contract type, skulls, **roster strength**, combat difficulty, contract-specific factors (an escort gets harder the longer the road), and time | tightly: "always closely matched to the player's party" | 0828_Game Mechanics.txt; 0626_Developer Posts.txt L5392 |
| **Roaming parties** | mostly **distance to civilization** and **time**; "slightly" with player strength; "a significant random factor" | loosely | 0828_Game Mechanics.txt; 0626 L5392, L5399 |
| **Non-contract locations** (camps, lairs, ruins) | distance to civilization, time passed, location type ("resources"); **never** player strength | not at all | 0626 L5392, L5442; 0828_Game Mechanics.txt |
| **Arena** | roster strength (main), days + arena wins (minor, capped at 50), times 12 / roster size | tightly | 0131_Arena.txt |

Consequence the wiki spells out: far-off camps are deadly early and become "juicier targets for unique hunting"
late, because they do not grow with you (0828_Game Mechanics.txt).

### A2. Roster strength, the one number (script values)

- Each man is worth **10 + 2 x (level - 1)**. Only the **12 strongest** count (14 for the Peasant Militia origin).
  A party under 3 men counts each man as +10 whatever his level (0827_Game Guide.txt L228; 0828_Game Mechanics.txt).
- Contract multiplier = **0.94 x (roster strength / 100) ^ 0.89**, clamped to **0.75 .. 5.0**
  (0.75 = 78 strength, about 8 level-1 men; 5.0 = 654 strength, about 12 men near level 21), then times the
  combat difficulty: **Beginner 0.85, Veteran 1.00, Expert 1.15** (0827_Game Guide.txt L230-234).
- **Gear is not counted.** "From further testing, gear does not appear to have an impact on roster strength"
  (0828_Game Mechanics.txt). The devs tried: "we also tried to figure the equipment into the value but it is very
  tricky", because a light-armoured late archer and a plated tank of the same level are both valid (0626 L1254).
- **Renown is not counted** for difficulty, only for pay (0827_Game Guide.txt L139; 0626 L5392). Conflict: the
  Renown page's in-game blurb says renown makes "your enemies spend more resources" against you
  (1679_Renown.txt); the script-based guide and the dev both say no. Trust the guide and the dev.
- The spawn list caps it: "The maximum number and type of enemies is limited by the spawn list used (the difficulty
  doesn't scale indefinitely)" (0827_Game Guide.txt L238). The devs: "we'll not scale enemies with you
  indefinitely" (0626 L3410).

Worked values of the multiplier (computed from the formula above):

| Company | Strength | Multiplier |
|---|---|---|
| 3 men, level 1 | 30 | 0.75 (floor) |
| 12 men, level 1 | 120 | 1.11 |
| 12 men, level 4 | 192 | 1.68 |
| 12 men, level 7 | 264 | 2.23 |
| 12 men, level 11 (last perk level) | 360 | 2.94 |
| 12 men, level 15 | 456 | 3.63 |
| 12 men, level 20 | 576 | 4.47 |
| 12 men, level 24 | 672 | 5.00 (cap) |

The known exploit: keep a small roster so contracts stay small. "Each additional level 1 character before 12 ... is
worth 6 levels in strength" (guide's wording; by the formula a new man adds 10 points = 5 level-ups)
(0827_Game Guide.txt L236). The arena closes it with a **12 / roster size** multiplier: 12 men at level 11 gives
3.9; the same 12 plus 8 more men gives 2.6; 25 men gives 2.2 (0131_Arena.txt).

### A3. Contract difficulty formula

`difficulty = type base (40..200) x skull roll x roster multiplier (0.75..5) x combat difficulty (0.85/1/1.15)`

| Skulls | Difficulty roll | Cite |
|---|---|---|
| 1 | 70% - 85% | 0827_Game Guide.txt L221-225 |
| 2 | 95% - 105% | same |
| 3 | 105% - 135% | same |

Locations a contract sends you to are **re-rolled to the contract's difficulty**: a vampire coven on a low-skull job
can hold Ancient Auxiliaries instead of Necrosavants, and 1- or 2-skull jobs **wipe the named items** the location
held (0441_Contracts.txt; 0827_Game Guide.txt L930).

### A4. Days, the second clock (locations, roaming parties, unit stats)

- A non-contract location **swaps its whole defender roster every 10 days** from its resources (distance, time,
  type): Geists one visit, a Necromancer two weeks later (0626 L5442).
- Combat difficulty: "On higher combat difficulty harder enemy groups appear sooner"; it "increases both numbers
  and tier (more higher tier mobs like Brigand Leaders)" (0828_Game Mechanics.txt). Enemies carry the **same
  equipment on every difficulty** (0828_Game Mechanics.txt). (An old launch-week dev post said numbers were the
  same on all difficulties, 0626 L3808; the current mechanics page supersedes it.)
- Many enemy types get **flat upgrades after a day threshold**, a quiet time curve inside the unit itself:

| Unit | Upgrade | Day | Cite |
|---|---|---|---|
| Brigand Marksman | Bullseye perk; ranged def 10 -> 15 | 20; 40 | 0294_Brigand Marksman.txt |
| Barbarian Thrall | Relentless | 20 | 0193_Barbarian Thrall.txt |
| Armored Wiederganger | 2x fatigue inflicted | 20 | 0147_Armored Wiederganger.txt |
| Barbarian Beastmaster, Drummer | Dodge | 30 | 0178_Barbarian Beastmaster.txt; 0182_Barbarian Drummer.txt |
| Brigand Raider | melee 65 -> 70, ranged 55 -> 60 | 40 | 0297_Brigand Raider.txt |
| Nomad Outlaw, Cutthroat | Dodge | 40, 35 | 1449_Nomad Outlaw.txt; 1438_Nomad Cutthroat.txt |
| Goblin Skirmisher | Backstabber; melee def 20 -> 25 | 50 | 0872_Goblin Skirmisher.txt |
| Brigand Marauder | heavy lamellar (255) and closed-mail helms (245) join the gear pool | 60 | 0293_Brigand Marauder.txt |
| Barbarian Reaver | Relentless | 60 | 0189_Barbarian Reaver.txt |
| Unhold, Wiederganger, Fallen Hero | 1.1x damage | 90 | 2071_Unhold.txt; 2205_Wiederganger.txt; 0732_Fallen Hero.txt |
| Ancient Honor Guard / Legionary (polearm) | Polearm Mastery | 100 | 0089_Ancient Honor Guard.txt |
| Goblin Ambusher | direct damage 1.25x -> 1.35x | 180 | 0864_Goblin Ambusher.txt |
| Orc Warrior, Warlord | melee +5, damage +0.1x | 200 | 1501_Orc Warrior.txt; 1498_Orc Warlord.txt |
| Schrat | melee 70 -> 75 | 250 | 1737_Schrat.txt |

### A5. Who only shows up later (composition by stage)

| Faction | Early | Mid | Late | Cite |
|---|---|---|---|---|
| Brigands | Thugs, some Raiders | more Raiders, archers, larger groups, armoured Marauders | a Brigand Leader (rarely two) plus elites; whole Marauder parties | 0299_Brigands.txt; 0290_Brigand Leader.txt; 0293_Brigand Marauder.txt |
| Barbarians | Thralls with throwing weapons, Reavers | | armoured Chosen, whole Chosen warbands, Armored Unholds with Beastmasters | 0195_Barbarians.txt; 0179_Barbarian Chosen.txt |
| Nomads | southern brigands | gain Dodge | Nomad Leaders and elites, mostly in big camps | 1455_Nomads.txt |
| Undead | | | Necrosavant: "a challenge for max level merc bands" | 0626 L1953 |

The world map label ("weaker", "stronger") is **relative to the player's estimated strength**, not absolute
(1415_News and Dev Blogs.txt L3048; 0626 L4048). Lair tooltips give counts in words:
A = 1, A few = 2-3, Some = 4-6, Many = 7-10, Lots = 11-13, A plethora = 14+ (0828_Game Mechanics.txt).
Party map speed scales with party size, so small parties catch you and big ones can be outrun (0626 L3438).

---

## B. Contract difficulty and pay

### B1. How skull ratings show up
- The wiki has no exact offer-mix table. What it states: the early game spawns **exclusively 1-skull** contracts for
  a set span, which the devs lengthened (0626 L1925); **3-skull contracts only appear after a few days** (0626 L3445).
- Contracts appear where the threat really is: "contracts appear when there is actually a specific threat in the
  vicinity" (orcs near a border town, direwolves near a village) (1415_News and Dev Blogs.txt L1321-1340, Dev Blog 83).
- Renown gates the list: noble contracts open at **'Professional', 1,050 renown** (the Make Nobles Aware ambition)
  (1234_Make Nobles Aware.txt); "Higher renown unlocks more (and usually more difficult) contracts" (0626 L5399).
- One active contract at a time (0441_Contracts.txt). Skulls are "rough estimates"; equipment and tactics decide
  how hard it feels (1415_News and Dev Blogs.txt L2001).

### B2. Pay formula (script values, 0827_Game Guide.txt L117-175)
`pay = type base (400 'Return Item' .. 2,000 'Find Artifact') x random 0.9-1.1 x skull roll x renown multiplier x economic difficulty x haggling`

| Factor | Values |
|---|---|
| Skull roll (pay) | 1 skull 63-81%; 2 skulls 94-107%; 3 skulls 120-148% |
| Renown multiplier | (renown x 0.003) ^ 0.39, clamped 1.35 (720 renown) .. 2.7 (4,256 renown). "Renown has the biggest impact of all modifiers on contract payments" |
| Economic difficulty | -10% pay per level (0828_Game Mechanics.txt) |
| Haggling | +3% to +10% per success (guide) or +4-11% (0441_Contracts.txt); each try adds 3-6 annoyance, 9 ends talks |

Worked example (type 1,000, mid rolls): 1 / 2 / 3 skulls pay about 1,290 / 1,810 / 2,410 at 1,500 renown, and
1,940 / 2,710 / 3,620 at 4,256 renown. So a 3-skull job pays about 1.9x a 1-skull one, while its fight is only
about 1.55x bigger (120% vs 77.5% mid rolls): **the hard job is the better deal per enemy**, and that is the lure.
The devs also tuned the curve late: "Changed contract payments to be lower in the very late game" and "difficulty
curve in the mid and late game to be a bit smoother" (1415_News and Dev Blogs.txt L728, L812).

---

## C. What a strong company goes after

### C1. Champions (0363_Champions.txt; 0599_Dev Blog 121: Champions.txt; 0827_Game Guide.txt L938-952)
- "Stronger versions of enemies that **always have a named item**." Skull mark on the token, **unique generated
  name**, "in a way, minibosses." Only certain non-beast types qualify.
- Chance (additive): base per type, **1-skull contract -99%**, **3-skull +5%**, **early game -1%** (champions page
  says before day 90; the script guide says days < 101), Bounty Hunter follower +3%.
- Base chances: 1% for most (Brigand Leader, Orc Warrior, Necromancer, Officer, Barbarian Chosen, goblins),
  2% for elite humans (Knight, Hedge Knight, Swordmaster, Master Archer, Gladiator, Nomad Executioner),
  **10% for the bosses** (Barbarian King, Orc Warlord). So most types are **zero before about day 100** unless
  the contract is 3-skull. A 3-skull goblin job with 20 eligible goblins at 5-6% each gives one or more champions
  about 64-71% of the time (computed), which is why the guide names it the best champion farm.
- Stats (multiplicative, applied after shields and perks): HP x1.35, melee/ranged skill x1.15, defences x1.25,
  resolve x1.5, initiative x1.15, fatigue x1.5, **damage x1.15**, XP x1.5. Then **either** HP x1.35 again (total
  1.82) **or** defences x1.25 again (total 1.56), picked by the base defence. A champion Swordmaster's melee
  defence: 80 -> 125.
- Kit: the Brigand Leader champion rolls **25% named weapon / 25% named armour / 25% named helmet / 25% named
  shield**, and fills the other slots with **top-tier regular kit** (Noble Sword, Greatsword, Warhammer; mail
  hauberk; closed-mail kettle hat) (0291_Brigand Leader (Champion).txt). Extra perks too (Nine Lives, Underdog,
  Executioner, all masteries).
- Prize: the named weapon, armour and helmet **always drop, even at zero durability**; a named shield is lost if you
  break it (0363_Champions.txt).
- Guaranteed champions: a 3-skull **Decisive Battle** always has a champion Knight leading the enemy army
  (0535_Decisive Battle.txt). The **Barbarian King** contract spawns the King with a warhost at the nearest barbarian
  location (1943_The Barbarian King.txt). **Confront Warlord** (greenskin crisis) lures the Orc Warlord out by
  killing his parties and camps (0432_Confront Warlord.txt).
- Their designed place on the ladder: champions "fill the gap in challenge between defeating your first late game
  crisis and starting to take on Legendary Locations" (0599_Dev Blog 121: Champions.txt).

### C2. Named items, and where they come from (1404_Named and Legendary Items.txt; 0827_Game Guide.txt L905-990)
- Named = rare, unique look, **randomized stats, a name "oftentimes their former owner"**, red glow. Legendary =
  one per campaign, near-magic effect, blue glow.
- Weapon roll: durability always changes (x0.9-1.4), then **two random stats** improve: damage x1.1-1.3, direct
  damage +8-16%, armour damage +10-30%, shield damage x1.5-2, head-hit +10-20%, fatigue penalty x0.5-0.8, skill
  fatigue -1..3 (1403_Named Weapons.txt). Armour: durability x1.1-1.25, fatigue +3-9 (1337_Named Armors.txt).
  Name pools per type, e.g. axes: Splitter, Menfeller, Widowmaker, Shieldbreaker (1338_Named Axe.txt).
- Only four sources: **enemy locations, champions, specialised shops, events**. Faction named gear drops only from
  that faction's camps and champions (0827_Game Guide.txt).
- Location chance = **(Resources + 4 x Distance) / 5 - 37** percent; a second item at roughly half that. Base by
  type: big places 23-33% (Orc Settlement, Goblin Settlement, Necropolis, Buried Castle), small hideouts -23%
  (never) (1404_Named and Legendary Items.txt). Tavern rumours reveal, never create, one (0827_Game Guide.txt).
- Shops: each item type rolls 1% rarity three times; weaponsmith 30%, fletcher 50%, armourer 33% selection; stock
  lasts up to 3 days; good town situations raise the odds (0827_Game Guide.txt).

### C3. Legendary locations (1161_Legendary locations.txt; 0584_Dev Blog 106: Legendary Locations.txt)
"About a dozen" per campaign; "the more distant a location from civilized lands, the more challenging"; each gives
"a unique reward ... that can't be obtained in any other way" (Dev Blog 106).

| Place | The fight | The prize | Cite |
|---|---|---|---|
| Black Monolith | 47: 15 Legionaries, 6 Necrosavants, 22 Honor Guards, 3 Priests, The Conqueror | The Emperor's Armor (400, reflects 25% melee damage) | 0243_Black Monolith.txt |
| Rul'gazhix (goblin city) | first destroy 10 goblin parties or raze 5 outposts; then 47 goblins (16 skirmishers, 13 ambushers, 11 wolfriders, 4 shamans, 3 overseers) | The Emperor's Countenance | 1717_Rul'gazhix.txt |
| Sunken Library | The Lorekeeper, 10 phylacteries, 12 Honor Guards, 3 treasure hunters | The Black Book | 1896_Sunken Library.txt |
| Witch Hut | 4 Hexen, 7 direwolves, 3 webknechts, 2 unholds, 3 nachzehrers | Obsidian Dagger (raises kills as your undead) | 2223_Witch Hut.txt |
| Watermill | only after you kill the Kraken; 9 Fallen Betrayers, 2 Fallen Heroes, the Rachegeist | Reproach of the Old Gods + Rachegeist's Helm | 2188_Watermill.txt |
| Stone Pillars | fetch 3 unhold hides then 3 ashes, then the Kraken | Sword Blade | 1883_Stone Pillars.txt |
| Icy Cave -> Hunting Ground | your top-XP man duels the Barbarian Madman alone; that unlocks the Ijirok | Armor + Helmet of the Ijirok (heal 10 HP a turn) | 1057_Icy Cave.txt; 1045_Hunting Ground.txt |
| Abandoned Village ("mid-game") | 11 flesh golems, 3 fault finders | Bloodletter's Reach | 0006_Abandoned Village.txt |
| Artifact Reliquary | 7 golems, 3 greater golems, 4 fault finders, the Grand Diviner, 10 cradles | Censer of the Diviner | 0148_Artifact Reliquary.txt |
| Peaceful ones | Ancient Spire (reveals map), Ancient Statue (mood), Temple (blessed water), Grotesque Tree, Curious Ship Wreck (Golden Goose), Unhold Graveyard (trophies) | | 0108, 0109, 0111, 0923, 0493, 2075 |

The Monolith and the goblin city **regain up to 3 defenders every time you attack**, while below their 47
(0626 L5442): no chipping them down for free.

### C4. Ambitions (0053_Ambitions.txt; 1415_News and Dev Blogs.txt L1158, Dev Blog 89)
Every ambition gives at least **100 renown** and a company-wide mood lift; some give unique items; failing one for
long hurts mood; the menu adapts to the company and the world (Dev Blog 89). The ladder, with gates:

| Ambition | Gate | Reward | Cite |
|---|---|---|---|
| Player Banner (hold 2,000 crowns) | 1 ambition done | 100 renown + battle standard (resolve aura) | 1566_Player Banner.txt |
| Roster of 12 | 1 ambition done | 100; "take on more dangerous and better paying contracts" | 1707_Roster of 12.txt |
| Make Nobles Aware (1,050 renown) | 2 ambitions, Banner | 100 + **noble contracts unlock** + new map look | 1234_Make Nobles Aware.txt |
| Win Against 12 / Win Against 24 enemies | Nobles Aware | 250 / 100 | 2214_Win Against 12.txt; 2215_Win Against 24.txt |
| Named Item (own 1 famed piece) | day 30+, 3 ambitions | 250 | 1360_Named Item.txt |
| Named Item Set (weapon, shield, armour, helmet) | day 50+, 5 ambitions | 100 | 1361_Named Item Set.txt |
| Roster of 20 | day 15+, Nobles Aware | 100 | 1709_Roster of 20.txt |
| Discover 3 / all legendary locations | | 100 | 0643_Discover Unique Locations.txt; 0640 |
| Defeat the crisis (noble war, greenskins, undead, holy war) | 1,500 renown, crisis active | 100 + crisis status readout | 0541_Defeat Civil War.txt; 0543_Defeat Greenskins.txt |
| Have 8,000 Renown ('Invincible') | day 60+ | 100 + map look | 0950_Have 8000 Renown.txt |
| Defeat Kraken | day 100+, **20 ambitions** done | 100 | 0545_Defeat Kraken.txt |

Renown events: win +5, camp +10, contract +25, ambition +100; daily -2 or -3, retreat -15, failed contract -75,
betrayal -200 (0827_Game Guide.txt; 1679_Renown.txt). Retirement endings key on renown and crises ended:
'Leaving a Legacy' needs 6,000 renown and two crises ended (1692_Retirement.txt).

### C5. Late-game crises (1146_Late Game Crises.txt; 1415_News and Dev Blogs.txt, Dev Blog 92)
- **Foretold around day 50-70, starts around day 80-100.** Needs a minimum number of days **and a minimum roster
  strength** (average level and head count); renown is not required. Beginner and Ironman each delay it 5 days
  (0828_Game Mechanics.txt).
- Two phases: warning signs (sightings, camps creeping closer, more related contracts), then the real thing
  (Dev Blog 92). Lasts **30-100 days**; next one within 100 days after **at least 50 days of peace**; never the same
  twice in a row.
- War of the Noble Houses (towns captured, not razed; picking a side locks part of the map); Undead Scourge (new
  undead sites, more raiding, the dead rise); Greenskin Invasion (camps spawn raiding and siege parties; Orc
  Warriors with Goblin Shamans); Holy War (north vs south over 3 holy sites). Undead and greenskins can **destroy
  towns for good** (an option since a patch).
- Ending one is a "soft end": you are offered retirement, or play on into the next crisis (Dev Blog 92).

---

## D. Keeping a late company challenged, and the complaints on record

The devs' own record, in order:
- "Making sure the game does not become too easy or too difficult after 4-5 hours is really tricky ... it can
  snowball in all directions" (0626 L79).
- "The Brothers scale way too strongly in the lategame so many enemies become complete pushovers" (0626 L970).
- "We had a lot of problems with the player outscaling all enemy factions heavily in the mid-late game" (0626 L1185).
- "The majority of complaints we got before the patch was about the late game and that it was way too easy"; so
  they made enemy weapons strong early, which made the early game rough (0626 L1247).
- Fix they planned and shipped: a "tiered enemy" / "enemy progression" system, the same enemy with easy up to
  "fully armed lategame" kit, tied to progression (0626 L1262, L1360). Old contracts were "agnostic to the
  player's progress" and got "outscaled in their reward by selling loot" (1415_News and Dev Blogs.txt L2572).
- Unit design: enemies do not level, so a weapon must still matter in the late game (0626 L1208, L1247).
- Crises: "the game is not designed to be played without end ... it can get really hard after the third or fourth
  crisis" (0626 L2076). Late game "tends to lead to starved villages" (0626 L771).
- Players' counter-exploit: keep the roster small to shrink contracts (0827_Game Guide.txt L236); the arena's
  12 / roster-size multiplier is BB's own patch for it (0131_Arena.txt). Arena champion fights "give very poor
  rewards considering the extreme danger" (0131_Arena.txt).

The toolkit that keeps a strong company busy: contracts that track roster strength up to x5; time-gated unit
upgrades; elite units joining templates by stage; far, unscaled camps rich in named loot; champions on 3-skull jobs
and late roaming parties; legendary fortresses of 47 that reinforce; ambitions that gate on day and on ambition
count; and a new crisis every 80 to 200 days (30-100 days long, then at least 50 days of peace) that gets harder by the third or fourth.

---

## WHAT BOHEMIA SHOULD TAKE

Job 1: an enemy force's numbers and kit grow with the company, so a strong company meets geared, full forces.
- **One company strength number, BB's formula.** Sum of 10 + 2 x (level - 1) over the strongest 12 (or our field
  size); multiplier 0.94 x (S/100)^0.89, clamped 0.75 to 5. Count heads and levels, **not gear**: BB tried gear and
  dropped it (0626 L1254), and counting gear punishes the player for his own loot. Put it in TUNING's one table.
- **Copy the 12 / roster-size guard** from the arena (0131_Arena.txt), so a tiny elite squad cannot shrink every fight.
- **Numbers scale, the spawn list caps.** Each faction has templates by budget; past a budget, swap units up
  (Thug -> Raider -> Marauder -> Leader), never just add more bodies (0827 L238; 0299_Brigands.txt). This is how
  "full forces" stay readable on a phone-size house board.
- **Kit follows days and distance, the BB way.** Give each unit an "after day N" row (gear pool, perk, +5 skill),
  like the 20 / 40 / 60 / 90 / 200 table in A4. Later and farther means heavier kit; roster strength decides how many.
- **Three channels, three rules.** Jobs track the company tightly; roaming parties loosely plus a random factor;
  fixed lairs not at all (distance from a home base plus time), with the defender roster reshuffled every 10 days.
  The far lair is death early and a treasure late (0828_Game Mechanics.txt; 0626 L5392, L5442).
- **Skulls set size and pay apart.** Fight roll 70-85 / 95-105 / 105-135%, pay roll 63-81 / 94-107 / 120-148%,
  renown (the company's reputation) moves pay only, never the fight. One-skull only for the first days, three-skull later
  (0827 L130, L221; 0626 L1925, L3445).

Job 2: champions in hard jobs and roaming forces, each with a name, a look, kit a tier up, and a prize.
- **Chance table, BB's numbers:** base 1% for regulars, 2% for elites, 10% for faction bosses; +5% on a 3-skull
  job, -99% on a 1-skull job, -1% before about day 100 (so none early), +3% with a bounty-hunter type companion
  (0363_Champions.txt; 0827 L943-952). Roaming champions grow with days, not with the company.
- **The champion package:** a generated name, a marker on the token and a runway look one notch louder than his
  squad; stats x1.35 HP, x1.15 skill and damage, x1.25 defence, x1.5 resolve, plus one specialty doubling (HP
  or defence); a 25/25/25/25 roll for which slot holds the named piece, the other slots at the faction's top
  regular tier (0291_Brigand Leader (Champion).txt).
- **The prize is guaranteed and dropped whole,** even broken (BB's one exception, a shattered shield, is a good
  hard rule to keep). Named pieces roll two random stat bumps and take a name, often the dead owner's
  (1403_Named Weapons.txt; 1404_Named and Legendary Items.txt). Faction pieces only drop from that faction.
- **Guaranteed champion jobs as set pieces:** a 3-skull decisive battle always led by a champion; a boss contract
  that brings the faction king out with his host; a crisis job that draws the warlord out by killing his parties
  (0535, 1943, 0432). Above them, BB's ladder: champions bridge from the first crisis to the 47-defender
  legendary fortresses that reinforce 3 a visit and pay out once per campaign (0599; 0626 L5442).
