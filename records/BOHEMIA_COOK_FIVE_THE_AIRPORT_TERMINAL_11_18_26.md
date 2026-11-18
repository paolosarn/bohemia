# COOK FIVE: THE AIRPORT TERMINAL, FINISHED, AND ITS CEILING (11/18/26)

The coordinator's routine 'COOK FIVE next' (VAMILY rules 453, 441, 416, 451(a), 455): 'take the next jobs on your own list,
one build each: finished art wherever a card still says STAND-IN; every picture lands light'. BUILD 11/18p - THE TERMINAL IS AN AIRPORT. This round's fifth
build.

## WHAT THIS IS
COMBAT THREE's eighth inside (THE AIRPORT TERMINAL, BUILD 11/18g: a ticketing hall, one checkpoint everybody is squeezed
through, the gates, the baggage hall; 'when flights stop, a terminal fills with people who cannot leave and luggage nobody
collects'). Every picture of it was a stand-in from the garage, the casino, the street and the tunnels. Its handoff named
the pictures it wanted. They are in the folder now under its names, through the master rig, and the terminal laid them
with no code changed:

- THE FLOOR (terminal_floor_0.webp, five tiles by five, any tile meets any tile): grey terrazzo in two-metre panels, a
  wayfinding arrow inlaid in a tile here and there, the pairs of thin lines trolley wheels left; row 4 with no marks.
