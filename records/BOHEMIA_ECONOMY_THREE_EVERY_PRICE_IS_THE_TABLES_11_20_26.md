# EVERY PRICE IS THE TABLE'S, AND WHAT A JOB PAYS IN THINGS HE CAN HOLD (ECONOMY THREE, 11/20/26; VAMILY rules 459, 461, 441; ask row 645)

HIS WORDS. 11/17: 'some of the quests, it's like 3000 or like 1000 batteries to complete a quest and I'm like bro that's a lot...
I want people to really feel like they can look at their battery right now and relate it from the game to real life.'
11/20 (rule 461): 'Lets do a full sweep whole enchilada dont forget nothing.'
THE JOB THIS ROUND (the coordinator's wake, rule 461): find every price or pay in the game that does not come from the one table
(records/target/bb/battery_table.json) and bring it in; write what each kind of job pays against things he can hold; do not cut
the top pay unless the research says so.
BUILT ON: ECONOMY TWO's BUILD 11/18t (records/BOHEMIA_ECONOMY_TWO_EVERY_NUMBER_OF_BATTERIES_11_18_26.md), seen on the phone by EYES
11/20 (records/BOHEMIA_EYES_THE_WHOLE_ENCHILADA_11_20_26.md, row 645 SEEN). The research: records/BOHEMIA_RESEARCH_HOW_MANY_BATTERIES_ARE_IN_THE_UNITED_STATES_11_17_26.md.

## 1. HOW THE SWEEP WAS DONE (not from the table's own list: from what the game really loads)

- WHAT THE DEMO LOADS, MEASURED: a driven phone (390 x 844, touch) through the title, the map, the Mob's town and every building,
  a fight off the road: 331 files, of them 101 scripts and 103 data files outside the picture folders.
- WHERE THE MONEY MOVES: every battery in or out goes through two calls, the purse's credit and debit (32 places in live code).
  Each was traced to where its number comes from: an origin's start, the night's bill, a job's pay, the town's settle, the pit's
  purse, the bosses, the road, the side quests, his place's keep and panels, the loot: every one reads a data file the table holds.
  Three do not touch the player's purse or are dead: a faction's own power plant (the world's money, not his), the lend card and
  the walked city's market (hidden in the demo since the walk died, 9/28).
- THE TABLE'S OWN SWEEP HAD TWO HOLES, both measured:
  1. IT READ 41 NAMED SCRIPTS; THE PAGES LOAD 101 (114 with the five pages and the hand list). A lane's new script was never swept.
  2. IN CODE IT SAW ONLY WORDS ('N batteries', a purse line, a 'bats:' field). A price typed as a FIELD ('pay:1', 'wage: 10',
     'amount: 2') was invisible to it.

## 2. WHAT WAS NOT FROM THE TABLE, AND WHERE EACH NOW LIVES (45 new typed copies held; 167 in all, was 122)

Every one was measured against its home first. NOTHING WAS WRONG: every typed number already said what its data file says.
So no number moved and nothing he plays changed; what changed is that each one now moves WITH the table (`stamp` writes it), and
the gate goes red the day one drifts.

| what | where it was typed | its home now | how many |
|---|---|---|---|
| each origin's bonus on every job (the water truck, the raiders, the debt collectors, the fight pit: one AA) | the start screen's offline copy (slices/BOHEMIA_ALPHA_0_9.html) | origins.json pay, a row of the table | 15 |
| the six at the hire post: the trade's wage a day | engine/bohemia_goodbros.js | backgrounds.json daily_wage (the catalog, ten crowns to one AA) | 6 |
| the six at the hire post: the Game Guide's hire range (crowns; it only places a man inside the hall's range) | engine/bohemia_goodbros.js | the table (the file holds it only as a sentence) | 12 |
| the clinic: the treatment multiplier, a fifth more a level | the town and the crew screen | injuries.json (the wiki's own formula) | 3 |
| the hall: a rare man's base when his file has none, the kit multiplier before the price file lands | the town | price_table.json wageAndHire | 2 |
| a build paid into his place: its worth, an AA a roll of tape (before the file lands) | the town | job_into_place.json, a row | 2 |
| a weapon off the road whose row is gone: 3 AA | slices/bohemia_road_events.js | the table | 1 |
| the roster's wage for a trade the file does not know: ten crowns a day | engine/bohemia_roster.js | the table | 1 |
| a rescue (getting your own men back) pays nothing | the map | the table | 1 |
| an ambition kept pays two AA (the walked city's company goals; its trigger needs a man walking beside you, dead with the walk) | the map and engine/bohemia_ambitions.js | the table | 2 |

NOT MONEY, named so the sweep never asks again (the table's `code_not_money`): the walked road's two choices are paid in SALVAGE
(pay:1 and pay:2 go to 'resources'); a running total that starts at 0; a modder's origin that is empty until the file fills it.
NOT A PRICE, NAMED FOR ITS OWNER: the live wire's 'a cell a lash' is never charged (nothing counts a burned cell since ARMORY's own
note: 'reads 0, nothing counts a cell any more'); the fight's end still carries the line. ARMORY's, if he wants the whip to cost.

THE TOOL NOW (tools/bohemia_economy_two_the_battery_table.js): it sweeps every script the five live pages load (`live_pages`, read
fresh, never baked), and a money field typed in code ('pay', 'price', 'wage', 'daily_wage', 'amount', 'purse', 'reward', 'hireMin',
'hireMax', 'base_crowns'). A copy that points at a catalog (`leaf`) may carry `times` (a copy already turned by the rule).
THE GATE (gates/the_battery_is_real_gate.js) plants two more faults, each red by its own words: the door's job bonus with its
copies taken out; the post's wages with the script taken off every list (the page sweep still finds it).
PROVED: `stamp` moved a row (the water truck's bonus 1 to 2) into origins.json AND the start screen's typed copy, and a held range
(409 to 410) into the post's script, in one command; put back; `check` green.

## 3. WHAT A JOB PAYS, IN THINGS HE CAN HOLD (the plain table for him and the handoff)

THE THINGS (the research): an AA is a bag of rice. A PHONE CHARGE is about 6 AA. A TOOL PACK (a drill battery) is 20. A CAR
BATTERY is 250. The glass draws every sum as these (ECONOMY TWO's drawing): 310 is a car battery and three tool packs.
WHAT A CREW EATS: a man's night is 2 AA fed (a can and a bottle), 3 to 11 fed and paid. Three men on day one eat one phone charge
a night; twelve veterans eat about five tool packs a night.

102 jobs on the boards, in four families (job_pay.json, each job's base; DAY ONE is the start screen's FULL SHELVES, the pick the
door opens on, x1.5; THE TOP is CLOUT at its most, x4.5, in a town that calls him family, x1.15):

| the family | the jobs | day one, usual (the range) | at the top, usual (the most) |
|---|---|---|---|
| ERRANDS: carry a thing, find a person or a place, scout, a message, a signal, look into something | 18 | 32 AA, about 5 phone charges (15 to 94) | 163 AA, 8 tool packs (to 489, about 2 car batteries) |
| GET IT BACK, GUARD THE ROAD: bring a thing back, ride with a truck, collect a debt | 28 | 60 AA, 3 tool packs (15 to 374) | 310 AA, a car battery and 3 tool packs (to 1,933, about 8 car batteries: the big caravan) |
| A FIGHT: run a crew off, burn a place, free someone, an ambush, a bounty, a patrol, clear a camp | 31 | 110 AA, about 5 tool packs (45 to 180) | 567 AA, about 2 car batteries (to 931, almost 4) |
| THE BIG ONES: hunt a beast, root them out, hold a place, the night watch, a siege | 25 | 176 AA, about 9 tool packs (64 to 376) | 908 AA, about 3 and a half car batteries (to 1,948, almost 8) |

THE MOST ONE JOB EVER PAYS: the hold-the-place job at 251 base, at the top of CLOUT, in a family town, the pay pushed twice at the
card: 2,236 AA = 8 CAR BATTERIES, 11 TOOL PACKS, 16 AA. That is his '1,000 or 3,000'. A car's lead-acid battery is commonly about 18 kg
(40 lb; not in the research record, which weighs only AA's: 1,000 of them about 27 kg), so that is a cart's load, about 160 kg:
something a crew of twelve carries home. The same 2,236 as loose AA's would be about 60 kg of cells nobody could count on a hood. KEPT, NOT CUT: the research does not say cut it (a crew can
carry it, and the late game's keep grows as fast: twelve veterans burn about five tool packs a night). He can say cut it.

THE OTHER PAY HE MEETS: a stop on the road gives or takes 1 to 60 (at most 3 tool packs); a side quest's end to 34; the pit's
purse 35 to 150 a night; a boss's verb 6, 8 or 12 a time, THE POT's till to 30; a champion's head to the bounty hunter 30 to 75; a
place found for the cartographer 10 to 40; a beaten man had 1 AA in his pocket half the time.

## 4. PROOF (rule 441; VAMILY rule 13)

- THE TABLE: `node tools/bohemia_economy_two_the_battery_table.js check`: every number is the table's (669 numbers in 18 data
  files, 167 typed copies, 17 sentences; 114 live scripts, 82 live data files swept).
- GATE THE BATTERY IS REAL, the table half: 7/0, T3 with ten planted faults each red by its own words.
- THE PAGE: nothing he plays changed (no number moved, no page edited); the gate's walk on the demo upright is in the commit's
  proof line.
- Pre-push pass: the gates that read the files in this diff are this lane's own gate (the only gate that reads the table's tools).

## 5. THE SECOND SHIP: THE CREW SCREEN AND THE FIGHT, WALKED (ECONOMY TWO's NOT DONE; rule 441)

Walked on the demo, a phone upright, the way he plays: the crew screen by the one CREW and a real tap on a man; a road fight off a
town and the spoils after it. What the walk found, all fixed in this ship:
1. THE SPOILS SCREEN (after every fight won) NEVER LOADED THE DRAWING. Its bar showed the purse with the old pile of cells (the
   map and the fight drew the same 290 as a car battery and two tool packs one screen before), the batteries off their bodies
   wore the old mark, and what a town pays for a looted piece wore the old icon. Now the page loads the drawing: the bar, the
   count ('+2' as the AA picture) and the price on the strip (a chain: 4 AA) are drawn; the receipt keeps its printed words
   (a till prints characters: data-bsum-raw). The drawing already carried the count's rule; only the page was never named.
2. THE PHONE'S CREW FACE LOST A MAN'S NIGHT, SINCE 11/18t (this lane's own build). The phone reads the picked man's line off the
   crew screen, but only its FIRST piece of text; the drawing turns '2 BATTERIES' into its pictures, which split the line, so
   the phone said 'OLD FRIEND LEVEL 2' and his night was gone. Now the phone reads the line whole and sets his night as one
   piece on its own line (the AA picture, '2 A NIGHT'), its picture sized to the phone's 8-point line (at the drawing's 13
   points the line grew and 'A NIGHT' was cut under the XP bar: seen, then fixed).
3. THE PHONE'S 'HIS PLACE' CARD wrote the night's bill as '-3 BATT', which the drawing cannot read; it says '-3 batteries' now
   and is drawn like every other sum.
4. TWO PLAY PAGES THE TABLE NEVER NAMED (the spoils, the scavenge game) are swept now: 119 scripts.
5. A SHOP BUYS A PIECE BACK FOR ONE SEVENTH OF ITS WORTH: typed twice (the town, the spoils engine), named only in a sentence. It
   is a number in the table now (ratios.shop_pays_back.one_in = 7) and both copies are held (169 copies).
6. THE GATE'S OWN TWO HOLES: its 'leave the town' step was handed the drive instead of the page and never left a town (silently:
   the walk opened the town again over itself); and a purse moved by the gate's shortcut never repainted the bar (the bar
   repaints when the game's own flows say so: measured, the map's bar kept 290 for 5 s after the purse went to 500). The gate
   now leaves through the town's own way out and repaints the bar as the game's settle does.
NOT FOUND: on the scavenge game a find is one word (BATTERY), never a sum: nothing to draw.

GATE THE BATTERY IS REAL now walks C1 (the crew screen: his second man's night drawn where it shows, 'A NIGHT' whole, nothing
cut), S1 (the spoils: the bar draws the purse the map's bar shows, the batteries off their bodies, the receipt in words) and S2
(a real tap on a piece: what a town pays for it), first, on a fresh game. The fight is WON BY THE GATE (every man of theirs set
down): the one shortcut, said. L1 now waits for the bar's own count-down to land (a big change counts on the beat, by design).
FOUND ON THE ALPHA, NOT THIS LANE'S: the alpha's new game opens either inside a town (the phone on its town face) or on the walked
city the alpha keeps by rule (STANDING, BUILD HERE, SCAVENGE 8H, BIKE, SLEEP, the pad: no phone, no CREW); leaving its first town
lands there too. RUN's, if the alpha should open like the demo. The legs open the Mob's town by the walk's own travel shortcut
when no CREW is on the glass.

PROOF: GATE THE BATTERY IS REAL 55/0 (the table 7/0 with ten plants; the demo and the alpha, upright and sideways, 12 legs each).
Neighbours on this tree: OPTIMIZE LOOT 22/0, SCRAP IS TAPE 11/0. THE RECEIPT IS THE END SCREEN 8/1, R3 ('a tap unrolls it')
red the same with this build's three page files put back to main's: not this build's.

[bb Battle Brothers prices a contract in crowns that run to thousands and nobody asks what a crown weighs; ours weighs 18 kg a car battery]
[analog horror: the board's clerk reading the pay off a card and then looking at the size of your truck]
