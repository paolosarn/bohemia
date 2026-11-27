# BESTIARY 3: THE DRONE OPERATOR (BUILD 11/27u, VAMILY rule 490(c), ask row 762, this lane's part)

PAOLO 11/27, on rule 489: 'the drone maybe doesn't explode and move the same turn, and it's possible to escape from it, but an explosion
from a drone is gonna be damn near a one KO for most people for sure... a drone controller guy... it could be very hurtful towards teams
that are only melee people'. Rule 490(c): the operator is a man on the board who flies them, stays back and is the target: drop him and
his drones fall. ARMORY 3 built the drone (BUILD 11/27h: it flies in one turn over a lit cross and lands the next; step off it or shoot
it down; its pilot dropped, it falls); this lane fields the man.

## BATTLE BROTHERS FIRST (records/BOHEMIA_BESTIARY_THREE_HUMAN_FORCES_BY_ROLE_THE_RESEARCH_11_27_26.md, Q5)
The nearest model is the Engineer and his Mortar: the machine is worked by a soft man who stands at the back, cannot work it while
engaged, and 'kill or tie up the Engineer and the mortar stops' (bb_all/0691_Engineer.txt, bb_all/1321_Mortar.txt, bb_all/1190_Load
Mortar (10 fatigue).txt). The mortar marks its ground a turn ahead, as our drone lights its cross. The wiki says to snipe Engineers first.

## WHAT SHIPPED (records/target/bb/bohemia_enemies.json; no new fight code but one line)
- THE ROW drone_operator ('OPERATOR'): rides the wiki's engineer as he is (70 hitpoints, a padded vest, ranged skill 50: soft on purpose),
  gear the Charge Drone and a Knife (the drone's own 2 uses: two drones a fight; then the Knife is the pistol in his waistband, rule 489(a)).
- THE BRAIN 'operator': the backline's stand-and-shoot (advance false, step out of melee, prefers the soft man), 'throws' (the drone
  over the pistol), 'kites' (a step back after each launch), 'drones' (the check's word). The flying is the fight's own (armoryFirst,
  droneTarget: the cross with the most of his men on it and none of theirs).
- WHERE: the eye in the sky (the casino; Battle Brothers' city states, where the Engineer lives; a surveillance outfit is the one that
  really has drones), weight 1 in its middle and late bands. Not the hired guns or the House: no Battle Brothers model, and no line of
  his says they would; more factions are a weight in the mix (TUNING / FACTIONS).
- THE LOOK: a STAND-IN, faction_network (free since CHARACTER dressed the spotter, 11/21). CHARACTER 2: his own clothes.
- ONE LINE OF CODE: the waistband rule skipped him because a drone is a 'gun' in the fight's tables; strapOf now arms a man holding a
  drone with his pistol too.
- THE FLOOR: the roster counts 75 enemy types in the fight (74 before): Paolo's 'about 75' (9/29) met.

## MEASURED (headless, the casino's band at day 30 against six farmhands on AUTO)
- 6 fights with him: 16 drones flown, 6 shot down, 10 landed on empty ground (his men on AUTO step off every lit cross: rule 490(a)'s
  escape), 0 men hit; he was the first man of theirs to drop in 3 of 6; his six won 6 of 6; his pistol came out 8 times after the drones.
- EVERY TYPE's own sweep (6 fights of his band, 3 of him alone against six): 16 launches, 7 landings, 1 drone fell when he died while it flew.
  His drone and his pistol drop (a drone with uses left; a spent one is gone).
- On the page (tools/bohemia_bestiary_three_operator_proof.js, 390 x 844, AUTO both sides): the drone hangs over its five lit tiles with
  one of his men on them; his men step off; the operator stands at the back; a spearman pins and kills him; 0 page errors. Frames in
  records/bestiary_proof/ (not published).
- WHAT THIS SAYS FOR TUNING AND COMBAT FIVE: on AUTO the drone never lands on a man (the escape is always taken), so its threat is the
  turn it costs (a step off the line, or a shot spent on the drone) and the hand-played man who stays on the cross. Rule 490(d)'s 'hard
  answer to an all-melee crew' is not yet hard: an all-melee crew simply walks off the cross. The numbers are TUNING's and COMBAT FIVE's
  (a drone that follows a man one tile, a cross that cannot always be left in one turn); this lane fields the man.

## GATES (pre-push pass, the files in this diff)
EVERY TYPE THROUGH A FIGHT 5/0 (81 of 81 kinds; his own move seen: drone_launch); THE BESTIARY FLOOR 13/0 (F8 the roster refreshed);
EVERYBODY IS STRAPPED 5/0; THE GUNS GROW UP 19/0; NO AMMO, NO SHOT 12/0; A FEW, NOT TWELVE 7/0; DEMO BUILD 25/0; PAGES PUBLISH 29/1: the cap, main's own (439 KB over at e731e1131 before this build; ask row 775, PLUMBER 8; this build shrank this lane's two cards 329 -> 155 KB).

## NEXT
The machine gunner (the belt-fed behind a shield, Battle Brothers' Gunner), the rocket man (one rocket a fight before the lines meet),
the breacher (Line Breaker's shove that strips a wall), the medic (ours: one a squad, at the back, spends his turn); then rule 491.
[bb Battle Brothers' Engineer stands by his mortar at the back and the wiki says to kill him first; ours stands at the back with a controller]
[analog horror: you hear the drone before you see it, and you never see the man flying it until he is the last one standing]
