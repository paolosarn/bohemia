# WORLD THIRTEEN, ROUND EIGHT, BUILD ONE: THE PLACES ARE LAID OUT ON THE MAP (11/20/26)

VAMILY rules 429(c), 461 (the whole enchilada: nothing forgotten); ask line 504 (IN FLIGHT since 11/7, the map's half). BUILD 11/20c -
THE PLACES ARE LAID OUT ON THE MAP. VOTE world13-the-places-are-laid-out-11-20 (stand_in).

Rule 429(c): 'the 15 place boards' layouts are written INTO the world map at their places, so the map gets their good layouts and
the fight gets them back by being the map'.

## 1. MEASURED FIRST

Since 11/11 the generator stands the 15 place boards on every valley as templates (11/11b) and a fight on a place's cell is fought on
that board at that cell's tiles (11/11h, COMBAT THREE 11/11z). But the map drew a place's cell as any block of its kind: the
airport's hangar row and the planes on its apron, the wash's channel banks, the landfill's heaps, the pass's rocks were in the fight
and nowhere on the map. The boards (fight_ground.json): 20 x 15 tiles of 12 m, six kinds (flat, rough, debris, water, height,
blocked), mostly open ground with rows and scatters of what blocks and what stands high; a map block is 3 x 3 of their tiles.

## 2. THE BUILD

- records/target/bb/place_templates.json: each template gains 'terrain' (its board's 15 rows of 20 one-letter codes, copied from the
  fight's own board by tools/bohemia_world_thirteen_place_layouts.py, never by hand) and 'lay': built (lab, airport, works, marina,
  golf course, shore: a box where the board blocks, a platform where it stands high), natural (Red Rock, landfill, desert, pass,
  wash: a boulder, a mound), own (the suburbs, the trailer park, the Strip, downtown, with 'lay_why': the map already lays the same
  kind of thing there, houses on lots facing their streets, trailers in rows, resorts on the Boulevard, towers on the grid, and the
  board's rows laid over them would fight the house models and the streets).
- The templates sync carries both into the generator word for word (KEEP lay, terrain); the generator re-inlined into the map page.
- The map page (`__THE_PLACES_ARE_LAID_OUT__`): vbLayValley() gives every laid cell its board and its three by three tiles once a
  valley; every painter input carries them (the whole painting and every tile); the painter lays each tile under its texels: water,
  the ground's brush and rubble, and a box or a mound with soft edges, merged with a neighbour of the same kind; open ground stays the
  map's; NEVER over a street (the street wins and is counted). The painter counts it (stand.lay) for the gate.

## 3. NUMBERS (the demo valley)

- 296 cells of 11 places laid (the works 66, the pass 70, the desert 56, the airport 35, the marina 35, the wash 19, the golf course
  5, the landfill 4, the shore 4, the lab 1, Red Rock 1); the own places' 144 cells untouched.
- The whole painting: 1,500 board objects standing at their tile middles, 0 missed, 84 water, 1,652 rough; 60 where a map street runs
  under a board's object (the street stays: there the map and the board still differ, said plainly).
- A close tile at the airport (60 texels a block): 30 cells, 192 board objects.
- WHAT HE WILL SEE, said plainly: at the airport the board's hangar row and the boxes on its apron show clearly; at the works, the
  pass, the marina and the desert the boards add a few obstacles among the map's own painting and read as more of the same.

## 4. GATES

- NEW gates/the_places_are_laid_out_gate.js 8/0: Y1 the file and the generator in step with the fight's boards, Y2 the cells laid
  and the painting's own count (the demo upright, the alpha on its side), Y3 the map and the fight agree at 296 of 296 cells, Y4 a
  close tile at the airport and its plant (the laying off: red), Y5 nothing threw. In the suite.
- Neighbours green: the places are templates 13/0, every map kind has its fight answer 22/0, the map stands up 13/0, the far end is
  painted 11/0, the houses stand up close 28/0, the lake has its ring 8/0, the Strip reads as the Strip 5/0, the valley has its zones
  9/0.

## 5. OWED

- The 60 tiles where a board's object meets a map street: the board could bend round the street (COMBAT THREE's half: the fight
  could lay the map's street there instead of the object).
- The own places: if he wants the boards' own rows on the map at the suburbs and the trailer park, the house models stand by them
  (a lot per run), not boxes.

[bb] Battle Brothers' map draws a location as one picture; ours lays the fight's own ground under it, tile for tile.
[analog horror] the planes on the apron stand where they stood the morning the fuel ran out, and they still stand there in the fight.
