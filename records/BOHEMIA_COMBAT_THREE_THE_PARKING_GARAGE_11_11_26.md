# THE PARKING GARAGE (COMBAT THREE, 11/11/26)

VAMILY rule 440(a), rule 416's list (the third big interior), rules 441 and 443(h), ask row 539. Paolo 11/9: "More everything pls."
The coordinator: "THE FLOOD TUNNELS and THE PARKING GARAGE as fight boards, house-sized tiles, each tile with its cost and effect,
every building on a road, AUTO scrambles off the open floor; the casino floor is the golden piece to match."
BUILD 11/11u - THE PARKING GARAGE. BUILT, NOT YET SEEN. VOTE combat3-the-parking-garage-11-11 (stand_in).

## THE REAL THING
A Strip casino's parking structure is one of the biggest buildings in the valley and the only deep shade in it. The parking industry's
own numbers: an 18.3 m module (5.5 m stalls either side of a 7.3 m two-way aisle), stalls 2.7 m wide, columns on the stall lines, split
levels half a storey apart joined by short ramps, the sides open above a 1.07 m wall, a stair core, a booth and gate arms at the way
in. A house-sized tile (12 m) is two rows of stalls nose to nose, or one two-way aisle. When the dollar died the cars stayed parked.

## BEFORE (main a87a1a3f, BUILD 11/11c; the kit landed on main at 39d02b8c, BUILD 11/11p)
No garage existed. A fight at a casino was always the casino floor; at the mall, the convention centre, the stadium, the Sphere, the
Strat, the hospital and the airport's terminal it was a street board.

## AFTER
- WHERE: a third of the fights at a casino, the high roller, the Luxor and the resort start in the garage (the rest are still the
  casino floor: measured 36 of 36); four in ten at the mall, the convention centre, the stadium, the Sphere, the Strat, the hospital
  and the airport's terminal. By the cell's own dice, so the same spot is always the same board. opts.inside 'garage' asks for it
  anywhere; false never. The airport and downtown keep their own place boards (rule 428(a)).
