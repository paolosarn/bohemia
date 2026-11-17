# COOK FIVE: THE BUS YARD AND THE GREENHOUSES WEAR THEIR OWN PIECE (11/17/26)

The coordinator's routine 'COOK FIVE full sweep' (VAMILY rules 453, 441, 408, 409(c)): 'finished art wherever a VOTE card
still says STAND-IN and he meets it first, each its own build: ... the bus yard and the greenhouses'. BUILD 11/17k - THE BUS YARD AND THE GREENHOUSES. The sweep's
second build.

## WHAT WAS THERE
WORLD FOURTEEN seated the last two of rule 409's real places on the valley (BUILD 11/11o): THE BUS YARD (the RTC's Sunset
Maintenance Facility) and THE GREENHOUSES (Urban Seed's on Wynn Road), each with a person who talks and two choices. On the
map each WORE THE KIT ART OF THE KIND IT IS LIKE: the bus yard a terminal like any terminal, the greenhouses a farm like any
farm. slices/bohemia_real_places.js says it in its own words ('until COOK FOUR's golden piece, rule 408') and WORLD
FOURTEEN's handoff asked for them by name: 'the yard of buses in rows and the long plastic houses with the lights'. Nobody
had made them, and nothing on the map could draw one.

## WHAT THIS BUILD IS
1. TWO PIECES, through the map's rig, in BOSSES' frame for a whole place (a ground plate 150 pixels across):
   THE BUS YARD: the long maintenance shed across the back with the transit band round its eaves and its roll-up bays (one
   lit: the mechanics who stayed), and the buses in ranks, nose out, white with the band, the battery packs on their roofs;
   one burned black, one up on cribbing with its pack pulled and stacked in three on a pallet beside it, one with its sign
   still lit; two more along the front, the gate's hut.
   THE GREENHOUSES: four long plastic houses side by side, hoop after hoop, three lit rose from inside by the grow lights
   and one dark, a door planked shut from the outside, the water totes in their cages, the crates of greens by the way in.
   Rose, never purple (PURPLE RESERVATION: the gate counts 0 purple pixels).
   HIS RULING ON AN ICON (8/2: 'the building is the icon... it just needs to fill up the square', no parking smear): the
   buses are few and big and the shed spans the lot; the houses were lengthened to fill theirs (the first cut left a third
   of the lot bare dirt).
2. A SMALL DRAW: slices/bohemia_place_pieces.js (COOK FIVE's, 50 lines). For every real place seated on this valley (WORLD's
   own list, BOH_REAL_PLACES.cellsNow(), never a second one) whose id is in slices/place_pieces/place_pieces.json, it draws
   that place's picture on its own block, its two frames on the map's beat. UNDER the fog, the night, the names and the
   people: a place he has not seen is dark like the land round it. A place with no entry wears its kit art as before.
   ONE LINE in BOHEMIA_CITY_WORLD.html calls it (before the fog) and one loads it, the way every lane's module is hooked.
   No tap, no name, no rule: those stay WORLD's.
3. THE LIST A MODDER EDITS: place_pieces.json (an id, its two pictures, where its block's middle is in them).

The folder: 53,446 bytes (four lossless WebP pictures and the list). The published set measured 839 MB of 900 before this ship.

## MEASURED ON THE PAGE, AND WHAT IT CHANGED
- THE MAP HE TRAVELS IS 18 POINTS A BLOCK on a phone. At 1.3 blocks (a boss's place's width) a piece was 23 points across:
  a crumb. So a piece is never under 46 points across (min_css; a boss's place is held to 64 the same way): 51 and 54
  points on the glass, upright and sideways.
- THE ALPHA'S RUN TAB OPENS ON THE WORKSHOP'S OLD WALK, not the map: the first shots were of a street. The map he plays is
  the demo's; the proof and the gate run there.
- TWO BLOCKS FROM A PLACE HIS OWN MEN STAND IN FRONT OF IT (the crew's figures are three blocks tall), and ONE block from
  it its screen opens. The shots are taken six blocks off to one side.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_the_place_pieces_on_the_page_11_17_26.js: a new game on the demo, out of the town, the crew sent by the map's
own travelTo to six blocks from each place, the same frame shot with the switch off (the kit art) and on (its own piece).
Upright (390 x 844) and sideways (844 x 390): both pieces drawn, 51 and 54 points across, no error.
Gate THE PLACES WEAR THEIR OWN PIECE 8/0, new, registered: S1 the list (every piece a real place's, its frames files of its
size); S2 the map loads the module and calls its draw once, before the fog; S3 it is a thing (24 and 26 in 100 of its box,
162 and 130 steps of tone, its two frames differ); S4 light, no purple; P1 planted; and ON THE PAGE: G1 loaded and seated,
G2 off none drawn and on each 44 points or more, G3 IT IS SEEN (inside its rectangle 56 and 73 in 100 of the glass is
another picture).

## REFERENCE CHECK (compared to the world before calling it done)
A transit maintenance yard (a long shed of roll-up bays, buses parked nose out in ranks; battery-electric buses carry their
packs in a box on the roof); a bus up on cribbing with its pack out. A commercial hoop-house range (steel hoops under milky
polythene, end walls with a door, IBC totes in cages, the glow of LED grow lights through plastic at night, here rose).
The twins: BOSSES' places at the same frame and scale, and the kit's own terminal and farm blocks beside them on the map
(the card shows each place before and now).

[analog horror: two hundred buses with their doors open and one sign still lit; plastic houses that glow rose all night
with a door planked shut from the outside]
[bb Battle Brothers' map gives every settlement kind and every landmark its own silhouette, read before its name; a place
that looked like any terminal had none]

## THE TOOLS
tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py   scenes | render (BOHEMIA_BPY=<venv>/bin/python) | finish | sheet <shots>
tools/bohemia_the_place_pieces_on_the_page_11_17_26.js <outdir> [phone_portrait|phone_landscape] [id,id]

## NOT DONE, SAID PLAINLY
1. ARRIVING AT EITHER PLACE STILL OPENS THE CAMP'S SCREEN: tents on sand and an elder. That is the bigger stand-in he meets
   there. A town draws its own arrival picture when slices/settlement_ground_towns/ names it (COOK's EVERY TOWN ITS OWN);
   a real place can be named there the same way. That is this lane's next build: the bus yard's and the greenhouses' own
   screens.
2. The other sixteen real places wear their kit art still (the cooling center and the dome are next on the order).
3. The names over real places show only from 20 points a block (WORLD's rule in bohemia_real_places.js): at the map's
   opening size the piece is there and its name is not. Left as it is: WORLD's.

VOTE: cook5-the-bus-yard-and-the-greenhouses-11-17 (MADE FROM arena2-the-pit-is-a-pit-11-7).
