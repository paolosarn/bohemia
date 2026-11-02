# COMBAT 4: HEIGHT IS ACCURACY, NEVER A WALL; AUTO PLAYS SMART (11/2, BUILD 11/3zg)

Paolo 11/2, his playtest (rules 321 and 322; ask lines 318 and 319):
- "after a second story, you can't melee... each story, from one to two to three, depending how high it is, doesn't mean the character next to you can't melee, it's just accuracy, that's the math that's manipulated... a wolf somehow ended up on top of a roof and my main guy couldn't hit him... that's so stupid... it's not that you can never hit him, it's just more inaccurate"
- "with auto combat you want the characters to get into places where they have the ability to hit the enemy... my sniper, my rifle character, ends his turn without trying to get to the best point of view, a place with line of sight where he can shoot... you need to run big brain research and do that... super important... when you press auto it's gonna be green or it's gonna be red"

## THE RESEARCH (brief, and what we took)

**Battle Brothers' height** (the library, records/target/bb/rules.json from bb_all/0424_Combat Mechanics.txt and bb_all/1002_Hit Chance.txt; battlebrothers.fandom.com 'Combat Mechanics', 'Hit Chance'): four height levels (0 to 3); the man higher gets +10% to hit, once, however high; the man lower gets -10% per level of difference; a gun gets one more tile of range per level up; and "if there are two or more levels of height difference... you do not count as being in melee attack range or being in each other's Zone of Control." That last line is the wall he hit. HIS RULING OVERRIDES IT; the library rows stay as Battle Brothers wrote them, ours.json says what we do.

**Battle Brothers' AI picks a tile by scoring tiles, one behaviour at a time.** Its ranged behaviour is `ai_engage_ranged`, whose `selectBestTargetTile(_entity, _maxRange, _considerLineOfFire, _visibleTileNeeded)` walks the tiles it can reach and keeps a `PotentialDanger` list of the melee men that threaten a tile (the hook a modder wrote on it shows the names: [gist.github.com/Suor/82489e82556a81d51445bcd4717b3950](https://gist.github.com/Suor/82489e82556a81d51445bcd4717b3950)). The wiki: "the AI will try to occupy the high ground whenever possible, especially their ranged units" (bb_all/0424, already in ai.json). Melee closes, takes the surround bonus (+5% per extra man on the target, rules.json), and never walks out of a zone of control for nothing (the free attacks).

