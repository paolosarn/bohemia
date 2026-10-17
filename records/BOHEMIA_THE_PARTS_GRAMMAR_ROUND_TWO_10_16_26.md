QUARTERMASTER 10/17 | cooking: guns and lamp posts for the parts road | he owns: 88 tiles in 2 packs that match (71 approved, 17 never judged) | packs: 12. Weapons and supplies 40/37; 18. Light sources and fire barrels 48/34 | nearest: 12. Weapons and supplies#6 96x78 approved; 18. Light sources and fire barrels#3 57x96 approved | verdict: COMPOSE BESIDE IT (he owns both; his tile is the score) | index 55a49c3

# THE PARTS GRAMMAR, ROUND TWO: THE GUN, THE LAMP POST, AND HIS OWN GRAIN IN MY SHAPES

COOK, the BIG SWING of 10/16 (rule 110). Rule 108 ROUND EIGHT (a) and ROUND ELEVEN. Round one: `records/BOHEMIA_THE_PARTS_GRAMMAR_MEASURED_10_11_26.md`.

## WHAT ROUND ONE LEFT, IN ONE NUMBER

His lamp carried 1,521 colours and the composed one 5; his top eight colours carried 9% of the tile and
mine carried 100%. A flat shape snapped to a palette has no grain. The round said grain could only be
composed as shapes, which is drawing pixels again. **This round found the one source of grain the law allows: his own tile.**

## THE NEW STEP: A MATERIAL IS A PATCH CUT FROM HIS TILE

Rule 108 ROUND ELEVEN: find the pack piece and use it, "cut, layered or shade-remapped". Each ink role
(steel, mid, wood, glass, lit, shade) is now a **patch cut from the twin** (16x16 where his surface has room, else 12, else 8), picked by the job it has to do:
the patch whose mean value is nearest the role, with the most distinct colours in it (grain), and a value spread
under 40 so a patch that straddles an edge is not taken for a surface. The patch is laid as an SVG pattern that
tiles on the 4x grid, so after the box shrink by exactly four **his pixels land back at one-to-one inside my shapes**.
Light and shade are flat squares at partial opacity laid over the material, never a gradient. The result is snapped
to the twin's FULL colour set, no dither, and the tool proves as a set that every colour is one of his.

The grammar records the exact crop of the exact tile each part wears, so a modder can read it:

| asset | twin | steel | mid | wood | glass |
| --- | --- | --- | --- | --- | --- |
| pistol | `12. Weapons and supplies#6` | [75, 57, 16, 16] | [68, 24, 16, 16] | [66, 43, 16, 16] | [69, 17, 16, 16] |
| revolver | `12. Weapons and supplies#8` | [4, 51, 16, 16] | [31, 19, 16, 16] | [7, 41, 16, 16] | [41, 16, 16, 16] |
| smg | `12. Weapons and supplies#11` | [24, 10, 16, 16] | [13, 20, 16, 16] | [11, 27, 16, 16] | [14, 20, 16, 16] |
| lamp_post | `18. Light sources and fire barrels#3` | [30, 27, 16, 16] | [30, 27, 16, 16] | [30, 44, 16, 16] | [30, 27, 16, 16] |
| lamp_post_hung | `18. Light sources and fire barrels#2` | [15, 31, 16, 16] | [8, 28, 16, 16] | [19, 45, 16, 16] | [8, 28, 16, 16] |

## WHAT RAN, FOR REAL, ON THIS MACHINE

| step | tool | note |
| --- | --- | --- |
| 1. the grammar | `banks/BOHEMIA_PARTS_GRAMMAR_10_16_26.json`, JSON, editable, supersedes v1 | 23 parts, 98 shapes, 5 compositions, 2 routes |
| 2. compose as SVG at 4x | this tool | rect and straight polygon only; a path, circle, ellipse, gradient, filter or text stops the build; an image not cut from the twin stops the build |
| 3. rasterize | **resvg** via resvg-py 0.5.0 (the binary from round one did not survive the fresh container) | 384x312 for the pistol |
| 4. shrink | Pillow `Image.BOX`, factor exactly 4 | |
| 5. snap | FLAT: 24 colours by median cut off the twin. MATERIAL: the twin's full colour set | no dither on either |
| 6. one pixel of contour | in the pipe, **not Aseprite** | |

## MINE AGAINST HIS, ONE RULER, BOTH ROUTES

