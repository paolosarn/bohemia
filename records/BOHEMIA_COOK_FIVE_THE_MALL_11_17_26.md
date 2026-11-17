# COOK FIVE: THE MALL, FINISHED, AND ITS PAINTED SKY (11/17/26)

The coordinator's routine 'COOK FIVE full sweep' (VAMILY rules 453, 441, 416, 451(a), 455): '... the art for COMBAT THREE's
next interior and its ceiling ... keep going build after build'. BUILD 11/17zj - THE MALL IS A DEAD MALL. The sweep's sixth build.

## WHAT THIS IS
COMBAT THREE's fifth inside (BUILD 11/17x - THE MALL: a fight on the dead mall's concourse, eight stores as rooms, the upper
level's bridge in the middle; slices/fight_ground/mall/mall.json, laid by slices/bohemia_big_inside.js) landed while this
lane was on the hall. Every picture of it was a stand-in: 230 pieces from the casino, the garage and the street, a flat
grey floor. Its handoff named the pictures it wanted. They are in the folder now under its names, through the master rig,
and the mall laid them with no code changed:

- THE FLOORS, two sheets (any tile meets any tile): THE CONCOURSE (mall_floor_0.webp: pale terrazzo in brass-strip
  squares, a dark diamond inlaid at every tile's middle and a small one at four crossings, cracked, water marks with their
  tide line where the roof leaks, dead leaves blown into drifts; row 4 bare, under the bridge) and A STORE'S CARPET
  (mall_store_0.webp: wine red, the walk worn pale to the door, what was spilled, the feet of racks that stood for years).
- THE PIECES (mall_art.json's kit, 23 pictures, 27 names): A STORE FRONT a tile wide (the bulkhead, its sign with three
  letters gone and one on the floor, a window boarded, one broken to the store's dark, one whole behind EVERYTHING MUST
  GO, and THE RUNWAY: one window with what is left of a display, two mannequins still dressed, a third one's arm on the
  display's floor); the wall between two stores; the mall's outer wall and its wainscot; A SHUTTER STUCK HALF DOWN; a
  corral of nested carts, one loose, one on its side with somebody's bags; stock on pallets, slit and emptied; a counter,
  the till's drawer out, the shelves bare; a kiosk under its striped canopy; a planter, the palm in it dead; two camps in
  a store (mattresses, bags, a rack of coats for a wall; a banner for a roof, a pot on bricks); the food court's bolted
  tables, trays left; A PIECE OF THE CEILING COME DOWN, the painted sky in pieces on the floor; a column and the mall's
  directory; the lift, doors shut, a notice taped to them; a tile of the bridge; the dead escalator bank, east and west;
  the glass rail.
- THE CEILING (mall_ceiling.webp, rule 451(a), over the fight at his 10%): THE PAINTED SKY, faded: clouds on a pale sky,
  the paint let go in patches down to the plaster, a broad rib on every bay's line, the skylight's grid across one row of
  bays (over the concourse's middle on the board), the uplights dead but one. mall.json's ceiling entry says "have": true
  and "tile": [10, 10] (a bay is two tiles, the other four ceilings' way).

26 pictures, 841,870 bytes in the folder.

## WHAT WAS TRIED AND THROWN OUT
ONE FLOOR SHEET FOR BOTH GROUNDS (three rows of terrazzo, a row of carpet): the carpet bled a pixel into the terrazzo tiles
beside it and the join showed (the gate's A3: 15.1 steps across a join where 12.7 were allowed): two sheets. THE TERRAZZO'S
CHIPS AT FULL STRENGTH made its sheet 371,000 bytes: a third less, and the kit fits its 900,000. THE STORE FRONT CUT AS A
WALL (the ground's shadow taken out) shipped holes where a window's recess was dark: the cutter keeps its dark. CLOUDS AS
DISCS IN ONE PLANE rendered black where two met: every disc its own height. THE SKYLIGHT a row and a half wide (the
helper centres a band, it does not start it): one row.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (the hall's page tool, made to take any inside) on the real fight page,
390 x 844 and 844 x 390, the mall asked for by name:
the board THE MALL, layout the_atrium: 230 pieces laid, 0 of them stand-ins (230 of 230 before), none with no picture; the
ceiling's picture drawn at 0.1 (the page's own word: picture true); a fight tile 43.9 points upright, 22.4 sideways; 0 page
errors, 0 files not found. The food court layout, upright: 236 pieces, 0 stand-ins, 0 errors. Close in (the near stop):
with the page's three calls turned in memory, the store fronts and their window, the bridge, the escalators, a store, a
camp, the food court, the kiosk, the fallen sky and the lift each on its tile at its size.
Gate THE INSIDES WEAR FINISHED ART 34/0 (the mall a fourth kit: A1 to A6, P1; its ceiling a fifth in C1 to C5).
COMBAT THREE's own gates on this tree: THE BIG INSIDES 43/0 (three insides on this main; I9: the mall's picture, in), AN INSIDE SHOWS ITS CEILING 6/0.

## STILL TRUE FROM THE HALL (ask row 646, OPEN, not this lane's page)
Close in, with the camera still, an inside's furniture is not drawn: the mall too (the page's groundOn draws its pieces on
the glass, not on the sheet it was handed). At the opening view the mall is whole. The close shots on this card's sheet are
taken with the three calls turned in memory, and say so.

## REFERENCE CHECK (compared to the world before calling it done)
A 1990s enclosed mall's concourse (terrazzo in brass-divided squares with inlaid diamonds, concrete planters with indoor
palms, kiosks under canopies, a food court's fixed pedestal tables); dead-mall photographs (shutters half down, store
signs with letters fallen, boarded display windows, mannequins left in one, ceiling tiles and their grid on the floor);
the Forum Shops' painted sky (clouds on blue, ribs between the bays); a pair of escalators either side of a fixed stair,
glass balustrades, black handrails. The twins: the convention hall's kit and the parking garage's (the card shows the mall
before and now).

[analog horror: two mannequins still dressed in a window nobody boarded; a piece of the painted sky on the floor; one
fixture still lit under it]
[bb Battle Brothers reads a fight's ground at a glance: a shutter is a door that costs, a cart corral is cover, the bridge
is the hill in the middle that nobody starts on]

## THE TOOLS
tools/bohemia_cook5_the_mall_finished_11_17_26.py   cal; render mall_floor | mall_store | mall_pieces | ceil_mall; cut; sheet
  (ON this lane's hall tool and the tunnels-and-garage tool under it; records/target/cook5_inside/calibration.json
  re-measured with the mall's three grounds and the hall's slab in it)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js <outdir> <hall|mall> [upright,sideways] [layout]

## NOT DONE, SAID PLAINLY
1. Close in, the furniture does not hold on the page (row 646): not the pictures, the page's draw.
2. mall_mannequins and mall_fountain (COMBAT THREE asked for them, 'not in the data yet'): not made as pieces of their
   own. The store front's window carries two mannequins; say when the legend lines are in and they are made.
3. The food court layout was shot on the fight page alone (COMBAT THREE's own note: no valley dealt it by the map's hand).
4. No night versions; the mall's lamps are the game's own (the skylight's and the doors' daylight, the oil drum).
5. COMBAT THREE's next inside (the warehouse) landed on main while this was being gated: it is stand-ins, and it is this
   lane's next kit, by the names in its handoff; the data fort after it.

VOTE: cook5-the-mall-11-17 (MADE FROM arena2-the-pit-is-a-pit-11-7).
