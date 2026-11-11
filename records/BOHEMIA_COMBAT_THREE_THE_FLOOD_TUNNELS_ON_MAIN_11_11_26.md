# THE FLOOD TUNNELS, ON MAIN (COMBAT THREE, 11/11/26)

VAMILY rule 440(a), rule 416's list (the second big interior), rules 441 and 443(h), ask row 539. BUILD 11/11c - THE FLOOD TUNNELS.
BUILT, NOT YET SEEN. VOTE combat3-the-flood-tunnels-11-11 (stand_in). COMBAT TWO built the tunnels on 11/9 and parked them
(origin combat2-tunnels-parked-2); its record of the board itself is records/BOHEMIA_COMBAT_TWO_THE_FLOOD_TUNNELS_11_9_26.md and stands.
This record is what COMBAT THREE did to land them: the coordinator's brief, "house-sized tiles, each tile with its cost and effect,
every building on a road, AUTO scrambles off the open floor; the casino floor is the golden piece to match".

## BEFORE (main 5ff2016b, BUILD 11/10za)
- Nothing under the city on main. The parked branch dealt the tunnels but: (1) no tile said what it does and nothing held a tile's
  cost (rule 59 not met inside); (2) AUTO had no reason to leave the main channel: the fight's open-street rule read only street,
  road, walk and freeway tiles, so under the city it read no open floor at all. MEASURED, 12 fights, 252 men: 134 stood on the
  bare channel at the start, 136 after round one (55%), 115 of 217 after round two (53%); 11 on cover after round one.
- The parked branch's own fix for EYES' row 548 (teachDraw, manCell) was no longer needed: FIXES shipped row 558 on main (the fight
  draws its own sheets). Main's fix is kept whole; the parked one is not carried.

## AFTER
- EVERY TILE HAS ITS COST AND ITS EFFECT. slices/fight_ground/tunnels/tunnels.json holds a table, 'tiles', one row per kind of tile
  a layout can hold: its row in the fight's ONE ground table (records/target/bb/ours.json ground_rows; no second list), the AP a step
  onto it costs, whether it is open floor, the cover on it, the rule in plain words, the line he reads on the first tap.
  | tile | ground row | AP | what it does |
  |---|---|---|---|
  | the fill | obstacles | none | no way through, no sight through |
  | a drain or a chamber | flat | 2 | the flood never reaches it; good ground on AUTO; dark unless lit |
  | the main channel | flat | 2 | OPEN FLOOR: nothing to hide behind, AUTO gets off it; the flood fills it |
  | under a street grate | flat | 2 | lit by day: a man here is seen; dark at night |
  | the channel under a grate | flat | 2 | open floor, lit by day, the flood fills it |
  | the drain's mouth | flat | 2 | open floor, the pried rack is low cover, lit by day, the flood comes in |
  | a camp on the wall | flat | 2 | low cover; dry in the flood |
  | the flood's jam (the jam, a rolled car, a wreck) | flat | 2 | cover, in the channel; the flood still fills it |
  | what the flood left (carts, tyres) | flat | 2 | low cover, in the channel; the flood still fills it |
  | a drum fire | flat | 2 | lit day and night: a man here is seen |
  | flood water (the channel, two rounds) | swamp | 4 | a step costs double; fights and defends at three quarters |
  | the flood's silt (the channel, after) | rough | 3 | slow going |
  The fight reads the table as the board's tileKey: the first tap on a tile says its line (the lit line when the tile is lit); once
  the flood has changed a tile the water's and the silt's own lines answer.
