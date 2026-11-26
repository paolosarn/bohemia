# UI FIVE -- THE ALPHA SAYS CONTINUE (11/26/26; VAMILY rules 482, 441, 66; ask row 738)

FOUND BY EYES 11/26 (records/BOHEMIA_EYES_RULE_480_THE_SLOWED_PHONE_11_26_26.md, e04, e05): 'after a reload the alpha's front says
Three of you and nothing owed. Start clean. 290 BATTERIES, every new game's choice (the crew's name, who you were, the fights, the
shelves, the valley's code) and no CONTINUE; BEGIN then skipped the barber and brought back the game he was playing. The page says a
new start, the button continues, the choices do nothing. The demo's title says NEW GAME and CONTINUE.'

## THE CAUSE, MEASURED

Reproduced (the alpha upright, a game begun, the page reloaded): the front showed the door's fifteen crews, the fights, the shelves,
the map, the hints and BEGIN, with BOH_TITLE.skipped = 'workshop'. The start screen's title (slices/BOHEMIA_ALPHA_0_9.html
__THE_START_SCREEN__: NEW GAME / CONTINUE / SETTINGS) was the demo's alone ('the workshop opens on VOTE after its loading screen'), so
the workshop over a save showed the new game's door, and the door's BEGIN continues a save.

## THE FIX (__THE_ALPHA_SAYS_CONTINUE__)

- Over a SAVED game the workshop shows the title too: CONTINUE through the door's own BEGIN (it then lands where the workshop lands
  after BEGIN, the VOTE tab), NEW GAME asked once ('this ends day N') and then the picks on a clean page. With no save the workshop
  keeps its door as it was (the picks and BEGIN, then VOTE). The NEW GAME mark in the session is read and cleared before the check, so
  it never outlives its own reload.
- A workshop that held no save when it opened writes none before BEGIN: FIXES 2's hold for the demo (__NO_SAVE_BEFORE_NEW_GAME__, ask
  row 590) now holds the workshop's door too, so a reload never offers CONTINUE on a game nobody began; BEGIN writes it, as before.

## PROOF (rule 441: the alpha, a phone upright and sideways, the way he gets there)

GATE THE ALPHA SAYS CONTINUE (gates/the_alpha_says_continue_gate.js, new, in the suite): A1 a fresh phone, on the door before BEGIN:
no save, no title, the fifteen crews; A2 BEGIN wrote day 1, a reload shows the title (NEW GAME, CONTINUE), a tap where a crew sits
under it changes nothing; A3 CONTINUE (a real tap): day 1 comes back, the door gone, the VOTE tab; A4 a reload, NEW GAME asked 'this
ends day 1', tapped again: the fifteen crews, no title, no save; A5 nothing threw. Upright and sideways 10/0. PLANTED (upright): the
workshop's title taken away again, A2 red.
GREEN WITH THIS BUILD: A FRESH PHONE SEES THE DOOR 9/0, THE SAVE COMES BACK THE SAME 22/0 (one run 19/3 on its S1 clock legs, then
22/0; 22/0 on main). RED ON MAIN THE SAME: THE FRONT SCREEN, JUST THE FONT J4 (11 px on the picks, both ways).

VOTE ui5-the-alpha-says-continue-11-26 (STAND-IN): the alpha upright after a reload over a saved game, before (the picks) and now (the
title). Shots from the walk above; laid out by tools/bohemia_ui_five_the_alpha_says_continue_card.py.

[bb Battle Brothers' main menu: CONTINUE and NEW CAMPAIGN, never a new company's sheet over a running campaign]
[analog horror: the tape label says BLANK, and pressing PLAY picks up mid-sentence]
