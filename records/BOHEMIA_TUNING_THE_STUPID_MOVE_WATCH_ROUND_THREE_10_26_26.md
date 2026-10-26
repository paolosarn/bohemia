# TUNING 10/26: THE STUPID-MOVE WATCH, ROUND THREE (rule 188(b), standing every round; research only)

The coordinator's three-hour sweep: after the followers' numbers (rule 270), run the watch on main as it is; when the COMBAT emergency's
fix and the one pace (rule 274) ship, run it again on that sha and write the before and after. THE EMERGENCY'S FIX IS ON MAIN (COMBAT
d3ed6cfb, [the fight is broken live]: the fight reads its rules from the deploy it came with, a turn that throws passes, the board always
draws). THE ONE PACE IS NOT YET (slices/BOHEMIA_FIGHT.html still carries THEIRS_PACE = 2 and FINISH_PACE = 4). So this round is the
emergency's after, and the one pace's before.

Tool tools/bohemia_tuning_stupid_move_watch.js --n 100 --jobs 4 --save (the same 600 fights as rounds one and two: his three, the Lone
Wolf, A New Crew, the spear crew, the twelve, TUNING's bench; AUTO both sides, our side watched). Bank
banks/BOHEMIA_TUNING_STUPID_MOVE_WATCH_10_26_26.json, round d3ed6cfb (fight rules print e8efcbfd38de; round two was 388ff4f0,
7a8ee2fc0ad9).

## 0. THE ANSWER
THE EMERGENCY'S FIX IS CLEAN FOR THE BRAIN: every count in every crew shape is IDENTICAL to round two (17,063 turns of ours, the same
600 seeds): won 423, clean 249, and every wrong move the same number. The fix changed how the fight fetches its files and what happens
when a turn throws; on these 600 fights no turn threw and no AUTO choice moved. The seven rows from round two on COMBAT's board stand as
written; nothing new to add, nothing fixed.

## 1. THE COUNTS, WORST FIRST (all six crews, 600 fights; the same as round two)
| the wrong move | count | of | share |
|---|---|---|---|
| KEY MAN BY THE TURN: the Mechanic in reach in a turn, never struck that turn | 97 | 469 turns | 20.7% (73 of them a shot under a quarter of the man's best: fair) |
| KEY MAN LAST: the Mechanic falls last of his party, or never | 12 | 74 fights | 16.2% |
| STREAK: the same man idle with full AP three turns running | 115 | 2,043 men | 5.6% (50 are the Lone Wolf's rule-231 holds) |
| SPREAD: hits split, none fell, one could have | 169 | 3,835 rounds | 4.41% (104 chosen by the coin's 'worth more') |
| IDLE winded beside a foe | 716 | 17,063 turns | 4.2% (710 hold in a ring by rule 231(c); 6 wrong) |
| LOW SHOT: 10 or more under his best, not the team's man | 220 | 5,997 shots | 3.67% |
| IDLE: a gunman stood with a shot one walk away | 278 | 17,063 turns | 1.63% |
| NEVER: a melee man who never struck | 14 | 935 men | 1.5% |
| LONE: a walk alone into three | 38 | 4,681 walks | 0.81% |
| PARKED (COMBAT's J1) | 20 | 7,711 melee turns | 0.26% |
| zero: a blow left unstruck, a free hit for nothing, a gunman who never shot (1) | 0 to 1 | | |
Rule 201: the share on the named man among the blows of men who could strike him stands at round two's (84.7 at the gate's reading);
raw focus share 64.9, hurt and standing 1.10.

## 2. THE LONE WOLF STANDS OUT (the same as round two, now with the day-fifty curve beside it)
360 of his 825 turns end winded beside a foe (rule 231(c): he holds in the ring; Recover is his button, not AUTO's, rule 231), and 50 of
his 83 fights carry a streak. He wins 37 in 100, all against dogs half the time: the day-fifty curve (records/BOHEMIA_TUNING_THE_DAY_FIFTY_CURVE_10_26_26.md)
measured that two beasts beat him 62 times in 100; the watch's shape is a job the curve keeps off his board.

## 3. NEXT
The one pace (rule 274) is inside COMBAT's emergency row and not on main: the watch runs again on its sha, the same 600, before beside
after. The one pace changes WHEN an action plays, not WHICH: the expected after is the same counts; anything else is a finding.

## ROUTED
- COMBAT (for COMBAT TWO): round three identical to round two; the round-two rows stand. (NOTE.)
[bb the watch: Battle Brothers' AI never had to be counted because its fights were watched by a player; ours plays itself, so every
round counts its mistakes against the same 600 fights]
[analog horror: the same 600 fights, played again by a machine that does not remember the last time, make exactly the same mistakes]
