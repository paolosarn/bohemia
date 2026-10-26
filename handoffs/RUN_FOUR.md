RUN FOUR (run-four, the end-of-fight screen alone: slices/BOHEMIA_SPOILS_SCREEN.html, engine/bohemia_spoils.js, slices/bohemia_aftermath.js,
and the shell's __THE_SPOILS__ block in slices/BOHEMIA_ALPHA_0_9.html; opened 10/26 by the coordinator as a split of RUN TWO, who keeps
the shop, the stall and the crew): 10/26 LATEST -- nine rows SHIPPED, all BUILT, NOT YET SEEN:
[optimize loot] + [one tap selects, two taps take] 8907a49e (BUILD 10/26u); [scrap is tape] 5209dead (10/26zf); [tape in the loot]
958f0f6a (10/26zg); [the aftermath plays behind the loot screen] + MAKE CAMP (RUN FOUR's half of CAMP's [make camp from the fight])
in one ship, 2c3d9698 (BUILD 10/26zk); [one roll a fight] 33b06264 (10/26zn); [every level waits for him] 2a11816a and
[eyes: the road crew ran] ccebf262 (BUILD 10/26zza).

WHAT IS LIVE ON EVERY FIGHT'S END SCREEN (the demo; the page alone shows a sample):
- THE HEAD SAYS WHAT HAPPENED: the fight hands one head for every win ('THE ROAD CREW RAN'); the screen says it off the bodies the fight
  hands over: all beasts THE PACK, else their faction (RAIDERS, MACHINES, KIDS, HEAVIES); RAN only when some ran, BROKE AND RAN when some
  fell and some ran; the fight's other heads stand. The crew line counts NEW LEVELS, never 'climbed'.
- EVERY LEVEL WAITS (rule 281): each man shows +N, every level waiting to be spent (the climb's banked rolls plus this fight's), and his
  button says SPEND YOUR N LEVELS, whether or not this fight gave one. Measured: no level was ever lost on any path (two fights, a reload
  by CONTINUE, the crew screen opened and never). What he read as lost is the origin's door: it hands its men levels already spent
  (engine/bohemia_origin_start.js rollMan: the Lone Wolf at level four, 2 to 4 taken). The crew card's plus and that door line are
  RUN TWO's (NOTE on their board).
- THE AFTERMATH (rule 245): the black is gone. Behind the screen, the fight that just ended, read off its frame still standing behind
  (FIGHT through its own eval, FIGHT_UI.board, lookOf, sheetOf, gunSheet, its packed sheets, its BohemiaIdles; nothing new loaded but
  ANIMATION's act sheets, which landed: loot and tend play by name): the dead and the down where they fell, a pool under each; his men
  who can walk: a quiet first, the watch when three stand, a friend down gone to first, then body to body, a smoke, two meeting to talk;
  a walk leg never longer than five seconds (the stride quickens instead); the fight's near stop, a hand-held follow four bars a man; a
  phone gets a 30vh window on the field, a computer the open ground under the crew column; 56 percent black, a vignette and tape
  scanlines as one overlay picture; twelve frames a second; the draw catches its own errors (state().errs).
- TAPE (rule 284, his 'you're about to crash my economy'): a won fight leaves exactly ONE roll ('+1 TAPE'), a lost or fled fight none,
  kills and wrecked pieces nothing (records/target/bb/tape_income.json loot_tape.per_won_fight 1; per_kill and salvage.tape_per_scrap
  0, the old values kept beside them). The old-save scrap conversion converts nothing more; tape already in a save stays.
- OPTIMIZE LOOT beside LOOT ALL when loot is left that will not all fit; one tap makes the stash worth the most it can at the shop's own
  price (KEEP, bought, worn, a job's never move); UNDO until he leaves.
- ONE TAP SELECTS (outline, the facts in the strip, no box moves), TWO TAPS / a double click / a right click take it or put it back.
- MAKE CAMP beside LEAVE (after won, lost and ran; not a wipe): home like LEAVE, then CAMP's BohemiaMapCamp.make() at the fight's tile,
  the finished fight's contact flag cleared first.
- A phone's bottom: [MAKE CAMP][LEAVE] the last row; [LOOT ALL][OPTIMIZE] the row above while there is loot; the strip over them.

DECISIONS WRITTEN DOWN (no questions asked):
- KEEP = the shop's isJunk's other side, so the same pieces wear KEEP in the shop and here.
- The swap is the same at every town; the shown gain is the plain price's until the game hands open({sell:{add, mult}}).
- Security first after a fight: with three standing, one takes the watch before anyone searches.
- THE AFTERMATH's frame line: the back's draw under half a 60 Hz frame on average, never a frame's budget at the 95th.
- The level bug was fixed where he looks after a fight (the count on the end screen), not by giving levels back: none were lost.
- The end screen's head is fixed on my side, not in the fight file (COMBAT's; my brief says do not edit it). NOTE on COMBAT's board.

GATES (all in the suite): EVERY LEVEL WAITS 12/0 (new), THE SPOILS 28/0 (S3 new: who they were), SCRAP IS TAPE 11/0 (400 rolled fights
all +1), OPTIMIZE LOOT 22/0, THE AFTERMATH 20/0, MAKE CAMP FROM THE FIGHT 11/0, THE FIGHT'S BARS AND THE END SCREEN 6/0, DEMO BUILD 25/0.
ECONOMY re-aimed NO RUN ENDS FOR TAPE to the one roll (5a739556, 19/0). NOTE for UI: slices/bohemia_ui_materials.js
still carries .count[data-count=scrap] (dead, matches nothing).

NEXT for this lane: the queue on my board is empty. UI THREE's per-man arrows for a picked loot piece (their NOTE on my board) when their
one stat component lands. When RUN TWO puts the plus on the crew card, EVERY LEVEL WAITS W4 reads their '#levelup' head ('3 LEVELS WAITING').
Records: records/BOHEMIA_RUN4_OPTIMIZE_LOOT_AND_THE_LOOTS_TAPS_10_26_26.md, records/BOHEMIA_RUN4_SCRAP_IS_TAPE_10_26_26.md (with the one
roll), records/BOHEMIA_RUN4_THE_AFTERMATH_BEHIND_THE_LOOT_10_26_26.md, records/BOHEMIA_RUN4_MAKE_CAMP_FROM_THE_FIGHT_10_26_26.md,
records/BOHEMIA_RUN4_EVERY_LEVEL_WAITS_FOR_HIM_10_26_26.md, records/BOHEMIA_RUN4_THE_END_SCREEN_SAYS_WHO_10_26_26.md.
[bb Battle Brothers' loot screen fills the room there is and leaves the rest to a drag at a time, its back a flat panel, its camp a
second button on the world map, its tools bought at the market; ours does the drag for him at the shop's price, plays the minutes
after on the fight's own ground, camps where the bodies are, and pays one roll of tape a won fight.]
[analog horror: what you leave on the ground stays marked, a dashed rust edge round each piece you walked away from; behind the
screen the camera on his men is a tape, scanlines and the edges going dark, and the bodies never get up.]
