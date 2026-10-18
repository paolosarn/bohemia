# The example mods

Ten folders, each a whole mod, each runs through `node tools/bohemia_mods_merge_reference.js <a folder holding it>`.
Copy one, change the id in `manifest.json`, edit the patch. Every mod here is data only. The game does not load a mods folder yet; these are
checked against the design (records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md).

| mod | what it does | the mistake it is there to teach |
|---|---|---|
| knife-harder | changes the knife's damage | the smallest mod: one row, two numbers |
| new-sword | adds a Moon Blade | a new row has to carry every field most rows carry |
| broken | is wrong in every way on purpose | each fault is named and skipped, nothing crashes |
| enemy-pack | adds an enemy (a copy of the brigand poacher, 10 more hit points) | copy a WHOLE row; give the new id your mod's name and a colon |
| poorer-start | an origin starts with 200 batteries instead of 250 | a number inside a row's own object merges one level: only `full` changes, `thin` and `bare` stay |
| fair-wages | a background's daily wage 25 to 20 | a number outside what the game uses is fine: it loads, no comment |
| sharper-mastery | the Mace Mastery fatigue cut 25 to 30 percent | write only the number you change inside `numbers`; the stun numbers stay |
| quicker-stab | the knife's Stab costs 3 action points, not 4 | name the skill you change inside a list; the rest of the list stays |
| armed-brigand | the brigand poacher gains the Nimble perk and loses Rotation | a list of words takes add and remove |
| new-helm | adds a head armour piece | armour has three tables (body, head, shields): the key is `head`, not `rows` |
