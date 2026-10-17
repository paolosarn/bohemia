# THE DATA LINE: EVERY CONTENT KIND, WHERE IT LIVES, WHAT YOU EDIT (generated 10/17/26 by tools/bohemia_mods_data_line.js)

Lane 22 MODS, research only (rule 38g); the big swing of rule 110 (Paolo 10/16: take big swings, run to the end). Paolo 9/27: "I want this to be mod friendly for the community." Paolo 9/30: "the point of the mods chat is to make it easy for people to make mods." This page is measured from the repo by the tool named in the title, so it cannot disagree with the files; re-run the tool and it rewrites itself. Nothing in the game changed.

## THE ANSWER IN ONE LINE

**47 kinds of content. 14 live in a data file a modder edits and a screen reads straight back; 3 are in a file but a code copy can drift; 12 are in a file no screen reads live (a build input); 15 are still tables inside code; 2 are built by functions with no table at all; 1 baked by a tool; 0 not found by name.**

A modder today can change **14 kinds by editing one JSON file and reloading the screen** (the fight, the settlement screen, the map, the demo). The rest of the page says, for every other kind, exactly which file and which table, so nobody has to grep.

## HOW TO READ THE TABLE

- **DATA**: a JSON file; a screen a player reaches fetches it by name. Edit, reload, done. The first-hour page proved it on the knife.
- **DATA, WITH A COPY IN CODE**: the file exists and is read, but a surface also carries its own table of the same kind. Edit the file; the copy may not follow (the start screen's fixed list of fifteen origins is the known case).
- **A FILE, NOT READ LIVE**: a JSON file a lane's tool reads at build time. Edit it, then that lane's tool has to run.
- **IN CODE**: a named table inside a `.js` or `.html` file. You can still edit it (it is plain JSON-shaped text), but it is code, and the demo carries a COPY of each engine file, so an edit to the engine file shows only after a re-cut.
- **BAKED BY A TOOL**: a generated file. Never edit it; change what the tool reads and run the tool.
- **BUILT BY CODE, NO TABLE**: the file exists but holds no table at its top level; the content comes out of functions. Nothing a modder can edit as data until a lane pulls it into a table.

## DATA (14)

| content kind | what you would change | the file today | owner | example mod | how you see the change |
|---|---|---|---|---|---|
| **weapons** | how hard a weapon hits, its reach, its cost, its skills | `records/target/bb/weapons.json` (126 rows) | COMBAT | knife-harder, new-sword, quicker-stab | edit the file, reload the fight / the settlement screen |
| **what each weapon says it does** | the one plain line under a weapon | `records/target/bb/weapon_lines.json` (15 rows) | COMBAT / WORDS | plainer-pistol | edit the file, reload the fight |
| **armour, helmets, shields** | durability, weight (fatigue), price; which tier a piece falls in | `records/target/bb/armor.json` (184 rows in 3 tables)<br>`records/target/bb/armor_tiers.json` (3 settings) | COMBAT / CHARACTER | new-helm | edit the file, reload the fight / the settlement screen<br>edit the file; a build input, a lane's tool reads it |
| **enemies** | an enemy's hit points, skills, perks, gear | `records/target/bb/enemies.json` (160 rows) | COMBAT | armed-brigand, enemy-pack | edit the file, reload the fight |
| **how enemies fight (AI)** | which behaviour each enemy kind uses, the tactics switches | `records/target/bb/ai.json` (10 rows) | COMBAT | none yet | edit the file, reload the fight |
| **perks** | a perk's numbers and tier, and its Bohemia translation | `records/target/bb/perks.json` (50 rows)<br>`records/target/bb/perk_translation.json` (50 rows) | COMBAT | sharper-mastery | edit the file, reload the fight |
| **injuries** | how long an injury lasts and what it costs | `records/target/bb/injuries.json` (59 rows) | COMBAT | slow-to-heal | edit the file, reload the fight / the settlement screen |
| **the fight's rules** | action points, fatigue, hit chance, damage, zone of control | `records/target/bb/rules.json` (122 rows in 9 tables) | TUNING / COMBAT | more-action-points | edit the file, reload the fight |
| **Bohemia's own fight numbers** | the beat, the field size, death chance when struck down, laid-up days | `records/target/bb/ours.json` (31 settings) | TUNING | none yet | edit the file, reload the fight / the settlement screen |
| **party size math** | how big a roaming party is, the day cap, difficulty by pick | `records/target/bb/party_math.json` (7 settings) | RUN | none yet | edit the file, reload the map |
| **settlement traits and rumours** | what a town can be known for and what people whisper | `records/target/settlement_traits.json` (3 rows)<br>`records/target/settlement_rumours.json` (11 rows) | WORLD / PEOPLE | none yet | edit the file, reload the map / the settlement screen<br>edit the file, reload the settlement screen |
| **the fight's ground (tiles and kits)** | what a floor tile costs and does, the kits per district, the blockers | `slices/fight_ground/fight_ground.json` (166 rows in 4 tables)<br>`records/target/bb/BOHEMIA_GROUND_EDGES.json` (44 rows in 2 tables)<br>`records/target/BOHEMIA_BOARD_KINDS.json` (8 settings)<br>`records/target/BOHEMIA_BOARD_TERRAINS.json` (8 settings)<br>`records/target/BOHEMIA_GROUND_EFFECTS.json` (7 settings) | COMBAT TWO / COOK TWO | none yet | edit the file, reload the fight / the map<br>edit the file; a build input, a lane's tool reads it |
| **the settlement's ground and pictures** | the tiers and tiles a settlement screen is drawn from | `slices/settlement_ground/settlement_ground.json` (8 settings)<br>`slices/settlement_ground_packs/settlement_ground.json` (8 settings) | COOK FOUR / RUN TWO | none yet | edit the file, reload the settlement screen |
| **the fighters' sprite sheets** | the frames and clips the fight and the settlement draw a person or a beast with | `slices/fight_people/fight_people.json` (36 rows in 2 tables)<br>`slices/fight_beasts/fight_beasts.json` (15 settings)<br>`slices/settlement_people/settlement_people.json` (34 rows in 2 tables) | ANIMATION | none yet | edit the file, reload the fight<br>edit the file; a build input, a lane's tool reads it<br>edit the file, reload the settlement screen |

## DATA, WITH A COPY IN CODE (3)

| content kind | what you would change | the file today | owner | example mod | how you see the change |
|---|---|---|---|---|---|
| **backgrounds (what a hire used to do)** | a background's stats, wage and hire price | `records/target/bb/backgrounds.json` (77 rows)<br>`engine/bohemia_people.js` table WAS_WORDS (line 2049, 38 lines) | PEOPLE | fair-wages | edit the file, reload the fight<br>edit the engine file; the map carries a copy, re-cut to see it |
| **origins (how a game starts)** | starting batteries, men, gear, the origin's rule | `records/target/bb/origins.json` (15 rows)<br>`slices/BOHEMIA_DEMO.html` table ORIGINS (line 13420, 17 lines)<br>`engine/bohemia_origins.js` table ORIGINS (line 96, 41 lines) | RUN | poorer-start | edit the file, reload the demo / the alpha<br>edit the table inside the surface itself (it is code, not a file)<br>edit the engine file; the map carries a copy, re-cut to see it |
| **the factions** | the four demo houses, their tones and banners; the eighteen-faction graph; measured colours | `records/target/bb/factions.json` (4 rows)<br>`engine/BOHEMIA_faction_graph.json` (18 rows)<br>`engine/BOHEMIA_faction_colours.json` (13 rows)<br>`slices/BOHEMIA_DEMO.html` table FACTION_LOOKS (line 5244, 121 lines) | FACTIONS | friendlier-crews | edit the file; read by bohemia_factions.js (an engine file, inlined into the surfaces by a cut)<br>edit the file, reload the map<br>edit the file; a build input, a lane's tool reads it<br>edit the table inside the surface itself (it is code, not a file) |

## A FILE, NOT READ LIVE (10)

| content kind | what you would change | the file today | owner | example mod | how you see the change |
|---|---|---|---|---|---|
| **how each origin's crew dresses** | which armour state each starting background wears | `records/target/bb/origin_crews_dress.json` (15 rows) | CHARACTER | none yet | edit the file; a build input, a lane's tool reads it |
| **relations (the 0 to 100 bar)** | the bands, the start, the drift, what crime costs | `records/target/bb/relations.json` (15 rows) | FACTIONS | none yet | edit the file; read by bohemia_hunted.js, bohemia_relations.js (an engine file, inlined into the surfaces by a cut) |
| **war between the houses** | what a war takes and which side a job puts you on | `records/target/bb/war.json` (5 settings) | FACTIONS | none yet | edit the file; read by bohemia_war.js (an engine file, inlined into the surfaces by a cut) |
| **when a settlement hunts you** | the thresholds that send a patrol after you | `records/target/bb/hunted.json` (5 settings) | FACTIONS | none yet | edit the file; read by bohemia_hunted.js (an engine file, inlined into the surfaces by a cut) |
| **what an arriving party does to a place** | the traits a raid leaves and how long they last | `records/target/bb/arrival_traits.json` (4 settings) | WORLD | none yet | edit the file; read by bohemia_arrivaltraits.js (an engine file, inlined into the surfaces by a cut) |
| **what the stash costs per day** | food by terrain, spoil days, repair, medicine, ammo | `records/target/bb/stash_rates.json` (6 settings) | ECONOMY | none yet | edit the file; read by bohemia_stash.js (an engine file, inlined into the surfaces by a cut) |
| **the map's houses** | the hero house pictures on the map | `slices/cook4_map_houses/map_houses.json` (6 settings) | COOK FOUR | none yet | edit the file; a build input, a lane's tool reads it |
| **clothes and hair** | the wardrobe, the haircuts, the paint over the thirteen looks and the six tiers | `engine/bohemia_dress.js` (389 lines of code, no top-level table)<br>`engine/bohemia_barber.js` (71 lines of code, no top-level table)<br>`engine/bohemia_cook3_runway_paint.json` (12 rows)<br>`engine/bohemia_cook3_tier_paint.json` (11 rows)<br>`records/target/BOHEMIA_HAIRSTYLES_MATCH.json` (4 settings) | CHARACTER / COOK THREE | none yet | no table to edit: the content is built by functions in that file; a lane has to pull it into a table first<br>edit the file; a build input, a lane's tool reads it |
| **the valley map** | the region map the city is cut from | `engine/BOHEMIA_region_map.json` (3 settings) | WORLD | none yet | edit the file; a build input, a lane's tool reads it |
| **the roads** | the road kinds and their speed | `engine/bohemia_roads.js` (289 lines of code, no top-level table)<br>`records/target/BOHEMIA_THE_ROADS.json` (6 settings) | WORLD / RUN | none yet | no table to edit: the content is built by functions in that file; a lane has to pull it into a table first<br>edit the file; a build input, a lane's tool reads it |

## A FILE AND CODE (2)

| content kind | what you would change | the file today | owner | example mod | how you see the change |
|---|---|---|---|---|---|
| **contracts (the job's pay)** | pay by skulls and distance, haggling, what failing costs | `records/target/bb/contract_terms.json` (7 settings)<br>`engine/bohemia_keeper_lines.js` table BOARD_PAY_BY_SKULLS (line 63, 1 lines) | ECONOMY | none yet | edit the file; read by bohemia_contracts.js (an engine file, inlined into the surfaces by a cut)<br>edit the engine file; the surfaces carry it after a cut |
| **prices** | the crown to battery rate, buy and sell cuts, wages, daily rates | `records/target/bb/price_table.json` (8 settings)<br>`engine/bohemia_economy.js` table GOODS (line 46, 52 lines) | ECONOMY | cheaper-batteries | edit the file; read by bohemia_pricetable.js, bohemia_stash.js (an engine file, inlined into the surfaces by a cut)<br>edit the engine file; the map carries a copy, re-cut to see it |

## IN CODE (15)

| content kind | what you would change | the file today | owner | example mod | how you see the change |
|---|---|---|---|---|---|
| **followers (the camp hires)** | the cook, the price, what each one changes | `engine/bohemia_followers.js` table FOLLOWERS (line 19, 32 lines) | RUN | none yet | edit the engine file; the map carries a copy, re-cut to see it |
| **the sixty bosses** | a boss's name, what it holds, the verb it hands you | `engine/bohemia_ladder_data.js` table BOSSES (line 16, 479 lines) | WORLD / COMBAT | none yet | edit the engine file; the map carries a copy, re-cut to see it |
| **road encounters** | what can meet you on the road and how it ends | `engine/bohemia_encounters.js` table ROSTER (line 74, 36 lines) | WORLD | none yet | edit the engine file; the map carries a copy, re-cut to see it |
| **what people say** | a faction's lines, reactions, the keepers' lines | `engine/bohemia_people.js` table LINES (line 613, 864 lines)<br>`engine/bohemia_people.js` table REACTIONS (line 1488, 312 lines)<br>`engine/bohemia_keeper_lines.js` (107 lines of code, no top-level table) | WORDS / PEOPLE | none yet | edit the engine file; the map carries a copy, re-cut to see it<br>no table to edit: the content is built by functions in that file; a lane has to pull it into a table first |
| **names** | the surname pool and how a name reads | `engine/bohemia_people.js` table SURNAME (line 580, 21 lines)<br>`engine/bohemia_people.js` table NAME_READS (line 1931, 25 lines) | PEOPLE | none yet | edit the engine file; the map carries a copy, re-cut to see it |
| **the asks (what people ask of you)** | who asks, about what, in which words | `engine/bohemia_asking.js` table ASKING (line 20, 352 lines)<br>`engine/bohemia_asks.js` table CHANGES (line 57, 62 lines)<br>`engine/bohemia_asks.js` table READERS (line 155, 75 lines) | QUESTS / WORDS | none yet | edit the engine file; the map carries a copy, re-cut to see it |
| **trade talk** | the exchanges at a counter | `engine/bohemia_exchanges.js` table EXCHANGES (line 24, 1278 lines) | WORDS | none yet | edit the engine file; the map carries a copy, re-cut to see it |
| **the demo's quests** | the day-by-day briefs | `engine/bohemia_demoquests.js` table DAYS (line 51, 52 lines) | QUESTS (research only) | none yet | edit the engine file; the map carries a copy, re-cut to see it |
| **sounds** | a sound's recipe (material, pitch, decay), what fires it, the voices | `engine/bohemia_sfx.js` table RECIPE (line 1007, 1810 lines)<br>`engine/bohemia_sfx.js` table EVENTS (line 691, 310 lines)<br>`engine/bohemia_sfx.js` table INST_VOICE (line 262, 294 lines)<br>`engine/bohemia_horror_sounds.js` table STRIKE (line 1229, 45 lines) | SOUNDS | none yet | edit the engine file; the demo and the alpha carry a copy, re-cut to see it<br>edit the engine file; the surfaces carry it after a cut |
| **music** | the songs, the loops, the city's music | `slices/BOHEMIA_DEMO.html` table MUS (line 19382, 616 lines)<br>`slices/BOHEMIA_DEMO.html` table MLOOPS (line 17824, 130 lines)<br>`slices/BOHEMIA_DEMO.html` table CITYMUS (line 18057, 193 lines) | SOUNDS | none yet | edit the table inside the surface itself (it is code, not a file) |
| **ambience and rooms** | what a place sounds like | `slices/BOHEMIA_DEMO.html` table AMB (line 24854, 271 lines)<br>`slices/BOHEMIA_DEMO.html` table ROOM (line 23695, 217 lines) | SOUNDS | none yet | edit the table inside the surface itself (it is code, not a file) |
| **poses (how a body moves)** | the keys of each clip | `slices/BOHEMIA_DEMO.html` table POSE (line 7817, 398 lines) | ANIMATION | none yet | edit the table inside the surface itself (it is code, not a file) |
| **cutscenes and the cold open** | the scenes, their lines, their timing | `slices/BOHEMIA_DEMO.html` table BOHEMIA_CUTSCENES (line 35449, 856 lines)<br>`slices/BOHEMIA_DEMO.html` table BOHEMIA_COLD_OPEN (line 35086, 363 lines)<br>`engine/bohemia_story_surface.js` (576 lines of code, no top-level table) | DYNASTY / WORDS | none yet | edit the table inside the surface itself (it is code, not a file)<br>no table to edit: the content is built by functions in that file; a lane has to pull it into a table first |
| **the city's districts** | what each of the forty district kinds is made of and how it is laid | `engine/bohemia_district_kit.js` table A (line 94, 119 lines)<br>`engine/bohemia_district_kit.js` table TAXONOMY (line 263, 27 lines)<br>`engine/bohemia_district_kit.js` table KIND_LAYER (line 491, 24 lines)<br>`engine/bohemia_suburb.js` table LEGEND (line 667, 50 lines)<br>`engine/bohemia_suburb.js` table NOTES (line 717, 19 lines)<br>`engine/bohemia_downtown.js` table LEGEND (line 181, 23 lines)<br>`engine/bohemia_downtown.js` table NOTES (line 205, 25 lines)<br>`engine/bohemia_freeway.js` table LEGEND (line 395, 54 lines)<br>`engine/bohemia_freeway.js` table NOTES (line 450, 25 lines)<br>`engine/bohemia_world.js` table DISTGEN (line 98, 112 lines) | LIFE+CITY / WORLD | none yet | edit the engine file; the map carries a copy, re-cut to see it<br>edit the engine file; the surfaces carry it after a cut |
| **the cold open's set tiles** | the pictures the first room is built from | `engine/bohemia_coldopen_set.js` table TILES (line 11, 26 lines) | COOK | none yet | edit the engine file; the demo and the alpha carry a copy, re-cut to see it |

## BUILT BY CODE, NO TABLE (2)

| content kind | what you would change | the file today | owner | example mod | how you see the change |
|---|---|---|---|---|---|
| **the three acts and the heirs** | what an act is, how the heir is made | `engine/bohemia_acts.js` (498 lines of code, no top-level table)<br>`engine/bohemia_heirs.js` (343 lines of code, no top-level table) | DYNASTY | none yet | no table to edit: the content is built by functions in that file; a lane has to pull it into a table first |
| **the phone's feed** | the posts that scroll in the city view | `engine/bohemia_feedstream.js` (293 lines of code, no top-level table) | UI / WORLD | none yet | no table to edit: the content is built by functions in that file; a lane has to pull it into a table first |

## BAKED BY A TOOL (1)

| content kind | what you would change | the file today | owner | example mod | how you see the change |
|---|---|---|---|---|---|
| **the demo's cast and crowd (bodies)** | the baked looks of everyone on the map | `slices/BOHEMIA_DEMO_CAST.json` (544 KB, baked)<br>`slices/BOHEMIA_DEMO_CROWD.json` (1628 KB, baked) | CHARACTER / RUN | none yet | do not edit the file: it is baked by tools/bohemia_bake_the_demo_cast.js; change the source and bake again |

## WHICH DATA FILES HAVE AN EXAMPLE MOD, AND WHICH DO NOT

The 24 files in `records/target/bb/`: **11 have a worked example** in `tools/mods_reference/example_mods/` and **13 do not**.

With an example: `armor.json` (new-helm), `backgrounds.json` (fair-wages), `enemies.json` (armed-brigand, enemy-pack), `factions.json` (friendlier-crews), `injuries.json` (slow-to-heal), `origins.json` (poorer-start), `perks.json` (sharper-mastery), `price_table.json` (cheaper-batteries), `rules.json` (more-action-points), `weapon_lines.json` (plainer-pistol), `weapons.json` (knife-harder, new-sword, quicker-stab).

Without: `BOHEMIA_GROUND_EDGES.json`, `ai.json`, `armor_tiers.json`, `arrival_traits.json`, `contract_terms.json`, `hunted.json`, `origin_crews_dress.json`, `ours.json`, `party_math.json`, `perk_translation.json`, `relations.json`, `stash_rates.json`, `war.json`.

## WHAT THE MEASUREMENT CAN AND CANNOT SAY

- A file counts as READ LIVE when one of the six player surfaces (the demo, the fight, the map, the settlement screen, the roster screen, the alpha) names it inside a quoted string. A file fetched through a variable would be missed; none of the 24 bb files is, because the fight lists them by name.
- A code table counts when a `const`, `let` or `var` of that name opens a `[` or `{` at the top level of the file. A table built by a function is missed.
- A copy in a surface is the same table name at the same size (within one percent). The demo inlines five engine files verbatim and carries the rest through its build; where the size differs the copy is not counted and the page says only "after a cut".
- Owners are by the table's role, from the board, not verified line by line.
- The kinds list is written by hand (47 kinds); everything under each kind is measured. A kind nobody listed is not on the page. Add it to KINDS and re-run.

## THE FINDING THAT PROVES US WRONG

The schema page (10/9) and the first-hour page (10/10) say the modder's world is `records/target/bb/`. Measured: that folder is 24 files, and the fight, the settlement screen, the map and the demo read 14 kinds from it and from four more data folders under `slices/`. But the sound a modder hears, the song, the words a keeper says, the sixty bosses, the road encounters and the cutscenes are 15 kinds still in code (2 more have no table at all), and every one of them sits inside the demo as a copy, so editing the engine file changes nothing on the phone until a cut. The data line is half built: the fight's half. The world's half is the next door.

## ROUTED (pages only, rule 38g; the building lanes move their own tables)

- **PEOPLE**: backgrounds (what a hire used to do): `engine/bohemia_people.js` table WAS_WORDS (38 lines) is the table a modder would want as a file, beside the file that already exists.
- **RUN**: origins (how a game starts): `slices/BOHEMIA_DEMO.html` table ORIGINS (17 lines) is the table a modder would want as a file, beside the file that already exists.
- **FACTIONS**: the factions: `slices/BOHEMIA_DEMO.html` table FACTION_LOOKS (121 lines) is the table a modder would want as a file, beside the file that already exists.
- **RUN**: followers (the camp hires): `engine/bohemia_followers.js` table FOLLOWERS (32 lines) is the table a modder would want as a file.
- **WORLD / COMBAT**: the sixty bosses: `engine/bohemia_ladder_data.js` table BOSSES (479 lines) is the table a modder would want as a file.
- **WORLD**: road encounters: `engine/bohemia_encounters.js` table ROSTER (36 lines) is the table a modder would want as a file.
- **WORDS / PEOPLE**: what people say: `engine/bohemia_people.js` table LINES (864 lines) is the table a modder would want as a file.
- **PEOPLE**: names: `engine/bohemia_people.js` table NAME_READS (25 lines) is the table a modder would want as a file.
- **QUESTS / WORDS**: the asks (what people ask of you): `engine/bohemia_asking.js` table ASKING (352 lines) is the table a modder would want as a file.
- **WORDS**: trade talk: `engine/bohemia_exchanges.js` table EXCHANGES (1278 lines) is the table a modder would want as a file.
- **QUESTS (research only)**: the demo's quests: `engine/bohemia_demoquests.js` table DAYS (52 lines) is the table a modder would want as a file.
- **SOUNDS**: sounds: `engine/bohemia_sfx.js` table RECIPE (1810 lines) is the table a modder would want as a file.
- **SOUNDS**: music: `slices/BOHEMIA_DEMO.html` table MUS (616 lines) is the table a modder would want as a file.
- **SOUNDS**: ambience and rooms: `slices/BOHEMIA_DEMO.html` table AMB (271 lines) is the table a modder would want as a file.
- **ANIMATION**: poses (how a body moves): `slices/BOHEMIA_DEMO.html` table POSE (398 lines) is the table a modder would want as a file.
- **DYNASTY / WORDS**: cutscenes and the cold open: `slices/BOHEMIA_DEMO.html` table BOHEMIA_CUTSCENES (856 lines) is the table a modder would want as a file.
- **LIFE+CITY / WORLD**: the city's districts: `engine/bohemia_world.js` table DISTGEN (112 lines) is the table a modder would want as a file.
- **COOK**: the cold open's set tiles: `engine/bohemia_coldopen_set.js` table TILES (26 lines) is the table a modder would want as a file.

Proof line: `node tools/bohemia_mods_data_line.js` (reads only; about two seconds). Companion pages: the schema page records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md, the audit records/BOHEMIA_MODS_WHAT_IS_DATA_AND_WHAT_IS_NOT_10_9_26.md, the one-page how-to MODDING.md.
