# COOK SIX: THE REGION'S FOUR WEAR THEIR OWN PIECE (11/20/26)

COOK FIVE's list carried on by COOK SIX (VAMILY rule 461, THE WHOLE ENCHILADA; rules 453, 441, 408, 409(c), 455). BUILD
11/20n - THE REGION'S FOUR. COOK FIVE's list: '(3) measure how the region draws its four real places and whether a piece can go there with no
code'. Measured this round (records/BOHEMIA_COOK_SIX_THE_STADIUM_11_20_26.md, NOT DONE 5); the answer was no, so this is the build.

## WHAT THE MEASURE FOUND
The nineteen real places (records/target/bb/real_places.json) are fifteen in the valley and four past the rim (where 'region'):
TULE SPRINGS LAB, LENZIE STATION, SPRING MOUNTAIN RANCH and CALLVILLE BAY. The valley's fifteen are seated by WORLD's
BOH_REAL_PLACES.cellsNow() and drawn by slices/bohemia_place_pieces.js under the fog. The region's four are NOT in that list: they
are places of the region's own (slices/bohemia_region.js, from tools/bohemia_world_region.py), and its drawPlaces draws them AFTER
the whole map frame through the map's own mapBaseDraw(tier, name, sx, footY, mine, beat): a patch the map paints of the far land
(vbRegionPatchDraw) or the tier's art. So no picture in place_pieces.json could reach them: a region piece needs a seam in code.

## WHAT THIS IS
ONE SEAM, in this lane's own module (slices/bohemia_place_pieces.js, at its foot): mapBaseDraw is wrapped BY NAME. A region place
whose id has a picture in place_pieces.json is drawn as its own piece in place of the painted patch: its ground plate scaled to the
patch's own blocks (a fortress 4, a camp 2) times 0.85, never under min_css, its two frames on the map's beat; its size goes back to
the region's draw, which takes the tap and sets the name by it as before. Any other name, the switch off (BohemiaPlacePieces.on
false, the page test's), a picture not loaded or the far stops (a block under min_block_px): the map's own draw, untouched. Nothing
of the region's file edited. place_pieces.json says 'where': 'region' on the four and how they lay ('region').

