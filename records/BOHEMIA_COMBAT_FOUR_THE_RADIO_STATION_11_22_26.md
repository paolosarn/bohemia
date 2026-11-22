# COMBAT FOUR: THE RADIO STATION (BUILD 11/22 - THE RADIO STATION)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). THE RADIO STATION, Paolo's own place (7/6/26, engine/bohemia_overmap.js): 'the voice of the valley. No radio, no market.
Whoever holds the microphone shapes the truth.' Its fights were fought on the street outside it. Rules 416, 59, 428, 451(a), 441, 465.
Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22r)
A fight at the radio station was fought outside it: 'radio' is in the civic family (engine/bohemia_boardkinds.js), which wants 'A CIVIC
INTERIOR: a counter, a corridor spine, small rooms either side' and has no board of its own, so the fight dealt the street blocks. The
station keeps its one cell on the map in 40 of 40 valleys (the roads do not pave it).

## THE FACTS IT IS BUILT ON
- Paolo's words above, the map's own comment; one cell, east of the Strip.
- The dead's own line for the kind (engine/bohemia_dead.js): 'somebody stayed on the air'.
- A radio station is its studios (the on-air booth and the production rooms behind double glass, the engineer's console, the newsroom's
  desks, the record library's shelves, a green room) and its transmitter hall (the transmitter cabinets, the standby generators and
  their diesel, the cooling loop, the feed lines on cable trays out to the tower, the engineers' bench).

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/radio/radio.json`, the thirty-third in `slices/fight_ground/insides.json` (eight fights in ten at
the station's cell, by the cell's own dice; the rest at the tower's foot). No new rule code; the ceiling is the warehouse's roof
('joist', a stand-in, at 10%).
- `the_studios`: two on-air studios in the top corners behind their glass (seen through, never crossed), the on-air consoles (cover),
  equipment racks (they hide a man), A COT BY THE MICROPHONE in one studio (somebody stayed on the air: cover); the newsroom's desks in
  banks down the middle (cover), the record library's shelves in runs (they hide a man), crates of records (cover), the green room's
  couches (low cover), cables pulled up out of the floor (rough 3 AP, low cover); doors on both sides and the bottom, two fires.
- `the_transmitter_hall`: transmitter cabinets in pairs along both walls (they hide a man), standby generators in blocks (they hide a
  man), diesel drums (low cover), the engineers' benches (cover), crates of spare tubes (cover), desks, cable runs (rough), and the
  cooling loop's burst water standing on the floor (STANDING WATER: Battle Brothers' swamp, 4 AP, a man in it fights worse); doors on
  both sides and the bottom, two fires.
- 18 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the glass its palisade you see through, the racks,
  shelves and transmitters its wall, the generators its boulders, the cables its brush, the burst cooling water its swamp); 15 pieces
  with the walls, all stand-ins painting at least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND: the tower is
  outside. No line rewritten (465); the tiles' tap lines are new, draft. Who holds the microphone (a faction, a voice on the air) is
  FACTIONS', WORDS' and SOUNDS'; nothing of it is built here.

## THE GATE (gates/the_big_insides_gate.js: 577 passed, 0 failed over thirty-three insides, in its two halves (301 in 256 s, 276 in 252 s); the station 21 of them alone, in 48 s)
32 of 40 fights at the station's cell go inside (the share 0.8); 24 of 24 fights to the end on AUTO (6.5 rounds), nobody of 288 stood a
whole fight; 8% of men on the bare floor after round one against 24% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 STANDING WATER IS SWAMP: a man of his on the cooling water is struck at 20% where the same tile dry reads 10%; I12
the shelves and the transmitters hide a man, the studio glass is seen through; I13: 13 stand-in pieces, each painting at least 9% of a
tile.
MY FIRST CUT, MEASURED AND CHANGED: 17% bare after round one (the studios 22%): the walkway beside the record shelves and the studios'
doorways were open floor. Crates, cables, a couch went into them, and drums and cables into the transmitter hall's middle: 8%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:radio, C3_INSIDE=radio, through the map's own door)
One cell a valley, so one fight a run: the demo upright (the transmitter hall), 6 of 6 taps (crates, the floor, desks, drums, the
cooling water); the demo on its side (the transmitter hall), 7 of 7; the alpha upright (the transmitter hall), 6 of 6 (drums, a bench,
the floor, crates); the alpha on its side (THE STUDIOS), 5 of 5 (desks, the floor, cables, a couch, a fire). 4 fights inside, both
rooms, all ended on AUTO, 24 of 24 tile taps, 0 page errors. Run two at a time.

## SAID PLAINLY
VOTE card combat4-the-radio-station-11-22 (stand_in): the studios and the transmitter hall from the fight's camera, and a real fight
in the studios. The pictures are stand-ins (a casino's glass for the studio glass, its screens for the record shelves, a container for
a transmitter) until COOK draws them; the ground's rules are real.
