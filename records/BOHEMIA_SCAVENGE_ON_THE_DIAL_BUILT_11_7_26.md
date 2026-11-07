# SCAVENGE ON THE DIAL: BUILT (11/7/26, BUILD 11/7k)
Lane: SCAVENGE. Rule 426(b) (Paolo 11/7, YES on scavenge-the-design-for-his-yes-11-7: 'I want it to be like a fun minigame'); rule 331
(his three, ONE game on the Dead Shot Dial, picked by the map, nothing he did not approve); the design: records/BOHEMIA_SCAVENGE_THE_DESIGN_FOR_HIS_YES_11_7_26.md.
Ask line 493 (and 324, 330).

## FOR PAOLO (five lines)
1. In a town, tap the junk lot, then "Search the lot". It still costs 4 hours, once.
2. You land on that block's own fight board with your whole crew. Up to six spots light up: houses, open dirt, dead cars.
3. Tap a spot and the nearest man walks there. The old Dead Shot Dial opens over him.
4. House: tap when the needle hits the middle. Detector: no colours, tap when the beeps turn into one tone. Car: hold, let go on the beat.
5. Dead centre gets the best thing there, a miss gets nothing. About 6 seconds a spot, under a minute a block.

---

## WHAT WAS BUILT
| file | what |
|---|---|
| engine/bohemia_dial.js (new) | THE DIAL, ONE MODULE (rule 331's 'lifted into one engine module the fight's important shot can use later'): the alpha's stamped motion engine (COMBAT_B64 between ENGINE START/END: 52 patterns, five packages, PHASE, whole bars at 120 BPM) byte for byte, renamed BohemiaDial (engine/bohemia_engine.js owns BohemiaEngine), plus zoneOf (the fight's V53 resolution) and outcomeOf (the CombatBridge contract's killshot / hit / miss). |
| slices/bohemia_scavenge_game.js (new) | THE RULES, node and browser: spots from the dealt board, the three ways, the finds. |
| slices/BOHEMIA_SCAVENGE.html (new) | THE PAGE: the block's board, the crew, the lit spots, the dial, the plate. Bench: ?bench=suburb&seed=N. |
| slices/BOHEMIA_SETTLEMENT_SCREEN.html | __SCAVENGE_ON_THE_DIAL__: 'Search the lot' (same words, same 4 hours) opens the page when the lot's dead are searched; each find comes back through the screen's own payout lines; YOU say what came back. |
| gates/scavenge_on_the_dial_gate.js (new, in the suite as SCAVENGE ON THE DIAL) | 27 legs, 14 of them planted fails. |
| gates/settlement_screen_gate.js | its scavenge legs re-aimed (the button opens the game; the handed-back finds paid one each until the lot runs out). |
| slices/BOHEMIA_ALPHA_0_9.html, slices/BOHEMIA_DEMO.html | #buildstamp BUILD 11/7k - SCAVENGE ON THE DIAL; the demo re-cut by tools/bohemia_cut_the_demo.js. |

## HOW IT PLAYS
- THE BLOCK'S OWN BOARD: the page asks the shell's own fight door (nfOpts, asked and put back, as the camp does) for the options a fight on
  this block gets, and the fight's own page deals and bakes that board in the mode the camp already uses (FIGHT_OPTS.campBoard; nothing
  of a fight starts; the fight's file is not changed). The crew are the men that board deals for the company, drawn from their own sheets
  at the fight's man size (~100 pt painted; the ground may zoom, the person may not). Bench boards bake in about 1 s.
- THE MAP PICKS THE SPOTS, from the dealt board's own tiles, nearest the crew, at most six, no more than the lot still holds (WORLD's
  count), no two side by side, a kind only where the board has it:
  - SEARCH: a house. On a board laid from the map, the map's own roof (FIGHT.isRoof); on a template board a raised tile of built ground
    (yards, strip, downtown...), never raised land (canyon, desert, wash, freeway, rail, landfill). A COMBAT TILE IS A HOUSE: each roof
    tile is one house, searched from the open tile at its door.
  - SIPHON: a dead car (a cover piece that IS a car: yards_car, strip_car, car_kerb...; never the golf or luggage carts).
  - DETECTOR: open dirt by the houses or a rough lot; on open land (no house on the board) any dirt; NEVER the asphalt (the dealt board
    names one ground for the whole board, so the baked picture is read: a tile darker than 92 of 255 is road; measured on the suburb: road
    51 to 75, yards 98 and up).
  Measured on four template boards (seed 11): suburb house 2 / ground 2 / car 2, strip car 3 / ground 2 / house 1, downtown house 4 /
  car 2 (no dirt), desert ground 3 / car 3 (no houses).
