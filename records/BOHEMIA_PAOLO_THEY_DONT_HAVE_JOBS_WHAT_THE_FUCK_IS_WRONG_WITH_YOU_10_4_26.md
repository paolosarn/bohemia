# PAOLO 10/4: 'THEY DON'T HAVE JOBS, WHAT THE FUCK IS WRONG WITH YOU'

His words, verbatim (10/4, to the coordinator):

> "Hey bro, you told me to start talking to these chats combat 12 on the run one and two and the other ones he told me to run and they don't have jobs so what the fuck is wrong with you"

(combat 1 and 2, run 1 and 2, and the other chats the coordinator told him to run.)

## WHAT WENT WRONG (root cause, the coordinator's)
The lanes' go procedure pops the top OPEN row of their section. The coordinator had been writing the next round INSIDE a shipped row ('SHIPPED ..., ROUND FOUR OPEN (rule 71a)') and writing MODE lines that name ONE row ('THE ONE ROW: [rebuild]'; 'One row runs, [the demo's lines]'). When that one row shipped, the lane opened its section and found nothing OPEN. Proven in the commits of the same hour: WORDS 57de4732 'still one row, still not applied; checked, nothing invented'; RUN TWO 8291bb51 and 0c5128b1 spent its round trimming SOUNDS' VOTE sentences; COMBAT TWO did not commit at all; COMBAT's MODE still said one row after [rebuild] and [night you can read] had both shipped.

## THE FIX (rule 74)
A JOB IS AN OPEN ROW. Every running lane has at least three OPEN rows at the top of its section at every moment, its jump list, newest ruling first. 'Round N open' inside a SHIPPED row is not a job and is never written again. A MODE line never names one row; it says: the top OPEN row is the job, the OPEN rows under it are the jump list. When a lane ships its last OPEN row it writes the next one from its jump list before the reply ends. The coordinator's sweep ends with a machine check that every running lane has an OPEN row; PLUMBER owes the gate [open row gate].

Rows written this turn: COMBAT [your formation], [the enemy plays its part], [struck down]; COMBAT TWO [night boards], [more building types], [the wide board]; RUN TWO [one painted place], [settlement traits], [the roster screen]; WORDS [the fight's words], [the settlement's words], [the start screen's words]; SOUNDS [the map's sounds], [the settlement's sounds], [the narrator]; UI [settings and the slider], [the start screen's look], [the settlement's labels]; EYES [the settlement picture judged], [the fight at four screens judged]. RUN already had eight.
