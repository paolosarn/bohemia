# MODS [range column] -- HOW BIG IS TOO BIG: A DRAFT RANGE FOR EVERY NUMBER (10/10/26)

Lane 22 MODS, session mods-59jyd6. Row: WHAT-A-SANE-NUMBER-IS-FOR-EVERY-FIELD. Rule 22; follows records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md
section 4 ("it checks type, not range"). MODE: research. Nothing in the game changed. The draft is banks/BOHEMIA_MODS_RANGES_DRAFT_10_10_26.json
(`draft: true`, generated, not loaded by anything) by `node tools/bohemia_mods_ranges_draft.js --write`.

## 0. THE ANSWER IN ONE LINE

**A knife that hits for minus 5 used to load without a word. With a range column it loads with a warning that says why.**
The column is computed from the numbers the data files already hold, so nobody had to invent a limit, and it is a
WARNING that never blocks (a modder is allowed to make a legend that hits harder than anything in the game).

## 1. WHAT THE DRAFT HOLDS

**49 numbers in 10 tables across 8 files** (armor, backgrounds, enemies, injuries, origins, perk_translation,
perks, weapons). For each: the smallest and biggest value any base row holds, how many rows carry it, whether it is
always a whole number, and whether it is **never negative in the base**. Examples:

| number | smallest to biggest in the game |
|---|---|
| a weapon's smallest hit (damage_min) | 5 to 95 |
| a weapon's biggest hit (damage_max) | 10 to 120 |
| a weapon's price in crowns (value) | 30 to 3,500 |
| a weapon's reach in tiles (range) | 1 to 7 |
| an enemy's hit points (hp) | 1 to 3,800 |
| an enemy's action points (ap) | 5 to 14 |
| a background's daily wage | 0 to 35 |
| a perk's tier | 1 to 7 |

**Limits the wiki states itself (10), read from rules.json with each one's own quote:** at most 12 men fielded a side,
a roster of at most 20, a hit chance never below 5 or above 95 percent, a morale check never above 95, vision never
below 1, injuries from 10 hit points of damage, the defence soft cap at 50. These are values, not table fields, so they
are listed beside the ranges, not folded into them.

## 2. HOW IT BEHAVES IN THE REFERENCE MERGE (4 more checks, 15 of 15 now pass)

`node tools/bohemia_mods_merge_reference.js <modsDir> --ranges`:

- a knife at **minus 5 and 999** prints two outside-the-game warnings and a "no base row is ever negative" warning,
  **and still loads** (7a, 7b);
- a knife at **20 to 30** prints no range warning (7c);
- **without `--ranges` there is no range warning at all**, so the design's older 11 checks are untouched (7d);
- the check bites: with the comparison replaced by `false`, leg 7a goes red (14 of 15); restored, 15 of 15.

## 3. THE FINDING THAT PROVES THE IDEA WRONG IN ONE PLACE

**"Observed range" punishes exactly the mod a modder most wants to make: a stronger thing than the game has.** A 150
damage legendary hammer is outside 5 to 95 and gets a warning. That is the intended behaviour (it says so, applies
it, and moves on), but the page must not read as a rule. It is a prompt to check, never a verdict. If the warning
were a block, this column would be the thing that kills mods. Hence: **warn, never block**, written into the design.

## 4. WHAT IT DOES NOT COVER

- **Only the top-level numbers of each row.** A number inside a row's own sub-object (a background's attribute
  ranges, an injury's effects, a perk's `numbers`) is not checked yet. 49 of the numbers in the files, not all.
- **Thin fields.** One field has fewer than five rows behind it and two are constant; a range from five rows is a
  guess. The draft marks `rows_with_a_value` so a reader can see how much weight a range has.
- **It is the game's range as of now.** When the base data changes (it grew from 15 to 18 files this week) the draft
  must be regenerated. The tool does it in a second.
- **TUNING owns every row.** The draft is where TUNING starts; where a designer knows the true limit (a fatigue that
  cannot exceed the pool) they overwrite the row.

## 5. ROUTED

- **TUNING**: overwrite any range the numbers table knows better; the draft file is yours to adopt or drop.
- **PLUMBER**: when he says build, the loader reads the ranges file and logs warnings; nothing blocks.
- **MODS next**: [ids never change] is the top OPEN row; [grok sources] waits.
