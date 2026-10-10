# MODS [error messages] -- WHAT THE LOADER SAYS WHEN A MOD IS WRONG, IN PLAIN WORDS (10/10/26)

Research, nothing built in the game. Help only: no message here refuses a mod. Every row below was produced by a real broken mod run through the reference merge (tools/bohemia_mods_error_messages.js), so the text is not a guess. `bad` means that part of your mod was skipped. `warn` means it loaded and you may want to look. The tool also fails if the merge ever prints a message that has no row here.

| code | kind | what the loader says | in plain words | how to fix it |
|---|---|---|---|---|
| M01 | bad | `enemies.rows.brigand_poacher.perks: a list of words takes {"add": [...], "remove": [...]} or a whole array. Skipped.` | This list holds plain words, and your change is not an add or a remove. | Write {"add": ["Word"], "remove": ["Other"]}, or give the whole list as [ ... ]. |
| M02 | bad | `weapons.rows.knife.skills.Stab: a list element change must be an object. Skipped.` | You named a list entry but gave it a value that is not a { } block. | Write the entry as {"Stab": {"ap": 3}}. |
| M03 | bad | `weapons.rows.knife.skills.7: the list has only 2 elements. Skipped.` | You used a position number that is past the end of the list. | Count from 0. A list of 2 has positions 0 and 1. |
| M04 | bad | `weapons.rows.knife.skills.Stab.ap: wants number, got string. Skipped.` | A field inside a list entry has the wrong kind of value (a word where a number goes, or the reverse). | Look at the value in the base file and use the same kind. Numbers have no quote marks. |
| M05 | bad | `weapons.rows.knife: a row change must be an object. Skipped.` | You named a row but gave it something that is not a { } block. | Write the row as {"knife": {"damage_min": 20}}. |
| M06 | warn | `weapons.rows.knife.colour: no row in the base has this field. Ignored.` | No row in this file has a field with that name, so it was ignored. | Check the spelling against the schema page. Copy a field name from a base row. |
| M07 | bad | `weapons.rows.knife.damage_min: wants number, got string. The whole row change is skipped.` | A field has the wrong kind of value, so none of this row change was applied. | Use the same kind of value the base row has. Numbers have no quote marks. |
| M08 | bad | `enemies.rows.ancient_honor_guard_champion.stats_before_champion_bonus.hp: wants number, got string. The whole row change is skipped.` | A value inside a small { } block on a row has the wrong kind, so none of this row change was applied. | Open the row in the base file, find the block, and match the kind of each value. |
| M09 | bad | `weapons.rows.laser: a NEW row needs name, class, damage_max, armor_damage_pct, armor_ignore_pct, value, range, skills, source, skills_basis, missing, fatigue. Row skipped.` | You added a new row but left out fields that almost every row has. | Copy a whole base row, change the id and the numbers. The message names the missing fields. |
| M10 | warn | `weapons.rows.moon-blade: a new id should start with "t:" so it cannot collide with the base or another mod. Added anyway.` | Your new id could collide with a base id or another mod (only shown if you ask for this check). | Start new ids with your mod id and a colon, like moon:blade. Optional. |
| M11 | warn | `weapons.nonsense: the base file has no such key. Ignored.` | The file has no top-level key with that name, so it was ignored. | Check the spelling against the schema page. |
| M12 | bad | `arrival_traits.duration_days.value: wants number, got string. Skipped.` | A value in a small settings block has the wrong kind. | Match the kind in the base file. Numbers have no quote marks. |
| M13 | bad | `ours.beat_bpm: wants object, got string. Skipped.` | A whole setting has the wrong kind of value. | Match the kind in the base file. Numbers have no quote marks. |
| M14 | bad | `t: manifest.json is missing or not JSON. Mod skipped.` | The mod folder has no manifest.json, or it cannot be read. | Add manifest.json with an id and a version. Check for a missing comma or quote. |
| M15 | bad | `t: manifest needs id and version. Mod skipped.` | The manifest has no id or no version, both as words in quotes. | Write {"id": "my-mod", "version": "1.0.0"}. |
| M16 | warn | `t: written for data schema 0, the game reads 1. Loaded anyway.` | The mod says it was written for a different version of the data. It loaded anyway. | Open the data changelog, see what changed since your version, then set "schema" to the current number. |
| M17 | bad | `t/weapons.json: not JSON (Expected property name or '}' in JSON at). File skipped.` | One of your files is not valid JSON, so it was skipped. | Look for a missing comma, a missing quote or a stray bracket near the spot named. |
| M18 | bad | `a, b: loadAfter loop. All skipped.` | Two or more mods each say they load after the other, so none of them loaded. | Remove one of the loadAfter lines. |
| M19 | warn | `t/nothing.json: no such data file. Ignored.` | Your file is named for a data file that does not exist, so it was ignored. | Name each patch file exactly like the data file it changes, for example weapons.json. |
| M20 | warn | `CONFLICT weapons.rows.knife: b overrides a (loads later, wins).` | Two mods change the same row. The one that loads later wins. | This is a heads-up, not a fault. Use loadAfter to pick which one wins. |

ROUTED: PLUMBER shows `code` and the plain words when the loader is built. The codes are stable so a doc page can link them.
