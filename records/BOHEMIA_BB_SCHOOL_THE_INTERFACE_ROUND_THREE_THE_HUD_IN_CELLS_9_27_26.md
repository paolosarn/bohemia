# BB SCHOOL, THE INTERFACE, ROUND THREE: THE HUD IN CELLS
# UI (chat 11, ui-kmqmrf), 9/27/26. Row [bb interface], rule 33(f) and 33(j).
# Library read first, as 33(j) requires: reference/library/battle_brothers/10_UI_AND_FEEL.md
# and 01_WORLDMAP.md. Rule 34 (Paolo 9/27) is what re-aimed this round.

## WHY THIS ROUND CHANGED SUBJECT MID-FLIGHT
My own handoff said round three was "the BAR: what four readings a Battle Brothers bar carries
against our empty one". Then rule 34 landed: TWO SCALES, ONE GAME. A cell is about 32 px, a
person is ONE CELL (about 28 px), a house is 4 by 4 cells. That does not change the bar
question, it puts a NUMBER under it: the phone stops being 390 by 844 pixels and becomes a
board 12 cells across and 26 down, and every piece of interface now costs a countable number
of cells of world. Nobody had counted that, so this round counts it.

## THE SCHOOL HALF (recall, from volume 10; every number tagged there)
WHAT BATTLE BROTHERS KEEPS ON SCREEN, MAP SIDE: crowns, food days, tools, medicine, ammo, the
day count and a time-of-day sun; the company banner and name; a bottom bar of roster faces with
hitpoint and morale rings; camp, roster, inventory, ambitions, relations; pause / play / 2x.
That is five resources plus time, never taken off, plus a row of faces. FIGHT SIDE: the active
man's skills as icons with their AP and fatigue cost, his three bars, a turn-order strip of
every face, a combat log, end turn / wait / retreat.
THE SHAPE, AND IT IS THE POINT OF THE ROUND: in Battle Brothers the HUD is a FRAME. The strips
sit above and below the map and the map ends where they start. Almost nothing floats on top of
the world. The one thing that does is the hover card, and that is summoned, not resident.
WHAT MOVES, THAT THEIR PICTURE DOES NOT (rule 33g): their sun is a painted icon that steps
through the day. Ours is a bar that BREATHES on the beat, a battery gauge that visibly drains,
an hour that ticks at 120 BPM with the rest of the game. A still strip is where they stopped.

## THE MEASUREMENT HALF, ON THE REAL GAME, ONE RUN
Measured on BOHEMIA_DEMO.html through the one driver (tools/bohemia_drive_the_demo.js), a
390x844 phone, the door walked through before anything was read (doorIsBehindUs true, 22.3 s).

    THE GLASS        390 x 844 px  =  12 x 26  =  312 CELLS at 32 px
    THE WORLD BOX    378 x 794 px at 6,50  =  11 x 24  =  264 CELLS
    THE FRAME COSTS  48 of the 312 cells the phone holds, before one control is drawn.

    menubar    390 x 50 @   0,  0   1.6 cell rows, 26 cells   ABOVE the world, not over it
    notebtn     44 x 44 @ 338,  3   1.4 x 1.4 cells           inside the bar
    gearbtn     44 x 44 @   8, 69   1.4 x 1.4 cells           OVER the world (top page)
    nav+pad     90 x 90 @ 288,748   2.8 x 2.8 cells, 9 cells  OVER the world
    mode        40 x 40 @ 313,773   1.3 x 1.3 cells           inside the pad
    teachring  102 x102 @ 282,742   3.2 x 3.2 cells, 16 cells OVER the world, first run only
    teachsay   203 x 46 @ 211,688   6.3 x 1.4 cells, 12 cells OVER the world, first run only

THE FINGER, asked at every cell centre with elementFromPoint through the iframe: 36 of the 312
cell centres do not land on the world. 24 of those are the top two rows.

## AND THE BAR IS EMPTY, NOW PROVED IN PIXELS AND IN THE TREE
Round one said the bar is empty on the demo. This round has both proofs.
IN PIXELS: hide the bar and the top strip's mean brightness moves from 23.1 to 25.0 out of 255.
It is a black strip either way. The crop shows 390 x 50 of black with one NOTES plate in it.
IN THE TREE, and this is the useful half: the readings are all still in there, switched off.

    barleft   HUMAN MODE           display:none
    barleft   SUBURB - ON FOOT     display:none
    barmoney  (empty)              0 x 0
    barmid    DAY 1 - 06:00        display:none
    barright  MENU - <track name>  display:none
    barright  SAVE                 display:none
    barright  TOOLS                display:none
    barright  NOTES                44 x 44, the only thing painted

