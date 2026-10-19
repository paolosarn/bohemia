# TUNING [the whole grid]: every fight he will meet, not four (10/18)

RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank.

**376 OF 873 SQUARES PLAYED SO FAR.** The bench is still running (the biggest fights take minutes each); a dash is a fight NOT PLAYED YET, never a guess. It resumes from its cache (banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.cells.ndjson) and this page is re-written when it ends.

## Why

Paolo 10/18: "how are you even testing these fights... against animals, against different group sizes, one person, three, six, up to 14... a 12 man Lone wolf squad, you can go up to 36 or 40 Enemies... we don't even have all the equipment in the game... what are you even testing?" He was right: last round's 78 in 100 was one average of four fights, all against people, all in the starting kit. Rule 117(e): a tuning number is a grid, never one average. (records/BOHEMIA_PAOLO_WHAT_ARE_YOU_EVEN_TESTING_A_TUNING_NUMBER_IS_A_GRID_10_18_26.md)

## How it was measured

- The LIVE fight (slices/BOHEMIA_FIGHT.html's own rules and exactly the data files its loadAll() reads), headless in node by tools/bohemia_tuning_the_whole_grid.js; both sides on the fight's own AUTO brain; 100 seeded fights a cell (half for a cell of 30 or more men on the board, the beast roster 40; each cell carries its own count in the bank), so every setting meets the same fights. The hooks at neutral replay the unhooked fight event for event (--control, 6 of 6).
- YOUR COMPANY: 1 (THE LONE WOLF's hedge knight, level 4), 3 (A NEW CREW's three), 6, 12 (the twelve) and 14 (the twelve and two more, the 16-cap origins). Each man keeps his place in the line's job.
- THEIR NUMBER: 3, 6, 12, 20, 38, and THE MAP'S PICK (party_math's job count, capped at 13 today).
- WHO: people (brigands, dressed by the fight's own tiers) and every beast whose fight is a body and one strike (below).
- THE GEAR STAGE (the day the enemy is dressed for, your level, your gear): EARLY = each man's kit (his place in the line, ours.crew and ours.weapon_rows), day 1, his origin's level; MIDDLE = the town shelf (RUN TWO's market sells the 15th to 75th percentile of rows by value): mail, a better weapon of the same kind, day 30, level 5; LATE = the city shelf (30th to 100th percentile): 210 body, 210 head (the heaviest a man can carry and still swing: see ENDGAME), the best common weapon of the kind, day 80, level 9.
- The middle and late rows by job: pipe morning_star -> winged_mace, sledge two_handed_skull_hammer -> two_handed_hammer, pistol rondel_dagger -> qatal_dagger, rifle crossbow -> heavy_crossbow, shotgun handgonne -> handgonne, bottles bundle_of_heavy_javelins -> bundle_of_heavy_throwing_axes, car_door kite_shield -> heater_shield, body mail_hauberk -> reinforced_mail_hauberk, head padded_flat_top_helmet -> bascinet_with_mail. EARLY is each man's own kit.
- THE SETTING: TODAY = TODAY: the game as it plays (the door defaults to Veteran; a level never raises a stat in the fight); BB = BATTLE BROTHERS VETERAN, THE HARD END: today plus a level raising three stats; START = THE START (rule 117): your roll +5 theirs -5, a bad streak ends, their nerve 0.9, your breath 18, later crews, the party at 0.85, xp -0.05.
- BATTLE BROTHERS BESIDE A CELL: the same fight at its Veteran rules (BB, measured), and whether its map sends that many to that company at that stage: party_math's job count from one skull to three at Veteran, without our cap of 13 (Battle Brothers' count words run to "a plethora, 14 or more", GROK_60). The coefficients are party_math's own (ours, draft, calibrated on rule 75b's anchor); for twelve men at level 9 on a three-skull job they give 41, which is his own "36 or 40".

## What Battle Brothers' map sends each company (one skull to three, Veteran, no cap)

