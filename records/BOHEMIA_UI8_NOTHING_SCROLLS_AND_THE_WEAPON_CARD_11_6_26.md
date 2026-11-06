# UI 8 -- NOTHING SCROLLS, AND A WEAPON TELLS YOU WHAT IT CAN DO (11/6/26)

Rules 402 (ask line 444) and 397 (ask line 437). BUILD 11/6g - NOTHING SCROLLS.

## Rule 402: scrolling is illegal

Paolo 11/4: 'scrolling is fucking illegal in my opinion... from the phone to the wide screen laptop, anything that's
clickable I don't wanna scroll up and down anywhere ever again.'

### Measured before (the demo at 0019d67b; tools/bohemia_no_scroll.js swept every frame on the glass)

| screen | phone upright (390x844) | phone on its side (844x390) | laptop (1440x900) |
|---|---|---|---|
| settings card | 36 presses in a box 820 of 1,282 | 366 of 1,282 | 876 of 1,282 |
| the hall (hiring) | sheet 546 holding 2,286 | 221 holding 2,058 | 588 holding 2,046 |
| smith / armourer | 546 holding 1,047 / 1,063 | 221 holding 1,218 | 588 holding 990 |
| stall / board / bar | 546 holding 573 / fits / fits | 221 holding 459 / 236 / 245 | fits |
| the origins (new game) | a strip of 15 cards scrolling sideways | the same | the same |
| crew screen, fresh game | fits | page 1.05 screens | fits |
| crew screen, a bag of forty | page 1.31, the bag a scrolling box of 40 | page 1.71 | fits |
| the fight's page | fits | fits | fits |
| the end of the fight (spoils) | page 1.83 | page 1.85 | fits |

The relations page on the phone holds more words than it shows, with nothing to press inside: not counted. The feed's
strip steps a post line by line (rule 363): not his scrolling, nothing to press inside, never counted.

### Now

