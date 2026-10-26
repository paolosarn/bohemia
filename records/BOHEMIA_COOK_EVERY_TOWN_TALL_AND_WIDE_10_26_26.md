# COOK [every town looks its own] (the settlement screen's half) + [every town built for tall and wide] (rule 220)
# BUILT 10/26, NOT YET SEEN (rule 179): all fourteen home bases, both ways; RUN TWO wires them into the TOWN screen
# (rules 186(b), 213, 220, 279; lines 106, 142, 219 of his list)

## THE ASKS
- Rule 186(b), Paolo 10/25: 'every settlement has to look unique and different a little bit; they can borrow from each other,
  especially if they're in the same tier, but still... a settlement deep in the heart of the city should give more city vibes.'
  EYES 10/25w (line 106 of his list): 'IN THE TOWN one tier is still one picture: Cartel is the same yard as Mob and Network, the
  same tan house, striped stall, tank, sandbags and fence; the camps (Custom, Colorful) are the same tents.'
- Rule 220, Paolo 10/26 (line 142): 'a settlement has to be made to be ... 9 x 16 ... and then it has to be able to get flipped
  into 16 x 9 ... if I pull up on a camp ... playing tall wise on my phone. And then I switched it to widescreen mode by flipping
  my phone. The settlement will damn look exactly the same ... slightly alter the location and the entrance, buildings and stuff'.

## WHAT WAS WRONG
The settlement screen drew one of two pictures per tier, picked by the town's name: fourteen home bases on seven pictures, and the
two of a tier one place moved about (likeness 0.78 to 0.90). One shape only: upright on a phone the picture is cut or barred.

## WHAT IS BUILT
ONE PLAN PER TOWN (records/target/cook_towns/BOHEMIA_EVERY_TOWN_ITS_OWN.json, the map's own: where it stands, its tier, its trade
and landmark, its faction's colour), its things built in metres through the master rig (the 10/20 settlement tool's camera at 45
degrees, 42.9 px a metre, its ground, light and night), and TWO COMPOSITIONS of it:
- WIDE, 2060 x 1092 (tools/bohemia_cook_every_town_its_own_screen_10_25_26.py): the tier's taps where the screen has always had
  them, so it drops into today's code.
- TALL, 1024 x 1820 (tools/bohemia_cook_every_town_tall_and_wide_10_26_26.py): the SAME buildings by the same builders (the same
  storeys, walls, signs, the faction's faded colour) moved to fit an upright frame. Never a crop of the wide one, never bars.
WHERE IT STANDS: the heart (Church, Mob, Reds) is concrete blocks four to ten storeys rising off the top of the picture both ways,
storefronts, blade signs, the street with its crossing; the edge is low (tin, plywood, houses built up, containers, yards); between
(Network, Volunteers) a little of each. ITS TRADE: the church and its graves and soup line; the bank's columns and its car park;
the casino tower over its marquee and dry fountain; the stage in a ring of burnt cars; the co-op's hall, hoop houses and turbine;
the truck stop's rigs and fuel canopy; the storage rows behind a dark wall; the mast, the exchange and its dishes; the prison's
cells, towers and exercise cage; the painted hall and the bus; the crew's garage and hoist; the flood tunnels' mouths; the sawtooth
works and its crane; the field hospital and its pad.

THE RULES EVERY UPRIGHT TOWN KEEPS (rule 220(b)): the phone's corners are free (rule 213: nothing he taps in the bottom three
tenths at the outer four tenths either side); one open centre (the stall, the posts and the board round it); the entrance faces
the road he arrives by (the freeway beside the town on the map, else the side toward the city; the same side both ways); nothing
hides a tap (a building h tall hides 1.41 h of ground behind it at this camera: the rows are spaced for it and the composer checks
every door before it renders); the heart tall, the edge low.

THE GROUND IS MADE FROM THE LAYOUT (rule 220(c), 169): every thing placed is measured in the scene, each piece of it apart (three
mattresses are three blocks, never one over the wash; the walk check caught it), and written per picture in RUN TWO's format; the
doors (where a keeper stands and where he walks in) and every tap's box from the same measure.

## SHIPPED FILES (slices/settlement_ground_towns/)
- <town>.webp, <town>_night.webp (WIDE) and <town>_tall.webp, <town>_tall_night.webp (TALL) for all fourteen: 56 pictures.
- settlement_ground.json towns[<name>]: .wide and .tall, each {src, night_src, px, hotspots, boxes, doors, entrance}.
- settlement_walk.json pictures[<src>].blocks for all 56.

## MEASURED (the shipped fourteen, both ways)
- EVERY TOWN TALL AND WIDE 10/10: fourteen towns x two compositions x day and night; the same buildings both ways (dropped, named:
  Church's and Reds' east blocks, Mob's west tower, Cartel's second storage row, Network's third dish: the narrow frame's filler);
  no flat edge and every upright re-laid; no tap and no keeper under the phone, upright or sideways, with the phone either side;
  every door reached from either end of the street and every step on open ground; turning keeps the door; every pair of upright
  pictures under 0.70 (most alike Network ~ Remnants 0.637); each upright's own wide among the three nearest it in colour;
  every night darker with its pools.
- EVERY TOWN SCREEN ITS OWN (the wide pictures): every pair of the fourteen under 0.70 (most alike Network ~ Remnants 0.598), the
  tier's two old pictures 0.78 to 0.90 (the measure bites), the heart Church 4, Mob 3, Reds 4 buildings of 12 m and more off the
  top, the edge's tallest 8.6 m, median colour 3.4 to 13.5, every night darker with its pools, every step on open ground.
