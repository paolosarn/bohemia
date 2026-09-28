# BB DENSITY: HOW MANY PIXELS THE BATTLE BROTHERS MAP DRAWS, AND OURS (DIRECTION, 9/28/26)
# [bb density], rule 38a (Paolo 9/28: "how many pixels the Battle Brothers map is
# and we need to have that exact same number at the bare minimum... that has to
# happen like now"). Measured this round. What could not be measured is named.

## 1. WHAT COULD BE ESTABLISHED ABOUT THEIR MAP (sourced, and what was blocked)
The developer blog, Steam, the wiki and Wikipedia are all BLOCKED from this
machine (egress refused; tried 9/28). Search results established, from the
modding documentation and the developer forum:
- The world map is HEXAGONAL TILES, each with its own painted texture (grass,
  sand, water, snow, swamp) and DECALS and ENTITIES on top (locations, roads,
  mountains, forests). It is hand-painted raster art, not pixel art.
- Sprites are packed by the mod kit's brusher into sheets at their own pixel
  size - the art is authored at resolution, never upscaled blocks.
- It renders at the screen's NATIVE resolution, with two independent video
  sliders, UI scale and SCENE scale (the game scales the painting to the
  screen; it never shows one painted pixel as a block of several).
THEREFORE THEIR DENSITY IS ONE PAINTED PIXEL PER SCREEN PIXEL - at 1920x1080
that is 2,073,600 independently painted pixels on one screen.
NOT MEASURABLE FROM HERE, said per rule 13: the on-screen pixel size of a
settlement icon, a party banner, a road's width, a hex. Those need their
screenshots at a known resolution; EYES can take them the moment his network
click opens the blocked domains, and this card gets the numbers then.

## 2. OURS, MEASURED ON THE REAL GAME
The far-stop map frame from the alpha on a phone profile (filed 9/24,
records/target/DIRECTION_THE_MAP_TODAY_9_24.png, 1134x2256 device px): the
mean run of one flat colour is 3.8 px across and 3.5 px down, so the frame
carries ~191,600 independently painted units on 2,558,304 pixels: 7.5%. The
city band alone: 7.1%. THE MAP PAINTS ABOUT ONE UNIT PER 14 SCREEN PIXELS
where Battle Brothers paints one per pixel. Two causes, both visible: the map
canvas draws at CSS resolution on a 3x screen (a third of the pixels, each
shown as a 3x3 block), and the valley is 96x96 cells each drawn as ONE FLAT
COLOUR (COOK's own finding on the valley card).

## 3. THE MAP FLOOR (rule 38a's number)
1. ONE PAINTED PIXEL PER SCREEN PIXEL at the default map zoom, on the
   phone's own ratio (1170x2532 on the reference phone: 2,962,440 pixels),
   and NEVER FEWER THAN BATTLE BROTHERS' 2,073,600 per screen. The map canvas
   renders at device pixel ratio; a painted texel is never shown larger than
   one device pixel at default zoom.
2. NO FLAT-COLOUR CELLS: every map cell is painted art (texture + the
   decals and entities that sit on it), the way their hexes are. A cell
   drawn as one colour is below the floor by construction.
3. THE MEASURE: mean flat-colour run <= 1.5 device px on both axes over the
   whole map frame at default zoom (ours today: 3.8 x 3.5). PLUMBER's density
   leg reads exactly this, on the glass, per push.
Every map cook from this round - COOK [bb map art], RUN [bb map], EYES
[bb reads] - is judged against this floor.

## 4. FIXES TO THE STUDY FILES (the line: "fix them where they are wrong")
- 01_WORLDMAP gains a RENDERING paragraph with the three sourced facts.
- 10_UI_AND_FEEL's closing line said "a place is a living street": wrong
  since his third votes (37b) and rule 38b - a place is a SETTLEMENT SCREEN,
  and nothing walks the city. Corrected.

```json
{"card":"BB_DENSITY_MAP_FLOOR","date":"9/28/26","rule":"38a",
 "theirs":{"art":"hand-painted raster on hex tiles + decals/entities","render":"native resolution, UI scale + scene scale sliders","density":"1 painted px per screen px","at_1080p":2073600,
  "unmeasured":["settlement icon px","party banner px","road width px","hex px"],"why":"dev blog, Steam, wiki, Wikipedia egress-blocked 9/28"},
 "ours":{"frame":"records/target/DIRECTION_THE_MAP_TODAY_9_24.png","px":2558304,"mean_flat_run":[3.8,3.5],"painted_units":191564,"share":0.075,"causes":["canvas at CSS res on a 3x screen","96x96 flat-colour cells"]},
 "floor":{"painted_per_screen_px":1,"min_per_screen":2073600,"no_flat_cells":true,"measure":"mean flat run <= 1.5 device px both axes at default zoom","gate_leg":"PLUMBER [cook gate] density leg"},
 "judged_against_it":["COOK [bb map art]","RUN [bb map]","EYES [bb reads]"]}
```
