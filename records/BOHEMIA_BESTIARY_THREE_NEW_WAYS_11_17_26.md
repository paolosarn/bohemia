# BESTIARY: THREE MORE TYPES, THREE WAYS NO ENEMY HAD -- THE DUELIST, THE PREACHER, THE SPOTTER -- 11/17/26
# The coordinator's routine 'BESTIARY full sweep' (rule 453: 'the next ten furthest from the floor, a few per build, each with one thing
# it does in a fight that no other does, each met in a real fight on the map or in a job; reuse bodies and clothes that exist before any
# new sheet, and give CHARACTER the list of who wears a stand-in'; rule 454(a): the fewest words; rule 441). Build 3 of the sweep, after
# BUILD 11/17i ALL TWELVE FACTIONS FIGHT and BUILD 11/17m THE MAMMOTH.

## 1. THE FLOOR, ONE TABLE (records/target/bb/roster.json; THE BESTIARY FLOOR reads it)
| floor | his number | the fight fields | short |
|---|---|---|---|
| factions | 12 | 12 | 0 |
| enemy types | about 75 | 67 (64 before this build) | 8 |
| beasts | 17 | 18 lab-made (23 fielded) | 0 |
| bosses | 3 | 10 | 0 |
| champions | some | 3 kinds, each a named man | 0 |

## 2. THE THREE (records/target/bb/bohemia_enemies.json, added_by BESTIARY 11/17; every word a draft for WORDS, every number for TUNING)
Each is the second type of a faction that had one, each on a Battle Brothers archetype's own mechanic that the fight did not have:
| type | party (where met) | rides (wiki) | the one thing only he does | his lesson | measured (10 AUTO fights, a crew of 6 at his phase) |
|---|---|---|---|---|---|
| DUELIST | the hired guns, from the early phase (1 in 3 of a band) | swordmaster, with the Noble Sword | the RIPOSTE (bb_all/1696_Riposte: 4 AP, 25 fatigue, -10 to hit): after his own blow, or with two of yours on him, he goes ON GUARD; until his next turn every miss on him from the next tile draws one back (ours: a shot from beside him too; from further off he cannot reach) | Miss him up close and he hits back. Shoot him from further off. | 13 guards, 24 blows back; crew wins 8/10 (8 without him) |
| PREACHER | the flock, from the early phase (1 in 4) | cultist's body, the Hexe's Charm (bb_all/0991_Hexe) | the TURN: he points at the weakest nerve of yours (4 tiles) who has a friend beside him; failed (his resolve is the chance to hold), when that man's turn opens he hits the friend beside him and the turn is gone. The preacher down, the spell breaks | He turns a weak man on his friend. Drop him first. | 39 turns, 36 men hit a friend; 8/10 (8) |
| SPOTTER | the eye in the sky, from the early phase (1 in 3) | engineer, the Mortar (bb_all/1321_Mortar, 0769_Fire Mortar: 20 to 40, 70% to armour, 20% straight through) | the CALL: he calls a cross of ground (a tile and the four beside it) where two or more of yours stand and none of his; a security camera's red corners sit on it with the record dot blinking on the beat; when his next turn opens every man still on it, either side, is hit from the roof. The spotter down, it never lands | When he calls your ground, get off it. | 26 calls, 20 landed; 8/10 (10) |
The words on the fight (rule 454(a), the fewest): 'X is on guard.' 'X strikes back.' 'X turns Y.' / 'Y holds.' 'X hits Y.' 'X calls
your ground.' 'The roof hits N.' Nothing else was written; no standing line was touched.
The engine (slices/BOHEMIA_FIGHT.html): canGuard/onGuard/riposte (apply()'s missed melee blow), turnTarget/turnMan/turnedTurn
(beginTurn), callTarget/callGround/callLands (beginTurn) and drawCalled on the page; strike() no longer swings a sweep's other blows
from a man the riposte dropped. The brains read 'ripostes', 'turns', 'calls'; the numbers: numbers.riposte, numbers.turn, numbers.call.

## 3. THE CLOTHES: WHO WEARS A STAND-IN (handed to CHARACTER, handoffs/CHARACTER.md)
MEASURED: of the 13 faction looks only faction_homeless is worn by no enemy band, and every enemy sheet is worn. So, as the 11/14
splits did, three pools gave one spare each (ours.json people_looks.band; each keeps 3 or more): the raiders' pool (brigand_raider,
lower_brigand_raider, orc_young) gave faction_mob to the DUELIST; the brigand leader's gave faction_church to the PREACHER; the
marksmen's gave faction_network to the SPOTTER. All three are STAND-INs ('looks_stand_in'). Their own clothes (each 2+ people): the
duelist (a paid blade's good coat and a feathered hat, BB's swordmaster), the preacher (the flock's robe with a stole and a staff), the
spotter (casino security: a vest, a radio, an earpiece).
Still on stand-ins from Build 1: the hired gun (faction_caravans), the head taker (faction_volunteers), the casino gunner (faction_reds).

## 4. THE GATE (THE BESTIARY FLOOR, gates/the_bestiary_floor_gate.py + _men.js + _fight.js)
F2's ratchet 67. F10: a duelist must go on guard and strike back, a preacher's man must hit a friend, a spotter's called ground must be
hit, on the live rules; and a crew of 6 beats his band 6 in 10 or he makes it no harder than it was without him. F9 NEW LEG: a man whose
one thing is his own is PLAYED ON THE PAGE: the fight opened through the one door, FIGHT and AUTO tapped with his own buttons, his
fastest speed, and the fight played until he does it (the guard and the blow back, the turn and the friend hit, the call and the roof);
the demo and the alpha, a phone upright and sideways.
[bb Battle Brothers' Hexe charms the man with the weakest nerve; ours turns him on the friend beside him.]
[analog horror: the red corners of a casino camera on the street, and the record dot blinking, a turn before the roof opens up.]

## 5. PROOF
On the merge with main (the fight file with COMBAT THREE's mall), the page legs for the three (gates/the_bestiary_floor_fight.js,
ONLY_MEN, ONLY_TYPES): on the demo and the alpha, a phone upright and sideways, each fielded in his clothes, named and armed, his
party's words, the win home, and HIS MOVE PLAYED ON THE PAGE on AUTO (his own FIGHT, AUTO and speed buttons on the phone): the
duelist struck back in round 3 to 5, the preacher's man hit his friend in round 2 to 4, the spotter's ground was hit in round 2 or 3;
12 of 12, a champion each way, the page threw nothing. The first cut of the leg never started the fight: the fight's own AUTO button
is hidden on the phone (0 by 0) and the phone's own buttons are the live ones; and a duelist who answered only blades never struck
back on the alpha, where his company shoots from the next tile (ours now: any miss from beside him).
The data legs (THE BESTIARY FLOOR --no-browser) 11/0; THE ROSTER fresh. THE NEW ENEMIES 11/1: the one red is SIZED TO THE CREW's
giants as on main (bears, sloths, ancient bison, longhorns, mammoths at a crew of 3: row 574, routed to TUNING and WORLD); this
build's three factions: the flock 8/10 and 8/10, the hired guns 8/10 and 8/10, the eye in the sky 8/10 and 10/10 (crews of 3 and 6).
The card: records/target/BESTIARY_THREE_NEW_WAYS.jpg (VOTE bestiary-three-new-ways-11-17, STAND-IN: the clothes are borrowed).
