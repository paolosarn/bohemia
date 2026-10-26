# TUNING 10/26: THE TAPE PRICE AGAINST THE PAY (rule 284(e); research only, rule 38g)

The coordinator, from ECONOMY 5a739556 (records/BOHEMIA_ECONOMY_DAY_85_THE_TAPE_BILL_ONE_ROLL_A_FIGHT_AND_THE_REST_IS_BOUGHT_10_26_26.md):
at one roll a won fight, twelve men buying the rest of their tape spend 70 to 97 percent of their pay on ordinary jobs. The loot stays
at one, never above three without his word. The lever is the stall's tape price or a fight's pay. Measure and set it in the one table so
a run keeps its armour up with real money left over, the way Battle Brothers' tools are a cost but not the whole purse.

Bench tools/bohemia_tuning_the_tape_price.js (new). Part one plays the LIVE fight (main 6585e7a4, rules print adf6f52ced29; AUTO both
sides; the watch's seeds) 100 fights a company and reads, at the bell, the tape the fight broke (the living men's helmet and body
points lost over condition.json's 15), the men of theirs beaten, and what the loot sells for (the fight's bodies through
engine/bohemia_spoils.js found(): Battle Brothers' drop conditions; its sellBack: the shop's seventh of the worth left; the shop's
price max(1, value / 10)). Part two is ECONOMY's own purse (the home stall's shelf and back room through engine/bohemia_stall_prices.js,
food 2 a man a night, five fights a map day, 30 days, 300 rolled runs, the median run) with three incomes ECONOMY's model left out
switched on one at a time: the job's skulls by the company's size (party_math.json job_bb), the loot sold, and the clout multiplier
(renown.json, the live engine/bohemia_renown.js arithmetic). Bank banks/BOHEMIA_TUNING_THE_TAPE_PRICE_10_26_26.json (draft:true).

## 0. THE ANSWER

1. **THE TAPE PRICE STAYS ONE A ROLL (the back room two). NO COMPANY IS UNDER WATER ON WHAT THE LIVE GAME PAYS.** Per fight our money
   is Battle Brothers' at ten crowns a battery: a roll is their tool point (200 crowns for 20, bb_all/2018), a skull is their contract
   line (30), the loot sells at their seventh. ECONOMY's 70 to 97 percent came from a model, not the game: it paid the twelve ONE skull
   (30) for fights against six to ten men, which the live party math deals the twelve as a TWO- or THREE-skull job (60 to 90); and it
   sold no loot and left the clout at x1.
2. **THE TWELVE, MEASURED:** on a true one-skull job of theirs (three or four men) they break 5.9 rolls and tape is 16 to 20 percent of
   the pay with nothing sold. On the six to ten ECONOMY gave them, paid by the job's size: 36 to 51 percent, 24 to 34 with the loot sold
   (+212 to +248 batteries a day left). A cost, not the whole purse.
3. **THE ONE LEVER THAT IS BROKEN IS THE PAY, THE OTHER WAY: THE CLOUT RUNS FIVE TIMES TOO FAST.** The live gains are Battle Brothers'
   per contract (+100 a job, +5 a man beaten) and we run five jobs a map day: the multiplier reaches x4.5 (4,000, 'Legendary') in about
   a WEEK, a crew of three is at 9,935 by day 30 (Battle Brothers' 'Invincible' is 8,000) and nets 636 to 659 batteries a day against
   6 of food. Money stops teaching (rule 151(b)). **THE NUMBER: the clout's gains on our clock, x0.2** (rule 264(g)'s measured pace
   ratio, 5.2): a job done 20, done in part 10, failed -15, cancelled -20, a won fight 1 a man beaten; an ambition stays 100. x4.5 then
   lands about day 38 for the twelve and day 60 for three men, with rule 255's danger (full by day 50): ONE CLOCK.
4. **AT x0.2 EVERY COMPANY KEEPS ITS ARMOUR UP WITH REAL MONEY LEFT:** tape is 11 to 18 percent of income over 30 days and 15 to 27
   in week one for three men and for twelve; the Lone Wolf on the jobs rule 255's curve offers him 17 to 25 percent (24 to 37 in
   week one). Battle Brothers' own guide: 'Tools and Supplies can be a major item of expenditure if enemies keep hitting party members',
   and 'Provisions are the only vital resource' (bb_all/0827 Game Guide, Economy). A cost he manages, not the purse.
