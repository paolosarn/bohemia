# WORLD 11/2 round 3: THE MAP CLEANED UP: THE STREETS JOIN, THE FREEWAYS ARE FREEWAYS, IT SHARPENS TO ITS OWN PIXELS (ask line 285; BUILD 11/3i)

His words (Paolo 11/2, through the coordinator): 'I want the map graphic city shit to be cleaned up, the freeways look like freeways,
the streets transitioning to each other properly, better zoomed in... higher, like you can see more pixels... find out how other games
do it, they don't create a whole second underneath map, it just gets more detailed the more you zoom in.' Rules 300 and 301.

Everything measured on the demo at phone size (390 x 844, 3x) through tools/bohemia_drive_the_demo.js. Before = the committed code
(git stash), after = this round, same session settings, same spot: the I-15 spine where the 45th-row arterial passes under it
(block 51,45), the crew two blocks up the freeway, at three zooms (a block 25.6, 51.2 and 85.3 CSS px, the last the closest stop).

## HOW OTHER GAMES GET MORE DETAIL WITHOUT A SECOND MAP
- Web maps (Google, OpenStreetMap) and Google Earth: ONE world kept as a PYRAMID of the same picture, each level double the detail
  of the one under it, cut into tiles; the camera asks for the level that matches its zoom, nearest tiles first, and the coarser level
  shows until the finer one lands. Nothing switches mode; the world just sharpens.
- Every 3-D engine's MIP CHAIN is the same idea on one texture: the GPU picks the level whose texels match the screen's pixels.
- Pocket City 2 (his zoom reference, reference/pocket_city_2/): one camera over one city from a bench to the whole city, the same HUD.
- Battle Brothers' world map: one painted map at a narrow zoom range; it never zooms to street level, so it never needs more.
- So Bohemia's map was already the right kind: the painter's tiles at 36, 60, 96 texels a block over the whole painting
  (__ONE_MAP_AT_EVERY_ZOOM__, RUN 10/24). What was wrong: its top step stopped short of the screen's pixels, its tiles kept memory
  they never drew, and the painter drew only two street shapes.

## MEASURED BEFORE
- Pixels: at the closest stop (a block 256 device px wide) one texel spanned 2.67 x 1.33 device px: 1.78 device px a texel.
- Memory: the closest stop held 121 to 168 MB of tile pictures (13 to 16 tiles, each its whole 12 x 12 painted blocks with the 2-block
  margin it never draws, plus a lights canvas made in daylight); the middle zoom 104 MB. The budget said 28 MB; tiles on the glass are
  never let go, so it never bit. (A likely part of the iPhone-only brown town: the phone running out of picture memory.)
- Joins (gates/the_map_streets_join_gate.js reads the painter's own texels at the middle of every side of every street block): of
  10,042 sides on 2,515 street blocks, 496 BAD on 391 blocks: 443 a street's lanes running into a block (a bend, a T or a dead end
  painted as a four-way crossing, crosswalks to nowhere, no kerb on the closed side; or a dead end running its lanes off), 24 a street
  running into the freeway's berm, 14 the Strip's lanes into a block, 10 the Strip's sidewalk straight across a street's mouth, 5 a
  kerb across a join. Freeways: 162 places a street meets the freeway on both sides; 0 painted (the world rolled overpasses, t.xing,
  and the painter never knew); 0 ramps; no names on the city's freeways.

## 1. THE STREETS JOIN (__THE_STREETS_JOIN__, slices/BOHEMIA_CITY_WORLD.html)
- One reading shared by the painter and the gate: which of a street block's four sides JOIN something (a street, the Strip, a lot the
  street runs straight through, the freeway where the street passes under it, the valley's edge). The painter draws the shape the mask
  is: straight; crossing; T (a kerb and gutter on the closed side, crosswalks only across the arms that go on); BEND (the lanes and the
  yellow line turn on an arc about the inner corner, the outer corner a walk); END (a cul-de-sac: the lanes round a circle, a kerb all
  round); the Strip's MOUTHS (its walk opens where a street meets it, a zebra across the mouth) and a kerb where its run ends.
- Tiles take their masks from the whole valley (one read per seed, VB_STF), so a seam reads the same from both sides.
- AFTER: 0 bad of 10,042 sides. The old reading (inp.joinOld) still gives 496: the gate's mutation.

