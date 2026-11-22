# COMBAT FOUR: THE WATER TREATMENT PLANT (BUILD 11/22 - THE WATER TREATMENT PLANT)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The water treatment plant (the map's kind 'watertreat', two cells by two at the lake, about three a valley), whose fights were
fought on the street outside it. Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22p)
A fight at the plant was fought outside it: 'watertreat' is in the plant family (engine/bohemia_boardkinds.js: 'A COMPOUND: a wall with
one gate, tanks and sheds inside it'), which has no board of its own, so the fight dealt the street blocks. The plant keeps its cells in
40 of 40 valleys.

## THE FACTS IT IS BUILT ON
- The map's own words (engine/bohemia_overmap.js, 'WATER SYSTEM STAPLES (grounded 7/5/26)'): 'treatment at the lake (Alfred Merritt
  Smith analog), reservoir tanks on the foothills (pumped uphill, gravity down), a pumping station on the aqueduct path'.
- A water treatment plant filters the lake's water through filter beds, concrete basins of water over sand and gravel in rows, walkways
  between them and the pipe gallery under; the treated water goes out through the high-service pump hall: big pumps on plinths,
  manifolds of pipe as wide as a man, the motor control cabinets, the chemical room's tanks.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/watertreat/watertreat.json`, the thirty-first in `slices/fight_ground/insides.json` (about one fight
in three at the plant, share 0.35: the rest is the yards and the settling basins). No new rule code; the ceiling is the warehouse's
roof ('joist', a stand-in, at 10%).
- `the_filter_gallery`: twelve filter beds in four rows of three (a basin behind its railing: nobody walks into it, a man is seen across
  it, cover beside it), the walkways between with valve consoles (cover), drums (low cover) and pipe runs across the floor (rough 3 AP,
  low cover), leaks pooled on the walkways (STANDING WATER: Battle Brothers' swamp, 4 AP, a man in it fights worse), operators' desks in
  the corners (cover), the doors on both sides and the bottom, a fire.
- `the_pump_hall`: the chemical tanks in their bunds in the four corners (they hide a man), high-service pumps in pairs (they hide a man),
  manifolds and the motor control cabinets (cover), drums (low cover), leaks on the floor (swamp), the operators' desks, doors on both
  sides and the bottom, two fires.
- 14 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the leak its swamp, the filter bed its palisade you
  see through, the pump its boulder, the tank its wall, the pipes its brush); 11 pieces with the walls, all stand-ins painting at least
  9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 542 passed, 0 failed over thirty-one insides, in its two halves (283 in 223 s, 259 in 244 s); the plant 21 of them)
17 of 40 fights at the plant's cells go inside; 24 of 24 fights to the end on AUTO (6.5 rounds), nobody of 288 stood a whole fight;
14% of men on the bare floor after round one against 30% with rule 428's leg off; every board's floor joined, both layouts dealt both
ways; I11 STANDING WATER IS SWAMP: a man of his on a leak is struck at 20% where the same tile dry reads 10%; the pumps hide a man; I13:
9 stand-in pieces, each painting at least 9% of a tile.
MY FIRST CUTS, MEASURED AND CHANGED: 35 to 39% bare after round one: the walkways beside the filter beds and the floor round the pumps
were open; valves, drums, pipes and cabinets went into them: 13 to 15%. Then I1: the data's share 0.5 read 27 of the gate's 40 cells
inside (0.675, over its 0.62): the dice on those cells run hot for this kind (measured: 0.4 read 21, 0.6 read 32, 0.8 read 37); 0.35 reads
17 (0.425), inside the leg.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:watertreat, C3_INSIDE=watertreat, through the map's own door)
Ten fights inside, all of them the pump hall (the valleys met set the plant's two cells at [82,10] and [83,10], and their dice deal the
pump hall): the demo on its side 2 fights, 5 of 5 taps; the demo upright 2 (its first valley rolled both cells outside), 7 of 7; the
alpha on its side 2 (its first three valleys rolled outside, a third inside), 10 of 10 (the floor, drums, a manifold, a leak); the alpha
upright 2 and 2 again, 9 of 11 and 8 of 8. All ended on AUTO, 39 of 41 tile taps, 0 page errors. THE FILTER GALLERY is seen on the
fight page opened alone (the card's top left) and in the gate (24 boards).
THE TWO MISSES, ONCE IN 41: on the alpha upright, a tap on the fire one tile below the leak just previewed (9,12 under 9,11) opened the
man's own sheet (RAUL's card over the board, the tool's shot), so that tap and the next (the doors) chose nothing. The rerun the same
way tapped 8 of 8 and opened no sheet. FOR FIGHT SCREEN (not changed here): a single tap one tile below a previewed step opened the
current man's sheet once; the shot: records/target/COMBAT4_A_TAP_OPENED_HIS_SHEET_11_22.webp.

## SAID PLAINLY
VOTE card combat4-the-water-treatment-plant-11-22 (stand_in): the filter gallery and the pump hall from the fight's camera, and a real
fight in the plant. The pictures are stand-ins (a casino railing for a filter bed, a bulldozer for a pump) until COOK draws them; the
ground's rules are real.
