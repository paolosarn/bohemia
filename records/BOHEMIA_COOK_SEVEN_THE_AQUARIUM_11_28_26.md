# COOK SEVEN: THE AQUARIUM, FINISHED, ITS REEF HALLS, ITS SHARK TUNNEL AND ITS BLACK CEILING; AND WHAT ITS FLOOR COST IN FRAMES (11/28/26)

COMBAT FOUR's aquarium asked 'FOR COOK (SIX)'; VAMILY rule 480(b) (the eighth of the 27 stand-in insides, the first of 'the others' in the
trigger's order); rule 480(c) (measured hard below: the first cut cost frames, found and cut); rule 482; rule 495 (built on the inside kit, and
the kit's one hard-coded date made a setting); rules 461, 441, 416, 451(a). BUILD 11/28g - THE AQUARIUM.

## WHAT THIS IS
COMBAT FOUR's aquarium: its reef halls or its shark tunnel. Every one of its 9 pieces was a stand-in (the casino's glass, seats and screens, the
garage's booth and rail, the street board's rubble and barrier) on the mall's floor, and its ceiling was drawn by the page. They are in the folder
now under its names, and the aquarium lays them with no code changed:
- THE FLOOR (aquarium_floor_0.webp, floor.floor and floor.ring, both rooms): THE HALLS' DARK CARPET (the library's carpet tile, lb_carpet), A WAVE
  WOVEN INTO IT the same in every tile so it runs on from tile to tile, and the pale tide lines where the tanks wept into it, inside each tile.
  Laid from twenty of the sheet's cells, the mall floor's count (below).
- THE PIECES (aquarium_art.json's kit, COMBAT FOUR's 9 names): A TANK (aq_tank: a house wide and 2.2 m tall, ITS WATER GONE GREEN AND STILL, a
  scum on it, THE DEAD FISH FLOATING, rock breaking the surface, its acrylic front streaked with algae in steel frames, its overflow; its top
  ends on its house's north line, so a block of Q is a bank of tanks each with its glass front). A JELLYFISH COLUMN (aq_column: floor to ceiling
  and two smaller, cloudy and empty, their black plinths and dead ring lights, what is left in them). FAKE ROCKWORK (aq_rockwork: three mounds
  of fake stone, painted coral gone grey on them, one broken open to its rebar and mesh). A FALLEN PANEL (aq_panel: a tank's acrylic panel
  leaning where it fell, one flat and scratched, one braced on its edge). VIEWING BENCHES (aq_benches: black vinyl, one on its back, a stroller
  left). A DEAD KIOSK (aq_kiosk: two kiosks with black screens, a map board, the donation box emptied, the queue's posts and belts knocked down,
  the brochures). THE GLASS TUNNEL (aq_tunnel: a tile long so UUU is one tunnel through the tank's column: the dead walkway's belt between its
  low rails, the acrylic arch's ribs over it, and the tank's green water on both sides with rock breaking through and the dead fish on it). THE
  BUILDING'S WALL (aq_wall_ew, _ns: painted black, a teal band at eye height, a dead exit sign).