| your men | EARLY | MIDDLE | LATE |
|---|---|---|---|
| 1 | 2 to 2 (level 4) | 2 to 2 (level 5) | 2 to 3 (level 9) |
| 3 | 2 to 4 (level 1) | 4 to 7 (level 5) | 6 to 10 (level 9) |
| 6 | 5 to 9 (level 1.7) | 9 to 14 (level 5) | 12 to 20 (level 9) |
| 12 | 10 to 17 (level 1.4) | 17 to 28 (level 5) | 25 to 41 (level 9) |
| 14 | 12 to 20 (level 1.5) | 20 to 33 (level 5) | 29 to 47 (level 9) |

Our map sends at most 13 (party_math job.max and roaming.max, both "ours (draft)"). A fight past 13 is one the game cannot make today; it is in the grid because Battle Brothers makes it.

## THE WORST FIGHTS HE WILL MEET (inside what Battle Brothers' map sends; our start, won in 100, lowest first)

| # | who | your men | their men | stage | OUR START | TODAY | BATTLE BROTHERS | your men down, in 100 | dead in 100 fights | minutes on AUTO |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PEOPLE (brigands) | 6 | 20 | LATE | 5 | 0 | 0 | 97 | 113 | 3.7 |
| 2 | PEOPLE (brigands) | 12 | 38 | LATE | 10 | 0 | 0 | 95 | 170 | 8 |
| 3 | PEOPLE (brigands) | 14 | 38 | LATE | 30 | 0 | 0 | 80 | 230 | 9 |
| 4 | PEOPLE (brigands) | 14 | 20 | EARLY | 48 | 12 | 16 | 69 | 178 | a standoff in 2 of 100 (see below) |
| 5 | PEOPLE (brigands) | 1 | 3 | LATE | 59 | 9 | 36 | 41 | 0 | 0.8 |
| 6 | PEOPLE (brigands) | 6 | 12 | MIDDLE | 65 | 15 | 34 | 59 | 67 | a standoff in 1 of 100 (see below) |
| 7 | PEOPLE (brigands) | 3 | 6 | LATE | 65 | 5 | 44 | 48 | 15 | 1.4 |
| 8 | PEOPLE (brigands) | 6 | 12 | LATE | 66 | 0 | 24 | 54 | 64 | a standoff in 1 of 100 (see below) |
| 9 | PEOPLE (brigands) | 3 | 6 | MIDDLE | 67 | 25 | 42 | 51 | 22 | 1 |
| 10 | PEOPLE (brigands) | 3 | 3 | EARLY | 82 | 67 | 67 | 33 | 10 | 0.4 |
| 11 | PEOPLE (brigands) | 12 | 20 | MIDDLE | 83 | 16 | 48 | 42 | 86 | 3.6 |
| 12 | PEOPLE (brigands) | 12 | 12 | EARLY | 85 | 45 | 54 | 45 | 115 | a standoff in 1 of 100 (see below) |
| 13 | PEOPLE (brigands) | 6 | 6 | EARLY | 89 | 60 | 61 | 37 | 37 | 0.9 |
| 14 | PEOPLE (brigands) | 12 | 20 | LATE | 96 | 0 | 46 | 31 | 88 | a standoff in 2 of 100 (see below) |
| 15 | PEOPLE (brigands) | 3 | 3 | MIDDLE | 96 | 75 | 89 | 9 | 4 | 0.5 |
| 16 | PEOPLE (brigands) | 14 | 20 | MIDDLE | 98 | 30 | 76 | 21 | 38 | a standoff in 2 of 100 (see below) |
| 17 | PEOPLE (brigands) | 14 | 12 | EARLY | 98 | 78 | 80 | 23 | 51 | 1.9 |
| 18 | PEOPLE (brigands) | 3 | 3 | LATE | 98 | 71 | 95 | 6 | 4 | 0.7 |
| 19 | PEOPLE (brigands) | 12 | 12 | MIDDLE | 99 | 76 | 98 | 12 | 28 | 2.3 |
| 20 | PEOPLE (brigands) | 6 | 6 | MIDDLE | 99 | 85 | 94 | 10 | 15 | 0.9 |
| 21 | PEOPLE (brigands) | 14 | 20 | LATE | 100 | 4 | 66 | 16 | 40 | 4.3 |
| 22 | PEOPLE (brigands) | 12 | 12 | LATE | 100 | 44 | 100 | 5 | 6 | 2.2 |
| 23 | PEOPLE (brigands) | 14 | 12 | MIDDLE | 100 | 95 | 100 | 5 | 20 | 1.8 |
| 24 | PEOPLE (brigands) | 14 | 12 | LATE | 100 | 78 | 100 | 3 | 4 | 2.6 |
| 25 | PEOPLE (brigands) | 6 | 6 | LATE | 100 | 54 | 96 | 6 | 8 | 1.1 |
| 26 | PEOPLE (brigands) | 12 | 6 | EARLY | 100 | 99 | 99 | 10 | 31 | 1 |
| 27 | PEOPLE (brigands) | 12 | 6 | MIDDLE | 100 | 100 | 100 | 1 | 4 | 0.9 |
| 28 | PEOPLE (brigands) | 12 | 6 | LATE | 100 | 100 | 100 | 1 | 0 | 1.1 |
| 29 | PEOPLE (brigands) | 14 | 6 | EARLY | 100 | 100 | 100 | 5 | 16 | 1 |
| 30 | PEOPLE (brigands) | 14 | 6 | MIDDLE | 100 | 100 | 100 | 1 | 0 | 1.3 |

