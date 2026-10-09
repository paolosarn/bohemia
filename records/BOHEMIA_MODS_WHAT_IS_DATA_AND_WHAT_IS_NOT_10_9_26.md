# MODS [what is data and what is not] -- THE AUDIT OF THE DEMO'S CONTENT (10/9/26)

Lane 22 MODS, session mods-59jyd6. Row: AUDIT-THE-DEMO-FOR-HARDCODED-CONTENT (top OPEN row, rule 74).
Rules: 22 (mod-friendly and readable), 63d (the numbers are data files), 78 (all chats run; MODS stays
research and hands pages to the building lanes). MODE: research. Nothing in the game changed, no gate added.
Instrument: `node tools/bohemia_mods_data_audit.js` (one second, read-only; `--json` for the machine form).
Companion: records/BOHEMIA_MODS_READ_COUNT_LATEST.json (`node tools/bohemia_mods_read_count.js --write`).

## 0. THE ANSWER IN ONE LINE

**The new fight is already the model: it reads 12 of the 14 data files in records/target/bb and has one loose
table (its sound table, 930 characters). The demo's start screen reads 1 file and the map reads 1.** And the
demo still carries a sealed copy of the OLD fight with 0 data files, so a modder who edits the weapons file
changes only half of what the player can open.

## 1. THE TWO LISTS

### 1a. IN A DATA FILE (records/target/bb, 14 files, 608 rows)

weapons 126 rows, enemies 160, backgrounds 77, injuries 59, perks 50, perk_translation 50, ours 27, armor 7,
weapon_lines 15, rules 15, party_math 8, ground_edges 6, ai 5, origins 3 (a file of defaults plus a list of 15).
Read live by: the new fight (12 of 14: all but party_math and ground_edges), the demo start screen
(origins.json only), the map (party_math.json only). BOHEMIA_GROUND_EDGES.json is a cook-time input, read by
a gate and a tool, never live.

### 1b. STILL IN CODE (six findings, worst for a modder first)

| # | finding | owner | what it costs a modder |
|---|---|---|---|
| 1 | **The demo drops a new origin.** The start screen keeps a fixed list of the same 15 origin ids and only fills them from origins.json (`find(ORIGINS, d.id)`; an id not in the list is skipped). | RUN | An origin added to the file has no slot and vanishes. The one place in the shell where data is read AND the merge is broken for the thing a mod does first. |
| 2 | **Two truths for one gun.** The sealed old fight (COMBAT_B64, 17 big tables, 39 KB, 0 data files) is still reachable from the combat tab and from a handoff call. | COMBAT and RUN | Edit bb/weapons.json and only the new fight changes; the old fight's WEAPON_LETHAL, MAG and the other eleven weapon tables never move. |
| 3 | **Three tables repeat a data file.** The map's own WAS_WORDS (backgrounds.json), ORIGINS (origins.json) and ROSTER (ours.json and party_math.json), plus CT_TRADE_SAID. Three more tables named RULES (35 KB) look like rules.json; by name only, a lane should check. | WORLD and PEOPLE | They drift. A change in the file does not reach the map's copy. |
| 4 | **The map holds 245 big tables, 775 KB, none in a file.** Exchanges 36 KB, lines 33 KB, layout 27 KB, asking 13 KB, bosses 12 KB, reactions 11 KB and more. | WORLD, ECONOMY, WORDS | This is the game's trading and talking content, the second thing a modder wants after weapons. |
| 5 | **The demo shell is sound, music and art, not rules.** 52 big tables, 657 KB: sound recipes 108 KB, tiles 96 KB, cutscenes 53 KB, music 52 KB, poses 41 KB, music loops 32 KB. | SOUNDS, COOK, ANIMATION | Not a defect; a modder looking for a number will not find one here. It does mean a "mods" door has to be per kind. |
| 6 | **The new fight has one loose table.** SND, 930 characters. | COMBAT and SOUNDS | Almost nothing. This is the target for every other surface. |

How the tables were found, and what the audit can and cannot say: the tool reads each surface's own text
(the demo with its base64 blobs stripped, the old fight decoded from COMBAT_B64), finds every top-level
`const NAME = [ or {` literal of at least 8 lines and 400 characters, and marks it SHADOWED only when its NAME
matches a data file's kind. So it undercounts shadows (a table named something else that repeats a file) and may
over-call one (a RULES that is not the rules). Everything it says about owners is by the table's role, not
verified line by line. Sizes are characters of source, not rows.

## 2. THE READ COUNT, WITH THE NEW FIGHT BESIDE THE OLD (main at 7226fb0)

| change | old fight, files to touch | NEW fight, files to touch |
|---|---|---|
| one weapon's damage | 4 (2 hidden in blobs, 2 gates) | **1** (records/target/bb/weapons.json) |

**The target of 1 is already met in the new fight.** The same change in the old fight is still 4, and the old
fight is still shipped. Background 3 and sound 4 are unchanged (plain engine files plus derived copies).
The read-count tool counts records/target/ as live now (it is a published folder the game fetches); the first
version counted it as documents and returned 0 for the new fight, which was wrong and was caught by looking at
the file list before trusting the number.

## 3. THE FINDING THAT PROVES US WRONG

**My own research said the first move was names and backgrounds, then weapons last.** That was true on 9/28
for the code as it stood (the fight was a sealed blob, 42 places). It is false now: COMBAT rebuilt the fight
in one file that reads its numbers from data, so weapons are the EASIEST kind today and the old advice would
have sent a lane to the hardest one. Research pages go stale in a week on this project. The audit is the
number to re-run, not the 9/28 ordering.

## 4. ROUTED (rows written on the lanes, rule 22)

- **RUN**: [origins fallback] the start screen must take any origin id the file carries, not only the 15
  it hard-codes. One merge change. Nothing about the beat or the first second is touched.
- **COMBAT**: [one fight] retire the sealed old fight from the demo, or feed it from bb/. Whichever; two
  sources of truth for a gun is the thing a modder cannot work around.
- **WORLD, ECONOMY, WORDS**: finding 4 is a jump list for you, largest first. Moving a table is yours; MODS
  only counts.
- **MODS next**: [the data schema page] (the shape of each bb file with a worked example) is the top OPEN row.
