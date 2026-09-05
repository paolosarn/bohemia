# CITY-BUILDER REFERENCES (block, street, lot — at our tile size)

FOR: the faction-towns work (FORTRESS / TOWN / CAMP, 9/4) and the combat
ground (a tile is a house, 9/4). Our scale facts, so every rule lands on
them: a ground cell's art is 44 px, a district tile is 128 x 128 cells,
a combat tile is one house (1.5 to 2 sprite widths), and the valley's
grain is the arterial mile grid. Nothing here enters the design
vocabulary (8/28): these are rulers.

### CB-01  SimCity 2000's density ladder
- WHERE: https://frontiernerds.com/simcity-2000-sprite-extraction
- KIND: pixel
- TEACHES: a block's density tier reads at zoom from ROOF PATTERN alone (small pitched, big flat, tower); a town that wants to read as denser than a camp must change its roofscape, not its wall detail.

### CB-02  The Impressions housing block (Caesar III / Pharaoh / Zeus)
- WHERE: https://game-wisdom.com/guest/of-walkers-and-men-city-building-by-design
- KIND: pixel
- TEACHES: a LOT is road-adjacent or it is dead — every working building faces the street that serves it; the BLOCK is simply what the road loop encloses. A lot placed without street frontage is a bug in any city, theirs or ours (our own drivable-access gate already says so).

### CB-03  The block sized by the errand (the roadblock discipline)
- WHERE: https://caesar3.heavengames.com/cgi-bin/caeforumscgi/display.cgi?action=ct&f=25,6105,2075,all
- KIND: pixel
- TEACHES: a block's SIZE comes from how far a service can walk before turning back; a town reads as one place when its whole loop is one errand long, and a fortress compound is a block whose loop closes inside the wall.

### CB-04  OpenTTD's road grain
- WHERE: https://wiki.openttd.org/en/Manual/Towns
- KIND: pixel
- TEACHES: the road grid is the first thing legible at every zoom, and every building inherits its orientation from its road; a lot that ignores its street's direction breaks the block's grain more than any wrong colour.

### CB-05  Songs of Syx at far zoom
- WHERE: https://steamcommunity.com/app/1162750/discussions/0/4031350196519773213/
- KIND: pixel
- TEACHES: zoomed out, a city stops being tiles and becomes COLOUR MASSES by function; a district's identity must survive that switch (our icon law already holds it: every map square its own place), so a faction town needs one dominant roof-and-ground colour statement, not thirty small ones.

### CB-06  The valley's own grain (ours, measured and gated)
- WHERE: laws (STREET-AWARE / DRIVABLE ACCESS, gate district_kit_gate.js) + the arterial mile grid on the walked map
- KIND: real
- TEACHES: Vegas blocks hang off arterial miles, subdivisions close into cul-de-sac loops behind block walls, and every plot is enterable by a vehicle; a faction town cooked here obeys the same three or it reads as dropped onto the map instead of grown from it.

### CB-07  Learning From Las Vegas, the builder half
- WHERE: https://www.udg.org.uk/publications/udlibrary/learning-las-vegas
- KIND: real
- TEACHES: on a commercial street the LOT's front is parking and the SIGN is taller than the building; a market street in this valley puts its stalls where the parking was, and the sign pole is the cheapest tallest thing a faction can claim.
