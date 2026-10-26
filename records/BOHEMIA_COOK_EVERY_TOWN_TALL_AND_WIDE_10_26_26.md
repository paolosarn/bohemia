# COOK [every town looks its own] (the settlement screen's half) + [every town built for tall and wide] (rule 220)
# BUILT 10/26, NOT YET SEEN (rule 179): the pictures ship beside the screen; RUN TWO wires them in

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

## MEASURED (so far; the record is rewritten when the wide re-lay ships)
- The wide half (0cc15f6c): every pair of the fourteen under 0.70 likeness, the most alike Church ~ Reds 0.607 (the tier's two old
  pictures read 0.78 to 0.90); the heart Church 4, Mob 3, Reds 4 buildings of 12 m and more off the top, the edge's tallest 8.6 m;
  median colour 3.7 to 13.5; every night darker with its pools. EVERY TOWN SCREEN ITS OWN 7/8: the walk leg named three feet the 10/25
  layout covers (a semi before Caravans' stall, a wall before Cartel's posts, the tier boxes a little above their buildings): the re-lay.
- The upright half (cb2c18c6): EVERY TOWN TALL AND WIDE 7/10 on the first ship: the same buildings (dropped, named: Church's and
  Reds' east blocks, Mob's west tower, Cartel's second storage row, Network's third dish: the narrow frame's filler), never a crop
  or bars, nothing he taps under the phone upright, turning keeps the door, no two alike upright (most alike Network ~ Remnants
  0.639), night. Homeless upright re-rendered with its wash's concrete and dry bed as wide: its own wide nearest in colour, 0.925
  against the next 0.793.
- THE CHECK BEFORE THE RENDER refused eleven upright layouts and three wide ones and named what stood in the way: cars parked before
  shop doors, a 7 m water tank before a smith, a hoist's beam over the posts, a house behind a house (its door hidden), a stall
  before a barber's door, a tent and a water bladder before two notice boards, the church's tower over the lot, hiring posts across
  the street's end, a razor wire before the posts' feet; each moved and the town checked again.
- RULE 279 (Paolo 10/26, after the first ship): a KEEPER's door is checked too, with UI TWO's real phone (124 x 276 points, 0.9 on
  its side, 1.25 on a computer): nine upright towns had a keeper in a corner (the town tier's smith and armourer on the front walk,
  the fortress's posts): the front walk up without its awnings, the posts a row up; re-rendering. One composition clears both
  corners, so the phone's side needs no twin.

## THE GATES
- EVERY TOWN SCREEN ITS OWN (gates/every_town_screen_its_own_gate.py): the wide half, 10/25's eight legs.
- EVERY TOWN TALL AND WIDE (gates/every_town_tall_and_wide_gate.py): both ways, rule 220(f)'s legs.

## SAID PLAINLY
- RUN TWO wires them (NOTE on its board): until then the screen draws the tier pictures.
- The wide pictures keep the screen's old tap boxes, and some sit in a bottom corner where the phone goes (the town tier's
  armourer, the fortress's smith and bar, the camp's posts and board): the wide composition's re-lay, the way the tall one is
  laid, is the next row. The phone's size is my assumption until UI TWO fixes the rectangle.
- Turning the phone mid-town keeping him beside the same building is RUN TWO's (the doors are in both compositions per role).

## REFERENCE CHECK (the 9/4 standing duty)
Battle Brothers' town screen is one landscape panorama (a computer game); the phone city builders he plays turn with the device and
re-lay the view, never letterbox (Pocket City 2 keeps one HUD across the turn). Real Las Vegas: Fremont and East Fremont's four to
nine storey blocks over storefronts and blade signs, the downtown garages, the truck stops' canopies on the 15, self-storage rows
behind block walls, the flood tunnels under the Strip where people live, the county's field-hospital tents. No reference game added.
REUSE: every builder, the kit, the camera, the light, the night and the fill are the 10/25 tool's, imported; nothing redrawn.
