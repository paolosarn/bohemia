# COOK SIX: THE NAMES COOK ASKED FOR, PAINTED (11/26/26)

VAMILY rule 480 (Paolo 11/26: 'Lets turn up full sweep. But improve on what we already have. And make sure fps is never choppy for
nothing'), (b) improve what is already in the game first, (c) no art costs frames; rule 461(c) as amended; rules 441, 451(a).
COMBAT FOUR's BUILD 11/22zd (THE NAMES COOK ASKED FOR, 6c9463f63) answered this lane's asks of 11/21: the school's gym a court kind,
its hallway a hall kind, its south bleachers a name; the courthouse's aisle a carpet kind, its bullet-marked brick wall a letter and
two names. Until this ship each drew what it drew before (the plain maple, the plain terrazzo, the north bleachers facing away, the
exhibit wall). This lane's own pieces in the game, finished first (480(b)). BUILD 11/26c - THE NAMES PAINTED.

## WHAT THIS IS
- THE SCHOOL (school_art.json):
  - floor.court (row 3 of the sheet's five): the gym's maple under its seal, and the lines of the games played on it at the same
    place on every court tile, so each runs on across the court (any tile meets any tile): a white line east to west through a tile's
    middle, a red one 2.2 m from its north edge, a white one north to south 3 m from its west edge. No circle and no key: one would
    scatter as pieces over a court eighteen tiles wide (the powerhouse's sunbursts were that mistake).
  - floor.hall (row 4): the classroom wing's hallway, vinyl squares of 30 cm in two tones (forty to a tile, so a tile's edge is a joint),
    its path worn down the middle east to west.
  - floor.floor and floor.ring: rows 0 to 2, the maple as it was.
  - sc_bleachers_n (COMBAT FOUR's 'B'): THE SOUTH BLEACHERS: the same eight rows on the same footprint, stepping up to the SOUTH and
    facing north to the court, so the map's eye, south of everything, sees what is behind a bleacher: the back row tall, its rail and
    posts, the steel under every row and a brace, blankets on the seats, a bag hung from the back rail.
- THE COURTHOUSE (courthouse_art.json):
  - floor.carpet (row 4): the courtroom's aisle, a deep red laid edge to edge, worn to the backing down its middle north to south,
    darker where it stayed damp. floor.floor and floor.ring: rows 0 to 3, the terrazzo as it was.
  - ct_brick_ew, ct_brick_ns (COMBAT FOUR's 'V', the museum floor's north run of three): THE BULLET-MARKED BRICK WALL: common brick in
    courses on a steel base, its bricks not one colour, the pocks of the bullets in a band at a man's chest chipped pale round each, a
    rope on brass posts in front of it (one post down), its placard.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (new close-in spots: the gym's south bleachers and court, the courtroom's aisle, the
museum floor's brick): the_gym 154 pieces, the_classrooms 221, the_courtroom 150, the_museum_floor 134; 0 stand-ins, the ceilings' pictures
drawn, 0 page errors, upright and on its side, every picture of the school's and the courthouse's there (the page asks for 27 art files
of COMBAT FOUR's newer insides that do not exist yet: those 404s are theirs, the next jobs below). The card shows each before and now.
Gate THE INSIDES WEAR FINISHED ART 112/0 (the south bleachers and the brick wall held to a tile's width). COMBAT FOUR's gates: THE BIG
INSIDES 783/0 (its I15: the marked floor lists, both ways, and the own walls), AN INSIDE SHOWS ITS CEILING 6/0.

## RULE 480(c): DO THESE PICTURES COST FRAMES (measured, not guessed)
tools/bohemia_cook6_the_insides_hold_their_frames_11_26_26.js times every frame of a fight inside on the real fight page, 390 x 844, the
CPU slowed four times (480(d)'s phone), from the page's first frame through LOAD, the first three seconds (OPEN), a camera swept close in
across the board and back out (PAN) and six seconds on AUTO, and names every frame past 50 ms:
- the stadium: PAN 4.9 frames a second (45 frames past 50 ms, the worst 333); the school 5.4; a plain street board 19.7 (17.7 by day).
- WHERE IT GOES (the ground drawn once, timed in the page, the same slowed phone): by day the stadium's whole ground, its 185 pieces and
  its floor, draws in 5.8 ms far out and 1.7 ms close in. AT NIGHT the same ground takes 150 to 270 ms: the night's colour laid over
  the whole screen and the lamps lifted back through a mask (nightPools: 175 ms with no piece drawn) and each piece darkened as it is
  drawn (nightDraw: about 100 ms more for the 185 pieces far out). The big insides open at night (asked for day, the stadium still
  opened at night), and while the camera moves the ground is drawn straight on the glass every frame, so every move pays it.
- THE PICTURES' SIZES ARE NOT IT: the stadium's floor drawn from a canvas copy at full size, half and a quarter: 177 to 250 ms, the same
  as the picture itself (183). A floor tile is drawn at most 1.07 of its own pixels close in, so its size is what the phone draws there.
- So the frames are the fight page's night path, not this lane's art, and not this lane's code to change (COMBAT FOUR's page, FIXES'
  night): said in the handoff for PLUMBER 8 (480(d)'s walk) and COMBAT FOUR, with the tool and the numbers. Nothing in this ship adds
  a draw: two floor kinds are rows of the same sheet, two pieces are new names on the same canvas sizes.

## NOT DONE, SAID PLAINLY
1. The brick wall is a tile long: COMBAT FOUR's run of three is three tiles of brick, its pocks in the middle of each.
2. His other 'Wip's on COOK FIVE's cards (the airport terminal; the data fort and the mall) and the 27 insides COMBAT FOUR added since
   11/21 with every piece a stand-in are this lane's next jobs, in the handoff, in the order he meets them.

[analog horror: a wall carried halfway across the country because of the men who were shot against it, roped off in a building nobody
visits]
[bb Battle Brothers reads its ground at a glance: a court is a court, an aisle is an aisle]
