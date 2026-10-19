# ECONOMY DAY 79: THE GRID'S MONEY -- ON TODAY'S BOARD ONLY ONE MAN AND THREE MEN CAN LIVE ON JOBS; EVERY COMPANY OF SIX OR MORE LOSES MONEY ON EVERY JOB IT TAKES, EVEN THE ONES IT ALWAYS WINS
# Row [the grid's money] (WHAT-EACH-FIGHT-SIZE-COSTS-AND-PAYS; rule 117(e): a number is a grid, never one average). Claimed
# 10/18 by economy-opus-10-18-grid, whose session died at the usage cap with nothing pushed; resumed and re-claimed 10/19 by
# economy-opus-10-19 (rule 116(d): a session that dies loses its uncommitted work, never its job). The new age (rules 112 to
# 120): no check-in, no question. The row's words: 'for each cell of TUNING's grid (company 1 to 14, enemy few to 40), what
# the fight costs in wages, ammo and healing and what the job pays, beside Battle Brothers' own, the cells where a company
# goes broke named first; handed to TUNING's table. CONSTRAINT: research and numbers only; DRAFT until the gear is in.'
# So: a page, a bench and a ledger. Nothing the game reads changes; no VOTE card (rule 88's hold). Every felt number is
# TUNING's (rule 38g). EVERY NUMBER HERE IS DRAFT: THE GEAR IS NOT IN (rule 117(e)); the cells are the early stage only.
# Builds on Day 78 (records/BOHEMIA_ECONOMY_DAY_78_THE_FIRST_BULLETS_10_19_26.md: rounds at five a battery), Day 76 (the
# burn of a crew of three, 9 a day), Day 63 ('clout changes the pay, skulls change the size'), Day 69 (the counter), and
# TUNING's [the whole grid] instrument (tools/bohemia_tuning_the_whole_grid.js: the same companies and counts).

## 0. THE QUESTION, AND THE ANSWER IN FIVE LINES
A fourteen-man company against forty costs and pays differently from a lone man. Does the money hold across the grid?
1. NO. On today's board, at a job every two days, the ONLY cells that hold are the lone wolf's three jobs and the crew of
   three's three jobs plus its three-man band: 7 of 40. Every company of six, twelve or fourteen loses money on every job
   in every cell, including the small bands it beats 99 and 100 times in 100. Worst first: fourteen against 38 (-170 a job),
   fourteen against 20 (-158), twelve against 20 (-144), twelve against 38 (-142), fourteen against 12 (-126).
2. WHY: THE BOARD PAYS BY THE SKULL AND NOTHING ELSE. 30, 60, 90 (THIN) whatever the size of the company or of the band,
   while the map sizes the band by the company's strength (party_math) and the burn grows by every man: 9 a day for three,
   22 for six, 41 for twelve, 50 for fourteen. A won one-skull job buys the twelve under half a day (0.43).
3. BATTLE BROTHERS PAYS THE SAME WAY AND THEN FIXES IT WITH RENOWN. Its pay is the contract's type (400 to 2,000 crowns)
   times the skulls (raised to 1.3) times RENOWN (1.35 to 2.7), and renown never touches the enemy (the Game Guide).
   OUR BOARD IS BATTLE BROTHERS' CHEAPEST CONTRACT AT ITS LOWEST RENOWN, FOREVER (its type-400 job at 1.35 is 35, 54 and 79
   batteries; ours 30, 60, 90). On the same fights with its own burn and its one sourced early contract (760 crowns) it
   holds up to six men; ours holds to three.
4. THE PAY THAT HOLDS the twelve on a routine job is 207 to 282 batteries a won job. Battle Brothers pays that for a
   middle job (type 1,000 or 2,000) at a renown of about 2,000 (the multiplier 2.0). So the grid needs Battle Brothers'
   two missing factors, the job's type and the company's clout (rule 41), or the real record's muster (pay by the man).
