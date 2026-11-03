# COMBAT (the fight) -- the handoff block (written only by COMBAT, newest first; older blocks: handoffs/COMBAT_ARCHIVE.md)

COMBAT MAPS 3, RULE 346 11/3 (scheduled brief from the coordinator: ask line 355; his VOTE: the Strip 'The worst, this needs to be
THE BEST', downtown 'Looks like shit', every ground 'straight lines at grid borders... colors that end abruptly... roads that dont
connect... things that dont visually and logically make sense'). PUSH 1 SHIPPED (BUILD 11/3zzzl - NO BOARD BREAKS ITS OWN PICTURE),
NOT YET SEEN; pushes 2-5 IN FLIGHT in the same session:
1. THE LEGS: gates/every_place_no_seams_gate.js (suite row NO BOARD BREAKS ITS OWN PICTURE; reads in
   tools/bohemia_combat_maps_seams_read_11_3_26.py): seams (block seams, cell borders), cut-offs, roads met across every block
   seam, logic list by eye (records/target/combat_maps_11_3/logic_list.json, tied to the pictures' sha1). OWED_SEAMS only shrinks;
   before = records/target/combat_maps_11_3/seams_before.json, after push 1 = seams_after_push1.json.
2. THE STRIP (blvd.1-2, stripw.1-3, stripe.1-2) and DOWNTOWN (fremont.3-7) rebuilt; the lab re-rendered; the old plaza/fremont
   blocks graveyarded (graveyard/the_strip_and_downtown_11_3_26/POSTMORTEM.txt: the camera rule). FEATHER_KINDS: every place's own kinds.
3. THE TOOL (tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py) already carries pushes 2-5 (warm grounds dustslab/lakemud/
   passtan, apron.4, the old town blocks out of every place, every road/track/path at fixed rows, margins); --data --hold <places>
   keeps a place as on main until its pictures are rendered and swapped. VOTE: combat-place-<place>-11-3b.

COMBAT 7 11/3 (brief from the coordinator, check-in 10: EYES 11/3 broken items 1 and 2, the open asks page's 139, 152, 229).
SHIPPED (BUILD 11/3zzzc item 1 alone 0de54ccb, then BUILD 11/3zzze), NOT YET SEEN:
1. AUTO NEVER LEAVES A MAN (rows 96, 109, 319, 331): the cause was a man of theirs who had BROKEN and was running, counted by AUTO
   as a full target (the walk's hunt field, the roof climbed for next turn's blow on him, the walk-then-blow). Now (BOHEMIA_FIGHT.html
   huntField keepOffRunners, bestTurn runOnly, nextBest's moved flag, the old brain's tile targets) his men hunt the men who stand;
   a runner only when no standing man is reachable, or for a kill on offer. Repro 0 of 25 (was 23); planner test 79 of 120 before
   and after on today's boards (COMBAT 6's 81 was on the old boards); men down 197 -> 196.
2. THE ROUND SWING'S WORDS (row 332): SWEEP_SAYS.front when FIGHT.frontSwing(sk).
3. 139: the break is asked on AUTO too (routUp/routHolds, ours.chase_calc.ask_beats 8; S.runDown holds his RUN THEM DOWN).
   152: the hole not met (0 off the glass in 2,355 computer frames); the camera gate's 6-point centring red (BAR_TALL vs the gate's
   own tallest) is on main too, left for the camera's owner. 229: three long AUTO fights on the computer, 0 throws.
Gate: gates/auto_never_leaves_a_man_gate.js (8 legs, --headless-only for N1/N2). Probe: tools/bohemia_combat_auto_never_leaves_a_man_probe_11_3_26.js.
VOTE: combat-7-auto-never-leaves-a-man-11-3 (the same fight before and after, moving, plus the ask and the swing's words).
Record: records/BOHEMIA_COMBAT_7_AUTO_NEVER_LEAVES_A_MAN_11_3_26.md.
NEXT: 90, 103, 108 (left as briefed); THE FORMATION IS KEPT gate is 19/4 on main (the lineup drag and kept line), not this round's.
[bb] Battle Brothers lets the player choose the rout once they all run; its brothers are never on AUTO, so 'stay on the man hurting
your friend' is ours. [analog horror] nothing new drawn; the fight goes still four seconds on receipt paper while it asks.

COMBAT MAPS 3 11/3 (brief from the coordinator, re-briefed mid-round: rule 341, ask line 350; his 'everything just looked exactly
the same as the main suburb shit... no variety, like true variety... you're not done'). DONE, ALL THREE PUSHES SHIPPED (BUILD 11/3zzq,
11/3zzr, 11/3zzs - EVERY PLACE ITS OWN BOARD), NOT YET SEEN:
1. THE PLAN GATE (gates/every_place_its_own_board_gate.js, suite row EVERY PLACE ITS OWN BOARD): 10 live deals a place measured on the
   plan; PASS 15 of 15, OWED empty. Before/after: records/target/combat_maps_11_3/gate_before.json, gate_after.json.
2. THE GREEN KILLED: COMBAT MAPS 2's dead lawn/fairway grey-brown, the 12 suburb blocks and golf.0 re-laid from c7f7ce05^ (put them in
   /tmp/claude-0/cm2/orig first; the tool copies from slices/ only if orig is missing).
3. THE FIGHT (BOHEMIA_FIGHT.html): placeOwn/dealOwn (ours.place_boards: landmark in column 1 in a picked row, field round it, cols/rows
   pins), placeOwnStart (line/wide/camp/pincer), built boards skip fitCover, baked pieces have no sprite, a piece with burning: true is
   On Fire all fight (the landfill), the ring never repeats a place's landmark.
4. FIFTEEN PLACES, 36 blocks (lab.1-3, apron.1-3, golf.1-2, trailer.1-2, desert.1-3, canyon.1-2, pass.1-3, lakebed.1-3, wash.2-4,
   dump.1-2, yards.1-2, plaza.1-2, fremont.1-2, rail.1-2, basin.1-2) through the master rig by
   tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py (--render/--swap/--data/--cards/--register; venv python3.11 + bpy
   4.2.0; ~4 min a block); twelve places on COOK PROPS' .glb models (Kit.model), the first three on this lane's own (made before
   COOK PROPS' first batch landed). VOTE: combat-place-<place>-11-3, fifteen cards.
NEXT (not asked, for whoever picks it up): COOK PROPS' lab/airport/golf models onto those three boards; 'burns if hit' (propane, the
tank car) and 'no shot from a roof under the canopy' are new rules, not built. Record: records/BOHEMIA_COMBAT_MAPS_EVERY_PLACE_ITS_OWN_BOARD_11_3_26.md.

COMBAT MAPS 2 11/2 (brief from the coordinator: rule 336, ask line 337; his NO on the six maps: 'still this yellow brown sand dirt
as the main ground, not enough unique shit going on'). SHIPPED (BUILD 11/3zx - EVERY GROUND ITS OWN), NOT YET SEEN:
1. THIRTY GROUNDS THROUGH THE RIG: 27 new ground materials in the floor tool's own material language with their own scatter
   (dead lawn x2, marble, pool tile, oil slab, ballast, ties, rail, gravel, cobble, silt, cracked mud, bathtub ring, desert
   pavement, caliche, scree, red sand, slickrock, cover soil, bunker, fairway x2, apron slab, tie-downs, brick rubble, epoxy,
   hazard yellow), each built by the floor tool's build(), through the master rig, by the block camera, as a seamless 30 m
   plate (tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py --plates; venv python3.11 + bpy 4.2.0; ~45 s a plate).
2. EVERY BLOCK ITS PLACE'S PLAN, LAID ON THE OLD SAND UNDER THE OLD PICTURE'S LIGHT (--lay; 39 blocks x 3 futures, the casino
   untouched): houses, shops and masses masked by the rig's ledgers (house_lot tops, fight_stands outlines, a few tiles); the old
   pixel's shadows and grime kept. No camouflage: one main ground a place, the second only as a shape on the tiles that say so.
   Plates and the pre-round originals live in $CM2_WORK (/tmp/claude-0/cm2): to re-lay, re-render the plates and copy the
   pictures as they stood at 2cb32f46 into $CM2_WORK/orig first (the tool copies from slices/ only when orig is missing, so a
   fresh session would lay on its own output).
3. THE LAB YARD (lab.0, NEW): its own ground (epoxy, hazard hatching, decon pad, a beast's prints walking out) on works.0's sheds;
   named board 'lab', futures, layers, roof storeys; medical deals lab first. The wash, basin and reservoir districts now deal
   the wash and the shore first (ours.board_grounds).
4. MEASURED: blocks 68.9% -> 23.2% of the picture the old sand colour family (raided 63.6 -> 21.7, reclaimed 63.1 -> 17.8); his
   phone, 15 places, 49.6% -> 15.7%; 0 purple. VOTE: combat-maps-every-ground-11-2 (redo of the six) and 15 place cards.
NEXT: the lab yard's own buildings; a second block of each new place; the tract roofs are still tan (the buildings, not the
ground). Record: records/BOHEMIA_COMBAT_MAPS_EVERY_GROUND_ITS_OWN_11_2_26.md.

COMBAT 6 11/2 (brief from the coordinator: rules 332 and 333, ask lines 331 and 332; the routine 'a turn's score counts the next
turn', rule 332 amended, ask line 334). SHIPPED (BUILD 11/3zv, AUTO PLAYS THE BEST TURN), NOT YET SEEN:
1. AUTO PLAYS THE BEST TURN (slices/BOHEMIA_FIGHT.html bestTurn; ai.json crew best_turn; ours.auto_best_turn): every action his man
   can take this turn (each blow, each sweep, Rally, Rotation, Footwork, Recover, the turn-end Indomitable/Taunt/Adrenaline, a swap
   from the bag then its blow, a walk then a blow, a reload, the cell vest's squeeze only by its rule, holding/the rest, and a climb
   onto a roof) scored as the hurt it deals (with the road to each man's kill, rule 201's coin) minus the hurt he takes where it leaves
   him, PLUS 0.6 x the best one action his next turn can be from there (ask line 334: one step, never deeper). No long chases (3+ tiles
   ending in 2+ clubs' reach, unless a kill at even odds); no walking out of a ring (Footwork leaves); out of breath he holds (their
   expected breath counted). THEIR shooters and swingers play the same brain after their own lessons (ours.auto_best_turn.theirs).
2. THE ROUND SWING HITS THE THREE IN FRONT (ours.round_swing; Round Swing and Thresh, every side; the preview lights three on the aim).
Measured (tools/bohemia_combat_auto_best_turn_probe_11_2_26.js, 120 fights): against the same enemy (their new brain) his new brain wins 81 of 120 where his old won 79, 201 of his men down (230), 11 long chases (15), 11 free swings taken (46), 50 abilities and 439 swaps (0 and 0), 95 climbs for next turn's shot, fights 0.8 to 1.3 minutes; their new brain costs the old pair 5 wins (84 -> 79).
records/BOHEMIA_COMBAT_AUTO_PLAYS_THE_BEST_TURN_AND_THE_ROUND_SWING_11_2_26.md (the table, the three worked examples, the gates).
Gate: gates/auto_plays_the_best_turn_gate.js (7 legs). Amended to his rulings: weapon_shapes, see_every_hit, auto_never_wastes (G3, G6),
the_cell_vest (V10), the_pistol_is_never_a_club, auto_plays_smart (H4 and its probe); the three bank gates (auto_kills_one_at_a_time,
every_man_has_a_job, auto_never_wastes) play their side on the old brain the bank was made with (BOHEMIA_THEIR_BRAIN=bank).
NEXT: EYES on his phone; TUNING the weights (next_turn 0.6 makes a rest for a three-man round swing lose to blow-now-and-next: the
swing is worth 1.9 plain blows, a rest needs 2.67); AUTO's reason said on the screen (UI/WORDS, u.btSay holds it); robots are the one
kind behind (his men's breath rests against them).
[bb] Battle Brothers' AI scores one behaviour at a time for this turn (PotentialDanger on the tile), swaps for 4 AP, never leaves a
zone of control for nothing; its Round Swing hits six round the man, ours three in front.
[analog horror] nothing new drawn: the three tiles in front light on the same receipt paper; the man resting for his breath holds the
weapon down while the thing in front of him waits.

COMBAT MAPS 11/2 (brief from the coordinator: rule 325, ask line 323, 'way more combat maps... the only thing you have is like this
desert yellow brown suburbia thing'). SHIPPED (BUILD 11/3zs), NOT YET SEEN:
1. WHY HE SAW ONLY SUBURB (measured, 230 fights the game starts: every district day and night, the region's 34 places, the bosses;
   tools/bohemia_combat_maps_every_district_probe_11_2_26.js): the alpha handed the fight a kind, never the district, so the deal
   led one slot of twelve and filled the rest from the city family (six of eleven kinds the tract) plus last round's vacant lots;
   the casino, the overpass and the desert road were never dealt. 14 kinds ever dealt, 35.7% of all blocks suburb, 41% of boards
   mostly suburb.
2. THE MAP HANDS THE DISTRICT (alpha nfOpts, __EVERY_PART_OF_TOWN_FIGHTS__) and a place deals ITS OWN kinds (BOHEMIA_FIGHT.html
   placeKinds/dealPlace, data ours.json 'board_grounds': the district's row else its ground's; the lead on half the slots; shapes
   only on town grounds; new kinds mirrored; a boss keeps his board). Rule 46a's cell seed, WORLD's ground-effects fit and FACTIONS'
   who-holds-the-ground weights now run in the game (they were written for a district and never got one).
3. SIX NEW BLOCK KINDS through the rig, each with raided and reclaimed (18 pictures): pass (the pass road), canyon (Red Rock),
   trailer (the trailer park), golf (gone to dust), marina (Lake Mead's dry marina), apron (the airport). Tiles first, picture
   built from them (tools/bohemia_combat_maps_new_blocks_through_the_rig_11_2_26.py; venv: python3.11 -m venv v && v/bin/pip install
   bpy==4.2.0 numpy pillow scipy; ~5 min a block at 16 samples on 4 cores).
4. AFTER (same 230 fights): 23 kinds, 12.5% suburb, 12% of boards mostly suburb (all real suburbs). Three blocks gate taught the
   district route (casino REACHED); sounds' floor table re-derived; pack manifest slices/fight_ground/combat_maps_11_2.json.
records/BOHEMIA_COMBAT_MAPS_EVERY_DISTRICT_ITS_OWN_11_2_26.md; sheet records/target/combat_maps_11_2b/ (VOTE: combat-maps-every-district-11-2).
NEXT: a second block of each kind; Fremont under the canopy, the pool deck, a lab yard, a solar field; the new blocks' tall things
into fight_stands.json (COMBAT 2 holds it); WORLD to give Red Rock, Valley of Fire and Echo Bay their real grounds.
[bb] Battle Brothers cuts every tactical map from the ground the party stands on: where you fight is the fight.
[analog horror] one wrong thing a place: hazards blinking in daylight, a porch light at noon, the one green on a dead course, a boat
tied to a dock with no water, a dead jet with its cabin lights on, a handprint older than the valley.

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
