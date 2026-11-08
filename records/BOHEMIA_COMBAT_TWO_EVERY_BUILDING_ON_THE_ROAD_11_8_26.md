# EVERY BUILDING ON THE ROAD (COMBAT TWO, 11/8/26)

VAMILY rule 429(h), ask line 509 (the rule names 504 and 505; the ask file's own row for (h) is 509). Paolo 11/7: "my biggest
problem with the combat maps, the old and the new, you still cannot recognize: every building needs to have a road on it, the road
can be big, the road can be small, sometimes roads four tiles wide and that's OK, but a building needs to be part of whatever road
network you want there to be."
BUILD 11/8e - EVERY BUILDING ON THE ROAD. BUILT, NOT YET SEEN. VOTE combat2-every-building-on-the-road-11-8 (stand_in).
THE BOARDS are COMBAT TWO's (this); THE MAP is WORLD 13's (429(d), the generation), in flight there.

## MEASURED FIRST (headless, the live deal, the 15 place boards x 20 seeds and three towns, the darkness reader the fight had)
- 1,516 of 3,640 buildings had no road beside them. The lab and the rail yard read no road at all (their concrete is light); the
  airport's hangars stood on the apron the fight called no road; a suburb's top row of houses faced a yard with its street two
  tiles off; on the Strip the darkness reader read the hangar-like shadows and the checker forecourts as roads.
- 180 of 360 boards had their roads in pieces: the suburb's three streets never met (each ran edge to edge), the Strip's boulevard
  was cut by every dead car baked on it, downtown's in eleven (shadows, a bus across the street, the three-lane street read as
  two one-lane ones because its middle lane is tan), the trailer park's three lanes never met.
- A board with no house never went through the layout pass at all (housesIn returned for any board without a suburb block), so
  its roads could not be fixed even where they were wrong.

## THE FIX (slices/bohemia_street_board.js fromTemplate, roadsJoin; slices/BOHEMIA_FIGHT.html housesIn; records/target/bb/ours.json road_network)
- EVERY BOARD THE OLD LAYOUTS DEAL IS LAID (ours.road_network.on): not only the boards with houses; the Strip, downtown, the airport,
  the lab, the trailer park and every family deal now go through the same pass, drawn tile for tile from the same pictures.
- THE ROAD, READ FROM THE BOARD'S OWN PICTURES: asphalt (its dark share at 30 or more) only on a kind that has asphalt (never the
  landfill's trash streams, the canyon's or the shore's shadows, the casino's red carpet that would read as a 25-tile road, the rail's
  ballast); every open tile of the airport's apron and the lab's yard (paved: their concrete is the road the trucks drove; a 'paved'
  tile, not a 'street', so AUTO's open-street cost does not change there); the one open tile between two road tiles (a median,
  Fremont's tan middle lane); a wreck of up to two blocked tiles across a lane with asphalt at both ends (the Strip's dead cars, the
  bus on Fremont, the pass's jackknife); a piece under three tiles each way is a shadow or a pad alone, no road.
- A BUILDING: every house; else a lump of a built kind's walls and roofs, two tiles or with a roof (one blocked tile alone is a
  thing: a car, a sign, a bin). The casino's floor blocks are the inside of a building, not a building on the board.
- THE DRIVE: a building with no road beside it gets the cheapest walk of open ground to the road, from its front (south) first, a
  turn costing more than a step so it runs straight with one corner (a busy picture, rough ground, a piece on the tile cost more).
- ONE NETWORK: every piece that can reach another over open ground is joined to it, the biggest that can reach out first; on a board
  with no building (the pass, the wash), a road that runs off the board both ways is the highway going through and stays; a piece
  that joins none and reaches no edge runs on to the nearest edge (the warehouse street that ended where the desert began); a board
  with buildings and no road at all (the golf course) gets its road in from the edge to the clubhouse's front.
- THE PAINT: a joined tile is the street kit's own road piece (kit_street: north-south, east-west, the junction where it meets more),
  flat, a street; what stood on it (a fence, a lamp, a wall piece) is gone. Never on a casino's floor. Nothing else of the board moves.

## MEASURED AFTER (gate EVERY BUILDING ON THE ROAD, 600 boards: the 15 places x 20 seeds, every other district x 6, the freeway's own aside)
- 0 of 6,279 buildings with no road beside them (738 drives laid, 38 roads in from the edge); 559 joins; 0 pieces a walk of open
  ground could still join; 0 stubs that reach no edge.
- What is painted: the suburb about 30 tiles a board (its top row's street, two cross streets), the trailer park 8 (one cross lane),
  downtown one curb cut through the sidewalk, the Strip, the lab and the airport nothing (their roads were there, now read).
- Against the same boards with the join off: only the painted tiles changed (155 of 155 over 74 boards); no board lost the walk
  between the two lines.
- Roads come in sizes (the biggest square of road a tile stands in): one tile on 448 boards, two on 176, three on 91 (the Strip's
  boulevard, Fremont, the minigp), four and more on 40 (the airport's apron, the lab's yard).

## GATE
gates/every_building_on_the_road_gate.js (EVERY BUILDING ON THE ROAD, registered), about 20 s: R1 every building fronts a road
(planted: a house's road taken away, caught); R2 one network (planted: a stub of road apart, caught); R3 the paint is real, every
other road tile the board's own (planted: a painted tile showing a yard, caught); R4 fixed there and only there; R5 roads in
sizes; R6 enough boards. ALSO RUN, ONE AT A TIME: THE OLD LAYOUT, THE NEW HOUSES 25/0 (A1 re-aimed: a tile the join painted is the
join's, gated by R4); EVERY MAN ACTS ON AUTO 5/0 (0 idle of 1,647); THE BOARD IS THE CITY AT THAT SPOT 194/0; THE CAMP IS PITCHED ON
THE BOARD 14/0; EVERY FIGHT ENDS 10/0; THE ENEMY WANTS TO LIVE 4/0; AUTO PLAYS THE BEST TURN 7/0; THE FORMATION IS KEPT 23/0; CLIMB
OR ATTACK 6/6; AUTO AT 4X NEVER CRASHES 7/0; HEIGHTS YOU CAN READ 4/0.

## WEAK, SAID OUT LOUD
- THE CASINO DISTRICTS (casino, luxor, resort, highroller, bank, aquarium, mobmuseum) deal a checkerboard of casino floors and
  street blocks: a five-tile street between two casino floors can join nothing without a road through a casino, so it ends at the
  casino it serves (22 such pieces over the 600 boards, counted apart by R2). The casino floor (rule 416) is the next job and
  settles where a casino's inside sits on a board.
- The Strip's east forecourt behind the casino wall, and downtown's two sides of the canopy, are two networks joined off the board
  (a wall edge to edge between); R2 allows only that.
- A painted tile is the street kit's asphalt, a touch darker than the old blocks' own; a drive through a white sidewalk is a dark
  curb cut. A painted road crossing a yard wall or a lamp takes it away.
- The darkness reader still decides what is asphalt on a kind that has it: a dark shadow three tiles long on a street kind reads
  as road (rare; R3 holds the reading to the picture).
- The map (WORLD 13's generation) is not this: its own streets are WORLD 13's (429(d)).

[bb] Battle Brothers' battle maps are cut from the world tile's terrain and never ask whether a house has a road; ours asks for
every building, and paints the drive where the old layout left one off, our swag.
[analog horror] a driveway of fresh black asphalt leading from a dead suburb's house to a street nobody has driven in years.
