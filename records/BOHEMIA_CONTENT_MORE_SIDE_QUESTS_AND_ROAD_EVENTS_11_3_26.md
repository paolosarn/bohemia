# CONTENT 2: MORE SIDE QUESTS AND ROAD EVENTS (11/3/26)

Ask line 342 (Paolo 11/3: "keep building content please, all angles, every angle possible, let's be efficient with our
tokens"; his standing note: "more analog horror, no more cards with quests, just make an actual quest, make the pixels, make
the sound"). Last round: records/BOHEMIA_CONTENT_MORE_TO_DO_ON_THE_ROAD_11_2_26.md (29 road events, 5 side quests).
Battle Brothers' way first (an event stops the company on the road: a face, a situation, two or three choices with a real
cost; some remember what you chose), then ours: the road's people talk about WHAT IS REALLY ON THE MAP NOW.

## 1. WHAT A PLAYER CAN MEET, BEFORE AND AFTER

| | before (main 561fc997) | after |
|---|---|---|
| road events with a face and 2-3 choices | 29 | **45** (+15, and one payoff of a chain) |
| of them using the newest things on the map | 0 | **11** (the whip, the pool pole spear, the cell vest's hire, two on the Caravans' delivery and its payoff, three on the mountains' pass roads, two at a raided town) |
| chains (a choice now, a payoff later) | 6 | **7** (warn the convoy, and the robber you crossed comes for what it cost him) |
| side quests on the map, from QUESTS' .bq library | 5 | **15** (+10 act one) |
| side quests met by what is on the map now | 0 | **4** (two bosses' signs, a raid's crew walking home, a search in a town's lot) |
| side quest talk nodes / lines / choices | 46 / 95 / 98 | **132 / 255 / 291** |

## 2. THE TEN SIDE QUESTS (records/target/BOHEMIA_SIDE_QUESTS.json, baked by tools/bohemia_side_quests_bake.js)
Every say and choice VERBATIM from quests/bq (QUESTS stays research only: read, never asked to build). The glue (who each role
is, the face, where the second person waits, what an ending pays) is this lane's, draft:true. People, places and things: a
person with a face stops you; the talk turns to somebody who is not here and their place goes on the map; walk there, they
talk; the ending's stage closes it, pays, and the quest's own @LOG line goes on the phone's feed as the journal.

| quest (.bq) | who asks / who waits | where | what ties it to the map | an ending pays (ECONOMY 2's rule) |
|---|---|---|---|---|
| THE KILLING SUMMER (A01) | DON TEO at a standpipe / DOÑA PAZ up the line | 5-10 blocks | the heat, the water | 10 (half if you give it upstream), +2 food on one |
| THE ELDER'S ACCIDENT (A02) | NIETA LUZ in black / EL CAMILLERO on the slope | 2-4 blocks | | 10 (the box: cells in a 2029 newspaper, a Dubai ticket) |
| THE FACTION THAT DIED (A03) | MEMO EL CORREDOR / DOÑA FAUSTA and the forty | at the RAIDED town's gate | **A ROAMING PARTY: met only while a crew that hit somebody's ground is walking home with it (the map's own parties); the raided town is the gone outfit; the crew's faction is the one you can name** | one of the forty JOINS + 5, or +2 food and the raiders hear |
| THE DRY TAPS (A05) | DOÑA CHAYO with a dry hose / THE TAP'S MEN on the pump | AT THE TAP's tag | **A BOSS'S LEAD-UP: met only while THE TAP's tag is in the world; the pump station is at his tag, so walking there is reading his sign (BOSSES' own next step: GO TO HIS PLACE)** | a FIGHT (3 men): 30; at night 2 men: 30; pay them quietly: -8 |
| THE FIRST HARVEST (A06) | DON ISIDRO at the sacks / EL NENE by the flyer | AT THE POT's flyer | **A BOSS'S LEAD-UP: met while THE POT's flyer is up; the short count went in a sack to his kitchen** | 10, +2 food on one |
| THE TWO FAMILIES (A07) | DOÑA SALAZAR / DON PEÑA | 2-3 blocks | | 10, half if you take the fence down |
| LONG WALK HOME (D013) | DOÑA MERCEDES / THE WARDEN of the east ruins | 7-13 blocks, and back to her door | **THE SCAVENGE ACTION IN A TOWN: met on the first block out of a town whose lot you just searched ('you look like you can walk into a bad place and walk back out')** | 10; going through the warden is a FIGHT: 30 |
| THE METER READER (S01) | RUBÉN EL LINIERO at nine at night / LA FIXER at the split | 4-8 blocks, and back | night, the stolen current | 10 |
| THE COUNT THAT DOES NOT ADD (S10) | EL CONTADOR with a clipboard / DOÑA ROSA at the food line | 3-7 blocks | | the crates: +5 food, +3 for the short count |
| SIXTY SECONDS OF RAIN (S11) | DON CIRO under a blue sky / LA FLACA at the culvert | 3-6 blocks, rough ground first | the real Las Vegas flash flood | 10, or one you pulled out JOINS |

THE PAY, AND WHY (records/BOHEMIA_ECONOMY_A_JOB_PAYS_FOR_THE_TIME_AND_THE_RISK_11_2_26.md; the numbers read from
records/target/bb/job_pay.json by the bake, never typed): hours = blocks there (and back when the talk comes back to the
giver) x 8.5 minutes a block; a talk pays hours x 1.375 x 1.5 = 2.06 a map hour, never under 10; a fight pays hours x 2.75 +
26 a skull, never under 30 a skull, in its win (a loss pays nothing). A poor block pays some of it in what it has: food (a
man's night is about 2 batteries), a man who joins. Every ending carries fx.pay_why (the hours, the rate, what it paid). The
quiet ones all land on the floor (10) because they are short walks; that is the rule, not a shortcut.

## 3. THE FIFTEEN ROAD EVENTS (records/target/BOHEMIA_ROAD_EVENTS.json, +16 rows; 45 in all)
Never in the first minute (the director's own gate, THE SECOND VOTES); every one can be passed by (a WALK ON choice); the
townsfolk a little Spanglish, the player's choices plain English.

THE NEWEST THINGS (11):
- EL VAQUERO (the WHIP): a rancher from Moapa sells his abuelo's rodeo bullwhip, 60 (the market's 98), or for 4 nights of food.
- A KID WITH A CUE (the POOL POLE SPEAR): outside the dead Golden Cue, 12 (the market's 17), or make one with him, 90 min.
- CHISPA (THE CELL VEST'S HIRE): nobody hires the thin man in the vest of cells; hire him (12) and he joins WEARING IT
  (gear.acc cell_vest_scrap, COMBAT's own vest: the fight dresses him from his row); or feed him and send him home. The
  words never say what COMBAT's law says they never say.
- A CARAVANS DRIVER (THE CARAVANS' DELIVERY): met only while a caravan party is within 16 blocks on the map; its faction and
  where it is going are in her mouth. Push the truck 2 h (+18, they like you), take the medicine (a fight), or leave them.
- EL FLACO RUIZ (THE DELIVERY, ROBBED): flat in the creosote while a caravan is within 12 blocks: join the robbery (a fight,
  34), warn the convoy (+12, they like you), or see nothing. Warn them and RUIZ COMES BACK a day later for what it cost him.
- THE STONE MAN (THE PASS ROAD): a cairn at the top of the pass, one stone a car that did not make it. Leave a battery, or
  take the pile (a chance: the coyotes under the pass).
- LA CHOFER (THE PASS ROAD): a school bus of 32 going over to Pahrump for well water, brakes cooked on the grade. Lend a man
  2 h (+12, +2 food), sell them food, or leave them.
- A MAN WITH A RADIO (THE PASS ROAD): the Anarchists' rock tax on the pass. Pay 5, dig the slide 2 h, or cut the rope (a fight).
- DOÑA LUPE (A RAIDED TOWN): met only while a crew walks home from somebody's ground; she names the raided town and the crew.
  Food for the road, or GO AFTER THE CREW (a fight at the party's own size, 28 and the town likes you).
- A KID WITH A TV (A RAIDED TOWN): the doors are open; loot what is left (2 h, +14, +2 food, the town likes you less).

FIVE MORE, the economy is the story and every one a little analog horror:
- A MAN WITH A WALKMAN: cassettes taped to fences, one voice reading the price of eggs, higher every week, next week's date.
- A MOTHER UNDER A SIGN: a dead buffet billboard on a dying cell, BUFFET 9.99; her boy watches it for the food.
- A MAN WITH A LEDGER: one of your men signed for a Mob loan before he joined; a debt does not care who you work for now.
- PADRE ANSELMO: a hand bell at 3 in the morning for the ones who died alone after the money went.
- THE WATER MAN: Lake Mead's third intake, boiled twice, 3 a jug (food and water are one count); the lake is real (the first
  straw went dry, the third is the last).

## 4. HOW (slices/bohemia_road_events.js: a small reading layer; every word in the data files)
- WHERE 'pass': a block of a mountain pass road (RUN's region joins mark it passRoad).
- NEEDS party / raided / boss_sign: the map's own roaming parties (partiesAll; a crew that has ARRIVED is walking home from a
  raid, its 'toward' is the raided town), and WORLD TWO's his map (state().boss.sign, read only, never written).
- The words carry {party} {toward} {raided} {raider} {boss} {town}, filled from what the map says ({word|fallback}); a mood's
  'faction:{party}' becomes that faction's town. A chain remembers what the map said when you chose (the convoy's faction).
- A man who joins can come wearing gear (man.gear). A side quest's second person can wait AT a boss's sign, by a raided town's
  gate, or on a party's road (places.near). A side quest's ending can be a fight through the one door (its blood in the pay).
  A side quest can be met by a search in a town's lot (meet.on 'scavenge': the settlement's own 'scavenge' message, then the
  first block out of town).
- ART (rule 337, NO MORE CONTENT WITHOUT ITS ASSETS): no new thing to draw. Every person wears one of PORTRAIT's heads,
  talking on the mouth card that exists; the whip and the pool pole spear are ARMORY's rows already in the game (COOK WEAPONS,
  ask line 344, is drawing their models now); the cell vest is COMBAT's.

## 5. PROOF, ON THE REAL DEMO AT PHONE SIZE (390 x 844 touch)

### THE FIVE-DAY DRIVE (tools/bohemia_content_drive.js --days 5; the run: records/CONTENT_THE_FIVE_DAY_DRIVE_11_3_26.json)
The real director, its real gap and chance, nothing forced; every card answered by a real tap (the first choice he can pay for).
- **5 in-game days** (day 1 06:00 to day 6), **0 thrown** (page, map frame, driver), **0 taps that did not take** (the drive
  now measures a card that stays up after a tap and names what covers it: none did).
- **33 met on the road: 23 road events + 10 side-quest givers**, 98 cards in all (every talk node is a card with a face).
- **New road events met on their own: 7 of 16**: the kid with the TV (A RAIDED TOWN: 'The Remnants already took the good
  stuff') and Doña Lupe (the Caravans' crew walking home from the Cartel's town; the map's own parties named in their mouths),
  El Flaco Ruiz (THE DELIVERY: 'That's the Network convoy coming, to Mob', a caravan within 12 blocks; the robbery taken, the
  convoy's guards fought and beaten, +34), CHISPA (THE CELL VEST'S HIRE: hired, joined wearing
  gear.acc cell_vest_scrap), the pool hall kid (THE POOL POLE SPEAR, into the bag), the egg tape, the three o'clock bell.
- **Side quests: 10 met, 10 finished**, 7 of them new: THE FIRST HARVEST (met while THE POT's flyer was up; the store room at
  the flyer; +10, +2 food), THE METER READER (+10), THE COUNT (+5 food, the Volunteers like you more), THE ELDER'S ACCIDENT
  (+10), SIXTY SECONDS OF RAIN (+10, the Homeless like you more), THE FACTION THAT DIED (met while the Caravans' crew walked home
  from the Cartel's town; ONE OF THE FORTY joined, +5, the Cartel likes you less), THE TWO FAMILIES (+10); and three of last round's.
- 3 road fights won and paid, the 2 new job kinds taken and paid (15 of 15, 60 of 60), crew 3 to 7, purse 290 to 340, food 21
  to 8 (five days of nights eaten).
- NOT MET IN FIVE DAYS (they are dice and the map, and the record says so): the three pass-road events (the drive walked onto
  I-15 N's pass once, on day 3, and the 6% a block did not land there), the rodeo man, the caravan driver, the robber's
  payoff (the drive robbed the convoy, so the warn-the-convoy chain never set), the buffet sign, the ledger man, the water man;
  THE DRY TAPS (THE TAP's tag only stands after THE POT is found, and the drive never reads his flyer), THE KILLING SUMMER.
- The probe before the drive fired five of the new events by hand on the demo: every card filled from the map (the party, the
  raided town), every chip right (-60 BAT +GEAR, +1 MAN, A FIGHT, A CHANCE), CHISPA in the hired list with his vest.

### THE SCAVENGE MEET (records/CONTENT_THE_SCAVENGE_MEET_11_3_26.json)
The nearest town's own screen opened through the map's door (loopOpenTown); the search's message sent from INSIDE the town's
frame, the very one its 'Search the lot' button posts (the town screen's code is one sealed closure and its lot is a spot on
the picture, so a script cannot press it; a finger can). Then out of town, one walk: **DOÑA MERCEDES stopped the party on the
first block out ('You look like you can walk into a bad place and walk back out')**, the cloth, THE EAST RUINS marked 14 blocks
out and walked to, THE WARDEN's three cards, MERCEDES' DOOR marked and walked back to, the knock: **COMPLETE, +10, Colorful
likes you more**, 0 page errors.

### THE CHECKS THIS CHANGE TOUCHES
- the_boards_always_have_work_gate: **24 passed, 0 failed**.
- the_boards_quests_are_people_gate 16/16; quests_library_gate 492/0; quest_study_gate 642/0; attempt_gate 15/0.
- bosses_act_one_gate (the bosses' lead-ups use the same mouth card): **54 passed, 1 failed** with this change (A5f, THE FILTER's
  phone button read TURN THE WATER ON); **main without this change: 54 passed, 1 failed** too (A5i, THE FILTER's map mark). Both
  reds are THE FILTER's verb and mark after his kill (BOSSES FIX, rule 338, landed while this round ran), a different check each
  run: BOSSES' timing, not this lane's (the road's director never runs under the gate's automation).
- After the drive, three of the raid rows' words read better as 'the {raided} town' (the map names a town by its faction:
  'came into Cartel' read wrong on the drive's own card); the fill's fallback for it is 'nearest'.
- Own check of the 16 new rows: no Spanish word in a player's choice, no em dash, the vest's words never say what COMBAT's law
  bans, two or three choices each, every one can be passed by (two rows got a pass-by choice after this check: the robber's
  payoff and the ledger man; the drive had loaded the rows before that edit).
- The first drive (killed) ran beside the board gate on one box and its taps on the road card did not take; alone, every tap
  took (probe: the card's button is what stands under the finger). The drive's new cover check stays in it so a real cover
  can never hide again.
