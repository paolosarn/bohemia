# TUNING, THE BIG SWING (10/17/26) -- THE ONE NUMBERS TABLE, SEEDED WITH EVERY FELT NUMBER THE FIGHT FILE READS, EACH WITH ITS SOURCE
# Row: VAMILY TUNING MODE line, BIG SWING 10/16 (rule 110, Paolo: '24 hours, take big swings, I can't check in every three minutes').
# Also closes the two OPEN rows the swing covers: [the ring] (rule 103, the zone of control in the one table beside Battle Brothers' own)
# and [the injury table] (the death roll, the days, the pain line per stat, the clinic's halving, each with its Battle Brothers source).
# RESEARCH ONLY (rule 38g); a page, no VOTE sheet (rule 88, rule 110c). Nothing in the game reads anything written this round.
# Instrument: tools/bohemia_tuning_one_table_seed.js (--write regenerates both files below from the live fight and the live data).
# The table: records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md (160 rows, four sections) and the same rows as data,
# banks/BOHEMIA_TUNING_THE_ONE_TABLE_SEED_10_17_26.json (draft:true).
# [bb Battle Brothers keeps its numbers in plain script tables a modder can read; ours is one table with a FEEL line per number. The twist: every
# row says what the player feels and who may change it, which Battle Brothers' tables never say.]

## 1. WHAT THE ONE TABLE IS NOW (the answer first)
Rule 21 asked for ONE table of every number a player feels, with its reason and its source. The seed is 160 rows read off the real files, not from memory:
- 88 RULE rows: every key the fight-rules script reads through R(). All 88 resolve to a row with a value AND a source AND a verbatim quote (0 missing, 0 unquoted). 72 are the wiki's (page named), 11 are his rulings (law or VAMILY rule named), 5 are records (his words, or COMBAT TWO's board file).
- 54 COLUMN rows: the fields the fight reads off every data row (a weapon's damage_min and damage_max, an enemy's hp and resolve, a perk's numbers, an injury's threshold) held once each with the file and its row count, plus the eleven permanent marks, one row each, with the pain line's effect on every stat.
- 7 TYPED rows: felt numbers typed into a script instead of read from the table. The escapes, each with an owner (section 4).
- 11 RULED rows: numbers that have a ruling or a wiki source in the data but that NOTHING in the fight reads, kept so nobody re-invents them, each with its gap named (section 3 and 5).
Every row carries: id, value, unit, FEEL (what the player feels, in plain words; written for all 160, none missing), source, whether a quote sits beside it, where the fight reads it (function and line), how many reads, owner, what Battle Brothers' own difficulty does to it, status.
COMBAT's own rule still holds: the fight-rules script types no number but 0, 1 and 100 (0 stray literals in 80,572 characters, 1,246 lines). That is why the seed could be read off the file at all.

## 2. THE RING (closes [the ring], rule 103, Paolo 10/10 LOCKED)
His words: 'if any person does not have a melee weapon currently equipped, they don't get a zone of control; zone of control is only for melee, one tile next to them; anyone using a ranged weapon has no zone of control and you can just walk left, up, right, down, across their tiles.'
| the table row | value | source | read by the fight |
|---|---|---|---|
| zone_of_control.radius_hexes | 1 tile (the eight around him on our square grid) | bb_all/0424_Combat Mechanics.txt | zocOn(), line 604 |
| ours.gun_classes | dagger, firearm, crossbow count as a gun in the hands | records/BOHEMIA_PAOLO_ZONE_OF_CONTROL_IS_MELEE_ONLY_10_10_26.md (rule 103) | isGun(), line 602: a gun holds no ring |
| zone_of_control.height_gap_breaks_zoc_levels | 2 levels | bb_all/0424_Combat Mechanics.txt | zocOn(), line 603 |
| zone_of_control.free_attacks_on_leave | a free swing at 0 fatigue to each man holding the ring | bb_all/0424_Combat Mechanics.txt | LIVE as code in moveTo() (each holder swings once as you step out), the row itself unread |
| zone_of_control.leave_resolution | all miss = you leave; any hit = you stay and try again | bb_all/0424_Combat Mechanics.txt | LIVE as code (held = true on a hit), the row unread |
BATTLE BROTHERS' OWN RULE, BESIDE IT, AS THE THING WE CHANGED: there, everyone who fights with a melee weapon, bare fists or as a beast holds a ring (zone_of_control.who_exerts), and a ranged user, a fleeing, stunned, entangled, horrified or sleeping man holds none (zone_of_control.no_zoc). Ours is narrower in one way that matters: the pistol is a DAGGER underneath (ours.weapon_rows), and by the wiki's rule a dagger holds a ring; by his, a gun in the hands holds none whatever row sits under it. So a line of pistols is a line you walk through. That is the twist, said (rule 39b).
A note for COMBAT, not a change: the fight checks Fleeing, stunned, ranged and gun before granting a ring; entangled, horrified and sleeping do not exist in our fight yet, so the wiki's longer list has nothing to bite on.

