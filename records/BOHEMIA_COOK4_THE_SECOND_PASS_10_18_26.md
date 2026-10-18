# COOK FOUR [the second pass], round 13 (10/18/26): THE FIVE TAN HOUSES ON THE FIGHT BOARD PASS DIRECTION'S CARD

Opened by the coordinator (rule 112), claimed first (d966d163, rule 5). The row: 'DIRECTION's card for the one
screen (pixel density, palette, light, outline) reads PASS on your house kit as it sits on the fight board ...
before and after at 1:1. CONSTRAINT: his approved pack skins only.' MODE: cook only (rules 100, 101, 108): a
PLACEHOLDER in VOTE, nothing to slices/, engine/ or the demo; the first-pass files are never edited (101c).

## WHAT SHIPPED

| thing | file |
|---|---|
| the second kit: the same five houses, same canvases, same doors and wall feet (COMBAT TWO's numbers hold) | reference/art_bank/settlement/COOK4_RANCH_PASS2_{PLAIN,GARAGE,CARPORT,WING,PORCH}.png |
| the sheet: the same spots of COMBAT TWO's small board before and after at 1:1, the whole board at the phone's 1,170 px, each house before and after at 1:1 with the man at the door, the twin, the card table, the seam numbers | records/target/COOK4_THE_SECOND_PASS.webp |
| every number below | records/target/COOK4_THE_SECOND_PASS.json |
| the tool (about two minutes; it re-measures his ring, re-cuts the fields and re-lays the board every run) | tools/bohemia_cook4_the_second_pass.py |
| the VOTE card | cook4-the-second-pass-10-18 (PLACEHOLDER, redoOf the tans family card he voted UP: 'That's way better holy shit') |

## HOW THE PACK DID IT (rule 100c)

DIRECTION's card (records/BOHEMIA_THE_CARD_OF_NUMBERS_10_10_26.md): his settlement pieces are lit from above (top
+8.8 over bottom, in 87%); 'a floor tile carries no light of its own; the scene lights it'; his buildings carry a
dark brown 1 px ring (median colour read here off 318 of his building pieces: (17, 14, 11)); 'seams: none you can
see ... cut the border, make the edge meet' (his walls meet at 0.44 of the inside, his roads at 2.0). The style
guide (records/target/BOHEMIA_STYLE_GUIDE.json): one sun (50 degrees up, 35 round), a cool sky so the shade is one
step down and walks cool, never black (fields 6, 7: the darkest pixel inside the ring at least 12); the contact
shadow black at alpha, at most 42 percent, edge 2 px, cast down and right (13); binary alpha on the body (9).

## WHAT WAS WRONG ON THE BOARD, AND THE FIX (nothing drawn rectangle by rectangle; his tiles cut and laid)

| | the first pass | the second pass |
|---|---|---|
| ROOF | every laid field tile brought its own ridge-cap row: a light line across every roof every 64 px, the seam across 4.08 times the inside, a painted light stroke for the ridge, a 2 px ring | the shingle core cut where the card's seam number is lowest (rows at a dark trough, three columns that meet each other, three windows laid in any order, never one twice running): seam 0.72 across, 1.03 down; his caps laid ONCE along the ridge; one 1 px ring |
| WALL | his plaster tile is lit inside itself, so the wall striped a tile tall (seam down 2.0 to 3.0) | the tile's own light flattened (row and column medians, the cracks kept), cut to meet, whole stone courses kept: down 1.57 to 1.69 |
| LIGHT | a brown sheet (20,14,10) laid over every shade: straight darkening; the left verge darker than the right with the sun upper left | one sun: the eave throws one hard shadow 0.87 m (49 px) down the wall from the guide's angle; left verge lit, right in shade; the back slope half a step (it faces the guide's sun nearly as much as the wall); shade walks the short way toward the sky (a tan falls 8 to 12 degrees), never blue |
| DIRT | none | his yard dirt (2. Soil and dirt tiles #3, the board's most-laid soil, hue 32 against the roof's 29 to 32) in the shingle grooves, thicker toward the gutter, in the groove's shade: the rest area the seams were faking, the roofs' top over their bottom with NO sun laid on the slope (searched from 0, it stops at 0.0), and the houses take the ground's colour |
| SHADOW | brown, alpha to 186: 18,409 to 31,459 px a house off the guide | black at most 42 percent, edge 2 px, down and right: 0 off |
| BLACK | his broken windows' rooms (0,0,0) on about 3,000 px a house | the deepest shade: his ring's brown walked cool, value 12 and up |

PIXEL DENSITY and PALETTE did not move: his 96 px pieces at 1:1, 57 px a metre; the valley's tans
(reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json).

## THE CARD, EACH HOUSE (the four the row names, 13 rows; the table is on the sheet)

| house | rows OK | top over bottom (>= -2.1) | edge (-48 to +1) | hue walk (D4, >= 8) | guide shadow px off | darkest inside |
|---|---|---|---|---|---|---|
| plain | 9 -> 13 | -3.3 -> +1.2 | -16.5 -> -16.7 | 6.4 -> 15.1 | 25,516 -> 0 | 0 -> 12 |
| garage | 11 -> 13 | -1.0 -> +8.0 | -7.2 -> -12.7 | 13.8 -> 14.7 | 31,023 -> 0 | 0 -> 12 |
| carport | 11 -> 13 | +8.8 -> +13.4 | -5.7 -> -13.5 | 9.6 -> 17.6 | 31,459 -> 0 | 0 -> 12 |
| wing | 11 -> 13 | -1.8 -> +1.3 | -7.2 -> -14.7 | 8.8 -> 11.5 | 18,780 -> 0 | 0 -> 12 |
| porch | 10 -> 13 | -2.8 -> +0.6 | -5.7 -> -6.1 | 16.1 -> 8.1 | 18,409 -> 0 | 0 -> 12 |

The rows: PIXEL one pixel size (D1 native 1) and the long side over his floor; PALETTE colours, top eight,
saturation, value span against his settlement band, and no red 96 px cell (N3's D2 and D5 against his ground
band, the church's cell check); LIGHT top over bottom, the hue walk, the guide's shadow, nothing black; OUTLINE the
edge in his band and the grain. THE CARD READS PASS on all five. The outline row was inside his band BEFORE too:
said, not claimed as a fix.

## THE BOARD (as it sits)

COMBAT TWO's small board laid twice in one process by its own untouched code
(tools/bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26.py: lay, one_look, swaps, moves, stamp,
composite), once with each kit (its kit path pointed at the new files; nothing of COMBAT TWO's written). The same
8 houses at the same places; 2,421,531 px changed, 0 of them outside the houses' own boxes. The rerun of the first
kit against COMBAT TWO's committed webp: mean difference 3.4 a channel, the webp's own loss.

## GATES

REFERENCE CHECK 494/0. ART 45 16/0. REUSE-FIRST: my tool passes (the 74 reds are older tools, unchanged).
NOT VIBE CODED N3: my new card passes (the gate's one red is other cards, my gas station, warehouse and school
among them, D5, named last round, never edited). VOTE TAB: the card's sha fills in the commit after this one;
the other red is two DYNASTY whys with no 'where', on main before me. Full suite unmeasured (rule 13).

## WEAK, SAID

- THE HOUSES GOT LIGHTER: mean value 78 to 84 became 84 to 90 (the dust is his light soil). His settlement pieces
  sit at 51 to 72 (the card's 'dark middle'); no judge row reads it. If he says they wash out, DUST_K in the tool
  goes down first.
- The porch's hue walk fell from 16.1 to 8.1 degrees: it passes by 0.1.
- The plain's and the porch's top sits over the bottom by only +1.2 and +0.6 (the card's floor is -2.1, the pack's
  median +8.8).
- The ridge caps read as a light dashed line along the top at 1:1: one row of his field's own caps, the only ridge
  piece the field carries.
- The dirt is one soil (#3) on every roof; a block on his darker soils (#18, #22) would want its own.
- MIXELS on the board are not mine: the pack cars and lamps at 2x on COMBAT TWO's 1x ground.

## FOR THE OTHER LANES

- COMBAT TWO: the second kit is a drop-in: point SET in tools/bohemia_combat2_the_five_houses_on_the_board_cook_10_18_26.py
  at COOK4_RANCH_PASS2_%s.png when he says so; canvases, doors, wall feet and drives are the first kit's to the pixel
  (asserted in my tool). Nothing of yours was written.
- DIRECTION: the plate's line check (PLATE_FIGHT_BLOCK, COOK FOUR's part) has its numbers: the card PASS on every
  house as it sits; the sheet is the before and after at 1:1.

## [bb research]

Battle Brothers draws a settlement as the town 'in one painted view' (reference/library/battle_brothers/10_UI_AND_FEEL.md),
so every building in it shares one light and one ground. That is what this pass gives the fight block: one sun on
every house and the board's own dirt on every roof, so the houses sit in the board instead of on it.

## ANALOG HORROR LINE

The rooms behind the broken glass are no longer a printed black: they are the deepest brown of the house, a room
you almost see into.

## REFERENCE CHECK (the 9/4 duty)

Compared to his pack house 5. Roof tiles #30 at 1:1 and 3x on the sheet, the man at 1:1 at each door, and the
same houses before at the same spot of the same board. Structure taken: his ring colour, his field and caps, his
wall, his soil; the card's numbers; the guide's sun and shadow. What changed: light, seams, dirt, outline and
shadow; no shape, no size, no colour family. No reference game.
