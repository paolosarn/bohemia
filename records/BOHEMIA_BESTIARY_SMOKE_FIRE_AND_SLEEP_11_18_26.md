# BESTIARY: SMOKE, FIRE AND SLEEP -- THREE MORE TYPES, AND EVERY BEAST AGAINST A MAN -- 11/18/26
# The coordinator's routine 'BESTIARY next' (rule 453 round after round: 'the next types furthest from the floor, a few per build,
# each with one thing no other does; every beast checked against a man for size'; rules 441, 454(a)). After BUILD 11/17zk THE MAMMOTH,
# NOT A BUILDING (the mammoth at its real size, live).

## 1. THE FLOOR, ONE TABLE
| floor | his number | the fight fields | short |
|---|---|---|---|
| factions | 12 | 12 | 0 |
| enemy types | about 75 | 70 (67 before this build) | 5 |
| beasts | 17 | 18 lab-made (23 fielded) | 0 |
| bosses | 3 | 10 | 0 |
| champions | some | 3 kinds, each a named man | 0 |
FURTHEST FROM THE FLOOR, MEASURED (types each faction's bands deal): the head takers 1, the hired guns 2, the flock 2, the eye in the
sky 2, the machines 2 (robot art first). So two for the head takers and one for the hired guns.

## 2. THE THREE (records/target/bb/bohemia_enemies.json, added_by BESTIARY 11/18; words drafts for WORDS, numbers for TUNING)
Each is a Battle Brothers tool the fight had for the player's own cell vest (the smoke, the burning ground) or not at all (sleep):
| type | party (where met) | rides (wiki) | the one thing only he does | his lesson | measured (10 AUTO fights, a crew of 6) |
|---|---|---|---|---|---|
| SMOKER | the head takers, from the early phase (1 in 4) | assassin, a head taker's kit | the SMOKE POT (bb_all/1822_Smoke Pot.txt: 3 tiles, 5 AP): a cross of smoke over the man of his your shooters can see; the smoke is the cell vest's (a shot through it -20); two pots | Smoke hides them from your guns. Walk in. | 6 pots; crew wins 9/10 (10 without him) |
| DARTER | the head takers, from the early phase (1 in 4) | bounty hunter marksman, a light crossbow | the DART (the Alp's Sleep, bb_all/0046_Alp.txt): at his crossbow's chance a man of yours sleeps, the lonely one first; asleep he loses up to two turns, and wakes when struck or when a friend ends a turn beside him | His dart puts a man to sleep. Keep a friend beside every man. | 14 men asleep; 9/10 (9) |
| GRENADIER | the hired guns, from the early phase (1 in 5) | mercenary | the FIRE POT (bb_all/0770_Fire Pot.txt: 'anyone ending their turn inside the burning area will catch fire... friend and foe alike'): a cross of fire where two or more of yours stand, never on a tile of his own man's; the cell vest's burning ground; two pots | He sets the ground on fire. Spread out, and never end a turn in it. | 10 pots, 46 burns; 7/10 (8) |
The words (rule 454(a)): 'X throws smoke.' 'X throws fire.' 'Y sleeps.' / 'X misses.' 'Y wakes.' Nothing standing was touched.
The engine (slices/BOHEMIA_FIGHT.html): smokeTarget/smokePot, fireTarget/firePot, dartTarget/dart, sleepTurn (beginTurn), wakeBeside
(turnOver) and a struck sleeper waking (apply). The smoke and the fire draw as the cell vest's already do.

## 3. THE CLOTHES (STAND-INS; CHARACTER has the list, handoffs/CHARACTER.md)
Three hall men no other enemy type wears alone, taken from pools that keep four or more: the smoker person_volunteers_1 and the darter
person_volunteers_2 (the head taker's own gang), the grenadier person_caravans_2 (the hired gun's). Their own clothes: the smoker (a
hood and a satchel of pots), the darter (a hunter's coat, the crossbow), the grenadier (a company jacket with bottles in a bandolier).

## 4. EVERY BEAST AGAINST A MAN (THE BESTIARY FLOOR F11b)
Each beast's picture averaged over its eight facings, at its own draw, against a man's, as a share of its model's height in life
(the sheet's height_m against his 1.752 m). At the one scale (0.75) four were more than 15% off: the long necks short (the llama, the
goat), the long low cats tall (the two lions). Each now has its own number (numbers.beast_draw.by_look), read by the fight, the map
and the after-fight picture like the scale:
| beast | at 0.75 | now | its draw |
|---|---|---|---|
| large-headed llama | 0.79 | 1.00 | 0.95 |
| Harrington's goat | 0.84 | 1.01 | 0.90 |
| stilt-legged horse | 0.86 | 0.86 | 0.75 |
| camelops | 0.89 | 0.89 | 0.75 |
| Ice Age horse | 0.92 | 0.92 | 0.75 |
| ancient bison | 0.93 | 0.93 | 0.75 |
| cave hyena | 0.94 | 0.94 | 0.75 |
| ground sloth | 0.94 | 0.94 | 0.75 |
| Columbian mammoth | 0.94 | 0.94 | 0.75 |
| long-horned bison | 0.96 | 0.96 | 0.75 |
| coyote | 0.97 | 0.97 | 0.75 |
| short-faced bear | 0.97 | 0.97 | 0.75 |
| feral shepherd | 1.00 | 1.00 | 0.75 |
| sabre-tooth | 1.00 | 1.00 | 0.75 |
| teratorn | 1.00 | 1.00 | 0.75 |
| feral hog | 1.04 | 1.04 | 0.75 |
| dire wolf | 1.06 | 1.06 | 0.75 |
| feral bull | 1.06 | 1.06 | 0.75 |
| shrub ox | 1.07 | 1.07 | 0.75 |
| American cheetah | 1.10 | 1.10 | 0.75 |
| Pleistocene jaguar | 1.10 | 1.10 | 0.75 |
| American lion | 1.16 | 1.01 | 0.65 |
| mountain lion | 1.18 | 1.03 | 0.65 |
F11 (the big four at the shoulder, their tallest facing) is unchanged: the mammoth 2.30 men. PLANTED for F11b: every beast at the one
scale, the four go red.
[bb Battle Brothers' Assassin throws his pots, no more than two; ours are the hired guns' and the head takers', the player's own tools turned on him.]
[analog horror: the smoke rolls between the houses and when it clears one of yours is lying down, breathing, and will not wake.]

## 5. PROOF
On the page (gates/the_bestiary_floor_fight.js, ONLY_MEN, the three): on the demo and the alpha, a phone upright and sideways, each
fielded in his clothes, named and armed, his party's words, the win home, and HIS MOVE PLAYED ON THE PAGE on AUTO with the phone's own
buttons: the smoker's smoke in round 1, the darter's sleeper in round 3 to 5, the grenadier's fire in round 2 to 6; 12 of 12, a
champion each way, the page threw nothing. The first run's grenadier threw nothing on the demo on its side in four fights: once the
lines meet his own men stand on every cross, and he waited for a clean one (now the fire falls on the cross but never under his own
men; re-run 4 of 4). The first smoke was the cell vest's thin smoke and could not be seen on the light ground: a pot's smoke is now
drawn thick and dirty (drawSmoke, f.pot; the vest's stays thin). The llama and the goat at their own sizes on the demo both ways:
fielded, the win home, the kill and the take. The data legs (THE BESTIARY FLOOR --no-browser) 13/0 with F11b and its plant.
The card: records/target/BESTIARY_SMOKE_FIRE_AND_SLEEP.jpg (VOTE bestiary-smoke-fire-and-sleep-11-18, STAND-IN: the clothes are borrowed).