- THE DIAL, THREE WAYS, the engine unchanged: the needle on its pattern by the package (NORMAL by default), the middle on the downbeat
  (MEASURED: all 135 pattern x package pairs inside the dead centre on the ONE, worst 3.12 deg against the 3.18 deg band).
  QUICK (his 'fun quick minigame'): a spot opens only the package's patterns whose middle comes round at least every two bars (4 s).
  MEASURED 11/7: at NORMAL 25 of the 36 patterns take 12 to 20 beats (6 to 10 s) between middles; with them a press could wait 8 s and
  the gate's first run lost a house to 'gave up'. Kept: EASY 4 of 9, NORMAL 11 of 36, HARD 31 of 43, VERY HARD 27 of 31, BOHEMIAN 15 of
  16. He waits for the middle to come round twice before he gives up.
  SEARCH: one tap anywhere, the bands shown, the needle drawn as his torch beam. DETECTOR: one tap, the bands hidden; the detector's tone
  is a pure oscillator, as a real one's is: one beep a beat, two inside the blue, four inside the amber, one held tone in the dead centre,
  every beep on the 120 grid (the needle tip flares on each beep, for a muted phone). SIPHON: hold; the draw starts on the next beat and
  the needle glides from the edge to the middle in 8 / 4 / 4 / 2 / 2 beats (EASY to BOHEMIAN, HARD and BOHEMIAN with the hose's kick), a
  low gulp each beat; let go on the beat it reaches the middle; past the far edge it is a mouthful (nothing). The press is judged where
  the needle is at the touch, not at the last drawn frame. Four bars with no press: he gives up (nothing). greedMult is always 1.
- WHAT HE GETS (the design's question; his YES left it open, so its lead, A, is built, his to change): ONE thing or nothing a spot.
  | | dead centre | amber | blue | out |
  |---|---|---|---|---|
  | a house | meds | food | tape | nothing |
  | the ground (a detector hears metal) | battery | rounds | tape (tools) | nothing |
  | a car | battery (its gas, traded) | food (under the seat) | tape (the trunk) | nothing |
  Each is paid by the town's screen through the lines a search always paid (food and batteries into the purse, the rest posted), one
  off the lot's count each; a seventh find is refused when the lot holds six.
- THE CLOCK: the outing is the button's four hours, once (unchanged). Nothing per search.
- NOT BUILT (rule 331): no noise meter, nobody comes, no hours per search, no chain, no greed, no loot by district. The gate's R4 holds it.
- THE GLASS (rule 402 amended): no new screen; the board fills the glass (upright about 6.4 tiles across with the plate in the strip
  below the board); the plate is small (SCAVENGE, three rows, the finds, LEAVE at 44 pt); nothing scrolls upright, on its side or on a
  laptop (B5). The press is anywhere on the glass.

## PROOF (rule 13: the pre-push pass, by name)
- SCAVENGE ON THE DIAL 27/0 (14 planted fails caught), twice in a row after the rebase, about 1.5 min with the demo leg. B3 on the phone
  with real taps: on the ONE all six dead centre (ground house car ground house car), both runs; a beat off car:hit ground:miss
  house:miss car:hit ground:miss car:hit. (A tap the harness itself delivers more than 50 ms off the ONE is reported, not judged.) B6 IN THE DEMO: the town Anarchists, its own block (SUBURB, laid from the map), 6 spots, a detector spot played on
  the ONE -> GOOD, rounds; the town paid ammo and YOU said "Six rounds loose in a jacket pocket. 5 left on this lot."
- THE SETTLEMENT SCREEN 74/1 (its re-aimed scavenge legs all green; the one red, "the strip says the price and shows the numbers", is a
  shop leg and red on main without this change). DEMO BUILD 25/0. HANDOFF (see the commit).
- RED, NOT MINE, the same on main: DERIVED FRESHNESS 9/1 (records/factions/BOHEMIA_FACTION_BLUES.md drift), INLINED FRESH 0/1 (the resync
  tool, the front page's known red), GATE REGISTRY 6/1 (42 older orphans; this gate is registered). Full suite unmeasured since the
  rebase base (rule 13).
- Pictures: records/target/SCAVENGE_ON_THE_DIAL_BUILT_11_7.webp (six phone frames: the block's spots, a house, the detector, a car, the
  game inside the demo on a town's own block, back in town). VOTE scavenge-on-the-dial-built-11-7 (stage stand_in: the play is built, the
  look is the fight's board and the old dial's; vote on how it plays).

## ROUTED (notes)
- COMBAT TWO: a board laid from the map carries no dead car (0 of 784 blocks, measured 11/7), so a town whose board is laid from the map
  has no siphon spot until the plan flags cars; the page already reads laid car pieces (car_kerb, car_lane) the moment they land. The
  template boards (rule 423's layouts) have cars.
- RUN / WORDS: the lot's line under YOUR face is a draft: 'Four hours on the block. Houses, yards, the wrecks. Keep the beat.' (draft:true).
- THE COORDINATOR: the finds table is the design's option A (his to change in one line of slices/bohemia_scavenge_game.js FINDS); the
  stale-gas finding still stands for DYNASTY and ECONOMY.

[bb Battle Brothers settles a search inside an event by a hidden roll; here the roll is his thumb on the beat, on the battle map's own ground.]
[analog horror: the house's needle is one torch beam swinging in the dark; the detector is a bare oscillator tone that fills in to a held note.]
