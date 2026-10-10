# TUNING -- [origins difficulty] THE LABELS ARE THE WIKI'S, THE MONEY DOES NOT FOLLOW THEM (10/10/26)
# Row: VAMILY TUNING [origins difficulty], MODE RESEARCH. Source: records/target/bb/origins.json (15 rows, from the BB wiki origin pages).

## 1. WHAT THE DATA SAYS
Each origin carries `difficulty` Easy/Medium/Hard (d 1/2/3) copied from the wiki's Origins index. The wiki gives the label and the start (men, crowns, rules). It does NOT give a formula for the label. So the label is a human rating, not a number.

## 2. THE MEASURE I ADDED (derived, not a wiki number): starting crowns (medium purse) per starting man
  wolf     Hard   d3  men  1  crowns 1000  per man 1000  pay 0  roster 12
  lab      Medium d2  men  3  crowns 2700  per man  900  pay 0  roster 20
  newcrew  Easy   d1  men  3  crowns 2400  per man  800  pay 0  roster 20
  south    Easy   d1  men  3  crowns 2400  per man  800  pay 0  roster 20
  truck    Easy   d1  men  2  crowns 1400  per man  700  pay 1  roster 20
  rebuild  Easy   d1  men  3  crowns 2000  per man  667  pay 0  roster 20
  scav     Medium d2  men  3  crowns 2000  per man  667  pay 0  roster 20
  faith    Medium d2  men  4  crowns 2400  per man  600  pay 0  roster 20
  promise  Medium d2  men  2  crowns 1000  per man  500  pay 0  roster 18
  hunt     Hard   d3  men  3  crowns 1500  per man  500  pay 0  roster 20
  desert   Medium d2  men  3  crowns 1000  per man  333  pay 0  roster 20
  debt     Hard   d3  men  6  crowns 2000  per man  333  pay 1  roster 25
  raid     Medium d2  men  4  crowns 1000  per man  250  pay 1  roster 20
  pit      Hard   d3  men  3  crowns  700  per man  233  pay 1  roster 12
  watch    Easy   d1  men 12  crowns 1000  per man   83  pay 0  roster 25

## 3. FINDINGS
A. The label tracks the crowns-per-man only loosely. Easy: 83 (the block watch, twelve poorly equipped men) to 800. Hard: 233 (pit) to 1000 (wolf). The two ends overlap, so a player cannot read difficulty from the purse.
B. HARD ORIGINS WIN BY RULES, NOT MONEY: wolf (one man, ends the game if he dies), pit (lose when all 3 gladiators die, roster 12), debt (indebted men, rule penalty), hunt. The difficulty is a rule, so a TUNING dial cannot scale it: it is not a number in the table.
C. Easy origins that are poor per man (watch, 83) are Easy because twelve men can field a full line; the rating counts men, not purse. A single "start power" number (men x level + gear + crowns) is what a slider would need, and the wiki never gives it. PROPOSAL (draft): start_power = crowns + sum of each man's hire price from the price table. Not computed this round: the men have level null, so their hire price needs the background's range.
D. For Bohemia: crowns:battery is 10:1, so every purse above is also a battery count (medium 1000 = 100 batteries).
E. Pay column: the rows with pay 1 (truck, raid, debt, pit) start with a daily wage; the others 0. Check against wage engine next.

## ROUTED
- PEOPLE [origins]: names and lines stay theirs; the numbers here are only the purse and the rating.
- TUNING table: origin.start_power as a derived draft row; difficulty stays a label.
- COMBAT/RUN TWO: rule-based origins (wolf, pit, debt) need game-end checks, not tuning.
