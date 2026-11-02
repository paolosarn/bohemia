# COMBAT (the fight) -- the handoff block (written only by COMBAT, newest first; older blocks: handoffs/COMBAT_ARCHIVE.md)

COMBAT 2 11/2 (brief from the coordinator: ask line 251, a one-storey house south of a man covers his legs). SHIPPED (BUILD 11/3zo),
NOT YET SEEN:
1. A HOUSE COVERS HIS LEGS: the suburb ranches re-rendered through the same rig at a 2008 tract house's real height (2.97 m to
   the plate) and running back to their lot's back line, fronts unchanged (a man on a roof still stands on it), ridge along the
   front, one storey; their tops off a one-sample house-only mask into records/target/cook_floor_rig/blocks.json and
   slices/fight_ground/fight_stands.json, listed only on pictures drawn with those houses (sha1 pinned, 'new_pictures').
   A man behind one: 0% -> 16 to 17% (feet and shins), the same at both stagger spots. records/target/cook_floor_rig/house_lot.json.
   Shipped 22 of 33 pictures: present + reclaimed of subs 0-3, corner 0-2, suburb_stem 0-1; raided of subs 0-3.
   records/BOHEMIA_COMBAT_A_HOUSE_COVERS_HIS_LEGS_11_2_26.md; phone picture records/target/combat_layers_11_2/phone_houses_before_after.webp
NEXT: the 11 left were still rendering at the ship (culdesac 0-1 all three times, with the top-row fix; raided corner 0-2 and
suburb_stem 0-1): swap them in, run tools/bohemia_combat_the_fight_layers_11_2_26.py, ship (or re-render if the container is gone).
The ask said 20-35% for one storey; honest is 16-17% (the man is ~15 m at a house's scale; a back wing under a cross gable was
tried and read as a second storey). The town's one-storey motel covers 23% only because its picture stands ~3 m into the tile
north of it (COOK's town measures). The suburb junk moved (the rig's floor plans are regenerated each run). Rendering needs bpy 4.2
in a python3.11 venv, the base commit c12f1612 fetched (the clone is shallow) and its kit_street in records/target/cook_floor_not_final/orig/.
[bb] a low hut hides a brother's legs, a tall house the brother: the height is the picture's.
[analog horror] the subdivision the money stopped building, at its real size; behind one the man loses his boots to a roof's edge.

