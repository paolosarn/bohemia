# MODS [data line] -- HOW BIG GAMES PUT CONTENT IN DATA, AND THE SHAPE WE RECOMMEND (9/28/26)

Lane 22 MODS, session mods-59jyd6. Row: ONE-CONTENT-KIND-AT-A-TIME-INTO-DATA.
Ruling answered: Paolo 9/27, rule 36e ("mod friendly for the community"); 9/28, rule 38g and law s7
("big brain research... how other games do it with similar big complex frontier coding").
MODE: RESEARCH. Nothing in the game changed. No gate added. The loader below is a DRAFT on a page, not in
the fight. Companion to records/BOHEMIA_MODS_SCHOOL_HOW_BATTLE_BROTHERS_IS_MODDED_9_28_26.md.
Studying another game for research is allowed (law s7); none of these is added to the canon's reference list.

## 0. THE ANSWER IN ONE LINE

Four very different games (Factorio, RimWorld, Stardew Valley via Content Patcher, Minecraft data packs)
converge on ONE shape: **base content is rows in data files keyed by an id; a mod is a small manifest plus
patches that touch rows by id, applied in a declared order, after the base has loaded; a bad row is
skipped and named, and the game never crashes.** We should copy that shape, weapons first.

## 1. WHAT EACH ONE DOES (the part worth stealing)

| game | data unit | how a mod changes it | order | version check |
|---|---|---|---|---|
| Factorio | a "prototype" (table with `type` and `name`) | `data:extend` adds; a later stage EDITS what other mods added | three stages for every mod: `data`, `data-updates`, `data-final-fixes`, so a mod can fix another mod's data without being last | dependencies in info.json |
| RimWorld | a Def (XML) | since alpha 17 a PatchOperation targets a node by XPath AFTER all Defs are in memory; before that a mod overwrote the whole Def and two mods touching one Def meant only the last survived | mod list order, plus `loadBefore` / `loadAfter` in About.xml | About.xml supportedVersions |
| Stardew (Content Patcher) | a data file (`Data/Objects`) | a content pack is two JSON files: `manifest.json` and `content.json`; each change is `{Action: EditData, Target, Entries}` | manifest dependencies | manifest + `UpdateKeys` so the player is told when a mod has a new version |
| Minecraft data packs | a JSON file at `data/<namespace>/<type>/<name>.json` | drop a folder with `pack.mcmeta`; the `minecraft` namespace overrides vanilla, your own namespace cannot collide | pack order | `pack_format`: a wrong number shows a warning and asks the player to confirm, it does not refuse |

The four lessons, each one a decision for us:

1. **Patch by id, never replace the file.** RimWorld's own history is the proof: whole-file override made
   mods mutually exclusive. It is the same lesson Battle Brothers taught (school page 1).
2. **Patch AFTER the base is loaded, in stages.** Factorio's three stages and RimWorld's post-load patching
   remove the need to argue about who loads last. One extra stage ("late") costs nothing and saves fights.