## FIGHTS THAT NEVER END (26 of 376 squares hold at least one)

Both sides hold their line and nobody steps in; the bench stops the fight at 400,000 steps and counts it as neither won nor lost. 1 or 2 fights in 100 of these squares: people (brigands) 12 v 20 late bb (2), people (brigands) 12 v 20 late start (2), people (brigands) 12 v map early today (2), people (brigands) 12 v map early bb (2), people (brigands) 14 v 20 early start (2), people (brigands) 14 v 20 middle today (2), people (brigands) 14 v 20 middle bb (2), people (brigands) 14 v 20 middle start (2), people (brigands) 6 v 12 middle start (1), people (brigands) 6 v 12 late bb (1), people (brigands) 6 v 12 late start (1), people (brigands) 6 v map middle start (1), people (brigands) 12 v 12 early today (1), people (brigands) 12 v 12 early bb (1), people (brigands) 12 v 12 early start (1), people (brigands) 12 v 12 middle today (1), people (brigands) 12 v 12 late today (1), people (brigands) 12 v map early start (1), people (brigands) 12 v map late today (1), people (brigands) 14 v 12 early today (1), people (brigands) 14 v 12 middle today (1), people (brigands) 14 v 12 late today (1), people (brigands) 14 v map early today (1), people (brigands) 14 v map middle start (1), direwolfs 3 v 12 late bb (1), direwolfs 3 v 12 late start (1). The same standoff the guns page found with the dire wolves (seed 9168) and the first-hour page found in the small first fights. A player can walk in; AUTO never does. COMBAT.

## PEOPLE (brigands): the whole grid, won in 100

### EARLY (each man's kit (his place in the line, ours.crew and ours.weapon_rows), day 1, his origin's level)

| your men | vs 3 | vs 6 | vs 12 | vs 20 | vs 38 | THE MAP'S PICK | BATTLE BROTHERS SENDS |
|---|---|---|---|---|---|---|---|
| 1 | 19 / 0 / 7 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 66 (2) / 20 (2) / 40 (2) | 2 to 2 |
| 3 | 82 / 67 / 67 | 13 / 2 / 2 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 98 (2) / 86 (2) / 86 (2) | 2 to 4 |
| 6 | 100 / 100 / 100 | 89 / 60 / 61 | 7 / 1 / 3 (past BB) | 1 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 97 (5) / 81 (5) / 83 (5) | 5 to 9 |
| 12 | 100 / 100 / 100 | 100 / 99 / 99 | 85 / 45 / 54 | 21 / 2 / 3 (past BB) | 0 / 0 / 0 (past BB) | 96 (9) / 72 (10) / 76 (10) | 10 to 17 |
| 14 | 100 / 100 / 100 | 100 / 100 / 100 | 98 / 78 / 80 | 48 / 12 / 16 | 16 / 0 / 4 (past BB) | 100 (10) / 78 (12) / 80 (12) | 12 to 20 |

