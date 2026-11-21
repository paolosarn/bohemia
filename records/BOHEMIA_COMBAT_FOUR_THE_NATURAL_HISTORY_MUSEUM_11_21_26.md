# COMBAT FOUR: THE NATURAL HISTORY MUSEUM (BUILD 11/21 - THE NATURAL HISTORY MUSEUM)

11/21/26. COMBAT FOUR, more boards (rule 461). The natural history museum by Cashman Field (the map's kind 'natmuseum'), whose fights
were still at its doors. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/21zg)
A fight at the natural history museum was fought on the blocks outside it.

## THE FACTS IT IS BUILT ON
- The valley's natural history museum stands downtown by Cashman Field: halls of mounted skeletons on plinths, habitat dioramas behind
  glass along the walls, display cases on the floor.
- The valley's own Ice Age is at Tule Springs, north of the city: Columbian mammoths, ground sloths, camels and American lions in the old
  spring beds; a Columbian mammoth stood about four metres at the shoulder.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/natmuseum/natmuseum.json`, the eighteenth in `slices/fight_ground/insides.json` (eight fights in ten
at the museum's cell, by the cell's own dice). No new rule code; the ceiling is the casino's 'coffer' (a stand-in).
- `the_ice_age_hall`: four Columbian mammoths on their plinths and four ground sloths reared up (blockers you see through: the fight's
  sight stops only at walls, the aquarium's tank rule), display cases (cover), benches and kiosks (low cover), skeletons pulled off their
  plinths (rough 3 AP, low cover), rope posts (rough 3 AP, no cover), the dioramas along both long walls.
- `the_dioramas`: the walls lined with habitat dioramas, four walk-round glass showcases in the middle, a ground sloth between them,
  display cases in rows, benches, kiosks.
- 13 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the mammoth and the sloth its boulder, the dioramas
  and showcases a wall you see over, the bones its brush, the rope posts its rough ground); 11 pieces, all stand-ins (the names for COOK
  in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.
- Nothing here says where the beasts came from: the museum is a museum (his law of the lab-made beasts is DYNASTY's and WORDS' to tell).

## THE GATE (gates/the_big_insides_gate.js: 284 passed, 0 failed over eighteen insides; the museum 18 of them)
24 of 24 fights to the end on AUTO, nobody of 288 stood a whole fight; 24% of men on the bare floor after round one against 45% with rule
428's leg off. MY FIRST CUT: 31%, and a stray lower-case letter in the dioramas' middle that no legend named (I7 red); fixed, then cases
and benches added in both halls.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:natmuseum, C3_INSIDE=natmuseum, through the map's own door)
The demo upright 1 fight, 3 of 3 taps; the demo on its side 1, 1 of 1; the alpha upright 1, 4 of 4; the alpha on its side 1, 3 of 3. 4
fights, all ended on AUTO, 11 of 11 tile taps, 0 page errors; the ceiling moves a pixel 4.7 to 7.4 of 255 on average. The museum's one
cell rolled THE DIORAMAS on every valley these runs opened; THE ICE AGE HALL is seen on the fight page opened alone (the card's top left)
and in the gate (13 of 24 boards).

## ALSO IN THIS SHIP: THE ROBOT FACTORY, HELD
records/BOHEMIA_COMBAT_FOUR_THE_ROBOT_FACTORY_HELD_11_21_26.md: built and gated 18/0, not listed, because the map paves the robot
factory's one cell with an arterial road (for WORLD).
