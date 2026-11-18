# COOK FIVE: CLARK STATION, THE ANIMAL SHELTER AND THE SCRAP MILL WEAR THEIR OWN PIECE (11/18/26)

The coordinator's routine 'COOK FIVE next' (VAMILY rules 453, 441, 408, 409(c), 455): 'take the next jobs on your own list,
one build each: finished art wherever a card still says STAND-IN; every picture lands light'. BUILD 11/18k - THE MINT, THE DOGS AND THE SCRAP YARD. This round's third
build, the second job on this lane's list going on: the real places left in kit art.

## WHAT THIS IS
Three more of the valley's fifteen real places (records/target/bb/real_places.json, where 'valley') wore the kit art of the
kind each is like: CLARK STATION a battery yard like any battery yard, the ANIMAL SHELTER a warehouse like any warehouse,
THE SCRAP MILL an industrial block like any other. Each has its own piece on the map now, through the map's rig, in the
same frame as the ten before it (NO CODE: three entries in slices/place_pieces/place_pieces.json and six pictures). What
each shows is what WORLD's own list says of it:

CLARK STATION ('THE MINT': 'nineteen units, and one still turns: they cut a hatch in the old 1954 boiler and feed it pallets
and tires. That one unit charges every battery on this side of the valley'): the tall steel-clad boiler house and its one
stack, black at the lip; the turbine hall beside it and the control room's glass on its end; four gas units cold in a row;
the switchyard's two gantries, their lines and three transformers; the gas main in along the yard's edge to its valve, dry;
the heap of tires and pallets at the hatch and two men feeding it, the soot up the cladding over it; and the mint itself:
the charging racks under their roof, a cable to them from the hall, four people waiting with a battery each. On the beat:
the hatch's fire, the stack's black smoke leaning off ('the whole east side smelled like it'), and the control room's
glass ('the control room still calls out the load every hour. Nobody here is reading it').

THE ANIMAL SHELTER (Mojave Road: 'when the staff stopped coming I opened every kennel ... these ones never left'): the low
tan shelter, the intake door and the lamp over it, the bell on its post; two blocks of outdoor runs, every gate standing
open; the control truck on its rims, one compartment open; the keeper and her bucket; seven dogs eating in a row at the door
('oldest first'), each at a bowl; the sacks they never got to; dogs lying in the open runs and loose on the lot; and the
brindle by himself at the kerb, looking out ('he picks people'). On the beat: the lamp over the intake door, and the bell
('the intake bell still rings at nine every morning. There is nobody at the door').

THE SCRAP MILL (North Las Vegas, Commerce Street: 'where the dead grid ends up: copper pulled out of the walls, sheet metal
from the roofs, a baler that still runs on a truck battery'): a fence of other people's roof sheet, no two panels alike; two
walls of cars pressed flat and stacked, up to six high; the heap and the crane's magnet over it with what it holds; the
baler and its yellow ram, its bales in rows; a truck with its hood up and a cable from its battery to the baler; coils of
copper on pallets; roof sheet in a heap and a man cutting it; pole transformers stood in a line; white goods down one side;
cable chopped in bins. On the beat: the baler's lamp, and the torch.

The folder is 322,674 bytes now (twenty-six lossless WebP pictures and the list). THIRTEEN OF THE VALLEY'S FIFTEEN REAL PLACES
HAVE THEIR OWN PIECE; the two home centers are left. (The list is nineteen places now: four are out in the region, the lab,
Lenzie Station, the ranch and Callville Bay, and the region draws its own places.)

## WHAT WAS TRIED AND THROWN OUT (so nobody redoes it)
THE BALER UNDER AN OPEN SHED was a white roof with nothing under it: the map's eye is over the roof. Out in the yard it is
the yellow thing a man looks at first. THE YARD WITH ONE CAR STACK was an empty lot with things at its back: two walls of
cars, a heap 3.9 high and white goods down the side fill it. DOGS AT LIFE SIZE were specks (a dog is under three pixels at
the map's 4.4 a unit): they are 1.3 times a big dog, as the map's people are bigger than people.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_the_place_pieces_on_the_page_11_17_26.js on the demo, upright and sideways, the crew sent by the map's own
travelTo to six blocks from each:
- upright 390 x 844: the module loaded with thirteen pictures, 15 real places seated; a block 18 points; CLARK STATION at block 28,55 drawn 51 x 64
  points, the ANIMAL SHELTER at 33,26 drawn 51 x 49, THE SCRAP MILL at 33,17 drawn 51 x 49; with the pieces switched off 0 drawn; 0 errors.
- on its side 844 x 390: the same three, 51 points wide each, 0 errors.
- (the crew stopped one block short of where it was sent on each; the piece is whole on each shot.)
Gate THE PLACES WEAR THEIR OWN PIECE 8/0 with all thirteen places (no place heavier than 30,000 bytes for its two
frames).

## REFERENCE CHECK (compared to the world before calling it done)
A 1950s steam generating station (a tall steel-clad boiler house, one concrete stack, a lower turbine hall, later gas
turbine packages in a row with short stacks, a switchyard of lattice gantries and transformers); a municipal animal
shelter (a low office block, rows of roofed outdoor kennel runs with chain-link gates, an animal control truck with
compartment doors down its side); a scrap yard (a corrugated fence, end-of-life cars pressed and stacked, a baling press
with bales in rows, a lattice-boom crane with a lifting magnet, copper in coils, pole transformers, white goods). The
twins: this lane's ten earlier places (the same frame, rig and draw), and the kit's battery, warehouse and industrial
blocks beside them on the map (the card shows each before and now).

[analog horror: a power station burning tires to print the only money, its control room calling the load to nobody; a
bell that rings for intake at an empty door; the city's own wiring baled by a machine run off a truck]
[bb Battle Brothers' map: a place worth the walk is told from a village at a glance: one stack smoking black, a yard of
loose dogs, a wall of flat cars]

## THE TOOLS
tools/bohemia_cook5_the_east_sides_three_wear_their_own_piece_11_18_26.py   scenes | render | finish | sheet <shots>
  (three scenes and three beats ON the places tool, the downtown tool and the Strip tool)
tools/bohemia_the_place_pieces_on_the_page_11_17_26.js <outdir> [phone_portrait|phone_landscape] [id,id]

## NOT DONE, SAID PLAINLY
1. A piece is 51 points wide on his phone at the map's travel zoom: from there Clark Station is its stack and its smoke,
   the shelter is a yard of small pale shapes, the mill is a wall of colours and a crane. The dogs are dogs only when he
   pinches in.
2. Arriving at any of the thirteen still opens the generic screen of its tier (the screen's lane).
3. The two home centers wear their kit art still (this lane's next build). The four places out in the region (the lab,
   Lenzie Station, Spring Mountain Ranch, Callville Bay) are not drawn by this module at all: it draws the valley's places.
   Whether the region has a seam for a place's own picture is not measured yet.
4. Last build's record and handoff said eight places were left and did not name the scrap mill: nine were (five in the
   valley, four in the region). Corrected here.

VOTE: cook5-the-east-sides-three-11-18 (MADE FROM arena2-the-pit-is-a-pit-11-7).