5. **THE LONE WOLF'S BILL IS HIS BOARD, NOT THE PRICE.** In the watch's mix (dogs half the time) he loses 43 in 100 and breaks 15.5 rolls
   a fight (19.4 against beasts); under water from every home on ECONOMY's reading. On the jobs the day-fifty curve offers him (people,
   two or three: 36 of the 100) he wins 28 of 36 and breaks 8.8: in the black from every home even at one-skull pay with nothing sold
   (+52 to +72 a day). WORLD's OPEN [the danger ramps to day fifty] is his tape answer.

## 1. PART ONE: WHAT A LIVE FIGHT BREAKS AND WHAT IT LEAVES (100 fights a company)

| company | men | theirs (mean) | won | tape a fight | tape a won fight | loot sold a won fight | batteries carried | skulls by size |
|---|---|---|---|---|---|---|---|---|
| A NEW CREW (the door's) | 3 | 3.8 | 73 | 9.1 | 6.1 | 11.9 | 1.9 | 1.6 |
| THE BLOCK WATCH against 6 to 10 | 12 | 6.2 | 88 | 14.9 | 12.5 | 24.1 | 3.4 | 1.8 |
| THE BLOCK WATCH on a one-skull job (4 or 5 asked) | 12 | 3.4 | 100 | 5.9 | 5.9 | 11.5 | 1.5 | 1.0 |
| THE LONE WOLF (dogs half the time) | 1 | 2.7 | 57 | 15.5 | 9.5 | 3.0 | 0.7 | 1.1 |
| HIS CREW (rifle, two spear-and-car-door men) | 3 | 2.7 | 48 | 0 | 0 | 4.7 | 1.0 | 1.1 |

His crew wears nothing (the watch's HIS shape has no body or helmet), so it breaks no tape. A FINDING THAT PROVES ECONOMY'S TABLE WRONG
FOR THE NEW CREW TOO: its 22 to 27 batteries a day read the camp clock's pooled 'crew:2-3' group, which carries his rag-wearing three and
the spear crew; the door's new crew alone breaks 9.1 a fight, 45 rolls a day, a bill of 42 to 63 batteries a day.

## 2. PART TWO: THE PURSE (batteries a map day, the median 30-day run; from a camp / a town / a fortress)

| reading | A NEW CREW: tape share, left | THE TWELVE (6 to 10): tape share, left | THE LONE WOLF: tape share, left |
|---|---|---|---|
| A. ECONOMY's (one skull, no clout, nothing sold) | 0.58 / 0.44 / 0.38; +40 / +55 / +62 | 0.91 / 0.76 / 0.63; -12 / +8 / +24 | 1.51 / 1.28 / 1.10; -45 / -26 / -10 |
| B. the job's skulls by size | 0.37 / 0.28 / 0.24; +104 / +119 / +126 | 0.51 / 0.43 / 0.36; +90 / +110 / +127 | 1.41 / 1.20 / 1.03; -39 / -20 / -5 |
| C. B + the loot sold | 0.28 / 0.22 / 0.19; +154 / +169 / +176 | 0.34 / 0.28 / 0.24; +212 / +231 / +248 | 1.27 / 1.07 / 0.93; -29 / -10 / +5 |
| D. C + the live clout (TODAY) | 0.09 / 0.07 / 0.06; +636 / +650 / +659 | 0.11 / 0.09 / 0.08; +926 / +946 / +961 | 0.45 / 0.38 / 0.33; +155 / +174 / +187 |
| E. C + the clout x0.2 (PROPOSED) | 0.17 / 0.13 / 0.11; +302 / +316 / +326 | 0.18 / 0.15 / 0.12; +537 / +556 / +569 | 0.92 / 0.78 / 0.68; +9 / +29 / +43 |
| E, week one | 0.23 / 0.17 / 0.15 | 0.27 / 0.23 / 0.19 | 1.14 / 0.96 / 0.85 |

The clout at day 30: D 9,935 / 15,940 / 4,690; E 1,987 / 3,188 / 938 (day 60: 3,959 / 6,356 / 1,847). The twelve on a one-skull job
of theirs: A 0.20 / 0.16 / 0.16 (+96 / +102 / +102), already fine.

THE LONE WOLF ON THE CURVE'S JOBS (rule 255: people, two or three; no beast job in his first weeks), the same purse:

| reading | tape share (camp / town / fortress) | left a day | week one share |
|---|---|---|---|
| one skull, no clout, nothing sold | 0.53 / 0.43 / 0.37 | +52 / +65 / +72 (every month in the black) | 0.52 / 0.42 / 0.34 |
| + the loot sold | 0.44 / 0.35 / 0.30 | +78 / +91 / +97 | 0.43 / 0.34 / 0.28 |
| + the clout x0.2 (PROPOSED) | 0.25 / 0.20 / 0.17 | +183 / +196 / +201 | 0.37 / 0.29 / 0.24 |

## 3. THE PRICE LEVERS, MEASURED (on ECONOMY's reading, the hardest)

- **The back room's mark-up is a dead knob at a price of one.** engine/bohemia_stall_prices.js tapePrice floors the back room at the
  shelf price + 1: at one a roll the back room is 2 whether back_room_mult is 2, 1.5 or 1 (all three variants read the same to the
  battery). Only the shelf price moves it, and the shelf price is ONE (EVERYTHING COSTS ONE; it cannot go under).
- **The pay a skull:** 35, 40, 45 put the twelve (6 to 10, one skull, nothing sold) at 0.78 / 0.68 / 0.60 of pay from a camp; only 45
  lifts them to +55 a day, and it lifts three men (already +40 to +62) and every other price in the game with it. The wrong lever: the
  board already pays by skulls and the party math already deals the twelve a bigger job.

## 4. THE NUMBERS SET (the one table, section R; status proposed, RUN TWO applies, ECONOMY re-aims its gate)

| id | value | why |
|---|---|---|
| tape.price | 1 a roll; the back room 2 (UNCHANGED) | Battle Brothers' tool point at ten crowns a battery; every company keeps its armour up on what the live game pays (section 2, C to E); EVERYTHING COSTS ONE |
| pay.per_skull | 30 (UNCHANGED) | the board's Battle Brothers line; the twelve's bigger fights are bigger jobs by the party math |
| clout.gains_on_our_clock | x0.2: a job done 20, in part 10, failed -15, cancelled -20, a man beaten 1; ambition 100 | rule 264(g)'s pace ratio (5.2): x4.5 near day 50 with the danger (rule 255), not in a week; tape 11 to 27 percent of income for three and twelve, week one included |
| tape.bill (re-measured) | three men 11 to 23 percent of income, twelve 12 to 27, the Lone Wolf on his curve 17 to 37 (week one the high end), all at x0.2 with the loot sold | replaces ECONOMY Day 85's 70 to 97 (one-skull pay for a two- or three-skull fight, nothing sold) |

## 5. THE FINDINGS THAT PROVE US WRONG

1. **Mine (10/25):** I wrote the clout as 'x1 at the start to about x4.5 by the late game' (records/BOHEMIA_TUNING_WHAT_YOU_SEE_IN_A_CITY_AND_MONEY_TEACHES_10_25_26.md
   s2 item 3) with Battle Brothers' gains per contract. At five jobs a map day the late game is day 7. The same pace error rule 264
   fixed for healing.
2. **ECONOMY's Day 85:** the twelve paid one skull for a two- or three-skull fight; the new crew's bill read off a pooled group that
   includes men in no armour; loot sales and clout left out. Its N1 test passes for the wrong reason (the new crew alone at one skull
   with nothing sold is 0.38 to 0.58, over the third).

## ROUTED
- RUN TWO (NOTE): the clout's gains at x0.2 in records/target/bb/renown.json gains (TUNING-owned numbers, your engine/bohemia_renown.js
  reads them; the follower slots arrive about five times later in days: for three men the first about day 4 and the fifth about day 51
  (today day 1 and day 10), for the twelve day 2 and day 32); the
  back room's dead knob (tapePrice's base + 1 floor).
- ECONOMY (NOTE): the bank to read (banks/BOHEMIA_TUNING_THE_TAPE_PRICE_10_26_26.json fights and tables), the twelve's skulls by size,
  the new crew unpooled, the loot sold and the clout in NO RUN ENDS FOR TAPE's N tests.
- WORLD: the Lone Wolf's tape bill is his board (rule 255's curve).
[bb the purse: Battle Brothers' guide calls tools 'a major item of expenditure if enemies keep hitting party members' and food 'the only
vital resource'; its renown grows by the contract, and a contract there takes days]
[analog horror: the company that earns a legend's pay in a week has nothing left to want; the tape should cost him the way the dark
costs him, a little every night]
