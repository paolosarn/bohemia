QUARTERMASTER 10/17 | cooking: the first lamp and the first wreck on the parts road | he owns: 83 tiles in 2 packs that match (69 approved, 14 never judged) | packs: 9. Abandoned cards 35/35; 18. Light sources and fire barrels 48/34 | nearest: 18. Light sources and fire barrels#0 56x96 approved; 9. Abandoned cards#1 96x58 approved | verdict: COMPOSE BESIDE IT (he owns both; his tile is the score) | index 55a49c3

# THE PARTS GRAMMAR: NO CHAT DRAWS A CURVE

COOK [the parts grammar], 10/11/26. Rule 108 ROUND EIGHT (a).

## WHAT RAN, FOR REAL, ON THIS MACHINE

| step | tool | what came out |
| --- | --- | --- |
| 1. the grammar | `banks/BOHEMIA_PARTS_GRAMMAR_10_11_26.json`, JSON, editable | 8 named parts, 34 shapes, sizes in the floor's pixels |
| 2. compose as SVG at 4x | this tool | rect, line and straight polygon only; a path, a circle, an ellipse, a gradient or a filter in the output stops the build |
| 3. rasterize | **resvg 0.44.0**, installed this round | 224x384 for the lamp |
| 4. shrink | Pillow `Image.BOX`, factor exactly 4 | 56x96 |
| 5. snap to his palette | nearest colour, NO dither, palette read off the twin | |
| 6. one pixel of contour | in the pipe, **not Aseprite** | |

## MINE AGAINST HIS, ONE RULER, BOTH WAYS

| | his lamp | my lamp | his wreck | my wreck |
| --- | --- | --- | --- | --- |
| painted pixels | 1766 | 586 | 3529 | 1571 |
| how full the box is | 33% | 11% | 63% | 28% |
| colours | 1521 | 5 | 2984 | 13 |
| the top eight carry | 9% | 100% | 8% | 99% |
| edge minus inside | -52.6 | -64.3 | -49.0 | -44.3 |
| the body's value | 49 | 51 | 51 | 49 |

## WHAT IT COSTS, SAID STRAIGHT

**His lamp arm is a curve and the law forbids drawing one, so mine is a staircase.** That is
the honest result of the round, not a detail. His wreck is a photograph of a dead car and
mine is a shape of one: he carries 2984 colours in his and the pipe lands 13 in mine, because
a flat-shape composition snapped to a palette has nowhere to get grain from.

So THIS ROAD IS FOR THE THINGS THE PACKS DO NOT HAVE. The lamp and the wreck are on the card
because he already OWNS both, and his own tile is the only honest score there is. The pack
card (10/11) found 210 of his packs never opened; rule 108e says stretch the packs first,
and that order still holds: cut his piece if it exists, compose only when it does not.

## WHAT THIS ROUND DOES NOT CLAIM

Aseprite is not on this machine and was not run. The artist's hand (indexed mode, orphan
strip, the eight-facing sheet) is PLUMBER [aseprite in the pipe]'s row and is OWED. The
contour here is the pipe's own, measured to the prop study's number, and the card says so.

## ROUTED

- **COOK TWO, COOK FOUR**: the grammar is at `banks/BOHEMIA_PARTS_GRAMMAR_10_11_26.json` and it is DATA. Add a part, fill a
  composition, run the pipe. Nobody writes a pixel.
- **PLUMBER [the art pipe gate]**: this tool is the first thing the gate can point at. The
  banned-token check on the composed SVG is in `to_svg()` and it stops the build.
- **PLUMBER [aseprite in the pipe]**: step 6 is waiting for you; the pipe hands you a
  palette-locked PNG at the floor.
- **DIRECTION**: the inks come from the twin, not from a mood. Swap the twin, get a new
  palette, same geometry.

## MEASURED THIS RUN

- **OK** NOT ONE PIXEL IS WRITTEN AS A NUMBER (rule 108a): the two assets are 34 shapes in a grammar file, composed as SVG and drawn by resvg 0.44.0
- **OK** THE SHRINK IS EXACTLY FOUR AND IT IS A BOX FILTER: 224x384 down to 56x96, never bilinear, never a fraction
- **OK** EVERY COLOUR ON BOTH IS ONE OF HIS: the palette is read off the twin itself and snapped with no dither
- **OK** BOTH CLEAR THE 96 FLOOR (rule 105): the lamp 56x96, the wreck 96x58
- **OK** THEY CARRY THE DARK CONTOUR 100% OF HIS OBJECTS CARRY: mine -64.3 and -44.3, his -52.6 and -49.0
- **OK** AND THE GAP IS MEASURED AND NOT HIDDEN: his lamp carries 1521 colours and mine 5, his wreck 2984 and mine 13
- **OK** IT IS ONE ROAD, PROVEN ON TWO THINGS HE ALREADY OWNS, so his own tile is the score
