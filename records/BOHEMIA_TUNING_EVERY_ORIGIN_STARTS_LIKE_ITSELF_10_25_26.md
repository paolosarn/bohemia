# TUNING: EVERY ORIGIN STARTS LIKE ITSELF, THE LONE WOLF FIRST (10/25, rule 184, RESEARCH ONLY)

Row: TUNING [every origin starts like itself]. Research only (rule 38g): nothing in the game was changed by this page.
Everything here is a work in progress (rule 178): better now, never fixed for good. Every number is re-measured when perks,
abilities, gear, enemies or acts arrive.

HIS WORDS (10/25, verbatim, voice to text): "for all the origins tune up what happens especially like the numbers they get when
they start off... in a battle Brothers Lonewolf play through like you get a [gilded] God, bro with three stars in the stats that
actually matter that we kind of talked about bro I don't even see that on this wolf guy. It's just one regular guy like that.
Definitely is not a lone wolf"

THE BENCH: tools/bohemia_tuning_every_origin.js (research instrument, not a gate). Every fight is THE LIVE FIGHT
(slices/BOHEMIA_FIGHT.html and exactly the data files its own loadAll() reads, played headless through the whole grid's engine,
no hooks), both sides on the fight's own brain (AUTO), seeded. The map's sums are the live map's (party_math.json, through the
lone wolf bench's mapCount). The bill is the live one (2 a man a night, one man walks on a short night, never YOU). BANK
(draft:true, nothing in the game reads it): banks/BOHEMIA_TUNING_EVERY_ORIGIN_10_25_26.json. The resume cache is not committed;
the bench replays the whole Lone Wolf section in about three minutes on four cores.

## 0. THE ANSWER IN SHORT (the Lone Wolf)
- **Today he is one regular guy, and it shows: 52 in 100 of his first fifty days won** (he picks his fights), 35 if he meets what
  comes; 8 lost fights a run; no run in 100 goes fifty days without a loss.
- **THE GILDED GOD (section 1c) wins 98 in 100 of those days, picking his fights; 92 meeting what comes.** 0.4 lost fights a run,
  73 runs in 100 never lose, his closest call leaves him at 93% health (the median run). Battle Brothers' own Lone Wolf on the same
  bench: 97 and 58 never lost. That is Paolo's 94 to 96, a step on the easy side (rule 117: easier than Battle Brothers).
- **The game still turns on him**: days 61 to 70 he falls to 82 in 100 picking (51 meeting what comes). The god is a god until the
  game gets harder, his own words; the turn's day and ramp stay COMBAT's and WORLD's from last round's page.
- **The blade in his hand, the pistol in his bag.** A god with the pistol in his hand and the riot shield wins only 83 in 100; the
  blade wins 98. Guns first (rule 120(a)) holds as the pistol in his bag, swapped by his own button (AUTO never swaps for him,
  rule 180(g), so the bag pistol is not on the bench).
