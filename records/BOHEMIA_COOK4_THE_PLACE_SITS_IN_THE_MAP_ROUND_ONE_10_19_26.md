# COOK FOUR [the place sits in the map], round 14 (10/19): CHURCH ON THE MAP'S OWN GROUND (the suburb grid)

Opened by the coordinator (rule 112), Opus 5.5 at Extra (rule 116). The capped session before this one had only
claimed the row (d01d0c26); nothing of it was lost, nothing was built. One asset (rule 101d): the picture of ONE
place on ONE ground. A PLACEHOLDER (rule 101): candidate only, nothing in slices/, engine/ or the demo (rule 100).

## The row
PAOLO 10/10: 'the settlements all look like dogshit and not organic with the map' (rule 86). END STATE: 'the
settlement picture's edges meet the map's ground it stands on (the desert wash, the suburb grid, the strip's
spine): the same dirt, the same road running in and out, no slab, no frame; a sheet per ground; RUN draws the join
at the near stop.' This round is ground one, THE SUBURB GRID, on the place he taps first in the demo: CHURCH.

## What the map holds there (read, not guessed)
`node tools/bohemia_cook4_the_place_sits_in_the_map_read.js Church` opens the committed demo the way a player does
(COMBAT TWO's map-cell reader's way), finds Church in the map's own list (ctBases: a TOWN, the chapel block 47,50, two
blocks from the party at the door) and saves the map's fine grid of the 25 blocks round it, their districts and
the near stop as his glass shows it (reference/art_pipe/cook4/place_in_the_map/COOK4_PLACE_CHURCH.json, _NEAR.webp).
- The chapel block: the church, its forecourt on the NORTH side (the doors face it), its car park.
- North: THE ARTERIAL (four lanes, grey walks). East and south: THE SUBURB (tan yards, tan houses). West: THE STRIP's resorts.
- The map's own colours: suburb dirt #8a7a5e, asphalt #33333c, the arterial's walk #8a8a92, the chapel forecourt #a09a8a.
- On his glass (the near stop is drawn flat-shaded, so each thing is a few exact colours; the most-drawn colour within
  12 Lab of the plan's under the screen's light): dirt (137,121,101) drawn on 3.1% of the glass, asphalt (46,46,54) on
  10.4%, walk (124,124,131) on 0.5%; the forecourt is not drawn at the near stop, so its colour is the plan's under the
  light read off the dirt and the asphalt (gain 0.968, 0.965, 1.006): (155,149,139).

## What was wrong, measured
The picture Church opens on today is this lane's own round-3 pack town (slices/settlement_ground_packs/town_0.webp,
RUN TWO's [one painted place]), a placeholder never edited (101c):
- its dirt is his soil as bought, ORANGE (182,141,101): 18.7 off the map's dirt in Lab;
- the bank holds NO dirt in the map's tan: all 24 of his soil tiles sit 15.5 to 33.5 off it, and over the whole
  bank (2,021 floor pieces) the nearest things are wall and concrete tiles, never a dirt;
- its road is a cobble band 9.3 off the map's asphalt, with nothing to say where it comes from;
- its houses are slate cottages; the map round Church is tan houses and the Strip.
Zoom from the map into Church today and a tan-and-grey city becomes an orange village: that is the slab.

## How Battle Brothers does it (rule 41, the library's 10_UI_AND_FEEL and 03_WORLD_MAP)
A town screen is one painted view whose backdrop is the terrain the town stands on on the world map (steppe, snow,
forest, swamp, desert), so the town you enter is the place you saw; a fight by a town stands in its own buildings.
Ours, read literally: the picture is the map's own block, seen close.

## The picture (4224 x 1728, 74 m across, 43 m of ground; 57 px a metre across, 40 a metre deep)
- THE SEEING: from the arterial, at the church's doors (the map's plan puts its forecourt on the arterial side), so
  the road is in front and the suburb is on the left (east), the Strip on the right (west), as the map has them.
