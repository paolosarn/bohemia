# THE TOP BAR: MORE ON THE MAP, GONE IN THE FIGHT (UI, 10/19/26, ui-opus-h)

Row: UI [the top bar] MORE-IN-IT-AND-GONE-IN-THE-FIGHT, FIRST on the board (rule 121). A candidate in VOTE; nothing in the game:
the city file, the demo shell and the fight file are untouched. Every bar is laid over the real screens in the browser by a tool
and photographed from the game's own camera on his phone (390 x 844, and on its side 844 x 390), one css pixel a pixel.

## His words (10/19, to the coordinator)

"The UI is still ass. I still don't like the top bar at the top of the screen. Like, you could put so much things in the more in
the top of the screen. And then during combat, like, it doesn't go away. Like, it's all fucked up, bro."
(records/BOHEMIA_PAOLO_THE_WORK_WEEK_FOUR_LANES_AND_THE_3D_MODELS_IN_10_19_26.md)

## Measured first, on the demo as it is (BUILD in the front splash at the time of the shots)

- THE MAP'S BAR (the city frame's #menubar, 50 points): six stores at 10 pixels (batteries 240, food 0, then meds, rounds, tape and
  water as four dashes because the game counts none of them), the hour (06:00, the day dropped), the place (SUBURB) and NOTES.
  The game's SETTINGS gear floats under it on the map as its own dark rounded box (the shell's #gearbtn, 44 x 44 at 8, 69), a
  symbol glyph in the phone's own font.
- WHAT THE GAME KNOWS AND THE BAR DOES NOT SAY: the day (clockStr() says DAY 1 and the bar cuts it off); the days the food lasts
  (the day eats one food, BohemiaPurse VERBS 'day:ate', EVERYTHING COSTS ONE, so 0 food is 0 days, and nothing on the screen says
  so); the crew (the front door's picks hand the fight the company: three men on the default origin, Battle Brothers' three
  companions 2-HAND, 1-HAND and RANGED, under a field cap of 12).
- THE FIGHT: the map's bar does NOT leak into the fight on any of the four screen classes (measured upright, sideways and on a
  computer: the fight's frame covers the city). What stays across the top is THE FIGHT'S OWN STRIP: the round (R1), the turn
  order's five faces on tape and AUTO, 58 points upright (52 sideways) over the board, on a dark fade; on a computer the hint rides
  in it too. The fight measures its board against that strip (hudEdges(): TOPH 58), so the board starts under it.

## How Battle Brothers did it (the first answer, rule 41; library vol 10, the BB school rounds one, three and nine)

On the world map Battle Brothers keeps its stores in ONE ROW at the top: crowns, food with the days it lasts, tools, medicine,
ammo, plus the day and a time-of-day sun, never taken off, a mark and a number each; the company is a row of faces with hitpoint
and morale rings. The player reads them at a glance while the party travels, because travel is what spends them. In a fight the
world's bar is gone: the turn order is a strip of faces and the active man's skills sit at the bottom. The HUD is a FRAME; almost
nothing floats on the world.

## The three bars (the card: A / B / C / NO), every fact the game's own

- A, ONE ROW (66 points upright, 66 on its side): DAY 1 over 06:00 on a receipt tag; one pane of glass with the batteries (240),
  the food's days on a red-inked receipt chip ('0 DAYS', the red when under three), and the crew: a drawn man, the count (3) and a
  tick of health a man; the gear; NOTES. On its side the crew says CREW 3/12 in words.
- B, TWO ROWS (116 upright, 66 on its side): DAY 1 06:00, SUBURB, CREW 3/12 with the ticks on paper, the gear, NOTES; under them
  the stores at his packs' pixels (the 10/13 set he said yes to): batteries 240, food '0 DAYS', meds, rounds, water as honest
  dashes (tape stays dead, his eleventh votes). On its side the two rows are one.
- C, THE COMPANY ON TOP (119 upright, 69 on its side): a drawn sun (or moon by the hour) beside DAY 1 06:00, batteries and the
  food's days, the gear, NOTES; under them a card a man: what he is (2-HAND, 1-HAND, RANGED), his level (NEW: the origin file
  gives level 0) and his health as a bar, then CREW 3/12. On its side the cards join the one row (eight fit).
