# UI THREE: EVERY STAT A BAR IN THE HALL, AS THE GAME LAYS IT (11/10/26)

Asks 145 and 146 (rules 223 and 224), round three, the next of rule 425(a) ("the months of jobs"). The coordinator's routine
"UI THREE: ship or report" (11/10): stats as icons and bars everywhere, green up / red down arrows, inside UI 9's sizes and
rule 433. Session UI THREE (claude session 01GKDyuvPvmndtYsPNo59Yab).

## His words
- 10/26 (rule 223): "behind the numbers, like a progress bar, how far it is from the maximum that's even possible... remember,
  I asked that."
- 10/26 (rule 224): "I'm tired of it just being numbers numbers numbers... more icons, more green up arrow, down red arrow."

## Measured before (the demo, main d97cecd3, through the title, a town, a tap on the hall)
Walked on the phone upright and sideways, every number on the glass listed (scratchpad walk, the map, the hall, the crew screen):
- THE CREW SCREEN: every man's eight are the bar to the most possible, the tick, the arrows (rounds one and two). Kept.
- THE MAP: the numbers on the glass are the bar's five counts (batteries, food, tape, med, rounds) and the clock, which rule
  224 keeps by name. Kept.
- THE HALL: UI 9's dense row (rule 402: a man is one row, slices/bohemia_ui_no_scroll.js, #sheet.ns-d1) lays each of his eight
  as its icon and its number and flattens the bar: the fill a 2 px line as wide as the number alone (14 px of a 42 px column),
  no track, no tick. 8 stats x 4 to 5 men: the most possible was nowhere in the hall, the one screen where he compares men to
  hire. The talent marks sat on the next stat's icon.

## Now
In the SAME cell (UI 9's 15 px height, UI 9's column; nothing of UI 9's file touched): the icon and the number on top, and under
them the stat's bar the whole width of its column:
- a track to the most possible (the receipt's ink at 7 percent, a 1 px edge), 4 px tall;
- the fill translucent to his number (his trait on it), the trait's part lit green up or red down (RUN THREE's trait, rule 223);
- the faint tick at his own ceiling (TUNING's bar.tick.own_ceiling);
- the talent marks inside the stat's own cell, after the number.
Phone upright: a column 42 px, HP 54 of 133 fills 17.0 px (17.1 wanted). Phone sideways: 32 px, 12.8 (12.9). Every row within a
pixel on the demo itself.

Where he meets it: the HALL in every town of the CITY (tap a town, tap the hall); the phone upright and sideways.

## How
slices/BOHEMIA_SETTLEMENT_SCREEN.html, inside my __UI_THREE_STATS__ block (the bst-hall-css style): seven rules under
'html body #sheet.ns-d1:not(#ui3-a):not(#ui3-b) .hire .hstats' (three ids beat UI 9's one): the row a positioned box the width of
its column with 4 px of its own padding at the bottom, its ::after the track, the fill, the lit part and the tick placed on the
row's bottom (so their percent is of the column, not of the number), the icon 11 px. UI 9's file and the loading menu untouched.

## Gate: STATS ARE BARS AND ARROWS, IN HIS ORDER (gates/stats_are_bars_in_his_order_gate.js), new legs HD1 and HD2
UI 9's fit planted the way the shell plants it (bohemia_ui_materials.js, then bohemia_ui_no_scroll.js), on the phone upright and
the phone sideways (rule 441(a)):
HD1 every card's eight: the track the width of its column and seen; the fill his number over the most possible of that width,
within a pixel, translucent, starting at the column's left, under the number; the tick at his ceiling within a pixel.
HD2 nothing changes size: every card, every eight's box and every stat's cell the same rectangle within a pixel with UI THREE's
dense rules taken out (the CSSOM, then put back).
Plants: the dense hall flattened back (HD1 red); the bar growing its cell (HD2 red). The gate 47/0 with nine plants.

## What is not done (said plainly)
- [icons not numbers] (146): the phone's apps, the end screen, the meet card and the job card are still not counted.
- THE FIGHT'S OWN WEAPON CARD is COMBAT's file (BohemiaItemCard.card waits on its board).
- NAMED, NOT MINE: sideways, the hall's RETINUE rows (the paymaster, the lookout, the cook) run past the glass (SCROLLING IS
  ILLEGAL N8/N9 red on clean main); RETINUE and UI 9 own it.
- EYES has not seen it (rule 179): BUILT, NOT YET SEEN.

Pictures: records/target/ui3_stats_are_bars_in_the_hall_11_10/before_and_now.webp (the hall on a 390 x 844 phone, twice the
pixels: before, now, and now sideways).

[bb Battle Brothers' hire screen shows a recruit's eight as bars to the game's top, the number on the bar; ours keeps UI 9's one
dense row and lays the bar under the number in the same cell.]
[analog horror: a pawn ticket's columns, each stat a gauge strip printed under its number, the needle's ceiling a faint pencil
mark.]
