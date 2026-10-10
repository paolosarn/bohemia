# The example mods

Eight folders, each a whole mod, each runs through `node tools/bohemia_mods_merge_reference.js <a folder holding it> --ranges --namespace`.
Copy one, change the id in `manifest.json`, edit the patch. Every mod here is data only. The game does not load a mods folder yet; these are
checked against the design (records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md).

| mod | what it does | the mistake it is there to teach |
|---|---|---|
| knife-harder | changes the knife's damage | the smallest mod: one row, two numbers |
| new-sword | adds a Moon Blade | a new row has to carry every field most rows carry |
| broken | is wrong in every way on purpose | each fault is named and skipped, nothing crashes |
| enemy-pack | adds an enemy (a copy of the brigand poacher, 10 more hit points) | copy a WHOLE row; give the new id your mod's name and a colon |
| poorer-start | an origin starts with 200 batteries instead of 250 | a number inside a row's own object merges one level: only `full` changes, `thin` and `bare` stay |
| fair-wages | a background's daily wage 25 to 20 | a wage of 99 is outside every background (0 to 35) and warns |
| sharper-mastery | the Mace Mastery fatigue cut 25 to 30 percent | write only the number you change inside `numbers`; the stun numbers stay |
| new-helm | adds a head armour piece | armour has three tables (body, head, shields): the key is `head`, not `rows` |
