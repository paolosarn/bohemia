# QR-AR: TEN CONTRACTS SHAPED FOR THE REGION MAP'S DISTANCES. WHAT A JOB IS WHEN THE PLACE IS A DAY AWAY

The map just grew from one valley you cross in an hour to the whole Las Vegas region you cross in days (rule 109, Paolo 10/16: "our map has to be as big as Battle Brothers... I'm choosing Battle Brothers"). Every contract we designed before this sat inside the valley, where the farthest job was 28 hours out and most were under a day. This page reads the library, the Battle Brothers reference and the map's own travel numbers, and writes the rule for a contract whose target is half a day, a day, or two days away, then puts ten of them on the shelf, one per road out of the city.

QUESTION: the QUESTS big swing (rule 110, 10/16): a shelf of ten contracts shaped for the region map's distances, cited.

STATUS: draft:true, research only, nothing built (rule 35, laws/BOHEMIA_ADDENDUM_QUESTS_IS_RESEARCH_ONLY_9_27_26.md). Every name and line is an attempt and Paolo's to change. Every number is a SHAPE; TUNING owns the value (rule 36). The travel numbers are RUN's cost model read off its file, not a measurement on the phone; EYES [the map's four numbers] measures.

SOURCES: the library by id (records/BOHEMIA_QUESTBOOK_LAW_INDEX.json, 5,413 ids over 236 studies); records/BOHEMIA_THE_REGION_RUN_10_16_26.md (RUN's round one: two grids, twelve places, the four numbers); slices/bohemia_region.js (the twelve places' bearings and the step costs) and the map's cityStepMins (0.084 minutes a cell times 128 cells a block); reference/library/battle_brothers/01_WORLDMAP.md and 08_CONTRACTS_EVENTS.md (recall, marked [R]); Grok ask 20 (GROK_99, the wiki's terrain speeds, unverified) and the wiki dump reference/library/grok/wiki/CORE_WIKITEXT.md (the named-item-by-distance formula, the port price by distance, one contract at a time); QR-AF (the kinds), QR-C (the twists), QR-AE (pairs on a road), QR-AG (the road events), QR-AH (the rumour), QR-O (the fourteen bases), QR-G (the checklist); VAMILY rules 33, 36, 42, 46, 47, 51, 102, 109.

SOURCE HONESTY. Battle Brothers' days-to-cross was measured by EYES the hour this page was written (2 to 4 in-game days, players' reports, no official figure; records/BOHEMIA_EYES_THE_MAPS_FOUR_NUMBERS_OURS_BESIDE_BATTLE_BROTHERS_10_17_26.md) and the page carries EYES' number, not a recall. The zoom stops in their tiles are still nobody's number (Grok ask 26). The wiki dump holds no line that says contract pay rises with distance; it says pay rises with renown. What it does say about distance: a far location is likelier to hold a named item (the formula is on the page), and a port passage is priced by distance. Both are cited where used.