Each cell: OUR START / TODAY / BATTLE BROTHERS. "(past BB)": more than Battle Brothers' map sends this company at this stage.

### MIDDLE (the town shelf (RUN TWO's market sells the 15th to 75th percentile of rows by value): mail, a better weapon of the same kind, day 30, level 5)

| your men | vs 3 | vs 6 | vs 12 | vs 20 | vs 38 | THE MAP'S PICK | BATTLE BROTHERS SENDS |
|---|---|---|---|---|---|---|---|
| 1 | 45 / 13 / 25 (past BB) | 5 / 0 / 1 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 75 (2) / 50 (2) / 63 (2) | 2 to 2 |
| 3 | 96 / 75 / 89 | 67 / 25 / 42 | 7 / 0 / 2 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 81 (5) / 47 (5) / 64 (5) | 4 to 7 |
| 6 | 100 / 100 / 100 | 99 / 85 / 94 | 65 / 15 / 34 | 13 / 0 / 1 (past BB) | 0 / 0 / 0 (past BB) | 88 (9) / 20 (11) / 47 (11) | 9 to 14 |
| 12 | 100 / 100 / 100 | 100 / 100 / 100 | 99 / 76 / 98 | 83 / 16 / 48 | 28 / 0 / 0 (past BB) | 99 (13) / 70 (13) / 95 (13) | 17 to 28 |
| 14 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 95 / 100 | 98 / 30 / 76 | 48 / 0 / 6 (past BB) | 99 (13) / 90 (13) / 99 (13) | 20 to 33 |

Each cell: OUR START / TODAY / BATTLE BROTHERS. "(past BB)": more than Battle Brothers' map sends this company at this stage.

### LATE (the city shelf (30th to 100th percentile): 210 body, 210 head (the heaviest a man can carry and still swing: see ENDGAME), the best common weapon of the kind, day 80, level 9)

| your men | vs 3 | vs 6 | vs 12 | vs 20 | vs 38 | THE MAP'S PICK | BATTLE BROTHERS SENDS |
|---|---|---|---|---|---|---|---|
| 1 | 59 / 9 / 36 | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 59 (3) / 9 (3) / 36 (3) | 2 to 3 |
| 3 | 98 / 71 / 95 | 65 / 5 / 44 | 1 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 0 / 0 / 0 (past BB) | 24 (9) / 0 (10) / 1 (10) | 6 to 10 |
| 6 | 100 / 98 / 100 | 100 / 54 / 96 | 66 / 0 / 24 | 5 / 0 / 0 | 0 / 0 / 0 (past BB) | 60 (13) / 2 (13) / 17 (13) | 12 to 20 |
| 12 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 44 / 100 | 96 / 0 / 46 | 10 / 0 / 0 | 100 (13) / 27 (13) / 99 (13) | 25 to 41 |
| 14 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 78 / 100 | 100 / 4 / 66 | 30 / 0 / 0 | 100 (13) / 57 (13) / 100 (13) | 29 to 47 |

Each cell: OUR START / TODAY / BATTLE BROTHERS. "(past BB)": more than Battle Brothers' map sends this company at this stage.

## THE BEASTS, ONE BY ONE (40 fights a cell, the dire wolves from the grid above; won in 100 at OUR START / TODAY, a dash where only the start was played)

| beast | what it loses on the bench | EARLY 6 vs 3 / 6 / 12 | EARLY 12 vs 3 / 6 / 12 | MIDDLE 6 vs 3 / 6 / 12 | MIDDLE 12 vs 3 / 6 / 12 | LATE 6 vs 3 / 6 / 12 | LATE 12 vs 3 / 6 / 12 |
|---|---|---|---|---|---|---|---|
| DIREWOLFS | nothing named | - . - . - | - . - . - | - . - . - | - . - . - | - . - . - | - . - . - |
| DIREWOLFS | nothing named | - . - . - | - . - . - | - . - . - | - . - . - | - . - . - | - . - . - |

## WHAT CANNOT BE TESTED YET, AND WHY

