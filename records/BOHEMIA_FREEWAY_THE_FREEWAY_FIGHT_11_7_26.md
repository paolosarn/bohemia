# THE FREEWAY FIGHT (FREEWAY, 11/7/26; VAMILY rule 432, ask lines 513 and 514)

## HIS WORDS
Paolo 11/7: 'you never made a freeway map, that would be so awesome... the freeways can get large and wide and we often
traverse on it, and when combat starts on it, it just puts me on a suburb house... why can't it be an underpass or a large
overpass towering over the rest of the city, you can't quite hop off it... Fallout New Vegas had this DLC called Lonesome Road
and fighting on the freeway was so fun.' The reference is for the freeway fight only (CLAUDE.md's reference line).

## MEASURED BEFORE (main 5b9f86db, gates/the_freeway_fight_gate.js leg B0)
A fight from a freeway, beltway or interchange cell of the map is handed that district and its cell. The fight laid the map's
own block there (slices/bohemia_street_board.js plan + lay, COMBAT TWO 11/6h) and dressed it from the district's template.
The map's freeway band is two cells (72 m, six fight tiles) inside a 20 x 15 board of 12 m tiles, so the board was the suburb
on both sides of the band.
- 24 valleys (the boot valley and 23 rebuilt as a save rebuilds them), four freeway spots each (an interchange, a crossing,
  two plain): 96 fights.
- **96 of 96 stood among houses, 47 house tiles a board on average; the freeway was 42% of the board.**
- At the demo's freeway spot (seed 31): the board was named FREEWAY, family street, 83 houses in the laid picture.
That is his 'suburb house'.

## NOW
A fight on a freeway cell is dealt a FREEWAY BOARD from four templates, each real Las Vegas:
- **THE DECK** (I-15 and US-95 on their viaducts): the party is on it; ten lanes and a median of Jersey barriers; the city 10 m
  down past the parapet on both sides, drawn as the map's own 36 m blocks (a street every second block, the ranch houses on
  their lots in the dark, one fire somewhere); nobody stands on the drop and nothing on it stops a shot; the road itself the
  only way on and off. Four layouts: two ways, the exit (an on-ramp and an exit lane), the split (two viaducts, a crossover at
  each end), the hole (a piece of the deck fallen through).