[bb the region's contracts] research line: Battle Brothers' contracts send you to a target on the map and the travel is the cost: wages every day, food every day, a night that slows you, a twist on the way [R] (01_WORLDMAP TIME AND COST; `Q236.W10`, `Q236.X4`). Its map is about 140 tiles across and ours is now 496 with the valley as the dense middle (RUN's four numbers). This page is what a contract becomes when the road is longer than the fight.

---

## THE ANSWER IN ONE PARAGRAPH

A far contract is a contract whose road is the job. The library's best long trips never pretend the walk is free: duration is an instrument (`Q001.W6`), time is the only fee a camp charges (`Q146.W8`), failure costs you time and the walk back (`Q087.W2`), and the world keeps living while you are out (`Q085.W1`, `Q044.W7`). Its worst long trips are the errand tour: across the map and back for a line of text (`Q084.X2`, `Q083.P10`, `Q051.X3`, `Q113.X1`). So for Bohemia a far job is ONE destination on ONE road out of the city, with the days said aloud before the yes, the pay carrying the road (every man eats two a day and drinks, rule 47, and the wage runs; `Q236.W10`), the night on the road allowed one event at most (QR-AG), the second slot (rule 51) pairing on the same corridor so one trip does two things (`Q062.W8`, QR-AE), the target allowed to move a block a day and leave tracks (01_WORLDMAP TRACKS [R]; `Q054.W8`), the offer never expiring before a party can reach it (`Q095.X1`, `Q128.X2`), and the far place changed when you come back through it (`Q236.W8`, `Q187.W1`, `Q024.W10`). The danger of a far job is the road, not the fight: skulls rise with days, not with heads. The ten designs below sit on the seven roads out: Henderson and the dam to the southeast, the lake, I-15 south to Jean and Primm, US-95 south to Searchlight, US-95 north to Indian Springs and the mountain, NV-160 west to Pahrump, I-15 north to Moapa and Mesquite. The arithmetic also found one thing for TUNING and RUN: at the map's current pace a party walks about 107 km a day because the clock never stops it at night, two and a half times what people walk; a far place is 0.8 days away on the clock and would be two days away on foot. The page shapes the contracts to DAYS so the shelf holds whichever number TUNING picks.

---

## 1. THE MAP'S DISTANCES, READ OFF THE FILE (the ground this shelf stands on)

RUN's round one (records/BOHEMIA_THE_REGION_RUN_10_16_26.md) kept the valley's 96 by 96 street grid and put a 496 by 496 region grid around it, read off the land painter: open ground, a road out, rough (hills), impassable (the lake, a peak). Twelve real places sit on it by their real bearing from the city.

The step costs (slices/bohemia_region.js and cityStepMins): a block of open ground costs the street's own rough-going time, 0.084 minutes a cell times 128 cells, about 10.75 minutes; a road block half that, about 5.4 minutes (PAVED_SPEED factor 0.5); a hills block 1.8 times, about 19.4 minutes. So in one clock day a party covers about 268 road blocks, 134 open blocks or 74 hills blocks. RUN's own check prints the crossing: 1.9 days rim to rim on a road, 3.7 over open ground.

THE TWELVE PLACES, straight-line blocks from the city's middle (the file's east and north offsets, the larger of the two), and the hours at each going. The real route winds and leaves the valley by its roads, so the routed figures run longer than these. EYES measured four of them by the real route this hour (records/BOHEMIA_EYES_THE_MAPS_FOUR_NUMBERS_OURS_BESIDE_BATTLE_BROTHERS_10_17_26.md): Mesquite 1.95 days, Searchlight 1.16, Pahrump 0.93, Primm 0.83. So the straight-line hours below are the floor and the route adds up to a day on the far band; the designs say DAYS and quote EYES' routed number where it exists.

| place | tier (file) | blocks out | by road | over open ground | over hills | band | road out of the city |
|---|---|---|---|---|---|---|---|
| HENDERSON | town | 78 | 7.0 h | 14.0 h | | NEAR | I-515 / US-93 southeast |
| BOULDER CITY | town | 128 | 11.5 h | 22.9 h | | HALF A DAY | US-93 southeast |
| HOOVER DAM | fortress | 178 | 16.0 h | 31.9 h | | A DAY | US-93 past Boulder City |
| LAKE MEAD MARINA | camp | 150 | 13.4 h | 26.9 h | (shore: BB walks shore at half pace, GROK_99) | HALF A DAY | the lake road east |
| JEAN | camp | 150 | 13.4 h | 26.9 h | | HALF A DAY | I-15 south |
| PRIMM | town | 215 | 19.3 h | 38.5 h | | A DAY | I-15 south, the state line |
| SEARCHLIGHT | camp | 228 | 20.4 h | 40.9 h | | A DAY | US-95 south |
| INDIAN SPRINGS | fortress | 150 | 13.4 h | 26.9 h | | HALF A DAY | US-95 north |
| MT CHARLESTON LODGE | camp | 130 | 11.7 h | | 41.9 h | A DAY (the hills) | Kyle Canyon off US-95 |
| PAHRUMP | town | 222 | 19.9 h | 39.8 h | 71.6 h over the pass | A DAY OR TWO | NV-160 west over the Spring Mountains |
| MOAPA | camp | 170 | 15.2 h | 30.5 h | | HALF A DAY TO A DAY | I-15 north |
| MESQUITE | town | 218 | 19.5 h | 39.1 h | | A DAY | I-15 north, the far end |

Three bands fall out, and the shelf uses them: NEAR (under half a day one way: there and back inside a day, no night), HALF A DAY (one night out, there and back in two days), A DAY OR MORE (two nights out at least, three to four days on the clock, and the first place where the road is the whole job).

THE ARITHMETIC NOBODY HAD DONE (for TUNING and RUN, not decided here). The real places are 26 km (Henderson) to 130 km (Mesquite) from downtown Las Vegas, so one block is about 0.4 km. At 268 road blocks a clock day the party walks about 107 km a day. People walk 4 to 5 km an hour for 8 to 10 hours: 35 to 45 km a day. The map's clock does not stop the party at night and nobody sleeps. Battle Brothers' answer [R] is that night travel is slower and sight shorter, and the company can camp. Three honest options, TUNING's and RUN's call: (a) the party camps at night by itself and a clock day is a walking day, which makes Mesquite two days out, Battle Brothers' feel; (b) the step costs double and the map keeps walking at night; (c) the numbers stand and a "day" on the offer screen means a clock day. This shelf writes DAYS, so it survives all three. What it does not survive is a map where a far place is a tap away, which rule 109 forbids.

BATTLE BROTHERS' OWN CROSSING, measured by EYES the same hour this page was written (records/BOHEMIA_EYES_THE_MAPS_FOUR_NUMBERS_OURS_BESIDE_BATTLE_BROTHERS_10_17_26.md): 2 TO 4 IN-GAME DAYS edge to edge, from players' reports, no official figure. Against our 1.9 days rim to rim on a road, EYES calls the days row half met: by the count our region is 3.5 times their width, but a block is crossed in 10.75 minutes and one of their tiles in about 20 to 40, so in walking time our 496 blocks are worth about 125 to 250 of their tiles, about their map, not three and a half of it. The number a player feels is days. The camp-at-night option (a) above doubles our days without changing a pixel and is the one that meets rule 109c's bare minimum outright; the shelf's bands hold either way.

## 2. WHAT THE LIBRARY SAYS ABOUT A JOB THAT IS FAR AWAY

### 2.1 Duration is an instrument, so the far job must feel the days
The Baron's botchling carry is slow on purpose so grief is felt through time and distance (`Q001.W6`, `Q001.P6`). A deadline makes a reunion land (`Q011.W5`, `Q128.W10`). The camp that charges calendar makes the world's other lives visibly spend theirs meanwhile (`Q146.W8`). Outward's whole thesis: failure costs time, the walk back included (`Q087.W2`). For us: the far contract SHOWS the days passing (the clock on the HUD, the food count dropping, the night falling on the map, rule 33) and the hand-in says how long you were gone.

### 2.2 The errand tour is the library's most repeated flaw, six teardowns running
Escort missions across the whole map and a capital full of errands (`Q084.X2`); the fetch-chain middle in Ranni (`Q071.X3`), Morrowind (`Q074.X1`), Come Fly With Me (`Q079.P6` is the redemption), the Ton (`Q083.P10`), Outward's early quests with a poor map (`Q087.X4`), the wetsuit chain (`Q095.X2`); backtracking tedium with no fast travel (`Q051.X3`); the quest log tired of you (`Q109.W7`); go all over town, same place twice (`Q113.X1`). The law the corpus wrote itself: connective tissue must carry weight. For us: ONE destination per far job, never a chain of stops; the trip has a reason beyond the fee (a rumour, a face, a thing only out there); and the way back is never empty, which is what the pair (rule 51) and the return-leg hand-in are for.

### 2.3 The clock must be generous and said aloud
Hard clocks alienate (`Q038.X1`, `Q026.X1`); a soft clock focuses without tyranny (`Q018.W8`); a timer long enough to be invisible is a timer that does nothing (`Q119.X3`); a quest that fails silently is lost without the player learning it (`Q128.X2`, `Q095.X1`); a clock that is the only reason you cannot do both reads as a gimmick (`Q226.X3`); a fire that forces the either-or works because the cost is specific (`Q178.W3`). Missable by clock with no UI emphasis is a flaw we do not copy (`Q106.N1`). For us: every offer prints the days THERE, the days BACK and the days the client WAITS; a deadline is only ever a HOLD appointment or a perishable cargo, said in the client's own mouth; the board never offers what a party cannot reach before it expires.

### 2.4 Supplies are the road's price, and the price must be felt but survivable
The body as a second clock (`Q021.W4`); fuel and terror as the real resources (`Q066.W1`, `Q066.P2`); the oxygen halfway rule, every metre down costs two (`Q090.P4`); scarcity weaponises compassion (`Q031.W3`); the back half loses tension when upkeep stops mattering (`Q065.X1`); half-built survival systems feel vestigial (`Q055.X5`); the wage treadmill is why every Battle Brothers offer is weighed (`Q236.W10`) and the crunch that forces the yes is its flaw (`Q236.X4`). For us: a far job's pay carries the road (section 4, rule 2); WATER is the desert's cost first (rule 47's sixth resource; a person in the Mojave in summer needs four litres a day, which is why the marina, the dam and the pump camps are the places the roads lead to); and no far job may be the only way to eat, which rule 51's second slot and the settlement's own trade guarantee.

### 2.5 The world moves while you are out, and the far place remembers
A-Life: the world exists and thrives without the player (`Q085.W1`), and camps at night to eat, joke and play music (`Q085.W2`); the storyteller sends relief after a hard hit (`Q044.W7`); Outward executes the clock: ignore the warning and come back to a sacked town (`Q087.P5`); the Hillock choice detonates hours later and miles away (`Q187.W1`), and its stakes were under-signalled, a gotcha (`Q187.X1`); the finished job is the base's new situation (`Q236.W8`, `Q236.P4`); surface the consequence (`Q024.W10`). For us: the far place's board, prices and faces change by what you did, and you see it the next time you pass; something at home may have moved while you were three days out, but it is signalled before you leave (a client's line, a feed post) so the return is never a gotcha.

### 2.6 Tracks, scouting and the moving target
Battle Brothers: every party leaves prints by kind, fading with time; parties within sight are named by size; sight shrinks at night and in forest [R] (01_WORLDMAP TRACKS, SCOUTING); the wiki's terrain speeds (plains 1, desert 0.75, hills 0.65, shore 0.5, mountains 0.25) and sight (hills 1.25, mountains 2) (GROK_99, unverified). The library: murderers hide tracks, so signal against noise is the skill (`Q054.W8`); the clue is misread once and looking again pays (`Q148.W3`); the beast moves and must never expire silently (QR-AE rule, `Q095.X1`). For us: a HUNT or FIND target on the region moves a block a day along its own logic (water, shade, prey), leaves a print the party reads inside its sight radius (rule 102d), and the far job's skill is reading the land, not a marker.

### 2.7 Far means rarer, and that is the lure
The wiki's own formula: the chance of a named item at a location rises with its distance from the nearest settlement (CORE_WIKITEXT, "(Resources + 4 x Distance) / 5 - 37"); ports are priced by distance. The rumour at the bar (QR-AH) already points at far places. For us: the far band's hand-in may carry a thing the valley cannot make (a part, a hide, a map), and the rumour that sent you is true at the far end more often than near (QR-AH's odds by speaker).

### 2.8 One trip, two things: the pair on a corridor
The detour was the answer (`Q062.W8`); quests interlock (`Q015.W4`, `Q019.W6`, `Q008.W5`, `Q023.W5`); the quest log soup when you hoard (`Q037.X2`). Rule 51: two slots, "a caravan quest takes you to a city and near that city you can kill something". For us: each of the seven roads out is a CORRIDOR, and the second slot pairs on the same corridor only; the phone's board draws the faint line between two posts that share a corridor (QR-AE's board rule), and a pair saves days, food and water, which is the only pair bonus.

### 2.9 The job's own grammar on the road
The escort that isn't (`Q040.W3`); the hire is dirty before you leave (`Q003.W1`); the first payment precedes the terms (`Q134.W2`); the rescue frame delivers the victim (`Q134.W5`); the man whose ambition is to cross a bridge unbeaten, and he pays you with a thing that marks enemies on the map (`Q114.P5`); the camp as conversation and the siege as the investment defending itself (`Q151.N3`); the timed run through the learned gap into the desert (`Q146.N3`). For us: the twist on a far job lands ON THE ROAD, at the night or at the far end, never at the hand-in back home (a twist you learn three days from the client is a twist you cannot argue), and at most one in four far jobs carries one (QR-C rule 2, `Q236.X2`).

## 3. WHAT BATTLE BROTHERS DOES WITH DISTANCE, AND WHAT WE KEEP [R]

- Contracts name a target on the map; travel passes days; wages and food burn every day; a night on the road is slower and more dangerous [R] (01_WORLDMAP TIME AND COST, NIGHT). KEEP, with the six resources (rule 47).
- One contract at a time (CORE_WIKITEXT, Contracts; `Q236.W2`). WE DOUBLE IT by rule 51, paired on a corridor (QR-AE).
- Pay rises with renown, not with distance, by the wiki's own line. WE ADD the road allowance (section 4, rule 2): a far job pays the days, said as a line on the offer ("and the road: 3 days for 6 mouths").
- Escort contracts walk a caravan at its pace and the march can be lost (QR-AF finding 5). KEEP for HAUL; the caravan's pace is the road allowance's multiplier.
- Named items likelier far from any settlement (CORE_WIKITEXT formula). KEEP as the far band's hand-in lure and QR-AH's rumour odds.
- Terrain speeds and sight (GROK_99, unverified): ours already has road 0.5 and hills 1.8 of open; shore has no cost yet (WORLD [the region] owes the fifteen terrains' costs; the marina design below assumes shore is slow).
- The situation the job leaves behind (`Q236.W1`, `Q236.W8`). KEEP: a far place's situation flips on hand-in and the board shows it when you return.
- Ambitions reward renown that boosts pay (CORE_WIKITEXT, Ambitions). QR-Z holds ours; two designs below advance one.

## 4. THE RULE FOR THE BUILDERS (numbered, testable; draft:true)

1. THE DAYS ARE PRINTED BEFORE THE YES. Every region offer shows THERE (days), BACK (days), WAITS (days the client holds the offer) in the client's own lines, and the phone's board shows the same three numbers (`Q236.W3`, `Q146.W8`, `Q119.X3`). A test: no region offer without the three numbers.
2. THE PAY CARRIES THE ROAD. pay = skull base (QR-AF) + road allowance, where road allowance = party size x days x (2 FOOD + 1 WATER) in kind or its battery price, plus the wage for the days (`Q236.W10`, `Q236.X4`; GROK_64's "a man eats 2 a day"). The allowance is a separate line on the offer, never folded into the fee, so a bigger party is not a worse deal by stealth. TUNING owns every number.
3. EXPIRY NEVER BEATS THE ROAD. An offer's WAITS is at least 2 x THERE + 1 day; a board never shows a job a party cannot reach (`Q095.X1`, `Q128.X2`). Expiring writes nothing (`Q236.P3`).
4. ONE DESTINATION A JOB. A region contract has one far place and no chain of stops (`Q084.X2`, `Q083.P10`, `Q113.X1`). What happens on the road is the road's (QR-AG), not the job's.
5. THE NIGHT GETS ONE EVENT AT MOST. Each night out may stop the party once with a face and two or three priced buttons (QR-AG), never twice, never in the first minute of play (rule 32a); a quiet night is allowed and common (`Q044.W7`'s ebb).
6. THE TARGET MAY MOVE, AND LEAVES A PRINT. A HUNT or FIND target moves at most a block a day on its own logic and leaves tracks readable inside the sight radius (rule 102d; 01_WORLDMAP TRACKS [R]; `Q054.W8`). It never expires silently (`Q095.X1`); the client's line says how long it stays in the area.
7. THE PAIR IS A CORRIDOR. Seven corridors (section 1's last column); the second slot (rule 51) pairs only on the same corridor; the phone draws the faint line; nothing is bundled (QR-AE rule). Declining the second is free (`Q236.W7`).
8. SKULLS COUNT THE ROAD. On the region, skulls rise with days out, nights out and water, not with heads; a one-coyote job two days out is two skulls (`Q090.P4`, `Q066.W1`). The fight itself stays routine 2 to 4 minutes, tough never past 15 (rule 36).
9. WHERE THE PAY LANDS SAYS WHAT THE JOB IS. HAUL and CARRY pay at the far end, by the receiver's mouth; HUNT, CLEAR, RECOVER and FIND pay at home, so the walk back is the second half of the job and the hand-in says how long you were gone (`Q087.W2`, `Q228.W7`).
10. THE FAR PLACE REMEMBERS, AND HOME IS SIGNALLED. Hand-in flips the far place's situation (`Q236.W8`, `Q236.P4`) and the next pass shows it (`Q024.W10`); if home can change while you are out, a mouth says so before you leave (`Q187.X1`'s fix); a sacked home is allowed only after a warning ignored (`Q087.P5`).
11. THE TWIST LANDS ON THE ROAD. A far job's one twist (QR-C) lands at the night or at the far end, never at the home hand-in; at most one in four far jobs carries one (`Q236.X2`).
12. THE FAR END HOLDS WHAT THE VALLEY CANNOT MAKE. A day-band hand-in may carry a part, a hide or a map the valley lacks, and the rumour that sent you is likelier true far out (CORE_WIKITEXT's distance formula; QR-AH).

## 5. WHAT TO AVOID (the flaws, by id)
- The errand tour and the fetch chain: `Q084.X2`, `Q083.P10`, `Q071.X3`, `Q074.X1`, `Q087.X4`, `Q095.X2`, `Q113.X1`, `Q051.X3`.
- The hard or hidden clock: `Q038.X1`, `Q026.X1`, `Q106.N1`, `Q128.X2`, `Q095.X1`, `Q226.X3`.
- The gotcha at home: `Q187.X1`.
- Survival that stops mattering, or that was never finished: `Q065.X1`, `Q055.X5`.
- The vending-machine client at the far end: `Q236.X3`.
- The template twist: `Q236.X2`.
- The simulation seam (parties that teleport across the map): `Q061.X4`; rule 102d's sight radius and the step costs are the fix.
- Directions too thin for a desert ("find that guy in the desert"): `Q037.X1`; every far target has a print, a bearing in a mouth, or a road.

## 6. FLAGS FOR THE LANES
- RUN [the map at Battle Brothers' size]: the night question (section 1's arithmetic): camp at night, double the costs, or a clock day is a day. The shelf writes days and survives all three.
- WORLD [the region]: the shore and wash terrains need a cost (BB shore 0.5); the marina and the lodge designs assume slow shore and 1.8 hills.
- TUNING: rule 2's road allowance and rule 8's skull-by-days; the arithmetic in section 1.
- ECONOMY [contract pay]: the allowance as a line in kind (FOOD, WATER) or batteries.
- RUN TWO [settlement screen]: three new offer fields: there_days, back_days, waits_days; corridor (one of seven) for the phone's pair line.
- FACTIONS: the seven corridors are where roaming parties are met; each design names who roams its road.
- EYES [the map's four numbers]: four of the twelve routed distances landed this hour (Mesquite 1.95 days, Searchlight 1.16, Pahrump 0.93, Primm 0.83); the other eight would finish section 1's table.

## 7. OPEN (what the library and the references could not answer)
- Battle Brothers' zoom stops in tiles (owed: Grok ask 26); the days to cross landed this hour (EYES: 2 to 4 days).
- Whether BB's contract pay scales with the target's distance at all (the wiki says renown; the dev blog is unreadable from here).
- A shore and a wash cost on our region (WORLD).
- Whether the party camps at night (RUN, TUNING).

## 8. THE TEN DESIGNS ON THIS SHELF (questbook/designs/act1/, QD-AR01 to QD-AR10; one per corridor, three bands)

| id | title | kind (QR-AF) | client base | far place | corridor | band | nights out | twist |
|---|---|---|---|---|---|---|---|---|
| QD-AR01 | THE ICE TO HENDERSON | haul-caravan | the rail and truck depot (Caravans) | HENDERSON | I-515 southeast | NEAR | 0 | T07 the target keeps a schedule (the ice has a noon) |
| QD-AR02 | THE RELIEF SHIFT TO THE DAM | haul-envoy | the dam and turbine hall (Remnants) | HOOVER DAM | US-93 past Boulder City | A DAY | 1 | T18 a third party shows up |
| QD-AR03 | THE PACK THAT DRINKS AT JEAN | hunt-roaming | Jean's camp keeper | JEAN, moving toward PRIMM | I-15 south | HALF A DAY | 1 | none (one in twenty, QR-AF) |
| QD-AR04 | THE IMPELLER IN THE SUNK BOATS | recover-obtain | the farm tower (Volunteers) | LAKE MEAD MARINA | the lake road east | HALF A DAY (slow shore) | 1 | T16 the prize is smaller than the promise |
| QD-AR05 | THE STATE LINE CARAVAN | haul-caravan | the cartel yards (Cartel) | PRIMM | I-15 south | A DAY | 1 (at Jean) | T13 the loot is the bait |
| QD-AR06 | THE LODGE ABOVE THE SNOW LINE | find-place / recover | the chapel town and clinic (Church) | MT CHARLESTON LODGE | Kyle Canyon off US-95 | A DAY (hills) | 2 | T21 the rescued do not want rescue |
| QD-AR07 | THE GENERATOR AT SEARCHLIGHT | clear-camp | the solar field (Trades) | SEARCHLIGHT | US-95 south | A DAY | 2 | T17 the client lied |
| QD-AR08 | THE LETTER OVER THE PASS | carry | the tower offices (Reds) | PAHRUMP | NV-160 west | A DAY OR TWO | 2 | T14 the bribe is real |
| QD-AR09 | TWO NIGHTS AT THE MOAPA WELL | hold-defend | Moapa's camp | MOAPA | I-15 north | HALF A DAY TO A DAY | 3 (two on station) | T10 the clock arrives |
| QD-AR10 | THE FAMILY AT MESQUITE | haul-rescue / find-person | the co-op blocks (Blues) | MESQUITE | I-15 north, the far end | A DAY, the farthest | 3 | T08 the clue is misread once |

Twists on six of ten is over QR-C's one-in-four. Three of them are the kind's own built-in beat (the ice's noon, the caravan's bait, the well's early raid) and count as the job's shape rather than a surprise; the three surprises (the third party at the dam, the lodge's family, the bribe at Pahrump) are the one-in-four. QR-AM's checklist pass over this shelf is owed on the next [checklist the shelf] round.

## 9. THE [bb ...] LINE
[bb the region's contracts] Battle Brothers makes the walk the cost (wages, food, night, a twist on the way) and sends you to one target on a 140-tile map [R]. Ours is 496 tiles with the valley in the middle; this shelf gives every far job its days before the yes, its road allowance, its corridor pair, its moving target with a print, and its hand-in that flips the far place. Their crossing is 2 to 4 days (EYES, this hour) against our 1.9 on a road: the days row is half met, and the night-camp option closes the gap without touching a pixel.
