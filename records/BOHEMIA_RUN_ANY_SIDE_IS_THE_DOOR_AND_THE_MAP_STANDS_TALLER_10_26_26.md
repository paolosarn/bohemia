# RUN 10/26: ANY SIDE OF A TOWN IS ITS DOOR, AND THE MAP STANDS TALLER (rules 186(a) and 196)

Session run-door-taller-10-25, opened by the coordinator (rule 112). BUILD 10/26a - THE MAP STANDS TALLER, ANY SIDE IS THE DOOR.
Rows: [any side of a town is its door], [the map stands taller, you walk behind it]; the coordinator's NOTE [the first person at the
door, still] answered.

## 1. [any side of a town is its door] (rule 186(a))

HIS WORDS: 'any tile next to a settlement... take me to the nearest tile that lets me enter... it makes me do a full loopy loop
around the block.'

MEASURED BEFORE (the demo's valley, the one driver, every town from eight sides, 111 walks): of the 14 towns, 12 have street on ONE
side of their own block only (Mob one tile, north; Church two, north). A town opened only from the eight blocks round that one
block, so the door was the street tile there nearest him as the crow flies (townDoor), and from the far side the walk went round
the block: 64 of 111 walks were two or more blocks longer than the shortest walk to the town as it is painted, 273 blocks in all,
the worst Reds from the north, 17 blocks for 5. A tap on a town's own block (not its picture) was worse: the road nearest the
TAPPED block, first in scan order, so always its west or north side.

NOW (__ANY_SIDE_OF_A_TOWN_IS_ITS_DOOR__, slices/BOHEMIA_CITY_WORLD.html):
- THE TOWN IS WHAT HE SEES. The painter builds a fortress on 4 x 4 blocks, a town 3 x 3, a camp 2 x 2 (vbTownsInput; a region
  place its vbRegionPatchGeom). A town is touched from any block on or next to that painted ground (townFoot, townTouches).
- THE DOOR IS HIS SHORTEST WALK. townDoorWalk: one breadth-first search from where he stands; the first block touching the town
  (fewest blocks, then fewest minutes) is the door, the street beside it or ONE step off the street onto the town's ground. The
  step onto the town's ground is ground only as the last step of a walk to that town (travelYardStep in stepOnce): no route cuts
  through a yard, the roaming parties' roads are as they were, and the old townDoor still answers its other callers (the wipe's
  wake-up, a party standing at a town, the job kinds' leg from a town onward).
- ARRIVING OPENS THAT TOWN. The walk carries its town (TRAVEL.town) and loopArrived opens it from any touching block; a walk to
  anywhere else opens a town only at its gate, as before (measured: a wider reach for every walk made a tap on a party standing
  at the Church's gate open the Church, and MEET BEFORE YOU FIGHT went 1/7; narrowed, 8/0).
- A FINGER ON A TOWN'S OWN BLOCK is a tap on the town (travelTo), and a caller handing in a town's own block gets the town's walk.
- WORLD's trip words (slices/bohemia_job_kinds.js, one marked block): the trip to the town a job names is the walk the town's tap
  sets (townDoorWalk), so 'Reds is 5 blocks' is the walk he gets, not the old one gate tile's road round the block.

GATE ANY SIDE OF A TOWN IS ITS DOOR (new, both profiles, 9/0 a profile): S1 every walk ends touching the town (111 of 111, 27 one
step off the street), S2 none passes the town first, S3 every walk the shortest (the gate's own search over the painter's own town
list), S4 the 64 loops gone, S5 the old door put back turns S3 red (98 of 111), S6 a real finger on five towns and S6b on their
bare blocks set out for the nearest side, S7 five walks on the beat from the far side open their towns. Re-aimed (the old door
named in them): THE PLACE IN THE DARK D6, THE REGION HAS ITS CITIES' walking leg, THE TRIP BEFORE THE YES T6 (the town's own tap).

## 2. [the map stands taller, you walk behind it] (rule 196)

HIS WORDS: 'on the map I need the buildings to be taller taller taller... the way you move north, east and west, maybe the bottom
of your legs, depending on how zoomed in zoomed out you are, are behind the buildings... or behind the freeway.'

### (a) taller (__THE_MAP_STANDS_TALLER__, the painter in its worker; VB_TALL, one table)
Against the painter at 2165008f (kept beside the gate as gates/the_map_stands_taller_2165008f_painter.txt, run on the same valley),
block medians in T (a texel at 24 a block):

| kind | 2165008f | now | x |
|---|---|---|---|
| house (suburb) | 5.2 | 15.6 | 3 |
| estate | 4.4 | 13.2 | 3 |
| apartment | 9.6 | 28.8 | 3 |
| trailer | 1.6 | 3.2 | 2 |
| works | 9.5 | 28.5 | 3 |
| shop | 9.5 | 20.9 | 2.2 |
| tower | 27 | 54 | 2 |
| casino (the Strip) | 18 | 63 | 3.5 |
| freeway berm | 3.5 | 10.4 | 3 |
| trees | 3 | 6 | 2 |

The order kept: a house 16 T under a works block 29 T under the towers 54 T, the Strip's casinos the tallest (63 T; the top tenth
84 T both). A town's own texels (COOK's painting, __THE_TOWN_IS_PAINTED_IN__ / __EVERY_TOWN_ITS_OWN__) x2 at the call site; COOK's
numbers stay as COOK wrote them. The cars, the kerbs and the open land as they lie. On the glass a house is 0.6 / 5.9 / 27.7 px on
the phone (far / opening / near; was 0.2 / 1.9 / 9.2) and 2.3 / 5.9 / 83.2 px on the computer (was 0.8 / 1.9 / 27.7); a tower 2.2 /
20.3 / 96 px on the phone (was 1.1 / 10.1 / 48). The sun's sweep is unchanged, so every shadow lengthens with its building (the
painting's tops in shade 11% -> 22%).
WHY THE SHOPS 2.2 AND THE TRAILERS 2, NOT 3: at three times, the shops and the trailer parks read as one family (THE MAP STANDS UP D1:
1.8 apart, its floor 10); the shop's pale lot and the trailers' gravel are what tell them apart, and a taller box covers its lot.
THE MAP STANDS UP D1 RE-AIMED: it read each family off the ground under its blocks; three times taller, a block's own ground is
mostly the walls of the block in front of it, so it now reads each picture texel for the family of the block that OWNS it (the
painter's own depth): 11.2 apart (the old heights read 8.3 that way). U2 and U3's floors raised with the heights (a house 15 T, the
berm 5.5 T), their mutations still turn them red.

### (b) you walk behind it (__YOU_WALK_BEHIND_IT__)
The painter (in its worker) now says, for every pixel of its picture, how far toward the camera the thing painted there stands
(VBC.dep, a byte a pixel, 5.5 MB; each close tile its own, counted in the tiles' memory budget, 2.5 MB measured) and each block's
ground height at its middle (VBC.blk). Every walker (him, his two men, every roaming party, the hunters) is drawn through
mapDepthBlit: a pixel of him is covered where what is painted there stands between him and the camera (a block nearer the camera
than his, standing, not his own block). In the open nothing is in front of him and he is drawn as before (a few sample points
decide); only a man with something in front of him is drawn through one scratch canvas, read a CSS pixel at a time. His ring hides
with his feet. A man on the freeway stands on its berm, and stepping off it he drops to the street with the berm in front of him.
Every zoom: the closer the zoom, the more of him a building hides (behind one tower: 6% at the opening zoom, 44% at a block 43 px,
97% at the phone's near stop), the way he said it.

### (c) you never lose him (the coordinator's default, his to kill: MAP_DEPTH.ghost)
When half or more of a man is covered, the covered part is drawn as his outline in his ring's colour (edges 170 of 255, the inside
30), so a crew behind a tower is three faint outlines; a tap still travels.

### (d) no cost he can feel
The depth is made in the painter's worker. A frame at the near stop behind a tower: 1.6 ms against 2.9 ms with the depth off on the
computer (noise), 44.4 against 43.5 ms on the phone profile (that frame is 44 ms with or without it). MAP DENSITY green (below).

GATE THE MAP STANDS TALLER (new, both profiles, 12/0 a profile): H1 houses x3, H2 the rest at least x2, H3 the order, W1 behind a
house part of him is covered and the glass there IS the building (the frame with him not drawn: 2,214 of his 11,996 device px are
the building, 0 neither, phone), W2 behind a tower most of him covered with his outline, W3 walked north over the freeway the berm
covers his feet stepping down (and he is never sunk in it), W4 whole in the open at every stop, W5 a roaming party covered, W6 a tap
travels while covered, W7 the depth off turns W2 red, C1 the cost, C2 nothing threw.

## 3. The coordinator's NOTE [the first person at the door, still]
tools/bohemia_run_the_first_ask_on_the_map.js on this build (10/26a), as a stranger: nothing spoke at him unasked in his first 60 s
(computer); with his tap on the nearest town at +5 s, a NAMED face spoke the first ask under her drawn face at +9.2 s on the
computer (DR. YUSRA ADEYEMI, THE CHILDREN'S DOCTOR) and +10.4 s on the phone (EL GUERO SALAS, THE YARD BOSS); the arrival line is
still a title, THE ELDER. No row.

## WEAK, SAID
- A NAME PLATE OVER ANOTHER TOWN: at the phone's opening zoom Network's name lies over Mob's block, so a finger there goes to
  Network ([eyes: names on names], my next row).
- THE FREEWAY HIDES HIM ONLY AT ITS FOOT: standing in the middle of the block beside it he is in front of the berm's top, so it
  covers his feet only as he steps off it (4% of him at the phone's near stop); a taller berm would wall the city.
- The faint outline is a default; the night pass and the lights still draw over everything, as before.
- Most of the 160 driver gates were not re-run; the map's own were (the list in the handoff).

## NOTES POSTED
COOK [the map stands taller]: VB_TALL and the x2 on a town's own texels; the close end is the same painter (one map), so its tiles
match at every zoom; a town's buildings and anything COOK adds to the painter get their depth for free.
