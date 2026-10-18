# THE FRONT SCREEN, JUST THE FONT (UI, 10/18/26, ui-opus-e)

Row: UI [the front screen, just the font] THE-WORDMARK-ALONE-AND-A-FRONT-SCREEN-WORTH-OPENING, first on the board.
Ruling: records/BOHEMIA_PAOLO_THE_FRONT_SCREEN_JUST_THE_FONT_NO_PLATE_10_18_26.md.

## His words (10/18, to the coordinator)

"the ui is looking like shit especially loading screen like the Bohemian title card like I don't want the card
behind it. I just want the crazy font that it is like on the front screen yeah like the front the whole front
screen looks like dog shit, bro."

## Measured first, on the demo as it is (BUILD 10/18b), his phone's profile (390 x 844 at 3x, and on its side)

- THE CARD. His wordmark (BOH_FRONT_LOGO_B64) is 400 x 130 and fully opaque. 46,248 of its pixels are the grey card
  (a value under a quarter, or a saturation under a quarter; the card sits at 45,43,39 plus or minus 8) and 5,731 are
  the gold letters with their spray and their three drips. Nothing sits between the two classes (the 21 dark tinted
  pixels are card). The title wears it on the card at 350 css px (2.6 phone pixels a pixel, not a whole number); the
  splash wears it inside a cut-corner metal plate (#logoplate); the loading screen's top (#loadtag) writes BOHEMIA in
  the casing at 19 px (off the casing's pixel grid) with a green glow.
- THE TITLE. Three equal heavy blocks of three materials (cardboard, receipt, glass) at a slight tilt (tilted pixel
  text renders soft), a subtitle on its own dark plate, the valley painted at half resolution (two css px a pixel
  beside the words' one: two pixel sizes on one screen, rule 114's first tell) with smooth canvas gradients in its sky
  and its lamp pools.
- THE PICKS. Taped cardboard cards and a receipt sheet laid over a green terminal: three materials on a CRT. The
  terminal's glass a radial gradient with a radial vignette, the bar a gradient with a glow and round corners, BEGIN a
  green block with a glow, ONE MOMENT a smooth opacity blink, the stamp at 6 px in a colour that fails 4.5 to 1.
- SIDEWAYS IT WAS BROKEN: the picks ran 74 px past the bottom of the glass (413 tall in a 390 screen), BEGIN sat on
  top of the origin cards, the build stamp ran through them and the crew's name was off the glass; the log was 18 px.

## How his wordmark is made (the study: what the rest of the screen has to agree with)

- Pixel art at one size: 321 x 71 of ink (at 39,33 in the 400 x 130), strokes 8 to 9 pixels, the casing's condensed
  capitals grown up.
- A three-step gold ramp lit FROM THE TOP: #e6c475 on the top rows, #c8ab63 in the middle, #a78949 at the foot
  (563 colours in all, the grain between those three).
- Eroded on purpose: card-coloured holes through every stroke, a spray of single gold pixels around the letters, three
  one-pixel drips (under the B, the O and the A). Hand-made, loud, held: the bible's era line, already in his art.
- So: one css pixel a pixel everywhere on the screen (the letters at a whole scale, three phone pixels on his phone),
  the gold ramp as the only warm colour, the light from the top on everything drawn.

## What changed (slices/bohemia_ui_materials.js, the THE FRONT SCREEN, JUST THE FONT block)

1. THE CARD IS KEYED OUT BY A RULE, NOT BY HAND: a pixel of his stays when it is gold (value and saturation both a
   quarter or more), every other pixel goes clear, and the letters are cropped to their own ink. 5,731 of 5,731 gold
   pixels kept, every one equal to his, zero card pixels kept. Nothing of his is redrawn, recoloured or moved. The
   same canvas stands on the splash (where the plate was), on the title, and at the top of the loading screen (where
   the glowing text was).
2. THE SYSTEM: a cold dark ground everywhere (#07090b; the terminal's glass #0a0d0b); GOLD ONLY FOR WHAT MATTERS: the
   name, a pick that is yours, and the one next thing (rule 117), in the wordmark's own three steps with the light
   from the top (2 px of #e6c475 above, 2 px of #a78949 below); the terminal keeps his pick's green for its own words
   (loads B, 9/21: the log from the bottom, the real bar, BEGIN dark until the game is in).
3. THE TITLE: his letters alone at 19% of the height over the valley; the subtitle with no plate; ONE gold choice
   (NEW GAME with no run, CONTINUE with one: the gold moves to the next thing); the other two as quiet printed lines
   (casing label, ROM line, a 12 px printed mark), 48 px tall; NOTES a 1 px line. The valley redrawn at one css pixel a
   pixel with no smooth fade anywhere: the sky two flat values meeting in a sixteen-step ordered band, flat ridges, the
   dead grid, ONE BLOCK STILL HAS POWER (five lamps of seven, two dead, each pool two stepped dithered rings), the
   pylons and their wires plotted pixel by pixel.
4. THE PICKS: typed on the terminal's glass, a 1 px line round each, the picked one gold; every word in the casing
   (stamped) or the ROM (printed) at 10 px, where the faces' ten dots land on whole phone pixels; the crew's name an
   underline. The bar is one cell a stage (ticks placed in whole pixels), lit from the top; BEGIN 208 x 48, gold
   once the game is in, the word at 20 px.
5. SIDEWAYS: the picks on the left, the letters, the log, the bar and BEGIN on the right, so nothing runs off the
   glass at 844 x 390, 932 x 430 or 667 x 375; a short upright phone (667 tall) gets the same tightening so its log
   keeps three lines.
6. RUN's NOTES sheet over the title gets the same glass (it had a gradient, a glow and a browser focus ring); the box
   types at 20 px so a phone never zooms into it.
7. NOTHING BLINKS (bible R3). No gradient, glow, blur or round corner anywhere (rule 114 D10). Every word passes 4.5 to
   1 against what is really under it and again in the sun (rule 73); the build stamp is readable (ROM 10 px).

The one wrong thing (bible R1): on the title, one block of the dead valley still has power and nobody is there (R7);
on the terminal, NO OPERATOR ON DUTY, as before.

## The switch, and why it is off in the file

The deploy cuts the demo from the alpha on every push, so anything in the alpha goes live on his phone within
minutes. Rule 93 says nothing goes live on the demo without a called GO, and the cut is RUN's. So the whole look is
built to switch on from the door's own attribute: `<div id="front" data-look="classic">` in the alpha. RUN flips it to
`just-the-font` (one word) at the cut: CUE 6.95 in BUILD_CALLING_SCRIPT.md. On a door that says classic nothing of
this runs and the sheet matches nothing (the gate's J9 holds it).

## Proof

- Gate: gates/the_front_screen_just_the_font_gate.js, in the suite as THE FRONT SCREEN JUST THE FONT: 42/0, three
  walks through the one driver (upright, sideways, classic), nine planted defects caught every run (the card painted
  back, a gradient on the bar, a glow on BEGIN, a phone font, an 11 px label, a round corner, a squeezed pick, a dim
  word, a second gold choice).
- THE FLIP, TESTED BEFORE IT IS HANDED OVER: see the section below.
- The sheet: records/target/ui_front_screen/UI_THE_FRONT_SCREEN_JUST_THE_FONT.png (before and after from the demo's
  camera, upright and sideways, one css pixel a pixel), built by tools/bohemia_ui_the_front_screen_sheet.js.
- VOTE: ui-the-front-screen-just-the-font-10-18 (YES / NO).

## [bb interface]

Battle Brothers' own front door: the logo alone over a dark painted scene and a short column of plain words (new
campaign, load, options, credits, quit), no buttons drawn around them. Ours is the same shape in our own way: his
letters alone over the dead valley, one choice lit in the wordmark's gold, the others printed plain.

## Analog horror line

The front screen is a dead utility's screen that is still on: a cold ground, a terminal that reports in a calm
register, one block of the valley still lit with nobody home. Nothing moves that does not have to.

## Did not decide

Nothing. The words on the screen are RUN's and unchanged; the switch's flip is RUN's call (rule 93).
