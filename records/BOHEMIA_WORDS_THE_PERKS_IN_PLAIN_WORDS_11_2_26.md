# WORDS: THE PERKS IN PLAIN WORDS (11/2/26)

Paolo 11/2, ask line 256: 'I would like to see the perks have more eighth grade level reading.' Coordinator brief: every perk's name and line so a fifteen-year-old gets it in one read, what it does, in numbers, one line, no jargon; then the other words the demo shows most that fail the same test.

## WHAT CHANGED

- All 50 perk lines (records/target/bb/perk_translation.json `skin`, the line the crew screen's PERK tab prints under the name beside COOK's icon) rewritten: what it does, with its number, in the stat words the crew screen prints (hitpoints, fatigue, resolve, initiative, melee/ranged defense, AP, tiles), average 54 characters, longest 83. No he/him/his: the same line sits on YOUR card and on a crew man's (the first draft said 'he' and read wrong on YOU, seen in the phone shot, fixed before ship). Numbers are perks.json's, unchanged; no mechanic changed.
- The old poetic line is kept in each row as `flavour` (not shown), so nothing written is lost. Every row stays draft:true and carries `words`.
- Five weapon perk names made to match the crew screen's own weapon words, so every weapon perk reads '<WEAPON> WORK': HATCHET WORK -> AXE WORK, BUTCHER WORK -> CLEAVER WORK, BLADE WORK -> MACHETE WORK, LONG POLE -> POLE WORK, BOTTLE ARM -> BOTTLE WORK. The other 45 names stand.
- Traits (records/target/bb/traits.json `says`, the words beside the numbers on the hire card and the crew card): six of the fifteen a recruit can be dealt read vague or wrong and were fixed. 'Runs first.' (CRAVEN, -10 resolve) read like 'moves first'. The other nine already pass.
- Stat help: there was none. records/target/bb/stat_help.json now holds one plain line per stat (draft:true). NOT WIRED: the crew screen's stat tap says the name and the number; adding this line is a one-line change in the roster screen's stat click, which is UI's code, so it is OWED to UI (this lane touches words, not code).
- End-of-fight lines: read, already plain ('THE ROAD CREW RAN', 'YOUR CREW IS DOWN', '1 got out, 0 did not. No pay.'). One note for COMBAT, not changed (its file): the recap table's column 'BLOOD' means damage dealt and 'TAKEN' damage taken; 'DEALT' would read plainer than 'BLOOD'.
- The hire card's words come from the trait line above plus the stat numbers; nothing else failed the test.

## PERKS, BEFORE -> AFTER

