# COMBAT FOUR: THE HANGAR (BUILD 11/21 - THE HANGAR)

11/21/26. COMBAT FOUR, more boards (rule 461). The biggest room on the map still fought outside: the hangar, at the airport's field and
the air base (the map's kinds 'airport' and 'airbase', 102 cells on the valleys these runs opened). Rules 416, 59, 428, 451(a), 441, 465.
Ask row 651.

## MEASURED BEFORE (main, BUILD 11/21ze)
A fight at the airport's field or the air base was fought on the apron and scrub road blocks outside.

## THE FACTS IT IS BUILT ON
- A maintenance hangar is one open floor under a steel truss roof, its doors the whole front wall, big enough to take the aircraft
  whole with room to work round it.
- A wide-body cargo jet is about 70 m long with a wingspan about the same; a fighter about 15 m long and 10 m across.
- Round an aircraft in the hangar: tow tractors, ground power carts, boarding stairs, parts and cargo carts, spare engines on stands,
  tool cribs along the walls; at an air base, munitions trailers.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/hangar/hangar.json`, the sixteenth in `slices/fight_ground/insides.json`. About one fight in three at
the airport's field and the air base goes inside a hangar, by the cell's own dice (the gate 34 of 80): most of that ground is runways
and aprons. No new rule code; the ceiling is the warehouse's roof ('joist', a stand-in).
- `the_cargo_jet`: the jet in the middle of the floor, the fight round it: its nose, fuselage and tail a line of tiles nobody stands on
  that blocks a shot, its wings across five rows (under the wing: jacks, hoses and the gear, rough 3 AP and low cover), an engine under
  each wing (a blocker); tow tractors and power carts (cover), boarding stairs, parts carts and tool boxes (low cover), cargo dollies
  in trains (rough 3 AP, low cover), spare engines on stands (cover), the tool cribs along the walls, the doors the whole front wall.
- `the_two_fighters`: two fighters a side, each nose, fuselage and tail with its wings, munitions trailers (cover), the same ground crew.
- 18 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the fuselage and tail its wall, the nose and the
  engines its boulder, under the wing its brush); 16 pieces, all stand-ins (the names for COOK in the handoff). NO HIGH GROUND. No line
  rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 253 passed, 0 failed over sixteen insides; the hangar 18 of them)
24 of 24 fights to the end on AUTO, nobody of 288 stood a whole fight; 21% of men on the bare floor after round one against 39% with
rule 428's leg off.
MY FIRST CUT, MEASURED AND CHANGED: the wing's tiles priced low cover but had no piece, so the fight gave them no cover (I5 red: a
tile's cover is its piece's); they got one. No fire in either layout, so at night the hangar was black (I4 red); four fires. And the
share: six in ten at first, then one in three, because the airport's ground is mostly runway and apron.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:airport,airbase, C3_INSIDE=hangar, through the map's own door)
The demo upright 2 fights (the two fighters), 10 of 10 taps; the demo on its side 2 (the two fighters), 8 of 8; the alpha upright 2 (the
cargo jet and the two fighters), 7 of 7; the alpha on its side 2 (the two fighters), 10 of 10. 8 fights inside, all ended on AUTO, 35 of
35 tile taps, 0 page errors; the ceiling moves a pixel 1.9 to 2.6 of 255. 3 runs met the apron outside. These runs were at the first
share (six in ten); the board is the same at one in three.