5. THE BULLET IS THE SMALLEST LINE IN EVERY CELL (2 to 4 batteries a fight for twelve or fourteen men). The big ones are
   MEDICINE (25 to 47 a fight) and THE LAID-UP MONTH: on a routine job the twelve have 5.8 men struck down a fight, each out
   30 to 40 days (his 9/27): 185 man-days off the line, about 630 batteries of upkeep for men who cannot fight. ONE MAN
   STRUCK DOWN COSTS ABOUT FOUR ONE-SKULL JOBS (105 to 128 batteries of his keep).

## 1. HOW BATTLE BROTHERS PAYS A FIGHT OF ANY SIZE
Sources (reference/library/grok/wiki/PAGES_ALL.tar.gz): bb_all/0827_Game Guide.txt (Contracts: 'How much do they pay?';
Economy; Wages), 0441_Contracts.txt (the haggling table), 1679_Renown.txt; records/target/bb/price_table.json
contractPay; party_math.json; this lane's Day 63.
- THE FORMULA, IN ITS OWN WORDS: 'Contract payment scales with: Type, Random modifier, Difficulty rating (skulls),
  Renown, Economic difficulty, Negotiations.' The type is the contract's own value ('the "return item" contract has a
  value of 400 and the "find artifact" contract has the highest value of 2,000'); the random modifier 90 to 110 in 100;
  the skulls a random multiplier raised to 1.3 (easy 63 to 81 in 100, medium 94 to 107, hard 120 to 148); renown
  'x 0.3% is used as a base raised to the power of 0.39... cannot be lower than 1.35 (720 Renown) nor higher than 2.7
  (4,256 Renown)'.
- RENOWN IS THE BIGGEST LEVER AND NEVER THE ENEMY'S: 'Renown has the biggest impact of all modifiers on contract payments
  ... Contrary to a popular belief, Renown has no effect on enemy strength.' It rises 5 a battle won, 25 a contract, 100
  an ambition; falls 3 a day, 15 a retreat, 75 a failed contract.
- THE SIZE OF THE FIGHT FOLLOWS THE COMPANY (party_math.json: a job's band is the company's strength over 10 times the
  skull multiplier); the PAY DOES NOT. Day 63's line, 'clout does not change the fight size, clout does change the pay;
  skulls change both'. The one per-head line is the bounty (the haggling table's real example: 610 on completion and 10 a
  head for up to 15 heads, 760 in all; 'per head' haggling moves a quarter of the pay to the heads).
- THE WAGE IS THE BRAKE: 'Wages can go out of hand quickly if left unchecked... Only 12 mercenaries can join a battle.
  So, keeping a count that is close to this number in the early stages of a campaign will do financial wonders.'
**BATTLE BROTHERS' PAY, AT TEN TO ONE (mine, the middle of each range):**
| the job's type | easy, renown 1.35 / 2.0 / 2.7 | medium | hard |
|---|---|---|---|
| 400 ('return item', its cheapest) | 35 / 52 / 70 | 54 / 81 / 109 | 79 / 117 / 158 |
| 1,000 | 88 / 130 / 176 | 136 / 201 / 272 | 198 / 293 / 395 |
| 2,000 ('find artifact', its dearest) | 176 / 261 / 352 | 272 / 403 / 543 | 395 / 585 / 790 |
THE LESSON: Battle Brothers sizes the fight by the company and pays by the company's NAME. A big company is a famous one
by the time it is big, and its jobs pay four to ten times a new crew's.

## 2. THE REAL RECORD: A MERCENARY WAS PAID BY THE MAN
Search extracts, not the pages in full (marked as such); the arithmetic marked 'mine' is this page's.
- THE MUSTER. A Landsknecht company was paid by the roll: at the muster each recruit passed an officer who wrote down his
  name, his rate and his kit, and the front-rank double-pay man drew eight guilders a month, 'twice as much as a common
  lansquenet' (Museum Boijmans Van Beuningen's catalogue entry on a Doppelsoeldner print; Wikipedia, Doppelsoeldner and
  Landsknecht, general sources). The employer paid for the size of the company he hired, man by man.