- THE CEILING (aquarium_ceiling.webp, rule 451(a), 'deck'): the halls' black ceiling, its ribs, the girders, joists every 2 m, a galvanized
  round duct down every bay, a track of four dead spotlights in every bay, one hanging by its wire. aquarium.json's ceiling entry: "have":
  true, "tile": [10, 10] (the one agreed edit in COMBAT FOUR's file).

## WHAT IT COST IN FRAMES, AND WHAT WAS CUT (rule 480(c); the frame tool, the real fight page, 390 x 844, the CPU slowed four times; every
## line a separate run, the art file moved aside for the stand-ins)
                                               LOAD fps                  OPEN fps                       PAN fps               AUTO fps
  stand-ins                                    25.9, 27.7, 28.1          11.2, 11.3, 11.8               3.3, 3.9, 3.7         39.6, 41.9
  first cut (25 floor cells, tall tank)        25.1, 23.1, 25.6, 27.5    9.2, 5.3, 10.3, 10.6           3.4, 2.8, 3.3, 3.6    35.9, 38.5
  tank and tunnel pictures trimmed             26.6, 27.6                8.4, 9.1                       3.1, 3.4              36.5, 33.7
  the same, the page's roof in place of ours   27.3, 28.1                9.5, 9.5                       3.4, 3.4              36.1, 38.3
  the same pieces on the mall's floor          29.1, 28.8                10.6, 11.9                     4.0, 3.3              39.3, 37.5
  SHIPPED: 20 floor cells                      27.7, 25.8, 27.0, 28.2    10.7, 10.0, 10.0, 11.2         3.5, 3.6, 3.0, 3.5    38.7, 44.8, 33, 38
The first cut opened about 2 fps slower than its stand-ins (9.0 against 11.4 on average). Not the pictures' size (the tank's picture cut from
about 650 to 371 px tall and the tunnel's trimmed changed nothing) and not the roof; THE FLOOR: the same pieces on the mall's floor ran at the
stand-ins' speed. Laid from twenty of its cells as the mall's floor is, it opens at 10.5 against 11.4 on average, loads level (27.2 against
27.2), pans 3.4 against 3.6: within about a frame a second, said plainly. The cause is not settled: the boneyard (25 cells, a different ground)
showed no difference between 25 and 20 in two paired runs. Every run opened AT NIGHT (the page's night path, PAN about 3 fps).
*** FOR PLUMBER 9 (rule 480(c), (d)): a floor sheet's cost on the night board is not its bytes (the mall's 270 KB sheet runs faster than the
aquarium's 91 KB one) and not always its cell count; the table above, measured; nothing of yours edited here.

## THE KIT, RULE 495
The inside kit wrote every sheet as COOK7_<NAME>_11_27.webp, a date set in code: a kit now names its own date (K['date'], '11_27' unless it
says), and the art file's version follows it. The four 11/27 kits are unchanged by it.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'aquarium', spots for both rooms):
- BEFORE (main): the_reef_halls upright: THE AQUARIUM, 160 pieces, 160 of them stand-ins, the ceiling drawn by the page ('deck'), 0 page errors;
  the_shark_tunnel 149, 149 stand-ins.
- NOW: the_reef_halls 160 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors, upright and on its side; the_shark_tunnel 149, 0
  stand-ins, both ways, 0 page errors. No aquarium file lost.
Gate THE INSIDES WEAR FINISHED ART 168/0 with twenty-four kits (A3 worst 2.8 against 6.5; A4 the tank and the tunnel a tile long; A5 398,648
bytes of 900,000; C3 128 steps, 20% lines). THE BIG INSIDES aquarium 23/0, with the art and without it.

## REFERENCE CHECK (compared to the world before calling it done)
The Strip's resort aquarium on the south Strip: a walk through dark halls between tanks, its biggest over a million gallons with an acrylic
tunnel and a moving walkway through it, themed rockwork round the tanks, jellyfish in floor-to-ceiling cylinders, patterned dark carpet, a
black open ceiling with ducts and track lights; and what a tank becomes without power (the pumps stop, the water goes green, what lived in it
dies, the acrylic holds). The twins: this lane's library (the carpet) and fire station (the roof's structure) kits.

[analog horror: the dead fish still floating on the green water of tanks nobody has drained; the walkway through the shark tank stopped
mid-step]
[bb Battle Brothers' fence you see over: a tank stops a shot and nobody crosses it, but every man sees through the glass]

## THE TOOLS
tools/bohemia_cook7_the_aquarium_finished_11_28_26.py   render aq_floor | aq_halls | aq_tunnel | ceil_aquarium; cut; sheet (ON the neon
boneyard tool, through the inside kit).

## NOT DONE, SAID PLAINLY
1. The touch pool ('S') and the leak ('W') tiles wear the carpet: the data gives them no floor kind; a floor area of kind 'pool' or 'water'
   is COMBAT FIVE's to name, then a sheet is this lane's.
2. The tunnel's acrylic is drawn as its ribs and seams, not as a glass skin (a skin would hide a man walking in it).
3. The opening's last frame a second (above) is handed to PLUMBER 9 with the numbers.

VOTE: cook7-the-aquarium-11-28 (MADE FROM arena2-the-pit-is-a-pit-11-7).
