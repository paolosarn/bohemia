# TUNING 10/26: THE STUPID-MOVE WATCH, ROUND ONE (rule 188(b), rule 201; standing, every round; research only)

Paolo 10/25 (rule 188): "there's so much wrong with the auto combat code and tuning... I can't be explaining all these, you gotta
know all this." The watch is the instrument that knows: many AUTO fights on main, every wrong move counted by kind, the counts on
COMBAT's board for COMBAT TWO (rebuilding the brain: rows 201, 191(a), 182), counts going down round over round.
This round is THE BEFORE: main with the fight's rules print 64d2fbf44e2e (last fight or data commit 154cd8c0). No brain push from
COMBAT TWO landed during the round (checked at 01:05, 01:19 and 01:24 UTC); the next round measures the after.
Instrument: tools/bohemia_tuning_stupid_move_watch.js (replay any fight: --fight <shape> <k>). Bank:
banks/BOHEMIA_TUNING_STUPID_MOVE_WATCH_10_26_26.json (one round per rules print; the resume cache stays out of the repo).

## 1. HOW IT WATCHES
The live fight, plain (no hooks), AUTO both sides, our side watched. Before every one of our men's actions it reads what he could
do (every foe he can strike and see, each with the fight's own hitChance); after, what he did (the fight's log); each turn is
judged on the state at the call that ended it (an early cut judged turns after the next round had refilled his AP and called a
winded man "a blow left": found, fixed, re-run). Six crew shapes, 100 seeded fights each (a district and cell the map could hand):
his crew (a rifle, two spear-and-car-door men), the Lone Wolf from the door, A New Crew from the door, Desi's two-hand spear on A
New Crew against thugs, the twelve (the Block Watch from the door), and the bench's spread (3, 6, 12 at three gear stages).
600 fights, 17,714 turns of ours, won 413, clean 225.

