# FIXES THREE -- THE ALPHA OPENS ON THE MAP, AND THE TOWN NEVER ASKS FOR A FACE IT DOES NOT HAVE (11/21/26)

FIXES 3 (session_01GKDyuw4msTZutLEGiuMWVT), the heir of FIXES 2 (handoffs/FIXES_TWO.md carries both). Sent by the coordinator 11/21:
(1) the alpha's NEW GAME opens in a town or on the walked city it kept, with no phone, instead of on the map (found by ECONOMY THREE,
11/20o note; RUN has no lane); (2) EYES' rows 653, 654, 655; (3) FIXES 2's open rows. FIXES 2's pushed branch fixes2-work was read
first: its tip (a10145c3, the F649 leg) is byte for byte in main (both its files equal main's), so there was nothing to pick up.

## 1. THE ALPHA OPENS ON THE MAP (ask row 668, rules 38(b), 236, 441)

MEASURED BEFORE, a phone 390 x 844 with touch, a fresh game (the driver as a stranger, the dark on), the alpha and the demo:

| | the alpha | the demo |
|---|---|---|
| the first town | Caravans / Cartel, over MODE 'human' | Colorful / Network, over MODE 'city' |
| LEAVE on the phone | the walked street: the eight-way pad, HOLD TO WALK, BUILD HERE / SCAVENGE / BIKE / SLEEP, the quest line over the roofs, NO PHONE | the map, its phone |
| a save written on the walk, reopened | the walk again | (the demo never writes one) |
| a pinch in at the map's closest stop | onto the walk | the camera stops |
| the walk pad on the map | live under the phone (294,706, 90 x 90; each wedge the top thing at its own middle) | gone (the cut's NO CITY WALK) |

THE CAUSE: the city frame put itself on the map only when told it was the DEMO (CT_IS_DEMO, demoOpensOnMap, __NO_CITY_WALK__ RUN
9/28). The alpha's frame was 'the workshop', kept on the walk under rule 18(g) 'the alpha keeps everything' 'until [no city walk]
excavates it'. Rule 38(b), newer: 'TILE-TO-TILE THROUGH THE CITY IS DEAD, immediately', and the alpha is the link he plays.

THE FIX (slices/BOHEMIA_CITY_WORLD.html __THE_ALPHA_OPENS_ON_THE_MAP__): the city framed by the game's own shell (the frame the shell
names cityFrame: the alpha's RUN and the demo) is the game for the map: CT_IN_SHELL, ctTheMapIsTheGame(). It is seated from his feet
and opened on the map the way the demo is (the same SEATING swap, the same demoOpensOnMap); a save written on the walk comes back on
the map with the marker on his feet (__WALK_SAVE_TO_MAP counts it); a pinch past the closest stop stops (the pinch seam's __demoMap);
the walk pad and DROP IN (#nav) leave the alpha's map. The demo's OTHER looks stay the demo's (only the final art, the lean map, the
street stop, the ending, the quiet first minute): those read CT_IS_DEMO, untouched. A page that opens the city file on its own (the
237 checkers that do) keeps the old bench: it boots on the walk, as before (leg B1).

MEASURED AFTER (the same driver, the same phone): the alpha's first town (Church, Blues, Mob) stands over MODE 'city'; LEAVE lands on
the map with the phone, 0 walk pads on the glass, upright and on its side; a walk save restored lands on the map (moved 1); six
pinches past the closest stop leave the camera at the stop on the map. The alpha opens in 30 s on this box where the driver used to
wait out its whole 120 s clock (see 3).

## 2. THE TOWN NEVER ASKS FOR A FACE IT DOES NOT HAVE (ask row 564, FOUND BY PLUMBER 8 11/10; PORTRAIT has no lane)

engine/bohemia_wound_faces.js asked for records/target/portrait/wounds/<look>.json for every person it might mark; the 178 looks with a
sheet answered, every other look (person_woman_2 and the rest) answered 404, a round trip on his phone's network for each, every
session. NOW (__ONLY_THE_SHEETS_THAT_EXIST__) the folder's own list, records/target/portrait/wounds/BOHEMIA_WOUND_LOOKS.json (written by
tools/bohemia_portrait_the_face_shows_the_wound.py after every pack, or `python3 tools/bohemia_portrait_the_face_shows_the_wound.py
looks`), is inlined in the engine for the first ask and fetched fresh after; a look not on it is never asked for (BohemiaWoundFaces
.noSheet counts the asks it saved). A sheet made after the inlined copy is asked for once the fetched list names it.
GATE: THE FACE SHOWS THE WOUND, new legs F2b (the list is the folder's own, the engine inlines it exactly; three looks with no sheet
asked 0 times, a look with one asked once; PLANTED with the guard taken out: 4 asks): 32 passed, 0 failed.

## 3. THE DRIVER WAITED 120 SECONDS FOR A WALK THE DEMO NEVER HAS

tools/bohemia_drive_the_demo.js open() waited for MODE 'human' with eight pad wedges before it handed the page back. The demo opens on
the map, so every open of the demo sat out the whole 120 s clock (MEASURED: open took 148 s). It now also takes the map, up (MODE
'city' with the map's opener done), as the world being there: the alpha opens in 30 s. A new option, walk: true, keeps the alpha's
city on the bench's walk (window.__BOH_THE_BENCH_WALKS, set in every document before its scripts), for the checkers that hold what
still lives on the bench's walk; no page of the game sets it.

## 4. DESI'S HINT STEPS ASIDE FOR THE SETTINGS CARD (ask row 654, FOUND BY EYES 11/20, e06)

In Cartel, upright, with SETTINGS open, DESI's plate ('Tap a building to go in. LEAVE on the phone takes us back out.') stood over the
MOTION row and half the SETTINGS row of the card. The plate already stepped aside when a building's sheet opened (FIXES 2's
__THE_HINT_STEPS_ASIDE__, row 612); a screen of the game's own laid over the place stopped a NEW plate (covered()) but never took
down one already up. NOW (slices/bohemia_ui_crashbox.js __THE_HINT_STEPS_ASIDE_FOR_SETTINGS__) a plate up when one of those screens
comes over the place (the settings card, the barber's chair, the squad's tape, the title) goes at once; cut before it was all typed,
it comes back whole when the place is quiet again (a face tells you once, whole).
GATE THE FOURTEEN EYES FOUND, new leg F654 (the demo, a new game's start town, DESI's line up, a thumb on the phone's SETTINGS):
upright the card up at 168 ms, the plate off the glass at 883 ms; on its side 314 and 854; never back while the card is open;
PLANTED (the watcher off): the plate 5.1 s over the card. 3 passed, 0 failed.
SECOND SHIP (the same round): read again after main moved, the slide-out kept the plate 0.5 to 0.9 s on the card (945 ms
once, over the leg's own bar); a plate a screen covers now goes at once, no slide (the leg's bar tightened to half a second).

## THE CHECKERS

NEW: gates/the_alpha_opens_on_the_map_gate.js (THE ALPHA OPENS ON THE MAP): M1 the first town stands on the map (both shapes), M2
LEAVE is the map with the phone and no walk pad (both shapes), M3 a save from the walk comes back on the map, M4 the closest zoom
stops, M5 nothing threw, B1 the bench is untouched (the city on its own boots on the walk), P the PLANT (the shell's frame not counted
as the game: the first town over the walk, LEAVE onto the walk, the leg sees it).

RE-AIMED to the bench's walk (walk: true, same legs, same numbers; each with its note): THE WALK NEVER MISSES, THE MOMENT ENDS, THE
POOL IS REAL, TIME NOT TAPS (each pressed the alpha's walk pad: red on this build without the re-aim, 'the pad walks him' / 'a real
hold latches on release'). THE DEMO BOOTS LIGHT's B7 held 'on the alpha he starts on his street': re-aimed to 'the alpha is seated
on the map, its boards built' (rule 38(b)); its other legs untouched.
RUN ON THIS BUILD, alone: THE GAME STARTS IN A TOWN 15/0, A FRESH PHONE SEES THE DOOR 9/0, THE LOTS ARE KEPT 12/0, THE TRACKS HE CAN
READ 21/0 (the alpha's two shapes included).

[bb] Battle Brothers has one world map and no walking: the company is a marker you send; arriving opens the town's screen; leaving
it is the map again, every time.
[analog horror] a game that drops you back onto a street you were told was gone is the machine forgetting what it promised; the map is
the one place the company stands now, on every screen he plays.

## 5. THE SMITH'S LINE IS WHOLE WHEN HIS GEAR IS BROKEN (ask row 653, FOUND BY EYES 11/20, e05; a second cause beside UI FIVE's)

UI FIVE's BUILD 11/21j fixed one cause of row 653 (a FULL BAG: the junk button's two parts side by side made its row about 80 px).
This is the other one, measured on the demo through the game's own town frame (Caravans' smith, market day), a phone upright:
with nothing of his broken the smith's sheet fits at its first step and ODELL's line is whole; with a man's helmet and armour broken
(as after any fight) the two MEND rows push the sheet to the last step, where the keeper is held to ONE line ('Everybody wants a blade
sharp fo...', EYES' picture exactly), and even so the sheet ran 49 px past its box (BUY IT half under the glass); three men broken,
141 px; on its side, three men broken, 192 px (the mend rows piled into the 182 px column, 61 px each).

NOW (slices/bohemia_ui_no_scroll.js __THE_SMITHS_LINE_IS_WHOLE__, the last step, a shop only): the mend buttons' header off (every
button says Mend), their words wrap by the word beside small stacked damage bars, no word changed; the bag shows what is in it and
ONE row of empty boxes, not all 36 (its header still says how many of 36; the crew screen dropped its 36 empties the same way).
Upright: the keeper's words in two lines (12 px, as on a short glass), the mend buttons two to a row, the bag's header beside its
junk bar. On its side: the mend buttons four to a row in one band with the shelf, the bag under it, the strip on the right.
GATE THE FOURTEEN EYES FOUND, new leg F653 (the demo, Caravans opened in the game's own town frame on market day, his men's gear
broken, a thumb on the smith): upright one man and three: the line whole, 0 px past the box, the lowest button 753 of 781; on its
side three: the same, 302 of 330; PLANTED (the step off): the line cut, 49 px past. Every rule waits on a shop that shows its MEND
buttons: a shop with nothing broken is exactly as before (UI 9's N9 holds all 43 boxes on the glass there, W5 holds nothing moves).

## 6. THE NEW ENEMIES, LEG 11 RE-AIMED TO THE NEWER RULES (ask row 574, FOUND BY PLUMBER 8 11/10; the red debt)

Run alone on main (11/21): 11 passed, 1 failed, and the one red, SIZED TO THE CREW, was only these cells, a crew of 3 against ONE
animal: bears 5/10, sloths 5/10, longhorns 5/10, mammoths 4/10, bison 2/10. Every pack, faction and gang: 7 to 10 in 10 (wolves,
hyenas and prides were sized by BESTIARY 11/11). Two newer rulings decide what a crew of three can meet, and the leg knew neither:
THE GIANTS ARE RARE (WORLD 9 11/5, rule 389's default: a giant is never drawn for a pack, a hunt or a job's guards; each is ONE animal
on a named big-game card he chooses, its skulls on the card) and A HUNT FITS THE CREW (JOBS 11/20l: a beast whose look carries
min_men, the bison's 6, is never dealt to fewer men; Battle Brothers never sends a new company at an Unhold).
NOW (gates/the_new_enemies_gate.js leg 11): a giant's cell, and a cell under its beast's min_men, is read and said, never held to the
floor; every other cell keeps 6 in 10; and the dealer's own filter is held (slices/bohemia_job_kinds.js filters both, the page leg is
JOBS' A HUNT FITS THE CREW). `--plant` holds every cell again, as before: red on the same numbers.
THE RED DEBT: its quarantine line struck, 368 NAMED to 367 (the line was FILED, so 350 LEFT stays).