| perk | before | after |
|---|---|---|
| fast_adaptation | READS YOU: every miss teaches him where you lean | READS YOU: +10% to hit after every miss. Resets on a hit. |
| crippling_strikes | LEAVES A MARK: he hits to break things, not to win points | LEAVES A MARK: Injures enemies with 33% less damage. |
| colossus | BUILT LIKE A DOOR: a quarter more of him to get through | BUILT LIKE A DOOR: +25% hitpoints. Fewer bad injuries. |
| nine_lives | ALLEY CAT: the hit that should end him does not, once | ALLEY CAT: Once a fight, live through a killing hit with 11-15 hitpoints left and +15 defense. |
| bags_and_belts | CARGO POCKETS: two more things on him that do not slow him | CARGO POCKETS: +2 bag slots. Bag items add no fatigue (except two-handers). |
| pathfinder | KNOWS THE BLOCK: rubble and yards cost him what a street costs | KNOWS THE BLOCK: Moving costs 1 less AP per tile (min 2) and half the fatigue. |
| adrenaline | FIRST OUT THE DOOR: he goes first next round, whatever it costs him | FIRST OUT THE DOOR: New move (1 AP, 20 fatigue): go first next round. |
| recover | CATCH YOUR BREATH: a whole turn spent breathing gives half his wind back | CATCH YOUR BREATH: New move (9 AP): rest a turn and lose half your fatigue. |
| student | STREET SCHOOL: learns a fifth faster until he has learned enough | STREET SCHOOL: +20% XP from fights. At level 11: one free perk point. |
| executioner | FINISHER: a man already hurt takes a fifth more | FINISHER: +20% damage to enemies who are already injured. |
| bullseye | THREADS THE NEEDLE: a car in the way costs him half, not three quarters | THREADS THE NEEDLE: Shots with something in the way: -50% to hit, not -75%. |
| dodge | SLIPPERY: the quicker he is the harder to touch | SLIPPERY: Adds 15% of initiative to melee and ranged defense. |
| fortified_mind | NOTHING SCARES HIM: a quarter more nerve | NOTHING SCARES HIM: +25% resolve. Panics less. |
| resilient | SHAKES IT OFF: dazed and stunned leave him a turn sooner | SHAKES IT OFF: Bleeding, dazed and other bad effects last only 1 turn. |
| steel_brow | HARD HEAD: a hit to the head hits like a hit to the body | HARD HEAD: Head hits do no extra damage. Fewer head injuries. |
| quick_hands | QUICK HANDS: one swap of the weapon each turn costs nothing | QUICK HANDS: Once a turn, swap a weapon for 0 AP (not a shield). |
| gifted | NATURAL: one level-up at the top of every roll | NATURAL: Level up right now, with the best roll on every stat. |
| backstabber | PILE ON: every friend on his man counts double | PILE ON: Each friend next to the target: +10% to hit, not +5%. |
| anticipation | SEES IT COMING: the further the shooter the harder the shot | SEES IT COMING: Harder to shoot from far: at least +10 ranged defense, more per tile. |
| shield_expert | DOOR MAN: the car door covers a quarter more | DOOR MAN: Shield gives 25% more defense and takes half the damage. |
| brawny | CARRIES THE WEIGHT: heavy kit slows him a third less | CARRIES THE WEIGHT: Armor and helmet cost 30% less fatigue and initiative. |
| relentless | NO QUIT: tiredness only half slows him, and waiting costs nothing | NO QUIT: Being tired costs half the initiative. Waiting costs none. |
| rotation | SWAP OUT: trade places with a friend in trouble | SWAP OUT: New move (3 AP, 25 fatigue): swap places with a friend next to you. |
| rally_the_troops | ON ME: a shout that pulls the runners back | ON ME: New move (5 AP, 25 fatigue): stops friends within 4 tiles from running. |
| taunt | COME AT ME: makes the man in front pick him | COME AT ME: New move (4 AP, 15 fatigue): an enemy within 3 tiles comes at you. |
| mace_mastery | PIPE WORK: the pipe tires him a quarter less | PIPE WORK: Pipe: 25% less fatigue. Knockout hits always stun. |
| flail_mastery | CHAIN WORK: the chain tires him a quarter less | CHAIN WORK: Chain: 25% less fatigue. Lashes go around shields. |
| hammer_mastery | SLEDGE WORK: the sledge tires him a quarter less | SLEDGE WORK: Sledge: 25% less fatigue. +33% damage to armor. |
| axe_mastery | HATCHET WORK: the hatchet tires him a quarter less | AXE WORK: Fire axe: 25% less fatigue. Splits shields 50% faster. |
| cleaver_mastery | BUTCHER WORK: the cleaver tires him a quarter less | CLEAVER WORK: Cleaver: 25% less fatigue. Cuts bleed 10 a turn, not 5. |
| sword_mastery | BLADE WORK: the blade tires him a quarter less | MACHETE WORK: Machete: 25% less fatigue. Wide swings +10% to hit. |
| dagger_mastery | PISTOL WORK: the pistol fires at 3, room for a third shot | PISTOL WORK: Pistol shots cost 3 AP, not 4: one more shot a turn. |
| polearm_mastery | LONG POLE: the pole tires him a quarter less | POLE WORK: Pole hook: 25% less fatigue. Costs 5 AP and hits up close. |
| spear_mastery | SPEAR WORK: the spear tires him a quarter less | SPEAR WORK: Spear: 25% less fatigue. The spear wall holds after one gets through. |
| crossbow_mastery | RIFLE WORK: the rifle bites through a fifth more armour; the shotgun reloads at 6 | RIFLE WORK: Rifle: 20% more damage through armor. Shotgun reloads in 6 AP, not 9. |
| bow_mastery | BOW WORK: the bow tires him a quarter less | BOW WORK: Bow: 25% less fatigue. See and shoot 1 tile farther. |
| throwing_mastery | BOTTLE ARM: a bottle at two houses hits a third harder | BOTTLE WORK: Bottles: +30% damage at 2 tiles, +20% at 3. |
| reach_advantage | KEEPS YOU OUT: every hit with the big one makes him harder to reach | KEEPS YOU OUT: Each two-hander hit: +5 melee defense, up to +25, till next turn. |
| overwhelm | GETS THERE FIRST: hit a man before his turn and he swings worse | GETS THERE FIRST: Attack an enemy before they move: they get -10% to hit for a turn. |
| lone_wolf | LONE WOLF: nobody within three houses and he is a sixth better at all of it | LONE WOLF: No friend within 3 tiles: +15% to skills, defense and resolve. |
| underdog | BACK TO THE WALL: being surrounded does not cost him | BACK TO THE WALL: Being surrounded no longer lowers defense. |
| footwork | SIDESTEP: walks out of a man's reach without the free swing | SIDESTEP: New move (3 AP, 20 fatigue): step away from an enemy with no free hit. |
| berserk | SEES RED: a kill gives him four more actions, once a turn | SEES RED: Once a turn, a kill gives 4 AP back. |
| head_hunter | HEADHUNTER: once he finds the head he keeps finding it | HEADHUNTER: After a head hit, the next hit lands on the head too. |
| nimble | LIGHT ON HIS FEET: in light kit the hits slide off him | LIGHT ON HIS FEET: Light armor: take up to 60% less hitpoint damage. |
| battle_forged | PLATED: the more plate on him the less the plate wears | PLATED: Heavy armor: armor damage cut by 5% of total armor. |
| fearsome | THE NAME THEY WHISPER: any blood he draws shakes them | THE NAME THEY WHISPER: Any hit that draws blood can make the enemy panic. |
| duelist | ONE ON ONE: a free hand puts a quarter more past the armour | ONE ON ONE: Other hand free: 25% more damage goes through armor. |
| killing_frenzy | BLOOD UP: a kill makes everything hit a quarter harder for two turns | BLOOD UP: A kill: +25% damage for 2 turns. Enemies aim at you more. |
| indomitable | IMMOVABLE: plants his feet: half damage until his turn | IMMOVABLE: New move (5 AP, 25 fatigue): half damage, cannot be stunned, till next turn. |

