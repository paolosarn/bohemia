# RULE 480 ON THE STAFF AS BUILT (STAFF 2, 11/26/26) -- BUILD 11/26i THE HALL SAYS THE CART

VAMILY rule 480 (Paolo 11/26: "Lets turn up full sweep. But improve on what we already have. And make sure fps is never choppy for
nothing lets go"), this lane's part: (b) on the staff as built (rules 468, 470(a), 471): the cart reads on every board and from every
camera, staff move and run like staff, hiring and rehiring in towns works and reads, no staff bug he would feel; (c) a fight with five
staff and their carts holds its frames on a slowed phone (390 x 844, the CPU slowed 4x). Rules 461 (nothing scheduled, nothing that
waits for a tap), 441 (the page he plays, a phone both ways), 465 (no line rewritten; new words the fewest, draft).

## WHAT WAS WRONG, AND IS FIXED (BUILD 11/26i)

- HIRING DID NOT SAY THE CART. A camp person offered in a town's hall said what he does and "Stands in your fights", never that he pushes
  a cart or carries one hand only, and a rehire never said the cart his job kept. NOW one draft line, the data's (records/target/bb/
  retinue.json staff.words.cart, "Pushes {cart}. One hand only."), read off the camp book's own cartOf: "Pushes a shopping cart. One hand
  only." / a rehired cook whose wagon was kept, "Pushes a wagon. One hand only." It stands on his opened row and, where the fullest hall
  shuts the opened row (UI FOUR's tight step, both ways on the phone), at the end of his held finger's words (UI FOUR's own tip, one
  clause added, his words untouched).

## MEASURED

- THE HALL ON THE PHONE (tools/bohemia_staff_hire_reads.js, the demo and the alpha, upright and on its side, the town he starts beside,
  its hall opened as a tap opens it, a camp book where the cab driver's and the cook's carts were kept): every camp person offered
  reads his cart (3 of 3, four walks); the finger held for real on the cook (a touch held upright, the mouse resting on its side) shows
  "GRACIELA OCHOA: The crew eats for less, and a hurt man gets a hitpoint more back every hour. Pushes a wagon. One hand only."; TAKE ON
  tapped for real rehires her (200 batteries) and the book hands her the kept wagon and the box cutter. H1 to H5 green, no page error,
  all four. The picture: records/target/STAFF2_THE_HALL_SAYS_THE_CART_11_26.webp.
- THE GATE: THE STAFF PUSH A CART 13/0 (C13 the hall's line, its row, its tip, the kept wagon). Planted C2, C3, C4 still bite.
- FIVE STAFF ON A SLOWED PHONE (tools/bohemia_staff_frames_slowed.js: the demo, 390 x 844 at 3, the CPU slowed 4x, the driver's GPU
  canvas flag on, a road crew off the town on AUTO, every frame of the fight's glass timed; this box's GPU is software, so the numbers
  are the box's floor, the same for every lane):
  - his 6 men and 5 camp people with carts against 6 of theirs: 19.3 fps over the fight (median 33 ms), worst 850 ms (the bell's first
    second); the same fight on a loaded box 13.9 to 15.0.
  - the same with the carts taken off: 15.8 fps (the box loaded); the control with no camp at all: 10.7 fps. The camp does not make the
    fight choppier; the frame clock moves more with the box than with the carts.
  - WHAT THE CARTS COST, timed where they are drawn (every cart layer of every staff member wrapped): 18,172 layers in 860 frames,
    0.24 ms a frame, worst 14 ms once (the first draw, the sheet's decode). Under half a percent of a frame. Nothing to cut.
  - WHAT THE STAFF THINK, timed per AI step: a staff member's step median 4.9 to 7.8 ms (worst 14 to 84), a fighter's 14 to 18 (worst 71
    to 182), theirs 11 to 26. A camp person is the cheapest man on the board.
  - The carts stay in the man-picture cache (1,238 kept, 0 drawn plain, the last round's count).
  - The long frames are the fight's own (the bell's first seconds, a fighter's step): PLUMBER 8's rule 480(d), not the staff's.
- STAFF MOVE AND RUN LIKE STAFF (the last round's gate legs, still green): the cart costs 1 AP a tile (24 tiles reached against 49), it
  faces where he pushes and the nearest foe when he stops (171 of 171 stops), the camp stands at the back and its AUTO keeps to it.

## SEEN, NOT MINE, NAMED

- THE PURSE AT ZERO IN A FRESH TOWN, seen 3 times in about 12 opens, never on demand since: the town he starts beside opened in the first
  seconds of a new crew read 0 batteries in its bar (the phone's feed said 290) and every TAKE ON stood shut; when it happened it was the
  church town (minstrel, recruiter, surgeon in the hall). The proof now records the purse as it lands (purseAt). RUN's door or ECONOMY's.
- The top bar's last slot reads the name's score under the word FOLLOWERS (800 of renown read "FOLLOWERS 800"). Left as it is: the feed's
  followers are the name, by design as far as this lane can tell. UI's to judge.
- Upright, the camp at the board's west edge stands half off the glass and the camera cannot centre on it (COMBAT FOUR's camera, the
  note the last STAFF left); on its side the whole board fits.

## FILES

records/target/bb/retinue.json (staff.words.cart); engine/bohemia_camp.js (the __STAFF_RULES__ copy re-baked);
slices/BOHEMIA_SETTLEMENT_SCREEN.html (retinueCard's cart line, the tip's clause, the _hall test hook); slices/BOHEMIA_ALPHA_0_9.html (the
stamp); slices/BOHEMIA_DEMO.html (re-cut); gates/the_staff_push_a_cart_gate.js (C13); tools/bohemia_staff_hire_reads.js;
tools/bohemia_staff_frames_slowed.js; records/target/staff_cart/{hire_demo,hire_alpha,frames_*}.json;
records/target/STAFF2_THE_HALL_SAYS_THE_CART_11_26.webp.

[bb Battle Brothers: a hire's card says his gear before you pay; ours says the cart, and a rehire the one his job kept.]
[analog horror: the hall reads it flat, like a form: "Pushes a wagon. One hand only." Nobody asks what happened to the last one.]
