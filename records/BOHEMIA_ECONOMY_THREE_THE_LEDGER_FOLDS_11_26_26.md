# THE LEDGER FOLDS, AND THE TWO REDS WERE THE CHECKS (ECONOMY THREE, 11/26/26; VAMILY rule 480(b)(c), ask row 685)

Rule 480 (Paolo 11/26): a full sweep, improve what is already in the game before adding anything, frames never choppy.
480(b) on the money as built: every price from the one table, every price makes sense next to the others. 480(c): no money
screen costs a frame. Gate: gates/the_ledger_stays_small_gate.js (THE LEDGER STAYS SMALL, in the suite, data legs).

## 1. THIS LANE'S TWO REDS WERE THE CHECKS, NOT THE GAME (no player-facing number moved)

- NO RUN ENDS FOR TAPE N1 (red since 11/2). The tape bench paid every won fight the board's LEAST job. Since rule 323
  amended (Paolo 11/2: 'quests that don't have any combat, you shouldn't be getting as much batteries') the least job is a
  WALK with no fight in it (10, the quiet floor: qd-s08 the ballot box, qd-ap09 the barber's cells), so the bench charged a
  fight's tape against a walk's pay: 60 to 74 percent of the pay on tape. A walk breaks no tape. The bench now pays a won fight
  the board's least KILLING job a fight (its pay over its fights): 30 (qd-s10). A new crew spends 20 to 25 percent of its fight
  pay on tape, in the black every month from every home: what Day 85 measured when the bar was set ('a fifth to a quarter').
  New leg N0 holds it (a won fight is never paid from a walk's quiet floor). THE BLOCK WATCH (twelve men on one-skull jobs)
  stays named on TUNING's board, as Day 85 said: a company that size is meant for bigger jobs.
- A JOB PAYS FOR THE TIME AND THE RISK (the purse probe, day 50 x2.04). The probe compares the old pay rule with the new on
  the same jobs, and 30 jobs that came onto the board later (JOBS' board people) had 'before 0' in the table, so the old purse
  was handed nothing for them and the new one looked doubled. Under the old rule they would have paid the board's a skull (30).
  Like for like: day 30 x1.27, day 50 x1.31, a map hour x1.30. Green, and the curve is a raise, not an explosion.

## 2. THE MONEY BOOK NEVER LET A LINE GO (480(c))

MEASURED on the demo (a new crew, the valley K7QM9X, the map crossed at the party's pace for four map days): the purse grew
40 to 67 lines a map day, about 128 bytes a line; 164 of the 170 lines were RENT, handed over ONE BATTERY AT A TIME. The purse
rides in the autosave the map writes after every change (citySnapshot, posted up and written to the phone's storage), and the
phone gives every key together about five million characters. At the old rate a long game reaches that in a few hundred map
days, and every save on the way is slower to write.

THE FIX, the truth kept (engine/bohemia_purse.js fold; the map calls it every nightfall after the night's money, and once as
an old save loads):
- every line older than 30 map days goes into ONE line per currency, act, kind and sign ('brought forward: N older lines to
  day D'); positives first, then negatives, so the history never dips under zero; the sequence is whole again;
- every balance, every act's balance (rule 31's derive) and every kind's flow (faucets and sinks) is the same to the battery;
- the last 30 days stay line for line (the day's double-pay checks and the night's tally read today and last night);
- the newest old line of each of the four verbs stays whole (the hunger count walks back to the last day they ate);
- a line a reader tells apart by its reason (the pockets' opening stock) is pinned by the caller.
- RENT IS NOW ONE HAND-OVER A FACTION A NIGHT for what he can pay of it: the same batteries paid, the same short, the same
  lights put out. The price a block is the table's (var RENT_A_BLOCK, battery_table copy, one AA).
- Rolled 2,000 map days: 58 KB and 443 lines folded, where never folded it is 4.0 MB and 31,350 lines (and that is with the
  rent already one line a faction).

## 3. AFTER A RELOAD THE RENT WAS PAID FROM NOBODY (480(b), a bug in the money as built)

MEASURED on the demo: a spend, the tab killed, CONTINUE: the bar read 283 and the pockets book's 'player' purse read 0. The
book adopted the purse the boot made and never the one the save loaded, so after every reload each night's rent was refused
(nothing paid, and the landlord put the lights out for it), and every other hand-over from the player (a crew event's pay,
a loan, a market move) drew on an empty purse. ADOPT, NEVER CREATE: the loaded purse is adopted as it loads.

## 4. RENT AS BUILT, FOR TUNING (measured; not moved: the 9/12 block rent is a ruled design and EVERYTHING COSTS ONE)

One AA for each billed block of a faction's ground crossed that day (a camp bills a third of the blocks, a town two thirds, a
fortress all). A job 6 to 10 blocks out crosses about 8 blocks each way on the same road: about 3 to 8 AA a night, a tenth to
a quarter of a one-skull job's 30 to 38. EYES saw 34 in one night (10/25); this lane's drive, which crossed the whole valley
four times a map day, paid about 60. A crew that roams all day pays more rent than it spends on tape; that is the landlord's
point, and the player's answer is his own power (OWN POWER takes his blocks off the line) or holding the ground.

## 4b. A HIRE NEXT TO HIS WAGE (480(b), read, nothing moved)

The hall prices a man at Battle Brothers' hiring formula (his roll in the base range, his kit) times four fifths, at ten
crowns to the battery: a plain man about 16 to 32 AA. His wage is his background's wiki wage over ten (engine/bohemia_wages.js):
a farmhand 1 AA a night, a hedge knight 4. So a hire is about one one-skull job's pay and 16 to 32 nights of his wage, Battle
Brothers' own ratio (a hire about 20 to 40 days of wage). It reads right next to a job (30) and a man's food (2 a night).

## 4c. THE PIT AND THE FOOD NEXT TO A JOB (480(b), read, nothing moved)

- THE PIT (records/target/bb/arena.json): a night's purse 35 for a new fighter, rising with his wins to 75 at fifteen, 5 more a
  head when they send extra; a tournament's three rounds 60, 90 and 150 (300 for the three). A one-skull killing job pays about
  30 a fight with the walk in it, a two-skull 60, a three-skull 90: the pit sits between them a fight, and it is one a night in
  a town that has one. It reads right.
- FOOD: a man's night of food and water is 2 at the stall (a can and a bottle) and 2 on the night's bill; the walked city's
  market sells every good at 1 (a bag of rice, rule 9/4). The same number everywhere he meets it.
- THE ROAD (records/target/BOHEMIA_ROAD_EVENTS.json, 81 stops, 128 amounts): a stop takes 6 and gives 10 at the median, a road
  fight won pays 24 to 34 (a job's fight), next to 3 to 8 of rent a night. The largest, the rodeo man's bullwhip at 60, is under
  the shops' 98 for it (weapons.json value 980 at ten to one), and his other price, four nights of food, is the famine trade
  (food is worth most to a hungry man: sieges and crashes traded heirlooms for bread). It reads right; nothing moved.

## 5. NO MONEY SCREEN COSTS A FRAME (480(c), measured)

tools/bohemia_economy_three_money_frames.js: the demo on a phone upright, the CPU slowed four times with the canvas on the GPU
(JOBS TWO's shape), a new crew: the map, the town, the stall, a buy, the smith, back to the map. The money's own time (every
sample whose stack holds a price, the purse, the wages, the job pay, the bar's money paint or a stall or shop price row) is
counted apart from the town picture, the phone's board and the job board, which JOBS TWO already routed. Numbers in
records/target/economy_three_11_26/money_frames_demo_phone_portrait_x4.json.

| step (the demo, upright, 4x slowed) | frames a second | the money's own time | the page busy |
|---|---|---|---|
| the map, the bar still | 26 to 43 | 2.6 to 4.1 ms a second | about 1,000 ms a second |
| the town opens / still | 5.8 / 6.8 | 3.7 / 4.1 ms a second | the same |
| the stall opens / still | 6.3 / 6.6 | 7.9 / 1.0 ms a second | the same |
| a buy at the stall | 7.6 | 4.8 ms a second | the same |
| the smith opens / still | 4.6 / 5.9 | 7.0 / 1.2 ms a second | the same |
| back to the map (the bar counts down) | 11.1 | 2.5 ms a second | the same |

The money is under one percent of the page's busy time on every step: NO MONEY SCREEN COSTS A FRAME. The biggest piece is the
bar's bill publisher (billPublish, about 2 ms a second at 4x, half a millisecond on a real phone), which runs on the bar's
half-second read. The town's frames are the town picture's per-frame fill, the idle sheets' warm-up and the map's blits (JOBS
TWO's profile, routed to PLUMBER 8, RUN TWO and COOK FOUR). The bar's money is now written only when it changed (it was
rewritten every second). SEEN ON THE WAY, NOT THIS LANE'S: at 4x the stall's double tap did not buy (two taps 120 ms apart
through the slowed page land past its 450 ms window), which is EYES' find in rows 724 to 732.

[bb Battle Brothers keeps no ledger the player can see; its crowns are one number. Ours keeps the ledger for the truth and
folds it so the save stays a phone's size]
[analog horror: the money book's old pages torn out and pasted into one, BROUGHT FORWARD in a shaky hand]
