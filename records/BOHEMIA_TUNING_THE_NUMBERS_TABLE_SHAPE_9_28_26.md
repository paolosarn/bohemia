# TUNING ROUND 3 -- [numbers table] ONE FILE, EVERY FELT NUMBER: THE SHAPE (9/28/26)
# Row: VAMILY TUNING [numbers table], MODE RESEARCH (rule 38g: build nothing; "the numbers table is the SHAPE
# you recommend, and PLUMBER with COMBAT wires it when he flips you to build"). Law: fight-gets-deep s4.
# Paired with MODS [data line] (records/BOHEMIA_MODS_SCHOOL_HOW_BIG_GAMES_PUT_CONTENT_IN_DATA_9_28_26.md):
# their slices/data/<kind>.json door is this table's door; this page is the `tuning` kind.
# Deliverables: the draft table records/BOHEMIA_TUNING_NUMBERS_TABLE_DRAFT_9_28_26.json (draft:true, nothing
# reads it) and the instrument tools/bohemia_tuning_census.js (reads the fight, refreshes the draft's live values).

## 1. HOW STUDIOS KEEP THEIR FELT NUMBERS (recall-grade, marked; to verify online next round)
- BATTLE BROTHERS: numbers live in plain script tables (scripts/config/*.nut, the item and skill files), readable
  text, which is why Legends could rebalance everything. Lesson: one readable place beats clever code.
- XCOM 2 (study only): weapon damage, aim, crit, armour sit in .ini files (DefaultGameData_WeaponData.ini),
  one block per item. Balance mods are ini edits. Lesson: a row per thing, a field per number.
- SUPERCELL's phone games (study only): balance ships as CSV tables the server can push, so a rebalance does
  not wait on an app update (dataminers read them every patch). Lesson for a PHONE game: the table is a file
  the build fetches, so a number moves without re-cutting anything.
- RIMWORLD (study only): XML Defs, every number with a name; modders patch by path. Lesson: stable ids.
- THE COMMON PRACTICE (designer-side, recall): designers own a spreadsheet, the build reads an export, and every
  row carries a comment saying why. Numbers without a reason get "fixed" back by the next person.
WHAT THEY SHARE: a stable id per number, a file a human can read, the reason next to the value, and SANE
BOUNDS so a slider or a mod cannot break the game.

## 2. OUR BUILD, MEASURED (tools/bohemia_tuning_census.js on 9/28 main)
- The fight is 14,928 lines inside one base64 blob with 128 top-level numeric constants. All 21 felt ones this
  lane named are there and read live; 8 enemy kinds (hp, accuracy, damage range) read live.
- A difficulty system ALREADY EXISTS for the dial (EASY_PKG_SLOW 0.81, "the difficulty-package system", 52
  patterns). It moves the dial's speed only. [difficulty sliders] starts from it, not from zero.

## 3. THE FINDING THAT PROVES US WRONG
THE MOST FELT NUMBER IN THE FIGHT IS NOT A CONSTANT AT ALL. How often an enemy hits you is
0.97 - distance x 0.60, x0.6 if he is not firing, x0.8 if he is wounded, written as bare numbers inside
distAccuracy and doWait. Same for the vital shot (55% of max). A census of named constants would call the
fight "tuned in one place" and miss the numbers that decide whether you live. So the future gate cannot be
"every const is in the table"; it has to be "every number on THE FELT LIST is read from the table", and the
list is the table's own ids. Five of these inline numbers are named in the draft's next rows (section 5).

## 4. THE SHAPE, RECOMMENDED
ONE FILE, slices/data/tuning.json (Pages publishes slices/; MODS' door). Each row:
  id       dotted and stable: armour.plate.hold, death.struck, age.doubling. Mods and sliders patch by id.
  value    the number (the draft carries it as `live` read from the build).
  unit     hp, chance, ms, beats, pips, game days, x.
  feel     what the player feels, in plain words. If you cannot write this line, it is not a felt number.
  reason   why this value; source: the finding or ruling it came from.
  owner    the lane allowed to change it (mostly tuning; combat for kill.dmg and the mound; economy for loot).
  range    [min, max]. A slider or a mod is clamped here, and a value outside is refused with a message,
           never a crash (MODS' "a wrong version warns, it does not block").
  slider   true if a difficulty slider may move it. This is how [difficulty sliders] stays honest: a slider
           is a list of multipliers on rows marked true, and the grid's rules are simply not marked.
  status   live | proposed | ruled-not-built, so his rulings (20% dead, 10% veteran, 30-40 days) sit in the
           table before the code exists and nobody re-invents them.
LOADING (for PLUMBER and COMBAT): the fight reads its constants at boot as top-level consts. MODS measured
the same wall. The cheapest wiring is one line at the top of the blob that fills a TUNE object from the fetched
file with the current values as defaults, and each named const becomes TUNE['id']. If the file fails to load,
the game plays exactly as it does now.
THE GATE (for the day it is built, a ratchet): the felt list is the ids with a `const`; the gate fails if a
listed const is assigned a bare number in the blob instead of read from TUNE. It starts with 21 and can
only grow. The census tool is its measuring half, already written.

## 5. NEXT ROWS TO NAME (inline numbers, section 3)
hit.enemy.pointblank 0.97, hit.enemy.falloff 0.60, hit.enemy.notfiring 0.6, hit.enemy.wounded 0.8,
dial.vital 0.55. Each needs a `const` in COMBAT's code before the table can hold it; routed, not done.

## ROUTED
- PLUMBER + COMBAT: section 4's loading line and the ratchet, the day he says build.
- MODS: the `tuning` kind uses your manifest and patch-by-id; ranges are the clamp you asked for.
- COMBAT: section 5, five inline felt numbers to lift into named constants.
- TUNING [difficulty sliders]: start from the existing dial difficulty packages; a slider = multipliers on slider:true rows.
- Test material: the draft JSON is draft:true; nothing in the game reads it.
