# COMBAT 5, SHIP 2: THE CELL VEST (11/2, rule 305, ask line 297)

His words (11/2): "what if we have a character build that's like low-key a suicide bomber... I want it to be realistic too... the
main point of this guy is to die on the battlefield, or at least fuck something up so bad he faints... maybe we can add a perk like
this character only has one HP, and his armor better support everything otherwise he's going down."
The design: records/BOHEMIA_PAOLO_THE_CELL_VEST_THE_WRONGNESS_AND_TRUE_JOB_TIMES_11_2_26.md section 1. The name everywhere in the game:
THE CELL VEST, and the man in it A SPARK (drafts). Nothing player-facing says suicide or bomb (the gate reads the words).

## MEASURED BEFORE
- The fight had no accessory slot read, no burning ground, no smoke, nothing that goes off when a man falls.
- A man of his struck down: 20% he dies, +5% a mark (ours.struck_down_death_chance, struck_down_death_per_mark). No perk touched
  max health or how a blow splits between armour and health.
- Battle Brothers' library (records/target/bb/weapons.json, bb_all/0770_Fire Pot.txt, 1486_On Fire, 1822_Smoke Pot): the fire pot
  sets 7 hexes On Fire for 2 turns; ending a turn there does 15 to 30, 100% armour damage and 10% direct, friend and foe alike;
  walking through is free; the smoke pot covers 7 hexes for 1 turn, halves the ranged skill of a man inside it, doubles his ranged
  defence, ends zones of control and puts out fire. Battle Brothers has no man who goes off when he falls.