## 2. FREEWAYS LOOK LIKE FREEWAYS
- Every place a street meets the freeway on both sides is an OVERPASS (the freeway on its berm is the bridge, which is the I-15 and
  US 95 of Las Vegas): the berm is cut, the deck stands on its abutments with a parapet, the street runs at the ground under it
  with its yellow line and lane marks, the deck's lip dark over it, and the sun's sweep casts the deck onto the street. 162 of 162.
- RAMPS in the freeway blocks on either side of every pass: the outer 2.4 units peel off the through lanes behind a solid edge and the
  gore's chevrons, and descend from the deck to the street at the pass on a retaining wall with a guardrail; the through lanes keep
  to the middle (2 a way on a one-block freeway, 4 on the two-block spine). 317 ramp blocks, every one measured descending (the gate
  reads the height 2 and 10 units from the pass); none where the freeway is three blocks wide (the painter reads no run there). The world's over/under roll is not painted: on a freeway that stands on a berm the
  freeway is always the overpass.
- REAL NAMES: the city's own freeways carry the region's shield plates: I-15 on the spine every 18 blocks, US 95 on the cross-town
  row, 215 on the ring (vbFreewayNames, the layout's own fwyX, bendNorthY and the beltway blocks).
- Already there from COOK 10/25 and kept: lanes, dashes, shoulders, the Jersey barrier, the berm, the jam of dead cars.

## 3. MORE DETAIL UP CLOSE (__THE_MAP_SHARPENS_TO_ITS_OWN_PIXELS__)
- A fourth step of the same pyramid: 128 texels a block from 236 device px a block. At the closest stop ONE TEXEL TO ONE DEVICE
  PIXEL (2 x 1 px on the 2:1 diamond, 1.00 px a texel; was 1.78). The same painter, the same rolls: every house stands where it stood.
- MEMORY: a tile keeps only the 8 x 8 blocks it draws plus one texel of overlap (the margin's blocks are its neighbour's to draw), and
  its lights stay plain bytes until night first asks for them. Tile pictures at the closest stop 121 -> 51 MB; at the middle zoom
  104 -> 25 MB (same session, same spot).
- FRAME TIME: the sharper tiles cost this box about 17 ms more a frame (same-session A/B, 113 -> 130 ms median of 81 frames, a
  software canvas). Won back where it was wasted: once every tile the glass needs has landed and the glass is inside the valley, the
  soft whole painting under them is never seen and is no longer drawn. Closest stop now 100 ms median (old code 113); middle zoom
  111.6 vs 110.7 (same); far zoom unchanged.
- The tile overlap keeps the seams clean when the painting under them is skipped (a faint hairline, up to 18/255, without it).
- The closest stop itself did not move (a block 256 device px, O3 of the one-zoom gate); a closer stop would need 192+ texels a
  block, double this memory, and is the close-up layer's to decide (his call for later, the finish line stage 1 item 3).

## PROOF
- Shots (before | after side by side, three zooms): slices/vote/WORLD_THE_MAP_CLEANED_UP_Z0.webp, _Z1.webp, _Z2.webp.
- gates/the_map_streets_join_gate.js (in the suite as THE MAP STREETS JOIN), 6 of 6: J1 0 bad of 10,042 sides; J2 162 of 162 passes;
  J3 317 of 317 ramp blocks; J4 the old reading 496 bad, 0 passes; J5 128 texels a block, 1.00 device px a texel (the old top step
  1.78), 50.4 MB of tile pictures, the soft painting skipped 2 of 2 frames; J6 clean.
- Also green after this round: THE NEAR END IS THE BLOCK 7 of 7 (N3 now asks for the 128 step and waits up to 32 s for it: a 128 tile
  takes about 0.65 s in the worker, the 96s show meanwhile), THE MAP STANDS TALLER 26 of 26 (a place's patch out on the region keeps
  its whole picture: only the valley's grid tiles are cropped), THE MAP STANDS UP 13 of 13 (the ramps rise from the berm's own height,
  so its berm-cut mutation still bites), THE FAR END IS PAINTED 11 of 11, ONE ZOOM NO SECOND MAP MODE 12 of 12.

## LEFT
- The Strip and the arterials meeting the freeway at a knot (the four-way freeway interchanges) are untouched: a knot is a flyover.
- Sign gantries over the freeway lanes, and the alpha's old walk past the closest stop (rule 18g), not this round.