## TRAITS, BEFORE -> AFTER

| trait | before | after |
|---|---|---|
| Clumsy | All thumbs. | Misses more up close. |
| Craven | Runs first. | Panics fast. |
| Dexterous | Good hands. | Hits more up close. |
| Hesitant | Slow to move. | Slow to act. |
| Strong | Carries more. | Lasts longer in a fight. |
| Sure Footing | Hard to knock down. | Hard to hit up close. |

## STAT HELP (new, not wired)

- hp: How much damage you can take before you go down.
- fatigue: How much you can do before you are worn out. Every step and swing uses some.
- ranged_skill: Your chance to hit from far away: guns, bows, bottles.
- melee_skill: Your chance to hit up close.
- ranged_defense: How hard you are to hit from far away.
- melee_defense: How hard you are to hit up close.
- resolve: Your nerve. Low resolve and you panic or run.
- initiative: How early you move each round. Heavy gear and being tired lower it.

## PROOF

- The real demo (BOHEMIA_DEMO.html) at phone size through tools/bohemia_drive_the_demo.js: title, map, the nearest town, CREW, a perk point given to YOU, the PERK tab: nine perks shown, each COOK icon beside the new name and line (first shot showed the 'he' draft; second shot the shipped words).
- the_perks_are_live_gate 47/0 (every row keeps its draft name and skin line); attempt_gate 15/0; language_gate 103/1, and the one red ('the fight loads the dial and the veteran speaks through it') is red on main without this change, a fight-side line, not these words.

[analog horror] words only this round: plain lines are the clarity under the horror, the horror is the pictures and the sound. [bb words] Battle Brothers' perk tooltips lead with the number and the condition ('+10% chance to hit with each attack that misses'); these do the same in fewer words.
