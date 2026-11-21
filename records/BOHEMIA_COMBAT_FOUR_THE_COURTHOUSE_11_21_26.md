# COMBAT FOUR: THE COURTHOUSE (BUILD 11/21 - THE COURTHOUSE)

11/21/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and effect').
The next map kind with a big room that still fought outside: the Mob Museum, the valley's 1933 courthouse. Rules 416, 59, 428, 451(a),
441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/21p)
A fight at the Mob Museum (the map's kind 'mobmuseum', downtown, the 1933 courthouse and post office) was fought on the downtown
blocks outside it.

## THE FACTS IT IS BUILT ON
- The 1933 federal courthouse and post office downtown became the Mob Museum; its restored second-floor courtroom is where the Senate's
  Kefauver Committee held a hearing on organized crime in November 1950.
- A courtroom: the gallery's pews behind the bar (the rail), the well in front of it with the counsel tables, and at the far end the
  judge's bench, the witness stand and the jury box.
- The museum floor: exhibits in cases and free-standing walls (one of them a brick wall with bullet marks, carried there from Chicago).

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/courthouse/courthouse.json`, the thirteenth in `slices/fight_ground/insides.json` (eight fights in ten
at the Mob Museum's cell, by the cell's own dice: the gate 34 of 40). No new rule code; the ceiling is the casino's coffers (a stand-in,
kind 'coffer', at 10%).
- `the_courtroom`: the gallery's pews in rows (rough 3 AP, low cover) in two banks with an aisle, the bar across the room with its gaps
  (low cover), the well (counsel tables on their sides: cover; chairs piled: low cover), the judge's bench (a blocker: nobody stands on
  it, cover beside it), the witness stand (cover), the jury box (rough 3 AP, low cover), the tall doors to the stair hall at the back
  (lit by day), two fires in waste bins.
- `the_museum_floor`: the exhibit cases (cover), exhibit stands (low cover), dead kiosks (low cover), the free-standing exhibit walls
  (a wall you see nothing through) breaking the floor into bays, doors on three sides, two fires.
- 15 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the pews its brush, the bar its palisade waist high,
  the bench its boulder); 14 pieces, all stand-ins (the names for COOK in the handoff). NO HIGH GROUND: the bench is raised a step, not
  a storey. No line rewritten (465); the tiles' tap lines are new, draft.
- NOT DONE: the map's other courthouse ('courthouse', the modern justice centre two cells wide downtown) still fights outside; a
  courtroom floor for it is a next board, its own layouts (no museum floor there).

## THE GATE (gates/the_big_insides_gate.js: 208 passed, 0 failed over thirteen insides; the courthouse 18 of them)
24 of 24 fights to the end on AUTO (6.3 rounds), nobody of 288 stood a whole fight; 22% of men on the bare floor after round one
against 42% with rule 428's leg off; every board's floor joined and every layout dealt both ways; the dark by day and by night; every
tile its row, the AP charged and its line said; the ceiling at 10%; a road cell beside it never inside (0 of 40), its own cell with a
neighbour's district inside 32 of 40. Plants caught: a wall across the floor, the pews made to block (56 tiles), the jury's row taken
out, the floor priced 3 AP, the open floor not open.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:mobmuseum, C3_INSIDE=courthouse, through the map's own door)
The demo upright 1 fight (the courtroom), 3 of 3 taps (the floor, the bar, the pews); the demo on its side 1 (the museum floor), 4 of 4
(the floor, a kiosk, a stand, a case); the alpha upright 1 (the courtroom), 2 of 2; the alpha on its side 1 (the museum floor), 4 of 4.
4 fights, 4 ended on AUTO, 13 of 13 tile taps, 0 page errors; the ceiling moves a pixel 4.7 to 8.1 of 255 on average. Both layouts seen
on both pages. (The valley has one Mob Museum: each run met it once.)
