# COOK FIVE [tunnels finished] 11/11/26 -- THE FLOOD TUNNELS' FLOOR, CHANNEL, EARTH, WALLS AND CAMPS, THROUGH THE RIG

The coordinator's next round (routine 'COOK FIVE next round', job 2: 'the art for THE FLOOD TUNNELS and THE PARKING GARAGE, floor,
walls, props, house-sized tiles, the casino floor is the bar to match, so they do not ship as stand-ins'), VAMILY rules 443(g),
441, 440(a), 416, 430, 408(b). COMBAT owns the board (slices/bohemia_flood_tunnels.js, tunnels.json: COMBAT TWO built it, COMBAT
THREE landed it on main in BUILD 11/11c while this was being made, its kit marked stand_in): this lane touched PICTURES ONLY, and
in the board's data file the three ground lists and the seven pieces' stage marks.

## WHAT STOOD THERE (main a96de3ca, measured on the page)
The culvert floor was five tiles of the wash block (the map's own concrete channel, the same blob on every tile), the main
channel three more of them, the earth round the culverts five tiles of the landfill (garbage, and one of the thirty pictures that
have lost their colour, ask row 576). The pieces were eight small rig models, each a few kilobytes: a camp was a mattress and a
cart, 4 m across. On his phone a tile of this fight is 60 to 130 px and a man stands a tile tall, so a camp was a 27 px speck.

## WHAT WAS MADE (tools/bohemia_cook5_the_tunnels_and_the_garage_finished_11_11_26.py)
THREE SHEETS, each 60 m of 25 tiles through the rig (the floor tool's ground, six new grounds added to its own table and
calibrated by measure, records/target/cook5_inside/calibration.json):
- tunnel_floor_0: a box culvert's floor. Poured slabs with a joint every 4 m, silt in drifts with its pebbles, damp, wet
  concrete where the floor dips, cans, jugs, rags, twigs, where a fire was kept, spray-paint arrows.
- tunnel_channel_0: the main channel. Wet concrete, the low flow's slick in long streaks, bars of rippled mud the last flood
  laid, standing water, tide lines, wrack lying with the water.
- tunnel_fill_0: the earth the culverts are buried in, cut through: dark, its own dark stones, quiet (so the culverts read).
ANY TILE MEETS ANY TILE (the board picks any tile of a sheet for any place): every tile of a sheet wears the SAME picture along
its edge (a noise whose lattice wraps every 12 m) and its own in its middle, the slab joints fall on the tile's edge. So what
lies on the floor runs across a join instead of stopping at it. MEASURED AND REDONE FOR IT: the first plan faded everything out
before a tile's edge (the casino carpet's way) and every tile came out a blob in an empty frame: the grid showed.
TEN PIECES, each a model in metres (reference/models/bohemia/tunnel_*.glb, its foot at the origin) rendered through the rig:
- the culvert's wall cut away at 1.8 m, east-west (the wall alone, its joints, its slime line, the water down it; and two more
  the board may pick from: one painted, one with the water's marks) and north-south;
- the trash rack across a culvert's end, whole and pried open (the bars bent out, the top rail on the floor, the wrack on it);
- A CAMP ON THE WALL, a tile wide: three beds on pallets, a rug, two loaded carts, a table made of a door, a couch, the washing
  line; A LEAN-TO: a big tarp from a cord, a second beside it, beds half under them, chairs round a cold drum, the water jugs;
  THE FLOOD'S JAM: a trunk, two carts, a mattress, a door, a fridge, tyres, pallets, branches, plastic, on the silt it stopped;
- the rungs up to a street grate.
MEASURED AND REDONE FOR IT: the first camps were a mattress and a cart at true size and could not be seen on the page; each is
now what a house-sized tile of a tunnel holds. The first pools on the floor were their own dark ground and read as holes: they
are wet concrete now. The first channel read as camouflage on his phone: its mud, slick and water are a step closer in tone.

## ANALOG HORROR, AT THE SOURCE (rule 20)
- On the wall somebody marked how high the water came, every time; the newest mark is over a man's head.
- Every arrow painted on the floor points the same way, deeper in.
- In the silt, two lines where something heavy was dragged; they stop in the middle of the floor.
- On the camp's table a candle in a jar is still burning, and nobody is there.

## PROOF (on the tree that shipped)
ON THE PAGE (rule 441(a)): the fight's own page (slices/BOHEMIA_FIGHT.html), a fight under a wash (inside: tunnels), his phone
upright (390 x 844) and sideways (844 x 390): the board deals, 165 pieces, 7 lights, 0 pictures missing, 0 page errors.
THE LOAD IS LIGHTER: the ground the fight waits on 2,544,210 -> 2,368,980 bytes (the wash and landfill blocks are no longer
loaded for it; the tunnels' own pictures went 35,244 -> 580,404). The whole kit on disk: 13 pictures, 602,818 bytes.
THE SPEED IS THE SAME, AND IT IS NOT 60 ON A SLOWED PHONE, BEFORE OR NOW (PLUMBER's row): a phone-shaped headless browser
slowed 4 times, 8 seconds a run, twice each: a blank page 60.2 to 60.4; the stand-in board 49.6 and 48.9 upright, 43.2 and 46.0
sideways; the finished one 55.1 and 47.2 upright, 46.3 and 45.9 sideways; the worst frame 133 ms.
GATES: NEW THE INSIDES WEAR FINISHED ART (gates/the_insides_wear_finished_art_gate.py, registered): 7 passed, 0 failed (A3 the
worst join against the allowance: floor 7.7 of 8.4, channel 6.1 of 9.9, fill 5.4 of 6.4; three planted fails, each red).
THE FLOOD TUNNELS (COMBAT's own): 14 passed, 0 failed (its T5 wants every piece's model on disk: each piece is exported).
PURPLE: 0 on all 13.

## WEAK, SAID PLAINLY
- The board lays ONE wall picture on every tile, so the wall is the wall alone; the painted one and the water's marks are
  there for COMBAT to pick from (a line in its dealer, its call).
- The wear cannot follow the plan: every tile is a random pick, so there is no trail down a drain and no silt banked against
  a wall. The shared edge keeps it continuous; it does not make it know where the walls are.
- A piece is small beside a man on this board whatever is made (a tile is a house, the person never zooms): the camps fill
  their tile and still read as a few dozen pixels at the phone's far zoom.
- With the camera pushed in by script past about twice the default zoom the board's cover pieces were not drawn (walls and
  camps gone at 2.2 times, there at 1.5): not walked by hand, said for COMBAT and FIXES.
- records/target/cook_flood_tunnels/*/rig.json are COMBAT TWO's records of the old models; left as they are.

[bb] Battle Brothers never goes under the ground; an inside is our own swag (rule 416), and its floor has to carry the place the
way their swamp and snow carry theirs.
[analog horror] a candle still burning on a table a mile into the dark, and on the wall the marks of how high the water came.
