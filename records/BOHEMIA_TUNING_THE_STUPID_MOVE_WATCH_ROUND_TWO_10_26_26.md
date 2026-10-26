# TUNING 10/26: THE STUPID-MOVE WATCH, ROUND TWO (rule 188(b), rule 201, rule 231; standing, every round; research only)

Paolo 10/25 (rule 188): "there's so much wrong with the auto combat code and tuning... I can't be explaining all these, you gotta
know all this." Round one was the BEFORE. Round two is the AFTER of COMBAT TWO's brain push 50d5cba1 ([AUTO kills one at a time]
rule 201, [a shooter takes the best shot] rule 191(a), [AUTO knows every enemy's lesson] rule 182), measured the honest way: the
SAME 600 fights (six crew shapes, 100 seeded fights each), the SAME instrument, on the push's own parent and on today's main:
- BEFORE: main 6da80ef5 (rules print 0e03874f2e70; it already carries COMBAT's range bands 34e0a072, heights 27507bcd and the
  open street 4ffb668c), so the only change between the two is the brain (and CAMP's fight half 388ff4f0, which a fresh company
  never touches).
- AFTER: today's main 388ff4f0 (rules print 7a8ee2fc0ad9).
Instrument: tools/bohemia_tuning_stupid_move_watch.js (replay any fight: --fight <shape> <k>; TUNING_ENGINE=<splice> plays a
research splice, never saved). Bank: banks/BOHEMIA_TUNING_STUPID_MOVE_WATCH_10_26_26.json, rounds 0e03874f2e70 (the before) and
7a8ee2fc0ad9 (the after); the replay caches stay in the scratchpad, never the repo.

## 1. WHAT THE WATCH LEARNED THIS ROUND (four new reads)
1. THE NAMED MAN, PER BLOW. COMBAT TWO's fight names one target a round (S.focus.id; each blow keeps its choice and reason on the
   man, u.pick). The watch now reads the man named AT THE MOMENT OF EACH BLOW (the name moves when he falls), and for every blow off
   him the reason the brain wrote: 'in a ring' (a step out draws free swings, 201(c)), 'out of reach', 'keeps his roof', 'ahead of
   his line', 'a shot too poor' (191(a)), or 'worth more' / 'worth more where he stands' (the brain's coin chose another).
2. THE MECHANIC BY THE TURN. Round one counted every ACTION with the Mechanic in reach; a step before the blow counted as a miss.
   Now a TURN is the unit: the Mechanic in his reach at some call, and no blow of his on him all turn; split by the man's chance on
   the Mechanic against his best (within 10 points: worth taking; 10+ under but over a quarter; under a quarter: too poor by the
   brain's own shot_floor 0.25).
3. THE WINDED MAN BY RULE 231. Rule 231(c) (the coordinator's decision of round one's fork): a winded AUTO man with no legal swing
   HOLDS when a step out draws a free hit, and steps back out of reach only when none waits. So WINDED splits: held in a ring (the
   rule's own choice, not a brain error any more) and winded out of every ring (a free step back not taken: the brain's).
4. SPREAD CHOSEN. A spread round (hits on two or more, none fell, the hitpoints taken would have dropped one) is marked CHOSEN when
   at least one blow in it went off the named man by the coin ('worth more'), not by a ring or reach.

## 2. THE BRAIN'S AFTER, SIDE BY SIDE (600 fights each; paired by fight, z is the paired test, |z| over 2 is outside chance)
| | before (6da80ef5) | after (388ff4f0) | z |
|---|---|---|---|
| won | 423 | 423 | 0 |
| won with nobody of ours down | 235 | 249 | +1.65 |
| our men down | 1,021 | 922 | -2.8 |
| our men dead | 158 | 129 | -1.9 |
| blows on the round's most-struck man | 67.2% | 64.9% | (fell) |
| blows on the man named at the blow | (none named) | 67.2% of all; 84.7% of the blows of men who could strike him | |
| enemies hurt and standing at our round's end (the Mechanic's stood-up men left out) | 1.04 | 1.09 | +0.4 |

