# THE TOP BAR, THE DAYS ONCE (UI, 10/22/26, ui-the-days-once)

Row: UI [the top bar, the days once] ONE-COUNT-NOT-THREE, FIRST on the board. Built into the game (rules 121(g), 123; the
coordinator's 10/22 order: pick the best of the three yourself, EVERYTHING IS A THUMB, he meets it playing, no new card).

## His words

- 10/19, to the coordinator: "I still don't like the top bar at the top of the screen. Like, you could put so much things in
  the more in the top of the screen. And then during combat, like, it doesn't go away."
- 10/19, his NO on ui-the-top-bar-10-19 (A / B / C): "How many times ur gonna show how many days asshole?"

## What was twice, measured on the three candidates (records/BOHEMIA_THE_TOP_BAR_10_19_26.md)

Every one of A, B and C printed DAY 1 on its tag AND '0 DAYS' on the food (the food's days, worked out because the day eats
one), so the word DAYS was on the bar twice and the same number could be read two ways. The hour was twice too: 06:00 on the
tag and 06:00 on the phone's own clock, a hand's width away. That is three facts printed five times.

## The pick: B, with every fact once

B, because it carries the most (his 'you could put so much things in the top') and keeps the stores in one row (his vote A on
ui-the-six-in-the-bar-10-1). Changed from the card:

- THE DAY once, on the left tag: DAY 1 beside a drawn sun (or moon) riding an arc over a horizon by the hour, Battle Brothers'
  day dial as a mark. No hour's digits on the bar: the hour is the phone's clock, which the city's bar already keeps in step
  with clockStr() every half second.
- THE FOOD a count, never days. The day eats one (BohemiaPurse 'day:ate', EVERYTHING COSTS ONE), so the count IS the days;
  it is printed once, as the count, red-inked on a receipt chip under three.
- THE CREW: the drawn man, 3/12, a tick of health a man. A readout, not a press (the crew button's wiring is RUN TWO's).
- THE STORES on one pane of glass: batteries 240, food 0, meds, rounds and water as dashes (the game counts none of them;
  ECONOMY round 55), tape left off (dead, his eleventh votes). Then where you are (SUBURB) at the glass's right end.
- THE GEAR and NOTES at the right end, 44 points each. NOTES is the city's own button MOVED (its handler kept). The gear is a
  receipt tag that presses the shell's own gear; the shell's floating gear steps aside while the bar's can be pressed (read
  every half second through elementFromPoint, so a screen over the map gives the floating one back).
- Upright two rows (the presses on top, what you have and where under them), 100 points. On its side, and on any screen 700
  wide, one row, 60 points.
- The item icons are the game's own drawn six (BohemiaMaterials.supplyIcon), untouched: COOK converts the icons this round.

## The fight: nothing across the top

The strip across the top goes. Its three things ride the bottom bar's top edge, MOVED, never cloned: the round on a receipt
tag, the turn order's faces at 36 points, AUTO in the fight's own tag (a tap still flips the fight's AUTO). The fight's own
hudEdges() reads TOPH 0 by itself, so the board runs to the top of the glass. Measured upright: TOPH 0, BOTH 180 of 844
(was 58 across the top plus about 128 under: the board gains the strip and loses nothing); 5 faces in the row; AUTO
false -> true -> false.

On its side, a tablet and a computer the turn row takes ITS OWN LINE along the bar's top edge. Found by the hit read's own
gate: in one row the turn row (284 points) left STRIKE 46 points, and the hit read widens STRIKE to 96, so its '29%' was
squeezed onto the cardboard (1.11 to 1). Its own line keeps the skills their whole width.

## Where it lives

slices/bohemia_ui_materials.js, topBar() and fightNoTop(), applied by themselves on the page that has the city's bar and on
the page that has the fight's strip. The city file, the fight file and the shell are untouched (ONE SYSTEM, ONE SESSION); the
demo loads the materials file live, so no re-cut is needed for the map or the fight to carry it.

## Proof

- gates/the_days_once_gate.js, in the suite as THE DAYS ONCE: on the demo, upright and on its side: DAY once, DAYS never, no
  hour's digits on the bar, the phone's clock is the game's hour; every count the game's own (day, batteries, food, crew);
  dashes for what is not counted; the food red under three; gear and NOTES 44+; fits, no overlaps; the gear opens the
  settings and the floating gear is off the glass; NOTES opens and closes; every word 4.5:1 plain and in the sun; in a road
  fight the strip is gone, TOPH 0, the three ride the bottom bar, AUTO flips. Four planted defects caught ('0 DAYS' back, the
  hour back on the tag, a 40-point gear, the strip back over the fight).
- The gates that held the old bar's layout are re-aimed or noted below.

## [bb interface]

Battle Brothers' world bar is one strip of stores with a day and a sun dial, never the hour in digits; in a fight the world's
bar is gone and the turn order sits with the man's skills. Ours now does both.

## [better than bb] (rule 80)

The food reads as a red receipt chip the moment it is under three days, on a phone in the sun, without a hover.

## Analog horror line

The day is a sun crawling over a printed horizon on a till receipt; the food runs out in the receipt's one red ink.

## Did not decide

Whether the crew becomes faces when the rig's heads are rendered for the bar (rule 121(e)); the three-day threshold (a draft
for TUNING); the crew tag becoming a button (RUN TWO's company screen).
