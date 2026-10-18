# ONE TABLE FOR THE ROOMS

WORLD lane (chat 02), 10/18/26. Row `[one table for the rooms]`. Opened by the
coordinator (rules 112 to 116), on Opus.

## 1. THE PROBLEM, IN ONE LINE

Which room plan a building gets (a police station is a hall, a reception,
records and offices; a hospital is wards) was written down TWICE: DISTGEN in
`engine/bohemia_world.js` (this lane's) and IN_ZONE in the CITY app. The app's
copy is old. Six districts disagree, all six collapsed into `institutional`, so
the police station the game builds has hospital wards in it
(records/BOHEMIA_WORLD_A_POLICE_STATION_FULL_OF_HOSPITAL_WARDS_10_10_26.md).

## 2. WHAT SHIPPED

- **`engine/BOHEMIA_DISTRICT_ROOMS.json`** (3,405 bytes). THE one readable table:
  62 districts -> their room grammar, plus the 16 live districts with no rooms,
  split 7 correctly none (desert, mountain, springs, water, freeway, interchange,
  arterial) and 9 owing one (airport, airbase, highroller, luxor, sphere, strat,
  rail, robofactory, strip; 7 of them blocked on having no kit module). 62 + 7 + 9
  = all 78 live districts. The split is a reading, mine, `tuned:false`.
- **`tools/bohemia_world_room_table.js`** writes it FROM DISTGEN (same bytes every
  run; `--check` exits 1 if stale). Nobody types it.
- **`gates/one_room_table_gate.js`**, ONE ROOM TABLE, 15/0, registered in the suite.

Why a generated file and not moving the table out of the engine: the engine file is
inlined byte-identical into five pages under the ENGINE SYNC LAW, and those pages
belong to other lanes. Editing DISTGEN's shape would have forced re-inlining all of
them. A file written from DISTGEN and byte-checked by a gate is one source with
nothing to resync.

## 3. THE GATE REFUSES FIVE THINGS

A. the file differing from DISTGEN by one byte;
B. a live district in no place, or in two;
C. a grammar the floorplan generator does not make, or one that makes no floor,
   walls and door when run (the police station from the table: 19 rooms, 0 wards);
D. a NEW hand-kept district-to-room copy anywhere in the repo (2,306 JS/HTML/JSON
   files scanned in about a second; a copy is 20+ live districts mapped with 90% of
   the values room grammars, so the kit's TAXONOMY and the bridge's ARCHETYPE, other
   vocabularies, are not copies). Found today: exactly one, IN_ZONE;
E. a known copy drifting further: IN_ZONE's 6 is a ratchet that only shrinks.

Mutation-proved three ways, each restored after: the police station set back to
`institutional` in DISTGEN -> RED (file stale, and 16 wards); a pasted copy in a new
engine file -> RED by file and line; one more district drifted in IN_ZONE -> RED (7).

## 4. ROUTED (rule 12: findings acted on, not waited on)

FOR THE CITY APP'S OWNER (LIFE+CITY): `slices/BOHEMIA_CITY_WORLD.html` line ~70129,
`const IN_ZONE={...}`. Replace it with the `.zones` of the published file, inlined
the way the app inlines `engine/bohemia_floorplan.js`. Then the drift is 0, the
police station loses its wards, the fire station gets its garage, the bus terminal
its concourse, and the copy comes off the gate's KNOWN list. The gate prints this
finding every run; it is not a red in anybody's file.

## 5. NOT DONE

No VOTE sheet (the rule 88 hold stands on this lane; the 10/10 sheet
WORLD_THE_INSIDES already shows the police station both ways). Nothing in the demo.
The nine that owe a grammar stay content, not decided here.