## WHAT SHIPPED (slices/BOHEMIA_FIGHT.html; every number in records/target/bb/ours.json cell_vest with its reason)
- **The vest on a man**: the company's gear hands `acc` (the accessory slot, Battle Brothers' slot for a dog or a bandage, so the
  body armour still works): cell_vest_scrap 4 cells, cell_vest_yard 8, cell_vest_late 12. **The main character cannot wear it**
  (he never dies, so it would cost him nothing). Price (ECONOMY's to set): 15 batteries a cell, so a loaded yard vest is 120, two of
  Battle Brothers' fire pots (600 crowns each at 10 crowns a battery); the empty vest 10, 40, 120.
- **The squeeze (his action, the important shot)**: one square on his skill row (a vest of cells, a crimson edge), 4 AP (Battle
  Brothers' plain attack). First tap: THE RISK LIT FIRST: the nine tiles that burn ringed crimson, the hurt over every man touching
  him (friend and foe, "-59 DOWN" when it drops him), his odds to die over him ("45% DIES"), the line ("CHISPA's vest: 8 cells. Burns
  2 of theirs beside him, up to -59 each. He goes down: 45% he dies. It burns 1 of yours beside him too. Tap again ON THE BEAT for
  every cell."), the square breathing on the beat. Second tap: the squeeze, read against the song's beat (the dial's job until the
  dial lands): within a tenth of a beat every cell, off it half. AUTO never squeezes (rule 180(g): a special is his button).
- **The dead man's switch**: struck down with a live vest, every cell goes, no dial, on his turn or theirs, on AUTO too.
- **What it does**: 8 a cell on every man on the eight tiles touching him, friend and foe (fire picks no side, the fire pot's rule),
  half straight through, the rest on the body armour and through once the armour is gone; x1.5 with a building's wall beside him (the
  vented gas lights at once, the Surprise, Arizona battery building, April 2019); x1.5 on a machine (heat kills electronics). His
  tile and the eight round it burn 2 rounds (a man ending his turn there takes On Fire's 15 to 30, the armour first, a tenth
  through; walking through is free) and smoke 2 rounds (a shot whose line crosses it -20, said 'smoke' in the aim).
- **What it does to him**: he is in the fire, so it always knocks him down, and the fall roll gets the vest's share: 20% + 5% a mark
  + 25% = **45% he dies with no marks**; fire gear takes 15% off (ours.cell_vest.fire_gear lists the armour ids: none in the library
  yet, a welder's leathers and a fire apron are CHARACTER's).
- **The perk NOTHING LEFT** (his idea, perk id nothing_left): his most health is 1, and his armour takes the WHOLE of every blow while
  it stands (nothing through to him until the armour is gone; the vest's fire too). The rule for offering it first (a man who has lost
  20+ max health to knockdowns, rule 304's tally, engine/bohemia_condition.js hpCut) is in the data (nothing_left.offer_first_hp_lost);
  the perk screen that offers it is the roster's (CHARACTER/RUN), not touched here.
- **The fear**: once a side has seen one go off (everybody on the board sees it), the tiles beside a live vest cost its men 60 in the
  brain's coin (under a blow's worth, so a man with nothing else to hit still swings), its shooters take a live vest first (x1.5), its
  clubs swing at him at half worth. Battle Brothers' way of a foe that respects a threat.
- **On the board** (placeholders until CHARACTER and DIRECTION draw them): the vest on his chest, two rows of cells with caps, wires
  between, a crimson edge (lithium's flame colour; never purple, the Amalgamation's); the burning ground in tongues of crimson, orange
  and yellow cells stepping on the beat's keys; the smoke in grey cells drifting a step a key; the whole frame whites out on the beat
  the cells catch (three steps over a beat); "SPARK" (or "THE SWITCH LET GO") over him; each burn said over the man it hit. The sound
  is asked for by name (sfx 'cell_vest' with the cells, the way it went and the wall) for SOUNDS to make from real material.
- Climb or attack (rule 328): climbed this turn, the squeeze is refused like every attack.
- Pictures (his phone, 390 x 844, the real page): records/combat_the_cell_vest_11_2/1_THE_RISK_LIT.png, 2_THE_SQUEEZE.png,
  3_THE_FIRE_AFTER.png (tools/bohemia_combat_the_cell_vest_phone_11_2_26.js, 4/4).

## MEASURED AFTER (gates/the_cell_vest_gate.js, 10/10)
- A yard vest on the beat: 8 cells; off it 4. Each man touching him: -32 health, -32 armour (64 a man). Two tiles off: nothing. 9 tiles
  burn and smoke. The risk lit first matched what landed, man for man.
- By a wall 4 cells do 48 (32 in the open); on a machine 48.
- The switch: struck down by their blow, all 8 cells went with no squeeze and burned the man beside him 64.
- The death roll: 45% in the rules, 30% in fire gear; 119 squeezes on fresh boards, **45.4% died**.
- NOTHING LEFT: most health 1; a blow of 30 against 50 armour took 30 armour and no health; the next blow past the armour dropped him.
- The ground: ending a turn on a burning tile cost 15 (10 armour, 5 health through the gone armour); gone after 2 rounds; a shot through
  the smoke went 24 -> 5 (the floor) and said smoke.
- The fear: before, the tiles beside the live vest cost a brigand nothing and he went beside the plain man anyway; after, 60, and he
  stepped beside the man with no vest.
- AUTO, 12 fights with a scrap vest and a yard vest on two hires against five brigands: no squeeze by AUTO, 24 switches went off (both
  vest men fell in every fight: the switch is how a Spark dies on AUTO), every fight ended, 0.5 minutes on AUTO by the bench's sum.
- Fights with no vest are untouched (the fire, the smoke, the fear and the perk read nothing when nobody wears one): climb_or_attack
  and auto_plays_smart green on this code.

## WHAT IS LEFT
- EYES on his phone (ask line 297: NOT YET SEEN). NOT IN A TAB YET for him to meet in play: no hire arrives in a vest and no stall
  sells one; the fight wears it the moment the roster hands `gear.acc` (engine/bohemia_roster.js company() hands main, off, body, head,
  bag today). The yard hire and the vest on the body: CHARACTER and DIRECTION. The price: ECONOMY. The perk screen offering NOTHING
  LEFT first: CHARACTER/RUN's roster (the threshold is in the data). The words: WORDS. The sound: SOUNDS.
- The dial does not exist yet (63a); the squeeze reads the song's beat in its place. When the dial lands, the squeeze is its job.
- TUNING: every number (8 a cell, half through, x1.5, 2 rounds, -20 smoke, +25% death, the fear's 60).
- A Spark of theirs: the code reads any side's vest; no enemy wears one yet (a faction's call, FACTIONS).

[bb] Battle Brothers' fire pot (7 hexes On Fire for 2 turns, 15 to 30 at the end of a turn, 100% armour damage, 10% direct, friend
and foe alike), its smoke pot (7 hexes, the shot through it worse), the accessory slot (a dog, a bandage), and Nine Lives (a killing
blow survived once) are the bones. Battle Brothers has no man who goes off when he falls: that is our twist, and its AI's respect for
a threat it has seen is the fear.

[analog horror] The frame whites out on the beat the cells catch, three hard steps back to the picture, like a tape head losing the
signal; the crimson root of the flame is lithium's own flame-test colour, never purple; the smoke hangs in grey cells that step, not
drift, a key at a time; the vest is wires and caps on a man's chest, salvage, nothing heroic about it.
