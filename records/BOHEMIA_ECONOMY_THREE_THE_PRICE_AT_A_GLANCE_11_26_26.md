# THE PRICE AT A GLANCE (ECONOMY THREE, 11/26/26; VAMILY rule 482, rules 480(b), 441)

Rule 482 (Paolo 11/26: 'More cooking up cleaning up improving things we're already doing type shit'); the coordinator's wake for
this lane: 'Take the next money screen he meets (a shop, a stall, rent, a job's pay, the barter) and make it read clearer and look
better: the price, what he has, what it buys, at a glance, upright and sideways, no clutter. Clean out leftovers. Ship a build he
can see.' Gate: gates/the_price_at_a_glance_gate.js (THE PRICE AT A GLANCE). VOTE card: economy3-the-price-at-a-glance-11-26.

## MEASURED BEFORE (the demo, a new crew at Caravans, 290 batteries, the phone upright and on its side)

- THE SMITH'S SHELF drew the 388 pump shotgun's price exactly like the 44 knife's. Nothing said it was more than he held; he found
  out by tapping BUY twice and nothing happening.
- THE SHOP'S TWO BUYS: 'Buy it and wear it' was cut to 'Buy it and w...' upright (the label is one line, the price beside it), and
  'to the stash' (the same buy, kept unworn) said no price at all.
- THE STALL faded a BUY he could not pay to a ghost (opacity .45): the price was there but hard to read.
- 'SELL 2', 'SELL 12' over '+1' read like two prices in one box (it means: hand over 2 doses, or 12 rounds, for one battery).
- THE TRADE GOOD'S LINE ('MADE HERE, 3 LEFT · YOU HAVE 0') hung its dot at the end of a line upright, the count on the next.

## NOW (slices/BOHEMIA_SETTLEMENT_SCREEN.html, __THE_PRICE_AT_A_GLANCE__)

- A PRICE OVER HIS PURSE IS RED wherever he buys: the shop's shelf tiles, the shop's two buy buttons, the stall's BUY boxes and the
  trade goods' BUY. Battle Brothers' own way (its shop draws a price you cannot pay in red). The stall's box stays readable (.85,
  not a ghost). The bar at the top already says what he holds, so price and purse read together.
- BOTH BUYS SAY THE PRICE ('Buy it and wear it' and 'to the stash'), and a label takes a second line before it is ever cut: the
  words are RUN TWO's (rule 210: BUY names the man), whole.
- WHAT HE HANDS OVER TO SELL is the good's own picture and the count beside SELL (the pack's small supply icons), one line, inside
  the box. The words in the page are the same letter for letter ('SELL 2'), so every reader and every gate reads them.
- THE TRADE GOOD'S LINE is two lines, as every supply's: MADE HERE, N LEFT; then what he has (the UI's sack and the number).
- NOTHING MOVES: no row grows, the boxes and the strip keep their sizes (the trade row's third line sits inside the 44 px of its
  boxes); the dearest-first order (__DEAREST_FIRST__), the UI's sack for what he has (EVERY COUNT A PICTURE) and UI FOUR's sideways
  fit (__THE_STALL_FITS_ON_ITS_SIDE__) are untouched.
- FRAMES: a class on a tile and a box, read at build time (bats() once a line); no new loop, nothing measured per frame.

## PROVED (rule 441: the demo and the alpha, upright and on its side)

G1 the shelf's red is exactly the prices over his purse; G2 the dearest picked, both buys priced, red, nothing cut; G3 the stall with
a planted thin purse (10): every BUY over it red and readable, every one he can pay not; G4 every SELL of more than one in its
picture, one line, inside its box; G5 the trade row two lines, no dangling dot; G6 no page error; M the shelf's red planted away
reads red. Picture: records/target/ECONOMY_THREE_THE_PRICE_AT_A_GLANCE.jpg (before and now, the demo upright).

[bb Battle Brothers' shop: a price you cannot pay is red; ours does it on every buy]
[analog horror: a price tag in a dead mall, the number in red marker over the printed one]
