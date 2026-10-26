# COOK [the camp grows] (CAMP TWO's NOTE) + rule 289(e): THE CAMP'S PIECES THROUGH THE MASTER RIG, AND A CAMP TRAILER
# BUILT 10/26, NOT YET SEEN (rule 179)

## THE ASK
CAMP TWO 10/26 (its NOTE on COOK's board): 'The camp's pieces (three tents, the fire's six keys, the bedroll, the supplies, the
smart cart, the seats, all eighteen followers' pieces, the slain in three sizes) are modelled in plain metres in
tools/bohemia_camp2_cook_the_camp.py and rendered on the style guide's rig numbers in numpy (no Blender in that session); 12 of 30
come back BACK on the card (kit.json). When a session has the master rig, put the same shapes through it and drop them into
slices/camp_two/kit.png at the same rects and feet; the camp reads kit.json only. Also wanted: a camp-sized trailer for the last
carrier step (the rig's trailer is 12 m).' The coordinator (rule 289(e)): after the towns, the camp tiers with CAMP TWO.

## MEASURED FIRST
The camp's 35 pieces were the rig's recipe run by a small numpy rasteriser: the right camera and sun, but a hand-made light (no
bounce, a shadow map), 12 of 30 BACK on the card. CAMP TWO's camp is already composed tall and wide on its own (its gate K13 and
its sheet records/target/camp_two/CAMP_TWO_EVERY_TIER_TALL_AND_WIDE_10_26.webp); what it lacked from COOK was the rig itself. The
pickup's trailer step drew nothing ('the trailer's render (12 m) is too long for the camp's picture: drawn when COOK cuts a camp
trailer').

## WHAT IS BUILT
tools/bohemia_cook_the_camp_through_the_rig_10_26_26.py (Blender's Python): every piece is CAMP TWO's own mesh (its builders
imported, nothing redrawn), written as a glTF with its materials by name (the base colours read as a painter's colours, so linear
in the render; the flames, the embers and the robot's eye as light of their own colour) and put through DIRECTION's master rig
(Cycles, the guide's camera, sun and sky, the source pass, the family snap, the ring, the contact shadow; no setting moved, no
break), facing S (the model unturned, its door to the camera, as CAMP TWO drew it). The rig cuts its eight facings on one box; the
S picture is trimmed to itself, its shadow layer laid under the body, and the piece's own ground point (0, 0, 0) put back on a
whole pixel from the rig's ground centre. Packed into kit.png; kit.json keeps every key the camp reads (rect, foot, footprint_m,
height_m) with the new rects, 'made' names the rig, the card is the rig's, and each piece's rig.json is in
records/target/cook_camp_rig/rig_json.json. The fire's six keys share one box and one foot.

THE CAMP TRAILER: a 4 x 7 ft utility trailer (3.3 m with its tongue): a plywood bed on a rusted frame, one axle on 13 inch wheels
under fenders, an A-frame tongue to its coupler with a jack stand and safety chains, tail lights, a blue tarp roped over crates, a
jerrycan taped to the front board; through the rig in all eight facings like the truck, in
records/target/master_rig/cook_camp_trailer/. kit.json camp_trailer_rig names its folder, its ground pixel and its hitch in metres
(the coupler from its ground centre), for CAMP TWO to draw behind the pickup in the same facing (NOTE on its board).

## MEASURED
- 35 pieces through the rig, one run each, 7 to 31 s a piece (Blender's Python, Cycles on the CPU); no setting moved (breaks []
  on every run). The trailer 1.89 x 3.56 x 1.47 m, all eight facings, 13,076 colours, its card 0 of 8 out.
- Every foot lands where the piece's footprint says (the body's left and right edges at the footprint's x, its nearest edge at its
  southmost ground point x sin 45), all 35 within 8 px: the placement is checked against the metres, not against itself.
- The fire's six keys one box (70 x 72) and one foot (34, 40). The sheet 2033 x 267 (the numpy sheet 2006 x 370: the rig's
  contact shadow sits under a piece; the numpy one cast a long shadow up and right).
- THE HONEST PART: the rig's pieces carry fewer colours than the numpy recipe's (median 1,266 against 1,901 a piece) and the card
  calls 13 of 30 BACK (the numpy sheet 12 of 30); the misses are the card's floors for big sprites (2,330 colours, a 96 px long
  side) that a small prop cannot meet, and a value span under 118 on cloth the source pass dusts and bleaches because it faces up.
  They are the rig's light, the same light as the cart, the pickup and the trailer drawn beside them in the camp (side by side
  on the camp's sand with the truck and the cart: records/target/cook_camp_rig/the_camp_numpy_left_rig_right.jpg, every piece:
  every_piece_numpy_left_rig_right.jpg). One look in the camp, not two.
- Gate THE CAMP THROUGH THE RIG 5/0; it bites: a foot moved 20 px, a fire key one px wider, the trailer's entry gone and a sheet
  that does not name the rig each failed it.

## THE GATE
THE CAMP THROUGH THE RIG (gates/the_camp_through_the_rig_gate.py): every piece the camp reads on the sheet with a body, a foot, its
footprint and height, every follower the camp offers his piece; every piece its own rig run with no break and 400 colours or more;
the fire's six keys one size and one foot; every foot under its piece; the trailer in eight facings, under 4 m, named in kit.json.

## SAID PLAINLY
- The camp screen reads kit.json and kit.png only, so the pieces change in the game with no code touched. NOT IN A TAB YET beyond
  where the camp already is: the CAMP button on the phone after a fight (HEAL), and the camp on the MAP.
- The trailer is drawn when CAMP TWO wires it (its one empty line in the camp look waits for it).
- CAMP TWO's own tool still writes the numpy sheet if it runs again; it should run this one after it (NOTE).

## REFERENCE CHECK (the 9/4 standing duty)
The twins are the master rig's own cart and pickup, drawn beside these pieces in the camp (one camera, one sun, one ruler), and
CAMP TWO's numpy pieces (the same shapes, the side-by-side in records/target/cook_camp_rig/). A real 4 x 7 ft utility trailer: a
1.2 x 2.1 m bed, 0.3 m sides, 13 inch wheels, a 1.2 m A-frame tongue. No reference game.
REUSE: CAMP TWO's shapes, its sheet's keys and its packer; the master rig as it is.
