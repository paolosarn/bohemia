# MODS [ids never change] -- A ROW ID IS A PROMISE (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: A-ROW-ID-IS-A-PROMISE. Rule 22 (Minecraft's namespace lesson, school 9/28:
records/BOHEMIA_MODS_SCHOOL_HOW_BIG_GAMES_PUT_CONTENT_IN_DATA_9_28_26.md). MODE: research. Nothing in the game changed.
Instrument: `node tools/bohemia_mods_ids_audit.js` (instant). Proof: `node tools/bohemia_mods_merge_proof.js` (20 of 20).

## 0. THE ANSWER IN ONE LINE

**A mod names a row by its id, and 725 ids in 11 tables already carry weight: 764 places in the data files point at
an id of another table, and every perk, perk-translation and origin id is also written as a word in the game's code.**
So the policy is: never rename an id, retire a row instead of deleting it, and give a mod's own new rows an id that
starts with the mod's name and a colon. The colon is free: none of the 725 ids has one.

## 1. WHAT LEANS ON AN ID, MEASURED (main, 11 tables)

| fact | number |
|---|---|
| ids in the 11 tables | **725** |
| ids that also sit in a second table | 59 (50 are the perks and their translations, which are the same id on purpose; 9 are an enemy and a background with one id, such as gladiator and assassin) |
| paths where one data file points at another table's id | **83 paths, 764 places** |
| the biggest: an enemy's faction | 66 places |
| a start's men naming a background | 55 places |
| an enemy's "listed in" | 54 places |
| tables whose EVERY id is also quoted in game code | 3: origins (15 of 15), perks (50 of 50), perk translations (50 of 50) |
| ids that contain a colon | 0 |
| ids that are NOT lowercase letters, digits and underscore | 0 of 725 |

Two concrete chains, read off the files: **`mace_mastery`** is named in perks.json, perk_translation.json, the
fight page and a gate (four files), so renaming it breaks a data file that joins on it and the test that checks it.
**`gladiator`** is named in five data files (backgrounds, enemies, origins, price_table and the origin crews'
dress file), so a rename is five edits that must all land at once or a join quietly finds nothing.

## 2. THE POLICY (four rules; the first three are new, the fourth is already true)

1. **Never rename an id.** A new name is a new row. A mod that patches `knife` must find `knife` next week.
2. **Retire, do not delete.** A row the game stops using keeps its id and gains `"retired": true` and, if one
   exists, `"replaced_by": "<id>"`. (Proposed fields; nothing writes them today. A mod that patched a retired id
   gets a warning, not a crash.)
3. **A mod's new rows are named `<modid>:<name>`**, for example `new-sword:moon-blade`. That can never collide with a
   base id (none has a colon) or another mod's id (its prefix is the other mod's name). The reference merge
   warns when a new id lacks the prefix and adds the row anyway.
4. **Base ids stay lowercase letters, digits and underscore.** 725 of 725 already do (proof 8e), so this rule is a
   description of what is true, written down so the next row keeps it.

## 3. WHAT RAN

The reference merge takes `--namespace`: a new row with a bare id prints a warning that names the prefix it wants and
is still added; a prefixed id is silent; with the flag off there is no warning at all. Proof legs 8a to 8e check
that the colon is free, the warning fires, the prefixed id is silent and added, the flag-off path is unchanged, and
every base id follows the character rule. **The warning bites:** with its test replaced by `false`, leg 8b goes red
(19 of 20), and restoring it gives 20 of 20.

## 4. THE FINDING THAT PROVES THE POLICY WRONG IN ONE PLACE

**Rule 1 is a promise the data cannot keep alone, because code names ids too.** A table can promise its ids, but the
game's own code spells perk, origin and perk-translation ids as literals, and my audit counts a quoted word as "named in
code", which also catches common words by chance (a weapon called `sword` matches the word `sword` anywhere). So the
count of ids that are named in code is an UPPER bound for most tables (weapons 11 of 126, backgrounds 22 of 77) and
an exact fact only where the whole table is named (origins, perks). What it means for a modder: renaming an id in
data is safe only if nothing in the code spells it, and today nobody can tell without searching. A gate that lists
the ids code depends on is the missing piece; it is a build, so it is not here.

## 5. ROUTED

- **PLUMBER**: when he says build, rule 3 becomes the loader's warning and the id character rule (8e) becomes a
  line in a data gate.
- **The lanes that own a table**: a rename is now a three-step edit (the row, every pointer, every literal); the audit
  prints the pointers. Do not rename; add a row.
- **MODS next**: [more worked mods] is the top OPEN row; the id policy is what its new-row examples should follow.
