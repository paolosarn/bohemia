# UI THREE: NOTHING SHOWS UNTIL HE TAPS IT (11/7/26)

Rule 433, ask line 518. The coordinator's routine "UI THREE: shop shows on tap" put it first in the round.
Session UI THREE (claude session 01GKDyuvPvmndtYsPNo59Yab).

## His words (11/7)
"When I'm in the shop, why do you feel the need to show equipping items on our company before you click an item... this
confusion you create yourself just creates problems... some things don't have to be displayed until you click a thing... how
items compare to the company members' current equipment doesn't have to get displayed until after I click the item."

## Measured before (the smith in BLUE DIAMOND, the phone, main aecbd030, no tap)
- A green upgrade arrow on 7 of 7 shelf pieces (RUN TWO's rule 282 mark: the piece beats what one of his men has).
- His men's faces standing in the strip under "WHAT IT DOES TO EACH OF THEM SHOWS HERE".
- A piece lit on an earlier visit to the same shop was still lit, its comparison up, when he walked back in.

## Now
- AT REST (walking into a smith, an armourer or a camp's guns and plate): the shelf, the prices and the hint ("Tap a piece to
  see it on your men"). No upgrade mark, no face, no line about his men.
- ONE TAP on a piece: the strip shows how it compares with each of his men (each face an arrow and how much, the man it suits
  marked, the lines of what moves on him, the item card's pictures with bars), and that piece's own green arrow.
- A TAP ANYWHERE THAT IS NOT A PIECE, THE STRIP OR A BUTTON (the keeper's words, a heading, the empty sheet, the town picture)
  puts it away: back to rest.
- WALKING BACK IN starts at rest: nothing is lit by itself.
- NOTHING MOVES (rule 250) AND NOTHING CHANGES SIZE (rule 402, UI 9): what hides is hidden by visibility, so the strip and the
  shelf keep their places; RUN TWO's logic is untouched (the shelf still knows which piece is an upgrade, so the tap names the
  man it helps most first, rule 282(b)).

Where he meets it: every town's smith and armourer in the CITY, and a camp's guns and plate.

## How (slices/BOHEMIA_SETTLEMENT_SCREEN.html, one marked block __NOTHING_SHOWS_UNTIL_HE_TAPS__ after __UI_THREE_ITEMS__)
CSS: a shelf piece's .upm only on the lit piece (.sel); the strip's resting man box (.ss-empty) hidden. openB wrapped: a
building opened that is not the one open now drops the lit piece. One click listener: a click outside the shelf, the bag, the
strip, the weapon's card and every press puts the piece away (shopMark, shopStripFill).
Rule 433(b), every screen this lane touches: the crew screen's comparison already waits for a tap (one tap compares, rule
249), the weapon's card opens on a tap, the item boxes' quality frames are the piece's own (not his men's), so nothing else
showed before a tap.

## Gate: THE ITEM CARD AND THE ITEM BOX, legs R1 to R4 (gates/the_item_card_and_the_item_box_gate.js)
R1 at rest: no upgrade mark, no face, no line about his men on the glass (the shelf still knows 7 upgrades); R2 one tap: each
man's arrow and amount, only that piece's own mark; R3 a tap on the keeper's words puts it away; R4 walking back in starts at
rest. Phone and computer. Planted: the comparison shown at rest turns R1 red.

[bb Battle Brothers' market shows the shelf and the prices; a piece's numbers and how it sits on a man come on the hover.]
[analog horror: the pawnshop's counter is bare until he points at something; then the clerk's lamp comes on over it.]
