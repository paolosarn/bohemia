# UI FOUR: THE STALL FITS ON ITS SIDE (11/18/26)

VAMILY rules 453 (the next round), 441 (fully baked: no screen that cuts words), 402 as amended 11/7 (SMALLER, NEVER PAGES), 454(a).
The first job on this lane's own list, named in its three 11/17 handoff blocks. The coordinator's routine "UI FOUR next".

## Measured before (main c869a5ed; the town screen as the shell lays it, and the demo)
A fortress's stall where a trade good is made (CARAVANS' coffee and chile, ANARCHISTS' mountain timber), the phone on its side
(844 x 390): at UI 9's last step the sheet ran 37 px past its box, 57 in a town whose rows also say THEY NEED IT (the demo, 11/17);
the line that says how to buy ('Tap a price to see it. Tap it twice to buy or sell.') stood off the glass. Upright the same stall fit.
Five goods stand two across, so the sixth place, beside the roll of tape, was empty; under them three one-line notes each took a
whole row of their own (the shelf's count, 'TRADE GOODS: BUY WHERE IT IS MADE, SELL WHERE IT IS NOT', 'YOUR GEAR: NOTHING IN THE
STASH').

## Now: one more step, smaller, never a page
slices/BOHEMIA_SETTLEMENT_SCREEN.html, __THE_STALL_FITS_ON_ITS_SIDE__, beside the hall's step of 11/17 (the same #sheet.ui4-tight,
taken only when UI 9's last step still does not fit, taken off before UI 9 measures again; UI 9's file untouched):
- the three one-line notes stand in the empty sixth place, one over the other (the gear's note only while it is the bare 'nothing in
  the stash'; with gear to sell it keeps its own rows);
- a row gives up its two points of air (46 to 44; the BUY and SELL buttons keep 44);
- the trade good's row and the how-to-buy line are on the glass.
Only with an odd count of goods two across on a glass wider than tall; any other stall is as it was. No word changes (454(a)).

## Proven
- Gate NO LINE CUT WHILE THERE IS GLASS, new leg L5 THE STALL ON ITS SIDE: CARAVANS' fortress stall sideways, the sheet past nothing,
  every row, note and the how-to-buy line on the glass, the notes in the sixth place lying on nothing, every button 44 px; upright as
  it was with no step taken. --plant: the step never runs, L5 red (37 px past, the how-to-buy line off the glass). 14 passed, 0
  failed with three plants (L1, L4 the fullest hall, L5).
- On the demo and beside it: in the handoff block.

Picture: records/target/ui4_the_stall_fits_on_its_side_11_18/before_and_now.webp (the demo's fortress stall sideways: before on top,
the how-to-buy line gone; now below).

## Rule 459 (THE BATTERY IS REAL): how a sum is drawn, this lane's half of the agreement with ECONOMY TWO
Written here and in handoffs/UI_FOUR.md for ECONOMY TWO, whose one price table decides the numbers. Nothing is built from it until
the table is written (459(d)).
1. THE UNIT IS THE AA, drawn as it is now (BUILD 11/17f, the kit's battery and a count).
2. A BIG SUM IS BIG BATTERIES, EACH DRAWN AS THE THING IT IS, biggest first, a picture and a count for each kind: a car's battery,
   a tool pack, a phone's battery, an AA. Never a long number: no count over 9 except where the table says a kind has no bigger one.
3. THE KINDS AND WHAT EACH IS WORTH COME FROM ECONOMY TWO'S TABLE, never from the UI's code: this lane reads a list of
   { id, worth in AA, picture } (the research's own: a phone charge about 6, a tool pack 20, a car's battery 250).
4. ONE DRAWER FOR EVERY SCREEN: BohemiaItemCard.sum(n) will return the same chips EVERY COUNT A PICTURE makes (the words stay in the
   page at no size, so a reader hears '387 batteries' and every gate that reads a price still reads it); a price tag, a job's pay,
   a hire, a build's cost and the top bar all call it.
5. THE THREE NEW PICTURES (a phone's battery, a tool pack, a car's battery) are art: DIRECTION's and COOK's, MADE FROM the packs;
   this lane draws none and ships a STAND-IN only if the table lands first.
ASKED OF ECONOMY TWO: the table's file and field names, and whether a sum is paid exact (387 = 1 car, 6 packs, 2 phones, 5 AA) or
rounded to what a crew would count out.

[bb Battle Brothers' market is one fixed screen; a note never takes a row a good could stand on.]
[analog horror: the stall's chalkboard, three lines squeezed into the corner where a price was wiped off.]
