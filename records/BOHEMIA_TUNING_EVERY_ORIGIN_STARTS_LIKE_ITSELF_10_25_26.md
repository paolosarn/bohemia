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
(draft:true, nothing in the game reads it): banks/BOHEMIA_TUNING_EVERY_ORIGIN_10_25_26.json; the fifteen proposed starts in
origins.json's own shape: banks/BOHEMIA_TUNING_ORIGIN_STARTS_PROPOSED_10_25_26.json. EVERY NUMBER ON THIS PAGE is the live fight
frozen at 89a4b46d (a copy of that commit played every fight, so nothing moved under the numbers). The resume cache is not
committed (git-ignored); the bench replays the whole page, seeded, in about 25 minutes on four cores.

## 0. THE ANSWER IN SHORT
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
- **The other fourteen walk in today as one crew** (the line's pistol, car door and rifle in 90 armour, a stated level only a
  label, the same men every game). **The proposal gives each its own start**, and the careful player's first thirty days go:
  the fight pit 67 -> 96, the raiders 76 -> 96, the hunters 64 -> 90, the promise keepers 50 -> 89, the deserters 54 -> 86, the
  easy three 64 -> 84, the water truck 41 -> 66 (with a guard its money buys), the block watch 83 -> 91, the scavengers 61 -> 69;
  the lab rats, the faithful and the debt collectors stay where they are (62, 75, 86): their promise lives in rules the game
  does not have yet (section 2d). The whole fifteen are in a file RUN TWO can lift.
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


---------------------------------------------------------------------------------------------------------------------------

## 2a. THE OTHER FOURTEEN TODAY: EVERY ORIGIN WALKS IN AS THE SAME CREW (measured off the live fight's own setup)

origins.json hands each origin's men as a background and a level, nothing else. The fight stands them in the line's first
places and deals each his place's kit (guns to the best eyes, rule 120(a)). So, read off the live setup at this commit:

| origin | its men (the file) | what they carry into the first fight | armour a man |
|---|---|---|---|
| THE CREW THAT IS LEFT, A NEW CREW, UP FROM HENDERSON | three companions, level 1 | a pistol and a car door, a pistol and a car door, a rifle | 90 to 95 |
| THE WATER TRUCK | two caravan hands | a pistol and a car door, a rifle | 90 to 95 |
| THE BLOCK WATCH | twelve lowborn | the crew rows' twelve: two pistols, three rifles, the shotgun, three pipes, two sledges, the bottles | 55 to 100 |
| THE SCAVENGERS | a hunter (level 2) and two poachers | a pistol and a car door, a rifle, a pistol and a car door | 90 to 95 |
| THE PROMISE KEEPERS | two oathtakers, level 3 and 1 | a pistol and a car door, a rifle | 90 to 95 |
| THE DESERTERS | three deserters, two at level 2 | a pistol and a car door, a rifle, a pistol and a car door | 90 to 95 |
| THE RAIDERS | three barbarians (level 3) and a monk | a pistol and a car door, two rifles, a pistol and a car door | 90 to 95 |
| THE LAB RATS, THE FAITHFUL, THE HUNTERS, THE FIGHT PIT | their three or four | a pistol and a car door, a rifle or two, a pistol and a car door | 90 to 95 |
| THE DEBT COLLECTORS | two manhunters and four in debt | the first six crew rows' kits | 60 to 95 |

What that means:
1. **Every origin is the same crew in different names.** A level-3 gladiator and a level-1 anatomist walk into the first fight
   holding the same pistol and car door in the same 90 armour. THE CREW THAT IS LEFT, A NEW CREW and UP FROM HENDERSON are the
   same three men, rolled from the same names: every row measured below is identical for the three.
2. **A stated level is a label.** Six origins state levels (the Lone Wolf 4, the raiders, the promise keepers' old man and the
   gladiators 3, the deserters and the hunters 2). The fight rolls every man's numbers at level 1; the level adds only his XP and
   perk points. A level-3 barbarian has the numbers of a fresh barbarian.
3. **The same men every game.** A man the door hands with no card is rolled from his name, his look and his background, so every
   game's crew is the same crew (EYES' hitpoints-drift fix, 10/24, did that on purpose for the fight; the door never rolls a new man).
4. **No stars reach the fight from the door, no renown, no food, no goods** (TUNING 10/10 and 10/19 pages, still open).
5. **Nothing of each origin's promise is in the first hour** except the head count, the purse and the field cap (rule 75a).

## 2b. EACH ORIGIN: BATTLE BROTHERS FIRST, THE PROMISE, THE START THAT KEEPS IT (60 seeds a row, the first thirty days)

