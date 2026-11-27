# FIXES 4 -- NO LINE UNDER ANOTHER (11/27/26, BUILD 11/27zj, ask row 777 FOUND BY EYES)

The row: 'THE STALL'S STRIP LAYS ITS NEXT LINE OVER THE LAST: after a buy at the stall upright, "Bought. You have 22 nights of food."
shows its top half only, the price line's box drawn over its foot' (records/eyes_rule480_11_26/e14). Owner ECONOMY THREE (with UI
FIVE); ECONOMY THREE wrote HANDOFF READY at 11/27o, so nobody was on it.

## 1. MEASURED BEFORE

tools/bohemia_fixes_four_the_stall_strip.js: the demo, Caravans' stall at ten in the morning opened by a finger, one food bought by two
real taps (the stall's 450 ms window), then every line in the strip's facts box: the height its words need against the height it was
given, and whether the next line starts over it.
- Upright: the box is a fixed 58 px, a flex column whose lines may shrink. The said line ('Bought. You have 22 nights of food.') needs
  16 px and was given 7; the price line (49 px, three lines) started over its foot. EYES' picture, reproduced.
- On its side: the no-scroll layout's dense sheet caps the box at 30 px; the said line was given 0 px (never seen at all), the price
  line over where it would be and cut at the box's foot.

## 2. THE FIX (slices/BOHEMIA_SETTLEMENT_SCREEN.html __NO_LINE_UNDER_ANOTHER__, CSS only)

No line in the stall's strip shrinks. While a said line is in the box (after a buy or a sale) the box is as tall as its lines (upright
58 -> 67 px); with no said line it is the 58 px it was (so the strip does not jump between short lines, and NO LINE CUT's sideways
stall leg, which a first try with a 58 px floor broke by 24 px, holds). On the dense sheet (the no-scroll layout's 30 px cap) the said
line stands alone and the price line, which repeats the same 'You have', comes back with his next tap.

## 3. MEASURED AFTER

Upright (roomy sheet): said 16/16, price 49/49, nothing over, nothing past the box. Upright on a dense sheet and on its side: said
16/16 alone, nothing cut.

## 4. PROVEN

NO LINE UNDER ANOTHER (new, gates/no_line_under_another_gate.js) 3/0; PLANTED (the old box): upright said 7/16 under the price line,
on its side 0/16, both red. NO LINE CUT WHILE THERE IS GLASS 12/0 (12/0 on main). THE STALL'S DAY demo upright 4/0. TRADE GOODS
CARRIED 18/5: its computer legs (L7, 'the gate ran on computer') fail on a null tile, nothing of the strip; not run on clean main here.

## 5. WHAT HE WOULD MEET

TAB: RUN on the alpha link, and the demo link. In a town, at the stall: after he buys or sells, the line saying what he did and what he
has now reads whole, and nothing is drawn over it, upright or on its side.

## 6. AMENDED: THE BOX KEEPS ITS HEIGHT (BUILD 11/27zq - THE STALL HOLDS STILL, the 95 new reds' round)

THE WAGON AND THE SIX (C4, real taps at a town's stall: a dose of meds, six rounds, a night of food, two quick taps each) went red on
the 11/27zj tree and green with the page from before it (A/B, the same box): after the meds were bought the box grew to hold the said
line (58 -> 67 px); the first tap on SIX ROUNDS cleared the said line, the box shrank back, the list moved, and the second tap landed
on the roll of tape below it (rounds +0). A thing that grows under his finger moves what his finger is on. NOW the box keeps its 58 px
always; while a said line shows it stands alone in the box (the price line repeats the same 'You have' and comes back with his next
tap); on the dense sheet the box holds its 30 px while the said line shows, as it did with the price line in it.
PROVEN: NO LINE UNDER ANOTHER 3/0 with a new hold (the box the same height before and after the buy, upright 58/58, on its side 30/30),
PLANTED red; THE WAGON AND THE SIX 10/0 twice and 9/1 once (that one the first tap after the stall opens, the meds: the sheet's own
opening, not the strip); NO LINE CUT WHILE THERE IS GLASS 12/0.
