# COMBAT THREE: THE AIRPORT TERMINAL (BUILD 11/18g - THE TERMINAL)

11/18/26. The coordinator's round ("next round, rule 453... the next jobs on your own list, one build each; rules 441 and 454(a) stand; any FOUND BY EYES
row that is yours goes first"). No FOUND BY EYES row is open on this lane (548, 555, 605, 610 closed), no vote on the 11/17 cards yet, no note to this lane
in any handoff since 11/17zo. So: the next on the list, the eighth big inside of row 468.
Rules 416, 59, 428, 451(a), 441, 454(a). Ask rows 468, 627.

## HIS WORDS
- 11/6 (row 468): "what are some large ass interiors that we could fight... I still want this to be a block and turf war."
- The list's line (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md): "THE AIRPORT TERMINAL: the long concourse, the gates, the baggage hall."

## MEASURED BEFORE (main c869a5eda, BUILD 11/17zr)
A fight at the terminal (the map's kind 'terminal') was the parking garage on four cells in ten and the kerb outside on the rest.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/terminal/terminal.json`, the fifth in `slices/fight_ground/insides.json`, laid by `slices/bohemia_big_inside.js`: no
new rule code. The only code is the ceiling's painter (`ceilingSheet`, kind `span`).
- WHERE: the terminal's own cells, 0.7 of what the garage leaves there, by the cell's dice (the gate: 16 of 40); never the airport place's own cells.
- THE BOARD: 20 by 15 house tiles, two layouts, each mirrored.
  `the_checkpoint`: the ticketing hall on one side, the concourse and its gates on the other, and between them THE CHECKPOINT: a line of scanners that is a
  wall (no way through, no sight through) with four lanes one man wide. The upper walkway runs along the south wall and over the checkpoint's end: the one
  way across that is not a lane, for whoever takes the stairs first.
  `the_baggage_hall`: six carousels (a belt to climb over, 3 AP and low cover, round a heap nobody stands on), walls of luggage, trolleys, the customs
  counters and the kerb's doors, the walkway along the north.
- 19 KINDS OF TILE, EACH ITS COST AND ITS EFFECT (rule 59): the checkpoint (a wall), the terminal's floor and its lanes (open floor, nobody stays on it), a
  counter and luggage trolleys and somebody's bedding (low cover), a wall of luggage and a newsstand (cover), the queue's rails and a gate's seats and the
  carousel's belt (3 AP and low cover), the carousel's heap and a column (blockers), the kerb's doors (open floor, the day), a drum fire, the upper walkway
  (high ground; seats and luggage on it), the stairs.
- THE WALL OF GLASS (`open_sides: ['n']`): the long north side faces the apron, so by day the light falls along the whole of it and a man there is seen; at
  night it is as dark as anywhere. The other insides are lit only at their doors (the fort by its servers).
- NOBODY HOLDS THE WALKWAY AT THE BELL (the mall's way).
- ITS CEILING AT 10% (rule 451(a)): the long white roof, a rib every bay, strips of skylight with panes out, the dead hanging signs. The fight draws it
  until COOK FIVE's `terminal/terminal_ceiling.webp` is in.
- EVERY PICTURE IS A STAND-IN: 27 pieces drawn as finished pieces of other kits; the floor is COOK FIVE's own mall terrazzo. Names in the handoff.
- RULE 454(a): no line of dialogue is rewritten; the tiles' tap lines are new, draft, the fewest words.

## THE GATE (gates/the_big_insides_gate.js: 78 passed, 0 failed; five insides; 15 legs for the terminal)
I1 16 of 40 fights at the terminal go inside, the same cell the same answer. I2 the floor joined on 24 of 24 boards (the checkpoint's wall leaves the lanes
and the walkway: every man has a walk to the other side), all four dealt shapes seen. I3 the stairs the walk and the rail a climb, 24 of 24. I4 the dark,
24 of 24. I5 27 kinds of piece each with its picture and size, all stand-ins. I6 24 of 24 fights ended on AUTO inside 30 rounds (6.3 a fight), nobody of 288
stood a whole fight. I7 19 kinds of tile each with its row. I8 (rule 428) after round one 21% of 250 men bare on the open floor against 39% with the rule
off; on cover or high ground 107 of his 144 and 85 of their 106; nobody on the walkway at the bell. I9 its ceiling: span at 0.1. I10 a road cell beside it
inside on 0 of 40, its own cell on 16 of 40. Six plants caught.
FOUND BY THE GATE AND BY LOOKING, ON THE WAY: (1) a rail piece in the kit that no layout ever laid (the walkway was one tile wide with stairs at both ends);
the walkway now widens into a landing on both layouts. (2) LOOKED AT, the checkpoint did not read: its scanners were floor tiles with a small booth on each,
so the line was a row of dots and a shot crossed it anywhere. It is a wall now, and the lanes are the only lines of fire. (3) LOOKED AT, the carousels were
a field of lumps: the belt's stand-in is a tile-wide low strip now, and they read as rings.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, C3_PLAIN=1 C3_INSIDE=terminal: through the map's own door)
A valley has two cells of terminal and the garage takes some; each run is a fresh page.
- the demo upright (390 x 844): 2 fights inside (the_baggage_hall), both ended on AUTO; 6 of 6 tile taps on the final data (the walkway, luggage on it, the
  floor, the belt); the ceiling measured: span at 0.1, a pixel moves 3.2 to 3.3 of 255 on average, 16.7 or less on 99 pixels in 100.
- the demo on its side (844 x 390): 1 fight, ended; 2 of 2 taps.
- the alpha upright: 1 fight, ended; 3 of 3 taps; the ceiling 3.41 of 255.
- the alpha on its side: 1 fight, ended; 4 of 4 taps.
5 fights inside the terminal, 5 ended, 15 of 15 taps, 0 page errors (and 11 garage and kerb fights at the same cells, all ended).

## ALSO IN THIS SHIP: THE THREE LEGEND LINES COOK FIVE WAITS ON (handoffs/COOK_FIVE.md, 11/18; data only)
COOK FIVE measured on the page that the data fort's servers "do not read as servers yet": a server tile was two thin rows with 10 m of white floor between
them, and no picture under the one name could fix it. "THE FIX IS ONE LINE OF YOURS." It is in, with the two the mall waited on (I had written 'say when
they are in and I add the legend line' while COOK FIVE wrote 'when COMBAT THREE says the legend lines are in': each waited on the other; mine to break):
- `datafort.json`: the legend's 'S' carries `"piece": "df_servers_block"` (kind WALL, laid at the tile's middle, 0.5 by 0.98), a stand-in until the picture.
- `mall.json`: a new store tile `display` (THE MANNEQUINS, low cover, piece `mall_mannequins` at 0.5 by 0.75; two in each layout's stores: the runway
  lives here) and a new blocker `fountain` (piece `mall_fountain` at 0.5 by 0.92) in the atrium layout in the lift's place; the food court keeps the lift.
Gate THE BIG INSIDES 78/0 with them (the mall 25 kinds of tile now; the fort's block laid 1,191 times over 24 boards); COOK FIVE's THE INSIDES WEAR
FINISHED ART 48/0 with them. Looked at on the fight page alone (the pods read as rows of cabinets even with the stand-in).

## SAID PLAINLY
- THE CHECKPOINT LAYOUT WAS NEVER ON THE GLASS BY THE MAP'S OWN HAND: every valley these runs opened dealt the_baggage_hall at its terminal cell. The
  checkpoint is proven by the gate (8 of 24 boards) and looked at on the fight page opened alone (the card's 'scale' line says so).
- Four of the five page fights ran before the belt's stand-in changed (a picture only: the tile's cost and cover are the same); the last ran after.
- The checkpoint as a wall is the strongest choke on any board so far. If it plays as a siege he does not like, the fix is a fifth lane in the data.

## NEXT
The stadium (the ninth: the field, the concourse ring, the stands as high ground), then the dam's powerhouse.
