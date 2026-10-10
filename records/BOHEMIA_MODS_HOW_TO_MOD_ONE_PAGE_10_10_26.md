# HOW TO MOD BOHEMIA, ON ONE PAGE

Everything here is help. Nothing refuses your mod, and nothing says what you may change.

## What a mod is
A folder of small JSON files. Each file changes one of the game's data files. You write only what you change; the rest stays as the game ships it.

## Where the game's data lives
`records/target/bb/` holds the data files (weapons.json, enemies.json, origins.json, perks.json and more). Open `weapons.json`, find `knife`, and you can see every number a weapon has. The schema page lists every file and field: `records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md`.

## The folder
```
my-mod/
  manifest.json    {"id": "my-mod", "name": "My Mod", "version": "1.0.0", "schema": 1}
  weapons.json     {"rows": {"knife": {"damage_min": 20, "damage_max": 30}}}
```
Name each patch file like the data file it changes. Add `"loadAfter": ["other-mod"]` to the manifest to load after another mod.

## Your first change
Make the knife hit harder: copy the two files above, put the folder next to the examples, and run the check:
`node tools/bohemia_mods_check.js path/to/folder-of-mods`
It says what changed and, for anything it skipped, what that means and how to fix it, in plain words. Today this check runs the reference loader; the game does not read a mods folder yet, so the check is how you see your mod work. The design for the folder in the game is `records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md`.

## What a patch can do
- Change a row: name its id and the fields. Rows are found by id.
- Add a row: use a new id and copy a whole base row so no field is missing.
- Change one entry in a list: `{"skills": {"Stab": {"ap": 3}}}` (by name or position).
- Add or remove words in a word list: `{"perks": {"add": ["Nimble"], "remove": ["Rotation"]}}`.
A whole array replaces the whole list.

## Examples to copy
Ten working folders are in `tools/mods_reference/example_mods/`, with a README. Start with knife-harder, new-sword and quicker-stab. A page of nine cards is in the VOTE tab list as MODS TO COPY.

## When something is wrong
The loader names the file and field. Every message has a code (M01 to M20) with the fix in plain words: `records/BOHEMIA_MODS_PLAIN_WORDS_WHEN_A_MOD_IS_WRONG_10_10_26.md`.

## Your first hour, step by step
`records/BOHEMIA_MODS_A_MODDERS_FIRST_HOUR_10_10_26.md`. When the data changes under your mod: `records/BOHEMIA_MODS_THE_DATA_CHANGELOG_10_10_26.md`.
