# COMBAT THREE: THE CELL SAYS WHERE (BUILD 11/17zl - THE CELL SAYS WHERE)

11/17/26. The full sweep (VAMILY rule 453), job 2's tail: WORLD THIRTEEN's owed read, taken the round it was written. Rules 429(a)(g), 416, 441.
Ask rows 504, 507, 627.

## WHERE IT CAME FROM
WORLD THIRTEEN's seam, handoffs/WORLD_THIRTEEN.md (BUILD 11/17zd EVERY ZONE ITS GROUND): "OWED READS, YOURS IF YOU WANT THEM: dealZone's mix-in kinds come
from the shell's district (a desert road mixes a 'park' golf block in): ground.district (the road's own stems, strip, lots) or ground.land is the cell's
truth." And: "a road cell's fight carries a nearby block's district ('school', 'park', 'trailer')."
His words behind the zone boards (11/7): "not every part of town is gonna be this suburb shit... where there's more desert landscape."

## MEASURED BEFORE (main d6ed63cdb, BUILD 11/17zf; the two new gate legs run against that fight page)
- A road cell in the open desert, handed the way the map hands it (the shell's district a nearby park's; the ground: the road's own kind, its land the
  desert, the desert's place): 52 GOLF BLOCKS on 40 boards (480 blocks). A golf clubhouse and its greens on a desert highway.
- A road cell BESIDE a building, handed with the building's district: inside the building (or its garage) on 34 of 40 fights at the convention centre, 36
  of 40 at the mall, 22 of 40 in the warehouse district. A fight on the street outside started on the show floor.
- The building's OWN cell handed with a neighbour's district: never inside (0 of 40, all three).

## WHAT SHIPPED
`slices/BOHEMIA_FIGHT.html`, `__THE_CELL_SAYS_WHERE__`: two small readers and nine call sites. On a cell the map handed with its ground
(FIGHT_OPTS.ground; never a place's own cell):
- `cellKind(opts)` = the cell's own map kind (ground.district). It answers WHAT THE FIGHT IS AT: the four insides (the data-laid ones, the flood tunnels,
  the garage, the casino floor: their districts and their per-district shares), the block an inside's roof stands on, and the place a district owns
  (the line WORLD THIRTEEN handed me in placeOwn: the zone place still leads when the map names one).
- `cellLand(opts)` = the cell's land (ground.land for a road: the commonest kind beside it; any other cell: its own kind). It answers WHOSE GROUND THE
  BOARD MIXES IN: the kinds the one table names for that land.
A door that sends no ground (the gates, a boss, the arena, a place's own cell) reads the shell's district exactly as before.

## THE GATES
- A PLAIN CELL IS NOT THE PLACE: 12 passed, 0 failed. New leg P11 THE MIX-IN IS THE CELL'S LAND: 0 golf blocks on the same 40 boards, 144 blocks mixed
  in, every one a kind the table names for the desert; 40 different boards. (Against main's fight page the leg reads red: 52 golf blocks.)
- THE BIG INSIDES: 46 passed, 0 failed. New leg I10 AN INSIDE IS WHERE THE CELL IS, for each inside: a road cell beside it inside on 0 of 40; its own
  cell handed with a neighbour's district inside on 16 (hall), 16 (mall), 19 (warehouse) of 40. (Against main: 34, 36, 22 and 0, 0, 0.)
- Neighbours green on this tree: THE PARKING GARAGE 16/0, THE FLOOD TUNNELS 16/0, THE CASINO FLOOR 9/0, THE CREW STARTS ON ITS CELL 9/0, EVERY PLACE ITS
  OWN BOARD, EVERY MAP KIND HAS ITS FIGHT ANSWER 22/0, AN INSIDE SHOWS ITS CEILING 6/0, THE OLD LAYOUT THE NEW HOUSES 25/0, and WORLD THIRTEEN's own EVERY
  ZONE ITS GROUND (its dealing legs Z1 to Z5 and its phone legs).

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, C3_PLAIN=1 C3_ROAD=1: road cells through the map's own door, the message a
## road encounter really sends, no district of its own)
- the demo upright (390 x 844): 4 road fights (a strip-mall road, two suburb roads, a desert road), 4 ended on AUTO, 0 page errors.
- the demo on its side (844 x 390): 4 (three suburb roads, a desert road), 4 ended, 0 errors.
- the alpha upright: 3 (a strip-mall road, two suburb roads), 3 ended, 0 errors.
- the alpha on its side: 4 (a road through the storage yards, two suburb roads, a desert road), 4 ended, 0 errors.
15 road fights, 15 ended, 0 page errors. Every desert road dealt the desert's own blocks and the desert's kinds (pass, scrub, scrubroad), no suburb stem and
no strip mall; the storage road dealt the works zone (rail, landfill, works); the strip-mall road, whose land has no place, its own lots and strip.
WHAT THE PAGE SHOWED THAT THE GATE DID NOT: for a road encounter's message the map's door stamps the ROAD'S OWN kind ('arterial') as the shell's district,
not a nearby block's. So before this build every road fight mixed in the road kind's own list (suburb stem, strip, lots) whatever land it ran through: a
suburb stem on a desert highway. WORLD THIRTEEN measured the nearby-block case on other encounters. Both are the same fault and the same fix: read the cell.

## ALSO IN THIS SHIP: ASK ROW 646, THE SHEET HOLDS ITS PIECES (found by COOK FIVE 11/17, proving the hall's art; FIXES 2 with COMBAT THREE)
"CLOSE IN, WITH THE CAMERA STILL, AN INSIDE'S FURNITURE IS NOT DRAWN." COOK FIVE read the cause on the page and did not edit my page; it is exactly as
written: `groundOn(cx)` draws on the canvas it is given, but since BUILD 11/10l its three picture calls (the feather, the board's standing pieces, the
lamps) were `cxDraw`, which always draws on the fight's own glass. On the pass that builds the still camera's sheet the pieces went to the glass and the
sheet was laid over them. Now `sheetDraw(cx, [...])` on the canvas given (`__THE_SHEET_HOLDS_ITS_PIECES__`), the packed and the night paths kept.
MEASURED ON THE PAGE (the fight page alone, a phone upright at two device pixels a point, the page's own wheel zoom to its close stop, the SAME camera read
off the glass twice: a frame the still sheet drew and a frame drawn straight; tools/bohemia_combat_three_the_still_frame_and_the_straight_one.js):
- before: the convention hall at zoom 0.58: 19 of 19 pieces on the glass missing on the still frame (the two frames 5.4 of 255 apart on average); the mall
  at 0.56: 25 of 26; the warehouse at 0.53: 40 of 43.
- after: 0 of 19, 0 of 26, 0 of 43; the two frames the same picture to the pixel (0.00).
At the opening view (zoom 0.48 and wider) the bug never showed, which is why four page proofs of mine walked past it: said plainly.
GATE: THE BIG INSIDES leg G1 reads the page's own source (no picture call in groundOn on the fight's own glass; three on the canvas given), with its plant.
It covers every board whose pieces are in the board's cover list: the hall, the mall, the warehouse, the garage, the casino floor, the tunnels, and the
street boards' dressing.

## SAID PLAINLY
- ground.sides, street.ends, track and street.road are still not read (WORLD THIRTEEN's to ask for).
- The freeway's own board and the street board still ask the shell's district; they are other lanes' lines in the page and their gates are green.
- The card's two pictures are the fight page opened alone on one desert road cell with a park's district handed (the gate's case), old code over new.

## NEXT
The data fort (the seventh inside; its data file is drafted), then the airport terminal.