- **Three stars on THREE stats is the god; five does not buy more.** Three-star talents on ranged defence, melee skill and melee
  defence (Battle Brothers' three talents, every one maxed): 98. Three stars on all five stats rule 184(a) names: 98. Exactly three
  starred stats stands (the killer company page's rule).

---------------------------------------------------------------------------------------------------------------------------

## 1a. WHO STANDS AT THE DOOR TODAY (measured off the live files)

origins.json hands the fight `{background: hedge_knight, level: 4}` and nothing else. The fight stands him in YOU's place in the
line, so he wears YOU's kit, and rolls his numbers from his name, his look and his background: the same man every game.

| | TODAY (the live game) | BATTLE BROTHERS' LONE WOLF (as the bench builds him) | THE GILDED GOD (this page) |
|---|---|---|---|
| level | 4 (a label: levels 2 to 4 gave nothing) | 4, three level-ups taken, three picks each | 4, three level-ups taken, **four picks each** |
| stars | none in the fight | three talents at 60/30/10, where the dice put them | **three stars each on ranged defence, melee skill, melee defence** |
| hitpoints | 70 | 62 to 73 | 62 to 73 (median 67) |
| breath (fatigue) | 105 | 112 to 124 | 111 to 122 (117) |
| resolve | 41 | 39 to 44 | 39 to 44 (41) |
| melee skill | 65 | 61 to 76 | **68 to 79 (73)** |
| melee defence | 9 | 7 to 20 | **13 to 20 (17), +15 the riot shield** |
| ranged defence | 2 | 0 to 5 | **12 to 20 (16), +25 the riot shield** |
| in his hands | the pistol and a car door | an arming sword and a heater shield | **a machete (an arming or noble sword) or a fire axe (a fighting axe), a riot shield (the kite shield)** |
| on his body | a work jacket and a rag hood: **90 armour** | reinforced mail and a closed flat top: 490 | **full riot armour (210 to 320) and a full riot helm (280 or 300): 490 to 620** |
| in his bag | (his place's pipe) | | **a pistol (the rondel dagger's heavy javelin row, 40 batteries)** |
| perks at the door | the pistol build's three | colossus, steel brow, brawny | colossus, steel brow, brawny (then the blade's mastery, lone wolf, battle forged...) |
| the same man every game? | **yes** | no | **no: every number and every piece rolled per game** |

His kit at the market's prices: 685 batteries at the light end (a machete, the riot shield, reinforced mail, the closed flat top,
the pistol) to 1,430 at the top (a noble sword, a coat of plates, a full helm). The door's purse stays 125: low funds and great
equipment is Battle Brothers' own trade, and the kit is worth five to eleven times the purse.

Against the best man the post offers (a militia, level 1): melee skill 52 to 62, melee defence 2 to 7, ranged defence 2 to 7,
breath 93 to 105, 50 armour in a padded vest. On the crew screen the god's three gold stars and his numbers are a different kind
of man; that is how he reads as a god (RUN TWO's card shows the stars already, rule 133 change 9).

## 1b. BATTLE BROTHERS FIRST (rule 33)

The wiki copy (bb_all/1194_Lone Wolf.txt, CORE_WIKITEXT.md:3786-3852) says: one hedge knight, level 4, 'great equipment', low funds
(1,250 / 1,000 / 750 crowns), renown 200, a roster of 12 at most, 90 inventory slots, the campaign ends if he dies (ours: downed,
never dead), melee defence -2 (a range of 4 to 8), never Survivor, Greedy or Disloyal. Dev Blog 114: 'a single well-equipped and
experienced hedge knight... the strongest man in the company for quite a while'. **The wiki names no talents and no items for him.**
'Three stars in the stats that matter' is Paolo's memory of playing it, and it is the ruling (rule 184(a)); the kit is the hedge
knight's own off the Hedge Knight (Enemy) page: one of ten top weapons (three of them one-handed: the arming sword, the noble sword,
the fighting axe), a 210 to 320 body, a 280 to 300 helm, a kite or heater shield with a one-hander.

## 1c. THE GILDED GOD, IN NUMBERS (the proposal; RUN TWO builds it)

- **wolf.body**: a hedge knight rolled in his background's range, melee defence -2; his three door levels TAKEN at the door
  (levels 2, 3, 4), four picks a level (TUNING 10/25 killer company) on his stars: ranged defence, his weapon's skill, melee
  defence, breath.
- **wolf.stars**: exactly three talents, each three stars: ranged defence (guns lead, rule 162(b)), melee skill (his blade),
  melee defence. A three-star roll is 4 to 5 ranged defence and 3 to 4 melee a level, the top column.
- **wolf.kit**: rolled per game from the hedge knight's own: the weapon one of a machete (arming sword, noble sword) or a fire axe
  (fighting axe); the riot shield (kite shield: ranged defence 25, ranged defence first); full riot armour from reinforced mail
  (210) to a coat of plates (320); a full riot helm (closed flat top 280 or full helm 300); a pistol in his bag (rule 120(a)).
