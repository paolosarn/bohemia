# RULE 482 ON THE STAFF AS BUILT (STAFF 2, 11/26/26) -- BUILD 11/26zl THE CAMP RUNS SCARED

VAMILY rule 482 (Paolo 11/26: "More cooking up cleaning up improving things we're already doing type shit") and 480(b), the
coordinator's next for this lane: "the staff as built, better: the cart's look and its upgrades read in a fight, a staff man running
looks like fear, losing one feels like a loss (his face, his name, the hall to rehire). Ship a build he can see." Rules 461 (as amended:
nothing that waits for a tap), 441 (the page he plays, a phone both ways), 465 (no line rewritten; new words the fewest, draft).

## WHAT IS BETTER

- (a) THE THREE CARTS READ APART. MEASURED BEFORE (the close fight picture of 11/22): the steel utility cart was olive paint
  (metal_painted 1) and the wagon an olive bed with brown slats, the colours of the men round them, so in a crowded line the two
  upgrades read as grey boxes. NOW, re-rendered through the same 3-D rig (tools/bohemia_staff_the_cart.py, the style palette's own
  roles): the shopping cart stays wire and chrome with its red handle; the utility cart is worn safety yellow (clay_mustard 2); the
  wagon is a red wagon gone to rust, its bed and slat sides in red paint (clay_rust 1 and 2). Wire, yellow, red: each step up reads at
  a glance, by the bell and in the crowd. 3 x 6 loads x 8 facings re-packed (slices/fight_rig/staff_cart_{utility_cart,wagon}.webp).
- (b) THE CAMP RUNS SCARED (slices/BOHEMIA_FIGHT.html __THE_CAMP_RUNS_SCARED__). MEASURED BEFORE: a camp person getting away from a
  man of theirs walked exactly as a fighter walks. NOW a camp person's walk that starts within 4 tiles of one of theirs and takes him
  farther from the nearest is a scared run, on the glass only: his feet twice as quick (the walk's own six keys at twelve a beat, none
  skipped), the tiles in 0.7 of a walk's time (never under half a beat, the floor at which a turn is seen), his body leant into it (a shear about his feet, 0.09 of his height, to the side he runs),
  his cart upright and rattling two pixels a key; his run off the board when he gets out is scared the same way. In 20 AUTO fights 45 of
  178 camp walks (25%) are scared runs (gate C14).
- (c) LOSING ONE IS A LOSS (slices/BOHEMIA_SPOILS_SCREEN.html __THE_CAMP_IS_MOURNED__). MEASURED BEFORE: a cook struck down left the
  camp book and the end screen never said so (it read the crew; the camp rides home in its own list). NOW each camp person who fell or
  was taken has a row under the men: the face, the name and the trade, "FELL. SHE IS DEAD." (or "LEFT ON THE FIELD. TAKEN."), what went
  over with the cart ("HER CART WENT OVER: 20 FOOD GONE."), the cart the job keeps when the field was held ("THE WAGON WAITS FOR THE
  NEXT ONE."), and "A TOWN'S HALL HAS ANOTHER COOK." The head's dead count counts the camp. In a town's hall the trade that lost one says
  "COOK · YOUR LAST ONE FELL", and the one offered is someone new (the camp book rolls a new person for the job after a loss).
  The camp book's dead list now keeps the trade and sex (engine/bohemia_camp.js lose: word, sex); the shell hands the end screen what
  went (fight.staff[i].lost: word, sex, spilt, the kept cart).

## MEASURED

- THE GATE (THE STAFF PUSH A CART): C14 (the scared run's numbers and hooks, and the 25% in real fights), C15 (the dead cook kept as THE
  COOK with 20 food spilt; the shell and the end screen), C13 (the hall's line), with C1 to C12.
- ON THE PHONE: see the round's proof lines in handoffs/STAFF.md (tools/bohemia_staff_cart_on_the_phone.js R1, M2 on the demo and the
  alpha, upright and on its side; tools/bohemia_staff_hire_reads.js H6, the cook's trade says YOUR LAST ONE FELL and is someone new).

## FILES

tools/bohemia_staff_the_cart.py (the two paints), slices/fight_rig/staff_cart_utility_cart.webp, staff_cart_wagon.webp, staff_carts.json;
slices/BOHEMIA_FIGHT.html (FEAR_RUN, scaredStep, fearLean; take, poseOf, blitManNow, cartLayer hooks); slices/BOHEMIA_SPOILS_SCREEN.html
(drawCampGone); slices/BOHEMIA_ALPHA_0_9.html (r.lost; the stamp); engine/bohemia_camp.js (lose keeps word and sex);
slices/BOHEMIA_SETTLEMENT_SCREEN.html (YOUR LAST ONE FELL); gates/the_staff_push_a_cart_gate.js (C14, C15);
tools/bohemia_staff_cart_on_the_phone.js (R1, M2), tools/bohemia_staff_hire_reads.js (H6), tools/bohemia_staff_as_built_card_picture.py.

[bb Battle Brothers: a brother lost is a name on the end screen and a gap in the roster; ours is the cook's face, what her cart held, and the hall that has another.]
[analog horror: the cook runs with her feet too quick for her body, the wire cart rattling; afterwards the screen reads it flat: 20 FOOD GONE.]
