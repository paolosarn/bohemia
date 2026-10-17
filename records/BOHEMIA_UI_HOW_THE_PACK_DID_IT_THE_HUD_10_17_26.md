# HOW THE PACK DID IT: THE HUD (UI [one screen], 10/17/26; rule 100c, opens the round)

The bar on the map, the settlement and the fight is a board that holds paper. His packs hold that object many times over, so the
bar's twin is read from them before anything is laid. Read from the bank (banks/BOHEMIA_HD_TILE_REPO_part*.txt, lossless), the
never-judged packs included (the crack round's precedent, 10/16).

## WHAT HIS PACKS ALREADY HOLD
| what the HUD is | his tile | size | what it is |
|---|---|---|---|
| a board that holds papers (the bar) | 19. Signs and village boards #21 | 96x94 | a wooden notice board, two papers pinned on it |
| a board with a printed list (the readouts) | Signage, menus and cafe accessories #9 | 64x96 | a cafe menu board, white lettering on dark |
| a dark strip with lit readouts (the six on glass) | 6. Control panels and consoles #17, #18 | 96x36, 96x38 | a console strip, glass over lit gauges |
| a paper tag on a post (CREW, NOTES, LEAVE) | 19. Signs and village boards #27, #31 | 67x96, 79x96 | a paper sign nailed to a post; a chalk menu on an A-frame |

The cuts are in records/target/ui_one_screen/twin_*.png, lossless, not one pixel changed.

## THE NUMBERS (skills/bohemia-pixel-art/scripts/check.py, family prop, on his own tiles)
- THE NOTICE BOARD (#21): 5,823 colours, the top eight carry 2.6%; value span 225; saturation 0.53; LIGHT FROM ABOVE at 264
  degrees (270 is straight up); grain 1.77 px a run; stray pixels 8.6%; one pixel size; no banding. EDGE -54.5: a hard dark
  contour around the board, darker than the prop family's band (one of eight out, the pack's own habit on boards).
- THE MENU BOARD (#9): top eight 10.3%; span 147; saturation 0.10 (a near-grey board, the lettering is the light); light at
  253 degrees; grain 1.87; stray 10.7%; the same hard contour (-57.1).
- PAPER AGAINST BOARD, measured: the brightest tenth of the notice board's pixels (the papers) is 3.4 times the median (the wood);
  the menu board 3.9 to 1; the console strip's lit readouts 2.8 to 1 against its dark glass.

## WHAT THAT MEANS FOR THE ONE BAR
- THE SHAPE IS THE PACK'S: a dark board holding light paper. Our cardboard is the board, our receipt tags are the papers, the glass
  strip is the console. Every count and every word sits on paper or on lit glass, never printed straight on the board.
- PAPER 3 TO 1 OVER THE BOARD, at least: the pack puts its papers at 3.4 to 3.9 times the board's light; the gate reads the laid
  bar's tags against the cardboard beside them and refuses under 3 to 1. (The sun test, rule 73, already holds the words at
  4.5 to 1 on their own paper.)
- LIGHT FROM ABOVE: the pack lights every board from the top, a little left (253 to 264 degrees). The cardboard keeps its top
  highlight and its one-pixel foot shadow; the glass strip its inset top light.
- A HARD CONTOUR, NO GLOW: the pack rims every board in a dark line and casts no soft shadow. The bar keeps the one-pixel #000
  line under it and the tags keep a hard one-pixel drop; no drop-shadow blur anywhere (rule 71's defect class).
- GRAIN UNDER 2 PX: the pack's wood and paper grain runs 1.8 px; the materials' cardboard and receipt grain is drawn at 1 to 2 px
  (the generators in slices/bohemia_ui_materials.js), the same scale on the glass.
- ONE SIZE FOR A PRESS: the pack's paper sign on a post (#27) is 67 px wide, 22 points on his phone; a thumb needs 44 (rule 67a),
  so our tags are the pack's paper at a thumb's size, not the pack's paper at the pack's size. The six keep the pack's 96 px (the
  10/13 candidate's rule) because an icon is a picture, not a press.

## THE THREE DIFFERENCES TO NAME ON THE SHEET (rule 82)
1. The pack's board is wood with nails; ours is cut cardboard with its flutes along the foot. The tags are not pinned and sit
   straight (a pinned, tilted paper at 44 points would cover a man's head in the fight).
2. The pack's lettering is hand-drawn at 5 to 7 px on paper or chalk; ours is the game's CASING face stamped at 11 points,
   because every word must pass 4.5 to 1 in the sun and read at a glance.
3. The pack's board is one 96 px object; ours runs the whole glass, edge to edge, so the three screens share one bar and one
   corner for the big action (the speed pad, LEAVE, END TURN).
