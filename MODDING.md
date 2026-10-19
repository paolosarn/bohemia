# HOW TO MOD BOHEMIA, ON ONE PAGE

Everything here is help. Nothing refuses your mod, and nothing says what you may change.

## What a mod is
A folder of small JSON files. Each file changes one of the game's data files. You write only what you change; the rest stays as the game ships it.

## Where the game's data lives
Every kind of content, where it lives today (a data file, a table in code, or baked), who reads it and how you see a change, is one measured page: `records/BOHEMIA_MODS_THE_DATA_LINE_EVERY_CONTENT_KIND_10_17_26.md` (47 kinds; 14 are a file you edit and reload).

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

## See your change in the game today
Three strangers tried three changes from this page; this is what they needed and did not find (records/BOHEMIA_MODS_CHANGE_ONE_THING_IN_TEN_MINUTES_10_18_26.md).
- **The names on the screen are not the names in the file.** Your crew's weapons are Battle Brothers rows under a nickname (records/target/bb/ours.json, `weapon_rows`): PISTOL is `dagger`, PIPE `bludgeon`, SHOTGUN `handgonne`, RIFLE `light_crossbow`, SLEDGE `two_handed_mallet`, BOTTLES `bundle_of_throwing_axes`, CAR DOOR `wooden_shield`. The weapon card's small print names the row ("Battle Brothers: Dagger"). The knife above is carried by nobody in your company, so change the dagger to see a number in your own fight. A row is shared: an enemy's dagger changes too.
- **Where it shows.** The game reads `records/target/bb/` directly: edit a file, serve the repo, open `slices/BOHEMIA_FIGHT.html` (twelve men) and hold a finger on a man to see his weapon's card. The demo's starting crew (A NEW CREW) is three men with pipes and a sledge; pick THE BLOCK WATCH to field all twelve, the pistol among them. In a town (`slices/BOHEMIA_SETTLEMENT_SCREEN.html`) hold a finger on a building to read its name.
- **Your browser may keep the old file.** After an edit, shift-reload or open a private window. A plain reload, and typing the address again, kept the old number for a tenth of the time since you cloned (measured: 60 seconds for a clone 10 minutes old, 2.4 hours for a clone a day old).
- **Not data yet.** A building's name is the `B` table in `slices/BOHEMIA_SETTLEMENT_SCREEN.html`. A crew member's haircut is two words: the body's in `CITY_CAST_LOOKS` in `slices/BOHEMIA_ALPHA_0_9.html` (then `node tools/bohemia_fight_people_bake.js`, about 4 minutes), and the face's in `tools/bohemia_portrait_the_head_from_the_model.py` (a Blender render). Neither can travel in a mod yet.
- **Each screen names a weapon from its own table.** The fight's card reads `records/target/bb/weapon_lines.json` ("name"), the crew screen `CLASSNAME` in `engine/bohemia_roster.js`, the town shop its own `CLASSNAME` in `slices/BOHEMIA_SETTLEMENT_SCREEN.html` (it shows only the last word: fire axe reads axe). Rename a weapon in all three or it wears three names. Armour words are picked by durability band in three copies of one function (the same two files and `slices/bohemia_ui_materials.js`). A town's name is also its key: renaming Church changes the town. Every word in the first ten minutes, with the line that sets it: `records/BOHEMIA_MODS_EVERY_WORD_YOU_SEE_FINDS_ITS_LINE_10_19_26.md`.

## What a patch can do
- Change a row: name its id and the fields. Rows are found by id.
- Add a row: use a new id and copy a whole base row so no field is missing.
- Change one entry in a list: `{"skills": {"Stab": {"ap": 3}}}` (by name or position).
- Add or remove words in a word list: `{"perks": {"add": ["Nimble"], "remove": ["Rotation"]}}`.
A whole array replaces the whole list.

## Examples to copy
Fifteen working folders are in `tools/mods_reference/example_mods/`, with a README. Start with knife-harder, new-sword and quicker-stab; cheaper-batteries and more-action-points show a settings file; friendlier-crews a table under its own key. A page of nine cards is in the VOTE tab list as MODS TO COPY.

## When something is wrong
The loader names the file and field. Every message has a code (M01 to M20) with the fix in plain words: `records/BOHEMIA_MODS_PLAIN_WORDS_WHEN_A_MOD_IS_WRONG_10_10_26.md`.

## Your first hour, step by step
`records/BOHEMIA_MODS_A_MODDERS_FIRST_HOUR_10_10_26.md`. When the data changes under your mod: `records/BOHEMIA_MODS_THE_DATA_CHANGELOG_10_10_26.md`.

## A sprite in a mod
Not yet. The game loads no mod pictures and the checker ignores a PNG today. How a sprite would be declared beside its file and checked (geometry skips, style reports): `records/BOHEMIA_MODS_A_MODDER_RUNS_THE_SAME_TEN_TESTS_10_18_26.md` and `records/BOHEMIA_MODS_THE_STYLE_GUIDE_AS_DATA_10_18_26.md`.