- THE CHECK BEFORE THE RENDER refused 21 layouts across the round and named what stood in the way: cars parked before shop doors, a
  7 m water tank before a smith, a hoist's beam over the posts, a house behind a house (its door hidden), a stall before a
  barber's door, a tent and a water bladder before two notice boards, a church tower over the lot, hiring posts across a street's
  end and over a ring of burnt cars, a razor wire before the posts' feet, palms and a patrol car closing the shops' walk, a smith's
  roof plant at a stall's step, a shack's tarp a metre forward; each moved and the town checked again.
- RULE 279 (Paolo 10/26, during the round): the phone's zone read from UI TWO's phone (124 x 276 points, 0.9 on its side, 1.25 on a
  computer) with the town fitted to the screen: upright the bottom three tenths at the outer four tenths, sideways the bottom two
  thirds at the outer tenth. One composition clears BOTH corners, so the phone's side needs no twin and no re-lay.
- WHAT THE WIDE RE-LAY MOVED (the 10/25 layout otherwise untouched): the town tier's armourer up to the street's front walk, its
  posts off the street's end to the front walk, its bar a step in from the edge; the fortress's barber a row back (its smith its
  ground floor), the bar's fire in the middle front, the build ground up a row; the camp's stall, posts and board in toward the
  middle; and what stood where they landed, moved aside (named per town in the tool).
- The upright towns' heights: the heart's three blocks rise off the top (Church six, five and seven storeys; Reds the garage, four
  and the ten-storey bank; Mob the casino tower over a two-storey row); the edge's houses and yards low with the ground behind.

## THE GLIDE'S PAIRS (rule 289(b), the routine's ask: 'the flip is a glide: each building slides from its tall spot to its wide
## spot. Keep every building's ID the same in both compositions and write both spots in the plan; RUN TWO reads them')
tools/bohemia_cook_every_town_the_glide_10_26_26.py writes settlement_ground.json towns[name].glide from the scenes' own measure
(wide/render and tall/render, every piece roof to foot):
- pieces: every thing that stands in both compositions, ONE id ('<town>.<name>', '.<k>' when a kind stands several times, the
  tap's name when a tent or a shed is the clinic), its roles (the taps it IS), and both spots: box and foot in picture px and the
  foot in the scene's metres.
- How a thing is found: pieces of one name merge where one nests in another (a sign on its wall) or they touch on one line (a row of
  graves, the church's tower and nave); ten tents one behind the next stay ten. When the two compositions hold a different count of
  a name, its touching parts merge (a garden's rows of beds, a run of panels).
- How they pair: every tap pins first (the thing of that name with the most overlap with the tap's box both ways, so the clinic's
  tent glides to the clinic's tent); the rest of a kind pair by the least travel (each foot as a share of its picture, scipy's
  assignment); what one scene holds more of fades (listed in fade).
- taps: a tap that is part of a piece (the fortress's smith is the barber's ground floor, its armourer the clinic's) or the ground
  (the lot, the build ground, a camp's arms and bar) gets its own id and 'rides' the piece it sits in, or 'ground'.
- beat_ms 500 (one beat at 120 BPM), ease MOTION's curve (rule 229).
MEASURED: 351 pieces across the fourteen towns (Church 31, Homeless 31, Colorful 30 ... Reds and Mob 20, Remnants 19); every tap
of both compositions one id (82 taps are pieces themselves, 53 ride a piece or the ground); every building and landmark built both ways one id, but the
five filler blocks leg 2 names; the fades are junk kinds a frame holds more or fewer of (carts, crates, drums, tyres, barriers) and
Cartel's wall lengths between its gates. Gate EVERY TOWN TALL AND WIDE leg 10, THE GLIDE HAS ITS PAIRS: one beat, every tap and
building an id, each id once, each spot on its picture, and the glide re-read from the scenes equals the shipped one (a stale plan
fails). It bites: a Church without its barber's id and a Mob at 900 ms failed it.
NOT YET: the pictures are flat, so a glide of real shapes needs each piece cut out of its picture. RUN TWO can slide each piece's
box (the picture's own pixels under it) over the cross-faded ground; if it wants cut-outs to the outline, COOK renders an id map
per picture (each pixel the piece it belongs to) on its next round with Blender.

## THE GATES
- EVERY TOWN SCREEN ITS OWN (gates/every_town_screen_its_own_gate.py): the wide half, 10/25's eight legs.
- EVERY TOWN TALL AND WIDE (gates/every_town_tall_and_wide_gate.py): both ways, rule 220(f)'s legs.

## SAID PLAINLY
- NOT IN A TAB YET: RUN TWO wires them into the TOWN screen (NOTE on its board: read towns[name].tall or .wide by the screen's
  shape, the boxes from the manifest, never the old constants; the lead at the same role's door on a turn; the street end he came
  in by). Until then the screen draws the tier pictures.
- The phone's zone assumes the town fitted to the screen and centred. If RUN TWO fits another way, the zone follows its rectangle.
- RENDERING: one Blender at a time (two scenes outgrew the session's 14.3 GB four times); a town's day and night take 8 to 15
  minutes; the tools hold a lock and wait on a render already holding memory, and never render a layout twice.

## REFERENCE CHECK (the 9/4 standing duty)
Battle Brothers' town screen is one landscape panorama (a computer game); the phone city builders he plays turn with the device and
re-lay the view, never letterbox (Pocket City 2 keeps one HUD across the turn). Real Las Vegas: Fremont and East Fremont's four to
nine storey blocks over storefronts and blade signs, the downtown garages, the truck stops' canopies on the 15, self-storage rows
behind block walls, the flood tunnels under the Strip where people live, the county's field-hospital tents. No reference game added.
REUSE: every builder, the kit, the camera, the light, the night and the fill are the 10/25 tool's, imported; nothing redrawn.