- AUTO SCRAMBLES OFF THE OPEN FLOOR. The board names its own open floor ('open' in the table: the main channel, the channel under a
  grate, the mouths); the fight's open-street rule (428(c), ours.open_street, TUNING's numbers untouched) now reads it; a drain is
  good ground (the table's 'good'). And there is somewhere to go: the three layouts carry what the last flood left in the channel,
  a car rolled on its roof, a wreck, carts, tyres (the street board's own finished-through-the-rig pieces, reused untouched:
  sb_rolled_S, sb_wreck_S, sb_cart_S, sb_tyres_S), 14 to 17 pieces of cover a board where there were 1 or 2.
  MEASURED, the gate's 12 fights: after round one 73 of 245 men (30%) on the bare channel against 136 of 247 (55%) before; of the men
  who neither struck nor have a man of the other side next to them, 14 of 69 (20%) are still on it; on cover 61 (11 before).
- EVERY BUILDING ON A ROAD: the tunnels have no building; the same rule under the city is that every camp, drain and chamber is
  joined to the main channel (the gate's T2: 24 of 24 boards, every open tile reached, every man with a walk to the other side).

## ON THE PAGE HE PLAYS (rule 441(a))
tools/bohemia_combat_three_on_the_page.js (new): the real alpha and the real demo, opened as a stranger opens them (the title, NEW
GAME, BEGIN, GO), every fight started by the map's own handover at a wash cell, a finger on a tile of every kind in reach with AUTO
off (the line on the glass read against the fight's own word), then AUTO and the speed pressed on the phone's own buttons (1x, 2x,
4x in turn), every turn logged from the page's own calls.
- 19 fights under the city: the alpha upright 3, the alpha on its side 3, the demo upright 10, the demo on its side 3 (390 x 844 and
  844 x 390). 19 of 19 ended. All three layouts dealt. 1x, 2x and 4x in turn.
- 278 turns of his: 270 walked or struck, 8 quiet, 8 of 8 quiet turns said their word. No man stood a whole fight.
- 21 of 21 tile taps said the tile's line, six kinds (the channel 8, a drain 4, what the flood left 4, the jam 2, a camp 2, a grate 1).
- The roar, the flood and the silt played as notes in every fight that lasted to them.
- After round one 24 of 87 men (28%) stood on the bare channel (the first 15 fights).
- NOT COUNTED, the test's own fault: one fight the test opened under the end screen of a wipe-out (the WIPED OUT page was still up, so no
  finger reached the fight); the test now waits for that page and leaves it first.
- PAGE ERRORS: 0 in 18 fights. ONE FIGHT, the demo upright, threw "drawImage ... not of type" 27 times, one every two seconds from
  its first second to its last (the fight still played to its end and every man acted); the same page, the same cell and two more
  runs of ten fights did not throw again. It is row 558's error (FIXES), not the tunnels': the tunnels draw no man. It was met
  while this box was also rendering (the CPU shared), which is how PLUMBER 8 first met it (the CPU slowed 4x). Routed to FIXES with
  what is known: the demo, upright, a night board, from the first frame, every 2 s.

## GATE
gates/the_flood_tunnels_gate.js (THE FLOOD TUNNELS, registered) 14/0, 37 s: COMBAT TWO's T1 to T6, and
T7 EVERY TILE HAS ITS COST AND ITS EFFECT (10 kinds of tile in the layouts, each with its row; the fight charged the table's AP on
143 tiles; 87 of 87 tiles with a line said it; the open floor 72 of 72; the flood water 4 AP, the silt 3) with two plants (a kind with
no row; a wrong AP), T8 AUTO SCRAMBLES OFF THE OPEN FLOOR (the numbers above) with its plant (the rule off).

## WEAK, SAID OUT LOUD
- The art is stand-in (COOK FIVE's next after the casino floor, rule 443(g)): the tunnels are grey on grey in the dark; the camps
  and the debris read at the near stop and are small at the far stop.
- Nobody lives in the camps yet; the flood drowns nobody (water is slow and you fight worse in it, then silt).
- A new game's crew is three men: on a 20 by 15 board three against three take up to 16 rounds to finish at 1x.

[bb] Battle Brothers prices every tile (2 AP flat, 3 forest, 4 swamp) and says so on the tile; ours does the same under the city and adds what it does not have: ground that changes mid-fight.
[analog horror] the tile under the street grate says "the day falls on you, and they see you": the one lit square in a hundred metres of dark is the worst place to stand.
