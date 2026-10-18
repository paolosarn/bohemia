# THE MARKS ON THE BOARD (COMBAT, 10/18, [the marks on the board])

THE ROW (rule 88, LOOKS FIRST; rule 87, the revamp: 'like a seventh grader is making my game'): everything the fight
draws ON the board itself is COMBAT's canvas, not an asset: the ring under every man, the lit tiles of his reach and
path, the picked-tile box, the aim line and the hit-chance tag. Measure each on the phone's glass, then redraw them in
UI's materials and the analog horror bible, never a new feature and never a new number. Rule 89: one before and after
of the SAME frame at one art pixel to one phone pixel.

Also read and followed: rule 46f (10/1, NOTHING ON THE GROUND THAT IS NOT THE GROUND: no pads or ovals; reach lights
the square tile in the ground's own colour), DIRECTION's fight verdict 23 owner line for COMBAT ('the gold rings to a
thin dark contact shadow'), rule 114 (the style guide's UI field: no gradient, blur or glow, the palette's ramps, the
1 px UI dark), rule 115f (his 10/17 NO on the coloured outline round people), rule 117 (fewer marks, one clear next
thing).

## MEASURED BEFORE (slices/BOHEMIA_FIGHT.html at 0e4552c1, phone 390 x 844 at 3x, seed 5, suburb)

| mark | how it was drawn | colour | sat / value |
|---|---|---|---|
| ring under every man | anti-aliased ellipse stroke, 2.3 CSS px, over a 42% black fill | gold #b0925e / red #a65a46 | 0.47/0.69, 0.58/0.65 |
| second ring on the man acting | anti-aliased ellipse stroke, 1.18x wider | rgba(240,210,150,.85) | |
| the man acting | 2 px stroked rectangle | #f0d296 | 0.37/0.94 |
| his reach | a see-through wash on every tile | rgba(217,168,90,.16), ZOC tiles rgba(200,110,70,.18) | |
| their melee rings (rule 103) | a red wash on all eight tiles AND a dashed 2.5 px box, per man | rgba(196,85,63,.2) + #e8684c | 0.67/0.91 |
| a man he can hit | a red wash at 42% and a 2.5 px stroked box | #ec6246 | 0.70/0.93 |
| the walk | one straight anti-aliased line, tile centre to tile centre | rgba(240,210,150,.9) | |
| the aim | four stroked corner brackets drawn OVER the man | #e0604a | 0.67/0.88 |
| your line (deploy) | a wash on both columns + a 2 px gold frame | rgba(240,196,110,.2/.32), #f0d296 | |
| the drag | green or red wash + stroked box + a dashed box | | |
| the hit-chance tag | NOT on the board any more: it is on the STRIKE square in the bar (39%) | | |

THE READINGS (the gate's own instrument, the same frame drawn with and without the marks):
31 stroked lines and 8 dashed boxes per frame; the marks added 0.73% of the glass in pixels of chroma over half (the
loudest thing on the board, verdict 22); every reach tile tinted (+14 of colour out of 255 in its middle).

## WHAT THEY ARE NOW

Three materials, one meaning each, laid cell by cell on the grid the people are drawn at (one CSS pixel, three device
pixels on his phone), never a stroked curve, each with a hard one-cell ink shadow to the lower right (the light comes
from the upper left, the style guide's field 6). Colours from records/target/BOHEMIA_STYLE_PALETTE.json.

- CHALK (clay_bone #efe9ca, a run here and there worn to #b8a886, broken where chalk breaks) = WHERE YOUR MAN CAN GO:
  one line round his whole reach; your line while you set it (one plain box round both columns); a chalk dot on every
  free tile once you pick a man; the walk he is about to take as chalk dots from his feet, ending in his ring drawn in
  chalk where his feet will be.
- His reach is also LIT IN THE GROUND'S OWN COLOUR (rule 46f): +16 on every channel of every reach tile, the same
  colour a step up, the one light that is not paint (a screen blend at 40 was tried and turned the asphalt milky).
- GAFFER TAPE (tape_grey #cac9c1) on a tile's four corners = THIS MAN: the one acting, the one you picked, the tile a
  dragged man may land on; the way a stage marks where an actor stands. Masking tape was tried first and dropped: its
  #c2a878 is the sand's own #b09060 and it vanished.
- RUST PAINT (clay_rust #9a4f2c / #c48454) = THEIRS: the ring a melee man of theirs holds, hatched one stroke every six
  cells and fixed to the ground (all their rings one patch with one painted edge, not a box per man); rust corners on a
  man you can hit; a painted X flat on the ground under the man you are about to swing at, its arms out past his body;
  rust corners on the man of theirs who is acting; rust corners on a tile a dragged man may NOT land on.
- UNDER EVERY MAN: only his contact shadow, laid in cells (42% black, the style guide's one allowed partial alpha). No
  side colour round him. Whose turn it is and whom you can hit are on the tiles.
- The blow ripples step on the beat's keys (six steps over two beats) as pixel rims, never a smooth swell.
- The bars over a man sit on whole pixels (no soft edge).

Removed, one mark per meaning (rule 117): the second ring on the man acting (the tape says it), the side-coloured ring.

## MEASURED AFTER (the same frames)

0 stroked lines and 0 dashed boxes; the marks add 0.000% of the glass in loud pixels; inside his reach a tile's middle
is 16 lighter and gains no colour (-0.x). Loud pixels in the whole board fell from 2.11% to 1.02% walking and 2.21% to
1.16% aiming (the rest is the orange roofs, the deploy frame's 1.04% baseline). 0 page errors, upright, sideways, on a
laptop, by day and at night.

## THE WORDS (rule 117: fewer words; they named marks that are gone)
- DEPLOY: 'Drag a man inside the chalk. Kept for the next fight.' (was 87 characters and clipped sideways at
  844 x 390, 'FIGHT when / ready.'; the button already says FIGHT)
- the pick: 'RAUL: tap a chalk dot, or drag him.'; outside: 'Only inside the chalk.'
- the walk: 'Tap inside the chalk to walk. Tap a marked man to hit.'
- kept: 'Your line, as you left it. FIGHT when ready.' (THE FORMATION IS KEPT reads 'drag a man', 'kept for the next
  fight' and 'as you left it'; all three stay)

## THE GATE (THE REBUILT FIGHT PLAYS, three new legs on the first finger walk)
1. THE MARKS ARE LAID, NOT STROKED: no stroke and no dash on the board past the ground's own grid.
2. no mark is loud: the marks add no pixel of chroma over half.
3. his reach is lit in the ground's own colour: a tile's middle is lighter and gains no colour.
Control, the same instrument on the fight before this round: 31 strokes, 8 dashes, 0.73% loud, +14 colour: red on all
three. After: 0, 0, 0.000%, +16 light and no colour: green.
The leg 'the board says it: the melee man's ring is lit as his' read the old red dashed box; it reads the rust hatch now.

## THE CARD
VOTE combat-the-marks-on-the-board-10-18: ONE picture, before on the left and now on the right, three crops of the
same frames at one game pixel to one phone pixel (the walk, their rings, the aim), the caption naming pixel size,
palette and light (rule 114c). slices/vote/COMBAT_THE_MARKS_ON_THE_BOARD_10_18.jpg. For DIRECTION's judgement against
its twin (rule 88); COMBAT is not an art lane in the NOT VIBE CODED cull.

## SEEN, NOT MINE
- The ground's own one-pixel grid line (drawGround, close in) is ground, not a mark; it stays.
- The dead man's blood pool and the lamp shadow are anti-aliased ellipses; they are light and blood, not marks; a
  later look row if DIRECTION wants them in cells.