The same days as the Lone Wolf's: a fight every second day, the party the map hands, dressed by the day, on the live fight.
THREE PLAYERS: CAREFUL looks first, takes the best-paid job the map sizes at his standing men plus one (at least three), falls
back from a bigger roaming party, and RESTS in town while fewer than half his company can stand; CAREFUL, HIRES FOR THE HURT does
the same and buys the best man the post offers (an ordinary militia, 37) when fewer men stand than he started with, keeping a
week of the bill; CARELESS meets what comes and never rests. A fallen man is laid up the days the fight rolls (30 to 40), 20 in
100 die (Paolo 9/27, the fight's own roll); YOU never dies. Purse from the door's FULL SHELVES; the bill is the live one.

### THE CREW THAT IS LEFT (Battle Brothers: Rebuilding a Company, easy)
- **Battle Brothers**: three companions (a two-hander, a one-hander, a shooter), level 1; the tutorial and the Hoggart job; 2,500 / 2,000 / 1,500 crowns; renown 100; 8 days of grain (bb_all/1651).
- **The promise**: The learning start. Three of you are left, the game walks you through the first jobs, and a debt is paid off.
- **The start (proposed)**: the three companions at level 1, three talents each (60/30/10, rolled per game); A NEW CREW's kit: YOU a pistol and a car door, the second a pistol and the heater car door, the third a rifle; leather vests (95) on the front two, a padded vest on the shooter, hard hats; 250 batteries and a week of the bill in the wagon (42); roster 20, field 12; renown 100. Its ease over the other two is the guided first job (the tutorial), not its numbers.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 83 | 64 | 83 / 46 / 20 | 2.7 | 5 | 0.4 | 0 |
| TODAY, careful, hires for the hurt | 84 | 75 | 84 / 68 / 33 | 1.8 | 10 | 1 | 2.1 |
| TODAY, careless | 73 | 37 | 73 / 27 / 12 | 9.4 | 0 | 0.4 | 0 |
| **THE PROPOSAL**, careful | **93** | **84** | 93 / 83 / 51 | 1.4 | 18 | 0.3 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 93 | 84 | 93 / 77 / 44 | 1.3 | 18 | 0.9 | 0.7 |
| **THE PROPOSAL**, careless | 87 | 52 | 87 / 48 / 20 | 7.2 | 0 | 0.4 | 0 |
| the same at level 2, careful | 94 | 84 | 94 / 82 / 50 | 1.5 | 22 | 0.4 | 0 |
| the same at level 2, careful, hires for the hurt | 93 | 84 | 93 / 80 / 37 | 1.4 | 20 | 1.1 | 0.9 |
| the same at level 2, careless | 87 | 51 | 87 / 45 / 19 | 7.4 | 0 | 0.5 | 0 |

### A NEW CREW (Battle Brothers: A New Company, easy)
- **Battle Brothers**: three companions, 'three experienced mercenaries with whom you've fought side by side in the shieldwall before'; no tutorial; 2,900 / 2,400 / 1,900 crowns; renown 0; 8 days of grain (bb_all/0002).
- **The promise**: A quick, clean start. Three men who have fought together, nothing owed, nothing special. Go.
- **The start (proposed)**: the three at LEVEL 2, a real body (one level-up taken, four picks), three talents each; YOU a pistol and a car door, the second a pistol and the heavier car door (the heater shield), the third a rifle; leather vests (95) on the front two, a padded vest on the shooter, hard hats; 290 batteries and a week of the bill (42); roster 20, field 12. Measured: the pistol in the second man's hand is the lever (a pipe there: 80; level 1 with the pipe: 73), the level adds little.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 83 | 64 | 83 / 46 / 20 | 2.7 | 5 | 0.4 | 0 |
| TODAY, careful, hires for the hurt | 84 | 74 | 84 / 66 / 23 | 1.9 | 10 | 1 | 1.9 |
| TODAY, careless | 73 | 37 | 73 / 27 / 12 | 9.4 | 0 | 0.4 | 0 |
| **THE PROPOSAL**, careful | **94** | **84** | 94 / 82 / 50 | 1.5 | 22 | 0.4 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 93 | 84 | 93 / 80 / 34 | 1.4 | 20 | 1.2 | 0.8 |
| **THE PROPOSAL**, careless | 87 | 51 | 87 / 45 / 19 | 7.4 | 0 | 0.5 | 0 |
| level 1, a pipe in the second hand, careful | 88 | 73 | 88 / 66 / 35 | 2.3 | 15 | 0.4 | 0 |
| level 1, a pipe in the second hand, careful, hires for the hurt | 90 | 79 | 90 / 68 / 43 | 1.7 | 8 | 1 | 1 |
| level 1, a pipe in the second hand, careless | 82 | 49 | 82 / 45 / 20 | 7.7 | 0 | 0.4 | 0 |
| level 2, a pipe in the second hand, careful | 93 | 80 | 93 / 80 / 34 | 1.8 | 23 | 0.4 | 0 |
| level 2, a pipe in the second hand, careful, hires for the hurt | 94 | 83 | 94 / 79 / 37 | 1.5 | 12 | 0.9 | 0.7 |
| level 2, a pipe in the second hand, careless | 88 | 53 | 88 / 50 / 19 | 7.1 | 0 | 0.4 | 0 |

### UP FROM HENDERSON (Battle Brothers: Southern Mercenaries, easy)
- **Battle Brothers**: the same three companions as A New Company, started in the south; 'a quick start into the southern part of the world, without any particular advantages or disadvantages'; 2,900 / 2,400 / 1,900 crowns; renown 0 (bb_all/1834).
- **The promise**: Three guns and no friends, up from the south end of the valley. A New Crew's numbers in another place.
- **The start (proposed)**: A NEW CREW's numbers exactly (level 2, three talents, two pistols with car doors and a rifle: three guns, leather vests and hard hats; 290 batteries and a week); it starts at the valley's south end (WORLD's place). Measured first on the same seeds (the bench's earlier pass): a shotgun in the second man's hands, padded vests, level 1: 58.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 83 | 64 | 83 / 46 / 20 | 2.7 | 5 | 0.4 | 0 |
| TODAY, careful, hires for the hurt | 84 | 74 | 84 / 66 / 23 | 1.9 | 10 | 1 | 1.9 |
| TODAY, careless | 73 | 37 | 73 / 27 / 12 | 9.4 | 0 | 0.4 | 0 |
| **THE PROPOSAL**, careful | **94** | **84** | 94 / 82 / 50 | 1.5 | 22 | 0.4 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 93 | 84 | 93 / 80 / 34 | 1.4 | 20 | 1.2 | 0.8 |
| **THE PROPOSAL**, careless | 87 | 51 | 87 / 45 / 19 | 7.4 | 0 | 0.5 | 0 |

### THE WATER TRUCK (Battle Brothers: Trading Caravan, easy)
- **Battle Brothers**: two caravan hands, level 1; 10% better prices both ways; no renown and 66% renown gain; dissatisfied at the start; 1,650 / 1,400 / 1,150 crowns and 171 batteries of goods; 19 days of food (bb_all/2021).
- **The promise**: Traders first. Two drivers and a tank of water. Better prices, slow fame; you buy your fighters.
- **The start (proposed, with the guard)**: the two drivers at level 1, three talents each (a pistol and a car door, a rifle, padded vests) AND A GUARD THE TRUCK PAID FOR AT THE DOOR: a militia at level 1 with a pistol and the heater car door in a leather vest, his 37 batteries taken out of the goods; 165 batteries, the rest of the goods (134) and nineteen days of the bill in the tank (114); 10% on prices both ways (RUN TWO's market); roster 20, field 12. Measured: the two drivers alone win 43 in 100 of their first thirty days, careful; it is not an easy start without the man the money buys.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 59 | 41 | 59 / 29 / 24 | 6.8 | 0 | 0.2 | 0 |
| TODAY, careful, hires for the hurt | 70 | 62 | 70 / 48 / 42 | 2.9 | 0 | 0.8 | 1.6 |
| TODAY, careless | 55 | 36 | 55 / 29 / 22 | 9.7 | 0 | 0.3 | 0 |
| **THE PROPOSAL**, careful | **86** | **66** | 86 / 54 / 26 | 2.9 | 15 | 0.5 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 89 | 78 | 89 / 63 / 24 | 1.7 | 12 | 1 | 0.3 |
| **THE PROPOSAL**, careless | 78 | 41 | 78 / 31 / 15 | 8.8 | 0 | 0.4 | 0 |
| the two drivers alone, in the kit, careful | 66 | 43 | 66 / 28 / 23 | 6.5 | 0 | 0.3 | 0 |
| the two drivers alone, in the kit, careful, hires for the hurt | 73 | 63 | 73 / 50 / 19 | 2.8 | 0 | 0.7 | 0 |
| the two drivers alone, in the kit, careless | 55 | 34 | 55 / 29 / 19 | 9.9 | 0 | 0.3 | 0 |

### THE BLOCK WATCH (Battle Brothers: Peasant Militia, easy)
- **Battle Brothers**: twelve lowborn (two farmhands, a poacher, two daytalers, a miller, a fisherman, two militia, a minstrel, a vagabond, a butcher), poorly equipped; 16 in a fight, 25 in the roster, lowborn hires only; renown -100, +40 in its village; 4.2 days of grain for twelve (bb_all/1533).
- **The promise**: Numbers. Twelve neighbours with pipes; nobody brings a small crew against you. Cheap men, lots of them, and a lot of mouths.
- **The start (proposed)**: the twelve at level 1, three talents each; two rifles to the poacher and a militia, two pistols, pipes and car doors in front, a sledge, a rebar spear, a cleaver; work jackets and rag hoods (the militia a padded vest); 125 batteries AND A WEEK OF THE BILL (168): today the bill (24 a night) walks five men in the first fortnight; roster 25, field 16.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 98 | 83 | 98 / 91 / 40 | 1.6 | 23 | 1.6 | 8.4 |
| TODAY, careful, hires for the hurt | 98 | 81 | 98 / 92 / 34 | 1.7 | 18 | 1.8 | 9.4 |
| TODAY, careless | 91 | 49 | 91 / 39 / 16 | 7.7 | 0 | 2 | 7.9 |
| **THE PROPOSAL**, careful | **99** | **91** | 99 / 95 / 51 | 0.7 | 37 | 1.9 | 5.2 |
| **THE PROPOSAL**, careful, hires for the hurt | 98 | 90 | 98 / 97 / 50 | 0.8 | 43 | 2 | 8.8 |
| **THE PROPOSAL**, careless | 88 | 46 | 88 / 42 / 8 | 8.1 | 0 | 2 | 4.3 |

### THE SCAVENGERS (Battle Brothers: Band of Poachers, medium)
- **Battle Brothers**: a hunter and two poachers, level 1; 'all you know is how to use a bow'; always see what is inside a wild place; faster on the map (111 against 105); 81 inventory slots; renown 100, -20 with the nearest noble house (bb_all/0172).
- **The promise**: Three shooters who always see what is waiting inside before they go in. They pick their fights.
- **The start (proposed)**: the hunter with the heavier crossbow rifle (his eye is the best: ranged skill 52 to 59), the two poachers each a pistol and a car door in front; padded vests and rag hoods; 250 batteries and a week of the bill; roster 20, field 12; the party's make-up shown before every fight (the map's MEET BEFORE YOU FIGHT, rule 151(e), already) and a faster party on the map (111 against 105, WORLD). Measured: every extra long gun with no front man LOSES (three rifles 55, two rifles and a front man 58, two bows and a front man 50): that is the fight's guns, COMBAT's (TUNING 10/19), not this start's.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 79 | 61 | 79 / 46 / 21 | 3.1 | 13 | 0.5 | 0 |
| TODAY, careful, hires for the hurt | 87 | 75 | 87 / 62 / 33 | 1.9 | 8 | 1.1 | 2 |
| TODAY, careless | 70 | 37 | 70 / 26 / 15 | 9.5 | 0 | 0.5 | 0 |
| **THE PROPOSAL**, careful | **85** | **69** | 85 / 51 / 21 | 2 | 17 | 0.3 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 83 | 71 | 83 / 58 / 29 | 2 | 8 | 0.9 | 2 |
| **THE PROPOSAL**, careless | 67 | 34 | 67 / 24 / 10 | 9.9 | 0 | 0.3 | 0 |
| two bows and a front man, careful | 73 | 50 | 73 / 26 / 9 | 3.5 | 20 | 0.4 | 0 |
| two bows and a front man, careful, hires for the hurt | 82 | 71 | 82 / 56 / 24 | 2 | 8 | 1 | 2.2 |
| two bows and a front man, careless | 59 | 26 | 59 / 11 / 7 | 11.2 | 0 | 0.5 | 0 |
| two rifles and a front man, careful | 78 | 58 | 78 / 28 / 16 | 2.8 | 5 | 0.4 | 0 |
| two rifles and a front man, careful, hires for the hurt | 83 | 73 | 83 / 55 / 24 | 1.9 | 8 | 1 | 1.7 |
| two rifles and a front man, careless | 65 | 33 | 65 / 23 / 12 | 10 | 0 | 0.5 | 0 |
| three rifles, careful | 75 | 55 | 75 / 27 / 20 | 3.2 | 5 | 0.4 | 0 |
| three rifles, careful, hires for the hurt | 79 | 70 | 79 / 56 / 11 | 2.1 | 3 | 1.1 | 1.8 |
| three rifles, careless | 60 | 30 | 60 / 18 / 12 | 10.5 | 0 | 0.4 | 0 |

### THE PROMISE KEEPERS (Battle Brothers: Oathtakers, medium)
- **Battle Brothers**: two oathtakers, one Old at level 3 with Young Anselm's Skull and a Battle Standard, one at level 1, 'each has good equipment'; roster 18; forced to take oaths; 1,500 / 1,000 / 500 crowns; reputation +60 (bb_all/1470).
- **The promise**: Two men in good kit, sworn to promises that change them. Few, hard to kill, and slow to grow.
- **The start (proposed)**: the old one a REAL level 3 (two level-ups taken), the young one level 1, three talents each; the old one a pipe (the winged mace) and the riot shield, the young one a pistol and the heater car door; plate carriers (the mail hauberk, 150) on both, a full riot helm on the old, a riot helmet on the young; 150 batteries and a week of the bill; roster 18, field 12.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 71 | 50 | 71 / 43 / 19 | 5.7 | 2 | 0.2 | 0 |
| TODAY, careful, hires for the hurt | 80 | 69 | 80 / 60 / 35 | 2.5 | 5 | 0.6 | 1 |
| TODAY, careless | 75 | 45 | 75 / 38 / 21 | 8.3 | 0 | 0.2 | 0 |
| **THE PROPOSAL**, careful | **99** | **89** | 99 / 91 / 65 | 1.3 | 47 | 0.1 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 99 | 92 | 99 / 94 / 73 | 0.8 | 47 | 0.1 | 0 |
| **THE PROPOSAL**, careless | 94 | 73 | 94 / 79 / 44 | 4.1 | 8 | 0.2 | 0 |

### THE DESERTERS (Battle Brothers: Deserters, medium)
- **Battle Brothers**: three deserters, two at level 2; 'decent armour': three mail hauberks, two heater shields, aketon caps, a light crossbow, a shortsword, a hatchet; first to act in the first round; every man hurt at the start; lower funds; a noble house hunting them (-100); renown 150 (bb_all/0571).
- **The promise**: Soldiers' armour on men who ran. Hurt, hunted, and you always strike first.
- **The start (proposed)**: the wiki's own kit in our things: three plate carriers (the mail hauberk), two heater car doors, three hard hats (the aketon cap), a rifle, a machete (the shortsword) and a hatchet in a bag; the two at level 2 a real body; three talents each; 125 batteries and a week of the bill; roster 20, field 12. FIRST TO ACT and THE HURT START are rules the fight does not have yet (COMBAT).

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 75 | 54 | 75 / 31 / 20 | 3.1 | 3 | 0.3 | 0.5 |
| TODAY, careful, hires for the hurt | 78 | 63 | 78 / 45 / 29 | 2.5 | 7 | 0.7 | 2.9 |
| TODAY, careless | 65 | 31 | 65 / 15 / 11 | 10.4 | 0 | 0.3 | 0.4 |
| **THE PROPOSAL**, careful | **98** | **86** | 98 / 92 / 41 | 1.4 | 22 | 0.4 | 0.1 |
| **THE PROPOSAL**, careful, hires for the hurt | 97 | 89 | 97 / 92 / 52 | 1.2 | 32 | 0.8 | 0.6 |
| **THE PROPOSAL**, careless | 94 | 64 | 94 / 67 / 30 | 5.4 | 5 | 0.4 | 0 |

### THE RAIDERS (Battle Brothers: Northern Raiders, medium)
- **Battle Brothers**: three barbarians at level 3 and a monk; 'veteran raiders that are well-equipped'; outlaws: two noble houses hostile (-100), renown -50, reputation -30; more loot from the dead; starts at a raided village (bb_all/1459, Dev Blog 114).
- **The promise**: Three veteran raiders and a monk. Everybody hates you. You keep what you kill.
- **The start (proposed)**: the three barbarians a REAL level 3, three talents each, in plate carriers and riot helmets: a fire axe and a heater car door, a sledge, a shotgun; the monk level 1 with a pistol and a car door in work clothes; 125 batteries and a week of the bill; roster 20, field 12.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 92 | 76 | 92 / 49 / 24 | 1.6 | 17 | 0.7 | 0.4 |
| TODAY, careful, hires for the hurt | 93 | 79 | 93 / 72 / 36 | 1.6 | 22 | 1.1 | 3.4 |
| TODAY, careless | 70 | 36 | 70 / 24 / 14 | 9.6 | 0 | 0.7 | 0.5 |
| **THE PROPOSAL**, careful | **100** | **96** | 100 / 97 / 77 | 0.5 | 53 | 0.3 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 100 | 93 | 100 / 97 / 69 | 0.8 | 35 | 0.9 | 0.3 |
| **THE PROPOSAL**, careless | 97 | 65 | 97 / 71 / 27 | 5.3 | 2 | 0.5 | 0 |

### THE LAB RATS (Battle Brothers: Anatomists, medium)
- **Battle Brothers**: three anatomists, level 1; 'not fighters': never of confident morale; the first kill of each beast kind gives a potion that buffs for good; 3,200 / 2,700 / 2,200 crowns, the richest purse of the medium starts (bb_all/0080).
- **The promise**: Not fighters, and rich. You study what you kill to make your people stronger.
- **The start (proposed)**: the three at level 1, three talents each; two pistols with car doors and a rifle; padded vests; 320 batteries and a week of the bill; roster 20, field 12. NEVER CONFIDENT and the potions are rules the fight and the stash do not have yet.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 84 | 65 | 84 / 52 / 19 | 2.8 | 13 | 0.5 | 0 |
| TODAY, careful, hires for the hurt | 84 | 73 | 84 / 62 / 30 | 2.1 | 8 | 1.2 | 1.5 |
| TODAY, careless | 75 | 39 | 75 / 30 / 12 | 9.2 | 0 | 0.4 | 0 |
| **THE PROPOSAL**, careful | **82** | **62** | 82 / 44 / 27 | 3.2 | 15 | 0.5 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 89 | 79 | 89 / 61 / 42 | 1.6 | 10 | 1 | 0.8 |
| **THE PROPOSAL**, careless | 74 | 40 | 74 / 31 / 16 | 9 | 0 | 0.6 | 0 |

### THE FAITHFUL (Battle Brothers: Davkul Cultists, medium)
- **Battle Brothers**: four cultists, level 1, 'poor equipment'; new cultists join for free and appear in every settlement; the god demands sacrifices; reputation -10; 3.1 days of grain for four, the thinnest wagon (bb_all/0512, Dev Blog 113).
- **The promise**: Four in rags who do not break. More come to you for free. The god wants blood.
- **The start (proposed)**: the four at level 1, three talents each; two pipes and car doors, a pistol, a rifle; work clothes and cult hoods; 290 batteries and a week of the bill; roster 20, field 12. THE FREE JOINERS are the lever Battle Brothers gives them (RUN TWO's post: a cultist at no price).

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 90 | 77 | 90 / 56 / 15 | 1.4 | 28 | 0.6 | 0 |
| TODAY, careful, hires for the hurt | 90 | 82 | 90 / 81 / 33 | 1.4 | 23 | 1.3 | 2.4 |
| TODAY, careless | 80 | 41 | 80 / 32 / 12 | 8.8 | 0 | 0.5 | 0 |
| **THE PROPOSAL**, careful | **82** | **75** | 82 / 61 / 27 | 1.3 | 23 | 0.6 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 84 | 75 | 84 / 68 / 26 | 1.6 | 8 | 1.3 | 3.2 |
| **THE PROPOSAL**, careless | 67 | 32 | 67 / 18 / 11 | 10.2 | 0 | 0.6 | 0 |

### THE DEBT COLLECTORS (Battle Brothers: Manhunters, hard)
- **Battle Brothers**: two manhunters and four indebted (one northern, three southern), level 1; 16 in a fight, 25 in the roster; the collectors can whip the indebted (morale back, stats up two rounds); equal or fewer indebted than the rest makes everyone unhappy; non-indebted take 10% less XP; renown 100 (bb_all/1239).
- **The promise**: Two collectors driving a pack of men who owe. Sixteen in a fight. The debtors must always outnumber you.
- **The start (proposed)**: the six at level 1, three talents each; the collectors a pistol with a car door and a rifle in padded vests and hard hats; the four in debt in work clothes, two pipes and car doors, a rifle, a sledge; 250 batteries and a week of the bill; roster 25, field 16. THE WHIP is an ability (rule 180: his button, never AUTO's).

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 89 | 86 | 89 / 84 / 22 | 0.7 | 42 | 1.1 | 0.5 |
| TODAY, careful, hires for the hurt | 92 | 79 | 92 / 82 / 32 | 1.5 | 27 | 1.9 | 5.3 |
| TODAY, careless | 73 | 35 | 73 / 24 / 9 | 9.7 | 0 | 1.1 | 0.3 |
| **THE PROPOSAL**, careful | **87** | **86** | 87 / 83 / 50 | 0.6 | 43 | 0.8 | 0.3 |
| **THE PROPOSAL**, careful, hires for the hurt | 87 | 79 | 87 / 84 / 35 | 1.2 | 28 | 1.5 | 6.1 |
| **THE PROPOSAL**, careless | 71 | 33 | 71 / 19 / 8 | 10.1 | 0 | 1 | 0.2 |

### THE HUNTERS (Battle Brothers: Beast Slayers, hard)
- **Battle Brothers**: three beast slayers at level 2, 'decent equipment' and beast trophies; see tracks from farther; 50% more trophies; 10% worse prices both ways; people dislike them; every man starts wounded, one with a brawl injury; renown 200 (bb_all/0220).
- **The promise**: Three beast experts. They track far and skin twice. Towns charge them more.
- **The start (proposed)**: the three a REAL level 2, three talents each; a boar spear and the heater car door, two rifles (one the heavier crossbow); leather vests (95) and mail coifs (90); 188 batteries and a week of the bill; 10% worse prices (RUN TWO); roster 20, field 12.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 81 | 64 | 81 / 50 / 22 | 2.6 | 12 | 0.3 | 0 |
| TODAY, careful, hires for the hurt | 81 | 70 | 81 / 60 / 34 | 2.3 | 7 | 1 | 2 |
| TODAY, careless | 73 | 37 | 73 / 26 / 11 | 9.5 | 0 | 0.4 | 0 |
| **THE PROPOSAL**, careful | **98** | **90** | 98 / 93 / 63 | 1.2 | 27 | 0.4 | 0 |
| **THE PROPOSAL**, careful, hires for the hurt | 99 | 91 | 99 / 93 / 59 | 1 | 22 | 0.6 | 0.2 |
| **THE PROPOSAL**, careless | 96 | 64 | 96 / 68 / 29 | 5.4 | 2 | 0.4 | 0 |

### THE FIGHT PIT (Battle Brothers: Gladiators, hard)
- **Battle Brothers**: three gladiators at level 3, 'good equipment, but very high daily wages' (50 base each, against 35); each one a bonus trait (Glorious Endurance, Quickness or Resolve) and five arena wins; roster 12; the campaign ends when all three die (bb_all/0848).
- **The promise**: Three arena stars. Level 3, top kit, top pay. Lose all three and it is over.
- **The start (proposed, with the wages)**: the three a REAL level 3, three talents each, in plate carriers and riot helmets: a falchion machete and the riot shield, a fire axe and the heater car door, a shotgun; 95 batteries and a week of the bill; roster 12, field 12; AND BATTLE BROTHERS' VERY HIGH WAGES: a gladiator's base 50 crowns a day (a hedge knight's 35), x1.1 a level past 1, so 6 batteries a night each on top of the bill. The one bill has no wages today, so without this the pit's only hardness ('lose all three and it ends') never bites: they die 0.1 men a run.

| start, player | first ten days won | first thirty won | by ten days | lost fights a run | runs never lost | men dead a run | men walked |
|---|---|---|---|---|---|---|---|
| TODAY, careful | 84 | 67 | 84 / 55 / 34 | 2.9 | 8 | 0.5 | 0.2 |
| TODAY, careful, hires for the hurt | 89 | 75 | 89 / 66 / 43 | 2 | 8 | 0.9 | 2.1 |
| TODAY, careless | 72 | 41 | 72 / 29 / 21 | 8.9 | 0 | 0.4 | 0.3 |
| **THE PROPOSAL**, careful | **100** | **96** | 100 / 99 / 81 | 0.6 | 57 | 0.1 | 1.1 |
| **THE PROPOSAL**, careful, hires for the hurt | 100 | 95 | 100 / 98 / 83 | 0.6 | 53 | 0.4 | 1.3 |
| **THE PROPOSAL**, careless | 99 | 83 | 99 / 92 / 59 | 2.5 | 15 | 0.3 | 1.1 |
| the same without the wages, careful | 100 | 97 | 100 / 100 / 83 | 0.4 | 62 | 0.1 | 0 |
| the same without the wages, careful, hires for the hurt | 100 | 96 | 100 / 100 / 84 | 0.5 | 55 | 0.2 | 0 |
| the same without the wages, careless | 100 | 86 | 100 / 99 / 59 | 2.1 | 25 | 0.4 | 0 |

## 2c. THE FOURTEEN IN ONE TABLE (careful player unless named; first ten days / first thirty, won in 100)

| origin | label | TODAY, careful: first ten / thirty | **THE PROPOSAL, careful** | the proposal, hires for the hurt | the proposal, careless | men dead a run |
|---|---|---|---|---|---|---|
| THE CREW THAT IS LEFT | easy | 83 / 64 | **93 / 84** | 93 / 84 | 87 / 52 | 0.3 |
| A NEW CREW | easy | 83 / 64 | **94 / 84** | 93 / 84 | 87 / 51 | 0.4 |
| UP FROM HENDERSON | easy | 83 / 64 | **94 / 84** | 93 / 84 | 87 / 51 | 0.4 |
| THE WATER TRUCK | easy | 59 / 41 | **86 / 66** | 89 / 78 | 78 / 41 | 0.5 |
| THE BLOCK WATCH | easy | 98 / 83 | **99 / 91** | 98 / 90 | 88 / 46 | 1.9 |
| THE SCAVENGERS | medium | 79 / 61 | **85 / 69** | 83 / 71 | 67 / 34 | 0.3 |
| THE PROMISE KEEPERS | medium | 71 / 50 | **99 / 89** | 99 / 92 | 94 / 73 | 0.1 |
| THE DESERTERS | medium | 75 / 54 | **98 / 86** | 97 / 89 | 94 / 64 | 0.4 |
| THE RAIDERS | medium | 92 / 76 | **100 / 96** | 100 / 93 | 97 / 65 | 0.3 |
| THE LAB RATS | medium | 84 / 65 | **82 / 62** | 89 / 79 | 74 / 40 | 0.5 |
| THE FAITHFUL | medium | 90 / 77 | **82 / 75** | 84 / 75 | 67 / 32 | 0.6 |
| THE DEBT COLLECTORS | hard | 89 / 86 | **87 / 86** | 87 / 79 | 71 / 33 | 0.8 |
| THE HUNTERS | hard | 81 / 64 | **98 / 90** | 99 / 91 | 96 / 64 | 0.4 |
| THE FIGHT PIT | hard | 84 / 67 | **100 / 96** | 100 / 95 | 99 / 83 | 0.1 |

## 2d. WHAT THE FOURTEEN SAY

1. **Where an origin states a level, a real body is the whole fix.** The fight pit 67 -> 96 in 100 of its first thirty days
   (careful), the raiders 76 -> 96, the hunters 64 -> 90, the promise keepers 50 -> 89, the deserters 54 -> 86. Nothing else in
   the game changed: the door taking the levels it already names, three talents a man, and the kit the promise names.
2. **Where every man is level 1, the kit is the lever, and the pistol with a car door is the strong man.** The easy three go
   64 -> 84 with a pistol and a car door in each front man's hands and leather vests in front. A pipe in the second man's hand
   instead costs 4 points at level 2 and 11 at level 1; the level itself adds almost nothing (level 1 and level 2 both 84).
3. **More long guns with no front line lose.** The scavengers' three rifles win 55, two rifles and a front man 58, two bows and a
   front man 50, one crossbow and two pistols with car doors 69. That is the fight's guns (TUNING 10/19's draft: reach, the rate),
   COMBAT's to tune; a start cannot fix it, so the start keeps one long gun and a front.
4. **The month a hurt man is laid up decides a small crew's first month.** Today's new crew, if it never rests, fields YOU alone
   in 237 of 300 fights in days 11 to 20 and wins 15 of them: one bad fight puts the other two in bed for 30 to 40 days (Paolo's
   ruling, 9/27; it stands) and the map still counts them. Today the careful player (who rests) wins 64, the careless one 37;
   in the proposed kit 84 and 51.
   That gap (30 to 40 points) is rule 133(b)'s 'hardcore if you're fucking around', measured.
5. **Two drivers are not an easy start.** The water truck wins 43 careful; a guard bought with its goods at the door makes it 66,
   and 78 when it keeps buying men. Its promise is 'you buy your fighters', so the first one is bought at the door.
6. **The block watch wins and starves.** Twelve men at 2 a night is 24 on a 125 purse: today 8.4 men walk in thirty days. A
   week of the bill in the wagon (168) wins 91 and still walks 5 of 12 by day 30. 'A lot of mouths' is its promise; how fast
   they walk is ECONOMY's and RUN's bill to tune, not measured further here.
7. **The fight pit's hardness is its pay.** Without wages its three gladiators die 0.1 men a run and its rule ('lose all three
   and it ends') never bites. Battle Brothers' very high wages (6 a night each on top of the bill) keep it at 96 and make it walk
   1.1 men a run: the pit must keep fighting to keep its stars.
8. **The labels still do not order by the numbers** (TUNING 10/10's finding, still true with the starts fixed): proposed careful
   thirty-day wins run easy 66 to 91, medium 62 to 96, hard 86 to 96. A hard origin is hard by its RULE (alone; all three die;
   the debtors must outnumber you; worse prices), and five rules that are each origin's promise are not in the game yet: the
   deserters strike first and start hurt, the anatomists are never confident, the cultists' free joiners, the manhunters' whip,
   the beast slayers' prices. Those are where the rest of each promise lives (COMBAT, RUN TWO).

9. **The start buys the first fortnight; the third ten days are the road's.** Even the proposed easy three fall to about 50 in
   100 in days 21 to 30 (the brigands' middle mix with marksmen from day 20, and the laid-up month): from there the post, the
   market and the fight's guns decide it, not the door. The leveled origins hold (the fight pit 81, the raiders 77, the promise
   keepers 65 in days 21 to 30).

## 3. THE NUMBERS (the one table's section J, records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md; proposals, nothing reads them yet)

Each is the smallest change that put the promise on the live game, with what it measured to. Better now, never final (rule 178).
The whole fifteen in origins.json's own shape, ready to lift: banks/BOHEMIA_TUNING_ORIGIN_STARTS_PROPOSED_10_25_26.json.

THE DOOR, EVERY ORIGIN (RUN TWO builds; RUN's door hands it)
- **origin.real_level**: a man whose origin states a level takes his level-ups AT THE DOOR (levels 2 to his level, four picks each
  on his star rolls, his plan: the front's melee skill, melee defence, breath, ranged defence; the back's ranged skill, breath,
  hitpoints, ranged defence). Today a stated level is a label. Measured: the five leveled origins +22 to +39 points.
- **origin.stars_at_door**: every founding man has exactly three talents at 60/30/10, rolled per game (the killer company's rule);
  the Lone Wolf's three are fixed at three stars (section 1c).
- **origin.rolled_per_game**: every founding man rolled new each game inside his background's range (today the same names make the
  same men every game).
- **origin.kit**: each man's slots handed by the origin (men[].gear), in COOK's things, never his place in the line's: the cards in
  2b and the bank. Today every origin walks in with the line's pistol, car door and rifle in 90 armour.
- **origin.food_days = 7**: a week of the bill in the wagon at the door (Battle Brothers' wagons carry 3 to 19 days; rule 117:
  never fewer, the easy end a week); the water truck 19 (its own wagon). Measured: the block watch's walked men 8.4 -> 5.2.

THE ORIGINS' OWN NUMBERS
- **truck.door_guard**: one militia at level 1 (a pistol, the heater car door, a leather vest) bought at the door for 37 out of the
  goods: 43 -> 66.
- **pit.wage_per_man = 6** a night on top of the bill (a gladiator's 50 crowns base, x1.1 a level past 1, at ten to one): 97 -> 96,
  1.1 men walk a run.
- **wolf.body / wolf.stars / wolf.kit / wolf.perks / wolf.rolled_per_game**: section 1c (52 -> 98).
- Unchanged and named: every purse (origins.json's), every roster and field cap (rule 75a), renown (the 10/10 table, still not in
  the file).

## 4. NOTES POSTED (VAMILY.md, on each board)
RUN TWO [every origin's numbers] (origins.json's new fields, the roll, the stars, the door level-ups, the kit, the wagon, the
guard, the wages; the bank to lift). RUN [the door's promise words] (each origin's promise in plain words on the door's card).
EYES plays three starts, the Lone Wolf first (rule 184(e)); this page's 1a and 2a are what it will meet today.

## NOT MEASURED (the fourteen)
- Hiring past the first month, the free joiners, the market: the 'hires' player buys only ordinary men to stand in for the hurt.
- The rules the fight does not have (first to act, a hurt start, never confident, the whip, the potions, oaths, prices).
- Beasts: the map's roads and clear jobs are brigands; the beast slayers' promise is beasts.
- The block watch's sixteen in the field against the map's biggest parties (the first thirty days never reach them).
- A human hand: AUTO plays every man on both sides.
- The seeds: 60 a row, about 8 to 15 fights a run: a row's won-in-100 is good to about 3 points; rows within 4 of each other
  are the same start.

## ROUTED
- RUN TWO: section 3, the bank; RUN: the promise words; COMBAT: the guns (point 3), the five missing rules (point 8), the melee
  perk rows (last round's page); ECONOMY and RUN: the block watch's bill, the fight pit's wages; WORLD: the scavengers' map speed
  and the south start's place; EYES: three starts.

[bb the origins: a company's start is who, their levels, their kit, the money and one rule; Battle Brothers gives each origin a real body for its stated level and a rule that is its hardness]
[analog horror: fifteen doors into the same three men in the same rags was the tell; every door is its own room now]