## 2. THE COUNTS, WORST FIRST (each also a row on COMBAT's board)
| # | kind | count | of | per 100 | worst shape |
|---|---|---|---|---|---|
| 1 | WINDED: a full-AP turn lost beside a foe, the swing's fatigue past his most | 802 | 17,714 turns | 4.5 | the Lone Wolf 368 of 786 (47); 125 men stood three turns running |
| 2 | LOW SHOT: 10+ points under his best shot, at a man nobody struck that round who did not fall | 237 | 6,160 shots with a choice | 3.9 | his crew 16 of 219 (7.3); mean gap 22 points |
| 3 | SPREAD: hits on two or more, none fell, the hitpoints taken would have dropped one | 140 | 3,986 rounds with our blows | 3.5 | the twelve 78 of 841 (9.3) |
| 4 | THE IDLE GUNMAN: nothing done while a tile in this turn's walk had a shot | 288 | 17,714 turns | 1.6 | his rifleman seven turns running (--fight his 43) |
| 5 | KEY MAN: the Mechanic in reach and seen, someone else or nobody struck | 9 | 494 actions | 1.8 | his crew 2 of 71 |
| 5b | KEY MAN LAST: the Mechanic falls last of his party, or never (added after EYES' 10/26 line; re-run on the same rules) | 24 | 74 fights with a Mechanic | 32 | his crew 10 of 19, the Lone Wolf 9 of 10 |
| 6 | NEVER: a melee man who never struck in four rounds or more | 11 | 921 men | 1.2 | the twelve 9 of 545 |
| 7 | LONE INTO THREE: a walk ending with 3+ of them within two tiles, none of his | 39 | 4,388 walks | 0.9 | Desi's spear crew 4 of 136 (2.9) |
| 8 | PARKED (COMBAT's J1) | 8 | 7,902 melee turns | 0.10 | |
| 9 | a melee man stood with a walk to the fight open | 25 | 17,714 turns | 0.14 | |
| 10 | the off-and-back dance, no blow | 11 | 17,714 turns | 0.06 | |
| 11 | a walk out of a ring for nothing | 3 | 17,714 turns | 0.02 | |
| 12 | a turn ended with a blow left | 0 | 17,714 turns | 0 | |
| 13 | a gunman who never shot | 0 | 1,082 men | 0 | |
Not counted as wrong: 276 turns a gunman had no tile in his walk with a shot (the walk toward one is the open question), 41 turns
a melee man had no way to any foe (a roof no club reaches, a fenced lot), 26 turns in a net.

## 3. THE WINDED TRAP IS NOT THE BRAIN'S (the round's finding)
EYES' worst case reproduced on the first fight (--fight wolf 1): the Lone Wolf swings twice in rounds 1 and 2, fells a dire wolf
in round 3, then ends every turn from round 4 with 9 of 9 AP beside a hyena and a wolf. canStrike refuses him: his fatigue sits at
56 of 61 and the noble sword's slash costs 10. Why it never comes down: every bite on him builds fatigue (struck +5, a dodge or a
block +2: Battle Brothers' own, rules.json fatigue.on_struck and on_dodge_or_block), two dire wolves and a hyena bite up to nine
times a round (12 and 14 AP, a 4-AP bite: Battle Brothers' own), and in the replay all three act before him every round (the dire wolf's initiative is 150; his falls with his armour's weight),
so the 15 he gets back at the round's start is gone before his turn.
- The brain has NO LEGAL ACT: rule 180 bars AUTO from Recover (and the door gives the Lone Wolf no Recover: colossus, steel brow,
  brawny). Every other button is a move or a strike, and a step out draws a free bite from each of them.
- THE KIT IS NOT THE TRAP (Lone Wolf, dogs only, 100 fights each): as rolled 15 in 100 won, the door's lightest kit (reinforced
  mail, the closed flat top) 20, its heaviest (a coat of plates, a full helm) 11; winded turns 62, 52 and 69 in 100.
- BATTLE BROTHERS' ANSWER, as a research splice (never the game): the Recover perk (tier 1: 9 AP, half his fatigue) in the place
  of Steel Brow, and AUTO allowed that one button when the swing's fatigue passes his most at a full turn: 15 -> 44 in 100 won
  against dogs, winded turns 449 -> 0. By pack size: two dogs 14 -> 31 of 34, three 1 -> 12 of 33, four 0 -> 1 of 33.
- SO IT IS A FORK between his rules, for the coordinator to put to him: rule 180 (AUTO never uses abilities) against 176(a)
  (AUTO never wastes a turn) and 183 (the Lone Wolf near-god early). The options, plainly: AUTO may press Recover only when he is
  too winded to swing; or the door gives the Lone Wolf Recover and only a player presses it (AUTO's odds stay 15 against dogs and
  say so); or nothing, and the Lone Wolf's AUTO keeps standing. And four dogs beat him every way: WORLD's job math sends two to four
  at one man (the count is the job's).

## 4. RULE 201: WHAT THE TEAM DOES TODAY, BY CREW SIZE (the gate's draft numbers come from here, the one table section L)
| crew | fights | blows on the round's most-struck man | hurt and standing at a round's end | spread rounds |
|---|---|---|---|---|
| 1 (the Lone Wolf) | 100 | 98.4 | 0.74 | 0 of 379 |
| 2 to 3 | 334 | 81.0 | 0.99 | 1.8 in 100 |
| 6 | 33 | 73.3 | 1.29 | 3.1 in 100 |
| 12 | 133 | 56.2 | 1.70 | 8.0 in 100 |
The share on the most-struck man is an upper bound for the share on a NAMED target (the fight names none yet; the watch reads
S.named, S.target or S.focus the moment COMBAT TWO adds one). EYES' twelve against eight raiders (four men struck a round for six
rounds) is the 12 row.

## 5. WHAT PROVES US WRONG
The worst wrong move AUTO makes is not a decision at all: in 802 turns the brain had nothing it was allowed to do. The rule 188
board reads as a list of brain bugs and its biggest line is a rules-and-numbers trap. And the Lone Wolf, ruled "virtually
impossible to kill in good gear early" (183), wins 15 in 100 against a pack of dogs on AUTO.

## ROUTED
- COMBAT's board, eight rows (NOTE 10/26 FROM TUNING [the stupid-move watch: round one] and [watch: ...]), for COMBAT TWO.
- THE COORDINATOR: the winded fork (section 3), with the numbers.
- WORLD: a pack of four at one man is never won (rule 192's job math sends two to four; the stars now say it, row L).
- RUN TWO (the door): the Lone Wolf's door perks (Recover is a tier-1 perk Battle Brothers players take on a heavy man).
- NEXT ROUND: the same 600 fights on COMBAT TWO's push, side by side.