1. THE BEASTS ARE A BODY AND ONE BITE. Since COMBAT [the fight holds the grid] (ac9722ee) the live fight builds a beast from records/target/bb/beast_attacks.json, read off the same wiki skill pages; the bench hands each beast that same strike as a weapon row in memory (14 pages), which the fight takes first, so the numbers are the live fight's. What is NOT built (COMBAT's own list): bleeding, stagger, knockback, the schrat's and the unhold's three-tile swings, Grow Shield, the pack's own brain (they fight as a line), the beasts' fear of guns. What each one loses is in the table above.
2. BEASTS WHOSE SPECIAL IS THE FIGHT, NOT PLAYED: alp (puts men to sleep and hurts only the sleeping: the sleep is the fight); hexe (charms your men and shares her wounds: the charm is the fight); kraken (a mouth that eats a man next to it and eight tentacles that drag: two bodies and a pull); kraken tentacle (part of the kraken); kraken tentacle enraged (part of the kraken); lindwurm (a head and a tail that act apart, acid blood: two bodies); lindwurm tail (part of the lindwurm); the ijirok (a boss: a gore from six tiles, a spirit walk, regeneration); rachegeist ghost (no strike on its row); webknecht eggs (eggs: they hatch, they do not fight); geist (the scream (resolve checks in three tiles) is the fight); lower goblin ambusher (a goblin filed under beasts in the data (a person with a bow; played with the humans when the goblins come)); lower goblin skirmisher (a goblin filed under beasts in the data); lower mercenary (a man filed under beasts in the data); lower necrosavant (a vampire filed under beasts; Darkflight is a jump); lower orc warrior (an orc filed under beasts in the data); lower orc young (an orc filed under beasts in the data); goblin wolf (a goblin's mount (Wolf Bite once a turn, ridden)); armored unhold (a barbarian's war beast (played as the unhold in its armour when the barbarians come)).
3. THE GEAR IS NOT IN. The middle and late rows are mine, from the market's own rows (RUN TWO's shelves sell every weapons.json and armor.json row by value band); CHARACTER's roll-call and COMBAT's equipment have not coordinated what a man can own. The shotgun's kind (firearm) has one row in the data, the handgonne, so a shotgun never gets better. Named and famed pieces are left out. The LONE WOLF fights in the kit of the line's first place (a padded surcoat and a pipe); Battle Brothers starts him with "great equipment".
4. ONLY BRIGANDS ARE DRESSED. ours.enemy_tiers has a tier mix for brigands alone; the other factions' 100-odd rows exist in enemies.json but no party of nobles, nomads, the dead, orcs, goblins or barbarians can be dressed by day. Not in this grid.
5. AUTO PLAYS BOTH SIDES. A player who sets the line, picks targets and retreats wins more than these numbers; every number is AUTO against AUTO, the same on every setting, so the comparison between settings is fair and the absolute number is a floor.
6. PAST 13 THE GAME CANNOT MAKE THE FIGHT. The 20 and 38 columns are fights our map never sends today (its cap is 13); they are here because Battle Brothers sends them.

## ROUTED

- COMBAT: (a) the beasts' specials (the table's LOSES column is the list, worst cell first); (b) party_math's cap of 13 against Battle Brothers' plethora (the twelve at level 9 on a three-skull job make 41); (c) a tier mix for a second faction.
- CHARACTER + COMBAT: the gear roll-call; until it lands every number here is DRAFT.
- COMBAT + PEOPLE: the weight (above): a level raises no fatigue in the fight, so the 300 armour leaves a man one swing.
- RUN + RUN TWO: the lone wolf's starting kit (Battle Brothers' "great equipment").
- TUNING (next): [slightly harder, measured] is set across this grid, never on one average.

Bank: banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json (draft:true; every cell's felt numbers, the strikes with their pages). Tools: tools/bohemia_tuning_the_whole_grid.js (the bench), tools/bohemia_tuning_the_whole_grid_page.js (this page).

[bb Battle Brothers sizes a fight by the strength of your twelve best, the job's skulls and the days, and lets it grow past forty; ours stops at thirteen.]
[analog horror: the 38-man rows are the screen most full of bodies the game can make; named for SOUNDS and COMBAT, not moved.]