FOUR SCENES, each from what the world's own list says of the place, through COOK FIVE's places tool:
- TULE SPRINGS LAB ('Payroll stopped, so I stopped going home. Nobody feeds them now, only me... Pen four still has the wolves. The
  big ones, from the tooth they dug out back... the clock by the door still counts down to feeding time. It's late two thousand
  nine hundred days.'): a low white lab block on the wash, its dead chillers and its dish on the roof, the door chained, the rows of
  pens behind it with every gate chained, three dire wolves in pen four, bigger than any dog; the dig out back under its tarp, the
  bones laid in a row and the tooth; the keeper with his empty bucket, the feed sacks slit and empty. On the beat: the red clock
  over the door, and the wolves' eyes in pen four.
- LENZIE STATION ('Three turbines and not one cubic foot of gas... The stacks still have their lights. Red, every night, for
  airplanes that don't come.'): three combined-cycle units in a row, each a boiler box and its tall stack with the red band, the
  turbine house in front with one door open; the air-cooled condenser, a deck of eight fans on steel legs (the desert plant's own
  shape) and its wind wall; the switchyard, the lines going nowhere; the gas line dry at its red valve; the battery room's door
  open and what came out of it; the watcher at the open door. On the beat: the stacks' red lights.
- SPRING MOUNTAIN RANCH ('Forty head left, out of four hundred. The springs still run... The rustlers come down from Blue Diamond on
  the full moon... the old ranch house, the Hughes house. The phone in there still rings sometimes. The line has been cut since
  before I came.'): Red Rock's sandstone in tiers along the back with its bands and what fell off it; the red ranch house and its
  porch; the long barn with its tin roof; the hay under its own roof; the corrals of rails with the last cattle in them and their
  troughs; the spring's pond and its cottonwoods, the only green for miles; two men on the fence with rifles and their fire. On the
  beat: the guards' fire, and a light in the house where the phone is.
- CALLVILLE BAY ('Forty motorhomes and not one with gas... the marina sits on the mud like a dead boat... the camp host's sign still
  says THREE NIGHT LIMIT. Some of us have been here eleven years.'): the lake far out, the cracked mud it left and the bathtub ring
  on the shore; the marina's docks and three boats lying on the mud, its store; motorhomes in their sites with awnings out, fish
  drying on lines, their cooking fires, three people; the camp host's sign. On the beat: the fires among the motorhomes, and a
  lantern on the dead marina.
FOUND BY EYE ON THE WAY: the ranch's cliff first read as a stack of red crates (now one mass in tiers with its bands), its trees as
green tanks (now canopies in lumps), its roofs as diamonds (a four-sided prism; now a roof and a ridge). On the page the first
plates were the valley's pale ground and sat on the dark far land like stickers: the region paints its land darker (measured round
each place on the glass: 65 to 110 of 255), and the rig lifts a dark ground about 1.4 times, so each plate is now that land's tone.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_cook6_the_region_pieces_on_the_page_11_20_26.js on the demo (a new game, the fog lifted as a checker measures the map,
out of the town), the crew sent by the map's own travelTo out past the rim to three blocks south of each place, and walking there
(none had to be put):
- upright 390 x 844: the seam loaded, the four seated on the region; TULE SPRINGS LAB drawn 68 points across, LENZIE STATION 68,
  SPRING MOUNTAIN RANCH 51, CALLVILLE BAY 51 (a block 18 points); with the switch off the region paints its own patch and no piece
  is drawn; 0 page errors.
- on its side 844 x 390: the same four, the same widths, 0 page errors.
- With its own piece each place now carries its NAME on the glass right over it (the region's draw sets the name by the size the
  seam hands back; before, the patch's size put it elsewhere or not at all).
Gate THE PLACES WEAR THEIR OWN PIECE 11/0 with nineteen places: G1 now holds the valley's fifteen; its new region leg R1 (the seam
loaded, the four seated and walked to, no page error), R2 (off the patch, on the piece 44 points or more), R3 (seen: 51% to 64% of
each rectangle another picture with it on). Also green on this tree: THE MISSING REAL PLACES 16/0 (the region's four on the land at
their real coordinates, standable, reachable), NO NAME COVERS ANOTHER 10/0, THE REGION HAS ITS CITIES 5/0, THE PLACE IN THE DARK 20/0.

## REFERENCE CHECK (compared to the world before calling it done)
A low research facility on desert wash with outdoor animal runs and a field excavation (Tule Springs is a real fossil bed: the
1962-63 Big Dig; the lab is Bohemia's, laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md); a combined-cycle
gas plant in the desert (heat recovery boilers each with one tall stack and aviation lights, an air-cooled condenser on legs, a
switchyard: Chuck Lenzie Generating Station at Apex); a historic ranch under a sandstone escarpment (Spring Mountain Ranch State Park:
the red ranch house, the corrals, the spring); a lakeside campground and RV park with a marina stranded by a falling lake (Callville
Bay, Lake Mead). The twins: COOK FIVE's thirteen and this lane's two home centers (the same frame, rig and draw), and the region's
painted patch each wore (the card shows each before and now).

[analog horror: a clock still counting down to a feeding nobody brings; red lights on the stacks every night for airplanes that do
not come; a phone ringing in a house whose line was cut; a sign that still says THREE NIGHT LIMIT to people eleven years in]
[bb Battle Brothers' map: a place worth the walk is told from a village at a glance, out in the wilds most of all]

## THE TOOLS
tools/bohemia_cook6_the_regions_four_wear_their_own_piece_11_20_26.py   scenes; render (clears its masters first: the render skips a
  master on disk); finish; sheet   (ON COOK FIVE's places tool and this lane's home centers' tool)
tools/bohemia_cook6_the_region_pieces_on_the_page_11_20_26.js <outdir> [phone_portrait|phone_landscape] [id,id]   (the region's
  proof: the crew walked out to each by the map's own travelTo; 'put' if the camera had to be placed, and the gate refuses that)
gates/the_places_wear_their_own_piece_gate.py: G1 holds the valley's places; R1 to R3 the region's (seam loaded, seated, walked to,
  no page error; off the patch, on the piece 44 points or more; seen).

## NOT DONE, SAID PLAINLY
1. At the travel zoom a camp is 51 points wide and a fortress 68: the wolves are specks and the stacks' red lights a pixel until he
   pinches in (the same as the valley's places).
2. Their own arrival screens are the screen's lane; the fight out there deals the region's own boards.
3. The seam draws a region place over the land after the whole frame, as the region's patch was: under the region's own night,
   not the valley's (measured as the patch was: the same pass).
4. Next on this lane: COMBAT FOUR's powerhouse (its 22 names and its crane roof): the tool is written
   (tools/bohemia_cook6_the_powerhouse_finished_11_20_26.py), its renders next.

VOTE: cook6-the-regions-four-11-20 (MADE FROM arena2-the-pit-is-a-pit-11-7).
