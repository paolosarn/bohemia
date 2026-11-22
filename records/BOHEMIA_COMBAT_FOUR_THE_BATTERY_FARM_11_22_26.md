# COMBAT FOUR: THE BATTERY FARM (BUILD 11/22 - THE BATTERY FARM)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The battery farm (the map's kind 'battery': 'Battery farm (H): solar without storage dies every night', engine/
bohemia_overmap.js, beside the solar field), whose fights were fought on the street outside it. Rules 416, 59, 428, 451(a), 441, 465.
Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22x)
A fight at the battery farm was fought outside it: 'battery' is in the plant family (engine/bohemia_boardkinds.js: 'A COMPOUND: a wall
with one gate, tanks and sheds inside it'), which has no board of its own, so the fight dealt the street blocks. The farm keeps its one
cell in 40 of 40 valleys.

## THE FACTS IT IS BUILT ON
- The map's own words above: the farm is what keeps the solar field's power through the night.
- The dead's own line for the kind (engine/bohemia_dead.js): 'crews caught working'.
- A grid battery farm is its battery hall (racks of cells in long rows, the inverters that turn their direct current into the grid's,
  the cooling units that keep them from burning) and its control house (the switchgear in lineups, the operators' desks, the
  transformer bay); a battery fire is fought with water, and the sprinklers' water stands on the floor after.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/battery/battery.json`, the thirty-seventh in `slices/fight_ground/insides.json` (seven fights in
ten at the farm's cell, by the cell's own dice; the rest in the yard of containers). No new rule code; the ceiling is the warehouse's
roof ('joist', a stand-in, at 10%).
- `the_battery_hall`: six rows of battery racks, cells to the ceiling (they hide a man), cooling units in the corners (they hide a man),
  inverter skids and control cabinets in the aisles (cover), battery modules pulled out and stacked (the crews' last job: low cover),
  coolant drums (low cover), the sprinklers' water standing (Battle Brothers' swamp: 4 AP, a man in it fights worse); doors on both
  sides and the bottom, two fires.
- `the_control_house`: switchgear lineups (they hide a man), transformers in their bays along both walls (they hide a man), the
  operators' desks and cabinets (cover), modules and drums (low cover), the sprinklers' water; doors on both sides and the bottom, two
  fires.
- 14 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the racks and the switchgear its wall, the cooling
  units and the transformers its boulders, the water its swamp); 11 pieces with the walls, all stand-ins painting at least 9% of a tile
  (I13) (the names for COOK in the handoff). NO HIGH GROUND. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 649 passed, 0 failed over thirty-seven insides, in its two halves (337 in 271 s, 312 in 295 s); the farm 21 of them alone, in 39 s)
31 of 40 fights at the farm's cell go inside (the share 0.7); 24 of 24 fights to the end on AUTO (6.3 rounds), nobody of 288 stood a
whole fight; 12% of men on the bare floor after round one against 18% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 STANDING WATER IS SWAMP: a man of his on the sprinklers' water is struck at 20% where the same tile dry reads 10%;
I12 the racks and the switchgear hide a man; I13: every stand-in piece paints at least 9% of a tile.
MY FIRST CUT, MEASURED AND CHANGED: 28% bare after round one (the control house 31% one way): the walkways between the switchgear and the
transformer bays, and the hall's middle aisle, were open floor. Modules, drums, inverters and desks went into them: 12%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:battery, C3_INSIDE=battery, through the map's own door)
One cell a valley, one fight a run: the demo upright 5 of 5 taps (coolant drums, battery modules, the floor, a desk); the demo on its
side 2 of 2; the alpha upright 4 of 4 (a desk, the floor, cabinets, modules); the alpha on its side 4 of 4. 4 fights inside, all THE
CONTROL HOUSE (one valley met all four ways), all ended on AUTO, 15 of 15 tile taps, 0 page errors. THE BATTERY HALL is seen on the
fight page opened alone (the card's top left) and in the gate (24 boards). Run two at a time.

## SAID PLAINLY
VOTE card combat4-the-battery-farm-11-22 (stand_in): the battery hall and the control house from the fight's camera, and a real fight
in the control house. The pictures are stand-ins (a casino's screens for the battery racks, a container for a cooling unit, a tunnel's
wall for a switchgear lineup, a bulldozer for a transformer) until COOK draws them; the ground's rules are real.
