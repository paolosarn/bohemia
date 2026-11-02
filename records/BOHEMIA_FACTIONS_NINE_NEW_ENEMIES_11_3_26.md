# FACTIONS 11/3: NINE NEW ACT-ONE ENEMIES IN FOUR NEW FACTIONS

Paolo 11/2 (VAMILY rule 302; ask rows 255, 286): "more content... new enemies, new graphics, the whole package".
Law: laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md (12+ factions, ~75 types, every
Battle Brothers archetype keeps its lesson in a Bohemia skin, act one feels medieval). ROBOT's robots untouched.

## MEASURED FIRST (before)
- The fight's tables (records/target/bb/ours.json enemy_tiers + heads): 21 enemy types in 6 fight factions
  (brigands, beasts, ghosts, machines, kids, heavies). The map card's factions.json names 12 factions, but only
  those 6 could ever stand on a board.
- A player's first five fights (first five days, act one, 200 simulated players, districts and nights spread):
  3.2 distinct types each on average; 7 types and 4 factions across all 200 players.
- Every map party is handed as 'brigands'; from the second fight the fight rolled a faction by act only.

## WHAT SHIPPED
ONE FILE A MODDER EDITS: records/target/bb/bohemia_enemies.json (rows, brains, numbers, make-ups, road). The fight
folds it in when it deals (slices/BOHEMIA_FIGHT.html ownEnemies); each row rides on its wiki unit row.

| board | id | faction | Battle Brothers lesson | its move in the fight |
|---|---|---|---|---|
| SHIELD | house_shield (footman) | The House | the shield wall | carries a shield always; walks in, locks it (4 AP, 20 fat, shield doubled, +5 per walled man beside him); a turn he swings he holds no wall |
| HOOK | house_hook (billman) | The House | the polearm behind the wall | pulls a man at his weapon's reach into the tile beside him (6 AP, +10 to hit) |
| CROSSBOW | house_crossbow (arbalester) | The House | the archer line | every crossbow shoots the man the line's first bolt went at |
| NEIGHBOR | watch_neighbor (armed peasant) | The Block Watch | the coward who runs | under half his hitpoints he flees, once |
| CAPTAIN | watch_captain (militia captain) | The Block Watch | the leader who rallies | rallies the moment a man wavers, once a turn; heads every watch band |
| FERAL | keeper_feral (orc berserker, as a man) | The Keepers | the berserker | never wavers; Berserk (4 AP back on a kill); rushes the weakest; heads every keeper band |
| KEEPER | keeper_thrall (barbarian thrall) | The Keepers | the skirmisher who throws first | throws an axe, then the cleaver |
| CUTTER | water_cutter (nomad cutthroat) | The Water People | the ambusher | unseen until a man of yours is within 2 tiles or he strikes |
| NEEDLE | water_needle (goblin ambusher, as a woman or man) | The Water People | the one who poisons | a hit that draws blood: -1 AP, -10 initiative, -1 vision, 3 turns (Goblin Poison's page) |

Act-one changes to wiki rows each carry a 'why' in the file (the shield man as a recruit with a car door; the
feral as a man, 110 hp; armour from the low end of the wiki ranges).

WHERE AND WHEN (the road): the four factions join every act's road weights; the faction that holds the ground in
factions.json is met 4x as often on its own ground (the gate checks the grounds never drift from factions.json);
at night the block watch goes home (x0.25), the water people (x2) and keepers (x1.5) come out. The map's roll
(slices/bohemia_job_danger.js) now hands the district and the hour, so the MEET card (ENGAGE or FALL BACK: visible,
avoidable) names them: HOUSE MEN, BLOCK WATCH, KEEPERS, WATER PEOPLE (draft).

LOOKS: built on the 3D rig from people already rendered (no Blender in this container): the House in the
remnants', blues' and trades' clothes, the Watch in the volunteers' and colorful's, the Keepers in the homeless'
and anarchists', the Water People in the caravans' and the runners' hoods and wraps. NEW GARMENTS OWED TO
CHARACTER (a car-door shield, a hook pole, a crossbow, a dart bandolier).

## AFTER
- 30 types in the fight tables (+9), 10 fight factions (+4); the roster file (records/target/bb/roster.json, its tool now reads the new file) 131 -> 140 types.
- A player's first five fights: 5.2 distinct types on average (was 3.2); across 200 players 16 types and 8
  factions met (was 7 and 4).
- Sized to the crew (AUTO, new crew of 3 / 6 / 12): House 16/18/14 of 20, Water 18/17/18 of 20; Watch and Keepers
  win more (they are fodder and a single feral).

## PROOF
- gates/the_new_enemies_gate.js: 12 passed, 0 failed (file, fold, wall, hook, crossbows, neighbor runs, captain,
  feral, cutter, needle, sized to the crew, where and when).
- A fight against each faction on the fight page every demo map door opens (slices/BOHEMIA_FIGHT.html), driven by
  tools/bohemia_drive_the_demo.js at phone_portrait (tools/bohemia_factions_the_new_enemies_shots.js): 0 page
  errors in 4 fights; shots in records/target/factions_new_enemies/ (the_new_enemies_on_the_phone.jpg; top row at
  the deal, bottom row mid-fight); moves seen live: shieldwall 3, rally 2, flees 2, poisoned 3, adrenaline 5.
- the_bestiary_gate, every_floor_tile_is_a_translation_gate, attempt_gate green. the_fight_reads_only_sourced_numbers
  is red on main with 11 typed hash constants; this round adds none (11 before, 11 after). pages_publish_gate is red
  on the working tree's size (1624 MB measured, not this round's 2 MB).
- the_job_tells_the_truth_gate (the map's roll, in the real demo): 100 jobs read and rolled through the new road on
  day 1 and day 3, then the browser closed under it after ~5 minutes (a page-closed error, not a failed check); not
  re-run to the end this round.
- Not done by this lane: the map's party COUNT ("way more groups") is WORLD's spawner; this round gives each
  party its faction by ground and hour, not more parties.
