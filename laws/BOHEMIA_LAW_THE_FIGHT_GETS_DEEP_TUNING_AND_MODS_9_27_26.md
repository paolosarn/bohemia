# BOHEMIA LAW -- THE FIGHT GETS DEEP: TUNING (21) AND MODS (22) (Paolo 9/27/26, LOCKED)
# His words: records/BOHEMIA_PAOLO_450_HOURS_THE_FIGHT_GETS_DEEP_9_27_26.md. Rule 36 on VAMILY.md.

## 1. DEPTH IS THE TARGET
"It took me 450 hours to feel like I mastered all of the combat mechanics." The fight is built to be MASTERED
over hundreds of hours: squad formation (who stands where on the grid, the front line and the second row,
reach in cells), gear (armour that is slightly better and FEELS it), knowledge that pays (what an enemy kind
does, what a weapon shape does), skill that develops. Rogue Fable 4 leads the speed (rule 33d); Battle
Brothers leads the DEPTH. Both at once is the whole ask: "less of a chess puzzle piece and quicker".
COMBAT [formation]: the front line, the second row, flanking and being flanked, in cells, with what each
costs; COMBAT [gambits]: the rest of the company acts on its own (FINAL FANTASY XII gambits, already the
reference for this and only this), so his turn is quick and his knowledge shows in how he set them.

## 2. DEATH, SOFTENED (default, in VOTE)
"Only a 20% chance your character can die, but if they get struck down, a debilitating injury." When a
person is STRUCK DOWN in a fight: 20% they die (buried; the company remembers, the creditor remembers);
80% they live with a DEBILITATING INJURY that takes them out of fights for 30 to 40 game days and leaves a
permanent mark (a scar, a limp, a lost eye, a stat that never comes back). "Vanilla plus Battle Brothers":
his own roster's deaths should hurt and be rare; being out for a month should be common and felt. TUNING
owns the numbers; PEOPLE owns the person (the injured stay in the company, cost their day, talk about it).

## 3. ORIGINS, DIFFICULTY, CUSTOMIZATION
- ORIGINS: the company's starting story sets rules, not just the start (Battle Brothers: the Peasant
  Militia, the Lone Wolf, the Cultists...). Ours: who you were the day the money died (the lineman's crew,
  the casino floor, the ex-cons, the nurse's ward), each at a stated DIFFICULTY. PEOPLE writes the origins
  (the people), TUNING the difficulties.
- DIFFICULTY SLIDERS: "well beyond me, you would need to optimize for that." TUNING designs them: what a
  slider moves (enemy count, pay, injury odds, the death chance itself), what it never moves (the rules of
  the grid), and the default a stranger plays at.
- CUSTOMIZATION: the face maker (HE CAN BUILD HIS OWN FACE) and the runway clothes are the character side;
  ARMOUR ATTACHMENTS (Battle Brothers' cloaks, paddings, spikes: a trade of armour vs fatigue vs a special)
  are new: CHARACTER [attachments], school then cook. Weapons: shapes and reach (rule 33i), little
  customization beyond that, by his words.

## 4. CHAT 21: TUNING (the numbers; Sonnet)
"The smallest changes in numbers mean the biggest difference... a slightly better armour makes a huge
difference... a chat dedicated to the fine-tuning of the gameplay mechanics, rewarding your own knowledge
and skill." TUNING owns every number a player FEELS: damage, armour, hit chance, fatigue, injury odds,
the death chance, costs in batteries, prices per place, the difficulty sliders, the origins' difficulties.
MODE: SCHOOL THEN TUNE. School first: how Battle Brothers tunes (why 5 points of armour is felt; the
armour-penetration and armour-damage split; fatigue as the real limiter; what Legends and other mods changed
and why players kept them; how it is tested), read from the library (reference/library/battle_brothers/).
Then THE NUMBERS TABLE: one data file, every tunable number in it with its reason and its source finding,
nothing hard-coded in a game file; a gate that refuses a number outside the table. TUNING never edits a
system's code; it edits the table and measures the feel through the one driver (does a slightly better
armour change the outcome of the standard fight by a felt amount). It reads the fight through the beat:
quicker than Battle Brothers is the constraint.

## 5. CHAT 22: MODS (mod-friendly, understandable; Sonnet)
"A chat dedicated towards simplifying the code, or just understanding that I want this to be mod friendly
for the community." MODS owns the DATA LINE: every piece of content the community could reasonably change
lives in a data file a modder can read and edit without touching game code (weapons and their shapes,
armour and attachments, backgrounds and names, events and contracts, tiles, sounds, the numbers table,
the words), documented in one place, loaded from a mods/ folder at boot on top of the base content, with a
manifest and a version. MODE: SCHOOL THEN BUILD with PLUMBER: school first on how Battle Brothers is
modded (Legends, the modding kit, what modders needed and lacked), how a web game on a phone can load a mod
(a folder, a URL, a pasted file), and what "simple enough to understand" means for our engine; then the
line, one content kind at a time (weapons first, because TUNING's table needs the same door). PLUMBER
keeps the code small and fast; MODS keeps it READABLE and DATA-DRIVEN; they share the pre-push pass.

## 6. THE ORDER (the manager's; "the running order is mine")
The grid first (rule 34). Then TUNING's school and MODS' school run beside the grid work. TUNING's table
lands when the fight is on the grid; MODS' weapons file is that table's door. Depth is built on a grid
that walks, never before.
