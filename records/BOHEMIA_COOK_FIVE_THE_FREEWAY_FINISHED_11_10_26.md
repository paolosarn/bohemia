# COOK FIVE [freeway finished] 11/10/26 -- THE FOUR FREEWAY BOARDS IN FINISHED ART

VAMILY rule 443(g) (COOK FIVE, new: finished art where a stand-in stands), ask row 557 (the coordinator, rule 441: 'the four
freeway boards play but still wear stand-in art: finished art owed on the golden-piece recipe before they count as fully
baked'), rule 432 (Paolo 11/7: 'why can't it be an underpass or a large overpass towering over the rest of the city, you
can't quite hop off it'), rule 408(b) (one golden piece first, then its recipe), rule 430 (reuse first; improve, never throw
away), rule 441(a) (on the page he plays, upright and sideways, nothing left for later).

## WHAT STOOD THERE (measured on main 81e1187f, before a pixel was made)
FREEWAY shipped the four boards playing on 11/7 and said so itself: 'every new freeway picture is a STAND-IN'. Its kit
(tools/bohemia_freeway_kit_11_7_26.py) was 2D: the street kit's residential lane with the Jersey barrier's picture stamped
along its edge, the deck's face a stretched strip of that barrier with a flat column, the city below a street tile turned
down to 40% with one house pasted on a black lot, the broken end a polygon with ruled lines for rebar, the bent the parking
deck's pillar scaled 1.7, the semi's cab a car wreck, the median's lamp a house's porch lamp. 58 pictures, 1,759,027 bytes; a
board's own freeway pictures (the fight waits on them): the deck 500,772, the overpass 895,832, the underpass 441,222, the
interchange 770,996 bytes. On his phone the deck read as six stacked streets over dark blue squares.

## THE GOLDEN PIECE (rule 408(b)): THE SOUTH EDGE OF THE DECK
One piece made to the bar first: the lane, the shoulder and its fog line, the 34-inch parapet flush with the deck's edge,
the fascia, the box girder's web with forty years of water down it, the bent's cap and its round column going down to its
footing on the ground 8.48 m below, the deck's own shadow under it. Judged beside its twin (the map's own freeway block,
slices/fight_ground/block_freeway_0.webp: the same asphalt, paint, camera, sun and ruler) and beside the bar (his one real
street, ground_one_real_street). Its recipe made every other picture:
- THE GROUND IS THE FLOOR TOOL'S (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py, imported): the asphalt and the
  lane paint of the map's freeway, its grid, heights, potholes, the gravel in the gutter. Two grounds added in its own table:
  the median's yellow and the black of a sealed joint. Stains are painted in metres on the ground's own mesh (two fields the
  material reads): the oil line down each lane, rubber in the wheel paths, rust out of every joint, sand against the walls.
- THE STRUCTURE IS MESHES IN REAL METRES: the parapet cast in 3 m lengths, the fascia, six webs and the soffit of a box
  girder, hammerhead caps on round and square columns, a deck drain down one column, rebar in two mats out of every broken
  strip, lumps still hanging on it.
- THE RIG'S PASSES, imported, never edited: source pass, dents, the not-final tool's grime across every edge, one sun, the
  45 camera facing north, 42.92 px a metre, heights stretched 1.414.
- THE HEIGHT IS ONE TILE: the deck stands 8.482 m over the ground, which is exactly one 364 px tile on the glass, so under
  every south edge there is one whole tile of drop (the girder, the dark under it, the column, the ground) and the tiles
  still join whichever way a board is laid. That is 'towering over the rest of the city' as a number.

## WHAT WAS MADE
Five renders of a 60 m block (2575 x 1820) through the rig, then a cut:
- deck: the deck from above, five rows (north edge, lanes, the median, lanes, south edge), a wall across each end.
- ns: the one-tile ramp's lanes running north to south, walled both sides or one.
- face: the viaduct in section, lifted one tile: three rows of deck, both broken ends, the south face under them with two
  kinds of bent; the ground under it kept as shadow only, so the cut lays the structure on the real ground's own pixels.
