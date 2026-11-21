# COMBAT FOUR: THE JUSTICE CENTER (BUILD 11/21 - THE JUSTICE CENTER)

11/21/26. COMBAT FOUR, more boards (rule 461). The map's second courthouse: the county's justice center downtown (the map's kind
'courthouse', two cells wide), whose fights were still outside. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/21y)
A fight at the justice center ('courthouse') was fought on the downtown blocks outside (the demo's first cell this round: ruin and strip
blocks).

## THE FACTS IT IS BUILT ON
- The county's courts downtown are one tower of courtrooms (the Regional Justice Center): floor over floor of courtrooms off a public
  corridor, and one way in for the public, through the screening at the front doors.
- A courtroom: the gallery's benches behind the bar, the well with the counsel tables, the judge's bench, the witness stand, the jury box.
- The screening line: queue stanchions, walk-through metal detectors, x-ray belts, the deputies at their podiums.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/justice/justice.json`, the fourteenth in `slices/fight_ground/insides.json` (eight fights in ten at
the justice center's cells by the cell's own dice: the gate 32 of 40). No new rule code; the ceiling is the hospital's 'grid' (a stand-in).
- `the_courts_floor`: a public corridor down the middle (waiting benches, low cover; concrete planters, cover; courtroom chairs and tables
  piled across it, cover; two fires; the elevator lobby's doors at both ends, lit by day) and six courtrooms off it, three a side, each a
  tile row a part (the judge's bench, a blocker, with the witness stand and the jury box; the counsel tables; the bar with its gap; the
  gallery's benches, rough 3 AP and low cover), wood-panel walls between them, and TWO DOORS TO EVERY COURTROOM (the school's lesson:
  AUTO will not walk out of a room whose one door is behind it).
- `the_screening_lobby`: the screening line across the middle of the hall, the way the two lines meet: x-ray belts (low cover, climbed
  over at 3 AP), dead walk-through metal detectors (open ground), the deputies' podiums (cover), the queue's posts (3 AP, no cover); the
  clerks' counters on their sides (cover), waiting benches, planters, the elevator bank (a wall), the broken-out glass doors (lit by day).
- 21 tile kinds, each its cost and effect and its Battle Brothers ground ([bb]: the gallery and the x-ray belts its brush, the bar and
  the panel walls its palisade, the bench its boulder, the queue posts its rough ground); 18 pieces, all stand-ins (the names for COOK in
  the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 223 passed, 0 failed over fourteen insides; the justice center 18 of them)
24 of 24 fights to the end on AUTO (7.2 rounds), nobody of 288 stood a whole fight; 15% of men on the bare floor after round one against
33% with rule 428's leg off.
MY FIRST CUT, MEASURED AND CHANGED: 38% bare: the middle courtroom's two-wide aisle and the corridor between the doors held their men in
the open, and in the lobby both lines flanked the screening line round its two ends, in the open. The middle courtroom's aisle went to
one tile, the corridor got its benches and planters, the screening line's ends a counter each side, the front doors moved to the hall's
corners: 16%. Then the corridor's x-ray belts (a leftover of the first draft: a belt belongs in the lobby) became piled chairs: 15%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:courthouse, C3_INSIDE=justice, through the map's own door)
On the final board: the demo upright, two runs, 4 fights (the lobby and the courts floor each run), 27 of 27 taps; the demo on its side
2 fights (both), 12 of 12; the alpha on its side 2 (the lobby), 8 of 8; the alpha upright 1 (the lobby; its other cell rolled the
street, the 2 in 10), 7 of 7. 9 fights inside, all ended on AUTO, 54 of 54 tile taps, 0 page errors; the ceiling moves a pixel 3.4 to
7.1 of 255. On the first cut the alpha on its side also met the courts floor (13 of 14 taps: a finger on a corridor tile landed on the
man drawn over it, the finger's effect the cell block's record names; that tile kind is gone from the corridor).