| asset | | his | flat (round one) | material (new) |
| --- | --- | --- | --- | --- |
| pistol | colours | 2796 | 9 | 752 |
|  | top eight carry | 14% | 100% | 24% |
|  | edge minus inside | -49.4 | -51.6 | -49.9 |
|  | value steps of 16 | 16 | 6 | 13 |
|  | painted pixels | 3944 | 3975 | 3975 |
| | colours not his | 0 | 7 | **0** |
| revolver | colours | 2021 | 11 | 674 |
|  | top eight carry | 15% | 100% | 33% |
|  | edge minus inside | -47.2 | -37.0 | -36.5 |
|  | value steps of 16 | 16 | 4 | 14 |
|  | painted pixels | 2858 | 2985 | 2985 |
| | colours not his | 0 | 6 | **0** |
| smg | colours | 1853 | 15 | 573 |
|  | top eight carry | 15% | 99% | 35% |
|  | edge minus inside | -41.5 | -33.9 | -38.8 |
|  | value steps of 16 | 16 | 3 | 11 |
|  | painted pixels | 3169 | 2620 | 2620 |
| | colours not his | 0 | 5 | **0** |
| lamp_post | colours | 1651 | 7 | 322 |
|  | top eight carry | 7% | 100% | 43% |
|  | edge minus inside | -57.5 | -60.1 | -74.6 |
|  | value steps of 16 | 16 | 6 | 15 |
|  | painted pixels | 1970 | 1267 | 1267 |
| | colours not his | 0 | 6 | **0** |
| lamp_post_hung | colours | 1929 | 8 | 278 |
|  | top eight carry | 4% | 100% | 46% |
|  | edge minus inside | -53.7 | -59.4 | -66.3 |
|  | value steps of 16 | 16 | 5 | 14 |
|  | painted pixels | 2125 | 1233 | 1233 |
| | colours not his | 0 | 7 | **0** |

## WHAT IT STILL COSTS, SAID STRAIGHT

- **THE PISTOL**: his trigger guard is a curve; mine is a square U.
- **THE REVOLVER**: his guard and his cylinder are round; mine are a square U and a ribbed block.
- **THE SMG**: his guard is a curve; mine is a square U.
- **THE LAMP POST, straight arm**: his finial is a ball; mine is a square. The arm is straight on both.
- **THE LAMP POST, lantern hung**: his finial is a ball and his cage bows; mine are square and straight.

The grain is his now. The FORM is still a shape composition, and the 2x strip on the card shows it. His colour
count is still above mine on every asset because he painted every pixel and I tiled a few patches of
them. This road is for the things the packs do not have (rule 108e: stretch the packs first); the five
here are things he owns, because his own tile is the only honest score.

## WHAT THIS ROUND DOES NOT CLAIM

Aseprite is not on this machine and was not run; the artist's hand (indexed mode, orphan strip, the eight-facing
sheet) is PLUMBER [aseprite in the pipe]'s row and is OWED. None of the five is final; nothing is final before his
moodboard (rule 108 ROUND THIRTEEN). Nothing went to slices/, engine/ or the demo (rule 100a).

## ROUTED

- **COOK TWO, COOK FOUR**: the grammar v2 is DATA at `banks/BOHEMIA_PARTS_GRAMMAR_10_16_26.json`; the material step means a kerb or a wall composed from
  it wears the pack's own concrete or brick. Add a part, name the twin, run the pipe.
- **COMBAT / UI [the inventory]**: the bag's 310 icons want guns the pack does not have; the question on the card (B) is that.
- **PLUMBER [the art pipe gate]**: the banned-token check and the image-provenance check are both in `to_svg()`.
- **PLUMBER [aseprite in the pipe]**: step 6 is still yours.
- **DIRECTION**: swap the twin, get a new palette AND a new material, same geometry.

## MEASURED THIS RUN

- **OK** THE QUARTERMASTER LINE OPENS THE PAGE AND THE CARD, read from the index by tools/bohemia_quartermaster_line.py, not typed
- **OK** NOT ONE PIXEL IS WRITTEN AS A NUMBER (rule 108a): five assets are 23 parts and 98 shapes in a grammar file, composed as SVG and drawn by resvg; the only images in any SVG are patches the composer cut from the composition's own twin
- **OK** THE SHRINK IS EXACTLY FOUR AND IT IS A BOX FILTER on all ten renders
- **OK** ALL FIVE CLEAR THE 96 FLOOR (rule 105): pistol 96x78, revolver 96x70, smg 96x62, lamp_post 57x96, lamp_post_hung 41x96
- **OK** EVERY COLOUR ON THE MATERIAL ROUTE IS ONE OF HIS, AS A SET TEST: colours not on the twin = pistol 0, revolver 0, smg 0, lamp_post 0, lamp_post_hung 0
- **OK** ALL TEN CARRY THE DARK CONTOUR 100% OF HIS OBJECTS CARRY (edge minus inside at or under -20): pistol flat -52 / material -50, revolver flat -37 / material -37, smg flat -34 / material -39, lamp_post flat -60 / material -75, lamp_post_hung flat -59 / material -66
- **OK** THE MATERIAL STEP CLOSES THE GAP ROUND ONE MEASURED, ON EVERY ASSET: top eight carry pistol flat 100% -> material 24% (his 14%), revolver flat 100% -> material 33% (his 15%), smg flat 99% -> material 35% (his 15%), lamp_post flat 100% -> material 43% (his 7%), lamp_post_hung flat 100% -> material 46% (his 4%)
- **OK** AND THE COLOUR COUNT COMES UP WITH IT: pistol flat 9 -> material 752 (his 2796), revolver flat 11 -> material 674 (his 2021), smg flat 15 -> material 573 (his 1853), lamp_post flat 7 -> material 322 (his 1651), lamp_post_hung flat 8 -> material 278 (his 1929)
- **OK** THE GAP THAT IS LEFT IS MEASURED AND NOT HIDDEN: the form is still a shape composition (the guard is a square U, the finial a square), and his colour count is still above mine on every asset
