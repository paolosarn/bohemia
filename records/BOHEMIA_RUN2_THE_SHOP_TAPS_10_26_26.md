# THE SHOP TAPS (RUN TWO, 10/26/26)

Rows: [one tap selects, two taps buy] (rule 249), [nothing moves while he browses] (rule 250), [the shop shows only what
changes] (rule 251), [the shop lights upgrades] (rule 282).
Paolo 10/26: 'when I click something once in a shop it should be highlighted... it shouldn't open up a second menu... I just
double click it'; 'as I click through the items the things don't change locations'; 'just an icon, a green arrow up, a red arrow
down and a number'; 'if the shop has a better version... it's highlighted in green... it recommends it goes to the one with the
bad helmet first'.

## MEASURED BEFORE
- A tap on a shelf piece took the whole sheet away and drew the piece's card in its place: the keeper saying its price, the man
  picker, 'Not this one'. The shelf left the glass on every tap, and a second tap meant finding the shelf again.
- The card listed every man with his full stat block, 'same' lines included; nothing on the shelf said which piece was better.

## NOW (__ONE_TAP_SELECTS__, slices/BOHEMIA_SETTLEMENT_SCREEN.html)
- ONE STRIP at the shop sheet's foot, always one size (sticky, 206 px: the facts, the men, two buttons), and the sheet takes the
  glass's full height while a shop is open, so the strip never pushes the shelf.
- ONE TAP outlines the box and fills the strip in place: the piece's name and price (TWO HANDS in big letters on a two-hander),
  its numbers, and every man's face with the piece's change on him: a green up arrow and how much, a red down arrow, a dot for
  nothing, a cross for a man who cannot wear it. The man it suits most is named on the buy button. Nothing is rebuilt, nothing
  scrolls, the keeper does not speak.
- TWO TAPS (inside 450 ms; a right click on a computer) buy it straight onto that man, no dialogue; 'to the stash' is the second
  button. The sheet stays where it was; a sold piece leaves a gap on the shelf for the rest of the visit, so nothing slides.
- ONLY WHAT CHANGES: a man's lines are only the numbers this piece moves on him; 'Nothing on him changes.' when none.
- GREEN FOR AN UPGRADE: every shelf piece that raises one of his men's headline number (armour for plate, damage for a gun) is
  outlined green with a green up arrow, and its first tap names that man first (the one with the worst piece of that kind).
- A BAG PIECE: one tap shows what it sells for and KEEP IT; two taps sell it ('Sold. N batteries.').

## GATES
THE SHOP TAPS (new, S1 to S6 and K1): one tap lights it in place with no second menu; ten taps move no rectangle a pixel; each
face carries the change, the lines only what changes; two taps buy it onto the named man; every upgrade green and naming its man;
a bag piece sells on two taps; a right click buys. Re-aimed to the strip: THE SETTLEMENT SCREEN, THE SHOP SAYS WHAT IT DOES, WHAT
YOU BUY GOES ON THE MAN, A TWO-HANDER WEARS ITS OWN NAME, THE TOWNS PART.

[bb Battle Brothers' shop is one grid beside your stash: a click picks the piece and its tooltip shows the change on the man you
have open, a right click buys it; nothing moves while you browse. Ours puts every man's change on the strip at once, because a
phone has no hover.]
[analog horror: the strip is a price tag on a string, the arrows stamped on it in green and red ink like a pawn shop's ticket.]