- **THE OVERPASS** (where a street crosses the band, the map's own crossing test, overpassAt): the deck two levels over the
  street below, a ramp down at each end (two, one, one, ground), the street and its lots below, men above and men below.
  Two layouts: standing, and fallen (the span over the cross street down in it, the deck in two halves).
- **THE UNDERPASS** (the same crossing from under it): the deck's shade 96 m wide, bents of columns that stop a man and a
  bullet, the camp of the people who had nowhere else (drums with a fire, carts, tyres, tanks, sandbags), the street's light
  spilling in at both ends. Two layouts: the camp, the crossing (a frontage road along under the deck).
- **THE INTERCHANGE** (the Spaghetti Bowl, the 215's stacks): the party on the deck, flyovers climbing off it one level a
  tile to level three, the crest the highest ground in the valley. Three layouts: the stack (a level-three flyover north, a
  level-two connector south), the broken crest, one flyover.

Which: interchange cells the stack; a crossing the overpass (0.6) or the underpass (0.4) by the cell's own hash; every other
freeway or beltway cell the deck. Seeded by the cell and the fight's die (layout, mirror both ways, dressing), so no two are
the same and the same spot deals the same board.

The dressing (seeded): the JACKKNIFED SEMI (its trailer across a lane in the no man's land, its cab dead beside it), the
FALLEN SIGN (COOK's gantry through the master rig, cooked 10/18, never used until now), THE BOX OFF A TRUCK (a container in
the lanes you climb: one level, defence and no range, rule 428(b)), THE TOLL (a checkpoint of sandbags and a barrier at one
end), the dead cars where they stopped, the lamps on the median (a quarter still burning).

## THE RULES THAT HOLD (423, 428, 429(f) and (h))
- A level is a storey: the deck's own level is the ground of that board; one level up is defence and no range; two and three
  defence and range (the fight's own height rules, never new numbers).
- THE EDGE HOLDS: no two neighbouring tiles a man can stand on are two levels apart (the gate checks all eight neighbours);
  a ramp climbs one level a tile.
- A DROP IS A SOLID PIECE ON A FLAT TILE (fw_drop, blocks_move, no cover), never an obstacle tile, so a man above shoots a
  man below across it; a bent of columns IS an obstacle tile (it stops a bullet).
- THE PARAPET: every deck tile beside the drop is low cover (the wall in its picture, the piece fw_parapet).
- Every tile a man can stand on is reachable from his line; his line reaches theirs; every lane, ramp, street and sidewalk
  one road network.
- The sides start where the fight's own deployment puts them (rule 256: on the ground at the bell; on the deck boards the
  deck IS the ground; on the overpass both start below and the scramble is up the ramps, 428(c)).

## THE TEMPLATE FORMAT (for WORLD 13, rule 429(f))
slices/fight_ground/freeway/freeway_boards.json: each template is a board of 20 x 15 tiles as 15 strings of 20 characters;
a legend says what a character is (drop, deck at the template's level or a digit's, broken end, ground of a picture, shaded
ground under a deck, a column, the camp). 'pick' says which template a spot gets. A modder adds a layout and the gate refuses
it if a man could hop off a deck, stand on a drop, or not reach a tile. The spot is read from the map's own districts
(spot(at, cell, district)): it works on any seed, and the gate runs it on 24.

## THE SEAM (agreed in handoffs/FREEWAY.md for COMBAT TWO, who owns the fight's board code)
Five small touches in slices/BOHEMIA_FIGHT.html, each marked __THE_FREEWAY_FIGHT__: the script tag; two data files at load;
pieceDef/pieceSrc read the freeway kit last; dealBoard asks freewayBoard(opts) first (before the street board); groundSay
reads a board's own words first (the deck is never called a roof). The boards and their data live in their own files.

## THE ART (rule 430: reuse first; rule 408(c): every new picture a stand-in)
Reused as they lie: COMBAT TWO's street kit for every lane and street (ONE ROAD KIT, rule 77a), the fight's Jersey barrier
for the parapets, the kit's barrier for the side walls, the street board's ground and ranch houses for the city below, the
fight's trailer, cars, pillar, fence, dumpster, the kit's wrecks, patrol car, container, drums, carts, tyres, tanks, sandbags,
barrier. Cut from the master rig: COOK's gantry (S) and wreck (SE) at 42.9 px a metre. New on the rig's light: the deck's
face with its column, the broken end with its rebar, the ramp's slope, the shade under the deck with the light at its lip,
the city below. Golden candidate: freeway/fw_face_col.webp, to DIRECTION's eye first. Made by
tools/bohemia_freeway_kit_11_7_26.py; 56 pictures, 1.7 MB, a board loads 12 to 20 of them.

## PROOF
gates/the_freeway_fight_gate.js (in the suite as THE FREEWAY FIGHT): 22 passed, 0 failed. A: 264 boards (4 templates, 11
layouts, 4 mirrors, 6 seeds) hold the edge, the drops, reach, the roads, the parapet, the heights, the kit. M: six planted
fails each turn their leg red. H: the headless fight still loads. B: 24 valleys, 96 spots: B0 before 96/96 among houses;
B1 now 96/96 freeway boards with no house; B2 24 crossings the overpass or the underpass, 24 interchanges the stack, all four
templates dealt; B3 AUTO plays each, no page error; W1 the demo's own door at the boot valley's freeway cell [51,45] asked
the map itself and laid THE OVERPASS.
Phone profile (390 x 844 at 2), the game's own camera: records/target/FREEWAY_THE_FREEWAY_FIGHT_11_7.webp (before, the deck,
the overpass, the underpass, the interchange, the deck at night).

## WEAK, SAID OUT LOUD
- The city below is the board's own pattern of the map's blocks, not the map's real block under the deck (the plan has it;
  next round reads it).
- The headless fight (tools/bohemia_fight_headless.js: the job stars, the benches) has no window, so it still deals the old
  board for a freeway fight; the live game deals the freeway board.
- Every new picture is a stand-in; the parapet is the Jersey picture in a row; the houses below repeat three models.
- A party on the overpass's deck still starts below (rule 256 puts both sides on the ground at the bell).

## [bb]
Battle Brothers cuts a tactical map from the world tile's terrain and a road tile there is still a field. Ours is the road
itself, standing on its viaduct.

## [analog horror]
The deck he crossed on the map a minute ago, ten lanes of it, every car where it died, one lamp still burning over the median
for nobody, and the drop past the wall.
