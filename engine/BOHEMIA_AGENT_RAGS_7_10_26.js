// BOHEMIA — AGENT RAG OUTFITS (7/10/26)
// tints sampled from the categorized world tiles (BROWN+NEUTRAL families, dark band)
// format matches G.tints exactly: {jacket,shirt,pants,shoes:[r,g,b]}
// apply via existing tintRamp() — luminance preserved, outlines untouched
const AGENT_RAG_OUTFITS=[{"jacket": [72, 57, 28], "shirt": [51, 47, 44], "pants": [52, 35, 20], "shoes": [42, 36, 27]}, {"jacket": [36, 32, 31], "shirt": [51, 47, 44], "pants": [76, 76, 75], "shoes": [57, 53, 49]}, {"jacket": [53, 51, 48], "shirt": [56, 42, 20], "pants": [37, 35, 33], "shoes": [49, 47, 45]}, {"jacket": [60, 39, 28], "shirt": [60, 58, 56], "pants": [94, 87, 85], "shoes": [53, 51, 48]}, {"jacket": [41, 40, 39], "shirt": [83, 30, 17], "pants": [40, 38, 37], "shoes": [49, 43, 51]}, {"jacket": [72, 57, 28], "shirt": [70, 56, 38], "pants": [55, 55, 54], "shoes": [49, 47, 45]}, {"jacket": [69, 61, 48], "shirt": [92, 64, 28], "pants": [69, 61, 48], "shoes": [37, 35, 33]}, {"jacket": [59, 55, 61], "shirt": [53, 51, 49], "pants": [42, 40, 37], "shoes": [48, 52, 55]}];
// agents roll one at spawn: G.tints=AGENT_RAG_OUTFITS[rng*8|0]
