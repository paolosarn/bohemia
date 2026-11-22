# COMBAT FOUR: THE TALL THINGS HIDE A MAN (BUILD 11/22 - THE TALL THINGS HIDE A MAN)

11/22/26. COMBAT FOUR, more ground (rule 461: 'every floor tile from Battle Brothers with its cost and its effect'; rule 59). Rules 59,
416, 428, 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22c)
The fight's sight stops only at a tile of the 'obstacles' row (slices/BOHEMIA_FIGHT.html sightBlock). In the big insides, every blocking
piece but the walls and the library's stacks stood on 'flat' ground: nobody stood on it, it gave cover beside it, AND A MAN SAW STRAIGHT
THROUGH IT. The home center's racks (its data: 'twice a man's height'), the truck stop's shelving, coolers, cab and trailer, the hangar's
fuselage and tail, the TV station's set flats, equipment racks, green screen and monitor wall, the convention hall's containers, the
warehouse's trailer, the data fort's cooling units, the powerhouse's generators (two storeys of steel), the stadium's relief tents, the
mall's lift shaft: 17 kinds of tile a man could see through. Measured on the fight page (the home center, a man of his on one side of a
rack and one of theirs on the other): seen, his reach striped on the floor.

## WHAT SHIPPED (data only: no rule code)
Those 17 kinds are now the 'obstacles' row ('terrain': 'blocked') with 'sight': 'blocked' and their effect saying so ('nobody sees
through it'). Their pieces, their cover beside them and their cost (nobody stands there) are unchanged. What stays SEEN THROUGH, on
purpose: glass (the aquarium's tanks and columns, the museum's dioramas and showcases, the cell block's picket), mesh (the hospital's
pharmacy cage), bone (the mammoths and the sloth), and what is lower than a man's eye (the judges' benches, the
coffee island, a forklift, the carousels, the columns of a hall, which do not fill a house tile).
Files: slices/fight_ground/{hall,mall,warehouse,datafort,stadium,powerhouse,homecenter,truckstop,hangar,tvstation}/<id>.json, the tile
entries alone edited in place (each file's own layout kept).
[bb] Battle Brothers' forest and walls: a man behind one is out of sight until somebody walks round it.

## THE GATE (gates/the_big_insides_gate.js: 334 passed, 0 failed over twenty insides, 290 s; NEW LEG I12)
I12 THE TALL THINGS HIDE A MAN: in every inside, one tile of every blocking kind dealt is read across both ways the board lets: a kind
of the 'obstacles' row or marked sight 'blocked' must stop the fight's own sees(); any other blocker must not; a kind marked 'blocked'
on flat ground is red; PLANTED: the first tall one read as flat ground is seen through (caught in all 13 insides that lay one between two
open tiles). The scramble to cover still holds in every changed inside (I8, after round one on the bare floor): see the lines below.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:hardware, C3_INSIDE=homecenter)
The demo upright, the demo on its side, the alpha upright, the alpha on its side: 4 fights in the home center, all ended on AUTO, 15 of
15 tile taps, 0 page errors. The card: the fight page, a man of his below a rack and one of theirs above it: before, seen (his reach on
the floor); now, hidden (the fight's own sees() false, shown false).

## I8 AFTER THE CHANGE (men on the bare floor after round one)
PASS I8 HALL  44 of 249 men (18%) stand on the bare open floor
PASS I8 MALL  39 of 250 men (16%) stand on the bare open floor
PASS I8 WAREHOUSE  68 of 249 men (27%) stand on the bare open floor
PASS I8 DATAFORT  54 of 249 men (22%) stand on the bare open floor
PASS I8 TERMINAL  52 of 251 men (21%) stand on the bare open floor
PASS I8 STADIUM  16 of 249 men (6%) stand on the bare open floor
PASS I8 POWERHOUSE  62 of 250 men (25%) stand on the bare open floor
PASS I8 SPHERE  46 of 248 men (19%) stand on the bare open floor
PASS I8 HOMECENTER  66 of 250 men (26%) stand on the bare open floor
PASS I8 HOSPITAL  67 of 249 men (27%) stand on the bare open floor
PASS I8 PRISON  43 of 247 men (17%) stand on the bare open floor
PASS I8 SCHOOL  70 of 248 men (28%) stand on the bare open floor
PASS I8 COURTHOUSE  55 of 247 men (22%) stand on the bare open floor
PASS I8 JUSTICE  37 of 250 men (15%) stand on the bare open floor
PASS I8 TRUCKSTOP  38 of 248 men (15%) stand on the bare open floor
PASS I8 HANGAR  53 of 250 men (21%) stand on the bare open floor
PASS I8 AQUARIUM  61 of 248 men (25%) stand on the bare open floor
PASS I8 NATMUSEUM  59 of 251 men (24%) stand on the bare open floor
PASS I8 TVSTATION  14 of 246 men (6%) stand on the bare open floor
PASS I8 LIBRARY  32 of 250 men (13%) stand on the bare open floor