- THE CONDOTTA. The Italian contract opened with a down payment (the prestito), named a service period (the ferma) and
  carried a menda clause that paid the company back for horses and kit lost or badly damaged; Francesco II Gonzaga's 1505
  contract with Florence was 33,000 scudi a year for 250 men (about 11 scudi a man a month, mine) (Wikipedia, Condottiero;
  a general source, flagged). The pay scaled with the men, and the employer carried part of the losses.
- THE CONTRACTOR. The Congressional Budget Office (Frisk and Trunkey, 'Contractors' Support of U.S. Operations in Iraq',
  2008, via NPR and Military.com) found a contracted guard cost about the same as a soldier doing the job; the guard's day
  rate it cited from Stiglitz and Bilmes ran up to 1,222 dollars, against 140 to 190 for an Army sergeant in pay and
  benefits. Billed by the man-day.
THE LESSON: the real world pays a company for its SIZE and for its LOSSES; Battle Brothers pays it for its FAME. Today's
board pays it for neither. Realism-first leads with the muster; rule 41 leads with Battle Brothers' renown; both make a
bigger company paid more, and the board has neither.

## 3. OURS, MEASURED ON MAIN
- **THE PAY.** The settlement screen's board offers 30, 60, 90 for one, two, three skulls (OFFERS; 'TUNING owns these
  numbers'); the map pays round((pay + the origin's pay) x the shelves) on a win (FULL x1.5, THIN x1, BARE x0.75). No term
  for the company's size, the band's size, the company's name or a head. price_table.json carries Battle Brothers' one
  sample (61 on completion, 1 a head) and nothing reads it.
- **THE BAND.** party_math.json sizes a job's band by the company's strength (10 a man, 2 a level past one) over 10 times
  the skull multiplier (0.8, 1.0, 1.3) times the difficulty pick: for a fresh company at Veteran, one man meets 2 (the
  floor), three meet 2 / 3 / 4, six 5 / 6 / 8, twelve 10 / 12 / 13, fourteen 11 / 13 / 13 (the cap). Nothing on the board
  is ever 20 or 38.