- **wolf.perks**: the door's three points on colossus, steel brow, brawny (brawny takes 30% of the armour's weight off his breath);
  then the blade's mastery, lone wolf, battle forged, shield expert, nine lives, indomitable, killing frenzy. (The fight has no
  perk row for a sword or an axe today; COMBAT [the melee perk rows] from last round's page stands.)
- **wolf.rolled_per_game**: every number above is a fresh roll each game; over 200 rolls his melee skill runs 68 to 79, melee
  defence 13 to 20, ranged defence 12 to 20, breath 111 to 122. Never the same man twice.
- wolf.funds stand (125 / 100 / 75), wolf.roster 12, wolf.field 1 (rule 75a), renown 200 when renown lands (TUNING 10/10 table).

## 1d. THE LADDER: HIM ALONE AGAINST 1 TO 8 BRIGANDS DRESSED FOR THE DAY (60 seeded fights a cell, a new roll each fight)

WON IN 100 / HE FELL IN 100:

| who | day | vs 1 | vs 2 | vs 3 | vs 4 | vs 5 | vs 6 | vs 8 |
|---|---|---|---|---|---|---|---|---|
| TODAY | 1 | 92 / 8 | **77 / 23** | **32 / 68** | 12 / 88 | 10 / 90 | 7 / 93 | 5 / 95 |
| | 20 | 75 / 25 | 50 / 50 | 22 / 78 | 7 / 93 | 7 / 93 | 3 / 97 | 5 / 95 |
| BATTLE BROTHERS' WOLF | 1 | 100 / 0 | 100 / 0 | 97 / 3 | 75 / 25 | 43 / 57 | 22 / 78 | 7 / 93 |
| | 20 | 92 / 8 | 83 / 17 | 67 / 33 | 40 / 60 | 25 / 75 | 10 / 90 | 3 / 97 |
| **THE GILDED GOD** | 1 | 100 / 0 | **100 / 0** | **93 / 7** | 70 / 30 | 33 / 67 | 17 / 83 | 10 / 90 |
| | 20 | 95 / 5 | **90 / 10** | 72 / 28 | 52 / 48 | 32 / 68 | 17 / 83 | 7 / 93 |
| | 40 | 95 / 5 | 88 / 12 | 72 / 28 | 48 / 52 | 27 / 73 | 13 / 87 | 3 / 97 |
| the god, light kit only | 20 | 92 / 8 | 80 / 20 | 70 / 30 | 53 / 47 | 27 / 73 | 15 / 85 | 2 / 98 |
| the god, five three-star stats | 20 | 95 / 5 | 92 / 8 | 72 / 28 | 52 / 48 | 30 / 70 | 18 / 82 | 5 / 95 |
| the god, the pistol in his hand | 1 | 100 / 0 | 98 / 2 | 65 / 35 | 42 / 58 | 17 / 83 | 17 / 83 | 17 / 83 |
| | 20 | 92 / 8 | 83 / 17 | 53 / 47 | 27 / 73 | 13 / 87 | 8 / 92 | 10 / 90 |

