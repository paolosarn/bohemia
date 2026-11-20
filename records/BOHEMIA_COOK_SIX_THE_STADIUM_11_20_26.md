# COOK SIX: THE STADIUM, FINISHED, AND ITS ROOF (11/20/26)

COOK FIVE stopped when its model hit its weekly limit; COOK SIX carries its list (handoffs/COOK_FIVE.md, the block under the
new name). VAMILY rule 461 (THE WHOLE ENCHILADA, Paolo 11/20: 'full sweep, whole enchilada, dont forget nothing'), rules 453,
441, 416, 451(a), 455. BUILD 11/20d - THE STADIUM IS A STADIUM. COOK FIVE's next job on its own list: (1) THE STADIUM.

## WHAT THIS IS
COMBAT THREE's ninth inside (THE STADIUM, BUILD 11/18m: a fight on the field under the fixed roof, eleven rows of dead turf,
the relief left on it, the last show's rig, and a stand along each long side that THEY hold at the bell). Every picture of it
was a stand-in from the garage, the casino and the street board, and the roof was drawn by the page. Its handoff named the
pictures it wanted. They are in the folder now under its names, through the master rig, and the stadium laid them with no
code changed:

- THE FLOOR (stadium_floor_0.webp, five tiles by five): rows 0 to 2 DEAD TURF, never green: straw gone grey with a fine grain
  of tufts, a yard line down every tile's middle (one tile is five yards; the board is the field), the yard's ticks in a row
  still there on two tiles, patches bleached to dust, the pairs of ruts the trucks' tyres pressed into it, two rings of soot
  where somebody burned what they had. Row 3 TURF TORN TO THE DIRT where the trucks turned (deep ruts, clods turned over; a
  turf margin with its yard line on every edge, so a torn tile meets the field and any other torn tile). Row 4 a stand's
  concrete step (under the stand's own picture).
- THE PIECES (stadium_art.json's kit, COMBAT THREE's 15 names):
  THE STANDS (st_stand): the deck under the seats, concrete to 1.42 m, its treads every 12/14 m so stand tiles meet, the
  brackets of the seats that were torn out standing in the seats' own rows, the dead ribbon board and the padding along its
  front, a blanket and the cups on the front walk. THE SEATS (st_seats): eleven rows of 23, black, folded up the way empty
  seats fold, a seat in seven torn out to its bracket, some down with bedding across four of them, the shoes under them.
  THE STAIRS (st_stair_e / _w): the hall's concrete stair, yellow nosing, rails. THE RAIL (st_rail_ew): steel posts every two
  metres, two rails, a bedsheet over it with words painted on it, a blanket hung to dry, a strip of cloth tied on.
  THE BOWL'S WALL (st_wall_ew / _ns): concrete to 2.2 m, the padding to 1.25 m with one panel torn to its foam and the cover
  on the ground, the ribbon board dead above it, a section's number plate, and names chalked on the pad at the height of a
  hand, in rows.
  ON THE FIELD: SUPPLIES ON PALLETS (st_supplies, six pallets: water in its wrap, cartons strapped, folded cots, the wrap cut
  and pulled down, bottles lying on the turf) and SUPPLIES, TORN OPEN (st_supplies_b). A RELIEF TENT (st_tent, 8 m by 6, its
  ridge, the frame's seams, the flap rolled up and the dark inside with a cot, the list of names by the door, its number
  stencilled on the roof, guy lines and stakes, water jugs in a row, the mud splashed up its wall). A TRUCK ON THE FIELD
  (st_wreck_a: a box truck nose east, its roll-up door open and nothing in it, its name painted out, the front tyre flat, what
  fell out the back flattened). AN AMBULANCE ON THE FIELD (st_wreck_b: the box, the cab, the stripe, the light bar dead, both
  back doors swung out and the stretcher half out with its legs down on the turf and its straps undone). THE SHOW'S RIG
  (st_rig: a ground stack of subs and four hung boxes, a truss tower 5 m with a dead head and the tour's banner torn, the
  sound desk on its riser with its faders where they were left and the set list taped on, the amp rack, road cases, a camp
  chair, the snake from the stack to the desk, the cups and the wristbands). CROWD BARRIERS (st_barrier: four, one knocked
  flat, a sign zip-tied to one). THE BENCH (st_bench: two long benches with the helmets still in a row on them, a towel, the
  cooler on its stand, the heater cold).
- THE ROOF (stadium_ceiling.webp, rule 451(a), over the fight at his 10%): ONE PICTURE THE SIZE OF THE BOARD, 20 by 15 tiles
  (COMBAT THREE's own offer in its handoff: 'yours may be one picture the size of the board, 20 by 15, if you set "tile":
  [20, 15]'): the translucent roof's panels, darker toward the rim where the dust lies, solid over the stands; a net of 28
  cables running out from the ring and four rings of cable round it; panels gone here and there (the day through them); THE
  RING over midfield, its steel and its glazing grid, most of its panes out; the light banks along both long sides with every
  head dead; the catwalks; the dead scoreboard over the west end zone. stadium.json's ceiling entry says "have": true and
  "tile": [20, 15] (the one agreed edit in COMBAT THREE's file).

17 pictures, 781,318 bytes in the folder (its budget 900,000); the floor 155,962, the roof 72,824.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js on the real fight page (slices/BOHEMIA_FIGHT.html, the one the demo and the
alpha open), 390 x 844 and 844 x 390, the stadium asked for by name:
- BEFORE (main 64ab8c77, the stadium's art file absent), the_last_show: THE STADIUM, 185 pieces, 185 of them stand-ins, the roof
  drawn by the page (no picture), a fight tile 32.6 points upright and 22.4 on its side; 0 page errors.
- NOW, upright 390 x 844, the_last_show: 185 pieces, 0 stand-ins, 0 with no picture, the roof's picture drawn at 0.1 over
  [20, 15] (the whole board, once), a tile 32.6 points, 0 page errors, 0 pictures lost.
- NOW, on its side 844 x 390, the_last_show: 185 pieces, 0 stand-ins, the roof's picture drawn, a tile 22.4 points, 0 page
  errors, 0 lost.
- NOW, upright, the_bowl: 184 pieces, 0 stand-ins, the roof's picture drawn, 0 page errors, 0 lost.
- Close in (the page as it is), both ways: the stand they hold, its stairs, the bench, the rig, the tents, the supplies, the
  wreck, the torn turf, the south stand, the fire.

## THE GATE, AND WHAT CHANGED IN IT
THE INSIDES WEAR FINISHED ART (this lane's) takes the stadium as its eighth kit (A1 to A6, P1; its walls the wall, the rail,
the stand and both stairs, a tile long) and its roof as a ninth ceiling. A NEW LEG, C2b: a ceiling whose 'tile' is its
inside's board for every layout (the stadium's [20, 15]) is ONE picture, drawn once and never repeated, so C2's 'any bay meets
any bay' does not read it (a ring over midfield does not repeat); C2b holds it to covering every layout's board exactly, a
tile on it the board's own shape within a tenth (so the ring is not squashed). On this tree: THE INSIDES WEAR FINISHED ART 63/0 (eight kits, nine ceilings). COMBAT THREE's own gates: THE BIG INSIDES 93/0 (the stadium: 24 of 24 boards joined, 24 of 24 fights ended on AUTO, 6.2 rounds a fight, the pieces real, its ceiling the picture), AN INSIDE SHOWS ITS CEILING 6/0.

## REFERENCE CHECK (compared to the world before calling it done)
An NFL stadium under a fixed translucent roof (a cable-net roof of ETFE panels, a ring over the field, light banks round the
rim, an end-zone video board); the field marked every five yards with the yard's ticks in rows; the first rows of the lower
bowl on concrete treads with black fold-up seats that fold up when empty; a padded wall with a ribbon board; tunnels at the
ends; the Louisiana Superdome of 2005 for what a stadium is after (relief pallets and tents on the turf, bedding in the seats,
words on bedsheets hung over the rails, trucks driven onto the field). The twins: the terminal's kit and the hall's (the card
shows the stadium before and now).

[analog horror: a team's helmets still in a row on the bench; a stretcher half out of the ambulance with its straps undone;
names chalked on the padding at the height of a hand; a bedsheet over the rail with words on it nobody came to read]
[bb Battle Brothers' hill fights: the side on the slope shoots first; the stands have to read as high ground at a glance, a
long concrete step with the seats on it]

## THE TOOLS
tools/bohemia_cook6_the_stadium_finished_11_20_26.py   cal; render st_floor | st_pieces | ceil_stadium; plan; cut; sheet
  (ON COOK FIVE's terminal tool and the six under it: seven deep)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js <outdir> stadium [upright,sideways] [the_last_show|the_bowl] (now takes the stadium)

## NOT DONE, SAID PLAINLY
1. THE SOUTH STAND'S SEATS FACE SOUTH, away from the field: COMBAT THREE's legend lays one 'm' piece on both stands and the
   board flips columns, never rows. At 32 points a tile a seat is a point and a half wide and its facing does not read; a
   north-facing second (st_seats_n) is one more name if COMBAT THREE wants the south stand turned.
2. The opening view is the day's pools on the turf at night: the field is mostly the lit squares the 'sky' light lays
   (COMBAT THREE's), and the turf's yard lines show faintly between them. The pieces carry the stadium; the floor reads at
   the close zoom.
3. The scoreboard is a block from the map's eye (the rig dusts every flat top pale, so its dead face reads grey, not black).
4. No night versions. The bowl layout was shot upright only (the last show both ways).
5. Next on this lane: the two home centers on the map (their scenes are made: tools/bohemia_cook6_the_home_centers_wear_their_own_piece_11_20_26.py),
   then THE REGION'S FOUR: MEASURED this round: the region's places (TULE SPRINGS LAB, LENZIE STATION, SPRING MOUNTAIN
   RANCH, CALLVILLE BAY) are drawn by slices/bohemia_region.js drawPlaces through the map's mapBaseDraw(tier, name), as a
   painted patch or the tier's art, after the whole map frame (after the fog). slices/bohemia_place_pieces.js draws only the
   valley's (BOH_REAL_PLACES.cellsNow()). So there is NO data-only seam: a region piece needs a wrap of mapBaseDraw by the
   place's name in this lane's own module (about 25 lines) and four scenes. That is a build of its own.

VOTE: cook6-the-stadium-11-20 (MADE FROM arena2-the-pit-is-a-pit-11-7).
