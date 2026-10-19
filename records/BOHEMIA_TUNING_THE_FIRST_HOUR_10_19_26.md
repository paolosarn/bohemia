# TUNING [the first hour's numbers]: what he meets first, beside Battle Brothers' first hour (10/19)

RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank. Battle Brothers and his "Nintendo-simple" are the whole frame (rule 117).

## Why

Rule 117 (Paolo 10/18): "I want you to be easier than Battle Brothers... like Nintendo simplified... let's just make the people feel that they're successfully doing it." The first hour decides whether a player feels successful. And rule 120 (10/18): "the combat is still so fucking ass... so fucking hard... I wanna start off with the guns."

## The finding that proves us wrong

**HIS FIRST FIGHT IS OFTEN NOT THE ONE THE MAP SIZED. IT IS NINE BRIGANDS.** Of the city's eight hand-overs into a fight (slices/BOHEMIA_CITY_WORLD.html cityHandOver), four send a party (a job, a raid, taking a place, the road encounter) and four do not: the man next to him who jumps him, the crew out on the block, the crew he taps, and the door into a building. They carry the city's own head count as a ROSTER (2 to 4: SF_MIN 2 and SF_MAX 4 for the man who jumps him, CREW [2, 4] in engine/bohemia_hostiles.js for a crew) and no party; the demo's nfOpts() reads only the party, so the count is dropped, and the fight's bandOf() falls back to ours.first_band: 9 brigands (8 thugs and a raider), written for the old twelve. They are on his screen: tap-to-travel on the map moves the marker through stepOnce(), and every step asks streetFightOnStep(). A NEW CREW (the door's default, three men) against them, the game as he plays it: wins 0 in 100. Against the party the map sizes for it (two): 90. That gap is "so fucking hard".

And the levers of our start (rule 117, measured on my EASIER, MEASURED page) are NOT IN THE GAME: the fight reads no hit-roll shift, no streak help, no enemy nerve, no breath change and no Beginner count (none of them appears in slices/BOHEMIA_FIGHT.html). He plays the TODAY column.

## THE FIRST FIGHT OF EVERY ORIGIN (measured: won in 100)

Each origin's own men, the early tier's brigands. TODAY = the game as he plays it: the door's default SEEN IT, Battle Brothers' Veteran rules, no rule 117 lever, each man in the kit of his place in the line; it is also Battle Brothers' own first fight (its rules, its count) but for its level-ups, which lift only the men who start past level one (the bench applies none, as the live fight applies none). OUR START = rule 117's levers and the Beginner count. GUNS = the draft guns (records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md) handed by the man: the main man and the best fighters keep the line, the best eyes take the rifle, then the pistol, then the shotgun; the Lone Wolf keeps his blade. AUTO on both sides, seeded.

### The map's job (the party our map sizes for that company on day one, one skull; 200 fights a cell)

| origin | men | their men (today / our start) | TODAY (Battle Brothers' Veteran rules) | OUR START | OUR START WITH GUNS | your men struck down a fight (today / start with guns) | dead in 100 fights (today / start with guns) | the guns' hands |
|---|---|---|---|---|---|---|---|---|
| THE CREW THAT IS LEFT | 3 | 2 / 2 | 90 | 97 | 95 | 0.64 / 0.49 | 7.5 / 8.5 | companion 1hand pistol, companion ranged rifle |
| A NEW CREW | 3 | 2 / 2 | 90 | 97 | 95 | 0.64 / 0.49 | 7.5 / 8.5 | companion 1hand pistol, companion ranged rifle |
| UP FROM HENDERSON | 3 | 2 / 2 | 90 | 97 | 95 | 0.64 / 0.49 | 7.5 / 8.5 | companion 1hand pistol, companion ranged rifle |
| THE WATER TRUCK | 2 | 2 / 2 | 59 | 79 | 81 | 0.97 / 0.57 | 7 / 5.5 | caravan hand rifle |
| THE BLOCK WATCH | 12 | 10 / 8 | 48 | 97 | 99 | 8.57 / 1.74 | 162.5 / 33 | farmhand rifle, poacher rifle, daytaler rifle, daytaler rifle, miller pistol, fisherman pistol, minstrel shotgun, vagabond shotgun |
| THE SCAVENGERS | 3 | 2 / 2 | 87 | 94 | 92 | 0.77 / 0.61 | 10.5 / 7 | poacher rifle, poacher pistol |
| THE PROMISE KEEPERS | 2 | 2 / 2 | 74 | 94 | 91 | 0.73 / 0.4 | 8 / 3.5 | oathtaker rifle |
| THE DESERTERS | 3 | 3 / 2 | 70 | 100 | 97 | 1.36 / 0.38 | 19 / 3.5 | deserter rifle, deserter pistol |
| THE RAIDERS | 4 | 4 / 4 | 67 | 88 | 91 | 2.09 / 1.03 | 33 / 16 | barbarian rifle, monk pistol |
| THE LAB RATS | 3 | 2 / 2 | 91 | 96 | 96 | 0.6 / 0.46 | 6.5 / 7.5 | anatomist rifle, anatomist pistol |
| THE FAITHFUL | 4 | 3 / 3 | 84 | 93 | 94 | 1.41 / 0.84 | 22 / 16 | cultist rifle, cultist pistol |
| THE DEBT COLLECTORS | 6 | 5 / 4 | 66 | 96 | 98 | 3.46 / 0.91 | 58 / 12 | indebted rifle, southern indebted rifle, southern indebted pistol, southern indebted shotgun |
| THE HUNTERS | 3 | 3 / 2 | 67 | 97 | 97 | 1.43 / 0.43 | 18 / 3.5 | beast slayer rifle, beast slayer pistol |
| THE FIGHT PIT | 3 | 3 / 3 | 78 | 94 | 91 | 1.09 / 0.77 | 16 / 12 | gladiator rifle, gladiator pistol |
| THE LONE WOLF | 1 | 2 / 2 | 23 | 44 | keeps his blade | 0.77 / 0.56 | 0 / 0 | - |

### The street's fight (no party handed: the fight's own 9 brigands; 100 fights a cell)

| origin | men | TODAY, his kit | TODAY, THE GUNS | OUR START, his kit | OUR START WITH GUNS | your men struck down (today / start with guns) |
|---|---|---|---|---|---|---|
| THE CREW THAT IS LEFT | 3 v 9 | 0 | 0 | 0 | 3 | 3 / 2.95 |
| A NEW CREW | 3 v 9 | 0 | 0 | 0 | 3 | 3 / 2.95 |
| UP FROM HENDERSON | 3 v 9 | 0 | 0 | 0 | 3 | 3 / 2.95 |
| THE WATER TRUCK | 2 v 9 | 0 | 0 | 0 | 0 | 2 / 2 |
| THE BLOCK WATCH | 12 v 9 | 81 | 96 | 95 | 100 | 5.78 / 1.58 |
| THE SCAVENGERS | 3 v 9 | 0 | 0 | 0 | 1 | 3 / 2.98 |
| THE PROMISE KEEPERS | 2 v 9 | 0 | 0 | 0 | 0 | 2 / 2 |
| THE DESERTERS | 3 v 9 | 0 | 0 | 0 | 1 | 3 / 2.98 |
| THE RAIDERS | 4 v 9 | 0 | 1 | 7 | 15 | 4 / 3.71 |
| THE LAB RATS | 3 v 9 | 0 | 0 | 1 | 3 | 3 / 2.94 |
| THE FAITHFUL | 4 v 9 | 0 | 0 | 7 | 9 | 4 / 3.78 |
| THE DEBT COLLECTORS | 6 v 9 | 7 | 15 | 19 | 51 | 5.78 / 3.88 |
| THE HUNTERS | 3 v 9 | 0 | 1 | 0 | 3 | 3 / 2.94 |
| THE FIGHT PIT | 3 v 9 | 1 | 0 | 4 | 10 | 2.98 / 2.81 |
| THE LONE WOLF | 1 v 9 | 0 | blade | 0 | blade | 1 / 1 |

**UNDER 70 IN 100 AT OUR START WITH THE GUNS (rule 117: a first fight he should mostly win):** the map's job: THE LONE WOLF 44. The street's nine: 14 of 15 (THE CREW THAT IS LEFT 3; A NEW CREW 3; UP FROM HENDERSON 3; THE WATER TRUCK 0; THE SCAVENGERS 1; THE PROMISE KEEPERS 0; THE DESERTERS 1; THE RAIDERS 15; THE LAB RATS 3; THE FAITHFUL 9; THE DEBT COLLECTORS 51; THE HUNTERS 3; THE FIGHT PIT 10; THE LONE WOLF 0).

**FIGHTS THAT NEVER END (a standoff: both sides hold their line and nobody steps in; the bench stops each at 400,000 steps):** THE WATER TRUCK, the map's job, today kit, bb: 1 in 100; THE WATER TRUCK, the map's job, today kit, start: 1 in 100; THE DESERTERS, the map's job, today kit, start: 1 in 100; THE LAB RATS, the map's job, today kit, bb: 1 in 100; THE LAB RATS, the map's job, today kit, start: 1 in 100; THE HUNTERS, the map's job, today kit, bb: 1 in 100; THE HUNTERS, the map's job, today kit, start: 1 in 100; THE FIGHT PIT, the map's job, today kit, bb: 1 in 100; THE FIGHT PIT, the map's job, today kit, start: 1 in 100; THE WATER TRUCK, the map's job, today kit, today: 1 in 100; THE LAB RATS, the map's job, today kit, today: 1 in 100; THE HUNTERS, the map's job, today kit, today: 1 in 100; THE FIGHT PIT, the map's job, today kit, today: 1 in 100. A player can walk in; AUTO never does. COMBAT (the same standoff the guns page found with the dire wolves).

**THE PROPOSAL (for RUN and COMBAT):** (1) ONE LINE in the demo's nfOpts(): a hand-over with a roster and no party becomes a party of the roster's length, so the city's own 2 to 4 reach the fight (the street then plays like the job table's 3 v 2 to 3 v 4, not 3 v 9); (2) the fight's own fallback is sized by the company in front of it (party_math's one-skull count), never the twelve's nine. Then the first fight is the map's-job table: with the guns and our start, 14 of 15 origins win 80 or more in 100. Our start's levers go into the fight (COMBAT) or the door's easiest pick (RUN), so the TODAY column becomes the START column.

