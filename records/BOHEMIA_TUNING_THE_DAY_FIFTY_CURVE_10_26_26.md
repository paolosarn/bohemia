# TUNING 10/26: THE DAY-FIFTY CURVE, AND THE LONE WOLF'S FIRST TWENTY DAYS (rules 254, 255; research only, for WORLD)

HIS WORDS (records/BOHEMIA_PAOLO_THE_BLOOD_IS_THE_AUTO_COLOUR_AND_THE_DANGER_RAMPS_TO_DAY_FIFTY_10_26_26.md): "depending on how many
days it's been, up to 50 days is when shit starts getting difficult, but I don't even want you to have jobs available like six wolves;
I played as the Lone Wolf, you have to understand how dangerous some of this is... I don't know how long you want to take to ramp up the
availability of the options, I know how Battle Brothers does it." The coordinator's ask: Battle Brothers' day scaling from the wiki copy,
a curve (days 1 to 10 the worst job 'could go either way', full danger by about day 50), and the Lone Wolf's first 20 days never holding a
job his runs lose outright. The rows are the one table's section U; the tool tools/bohemia_tuning_the_day_fifty_curve.js; the bank
(draft:true, nothing reads it) banks/BOHEMIA_TUNING_THE_DAY_FIFTY_CURVE_10_26_26.json.

## 0. THE ANSWER
1. THE CURVE, on the one hidden number every job and the AUTO tint already read (rule 254: the share of 32 AUTO runs won with nobody
   down): THE WORST JOB ON THE BOARD may sit no lower than 0.5 through day 10 ('could go either way'), then the floor falls in a straight
   line to nothing at day 50 (0.375 at day 20, 0.25 at day 30, 0.125 at day 40). AT MOST ONE red job (under 0.8) on the board through day
   10, the warning; then the red share grows by the same line, all of the board by day 50. A job under the floor is not offered; the town
   rolls the next one.
2. THE LONE WOLF, MEASURED (4,500 fights): against TWO beasts he wins 38 in 100, three beasts 2, four or more 0, on every day from 1 to 20.
   Six wolves is a certain loss. Brigands: 2 win 98, 3 win 90, 4 win 47, 5 win 18. So under the curve his first 20 days hold one-skull
   jobs against people and no beast job at all: nothing he loses outright (under 0.25).
3. BATTLE BROTHERS' OWN RAMP (the wiki copy): a contract scales with the ROSTER, not the day; the days come in as which contracts and kinds
   appear: only one-skull contracts for a span at the start, three skulls 'only after a few days', a champion -99 on a one-skull contract
   and -1 before day 90, kinds that arrive after day 15, enemy stats that step at days 20 to 50 to 90; roaming parties scale with time and
   distance. Its own floor (0.75 x the contract, 'about 8 level 1 characters') is exactly why its Lone Wolf meets fights built for eight.

## 1. HOW BATTLE BROTHERS DOES IT (reference/library/grok/wiki/PAGES_ALL.tar.gz)
- THE CONTRACT: "Contract difficulty scales with the strength of your roster (which equals a sum of individual strengths [10 + 2*(lvl-1)]
  of 12 strongest brothers), the difficulty rating (skulls), the type of contract" (bb_all/0828 Game Mechanics); "94% x (1% x roster
  strength) ^ 0.89. It cannot be lower than 0.75 (78 strength or about 8 level 1 characters) or higher than 5... If the party contains
  less than 3 members, each character whatever his level adds +10" (bb_all/0827 Game Guide); skulls "Easy = 70% - 85%, Medium = 95% -
  105%, Hard = 105% - 135%". WORLD already carries these (party_math.json job_bb).
- THE DAYS: "With the beta build we increased the time span in the early game where exclusively 1-skull contracts are spawned" and
  "Changed it so that 3-skull-contracts start to appear only after a few days have passed" (bb_all/0626 Developer Posts; the wiki copy
  gives no day number). Champions: "1 skull contract -99%... Before day 90 -1%" (bb_all/0363). Kinds by day: hyenas in hunting contracts
  "especially before day 15, but will likely not be frenzied in that early game" (bb_all/0816); serpents "only after day 15" (bb_all/1757).
  Enemy stats step with the days: a brigand raider's melee 65 "before day 40, 70 after" (bb_all/0297), a skirmisher champion's defences at
  day 50 (bb_all/0873), the undead's damage at day 90 (bb_all/0147).
- ROAMING: "Difficulty of non-contract locations and roaming parties scales mostly with distance to civilization and time. Roaming parties
  also scale slightly with player strength" (bb_all/0828). WORLD carries it (party_math.json roaming: +0.1 a man a day).
- WHAT IT MISSES, WHICH IS HIS POINT: a contract sized to the roster is still sized by a FLOOR for a company under eight men, and the
  board never asks whether THIS company can win it. His Lone Wolf met six wolves because the floor and the kind both said yes.

