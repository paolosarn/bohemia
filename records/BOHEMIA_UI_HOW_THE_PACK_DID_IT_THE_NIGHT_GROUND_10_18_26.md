# HOW THE PACK DID IT: THE GROUND, AND WHAT HAPPENS TO IT AT NIGHT (UI, 10/18/26, ui-opus-f)

Rule 100(c): no drawing before the page. Row: UI [the line on a ground] THE-COMPANY-STANDS-ON-SOMETHING (a camp at night
behind the two lines, the hall's floor, from the approved packs). Read from his purchased tiles in
banks/BOHEMIA_HD_TILE_REPO_part*.txt (keyed by pack and index), measured, not eyeballed. Contact sheets were made at 1:1
in the session's scratch and are not kept; the numbers are.

## The families read

| pack | tiles | what it is |
|---|---|---|
| 2. Soil and dirt tiles (part 4) | 24 | plain dirt, dirt with flower borders, dirt with stones, ploughed rows |
| 2. Dirt path tiles (part 3) | 48 | path shapes on a transparent ground |
| 7. Burnt ground tiles (part 2) | 28 | scorched earth |
| 8. Burned Ground and fire marks (part 3) | 40 | decals: scorch stars and ember pits |
| 1. Cracked contrete tiles (part 2) | 45 | bevelled concrete slabs, cracked, some with weeds or paint |
| 14. Camp and tents (part 4) | 35 | tents, fires, stools, barrels (fantasy medieval: snowflake banners) |
| 18. Light sources and fire barrels (part 3) | 48 | lamps, lanterns, burning drums |

## Pixel density and size

- Every ground tile is a 96 px master (the bank's own cap, 'crisp pixel-art at TV scale'); the plain dirt is 92 to 96
  wide because its edge is irregular.
- The tiles are FRAMED ISLANDS, not seamless: 89 to 93 percent opaque, a rim of about 4 px of broken edge, the left and
  right columns differing by 27 to 47 in mean value. Laid edge to edge they show their rims as a grid (on the concrete
  slabs that grid IS the look: a sidewalk; on dirt it is a fault).

## Palette and count

- HD painted, not a limited palette: 3,171 to 5,945 distinct colours in one plain dirt tile, 3,000 to 4,000 in a burnt
  one. A colour cap per asset (rule 114a) cannot be read off these; their discipline is in the ramp, below.
- THE RAMP HUE-SHIFTS, and the direction depends on the family. Plain dirt: the darkest tenth sits at hue 23 to 28
  (redder) and saturation 0.59 to 0.65, the lightest tenth at hue 28 to 34 (yellower) and 0.42 to 0.59: darks redder
  and richer, lights yellower and paler, 5 to 8 degrees. Dirt path: the other way round, olive darks (42,36,15, hue 47)
  under orange lights (190,152,106, hue 33). Burnt ground: warm grey lights (hue 38 to 39) over darks that go to black.
- THE PACK LETS ITS DARKEST GO TO BLACK on burnt ground (1 to 4 in every channel) and in the ember pits' cores. Our
  bible is stricter (shadows never black, rule 114a): the night ramp's darkest step is 5,7,13.

## Light direction

- Almost none on the ground. Plain dirt's top third is 0.662 in value against 0.647 at the foot; left and right are
  equal within 0.01. The ground is lit flat, from above; the direction lives in the props (their shadows fall down and
  right) and in the slab bevels (lit top, dark foot).
- THE PACK HAS NO NIGHT. Every ground tile is lit by day. Its night comes only from its light props (the lamps and the
  burning drums carry their own yellow), which are props and so are the rig's, not the pack's (rule 115a).

## Outline, dither, clusters

- No outline on ground. The texture is clusters of 2 to 4 px pebbles and cracks; the mean step to the right-hand
  neighbour is 10.6 to 13.8 in value on plain dirt, 21 on the dirt path (twice as busy), 14 to 18 on burnt ground.
- No ordered dither inside a tile; the grain is painted. Where light falls off (the ember pits) it falls off in painted
  rings, not in a smooth gradient.

## How a tile meets its neighbour

- Dirt: it does not; each tile is an island with its own rim. To lay a field the interiors are cut (8 px in from every
  side, 76 to 80 px squares) and set in a brick bond so no seam runs straight for more than one tile, two or more
  variants, never the same tile beside or above itself, no run over four (rule 114a).
- The plain dirt runs 0.66 to 0.71 in value tile to tile; laid side by side that difference reads as patches, so each
  interior is brought to the set's middle value before it is lit. The texture inside each is untouched.
- Concrete: laid as the pack draws it, slab to slab with the bevels, because the grid is the thing (a sidewalk).

## What the cook does with this (and does not)

1. RE-LIGHT, NEVER REDRAW, NEVER DARKEN. His tile keeps its texture (the luminance of every pixel); its daylight is
   replaced by a night ramp. Two ramps, each read off its own colours: the MOON, cold blue darks to a warm dust grey
   (hues 225, 228, 240, 264, 20: about 155 degrees round the wheel through violet), and the LAMP, red brown to sodium
   amber (13, 21, 27, 32, 36: 23 degrees). Straight darkening (the same hue at a lower value) is the tell rule 114
   names fourth; this is its opposite.
2. THE MATERIAL'S OWN COLOUR SURVIVES BY THE LIGHT: 15 percent in moonlight, 80 under the lamp (a night eye loses
   colour first).
3. ONE LIGHT, IN STEPS: the lamp's pool in five rings with a 4 x 4 ordered dither where two meet, because the pack's own
   falloff is painted rings and our law bans the gradient.
4. NOTHING FROM THE PACK'S PROP FAMILIES: the camp's tents and fires are fantasy pieces and props are the rig's (rule
   115a). The camp's things are the rig's truck (DIRECTION), lamp, sandbags and tyres (COOK), at one pixel to one pixel.

## [bb interface]

How Battle Brothers draws the ground under its character screen is not in our library, so this page copies nothing of
it. The company is ours to show on the ground it camps on; the pack is how that ground is made.

## Analog horror line

The pack's ground is a sunny game's ground. At night, under the one lamp a dead city still powers, it becomes ours.
