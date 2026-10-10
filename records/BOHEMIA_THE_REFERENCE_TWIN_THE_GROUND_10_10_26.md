# THE REFERENCE TWIN, ROUND ONE: THE ART BANK AND THE GROUND (DIRECTION 10/10/26, row [the reference twin])

Rule 82 (Paolo 10/10, his seventh votes: "all the art assets you made look like AI slop, take inspiration from the
assets we downloaded, we are extremely far off"); rule 82a (the twin for tiles, props, cars, streets and sidewalks IS
his approved pack tile: the purchased HD packs in banks/BOHEMIA_HD_TILE_REPO_part1-4.txt, his 1,927 UP verdicts in
banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt); rule 87 (DIRECTION runs the art revamp; COOK, COOK TWO, COOK THREE and
COOK FOUR bring every round here before VOTE; the order is his pain: ground, people, places, map).

## 1. THE ART BANK EXISTS: reference/art_bank/
Built by tools/bohemia_direction_art_bank.py, one folder per family, each with a README and reference/art_bank/INDEX.json:
- road (10 approved pack tiles: cracked street, cracked concrete), ground (12: ground, burnt ground, dirt path, grass),
  prop (18: abandoned cars, street props, trash and junk, barricades, road signs), settlement (10: roof tiles, house
  walls, broken walls, chain link, fences), each decoded at its own pixels from the packs, every one an UP of his.
- map_tile, settlement, character, fight_board: POINTERS to his six Pocket City 2 shots in reference/pocket_city_2/
  (their department is the zoom range: scale and density at that stop, never a style source), not copies.
- character (the runway twin), portrait (real faces), phone (a real cracked iPhone): OWED, said in each README; none
  are in the repo and the image hosts are blocked from here. He sends them, or Grok fetches them.
This SAMPLES the corpus for the twin sheets. COOK [the pack is the twin] owns extracting the whole of it.

## 2. THE GROUND TWIN SHEET (slices/vote/DIRECTION_THE_TWIN_THE_GROUND.png, in VOTE)
Ours left, his pack right, at the same pixels, measured the same way (tools/bohemia_direction_twin_sheets.py):

| family | colours / 1000 px | detail (edge) | dark line share | saturation |
|---|---|---|---|---|
| ROAD ours / pack | 0.5 / 142.3 | 11.4 / 17.4 | 0.040 / 0.050 | 0.16 / 0.13 |
| PROPS ours / pack | 0.4 / 250.7 | 6.2 / 14.4 | 0.022 / 0.056 | 0.16 / 0.25 |
| FIGHT BOARD ours / pack laid | 4.8 / 21.2 | 11.9 / 19.3 | 0.013 / 0.074 | 0.40 / 0.15 |

**THE ROAD.** (1) Ours is one flat stamp of grey speckle; his is slabs, cracks and seams you could step over. (2) Ours
has almost no dark line; every pack tile is drawn with a dark edge and a lit edge. (3) Ours repeats the same square; no
two of his are alike (a weed, a pothole, a patch). THE ONE CHANGE: cut the road from his cracked street tiles, placed
and flipped, never stamped from one texture.

**THE PROPS.** (1) Ours are flat blocks of 3 to 4 colours (the Jersey barrier, the trailer, the kit's pieces); his are
painted objects with rust, dents and a shine. (2) Ours have no outline; his sit inside a dark line with a shadow. (3)
Ours are shapes (a bar, a box); his are THINGS: a taxi, a dumpster, a stop sign. THE ONE CHANGE: take the cars, bins,
signs and barricades from the pack he already approved; cook only what it lacks.

**THE FIGHT BOARD.** (1) On the glass ours reads soft and flat; his pack laid at the same size reads sharp and busy.
(2) Ours is three tones and twice as saturated (road, orange roof, tan sand: 0.40 against 0.15); the pack's ground
carries cracks, grime and weeds in every tile. (3) Ours looks drawn by a program; the pack looks painted by a hand,
which is the whole of his complaint. THE ONE CHANGE: lay the board from the pack tiles at their own pixels, then dress
it (COMBAT TWO [the boards from the packs]).

**ONE HONEST WARNING FOR WHOEVER LAYS IT:** many pack floor tiles carry a bevelled rim, so laid edge to edge they show a
grid of slabs (visible on the right of the sheet). Use the seamless ones for open road, keep the bevelled ones for
paving and plazas, or crop the rim; a board that reads as tiles is AH-03 T8 by another road.

## 3. THE RULING FOR THE FOUR COOKS (rule 87, read before you draw)
- Every ground, road, prop, car, fence, roof and wall piece starts FROM the pack (placed, flipped, weathered,
  recoloured inside its palette). A fresh cook of something the pack holds is the 7/27 shopping violation.
- What the pack has that ours does not, and every piece must carry: a dark outline with a lit edge; at least 30
  colours per 1000 px of painted surface (the pack's lowest family reads 21, its tiles 142); wear authored per piece
  (crack, rust, weed, stain), never a speckle filter; a shadow under anything standing.
- Bring each round here before VOTE with ours beside its twin from reference/art_bank/ at the same size and the three
  differences named. Pass or back with three plain words each; the order is ground, people, places, map.
- NEXT ROUNDS OF THIS ROW: the people (character at 112, portrait) once their twins arrive; the places (settlement
  picture against roofs, walls and Pocket City 2's block); the map (against Pocket City 2's district and whole-city
  stops, its department); the phone once a real one is sent.

```json
{"row":"[the reference twin]","round":1,"date":"10/10/26","rules":["82","82a","87"],
 "art_bank":{"path":"reference/art_bank/","tool":"tools/bohemia_direction_art_bank.py","families":{"road":10,"ground":12,"prop":18,"settlement":10,"map_tile":"2 pointers","character":"2 pointers + runway twin OWED","fight_board":"1 pointer","portrait":"OWED","phone":"OWED"},"note":"samples; COOK [the pack is the twin] extracts the whole corpus"},
 "ground_sheet":{"picture":"slices/vote/DIRECTION_THE_TWIN_THE_GROUND.png","tool":"tools/bohemia_direction_twin_sheets.py",
  "road":{"ours":{"col_kpx":0.5,"detail":11.4},"pack":{"col_kpx":142.3,"detail":17.4},"change":"cut the road from his cracked street tiles, placed and flipped"},
  "props":{"ours":{"col_kpx":0.4,"detail":6.2},"pack":{"col_kpx":250.7,"detail":14.4},"change":"take the cars, bins, signs, barricades from the approved pack"},
  "board":{"ours":{"col_kpx":4.8,"detail":11.9,"sat":0.40},"pack":{"col_kpx":21.2,"detail":19.3,"sat":0.15},"change":"lay the board from pack tiles at their own pixels (COMBAT TWO)"},
  "warning":"bevelled pack floor tiles show a grid laid edge to edge"},
 "cook_bar":{"outline":"dark line with a lit edge","colours_per_kpx_min":30,"wear":"authored per piece","shadow":"under anything standing"},
 "next":["people when their twins arrive","places","map","phone when a real one is sent"]}
```
