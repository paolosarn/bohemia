# COOK FOUR: HOW THE PACK DID IT, the places family (rule 100c), 10/10/26

Read from his purchased tiles: the 318 settlement pieces in reference/art_bank/settlement (roof tiles, walls,
windows, ruined parts, fences, stalls, tents, scrap panels, rubble). Measured by script, numbers are medians.

- PIXEL DENSITY: a piece is 92 x 92 (rule 105's floor: 96 on the long side). A whole house (5. Roof tiles #30)
  is 82 x 96: the roof is ~half its height, the wall the other half. Nothing is scaled up; detail is native.
- PALETTE: NOT a limited palette. Median 3,596 distinct colours per piece (fewest 891). The pack is painted
  with soft ramps and anti-aliased highlights; a 6-step ramp of ours will band beside it.
- LIGHT: from above. Top half of a piece is +9.3 luminance over the bottom half; left vs right only +1.9,
  so the sun is overhead-front, not a side light. Under an eave the wall is in shade.
- OUTLINE: every piece has a dark outline: the edge pixels average 0.24 of the piece's mean luminance.
  Brown-black, never pure black, 1 px.
- VIEW: THE PACK NEVER DRAWS A ROOF PLAN. Houses are front gables: the two roof slopes seen edge-on from the
  front, the barrel tiles stacked toward the ridge, the gable end facing you; roof-only pieces (#10, #11) are
  the same gable without a wall, so a wall under one makes a house. This is his 10/10 note answered.
- CLUSTERS: big readable clusters (each clay barrel tile is a 10-14 px shape with its own highlight and its
  own shadow); no single-pixel noise; dither only in rust and grime.
- HOW A PIECE MEETS ITS NEIGHBOUR: buildings are not tiles, they are standalone sprites on magenta with a soft
  ground contact; walls (#wall tiles) are tileable side by side with the seam hidden in a mortar line.

THE PROOF TILES: 5. Roof tiles #10, #11, #30, #31; Wall tiles (1) #0; 5. Windows and broken glass #0;
4. Doors and entrances #2.  DIRECTION's card of numbers may take these lines as they are.