- props: the underpass's bent (a column and its hammerhead), the semi's day-cab tractor, the ramp's low wall of cast panels,
  the freeway's own lamp mast.
- THE CITY BELOW is not drawn at all: it is the fight's own suburb blocks (block_subs_0..2, block_corner_0..1) seen from the
  deck: dimmer, drained, cooler, out of focus, baked into five quarter-size sheets (the fight redraws its ground when a
  lamp flickers, and a small sheet costs it a quarter of the pixels); a block is five tiles a side, its street
  runs on east and west, a cross street every third block. The overpass stands on the street, so the city round it is
  those same blocks as they lie (no new file).
- THE GROUND UNDER THE DECK (the underpass) is the street kit's own tiles in the deck's shadow (COOK TWO's shadow(), the hue
  walking cool), a damp line where a joint overhead has wept, its salt; the shadow's edge lies 4 m east of the deck's edge
  because the rig's sun is in the south-west.
- A RAMP's light is the cosine of the rig's one sun: a ramp climbing east faces it (brighter), one climbing west faces away.

## ANALOG HORROR, AT THE SOURCE (rule 20)
- Two tyre lines run straight into the south wall, and the wall is whole. Once on a board (the dealer lays it on one tile).
- Where a car burned and was dragged off: the scorch, no car. Once on a board.
- In the city below a handful of windows are lit, and nothing moves. One drum fire burns in a yard with nobody at it.
- Round the underpass's column, at hand height, a row of tally marks that goes all the way round.
- The semi's driver's door hangs open and the cab is dark inside.

## THE DEALER (slices/bohemia_freeway_boards.js): PICTURE CHOICE ONLY, no rule and no layout touched
1. city(): the city below is read off five-tile sheets (kit city.subs / city.cross), coherent; a template's skin may make it
   the street-level blocks (city.near) instead.
2. facePic(): under a south edge a bent stands on every third tile (36 m spans); the street going under gets its own face;
   a ramp one level up gets a low wall; a broken span gets its hanging end.
3. A broken end is picked by which side the deck is on AND whether it is the deck's north or south edge row.
4. A lane beside a broken end wears no wall toward the break (the lanes run to the tear).
5. The ring round the board picks its own pictures tile by tile (it used to repeat the board's edge tile ten times).
6. A bent stands on the verge beside it (the dirt, the walk), never on a square of street cut out of the verge.
7. The once-marks (kit once) are laid on one board tile each. 8. The one fire is a picture laid on its tile.
9. On the median the lamp is the freeway's own mast (kit lamp).
freeway_boards.json: one key added, the overpass's skin (the overpass stands on the street: its faces, its broken ends and
the city round it are the street's). No layout, legend or weight changed.

## PROOF (taken on the tree that shipped)
ON THE PAGE (rule 441(a)): the fight's own page (slices/BOHEMIA_FIGHT.html, the page every door of the alpha and the demo
opens), a fresh page a board, his phone upright (390 x 844) and sideways (844 x 390), plus the deck at night: nine loads,
all four boards deal, 0 pictures missing of 1,400 tiles a board, 0 page errors (records/target/cook5_freeway/page_proof.json).
Started the way he starts it: FREEWAY's own gate asks the demo's door at [51,45] and gets THE OVERPASS (W1), and plays AUTO
on each board (B3).

THE LOAD IS LIGHTER ON ALL FOUR (bytes of ground the fight waits on before the board shows; the stand-in on main 81e1187f,
then now):
  the deck          2,540,085  ->  2,268,732
  the overpass      2,983,711  ->  2,870,632   (its street-level city is one half-size sheet)
  the underpass     2,501,761  ->  2,287,070
  the interchange   2,774,525  ->  2,431,198
