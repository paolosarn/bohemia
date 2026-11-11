# COMBAT THREE: THE CREW STARTS ON ITS CELL (11/11/26) -- BUILD 11/11z - THE CREW STARTS ON ITS CELL

VAMILY rule 429(a) ONE MAP ('the fight is fought on the map itself, cut at the spot it starts'), ask rows 504, 506, 507. The fight's half of
WORLD THIRTEEN's three steps (11/11a the table, 11/11b the places as templates, 11/11h THE CUT). Its seam, word for word: 'OWED, YOURS: start
the crew on the cell's tiles (template.tx..tx+2, ty..ty+2) instead of the start rows.'

## WHAT WAS THERE (main 9342be39)
A fight the map hands from a cell of one of the 15 places (the lab yard, the airport, the golf course ... the marina; 439 cells on the demo's
valley) was dealt that place's own board block for block (WORLD THIRTEEN's __THE_CUT__). But his line stood where every line stands: the
board's usual column and its middle rows, whichever of the place's 35 cells the company was on. And on a place that has an inside under it the
place lost: a fight on the wash's own place was dealt the flood tunnels (measured on the alpha: cell tiles 12,3 of the wash, the tunnels).

## WHAT IT IS NOW (slices/BOHEMIA_FIGHT.html, __THE_CREW_STARTS_ON_ITS_CELL__)
1. HIS LINE'S ROWS ARE THE CELL'S. S.rowMid = the cell's middle row (ty + 1): the formation, kept or dealt, is centred on it, and their line
   faces it. A man whose tile is a wall or a pen takes the nearest open ground, as on any board.
2. HIS FRONT IS THE CELL'S EAST COLUMN (tx + 2) wherever both lines have ground. THE FIGHT STILL RUNS WEST TO EAST (rule 67). S.cutStart.stood
   says which of four it was: 'cell' (exactly on it); 'usual' (the cell is west of his usual column: the usual column, rule 415(b), room to
   run); 'east' (the cell is past the last column that leaves their line its gap: the farthest the board allows); 'room' (the front stepped
   west until his three columns held his company and the ground beyond the gap held theirs, on the ground the two can walk to each other on:
   the Strip's wall at column 12, the lab's pens. Measured before this leg: on the Strip a front east of column 6 left their line no ground and
   the two lines stood a tile apart).
3. THE KEPT LINE (rule 110b) is counted from the row the line was stood on (formationNow), so a line he set comes back on the same tiles on any
   cell (it was counted from the board's middle: on the page a line kept on a north cell came back five rows off on a south one).
4. A PLACE'S CELL WINS OVER AN INSIDE. Where the map stands a place's own board the fight is on that board; the tunnels, the garage and the
   casino floor take their share on the cells no place stands on, and when asked for by name (opts.inside).
S.cutStart = { id, cell, tx, ty, wanted, front, mid, onCell, usual, max, stood } for the gate, the page test and WORLD THIRTEEN.

## THE GATE: THE CREW STARTS ON ITS CELL (gates/the_crew_starts_on_its_cell_gate.js, registered) 9/0
Every cell of every place (15 places, 35 cells each, 525 hand-overs), the live fight's own deal:
K1 the board is the place's own, 525 of 525. K2 a man of his as near the cell's middle row as the ground allows, 525 of 525. K3 his front:
exactly on the cell's column for 215 cells, 75 west of the usual column keep it, 195 too far east stand the farthest the board allows, 40
stepped west for ground (lab 15, strip 25); nobody ahead of his front. K4 nobody of theirs on or west of his front, the gap held, both lines
with a walk to each other, 525 of 525. K5 75 of 75 fights from the corners and the middle of every place ended on AUTO (5.1 rounds a fight).
K6 no cell, no change. K7 the kept line comes back on the same tiles, 45 of 45 (the old count would shift 30). K8 a place's cell wins over an
inside, 84 of 84 (the same deals with no cell go inside 31 times; an inside asked for by name is dealt). Planted: the cell ignored, 45 of 45.
EVERY MAN ACTS ON AUTO 22/0 (503 s). THE PLACES ARE TEMPLATES (WORLD THIRTEEN's): 13/0 on this build (its P3, the map hand-over on the suburbs' place, upright and on its side).

## ON THE PAGE (rule 441: the alpha and the demo, a phone upright and on its side)
The fight opened the way the map hands it (the place and the cell's tiles by the map's own vbTemplateAt, through the shell's door), a
different place and a different part of its board each fight; read at the bell: the cell asked, where his front and his rows stood, whether
every man of both sides is on the glass in the opening camera; then AUTO to the end.
- The demo upright: 8 fights (airport, desert, downtown, golf, pass, red rock, shore, the Strip). The demo on its side: 4 (lab, landfill,
  marina, pass). The alpha upright: 4 (red rock, shore, the Strip, suburb). The alpha on its side: 4 (suburb, trailer park, the wash, the works).
- 20 of 20: the fight was on the place's own board and carried the cell; his rows were the cell's (the nearest man 0 or 1 row from the cell's
  middle row); his front was where S.cutStart.stood said (on the cell's column 3, the usual column 6, the farthest east the board allows 9,
  stepped west for ground 2: the Strip); every man of both sides was on the glass in the opening camera; the fight ended; 0 page errors.
- The wash on the alpha on its side: its own board now (the tunnels before this build).
- Driver: node tools/bohemia_combat_three_on_the_page.js demo upright OUT cut 4 (C3_CUT_SKIP moves on to other places, C3_CUT_PLACE=<id> one place corner to corner).
The still: records/target/COMBAT3_THE_CREW_STARTS_ON_ITS_CELL_11_11.webp (the demo upright: the golf course's board from a north cell, his line at the top, and from a south cell, his line at the bottom).

## FOR WORLD THIRTEEN (the seam, answered)
- Read: FIGHT_OPTS.template { id, board, tx, ty, cell } as you send it. Nothing of yours was edited; your __THE_CUT__ block in dealOwn stands as
  you wrote it.
- The crew stands on the cell's rows; on the cell's east column where the board allows, else as S.cutStart.stood says. If your painter wants
  the map to show where the lines will stand, that is the rule above (front = clamp(tx + 2, usual 5, 12), stepped west for ground).
- A cell in the east third of a place (tx 15, 18) stands his front at column 12 and their line east of it: the fight runs west to east. If the
  map ever knows which way the company walked in, hand it (template.from: 'w' | 'e' | 'n' | 's') and the fight can face it.
- flip: still false; the fight does not read it.
- every_place_no_seams (red on main, suburb 19.7% / 14.0% against 4%): NOT STARTED this round, said plainly. It is the place boards' ground
  pictures (COMBAT MAPS 3's art, recoloured by COOK FIVE in 11/11w); it is on my list, next.

## NOT DONE, SAID PLAINLY
- The camera, the tiles and the art of the boards are untouched: this is where the lines stand, nothing else.
- A cell in the east third cannot be his front (their line needs the board east of him). 195 of 525 cells.
- every_place_no_seams: not started.

[bb Battle Brothers deals a fresh tactical map from the world tile the party stands on (its terrain type, its camp); ours goes one further: the same place's own board, and the company on the very cell it stood on]
[analog horror: the lab's pens are where the map said they were, and you are standing by the one that is open]