**XCOM 2's AI grades tiles with movement profiles**: cover, distance to the enemy, a flank shot, an ally's line of sight ([steamcommunity.com/workshop/filedetails/discussion/793861140/282992646973104300](https://steamcommunity.com/workshop/filedetails/discussion/793861140/282992646973104300), the 'A Better ADVENT' modder); cover is +20 or +40 defence ([xcom.fandom.com/wiki/Cover_(XCOM_2)](https://xcom.fandom.com/wiki/Cover_(XCOM_2))); its AI already ranks flanking shots first ([forums.nexusmods.com/topic/1032202](https://forums.nexusmods.com/topic/1032202-reworking-cover-limitations-and-possibilities)). No source gives the exact weights; ours are drafts with their reasons.

**What we took**: a tile is graded BY KIND FIRST (a shot this turn beats a shot next turn; out of a club's reach beats inside it), then by worth: the best shot from it (chance, with the storeys in it, times the gun's range band), minus the clubs that could stand beside it next turn (Battle Brothers' PotentialDanger), plus the storeys (their shots lose 10 a storey), plus cover (XCOM), minus the walk.

## MEASURED BEFORE

The probe (tools/bohemia_combat_auto_plays_smart_probe_11_2_26.js) plays the live fight headless on AUTO for both sides: 30 fights each of wolves (direwolves and hyenas, 1.5 a man), raiders (brigands), the mechanic's robots, and the three act-one bosses with their crews (THE POT, THE TAP, THE FILTER), companies of 3 and 6, early and middle kit. Every turn of every man of his is logged: could he strike from where he stood; could he walk somewhere this turn and still strike; could he walk somewhere that gives a hit next turn; what he did.

What it was:
1. **The wolf on the roof**: the walk let anything onto a roof for the climb's extra AP. Wolves stood on a roof in 8 of 30 wolf fights (83 climbs, 709 steps up there), never dealt there, always walked up. With the wall, a wolf two storeys up could not be clubbed.
2. **The wall**: 16 turns a club of his stood beside an enemy he could not swing at because of the storeys.
3. **The sniper who doesn't look for a shot**: 89 turns a shooter of his ended with no shot while a tile he could walk to that turn gave one; 59 more turns he stood idle while a step would have given him a shot next turn. Two rules held him: the line (`shield_the_backline`: a shooter never steps ahead of his front man) and `hold_line` (before the lines meet, nobody of the crew walks anywhere that does not shoot now). In round one, with the enemy seven tiles off and his crossbow reaching six, one step to the side gave a shot and he stood.
4. **The roof cheese**: 11 of the 86 wins before were the other side giving up on a man they could never reach on a roof (the standoff rule: 5 rounds landing nothing, they leave). Wolves: 5 of the 7 wins.

## WHAT SHIPPED

**1. HEIGHT IS ACCURACY, NEVER A WALL (rule 321).** `ours.height_is_accuracy` (draft, TUNING's): a man on the next tile can always be struck in melee whatever the storeys between, and he always holds his zone of control over it. Each storey moves the chance, both ways, for every blow and every shot: +10 a storey for the man above (Battle Brothers' +10 given a storey, not once), -10 a storey for the man below (the library's own). COMBAT 3's preview shows the moved chance (it is the hit's own sum). The brain's worth of a height moves a storey at a time too. The words: a tap on a roof says "Roof, 2 storeys up: +10% to hit for each storey down, guns reach 2 tiles farther, sees 2 tiles farther, a club beside him still swings, at -10% a storey."; the aim says "From 2 up: +20%" / "He is 2 up: -20%".

**2. NO WOLF ON A ROOF (rule 321).** `ours.climbers`: a man wearing a beast's sheet (the dire wolf's, ours.beast_looks) or of a kind in `never_climb` (the wolves, hyenas, dogs, unholds, the lindwurm, the serpent) never steps onto a roof tile: not in the walk, the far walk, the step aside, the shove, nor the deal; his hunt never routes over one. A rise of bare ground (level 1, not a roof) he still walks. Men and the man-shaped robots climb as before (the library's +1 AP a level).

**3. AUTO FINDS A SHOT (rule 322).** `ours.auto_finds_a_shot` and the crew's switch `finds_a_shot` (ai.json; his gambits are the crew's switches, there is no gambit list per man in the fight): his shooter with no shot from where he stands grades every tile he can walk to:
- first, any tile he can shoot from THIS turn (the AP, the breath and the rounds left after the walk, range and line of sight the rules' own, a man his side sees): out of a club's reach first; beside one only when nothing else gives the shot (a shotgun takes the one man's ring it is shooting into: its blow is best there);
- else, a tile out of their reach from which he will have the shot NEXT turn, unless the tile he stands on already gives one (then he holds: no dance);
- among the same kind: the best shot, the danger, the storeys, the cover, the walk.
The line's vetoes no longer hold a shooter back from the one step that gives a shot. Never back to where an idle turn began. Once he has shot this turn he walks only to shoot again (Battle Brothers' shooters do not creep). The roof climb no longer spends a shooter's turn going up for next turn when a step gives a shot now, and it takes the roof tile fewest of their clubs can stand beside (a wolf cannot climb: the middle of a roof is out of its reach). Clubs: the tile he strikes from adds the share of the man one blow takes (`club_target_weight`), so he walks to the man he can drop.
**The dial shot**: the fight has no dial button today; AUTO uses only the plain strike (rule 180), so nothing of the dial is touched.
**Speed** (the AUTO colour is a forecast that plays this brain many times): 40 fights, his side's brain 6.5 s, before 6.7 s (tiles a gun cannot reach a man from are skipped; a shot this turn is looked for before any shot next turn; one answer a step).

**THE GATE**: gates/auto_plays_smart_gate.js, 7 legs (the ruling is data; across three storeys the club strikes and rings and only the chance moves, -30 and +30; no roof tile in a wolf's walk; no beast on a roof in the probe's wolf fights; no shooter ends with no shot when a tile gave one; nobody idle when a move gave a hit next turn; nothing threw, every kind under 4 minutes). On the old fight it fails 5 of 7.
Amended to his ruling: the_pc_playtest_the_fight_gate.js item 14 (+10 a storey; the club reaches across three storeys, 20 points less often than across one; the words); every_man_has_a_job_each_turn_gate.js J4's floor (158 of 300 on rule 321's board with the brain before this round: before rule 321 it read 179, 32 of them the other side giving up on an unreachable roof; now 161, 11); auto_kills_one_at_a_time_gate.js F7 pairs against the brain before COMBAT 4 on rule 321's rules (banks/BOHEMIA_COMBAT_FOUR_BEFORE_ON_RULE_321_11_2_26.json: 78 won, 55 clean; now 77 and 55, lost 2 gained 1), the old bank's 84 printed beside it (under the library's wall this brain wins 81, clean 56 against 53).

## MEASURED AFTER (the same probe, the same 120 fights)

| 30 fights each | wolves | raiders | robots | bosses |
|---|---|---|---|---|
| a shooter ended with no shot while a tile he could walk to gave one | **0** (was 1) | **0** (25) | **0** (34) | **0** (29) |
| idle while a step gave a hit next turn (his tile gave none) | **0** (1) | **0** (29) | **0** (46) | **0** (34) |
| shooters who walked to a shot and took it | 2 (2) | **75** (50) | **77** (46) | **60** (43) |
| idle turns, not resting | 15 (17) | **7** (36) | **8** (57) | **19** (50) |
| a club walled off by storeys | **0** (5) | **0** (8) | **0** (2) | **0** (1) |
| melee blows across 2+ storeys (theirs up at his: landed) | 197 (192: 70) | 50 (39: 15) | 34 (20: 3) | 44 (28: 9) |
| a beast on a roof: fights / climbs | **0 / 0** (8 / 83) | 0 | 0 | 0 |
| won | 1 (7) | 29 (29) | 28 (27) | 22 (23) |
| won by the other side giving up on an unreachable roof | **0** (5) | 0 (1) | 0 (2) | 0 (3) |
| won in a fight | 1 (2) | **29** (28) | **28** (25) | **22** (20) |
| rounds a fight / minutes on AUTO | 7.8 / 0.9 (8.4 / 0.9) | 7.4 / 0.8 (7.7 / 0.9) | 5.3 / 0.8 (6.2 / 0.9) | 8.3 / 0.8 (9.1 / 0.8) |

Fights won by fighting went up against everything but the wolves; fights got shorter; nothing is past 4 minutes (the bench's sum, AUTO). The wolves: a pack 1.5 times his size was nearly unwinnable before too (2 of 30 fought wins); what is gone is the 5 wins where the wolves gave up on a man they could not reach. With his ruling, a wolf on the street can bite a man on a roof beside it (at -10 a storey): 192 such bites, 70 landed. Under the old wall, this round's AUTO wins 9 of 30 wolf fights, 7 of them by the wolves giving up on an unreachable roof (2 fought): the whole difference is the ruling taking the roof trick away.

## WHAT IS LEFT
- EYES to see both on a real phone (ask lines 318, 319: NOT YET SEEN). The words on a roof tap and in the aim are drafts (WORDS).
- TUNING: the storey's points (`above_per_storey` 10, `below_per_storey` -10) and the wolves. A bite reaching up two or three storeys lands at Battle Brothers' -10 a level; if the wolves are too hard now, the numbers to move are those, the pack size, or a steeper climb for a blow than for a shot. Every weight in `auto_finds_a_shot` is a draft.
- Red on main before this round, not touched here: the_pistol_is_never_a_club_gate.js (two phone legs), the_hit_chance_look_gate.js (H4-H9, the speed button covered), the_formation_is_kept_gate.js (the crew-walks-as-a-line leg, and its drag legs under load), the_rebuilt_fight_plays_gate.js (frame rate and the lit tile under load).
- Not judged this round: the_job_tells_the_truth_gate.js (a browser gate) ran past 25 minutes under the round's load and was stopped; the_rebuilt_fight_plays_gate.js was not run to its end. Green with this round's code: auto_plays_smart (7/7), auto_never_wastes_a_turn (9/9), auto_kills_one_at_a_time (7/7), every_man_has_a_job_each_turn (5/5), every_weapon_has_its_range_bands (7/7), the_pc_playtest_the_fight (27/27), the_fight_holds_the_whole_grid (17/17), see_every_hit (10/10), and with the code before the last speed-up the bestiary, the new enemies, guns from the first fight, the shield, fatigue, walk through your own men, a far tile, every floor tile.
- A shove can still push a MAN up onto a roof (a beast never); a ladder-only climb ('the way the board allows') is a bigger change: today a man climbs a roof from any tile beside it for the library's +1 AP a level.
- The fight has no gambit list per man; if one comes, `finds_a_shot` is the switch it sets.

[bb] Battle Brothers' ranged AI picks a tile by range, line of fire, a visible tile and the melee men that threaten it (ai_engage_ranged, PotentialDanger); its height: +10 above once, -10 a level below, a gun +1 tile a level, melee and the zone of control stop at two levels. Ours keeps all of it but the wall and gives the +10 a storey.

[analog horror] Nothing new is drawn: a height's points are said on the same torn receipt paper the aim and the hurt tags print on; the roof's storeys stay the ladder's chevrons. A wolf that cannot climb pacing the foot of the wall under a man on a roof is the picture this rule makes: the thing below that waits.