Read it plainly: the god eats two men and three, holds four half the time, and five is too many. That is his words exactly
('make sure he doesn't run into any group too big'). From day 20, when marksmen join the brigands, the riot shield and his ranged
defence stars are why the god (90 against two) beats Battle Brothers' man (83): ranged defence matters more here, rule 162(b).

## 1e. HIS FIRST FIFTY DAYS PLAYED (100 seeds a row, a fight every second day, the party the map hands)

PICKS: he looks first and takes the best-paid job the map sizes at three or fewer, and falls back from a bigger roaming party.
TAKES: he meets what comes. Both as last round's page played them; the live fight at this commit.

| row | won in 100 | lost fights a run | runs that never lost | first fight won | closest call (median run) | his level at 50 | purse at 50 | by ten days |
|---|---|---|---|---|---|---|---|---|
| TODAY, picks | 52 | 7.9 | 0 | 67 | 40% | 5 | 972 | 62 / 52 / 48 / 45 / 44 |
| TODAY, takes | 35 | 16.2 | 0 | 61 | 37% | 6 | 567 | 52 / 39 / 29 / 29 / 28 |
| BATTLE BROTHERS' WOLF, picks | 97 | 0.5 | 58 | 99 | 74% | 7 | 1,651 | 99 / 98 / 91 / 95 / 97 |
| **THE GILDED GOD, picks** | **98** | **0.4** | **73** | **100** | **93%** | 7 | 1,655 | 98 / 99 / 95 / 98 / 99 |
| **THE GILDED GOD, takes** | **92** | **2.0** | **20** | 96 | 72% | 9 | 1,107 | 94 / 95 / 89 / 93 / 88 |
| the god, light kit only, picks | 97 | 0.4 | 66 | 100 | 87% | 7 | 1,655 | 97 / 100 / 93 / 97 / 98 |
| the god, five three-star stats, picks | 98 | 0.3 | 77 | 100 | 94% | 7 | 1,655 | 98 / 99 / 96 / 98 / 99 |
| the god, five three-star stats, takes | 93 | 1.8 | 23 | 95 | 75% | 9 | 1,107 | 95 / 96 / 91 / 94 / 89 |
| the god, the pistol in his hand, picks | 83 | 2.8 | 3 | 94 | 80% | 6 | 1,389 | 87 / 86 / 78 / 80 / 77 |

AND ON TO DAY 100 (the god, by ten days): picks 98 / 99 / 95 / 98 / 99 / 97 / **82** / 88 / 87 / 85; takes 94 / 95 / 89 / 93 / 88 /
85 / **51** / 54 / 53 / 49. The turn on day 61 is the enemy's late mix switching on (last round's page, COMBAT and WORLD own it).

What the days say:
1. **The god is the origin.** From 52 to 98 in 100, with nothing else in the game changed. Every point of it is at the door: a
   real body for his level, three maxed stars where they matter, and the hedge knight's kit in our world's things.
2. **He reads as a god in the fights, not only on the card.** In the median run his worst won fight of fifty days leaves him at
   93% of his health (today's man: 40%).
3. **Picking his fights is still the skill**: 98 picking, 92 meeting what comes. Paolo's 'make sure he doesn't run into any group
   too big' is worth six points, and the game still punishes the player who does not look (rule 133(b)).
4. **The kit roll is honest**: the light end (685 batteries of kit) wins 97, the rolled kit 98. No roll leaves him a regular guy.

## 1f. WHAT IS OFF AGAINST HIS WORDS, AND WHAT THE GOD FIXES

| his words | today | the gilded god |
|---|---|---|
| 'a gilded god' | a level-4 label on a level-1 body | a real level-4 body: melee skill 73, both defences 16 to 17 before the shield |
| 'three stars in the stats that actually matter' | no stars reach the fight | three stars each on ranged defence, melee skill, melee defence, lit on the card |
| 'great equipment' (Battle Brothers) | YOU's 90-armour rags | full riot armour and a full riot helm, 490 to 620, a machete or a fire axe, the riot shield |
| 'one regular guy' (the same every game) | the same man every game | a new man every game, every number rolled |
| 'virtually impossible to kill' early (rule 183) | 52 in 100 | 98 in 100, a third of a lost fight a run |
| 'until the game starts getting harder' | | still turns at day 61 (82 picking, 51 taking) |

## NOT MEASURED (this section)
- The pistol in his bag (AUTO never swaps for the player's side, rule 180(g)); a player who draws it to finish a runner does better.
- Armour wear between fights, the main's injuries carried between fights, healing days: every fight starts whole.
- Beasts on the Lone Wolf (the map's roads and clear jobs are brigands).
- Three picks a level instead of four (rules.json says three today; the killer company page proposes four; the god was built on four).
- Renown's pay multiplier and the 200 renown at the door.

[bb the Lone Wolf: one hedge knight, level 4, great equipment, low funds; the wiki names no talents, the stars are his memory and the ruling]
[analog horror: the same man in the same rags at the door of every game was the tell; a new face every time is the fix]
