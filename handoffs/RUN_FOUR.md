RUN FOUR (run-four, the end-of-fight screen alone: slices/BOHEMIA_SPOILS_SCREEN.html, engine/bohemia_spoils.js; opened 10/26 by the
coordinator as a split of RUN TWO, who keeps the shop, the stall and the crew): 10/26 LATEST -- [optimize loot] and [one tap selects,
two taps take] SHIPPED, BUILT, NOT YET SEEN (BUILD 10/26u - OPTIMIZE LOOT). [the aftermath plays behind the loot screen] IN FLIGHT:
built and walked on the demo, its gate being written; WIP on branch run-four-loot (git stash 'aftermath-wip' was popped there).

WHAT IS LIVE (the demo: any won fight's end screen; the page alone with a sample):
- OPTIMIZE LOOT beside LOOT ALL whenever loot is left that will not all fit (with a full stash, any loot left). It says its gain
  before the tap (a battery, a green up arrow, by how much). One tap: the cheapest pieces he did not choose go back on the ground for
  the dearest left, until nothing left beats the cheapest kept (engine/bohemia_spoils.js optimize, pure; the shop's own sellBack and
  isJunk, held equal by the gate). KEEP as the shop marks it (bought, kept, never let go) and anything worn, held, bagged or a job's
  never moves. The strip shows down what it left, up what it took, the battery gain; new pieces lit gold, left ones dashed rust. Then
  the button is UNDO until he leaves: every piece back in its slot, the saved bag too.
- THE STRIP (58 px, always there, printed receipt): the screen's line, or the picked piece (picture, name, what is left as a fill,
  where it came from, KEEP, what a town pays), or what OPTIMIZE did. On a phone it rides over the bottom bar.
- ONE TAP SELECTS (bright outline, no box moves), TWO TAPS (a double click, a right click) take it or put it back (rule 249).
- What is left of a worn piece is a fill along the box's foot, not '42%' (rule 224).

DECISIONS WRITTEN DOWN (no questions asked):
- KEEP = the shop's isJunk's other side, so the same pieces wear KEEP in the shop and here; a bought piece is his until he lets it go.
- The swap is the same at every town (a town moves every price by the same cut and trait; the floor never reverses two), so the pick
  never needs the nearest town; the shown gain is the plain price's until the game hands the nearest town's standing and trait over
  (open({sell:{add, mult}}) takes them; nothing sends them yet).
- OPTIMIZE never takes the counts (batteries, rounds, scrap take no room and ride home on LEAVE), so UNDO is exact.

GATES: OPTIMIZE LOOT 22/0 (new, gates/optimize_loot_gate.js: 600 rolled stashes against every possible stash at six towns; the shop's
price cut out of its file; phone and computer real taps; UNDO exact; one tap moves nothing; the live demo). THE SPOILS 27/0 (its S1
re-aimed to two taps, rule 249). THE FIGHT'S BARS AND THE END SCREEN 6/0, EVERY FIGHT HANDS HIM BACK 10/0, THE HEAL BUTTON 16/0,
DEMO BUILD 25/0, HANDOFF 10/0. Full suite unmeasured. RED ON MAIN AND NOT MINE: THE WAGON AND THE SIX C8a (its regex wants the start
screen's forget list to end at 'bohemia.supplies.v1'; CAMP added 'bohemia.condition.v1' and 'bohemia.wear.v1' after it; the list
still forgets the wagon) -- the wagon gate's owner re-aims the regex.

NEXT for this lane: [the aftermath plays behind the loot screen] (rule 245): slices/bohemia_aftermath.js on run-four-loot plays his
men on the fight's own board (read off the fight frame still standing behind: FIGHT through its own eval, FIGHT_UI.board, lookOf,
sheetOf, gunSheet, the packed sheets it holds, its BohemiaIdles), a friend down first, then body to body, a smoke, two talking; the
phone gets a 30vh window on the field over the crew; dim 0.56 and a vignette; the words on the scene carry a dark ground. Then its
gate (gates/the_aftermath_gate.js: rolled fights, the fight's board and dead, survivors in acts, contrast at 4.5:1 for every word on
the scene, frame time, phone and computer), the research record, ship. ANIMATION's [the minutes after a fight] (kneel and loot, bind a
cut) plug into A.ACTS in that file: a stop plays BohemiaIdles.activity(look, seed, now, face, {act}) when his look has it.
Records: records/BOHEMIA_RUN4_OPTIMIZE_LOOT_AND_THE_LOOTS_TAPS_10_26_26.md.
[bb Battle Brothers' loot screen fills the room there is and leaves the rest to a drag at a time; ours does the drag for him at the
shop's own price, and hands it back with one tap.]
[analog horror: what you leave on the ground stays marked, a dashed rust edge round each piece you walked away from.]