- THE BOARD (slices/bohemia_parking_garage.js; slices/fight_ground/garage/garage.json, a layout is 15 strings of 20 characters): one
  deck of the structure, 20 by 15 house tiles, a split level, laid the way COOK FIVE's kit says a garage lays (garage_art.json
  how_it_lays). Two layouts, each mirrored east to west by the dice (the ramps swap).
  - THE LOW BAY: rows of DEAD CARS IN THEIR STALLS (cover, two groups a tile, and the same cars in the stalls beside them drawn but
    never counted, so a row of parked cars reads as a row and a tile of cars is never more cover than the fight's cap) either side of
    the two-way DRIVE AISLES (the open floor), columns nobody walks through, wrecks left across an aisle (the street board's own wreck,
    patrol car and rolled car, reused), drum fires, the pay booths at the way out to the street.
  - THE HIGH BAY: a raised bay under the north wall, half a storey (1.42 m) up: HIGH GROUND, a gallery over the low bay, its own
    cars and wrecks, the guard rail on its open edges.
  - THE RAMPS: in the bay's own aisle, climbing east or west (two on the split deck, one on the long gallery). A ramp is the WALK up:
    a man who walks up it still strikes that turn. Over the rail anywhere else is the fight's own CLIMB (rule 328): one more AP, no
    attack that turn, and a beast cannot.
  - THE STAIRS AND THE LIFT on the north wall; the outer wall all round.
- THE DARK: under the decks above it is night by day and by night. By day the light comes in the open sides (the north and south
  edge rows) and at the way in; the middle of the deck is dark; the drum fires burn day and night. At night only the fires.
- THEY HOLD THE GALLERY: a garage is somebody's ground. The band's shooters and back line, and men enough to make a third of the band
  (never more than half), start up on the high bay on the cover nearest the rail; his line starts on the low bay as always. MEASURED
  BEFORE (both lines below): in 12 AUTO fights nobody of either side stood on the high bay in the first three rounds; half the board
  was never used. NOW: 44% of the band starts up, and with the bay the fight's roof AUTO's shooters go up for it: 86 men on the high bay
  after round one in 12 fights; the fights end in about 6 rounds.
- EVERY TILE HAS ITS COST AND ITS EFFECT (garage.json 'tiles', the fight's tileKey, as the tunnels'):
  | tile | ground row | AP | what it does |
  |---|---|---|---|
  | the outer wall, the stairs and the lift | obstacles | none | no way through |
  | the drive aisle | flat | 2 | OPEN FLOOR: nothing to hide behind; AUTO gets off it |
  | empty stalls | flat | 2 | plain floor |
  | dead cars in their stalls | flat | 2 | cover |
  | a wreck in the aisle | flat | 2 | cover in the open floor |
  | a column | flat | none | nobody stands on it |
  | a drum fire | flat | 2 | lit day and night: a man here is seen |
  | the pay booths | flat | 2 | cover |
  | the way in | flat | 2 | open floor, lit by day |
  | a ramp | height | 2 | the walk up: 3 AP onto it from the low aisle, then level with the bay; he still strikes |
  | the high bay (aisle, stalls) | height | 2 | high ground: a blow or a shot down lands easier, one up at it harder; a gun reaches a tile more; over its rail from below is a climb (3 AP, no attack that turn) |
  | dead cars, a wreck on the high bay | height | 2 | the same, with cover |
- AUTO SCRAMBLES OFF THE OPEN FLOOR: the drive aisle is open floor. MEASURED (the gate's 12 fights): after round one 15 of 251 men
  (6%) stand on the bare aisle; with the rule off 63 of 248 (25%); on cover 155 against 117.
- EVERY BUILDING ON A ROAD, indoors: every stall, both bays and the way in are joined (24 of 24 decks, every open tile reached, every
  man with a walk to the other side); the high bay is walked onto by the ramps and by nothing else (24 of 24; with the ramps shut, none).

## THE ART: COOK FIVE'S FINISHED KIT, AND COMBAT'S PARKED CARS
While this board was being built COOK FIVE shipped THE PARKING GARAGE'S KIT (BUILD 11/11p, slices/fight_ground/garage/garage_art.json):
the floor through the master rig (stalls and aisle, any tile meeting any tile), the raised bay with the stalls' or the aisle's floor on
top, the ramp east and west, the guard rail and the outer wall both ways, two columns, the stairs and the lift, the pay booths.
THE BOARD WEARS IT WHOLE: the stand-in floor, bay edge, ramp, stair tower, booth and walls COMBAT THREE had rendered for the same
jobs were never shipped (a finished piece beats a stand-in, rule 441(a); none of COOK FIVE's files was touched). What COOK FIVE's
kit leaves to the board, by its own note ("Dead cars: your own cover cars"): three groups of parked cars, COMBAT's own
(tools/bohemia_combat_three_the_parking_garage_11_11_26.py, the casino floor's recipe, stage stand_in): two dead cars nose in, one
down on a bare rim, one with its boot open; a car on blocks and a stripped shell; a car somebody lives in (a tarp, a chair, water
jugs, the next stall swept). Every parked car is the 10/20 rig's own dead sedan (wreck.glb), reused. Things standing on the raised
bay are drawn the bay's height up the glass (61 px). garage.json 'rules' holds what the fight needs of a kit piece that the art file
does not say (a column and the core let nobody stand; the rail and the wall are drawn, never cover).
FOR COOK FIVE (asked in the handoff): a north and a south ramp are not needed (the ramps lie in the bay's aisle, east and west);
the parked cars are the stand-ins left; a glass-and-oil floor tile would give the board its slow ground back (cut for want of a picture).

## ON THE PAGE HE PLAYS (rule 441(a))
tools/bohemia_combat_three_on_the_page.js: the real alpha and the real demo, opened as a stranger opens them, every fight started by the
map's own handover at a cell of a district with a garage, a finger on a tile of every kind in reach with AUTO off, then AUTO and the
speed pressed on the phone's own buttons (1x, 2x, 4x in turn), every turn logged from the page's own calls.
- THE BUILD THAT SHIPPED (COOK FIVE's kit on the board): 14 fights in the garage: the alpha upright 5, the alpha on its side 3, the
  demo upright 3, the demo on its side 3 (390 x 844 and 844 x 390). 14 of 14 ended. Both layouts dealt, seven each. 0 page errors.
- 251 turns of his: 227 walked or struck, 24 quiet (pinned in a man's reach with a gun, no shot, posted up on the bay), 23 of them
  said their word (the one without was a man struck down on his own turn). No man stood a whole fight.
- 46 of 46 tile taps said the tile's line, eight kinds (the aisle 11, dead cars 11, empty stalls 8, dead cars on the high bay 5, a
  wreck 5, the bay's stalls 4, its aisle 1, a drum fire 1). A tile of the high bay says what stands on it and then the fight's own
  high-ground line ("Dead cars: cover. Roof, 1 storey up: +10% to hit for each storey down, guns reach 1 tile farther...").
- After round one 5 of 60 men (8%) stood on the bare drive aisle.
- BEFORE THE KIT (the board in COMBAT THREE's own stand-in pieces, the same rules but a rail row and north ramps): 20 more fights on
  the same four pages, 20 ended, 285 of 292 turns acted, 35 of 35 tile taps; it is where the draw error below was caught.
- THE DRAW ERROR, AND ITS ROOT FOUND: in those 20 earlier fights, ONE, the demo on its side, threw "drawImage ... not of type" 15 times, one
  every two seconds. This time with its stack: put <- BohemiaWear.on (engine/bohemia_wear.js) <- wearOver <- blitMan / meleeDraw /
  holdDraw. It is the error of ask rows 548 and 558 and of the tunnels' one bad fight. THE ROOT: at night a man's armour is cut from a
  NIGHT sheet, and the armour's module handed that sheet to the glass's own drawImage; when the fight's glass answers to the demo
  shell's classes (EYES' row 548 measured that it can) the browser is handed a sheet it cannot draw, and everything after the bodies
  is skipped that frame. Any man in armour, any night board, the demo; the tunnels and the garage are always night. THE FIX (the
  fight's own file, wearOver): the module is handed the fight's own draw (FIXES' cxDraw of row 558), which knows a sheet by its shape
  whatever page the glass came from. PROVEN ON THE DEMO by the test's probe: on a glass of the shell's own document the browser's
  draw of a night sheet THREW the same error and the fight's draw of the same sheet drew; on the fight's own glass both drew.

## GATE
gates/the_parking_garage_gate.js (THE PARKING GARAGE, registered) 16/0, 83 s: G1 where (the data's share of the fights at its eleven
districts; never where there is no garage; the same cell the same answer; a casino fight not in the garage is on the casino floor);
G2 joined (24 of 24, both layouts, both mirrors) and its plant; G3 the ramp is the walk up, the rail is a climb (24 of 24: every tile
of the bay walked to by a ramp, none with the ramps shut; the bay the fight's roof at level 1, a ramp never a roof) and its plant (a
bay tile read as plain floor); G4 the dark (24 of 24) and its plant; G5 the pieces real (20 kinds: COOK FIVE's kit and COMBAT's cars
with their models; cover is cover, the columns let nobody stand); G6 a fight plays (24 of 24 end, 0 of 288 men of his stood a whole
fight); G7 every tile its cost and effect (15 kinds; the fight charged the table's AP on 920 tiles; 784 of 784 lines said; the open
floor 362 of 362; the low aisle onto a ramp 3 AP a walk, the ramp onto the bay 2 AP a walk, low floor over the rail 3 AP a climb)
and two plants; G8 the scramble and its plant; G9 they hold the gallery (44% of the band up at the bell, none of his; 86 men on the
high bay after round one) and its plant (the start off).
ALSO: EVERY MAN ACTS ON AUTO now plays the garage as one of its board kinds; THE INSIDES WEAR FINISHED ART (COOK FIVE's) still green.

## WEAK, SAID OUT LOUD
- The parked cars are stand-ins (COOK FIVE's next); at the far stop a car is small (a car is four tenths of a house tile, a man is
  drawn far bigger than his tile: the fight's own convention).
- Two layouts; no event of its own (the tunnels have the flood); no slow ground (the glass-and-oil tile was cut for want of a picture).
- Nobody lives in the lived-in cars yet (a WORLD / PEOPLE job); nothing is taken from a car.
- The gallery start gives the band the high ground at the bell; TUNING may want its share (garage.json gallery.share, least).
- A beast cannot go up onto the high bay at all, by the ramp either (the fight's roof rule knows no ramps for beasts).

[bb] Battle Brothers' hills give +10% to hit down and a tile of range; the high bay is that row of its table, indoors, with the ramps as the only passes.
[analog horror] one car in the whole dark deck with towels in its windows and a chair set beside it, the stall next to it swept clean.
