# COMBAT (the fight) -- the handoff block (written only by COMBAT, newest first; older blocks: handoffs/COMBAT_ARCHIVE.md)

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
