# COOK FIVE: THE CONVENTION HALL, FINISHED, AND ITS CEILING (11/17/26)

The coordinator's routine 'COOK FIVE full sweep' (VAMILY rules 453, 441, 416, 451(a)): '... then the art for COMBAT THREE's
next interior and its ceiling'. BUILD 11/17w - THE CONVENTION HALL IS A SHELTER. The sweep's fourth build.

## WHAT THIS IS
COMBAT THREE's fourth inside (BUILD 11/17c - THE CONVENTION HALL: a corner of an exhibit hall turned shelter, laid from
slices/fight_ground/hall/hall.json by slices/bohemia_big_inside.js). Every picture of it was a stand-in from another
building: its 300 pieces were the tunnels' camps, the street's hay bales, the garage's deck, and its floor the garage's
aisle with its arrows. Its handoff named the pictures it wanted. They are in the folder now, under its names, through the
master rig, and the hall laid them with no code changed:

- THE SHOW FLOOR (hall_floor_0.webp, five tiles by five, any tile meets any tile): a sealed slab, the trade show's yellow
  tape still on it (booths 3 m by 4.5 m, an aisle on every tile's north and south line), each booth's number stencilled at
  its corner, the floor boxes in their grid, and what the shelter left: where a cot stood for months the dust never fell
  (three clean shapes a booth, the four feet's marks), and a hopscotch in chalk in two aisles.
- THE PIECES (hall_art.json's kit, 18 pictures, 22 names): six cots in a block (blankets, pillows, a duffel, a jug, shoes
  set down together); the same with one cot on its side and a sheet hung on a line for a wall; four shrink-wrapped relief
  pallets, one torn open, its cans in the aisle; a 12 m container with a tarp lean-to against it; three rows of folding
  chairs, some down; the registration desk with its queue posts, one belt let go, a pull-up banner; a sandbag wall with a
  slot; crowd barriers, one section down; a column papered with MISSING flyers as high as a hand reaches; the outer wall
  and its dado; the folding wall, panel after panel; a tile of the mezzanine with the convention's carpet on it, the dark
  under it; the broad stair up, east and west; the glass rail, one pane gone.
- THE CEILING (hall_ceiling.webp, rule 451(a), over the fight at his 10%): the roof deck and its purlins, a truss on every
  bay's line both ways, the catwalk, the supply duct, the high-bay lamps (one lit), a chain hoist, and the banners of a
  trade show nobody took down. hall.json's ceiling entry says "have": true and "tile": [10, 10] (a bay is two tiles, the
  other three ceilings' way).

20 pictures, 618,612 bytes in the folder.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_the_hall_on_the_page_11_17_26.js on the real fight page, 390 x 844 and 844 x 390, the hall asked for by name:
the board THE CONVENTION HALL, layout the_split_hall: 300 pieces laid, 0 of them stand-ins (300 of 300 before), none with no
picture; the ceiling's picture drawn at 0.1 (the page's own word: picture true); a fight tile 37.5 points upright, 26.5 sideways;
0 page errors, 0 files not found. Close in (the near stop, a tile 171 points): as the page is, the floor alone (the row below);
with the page's three calls turned in memory, the cots, the mezzanine, the stair, the chairs, the desk, the column each on
its tile at its size.
Gate THE INSIDES WEAR FINISHED ART 27/0 (the hall added as a third kit: A1 to A6, P1; the ceiling as the fourth in C1 to
C5). COMBAT THREE's own gates on this tree: THE BIG INSIDES 15/0 (I9: the picture hall/hall_ceiling.webp, in), AN INSIDE SHOWS ITS CEILING 6/0.

## FOUND ON THE WAY, NOT MINE TO FIX (ask row 646)
CLOSE IN, WITH THE CAMERA STILL, AN INSIDE'S FURNITURE IS NOT DRAWN. At the opening view the hall is whole (the baked
board). Pinched in past one art pixel to one device pixel (zoom x device pixels over 1.02), the fight draws the ground
itself (groundOn): while the camera moves the pieces show; the frame after it stops, the ground is drawn once to a sheet
and that sheet is blitted, and every cover piece is gone (and the feather and the lamps' pictures). The cause, read on the
page: groundOn(cx) takes its canvas as an argument, and since BUILD 11/10l (THE FIGHT DRAWS ITS OWN SHEETS) its three
picture calls are cxDraw(...), which always draws on the fight's own glass, never on the argument. So on the sheet's pass
the pieces go to the glass and the sheet (without them) is laid over. Measured: the hall at zoom 0.55 on a phone at two
device pixels: 0 pieces on the glass; with the three calls turned to sheetDraw(cx, [...]) in memory: all of them. A street
board is the same before and after (its houses are in the laid picture). It is the fight page's code (FIXES, COMBAT THREE):
filed as row 646 with the cause; nothing of the page edited here. The close shots on this card's sheet are taken with
that turn held in memory, and say so. The picture of it: records/BOHEMIA_COOK_FIVE_FOUND_CLOSE_IN_THE_FURNITURE_IS_NOT_DRAWN_11_17_26.webp
(the same spot of the hall on his phone at the near stop: left as the page is, right with the three calls turned).

## REFERENCE CHECK (compared to the world before calling it done)
An exhibit hall's floor (sealed concrete, saw-cut joints, booth lines in tape with stencilled numbers, utility floor boxes
on a grid); the New Orleans convention center and the Astrodome as shelters in 2005 (army cots in ranks, relief pallets in
shrink wrap, missing-person flyers on the columns, sheets hung for a wall); folding air walls on a ceiling track; a meeting
level over the concourse with a glass rail; long-span roof trusses with catwalks, round supply ducts, high-bay lamps and
hanging show banners. The twins: the parking garage's kit and the casino floor's (the card shows the hall before and now).

[analog horror: clean shapes on a dusty floor where four hundred cots stood; a column papered with faces; the banners of a
trade show nobody took down]
[bb Battle Brothers reads a fight's ground at a glance: what blocks, what covers, what is high; a cot is low, a pallet is
cover, the mezzanine is the high ground and its stair the only way up]

## THE TOOLS
tools/bohemia_cook5_the_convention_hall_finished_11_17_26.py   render hall_floor | hall_pieces | ceil_hall; cut; sheet
  (on tools/bohemia_cook5_the_tunnels_and_the_garage_finished_11_11_26.py: three small hooks so another kit brings its own
  ground things, parts and materials)
tools/bohemia_the_hall_on_the_page_11_17_26.js <outdir> [upright,sideways] [layout]

## NOT DONE, SAID PLAINLY
1. Close in, the furniture does not hold on the page (row 646 above): not the pictures, the page's draw; until it is
   fixed he sees the hall whole at the opening view and bare when he pinches in and stops.
2. The hall's two lamps are the game's own (the dock's daylight, the oil drum): no new lamp picture made.
3. The night is the page's own night over these pictures; no night versions were painted.
4. COMBAT THREE's next insides (the mall, the warehouse, the data fort) have no art yet: their names come with their builds.

VOTE: cook5-the-convention-hall-11-17 (MADE FROM arena2-the-pit-is-a-pit-11-7).