3. **A wrong version WARNS, it does not block** (Minecraft `pack_format`, Legends' pinned game version).
   A modder on a phone with an old file should see a yellow line, not a dead game.
4. **A namespace keeps ids from colliding** (Minecraft). A mod's new gun is `crossbow-pack:crossbow`, so it
   can never silently replace `pistol`. Overriding the base is allowed but has to be said out loud.

## 2. THE FINDING THAT PROVES US WRONG

**The fight will not hold still long enough to be put in a file today, and it moved while I measured.**
On 1f3936f the census read 42 places, 14 tables (13 named), one of them `CELL_MAX` (cell caps per gun).
Rebased onto main a few pushes later the same instrument reads **41 places, 13 tables (12 named), and
`CELL_MAX` is gone from the fight entirely**. I did not chase who removed it; it fits rule 38f (the house-sized
cell is dead) and is COMBAT's lane. Any data
schema written last hour would have carried a field for a number that no longer exists. Every field in a
weapons file has to be a field COMBAT still stands behind. That is the same premise the
Factorio/RimWorld communities paid for: their "data" was frozen by the studio before mods were promised.

Second finding, smaller: the shape above assumes the LOADER runs before the fight reads its tables. The
fight is a sealed blob that builds its tables as top-level `const`s when the alpha boots. A mod fetched
over the network would arrive after them. So the base data must be EMBEDDED in the alpha at build time
(zero cost on the phone's first thirteen seconds when nobody is modding, RUN's number) and only a MOD is
fetched or picked from a file, at the loading screen, before the fight boots. Nothing in this research
touches that; it is a constraint PLUMBER will meet.

## 3. THE SHAPE, RECOMMENDED (for the day he says build; PLUMBER with COMBAT wires it)

**One data file per content kind**, `slices/data/<kind>.json`, `slices/` because Pages publishes only
slices/, engine/ and records/target (school page 2). Rows keyed by id:

    { "schema": 1, "rows": { "pistol": { "mag": 15, "startLoaded": 15, "cap": 8, "lethal": 0.2, ... } } }

**One mod** is `manifest.json` (`id`, `name`, `version`, `schema`, `loadAfter`) plus a patch per kind.
Rules the draft page enforces, each one a lesson above:

- a row that exists is MERGED field by field; a row that does not exist is ADDED and must carry every field
  (a half-built gun is skipped and NAMED, the rest of the mod still loads);
- an unknown field is ignored and named; a value of the wrong type skips that one value and says so;
- a schema number that does not match WARNS and loads anyway;
- not valid JSON: the base game is untouched and the player is told why.

**Order of content kinds**, cheapest and most valuable first, from a rough measurement of how much of each
module is already plain data tables (heuristic: lines inside a top-level literal / total lines):

| kind | module | lines | in tables | verdict |
|---|---|---|---|---|
| names + backgrounds | engine/bohemia_people.js | 2,820 | 63% | already mostly data; move first, lowest risk, plain engine file |
| introductions | engine/bohemia_introductions.js | 467 | 54% | same |
| origins, encounters, goods, deeds | engine/ | 150 to 341 | 2% to 17% | mostly logic; a table hides inside functions, needs a look each |
| **weapons** | inside the sealed fight | 14,928-line blob | n/a | highest value, HARDEST, and moving (section 2) |

So the answer to the row's "weapons first" is: **weapons are first in value and last in safety.** The
recommendation is to take names and backgrounds through the loader first to prove it on a plain module,
and do weapons when COMBAT has stopped renaming the tables. The row's own gate ("nothing live reads that
content from code") is the ratchet in the school page s5; it must be written against the FILE list, not the
old table names, or it will go red every time COMBAT tidies.

## 4. THE THING HE CAN TOUCH

VOTE tab, item TRY A MOD (a page): the real four guns, read live from the fight, in a table; a text box with a
tiny mod; APPLY merges it by the rules above and shows what changed in amber. Three buttons: BIGGER PISTOL
MAG (changes two numbers), NEW GUN (adds a crossbow), BROKEN MOD (wrong schema, a word where a number goes,
an unknown field, a gun missing fields: it names all four and does not crash). The page IS the draft loader:
about 40 lines, no dependencies, and the reason to believe the shape is small enough.

## 5. ROUTED

- **PLUMBER / COMBAT**: nothing to do until he says build. When he does: (a) embed base data at build time so
  the phone's first thirteen seconds do not change; (b) COMBAT confirms which weapon fields it still stands
  behind before any schema is written; (c) the 10 digit-pinning asserts in combat_lab_gate.js become reads of
  the file (school page s3).
- **TUNING**: the file per kind IS your numbers table's door (`lethal`, `cap`, `mag`...). One file, one
  schema number, each row with your reason and source beside it as a `_why` key the loader ignores.
- **RUN**: the loading screen will list mods (rule 18h), off by default in the demo. Nothing yet.
- **Next row**: [mods folder] as a research page: where a mod is kept on a phone (a picked file in IndexedDB
  vs a folder under slices/), how a modder tests one, what "list on the loading screen" looks like.

## Sources

- [PatchOperations, RimWorld Wiki](https://rimworldwiki.com/wiki/Modding_Tutorials/PatchOperations)
- [Compatibility with defs, RimWorld Wiki](https://rimworldwiki.com/wiki/Modding_Tutorials/Compatibility_with_defs)
- [Data lifecycle, Factorio API docs](https://lua-api.factorio.com/latest/auxiliary/data-lifecycle.html)
- [data, data-updates and data-final-fixes, Factorio Forums](https://forums.factorio.com/viewtopic.php?t=56132)
- [Content Patcher, Stardew Valley Wiki](https://stardewvalleywiki.com/Modding:Content_Patcher)
- [Content Patcher author guide](https://github.com/Pathoschild/StardewMods/blob/stable/ContentPatcher/docs/author-guide.md)
- [EditData action](https://github.com/Pathoschild/StardewMods/blob/develop/ContentPatcher/docs/author-guide/action-editdata.md)
- [Data pack, Minecraft Wiki](https://minecraft.wiki/w/Data_pack)
- [Pack format, Minecraft Wiki](https://minecraft.wiki/w/Pack_format)
