# UI [the demo's screens] ROUND ONE: THE FIGHT'S BAR, FINISHED (10/4/26, ui-kmqmrf)

Rule 54b opened UI for the demo; rule 67 (his sixth votes): 'the UI is AI dogshit slop... not like a
studio-made game'; rule 71's tells: default fonts, flat boxes, drop shadows, centred labels, text where a
picture belongs. COMBAT had already built the bar on Battle Brothers' layout in our materials (121a460),
so this round is the finish, not a second bar. It lives in the shared slices/bohemia_ui_materials.js
(COMBAT's file for "one UI every second"), so BOHEMIA_FIGHT.html is untouched and any screen that calls
BohemiaMaterials.apply() wears the same finish.

WHAT CHANGED, before -> after, on the phone (390x844 at 3x, the one driver):
- Type: ui-monospace -> the game's own faces from slices/fonts: CASING (stamped 5x8 cut) on labels on things
  (END TURN, WAIT, AUTO, R1, the name), ROM (the character-cell cut) on what the thermal printer prints (the
  hint, the drawer, the recap).
- Tags: centred words -> read from the left under a printed 12 px mark (hourglass, clock, two arrows).
- Paper: soft box shadows -> a hard one-pixel contact edge that follows the torn foot of the receipt.
- The receipt's faded print rows sat behind every number on the drawer and read as strike-throughs: gone.
- The hint was cut off ("Pinch fo..."): it wraps and stays whole on the glass.
- The cardboard shows its cut edge (flutes) along the top of the bar, inside its own top padding.
- The drawer's title was gold on white paper: now the printer's one ink, stamped in CASING.

MEASURED: gates/the_fight_bar_is_studio_made_gate.js 15/0. FOUR MUTATIONS, each caught and restored:
centre the labels -> 1 red; print rows back -> 1 red (row jump 10.4 vs <4); a 6 pt taller bar -> 1 red;
fonts removed -> 1 red, BUT ONLY AFTER A FIX: document.fonts.check() answers true for a family with no
face at all, so the first version passed with the fonts deleted; the leg now requires the face loaded.
COMBAT's gates: THE REBUILT FIGHT PLAYS 74/0, THE PERKS ARE LIVE 47/0. They went 73/1 once on my first cut:
the edge made the bar 6 pt taller, the fight fits its board to the bar, and the scrub board ran 408 wide on
390 glass. Fixed (the edge sits inside the padding) and held by the new 'never moves the board' leg.

NOT DONE: a drawn icon for every TRAIT (no trait list exists in the game; records/target/bb has none);
the health and armour bars still carry no numbers; skill squares untouched (COMBAT's glyphs).
VOTE: ui-the-fights-bar-10-4 (before/after). NEXT: (2) THE START SCREEN.