## 2. THE LONE WOLF, MEASURED (the door's roll: a level-4 hedge knight, noble sword, kite shield; the live fight main e41a6bbe, AUTO both
## sides; 60 fights a cell, 4,500 in all; alone, a won fight is a clean fight, so this is the AUTO worth itself)
Won of 100, dressed for day 1 / day 10 / day 20 (the count asked; a tougher faction fields fewer, the fight's count_scale):
| asked | brigands | beasts (dire wolf, hyena) | kids (fields 0.6) | machines (a mechanic first) | heavies (fields 0.45) |
|---|---|---|---|---|---|
| 2 | 98 / 97 / 80 | 38 / 38 / 38 | 97 / 97 / 97 | 100 / 100 / 100 | 98 / 98 / 80 |
| 3 | 90 / 70 / 52 | 2 / 2 / 2 | 78 / 78 / 85 | 88 / 88 / 72 | 98 / 98 / 80 |
| 4 | 47 / 33 / 33 | 0 | 78 / 78 / 85 | 88 / 88 / 72 | 40 / 40 / 27 |
| 5 | 18 / 12 / 12 | 0 | 60 / 60 / 50 | 7 / 7 / 7 | 40 / 40 / 27 |
| 6 | 7 / 2 / 10 | 0 | 40 / 40 / 20 | 2 / 2 / 2 | 0 / 0 / 2 |
WHAT WORLD'S BOARD DEALS HIM TODAY (party_math.json job_bb: base men 4 / 6 / 8 by skulls x the 0.75 floor x the difficulty 0.85 to 1):
one skull 3, two skulls 4 to 5, three skulls 5 to 6, of any faction; and the dress day stays day 1 while he is alone (his strength never
reaches the dress table's first point). So today: a one-skull HUNT is three beasts, 2 in 100; a three-skull hunt is his six wolves, 0.
UNDER THE CURVE (floor 0.5 to day 10, 0.375 at day 20): his first 20 days hold one-skull jobs against brigands, kids, machines and
heavies (78 to 98), at most one warning job near the line (four brigands, 47; or five kids, 60), and NO beast job of any size (38 at best).
Nothing under 0.25 ('lose outright') can appear before day 30, for him or anyone.

## 3. THE CURVE, FOR EVERY COMPANY (the one table's section U)
| day | 1 to 10 | 15 | 20 | 25 | 30 | 40 | 50 and on |
|---|---|---|---|---|---|---|---|
| the worst job's worth may be no lower than | 0.50 | 0.44 | 0.375 | 0.31 | 0.25 | 0.125 | 0 |
| red jobs (worth under 0.8) on a board of N | 1 | N x 0.125 | N x 0.25 | N x 0.375 | N x 0.5 | N x 0.75 | all |
(red counts round, never under one.) WHY ON THE WORTH AND NOT THE SKULLS OR THE KINDS: the worth is already measured per job and per
company (WORLD's calculator, 32 runs, rule 254), so the same line protects the Lone Wolf, A New Crew of three and the twelve without a
table per origin, and a strong early company still sees harder jobs. Battle Brothers' own day rules ride on top unchanged where WORLD
already has them (the dress by strength, never past the calendar's day; roaming by days and distance).
THE FIRST WEEK'S SQUEEZE (rule 117, 255(d)): money, not death: a one-skull job pays 30 and the board through day 10 is clean or light, so
the squeeze is the food and the wages against a few jobs a day, as ECONOMY measured (the best week of trading +27 under one job).
ROAMING (255(c)): roaming parties on his road meet the same floor against the company they come for, from his first day; WORLD measured the
road near empty today (0.0038 an hour), so this is the line for the day the road sends more, not a change now.

## 4. ONE FINDING THAT PROVES US WRONG
THE BEASTS ARE A WALL FOR ONE MAN, AT EVERY DAY: two beasts 38 in 100 on day 1 and on day 20 alike, because the dress table never moves a
lone man past day 1 and the dire wolf and hyena are day-1 kinds. Battle Brothers' hyenas are 'likely not frenzied in that early game'
and its hunting contracts are sized by the 0.75 floor; ours puts the same two beasts on him whatever he becomes. The curve keeps them off
his board until his worth against them passes the line; a hunt with ONE beast (not dealt today: the minimum is two) would be his first.

## 5. NOT MEASURED, SAID
A New Crew and the twelve on the same grid (the curve does not need it: it reads each company's own worth); the curve on the live board
(WORLD's gate, 255(e): boards on days 1, 10, 25, 50, 80 for three origins); a phone's CPU; levels: the Lone Wolf at level 4 only (he
climbs; the worth reads him as he stands).

## ROUTED
- WORLD [the danger ramps to day fifty]: the curve (section U), the red cap, the Lone Wolf table for your 255(e) gate, Battle Brothers'
  day lines. (NOTE.)
[bb the ramp: Battle Brothers grows a contract with the roster and lets the days choose which contracts and kinds appear; ours reads the
very number the AUTO tint shows, so the first ten days never offer a job worse than a coin toss]
[analog horror: the job board in the first week only ever offers work you can survive, and nobody tells you who decided that]
