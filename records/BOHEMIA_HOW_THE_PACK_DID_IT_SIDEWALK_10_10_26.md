# HOW THE PACK DID IT: THE SIDEWALK AND THE ROAD (COOK TWO, rule 100c, 10/10)
Read from his purchased tiles: '1. Cracked contrete tiles' (45, all UP) and '1. Cracked street tiles' (36, 34 UP; 24 and 25 the drain covers DOWN).
- PIXEL DENSITY: a tile is 96 x 94 (slab) / 92-94 x 96 (road); four slabs a tile, so a slab is ~45 px. A sidewalk slab is 1.5 m, so his ground is ~30 px a metre (the fight board draws 42.9).
- PALETTE: painted, not indexed: 4,249 to 4,849 colours a tile. There is no small palette to match; match his values instead (slab inside lum ~330 of 765, road ~190).
- LIGHT: from the top. The top half of a slab tile is 13 to 25 lum brighter than the bottom; every slab carries a lit row on its top edge (lum ~410-500) and a dark south face along its bottom (6-7 px, lum 0-160): the slab is drawn raised, seen from the south, which is our 45 degree view.
- OUTLINE: a baked dark ring on every tile: 4 px top, left and right, 7 px bottom on the slab (the south face), 5 top and bottom and 4 at the sides on the road. THIS IS WHY TILES SHOW BORDERS (rule 104b): two of his tiles laid edge to edge put two dark rings side by side. Cut per side, measured, the seam step falls to the size of a step inside a tile.
- DITHER AND CLUSTERS: no dither; texture is drawn cracks and joint grooves 2 px wide, cracks running from joint to joint (DIRECTION round three: 'his slabs crack along the joints').
- HOW A TILE MEETS ITS NEIGHBOUR: it does not; every tile is a framed card. Joints sit at 45-48 px on both axes, so a cut centred on the joint lines the joints up across tiles.
- WHAT IS NOT IN THE PACK: no kerb, no corner, no curb return in either pack. A corner is BUILT from his pixels (his slab's lit row as the kerb lip, his road's darkest twentieth as the shadow).
- NEVER flip a slab top-to-bottom: the light and the south face go upside down. Left-right only.