## EVERY OTHER NUMBER HE MEETS IN THE FIRST HOUR

| what he meets | ours | Battle Brothers' first hour | mark | proposed | source |
|---|---|---|---|---|---|
| the starting purse (A NEW CREW, the middle money) | 240 batteries (2400 crowns at ten a battery) | 2000 crowns (Rebuilding a Company, Medium funds; bb_all/1651) | EASIER | as is | records/target/bb/origins.json |
| the first wages (three men, a day) | 0 (hire.wage_charged: the screens charge no wage) | 42 crowns a day (three companions at a base wage of 14; bb_all/0427) | EASIER | as is in the first hour; PEOPLE and ECONOMY owe the wage itself (a company that never pays never feels the purse) | banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json hire.wage_charged |
| the first fight's enemies | brigands of the early tier (thugs 8 to raiders 2), as many as the map's job count for your company at one skull, the Beginner count at our start | thugs and sometimes raiders (bb_all/0299_Brigands), sized by the company's strength at Veteran | EASIER at our start (the count x0.85), the same at Veteran | as measured below | ours.enemy_tiers, records/target/bb/party_math.json |
| the first fight's enemy gear | the early tier's rows: Thug body 5-70, head 0-45, a club or a pitchfork; no bows before day 20 (25 at our start) | the same rows (the wiki's Brigand Thug) | the same, and later at our start | as is | records/target/bb/enemies.json, ours.enemy_tiers |
| the first gun in his hands | none in 14 of 15 origins (the seventh man is the first rifle) | a ranged companion with his bow or crossbow from the first day | HARDER, NO WORD (and against rule 120(a)) | the draft guns handed by the man (records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md) | the guns page, finding 1 |
| the first man struck down: does he die | 20 in 100 (+5 a mark carried) | 67 in 100 (survival 33) | EASIER | as is | ours.struck_down_death_chance |
| the first man struck down who lives: how long he is out | 30 to 40 days laid up | 0 days: he fights on with a permanent injury | HARDER, HIS WORD (9/27) | as is (his) | ours.struck_down_laid_up_days |
| the first hire's price (a militiaman, level one) | up to 225 batteries | 49 batteries by the wiki's formula (base plus 1.25 x the kit) | HARDER, NO WORD (4.6 times) | 49 (engine/bohemia_pricetable.js hireCostRange, already in the repo, loaded by no screen) | records/BOHEMIA_TUNING_THE_SCREENS_AROUND_THE_FIGHT_IN_THE_ONE_TABLE_10_18_26.md |
| the first hire's stars | one starred stat | three starred stats (60/30/10 for one to three stars) | HARDER, NO WORD | three, as Battle Brothers | hire.starred_stats |
| the first sale (what a town pays for your loot) | 1/7 of its worth | 0.136 at a town hall, neutral (0.109 a camp, 0.177 a city) | EASIER (a hair) | as is | market.sell_cut |
| the first doctor | 20 plus a fifth a level, halves the days | the same (the Temple: 20, x0.2 a level, halves) | the same | as is | clinic.base_price |
| the first haircut | 1 battery | free | HARDER, HIS WORD | as is (his) | barber.price |
| the first job's pay (one skull) | 30 batteries | one sourced anchor: 760 crowns (76 batteries) for a fifteen-head job; nothing per skull | NO TWIN | as is until ECONOMY prices a job by its heads (contractPayBatteries, in the repo) | contract.pay_one_skull |
| jobs he may hold at once | 2 | 1 | EASIER | as is | contract.slots |
| the first level up (experience) | the wiki's table, -15 in 100 at Veteran, -5 at our start | the same table, -15 at Veteran (bb_all Experience) | EASIER at our start | as is | experience.global_modifier |
| his first swing's roll | +5 for you, -5 for them at our start (Battle Brothers' Beginner roll) | 0 at Veteran | EASIER | as is | the rule 117 levers (banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json) |