A board's own freeway pictures, the worst of six seeds: the deck 500,772 -> 294,388; the overpass 895,832 -> 647,360; the
underpass 441,222 -> 194,534; the interchange 770,996 -> 484,284. The folder: 58 pictures, 1,759,027 bytes -> 112 pictures,
1,573,890 bytes (more pictures, because a lane, a wall and a face now have several each, and still smaller).

THE SPEED IS THE SAME, AND IT IS NOT 60 ON A SLOWED PHONE, BEFORE OR NOW (said plainly, rule 441(c) is PLUMBER's row): the
settled fight, a headless phone-shaped browser slowed 4 times, 8 seconds a run, the old kit and the new one back to back:
a blank page 60.1 to 60.3 frames a second (the yardstick); the fight with the stand-in kit 38.6 and 38.8 (two sets of runs),
with the finished kit 37.0 and 37.7; one run to the next of the same board moves 3 either way, so the two are the same
within the test. The worst single frame: 133 ms now (400 ms once before); no frame over half a second.
ONE THING MEASURED AND CHANGED FOR IT: the first cut drew the city below from half-size sheets and the deck measured about
4 frames a second lower upright (the fight repaints its ground when a lamp flickers, and a tile cut from a bigger sheet costs more);
the sheets are now a quarter size (the city is out of focus anyway). records/target/cook5_freeway/perf_4x_*.json.

GATES (on the tree that shipped):
- NEW THE FREEWAY IS FINISHED (gates/the_freeway_is_finished_gate.js, registered): 11 passed, 0 failed. F1 the kit finished, 6
  pieces, 0 a stand-in, every named picture on disk, none unnamed in the folder; F2 264 boards, 0 pictures missing; F3 a face
  under every south edge, the overpass on the street, the deck and the interchange over the far city; F4 the bents 36 m
  apart; F5 the once-marks once, never in the ring; F6 no wall before a break; F7 every tile 515 x 364, the folder 1,573,890
  bytes (budget 2.3 MB), the heaviest board 647,360 (budget: the stand-in's heaviest, 896,000); M1 to M4 planted, each red.
- THE FREEWAY FIGHT (FREEWAY's own, untouched): 22 passed, 0 failed (264 boards hold the edge, the drops, reach, one road
  network; 24 valleys, 96 spots, 96 a freeway board; AUTO plays each board; the demo's own door lays THE OVERPASS).
- DEMO BUILD 25/0. HANDOFF 10/0. REFERENCE CHECK 516/2 and REUSE-FIRST 391/19: both tools carry their checks; the reds are other
  lanes' tools, the same as on main. VOTE TAB: this ship's two cards read clean (GOLDEN with its bar line, MADE FROM a passed
  golden, a first picture that fits one screen); its reds are other lanes' cards and the alpha's landing, the same as on main.
- PAGES PUBLISH 27/1, the same red as main: the published list was 905.9 MB against the 900 MB cap before this ship; this
  ship's own pictures are SMALLER than the stand-ins they replace (the freeway folder 1.76 -> 1.57 MB) and its net on the
  list is under 1 MB (the two vote sheets, the casino's sheet less the stand-ins). For PLUMBER 8.
- PURPLE RESERVATION: 0 purple pixels on all 115 shipped pictures (gates/bohemia_purity_gate.py check_png, imported).

## WEAK, SAID PLAINLY
- A flyover three levels up is drawn at its own tiles like every height in this fight, so it reads higher only by its ramps,
  its walls and its face; it does not cast a shadow on the deck under it.
- The deck's shadow stops at the face tile; it does not lie across the first row of the city.
- The cab and the lamp are built from boxes and drums in metres; they are the rig's look, not a sculpt.
- The dead cars, the trailer, the containers and the barriers on the deck are the fight's own cover pieces, untouched.

[bb] Battle Brothers cuts every tactical map from the world tile's terrain and never draws the same field twice; a road
there is still a field. Ours is the road itself on its viaduct, cut from the map's own freeway and the map's own suburb.
[analog horror] the freeway you crossed on the map a minute ago: every car where it died, two tyre lines into a wall that is
not broken, and far below a few windows lit in a city where nothing moves.