## 3. THE INJURY TABLE (closes [the injury table]; THE FIGHT GETS DEEP, Paolo 9/27; the third votes 9/27)
| the table row | value | source | read by |
|---|---|---|---|
| ours.struck_down_death_chance | 0.20 | laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md ('20% they die') | the fight, fall() line 859 |
| ours.main_character_dies | false | laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md | the fight, fall() line 858 (he goes down, never dead) |
| ours.veteran_death_chance | 0.10 | laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md (a veteran of ~20 fights) | engine/bohemia_long_injury.js (PEOPLE) ONLY; THE FIGHT NEVER READS IT |
| ours.struck_down_laid_up_days | 30 to 40 game days, rolled flat | the same law ('30 to 40 game days') | the fight, fall() line 863 |
| ours.struck_down_injury | drawn from the wiki's 11 permanent marks, each as likely, the part hit not mattering | bb_all/1540_Permanent Injuries.txt and the ruling | the fight, fall() line 864 |
| injuries.permanent.<mark> x 11 | the pain line per stat (brain damage: resolve +15, xp -25%, initiative -25%; broken knee: melee and ranged defence -40%, initiative -40%; missing eye: ranged skill -50%, vision -2; weakened heart: hp -30%; ... all eleven in the table) | records/target/bb/injuries.json, each row its own wiki card | the fight draws one; the roster shows the line |
| injuries_and_death.temp_injury_min_damage | a hit under 10 never injures | bb_all/1936_Temporary Injuries.txt | injure() line 841 |
| injuries.threshold_pct_of_max_hp (column, 48 temporary rows) | 25 to 60 percent of max hp | the injury's own card | injure() line 848 |
| injuries_and_death.temp_injury_multipliers | Crippling Strikes 0.66, Iron Jaw 1.25, a head hit's bonus | bb_all/1936_Temporary Injuries.txt | injure() line 843 |
| clinic.halves_days | 0.5 | injuries.json rules.temporary_healing.treatment_heal_time_multiplier (bb_all/1936) | NOTHING reads the row; the roster's line says 'halves' as a word |
| clinic.base_price, clinic.per_level_price_factor | 20 crowns a day, +20% a level | injuries.json rules.temporary_healing (the wiki's temple formula) | TYPED in slices/BOHEMIA_ROSTER_SCREEN.html clinicPrice(): 20 * days * (1 + (level-1) * 0.2) / 10 |
BATTLE BROTHERS' OWN DEATH ROLL BESIDE OURS: at 0 hp a man there lives 33 in 100 (90 with the Survivor trait), and cannot live at all if the hit was a fatality, he was retreating, or the damage was his own (bleeding, poison). Ours lives 80 in 100 and has no fatality, retreat or bleed death yet, so the impossible-list has nothing to bite on. The wiki kills 67 of 100 struck-down men; his rule kills 20. His fifth vote (rule 56) wants the roll to move with marks carried, base 0.20 + 0.05 per mark; that row is proposed in the respec page and is not in the data yet.

## 4. THE SEVEN TYPED ESCAPES (felt numbers outside the table, with owners)
| id | value | where it is typed | owner |
|---|---|---|---|
| input.hold_ms | 450 ms | slices/BOHEMIA_FIGHT.html fight-draw, HOLD_MS | COMBAT (input) |
| look.man_of_tile | 0.86 of a tile | fight-draw, MAN_OF_TILE | COMBAT (presentation; the ground-may-zoom law) |
| look.man_idle_px | 104 px | fight-draw, MAN_IDLE | COMBAT (rule 21's one pixel size says 112 box, ~100 painted) |
| clinic.base_price | 20 crowns a day | slices/BOHEMIA_ROSTER_SCREEN.html clinicPrice() | ECONOMY / RUN TWO |
| clinic.per_level_price_factor | 0.2 a level | the same function | ECONOMY / RUN TWO |
| clinic.halves_days | 0.5 | the roster's line (a word, not a number read) | ECONOMY / RUN TWO |
| money.crowns_per_battery | 10 | the same function's '/ 10' (and the settlement screen) | ECONOMY |
Three have no source but the code (the input hold and the two look numbers); four have their wiki number sitting unread in injuries.json or the schema page. The fight's own script is clean; the escapes are the screens around it.

## 5. THE FINDING THAT PROVES US WRONG
THE VETERAN'S TEN PERCENT IS A NUMBER THE DEMO'S FIGHT DOES NOT KNOW. The third votes (9/27) ruled a veteran of about twenty fights dies at 10 instead of 20. The row exists (ours.veteran_death_chance 0.1, its law named) and PEOPLE's long-injury module reads it, but the fight-rules script reads ours.struck_down_death_chance alone and rolls every man, green or veteran, at 20. So the one felt number that rewards keeping a man alive across twenty fights (his 'rewarding your own knowledge and skill') is in the table and not in the fight. A table row nobody reads is a ruling nobody feels; the audit of 10/10 counted it as 'in the table' and was right and not enough.
Second, smaller: ours.beat_bpm (120) is read outside the fight-rules script only (the drawing), so the fight's turns are not on the beat by any number the rules read; the beat is a look number there.

## 6. WHAT STANDS FROM THE OLDER PAGES, AND WHAT THIS SUPERSEDES
- Supersedes the 9/28 draft (records/BOHEMIA_TUNING_NUMBERS_TABLE_DRAFT_9_28_26.json, 33 rows of the old fight's constants) as the seed. The SHAPE page (9/28) stands: id, unit, feel, reason, source, owner, status; this seed adds read_at, reads and bb_difficulty_moves, and drops range and slider (his 10/9 DOWN on 'how big is too big' retired written limits; Battle Brothers' own difficulty moves two rows, named in the column instead).
- Stands with the 10/10 audit (records/BOHEMIA_TUNING_THE_FELT_NUMBERS_TABLE_IS_REAL_AND_MY_FIGHT_FINDINGS_ARE_STALE_10_10_26.md): 85 keys then, 88 now (ours.gun_classes and ours.gun_min_range for the ring and rule 83, and ours.struck_down_injury for the long injury's list, landed since; measured against that audit's own JSON).

## ROUTED (research only; nothing built by this lane)
- COMBAT: the fight's fall() reads the death roll and never the veteran row (section 5); the three typed look and input numbers (section 4) if they are to be rows; the free swing and the leave rule are live as code and could read their rows.
- ECONOMY / RUN TWO: the clinic's three numbers are typed in the roster with their wiki rows unread (section 4); SELL_CUT and contract pay stay on the 10/10 audit's list.
- PEOPLE: the eleven marks' pain lines are in the table one row each; the veteran row is read by your module only.
- PLUMBER [numbers gate]: the seed's RULE section is the ratchet (88 keys resolve, 0 stray literals); the TYPED section is the list the gate would shrink.
- MODS: the four kinds of row (rule, column, typed, ruled) are the table's schema for the day it ships; the ids are the R() keys as they are, never renamed (your id-is-a-promise rule).
- Test material: the bank is draft:true; nothing in the game reads it.