- ONE FOOD A DAY MAKES THE COUNT AND THE DAYS ONE NUMBER, so the bar prints it once, as days. If ECONOMY ever bills more than one
  a day the bar prints both (the lay already does).
- HEALTH: the game brings every man to the next fight whole today (the company is background and level only; the fight keeps its
  wounds inside the fight), so every tick reads full. The lay reads a man's hp and hpMax first when COMBAT carries wounds out of
  the fight (rule 27's 30 to 40 days); nothing on the bar invents one.
- THE GEAR moves into the bar's right end on every bar as a receipt tag with a drawn pixel gear (the symbol glyph resolved to the
  phone's own font, rule 114). The real button is moved, its handler kept.

## The fight, the same in all three

The strip across the top goes away; its three things ride the bottom bar's top edge, the round on a receipt tag, the turn order's
faces at 34 points, AUTO on a receipt tag (moved, never cloned: a tap still flips the fight's AUTO). The fight then measures its top
edge as 0 and the board runs to the top of the glass: upright 78% of the glass is board today and 79% after (the bottom bar grows
by the faces' row), on its side 67% today and 80% after (the turn row joins the one-row bar). Nothing crosses the top.

## The numbers

- Every word on every bar against the ground really under it (a second shot with the ink made transparent): 60 words, worst
  8.50 to 1 plain and 4.84 to 1 under a flat 25% white (the sun, rule 73). Two inks moved to get there and both are measured:
  the glass's gold is #ffd98a on glass darkened in its own pixels (the old #f0c46a read 4.39 in the sun), and the low-food red
  is #4a0a05 on a receipt chip (a light red on the glass read 3.2; the hit read's #6e140c read 3.8 on this paper).
- Every press 44 points or more, the gear and NOTES on every bar.
- Fits his 390-point phone on all three; A overflows a 320-point phone by 8 points (not his phone; the wiring trims the gaps).

## Proof

- Gate: gates/the_top_bar_gate.py, in the suite as THE TOP BAR: 10/0, six planted defects caught (the food without its days, a word
  at 3 to 1 in the sun, a 40-point NOTES, a gradient in the lay, the strip left on in the fight, AUTO lost).
- Tools: tools/bohemia_ui_the_top_bar_lay.js (the bars and the fight laid in the browser only, from the materials file's own
  cardboard, receipt and glass; __bmTopBarFacts() reads the game), tools/bohemia_ui_the_top_bar_shots.js (the demo through the one
  driver, both sides), tools/bohemia_ui_the_top_bar_sheet.py (the sheets, the first picture, the word reads),
  tools/bohemia_ui_the_top_bar_register.py (the card, spliced as text).
- Sheets: records/target/ui_the_top_bar/UI_THE_TOP_BAR.png (upright: NOW, A, B, C, then the fight NOW and after) and
  UI_THE_TOP_BAR_SIDEWAYS.png; the reads in records/target/ui_the_top_bar/manifest.json. The raw shots are not committed (the
  sheets carry every crop; the shots tool makes them again in four minutes).
- VOTE: ui-the-top-bar-10-19 (A / B / C / NO).

## For RUN and COMBAT, after his pick

- RUN (the map, the demo's cut): the bar he picks replaces the city's #menubar contents through the materials file (a dress
  function like dressMapBar, reading __bmTopBarFacts()'s same game calls), the shell's gear onto the bar's slot; the cut and the
  stopwatch are RUN's.
- COMBAT (the fight): #top goes; #round, #order and #bauto move into #bot's top edge (the lay's __bmFightNoTop() is the whole
  change, about ten CSS lines and one DOM move; hudEdges() then reads TOPH 0 by itself).

## [bb interface]

Battle Brothers keeps the stores, the days of food and the clock in one row on the map and takes the world's bar off in a fight;
ours does the same, and says the days the food lasts in red when it is the thing about to kill the company.

## [better than bb] (rule 80)

Read in the sun on a phone, never hovered: the food's days are printed, not worked out, and a man's health is on the map's bar.

## Analog horror line

The days of food are printed on a till receipt in the one red the paper has: the bill the valley is about to send you.

## Did not decide

His pick of A, B or C; whether the crew's ticks become faces when the rig's heads are rendered (rule 121(e): a face is a render
of the rig's own head, never a flat portrait, so none is used here); the low-food threshold (three days, a draft for TUNING).
