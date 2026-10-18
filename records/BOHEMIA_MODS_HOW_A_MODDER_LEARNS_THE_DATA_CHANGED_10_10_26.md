# MODS [base changes] -- HOW A MODDER LEARNS THE DATA CHANGED (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: HOW-A-MODDER-LEARNS-THE-DATA-CHANGED. Rule 22; Battle Brothers' lesson (school 9/28: every
official update broke edits; Legends pins a minimum version). MODE: research. Nothing in the game changed. Instrument:
`node tools/bohemia_mods_changes_audit.js` (one second; `--changelog` writes the page a modder reads, `--json` the data).
The generated changelog is records/BOHEMIA_MODS_THE_DATA_CHANGELOG_10_10_26.md.

## 0. THE ANSWER IN ONE LINE

**In the eight days records/target/bb has existed, 33 commits made 44 file changes, and only ONE of them could break a mod; no row id
was ever removed.** So the changelog a modder needs is short if it leads with the breaks, and a schema number that bumps ONLY on a
break would have moved once.

## 1. WHAT HISTORY SHOWS (this clone is shallow; the folder was born on 10/2, so this is the whole life of the folder)

| kind | file changes | what it means to a mod written before it |
|---|---|---|
| NEW FILE | **22** (9 on the first day, 13 more since) | nothing; a mod cannot patch a file that did not exist |
| ADDS (new keys, rows, tables, fields) | **14** | nothing; the mod keeps working |
| VALUES (only numbers changed) | **7** | the patch still applies; its numbers may now be stale |
| BREAKS | **1** | a mod that read it may stop: ai.json lost the field `why` from its kinds (10/5, the enemy-AI commit) |
| row ids removed | **0** | the id promise (records/BOHEMIA_MODS_A_ROW_ID_IS_A_PROMISE_10_10_26.md) has held, by habit |

**ours.json alone is 14 of the 22 changes that were not a new file**: the lanes add a new key to it almost every day
(`captain_aura`, `formation`, `board_fit`, `struck_down_injury`...). It is the busiest file and a pure grower.

## 2. THE POLICY (four lines; none is built)

1. **One schema number for the folder, bumped ONLY on a break.** A break is a removed or renamed id, table, key or field.
   Adding a file, a row, a key or a field never bumps it. By this rule the number would be **2 today** (the one `why`
   removal on 10/5); the reference merge's `GAME_SCHEMA` is 1, so it is already one behind. Proposed home: a one-line
   `schema.json` in the folder, `{ "schema": 2, "history": [ ... ] }`.
2. **A mod pins the schema it was written for** (`manifest.schema`, already in the design). Older than the folder: warn and
   load, never refuse (Minecraft's `pack_format` lesson).
3. **A lane that removes or renames something says so in its commit**, on a line starting `DATA-BREAK:`. The audit already finds
   breaks from the files; the line is the human sentence. (Nothing enforces it.)
4. **The changelog is generated, never written.** `--changelog` lists each file in each commit, BREAKS first, then ADDS, new
   files and value changes. The whole eight days is 58 lines; a modder reads the BREAKS lines (one) and the NEW FILE lines.

## 3. THE FINDING THAT PROVES THE PICTURE WRONG

**Eight days of additive history is partly a young folder, not a stable one.** The files were built one lane at a time, every day, and
filling a new file never breaks anything. The breaks come later, when lanes tidy: merging two tables, renaming a field,
retiring a row. One break in 44 is a rate for the building phase; do not read it as the long-run rate. It also means the
**changelog and the schema number are cheap now and expensive to retrofit**, which is the argument for writing them before
the first break that hurts rather than after.

Two smaller limits: the audit sees the JSON, not the intent (a renamed id looks like one id removed and one added, which the
audit counts as a break, correctly); and it cannot see a change inside a list (a weapon's skills) beyond "the row changed".

## 4. ROUTED

- **PLUMBER**: `schema.json` and the `DATA-BREAK:` line are yours to wire when he says build; the audit is the reader.
- **The lanes that write to bb**: ours.json is the busiest file; if a key ever has to change shape, say `DATA-BREAK:`.
- **MODS next**: [lists in rows] is the top OPEN row; then [grok sources].