COMBAT 5 11/2, SHIP 2 (brief from the coordinator: rule 305, ask line 297). SHIPPED (BUILD 11/3zn, THE CELL VEST), NOT YET SEEN:
THE CELL VEST (never 'suicide bomber'; the man is A SPARK, drafts): gear.acc cell_vest_scrap/yard/late (4/8/12 cells) in the
accessory slot; never on the main man. His SPARK square (4 AP): first tap lights the risk (9 tiles crimson, hurt over every man
touching him, his % to die, the line), second tap squeezes on the song's beat (all cells; off the beat half) until the dial lands;
AUTO never squeezes. The dead man's switch: struck down with a live vest, all cells, any turn, on AUTO too. 8 a cell on the 8 tiles
round him, friend and foe, half through armour; x1.5 by a wall, x1.5 on a machine; his tile + ring burn 2 rounds (On Fire's 15-30
at a turn's end) and smoke 2 rounds (a shot through it -20). Always knocks him down; death roll +25% (fire gear -15%): 45% measured
45.4% in 119. Perk nothing_left: max health 1, the armour takes the whole blow while it stands. The fear: a side that saw one keeps
off tiles beside a live vest (60), shoots him first, clubs him at half worth. Placeholder vest on the chest, fire, smoke, the white
frame on the beat. Every number ours.cell_vest. Gate gates/the_cell_vest_gate.js (10/10); phone look
tools/bohemia_combat_the_cell_vest_phone_11_2_26.js (4/4). records/BOHEMIA_COMBAT_THE_CELL_VEST_11_2_26.md.
NEXT (other lanes): the yard hire and the vest drawn on the body (CHARACTER, DIRECTION); the price (ECONOMY); the roster handing
gear.acc and offering NOTHING LEFT first at 20+ max health lost (CHARACTER/RUN); the words (WORDS); the sound 'cell_vest' (SOUNDS);
every number (TUNING). The squeeze moves onto the dial when the dial lands. NOT IN A TAB YET until a hire wears one.
[bb] fire pot, smoke pot, the accessory slot, Nine Lives are the bones; a man who goes off when he falls is ours.
[analog horror] the frame whites out on the beat in three hard steps; crimson root flame, never purple; smoke that steps a key at a time.

COMBAT 5 11/2, SHIP 1 (brief from the coordinator: rule 328, ask line 326). SHIPPED (BUILD 11/3zm, CLIMB OR ATTACK), NOT YET SEEN:
CLIMB OR ATTACK: a step from lower ground up onto a roof marks the man for the round (u.upRound; WAIT keeps it); marked, he makes no
attack the rest of his turn: canStrike, canSweep, canNet, canShove, hookTarget/hook refuse, canUse refuses ours.climb_or_attack
attack_skills (empty today); strikeWhy 'climbed'. Every side, every beast that can climb; free swings/shots on another's turn stand.
He sees: the walk's tag and line warn before the climb (CLIMBING ENDS HIS ATTACKS THIS TURN), the strike square says CLIMBED, a tap
on a man says why. AUTO (rule 322 changed): reach() carries up[k] (the way climbs); no brain counts a climbing tile as a strike-now
tile; climb() only when no shot now anywhere and the roof gives one next turn; a shooter who climbed holds the roof.
Climb-and-attack turns 36 -> 0 in 40 AUTO fights; shooter climbed past a shot 44 -> 0; minutes on AUTO unchanged (0.6 to 1.0).
Gate gates/climb_or_attack_gate.js (6/6; --before fails 4). Phone look tools/bohemia_combat_climb_or_attack_phone_11_2_26.js (3/3).
Amended: the auto_plays_smart probe (a climbing tile gives no shot now), auto_never_wastes_a_turn G5 (roof counted only on turns
with no shot open, tools/bohemia_tuning_auto_brain.js roofAny). records/BOHEMIA_COMBAT_CLIMB_OR_ATTACK_11_2_26.md.
NEXT: SHIP 2 THE CELL VEST (rule 305). EYES on a phone. The dial's shot and ARMORY 2's lash ride canStrike/canSweep.
[bb] Battle Brothers: a climb costs +1 AP a level and nothing else; ours, his: the roof is a turn's investment.
[analog horror] CLIMBED greys the strike square like a dead switch; a man on a roof with empty hands for a turn, the thing below looking up.

COMBAT 4 11/2 (brief from the coordinator: rules 321, 322, ask lines 318, 319). SHIPPED (BUILD 11/3zg), NOT YET SEEN:
1. HEIGHT IS ACCURACY, NEVER A WALL: a man on the next tile can always be struck in melee and always holds his zone of control,
   whatever the storeys; each storey is +10 to hit for the man above, -10 for the man below, blows and shots alike
   (ours.height_is_accuracy, draft; the library rows kept). The roof tap and the aim say it. 16 walled turns -> 0.
2. NO WOLF ON A ROOF: a beast's sheet or ours.climbers.never_climb never steps onto a roof (walk, far walk, step aside, shove,
   deal, hunt). Wolves on a roof in 8 of 30 fights -> 0.