THE FINDING, PLAINLY: the new brain loses fewer men (99 fewer down, 29 fewer dead in 600 fights, the twelve's clean wins 34 to 43)
and the thing he complained about did NOT get better. His words were "all the damage is spreading apart equally on all the
opponents"; by every measure of that the watch has (the most-struck man's share, the spread rounds, the hurt men left standing) the
team spreads a little MORE than before. The safety comes from elsewhere in the push (the shot floor, the walk that leaves no ring,
the kill before he acts), and the off-target blows are mostly the board (2,045 'in a ring', 1,120 'out of reach') and then the coin: 1,905 blows 'worth more' against 11,315 on the named man.

## 3. THE COUNTS, WORST FIRST (before -> after; each a row on COMBAT's board for COMBAT TWO)
| # | kind | before | after | per 100 | worst shape after |
|---|---|---|---|---|---|
| 1 | KEY MAN BY THE TURN: the Mechanic in his reach all turn, never struck | 3 of 373 turns | 97 of 469 | 0.8 -> 20.7 | the twelve 60 of 200 |
| | of the 97: his chance on the Mechanic within 10 of his best / 10+ under, over a quarter / under a quarter | | 4 / 20 / 73 | | |
| 2 | SPREAD: hits split, none fell, one could have | 145 of 3,959 rounds | 169 of 3,835 | 3.66 -> 4.41 (z +1.8) | the twelve 9.5; 104 of the 169 CHOSEN (a 'worth more' blow in them) |
| 3 | LOW SHOT: 10+ points under his best, not the team's man | 187 of 5,944 shots | 220 of 5,997 | 3.15 -> 3.67 (z +1.4) | the bench 4.9; 156 of 220 'worth more', 90 at a man already hurt |
| 4 | THE IDLE GUNMAN: stood while a tile in his walk had a shot | 330 turns | 278 | 1.86 -> 1.63 | the twelve 110 |
| 5 | STREAK (not rule 231 holds): idle with full AP three turns running | 63 men | 43 | | the bench 16 |
| 6 | NEVER STRUCK: a melee man in four rounds or more | 12 of 947 | 14 of 935 | 1.3 -> 1.5 | the twelve 12 of 556 |
| 7 | LONE INTO THREE | 38 of 4,561 walks | 38 of 4,681 | 0.83 -> 0.81 | Desi's spear crew 4 of 168 |
| 8 | PARKED (COMBAT's J1) | 15 of 7,952 melee turns | 20 of 7,711 | 0.19 -> 0.26 | the twelve 18 |
| 9 | WINDED OUT OF EVERY RING (rule 231(c): a free step back not taken) | 4 | 6 | | |
| - | WINDED IN A RING (rule 231(c): holds; the rule's choice, not counted as wrong) | 746 | 710 | | the Lone Wolf 360 of 825 turns |
| - | KEY MAN LAST: the Mechanic falls last of his party, or never | 14 of 74 fights | 12 of 74 | 18.9 -> 16.2 | his crew 8 of 19 |
| - | a melee man stood with a walk open | 37 | 37 | | |
| - | the dance / free hits for nothing / a turn ended with a blow left | 9 / 1 / 0 | 5 / 0 / 0 | | |
WENT DOWN: the idle gunman, the streaks, the Mechanic falling last, the dance, the free hits. WENT UP: the Mechanic left standing
in reach (the special case that struck him at any chance is gone; 73 of the 97 are shots under a quarter of the man's best, which
191(a) read with 201 lets him skip; 24 are not), the spread rounds and the low shots (both carried by the coin's 'worth more').

## 4. WHAT A FIRMER FOCUS COSTS (research splices on the bench, never the game; the same 600 fights)
| splice | won | clean | ours down | ours dead | named share (could strike) | spread / 100 | low shots | Mechanic left in reach |
|---|---|---|---|---|---|---|---|---|
| today's brain | 423 | 249 | 922 | 129 | 84.7 | 4.41 | 220 | 97 of 469 |
| commit at 0.5 (commit_kill 0.8 -> 0.5) | 418 | 253 | 932 | 132 | 87.8 | 4.02 | 195 | 124 of 481 |
| STICK 1.5 (the named man's blow worth x1.5 in the coin) | 423 | 251 | 942 | 130 | 89.7 | 4.30 | 175 | 94 of 471 |
| THE LETTER (every man who can strike him fairly does) | 411 | 246 | 1,020 | 153 | 99.1 | 3.72 | 75 | 439 of 794 |
- THE LETTER COSTS MEN: 98 more of ours down (z +2.7) and 24 more dead, 12 fewer wins, for spread 4.41 -> 3.72 (z -2.0). COMBAT
  TWO's own measure found the same; the coin is right to choose off the named man sometimes.
- STICK 1.5 IS FREE: no measurable cost (down +20, z +0.8; dead +1; wins equal) and the low shots fall 220 -> 175 (z -3.2), the
  named share of men who could strike him 84.7 -> 89.7. It does not move the spread (4.30). Proposed to COMBAT TWO as
  ours.auto_brain.stick_named 1.5 [TUNING's research, draft].
- AND THE HURT MEN LEFT STANDING DO NOT MEASURE FOCUS: under the letter, with 99 in 100 reachable blows on the named man, they
  RISE (1.09 -> 1.16, z +2.7). They count how many of them are in contact, not how the team chooses.

## 5. RULE 201'S NUMBERS ON TODAY'S BRAIN (row 4 of this round; the one table's section L, rewritten)
| crew | fights | blows on the man named at the blow, of all | of the blows of men who could strike him | hurt and standing (no stood-up men) | spread / 100 rounds (before) |
|---|---|---|---|---|---|
| 1 (the Lone Wolf) | 100 | 98.8 | 98.8 | 0.82 | 0 (0.26) |
| 2 to 3 | 334 | 79.9 | 86.2 | 0.95 | 2.91 (2.30) |
| 6 | 33 | 67.8 | 79.3 | 1.30 | 5.15 (2.95) |
| 12 | 133 | 57.8 | 83.2 | 1.60 | 9.16 (7.59) |
| all | 600 | 67.2 | 84.7 | 1.09 | 4.41 (3.66) |
PROPOSED, for the gate (gates/auto_kills_one_at_a_time_gate.js) and COMBAT TWO's question ('the bar or the measure is yours'):
1. THE SHARE ON THE NAMED MAN IS READ AMONG THE BLOWS OF MEN WHO COULD STRIKE HIM (not in a ring, not out of reach, the shot fair:
   201(b) with 201(c)'s exceptions): at least 80 in 100 at every crew size. Today 84.7 (the six at 79.3 on 33 fights). The raw share
   of all blows is set by the board (the twelve's rings and reach: 1,543 'in a ring', 544 'out of reach'), not the brain; it stays
   a print by size (today 99 / 80 / 68 / 58).
2. 'HURT AND STANDING' IS RETIRED AS A BAR (it rises when the team focuses harder, section 4); it stays a print. That answers COMBAT
   TWO's (1): the 1.3 bar was mine and it measured the wrong thing.
3. SPREAD IS THE BAR THAT MEANS HIS WORDS: no higher than the round before by crew size (today's ceiling 2.9 / 5.2 / 9.2), the target
   the old brain's 2.3 / 3.0 / 7.6; and a CHOSEN spread round (a 'worth more' blow in it) is the count COMBAT TWO can lower without
   losing men (104 today).

## 6. WHAT PROVES US WRONG
The push that answered "AUTO kills one at a time" made the company safer and the focus a little worse. The watch's round one
promised a "named share" bar of 60 at twelve men, the brain meets it on the right measure (83.2) and misses it on the measure I
wrote (57.8). The count that rose most, the Mechanic left standing, rose because a rule-182 special case (any chance, every turn)
gave way to the coin, and three in four of those skipped shots are ones the rules say to skip.

## ROUTED
- COMBAT's board, for COMBAT TWO: NOTE [the stupid-move watch: round two] and rows [watch2: key man by the turn], [watch2: spread
  chosen], [watch2: low shot], [watch2: idle gunman], [watch2: stick 1.5], [watch2: rule 201's measure].
- THE ONE TABLE: section K (the counts to beat, round two) and section L (rule 201's numbers) rewritten.
- NEXT ROUND: the same 600 fights on COMBAT TWO's next push, before beside after; the winded Lone Wolf against RUN TWO's door
  Recover once it lands (rule 231(b)); the shield cover once COMBAT builds rule 230 (AUTO behind shield men against guns).