Four readings and three buttons, written and turned off. So "put three readings in the bar" is
a switch, not new work, and that is what makes the vote item cheap to honour either way.

## THE NUMBER THAT IS THIS LANE'S OWN, UNDER RULE 34
A person becomes ONE CELL, about 28 px. Today a walked body is about 100 to 112 px.
    THE WALK PAD IS 90 x 90. Against today's body that is less than one man.
    Against a one-cell man it is 3 BY 3: THE PAD THAT HID ONE MAN WILL HIDE NINE.
    A 44 px thumb is 1.4 cells. THE FINGER DOES NOT SHRINK WITH THE WORLD.
That is the whole design problem of [one hud] in one line: rule 34 shrinks the world by three
and a half times and shrinks the interface by nothing, so every control that floats on top of
the world gets three and a half times more expensive on the same glass.

## THE SHAPE FOR US (this is [one hud]'s rule-34 half, not a new row)
1. THE BAR IS THE FRAME, NOT A LAYER. Battle Brothers' readings live in a strip the world does
   not reach. Ours already does too: the bar sits ABOVE the world box, so its 26 cells are
   already spent whether it says anything or nothing. Every resident reading goes there.
2. WHAT FLOATS OVER THE WORLD IS ARGUED CELL BY CELL: the gear (4), the pad (9), the teaching
   (28, first run). That is the budget, and it is the same budget on the map, the street and
   the fight, which is what one HUD means.
3. THE ONE THING THAT MAY NOT MOVE INTO THE BAR is the pad, because it is the finger, and the
   finger is 1.4 cells no matter how small the world gets.

## THE INSTRUMENTS I GOT WRONG, ALL THREE, AND WHAT EACH ONE TAUGHT
This is the third round running that this lane's first number was clean and wrong.
(1) TAKE ONE counted every absolutely-positioned rectangle as interface and reported THE HUD
    COVERS 100% OF THE GLASS. It had counted #teachwrap, a 390x844 transparent wrapper with
    pointer-events:none. A RECTANGLE IS NOT A COVER.
(2) TAKE TWO hid the roots it found and diffed the picture. The only root in the top page was
    #app, which is the entire game. It hid the game, measured the game, and said 77%.
(3) TAKE THREE decoded the screenshots with a PNG reader I wrote that assumed four channels.
    Chromium writes colour type 2, which is three. Every index was off by a third of a pixel
    and the map it drew was noise dressed as a map. THE READER THAT KNOWS BETTER WAS ALREADY
    IN THIS LANE'S OWN GATE (gates/the_phone_never_opens_black_gate.js reads the colour type
    and refuses what it cannot handle). I wrote a second one instead of reusing it. REUSE-FIRST
    is not only about art.
(4) AND THE PAINT DIFF NEVER GAVE A NUMBER, WHICH IS ITSELF THE FINDING. With the decoder
    fixed, two shots taken 400 ms apart WITH the interface still on differ by up to 84 of 255
    in one cell. The game's own repaint in a cell is bigger than the interface's contribution
    to that cell. So a cell-sized picture diff CANNOT separate interface from world on this
    surface, and I am not reporting a painted-cell count. The geometry above is the answer,
    and the bar's brightness pair is the one pixel claim I will stand behind.

## FOR HIM, IN THE VOTE TAB
ui-what-the-bar-says-9-27, slices/vote/UI_WHAT_THE_BAR_SAYS_9_27.png. Three phones, one real
shot of the street from the game's camera, only the strip changes: A what it says now (nothing),
B three readings, C five (the Battle Brothers count). The new cell grid is drawn across the
strip so the cost is visible. This is the item that answers the [PENDING Paolo] this lane has
carried for four rounds.

## NEXT ROUND
Round four is THE ROSTER STRIP: Battle Brothers puts twelve faces with two rings each on screen
and never hides them; we have one man and a companion coming. What that is on 12 cells across,
and what it means for the fight, where the same faces have to carry whose beat it is.
