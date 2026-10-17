# THE REGION: THE MAP AT BATTLE BROTHERS' SIZE, ROUND ONE (RUN, 10/16/26, [the map at Battle Brothers' size], rules 109, 110)

> **PAOLO 10/16:** *"our map has to be as big as fucking Battle Brothers and that's still not the case ... I don't know if
> we need to break the grid and have more grids ... I'm choosing Battle Brothers."*

## MEASURED FIRST
- **Ours:** the map's travel grid was the valley, 96 x 96 blocks (9,216). The camera's far stop fit the valley to the glass.
  But the map already PAINTED the land around it: the land painter (vbCore) runs 200 blocks past every rim, 496 blocks
  across, with the Spring Mountains, Mt Charleston, Lake Mead and the roads out. Nobody could walk on it, nothing lived on
  it, and the camera never pulled out far enough to see it.
- **Battle Brothers:** about 140 x 140 tiles (the game's world.nut SizeX/SizeY of 140, and a map tool counting 19,400
  tiles; community-measured, no official source found); the same size every campaign (a developer on Steam); about
  seventeen settlements (the wiki's Global Map). How many days a crossing takes was not found; it is owed (EYES [the map's
  four numbers], Grok ask 26).

## NOW (slices/bohemia_region.js, new; the map page loads it after its own script and wraps its functions by name, so the
## valley's own behaviour is byte for byte what it was)
- **TWO GRIDS, his words.** The valley keeps its 96 x 96 street grid. Around it, a REGION grid of the same blocks, 496 x 496
  (246,016), read off the land painter itself, which now hands over what each block is: open ground, a road out, rough
  (hills), or impassable (the lake, a peak).
- **HE WALKS OUT.** A tap past the valley names a region block; the route runs by cost over both grids (a road half an
  open block, hills 1.8), off the valley's roads and onto the region; each block costs the street's own rough-going time.
  The road's director still fires on the way out (a fight on the road), as in the valley.
- **PLACES ARE DESTINATIONS.** Twelve real places around Las Vegas, set by their real bearing from the city and pulled onto
  their road or open ground: Henderson, Boulder City, the Hoover Dam, the Lake Mead marina, Jean, Primm, Searchlight,
  Indian Springs, the Mt Charleston lodge, Pahrump, Moapa, Mesquite. Drawn with the map's own settlement art by tier
  (placeholders, rule 101), named without overlapping, and opened as the settlement screen on arrival like any other.
- **THE CAMERA PULLS OUT TWICE AS FAR AND PANS OVER THE REGION.** The first cut fit all 496 blocks to the glass and, on a
  phone held upright, the region became a thin strip in a sea of sand (looked at, rejected the same round). Battle
  Brothers' own camera shows part of its world and you pan, so the far stop shows 202 blocks across (the valley's old stop
  101; Battle Brothers' whole map is about 140 wide) and the camera pans to the region's rim. Past the old stop the land is
  painted without its haze (a second picture from the same painter); the old far stop keeps the hazed picture he liked
  (rule 104f). The near stop is unchanged.

## THE FOUR NUMBERS (rule 109c; printed by the check, R1 to R3)
| | ours | Battle Brothers |
|---|---|---|
| tiles across / in all | **496 / 246,016** (the valley alone 96 / 9,216) | about 140 / 19,600 |
| a crossing | **1.9 days** rim to rim on a road, **3.7** across open ground; the far places 0.9 to 1.9 days from the city | not measured yet |
| settlements | **26** (14 in the valley, 12 in the region) | about 17 |
| zoom | far stop **202 blocks** across the glass (pans over all 496), near stop **4.6** (a block at its art's own pixels) | not measured yet |

## WHAT IS LEFT ON THE ROW
- The land out there is the painter's backdrop: basin and range, the lake, the roads out. WORLD [the region] makes it the
  real region (the corridors, the towns' own ground, the fifteen terrains), and FACTIONS' bases and parties move out onto it.
- The places are destinations with nothing of their own yet (they open the generic settlement screen).
- Battle Brothers' crossing days and zoom stops are owed as numbers.
- The sight radius (rule 102d) and only-you-scale (102a, b) rows are the next on the map.

## CHECKS
THE REGION IS BATTLE BROTHERS' SIZE, new, 8/0, registered slow: R1 bigger than Battle Brothers' map; R2 the far stop
shows more than Battle Brothers' whole map and pans to every place, the near stop a block; R3 a crossing takes days (the real routes to the three farthest places, costed
the way a step is); R4 he walks out of the valley (a tap on a place, real steps out on the region, the clock moves); R5 a
place out there opens as a settlement; R6 the twelve places drawn at the far stop; R7 the valley's own journeys never leave
it; R8 nothing threw. Mutations, each red: the region not walkable (R3, R4, R5); the camera stopped at the valley (R2,
R6); a place not a settlement (R5).
