# RUN TWO [a card's picture, full size] -- 10/19/26

Row: WHAT-HE-CANNOT-SEE-HE-CANNOT-JUDGE (rule 89, Paolo 10/10: what he cannot see did not ship). COMBAT TWO measured
its district card: a 2400 x 7080 sheet put five boards across his phone at about 75 points each, and a picture too
small to read gets a NO for the wrong reason.

Shipped d5b1f8e9 (main). Resumed from the claim 16a8a94b; the session that claimed it hit the five-hour cap minutes in
and left no work behind, so this is the whole job.

## What he gets

- A tap on any card's picture lays it over the whole screen at ONE IMAGE PIXEL TO ONE POINT (the browser's own 100
  percent; crisp, image-rendering pixelated from 1x up), centred on the pixel he tapped, as near as the sheet's edge
  allows (it never slides off into black). One finger drags, two fingers pinch around the point between them (down to
  the whole picture on one screen, up to 8x), a mouse wheel zooms on a laptop, a tap that did not move closes it, so
  does Escape. Closing never votes; the card is still there.
- No new button on the card's face: the picture is the door. One line of small words on the viewer itself:
  FULL SIZE, DRAG, PINCH, TAP TO CLOSE (rule 117: few words).
- THE FIRST PICTURE IS ONE THING: a card may carry show.first (one thing cut from its own sheet) and show.firstAt
  ([x, y, w, h] on the sheet). The card shows the one thing; the tap opens the WHOLE sheet at full size on that thing,
  and he drags to the rest. Seven cards that were sheets of many were cut (tools/bohemia_run2_first_picture.py, the
  rect chosen by looking at each sheet: the thing its WHY asks him to judge):
  the wreck on his tiles (COOK), the Strip board (COMBAT TWO), the near stop with the curb (COOK TWO), the star beside
  the first new face (EYES), the first house after (COOK FOUR), the first hire card (PEOPLE), A on its side (UI).
  Pixels are the sheet's own; a cut over 300 KB goes lossy at 90 for the card only (1.3 MB for all seven), the 1:1
  view is always the lane's own sheet.

## Found on the way

- Closing on the finger's lift let the click that follows land on the card's picture underneath and open it again
  (the probe's tap re-opened it at 1:1). It now closes on that click, which lands on the viewer while it is up.
- The card's picture loads lazily, so a check that opens a card below the fold waits forever unless it scrolls
  there first, exactly as his thumb does.

## The gate (gates/vote_tab_gate.js, section 3b, 9 legs, real touches on 390 x 844, deviceScaleFactor 3)

covers the screen 390 x 844; shown width = the sheet's width (1724 x 8787 pt for a 1724 x 8787 sheet); the tapped
pixel in the middle as near as the edge allows; drag 100 left 150 up moves it exactly that; pinch 100 -> 300 is x3.00
and the point between moves 0 px; a tap closes and the card is still waiting; a one-picture card opens at 1:1
(1452 pt of 1452 px); four buttons on every card face; every first picture on his first screen and every card made from
10/19 fits one phone screen at the card's width (8 of 8). vote_tab 51/1: the red is DYNASTY's two whys
(dynasty-flip-at-crisis-10-9, dynasty-animal-era-10-10, "no where"), red on clean main.

## For every lane registering a sheet

Add a line to CUTS in tools/bohemia_run2_first_picture.py, or run it with --id ID --rect X Y W H; it writes
records/target/vote_first/<id>.webp and puts first/firstAt into the card's show, touching no other byte of the
registry. From 10/19 a card whose picture does not fit one phone screen at the card's width is refused by the vote
tab gate until it has a first. The registry's readme says so.

VOTE run2-a-cards-picture-full-size-10-19 (slices/vote/RUN2_A_CARDS_PICTURE_FULL_SIZE_10_19.webp, made by
tools/bohemia_run2_full_size_shots.js: before, the card as it was; after, one thing; after, the tap).
