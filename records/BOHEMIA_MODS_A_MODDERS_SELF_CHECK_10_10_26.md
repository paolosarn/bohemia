# MODS [mod checklist] -- A MODDER'S SELF-CHECK, IN PLAIN WORDS (10/10/26)

Research, help only, nothing built in the game. `node tools/bohemia_mods_check.js <folder holding your mod folders>` runs your mods through the reference merge and prints one line saying whether anything changed and how many parts were skipped, then each step. Anything skipped or noted shows its code (M01 to M20), what it means and how to fix it, from records/BOHEMIA_MODS_PLAIN_WORDS_WHEN_A_MOD_IS_WRONG_10_10_26.md. It never refuses a mod.

What changed to make it possible: every warn or skipped message in the reference merge now carries its code as a third value, so the check does not guess from the words. tools/bohemia_mods_error_messages.js now also fails if a message is tagged with the wrong code. Merge proof still 27 of 27.

Try it: `node tools/bohemia_mods_check.js tools/mods_reference/example_mods` (the broken example shows M16, M17 and M13).
