# THE TEXTURE SET: THE RUNWAY CLOTHES CUT INTO PIECES THE RIG CAN WEAR

CHARACTER, 10/17/26. [the texture set], rule 110's big swing (Paolo 10/16: '24 hours, take big swings').
Cook only (rule 100): nothing in this round touches slices/, engine/ or the demo; the formula is read,
never edited (rule 101c). The study page came first (rule 100c): records/BOHEMIA_HOW_THE_PACK_DID_IT_CLOTH_10_17_26.md.

## WHY
DIRECTION's master rig (564e1b1, records/BOHEMIA_THE_MASTER_RIG_10_16_26.md) renders a 3D model in eight
facings at 57 px a metre and will replace the formula one body at a time (rule 108 ROUND EIGHT b). It has no
clothes. Every garment this lane owns is a gen() that stamps pixels onto the formula's part grid, which a model
cannot call. The rig needs the clothes as PIECES with ATTACH POINTS, in the metres [the body in meters] measured.

## WHAT WAS BUILT
`tools/bohemia_cook_the_texture_set.js` opens the live alpha through the established driver and, for every
canon garment and every facing, draws the bare body and the body wearing that one garment with the engine's own
buildFrame(d,'idle',0). The garment is the pixels that changed; every changed pixel is looked up in the part grid
buildFrame returns (the same ruler the hem gate uses), and a pixel off the body (a brim, a coat skirt across the
leg gap) goes to the nearest bone and is COUNTED as overhang (8.4% of garment pixels). Each part's joint is
measured per facing as the nearest joint of its kind to the part's own pixels, because the formula swaps screen
sides per facing (ARMSIDE, the A/B legs); the joints are the posed skeleton of the same frame, read off posedSkel.

Output, `records/character/texture_set/` (not records/target: the site publishes that folder whole and PAGES
PUBLISH is already red on size; only the sheet is published):
- `manifest.json`: the ruler (57 px/m, the 112 box), the eight facings in the rig's order, per facing the ground
  row, the centre line (waC), every joint and which joint owns which part; per garment per facing every piece:
  part, joint, box in px, attach at the joint in px and metres, world metres (right of the centre line, UP from
  the ground); the round trip; the reads-under and shades-skin lists.
- `atlas_<layer>.png` and `parts_<layer>.png` for 12 layers: a row per garment, a column per facing, 112 px cells;
  the part map carries the part id per pixel, +64 for a pixel the garment paints on bare skin only, +128 where the
  garment removes a body pixel (a hat hides hair).
- `outfits/<id>.png`: the 25 shipped outfits (13 faction looks, 12 city cast) in eight facings, the formula's
  drawing over the rebuilt one over the diff.

| the set | number |
|---|---|
| canon garments | 352 |
| layers | 12 |
| pieces (garment x facing x part) | 10,659 |
| garment pixels | 1,900,438 |
| overhang pixels (off the body, given to the nearest bone) | 159,473 (8.4%) |
| garments that shade skin (paint bare skin only, over 5% of their pixels) | 95 |
| garments that read what is under them (the stack boots) | 8 |

## THE SHIP TEST, MEASURED THREE TIMES BECAUSE THE FIRST TWO WERE WRONG
The pieces are put back on the bare body in the formula's own layer order and compared pixel for pixel with the
formula drawing the whole outfit at once, for all 25 outfits in all 8 facings (200 views).

1. First cut: 68 of 200 pixel-exact, mean 29.5 px off, worst Church S 496 px. Looking at the picture: both
   sleeves of the rebuilt Church came out a lighter gold. A probe of the one pixel showed the shirt alone paints
   it right, the mantle alone leaves it skin, and the TROUSERS alone paint the bare ARMS (1,487 px changed by a
   pair of trousers, half of them on the sleeves). The formula shades skin under and around a piece, and that is
   not cloth; a decal on a model cannot know what is under it.
2. Second cut flagged skin shading only for garments above base and legs, so the trousers kept their sleeves:
   80 exact, mean 18.3, Church still 496. Wrong reference.
3. Third cut: every piece is cut twice, over the bare body and over a body dressed in the plain pieces (RED
   SHIRT, BLUE JEANS) minus the garment's own layer. A pixel painted on bare skin only is flagged 64 and the
   rebuild applies it only where skin still shows. **80 of 200 exact, mean 6.7 px off, worst Reds S 63 px, every
   remaining difference a colour at a seam between two garments (the limb-separation pass), none missing, none
   extra.**

The rebuild is at the MEDIAN body (no dials), because the rig's man is the median man; a look's dials are the
look's, not the cloth's.

## THE SHEET (VOTE: character-the-texture-set-10-17; records/target/character/CHARACTER_THE_TEXTURE_SET.png)
One row per faction look, every picture at the 112 box's own pixels: the formula; the pieces fanned out with a
red dot on each joint; put back, with the px-off count; DIRECTION's rendered man bare; the same man wearing the
pieces in S, E and N, each piece placed by its world metres on the rig's ground row and centre pixel, nothing
scaled. The twin is the rig's man (the packs hold no people: COOK [the two holes], 0 of 8,674).

LOOK LOG (rule 100, ROUND TWELVE): (1) at 1x the fanned pieces overlapped the row above by 14 px; the rows went
from 150 to 172 px. (2) The clothes sit about 16 px low on the rig's man in every facing: measured, the rig's man
renders 114 px tall where rig.json and the ruler say 98 for 1.72 m. Not placed by the head to hide it; placed by
the ground as rig.json says, and named below. (3) In E the rig's man is mid-stride, the formula's legs are still;
the trouser leg does not follow his stride. The rig's idle clip is the frame to fit, when it is rendered.
(4) The hair pieces are near-black on the dark sheet; readable at 1x, lost shrunk to 16 x 16. Left as is: the
sheet is for the pieces, not the hair.

## FOR DIRECTION (measured, not fixed here)
- `records/target/master_rig/man/rig_S.png` stands 114 px (rows 14 to 127) and N 124 px; rig.json says 98 px for
  1.72 m at 57 ppm. Either the z-stretch is applied on top of a model already scaled to 1.72 after the stretch, or
  the walk frame raises him. At 98 the clothes land; at 114 they sit at his hips.
- The manifest is the contract: a piece hangs from a named joint at `at_joint_m`, or stands in the world at
  `world_m` (x right of the centre line, up from the ground). Either way the rig needs the same fifteen joints the
  formula has, in metres, in its own rig.json; the names are the formula's (neck, shL, shR, elL, elR, handL,
  handR, waA, waB, waC, knA, knB, footA, footB, headTop).
- Pixels flagged 64 are skin shading: a lit tone the formula paints on bare skin beside a piece. On a model that is
  light, not paint; skip them.

## THE GATE
`gates/the_texture_set_gate.js` 8/0, no browser (the self-built-door count does not grow): the ruler, the eight
facings, every piece's joint, every piece's metres recomputed from its pixels, the round trip under a 40 px mean
floor, every canon garment on the rail (read off the alpha's source) present in the set, every atlas a real PNG of
the size the manifest says, the skin-shading list present. A planted set with a wrong ruler, bad metres and a
failed round trip is refused before the real one is trusted.

## WHAT THIS IS NOT
Not a repaint. The pieces carry the formula's paint (9 colours, 5 value bands a piece; his pack cloth carries
2,459 and 15, the study page). COOK THREE owns the paint layers (rule 87); when the repaint lands, the same tool
cuts it into the same pieces with the same attach points, because nothing in the cut reads a colour. Placeholder
until his FINAL (rule 100e).

## TAB
VOTE. The card is character-the-texture-set-10-17.
