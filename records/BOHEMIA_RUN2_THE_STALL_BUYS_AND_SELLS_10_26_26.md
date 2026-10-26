# THE STALL BUYS AND SELLS, AND WHAT YOU SELL SITS ON THEIR SHELF (RUN TWO, 10/26/26)

Rows: [sell at the stall] (rule 242), [what you sell sits on their shelf] (rule 248), the stall's half of [one tap selects, two
taps buy] (rule 249), [eyes: prices under the phone] (EYES round five, rules 238(b), 279(c)).
Paolo 10/26: 'at the stall, where a dose of meds, six rounds, food and water are available, I should also be able to sell... how
much you can make, buy versus sell prices'; 'when I sell my junk I should be able to see it on their shelf... just in case
something accidentally fucked up... I can just re-buy it back at the sell price, not like it increased'.

## MEASURED BEFORE
- The stall's lines were one button each and one tap bought. Nothing at the stall bought his food, meds, rounds or tape.
- A piece he sold at a shop (one by one or SELL THE JUNK) was gone: not on their shelf, no way back.
- EYES on BUILD 10/26zh: the stall's prices ran under the phone upright. Measured on BUILD 10/26zzt before this change: the sheet
  already ended above the phone ([the town frames around the phone]); this ship keeps it so with the stall's taller sheet and the
  gate measures it upright and sideways.

## NOW, THE STALL (__SELL_AT_THE_STALL__, slices/BOHEMIA_SETTLEMENT_SCREEN.html)
- Every supply is one receipt line: its icon, its name, YOU HAVE, then a BUY box and a SELL box side by side, each a battery and
  the count (rule 224). Food and water, meds, rounds, a roll of tape, a stack of 20.
- The numbers are ECONOMY's (engine/bohemia_stall_prices.js, records/target/bb/stall_prices.json, nothing typed here): BUY is
  line().buy for one (the town's card, its size, what it thinks of him); SELL is a handful (pays() for line().handful: one, or two
  where one would not bring a whole battery), half in a calm town, the rise where the town is short, nothing in a glut. A sale
  into a town's need counts against its units for the card week (bohemia.stall.need.v1), so the rise eases off as he fills it.
- A town short of a thing says it on the line, THEY NEED IT (FULL UP in a glut), and the keeper opens with ECONOMY's own line for
  it ('They need meds here. 2 batteries a dose, for 1 more.', draft:true, carried from banks/ because banks/ is never published).
- One tap lights a box and the strip at the sheet's foot says what it does ('Sell 2 doses of meds: +1 battery. You have 30
  doses.'); two quick taps do it (a right click on a computer); the line updates in place, the keeper says nothing.
- A sale of food that leaves less than a night for every man shows the warning on the first two taps and goes only on the next
  two (rule 242(a)); no dialogue.
- Undo (rules 248(a), 249(c)): what he sold this visit, the BUY box says BACK at exactly what it paid him; what he bought, the SELL
  box says BACK at what it cost. Tape he sells goes back on the stall's shelf.
- The stall's sheet takes the open area's full height like the shops, still clear of the phone.

## NOW, THE SHOPS (__WHAT_YOU_SELL_SITS_ON_THEIR_SHELF__)
- Every piece he sells goes on that shop's shelf at once, first, marked YOURS, SOLD, priced at what it brought.
- Two taps buy it back for exactly that, back into the bag at the slot it left, its KEEP mark kept.
- After he leaves, what is left of his is their stock at their price, until the shelf restocks (kept per place and delivery in
  bohemia.soldto.v1, so a reload keeps it).

## GATES
THE STALL BUYS AND SELLS (new, T1 to T6, G1 to G3, P1, K1). Re-aimed to the two boxes: TAPE AT EVERY STALL, THE WAGON AND THE SIX
(C4), THE SETTLEMENT SCREEN (the stall's sound, a sick town's prices). Re-aimed to rule 209's food (a night for one man at two,
red on main since): THE CLINIC'S COUGH, THE NEIGHBOUR TAKES THE REFUGEES (the food leg), THE MARKET IN THE PACK'S ART (three goods).

[bb Battle Brothers' marketplace buys every good it sells, at a price under what it charges, and what you sell sits in its stock
where you can buy it back; ours keeps the buyback at what it paid you while you are in town, his ruling.]
[analog horror: the strip reads like a till receipt, the stamped green plus on what they pay you, the red line when the food runs
short.]