- slices/bohemia_ui_no_scroll.js (UI's, new): BohemiaNoScroll.page(box) locks a box and cuts what it holds into
  pages he taps: a strip of the page before, the page numbers, the page after and PAGE n OF m (a narrow strip drops
  the words, then the numbers; the arrows always stay), and a swipe across the box. Atoms are whole things (a recruit's
  card, a button, a row, one slot of a grid); a heading never ends a page; empty places past the last thing he owns are
  no page; a thing that cannot fit even alone is drawn smaller (never under three quarters). An element.scrollIntoView()
  inside a paged box turns to its page instead of scrolling. Loaded once in the shell; it plants itself in the town's
  frame (RUN TWO's settlement file is untouched except one data attribute, below) and the crew screen loads it.
- The settings card: four tabs, Battle Brothers' options menu: SOUND (all, mute, music, ambience, effects, buzz),
  SCREEN (text, bright and its picture, the phone's corner and apps, motion), PLAY (events, fights, kill cams), GAME
  (vote, save, quit). BACK TO THE GAME on every tab. On a short wide glass the card lies in two columns. Upright every
  tab is one page; on its side SCREEN is two.
- The town's sheets: paged. The hall stands the glass's whole height (a hiring screen, as Battle Brothers' is), so the
  keeper and a recruit share a page; on a short wide glass the keeper has a narrow column with the page strip under him,
  a recruit's numbers lie beside his lines, and the shop's strip stands in its own right column so the shelf has the
  middle's whole height. Measured after: hall 5 pages upright / 6 on its side, smith and armourer 3 / 7.
- The origins: one card at a time, the strip locked; the arrows, a swipe or a wheel notch turn one card. The heading
  no longer says SCROLL on a computer (ARROWS, draft).
- The crew screen: the stash in pages of whole rows that fit under the card and the tabs; on a short wide glass the
  man's card is drawn smaller until it fits the height (never under two thirds); upright, when not one row of the
  stash fits, the card gives up the height (never under four fifths). A bag of forty: 7 pages upright and on its side.

### Owed, not mine

- THE END OF THE FIGHT (RUN FIVE's spoils screen, being drawn whole this round): 1.83 screens upright, 1.85 on its side,
  43 presses below the glass. The gate prints it as OWED and does not count it. BohemiaNoScroll.page() is ready for it.
- The road fight could not be started from a script this round (the map's meet-and-dive flow); the fight's own page was
  swept alone and fits on all three.

### Gate

gates/scrolling_is_illegal_gate.js: the title and picks, the start town, all ten buildings page by page (every press
the sheet holds reached on some page), the settings card tab by tab and page by page (every row on a tab), the crew
screen through the phone, the crew screen with a bag of forty and a level waiting, the fight's page; phone upright,
phone on its side, laptop. Mutation leg: the pager switched off brings the hall's scroll back and the sweep says so; a
planted scrolling box with a button, a page taller than the glass and a button below a locked edge are each caught.

## Rule 397: a weapon tells you what it can do

Paolo 11/4: 'when I click a weapon, it should tell me what sort of extra combat ability it gives me by default'.

- slices/bohemia_ui_weapon_card.js (UI's, new): a tap on any weapon piece shows its card: every blow in the fight's
  words (the skill's name in capitals as the fight titles its button, the main blow marked STRIKE, a gun's RELOAD),
  AP, BREATH, REACH in tiles, one plain line; NO SPECIAL ABILITY when it has only its blow. Read from
  records/target/bb/weapons.json and ours.json (melee reach 1, the whip 2, a pistol shoots with the row the fight rides
  for it and reloads like the light crossbow): nothing typed per weapon. The plain line is the wiki's effect text said
  by a table of phrases (PHRASES, draft:true for WORDS).
- A piece is found by what it carries: the kit's item icons now carry the piece's id (bohemia_ui_materials.js
  itemIcon, data-id), so the crew screen, its stash and the spoils' loot answer; the shop's tiles carry
  data-item="weapon:<id>" (one attribute in RUN TWO's iconTile). The arena's gear answers wherever it is drawn with the
  kit's icons.
- One tap still does what it did (compares on the crew screen, lights the piece in the shop); the card stands in the half
  of the glass the finger is not in and the next touch puts it away.
- Measured: 145 weapon rows, 292 blows, 38 rows with NO SPECIAL ABILITY.

Gate: gates/a_weapon_tells_you_what_it_can_do_gate.js (W1 every row's blows on its card with its own AP and breath; W2
the plain lines are words; W3 the crew screen phone and laptop; W4 the smith on the demo; M a card that drops a blow
turns W1 red).

## Gates run this round (one at a time where the box allowed; rule 13)

- SCROLLING IS ILLEGAL (new): on the merged tree, phone upright 9/0 (with the alone legs), on its side 8/0, laptop 8/0.
- A WEAPON TELLS YOU WHAT IT CAN DO (new): 7/0 on the merged tree (W4 the smith on the demo: the halberd's STRIKE and HOOK).
- Re-aimed for the pages and tabs, each one line, marked RE-AIMED 11/6: THE SHOP TAPS 9/0 (its tap turns to the piece's page
  first; S2 caught a real thing, the sheet changing height on the first tap: a paged box now keeps one height), SETTINGS AND
  PAUSE 17/1 (reads every tab; the one red, the door after QUIT, is the red UI 5 recorded on main), SETTINGS IN OUR
  MATERIALS 15/0 (reads every tab, taps BRIGHT on its own tab), THE BEST RECRUIT AT THE TOP 11/1 (C8 reads every recruit with
  the pager's checker switch; C7, the computer on the town's page alone where the pager is not loaded, is red on main's own
  two files too: not mine), THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE 48/0 (untouched).
- tap_picks_gate (the city builder's taps) drove 0 of 0 taps: its own environment, nothing of mine.

## Found on main, not mine (for the coordinator)

- THE TOWN STAYS INVISIBLE AFTER ITS DOOR on the merged main (e6c7a93f): the game now opens on the map, and after
  loopOpenTown (the map's own door) the town's frame keeps opacity 0 (the camp fade-in of the moments between, btwCampIn in
  slices/BOHEMIA_CITY_WORLD.html, never finishes under the demo driver); the phone turns to the town's face (LEAVE) over the
  map. It is the same with this lane's two files blanked out (measured). Taps reach the invisible town (its frame keeps
  pointer events), so a checker that taps a town and reads its sheet passes while the player sees the map. Both of this
  lane's gates now refuse a town that is not on the glass, and call the game's own rest (btwFrameRest) after 6 s, saying so.

[bb Battle Brothers: none of its screens scroll (the options are four tabs, the stash and the market fixed grids), and
an item's tooltip lists each skill with its AP, fatigue and a line.]
[analog horror: a page turns like a monitor's channel switch, one hold of black; the weapon's card is a pawn ticket.]