- THE SAME DIRT: his yard soil (2. Soil and dirt tiles #0), his #18 in patches as the second variant, his pale sand
  #3 where feet wore paths from the doors, each cut to meet itself (the second pass's cut: rows 1.21, columns 1.15 of
  the inside's step at the best cut) and laid to every edge, then WHITE-BALANCED to the map: a gain a channel takes
  each tile's median to the map's dirt on his glass, every grain and crack of his kept (his roofs took the tans the
  same way and he said 'That's way better holy shit'). Each tile balanced on its own, so the variant differs in grain only.
  ONE NUDGE, MEASURED: DIRECTION's floor bar (verdict 24, his YES on one real street as six numbers) wants desert dirt,
  hue 36 to 50; the map's own dirt is hue 33.3, a hair orange. The dirt is laid at the map's saturation and value with
  its hue moved the shortest way onto his YES band (38 degrees): (137,124,101), 2.1 off the map in Lab, the same dirt to
  the eye. With it the picture passes his YES street's bar 6 of 6 at his grain whole; the map's hue alone failed B2
  (33.8) and his grain B4 (16.0, the bar 11 to 15.5) on the first run.
- THE SAME ROAD: COOK TWO's cells (his asphalt #0 #1 #2 #7 #8 #9, his sidewalk slabs, his slab's own south face as the
  kerb with its shadow and lit lip, the curb he voted UP), his worn double yellow (#18 to #22) as the centre line one
  3.6 m lane out from the kerb; balanced to the map's asphalt and walk. It leaves the left edge, the right edge and the
  bottom edge (the far lanes are past the frame).
- THE FORECOURT, THE DRIVE, THE APRON: his slabs balanced to the plan's forecourt, the sand drifted over their edges
  where they meet the dirt (weather), the kerb kept clean.
- NO SLAB, NO FRAME: the frame cuts a garage ranch (left) and the casino and motel (right); the suburb's back row
  runs on behind his chain link (6. #0); his dead trees (16. #2, #8) in the back yards.
- THE TOWN, ITS FIVE TAPS (the screen's own schema, in COOK4_TOWN_CHURCH_ON_THE_SUBURB_GRID.json): CLINIC = the church
  (in Battle Brothers the temple treats the wounded) [1540,311,3529,1342]; BARBER = the porch ranch [644,789,1445,1188];
  STALL = his market stall (8. #4) out in the barber's yard by the walk [1240,1244,1334,1324]; POSTS = his post and rail (7. #2) three long at
  the barber's yard [580,1294,862,1366]; BOARD = his chalk easel (13. #30) at the tower doors [1487,1098,1562,1191].
- ONE SCENE, ONE LIGHT: one sun from the upper left; every building laid with the style guide's shadow (black, at most
  42%) and nothing black inside (the second pass's guide_alpha and never_black, applied as each is laid; the files are
  untouched: the church and casino are asserted pixel-equal to their files); every prop on its own silhouette's shadow.
- ONE WRONG THING: the church's pews out on the forecourt in rows, facing the road you came in on, not the doors.
- Every building is this lane's file at 1:1: the pass-two ranches (DIRECTION's card PASS, his YES), the church, the
  casino, the motel.

## The numbers (records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP.json; palette file COOK4_THE_MAP_GROUND.json)
| what | the map on his glass | before (Church today) | after |
|---|---|---|---|
| dirt | (137,121,101) | (182,141,101), 18.7 off | laid (137,124,101), reads 2.2 off |
| asphalt | (46,46,54) | 9.3 off | (45,45,54), 0.8 off |
| walk | (124,124,131) | none | 0.6 off |
| forecourt | (155,149,139) (plan under the light) | none | 0.5 off |
- NO SLAB: the dirt in a 64 px band at the left, right and top edges is 2.2 off the map, the same as the inside; the road runs
  through the left and right edges and the bottom band.
- HIS YES STREET'S BAR (DIRECTION's B1 to B6, tools/bohemia_direction_floor_bar.py): Church today passes 1 of 6 (only
  B5: saturation 0.44, hue 30.5, a camouflage split 24.4, grit 10.6, 3% bright orange roof); the new picture 6 of 6
  (saturation 0.27, hue 37.1, split 7.3, grit 14.1, the road's self-match 0.20, 0.1% orange).
- The cell check (the not-vibe-coded ruler, D2 and D5, on every 96 px cell of the ground): 0 red at his grain whole
  (contrast 1.0; the search would have flattened it only to clear a red). On the WHOLE picture, every laid piece in
  it: 2 red of 792, both inside a piece laid as it is: the casino's roof under its sign's leg (D5, the casino file,
  a placeholder never edited) and his market stall's fruit (D2, his tile as bought). The stall was first on the walk
  (its cell red on D2 with the slab's cracks); moved into the barber's yard it stays red on its own colours alone.
- The dirt's laid joints: rows 1.0, columns 1.69 of the inside's step (his grainy soil; the roof's were 4.08 before
  the second pass and 0.72 after).

## Gates (rule 13: the pre-push pass, by name)
REFERENCE CHECK 496 passed, 2 failed: the frozen-baseline ratchet (86 unchecked against 85, UI's new
bohemia_ui_the_line_on_a_ground_cook.py) and the same file's missing block; my reader's block added this round.
ART PIPE A2: this tool writes no literal pixel (swatches are the colour pasted, the prop shadow is its own silhouette);
the gate's red is 23 other tools. REUSE-FIRST: 40 reds to 16: the twelve COOK FOUR tools that carried no REUSE CHECK
(placeholders' tools from 10/10 to 10/17) now name what they reuse; the art they made is not touched (101c).
ART 45 16/0. VOTE TAB, NOT VIBE CODED N3: in the ship commit's line. Full suite unmeasured (rule 13).

## Weak, said
- The picture is 74 m wide: at 1:1 on his 3x phone it is 73% of the glass tall and 3.6 phone-widths wide; RUN TWO's
  screen today scales a picture to half the scene's height, which would shrink this one 0.55 to the device pixel:
  RUN TWO shows it at one picture pixel to one device pixel and pans, when he says so.
- No night picture yet (the screen falls back to the day one); no street lamps (his lamp at 1:1 is 1.7 m; at 2x it
  would mix pixel sizes, rule 114); the stall is his 1.7 m one; the church and casino are first-pass buildings beside
  pass-two houses (their seams and walls are as they were; only the shadow rule is the scene's).
- The map draws four lanes; the picture shows the near lane and the centre line, the rest past the frame.
- Looking from the arterial mirrors east and west against the map's own camera (the map looks north-west); the
  church's doors face the arterial on the map's plan, so the picture stands where the doors are.

## Lead line for DIRECTION (rule 113a)
COOK FOUR made Church on the map's own ground (the suburb grid), VOTE tab, COOKING.

## [bb research]
Battle Brothers draws every town screen over the terrain its tile has on the world map, so the place you enter is the
place you saw; the first of our three grounds now does the same: the map's dirt, the map's road, the map's neighbours.

## Next
Rounds two and three of this row: the desert wash (a camp out in the region, Goodsprings or Jean), the Strip's spine
(the casino town), one a round; and [the Strip's row] (a second casino, a pawn shop, a wedding chapel, a motel sign
tower), the coordinator's next line, which the Strip's spine picture then stands in.
