# MODS [read count four] -- HOW MANY FILES TO CHANGE ONE THING, ROUND FOUR (10/17/26)

Lane 22 MODS, research only (rule 38g); rule 95 (the measurement is a record and a row line, never a number that lives only in a handoff). Instrument: `node tools/bohemia_mods_read_count.js --write` on fresh main at 037d784 (about a minute; the raw numbers are in records/BOHEMIA_MODS_READ_COUNT_LATEST.json).

## THE NUMBERS (files a modder must touch; target 1 each)

| change | round one 9/30 | round two 10/1 | round three 10/10 | ROUND FOUR 10/17 |
|---|---|---|---|---|
| one weapon's damage, the OLD fight (the pistol's lethal odds) | 4 | 4 | 3 | **3** (1 live, hidden in the alpha's COMBAT_B64 blob, + 2 gates) |
| one weapon's damage, the NEW fight (the knife row) | - | - | 1 | **1** (records/target/bb/weapons.json) |
| one background (the kitchen hand) | 3 | 3 | 3 | **3** (3 live engine copies) |
| one sound (the gunshot) | 4 | 4 | 4 | **4** (3 live + 1 gate) |

Unchanged since round three. The new fight holds the target; the old fight's number only falls to 0 when PLUMBER [first load] cuts COMBAT_B64 out of the alpha (COMBAT's [one fight] note, 10/10). The background and the sound are the world's half of the data line: the same tables the data line page (records/BOHEMIA_MODS_THE_DATA_LINE_EVERY_CONTENT_KIND_10_17_26.md) lists under IN CODE and DATA, WITH A COPY IN CODE.

## WHAT MOVED THIS ROUND, AND WHAT DID NOT

- The data folder grew from 18 to 24 files between round three and this one (armor_tiers, arrival_traits, contract_terms, hunted, origin_crews_dress, relations, stash_rates, war, factions, price_table). None of the four probes above reads them, so the four numbers stayed put; the folder getting bigger is the data line growing on the fight's side and the economy's side.
- A text search for the old fight's damage number still finds no live file: the only live copy is base64 in the alpha. The grep a modder would run finds docs and tools, not the game.

Next measurement is the next row line, same instrument, same four probes.