- **THE BURN** (the roster screen's wage, a background's daily wage over ten and at least one; Day 69's counter, a ration
  and four litres a man, 2 a day): one man 2 (the Lone Wolf's own man draws none: price_table.json lonewolfWage; the
  roster screen prints 4, Day 77's two engines), three 9, six 22, the twelve 41 (wages 17), fourteen 50 (wages 22).
  Battle Brothers' same men: 0.4, 5.4, 11.3, 19.2, 24.5 (its wage over ten with no floor, grains 0.4 a man, no water).
- **THE STRUCK DOWN.** ours.json: 20 in 100 die (plus 5 a mark carried), the rest are laid up 30 to 40 days with a
  permanent injury (his 9/27, the fifth votes). Battle Brothers has no laid-up month: a struck-down man who lives carries his
  permanent injury into the next battle (bb_all/1540).

## 4. THE BENCH: THE GRID PLAYED 4,000 TIMES ON THE LIVE FIGHT
Instrument: tools/bohemia_economy_first_bullets.js --grid (the same headless live fight as Day 78; the company built as
TUNING's whole grid builds it at the early stage: one = the Lone Wolf origin's man, three = A New Crew, six to fourteen =
the twelve's places in order, each man his place's kit on today's rows; brigands; day 3; Veteran, the door's default; both
sides AUTO). Counted: won, shots of yours, every injury with its heal days (injuries.json heal_days, the middle), every man
struck down with his laid-up days (the fight's own 'down' event), the dead. 40 cells x 100 fights, 346 s on four workers.
Data: banks/BOHEMIA_ECONOMY_THE_GRIDS_MONEY_10_19_26.json (draft:true). 'sN' is the job the map sizes at N skulls.
| company v band | won in 100 | shots | heal days | struck down | laid-up man-days | dead |
|---|---|---|---|---|---|---|
| 1 v 2 (s1 / s2 / s3) | 26 / 18 / 28 | 0 | 3.1 / 3.7 / 3.0 | 0.7 to 0.8 (the main man is never laid up) | 0 | 0 |
| 1 v 3, 6, 12, 20, 38 | 0 in every cell | 0 | 3.6 to 4.4 | 1 | 0 | 0 |
| 3 v 2 / 3 / 4 (s1 / s2 / s3) | 91 / 66 / 33 | 0 | 2.5 / 5.7 / 8.0 | 0.5 / 1.3 / 1.9 | 12 / 29 / 40 | 0.13 / 0.22 / 0.38 |
| 3 v 6, 12, 20, 38 | 4, 0, 0, 0 | 0 | 9.0 to 10.7 | 2.6 | 54 to 57 | 0.35 to 0.44 |
| 6 v 5 / 6 / 8 (s1 / s2 / s3) | 80 / 68 / 23 | 0 | 10.5 / 12.8 / 18.2 | 2.3 / 2.8 / 4.5 | 68 / 81 / 128 | 0.41 / 0.58 / 0.81 |
| 6 v 3 / 12 / 20 / 38 | 99 / 2 / 0 / 0 | 0 | 3.4 / 20.4 / 19.5 / 19.9 | 0.6 / 5.1 / 5.0 / 5.1 | 20 / 142 / 139 / 143 | 0.13 / 0.89 / 1.01 / 0.92 |
| 12 v 10 / 12 / 13 (s1 / s2 / s3) | 59 / 46 / 28 | 18.5 / 17.1 / 16.9 | 24.8 / 29.5 / 34.8 | 5.8 / 7.3 / 8.2 | 185 / 229 / 260 | 1.29 / 1.63 / 1.71 |
| 12 v 3 / 6 / 20 / 38 | 100 / 100 / 1 / 0 | 9.6 / 14.5 / 12.6 / 10.0 | 2.5 / 6.5 / 38.4 / 38.7 | 0.2 / 1.2 / 9.5 / 9.9 | 9 / 41 / 296 / 312 | 0.08 / 0.35 / 2.44 / 2.09 |
| 14 v 11 / 13 / 13 (s1 / s2 / s3) | 81 / 56 / 54 | 17.7 / 17.7 / 18.3 | 22.0 / 31.3 / 32.3 | 4.8 / 7.4 / 7.3 | 154 / 239 / 233 | 1.37 / 1.65 / 1.86 |
| 14 v 3 / 6 / 12 / 20 / 38 | 100 / 100 / 65 / 10 / 0 | 9.7 / 13.5 / 18.2 / 14.5 / 10.6 | 2.6 / 7.7 / 29.3 / 43.0 / 46.6 | 0.3 / 1.2 / 6.9 / 10.9 / 11.6 | 10 / 43 / 222 / 347 / 371 | 0.09 / 0.30 / 1.44 / 2.39 / 2.39 |
(Only the twelve's places 5, 7, 9, 11 and 12 hold guns on today's kit, so the shots are theirs; companies of one to six
fire none. Six fights of 4,000 never ended on AUTO, the same deadlock Day 78 and TUNING's bench found.)
THE FIGHT ITSELF, read for the money: a routine job (the map's one skull) strikes down half of a company of twelve
(5.8) and kills 1.3 of them; a band of 20 beats twelve 99 times in 100 and fourteen 90 times; nobody beats 38.

## 5. THE MONEY, CELL BY CELL
Worked by tools/bohemia_economy_the_grids_money_ledger.py (reads the bench's bank; every number below). CASH A FIGHT is the
rounds (five a battery, Day 78) + the medicine (a dose a heal day, ONE) + the dead replaced (a hire at Battle Brothers'
base, 30 to 150 crowns at ten to one, the middle 9). THE CYCLE is a job every two days (one out, one back; DRAFT, Day 68's
'a day is a price' is why it is days at all); NET = the pay times the win share, less the cash, less two days' burn.
Battle Brothers beside: the same fights, its burn, its one sourced early contract (76) at every size.
| company v band | pay (won share) | cash a fight (rounds / medicine / the dead) | burn a day | NET a job, ours | days a won job buys | Battle Brothers' NET |
|---|---|---|---|---|---|---|
| 1 v 2, s1 / s2 / s3 | 7.8 / 10.8 / 25.2 | 3.1 / 3.7 / 3.0 (medicine only) | 2 | +0.7 / +3.1 / +18.2 | 3.9 / 5.4 / 12.6 | +15.9 / +9.2 / +17.4 |
| 3 v 2 / 3 / 4, s1 / s2 / s3 | 27.3 / 39.6 / 29.7 | 3.7 / 7.7 / 11.4 | 9 | +5.6 / +13.9 / +0.3 | 3.0 / 4.4 / 3.3 | +54.7 / +31.6 / +2.9 |
| 3 v 6 | 3.6 | 12.2 | 9 | -26.6 | 0.4 | -19.9 |
| 6 v 5 / 6 / 8, s1 / s2 / s3 | 24.0 / 40.8 / 20.7 | 14.2 / 18.1 / 25.5 | 22 | **-34.2 / -21.3 / -48.8** | 1.1 / 1.9 / 0.9 | +24.0 / +11.0 / -30.6 |
| 6 v 3 (under the smallest job: a roaming band, no pay) | 0 | 4.6 | 22 | -48.6 | 0 | -27.2 |
| 12 v 10 / 12 / 13, s1 / s2 / s3 | 17.7 / 27.6 / 25.2 | 40.1 (3.7 / 24.8 / 11.6) / 47.6 / 53.6 | 41 | **-104.4 / -102.0 / -110.4** | 0.43 / 0.67 / 0.61 | -33.7 / -51.0 / -70.7 |
| 12 v 20 / 38 (past the board: nothing pays it) | 0.9 / 0 | 62.8 / 59.5 | 41 | **-143.9 / -141.5** | 0 | -100.5 / -97.9 |
| 14 v 11 / 13 / 13, s1 / s2 / s3 | 24.3 / 33.6 / 48.6 | 37.9 / 49.7 / 52.7 | 50 | **-113.6 / -116.1 / -104.1** | 0.49 / 0.67 / 0.97 | -25.3 / -56.1 / -60.6 |
| 14 v 20 / 38 (past the board) | 9.0 / 0 | 67.4 / 70.2 | 50 | **-158.4 / -170.2** | 0.18 / 0 | -108.8 / -119.2 |
**THE BROKE CELLS, WORST FIRST (a job every two days):** 14 v 38 (-170.2), 14 v 20 (-158.4), 12 v 20 (-143.9), 12 v 38
(-141.5), 14 v 12 (-126.4), 14 v 13 two skulls (-116.1), 14 v 11 one skull (-113.6), 14 v 6 (-113.1), 12 v 13 (-110.4), 14
v 3 (-105.3), 12 v 10 (-104.4), 14 v 13 three skulls (-104.1): 33 of 40 cells are broke. At a job every FOUR days only one
cell holds (the lone wolf's three-skull job, +14.2). Battle Brothers on the same fights holds 10 of 40, to six men.
**THE LINES, READ ACROSS:** the ROUNDS are 0 to 3.7 a fight; the MEDICINE 2.5 to 46.6 (the biggest cash line in every
cell of six or more); the DEAD 0 to 22 (twelve and fourteen lose 1.3 to 2.4 men a fight at 9 a hire). THE LAID-UP MONTH,
apart because the company pays it anyway (a man laid up still eats and draws his wage): 185 to 371 man-days a fight for
twelve and fourteen, 630 to 1,325 batteries of keep for men who cannot fight; ONE MAN STRUCK DOWN is 105 (three), 128
(six), 120 (twelve) or 125 (fourteen) batteries of keep over his 35 days, four one-skull jobs.

## 6. THE PAY THAT HOLDS, AND BATTLE BROTHERS' CURVE BESIDE IT
What a WON job must pay so a job every two days breaks even (the cash and two days' burn over the win share):
| company | one skull | two skulls | three skulls | the board pays | Battle Brothers pays that at (section 1) |
|---|---|---|---|---|---|
| 1 | 27 | 43 | 25 | 30 / 60 / 90 | its cheapest job at its lowest renown |
| 3 | 24 | 39 | 89 | 30 / 60 / 90 | its cheapest job at its lowest renown |
| 6 | 73 | 91 | 302 | 30 / 60 / 90 | a type-400 medium at renown 2.0 (81) to a type-1,000 medium at 1.35 (136) |
| 12 | 207 | 282 | 484 | 30 / 60 / 90 | a type-1,000 medium at 2.0 (201) to a type-2,000 hard at 2.0 (585) |
| 14 | 170 | 267 | 283 | 30 / 60 / 90 | a type-1,000 medium at 2.0 (201) to a type-1,000 hard at 2.0 (293) |
Per man in the company the holding pay is 8 to 50 batteries a won job; the board's is 30, 60 or 90 for the whole company.
**THE THREE WAYS TO MAKE IT HOLD (named, DRAFT, TUNING's; the trade is his only where realism and fun split):**
- **A. BATTLE BROTHERS' OWN FORMULA AT TEN TO ONE (rule 41's first answer):** the job carries a TYPE (our 30 / 60 / 90
  are its type-400 floor; a dearer job is a rarer one) and the company carries CLOUT (renown: +5 a fight won, +25 a job,
  -3 a day, -75 a job failed; the multiplier 1.35 to 2.7). A company grows famous as it grows big. It does nothing for a
  big ORIGIN at the door (the Block Watch's twelve start broke on day one).
- **B. THE MUSTER (realism-first's answer):** a job pays a share a man hired for it (the Landsknecht's roll, the
  condotta's 250 men): the pay that holds above, about 8 to 24 batteries a man for a one- or two-skull job, on top of a
  small completion pay. The employer pays for the size he asks for. Simple to read (rule 117(b): one number a man).
- **C. THE HEAD (Battle Brothers' bounty line, already a sample in price_table.json, unwired):** 1 battery a head of the
  band beaten (10 crowns); it grows with the band (the map sizes it by the company) and pays the fights of 20 and 38 that
  no job on the board pays. Alone it is small (10 to 13 a big job).
THE PICK FOR TUNING'S TABLE: A AND C TOGETHER, AS BATTLE BROTHERS DOES (the type and the clout on the completion pay, the
head on top), with B named as the realism candidate and his trade if he wants the muster. The 117 check: at the start
(clout 1.35) A gives the crew of three 35 / 54 / 79, a step over today's for the easy job only; it is the clout that
carries a company past six, and rule 117(a) asks that ours start easier than Battle Brothers', so the clout's floor
should sit above 1.35 or rise faster than Battle Brothers' (+25 a job), a number TUNING holds.
**AND THE LAID-UP MONTH IS ITS OWN LEVER:** on today's fight one man struck down costs four one-skull jobs. Battle
Brothers has no such month. The rule is his (9/27, the fifth votes); what the money says is that with it, the fight has
to strike down far fewer men than today's does (half of twelve on a routine job), which is TUNING's [the whole grid] and
COMBAT's to measure, and the condotta's menda clause (the employer pays the company back for its losses) is the real twin
if he wants a job to carry part of it.

## 7. WHAT PROVES US WRONG
1. **THE BOARD CANNOT FEED A COMPANY BIGGER THAN THREE.** 33 of 40 cells broke; every cell of six or more, including
   fights won 99 and 100 times in 100. Rule 117 asks for easier than Battle Brothers; on the same fights Battle Brothers'
   own books hold to six.
2. **OUR PAY IS BATTLE BROTHERS' FLOOR WITH ITS TWO MULTIPLIERS CUT OFF.** 30 / 60 / 90 sits on its type-400 job at its
   lowest renown (35 / 54 / 79), and the two factors that make its pay climb (the type, the renown) are not on the board.
3. **THE BOARD NEVER PAYS A BIG FIGHT.** The map's biggest job for fourteen men is 13; the 20s and 38s of rule 117(e) are
   fights nothing on the board pays, so a big band can only cost.
4. **THE BULLET WAS THE WRONG WORRY.** Day 78's ammo line is 0 to 4 batteries a fight on this grid; medicine and the dead
   are ten to twenty times it, and the laid-up month a hundred times it.
5. **THE LONE WOLF NEVER WINS PAST TWO.** 0 of 100 against 3, 6, 12, 20 or 38; 18 to 28 in 100 against the map's two. His
   money holds only because he eats alone and draws no wage (and the roster screen says he draws 4: Day 77's two engines).
6. **THE WATCH ORIGIN STARTS BROKE.** Twelve men, 100 batteries on THIN shelves (origins.json), 36 a day (twelve on the
   wage floor of one, 24 of food and water): under three days of burn in the purse, and no job on the board pays a
   twelve-man company back.

## 8. THE ROWS FOR TUNING'S ONE TABLE (all DRAFT; THE GEAR IS NOT IN)
| row | value | source |
|---|---|---|
| contract.type_value | 400 (our 30 / 60 / 90) to 2,000 crowns, at ten to one 40 to 200 | bb_all/0827 Contracts |
| contract.skull_mult | easy 0.63 to 0.81, medium 0.94 to 1.07, hard 1.20 to 1.48, raised to 1.3 | bb_all/0827 |
| contract.clout_mult | (renown x 0.003) ^ 0.39, between 1.35 and 2.7 (the floor his under rule 117(a)) | bb_all/0827 |
| clout.gain | +5 a fight won, +25 a job, +100 an ambition; -3 a day, -15 a retreat, -75 a failed job | bb_all/0827, 1679 |
| contract.per_head | 1 battery a head beaten (10 crowns) | bb_all/0441; price_table.json contractPay |
| contract.muster_per_man (B, named) | 8 to 24 a man a won one- or two-skull job | section 6 |
| check.grid_holds | at a job every two days, every cell the map sizes (s1 to s3) at net 0 or over | section 5 |
| check.struck_down_keep | one man struck down under one job's pay (today 105 to 128 against 30) | section 5 |

## 9. ROUTED
- **TUNING** ([the whole grid], the one table): section 8; the broke cells (5) beside its won-and-dead grid; the struck-down
  rate as the biggest money lever (half of twelve on a routine job); the clout floor under rule 117(a).
- **COMBAT** (design lead): the fight downs half of a twelve-man company on the map's own one-skull job and kills 1.3; the
  lone wolf wins none past two; five fights in 4,000 never end on AUTO.
- **RUN TWO** (the board, the settlement screen): the pay has no type, no clout, no head; the sample per-head line in
  price_table.json is unwired; a laid-up man's keep is the biggest bill a company has and no screen shows it.
- **WORLD** (the map, party_math): nothing on the board is ever over 13; the 20s and 38s are roaming bands and sieges, and
  their pay is loot only, which is this lane's to price next.
- **PEOPLE + RUN** (the origins): the Block Watch's twelve start with under three days of burn.
- **DYNASTY** (when rule 88 lifts): clout is a name, and a name is what an heir inherits (rule 31's three acts at once).
- **WORDS** (when rule 88 lifts): eight lines in the bank (section II).
- **MODS**: the contract rows belong in contract_terms.json beside the haggle.

## 10. WHAT THIS ROUND DID NOT DO
- Played the EARLY stage only (each man his place's kit, day 3, level 1 or his origin's); the middle and late gear of
  TUNING's grid wait for TUNING's bank and for the gear (rule 117(e): DRAFT until the gear is in). The bench takes a stage
  in one edit.
- Played no beast: the fight has no beast path (TUNING's grid carries the wolves in memory).
- Counted no loot: a won fight's gear and rounds (Day 78's six a body) are not in the net; they would lift every won cell
  a little and none of the broke ones out (a body's six rounds are 1.2 batteries).
- Changed no file the game reads; no VOTE card. NOT IN A TAB YET.
