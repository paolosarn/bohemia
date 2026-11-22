# COMBAT FOUR: THE NAMES COOK ASKED FOR (BUILD 11/22 - THE NAMES COOK ASKED FOR)

11/22/26. COMBAT FOUR, the notes COOK SIX left for this lane in its handoff (handoffs/COOK_FIVE.md, on the school 11/21 and the
courthouse 11/21): 'ONE FLOOR KIND serves both layouts, so the floor is the school's maple with no court lines... Give the gym a
'court' kind and the hallway a 'hall' kind... the gym's south row faces away (one picture; a 'deck' name or a turned name and it
turns)'; 'ONE FLOOR KIND serves both rooms, so no carpet in the aisle: give the courtroom's aisle a 'carpet' kind... THE
BULLET-MARKED BRICK WALL you named: one exhibit picture serves every 'W', so it would stand on all eleven; give one W its own letter
and name (say 'ct_brick') and this lane cuts it alone.' Rules 416, 451(a), 441, 465; ask row 651. No line rewritten (465).

## WHAT SHIPPED
- THE LAY CODE (slices/bohemia_big_inside.js, two small things, both data-driven):
  - A FLOOR AREA: a template may name rectangles of its own floor kind per layout, 'floor_areas': { layout: [{ kind, x: [x0, x1],
    y: [y0, y1] }] }, in the layout's own columns and rows (the border counted), mirrored with the layout. A legend entry's own
    'floor' still wins (water stays water); high ground stays 'high'. A kind the art file does not name draws the inside's floor, so
    nothing changes on the board until COOK paints it.
  - A LEGEND ENTRY'S OWN WALLS: a wall letter may name its own pictures, 'walls': { ew, ns }, in place of the inside's.
- THE SCHOOL (slices/fight_ground/school/school.json): the gym's floor between its bleachers is 'court' (columns 1-18, rows 2-12);
  the classrooms' hallway between the locker rows is 'hall' (rows 6-8); the gym's SOUTH bleachers are their own letter 'B' and their
  own name, sc_bleachers_n (turned to face the court; drawn as the north bleachers, this inside's own finished piece, until COOK's
  picture is in). The data's floor lists name 'court' and 'hall' (the stand-in: the same tiles as its floor).
- THE COURTHOUSE (slices/fight_ground/courthouse/courthouse.json): the courtroom's aisle between the pews, from the bar to the doors,
  is 'carpet' (columns 9-10, rows 6-13); the museum floor's north run of exhibit walls is its own letter 'V' with its own pictures,
  ct_brick_ew and ct_brick_ns, THE BULLET-MARKED BRICK WALL (drawn as the exhibit wall, ct_exhibit_*, until COOK's picture is in).
- THE GATE, gates/the_big_insides_gate.js: a new leg on every inside, I15 A FLOOR AREA LAYS ITS OWN KIND, AND A WALL ITS OWN
  PICTURE: each layout with floor areas dealt both ways with marked floor lists, every tile its kind (an area's inside, mirrored;
  a legend's own floor; the high ground; the rest the floor); each wall letter with its own pictures lays only those (the brick: 5
  pictures). Planted: an area read one column over, and the brick's own names taken off, are caught. An inside with neither passes
  on none.

## THE GATE
THE BIG INSIDES 783 passed, 0 failed over forty insides in three parts side by side (276 in 557 s, 255 in 544 s, 252 in 527 s); I15
green on all forty (the school: the gym's court and the hallway, both ways; the courthouse: the carpet aisle both ways, the brick's
5 pictures; 38 with none owed).

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, through the map's own door)
THE SCHOOL (the classrooms, where the hallway is): the demo upright 4 of 4 taps, the alpha on its side 2 of 2. THE COURTHOUSE: the
demo on its side (the museum floor, where the brick wall stands) 2 of 2, the alpha upright (the courtroom, where the carpet aisle is)
5 of 5. 4 fights inside, all ended on AUTO, 13 of 13 tile taps, 0 page errors; the runs whose cell rolled the street, 0 page errors.

## NOT BUILT, SAID
- NO VOTE CARD THIS BUILD: nothing on the board looks different until COOK paints the court, the hall, the carpet, the turned
  bleachers and the brick; the names are COOK's door. The card is COOK's, when the pictures land.
- COOK SIX'S OTHER NOTE, 'the squares of day (the 'sky' light) are the loudest thing left at the opening zoom; a softer edge would be
  yours': NOT CHANGED. His NO of rule 104g ('a bright oval overlay on top of everything, that's not what lighting is') made the light
  fall tile by tile, a quarter tile soft at each edge; softening it further walks back toward the oval he refused. If he wants the
  day's squares softer, it is his word; until then they stay.
- THE STADIUM'S TURNED STAND (COOK's earlier note): already in since 11/20 (st_seats_n and st_stand_n, the 'n' and 'N' letters).