3. AUTO FINDS A SHOT: his shooter with no shot grades every tile he can walk to: a shot this turn first (out of a club's reach
   first; the shotgun takes its one man's ring), else a shot next turn (holds if his own tile gives one); then chance x band,
   danger (clubs that can stand beside it next turn), storeys, cover, the walk (ours.auto_finds_a_shot, ai.json crew
   finds_a_shot). The climb takes the roof tile fewest clubs can reach. Clubs walk to the man they can drop. Shooter ended with
   no shot when a tile gave one 89 -> 0; idle when a step gave a hit next turn 110 -> 0; fought wins up vs raiders, robots,
   bosses; brain speed unchanged (6.5 s vs 6.7 s for 40 fights).
Gate gates/auto_plays_smart_gate.js (7/7; the old fight fails 5). Probe tools/bohemia_combat_auto_plays_smart_probe_11_2_26.js
(--wall, --dumb, --climb, --kinds). Amended to the ruling: the_pc_playtest item 14, every_man_has_a_job J4 floor 158,
auto_kills_one_at_a_time F7 pairs against banks/BOHEMIA_COMBAT_FOUR_BEFORE_ON_RULE_321_11_2_26.json.
records/BOHEMIA_COMBAT_HEIGHT_IS_ACCURACY_AND_AUTO_PLAYS_SMART_11_2_26.md.
NEXT: EYES on a phone; TUNING the storey numbers and the wolves (1 of 30 won; before 7, 5 of them wolves giving up on an
unreachable roof); a ladder-only climb if he wants it; the job_tells_the_truth gate not judged (ran past 25 minutes under load).
[bb] ai_engage_ranged scores tiles by range, line of fire, a visible tile, PotentialDanger; height +10 once above, -10 a level below, melee walled at 2 (ours: no wall, +10 a storey).
[analog horror] nothing new drawn; the storeys' points print on the aim's torn receipt paper; a wolf pacing the foot of a wall under a man on a roof.

COMBAT 3 11/2 (brief from the coordinator: rules 312 to 314, ask lines 305 to 307, 223, 225). SHIPPED (BUILD 11/3x), NOT YET SEEN:
1. EVERY ABILITY SHOWS WHERE IT LANDS: a hurt tag (chance, -health) over every man a picked blow will catch; Round Swing and Thresh
   light their eight tiles and tag every man the moment the square is armed; arcs and lines light every reachable tile dim, faint
   tags, exact once aimed; ADRENALINE, RECOVER, INDOMITABLE, RALLY are two taps (first lights who it touches). Every skill audited
   (table in the record; 21 weapon skills have no button in the fight).
2. STAMINA FAIR AND SEEN: the breath comes back at the START of his turn (Battle Brothers), after their blows; the hidden 'owed'
   sum is gone; their fatigue per blow stays Battle Brothers' but stops at 10 between two of his turns
   (ours.fatigue_from_them_between_turns, draft); every bit said over the man (-5 BITE, -2 DODGE, -10 MACE...). Wolves: winded
   turns 50 of 598 -> 0 of 585, the most on one man 50 -> 10.
3. ZONE OF CONTROL AND NO ZERO: every landed blow takes at least 1 (ours.hit_floor_hp; 278 of 1,126 wolf-fight hits were 0); a
   free swing that lands says HELD over him and in the line (the stop itself always held); the walk warns and rings the tile.
   The preview's blow count now wears Battle Forged down as real blows do.
Gate gates/see_every_hit_gate.js (10/10, --shots, --before); fatigue gate F2 amended. Probe tools/bohemia_combat_see_every_hit_probe_11_2_26.js.
records/BOHEMIA_COMBAT_SEE_EVERY_HIT_FAIR_STAMINA_ZONE_OF_CONTROL_11_2_26.md; pictures records/combat_see_every_hit_11_2/.
NEXT: EYES on a phone; TUNING the two drafts; rule 319's two-tile poles get their own preview leg; by-hand fight minutes.
[bb] tiles light as a skill is aimed; 15 back at the start of his turn; struck 5, maces 10/20, dodged 2; a free attack that hits cancels the move.
[analog horror] the breath taken is the breath tag's plate turned rust with a misprinted red edge; HELD a crooked strip of hazard tape.

COMBAT 11/2 (brief from the coordinator: the layers, the punch, way more maps; ask lines 251, 264, 266, 252). SHIPPED, NOT YET SEEN:
1. THE LAYERS (fb7796de, BUILD 11/2x): everything standing south of a man covers him (buildings by outlines read off the block
   pictures into slices/fight_ground/fight_stands.json by tools/bohemia_combat_the_fight_layers_11_2_26.py; cars, walls, sheds,
   crypts, lamps by their own pictures). The glass under a covered man is kept (until the camera, turn, a mark or a tile changes)
   and laid back over him through those outlines. Church 51% of him, 3-storey warehouse 48%, motel 23%, shop 21%, a one-storey
   ranch house 0% (its picture sits inside its own tile: TALLER HOUSE ART is a COOK/DIRECTION call). Bench frame 13.4 -> 17.3 ms.
   records/BOHEMIA_COMBAT_THE_FIGHTS_LAYERS_11_2_26.md
2. THE PUNCH (0b887a6e, BUILD 11/2z): the struck man waits for the blow (he reacted 225 ms early), freeze 50-120 ms, white with a
   red/cyan split, knock 5-14% of his height, glass kick 2-7 px, bar chip, a body's thud, dust on a missed shot. ours.json 'punch'.
   Fight length unchanged. records/BOHEMIA_COMBAT_THE_PUNCH_11_2_26.md
3. THE BOARD HAS A SHAPE (BUILD 11/2zz): 18 shapes cut from the vacant-lot block; city districts 16.1 -> 29.5 shapes in 50 deals.
   ours.json 'board_shapes'. records/BOHEMIA_COMBAT_WAY_MORE_FIGHT_MAPS_11_2_26.md
NEXT: EYES to see all three on the phone; the punch's own sound (SOUNDS); new block shapes (COOK); the gore drops and ripples are
still drawn over buildings (they are in the air); the fight's bench reads only ~30 frames a second, so the kick's four steps want a
phone's eye.
[bb] a hex row's tall pieces are drawn after the brothers behind them; a hit is a lunge, a jerk and a bar's lost piece; every
tactical map is cut from its terrain's template.
[analog horror] the roof over his legs is the glass's own pixels; the man hit burns white and slips into his red and his cyan; the
half-built subdivision, slabs poured for houses nobody came to build.
