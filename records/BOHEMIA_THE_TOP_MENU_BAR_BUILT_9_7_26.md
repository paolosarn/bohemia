# THE TOP MENU BAR IS IN (9/7/26, UI lane 11)

PAOLO 9/7: *"I'm thinking we need a top menu bar like how Battle Brothers has it, how
Civilization five has it, Surviving the Aftermath has a... Surviving Mars has a, you know,
shit like that, bro. Top menu."*

Law: `laws/BOHEMIA_ADDENDUM_THE_TOP_MENU_BAR_9_7_26.md`. Gate: `gates/top_bar_gate.js`,
**12 ok, 0 failed**. Picture: `slices/BOHEMIA_THE_TOP_MENU_BAR_9_7_26.html`.

## WHAT WAS THERE
Not a bar. Two things that did not know about each other: a `#hud` line of readouts, and
`#topbar`, five chips floating on top of the world underneath it. A pile in a corner,
which is exactly what all four of his references are not.

## WHAT IS THERE NOW
One strip, 390 wide on a 390 phone, pinned to the top edge, 22 px tall, with the world
starting underneath it at 22.

    HUMAN MODE   SUBURB · ON FOOT        DAY 1 · 06:00        MUSIC SAVE PHONE OUTFIT

Status left, the day and clock centre, the menu off the right end -- the shape all four of
his games share. The chips were **moved, not rebuilt**: every one keeps its own element,
id and click handler, because the half-size module, the teaching overlay and the demo
cutter all address those exact nodes by id.

## *** THE CONTRADICTION HE WALKED INTO, AND WHY THE BAR IS NOT A SPREADSHEET ***
Two of the games he just named are already in this repo as an **anti**-reference, from him,
LOCKED: `laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md` (7/26) --
*"games like that are called spreadsheet simulators and I'm not a fan"* -- banning the
Civ-5 / Surviving-the-Aftermath multi-currency feel.

Newest date wins, but newest-wins settles a conflict; it does not delete the older ruling
wholesale, and these two are not the same subject. **7/26 banned the multi-CURRENCY feel.
9/7 orders the BAR.** A layout is not an economy. So the bar ships and the three-currency
cap still stands, and the line between them is a number: this strip may never show more
than three currencies. A fourth is the spreadsheet arriving by the back door.

## AND IT SHOWS NO MONEY AT ALL, ON PURPOSE
A Civ-5 bar is mostly money. This one has none, because **nothing on the walked surface
holds a purse.** `PURSE` exists as a module with three currencies and a ledger; no street
code holds an instance, and ECONOMY's own round 27 says the day loop does not close. So
any number up there would be invented, and an invented readout is worse than an empty one
because he cannot tell them apart by looking.

The bar reads money through exactly one function, `BOHEMIA_BAR.money()`. It returns null
today. **The slots appear by themselves the day a purse is wired**, with no further design
and no second place to change. The gate asserts the emptiness, so this cannot quietly
become a fake.

## WHAT WENT WRONG ON THE WAY, ALL OF IT CAUGHT BY MEASURING OR LOOKING
**1. The bar was lying on top of the game.** First cut pinned it absolutely and pushed the
world down with a hardcoded 22 px margin. Measured: the bar was 51 tall and the world
started at 28 -- the strip was lying across the city, the floating pile wearing a bar's
clothes. Fixed by putting the bar in normal flow, so the world starts wherever the bar
actually ends, at any height or text size. One number instead of two, the same lesson the
walk ring taught an hour earlier.

**2. The chips woke their old absolute positioning the moment they left `#topbar`.** Every
chip still carries a sandbox-era `position:absolute; left:NNNpx; top:10px`. Inside
`#topbar` that was dead, because `#topbar > *` forced `position:static !important` over it.
Re-parent them and the override stops matching: measured, MUSIC landed at 12,10 and SAVE at
110,10, both outside the bar's own right-hand box, with PHONE and OUTFIT stacked on each
other. **This file already records the identical bug** -- the RUN lane moved three chips
into `#devtray` on 8/16 and the drawer rendered as a row of overlapping chips for exactly
this reason. It is written down four hundred lines above where I was working, and it still
cost a pass to rediscover. That is the argument for reading before guessing.

**3. And the OPTIONS SHEET lied about the game three times before it told the truth.** The
mock bar was drawn in a 330-wide card while the real screen is 390, so it squeezed things
the shipped bar does not squeeze: the left readout cut to "HUMA", then the clock crushed to
"06", then "ON FOOT" lying across the date. Every one of those would have shown him a fault
that does not exist. Fixed properly: the mock is now laid out at the true 390 and the whole
picture is scaled down to fit the card, with the readouts at 7 px and the chips at 5 px,
which is what they actually measure on the page after the half-size order. **A picture that
cannot fit what the game fits is not a picture of the game.**

## WHAT THE PICTURE OFFERS
Five cuts of the same bar, each on a phone, each with what it costs and what it gets:
**A** what shipped (Battle Brothers shape), **B** the slab with the money slots up front
(Surviving Mars), **C** the thin see-through line with icons only, **D** rustic 2050 with
brass edges (Fallout 1, already this game's act-one interface reference), **E** two decks,
status over menu (Civ 5).

## STILL TRUE AND NOT FIXED
The shell's gear button still floats over the world at the top-left. It is drawn outside
the city frame, so the city's stylesheet cannot reach it -- the same known gap the
half-size round recorded. It sits over the world, not over the bar.
