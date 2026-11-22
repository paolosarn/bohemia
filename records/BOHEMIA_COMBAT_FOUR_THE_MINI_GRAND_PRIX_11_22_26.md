# COMBAT FOUR: THE MINI GRAND PRIX (BUILD 11/22 - THE MINI GRAND PRIX)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The Mini Grand Prix (the map's kind 'minigp': 'MINI GRAND PRIX by the freeway', engine/bohemia_overmap.js), whose fights
were all fought outside. Rules 416, 59, 428, 451(a), 441, 465, and rule 20's analog horror at the source (an arcade's attract loops
still running in the dark). Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22y)
A fight at the Mini Grand Prix was fought outside: 'minigp' is in the infrastructure family (engine/bohemia_boardkinds.js: 'AN APRON:
open paved ground, one long shed, a perimeter fence'), which has no board of its own, so the fight dealt the street blocks. The park
keeps its one cell in 40 of 40 valleys.

## THE FACTS IT IS BUILT ON
- The map's own words above; Las Vegas has had a Mini Gran Prix since 1989 (go-karts, a coaster, an arcade).
- A family fun park is its arcade hall (rows of cabinets, skee-ball lanes, air hockey, token changers, the prize counter with its prize
  wall behind, the party room's tables) and its kart garage (the karts parked in rows, tyre walls, the mechanics' bench, the parts
  shelves, fuel cans, an oil slick by the pit).

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/minigp/minigp.json`, the thirty-eighth in `slices/fight_ground/insides.json` (half the fights at
the park's cell, share 0.5: the rest on the track). No new rule code; the ceiling is the warehouse's roof ('joist', a stand-in, at 10%).
- `the_arcade`: rows of arcade cabinets back to back, a few still glowing with an attract loop nobody plays (they hide a man), the
  prize wall in the top corners (it hides a man), the skee-ball lanes by the doors (nobody walks over them, a man is seen across), air
  hockey tables tipped over, the party room's tables, token changers and the ticket kiosks (cover), stools (low cover), the monsoon's
  water standing on the carpet by the walls (Battle Brothers' swamp: 4 AP, a man in it fights worse); doors on both sides and the
  bottom, two fires.
- `the_kart_garage`: go-karts parked nose to tail in rows (low cover), tyre walls and fuel cans (low cover), the mechanics' benches
  (cover), the parts shelves in the corners (they hide a man), an oil slick by the pit (swamp); doors on both sides and the bottom, two
  fires.
- 19 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the cabinets, the prize wall and the shelves its
  wall, the skee-ball lanes its palisade you see through, the tyre walls its palisade waist high, the water and the oil its swamp); 15
  pieces with the walls, all stand-ins painting at least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND: the
  coaster is outside. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js, now three suite entries: 667 passed, 0 failed over thirty-eight insides (230 in 202 s, 229 in 210 s, 208 in 177 s); the park 21 of them alone, in 53 s)
19 of 40 fights at the park's cell go inside (the share 0.5); 24 of 24 fights to the end on AUTO (6.4 rounds), nobody of 288 stood a
whole fight; 9% of men on the bare floor after round one against 24% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 STANDING WATER IS SWAMP: a man of his on the oil slick is struck at 20% where the same tile dry reads 10%; I12 the
cabinets hide a man; I13: 12 stand-in pieces, each painting at least 9% of a tile.
MY FIRST CUT, MEASURED AND CHANGED: 21% bare after round one (the arcade 24 to 37%): the water and the oil were laid in the middle lanes and
men ended their walk on them (swamp is open ground), and the arcade's middle aisle was open. The water and the oil went to the walls,
tables, stools, token machines and kiosks into the aisle, benches and tyre walls into the garage's lanes: 9%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:minigp, C3_INSIDE=minigp, through the map's own door)
One cell a valley, one fight a run, and the cell's own dice send one fight in two outside; two valleys met all four ways: the demo
upright (THE ARCADE) 4 of 4 taps (the floor, a token machine, stools, party tables); the demo on its side (THE KART GARAGE) 5 of 5
(fuel cans, the floor, go-karts, a workbench); the alpha upright (the kart garage) 6 of 6 (a tyre wall, a workbench, the floor, a fire);
the alpha on its side (the arcade) 2 of 2. 4 fights inside, both rooms, all ended on AUTO, 17 of 17 tile taps, 0 page errors. Run two at
a time.

## SAID PLAINLY
VOTE card combat4-the-mini-grand-prix-11-22 (stand_in): the arcade and the kart garage from the fight's camera, and a real fight in the
arcade. The pictures are stand-ins (a casino's screens for the cabinet rows, its seats for the skee-ball lanes, a car wreck for a
go-kart) until COOK draws them; the ground's rules are real. The attract loop still running in the dark is in the words (draft); its
sound is SOUNDS'.