- THE PIECES (terminal_art.json's kit: 25 pictures under 27 names):
  THE CHECKPOINT, a tile (tm_booth): the roller belt and the scanner's dark tunnel on it; six grey tubs on the belt with
  what people took off to go through and did not come back for (two pairs of shoes, a coat, a belt, a bear); the tubs
  stacked at the belt's head; the officer's screen with a bag still on it; the arch and its red lamp; the glass booth of
  the body scanner, two feet painted on its floor; the officer's desk, a stool down; the table they searched bags on, a
  case open on it; a bin of everything taken off people. THE SCREENS (tm_screen_ew, tm_screen_ns): glass to two metres
  on steel posts, one pane gone and lying on the floor, the lane's plate.
  A ROW OF CHECK-IN DESKS a tile wide: five desks, a bag scale and its belt between each pair, two cases still on the
  scales, dead screens and one still on, tags on the floor. THE QUEUE'S RAILS: four lanes of posts and belts, three
  posts down, a case left standing in line with its handle still up. A NEWSSTAND: its shutter torn off and lying in
  front of it, a few spines left on the racks, the drinks' fridge empty.
  A WALL OF LUGGAGE: five courses of suitcases laid like bricks; BAGS beside it, one opened and gone through. THE
  TROLLEYS: seven nested in their row; one loaded and left; one on its side.
  A GATE'S SEATS: three banks back to back, three seats torn out, a blanket and a pillow over three, a charging post
  where nothing charges, a pair of shoes set down neatly; and the second row, somebody's bedroll across its last bank.
  THE CAROUSEL: one tile of its belt (the black plates, the yellow bumper, three bags nobody took; it meets itself end to
  end), and its middle, heaped: the stainless island, the chute's dark mouth, and about a hundred and seventy cases.
  SOMEBODY WHO NEVER GOT A FLIGHT OUT, twice: a bank of seats for one wall and cases for the other, the bed between, the
  sign he held up; and two trolleys with a sheet across them, a case for a table, four boarding passes laid in a row. At
  both, the shoes side by side.
  A COLUMN: white, round, a dead screen strapped to it, the papers people taped up. THE UPPER WALKWAY (its carpet's
  bands, the wayfinding band on its fascia), its stair east and west, the glass rail, the outer wall (white panels, the
  band, an advertisement's box gone dark, a charging shelf).
- THE CEILING (terminal_ceiling.webp, rule 451(a), over the fight at his 10%): the long white roof, a rib every bay with
  its steel flange, a strip of skylight across every bay with panes out, the gate numbers hung dead, the departures board
  every other bay with every row dark, the light fittings dead. terminal.json's ceiling entry says "have": true and
  "tile": [10, 10] (the one agreed edit in COMBAT THREE's file).

27 pictures, 751,156 bytes in the folder.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js on the real fight page, 390 x 844 and 844 x 390, the terminal asked for
by name:
- BEFORE (main, the terminal's art file absent), upright, the checkpoint layout: THE AIRPORT TERMINAL, 195 pieces, 195 of them stand-ins, the
  ceiling drawn by the page (no picture), a fight tile 43.9 points.
- NOW, upright 390 x 844, the checkpoint: 195 pieces, 0 stand-ins, 0 with no picture, the ceiling's picture drawn at 0.1 over 10 x 10 tiles, a tile
  43.9 points, 0 page errors.
- NOW, on its side 844 x 390, the checkpoint: 195 pieces, 0 stand-ins, the ceiling's picture drawn, a tile 29.1 points, 0 page errors.
- NOW, upright, the baggage hall layout: 215 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors.
- Close in (the page as it is): seven spots at the checkpoint upright and on its side (the checkpoint, the desks, a gate, the luggage, a camp, the
  walkway, the newsstand), three in the baggage hall.
- (each run asks for fight_ground/stadium/stadium_art.json and gets none: the stadium's art is not made yet.)
Gate THE INSIDES WEAR FINISHED ART 55/0 (the terminal a seventh kit: A1 to A6, P1; its ceiling an eighth in C1 to C5).
COMBAT THREE's own gates on this tree: THE BIG INSIDES 93/0 (six insides), AN INSIDE SHOWS ITS CEILING 6/0.

## REFERENCE CHECK (compared to the world before calling it done)
An airport terminal of the 1990s to 2010s (grey terrazzo with inlaid wayfinding; check-in desks in rows with bag scales
between; a security lane: a divest table, grey tubs, an X-ray tunnel on a roller belt, a walk-through arch, a glass body
scanner; belt-and-post queue mazes; beam seating at the gates; flat-plate baggage carousels round a stainless island;
nested luggage trolleys; a long white roof on ribs with strip skylights and hung signs). The twins: the data fort's kit
and the mall's (the card shows the terminal before and now).

[analog horror: a checkpoint's tubs still holding what people took off to go through; shoes side by side at a gate
beside bedding; every sign dead on one evening]
[bb Battle Brothers' hardest ground is a wall with gaps: the checkpoint has to read as a wall of machines at a glance, and
its lanes as the only ways through]

## THE TOOLS
tools/bohemia_cook5_the_terminal_finished_11_18_26.py   cal; render tm_floor | tm_pieces | ceil_terminal; cut; sheet
  (ON this lane's data fort, warehouse, mall and hall tools and the tunnels-and-garage tool under them: six deep)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js <outdir> <hall|mall|warehouse|datafort|terminal> [upright,sideways] [layout]

## NOT DONE, SAID PLAINLY
1. THE CAROUSEL'S RING DOES NOT TURN ITS CORNERS: tm_belt is one east-west strip, so on a ring's west and east sides the strips lie across the
   belt's run (COMBAT THREE's stand-in did the same). A north-south belt piece is one more name; said in the handoff.
2. The opening view is dark and flat at night: the terrazzo is one grey and the terminal's lights are the day through its glass (COMBAT THREE's
   open side). The pieces carry the colour (the luggage); the floor does not.
3. The newsstand is mostly its roof from the map's eye; its sign band is on the roof's edge and too thin to read.
4. No night versions. The baggage hall layout was shot upright only (the checkpoint both ways).
5. THE STADIUM (COMBAT THREE's BUILD 11/18m: 15 pieces, all stand-ins, and its ceiling) is this lane's next build.

VOTE: cook5-the-terminal-11-18 (MADE FROM arena2-the-pit-is-a-pit-11-7).
