# COOK FOUR ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
=== COOK FOUR: THE SETTLEMENT FROM THE PACKS, round 1 (10/10, cook4)
[the settlement from the packs] CLAIMED, round 1 in, NOT LIVE. The twelve settlement sheets (camp, town, fortress x2, day+night) rebuilt from 167 of his approved pack tiles by tools/bohemia_cook4_settlement_from_packs.py (refuses any tile not UP in the 7/13 confirmed set); hotspots copied to the pixel; output slices/settlement_ground_packs/. AT DIRECTION (rule 87) with slices/vote/COOK4_THE_SETTLEMENT_FROM_THE_PACKS_TWIN.webp; not in VOTE until passed. NEXT ROUND: the whole-cottage roof tiles and the thirty house skins instead of flat facade strips, gaps and a broken house in the town row, lamp cones that fall forward. Record records/BOHEMIA_COOK4_THE_SETTLEMENT_FROM_THE_PACKS_10_10_26.md. TAKER when passed: RUN TWO (swap the folder). ROUND 2 IN: Vegas stucco town from the house skins + pack roofs/doors/windows, alleys, a fallen house, forward lamp light, REFERENCE CHECK closed. NEXT: the camp ground grid, the fortress side walls. ROUND 3 IN: DIRECTION's three notes done, registered in VOTE (cook4-the-settlement-from-the-packs-10-10). NEXT: on his UP, RUN TWO swaps the folder in; then [the place sits in the map]. Pages gate's 260 MB cap is red at 492 MB before this round (+7.6 MB here): PLUMBER's.

=== COOK TWO: HOW A STEP IS DRAWN, and the defect under it
Row [tape skip] is CLAIMED. Before building any of it:

*** camCell REFUSED ANY MOVE OVER FOUR CELLS AS A TELEPORT. A STEP IS 25. ***

That ceiling was written 8/23, when a step was one cell and the bike's four was the
biggest thing a beat could move -- its own comment says exactly that. Rule 16 made a
step a whole lot and nothing connected the two numbers. So every full step has been
killing its own glide on its first drawn frame: the chip in the drawer says SLIDE,
the source says SLIDE, and WHAT SHIPS IS GRID, the whole world jumping 275 px in ONE
frame, twice a second. Measured on the walked city: gliding true on 0 of 60 samples
across a press, then alive again after.

AND IT BROKE THE WALK UNEVENLY, WHICH IS WHY IT SURVIVED. A press shortened by
something in the way moves one or two cells, fits under the old ceiling, and glides
fine. 9 of 12 presses in a suburb are shortened -- WALK NEVER MISSES agrees from its
own instrument, 15.2 cells a press against a 25 ceiling. So the walk slid when a
wall was near and teleported when the road was clear, and neither reads as a bug.
A NUMBER TYPED INTO A GUARD EXPIRES SILENTLY, because a guard that refuses
everything looks exactly like a feature nobody turned on.

THE THIRD FEEL, TAPE, IS BUILT AND IS THE DEFAULT. The ground holds on the lot he
left for 55% of the beat, drops through two stations, and lands on the next lot on
the beat. Measured through the game's own curve at 1 ms, one lot = 275 px:
    feel     ground positions a beat   moves   biggest single move
    GRID                           2       1                 275px
    SLIDE                        273     272                   2px
    TAPE                           4       3                  94px
TAPE IS THE SMALLEST HONEST MOVE FROM WHAT SHIPS, NOT THE BIGGEST: it breaks one
275 px jump into three of 94, where SLIDE would be the large change. That is why
setting the default is safe under rule 18. His to correct in VOTE.
The curve is written ONCE; camCell, the seam, the gate and the vote page all read
that one copy.

=== WHAT I COULD NOT MEASURE, AND I AM NAMING IT INSTEAD OF SHIPPING A FIFTH RULER
The per-frame ground motion AS DRAWN ON GLASS is not measured. This box clamps a
headless page to about twenty frames a second, fewer than a beat contains, and a
ruler that samples slower than the thing it measures cannot count how many times
that thing moved. Four cuts of that instrument; STOP PRODUCING says the fourth
version means you already failed, so it is named. That is why [tape skip] is
CLAIMED and not SHIPPED: its ship test wants the one driver's walk, and I will not
mark a line shipped off a number I did not take.

=== THE GATES
NEW: TAPE SKIP (gates/the_step_is_a_tape_skip_gate.js), 24 ok 0 failed, 4 mutations
caught, registered in the suite. Its load-bearing claim -- "a full step is really
drawn in flight" -- TOOK FOUR CUTS AND THE SAME MUTATION CAUGHT EVERY WRONG ONE:
a flag the step sets and only a draw clears; a distance-along that scores a
completed middle lot as in-flight; an off-lot test that passes on the short steps
the old ceiling always glided. It carries a vacuous-pass guard: no full-lot step
seen is a FAIL, not a pass.
UPDATED: RUN's walk_feel_gate had the SAME expired constant, and its own comment
already said the bound should be the guard's ceiling before typing 4 out by hand.
It asks the guard now. 17 passed 3 failed, WHICH IS EXACTLY WHAT IT IS ON CLEAN
MAIN -- triaged in a worktree, same three claims, none of them mine. One of the
three improved on my tree anyway: "the camera is between cells" 2.5% -> 22-30%.
GREEN: WALK NEVER MISSES 19/0 (the half of the ship test I can take), VOTE TAB
28/0, COOK EVERY ROUND green on this lane, NO SHOTS 4/0, PAGES PUBLISH 18/0.
Rule 13's honest sentence: pre-push pass green; full suite 107 red at ad23d875,
none of them named as mine.

=== FOR RUN, NAMED NOT CROSSED
- The glide block is yours (__WALK_FEEL_SLIDE__, 8/23). The ceiling fix is inside
  [tape skip] because the row is impossible without it.
- 9 of 12 presses do not complete a lot. A 25-cell step rarely has 25 clear cells,
  so whatever the stride depicts has to survive being cut to one or two.
- A feel he has flipped by hand lives in localStorage and beats the default, so the
  new default only reaches a phone that has never touched the chip.

=== STILL TRUE, UNCHANGED
- HC 11 is the one walk camera where a house fits a phone; one lot is 275 px there.
- The fight gets 112 and the street gets 56 from the same render; CAST_PX stays 56.
- Two live numbers for a lot: the lattice says 24, step and body say 25.

WHAT IS LEFT OF [redo killed], still CLAIMED, frozen off the play surface: four gun
frames still draw a detached head; beats two and three are one per-facing problem;
four clips still snap, worst 12.6 px; POSEHOLD key density.

Nothing [PENDING Paolo].