**HARDER THAN BATTLE BROTHERS WITH NO WORD FROM HIM (rule 117(d): a NO before he sees it): 4.** The first fight on the street (above). The first gun in his hands: none in 14 of 15 origins (the seventh man is the first rifle) against a ranged companion with his bow or crossbow from the first day; proposed the draft guns handed by the man (records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md). The first hire's price (a militiaman, level one): up to 225 batteries against 49 batteries by the wiki's formula (base plus 1.25 x the kit); proposed 49 (engine/bohemia_pricetable.js hireCostRange, already in the repo, loaded by no screen). The first hire's stars: one starred stat against three starred stats (60/30/10 for one to three stars); proposed three, as Battle Brothers.

## WHAT CANNOT BE TESTED YET

1. THE GUNS ARE THE BENCH'S: the draft rows, the row's own distance numbers and the butt are in memory only until COMBAT builds them.
2. WHICH HAND-OVER HE MEETS FIRST: the map decides (a street crew, a door, or a job); this page measures each, not the order.
3. AUTO PLAYS BOTH SIDES: a player does better; the comparison between kits and settings is fair, the absolute number a floor.
4. WAGES AND FOOD: the first hour charges none, so nothing here can be felt yet (ECONOMY, PEOPLE).

## ROUTED

- RUN (the map's hand-overs) + COMBAT (the fight's fallback): one line in nfOpts() turns a roster into a party (count = roster.length) so the city's own count reaches the fight; the fallback band is sized by the company in front of it, never the twelve's nine. This is the first fix of "so fucking hard".
- COMBAT: our start's levers are measured and not built (the hit-roll shift, the streak help, the enemy nerve, the breath, the Beginner count).
- COMBAT + RUN: each origin's first fight with the guns handed by the man (the job table's last column).
- RUN TWO + ECONOMY: the first hire's price, 49 by the wiki's formula against 225 (engine/bohemia_pricetable.js is in the repo and no screen loads it); three starred stats, not one.
- PEOPLE + ECONOMY: wages are charged nowhere, so the first hour's purse never moves on its own.

Bank: banks/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.json (and its resume cache). Tool: tools/bohemia_tuning_the_first_hour.js (the bench is the guns page's, --cell with an origin's own men and, for the street, the fight's own band).

[bb Battle Brothers sizes every fight, even an ambush on the road, by the company in front of it; it never sends a band written for twelve at three.]
[analog horror: nine men stepping out of the dark onto three is the scene; the problem is that it is the first one. Named for SOUNDS and COMBAT, not moved.]
