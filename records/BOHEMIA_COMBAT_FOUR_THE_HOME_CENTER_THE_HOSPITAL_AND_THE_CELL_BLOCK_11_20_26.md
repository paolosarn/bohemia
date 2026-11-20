# COMBAT FOUR: THE HOME CENTER, THE HOSPITAL AND THE CELL BLOCK (BUILD 11/20w - THE HOME CENTER, THE HOSPITAL AND THE CELL BLOCK)

11/20/26. COMBAT FOUR's third build of the round (rule 461: keep going; rule 441(d): fewer, whole pieces, so the list's last line ships as one
build). The twelfth line of row 468's list, whole: 'THE HOME CENTER (WORLD TEN's new place), THE HOSPITAL, THE PRISON's cell blocks: smaller,
still house-tiled.' And COOK SIX's second ask of this lane (handoffs/COOK_FIVE.md 11/20): the stadium's south stand's step. Rules 416, 59, 428,
451(a), 441, 454(a). Ask rows 468, 651.

## HIS WORDS
- 11/6 (row 468): "what are some large ass interiors that we could fight... I still want this to be a block and turf war."

## MEASURED BEFORE (main 4bc4e48a0, BUILD 11/20t)
A fight at the home centre (the map's kind 'hardware'), the prison or the jail was fought outside, on the works' or the street's blocks; at the
hospital ('medical') the parking garage four in ten, the rest outside. None of the three had an inside.

## WHAT SHIPPED
THREE DATA FILES, the ninth, tenth and eleventh in `slices/fight_ground/insides.json`, laid by `slices/bohemia_big_inside.js`: no new rule code.
The only code is one ceiling painter (`ceilingSheet`, kind `grid`, the hospital's dropped ceiling).

THE HOME CENTER (`slices/fight_ground/homecenter/homecenter.json`; 'hardware', EVERY fight at its cell: the board is all of it, store, lumber and yard. Measured first at seven in ten: the alpha's valley is fixed and both its home-centre cells rolled the parking lot, so on the alpha he would never have met it; the gate 40 of 40). A big
store is about 105,000 square feet with about 24,000 more of garden centre (Home Depot's own average, its annual report): about 68 tiles inside.
`the_store_and_the_garden`: runs of racking (a rack is a tile you cannot stand on), end caps in the rows' gaps (low cover, the way through),
stock pulled into the aisles (cover), spilled racks (low cover and 3 AP), flatbed carts, the checkout lanes, the propane cage, the lumber bunks
along the back wall; the garden yard behind its fence, its gates the only ways in, under the sky (lit by day), benches of dead plants (low
cover) and stacked bags (cover). `the_long_aisles`: the racks in long rows the fight runs along, the rental counter, a run of racking fallen and
picked clean (open, 3 AP). NO HIGH GROUND: a home centre is one floor; the racks are the board. 18 tile kinds. Ceiling: the warehouse's roof
(kind 'joist'), a stand-in.

THE HOSPITAL (`slices/fight_ground/hospital/hospital.json`; 'medical', 0.7 of what the parking garage leaves: the gate 16 of 40).
`the_emergency_room`: runs of treatment bays along both walls behind their partitions (low cover), gurneys, crash carts (low cover), the
nurses' station (cover) and the pharmacy's cage (a blocker, emptied long ago) in the middle, waiting room chairs (low cover and 3 AP), floor
slick with what was spilled (open, 3 AP), the ambulance bay's doors. `the_ward`: beds in rows. NO HIGH GROUND. 13 tile kinds. Ceiling kind
'grid': the dropped ceiling's tees, tiles out with the wiring hanging, dead light panels, water stains.

THE CELL BLOCK (`slices/fight_ground/prison/prison.json`; 'prison' and 'jail', six in ten: the gate 25 and 25 of 40). A housing unit: cells
in two tiers round a dayroom. On house tiles a run of cells is a wall you cannot cross. `the_dayroom`: a tier along each long side (high
ground, mattresses hung on its rail as low cover, stairs at its ends), the dayroom between with bolted tables (low cover), mattress barricades
(cover), burned heaps (low cover, 3 AP), flooded floor (open, 3 AP), the officers' desk on its side, and the picket (the glass control room, a
blocker) in the middle. `the_two_units`: two units face to face across the sally port's bars (a wall you see through; its cut gates the only
ways), each unit's tier down its outer wall. THEY HOLD THE TIER at the bell (start 'gallery': a third of the band up). 16 tile kinds. Ceiling:
the garage's deck (kind 'deck', a concrete slab), a stand-in.

EVERY TILE ITS COST AND ITS EFFECT (rule 59), each named as its Battle Brothers ground ([bb]: flat, rough, a hill, an obstacle, cover as its
trees and walls give it). EVERY PICTURE IS A STAND-IN (14, 11 and 15 kinds of piece): the names for COOK are in the handoff. RULE 454(a): no line of
dialogue rewritten; the tiles' tap lines are new, draft, the fewest words.

## ALSO IN THIS BUILD: THE STADIUM'S SOUTH STAND'S STEP (COOK SIX's second ask)
COOK SIX turned the south stand's seats (its BUILD 11/20r, on this lane's st_seats_n) and asked for the same on the stand's own step:
'st_stand still shows its padding and dead ribbon board to the south, away from the field'. A legend entry may now name its own deck
(`slices/bohemia_big_inside.js`: q.deck before the data's high.deck); the south stand's row is letters 'N' (the aisle) and 'n' (the seats), both
on the deck `st_stand_n`, drawn as COOK's own finished north step until its picture is in. The stadium reads exactly as before today.
Gate THE BIG INSIDES' stadium 18/0.

## THE GATE (gates/the_big_insides_gate.js: 166 passed, 0 failed over eleven insides)
THE HOME CENTER 17/0: 24 of 24 fights to the end on AUTO (7.2 rounds), 23% of men bare after round one against 41% with rule 428's leg off.
THE HOSPITAL 17/0: 24 of 24 (6.2 rounds), 27% against 47%. THE CELL BLOCK 18/0: 24 of 24 (6.1 rounds), 18% against 45%, 33% of their band up on
the tier at the bell. Every board's floor joined, every tile charged its table's AP and saying its line, the dark by day and by night, the
ceiling at 10%, a road cell beside each never inside.
MY FIRST CUTS, MEASURED AND CHANGED: the home center at 62% bare (a rack tile blocks but is no cover for the floor beside it), then 45%,
then 33%: the men stood in the racks' gaps, which in a real store are end caps, so the gaps became end caps; 23%. The cell block's dayroom had
no fire, so at night nothing was lit (I4 red); two fires. The hospital 29%, a little cover added for margin: 27%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:<its kinds>, C3_INSIDE=<id>: through the map's own door)
- THE HOME CENTER: the demo upright 2 fights (both layouts), 3 of 3 taps; the demo on its side 3 fights, 2 of 2 taps (the first two ran before the driver's
  third fix and tapped nothing, below); the alpha upright 2 fights (both layouts), 14 of 14 taps; the alpha on its side 2 fights, 6 of 6 taps. 9 fights,
  9 ended on AUTO, 25 of 25 taps; the ceiling (the warehouse's roof, a stand-in) moves a pixel 1.8 to 5.0 of 255.
- THE HOSPITAL: the demo upright 1 fight (the ward), 2 of 2 taps; the demo on its side 1, 5 of 5; the alpha upright 2 (the emergency room and the
  ward), 7 of 7; the alpha on its side 1, 5 of 5. 5 fights, 5 ended, 19 of 19 taps; the ceiling 'grid' 2.9 to 5.7 of 255. The parking garage takes
  most of the medical district's cells first (its own share), so the hospital came up 5 times in 15 fights there.
- THE CELL BLOCK: the demo upright 2 fights, 5 of 5 taps; the demo on its side 2, 12 of 12; the alpha upright 2, 7 of 8 (one tap on a mattress
  barricade in the top row showed the floor's line: the finger landed on the next tile; the same cells run again, 2 fights, 3 of 3); the alpha on
  its side 2, 4 of 4. 10 fights, 10 ended, 31 of 32 taps; the ceiling 1.8 to 4.4 of 255. Only the_two_units was dealt by the map at these cells
  (the_dayroom: the gate, and the fight page opened alone, the card's top right).
24 fights in the three, all ended on AUTO, 0 page errors.
THE DRIVER, A THIRD FIX (tools/bohemia_combat_three_on_the_page.js): the home center's first sideways runs tapped nothing because the man whose
turn it was had spent his steps under AUTO before the finger came. The driver now hands the turn back to AUTO and takes the next fresh man (up to
four tries).

## SAID PLAINLY
- The three are the list's 'smaller' insides and stay on the same 20 by 15 board: the home centre's board is a little bigger than one store.
- No high ground in the home centre or the hospital: one floor each.
- Every picture a stand-in until COOK's kits are in.

## NEXT
Row 468's list is done with this build (every line built). Next on this lane: whatever EYES finds in the five insides of this round; then
more boards and more ground (rule 461's 'more boards'), every floor tile from Battle Brothers with its cost and effect.
