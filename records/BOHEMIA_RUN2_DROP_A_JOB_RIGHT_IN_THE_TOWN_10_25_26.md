# RUN TWO: DROP A JOB RIGHT IN THE TOWN (10/25, rule 197, BUILT)

HIS WORDS (10/25): "to cancel a quest I have to go into the world map, click on the phone, and then go back into the city to pick up
another quest... this is dog shit."

## WHAT WAS TRUE
The only drop was the phone (WORLD's slices/bohemia_job_kinds.js drop: the standing cost, the words), and the phone lives on the map.
Swapping one job for another in the town he stood in was five steps and a trip.

## WHAT IS BUILT (slices/BOHEMIA_SETTLEMENT_SCREEN.html, __DROP_A_JOB_RIGHT_IN_THE_TOWN__)
1. **The board shows every job he is on at the top**: 'ON THE JOB: <title>', DROP, and its cost in the phone's own words ('Drop it:
   CHURCH thinks less of you: 50 to 40'). One tap on it, the elder asks once, one tap on 'Drop it': two taps from the board.
2. **A full board swaps**: a person's job, when he already carries all he can, says 'You are on a job for CHURCH: <title>. Drop it and
   take this one? (CHURCH thinks less of you: 40 to 30)' and 'Drop it and take this one' does both in that tap (the job this town gave
   goes first, else the oldest). Two taps from the board.
3. **It is the phone's own drop** (BohemiaJobKinds.drop and dropCost in the map's frame), so the cost is paid once, the standing moves
   exactly as the phone's, and the board says the phone's own line ('Dropped: ... Nobody pays, and CHURCH thinks less of you: 50 to
   40, neutral.'). The elder says it on the board; never a card. The settlement screen never closes; no map screen between.
4. The cap stays the map's (LOOP_MAX 2, rule 51); 197(c) reads 'one job at a time stays', which the game has never been: with two
   held, the board lists both and the swap gives up this town's first. One line for the coordinator.

## THE GATE
DROP A JOB RIGHT IN THE TOWN (gates/drop_a_job_in_the_town_gate.js) 6/0, on the demo through Church's own door by real taps: D1 the
held jobs on top with DROP and the phone's cost; D2 the drop in two taps (the job gone from the map, the town's standing -10 once, the
phone's line, the town never closed), phone and computer; D3 the swap in two taps on a full board (one out, the new one in, the
question first); nothing threw.
ALSO: THE LOOP PLAYS ON THE MAP's L4 re-aimed to the board's new '· 2 H' (WORLD's trip, 16c26e78), L4 and L5 green again; its L6/L7
behind them were never reached and fail because Church's first job is a patrol (WORLD's job kinds): RUN's loop, NOTE on its board.
