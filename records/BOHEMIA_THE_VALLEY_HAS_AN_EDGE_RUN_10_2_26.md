# THE VALLEY HAS AN EDGE (RUN, 10/2/26, [the valley edge], rule 61c)

> **PAOLO 10/1:** *"when I zoom out of Las Vegas there's a square and then the rest is desert brown;
> it's really bad."*

## MEASURED FIRST
At the far end of the pinch (the map's widest zoom, the step before the moon), the 96 x 96 valley
is a strip about 360 px tall on an 830 px screen. **Every canvas pixel past it was one colour,
#8a7a58** (`__CITY_VOID__`). The map's own rim is 571 mountain blocks, drawn as the same dark grid
as the streets, so the edge read as a ruled line.

## NOW (`__THE_VALLEY_HAS_AN_EDGE__`, city file)
- **The land goes on.** 200 blocks past every edge, two texels a block, each texel lifted by its
  height the way the iso camera sees it (nearest column along each view diagonal wins, one pass),
  drawn under the tiles with the tiles' own projection. One drawImage a frame.
- **The real ranges, on the map's own compass** (north is y = 0, the side the 15 comes up from;
  east is the town's side of the 15): the Spring Mountains west with Mt Charleston out past the north
  rim's west end (16 blocks of lift), the Sheep Range north, Frenchman east, the Black Mountains
  south; past the rim the ranges run NNE in bands with passes, basin and range.
- **The roads out:** every freeway run at the edge keeps going, meandering, with a cut through the
  ranges; the 15 (both ways), the 95 and the 93 carry shields. **Lake Mead** fills the low ground out
  past the corner the map's own mead sits in.
- **The near side is a slope, never a wall.** A slope at the camera's angle is seen edge-on, so
  land in front of the city is held under 0.38 of its distance; the far side stands tall.
- **No edge anywhere:** the picture fades into a seamless far tile laid under everything to any
  screen's edge; the map's outermost open blocks are dithered into the floor.
- **Names BB style:** the land scales with the zoom, the words do not; a name walks out along its
  edge until it is off the city and off every other name.
- **Off the main thread:** the bake is a worker (about 0.5 s there, 8 ms to land on the page);
  until it lands the old fill shows.

## CHECK
**THE VALLEY HAS AN EDGE**, new, 12/0, registered slow. Bare land past the map: **0.9%** (was 100%).
A fresh map paint 124.6 ms with the land, 120.2 without. Three other seeds bake with ranges, a lake,
the 15 and nothing on a block. Mutations, each red then restored: land off; near cap at the
camera's angle; the bake on the page; the lake unnamed.

## LEFT
- The map's own rim blocks still draw as the street grid (COOK/WORLD's tile, not this row).
- The moon zoom's REGION band still draws the valley flat (skyValley); it can take this picture.
