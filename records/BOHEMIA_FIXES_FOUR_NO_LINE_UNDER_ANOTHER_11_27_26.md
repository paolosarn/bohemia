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
